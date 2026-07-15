#!/bin/bash
# post-bash-move-audit.sh
# PostToolUse hook: Move Audit Rule enforcement.
#
# Fires after Bash tool calls. Detects a plain mv of a .md file and runs a
# full-vault wikilink grep for the old path, surfacing any references to the old
# name that were left behind. The move and the sweep are one unit of work.
#
# Mechanizes the CLAUDE.md "Move audit rule": when a file is relocated, the move
# is not complete until a full-vault wikilink grep for the old path has run and
# every active reference has been updated.
#
# Trigger:   PostToolUse on Bash tool calls.
# Blocking:  No. Exits 0 always. Informational warnings only.
#
# Known limitations:
#   - Directory moves (mv dir/ ...) are not parsed for inner .md members.
#   - PowerShell Move-Item is not covered.
#   - Segment splitting on &&, ; and | is naive. Accepted tradeoff.
#   - Does not track moves already committed to a new destination name.
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
# root when hooks run under the AI interface. Narrow, never widen.
SCOPE_ROOT="${VAULT_ROOT:-$PWD}"
LOG_FILE="$SCOPE_ROOT/.runtime/move-audit.log"

# Extract tool_name and command from hook JSON input
PARSED=$(printf '%s' "$INPUT" | node -e "
  var d = '';
  process.stdin.on('data', function(c) { d += c; });
  process.stdin.on('end', function() {
    try {
      var j = JSON.parse(d);
      var name = j.tool_name || '';
      var cmd = (j.tool_input || {}).command || '';
      console.log(name + '\n' + cmd);
    } catch(e) {
      console.log('\n');
    }
  });
")

TOOL_NAME=$(printf '%s' "$PARSED" | head -1)
COMMAND=$(printf '%s' "$PARSED" | tail -n +2)

# Only fire on Bash calls
if [[ "$TOOL_NAME" != "Bash" ]]; then
  exit 0
fi

# Parse mv sources from the command string. Handles single and double quoted
# tokens; splits on &&, ; and | boundaries.
MD_SOURCES=$(printf '%s' "$COMMAND" | node -e "
  var d = '';
  process.stdin.on('data', function(c) { d += c; });
  process.stdin.on('end', function() {
    var cmd = d.trim();
    var segments = cmd.split(/&&|;|\|/);
    var mdSources = [];
    segments.forEach(function(seg) {
      seg = seg.trim();
      var tokens = [];
      var cur = '';
      var inSingle = false;
      var inDouble = false;
      for (var i = 0; i < seg.length; i++) {
        var ch = seg[i];
        if (ch === \"'\" && !inDouble) {
          inSingle = !inSingle;
        } else if (ch === '\"' && !inSingle) {
          inDouble = !inDouble;
        } else if ((ch === ' ' || ch === '\t') && !inSingle && !inDouble) {
          if (cur.length > 0) { tokens.push(cur); cur = ''; }
        } else {
          cur += ch;
        }
      }
      if (cur.length > 0) tokens.push(cur);
      if (tokens.length === 0) return;
      var isMv = false;
      var argStart = 0;
      if (tokens[0] === 'mv') {
        isMv = true;
        argStart = 1;
      } else if (tokens[0] === 'git' && tokens[1] === 'mv') {
        isMv = true;
        argStart = 2;
      }
      if (!isMv) return;
      var args = tokens.slice(argStart).filter(function(t) {
        return !t.startsWith('-');
      });
      if (args.length < 2) return;
      var sources = args.slice(0, args.length - 1);
      sources.forEach(function(src) {
        if (src.endsWith('.md')) {
          mdSources.push(src);
        }
      });
    });
    mdSources.forEach(function(s) { console.log(s); });
  });
")

if [[ -z "$MD_SOURCES" ]]; then
  exit 0
fi

# Normalize the vault root once for membership tests.
SCOPE_NORM="${SCOPE_ROOT//\\//}"

WARN_LINES=""
HAS_WARN=0

while IFS= read -r SRC; do
  [[ -z "$SRC" ]] && continue

  # A source outside the vault has no wikilinks to sweep, and searching for it is
  # worse than useless: the stem fallback below greps the WHOLE vault for the
  # bare stem, so `mv /tmp/a.md /tmp/b.md` would search every file for the letter
  # "a" and stall the session. Classify first, grep second. A glob, not a pipe to
  # grep -q, so an early SIGPIPE match does not print a job status to stderr.
  SRC_CHK="${SRC//\\//}"
  case "$SRC_CHK" in
    /*|[A-Za-z]:/*|~/*)
      case "$SRC_CHK" in
        "$SCOPE_NORM"/*) ;;
        *) continue ;;
      esac
      ;;
  esac

  STEM=$(basename "$SRC" .md)

  # A short stem matches most of the vault. The fallback is a convenience for
  # short-form wikilinks, never worth a vault-wide scan for a fragment that
  # cannot be a meaningful reference.
  if [[ ${#STEM} -lt 4 ]]; then
    STEM=""
  fi

  # Derive the vault-relative path without extension. Wikilinks use full
  # vault-relative paths: [[Council Chamber/Codices/Some Codex]].
  VAULT_REL=""
  STRIPPED="${SRC#$SCOPE_ROOT/}"
  STRIPPED="${STRIPPED#$SCOPE_NORM/}"
  if [[ "$STRIPPED" != "$SRC" ]]; then
    VAULT_REL="${STRIPPED%.md}"
    VAULT_REL="${VAULT_REL//\\//}"
  else
    VAULT_REL="${SRC%.md}"
    VAULT_REL="${VAULT_REL//\\//}"
  fi

  declare -A SEEN_LINES
  HITS=""

  # Primary pattern: vault-relative path wikilink. grep -F is safe because the
  # path starts with a directory name, not a bracket-expression trigger.
  if [[ -n "$VAULT_REL" ]]; then
    GREP_PATTERN="[[$VAULT_REL"
    while IFS= read -r line; do
      [[ -z "$line" ]] && continue
      FILE_PART="${line%%:*}"
      FILE_NORM="${FILE_PART//\\//}"
      SRC_NORM="${SRC//\\//}"
      if [[ "$FILE_NORM" == "$SRC_NORM" ]]; then continue; fi
      if [[ -z "${SEEN_LINES[$line]}" ]]; then
        SEEN_LINES[$line]=1
        HITS="${HITS}${line}"$'\n'
      fi
    done < <(timeout 15 grep -rn -F "$GREP_PATTERN" "$SCOPE_ROOT" \
      --include="*.md" \
      --exclude-dir=".git" \
      --exclude-dir="node_modules" \
      2>/dev/null)
  fi

  # Fallback: stem-only search catches short-form wikilinks ([[Filename]]).
  # Post-filter to require [[ in the line.
  if [[ -n "$STEM" ]]; then
    while IFS= read -r line; do
      [[ -z "$line" ]] && continue
      if [[ "$line" != *"[[$STEM"* ]]; then continue; fi
      FILE_PART="${line%%:*}"
      FILE_NORM="${FILE_PART//\\//}"
      SRC_NORM="${SRC//\\//}"
      if [[ "$FILE_NORM" == "$SRC_NORM" ]]; then continue; fi
      if [[ -z "${SEEN_LINES[$line]}" ]]; then
        SEEN_LINES[$line]=1
        HITS="${HITS}${line}"$'\n'
      fi
    done < <(timeout 15 grep -rn -F "$STEM" "$SCOPE_ROOT" \
      --include="*.md" \
      --exclude-dir=".git" \
      --exclude-dir="node_modules" \
      2>/dev/null)
  fi

  unset SEEN_LINES

  if [[ -z "$HITS" ]]; then
    continue
  fi

  HAS_WARN=1
  HIT_COUNT=$(printf '%s' "$HITS" | grep -c .)
  WARN_LINES="${WARN_LINES}[WARN] ${SRC} was moved. ${HIT_COUNT} wikilink reference(s) to the old name remain:"$'\n'

  DISPLAYED=0
  EXTRA=0
  while IFS= read -r hline; do
    [[ -z "$hline" ]] && continue
    if [[ $DISPLAYED -lt 20 ]]; then
      TRIMMED="${hline:0:200}"
      WARN_LINES="${WARN_LINES}  ${TRIMMED}"$'\n'
      DISPLAYED=$((DISPLAYED + 1))
    else
      EXTRA=$((EXTRA + 1))
    fi
  done <<< "$HITS"

  if [[ $EXTRA -gt 0 ]]; then
    WARN_LINES="${WARN_LINES}  ... +${EXTRA} more"$'\n'
  fi

  WARN_LINES="${WARN_LINES}"$'\n'

done <<< "$MD_SOURCES"

if [[ $HAS_WARN -eq 1 ]]; then
  echo "--- Move Audit (CLAUDE.md Move audit rule) ---"
  printf '%s' "$WARN_LINES"
  echo "The move and the sweep are one unit of work. Update every active reference"
  echo "before session close."
  echo "----------------------------------------------"

  mkdir -p "$SCOPE_ROOT/.runtime" 2>/dev/null
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "unknown")
  {
    echo "[$TIMESTAMP] Bash: unresolved wikilink references after mv"
    printf '%s' "$WARN_LINES"
  } >> "$LOG_FILE" 2>/dev/null
fi

exit 0
