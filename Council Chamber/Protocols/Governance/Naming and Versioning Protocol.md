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

# Naming and Versioning Protocol

Purpose: Systematize naming conventions and version handling across the Sovereign Ecosystem.

## Core Rule
- Filenames must not include version markers (e.g., `v0.1`, `v1.0`, `v2.0`).
- Versioning belongs in frontmatter as `version: x.y` when applicable.

## Scope
- Applies to all governance artifacts, protocols, codices, skills, templates, domains and consults.

## Naming Standards
- Use concise, descriptive titles.
- Use consistent object prefixes where applicable (e.g., `PendingPlan -`, `Quest -`, `Consult -`).
- Avoid redundant tags or version markers in titles.

## Versioning Standards
- `version` lives in frontmatter.
- Use `version` only when iterative evolution is meaningful.
- If a note has no version, omit the field.

## Enforcement
- Before creating or moving files, remove version markers from filenames.
- Store versions only in frontmatter.
- Run periodic scans for filename version markers and remediate.

## Change Control
- Renaming or re-titling governance artifacts requires Plan -> Consent -> Execute.
- Link updates must accompany any rename.
- Version changes must be logged in the AI Interface Change Log when the artifact is foundational.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Frontmatter contrast fields required.
- Footer internal contrast block required.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- Risk of hidden drift if versions are embedded in filenames or titles.
-->
