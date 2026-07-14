#!/bin/sh
# post-write-index-regen.sh
# PostToolUse hook: regenerate auto-generated indexes when their source files change.
#
# Triggers:
#   - Write or Edit to any Council Chamber/Skills/*/SKILL.md    -> rebuild Skills Index
#   - Write or Edit to any Council Chamber/Pending Plans/*.md   -> rebuild Pending Plans Index
#
# Silent on success. Errors go to stderr and do not block the session.
#
# Index regen approach: CONFIGURATION BLOCK
# The Sovereign Ecosystem ships Skills Index and Pending Plans Index as
# static Markdown files with no bundled regen script. This hook ships with
# a clearly-marked configuration block. Point SKILLS_REGEN_CMD and
# PENDING_REGEN_CMD at your own regen scripts if you automate index builds.
# Leave them empty to skip regen (the hook will still log the trigger).
#
# Configuration: set VAULT_ROOT to the absolute path of your vault root,
# and optionally point the regen commands at your own build scripts.
# Example:
#   VAULT_ROOT="C:/Users/yourname/Documents/MyEcosystem"
#   SKILLS_REGEN_CMD="node \"$VAULT_ROOT/Council Chamber/scripts/build-skills-index.mjs\""
#   PENDING_REGEN_CMD="node \"$VAULT_ROOT/Council Chamber/scripts/build-pending-plans-index.mjs\""
#
# Registration in .claude/settings.json (add inside the "hooks" object):
#
#   "PostToolUse": [
#     {
#       "matcher": "Write|Edit",
#       "hooks": [
#         {
#           "type": "command",
#           "command": "bash \"[your-vault-path]/Council Chamber/scripts/hooks/post-write-index-regen.sh\""
#         }
#       ]
#     }
#   ]

# ── CONFIGURE THIS ──────────────────────────────────────────────────────────
VAULT_ROOT="${SOVEREIGN_VAULT_ROOT:-$PWD}"

# The Skills Index regen ships wired to a real script and works out of the box.
#
# It did not, for a long time. This hook shipped with both commands set to empty
# strings and no regen script anywhere in the repo to point them at, so it logged
# "trigger detected (no regen cmd configured)" on every write and regenerated
# nothing, forever. It read as protective and could not act. In that time a real
# skill (Ecosystem Update Check) went missing from the Index and stayed missing:
# present on disk, invisible to the AI interface, which is the exact drift this
# hook was named for.
#
# A hook that reports it noticed is not a hook that acted.
SKILLS_REGEN_CMD="node \"$VAULT_ROOT/Council Chamber/scripts/build-skills-index.mjs\""

# No Pending Plans index builder ships yet. This one is honestly empty, and the
# hook says so in the log rather than implying it did something.
PENDING_REGEN_CMD=""
# ────────────────────────────────────────────────────────────────────────────

INPUT=$(cat)

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

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

LOG_FILE=""
if [ -n "$VAULT_ROOT" ]; then
  mkdir -p "$VAULT_ROOT/.runtime" 2>/dev/null
  LOG_FILE="$VAULT_ROOT/.runtime/index-regen.log"
fi

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "unknown")

log() {
  if [ -n "$LOG_FILE" ]; then
    echo "[$TIMESTAMP] $1" >> "$LOG_FILE"
  fi
}

# Skills Index regen: fires when any SKILL.md under Council Chamber/Skills/ is written.
case "$FILE_PATH" in
  *"Council Chamber"*"Skills"*"SKILL.md"|*"Council Chamber"*"Skills"*"SKILL.md")
    # More precise check using grep
    if printf '%s' "$FILE_PATH" | grep -qE 'Council Chamber[/\\]Skills[/\\][^/\\]+[/\\]SKILL\.md$'; then
      if [ -n "$SKILLS_REGEN_CMD" ]; then
        eval "$SKILLS_REGEN_CMD" >/dev/null 2>&1
        STATUS=$?
        if [ $STATUS -eq 0 ]; then
          log "skills-index regenerated after write to: $FILE_PATH"
        else
          log "skills-index regen FAILED (status $STATUS) after write to: $FILE_PATH"
        fi
      else
        log "skills-index trigger detected (no regen cmd configured): $FILE_PATH"
      fi
    fi
    ;;
esac

# Pending Plans Index regen: fires when any .md under Pending Plans/ is written.
if printf '%s' "$FILE_PATH" | grep -qE 'Pending Plans[/\\][^/\\]+\.md$'; then
  if [ -n "$PENDING_REGEN_CMD" ]; then
    eval "$PENDING_REGEN_CMD" >/dev/null 2>&1
    STATUS=$?
    if [ $STATUS -eq 0 ]; then
      log "pending-plans-index regenerated after write to: $FILE_PATH"
    else
      log "pending-plans-index regen FAILED (status $STATUS) after write to: $FILE_PATH"
    fi
  else
    log "pending-plans-index trigger detected (no regen cmd configured): $FILE_PATH"
  fi
fi

exit 0
