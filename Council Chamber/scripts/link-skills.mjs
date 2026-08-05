#!/usr/bin/env node
// link-skills.mjs
// Create the interface skill links that make shipped skills invocable.
//
// The Foundation ships every skill in Council Chamber/Skills/, but an AI
// interface discovers skills through its own adapter directory
// (.claude/skills/ for Claude Code, .codex/skills/ for Codex). Links are
// local filesystem objects that git does not deliver, so a fresh clone has
// none. This script creates all of them in one pass.
//
// It is the other half of check-skill-mirrors.mjs: this one creates what
// that one verifies.
//
// Per skill, one of four outcomes:
//   linked        a new link was created
//   already       a working link was found and left alone
//   relinked      a broken link was removed and recreated
//   present       a real directory (a copy, not a link) was found and left
//                 alone, because it may carry local changes
//
// On Windows the links are directory junctions, which need no administrator
// rights. On Mac and Linux they are symlinks.
//
// Safe to run any number of times. After adding a new skill, run it again
// and only the new skill is linked.
//
// Vault root resolution: SOVEREIGN_VAULT_ROOT env var if set, otherwise the
// working directory.
//
// Usage:
//   node "Council Chamber/scripts/link-skills.mjs"           links .claude/skills
//   node "Council Chamber/scripts/link-skills.mjs" --codex   also links .codex/skills
//
// Exit codes:
//   0  every skill is linked or intentionally left in place
//   1  something failed. Read the FAIL lines.

import { readdirSync, mkdirSync, lstatSync, rmSync, symlinkSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const VAULT_ROOT = resolve(process.env.SOVEREIGN_VAULT_ROOT || process.cwd());
const CANONICAL_DIR = join(VAULT_ROOT, 'Council Chamber', 'Skills');
const LINK_TYPE = process.platform === 'win32' ? 'junction' : 'dir';

const mirrorRoots = [join(VAULT_ROOT, '.claude', 'skills')];
if (process.argv.includes('--codex')) {
  mirrorRoots.push(join(VAULT_ROOT, '.codex', 'skills'));
}

function canonicalSkillNames() {
  let entries;
  try {
    entries = readdirSync(CANONICAL_DIR, { withFileTypes: true });
  } catch {
    return null;
  }
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .filter((e) => existsSync(join(CANONICAL_DIR, e.name, 'SKILL.md')))
    .map((e) => e.name);
}

function linkOne(mirrorRoot, name) {
  const linkPath = join(mirrorRoot, name);
  const target = join(CANONICAL_DIR, name);
  const readableThrough = () => existsSync(join(linkPath, 'SKILL.md'));

  let stat = null;
  try {
    stat = lstatSync(linkPath);
  } catch {
    // nothing there yet
  }

  if (stat) {
    if (readableThrough()) {
      return stat.isSymbolicLink() ? 'already' : 'present';
    }
    if (stat.isSymbolicLink()) {
      rmSync(linkPath);
      symlinkSync(target, linkPath, LINK_TYPE);
      if (!readableThrough()) throw new Error(`relink created but SKILL.md is not readable through it`);
      return 'relinked';
    }
    throw new Error(`a non-link entry exists at ${linkPath} and SKILL.md is not readable through it`);
  }

  symlinkSync(target, linkPath, LINK_TYPE);
  if (!readableThrough()) throw new Error(`link created but SKILL.md is not readable through it`);
  return 'linked';
}

const names = canonicalSkillNames();
if (names === null || names.length === 0) {
  console.error(`FAIL no canonical skills found at ${CANONICAL_DIR}`);
  console.error('Run this from the vault root, or set SOVEREIGN_VAULT_ROOT.');
  process.exit(1);
}

console.log('Skill Linker');
console.log('------------');

let failures = 0;
const counts = { linked: 0, already: 0, relinked: 0, present: 0 };

for (const mirrorRoot of mirrorRoots) {
  mkdirSync(mirrorRoot, { recursive: true });
  console.log(mirrorRoot);
  for (const name of names) {
    try {
      const outcome = linkOne(mirrorRoot, name);
      counts[outcome]++;
      console.log(`  ${outcome.padEnd(9)} ${name}`);
    } catch (e) {
      failures++;
      console.log(`  FAIL      ${name}: ${e.message}`);
    }
  }
}

console.log('-'.repeat(60));
console.log(
  `skills=${names.length} linked=${counts.linked} already=${counts.already} relinked=${counts.relinked} present=${counts.present} failed=${failures}`
);

if (failures > 0) {
  console.log('At least one skill did not link. Read the FAIL lines above.');
  process.exit(1);
}
console.log('Every shipped skill is reachable by the interface.');
console.log('Verify any time with: node "Council Chamber/scripts/check-skill-mirrors.mjs"');
process.exit(0);
