---
status: active
version: 1.0
tier: foundational
module: Expression Module
purpose: Full workflow for drafting a new long-form article — platform-agnostic skeleton
links:
  - "[[Council Chamber/Protocols/Expression/Expression Drafting Protocol]]"
  - "[[Council Chamber/Protocols/AI Interface/AI Interface Activation Protocol]]"
  - "Expression writing-style codex (if installed)"
---

# Article Drafting Protocol

Purpose: Full workflow for drafting a new long-form article for publication. Platform-agnostic. Covers ideation through publication readiness. Sovereign adapts platform-specific steps to their chosen channel.

Scope: Long-form articles in `Scriptorium/Articles/`. Social posts are handled in a separate session after the article publishes.

---

## Trigger

Use when the Sovereign wants to create a new article from lived experience, current alive energy or an emergent pattern worth writing about.

---

## Steps

### 1. {{AI_INTERFACE_NAME}} Activation

Run the {{AI_INTERFACE_NAME}} Activation Protocol to orient the session.

### 2. Pattern Analysis

Read recent session history to surface what is alive in the Sovereign Ecosystem:
- AI Interface Change Log (past 1-2 weeks of sessions)
- Continuity Log
- Active quests and experiments
- Recent coaching transcripts if directly relevant

Goal: identify emergent themes, state shifts, insight patterns and alive energy worth writing about.

### 3. Thread Brainstorm

Surface 3-4 article thread options, each with:
- Thread label (short title or concept name)
- One-paragraph exploration of what the article could be
- Why now — connection to current alive energy or pattern

Present all options. Await Sovereign's selection.

### 4. Voice Anchoring

**First article only:** Read the 3 most recent published articles from the archive to anchor the voice baseline. This is a one-time calibration step.

**Ongoing:** If your Writing Style Codex is installed, reference `[[Council Chamber/Codices/Expression/Writing Style Codex]]` directly, particularly the Rolling Pattern Signals section. If not, use the current article set as the working voice baseline until that codex exists.

### 5. Four-Engagement Sourcing

Run 4 sequential engagements — one question at a time, await full response before proceeding. Do not draft until all 4 are complete.

**Engagement 1 — The Felt Experience:** What did it feel like? The texture of the shift, the moment it became different.

**Engagement 2 — The Friction or Limit:** What was the gap before? What felt disjointed, incomplete or held back?

**Engagement 3 — The Self as Creator:** How did you experience yourself differently as you moved through this? What changed in how you showed up?

**Engagement 4 — The Invitation:** What would you want to pass on? The insight, the permission, the invitation distilled to its essence.

After each response: hold the thread. Take notes. Do not comment in ways that shape the next answer before it arrives. After all 4: synthesize, identify the strongest verbatim phrases, note the arc.

**Verbatim rule:** The Sovereign's exact language is the "core" of the article. Use it as the spine. Build the structure around it, not over it.

### 6. Structure and Title

Propose an article structure (section titles or narrative arc) based on the sourced material.

Lock the title before drafting. Title should emerge from the material, not precede it.

Await Sovereign approval before proceeding.

### 7. Draft

Write the article using the sourced material as the core.

Voice calibration:
- If installed: `[[Council Chamber/Codices/Expression/Writing Style Codex]]`
- Your Taste Profile Codex (if configured — see Personalization Module)

**Platform tags (if applicable):** Before drafting, confirm whether your publishing platform uses tags or categories to organize content for readers. If yes, propose 3-5 tags. Await Sovereign approval, then include the approved tags in the article frontmatter under `platform_tags`.

Save to `Scriptorium/Articles/Article - [Title].md`.

Naming convention: `Article - [Title].md` — no "Artifact" prefix.

**Single source file only.** No platform-specific duplicate sections. Handle platform variations at publish time.

Do not paste the draft in chat. Save directly to the file.

### 8. Sovereign Edits in Obsidian

Sovereign edits the draft directly in Obsidian. No suggestions from {{AI_INTERFACE_NAME}} until the Sovereign has reviewed and edited first.

### 9. Edit Analysis

After Sovereign confirms edits are complete:
- Read the final file
- Compare to the drafted version — identify editorial decisions and voice patterns
- Extract learnings: punctuation choices, metaphor preferences, tone calibration, structural adjustments
- If installed, propose additions to Writing Style Codex when patterns are new or refine existing sections
- If installed and approved, update Writing Style Codex with those additions

### 10. Asset Brief (Optional)

If your publishing workflow includes visual assets (images, graphics), generate an asset concept brief now. Document it under `## Asset Brief` in the article note. Specific execution depends on your tools and workflow.

### 11. Pre-Publish QA

If the Writing Style Codex is installed, run its Pre-Publish QA checklist and flag any issues before marking ready. If it is not installed yet, run a light voice-consistency pass instead.

**On pass:** Update frontmatter to `status: complete`

### 12. Distribution Routing

Publish to your chosen platform(s). The Sovereign decides their distribution workflow based on the platforms they use.

After publishing: Update frontmatter to `distribution_state: published` — this is the trigger for the social breakdown workflow.

### 13. Social Posts (Separate Session)

Social posts are handled in a dedicated session after the article publishes.

---

## File Naming Convention

Articles in `Scriptorium/Articles/` use:

```
Article - [Title].md
```

No "Artifact" prefix. No channel suffix. Single source file per article.

### Article Frontmatter Template

```yaml
---
status: draft
created: YYYY-MM-DD
format: article
distribution_state: draft
title: "[Title]"
platform_tags: []
links:
  - "Expression writing-style codex (if installed)"
voice_source: [source description]
revision_round: 0
---
```

---

## Codex Application

Apply these codices during drafting and review when they are installed:
- If installed: `[[Council Chamber/Codices/Expression/Writing Style Codex]]`
- Your Taste Profile Codex (if configured — see Personalization Module)

---

## Contrast Layer Integration (Mandatory)

Tier: 1 (foundational).
- Frontmatter contrast fields required.
- Footer internal contrast block required.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- This protocol governs article drafting from ideation through publication readiness only.
- Social post creation is explicitly out of scope.
- Voice anchoring via archive scan is a one-time step, not a recurring requirement.
- The "verbatim rule" applies to source language as the core spine — not a prohibition on {{AI_INTERFACE_NAME}} structure or framing.
-->
