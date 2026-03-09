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

# Universal Vault Flywheel Protocol

Purpose: Define the Sovereign Ecosystem-wide archival flywheel that governs Vault descent, evolution and sovereign approval.

Scope: All objects that enter the Vault, including Intelligence, Governance, Explorations and domain artifacts.

## Principles
- {{AI_INTERFACE_NAME}} proposes. The Sovereign approves.
- No protocol, template or taste mutation without explicit approval.
- Preserve raw transmission integrity.
- Flywheel activation follows pilot validation.

## Trigger
An artifact is declared complete and moved from an Active Chamber to the Vault.

## Status Rules
- Eligible for Vault descent: `status: complete` in Active Chambers.
- Exclude: `status: archived`, `status: draft`, `status: proposed` unless explicitly approved.
- Consults (`type: consult`) remain planning-only unless explicitly marked `status: complete`.

## Stages
1. Vault Descent
   - Confirm domain and Vault path.
   - Enforce `[[Council Chamber/Protocols/Governance/Naming and Versioning Protocol]]` (no version markers in filenames; keep `version` in frontmatter when applicable).
2. Domain Index Update (Draft)
   - Append structural constants, tonal signature, patterns, deviations, template alignment notes.
   - Link lightweight associations (Quests, Experiments, Plans or related domains) when relevant.
3. Taste Delta Analysis
   - Compare the artifact to the Universal Taste Profile baseline (your Universal Taste Profile Codex) and the relevant Domain Taste Profile.
   - Run a lightweight taste evaluation:
     - Universal Fit
     - Domain Fit
     - Somatic Signal (if applicable)
     - Red Flags / smell-test markers
   - Classify delta type:
     - none
     - artifact-only variance
     - domain delta candidate
     - universal delta candidate
   - Generate a Taste Delta Report (use `Council Chamber/Templates/Object Templates/Taste Delta Report.md` when helpful) and Protocol Delta notes only if structural governance changes are implicated.
4. Protocol Delta Detection
   - Identify meaningful structural evolution.
5. Sovereign Approval Gate
   - Present what changed, why it matters, proposed updates, stability risks, drift risks.
   - No changes without explicit approval.
6. Versioning and Logging
   - Update Protocols/Indexes/Templates only if approved.
   - Log in AI Interface Change Log.
   - Commit with structured message.

## Pilot Modes
- Ecosystem-wide pilot: required before full activation.
- Domain/Object pilot: required before domain activation.

## Batch Mode
Batch Archival Protocol may trigger the flywheel across domains, with approval lists per domain/object.

## Taste Governance Link
- Taste evaluation and profile mutation rules are governed by `[[Council Chamber/Protocols/Flywheels/Universal Taste Calibration Protocol]]`.
- Flywheel Stage 3 may detect and propose taste deltas; it does not approve taste profile changes.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Frontmatter contrast fields required.
- Footer internal contrast block required.
- Primary body remains affirmative.
- Contrast compliance check occurs at Sovereign Approval Gate.

<!--
Internal Contrast Layer
- Evolution notes and edge-case modeling live here.
-->

## Cross-Flywheel Connections
- Upstream triggers: completed artifacts from Active Chambers (including outputs seeded by the North Star Flywheel).
- Downstream outputs: Taste Delta reports, protocol delta signals and domain index drafts that inform governance refinement and North Star recalibration.
- Stewardship updates: changes to flywheel doctrine route through the Flywheel Codex Stewardship Protocol.
