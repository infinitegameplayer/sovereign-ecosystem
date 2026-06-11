---
status: draft
created: 2026-06-10
type: optional_path
---

# Optional Path - Local Inference and Semantic Search

Purpose: extend the ecosystem with a fully offline inference fallback and an optional semantic search layer for the vault, both rooted in the same principle: the vault stays the source of truth.

Neither layer is required. The template runs complete without either. This path is for Sovereigns who want the option.

## When This Path Fits

This path is applicable if:

- you want a non-primary-provider fallback for deterministic or mechanical tasks
- you want to run inference completely offline after an initial model download
- you want semantic ("find notes by meaning, not just keyword") search over your vault
- you are building toward a zero-cloud setup and want to understand the available architecture

Default next move:

- read both sections and decide which layer, if either, is applicable now
- convert applicable layers into separate Pending Plans if the timing feels right
- let it stay documented and unimplemented if neither feels urgent

## Layer 1 - Local Inference Fallback

### What It Is

Jan is an open-source desktop application that runs language models locally on your machine. After a one-time model download, it operates with no network connection required. It exposes an OpenAI-compatible API at `localhost:1337`.

Jan supports Llama, Qwen, DeepSeek, Gemma and Kimi model families. As of v0.7.9 it is available for macOS, Windows and Linux. It has over five million downloads and 41,000 GitHub stars.

The project page is [jan.ai](https://jan.ai).

### Why It Exists in a Sovereignty-Framed Ecosystem

The long-horizon direction for this ecosystem has always been progressive: more local, more hardware-owned, more platform-agnostic as those options mature. Jan is a concrete step in that direction that is practical today.

Two specific use cases fit the sovereignty framing:

**Fully offline mode.** Some tasks do not require a frontier model. Reformatting notes, extracting structured data from a document, running a summary pass over a transcript: these are mechanical tasks where a locally running model is sufficient and a cloud API call is unnecessary. Jan makes that possible with no network dependency after setup.

**Non-primary-provider fallback.** Any script in this ecosystem that calls an OpenAI-compatible endpoint can be redirected to `localhost:1337` when the primary provider is unavailable or when you are working in a network-restricted environment.

### What It Is Not

Jan is a desktop application, not an MCP server or a library. It does not integrate directly into Claude Code as a tool. Integration happens at the API routing level: a script that normally points at `https://api.anthropic.com` can be written to accept an endpoint override and pointed at `http://localhost:1337` instead.

Jan is also not a replacement for a frontier AI interface for judgment-bound work. Voice calibration, architectural decisions, governance reasoning, creative synthesis: these stay on your primary AI interface. Local models suit mechanical and deterministic tasks where accuracy on narrow operations matters more than broad judgment.

Set that expectation before investing in setup. The value is in the routing flexibility and the offline capability, not parity with a frontier model.

### The Routing Pattern

Any ecosystem script that calls an OpenAI-compatible API can accept an endpoint parameter:

```js
// instead of calling api.anthropic.com, point at the local Jan server
const endpoint = process.env.LOCAL_AI_ENDPOINT || "http://localhost:1337/v1";
```

Scripts written with this pattern work against either surface. You select the model from what Jan has downloaded, configure the endpoint override, and run.

No core ecosystem infrastructure changes. No MCP config changes. The script carries the routing flexibility; Jan provides the local target.

### Honest Expectations

Local models are smaller than frontier models. They are faster on short tasks and significantly weaker on complex reasoning. The fit is mechanical: reformatting, extraction, summarization of well-structured content, scripted classification tasks. The fit is not voice work, nuanced judgment, or anything where the output goes directly to an external audience without review.

Start with a mid-size model (7B to 14B parameters is practical on most current hardware) and test against the specific tasks you intend to run before building a workflow around it.

---

## Layer 2 - Optional Semantic Search

### What It Is

Semantic search lets you find notes by meaning rather than exact keyword match. A plain-text search for "energy management" finds notes that use that phrase. A semantic search finds notes that discuss rest, recovery, capacity and focus even if none of them use the phrase "energy management."

The architectural pattern this ecosystem recommends is simple: plain Markdown stays the source of truth, a vector index is a rebuildable cache, never the canonical store. If the index is corrupted or deleted, rebuilding it from the Markdown files is always the recovery path.

That pattern holds for both options below.

### Option A - memsearch (Milvus-backed)

memsearch is a mature Claude Code plugin from Zilliz. Install it with:

```
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
```

Architecture: plain Markdown files in `.memsearch/memory/` serve as the source of truth. A Milvus vector index caches the embeddings and can be rebuilt at any time. Search uses hybrid BM25 sparse retrieval combined with dense vector search, merged via Reciprocal Rank Fusion. Session summaries are generated asynchronously. The top three semantic results are injected into every prompt via hooks.

The pattern aligns well with how this ecosystem is structured. MEMORY.md and the vault's note structure are both plain Markdown already. Layering memsearch over a vault folder adds semantic reach without changing the underlying architecture.

The primary dependency is Milvus, which runs locally but adds infrastructure overhead. This is manageable and documented in the memsearch setup guide.

### Option B - SQLite plus Local Embeddings (sovereignty-preferred)

For Sovereigns building toward zero-cloud operation, the preferred direction is a fully local stack: SQLite as the index store and a locally running embedding model (via Ollama or equivalent) for generating the vectors.

This pattern (popularized by the Nooscope project in the Obsidian community) has no external API dependencies after initial setup. The embedding model runs on your hardware. The index lives in a local SQLite file. Markdown is still the source of truth. The index is still rebuilable from scratch.

The tradeoff: setup requires more manual configuration than installing a plugin. There is no single installer. You wire Ollama, an embedding model, a simple indexing script and a search interface. The components are all mature and documented individually.

This option is the right long-horizon target for a zero-cloud setup. It is more work to stand up today. The effort is worth it if full local operation is a priority.

### What Is Not Recommended

Do not store canonical knowledge exclusively in a vector index. The index is a search cache. Notes, governance files, and vault content live in Markdown. The index answers "find relevant notes," not "what is the canonical version of this fact." The architecture is always: Markdown primary, vector index derivative.

---

## Good Questions For This Path

- What mechanical tasks currently go to your AI interface that a local model could handle offline?
- Is there a category of vault search where you frequently cannot find notes you know exist?
- Is full local operation a current priority, or a horizon goal?
- Do you have the hardware to run a 7B to 14B model at useful speed? (8GB RAM minimum; 16GB recommended)

## Completion Signal

This optional path is complete when:

- you have decided which layers, if any, are applicable now
- applicable layers have been converted into Pending Plans with setup steps scoped
- you have set honest expectations for what each layer changes about daily workflow

---

These are doors, not defaults. The template runs complete without either layer. Local inference and semantic search expand what is possible without changing what already works.

Open the door when it fits. Leave it closed when it does not.
