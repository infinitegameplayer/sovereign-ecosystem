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

# Pending Plan Reconciliation Protocol

Purpose: Prevent drift by reconciling Pending Plans against work that was implemented without explicit closure.

Scope: All Active Chambers and governance/system changes.

## Triggers
- Governance document changes (protocols, skills, codices, charters, templates).
- New systems, workflows or automation added.
- Session Closeout for any foundational or cross-domain change.

## Workflow
1. Identify changes from the session (new or updated artifacts).
2. Locate candidate Pending Plans:
   - Match on title keywords.
   - Match on `links`, `source` and related domains.
   - Scan `Council Chamber/Pending Plans/Index.md` and any unindexed Pending Plans.
   - Optional: run `Council Chamber/Tools/Pending Plan Reconciliation Sweep.ps1` to generate candidate matches using keywords derived from artifacts changed this session (titles, links or domains).
   - When proposing a new PendingPlan (including reclassification from another object), first check for overlapping existing PendingPlans to avoid duplicate or competing scopes.
3. For each candidate, classify outcome:
   - Implemented: fully delivered by the new/updated artifact(s).
   - Partially Implemented: core intent delivered, but gaps remain.
   - Not Implemented: still pending or blocked.
4. Propose resolution (no automatic changes):
   - Implemented: propose `status: complete` if the plan will remain in place briefly, or propose move to Vault with archive metadata if archival is being approved now.
   - Partially Implemented: propose updates to remaining scope and decision gate.
   - Not Implemented: propose no change; update decision gate if needed.
   - Write breadcrumb context into each materially affected PendingPlan (activity/applicability/partial implementation/evidence/reconciliation notes), using [[Council Chamber/Protocols/Planning/Pending Plan Progress Update Protocol]] as the writeback subroutine when helpful.
   - For Pending Plans with `support_files_path`, include a support-files readiness check:
     - live support files are valid while the plan is `proposed` or `active`, as long as they remain temporary
     - if the plan-specific support folder still contains temporary materials, the plan may remain `complete` but is not archive-ready
     - if the folder has been cleared or moved to Vault provenance, the plan is archive-ready
5. Obtain Sovereign approval before any moves or status changes.
6. Apply approved changes and sync `Council Chamber/Pending Plans/Index.md`.
   - Recommended: run `Council Chamber/Tools/Pending Plans Index Sync.ps1` after approved PendingPlan moves/status changes.
7. Log reconciliation summary in Session Closeout and AI Interface Change Log.

## Approval Gate
- Sovereign approval required for any archival, status change or plan updates.
- Breadcrumb writebacks that preserve traceability (without status/archive changes) are allowed during reconciliation and session closeout.

## Resolution Metadata
For complete (not-yet-archived) Pending Plans, add:
- `status: complete`
- `implemented_on: YYYY-MM-DD`
- `implementation_refs: [[...]]`
- Keep the plan in `Council Chamber/Pending Plans/` only until the next approved archival pass
- Batch Archival may use `status: complete` as a default scan criterion
- If `support_files_path` exists, clear or relocate that plan-specific support subtree before archiving

For archived Pending Plans, add:
- `status: archived`
- `archived: YYYY-MM-DD`
- `implemented_on: YYYY-MM-DD`
- `implementation_refs: [[...]]`
- `tags: [archive]`

For partially implemented Pending Plans, add:
- `status: proposed` (or `status: active` if execution has started)
- `implementation_refs: [[...]]`
- `remaining_scope:` summary
- Updated `decision_gate`
- Optional breadcrumb sections updated (Activity Log, Applicability Updates, Partial Implementation Notes, Reconciliation Notes)

For actively implemented Pending Plans, prefer:
- `status: active`
- `implementation_state: in_progress` or `partially_implemented`
- Keep the plan in `Council Chamber/Pending Plans/` until its approved scope is actually complete

For fully implemented Pending Plans whose remaining ideas were split into other plans:
- Treat the original plan as implemented for its approved scope
- Move it to `complete`, then archive it when the Vault move is approved or when a later Batch Archival pass executes
- Ensure any associated support-files subtree is cleared from `Council Chamber/Pending Plans/Support Files/` before `status: archived`

## Breadcrumb Writeback Rule (Default)
- Reconciliation should update PendingPlan breadcrumb sections when meaningful overlap is found, even if no status change is approved.
- These writebacks are traceability updates, not resolution actions.
- Status, archival and index changes remain approval-gated.

## Classification Drift Check (Quest vs PendingPlan)
- During reconciliation, flag notes that look misclassified (e.g., Sovereign Ecosystem implementation/governance work tracked as a Quest or personal/field challenge work tracked as a PendingPlan).
- Do not auto-convert object type/classification.
- Propose reclassification with explicit approval, preserving breadcrumb links between the original note and the replacement note.
- Before creating a replacement PendingPlan, review existing PendingPlans for overlap and propose merge/scope-split options when applicable.

## Domain Rules
- Governance artifacts must be archived under `Vault (Archive)/Domains/Governance/Archive/`.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Contrast fields required.
- Footer internal contrast block required.

<!--
Internal Contrast Layer
- Note ambiguity when intent is only partially fulfilled by a change.
-->














