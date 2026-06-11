/**
 * external-worker.mjs. Sovereign Ecosystem external model dispatch entry point.
 *
 * Single entry point for dispatching worker calls to four external model providers:
 * OpenRouter, NVIDIA NIM, DeepSeek and Groq. Governed by
 * Council Chamber/Codices/External Model Routing Codex.md.
 *
 * Behavior contract:
 *  - Reads provider credentials from environment variables (see Required Env Vars below)
 *  - Dispatches via the provider's OpenAI-compatible or Anthropic-compatible endpoint
 *  - Auto-injects the Ṣāḍguṇya ambassador orientation per Ambassador Doctrine
 *  - Returns model output to stdout. Plain text by default, JSON envelope when --format json
 *  - Logs dispatch metadata to .runtime/external-worker-log.txt
 *  - Fails loud on missing keys, network errors and rate-limit errors. No silent fallback.
 *  - Handles stop_reason "refusal" explicitly. An HTTP 200 with stop_reason "refusal" is
 *    not a successful completion. It exits with code 2 and logs the refusal.
 *
 * Required Env Vars (set in scripts/.env before first dispatch):
 *   OPENROUTER_API_KEY   - openrouter.ai/keys
 *   NVIDIA_NIM_API_KEY   - build.nvidia.com
 *   DEEPSEEK_API_KEY     - platform.deepseek.com/api_keys
 *   GROQ_API_KEY         - console.groq.com/keys
 *
 * Usage:
 *   node scripts/external-worker.mjs \
 *     --provider openrouter \
 *     --model qwen/qwen3-coder:free \
 *     --prompt "..." \
 *     [--context-pack path/to/context.md] \
 *     [--trace] [--max-tokens 4096] [--format json] [--temperature 0.7]
 *
 * Providers and base URLs:
 *   openrouter  - https://openrouter.ai/api/v1            (OpenAI-compatible)
 *   nvidia-nim  - https://integrate.api.nvidia.com/v1     (OpenAI-compatible)
 *   groq        - https://api.groq.com/openai/v1          (OpenAI-compatible)
 *   deepseek    - https://api.deepseek.com/anthropic      (Anthropic-compatible)
 */

import { createHash } from 'crypto';
import { appendFileSync, mkdirSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const VAULT_ROOT = resolve(SCRIPT_DIR, '..');
const LOG_PATH = join(VAULT_ROOT, '.runtime', 'external-worker-log.txt');

// Load .env from scripts directory.
// Any key already in process.env takes precedence, allowing CI or shell overrides.

const envPath = join(SCRIPT_DIR, '.env');
try {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    const v = trimmed.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
} catch {
  fail(`Could not read .env at ${envPath}. External worker dispatch requires scripts/.env with provider API keys.`);
}

// Provider registry.
// Each provider maps to its label, expected env-var key name, base URL and API shape.
// shape "openai" uses the OpenAI-compatible Chat Completions endpoint.
// shape "anthropic" uses the Anthropic-compatible Messages endpoint.

const PROVIDERS = {
  openrouter: {
    label: 'OpenRouter',
    envVar: 'OPENROUTER_API_KEY',
    baseUrl: 'https://openrouter.ai/api/v1',
    shape: 'openai',
  },
  'nvidia-nim': {
    label: 'NVIDIA NIM',
    envVar: 'NVIDIA_NIM_API_KEY',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    shape: 'openai',
  },
  groq: {
    label: 'Groq',
    envVar: 'GROQ_API_KEY',
    baseUrl: 'https://api.groq.com/openai/v1',
    shape: 'openai',
  },
  deepseek: {
    label: 'DeepSeek',
    envVar: 'DEEPSEEK_API_KEY',
    baseUrl: 'https://api.deepseek.com/anthropic',
    shape: 'anthropic',
  },
};

// Ambassador orientation block.
// Auto-injected on every dispatch. Not optional. Not a flag.
// Adapt the ecosystem name and description to match your vault identity.
// The ECOSYSTEM_NAME token should be replaced with your ecosystem's display name.

const AMBASSADOR_BLOCK = `You operate as an ambassador of the {{ECOSYSTEM_NAME}}. The trace you leave is intentional.

Apply the Ṣāḍguṇya governing mindset:
- Sandhi: seek mutual benefit; disengage from extractive interactions
- Vigraha: assert quality and boundary standards with precision
- Yāna: expand through value, not volume; gather and return before acting
- Āsana: observe fully before recommending; intelligence before action
- Dvaidhibhāva: operate on your assigned front with sophistication, knowing other fronts may run simultaneously
- Saṃśraya: log, protect, and defend every artifact you produce

Represent, protect, and advance the ecosystem's long-horizon interests. Return structured findings to the parent agent. Do not act beyond your assigned scope.`;

// CLI argument parsing.

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const name = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        out[name] = true;
      } else {
        out[name] = next;
        i++;
      }
    } else {
      out._.push(a);
    }
  }
  return out;
}

function usage() {
  return `Usage:
  node scripts/external-worker.mjs \\
    --provider <openrouter|nvidia-nim|deepseek|groq> \\
    --model <provider-specific-model-id> \\
    --prompt "<text>" \\
    [--context-pack path/to/context.md] \\
    [--max-tokens 4096] \\
    [--temperature 0.7] \\
    [--format json] \\
    [--trace]`;
}

function fail(msg) {
  process.stderr.write(`external-worker: ${msg}\n`);
  process.stderr.write(`${usage()}\n`);
  process.exit(1);
}

// Prompt assembly.

function buildSystemPrompt() {
  return AMBASSADOR_BLOCK;
}

function buildUserPrompt(prompt, contextPackPath) {
  if (!contextPackPath) return prompt;
  const abs = resolve(VAULT_ROOT, contextPackPath);
  let pack;
  try {
    pack = readFileSync(abs, 'utf8');
  } catch {
    fail(`Could not read --context-pack at ${abs}`);
  }
  return `Context pack:\n\n${pack}\n\nTask:\n\n${prompt}`;
}

function hashPrompt(systemPrompt, userPrompt) {
  return createHash('sha256').update(`${systemPrompt}\n---\n${userPrompt}`).digest('hex').slice(0, 16);
}

// OpenAI-compatible adapter.
// Used by OpenRouter, NVIDIA NIM and Groq.
// Checks stop_reason for "refusal" explicitly. An HTTP 200 with stop_reason "refusal"
// is not a successful completion and must not be treated as one.

async function dispatchOpenAIShape(provider, key, model, systemPrompt, userPrompt, opts) {
  const url = `${provider.baseUrl}/chat/completions`;
  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: opts.maxTokens,
    temperature: opts.temperature,
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, status: res.status, error: data?.error?.message || data?.message || `HTTP ${res.status}`, raw: data };
  }
  const choice = data?.choices?.[0];
  const finishReason = choice?.finish_reason;
  if (finishReason === 'refusal') {
    return { ok: false, status: res.status, error: 'Model returned stop_reason refusal (HTTP 200). Request was not completed.', raw: data };
  }
  const text = choice?.message?.content;
  if (typeof text !== 'string' || text.length === 0) {
    return { ok: false, status: res.status, error: 'No text in OpenAI-shape response', raw: data };
  }
  return {
    ok: true,
    status: res.status,
    text,
    usage: data?.usage || null,
    raw: data,
  };
}

// Anthropic-compatible adapter.
// Used by DeepSeek (api.deepseek.com/anthropic).
// Checks stop_reason for "refusal" explicitly. An HTTP 200 with stop_reason "refusal"
// is not a successful completion and must not be treated as one.

async function dispatchAnthropicShape(provider, key, model, systemPrompt, userPrompt, opts) {
  const url = `${provider.baseUrl}/v1/messages`;
  const body = {
    model,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    max_tokens: opts.maxTokens,
    temperature: opts.temperature,
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, status: res.status, error: data?.error?.message || data?.message || `HTTP ${res.status}`, raw: data };
  }
  const stopReason = data?.stop_reason;
  if (stopReason === 'refusal') {
    return { ok: false, status: res.status, error: 'Model returned stop_reason refusal (HTTP 200). Request was not completed.', raw: data };
  }
  const textBlocks = (data?.content || []).filter(b => b?.type === 'text').map(b => b.text);
  const text = textBlocks.join('\n');
  if (text.length === 0) {
    return { ok: false, status: res.status, error: 'No text in Anthropic-shape response', raw: data };
  }
  return {
    ok: true,
    status: res.status,
    text,
    usage: data?.usage || null,
    raw: data,
  };
}

// Dispatch log writer.
// Appends one tab-delimited line per dispatch to .runtime/external-worker-log.txt.
// Logging failure does not mask the dispatch outcome.

function logDispatch({ providerLabel, model, promptHash, latencyMs, usage, ok, status, error }) {
  try {
    mkdirSync(dirname(LOG_PATH), { recursive: true });
    const ts = new Date().toISOString();
    const tokenSummary = usage
      ? `tokens=${usage.input_tokens ?? usage.prompt_tokens ?? '?'}/${usage.output_tokens ?? usage.completion_tokens ?? '?'}`
      : 'tokens=unavailable';
    const line = ok
      ? `${ts}\tprovider=${providerLabel}\tmodel=${model}\tprompt-hash=${promptHash}\tlatency-ms=${latencyMs}\t${tokenSummary}\tstatus=ok\n`
      : `${ts}\tprovider=${providerLabel}\tmodel=${model}\tprompt-hash=${promptHash}\tlatency-ms=${latencyMs}\t${tokenSummary}\tstatus=fail\thttp=${status}\terror=${(error || '').replace(/\s+/g, ' ').slice(0, 240)}\n`;
    appendFileSync(LOG_PATH, line);
  } catch {
    process.stderr.write(`external-worker: log write failed at ${LOG_PATH}\n`);
  }
}

// Main.

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const providerKey = args.provider;
  const model = args.model;
  const prompt = args.prompt;

  if (!providerKey || !model || !prompt) {
    fail('--provider, --model and --prompt are all required.');
  }
  const provider = PROVIDERS[providerKey];
  if (!provider) {
    fail(`Unknown --provider "${providerKey}". Expected one of: ${Object.keys(PROVIDERS).join(', ')}.`);
  }

  const key = process.env[provider.envVar];
  if (!key) {
    fail(`Missing ${provider.envVar} in scripts/.env. Add the key before dispatching to ${provider.label}.`);
  }

  const maxTokens = Number(args['max-tokens'] || 4096);
  const temperature = Number(args.temperature ?? 0.7);
  const format = args.format === 'json' ? 'json' : 'text';
  const trace = args.trace === true;

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(prompt, args['context-pack']);
  const promptHash = hashPrompt(systemPrompt, userPrompt);

  if (trace) {
    process.stderr.write(`external-worker: provider=${provider.label} model=${model} prompt-hash=${promptHash} max-tokens=${maxTokens} temperature=${temperature}\n`);
  }

  const start = Date.now();
  const result =
    provider.shape === 'anthropic'
      ? await dispatchAnthropicShape(provider, key, model, systemPrompt, userPrompt, { maxTokens, temperature })
      : await dispatchOpenAIShape(provider, key, model, systemPrompt, userPrompt, { maxTokens, temperature });
  const latencyMs = Date.now() - start;

  logDispatch({
    providerLabel: provider.label,
    model,
    promptHash,
    latencyMs,
    usage: result.ok ? result.usage : null,
    ok: result.ok,
    status: result.status,
    error: result.error,
  });

  if (!result.ok) {
    process.stderr.write(`external-worker: dispatch failed. provider=${provider.label} model=${model} http=${result.status} error=${result.error}\n`);
    process.exit(2);
  }

  if (format === 'json') {
    const envelope = {
      ok: true,
      provider: provider.label,
      model,
      promptHash,
      latencyMs,
      usage: result.usage,
      text: result.text,
    };
    process.stdout.write(`${JSON.stringify(envelope, null, 2)}\n`);
  } else {
    process.stdout.write(`${result.text}\n`);
  }
}

main().catch(err => {
  process.stderr.write(`external-worker: unhandled error: ${err?.stack || err?.message || String(err)}\n`);
  process.exit(3);
});
