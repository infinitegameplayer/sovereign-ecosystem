---
name: Weekly Story
description: Generate a weekly narrative that captures the week's real movement across life, work and creation in story form.
status: active
tier: operational
cadence: weekly (Fridays primary, Saturdays backup)
---

# Weekly Story Skill

**Purpose:** Generate a weekly narrative that captures the sovereign's real movement — across life, work and creation — in story form. Not a report. A narrative that reveals the shape of the week and the thread moving forward.

**Trigger:** Friday (primary), Saturday (backup). Typically runs after End-of-Week review, using that session's material as source data.

**Output:** Story file at `Scriptorium/Weekly Stories/YYYY-MM-DD - [Title].md`

**Hard gate:** Sovereign must explicitly confirm ("Save it" or equivalent) before the file is written.

---

## Steps

### Step 1 - Data Pull

Fire 6 workers simultaneously. Hold all results — do not present yet.

- **Worker 1 — Calendar (halt on error):** Pull this week's calendar events. If calendar data is unavailable, surface the error and ask the Sovereign to provide the week's key events manually before continuing.
- **Worker 2 — Transcripts:** Check transcription service for any recordings or voice captures from this week — coaching sessions, calls, notable conversations
- **Worker 3 — Collaborations + external:** Read active collaboration dashboards for movement, conversations and external thread activity this week
- **Worker 4 — Operations + creation:** Read primary business/projects dashboard and any creative output this week — offers, sessions, articles, builds, anything made
- **Worker 5 — AI Interface Change Log + session logs:** Scan `Council Chamber/AI Interface/AI Interface Change Log.md` and `Vault (Archive)/Session Logs/` for this week — internal movement, decisions, completions, structural changes
- **Worker 6 — Continuity (last 3 stories):** Read the 3 most recent files in `Scriptorium/Weekly Stories/` — extract recurring themes, open threads, named arcs

All workers complete before generation begins. If Worker 1 errors, pause and resolve before continuing.

---

### Step 2 - Filter and Map

From the combined worker results:

1. **Filter mundane admin** — remove scheduling logistics, routine maintenance, low-signal noise. Keep only what moved something or meant something.
2. **Map to themes** — group remaining material into thematic clusters: creation and output, connection and relationship, challenge and friction, movement and momentum, turning points and decisions.
3. **Load continuity** — from Worker 6, identify any open threads, recurring patterns or named arcs from the last 3 stories. Note which threads this week advances, closes or ignores.

Do not present this step to the Sovereign. It is internal structuring only.

---

### Step 3 - Generate Narrative

Write a cohesive weekly narrative in three parts:

**Opening scene** — one short paragraph. Place the reader inside a specific moment from this week that carries the week's central energy. Concrete, sensory where possible. Not a summary — a door in.

**Week's chronicle** — 3-5 paragraphs. Move through the week's major themes in sequence or by resonance (not necessarily chronological). Each paragraph carries one theme forward. Continuity threads from Worker 6 can be woven in without announcing them. The tone is earned and direct — not performed reflection.

**Thread forward** — one short paragraph. Name what is unresolved, what is building, what the sovereign is walking into next week. Not a task list. The living edge.

**Frontmatter:**
```yaml
---
title: ""
date: YYYY-MM-DD
series: Weekly Stories
tags: [weekly-story, narrative]
---
```

---

### Step 4 - Present for Approval

Present the full story text to the Sovereign — frontmatter included.

Do not write the file yet.

Sovereign responds with one of:
- "Save it" (or equivalent) → proceed to Step 5
- Edits or requests for revision → revise and re-present
- Decline → hold, do not write

---

### Step 5 - Write and Log

On approval:

1. Write the story to `Scriptorium/Weekly Stories/YYYY-MM-DD - [Title].md`
2. Confirm the file was written successfully
3. Note the filename in the session summary or AI Interface Change Log entry if a closeout follows

---

## Planning Mode Rule

Status is `active`. Authorized to generate and present without additional approval gates. The only hard gate is Step 4 — Sovereign must explicitly confirm before the file is written.

---

## Related Protocols / Skills

- [[Council Chamber/Skills/End-of-Week/SKILL.md]] — primary data source when run in sequence
- [[Council Chamber/Protocols/Session/Session Closeout Protocol]] — typically follows this skill on Fridays
- `Scriptorium/Weekly Stories/` — output location

<!--
Internal Contrast Layer
- This is not a report. Summary-first thinking produces flat prose. Begin with a scene.
- Continuity threads are woven in — not announced. "As I mentioned last week" is the wrong move.
- Worker 1 (calendar) is the only hard halt. All other worker failures are handled by proceeding with available data.
- The Sovereign's own words from transcripts or session logs are the richest source material. Use them.
- Three parts: door in, movement through, living edge. Do not collapse them into a single essay.
-->
