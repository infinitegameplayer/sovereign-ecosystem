---
version: 0.1
---

# Meta-Governance Audit

Purpose: Periodically evaluate Sovereign Ecosystem system integrity without over-engineering.

## Scope Checklist
- Constitution integrity
- Codex coherence
- Skills and automation health
- North Star subsystem (protocol + flywheel + logs)
- {{AI_INTERFACE_NAME}} behavior alignment
- Archive structure and hygiene
- Domain balance
- Security posture (see `[[Council Chamber/Governance/Sovereign Ecosystem Security]]`)

## Inputs
- `[[Council Chamber/Protocols/Session/Session Closeout Protocol]]`
- `Council Chamber/AI Interface/AI Interface Change Log.md`
- `Vault (Archive)/North Star Logs/`
- `Vault (Archive)/Session Logs/`
- `[[Council Chamber/Protocols/Flywheels/Security Flywheel Protocol]]`

Note: Git is the authoritative ledger. AI Interface Change Log is a human-readable summary.

## Audit Questions
- Is the system energizing or heavy?
- Are loops producing clarity and action?
- Where is drift persistent?
- Which protocols are stale or overbuilt?

## Operational Hygiene
- Review low-frequency maintenance items without turning the audit into a heavy administrative ritual.
- Use `[[Council Chamber/Checklists/Operational Hygiene Checklist]]` as the lightweight execution surface.
- Suggested checks:
  - Is `Council Chamber/AI Interface/AI Interface Change Log.md` above its rollover threshold?
  - Is `Council Chamber/Pending Plans/Index.md` in sync with current Pending Plan notes?
  - Are rolling operational logs staying within their intended window?
  - Do automation support notes still match current behavior?
- Default stance:
  - Detect during Meta-Governance Audit.
  - Execute with one-off helper scripts only when needed.
  - Avoid adding recurring automation unless a task becomes genuinely annoying or repeatedly missed.

## Security Hygiene
- Keep security review light unless a specific incident, risk or major integration change justifies a deeper pass.
- During Meta-Governance Audit, confirm whether a Security Check should be run now.
- Common triggers:
  - New MCPs, plugins, bots or external integrations
  - New automation scripts, scheduled tasks or token-handling changes
  - A recent period of meaningful system restructuring
- Primary ref:
  - `[[Council Chamber/Checklists/Operational Hygiene Checklist]]`
- Deeper review path:
  - Use the Security Check skill when the trigger is real, rather than forcing it into every audit cycle.

## Outcomes
- System coherent (no change)
- Minor structural adjustment
- Architectural revision (rare)

## Safeguards
- Do not add complexity without removing equal weight elsewhere.
- Avoid audit fatigue.
- Keep tone strategic and light.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Include contrast fields in frontmatter for foundational updates.
- Store deeper contrast reasoning in the footer block when needed.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- Add contrast notes here if needed.
-->
