#!/usr/bin/env node
// hooks-selftest.mjs
// Positive control on every hook EXCEPT the Permanent Floor gate, which has its
// own dedicated control in floor-gate-selftest.mjs.
//
// The governing law: a guard is verified by firing, never by reading. A hook
// that has never reacted is not known to work, and a hook that reacts to
// everything has become a wall. Both are failures and both are checked here.
//
// This file exists because all six of these hooks were once trusted on reading,
// and firing them found three defects in an afternoon:
//   - post-write-index-regen.sh could never regenerate anything, because no
//     regen script shipped for it to call.
//   - post-write-em-dash-check.sh went silently dark when Windows handed it a
//     lowercase drive letter, and warned on the entire filesystem when its vault
//     root was unset. It failed in both directions at once.
//   - the two compact hooks resolved .runtime against the working directory, so
//     firing from a subdirectory wrote a snapshot the reorienter never found.
//
// Payloads are built with JSON.stringify. A hand-quoted shell string can carry
// an escaping bug that is indistinguishable from a hook failure, which is the
// bad-instrument trap this whole practice exists to avoid.
//
// ── THE SECOND INSTRUMENT ────────────────────────────────────────────────────
//
// A test suite fails by reporting clean, which is the same shape as success.
// That makes a green suite the least informative possible result unless
// something is pointed at the suite itself. Two things are:
//
//   node hooks-selftest.mjs --negative-control
//
// re-runs every case against a do-nothing stub in place of the real hook. Any
// case that STILL passes is vacuous: it proves nothing, because a hook that
// does nothing already satisfies it. A green suite of vacuous cases is a mood,
// not evidence.
//
// Cases divide into two kinds, declared per case, because the distinction is
// real and hiding it would be its own dishonesty:
//   'reacts' . the hook must DO something. A stub cannot satisfy it, so the
//              negative control can falsify it. These are the load-bearing ones.
//   'quiet'  . the hook must NOT do something. A stub satisfies it trivially,
//              so the negative control cannot falsify it and does not pretend to.
//              Reported as n/a rather than counted as a pass.
//
// The registration audit is the other blind spot. Every case here fires its
// hook DIRECTLY, which proves the script works and proves nothing about whether
// the session will ever call it. A perfect guard nobody wired up is a
// decoration. So the suite reads the settings file and asks, for each hook on
// disk, whether an event is registered that would actually reach it.
//
// Usage:
//   node "Council Chamber/scripts/hooks/hooks-selftest.mjs"
//   node "Council Chamber/scripts/hooks/hooks-selftest.mjs" --negative-control
//
// Exit 0: every hook behaved as specified. Exit 1: read the FAIL lines.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, existsSync, rmSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..', '..');
const hook = (n) => path.join(HERE, n);

const NEGATIVE = process.argv.includes('--negative-control');

// A throwaway vault, so the self-test never writes into the real one.
const VAULT = mkdtempSync(path.join(os.tmpdir(), 'se-hooks-')).replace(/\\/g, '/');
mkdirSync(path.join(VAULT, 'Council Chamber', 'Skills', 'Demo'), { recursive: true });
mkdirSync(path.join(VAULT, 'Scriptorium'), { recursive: true });

// The stub the negative control substitutes for a real hook. It consumes its
// payload and exits 0 without acting, which is exactly what a dead hook does.
const STUB = `${VAULT}/__stub.sh`;
writeFileSync(STUB, '#!/bin/sh\ncat >/dev/null 2>&1\nexit 0\n');

const CLEAN = `${VAULT}/Scriptorium/clean.md`;
const DIRTY = `${VAULT}/Scriptorium/dirty.md`;
const OUTSIDE = path.join(os.tmpdir(), 'se-outside.md').replace(/\\/g, '/');
writeFileSync(CLEAN, 'This file is clean. No long dashes here.\n');
writeFileSync(DIRTY, 'This file has an em dash — right here.\n');
writeFileSync(OUTSIDE, 'Outside the vault, with an em dash — here.\n');

const results = [];
// kind: 'reacts' (falsifiable by the stub) or 'quiet' (not falsifiable by it).
const record = (name, ok, detail, kind) => {
  results.push({ name, ok, detail, kind });
};

// Fire a hook with a payload. Returns {code, out}.
// Under --negative-control the real hook is replaced by the do-nothing stub.
function fire(hookFile, payload, { vaultRoot = VAULT, cwd = VAULT } = {}) {
  const env = { ...process.env };
  if (vaultRoot === null) delete env.SOVEREIGN_VAULT_ROOT;
  else env.SOVEREIGN_VAULT_ROOT = vaultRoot;
  const r = spawnSync('bash', [NEGATIVE ? STUB : hookFile], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    cwd,
    env,
  });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

const write = (file_path) => ({ tool_name: 'Write', tool_input: { file_path } });
const bash = (command) => ({ tool_name: 'Bash', tool_input: { command } });

// ── post-write-em-dash-check.sh ─────────────────────────────────────────────
// It must WARN on an em dash in the vault, stay SILENT on a clean file, and
// stay silent on a file outside the vault. And it must survive a lowercase
// drive letter, which is the exact input that once made it go dark.
{
  const H = hook('post-write-em-dash-check.sh');

  let r = fire(H, write(DIRTY));
  record('em-dash: warns on an em dash', /em dash/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'reacts');

  r = fire(H, write(CLEAN));
  record('em-dash: silent on a clean file', !/WARN/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'quiet');

  // THE REGRESSION TEST. Same file, lowercased drive letter. This is the bug.
  const lowerDrive = DIRTY.replace(/^([A-Za-z]):/, (_, d) => d.toLowerCase() + ':');
  r = fire(H, write(lowerDrive));
  record(
    'em-dash: survives a lowercase drive letter',
    /em dash/i.test(r.out),
    lowerDrive === DIRTY ? '(no drive letter on this platform, vacuous)' : `out=${r.out.trim().slice(0, 40)}`,
    'reacts'
  );

  // Fail closed, never open: with no vault root it must not police the whole disk.
  r = fire(H, write(OUTSIDE), { vaultRoot: null, cwd: VAULT });
  record('em-dash: ignores a file outside the vault when unconfigured', !/WARN/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'quiet');
}

// ── pre-write-floor-guard.sh ────────────────────────────────────────────────
// Surface-and-log, never blocking. It must react to a trust-anchor edit and
// stay quiet on an ordinary file, and it must never block either.
{
  const H = hook('pre-write-floor-guard.sh');

  let r = fire(H, write(`${VAULT}/.claude/settings.json`));
  record('floor-guard: surfaces a trust-anchor edit', /\S/.test(r.out) && r.code === 0, `code=${r.code}`, 'reacts');

  r = fire(H, write(CLEAN));
  record('floor-guard: quiet on an ordinary file, never blocks', r.code === 0, `code=${r.code}`, 'quiet');
}

// ── the compact pair ────────────────────────────────────────────────────────
// The capture must write where the reorienter reads. They are checked together,
// because each one alone can look healthy while the pair is broken.
{
  const CAP = hook('pre-compact-state-capture.sh');
  const REO = hook('post-compact-reorienter.sh');
  const snapshot = path.join(VAULT, '.runtime', 'pre-compact-state.md');

  // Fire the capture from a SUBDIRECTORY. This is the bug: it used to plant an
  // orphaned .runtime right there and the vault snapshot was never written.
  const sub = path.join(VAULT, 'Scriptorium');
  fire(CAP, {}, { cwd: sub });

  record(
    'compact: capture writes to the VAULT root, not the cwd',
    existsSync(snapshot),
    existsSync(snapshot) ? 'snapshot at vault root' : 'snapshot MISSING at vault root',
    'reacts'
  );
  record(
    'compact: capture plants no orphan in the subdirectory',
    !existsSync(path.join(sub, '.runtime')),
    existsSync(path.join(sub, '.runtime')) ? 'ORPHAN .runtime in subdir' : 'no orphan',
    'quiet'
  );

  // The reorienter must FIND what the capture wrote, also from a subdirectory.
  const r = fire(REO, {}, { cwd: sub });
  record(
    'compact: reorienter finds the snapshot the capture wrote',
    /Pre-Compact State Snapshot|Reorientation/i.test(r.out) && !/No pre-compact state found/i.test(r.out),
    `out=${r.out.trim().slice(0, 44)}`,
    'reacts'
  );
}

// ── session-start-primer.sh ─────────────────────────────────────────────────
{
  const H = hook('session-start-primer.sh');
  writeFileSync(path.join(VAULT, '.runtime/primer.md'), '# Primer\nThe session state lives here.\n');
  const r = fire(H, {}, { cwd: VAULT });
  record('primer: injects .runtime/primer.md when present', /session state lives here/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'reacts');

  const empty = mkdtempSync(path.join(os.tmpdir(), 'se-empty-'));
  const r2 = fire(H, {}, { cwd: empty });
  record('primer: degrades cleanly with no .runtime/primer.md', r2.code === 0, `code=${r2.code}`, 'quiet');
  rmSync(empty, { recursive: true, force: true });
}

// ── post-write-index-regen.sh ───────────────────────────────────────────────
// It must actually REGENERATE, not merely log that it noticed. A hook that logs
// "no regen cmd configured" forever is a hook that does nothing, dressed as one
// that does something.
//
// This assertion used to test for the ABSENCE of that string, and the negative
// control caught it: a hook replaced by a do-nothing stub writes no log at all,
// so the absent string was absent and the case passed against nothing. It now
// demands positive evidence in the log instead, which a stub cannot produce.
{
  const H = hook('post-write-index-regen.sh');
  const r = fire(H, write(`${VAULT}/Council Chamber/Skills/Demo/SKILL.md`));
  const logPath = path.join(VAULT, '.runtime', 'index-regen.log');
  const logged = existsSync(logPath) ? readFileSync(logPath, 'utf8') : '';
  const inert = /no regen cmd configured/i.test(r.out) || /no regen cmd configured/i.test(logged);
  const acted = /skills-index/i.test(logged);
  record(
    'index-regen: is wired to a real regen command',
    acted && !inert,
    !acted ? 'NO EVIDENCE it ran. Log is empty of any skills-index record.'
      : inert ? 'INERT. It only logs that it noticed.'
      : 'a regen command is configured and ran',
    'reacts'
  );
}

// ── post-bash-encoding-check.sh ─────────────────────────────────────────────
// A mojibake detector. It must WARN when a recently modified vault file carries
// the byte signature of UTF-8 read as Windows-1252, stay SILENT when the recent
// files are clean, and it must watch the PowerShell tool, which is the tool that
// causes the corruption. A detector registered on Bash alone is blind to the one
// door it exists for.
{
  const H = hook('post-bash-encoding-check.sh');
  const MOJI = `${VAULT}/Scriptorium/mojibake.md`;

  // The bytes UTF-8 leaves behind when an em dash makes the round trip through
  // Windows-1252. This is the damage, written on purpose.
  writeFileSync(MOJI, 'A corrupted em dash lives here: â€" and it should be caught.\n');
  let r = fire(H, bash('echo touched'));
  record('encoding: warns on a corrupted file in the vault', /mojibake|corruption/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'reacts');

  // Same damage, delivered by the PowerShell tool. It must still be seen.
  r = fire(H, { tool_name: 'PowerShell', tool_input: { command: `Set-Content "${MOJI}" "x"` } });
  record('encoding: watches the PowerShell tool, which causes it', /mojibake|corruption/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'reacts');

  rmSync(MOJI, { force: true });
  r = fire(H, bash('echo touched'));
  record('encoding: silent when the recent files are clean', !/mojibake|corruption/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'quiet');
}

// ── post-bash-move-audit.sh ─────────────────────────────────────────────────
// It must WARN when a moved .md still has wikilinks pointing at the old name,
// stay SILENT on a move nothing references, and it must NOT hang. A move of a
// short-named file outside the vault once made it grep the whole vault for a
// single letter, which is a stall dressed as a scan.
{
  const H = hook('post-bash-move-audit.sh');

  // A referenced file: something in the vault wikilinks to it. Moving it must warn.
  mkdirSync(path.join(VAULT, 'Library'), { recursive: true });
  writeFileSync(`${VAULT}/Council Chamber/Skills/Demo/Note.md`, '# Note\n');
  writeFileSync(`${VAULT}/Library/refers.md`, 'See [[Council Chamber/Skills/Demo/Note]] for detail.\n');
  let r = fire(H, bash('mv "Council Chamber/Skills/Demo/Note.md" "Library/Note.md"'));
  record('move-audit: warns when a moved file still has references', /move audit|wikilink|reference/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'reacts');

  // A move of a file nothing links to: correctly silent, not a false alarm.
  writeFileSync(`${VAULT}/Scriptorium/lonely.md`, '# Lonely\n');
  r = fire(H, bash('mv "Scriptorium/lonely.md" "Library/lonely.md"'));
  record('move-audit: silent on a move nothing references', !/move audit|wikilink/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'quiet');

  // THE HANG REGRESSION. A short-named .md moved OUTSIDE the vault must not send
  // the hook grepping the whole vault for its stem. Timed: a stall is a failure.
  const t0 = Date.now();
  r = fire(H, bash('mv /tmp/a.md /tmp/b.md'));
  const elapsed = Date.now() - t0;
  record('move-audit: does not stall on a short-named external move', elapsed < 10000 && !/move audit/i.test(r.out), `elapsed=${elapsed}ms`, 'quiet');
}

// ── the registration audit ──────────────────────────────────────────────────
// What this suite cannot see. Every case above fires its hook directly, which
// proves the script works and says nothing about whether a session will ever
// call it. A hook that is perfect and unregistered is a decoration.
//
// So: read the settings file, and for every hook on disk ask whether some event
// is registered whose command would reach it. An unregistered hook is a FAIL,
// not a note, because its self-test passing is precisely what makes it
// dangerous. It looks covered.
function registrationAudit() {
  const settingsPath = path.join(ROOT, '.claude', 'settings.json');
  const rows = [];
  if (!existsSync(settingsPath)) {
    return { rows, error: `no settings file at ${settingsPath}` };
  }

  let settings;
  try {
    settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
  } catch (e) {
    return { rows, error: `settings file does not parse: ${e.message}` };
  }

  // Flatten every registered command into {event, matcher, command}.
  const registered = [];
  for (const [event, groups] of Object.entries(settings.hooks || {})) {
    for (const group of groups || []) {
      for (const h of group.hooks || []) {
        registered.push({ event, matcher: group.matcher || '(all)', command: h.command || '' });
      }
    }
  }

  return { rows, registered };
}

// Every hook script actually on disk next to this file. Read from the directory
// rather than a hardcoded list, so a hook added tomorrow is audited tomorrow
// instead of being silently exempt.
const shippedHooks = readdirSync(HERE).filter((f) => f.endsWith('.sh')).sort();

const audit = registrationAudit();
const registrationRows = [];
if (audit.error) {
  registrationRows.push({ name: `registration: ${audit.error}`, ok: false, detail: 'cannot audit' });
} else {
  for (const file of shippedHooks) {
    const hits = audit.registered.filter((r) => r.command.includes(file));
    if (hits.length === 0) {
      registrationRows.push({
        name: `registration: ${file}`,
        ok: false,
        detail: 'UNREGISTERED. Nothing will ever call it.',
      });
    } else {
      const where = hits.map((h) => `${h.event}[${h.matcher}]`).join(' ');
      registrationRows.push({ name: `registration: ${file}`, ok: true, detail: where });
    }
  }

  // The specific lesson, kept as a named assertion rather than a general rule:
  // the two hooks that exist because of PowerShell must be reachable FROM
  // PowerShell. Registering them on Bash alone is the blindness itself.
  for (const file of ['post-bash-encoding-check.sh', 'post-bash-move-audit.sh']) {
    const hits = audit.registered.filter((r) => r.command.includes(file));
    const seesPS = hits.some((h) => /PowerShell/i.test(h.matcher));
    registrationRows.push({
      name: `registration: ${file} watches PowerShell`,
      ok: seesPS,
      detail: seesPS ? 'matcher includes PowerShell' : 'BLIND to the tool that causes the damage',
    });
  }
}

// ── report ──────────────────────────────────────────────────────────────────
rmSync(VAULT, { recursive: true, force: true });
rmSync(OUTSIDE, { force: true });

if (NEGATIVE) {
  // Inverted reading. A 'reacts' case that still passes against a do-nothing
  // stub is proving nothing. A 'quiet' case cannot be falsified this way and is
  // reported as such rather than counted.
  const falsifiable = results.filter((r) => r.kind === 'reacts');
  const vacuous = falsifiable.filter((r) => r.ok);

  console.log('Hooks: NEGATIVE CONTROL (every hook replaced by a do-nothing stub)');
  console.log('-'.repeat(78));
  for (const r of results) {
    if (r.kind === 'quiet') {
      console.log(`  n/a  ${r.name.padEnd(52)} asserts absence, a stub satisfies it`);
    } else if (r.ok) {
      console.log(` VACUOUS ${r.name.padEnd(49)} passed against a dead hook`);
    } else {
      console.log(`  ok   ${r.name.padEnd(52)} correctly falsified`);
    }
  }
  console.log('-'.repeat(78));
  console.log(`falsifiable=${falsifiable.length} correctly_falsified=${falsifiable.length - vacuous.length} vacuous=${vacuous.length} not_falsifiable=${results.length - falsifiable.length}`);

  if (vacuous.length > 0) {
    console.log('\nA case passed with the hook removed. It proves nothing. Rewrite it to demand positive evidence.');
    process.exit(1);
  }
  console.log('\nEvery falsifiable case failed without its hook, which is what makes the green run mean something.');
  process.exit(0);
}

const pass = results.filter((r) => r.ok).length;
const fail = results.length - pass;
const regPass = registrationRows.filter((r) => r.ok).length;
const regFail = registrationRows.length - regPass;

console.log('Hooks: positive control');
console.log('-'.repeat(78));
for (const r of results) {
  console.log(`${r.ok ? '  ok  ' : ' FAIL '} ${r.name.padEnd(52)} ${r.detail}`);
}
console.log('-'.repeat(78));
console.log('Registration audit: what firing a hook directly cannot tell you');
console.log('-'.repeat(78));
for (const r of registrationRows) {
  console.log(`${r.ok ? '  ok  ' : ' FAIL '} ${r.name.padEnd(52)} ${r.detail}`);
}
console.log('-'.repeat(78));
console.log(`behavior: pass=${pass} fail=${fail}    registration: pass=${regPass} fail=${regFail}`);

if (fail > 0 || regFail > 0) {
  console.log('\nA hook did not behave as specified, or is not wired to anything. Do not trust it until this is green.');
  process.exit(1);
}
console.log('\nEvery hook reacted to what it must react to, stayed quiet otherwise, and is registered to an event that reaches it.');
console.log('Run with --negative-control to check that these cases could have failed.');
process.exit(0);
