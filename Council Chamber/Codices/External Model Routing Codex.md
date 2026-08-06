---
title: External Model Routing Codex
tags:
  - codex
  - external-models
  - routing
  - worker-dispatch
status: template
source_of_truth: self
---

# External Model Routing Codex

Purpose: Define how external AI model providers integrate into worker dispatch. Covers provider account conventions, env-var slots, model offerings, task fit, integration path and verification posture.

Scope. This codex governs dispatch to external model providers used as secondary workers. It is the structural sibling of the primary routing codex (session and primary-provider worker routing). External worker dispatch is additive. Existing primary provider layers are untouched.

This codex is the single source of truth for which external model providers exist in this ecosystem's infrastructure, what they cost, what they can do and which routing slots they fit.

Active providers in scope: OpenRouter, NVIDIA NIM, DeepSeek, Groq. Other providers are considered and deferred. See Providers Considered But Out of Scope.

## Accounts and API Keys

Each provider has its own account, its own key acquisition flow and its own env-var slot in `Council Chamber/scripts/.env`. Account creation happens before dispatch is live. The Sovereign can pause after any provider.

Expected environment variable keys (add to `Council Chamber/scripts/.env` before first dispatch):

```
OPENROUTER_API_KEY=
NVIDIA_NIM_API_KEY=
DEEPSEEK_API_KEY=
GROQ_API_KEY=
```

| Provider | Env Var | Key Acquisition | Account Status |
|---|---|---|---|
| OpenRouter | `OPENROUTER_API_KEY` | openrouter.ai/keys | Unknown. Set at install. |
| NVIDIA NIM | `NVIDIA_NIM_API_KEY` | build.nvidia.com | Unknown. Set at install. |
| DeepSeek | `DEEPSEEK_API_KEY` | platform.deepseek.com/api_keys | Unknown. Set at install. |
| Groq | `GROQ_API_KEY` | console.groq.com/keys | Unknown. Set at install. |

API keys live in `Council Chamber/scripts/.env`. The file is gitignored and never enters version control. Key acquisition produces a single-line confirmation that the key is configured. No model calls happen at the key-acquisition step.

**Payment-method gate.** A provider can issue a working key against a zero-balance account. The key is not a guarantee of functional dispatch. Signup, key acquisition and dispatch are three distinct gates, each with their own payment-method threshold. Paid-tier providers without funded balance cannot enter verification even after key acquisition completes. The first dispatch to a paid provider may return a balance error rather than a model response.

OpenRouter is the broadest single integration. One key unlocks many models at varying free-tier limits. NVIDIA NIM hosts several models on a direct-host free tier. DeepSeek exposes a native Anthropic-compatible Messages API at `api.deepseek.com/anthropic`. DeepSeek is a paid tier but low cost per call. Groq runs open-weight models on LPU hardware via an OpenAI-compatible `/openai/v1` endpoint with very low latency and a free tier, giving the ecosystem a distinct fast-inference tier the other three do not match.

## Model Routing

Provider-to-model recommendations are working hypotheses. Final routing assignments land after verification numbers exist.

| Slot | Primary Provider | Candidate Model | Routing Rationale |
|---|---|---|---|
| Audit sweeps and schema validation | OpenRouter | `qwen/qwen3-coder:free` | Code-focused free model, large context. Pair with fallback due to upstream-host throttling risk. |
| Mechanical synthesis passes | OpenRouter | `nvidia/nemotron-3-super-120b-a12b:free` | General synthesis capability on free tier, large context. |
| Tool-use orchestration tests | NVIDIA NIM | `meta/llama-3.3-70b-instruct` | NIM-hosted with documented tool-use semantics. |
| Long-context bulk classification | NVIDIA NIM | `nvidia/nemotron-3-super-120b-a12b` | Large context window, free tier. |
| Code generation and refactoring | DeepSeek | `deepseek-v4-flash` or `deepseek-v4-pro` | Native Anthropic-compatible endpoint. Paid but low cost. |
| Reasoning-heavy edge cases | DeepSeek | `deepseek-v4-pro` | Strong reasoning trace via thinking mode, paid tier. |
| Fast inference on open-weights models | Groq | `llama-3.3-70b-versatile` | Ultra-low-latency on Meta Llama via LPU hardware. OpenAI-compatible endpoint. |
| Fast reasoning inference | Groq | `openai/gpt-oss-120b` | Open-weights reasoning model at LPU speed. |

Voice-bound and judgment-bound work does not route here. That work stays on the primary provider layer.

## Use Cases

**OpenRouter.** Default entry point for free-tier dispatch. Best for high-volume audit work, schema diff scans, smoke tests against known baselines and repetitive content tagging where the rule is deterministic. Aggregator architecture means two rate limits operate in parallel. An upstream-host capacity limit is independent of the per-key aggregator ceiling. Pair every aggregator-routed slot with a fallback slug on a different upstream host or on a direct-host provider.

**NVIDIA NIM.** Best for tool-use orchestration patterns with documented `/v1/chat/completions` tool-calling support, long-context bulk classification and any task that benefits from Nemotron characteristics. Free tier with quality. Defensive validation on `tool_calls` payloads is required because community reports include intermittent malformed JSON on specific models.

**DeepSeek.** Best for code-focused work where the Anthropic-compatible endpoint shape simplifies dispatch wiring. The paid tier with low per-call cost makes DeepSeek the right call when output quality matters more than free-tier price and rate ceilings. **Risk-scoping guardrail.** DeepSeek is PRC-headquartered and the company suffered a confirmed infrastructure breach in early 2025 that exposed prompt and metadata logs. Treat DeepSeek as an untrusted external worker. Dispatch only non-sensitive batch work. Confidential payloads, regulated personal data and judgment-bound work stay on the primary provider layer. The Anthropic-compatible endpoint omits image, document and search-result content types and ignores some Anthropic beta fields, so DeepSeek dispatch sticks to text, `tool_use` and `tool_result` content.

**Groq.** Best for latency-sensitive worker calls on Meta Llama and open-weight models. The LPU hardware produces inference speeds the other three providers do not match, which makes Groq the right call for short prompts in a tight loop where wall-clock matters more than context window. Structured-output enforcement on Groq is best handled via prompt discipline plus client-side validation rather than JSON Schema reliance.

Cross-provider pattern. Every dispatch carries the Ṣāḍguṇya ambassador orientation per [[Council Chamber/Protocols/Governance/Ambassador Doctrine]]. The script handles orientation injection automatically. The orientation is not optional.

## Worker-Eligible Task Taxonomy

**The split principle.** A class is worker-eligible when its work divides cleanly along the filesystem and network boundary. Gather (walk, grep, fetch, existence-check) stays on the orchestrator because the worker has no disk or network access. Synthesis (group, rank, flag, format) routes to the worker. Verify (spot-check the worker output against the gathered data) returns to the orchestrator. This gather-on-orchestrator, synthesize-on-worker, verify-on-orchestrator pattern is the template for every audit-class assignment.

**Five-condition eligibility test.** Before routing a task class to an external worker, it must satisfy all five:

1. The synthesis is deterministic and no-judgment. The rule is fully specified.
2. The output is bounded. A worker that enumerates a long flat list is unreliable. Judgment over groups is reliable.
3. No disk or network access is required. The orchestrator pre-gathers all inputs.
4. The task is not voice-bound. Voice-adjacent, style-sensitive or personality-dependent work stays on the primary provider.
5. The orchestrator can verify the result without re-doing the synthesis.

**Worker-eligible classes (template slots, populate as verified):**

| Class | Provider | Status |
|---|---|---|
| Cross-reference health (structural scan) | Groq `llama-3.3-70b-versatile` | Template placeholder. Verify before first use. |
| Memory file cross-reference health | Groq `llama-3.3-70b-versatile` | Template placeholder. Verify before first use. |
| Image alt-text gap scan | Groq `llama-3.3-70b-versatile` | Template placeholder. Verify before first use. |

**Assessed and held on the primary provider layer:**

| Class | Why held |
|---|---|
| Completeness verification against codex requirements | Comparison judgment. Holistic-accounting condition is hard to fully specify for a worker. |
| Memory compression candidates | Identifying candidates is judgment about meaning and redundancy. Voice-adjacent, not deterministic synthesis. |
| External link rot | Fetches stay on the orchestrator. Residual synthesis is trivial grouping with little worker value. |

**Primary-provider-bound by category (never worker-eligible).** Voice-bound drafting, concept-page drafting, strategy and judgment work, Sovereign-required harvest work. This boundary is permanent, not a held-pending-maturity classification.

**Enumeration-completeness ceiling.** Groq `llama-3.3-70b-versatile` is reliable for grouping-and-suggesting over a short broken-link set but not for faithfully reproducing a long flat list. A worker given a large enumeration task may truncate output below the token cap. Audit classes whose output is a long enumeration need the threshold and listing done on the orchestrator, with the worker reserved for genuine synthesis judgment.

## Integration Path

Script-based dispatch is the integration mode. The single dispatch entry point is `Council Chamber/scripts/external-worker.mjs`. The script behavior:

- Reads provider credentials from `Council Chamber/scripts/.env`.
- Dispatches via the provider's OpenAI-compatible or Anthropic-compatible endpoint.
- Returns structured output to stdout. Plain text by default. JSON when `--format json`.
- Applies the Ambassador Doctrine sub-agent prompt pattern automatically.
- Logs dispatch metadata to `.runtime/external-worker-log.txt`. Fields: provider, model, prompt-hash, latency, token count if available.
- Fails loud on missing keys or rate-limit errors. No silent fallback.

Invocation shape:

```
node Council Chamber/scripts/external-worker.mjs \
  --provider openrouter \
  --model qwen/qwen3-coder:free \
  --prompt "..." \
  --context-pack path/to/context.md \
  [--trace] [--max-tokens 4096] [--format json]
```

`--provider` accepts `openrouter`, `nvidia-nim`, `deepseek`, `groq`. Each provider adapter reads its key from the matching env var and hits its own base URL. OpenRouter, NVIDIA NIM and Groq use the OpenAI-compatible Chat Completions shape. DeepSeek uses the Anthropic-compatible Messages shape at `api.deepseek.com/anthropic`.

## Model Era Notes

These are integration realities an implementor must handle when calling current frontier model APIs. They are not provider endorsements.

**Refusal as HTTP 200.** Safety classifiers on current frontier models return `stop_reason: "refusal"` with an HTTP 200 status. This is not a network error. A response handler that only checks the HTTP status code will treat a refused request as a successful completion. Check `stop_reason` explicitly and handle `"refusal"` as a distinct non-completion state.

**Thinking depth and the effort parameter.** The newest frontier model tier makes thinking always on. Raw chain-of-thought is not returned in the response. The `thinking` parameter cannot be set to disabled on this tier. Use the `effort` parameter to control thinking depth. Any script that passes `"type": "disabled"` to the `thinking` field will receive an error on these models.

**Fallbacks parameter.** A server-side beta `fallbacks` parameter lets the API retry automatically on another model when a refusal or capacity limit occurs. Client-side SDK middleware handles the same pattern in TypeScript, Python, Go, Java and C#.

**Native memory tool.** The newest model tier supports the `memory tool` as a first-class supported feature. Agent scripts that call the API can include this in their tool list alongside standard tool definitions.

## Available Models

Each provider section holds placeholder structure. Populate after live catalog verification confirms slugs, capability and rate limits.

**OpenRouter verified models:**

| Model | Context Window | Free Tier | Best For | Verified Date |
|---|---|---|---|---|
| Populate after verification | | | | |

**NVIDIA NIM verified models:**

| Model | Context Window | Free Tier | Best For | Verified Date |
|---|---|---|---|---|
| Populate after verification | | | | |

**DeepSeek verified models:**

| Model | Context Window | Free Tier | Best For | Verified Date |
|---|---|---|---|---|
| Populate after verification | | | | |

**Groq verified models:**

| Model | Context Window | Free Tier | Best For | Verified Date |
|---|---|---|---|---|
| Populate after verification | | | | |

**Live catalog check discipline.** Research-consult-derived slugs are more reliable for direct-host providers than for aggregators. Aggregator catalogs change faster than the model identifiers the upstream provider publishes, because aggregators rename and re-slug across many sources. Verify every slug against the live catalog before dispatch. A slug that was correct yesterday may be deprecated or renamed. For aggregators, verify the live catalog at Phase 4 priority. For direct-host providers, verify at the same priority, calibrated by category. The live-catalog check is a presence-and-shape combined assertion, not just slug-string accuracy.

## Rate Limits

Populate after each provider runs live verification. Capture observed RPM, concurrency cap, burst tolerance and rate-limit error response shape.

**OpenRouter architecture note.** Two rate limits operate in parallel. The per-key aggregator ceiling and the upstream-host capacity limit for the specific model. The upstream-host layer surfaces as HTTP 429 "Provider returned error" and is outside the ecosystem's control. Pair every aggregator-routed slot with a fallback slug on a different upstream host or on a direct-host provider.

**Direct-host architecture note.** NVIDIA NIM and Groq are direct-host. One rate limit layer. Sustained-rate sliding-window enforcement behavior should still be observed under first-use conditions.

**Rate limits by provider (populate after verification):**

| Provider | Model | Observed RPM | Concurrency | Error Shape | Observed Date |
|---|---|---|---|---|---|
| Populate | | | | | |

## Verification Status

Verification is the gate to active use. A provider is not promoted to active use because its key is configured. A provider is promoted because verified test runs produced acceptable output at acceptable rate limits.

Verification checklist per provider:

- [ ] Key acquired and stored
- [ ] Live catalog query confirms slug accuracy
- [ ] Connectivity test returns HTTP 200
- [ ] Capability observation: acceptable output under ambassador prompt
- [ ] Rate-limit observation: ten requests, zero unexpected failures
- [ ] Verdict: Pass / Conditional Pass / Fail with notes

Per-provider verification notes land at `Council Chamber/Pending Plans/Support Files/External Model Dispatch/[provider]-verification.md` with observed numbers and a Pass / Conditional / Fail verdict.

If a provider fails verification, mark it tested-not-active with a note. The dispatch script keeps the adapter intact in case the provider improves later.

## Providers Considered But Out of Scope

The following providers were assessed and deferred. Each is considered for one of two reasons: redundant via aggregator path or composing into a separate deferred item.

**Remote providers deferred:**

- Kimi (moonshot.ai). Available via OpenRouter on the active scope path. Not configured as a standalone provider.
- Fireworks. Provider performance and pricing overlap with OpenRouter and NVIDIA NIM. Revisit if active providers fail to cover the task taxonomy.
- Cerebras Inference. OpenAI-compatible endpoint at high tokens-per-second on wafer-scale hardware. Free-tier quotas not clearly documented. Revisit if Groq verification surfaces capability gaps on the reasoning slot.
- Together AI. OpenAI-compatible aggregator with overlap on the OpenRouter open-weights catalog. Adds a second free-tier aggregator surface without unique capability. Revisit if OpenRouter rate-limit pressure becomes a sustained bottleneck.

**Local providers deferred:**

- LM Studio, llama.cpp, Ollama. Remote free providers carry the immediate leverage. Local model sovereignty is a later-horizon move.

## Cross-Reference

This codex sits in the technology cluster of [[Council Chamber/Codices/Codices Index]]. Sibling references:

- Primary Routing Codex. Session model, primary-provider worker tiers, voice-density gates, ad-hoc dispatch posture.
- External worker dispatch script: `Council Chamber/scripts/external-worker.mjs`.
- Ambassador Doctrine: [[Council Chamber/Protocols/Governance/Ambassador Doctrine]].

---

## Related

- [[Council Chamber/Codices/Codices Index]]
- [[Council Chamber/Protocols/Governance/Ambassador Doctrine]]
- `Council Chamber/scripts/.env` (gitignored, not in version control)
