---
name: brainstorm
description: Use before any creative or build work in the ecosystem. Turns an idea into a design the Sovereign has approved, through one-question-at-a-time dialogue, a three-solution fork and a written Pending Plan. Gate-bound: no code, no scaffolding, no implementation skill until the design is approved.
status: active
tier: foundational
---

# Brainstorm Skill

Purpose: Turn an idea into a design the Sovereign has approved, before a line of anything gets built. The output is a Pending Plan, not a spec file. The discipline is the gate: understanding earns the right to build.

Trigger: any creative or build work. A new feature, a new product surface, a new skill, a new campaign, a change of behavior in something that already runs. Phrases like "let's build", "I want to add", "what if we", "I've been thinking about".

Lineage: harvested at source level from a widely-used open brainstorming skill pattern and rebuilt on this ecosystem's own governance. What was kept: the hard gate, the one-question rhythm, the approach fork, the scope-decomposition check, the self-review pass. What was changed: the design doc lands as a Pending Plan using this ecosystem's own object model, the fork follows the Three Solutions Rule, and the terminal state is the Pending Plan lifecycle rather than an external planning skill.

## The Gate

**No code, no scaffolding, no file creation, no implementation skill until the Sovereign has approved a design.** This holds for every project regardless of how simple it looks. Simple is where unexamined assumptions do their best work. A design for a truly small thing can be three sentences. It still gets presented and approved.

The gate is this ecosystem's own Plan, Consent, Execute discipline (Constitution Art. IV Sec. 1) wearing working clothes.

## Inputs

- The idea, in whatever shape it arrives.
- Whether a Pending Plan already exists for the territory.
- The Sovereign's available depth: a quick fork or a full design pass.

## Steps

**Step 1. Read the ground first.** Before the first question, look. Existing Pending Plans, the relevant codex, the live code or surface, recent commits. Arrive with context so the questions are worth the Sovereign's attention. Grep and Glob to locate, scoped Read for what matters.

**Step 2. Scope check before detail.** If the idea holds several independent subsystems, name that immediately and decompose before refining anything. A design pass on a project that needed splitting is wasted work. Each piece then earns its own design and its own plan.

**Step 3. Ask one question at a time.** One question per message. Purpose, constraints, what success looks like, what it must never do. Favor open conversation over multiple-choice question boxes; when the subject is a clean fork between real options, a short lettered list is fine. When the subject is naming, vocabulary or felt resonance, switch to open questions with a large candidate list rather than a narrow multiple choice. Let the Sovereign calibrate by what actually lands for them, not by what is easiest to click.

**Step 4. Three solutions, one recommendation.** Present three approaches with their trade-offs, lead with the recommended one and say why (the Three Solutions Rule: [[Council Chamber/Protocols/Governance/Three Solutions Rule]]). The recommendation is a position, not a survey.

**Step 5. Present the design in sections.** Scale each section to its complexity: a sentence when it is simple, a few paragraphs when it is not. Ask after each section whether it holds. Cover architecture, the pieces and their boundaries, how the data moves, what happens when it fails, how it gets verified. Go back and clarify whenever something reads thin.

**Step 6. Check it against your own durability bar.** Before the design is called approved, test it against whatever standard your ecosystem holds for quality, differentiation or long-term maintainability. If you keep a codex or checklist for that test, apply it here. A design that quietly dilutes what makes your build distinctive, or trades a durable pattern for a shortcut, needs another pass before it is approved.

**Step 7. Write it as a Pending Plan.** The canonical artifact is a Pending Plan, never a spec file in a code directory. When a plan already exists for the territory, update it in place: locked architecture, sequencing, and an activity log entry. When none exists, create one from the Pending Plan object template. Status advances to `approved` only with Sovereign consent, and `approved` means direction approved and decisions locked, not execution authorized.

**Step 8. Self-review with fresh eyes.** Sweep the written plan before handing it back:

- Placeholders. Any "TBD", any vague requirement, any section that trails off. Fix them.
- Contradictions. Does the architecture match what the features describe?
- Scope. Is this one implementation pass, or does it still need splitting?
- Ambiguity. Could a requirement be read two ways? Pick one and say it plainly.
- Expression. Em dashes, Oxford commas, banned words, per your Writing Style Codex.

Fix inline and move on. No second review of the review.

**Step 9. Hand the plan to the Sovereign.** State the plan's vault path plainly and ask them to read it before implementation planning begins. Changes requested means back to Step 7.

**Step 10. Terminal state: the plan lifecycle.** The only next move is the Pending Plan lifecycle: `approved` to `ready-for-execution` (implementation plan written) to execution. Invoke no implementation skill from inside a brainstorm. If your ecosystem has an adversarial pre-build pass, run it before a large build begins.

## Visual Preview

When the design turns on something visual (a layout, a card, competing looks), build an HTML preview and open it locally rather than describing it in prose. Offer it once, in its own message, and only when the question is genuinely visual. A question about a screen is not automatically a visual question: "what should this flow feel like" is conceptual and belongs in conversation, "which of these three layouts" belongs in the browser.

## Key Principles

- One question at a time. Depth comes from sequence, not from volume.
- Three solutions, one recommendation, real trade-offs.
- Cut what the idea does not need. An unbuilt feature costs nothing to remove.
- Approval is per section, not one verdict at the end.
- The design is done when the Sovereign says it is done, not when the drafting feels complete.
- Keep some life in the pass. A brainstorm that reads like a requirements document has already drifted.

## Refinements

%%
Date-stamped entries of mistakes, calibration notes, and rules to prevent recurrence.
%%

**Skill created from a source harvest.** A widely-circulated open `brainstorming` skill was harvested at source level rather than adopted wholesale. Its spine held (hard gate, one question at a time, approach fork, scope decomposition, self-review), and its terminal state did not: it pointed at a spec-file convention and a separate writing-plans skill, both of which this ecosystem already answers with the Pending Plan lifecycle. The three asking-discipline rules (conversation over boxes, plain-letter labels, open lists for naming work) were the largest local addition, along with the durability-bar gate at Step 6.
