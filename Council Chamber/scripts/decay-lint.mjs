// decay-lint.mjs
// Decay Instrument. The checker for the Decay face of Claim Integrity: any
// canonical line carrying a date, a price, a model default or a "next move"
// names the condition that expires it, or carries a dated (as of YYYY-MM-DD)
// beside it. Without a checker that rule lives in prose only.
// Report-only: it never writes a note. It writes only its own baseline file,
// and only under --update-baseline.
//
// Origin: an open-source-repo harvest run, 2026-10-20. Patterns re-expressed
// from MehmetGoekce/llm-wiki (claim class plus a verification clock),
// huytieu/COG-second-brain memory-hygiene ("Unverifiable is not drifted"),
// Nocode-Cyclope/dual-brain memory-lint, eugeniughelbur/obsidian-second-brain's
// freshness policy and Pratiyush/llm-wiki's stale-reference rule. All MIT.
//
// TWO LANES
//
// canonical  Volatile claims in doctrine with no date anywhere near them. Volatile
//            means a money figure ($37, $4,500) or a model version (Opus 5.5). A claim
//            counts as dated when its line or its section heading carries a date or
//            "as of". Scope: .claude/CLAUDE.md, .claude/rules, Codices, Governance
//            and Protocols. History is excluded the way the product-fact sweep
//            excludes it: ledgers, logs, journals, dated filenames and record folders
//            (doctrine-records.mjs). Also flags "(as of YYYY-MM-DD)" stamps older than
//            --stamp-days, and a dated claim about a [[linked]] note whose last commit
//            is later than the claim's date (the linked note moved after it was read).
//
// memory     OPTIONAL. An agent auto-memory directory, passed as --memory-dir <path>.
//            When the argument is absent the lane is skipped with an informational
//            line, because the location differs per runtime and per machine. A memory
//            either asserts current behavior (a path, a price, a tool's behavior) or
//            records a ruling or preference. Rulings never come due. Behavior claims
//            carry `verified: YYYY-MM-DD` and come due after --due-days. The class is
//            read from `asserts: behavior` or `asserts: decision` (top level or under
//            metadata). Until a memory carries it, the class is inferred from its
//            type: feedback and user are rulings; project, reference and system are
//            behavior candidates. A harness-written `modified:` stamp records a
//            touch, never a check, so it is never read as verification. Backfilling
//            the field across a directory is a bulk change and runs under its own
//            plan, never from this script.
//
// Verdicts for a due memory are the Sovereign's after a read-only check: supports,
// contradicts or unverifiable. Unverifiable is not drifted.
//
// RATCHET BASELINE IN A FRESH CLONE
// The baseline is Council Chamber/scripts/decay-lint-baseline.json. A fresh clone
// has none. A missing baseline is never read as clean and never crashes:
//   - --ratchet with no baseline prints the current counts, says the ratchet is
//     NOT enforced, and exits 1 (unverified).
//   - --update-baseline with no baseline records the first one from the current
//     counts. After that the baseline only moves down.
//   - An unreadable or corrupt baseline exits 1 and names the file.
// A CI job should therefore run the bare report and the positive control, and add
// --ratchet only after a first baseline is recorded and committed.
//
// THE INSTRUMENT PROVES ITSELF. --positive-control plants every case in a
// temp-dir fixture vault and must catch each one. It never touches the real vault.
//
// Vault root resolution: SOVEREIGN_VAULT_ROOT env var if set, otherwise the two
// levels above this script's directory (scripts live in <vault>/Council Chamber/scripts/).
//
// Usage:
//   node "Council Chamber/scripts/decay-lint.mjs"                    canonical lane, summary
//   node "Council Chamber/scripts/decay-lint.mjs" --memory-dir <path> add the memory lane
//   node "Council Chamber/scripts/decay-lint.mjs" --lane=canonical   one lane (canonical, memory or all)
//   node "Council Chamber/scripts/decay-lint.mjs" --list             every finding, not only counts
//   node "Council Chamber/scripts/decay-lint.mjs" --json
//   node "Council Chamber/scripts/decay-lint.mjs" --ratchet          exit 1 if a count rose above the baseline
//   node "Council Chamber/scripts/decay-lint.mjs" --update-baseline  record current counts (refused if any rose)
//   node "Council Chamber/scripts/decay-lint.mjs" --positive-control
//   Options: --due-days=90 (memory) --stamp-days=180 (as-of stamps)
//
// Exit codes: 0 report printed (or ratchet held, or control passed),
//             1 ratchet rose or is unverified, or the positive control failed,
//             2 usage error or a lane scanned zero files (unverified, never clean).

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { join, basename, dirname, resolve } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { isRecordDir, isMarkedRecord } from './doctrine-records.mjs';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const SCRIPT_DIR = dirname(SCRIPT_PATH);
const VAULT = process.env.SOVEREIGN_VAULT_ROOT || resolve(SCRIPT_DIR, '..', '..');
const BASELINE = join(VAULT, 'Council Chamber', 'scripts', 'decay-lint-baseline.json');
const CANONICAL_ROOTS = ['.claude/CLAUDE.md', '.claude/rules', 'Council Chamber/Codices', 'Council Chamber/Governance', 'Council Chamber/Protocols'];
const HISTORY_NAME = /Ledger|Log|Journal|\d{4}-\d{2}-\d{2}/;

const MONEY = /\$\d[\d,]*(?:\.\d+)?/;
const MODEL = /\b(?:Opus|Sonnet|Haiku|Fable)\s+\d(?:\.\d)?\b/;
const DATED = /\b20\d\d-\d\d(?:-\d\d)?\b|\bas of\b/i;
const STAMP = /\(as of (20\d\d-\d\d-\d\d)\)/gi;
const LINK = /\[\[([^\]|#]+)/g;
const RULING_TYPES = new Set(['feedback', 'user']);
const BEHAVIOR_TYPES = new Set(['project', 'reference', 'system']);

const USAGE = 'Usage: node decay-lint.mjs [--memory-dir <path>] [--lane=canonical|memory|all] [--list] [--json] [--ratchet] [--update-baseline] [--due-days=N] [--stamp-days=N]\n       node decay-lint.mjs --positive-control';
const BARE_FLAGS = new Set(['--list', '--json', '--ratchet', '--update-baseline', '--positive-control']);
const EQ_FLAGS = new Set(['lane', 'due-days', 'stamp-days', 'memory-dir']);

function daysBetween(a, b) { return Math.floor((Date.parse(b) - Date.parse(a)) / 86400000); }
const today = () => new Date().toISOString().slice(0, 10);

// Canonical lane

export function scanCanonicalText(text, { stampDays = 180, now = today() } = {}) {
  const out = [];
  const lines = text.split(/\r?\n/);
  let inFm = lines[0] === '---';
  let heading = '';
  lines.forEach((line, i) => {
    if (i > 0 && inFm && line === '---') { inFm = false; return; }
    if (inFm) return;
    if (/^#{1,6} /.test(line)) { heading = line; return; }
    const volatile = MONEY.test(line) ? 'money' : MODEL.test(line) ? 'model' : null;
    if (volatile && !DATED.test(line) && !DATED.test(heading)) {
      out.push({ class: 'undated-volatile', kind: volatile, line: i + 1, text: line.trim().slice(0, 180) });
    }
    for (const m of line.matchAll(STAMP)) {
      const age = daysBetween(m[1], now);
      if (age > stampDays) out.push({ class: 'aged-stamp', line: i + 1, date: m[1], age, text: line.trim().slice(0, 180) });
      for (const l of line.matchAll(LINK)) out.push({ class: 'stamp-link', line: i + 1, date: m[1], target: l[1].trim(), text: line.trim().slice(0, 180) });
    }
  });
  return out;
}

function walkMd(root, rel, files) {
  const abs = join(root, rel);
  if (!existsSync(abs)) return;
  const st = statSync(abs);
  if (st.isFile()) { if (rel.endsWith('.md')) files.push(rel); return; }
  for (const name of readdirSync(abs)) walkMd(root, `${rel}/${name}`, files);
}

const commitCache = new Map();
function lastCommit(root, rel) {
  const key = `${root}|${rel}`;
  if (commitCache.has(key)) return commitCache.get(key);
  let d = null;
  try {
    d = execFileSync('git', ['-C', root, 'log', '-1', '--format=%cs', '--', rel], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null;
  } catch { d = null; }
  commitCache.set(key, d);
  return d;
}

function resolveTarget(root, target) {
  const withExt = target.endsWith('.md') ? target : `${target}.md`;
  return existsSync(join(root, withExt)) ? withExt : null;
}

export function canonicalScan(root, opts) {
  const files = [];
  for (const r of CANONICAL_ROOTS) walkMd(root, r, files);
  const findings = [];
  let scanned = 0;
  for (const rel of files) {
    if (HISTORY_NAME.test(basename(rel)) || isRecordDir(rel)) continue;
    const text = readFileSync(join(root, rel), 'utf8');
    if (isMarkedRecord(text)) continue;
    scanned++;
    for (const f of scanCanonicalText(text, opts)) {
      if (f.class === 'stamp-link') {
        const t = resolveTarget(root, f.target);
        const changed = t && lastCommit(root, t);
        if (changed && changed > f.date) findings.push({ ...f, class: 'stamp-outlived', file: rel, targetChanged: changed });
        continue;
      }
      findings.push({ ...f, file: rel });
    }
  }
  return { scanned, findings };
}

// Memory lane

export function classifyMemory(text, { dueDays = 90, now = today() } = {}) {
  const fm = (text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/) || [])[1] || '';
  const field = k => ((fm.match(new RegExp(`^\\s*${k}:\\s*["']?([^"'\\n]+)`, 'm')) || [])[1] || '').trim();
  const type = field('type').toLowerCase();
  const asserts = field('asserts').toLowerCase();
  const verified = field('verified');
  const cls = asserts === 'behavior' || asserts === 'decision' ? asserts
    : RULING_TYPES.has(type) ? 'decision'
    : BEHAVIOR_TYPES.has(type) ? 'behavior' : 'unknown';
  const inferred = !asserts;
  if (cls !== 'behavior') return { cls, inferred, type, state: cls === 'decision' ? 'never-due' : 'unclassified' };
  if (!/^20\d\d-\d\d-\d\d$/.test(verified)) return { cls, inferred, type, state: 'never-verified' };
  const age = daysBetween(verified, now);
  return { cls, inferred, type, verified, age, state: age > dueDays ? 'due' : 'current' };
}

export function memoryScan(dir, opts) {
  const findings = [];
  const tally = {};
  let scanned = 0;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.md') || name === 'MEMORY.md') continue;
    scanned++;
    const r = classifyMemory(readFileSync(join(dir, name), 'utf8'), opts);
    tally[r.state] = (tally[r.state] || 0) + 1;
    if (r.inferred && r.cls === 'behavior') tally['class inferred from type'] = (tally['class inferred from type'] || 0) + 1;
    if (r.state === 'due' || r.state === 'never-verified' || r.state === 'unclassified') findings.push({ file: name, ...r });
  }
  return { scanned, findings, tally };
}

// Ratchet

export function counts(c, m) {
  const out = {};
  if (c) {
    out.canonical_undated = c.findings.filter(f => f.class === 'undated-volatile').length;
    out.canonical_aged_or_outlived = c.findings.filter(f => f.class !== 'undated-volatile').length;
  }
  if (m) out.memory_unverified_or_due = m.findings.length;
  return out;
}

export function ratchet(current, update, baselinePath = BASELINE) {
  let base = null;
  if (existsSync(baselinePath)) {
    try { base = JSON.parse(readFileSync(baselinePath, 'utf8')); } catch (e) { console.error(`Ratchet: baseline unreadable (${e.message}). Unverified.`); return 1; }
    if (base === null || typeof base !== 'object' || Array.isArray(base)) { console.error('Ratchet: baseline is not a JSON object. Unverified.'); return 1; }
  }
  const keys = Object.keys(current);
  const rose = base ? keys.filter(k => Number.isInteger(base[k]) && current[k] > base[k]) : [];
  if (update) {
    if (rose.length) { rose.forEach(k => console.error(`Ratchet: ${k} ${current[k]} is above the baseline ${base[k]}. The baseline only moves down.`)); return 1; }
    writeFileSync(baselinePath, JSON.stringify({ ...(base || {}), ...current, recorded: today(), note: 'Written by decay-lint.mjs --update-baseline. Only ever lowered.' }, null, 2) + '\n', 'utf8');
    console.log(`Ratchet: baseline recorded ${today()}: ${keys.map(k => `${k} ${current[k]}`).join(', ')}.`);
    return 0;
  }
  if (!base) {
    console.error(`Ratchet: NO BASELINE at ${baselinePath}. The ratchet is not enforced and this is not a clean result. Current counts: ${keys.map(k => `${k} ${current[k]}`).join(', ')}. Run --update-baseline once to record the first baseline.`);
    return 1;
  }
  for (const k of keys) {
    const b = base[k];
    const state = !Number.isInteger(b) ? 'no baseline for this key' : current[k] > b ? 'ROSE' : current[k] < b ? 'lowered (run --update-baseline to lock it in)' : 'held';
    console.log(`Ratchet: ${k.padEnd(28)} ${String(current[k]).padStart(5)} / baseline ${String(b ?? '-').padStart(5)}  ${state}`);
  }
  return rose.length ? 1 : 0;
}

// Positive control

function quiet(fn) {
  const log = console.log, err = console.error;
  console.log = () => {}; console.error = () => {};
  try { return fn(); } finally { console.log = log; console.error = err; }
}

function positiveControl() {
  let pass = 0, fail = 0;
  const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? 'PASS' : 'FAIL'}  ${m}`); };
  const now = '2026-10-20';

  // Text-level cases.
  const doc = [
    '---', 'price: "$99 in frontmatter is metadata"', '---',
    'The Playbook sells at $37.',
    'The Playbook sold at $37 on 2026-09-01.',
    '## Pricing (as of 2026-10-01)',
    'The seat is $4,500 a month.',
    '## Models',
    'Workers run on Sonnet 5.5.',
    'Stamped long ago (as of 2025-12-01).',
    'Fresh stamp (as of 2026-10-10).',
  ].join('\n');
  const f = scanCanonicalText(doc, { now });
  const undated = f.filter(x => x.class === 'undated-volatile').map(x => x.line);
  ok(undated.includes(4), 'an undated price line is flagged');
  ok(!undated.includes(5), 'a price with a date on its line passes');
  ok(!undated.includes(7), 'a price under a dated heading passes');
  ok(!undated.includes(2), 'frontmatter is never scanned');
  ok(undated.includes(9), 'an undated model version is flagged');
  ok(f.some(x => x.class === 'aged-stamp' && x.line === 10), 'an (as of) stamp past the window is flagged');
  ok(!f.some(x => x.class === 'aged-stamp' && x.line === 11), 'a fresh (as of) stamp passes');
  const mem = (type, extra = '') => `---\nname: x\nmetadata:\n  type: ${type}\n${extra}---\nbody\n`;
  ok(classifyMemory(mem('feedback'), { now }).state === 'never-due', 'a feedback memory is a ruling and never comes due');
  ok(classifyMemory(mem('reference'), { now }).state === 'never-verified', 'a reference memory with no verified date is flagged');
  ok(classifyMemory(mem('reference', '  verified: 2026-10-01\n'), { now }).state === 'current', 'a recently verified behavior memory passes');
  ok(classifyMemory(mem('project', '  verified: 2026-05-01\n'), { now }).state === 'due', 'a behavior memory verified past the window comes due');
  ok(classifyMemory(mem('reference', '  asserts: decision\n'), { now }).state === 'never-due', 'an explicit asserts: decision overrides the type');
  ok(classifyMemory(mem('reference', '  modified: 2026-10-19T10:00:00Z\n'), { now }).state === 'never-verified', 'a harness modified stamp is never read as verification');

  // Fixture-vault cases: the lanes, the ratchet and the entry point, in a temp dir.
  const dir = mkdtempSync(join(tmpdir(), 'decay-lint-'));
  try {
    const put = (rel, body) => { const p = join(dir, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, body, 'utf8'); };
    put('.claude/CLAUDE.md', '# Root\nThe fee is $50 a month.\n');
    put('Council Chamber/Codices/Pricing Codex.md', '# Pricing\nPlans start at $10.\nDated plan at $20 on 2026-01-01.\nOld (as of 2020-01-01).\n');
    put('Council Chamber/Codices/Sales Ledger.md', '# Ledger\nHistory at $999.\n');
    put('Council Chamber/Codices/Marked Report.md', '---\ndoctrine: false\n---\nAudit at $888.\n');
    const c = canonicalScan(dir, { now });
    const cu = c.findings.filter(x => x.class === 'undated-volatile');
    ok(c.scanned === 2, `lane scans only live doctrine (2 files, got ${c.scanned})`);
    ok(cu.length === 2 && cu.some(x => x.file.endsWith('CLAUDE.md')) && cu.some(x => x.file.endsWith('Pricing Codex.md')), `fixture lane finds exactly the two planted undated prices (got ${cu.length})`);
    ok(!c.findings.some(x => /Ledger|Marked/.test(x.file)), 'history-named and doctrine: false files are excluded');
    ok(c.findings.some(x => x.class === 'aged-stamp'), 'fixture lane finds the planted aged stamp');
    ok(canonicalScan(join(dir, 'nowhere'), { now }).scanned === 0, 'an empty root scans zero files');

    const memDir = join(dir, 'mem');
    put('mem/MEMORY.md', '# index\n');
    put('mem/a.md', mem('feedback'));
    put('mem/b.md', mem('reference'));
    put('mem/c.md', mem('project', '  verified: 2026-10-10\n'));
    const m = memoryScan(memDir, { now, dueDays: 90 });
    ok(m.scanned === 3 && m.findings.length === 1 && m.findings[0].file === 'b.md', 'memory lane flags only the never-verified behavior memory and skips the index');

    // Ratchet against a fixture baseline path.
    const bl = join(dir, 'baseline.json');
    const cur = { canonical_undated: 5, canonical_aged_or_outlived: 1 };
    ok(quiet(() => ratchet(cur, false, bl)) === 1, 'ratchet with NO baseline exits 1 and is never read as clean');
    ok(quiet(() => ratchet(cur, true, bl)) === 0 && existsSync(bl), 'update-baseline records the first baseline');
    ok(quiet(() => ratchet(cur, false, bl)) === 0, 'ratchet holds at the baseline');
    ok(quiet(() => ratchet({ ...cur, canonical_undated: 6 }, false, bl)) === 1, 'ratchet fails when a count rises');
    ok(quiet(() => ratchet({ ...cur, canonical_undated: 6 }, true, bl)) === 1, 'update-baseline refuses to raise the baseline');
    ok(quiet(() => ratchet({ ...cur, canonical_undated: 3 }, true, bl)) === 0 && JSON.parse(readFileSync(bl, 'utf8')).canonical_undated === 3, 'update-baseline lowers the baseline');
    writeFileSync(bl, '{not json', 'utf8');
    ok(quiet(() => ratchet(cur, false, bl)) === 1, 'a corrupt baseline exits 1 without a stack trace');

    // Entry point against the fixture vault and an empty one.
    const run = (root, args) => spawnSync(process.execPath, [SCRIPT_PATH, ...args], { env: { ...process.env, SOVEREIGN_VAULT_ROOT: root }, encoding: 'utf8' });
    const r1 = run(dir, []);
    ok(r1.status === 0 && /Undated volatile claims: 2/.test(r1.stdout) && /Memory lane skipped/.test(r1.stdout), 'bare run on the fixture reports 2 and skips the memory lane with an info line');
    const r2 = run(join(dir, 'empty-root'), []);
    ok(r2.status === 2, 'bare run on an empty root exits 2 (unverified, never clean)');
    const r3 = run(dir, ['--memory-dir', memDir]);
    ok(r3.status === 0 && /Memory: 3 files/.test(r3.stdout), '--memory-dir adds the memory lane');
    const r4 = run(dir, ['--bogus']);
    ok(r4.status === 2 && !/\n\s+at /.test(r4.stderr), 'an unknown argument exits 2 without a stack trace');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  console.log(`\npositive control: ${pass} passed, ${fail} failed`);
  return fail === 0 && pass > 0 ? 0 : 1;
}

// Main

function usageError(msg) {
  console.error(`decay-lint: ${msg}\n${USAGE}`);
  process.exit(2);
}

function main() {
  const raw = process.argv.slice(2);
  // Normalize "--memory-dir <path>" to "--memory-dir=<path>".
  const args = [];
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === '--memory-dir') {
      if (raw[i + 1] === undefined || raw[i + 1].startsWith('--')) usageError('--memory-dir needs a path.');
      args.push(`--memory-dir=${raw[++i]}`);
    } else args.push(raw[i]);
  }
  for (const a of args) {
    const key = a.startsWith('--') ? a.slice(2).split('=')[0] : null;
    if (!(BARE_FLAGS.has(a) || (key && EQ_FLAGS.has(key) && a.includes('=')))) usageError(`unknown argument "${a}".`);
  }
  if (args.includes('--positive-control')) process.exit(positiveControl());
  const opt = k => { const a = args.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : undefined; };
  const memoryDir = opt('memory-dir');
  const lane = opt('lane') || 'all';
  if (!['all', 'canonical', 'memory'].includes(lane)) usageError('--lane must be canonical, memory or all.');
  const dueDays = Number(opt('due-days') ?? 90), stampDays = Number(opt('stamp-days') ?? 180);
  if (!Number.isFinite(dueDays) || !Number.isFinite(stampDays) || dueDays < 0 || stampDays < 0) usageError('--due-days and --stamp-days must be non-negative numbers.');
  const opts = { dueDays, stampDays };

  if (lane === 'memory' && !memoryDir) usageError('--lane=memory needs --memory-dir <path>.');
  const runMemory = lane !== 'canonical' && Boolean(memoryDir);
  let m = null;
  if (runMemory) {
    if (!existsSync(memoryDir) || !statSync(memoryDir).isDirectory()) {
      console.error(`decay-lint: memory directory not found: ${memoryDir}. Unverified, never clean.`);
      process.exit(2);
    }
    m = memoryScan(memoryDir, opts);
  }
  const c = lane !== 'memory' ? canonicalScan(VAULT, opts) : null;

  if ((c && c.scanned === 0) || (m && m.scanned === 0)) {
    console.error(`decay-lint: a lane scanned zero files (canonical ${c ? c.scanned : '-'}, memory ${m ? m.scanned : '-'}) under ${VAULT}. Unverified, never clean. Set SOVEREIGN_VAULT_ROOT or run from inside the vault.`);
    process.exit(2);
  }
  if (args.includes('--ratchet') || args.includes('--update-baseline')) {
    process.exit(ratchet(counts(c, m), args.includes('--update-baseline')));
  }
  if (args.includes('--json')) { console.log(JSON.stringify({ canonical: c, memory: m, counts: counts(c, m) }, null, 2)); return; }

  console.log('Decay Instrument');
  console.log('----------------');
  if (c) {
    const by = k => c.findings.filter(f => f.class === k);
    console.log(`Canonical: ${c.scanned} doctrine files. Undated volatile claims: ${by('undated-volatile').length}. Aged (as of) stamps: ${by('aged-stamp').length}. Stamps outlived by their linked note: ${by('stamp-outlived').length}.`);
    const perFile = {};
    for (const f of by('undated-volatile')) perFile[f.file] = (perFile[f.file] || 0) + 1;
    for (const [file, n] of Object.entries(perFile).sort((a, b) => b[1] - a[1]).slice(0, args.includes('--list') ? Infinity : 8)) console.log(`  ${String(n).padStart(3)}  ${file}`);
    if (args.includes('--list')) for (const f of c.findings) console.log(`  ${f.class.padEnd(16)} ${f.file}:${f.line}  ${f.text}`);
  }
  if (m) {
    console.log(`Memory: ${m.scanned} files. ${Object.entries(m.tally).map(([k, v]) => `${k} ${v}`).join(', ')}.`);
    console.log('  Rulings and preferences never come due. Behavior claims come due on the clock; a never-verified one has no date at all.');
    if (args.includes('--list')) for (const f of m.findings) console.log(`  ${f.state.padEnd(15)} ${f.type.padEnd(10)} ${f.file}`);
  } else if (lane !== 'canonical') {
    console.log('Memory lane skipped: no --memory-dir <path> given.');
  }
  console.log('\nReport only. Nothing was written. Fixes are dated or retired at their canonical home, with the Sovereign ruling on any due memory.');
}

try { main(); } catch (e) { console.error(`decay-lint: ${e.message}`); process.exit(2); }
