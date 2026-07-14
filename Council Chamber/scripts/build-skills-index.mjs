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
      // Deliberately undefined when frontmatter is silent, so the resolver below
      // can tell "the skill said operational" apart from "the skill said nothing".
      tier: fm.tier || undefined,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const existing = existsSync(INDEX_PATH)
  ? readFileSync(INDEX_PATH, 'utf8').replace(/\r\n/g, '\n')
  : '';

// Preserve what a human put here. Two things are read back off the existing
// index: the prose appended after the "(status, tier: x)" cap, and the tier
// itself.
const curated = new Map();
const priorTier = new Map();
for (const line of existing.split('\n')) {
  const m = line.match(/^- (.+?) \((?:active|draft|deprecated)[^)]*?(?:tier:\s*(\w+))?\)(.*)$/);
  if (!m) continue;
  if (m[2]) priorTier.set(m[1], m[2]);
  if (m[3] && m[3].trim()) curated.set(m[1], m[3]);
}

// Tier resolution, and the order is the whole point.
//
// Frontmatter wins when it speaks, because that is what the skill declares
// about itself and what the AI interface reads. When frontmatter is SILENT, the
// existing index value is preserved rather than defaulted.
//
// The first cut of this script defaulted a silent tier to "operational" and
// quietly demoted two skills a human had curated as foundational. A generator
// that invents a value where its source said nothing is not regenerating an
// index, it is overwriting knowledge with a guess. Absence of data is not data.
const roster = skills
  .map((s) => {
    const tier = s.tier || priorTier.get(s.name) || 'operational';
    return `- ${s.name} (${s.status}, tier: ${tier})${curated.get(s.name) || ''}`;
  })
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
