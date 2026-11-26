#!/usr/bin/env node
// update-channel-check.mjs
// Does every address this repo gives an installed vault for reading upstream point at
// something that exists?
//
// THE GAP IT CLOSES. The Ecosystem Update Check skill fetched its index from
// `.../sovereign-ecosystem/main/UPDATES/INDEX.md` from the first release on. The branch
// has always been `master`, and from v3.10.0 the updates lived in `.github/UPDATES/`. Every
// run of the skill read "404: Not Found" and halted, so no installed vault ever learned of
// an update through it. Nothing failed loudly: `curl -s` exits 0 on a 404, the skill's prose
// named the right folder, and every check in CI ran inside the checkout, where no address
// is ever fetched. Found and fixed in v3.26.0.
//
// WHAT IT CHECKS, offline, against the checkout itself. Every
// `raw.githubusercontent.com/infinitegameplayer/sovereign-ecosystem/<branch>/<path>` address
// in a shipped text file must name the branch `se-update.mjs` pulls from (its
// UPSTREAM_BRANCH), and its path must exist in the checkout. A path holding `[date]-[slug]`
// is resolved against the newest row of `.github/UPDATES/INDEX.md`; any other bracketed
// placeholder fails, since the check cannot prove where it lands. A file of zero addresses
// is fine. A repo where the check finds zero addresses at all fails, because the skill
// that carries them is shipped and the check would then be aimed at nothing.
//
// Usage (from the vault root):
//   node "Council Chamber/scripts/update-channel-check.mjs"            check this checkout
//   node "Council Chamber/scripts/update-channel-check.mjs" --selftest plants broken addresses and a control
// Exit 0 clean, 1 on any broken address or a failed selftest, 2 on usage.

import { readFileSync, readdirSync, statSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
const TEXT = new Set(['.md', '.mjs', '.js', '.json', '.sh', '.yml', '.yaml', '.txt']);
const SKIP_DIRS = new Set(['.git', 'node_modules']);
const RAW = /https:\/\/raw\.githubusercontent\.com\/infinitegameplayer\/sovereign-ecosystem\/([^/\s`'")]+)\/([^\s`'")]+)/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (TEXT.has(extname(name))) out.push(p);
  }
  return out;
}

function upstreamBranch(root) {
  const src = readFileSync(join(root, 'Council Chamber/scripts/se-update.mjs'), 'utf8');
  const m = src.match(/const UPSTREAM_BRANCH = '([^']+)'/);
  if (!m) throw new Error('UPSTREAM_BRANCH not found in se-update.mjs');
  return m[1];
}

function newestUpdate(root) {
  const idx = join(root, '.github/UPDATES/INDEX.md');
  if (!existsSync(idx)) return null;
  for (const line of readFileSync(idx, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\|\s*(\d{4}-\d{2}-\d{2})\s*\|[^|]*\|[^|]*\|\s*([^|\s]+)\s*\|/);
    if (m) return { date: m[1], slug: m[2] };
  }
  return null;
}

export function check(root) {
  const branch = upstreamBranch(root);
  const newest = newestUpdate(root);
  const problems = [];
  let seen = 0;
  for (const file of walk(root)) {
    const rel = relative(root, file).replace(/\\/g, '/');
    if (rel.startsWith('.github/UPDATES/') && rel !== '.github/UPDATES/INDEX.md') continue; // dated history, kept verbatim
    if (rel === '.github/CHANGELOG.md') continue; // history, kept verbatim
    if (rel === 'Council Chamber/scripts/update-channel-check.mjs') continue; // its own header quotes the broken address
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(RAW)) {
      seen++;
      const [url, br, rawPath] = m;
      let path = rawPath.replace(/[.,;:]+$/, '');
      if (br !== branch) { problems.push(`${rel}: ${url} names branch "${br}", upstream is "${branch}"`); continue; }
      if (path.includes('[date]-[slug]')) {
        if (!newest) { problems.push(`${rel}: ${url} needs .github/UPDATES/INDEX.md rows to resolve [date]-[slug]`); continue; }
        path = path.replace('[date]-[slug]', `${newest.date}-${newest.slug}`);
      }
      if (/\[[^\]]+\]/.test(path)) { problems.push(`${rel}: ${url} holds a placeholder this check cannot resolve`); continue; }
      if (!existsSync(join(root, path))) problems.push(`${rel}: ${url} points at ${path}, which is not in the checkout`);
    }
  }
  if (seen === 0) problems.push('no upstream address found anywhere: the check is aimed at nothing');
  return { seen, problems };
}

function selftest() {
  const results = [];
  const base = mkdtempSync(join(tmpdir(), 'channel-'));
  const make = (name, skillText) => {
    const r = join(base, name);
    mkdirSync(join(r, 'Council Chamber/scripts'), { recursive: true });
    mkdirSync(join(r, '.github/UPDATES'), { recursive: true });
    mkdirSync(join(r, 'Council Chamber/Skills/Check'), { recursive: true });
    writeFileSync(join(r, 'Council Chamber/scripts/se-update.mjs'), "const UPSTREAM_BRANCH = 'master';\n");
    writeFileSync(join(r, '.github/UPDATES/INDEX.md'), '| Date | Type | Optional | Slug | Title |\n|---|---|---|---|---|\n| 2026-11-25 | core | no | v9.9.9-x | X |\n');
    writeFileSync(join(r, '.github/UPDATES/2026-11-25-v9.9.9-x.md'), 'x\n');
    writeFileSync(join(r, 'Council Chamber/Skills/Check/SKILL.md'), skillText);
    return r;
  };
  const U = 'https://raw.githubusercontent.com/infinitegameplayer/sovereign-ecosystem';
  const cases = [
    ['control: right branch, right folder, [date]-[slug]', `curl -fsSL ${U}/master/.github/UPDATES/INDEX.md\ncurl -fsSL ${U}/master/.github/UPDATES/[date]-[slug].md\n`, 'clean'],
    ['the shipped v3.25.0 index address (main, root UPDATES)', `curl -s ${U}/main/UPDATES/INDEX.md\n`, 'broken'],
    ['right branch, old root folder', `curl -s ${U}/master/UPDATES/INDEX.md\n`, 'broken'],
    ['the shipped v3.25.0 update address ([slug] alone)', `curl -s ${U}/master/.github/UPDATES/[slug].md\n`, 'broken'],
    ['wrong branch, right folder', `curl -s ${U}/main/.github/UPDATES/INDEX.md\n`, 'broken'],
    ['no address anywhere', 'nothing here\n', 'broken'],
  ];
  try {
    cases.forEach(([label, text, expect], i) => {
      const r = check(make(`c${i}`, text));
      const actual = r.problems.length ? 'broken' : 'clean';
      results.push([label, expect, actual]);
    });
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
  let miss = 0;
  for (const [label, expect, actual] of results) {
    const ok = expect === actual;
    if (!ok) miss++;
    console.log(`${ok ? '  ok ' : ' MISS'}  ${label}  expected: ${expect}  actual: ${actual}`);
  }
  console.log(`selftest: ${results.length - miss} of ${results.length} as expected`);
  return miss === 0;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url).replace(/\\/g, '/') === process.argv[1].replace(/\\/g, '/');
if (isMain) {
  const arg = process.argv[2];
  if (arg === '--selftest') process.exit(selftest() ? 0 : 1);
  if (arg && arg !== '--help') { console.error(`unknown argument ${arg}. Usage: update-channel-check.mjs [--selftest]`); process.exit(2); }
  if (arg === '--help') { console.log('Usage: node "Council Chamber/scripts/update-channel-check.mjs" [--selftest]'); process.exit(0); }
  const root = process.env.SOVEREIGN_VAULT_ROOT || join(HERE, '..', '..');
  const { seen, problems } = check(root);
  for (const p of problems) console.log(`BROKEN  ${p}`);
  console.log(`${seen} upstream address(es) read, ${problems.length} broken`);
  process.exit(problems.length ? 1 : 0);
}
