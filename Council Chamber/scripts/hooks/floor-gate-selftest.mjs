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
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
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

  // The receiver is not the deletion. One case above spelled the receiver
  // `fs.` and shipped for two releases as the whole of this coverage, so the
  // gate matched a name rather than an act and four other spellings walked
  // through a green suite. Every form below deletes the same file.
  ['node require() inline receiver', 'Bash', `node -e "require('fs').unlinkSync('${DOC}')"`, BLOCK],
  ['node aliased fs handle', 'Bash', `node -e "const f=require('fs'); f.unlinkSync('${DOC}')"`, BLOCK],
  ['node destructured import', 'Bash', `node -e "const {unlinkSync}=require('fs'); unlinkSync('${DOC}')"`, BLOCK],
  ['node rmSync via alias', 'Bash', `node -e "const f=require('fs'); f.rmSync('${DOC}')"`, BLOCK],
  ['node promises unlink via alias', 'Bash', `node -e "const f=require('fs'); f.promises.unlink('${DOC}')"`, BLOCK],

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

  // Widening the deletion match from a receiver to a method name is the kind of
  // change that buys a closed door with a wall. `rmSync` is a substring of
  // `performSync` and `confirmSync`, and an unlink on a file the Floor does not
  // protect was always allowed. These three prove the widening stayed a door.
  ['ALLOW: lookalike performSync', 'Bash', `node -e "performSync('${DOC}')"`, ALLOW],
  ['ALLOW: lookalike confirmSync', 'Bash', `node -e "confirmSync('${DOC}')"`, ALLOW],
  ['ALLOW: unlinkSync on a non-protected file', 'Bash', 'node -e "require(\'fs\').unlinkSync(\'tmp/build.log\')"', ALLOW],

  // ── Must block: the gate cannot read the command ─────────────────────────
  // The gate reads its payload with node. Claude Code no longer needs node to
  // run, and hooks inherit the app's environment rather than your login shell,
  // so node can be missing from the one PATH that matters while your terminal
  // finds it fine. Until v3.13.0 an unreadable payload left the tool name empty
  // and the gate fell through to allow, silently, on every deletion. A gate that
  // cannot see the command has no verdict, and a Floor guard resolves no verdict
  // toward refusal. These run with a node that cannot start placed first on
  // PATH. Refusing `git status` here is the design: while the gate is blind,
  // every shell call waits until node is reachable again.
  ['node unrunnable: rm, relative path', 'Bash', `rm "${DOC}"`, BLOCK, { nodeBroken: true }],
  ['node unrunnable: PS Remove-Item', 'PowerShell', `Remove-Item "${DOC}"`, BLOCK, { nodeBroken: true }],
  ['node unrunnable: even git status waits', 'Bash', 'git status', BLOCK, { nodeBroken: true }],
];

// A node that cannot start. Placed first on PATH, it stands in for every way the
// hook's environment can fail to reach a working node.
const SHIM_DIR = mkdtempSync(path.join(os.tmpdir(), 'floor-no-node-'));
writeFileSync(path.join(SHIM_DIR, 'node'), '#!/bin/sh\nexit 127\n', { mode: 0o755 });
const PATH_KEY = Object.keys(process.env).find((k) => k.toUpperCase() === 'PATH') || 'PATH';
const brokenNodeEnv = {
  ...process.env,
  [PATH_KEY]: `${SHIM_DIR}${path.delimiter}${process.env[PATH_KEY] || ''}`,
};

// The degraded cases prove nothing unless the shim actually wins the lookup.
// If bash still finds a working node, those cases would pass for the wrong
// reason, so the suite refuses to report them as evidence.
const shimProbe = spawnSync('bash', ['-c', 'node -e "process.exit(0)"'], { env: brokenNodeEnv, encoding: 'utf8' });
const shimTook = shimProbe.status !== 0;

let pass = 0;
let fail = 0;
const lines = [];

for (const [label, tool, command, expected, opts = {}] of cases) {
  const payload = JSON.stringify({ tool_name: tool, tool_input: { command } });
  const r = spawnSync('bash', [HOOK], {
    input: payload,
    encoding: 'utf8',
    env: { ...(opts.nodeBroken ? brokenNodeEnv : process.env), SOVEREIGN_VAULT_ROOT: VAULT_ROOT },
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

if (!shimTook) {
  fail += 1;
  lines.push(' FAIL  the unrunnable-node shim did not take, so the node-unrunnable cases proved nothing');
}
rmSync(SHIM_DIR, { recursive: true, force: true });

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
