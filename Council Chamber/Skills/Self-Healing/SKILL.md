---
name: self-healing
description: Use when an AI interface hits an error mid-task and should diagnose, fix and continue autonomously without stopping for every recoverable mistake.
status: active
tier: foundational
---

# Self-Healing

**Purpose:** Autonomous error recovery during implementation sessions. When your AI interface hits an error mid-task, diagnose the root cause, apply a fix, and continue, without stopping to surface every error to the Sovereign. Sessions no longer stall on recoverable mistakes.

## When to Use

This skill is always active during implementation sessions. It is not invoked manually. It governs how your AI handles errors throughout any session where work is being done.

Activate explicitly if you notice your AI stopping unnecessarily on routine errors: "Apply self-healing."

## Behavior

**When an error occurs:**

1. Read the full error message: do not guess or skip it
2. Identify the root cause (missing dependency, wrong path, syntax error, permission issue, etc.)
3. Apply the most direct fix
4. Confirm the fix worked: re-run the failed command or check the specific symptom directly. A fix applied is not a fix verified
5. Continue the task without surfacing to the Sovereign unless the error is governance-class (see Constraints)
6. If the same error recurs after verification, surface it: do not loop silently

**Durable record.** A recurring error (one that fails the verification step and needs a second attempt) or a governance block is worth keeping, per the Engineering Codex Section VII (Compound). In a code repo, write it to that repo's `docs/solutions/` learning corpus. Outside a code repo, name it in the session's commit body. Saying it once in chat is not a durable record: the next session needs to find it without hitting the same wall first.

**Error triage:**

| Error type | Response |
|---|---|
| Syntax / typo | Fix inline, continue |
| Missing file or directory | Create if clearly intentional, continue |
| Wrong path | Correct path, continue |
| Missing dependency (npm, etc.) | Propose install before running, cost/side-effect gate applies |
| Test failure | Diagnose, fix, re-run once; surface if still failing |
| Permission or governance block | Surface immediately, do not attempt to bypass |
| External API error | Surface immediately, do not retry without Sovereign awareness |

## Constraints

- Never attempt to auto-fix errors blocked by governance hooks (e.g. `pre-tool-approval-gate.sh`). Surface those to the Sovereign.
- Never auto-retry external API calls (image generation, transcription, CRM tools, etc.). Each call has cost or side effects.
- Never silently loop on a fix that is not working. One attempt, then surface.
- Structural file operations (move, rename, delete canonical files) that produce errors must always surface. Approval gates apply to the operation, not just the error.

## Refinements

- [2026-03-23] Self-healing must not attempt to auto-fix errors that are blocked by the pre-tool-approval-gate. Surface those to the Sovereign instead.
- [2026-10-02] A fix was applied and the task moved on with no check that the symptom was gone. Added the verification beat between apply and continue, and the durable-record rule so a recurring error lives somewhere other than the transcript.

> Also installs standalone from https://www.infinitegameos.io/skills/self-healing (dual-distribution: this copy lives in your vault, the public plugin updates independently).
