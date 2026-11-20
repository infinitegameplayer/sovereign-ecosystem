#!/usr/bin/env node
// build-skills-index.mjs
// Regenerate Council Chamber/Skills/Skills Index.md from SKILL.md frontmatter.
//
// This exists because an index maintained by hand drifts the moment someone is
// in a hurry, and a skill missing from the index is a skill the AI interface
// never discovers. It is present but unreachable, which is the worst of both.
//
// It shipped after exactly that happened here: the Ecosystem Update Check skill
// sat on disk, absent from the index, for an unknown stretch. The hook that was
// supposed to prevent this (post-write-index-regen.sh) had no script to call,
// so it logged "trigger detected" and did nothing, every time, forever. A hook
// that reports it noticed is not a hook that acted.
//
// WHAT IT REBUILDS: the roster under "## Skills". One line per skill directory,
// carrying name, status and tier from that skill's SKILL.md frontmatter.
//
// WHAT IT PRESERVES: any curated prose a human appended to a skill's line, and
// every section from the first "###" heading onward (graduation notes,
// distribution notes, anything else). The roster is generated. The commentary
// is yours. A generator that eats human writing gets turned off within a week.
//
// Usage:
//   node "Council Chamber/scripts/build-skills-index.mjs"          rewrite in place
//   node "Council Chamber/scripts/build-skills-index.mjs" --check  exit 1 if drifted
//
// Run from the vault root. Exit 0 clean, 1 drifted (--check), 2 usage error.

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';

const SKILLS_DIR = path.join('Council Chamber', 'Skills');
const INDEX_PATH = path.join(SKILLS_DIR, 'Skills Index.md');
const CHECK = process.argv.includes('--check');

// A mistyped --check must not fall through to the write.
const unknown = process.argv.slice(2).filter((a) => a !== '--check');
if (unknown.length) {
  console.error(`build-skills-index: unknown argument ${unknown.join(' ')}. Use --check, or no argument to rebuild.`);
  process.exit(2);
}

if (!existsSync(SKILLS_DIR)) {
  console.error(`build-skills-index: no ${SKILLS_DIR} here. Run from the vault root.`);
  process.exit(2);
}

function frontmatter(text) {
  const norm = text.replace(/\r\n/g, '\n');
  const m = norm.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

// Every skill directory holding a SKILL.md. The directory name is the display
// name, which is what the index has always used.
const skills = readdirSync(SKILLS_DIR)
  .filter((e) => {
    const p = path.join(SKILLS_DIR, e);
    return statSync(p).isDirectory() && existsSync(path.join(p, 'SKILL.md'));
  })
  .map((name) => {
    const fm = frontmatter(readFileSync(path.join(SKILLS_DIR, name, 'SKILL.md'), 'utf8'));
    return {
      name,
      status: fm.status || 'draft',
      tier: fm.tier || '',
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// A missing or off-vocabulary tier stops the build, in both modes, with every
// such skill named, and nothing is written (v3.25.0). Until then a silent tier
// was filled from the old index or defaulted to operational, and both are
// guesses: a skill's tier is what its own SKILL.md declares, and nothing else.
// post-write-index-regen.sh delivers this refusal to the session, so a new
// skill missing its tier is named at the moment it is written, never left
// quietly out of the index.
const TIERS = new Set(['foundational', 'operational']);
const badTier = skills.filter((s) => !TIERS.has(s.tier));
if (badTier.length) {
  for (const s of badTier) {
    console.error(`Skills Index: ${s.name}/SKILL.md tier is ${s.tier ? `"${s.tier}"` : 'missing'}. Add "tier: foundational" or "tier: operational" to its frontmatter.`);
  }
  console.error(`Skills Index: REFUSED, ${badTier.length} skill(s) without a valid tier. Nothing written.`);
  process.exit(1);
}

const existing = existsSync(INDEX_PATH)
  ? readFileSync(INDEX_PATH, 'utf8').replace(/\r\n/g, '\n')
  : '';

// Preserve what a human put here: the prose appended after the
// "(status, tier: x)" cap is read back off the existing index.
const curated = new Map();
for (const line of existing.split('\n')) {
  const m = line.match(/^- (.+?) \((?:active|draft|deprecated)[^)]*?\)(.*)$/);
  if (!m) continue;
  if (m[2] && m[2].trim()) curated.set(m[1], m[2]);
}

// The tier is the one each SKILL.md declares, checked above. The first cut of
// this script defaulted a silent tier to "operational" and quietly demoted two
// skills a human had curated as foundational; the second preserved the old
// index value instead. Absence of data is not data, so a silent tier now stops
// the build rather than being filled from anywhere.
const roster = skills
  .map((s) => `- ${s.name} (${s.status}, tier: ${s.tier})${curated.get(s.name) || ''}`)
  .join('\n');

// Split the file: everything before "## Skills", then the generated roster, then
// everything from the first "###" subsection onward.
const headMatch = existing.match(/^([\s\S]*?^## Skills\n)/m);
const tailMatch = existing.match(/^(### [\s\S]*)$/m);

const head = headMatch ? headMatch[1] : '# Skills Index\n\n## Skills\n';
const tail = tailMatch ? '\n' + tailMatch[1] : '';

const rebuilt = `${head}${roster}\n${tail}`.replace(/\n{3,}/g, '\n\n');

if (CHECK) {
  const drifted = rebuilt.trim() !== existing.trim();
  if (drifted) {
    console.error('Skills Index has DRIFTED from the SKILL.md files on disk.');
    const listed = new Set(
      existing.split('\n').map((l) => (l.match(/^- (.+?) \(/) || [])[1]).filter(Boolean)
    );
    for (const s of skills) {
      if (!listed.has(s.name)) console.error(`  MISSING from the index: ${s.name}`);
    }
    for (const l of listed) {
      if (!skills.some((s) => s.name === l)) console.error(`  in the index, absent on disk: ${l}`);
    }
    console.error('\nRun without --check to rebuild it.');
    process.exit(1);
  }
  console.log(`Skills Index is in sync (${skills.length} skills).`);
  process.exit(0);
}

writeFileSync(INDEX_PATH, rebuilt, 'utf8');
console.log(`Skills Index rebuilt: ${skills.length} skills.`);
