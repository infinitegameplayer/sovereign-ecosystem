# Changelog

All updates to the Sovereign Ecosystem are recorded here, newest first.

Each entry corresponds to one publish cycle. For full implementation details, see the matching file in `UPDATES/`.

---

## v3.8.0, 2026-07-31

Four Classes the Author Abandoned.

**No action required, and nothing breaks if you skip this.** No script, hook or guard reads the object classes. If you have been using any of the four retired classes, keep using it. Migration notes are in `UPDATES/2026-07-31-v3.8.0-four-classes-the-author-abandoned.md`.

### The headline

The Object Model declared nine object classes and now declares five. `Spark`, `Insight`, `Experiment` and `Rule` are retired. `Quest`, `Artifact`, `Brief`, `PendingPlan` and `InboxItem` stay.

All four were declared in prose, described in prose and never mechanically used. A grep for them in frontmatter or wikilinks returns zero across the whole repo. The one long-running installation of this template produced zero notes of all four across months of daily use. A fresh clone has zero instances of everything, so that count alone proves nothing. What it does establish is that the author of these classes never used them, and shipping them anyway hands every recipient four concepts their designer abandoned.

A reader who cannot tell which parts of a governance system are load-bearing treats all of it as load-bearing. Every unused class raises the price of the whole thing.

### Why this is a minor

Four declared classes were removed, which sounds like a break and is not one. Nothing executable reads the object classes. No script, hook, guard or CI step names them, so there is no code path that a missing class can fail. What changed is prose describing a model, and your own notes are untouched either way.

### Changed

- `Council Chamber/Governance/Sovereign Ecosystem Object Model.md`, nine classes to five, plus a closing section on when adding one is earned.
- `Council Chamber/Governance/Constitution - Sovereign Ecosystem.md`, the class list, the raw-transmission clause and the L1-L2 automatic actions.
- Twenty-seven further files carrying references, reconciled by reading rather than by pattern replacement.
- `Council Chamber/Protocols/Inbox/Capture Classify Route Protocol.md`, the `spark:` quick-capture prefix folded into `inbox:`.

### Removed

- `Council Chamber/Templates/Object Templates/Spark.md`.
- `Council Chamber/Templates/Object Templates/Experiment.md`.

### Fixed in passing

The Constitution listed eight object classes where the Object Model declared nine. `Brief` was missing, and had been since the class was introduced. Two documents describing one model, disagreeing, with nothing checking one against the other.

---

## v3.7.0, 2026-07-31

The Receiver Is Not the Deletion.

**Security fix. If you installed any version from v3.3.0 through v3.6.0, apply this update.** Your Permanent Floor deletion gate blocks one spelling of a Node file deletion and allows five others. Renaming the variable that holds the module is enough to walk past it.

### The headline

The gate required the literal characters `fs.` before the method name, so `fs.unlinkSync(` was refused while `require('fs').unlinkSync(`, an aliased handle, a destructured import, `rmSync` and the promises API all passed. Six spellings of one act, one of them blocked.

It now matches the method rather than the receiver, with a leading character class so `performSync(` and `confirmSync(` stay allowed. The target test is unchanged, so deleting a file the Floor does not protect works exactly as before.

The positive control passed the entire time. It carried one case for this door, and that case spelled the receiver `fs.`, so it exercised the only form that worked. Two releases green over five open doors. A guard is verified by firing, and this release adds that it matters what you fire. The suite goes from 21 cases to 29, five new must-block and three new must-pass.

### Also in this release

`check-skill-mirrors.mjs` reported a fresh clone as 38 drift errors and exited 1, because a fresh clone has no interface skill directory and a link is not something git carries. The first thing this template told a new reader was that it was broken. It also demanded a mirror under both `.claude/skills` and `.codex/skills`, so a reader running one interface got a wall of errors for the one they had chosen not to use. An absent mirror root now reads as a runtime this vault does not use rather than as drift.

That checker had never had a positive control. It ships with one now, four cases against fixture vaults, wired into CI alongside the checker running on the fresh checkout itself.

### Changed

- `Council Chamber/scripts/hooks/pre-tool-approval-gate.sh`, the Node deletion branch.
- `Council Chamber/scripts/hooks/floor-gate-selftest.mjs`, 21 cases to 29.
- `Council Chamber/scripts/check-skill-mirrors.mjs`, absent mirror roots skipped.
- `Council Chamber/Skills/Skills Index.md`, dual-distribution list corrected to nine entries, and the sentence above it drops its numeral so the list is its own count.

### Added

- `Council Chamber/scripts/check-skill-mirrors-selftest.mjs`.
- Two CI steps firing it and the checker it proves.

Full detail and the apply-by-specification path: `UPDATES/2026-07-31-v3.7.0-the-receiver-is-not-the-deletion.md`.

---

## v3.6.0, 2026-07-22

The Second Instrument. A guard you have read is not a guard you have fired. This release extends that law one level: a test you have run is not a test that could have failed.

**Apply this if you installed any version of this template.** Everything here is additive. Nothing you already run changes behavior.

### The headline

`hooks-selftest.mjs` gains a `--negative-control` mode that re-runs every case with each hook replaced by a do-nothing stub. Any case that still passes is proving nothing and is reported as vacuous.

Running it found a case that has been shipping since v3.4.0 and proving nothing. The `index-regen` check asserted the ABSENCE of a string, and a dead hook writes no log, so the absent string was duly absent and the case went green against nothing at all. If you have read that tick as evidence your index regeneration works, it was not. It now demands positive evidence.

The same file gains a registration audit. Every case fires its hook directly, which proves the script works and says nothing about whether a session will ever call it. The suite now reads `.claude/settings.json` and reports any hook that no event would reach. An unregistered hook fails the run, because a guard that passes its own test while wired to nothing is the most dangerous kind. It looks covered.

### Added

- `Council Chamber/scripts/decision-journal.mjs`, compiling a read-only journal of every `#decision`-tagged line. Its guard is relative rather than a fixed floor, so a new vault with zero decisions succeeds while a collapsed scan is refused. Ships with `--positive-control`, 15 cases, which must be green before the journal is trusted.
- Governance Principle 3, name the grade on the act. Executory acts implement an instruction as given. Discretionary acts apply judgment inside a bounded domain. The grade is marked when the act happens.
- The Intake Routing Law in the Capture Classify Route Protocol. Four rules for any vault taking material in from more than one direction.
- Four CI steps that fire the negative control and the journal guard on every push, so neither decays into a control nobody runs.

### Changed

- The Interface Adapter Registry rates adapters by **Exposure Tier (E0 to E4)** rather than Trust Tier. The Constitution rates AGENTS with a Trust Tier, and one name for two unrelated concepts was a real ambiguity every recipient inherited. Different letters now, so the two cannot be confused. Prioritize this one if you built an adapter registry from this template.
- The Anti-AI Writing Patterns Codex reaches full parity, 60 entries to 114. The v1.0 subset stopped partway and omitted the entire back half: the voice tells and every structural tell. Entries are renumbered to the source catalog's own scheme, so numbers are stable from here.

### Fixed

- `AGENTS.md` and `BOOTSTRAP.md` claimed 24 installable skills in the public library. There are 28.
- `AGENTS.md` said five skills are dual-distribution and five graduated out entirely. It is seven and four.
- `Skills Index.md` listed Systematic Debugging both as bundled and as no longer bundled. Both could not be true.

CI validated the Skills Index roster and never the sentences describing it, so the drift moved into the prose. A check that validates a list does not validate the paragraph about the list.

---

## v3.5.0, 2026-07-14

The Harvest. What the ecosystem fixed in itself, it had not fixed in the world. This release ports out two proven guards, the software doctrine that would have caught them, the verification tooling, and three skills that any operator running agents on code should have.

**Apply this if you installed any version of this template.** The two hooks are new guards, not fixes to guards you already run. The codices and skills are additive. Nothing here is a hole an attacker walks through. Each is coverage the template should have shipped and did not.

### The governing idea

The template is a fork of a working vault that stopped receiving updates the day it was published. The vault heals itself and its descendants inherit nothing. Two of the hooks below were found broken in the source vault and fixed there in the same week. The people running this template had neither the guard nor the fix, which is to say they had nothing. This release is the nothing, filled.

### Added, the guards

- **`Council Chamber/scripts/hooks/post-bash-encoding-check.sh`.** A mojibake detector. After a Bash or PowerShell operation it scans recently modified vault files for the byte signature left when a tool reads a UTF-8 file as Windows-1252 and writes it back. An em dash becomes `â€"`, a curly quote becomes `â€™`, and the damage spreads silently. **It watches the PowerShell tool, which is the tool that causes the corruption.** A detector registered on Bash alone is structurally blind to the one door it exists for, which is exactly how the source vault's copy shipped before this week.
- **`Council Chamber/scripts/hooks/post-bash-move-audit.sh`.** After a plain `mv` of a Markdown file it runs a full-vault wikilink grep for the old path and surfaces any reference left dangling. The move and the sweep are one unit of work. It carries three fixes from the week it was proven: it will not sweep a file moved outside the vault, it ignores stems too short to be a real reference, and every grep runs under a fifteen-second ceiling. Before those fixes, a move of a short-named file outside the vault sent it grepping the entire vault for a single letter and stalled the session.
- **Both are registered on `Bash|PowerShell` in `.claude/settings.json`, and both ship with their positive control.** `hooks-selftest.mjs` gains six cases: the mojibake signature caught, the PowerShell tool watched, the referenced move warned, the unreferenced move stayed quiet, and the stall regression timed rather than trusted. A guard travels with the test that proves it, always.

### Added, the doctrine

- **`Council Chamber/Codices/Technology/Sovereign Software Codex.md`.** The posture on software you may one day hand to someone else. Positive control travels with the guard. The clean clone is the only witness. Ship the spec plus the test, never a diff. This is the doctrine that would have caught the deletion hole of v3.3.1 in your own forks before it shipped.
- **`Council Chamber/Codices/Technology/Engineering Codex.md`.** Standards for all code work in the ecosystem. Plan, build, verify, upgrade, and the return arrow that turns a solved bug into a durable `docs/solutions/` note. The template shipped code and had no doctrine on stewarding it. Now it has both.

### Added, the verification tooling

- **`Council Chamber/scripts/check-skill-mirrors.mjs`.** Confirms every canonical skill has its interface mirror and names any that drift. Resolves the vault root from `SOVEREIGN_VAULT_ROOT`.
- **`Council Chamber/scripts/validate-doc-claims.mjs`.** Checks that a document's citations resolve against git at the moment of the check, never trusted on sight. The mechanical face of the Move audit rule.

### Added, the skills

- **`Systematic Debugging`.** The Iron Law: no fix before the root cause. The single most useful discipline here for anyone running agents on code.
- **`Brainstorm`.** The design-before-you-build gate. One question at a time, a three-solution fork, a written plan the operator approves before any code.
- **`PR Code Review`.** A multi-dimension parallel review of a pull request before merge, with confidence scoring and a compliance pass against your own standards.

### Note

The `Skills Index` and `Codices Index` were regenerated to enroll the new skills and codices.

---

## v3.4.0, 2026-07-14

The Guards Get Proven. v3.3.1 fixed one guard that had never been fired. This release fired all of them and found three more were broken.

**Apply this if you installed any version of this template.** None of these is a hole an attacker walks through. Each is an instrument you have been trusting that reported success while doing nothing.

### Fixed
- **`post-write-index-regen.sh` could never regenerate anything.** It shipped with empty regen commands and no regen script in the repo to point them at, so it logged "trigger detected (no regen cmd configured)" on every write and acted never. The cost was already on the shelf: the Ecosystem Update Check skill was missing from the Skills Index, present on disk and invisible to the AI interface that reads the catalog. The hook watched the exact drift it was named for and logged that it noticed. It is now wired to a real script that ships with it.
- **`post-write-em-dash-check.sh` failed in both directions.** Its vault-scope check was a case-sensitive prefix match, so a Windows drive letter arriving as `c:` instead of `C:` made the comparison fail and the hook exit before reading the file. No warning, no log, no trace: the gate went dark and looked healthy. Separately, with `SOVEREIGN_VAULT_ROOT` unset it dropped the scope check entirely and warned on every Markdown file on the disk. Both closed. It now lowercases before comparing and falls back to the working directory rather than the whole filesystem. A guard with no configuration should narrow, never widen.
- **The two compact hooks wrote and read different paths.** `pre-compact-state-capture.sh` resolved `.runtime` against the working directory, so firing from a subdirectory planted an orphan there and the snapshot the reorienter looked for at the vault root was never written. The capture reported success and the state was gone. Both are now anchored to `SOVEREIGN_VAULT_ROOT`, and `.claude/settings.json` passes it to them. They were the only two hooks that never received it.
- **`SECURITY.md` named `main` as the supported branch.** This repo is `master`.

### Added
- **`Council Chamber/scripts/hooks/hooks-selftest.mjs`.** The positive control on every hook except the Floor gate, which has its own. Twelve cases, each hook required to react to what it must react to and stay quiet otherwise, with a regression test per defect above. Against the pre-fix hooks it reports `pass=7 fail=5`. Against the fixed hooks, `pass=12 fail=0`. It has been watched failing.
- **`.github/workflows/verify.yml`.** This repo had no CI at all, which is why a guard that refused nothing could ship and sit there. Every push and pull request now fires both self-tests against a fresh checkout with `SOVEREIGN_VAULT_ROOT` unset, which is the state a recipient is actually in. It also runs weekly on a schedule, because a guard rots unobserved and "green last week" is the condition under which it rots.
- **`Council Chamber/scripts/build-skills-index.mjs`.** The regen script the index hook was always meant to call. Rebuilds the roster from SKILL.md frontmatter, preserves curated descriptions and manual sections, and `--check` names any skill on disk and missing from the Index. Its own first bug is the lesson of this release in miniature: it defaulted a silent `tier:` field to `operational` and quietly demoted two skills a human had curated as foundational. A generator that invents a value where its source said nothing is overwriting knowledge with a guess. Absence of data is not data.
- **`SECURITY.md` gains a "How You Learn That A Fix Shipped" section.** The plain admission that nothing reaches a templated clone automatically: no dependency graph, no Dependabot, no notification. What this repo does about it, and the one click (Watch, Releases only) that closes the gap.

### Named
- **Nothing that guards may ship without its positive control.** A guard travels with the test that proves it refuses what it claims to refuse and permits what it claims to permit. **A guard with no positive control is not a feature, it is a liability with good intentions**, because the recipient trusts it more than they would trust nothing at all. Ask of every ceiling: does this refuse, or does it merely not-happen?

### Changed
- The Skills Index lists all sixteen skills, and Self-Healing's tier matches its own frontmatter.
- A maintainer's private note left the Writing Style Codex. It named the maintainer's own vault and gave instructions about an internal sync boundary no recipient has a part in.
- `scripts/framework-manifest.json` classifies the self-tests, the index builder and the CI workflow as framework.

---

## v3.3.1, 2026-07-14

The Floor Gate, Proven. A security fix on the v3.3.0 deletion gate, and the positive control that should have shipped alongside it.

**If you installed v3.3.0, apply this update.** The Permanent Floor deletion gate does not refuse an ordinary relative-path deletion of your content files. It was read, reviewed and shipped. It was never fired.

### Fixed
- **`pre-tool-approval-gate.sh` deletion hole.** The gate classified on the command string, testing whether the vault root path appeared in the text of the command. An agent working inside the vault deletes with a relative path, which contains no vault root, so the gate allowed it. Eight paths through the gate were affected: `rm` relative (quoted, bare, force-flagged), `powershell Remove-Item` and `cmd del` invoked from Bash, and `Remove-Item`, the `del` alias and `[System.IO.File]::Delete` on the PowerShell tool. The gate now classifies on the resolved **target path**: a relative target is working-directory bound and therefore internal and blocks, and an absolute target blocks only when it resolves inside the vault. Scratch, memory and adapter paths outside the boundary stay freely deletable.

### Added
- **`Council Chamber/scripts/hooks/floor-gate-selftest.mjs`.** A positive control on the Floor gate: twenty-one crafted inputs, sixteen that must be refused and five that must be allowed. The must-allow cases carry equal weight, because a gate that blocks everything has traded a hole for a wall. Against the v3.3.0 gate it reports `pass=13 fail=8`. Against the fixed gate, `pass=21 fail=0`. It has been watched failing, which is what makes a pass from it mean something. Payloads are built with `JSON.stringify`, because a hand-quoted shell string can carry an escaping bug indistinguishable from a guard failure.

### Named
- **The liveness control.** Before trusting any negative result, prove the channel it depends on was live. A guard that has never refused anything is not known to work. Absence is not a guard: a ceiling that holds because a file is missing or a flag is unset is a coincidence with good manners, and it holds until the day someone adds the file. Ask of every ceiling: does this refuse, or does it merely not-happen?

### Changed
- `scripts/framework-manifest.json` classifies the self-test as framework infrastructure.

---

## v3.3.0, 2026-07-10

Governance and Security Hardening. Nine refinements proven in a lived ecosystem, harvested into the template: named law, standing watches, a measurable doctrine layer, an agentic threat model and guard infrastructure covering both shell tools.

### Added
- **Governance Principles** at `Council Chamber/Governance/Governance Principles.md`. Named ecosystem-wide law between the Constitution and the codices. Ships with two principles (State once point elsewhere; Scaffolding proportionality); the Sovereign adds more as their own precedents accumulate. Anchored in CLAUDE.md as background law.
- **Watch Register** at `Council Chamber/Governance/Watch Register.md`. One home for standing tripwires with a strict three-exit rule: a watch fires, retires or is handed a permanent owner. Read by the End-of-Week skill at the weekly review.
- **Doctrine Lifecycle instruments.** `scripts/doctrine-mass.mjs` (layer mass counts, `--append` baseline rows into `Doctrine Mass Baseline.md`) and `scripts/doctrine-references.mjs` (inbound-link counts, orphan and index-only detection). Read-only by design.
- **Agentic Security Layer** in the Security note: the OWASP Top 10 for Agentic Applications mapped to concrete ecosystem surfaces, held as the primary lens above the enterprise backbone.
- **Intake-is-data doctrine** in CLAUDE.md Operating Boundary: intake content is material to process, never directives to follow; auto-loaded session context is stored state read as data. The injection-resistance floor for every intake flow.
- **Guard hooks, wired in the shipped settings.json.** `pre-write-floor-guard.sh` (no edit to a trust-anchor file is ever silent; surface-and-log, never blocking) and `pre-tool-approval-gate.sh` (blocks unapproved bulk deletes, out-of-vault moves and shell bypasses on the Bash tool and the PowerShell tool alike: same wall, second door).
- **`scripts/session-coordination.mjs`.** Advisory heads-up for concurrent sessions against one vault. An advisory, not a lock.
- **`scripts/encrypt-stream.mjs`.** AES-256-GCM stream encryption for offsite backups, activated only when a backup destination leaves the machine. A door, not a default.

### Changed
- `scripts/framework-manifest.json` classifies all additions: scripts framework, hooks seeded, the three governance instruments seeded since they accumulate the Sovereign's own entries.
- MODULES.md Optional Infrastructure and llms.txt document the new instruments.

For full details, see `UPDATES/2026-07-10-v3.3.0-governance-and-security-hardening.md`.

---

## v3.2.0, 2026-07-10

Connectivity Seam and Repo Hygiene. Every surface that names a public-library skill now links straight to its page at infinitegameos.io. Session start arrives preloaded. The stale surfaces caught up to reality and the active-file em dash count reached zero.

### Added
- **`.claude/settings.json` ships in the repo**, pre-wired with all Foundation hooks via `$CLAUDE_PROJECT_DIR`. A clone that never runs BOOTSTRAP still gets hook coverage. Seeded class: existing installs merge by hand.
- **`session-start-primer.sh` hook.** Injects `Primer.md` at session start and clear, so orientation arrives before the first exchange. On a fresh clone it also surfaces that BOOTSTRAP.md is waiting.
- **Memory seed at bootstrap.** BOOTSTRAP Step 5 now writes a user identity memory and an ecosystem setup memory from the interview answers, so the next session opens already knowing who it works for.
- **CONTRIBUTING.md and CODEOWNERS.** How to contribute upstream, and review ownership.
- **Per-skill library links.** README, Skills Index, the five dual-distribution SKILL.md footers, Sovereign Sync, BOOTSTRAP's completion note, the Getting Started Index and llms.txt all link the exact infinitegameos.io/skills pages they name, with the two-line marketplace install flow stated where it serves.

### Changed
- **AGENTS.md fully refreshed** from its stale v2.1.0 state: real version, real scripts, real structure, live library counts.
- **Library count corrected to twenty-four skills** (was twenty) in README and llms.txt, matching the live library.
- **Ṣāḍguṇya codex renamed**: the filename separator changed from an em dash to a hyphen, with every active reference updated. Dated release records keep their original text as history.
- **EASTER_EGGS.md reconciled** from two divergent logs into one, with v2.11.0 through v3.1.0 entries backfilled.
- **`scripts/framework-manifest.json`** now classifies the v3.1.0 additions and this release's new files. Version 1.1.0.
- **Em dash sweep to zero across every active file in the repo**: codices, protocols, skills, Getting Started, root surfaces and scripts. Two deliberate holdouts: the write-time check hook, where the character is the grep target, and dated release records (UPDATES packages, older CHANGELOG entries, archives), which keep their original text as history.

### Repo settings (not files)
- **GitHub template flag on.** The "Use this template" button now works.
- **GitHub Releases live**, starting with a backfilled v3.1.0. Every future version ships as a tagged Release, so the README's "Watch, Releases only" guidance now actually notifies.

For full details, see `UPDATES/2026-07-10-v3.2.0-connectivity-seam-and-repo-hygiene.md`.

---

## v3.1.0, 2026-06-10

Sovereignty Modules. Four optional pieces that extend reach without changing the spine. External model routing, a manuscript anti-AI edit pass, an Obsidian MCP bridge and a local-inference path. Each is a door, not a default. The template runs complete without any of them.

### Added (External Model Routing module)
- **External Model Routing Codex** at `Council Chamber/Codices/External Model Routing Codex.md`. The single source of truth for how external model providers enter worker dispatch. Ships in template form with a provider table (OpenRouter, NVIDIA NIM, DeepSeek, Groq), env-var slots for each, a Worker-Eligible Task Taxonomy with a five-condition eligibility test, and Model Era Notes covering refusal as HTTP 200, the effort parameter and always-on thinking on the newest model tier. Provider catalogs ship as placeholders, populated after live verification.
- **`scripts/external-worker.mjs`.** The dispatch entry point and the template's first API-calling script. Parameterized by `--provider`, `--model`, `--prompt` and `--context-pack`. Reads keys from `scripts/.env`, auto-injects the Ṣāḍguṇya ambassador orientation, logs metadata and fails loud on missing keys or refusals. Handles a refusal as a distinct non-completion state rather than a silent success.
- **CLAUDE.md Operational Efficiency line.** A standing dispatch rule. Deterministic no-judgment work routes to external providers. Voice-bound and judgment-bound work stays on the primary interface.

### Added (Manuscript Anti-AI Edit Pass skill)
- **Manuscript Anti-AI Edit Pass skill** at `Council Chamber/Skills/Manuscript Anti-AI Edit Pass/`. An Expression-aligned skill that runs the canonical anti-AI editing pass over a long-form manuscript. It loads the Anti-AI Writing Patterns Codex, sweeps the text in phases (mechanical lexical first, then judgment-heavy structural and voice passes), assembles a structured edit packet for review and applies approved edits. Surface-then-approve by default. No auto-apply on the judgment passes.

### Added (public library wave)
- **Manuscript Anti-AI Edit Pass also ships as a standalone installable plugin** in the Infinite Game OS public library at infinitegameos.io as `anti-ai-edit-pass`. It joins the four existing dual-distribution skills (Source Harvest, Self-Healing, Session Closeout, Playwright), making five. Each stays in the Foundation as part of the full experience and installs as an individual plugin for anyone who wants that one door.

### Added (Getting Started Optional Paths)
- **Optional Path - Obsidian MCP Bridge** at `Getting Started/Optional Path - Obsidian MCP Bridge.md`, plus `.mcp.json.example` at the repo root. Connects the Obsidian vault directly to the AI interface through the cyanheads/obsidian-mcp-server and the Local REST API plugin. Read-only by default. Writes unlock only by deliberate choice.
- **Optional Path - Local Inference and Semantic Search** at `Getting Started/Optional Path - Local Inference and Semantic Search.md`. Two documented layers. A fully offline inference fallback via Jan.ai, and an optional semantic search layer with a memsearch option and a sovereignty-preferred local SQLite-plus-embeddings variant. Documentation only. Markdown stays the source of truth, the vector index stays a rebuildable cache. The Optional Paths selector now lists this path.

### Posture
Four sovereignty modules, each optional, each additive. The codex and the script give the ecosystem a verified path to external workers without touching the primary layer. The edit pass gives long-form prose a canonical anti-AI sweep. The MCP bridge and the local-inference path are Getting Started infrastructure, not modules. They open the door to a live vault connection and to offline capability for Sovereigns building toward a lower-cloud setup. Nothing here is required to run the Foundation.

For full details, see `UPDATES/2026-06-10-v3.1.0-sovereignty-modules.md`.

---

## v3.0.1, 2026-06-10

The Constellation Seam. A documentation pass that lets the template and the public library read as one connected ecosystem.

### Added
- **README library paragraph.** A new "The Wider Library" section after Foundation First. It names the full library at infinitegameos.io/skills (twenty skills, seven bundles, one protocol), names the five skills that graduated out of this template, and notes the four that ship in both homes.
- **llms.txt graduated-skills enumeration.** The Ecosystem section now carries an enumerated block of the five graduated skills and the four dual-distribution skills, each with its direct page URL, so an agent at the repo can discover the installable set programmatically.

### Posture
No new behavior, no new skills. The seam itself is the work. A reader or an agent arriving at either node can now find the other and see the shared lineage running through both.

For full details, see `UPDATES/2026-06-10-v3.0.1-constellation-seam.md`.

---

## v3.0.0, 2026-06-10

The Plugin Era. A guided bootstrap wizard, a versioned upgrade path, a cross-platform skill pass and a public library wave. The major version. This release grows three new ways to begin, to stay current and to travel, and it does so additively. The template stays the spine. The plugin path is a second door, never the identity.

### Added (guided onboarding)
- **BOOTSTRAP.md.** A self-deleting setup wizard at the repo root. Open your AI interface and say "read BOOTSTRAP.md and run it." It runs a six-question interview (name, AI interface name, timezone, vault path, platform, governance depth), substitutes identity tokens via `scripts/replace-tokens.mjs`, wires platform-specific setup, routes the governance depth into Getting Started sessions, writes a completion note into `Primer.md`, then deletes itself. A safety rail detects an already-personalized vault and stops cleanly. The Getting Started sessions remain the deep path. README gained a Fast Start subsection.

### Added (versioned upgrade path)
- **`scripts/se-update.mjs`.** The upgrade tool. Confirms an upstream remote, fetches upstream, diffs every file against local HEAD and prints a categorized change list. Four modes: `--check`, `--diff "<path>"`, `--apply "<path>"`, `--force-seeded "<path>"`.
- **`scripts/framework-manifest.json`.** Path-classification authority. Three classes: framework (upstream-maintained, offered for review), seeded (shipped once then yours, overwrite needs `--force-seeded`), user (yours, never touched).
- **Sovereign Sync skill** at `Council Chamber/Skills/Sovereign Sync/`. The conversational layer over the tool. Presents the framework change list, mediates per-file approval (apply, skip or defer), and bookends the sync with one git commit. Converts the template from a one-time clone into a living relationship with upstream.

### Changed (cross-platform skills)
- **All 15 skills plus the Skill Template** now carry agentskills.io-standard frontmatter (kebab-case `name`, agent-routable `description`) and platform-portable instructions. The skills run in Claude Code, Cursor, Gemini CLI, Codex and peer interfaces without a fork.

### Added (public library wave)
- **Three Foundation skills now also ship as standalone installable plugins** in the Infinite Game OS public library at infinitegameos.io: Self-Healing, Session Closeout and Playwright. This is dual-distribution alongside Source Harvest. Each skill stays in the Foundation as part of the full experience and installs as an individual plugin for anyone who wants that one door.

### Posture
The major version grows the template outward without diluting it. The full experience still lives in the vault you own. The bootstrap is a faster front door, the upgrade path keeps the clone alive, and the plugins are individual entrances for the curious. v2.11.0 Harvest Sync shipped earlier the same day; v3.0.0 is the structural milestone that lands on top of it.

For full details, see `UPDATES/2026-06-10-v3.0.0-plugin-era.md`.

---

## v2.11.0, 2026-06-10

Harvest Sync. A doctrine pass on the trust anchor, a status-ladder migration across every planning surface, a seeded Humor Codex, a deeper Autonomous Improvement menu and two new write-time hooks. This release folds matured operating patterns back into the template.

### Added (CLAUDE.md trust anchor)
- **Claim Integrity.** The parent verification rule: a claim is verified at the moment it is made, not assumed from a visible surface. It carries three faces. Relocation (a move is verified by a link sweep), fact (a fact change is verified against the canonical artifact) and delivery (a publish is verified end to end to the human). Drift on one surface that holds on another is named as one class.
- **Flywheel Check.** A Session Calibration discipline. When an action sets or changes a pattern, standard or surface that later work could overwrite, ask how it connects to the larger system and whether it warrants a durability upgrade. Most fire and pass. The discipline is the asking.
- **Breadcrumb as you work.** An Operational Efficiency rule. Drop breadcrumbs where each change settles, in the artifact's own location, throughout the session. The session close becomes a reconcile, not a first pass.
- **Pre-publish sweep gate.** An Expression Standards rule. Run the pre-publish sweep before presenting any outward-facing draft. The highest-stakes surfaces are the most common drift point.
- **Fact Ratified sweep.** A canonical-fact change discipline. When a product fact changes (a name, a price, an availability), the change is not complete until a full grep for the old string has run and every downstream reference is reconciled. Ratification and the sweep are one unit of work.

### Changed (planning vocabulary and status ladder)
- **Pending Plan status vocabulary** is now `proposed`, `approved`, `ready-for-execution`, `implemented`. Status advances one direction only.
- **Status-ladder migration** across every live planning surface: the Pending Plan Implementation Protocol, Reconciliation Protocol, Progress Update Protocol, Batch Archival Protocol and skill, Capture Classify Route Protocol and the PendingPlan object template. Archival is now a lifecycle event after `implemented`, not a status value.

### Changed (Humor Codex)
- **The Humor Codex graduates from placeholder to seeded starter.** It ships the Jacket Layer (thirteen named trigger-and-move jackets in three families: Wit, Wonder and Meta), a density dial, rotation discipline, seed-and-detonate and a Make This Yours section. The ecosystem arrives a little bit funny out of the box. Personalizing it stays a named onboarding step.

### Changed (Autonomous Improvement Session)
- **The menu expands from 15 inline items to 36 in a new `references/menu-catalog.md`** (Tier 1: 8 items that land edits, Tier 2: 28 read-only scans) with research rotation categories. The SKILL.md now loads the catalog at the eligibility step. Progressive disclosure keeps the parent skill lean.

### Added (hooks)
- **`post-write-em-dash-check.sh`:** PostToolUse hook. Fires after every Write or Edit to a `.md` file. Scans for em dash characters and warns with line numbers. Non-blocking. Enforces the CLAUDE.md expression standard (no exceptions) at write time rather than review time.
- **`post-write-index-regen.sh`:** PostToolUse hook. Fires after Write or Edit matching `Council Chamber/Skills/*/SKILL.md` or `Council Chamber/Pending Plans/*.md`. Ships with a configuration block: set `SKILLS_REGEN_CMD` and `PENDING_REGEN_CMD` to your own regen scripts. Logs trigger events even when commands are unconfigured. Non-blocking.

Both hooks are POSIX sh compatible and path-parameterized via a `VAULT_ROOT` variable (no hardcoded paths). Registration wiring in `.claude/settings.json` is documented in the UPDATES file.

### Posture
The template observes its own matured patterns. Each item here started as a pattern lived in a working vault, proved itself and earned a home in the shipped Foundation. Claim Integrity is the spine: verify the thing where it is asserted, not where it is convenient to assume.

For full details, see `UPDATES/2026-06-10-v2.11.0-harvest-sync.md`.

---

## v2.10.0, 2026-06-03

### Added
- **llms.txt** at the repo root. The navigation manifest for AI agents arriving at the repository. Leads with an atomic definition of the Sovereign Ecosystem, carries a seven-question FAQ, indexes the repository structure and core concepts and links the surrounding ecosystem. Pairs with AGENTS.md: llms.txt declares structure, AGENTS.md declares behavior. The README stays a human onboarding document while the citation surface lives here.

### Posture
Discoverability load moves to the machine surfaces that humans rarely open by hand. Human and machine audiences never share a page. Repo topic tags were also sharpened for entity disambiguation toward the agentic-infrastructure positioning.

For full details, see `UPDATES/2026-06-03-v2.10.0-llms-discoverability-manifest.md`.

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

