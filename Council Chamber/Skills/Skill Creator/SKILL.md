# Skill Creator

**Purpose:** Build new Sovereign Ecosystem skills autonomously. Interview the Sovereign about the skill's intent, research relevant ecosystem patterns and protocols, write a complete SKILL.md to the canonical location, and propose the junction. Ensures every new skill is ecosystem-native from creation — not a generic template dropped in.

## When to Use

- When the Sovereign describes a workflow they want to repeat and it doesn't have a skill yet
- When a new protocol, tool, or process would benefit from a reusable skill interface
- Triggered by: "build me a skill for...", "create a skill that...", "I need a skill to..."

## Steps

**Phase 1 — Interview (required before writing anything)**

Ask these questions before drafting:

1. What does this skill do in one sentence?
2. When should it activate — what triggers it or what does the Sovereign say to invoke it?
3. What are the inputs and outputs?
4. Are there any approval gates, external calls with cost, or governance constraints that apply?
5. Are there existing protocols, codices, or tools this skill should reference?

Do not begin writing SKILL.md until the Sovereign has answered all five.

**Phase 2 — Research**

Before writing, check:
- Relevant protocols in `Council Chamber/Protocols/`
- Related codices in `Council Chamber/Codices/`
- Similar existing skills for structural patterns
- CLAUDE.md Skills Registry for naming conventions and required sections

**Phase 3 — Write**

Write SKILL.md to: `Council Chamber/Skills/[Name]/SKILL.md`

Required sections in every skill:
- Purpose and trigger
- When to Use
- Steps or behavior
- Constraints (approval gates, governance limits, cost controls)
- Refinements (empty at creation — populated as mistakes occur in sessions)

Ecosystem conventions:
- No em dashes anywhere in skill content
- Positive framing — define behaviors by what they are, not what they avoid
- Constraints section is load-bearing: capture every governance gate explicitly
- Refinements section is mandatory: add it empty, leave it to accumulate organically

**Phase 4 — Propose junction**

After writing SKILL.md, propose the junction command for your platform:

Windows (PowerShell):
```powershell
New-Item -ItemType Junction -Path '.claude/skills/[Name]' -Target 'Council Chamber/Skills/[Name]'
```

Mac/Linux (Terminal — run from vault root):
```bash
ln -s "Council Chamber/Skills/[Name]" ".claude/skills/[Name]"
```

Do not create the junction without explicit approval.

**Phase 5 — Update registry**

After junction is approved and created, propose updates to:
- CLAUDE.md Skills Registry (increment count, add to active list)
- `Council Chamber/Skills/Skills Index.md` (add entry with status and tier)

## Constraints

- Never write SKILL.md without completing the Phase 1 interview
- Never auto-create junctions — always propose first
- Never skip the Refinements section
- Skills that call external APIs or write to canonical files require an explicit approval gate in their Constraints section

## Refinements

*(Empty — populated when execution mistakes occur during sessions.)*
