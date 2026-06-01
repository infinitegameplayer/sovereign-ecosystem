# Changelog

All updates to the Sovereign Ecosystem are recorded here, newest first.

Each entry corresponds to one publish cycle. For full implementation details, see the matching file in `UPDATES/`.

---

## v2.9.1, 2026-05-31

### Added
- **Autonomous Improvement Session skill** (optional module) at `Council Chamber/Skills/Autonomous Improvement Session/`. Set-and-forget hygiene and improvement run that executes safe vault-internal work without per-item approval and surfaces only genuine judgment forks on a four-bucket decision board. A recursive flywheel: a research rotation grows its own menu, a threshold model climbs execution authority one earned step at a time, a Permanent Floor never moves. Ships with its operating-mindset CLAUDE.md and a seed log. Sovereign-invoked, never scheduled.

### Posture
The Session Closeout (v2.9.0) routes deep ripple-chasing to this skill, so the close stays fast and the second-order sweep has a home. Menu growth is fast and wide. Execution authority is slow and earned.

For full details, see `UPDATES/2026-05-31-v2.9.1-autonomous-improvement-session.md`.

---

## v2.9.0, 2026-05-31

### Added
- **The Primer (`Primer.md`).** A new canonical forward-handoff surface, read first at every session start. Most Alive Next Move, In Execution, Active Commitments, Parked, Session Opener. Pre-loaded with onboarding orientation so a fresh download opens to guidance into the Getting Started folder. CLAUDE.md gained a Session Start section naming the Primer as the first read.
- **Concurrency-aware staging** in the auto-commit step (solo versus concurrent paths) so a sibling session's work is never swept into the wrong commit.

### Changed
- **Session Closeout collapses to a single lean close.** Three actions every session: breadcrumb what you touched, refresh the Primer, commit with a readable body. Sovereign Command gets only a light touch and stays the minimal live-signal glance. Breadcrumb scope widened from plans-only to any artifact touched.

### Removed
- **The per-session narrative log.** No new logs are written to `Vault (Archive)/Session Logs/`. Git is the log: the commit body is the backward session record. No non-git fallback, since the template assumes a git-tracked vault.
- **The lightweight-versus-full mode binary** from v2.7.0. The three-worker reconciliation became an escalation tool fired only for very large sessions.

### Frozen
- Any existing Session Logs and their `Index.md` become a historical archive. Activation reads repointed to the Primer plus git commit bodies across the Activation Protocol, the Activation skill and the Knowledge Map.

### Posture
Supersedes the closeout half of v2.7.0. Three surfaces, three tenses: the Primer is the future, Sovereign Command is the present, the commit body is the past.

For full details, see `UPDATES/2026-05-31-v2.9.0-primer-and-single-lean-close.md`.

---

## v2.8.2, 2026-05-22

### Changed
- **CLAUDE.md body prose.** Four em dashes removed: one in Session Calibration, one in Expression Standards (the no-em-dash rule statement itself), one in the Approval Gate, one in Agent SDK Capabilities. Each replaced with a period and a new sentence, or a comma. Structural exemptions preserved (file title, frontmatter description, definition list labels under auto memory, wikilink filename containing "Ṣāḍguṇya — Six Strategies of External Engagement").

### Posture
The template's own stated rule now observes itself inside the template. The irony from the v2.8.0/v2.8.1 publish closes.

For full details, see `UPDATES/2026-05-22-v2.8.2-em-dash-cleanup.md`.

---

## v2.8.1, 2026-05-22

### Added
- **Anti-AI Writing Patterns Codex** at `Council Chamber/Codices/Expression/Anti-AI Writing Patterns Codex.md`. Sixty patterns across eight categories (lexical blacklist, opener tells, hedging and padding, negation and pivot, rhetorical reflexes, voice and register, structural tics, formatting and visual tics). Names the RLHF training pressure behind each tell and the affirmative-voice replacement. Ships in template form. Personalization happens during onboarding via a Vocabulary Reconciliation pass.

### Changed
- **CLAUDE.md Expression Standards.** New reference bullet linking to the Anti-AI Writing Patterns Codex as the negative-space companion to the Writing Style Codex. Both codices run simultaneously on any draft.

For full details, see `UPDATES/2026-05-22-v2.8.1-anti-ai-writing-patterns-codex.md`.

---

## v2.8.0, 2026-05-22

### Added (CLAUDE.md trust anchor)
- **Cross-Model Perspectives section.** Four standing questions that fire at decision-density moments mapped to substrate types (web-current research, independent challenger, cheap-parallel external workers, complementary corpus). Perspective is distinct from dispatch. Sanitization rule for any output flowing back into ecosystem artifacts.
- **Held-by-Structure principle.** The ecosystem holds its own discipline. Reviews happen at scheduled moments, not on demand. The AI Interface does not nudge the Sovereign.
- **Edit-Time Discipline subsection.** Three rules for small code edits: surface assumptions before acting, match existing style, every changed line traces directly to the request.
- **Verify Worker Findings subsection.** Orchestrator verifies subagent and external worker output against live state before treating it as authoritative.

### Added (new protocol)
- **Three Solutions Rule** at `Council Chamber/Protocols/Governance/Three Solutions Rule.md`. When uncertain or when multiple paths are viable, the AI Interface surfaces three options it believes in, states a recommendation, names the trade-off, and lets the Sovereign decide. Four guardrails plus a trust-ladder model.

For full details, see `UPDATES/2026-05-22-v2.8.0-cross-model-perspectives-and-decision-discipline.md`.

---

## v2.7.2, 2026-05-06

### Fixed
- **Getting Started/Quick Start Guide.pdf** — `/Title` metadata corrected. No content changes.
- **Getting Started/Build Sequence.pdf** — `/Title` metadata corrected. No content changes.

For full details, see `UPDATES/2026-05-06-v2.7.2-pdf-title-metadata-fix.md`.

---

## v2.7.1, 2026-05-06

### Added (Operational Efficiency)
- **Ad-hoc dispatch posture.** Standing question for unplanned mid-session work: would Sonnet or Haiku yield equivalent output here, with fewer tokens?
- **MCP context budget hygiene rule.** Deactivate broken/unauthenticated MCPs after one session, unused after thirty days. Adding requires removing or deferring an existing MCP of equivalent or greater context cost.
- **Database MCP security defaults.** Three controls at config time: `project_ref=<id>`, `read_only=true`, `features` allowlist.
- **CLI vs MCP routing.** When both exist, prefer the MCP. Cleaner audit trail, no orphaned device-auth popups.
- **Parallel file-edit batching.** Same edit across N files = batch Reads in one message, batch Edits in one message. Sequential round-trips waste tokens.
- **Infrastructure-first principle.** When a tool is broken or missing, fix the infrastructure. Manual workarounds are the pattern this rule prevents.

### Added (Planning and Execution — new section)
- **Plan verification before handoff.** Substantive code blocks in plans must be build-verified before subagent dispatch.
- **Move audit rule.** File relocation is incomplete until a wikilink grep has been run and every active reference updated.
- **Pending Plan status vocabulary reference.** Four-state ladder (`proposed → active → complete → archived`) defined in the Implementation Protocol; advances one direction.

For full details, see `UPDATES/2026-05-06-v2.7.1-operational-discipline.md`.

---

## v2.7.0, 2026-05-06

### Removed (archived to Vault)
- **AI Interface Change Log** (`Council Chamber/AI Interface/AI Interface Change Log.md`). The session log is the permanent record. The Change Log was redundant.
- **Continuity Log** (`Council Chamber/AI Interface/Continuity Log.md`). Auto-memory carries process patterns forward across sessions.
- **AI Interface Change Log Protocol** (`Council Chamber/Protocols/AI Interface/AI Interface Change Log Protocol.md`). No longer in active flow.

### Changed
- **Session Closeout SKILL.md:** Lightweight is now the default. Single inline Reconciliation Summary covers Pending Plans (max 3 bullets, named plans only), Quests/Experiments/Intake, and Inbox/Consults. Full mode (parallel Workers A/B/C) is opt-in for sessions with 3+ Pending Plans touched, governance edits, structural reorganization, plan implementation advance, or explicit Sovereign request.
- **Standardized session log template:** YAML frontmatter (`date`, `title`, `status`, `skills`, `primary_skill`, `commits`, `dispatches`) + `## What Happened` + `## Decisions` + `## Risks` + `## Next` + `## Reconciliation Summary` + `## Notes`. Removes format-decision overhead at write time.
- **Sovereign Command sweep mandatory in both modes.** Live-signal sections of `Sovereign Command.md` are scanned at every closeout; entries this session resolved or rendered obsolete are removed in the same closeout.
- **Breadcrumb Propagation Sweep tightened.** Default in lightweight mode is skip. Runs only when this session created new governance artifacts.
- **Append session log to Index.** New step: append a row to `Vault (Archive)/Session Logs/Index.md` and update `last_updated` and `entry_count`. The log is not fully logged until the row exists.
- **Cross-reference cleanup (high-traffic files):** AI Interface Knowledge Map, Operating Charter, AI Interface Activation Protocol, AI Interface Activation skill, Session Closeout Protocol, MODULES.md updated to remove references to retired artifacts and route to session log Index + auto-memory.

### Posture
Three artifacts retired after a structural audit. Each one was either redundant (Change Log duplicated session logs), absorbed by another mechanism (Continuity Log absorbed by auto-memory), or no-longer-load-bearing (the Change Log Protocol it served). Closeout overhead compounds across same-day sessions; the lean default reclaims tokens at every cycle.

For full details, see `UPDATES/2026-05-06-v2.7.0-lean-closeout.md`.

---

## v2.6.0, 2026-05-06

### Added
- **Article XIII — Foundational Covenant** in the Constitution. Seven operative commitments for the human-AI relationship: Generational Stewardship, Transparent Process, Benevolence as Default, Consent as Foundation, Reciprocal Responsibility, Authentic Unfolding, Active Uplift.
- **Getting Started/Quick Start Guide.pdf** — PDF version of the Quick Start Guide ships with the repo.
- **Getting Started/Build Sequence.pdf** — PDF version of the Build Sequence ships with the repo.

### Changed
- **Getting Started/Quick Start Guide.md:** Download step now leads with `infinitegameos.io/sovereign-ecosystem` (Download ZIP button). GitHub retained as secondary path for the technically familiar.

---

## v2.5.0, 2026-05-05

### Added
- **Getting Started/Quick Start Guide.md:** Universal install foundation guide. Print-friendly companion to Sessions 0 and 1. Platform-aware Windows and Mac steps from zero to first activation test.
- **Getting Started/Build Sequence.md:** Universal session-by-session orientation guide. One paragraph per session naming what it does, the principle behind it, what to expect and one idea to play with before beginning. Session 8 carries the deepest refresh with Aliveness-vs-script anchor, zero-to-three-month horizon framing and active-quests-not-tasks reframe.

### Changed
- **Library/North Star.md:** Four surgical template additions. Purpose line expansion ("The AI reads this file and organizes work around it"), Aliveness prompt added to Direction section, embark-able quest framing line added to Active Quests, Recalibration Protocol pointer added to Notes. Minimal posture preserved.

### Posture
The Foundation arc gets a print-friendly orientation layer. The session files remain canonical; the orientation guides give operators the option to read the whole arc at a glance before opening any single session.

For full details, see `UPDATES/2026-05-05-v2.5.0-orientation-guides-and-north-star-refresh.md`.

---

## v2.4.0, 2026-04-30

### Removed (graduated to IGOS public library)
- **Pending Plan Implementation Skill:** Now installable from infinitegameos.io as a Claude Code plugin.
- **Plan Challenger Skill:** Now installable from infinitegameos.io.
- **Researcher Skill:** Now installable from infinitegameos.io.
- **Skill Creator Skill:** Now installable from infinitegameos.io.
- **Systematic Debugging Skill:** Now installable from infinitegameos.io.

### Changed
- **Skills Index:** Five entries removed; new "Graduated to Infinite Game OS Public Library" section added with direct links to each skill page.
- **MODULES.md:** Foundation Skills list trimmed to nine entries; graduation note added at the top of the Foundation section explaining the lean shape.

### Posture
The Sovereign Ecosystem now ships as the lean on-ramp template. Cool extras live in the IGOS public library at infinitegameos.io. Pick the ones that fit your build. Source Harvest stays in the Foundation as a dual-distribution surface.

For full details, see `UPDATES/2026-04-30-v2.4.0-igos-graduation.md`.

---

## v2.3.0, 2026-04-19

### Added
- **Systematic Debugging Skill:** Four-phase root cause protocol. Iron Law: no fixes without investigation. Escalation gate at 3 failed fixes.
- **Plan Challenger Skill:** Five-angle adversarial review for Pending Plans. Taste-decision surfacing, one-line verdict, optional confidence scoring.
- **Source Harvest Skill:** Twelve-step systematic pattern extraction from external repos. Adopt/Enrich/Defer/Ignore classification framework.
- **CLAUDE.md, Expression Standards:** No Oxford comma, no em dashes, positive framing, high-velocity drift guard.
- **CLAUDE.md, External Publishing Confirmation:** Three-state verification gate (Local, Submitted, Confirmed) with five-step verification function.
- **CLAUDE.md, Operational Efficiency:** Model routing defaults, MCP context budget, exploration efficiency, verification loop patterns (pass@k vs pass^k).
- **CLAUDE.md, Systematic Debugging mandate:** Standing instruction linking technical issues to the debugging skill.

### Changed
- **Pending Plan Implementation Protocol (v0.1 to v1.0):** Re-entry fields required for multi-session plans. Gate notation for 3+ session plans. Session Boundary Close Block. Organic completion check. Plan Note Templates (Tier 1 Focused, Tier 2 Arc). Archival pattern and support files policy detailed.
- **Sovereign Tech Watch:** Thirteen new repos added to the Watched Repos table.
- **Session 0, Prerequisites:** Auth flow corrected (OAuth login), dual setup paths (VS Code + Claude Code App), cost model updated.
- **Writing Style Codex:** Template divergence note added.
- **Skills Index:** Three new entries registered.

For full details, see `UPDATES/2026-04-19-v2.3.0-operational-maturity.md`.

---

## v2.2.1 — 2026-04-11

### Changed
- **Release Hygiene Protocol — Rule 8:** Pre-Deploy Review gate added. Structured review prompt before any Vercel-linked push; severity-high findings must resolve before push proceeds.
- **Pending Plan Implementation Skill — Step 7:** Optional Gemini audit gate inserted before final step. Offer in one line at plan close; applies to codices, protocols and governance artifacts only.

## v2.2.0 — 2026-04-11

### Added
- **Phase Audit Protocol:** Concurrent two-pass audit method (Claude Explore + Gemini challenger) for reviewing phase outputs before the next phase begins. Includes expression standard scan, aggregation pattern, filing convention and phase gate statement.

## v2.1.0 — 2026-04-11

### Added
- **AGENTS.md:** Root AI context file — project identity, ecosystem position, stack, build commands, critical rules, content and voice, AI discoverability status, and cross-ecosystem links. Read automatically by any AI coding tool.
- **Repo Context Architecture Protocol:** Defines the AGENTS.md + CLAUDE.md two-layer standard for any ecosystem-adjacent repo. Includes initialization sequence and Active Instances tracking table.
- **Public Publish Audit - 2026-03-09:** Historical governance audit from the initial release arc, now committed as a record artifact.

---

## v2.0.0 — 2026-03-27

### Added
- **Cheat Sheet - Tool Roles:** Answers "why do I need so many programs?" — one paragraph per tool, summary table, Mac and Windows noted, includes Claude Code Notifier.
- **Cheat Sheet - Claude Code Quick Reference:** Session start, permission approvals, session closeout, commit strategy, cost awareness.
- **Cheat Sheet - Common Setup Issues:** Six friction points from real sessions as preventive guidance — cloud sync, Obsidian Sync vault password, Windows git fix, folder selection, ChatGPT export timing, commit deferral.

### Improved
- **Session 0:** Cloud sync pre-flight check and ChatGPT async export timing added to checklist.
- **Session 1:** Permission approval explanation, commit strategy deferral, and optional Mobile Setup section added.
- **Getting Started Index:** Cheat Sheets section added with links to all three new files.

For full details, see `UPDATES/2026-03-27-v2.0.0-getting-started-improvements.md`.

---

## v1.9.0 — 2026-03-25

### Added
- **Auto-Memory Architecture:** New `# auto memory` section in `.claude/CLAUDE.md` template. Documents the modular index pattern (thin MEMORY.md index pointing to individual typed files), four memory types (user, feedback, project, reference), frontmatter format, what not to save, and the boundary rule between memory and vault-canonical records.

For full details, see `UPDATES/2026-03-25-v1.9.0-auto-memory-architecture.md`.

---

## v1.8.0 — 2026-03-25

### Added
- **Living Axis of Sovereignty Codex:** Umbrella framework tying the three-doctrine system together. Maps Ṣaṭsthala (inner mastery), Svarāja (structural sovereignty) and Ṣāḍguṇya (external strategy) as a recursive, self-reinforcing system. Includes operational coverage table linking all three to their protocols, and practical application sections for AI systems, communities and personal sovereignty. New `Council Chamber/Codices/Sovereignty/` subdirectory.
- **Svarāja Doctrine:** Structural governance protocol. Maps six pillars of sovereign architecture (Self-Rule, Ethical Governance, Economic Sovereignty, Strategic Defense, Cultural Intelligence, Collective Intelligence) to Foundation structures. Includes maturity assessments for each pillar, structural coverage map and gap assessment. Pairs with the ecosystem's existing Constitution, Operating Charter and governance architecture.
- **Ṣaṭsthala Doctrine:** Inner mastery protocol. Maps six stages of personal development (Bhakta, Maheśa, Prāṇaliṅga, Śaraṇa, Aikya, Siddha) to ecosystem practices. Includes Stage Mirror reflective tool, Inner Mastery Flywheel (five-step return pattern), archetypal development mapping and the recursive loop explanation. Designed to load during coaching sessions, North Star recalibrations and any inner-development-oriented work.
- **Propagation Triad:** Meta-governance design pattern for any standard that needs to travel forward as the ecosystem grows. Three layers: self-describing protocol (Propagation Rules section), creation gate (skill-level constraint), and CLAUDE.md standing rule. Ambassador Doctrine is the first instance of all three layers applied together.
- **Codices Index — Sovereignty section:** New section pointing to the Living Axis as the philosophical anchor for all three doctrine protocols.

For full details, see `UPDATES/2026-03-25-v1.8.0-living-axis-doctrine.md`.

---

## v1.7.0 — 2026-03-25

### Added
- **Ṣāḍguṇya Codex:** Six strategies of statecraft — Sandhi (alliance), Vigraha (conflict), Yāna (expansion), Āsana (neutrality), Dvaidhibhāva (dual policy), Saṃśraya (fortification) — mapped to principled AI engagement in a multi-agent world. Philosophical foundation for the Ambassador Doctrine.
- **Ambassador Doctrine:** Governing protocol for all external-facing activity. Three duties: Represent, Protect, Advance. Application Matrix, Sub-Agent Prompt Pattern, and Propagation Rules. Answers: when your ecosystem reaches outward, what does it stand for?
- **External Orientation sections:** Added to Playwright and Researcher skills. Each identifies its primary and secondary Ṣāḍguṇya strategies and the governing posture for that surface.
- **Skill Creator — Ambassador Doctrine gate:** New constraint ensures any new external-facing skill exits Skill Creator with the External Orientation section applied. Propagation is enforced at creation, not retroactively.
- **Protocol cross-references:** Platform-Agnostic Interface Adapter Protocol, Release Hygiene Protocol, and Sovereign Tech Watch Protocol now reference the Ambassador Doctrine as the strategic posture layer for their respective external surfaces.
- **CLAUDE.md — External Engagement Doctrine section:** Session-load anchor with sub-agent prompt template and standing creation rule.

For full details, see `UPDATES/2026-03-25-v1.7.0-ambassador-doctrine.md`.

---

## v1.6.0 — 2026-03-24

### Added
- **Release Hygiene Protocol:** Seven standing rules for any personal-to-public release. Export-truth audit, two-tier publish gate (Blockers vs Improvements), allowed-public-identity rule, public-safe automation checklist, repo-health baseline, encoding-repair fallback, connective-tissue audit.
- **Sovereign Tech Watch Protocol:** Sovereign-triggered watch loop for GitHub repos and infrastructure ideas. Includes starter list of six Claude Code and Obsidian repos. Pairs with new deferred items tracker.
- **Deferred Items Template** (`Council Chamber/Tools/Support Files/sovereign-deferred-items.md`): Companion file for the Tech Watch Protocol. Four statuses: deferred, proposed, permanent-hold, retired.
- **Continuity Log — Immediate Capture Rule:** Standing entry added to Continuity Log. Capture corrections at the moment they occur, not at closeout.

For full details, see `UPDATES/2026-03-24-v1.6.0-governance-protocols.md`.

---

## v1.5.0 — 2026-03-24

### Added
- **PreCompact hook:** `Council Chamber/scripts/hooks/pre-compact-state-capture.sh` — captures session state to `.runtime/pre-compact-state.md` before /compact fires. Prevents context loss during long sessions.
- **PostCompact hook:** `Council Chamber/scripts/hooks/post-compact-reorienter.sh` — re-injects pre-compact state immediately after /compact completes. Closes the continuity loop.
- **`.claudeignore`:** Vault-root context filter. Excludes `node_modules/`, `.git/`, `.trash/`, `*.log`, `.runtime/`, and Playwright install artifacts from Claude's context window.

For full details, see `UPDATES/2026-03-24-v1.5.0-hook-infrastructure.md`.

---

## v1.4.0 — 2026-03-24

### Added
- **Playwright skill (new):** Headless Chromium browser automation. Scrapes pages, extracts structured data, returns clean JSON. Token-efficient (~200-500 tokens per page). Includes `scripts/run.js`. Requires one-time `npm install playwright` and `npx playwright install chromium`.
- **Researcher skill (new):** Parallel sub-agent research — up to 4 workers per topic, each covering a different angle, synthesized into a single structured report. Research feeds decisions; never auto-implements.
- **Self-Healing skill (new):** Autonomous error recovery during implementation sessions. Recoverable errors (syntax, path, missing file) handled silently. Governance-class errors and external API failures always surface to the Sovereign.
- **Skill Creator skill (new):** Interview-first skill design in 5 phases. Requires Sovereign interview before any drafting begins. Cross-platform junction commands included (Windows PowerShell and Mac/Linux).
- **Refinements section standard:** `## Refinements` section added to all 11 existing skills (empty stubs), Skill Template, and Skills Governance Protocol. Each skill now tracks date-stamped execution mistakes and prevention rules. The skill-level equivalent of the Continuity Log.

For full details, see `UPDATES/2026-03-24-v1.4.0-skills-expansion.md`.

---

## v1.3.0 — 2026-03-11

### Added
- Agent SDK Capabilities section added to `.claude/CLAUDE.md`: covers parallel subagents, session continuity, in-process MCP servers (proposed), hooks (proposed), permission modes and skill loading. These are operational facts available to all skills.
- **Weekly Story skill (new):** Weekly narrative skill added to Foundation. 6-worker parallel data pull (calendar, transcripts, collaborations, operations and creation, AI Interface Change Log and session logs, last 3 stories). Three-part narrative format: opening scene, week's chronicle, thread forward. Hard save gate — Sovereign must confirm before file is written. Output: `Scriptorium/Weekly Stories/YYYY-MM-DD - [Title].md`.

### Changed
- **AI Interface Activation:** Quick Support Sweep (Step 6) upgraded to 4-worker parallel fire (Worker A: Inbox scan, Worker B: Transcript check, Worker C: Active focus scan, Worker D: Index drift check). Session ID handling and session fork pattern (`forkSession: true`) added to activation confirmation step.
- **End-of-Week:** 7-worker parallel data pull added as a dedicated phase in Step 0 (before engagement briefings). Workers fire simultaneously and feed all five engagements. Inline data pulls in Steps 1-3 replaced with worker result references.
- **Security Check:** Parallel pass architecture formalized as 5 explicit workers (Pass A-E: Surface, Structural, Adversarial, Resilience, Continuity) with explicit reconvene and synthesis step. Replaces hedged "if multiple agents available" language.
- **Session Closeout:** 3-worker parallel pattern added (Worker A: Pending Plan reconciliation, Worker B: Inadvertent completions sweep, Worker C: Inbox and consult closeout). Unified approval gate presents all proposals as a single list before any execution.

For full details, see `UPDATES/2026-03-11-v1.3.0-agent-sdk-integration.md`.

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

