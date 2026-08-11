---
name: researcher
description: Use when the Sovereign wants parallel sub-agent research aggregated into a structured report. Spawns up to 4 independent workers each investigating a different angle, then synthesizes findings for review. Research feeds decisions, does not trigger execution.
status: active
tier: foundational
---

# Researcher Skill

Purpose: Parallel sub-agent research on a topic, aggregated into a structured report. Spawns up to 4 independent workers, each investigating a different angle, then synthesizes findings into a single report for Sovereign review. Research feeds decision-making. It does not trigger execution.
Trigger: "research...", "give me a deep dive on...", "before we plan this, let me understand...", "what is the landscape for..."
Inputs: Topic, research angles (proposed if not given), relevant context and source paths.
Outputs: A structured research report for review. Never an implementation.
Status: active
Related Protocols/Codices: [[Council Chamber/Protocols/Planning/Pending Plan Implementation Protocol]] (research feeds plan design), [[Council Chamber/Skills/Source Harvest/SKILL]].

## When to Use

- Pre-plan deep dives before major Pending Plans (understand the landscape before committing to a design)
- Tech-watch analysis. Compare multiple repos or changelogs in one pass
- Article research. Gather background, angles and evidence before drafting
- Architectural decisions spanning multiple protocols or systems
- Any time "I need to understand X before deciding" is the state of play

## Steps

**Phase 1: Clarify angles**

If the research request does not specify angles, propose them before spawning:

> "I'll research [topic] from these angles: [A], [B], [C], [D]. Confirm or adjust before I begin."

Typical angle patterns:
- What exists versus what is missing
- Best practices versus common failure modes
- Compatible versus incompatible patterns for this ecosystem
- Short-term versus long-horizon considerations

**Phase 2: Spawn parallel workers**

Spawn up to 4 sub-agents simultaneously. Each worker gets:
- A specific research angle
- Relevant context (file paths, protocols, external sources as appropriate)
- A clear output format: summary, key findings, relevant links or file references

Workers are independent. They do not communicate with each other. Only their final outputs return.

**Phase 3: Synthesize**

Aggregate all worker outputs into a single structured report:

```
## Research Report: [Topic]
Date: [YYYY-MM-DD]

### Summary
[2-4 sentence synthesis across all angles]

### Findings by Angle
#### [Angle A]
...
#### [Angle B]
...

### Recommended Actions / Decision Points
[Proposed next steps for review. Never auto-implement]

### Sources
[Files read, repos checked, protocols referenced]
```

**Phase 4: Present**

Present the report. Do not act on findings. The Sovereign decides what moves forward.

## Cross-Model Perspectives

Parallel research workers do not all have to route to the same model or tool. The principle: match each angle's question shape to the substrate best suited for it.

| Angle type | Default substrate | Why |
|---|---|---|
| Synthesis-heavy (compare sources, identify patterns) | Main reasoning model | Reasoning across sources |
| Web-current (post-training-cutoff facts, live state) | Real-time web search tool | Live data beyond model cutoff |
| Mechanical multi-source pull (changelogs, API diffs, structured extraction) | Smaller or cheaper model | No-judgment volume work |
| Adversarial check of a claim | Challenger model | Independent cross-model pressure |
| Voice or intent judgment | Orchestrator model | Register and governance coherence |

Synthesis pass: after all workers return, the orchestrator synthesizes across substrates. Findings from different model types carry different confidence textures. Name those differences in the synthesis.

Audit gate: when the synthesized report will inform a major plan or decision, offer a challenger-model review of the synthesis before closing. One line: "Challenger pass warranted?" Do not require it.

## Constraints

- Research output is always a structured report for review. Never auto-implement findings
- External web research (WebSearch, WebFetch) is allowed. External writes are not
- If research surfaces a candidate Pending Plan, propose it. Do not create it without approval
- Sub-agent depth is max 1 (no nested sub-agents within workers)

## Use Cases

- **Tech watch:** Spawn workers per watched repo. Surface new patterns, hook types and skills since the last review date
- **Article research:** Workers cover different perspectives or evidence bases. The report feeds the article draft
- **Pre-plan research:** Workers cover problem landscape, existing patterns, risk surface and adoption examples. The report feeds plan design
- **Protocol design:** Workers cover existing protocols for conflicts, relevant references, external precedents and implementation complexity

## External Boundaries

This skill spawns parallel sub-agents for research. Sub-agents are intelligence-gathering only. They do not implement, write to canonical files or trigger external actions. Every report returns for review and decision. That boundary is non-negotiable.

## Model Routing

Dispatch the cheapest model that does the job well. Before each delegated step, ask whether a smaller model would produce equivalent output.

| Work type | Model |
|---|---|
| Mechanical lookups, deterministic commands, structured extraction against a spec | Haiku |
| Multi-step synthesis, drafting, diagnosis, most worker dispatch | Sonnet |
| Architectural judgment, plan design, judgment-dense synthesis | Opus |

Per-phase defaults: Phase 1 (clarify angles) and Phase 4 (present) are Sovereign-facing and route to Opus. Phase 2 (spawn workers) routes per the Cross-Model Perspectives substrate table above. Use Sonnet as the fallback for any angle that does not fit a named type. Phase 3 (synthesize across substrates) routes to Opus because cross-model synthesis carries the highest judgment density.

Set the model explicitly on every subagent dispatch. Never silently inherit the top tier.

## Pairs With

**[[Council Chamber/Skills/Source Harvest/SKILL]]** is the gateway skill for systematic pattern extraction from external repos and tools. Researcher gathers findings. Source Harvest extracts patterns once you have decided which sources to dig into.

## Refinements

- [2026-03-23] Research output is always a structured report for review. Never auto-implement findings. Research feeds decision-making. It does not trigger execution.
