# Quest Operating Guide

Purpose: Single source of truth for Quest activation, lifecycle and transition process.

## Lifecycle Definitions
- candidate: Potential Quest identified; not yet activated.
- active: In motion with a defined next action.
- stalled: Temporarily blocked or paused; requires review to resume or retire.
- completed: Objective achieved; closeout log written.
- retired: No longer relevant or superseded; archived for record.

## Activation Criteria (all required)
- Clear objective that results in a concrete outcome.
- A single next action that can be done within one session.
- An owner assigned.
- A review point defined.

## Not a Quest (redirect)
- Purely exploratory ideas with no intended outcome (keep as Spark).
- General topics with no action sequence (keep as Library or Insight).
- Administrative governance changes without a plan (route to PendingPlan).
- Sovereign Ecosystem/{{AI_INTERFACE_NAME}} implementation work (protocol/skill/template/system changes) that is primarily internal to the Sovereign Ecosystem (route to PendingPlan).

## Required Inputs
- Objective statement.
- End state definition (what will exist when the Quest is tentatively complete).
- Completion signals (observable evidence that the Quest is done enough to close or review for completion).
- First action step.
- Owner.
- Next review date.
- Source or links (if derived from Spark or other notes).
- Initial logging structure populated (Quest Activity Log + In-World Progress + Sovereign Ecosystem/AI Progress + Learnings/Evidence sections).
- Trifecta Reflection (required):
  - Subconscious Field
  - Digital Sovereign Ecosystem
  - Physical World

## Imported Source Material (When Applicable)
- If a Quest begins from migrated or imported source notes, preserve the source notes first before rewriting or distilling them.
- Keep imported source notes verbatim when preservation is the approved rule for that source.
- Link imported source notes in the Quest note's `Source Material` and/or `Evidence / Artifacts` so the Quest note stays lightweight while the original material remains reviewable.
- Treat imported source notes as support material, not as a substitute for the Quest's own objective, end state, completion signals and next step.

## Gating Questions
- What will exist when this is done?
- What is the end state that marks tentative completion?
- What observable signals will show this Quest is complete enough to close?
- What is the very next action?
- What action will likely happen in the physical world?
- What Sovereign Ecosystem/AI action should track or support that progress?
- How is the Subconscious Field engaged here?
- How does the Digital Sovereign Ecosystem integrate or reflect this Quest?
- What is the Physical World proving ground for this Quest?
- Who owns it?
- When should we check if it is moving?
- Is this primarily a {{SOVEREIGN_DISPLAY_NAME}} challenge/exploration, or is it primarily a Sovereign Ecosystem implementation proposal?

## Transition Process
- candidate ? active: Fill in `owner`, `next_review`, `started` and define the first action.
- candidate ? active: Define `End State`, initial `Completion Signals` and initialize dual-track logging sections (In-World + Sovereign Ecosystem/AI) before activation when possible.
- active ? stalled: Update `status` to `stalled` and set a new `next_review`.
- stalled ? active: Update `status` to `active` and define the new next action.
- active ? completed: Confirm `End State` / `Completion Signals` have been met (or note variances), update `status` to `completed`, set `completed` and add a completion log.
- completed ? retired: Update `status` to `retired` when a Quest is being closed without a completed outcome (or reclassified), preserving breadcrumbs.
- active/candidate ? reclassified (approval-gated): If a note is determined to be a misclassified Sovereign Ecosystem implementation, first check for overlapping existing PendingPlans, then create/merge a PendingPlan replacement, add cross-links/breadcrumbs and retire the Quest (or continue only the Sovereign-facing portion as a Quest).

Note: Status updates are sufficient for Obsidian filtering. For cleaner active views, completed and retired Quests may both be moved to a shared Quest archive lane in `Vault (Archive)/Quests/` and distinguished by metadata.

## North Star Linkage
- Quest seeds may originate from North Star Flywheel options.
- Use the Active Quests section in `Library/North Star.md` to surface all `status: active` quests.
- If a Quest is active, it should appear there via Dataview and be verified during each North Star review.
- North Star calibration updates may reflect in-world progress first; annotate field progress in the Quest note, then record Sovereign Ecosystem/AI changes that formalize the learning.

## Quest Completion Protocol
1. Set `status: completed` and fill `completed` date.
2. Confirm `End State` and `Completion Signals` (or record why closure is accepted without full completion).
3. Add a Completion Log (Outcome, Actions, Decisions, Learnings, Next Threads; optional Artifacts/Timebox).
4. Ask: what should be shared, reused or converted into a stable artifact from this Quest?
5. Record Archetypal ROI:
   - Energy After Completion: Expansive / Neutral / Contracted
   - Clarity Gained: one sentence
   - Capability Gained: one sentence
   - When relevant, note strengthened archetypal energies, exercised stewardship domains and any emerging contribution / wealth signals.
6. Add `#completed` tag.
7. Move the note to the Quest archive lane (recommended: `Vault (Archive)/Quests/`) unless another approved Quest archive structure is in use.

## Quest Retirement / Reclassification Archive Protocol (Lightweight)
1. Confirm retirement or reclassification rationale in the Quest note.
2. Add replacement links/breadcrumbs if the Quest is being replaced by a PendingPlan or another object.
3. Set `status: retired` (and optionally `completed` date if using that field as a closure timestamp).
4. Move the note to the same Quest archive lane used for completed Quests (recommended: `Vault (Archive)/Quests/`).

## Quest Activity Logging (Recommended)
- Maintain a `Quest Activity Log` section in the Quest note.
- Log meaningful steps, decisions, integrations and scope changes with dates.
- Keep entries short (1-3 lines each) to preserve readability.
- Use this log as the breadcrumb trail for later review, closeout and archival summaries.

## Dual-Track Progress Logging (Recommended)
- Quests progress across two execution planes:
  - In-World (physical actions, conversations, attempts, setbacks, outcomes)
  - Sovereign Ecosystem/AI (notes, protocols, plans, codex updates, system integrations)
- Use `## In-World Progress` for field actions and observed results.
- Use `## Sovereign Ecosystem / AI Progress` for {{AI_INTERFACE_NAME}}-assisted or Sovereign Ecosystem-logged work.
- Use `## Learnings / Failures / Deltas` to capture what changed because of either track.
- For Quests that meaningfully feed archetypal governance, a lightweight `## Archetypal / Stewardship Alignment` section is recommended.
- Suggested fields:
  - `Primary Archetypal Emphasis`
  - `Primary Stewardship Domain`
  - `Secondary Stewardship Domain (optional)`
  - `Current Arena Logic`
    - `Strength / Proven Capacity`
    - `Curiosity / Aliveness`
    - `Practical Contribution / Wealth Potential`
- Keep this section short and qualitative.
- It is recommended in the current phase, not required for Quest activation.
- Not every field action requires an Experiment note. Create an Experiment only when a hypothesis/method/result structure is useful.

## Dataview-Friendly Progress Tags (Optional, Recommended)
- Add lightweight tags to Quest progress entries for cross-Quest filtering:
  - `#field` (in-world progress)
  - `#ai` (Sovereign Ecosystem/AI progress)
  - `#learning` (learning/failure/delta)
  - `#decision` (meaningful decisions, pivots, status changes)
- Tags improve visibility during reviews but should not replace clear prose.
- If omitted, the section placement (`In-World`, `Sovereign Ecosystem / AI`, etc.) is still the primary signal.

## Quest Update Conversation (Recommended)
- Use [[Council Chamber/Protocols/Quest Progress Update Protocol]] for structured single-Quest updates, especially after real-world progress.
- Use [[Council Chamber/Skills/Quest Progress Update Skill]] when {{AI_INTERFACE_NAME}} should lead the questioning and writeback flow.
- This process complements (does not replace) [[Council Chamber/Protocols/North Star Recalibration Protocol]].
- If classification drift appears (Quest vs PendingPlan), pause and request approval before converting.

## Quest Formation Checklist (Minimum Viable Definition)
When creating a Quest, populate all of the following even if some entries are provisional:
- Frontmatter: `status`, `created`, `owner`, `next_review`, `started`
- `Objective`
- `End State` (tentative is acceptable)
- `Completion Signals` (initial draft signals are acceptable)
- `Next Step`
- Logging sections initialized:
  - `Quest Activity Log`
  - `In-World Progress`
  - `Sovereign Ecosystem / AI Progress`
  - `Learnings / Failures / Deltas`
  - `Archetypal / Stewardship Alignment` (recommended when useful for archetypal governance)
  - `Evidence / Artifacts`

Rule: Incomplete clarity is acceptable at activation; missing structure is not.









