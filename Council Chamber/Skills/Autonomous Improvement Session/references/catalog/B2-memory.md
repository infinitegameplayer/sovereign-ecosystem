---
status: active
created: 2026-10-16
bundle: B2
name: memory
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# B2: Memory

Two bundles run per run (SKILL.md Step 2). This bundle's Reports items go to one read-only worker with this file as its brief; any Acts item here runs on the orchestrator and the worker skips it. Items in a bundle run when the bundle runs, so their old day-windows no longer gate them.

### T2-4: Memory file cross-reference health

**Verb:** Reports.

**Execution:**
1. Walk all files in your AI Interface's project memory directory. Extract every `[[wikilink]]` reference between memories. Check each target against the directory. Build a structured list of broken cross-refs (source memory, broken link) plus a candidate-target inventory of existing memory slugs.
2. For each broken cross-ref, suggest the likely correct target from the inventory.
3. Verify suggestions against live state before reporting.

**Output artifact:** Findings on the decision board. Companion to T2-47 (markdown relative links between memory files).

### T2-7: MEMORY.md compression candidate report

**Verb:** Reports.

**Execution:** Read your AI Interface's `MEMORY.md` index and walk each linked memory file body. Identify candidates for two-pass compression (entries that are stale, redundant or have been superseded by later refinements). Surface a prioritized list.

**Runs when:** MEMORY.md exceeds 280 lines.
**Output artifact:** Findings on the decision board.

### T2-18: Project-memory lifecycle staleness sweep

**Verb:** Reports.

**Execution:**
1. Walk the `project_*` files in your AI Interface's project memory directory. For each, read the stated event date, campaign window or expiry condition in the body.
2. Compare against today. Flag any whose subject event or window has passed, so it now holds historical state that could contaminate a future session loaded as if current.
3. Report each stale-event memory with its expired condition and whether it reads as a compression or retirement candidate. Read-only: the memory directory is Permanent Floor (no autonomous self-edit), so this surfaces, never edits.

**Output artifact:** Findings on the decision board. Complements T2-7 (compression) and T2-4 (cross-reference health) with the temporal-staleness lens.

### T2-47: Cross-memory link integrity sweep

**Verb:** Reports.

Distinct from T2-4: T2-4 checks Obsidian `[[wikilinks]]` between memory files, while the memory index and several memory bodies cross-reference each other with markdown relative links `[Title](file.md)`, an integrity surface no other item validates.

**Execution:**
1. Read the memory index and walk each memory file in your AI Interface's project memory directory. Extract every markdown relative link `[text](target.md)` and every `[[wikilink]]` not already covered by T2-4.
2. Check each target filename against the directory. Build a list of broken links (source file, link text, missing target) plus a candidate-target inventory of existing memory filenames and `name:` slugs for suggested fixes.
3. Report broken links grouped by source, with a suggested correct target per broken link where the inventory makes one obvious.

**Why read-only:** The fix is Sovereign-run.
**Output artifact:** Findings on the decision board.

### T2-50: Memory expiry-lapse scan

**Verb:** Reports.

A memory that carries an expiry date and outlives it keeps steering sessions after its premise has lapsed.

**Execution:**
1. Walk the memory directory. For each file carrying an `expires:` frontmatter field or a body `**Expires:**` line with a parseable date, compare the date to today.
2. Build a report of each file whose expiry is past and is not already marked expired: filename, expiry date, days past and the recommended Sovereign-run edit (add `status: expired`, mark the index line as expired).
3. Surface on the decision board. Never edit the memory store.

**Output artifact:** Findings on the decision board.

### T2-51: Memory frontmatter schema-gap scan

**Verb:** Reports.

Memory files drift into several frontmatter shapes (some dated, some nesting fields under `metadata:`, most undated), so no age-sort sweep can run reliably. This is the schema prerequisite that makes T2-50 and other memory sweeps queryable.

**Execution:**
1. Walk the memory directory. Read each file's frontmatter. Check for the fields a normalized memory carries, all at top level and none nested under `metadata:`: `name` (kebab-case slug), `type` (feedback, system, project, user or reference), `created` (ISO date) and a session identifier if your interface records one.
2. Report per file: missing fields, nested-instead-of-top-level fields and any value-vocabulary drift (a `type` outside the set).
3. Surface the proposed normalization on the decision board for Sovereign-run edits. Never edit the memory store.

**Output artifact:** Findings on the decision board.
