---
status: active
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# The Return Session and the Verb Moves

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
