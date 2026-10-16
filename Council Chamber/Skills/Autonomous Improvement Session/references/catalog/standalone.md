---
status: active
created: 2026-10-16
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# Standalone items (outside every bundle)

### T1-1: Wikilink integrity re-sweep

**Verb:** Acts.

**Execution:**
1. Run your vault's link-checker script (if present) or walk `[[wikilink]]` references manually across `Council Chamber/Skills/`, `Council Chamber/Protocols/`, `Council Chamber/Codices/`, `Council Chamber/Governance/` and your AI Interface configuration file. For each broken link, if the target file exists at a slightly different path (renamed, suffix added, moved), fix the wikilink in place.
2. Skip bare-word cluster links (tag-style single-word links with no path). Surface count to the Sovereign in the run entry.
3. Skip any wikilink where the target file genuinely does not exist anywhere in the vault. Surface to the Sovereign with the suspected delete date from git log (if tracked).

**Scope boundary:** wikilink path-correction hygiene only. This item repoints a broken link to its verified-existing target and nothing more. It never edits, synthesizes, consolidates or rescopes the content of a governance document.

**Eligibility:** Not run in 7+ days.
**Output artifact:** Run entry shows count of links fixed, count skipped (bare-word) and count surfaced (missing target).

### T1-2: Index regeneration

**Verb:** Acts.

**Execution:**
1. Run any index-generation scripts present in `Council Chamber/scripts/` (for example `build-pending-plans-index.mjs` or equivalent). Confirm the regenerated index shows the correct total count.
2. Sweep Pending Plan frontmatter `related:` and `parent:` fields for wikilinks pointing to active-directory paths that no longer exist (likely archived). Update each to the archive path. Scope to frontmatter list-item wikilinks only, never prose mentions in plan bodies or activity logs. Prose mentions are intentional history.

**Eligibility:** Condition-based. Eligible whenever a plan was added, archived or had its status change since the last index build. No day-window.
**Output artifact:** Regenerated index files plus any frontmatter field corrections in Pending Plan files.

### T1-5: Codices Index completeness sweep

**Verb:** Acts.

**Execution:**
1. Glob codex files under `Council Chamber/Codices/` recursively. For each with frontmatter `status: active` (or no retired marker), check whether it appears in `Council Chamber/Codices/Codices Index.md`.
2. For each active codex absent from the index, add an entry in the correct category section, matching the neighbors' format, description sourced from the codex's own frontmatter `description` or opening heading.
3. Skip codices flagged intentionally out-of-index. Surface any ambiguous category placement as a judgment fork. Add the unambiguous ones.

**Eligibility:** Condition-based. Eligible whenever an active codex is absent from the index. 30-day window as a backstop.
**Output artifact:** Edited Codices Index. Additions recorded in Done.

### T1-6: Superseded-artifact and dead-section sweep

**Verb:** Acts.

**Execution:**
1. Grep active containers (`Council Chamber/`, `Library/`, and any equivalent active-content container in your vault) for frontmatter `status: superseded` or `status: retired` on files still outside your archive location.
2. For each that carries an explicit `superseded-by` pointer or a clear archival destination, archive it via plain `mv` to the matching archive location, run the move-audit sweep (grep the vault for the old path and repoint active references to the canonical superseder, not to the archive path), regenerate any affected index.
3. Find temporary or transitional sections that point at a path that no longer exists. Remove the dead section.
4. Surface as judgment forks only: a superseded file with no destination pointer, or a section whose staleness is ambiguous. Act on the clear cases.

**Repoint rule:** when a file carries a `superseded-by` pointer, the move-audit repoints active references to that canonical superseder, never to the archive path. No active note or codex points at a superseded version when a current canonical one exists.

**Eligibility:** Condition-based. Eligible whenever a superseded or retired file sits in an active container, or a confirmed dead-path temporary section exists.
**Output artifact:** Archived and cleaned files, move-audit repoints, all recorded in Done.

### T1-7: Runtime log rotation

**Verb:** Acts.

**Execution:**
1. For each gitignored operational log under `.runtime/` or your scripts log directory (session-stop log, approval-gate log, dispatch log, index-regen log and peers), if it exceeds the line cap, truncate to the last N lines (default cap 2000). This is operational maintenance of a transient append log, not content deletion.
2. List stale `.runtime` files (30+ days old, not active state files) as Sovereign-approved removal candidates. Do not delete them. File deletion is the Permanent Floor, so the purge stays surfaced, not autonomous. List literal filenames, never ranges or shorthand, in the purge-surfaced list.
3. Track already-surfaced purge candidates in the log frontmatter `runtime_purge_surfaced` list. Each run, surface only files not already on that list, and add a tail note counting how many previously-surfaced files still await an approved purge. When the Sovereign approves and the purge executes, clear `runtime_purge_surfaced`.
4. Never touch a tracked governance or content file, only the named operational logs.
4b. **Classifier-denial fallback.** When the auto-mode classifier denies the truncation, do not fight it. Put the truncation on Your decisions as a "say go and I will run it" entry and treat the item as complete. Explicit Sovereign permission in a return session clears the denial.

**Eligibility:** Condition-based. Eligible whenever a named operational log exceeds its line cap.
**Output artifact:** Truncated logs. Stale-file removal candidates on Your decisions.

### T2-1: Inbox triage sweep

**Verb:** Acts.

Anything safely routable, route it. Do not ask. The capture-classify-route doctrine is the ruleset below and it sharpens every cycle.

**Execution:** Walk `Inbox/` files (skip the Inbox infrastructure: `Index.md`, `README.md`, any file the skill catalog references as a live source). For each unrouted item, classify by the heuristics below and act:
- **Safely routable (confident match to a heuristic):** route it now via plain `mv`. After any move, run the move-audit wikilink sweep for the old path and repoint active references. Record the route in the run log entry.
- **Hold-for-Sovereign (real judgment, durable-role decision or conflicting heuristics):** surface on Your decisions. Do not move.

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

### T2-8: Breadcrumb propagation and stale-reference sweep

**Verb:** Reports.

**Execution:**
1. Gather changed governance artifacts from recent git history (last 14 days). Filter to `Council Chamber/Codices/`, `Council Chamber/Protocols/`, `Council Chamber/Governance/`, `Council Chamber/Pending Plans/` and your AI Interface configuration file. These are the artifacts whose recent change may have left parallel documents stale.
2. For each changed artifact, grep the vault for inbound wikilink references and for documents that enumerate the same subject (dashboards, arc protocols, governance trees). Build a per-artifact candidate list.
3. For each artifact with candidate parallel docs, check whether those docs reflect the change or carry a now-stale claim (old name, old status, retired artifact, superseded path). Read-only. Propose the reconciliation; do not apply it.
4. Verify findings against live files. Check git history before calling any mismatch drift, a mismatch often has intentional history. Write a report listing per finding: the changed artifact, the parallel doc, the verbatim stale line and the proposed correction.

**Scope boundary:** read-only. Every correction is a proposal for Sovereign review.
**Eligibility:** Not run in 14+ days.
**Output artifact:** Findings on the decision board.

### T2-9: Implemented-plan archival candidate sweep

**Verb:** Acts.

**Execution:**
1. Walk `Council Chamber/Pending Plans/*.md`. For each, read frontmatter `status` and `implementation_state`.
2. Flag any plan whose `status` is `implemented`, or whose `implementation_state` reads as shipped or complete with a final activity log, that still sits in the active directory rather than the archive.
3. For each flagged plan, confirm completion from the strongest available evidence: frontmatter `status: implemented`, recent commits and git log naming the plan complete, and external confirmation such as a sent email or a live URL. Treat Next-Step and activity-log prose as the weakest signal because it goes stale after the work ships. When status and body disagree, investigate to the actual state rather than defaulting to a hold.
4. Archive each confirmed plan via plain `mv` to the archive directory. Run the move-audit wikilink sweep (grep the vault for the old active path and repoint every active reference; skip historical session logs and the plan's own body). Regenerate the active index. Record each archival in the run log entry with the plan name, implemented date and evidence.
5. Concurrent-session guard: skip archival of any plan whose file carries uncommitted working-tree modifications. Another session may be mid-closeout and the move would collide. Archive on a later run and note the hold in the run entry.

Implemented Pending Plan archival is operational lifecycle closure, not a governance move. It stays inside the vault, it is reversible, it deletes nothing and it changes no governance. The move and the move-audit sweep are one unit of work. A plan with an explicit hold-active instruction is the only skip.
**Eligibility:** Condition-based. Eligible whenever a `status: implemented` plan sits in the active directory. No day-window.
**Output artifact:** Archived plans, repointed references, a regenerated index and the archival record in the run log entry.

### T2-12: Hook coverage audit

**Verb:** Reports.

**Execution:** Inventory the lifecycle hook events your AI Interface currently exposes. Verify the list against live documentation; do not trust a stale or worker-asserted list. Compare against the hooks registered in your settings. Surface leverage gaps with a concrete recommendation per gap. Offer a ranked recommendation.

**Eligibility:** Not run in 90+ days. Exploratory.
**Output artifact:** Findings and a ranked recommendation on the decision board.

### T2-24: Index-file dead-link audit

**Verb:** Reports.

**Execution:**
1. Glob `Index.md` files across active containers (Pending Plans, Codices, Library, Skills and any equivalent navigation surface).
2. For each wikilink, resolve the target by full path AND by basename across the whole vault including the archive. A link is dead only when neither resolves. Always check the archive before calling a link dead; a bare-basename link resolving to an archived copy is not broken.
3. Separate the findings: genuinely-dead links (neither path nor basename resolves) recommend removal; archive-resolving bare links recommend an explicit repoint-to-canonical only where a current non-archived version exists. Surface on the decision board. Removal and repoint are Sovereign-judgment.

**Eligibility:** Not run in 30+ days.
**Output artifact:** Findings on the decision board.
