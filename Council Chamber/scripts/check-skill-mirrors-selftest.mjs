#!/usr/bin/env node
// check-skill-mirrors-selftest.mjs
// Positive control on the skill mirror drift checker.
//
// The governing law of this repo: a guard is verified by firing, never by
// reading. A checker that has never reported drift is not known to detect it,
// and a green result with no positive control is not evidence, it is a mood.
//
// This file exists because check-skill-mirrors.mjs learned to stay quiet on a
// fresh vault, where no interface directory exists yet and there is genuinely
// nothing to compare. Teaching a detector when to say nothing is exactly the
// change that can turn it into a detector that always says nothing. So the
// silent case and the loud cases are both proven here, against real fixture
// vaults built in a temp directory and removed afterward.
//
// Usage:
//   node "Council Chamber/scripts/check-skill-mirrors-selftest.mjs"
//
// Exit codes:
//   0  every case behaved as specified.
//   1  at least one case misbehaved. Read the FAIL lines.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CHECKER = path.join(HERE, 'check-skill-mirrors.mjs');

const CLEAN = 0;
const DRIFT = 1;

function skill(root, rel, name, body) {
  const dir = path.join(root, rel, name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'SKILL.md'), body, 'utf8');
}

// Each fixture returns the vault root it built.
const fixtures = {
  // Day one. Canonical skills, no interface directory anywhere.
  freshVault(root) {
    skill(root, 'Council Chamber/Skills', 'Session Closeout', '# Session Closeout\n');
    skill(root, 'Council Chamber/Skills', 'Source Harvest', '# Source Harvest\n');
  },

  // The reader linked one interface and every skill is present in it.
  fullyMirrored(root) {
    fixtures.freshVault(root);
    skill(root, '.claude/skills', 'Session Closeout', '# Session Closeout\n');
    skill(root, '.claude/skills', 'Source Harvest', '# Source Harvest\n');
  },

  // The reader linked one interface and forgot a skill. Real drift.
  missingOne(root) {
    fixtures.freshVault(root);
    skill(root, '.claude/skills', 'Session Closeout', '# Session Closeout\n');
  },

  // The mirror exists but its content has fallen behind canonical. Real drift.
  contentDrifted(root) {
    fixtures.freshVault(root);
    skill(root, '.claude/skills', 'Session Closeout', '# Session Closeout\n');
    skill(root, '.claude/skills', 'Source Harvest', '# an older, different body\n');
  },
};

const cases = [
  ['fresh vault, no interface directory yet', 'freshVault', CLEAN],
  ['one interface linked, every skill present', 'fullyMirrored', CLEAN],
  ['one interface linked, a skill left unlinked', 'missingOne', DRIFT],
  ['mirror present but content has drifted', 'contentDrifted', DRIFT],
];

let pass = 0;
let fail = 0;
const lines = [];

for (const [name, fixture, want] of cases) {
  const root = mkdtempSync(path.join(tmpdir(), 'mirror-selftest-'));
  try {
    fixtures[fixture](root);
    const r = spawnSync(process.execPath, [CHECKER], {
      encoding: 'utf8',
      env: { ...process.env, SOVEREIGN_VAULT_ROOT: root },
    });
    const got = r.status;
    const ok = got === want;
    if (ok) {
      pass++;
      lines.push(`  ok   ${name.padEnd(48)} exit=${got} want=${want}`);
    } else {
      fail++;
      const why =
        want === DRIFT
          ? '<-- drift went unreported. The checker is blind here.'
          : '<-- reported drift on a legitimate state. It has become a wall.';
      lines.push(`  FAIL ${name.padEnd(48)} exit=${got} want=${want}  ${why}`);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

console.log('Skill Mirror Checker Positive Control');
console.log('-------------------------------------');
console.log(lines.join('\n'));
console.log('-'.repeat(78));
console.log(`pass=${pass} fail=${fail}`);
console.log('');
if (fail === 0) {
  console.log('The checker reported drift where drift exists and stayed quiet where it does not.');
  process.exit(0);
}
console.log('The checker did not behave as specified. It is not proven.');
process.exit(1);
