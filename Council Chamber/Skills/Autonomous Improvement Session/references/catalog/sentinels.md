---
status: active
created: 2026-10-16
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# Step 0 due scan

### T2-20: Security audit staleness sentinel

**Verb:** Reports.

**Execution:**
1. Read the frontmatter `last_run` date from your ecosystem's Security Posture record (the canonical file your security-audit skill writes at its close). If no such file exists, fall back to a git log grep for the most recent security-check session close and note the fallback.
2. Compute days since `last_run` against today.
3. If 25 or more days have passed, surface a single Your decisions line: "Security audit last ran YYYY-MM-DD, N days ago. Monthly cadence is due. Run the security-audit skill when capacity allows." Include the one alternative (defer if a known reason holds).
4. If fewer than 25 days, note "Security audit current (last ran YYYY-MM-DD, N days ago)" in the run entry and stop.

**Why read-only:** A frontmatter read and a board note. This item never runs the audit.
**Eligibility:** Condition-based, no day-window. Step 0 reads this as a due-scan client every run, silent until the audit approaches due.
**Output artifact:** A line on Your decisions when the audit is 25+ days stale, or a one-line "current" note in the run entry.

### Step 0 due-scan clients

Step 0 reads each client below and surfaces only what is due, with the date and the recommended action. It never runs the maintenance it surfaces.

- **Security audit staleness (T2-20).** Due at 25 or more days since the security audit's last run.
- **Review dates.** Every active file carrying `next_review`, once the date passes. T2-23 keeps the `last_reviewed` backstop.

A new client is one line here and one line in SKILL.md Step 0, no new machinery.
