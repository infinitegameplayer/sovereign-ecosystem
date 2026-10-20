// quote-check.mjs
// Quote and Figure Check. Confirms that every quotation (and, with --figures,
// every figure) in a draft occurs verbatim in the sources it cites. It
// mechanizes three faces of Claim Integrity at once: Source Harvest Step 5 (a
// worker's quote against the repo), Attribution (a Sovereign quotation against
// its transcript) and the product-fact sweep (a price against the canonical note).
//
// Origin: an open-source-repo harvest run, 2026-10-20. Three earlier harvests
// each built a throwaway checker; the run that shipped this one caught a quote
// filed under the wrong path. Patterns from Astro-Han/karpathy-llm-wiki
// check_evidence.py and abm9111/chamber (both MIT), re-expressed here.
//
// THE INSTRUMENT PROVES ITSELF FIRST. Before any item is judged, two controls run
// against the loaded sources: a window cut from the first source must be found, and
// a nonce string must not be. If either control misbehaves the run stops at exit 2
// and judges nothing, because a checker that reports zero for everything prints the
// same number as a clean draft (Source Harvest Refinements, 2026-10-06).
//
// What it checks, and what it does not:
//   - Quotations: text inside straight or curly double quotes, 12 characters or more.
//     A quote with an ellipsis is split and every segment must be found.
//   - Figures (--figures): money ($4,500), percentages (40%), and numbers of three or
//     more digits. Each must appear in some source.
//   - Matching ignores markdown emphasis, curly versus straight quotes, whitespace
//     and case. A match that holds only when case is ignored is reported as `case`.
//   - It checks occurrence, never meaning. A negation built from a source's own words
//     passes. Say so whenever a clean run is reported.
//
// Verdicts per item: found (names the source), case (found, case differs), missing.
// A source that cannot be read is reported as unreadable and never counted as clean.
//
// Usage:
//   node "Council Chamber/scripts/quote-check.mjs" --doc <path> --source <path|dir|url> [--source ...]
//        [--figures] [--min <chars>] [--json]
//   node "Council Chamber/scripts/quote-check.mjs" --positive-control
//
// A directory source is read recursively (.md, .txt, .json, .jsonl, .html, .py, .ts, .js, .mjs, .csv).
// A URL source is fetched once. The script reads the paths it is given and does not
// need the vault root, so it has no root to resolve.
//
// Exit codes:
//   0  every item found (case differences included), or the positive control passed
//   1  one or more items missing, a source unreadable, or the positive control failed
//   2  usage error, or a control misbehaved (instrument untrusted, nothing judged)
//
// READ-ONLY: never writes to the vault. The positive control writes only to a
// temp directory it removes. Output is a report on stdout.

import { readFileSync, readdirSync, statSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const TEXT_EXTS = new Set(['.md', '.txt', '.json', '.jsonl', '.html', '.py', '.ts', '.js', '.mjs', '.csv']);
const NONCE = 'zq-quote-check-absent-control-7f3a91';
const USAGE = 'Usage: node quote-check.mjs --doc <path> --source <path|dir|url> [--source ...] [--figures] [--min <chars>] [--json]\n       node quote-check.mjs --positive-control';
const KNOWN_FLAGS = new Set(['--doc', '--source', '--figures', '--min', '--json', '--positive-control']);
const VALUE_FLAGS = new Set(['--doc', '--source', '--min']);

export function norm(s) {
  return s
    .replace(/[*_`]/g, '')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// The YAML frontmatter block is metadata, not prose: its quoted values are field
// syntax, so it is stripped before extraction.
export function stripFrontmatter(text) {
  return text.replace(/^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

export function extractQuotes(text, min = 12) {
  text = stripFrontmatter(text);
  const out = [];
  const re = /["“]([^"“”\n]{1,600})["”]/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const q = m[1].trim();
    if (q.length >= min) out.push(q);
  }
  return [...new Set(out)];
}

export function extractFigures(text) {
  text = stripFrontmatter(text);
  const re = /\$\d[\d,]*(?:\.\d+)?|\b\d[\d,]*(?:\.\d+)?%|\b\d{1,3}(?:,\d{3})+\b|\b\d{3,}\b/g;
  return [...new Set(text.match(re) || [])];
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (TEXT_EXTS.has(extname(name).toLowerCase())) files.push(p);
  }
  return files;
}

async function loadSources(specs) {
  const loaded = [];
  for (const spec of specs) {
    try {
      if (/^https?:\/\//i.test(spec)) {
        const r = await fetch(spec);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        loaded.push({ name: spec, text: await r.text() });
      } else if (statSync(spec).isDirectory()) {
        const files = walk(spec);
        if (files.length === 0) throw new Error('directory holds no readable text files');
        for (const f of files) loaded.push({ name: f, text: readFileSync(f, 'utf8') });
      } else {
        loaded.push({ name: spec, text: readFileSync(spec, 'utf8') });
      }
    } catch (e) {
      loaded.push({ name: spec, text: null, error: e.message });
    }
  }
  return loaded;
}

// A quotation's closing punctuation belongs to the sentence that quotes it, so a
// trailing period or comma never decides a verdict.
function locate(item, sources) {
  const segments = norm(item).replace(/[.,;:!?]+$/, '').split(/\s*(?:\.\.\.|…)\s*/).filter(s => s.length > 0);
  for (const src of sources) {
    if (src.text === null) continue;
    const hay = norm(src.text);
    if (segments.every(s => hay.includes(s))) return { verdict: 'found', source: src.name };
  }
  for (const src of sources) {
    if (src.text === null) continue;
    const hay = norm(src.text).toLowerCase();
    if (segments.every(s => hay.includes(s.toLowerCase()))) return { verdict: 'case', source: src.name };
  }
  return { verdict: 'missing', source: null };
}

export function runControls(sources) {
  const readable = sources.filter(s => s.text !== null && norm(s.text).length >= 40);
  if (readable.length === 0) return { ok: false, present: false, absent: false, reason: 'no readable source long enough to cut a present control from' };
  const t = norm(readable[0].text);
  const mid = Math.floor(t.length / 2);
  const window = t.slice(Math.max(0, mid - 15), mid + 15);
  const present = locate(window, readable).verdict === 'found';
  const absent = locate(NONCE, sources).verdict === 'missing';
  return { ok: present && absent, present, absent };
}

export async function check({ docText, sourceSpecs, figures = false, min = 12, sources = null }) {
  const loaded = sources || await loadSources(sourceSpecs);
  const controls = runControls(loaded);
  if (!controls.ok) return { controls, items: [], unreadable: loaded.filter(s => s.text === null) };
  const items = extractQuotes(docText, min).map(q => ({ kind: 'quote', text: q, ...locate(q, loaded) }));
  if (figures) for (const f of extractFigures(docText)) items.push({ kind: 'figure', text: f, ...locate(f, loaded) });
  return { controls, items, unreadable: loaded.filter(s => s.text === null) };
}

// Positive control: plants every case in a temp-dir fixture and requires each to
// be caught. It never touches the vault.
async function positiveControl() {
  const dir = mkdtempSync(join(tmpdir(), 'quote-check-'));
  let pass = 0, fail = 0;
  const ok = (cond, msg) => { cond ? pass++ : fail++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); };
  try {
    const src = join(dir, 'source.md');
    writeFileSync(src, 'The Sovereign said: "the price came from the game, not from worth" on the call.\nThe seat is $4,500 a month for 12 months.\nA **bold** phrase sits here.\n', 'utf8');
    const doc = [
      '---',
      'status: "a frontmatter value that must never be judged as a quote"',
      '---',
      'He named it plainly: "the price came from the game, not from worth".',
      'A planted fabrication: "the price came from worth, not from the game".',
      'Emphasis stripped: "A bold phrase sits here".',
      'Case only: "THE PRICE CAME FROM THE GAME".',
      'Ellipsis: "the price came ... not from worth".',
      'Closing period: "The seat is $4,500 a month for 12 months, ok."',
      'Quoted with its own period: "on the call."',
      'Period only inside the quote: "the price came from the game, not from worth."',
      'Figures: $4,500 and $6,000.',
    ].join('\n');
    const r = await check({ docText: doc, sourceSpecs: [src], figures: true });
    const by = t => r.items.find(i => i.text === t);
    ok(r.controls.ok, 'controls: present found and absent not found');
    ok(!by('a frontmatter value that must never be judged as a quote'), 'frontmatter values are not extracted');
    ok(by('the price came from the game, not from worth')?.verdict === 'found', 'a true quote is found');
    ok(by('the price came from worth, not from the game')?.verdict === 'missing', 'a planted fabrication is missing');
    ok(by('A bold phrase sits here')?.verdict === 'found', 'markdown emphasis in the source is ignored');
    ok(by('THE PRICE CAME FROM THE GAME')?.verdict === 'case', 'a case-only match is reported as case');
    ok(by('the price came ... not from worth')?.verdict === 'found', 'ellipsis segments are each found');
    ok(by('on the call.')?.verdict === 'found', "a quote's own closing period never decides the verdict");
    ok(by('the price came from the game, not from worth.')?.verdict === 'found', 'a closing period absent from the source never decides the verdict');
    ok(by('The seat is $4,500 a month for 12 months, ok.')?.verdict === 'missing', 'words added inside the quote still miss');
    ok(by('$4,500')?.verdict === 'found', 'a true figure is found');
    ok(by('$6,000')?.verdict === 'missing', 'a planted figure is missing');
    const bad = await check({ docText: doc, sourceSpecs: [join(dir, 'does-not-exist.md')] });
    ok(!bad.controls.ok && bad.items.length === 0, 'an unreadable source fails the controls and judges nothing');
    const empty = await check({ docText: doc, sourceSpecs: [], sources: [{ name: 'x', text: NONCE + ' padding padding padding padding' }] });
    ok(!empty.controls.ok, 'a source that holds the nonce fails the absent control');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  console.log(`\npositive control: ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 && pass > 0 ? 0 : 1);
}

function usageError(msg) {
  console.error(`quote-check: ${msg}\n${USAGE}`);
  process.exit(2);
}

async function main() {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (!KNOWN_FLAGS.has(a)) usageError(`unknown argument "${a}".`);
    if (VALUE_FLAGS.has(a)) {
      if (args[i + 1] === undefined || args[i + 1].startsWith('--')) usageError(`${a} needs a value.`);
      i++;
    }
  }
  if (args.includes('--positive-control')) return positiveControl();
  const get = flag => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };
  const docPath = get('--doc');
  const sourceSpecs = args.flatMap((a, i) => a === '--source' ? [args[i + 1]] : []).filter(Boolean);
  if (!docPath || sourceSpecs.length === 0) usageError('both --doc and at least one --source are required.');
  let docText;
  try { docText = readFileSync(docPath, 'utf8'); } catch (e) { usageError(`cannot read doc: ${e.message}`); }
  const min = Number(get('--min') || 12);
  if (!Number.isFinite(min) || min < 1) usageError('--min must be a positive number.');
  const r = await check({ docText, sourceSpecs, figures: args.includes('--figures'), min });
  if (args.includes('--json')) { console.log(JSON.stringify(r, null, 2)); }
  else {
    console.log(`CONTROL present: ${r.controls.present ? 'found' : 'MISSED'} | CONTROL absent: ${r.controls.absent ? 'not found' : 'FALSE HIT'}`);
    for (const u of r.unreadable) console.log(`UNREADABLE  ${u.name}  (${u.error})`);
    if (!r.controls.ok) { console.log('Instrument untrusted. Nothing judged.'); process.exit(2); }
    for (const i of r.items) console.log(`${i.verdict.toUpperCase().padEnd(8)} ${i.kind.padEnd(6)} ${i.text}${i.source ? `  <- ${i.source}` : ''}`);
    const missing = r.items.filter(i => i.verdict === 'missing').length;
    console.log(`\n${r.items.length - missing}/${r.items.length} found. Occurrence only: meaning is not checked.`);
  }
  if (!r.controls.ok) process.exit(2);
  process.exit(r.items.some(i => i.verdict === 'missing') || r.unreadable.length > 0 ? 1 : 0);
}

// Run only when executed directly, so the exports stay importable.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch(e => { console.error(`quote-check: ${e.message}`); process.exit(2); });
}
