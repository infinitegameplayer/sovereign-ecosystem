---
paths:
  - "Council Chamber/Pending Plans/**"
  - "Vault (Archive)/Pending Plans/**"
---

# Pending Plans (scoped rule)

Moved from `.claude/CLAUDE.md` in v3.26.0 so the trust anchor stays under 200 lines. These rules fire when a session writes, approves or implements a plan, so they load when a session touches the plans folder. The anchor keeps a one-line pointer. The Pending Plan Implementation and Brainstorm skills also carry the status vocabulary.

**Pending Plan status vocabulary:** `proposed` (written, scoped, not approved) → `approved` (direction approved, decisions locked) → `ready-for-execution` (implementation plan written) → `implemented` (shipped, activity log final). Status advances one direction only. Regression means rollback or a separate new plan.

**Plan verification before handoff:** Any implementation plan that hands subagents substantive code blocks (CSS, config, component files) must be build-verified against the target environment by the plan author before dispatch. Writing code inline in the plan does not verify it compiles. If build verification is not possible, explicitly flag unverified blocks as drafts.

**Existence check on every "create" step:** Any plan step that creates an account, organization, repo, project or resource carries a named-instrument check that it does not already exist, run before the step enters the plan. A stale written line saying the thing is still to be made never outweighs an observed fact that it exists. Presence is checkable, so check it.
