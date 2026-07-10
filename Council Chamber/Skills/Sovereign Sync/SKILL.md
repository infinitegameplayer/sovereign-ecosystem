---
name: sovereign-sync
description: Use when syncing your local ecosystem against the upstream Sovereign Ecosystem repo to review framework changes file by file and apply only what you approve.
status: active
tier: foundational
contrast_tier: 1
---

# Sovereign Sync Skill

Purpose: Keep your ecosystem current with upstream improvements while leaving your personalized surfaces untouched.
Trigger: Run whenever you want to check for upstream changes. Monthly is a reasonable default, or whenever an update note surfaces.
Inputs: Local git repo with an upstream remote configured. `scripts/framework-manifest.json` for path classification.
Outputs: A reviewed change list, applied files for approved items, a git commit bookending the sync.
Related: `scripts/se-update.mjs` (the underlying tool this skill orchestrates). `scripts/framework-manifest.json` (path classification authority).

---

## Before You Start

Commit any unsaved work in your vault. The sync applies upstream files via `git checkout`, which stages changes in your working tree. A clean working tree makes the diff readable and the commit unambiguous.

```bash
git -C "<your-vault-path>" status --short
```

If anything is uncommitted, commit or stash it first.

---

## Step 1. Run the check

```bash
node scripts/se-update.mjs --check
```

The script:
1. Confirms the upstream remote exists and points at the Sovereign Ecosystem repo.
2. Fetches the upstream default branch.
3. Diffs every file against your local HEAD.
4. Prints a categorized change list.

If no upstream remote is configured, the script prints the one-line fix and exits. Run that command, then re-run `--check`.

---

## Step 2. Read the change list

The output groups changes into three classes.

**FRAMEWORK** changes are upstream-maintained files. These are offered for your review and optional application. Each is safe to apply independently.

**SEEDED** changes are informational only. These files shipped from upstream as starting points and are now yours. Applying a seeded update overwrites your personalization. The script will not apply them with `--apply`. They require `--force-seeded` and an explicit decision.

**USER** changes are informational only. These are files you created. Upstream does not own them. No action is needed.

Present the framework change list to the Sovereign. Group by added, modified and removed. For each file, read the description aloud so the decision has context.

---

## Step 3. Review each framework file

For any file the Sovereign wants to see before deciding:

```bash
node scripts/se-update.mjs --diff "<path>"
```

Read the diff together. Note what changed. Note whether the file has been locally modified (the diff shows both directions).

The Sovereign decides per file: apply, skip or defer to next session.

---

## Step 4. Apply approved files

For each approved framework file:

```bash
node scripts/se-update.mjs --apply "<path>"
```

The script applies the upstream version and stages the file. Confirm each one before moving to the next.

After all approved files are applied, confirm the staged set:

```bash
git -C "<your-vault-path>" diff --cached --stat
```

---

## Step 5. Commit

Create a single commit that records the sync:

```bash
git -C "<your-vault-path>" commit -m "Sovereign Sync: apply upstream framework updates" -m "Applied: <list applied files>. Skipped: <list or 'none'>. Upstream ref: <upstream-remote>/<branch>."
```

The commit body is the sync record. It names what was applied, what was skipped, and the upstream ref. This is enough context for a future review.

---

## Seeded Files (separate decision)

If the Sovereign wants to bring in upstream changes to a seeded file (Humor Codex, Primer, To-Do Dock, hook scripts or other seeded surfaces), that is a separate explicit decision. The skill does not surface seeded file updates as part of the standard flow.

If the Sovereign requests a seeded file update:

1. Show the diff: `node scripts/se-update.mjs --diff "<path>"`
2. Confirm that the Sovereign understands their personalization will be overwritten.
3. If confirmed: `node scripts/se-update.mjs --force-seeded "<path>"`
4. Commit separately with a message that names the seeded file and the tradeoff.

---

## Alternate Update Path: IGOS Marketplace

The five dual-distribution skills (Source Harvest, Self-Healing, Session Closeout, Playwright, Manuscript Anti-AI Edit Pass) also ship as standalone plugins in the Infinite Game OS public library. A Sovereign can update just one of those skills through the marketplace instead of running a full sync.

```
/plugin marketplace add https://www.infinitegameos.io/marketplace.json
/plugin install <skill-name>@igos-library
```

This refreshes that one skill independently of the vault copy. It does not touch the git-tracked version this skill manages. The two copies update on separate schedules by design.

---

## Constraints

- Nothing applies without explicit approval.
- Framework files apply via `--apply`. Seeded files require `--force-seeded` and a separate decision. User files are never touched.
- The script does not push. Pushing after a sync is the Sovereign's own action.
- If the upstream remote is absent, the script prints the fix. The skill does not configure remotes autonomously.
- If a diff shows a conflict (the file was locally modified AND upstream changed it), surface the diff clearly before applying. The upstream version overwrites local edits. The Sovereign decides whether to proceed.

---

## Troubleshooting

**"No upstream remote found"**: Run the command the script printed, then re-run `--check`.

**Fetch fails**: Confirm internet access and that the upstream repo URL is reachable. The remote URL is in `scripts/se-update.mjs` (constant `UPSTREAM_REPO_URL`).

**Apply fails with a git error**: Surface the error. Do not retry without understanding the cause. A common reason is a locally locked file or a path that does not exist in upstream (was removed upstream). The removal is informational; the file stays local.

**Diff is very large**: Apply files individually rather than in batch. The per-file flow keeps the staged set readable.

---

## Model Routing

This skill is orchestration-light. The AI reads diff output and presents it to the Sovereign. No subagent dispatch required. Sonnet handles the flow. Haiku is appropriate if the only task is parsing the `--check` output.

---

## Refinements

*(Empty. Populated when execution mistakes occur during sessions.)*

---

## Contrast Layer Integration (Mandatory)

Tier: 1 (foundational).

<!--
Internal Contrast Layer
- The skill presents options. The Sovereign decides. The script refuses without approval.
- Framework is offered. Seeded is protected by default. User is invisible to upstream.
- The git commit after sync is the record. No separate sync log needed.
- --force-seeded is a door, not a default. The warning is mandatory, not optional text.
- The upstream remote check is a dependency gate, not a nice-to-have. The skill halts cleanly when it is absent rather than masking the missing infrastructure.
-->
