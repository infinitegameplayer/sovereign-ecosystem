---
status: active
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# Step 0: Due scan detail

Read each due-dated client and surface only what is due, with the date and the recommended action. Clients: the security audit at 25 or more days since its last run (T2-20), and every active file carrying `next_review` once the date passes. Full spec: [[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/sentinels]]. This step never runs the maintenance it surfaces. A new client is one line here and one entry there, no new machinery.

**Optional extension: external-surface triage.** If your ecosystem maintains external repositories with issue tracking, add a triage here that queries open routine or health issues, clusters them by type and priority and routes each into safe-now, fix-via-PR and judgment lanes. It reads and routes. It never pushes to an external main branch. Close a monitor-filed issue only when the condition that filed it has cleared, with the evidence in the closing comment. A finding still true stays open, and the monitor comments on it rather than filing again. This extension stays off until you run external repos.
