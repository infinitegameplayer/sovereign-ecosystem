---
status: draft
version: 0.1
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
- Preserve traceability from `proposed` -> `active` -> `complete` -> archive.

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

## Optional Re-Entry Field Guidance
For complex, long-running or multi-session plans, the following optional note sections are recommended because they reduce restart friction:
- `Current State`
- `Decision Point`
- `Next Move`
- `Re-Entry Context`

These are optional support fields, not mandatory requirements for every `PendingPlan`.

## Optional Command-Surface Candidate Guidance
When a `PendingPlan` may need to surface into `Sovereign Command`, an optional note section may be used:
- `Command Surface Candidate (Optional)`

Use it only when there is one clear approval or implementation item that may deserve promotion.
Keep it to one line so the plan note stays the source of truth and `Sovereign Command` stays selective.

## Implementation Workflow
1. Select and Re-anchor the Pending Plan
   - Read `Proposed Changes`, `Risk Level`, `Affected Areas`, `Current State`, `decision_gate` and breadcrumb sections.
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
   - `status: archived` should only be applied after the Pending Plan is in the Vault and its associated support-files subtree has been cleared from `Council Chamber/Pending Plans/Support Files/`.
11. Sync Pending Plans Index (when Pending Plans changed)
   - Recommended after approved status/archive/move changes: run `Council Chamber/Tools/Pending Plans Index Sync.ps1`.

## Recommended Question Set (Implementation Conversation)
- What part of this Pending Plan is approved to implement right now?
- What should stay out of scope in this run?
- What breadcrumbs or prior partial implementations matter before we start?
- What dependencies or blockers should be considered first?
- What changed during implementation?
- What was actually implemented vs deferred?
- Should `status` now be `active` because approved implementation has begun?
- What should `implementation_state` be now?
- Do we propose `status` change or keep status unchanged pending approval?

## Implementation State Guidance (using existing status + `implementation_state`)
Use `status` for proposal/active/archive lifecycle and `implementation_state` for implementation nuance.
Use `complete` as the short pre-archive status when approved scope is done but the Vault move has not happened yet.

### Status Lifecycle Rule
- `status: proposed`
  - Use when the plan is awaiting approval and no approved execution has started.
- `status: active`
  - Use once explicit execution approval is granted and implementation is underway across one or more runs.
- `status: complete`
  - Use when the plan's approved scope is fully implemented and it is ready for archival, but it has not yet been moved to `Vault (Archive)/Pending Plans/`.
- `status: archived`
  - Use only after the plan has been moved to `Vault (Archive)/Pending Plans/`.
- Do not leave a plan at `proposed` once approved implementation is actively happening.
- Do not keep a plan `active` once its approved scope is fully implemented.
- Do not use `archived` before the plan is actually in the Vault.
- If downstream work was intentionally split into other Pending Plans, the original plan should still move to `complete` and then to `archived` once its own approved scope is done.

### Support Files Rule
- `Council Chamber/Pending Plans/Support Files/` is a transient working area, not a permanent storage layer.
- It may be used by both `proposed` and `active` Pending Plans as temporary execution support.
- Use a plan-specific `support_files_path` only for temporary drafts, source exports, mapping scratchpads or other execution-only support material.
- Durable markdown notes should be created directly in their real Sovereign Ecosystem home whenever possible.
- A plan may remain `complete` briefly while its support-files disposition is being finalized, but those materials should not linger once archival is approved.
- When a plan reaches `complete` or is being prepared for archival, run a support-files disposition check for that plan's folder only.
- No plan should move to `archived` while its associated support files are still lingering in `Council Chamber/Pending Plans/Support Files/`.

Recommended `implementation_state` values:
- `proposed`
- `in_progress`
- `partially_implemented`
- `implemented_pending_approval`
- `implemented`
- `blocked`
- `superseded`

## Relationship to Other Pending Plan Protocols
- [[Council Chamber/Protocols/Planning/Pending Plan Progress Update Protocol]] is for breadcrumb updates and applicability changes (often via Session Closeout).
- [[Council Chamber/Protocols/Planning/Pending Plan Reconciliation Protocol]] is for cross-session scan/classification.
- This protocol is for active execution of one selected Pending Plan.

## Approval Gate
- {{AI_INTERFACE_NAME}} may prepare the implementation snapshot, execute approved scope and write execution breadcrumbs.
- Status changes, archival moves and closure actions require explicit approval.
- When approved, `status: complete` may be used as a temporary holding state before a later archival pass or Batch Archival run.
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
- When implementing a `PendingPlan`, it is worth explicitly preserving re-entry context and outcome clarity inside the note.
- Execution sessions should favor narrow approved scope, visible logging and clear remaining-scope readback.
- Implementation can now be read not just as task execution, but as continuity-preserving note shaping.

### Next Move
- Use this protocol as the operational guardrail when executing future `PendingPlans`, especially longer-running or partial implementations.
- If the optional re-entry fields keep proving useful, consider weaving that convention more explicitly into the protocol in a later approved refinement pass.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Contrast fields required.
- Footer internal contrast block required.

<!--
Internal Contrast Layer
- Avoid treating Pending Plan implementation as one-shot; partial implementation is a normal steady-state.
- Keep the execution context in the plan note to reduce fragmentation and re-derivation.
-->















