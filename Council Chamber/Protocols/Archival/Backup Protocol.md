---
status: active
version: 0.1
tier: foundational
contrast_not:
false_twins:
anti_patterns:
boundary_conditions:
clarity_triggers:
---

# Backup Protocol

Purpose: Define the scope, cadence, exclusions and logging standard for Sovereign Ecosystem vault backups.

Skill: [[Council Chamber/Skills/Weekly Backup/SKILL]]
Script: `Council Chamber/scripts/kingdom-backup.mjs`
Log: [[Vault (Archive)/Sovereign Ecosystem Backup Log]]

## Scope

A full file-level snapshot of the entire Sovereign Ecosystem vault (`VAULT_PATH` as defined in `scripts/backup.config.json`).

## Destination

Defined by `BACKUP_PATH` in `scripts/backup.config.json`.
Default: set `BACKUP_PATH` to your preferred backup location.
Each run creates a dated subdirectory: `BACKUP_PATH\YYYY-MM-DD\`

## Cadence

Weekly. Recommended: Fridays, end of session, after Session Closeout.
Reference: [[Council Chamber/Protocols/Session/End-of-Week Protocol]]

## Exclusions

The following directories are excluded from every backup run:

- `node_modules` — dependency packages; reinstallable from package.json
- `.trash` — Obsidian recycle bin; not canonical content
- `.runtime` — ephemeral runtime logs; not archival content
- `.git` — git history is preserved by the git remote; not needed in a file-level backup

## Log Format

Each run appends a structured entry to `Vault (Archive)/Sovereign Ecosystem Backup Log.md`:

```
## YYYY-MM-DD

- **Timestamp:** YYYY-MM-DD HH:MM:SS UTC
- **Destination:** [full path to dated snapshot]
- **Files copied:** [count]
- **Total size:** [human-readable]
- **Duration:** [seconds]s
```

## Retention Recommendation

Retain the 8 most recent dated snapshots (approximately 2 months of weekly runs).
Older snapshots may be deleted from the backup destination manually.
The backup log in the vault is not deleted — it is a permanent record.

## Trigger Options

1. Run the Weekly Backup skill in Claude Code.
2. Double-click `KingdomBackup.cmd` in the vault root.
3. `node Council Chamber/scripts/kingdom-backup.mjs` from the vault root in any terminal.

## Error Handling

If the script exits with a non-zero code, no log entry is written.
Check the terminal output for the specific error before re-running.

## Contrast Layer Integration (Mandatory)

Tier: 1 (foundational).

<!--
Internal Contrast Layer
- This protocol is for file-level recovery, not git history recovery. They serve different failure modes.
- A backup that runs silently is not connected to the Sovereign Ecosystem. The log entry is the connective tissue.
- .git exclusion is a deliberate choice, not an oversight. Git recovery is git's job.
- The End-of-Week checklist is the enforcement mechanism. The protocol is the rulebook.
-->
