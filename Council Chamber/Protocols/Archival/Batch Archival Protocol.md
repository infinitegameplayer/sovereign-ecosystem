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

# Batch Archival Protocol

Purpose: Provide a Sovereign Ecosystem-wide scan and approval mechanism for Vault descent.

Scope: All Active Chambers.

## Workflow
1. Scan Active Chambers for eligible artifacts.
2. Classify by domain/object.
3. Generate approval list by domain/object (Sovereign Ecosystem-wide; include all active domains, including Expression when relevant).
4. Run a lightweight readiness audit on proposed items (metadata completeness, links, routing path and object-specific checks).
5. Obtain explicit approval for pilot selection and execution order.
6. Normalize statuses for approved items (e.g., `active` -> `complete`) immediately before descent.
7. Upon approval, move artifacts to Vault.
8. Trigger Universal Vault Flywheel for each artifact.

## Library Eligibility Audit (Proposal-Only)
- Include a proposal-only audit for Library items that are time-gated (e.g., Transcripts and Coaching Sessions after 7 days).
- Audit proposes candidates; no moves or status changes without Sovereign approval.
- Optional tool: `Council Chamber/Tools/Library Vault Eligibility Audit.ps1`.

## Status Rules
- Eligible for scan: `status: complete` in Active Chambers.
- Also eligible for scan: `status: retired` for Quest notes in Active Chambers when archival is intended.
- Exclude: `status: archived`, `status: draft`, `status: proposed` unless explicitly approved.
- Consults (`type: consult`) remain planning-only unless explicitly marked `status: complete`.
- `status: proposed` and `status: draft` indicate planning-only mode by default.
- Quest notes may use `completed` or `retired` to indicate archival readiness; metadata preserves the distinction even when the Vault folder is shared.

## Approval
- Early phase requires explicit approval per domain/object list.
- Automation may be enabled after stable operation.

## Pilot
One pilot batch is required before full activation.
- Domain/object-specific pilots are valid (e.g., Creative meditation scripts) before broader Sovereign Ecosystem-wide runs.

## Readiness Audit (Lightweight, Recommended)
- Validate destination path and domain routing before status changes.
- Confirm object-specific linkage checks where applicable (example: Scriptorium meditation script -> optional matching recording strategy note link).
- For `PendingPlan` items, if a plan-specific `support_files_path` exists, confirm that:
  - permanent artifacts have been moved to a canonical Sovereign Ecosystem home
  - any preserved provenance has been moved to a Vault location
  - the associated subtree has been cleared from `Council Chamber/Pending Plans/Support Files/`
- Readiness audit is proposal/prep work only; no moves or status changes without approval.

## Quest Routing Note (Optional Standardization)
- Completed and retired Quests may share the same Vault Quest archive lane (for example, `Vault (Archive)/Quests/`), with `status` in frontmatter preserving whether the Quest was completed or retired.
- Avoid splitting Quest archive folders solely by terminal status unless a review workflow explicitly benefits from it.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Contrast compliance check before approval.

<!--
Internal Contrast Layer
- Store false-twin risks or scope creep vectors here.
-->













