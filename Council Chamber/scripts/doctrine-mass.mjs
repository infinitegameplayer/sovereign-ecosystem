#!/usr/bin/env node
// doctrine-mass.mjs
// Sovereign Ecosystem Doctrine Mass Baseline. Counts artifacts and total lines
// per doctrine layer (codices, protocols, skills, governance) and appends a
// dated row to the Doctrine Mass Baseline note. Plans already carry a visible
// lifecycle in most ecosystems. Doctrine tends not to: it accretes without a
// matching retirement path. This script gives doctrine growth a measured
// trend instead of an unmeasured pile.
//
// READ-ONLY BY DEFAULT: the bare run prints a report and the paste-ready row.
// Only --append writes, and it only ever appends one row to the baseline table.
// It never edits or deletes existing content.
//
// Counting definition:
//   codices    all .md under Council Chamber/Codices, recursive
//   protocols  all .md under Council Chamber/Protocols, recursive
//   skills     each Council Chamber/Skills/<name>/SKILL.md (one per skill)
//   governance all .md under Council Chamber/Governance, recursive
// Keep this definition stable once a baseline is running so the series stays
// continuous. Changing what counts as an artifact breaks trend comparability.
//
// Vault root resolution: SOVEREIGN_VAULT_ROOT env var if set, otherwise the
// parent of this script's directory (scripts live in <vault>/scripts/).
//
// Usage:
//   node Council Chamber/scripts/doctrine-mass.mjs           Print report + paste-ready row.
//   node Council Chamber/scripts/doctrine-mass.mjs --json    Emit counts as JSON.
//   node Council Chamber/scripts/doctrine-mass.mjs --append  Append the dated row to the baseline note.
//
// Exit codes:
//   0  Ran successfully.
//   1  Usage error or unrecoverable failure.

import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const VAULT_ROOT = process.env.SOVEREIGN_VAULT_ROOT || resolve(SCRIPT_DIR, '..');

const CC = join(VAULT_ROOT, 'Council Chamber');
const BASELINE_PATH = join(CC, 'Governance', 'Doctrine Mass Baseline.md');
// New rows insert on the line immediately above this sentinel, so the table
// stays chronological and any commentary below the table is preserved.
const TABLE_MARKER = '<!-- doctrine-mass-rows-end -->';

const LAYERS = [
  { key: 'codices', label: 'Codices', dir: join(CC, 'Codices'), mode: 'all-md' },
  { key: 'protocols', label: 'Protocols', dir: join(CC, 'Protocols'), mode: 'all-md' },
  { key: 'skills', label: 'Skills', dir: join(CC, 'Skills'), mode: 'skill-md' },
  { key: 'governance', label: 'Governance', dir: join(CC, 'Governance'), mode: 'all-md' },
];

async function walkMd(dir, mode) {
  const files = [];
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    // Layer directory missing is not fatal: skip gracefully and count zero.
    return files;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await walkMd(p, mode)));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      if (mode === 'skill-md' && e.name !== 'SKILL.md') continue;
      files.push(p);
    }
  }
  return files;
}

function countLines(content) {
  if (content.length === 0) return 0;
  const normalized = content.replace(/\r\n/g, '\n');
  const n = normalized.split('\n').length;
  // A trailing newline yields one empty final segment; do not count it as a line.
  return normalized.endsWith('\n') ? n - 1 : n;
}

async function measureLayer(layer) {
  const files = await walkMd(layer.dir, layer.mode);
  let lines = 0;
  for (const f of files) {
    let content = '';
    try {
      content = await readFile(f, 'utf8');
    } catch {
      continue;
    }
    lines += countLines(content);
  }
  return { key: layer.key, label: layer.label, files: files.length, lines };
}

function today() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildRow(date, results, totalFiles, totalLines) {
  const by = Object.fromEntries(results.map((r) => [r.key, r]));
  const cell = (k) => `${by[k].files} / ${by[k].lines.toLocaleString('en-US')}`;
  return `| ${date} | ${cell('codices')} | ${cell('protocols')} | ${cell('skills')} | ${cell('governance')} | ${totalFiles} / ${totalLines.toLocaleString('en-US')} |  |`;
}

async function main() {
  const jsonMode = process.argv.includes('--json');
  const appendMode = process.argv.includes('--append');

  const results = [];
  for (const layer of LAYERS) {
    results.push(await measureLayer(layer));
  }
  const totalFiles = results.reduce((a, r) => a + r.files, 0);
  const totalLines = results.reduce((a, r) => a + r.lines, 0);
  const date = today();

  if (jsonMode) {
    console.log(JSON.stringify({ date, layers: results, totalFiles, totalLines }, null, 2));
    return;
  }

  console.log('Sovereign Ecosystem Doctrine Mass Baseline');
  console.log('-------------------------------------------');
  console.log(`Date: ${date}`);
  for (const r of results) {
    console.log(`  ${r.label.padEnd(11)} ${String(r.files).padStart(4)} artifacts   ${String(r.lines).padStart(7)} lines`);
  }
  console.log(`  ${'Total'.padEnd(11)} ${String(totalFiles).padStart(4)} artifacts   ${String(totalLines).padStart(7)} lines`);
  console.log('');
  console.log('Paste-ready baseline row (artifacts / lines):');
  console.log(buildRow(date, results, totalFiles, totalLines));

  if (appendMode) {
    try {
      await access(BASELINE_PATH);
    } catch {
      console.error(`\nFAIL: baseline note not found at ${BASELINE_PATH}. Create it first (it carries the table header and the ${TABLE_MARKER} marker).`);
      process.exit(1);
    }
    const note = await readFile(BASELINE_PATH, 'utf8');
    if (!note.includes(TABLE_MARKER)) {
      console.error(`\nFAIL: baseline note is missing the ${TABLE_MARKER} sentinel. Append aborted.`);
      process.exit(1);
    }
    const row = buildRow(date, results, totalFiles, totalLines);
    const normalized = note.replace(/\r\n/g, '\n');
    const updated = normalized.replace(TABLE_MARKER, `${row}\n${TABLE_MARKER}`);
    await writeFile(BASELINE_PATH, updated, 'utf8');
    console.log(`\nAppended the ${date} row to ${BASELINE_PATH}.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
