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

## Ambassador Doctrine

This protocol operates under the [[Council Chamber/Protocols/Governance/Ambassador Doctrine]]. Sovereign Tech Watch is a pure Āsana practice. It observes, classifies, and defers. No external action is taken. Intelligence returns to the Sovereign before any adoption decision moves forward.

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
| github.com/ruvnet/ruflo | Enterprise multi-agent orchestration platform (formerly Claude Flow). Watch narrowly for extractable micro-patterns: 3-tier model cost routing, ADR-before-coding, hierarchical memory tiers (working/episodic/semantic). MIT license. | [not yet reviewed] |
| github.com/garrytan/gbrain | Personal knowledge base with pgvector semantic search. Auto-ingest from email, Calendar, Fireflies, Slack, local files. Lightweight path to semantic search over personal data. MIT license. | [not yet reviewed] |
| github.com/garrytan/gstack | 23+ Claude Code skills covering debugging, code review, planning, deployment, security. Rich source for Source Harvest skill practice. MIT license. | [not yet reviewed] |
| github.com/upstash/context7 | Live docs injection via MCP (resolve-library-id + query-docs) and CLI (ctx7). Injects up-to-date library documentation into AI context. MIT license. | [not yet reviewed] |
| supabase.com/docs/guides/getting-started/mcp | Hosted Postgres MCP server. Database operations via AI interface. Relevant if you adopt Supabase as a data layer. Supabase commercial license (hosted service). | [not yet reviewed] |
| github.com/figma/mcp-server-guide | Official Figma MCP server guide: 7 skills (implement-design, code-connect, create-design-system-rules, create-new-file, generate-design, generate-library, figma-use). Remote streamable-HTTP endpoint. MIT license. | [not yet reviewed] |
| github.com/thedotmack/claude-mem | Persistent memory plugin for Claude Code. 5-lifecycle-hook architecture (SessionStart, UserPromptSubmit, PostToolUse, PreToolUse/Read, Stop/SessionEnd) capturing tool observations to SQLite + Chroma. GPL-3.0 license. | [not yet reviewed] |
| github.com/anthropics/claude-plugins-official | Official Anthropic plugin collection for Claude Code. 30+ plugins including code review, PR toolkit, security guidance, feature development. High-value source for skill harvesting. Apache 2.0 license. | [not yet reviewed] |
| github.com/obra/superpowers | Multi-platform AI coding skills (Claude Code, Cursor, Codex, Copilot CLI, Gemini). 13 skills, 3 commands, session-start hook. Systematic Debugging pattern originated here. MIT license. Active development by Jesse Vincent. | [not yet reviewed] |
| github.com/emilkowalski/skill | Design engineering skill for Claude Code. Animation decision framework (4 gates), duration guidelines, spring animations, accessibility (prefers-reduced-motion). MIT license. Creator: Emil Kowalski (animations.dev). | [not yet reviewed] |
| github.com/pbakaus/impeccable | 18 design steering commands across 7 dimensions (typography, color, spatial, motion, interaction, responsive, UX writing). Anti-pattern detection system. 18k+ stars. Apache 2.0 license. Creator: Paul Bakaus. | [not yet reviewed] |
| github.com/Leonxlnx/taste-skill | Anti-slop frontend framework with 8 skill variants. Three-dial calibration, explicit ban system, card archetypes. MIT license. Active v2 beta. | [not yet reviewed] |

Sovereign adds rows over time as new repos are identified.
