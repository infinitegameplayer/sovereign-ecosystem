---
name: Pending Plan Progress Update
description: Guide a short conversation that updates one Pending Plan with breadcrumbs, applicability changes, partial implementation notes and reconciliation-ready context.
status: draft
version: 0.1
---

# Pending Plan Progress Update Skill

Purpose: Guide a short conversation that updates one Pending Plan with breadcrumbs, applicability changes, partial implementation notes and reconciliation-ready context.
Trigger: User wants to review/update a specific Pending Plan after in-world or Sovereign Ecosystem/AI changes, or during closeout/reconciliation.
Inputs: Target Pending Plan link, what changed (field + AI), evidence links, relevance/implementation state, updated timing/decision gate.
Outputs: Updated Pending Plan note with breadcrumb trail and proposal-only reconciliation notes.
Status: draft
Related Protocols/Codices: [[Council Chamber/Protocols/Planning/Pending Plan Progress Update Protocol]], [[Council Chamber/Protocols/Planning/Pending Plan Reconciliation Protocol]], [[Council Chamber/Protocols/Session/Session Closeout Protocol]], [[Council Chamber/Codices/Contrast Layer Codex]]

## Steps
1. Confirm the target Pending Plan and read back `Proposed Changes`, `Risk Level`, `Affected Areas`, `timing` and `decision_gate`.
2. Ask what changed in the physical world and what changed in the Sovereign Ecosystem/AI layer.
3. Ask whether any of the plan is already implemented indirectly.
4. Separate implemented scope vs remaining scope and record partial implementation notes.
5. Add evidence links and reconciliation notes (proposal-only).
6. Refresh timing / decision gate / implementation state if needed.
7. Read back the proposed updates and apply only with approval.

## Quick Entry Tags (Optional, Dataview-Friendly)
- `#field`
- `#ai`
- `#learning`
- `#decision`

## Planning Mode Rule
- If status is proposed or draft, execution is not authorized.
