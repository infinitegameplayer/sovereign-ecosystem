#!/usr/bin/env node
// doctrine-records-selftest.mjs
// Positive control on the records boundary shared by doctrine-mass.mjs and
// doctrine-references.mjs.
//
// Why it exists. Through v3.14.0 the two counters held different boundaries.
// doctrine-mass.mjs left dated records out of the count. doctrine-references.mjs
// had no boundary at all, so it listed every dated record as an orphan and
// offered the Sovereign's audit trail as retirement candidates. v3.15.0 moves the
// boundary into doctrine-records.mjs and both counters import it.
//
// What it proves, on a throwaway vault:
//   1. Both counters fail when aimed at an empty root. A count of nothing is a
//      wrong root, never a clean vault.
//   2. On a fixture holding real doctrine and one planted record, both counters
//      count the same population, and that population is the doctrine alone.
//   3. The planted record is excluded from both: mass reports it as excluded,
//      and references never lists it as an artifact.
//   4. The boundary itself: a RECORD_DIRS entry matches a folder segment and
//      not a file name that merely contains it, and `doctrine: false` is read
//      through CRLF line endings.
//   5. LIVENESS: a copy of doctrine-references.mjs with the exclusion removed
//      must disagree with doctrine-mass.mjs on the same fixture. If it agrees,
//      arm 2 proved nothing.
//
// Usage:
//   node "Council Chamber/scripts/doctrine-records-selftest.mjs"
//
// Exit 0: every arm behaved as specified. Exit 1: read the FAIL lines.

import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RECORD_DIRS, isRecordDir, isMarkedRecord } from './doctrine-records.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const results = [];
const check = (name, ok) => results.push([name, Boolean(ok)]);

function run(scriptPath, root, args = []) {
  const env = { ...process.env, SOVEREIGN_VAULT_ROOT: root };
  return spawnSync(process.execPath, [scriptPath, ...args], { env, encoding: 'utf8' });
}

function write(root, rel, body) {
  const abs = path.join(root, rel);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, body);
}

const base = mkdtempSync(path.join(os.tmpdir(), 'doctrine-records-pc-'));
try {
  const MASS = path.join(HERE, 'doctrine-mass.mjs');
  const REFS = path.join(HERE, 'doctrine-references.mjs');

  // Arm 1: an empty root fails both.
  const empty = path.join(base, 'empty');
  mkdirSync(empty);
  check('doctrine-mass fails on an empty root', run(MASS, empty).status !== 0);
  check('doctrine-references fails on an empty root', run(REFS, empty).status !== 0);

  // The fixture: five doctrine artifacts, one per layer plus a second codex,
  // and one dated record marked `doctrine: false`.
  const vault = path.join(base, 'vault');
  const CC = 'Council Chamber';
  write(vault, `${CC}/Codices/Alpha Codex.md`, '# Alpha\n\n[[Beta Protocol]]\n');
  write(vault, `${CC}/Codices/Expression/Gamma Codex.md`, '# Gamma\n');
  write(vault, `${CC}/Protocols/Governance/Beta Protocol.md`, '# Beta\n\n[[Alpha Codex]]\n');
  write(vault, `${CC}/Skills/Delta/SKILL.md`, '---\nname: delta\n---\n# Delta\n');
  write(vault, `${CC}/Governance/Epsilon Standard.md`, '# Epsilon\n\n[[Gamma Codex]]\n');
  const RECORD = `${CC}/Governance/Audit Report - 2026-01-01.md`;
  // CRLF on purpose: a Windows checkout writes it that way.
  write(vault, RECORD, '---\r\ndoctrine: false\r\n---\r\n# A dated audit\r\n\r\nIt governs nothing. [[Alpha Codex]]\r\n');
  const DOCTRINE = 5;

  const massOut = run(MASS, vault, ['--json']);
  const refsOut = run(REFS, vault, ['--json']);
  let mass = null;
  let refs = null;
  try { mass = JSON.parse(massOut.stdout); } catch { /* reported below */ }
  try { refs = JSON.parse(refsOut.stdout); } catch { /* reported below */ }
  check('doctrine-mass runs on the fixture and emits JSON', massOut.status === 0 && mass);
  check('doctrine-references runs on the fixture and emits JSON', refsOut.status === 0 && Array.isArray(refs));

  // Arm 2: same population, and it is the doctrine alone.
  check(`doctrine-mass counts the ${DOCTRINE} doctrine artifacts`, mass && mass.totalFiles === DOCTRINE);
  check('both counters count the same population', mass && refs && mass.totalFiles === refs.length);

  // Arm 3: the record is out of both.
  check('doctrine-mass reports the planted record as excluded', mass && mass.totalExcluded === 1);
  check('doctrine-references never lists the planted record', refs && !refs.some((a) => a.path === RECORD));

  // Arm 4: the boundary itself.
  RECORD_DIRS.push('Audit Records');
  check('a record folder is matched as a folder segment', isRecordDir(path.join('vault', 'Council Chamber', 'Governance', 'Audit Records', 'Run 1.md')));
  check('a file name containing the folder name is not a record', !isRecordDir(path.join('vault', 'Council Chamber', 'Governance', 'Audit Records Guide.md')));
  RECORD_DIRS.pop();
  check('doctrine: false is read through CRLF line endings', isMarkedRecord('---\r\ntitle: x\r\ndoctrine: false\r\n---\r\nbody\r\n'));
  check('a file without the marker is doctrine', !isMarkedRecord('---\ntitle: x\n---\nbody\n'));

  // Arm 5, liveness: strip the exclusion from a copy of the references counter.
  const mutDir = path.join(base, 'mutant');
  mkdirSync(mutDir);
  copyFileSync(path.join(HERE, 'doctrine-records.mjs'), path.join(mutDir, 'doctrine-records.mjs'));
  const src = readFileSync(REFS, 'utf8');
  const stripped = src.split('\n').filter((l) => !/^\s*if \((isRecordDir|isMarkedRecord)\(/.test(l)).join('\n');
  writeFileSync(path.join(mutDir, 'doctrine-references.mjs'), stripped);
  let mutant = null;
  try { mutant = JSON.parse(run(path.join(mutDir, 'doctrine-references.mjs'), vault, ['--json']).stdout); } catch { /* reported below */ }
  check('LIVENESS: the exclusion lines were found and removed in the mutant', stripped !== src);
  check('LIVENESS: without the exclusion, the counters disagree', mass && Array.isArray(mutant) && mutant.length !== mass.totalFiles);
} finally {
  rmSync(base, { recursive: true, force: true });
}

let fail = 0;
for (const [name, ok] of results) {
  if (!ok) fail += 1;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${name}`);
}
console.log(`pass=${results.length - fail} fail=${fail}`);
if (fail) {
  console.log('\nThe records boundary did not behave as specified. Do not trust either doctrine count until this is green.');
  process.exit(1);
}
console.log('\nBoth counters refused an empty root, dropped the planted record and agreed on the doctrine that remained.');
process.exit(0);
