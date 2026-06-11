---
name: source-harvest
description: Use when extracting patterns from any external repo or tool. Read source level, not description level. Classify, extract and integrate what serves the ecosystem.
status: active
version: 1.0
---

# Source Harvest Skill

Purpose: Extract actionable patterns from any external repo, plugin, or resource by reading the actual source — skills, hooks, commands, protocols, configs. Not the README. The nuance is in the implementation. Classify each component against ecosystem equivalents and execute approved integrations with governance applied.
Trigger: Sovereign identifies a new repo, plugin, or tool of interest. Also used as the first-pass when adding any new repo to the Sovereign Tech Watch Protocol Watched Repos table — the first review should always be a Source Harvest, not a description scan.
Inputs: Repo URL, tool reference, or inbox item.
Outputs: Structured harvest report (classified component by component) + approved ecosystem file edits + deferred items filed + optional Pending Plans for larger scope + optional Sovereign Tech Watch entry.
Status: active
Related Protocols/Codices: [[Council Chamber/Protocols/Governance/Sovereign Tech Watch Protocol]], [[Council Chamber/Tools/Support Files/sovereign-deferred-items.md]], [[Council Chamber/Protocols/Governance/Ambassador Doctrine]]

## Classification Framework

Every component is classified as one of four dispositions:

| Disposition | Meaning | Action |
|-------------|---------|--------|
| **Adopt** | Genuinely new capability not covered by ecosystem | Build as an ecosystem skill or protocol, adapted to ecosystem vernacular and governance |
| **Enrich** | Strengthens an existing ecosystem skill or protocol | Identify the exact change and target file; execute with approval |
| **Defer** | Useful but no immediate gap; worth watching | File in `sovereign-deferred-items.md` with a promotion signal |
| **Ignore** | Fully covered by existing ecosystem capabilities, or not relevant | No action; note briefly why |

---

## Steps

### Step 1 — Confirm Access

Identify the source and confirm it is publicly accessible. Common paths:
- GitHub repo: use `gh api repos/[owner]/[repo]/contents/` to list top-level structure
- npm package: fetch the package source
- Docs or protocol site: use `WebFetch`
- SaaS platform, API documentation, or capability inventory: use `WebFetch` and `WebSearch` to extract feature sets and technical documentation. When source code is unavailable, the harvest operates at the capability and pattern level. The classification framework still applies.

If authentication is required or the source is private, halt: "Source requires authentication or is private. Sovereign must provide access or assess via available documentation."

Do not proceed using only the README or description as primary evidence. For non-repo sources where no code exists, capability documentation and API references serve as the evidence base.

### Step 2 — Inventory the Source

Fetch and list all components. Typical targets:
- Skill files (any `.md` or scripted skill definitions)
- Hook scripts
- Command definitions
- Configuration files (settings, CLAUDE.md, config.json)
- Protocol or governance documents
- Supporting scripts

Present the inventory to the Sovereign: "Found [N] components: [brief list by category]." Confirm before proceeding to classification.

### Step 3 — Read Every Component

Read each component file. Do not classify from filenames or descriptions alone. The content is the evidence.

For large repos (20+ components), group by category and read the most relevant ones first. Flag anything skipped and why.

### Step 4 — Classify Each Component

For each component, assign a disposition (Adopt / Enrich / Defer / Ignore) and write one to three lines of rationale:
- What does this component actually do at the source level?
- Which ecosystem skill or protocol is the comparison point?
- What specifically is novel, and what is already covered?

### Step 5 — Draft Harvest Report

Compile the full classification into a harvest report:

```
SOURCE HARVEST — [repo name] — [date]
--------------------------------------
Adopt:   [count] — [names]
Enrich:  [count] — [names + target ecosystem file]
Defer:   [count] — [names]
Ignore:  [count]

[Per-component breakdown]
```

For each Enrich: specify the exact change to the target file (what to add, where, why).
For each Adopt: draft the ecosystem-adapted version in outline or propose a Pending Plan if scope requires more than one session.

### Step 6 — Approval Gate

Present the harvest report to the Sovereign. No changes execute without approval.

Ask: "Approve all, approve subset, or revise?" Wait for explicit response.

If the Sovereign approves a subset, note which items are deferred for a future run.

### Step 7 — Execute Approved Changes

For each approved Enrich: edit the target ecosystem file.
For each approved Adopt: create the new SKILL.md or protocol file at the canonical path.

Log each change as it completes.

Ecosystem governance applies to all adoptions:
- SKILL.md format with standard frontmatter
- Expression standards (follow the ecosystem's Writing Style Codex)
- Ambassador Doctrine callout for any skill that operates externally
- Approval gates for structural changes

### Step 8 — Skill Registry Housekeeping (runs immediately after Step 7 for any Adopt)

For every new skill or protocol created in Step 7, run this housekeeping block before proceeding to Step 9:

**a. Register the skill.** New skills are only discoverable by your runtime after registration. The exact mechanism depends on your environment:
- If your runtime uses a skills discovery directory (e.g. `.claude/skills/`), create a link or copy from that directory to `Council Chamber/Skills/[Skill Name]`. On Mac/Linux: `ln -s`; on Windows: `mklink /J` (run as administrator).
- Plugin-based runtimes: ensure the skill appears in the plugin manifest's discovery path.
- Settings-based runtimes: update the relevant settings file.

Confirm the path resolves correctly after creation.

**b. Update the Skills Index.** Edit `Council Chamber/Skills/Skills Index.md`:
- Add the new skill name to the alphabetically-sorted active skills list
- Add a dated entry with name, date added, one-line purpose, source reference

**c. Note if a new skill requires a CLAUDE.md update.** If the skill introduces a standing behavior (a new trigger phrase, a new mandatory gate, a new integration), check whether CLAUDE.md needs a standing instruction. If yes, flag it as a recommendation before Step 10.

This housekeeping block is not optional for Adopt items. A skill that exists in the canonical path but has no symlink and no index entry is a ghost. Discoverable only by accident.

### Step 9 — File Deferred Items

For each Defer and any unapproved Adopt: add an entry to `Council Chamber/Tools/Support Files/sovereign-deferred-items.md`.

Each entry must include:
- Source and license
- Deferred reason
- Promotion signal (what specific gap or trigger should pull this off the shelf)
- Context notes (specific patterns worth preserving for future reference)

Update `entry_count` in the frontmatter.

### Step 10 — Sovereign Tech Watch Entry

If ongoing monitoring of this source is warranted (active development, high relevance, good signal-to-noise), add a row to the Watched Repos table in `Council Chamber/Protocols/Governance/Sovereign Tech Watch Protocol.md`.

Note what was adopted or enriched from this first harvest so future changelog reviews have context.

### Step 11 — Inbox Disposition

If the source arrived via the ecosystem Inbox (`Inbox/`), note the disposition in the file or confirm with the Sovereign whether to archive it.

### Step 12 — Summary Report

Output a final summary:

```
Source Harvest complete — [repo name] — [date]
Adopted:  [N skills/protocols created]
Enriched: [N existing files updated]
Deferred: [N items filed]
Ignored:  [N]
Watch entry: [added / not added]
```

---

## Tool Scoping Pattern

When creating a new skill that operates externally, declare the allowed tools in the command frontmatter using the `allowed-tools` key. This scopes the permission surface to the minimum required for that skill's job.

Example:

```
---
allowed-tools: Bash(gh issue view:*), Bash(gh pr comment:*), Bash(gh pr diff:*)
---
```

This is a Vigraha boundary at the command level. It prevents a skill from reaching tools it has no business touching. Apply it to any skill that uses external CLIs or operates with scoped permissions.

Not all ecosystems can use this pattern in every execution environment. Flag it in new skill design as the intended permission boundary even if the runtime does not enforce it yet.

---

## Constraints

- Source must be read before classification. Descriptions and README are supporting context only.
- No wholesale installs. Every adoption is a conscious ecosystem-adapted implementation.
- Ecosystem expression standards apply to all new content generated.
- Structural file changes (renames, moves, deletions of existing files) require explicit Sovereign approval per CLAUDE.md Approval Gate.
- If a component's source cannot be fetched (private, auth-gated, minified), classify it as Defer with a note explaining the access limitation.

## Planning Mode Rule

Status is active. Execution authorized. Steps 1-5 are research only. Step 6 is the approval gate. Steps 7-12 execute after approval.

## External Orientation

> [!info] Ambassador Doctrine Active
> This skill operates under the [[Council Chamber/Protocols/Governance/Ambassador Doctrine]].
> Primary strategy: Āsana — observe and classify before acting. The harvest is intelligence gathering first, integration second.
> Secondary: Vigraha — ecosystem governance standards are a boundary assertion, not a formality. External patterns are adopted on ecosystem terms.
> The approval gate at Step 6 is the Āsana-to-Yāna transition: information collected, decision made, action authorized.

## Refinements

_Date-stamped entries for harvest decisions and calibration findings that emerge in practice._

**Template note:** As you run Source Harvests, log your decisions here. The refinements section becomes a precedent record — what you adopted and why, what you rejected, what surprised you. Future harvests reference this section to avoid re-evaluating patterns that have already been classified.
