# Interface Adapter Registry

Purpose: Single source of truth for all interface adapters and their permitted trust tiers.

Governance hub: [[Council Chamber/Governance/Governance Constellation]]

## Registry Fields
- Interface
- Adapter Path(s)
- Trust Tier (L0-L4)
- Access Mode (read-only / read-write / proposal-only)
- Governance Anchor
- Canonical Containers Exposed
- Last Reviewed
- Notes

## Registry
- Interface: Codex
  - Adapter Path(s): `.codex/`
  - Trust Tier: L2
  - Access Mode: read-write (approval-gated)
  - Governance Anchor: [[Council Chamber/Governance/Governance Constellation]]
  - Canonical Containers Exposed: `Council Chamber/`, `Operations/`, `Library/`, `Inbox/`, `Council Chamber/Pending Plans/`, `Scriptorium/`, `Explorations/`, `Collaborations/`, `Vault (Archive)/`
  - Last Reviewed: 2026-02-26
  - Notes: Canonical edits only via source folders; interface paths are non-canonical. Trust anchor: `.codex/CODEX.md`. Governance authority remains in the Sovereign Ecosystem's canonical governance notes.
- Interface: Claude Code
  - Adapter Path(s): `.claude/`
  - Trust Tier: L2
  - Access Mode: read-write (approval-gated)
  - Governance Anchor: [[Council Chamber/Governance/Governance Constellation]]
  - Canonical Containers Exposed: `Council Chamber/`, `Operations/`, `Library/`, `Inbox/`, `Council Chamber/Pending Plans/`, `Scriptorium/`, `Explorations/`, `Collaborations/`, `Vault (Archive)/`
  - Last Reviewed: 2026-02-26
  - Notes: Canonical edits only via source folders; interface paths are non-canonical. Trust anchor: `.claude/CLAUDE.md`. Governance authority remains in the Sovereign Ecosystem's canonical governance notes.







