---
name: Engineering Codex
type: codex
status: template
created:
authority: canonical for all code work in this ecosystem
scope: every code repo in your ecosystem, plus this vault's Council Chamber/scripts directory
source: Compound Engineering Source Harvest (EveryInc/compound-engineering-plugin, MIT), synthesized against ecosystem governance
links: "[[Council Chamber/Governance/Constitution - Sovereign Ecosystem]], [[Council Chamber/Protocols/Planning/Pending Plan Implementation Protocol]], [[Council Chamber/Protocols/Governance/Repo Context Architecture Protocol]], [[Council Chamber/Skills/Source Harvest/SKILL]], [Systematic Debugging](https://infinitegameos.io/skills/systematic-debugging)"
---

# Engineering Codex

Canonical authority for how this ecosystem plans, builds, verifies, reviews, refines, polishes and compounds code. Consult before any build session on a code repo in your ecosystem. If your ecosystem maintains a separate web and AI discoverability standard, that stays canonical for those standards; this codex governs the engineering practice that produces the code those standards apply to.

Scope: every code repo in your ecosystem and the scripts under this vault's `Council Chamber/scripts/` directory. Not vault-only or governance-only work, which the Pending Plan protocols already govern.

**Path convention in this codex.** A path written repo-relative (`docs/solutions/`, `CLAUDE.md`) means *inside whichever code repo you are working in*, and it resolves in each of them separately. A path written from a vault container (`Council Chamber/...`) is vault-relative. This codex is the one document that lives in the vault and legislates for the repos outside it, so the two are named apart deliberately.

## The Compounding Law

Structure the work so each unit makes the next one easier.

The cycle is Plan, Build, Verify, Review, Refine, Polish, Compound. The last stage returns to the first: a learning written at the end of one cycle is read as grounding at the start of the next. A cycle that ends without a durable learning has spent effort and banked nothing. That return arrow is the whole point, and it is the one thing most engineering practice lacks.

This ecosystem is not a software company. It is refusing to rediscover the same lesson twice.

## I. Plan

The plan is a decision artifact. Progress lives in git and in the session, never in the plan body.

**One evolving document.** Requirements and implementation live in one file with a readiness field, never in two files that drift apart. A requirements doc and a separate plan doc will diverge, and the divergence is silent.

**The traceability spine.** Every plan carries stable identifiers that survive edits:

| ID | What it names |
|---|---|
| `R#` | A requirement. What must be true. |
| `U#` | An implementation unit. A chunk of work. |
| `F#` | A key flow. Trigger, steps, outcome. |
| `AE#` | An acceptance example. A concrete input and its expected output. |

The chain runs `R# → U# → test scenario → verification row`. Nothing in the plan is untraceable back to a requirement, and no requirement lacks at least one unit and one test scenario referencing it. "Did I actually build R7" becomes a grep rather than a memory exercise.

**Stable IDs are never renumbered.** Reordering keeps old IDs in the new order. Splitting keeps the original ID on the original concept and gives the fragment the next unused number. Deletion leaves a gap. The tidy-the-list impulse during a late edit is the single most likely way to silently break every downstream reference.

**The Verification Contract.** A table mapping each named gate to the command that proves it and the units it covers. Written at plan time, not discovered at ship time.

**The Definition of Done.** The Verification Contract restated as prose the implementer reads last.

**The scoping checkpoint.** Before expensive work begins, state the scope and the real forks, and pause. The governing question:

> Would the Sovereign need to look at code to evaluate this? If yes, it is plan-body content. Cut it.

This is the fix for a real drift: handing the Sovereign implementation detail they have no basis to evaluate and asking them to approve it. Their job is to redirect forks, not to validate every implementation consequence of a fork they have already agreed to.

**Deferred to Follow-Up Work.** Tangential "while we're here" ideas go to their own subsection. Never into an active unit. This is the compound-opportunity sweep, applied at plan time.

## II. Build

**The idempotency check.** Before starting any unit, verify whether the work is already present and matches intent. It may have shipped in a prior session or on a prior branch. Verify, mark complete, move on. Never silently reimplement.

**Evidence Strategy, chosen before the edit.** Before changing any behavior-bearing code, choose one:

1. An existing test already fails for this reason.
2. An existing test asserts the wrong thing and gets updated.
3. An over-mocked test gets strengthened to prove the real chain.
4. A new focused test is written and observed failing for the right reason.
5. A deliberate no-test exception, recorded with the replacement verification.

The gate: **do not write the test and the implementation in the same step, and never skip watching the new test fail for the expected reason before implementing.** A test written after the code, to match the code, proves only that the code is the code.

**The two-hop trace.** Before calling a task done, trace two levels out. What fires when this runs? Callbacks, middleware, event handlers, webhooks. Do the tests exercise the real chain or only a mock? Can a failure leave orphaned state? This catches the class of bug a small server runner produces most: state left half-updated after a failed external call.

**Bounded worker packets.** Never dispatch "read the whole plan" as a worker prompt. Each worker receives the goal capsule, the definition of done, its one unit's section and the cited excerpts. Nothing more.

**Evidence is non-reconstructable.** A worker reports its changed files AND its verification evidence, because the evidence fields cannot be recovered from the tree afterward. A worker that omits them forces the orchestrator to guess, and a guessed "tests passed" is a fabricated claim. This is Claim Integrity at the worker boundary.

**The parallel safety check.** File overlap is necessary and insufficient. Also serialize on contention that no `Files:` list shows: shared types, database migrations, generated artifacts, lockfiles, and environment singletons (one dev server, one port, one database, one browser session). Cap concurrency at three to five workers. Over-parallelizing costs more in merge and integration than it saves.

**The incremental commit heuristic.** Can you write a commit message describing a complete, valuable change? Commit. Would the message be "WIP" or "partial X"? Wait. Commit before switching context and before attempting anything risky.

## III. Verify

The done gate is layered. Each layer has its own evidence.

| Layer | What proves it |
|---|---|
| Task | The Evidence Strategy was chosen, the test ran, the result was witnessed. |
| Unit | The worker reported changed files AND verification evidence. |
| Build | Every plan requirement is satisfied, every deferred-to-implementation question is resolved, lint and typecheck pass, the console is clean. |
| Review | Findings are applied, deferred to a durable record, or explicitly accepted and recorded. |
| Ship | Local, Submitted, Confirmed. |

**The unifying principle: evidence is witnessed and reported by whoever did the work. It is never reconstructed or assumed afterward.** This is the code-work face of Claim Integrity ([[.claude/CLAUDE]]), and it is the same discipline as the Move audit rule and the Fact Ratified sweep, applied to a different surface.

**A green matrix with a red suite is not ready.** Before declaring anything shipped, run the project's full test suite once.

**The durable sink rule.** A known issue, a deferred finding or an accepted residual goes into a committed record file. Never only into a session transcript, and never only into a plan's activity log if the code repo is where the next agent will look. *A defer that produces no durable artifact is data loss.*

## IV. Review

**Confidence anchors, not scores.** Every finding carries exactly one of five values. Each anchor names a behavioral criterion the reviewer must honestly self-apply.

| Anchor | Criterion |
|---|---|
| 0 | A false positive that does not survive light scrutiny, or a pre-existing issue this change did not introduce. |
| 25 | Might be real, might be a false positive. Could not be verified from the diff and surrounding code. |
| 50 | Verified as real, and it may be a nitpick, a narrow edge case or of minimal practical impact. Style preferences land here. |
| 75 | Double-checked and confirmed. It will affect users, callers or runtime behavior in normal usage. Clearly present and actionable. |
| 100 | Verifiable from the code itself. Compile error, type mismatch, definitive logic bug, or an explicit standards violation with a quotable rule. No interpretation required. |

The actionable floor is **75**. Below it, suppress. One exception: a critical finding at 50 surfaces anyway, because a critical-but-uncertain issue is worse to lose than to over-report.

A continuous 0-to-100 score invites false precision. "Confidence 87" means nothing, cannot be audited and cannot be reproduced. Five anchors with behavioral criteria can be.

**The quote-the-line gate.** Before anchoring a finding at 75 or 100, quote the verbatim line that makes it true, with `file:line`, as the first evidence item. **If you cannot quote the motivating line, you cannot claim 75 or above. Step down to 50.** Enforced twice: as a reviewer instruction, and mechanically at merge, where any 75 or 100 finding arriving without a quote is demoted. This kills the single most common false-positive class, a reviewer asserting a bug exists without pointing at the code that proves it.

**Corroboration promotion.** Two independent reviewers on the same finding promote it one anchor step. Two carve-outs, both load-bearing:
- Promotion never bypasses the quote gate. Two un-quoted findings must not combine into a quote-free 75. Agreement corroborates that an issue is real; the quoted line is what licenses high confidence.
- The orchestrator's own inline scan never counts as corroboration. It shares the session model's blind spots with the other lenses. Self-agreement dressed as consensus is not evidence.

**The validator pass.** Every surviving finding gets its own fresh subagent. One per finding, never batched, because a single batched validator pattern-matches across findings and recreates the bias it exists to remove. The validator is told it has no commitment to the finding and that false positives are common. It answers three questions:

1. Is the issue real in the code as written? (Check for a guard, a null check or a validation the reviewer missed one line up.)
2. Did this change introduce it? (A pre-existing untouched line fails, regardless of whether the claim is true.)
3. Is it not already handled elsewhere? (Callers, middleware, framework defaults.)

Conservative bias. When in doubt, reject. A rejected finding's reason is recorded so the loss is auditable rather than silent.

**The autofix ladder.** The class of a finding never authorizes action on its own. The anchor has to independently earn it.

| Route | Condition |
|---|---|
| Applied silently | Anchor 100, and the fix is mechanically implied (a typo, a wrong count, a stale cross-reference). |
| Confirm first | A concrete fix exists and it touches meaning, scope or contract. |
| Human resolves | Multiple valid approaches. Needs a design or product decision. |
| Advisory only | Nothing breaks if left unfixed. Never enters the action queue. |

**Fail closed.** If the diff scope cannot be computed, run the full review roster. A counting failure must never read as "trivial diff, zero lines."

**Review never mutates the tree.** Review returns findings. Applying is a separate step, batched by file rather than by finding.

## V. Refine

Three lenses, run as a cheap pass on a fresh diff before review:

- **Reuse.** New code that duplicates an existing utility, or hand-rolled logic that a runtime primitive already covers. Only when behavior-equivalent.
- **Quality.** Redundant state, parameter sprawl, copy-paste variants, leaky abstractions, nested conditionals, dead code.
- **Efficiency.** Unnecessary work, N+1 patterns, missed concurrency, recurring no-op state updates, listener leaks.

**The hard guard: never simplify away a safety check.** Input validation at a trust boundary, error handling that prevents data loss, and any security check are not removable boilerplate. A ceiling that looks like ceremony is still a ceiling.

**Simplify at phase boundaries, not per unit.** Early patterns may look duplicated and then intentionally diverge. Wait for two or three units or a natural boundary.

## VI. Polish

**The launch cascade.** Resolve how to run the app in this order, first hit wins: a `launch.json` at the repo root, then framework signature files, then a monorepo probe, then the port cascade (an explicit flag, framework config with numeric literals only, a Procfile, docker-compose, package scripts, `.env` files in override order, the framework default).

Never grep `CLAUDE.md` or any instruction file for a config value like a port. Natural-language documents produce false positives that are painful to debug.

**The persona walk.** Before shipping, walk the changed flow as the actual user and record the **paper cuts**: a confusing label, an extra tap, a missing loading state, an unexpected jump. A change can pass every functional test and still be worse to use. For a mobile-first surface, the persona is one sentence: your most impatient user, on a phone, one-handed, in an airport.

**The true end state.** "An email sent" is not a pass. The recipient receiving it, clicking through and landing on the right content is the pass. Side effects are followed to their real end. This is Local, Submitted, Confirmed, restated for user flows.

## VII. Compound

**Every code repo carries a learning corpus at `docs/solutions/`.** One learning per file. Structured frontmatter so a future agent can grep before it reads. The corpus lives in the repo it describes, because that is where the next agent will be standing.

Two tracks. A **bug** learning records a defect and its fix: symptoms, root cause, what did not work, the solution, why it works, prevention. A **knowledge** learning records a durable decision or convention: context, guidance, why it matters, when to apply.

**The capture trigger.** A verified fix, or a decision worth not relitigating. Preconditions: the problem is solved, the solution is verified, and the fix is non-trivial. One learning per run. Batching several and stitching cross-references afterward produces documents that reference a numbering scheme that exists nowhere.

**Overlap before writing.** Score a candidate against the existing corpus. High overlap updates the existing document rather than creating a second one, because two documents describing the same problem inevitably drift apart, and the reader has no way to know which one is current.

**Grounding validation.** A learning becomes trusted knowledge that future agents act on without re-verifying. So it is verified at the moment it is written, in two steps.

*Mechanical:* run a claim-validator script against the document. It checks every cited path, every commit SHA, every relative link and every wikilink against git, and flags dangling drafting scaffold.

*Semantic:* a read-only pass verifies every factual claim. A claim about how code behaves is verified by quoting `file:line` from the defining source, or it is softened, attributed or dropped. A claim that something shipped is verified against the actual repository state.

**Flags are questions, not failures.** A document may legitimately cite a path that the very fix it documents deleted. Every flag is adjudicated and the adjudication is reported. Nothing is auto-fixed and nothing is auto-passed.

**Staleness.** A learning is maintained on five outcomes: Keep, Update, Consolidate, Replace, Delete. The distinction that does the work: drift is **cosmetic** when references moved and the solution still holds (Update), and **substantive** when the solution itself changed (Replace). If you find yourself rewriting the solution section, stop. That is a Replace.

Age alone is never a staleness signal. A contradiction with current reality is a strong Replace signal, because the document is now actively misleading rather than merely dusty.

## VIII. Repo Anchors

**Every code repo in your ecosystem carries a `CLAUDE.md` at its root.** Not a summary of the vault. The operative contract a fresh agent needs before it touches anything: what this is, the architecture, the ceilings that are never relaxed, the credential doctrine, the injection floor, the conventions, the deploy path, the expression standards and the honest known state. See [[Council Chamber/Protocols/Governance/Repo Context Architecture Protocol]] for the two-layer AGENTS.md plus CLAUDE.md standard this repo anchor extends.

The vault stays canonical. The repo anchor is a local mirror of ratified decisions, and it names the plan it mirrors. When the two disagree, the vault wins and the anchor is stale.

The failure this prevents: a ratified ceiling that exists only in a document the working agent never loads is not a ceiling. It is a wish.

## VIII-b. Upgrade

Applies to every piece of running software in your ecosystem: every app, every site, `Council Chamber/scripts`. Software that nobody upgrades is software that is quietly rotting, and the argument for an agent doing it is one asymmetry: an agent can read every changelog of every pinned dependency every week, and a human never will.

**The upgrades land in the session that finds them.** A sweep ending in a list of things somebody should do later is a sweep that did nothing. Apply what the evidence supports, hold what it does not, and carry the reason for each. A held upgrade is a decision, never a chore deferred. Only genuinely large scope earns a Pending Plan, and that plan runs right after rather than someday.

**A manifest, never a category.** List every surface checked, by name, in a table. A category is a place to forget something. A list is a place to notice. Anything checked and boring gets one line and no ceremony, because boring is the expected result and dressing it up teaches the reader to skim.

**Every upgrade class carries a hazard a green build hides.** Fire the specific check, never the general one. *The green build* is a named failure mode below for exactly this reason.

| Upgrade class | The hazard | The check |
|---|---|---|
| An auth or crypto library | It is the doorman. A break here is a security break wearing a passing suite | Run its suite AND re-run its mutation score. A green suite over a rotted guard is the thing the liveness control exists to catch |
| A renderer or parser | It meets inputs the happy path never sends it | Feed it the ugly real input. A streaming UI hands a markdown parser unclosed code fences on every frame |
| A framework major | The breaking change is usually a type that got more honest | Typecheck, and read the error rather than casting past it. React 19's `useRef<T>(null)` returning `RefObject<T \| null>` was the truth React 18 hid |
| An agent or model SDK | The message-loop shape is the whole integration | Re-fire the behavioral evals. A loadout ceiling rides on it |
| A compiler or toolchain rewrite | The test and verification toolchain sits on top of it | Hold until the ecosystem ships support. A compiler rewrite (for example, a Go-based rewrite of a JavaScript toolchain) is worth holding until the surrounding ecosystem catches up |
| Any major | The build passing is not the feature working | Name what the package actually does in this app, then exercise that |

**Verify where the version actually resolves.** A caret range in a manifest reads like drift risk and usually is not one. The truth is in the lockfile and the install step, never the manifest. Check the Dockerfile or CI: `npm ci` pins, `npm install` floats.

**An accepted CVE is recorded with its reasoning, once.** A vulnerability on the wrong attack surface (a devDependency never in the bundle, no attacker-controlled input) is accepted on purpose. Write down why, so a future scan finds the ruling instead of re-litigating it, and so the red number is never a mystery.

## IX. Named Failure Modes

The register. Each is a real failure with a real defense, and naming it is most of the defense.

| Name | The failure |
|---|---|
| **Consensus laundering** | Twenty agreeable turns between the Sovereign and the agent quietly becoming "grounding," producing a confident verdict that ratifies chat fiction. Defense: a claim from the conversation is a hypothesis to verify, never evidence. |
| **The bad instrument** | A weak probe produces a confident wrong answer, and the rail looks like it works. A vision-model test that used a 1x1 pixel as its probe returned a filename-flavored confabulation instead of failing; a solid-red test image returned "Red" and nothing more useful. A test that cannot fail informatively is not a test. |
| **Shotgun debugging** | Changing several things to see if it helps. Feels productive. Eliminates nothing. |
| **Confirmation bias** | Reading ambiguous evidence as support. The test: *what evidence would disprove this hypothesis?* If none can be named, this is justification, not testing. |
| **It works now** | The symptom stopped and the why is unexplained. The test: can you explain the fix without the word "somehow"? |
| **The heisenbug** | A fix that only works while the instrumentation is present is itself the bug. |
| **False precision** | A confidence score of 87. It cannot be audited, reproduced or defended. |
| **Self-agreement as consensus** | Two lenses on the same model agreeing, counted as independent corroboration. |
| **Summary collapse** | A worker asked to return long prose returns an executive summary instead, and the original is unrecoverable. Defense: workers write to a file and return a path. |
| **Silent renumber** | A tidy-the-list edit breaks every downstream reference to a stable ID. |
| **Data loss by defer** | A finding acknowledged and never durably recorded. |
| **The seam** | Two components, each correct in isolation, and a false contract between them. A background runner deliberately emitted no progress for a tool-free reply; the interface read no-progress as still-booting. Neither side was wrong and the Sovereign watched a lie for a minute straight. Defense: when a user reports a bug and every component reads correct, the bug is in the contract. Read the two sides against each other, never each alone. |
| **The green build** | A build that compiles, a suite that passes, and a feature that does not work. Proves the code is syntactically valid, never that it does its job. Defense: name what the thing actually does in this system, then exercise *that*. A markdown-parser major that compiles clean can still fail on the half-written markdown a streaming UI feeds it. |
| **The guard held by ordering** | A memoized guard whose construction path executes once per process, so exactly one test covers it, and if chance hands that slot to a negative test, deleting the whole construction survives untested. Defense: memoization plus per-test coverage hides construction paths from mutation testing. Reset the module and claim the cold-start slot for a *positive* assertion. |
| **The routed-around guardrail** | An agent whose test or audit is blocked by a safety control, and which finds a way around it. The block was the control working. Defense: stop, and reach for the sandboxed instrument. An agent that learns to talk past its own guardrails has become the thing it audits for. |
| **The false red** | A new test goes red and the code gets "fixed" to satisfy it. Sometimes the test was wrong. Defense: when a fresh test fails, the first question is whether the test is TRUE, never how to make the code agree with it. |

## Model Routing

| Stage | Default | Rationale |
|---|---|---|
| Plan authoring, scoping checkpoint | Opus | Architectural judgment, Sovereign-facing |
| Build execution, worker dispatch | Sonnet | Bounded unit packets against a written plan |
| Mechanical lookups, path checks, frontmatter edits | Haiku | Deterministic |
| Review lenses | Sonnet | Parallel independent analysis |
| Validator pass | Sonnet | Fresh-context adversarial verification |
| Learning capture, grounding validation | Sonnet | Structured synthesis against cited source |

Set `model` explicitly on every Agent call. Canonical rule in CLAUDE.md Operational Efficiency.

## Verification Loops

Per CLAUDE.md: pass@k for single-session builds and non-critical skill execution. **pass^k** for anything in `Council Chamber/scripts/`, for hook scripts, for MCP tools and for any security gatehouse ceilings your ecosystem runs. Consistency across runs, not a single lucky pass.

## Refinements

**Codex established.** Synthesized from the Compound Engineering Source Harvest against existing ecosystem governance. The harvest confirmed independent laws already held here (untrusted input, witnessed evidence, durable sinks, workers report to file) and supplied the one thing missing: the return arrow. The learning corpus is the mechanism; this codex is its law.

**The Verify section gains its governing law, and it lives next door.** The liveness control is canonical in [[Council Chamber/Codices/Technology/Sovereign Software Codex]] Section 2, which is this ecosystem's posture on software it owns, runs and may hand to someone else. Read it beside this codex on any verification work.

**Before trusting any negative result, prove the channel it depends on was live.** A guard that held, a test that passed, an eval that scored zero, a scan that found nothing: each is a claim, and each is worthless until something shows it was capable of failing. A green result with no liveness control is not evidence. It is a mood. Corollary: **absence is not a guard.** A ceiling holding because a file is missing, a flag is unset or a tool was never added is a coincidence with good manners.

This section (III. Verify) already carried the right instinct in "a guard is verified by firing, never by text." The liveness control is that instinct generalized past guards to every instrument, and given its formal discipline: mutation testing. Break the code on purpose, watch a test go red, restore it, watch it go green. Coverage says a line ran. Mutation score says a line mattered.

Prove this on your own build before trusting it elsewhere. Run a mutation-testing tool against your most trusted guard file. Most first runs find at least one function everyone assumed was covered and nobody had actually tested.
