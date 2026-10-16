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

**Verbs are not Trust Levels.** A verb is scoped to one menu item. A Trust Level is scoped to an agent across the whole ecosystem, under [[Council Chamber/Governance/Constitution - Sovereign Ecosystem]] Article IV Section 4. The Constitution names the Permanent Floor that never climbs and the per-class climb gated on track record; this skill is one operational expression of both.

**Bundles.** Two per run: any bundle that has never run first, then the oldest date in `bundle_state`. With six starter bundles each comes round every three runs. A bundle's items run when their bundle runs and carry no window of their own. Standalone items keep their own eligibility and sit outside every bundle.

**The site lane keeps its own three words: propose, auto-PR, auto-merge.** It applies only when your ecosystem maintains external repos. Every site-fix class enters at propose. The build-verified pull request is the floor of every rung; only the merge click climbs away. Spec and class registry: [[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/site-lane]].

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

**Blast radius sets the explanation budget.** Size an explanation to what the change can break, which is a property of the diff, never a guess about what the Sovereign already knows.

- **Routine and reversible** (an index line, a slug, a routed note, a dead reference): one line. Batch them. Over-explaining safe work teaches the Sovereign to skim, and skimming waves through the one entry that mattered.
- **Judgment** (a pattern-setting choice, a nuanced routing call, an adoption): one paragraph. The situation, what doing nothing costs, the recommendation.
- **Consequential** (a ceiling, a credential, an outward send path, the Permanent Floor, a governance or CLAUDE.md class change, or this skill's own steps): the full ceremony, every time. The stake in the Sovereign's terms and never in machine terms. Three real options with doing nothing costed at its true price. The recommendation and what it gives up. The tell: how you would know this was wrong and what you would watch. Reversibility: whether it can be undone and how fast.

"I do not understand this" is a first-class answer and never a failure. The decision waits while the AI interface explains the change in plain terms, ideally predict-then-reveal. A gate the Sovereign cannot operate is not a gate.

---

## Steps

### Step 0: Due scan (every run, before the menu, outside the budget)

Read each due-dated client and surface only what is due, with the date and the recommended action. Clients: the security audit at 25 or more days since its last run (T2-20), and every active file carrying `next_review` once the date passes. Full spec: [[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/sentinels]]. This step never runs the maintenance it surfaces. A new client is one line here and one entry there, no new machinery.

**Optional extension: external-surface triage.** If your ecosystem maintains external repositories with issue tracking, add a triage here that queries open routine or health issues, clusters them by type and priority and routes each into safe-now, fix-via-PR and judgment lanes. It reads and routes. It never pushes to an external main branch. Close a monitor-filed issue only when the condition that filed it has cleared, with the evidence in the closing comment. A finding still true stays open, and the monitor comments on it rather than filing again. This extension stays off until you run external repos.

### Step 1: Load state

Read `Council Chamber/Logs/Autonomous Improvement Log.md`. Parse the frontmatter: `run_counter`, `last_run`, `research_state`, `bundle_state`, `priority_flags`, the `menu_state` scorecards and the item maps (`runtime_purge_surfaced`, `fix_checks`, `rulings`). If the log does not exist, halt and say: "Log file missing. Create the seed log per the SKILL.md and retry." A malformed log halts the run too: state integrity is foundational. When the log body passes about 1200 lines, apply the retention rule (Log Structure) now, before the run writes. Then re-check the fix checks the last three runs recorded (the Learning Loop) and mark each fix held, regressed, reverted or unverifiable; the result goes in the run entry's Fix re-check line.

### Step 2: Select and announce

Build the due list from the catalog and the log:

- **Condition-based items** run whenever their target is non-empty, never by timer.
- **Windowed standalone items** run once their window has passed since `last_run`.
- **Flagged items.** Anything in `priority_flags` is due regardless of window and lifts to the top. Consume the flag at Step 8 when the item delivers.
- **The two bundles** are the never-run ones first, then the oldest in `bundle_state`.

Rank the standalone items (flagged first, then furthest past their window) and take them up to a budget of 8, plus the two bundles. An item name from the Sovereign is the plan. A count honors the ranked list. "Full sweep" runs every due item and every bundle. A Proposes item does not run: it goes to Your decisions as "run it?". Open the catalog files of the selected items only.

Announce in one paragraph: "Running N items. Acts: [list]. Reports: [list]. Bundles: [ids]." It is the only Sovereign-facing message until close.

### Step 3: Acts items, in sequence

Run each Acts item per its catalog spec, one at a time on the orchestrator, so no two edits collide. A bundle's Acts items (T1-8 in B1) run here too. An editor worker, when one is warranted, runs alone with `model` set. When a genuine judgment fork appears, do the safe part, park the fork to Your decisions with what the Sovereign needs to rule and continue with the rest. For each edit, note a fix check for Step 8: the file, and the cheapest check that fails if the fix is undone (the broken text is absent, or the corrected text is present). The check has to fail on the pre-fix file, or the next re-check cannot tell whether the fix held.

### Step 4: Reports items, in parallel

Dispatch one read-only worker per due bundle and one per standalone Reports item or small group, each with its catalog file as the brief and the IDs of the Reports items it runs on one line, `Items: T2-4, T2-7`. The brief says that any Acts item in the file belongs to the orchestrator and is skipped. A read-only worker holds no write tools. Every worker prompt says: run single-context, do not spawn subagents. A worker that fans out returns narration about its children instead of findings, and per-item results get lost in the hop.

**Every scan returns, per item, a count, the instrument used and a reason if it did not run.** A quiet monitor is a claim of health. Read its run log for skipped checks and treat a skipped check as a finding. A worker that stops at its turn limit before returning every item is resumed once; an item still missing after that is logged as not run under Errors and blockers. Every finding carries its path, its class and the offending line verbatim, so it can be matched against the ledger of rulings. A finding that needs a Sovereign ruling becomes a Your-decisions entry, never a decision buried in a report.

**Databases and send tools.** A run reads databases through a read-only connection only. It never applies migrations and never calls any scheduler or send tool that publishes.

### Step 5: Research rotation

One category per run, the least recently researched in `research_state`. One Sonnet worker returns a self-ranked top 5, pointed in order at a live defect in the category (with the file and the check that shows it), a duplicate between existing menu items and only then a new item, which has to beat both. The orchestrator fixes each Acts-safe live defect now, in this run, and logs it in Done with a fix check; the rest go to Your decisions. Set `research_state` to today. The run entry records the yield and the fix rate. Categories and the ground-truth gate: [[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/research]].

### Step 6: End-of-run reflection

One pass after Steps 3 to 5. Ask two questions of everything the run touched. Did running these items surface an improvement type worth adding to the menu? Did running the skill surface a defect, friction or gap in the skill itself (a worker timed out, eligibility missed an item, a spec sent a worker to the wrong output, the run entry wanted a field)? Sort the answers into menu candidates, each with a proposed verb and bundle, and skill refinements, each naming the friction observed and the proposed SKILL.md or catalog change. Both go to Your decisions, and only the ones you recommend.

### Step 7: Synthesize the board

Aggregate the due scan, the parked forks, the Reports findings, the research candidates and the reflection into buckets 2 to 4; Done comes from the run's own work. A finding the Sovereign already ruled on is dropped and counted in the run entry, never raised again. Each Your-decisions entry names what was hit, the safe action already taken, the decision needed and a recommended forward rule. Apply the recommendation bar: a candidate you would not recommend goes to the run entry's Patterns Noticed as one line, or nowhere. An obvious placement gets one line (`Candidate: [name]. Recommended: [verb], [bundle]. Rationale: [one sentence]. Accept?`); an uncertain one gets three options, the recommendation and the tradeoff. Before an item goes to Your hands, ask whether the agent can do it on the Sovereign's word; if so it is a Your-decisions entry. A Plans cliff-note carries the problem, the scope, the rough phase shape and "approve plan creation?".

**The ground-truth gate runs here, on every entry, and the entry shows it.** A claim about the current state of an existing artifact is checked live with the cheapest definitive instrument (an `ls`, a Grep, a scoped Read) before it reaches the board, and every Your-decisions and Plans entry carries the check and its result as `Verified: <check>, <result>`. A forward proposal to build something absent needs no artifact check. A recommendation is also checked against work already underway (the owning skill, plan or project) and framed as layering onto it, superseding it or filling a gap in it. A claim that a present artifact is absent or stale is a factual assertion and is ground-truthed. The check belongs to the orchestrator, because a worker cannot ground-truth its own assertion. A Plans cliff-note gets the same check, because the Sovereign approves plan creation on its premise, and a false premise spends a real approval and a whole later session on work that did not need doing.

### Step 8: Write the log entry

Append the run entry at the top of the log body in the shape set out in Log Structure; its board sections carry the board's bucket numbers. Update the frontmatter. For every item that ran, write its scorecard: `last_run` today, `runs` plus one, `findings` plus what it surfaced, `empty_streak` reset to 0 on a finding or plus one on none. (`accepted`, `declined` and `noise` are written in the return session from the Sovereign's answers.) Append this run's fix checks and drop entries older than the last three runs. Set `bundle_state` to today for each bundle run and `research_state` for each category, add one to `run_counter`, set `last_run` and remove consumed `priority_flags`. An item with three empty runs in a row, or whose rulings run more than half noise, goes to Your decisions as a retire or merge proposal.

### Step 9: Commit, then present the board

The tool calls come first, so the board is the last thing the Sovereign sees.

1. **Commit by path, twice when Acts items edited files.** `git add` names each file the run touched, new files by name, and `git commit` takes the same paths: the edited files first, then write that commit into this run's fix checks and commit the log with the rest. A fix check left with no commit reads unverifiable at the next re-check. Never `git add -A` and never a path the run did not touch: sibling sessions may hold uncommitted work in the same tree. A run never edits its own skill files (the Floor); that is the return session's work.
2. **Check the board before sending it.** Four headings in order (Done, Your decisions, Your hands, Plans to approve), an empty one saying "None this run.", and a Verified line on every Your-decisions and Plans entry. A Stop hook in your AI interface can hold this shape for you if you choose to add one. Each Your-decisions and Plans entry is a numbered line, its options sit under it as bullets and never as numbers, and it carries one Verified line. A Done line reads `[Item ID]: [outcome]`. A Your-hands item names the action, why only those hands can do it and the fastest route.
3. **Render the whole board as the closing message.** Every entry in full with its recommendation and its Verified line, never a count, a digest or a link. The test: a Sovereign who opens no file can read and answer the whole board from the message alone. Pointing the Sovereign at a file in place of the board is the failure this step exists to prevent. A run that halted before its board says "No board this run" instead.
4. **End the message** with one line after the full board: "Log updated. Answer any item inline and I will run the return session."

---

## The Return Session and the Verb Moves (Sovereign-triggered)

The Sovereign's board answers encode forward. This is the learning loop. The skill never modifies its own SKILL.md, catalog, verbs or posture on its own (the Permanent Floor). Every move below is an explicit, Sovereign-triggered edit cycle.

**The self-edit rule.** An edit to this skill's own files (SKILL.md, its CLAUDE.md, anything under `references/`, the catalog included) follows three rules, every time. Render the diff of the skill files inline, in full, before committing. Commit the skill's files by path in a commit of their own, titled as a self-edit. Never run a procedure from a section marked proposed (a heading reading Proposed, an item whose verb is Proposes): the Sovereign's yes moves the verb first, and the procedure runs from its ratified place after that.

**Scorecards first.** For every finding the Sovereign answered, update its item's scorecard: `accepted` plus one when taken, `declined` plus one when turned down on its merits, `noise` plus one when called not worth surfacing. Then add each finding not taken to `rulings` in the log frontmatter, so it never returns: its path, item, the offending line, where it was ruled and one disposition. `accepted-as-is` (right as it stands) and `false-positive` (noise) suppress for good. `rule-needs-fixing` suppresses the finding and returns as a skill refinement on the board until the item's rule changes. `deferred` carries an `until` date and returns after it, so "not now" never silences a defect for good.

The answers run at four tempos: a ruled fork lands now, an accepted candidate is woven in, a Your-hands item is done or verified and an approved plan is drafted to run later.

**Your decisions: a ruled fork (implemented now).** Apply the decision to the parked work. A "say go and I will do it" entry answered with go is done now. If the answer carries a forward rule, encode it in the catalog spec it governs. A rule that turns a recurring judgment fork into a deterministic step is the recursion working, and it can move a verb (below). Record the decision in the run entry where the fork was parked.

**Your decisions: an accepted menu candidate (woven in).** Add the item to the catalog file it belongs in (its bundle file, or `standalone.md` when it runs on its own window) with execution spec, eligibility rule, output artifact and a `**Verb:**` line, and add its line to the catalog index. Seed it in `menu_state` as `null`, meaning never run, so a weave date never reads as a run. Record the promotion in the run entry where it surfaced.

**Your decisions: an accepted skill refinement.** Edit SKILL.md, the CLAUDE.md, a reference or the catalog under the self-edit rule. Note it in Refinements with the date and source run.

**Your hands (done or verified).** When the Sovereign says it is done, verify it landed with the instrument that can see it and record the result. "The Sovereign said so" is not the check. When the Sovereign says go instead, the agent does it. An item still open at the session's end gets one line under the run entry, `Still open: [item]`, so the next session resurfaces it.

**Plans to approve: an approved plan (drafted, run later).** Draft the full Pending Plan per [[Council Chamber/Protocols/Planning/Pending Plan Implementation Protocol]], seeded from the cliff-note, at `status: proposed`. Creation is authorized; execution runs in its own session later. Ground-truth the premise at drafting time, even when the cliff-note passed the Step 7 gate: days may have passed, and this is the last gate before the plan calcifies. A premise that fails here kills the candidate; report that rather than drafting a plan around a false claim. Note the spawned plan in the run entry and link it.

### A verb move

An item moves from Proposes to Reports or Acts, or a site-lane class from propose to auto-PR to auto-merge, only through a ratified decision. Authority widens from proven workflows, never from projection. To execute a move, edit the item's `**Verb:**` line (or the class's rung in the site-lane file) and record the item, the old and new verb, the forward rule and the coherence check result in the run entry.

Every move passes the **Flywheel Three Laws coherence check**: does it serve Smooth Transition, Easier Rotation and Increased Output? These are the mechanical laws of the flywheel, canonical in [[Council Chamber/Governance/Flywheel Integration Standard]]. The Flywheel laws test a move's value. The Permanent Floor tests its safety: a move that would touch an outward surface, delete, move a canonical file or self-edit fails regardless. Governance, memory and CLAUDE.md changes never move into execution by this route. They go to Plans to approve.

### The Learning Loop

- Keep a ledger of rulings in the run log. A finding already ruled on never returns to the board.
- A scan that cannot be shown to catch a planted defect reports "unverified", not "clean".
- At each run start, re-check the previous run's fixes. Mark each held, regressed, reverted or unverifiable.
- A regressed fix is re-landed. A reverted fix goes to the Sovereign, because a revert is a ruling. An unverifiable one goes to Your decisions with its reason (a vacuous check, a file moved or gone, a commit no longer in history).

---

## Coming from 1.x

1.x is the threshold model: every template release through v3.16.0. If your vault ran it, your log and board still work. Here is what each piece means now.

- **`auto_execute_threshold` and the autonomy levels.** Retired. The verb is the authority now. Map each item once, in a return session, by what it did under your threshold. An item at or below the threshold ran: it takes its tier default (Tier 1 Acts, Tier 2 Reports), and a Level 2 item's habit of parking its forks is now what every Acts item does. An item above the threshold was parked whole: it becomes Proposes. With the starting threshold of 1, Level 1 items keep running and Level 2 and Level 3 items become Proposes until you ratify a move. Write the mapping in a run entry. The skill ignores the threshold line if it stays, so removing it is housekeeping rather than a requirement.
- **`decision-board.md`.** Nothing writes to it any more. Carry its open decisions into your next return session or answer them there. Keep the file as history or archive it yourself. The skill never removes it, because deletion is the Permanent Floor.
- **The bucket names.** Completed this run is now Done. Approvals and questions is now Your decisions. New menu candidates and autonomy moves fold into Your decisions. Proposed Pending Plans is now Plans to approve. The hands list is now its own heading, Your hands. Old run entries keep their old names: they are history.
- **`references/menu-catalog.md`.** The catalog now lives in `references/catalog/`, one file per bundle, and `menu-catalog.md` stays as a pointer. If you added your own items to it, move each section into the bundle file that reads the same surface and add its line to the catalog index.
- **`menu_state`.** A bare date still reads as `last_run`. Scorecards fill in from the next run. Add an empty `bundle_state` map; every bundle reads as never run and the first two go first.
- **T1-4.** Retired. Its premise was inverted for the current memory convention. If you ran it, run T2-4 once to find any link it rewrote.

---

## Log Structure

Single file at `Council Chamber/Logs/Autonomous Improvement Log.md`. Its frontmatter holds state; its body holds run entries, newest first.

**Retention rule.** At session open, when the log body exceeds about 1200 lines, compress the oldest full run entries into one-line summaries (run number, date, items executed, board outcome) until the body sits under 1000 lines, keeping the newest 8 runs in full. Frontmatter state is never compressed. The compression runs as part of the session; it needs no separate approval. The log that watches other logs' rotation carries its own window.

**Frontmatter:**

```yaml
---
status: active
run_counter: N
last_run: YYYY-MM-DD
research_state:             # category ID to last-researched date; the least recent goes next
  R1:
  # ... through R9
bundle_state:               # bundle ID to last-run date; never-run bundles first, then the oldest
  B1:
  # ... through B6
priority_flags: []          # item IDs flagged to lift in Step 2 selection
menu_state:                 # one scorecard per item; null means never run
  T1-1: {last_run: YYYY-MM-DD, runs: N, findings: N, accepted: N, declined: N, noise: N, empty_streak: N}
  # a bare YYYY-MM-DD is the 1.x shape and still reads as last_run
fix_checks: []              # one {run, item, file, commit, absent | present} per Acts edit, the last three runs only
rulings: []                 # one {path, item, line, disposition, ruled, until} per finding the Sovereign ruled on
runtime_purge_surfaced: []  # T1-7's surfaced purge candidates
---
```

**The run entry.** It records the board in full, so the log is the board's only durable home.

```markdown
## Run: YYYY-MM-DD HH:MM (Run N)

**Items attempted:** N. **Items completed:** N. **Bundles this run:** [IDs]
**Research:** [category ID]: returned N; live defects N, fixed in this run N; duplicates N; new candidates N
**Dropped by the ledger:** [N, by item; or "none"]

### Fix re-check
- Held N, regressed N (re-landed in Done), reverted N (Your decisions), unverifiable N

### Decision board (this run)
#### 1. Done
#### 2. Your decisions
#### 3. Your hands
#### 4. Plans to approve

### Patterns Noticed (log only, never on the board)
### Reports with no findings
### Errors and blockers
```

The return session appends a `### Sovereign review and return session` section under the run entry it answers.

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

## External Orientation

> [!info] Ambassador Doctrine Active
> This skill operates under the [[Council Chamber/Protocols/Governance/Ambassador Doctrine]].
> Primary strategy: Saṃśraya. The skill exists to fortify the ecosystem. Every action is reversible, every artifact is logged, every outward surface is gated. The log is the durable ledger of the skill's behavior over time.
> Secondary: Āsana. Reports items and the research rotation are intelligence-gathering posture. Observe fully before recommending. Findings return to the Sovereign; the skill never acts on its own observations beyond menu-bounded execution.
> External surfaces touched (read-only by default): outbound URLs for link-rot scans (HEAD or short GET only, no auth bypass) and, under the graduated lane, external repos as a write-via-PR surface (additive or corrective fixes only, never a direct push to a main branch, never a copy or voice change).

Two external write forms are gated:

- A pull request only. Read the repo's default branch first. Never push to it directly.
- An issue close only when the condition that filed the issue has cleared, with evidence in the closing comment.

---

## Model Routing

- The orchestrator runs at the tier you opened the session with. It owns Step 0, every ground-truth gate, synthesis, the board and every commit.
- Scan, research and editor workers run on Sonnet, with `model` set explicitly on every subagent dispatch. Never silently inherit. Every worker prompt says: run single-context, do not spawn subagents.
- Mechanical lookups and deterministic commands run on Haiku.
- No worker runs above the orchestrator's tier.

---

## Planning Mode Rule

Status is `active`. Execution is authorized without per-invocation approval. Sovereign invocation is the only gate. Acts and Reports items are pre-approved by design, inside the Hard Ceiling. New menu items, verb moves and edits to this skill's own files need Sovereign ratification through the board before they land.

---

## Refinements

%%
Date-stamped entries of calibration notes and rules to prevent recurrence.
%%

- Skill ported from the source ecosystem in template form. The starter menu is generic vault-internal hygiene. The three-site routine-report triage from the source became an optional external-surface extension that stays off until you run external repos. Adapt the starter menu and research categories to what your ecosystem actually holds during onboarding.
- 2026-06-10: Menu expanded from 15 inline items to 36 in `references/menu-catalog.md`, mirroring the source ecosystem structure, with path tokens replacing source-specific paths.
- 2026-10-16 (v2.0): The execution-authority model rewritten. Three verbs (Acts, Reports, Proposes) replace the autonomy levels and `auto_execute_threshold`, and a verb moves only through a ratified board answer. The board renders inline in the closing message under four headings (Done, Your decisions, Your hands, Plans to approve), the run entry is its record and `decision-board.md` retires. The catalog splits into `references/catalog/`, one file per bundle, two bundles per run. Per-item scorecards, retire proposals, fix checks, the self-edit rule, the research yield and a pre-send board check added. T1-4 retired. A Coming from 1.x section added.
