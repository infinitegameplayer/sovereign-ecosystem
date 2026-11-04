---
status: active
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# Step 1: Load state detail

Read `Council Chamber/Logs/Autonomous Improvement Log.md`. Parse the frontmatter: `run_counter`, `last_run`, `research_state`, `bundle_state`, `priority_flags`, the `menu_state` scorecards and the item maps (`runtime_purge_surfaced`, `fix_checks`, `rulings`). If the log does not exist, halt and say: "Log file missing. Create the seed log per the SKILL.md and retry." A malformed log halts the run too: state integrity is foundational. When the log body passes about 1200 lines, apply the retention rule (Log Structure) now, before the run writes. Then re-check the fix checks the last three runs recorded (the Learning Loop) and mark each fix held, regressed, reverted or unverifiable; the result goes in the run entry's Fix re-check line.
