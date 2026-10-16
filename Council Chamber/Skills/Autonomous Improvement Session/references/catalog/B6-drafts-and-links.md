---
status: active
created: 2026-10-16
bundle: B6
name: drafts and links
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# B6: Drafts and links

Two bundles run per run (SKILL.md Step 2). This bundle's Reports items go to one read-only worker with this file as its brief; any Acts item here runs on the orchestrator and the worker skips it. Items in a bundle run when the bundle runs, so their old day-windows no longer gate them.

### T2-2: Stale draft surface

**Verb:** Reports.

**Execution:** Walk `Scriptorium/` (or your vault's equivalent drafts directory). For each draft older than 30 days, classify: ready-to-publish (complete prose, status flag indicates ready), event-gated (frontmatter names a gating event), abandoned (no recent activity, no gating event). Produce a report per content type (articles, notes, any other active drafts container).

**Output artifact:** Findings on the decision board. No Inbox report.

### T2-3: External link rot scan

**Verb:** Reports.

**Execution:** Sweep outbound URLs in `Scriptorium/Articles/` (and any other published-article or published-note directory in your vault). Fetch each (HEAD or short GET), flag any 4xx or 5xx response. Skip URLs requiring auth, payment walls or known anti-bot surfaces.

**Output artifact:** Findings on the decision board. No Inbox report.

### T2-14: Orphaned and superseded image sweep

**Verb:** Reports.

**Execution:**
1. List image files under `Scriptorium/Images/` and any equivalent vault image directory.
2. For each, grep the vault (article notes, frontmatter `heroImage`, wikilink embeds) for a reference. Zero inbound references plus an mtime older than 14 days marks an orphan candidate. Include the archive directory in the grep so archived references are not mis-flagged as orphans.
3. Flag superseded timestamped generations where a canonical slug-based version for the same artifact now exists.
4. Surface the candidate list on the decision board with per-file path, size, age and reason.

**Why read-only:** Archival stays Sovereign-judgment because an image can be referenced from a deployed surface that a vault grep does not see.
**Output artifact:** Findings on the decision board.

### T2-17: Contraction enforcement sweep

**Verb:** Reports.

**Execution:**
1. Grep outward-prose source files in your vault (article drafts, template copy, email templates if present) for non-contracted forms your Writing Style Codex names as required contractions: "it is", "do not", "does not", "will not", "you are", "cannot", "they are" and peers.
2. Exclude code identifiers, URL strings and any non-prose string. Flag only reader-facing prose.
3. Report per match: file, line, the source phrase and the contracted replacement.

**Why read-only:** The fix is a voice-bound edit surfaced for Sovereign review.
**Output artifact:** Findings on the decision board.
