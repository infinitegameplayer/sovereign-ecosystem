---
name: source-harvest
description: Use when extracting patterns from any external repo or tool. Read source level, not description level. Classify, extract and integrate what serves the ecosystem.
status: active
version: 1.1
---

# Source Harvest Skill

Purpose: Extract actionable patterns from any external repo, plugin, or resource by reading the actual source, skills, hooks, commands, protocols, configs. Not the README. The nuance is in the implementation. Classify each component against ecosystem equivalents and execute approved integrations with governance applied.
Trigger: Sovereign identifies a new repo, plugin, or tool of interest. Also used as the first-pass when adding any new repo to the Sovereign Tech Watch Protocol Watched Repos table, the first review should always be a Source Harvest, not a description scan.
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

### Step 1: Confirm Access

Identify the source and confirm it is publicly accessible. Common paths:
- GitHub repo: use `gh api repos/[owner]/[repo]/contents/` to list top-level structure
- npm package: fetch the package source
- Docs or protocol site: use `WebFetch`
- SaaS platform, API documentation, or capability inventory: use `WebFetch` and `WebSearch` to extract feature sets and technical documentation. When source code is unavailable, the harvest operates at the capability and pattern level. The classification framework still applies.

Read the license at the artifact before anything else: the LICENSE file or files themselves for a repo, the terms page for a product. A README sentence is a claim, and so is GitHub's license field. `gh api repos/[owner]/[repo] --jq .license` is a first look only: it reports `NOASSERTION` when a repo carries more than one license file, and a permissive label can hide an added clause. Read the license now, while it can still change where the harvest looks. When components carry license fields of their own (a skill's frontmatter, a package manifest), tally every one. A permissive repo can hold non-commercial parts (see Refinements, 2026-10-15).

If authentication is required or the source is private, halt: "Source requires authentication or is private. Sovereign must provide access or assess via available documentation."

Do not proceed using only the README or description as primary evidence. For non-repo sources where no code exists, capability documentation and API references serve as the evidence base.

### Step 2: Inventory the Source

Fetch and list all components. Typical targets:
- Skill files (any `.md` or scripted skill definitions)
- Hook scripts
- Command definitions
- Configuration files (settings, CLAUDE.md, config.json)
- Protocol or governance documents
- Supporting scripts

Record the commit read for each repo, its SHA and date (`gh api repos/OWNER/REPO/commits/BRANCH --jq '.sha[0:12] + " " + .commit.committer.date'`; on Git Bash for Windows prefix the command with `MSYS_NO_PATHCONV=1`), in the inventory and in the report. A quote checked against a branch can fail against next week's text with nothing to say why; a pinned commit lets anyone re-read the same bytes. Size each repo from its tree, never from its README: a description's counts are a claim (see Refinements, 2026-10-20 second pass). Count files, not tree entries: a recursive tree lists directories too, so filter to `type == "blob"` or count `git ls-files` in a clone. A website has no commit, so its pin is its saved pages: keep the raw HTML and the converted text with the harvest under a dated folder, and run `quote-check.mjs` against that folder.

Present the inventory to the Sovereign: "Found [N] components: [brief list by category]." Confirm before proceeding to classification.

### Step 3: Read Every Component

Read each component file. Do not classify from filenames or descriptions alone. The content is the evidence.

For large repos (20+ components), group by category and read the most relevant ones first. Flag anything skipped and why.

When a source names a primary source (a canon, an archive, a dataset, a scripture), fetch the primary source before classifying. The harvest's real value often sits one citation upstream.

Before classifying, read the "Reading the source" section of [[Council Chamber/Skills/Source Harvest/references/harvest-lessons]].

### Step 4: Classify Each Component

For each component, assign a disposition (Adopt / Enrich / Defer / Ignore) and write one to three lines of rationale:
- What does this component actually do at the source level?
- Which ecosystem skill or protocol is the comparison point?
- What specifically is novel, and what is already covered?

Seven checks before a disposition stands (see Refinements, 2026-10-06 and 2026-10-15):
- Is the source's problem statement true? Verify the diagnosis as well as the solution. A harvest that accepts a source's premises imports them.
- If a finding implies a weakness in your system, open the file and confirm the weakness exists before classifying.
- If a pattern arrives with a blocker attached, search your system for how it already solves that problem before accepting the blocker.
- When checking whether your system already has an equivalent, search for what the thing does in your own words, never only in the source's vocabulary. A search for the source's name for a tool finds the source's name (see Refinements, 2026-10-06).
- Before marking anything "covered", open the mechanism in your system said to cover it and read its scope. Covered is a claim (see Refinements, 2026-10-06).
- Whose is it? Separate what the author decided from what the author's tools supply (a plugin's scaffold, a template, a framework default, a co-author). Credit only the decisions to the person. A pattern that comes from the tool is classified as the tool's, with the person's use of it noted. A narrator is not always the author: check who the "I" is before crediting a life story.
- Why does the source do it? Each pattern carries the reason the source states, quoted with where it is stated, or "reason unstated" with any inference marked as one. A pattern harvested without its reason lands as a rule with no purpose, and a rule with no purpose cannot tell where it applies.

The "Classifying" section of [[Council Chamber/Skills/Source Harvest/references/harvest-lessons]] holds further traps. Read it before a disposition stands.

### Step 5: Draft Harvest Report

Compile the full classification into a harvest report:

```
SOURCE HARVEST: [repo name], [date]
--------------------------------------
Adopt:   [count], [names]
Enrich:  [count], [names + target ecosystem file]
Defer:   [count], [names]
Ignore:  [count]

[Per-component breakdown]
```

For each Enrich: specify the exact change to the target file (what to add, where, why).
For each Adopt: draft the ecosystem-adapted version in outline or propose a Pending Plan if scope requires more than one session.
For each Enrich that seeds one pattern into several files: list every file. They are one unit of work, and a later fix to one is incomplete until all are swept.
For each Ignore: mark it covered (already solved here) or contrast (your ecosystem chose differently). Record a contrast with one line on the road not taken.

Before the report quotes the source, check every quote against the source text with an instrument that carries a known-present and a known-absent control, and trust its counts only after the present control is found and the absent one is not (see Refinements, 2026-10-06). The instrument is `node "Council Chamber/scripts/quote-check.mjs" --doc <report> --source <reader reports or clone> [--source <url>]`; it runs both controls itself and stops at exit 2 if either misbehaves. Run it on the finished report, not only on worker quotes: its first run caught three misquotes in the orchestrator's own prose (see Refinements, 2026-10-20). The checker reads double quotation marks only, so every worker brief tells readers to quote in double quotation marks and never in backticks. A report quoted in backticks comes back as "0/1 found", which reads like failure and means unchecked.

The "Verifying the report" section of [[Council Chamber/Skills/Source Harvest/references/harvest-lessons]] holds the counting and attribution checks.

### Step 6: Approval Gate

Present the harvest report to the Sovereign. No changes execute without approval.

Ask: "Approve all, approve subset, or revise?" Wait for explicit response.

If the Sovereign approves a subset, note which items are deferred for a future run.

### Step 7: Execute Approved Changes

For each approved Enrich: edit the target ecosystem file.
For each approved Adopt: create the new SKILL.md or protocol file at the canonical path.

Log each change as it completes.

Ecosystem governance applies to all adoptions:
- SKILL.md format with standard frontmatter
- Expression standards (follow the ecosystem's Writing Style Codex)
- Ambassador Doctrine callout for any skill that operates externally
- Approval gates for structural changes

### Step 8: Skill Registry Housekeeping (runs immediately after Step 7 for any Adopt)

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

### Step 9: File Deferred Items

For each Defer and any unapproved Adopt: add an entry to `Council Chamber/Tools/Support Files/sovereign-deferred-items.md`.

Each entry must include:
- Source and license
- Deferred reason
- Promotion signal (what specific gap or trigger should pull this off the shelf)
- Context notes (specific patterns worth preserving for future reference)

Update `entry_count` in the frontmatter.

### Step 10: Sovereign Tech Watch Entry

If ongoing monitoring of this source is warranted (active development, high relevance, good signal-to-noise), add a row to the Watched Repos table in `Council Chamber/Protocols/Governance/Sovereign Tech Watch Protocol.md`.

Note what was adopted or enriched from this first harvest so future changelog reviews have context.

### Step 11: Inbox Disposition

If the source arrived via the ecosystem Inbox (`Inbox/`), note the disposition in the file or confirm with the Sovereign whether to archive it.

### Step 12: Summary Report

Output a final summary:

```
Source Harvest complete: [repo name], [date]
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
> Primary strategy: Āsana: observe and classify before acting. The harvest is intelligence gathering first, integration second.
> Secondary: Vigraha: ecosystem governance standards are a boundary assertion, not a formality. External patterns are adopted on ecosystem terms.
> The approval gate at Step 6 is the Āsana-to-Yāna transition: information collected, decision made, action authorized.

## Model Routing

Dispatch the cheapest model that does the job well. Before each delegated step, ask whether a smaller model would produce equivalent output.

| Step | Default model | Rationale |
|---|---|---|
| 1. Confirm Access | Sonnet | Source identification and access verification with light judgment |
| 2. Inventory the Source | Sonnet | Structured listing and category grouping for Sovereign confirmation |
| 3. Read Every Component | Sonnet | Multi-file read sweep across heterogeneous component types |
| 4. Classify Each Component | Opus | Disposition judgment against ecosystem equivalents; novelty assessment |
| 5. Draft Harvest Report | Opus | Synthesis across all classified components; Enrich and Adopt specificity |
| 6. Approval Gate | (yields, no model) | Sovereign approval before any changes execute |
| 7. Execute Approved Changes | Sonnet | File edits and new skill creation per approved classification |
| 8. Skill Registry Housekeeping | Haiku | Mechanical file writes and registry updates |
| 9. File Deferred Items | Haiku | Structured append to the deferred items file |
| 10. Sovereign Tech Watch Entry | Haiku | Single-row append to the watched repos table |
| 11. Inbox Disposition | Haiku | File archival note or Sovereign confirmation request |
| 12. Summary Report | Sonnet | Final structured summary across all dispositions |

Set the model explicitly on every subagent dispatch. Never silently inherit the top tier.

## Refinements

_Date-stamped entries for harvest decisions and calibration findings that emerge in practice._

**Template note:** As you run Source Harvests, log your decisions here. The refinements section becomes a precedent record, what you adopted and why, what you rejected, what surprised you. Future harvests reference this section to avoid re-evaluating patterns that have already been classified.

> Also installs standalone from https://www.infinitegameos.io/skills/source-harvest (dual-distribution: this copy lives in your vault, the public plugin updates independently).

**2026-10-20, second pass:** six more open-source Obsidian and Claude Code repos (four MIT, two ideas only)
Adopt 0, Enrich 5, Defer 7, Ignore 32 (21 covered, 11 contrast). All approved and executed the same session.

**The repos that sell enforcement were the ones whose gates did not hold.** One signed its evidence with a salt kept in eight of its own hook files. One ended its write gate on exit 1, which the hooks reference says lets the action go ahead. One exited 0 on every branch of a gate. Read a gate's exit path before crediting it as a gate, and check the exit code against the current hooks reference, not memory.

**A README's counts and license line are claims.** One repo said 44, 47 and 48 hooks in three files and ended its README on a bare "MIT" with no license file. Step 2 now sizes from the tree and records the commit read.

**2026-10-20:** open-source Obsidian and Claude Code repos (62 repos across eight themes, mostly MIT)
Adopt 3, Enrich 6, Defer 14, Ignore 16 (8 covered, 8 contrast). All approved and executed the same session.

**A quote checker belongs in the toolbox, not in each harvest.** Three harvests running had each built a throwaway one. This run shipped `quote-check.mjs`, and its first use found three misquotes in the report's own prose, plus a worker quote filed under the wrong path. Step 5 now names it.

**2026-10-15:** a large open-source skills repo (MIT label, well over a hundred skills, per-skill licenses vary)

**The repo's license is not every component's license.** The LICENSE file read MIT, and so did GitHub's field. The skill the harvest leaned on hardest carried a non-commercial license in its own frontmatter, and another carried a different non-commercial license. A reader caught the first by chance. A one-line tally of every `license:` field caught the rest. Step 1 now asks for the tally.

**A rival grep can match "arrival".** The first search for rival explanations in the harvesting system returned hits for "arrival" and looked like coverage. A rerun with word boundaries and a known-present control showed the absence was real. The quote-check lesson of 2026-10-06 applies to absence searches too: an instrument earns trust by finding its control.

**2026-10-06:** four paid courses (copyrighted course material, pattern level)

**A quote checker that reports zero for everything is wired to nothing.** The first version of the script that checked thirty worker quotes against the transcripts returned zero matches for every one, including a phrase visibly in the file. A clean-looking zero and a broken instrument print the same number. It was rebuilt with a known-present and a known-absent control, and only then did its finds mean anything. Step 5 now requires the controls.

**A search aimed at the source's vocabulary walks past your own instrument.** The report first said the harvesting system had no equivalent of the source's monthly money tool. The search had looked for the source's phrases and walked past an existing ledger section that already read the month backward every week. The finding was wrong in part and was corrected before execution. Step 4 now says to search for what a thing does, in your own words.

**"Covered" is a claim that needs your mechanism opened and its scope read.** A referral discount was filed as covered by store credit. Store credit covered one product class, and the source meant a different one, where the system had no referral mechanic at all. The mechanism existed. Its scope was never read. Step 4 now requires opening it before the word is written.
