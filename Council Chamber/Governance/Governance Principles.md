---
name: Governance Principles
type: governance-instrument
status: active
created: 2026-07-10
owner: the Sovereign, ratified with the Sovereign present (each principle is a Sovereign-ratified change)
source: Sovereign Ecosystem template seed
links: "[[Council Chamber/Governance/Constitution - Sovereign Ecosystem]], [[Council Chamber/Governance/Watch Register]], [[.claude/CLAUDE.md]]"
last_reviewed: 2026-07-22
---

# Governance Principles

One home for the ecosystem's named governance principles. This instrument sits between the Constitution and the codices. The Constitution holds structural law: unchanging, foundational. The codices hold domain law: one lens each. A governance principle is neither. It is a durable rule about how the ecosystem governs itself, proven by lived precedent, general enough to apply across containers. It earns a place here only after the pattern has shown up more than once.

This note ships lightly seeded, with the starting principles below. The Sovereign adds more as their own precedents accumulate. A principle is not written ahead of the pattern it describes.

**What belongs here.** A durable law about how the ecosystem governs itself, general enough to apply across containers, proven by lived precedent. Each principle carries its statement, the precedent that earned it and how it is applied.

**What does not.** A container-local operating rule (those live in that container's own operating code or charter). A watch or tripwire (those live in the [[Council Chamber/Governance/Watch Register]]). A structural change to the ecosystem itself (that is a Constitution amendment).

**How it is ratified.** Each principle is a Sovereign-ratified change and lands with the Sovereign present. Adding, amending or retiring a principle here follows the same gate.

**How it is read.** These are background law, loaded through the CLAUDE.md trust anchor pointer. They fire without a read the way the Expression Standards fire. The note is the canonical home the pointer points to.

---

## Principle 1: State once, point elsewhere

**Statement.** A volatile fact lives in exactly one canonical home. Every other surface points to that home rather than restating the fact. Model names, prices, gate definitions, dates and phase ladders are volatile. Each restatement is a future Claim Integrity incident waiting to drift.

**Canonical homes by fact class.** Every ecosystem accumulates its own volatile facts as it grows: pricing, product names, model routing, deployment status, gate definitions. As each surfaces, name its one canonical home directly and let every other surface point to it, rather than restating the value.

**Precedent.** This principle earns its keep once a restated fact has drifted from its source at least once. When that happens, log the incident briefly so the pattern stays visible to future readers rather than repeating silently.

**How it is applied.** Express a volatile fact as its stable shape (for example, model routing as tiers rather than names) and let the single name-to-tier mapping live in the canonical home. A surface that needs to reference the fact points to the home. A surface may carry local truth that is genuinely its own without restating the global mapping.

**Backstop.** Some restatements must exist for a surface to read on its own. The Fact Ratified sweep is the standing net for those: when a fact ratifies, a full-vault grep reconciles every downstream reference. This principle reduces the surface area the sweep has to guard. It does not replace it.

**Relationship to the claim rules.** State once is the prevention. Claim Integrity is the verification: a claim's truth is checked at the moment it is made, against the canonical artifact, not the propagation source. State once keeps the number of claims low. Claim Integrity verifies the ones that remain. The Move audit rule and the Fact Ratified sweep are the two faces of the verification.

## Principle 2: Scaffolding proportionality

**Statement.** Structure earns its mass by measured load. Build machinery when data volume warrants it. Machinery built against thin volume is theater. A new container starts light and instruments only what its own activity proves it needs.

**Origin.** This principle generalizes a pattern most ecosystems discover locally, at small scale, well before it is worth naming ecosystem-wide: instrumentation built ahead of a proven lane becomes overhead, not leverage.

**Default new-container kit.** One dashboard note. One openings-style ledger. A short set of witness questions. Nothing more until load earns it. Deeper instrumentation and dedicated lenses arrive when measured load calls for them, not at the container's founding.

**Per-container override.** The light kit is the default, not a ceiling. A container's first session may name a reason to instrument heavier from the start. The default holds unless that reason is named and recorded.

**Evidence.** Heavy instrumentation on an unproven lane has repeatedly cost more than it returned. The relationship or the activity carried the result, not the tooling.

**How it is applied.** When a new container opens, reach for the light kit first. Let the container run. Watch the load. Add the next instrument when the volume it would serve is real and measured, one instrument at a time, each earned.

## Principle 3: Name the grade on the act

**Statement.** Delegated authority carries one of two grades, named at the moment it is exercised. An **executory** act implements an instruction as given, with no independent discretion. A **discretionary** act applies judgment inside a bounded domain under standing authority. The grade is marked on the act's record, not held in the agent's head.

**Origin.** The Abbasid vizier system formally named these two grades (wazir al-tanfidh, wazir al-tafwid) rather than letting delegation drift undifferentiated. English regency marked every delegated act "per regentem" so the delegated nature stayed visible on the record itself. The seal system broke exactly when the fast inner channel bypassed the graded chain.

**Precedent.** This ecosystem already grades authority structurally (the Trust Tiers, Article IV Section 4; the Permanent Floor) and already marks agent work in the ledger (the Co-Authored-By line on every commit). What was missing is the vocabulary naming which kind of act a record witnesses.

**How it is applied.** Marking lands only where a record already exists: Pending Plan activity log entries, commit bodies for acts under standing authority, Watch Register rows and any standing-grant automation acting under delegated authority. An activity log entry tagged `[AI]` acting on its own initiative within bounds states `discretionary`; one implementing a Sovereign instruction states `executory` or simply cites the instruction, which is the same mark. Dispatches and tool calls carry no per-call ceremony; the vocabulary applies to them without ritual. Acts that leave no record remain governed by the Permanent Floor, which bounds what may act unrecorded at all.

**Relationship to existing law.** This principle names grades; it does not widen authority. The Floor still bounds initiative. The Trust Tiers still govern how domains earn discretion. The grade on the act is what lets the Ledger of Change answer, years later, which kind of delegation a record witnesses.

---

## Principle 4: Claim Integrity

**Statement.** A claim's truth is verified at the moment the claim is made, not assumed from visible-surface behavior. The shared failure mode is a state reported true that holds on one surface and fails on the rest. When drift surfaces, name it as another face of this one class and verify the claim where it is asserted.

**Origin.** This is the parent discipline behind three rules that resolve to the same failure mode. The Move audit rule is the relocation face: a move is verified by the wikilink grep, not by the edit landing. The Fact Ratified sweep is the fact face: a ratification is verified against the canonical artifact, not the propagation source. Local to Submitted to Confirmed (CLAUDE.md, External Publishing Confirmation) is the delivery face: a publish is verified end to end, not at the instrument level. Eight further faces follow. The CLAUDE.md trust anchor carries one line for each; the full statement lives here.

*The reporting face.* Label every finding by what was directly observed, never by an inference about its cause. A page returning 404 is not a deleted page. When the cause stands unverified, name the observation alone and say the cause is unknown. Say where it was seen: on the live system, in the repo, in a vault record or in someone else's report. A figure computed from observations is derived, and it carries the limits of what it was computed from.

*The carried-item face.* An open loop is verified at the moment it is resurfaced, rather than assumed still open because it is still written down. Every item that carries across sessions records its own one-line done-check at capture time: where to look, and what state means done. Verdicts are three-state: `open`, `resolved` and `unverifiable`. A check whose source is unreachable returns unverifiable, never open and never resolved. Mechanics live in the [[Council Chamber/Governance/Watch Register]] header. **A carried item's stated scope is a claim too, and it expires.** When acting on a carried item, re-derive its scope from the question being asked now. An exemption written inside a stale item is the least examined sentence in the ecosystem.

*The absence face.* A successful action proves presence. Nothing observed from inside a running system proves absence. A tool that returns rows proves that tool reached that store. A suite that passes proves the assertions that ran. Neither can testify about what is supposed to be missing. So a negative is only as good as the instrument that reported it, and an instrument is trustworthy only when something has proven it can fail. When reporting that something is absent, clean, empty or safe, name the instrument, confirm it was aimed at the right place and say when it last demonstrated a failure. A claim of absence with no such instrument is reported as unverified rather than as clean. The enforcement layer is the layer a live session is least able to check on itself. A conclusion is produced by the command that ran, never echoed beside it: a sweep that prints "everything checks out" next to a script that crashed is a green light wired to nothing. Wording matters. "These specific tools returned real results" is a fact. "The configuration is what it should be" is a different claim, and it belongs to a check that stands outside the session.

*The attribution face.* "The Sovereign said" is a claim, verified at the moment it is written. Keep the layers apart in every artifact. The Sovereign's words go inside quotation marks, exact, with the source named (thread, transcript, file). The AI interface's summary stays outside them and reads as the AI interface. Quotation marks around a paraphrase are a false claim. A coinage stays the AI interface's after the Sovereign adopts it. A draft written in the Sovereign's first person is labeled AI-drafted until the Sovereign edits or sends it. `node "Council Chamber/scripts/quote-check.mjs"` checks each quotation in a draft against its source. The face covers every named person, not only the Sovereign. Text a person forwards that an AI drafted is quoted as their plan, never as their words. A quote correction is checked against the raw source (the email, the transcript) before it is reported fixed, because a correction made from memory or from an excerpt is a second claim, unverified. Outward documents carry the Sovereign's position, never their verbatim. A report, document or agenda that leaves the ecosystem under their name states what they settled in the document's own voice, with no quotation marks around their dictation and no "the Sovereign said" markers. Their approval of the document is their authorship of all of it. Brainstorm dictation carries uncertainty that a definitive statement does not, and quoting it outward publishes the thinking as the position. The quotation-mark discipline above stays whole for internal artifacts (vault notes, meeting captures, codices, session reports), where the spoken shape is the evidence.

*The decay face.* A claim can be verified true when written and then expire in place with nothing watching. Any canonical line carrying a date, a price, a model default or a "next move" names the condition that expires it, or carries a dated `(as of YYYY-MM-DD)` beside it. The instrument is `node "Council Chamber/scripts/decay-lint.mjs"`.

*The ruling face.* A ruling reversed is not reversed until its old wording is gone from every surface that carries it. A ruling has more homes than a moved file or a changed fact, and the ones that matter most load on every session: the CLAUDE.md trust anchor, the settings, any agent definitions and the AI interface's memory directory. So the reversal and the sweep are one unit of work. Grep the vault, `.claude/` and the memory directory for the abolished wording, then reconcile every hit or confirm it as history. A dated record of the old ruling stays as it was written.

*The enforcement face.* A sentence that states how a system behaves is a claim about that system, and it says only what the system enforces. A code comment, a repo `CLAUDE.md`, a design, a plan, a skill or a pull request body that states a behavior names what enforces it (the test, the guard, the line of code), or it reads as intent. The decay face covers a claim that was true and expired with a date. This one covers a claim that was true and expired with a change: the system moved and the sentence did not, and nothing tied the two together. The cheapest instrument is quoting `file:line` from the defining source for any sentence that states a behavior. The strongest is a test that reads the sentence's subject from the system itself, such as a test that reads every embed out of the content instead of trusting a hand-kept list.

*The outward reach.* Anything published outward is verified and confirmed before it goes out, to the degree it needs. The check scales with the stakes and adds no process of its own. A note to a client or collaborator never says a step is done until it is confirmed.

**How it is applied.** Every face has the same move: find where the claim is asserted and check it there, with an instrument that has been seen failing. The CLAUDE.md trust anchor names each face in one line so it fires without a read; this section is what that line points to.

---

## Change Log

- **2026-07-10.** Note created as a lightly-seeded governance instrument. Principles 1 and 2 seeded with generic statements and how-to-apply guidance. The lived precedents behind them stay with the source ecosystem; yours accumulate here. Wired into the CLAUDE.md trust anchor as background law.
- **2026-07-22.** Principle 3 (Name the grade on the act) added. Statement and historical grounding ported from lived precedent in the source ecosystem. Wired into the CLAUDE.md trust anchor as background law alongside Principles 1 and 2.
- **2026-11-25.** Principle 4 (Claim Integrity) moved here in full from the CLAUDE.md trust anchor, which keeps one line per face, so the anchor stays under 200 lines. The outward reach face added.
