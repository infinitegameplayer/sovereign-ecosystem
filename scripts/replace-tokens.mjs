/**
 * replace-tokens.mjs
 *
 * One-time token replacement script for the Sovereign Ecosystem.
 * Scans the vault for identity tokens and replaces them with real values.
 *
 * Tokens:
 *   {{ECOSYSTEM_NAME}}         — the name of your ecosystem (e.g. "Kingdom")
 *   {{AI_INTERFACE_NAME}}      — the name of your AI interface (e.g. "Jarvis")
 *   {{SOVEREIGN_DISPLAY_NAME}} — how you are addressed (e.g. "Lane")
 *   {{SOVEREIGN_FORMAL_NAME}}  — formal version (e.g. "Lane Belone") — optional
 *   {{SOVEREIGN_LEGAL_NAME}}   — legal name — optional, leave blank to skip
 *
 * Usage:
 *   node scripts/replace-tokens.mjs
 *
 * The script will:
 *   1. Ask you for replacement values
 *   2. Preview every file and location that will change
 *   3. Wait for your explicit confirmation before writing anything
 *   4. Replace and log results to scripts/replace-tokens-log.txt
 *
 * After use, archive this script to Vault (Archive)/ — it is a one-time tool.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VAULT_ROOT = path.resolve(__dirname, '..');

// Directories and files to skip
const SKIP_DIRS = new Set(['.git', 'node_modules', '.runtime', '.trash', 'scripts']);
const SKIP_FILES = new Set(['.gitignore']);
const FILE_EXTENSIONS = new Set(['.md', '.txt', '.json']);

// Token definitions
const TOKEN_KEYS = [
  'ECOSYSTEM_NAME',
  'AI_INTERFACE_NAME',
  'SOVEREIGN_DISPLAY_NAME',
  'SOVEREIGN_FORMAL_NAME',
  'SOVEREIGN_LEGAL_NAME',
];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

function walkFiles(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, results);
    } else if (entry.isFile() && FILE_EXTENSIONS.has(path.extname(entry.name))) {
      if (!SKIP_FILES.has(entry.name)) results.push(fullPath);
    }
  }
  return results;
}

function findTokensInFile(filePath, tokens) {
  const content = fs.readFileSync(filePath, 'utf8');
  const found = [];
  for (const [token, value] of Object.entries(tokens)) {
    if (value && content.includes(`{{${token}}}`)) {
      const count = (content.match(new RegExp(`\\{\\{${token}\\}\\}`, 'g')) || []).length;
      found.push({ token, value, count });
    }
  }
  return { content, found };
}

async function main() {
  console.log('\n=== Sovereign Ecosystem Token Replacement ===\n');
  console.log('This script replaces identity tokens across your vault with real values.');
  console.log('You will preview all changes before anything is written.\n');

  // Collect replacement values
  const tokens = {};
  for (const key of TOKEN_KEYS) {
    const display = key.replace(/_/g, ' ').toLowerCase();
    const val = await ask(`Enter value for {{${key}}} (${display}) — leave blank to skip: `);
    tokens[key] = val.trim();
  }

  const activeTokens = Object.fromEntries(Object.entries(tokens).filter(([, v]) => v));

  if (Object.keys(activeTokens).length === 0) {
    console.log('\nNo tokens provided. Nothing to replace. Exiting.\n');
    rl.close();
    return;
  }

  console.log('\n--- Scanning vault ---\n');
  const files = walkFiles(VAULT_ROOT);
  const affected = [];

  for (const filePath of files) {
    const { content, found } = findTokensInFile(filePath, activeTokens);
    if (found.length > 0) {
      const rel = path.relative(VAULT_ROOT, filePath);
      affected.push({ filePath, rel, content, found });
    }
  }

  if (affected.length === 0) {
    console.log('No token occurrences found. Nothing to replace.\n');
    rl.close();
    return;
  }

  console.log(`Found ${affected.length} file(s) with token occurrences:\n`);
  for (const { rel, found } of affected) {
    const summary = found.map(({ token, value, count }) =>
      `  {{${token}}} → "${value}" (${count} occurrence${count > 1 ? 's' : ''})`
    ).join('\n');
    console.log(`${rel}\n${summary}\n`);
  }

  const confirm = await ask(`Replace tokens in all ${affected.length} file(s)? Type YES to proceed: `);

  if (confirm.trim() !== 'YES') {
    console.log('\nAborted. No files were changed.\n');
    rl.close();
    return;
  }

  // Execute replacements
  const log = [`Token replacement run — ${new Date().toISOString()}\n`];
  let totalReplaced = 0;

  for (const { filePath, rel, content, found } of affected) {
    let updated = content;
    for (const { token, value } of found) {
      updated = updated.replaceAll(`{{${token}}}`, value);
    }
    fs.writeFileSync(filePath, updated, 'utf8');
    const summary = found.map(({ token, value, count }) =>
      `  {{${token}}} → "${value}" (${count})`
    ).join('\n');
    log.push(`${rel}\n${summary}`);
    totalReplaced += found.reduce((acc, { count }) => acc + count, 0);
    console.log(`Updated: ${rel}`);
  }

  log.push(`\nTotal replacements: ${totalReplaced} across ${affected.length} files.`);
  const logPath = path.join(__dirname, 'replace-tokens-log.txt');
  fs.writeFileSync(logPath, log.join('\n\n'), 'utf8');

  console.log(`\n✓ Done. ${totalReplaced} replacement(s) across ${affected.length} file(s).`);
  console.log(`Log written to: scripts/replace-tokens-log.txt`);
  console.log('\nWhen finished, archive this script and its log to Vault (Archive)/.\n');

  rl.close();
}

main().catch((err) => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});
