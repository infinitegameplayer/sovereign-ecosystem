---
name: Session Closeout
description: Guide a lightweight closeout for foundational sessions.
status: draft
tier: foundational
contrast_not:
false_twins:
anti_patterns:
boundary_conditions:
clarity_triggers:
---

# Session Closeout Skill

Purpose: Guide a lightweight closeout for foundational sessions.
Trigger: After governance-level changes or system reorganizations.
Inputs: Session scope, decisions, risks, next tests, reconciliation sweep results.
Outputs: Session log entry, AI Interface Change Log entry, reconciliation summary, optional Pending Plans.
Status: draft
Related Protocols/Codices: [[Council Chamber/Protocols/Session/Session Closeout Protocol]], [[Council Chamber/Protocols/AI Interface/AI Interface Change Log Protocol]]

## Steps
1. Draft session summary using the Session Summary template.
2. Capture decisions, risks and next tests.
3. Fire 3 workers simultaneously. Hold all results for unified approval gate.
   - **Worker A — Pending Plan reconciliation:** Scan active PendingPlans, identify matches and advances, draft breadcrumb updates (activity, applicability, partial implementation, evidence, reconciliation notes) — no status changes
   - **Worker B — Inadvertent completions sweep:** Surface quests, experiments and intake items that appear complete based on session scope
   - **Worker C — Inbox + consult closeout:** Process deferred activation recommendations, check for archived consults
4. Unified approval gate: present all three worker proposals as a single organized list. Sovereign approves, adjusts or declines each item before any execution.
5. Execute approved changes: write breadcrumb updates, mark completions, route consults as approved.
6. Create session log in `Vault (Archive)/Session Logs/` and add AI Interface Change Log entry, including a breadcrumb writeback summary for PendingPlans.
   - Date field: YYYY-MM-DD for single sessions; YYYY-MM-DD-a / -b / -c for same-day multiples.
   - Notes field: weave subtle humor drawn from your Humor Codex (parenthetical asides, ironic quotation marks — in the voice and style your codex encodes) and meta-awareness observations (pattern callbacks, architectural echoes). Neither announced.
   - Execution-density check: flag in Notes if humor or meta-awareness was crowded out during heavy-execution work.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Include contrast fields in frontmatter for foundational updates.
- Store deeper contrast reasoning in the footer block when needed.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- Add contrast notes here if needed.
-->
