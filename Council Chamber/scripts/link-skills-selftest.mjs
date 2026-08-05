#!/usr/bin/env node
// link-skills-selftest.mjs
// Positive control on the skill linker.
//
// The governing law of this repo: a guard is verified by firing, never by
// reading. A linker that has never been proven to create a working link is
// not known to create one, and the failure case has to fail or the success
// cases prove nothing.
//
// Five cases, each against a fixture vault built in a temp directory:
//   1. fresh vault: every skill gets linked and SKILL.md reads through the link
//   2. second run: idempotent, nothing recreated, still exit 0
//   3. the real checker calls the linked fixture clean, so the creator and
//      the verifier agree about what a healthy vault looks like
//   4. broken link: repaired in place, readable afterward
//   5. no canonical skills at all: the linker must fail loudly, never quietly
//
// Usage:
//   node "Council Chamber/scripts/link-skills-selftest.mjs"
//
// Exit codes:
//   0  every case behaved as specified.
//   1  at least one case misbehaved. Read the FAIL lines.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LINKER = path.join(HERE, 'link-skills.mjs');
const CHECKER = path.join(HERE, 'check-skill-mirrors.mjs');
const LINK_TYPE = process.platform === 'win32' ? 'junction' : 'dir';

function skill(root, name, body) {
  const dir = path.join(root, 'Council Chamber', 'Skills', name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'SKILL.md'), body, 'utf8');
}

function run(script, root) {
  return spawnSync(process.execPath, [script], {
    encoding: 'utf8',
    env: { ...process.env, SOVEREIGN_VAULT_ROOT: root },
  });
}

let pass = 0;
let fail = 0;
const lines = [];

function record(name, ok, detail) {
  if (ok) {
    pass++;
    lines.push(`  ok   ${name}`);
  } else {
    fail++;
    lines.push(`  FAIL ${name}  <-- ${detail}`);
  }
}

// Cases 1 through 4 share one fixture vault so the run history accumulates.
{
  const root = mkdtempSync(path.join(tmpdir(), 'link-selftest-'));
  try {
    skill(root, 'Session Closeout', '# Session Closeout\n');
    skill(root, 'Source Harvest', '# Source Harvest\n');

    // Case 1: fresh vault, links created and readable through.
    const first = run(LINKER, root);
    const readable = () => {
      try {
        return (
          readFileSync(path.join(root, '.claude', 'skills', 'Session Closeout', 'SKILL.md'), 'utf8').includes('Session Closeout') &&
          readFileSync(path.join(root, '.claude', 'skills', 'Source Harvest', 'SKILL.md'), 'utf8').includes('Source Harvest')
        );
      } catch {
        return false;
      }
    };
    record(
      'fresh vault: exit 0 and SKILL.md reads through both links',
      first.status === 0 && readable(),
      `exit=${first.status} readable=${readable()}`
    );

    // Case 2: idempotent second run.
    const second = run(LINKER, root);
    record(
      'second run: exit 0 and both links reported already present',
      second.status === 0 && (second.stdout.match(/^ {2}already/gm) || []).length === 2,
      `exit=${second.status} stdout=${second.stdout.trim().slice(-120)}`
    );

    // Case 3: the real checker calls the linked fixture clean.
    const check = run(CHECKER, root);
    record(
      'the drift checker calls the linked vault clean',
      check.status === 0,
      `checker exit=${check.status}`
    );

    // Case 4: a broken link gets repaired. Point a link at a directory that
    // then disappears, so the link survives with nothing behind it.
    const doomed = path.join(root, 'doomed');
    mkdirSync(doomed);
    const brokenLink = path.join(root, '.claude', 'skills', 'Session Closeout');
    rmSync(brokenLink, { recursive: false });
    symlinkSync(doomed, brokenLink, LINK_TYPE);
    rmSync(doomed, { recursive: true, force: true });
    const repair = run(LINKER, root);
    record(
      'broken link: repaired and readable afterward',
      repair.status === 0 && repair.stdout.includes('relinked') && readable(),
      `exit=${repair.status} relinked=${repair.stdout.includes('relinked')} readable=${readable()}`
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// Case 5: no canonical skills. The linker must fail loudly.
{
  const root = mkdtempSync(path.join(tmpdir(), 'link-selftest-empty-'));
  try {
    const r = run(LINKER, root);
    record(
      'vault with no canonical skills: exit 1 with a FAIL line',
      r.status === 1 && (r.stderr + r.stdout).includes('FAIL'),
      `exit=${r.status}`
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

console.log('Skill Linker Positive Control');
console.log('-----------------------------');
console.log(lines.join('\n'));
console.log('-'.repeat(78));
console.log(`pass=${pass} fail=${fail}`);
console.log('');
if (fail === 0) {
  console.log('The linker creates, repeats, repairs and refuses exactly as specified.');
  process.exit(0);
}
console.log('The linker did not behave as specified. It is not proven.');
process.exit(1);
