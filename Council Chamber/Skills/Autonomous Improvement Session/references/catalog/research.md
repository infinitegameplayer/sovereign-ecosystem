---
status: active
created: 2026-10-16
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# Research Rotation Categories

The research rotation (SKILL.md Step 5) is the engine of menu growth. It runs every session, rotating through the categories below. The cadence rule is one category per run. The skill picks the least-recently-researched category from `research_state` in the log frontmatter, dispatches one Sonnet worker for it. The worker's brief points it, in order, at a live defect in the category (with the file and the check that shows it), a duplicate between existing menu items and only then a new item, which has to beat both. It returns a self-ranked top 5. The orchestrator fixes each Acts-safe live defect in the same run and logs it in Done; the rest go to Your decisions.

Nine categories at creation, researched one per run.

**Ground-truth gate (standing rule, all categories).** A research candidate that asserts a claim about the current state of an existing artifact is making a claim, and a claim is verified at the moment it is made. Before any such state-claim reaches the decision board, run the cheapest live check that confirms or kills it: an `ls`, a Grep, a scoped Read against the named artifact. A candidate whose premise fails verification never reaches the Sovereign. A forward proposal to build something absent is fine and needs no artifact check. A claim that a present artifact is absent or stale is a factual assertion and must be ground-truthed.

1. **External practices and tooling.** What the broader agentic and AI field is doing that your ecosystem could adopt. Force external sources with URLs. Reject vault-internal candidates that duplicate the hygiene categories.
2. **Vault hygiene and integrity.** Wikilinks, orphans, frontmatter, naming conventions.
3. **Infrastructure and scripts.** Script health, hooks, MCP loadout, automation gaps.
4. **Discoverability and content.** AI discoverability, content freshness, manifest accuracy.
5. **Skill library health.** Cross-references, redundancy, progressive disclosure, routing matrices.
6. **Governance coherence.** Codex consistency, protocol drift, status vocabulary, structural alignment.
7. **Expression and voice integrity.** Anti-AI patterns and Writing Style Codex adherence across artifacts.
8. **Memory and knowledge architecture.** MEMORY.md health, codex inbound density, knowledge map currency.
9. **Cost and routing efficiency.** Model routing adherence, token efficiency, routing discipline.

Each category ID for `research_state` tracking: `R1` external-practices, `R2` vault-hygiene, `R3` infrastructure, `R4` discoverability, `R5` skill-library, `R6` governance, `R7` expression, `R8` memory-architecture, `R9` cost-routing.
