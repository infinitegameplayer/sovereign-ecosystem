#!/usr/bin/env node
// check-skill-citations.mjs
// Every document that tells a Sovereign to open a skill file must name a skill
// file that exists.
//
// This guard was written after v3.11.0, when two Getting Started sessions were
// found pointing the reader at
// `Council Chamber/Skills/Pending Plan Implementation/SKILL.md`, a path that
// left the template at v2.4.0 and never came back. Session 6 is the session
// that teaches the Pending Plan mechanism, so the onboarding sequence taught
// the mechanism and cited a file that was not in the box. It sat that way
// across eleven releases.
//
// validate-doc-claims.mjs could already find this and flagged it the moment it
// was aimed at the file. Nothing ever aimed it. A checker that exists and runs
// nowhere is indistinguishable from a checker that does not exist, so this
// script is the narrow, always-on aim: one class of citation, checked on every
// push, with no allowlist to drift.
//
// Scope is deliberately narrow so the guard has no false positives and needs no
// exception list. Only backticked paths of the exact shape
// `Council Chamber/Skills/<Name>/SKILL.md` are checked. Tokens carrying glob or
// placeholder characters (* < > [ ] { }) are documentation patterns rather than
// citations and are skipped. Runtime-created files under a skill directory are
// out of scope because they are absent by design on a fresh clone.
//
// Usage:
//   node "Council Chamber/scripts/check-skill-citations.mjs"
//   node "Council Chamber/scripts/check-skill-citations.mjs" --positive-control
//
// Exit codes:
//   0  every concrete skill citation resolves
//   1  at least one citation names a skill file that is not in the repo
//
// Vault root resolution: SOVEREIGN_VAULT_ROOT if set, otherwise the working
// directory, matching every other script here.

import { existsSync, readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';

const VAULT_ROOT = process.env.SOVEREIGN_VAULT_ROOT || process.cwd();

// A citation of the exact shape `Council Chamber/Skills/<Name>/SKILL.md`.
const CITATION_RE = /`(Council Chamber\/Skills\/[^`]+\/SKILL\.md)`/g;
const PATTERN_CHARS = /[*<>[\]{}]/;

// Returns the list of files to scan. Tracked content only: untracked local
// files are not what a recipient receives. .github/ is excluded because UPDATES
// packages and the CHANGELOG are history and cite paths that were correct when
// written.
function filesToScan(root) {
  const out = execSync('git ls-files "*.md" "*.txt"', { cwd: root, encoding: 'utf8' });
  return out
    .trim()
    .split('\n')
    .filter((f) => f && !f.startsWith('.github/'));
}

// The whole check, factored out so the positive control can run it against a
// fixture rather than against a second copy of the logic. A control that tests
// its own reimplementation proves nothing about the shipped path.
function findBrokenCitations(root, files) {
  const broken = [];
  for (const file of files) {
    let text;
    try {
      text = readFileSync(join(root, file), 'utf8');
    } catch {
      continue;
    }
    CITATION_RE.lastIndex = 0;
    let match;
    while ((match = CITATION_RE.exec(text))) {
      const cited = match[1];
      if (PATTERN_CHARS.test(cited)) continue;
      if (!existsSync(join(root, cited))) {
        broken.push({ file, cited });
      }
    }
  }
  return broken;
}

// Prove the checker can fail before trusting it when it passes. A fixture repo
// gets one citation that resolves and one that does not. The checker must find
// exactly the broken one. If it reports clean here, it is incapable of
// reporting anything, and a green run on the real repo would be a mood.
function positiveControl() {
  const dir = mkdtempSync(join(tmpdir(), 'skill-citations-'));
  let failures = 0;
  const check = (label, condition) => {
    console.log(`  ${condition ? 'ok  ' : 'FAIL'} ${label}`);
    if (!condition) failures++;
  };

  try {
    execSync('git init -q', { cwd: dir });
    execSync('git config user.email fixture@example.com', { cwd: dir });
    execSync('git config user.name Fixture', { cwd: dir });

    const real = join(dir, 'Council Chamber', 'Skills', 'Real Skill');
    mkdirSync(real, { recursive: true });
    writeFileSync(join(real, 'SKILL.md'), '# Real Skill\n');

    const doc = join(dir, 'Getting Started', 'Session X.md');
    mkdirSync(dirname(doc), { recursive: true });
    writeFileSync(
      doc,
      [
        'Open these:',
        '- `Council Chamber/Skills/Real Skill/SKILL.md`',
        '- `Council Chamber/Skills/Absent Skill/SKILL.md`',
        '- `Council Chamber/Skills/[Name]/SKILL.md`',
        '',
      ].join('\n')
    );

    execSync('git add -A', { cwd: dir });

    const broken = findBrokenCitations(dir, filesToScan(dir));

    check('the absent skill is reported', broken.some((b) => b.cited.includes('Absent Skill')));
    check('the real skill is not reported', !broken.some((b) => b.cited.includes('Real Skill')));
    check('the placeholder citation is skipped', !broken.some((b) => b.cited.includes('[Name]')));
    check('exactly one citation is flagged', broken.length === 1);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }

  console.log('-'.repeat(70));
  if (failures) {
    console.log(`pass=${4 - failures} fail=${failures}`);
    console.log('The checker did not behave as specified. It cannot be trusted when it passes.');
    return 1;
  }
  console.log('pass=4 fail=0');
  console.log('The checker finds a broken citation, ignores a good one and skips a pattern.');
  return 0;
}

function main() {
  if (process.argv.includes('--positive-control')) {
    return positiveControl();
  }

  const files = filesToScan(VAULT_ROOT);
  const broken = findBrokenCitations(VAULT_ROOT, files);

  console.log('Skill Citation Check');
  console.log('--------------------');
  console.log(`Documents scanned: ${files.length}`);

  if (!broken.length) {
    console.log('Every concrete skill citation resolves to a shipped SKILL.md.');
    return 0;
  }

  for (const b of broken) {
    console.log(`BROKEN  ${b.cited}`);
    console.log(`        cited in ${b.file}`);
  }
  console.log('');
  console.log(`${broken.length} citation(s) name a skill file this repo does not ship.`);
  console.log('Either restore the skill, or repoint the citation at where the skill now lives.');
  return 1;
}

process.exit(main());
