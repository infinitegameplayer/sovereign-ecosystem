---
status: draft
version: 0.1
tier: foundational
contrast_not:
false_twins:
anti_patterns:
boundary_conditions:
clarity_triggers:
---

# Domain Pack Architecture Protocol

Purpose: Define the required structure and governance for each Domain Pack.

Scope: All domains, including Intelligence, Governance, Explorations and artifact domains.

## Required Components
- Domain Protocol v0.1
- Domain Index v0.1
- Templates (Hard, Soft, Meta)
- Codex Overlays (Default, Optional)
- Pilot Run notes (stored as Experiments)

## Pilot Requirement
Each domain requires a pilot run before full activation.

## Vault Placement
- Domain artifacts live in `Vault (Archive)/Domains/<Domain>/`.
- Templates archived under `Vault (Archive)/Templates/` (flat for now).

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Domain Protocols and Domain Indexes require contrast fields + footer block.
- Domain Templates include optional contrast blocks (Tier-based).

<!--
Internal Contrast Layer
- Document evolution and boundary rationale here.
-->
