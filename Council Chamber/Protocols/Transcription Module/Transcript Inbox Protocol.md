---
version: 0.1
module: Transcription Module
---

# Transcript Inbox Protocol

Purpose: Define how transcripts enter `Inbox/`, are classified and routed (Library, Collaborations or Vault) and are converted into system improvements with approval gates.

## Supported Sources
- Manual transcript drops into `Inbox/` (files or notes)
- Manual paste/import into an `Inbox/` note
- API-ingested transcripts from your configured transcription service (when set up)

## Transcript Routing Rule (Mandatory)
- All transcript-like items entering `Inbox/` must be classified and routed through this protocol before being moved.
- {{AI_INTERFACE_NAME}} may propose routing during Activation or mid-session, but no move/conversion occurs without approval.

## Filename Normalization (Simple Standard)
- Normalize transcript filenames early (proposal-first, approval-gated) to remove import noise such as random IDs or hash suffixes.
- Default filename pattern:
  - `Transcript - <SourceOrPartner> - <MeetingOrEventTitle> - YYYY-MM-DD.md`
- Examples:
  - `Transcript - [Partner Name] - Project Sync - 2026-02-23.md`
  - `Transcript - Summit - [Event Title] - 2026-03-14.md`
- Keep the title human-readable and stable:
  - remove trailing IDs / hashes from service exports
  - standardize date format to `YYYY-MM-DD`
  - use source/partner as the first context anchor
- Record the original imported filename in metadata or the {{AI_INTERFACE_NAME}} analysis block for traceability.

## Transcript Layout Rule (Mandatory)
- {{AI_INTERFACE_NAME}}-created sections must be placed above the raw transcript.
- Raw transcript content remains preserved verbatim below a clearly labeled section, e.g. `## Raw Transcript (verbatim)`.
- {{AI_INTERFACE_NAME}} may prepend:
  - metadata draft
  - routing recommendation
  - summary / decisions / action items
  - extraction candidates
  - approval gate
- If you have a Writing Style Codex installed, follow its punctuation conventions for {{AI_INTERFACE_NAME}}-created sections. Otherwise keep those sections simple and internally consistent. The raw verbatim section is exempt - it is never edited for style.

## Action Extraction and Dashboard Sync (Recommended)
- Distinguish action steps by owner at extraction time:
  - Sovereign action steps
  - collaborator action steps (e.g., [collaborator name])
  - shared action steps
- When distilling conversational transcripts, prioritize:
  - what the Sovereign actually said, decided or committed to
  - how the Sovereign affected the direction, energy or clarity of the conversation
  - what materially connects to an active project, collaboration or larger arc
- For collaboration transcripts, explicitly mark Sovereign actions that should be visible from the collaboration index/dashboard.
- Add a lightweight sync marker in the {{AI_INTERFACE_NAME}} analysis block (proposal-only), for example:
  - `dashboard_sync_candidate: yes`
  - `dashboard_scope: collaboration_only` or `core_dashboard_candidate`
- Default workflow (manual, approval-gated):
  1. {{AI_INTERFACE_NAME}} proposes action extraction in transcript note
  2. Sovereign approves selected actions
  3. Approved Sovereign actions are copied into the collaboration dashboard/index
  4. Optional: promote a subset to a future core dashboard
- Do not auto-sync across dashboards until automation is explicitly approved.

## Current Workflow (Manual)
1. Capture transcript in `Inbox/` (raw preservation first).
2. Classify transcript type and source:
   - personal/system transcript
   - coaching session transcript
   - collaboration transcript
   - imported historical transcript
3. Propose routing:
   - `Library/Transcripts/` (default for general transcripts)
   - `Library/Coaching Sessions/` (coaching transcript path, if represented as transcript-first intake)
   - `Collaborations/<Partner>/...` (partner transcript / meeting record)
   - direct Vault proposal (rare; historical imports already complete and approved)
4. Apply approved move to the destination holding lane.
5. Extract system upgrades and governance learnings (proposal-first).
6. Convert selected items into Pending Plans, Quests or protocol/codex proposals only with explicit approval.
7. Link created/updated notes back to the transcript.

## Routing Decision Guide
### Route to `Library/Transcripts/` (Default)
- Use when the transcript is primarily a source for Sovereign Ecosystem learning, system extraction or future conversion work.
- Hold for the Library review period before Vault eligibility (unless policy changes are approved).

### Route to `Collaborations/<Partner>/...`
- Use when the transcript is primarily a collaboration asset, meeting record or partner-specific working context.
- Follow Collaboration Archival Protocol for longer-term archival handling.
- Still allow Sovereign Ecosystem extraction (PendingPlans/protocol deltas) with breadcrumbs back to the collaboration transcript.

### Route Directly to Vault (Rare, Approval-Gated)
- Use only when the transcript is a historical import already reviewed/closed, or when a prior holding requirement has already been satisfied.
- Require explicit approval and breadcrumb links to any extracted artifacts.

## Source-Specific Extensions

### Manual Transcript Add (Current)
- The Sovereign drops/pastes transcript into `Inbox/`.
- {{AI_INTERFACE_NAME}} classifies + proposes route during Activation or on request.

### Transcription Service API Ingestion (When Configured)
- Ingestion may populate `Inbox/` automatically or stage raw payloads in a designated ingestion lane.
- {{AI_INTERFACE_NAME}} still runs classification + route proposals manually during Activation until automation is explicitly approved.
- Add source metadata when available:
  - meeting title
  - participants
  - meeting date
  - source platform (your transcription service name)
  - transcript URL / external ID (if safe to store)
  - original imported filename
- On processing: run Oxford comma removal pass on all {{AI_INTERFACE_NAME}}-generated sections. Raw transcript body is exempt and never edited for style.

### Solo Voice Note Transcript (Active â€” Requires Solo Voice Note Protocol)
- Applies to solo captures recorded on walks or personal voice sessions.
- Full protocol: `[[Council Chamber/Protocols/Transcription Module/Solo Voice Note Protocol]]`
- Route to: `Library/Transcripts/Solo/` (not standard `Library/Transcripts/`)
- Primary downstream: Scriptorium Expression Seeds (not action extraction)
- No participant tracking; no action-by-owner classification.

### Summit / Event Transcript (Future Profile)
- Analyze differently from collaboration meetings:
  - prioritize key insights, frameworks, references and implementation opportunities
  - emphasize Quest / Experiment seeds and evidence capture
- Build this as a separate analysis profile/template after a first real summit transcript pass.

## {{AI_INTERFACE_NAME}} Activation Integration (Proposal-Only)
- During {{AI_INTERFACE_NAME}} Activation, {{AI_INTERFACE_NAME}} may run a transcript Inbox scan and report:
  - new transcript files detected in `Inbox/`
  - routing recommendations to `Library`, `Collaborations` or (rarely) Vault
  - candidate Pending Plans, Quests or protocol updates (proposal-only)
- Transcript routing or conversion is approval-gated.

## Session Closeout Integration (Recommended)
- Re-check transcripts touched during the session:
  - confirm routing completed (if approved)
  - confirm extracted notes are breadcrumbed
  - assess whether any transcript now qualifies for Vault descent
- Execute only approved moves/status changes during closeout.

## Follow-Up
Create additional transcript Inbox sub-protocols for different sources (manual upload, API ingestion, live capture).
This should be revisited as new transcript types enter the Sovereign Ecosystem.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Include contrast fields in frontmatter for foundational updates.
- Store deeper contrast reasoning in the footer block when needed.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- Add contrast notes here if needed.
-->
