#!/usr/bin/env node
// plan-hash.mjs
// An approval names its plan. Prints a fingerprint of what a Pending Plan says it
// will do, so the version the Sovereign approved can be told apart from a later edit.
//
// Two open-source projects reached the same rule independently. claude-obsidian
// binds an approval to "the expanded plan" by hash. myPKA's reviewer verdicts name
// the bytes they cleared: "A change to those bytes voids it." (both MIT). Without
// the rule, a plan moves to `approved` with no record of which version was read.
//
// What the fingerprint covers: the plan body, with frontmatter removed (status and
// approval metadata live there), line endings normalized and trailing whitespace
// trimmed. The sections a run writes into the plan are removed too, so the hash holds
// still while a plan executes and moves only when its scope does:
//   PendingPlan Activity Log (or Activity Log), Breadcrumbs, Applicability Updates,
//   Partial Implementation Notes, Reconciliation Notes, Implementation Snapshot,
//   Approved Execution Scope, Implementation Actions, Implementation Outcome,
//   Evidence / Implementation Refs.
//
// Vault root resolution: SOVEREIGN_VAULT_ROOT env var if set, otherwise the two
// levels above this script's directory (scripts live in <vault>/Council Chamber/scripts/).
// A relative plan path is tried against the current directory first, then the vault root.
//
// Usage:
//   node "Council Chamber/scripts/plan-hash.mjs" <plan.md>            print the hash
//   node "Council Chamber/scripts/plan-hash.mjs" --verify <plan.md>   compare to approved_hash
//   node "Council Chamber/scripts/plan-hash.mjs" --positive-control
//
// Exit codes (--verify): 0 the plan is the version approved, 1 changed since approval,
// 2 usage error or unreadable file, 3 unpinned (no approved_hash: approved before this
// rule, pinned at its next approval).
// Exit codes (--positive-control): 0 every arm behaved as specified, 1 read the FAIL lines.
//
// READ-ONLY: never writes a plan. The approving edit writes approved_hash itself.

import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const SCRIPT_DIR = dirname(SCRIPT_PATH);
const VAULT_ROOT = process.env.SOVEREIGN_VAULT_ROOT || resolve(SCRIPT_DIR, '..', '..');

const RUN_SECTIONS = /^((PendingPlan )?Activity Log|Breadcrumbs?|Applicability Updates|Partial Implementation Notes|Reconciliation Notes|Implementation Snapshot|Approved Execution Scope|Implementation Actions|Implementation Outcome|Evidence \/ Implementation Refs)\b/i;

function planHash(text) {
  let t = text.replace(/\r\n/g, '\n').replace(/^﻿/, '');
  t = t.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const out = [];
  let skipLevel = 0;
  for (const line of t.split('\n')) {
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      if (skipLevel && level <= skipLevel) skipLevel = 0;
      if (!skipLevel && RUN_SECTIONS.test(h[2].replace(/[*_`]/g, '').trim())) { skipLevel = level; continue; }
    }
    if (!skipLevel) out.push(line.replace(/\s+$/, ''));
  }
  const body = out.join('\n').trim();
  return createHash('sha256').update(body, 'utf8').digest('hex').slice(0, 16);
}

function approvedHash(text) {
  const fm = (text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/) || [])[1] || '';
  return ((fm.match(/^approved_hash:\s*["']?([0-9a-f]{16})["']?\s*$/m)) || [])[1] || null;
}

function locate(file) {
  if (isAbsolute(file) || existsSync(file)) return file;
  const viaRoot = join(VAULT_ROOT, file);
  return existsSync(viaRoot) ? viaRoot : file;
}

// Positive control. Builds a throwaway vault in the OS temp dir and aims the
// script at it, never at the real vault. The script is run as a child process,
// the way the Pending Plan Implementation skill runs it.
function positiveControl() {
  const tmp = mkdtempSync(join(os.tmpdir(), 'plan-hash-control-'));
  const results = [];
  const check = (name, ok) => { results.push([name, Boolean(ok)]); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); };
  try {
    const run = (script, args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', env: { ...process.env, SOVEREIGN_VAULT_ROOT: tmp } });
    const plan = (hashLine, scope, extra = '') =>
      `---\nstatus: approved\n${hashLine}---\n\n# Canary Plan\n\n## Proposed Changes\n\n${scope}\n\n## PendingPlan Activity Log\n\n- 2026-01-01 - created.${extra}\n`;
    const file = join(tmp, 'plan.md');
    const put = (text) => writeFileSync(file, text, 'utf8');
    const verify = (script = SCRIPT_PATH) => run(script, ['--verify', file]).status;

    const base = run(SCRIPT_PATH, [(put(plan('', 'Build the thing.')), file)]).stdout.trim();
    check('the hash is 16 hex characters', /^[0-9a-f]{16}$/.test(base));

    const pinned = plan(`approved_hash: ${base}\n`, 'Build the thing.');
    put(pinned);
    check('an unchanged approved plan passes (exit 0)', verify() === 0);

    put(plan(`approved_hash: ${base}\n`, 'Build the thing.', '\n- 2026-01-02 - phase 1 shipped.'));
    check('a run log line after approval still passes (exit 0)', verify() === 0);

    put(pinned.replace('status: approved', 'status: ready-for-execution').replace(/\n/g, '\r\n'));
    check('a status change and CRLF line endings still pass (exit 0)', verify() === 0);

    put(plan(`approved_hash: ${base}\n`, 'Build the thing and a second thing.'));
    check('a scope change after approval fails (exit 1)', verify() === 1);

    put(plan('', 'Build the thing.'));
    check('a plan with no approved_hash reads as unpinned (exit 3)', verify() === 3);

    check('a missing plan file is a usage error (exit 2)', run(SCRIPT_PATH, ['--verify', join(tmp, 'absent.md')]).status === 2);

    // Liveness. A mutant that hashes a constant cannot see scope. The scope-change
    // arm must pass the mutant through as unchanged. If it does not, the arm above
    // proved nothing about the instrument.
    const mutant = join(tmp, 'plan-hash-mutant.mjs');
    const src = readFileSync(SCRIPT_PATH, 'utf8');
    const mutated = src.replace(".update(body, 'utf8')", ".update('constant', 'utf8')");
    check('the mutant differs from the real script', mutated !== src);
    writeFileSync(mutant, mutated, 'utf8');
    put(plan('', 'Build the thing.'));
    const mutantBase = run(mutant, [file]).stdout.trim();
    put(plan(`approved_hash: ${mutantBase}\n`, 'Build the thing and a second thing.'));
    check('LIVENESS: the mutant misses a scope change (exit 0), so the real arm is a live test', verify(mutant) === 0);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  const failed = results.filter(([, ok]) => !ok).length;
  console.log(`\npositive-control: ${results.length - failed} passed, ${failed} failed`);
  return failed === 0 ? 0 : 1;
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--positive-control')) process.exit(positiveControl());
  const verify = args.includes('--verify');
  const arg = args.find(a => !a.startsWith('--'));
  if (!arg) { console.error('Usage: node plan-hash.mjs [--verify] <plan.md> | --positive-control'); process.exit(2); }
  const file = locate(arg);
  let text;
  try { text = readFileSync(file, 'utf8'); } catch (e) { console.error(`plan-hash: cannot read ${file}: ${e.message}`); process.exit(2); }
  const h = planHash(text);
  if (!verify) { console.log(h); return; }
  const pinned = approvedHash(text);
  if (!pinned) { console.log(`UNPINNED  ${file}  current ${h}. Approved before the rule, or never approved. Pin it at its next approval.`); process.exit(3); }
  if (pinned === h) { console.log(`MATCH     ${file}  ${h}. This is the version approved.`); process.exit(0); }
  console.log(`CHANGED   ${file}  approved ${pinned}, now ${h}. Show the Sovereign what moved since approval (git log -p on the plan) and execute only after their yes.`);
  process.exit(1);
}

main();
