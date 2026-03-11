---
name: Security Check
description: Run a lightweight security audit using the Sovereign Ecosystem Security note and Security Flywheel; include online update checks.
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
3. Reconvene: synthesize into a single audit summary — findings by severity, cross-pass patterns elevated one tier if appearing in multiple passes, top 3 proposed remediations.
4. Check for security updates online (NIST CSF, CIS Controls, MITRE ATT&CK). Summarize relevant deltas only.
5. Propose any adjustments as approval-gated deltas; do not execute changes.
6. Record findings in a summary note or session log as approved.

## Triggers
- Manual request
- Meta-Governance Audit cycle

## Planning Mode Rule
- Execution is not authorized without explicit approval.
