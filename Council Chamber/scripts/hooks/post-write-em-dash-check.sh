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

# Only check files inside the configured vault root (or plan files)
if [ -n "$VAULT_ROOT" ]; then
  case "$FILE_PATH" in
    *"/.claude/plans/"*) ;;
    *)
      # Normalize separators for comparison
      NORM_FILE=$(printf '%s' "$FILE_PATH" | tr '\\' '/')
      NORM_VAULT=$(printf '%s' "$VAULT_ROOT" | tr '\\' '/')
      case "$NORM_FILE" in
        "$NORM_VAULT"*) ;;
        *) exit 0 ;;
      esac
      ;;
  esac
fi

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
