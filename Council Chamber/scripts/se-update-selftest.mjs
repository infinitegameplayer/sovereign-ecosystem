#!/usr/bin/env node
// se-update-selftest.mjs
// Positive control on se-update.mjs, the only channel that tells an installed
// vault what upstream changed.
//
// Why it exists. Through v3.13.0, --check read `git diff --name-status` and
// skipped every line git reported as a rename. Git reports a rename whenever an
// upstream file moves and keeps most of its content, so a renamed framework file
// vanished from the report: not listed as removed, not listed as added. v3.14.0
// renames the To-Do Dock to Capture, which is exactly that case. The script would
// have told every installed vault nothing.
//
// What it proves, on two throwaway repos (an upstream and an installed vault):
//   1. With nothing changed upstream, --check says so and exits 2.
//   2. When upstream renames a framework file, --check lists it as a rename,
//      old path and new path both, and exits 0.
//   3. When upstream renames a seeded file, --check lists that rename too, in the
//      seeded section, and --apply refuses it.
//   4. A plain upstream edit still lists as modified, so the rename handling
//      did not cost the ordinary case.
//
// The upstream is a local folder. Git's own url.<base>.insteadOf rewrite points
// the real upstream URL at it, so the script under test runs unmodified.
//
// Usage:
//   node "Council Chamber/scripts/se-update-selftest.mjs"
//
// Exit 0: every arm behaved as specified. Exit 1: read the FAIL lines.

import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UPSTREAM_URL = 'https://github.com/infinitegameplayer/sovereign-ecosystem.git';
const SCRIPTS = 'Council Chamber/scripts';
const OLD_FW = 'Council Chamber/Protocols/Inbox/Old Name Protocol.md';
const NEW_FW = 'Council Chamber/Protocols/Inbox/New Name Protocol.md';
const EDITED_FW = 'Council Chamber/Protocols/Inbox/Edited Protocol.md';

const root = mkdtempSync(path.join(os.tmpdir(), 'se-update-pc-'));
const up = path.join(root, 'up');
const me = path.join(root, 'me');

function git(cwd, ...args) {
  return execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

function write(repo, rel, body) {
  mkdirSync(path.dirname(path.join(repo, rel)), { recursive: true });
  writeFileSync(path.join(repo, rel), body);
}

// A protocol body long enough that git's similarity check sees a rename.
const body = (title) => `# ${title}\n\n${Array.from({ length: 30 }, (_, i) => `- Rule ${i + 1}: the same line in both versions.`).join('\n')}\n`;

function seedUpstream() {
  mkdirSync(up);
  git(up, 'init', '-q', '-b', 'master');
  git(up, 'config', 'user.email', 'selftest@example.invalid');
  git(up, 'config', 'user.name', 'selftest');
  git(up, 'config', 'commit.gpgsign', 'false');
  mkdirSync(path.join(up, SCRIPTS), { recursive: true });
  copyFileSync(path.join(HERE, 'se-update.mjs'), path.join(up, SCRIPTS, 'se-update.mjs'));
  // The fixture's own manifest, so the test proves the script and not today's file list.
  // The seeded file's new name is deliberately absent: a rename away from a seeded
  // path must stay protected even when the manifest has not caught up.
  write(up, `${SCRIPTS}/framework-manifest.json`, JSON.stringify({
    default_class: 'user',
    classes: {
      framework: { patterns: ['Council Chamber/Protocols/**', `${SCRIPTS}/se-update.mjs`, `${SCRIPTS}/framework-manifest.json`] },
      seeded: { paths: ['To-Do Dock.md'] },
    },
  }, null, 2));
  write(up, OLD_FW, body('Old Name Protocol'));
  write(up, EDITED_FW, body('Edited Protocol'));
  write(up, 'To-Do Dock.md', body('To-Do Dock'));
  git(up, 'add', '-A');
  git(up, 'commit', '-q', '-m', 'v1');
}

function installVault() {
  git(root, 'clone', '-q', up, me);
  git(me, 'remote', 'add', 'upstream-se', UPSTREAM_URL);
}

function check(...args) {
  const env = {
    ...process.env,
    GIT_CONFIG_COUNT: '1',
    GIT_CONFIG_KEY_0: `url.${up.replace(/\\/g, '/')}.insteadOf`,
    GIT_CONFIG_VALUE_0: UPSTREAM_URL,
  };
  const r = spawnSync(process.execPath, [path.join(me, SCRIPTS, 'se-update.mjs'), ...args], { encoding: 'utf8', env });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
}

const results = [];
const record = (name, ok, detail) => results.push({ name, ok, detail });
const section = (out, header) => {
  const start = out.indexOf(header);
  if (start < 0) return '';
  const rest = out.slice(start + header.length);
  const end = rest.search(/\n(FRAMEWORK|SEEDED|USER) changes|\nSummary:/);
  return end < 0 ? rest : rest.slice(0, end);
};

try {
  seedUpstream();
  installVault();

  // Arm 1: nothing changed upstream.
  let r = check('--check');
  record('nothing upstream: reports up to date and exits 2', r.code === 2 && /up to date/.test(r.out), `exit ${r.code}`);

  // Upstream moves on: one framework rename, one seeded rename, one plain edit.
  git(up, 'mv', OLD_FW, NEW_FW);
  write(up, NEW_FW, body('New Name Protocol'));
  git(up, 'mv', 'To-Do Dock.md', 'Capture.md');
  write(up, EDITED_FW, `${body('Edited Protocol')}- Rule 31: new in v2.\n`);
  git(up, 'add', '-A');
  git(up, 'commit', '-q', '-m', 'v2');

  r = check('--check');
  const fw = section(r.out, 'FRAMEWORK changes');
  const seeded = section(r.out, 'SEEDED changes');
  record('framework rename: listed with both paths', fw.includes(OLD_FW) && fw.includes(NEW_FW) && /renamed/.test(fw), fw.trim().split('\n')[0] || 'no FRAMEWORK section');
  record('seeded rename: listed in the seeded section', seeded.includes('To-Do Dock.md') && seeded.includes('Capture.md'), seeded.trim().split('\n')[0] || 'no SEEDED section');
  record('plain edit: still listed as modified', fw.includes(`~ ${EDITED_FW}`), '');
  record('changes found: exits 0', r.code === 0, `exit ${r.code}`);

  // Arm 3: the seeded side of a rename is still protected.
  r = check('--apply', 'Capture.md');
  record('seeded rename: --apply refuses the new path', r.code === 1 && /Refused/.test(r.out), `exit ${r.code}`);
} catch (err) {
  record('fixture built and ran', false, err.message.split('\n')[0]);
} finally {
  rmSync(root, { recursive: true, force: true });
}

let fail = 0;
console.log('se-update: positive control');
console.log('-'.repeat(70));
for (const r of results) {
  if (!r.ok) fail += 1;
  console.log(`${r.ok ? '  ok  ' : ' FAIL '} ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
}
console.log('-'.repeat(70));
console.log(`pass=${results.length - fail} fail=${fail}`);
if (fail) {
  console.log('\nThe update script did not report what upstream changed. An installed vault would not hear about it.');
  process.exit(1);
}
console.log('\nThe update script reported every rename, edit and no-change case, and kept seeded files protected.');
