// outward-gate.mjs
// The Outward Gate. An act that leaves your vault (a post, a send, a deploy, a change
// on a connected service) asks the Sovereign first, on the two surfaces no other hook
// covers: connected-service tools (mcp__*) and the shell scripts that reach outside.
//
// Why it exists: the MCP servers this template recommends (.mcp.json.example, the
// Obsidian MCP Bridge path) are reachable by tool calls no PreToolUse matcher
// watched. A sentence in a prompt is a request. This hook is a wall.
//
// Pattern from Vektoris-AI/company-brain-starter finance-gate.py (MIT): "A sentence
// in a prompt is a request. This hook is a wall." Consent marker from
// Nocode-Cyclope/dual-brain wiki_ask_guard.py (MIT): consent is recorded only after
// the call actually ran, so a denied call can never set it.
//
// Consent is once per service per session. The first outward act on a service asks;
// later acts on that service in the same session pass, deploys and deletes included.
//
// PreToolUse
//   mcp__<server>__<tool>  The tool's leading verb decides. A read verb passes in
//                          silence, which leaves the normal permission flow in place.
//                          A server listed in openServers passes whole. Anything
//                          else, an unknown server or verb included, is outward.
//   Bash, PowerShell       Outward when the command runs a script named in
//                          outwardScripts, unless it carries --dry-run.
//   Outward with no consent for its service this session: print permissionDecision
//   "ask". Per the hooks reference, an ask forces a prompt in auto mode too.
// PostToolUse
//   The call ran, so the Sovereign said yes (or no prompt was needed). Record the
//   service in .runtime/outward-consent/<session>.json.
//
// CONFIGURATION. Both lists default empty. To use them, copy
// outward-gate.config.example.json to outward-gate.config.json beside this file and
// edit it. Shape:
//   { "openServers": ["my-local-server"],
//     "outwardScripts": { "send-newsletter": "resend" } }
// openServers: MCP server names that pass whole (servers that never leave your
// machine). outwardScripts: script basename (no .mjs) mapped to the service it reaches.
// A missing config file means the defaults (nothing open, no scripts named). A config
// that exists but does not parse, or has the wrong shape, FAILS CLOSED: exit 2 with the
// reason on stderr. A broken config silently reverting to an empty script list would
// open the gate on every named script, so the call is held until the file is repaired.
// Write and Edit are never matched, so the repair is always possible. The
// OUTWARD_GATE_CONFIG environment variable points the gate at a config elsewhere
// (the self-test uses it).
//
// FAILS CLOSED. A payload that is not a JSON object, or any exception, exits 2,
// which blocks the call with the reason on stderr. The registration also carries
// onFailure "block". Write and Edit are never matched, so a broken gate always
// leaves a door to repair it.
//
// What this does not cover: a script outside outwardScripts passes. The list is the
// gate's scope, and hooks-selftest pins its behavior.
//
// Proven by: hooks-selftest.mjs (outward-gate cases). Run it after ANY edit here.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, rmSync, appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const VAULT = (process.env.SOVEREIGN_VAULT_ROOT || process.cwd()).replace(/\\/g, '/').replace(/\/+$/, '');
const CONSENT_DIR = join(VAULT, '.runtime', 'outward-consent');
const LOG = join(VAULT, '.runtime', 'outward-gate.log');
const CONFIG = process.env.OUTWARD_GATE_CONFIG || join(HERE, 'outward-gate.config.json');
const PRUNE_MS = 7 * 86400000;

const READ_VERBS = new Set(['get', 'list', 'search', 'read', 'query', 'count', 'aggregate', 'introspect', 'filter']);

// Throws on a config that exists but is unusable; the caller turns that into exit 2.
function loadConfig() {
  const empty = { openServers: new Set(), outwardScripts: {} };
  if (!existsSync(CONFIG)) return empty;
  let j;
  try { j = JSON.parse(readFileSync(CONFIG, 'utf8')); } catch (e) { throw new Error(`config ${CONFIG} does not parse (${e.message})`); }
  if (!j || typeof j !== 'object' || Array.isArray(j)) throw new Error(`config ${CONFIG} is not a JSON object`);
  const open = j.openServers === undefined ? [] : j.openServers;
  const scripts = j.outwardScripts === undefined ? {} : j.outwardScripts;
  if (!Array.isArray(open) || !open.every((s) => typeof s === 'string')) throw new Error(`config ${CONFIG}: openServers must be an array of strings`);
  if (!scripts || typeof scripts !== 'object' || Array.isArray(scripts) || !Object.values(scripts).every((s) => typeof s === 'string')) {
    throw new Error(`config ${CONFIG}: outwardScripts must be an object mapping script name to service name`);
  }
  return { openServers: new Set(open), outwardScripts: scripts };
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function classify(payload, cfg) {
  const tool = String(payload.tool_name || '');
  const m = tool.match(/^mcp__(.+?)__(.+)$/);
  if (m) {
    const [, server, name] = m;
    if (cfg.openServers.has(server)) return null;
    const verb = name.split(/[_-]/)[0].toLowerCase();
    if (READ_VERBS.has(verb)) return null;
    return { service: server, act: name };
  }
  if (tool === 'Bash' || tool === 'PowerShell') {
    const cmd = String((payload.tool_input || {}).command || '');
    if (/--dry-run\b/.test(cmd)) return null;
    for (const [script, service] of Object.entries(cfg.outwardScripts)) {
      if (new RegExp(`(^|[\\\\/\\s"'])${escapeRe(script)}\\.mjs\\b`).test(cmd)) return { service, act: `${script}.mjs` };
    }
  }
  return null;
}

function safeSession(id) { return String(id || 'no-session').replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 80); }

function consentFile(session) { return join(CONSENT_DIR, `${safeSession(session)}.json`); }

function readConsent(session) {
  const f = consentFile(session);
  if (!existsSync(f)) return [];
  try { const j = JSON.parse(readFileSync(f, 'utf8')); return Array.isArray(j.services) ? j.services : []; } catch { return []; }
}

function log(line) {
  try {
    mkdirSync(dirname(LOG), { recursive: true });
    appendFileSync(LOG, `[${new Date().toISOString()}] ${line}\n`, 'utf8');
  } catch { /* the decision stands without its log line */ }
}

function prune() {
  if (!existsSync(CONSENT_DIR)) return;
  const now = Date.now();
  for (const n of readdirSync(CONSENT_DIR)) {
    const p = join(CONSENT_DIR, n);
    try { if (now - statSync(p).mtimeMs > PRUNE_MS) rmSync(p, { force: true }); } catch { /* next run tries again */ }
  }
}

function run(payload) {
  const event = payload.hook_event_name;
  const hit = classify(payload, loadConfig());
  if (!hit) return;
  const session = payload.session_id;

  if (event === 'PostToolUse') {
    const services = readConsent(session);
    if (!services.includes(hit.service)) {
      mkdirSync(CONSENT_DIR, { recursive: true });
      writeFileSync(consentFile(session), JSON.stringify({ services: [...services, hit.service] }, null, 2) + '\n', 'utf8');
      log(`consent ${safeSession(session)} ${hit.service} (${hit.act})`);
    }
    prune();
    return;
  }

  if (readConsent(session).includes(hit.service)) return;
  log(`ask ${safeSession(session)} ${hit.service} (${hit.act})`);
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason: `Outward Gate: outward act on ${hit.service} (${hit.act}). The Sovereign's yes covers ${hit.service} for the rest of this session.`,
    },
  }));
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  let j;
  try { j = JSON.parse(raw); } catch { j = undefined; }
  if (!j || typeof j !== 'object' || Array.isArray(j)) {
    process.stderr.write('outward-gate: the hook payload is not a JSON object, so the call is held (fails closed).\n');
    process.exit(2);
  }
  try {
    run(j);
  } catch (e) {
    process.stderr.write(`outward-gate: ${(e && e.message) || e}. The call is held (fails closed).\n`);
    process.exit(2);
  }
});
