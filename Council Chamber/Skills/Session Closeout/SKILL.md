---
name: session-closeout
description: Use when wrapping up a session that made commits or governance changes. A fast three-action close: breadcrumb what you touched, refresh the Primer, commit with a readable body.
status: active
tier: foundational
contrast_tier: 1
---

# Session Closeout Skill

Purpose: Close a session fast, leave the breadcrumbs that future review actually uses, and never tax a working session for a record it does not need.

The durable trail already lives in three places: the git commit body (the backward record of what the session did), archived vault artifacts (plans, codices, their activity logs) and governance breadcrumbs annotated where each change happened. The Primer carries the forward handoff. Closeout feeds those trails. It does not duplicate them.

Trigger: a session that made commits or governance-level changes.
Inputs: what shipped, what got touched, what comes next.
Outputs: breadcrumbs in the artifacts touched, a refreshed Primer, a light-touch Sovereign Command, a commit with a readable body.
Related Protocols/Codices: [[Council Chamber/Protocols/Session/Session Closeout Protocol]] (doctrine; this skill is operational authority), [[Council Chamber/Skills/Autonomous Improvement Session/SKILL]].

## The Close

Three actions. Target under 3 minutes. Every session runs this. There is no heavier tier.

### 1. Breadcrumbs wherever they belong

By close, most breadcrumbs are already laid as you worked. This is the final settle: capture what resolved late, plus the items that now warrant a breadcrumb in more than one place because the final shape is clear.

Write a one-line breadcrumb straight into every artifact this session directly touched or materially affected, in its own location. Pending Plans, codices, dashboards, notes, memory files. Not plans only. The breadcrumb lands where the next reader will look for it.

- **Scope boundary.** Artifacts this session directly touched go in-session, where the context is fresh. The exhaustive hunt for second-order staleness in parallel documents batches to the [[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]. Direct touch is in-session. Ripple-chasing is batched.
- No separate reconciliation-summary section. The breadcrumb in the artifact is the reconciliation.
- For a Pending Plan touched this session, the breadcrumb is an activity-log line, an applicability change, a partial-implementation note or an evidence link. Do not change plan status without approval.

### 2. Refresh the Primer

Update `Primer.md`. This is the canonical forward handoff, the first thing your AI reads at session start. Refresh it after the breadcrumbs land, so it reflects the freshly-updated state of what you touched.

- **Stale-blocker purge first.** For each Parked item, check whether it references a plan now in `Vault (Archive)/Pending Plans/`. If yes, the plan is implemented. Drop the item. Resolved blockers left in place resurface as false signals every session until caught.
- Rewrite to the rolling horizon: **Most Alive Next Move**, **In Execution** (Pending Plans and work in motion, high signal), **Active Commitments** (dated actions within the near horizon), **Parked** (waiting on an external trigger or a Sovereign decision), **Session Opener**.
- Do not carry forward Current-State narrative or Completed-This-Session history. Those live in the commit body and the git history. Remove items that completed this session. Add new time-bound items that emerged.
- End with a **Session Opener** line: `Invoke AI Interface Activation. [one-line intent for next session, or "intent to be determined at session start."]` This carries the energy forward, not just the state.
- **Under a concurrent sibling, read before write.** If another session is active, re-read `Primer.md` immediately before editing so you build on the sibling's latest write rather than overwriting it.

**Then give Sovereign Command its light touch.** Sovereign Command is the minimal live-signal glance, not the handoff. The Primer carries the detail. Sovereign Command stays short. Two touches only: drop anything this session resolved, and shift the headline (Most Alive Next Move) if the lead moved. If neither changed, leave it. The weekly review re-scans all source lanes as the safety net.

### 3. Commit with a readable body

Auto-commit. **The commit body carries 2-3 human-readable sentences:** what shipped (SHA or URL if relevant), the key decision, what comes next. This body is the always-on, searchable backward record. The commit plus the Primer plus the breadcrumbs are the record for an ordinary session. Weave a light touch of humor or a meta-awareness beat into the body when it fits. Mechanics in the Auto-commit section below.

No per-session narrative log is written. Git is the log. The commit body is the session record, and the Primer is the forward handoff. The template assumes a git-tracked vault, which is the reason git is wired into the build. A Sovereign who chooses not to git-track owns that tradeoff and adds their own record surface. Closeout does not bend a session surface into a log to cover for git's absence.

## The Session Log Index (historical)

Any session logs already in `Vault (Archive)/Session Logs/` are a frozen historical archive. No new per-session narrative logs are written. Recent activity lives in the git commit bodies, which is what the weekly review and the Weekly Story now read. The index is left as-is, a record of the pre-slim era. Nothing appends to it going forward.

## Reconciliation Escalation (rare, not a mode)

Reconciliation of what this session touched is action 1, inline, where freshness keeps it accurate. For a genuinely large session (6 or more plans touched) or when the Sovereign says "full reconciliation," escalate: dispatch parallel workers, each independent, holding proposals for one approval gate.

- **Worker A: Pending Plan Reconciliation.** Read `Council Chamber/Pending Plans/Index.md` as the pre-filter. Read only plans named in this session or marked touched recently. Draft breadcrumb updates. No status changes. Proposal-only.
- **Worker B: Inadvertent Completions Sweep.** Scan quests, experiments, intake for items this session completed or retired. Proposal-only.
- **Worker C: Inbox + Consult Closeout Sweep.** Process deferred activations, consults that produced downstream artifacts. Proposal-only.

This is an escalation tool on the shelf, not a standing choice every close. The old lightweight-versus-full mode binary is retired.

## Plan Exit-Criteria Verification (conditional)

If this session advanced a Pending Plan (any session ending with an `implementation_state` advance and a Session Boundary Block), read the plan's exit-criteria block for that session and verify each criterion against actual evidence. Do not accept a self-reported "all criteria met." For each criterion, name the specific file, commit, script output or live test that verifies it. If a criterion cannot be verified, flag it as pending and either address it now or move it to the next session's scope. This is the gate between "I think it landed" and "it is demonstrably landed."

## Auto-commit (mandatory, concurrency-aware)

After the Primer is refreshed, reconcile against any concurrent session, stage this session's work, commit with a themed message and a readable body, and report. No ask. Push only if your ecosystem's vault has a configured remote and the Sovereign has authorized push at closeout. Many ecosystems keep the vault local-durability only.

**a. Concurrency check (before staging).** A sibling session can leave uncommitted work in the tree. A blind `git add -A` sweeps it into this commit under the wrong message. Check first:

```bash
git -C "<your vault path>" log --oneline -8
git -C "<your vault path>" status --short
```

Compare current HEAD to the HEAD you saw at session start.

**b. Solo path (no sibling active and HEAD unchanged since start).** Use the convenient sweep, then unstage transient runtime files your setup generates:

```bash
git add -A
git reset HEAD -- <transient runtime files, e.g. editor workspace state, local settings>
```

**c. Concurrent path (a sibling is or was active, or HEAD moved).** Do not `git add -A`. Stage only the files this session created or edited, named explicitly. Files dirty in the tree that this session did not touch belong to the sibling. When in doubt whether a dirty file is yours, it is not.

```bash
git add "path/one.md" "path/two.md"   # this session's files only
```

**d. Commit only if something is staged.** The body is the readable 2-3 sentence summary:

```bash
git diff --cached --quiet || git commit -m "Session Closeout YYYY-MM-DD-X: <title>" -m "<2-3 readable sentences: what shipped, key decision, what's next>"
```

**Failure handling:** if the commit fails (pre-commit hook, signing), do not amend or bypass. Surface the failure, name the cause, let the Sovereign decide.

**Closing line.** After the commit succeeds, conclude to the Sovereign with one line: *Today's harvest is closed out. The next move queues.* Single line, no flourish.

## Model Routing

Set `model` explicitly on every Agent call. Escalation workers (A/B/C) run Sonnet. Session closeout is Sonnet's territory by default. See your routing codex for escalation criteria.

## Refinements

**Single lean close with the Primer surface (ported from the source ecosystem).** The skill previously ran a lightweight-versus-full mode binary and wrote a standardized per-session log to `Vault (Archive)/Session Logs/` plus an Index append on every close. Rewritten to a single three-action close: breadcrumbs anywhere, then refresh the Primer, then commit with a readable body. The Primer is the canonical forward handoff (introduced as its own surface in this update), so the close has somewhere to land the rolling horizon without bloating Sovereign Command, which stays the minimal live-signal glance and gets only a light touch. The per-session narrative log was removed entirely. Git is the log: the commit body is the backward session record. There is no non-git fallback, because the template assumes a git-tracked vault and does not bend a session surface into a log. The Session Logs directory and its index became a frozen historical archive. Breadcrumb scope widened from plans-only to any artifact directly touched. The lightweight-versus-full binary retired; the three-worker reconciliation became an escalation tool. A concurrency-aware staging split (solo versus concurrent) was added for ecosystems that run sessions in parallel. Deep cross-document propagation and stale-blocker sweeps routed to the Autonomous Improvement Session.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Include contrast fields in frontmatter for foundational updates.
- Store deeper contrast reasoning in the footer block when needed.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- Three surfaces, three jobs: the Primer is the forward handoff, Sovereign Command is the live glance, the git commit body is the backward record. The closeout refreshes the first, lightly touches the second, writes the third.
- The per-session log was a habit serving a lookup that almost never fired. The commit body carries the summary the lookup wanted.
- No non-git fallback. Git is the log. Bending Sovereign Command into a session capsule would betray what it is for.
-->
