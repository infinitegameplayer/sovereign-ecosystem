#!/usr/bin/env node
// decision-journal.mjs
// Compile a read-only Decision Journal from #decision-tagged entries across the vault.
//
// Harvest, never double-enter. Decisions stay recorded where they land, in plan
// activity logs, charters and registers. This lens indexes them, so "what did I
// decide, when, and why" is one read instead of a grep. That is the ecosystem's
// first governance principle applied to its own record: state once, point elsewhere.
//
// A line qualifies when it carries the #decision tag or the [Decision] marker.
// Output: Council Chamber/Governance/Decision Journal.md, generated, never hand-edited.
//
// Usage:
//   node "Council Chamber/scripts/decision-journal.mjs"
//   node "Council Chamber/scripts/decision-journal.mjs" --check
//   node "Council Chamber/scripts/decision-journal.mjs" --force
//   node "Council Chamber/scripts/decision-journal.mjs" --positive-control
//
// ── THE GUARD, AND WHY IT IS SHAPED THIS WAY ────────────────────────────────
//
// A generated file has a specific failure mode: the scan breaks, harvests
// nothing, and cheerfully overwrites a good journal with an empty one. The file
// still exists, still looks generated, and the loss is silent.
//
// The obvious guard is a floor: refuse below N entries. That is wrong here. A
// new vault legitimately has zero decisions, so a fixed floor would make this
// script fail on first run for every new user, and a tool that fails on day one
// gets deleted on day one.
//
// So the guard is RELATIVE. It compares this harvest against the count the last
// generated journal recorded for itself. A collapse from many to almost none is
// a broken scan. Zero to zero is a Tuesday. Growth is never suspicious.
//
// `--force` overrides it, for the case where a large deletion was real.
// `--positive-control` proves the guard actually refuses, because a guard that
// has never been fired is not known to work. It ships with this script and is
// not optional.

import { readdir, readFile, writeFile, mkdtemp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const VAULT = process.env.SOVEREIGN_VAULT_ROOT || '.';
const OUTPUT_REL = join('Council Chamber', 'Governance', 'Decision Journal.md');
const SKIP_DIRS = new Set(['node_modules']);
const ENTRY_MAX = 400;

// A harvest may fall to this fraction of the previous one before it is treated
// as a broken scan rather than a real deletion.
const COLLAPSE_RATIO = 0.5;
// Below this many previous entries the ratio is noise, so the guard stands down.
const COLLAPSE_MIN = 5;

const isSkipped = (name) => name.startsWith('.') || SKIP_DIRS.has(name);

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (isSkipped(e.name)) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile() && e.name.endsWith('.md')) yield full;
  }
}

// Two things look exactly like a tagged decision and are not one. Both were
// found by running this against a fresh vault, where every single "decision" it
// harvested was one of these:
//
//   1. The tag inside a code span. `#decision` in backticks is a document
//      NAMING the convention, which every protocol and template does. Naming a
//      tag is not applying it.
//   2. An unfilled template placeholder, which still carries YYYY-MM-DD where a
//      real date belongs.
//
// Without these, a new user's first run returns a journal of documentation about
// journals. That is worse than an empty one, because it looks like it worked.
function isTagged(line) {
  const spoken = line.replace(/`[^`]*`/g, '');
  if (!/#decision\b/.test(spoken) && !spoken.includes('[Decision]')) return false;
  if (/YYYY-MM-DD/.test(line)) return false;
  return true;
}

function harvestLines(content, relPath) {
  const out = [];
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (!isTagged(line)) continue;
    const dateMatch = line.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
    let text = line.replace(/^[-*]\s*/, '');
    if (text.length > ENTRY_MAX) text = text.slice(0, ENTRY_MAX) + ' ...';
    out.push({ date: dateMatch ? dateMatch[1] : 'undated', text, source: relPath });
  }
  return out;
}

async function collect(root) {
  const decisions = [];
  const outAbs = join(root, OUTPUT_REL).replace(/\\/g, '/');
  for await (const file of walk(root)) {
    const abs = file.replace(/\\/g, '/');
    if (abs === outAbs) continue;
    if (abs.includes('/Council Chamber/scripts/')) continue;
    const rel = abs.startsWith(root.replace(/\\/g, '/'))
      ? abs.slice(root.replace(/\\/g, '/').length).replace(/^\//, '')
      : abs;
    const content = await readFile(file, 'utf8');
    decisions.push(...harvestLines(content, rel));
  }
  decisions.sort((a, b) =>
    a.date === b.date ? a.source.localeCompare(b.source) : b.date.localeCompare(a.date));
  return decisions;
}

// The count the previous journal recorded for itself. Null when there is no
// previous journal, which is the first-run case and is never suspicious.
function previousCount(existing) {
  if (!existing) return null;
  const m = existing.match(/^Entries:\s*(\d+)\./m);
  return m ? Number(m[1]) : null;
}

// The guard itself, kept a pure function so the positive control can fire it
// directly without staging a whole vault for every case.
export function collapseVerdict(prev, next) {
  if (prev === null) return { refuse: false, reason: 'first run, nothing to compare' };
  if (prev < COLLAPSE_MIN) return { refuse: false, reason: 'previous count too small to judge' };
  if (next >= prev * COLLAPSE_RATIO) return { refuse: false, reason: 'within tolerance' };
  return {
    refuse: true,
    reason: `harvest collapsed from ${prev} to ${next}, below ${Math.ceil(prev * COLLAPSE_RATIO)}`,
  };
}

function render(decisions, today) {
  const lines = [
    '---',
    'name: Decision Journal',
    'type: governance-lens',
    'status: active',
    `generated: ${today}`,
    'owner: generated by Council Chamber/scripts/decision-journal.mjs',
    '---',
    '',
    '# Decision Journal',
    '',
    'A read-only lens over every #decision-tagged entry in this vault. Sources are canonical. This journal is generated output and is never edited by hand, because a manual edit is overwritten on the next run. Regenerate with `node "Council Chamber/scripts/decision-journal.mjs"`.',
    '',
    `Entries: ${decisions.length}. Grouped by month, newest first. Undated entries last.`,
    '',
  ];
  if (decisions.length === 0) {
    lines.push(
      'No tagged decisions yet. Tag a line with `#decision` anywhere in the vault and run this again.',
      '',
      'A decision line reads well as a sentence: what was decided, on what date, and the reason. Example:',
      '',
      '`- 2026-01-14 #decision Chose weekly review over daily standup. Daily cost more attention than it returned.`',
      ''
    );
    return lines.join('\n');
  }
  let currentMonth = null;
  const dated = decisions.filter((d) => d.date !== 'undated');
  const undated = decisions.filter((d) => d.date === 'undated');
  for (const d of dated) {
    const month = d.date.slice(0, 7);
    if (month !== currentMonth) {
      currentMonth = month;
      lines.push(`## ${month}`, '');
    }
    const link = d.source.replace(/\.md$/, '');
    lines.push(`- **${d.date}** . [[${link}]] . ${d.text}`);
  }
  if (undated.length) {
    lines.push('', '## Undated', '');
    for (const d of undated) {
      const link = d.source.replace(/\.md$/, '');
      lines.push(`- [[${link}]] . ${d.text}`);
    }
  }
  lines.push('');
  return lines.join('\n');
}

// ── the positive control ────────────────────────────────────────────────────
// Fires the guard rather than reading it. Three cases: it must REFUSE a
// collapse, ALLOW an honest empty first run, and ALLOW growth. A guard that
// refuses everything has traded a hole for a wall, and the wall is also a
// failure, so the allow cases carry equal weight.
async function positiveControl() {
  const cases = [
    { name: 'refuses a collapsed harvest', prev: 40, next: 3, want: true },
    { name: 'refuses a harvest that fell just past the line', prev: 10, next: 4, want: true },
    { name: 'allows an empty first run, no previous journal', prev: null, next: 0, want: false },
    { name: 'allows a small vault shrinking, below the judging floor', prev: 4, next: 1, want: false },
    { name: 'allows a harvest exactly at tolerance', prev: 40, next: 20, want: false },
    { name: 'allows growth', prev: 40, next: 55, want: false },
    { name: 'allows a steady harvest', prev: 40, next: 39, want: false },
  ];

  const rows = [];
  for (const c of cases) {
    const got = collapseVerdict(c.prev, c.next).refuse;
    rows.push({ name: c.name, ok: got === c.want, detail: `prev=${c.prev} next=${c.next} refuse=${got} want=${c.want}` });
  }

  // The harvest filter earns its own cases, because it is the difference between
  // a useful journal and a journal of documentation about journals.
  const tagCases = [
    { name: 'harvests a real tagged decision', line: '- 2026-01-14 #decision Chose weekly review over daily.', want: true },
    { name: 'harvests a real [Decision] marker', line: '- 2026-01-14 [Decision] Approved the second phase.', want: true },
    { name: 'ignores a tag named inside a code span', line: 'Use `#decision` for approval notes.', want: false },
    { name: 'ignores a [Decision] marker inside a code span', line: 'Log it as `[Decision]` in the activity log.', want: false },
    { name: 'ignores an unfilled template placeholder', line: '- YYYY-MM-DD [Decision] Scope decision. #decision', want: false },
    { name: 'ignores an ordinary line', line: '- The meeting ran long and we moved on.', want: false },
  ];
  for (const c of tagCases) {
    const got = isTagged(c.line);
    rows.push({ name: c.name, ok: got === c.want, detail: `tagged=${got} want=${c.want}` });
  }

  // And one end to end, because a pure function passing is not the same as the
  // script refusing to write. This stages a real vault and checks the file on disk.
  const root = await mkdtemp(join(tmpdir(), 'se-journal-'));
  try {
    await mkdir(join(root, 'Council Chamber', 'Governance'), { recursive: true });
    await mkdir(join(root, 'Library'), { recursive: true });
    // A journal claiming 40 entries, beside a vault that now harvests almost none.
    await writeFile(
      join(root, OUTPUT_REL),
      '---\nname: Decision Journal\n---\n\n# Decision Journal\n\nEntries: 40. Grouped by month, newest first.\n',
      'utf8'
    );
    await writeFile(join(root, 'Library', 'one.md'), '- 2026-01-01 #decision The only survivor.\n', 'utf8');

    const before = await readFile(join(root, OUTPUT_REL), 'utf8');
    const decisions = await collect(root);
    const verdict = collapseVerdict(previousCount(before), decisions.length);
    rows.push({
      name: 'end to end: a real collapse is refused',
      ok: verdict.refuse === true,
      detail: `harvested=${decisions.length} refuse=${verdict.refuse}`,
    });

    const after = await readFile(join(root, OUTPUT_REL), 'utf8');
    rows.push({
      name: 'end to end: the good journal is still on disk, unoverwritten',
      ok: after === before,
      detail: after === before ? 'untouched' : 'OVERWRITTEN, the guard did not hold',
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }

  console.log('Decision Journal guard: positive control');
  console.log('-'.repeat(78));
  for (const r of rows) console.log(`${r.ok ? '  ok  ' : ' FAIL '} ${r.name.padEnd(50)} ${r.detail}`);
  console.log('-'.repeat(78));
  const fail = rows.filter((r) => !r.ok).length;
  console.log(`pass=${rows.length - fail} fail=${fail}`);
  if (fail > 0) {
    console.log('\nThe guard did not behave as specified. Do not trust it until this is green.');
    process.exit(1);
  }
  console.log('\nThe guard refused every collapse and allowed every honest run.');
  process.exit(0);
}

async function main() {
  if (process.argv.includes('--positive-control')) return positiveControl();

  const check = process.argv.includes('--check');
  const force = process.argv.includes('--force');
  const today = new Date().toISOString().slice(0, 10);
  const outPath = join(VAULT, OUTPUT_REL);

  let existing = '';
  try { existing = await readFile(outPath, 'utf8'); } catch { existing = ''; }

  const decisions = await collect(VAULT);
  const verdict = collapseVerdict(previousCount(existing), decisions.length);

  if (verdict.refuse && !force) {
    console.error(`Decision Journal: ${verdict.reason}. The scan is broken or the vault moved. Refusing to write.`);
    console.error('If the deletion was real, re-run with --force.');
    process.exit(1);
  }

  const next = render(decisions, today);

  if (check) {
    const strip = (s) => s.replace(/^generated:.*$/m, 'generated: DATE');
    if (strip(existing.replace(/\r\n/g, '\n')) === strip(next)) {
      console.log(`Decision Journal: in sync (${decisions.length} entries).`);
      process.exit(0);
    }
    console.error('Decision Journal: DRIFTED. Regenerate it to bring the lens back in step with its sources.');
    process.exit(1);
  }

  await writeFile(outPath, next, 'utf8');
  const sources = new Set(decisions.map((d) => d.source)).size;
  console.log(`Decision Journal written: ${decisions.length} entries from ${sources} source files.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
