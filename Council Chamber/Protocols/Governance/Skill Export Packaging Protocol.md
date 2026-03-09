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

# Skill Export Packaging Protocol

Purpose: Standardize how Sovereign Ecosystem skills and related procedures are packaged for outbound sharing with collaborators so they are easy to adopt, execute and govern.

## Scope
- Outbound sharing of a skill or skill-like capability to a collaborator, partner or future self outside the immediate Sovereign Ecosystem working context.
- Applies to exports that may include:
  - onboarding documentation
  - execution instructions
  - governance or approval rules
  - helper scripts/assets/references

## Core Distinction (Important)
- Internal Codex skill folder design optimizes for agent context efficiency.
- Outbound collaboration packages optimize for human onboarding and transfer clarity.
- Therefore, a `README.md` may be appropriate for exported packages even if an internal skill standard would not require one.

## Default Packaging Model
Use a layered package with clear file roles.

### Core (Minimum)
- `README.md` -> recipient-facing onboarding and quick start
- `SKILL.md` -> execution instructions and operating patterns

### Recommended (When Governance/Boundaries Matter)
- `README.md`
- `SKILL.md`
- `PROTOCOL.md` -> approvals, boundaries, handoff rules, decision gates

### Optional Components
- `scripts/` -> deterministic helpers
- `references/` -> deeper documentation or examples
- `assets/` -> templates, images, starter files
- `examples/` -> sample inputs/outputs

## File Role Standards

## `README.md` (Onboarding Surface)
Use for:
- what this package is
- who it is for
- what problem it solves
- setup requirements
- installation / placement steps
- quick start
- file map
- known constraints

Avoid in README:
- long reference material
- dense operating rules better suited for `SKILL.md`
- governance edge cases better suited for `PROTOCOL.md`

## `SKILL.md` (Operating Manual)
Use for:
- triggers / when to use
- required inputs
- execution workflow
- quality checks
- patterns / examples
- troubleshooting
- constraints specific to execution

Keep `SKILL.md` executable in spirit:
- Prefer procedural guidance over narrative background.
- Move deep references to `references/` when the file becomes too large.

## `PROTOCOL.md` (Governance and Decision Control)
Use when any of the following are true:
- approval gates are required
- there are "do not execute without consent" boundaries
- role handoffs matter (sender vs receiver responsibilities)
- the package can mutate shared systems, data or governance artifacts

Use for:
- scope and boundaries
- approval gates
- escalation points
- default safe mode / proposal-only mode
- audit breadcrumbs and change logging expectations

## Packaging Profiles (Choose One)

## Profile A: Lean Share
Use when:
- low risk
- no system changes
- mostly reference or drafting assistance

Package:
- `README.md`
- `SKILL.md`

## Profile B: Standard Operational Share
Use when:
- repeatable execution is expected
- helper scripts or examples improve adoption

Package:
- `README.md`
- `SKILL.md`
- optional `scripts/`, `references/`, `examples/`

## Profile C: Governed Operational Share (Recommended default for Sovereign Ecosystem exports)
Use when:
- collaboration decisions or approvals matter
- system/process changes are possible
- ambiguity could cause drift

Package:
- `README.md`
- `SKILL.md`
- `PROTOCOL.md`
- optional `scripts/`, `references/`, `assets/`, `examples/`

## Packaging Workflow (Plan -> Consent -> Export)

1. Define export intent and audience.
   - Who is receiving this package?
   - Is the receiver an operator, reviewer, collaborator or learner?

2. Classify risk and choose packaging profile.
   - Default to Profile C when unsure.

3. Separate concerns into files.
   - `README.md` for onboarding
   - `SKILL.md` for execution
   - `PROTOCOL.md` for governance and approvals

4. Redact or adapt internal-only content.
   - Remove Sovereign Ecosystem-private references not intended for the receiver.
   - Replace local paths with portable placeholders where needed.

5. Validate the package.
   - Confirm quick start can be followed.
   - Confirm file map matches actual files.
   - Confirm no conflicting instructions across files.

6. Share and log breadcrumb.
   - Record what was shared, to whom and the chosen profile.
   - Note any known limitations or deferred setup steps.

## Formatting and Cross-Link Rules
- Use standard filenames when possible:
  - `README.md`
  - `SKILL.md`
  - `PROTOCOL.md`
- Use a short package title at the top of each file.
- Keep section names consistent across exports (Setup, Quick Start, Constraints, Approval Gates).
- If local paths are included, mark them as examples and provide placeholders.
- Include a "What this package does not do" section in `README.md` for boundary clarity when helpful.

## Approval Gates for Sovereign Ecosystem-Origin Exports
- Gate 1: Export intent approved (what is being shared and why)
- Gate 2: Scope approved (what files and capabilities are included)
- Gate 3: Governance boundary approved (whether `PROTOCOL.md` is required)
- Gate 4: Final review approved before share

## Success Criteria
- Receiver can understand the package purpose in under 2 minutes (`README.md`)
- Receiver can execute the intended workflow without hidden assumptions (`SKILL.md`)
- Receiver can identify boundaries and approval points before acting (`PROTOCOL.md`, if included)

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Frontmatter contrast fields required.
- Footer internal contrast block required.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- Failure mode: mixing onboarding, execution and governance into one file creates adoption friction and execution drift.
- False twin: "comprehensive single doc" can feel complete but often becomes hard to use in real handoff contexts.
-->
