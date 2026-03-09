---
status: active
created:
owner:
decision_by:           # optional - gate date for a go/no-go decision
end_date:              # optional - when the experiment window closes
closed:                # filled at closeout: YYYY-MM-DD
outcome:               # filled at closeout: success criteria met / failure criteria met / inconclusive
links:
ring:
---

# Experiment Title

#experiment

## Intent

What is this experiment testing? What question does it answer?

## Hypothesis

If [condition], then [outcome] because [reasoning].

## Parameters

- Specific, bounded constraints that define what is and isn't allowed.
- Include resource limits, method constraints, time gates.

## Success Criteria

- Specific, observable conditions that confirm the hypothesis.

## Failure Criteria

- Specific, observable conditions that confirm the hypothesis failed.

## Context

Why now? What prompted this? What is the broader meaning or alignment?

## North Star Alignment

- Calibration Field:
- Horizon resonance:
- Reference: [[Library/North Star]]

## Notes

Log meaningful signals, observations or synchronicities as they occur.

---

## Outcome

<!-- Fill at closeout. State which criteria were met and what actually happened. -->

## Reflection

<!-- Fill at closeout. What did this reveal? What shifted? What would you do differently? -->

---

## Status Rules
- active: in progress
- complete: criteria met or failed; ready for archival scan
- archived: in Vault

## Closeout Checklist
- [ ] Set `status: complete`
- [ ] Fill `closed: YYYY-MM-DD`
- [ ] Fill `outcome:` frontmatter (success criteria met / failure criteria met / inconclusive)
- [ ] Write `## Outcome` section - factual summary of what happened
- [ ] Write `## Reflection` section - personal meaning, learning, what shifted

## Planning Mode Rule
- If status is proposed or draft, execution is not authorized.
