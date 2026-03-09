---
version: 0.1
status: draft
created: 2026-02-22
---
# Capture ? Classify ? Route Protocol

Purpose: Define a lightweight, manual Inbox flow that routes all incoming information through `Inbox/`.

Scope: All Inbox sources (desktop, mobile, future email).

## Stage 1: Capture (Inbox)
- All incoming material lands in `Inbox/`.
- Default note type: InboxItem.
- Raw input is preserved; analysis is appended.
- This flow is manual-by-trigger (for example, during {{AI_INTERFACE_NAME}} Activation), not an always-on watcher.

## Stage 2: Classify
{{AI_INTERFACE_NAME}} classifies by:
- Object type (Spark, Consult, Quest update, Experiment, Insight, Brief, Artifact, Transcript, Coaching Session, Governance draft, Strategy draft)
- Status (proposed/draft/active/complete)
- Domain (if known)
- Quick capture type (To-Do vs Spark vs InboxItem):
  - Route to `To-Do Dock` when the item is a short-lived action prompt that is likely actionable within minutes, later today or within the next few days and does not need archival retention.
  - For mobile quick capture, unprefixed short text now defaults to `To-Do Dock` unless explicitly marked otherwise.
  - Route to `Spark` when the item contains expansion energy: it could become a Quest, Experiment, governance thread, strategic concept or a larger creative build.
  - Route to `InboxItem` when the item is explicitly marked for Inbox retention or when a longer-form capture should stay in `Inbox/` for later review.
- Classification drift check (Quest vs PendingPlan):
  - If the item appears to be a Sovereign Ecosystem/{{AI_INTERFACE_NAME}} implementation proposal (protocol/skill/template/system/governance change), flag it as a likely PendingPlan.
  - If the item appears to be a Sovereign-facing challenge/practice/build with in-world execution, flag it as a likely Quest.
  - If routing to PendingPlan, first check for overlapping existing PendingPlans and propose merge/scope-split options before creating a new one.
- Transcript routing check:
  - If the item is a transcript (manual upload, pasted transcript note or future API-ingested transcript), route decisions must run through [[Council Chamber/Protocols/Inbox/Transcript Inbox Protocol]] before any move.

## Stage 3: Route
- Convert into the correct object template.
- Move into the correct container (Active Chamber or staging).
- To-Do route:
  - Do not create a dedicated note for each short-lived to-do by default.
  - Append the item to `[[To-Do Dock]]` in the Sovereign Ecosystem root container for fast mobile access.
  - Preserve only enough context to take action; completed entries are deleted, not archived.
- Spark route:
  - Create or append to a Spark note when the item has clear growth potential or belongs in ideation rather than immediate execution.
- InboxItem route:
  - Keep in `Inbox/` when routing is still uncertain or the capture needs tiered Inbox analysis before conversion.
- For Consults, enforce planning-only and include Inbox Analysis.
- Strategy and Governance drafts remain in Inbox until explicitly approved.
- Transcripts and Coaching Sessions route through [[Council Chamber/Protocols/Inbox/Transcript Inbox Protocol]]:
  - default route: `Library/Transcripts/` or `Library/Coaching Sessions/` holding lane
  - collaboration transcript route: `Collaborations/<Partner>/...` when the primary object is collaboration recordkeeping
  - Vault route: only after transcript protocol checks, holding requirements (when applicable) and explicit approval
- Collaboration artifacts route to Collaborations/<Partner>/ and follow the Collaboration Archival Protocol.

## Stage 4: Status & Approval
- `status: proposed` and `status: draft` are planning-only.
- `status: complete` is required before archival scan.
- Object-type reclassification (e.g., Quest <-> PendingPlan) is approval-gated when a mismatch is detected.

## Stage 5: Archive Touchpoint
- When status becomes `complete`, item becomes eligible for Batch Archival and Flywheel.
- For transcripts/coaching sessions, follow transcript protocol holding/routing rules before Vault descent.

## Tiered Inbox Analysis
Default by word count, with {{AI_INTERFACE_NAME}} discretion:
- Tier A (Minimal): <150 words
- Tier B (Standard): 150-600 words
- Tier C (Deep): >600 words

Types that almost always qualify for Tier C:
- Consults
- Governance drafts
- Transcripts
- Strategy documents

## Preservation Rule
- Inbox analysis lives at the top of the note while in Inbox.
- Legacy heading `Intake Analysis` is acceptable in older notes.
- When routed out of Inbox, move analysis to an "Inbox Analysis (Archive)" section or wrap in an HTML comment block to keep the main document clean.
- `To-Do Dock` is exempt from archival preservation. It is intentionally volatile.

## Quick Capture Input Spec (Mobile / Future Telegram)
- Recommended plain-language prefix: `to-do:`
- Example:
  - `to-do: remind myself that Notion has been the operational workspace for years`
- Prefix matching is case-insensitive. `TO-DO:`, `To-Do:`, `spark:`, `SPARK:`, `inbox:` and `INBOX:` all work.
- If the incoming message clearly begins with `to-do:` or is explicitly framed as a near-term action reminder, route to `[[To-Do Dock]]`.
- If the incoming message begins with `spark:` or reads like a concept with expansion potential, route to `Inbox/Sparks/`.
- If the incoming message begins with `inbox:`, keep it as an `InboxItem` in `Inbox/`.
- If the incoming message has no prefix, default it to `[[To-Do Dock]]` as a lightweight action capture.
- Voice note handling:
  - Transcribe first.
  - Preserve the raw transcript in `Inbox/`.
  - Classify the transcript result using the same to-do / spark / inbox-item rules before routing.
- Minimal fields to preserve from Telegram or another mobile capture source:
  - capture timestamp
  - source channel
  - raw message text or transcript
  - inferred type (`to-do`, `spark` or `inbox`)

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Include contrast fields in frontmatter for foundational updates.
- Store deeper contrast reasoning in the footer block when needed.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- Track Inbox edge cases and ambiguity resolution patterns here.
-->

## Transcript Note
- Transcript routing is a specialized Inbox sub-flow.
- See [[Council Chamber/Protocols/Inbox/Transcript Inbox Protocol]] for source-specific routing (manual upload, collaboration transcript, future API ingestion such as Fireflies.ai).



















