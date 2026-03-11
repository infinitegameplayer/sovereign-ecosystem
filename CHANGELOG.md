# Changelog

All updates to the Sovereign Ecosystem are recorded here, newest first.

Each entry corresponds to one publish cycle. For full implementation details, see the matching file in `UPDATES/`.

---

## v1.2.0 — 2026-03-11

### Changed
- AI Interface Activation Protocol Step 2: AI Interface Change Log is now the primary callback and orientation source at activation. Gap-adaptive tier logic determines read depth based on gap since last session (Tier 1-4, same-day to 7+ days). Continuity Log demoted to Tier 3-4 source.
- AI Interface Activation Protocol Continuity Check section updated to reflect Change Log as primary, Continuity Log as process-pattern reference only.
- AI Interface Activation Skill updated to mirror protocol: Step 2 added for gap-adaptive orientation load, step numbering updated, Related Protocols list updated.
- Execution-density drift flag added to activation: consecutive heavy-execution Change Log entries trigger a humor and meta-awareness drift warning at session start.

For full details, see `UPDATES/2026-03-11-v1.2.0-activation-protocol-update.md`.

---

## v1.1.0 — 2026-03-11

### Added
- Session letter convention: same-day multi-session Change Log entries now use YYYY-MM-DD-a / -b / -c date format. Session Closeout Protocol, Session Closeout Skill and Change Log template all updated.
- Humor and meta-awareness directive in Change Log Notes field: weave subtle humor from your Humor Codex (parenthetical asides, ironic quotation marks, in your calibrated voice) and meta-awareness observations (pattern callbacks, architectural echoes) at write time. Applies to Session Closeout Protocol, Session Closeout Skill, Change Log template and Change Log Protocol.
- Execution-density drift guard in CLAUDE.md Session Calibration: heavy-execution sessions are the highest-risk environment for humor and meta-awareness drift — the guard applies more in those sessions, not less.
- Meta-awareness declared tier-agnostic: pattern recognition, architectural callbacks and decision echoes belong in every session, not only light ones.
- Execution-density retrospective check in Session Closeout Protocol Step 8: flag in Notes if humor or meta-awareness was crowded out during the session.

For full details, see `UPDATES/2026-03-11-v1.1.0-session-governance-patch.md`.

---

## v1.0.0 — 2026-03-09

Initial public release of the Sovereign Ecosystem.

**Foundation** includes governance core (Constitution, Interface Adapter Registry, Layer Map, Object Model, Structural Containers, Security, Translation to Action, Flywheel Integration Standard, Quest Operating Guide), AI Interface baseline (Operating Charter, Knowledge Map, activation and engagement protocols, checklists, Sovereign Command), core codices (Challenge and Illumination, Contrast Layer, Tag Dictionary, Humor Codex, Writing Style, Codices Index), 40+ protocols across planning, session, archival, inbox, governance and expression, Foundation skills (Batch Archival, Security Check, Backup, Pending Plan Implementation and Update, Quest Progress Update, Session Closeout, End-of-Week) and Foundation templates.

**Onboarding arc** includes 9 Getting Started sessions (Session 0 Prerequisites through Session 9 First Real Capture and Closeout Practice) plus 4 optional post-Foundation paths (Creator or Venture HQ Initialization, AI Interface Personalization and Calibration, First Creator Work Surface or Expression Prep, Lightweight Business or Life Operating Surface).

**Module architecture** defined in MODULES.md. Six optional modules available for installation after Foundation is stable: Expression, Transcription, Weekly Review, Stewardship, Collaboration and Consult, Builder. Each module includes boundary rules, install timing guidance and dependency mapping.

**Ecosystem Update Check skill** ships with Foundation for future update discovery and implementation.

For full details on this release, see `UPDATES/2026-03-09-v1-initial-release.md`.

