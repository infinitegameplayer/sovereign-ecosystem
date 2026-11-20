#!/usr/bin/env node
// pre-bash-git-add-guard.mjs
// The decision logic of pre-bash-git-add-guard.sh (PreToolUse on Bash and PowerShell).
//
// WHAT IT GUARDS. Several AI sessions can work in one vault at the same time
// (session-coordination.mjs tells each about the others). A sweeping stage or
// commit run by one of them takes every other session's unfinished work into
// its commit under its own message, and nothing says so. Commit by pathspec instead.
//
// Denied when the command targets this vault (the payload's cwd inside it, a cd
// into it, or git -C pointing at it):
//   git add -A | --all | . | -u with no path      git commit -a | -am | --all
// Allowed: git add -- "<path>", every other repo, and heredoc or here-string
// commit messages that only mention those words.
//
// THE VAULT is SOVEREIGN_VAULT_ROOT (settings.json sets it from
// CLAUDE_PROJECT_DIR), else the folder three levels above this file, which is
// the vault this script shipped in. Nothing here names a machine.
//
// A FOLDER BUILT FROM A VARIABLE. `S=/tmp/work; cd "$S" && git add -A` is read
// with S expanded, from an assignment earlier in the same command (bash
// `NAME=value`, PowerShell `$Name = 'value'`) or from the hook's environment.
// Read literally, "$S" is a folder named $S inside the vault, and a commit in a
// scratch folder is refused as a vault sweep. A target that still cannot be
// resolved asks rather than denies: the guard cannot know, so the person does.
//
// FAILS CLOSED. A payload that is not a JSON object, or an error here, exits 1,
// and the wrapper turns that into exit 2, which holds the call. Write and Edit
// are never matched, so a broken guard leaves the door to repair it.
//
// The parser is exported for pre-shell-git-verb-gate.mjs, so the two hooks read
// a command's segments the same way.
//
// Proven by: hooks-selftest.mjs, the git-add-guard cases.

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));

export { norm, resolveDir, stripBodies, segments, base, expandVars };

function norm(p) {
  let s = String(p || '').replace(/\\/g, '/').toLowerCase();
  s = s.replace(/^\/([a-z])\//, '$1:/');
  return s.replace(/\/+$/, '');
}
const isAbs = (p) => /^[a-z]:\//.test(p) || p.startsWith('/');
function resolveDir(cur, p) {
  const n = norm(p);
  if (!n) return cur;
  if (isAbs(n)) return path.posix.normalize(n);
  if (cur === null) return null; // relative to a folder already unknown
  return path.posix.normalize(`${cur}/${n}`);
}

export function vaultRoot() {
  return norm(process.env.SOVEREIGN_VAULT_ROOT || path.resolve(HERE, '..', '..', '..'));
}

// Removes heredoc bodies and PowerShell here-strings, so message text never reads as a command.
function stripBodies(cmd) {
  const s = cmd.replace(/@(['"])[ \t]*\r?\n[\s\S]*?\r?\n\1@/g, '@HS@');
  const lines = s.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    const m = lines[i].match(/<<-?\s*(['"]?)([A-Za-z_]\w*)\1/);
    if (m) {
      let j = i + 1;
      while (j < lines.length && lines[j].trim() !== m[2]) j++;
      i = j; // skip body and terminator
    }
  }
  return out.join('\n');
}

// Splits into segments of unquoted tokens at ; | & and newlines outside quotes.
function segments(cmd) {
  const segs = [];
  let toks = [];
  let cur = '';
  let has = false;
  let q = null;
  const endTok = () => { if (has) toks.push(cur); cur = ''; has = false; };
  const endSeg = () => { endTok(); if (toks.length) segs.push(toks); toks = []; };
  for (let i = 0; i < cmd.length; i++) {
    const c = cmd[i];
    if (q) {
      if (c === q) q = null; else cur += c;
      continue;
    }
    if (c === '"' || c === "'") { q = c; has = true; continue; }
    if (c === ';' || c === '|' || c === '&' || c === '\n' || c === '\r') { endSeg(); continue; }
    if (c === ' ' || c === '\t') { endTok(); continue; }
    if (c === '(' || c === ')' || c === '{' || c === '}') { endTok(); continue; }
    cur += c; has = true;
  }
  endSeg();
  return segs;
}

const SHELLS = new Set(['bash', 'sh', 'zsh', 'pwsh', 'powershell', 'cmd']);
const base = (t) => t.replace(/\\/g, '/').split('/').pop().toLowerCase().replace(/\.exe$/, '');

// Expands $NAME, ${NAME}, $env:NAME and a leading ~ from the command's own
// assignments, then the environment. Returns null when a variable stays unknown.
function expandVars(tok, vars) {
  const lookup = (name) => {
    if (Object.prototype.hasOwnProperty.call(vars, name)) return vars[name];
    if (Object.prototype.hasOwnProperty.call(vars, name.toLowerCase())) return vars[name.toLowerCase()];
    const envKey = Object.keys(process.env).find((k) => k === name || k.toLowerCase() === name.toLowerCase());
    return envKey ? process.env[envKey] : undefined;
  };
  let unknown = false;
  let s = tok.replace(/^~(?=$|[\\/])/, () => {
    const h = process.env.HOME || process.env.USERPROFILE;
    if (!h) unknown = true;
    return h || '';
  });
  s = s.replace(/\$(?:\{([A-Za-z_]\w*)\}|env:([A-Za-z_]\w*)|([A-Za-z_]\w*))/g, (_, a, b, c) => {
    const v = lookup(a || b || c);
    if (v === undefined) { unknown = true; return ''; }
    return v;
  });
  if (/\$\(|`/.test(s)) unknown = true; // command substitution: unknowable here
  return unknown ? null : s;
}

// Records an assignment segment into vars. Returns true when the segment was one.
function assignment(toks, vars) {
  const ps = toks.length >= 3 && /^\$[A-Za-z_]\w*$/.test(toks[0]) && toks[1] === '=';
  if (ps) {
    const v = expandVars(toks[2], vars);
    vars[toks[0].slice(1).toLowerCase()] = v === null ? undefined : v;
    return true;
  }
  let k = 0;
  if (['export', 'local', 'declare', 'readonly'].includes(toks[0])) k = 1;
  const m = toks[k] && toks[k].match(/^([A-Za-z_]\w*)=(.*)$/);
  if (m && k + 1 === toks.length) {
    const v = expandVars(m[2], vars);
    vars[m[1]] = v === null ? undefined : v;
    return true;
  }
  return false;
}

// Returns { hit, sure } when a sweep targets the vault (sure) or a folder that
// could not be resolved (not sure), else null.
function check(command, startCwd, vault, depth = 0, vars = {}) {
  let cwd = norm(startCwd);
  const inVault = (d) => d === vault || d.startsWith(`${vault}/`);
  for (const toks of segments(stripBodies(command))) {
    if (assignment(toks, vars)) continue;
    const head = base(toks[0]);
    if (['cd', 'set-location', 'sl', 'chdir', 'push-location', 'pushd'].includes(head)) {
      const arg = toks.slice(1).find((t) => !/^-/.test(t) && t.toLowerCase() !== '/d');
      if (arg) {
        const x = expandVars(arg, vars);
        cwd = x === null ? null : resolveDir(cwd, x);
      }
      continue;
    }
    if (SHELLS.has(head) && depth < 2) {
      const k = toks.findIndex((t) => /^(-c|-command|\/c)$/i.test(t));
      if (k > 0 && toks[k + 1]) {
        const r = check(toks[k + 1], cwd, vault, depth + 1, { ...vars });
        if (r) return r;
      }
      continue;
    }
    if (head !== 'git') continue;
    let dir = cwd;
    let i = 1;
    while (i < toks.length && toks[i].startsWith('-')) {
      if (toks[i] === '-C' && toks[i + 1]) {
        const x = expandVars(toks[i + 1], vars);
        dir = x === null ? null : resolveDir(dir, x);
        i += 2;
        continue;
      }
      if (['-c', '--git-dir', '--work-tree', '--namespace', '--config-env', '--exec-path'].includes(toks[i]) && toks[i + 1]) { i += 2; continue; }
      i += 1;
    }
    const known = dir !== null;
    if (known && !inVault(dir)) continue;
    const sub = toks[i];
    const args = toks.slice(i + 1);
    let hit = null;
    if (sub === 'add') {
      const flags = args.filter((a) => a.startsWith('-') && a !== '--');
      const paths = [];
      let past = false;
      for (const a of args) {
        if (a === '--') { past = true; continue; }
        if (past || !a.startsWith('-')) paths.push(a);
      }
      const all = flags.some((f) => f === '--all' || /^-[a-zA-Z]*A[a-zA-Z]*$/.test(f));
      const upd = flags.some((f) => f === '--update' || /^-[a-zA-Z]*u[a-zA-Z]*$/.test(f));
      const dot = paths.some((p) => p === '.' || p === './');
      if (all) hit = 'git add -A';
      else if (dot) hit = 'git add .';
      else if (upd && paths.length === 0) hit = 'git add -u with no path';
    } else if (sub === 'commit') {
      for (const a of args) {
        if (a === '--') break;
        if (a === '--all') { hit = 'git commit --all'; break; }
        const m = a.match(/^-([a-zA-Z]+)$/);
        if (m) {
          let found = false;
          for (const ch of m[1]) {
            if (ch === 'a') { found = true; break; }
            if ('mFcCt'.includes(ch)) break; // value-taking flag: the rest is its value
          }
          if (found) { hit = 'git commit -a'; break; }
        }
      }
    }
    if (hit) return { hit, sure: known };
  }
  return null;
}

// Returns { decision: 'deny' | 'ask', reason } or null.
export function review(tool, command, cwd, vault = vaultRoot()) {
  if (tool !== 'Bash' && tool !== 'PowerShell') return null;
  if (typeof command !== 'string' || !command) return null;
  const r = check(command, cwd || process.cwd(), norm(vault));
  if (!r) return null;
  const fix = 'Commit by pathspec: git add -- "<path>" for each file you changed, then git commit -m "..." -- "<path>".';
  if (r.sure) {
    return { decision: 'deny', reason: `${r.hit} sweeps the whole vault, and other sessions may be working in this vault at the same time, so it would commit their work in progress. ${fix}` };
  }
  return { decision: 'ask', reason: `${r.hit} runs in a folder this guard could not resolve (a path built from a variable or a command it cannot read). If that folder is this vault, it would commit other sessions' work in progress. Confirm, or ${fix.charAt(0).toLowerCase()}${fix.slice(1)}` };
}

function main() {
  const raw = readFileSync(0, 'utf8');
  const input = JSON.parse(raw || 'null');
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    process.stderr.write('git-add guard: the payload is not a JSON object.\n');
    process.exit(1);
  }
  const ti = input.tool_input || {};
  const verdict = review(input.tool_name, ti.command, input.cwd);
  if (!verdict) process.exit(0);
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: verdict.decision, permissionDecisionReason: verdict.reason },
  }));
  process.exit(0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
