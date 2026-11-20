#!/usr/bin/env node
/**
 * client-material-guard.mjs
 *
 * Refuses to let partner and client material reach an outside model. Two checks,
 * both before any network send:
 *   - assertNotClientPath(path): refuses any file under `Collaborations/` (the
 *     canonical container for partner material, one folder per partner) and
 *     under any prefix you add in client-material.config.json.
 *   - assertNoClientNames(text): refuses text carrying a partner's full name.
 *     Names are the folders directly under `Collaborations/` whose name holds a
 *     space (a full name; single words are skipped as too common), read at call
 *     time, so a new partner is covered the day their folder exists. Names you
 *     list in client-material.config.json are added and matched as written.
 *
 * Optional config: Council Chamber/scripts/client-material.config.json
 *   { "blockedPrefixes": ["Clients/"], "names": ["Jane Example"] }
 * Both arrays ADD to the defaults and never remove one. A config that does not
 * parse or has the wrong shape REFUSES (throws) rather than falling back: a
 * broken config never reads as no rule. No config file means defaults only.
 *
 * Vault root: SOVEREIGN_VAULT_ROOT, else two folders above this script.
 *
 * Callers: external-worker.mjs. Any script that sends text to an outside model
 * should call both checks first.
 *
 * There is no override flag. The rule has no exceptions to grant.
 *
 * Known limit: text about a partner with no full name in it passes. The guard
 * catches the plain case; your own judgment governs the rest.
 *
 * Test hook: CLIENT_GUARD_EXTRA_NAMES (comma-separated) adds names for a test's
 * planted partner. It can only add refusals, never remove one.
 *
 * Proof it refuses: node "Council Chamber/scripts/client-material-guard-selftest.mjs"
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'path';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

// Read at call time so a test can point the guard at a fixture vault.
export function getVaultRoot() {
  return process.env.SOVEREIGN_VAULT_ROOT || resolve(SCRIPT_DIR, '..', '..');
}

export const DEFAULT_BLOCKED_PREFIXES = ['Collaborations/'];
const COLLABORATIONS_FOLDER = 'Collaborations';
const CONFIG_REL = ['Council Chamber', 'scripts', 'client-material.config.json'];

export class ClientMaterialError extends Error {
  constructor(detail) {
    super(detail);
    this.name = 'ClientMaterialError';
    // Own enumerable fields, so a JSON-serialized error still carries the reason.
    this.code = 'CLIENT_MATERIAL';
    this.detail = detail;
  }
}

const RULE_NOTE = 'Partner and client material does not go to an outside model. Set by client-material.config.json and the Collaborations folder.';

function normalizePrefix(prefix) {
  let p = String(prefix).trim().replace(/\\/g, '/').replace(/^\.\//, '');
  if (!p.endsWith('/')) p += '/';
  return p;
}

function checkStringArray(value, key, configPath) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((v) => typeof v !== 'string' || v.trim() === '')) {
    throw new ClientMaterialError(`Refused: ${configPath} has the wrong shape. "${key}" must be an array of non-empty strings. ${RULE_NOTE}`);
  }
  return value;
}

// Returns { blockedPrefixes: [], names: [] } from the optional user config.
// Throws ClientMaterialError when the file exists but cannot be trusted.
export function readConfig() {
  const configPath = join(getVaultRoot(), ...CONFIG_REL);
  if (!existsSync(configPath)) return { blockedPrefixes: [], names: [] };
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(configPath, 'utf8').replace(/^﻿/, ''));
  } catch {
    throw new ClientMaterialError(`Refused: ${configPath} could not be read as JSON. Fix or remove it. ${RULE_NOTE}`);
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new ClientMaterialError(`Refused: ${configPath} has the wrong shape. It must be a JSON object. ${RULE_NOTE}`);
  }
  return {
    blockedPrefixes: checkStringArray(parsed.blockedPrefixes, 'blockedPrefixes', configPath),
    names: checkStringArray(parsed.names, 'names', configPath),
  };
}

// The rules in force right now: defaults plus the config, with folder names
// read from disk. Called per check, never cached.
export function loadRules() {
  const config = readConfig();
  let folderNames = [];
  try {
    folderNames = readdirSync(join(getVaultRoot(), COLLABORATIONS_FOLDER), { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'))
      .map((d) => d.name)
      .filter((n) => n.trim().includes(' '));
  } catch {
    // No Collaborations folder yet means no folder-derived names. The config was already validated above.
    folderNames = [];
  }
  return {
    blockedPrefixes: [...DEFAULT_BLOCKED_PREFIXES, ...config.blockedPrefixes].map(normalizePrefix),
    clientNames: [...folderNames, ...config.names],
  };
}

function resolveRules(rules) {
  return rules || loadRules();
}

export function clientNames(rules) {
  const r = resolveRules(rules);
  const extra = (process.env.CLIENT_GUARD_EXTRA_NAMES || '').split(',').map((s) => s.trim()).filter(Boolean);
  return [...(r.clientNames || []), ...extra];
}

function toVaultRelative(p) {
  const root = getVaultRoot();
  const abs = resolve(root, p);
  return relative(root, abs).split(sep).join('/');
}

export function isClientPath(p, rules) {
  const r = resolveRules(rules);
  const rel = toVaultRelative(p).toLowerCase();
  // Outside the vault: a parent step, or another drive on Windows.
  if (rel === '..' || rel.startsWith('../') || isAbsolute(rel) || /^[a-z]:/.test(rel)) return false;
  const probe = `${rel}/`;
  return (r.blockedPrefixes || []).some((prefix) => probe.startsWith(normalizePrefix(prefix).toLowerCase()));
}

export function findClientNames(text, rules) {
  if (!text) return [];
  const haystack = String(text).toLowerCase().replace(/\s+/g, ' ');
  return clientNames(rules).filter((name) => haystack.includes(name.toLowerCase().trim().replace(/\s+/g, ' ')));
}

export function assertNotClientPath(p, rules) {
  if (p && isClientPath(p, rules)) {
    throw new ClientMaterialError(`Refused: ${toVaultRelative(p)} sits in a protected folder. ${RULE_NOTE}`);
  }
}

export function assertNoClientNames(text, rules) {
  const hits = findClientNames(text, rules);
  if (hits.length > 0) {
    throw new ClientMaterialError(`Refused: the text names a protected partner or client (${hits.length} match${hits.length > 1 ? 'es' : ''}). ${RULE_NOTE}`);
  }
}
