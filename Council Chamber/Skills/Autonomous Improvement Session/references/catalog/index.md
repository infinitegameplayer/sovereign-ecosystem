---
status: active
created: 2026-10-16
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# Autonomous Improvement Session: Menu Catalog Index

The menu, one file per bundle, so a worker loads only its own. SKILL.md holds the workflow; these files hold each item's execution spec, eligibility rule, verb and output. Open the files of the selected items only, never the whole catalog. An item is a `### ID: Title` section. Its bundle is the file it sits in: a bundle file names `bundle:` and `name:` in its frontmatter, and an item changes bundles by moving its section to another bundle file. Its verb is its `**Verb:**` line, or the tier default where the line is absent: Tier 1 **Acts**, Tier 2 **Reports**. An item that does not run carries **Proposes**. A header carrying `(RETIRED` is skipped. IDs keep the numbers the originating vault gave them, so the sequence has gaps. Nothing renumbers.

**Bundles.** Two per run, a never-run bundle first, then the oldest `bundle_state` date, so each comes round every three runs. Step 8 stamps `bundle_state` for each bundle run.

## Files and items

**[[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/standalone|standalone]]** (own eligibility, outside every bundle)

- T1-1: Wikilink integrity re-sweep (Acts)
- T1-2: Index regeneration (Acts)
- T1-5: Codices Index completeness sweep (Acts)
- T1-6: Superseded-artifact and dead-section sweep (Acts)
- T1-7: Runtime log rotation (Acts)
- T2-1: Inbox triage sweep (Acts)
- T2-8: Breadcrumb propagation and stale-reference sweep (Reports)
- T2-9: Implemented-plan archival candidate sweep (Acts)
- T2-12: Hook coverage audit (Reports)
- T2-24: Index-file dead-link audit (Reports)

**[[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/sentinels|sentinels]]** (Step 0, every run)

- T2-20: Security audit staleness sentinel (Reports)

**[[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/B1-skills|B1-skills]]** (bundle B1, skills)

- T1-8: Skill mandatory-sections completeness sweep (Acts)
- T2-6: Skill cross-reference health (Reports)
- T2-15: Skill frontmatter conformance sweep (Reports)
- T2-16: Skill status-to-usage drift audit (Reports)
- T2-27: Skill disambiguation and trigger-collision scan (Reports)
- T2-28: SKILL.md progressive-disclosure overgrowth scan (Reports)
- T2-44: Skills-missing-External-Orientation audit (Reports)
- T2-54: Skill-referenced script existence sweep (Reports)

**[[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/B2-memory|B2-memory]]** (bundle B2, memory)

- T2-4: Memory file cross-reference health (Reports)
- T2-7: MEMORY.md compression candidate report (Reports)
- T2-18: Project-memory lifecycle staleness sweep (Reports)
- T2-47: Cross-memory link integrity sweep (Reports)
- T2-50: Memory expiry-lapse scan (Reports)
- T2-51: Memory frontmatter schema-gap scan (Reports)

**[[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/B3-frontmatter|B3-frontmatter]]** (bundle B3, frontmatter)

- T2-10: Status vocabulary conformance report (Reports)
- T2-11: Tag consistency hygiene (Reports)
- T2-23: Review-date staleness sentinel (Reports)
- T2-52: Empty and stub note detection (Reports)
- T2-53: Frontmatter date-format conformance audit (Reports)
- T2-56: YAML frontmatter validity scan (Reports)

**[[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/B4-governance|B4-governance]]** (bundle B4, governance)

- T2-5: Codex orphan and inbound-link density report (Reports)
- T2-19: Term Registry placeholder-resolution scan (Reports)
- T2-46: Interface Adapter Registry deprecated-entry staleness check (Reports)
- T2-60: Codex status-promotion propagation check (Reports)

**[[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/B5-infrastructure|B5-infrastructure]]** (bundle B5, infrastructure)

- T2-13: Scripts-package dependency and CVE audit (Reports)
- T2-21: MCP server load-vs-use gap audit (Reports)
- T2-22: Explicit model-set compliance audit (Reports)
- T2-25: Settings file allow-list integrity audit (Reports)
- T2-26: Undocumented required-env-key audit (Reports)
- T2-57: MCP tool-description integrity sweep (Reports)

**[[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/B6-drafts-and-links|B6-drafts-and-links]]** (bundle B6, drafts and links)

- T2-2: Stale draft surface (Reports)
- T2-3: External link rot scan (Reports)
- T2-14: Orphaned and superseded image sweep (Reports)
- T2-17: Contraction enforcement sweep (Reports)

**[[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/site-lane|site-lane]]** (optional, PR-based)

- Class registry, empty at template initialization

**[[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/research|research]]** (SKILL.md Step 5)

- R1 external practices, R2 vault hygiene, R3 infrastructure, R4 discoverability, R5 skill library, R6 governance, R7 expression, R8 memory architecture, R9 cost and routing; plus the ground-truth gate

**[[Council Chamber/Skills/Autonomous Improvement Session/references/catalog/retired|retired]]** (tombstones, skipped)

- T1-3 and T1-4 retired
