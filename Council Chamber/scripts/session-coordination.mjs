#!/usr/bin/env node
// session-coordination.mjs
// Lightweight cross-session coordination for the Sovereign Ecosystem vault.
//
// A vault with no server-side conflict detection (no shared origin, or an
// origin that only one session pushes to at a time) has no built-in way to
// know a sibling session is also active. When two AI-interface sessions run
// concurrently (often offset in time rather than truly simultaneous), each
// one's session-start read freezes the state it saw, and a naive closeout can
// sweep the sibling's uncommitted work into a misleading commit.
//
// This file is an ADVISORY, not a lock. It warns a session when a sibling is
// active so closeouts stage only their own files. A single-operator vault
// does not need pessimistic locking. A millisecond-simultaneous register race
// is accepted and harmless: sessions here are offset in time, not truly
// simultaneous.
//
// Subcommands:
//   register --id <sid> [--intent "..."]   Mark this session active. Prints a warning if siblings are active.
//   check                                  Print active sessions (used at session start).
//   close --id <sid> [--head <sha>]        Mark this session closed and record final HEAD.
//   cleanup                                Prune stale and old-closed entries.
//
// Vault root resolution: SOVEREIGN_VAULT_ROOT env var if set, otherwise the
// parent of this script's directory (scripts live in <vault>/scripts/).
//
// State file: .runtime/active-sessions.json (array of session objects).
// Staleness: an 'active' entry older than ACTIVE_TTL_HOURS is treated as a
// crashed session and pruned (the closing hook, if any, never fired). Closed
// entries older than CLOSED_TTL_HOURS are pruned. Both are time-based, since
// hook PIDs do not match the session process and cannot be liveness-checked
// reliably.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const VAULT_ROOT = process.env.SOVEREIGN_VAULT_ROOT || resolve(SCRIPT_DIR, '..');

const RUNTIME_DIR = join(VAULT_ROOT, '.runtime');
const STATE_FILE = join(RUNTIME_DIR, 'active-sessions.json');
const ACTIVE_TTL_HOURS = 12;
const CLOSED_TTL_HOURS = 24;

const nowDate = () => new Date();
const iso = (d = nowDate()) => d.toISOString();

function hoursSince(ts) {
  const t = Date.parse(ts);
  if (Number.isNaN(t)) return Infinity;
  return (nowDate().getTime() - t) / 3600000;
}

function gitHead() {
  try {
    return execSync(`git -C "${VAULT_ROOT}" rev-parse --short HEAD`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

function load() {
  try {
    if (!existsSync(STATE_FILE)) return [];
    const raw = readFileSync(STATE_FILE, 'utf8').trim();
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function prune(list) {
  return list.filter((s) => {
    if (!s || !s.started_at) return false;
    if (s.status === 'closed') return hoursSince(s.closed_at || s.started_at) < CLOSED_TTL_HOURS;
    return hoursSince(s.started_at) < ACTIVE_TTL_HOURS;
  });
}

function save(list) {
  try {
    mkdirSync(RUNTIME_DIR, { recursive: true });
    writeFileSync(STATE_FILE, JSON.stringify(list, null, 2) + '\n', 'utf8');
  } catch {
    /* best-effort, never blocking */
  }
}

function parseArgs() {
  const a = {};
  const argv = process.argv.slice(3);
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].slice(2);
    const next = argv[i + 1];
    a[key] = next && !next.startsWith('--') ? argv[++i] : 'true';
  }
  return a;
}

const cmd = process.argv[2];
const a = parseArgs();
let list = prune(load());

const formatList = (entries) =>
  entries
    .map((s) => `  - ${s.id} since ${s.started_at}${s.intent ? ` (${s.intent})` : ''}`)
    .join('\n');

if (cmd === 'register') {
  const id = a.id || `anon-${iso().replace(/[:.]/g, '')}-${process.pid}`;
  const others = list.filter((s) => s.status === 'active' && s.id !== id);
  list = list.filter((s) => s.id !== id);
  list.push({
    id,
    intent: a.intent === 'true' ? '' : a.intent || '',
    // Session id from a hook or wrapper, if the interface provides one. A
    // closing hook that cannot reconstruct the register-time id can close by
    // this key instead.
    session: a.session && a.session !== 'true' ? a.session : '',
    started_at: iso(),
    head_at_start: gitHead(),
    status: 'active',
  });
  save(list);
  if (others.length > 0) {
    process.stdout.write(
      `Concurrent sessions: ${others.length} other session(s) active.\n${formatList(others)}\n` +
        `Run a git log check before vault writes. At closeout, stage only this session's files.\n`
    );
  }
  process.exit(0);
}

if (cmd === 'check') {
  const active = list.filter((s) => s.status === 'active');
  if (active.length > 0) {
    process.stdout.write(`Active sessions (${active.length}):\n${formatList(active)}\n`);
  }
  process.exit(0);
}

if (cmd === 'close') {
  const id = a.id;
  const sess = a.session && a.session !== 'true' ? a.session : '';
  for (const s of list) {
    const matchById = id && s.id === id;
    const matchBySession = sess && s.session === sess;
    if ((matchById || matchBySession) && s.status === 'active') {
      s.status = 'closed';
      s.closed_at = iso();
      s.head_at_close = a.head && a.head !== 'true' ? a.head : gitHead();
    }
  }
  save(list);
  process.exit(0);
}

if (cmd === 'cleanup') {
  save(list);
  process.exit(0);
}

process.stderr.write(
  `session-coordination: unknown command "${cmd || ''}". Use register|check|close|cleanup.\n`
);
process.exit(1);
