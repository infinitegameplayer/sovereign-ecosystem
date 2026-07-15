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
// Usage:
//   node "Council Chamber/scripts/hooks/hooks-selftest.mjs"
//
// Exit 0: every hook behaved as specified. Exit 1: read the FAIL lines.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, existsSync, rmSync, readFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const hook = (n) => path.join(HERE, n);

// A throwaway vault, so the self-test never writes into the real one.
const VAULT = mkdtempSync(path.join(os.tmpdir(), 'se-hooks-')).replace(/\\/g, '/');
mkdirSync(path.join(VAULT, 'Council Chamber', 'Skills', 'Demo'), { recursive: true });
mkdirSync(path.join(VAULT, 'Scriptorium'), { recursive: true });

const CLEAN = `${VAULT}/Scriptorium/clean.md`;
const DIRTY = `${VAULT}/Scriptorium/dirty.md`;
const OUTSIDE = path.join(os.tmpdir(), 'se-outside.md').replace(/\\/g, '/');
writeFileSync(CLEAN, 'This file is clean. No long dashes here.\n');
writeFileSync(DIRTY, 'This file has an em dash — right here.\n');
writeFileSync(OUTSIDE, 'Outside the vault, with an em dash — here.\n');

const results = [];
const record = (name, ok, detail) => {
  results.push({ name, ok, detail });
};

// Fire a hook with a payload. Returns {code, out}.
function fire(hookFile, payload, { vaultRoot = VAULT, cwd = VAULT } = {}) {
  const env = { ...process.env };
  if (vaultRoot === null) delete env.SOVEREIGN_VAULT_ROOT;
  else env.SOVEREIGN_VAULT_ROOT = vaultRoot;
  const r = spawnSync('bash', [hookFile], {
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
  record('em-dash: warns on an em dash', /em dash/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`);

  r = fire(H, write(CLEAN));
  record('em-dash: silent on a clean file', !/WARN/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`);

  // THE REGRESSION TEST. Same file, lowercased drive letter. This is the bug.
  const lowerDrive = DIRTY.replace(/^([A-Za-z]):/, (_, d) => d.toLowerCase() + ':');
  r = fire(H, write(lowerDrive));
  record(
    'em-dash: survives a lowercase drive letter',
    /em dash/i.test(r.out),
    lowerDrive === DIRTY ? '(no drive letter on this platform, vacuous)' : `out=${r.out.trim().slice(0, 40)}`
  );

  // Fail closed, never open: with no vault root it must not police the whole disk.
  r = fire(H, write(OUTSIDE), { vaultRoot: null, cwd: VAULT });
  record('em-dash: ignores a file outside the vault when unconfigured', !/WARN/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`);
}

// ── pre-write-floor-guard.sh ────────────────────────────────────────────────
// Surface-and-log, never blocking. It must react to a trust-anchor edit and
// stay quiet on an ordinary file, and it must never block either.
{
  const H = hook('pre-write-floor-guard.sh');

  let r = fire(H, write(`${VAULT}/.claude/settings.json`));
  record('floor-guard: surfaces a trust-anchor edit', /\S/.test(r.out) && r.code === 0, `code=${r.code}`);

  r = fire(H, write(CLEAN));
  record('floor-guard: quiet on an ordinary file, never blocks', r.code === 0, `code=${r.code}`);
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
    existsSync(snapshot) ? 'snapshot at vault root' : 'snapshot MISSING at vault root'
  );
  record(
    'compact: capture plants no orphan in the subdirectory',
    !existsSync(path.join(sub, '.runtime')),
    existsSync(path.join(sub, '.runtime')) ? 'ORPHAN .runtime in subdir' : 'no orphan'
  );

  // The reorienter must FIND what the capture wrote, also from a subdirectory.
  const r = fire(REO, {}, { cwd: sub });
  record(
    'compact: reorienter finds the snapshot the capture wrote',
    /Pre-Compact State Snapshot|Reorientation/i.test(r.out) && !/No pre-compact state found/i.test(r.out),
    `out=${r.out.trim().slice(0, 44)}`
  );
}

// ── session-start-primer.sh ─────────────────────────────────────────────────
{
  const H = hook('session-start-primer.sh');
  writeFileSync(path.join(VAULT, 'Primer.md'), '# Primer\nThe session state lives here.\n');
  const r = fire(H, {}, { cwd: VAULT });
  record('primer: injects Primer.md when present', /session state lives here/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`);

  const empty = mkdtempSync(path.join(os.tmpdir(), 'se-empty-'));
  const r2 = fire(H, {}, { cwd: empty });
  record('primer: degrades cleanly with no Primer.md', r2.code === 0, `code=${r2.code}`);
  rmSync(empty, { recursive: true, force: true });
}

// ── post-write-index-regen.sh ───────────────────────────────────────────────
// It must actually REGENERATE, not merely log that it noticed. A hook that logs
// "no regen cmd configured" forever is a hook that does nothing, dressed as one
// that does something.
{
  const H = hook('post-write-index-regen.sh');
  const r = fire(H, write(`${VAULT}/Council Chamber/Skills/Demo/SKILL.md`));
  const logPath = path.join(VAULT, '.runtime', 'index-regen.log');
  const logged = existsSync(logPath) ? readFileSync(logPath, 'utf8') : '';
  const inert = /no regen cmd configured/i.test(r.out) || /no regen cmd configured/i.test(logged);
  record(
    'index-regen: is wired to a real regen command',
    !inert,
    inert ? 'INERT. It only logs that it noticed.' : 'a regen command is configured'
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
  record('encoding: warns on a corrupted file in the vault', /mojibake|corruption/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`);

  // Same damage, delivered by the PowerShell tool. It must still be seen.
  r = fire(H, { tool_name: 'PowerShell', tool_input: { command: `Set-Content "${MOJI}" "x"` } });
  record('encoding: watches the PowerShell tool, which causes it', /mojibake|corruption/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`);

  rmSync(MOJI, { force: true });
  r = fire(H, bash('echo touched'));
  record('encoding: silent when the recent files are clean', !/mojibake|corruption/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`);
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
  record('move-audit: warns when a moved file still has references', /move audit|wikilink|reference/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`);

  // A move of a file nothing links to: correctly silent, not a false alarm.
  writeFileSync(`${VAULT}/Scriptorium/lonely.md`, '# Lonely\n');
  r = fire(H, bash('mv "Scriptorium/lonely.md" "Library/lonely.md"'));
  record('move-audit: silent on a move nothing references', !/move audit|wikilink/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`);

  // THE HANG REGRESSION. A short-named .md moved OUTSIDE the vault must not send
  // the hook grepping the whole vault for its stem. Timed: a stall is a failure.
  const t0 = Date.now();
  r = fire(H, bash('mv /tmp/a.md /tmp/b.md'));
  const elapsed = Date.now() - t0;
  record('move-audit: does not stall on a short-named external move', elapsed < 10000 && !/move audit/i.test(r.out), `elapsed=${elapsed}ms`);
}

// ── report ──────────────────────────────────────────────────────────────────
rmSync(VAULT, { recursive: true, force: true });
rmSync(OUTSIDE, { force: true });

const pass = results.filter((r) => r.ok).length;
const fail = results.length - pass;

console.log('Hooks: positive control');
console.log('-'.repeat(78));
for (const r of results) {
  console.log(`${r.ok ? '  ok  ' : ' FAIL '} ${r.name.padEnd(52)} ${r.detail}`);
}
console.log('-'.repeat(78));
console.log(`pass=${pass} fail=${fail}`);

if (fail > 0) {
  console.log('\nA hook did not behave as specified. Do not trust it until this is green.');
  process.exit(1);
}
console.log('\nEvery hook reacted to what it must react to, and stayed quiet otherwise.');
process.exit(0);
