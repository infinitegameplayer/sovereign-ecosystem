---
status: active
created: 2026-10-16
bundle: B5
name: infrastructure
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# B5: Infrastructure

Two bundles run per run (SKILL.md Step 2). This bundle's Reports items go to one read-only worker with this file as its brief; any Acts item here runs on the orchestrator and the worker skips it. Items in a bundle run when the bundle runs, so their old day-windows no longer gate them.

### T2-13: Scripts-package dependency and CVE audit

**Verb:** Reports.

**Execution:** Run `npm audit --json` (or read the audit output) in `Council Chamber/scripts/`. Report CVEs by severity with a remediation path per finding. Flag any high-severity CVE with no upstream fix as a removal-or-replace candidate. Do not run `npm audit fix` autonomously (it mutates the lockfile and can bump majors); surface the fix as a recommendation.

**Output artifact:** Findings on the decision board.

### T2-21: MCP server load-vs-use gap audit

**Verb:** Reports.

**Execution:**
1. Read the active MCP server list from your AI Interface settings files.
2. For each registered server, grep recent session logs and `.runtime/` artifacts for tool calls attributed to that server. Record the most recent session that called each server's tools.
3. Flag any server with zero tool calls in 30+ days as a context-budget deactivation candidate. Report per server: last-used date (or "never seen in window") and the recommendation.

**Why read-only:** Deactivation stays Sovereign-judgment.
**Output artifact:** Findings on the decision board.

### T2-22: Explicit model-set compliance audit

**Verb:** Reports.

**Execution:**
1. Grep recent session logs and any dispatch log (last 14 days) for agent-tool dispatch records.
2. Flag two failure modes: a dispatch with no explicit `model:` set (silent parent-model inheritance), and a dispatch routed to a tier above the work warranted.
3. Report each flagged dispatch with its context and the recommended tier. Read-only.

**Output artifact:** Findings on the decision board.

### T2-25: Settings file allow-list integrity audit

**Verb:** Reports.

**Execution:**
1. Read your AI Interface settings file's `permissions.allow` (or equivalent allow-list). For each entry referencing a vault script path, check whether the script exists on disk.
2. Flag entries pointing at a missing script as dead-grant candidates, naming the canonical replacement where one exists.
3. Surface on the decision board. The fix path is Sovereign-run: stage the removal via the audit/apply toolchain if one exists, or flag for manual removal. The settings file is Permanent Floor: no autonomous edit.

**Output artifact:** Findings on the decision board.

### T2-26: Undocumented required-env-key audit

**Verb:** Reports.

**Execution:**
1. Grep `Council Chamber/scripts/**/*.mjs` (and equivalent script files) for env-key reads that hard-exit on absence (a `process.exit(1)` guarded on a missing `process.env.X` or `env.X`).
2. For each required key, check whether it appears in `Council Chamber/scripts/.env` or equivalent secrets file or carries a documented placeholder.
3. Flag two failure modes: a key required by a live script but absent or undocumented (a future opaque failure), and a key tied to a service retired from the ecosystem (flag the owning script as a dead-integration archival candidate).
4. Surface on the decision board. Read-only.

**Output artifact:** Findings on the decision board.

### T2-57: MCP tool-description integrity sweep

**Verb:** Reports.

A changed MCP tool description or schema without a corresponding version bump is the documented rug-pull tool-poisoning vector, and any MCP server that reaches a live account sits on a trust boundary. Distinct from T2-21, which watches load-versus-use efficiency, not integrity.

**Execution (read-only):**
1. For each active MCP server in the session config, capture the current tool inventory: tool names, descriptions and input schemas (tool search surfaces these on demand).
2. Hash the per-server inventory (stable JSON serialization, sha256) and diff against the last recorded hash in the item's state file (`Council Chamber/Skills/Autonomous Improvement Session/references/mcp-integrity-state.json`, created on first run).
3. On a hash change, produce the human-readable diff (which tool, which field, old and new text) and surface it on the decision board. A vendor-announced update reconciles and re-baselines on Sovereign acknowledgment. An unexplained change escalates before that server's tools are trusted again.
4. Update the state file with current hashes and run date. The state write is the item's only edit.

**Why read-only:** A scan plus its own state file. No remediation is ever autonomous. A flagged server is a Sovereign-attention item.
**Output artifact:** Findings on the decision board plus the state file.
