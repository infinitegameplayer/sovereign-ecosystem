---
name: Batch Archival
description: Execute Batch Archival Protocol with explicit approval gates.
status: draft
version: 0.1
tier: foundational
contrast_not:
false_twins:
anti_patterns:
boundary_conditions:
clarity_triggers:
---

# Batch Archival Skill

Purpose: Execute Batch Archival Protocol with explicit approval gates.

Inputs:
- Scan criteria (status, tags, age)
- Domain/object mapping rules
- Approval preferences
- Library eligibility audit results (proposal-only)
- Optional object-specific readiness checks (e.g., related strategy-note link scan for Scriptorium artifacts)

Outputs:
- Approval list by domain/object
- Readiness audit notes / blockers by item (proposal-only)
- Proposed Vault moves
- Library audit candidate list (proposal-only)

Constraints:
- No moves without explicit approval.
- No status changes without explicit approval.
- Library audit is proposal-only and requires Sovereign approval.
- Default status scan should include `complete` and may include object-specific terminal statuses (e.g., `retired` for Quest notes) when approved.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Contrast fields required.
- Footer internal contrast block required.

<!--
Internal Contrast Layer
- Note scanning edge cases and ambiguous objects here.
-->
