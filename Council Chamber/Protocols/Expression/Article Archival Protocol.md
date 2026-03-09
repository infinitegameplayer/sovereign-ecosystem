---
status: active
version: 1.0
tier: foundational
purpose: Govern the completion phase of the article lifecycle â€” article archival, feedback loop and social breakdown archival
module: Expression Module
links:
  - "[[Council Chamber/Protocols/Expression/Article Drafting Protocol]]"
  - "Expression writing-style codex (if installed)"
---

# Article Archival Protocol

Purpose: Close the article lifecycle cleanly. Governs two archival events and the cross-article feedback loop that feeds the next drafting session.

Scope: Long-form articles in `Scriptorium/Articles/`. Social breakdown archival is also handled here, triggered separately.

---

## Lifecycle Map

```
Article drafted --> published (distribution_state: published)
    |
    v
Breakdown session runs --> breakdown note created
    |
    v
EVENT 1: Article + assets archive to Vault
    |
    v
Social posts published over days (breakdown stays in Scriptorium)
    |
    v
Sovereign signals: "all posts published"
    |
    v
EVENT 2: Breakdown note archives to Vault
```

---

## Event 1: Article Archival

**Trigger:** Breakdown session complete â€” breakdown note exists with all posts drafted.

**Steps:**

1. Confirm the breakdown note is saved in `Scriptorium/Articles/Breakdown - [Title].md`.
2. Move the article note to the Vault:
   - From: `Scriptorium/Articles/Article - [Title].md`
   - To: `Vault (Archive)/Domains/Expression/Articles/Article - [Title].md`
   - Filename does not change â€” preserves wikilink integrity from the breakdown note.
3. Move any associated assets:
   - From: `Scriptorium/Articles/Images/[article images]`
   - To: `Vault (Archive)/Domains/Expression/Articles/Images/[article images]`
4. Update the breakdown note's wikilink to point to the Vault path.
5. Run the Cross-Article Feedback Pass (see below).

**Approval gate:** Confirm article path and assets before moving. No moves without explicit approval.

---

## Cross-Article Feedback Pass

Run immediately after Event 1, while the article is fresh.

**Purpose:** Surface voice, structure and taste patterns across 3 articles to feed continuity into the next drafting session.

**Steps:**

1. Read the article just archived (current).
2. Read the 2 most recently archived articles in `Vault (Archive)/Domains/Expression/Articles/`.
3. Compare across all 3. Surface any patterns in:
   - Voice signals (recurring phrases, sentence rhythm, metaphor types)
   - Structure patterns (how articles open, how they close, what sections recur)
   - Taste signals (what is landing well, what feels forced, what is alive vs. performed)
   - Editorial decisions (what the Sovereign tends to change in edits)
4. Distill observations â€” specific, not generic. Note whether each observation is new or recurring from a previous pass.
5. Apply a stability filter before updating the Codex:
   - **First observation of a pattern:** Hold it. Log it in the breakdown note under `## Archival Observations` but do not yet write it to the Codex.
   - **Pattern seen in 2+ consecutive passes:** Consider it stable. If your Writing Style Codex is installed, propose updating `## Rolling Pattern Signals` there. If it is not installed yet, hold the stable pattern in the breakdown note for later codex creation. Await Sovereign approval before writing either way.
   - **Pattern contradicted by next article:** Discard. Writing varies â€” single-article signals are noise, not signal.
6. Rolling Pattern Signals is a register of confirmed, stable patterns â€” not a snapshot of the last 3 articles. It changes slowly and intentionally.

This section is read automatically during Voice Anchoring in the next Article Drafting session. No extra routing needed.

---

## Event 2: Breakdown Archival

**Trigger:** Sovereign signals that all social posts for this article have been published.

**Steps:**

1. Confirm all posts in the breakdown note's Publish Log are logged with dates and links.
2. Move the breakdown note:
   - From: `Scriptorium/Articles/Breakdown - [Title].md`
   - To: `Vault (Archive)/Domains/Expression/Social/Breakdown - [Title].md`
3. Confirm `Scriptorium/Articles/` is clean â€” no orphaned breakdown notes or assets for this article.

**Approval gate:** Confirm publish log is complete before moving.

---

## Future Enhancement: Archival State Frontmatter

A potential improvement for tracking article lifecycle state in frontmatter:

Add an `archival_state` field to article frontmatter:
```yaml
archival_state: draft | archived
```

- Set to `archived` when Event 1 executes (article moved to Vault).
- This makes the article's archival status queryable without relying on its file location alone.

*Hold pending: no action until next article drafting cycle. Review at that point.*

---

## Scriptorium Clean State

At any given time, `Scriptorium/Articles/` should contain only:
- Articles currently in progress (`status: draft`)
- Breakdown notes where social posts are still being published
- No orphaned images, no archived articles, no completed breakdowns

---

## Contrast Layer Integration (Mandatory)

Tier: 1 (foundational).
- Frontmatter contrast fields required.
- Footer internal contrast block required.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- This protocol governs archival and feedback only â€” not drafting or breakdown creation.
- Cross-article feedback pass is not optional at Event 1 â€” it is the mechanism for continuity.
- Event 1 and Event 2 are separate sessions triggered by separate conditions; do not conflate them.
- The Rolling Pattern Signals section replaces previous content on each update â€” it is not a cumulative log.
-->
