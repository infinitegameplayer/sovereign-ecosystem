---
name: AI Interface Activation
description: Operationalize the AI Interface Activation Protocol with approval-gated session initialization and continuity checks.
status: draft
version: 0.1
tier: foundational
contrast_not:
false_twins:
anti_patterns:
boundary_conditions:
clarity_triggers:
---

# AI Interface Activation Skill

Purpose: Operationalize the AI Interface Activation Protocol, including Sovereign Command-first session framing, proposal-first support sweeps, continuity checks and approval-gated session initialization.

Inputs:
- Activation request
- Required governance references

Outputs:
- Confirmation of activation readiness
- {{AI_INTERFACE_NAME}} Status Report (lightweight by default; extended if approved)
- Sovereign Command presentation / update proposals
- Logged continuity checks

Constraints:
- No activation if required governance references are missing.
- Support sweep recommendations are proposal-only until explicitly approved.
- Support sweeps exist to support the active `Sovereign Command` direction, not replace it.
- Do not prompt on `North Star` during activation unless explicitly requested; North Star updates/refinements belong to the North Star Recalibration flow.

## Steps
1. Load required governance documents.
2. Load current orientation using gap-adaptive tier logic (see AI Interface Activation Protocol Step 2):
   - AI Interface Change Log — primary callback source; read depth determined by gap since last entry
   - Sovereign Command — primary session entry surface
   - North Star — background only; do not prompt unless explicitly requested
   - Execution-density drift flag: if recent Change Log entries show consecutive heavy-execution sessions, flag at activation that humor and meta-awareness are at highest drift risk
3. Confirm activation mode and scope/consent boundaries.
4. Confirm readiness checklist completion.
5. Present or update `Sovereign Command` (proposal-first), prioritizing the alive-energy layer before administrative support items.
   - Confirm whether the session intent is already known or should emerge by reviewing what feels alive in `Sovereign Command`
   - Treat `North Star` as passive background orientation unless the Sovereign explicitly requests a North Star review
6. Run Quick Support Sweep (default) and prepare a lightweight {{AI_INTERFACE_NAME}} Status Report:
   - `Inbox/` blockers/opportunities relevant to today's command surface
   - New transcript check (approval-gated ingestion, if using Transcription Module):
     - Check your transcription service for any transcripts not yet ingested
     - Surface count, titles, dates and durations — proposal only; no auto-ingest
     - Propose routing per Transcript Inbox Protocol; await approval before ingestion
   - Active quest/experiment visibility that materially affects today's move
   - Critical index drift affecting current visibility (proposal-only)
6. Present approval gates and capture the Sovereign's decisions:
   - What to execute now vs defer to Session Closeout
   - Whether to run an Extended Startup Sweep
8. Run Extended Startup Sweep (optional, proposal-only) when explicitly approved:
   - Consult route/status/archive candidates
   - Transcript/coaching Inbox routing proposals (if present)
   - Light archival eligibility preflight (proposal-only)
   - Broader Inbox index drift proposals
9. Activate {{AI_INTERFACE_NAME}} for the session with approved execution scope.

## Related Protocols/Codices
- [[Council Chamber/Protocols/AI Interface/AI Interface Activation Protocol]]
- [[Council Chamber/Protocols/Session/Session Closeout Protocol]]
- [[Council Chamber/Protocols/Inbox/Capture Classify Route Protocol]]
- [[Council Chamber/Protocols/Inbox/Consult Inbox Protocol]]
- [[Council Chamber/Protocols/Transcription Module/Transcript Inbox Protocol]]
- [[Council Chamber/Protocols/AI Interface/Sovereign Command Protocol]]
- [[Council Chamber/AI Interface/AI Interface Change Log]] (primary callback source)
- [[Council Chamber/AI Interface/Continuity Log]] (Tier 3-4 only — process patterns)
- [[Council Chamber/AI Interface/AI Interface Knowledge Map]]

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Frontmatter contrast fields required.
- Footer internal contrast block required.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- Add activation edge cases here.
-->
