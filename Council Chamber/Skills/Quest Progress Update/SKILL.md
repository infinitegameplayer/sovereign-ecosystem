---
name: Quest Progress Update
description: Guide a short conversation that updates one Quest note with in-world progress, Sovereign Ecosystem/AI progress, learnings, evidence and the next step.
status: draft
version: 0.1
---

# Quest Progress Update Skill

Purpose: Guide a short conversation that updates one Quest note with in-world progress, Sovereign Ecosystem/AI progress, learnings, evidence and the next step.
Trigger: User wants to update a specific Quest (especially after physical-world actions) or a North Star review surfaces a stale Quest.
Inputs: Target Quest link, recent field actions/outcomes, learnings/failures, evidence links, Sovereign Ecosystem/AI changes (optional), next step, review timing.
Outputs: Updated Quest note with dual-track progress entries, refreshed next step, optional status/completion proposal.
Status: draft
Related Protocols/Codices: [[Council Chamber/Protocols/Planning/Quest Progress Update Protocol]], [[Council Chamber/Governance/Quest Operating Guide]], [[Council Chamber/Protocols/Flywheels/North Star Recalibration Protocol]], [[Council Chamber/Codices/Contrast Layer Codex]]

## Steps
1. Confirm the target Quest and read back `Objective`, `End State`, `Completion Signals` and current `Next Step`.
2. Ask field-first questions (what happened in the real world, what worked, what did not, what changed).
3. Ask for Sovereign Ecosystem/AI changes (notes, plans, codices, templates, protocols) only after field capture.
4. Capture learnings, failures and deltas; link evidence/artifacts.
5. Propose Quest note updates in the correct sections:
   - `Quest Activity Log`
   - `In-World Progress`
   - `Sovereign Ecosystem / AI Progress`
   - `Learnings / Failures / Deltas`
   - `Evidence / Artifacts`
6. Refresh `Next Step` and `next_review`.
7. If warranted, propose status change (`active`, `stalled`, `completed`) and confirm against `End State` / `Completion Signals`.
8. Read back proposed changes and apply only with approval.

## Quick Entry Tags (Optional, Dataview-Friendly)
- `#field`
- `#ai`
- `#learning`
- `#decision`

## Planning Mode Rule
- If status is proposed or draft, execution is not authorized.
