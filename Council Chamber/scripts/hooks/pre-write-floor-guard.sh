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

# Without a working node the parse above returns nothing, and until v3.13.0
# this guard then exited 0 in silence, which is the one thing it exists never
# to do. Claude Code no longer needs node, and hooks inherit the app's
# environment rather than your login shell, so this state is reachable. A plain
# grep stands in for the parser so a trust-anchor edit is still surfaced.
# Proven by the "without node" floor-guard cases in hooks-selftest.mjs.
NO_PARSER=0
if [ -z "$TOOL_NAME" ]; then
  NO_PARSER=1
  TOOL_NAME=$(printf '%s' "$INPUT" | grep -oE '"tool_name"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed -E 's/.*"([^"]*)"$/\1/')
fi

if [ "$TOOL_NAME" = "Write" ] || [ "$TOOL_NAME" = "Edit" ]; then
  if [ "$NO_PARSER" -eq 1 ]; then
    FILE_PATH=$(printf '%s' "$INPUT" | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed -E 's/.*"([^"]*)"$/\1/')
  else
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
  fi

  # Normalize Windows backslashes so the match is path-separator agnostic. A
  # path read without the parser keeps its JSON escaping, so runs of slashes
  # are squeezed to one.
  NORM=$(printf '%s' "$FILE_PATH" | tr '\\' '/' | tr -s '/')

  if printf '%s' "$NORM" | grep -qiE '\.claude/(settings\.json|CLAUDE\.md)$'; then
    mkdir -p "$VAULT_ROOT/.runtime" 2>/dev/null
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "unknown")
    echo "TRUST-ANCHOR FILE EDIT: $TOOL_NAME on $FILE_PATH. Confirmation required. Surfaced, not blocked." >&2
    echo "[$TIMESTAMP] $TOOL_NAME: $FILE_PATH" >> "$LOG_FILE" 2>/dev/null
  fi
fi

exit 0
