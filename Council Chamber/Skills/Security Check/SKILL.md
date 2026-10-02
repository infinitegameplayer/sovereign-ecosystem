---
name: security-check
description: Use when running a lightweight monthly or on-demand security audit across the ecosystem with online update checks and approval-gated remediation proposals.
status: active
tier: foundational
contrast_not:
false_twins:
anti_patterns:
boundary_conditions:
clarity_triggers:
---

# Security Check Skill

Purpose: Run a monthly-ish or on-demand security audit, propose improvements and log findings without bloating governance.

Inputs:
- Trigger (manual or Meta-Governance Audit)
- Current Sovereign Ecosystem Security note
- Security Flywheel Protocol

Outputs:
- Security audit summary (proposal-only)
- Identified risks or drift (proposal-only)
- Optional governance delta proposals (approval-gated)

## Steps
1. Load `Council Chamber/Governance/Sovereign Ecosystem Security.md` and `Council Chamber/Protocols/Flywheels/Security Flywheel Protocol.md`.
2. Fire 5 passes simultaneously. Hold all results before presenting.
   - **Pass A (Surface):** Exposed data, public-facing artifacts, external access vectors
   - **Pass B (Structural):** Governance integrity, link validity, canonical container drift
   - **Pass C (Adversarial):** Misuse scenarios, trust boundary stress-tests, escalation paths
   - **Pass D (Resilience):** Backup state, recovery paths, single points of failure
   - **Pass E (Continuity):** Protocol coverage, skill coverage, gap detection
3. **Verify before synthesis.** The orchestrator checks each reported finding against live state before it counts. Open the file, run the command or read the configuration the finding names, and record what was observed. A finding is `verified` when live state shows it, `unverified` when it could not be checked and `rejected` when live state contradicts it. Rejected findings drop, with the reason recorded. A worker's report is a claim, not an observation.
4. Reconvene: synthesize into a single audit summary, findings by severity, cross-pass patterns, top 3 proposed remediations.
   - **Cross-pass elevation:** a finding appearing in 2 or more passes is elevated one severity tier, because patterns across passes surface risks that single passes underweight. Elevation never bypasses the evidence gate: a finding elevates on agreement only when at least one contributing pass survived the verification in step 3. Passes on the same model tier agreeing is corroboration that a finding is worth checking. It is not proof the finding is real.
5. Check for security updates online (NIST CSF, CIS Controls, MITRE ATT&CK). Summarize relevant deltas only.
6. Propose any adjustments as approval-gated deltas; do not execute changes.
7. Record findings in a summary note or session log as approved.

## Model Routing

Set `model` explicitly on every subagent dispatch.
- Passes A, B, D and E (pattern-deterministic scans): Haiku
- Pass C (adversarial misuse scenarios and escalation paths): Sonnet. Creative adversarial reasoning is not a deterministic scan, and Haiku undersells it.
- Verification and synthesis: stay in the orchestrator.

A worker that surfaces genuine ambiguity, an architectural concern rather than a deterministic check, is re-dispatched as Sonnet.

## Triggers
- Manual request
- Meta-Governance Audit cycle

## Planning Mode Rule
- Execution is not authorized without explicit approval.

## Refinements

- Consensus laundering fix. The cross-pass elevation rule raised severity on agreement alone, so several passes on one model tier agreeing outran the evidence they carried. Elevation now requires at least one contributing pass to have survived the orchestrator's verification against live state. Agreement still corroborates that a finding is worth checking. It stops standing in for proof.
