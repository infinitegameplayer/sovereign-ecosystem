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

# Pending Plan Progress Update Protocol

Purpose: Define a lightweight, conversation-driven process for updating a single Pending Plan with breadcrumb-level progress, relevance changes and reconciliation notes.

Scope: One Pending Plan note per update session, especially when work happens elsewhere (in-world or Sovereign Ecosystem/AI) that affects the plan's applicability, timing or implementation state.

## Principles
- Pending Plans can accumulate relevant progress before formal approval/execution.
- Breadcrumbs should describe what changed, not silently mutate plan status.
- Reconciliation remains proposal-only until explicit approval.
- One Pending Plan per update conversation preserves clarity.
- Preserve traceability across naming changes, refactors and partial implementations.
- If approved execution has started, the plan should generally move from `proposed` to `active` rather than lingering in a proposal state.
- If a plan's approved scope is finished but it has not been moved yet, it should generally move to `complete` rather than directly to `archived`.

## Triggers
- A session produced changes that partially satisfy or supersede a Pending Plan.
- In-world actions changed timing, feasibility or scope.
- A Pending Plan is stale and needs a reality check.
- Session Closeout or Pending Plan Reconciliation identifies overlap.

## Inputs
- Target Pending Plan note
- Changes since last review (field + Sovereign Ecosystem/AI)
- Evidence/artifact links
- Current relevance (still needed / partially implemented / superseded / blocked)
- Proposed next decision gate or review timing

## Optional Re-Entry Field Guidance
For complex, long-running or multi-session plans, the following optional note sections are recommended because they improve resumability and context recovery:
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

## Conversation Workflow ({{AI_INTERFACE_NAME}}-Led)
1. Select the Pending Plan
   - Confirm target note, status and current decision gate.
2. Re-anchor the Plan
   - Read back `Proposed Changes`, `Risk Level`, `Affected Areas` and timing.
3. Capture What Changed (Field + AI)
   - Ask what happened in the physical world and what changed in the Sovereign Ecosystem/AI layer.
4. Assess Applicability
   - Determine whether the plan is still fully relevant, partially satisfied, blocked or superseded.
5. Record Partial Implementation (if applicable)
   - Separate implemented scope from remaining scope.
6. Capture Evidence
   - Add links to artifacts, protocols, quests, experiments or session logs.
7. Refresh Reconciliation Notes
   - Propose a candidate resolution (Implemented / Partially Implemented / Not Implemented).
   - Do not change status or archive without approval.
8. Readback + Approval
   - Summarize proposed note updates before writing.
9. Apply Updates
   - Update the Pending Plan note after approval.

## Recommended Question Set (Minimum)
- What changed that affects this Pending Plan?
- Did any in-world progress make this plan more urgent, less relevant or partially fulfilled?
- Did any Sovereign Ecosystem/AI changes implement part of this already?
- What part is now done, and what part remains?
- What evidence should be linked?
- Is the risk level, timing or decision gate different now?
- Should reconciliation classify this as Implemented, Partially Implemented or Not Implemented (proposal-only)?

## Update Mapping (Pending Plan Note Sections)
- `## PendingPlan Activity Log`
- `## Applicability Updates (What Changed That Touches This Plan)`
- `## Partial Implementation Notes`
- `## Evidence / Implementation Refs`
- `## Reconciliation Notes (Proposal-Only)`
- Frontmatter (as needed): `timing`, `decision_gate`, `risk_level`, `affected_areas`, `implementation_state`, `last_reviewed`
- When applicable, also refresh `status`:
  - `proposed` before execution
  - `active` during approved implementation
  - `complete` after approved scope is done but before Vault move
  - `archived` only after approved closure and actual Vault move

## Dataview-Friendly Tag Convention (Optional, Recommended)
- `#field` for in-world changes affecting the plan
- `#ai` for Sovereign Ecosystem/AI changes affecting the plan
- `#learning` for scope/risk/timing insights
- `#decision` for approval or reconciliation decisions

## Relationship to Pending Plan Reconciliation
- This protocol updates a single Pending Plan note with breadcrumbs and proposal-ready context.
- [[Council Chamber/Protocols/Planning/Pending Plan Reconciliation Protocol]] performs broader cross-session scanning and candidate matching.
- Use this protocol before or after reconciliation when one plan needs a deeper writeback.

## Approval Gate
- {{AI_INTERFACE_NAME}} may draft breadcrumb updates and reconciliation notes.
- Status changes, archival moves and plan closure actions require explicit approval.

## Outputs
- Updated Pending Plan note with breadcrumb trail and reconciliation-ready context
- Clearer evidence links and partial implementation notes
- Proposal-only resolution recommendation

## Translation to Action
### What This Clarifies
- Progress updates are not just passive breadcrumbs; they are the lightweight mechanism that keeps `PendingPlans` alive and reality-aligned between formal implementation runs.
- The protocol is primarily about preserving relevance, scope clarity and reconciliation readiness.

### What Changes Now
- When a plan changes indirectly, the note should be updated before it goes stale.
- Progress updates should keep the plan easy to re-enter by making changed conditions explicit.
- The protocol can serve as a low-friction maintenance layer that reduces later re-derivation.

### Next Move
- Use this protocol whenever work elsewhere materially changes a `PendingPlan` even if formal execution has not started.
- If the re-entry fields continue proving useful, later protocol refinement may explicitly call them out as a recommended update pattern.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Contrast fields required.
- Footer internal contrast block required.

<!--
Internal Contrast Layer
- Prevent Pending Plans from going stale when implementation happens indirectly.
- Keep progress notes lightweight so users will actually maintain them.
-->















