---
status: active
created: 2026-10-16
bundle: B4
name: governance
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# B4: Governance

Two bundles run per run (SKILL.md Step 2). This bundle's Reports items go to one read-only worker with this file as its brief; any Acts item here runs on the orchestrator and the worker skips it. Items in a bundle run when the bundle runs, so their old day-windows no longer gate them.

### T2-5: Codex orphan and inbound-link density report

**Verb:** Reports.

**Execution:** For each codex in `Council Chamber/Codices/`, count inbound references across the vault. Skip codices flagged as intentionally low-traffic in their frontmatter. Rank ascending. Flag every codex with fewer than 5 inbound references as a low-pollination candidate. Sort, threshold and write the report.

**Output artifact:** Findings on the decision board.

### T2-19: Term Registry placeholder-resolution scan

**Verb:** Reports.

If your ecosystem does not maintain a Term Registry, skip this item.

**Execution:**
1. Read the Term Registry. Find every entry whose canonical field reads "(canonical note pending)" or points at a placeholder rather than a real canonical home.
2. For each, check whether a dedicated codex, protocol or index section now exists that could serve as the real canonical pointer.
3. Report each entry with a proposed canonical wikilink where one now exists, or a note that it still has no home. Read-only: updating the registry is a content edit the Sovereign ratifies.

**Output artifact:** Findings on the decision board.

### T2-46: Interface Adapter Registry deprecated-entry staleness check

**Verb:** Reports.

The implemented-plan archival pattern (T2-9) applied to adapter entries. A long-deprecated entry is an archival-review candidate, and a missing status is unverifiable drift. Applies only when [[Council Chamber/Governance/Interface Adapter Registry]] carries a `Status` field and a `Deprecated Date` on deprecated entries. If the registry carries neither, the first run reports that and stops.

**Execution:**
1. Read the Interface Adapter Registry. For each entry, read `Status` and, where deprecated, `Deprecated Date`.
2. Flag any `Status: deprecated` entry whose `Deprecated Date` is more than 90 days past (archival-review candidate), and any entry missing a `Status` field entirely.
3. Report each flagged entry with its date and the recommendation. Editing or removing a registry entry is Sovereign-gated governance content, so this surfaces and never edits.

**Output artifact:** Findings on the decision board.

### T2-60: Codex status-promotion propagation check

**Verb:** Reports.

When a codex's frontmatter `status` is promoted (trial to active, draft to trial), the prose status labels describing it in the navigation surfaces do not follow. The promotion is a single event with several downstream descriptions, and nothing propagates it.

**Execution (read-only):**
1. Parse [[Council Chamber/Codices/Codices Index]] and [[Council Chamber/AI Interface/AI Interface Knowledge Map]] for entries carrying an inline status word next to a wikilink ("Trial state", "Draft state", "Active state", "Retired").
2. Resolve each wikilink and read the target's frontmatter `status`.
3. Flag every mismatch. Report the navigation file, the line, the claimed state and the actual frontmatter value.
4. Know the convention before flagging an absence. If your navigation surfaces label only non-active states, a missing label on an active codex is correct, and the fix for a promoted codex is to remove the stale label rather than replace it with "Active state." Grep the surfaces for the labels they actually use before flagging.

**Why read-only:** The correction is mechanical and safe, but status is a governance fact, so the finding surfaces and the Sovereign's nod lands the edit.
**Runs when:** a codex `status` changed since the last scan.
**Output artifact:** Findings on the decision board.
