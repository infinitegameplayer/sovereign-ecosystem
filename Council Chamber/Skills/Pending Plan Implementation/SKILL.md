---
name: Pending Plan Implementation
description: Execute an approved Pending Plan (or approved subset) using the Pending Plan note as the implementation context, breadcrumb record and outcome summary.
status: draft
version: 0.1
---

# Pending Plan Implementation Skill

Purpose: Execute an approved Pending Plan (or approved subset) using the Pending Plan note as the implementation context, breadcrumb record and outcome summary.
Trigger: User selects a Pending Plan to implement and grants execution approval for all or part of the plan.
Inputs: Target Pending Plan link, approved execution scope, approval boundaries, dependencies/links, desired outcome for this run.
Outputs: Implemented changes (if approved), updated Pending Plan note (snapshot + execution log + outcome) and a proposal for status/archival updates if applicable.
Status: draft
Related Protocols/Codices: [[Council Chamber/Protocols/Planning/Pending Plan Implementation Protocol]], [[Council Chamber/Protocols/Planning/Pending Plan Progress Update Protocol]], [[Council Chamber/Protocols/Planning/Pending Plan Reconciliation Protocol]], [[Council Chamber/Codices/Contrast Layer Codex]]

## Steps
1. Confirm the target Pending Plan and read back plan intent, risk, affected areas and current breadcrumb context.
2. Document `Implementation Snapshot (When Executing)` and `Approved Execution Scope (This Run)`.
3. Confirm exactly what is approved to implement now and what remains out of scope.
4. Execute approved work and log actions in `Implementation Actions (Execution Log)`.
5. Update `Evidence / Implementation Refs` and `Implementation Outcome (This Run)`.
6. Propose `implementation_state` and any status/archival changes (approval-gated).
7. Read back the implementation summary and apply approval-gated changes only with explicit consent.

## Quick Entry Tags (Optional, Dataview-Friendly)
- `#field`
- `#ai`
- `#learning`
- `#decision`

## Planning Mode Rule
- If status is proposed or draft, execution is not authorized.
