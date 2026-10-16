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
import { mkdtempSync, writeFileSync, rmSync, copyFileSync } from 'node:fs';
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

  // ── Container deletes ────────────────────────────────────────────────────
  // The gate used to read only files whose extension sits in
  // PROTECTED_EXTENSIONS, so a directory, or a json, image or script inside a
  // vault container, was deletable in one line. Each must-block below passed
  // the gate before the container rule existed. The must-pass cases are the
  // walls: node_modules, a search that merely says "del", a commit message
  // that names a delete, and a second repo that carries the same container
  // names. Each case may name the session cwd the payload carries.
  ['container: rm -rf a directory', 'Bash', 'rm -rf "Council Chamber/Pending Plans/Support Files/Old Run"', BLOCK, { cwd: VAULT_ROOT }],
  ['container: rm a .json', 'Bash', 'rm "Council Chamber/scripts/package.json"', BLOCK, { cwd: VAULT_ROOT }],
  ['container: git rm -r a directory', 'Bash', 'git rm -r "Inbox/old exports"', BLOCK, { cwd: VAULT_ROOT }],
  ['container: rmdir', 'Bash', 'rmdir Scriptorium/empty', BLOCK, { cwd: VAULT_ROOT }],
  ['container: absolute path, no cwd in payload', 'Bash', `rm -rf "${VAULT_ROOT}/Library/Datasets"`, BLOCK],
  ['container: relative, no cwd fails safe', 'Bash', 'rm -rf "Vault (Archive)/Datasets"', BLOCK],
  ['container: relative to a cwd inside a container', 'Bash', 'rm data.json', BLOCK, { cwd: `${VAULT_ROOT}/Council Chamber/scripts` }],
  ['container: dot-dot climbs into a container', 'Bash', 'rm -rf ../Logs', BLOCK, { cwd: `${VAULT_ROOT}/Council Chamber/scripts` }],
  ['container: the vault root itself', 'Bash', 'rm -rf ../../..', BLOCK, { cwd: `${VAULT_ROOT}/Council Chamber/scripts/hooks` }],
  ['container: node rmSync', 'Bash', `node -e "require('fs').rmSync('Scriptorium/card.png')"`, BLOCK, { cwd: VAULT_ROOT }],
  ['container: python shutil.rmtree', 'Bash', `python -c "import shutil; shutil.rmtree('Explorations/Quests/drafts')"`, BLOCK, { cwd: VAULT_ROOT }],
  ['container: find -delete', 'Bash', 'find "Inbox/tmp" -name "*.json" -delete', BLOCK, { cwd: VAULT_ROOT }],
  ['container: PS Remove-Item -Recurse', 'PowerShell', 'Remove-Item -Recurse -Force "Explorations/Quests/Brand"', BLOCK, { cwd: VAULT_ROOT }],
  ['container: PS .NET directory delete', 'PowerShell', '[System.IO.Directory]::Delete("Explorations/Quests/x", $true)', BLOCK, { cwd: VAULT_ROOT }],
  ['container: cmd rmdir from bash', 'Bash', 'cmd /c rmdir /s /q "Vault (Archive)\\old"', BLOCK, { cwd: VAULT_ROOT }],
  ['container: if/then wraps the rm', 'Bash', 'if [ -f Library/x ]; then rm -rf Library/x; fi', BLOCK, { cwd: VAULT_ROOT }],
  ['container: brace group', 'Bash', '{ rm Library/x.json; }', BLOCK, { cwd: VAULT_ROOT }],
  ['container: subshell', 'Bash', '(rm Library/x.json)', BLOCK, { cwd: VAULT_ROOT }],
  ['container: env prefix', 'Bash', 'env FOO=1 rm Library/x.json', BLOCK, { cwd: VAULT_ROOT }],
  ['container: path-prefixed verb', 'Bash', '/bin/rm Library/x.json', BLOCK, { cwd: VAULT_ROOT }],
  ['container: backslash-escaped verb', 'Bash', '\\rm Library/x.json', BLOCK, { cwd: VAULT_ROOT }],
  ['container: command prefix', 'Bash', 'command rm Library/x.json', BLOCK, { cwd: VAULT_ROOT }],
  ['container: unlink', 'Bash', 'unlink Library/x.json', BLOCK, { cwd: VAULT_ROOT }],
  ['container: shred -u', 'Bash', 'shred -u Library/x.json', BLOCK, { cwd: VAULT_ROOT }],
  ['container: git -C . rm', 'Bash', 'git -C . rm Library/x.json', BLOCK, { cwd: VAULT_ROOT }],
  ['container: git clean a container', 'Bash', 'git clean -fd Library', BLOCK, { cwd: VAULT_ROOT }],
  ['container: find -exec rm', 'Bash', 'find Library -name x -exec rm {} \\;', BLOCK, { cwd: VAULT_ROOT }],
  ['container: lone ampersand', 'Bash', 'echo a & rm Library/x.json', BLOCK, { cwd: VAULT_ROOT }],
  ['container: escaped space in the path', 'Bash', 'rm Council\\ Chamber/scripts/x.json', BLOCK, { cwd: VAULT_ROOT }],
  ['container: bash -c', 'Bash', 'bash -c "rm -rf Library/x"', BLOCK, { cwd: VAULT_ROOT }],
  ['container: powershell -Command, program text', 'Bash', 'powershell -Command "Remove-Item Library/x -Recurse"', BLOCK, { cwd: VAULT_ROOT }],
  ['container: PS cmd /c del, unquoted backslash path', 'PowerShell', 'cmd /c del Library\\x.json', BLOCK, { cwd: VAULT_ROOT }],
  ['container: node rmSync, bare name, cwd inside', 'Bash', `node -e "require('fs').rmSync('x', {recursive: true})"`, BLOCK, { cwd: `${VAULT_ROOT}/Library` }],
  ['container: node unlinkSync, bare name, cwd inside', 'Bash', `node -e "require('fs').unlinkSync('state.json')"`, BLOCK, { cwd: `${VAULT_ROOT}/Council Chamber/scripts` }],
  ['container: fs.rm', 'Bash', `node -e "require('fs').rm('Library/x', () => {})"`, BLOCK, { cwd: VAULT_ROOT }],
  ['container: cd then a relative delete', 'Bash', 'cd Library && rm -rf x', BLOCK, { cwd: VAULT_ROOT }],
  ['container: glob star at the root', 'Bash', 'rm -rf *', BLOCK, { cwd: VAULT_ROOT }],
  ['container: glob prefix at the root', 'Bash', 'rm -rf Council*', BLOCK, { cwd: VAULT_ROOT }],
  ['container: node_modules then dot-dot', 'Bash', 'rm -rf Library/x/node_modules/../y', BLOCK, { cwd: VAULT_ROOT }],
  ['ALLOW: container: node_modules is regenerable', 'Bash', 'rm -rf "Council Chamber/scripts/node_modules"', ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: node_modules from a cwd inside', 'Bash', 'rm -rf node_modules', ALLOW, { cwd: `${VAULT_ROOT}/Council Chamber/scripts` }],
  ['ALLOW: container: a search that says del', 'Bash', 'grep -n del "Inbox/notes.json"', ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: .runtime is not a container', 'Bash', 'rm -rf .runtime/hook-test-fixtures/case1', ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: same names in another repo', 'Bash', 'rm -rf Library/build', ALLOW, { cwd: '/tmp/another-repo' }],
  ['ALLOW: container: commit message that names a delete', 'Bash', 'git commit -m "rm -rf Inbox/old"', ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: unresolvable variable', 'Bash', 'rm -rf "$TMPDIR/x"', ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: node delete outside, cwd inside', 'Bash', `node -e "require('fs').rmSync('/tmp/x', {recursive: true})"`, ALLOW, { cwd: `${VAULT_ROOT}/Council Chamber/scripts` }],
  ['ALLOW: container: grep for a delete call', 'Bash', 'grep -rn "unlinkSync(" "Council Chamber/scripts"', ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: rg for rmtree', 'Bash', 'rg "shutil.rmtree" "Council Chamber/scripts"', ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: git grep', 'Bash', 'git grep -n "unlinkSync(" -- "Council Chamber/scripts"', ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: sed print of rmSync lines', 'Bash', `sed -n '/rmSync(/p' "Council Chamber/scripts/foo.mjs"`, ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: script with a note naming rmSync', 'Bash', 'node "Council Chamber/scripts/foo.mjs" --note "calls fs.rmSync(x)"', ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: semicolon inside a commit message', 'Bash', 'git commit -m "fix; rm Library/x"', ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: semicolon inside echo', 'Bash', 'echo "done; rm Library/x"', ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: heredoc commit body', 'Bash', "git commit -F - <<'EOF'\nfix: the ruling\nrm -rf Library/x\nEOF", ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: cd into another tree', 'Bash', 'cd sites && rm -rf Library/x', ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: git clean dry run', 'Bash', 'git clean -nd Library', ALLOW, { cwd: VAULT_ROOT }],
  ['ALLOW: container: stderr redirect beside an outside delete', 'Bash', 'rm /tmp/x.json 2>/dev/null', ALLOW, { cwd: `${VAULT_ROOT}/Council Chamber/scripts` }],
  ['ALLOW: container: copy, not delete', 'Bash', 'cp "Council Chamber/scripts/package.json" /tmp/pkg.json', ALLOW, { cwd: VAULT_ROOT }],
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
  const payload = JSON.stringify(opts.cwd
    ? { tool_name: tool, cwd: opts.cwd, tool_input: { command } }
    : { tool_name: tool, tool_input: { command } });
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
  lines.push(`${ok ? '  ok  ' : ' FAIL '} ${label.padEnd(58)} exit=${code} want=${expected}${note}`);
}

// The container rule lives in container-delete.mjs, beside the gate. A gate
// copied somewhere without it has no verdict on a container delete, and no
// verdict is a refusal. Even a harmless call waits until the module is back.
{
  const lone = mkdtempSync(path.join(os.tmpdir(), 'floor-no-module-'));
  copyFileSync(HOOK, path.join(lone, 'pre-tool-approval-gate.sh'));
  const r = spawnSync('bash', [path.join(lone, 'pre-tool-approval-gate.sh')], {
    input: JSON.stringify({ tool_name: 'Bash', tool_input: { command: 'git status' } }),
    encoding: 'utf8',
    env: { ...process.env, SOVEREIGN_VAULT_ROOT: VAULT_ROOT },
  });
  const ok = r.status === BLOCK;
  if (ok) pass += 1; else fail += 1;
  lines.push(`${ok ? '  ok  ' : ' FAIL '} ${'container module missing: even git status waits'.padEnd(58)} exit=${r.status} want=${BLOCK}${ok ? '' : '  <-- NOT BLOCKED. The gate fails open without its module.'}`);
  rmSync(lone, { recursive: true, force: true });
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
