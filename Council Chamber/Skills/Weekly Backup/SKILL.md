---
name: Weekly Backup
description: Execute the end-of-week vault backup ritual — run the backup script, confirm the log entry, report results.
status: active
tier: foundational
contrast_not:
false_twins:
anti_patterns:
boundary_conditions:
clarity_triggers:
---

# Weekly Backup Skill

Purpose: Execute the end-of-week vault backup ritual with connective visibility — run the backup, confirm the log entry was written, and report results to the Sovereign.
Trigger: End of week (Friday preferred). Also invokable on demand.
Inputs: None required. Reads configuration from `scripts/backup.config.json`.
Outputs: Terminal output from backup script, confirmed log entry in `Vault (Archive)/Sovereign Ecosystem Backup Log.md`, summary report to user.
Status: active
Related Protocols/Codices: [[Council Chamber/Protocols/Archival/Backup Protocol]]

## Steps

1. Verify that `BACKUP_PATH` is present in `scripts/backup.config.json`. If missing, halt and prompt the user to add it before proceeding.
2. Run `node scripts/kingdom-backup.mjs` from the vault root via Bash. Capture terminal output.
3. Confirm that a new entry was appended to `Vault (Archive)/Sovereign Ecosystem Backup Log.md` by reading the last log entry and verifying today's date is present.
4. Report to the user: backup date, files copied, total size, destination path, duration. Use the log entry as the source of truth for these values.
5. (Optional) Run `git status` in the vault root and surface any untracked or modified files as a brief note — not a gate, just ambient awareness.

## Planning Mode Rule

Status is `active`. Execution is authorized without additional approval.
Step 1 (config check) is a hard gate. Do not proceed to Step 2 if `BACKUP_PATH` is absent.

## Contrast Layer Integration (Mandatory)

Tier: 1 (foundational).

<!--
Internal Contrast Layer
- This skill runs a script, not AI file operations. The backup happens outside the vault's git history.
- Step 3 (log confirmation) is not optional. A backup that does not confirm its own log entry has no connective visibility.
- Git status in Step 5 is ambient awareness, not a compliance check. Do not block or alarm on git ownership warnings.
- The skill is the ritual. The script is the execution. Both must run for a complete backup.
-->
