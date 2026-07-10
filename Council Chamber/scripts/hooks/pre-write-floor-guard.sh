#!/bin/sh
# pre-write-floor-guard.sh
# PreToolUse hook (Write|Edit): surfaces any edit to a trust-anchor file.
#
# Bulk-edit protections catch wholesale rewrites, but a single-line
# non-wildcard edit can slip past them. This closes that path: no edit to a
# trust-anchor file is ever silent.
#
# Trust-anchor files guarded:
#   .claude/settings.json   (permissions, hooks, self-modification surface)
#   .claude/CLAUDE.md       (the ecosystem trust anchor)
#
# This is a surface-and-log guard, not a hard block. Sovereign-directed edits
# to these files are legitimate, so the hook exits 0 and lets the edit
# proceed. Its job is to make the edit loud in the transcript and durable in
# the log, so a trust-anchor change is always visible to the Sovereign.
# Runs alongside pre-tool-approval-gate.sh.
#
# Configuration: set SOVEREIGN_VAULT_ROOT to the absolute path of your vault
# root. Falls back to the current working directory, which is the vault root
# when hooks run under Claude Code.
#
# Invoked by the AI interface's PreToolUse hook before each Write or Edit call.

VAULT_ROOT="${SOVEREIGN_VAULT_ROOT:-$PWD}"
LOG_FILE="$VAULT_ROOT/.runtime/floor-guard.log"

INPUT=$(cat)

# Extract tool_name from hook input JSON
TOOL_NAME=$(printf '%s' "$INPUT" | node -e "
  var d = '';
  process.stdin.on('data', function(c) { d += c; });
  process.stdin.on('end', function() {
    try {
      var j = JSON.parse(d);
      process.stdout.write(j.tool_name || '');
    } catch(e) { process.stdout.write(''); }
  });
" 2>/dev/null)

if [ "$TOOL_NAME" = "Write" ] || [ "$TOOL_NAME" = "Edit" ]; then
  FILE_PATH=$(printf '%s' "$INPUT" | node -e "
    var d = '';
    process.stdin.on('data', function(c) { d += c; });
    process.stdin.on('end', function() {
      try {
        var j = JSON.parse(d);
        process.stdout.write((j.tool_input && j.tool_input.file_path) || '');
      } catch(e) { process.stdout.write(''); }
    });
  " 2>/dev/null)

  # Normalize Windows backslashes so the match is path-separator agnostic.
  NORM=$(printf '%s' "$FILE_PATH" | tr '\\' '/')

  if printf '%s' "$NORM" | grep -qiE '\.claude/(settings\.json|CLAUDE\.md)$'; then
    mkdir -p "$VAULT_ROOT/.runtime" 2>/dev/null
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "unknown")
    echo "TRUST-ANCHOR FILE EDIT: $TOOL_NAME on $FILE_PATH. Confirmation required. Surfaced, not blocked." >&2
    echo "[$TIMESTAMP] $TOOL_NAME: $FILE_PATH" >> "$LOG_FILE" 2>/dev/null
  fi
fi

exit 0
