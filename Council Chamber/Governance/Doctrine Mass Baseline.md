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

## How to append

Run `node Council Chamber/scripts/doctrine-mass.mjs --append`. The script measures every layer and inserts one dated row on the line above the `doctrine-mass-rows-end` sentinel. The bare run (no flag) prints the report and a paste-ready row without writing. Run it at each doctrine review pass, or whenever a consolidation or expansion effort makes the before-and-after count worth capturing.

---

*Template note. Row one lands the first time `doctrine-mass.mjs --append` runs in this vault.*
