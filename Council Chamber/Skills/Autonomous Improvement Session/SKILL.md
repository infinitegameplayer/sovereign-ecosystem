---
name: Autonomous Improvement Session
description: Use when you have extra session capacity and want to set your ecosystem improving without active attention. Sovereign-invoked only, never scheduled. For low-stakes, additive, vault-internal improvement work where no per-item approval is needed.
status: active
tier: foundational
contrast_tier: 1
external_orientation: true
---

# Autonomous Improvement Session

**Purpose:** Run a set-and-forget session that improves your ecosystem without your active attention. Burns extra capacity on low-stakes, additive, vault-internal hygiene and improvement work. Tier 1 items land edits directly. Tier 2 items produce findings for later review. The skill is a recursive flywheel: a research rotation grows its own menu of improvement types every cycle, a threshold model lets its execution authority climb one earned step at a time, and a decision board lets the Sovereign ratify the climb on their own schedule. Menu growth is fast and wide. Execution authority is slow and earned.

**Trigger:** Sovereign-invoked when extra capacity exists. Examples: heading out, end of week with capacity to burn, end of session with remaining budget. Never scheduled, never auto-fired.

**Inputs:** The log file at `Council Chamber/Logs/Autonomous Improvement Log.md` (state lives in its frontmatter). Optional invocation hint: number of items to run, a tier preference, a "full sweep" override.

**Outputs:** One appended entry at the top of the log body and a regenerated decision board at `Council Chamber/Skills/Autonomous Improvement Session/decision-board.md`. Tier 1 items leave evidence as edits in their target files. Tier 2 items fold their findings into the decision board.

**Output doctrine.** The decision board is the single decision surface. No skill-generated report files land in the Inbox. The Inbox is a routing queue for genuine inbound notes, not a place for this skill's output. The run-log entry plus the session record (a git commit when your vault is git-tracked) is the durable breadcrumb, lightweight by design and matching the Session Closeout slim. Write a standalone report only when a specific run genuinely warrants one.

---

## Operating Principle (read first, governs the rest)

Load this skill's `CLAUDE.md` first. It holds the operating mindset, the posture to run with. Read it, then this principle, then the steps.

This is an autonomous improvement and hygiene engine. The default verb is DO, not propose.

If an action is additive, reversible, vault-internal and touches no deletion, no canonical-governance ratification, no voice and no outward surface, then execute it and record it in the run log. Do not ask. Routing an Inbox item to its container, archiving an implemented plan, fixing a reference to a retired artifact, adding a missing index entry, normalizing a slug: these are the work, not proposals. If something is broken or missing and the clean fix is obvious and safe, make the fix.

Surface to the Sovereign only two things. First, a genuine judgment fork. Concretely that means any one of: the routing heuristics conflict or none clearly applies; the situation is materially novel versus prior clean runs of this action; intent is ambiguous and the choice would set a pattern; or the action is reversible but high-impact (touches many files at once, or a high-inbound-reference artifact). Absent one of those, it is not a fork. Do the work. Second, anything that touches the Permanent Floor. These two reflexes are opposite and must not blur: safe work is act-then-show, Floor-class work is surface-then-wait. "Do not ask" governs the safe domain. It is never license to act on a Floor item, and the Floor's existence is never license to ask about safe work near it. A clean run leaves the Approvals bucket near empty, because the safe work is already done and sits in the Completed bucket for review.

The Permanent Floor (see Constraints) is the guardrail and it is absolute. Everything above it that is safe is yours to execute. Autonomy within the guardrails is the entire point of this skill.

---

## When to Use

- Sovereign says any of: "run autonomous improvement", "set and forget", "burn the rest of my capacity on improvement work", "I'm heading out, run improvement".
- Sovereign has reviewed the prior run's decision board and wants to act on accepted candidates by weaving them into the menu.
- Sovereign wants the skill to run a single specific menu item by name.

---

## Menu

The starter menu is below. New items arrive through the research rotation and the Sovereign's decision-board ratifications. As the menu grows past what fits inline comfortably, move the catalog to a `references/menu-catalog.md` file and load it at Step 2.

**Tier 1 (autonomous, edits land directly):**
- **T1-1 wikilink integrity sweep.** Find links pointing at moved, renamed or deleted files and fix them to the live path.
- **T1-2 index regeneration.** Regenerate Pending Plans Index and any other generated index from its source files.
- **T1-3 anti-AI sweep on draft articles.** If your ecosystem ships the Anti-AI Writing Patterns Codex, run its sweep over unpublished drafts.
- **T1-4 memory slug variant normalization.** Normalize inconsistent slugs and filename variants across memory files.
- **T1-5 Codices Index completeness sweep.** Find codices missing from the index and add them.
- **T1-6 superseded-artifact and dead-section sweep.** Find sections referencing retired artifacts and reconcile them to the live replacement.

**Tier 2 (read-only scans, findings to the decision board):**
- **T2-1 Inbox triage.** Route inbound notes to their containers. Condition-based: eligible whenever the Inbox holds unrouted items.
- **T2-2 stale draft surfaces.** Surface drafts that have sat untouched past a reasonable window.
- **T2-3 memory cross-reference health.** Find `[[links]]` between memory files that point at nothing.
- **T2-4 external link rot.** HEAD-check outbound URLs across the vault and report dead ones.
- **T2-5 skill cross-reference health.** Find skill-to-skill references that point at nothing.
- **T2-6 status vocabulary conformance.** Report Pending Plans using a status outside the canonical vocabulary.
- **T2-7 tag vocabulary drift.** Report tag variants that have drifted from the canonical set.
- **T2-8 breadcrumb propagation and stale-reference sweep.** Read governance artifacts changed recently, find parallel docs that reference them and report stale claims. Git-history check built in so intentional history is not mis-flagged.
- **T2-9 implemented-plan archival candidate sweep.** Detect Pending Plans marked `implemented` that linger in the active directory. Archive them (see the Permanent Floor note on lifecycle closure).

**Optional extension: external-surface triage.** If your ecosystem maintains external repositories with issue tracking, add a Step 0 that queries open routine or health issues, clusters by type and priority, routes each into safe-now, fix-via-PR and judgment lanes, and closes consumed issues with a consumption comment. The triage reads and routes. It never pushes to an external main branch. This extension stays off until you run external repos.

---

## The Two Speeds

The flywheel runs at two speeds on purpose. Menu growth is fast and wide: the research rotation casts a wide net for categories and mechanisms of improvement, and the menu of things the skill knows how to do grows every cycle. Execution authority is slow and earned: v1 keeps today's line, and the line climbs item by item only through ratified decisions. Wide net for ideas. Narrow gate for action. The gate widens only with proof.

## The Threshold Model

Every menu item and every discovered action carries an `autonomy` level. The level governs execution authority. It is distinct from the tier, which governs output shape: Tier 1 lands edits, Tier 2 writes findings.

- **Level 1, fully autonomous.** Additive, reversible, vault-internal, zero judgment. The agent does it and logs it. Every starter menu item is Level 1.
- **Level 2, autonomous with parked questions.** The agent acts on the safe part and parks any genuine judgment fork as a question on the decision board.
- **Level 3, Sovereign-judgment-required.** Structural, voice-bound, outward-facing or approval-gated. Always parked. Never auto-executed.

A skill-level `auto_execute_threshold` lives in the log frontmatter and defines the line. It starts at `1`. At or below the line the agent executes. Above the line it parks to the decision board. The threshold and per-item levels move only through ratified decisions logged in the run history. Nothing raises its own autonomy.

**v1 posture:** threshold `1`, every starter item Level 1. The autonomy field becomes load-bearing as the menu grows and new items arrive carrying judgment forks or structural reach.

## The Decision Board

One review surface. The closing output is the board, and a durable backing file at `Council Chamber/Skills/Autonomous Improvement Session/decision-board.md` holds the same content for continuity. The board is regenerated each run with the current run's open decisions. Resolved decisions log to the Autonomous Improvement Log, not the board.

Four buckets:

1. **Completed this run (for review).** What the skill did autonomously this run, each line reversible via git or trivially undone. Routed Inbox items, archived plans, applied hygiene fixes. This is a record to skim, not a decision. As autonomy widens, this bucket grows and the next one shrinks. That is the flywheel working.
2. **Approvals and questions.** Genuine judgment forks the agent was unsure of, anything that needed intent before acting. The Sovereign answers with a decision plus a forward rule. A clean run leaves this bucket near empty. Scale the form of each question to context. When the matter is nuanced, technical or rare, give the full Three Solutions: the situation, three real options, the one you recommend and its tradeoff. When it is simple, give one recommended move. Never a bare open question.
3. **New menu candidates and autonomy moves.** Improvement types the research rotation and opportunistic-capture layers surfaced, plus any proposed autonomy-level move. The Sovereign accepts, declines or reshapes each. Accepted candidates get woven into the menu in the return session.
4. **Proposed Pending Plans.** Anything bigger than one session of work, or any governance, memory or CLAUDE.md class change. The agent drafts a cliff-note summary, not a vague question. The board entry is "approve plan creation?". Only surface plans you recommend creating. Every item in this bucket carries a positive recommendation and the reason for it.

---

## Steps

### Step 1: Load state

Read `Council Chamber/Logs/Autonomous Improvement Log.md`. Parse the frontmatter: `menu_state` map (item ID to last-run date), `run_counter` integer, `auto_execute_threshold` integer, `research_state` map (category ID to last-researched date) and `priority_flags` list. If the log does not exist, halt and surface: "Log file missing. Create the seed log per the SKILL.md and retry."

### Step 2: Compute eligibility

For each menu item, apply its eligibility rule against the state. Build an eligible-items list. If the Sovereign passed an item name, narrow to that item only.

**Three-tier eligibility (resolves the cooldown problem):**
- **Condition-based, no window.** Cheap hygiene and routing that runs whenever there is something to do: T2-1 Inbox triage, T2-9 plan archival, T1-2 index regeneration, T1-5 Codices Index completeness, T1-6 superseded sweep. Eligible when the target is non-empty, regardless of last-run date.
- **Short window, 7 to 14 days.** Cheap scans with moderate drift: T1-1 wikilink, T1-3 anti-AI, T1-4 memory slug, T2-8 breadcrumb.
- **Long window, 30 to 90 days.** Expensive scans with slow drift: T2-4 link rot, T2-2, T2-3, T2-5, T2-6, T2-7. The window matches the cost and the drift speed.

A fixed day-window is the wrong throttle for cheap hygiene. Condition-based items run every session that has something to do.

### Step 3: Select items by priority

No single run executes everything. Rank eligible items by priority, then select up to a budget of 8 per run. Priority is a simple score, highest first: Sovereign-flagged items (`priority_flags`) lift to the top, research-surfaced high-value items lift next, staleness lifts an item the further it has sat past its window.

If the Sovereign passed an item count, honor it against the ranked list. If they passed "full sweep", run every eligible item with no cap. Selection respects the threshold: only items at or below `auto_execute_threshold` execute. Eligible items above the line surface on the decision board instead.

### Step 4: Announce the plan

Output a one-paragraph plan: "Running N items this session. Tier 1: [list]. Tier 2: [list]. Estimated wall time: [rough estimate]." This is the only announcement until close.

### Step 5: Execute Tier 1 items

For each Tier 1 item, first check its autonomy level against `auto_execute_threshold`:
- **At or below the line:** dispatch execution. Tier 1 items run sequentially to avoid file-edit conflicts.
- **Level 2:** execute the safe part. When a genuine judgment fork appears, park it to decision board bucket 2 with the context needed to rule, then continue.
- **Above the line:** do not execute. Park the whole item to bucket 2.

After each item completes, do a layer-1 opportunistic capture (Step 6), then move to the next item.

### Step 6: Layer 1 opportunistic capture (per item)

Immediately after each Tier 1 item completes, ask: "Did running this item surface any other opportunity types worth adding to the menu?" Capture findings as draft candidate entries. Findings flow into Step 9 synthesis.

### Step 7: Execute Tier 2 items

Dispatch all Tier 2 items in parallel as Sonnet subagents (read-only scans are safely parallel). Each returns a structured finding. Tier 2 items are Level 1: producing a read-only finding is fully autonomous. When a finding needs a ruling the return session should act on, mirror it as a board bucket-2 entry.

### Step 8: Research rotation (every run)

The research rotation is the engine of menu growth. It rotates through research categories registered in the log and keys how many it runs to how many categories exist: six or fewer categories, research one per session; more than six, research two per session. Read `research_state`, pick the least-recently-researched categories, dispatch one Sonnet worker per selected category. Each returns a self-ranked top-5 candidate list with a one-line "why this beat the rest." Candidates flow into Step 9 and surface on the decision board's bucket 3. Update `research_state` with today's date for each researched category.

The starter category set: hygiene mechanisms, discoverability checks, cross-reference integrity, governance-staleness detection, memory health, content-drift detection, structural-legibility, security posture and skill-architecture refinement.

### Step 8b: Post-run skill self-refinement

After execution completes, ask: "Did running this skill surface any defects, friction or improvements in the skill itself?" Capture as Layer 4 candidates. These propose modifications to this SKILL.md, distinct from menu-item candidates. Findings flow into Step 9 under their own category.

### Step 9: Synthesize the decision board

Aggregate the opportunistic capture, the research rotation, the self-refinement findings and every fork parked during execution into the four-bucket board. Three Solutions throughout follows [[Council Chamber/Protocols/Governance/Three Solutions Rule]]. Apply the recommendation bar: if you would not recommend a candidate, route it to Patterns Noticed as a one-liner rather than a decision. Every recommended candidate carries a proposed tier and a proposed autonomy level.

### Step 10: Write log entry and decision board, then close

Append a run entry at the top of the log body. Update the frontmatter: set new last-run dates in `menu_state` for items that ran, set new last-run dates in `research_state` for each category researched, increment `run_counter`, set `last_run`. Leave `auto_execute_threshold` unchanged unless a return-session ratified climb moved it.

Write the four-bucket board to `decision-board.md`, replacing the prior run's open decisions. Present the same board as the closing output.

Closing line: "Autonomous Improvement Session complete. [N] items ran. Decision board: [A] approvals and questions, [B] menu candidates, [C] proposed plans. Log and board updated."

---

## The Climb and Return-Session Flow (Sovereign-triggered)

The Sovereign's board answers encode forward. This is the learning loop. The skill never modifies its own SKILL.md, menu or autonomy posture autonomously. Every move below is an explicit, Sovereign-triggered edit cycle.

**Bucket 2: Approvals and questions (implemented immediately).** Apply the decision to the parked work. If the answer carries a forward rule, encode it. A rule that turns a recurring judgment fork into a deterministic step is the recursion working, and it can move an item from Level 3 to Level 2, or Level 2 to Level 1.

**Bucket 3: Accepted menu candidate (woven in).** Add the new menu item with execution spec, eligibility rule, output artifact and its assigned `autonomy` level, under the correct tier. Seed `menu_state` with today's date (or null for immediate eligibility). Document the promotion in the run entry.

**Accepted skill self-refinement.** Edit this SKILL.md to apply it. Document it in the Refinements section with date and source-run reference.

**Bucket 4: Approved Pending Plan (drafted and scheduled).** On a "approve plan creation?", draft the full Pending Plan per [[Council Chamber/Protocols/Planning/Pending Plan Implementation Protocol]], using the board cliff-note as the seed. The plan starts at `status: proposed`. Plan creation is authorized; execution of the drafted plan is not, and runs in its own dedicated session later.

### Autonomy-Level Move (the climb)

An item's `autonomy` level lowers, or the skill-level `auto_execute_threshold` rises, only through a ratified decision. The threshold widens from proven workflows, never from projection.

Every climb passes the **Flywheel Three Laws coherence check** before it lands: does this move serve Smooth Transition, Easier Rotation and Increased Output? These are the mechanical laws of the flywheel, canonical in [[Council Chamber/Governance/Flywheel Integration Standard]], and they are the correct test for a change to a flywheel mechanism. The skill is itself a flywheel, so a climb is judged by whether it smooths a handoff, eases the next rotation and raises real output. The safety guard sits in the Permanent Floor, not here: a move that would touch an outward surface, delete, move a canonical file or self-edit breaches the floor and fails regardless of how high the threshold has climbed. The Flywheel laws test the climb's value. The Permanent Floor tests its safety.

---

## Future Direction: Scheduling (not v1)

v1 is Sovereign-invoked only. Scheduling is a future direction, gated on a track record of clean review-and-climb cycles, never a date. The likely shape, when it arrives, is several runs per week, each with a different priority weighting and a different subset of research categories. The threshold model and the priority score already carry the machinery; scheduling just sets the cadence.

---

## Log Structure

Single file at `Council Chamber/Logs/Autonomous Improvement Log.md`.

**Frontmatter:**

```yaml
---
status: active
run_counter: N
last_run: YYYY-MM-DD
auto_execute_threshold: 1   # the line; items at or below auto-execute, above park to the board
research_state:             # category ID to last-researched date; rotation picks least-recent
  R1:
  # ... through R9
priority_flags: []          # item IDs flagged to lift in Step 3 selection
menu_state:
  T1-1: YYYY-MM-DD
  # ... entries added as items run for the first time
---
```

**Body:** Reverse-chronological run entries. Newest at the top.

---

## Constraints (the Hard Ceiling)

This section is the Hard Ceiling. It holds regardless of how high `auto_execute_threshold` climbs. No ratified climb, accepted candidate or forward rule may breach the permanent floor.

The ceiling is drawn by **action type, not location**. Destructive, voice-bound and outward-broadcast actions stay forbidden forever. Additive, reversible, build-verified correction opens as a gated lane that earns its way toward gateless operation one proven class at a time.

### The Permanent Floor (never climbs)

No threshold, climb, candidate or forward rule breaches these. Ever.

- No change to copy, voice or content prose on any live surface. Outward words are voice-bound.
- No deletions of anything, in the vault or any external repo.
- No moves of canonical governance files: codices, the Constitution, the Charter, protocols, canonical content. Those require Sovereign approval. This does NOT cover implemented Pending Plan archival. Moving a `status: implemented` plan from the active chamber to the Vault archive is operational lifecycle closure, not a governance move: it stays inside the vault, it is reversible, it deletes nothing and it changes no governance. T2-9 executes that archival autonomously with a move-audit sweep and an index regen.
- No outward broadcasts. Email sends, social posts, anything that speaks to the world.
- No direct push to any main branch. Every external change goes through a build-verified pull request.
- No self-modification. The skill never edits its own menu, threshold, autonomy levels, this SKILL.md, your auto-memory `MEMORY.md` or your settings file autonomously. Those move only after the Sovereign ratifies a decision-board entry.

### The Graduated Lane (opens, earns its climb)

Two classes of action, both additive or corrective, never voice-bound, always reversible.

- **Read and route.** Reading reports and routing them into lanes. Fully safe.
- **Additive or corrective technical fixes to external repos**, executed as build-verified pull requests. Opens one proven class at a time, only after the Sovereign authorizes it.

A fix enters at Level 3, propose-only. When the Sovereign authorizes a class, the form is a branch plus a pull request with a green build. The Sovereign merges. A narrow class with a clean track record climbs to auto-open PR, then to auto-merge on green build, one ratified step at a time. The part that climbs away is the merge click, never the build gate.

### Operational Constraints

- Sovereign-invoked only. The skill never auto-fires and never schedules itself.
- All Tier 1 items are additive edits or in-place corrections traceable via git. All Tier 2 items are read-only scans.
- Discovery candidates that would breach the permanent floor stay in Patterns Noticed. They are never surfaced as menu candidates.
- If any Tier 1 item errors, log the error, skip the item, continue. Do not halt the whole session for one failure.
- If the log file is missing or malformed at Step 1, halt. State integrity is foundational.

---

## External Orientation

> [!info] Ambassador Doctrine Active
> This skill operates under the [[Council Chamber/Protocols/Governance/Ambassador Doctrine]].
> Primary strategy: Saṃśraya. The skill exists to fortify the ecosystem. Every action is reversible, every artifact is logged, every outward surface is gated. The log is the durable ledger of the skill's behavior over time.
> Secondary: Āsana. Tier 2 scans and the research rotation are intelligence-gathering posture. Observe fully before recommending. Findings return to the Sovereign; the skill never acts on its own observations beyond menu-bounded execution.
> External surfaces touched (read-only by default): outbound URLs for link-rot scans (HEAD or short GET only, no auth bypass) and, under the graduated lane, external repos as a write-via-PR surface (additive or corrective fixes only, never a direct push to a main branch, never a copy or voice change).

---

## Model Routing

Set `model` explicitly on every Agent call. Subagents inherit nothing.

| Step | Default model | Rationale |
|---|---|---|
| Step 1: Load state | Haiku | Mechanical YAML read with known schema. |
| Step 2: Compute eligibility | Haiku | Deterministic date math, no judgment. |
| Step 3: Select items by priority | Sonnet | Light prioritization across heterogeneous items. |
| Step 4: Announce plan | Opus | Sovereign-facing prose with capacity framing. |
| Tier 1 mechanical items (T1-1, T1-2, T1-4) | Haiku | Mechanical path and slug corrections. |
| Tier 1 judgment items (T1-3 anti-AI) | Sonnet | Pattern-match with light inline-versus-fix judgment. |
| Step 7: Tier 2 worker dispatch | Sonnet | Read-only scans with structured synthesis. |
| Step 6 / 8b: opportunistic capture and self-refinement | Opus | Reflection on what was just observed; judgment-dense. |
| Step 8: research rotation workers | Sonnet | Parallel research workers per category. |
| Step 9: synthesize the decision board | Opus | Voice-aware classification, tier and autonomy judgment. |
| Step 10: write log entry and board | Sonnet | Structured prose with state update. |

---

## Planning Mode Rule

Status is `active`. Execution is authorized without per-invocation approval. Sovereign invocation is the only gate. Menu items at or below `auto_execute_threshold` are pre-approved by design (the Hard Ceiling enforces the gate posture). New menu items, autonomy-level climbs and threshold moves require Sovereign ratification through the decision board before they land.

---

## Refinements

%%
Date-stamped entries of calibration notes and rules to prevent recurrence.
%%

- Skill ported from the source ecosystem in template form. The starter menu is generic vault-internal hygiene (wikilink integrity, index regeneration, anti-AI sweep, slug normalization, codices-index completeness, superseded-artifact sweep, plus read-only scans). The three-site routine-report triage from the source became an optional external-surface extension that stays off until you run external repos. The architecture is preserved intact: the do-not-ask Operating Principle for safe hygiene, the Permanent Floor, the threshold model, the four-bucket decision board, the two speeds, the research rotation and the climb. Adapt the starter menu and research categories to what your ecosystem actually holds during onboarding.
