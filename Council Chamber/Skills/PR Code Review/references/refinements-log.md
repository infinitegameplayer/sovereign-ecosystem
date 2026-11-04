---
status: active
parent: "[[Council Chamber/Skills/PR Code Review/SKILL]]"
---

# Refinements Log

**Anchored confidence, quote gate, validator pass.** Harvested at source level from the EveryInc/compound-engineering-plugin (`ce-code-review`).

The harvest surfaced a live defect in this skill in its earlier form. An earlier rubric already produced anchored values (0, 25, 50, 75, 100), but the filter step used to threshold at 80. Every anchor-75 finding, defined in the rubric itself as "highly confident, double-checked, will be hit in practice," was silently dropped. A finding that squeaked through at 85 was a model ignoring the scale it was handed. The skill had been quietly discarding its best-calibrated tier and reporting clean runs.

Three changes close it. The floor moves to anchor 75 and non-anchor values are now invalid rather than rounded. The **quote-the-line gate** requires a verbatim `file:line` for any claim at 75 or above, enforced twice (as a reviewer instruction, and mechanically at merge, where an unquoted 75 is demoted to 50). The **validator pass** gives every surviving finding a fresh Sonnet subagent told it has no commitment to the finding, answering three questions: is it real, did this diff introduce it, is it not handled elsewhere. Conservative bias, and every rejection's reason is recorded so the loss is auditable.

The general lesson: **false precision.** A threshold set against a continuous scale, applied to output from an anchored scale, drops a whole tier and looks like it is working. Worth naming explicitly wherever your project tracks engineering failure modes.

**Validated needs an artifact, and a lens may return nothing.** A fresh-context validator still shares the finder's priors, so it can agree with a finding for the same wrong reason the finder raised it. A validation should rest on something deterministic wherever one can exist: a quoted line at its location, a command output or a reproduced failure. Step 5c's validator brief therefore gains question 4, and a reading that produces no artifact returns `validated: false`. The same logic frees the lenses: a lens that finds nothing returns "No findings" as a complete output, because a lens pushed to produce something produces false positives. This follows from the measured precision of language-model reviewers on their own, which the template does not ship the research to show, so treat the rule as a cautious default and adjust it against your own run summaries.
