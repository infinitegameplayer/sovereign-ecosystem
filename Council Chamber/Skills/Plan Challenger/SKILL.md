---
name: plan-challenger
description: Adversarial pre-build pass that challenges a Pending Plan before execution begins — five angles, one verdict.
status: active
version: 1.0
---

# Plan Challenger Skill

Purpose: Surface the hard questions before a Pending Plan goes into execution. Not a veto. A mirror. Five structured angles against the plan, with a one-line verdict at the end.
Trigger: Sovereign invokes "Plan Challenger" with a plan name or plan content. Also surfaces as a one-line opt-in inside Pending Plan Implementation after the Pre-Execution Checklist.
Inputs: Pending Plan content (name to locate, or paste directly).
Outputs: Five-angle challenge report, taste-decision flags for near-call questions, one-line verdict.
Status: active
Related Protocols/Codices: [[Council Chamber/Skills/Pending Plan Implementation/SKILL.md]], [[Council Chamber/Codices/Challenge and Illumination Codex]]

## Steps

### Step 1 — Load the Plan

Read the target Pending Plan. If a name was given, locate it in `Council Chamber/Pending Plans/`. If content was pasted, use it directly.

Confirm the plan title and intent back to the Sovereign in one sentence before proceeding.

### Step 2 — Five-Angle Challenge

Run each angle in sequence. Each angle produces one to three sharp observations or questions — not a list of everything that could go wrong. Surface what matters most.

**Angle 1 — Strategic Fit**
Is this the right problem for this moment? What else is actively competing for this slot? Does this plan advance the Sovereign's current primary arc, or does it branch sideways?

**Angle 2 — Timing**
Why now? What changes if this is deferred two weeks? What external factors or internal pressures are driving the timing? Is the urgency real or inherited from habit?

**Angle 3 — Baked-In Assumptions**
What must be true for this plan to succeed that has not been verified? Name the assumptions explicitly. Rate the risk of each: low (safe to proceed), medium (worth a quick check), high (should be resolved before execution begins).

**Angle 4 — Architectural Risk**
What is the most likely way this plan breaks or creates debt? What part of the implementation is most fragile? What does success look like on paper but create pain in six months?

**Angle 5 — Opportunity Cost**
What are we not doing by doing this? What capability, relationship, or momentum is being paused or sacrificed to run this plan now?

### Step 3 — Taste-Decision Surfacing

After the five angles, scan for near-call questions — places where two framings are genuinely close, scope is borderline, or a reasonable case exists for a different direction. Surface these explicitly rather than collapsing to one answer.

Format: "Close call — [question]. Both [framing A] and [framing B] are defensible. Sovereign decides."

Surface only genuine near-calls. Do not manufacture uncertainty where clarity exists.

### Step 4 — Verdict

One line. No hedging.

- **Proceed** — No blocking concerns. Execute as planned.
- **Revise [specific element]** — One thing to change before execution. Name it.
- **Pause [specific reason]** — An assumption or risk needs resolution first. Name it.

The verdict is a recommendation, not a gate. The Sovereign decides.

## Confidence Scoring (Optional)

For high-stakes plans, assign a confidence score (0-100) to each finding from the five angles. This converts the challenge from a list of objections to a weighted list where severity is explicit.

Use this rubric (pass verbatim to any sub-agent doing the scoring):

> 0: Not confident at all. This concern does not hold up to scrutiny or is already addressed in the plan.
>
> 25: Somewhat confident. This might be a real concern but may also resolve on closer inspection. Worth noting, not blocking.
>
> 50: Moderately confident. This is a real concern but a minor one. It would not change the execution path.
>
> 75: Highly confident. This concern is very likely real and will affect the plan in practice. The existing approach is insufficient without addressing it.
>
> 100: Absolutely certain. This concern is definitely real, confirmed by evidence in the plan, and will block or break execution if unresolved.

Filter: any finding scored below 50 is a note, not a challenge. Any finding scored 75 or above warrants a named action in the verdict.

This scoring layer is optional. Use it when the five angles produce many findings and the Sovereign needs a ranked view before deciding. On straightforward plans, qualitative assessment is sufficient.

---

## Constraints

- Does not implement anything.
- Does not edit the plan or propose rewrites.
- Does not replace Sovereign judgment.
- Does not run in plan mode (this skill IS the challenge layer; it does not spawn another one).
- Depth over breadth. Three sharp observations beat ten generic ones.

## Integration with Pending Plan Implementation

After the Pre-Execution Checklist in that skill, a one-line opt-in reads: "Challenge warranted?" If yes, invoke this skill with the plan content. Work through findings. Then return to Pending Plan Implementation Step 1. If no, proceed immediately.

## Planning Mode Rule

Status is active. Execution authorized on demand. No approval gate required — the Sovereign's invocation is the gate.

## Refinements

_Date-stamped entries for edge cases and rule corrections that emerge in practice._
