# Interface Adapter Registry

Purpose: Single source of truth for all interface adapters and their exposure tiers.

Governance hub: [[Council Chamber/Governance/Governance Constellation]]

## Registry Fields
- Interface
- Adapter Path(s)
- Exposure Tier (E0-E4): adapter exposure to consequence, defined in the Exposure Tier Scale below
- Access Mode (read-only / read-write / proposal-only)
- Governance Anchor
- Canonical Containers Exposed
- Last Reviewed
- Notes

## Exposure Tier Scale

The Exposure Tier rates an adapter's exposure to consequence: the blast radius if this interface misfires or is compromised.

It is deliberately named apart from the Constitution's agent trust ladder (Article IV, Section 4), which rates an agent's autonomous authority over the vault. Different subject, different letter. An adapter carries an E tier. An agent carries a Trust Level. The two never share a number, so neither can be mistaken for the other. Access Mode names the control applied on top of the exposure.

- E0: Read-only. Reads a system of record, mutates nothing. A misfire returns stale or empty data, never a bad write.
- E1: Narrow or append-only write. Additive, single-purpose, reversible by construction. No overwrite, no delete.
- E2: Read-write, reversible, contained. Writes into the vault or a reversible external system, recoverable via git or the tool's own undo. Every write approval-gated.
- E3: Read-write, live consequence. Writes into a live external system where a bad action carries real-world, hard-to-reverse consequence: money, production deploys, outbound to the world, inbound transactions. Every write approval-gated, and the gate is load-bearing.
- E4: Autonomous read-write within a Sovereign-ratified class. No adapter holds this tier today.

## Registry
- Interface: Codex
  - Adapter Path(s): `.codex/`
  - Exposure Tier: E2
  - Access Mode: read-write (approval-gated)
  - Governance Anchor: [[Council Chamber/Governance/Governance Constellation]]
  - Canonical Containers Exposed: `Council Chamber/`, `Operations/`, `Library/`, `Inbox/`, `Council Chamber/Pending Plans/`, `Scriptorium/`, `Explorations/`, `Collaborations/`, `Vault (Archive)/`
  - Last Reviewed: 2026-02-26
  - Notes: Canonical edits only via source folders; interface paths are non-canonical. Trust anchor: `.codex/CODEX.md`. Governance authority remains in the Sovereign Ecosystem's canonical governance notes.
- Interface: Claude Code
  - Adapter Path(s): `.claude/`
  - Exposure Tier: E2
  - Access Mode: read-write (approval-gated)
  - Governance Anchor: [[Council Chamber/Governance/Governance Constellation]]
  - Canonical Containers Exposed: `Council Chamber/`, `Operations/`, `Library/`, `Inbox/`, `Council Chamber/Pending Plans/`, `Scriptorium/`, `Explorations/`, `Collaborations/`, `Vault (Archive)/`
  - Last Reviewed: 2026-02-26
  - Notes: Canonical edits only via source folders; interface paths are non-canonical. Trust anchor: `.claude/CLAUDE.md`. Governance authority remains in the Sovereign Ecosystem's canonical governance notes.







