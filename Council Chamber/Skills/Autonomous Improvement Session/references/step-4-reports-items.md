---
status: active
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# Step 4: Reports items detail

Dispatch one read-only worker per due bundle and one per standalone Reports item or small group, each with its catalog file as the brief and the IDs of the Reports items it runs on one line, `Items: T2-4, T2-7`. The brief says that any Acts item in the file belongs to the orchestrator and is skipped. A read-only worker holds no write tools. Every worker prompt says: run single-context, do not spawn subagents. A worker that fans out returns narration about its children instead of findings, and per-item results get lost in the hop.

**Every scan returns, per item, a count, the instrument used and a reason if it did not run.** A quiet monitor is a claim of health. Read its run log for skipped checks and treat a skipped check as a finding. A worker that stops at its turn limit before returning every item is resumed once; an item still missing after that is logged as not run under Errors and blockers. Every finding carries its path, its class and the offending line verbatim, so it can be matched against the ledger of rulings. A finding that needs a Sovereign ruling becomes a Your-decisions entry, never a decision buried in a report.

**Databases and send tools.** A run reads databases through a read-only connection only. It never applies migrations and never calls any scheduler or send tool that publishes.
