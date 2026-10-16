---
status: active
created: 2026-10-16
bundle: B1
name: skills
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# B1: Skills

Two bundles run per run (SKILL.md Step 2). This bundle's Reports items go to one read-only worker with this file as its brief; any Acts item here runs on the orchestrator and the worker skips it. Items in a bundle run when the bundle runs, so their old day-windows no longer gate them.

### T1-8: Skill mandatory-sections completeness sweep

**Verb:** Acts.

**Execution:**
1. Glob all `Council Chamber/Skills/*/SKILL.md`. For each, check for the sections the Skill Creator spec calls mandatory: Purpose or Trigger, When to Use, Steps or Behavior, Constraints, Refinements.
2. For each SKILL.md missing a `## Refinements` section, append an empty section with the standard stub (`## Refinements` heading plus a `%% date-stamped calibration notes %%` comment). This is purely additive and reversible.
3. Surface as read-only findings (do not auto-edit): a skill missing Constraints, When to Use or Steps. Composing those sections is authoring, not a stub. Those land on the decision board for Sovereign review.

**Runs when:** a SKILL.md lacks a `## Refinements` section.
**Output artifact:** Edited SKILL.md files (Refinements stubs added). Substantive-section gaps on the decision board. All recorded in Done.

### T2-6: Skill cross-reference health

**Verb:** Reports.

**Execution:**
1. Walk all `Council Chamber/Skills/*/SKILL.md` files. Extract every `[[wikilink]]` reference. Check each target against the vault. Build a structured list of broken cross-refs (source skill, broken link) plus a candidate-target inventory of existing skill, codex and script paths.
2. For each broken cross-ref, suggest the likely correct target from the inventory.
3. Verify suggestions against live state before reporting.

**Output artifact:** Findings on the decision board.

### T2-15: Skill frontmatter conformance sweep

**Verb:** Reports.

**Execution:**
1. Read each `Council Chamber/Skills/*/SKILL.md` frontmatter. Check for required fields per the Skills Governance Protocol and Skill Creator spec: `status`, `description`, `tier`, `contrast_tier`, `links`, all at top level (not nested under `metadata:`).
2. Report per skill: missing fields, nested-instead-of-top-level fields, and any skill rendering `status: unknown` in the skills-index script output.
3. Flag `tier` values outside the index generator's routable set and skills missing `tier` entirely. Proposed canonical values surface for Sovereign batch approval, never auto-filled.
4. Mechanical unambiguous fixes (a top-level `status` move from a nested position, an empty `links:` field add) can land as a gated Acts backfill once the Sovereign authorizes. Judgment-required values stay surfaced.

**Output artifact:** Findings on the decision board.

### T2-16: Skill status-to-usage drift audit

**Verb:** Reports.

**Execution:**
1. Glob `Council Chamber/Skills/*/SKILL.md` with frontmatter `status: draft`.
2. For each, check production-use signals: referenced by the AI Interface configuration file or by another skill's handover map, carries a populated Refinements log, has run-log references, or carries a mature model-routing table. A draft with these signals is running in production on a draft flag.
3. Surface each production-grade draft on the decision board with its usage evidence and a recommended status advance. Status changes are Sovereign-gated; this reports and recommends, never flips the field.

**Output artifact:** Findings on the decision board.

### T2-27: Skill disambiguation and trigger-collision scan

**Verb:** Reports.

**Execution:**
1. Read every `Council Chamber/Skills/*/SKILL.md` `description:` field and trigger section.
2. Cluster by domain and flag skill pairs whose description or trigger text overlaps enough that both compete for the same invocation phrase.
3. Report collision pairs plus the skills missing disambiguation fields (`false_twins`, `clarity_triggers`, `boundary_conditions` if your ecosystem uses them), prioritized by cluster density. Adding disambiguation fields is a content edit, Sovereign-gated.

**Output artifact:** Findings on the decision board.

### T2-28: SKILL.md progressive-disclosure overgrowth scan

**Verb:** Reports.

**Execution:**
1. Count lines per `Council Chamber/Skills/*/SKILL.md`.
2. Flag any SKILL.md over 300 lines without a `references/` subdirectory.
3. For each flagged skill, classify the bulk (routing tables, lookup references, session logs, examples) and propose what extracts to `references/` without breaking operational flow. The split itself is a structural change, Sovereign-gated.

**Output artifact:** Findings on the decision board.

### T2-44: Skills-missing-External-Orientation audit

**Verb:** Reports.

The [[Council Chamber/Protocols/Governance/Ambassador Doctrine]] mandates an `## External Orientation` section for every skill that operates outside the vault. A skill that touches an external system without it is drift that no other item catches.

**Execution:**
1. Glob `Council Chamber/Skills/*/SKILL.md`. Grep each for `## External Orientation`.
2. For each lacking it, check whether the skill references external systems (an API, an MCP tool, `gh`, a web fetch, an outbound script, a site repo). A vault-internal-only skill needs no section. An externally-operating one does, per the Ambassador Doctrine Propagation Rules.
3. Report each externally-operating skill missing the section. Authoring the section is Sovereign-gated content, since it carries the skill-specific orientation, so this surfaces and never auto-writes.

**Output artifact:** Findings on the decision board.

### T2-54: Skill-referenced script existence sweep

**Verb:** Reports.

Skills cite scripts by exact path. A script named in a SKILL.md but absent at that path is a silent runtime failure that no other item catches: T2-6 checks inter-skill wikilinks, not script-path references.

**Execution:**
1. Grep all `Council Chamber/Skills/*/SKILL.md` for `scripts/` path references (including tool-script paths under other skill directories).
2. Resolve each referenced path against the live filesystem.
3. Report a broken-reference table: source skill, referenced path, exists or missing. Skip references inside code-fence examples, and flag conditional "if it exists" fallback references separately as intentional.

**Why read-only:** The fix (repoint or remove a dead script reference) is content the Sovereign ratifies, never auto-edited.
**Output artifact:** Findings on the decision board.
