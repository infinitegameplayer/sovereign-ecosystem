#!/usr/bin/env node
// floor-guard-shell.mjs
// The shell reader of pre-write-floor-guard.sh. Kept in a real module because
// regex inside a shell-quoted node -e string is the shape that breaks every
// tool at once: one bad escape and the hook goes blind with no error.
//
// WHAT IT DOES. Reads one PreToolUse payload on stdin. For a Bash or PowerShell
// call it works out which trust-anchor files the command writes, moves, copies
// onto or deletes, and prints one JSON object on stdout:
//   {"tool":"Bash","hits":[{"path":"/repo/.claude/settings.json","via":"sed -i"}]}
// "hits" is empty when the command touches no trust anchor. Any other tool name
// prints an empty "hits" too: Write and Edit are read by the shell script
// itself, which keeps its own no-node path. This module never logs and never
// blocks. The wrapper turns each hit into the systemMessage, the stderr line
// and the log line.
//
// EXIT CODES. 0 whenever it ran, hit or not. 1 when the payload is not a JSON
// object or the module throws. The wrapper reads an exit 1, an empty stdout or
// a missing module as "could not parse" and falls back to a plain grep of the
// raw payload, so a shell write to a trust anchor is surfaced either way.
//
// THE LIST. The same seven trust anchors as the .sh, suffix-matched on a
// forward-slash path in any repo, case-insensitive: .claude/settings.json,
// .claude/settings.local.json, .claude/CLAUDE.md, .mcp.json, .claude.json,
// .claude/plugins/** and .vscode/tasks.json. Keep this list and the regex in
// pre-write-floor-guard.sh in step: a name in one and not the other is a gap.
//
// BASH. A segment surfaces when it writes a guarded path through sed -i, perl
// -i, > or >>, tee, mv, cp, install, truncate, dd of=, rm, unlink, shred, git
// mv, git rm, git checkout or git restore, or an interpreter write call
// (writeFileSync, appendFileSync, renameSync, open(..., "w") and kin). A cp, mv
// or install onto a trust-anchor DIRECTORY surfaces the file it lands as, and
// an rm or mv of a directory that holds trust anchors (.claude, .claude/plugins,
// .vscode) surfaces the directory. Prefixes (env, nohup, sudo, then, {) are read
// past, bash -c and sh -c are read inside, cd moves the working directory, and
// NAME=value and $HOME expand, because `D=".claude"; sed -i ... "$D/settings.json"`
// is a shape sessions type.
//
// POWERSHELL. A statement surfaces when its command is a write verb
// (Set-Content, Add-Content, Out-File, Copy-Item, Move-Item, Remove-Item,
// Rename-Item, New-Item, their aliases, git mv/rm/checkout/restore, sed -i),
// when it redirects with > or >>, or when it calls a .NET or interpreter write.
// Copy verbs surface their destination only. $name = 'value' assignments,
// $env:USERPROFILE, $HOME and ~ expand. It has its own tokenizer: PowerShell
// escapes with a backtick, so a backslash in C:\Users\... is a path separator,
// not the escape Bash's reader takes it for.
//
// KNOWN LIMITS, named so nobody reads silence as coverage. Paths built at run
// time ($(...), loops, find -exec, process.argv, Join-Path, a script block
// inside ForEach-Object) are not resolved. A trust-anchor name in any other repo
// surfaces too, as it should: the list is matched by suffix, not by vault. An
// interpreter segment that reads one trust anchor and writes elsewhere surfaces
// anyway: over-surfacing costs a line, a miss costs the anchor. A script file
// that is written first and run later (a .sh or .ps1 whose body names the
// anchor) is seen only at the moment it is written through the shell, never when
// it runs. When this module cannot run at all, the wrapper's grep fallback
// matches the anchor names in the raw payload without parsing.
//
// Proven by: the floor-guard section of hooks-selftest.mjs. Run it after ANY
// edit here.

import { homedir } from 'node:os';
import path from 'node:path';

const HOME = homedir().replace(/\\/g, '/');

// Suffix-matched on a forward-slash path, case-insensitive. The first pattern is
// the .sh's own with a (^|/) guard added: the .sh's bare form would also match a
// quoted phrase such as "Set-Content .claude/CLAUDE.md" inside a commit message,
// and the shell reader scans quoted runs, so it needs the stricter boundary.
const GUARDED = [
  /(^|\/)\.claude\/(settings\.json|settings\.local\.json|CLAUDE\.md)$/i,
  /(^|\/)\.mcp\.json$/i,
  /(^|\/)\.claude\.json$/i,
  /(^|\/)\.claude\/plugins\/.+$/i,
  /(^|\/)\.vscode\/tasks\.json$/i,
];

// Directories that hold a guarded file. Removing or moving one removes the
// trust anchor inside it, so an rm or mv operand that names one surfaces.
const GUARDED_DIRS = [
  /(^|\/)\.claude$/i,
  /(^|\/)\.claude\/plugins(\/.+)?$/i,
  /(^|\/)\.vscode$/i,
];

// Directories whose every file is a trust anchor, or near enough that a copy or
// move landing in one should be seen. Narrower than GUARDED_DIRS where the
// directory also holds ordinary files; here the two coincide.
const LANDING_DIRS = [
  /(^|\/)\.claude$/i,
  /(^|\/)\.claude\/plugins(\/.+)?$/i,
  /(^|\/)\.vscode$/i,
];

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  let j;
  try {
    j = JSON.parse(raw);
  } catch (e) {
    j = undefined;
  }
  if (!j || typeof j !== 'object' || Array.isArray(j)) {
    process.stderr.write('floor-guard-shell: the hook payload is not a JSON object\n');
    process.exit(1);
  }
  try {
    run(j);
  } catch (e) {
    process.stderr.write(`floor-guard-shell: ${(e && e.stack) || e}\n`);
    process.exit(1);
  }
});

function run(j) {
  const tool = String(j.tool_name || '');
  const input = j.tool_input && typeof j.tool_input === 'object' ? j.tool_input : {};
  let hits = [];

  if (tool === 'Bash') {
    hits = bashHits(String(input.command || ''), String(j.cwd || ''), { vars: { HOME, USERPROFILE: HOME } }, 0);
  } else if (tool === 'PowerShell') {
    hits = powershellHits(String(input.command || ''), String(j.cwd || ''));
  }

  const seen = new Set();
  hits = hits.filter((h) => (seen.has(h.path) ? false : (seen.add(h.path), true)));
  process.stdout.write(JSON.stringify({ tool, hits }) + '\n');
}

function norm(p) {
  return String(p).replace(/\\/g, '/');
}

// Normalized, so a path spelled through ../ or ./ lands on the file it reaches.
function isGuarded(p) {
  const n = path.posix.normalize(norm(p));
  return GUARDED.some((re) => re.test(n));
}

// ─── Bash ───────────────────────────────────────────────────────────────────

function resolveFrom(cwd, p) {
  let n = norm(p);
  if (n === '~' || n.startsWith('~/')) n = HOME + n.slice(1);
  if (/^([A-Za-z]:\/|\/)/.test(n) || !cwd) return path.posix.normalize(n);
  return path.posix.normalize(`${norm(cwd)}/${n}`);
}

// Split on unquoted newline, ;, &&, ||, | and a lone &. A >| clobber and the
// & of &>, >& and 2>&1 are not separators. A heredoc body joins the segment of
// the command that reads it, so an apostrophe in prose cannot open a quote
// that swallows the commands after it.
function segments(cmd) {
  const out = [];
  let cur = '';
  let sq = false;
  let dq = false;
  const pending = [];
  for (let i = 0; i < cmd.length; i++) {
    const ch = cmd[i];
    if (sq) { if (ch === "'") sq = false; cur += ch; continue; }
    if (dq) {
      if (ch === '\\' && i + 1 < cmd.length) { cur += ch + cmd[++i]; continue; }
      if (ch === '"') dq = false;
      cur += ch;
      continue;
    }
    if (ch === '\\' && i + 1 < cmd.length && cmd[i + 1] !== '\n') { cur += ch + cmd[++i]; continue; }
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
    if ((ch === '&' && cmd[i + 1] === '&') || (ch === '|' && cmd[i + 1] === '|')) {
      out.push(cur);
      cur = '';
      i++;
      continue;
    }
    if (ch === '|' && cmd[i - 1] !== '>') { out.push(cur); cur = ''; continue; }
    if (ch === '&' && cmd[i + 1] !== '>' && cmd[i - 1] !== '>' && cmd[i - 1] !== '<') { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

// The heredoc body, if any, is cut off before word splitting: it is data.
function commandLine(seg) {
  const nl = seg.indexOf('\n');
  return nl < 0 ? seg : seg.slice(0, nl);
}

// Word tokens with quotes removed and backslash escapes honored, plus
// redirection operators as their own entries. A file-descriptor prefix (2>,
// &>) is dropped; a duplication (>&2, 2>&1) names no file and is skipped whole.
function tokenize(seg) {
  const out = [];
  let cur = '';
  let has = false;
  let sq = false;
  let dq = false;
  const push = () => {
    if (has) out.push({ t: cur });
    cur = '';
    has = false;
  };
  for (let i = 0; i < seg.length; i++) {
    const ch = seg[i];
    if (sq) {
      if (ch === "'") sq = false; else cur += ch;
      continue;
    }
    if (dq) {
      if (ch === '\\' && i + 1 < seg.length && '"\\$`'.includes(seg[i + 1])) {
        cur += seg[++i];
      } else if (ch === '"') {
        dq = false;
      } else {
        cur += ch;
      }
      continue;
    }
    if (ch === "'") { sq = true; has = true; continue; }
    if (ch === '"') { dq = true; has = true; continue; }
    if (ch === '\\' && i + 1 < seg.length) { cur += seg[++i]; has = true; continue; }
    if (ch === ' ' || ch === '\t' || ch === '\r') { push(); continue; }
    if (ch === '>') {
      if (/^(\d+|&)$/.test(cur)) { cur = ''; has = false; } else push();
      let op = '>';
      if (seg[i + 1] === '>') { op = '>>'; i++; }
      if (seg[i + 1] === '&') {
        i++;
        while (/[\d-]/.test(seg[i + 1] || '')) i++;
        continue;
      }
      if (seg[i + 1] === '|') i++;
      out.push({ op });
      continue;
    }
    if (ch === '<') {
      push();
      if (seg[i + 1] === '<') {
        i++;
        if (seg[i + 1] === '-' || seg[i + 1] === '<') i++;
      }
      out.push({ op: '<' });
      continue;
    }
    cur += ch;
    has = true;
  }
  push();
  return out;
}

function expand(s, vars) {
  return s.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g, (m, a, b) => {
    const k = a || b;
    return Object.prototype.hasOwnProperty.call(vars, k) ? vars[k] : m;
  });
}

// Every quoted run in a segment, single, double and backtick, scanned
// independently so a path quoted inside a quoted node -e program is found.
function quotedRuns(seg) {
  const out = [];
  for (const re of [/'([^']*)'/g, /"([^"]*)"/g, /`([^`]*)`/g]) {
    let m;
    while ((m = re.exec(seg)) !== null) out.push(m[1]);
  }
  return out;
}

const INTERPRETER_WRITE = /(writeFileSync|appendFileSync|writeFile|appendFile|createWriteStream|copyFileSync|renameSync|rmSync|unlinkSync)\s*\(|\bopen\s*\([^)]*,\s*['"][wax]|\.write_(text|bytes)\s*\(|\b(Set-Content|Add-Content|Out-File)\b/;
const PREFIX_WORDS = /^(then|do|else|elif|!|sudo|command|builtin|exec|nohup|time|nice|env|export|local|readonly)$/;

function bashHits(cmd, cwd, state, depth) {
  const hits = [];
  for (const seg of segments(cmd)) {
    const toks = tokenize(commandLine(seg)).map((x) => (x.op ? x : { t: expand(x.t, state.vars) }));
    const args = [];
    const redirects = [];
    for (let i = 0; i < toks.length; i++) {
      const x = toks[i];
      if (x.op === '>' || x.op === '>>') {
        const n = toks[i + 1];
        if (n && !n.op) { redirects.push(n.t); i++; }
        continue;
      }
      if (x.op === '<') { i++; continue; }
      args.push(x.t);
    }

    // Read past what sits in front of the real command.
    for (;;) {
      if (!args.length) break;
      if (/^[({]+$/.test(args[0])) { args.shift(); continue; }
      if (/^[({]/.test(args[0])) { args[0] = args[0].replace(/^[({]+/, ''); continue; }
      if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(args[0])) {
        const eq = args[0].indexOf('=');
        state.vars[args[0].slice(0, eq)] = args[0].slice(eq + 1);
        args.shift();
        continue;
      }
      if (PREFIX_WORDS.test(args[0].replace(/^.*\//, ''))) {
        args.shift();
        while (args.length && /^-/.test(args[0])) {
          const flag = args.shift();
          if (/^-(n|u)$/.test(flag) && args.length) args.shift();
        }
        continue;
      }
      break;
    }

    let verb = (args[0] || '').replace(/^.*\//, '').replace(/\)+$/, '');
    let rest = args.slice(1).map((a) => a.replace(/\)+$/, ''));
    let at = cwd;
    if (verb === 'git') {
      while (rest.length && /^(-C|-c|--git-dir|--work-tree)$/.test(rest[0])) {
        if (rest[0] === '-C' && rest[1]) at = resolveFrom(at, rest[1]);
        rest = rest.slice(2);
      }
      if (/^(mv|rm|checkout|restore)$/.test(rest[0] || '')) {
        verb = `git ${rest[0]}`;
        rest = rest.slice(1);
      }
    }
    if (verb === 'cd') {
      if (rest[0] && rest[0] !== '-') cwd = resolveFrom(cwd, rest[0]);
      continue;
    }
    if (/^(bash|sh|zsh)$/.test(verb) && depth < 3) {
      const c = rest.indexOf('-c');
      if (c >= 0 && rest[c + 1]) hits.push(...bashHits(rest[c + 1], at, state, depth + 1));
      continue;
    }

    const operands = rest.filter((a) => a && a !== '--' && !a.startsWith('-'));
    const targets = [];
    const add = (list, via) => list.forEach((p) => targets.push({ p, via }));
    const landing = (srcs, dest, via) => {
      add([dest], via);
      if (LANDING_DIRS.some((re) => re.test(resolveFrom(at, dest).replace(/\/+$/, '')))) {
        add([dest], `${via} into a trust-anchor directory`);
      }
      // Onto a directory: the file lands as dest/basename(src).
      srcs.forEach((s) => add([`${dest.replace(/\/+$/, '')}/${norm(s).replace(/\/+$/, '').replace(/^.*\//, '')}`], via));
    };

    if (verb === 'sed' && rest.some((a) => /^-[A-Za-z]*i/.test(a) || a.startsWith('--in-place'))) {
      add(operands, 'sed -i');
    } else if (verb === 'perl' && rest.some((a) => /^-(?!M)[A-Za-z0-9]*i/.test(a))) {
      add(operands, 'perl -i');
    } else if (verb === 'tee' || verb === 'truncate' || verb === 'git checkout' || verb === 'git restore') {
      add(operands, verb);
    } else if (verb === 'rm' || verb === 'git rm' || verb === 'unlink' || verb === 'shred') {
      add(operands, verb);
      add(operands.filter((p) => GUARDED_DIRS.some((re) => re.test(resolveFrom(at, p).replace(/\/+$/, '')))), `${verb} of a trust-anchor directory`);
    } else if ((verb === 'mv' || verb === 'git mv') && operands.length >= 2) {
      add(operands.slice(0, -1), verb);
      add(operands.slice(0, -1).filter((p) => GUARDED_DIRS.some((re) => re.test(resolveFrom(at, p).replace(/\/+$/, '')))), `${verb} of a trust-anchor directory`);
      landing(operands.slice(0, -1), operands[operands.length - 1], verb);
    } else if ((verb === 'cp' || verb === 'install') && operands.length >= 2) {
      landing(operands.slice(0, -1), operands[operands.length - 1], verb);
    } else if (verb === 'dd') {
      add(rest.filter((a) => a.startsWith('of=')).map((a) => a.slice(3)), 'dd of=');
    }
    add(redirects, '>');

    const expandedSeg = expand(seg, state.vars);
    if (INTERPRETER_WRITE.test(expandedSeg)) add(quotedRuns(expandedSeg), 'interpreter write');

    for (const { p, via } of targets) {
      if (!p || /^\$/.test(p)) continue;
      const resolved = resolveFrom(at, p);
      const isDirHit = /trust-anchor directory/.test(via);
      if (isDirHit || isGuarded(resolved)) hits.push({ path: resolved, via });
    }
  }
  return hits;
}

// ─── PowerShell ─────────────────────────────────────────────────────────────

// Statements split on unquoted newline, ;, | and &&. A backtick escapes the next
// character; a backslash is an ordinary character (a path separator).
function psSegments(cmd) {
  const out = [];
  let cur = '';
  let sq = false;
  let dq = false;
  for (let i = 0; i < cmd.length; i++) {
    const ch = cmd[i];
    if (sq) { if (ch === "'") sq = false; cur += ch; continue; }
    if (dq) {
      if (ch === '`' && i + 1 < cmd.length) { cur += ch + cmd[++i]; continue; }
      if (ch === '"') dq = false;
      cur += ch;
      continue;
    }
    if (ch === '`' && i + 1 < cmd.length) { cur += ch + cmd[++i]; continue; }
    if (ch === "'") { sq = true; cur += ch; continue; }
    if (ch === '"') { dq = true; cur += ch; continue; }
    if (ch === '\n' || ch === ';' || ch === '|') { out.push(cur); cur = ''; continue; }
    if (ch === '&' && cmd[i + 1] === '&') { out.push(cur); cur = ''; i++; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

// Word tokens (quotes removed, each marked quoted or not) and redirection
// operators. A stream prefix (2>, *>) is dropped; a merge (2>&1) names no file.
// Commas, parentheses and braces separate words outside quotes.
function psTokenize(seg) {
  const out = [];
  let cur = '';
  let has = false;
  let quoted = false;
  let sq = false;
  let dq = false;
  const push = () => {
    if (has) out.push({ t: cur, quoted });
    cur = '';
    has = false;
    quoted = false;
  };
  for (let i = 0; i < seg.length; i++) {
    const ch = seg[i];
    if (sq) {
      if (ch === "'") {
        if (seg[i + 1] === "'") { cur += "'"; i++; } else sq = false;
      } else cur += ch;
      continue;
    }
    if (dq) {
      if (ch === '`' && i + 1 < seg.length) { cur += seg[++i]; continue; }
      if (ch === '"') dq = false; else cur += ch;
      continue;
    }
    if (ch === "'") { sq = true; has = true; quoted = true; continue; }
    if (ch === '"') { dq = true; has = true; quoted = true; continue; }
    if (ch === '`' && i + 1 < seg.length) { cur += seg[++i]; has = true; continue; }
    if (' \t\r,(){}'.includes(ch)) { push(); continue; }
    if (ch === '>') {
      if (/^(\d|\*)$/.test(cur) && !quoted) { cur = ''; has = false; } else push();
      let op = '>';
      if (seg[i + 1] === '>') { op = '>>'; i++; }
      if (seg[i + 1] === '&') {
        i++;
        while (/\d/.test(seg[i + 1] || '')) i++;
        continue;
      }
      out.push({ op });
      continue;
    }
    cur += ch;
    has = true;
  }
  push();
  return out;
}

// PowerShell variables are case-insensitive, so keys are lowercase.
function psExpand(s, vars) {
  return String(s)
    .replace(/\$\{([^}]+)\}|\$(env:[A-Za-z_][A-Za-z0-9_]*|[A-Za-z_][A-Za-z0-9_]*)/g, (m, a, b) => {
      const k = (a || b).toLowerCase();
      return Object.prototype.hasOwnProperty.call(vars, k) ? vars[k] : m;
    })
    .replace(/^~(?=[\\/]|$)/, HOME);
}

const PS_WRITE_VERBS = new Set([
  'set-content', 'add-content', 'out-file', 'clear-content', 'copy-item', 'move-item',
  'remove-item', 'rename-item', 'new-item', 'tee-object', 'export-csv', 'export-clixml',
  'sc', 'ac', 'cpi', 'copy', 'cp', 'mi', 'move', 'mv', 'ri', 'rm', 'rmdir', 'del',
  'erase', 'rd', 'rni', 'ren', 'ni', 'tee',
]);
const PS_COPY_VERBS = new Set(['copy-item', 'cpi', 'copy', 'cp']);
const PS_MOVE_VERBS = new Set(['move-item', 'mi', 'move', 'mv']);
const PS_DIR_VERBS = new Set(['remove-item', 'ri', 'rm', 'rmdir', 'del', 'erase', 'rd', 'move-item', 'mi', 'move', 'mv', 'rename-item', 'rni', 'ren']);
// Parameters that take a value, so the value is not read as a positional path.
const PS_VALUE_PARAMS = new Set([
  'path', 'literalpath', 'lp', 'pspath', 'filepath', 'destination', 'value', 'encoding',
  'pattern', 'itemtype', 'type', 'name', 'newname', 'include', 'exclude', 'filter',
  'delimiter', 'inputobject', 'stream', 'width', 'credential',
]);
const PS_PATH_PARAMS = ['path', 'literalpath', 'lp', 'pspath', 'filepath', 'destination', 'newname'];
const PS_DOTNET_WRITE = /\[(System\.)?IO\.(File|Directory)\]::(Write|Append|Copy|Move|Delete|Replace|Create)/i;

function powershellHits(cmd, cwd) {
  const vars = { home: HOME, 'env:userprofile': HOME, 'env:home': HOME };
  const hits = [];
  for (const seg of psSegments(cmd)) {
    const toks = psTokenize(seg);
    const words = toks.filter((x) => !x.op);

    // $name = 'value' (or $name='value') sets a variable later statements read.
    if (words.length) {
      // A glued word is an assignment even when its value was quoted ($d=".claude").
      const glued = /^\$([A-Za-z_][A-Za-z0-9_]*)=(.+)$/.exec(words[0].t);
      if (glued) { vars[glued[1].toLowerCase()] = psExpand(glued[2], vars); continue; }
      if (!words[0].quoted && /^\$[A-Za-z_][A-Za-z0-9_]*$/.test(words[0].t) && words[1] && !words[1].quoted && words[1].t === '=' && words[2]) {
        vars[words[0].t.slice(1).toLowerCase()] = psExpand(words[2].t, vars);
        continue;
      }
    }

    const targets = [];
    const add = (p, via) => { if (p) targets.push({ p, via }); };
    for (let i = 0; i < toks.length; i++) {
      if (toks[i].op && toks[i + 1] && !toks[i + 1].op) add(toks[i + 1].t, toks[i].op);
    }

    let k = 0;
    while (k < words.length && !words[k].quoted && /^[&.]$/.test(words[k].t)) k++;
    const verb = words[k] && !words[k].quoted ? words[k].t.replace(/^.*[\\/]/, '').replace(/\.exe$/i, '').toLowerCase() : '';
    const rest = words.slice(k + 1);
    const positional = [];
    const named = {};
    for (let i = 0; i < rest.length; i++) {
      const w = rest[i];
      if (!w.quoted && /^-[A-Za-z]/.test(w.t)) {
        const m = /^-([A-Za-z]+):(.+)$/.exec(w.t);
        if (m) { named[m[1].toLowerCase()] = m[2]; continue; }
        const name = w.t.slice(1).toLowerCase();
        if (PS_VALUE_PARAMS.has(name) && rest[i + 1]) { named[name] = rest[i + 1].t; i++; }
        continue;
      }
      positional.push(w.t);
    }

    if (PS_COPY_VERBS.has(verb) || PS_MOVE_VERBS.has(verb)) {
      const sources = [named.path, named.literalpath].filter(Boolean).concat(named.destination ? positional : positional.slice(0, -1));
      const dest = named.destination || (positional.length >= ((named.path || named.literalpath) ? 1 : 2) ? positional[positional.length - 1] : null);
      if (PS_MOVE_VERBS.has(verb)) sources.forEach((s) => add(s, verb));
      if (dest) {
        add(dest, verb);
        const d = resolveFrom(cwd, psExpand(dest, vars)).replace(/\/+$/, '');
        if (LANDING_DIRS.some((re) => re.test(d))) add(dest, `${verb} into a trust-anchor directory`);
        sources.forEach((s) => add(`${norm(dest).replace(/\/+$/, '')}/${norm(s).replace(/\/+$/, '').replace(/^.*\//, '')}`, verb));
      }
    } else if (PS_WRITE_VERBS.has(verb)) {
      PS_PATH_PARAMS.forEach((p) => add(named[p], verb));
      positional.forEach((p) => add(p, verb));
    } else if (verb === 'git') {
      let r = rest.map((w) => w.t);
      while (r.length && /^(-C|-c|--git-dir|--work-tree)$/.test(r[0])) r = r.slice(2);
      if (/^(mv|rm|checkout|restore)$/.test(r[0] || '')) r.slice(1).filter((a) => a !== '--' && !a.startsWith('-')).forEach((p) => add(p, `git ${r[0]}`));
    } else if ((verb === 'sed' && rest.some((w) => /^-[A-Za-z]*i/.test(w.t))) || (verb === 'perl' && rest.some((w) => /^-(?!M)[A-Za-z0-9]*i/.test(w.t)))) {
      positional.forEach((p) => add(p, `${verb} -i`));
    }

    if (PS_DOTNET_WRITE.test(seg)) words.filter((w) => w.quoted).forEach((w) => add(w.t, '.NET write'));
    const expandedSeg = psExpand(seg, vars);
    if (INTERPRETER_WRITE.test(expandedSeg)) quotedRuns(expandedSeg).forEach((p) => add(p, 'interpreter write'));

    for (const { p, via } of targets) {
      const x = psExpand(p, vars);
      if (!x || /^\$/.test(x)) continue;
      const resolved = resolveFrom(cwd, x);
      const isDirHit = /trust-anchor directory/.test(via)
        || (PS_DIR_VERBS.has(via) && GUARDED_DIRS.some((re) => re.test(resolved.replace(/\/+$/, ''))));
      if (isDirHit || isGuarded(resolved)) hits.push({ path: resolved, via });
    }
  }
  return hits;
}
