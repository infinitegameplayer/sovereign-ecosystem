#!/usr/bin/env node
// floor-gate-selftest.mjs
// Positive control on the Permanent Floor enforcement hook.
//
// The governing law: before trusting any negative result, prove the channel it
// depends on was live. A gate that has never refused anything is not known to
// work. A green suite that ran no assertions is not evidence, it is a mood.
//
// This file is the proof that pre-tool-approval-gate.sh actually refuses. It
// fires crafted inputs that MUST block alongside inputs that MUST pass. The
// must-pass cases matter as much as the must-block ones: a guard that blocks
// everything has traded a hole for a wall, and the wall is also a failure.
//
// Payloads are built with JSON.stringify so a hand-escaping mistake in a test
// string cannot masquerade as a guard failure. A shell-quoted version of this
// probe produced exactly that false negative once, which is the bad-instrument
// failure this file exists to avoid. Do not rewrite it in shell.
//
// Usage:
//   node "Council Chamber/scripts/hooks/floor-gate-selftest.mjs"
//
// Exit codes:
//   0  every case behaved as specified. The Floor is proven, not assumed.
//   1  at least one case misbehaved. Read the FAIL lines.
//
// Run this after ANY edit to the gate, and on a cadence besides. A guard rots
// unobserved, and "it was green last week" is the exact condition under which
// it rots.

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const HOOK = path.join(HERE, 'pre-tool-approval-gate.sh');

// Resolve the vault root the same way the hook does, so the probe and the
// subject agree on where the boundary is. Four levels up from this file:
// <vault>/Council Chamber/scripts/hooks/ -> <vault>
const VAULT_ROOT = (
  process.env.SOVEREIGN_VAULT_ROOT || path.resolve(HERE, '..', '..', '..')
).replace(/\\/g, '/');

// A protected content file that lives inside the vault, path relative to root.
const DOC = 'Council Chamber/Codices/Humor Codex.md';
const ABS = `${VAULT_ROOT}/${DOC}`;

// A protected file that lives OUTSIDE the vault. Must stay deletable.
const OUTSIDE = '/tmp/scratch-notes.md';

const BLOCK = 2;
const ALLOW = 0;

const cases = [
  // ── Must block: the ordinary ways an agent deletes a file ────────────────
  ['rm, relative path, quoted', 'Bash', `rm "${DOC}"`, BLOCK],
  ['rm, relative path, no spaces', 'Bash', 'rm Library/notes.md', BLOCK],
  ['rm, forced flags', 'Bash', `rm -rf "${DOC}"`, BLOCK],
  ['rm, absolute path inside vault', 'Bash', `rm "${ABS}"`, BLOCK],
  ['git rm', 'Bash', `git rm "${DOC}"`, BLOCK],
  ['git mv', 'Bash', 'git mv a.md b.md', BLOCK],

  // ── Must block: the bypass doors ─────────────────────────────────────────
  ['node fs.unlinkSync bypass', 'Bash', `node -e "fs.unlinkSync('${DOC}')"`, BLOCK],
  ['python os.remove bypass', 'Bash', `python -c "os.remove('${DOC}')"`, BLOCK],
  ['powershell Remove-Item from bash', 'Bash', `powershell -c Remove-Item "${DOC}"`, BLOCK],
  ['cmd del bypass', 'Bash', `cmd /c del "${DOC}"`, BLOCK],

  // ── Must block: the PowerShell tool. Same wall, second door. ─────────────
  ['PS Remove-Item, relative path', 'PowerShell', `Remove-Item "${DOC}"`, BLOCK],
  ['PS Remove-Item, absolute in vault', 'PowerShell', `Remove-Item "${ABS}"`, BLOCK],
  ['PS del alias', 'PowerShell', `del "${DOC}"`, BLOCK],
  ['PS .NET IO delete', 'PowerShell', `[System.IO.File]::Delete("${DOC}")`, BLOCK],
  ['PS git rm', 'PowerShell', `git rm "${DOC}"`, BLOCK],

  // ── Must block: moving content out of the vault ──────────────────────────
  ['mv out of the vault', 'Bash', `mv "${DOC}" /tmp/exfil.md`, BLOCK],

  // ── Must PASS. A guard that blocks these has become a wall. ──────────────
  ['ALLOW: internal move within the vault', 'Bash', `mv "${DOC}" "Library/Humor Codex.md"`, ALLOW],
  ['ALLOW: delete a protected file outside the vault', 'Bash', `rm "${OUTSIDE}"`, ALLOW],
  ['ALLOW: delete a non-protected file', 'Bash', 'rm /tmp/build.log', ALLOW],
  ['ALLOW: read-only inspection', 'Bash', 'git status', ALLOW],
  ['ALLOW: list a directory', 'Bash', 'ls "Council Chamber"', ALLOW],
];

let pass = 0;
let fail = 0;
const lines = [];

for (const [label, tool, command, expected] of cases) {
  const payload = JSON.stringify({ tool_name: tool, tool_input: { command } });
  const r = spawnSync('bash', [HOOK], {
    input: payload,
    encoding: 'utf8',
    env: { ...process.env, SOVEREIGN_VAULT_ROOT: VAULT_ROOT },
  });
  const code = r.status;
  const ok = code === expected;
  if (ok) {
    pass += 1;
  } else {
    fail += 1;
  }

  let note = '';
  if (!ok) {
    note = expected === BLOCK
      ? '  <-- NOT BLOCKED. The Floor has a hole here.'
      : '  <-- OVER-BLOCKED. The Floor has become a wall here.';
  }
  lines.push(`${ok ? '  ok  ' : ' FAIL '} ${label.padEnd(46)} exit=${code} want=${expected}${note}`);
}

console.log('Permanent Floor gate: positive control');
console.log(`vault root: ${VAULT_ROOT}`);
console.log(`hook:       ${HOOK}`);
console.log('-'.repeat(78));
console.log(lines.join('\n'));
console.log('-'.repeat(78));
console.log(`pass=${pass} fail=${fail}`);

if (fail > 0) {
  console.log('\nThe gate did not behave as specified. Do not trust it until this is green.');
  process.exit(1);
}
console.log('\nThe gate refused everything it must refuse and allowed everything it must allow.');
process.exit(0);
