---
status: active
created: 2026-03-08
---

# Operational Hygiene Checklist

Purpose: Lightweight maintenance checks that support governance without requiring a full restructuring session.

## Use Pattern
- Best used during Meta-Governance Audit, weekly or biweekly hygiene reviews, or whenever the system feels a little bloated.
- Treat this as a review surface, not an always-on automation surface.

## Checks
- Change log hygiene
  - confirm the active AI interface change log stays easy to scan
- Pending Plans index sync
  - confirm `Council Chamber/Pending Plans/Index.md` reflects the live queue
- Protocol-to-reality drift
  - confirm helper notes and setup docs still match actual workflows
- Control-surface drift
  - confirm Sovereign Command and starter logs still fit their intended role

## Security-Adjacent Hygiene
- Run the Security Check skill during Meta-Governance Audit or when the system surface changes materially.
- Good triggers:
  - new integrations
  - new automation scripts or scheduled tasks
  - changes to token or secret handling

## Rule
- Prefer a single small manual fix over premature automation.
- If the same maintenance issue repeats often, refine the protocol or add a lightweight helper.