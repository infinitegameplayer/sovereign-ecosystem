---
status: active
created: 2026-06-10
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# Autonomous Improvement Session: Menu Catalog

The full Tier 1 and Tier 2 menu. Load this file at Step 2 (compute eligibility) and keep it open through Tier 1 and Tier 2 execution. The parent SKILL.md holds the workflow. This file holds the per-item execution specs, eligibility rules and output artifacts. Promotion of an accepted menu candidate edits this file, not the SKILL.md.

## Contents

**Tier 1 (autonomous, edits land directly)**
- T1-1: Wikilink integrity re-sweep
- T1-2: Index regeneration
- T1-3: Anti-AI sweep on draft articles
- T1-4: Memory file slug variant normalization
- T1-5: Codices Index completeness sweep
- T1-6: Superseded-artifact and dead-section sweep
- T1-7: Runtime log rotation
- T1-8: Skill mandatory-sections completeness sweep

**Tier 2 (autonomous, reports for Sovereign review)**
- T2-1: Inbox triage sweep
- T2-2: Stale draft surface
- T2-3: External link rot scan
- T2-4: Memory file cross-reference health
- T2-5: Codex orphan and inbound-link density report
- T2-6: Skill cross-reference health
- T2-7: MEMORY.md compression candidate report
- T2-8: Breadcrumb propagation and stale-reference sweep
- T2-9: Implemented-plan archival candidate sweep
- T2-10: Status vocabulary conformance report
- T2-11: Tag consistency hygiene
- T2-12: Hook coverage audit
- T2-13: Scripts-package dependency and CVE audit
- T2-14: Orphaned and superseded image sweep
- T2-15: Skill frontmatter conformance sweep
- T2-16: Skill status-to-usage drift audit
- T2-17: Contraction enforcement sweep
- T2-18: Project-memory lifecycle staleness sweep
- T2-19: Term Registry placeholder-resolution scan
- T2-20: Security audit staleness sentinel
- T2-21: MCP server load-vs-use gap audit
- T2-22: Explicit model-set compliance audit
- T2-23: Review-date staleness sentinel
- T2-24: Index-file dead-link audit
- T2-25: settings file allow-list integrity audit
- T2-26: Undocumented required-env-key audit
- T2-27: Skill disambiguation and trigger-collision scan
- T2-28: SKILL.md progressive-disclosure overgrowth scan

**Research Rotation Categories (menu-growth engine, SKILL.md Step 8)**
- R1 external practices, R2 vault hygiene, R3 infrastructure, R4 discoverability, R5 skill library, R6 governance, R7 expression, R8 memory architecture, R9 cost and routing

---

## Tier 1 Menu (autonomous, edits land directly)

Each item is mechanical, additive, vault-internal and reversible via git. No approval gate fires per item.

**Autonomy:** Every Tier 1 item is **Level 1** (fully autonomous) at v1. An item carries its own `**Autonomy:**` field only once a ratified climb moves it off Level 1.

### T1-1: Wikilink integrity re-sweep

**Execution:**
1. Run your vault's link-checker script (if present) or walk `[[wikilink]]` references manually across `Council Chamber/Skills/`, `Council Chamber/Protocols/`, `Council Chamber/Codices/`, `Council Chamber/Governance/` and your AI Interface configuration file. For each broken link, if the target file exists at a slightly different path (renamed, suffix added, moved), fix the wikilink in place.
2. Skip bare-word cluster links (tag-style single-word links with no path). Surface count to the Sovereign in the run entry.
3. Skip any wikilink where the target file genuinely does not exist anywhere in the vault. Surface to the Sovereign with the suspected delete date from git log (if tracked).

**Scope boundary:** wikilink path-correction hygiene only. This item repoints a broken link to its verified-existing target and nothing more. It never edits, synthesizes, consolidates or rescopes the content of a governance document.

**Eligibility:** Not run in 7+ days.
**Output artifact:** Run entry shows count of links fixed, count skipped (bare-word) and count surfaced (missing target).

### T1-2: Index regeneration

**Execution:**
1. Run any index-generation scripts present in `Council Chamber/scripts/` (for example `build-pending-plans-index.mjs` or equivalent). Confirm the regenerated index shows the correct total count.
2. Sweep Pending Plan frontmatter `related:` and `parent:` fields for wikilinks pointing to active-directory paths that no longer exist (likely archived). Update each to the archive path. Scope to frontmatter list-item wikilinks only, never prose mentions in plan bodies or activity logs. Prose mentions are intentional history.

**Eligibility:** Condition-based. Eligible whenever a plan was added, archived or had its status change since the last index build. No day-window.
**Output artifact:** Regenerated index files plus any frontmatter field corrections in Pending Plan files.

### T1-3: Anti-AI sweep on draft articles

**Execution:**
1. Glob all `.md` files in `Scriptorium/Articles/` (or your vault's equivalent drafts directory) with frontmatter `status: draft` or `status: ideas`.
2. For each, run the Anti-AI Writing Patterns Codex sweep against the file body. Apply approved find-and-replace transforms in place. Leave any judgment-required findings (voice-tone calls, ambiguous patterns) as inline `<!-- ANTI-AI: [issue] -->` comments for Sovereign review.
3. Skip files with frontmatter `anti_ai_swept: true` or with mtime within the last 24 hours.

**Eligibility:** Not run in 7+ days. Skip files already swept since the article was last edited. Skip entirely if your ecosystem does not ship the Anti-AI Writing Patterns Codex.
**Output artifact:** Edited draft files. Run entry shows per-file counts: transforms applied, inline comments left for Sovereign.

### T1-4: Memory file slug variant normalization

**Execution:**
1. Walk all `.md` files in your AI Interface's project memory directory (for example `~/.claude/projects/<vault-slug>/memory/`).
2. Grep for `[[name-with-hyphens]]` wikilinks where the slug could be a hyphen variant of an existing memory file with underscores (memory files canonically use underscores).
3. For each, verify the underscore variant exists in the same directory. If yes, replace the hyphen form with the underscore form.
4. Surface any wikilinks where neither hyphen nor underscore variant exists to the Sovereign via the run entry.

**Eligibility:** Not run in 14+ days.
**Output artifact:** Edited memory files. Run entry shows count of fixes applied per file plus any unresolved orphan wikilinks. Complements T2-4 (read-only memory cross-reference health audit).

### T1-5: Codices Index completeness sweep

**Execution:**
1. Glob codex files under `Council Chamber/Codices/` recursively. For each with frontmatter `status: active` (or no retired marker), check whether it appears in `Council Chamber/Codices/Codices Index.md`.
2. For each active codex absent from the index, add an entry in the correct category section, matching the neighbors' format, description sourced from the codex's own frontmatter `description` or opening heading.
3. Skip codices flagged intentionally out-of-index. Surface any ambiguous category placement as a judgment fork. Add the unambiguous ones.

**Eligibility:** Condition-based. Eligible whenever an active codex is absent from the index. 30-day window as a backstop.
**Output artifact:** Edited Codices Index. Additions recorded in the run log Completed bucket.

### T1-6: Superseded-artifact and dead-section sweep

**Execution:**
1. Grep active containers (`Council Chamber/`, `Library/`, and any equivalent active-content container in your vault) for frontmatter `status: superseded` or `status: retired` on files still outside your archive location.
2. For each that carries an explicit `superseded-by` pointer or a clear archival destination, archive it via plain `mv` to the matching archive location, run the move-audit sweep (grep the vault for the old path and repoint active references to the canonical superseder, not to the archive path), regenerate any affected index.
3. Find temporary or transitional sections that point at a path that no longer exists. Remove the dead section.
4. Surface as judgment forks only: a superseded file with no destination pointer, or a section whose staleness is ambiguous. Act on the clear cases.

**Repoint rule:** when a file carries a `superseded-by` pointer, the move-audit repoints active references to that canonical superseder, never to the archive path. No active note or codex points at a superseded version when a current canonical one exists.

**Eligibility:** Condition-based. Eligible whenever a superseded or retired file sits in an active container, or a confirmed dead-path temporary section exists.
**Output artifact:** Archived and cleaned files, move-audit repoints, all recorded in the run log Completed bucket.

### T1-7: Runtime log rotation

**Execution:**
1. For each gitignored operational log under `.runtime/` or your scripts log directory (session-stop log, approval-gate log, dispatch log, index-regen log and peers), if it exceeds the line cap, truncate to the last N lines (default cap 2000). This is operational maintenance of a transient append log, not content deletion.
2. List stale `.runtime` files (30+ days old, not active state files) as Sovereign-approved removal candidates. Do not delete them. File deletion is the Permanent Floor, so the purge stays surfaced, not autonomous.
3. Track already-surfaced purge candidates in the log frontmatter `runtime_purge_surfaced` list. Each run, surface only files not already on that list, and add a tail note counting how many previously-surfaced files still await an approved purge. When the Sovereign approves and the purge executes, clear `runtime_purge_surfaced`.
4. Never touch a tracked governance or content file, only the named operational logs.

**Eligibility:** Condition-based. Eligible whenever a named operational log exceeds its line cap.
**Output artifact:** Truncated logs. Stale-file removal candidates in the run log Approvals bucket.

### T1-8: Skill mandatory-sections completeness sweep

**Execution:**
1. Glob all `Council Chamber/Skills/*/SKILL.md`. For each, check for the sections the Skill Creator spec calls mandatory: Purpose or Trigger, When to Use, Steps or Behavior, Constraints, Refinements.
2. For each SKILL.md missing a `## Refinements` section, append an empty section with the standard stub (`## Refinements` heading plus a `%% date-stamped calibration notes %%` comment). This is purely additive and reversible.
3. Surface as read-only findings (do not auto-edit): a skill missing Constraints, When to Use or Steps. Composing those sections is authoring, not a stub. Those land on the decision board for Sovereign review.

**Eligibility:** Condition-based. Eligible whenever a SKILL.md lacks a `## Refinements` section. 30-day window as a backstop.
**Output artifact:** Edited SKILL.md files (Refinements stubs added). Substantive-section gaps on the decision board. All recorded in the run log Completed bucket.

---

## Tier 2 Menu (autonomous, reports for Sovereign review)

Each item is a read-only scan that produces a report. No edits to outward-facing surfaces. No deletions. No canonical-file moves.

**Autonomy:** Every Tier 2 item is **Level 1** (fully autonomous; the report write is additive and reversible) at v1. An item carries its own `**Autonomy:**` field only once a ratified climb moves it off Level 1.

### T2-1: Inbox triage sweep

**Autonomy:** Level 1, autonomous routing. Anything safely routable, route it. Do not ask. The capture-classify-route doctrine is the ruleset below and it sharpens every cycle.

**Execution:** Walk `Inbox/` files (skip the Inbox infrastructure: `Index.md`, `README.md`, any file the skill catalog references as a live source). For each unrouted item, classify by the heuristics below and act:
- **Safely routable (confident match to a heuristic):** route it now via plain `mv`. After any move, run the move-audit wikilink sweep for the old path and repoint active references. Record the route in the run log entry.
- **Hold-for-Sovereign (real judgment, durable-role decision or conflicting heuristics):** surface on the decision board Section 1. Do not move.

A move is the floor-safe action: inside the vault, reversible, deletes nothing, changes no governance. The hold-for-Sovereign set stays narrow by design.

**Routing heuristics (apply judgment, route autonomously when confident):**
1. Comment-only placeholder files for features on hold 60+ days, archive (flag the feature-status context).
2. Voice notes with `status: triaged` in frontmatter, route to `Library/Transcripts/Voice Notes/` or equivalent.
3. One-time scripts referenced in memory as the workaround for a recurring issue, move to `Council Chamber/scripts/`.
4. Drafts superseded by a ratified version of the same artifact, archive the draft.
5. Shipped artifacts (datasets, exports) older than 7 days with confirmation in session logs, archive to the matching destination.

**Hold-for-Sovereign category:** external relationship signals that need a durable-role decision; ambiguous items where heuristics conflict.

**Eligibility:** Condition-based. Eligible whenever the Inbox holds unrouted items. No day-window.
**Output artifact:** Routed files in their destination containers, routes recorded in the run log entry, and any hold-for-Sovereign items on the decision board. No Inbox report file.

### T2-2: Stale draft surface

**Execution:** Walk `Scriptorium/` (or your vault's equivalent drafts directory). For each draft older than 30 days, classify: ready-to-publish (complete prose, status flag indicates ready), event-gated (frontmatter names a gating event), abandoned (no recent activity, no gating event). Produce a report per content type (articles, notes, any other active drafts container).

**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board. No Inbox report.

### T2-3: External link rot scan

**Execution:** Sweep outbound URLs in `Scriptorium/Articles/` (and any other published-article or published-note directory in your vault). Fetch each (HEAD or short GET), flag any 4xx or 5xx response. Skip URLs requiring auth, payment walls or known anti-bot surfaces.

**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board. No Inbox report.

### T2-4: Memory file cross-reference health

**Execution:**
1. Walk all files in your AI Interface's project memory directory. Extract every `[[wikilink]]` reference between memories. Check each target against the directory. Build a structured list of broken cross-refs (source memory, broken link) plus a candidate-target inventory of existing memory slugs.
2. For each broken cross-ref, suggest the likely correct target from the inventory.
3. Verify suggestions against live state before reporting.

**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board. Complements T1-4 (the autonomous memory-slug normalizer); this read-only audit catches what the deterministic T1-4 fix leaves for Sovereign review.

### T2-5: Codex orphan and inbound-link density report

**Execution:** For each codex in `Council Chamber/Codices/`, count inbound references across the vault. Skip codices flagged as intentionally low-traffic in their frontmatter. Rank ascending. Flag every codex with fewer than 5 inbound references as a low-pollination candidate. Sort, threshold and write the report.

**Eligibility:** Not run in 60+ days.
**Output artifact:** Findings on the decision board.

### T2-6: Skill cross-reference health

**Execution:**
1. Walk all `Council Chamber/Skills/*/SKILL.md` files. Extract every `[[wikilink]]` reference. Check each target against the vault. Build a structured list of broken cross-refs (source skill, broken link) plus a candidate-target inventory of existing skill, codex and script paths.
2. For each broken cross-ref, suggest the likely correct target from the inventory.
3. Verify suggestions against live state before reporting.

**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board.

### T2-7: MEMORY.md compression candidate report

**Execution:** Read your AI Interface's `MEMORY.md` index and walk each linked memory file body. Identify candidates for two-pass compression (entries that are stale, redundant or have been superseded by later refinements). Surface a prioritized list.

**Eligibility:** Not run in 60+ days, or when MEMORY.md exceeds 280 lines.
**Output artifact:** Findings on the decision board.

### T2-8: Breadcrumb propagation and stale-reference sweep

**Execution:**
1. Gather changed governance artifacts from recent git history (last 14 days). Filter to `Council Chamber/Codices/`, `Council Chamber/Protocols/`, `Council Chamber/Governance/`, `Council Chamber/Pending Plans/` and your AI Interface configuration file. These are the artifacts whose recent change may have left parallel documents stale.
2. For each changed artifact, grep the vault for inbound wikilink references and for documents that enumerate the same subject (dashboards, arc protocols, governance trees). Build a per-artifact candidate list.
3. For each artifact with candidate parallel docs, check whether those docs reflect the change or carry a now-stale claim (old name, old status, retired artifact, superseded path). Read-only. Propose the reconciliation; do not apply it.
4. Verify findings against live files. Check git history before calling any mismatch drift, a mismatch often has intentional history. Write a report listing per finding: the changed artifact, the parallel doc, the verbatim stale line and the proposed correction.

**Scope boundary:** read-only. Every correction is a proposal for Sovereign review.
**Eligibility:** Not run in 14+ days.
**Output artifact:** Findings on the decision board.

### T2-9: Implemented-plan archival candidate sweep

**Execution:**
1. Walk `Council Chamber/Pending Plans/*.md`. For each, read frontmatter `status` and `implementation_state`.
2. Flag any plan whose `status` is `implemented`, or whose `implementation_state` reads as shipped or complete with a final activity log, that still sits in the active directory rather than the archive.
3. For each flagged plan, confirm completion from the strongest available evidence: frontmatter `status: implemented`, recent commits and git log naming the plan complete, and external confirmation such as a sent email or a live URL. Treat Next-Step and activity-log prose as the weakest signal because it goes stale after the work ships. When status and body disagree, investigate to the actual state rather than defaulting to a hold.
4. Archive each confirmed plan via plain `mv` to the archive directory. Run the move-audit wikilink sweep (grep the vault for the old active path and repoint every active reference; skip historical session logs and the plan's own body). Regenerate the active index. Record each archival in the run log entry with the plan name, implemented date and evidence.
5. Concurrent-session guard: skip archival of any plan whose file carries uncommitted working-tree modifications. Another session may be mid-closeout and the move would collide. Archive on a later run and note the hold in the run entry.

**Autonomy:** Level 1, autonomous. Implemented Pending Plan archival is operational lifecycle closure, not a governance move. It stays inside the vault, it is reversible, it deletes nothing and it changes no governance. The move and the move-audit sweep are one unit of work. A plan with an explicit hold-active instruction is the only skip.
**Eligibility:** Condition-based. Eligible whenever a `status: implemented` plan sits in the active directory. No day-window.
**Output artifact:** Archived plans, repointed references, a regenerated index and the archival record in the run log entry.

### T2-10: Status vocabulary conformance report

**Execution:** Scan canonical artifacts (codices, protocols) for frontmatter `status` values outside the canonical set `draft / trial / active / retired`. List each file with its off-schema value. Surface on the decision board the fork: expand the official set to bless these values, or remap the files to the four canonical values. Do not pick it.

**Eligibility:** Not run in 60+ days. Slow drift.
**Output artifact:** Findings on the decision board.

### T2-11: Tag consistency hygiene

**Execution:** Gather all tags in use across active (non-archived) files with frequency counts. Flag only: case-variant duplicates (for example `sovereignty` and `Sovereignty` as two separate tags), near-duplicate or likely-typo singletons, and obvious one-off accidents. Do not flag a tag for being uncommon. There is no vocabulary to conform to; this catches genuine hygiene problems only.

**Eligibility:** Not run in 60+ days. Slow drift.
**Output artifact:** Findings on the decision board.

### T2-12: Hook coverage audit

**Execution:** Inventory the lifecycle hook events your AI Interface currently exposes. Verify the list against live documentation; do not trust a stale or worker-asserted list. Compare against the hooks registered in your settings. Surface leverage gaps with a concrete recommendation per gap. Offer a ranked recommendation.

**Eligibility:** Not run in 90+ days. Exploratory.
**Output artifact:** Findings and a ranked recommendation on the decision board.

### T2-13: Scripts-package dependency and CVE audit

**Execution:** Run `npm audit --json` (or read the audit output) in `Council Chamber/scripts/`. Report CVEs by severity with a remediation path per finding. Flag any high-severity CVE with no upstream fix as a removal-or-replace candidate. Do not run `npm audit fix` autonomously (it mutates the lockfile and can bump majors); surface the fix as a recommendation.

**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board.

### T2-14: Orphaned and superseded image sweep

**Execution:**
1. List image files under `Scriptorium/Images/` and any equivalent vault image directory.
2. For each, grep the vault (article notes, frontmatter `heroImage`, wikilink embeds) for a reference. Zero inbound references plus an mtime older than 14 days marks an orphan candidate. Include the archive directory in the grep so archived references are not mis-flagged as orphans.
3. Flag superseded timestamped generations where a canonical slug-based version for the same artifact now exists.
4. Surface the candidate list on the decision board with per-file path, size, age and reason.

**Autonomy:** Level 1, read-only scan and report. Archival stays Sovereign-judgment because an image can be referenced from a deployed surface that a vault grep does not see.
**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board.

### T2-15: Skill frontmatter conformance sweep

**Execution:**
1. Read each `Council Chamber/Skills/*/SKILL.md` frontmatter. Check for required fields per the Skills Governance Protocol and Skill Creator spec: `status`, `description`, `tier`, `contrast_tier`, `links`, all at top level (not nested under `metadata:`).
2. Report per skill: missing fields, nested-instead-of-top-level fields, and any skill rendering `status: unknown` in the skills-index script output.
3. Flag `tier` values outside the index generator's routable set and skills missing `tier` entirely. Proposed canonical values surface for Sovereign batch approval, never auto-filled.
4. Mechanical unambiguous fixes (a top-level `status` move from a nested position, an empty `links:` field add) can land as a gated Tier 1 backfill once the Sovereign authorizes. Judgment-required values stay surfaced.

**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board.

### T2-16: Skill status-to-usage drift audit

**Execution:**
1. Glob `Council Chamber/Skills/*/SKILL.md` with frontmatter `status: draft`.
2. For each, check production-use signals: referenced by the AI Interface configuration file or by another skill's handover map, carries a populated Refinements log, has run-log references, or carries a mature model-routing table. A draft with these signals is running in production on a draft flag.
3. Surface each production-grade draft on the decision board with its usage evidence and a recommended status advance. Status changes are Sovereign-gated; this reports and recommends, never flips the field.

**Eligibility:** Not run in 60+ days. Slow drift.
**Output artifact:** Findings on the decision board.

### T2-17: Contraction enforcement sweep

**Execution:**
1. Grep outward-prose source files in your vault (article drafts, template copy, email templates if present) for non-contracted forms your Writing Style Codex names as required contractions: "it is", "do not", "does not", "will not", "you are", "cannot", "they are" and peers.
2. Exclude code identifiers, URL strings and any non-prose string. Flag only reader-facing prose.
3. Report per match: file, line, the source phrase and the contracted replacement.

**Autonomy:** Level 1, read-only report. The fix is a voice-bound edit surfaced for Sovereign review.
**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board.

### T2-18: Project-memory lifecycle staleness sweep

**Execution:**
1. Walk the `project_*` files in your AI Interface's project memory directory. For each, read the stated event date, campaign window or expiry condition in the body.
2. Compare against today. Flag any whose subject event or window has passed, so it now holds historical state that could contaminate a future session loaded as if current.
3. Report each stale-event memory with its expired condition and whether it reads as a compression or retirement candidate. Read-only: the memory directory is Permanent Floor (no autonomous self-edit), so this surfaces, never edits.

**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board. Complements T2-7 (compression) and T2-4 (cross-reference health) with the temporal-staleness lens.

### T2-19: Term Registry placeholder-resolution scan

If your ecosystem does not maintain a Term Registry, skip this item.

**Execution:**
1. Read the Term Registry. Find every entry whose canonical field reads "(canonical note pending)" or points at a placeholder rather than a real canonical home.
2. For each, check whether a dedicated codex, protocol or index section now exists that could serve as the real canonical pointer.
3. Report each entry with a proposed canonical wikilink where one now exists, or a note that it still has no home. Read-only: updating the registry is a content edit the Sovereign ratifies.

**Eligibility:** Not run in 60+ days. Slow drift.
**Output artifact:** Findings on the decision board.

### T2-20: Security audit staleness sentinel

**Execution:**
1. Read the frontmatter `last_run` date from your ecosystem's Security Posture record (the canonical file your security-audit skill writes at its close). If no such file exists, fall back to a git log grep for the most recent security-check session close and note the fallback.
2. Compute days since `last_run` against today.
3. If 25 or more days have passed, surface a single decision board Section 1 line: "Security audit last ran YYYY-MM-DD, N days ago. Monthly cadence is due. Run the security-audit skill when capacity allows." Include the one alternative (defer if a known reason holds).
4. If fewer than 25 days, note "Security audit current (last ran YYYY-MM-DD, N days ago)" in the run entry and stop.

**Autonomy:** Level 1, read-only. A frontmatter read and a board note. This item never runs the audit.
**Eligibility:** Condition-based, no day-window. The check is a sub-second frontmatter read, so it runs every session as part of the standard sweep, silent until the audit approaches due.
**Output artifact:** A decision board Section 1 line when the audit is 25+ days stale, or a one-line "current" note in the run entry.

### T2-21: MCP server load-vs-use gap audit

**Execution:**
1. Read the active MCP server list from your AI Interface settings files.
2. For each registered server, grep recent session logs and `.runtime/` artifacts for tool calls attributed to that server. Record the most recent session that called each server's tools.
3. Flag any server with zero tool calls in 30+ days as a context-budget deactivation candidate. Report per server: last-used date (or "never seen in window") and the recommendation.

**Autonomy:** Level 1, read-only report. Deactivation stays Sovereign-judgment.
**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board.

### T2-22: Explicit model-set compliance audit

**Execution:**
1. Grep recent session logs and any dispatch log (last 14 days) for agent-tool dispatch records.
2. Flag two failure modes: a dispatch with no explicit `model:` set (silent parent-model inheritance), and a dispatch routed to a tier above the work warranted.
3. Report each flagged dispatch with its context and the recommended tier. Read-only.

**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board.

### T2-23: Review-date staleness sentinel

**Execution:**
1. Walk active files carrying a `next_review` or `last_reviewed` frontmatter field. Exclude any items already covered by the scheduled-maintenance scan in the SKILL.md pre-run step.
2. Compute days past due against today. `next_review` is overdue once the date passes. `last_reviewed` is stale past 60 days as a backstop.
3. Surface overdue and stale items on the decision board grouped by class (Quests or equivalent, governance, reference files) with file, field, date and days overdue.

**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board.

### T2-24: Index-file dead-link audit

**Execution:**
1. Glob `Index.md` files across active containers (Pending Plans, Codices, Library, Skills and any equivalent navigation surface).
2. For each wikilink, resolve the target by full path AND by basename across the whole vault including the archive. A link is dead only when neither resolves. Always check the archive before calling a link dead; a bare-basename link resolving to an archived copy is not broken.
3. Separate the findings: genuinely-dead links (neither path nor basename resolves) recommend removal; archive-resolving bare links recommend an explicit repoint-to-canonical only where a current non-archived version exists. Surface on the decision board. Removal and repoint are Sovereign-judgment.

**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board.

### T2-25: Settings file allow-list integrity audit

**Execution:**
1. Read your AI Interface settings file's `permissions.allow` (or equivalent allow-list). For each entry referencing a vault script path, check whether the script exists on disk.
2. Flag entries pointing at a missing script as dead-grant candidates, naming the canonical replacement where one exists.
3. Surface on the decision board. The fix path is Sovereign-run: stage the removal via the audit/apply toolchain if one exists, or flag for manual removal. The settings file is Permanent Floor: no autonomous edit.

**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board.

### T2-26: Undocumented required-env-key audit

**Execution:**
1. Grep `Council Chamber/scripts/**/*.mjs` (and equivalent script files) for env-key reads that hard-exit on absence (a `process.exit(1)` guarded on a missing `process.env.X` or `env.X`).
2. For each required key, check whether it appears in `Council Chamber/scripts/.env` or equivalent secrets file or carries a documented placeholder.
3. Flag two failure modes: a key required by a live script but absent or undocumented (a future opaque failure), and a key tied to a service retired from the ecosystem (flag the owning script as a dead-integration archival candidate).
4. Surface on the decision board. Read-only.

**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board.

### T2-27: Skill disambiguation and trigger-collision scan

**Execution:**
1. Read every `Council Chamber/Skills/*/SKILL.md` `description:` field and trigger section.
2. Cluster by domain and flag skill pairs whose description or trigger text overlaps enough that both compete for the same invocation phrase.
3. Report collision pairs plus the skills missing disambiguation fields (`false_twins`, `clarity_triggers`, `boundary_conditions` if your ecosystem uses them), prioritized by cluster density. Adding disambiguation fields is a content edit, Sovereign-gated.

**Eligibility:** Not run in 60+ days. Slow drift that grows with the library.
**Output artifact:** Findings on the decision board.

### T2-28: SKILL.md progressive-disclosure overgrowth scan

**Execution:**
1. Count lines per `Council Chamber/Skills/*/SKILL.md`.
2. Flag any SKILL.md over 300 lines without a `references/` subdirectory.
3. For each flagged skill, classify the bulk (routing tables, lookup references, session logs, examples) and propose what extracts to `references/` without breaking operational flow. The split itself is a structural change, Sovereign-gated.

**Eligibility:** Not run in 60+ days.
**Output artifact:** Findings on the decision board.

---

## Site-Stewardship Lane (optional, graduated, PR-based)

This lane applies only if your ecosystem maintains external repositories with their own main branches. If your vault is self-contained with no external repos, this lane is inactive and can be ignored.

When active, this is a third execution surface distinct from Tier 1 (vault edits land) and Tier 2 (vault reports). The lane holds additive or corrective technical fixes to external repos, executed as build-verified pull requests. The permanent floor sits below it always: no copy or voice change, no deletion, no canonical move, no outward broadcast, no direct push to a main branch.

**Entry posture: Level 3, propose-only.** Every site-fix class enters here. The skill surfaces the proposed fix on the decision board. It does not act. A class executes only after the Sovereign authorizes it, and the execution form is always a branch plus a pull request with a green build. The Sovereign merges.

**The climb.** A class with a clean track record of merged PRs and zero breakage climbs one ratified step at a time: Level 3 (propose-only) to Level 2 (auto-open PR, Sovereign merges) to auto-merge on green build. Every climb passes the Flywheel Three Laws coherence check.

**Class registry.** Each class carries: the finding type it serves, the exact edit shape, the build-verification command, the PR-title convention and its current autonomy level. The class registry is empty at template initialization. Add classes as your ecosystem earns them through the climb.

---

## Research Rotation Categories

The research rotation (SKILL.md Step 8) is the engine of menu growth. It runs every session, rotating through the categories below. The cadence rule keys count to category total: six or fewer categories means one per session, more than six means two per session. The skill picks the N least-recently-researched categories from `research_state` in the log frontmatter, dispatches one Sonnet worker per category, and each worker returns a self-ranked top-5 candidate list with a one-line "why this beat the rest."

Nine categories at creation, so the rule lands on two per session.

**Ground-truth gate (standing rule, all categories).** A research candidate that asserts a claim about the current state of an existing artifact is making a claim, and a claim is verified at the moment it is made. Before any such state-claim reaches the decision board, run the cheapest live check that confirms or kills it: an `ls`, a Grep, a scoped Read against the named artifact. A candidate whose premise fails verification never reaches the Sovereign. A forward proposal to build something absent is fine and needs no artifact check. A claim that a present artifact is absent or stale is a factual assertion and must be ground-truthed.

1. **External practices and tooling.** What the broader agentic and AI field is doing that your ecosystem could adopt. Force external sources with URLs. Reject vault-internal candidates that duplicate the hygiene categories.
2. **Vault hygiene and integrity.** Wikilinks, orphans, frontmatter, naming conventions.
3. **Infrastructure and scripts.** Script health, hooks, MCP loadout, automation gaps.
4. **Discoverability and content.** AI discoverability, content freshness, manifest accuracy.
5. **Skill library health.** Cross-references, redundancy, progressive disclosure, routing matrices.
6. **Governance coherence.** Codex consistency, protocol drift, status vocabulary, structural alignment.
7. **Expression and voice integrity.** Anti-AI patterns and Writing Style Codex adherence across artifacts.
8. **Memory and knowledge architecture.** MEMORY.md health, codex inbound density, knowledge map currency.
9. **Cost and routing efficiency.** Model routing adherence, token efficiency, routing discipline.

Each category ID for `research_state` tracking: `R1` external-practices, `R2` vault-hygiene, `R3` infrastructure, `R4` discoverability, `R5` skill-library, `R6` governance, `R7` expression, `R8` memory-architecture, `R9` cost-routing.
