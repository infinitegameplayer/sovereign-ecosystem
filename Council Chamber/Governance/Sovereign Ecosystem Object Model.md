# Sovereign Ecosystem Object Model

Purpose: Define the core object types used in the Sovereign Ecosystem, their intent and their lifecycle.

Note: Tiered contrast metadata applies to foundational objects per [[Council Chamber/Codices/Contrast Layer Codex]].

## Spark
Purpose: Capture emergent ideas in raw form.
Characteristics:
- Raw content preserved
- Timestamped
- Source tagged
- Metadata appended below raw content
Lifecycle: Emerge -> Incubate -> Distill -> Activate (optional)

## Insight
Purpose: Distilled, non-transient conceptual realization.
Characteristics:
- Linked to domains or themes
- May reference Sparks or Experiments
Lifecycle: Capture -> Distill -> Integrate

## Quest
Purpose: Structured Sovereign-facing action initiative with intent (field actions, practices, builds, experiments or embodied pursuits).
Characteristics:
- Clear objective
- Linked Sparks and Artifacts
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

## Experiment
Purpose: Track structured experimentation.
Fields: Hypothesis, Method, Result, Lessons, Next iteration.
Lifecycle: Hypothesis -> Method -> Result -> Lesson -> Next Iteration

## Brief
Purpose: Condensed summary of a larger body of work.
Use: Quick review, external sharing, context handoff.
Lifecycle: Draft -> Refine -> Share -> Archive (optional)

## Rule
Purpose: Encode governance constraints.
Examples: Raw preservation, Plan -> Consent -> Execute, metadata standards, trust thresholds.
Lifecycle: Draft -> Ratify -> Enforce -> Revise

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
- Routed into Spark, Quest update, Artifact, Experiment or PendingPlan
Lifecycle: Capture -> Classify -> Convert -> Clear











