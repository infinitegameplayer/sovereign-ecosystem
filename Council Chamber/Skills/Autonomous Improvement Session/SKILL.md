---
name: autonomous-improvement-session
description: Use when you have extra session capacity and want to set your ecosystem improving without active attention. Sovereign-invoked only, never scheduled. For low-stakes, additive, vault-internal improvement work where no per-item approval is needed. Every menu item carries one verb (Acts, Reports or Proposes) and the decision board arrives inline in the closing message.
status: active
tier: foundational
contrast_tier: 1
external_orientation: true
version: 2.0
---

# Autonomous Improvement Session

**Purpose:** Run a set-and-forget session that improves your ecosystem without your active attention, on extra capacity. The work is low-stakes, additive, vault-internal hygiene and improvement. Every menu item carries one verb. **Acts** items land their edits. **Reports** items fold their findings into the decision board. **Proposes** items surface for the Sovereign's yes and do not run. The skill is a recursive flywheel: the research rotation grows the menu every cycle, fast and wide, and execution authority moves slowly, one ratified verb at a time. Wide net for ideas. Narrow gate for action.

**Trigger:** Sovereign-invoked when extra capacity exists: heading out, end of week with capacity to burn, end of session with budget left. Never scheduled, never auto-fired.

**Inputs:** The log at `Council Chamber/Logs/Autonomous Improvement Log.md` (state lives in its frontmatter). Optional hint: an item count, an item name or "full sweep".

**Outputs:** One run entry at the top of the log body, and the decision board rendered inline in the closing message. The board is stored once: inline, and in the run entry. There is no backing board file. Acts items leave their edits in their target files.

**Output doctrine.** No skill-generated report file lands in the Inbox. The Inbox is a routing queue for genuine inbound notes, not a place for this skill's output. The run entry plus the session record (a git commit when your vault is git-tracked) is the durable breadcrumb. Write a standalone report only when a specific run genuinely warrants one.

---

## Constraints (the Hard Ceiling)

The ceiling is drawn by action type, not location. Destructive, voice-bound and outward-broadcast actions stay forbidden forever. Additive, reversible, build-verified correction opens as a gated lane that earns its way one proven class at a time.

### The Permanent Floor (never climbs)

No verb move, accepted candidate or forward rule breaches these. Ever.

- No change to copy, voice or content prose on any live surface. Outward words are voice-bound.
- No deletions of anything, in the vault or any external repo.
- No moves of canonical governance files: codices, the Constitution, the Charter, protocols, canonical content. Those require Sovereign approval. This does NOT cover implemented Pending Plan archival. Moving a `status: implemented` plan from the active chamber to the Vault archive is operational lifecycle closure, not a governance move: it stays inside the vault, it is reversible, it deletes nothing and it changes no governance. T2-9 executes that archival with a move-audit sweep and an index regen.
- No outward broadcasts. Email sends, social posts, anything that speaks to the world.
- No direct push to any main branch. Every external change goes through a build-verified pull request.
- No self-modification. The skill never edits its own catalog, its verbs, this SKILL.md, its `CLAUDE.md`, its `references/` files, your auto-memory `MEMORY.md` or your settings file on its own. Those move only after the Sovereign ratifies a board entry, in a return session that shows the diff inline first.

**Scope of the self-modification ban.** It covers this SKILL.md, its CLAUDE.md, every reference and catalog file and any script that applies its rules. The deletion and write bans bind shell commands and every file type, not only the editor tool.

### The Graduated Lane (opens, earns its climb)

Two classes of action, both additive or corrective, never voice-bound, always reversible.

- **Read and route.** Reading reports and routing them into lanes. Fully safe.
- **Additive or corrective technical fixes to external repos**, executed as build-verified pull requests, one proven class at a time through propose, auto-PR and auto-merge, only after the Sovereign authorizes it. The build gate never climbs away; the merge click does.

Read a repo's default branch before opening a pull request. Never assume it is called main.

### Operational Constraints

- Sovereign-invoked only. The skill never auto-fires and never schedules itself.
- Acts items are additive edits or in-place corrections traceable through git. Reports items are read-only, and their findings fold into the board.
- A candidate that would breach the Floor stays in the run entry's Patterns Noticed and never reaches the board.
- An item that errors is logged in the run entry and skipped; the run continues.
- A missing or malformed log halts the run at Step 1. State integrity is foundational.
- Stage and commit only the paths this run touched. Never add everything, because sibling sessions may hold uncommitted work.

---

## Operating Principle (read first, governs the rest)

Load this skill's `CLAUDE.md` first. It holds the operating mindset, the posture to run with. Read it, then this principle, then the steps.

This is an autonomous improvement and hygiene engine. The default verb is DO, not propose.

If an action is additive, reversible, vault-internal and touches no deletion, no canonical-governance ratification, no voice and no outward surface, execute it and record it in the run log. Do not ask. Routing an Inbox item to its container, archiving an implemented plan, fixing a reference to a retired artifact, adding a missing index entry, normalizing a slug: these are the work, not proposals. If something is broken or missing and the clean fix is obvious and safe, make the fix.

Surface to the Sovereign only two things. First, a genuine judgment fork: the routing heuristics conflict or none clearly applies; the situation is materially novel against prior clean runs; intent is ambiguous and the choice would set a pattern; or the action is reversible but high-impact (many files at once, or a high-inbound-reference artifact). Absent one of those, it is not a fork. Second, anything that touches the Permanent Floor. The two reflexes never blur: safe work is act-then-show, Floor-class work is surface-then-wait. "Do not ask" is never license to act on a Floor item, and the Floor's existence is never license to ask about safe work near it. A clean run leaves Your decisions near empty, because the safe work is already done and sits in Done.

The Permanent Floor (Constraints) is absolute. Everything safe above it is yours to execute: do it, then log it.

---

## When to Use

- Sovereign says any of: "run autonomous improvement", "set and forget", "burn the rest of my capacity on improvement work", "I'm heading out, run improvement".
- Sovereign has answered the prior run's board and wants the answers landed (the return session).
- Sovereign wants a single menu item run by name.

---

## The Menu and the Verbs

The menu lives in [[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/index]], one file per bundle so a worker loads only its own. The index is the one list of item IDs. Open the files of the selected items at Step 2, never the whole catalog.

- **Acts.** The orchestrator lands the edit, one item at a time, and logs it. Every Tier 1 item, plus T2-1 (Inbox routing) and T2-9 (implemented-plan archival).
- **Reports.** A read-only scan whose findings fold into the board. The Tier 2 default.
- **Proposes.** The item does not run; it surfaces on the board for the Sovereign's yes. The entry verb for anything voice-bound, structural or outward-facing. No starter item carries it.

An item's verb sits in its `**Verb:**` line. Where the line is absent the tier default holds: Tier 1 Acts, Tier 2 Reports. A verb moves only through a ratified board answer, never by the skill's own hand (The Return Session, below). A verb line that does not read as one of the three words does not run: it lands in Your decisions until it is fixed.

An Acts item still parks its judgment forks. It does the safe part, puts the fork in Your decisions with what the Sovereign needs to rule and carries on with the rest.

Read [[Council Chamber/Skills/Autonomous Improvement Session/references/menu-and-verbs]] and follow it at this step.

---

## The Decision Board

The board is delivered inline, in full, as the run's closing message. The conversation is the surface and the run entry is the record. There is no third copy. Resolved decisions log to the run entry.

Four buckets, numbered the same on the board and in the run entry. Every heading renders, in order, even when empty ("None this run.").

1. **Done.** What the run did on its own, each line reversible through git. A record to skim, not a decision. As autonomy widens this bucket grows and Your decisions shrinks. That is the flywheel working.
2. **Your decisions.** Genuine judgment forks, anything touching the Floor, Proposes items that came due and the menu candidates, skill refinements and verb moves you recommend. The Sovereign accepts, declines or reshapes each. Near empty on a clean run.
3. **Your hands.** Only what the Sovereign alone can physically do: a connector toggle, a payment, a credential, a sign-in. Before an item lands here, ask whether the agent can do it on the Sovereign's word. If so, it is a decision in bucket 2 ("say go and I will do it"). A pull request merge is a decision too: the Sovereign approves it in bucket 2 and the agent merges it.
4. **Plans to approve.** Anything bigger than one session, or any governance, memory or CLAUDE.md class change, as a cliff-note asking "approve plan creation?". Only plans you recommend, each with the reason.

Patterns Noticed lives in the run entry only, never on the board.

**A Your-decisions entry exists because the decision is genuinely the Sovereign's, or because it touches the Floor.** A technical call the agent is competent to make belongs in Done, already done, in one line. Every Your-decisions and Plans entry carries at least the situation, the recommended move and the main alternative weighed (the [[Council Chamber/Protocols/Governance/Three Solutions Rule]] floor), and a line `Verified: <check>, <result>` naming the live check its claim passed (Step 7). A claim the session cannot check says so and names the instrument that could. Done lines and Your-hands items carry none.

Read [[Council Chamber/Skills/Autonomous Improvement Session/references/blast-radius]] and follow it at this step.

---

## Steps

### Step 0: Due scan (every run, before the menu, outside the budget)

Read [[Council Chamber/Skills/Autonomous Improvement Session/references/step-0-due-scan]] and follow it at this step.

### Step 1: Load state

Read [[Council Chamber/Skills/Autonomous Improvement Session/references/step-1-load-state]] and follow it at this step.

### Step 2: Select and announce

Read [[Council Chamber/Skills/Autonomous Improvement Session/references/step-2-select-and-announce]] and follow it at this step.

### Step 3: Acts items, in sequence

Run each Acts item per its catalog spec, one at a time on the orchestrator, so no two edits collide. A bundle's Acts items (T1-8 in B1) run here too. An editor worker, when one is warranted, runs alone with `model` set. When a genuine judgment fork appears, do the safe part, park the fork to Your decisions with what the Sovereign needs to rule and continue with the rest. For each edit, note a fix check for Step 8: the file, and the cheapest check that fails if the fix is undone (the broken text is absent, or the corrected text is present). The check has to fail on the pre-fix file, or the next re-check cannot tell whether the fix held.

### Step 4: Reports items, in parallel

Read [[Council Chamber/Skills/Autonomous Improvement Session/references/step-4-reports-items]] and follow it at this step.

### Step 5: Research rotation

One category per run, the least recently researched in `research_state`. One Sonnet worker returns a self-ranked top 5, pointed in order at a live defect in the category (with the file and the check that shows it), a duplicate between existing menu items and only then a new item, which has to beat both. The orchestrator fixes each Acts-safe live defect now, in this run, and logs it in Done with a fix check; the rest go to Your decisions. Set `research_state` to today. The run entry records the yield and the fix rate. Categories and the ground-truth gate: [[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/research]].

### Step 6: End-of-run reflection

One pass after Steps 3 to 5. Ask two questions of everything the run touched. Did running these items surface an improvement type worth adding to the menu? Did running the skill surface a defect, friction or gap in the skill itself (a worker timed out, eligibility missed an item, a spec sent a worker to the wrong output, the run entry wanted a field)? Sort the answers into menu candidates, each with a proposed verb and bundle, and skill refinements, each naming the friction observed and the proposed SKILL.md or catalog change. Both go to Your decisions, and only the ones you recommend.

### Step 7: Synthesize the board

Read [[Council Chamber/Skills/Autonomous Improvement Session/references/step-7-synthesize-the-board]] and follow it at this step.

### Step 8: Write the log entry

Read [[Council Chamber/Skills/Autonomous Improvement Session/references/step-8-write-the-log-entry]] and follow it at this step.

### Step 9: Commit, then present the board

Read [[Council Chamber/Skills/Autonomous Improvement Session/references/step-9-commit-then-present-the-board]] and follow it at this step.

---

## The Return Session and the Verb Moves (Sovereign-triggered)

Read [[Council Chamber/Skills/Autonomous Improvement Session/references/return-session]] and follow it at this step.

---

## Coming from 1.x

Read [[Council Chamber/Skills/Autonomous Improvement Session/references/coming-from-1x]] and follow it at this step.

---

## Log Structure

Single file at `Council Chamber/Logs/Autonomous Improvement Log.md`. Its frontmatter holds state; its body holds run entries, newest first.

**Retention rule.** At session open, when the log body exceeds about 1200 lines, compress the oldest full run entries into one-line summaries (run number, date, items executed, board outcome) until the body sits under 1000 lines, keeping the newest 8 runs in full. Frontmatter state is never compressed. The compression runs as part of the session; it needs no separate approval. The log that watches other logs' rotation carries its own window.

Read [[Council Chamber/Skills/Autonomous Improvement Session/references/log-structure]] and follow it at this step.

---

## External Orientation

Read [[Council Chamber/Skills/Autonomous Improvement Session/references/external-orientation]] and follow it at this step.

Two external write forms are gated:

- A pull request only. Read the repo's default branch first. Never push to it directly.
- An issue close only when the condition that filed the issue has cleared, with evidence in the closing comment.

---

## Planning Mode Rule

Status is `active`. Execution is authorized without per-invocation approval. Sovereign invocation is the only gate. Acts and Reports items are pre-approved by design, inside the Hard Ceiling. New menu items, verb moves and edits to this skill's own files need Sovereign ratification through the board before they land.

---

## Model Routing

- The orchestrator runs at the tier you opened the session with. It owns Step 0, every ground-truth gate, synthesis, the board and every commit.
- Scan, research and editor workers run on Sonnet, with `model` set explicitly on every subagent dispatch. Never silently inherit. Every worker prompt says: run single-context, do not spawn subagents.
- Mechanical lookups and deterministic commands run on Haiku.
- No worker runs above the orchestrator's tier.

---

## Refinements

Read [[Council Chamber/Skills/Autonomous Improvement Session/references/refinements-log]] and follow it at this step.
