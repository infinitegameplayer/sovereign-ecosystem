#!/usr/bin/env node
// pre-shell-git-verb-gate.mjs
// The decision logic of pre-shell-git-verb-gate.sh (PreToolUse on Bash and PowerShell).
// Asks before a git command that destroys work, in any spelling of it.
//
// WHY TOKENS. A permission rule matches command text, so an equivalent spelling
// slips past it: `git -C dir branch -D`, `--delete --force`, `-fd`, a `git.exe`
// head, `reset HEAD~1 --hard`. This hook reads the command as tokens, so the
// flag order and the spelling stop mattering. It is the first layer here: the
// settings file ships no ask rule for these verbs.
//
// Asks on, in any repo:
//   git branch -D, or a delete flag with a force flag in any order or form
//   git reset with --hard anywhere
//   git clean with a force flag, unless it is a dry run (-n, --dry-run)
//   git update-ref -d
//   git push with --force, -f, --force-with-lease, --force-if-includes,
//     --delete, -d, --mirror or --prune
//   git push with a refspec starting with + or :
//   git reflog expire, git gc --prune
// Global options before the subcommand are skipped (-C, -c, --git-dir=,
// --no-pager and the rest). bash -c, sh -c and powershell -Command are read
// one level in. Plain pushes, merges and commits pass.
//
// Answers "ask" (hookSpecificOutput, exit 0), which forces a prompt in auto
// mode too. It never denies: these acts are sometimes exactly what is wanted.
//
// FAILS CLOSED. A payload that is not a JSON object, or an error here, exits 1,
// and the wrapper turns that into exit 2, which holds the call. Write and Edit
// are never matched, so a broken gate leaves the door to repair it.
//
// Proven by: hooks-selftest.mjs, the git-verb-gate cases.

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { stripBodies, segments, base } from './pre-bash-git-add-guard.mjs';

const SHELLS = new Set(['bash', 'sh', 'zsh', 'pwsh', 'powershell', 'cmd']);
const VALUE_GLOBALS = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace', '--config-env', '--exec-path']);

// Short flags may be combined (-fd, -xdf); long flags stand alone.
function hasShort(args, ch) {
  return args.some((a) => /^-[a-zA-Z]+$/.test(a) && a.slice(1).includes(ch));
}
const hasLong = (args, ...names) => args.some((a) => names.some((n) => a === n || a.startsWith(`${n}=`)));

// Returns a short description of the destructive act, or null.
function verdictFor(sub, args) {
  const opts = [];
  for (const a of args) { if (a === '--') break; opts.push(a); }
  switch (sub) {
    case 'branch': {
      if (hasShort(opts, 'D')) return 'git branch -D (force-deletes a branch)';
      const del = hasShort(opts, 'd') || hasLong(opts, '--delete');
      const force = hasShort(opts, 'f') || hasLong(opts, '--force');
      if (del && force) return 'git branch delete with force';
      return null;
    }
    case 'reset':
      return hasLong(opts, '--hard') ? 'git reset --hard (discards uncommitted work)' : null;
    case 'clean': {
      const dry = hasShort(opts, 'n') || hasLong(opts, '--dry-run');
      const force = hasShort(opts, 'f') || hasLong(opts, '--force');
      return force && !dry ? 'git clean with force (deletes untracked files)' : null;
    }
    case 'update-ref':
      return hasShort(opts, 'd') ? 'git update-ref -d (deletes a ref)' : null;
    case 'push': {
      if (hasLong(opts, '--force', '--force-with-lease', '--force-if-includes', '--delete', '--mirror', '--prune')) return 'git push that forces, mirrors, prunes or deletes';
      if (hasShort(opts, 'f') || hasShort(opts, 'd')) return 'git push that forces or deletes';
      const refspecs = args.filter((a) => !a.startsWith('-')).slice(1);
      if (refspecs.some((r) => r.startsWith('+') || r.startsWith(':'))) return 'git push with a force (+) or delete (:) refspec';
      return null;
    }
    case 'reflog':
      return args[0] === 'expire' ? 'git reflog expire (drops recovery points)' : null;
    case 'gc':
      return hasLong(opts, '--prune') ? 'git gc --prune (drops unreachable objects)' : null;
    default:
      return null;
  }
}

function check(command, depth = 0) {
  for (const toks of segments(stripBodies(command))) {
    const head = base(toks[0] || '');
    if (SHELLS.has(head) && depth < 2) {
      const k = toks.findIndex((t) => /^(-c|-command|\/c)$/i.test(t));
      if (k > 0 && toks[k + 1]) {
        const r = check(toks.slice(k + 1).join(' '), depth + 1);
        if (r) return r;
      }
      continue;
    }
    if (head !== 'git') continue;
    let i = 1;
    while (i < toks.length && toks[i].startsWith('-')) {
      i += VALUE_GLOBALS.has(toks[i]) && toks[i + 1] !== undefined ? 2 : 1;
    }
    const hit = verdictFor(toks[i], toks.slice(i + 1));
    if (hit) return hit;
  }
  return null;
}

export function review(tool, command) {
  if (tool !== 'Bash' && tool !== 'PowerShell') return null;
  if (typeof command !== 'string' || !command) return null;
  const hit = check(command);
  return hit ? `${hit}. Work it discards may not come back unless a backup or a remote holds it. Confirm this is wanted.` : null;
}

function main() {
  const raw = readFileSync(0, 'utf8');
  const input = JSON.parse(raw || 'null');
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    process.stderr.write('git-verb gate: the payload is not a JSON object.\n');
    process.exit(1);
  }
  const reason = review(input.tool_name, (input.tool_input || {}).command);
  if (!reason) process.exit(0);
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'ask', permissionDecisionReason: `Destructive git command: ${reason}` },
  }));
  process.exit(0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
