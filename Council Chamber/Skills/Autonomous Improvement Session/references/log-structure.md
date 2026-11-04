---
status: active
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# Log Structure templates

**Frontmatter:**

```yaml
---
status: active
run_counter: N
last_run: YYYY-MM-DD
research_state:             # category ID to last-researched date; the least recent goes next
  R1:
  # ... through R9
bundle_state:               # bundle ID to last-run date; never-run bundles first, then the oldest
  B1:
  # ... through B6
priority_flags: []          # item IDs flagged to lift in Step 2 selection
menu_state:                 # one scorecard per item; null means never run
  T1-1: {last_run: YYYY-MM-DD, runs: N, findings: N, accepted: N, declined: N, noise: N, empty_streak: N}
  # a bare YYYY-MM-DD is the 1.x shape and still reads as last_run
fix_checks: []              # one {run, item, file, commit, absent | present} per Acts edit, the last three runs only
rulings: []                 # one {path, item, line, disposition, ruled, until} per finding the Sovereign ruled on
runtime_purge_surfaced: []  # T1-7's surfaced purge candidates
---
```

**The run entry.** It records the board in full, so the log is the board's only durable home.

```markdown
## Run: YYYY-MM-DD HH:MM (Run N)

**Items attempted:** N. **Items completed:** N. **Bundles this run:** [IDs]
**Research:** [category ID]: returned N; live defects N, fixed in this run N; duplicates N; new candidates N
**Dropped by the ledger:** [N, by item; or "none"]

### Fix re-check
- Held N, regressed N (re-landed in Done), reverted N (Your decisions), unverifiable N

### Decision board (this run)
#### 1. Done
#### 2. Your decisions
#### 3. Your hands
#### 4. Plans to approve

### Patterns Noticed (log only, never on the board)
### Reports with no findings
### Errors and blockers
```

The return session appends a `### Sovereign review and return session` section under the run entry it answers.
