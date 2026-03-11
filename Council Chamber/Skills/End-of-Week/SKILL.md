---
name: End-of-Week
aliases:
  - Steward Review
description: Weekly intel-led sovereignty review - {{AI_INTERFACE_NAME}} briefs each engagement from live ecosystem data, Sovereign speaks freely. 3 this-week engagements (Inner State + Creation, Operations + Collaborations, Resource + Trajectory), 2 next-week engagements (Calendar Sweep, Priority + Forward Flow), then Sovereign Command update.
status: active
tier: operational
cadence: weekly (Fridays primary, Saturdays backup, pre-trip as needed)
links:
  - [[Council Chamber/Protocols/Session/End-of-Week Protocol]]
  - [[Sovereign Command]]
  - [[Council Chamber/Protocols/AI Interface/Sovereign Command Protocol]]
  - [[Library/North Star]]
---

# End-of-Week Skill

**Purpose:** Execute the weekly intelligence review. {{AI_INTERFACE_NAME}} pulls live data for each engagement and presents a compact briefing before any prompting - the Sovereign responds from context, not memory. The review produces a distilled Most Alive Next Move that directly updates Sovereign Command.

**Trigger:** Friday (primary), Saturday (backup), or early in the week before a trip. Sovereign invocation on any day is valid.

**Output:** Updated `Sovereign Command.md` + logged refresh in `Council Chamber/AI Interface/Sovereign Command Refresh Log.md`.

**Architecture note:** Data pull -> briefing -> free speech is the three-beat pattern for every engagement. This design separates the intelligence layer from the input layer.

---

## Steps

### Step 0 - Initialize

Verify the day (soft gate). If not Friday, Saturday, or a declared pre-trip day, inform the Sovereign but do not block. Sovereign invocation overrides.

Run the deadline scan (if scripts are set up):
```
node "scripts/scan-deadlines.mjs"
```
Surface any items overdue or due within 7 days as silent background context - do not read the full list aloud unless relevant to an engagement. If the script is not available, proceed without it.

Run the collaboration dashboard sync (if scripts are set up):
```
node "scripts/calendar-sync.mjs" --dashboards 7
```
If this errors or the script is not available, note it and proceed - collaboration dashboards will simply show their last-saved state.

Check `Council Chamber/Skills/Ecosystem Update Check/sync-state.json`. If `last_check_date` is null or more than 30 days ago, surface it once before the review begins: "Ecosystem update check is overdue. Want to run it before we start or after?" Do not block the review. One mention only.

State the session: "Beginning End-of-Week Review - 3 this-week engagements, 2 next-week engagements, then Sovereign Command update."

**Parallel data pull:** Fire all 7 workers simultaneously. Hold results — do not present yet. Workers feed the engagement briefings in Steps 1-5.

- **Worker 1 — Session logs:** Scan `Vault (Archive)/Session Logs/` for files created in the past 7 days — note build/creation activity and structural changes
- **Worker 2 — AI Interface Change Log:** Read `Council Chamber/AI Interface/AI Interface Change Log.md` filtered to the past 7 days — flag execution-density pattern if consecutive heavy sessions appear
- **Worker 3 — Transcripts:** Check transcription service for any new transcripts in the past 7 days (if using Transcription Module) — coaching sessions, recorded calls, notable conversations
- **Worker 4 — Operations + Collaborations:** Read primary business/projects dashboard and active collaboration dashboards in `Collaborations/` filtered for recent movement
- **Worker 5 — To-Do Dock + Pending Plans:** Scan `To-Do Dock.md` for completed/stale/new items; scan `Pending Plans/` for plans that moved, resolved, activated or need attention; read `Council Chamber/AI Interface/Field Decisions.md` filtered to this week
- **Worker 6 — North Star + Operations finances:** Read `Library/North Star.md` for active 0-3 month horizons and Drift Check prompts; scan `Operations/` for financial notes updated this week
- **Worker 7 — Ecosystem SDK intelligence:** Check for Agent SDK changelog updates or ecosystem updates since last review; surface relevant deltas only

All workers complete before any briefing begins.

---

### Step 1 - THIS WEEK: Engagement 1 - Inner State + Creation

**Data pull (before prompting):**
Using Worker 1, Worker 2 and Worker 3 results from Step 0.

**Briefing:**
Two layers, presented in sequence:

1. **Scan line** - A single sentence listing up to 10-15 specific items from the data pull, comma-separated. Raw and comprehensive - surface coverage so nothing slips through. Format: "This week's raw signal: [item, item, item ...]"

2. **Intel summary** - 2-3 distilled bullets with pattern-level observations. "Here's what I see from this week in your inner state and creation lane: [2-3 bullets]"

The scan line surfaces everything; the Sovereign may recognize something to speak to. The intel summary distills the pattern. Both are always present.

**Themes (offer as light prompts after the briefing):**
- Body, energy, nervous system - how did this week feel internally?
- Creatorship and output - what was made, built, expressed, or advanced?
- Aliveness signal - what felt most joyful, in-flow, or energizing?

**Sovereign speaks freely.** {{AI_INTERFACE_NAME}} reflects briefly (1-2 observations) then moves to Engagement 2.

---

### Step 2 - THIS WEEK: Engagement 2 - Operations + Collaborations

**Data pull (before prompting):**
Using Worker 4 and Worker 5 results from Step 0.

**Briefing:**
Two layers:

1. **Scan line** - Single sentence, up to 10-15 comma-separated specific items from the data pull: "This week's raw signal: [item, item, item ...]"
2. **Intel summary** - "Here's the operations and collaboration snapshot for this week: [2-3 bullets]"

**Themes:**
- Business and projects lane - offers, workshops, advisory, revenue movement?
- Collaborations - active partners, relationships - notable conversations, alliances, movement?
- Structure and governance - Pending Plans, To-Do Dock, ecosystem infrastructure progress?

**Sovereign speaks freely.** {{AI_INTERFACE_NAME}} reflects briefly, moves.

---

### Step 3 - THIS WEEK: Engagement 3 - Resource + Trajectory

**Data pull (before prompting):**
Using Worker 6 results from Step 0. Note: this is a pattern and alignment read, not an accounting report.

**Briefing:**
Two layers:

1. **Scan line** - Single sentence, up to 10-15 comma-separated specific items: "This week's raw signal: [item, item, item ...]"
2. **Intel summary** - "Here's the resource and trajectory read for this week: [2-3 bullets on resource posture, financial movement, and 0-3 month horizon alignment]"

**Themes:**
- Resource - wealth flow, financial ease or friction?
- North Star horizon check - do this week's moves track with the 0-3 month objectives?
- Drift check - what felt slightly off, heavier than it should, or under-engaged?

**Sovereign speaks freely.** {{AI_INTERFACE_NAME}} reflects briefly. Hold the drift check as sensing, not solving - do not pivot into problem-solving.

---

### Step 4 - NEXT WEEK: Engagement A - Calendar Sweep

**Data pull (before prompting):**
```
node "scripts/calendar-sync.mjs" --upcoming 7
```
If this script is not available, surface a note and offer to proceed with manual input from the Sovereign.

Cross-reference with deadline scan output from Step 0 - flag any upcoming deadlines that land in this 7-day window.

**Briefing:**
Present the next 7 days as a compact view:
- Key events and commitments
- Scheduled calls or collaboration touchpoints
- Notable white space
- Deadline flags

"Here's what's on the board for the next 7 days: [compact calendar view]"

No questions. Present the data. Sovereign reacts freely.

---

### Step 5 - NEXT WEEK: Engagement B - Priority + Forward Flow

**Data pull (before prompting):**
- Synthesize the signal from Engagements 1-3 - what themes emerged as most alive or most significant?
- Read current `Sovereign Command.md` - what is the current primary move?
- Cross-reference with the upcoming calendar (Engagement A) and current North Star horizons

**Briefing:**
"Based on what you've shared and what I see, here's what seems most alive heading into next week: [1-3 distilled signals from all prior engagements]"

**Themes:**
- What is the Most Alive Next Move for next week?
- Any adjustments to current approach or posture?
- Anything calling curiosity that wants space?

**This engagement is the direct source for the Sovereign Command update.** Listen for the primary move the Sovereign names or confirms.

---

### Step 6 - Sovereign Command Update

Based on Engagement B, propose a revised `Sovereign Command.md`:
- `Most Alive Next Move (Primary)` - the single most alive, high-momentum item named or confirmed in Engagement B
- Any secondary/admin items that surfaced and clearly meet the threshold for inclusion (high-momentum, action-ready, not just noise)
- Omit any section where no live candidate emerged

Present the full proposed Sovereign Command content before writing. Sovereign approves, adjusts, or declines.

On approval:
1. Write the updated `Sovereign Command.md`
2. Log the refresh pass in `Council Chamber/AI Interface/Sovereign Command Refresh Log.md` with today's date and a brief note on what changed
3. Follow all rules in `Council Chamber/Protocols/AI Interface/Sovereign Command Protocol.md`

If the Sovereign declines, hold the current Sovereign Command unchanged. Note it and move to Step 7.

---

### Step 7 - Handoff

Brief summary of what emerged across the full review - 2-4 lines. What was most alive, what shifted, what is the primary move.

"Ready for your Weekly Story reflection, or close out when ready."

---

## Planning Mode Rule

Status is `active`. This skill is authorized to execute without additional approval gates. Step 0 day confirmation is a soft gate - Sovereign invocation overrides. The only hard gate is Step 6: Sovereign must explicitly approve the Sovereign Command update before it is written.

---

<!--
Internal Contrast Layer

- {{AI_INTERFACE_NAME}} briefs first. Sovereign speaks second. Never reversed.
- The briefing is compact intel, not a raw data dump. Filter before presenting.
- Drift check (Engagement 3, Theme C) is sensing, not solving. Do not pivot into action items.
- Sovereign Command update is proposal-first, always. Do not pre-write the update before the Sovereign confirms.
- Engagements are soft - if a theme does not land, pass without friction. If the Sovereign wants to go deeper, follow.
- Calendar-sync.mjs --future 7 may fail if tokens are expired, network is unavailable, or script is not set up. Surface the error and offer to proceed with Sovereign's verbal input. Do not halt the full review.
- The End-of-Week Review is the intel ring. A Weekly Story session (if the Sovereign runs one) transforms this material into narrative. They serve different purposes.
- Business dashboard path in Engagement 2 is intentionally generic. Each Sovereign adapts it to their domain structure.
-->
