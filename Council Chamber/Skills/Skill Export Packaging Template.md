# Skill Export Packaging Template

Purpose: Provide a reusable export-ready structure for sharing a skill or skill-like capability with collaborators.

## How to Use
- Choose a packaging profile from `Council Chamber/Protocols/Governance/Skill Export Packaging Protocol.md`.
- Copy the relevant sections below into the export package files.
- Fill placeholders before sharing.
- Remove sections that do not apply.

## Recommended Package Structure (Profile C)
```text
<package-folder>/
  README.md
  SKILL.md
  PROTOCOL.md
  scripts/        (optional)
  references/     (optional)
  assets/         (optional)
  examples/       (optional)
```

## `README.md` Template (Recipient Onboarding)
```md
# [Package Title]

> [One-line summary of what this package enables.]

## What This Is
- Audience: [Who this is for]
- Use case: [What problem/workflow it solves]
- Outcome: [What the receiver can produce/do]

## What You Get
- [File/capability 1]
- [File/capability 2]
- [Script/helper 1]

## Requirements
- [Tool/runtime]
- [Version if relevant]
- [Access prerequisites]

## Setup
1. [Install dependency]
2. [Copy/place files]
3. [Configure path/env var]
4. [Verify setup]

## Quick Start
1. [First command or first prompt]
2. [Expected output]
3. [Where to inspect results]

## File Map
- `README.md` -> onboarding and setup
- `SKILL.md` -> execution guidance and patterns
- `PROTOCOL.md` -> approval gates and boundaries (if included)
- `scripts/` -> helpers (optional)
- `references/` -> detailed docs (optional)

## Constraints / Boundaries
- [What this package does not do]
- [What requires approval]
- [Known environment limitations]

## Troubleshooting (Optional)
- [Issue] -> [Fix]

## Share Notes (Optional)
- Source version/date: [YYYY-MM-DD]
- Maintainer: [Name]
```

## `SKILL.md` Template (Execution Guidance)
```md
# [Skill Name]

## Purpose
[What the operator/agent should accomplish with this skill.]

## When to Use
- [Trigger phrase or context 1]
- [Trigger phrase or context 2]
- [Boundary: when not to use]

## Inputs
- [Input type 1]
- [Input type 2]

## Outputs
- [Output artifact 1]
- [Output artifact 2]

## Requirements
- [Dependency/tool]
- [Folder structure expectation]

## Workflow
1. Prepare inputs
2. Run/author [step]
3. Validate output
4. Iterate if needed
5. Record results / handoff

## Quality Checks
- [Check 1]
- [Check 2]
- [Check 3]

## Patterns / Examples
- [Pattern 1]
- [Pattern 2]

## Troubleshooting
- [Issue] -> [Fix]

## Constraints
- [Execution constraint]
- [Safety constraint]
```

## `PROTOCOL.md` Template (Governance / Approval Flow)
```md
# [Protocol Title]

Purpose: [Why this protocol exists]

## Scope
- [What is covered]
- [What is not covered]

## Roles (Optional)
- Sender / Maintainer: [Responsibilities]
- Receiver / Operator: [Responsibilities]
- Approver: [Responsibilities]

## Default Operating Mode
- [Proposal-only / supervised / fully authorized]

## Approval Gates
### Gate 1: [Name]
- Decision needed:
  - [Decision A]
  - [Decision B]
- If approved:
  - [Next step]

### Gate 2: [Name]
- Decision needed:
  - [Decision A]
- If approved:
  - [Next step]

## Execution Boundaries
- Do not [action] without approval.
- Pause and escalate if [condition].
- Preserve [source/data/logs] before modification.

## Handoff / Reporting
- Record:
  - [What changed]
  - [Evidence]
  - [Open issues]

## Change Log / Breadcrumb (Optional)
- YYYY-MM-DD - [What was shared/updated]
```

## Export Review Checklist (Quick)
- `README.md` explains value and setup clearly.
- `SKILL.md` is procedural and executable.
- `PROTOCOL.md` exists if approvals/boundaries matter.
- File map matches actual files.
- Paths and examples are portable or clearly labeled.
- Internal-only references are removed or redacted.
