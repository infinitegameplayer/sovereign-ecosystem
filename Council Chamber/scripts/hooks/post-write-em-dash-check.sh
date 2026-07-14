#!/bin/sh
# post-write-em-dash-check.sh
# PostToolUse hook: em dash expression standard check.
#
# Fires after Write and Edit operations on .md files inside the vault.
# Non-blocking: reports violations as warnings; does not prevent saves.
#
# Expression standard: em dashes (—) are prohibited in all ecosystem output,
# internal and external, without exception. Rule lives in CLAUDE.md.
#
# Configuration: set VAULT_ROOT to the absolute path of your vault root.
# Example:
#   VAULT_ROOT="/Users/yourname/Documents/MyEcosystem"
#   VAULT_ROOT="C:/Users/yourname/Documents/MyEcosystem"

# ── CONFIGURE THIS ──────────────────────────────────────────────────────────
VAULT_ROOT="${SOVEREIGN_VAULT_ROOT:-}"
# ────────────────────────────────────────────────────────────────────────────

INPUT=$(cat)

# Extract tool_name and file_path from hook JSON input
PARSED=$(printf '%s' "$INPUT" | node -e "
  var d = '';
  process.stdin.on('data', function(c) { d += c; });
  process.stdin.on('end', function() {
    try {
      var j = JSON.parse(d);
      var name = j.tool_name || '';
      var path = (j.tool_input || {}).file_path || '';
      console.log(name + '\n' + path);
    } catch(e) {
      console.log('\n');
    }
  });
")

TOOL_NAME=$(printf '%s' "$PARSED" | head -1)
FILE_PATH=$(printf '%s' "$PARSED" | tail -1)

# Only check Write and Edit
if [ "$TOOL_NAME" != "Write" ] && [ "$TOOL_NAME" != "Edit" ]; then
  exit 0
fi

# Only check .md files
case "$FILE_PATH" in
  *.md) ;;
  *) exit 0 ;;
esac

# Only check files inside the vault root (or plan files).
#
# Two failure modes lived here, one in each direction, and both are closed.
#
# 1. The prefix match was case-sensitive. On Windows the same file is reachable
#    as both `C:/vault/x.md` and `c:/vault/x.md`, and nothing guarantees which
#    casing a tool hands the hook. A drive-letter mismatch made the comparison
#    fail, and the hook exited 0 before ever reading the file: no warning, no
#    log, no trace. The em dash gate went dark and looked healthy doing it.
#    Both sides are now lowercased before comparison.
#
# 2. With VAULT_ROOT unset the scope check was skipped entirely, so the hook
#    warned on any .md file anywhere on disk. It now falls back to the working
#    directory, which is the vault root when hooks run under the AI interface.
#    A guard with no configuration should narrow, never widen.
SCOPE_ROOT="${VAULT_ROOT:-$PWD}"

case "$FILE_PATH" in
  *"/.claude/plans/"*) ;;
  *)
    NORM_FILE=$(printf '%s' "$FILE_PATH" | tr '\\' '/' | tr '[:upper:]' '[:lower:]')
    NORM_VAULT=$(printf '%s' "$SCOPE_ROOT" | tr '\\' '/' | tr '[:upper:]' '[:lower:]')
    case "$NORM_FILE" in
      "$NORM_VAULT"*) ;;
      # A relative path is working-directory bound, and the working directory
      # is the vault. Relative means internal, so it stays in scope.
      /*|[A-Za-z]:*|~/*) exit 0 ;;
      *) ;;
    esac
    ;;
esac

# File must exist
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# Count em dashes
COUNT=$(grep -c "—" "$FILE_PATH" 2>/dev/null || echo "0")

if [ "$COUNT" -gt 0 ]; then
  echo "--- Em Dash Check ---"
  echo "[WARN] $COUNT em dash(es) found in $(basename "$FILE_PATH")."
  echo "First occurrences:"
  grep -n "—" "$FILE_PATH" | head -5
  echo "Replace with a period, a comma or a colon before session close."
  echo "---------------------"
fi

exit 0
