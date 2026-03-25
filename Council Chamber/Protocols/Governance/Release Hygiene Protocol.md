---
status: active
created: 2026-03-22
ring: Governance
trigger_phrase: "Release Hygiene Protocol"
---

# Release Hygiene Protocol

## Purpose

Final blockers in a release are almost never structural. They are export-truth issues: encoding corruption, missing connective files, public-safe automation gaps, identity attribution ambiguity. This protocol creates seven standing rules to govern any personal-to-public release so these signals are caught before publish, not during.

## Trigger Phrase

"Release Hygiene Protocol" in any session. Your AI interface loads this protocol before any public release review.

## Rules

### 1. Export-Truth Audit

Always audit the exported workspace directly. Private-source confidence is not enough. The vault may look clean. The export surface is where corruption, missing links, and encoding issues appear. Start there.

### 2. Two-Tier Publish Gate

Structure every release review as Blockers vs Improvements.

- **Blockers:** must be resolved before publish. Unfixed = do not ship.
- **Improvements:** logged to a backlog. Do not block publish.

Never conflate the two tiers. A list with no separation creates false urgency and analysis paralysis.

### 3. Allowed-Public-Identity Rule

Legal attribution and intentional template examples are allowed in public exports. All other personal or collaborative references — real names, private org names, personal paths, private URLs, internal identifiers — are audit targets and must be removed or anonymized before publish.

When in doubt: if it identifies a real person or private system, it does not ship.

### 4. Public-Safe Automation Rule

Ship `*.example` config files. `.gitignore` the live local config. No personal paths, API keys, secrets, or local environment assumptions may appear in any automation artifact included in a public export.

Checklist before any script or config ships:
- [ ] No hardcoded personal file paths
- [ ] No API keys or tokens in plaintext
- [ ] No references to private internal systems
- [ ] Live config is gitignored; example config is committed

### 5. Repo-Health Baseline

`SECURITY.md` ships by default with any public repo. No exception.

Decide separately — per project, per release — whether to include:
- `CODEOWNERS` (if contributors will merge)
- `CITATION.cff` (if academic or research citation is relevant)
- Contributor guidance (if external contributions are intended)

Do not add these files preemptively. Add them when the project warrants it.

### 6. Encoding-Repair Fallback

If mojibake or encoding corruption appears, stop ad hoc transcoding immediately. Do not chain multiple conversion attempts. Use one of:
- Deterministic line rewrites in plain ASCII
- A controlled normalization path agreed on before execution

Ad hoc fixes compound. One deterministic pass is the rule.

### 7. Connective-Tissue Audit

Before any publish, verify:
- [ ] All linked notes in the export resolve (no broken wikilinks or dead references)
- [ ] README handoffs are complete (links, paths, and instructions work from outside the vault)
- [ ] No hidden assumptions exist inside the exported structure (no "just knows" that only a vault-native reader would understand)

If any item fails: fix before publish, or explicitly document as a known limitation.

---

## Ambassador Doctrine

This protocol operates within the [[Council Chamber/Protocols/Governance/Ambassador Doctrine]]. Every public release is an act of sovereign representation. The Allowed-Public-Identity Rule (Rule 3) and Public-Safe Automation Rule (Rule 4) are Vigraha in practice. The Two-Tier Publish Gate (Rule 2) is Āsana before Yāna executes.
