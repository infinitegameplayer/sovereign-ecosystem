---
status: active
created: 2026-10-16
bundle: B3
name: frontmatter
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# B3: Frontmatter

Two bundles run per run (SKILL.md Step 2). This bundle's Reports items go to one read-only worker with this file as its brief; any Acts item here runs on the orchestrator and the worker skips it. Items in a bundle run when the bundle runs, so their old day-windows no longer gate them.

### T2-10: Status vocabulary conformance report

**Verb:** Reports.

**Execution:** Scan canonical artifacts (codices, protocols) for frontmatter `status` values outside the canonical set `draft / trial / active / retired`. List each file with its off-schema value. Surface on the decision board the fork: expand the official set to bless these values, or remap the files to the four canonical values. Do not pick it.

**Output artifact:** Findings on the decision board.

### T2-11: Tag consistency hygiene

**Verb:** Reports.

**Execution:** Gather all tags in use across active (non-archived) files with frequency counts. Flag only: case-variant duplicates (for example `sovereignty` and `Sovereignty` as two separate tags), near-duplicate or likely-typo singletons, and obvious one-off accidents. Do not flag a tag for being uncommon. There is no vocabulary to conform to; this catches genuine hygiene problems only.

**Output artifact:** Findings on the decision board.

### T2-23: Review-date staleness sentinel

**Verb:** Reports.

**Execution:**
1. Walk active files carrying a `next_review` or `last_reviewed` frontmatter field. Step 0 already surfaces a passed `next_review`; this item is the `last_reviewed` backstop and the grouped report.
2. Compute days past due against today. `next_review` is overdue once the date passes. `last_reviewed` is stale past 60 days as a backstop.
3. Surface overdue and stale items on the decision board grouped by class (Quests or equivalent, governance, reference files) with file, field, date and days overdue.

**Output artifact:** Findings on the decision board.

### T2-52: Empty and stub note detection

**Verb:** Reports.

The structural-note analog of T2-14 (orphaned-image sweep). A note that resolves as a wikilink target but holds no content passes every link-integrity check silently and surfaces only when a human opens it and finds nothing.

**Execution:**
1. Walk active-container `.md` files. Skip `Vault (Archive)/`, any `node_modules/` tree and the memory directory.
2. Flag any note whose body (content after the frontmatter block) is empty or near-empty: zero non-whitespace body, or frontmatter plus a single heading with no body prose, under a small byte threshold (for example 50 body bytes).
3. For each flagged note, count inbound `[[wikilink]]` references across the vault so the orchestrator can classify. A stub with inbound links is a placeholder with purpose (a planned note not yet written). A stub with zero inbounds is pure lint.
4. Report each candidate with path, body byte count and inbound count. Read-only.

**Why read-only:** Any archival or fill of a stub is Sovereign judgment, because a stub may be a deliberate placeholder.
**Output artifact:** Findings on the decision board.

### T2-53: Frontmatter date-format conformance audit

**Verb:** Reports.

A single non-ISO date silently breaks any script that sorts or filters by a frontmatter date, while staying invisible to a human reader.

**Execution:**
1. Walk active-container `.md` files. For each, read the frontmatter date-bearing fields (`created`, `updated`, `date`, `due`, `next_due`, `last_run`, `last_reviewed`, `next_review` and similar).
2. Flag any value that does not match ISO `YYYY-MM-DD` (catch `YYYY/MM/DD`, `MM-DD-YYYY`, `DD-MM-YYYY`, month-name forms and partial dates). Skip a field whose value is intentionally blank and skip non-date fields.
3. Report per finding: file, field, current value and the proposed ISO normalization. Read-only.

**Why read-only:** The date is canonical data, so correcting it is a content edit the Sovereign ratifies, never an autonomous rewrite (an ambiguous `01-02-2026` could be Jan 2 or Feb 1). A future ratified climb could auto-fix only the unambiguous reformats (`YYYY/MM/DD` to `YYYY-MM-DD`).
**Output artifact:** Findings on the decision board.

### T2-56: YAML frontmatter validity scan

**Verb:** Reports.

An unquoted colon in a frontmatter value (`title: Field Notes: The Complete Guide`) is invalid YAML, so Obsidian silently fails the whole properties block for that file. `type`, `status`, `date` and every other field stop registering, which defeats every frontmatter-based audit (T2-10, T2-53 and any date or deadline script) for exactly the files that are broken.

**Execution (read-only):**
1. Walk active-container `.md` files (same scope as T2-53). For each frontmatter block, parse it as YAML (or apply targeted lint checks: unquoted colon inside a value, tab indentation, duplicate keys, unclosed quotes, `[[...]]` inside a flow value where a quoted string is expected).
2. Report per finding: file, offending line, the failure class and the quoted correction. Distinguish hard invalidity (the whole block fails) from soft misparse (a field parses to the wrong shape, like `links: [[X]]` becoming a nested array).
3. Make no edits. The fix (quoting a value) is mechanical and a strong future climb candidate after one clean approved report cycle.

**Output artifact:** Findings on the decision board.
