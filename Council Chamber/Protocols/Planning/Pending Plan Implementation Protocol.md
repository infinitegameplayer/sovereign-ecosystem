---
status: active
version: 1.0
tier: foundational
contrast_not:
false_twins:
anti_patterns:
boundary_conditions:
clarity_triggers:
---

# Pending Plan Implementation Protocol

Purpose: Define how a single Pending Plan is reviewed, implemented and documented using the Pending Plan note itself as the execution context and breadcrumb record.

Scope: One Pending Plan selected for active implementation in a focused session (or multi-session implementation sequence).

## Principles
- The Pending Plan note is the source of implementation context and breadcrumb history.
- Implementation may occur across multiple runs; partial delivery is normal.
- Breadcrumbs, links and constraints should be visible before execution begins.
- {{AI_INTERFACE_NAME}} may implement approved scope, but status/archival changes remain approval-gated.
- Preserve traceability from `proposed` -> `approved` -> `ready-for-execution` -> `implemented` -> archive.

## Preconditions
- A specific Pending Plan is selected.
- There is explicit approval to execute some or all of the plan.
- The implementation scope for this run is defined (even if partial).

## Inputs
- Target Pending Plan note
- Approved scope for this run
- Current `decision_gate`
- Relevant breadcrumbs (applicability updates, partial implementation notes, reconciliation notes)
- Optional `support_files_path` and support-file disposition constraints
- Evidence links and dependencies
- Approval boundaries (what {{AI_INTERFACE_NAME}} may and may not change)

## Re-Entry Fields (Required for Multi-Session Plans)
For plans spanning 2 or more sessions or phases, these fields are required before execution begins in each subsequent session. For single-session plans, they are optional.
- `Current State`
- `Decision Point`
- `Next Move`
- `Re-Entry Context`

If these fields are missing on a multi-session plan, populate them from the breadcrumb history before proceeding with execution.

## Optional Command-Surface Candidate Guidance
When a `PendingPlan` may need to surface into `Sovereign Command`, an optional note section may be used:
- `Command Surface Candidate (Optional)`

Use it only when there is one clear approval or implementation item that may deserve promotion.
Keep it to one line so the plan note stays the source of truth and `Sovereign Command` stays selective.

## Implementation Workflow
1. Select and Re-anchor the Pending Plan
   - Read `Proposed Changes`, `Risk Level`, `Affected Areas`, `Current State`, `decision_gate` and breadcrumb sections.
   - Organic completion check: scan the Activity Log for recent entries that match the proposed scope. If multiple sessions have already delivered the core signals organically, confirm whether formal gate execution is still warranted before committing to a gate plan.
   - If the newly requested work appears to overlap another PendingPlan, pause and propose merge/scope-split before execution.
2. Build Implementation Snapshot
   - Fill or refresh `Implementation Snapshot (When Executing)`.
   - Identify dependencies, blockers and relevant links to review first.
3. Confirm Approved Execution Scope
   - Document what is in scope vs out of scope for this run.
4. Execute Approved Work
   - Implement changes in the Sovereign Ecosystem and/or record field actions affecting implementation.
5. Log Implementation Actions
   - Add concise entries to `Implementation Actions (Execution Log)`.
6. Capture Outcome
   - Record what was implemented, what remains and proposed `implementation_state`.
7. Propose Resolution (if warranted)
   - Propose status update / archival / remaining scope changes (approval-gated).
   - If the plan has a plan-specific `support_files_path`, propose support-file disposition as part of closure readiness:
     - move durable artifacts to a canonical Sovereign Ecosystem home
     - move true provenance material to a Vault location if worth keeping
     - delete temporary working files by default
8. Update Evidence / Implementation Refs
   - Add links to changed artifacts, session logs, quests, experiments or related notes.
9. Readback + Approval
   - Summarize implemented scope, remaining scope and proposed status changes.
10. Apply Approved Status / Archival Changes
   - Only after explicit approval.
   - Archival pattern: move the plan file from `Council Chamber/Pending Plans/` to `Vault (Archive)/Pending Plans/`, then edit the moved file to update status fields. Do not write a new archive copy and delete the original.
   - Support files policy review: at archival time, confirm `support_files_policy` in the plan frontmatter. Transient = clean up the support files folder. Durable = move the folder to `Vault (Archive)/Pending Plans/Support Files/`. Update the policy field in the archived plan if it was set incorrectly.
   - `status: implemented` is the terminal status. Archival is a lifecycle event that happens after `implemented`; the plan moves to the Vault with status unchanged at `implemented`. Clear the associated support-files subtree from `Council Chamber/Pending Plans/Support Files/` before the Vault move.
11. Sync Pending Plans Index (when Pending Plans changed)
   - Recommended after approved status/archive/move changes: run `Council Chamber/Tools/Pending Plans Index Sync.ps1`.

## Recommended Question Set (Implementation Conversation)
- What part of this Pending Plan is approved to implement right now?
- What should stay out of scope in this run?
- What breadcrumbs or prior partial implementations matter before we start?
- What dependencies or blockers should be considered first?
- What changed during implementation?
- What was actually implemented vs deferred?
- Should `status` now be `approved` or `ready-for-execution` because approved implementation has begun?
- What should `implementation_state` be now?
- Do we propose `status` change or keep status unchanged pending approval?

## Implementation State Guidance (using existing status + `implementation_state`)
Use `status` for the plan lifecycle and `implementation_state` for implementation nuance.
Use `implemented` when approved scope is done. Archival is the subsequent lifecycle event, not a separate status value.

### Status Lifecycle Rule
- `status: proposed`
  - Use when the plan is written and scoped but not yet approved.
- `status: approved`
  - Use once the direction is approved and decisions are locked, but the implementation plan has not been written yet.
- `status: ready-for-execution`
  - Use once the implementation plan is written and execution is authorized.
- `status: implemented`
  - Use when the plan's approved scope is fully shipped and the activity log is final. Archival to `Vault (Archive)/Pending Plans/` follows as a lifecycle event; the status stays `implemented` in the Vault.
- Do not leave a plan at `proposed` once approved execution is actively happening. If execution is about to begin and status is still `proposed`, stop and prompt Sovereign for approval before proceeding.
- Do not keep a plan at `ready-for-execution` once its approved scope is fully implemented.
- Archival is not a status value. A plan in the Vault retains `status: implemented`.
- If downstream work was intentionally split into other Pending Plans, the original plan should still advance to `implemented` once its own approved scope is done.

### Support Files Rule
- `Council Chamber/Pending Plans/Support Files/` is a transient working area, not a permanent storage layer.
- It may be used by `proposed`, `approved` and `ready-for-execution` Pending Plans as temporary execution support.
- Use a plan-specific `support_files_path` only for temporary drafts, source exports, mapping scratchpads or other execution-only support material.
- Durable markdown notes should be created directly in their real Sovereign Ecosystem home whenever possible.
- A plan may remain at `implemented` briefly while its support-files disposition is being finalized, but those materials should not linger once archival is approved.
- When a plan reaches `implemented` or is being prepared for archival, run a support-files disposition check for that plan's folder only.
- No plan should move to the Vault while its associated support files are still lingering in `Council Chamber/Pending Plans/Support Files/`.

Recommended `implementation_state` values:
- `proposed`
- `in_progress`
- `partially_implemented`
- `implemented_pending_approval`
- `implemented`
- `blocked`
- `superseded`

## Gate Notation (Optional, Multi-Session Plans)

**When to use:** Plans that span 3 or more sessions, or plans with clear sequential dependencies between work blocks where a later block cannot begin until an earlier one is approved. Small plans do not need gates. The existing flat format remains fully valid.

**Gate format:**

```
### Gate N: [Name]

**Scope:** What this gate covers. What is explicitly out of scope.
**Entry condition:** What must be true before this gate begins.
**Exit condition:** What must be true for this gate to close.
**Status:** pending | in_progress | complete
**Handoff note:** (Written at gate completion) One short paragraph orienting the next session: what was decided, what the next gate opens with, any live constraints.
```

**Session Boundary Close Block (required for multi-session gates):**
At the end of each execution run within a gate, append to the plan note immediately after the most recent `Implementation Actions` entry:

```
### Session Boundary: YYYY-MM-DD
**Completed this run:** [one sentence]
**Decision point:** [any approval or gate holding next session]
**Next move:** [first action next session picks up]
**Live constraints:** [blockers, dependencies, anything that changed]
```

This block is the re-entry anchor. The next session reads it first.

**Gate status tracking:** Each gate's status line is updated in place as work progresses. The main Activity Log records gate transitions with `[Decision]` or `[AI]` tags as appropriate.

**Approval gate convention:** Gate transitions follow the same approval pattern as the overall plan. Sovereign approval closes a gate and opens the next unless the plan explicitly delegates that authority within a gate.

## Plan Note Template

Use these templates when creating new Pending Plans. Select the tier that matches the plan's scope.

### Tier 1: Focused Plan
For single-session, low complexity plans with 1-3 implementation steps.

```yaml
---
status: proposed
created: YYYY-MM-DD
source: [[...]]
links: []
timing: soon
decision_gate: [condition for approval]
risk_level: low
affected_areas: [area1, area2]
implementation_state: proposed
last_reviewed: YYYY-MM-DD
support_files_path:
support_files_policy:
---
```

Required sections:
```
## Proposed Changes
## Risk Level
## Affected Areas
## PendingPlan Activity Log
## Applicability Updates
## Evidence / Implementation Refs
## Reconciliation Notes
## Implementation Snapshot (When Executing)
## Approved Execution Scope (This Run)
## Implementation Actions (Execution Log)
## Implementation Outcome (This Run)
```

### Tier 2: Arc Plan
For multi-session, phased or complex plans (3+ sessions or gates).

All Tier 1 frontmatter and sections, plus:

```yaml
# Additional frontmatter fields:
support_files_path: [path if needed]
support_files_policy: transient
```

Additional required sections:
```
## Current State
## Decision Point
## Next Move
## Re-Entry Context
## [Development Arc / Session Sequence / Phase structure as appropriate]
## Arc Closeout Protocol
## Support Files
## Partial Implementation Notes
```

### Template Notes
- `ring` field: do not include. No defined value set.
- `Planning Mode Rule` section: do not include in plan notes. It lives in the skill only.
- `Breadcrumbs` / `Breadcrumb Writebacks`: use `PendingPlan Activity Log` as the canonical section name
- `Applicability Updates` and `Reconciliation Notes` are standard sections in both tiers

## Relationship to Other Pending Plan Protocols
- [[Council Chamber/Protocols/Planning/Pending Plan Progress Update Protocol]] is for breadcrumb updates and applicability changes (often via Session Closeout).
- [[Council Chamber/Protocols/Planning/Pending Plan Reconciliation Protocol]] is for cross-session scan/classification.
- This protocol is for active execution of one selected Pending Plan.

## Approval Gate
- {{AI_INTERFACE_NAME}} may prepare the implementation snapshot, execute approved scope and write execution breadcrumbs.
- Status changes, archival moves and closure actions require explicit approval.
- When approved, `status: implemented` marks the plan as shipped. Archival to the Vault follows as a separate lifecycle step or via a later Batch Archival run.
- `Council Chamber/Pending Plans/Index.md` changes remain approval-gated when tied to status/archival changes.

## Outputs
- Updated Pending Plan note with implementation snapshot, execution log and outcome summary
- Implemented artifacts/changes (if in scope and approved)
- Proposal for status/archival/remaining scope updates (if relevant)

## Translation to Action
### What This Clarifies
- Pending Plan implementation should keep execution context inside the plan note so progress remains resumable and traceable.
- Partial implementation is normal, and the protocol is designed to support incremental movement rather than one-shot completion.
- The protocol's main job is to reduce fragmentation between approval, execution and breadcrumb history.

### What Changes Now
- When implementing a `PendingPlan`, explicitly preserve re-entry context and outcome clarity inside the note.
- Execution sessions should favor narrow approved scope, visible logging and clear remaining-scope readback.
- Implementation can now be read not just as task execution, but as continuity-preserving note shaping.

### Next Move
- Use this protocol as the operational guardrail when executing future `PendingPlans`, especially longer-running or partial implementations.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Contrast fields required.
- Footer internal contrast block required.

<!--
Internal Contrast Layer
- Avoid treating Pending Plan implementation as one-shot; partial implementation is a normal steady-state.
- Keep the execution context in the plan note to reduce fragmentation and re-derivation.
-->
