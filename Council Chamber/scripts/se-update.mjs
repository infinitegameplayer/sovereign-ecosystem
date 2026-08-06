/**
 * se-update.mjs
 *
 * Sovereign Ecosystem upstream sync tool.
 * Compares framework-class files against the upstream GitHub repo and
 * applies approved updates one file at a time.
 *
 * Usage:
 *   node Council Chamber/scripts/se-update.mjs --check
 *   node Council Chamber/scripts/se-update.mjs --diff "<path>"
 *   node Council Chamber/scripts/se-update.mjs --apply "<path>"
 *   node Council Chamber/scripts/se-update.mjs --force-seeded "<path>"
 *
 * Exit codes:
 *   0  success
 *   1  error
 *   2  nothing to do
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const VAULT_ROOT = join(SCRIPT_DIR, '..');
const MANIFEST_PATH = join(SCRIPT_DIR, 'framework-manifest.json');

const UPSTREAM_REPO_URL = 'https://github.com/infinitegameplayer/sovereign-ecosystem.git';
const UPSTREAM_REMOTE_NAME = 'upstream-se';
const UPSTREAM_BRANCH = 'master';

// Normalize to forward slashes for cross-platform comparison.
function normalize(p) {
  return p.replace(/\\/g, '/');
}

function relToVault(absPath) {
  return normalize(absPath).replace(normalize(VAULT_ROOT) + '/', '');
}

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function git(args) {
  try {
    return execSync(`git -C "${VAULT_ROOT}" ${args}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (err) {
    throw new Error(err.stderr ? err.stderr.trim() : err.message);
  }
}

function gitSilent(args) {
  try {
    return { ok: true, output: execSync(`git -C "${VAULT_ROOT}" ${args}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }) };
  } catch (err) {
    return { ok: false, output: err.stderr || err.message };
  }
}

// Load and return the manifest.
function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    fail('Council Chamber/scripts/framework-manifest.json not found. Run from the vault root or check your installation.');
  }
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
}

// Classify a relative path against the manifest.
// Returns 'framework', 'seeded' or 'user'.
function classifyPath(relPath, manifest) {
  const norm = normalize(relPath);

  // Check seeded paths first (exact match list).
  for (const seededPath of manifest.classes.seeded.paths) {
    if (normalize(seededPath) === norm) return 'seeded';
  }

  // Check framework patterns.
  for (const pattern of manifest.classes.framework.patterns) {
    if (matchPattern(norm, normalize(pattern))) return 'framework';
  }

  return manifest.default_class;
}

// Minimal glob matcher supporting ** and *.
// Converts a glob pattern to a regex without relying on the escaping order
// causing bare * or ** to appear as regex quantifiers.
function matchPattern(filePath, pattern) {
  // Exact match first.
  if (pattern === filePath) return true;

  // Split the pattern on * boundaries before any escaping.
  // Strategy: replace ** and * with unique placeholders, escape everything else,
  // then substitute back with the correct regex fragments.
  const DOUBLE_STAR = '\x00DS\x00';
  const SINGLE_STAR = '\x00SS\x00';

  // Replace ** before * so the two-char sequence is captured first.
  let working = pattern
    .replace(/\*\*/g, DOUBLE_STAR)
    .replace(/\*/g, SINGLE_STAR);

  // Escape all remaining regex special characters.
  working = working.replace(/[.+^${}()|[\]\\]/g, '\\$&');

  // Substitute placeholders with regex fragments.
  // ** matches one or more characters including slashes.
  // * matches zero or more characters within a single path segment (no slash).
  working = working
    .replace(new RegExp(DOUBLE_STAR, 'g'), '.+')
    .replace(new RegExp(SINGLE_STAR, 'g'), '[^/]*');

  const regex = new RegExp(`^${working}$`);
  return regex.test(filePath);
}

// Detect the upstream remote. Returns the remote name or null.
function detectUpstreamRemote() {
  const result = gitSilent('remote -v');
  if (!result.ok) return null;

  for (const line of result.output.split('\n')) {
    if (line.includes(UPSTREAM_REPO_URL) && line.includes('(fetch)')) {
      return line.split('\t')[0].trim();
    }
  }
  return null;
}

// Fetch upstream. Returns the remote name used.
function fetchUpstream(remoteName) {
  const result = gitSilent(`fetch ${remoteName} ${UPSTREAM_BRANCH} --no-tags`);
  if (!result.ok) {
    throw new Error(`Could not fetch from upstream remote "${remoteName}": ${result.output}`);
  }
  return `${remoteName}/${UPSTREAM_BRANCH}`;
}

// List files changed between local HEAD and the upstream ref, for a given class.
// Returns an object: { added: [], modified: [], removed: [] }
function diffFrameworkFiles(upstreamRef, manifest) {
  const result = gitSilent(`diff --name-status HEAD ${upstreamRef}`);
  if (!result.ok) {
    throw new Error(`Could not diff against ${upstreamRef}: ${result.output}`);
  }

  const changes = { framework: { added: [], modified: [], removed: [] }, seeded: { added: [], modified: [], removed: [] }, user: { added: [], modified: [], removed: [] } };

  for (const line of result.output.split('\n')) {
    if (!line.trim()) continue;
    const parts = line.split('\t');
    const status = parts[0].trim();
    const filePath = normalize(parts[parts.length - 1].trim());
    const cls = classifyPath(filePath, manifest);

    if (status.startsWith('A')) {
      changes[cls].added.push(filePath);
    } else if (status.startsWith('M')) {
      changes[cls].modified.push(filePath);
    } else if (status.startsWith('D')) {
      changes[cls].removed.push(filePath);
    }
    // R = rename: treated as removed + added; C = copy: treated as added.
    // Both are uncommon for upstream framework files; skip for now.
  }

  return changes;
}

// Check that the vault is a git repo.
function assertGitRepo() {
  const result = gitSilent('rev-parse --is-inside-work-tree');
  if (!result.ok || result.output.trim() !== 'true') {
    fail('This directory is not a git repository. Initialize with: git init');
  }
}

// --- Modes ---

function modeCheck() {
  assertGitRepo();

  const manifest = loadManifest();

  // Detect or set up upstream remote.
  let remoteName = detectUpstreamRemote();

  if (!remoteName) {
    console.log('No upstream remote pointing at the Sovereign Ecosystem repo was found.');
    console.log('');
    console.log('Add it with:');
    console.log(`  git remote add ${UPSTREAM_REMOTE_NAME} ${UPSTREAM_REPO_URL}`);
    console.log('');
    console.log('Then run --check again.');
    process.exit(0);
  }

  console.log(`Upstream remote: ${remoteName} -> ${UPSTREAM_REPO_URL}`);
  console.log(`Fetching ${UPSTREAM_BRANCH}...`);

  let upstreamRef;
  try {
    upstreamRef = fetchUpstream(remoteName);
    console.log(`Fetched: ${upstreamRef}`);
  } catch (err) {
    fail(err.message);
  }

  console.log('');

  let changes;
  try {
    changes = diffFrameworkFiles(upstreamRef, manifest);
  } catch (err) {
    fail(err.message);
  }

  const frameworkTotal = changes.framework.added.length + changes.framework.modified.length + changes.framework.removed.length;
  const seededTotal = changes.seeded.added.length + changes.seeded.modified.length + changes.seeded.removed.length;
  const userTotal = changes.user.added.length + changes.user.modified.length + changes.user.removed.length;

  if (frameworkTotal === 0 && seededTotal === 0 && userTotal === 0) {
    console.log('Your vault is up to date with upstream. Nothing to apply.');
    process.exit(2);
  }

  if (frameworkTotal > 0) {
    console.log('FRAMEWORK changes (upstream offers updates. Apply with --apply "<path>"):');
    printChangeList(changes.framework);
  }

  if (seededTotal > 0) {
    console.log('');
    console.log('SEEDED changes (informational only. These files are yours to own. Apply with --force-seeded "<path>" only if you want to overwrite your personalization.):');
    printChangeList(changes.seeded);
  }

  if (userTotal > 0) {
    console.log('');
    console.log('USER changes (informational only. These are your files. Upstream does not update them.):');
    printChangeList(changes.user);
  }

  console.log('');
  console.log(`Summary: ${frameworkTotal} framework, ${seededTotal} seeded, ${userTotal} user path(s) differ from upstream.`);
  console.log('');
  console.log('Next steps:');
  console.log('  Review a file:   node Council Chamber/scripts/se-update.mjs --diff "<path>"');
  console.log('  Apply a file:    node Council Chamber/scripts/se-update.mjs --apply "<path>"');
}

function printChangeList(classChanges) {
  for (const path of classChanges.added) {
    console.log(`  + ${path}  [added in upstream]`);
  }
  for (const path of classChanges.modified) {
    console.log(`  ~ ${path}  [modified in upstream]`);
  }
  for (const path of classChanges.removed) {
    console.log(`  - ${path}  [removed in upstream]`);
  }
}

function modeDiff(targetPath) {
  if (!targetPath) fail('--diff requires a file path. Example: node Council Chamber/scripts/se-update.mjs --diff "Council Chamber/Protocols/Session/Session Closeout Protocol.md"');

  assertGitRepo();

  const manifest = loadManifest();
  const normPath = normalize(targetPath);
  const cls = classifyPath(normPath, manifest);

  const remoteName = detectUpstreamRemote();
  if (!remoteName) {
    fail(`No upstream remote found. Add it with: git remote add ${UPSTREAM_REMOTE_NAME} ${UPSTREAM_REPO_URL}`);
  }

  let upstreamRef;
  try {
    upstreamRef = fetchUpstream(remoteName);
  } catch (err) {
    fail(err.message);
  }

  console.log(`Path: ${normPath}`);
  console.log(`Class: ${cls}`);
  console.log('');

  const result = gitSilent(`diff HEAD ${upstreamRef} -- "${normPath}"`);
  if (!result.ok) {
    fail(`Could not diff ${normPath}: ${result.output}`);
  }

  if (!result.output.trim()) {
    console.log('No difference between local and upstream for this file.');
    process.exit(2);
  }

  console.log(result.output);
}

function modeApply(targetPath) {
  if (!targetPath) fail('--apply requires a file path. Example: node Council Chamber/scripts/se-update.mjs --apply "Council Chamber/Protocols/Session/Session Closeout Protocol.md"');

  assertGitRepo();

  const manifest = loadManifest();
  const normPath = normalize(targetPath);
  const cls = classifyPath(normPath, manifest);

  if (cls === 'seeded') {
    console.error(`Refused: "${normPath}" is a seeded file.`);
    console.error('Seeded files are personalized by you and are not auto-applied by upstream.');
    console.error('If you want to overwrite your personalization with the upstream version, use --force-seeded instead.');
    process.exit(1);
  }

  if (cls === 'user') {
    console.error(`Refused: "${normPath}" is a user file.`);
    console.error('User files are yours. Upstream does not update them.');
    process.exit(1);
  }

  // framework class: proceed.
  const remoteName = detectUpstreamRemote();
  if (!remoteName) {
    fail(`No upstream remote found. Add it with: git remote add ${UPSTREAM_REMOTE_NAME} ${UPSTREAM_REPO_URL}`);
  }

  let upstreamRef;
  try {
    upstreamRef = fetchUpstream(remoteName);
  } catch (err) {
    fail(err.message);
  }

  console.log(`Applying upstream version of: ${normPath}`);
  console.log(`Source: ${upstreamRef}`);

  try {
    git(`checkout ${upstreamRef} -- "${normPath}"`);
  } catch (err) {
    fail(`Could not apply ${normPath}: ${err.message}`);
  }

  console.log(`Applied. The file is now staged. Review with: git diff --cached "${normPath}"`);
  console.log('Commit when ready: git commit -m "Apply upstream update: <description>"');
}

function modeForceSeeded(targetPath) {
  if (!targetPath) fail('--force-seeded requires a file path. Example: node Council Chamber/scripts/se-update.mjs --force-seeded "Council Chamber/Codices/Humor Codex.md"');

  assertGitRepo();

  const manifest = loadManifest();
  const normPath = normalize(targetPath);
  const cls = classifyPath(normPath, manifest);

  if (cls === 'user') {
    console.error(`Refused: "${normPath}" is a user file.`);
    console.error('User files are yours. Upstream does not update them, even with --force-seeded.');
    process.exit(1);
  }

  if (cls === 'framework') {
    // Allow with an informational note. --apply is the normal path for framework files,
    // but --force-seeded still works so the Sovereign has one consistent command for
    // "apply this from upstream regardless of class."
    console.log(`Note: "${normPath}" is a framework file. Use --apply for framework files. Proceeding anyway.`);
  }

  if (cls === 'seeded') {
    console.log('WARNING: This is a seeded file. Applying the upstream version will overwrite any personalization you have made.');
    console.log(`File: ${normPath}`);
    console.log('');
    console.log('If you want to keep your personalization, press Ctrl+C now.');
    console.log('Proceeding with apply...');
    console.log('');
  }

  const remoteName = detectUpstreamRemote();
  if (!remoteName) {
    fail(`No upstream remote found. Add it with: git remote add ${UPSTREAM_REMOTE_NAME} ${UPSTREAM_REPO_URL}`);
  }

  let upstreamRef;
  try {
    upstreamRef = fetchUpstream(remoteName);
  } catch (err) {
    fail(err.message);
  }

  try {
    git(`checkout ${upstreamRef} -- "${normPath}"`);
  } catch (err) {
    fail(`Could not apply ${normPath}: ${err.message}`);
  }

  console.log(`Applied upstream version of: ${normPath}`);
  console.log('The file is staged. Review with: git diff --cached');
}

// --- Arg parsing and dispatch ---

const args = process.argv.slice(2);
const mode = args[0];
const targetArg = args[1] || null;

switch (mode) {
  case '--check':
    modeCheck();
    break;
  case '--diff':
    modeDiff(targetArg);
    break;
  case '--apply':
    modeApply(targetArg);
    break;
  case '--force-seeded':
    modeForceSeeded(targetArg);
    break;
  default:
    console.log('Sovereign Ecosystem Upstream Sync');
    console.log('');
    console.log('Usage:');
    console.log('  node Council Chamber/scripts/se-update.mjs --check                       Check for upstream framework changes');
    console.log('  node Council Chamber/scripts/se-update.mjs --diff "<path>"               Show diff for one file');
    console.log('  node Council Chamber/scripts/se-update.mjs --apply "<path>"              Apply upstream version of a framework file');
    console.log('  node Council Chamber/scripts/se-update.mjs --force-seeded "<path>"       Apply upstream version of a seeded file (overwrites personalization)');
    console.log('');
    console.log('Exit codes: 0 success, 1 error, 2 nothing to do.');
    process.exit(0);
}
