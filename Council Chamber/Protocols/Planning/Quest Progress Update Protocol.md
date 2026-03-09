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

# Quest Progress Update Protocol

Purpose: Define a simple, conversation-driven process for updating a single Quest with both in-world progress and Sovereign Ecosystem/AI progress.

Scope: One Quest note per update session, including standalone Quest updates and Quest updates performed alongside North Star Calibration.

## Principles
- Field progress counts as real progress.
- Sovereign Ecosystem/AI updates are support and record-keeping, not the only source of movement.
- One Quest per update conversation to preserve clarity.
- Short logs are better than perfect logs.
- Incomplete clarity is acceptable; missing structure is not.

## Triggers
- The Sovereign returns from in-world action and wants to record progress.
- A Quest has moved materially but the note is stale.
- North Star Calibration reveals progress, blockers or pivots in a specific Quest.
- A failure, learning or scope shift should be preserved before it is forgotten.

## Inputs
- Target Quest note (single quest)
- What happened in the physical world since the last update
- What changed in the Sovereign Ecosystem/AI layer (if anything)
- Learnings, failures, blockers or pivots
- Evidence/artifacts (notes, files, experiments, links)
- Next step and review timing

## Conversation Workflow ({{AI_INTERFACE_NAME}}-Led)
1. Select the Quest
   - Confirm the target Quest note and current status.
2. Re-anchor the Quest
   - Read back `Objective`, `End State`, `Completion Signals` and current `Next Step`.
3. Capture In-World Progress (field-first)
   - Ask what actions were taken, what happened, what changed and what did/did not work.
4. Capture Sovereign Ecosystem / AI Progress
   - Ask what notes, plans, codices, templates or system updates were made (if any).
5. Capture Learnings / Failures / Deltas
   - Ask what was learned, what failed and what should adapt.
6. Capture Archetypal / Stewardship Alignment (lightweight)
   - Confirm whether the quest's archetypal emphasis or stewardship domain has changed in a meaningful way.
7. Capture Evidence / Artifacts
   - Add links to supporting notes, experiments or artifacts.
8. Template Compliance Check
   - Confirm required sections exist (Trifecta Reflection + Archetypal ROI for completion).
9. Refresh Quest Direction
   - Update `Next Step`, `next_review` and optionally `status` if a transition is justified.
10. Completion Check (when relevant)
   - Compare current state to `End State` and `Completion Signals`.
   - If tentatively complete, propose completion actions (do not auto-complete).
11. Readback + Approval
   - Summarize proposed changes before writing.
12. Apply Updates
   - Update the Quest note after approval.

## Recommended Question Set (Minimum)
- What happened in the real world since the last Quest update?
- What did you do that moved this Quest forward?
- How did the Subconscious Field show up (impulses, patterns, shadow or energetic shifts)?
- What did the Digital Ecosystem reflect or integrate (notes, structure, clarity, system changes)?
- What did the Physical World prove (actions, consequences, feedback, embodiment)?
- What did not work or created friction?
- What did you learn or realize?
- What archetypal energy and stewardship domain does this quest most strongly exercise right now?
- Has the quest's balance of strength, curiosity or practical value changed?
- Did anything change in the Sovereign Ecosystem/AI layer because of this?
- What evidence or artifacts should be linked?
- What is the next best step now?
- Has the end state or completion signals changed?
- Is this still `active`, or should we propose `stalled` / `completed`?

## Update Mapping (Quest Note Sections)
- `## Quest Activity Log`: milestone-level summary of meaningful changes
- `## In-World Progress`: physical actions, outcomes, conversations, attempts
- `## Sovereign Ecosystem / AI Progress`: notes, plans, protocol/template/codex changes
- `## Learnings / Failures / Deltas`: insights, failed attempts, scope changes
- `## Archetypal / Stewardship Alignment`: lightweight current framing, updated only when materially helpful
- `## Trifecta Reflection (Required, Completion)`: Subconscious Field, Digital Ecosystem, Physical World
- `## Evidence / Artifacts`: supporting links
- `## Next Step`: refreshed immediate action
- Frontmatter (as needed): `next_review`, `status`, `completed`, `completion_signals`, `end_state`

## Dataview-Friendly Tag Convention (Recommended)
For progress entries, append lightweight tags when useful:
- `#field` for in-world progress
- `#ai` for Sovereign Ecosystem/AI progress
- `#learning` for learnings/failures/deltas
- `#decision` for scope/priority/status decisions

Tags are optional but recommended for cross-Quest filtering.

## Relationship to North Star Calibration
- This protocol is complementary to North Star Calibration.
- North Star Calibration may surface Quest updates; this protocol handles the structured write-back into the Quest note.
- Use this protocol when a single Quest needs deeper progress capture than a North Star annotation alone.

## Approval Gate
- {{AI_INTERFACE_NAME}} may draft and propose Quest updates.
- Status transitions (`active` to `stalled` / `completed`) and closeout actions require explicit approval.
- Archival moves remain governed by Quest Completion Protocol and related governance rules.

## Outputs
- Updated Quest note (single target)
- Refreshed `Next Step` and `next_review`
- Preserved breadcrumb trail of in-world and Sovereign Ecosystem/AI progress
- Optional completion proposal (if end state is tentatively met)

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Contrast fields required.
- Footer internal contrast block required.

<!--
Internal Contrast Layer
- Prevent Quest updates from becoming AI-only admin logs disconnected from lived reality.
- Keep the process lightweight enough for frequent use.
-->
