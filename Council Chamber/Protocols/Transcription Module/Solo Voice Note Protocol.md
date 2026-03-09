---
status: active
version: 0.2
tier: operational
module: Transcription Module
links:
  - "[[Council Chamber/Protocols/Transcription Module/Transcript Inbox Protocol]]"
  - "[[Scriptorium/Expression Seeds/Index]]"
  - "[[Library/Transcripts/Solo]]"
---

# Solo Voice Note Protocol

Purpose: Define how solo voice note recordings enter the Sovereign Ecosystem, are stored and are analyzed for Expression potential.

## What This Protocol Covers
Solo voice notes are fundamentally different from collaboration or meeting transcripts:
- The Sovereign is the only speaker
- There are no action items by collaborator, no meeting decisions, no partner tracking
- The primary downstream is Expression (Scriptorium), not action extraction
- The energy is often exploratory, intuitive and raw â€” preserve that quality in the analysis

## Classification Signal
- 0 or 1 participant (Sovereign only)
- No structured meeting title or call framing from your transcription service
- Often short to medium length (walk or on-the-go cadence)
- Solo context noted in title or participant field

## Filename Standard
- Pattern: `Transcript - Solo - {Short Topic Title} - YYYY-MM-DD.md`
- Examples:
  - `Transcript - Solo - Sovereignty and Expression Flow - 2026-03-02.md`
  - `Transcript - Solo - Thoughts on Project Direction - 2026-03-05.md`
- Keep the topic title short and human-readable (3-6 words)
- Use the date of the recording, not the date of ingestion

## Routing
1. Full verbatim transcript saved to:
   - `Library/Transcripts/Solo/`
2. {{AI_INTERFACE_NAME}} analysis block prepended above the raw transcript (same layout rule as Transcript Inbox Protocol):
   - Source Snapshot
   - Signal Analysis (see below)
   - Expression Potential Assessment
   - Development Decision
3. If Expression potential is strong, create Expression Seed in `Scriptorium/Expression Seeds/` linked to the transcript
4. If no clear Expression potential, the transcript lives in `Library/Transcripts/Solo/` only, for later review or Vault eligibility

## Transcript Layout Rule (Consistent with Transcript Inbox Protocol)
- All {{AI_INTERFACE_NAME}}-generated sections are placed above the raw transcript
- Raw transcript content remains verbatim and unedited below `## Raw Transcript (verbatim)`
- Oxford comma standard: all {{AI_INTERFACE_NAME}}-generated sections follow no-Oxford-comma rule; raw section is exempt

## Signal Analysis Structure ({{AI_INTERFACE_NAME}}-Assisted, Proposal-First)
### Surface Signal
- What was explicitly said
- Key phrases or quotes worth preserving verbatim
- Core topics

### Pattern Signal
- Recurring themes across this note or broader Sovereign Ecosystem context
- Tensions, questions or contrasts present
- Principles or paradigms emerging

### Deep Signal
- The Sovereign's implicit wisdom beneath the literal words
- 3-layers-deep transmission: what was being said beyond the saying
- What feels most alive in this recording

### Expression Potential
- Core thesis or idea seed
- Article directions (if any)
- Short-form or post directions (if any)
- Themes that translate beyond the immediate context into shareable signal

## Cross-Reference Checklist (Proposal-First)

Run after Signal Analysis. These checks sharpen routing and downstream proposals beyond generic expression potential.

### North Star Alignment
- Does the content declare or update a trajectory, paradigm or value orientation?
- If yes: flag for North Star review â€” specifically Calibration Field, current Horizons or Long Term sections
- Reference: `[[Library/North Star]]`

### Weekly Story Relevance (Optional)
- Does the content contain strong mythic, transformative or paradigm-level material (declared worldviews, sovereignty moves, personal evolution signals)?
- If yes: flag it as a potential seed for your next weekly story or reflection practice
- Reference your weekly story protocol or reflection practice if one is installed.

### Active Pending Plan Connections
- Does the content relate to any open Pending Plan â€” by topic, project area or named initiative?
- Scan: `[[Council Chamber/Pending Plans/Index]]`
- If yes: note the plan name and the nature of the connection; do not auto-create tasks

### Active Context Reference
- Reference your {{AI_INTERFACE_NAME}} Transcript Processing Context (if configured) for current active priorities, expression themes and known open threads before completing Signal Analysis
- This context allows Pattern Signal to surface cross-session patterns rather than generic observations

## Development Decision (Proposal-First)
- Promote to Expression Seed? (yes / no / maybe â€” with brief rationale)
- If yes: create `Scriptorium/Expression Seeds/Expression Seed - Solo - {Core Theme} - YYYY-MM-DD.md`
- If no: note why and leave in Library for future pass or Vault descent
- Priority signal: low / medium / high

## Vault Eligibility
- Apply standard Library review window before Vault eligibility
- After review window: eligible for `Vault (Archive)/Domains/Intelligence/Transcripts/` via Batch Archival Protocol
- Any linked Expression Seeds follow their own archival path

## {{AI_INTERFACE_NAME}} Activation Integration
- During {{AI_INTERFACE_NAME}} Activation, new transcripts from your transcription service are checked (standard flow)
- Solo voice notes are identified during classification step
- Routing proposal surfaces count, title and date â€” no auto-ingest
- Processing pass (Signal Analysis + Development Decision) is proposal-first and approval-gated

## Transcription Service Note
- This protocol is service-agnostic. It works with any transcription service you have configured.
- See `[[Council Chamber/Protocols/Transcription Module/Transcription Service Setup Guide]]` for setup options.
- Preserve the original service ID and URL in transcript metadata for traceability where available.

## Follow-Up
- This protocol will evolve as solo voice note habits stabilize.
- If longer "voice journal" formats emerge (multi-topic, extended duration), consider a variant analysis profile.
- Integration with automated ingestion pipelines may change the ingestion path; update this protocol when that surfaces.

## Contrast Layer Integration
Tier: 2 (operational).

<!--
Internal Contrast Layer
- Solo voice notes are NOT collaboration transcripts; do not apply action-by-participant extraction.
- The Scriptorium is the primary downstream; do not treat solo notes as governance inputs.
- Preserve the raw, exploratory energy of voice capture â€” do not over-formalize the analysis pass.
-->
