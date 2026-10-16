---
status: active
created: 2026-10-16
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# Retired items

Tombstones, kept so every ID in the run history resolves. A header carrying `(RETIRED` is skipped. Nothing here runs.

### T1-3: Anti-AI sweep on draft articles (RETIRED)

Retired, Sovereign-directed. Tombstone kept for history.

The premise was wrong for the workflow. The anti-AI edit pass belongs at drafting time, run by the drafting skills while a piece is being written, not as a background sweep over drafts that are sitting or already published. Re-sweeping a finished or shipped draft spends tokens to edit work that is already done, and it touches the Sovereign's in-progress drafts without the Sovereign's hand on them. Anti-AI quality is enforced where it belongs: at the moment of authoring and in the Sovereign's own editing pass. No autonomous anti-AI sweep remains, by design.

### T1-4: Memory file slug variant normalization (RETIRED 2026-10-16)

Retired in the v2 rewrite. Tombstone kept for history.

The item's premise was inverted for the current memory convention. It assumed memory links should be normalized to underscore form because memory filenames use underscores. The canonical inter-memory link form is the memory's own kebab-case `name:` slug (`name: three-solutions-rule`, linked `[[three-solutions-rule]]`), while the filename may differ. Running the normalization rewrites correct `[[kebab-slug]]` links into `[[underscore_slug]]` links that match no `name:` field, corrupting the memory graph.

Memory-link health is owned by T2-4 (memory file cross-reference health) and T2-47 (cross-memory link integrity), both read-only. If you ran T1-4 before this release, run T2-4 once to find any link it rewrote. The memory directory is Permanent Floor: the only safe operations are a read-and-report and your own edits.
