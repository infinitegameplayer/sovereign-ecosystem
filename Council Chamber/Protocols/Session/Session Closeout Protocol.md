# Session Closeout Protocol

Purpose: Capture what a session changed to fuel the flywheel without bloat. This protocol is the doctrine. [[Council Chamber/Skills/Session Closeout/SKILL]] is the operational authority and runs the actual close.

## Triggers
- Governance changes
- New codices, protocols or skills
- System-level reorganizations
- Major North Star updates
- Any session that made commits

## The Close (three actions, under 3 minutes)

The closeout is a single lean close. There is no lightweight-versus-full mode binary, and no per-session narrative log. Three surfaces carry the trail: the Primer is the forward handoff, Sovereign Command is the live glance, the git commit body is the backward record. Archived vault artifacts and governance breadcrumbs hold the rest.

1. **Breadcrumbs wherever they belong.** Write a one-line breadcrumb into every artifact this session directly touched, in its own location: Pending Plans, codices, dashboards, notes, memory files. The breadcrumb in the artifact is the reconciliation. No separate summary section. For a Pending Plan, the breadcrumb is an activity-log line, an applicability change, a partial-implementation note or an evidence link. Do not change plan status without approval. Second-order ripple-chasing across parallel documents batches to the [[Council Chamber/Skills/Autonomous Improvement Session/SKILL]].

2. **Refresh the Primer.** `Primer.md` is the canonical forward handoff, the first thing the AI reads at session start. Purge stale Parked items first (any item referencing a plan now in `Vault (Archive)/Pending Plans/` is implemented; drop it). Rewrite to the rolling horizon: Most Alive Next Move, In Execution, Active Commitments, Parked, Session Opener. Remove anything this session resolved. Then give Sovereign Command its light touch only: it is the minimal live-signal glance, not the handoff, so drop what resolved and shift the headline if the lead moved. The Primer carries the detail. Sovereign Command stays short.

3. **Record the session.** Auto-commit with a 2-3 sentence readable body (what shipped, key decision, what comes next). Git is the log: the commit body is the always-on searchable backward record. No separate per-session log, and no non-git fallback. The template assumes a git-tracked vault, which is why git is wired into the build. A Sovereign who opts out of git owns that tradeoff and adds their own record surface.

## Conditional Steps

- **Plan exit-criteria verification.** If this session advanced a Pending Plan, read its exit-criteria block and verify each criterion against named evidence (file, commit, script output, live test). Do not accept a self-reported "all criteria met."
- **Reconciliation escalation (rare).** For a session touching 6 or more plans, or on a Sovereign "full reconciliation" request, dispatch parallel proposal-only workers (Pending Plan reconciliation, inadvertent completions sweep, inbox and consult closeout). This is an escalation tool, not a mode.
- **Convert deferred ideas into Pending Plans** if needed. Check for overlapping existing plans first and propose merge or scope-split options if overlap exists.

## The Session Log Index (historical)

Any logs in `Vault (Archive)/Session Logs/` are a frozen historical archive from the pre-slim era. No new logs are written and nothing appends to the index. The weekly review and the Weekly Story read git commit bodies for recent activity, not the log index.

## Commit Strategy (if changes were made)

- Commit by theme, not by session bundle.
- Use concise messages that reflect the domain of change, with the 2-3 sentence readable body.
- Avoid committing editor or runtime state files unless explicitly approved.
- The session record plus the breadcrumbs plus archived artifacts are the canonical ledger. No separate change-log entry is required.

## Process Pattern Capture

- Process-pattern lessons that should persist across sessions are written to auto-memory (`feedback` type) per the auto-memory architecture defined in CLAUDE.md.
- Skill-level execution mistakes are recorded in the relevant `## Refinements` section of the affected skill's SKILL.md.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Include contrast fields in frontmatter for foundational updates.
- Store deeper contrast reasoning in the footer block when needed.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- The per-session log was retired. It served a retroactive lookup that almost never fired, and the commit body carries the summary the lookup wanted.
- Three surfaces, three jobs: the Primer is the forward handoff and the central refresh, Sovereign Command is the minimal live glance and gets only a light touch, the git commit body is the backward record. Keeping them distinct is what lets Sovereign Command stay a glance.
-->
