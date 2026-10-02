---
title: Doctrine Mass Baseline
type: doctrine-tracking
status: active
container: Council Chamber
cadence: appended at each doctrine review pass, plus inflection points
data_source: doctrine-mass.mjs (Council Chamber/scripts/), all-markdown-recursive count per layer
related:
  - "[[Council Chamber/Skills/Skills Index]]"
  - "[[Council Chamber/Codices/Codices Index]]"
---

# Doctrine Mass Baseline

Rolling count of the doctrine layer: codices, protocols, skills, governance docs. Plans already carry a visible lifecycle in most ecosystems: proposed, approved, implemented, archived. Doctrine tends to have birth without measured death, so its growth stays invisible until it is unmanageable. This note makes the curve visible, so growth stays a deliberate choice rather than an unmeasured accretion.

Append new rows in chronological order. Do not overwrite prior rows. The trend is the point.

## Counting definition

Each cell is `artifacts / lines`. Produced by `node Council Chamber/scripts/doctrine-mass.mjs`.

- **Codices:** every `.md` under `Council Chamber/Codices`, recursive.
- **Protocols:** every `.md` under `Council Chamber/Protocols`, recursive.
- **Skills:** each `Council Chamber/Skills/<name>/SKILL.md`, one per skill.
- **Governance:** every `.md` under `Council Chamber/Governance`, recursive (this note included).

Keep the definition stable once a baseline is running. Changing what counts as an artifact breaks trend comparability between rows.

## Doctrine Mass Table

| Snapshot Date | Codices | Protocols | Skills | Governance | Total | Notes |
|---|---|---|---|---|---|---|
<!-- doctrine-mass-rows-end -->

## Records are not doctrine

Dated audit records, findings reports and one-time reviews can sit inside the doctrine tree and govern nothing. Counting them means the number built to show whether doctrine is growing also measures how often doctrine was audited. The script excludes them and reports an `excluded` count per layer, so the exclusion stays visible.

Two exclusion mechanisms, because records take two shapes.

- **Whole folders of run artifacts** are named in `RECORD_DIRS` inside `doctrine-mass.mjs`. The list ships empty. To add a record folder, put its folder name in the list. Any file under a directory of that name is excluded.
- **Individual dated reports sitting beside real doctrine** carry `doctrine: false` in frontmatter. This is an edit rather than a move, so marking a file as a record never crosses the Permanent Floor.

When adding a record, mark it or place it in a record folder at creation time, rather than leaving it for the next audit to find.

**Changing the exclusion changes the basis, so the series gets a seam.** If you add a record folder or mark existing files after rows are already recorded, append two rows on the same day, one measured the old way and one the new way, and say so in the Notes column. The difference between them is the conversion factor. Compare later rows to the new-basis row, not to the rows above it.

## How to append

Run `node Council Chamber/scripts/doctrine-mass.mjs --append`. The script measures every layer and inserts one dated row on the line above the `doctrine-mass-rows-end` sentinel. The bare run (no flag) prints the report and a paste-ready row without writing. Run it at each doctrine review pass, or whenever a consolidation or expansion effort makes the before-and-after count worth capturing.

---

*Template note. Row one lands the first time `doctrine-mass.mjs --append` runs in this vault.*
