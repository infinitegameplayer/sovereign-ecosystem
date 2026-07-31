# Sovereign Ecosystem Object Model

Purpose: Define the core object types used in the Sovereign Ecosystem, their intent and their lifecycle.

Note: Tiered contrast metadata applies to foundational objects per [[Council Chamber/Codices/Contrast Layer Codex]].

## Quest
Purpose: Structured Sovereign-facing action initiative with intent (field actions, practices, builds, experiments or embodied pursuits).
Characteristics:
- Clear objective
- Linked Artifacts
- Status field and review cadence
- Tracks meaningful in-world execution, even when Sovereign Ecosystem/AI support work is also logged
Lifecycle: Candidate -> Active -> Stalled -> Completed -> Retired

## Artifact
Purpose: Produced output.
Examples: Documents, strategy drafts, code, designs, audio, blueprints.
Characteristics:
- May belong to a Quest or exist independently
- May be exported to collaboration buildings
Lifecycle: Produce -> Refine -> Distribute -> Archive (optional)

## Brief
Purpose: Condensed summary of a larger body of work.
Use: Quick review, external sharing, context handoff.
Lifecycle: Draft -> Refine -> Share -> Archive (optional)

## PendingPlan
Purpose: Hold proposed Sovereign Ecosystem/{{AI_INTERFACE_NAME}} implementation actions requiring approval.
Fields: Source trigger, proposed changes, risk level, affected containers, approval status.
Lifecycle: Proposed -> Approved -> Executed -> Logged

## Classification Rule (Quest vs PendingPlan)
- Use `Quest` when the core unit is a {{SOVEREIGN_DISPLAY_NAME}} challenge/initiative with field execution and progress cadence.
- Use `PendingPlan` when the core unit is a governance/system/process implementation proposal for the Sovereign Ecosystem.
- If a note mixes both, split the governance/system implementation into a PendingPlan and keep the {{SOVEREIGN_DISPLAY_NAME}} challenge as a Quest (or retire/reclassify one with approval).

## InboxItem
Purpose: Temporary holding structure for intake.
Characteristics:
- Short-lived
- Routed into Quest update, Artifact, Brief or PendingPlan
Lifecycle: Capture -> Classify -> Convert -> Clear

## On adding your own classes
Five classes is the floor this ecosystem runs on, not a ceiling. Add a class when you have notes that already behave like one and the existing five describe them badly. A class declared ahead of that becomes a concept nobody instantiates, which costs more than the gap it was meant to fill.
