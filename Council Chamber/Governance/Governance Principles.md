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

This note ships lightly seeded, with two starting principles. The Sovereign adds more as their own precedents accumulate. A principle is not written ahead of the pattern it describes.

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

## Change Log

- **2026-07-10.** Note created as a lightly-seeded governance instrument. Principles 1 and 2 seeded with generic statements and how-to-apply guidance. The lived precedents behind them stay with the source ecosystem; yours accumulate here. Wired into the CLAUDE.md trust anchor as background law.
- **2026-07-22.** Principle 3 (Name the grade on the act) added. Statement and historical grounding ported from lived precedent in the source ecosystem. Wired into the CLAUDE.md trust anchor as background law alongside Principles 1 and 2.
