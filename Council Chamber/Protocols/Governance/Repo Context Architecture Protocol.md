---
name: Repo Context Architecture Protocol
type: protocol
category: Governance
status: active
created: 2026-04-10
---

# Repo Context Architecture Protocol

## Purpose

Every ecosystem-adjacent external repo gets two context files, layered so that any AI coding tool works from a universal foundation while Claude sessions work from that foundation plus deeper operational detail.

---

## The Two-Layer Standard

### Layer 1 — AGENTS.md (Universal Foundation)

Read automatically by any AI coding tool: GitHub Copilot, Cursor, OpenAI Codex, Claude Code. Contains everything any AI agent needs to work correctly in this repo, regardless of tool.

**Required content:**
- **Project identity** — what this repo is, why it exists, who it serves
- **Ecosystem position** — where this node sits in your broader ecosystem; what other nodes exist; how they relate
- **Stack** — framework, versions, hosting, key dependencies
- **Build and dev commands** — `npm run dev`, `npm run build`, expected pass conditions
- **Critical rules** — constraints discovered through production failures or explicit design decisions; each rule states what not to do and why
- **Content and voice** — vocabulary to use and avoid; tone and audience
- **AI discoverability** — what crawler access exists; what structured files are active; upgrade status
- **Cross-ecosystem links** — which links connect to other nodes; which are load-bearing and must be maintained

**Format:** Plain markdown. No required sections schema — follow the content requirements above in whatever order serves readability. Kept focused and scannable.

---

### Layer 2 — CLAUDE.md (Claude-Specific Depth)

Loaded only in Claude Code sessions. Imports Layer 1 via `@AGENTS.md` at the top, then adds Claude-specific operational detail on top.

**First line must be:**
```
@AGENTS.md
```

**Additional content (beyond what AGENTS.md covers):**
- API and form IDs (portal IDs, form IDs, third-party embed IDs)
- Detailed file architecture (specific file paths, line number callouts for manual maintenance)
- Session maintenance items (what to update manually and when)
- Known quirks with specific root cause detail
- `## Refinements` section — date-stamped, session-learned constraints following the skill Refinements pattern

**The Refinements section is mandatory.** Start it empty with a note. Add dated entries as sessions reveal new constraints. This is the repo-level equivalent of the skill Refinements pattern.

---

## When to Apply

Apply this standard when:
- Creating any new ecosystem-adjacent public GitHub repo
- Building a new website repo or content hub
- Onboarding an existing repo that lacks structured context files

---

## Initialization Sequence

1. Write `AGENTS.md` first — establish the universal foundation
2. Write `CLAUDE.md` — `@AGENTS.md` at top, then Claude-specific depth
3. Add the first Refinements entry to CLAUDE.md: date-stamped creation note, forward-looking obligations if any
4. If known downstream revision obligations exist, add the "Upgrade pending" prospective wiring note per the Prospective Wiring standard (see Pending Plan Implementation skill `## Refinements`)

---

## Active Instances

Track your active instances here:

| Repo | AGENTS.md | CLAUDE.md | Last updated |
|---|---|---|---|
| *(your repo)* | *(status)* | *(status)* | *(date)* |

---

## Refinements

*Add date-stamped entries here when session experience reveals new constraints or patterns for this protocol.*
