# {{AI_INTERFACE_NAME}} Activation Protocol

Purpose: Bring {{AI_INTERFACE_NAME}} online with governed context, explicit consent and clear operational scope.

## Preconditions
- Constitution and Operating Charter are accessible.
- Governance Core capsule is accessible.
- North Star is accessible.
- Knowledge Map is accessible.
- Skills Index is accessible.
- AI Interface Engagement Checklist is accessible: `[[Council Chamber/Checklists/AI Interface Engagement Checklist]]`

## Steps
1. Load governance anchors:
   - `[[Council Chamber/Governance/Constitution - Sovereign Ecosystem]]`
   - `[[Council Chamber/AI Interface/Operating Charter]]`
   - `[[Council Chamber/AI Interface/AI Interface Knowledge Map]]`
2. Load current orientation:
   - `[[Primer]]`. Read first. The canonical forward handoff: Most Alive Next Move, In Execution, Active Commitments, Parked, Session Opener. On a fresh download it holds the onboarding orientation.
   - `[[Sovereign Command]]`. The minimal live-signal glance of what is most alive.
   - The recent git commit bodies (`git log`). Backward callbacks for meta-awareness. Use gap-adaptive tier logic (see below).
   - `[[Library/North Star]]`. Background orientation only. Do not prompt unless explicitly requested.
   - Active quests (if any)

   **Gap-Adaptive Tier Logic** (gap = today's date minus most recent commit date):
   | Tier | Gap | Depth | Sources |
   |---|---|---|---|
   | 1 | 0 days (same day, session B+) | Last 2-3 commit bodies | Primer + Sovereign Command |
   | 2 | 1-3 days | Last 5 commit bodies | Primer + git log scan |
   | 3 | 4-7 days | Full recent commit window | Primer + git log |
   | 4 | 7+ days | Full recent commit window | Primer + git log |

   **Execution-density drift flag:** If the most recent commit bodies show consecutive heavy-execution sessions (implementation, coding, building), flag at activation that humor and meta-awareness are at highest drift risk. Both are mandatory in execution-mode sessions, not rewards for finishing.
3. Confirm mode:
   - Plan / Execute / Review
4. Confirm consent and scope:
   - What {{AI_INTERFACE_NAME}} may change
   - What must remain read-only
5. Run Activation Checklist.
5b. Run AI Interface Engagement Checklist (mode, tone, humor, illumination cadence). After activation 5, this is optional unless requested.
6. Present or update `Sovereign Command` (proposal-first):
   - **End-of-Week check:** If today is the end of the week, surface `[[Council Chamber/Protocols/Session/End-of-Week Protocol]]` as part of this SC briefing. The End-of-Week Protocol does not appear in `Sovereign Command.md` - it is {{AI_INTERFACE_NAME}}-surfaced during activation only.
   - Use `[[Council Chamber/Checklists/Sovereign Command Review Checklist]]` during the refresh so all relevant source lanes are re-scanned, even if some sections are currently omitted
   - Present the lean command surface starting with `Most Alive Next Move`, then only the currently earned promoted sections
   - Do not prompt on `North Star` during activation unless explicitly requested; use the North Star Recalibration flow for North Star updates/refinements
   - Confirm whether session intent is already known or should be sensed/discovered by reviewing what feels most alive in `Sovereign Command`
   - Propose updates to secondary/admin sections only as support context
   - Omit sections with no clear high-signal item rather than padding `Sovereign Command` with low-value filler
   - Record the refresh in `Council Chamber/AI Interface/Sovereign Command Refresh Log.md` when a meaningful refresh pass occurs
   - Apply `Sovereign Command` edits only with approval
7. Run Quick Support Sweep (proposal-only, default) and produce a lightweight {{AI_INTERFACE_NAME}} Status Report:
   - Goal: support the active `Sovereign Command` direction, not replace it
   - Inbox scan (light):
     - Detect obvious new/changed items in `Inbox/` (manual-triggered scan, not an always-on watcher)
     - Surface blockers, approvals or opportunities relevant to today's command surface
   - Transcription service check (optional - requires Transcription Module):
     - Read `Council Chamber/Tools/Support Files/transcription-sync-state.json`
     - Query your configured transcription service for new transcripts not yet ingested
     - If new transcripts found: surface count, titles, dates and durations - proposal only
     - Propose routing per Transcript Inbox Protocol; no auto-ingest
     - Update sync state only after approved ingestion completes
   - Active focus visibility check:
     - Surface active quests that materially affect today's move
   - Inbox index drift (only if it affects current visibility):
     - Compare `Inbox/Index.md` listings to current `Inbox/` contents
     - Propose index updates (no execution unless approved)
8. Present approval gates for support sweep recommendations:
   - Approve none / some / all proposals
   - Confirm what may be executed now vs deferred to closeout
   - Approve optional Extended Startup Sweep now (or defer to Session Closeout)
9. Extended Startup Sweep (optional, proposal-only; run only if requested/approved):
   - Consult review:
     - Identify Consults with placeholder analyses, completed downstream implementations or likely routing/archive candidates
     - Propose status updates / moves / Vault eligibility (no execution)
     - Flag Consults that may qualify for same-session closure after downstream artifacts are created
   - Transcript/Coaching Inbox review (when present):
     - Apply `[[Council Chamber/Protocols/Transcription Module/Transcript Inbox Protocol]]` proposal-first
     - Propose routing to Library holding lanes
   - Light archival eligibility preflight:
     - Surface `status: complete` items and obvious Vault descent candidates
     - Do not perform archival or flywheel execution during activation unless explicitly approved for this session
   - Deeper Inbox index drift check:
     - Propose broader index cleanup not required for today's command surface
10. Create or update AI Interface Readiness Snapshot.

## Activation vs Closeout (Lightweight Default)
- Activation is the preferred time for:
  - Sovereign Command presentation and proposal-first refresh
  - selecting what to work on this session
  - quick support scans that clarify or unblock today's command surface
  - limited proposal-first routing/status recommendations when they materially affect today's work
- Session Closeout is the preferred time for:
  - deferred activation sweep recommendations
  - deeper Inbox/Consult/transcript review and cleanup
  - archival/flywheel execution
  - final status changes and moves
  - reconciliation and cleanup after the session's work
- Exception: If the Sovereign explicitly approves an activation-time cleanup pass, {{AI_INTERFACE_NAME}} may execute a small approved subset during activation.

## Startup Sweep Sources (Default)
- `Inbox/` (primary)
- Your configured transcription service - new transcript check via API (approval-gated ingestion; requires Transcription Module)
- Other creator-designated landing zones inside the Sovereign Ecosystem (for example collaboration export drop points)
- Additional sources may be added as habits stabilize; detection remains manual-triggered until automation is explicitly approved.

## Ready Signal
{{AI_INTERFACE_NAME}} is online when:
- Governance anchors loaded
- Mode declared
- Scope and consent confirmed
- `Sovereign Command` primary layer presented or refresh proposals surfaced
- Quick Support Sweep completed and recommendations presented (Extended Startup Sweep optional)
- Readiness Snapshot updated

## Output
- Ready confirmation
- {{AI_INTERFACE_NAME}} Status Report (lightweight by default; extended if approved)
- Sovereign Command presentation / update proposals
- Updated Readiness Snapshot

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Include contrast fields in frontmatter for foundational updates.
- Store deeper contrast reasoning in the footer block when needed.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- Add contrast notes here if needed.
-->

## Continuity Check
- `[[Primer]]` is the primary activation source, read first at every session. It carries the forward handoff. `[[Sovereign Command]]` is the live glance. Git commit bodies (`git log`) are the backward callbacks for meta-awareness, read at every activation using gap-adaptive tier logic. Any `[[Vault (Archive)/Session Logs/Index]]` is a frozen historical archive from the pre-slim era, read only for deep historical callbacks.
- Auto-memory (the persistent file-based memory system at `~/.claude/projects/[encoded-cwd]/memory/`) carries forward user preferences, feedback patterns, and project context across sessions. Process-pattern lessons live here, not in a dedicated continuity log.



