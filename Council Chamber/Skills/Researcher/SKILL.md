# Researcher

**Purpose:** Parallel sub-agent research on a topic, aggregated into a structured report. Spawns up to 4 independent workers, each investigating a different angle, then synthesizes findings into a single report for Sovereign review. Research feeds decision-making — it does not trigger execution.

## When to Use

- Pre-plan deep dives before major Pending Plans (understand the landscape before committing to a design)
- Tech Watch analysis — compare multiple repos or changelogs in one pass
- Article research — gather background, angles, and evidence before drafting
- Architectural decisions spanning multiple protocols or systems
- Any time "I need to understand X before deciding" is the state of play

Triggered by: "research...", "give me a deep dive on...", "before we plan this, let me understand...", "what's the landscape for..."

## Steps

**Phase 1 — Clarify angles**

If the research request does not specify angles, propose them before spawning:

> "I'll research [topic] from these angles: [A], [B], [C], [D]. Confirm or adjust before I begin."

Typical angle patterns:
- What exists vs what's missing
- Best practices vs common failure modes
- Ecosystem-compatible vs ecosystem-incompatible patterns
- Short-term vs long-horizon considerations

**Phase 2 — Spawn parallel workers**

Spawn up to 4 sub-agents simultaneously. Each worker gets:
- A specific research angle
- Relevant context (file paths, protocols, external sources as appropriate)
- A clear output format: summary + key findings + relevant links or file references

Workers are independent. They do not communicate with each other. Only their final outputs return.

**Phase 3 — Synthesize**

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
[Proposed next steps for Sovereign review — never auto-implement]

### Sources
[Files read, repos checked, protocols referenced]
```

**Phase 4 — Present**

Present the report. Do not act on findings. The Sovereign decides what moves forward.

## Constraints

- Research output is always a structured report for Sovereign review — never auto-implement findings
- External web research (WebSearch, WebFetch) is allowed; external writes are not
- If research surfaces a Pending Plan candidate, propose it — do not create it without approval
- Sub-agent depth is max 1 (no nested sub-agents within workers)

## Use Cases

- **Tech Watch:** Spawn workers per watched repo — surface new patterns, hook types, skills since last review date
- **Article research:** Workers cover different perspectives or evidence bases; report feeds the IDEAS file or article draft
- **Pre-Pending Plan:** Workers cover problem landscape, existing ecosystem patterns, risk surface, and adoption examples; report feeds plan design
- **Protocol design:** Workers cover existing protocols for conflicts, relevant codices, external precedents, and implementation complexity

## External Orientation

> [!info] Ambassador Doctrine Active
> This skill operates under the [[Council Chamber/Protocols/Governance/Ambassador Doctrine]].
> Primary strategy: Āsana — this skill is an intelligence-gathering operation; observe fully before the Sovereign decides.
> Secondary: Dvaidhibhāva (parallel workers on multiple angles is strategic sophistication, not fragmentation), Vigraha (reject low-quality sources; hold the research standard).
> Researcher never auto-implements. Every report returns to the Sovereign. That boundary is Saṃśraya at the sub-agent layer.

## Refinements

- [2026-03-23] Research output is always a structured report for Sovereign review — never auto-implement findings. Research feeds decision-making; it does not trigger execution.
