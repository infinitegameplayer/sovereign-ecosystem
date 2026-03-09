# Platform-Agnostic Interface Adapter Protocol

Purpose: Define how new interfaces connect to the Sovereign Ecosystem without becoming sources of truth.

## Principles
- Canonical records live in the Memory Substrate.
- Interfaces are adapters, not authorities.
- Links/mounts are preferred over copies.
- Read-only mode is the default fallback when adapters cannot preserve boundaries.
- Governance Core capsule is the lightweight anchor for interface context.

## When to Use
- Adding a new AI interface (Claude Code, Codex, Gemini, etc.).
- Introducing a new tool that reads or writes Sovereign Ecosystem files.
- Changing adapter paths or storage locations.

## Trust Tier Mapping
- Adapters must declare a trust tier (L0-L4) and allowed containers in `[[Council Chamber/Governance/Interface Adapter Registry]]`.
- If adapter capabilities are insufficient to enforce boundaries or diff visibility, set tier to L0.
- Any tier increase requires explicit approval and a logged change.

## Steps
1. Declare the interface adapter and scope (read-only vs read-write) in the session plan.
2. Confirm canonical containers and paths to expose.
3. Create link/mount mappings to canonical paths (no copies).
4. Run the Platform-Agnostic Interface Checklist.
5. If linking is not possible, require explicit approval before any duplication or sync.
6. Record adapter status and any exceptions in the AI Interface Change Log.

## Light Enforcement (Soft Guards)
- Use the checklist on every new interface.
- Maintain a single adapter mapping list in the session log or PendingPlan if changes are ongoing.
- Prefer read-only access until stable.
- Audit adapters after major tool updates or container moves.

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Include contrast fields in frontmatter for foundational updates.
- Store deeper contrast reasoning in the footer block when needed.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- Add contrast notes here if needed.
-->
