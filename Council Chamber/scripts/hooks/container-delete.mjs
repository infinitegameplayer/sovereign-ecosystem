#!/usr/bin/env node
// container-delete.mjs
// The container rule of the Permanent Floor gate. Called by
// pre-tool-approval-gate.sh on every Bash and PowerShell payload.
//
// The rule: a delete whose target resolves inside one of the vault's canonical
// top-level containers is refused whatever the extension, including a
// directory delete and the vault root itself. The extension list in the shell
// gate (PROTECTED_EXTENSIONS) guards individual files. This module guards the
// places those files live, so `rm -rf "Library"`, `git rm -r Inbox/old` and
// `find Scriptorium -delete` no longer pass for lack of a .md in the command.
//
// Allowed: node_modules anywhere (regenerable), anything outside the vault,
// a path built at run time (a variable or $(...)), a search or print that only
// mentions a delete verb, a commit message or echo text that names a delete,
// a dry run, and the same container names in a different repo (the session cwd
// sits outside the vault).
//
// This is a module and not shell because the reading it does (quotes, heredocs,
// nested shells, a working directory that moves with cd) is parsing, and a
// parser is safer to edit in a language where an apostrophe in a comment is
// only a character.
//
// CONTRACT WITH THE SHELL. Input on stdin: the hook payload JSON. Environment:
//   SOVEREIGN_VAULT_ROOT   absolute vault root (the shell always sets it)
//   SOVEREIGN_CONTAINERS   container names separated by a pipe character
// Output on stdout: one line, "BLOCK: <reason>" or empty for allow. Any other
// outcome (a crash, a nonzero exit) is read by the shell as a refusal, because
// a Floor guard resolves no verdict toward refusal.
//
// Known limits, named so nobody reads silence as coverage: a path built at run
// time, a delete fed by a pipe (xargs rm, Get-ChildItem | Remove-Item), a
// string passed to an interpreter script as an argument, and a file sitting
// directly in the vault root.
//
// Proven by: floor-gate-selftest.mjs ("container:" cases). Run it after ANY
// edit here. A guard is verified by firing, never by reading.

const WIN = process.platform === 'win32';

// Forward slashes always. On Windows a Git Bash path (/c/Users/...) becomes the
// drive form (C:/Users/...), so a vault root from $PWD and a cwd from the
// payload compare equal.
function norm(p) {
  let s = String(p).replace(/\\/g, '/');
  if (WIN) s = s.replace(/^\/([A-Za-z])(\/|$)/, '$1:/');
  return s;
}

const VAULT = norm(process.env.SOVEREIGN_VAULT_ROOT || process.cwd()).replace(/\/+$/, '');
const CONTAINERS = String(process.env.SOVEREIGN_CONTAINERS || '')
  .split('|')
  .map((x) => x.trim())
  .filter(Boolean);
const CONTAINERS_LC = CONTAINERS.map((x) => x.toLowerCase());

const SHELL_DELETE_HEADS = new Set(['rm', 'rmdir', 'rd', 'del', 'erase', 'ri', 'remove-item', 'unlink', 'shred']);
const INTERPRETERS = new Set(['node', 'python', 'python3', 'py', 'perl', 'ruby', 'deno', 'bun']);
const NESTED_POSIX = new Set(['bash', 'sh', 'zsh']);
const NESTED_WINDOWS = new Set(['cmd', 'powershell', 'pwsh']);
const PREFIX_WORDS = new Set(['then', 'do', 'else', 'elif', '!', 'sudo', 'command', 'builtin', 'exec', 'nohup', 'time', 'nice', 'env']);
const PROSE_BEARING = /^(gh|glab)\b|^git\s+(commit|tag|notes)\b/i;
// The lookbehind keeps lookalikes out: performSync( contains rmSync(.
const DELETE_CALL = /(?<![A-Za-z0-9_$])(?:unlinkSync|rmSync|rmdirSync|unlink|rmdir|rm|removedirs|remove|rmtree)\s*\(\s*(["'`])([^"'`]*)\1|::Delete\s*\(\s*(["'`])([^"'`]*)\3/g;
const PATHLIB_DELETE = /Path\s*\(\s*(["'])([^"']*)\1\s*\)\s*\.\s*(unlink|rmdir)\b/g;

let input = '';
process.stdin.on('data', (c) => { input += c; });
process.stdin.on('end', () => {
  let j;
  try {
    j = JSON.parse(input);
  } catch (e) {
    process.stdout.write('\n');
    return;
  }
  let verdict = '';
  if (j.tool_name === 'Bash' || j.tool_name === 'PowerShell') {
    const cwd = j.cwd ? norm(j.cwd).replace(/\/+$/, '') : VAULT;
    verdict = containerDelete((j.tool_input || {}).command || '', cwd, j.tool_name === 'Bash');
  }
  process.stdout.write(verdict.replace(/[\r\n]+/g, ' ') + '\n');
});

function containerDelete(cmd, cwd, escapes) {
  for (const raw of commandSegments(cmd, escapes)) {
    let seg = raw;
    if (PROSE_BEARING.test(seg)) {
      seg = seg.replace(/"(?:[^"\\]|\\.)*"/g, '""').replace(/'[^']*'/g, "''");
    }
    const words = stripPrefixes(shellWords(seg, escapes));
    if (!words.length) continue;
    const head = words[0].replace(/^\\/, '').replace(/^.*[\/\\]/, '').replace(/\.exe$/i, '').toLowerCase();

    if (head === 'cd') {
      if (words[1] && words[1] !== '-') cwd = resolvePath(cwd, words[1]);
      continue;
    }

    let targets = [];
    let at = cwd;
    if (SHELL_DELETE_HEADS.has(head)) {
      targets = operands(words.slice(1));
    } else if (head === 'git') {
      let i = 1;
      while (i < words.length && /^(-C|-c|--git-dir|--work-tree)$/.test(words[i])) {
        if (words[i] === '-C' && words[i + 1]) at = resolvePath(at, words[i + 1]);
        i += 2;
      }
      const rest = words.slice(i + 1);
      if (words[i] === 'rm') targets = operands(rest);
      if (words[i] === 'clean' && !rest.some((w) => /^(-n|--dry-run)$/.test(w) || /^-[a-z]*n[a-z]*$/.test(w))) {
        targets = operands(rest);
        if (!targets.length) targets = ['.'];
      }
    } else if (head === 'find') {
      const deletes = words.includes('-delete') ||
        words.some((w, i) => /^-(exec|execdir|ok)$/.test(w) && /^(rm|unlink|shred|del)$/i.test(words[i + 1] || ''));
      if (deletes) {
        for (const w of words.slice(1)) {
          if (/^[-(!]/.test(w)) break;
          targets.push(w);
        }
      }
    } else if (INTERPRETERS.has(head) || /^\[(System\.)?IO\.(File|Directory)\]::Delete/i.test(seg)) {
      for (const re of [DELETE_CALL, PATHLIB_DELETE]) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(seg)) !== null) targets.push(re === DELETE_CALL ? (m[2] !== undefined ? m[2] : m[4]) : m[2]);
      }
    } else if (NESTED_POSIX.has(head)) {
      const c = words.indexOf('-c');
      if (c > 0 && words[c + 1]) {
        const v = containerDelete(words[c + 1], at, true);
        if (v) return v;
      }
    } else if (NESTED_WINDOWS.has(head)) {
      let c = words.findIndex((w, i) => i > 0 && /^([\/-][ck]|-command)$/i.test(w));
      if (c < 0) c = words.findIndex((w, i) => i > 0 && !/^[\/-]/.test(w)) - 1;
      if (c >= 0) {
        // One argument is the program text itself. Several are re-quoted words.
        const after = words.slice(c + 1);
        const program = after.length === 1 ? after[0] : after.map((w) => (/\s/.test(w) ? `"${w}"` : w)).join(' ');
        const v = containerDelete(program, at, false);
        if (v) return v;
      }
    }

    for (const t of targets) {
      if (inContainer(at, t)) {
        return 'BLOCK: Deletion inside a vault container requires approval. Target: ' + t;
      }
    }
  }
  return '';
}

// Split on unquoted newline, semicolon, &&, ||, a pipe and a lone ampersand. A
// heredoc body stays with the command that reads it, so its lines are data and
// never commands. Backslash escapes are honored when escapes is set (Bash).
function commandSegments(cmd, escapes) {
  const out = [];
  let cur = '';
  let sq = false;
  let dq = false;
  const pending = [];
  for (let i = 0; i < cmd.length; i++) {
    const ch = cmd[i];
    if (sq) { if (ch === "'") sq = false; cur += ch; continue; }
    if (dq) {
      if (escapes && ch === '\\' && i + 1 < cmd.length) { cur += ch + cmd[++i]; continue; }
      if (ch === '"') dq = false;
      cur += ch;
      continue;
    }
    if (escapes && ch === '\\' && i + 1 < cmd.length && cmd[i + 1] !== '\n') { cur += ch + cmd[++i]; continue; }
    if (ch === "'") { sq = true; cur += ch; continue; }
    if (ch === '"') { dq = true; cur += ch; continue; }
    if (ch === '<' && cmd[i + 1] === '<' && cmd[i + 2] !== '<') {
      const m = /^<<(-?)\s*(["']?)([A-Za-z_][A-Za-z0-9_]*)\2/.exec(cmd.slice(i));
      if (m) {
        pending.push({ word: m[3], strip: m[1] === '-' });
        cur += m[0];
        i += m[0].length - 1;
        continue;
      }
    }
    if (ch === '\n' && pending.length) {
      // Swallow each pending heredoc body up to its delimiter line.
      let k = i + 1;
      while (pending.length) {
        const { word, strip } = pending.shift();
        for (;;) {
          const nl = cmd.indexOf('\n', k);
          const line = cmd.slice(k, nl < 0 ? cmd.length : nl);
          cur += '\n' + line;
          k = nl < 0 ? cmd.length : nl + 1;
          if ((strip ? line.replace(/^\t+/, '') : line).replace(/\r$/, '') === word || nl < 0) break;
        }
      }
      i = k - 1;
      out.push(cur);
      cur = '';
      continue;
    }
    if (ch === '\n' || ch === ';') { out.push(cur); cur = ''; continue; }
    if ((ch === '&' && cmd[i + 1] === '&') || (ch === '|' && cmd[i + 1] === '|')) { out.push(cur); cur = ''; i++; continue; }
    if (ch === '|' && cmd[i - 1] !== '>') { out.push(cur); cur = ''; continue; }
    if (ch === '&' && cmd[i + 1] !== '>' && cmd[i - 1] !== '>' && cmd[i - 1] !== '<') { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

// Words with quotes removed. Outside quotes a backslash escapes the next
// character when escapes is set, so Council\ Chamber reads as one word.
function shellWords(seg, escapes) {
  const out = [];
  let cur = '';
  let has = false;
  let sq = false;
  let dq = false;
  for (let i = 0; i < seg.length; i++) {
    const ch = seg[i];
    if (sq) { if (ch === "'") sq = false; else cur += ch; continue; }
    if (dq) {
      if (escapes && ch === '\\' && '"\\$`'.includes(seg[i + 1] || '')) cur += seg[++i];
      else if (ch === '"') dq = false;
      else cur += ch;
      continue;
    }
    if (ch === "'") { sq = true; has = true; continue; }
    if (ch === '"') { dq = true; has = true; continue; }
    if (escapes && ch === '\\' && i + 1 < seg.length) { cur += seg[++i]; has = true; continue; }
    if (/\s/.test(ch)) { if (has) out.push(cur); cur = ''; has = false; continue; }
    cur += ch;
    has = true;
  }
  if (has) out.push(cur);
  return out;
}

// Drop what sits in front of the real command: control words, grouping
// characters, env and its assignments, wrappers like nohup and sudo.
function stripPrefixes(words) {
  const w = words.slice();
  for (;;) {
    if (!w.length) return w;
    if (/^[({]+$/.test(w[0])) { w.shift(); continue; }
    if (/^[({]/.test(w[0])) { w[0] = w[0].replace(/^[({]+/, ''); continue; }
    if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(w[0])) { w.shift(); continue; }
    const bare = w[0].replace(/^\\/, '').replace(/^.*\//, '').toLowerCase();
    if (PREFIX_WORDS.has(bare)) {
      w.shift();
      while (w.length && /^-/.test(w[0])) {
        const flag = w.shift();
        if (/^-(n|u|-adjustment|-unset)$/.test(flag) && w.length) w.shift();
      }
      continue;
    }
    return w;
  }
}

// The path operands of a delete: no flags, no redirections, no cmd switches.
function operands(words) {
  return words
    .map((x) => (/\)$/.test(x) && (x.match(/\)/g) || []).length > (x.match(/\(/g) || []).length ? x.replace(/\)+$/, '') : x))
    .filter((x) => x && x !== '--' && x !== '}' && !/^-/.test(x) && !/^\/[A-Za-z]$/.test(x) && !/[<>]/.test(x));
}

// Resolve p against cwd into a clean forward-slash path with dot segments gone.
function resolvePath(cwd, p) {
  let s = norm(p);
  const home = norm(process.env.USERPROFILE || process.env.HOME || '');
  if (s === '~' || s.startsWith('~/')) s = home + s.slice(1);
  const abs = /^([A-Za-z]:\/|\/)/.test(s);
  const base = abs ? s : `${cwd.replace(/\/+$/, '')}/${s}`;
  const parts = [];
  base.split('/').forEach((x, i) => {
    if (x === '..') parts.pop();
    else if (x !== '.' && !(x === '' && i > 0)) parts.push(x);
  });
  return parts.join('/');
}

// A glob component such as * or Council* matches a container name.
function globHitsContainer(component) {
  if (!/[*?[]/.test(component)) return false;
  const re = new RegExp('^' + component.replace(/[.+^${}()|\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i');
  return CONTAINERS.some((n) => re.test(n));
}

// True when target, resolved from cwd, lands in a container or on the vault root.
function inContainer(cwd, target) {
  if (!target || /[$%]/.test(target)) return false;   // unresolvable at read time
  const full = resolvePath(cwd, target);
  if (/(^|\/)node_modules(\/|$)/i.test(full)) return false;
  const fullLc = full.toLowerCase();
  const rootLc = VAULT.toLowerCase();
  if (fullLc === rootLc) return true;                   // the vault root itself
  if (!fullLc.startsWith(rootLc + '/')) return false;   // outside the vault
  const first = full.slice(VAULT.length + 1).split('/')[0];
  return CONTAINERS_LC.includes(first.toLowerCase()) || globHitsContainer(first);
}
