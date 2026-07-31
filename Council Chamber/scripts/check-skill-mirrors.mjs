#!/usr/bin/env node
// check-skill-mirrors.mjs
// Verify that .claude/skills/ and .codex/skills/ mirror the canonical
// Council Chamber/Skills/[Name]/SKILL.md files without drift.
//
// Three acceptable patterns per mirror entry:
//   1. symlink to canonical SKILL.md (preferred default)
//   2. pointer file: small file referencing the canonical path via wikilink
//   3. match-byte-for-byte copy (tolerated, but symlink is better)
//
// Failure modes reported:
//   - regular file whose content differs from canonical (DRIFT)
//   - pointer file exceeding byte threshold or missing canonical reference
//   - symlink with a broken target
//   - entry with no canonical SKILL.md at all
//   - canonical skill with no mirror entry at all (MISSING MIRROR), a skill
//     the AI interface can never invoke. Caught by the reverse-direction pass:
//     walk canonical, ask each mirror root whether it has an entry. The
//     forward pass alone seeds itself from readdir(mirrorRoot) and can never
//     see a skill that has zero entries anywhere.
//
// Vault root resolution: SOVEREIGN_VAULT_ROOT env var if set, otherwise the
// working directory.
//
// Exit codes:
//   0  no drift detected
//   1  drift or broken mirror detected
//
// Usage:
//   node "Council Chamber/scripts/check-skill-mirrors.mjs" [--fix-pointers]
//   --fix-pointers: rewrite drifted full-copy mirrors as pointer files (NOT
//     executed by default; flag exists for future automation, manual invocation
//     required because rewriting adapter content is a governance action)

import { readdir, readFile, lstat, readlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const VAULT_ROOT = process.env.SOVEREIGN_VAULT_ROOT || process.cwd();
const CANONICAL_DIR = join(VAULT_ROOT, 'Council Chamber', 'Skills');
const MIRROR_ROOTS = [join(VAULT_ROOT, '.claude', 'skills'), join(VAULT_ROOT, '.codex', 'skills')];
const POINTER_BYTE_THRESHOLD = 500; // a pointer file should be under ~500 bytes

async function readCanonical(skillName) {
  const path = join(CANONICAL_DIR, skillName, 'SKILL.md');
  try { return await readFile(path, 'utf8'); }
  catch { return null; }
}

function looksLikePointer(content, skillName) {
  if (content.length > POINTER_BYTE_THRESHOLD) return false;
  return /Canonical[:\s]*\[\[[^\]]*Skills[^\]]*SKILL[^\]]*\]\]/i.test(content);
}

async function checkMirrorEntry(mirrorRoot, entry) {
  const mirrorPath = join(mirrorRoot, entry, 'SKILL.md');
  const skillName = entry;
  const report = { mirrorRoot, skillName, mirrorPath, kind: null, drift: false, issue: null };

  let stat;
  try { stat = await lstat(mirrorPath); }
  catch { report.issue = 'mirror SKILL.md missing'; return report; }

  if (stat.isSymbolicLink()) {
    report.kind = 'symlink';
    try {
      const target = await readlink(mirrorPath);
      const resolvedTarget = resolve(mirrorRoot, entry, target);
      if (!existsSync(resolvedTarget)) {
        report.drift = true;
        report.issue = `broken symlink to ${target}`;
      }
    } catch (e) {
      report.drift = true;
      report.issue = `symlink read failed: ${e.message}`;
    }
    return report;
  }

  const canonical = await readCanonical(skillName);
  const mirror = await readFile(mirrorPath, 'utf8');

  if (canonical === null) {
    report.kind = 'orphaned';
    report.drift = true;
    report.issue = `no canonical SKILL.md at ${join(CANONICAL_DIR, skillName, 'SKILL.md')}`;
    return report;
  }

  if (looksLikePointer(mirror, skillName)) {
    report.kind = 'pointer';
    return report;
  }

  if (mirror === canonical) {
    report.kind = 'exact-copy';
    return report;
  }

  const mirrorNorm = mirror.replace(/\r\n/g, '\n');
  const canonicalNorm = canonical.replace(/\r\n/g, '\n');
  if (mirrorNorm === canonicalNorm) {
    report.kind = 'copy-with-crlf-diff';
    return report;
  }

  report.kind = 'full-copy-drifted';
  report.drift = true;
  report.issue = `content diverges from canonical (${mirror.length} bytes vs ${canonical.length} bytes)`;
  return report;
}

async function checkMirrorRoot(mirrorRoot) {
  const results = [];
  let entries;
  try {
    entries = await readdir(mirrorRoot, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const e of entries) {
    if (!e.isDirectory() && !e.isSymbolicLink()) continue;
    if (e.name.startsWith('.')) continue;
    results.push(await checkMirrorEntry(mirrorRoot, e.name));
  }
  return results;
}

// Reverse-direction pass. Walks canonical, not the mirror roots, so a skill
// with zero mirror entries anywhere is not invisible to the scan. This is
// the pass that catches what checkMirrorRoot structurally cannot: a canonical
// skill readdir(mirrorRoot) never surfaces because there is nothing to list.
async function readCanonicalSkillNames() {
  let entries;
  try {
    entries = await readdir(CANONICAL_DIR, { withFileTypes: true });
  } catch {
    return [];
  }
  const names = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (e.name.startsWith('.')) continue;
    names.push(e.name);
  }
  return names;
}

// A mirror root that does not exist on disk is a runtime this vault does not
// use, never drift. Linking skills into an AI interface is a step the reader
// performs in Session 1, and a vault that has only ever run one interface will
// never grow the other's directory.
async function existingMirrorRoots() {
  const found = [];
  for (const root of MIRROR_ROOTS) {
    try {
      await lstat(root);
      found.push(root);
    } catch {
      // absent, so nothing to compare against
    }
  }
  return found;
}

async function checkCanonicalCoverage(roots) {
  const results = [];
  const skillNames = await readCanonicalSkillNames();
  for (const skillName of skillNames) {
    for (const mirrorRoot of roots) {
      const mirrorPath = join(mirrorRoot, skillName);
      let exists = true;
      try {
        await lstat(mirrorPath);
      } catch {
        exists = false;
      }
      if (exists) continue;
      results.push({
        mirrorRoot,
        skillName,
        mirrorPath: join(mirrorPath, 'SKILL.md'),
        kind: 'missing-mirror',
        drift: true,
        issue: `canonical skill has no entry at all under ${mirrorRoot}`,
      });
    }
  }
  return results;
}

async function main() {
  // Day one. A fresh clone carries the canonical skills and no mirrors at all,
  // because a link is a local filesystem object that git does not deliver. The
  // reader creates them in Session 1. Reporting that state as drift means the
  // first thing this template tells a new reader is that it is broken, and a
  // check nobody trusts is a check nobody reads.
  const roots = await existingMirrorRoots();
  if (roots.length === 0) {
    console.log('Skill Mirror Drift Check');
    console.log('------------------------');
    const skillNames = await readCanonicalSkillNames();
    console.log(`Canonical skills on disk: ${skillNames.length}`);
    console.log('No AI interface skill directory exists yet, so there is');
    console.log('nothing to compare against. This is the expected state of a');
    console.log('fresh vault. Getting Started, Session 1 covers linking them.');
    process.exit(0);
  }

  const all = [];
  for (const root of roots) {
    const rootResults = await checkMirrorRoot(root);
    all.push(...rootResults);
  }
  all.push(...(await checkCanonicalCoverage(roots)));

  const drifted = all.filter(r => r.drift);
  const summary = {
    symlink: 0,
    pointer: 0,
    'exact-copy': 0,
    'copy-with-crlf-diff': 0,
    'full-copy-drifted': 0,
    orphaned: 0,
    'missing-mirror': 0,
  };
  for (const r of all) if (summary[r.kind] !== undefined) summary[r.kind]++;

  console.log('Skill Mirror Drift Check');
  console.log('------------------------');
  console.log(`Total entries scanned: ${all.length}`);
  for (const [kind, count] of Object.entries(summary)) {
    if (count > 0) console.log(`  ${kind}: ${count}`);
  }
  console.log('');

  if (drifted.length === 0) {
    console.log('No drift detected.');
    process.exit(0);
  }

  console.log(`DRIFT DETECTED (${drifted.length}):`);
  for (const r of drifted) {
    console.log(`  ${r.mirrorPath} [${r.kind}]: ${r.issue}`);
  }
  process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
