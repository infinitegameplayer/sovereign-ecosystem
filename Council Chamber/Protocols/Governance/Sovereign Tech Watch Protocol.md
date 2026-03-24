---
status: active
created: 2026-03-22
ring: Governance
trigger_phrase: "Sovereign Tech Watch"
---

# Sovereign Tech Watch Protocol

## Purpose

Your ecosystem has no standing mechanism to track GitHub repos, tools or long-horizon infrastructure ideas over time. Patterns get surveyed once and then drift out of awareness as the vault evolves. This protocol creates a lightweight, repo-agnostic watch loop: a Sovereign-triggered review cadence and a general-purpose deferred items tracker. The architecture holds any number of repos — add your first when you activate it.

When a deferred item eventually gets promoted to a Pending Plan, all the context needed to act is already in the tracker. No reconstruction.

## Trigger Phrase

"Sovereign Tech Watch" in any session. Your AI interface loads this protocol.

## Cadence

Sovereign-triggered anytime. Quarterly is the default maintenance expectation for long-term hygiene. The Sovereign can activate this weekly during a build sprint or skip a quarter entirely. No hard schedule. No calendar dependency.

## What to Review

**Step 1: Watched Repos**

For each repo in the Watched Repos table below, check changelogs or recent commits since the last review date. Surface new patterns, hook types, MCP tools, skills or workflow templates added since the last check.

**Step 2: Deferred Items Tracker**

Open `Council Chamber/Tools/Support Files/sovereign-deferred-items.md`. Surface any items whose status has shifted. Some become immediately useful over time. Some become permanently irrelevant and can be retired.

## Evaluation Criteria

A pattern is a candidate for ecosystem adoption only if it meets all three:
- Lightweight: one session or less to implement
- Non-bloating: does not add governance overhead beyond its direct value
- Architecturally compatible: does not conflict with existing ecosystem protocols or the Constitution

## Output Format

A proposed update to `sovereign-deferred-items.md` with:
- Updated `last_reviewed` dates on all items reviewed
- Status changes (deferred to proposed, deferred to retired, deferred to permanent-hold) with rationale
- New items surfaced from repo changelogs or Sovereign-identified ideas since the last review

## Approval Gate

Proposed changes are presented to Sovereign before writing. No automatic status updates.

## Watched Repos

Starter list — add, remove, or replace as your ecosystem evolves.

| Repo | What it covers | Last reviewed |
|------|----------------|---------------|
| github.com/affaan-m/everything-claude-code | Claude Code hooks, skills, commands, MCP patterns, cost optimization, agentic engineering | [not yet reviewed] |
| github.com/Crosstalk-Solutions/project-nomad | Offline-first local knowledge server: Ollama (local LLM), Qdrant (vector search), Kiwix (reference library), offline maps, document OCR/RAG | [not yet reviewed] |
| github.com/kepano/obsidian-skills | Obsidian-native agent skills by vault creator (Steph Ango). Candidates worth watching: obsidian-bases, json-canvas, defuddle. MIT license. | [not yet reviewed] |
| github.com/hesreallyhim/awesome-claude-code | Curated Claude Code catalog (skills, hooks, slash commands, MCP servers, clients). CC BY-NC-ND 4.0 — reference use only, no commercial derivatives. | [not yet reviewed] |
| github.com/czlonkowski/n8n-mcp | MCP server bridging Claude and n8n workflow automation. 1,084 indexed nodes, 2,709 templates. Relevant if you adopt n8n as an automation layer. MIT license. | [not yet reviewed] |
| github.com/shanraisshan/claude-code-best-practice | Comprehensive Claude Code feature examples: commands, subagents, skills, hooks. 18,000+ stars. Updated in real time as Claude Code ships new versions. | [not yet reviewed] |

Sovereign adds rows over time as new repos are identified.
