---
name: Weekly Backup
description: Execute the end-of-week vault backup ritual - verify setup, run the backup script, confirm the log entry, and report results.
status: active
tier: foundational
contrast_not:
false_twins:
anti_patterns:
boundary_conditions:
clarity_triggers:
---

# Weekly Backup Skill

Purpose: Execute the end-of-week vault backup ritual with connective visibility - run the backup, confirm the log entry was written, and report results to the Sovereign.
Trigger: End of week (Friday preferred). Also invokable on demand.
Inputs: None required. Local backup configuration lives in `scripts/backup.config.json`, created from `scripts/backup.config.example.json`.
Outputs: Terminal output from backup script, confirmed log entry in `Vault (Archive)/Sovereign Ecosystem Backup Log.md`, summary report to user.
Status: active
Related Protocols/Codices: [[Council Chamber/Protocols/Archival/Backup Protocol]]

## Steps

1. Verify that `scripts/backup.config.json` exists. If it does not, copy `scripts/backup.config.example.json` to `scripts/backup.config.json` and set `BACKUP_PATH` before proceeding.
2. Confirm that `BACKUP_PATH` is non-empty and no longer set to the example placeholder.
3. Run `node scripts/backup-vault.mjs` from the vault root. Capture terminal output.
4. Confirm that a new entry was appended to `Vault (Archive)/Sovereign Ecosystem Backup Log.md` by reading the last log entry and verifying today's date is present.
5. Report to the user: backup date, files copied, total size, destination path, duration. Use the log entry as the source of truth for these values.
6. Optional: run `git status` in the vault root and surface any untracked or modified files as a brief note - not a gate, just ambient awareness.

## Planning Mode Rule

Status is `active`. Execution is authorized without additional approval.
Steps 1 and 2 are hard gates. Do not proceed to Step 3 until the local backup configuration is complete.

## Contrast Layer Integration (Mandatory)

Tier: 1 (foundational).

<!--
Internal Contrast Layer
- This skill runs a local script, not AI file operations. The backup happens outside the vault's git history.
- Step 4 (log confirmation) is not optional. A backup that does not confirm its own log entry has no connective visibility.
- Git status in Step 6 is ambient awareness, not a compliance check. Do not block or alarm on git ownership warnings.
- The skill is the ritual. The script is the execution. Both must run for a complete backup.
-->