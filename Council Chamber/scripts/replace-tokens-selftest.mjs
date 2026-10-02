#!/usr/bin/env node
// replace-tokens-selftest.mjs
// Positive control on replace-tokens.mjs, the first script every Sovereign runs.
//
// Why it exists. In v3.10.0 the scripts folder moved from the vault root into
// Council Chamber/, and replace-tokens.mjs kept resolving the vault as the
// parent of its own folder. From then until v3.13.0 it personalized only the
// files inside Council Chamber/ and reported success. Your trust anchor,
// .claude/CLAUDE.md, kept saying "This vault is the {{ECOSYSTEM_NAME}}". Nothing
// fired the script, so nothing noticed.
//
// What it proves, on a throwaway copy of this vault:
//   1. Answering YES leaves zero identity tokens anywhere the script is meant
//      to reach, and .claude/CLAUDE.md carries the answer.
//   2. Answering anything other than YES writes nothing. The confirmation gate
//      refuses, which is the promise the script makes before it touches a file.
//
// Usage:
//   node "Council Chamber/scripts/replace-tokens-selftest.mjs"
//
// Exit 0: both arms behaved as specified. Exit 1: read the FAIL lines.

import { spawn } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const VAULT = path.resolve(HERE, '..', '..');
const TOKEN_RE = /\{\{(ECOSYSTEM_NAME|AI_INTERFACE_NAME|SOVEREIGN_DISPLAY_NAME)\}\}/;
const SKIP = new Set(['.git', '.github', 'node_modules', '.runtime', '.trash', 'scripts']);

function copyVault() {
  const dest = mkdtempSync(path.join(os.tmpdir(), 'tokens-pc-'));
  cpSync(VAULT, dest, {
    recursive: true,
    // The skill link directories hold junctions to this vault's own skills.
    // They are git-ignored and machine-local, so the copy leaves them out.
    filter: (src) => !['.git', 'node_modules'].includes(path.basename(src))
      && !/[\\/]\.(claude|codex)[\\/]skills$/.test(src),
  });
  return dest;
}

// Files carrying a token, using the same skip list the script uses.
function tokenFiles(root) {
  const hits = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (SKIP.has(name)) continue;
      const p = path.join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(md|txt|json)$/.test(name) && TOKEN_RE.test(readFileSync(p, 'utf8'))) {
        hits.push(path.relative(root, p).replace(/\\/g, '/'));
      }
    }
  };
  walk(root);
  return hits;
}

// Answer each prompt as it appears. Piped stdin closes readline early, so the
// answers are written one at a time in response to the prompt text.
function drive(root, confirm) {
  return new Promise((resolve) => {
    const answers = ['Testland', 'Aria', 'Sam', '', ''];
    const child = spawn(process.execPath, [path.join(root, 'Council Chamber', 'scripts', 'replace-tokens.mjs')], { cwd: root });
    let buf = '';
    let i = 0;
    const timer = setTimeout(() => child.kill(), 60000);
    child.stdout.on('data', (d) => {
      buf += d.toString();
      if (/leave blank to skip: $/.test(buf) && i < answers.length) {
        buf = '';
        child.stdin.write(`${answers[i++]}\n`);
      } else if (/Type YES to proceed: $/.test(buf)) {
        buf = '';
        child.stdin.write(`${confirm}\n`);
      }
    });
    child.on('exit', (code) => { clearTimeout(timer); resolve(code); });
  });
}

const results = [];
const record = (name, ok, detail) => results.push({ name, ok, detail });

// Arm 1: YES personalizes everything.
let copy = copyVault();
const before = tokenFiles(copy);
record('the vault ships identity tokens to replace', before.length > 0, `${before.length} file(s)`);
record('.claude/CLAUDE.md is one of them', before.includes('.claude/CLAUDE.md'), '');
let code = await drive(copy, 'YES');
let left = tokenFiles(copy);
record('YES: the script exits cleanly', code === 0, `exit=${code}`);
record('YES: no identity token is left anywhere', left.length === 0, left.slice(0, 5).join(', '));
record('YES: .claude/CLAUDE.md carries the answer', /Testland/.test(readFileSync(path.join(copy, '.claude', 'CLAUDE.md'), 'utf8')), '');
rmSync(copy, { recursive: true, force: true });

// Arm 2: anything but YES writes nothing.
copy = copyVault();
code = await drive(copy, 'no');
left = tokenFiles(copy);
record('not YES: every token is still in place', left.length === before.length, `${left.length} of ${before.length}`);
rmSync(copy, { recursive: true, force: true });

let fail = 0;
console.log('replace-tokens: positive control');
console.log('-'.repeat(70));
for (const r of results) {
  if (!r.ok) fail += 1;
  console.log(`${r.ok ? '  ok  ' : ' FAIL '} ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
}
console.log('-'.repeat(70));
console.log(`pass=${results.length - fail} fail=${fail}`);
if (fail) {
  console.log('\nThe token script did not behave as specified. A new Sovereign would meet this on day one.');
  process.exit(1);
}
console.log('\nThe token script reached every file it promises and wrote nothing without a YES.');
