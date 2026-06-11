---
name: self-healing
description: Use when an AI interface hits an error mid-task and should diagnose, fix and continue autonomously without stopping for every recoverable mistake.
status: active
tier: foundational
---

# Self-Healing

**Purpose:** Autonomous error recovery during implementation sessions. When your AI interface hits an error mid-task, diagnose the root cause, apply a fix, and continue — without stopping to surface every error to the Sovereign. Sessions no longer stall on recoverable mistakes.

## When to Use

This skill is always active during implementation sessions. It is not invoked manually — it governs how your AI handles errors throughout any session where work is being done.

Activate explicitly if you notice your AI stopping unnecessarily on routine errors: "Apply self-healing."

## Behavior

**When an error occurs:**

1. Read the full error message — do not guess or skip it
2. Identify the root cause (missing dependency, wrong path, syntax error, permission issue, etc.)
3. Apply the most direct fix
4. Continue the task without surfacing to the Sovereign unless the error is governance-class (see Constraints)
5. If the same error recurs after one fix attempt, surface it — do not loop silently

**Error triage:**

| Error type | Response |
|---|---|
| Syntax / typo | Fix inline, continue |
| Missing file or directory | Create if clearly intentional, continue |
| Wrong path | Correct path, continue |
| Missing dependency (npm, etc.) | Propose install before running — cost/side-effect gate applies |
| Test failure | Diagnose, fix, re-run once; surface if still failing |
| Permission or governance block | Surface immediately — do not attempt to bypass |
| External API error | Surface immediately — do not retry without Sovereign awareness |

## Constraints

- Never attempt to auto-fix errors blocked by governance hooks (e.g. `pre-tool-approval-gate.sh`). Surface those to the Sovereign.
- Never auto-retry external API calls (image generation, transcription, CRM tools, etc.) — each call has cost or side effects.
- Never silently loop on a fix that is not working. One attempt, then surface.
- Structural file operations (move, rename, delete canonical files) that produce errors must always surface — approval gates apply to the operation, not just the error.

## Refinements

- [2026-03-23] Self-healing must not attempt to auto-fix errors that are blocked by the pre-tool-approval-gate. Surface those to the Sovereign instead.
