---
status: active
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# Step 2: Select and announce detail

Build the due list from the catalog and the log:

- **Condition-based items** run whenever their target is non-empty, never by timer.
- **Windowed standalone items** run once their window has passed since `last_run`.
- **Flagged items.** Anything in `priority_flags` is due regardless of window and lifts to the top. Consume the flag at Step 8 when the item delivers.
- **The two bundles** are the never-run ones first, then the oldest in `bundle_state`.

Rank the standalone items (flagged first, then furthest past their window) and take them up to a budget of 8, plus the two bundles. An item name from the Sovereign is the plan. A count honors the ranked list. "Full sweep" runs every due item and every bundle. A Proposes item does not run: it goes to Your decisions as "run it?". Open the catalog files of the selected items only.

Announce in one paragraph: "Running N items. Acts: [list]. Reports: [list]. Bundles: [ids]." It is the only Sovereign-facing message until close.
