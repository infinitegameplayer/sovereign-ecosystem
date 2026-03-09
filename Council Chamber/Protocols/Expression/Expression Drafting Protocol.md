---
status: draft
version: 0.1
tier: foundational
module: Expression Module
contrast_not:
  - Universal Vault Flywheel archival protocol
  - General creative brainstorming without artifact intent
false_twins:
  - Inbox intake processing
  - Quest execution plan drafting
anti_patterns:
  - Drafting without objective or audience
  - Publishing-ready assumptions from early drafts
  - Unlinked drafts with no source provenance
boundary_conditions:
  - v1 supports articles, social posts/threads and strategy/collaboration memos
  - v1 excludes contracts and legal drafting workflows
  - Expression folder is non-archival
clarity_triggers:
  - Draft format unclear
  - Channel unclear
  - Source material missing or weak
---

# Expression Drafting Protocol

Purpose: Govern drafting and refinement of Expression artifacts inside the Expression folder before archival handoff.

Scope: `Scriptorium/` drafts for article, social and strategy formats.

## Principles
- The Expression folder is for creation and refinement, not archival storage.
- Expression codices guide quality and voice; templates guide structure.
- Source linkage is preserved to maintain artifact provenance.
- Completion status reflects archival readiness, not publication completion.

## Entry Triggers
Drafting may begin from:
- Spark in `Inbox/`
- Quest requirement in `Explorations/Quests/`
- Transcript or reference material in `Library/`
- Strategy collaboration brief
- Existing artifact rewrite or derivative output

## Required Draft Metadata (v1)
Use Artifact frontmatter plus Expression fields:
- `format`
- `objective`
- `audience`
- `channel`
- `voice_codices`

Optional:
- `derived_from`
- `quest`
- `cta`
- `distribution_state`
- `revision_round`

## Shared Draft Backbone (Loose Playbook)
1. Intake / Briefing
   - Confirm source, objective, audience and channel.
2. Angle / Intent
   - Define thesis, promise or decision-support purpose.
3. Draft
   - Produce first pass in chosen format.
4. Refinement
   - Improve clarity, structure and voice alignment.
5. Quality Gate
   - Run checks from your Expression Quality Codex (if configured).
6. Connection Pass (optional)
   - If the article has a natural connection to a product, service or invitation relevant to your audience, consider a single closing line or P.S. that makes that connection. Keep it woven in, not bolted on. Only include if genuinely relevant.
7. Completion + Routing
   - Mark `status: complete` when ready for flywheel handoff.

Formats may merge or skip steps when clarity is preserved.

## Format Lanes (v1)
- `Scriptorium/Articles/`
- `Scriptorium/Social/`
- `Scriptorium/Strategy/`
- `Scriptorium/Workbench/` for mixed or exploratory draft packets

## Format-Specific Protocols
- Article drafting (long-form): `[[Council Chamber/Protocols/Expression/Article Drafting Protocol]]`

## Template Use
- Prefer Expression format templates in `Council Chamber/Templates/Object Templates/`.
- Domain framing templates live in `Council Chamber/Templates/Domain Templates/Expression/`.
- Generic `Artifact` template is allowed for unusual formats.

## Codex Application (Default)
Apply your configured expression codices when they are installed. Recommended starting set:
- If installed: `[[Council Chamber/Codices/Expression/Writing Style Codex]]`
- Your Taste Profile Codex (if configured - see Personalization Module)

## Status and Routing Rules
- `draft` or `active`: in-progress in Expression folder
- `complete`: eligible for archival scan and approval
- `archived`: only after Vault descent

Archive handoff is governed by `[[Council Chamber/Protocols/Flywheels/Universal Vault Flywheel Protocol]]`.

## Vault Subfolder Routing (Expression)
When archiving Expression artifacts, route to subfolders under `Vault (Archive)/Domains/Expression/`:
- Articles -> `Articles/`
- Social -> `Social/`
- Strategy / collaboration memo -> `Strategy/`
- Notes / working reference -> `Notes/`
- Anything else -> `Other/`

## Legal Boundary (v1)
Contracts and legal drafting workflows are excluded from the Expression folder v1.

If a request is legal-adjacent:
- capture the intent and structure as a strategy or collaboration memo if appropriate, or
- route to Legal domain artifacts/protocols for separate handling.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Frontmatter contrast fields required.
- Footer internal contrast block required.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- This protocol governs pre-archive drafting flow only.
- Keep legal exclusion explicit until approval gates and disclaimers are codified.
-->



