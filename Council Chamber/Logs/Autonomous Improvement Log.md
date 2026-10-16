---
status: active
run_counter: 0
last_run:
research_state:
  R1:    # external practices
  R2:    # vault hygiene
  R3:    # infrastructure
  R4:    # discoverability
  R5:    # skill library
  R6:    # governance
  R7:    # expression
  R8:    # memory architecture
  R9:    # cost and routing
bundle_state:
  B1:    # skills
  B2:    # memory
  B3:    # frontmatter
  B4:    # governance
  B5:    # infrastructure
  B6:    # drafts and links
priority_flags: []
menu_state: {}
fix_checks: []
rulings: []
runtime_purge_surfaced: []
---

# Autonomous Improvement Log

State lives in the frontmatter above. Run entries land below, newest first.

The skill reads `menu_state`, `research_state`, `bundle_state` and `priority_flags` at Step 1, and writes them back at Step 8. `menu_state` fills with one scorecard per item as items run; an item absent or `null` has never run and reads as eligible. A never-run bundle goes first. Each run entry records its decision board in full, so this log is the board's only durable home.

Adapt the menu and research categories to your ecosystem during onboarding. The starter set is generic vault-internal hygiene.

<!-- First run appends its entry directly below this line. -->
