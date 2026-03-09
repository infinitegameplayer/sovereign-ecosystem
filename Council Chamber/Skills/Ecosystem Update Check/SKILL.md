---
name: Ecosystem Update Check
description: Fetch published updates from the Sovereign Ecosystem GitHub repo, present each one for review, and apply only what you explicitly approve. Nothing runs without your say-so.
status: active
tier: foundational
contrast_not:
false_twins:
anti_patterns:
boundary_conditions:
clarity_triggers:
---

# Ecosystem Update Check Skill

Purpose: Check for new updates published to the Sovereign Ecosystem and apply the ones that are relevant to your build. You review each update before anything changes. Your AI executes only what you approve.
Trigger: Run whenever you want to check for updates. No fixed schedule required — monthly is a reasonable default, or whenever something feels stale.
Inputs: `UPDATES/INDEX.md` from the public Sovereign Ecosystem GitHub repo. Local sync state at `Council Chamber/Skills/Ecosystem Update Check/sync-state.json`.
Outputs: A curated review of new updates, applied changes for approved items, updated sync state.
Status: active

---

## Steps

### Step 1 — Fetch the Update Index

Fetch the current update index from the public repo:

```
curl -s https://raw.githubusercontent.com/infinitegameplayer/sovereign-ecosystem/main/UPDATES/INDEX.md
```

If the fetch fails, surface the error and halt: "Could not reach the Sovereign Ecosystem repo. Check your internet connection and try again."

Read the local sync state file at `Council Chamber/Skills/Ecosystem Update Check/sync-state.json`.

If the sync state file does not exist yet, create it now with this content:

```json
{
  "last_check_date": null,
  "applied_updates": [],
  "skipped_updates": [],
  "deferred_updates": []
}
```

Compare the fetched index against `applied_updates` in sync state. Identify entries that are new — not previously applied, skipped or deferred.

If no new updates are found: report "No new updates since your last check ([last_check_date])." and stop.

---

### Step 2 — Present New Updates

For each new update, fetch the full update file:

```
curl -s https://raw.githubusercontent.com/infinitegameplayer/sovereign-ecosystem/main/UPDATES/[slug].md
```

Present each update in this format:

```
UPDATE: [title]
Type: [core / module / refinement / instruction]
Optional: [yes / no]
Prerequisites: [list or "none"]
Affects: [list or "general"]

What this is:
[one-paragraph summary from the update file]

What it adds or changes:
[bullet list from the update file]

How to implement:
[step list from the update file]
```

Group updates in this order: Core first, then Refinement, then Module, then Instruction.

Flag any update where `optional: false` with a note: "This is a recommended core update. Skipping it may affect how later updates apply."

Present all updates before asking for any decisions.

---

### Step 3 — User Selection

After presenting all updates, ask once:

"Which of these would you like to apply? You can approve all, approve specific ones by title or slug, skip any, or defer them to review later."

For each update, record the decision:
- **Approve** — will be implemented in Step 4
- **Skip** — will not be applied now or tracked for future prompting
- **Defer** — noted for next session; will surface again next time you run this skill

If no updates are approved: confirm the decisions, update sync state with skips and deferrals, and stop.

---

### Step 4 — Implementation

For each approved update, execute the `How to Implement` steps from the update file one at a time.

Before starting each update: confirm "Implementing: [title]."

After each step: confirm it is done before moving to the next.

After all steps for one update are complete: confirm "Update applied: [title]." before moving to the next approved update.

Do not batch steps across multiple updates. Finish one update completely before beginning the next.

If a step fails or is unclear, pause and surface the issue before continuing. Do not proceed past a failed step without explicit instruction.

---

### Step 5 — State Update

After all approved updates are implemented, write the updated sync state to `Council Chamber/Skills/Ecosystem Update Check/sync-state.json`:

- Set `last_check_date` to today's date (YYYY-MM-DD)
- Add newly applied slugs to `applied_updates`
- Add skipped slugs to `skipped_updates`
- Add deferred slugs to `deferred_updates` (replacing any prior deferred entry for the same slug)

Confirm the file was written.

Report: "Check complete. [N] update(s) applied. [N] skipped. [N] deferred. Sync state updated."

---

## Constraints

- Nothing is applied without explicit approval at Step 3.
- Updates are presented before decisions are asked for. You see the full picture first.
- Deferred updates surface again the next time you run this skill.
- Skipped updates are recorded and do not surface again unless you reset sync state.
- Module updates are always `optional: true`. They are never auto-applied.
- This skill fetches and reads from the public repo. It does not push or modify the repo.
- If a prerequisite for an update is not met, surface it clearly and ask how to proceed. Do not apply the update until prerequisites are confirmed.

## Planning Mode Rule

Status is `active`. Execution is authorized.
Step 1 (sync state initialization) runs automatically on first use. No prior setup required.

## Contrast Layer Integration (Mandatory)

Tier: 1 (foundational).

<!--
Internal Contrast Layer
- This skill presents and executes. It does not decide. The user decides.
- Skipped is not the same as deferred. Skipped updates do not resurface. Deferred ones do.
- Updates from the public repo are suggestions, not commands. The user's ecosystem is sovereign. An update that does not fit the build should be skipped without guilt.
- The fetch uses curl to the raw GitHub URL. No git clone, no repository checkout, no local branch required. The user does not need git installed or configured.
- Implementation happens step by step, one update at a time. Speed is not the priority. Correctness is.
- optional: false is a recommendation, not an override. The user still approves.
-->
