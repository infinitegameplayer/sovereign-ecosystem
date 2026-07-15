#!/bin/bash
# post-bash-encoding-check.sh
# PostToolUse hook: mojibake / encoding corruption detection.
#
# Fires after Bash and PowerShell operations. Scans .md files in the vault
# modified in the last sixty seconds for the byte signatures left when a script
# reads a UTF-8 file as Windows-1252 and writes it back. Non-blocking: it reports
# the damage as a warning so it is caught before it spreads.
#
# Root cause this catches: PowerShell (or any tool) reading a UTF-8 file without
# an explicit encoding, then writing it back as UTF-8. Non-ASCII characters get
# double-encoded. An em dash becomes â€", a curly quote becomes â€™, and so on.
# The standing rule this enforces: any PowerShell file operation uses an explicit
# UTF-8 encoding. Never Get-Content or Set-Content without one on a file that
# holds non-ASCII text.
#
# PowerShell is the tool that CAUSES this, so PowerShell is a tool this hook must
# watch. Register it on Bash AND PowerShell in settings. A detector registered on
# Bash alone is structurally blind to the very tool it exists to catch.
#
# Configuration: set VAULT_ROOT to the absolute path of your vault root.
# Example:
#   VAULT_ROOT="/Users/yourname/Documents/MyEcosystem"
#   VAULT_ROOT="C:/Users/yourname/Documents/MyEcosystem"

# ── CONFIGURE THIS ──────────────────────────────────────────────────────────
VAULT_ROOT="${SOVEREIGN_VAULT_ROOT:-}"
# ────────────────────────────────────────────────────────────────────────────

INPUT=$(cat)

# With VAULT_ROOT unset, fall back to the working directory, which is the vault
# root when hooks run under the AI interface. A guard with no configuration
# should narrow to the working directory, never widen to the whole disk.
SCOPE_ROOT="${VAULT_ROOT:-$PWD}"
LOG_FILE="$SCOPE_ROOT/.runtime/encoding-check.log"

# grep -P refuses to run under a locale it cannot confirm is UTF-8, and the hook
# environment often leaves the locale unset. Piped through 2>/dev/null below, that
# error would disappear silently and the mojibake pattern would never run: a
# swallowed error read as a clean scan. Pin the locale so the match is real.
export LC_ALL=C.UTF-8

TOOL_NAME=$(printf '%s' "$INPUT" | node -e "
  var d = '';
  process.stdin.on('data', function(c) { d += c; });
  process.stdin.on('end', function() {
    try {
      var j = JSON.parse(d);
      console.log(j.tool_name || '');
    } catch(e) {
      console.log('');
    }
  });
")

# Check after Bash and PowerShell calls. PowerShell is the tool that causes the
# corruption, so it is not optional.
if [[ "$TOOL_NAME" != "Bash" && "$TOOL_NAME" != "PowerShell" ]]; then
  exit 0
fi

# Find .md files modified in the last 60 seconds within the vault
MODIFIED=$(find "$SCOPE_ROOT" -name "*.md" -newermt "60 seconds ago" \
  -not -path "*/.git/*" \
  -not -path "*/node_modules/*" \
  2>/dev/null)

if [[ -z "$MODIFIED" ]]; then
  exit 0
fi

# Known mojibake signatures (UTF-8 read as Windows-1252 then re-encoded).
# â€" = em dash, â€™ = right single quote, â€œ = left double quote,
# â€ = right double quote, âœ" = checkmark, â€¦ = ellipsis.
PATTERN='â€"|â€™|â€œ|â€\x9d|âœ"|â€¦|Ã¢|Ã©|Ã¨|Ã¼'

FOUND=""
while IFS= read -r file; do
  # grep -c prints "0" and still exits 1 on a no-match file, so a trailing
  # "|| echo 0" would append a second line. Default with parameter expansion.
  HITS=$(grep -cP "$PATTERN" "$file" 2>/dev/null)
  HITS=${HITS:-0}
  if [[ "$HITS" -gt 0 ]]; then
    FOUND="$FOUND\n  $file ($HITS occurrence(s))"
  fi
done <<< "$MODIFIED"

if [[ -n "$FOUND" ]]; then
  echo "--- Encoding Corruption Detected ---"
  echo "[WARN] Mojibake signatures found in recently modified files:"
  printf "%b\n" "$FOUND"
  echo ""
  echo "A tool likely read UTF-8 as Windows-1252 and wrote it back."
  echo "Fix: restore from git, or reverse with a cp1252 byte decode."
  echo "Prevention: always set an explicit UTF-8 encoding in PowerShell."
  echo "------------------------------------"

  mkdir -p "$SCOPE_ROOT/.runtime" 2>/dev/null
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "unknown")
  {
    echo "[$TIMESTAMP] $TOOL_NAME: mojibake signatures found in recently modified files:"
    printf "%b\n" "$FOUND"
  } >> "$LOG_FILE" 2>/dev/null
fi

exit 0
