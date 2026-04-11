---
status: active
created: 2026-04-10
ring: Governance
---

# Phase Audit Protocol

## Purpose

Define a repeatable concurrent audit method for reviewing the outputs of any completed phase or phase sequence before the next phase begins. The goal: surface gaps, expression violations, unsupported claims and forward obligations while the foundation is fresh and before the next layer builds on top of it.

## When to Run

Run a Phase Audit when:
- A multi-session phase sequence is complete and a new phase with higher stakes (architecture decisions, live builds, public launches) is about to begin
- A significant governance document or codex has been finalized and a Gemini challenger pass was not run during creation
- You want a full-sweep review of accumulated outputs before a strategic pivot

Do not run for: operational outputs, scripts, sync results, logs, or single-session incremental work.

---

## Execution Method

Run two passes concurrently in a single message (parallel subagents).

### Pass 1: Claude Code Audit

**Agent type:** Explore

**Scope:** Read all output artifacts for the phase sequence in full. Work through a structured checklist covering:
- Expression standard compliance (no em dashes, no Oxford commas, positive framing)
- Attribution and citation completeness (all claims sourced; stats have inline citations)
- Cross-reference accuracy (wikilinks, file paths, and session labels in the master plan match actual state)
- Output artifact existence (every artifact listed in the plan's Output Artifacts table exists at its stated path)
- Forward obligations (every "Phase N will..." or "upgrade pending" reference is captured in an existing Pending Plan or named breadcrumb)
- Deferred items (every deferral has a named destination, not just "later")

**Output format:** numbered findings list. Each finding: item description, file + location, severity (fix-in-session / defer), recommended action.

### Pass 2: Gemini Challenger Pass

**Method:** Call your configured Gemini interface tool with the full text of the primary strategic documents inline.

**Prompt structure:**
- Brief the auditor: who you are, what the document does, what phase produced it
- Audit Document 1 (internal codex or strategy doc): completeness, unsupported claims, internal coherence, vocabulary alignment
- Audit Document 2 (public-facing article or distillation): AI agent legibility, attribution, argument quality, expression standard compliance, practitioner actionability
- Request a numbered findings list with: document, section, finding, severity (critical / notable / minor)

Use your designated auditor account or model configuration for the challenger role to ensure an independent perspective.

---

## Aggregation

After both passes return:

1. Merge findings into a single list by document and area
2. Classify each finding:
   - **Fix in session:** small, clear, low-risk (expression standard violations, missing inline citations, minor phrasing issues)
   - **Defer:** structural, requires operator decision, or belongs to a future phase (name the destination phase and add to the master plan breadcrumbs)
3. Apply all in-session fixes directly
4. Add a breadcrumb to the master plan: "Phase X Audit complete" with findings summary, fixes applied, and phase-tagged deferred context

---

## Output

- List of resolved findings (fixes applied, file + location)
- Deferred findings log: item, destination phase, brief reason
- Phase gate statement: "Foundation confirmed solid. Phase N may proceed." or "Foundation has open items: [list]. Recommend review before Phase N."

---

## Expression Standard Pass (Mandatory)

Every audit includes a dedicated expression standard scan on all prose documents (codices, articles, protocols, breadcrumbs):

- Em dashes (—): prohibited in all ecosystem output, internal and external, without exception. Replace with a period, comma, colon or semicolon.
- Oxford comma: prohibited. Remove the comma before "and" in lists of three or more.
- Negation chains ("Not X. Not Y."): internal clarification only. Convert to positive framing in any document that may be read externally.
- Wikilinks with em dashes in filenames: flag for the operator. Renaming a file requires structural change approval (changes all existing wikilink references). Do not rename silently.

---

## Filing Convention

Phase Audit findings and outcomes are recorded in two places:

1. **Master plan breadcrumbs:** "Phase X Audit complete" entry with fixes, deferred items, and phase-tagged context for forward phases
2. **Audited document Refinements section:** only if a finding represents a recurring structural pattern or blind spot. One date-stamped entry. Not a findings transcript.

---

## Refinements

*Add date-stamped entries here when a mistake or blind spot is identified in the audit process itself.*
