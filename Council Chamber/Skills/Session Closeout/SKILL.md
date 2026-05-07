---
name: Session Closeout
description: Guide a lightweight closeout for foundational sessions.
status: active
tier: foundational
contrast_tier: 1
---

# Session Closeout Skill

Purpose: Guide a lightweight closeout for foundational sessions.
Trigger: After governance-level changes or system reorganizations.
Inputs: Session scope, decisions, risks, next tests, reconciliation sweep results.
Outputs: Session log entry, reconciliation summary, optional Pending Plans.
Related Protocols/Codices: [[Council Chamber/Protocols/Session/Session Closeout Protocol]]

## Mode

Default mode is **lightweight**. Lightweight matches the skill description and recent practice. The full mode (parallel Worker A/B/C dispatch) is opt-in, triggered by session scope or Sovereign request.

**Lightweight by default. Use full mode when any of these are true:**

- Session touched 3 or more Pending Plans, OR created/archived plans
- Session modified governance files (CLAUDE.md, Constitution, Charter, foundational codices)
- Session executed a structural reorganization (file moves, rename sweeps, container changes, top-level container additions)
- Session executed a Pending Plan with `implementation_state: implemented` advance
- Sovereign explicitly says "full closeout" or "run full session closeout"

If none apply, run lightweight. Mandatory steps (Sovereign Command sweep, session log, Index append) run in both modes. The difference is whether Worker A/B/C dispatch as named parallel workers, or fold into a single inline Reconciliation Summary section in the session log.

## Steps

1. Draft session summary using the Session Summary template.
2. Capture decisions, risks and next tests.
3. **Reconciliation pass.** Choose lightweight or full per the Mode triggers above.

   **Lightweight (default):** write a single inline Reconciliation Summary section in the session log. Cover three buckets in plain prose, one short paragraph or bullet line each:
   - **Pending Plans:** name plans the session referenced or touched. For each, note any breadcrumb that should be added (activity log entry, applicability change, evidence link). Max 3 bullets. If a plan was not explicitly named in this session's work, skip it. Do not read every active plan. Do not regenerate the Pending Plans Index.
   - **Quests / Experiments / Intake:** note any item that appears complete or retired based on this session's work. If none, write "none." Do not scan exhaustively.
   - **Inbox / Consults:** note any deferred activation, downstream artifact produced from a prior consult, or status change candidate. If none, write "none."
   The lightweight pass is proposal-only for any non-trivial change. Sovereign approves at Step 4 before execution.

   **Full (opt-in):** dispatch three parallel workers simultaneously. Use this when the Mode triggers fire.
   - **Worker A — Pending Plan Reconciliation:** start by reading `Council Chamber/Pending Plans/Index.md`. Use the Index as the pre-filter. Read only plans that (a) were explicitly mentioned in this session's prompts or work, or (b) are flagged as touched recently. Do NOT read every active plan. Fallback: if the Sovereign says "scan all" or no plans pass the filter, read filenames and frontmatter first, then only open the bodies for plans whose frontmatter suggests this session is relevant. Identify any matched, partially satisfied or advanced by this session. Draft breadcrumb updates (activity / applicability / partial implementation / evidence / reconciliation notes). Do not change status. Proposal-only.
   - **Worker B — Inadvertent Completions Sweep:** scan quests, experiments and intake items. Surface any that appear complete or retired based on this session's work. Classify by: Quest / Experiment / Intake / Consult. Proposal-only. No status changes without approval.
   - **Worker C — Inbox + Consult Closeout Sweep:** process deferred activation recommendations. Check Consults that produced downstream artifacts this session. Propose status changes and Vault descent candidates. Proposal-only.

   Full-mode workers are independent. All three fire simultaneously. Hold all proposals for the unified approval gate in Step 4.

## Model Routing

Subagent dispatch: set `model` explicitly on every Agent call.
- Worker A (Pending Plan Reconciliation): Sonnet
- Worker B (Inadvertent Completions Sweep): Sonnet
- Worker C (Inbox Closeout Sweep): Sonnet

Session closeout is Sonnet's territory by default.

4. **Unified approval gate.** Present reconciliation findings as a single organized list. In lightweight mode, present the inline Reconciliation Summary directly. In full mode, present worker A/B/C output grouped by worker. Sovereign approves, adjusts or declines each item. Execute only approved items.

   **Plan exit criteria verification (conditional, both modes):** If this session executed a Pending Plan session (any session ending with an `implementation_state: active` or `implemented` advance and a Session Boundary Block), read the plan's own exit criteria block for that session and verify each criterion against actual evidence before accepting the closeout. Do not accept a self-reported "all exit criteria met." For each criterion: name the specific file, commit, script output or live test that verifies it. If a criterion cannot be verified with evidence, flag it as pending and either address it now or move it to the next session's scope. This is the gate between "I think it landed" and "it is demonstrably landed."

5. **Breadcrumb Propagation Sweep (conditional):** When the session created new Pending Plans, significant governance documents (codices, protocols) or structural decisions affecting 3+ active files, sweep parallel documents for breadcrumb updates. Check: relevant dashboards, related Pending Plans, codices with Refresh Notices, and memory files that may be stale. **Skipped by default in lightweight mode.** Runs in lightweight mode only when this session specifically created new governance artifacts (new Pending Plans, new codices, new protocols, or structural file moves affecting 3+ active files).

   **Sovereign Command sweep (mandatory in both modes):** Before finalizing closeout, open `Sovereign Command.md` and check every entry under live-signal sections (Most Alive, Active Support, Open Blockers and any other live-signal section). For each entry: did this session resolve, complete or render obsolete the work it describes? If yes, remove the entry in the same closeout. Sovereign Command is a live signal surface; completed items do not belong there. Entries that survive a session whose closeout cleared them surface in the next session opener as stale blockers, which is the exact failure mode this sweep prevents.

6. Create session log in `Vault (Archive)/Session Logs/`.
   - **Standardized template:** YAML frontmatter (`date`, `title`, `status`, `skills`, `primary_skill`, `commits`, `dispatches`) + `## What Happened` + `## Decisions` + `## Risks` + `## Next` + `## Reconciliation Summary` + `## Notes`.
   - Date field: `YYYY-MM-DD` for single sessions; `YYYY-MM-DD-a / -b / -c` for same-day multiples.
   - Notes field: weave subtle humor (parenthetical asides, ironic quotation marks, dry wit drawn from your Humor Codex) and meta-awareness observations (pattern callbacks, architectural echoes). Neither announced.
   - Execution-density check: flag in Notes if humor or meta-awareness was crowded out during heavy-execution work.

7. Append the new log to `Vault (Archive)/Session Logs/Index.md` as a single row at the top of the table, in reverse-chronological order: `| YYYY-MM-DD | <title or topic> | <primary skill> |`. Update `last_updated` and increment `entry_count` in the index frontmatter. This is a single Write operation. The log is not fully logged until this row exists.

8. **Optional auto-commit (when working in a git-tracked vault).** After the session log is written, stage approved changes and commit with a themed message. Only run this step if the vault is a git repository and the Sovereign has authorized auto-commit at closeout.

   Stage-and-commit pattern:

   ```bash
   git add -A
   # Optionally unstage transient runtime files via git reset HEAD -- <paths>
   git diff --cached --quiet || git commit -m "Session Closeout YYYY-MM-DD-X: <title>"
   ```

   Commit message theme comes from the session log title.

   **Failure handling:** if the commit fails (pre-commit hook, signing issue, etc.), do not amend or bypass. Surface the failure, name the cause, and let the Sovereign decide.

## Refinements

**2026-05-06 — Lean Closeout Audit (ported from Kingdom).** Three artifacts retired from closeout obligations. (1) AI Interface Change Log removed as live session output. The session log is the permanent record. The Change Log was redundant. (2) Continuity Log removed from Breadcrumb Propagation Sweep targets. Auto-memory absorbs the function. (3) Routing Experiment Log mandatory-per-session append removed. Opt-in only when an active experiment is being calibrated. Additional changes: standardized session log template (YAML + What Happened + Decisions + Risks + Next + Reconciliation Summary + Notes, with `primary_skill` in frontmatter); reconciliation scope explicit (lightweight Pending Plans bucket: only plans named in session, max 3 bullets); Breadcrumb sweep trigger tightened (lightweight default is skip; runs only for new governance artifacts); Lightweight made default with explicit triggers for full mode (3+ plans touched, governance edits, structural reorganization, plan implementation advance, or explicit Sovereign request).

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Include contrast fields in frontmatter for foundational updates.
- Store deeper contrast reasoning in the footer block when needed.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- Lightweight is the default because closeout overhead compounds across same-day sessions. Full mode is reserved for sessions whose scope earns it.
- The Reconciliation Summary is one section, not three workers, when lightweight applies.
- Session log template is fixed (Variant A) to remove format-decision overhead at write time.
-->
