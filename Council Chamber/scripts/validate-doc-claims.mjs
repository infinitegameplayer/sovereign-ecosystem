#!/usr/bin/env node
// validate-doc-claims.mjs
// Sovereign Ecosystem port of validate-doc-claims.py (compound-engineering
// plugin, ce-compound skill). A doc's citations are checked against git at
// the moment of the check, never trusted on sight.
//
// Usage:
//   node "Council Chamber/scripts/validate-doc-claims.mjs" <doc-path> [--repo <git-root>] [--json]
//
// Exit codes:
//   0 - nothing flagged
//   1 - one or more flags need adjudication (report on stdout)
//   2 - usage error (bad arguments, missing file)
//
// Scope: mechanical grounding checks on a written doc's body.
//   1. Backticked repo-relative paths (containing a '/') exist in the
//      working tree. Tokens with '../' resolve from the doc's directory;
//      those escaping the repo are skipped. Misses tracked at HEAD or the
//      upstream default branch still count as real paths and are
//      classified. Tokens found nowhere are flagged only when path-shaped;
//      slash-delimited identifiers (branch names, model IDs) are skipped.
//   2. Obsidian wikilinks [[Path/To/Note]] and [[Path/To/Note|Alias]]
//      resolve against the vault root, by exact path first and then by
//      basename anywhere in the vault (Obsidian's shortest-path behavior).
//      Ecosystem addition: a mechanical check that a moved or renamed file
//      still resolves from every wikilink pointing at it. Not present in
//      the source Python.
//   3. Cited commit SHAs (7-40 hex chars, at least one digit and one
//      a-f letter) resolve to commits, classified by reachability from
//      HEAD and the upstream default branch.
//   4. Relative markdown link targets resolve from the doc's location.
//   5. Dangling drafting scaffold: "Learning(s) N" numbering and
//      unresolved {{...}} placeholder tokens.
//
// Flags are adjudication input, not hard failures. A doc may legitimately
// cite a path deleted by the fix it documents. The calling agent decides
// per flag: fix, annotate as historical, or confirm intentional. Only the
// exit code distinguishes clean from needs-a-look.
//
// No network calls, ever. Classification uses whatever refs exist locally.
// This script never edits the doc it checks. Pure Node stdlib plus git
// child processes, zero npm dependencies.

import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Default repo root when the doc lives inside the vault and --repo is not
// given. Resolved from SOVEREIGN_VAULT_ROOT, falling back to the working
// directory.
const VAULT_ROOT = process.env.SOVEREIGN_VAULT_ROOT || process.cwd();

// Tokens containing these are placeholders or examples, not real citations.
const PLACEHOLDER_CHARS = new Set(['<', '>', '{', '}', '*', '$']);
const PLACEHOLDER_SUBSTRINGS = ['path/to', '...', '…'];

const SHA_RE = /\b[0-9a-f]{7,40}\b/g;
const BACKTICK_RE = /`([^`\n]+)`/g;
const WIKILINK_RE = /\[\[([^\]\n]+)\]\]/g;
const MD_LINK_RE = /\[[^\]]*\]\(([^)\s]+)\)/g;
const SCAFFOLD_RES = [/\bLearnings?\s+#?\d/, /\{\{[^}\n]*\}\}/];

function usageFail(msg) {
  process.stderr.write(`validate-doc-claims: ${msg}\n`);
  process.exit(2);
}

function git(args, cwd) {
  try {
    const result = spawnSync('git', args, { cwd, encoding: 'utf8', timeout: 30000, windowsHide: true });
    if (result.error) return { code: 1, stdout: '' };
    return { code: result.status === null ? 1 : result.status, stdout: (result.stdout || '').trim() };
  } catch {
    return { code: 1, stdout: '' };
  }
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function isInsideVault(absPath) {
  const a = toPosix(absPath).toLowerCase();
  const v = toPosix(VAULT_ROOT).toLowerCase();
  return a === v || a.startsWith(`${v}/`);
}

function isDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

// Skips YAML frontmatter when present so frontmatter fields are not scanned
// as body citations. Returns [body, 1-indexed line number the body starts on].
function splitBody(text) {
  const lines = text.split('\n');
  if (lines.length && lines[0].trimEnd() === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trimEnd() === '---') {
        return [lines.slice(i + 1).join('\n'), i + 2];
      }
    }
  }
  return [text, 1];
}

function isPathCandidate(token) {
  // The source Python rejects any token containing whitespace, an assumption
  // that holds for spaceless code-repo paths but not for vault container
  // names with spaces (for example Council Chamber). Whitespace is allowed
  // here; the existence check and isPathShaped below already filter prose
  // fragments that happen to contain a slash, so dropping the whitespace
  // gate does not widen false positives.
  if (!token.includes('/')) return false;
  if (token.includes('://') || /^(http|#|\/|~)/.test(token)) return false;
  if (/^(origin\/|upstream\/|refs\/)/.test(token)) return false; // git refs, not repo paths
  for (const ch of token) {
    if (PLACEHOLDER_CHARS.has(ch)) return false;
  }
  for (const sub of PLACEHOLDER_SUBSTRINGS) {
    if (token.includes(sub)) return false;
  }
  return true;
}

// Distinguishes a path citation from a slash-delimited identifier (branch
// name, provider/model ID) among tokens found nowhere in git.
function isPathShaped(token, base) {
  const segments = token.split('/');
  if (/\.[A-Za-z0-9]{1,8}$/.test(segments[segments.length - 1])) return true;
  if (token.endsWith('/')) return true;
  return isDir(path.join(base, segments[0]));
}

function normalizePath(rawToken) {
  let token = rawToken.trim().replace(/[.,;]+$/, '');
  token = token.replace(/:\d+(-\d+)?$/, ''); // strip trailing :line or :a-b refs
  if (token.startsWith('./')) token = token.slice(2);
  return token;
}

function main(argv) {
  const rest = argv.slice(2);
  const opts = { doc: null, repo: null, json: false, help: false };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--json') { opts.json = true; continue; }
    if (a === '--help' || a === '-h') { opts.help = true; continue; }
    if (a === '--repo') { opts.repo = rest[++i]; continue; }
    if (a.startsWith('--repo=')) { opts.repo = a.slice('--repo='.length); continue; }
    if (a.startsWith('--')) usageFail(`unknown flag: ${a}`);
    if (opts.doc === null) { opts.doc = a; continue; }
    usageFail(`unexpected argument: ${a}`);
  }

  if (opts.help || !opts.doc) {
    usageFail('usage: validate-doc-claims.mjs <doc-path> [--repo <git-root>] [--json]');
  }

  const docPath = opts.doc;
  if (!existsSync(docPath) || !statSync(docPath).isFile()) {
    usageFail(`file not found: ${docPath}`);
  }

  const absDocPath = path.resolve(docPath);
  const docDir = path.dirname(absDocPath);
  const text = readFileSync(docPath, 'utf8');
  const [body, bodyStart] = splitBody(text);
  const bodyLines = body.split('\n');

  function locSuffix(needle) {
    for (let i = 0; i < bodyLines.length; i++) {
      if (bodyLines[i].includes(needle)) return { line: bodyStart + i, suffix: ` (line ${bodyStart + i})` };
    }
    return { line: null, suffix: '' };
  }

  const infos = [];
  const flags = [];

  // --- Repo context ---------------------------------------------------------
  const probeDir = opts.repo ? path.resolve(opts.repo) : (isInsideVault(absDocPath) ? VAULT_ROOT : docDir);
  const { code: rootCode, stdout: rootOut } = git(['rev-parse', '--show-toplevel'], probeDir);
  const inGit = rootCode === 0 && rootOut.length > 0;
  const repoRoot = inGit ? rootOut : probeDir;
  let upstream = null;

  if (inGit) {
    const { code: upCode, stdout: upOut } = git(['rev-parse', '--abbrev-ref', 'origin/HEAD'], repoRoot);
    if (upCode === 0 && upOut) {
      upstream = upOut;
    } else {
      for (const candidate of ['origin/main', 'origin/master']) {
        const { code } = git(['rev-parse', '--verify', '--quiet', candidate], repoRoot);
        if (code === 0) { upstream = candidate; break; }
      }
    }
    if (upstream) {
      const { code: behindCode, stdout: behindOut } = git(['rev-list', '--count', `HEAD..${upstream}`], repoRoot);
      if (behindCode === 0 && /^\d+$/.test(behindOut) && Number(behindOut) > 0) {
        infos.push(
          `INFO: worktree is ${behindOut} commits behind ${upstream}: verify merge-state claims against remote truth, not this checkout`
        );
      }
    } else {
      infos.push('INFO: no upstream default branch found. path/SHA classification limited to HEAD');
    }
  } else {
    infos.push('INFO: not a git repository. path and SHA classification skipped (wikilink, link and scaffold checks still apply)');
  }

  function upstreamHasPath(p) {
    if (!(inGit && upstream)) return false;
    return git(['cat-file', '-e', `${upstream}:${p}`], repoRoot).code === 0;
  }

  function headHasPath(p) {
    if (!inGit) return false;
    return git(['cat-file', '-e', `HEAD:${p}`], repoRoot).code === 0;
  }

  // --- 1. Cited repo paths ---------------------------------------------------
  let checkedPaths = 0;
  const seenPaths = new Set();
  const base = inGit ? repoRoot : probeDir;
  let bm;
  BACKTICK_RE.lastIndex = 0;
  while ((bm = BACKTICK_RE.exec(body))) {
    const raw = bm[1];
    const token = normalizePath(raw);
    if (!isPathCandidate(token)) continue;
    let check = token;
    if (token.startsWith('../') || token.includes('/../')) {
      // A `../` citation is doc-relative, matching how markdown links
      // resolve, so it maps to a repo-root path before checking.
      if (!inGit) continue;
      const resolved = path.resolve(docDir, token);
      const rel = toPosix(path.relative(base, resolved));
      if (rel.startsWith('..')) continue; // escapes the repo, not checkable as a repo path
      check = rel;
    }
    if (seenPaths.has(check)) continue;
    seenPaths.add(check);
    if (existsSync(path.join(base, check))) {
      checkedPaths++;
      continue;
    }
    const trackedHead = headHasPath(check);
    const trackedUpstream = upstreamHasPath(check);
    if (!(trackedHead || trackedUpstream) && !isPathShaped(check, base)) {
      continue; // branch name or provider ID, not a path citation
    }
    checkedPaths++;
    const loc = locSuffix(raw);
    if (trackedHead) {
      flags.push({
        category: 'path',
        cite: `\`${token}\``,
        line: loc.line,
        message: `tracked at HEAD but missing from the working tree${loc.suffix}: deleted or uncommitted removal? Annotate as historical, or restore it.`,
      });
    } else if (trackedUpstream) {
      flags.push({
        category: 'path',
        cite: `\`${token}\``,
        line: loc.line,
        message: `not in working tree but exists at ${upstream}${loc.suffix}: stale checkout? Annotate, or verify against upstream.`,
      });
    } else {
      const where = upstream ? `working tree or ${upstream}` : 'working tree';
      flags.push({
        category: 'path',
        cite: `\`${token}\``,
        line: loc.line,
        message: `not found in ${where}${loc.suffix}. Fix the citation, or annotate it as historical.`,
      });
    }
  }

  // --- 2. Cited wikilinks (ecosystem addition) --------------------------------
  let checkedWikilinks = 0;
  const seenWikilinks = new Set();
  let vaultIndex = null;
  function buildVaultIndex() {
    if (vaultIndex) return vaultIndex;
    const tracked = git(['ls-files'], VAULT_ROOT);
    const untracked = git(['ls-files', '--others', '--exclude-standard'], VAULT_ROOT);
    const ok = tracked.code === 0;
    const files = new Set();
    for (const out of [tracked, untracked]) {
      if (out.code !== 0) continue;
      for (const line of out.stdout.split('\n')) {
        const t = line.trim();
        if (t) files.add(toPosix(t));
      }
    }
    const exactSet = new Set();
    const basenameMap = new Map();
    for (const relPath of files) {
      exactSet.add(relPath.toLowerCase());
      const baseName = relPath.split('/').pop();
      const key = baseName.replace(/\.[^./]+$/, '').toLowerCase();
      if (!basenameMap.has(key)) basenameMap.set(key, []);
      basenameMap.get(key).push(relPath);
    }
    vaultIndex = { ok, exactSet, basenameMap };
    return vaultIndex;
  }

  function resolveWikilink(target) {
    const idx = buildVaultIndex();
    if (!idx.ok) return null; // vault root is not a git repo, unclassifiable
    const lower = target.toLowerCase();
    const withMd = lower.endsWith('.md') ? lower : `${lower}.md`;
    if (idx.exactSet.has(lower) || idx.exactSet.has(withMd)) return true;
    const baseKey = target.split('/').pop().replace(/\.[^./]+$/, '').toLowerCase();
    return idx.basenameMap.has(baseKey);
  }

  let vaultIndexOk = true;
  WIKILINK_RE.lastIndex = 0;
  let wm;
  while ((wm = WIKILINK_RE.exec(body))) {
    const raw = wm[1];
    let target = raw.split('|')[0].split('#')[0].trim();
    if (!target) continue; // heading-only self link, not a path citation
    if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue; // URL scheme in a wikilink body
    if (seenWikilinks.has(target)) continue;
    seenWikilinks.add(target);
    checkedWikilinks++;
    const resolved = resolveWikilink(target);
    if (resolved === null) {
      vaultIndexOk = false;
      continue;
    }
    if (!resolved) {
      const loc = locSuffix(`[[${raw}]]`);
      flags.push({
        category: 'wikilink',
        cite: `[[${raw}]]`,
        line: loc.line,
        message: `target "${target}" not found in the vault by exact path or basename${loc.suffix}. Fix the link, or repoint it to the note's current location.`,
      });
    }
  }
  if (!vaultIndexOk) {
    infos.push('INFO: vault root is not a git repository. wikilink checks skipped');
  }

  // --- 3. Cited commit SHAs ---------------------------------------------------
  let checkedShas = 0;
  const seenShas = new Set();
  if (inGit) {
    SHA_RE.lastIndex = 0;
    let sm;
    while ((sm = SHA_RE.exec(body))) {
      const sha = sm[0];
      if (seenShas.has(sha)) continue;
      const hasDigit = /\d/.test(sha);
      const hasLetter = /[a-f]/.test(sha);
      if (!(hasDigit && hasLetter)) continue; // dates and decimal ids are not SHAs
      seenShas.add(sha);
      checkedShas++;
      const loc = locSuffix(sha);
      const { code: resolveCode } = git(['cat-file', '-e', `${sha}^{commit}`], repoRoot);
      if (resolveCode !== 0) {
        flags.push({
          category: 'sha',
          cite: sha,
          line: loc.line,
          message: `does not resolve to a commit in this repository${loc.suffix}. Replace with the PR number, or drop it.`,
        });
        continue;
      }
      const inHead = git(['merge-base', '--is-ancestor', sha, 'HEAD'], repoRoot).code === 0;
      const inUp = upstream !== null && git(['merge-base', '--is-ancestor', sha, upstream], repoRoot).code === 0;
      if (inHead && (inUp || upstream === null)) continue;
      if (inHead && !inUp) {
        flags.push({
          category: 'sha',
          cite: sha,
          line: loc.line,
          message: `reachable from HEAD but not ${upstream}${loc.suffix}: local-only commit whose SHA may be rewritten on merge. Prefer citing the PR number.`,
        });
      } else if (inUp) {
        flags.push({
          category: 'sha',
          cite: sha,
          line: loc.line,
          message: `not reachable from HEAD but reachable from ${upstream}${loc.suffix}: this checkout predates the merge. Add a temporal qualifier, or verify the claim via gh.`,
        });
      } else {
        flags.push({
          category: 'sha',
          cite: sha,
          line: loc.line,
          message: `exists but unreachable from HEAD${upstream ? ` or ${upstream}` : ''}${loc.suffix}: likely a rebased-away commit. Prefer citing the PR number.`,
        });
      }
    }
  }

  // --- 4. Relative markdown links --------------------------------------------
  let checkedLinks = 0;
  const seenLinks = new Set();
  MD_LINK_RE.lastIndex = 0;
  let lm;
  while ((lm = MD_LINK_RE.exec(body))) {
    const target = lm[1];
    if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue; // URL scheme
    if (target.startsWith('#')) continue; // intra-doc anchor
    const bare = target.split('#')[0];
    if (!bare || seenLinks.has(bare)) continue;
    seenLinks.add(bare);
    checkedLinks++;
    if (!existsSync(path.normalize(path.join(docDir, bare)))) {
      const loc = locSuffix(target);
      flags.push({
        category: 'link',
        cite: `(${target})`,
        line: loc.line,
        message: `relative target does not resolve from the doc's location${loc.suffix}. Fix the path.`,
      });
    }
  }

  // --- 5. Dangling drafting scaffold ------------------------------------------
  for (let i = 0; i < bodyLines.length; i++) {
    for (const pattern of SCAFFOLD_RES) {
      const m = bodyLines[i].match(pattern);
      if (m) {
        flags.push({
          category: 'scaffold',
          cite: `"${m[0]}"`,
          line: bodyStart + i,
          message: `drafting-context reference leaked into the doc (line ${bodyStart + i}). Rewrite it as a real path or link.`,
        });
      }
    }
  }

  // --- Report -------------------------------------------------------------------
  const counts = {
    paths: checkedPaths,
    wikilinks: checkedWikilinks,
    shas: checkedShas,
    links: checkedLinks,
    flags: flags.length,
  };

  if (opts.json) {
    process.stdout.write(JSON.stringify({
      file: docPath,
      repo: repoRoot,
      inGit,
      upstream,
      counts,
      infos,
      flags,
    }, null, 2) + '\n');
    return flags.length ? 1 : 0;
  }

  console.log(`FILE: ${docPath}`);
  if (repoRoot) console.log(`repo: ${repoRoot}${upstream ? ` (upstream ${upstream})` : ''}`);
  for (const info of infos) console.log(info);

  const groups = ['path', 'wikilink', 'sha', 'link', 'scaffold'];
  const labels = { path: 'PATHS', wikilink: 'WIKILINKS', sha: 'SHAS', link: 'LINKS', scaffold: 'SCAFFOLD' };
  for (const group of groups) {
    const groupFlags = flags.filter((f) => f.category === group);
    if (!groupFlags.length) continue;
    console.log(`-- ${labels[group]} --`);
    for (const f of groupFlags) {
      console.log(`FLAG ${f.category} ${f.cite}: ${f.message}`);
    }
  }

  console.log(
    `checked ${counts.paths} paths, ${counts.wikilinks} wikilinks, ${counts.shas} SHAs, ${counts.links} links; ${counts.flags} flags`
  );
  if (!flags.length) console.log(`OK: ${docPath}`);
  return flags.length ? 1 : 0;
}

process.exit(main(process.argv));
