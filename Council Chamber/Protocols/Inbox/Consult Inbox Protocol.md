---
version: 0.1
---

# Consult Inbox Protocol

Purpose: Define how Consult artifacts enter `Inbox/` and are analyzed in planning mode only.

Scope: All Consults placed in `Inbox/`.

## Principles
- Consults are planning-only. No execution or system mutation without explicit approval.
- The full original Consult text must be preserved verbatim.
- Inbox analysis must be explicit, structured and action-oriented.
- Consults are raw intake artifacts and must be created in `Inbox/`, not directly in downstream working containers.
- Any cleaned-up summary, strategy note, codex draft or collaboration-facing artifact must be created as a separate derived note in its canonical container, not by repurposing the Consult itself.

## Required Metadata (frontmatter)
- status: captured (raw intake) or proposed (analysis complete)
- created: YYYY-MM-DD
- version
- source
- submitted_by
- mode: planning
- execution: requires explicit approval
- vault_status: not archived
- related_protocols

## Required Sections
- Original Draft (verbatim)
- Inbox Analysis ({{AI_INTERFACE_NAME}})
  - Key Insights
  - Decisions Suggested (Not Approved)
  - Actionable Tasks (Plan-Only)
  - Potential Quests
  - Potential Pending Plans
  - Risks and Assumptions
  - What Needs Verification
  - Proposed Insertions into Sovereign Ecosystem (Exact Files/Locations)
  - Approval Gate

## Inbox Workflow
1. Create Consult note in `Inbox/` with required metadata.
2. Paste the full Consult text verbatim under Original Draft.
3. Produce Inbox Analysis using the required sections.
4. Do not execute any tasks or changes beyond creating the Consult note and this analysis.
5. Await explicit approval before creating Pending Plans, Quests or protocol drafts.
6. If approved, create any downstream working notes separately in their canonical containers and keep the Consult as the preserved source breadcrumb.
7. During {{AI_INTERFACE_NAME}} Activation, Consults may be included in a proposal-only Inbox status report (route/status/archive candidates); no changes occur without approval.

## Planning Mode Rule
- `status: proposed` and `status: draft` indicate planning-only mode by default.
- Execution is not authorized unless explicitly approved.

## Consult Status Progression (Proposal-First, Approval-Gated)
- `status: captured`:
  - raw Consult captured and preserved
  - Inbox analysis may be partial or in progress
- `status: proposed`:
  - Inbox analysis completed
  - downstream notes/artifacts may still be pending approval or execution
- `status: complete` (recommended when applicable):
  - the Consult's primary planning function has been fulfilled
  - downstream artifacts were created (for example PendingPlans, Quests, codices, protocols, exports)
  - the Consult is now primarily a source breadcrumb / provenance record
- `status: archived`:
  - Consult moved to the Vault after approval and any applicable flywheel processing

## Same-Session Consult Closure Check (Recommended)
- If a Consult directly produces new notes in the same session (PendingPlans, Quests, codices, protocols, exports), {{AI_INTERFACE_NAME}} should run a proposal-only Consult closure check before Session Closeout:
  - Is the Consult still actively guiding unresolved design work?
  - Or is it now mainly a historical source breadcrumb?
- {{AI_INTERFACE_NAME}} may propose a status change to `complete` in the same session, with explicit approval.
- Default rule: if downstream notes were created and the Consult is no longer the primary active working surface, propose `status: complete` immediately in that same session.
- Do not leave a Consult at `proposed` after downstream artifacts are created unless it is still the primary unresolved planning container.
- Vault descent is usually deferred to Session Closeout unless explicitly approved earlier.

## Vault Transition
Once the Consult plan is approved and executed, the Consult may be moved into the Vault and processed under the Universal Vault Flywheel.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Include a "Contrast Handling" line in Inbox Analysis.
- If ambiguity risk is meaningful, add contrast fields to frontmatter.
- Primary analysis remains affirmative; contrast stored per codex.
