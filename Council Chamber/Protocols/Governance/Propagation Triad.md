---
status: active
created: 2026-03-25
ring: Governance
trigger_phrase: "Propagation Triad"
---

# Propagation Triad

## Purpose

Any governance standard embedded in the Sovereign Ecosystem at a point in time will drift out of alignment as the system grows — new skills, new protocols, new agents — unless the standard carries its own propagation mechanism. The Propagation Triad is a reusable three-layer pattern that ensures any ecosystem-wide governing principle extends automatically to new elements at creation, and to runtime agents at execution.

Apply this pattern whenever a governance standard needs to travel forward.

## The Three Layers

### Layer 1 — Self-Describing Protocol

The canonical document for the standard includes a `## Propagation Rules` section. This section defines:
- Which creation surfaces require the standard (skills, protocols, sub-agent prompts, etc.)
- The exact pattern to apply at each surface (section name, callout format, wikilink target)

The protocol carries its own expansion instructions. Any future creator — human or agent — reads the document and knows exactly what to add.

### Layer 2 — Creation Gate

The relevant creation skill (typically Skill Creator, or an equivalent build skill) contains an explicit gate in its Constraints section. Before finalizing any new artifact, the agent asks: does this artifact fall within the scope of the standard? If yes, the required section or reference is applied before the artifact is considered complete.

This enforces the standard at creation time, not retroactively.

### Layer 3 — CLAUDE.md Standing Rule

`.claude/CLAUDE.md` contains a standing instruction covering the standard's scope. This rule:
- Applies to manually-created artifacts not routed through the creation skill
- Applies to runtime sub-agents (via the compact prompt template, if the standard requires one)
- Loads at every session, making the rule ambient rather than recalled on demand

## When to Use

Apply the Propagation Triad when:
- A new governance standard is being embedded ecosystem-wide
- The standard needs to apply to future artifacts, not only current ones
- The standard includes runtime behavior (sub-agent orientation, prompt patterns)

A standard without propagation is a point-in-time rule. A standard with the Propagation Triad is a living one.

## First Instance

The Ambassador Doctrine ([[Council Chamber/Protocols/Governance/Ambassador Doctrine]]) was the first standard built with the full Propagation Triad:
- Layer 1: `## Propagation Rules` section in the Ambassador Doctrine protocol
- Layer 2: Ambassador Doctrine gate in Skill Creator Constraints
- Layer 3: External Engagement Doctrine section in `.claude/CLAUDE.md`, including the sub-agent prompt template

<!--
Internal Contrast Layer
- The Propagation Triad is not a process to run each time. It is a design pattern to apply at creation. Once all three layers are in place, propagation is automatic.
- Layer 2 (creation gate) is the most likely to be missed — creation skills are not always invoked for governance protocols created manually. Layer 3 (CLAUDE.md) is the backstop for that gap.
- A standard with only Layer 3 is enforced at session load but not at creation time. A standard with only Layer 2 is enforced at creation but not for runtime agents. All three together close the loop.
-->
