#!/usr/bin/env node
// doctrine-references.mjs
// Sovereign Ecosystem Doctrine Inbound-Reference Counter. For every doctrine
// artifact (codices, protocols, skills, governance), counts how many ACTIVE
// vault files wikilink to it. Grounds a "zero-inbound-reference doctrine"
// input for doctrine lifecycle review, so orphan nomination rests on a
// deterministic count rather than a hand grep.
//
// READ-ONLY: never writes, edits or deletes. Output is an analysis list.
//
// What counts as a reference:
//   Any Obsidian wikilink [[target]] / [[target|alias]] / [[target#heading]]
//   in an active (non-archive) .md file whose target resolves, by basename, to
//   the artifact. Self-links are ignored. The referrer list is retained so a
//   reader can see WHO points at an artifact (for example: only its index).
//
// Active scope excludes: Vault (Archive), .git, node_modules, .trash,
//   .obsidian, .runtime, .claude, .codex. The whole vault is scanned for
//   referrers, not only the doctrine layers, since anything active may point
//   at doctrine.
//
// Vault root resolution: SOVEREIGN_VAULT_ROOT env var if set, otherwise the
// parent of this script's directory (scripts live in <vault>/scripts/).
//
// Usage:
//   node scripts/doctrine-references.mjs            Human report: orphans, index-only, low-inbound.
//   node scripts/doctrine-references.mjs --all      Also list every artifact with its count.
//   node scripts/doctrine-references.mjs --json     Emit the full dataset as JSON.
//   node scripts/doctrine-references.mjs --layer codices|protocols|skills|governance
//
// Exit codes:
//   0  Ran successfully.
//   1  Usage error or unrecoverable failure.

import { readdir, readFile } from 'node:fs/promises';
import { join, basename, relative, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const VAULT_ROOT = process.env.SOVEREIGN_VAULT_ROOT || resolve(SCRIPT_DIR, '..');

const CC = join(VAULT_ROOT, 'Council Chamber');
const SKIP_DIRS = new Set(['.git', 'node_modules', '.trash', '.obsidian', '.runtime', '.claude', '.codex']);
const ARCHIVE_PREFIX = 'Vault (Archive)';

const LAYERS = [
  { key: 'codices', label: 'Codices', dir: join(CC, 'Codices'), mode: 'all-md' },
  { key: 'protocols', label: 'Protocols', dir: join(CC, 'Protocols'), mode: 'all-md' },
  { key: 'skills', label: 'Skills', dir: join(CC, 'Skills'), mode: 'skill-md' },
  { key: 'governance', label: 'Governance', dir: join(CC, 'Governance'), mode: 'all-md' },
];

// Index / register files: an artifact referenced only by these is effectively
// orphaned in practice (a listing points at it, nothing uses it).
const INDEX_HINTS = ['index', 'register', 'registry', 'constellation', 'knowledge map', 'skills index', 'codices index'];

function isIndexName(name) {
  const n = name.toLowerCase();
  return INDEX_HINTS.some((h) => n.includes(h));
}

async function walk(dir, { skillOnly = false } = {}) {
  const out = [];
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      out.push(...(await walk(join(dir, e.name), { skillOnly })));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      if (skillOnly && e.name !== 'SKILL.md') continue;
      out.push(join(dir, e.name));
    }
  }
  return out;
}

// Resolve an artifact to the label a wikilink would use to reach it.
// For all-md artifacts that is the file basename without extension.
// For skills the folder name is the human wikilink target as well as SKILL.
function artifactKeys(absPath, mode) {
  const base = basename(absPath, '.md');
  const keys = new Set([base.toLowerCase()]);
  if (mode === 'skill-md') {
    // Skills are linked as [[.../Skill Name/SKILL]] or [[Skill Name]].
    const parts = absPath.replace(/\\/g, '/').split('/');
    const folder = parts[parts.length - 2];
    if (folder) keys.add(folder.toLowerCase());
  }
  return keys;
}

// Extract wikilink targets from content. Returns array of lowercased basenames.
function extractWikilinkTargets(content) {
  const targets = [];
  const rx = /\[\[([^\]]+)\]\]/g;
  let m;
  while ((m = rx.exec(content)) !== null) {
    let raw = m[1];
    const pipe = raw.indexOf('|');
    if (pipe !== -1) raw = raw.slice(0, pipe);
    const hash = raw.indexOf('#');
    if (hash !== -1) raw = raw.slice(0, hash);
    raw = raw.trim();
    if (!raw) continue;
    const segs = raw.replace(/\\/g, '/').split('/');
    let last = segs[segs.length - 1].toLowerCase();
    // A link that ends at .../SKILL means the skill folder is the real target.
    if (last === 'skill' && segs.length >= 2) last = segs[segs.length - 2].toLowerCase();
    targets.push(last);
  }
  return targets;
}

async function main() {
  const jsonMode = process.argv.includes('--json');
  const showAll = process.argv.includes('--all');
  const layerIdx = process.argv.indexOf('--layer');
  const layerFilter = layerIdx !== -1 ? process.argv[layerIdx + 1] : null;

  // Build the artifact registry.
  const artifacts = [];
  for (const layer of LAYERS) {
    const files = await walk(layer.dir, { skillOnly: layer.mode === 'skill-md' });
    for (const abs of files) {
      const rel = relative(VAULT_ROOT, abs).replace(/\\/g, '/');
      artifacts.push({
        layer: layer.key,
        path: rel,
        display: layer.mode === 'skill-md' ? rel.split('/').slice(-2).join('/') : basename(rel),
        keys: artifactKeys(abs, layer.mode),
        inbound: 0,
        referrers: [],
        nonIndexReferrers: [],
      });
    }
  }

  // Map each key to the artifacts that own it (collision-aware).
  const keyToArtifacts = new Map();
  for (const a of artifacts) {
    for (const k of a.keys) {
      if (!keyToArtifacts.has(k)) keyToArtifacts.set(k, []);
      keyToArtifacts.get(k).push(a);
    }
  }

  // Scan every active .md in the vault for wikilinks, plus the trust-anchor
  // AGENTS.md / CLAUDE.md files at the vault root. The vault walk skips
  // .claude (its skills subtree may be junction symlinks that would
  // double-count), so those root files are added by hand: they wikilink a
  // large share of load-bearing doctrine and their omission otherwise reads
  // active codices as false orphans.
  const allActive = await walk(VAULT_ROOT, {});
  for (const extra of [join('.claude', 'CLAUDE.md'), 'CLAUDE.md', 'AGENTS.md']) {
    const abs = join(VAULT_ROOT, extra);
    try {
      await readFile(abs, 'utf8');
      allActive.push(abs);
    } catch {
      // absent is fine
    }
  }
  for (const abs of allActive) {
    const rel = relative(VAULT_ROOT, abs).replace(/\\/g, '/');
    if (rel.startsWith(ARCHIVE_PREFIX)) continue;
    let content = '';
    try {
      content = await readFile(abs, 'utf8');
    } catch {
      continue;
    }
    const referrerBase = basename(rel);
    const targets = extractWikilinkTargets(content);
    const seenForThisFile = new Set();
    for (const t of targets) {
      const owners = keyToArtifacts.get(t);
      if (!owners) continue;
      for (const owner of owners) {
        if (owner.path === rel) continue; // self reference
        const dedupKey = owner.path + ' ' + rel;
        if (seenForThisFile.has(dedupKey)) continue;
        seenForThisFile.add(dedupKey);
        owner.inbound += 1;
        owner.referrers.push(rel);
        if (!isIndexName(referrerBase)) owner.nonIndexReferrers.push(rel);
      }
    }
  }

  let set = artifacts;
  if (layerFilter) set = set.filter((a) => a.layer === layerFilter);

  if (jsonMode) {
    console.log(JSON.stringify(set.map((a) => ({
      layer: a.layer, path: a.path, inbound: a.inbound,
      nonIndexInbound: a.nonIndexReferrers.length,
      referrers: a.referrers,
    })), null, 2));
    return;
  }

  const orphans = set.filter((a) => a.inbound === 0).sort((a, b) => a.path.localeCompare(b.path));
  const indexOnly = set.filter((a) => a.inbound > 0 && a.nonIndexReferrers.length === 0).sort((a, b) => a.path.localeCompare(b.path));
  const low = set.filter((a) => a.nonIndexReferrers.length >= 1 && a.nonIndexReferrers.length <= 2).sort((a, b) => a.nonIndexReferrers.length - b.nonIndexReferrers.length || a.path.localeCompare(b.path));

  console.log('Sovereign Ecosystem Doctrine Inbound-Reference Counter');
  console.log('=========================================================');
  console.log(`Artifacts scanned: ${set.length}${layerFilter ? ` (layer: ${layerFilter})` : ''}. Active referrer files scanned across the whole vault.`);
  console.log('');
  console.log(`ORPHANS (0 inbound wikilinks): ${orphans.length}`);
  for (const a of orphans) console.log(`  [${a.layer}] ${a.display}`);
  console.log('');
  console.log(`INDEX-ONLY (referenced only by an index/register): ${indexOnly.length}`);
  for (const a of indexOnly) console.log(`  [${a.layer}] ${a.display}  (inbound ${a.inbound}, all from index/register)`);
  console.log('');
  console.log(`LOW INBOUND (1-2 non-index referrers): ${low.length}`);
  for (const a of low) console.log(`  [${a.layer}] ${a.display}  (${a.nonIndexReferrers.length} non-index: ${a.nonIndexReferrers.slice(0, 3).join(', ')})`);

  if (showAll) {
    console.log('');
    console.log('ALL ARTIFACTS (by inbound, ascending):');
    for (const a of [...set].sort((x, y) => x.inbound - y.inbound || x.path.localeCompare(y.path))) {
      console.log(`  ${String(a.inbound).padStart(3)}  (${String(a.nonIndexReferrers.length).padStart(3)} non-index)  [${a.layer}] ${a.display}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
