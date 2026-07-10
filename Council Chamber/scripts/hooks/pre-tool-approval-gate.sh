#!/bin/sh
# pre-tool-approval-gate.sh
# PreToolUse hook (Bash|PowerShell): enforces approval gates on destructive
# shell operations against ecosystem content.
#
# Hard blocks (exit 2):
#   rm *.md inside the vault   -- accidental deletion of ecosystem content
#   git rm *.md                -- same, via git
#   mv *.md OUT of the vault   -- moving content outside the vault boundary
#   git mv *.md                -- always blocked (not a supported archival pattern)
#   bypass attempts via node, python, cmd or PowerShell embedded deletes/moves
#
# Allowed:
#   mv *.md within the vault   -- any internal move (Inbox to Library, etc.)
#   rm *.md outside the vault  -- scratch files, adapter paths, etc.
#
# A gate written against one shell tool does not automatically cover a
# second shell tool with equivalent capability. This file covers both the
# Bash tool and the PowerShell tool: same wall, second door.
#
# Configuration: set SOVEREIGN_VAULT_ROOT to the absolute path of your vault
# root. Falls back to the current working directory, which is the vault root
# when hooks run under Claude Code.
#
# Invoked by the AI interface's PreToolUse hook before each Bash or
# PowerShell call.

# ── CONFIGURE THIS ──────────────────────────────────────────────────────────
VAULT_ROOT="${SOVEREIGN_VAULT_ROOT:-$PWD}"

# File extensions this gate protects from bulk deletion and off-boundary
# moves. Space separated, no leading dots. Add more to widen coverage, e.g.
#   PROTECTED_EXTENSIONS="md txt canvas"
PROTECTED_EXTENSIONS="md"
# ────────────────────────────────────────────────────────────────────────────

EXT_RE=$(printf '%s' "$PROTECTED_EXTENSIONS" | tr ' ' '|')
VAULT_FWD=$(printf '%s' "$VAULT_ROOT" | tr '\\' '/')
VAULT_BACK=$(printf '%s' "$VAULT_ROOT" | tr '/' '\\')

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

# Returns success when $1 contains a vault-boundary marker (forward or
# backslash form), i.e. the text points inside the resolved vault root.
in_vault() {
  if printf '%s' "$1" | grep -qF "$VAULT_FWD"; then
    return 0
  fi
  if printf '%s' "$1" | grep -qF "$VAULT_BACK"; then
    return 0
  fi
  return 1
}

# ─── Bash: structural change detection ──────────────────────────────────────

if [ "$TOOL_NAME" = "Bash" ]; then
  COMMAND=$(printf '%s' "$INPUT" | node -e "
    var d = '';
    process.stdin.on('data', function(c) { d += c; });
    process.stdin.on('end', function() {
      try {
        var j = JSON.parse(d);
        process.stdout.write((j.tool_input && j.tool_input.command) || '');
      } catch(e) { process.stdout.write(''); }
    });
  " 2>/dev/null)

  # rm of protected files -- block only inside the vault
  if printf '%s' "$COMMAND" | grep -qE "(^|[;&|]|[[:space:]])(rm[[:space:]]).*\.($EXT_RE)"; then
    if in_vault "$COMMAND"; then
      echo "BLOCKED: Deletion of a protected content file (.$EXT_RE type) requires approval." >&2
      echo "Command: $COMMAND" >&2
      exit 2
    fi
    # protected files outside the vault (scratch, adapters, etc.) -- allowed
  fi

  # git rm of protected files -- always hard block
  if printf '%s' "$COMMAND" | grep -qE "(^|[;&|]|[[:space:]])git rm.*\.($EXT_RE)"; then
    echo "BLOCKED: git rm of a protected content file requires approval." >&2
    echo "Command: $COMMAND" >&2
    exit 2
  fi

  # git mv of protected files -- always hard block (not a supported archival pattern)
  if printf '%s' "$COMMAND" | grep -qE "(^|[;&|]|[[:space:]])git mv.*\.($EXT_RE)"; then
    echo "BLOCKED: git mv of a protected content file requires approval." >&2
    echo "Command: $COMMAND" >&2
    exit 2
  fi

  # mv of protected files -- block only when destination is absolute AND outside the vault
  # Relative destinations are CWD-bound; hooks run from inside the vault.
  if printf '%s' "$COMMAND" | grep -qE "(^|[;&|]|[[:space:]])mv[[:space:]].*\.($EXT_RE)"; then
    # Capture each argument whole (quoted or bare) so a destination path with
    # spaces is not broken apart by naive whitespace splitting, then take the
    # last one as the destination.
    MV_ARGS=$(printf '%s' "$COMMAND" | grep -oE "\"[^\"]*\"|'[^']*'|[^[:space:]]+")
    DEST_RAW=$(printf '%s\n' "$MV_ARGS" | tail -1)
    DEST=$(printf '%s' "$DEST_RAW" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
    case "$DEST" in
      /*|[A-Za-z]:*|~/*)
        # absolute destination -- must resolve inside the vault
        if ! in_vault "$DEST"; then
          echo "BLOCKED: Moving a protected content file outside the vault requires approval." >&2
          echo "Command: $COMMAND" >&2
          exit 2
        fi
        ;;
      *)
        # relative destination -- CWD-bound, vault-internal, allowed
        ;;
    esac
  fi

  # fs.unlinkSync / fs.rmSync of protected files: block bypass via node -e embedded scripts
  if printf '%s' "$COMMAND" | grep -qE '(fs\.unlinkSync|fs\.rmSync|fs\.promises\.unlink|fs\.promises\.rm)[[:space:]]*\('; then
    if printf '%s' "$COMMAND" | grep -qE "\.($EXT_RE)['\"\`]"; then
      echo "BLOCKED: Node fs unlink/rm of a protected file bypasses the deletion gate. Requires approval." >&2
      echo "Command: $COMMAND" >&2
      exit 2
    fi
  fi

  # PowerShell Remove-Item on protected files: block bypass via pwsh/powershell invoked from Bash
  if printf '%s' "$COMMAND" | grep -qiE "(powershell|pwsh).*Remove-Item.*\.($EXT_RE)"; then
    if in_vault "$COMMAND"; then
      echo "BLOCKED: PowerShell Remove-Item of a protected file bypasses the deletion gate. Requires approval." >&2
      echo "Command: $COMMAND" >&2
      exit 2
    fi
  fi

  # Python unlink/remove of protected files: block bypass via python -c embedded scripts
  if printf '%s' "$COMMAND" | grep -qiE '(python|python3|py)[[:space:]]+-c'; then
    if printf '%s' "$COMMAND" | grep -qE '(os\.remove|os\.unlink|shutil\.rmtree|Path\([^)]*\)\.unlink|\.unlink\(\))'; then
      if printf '%s' "$COMMAND" | grep -qE "\.($EXT_RE)['\"\`]"; then
        echo "BLOCKED: Python remove/unlink of a protected file bypasses the deletion gate. Requires approval." >&2
        echo "Command: $COMMAND" >&2
        exit 2
      fi
    fi
  fi

  # Windows cmd /c del of protected files: block bypass via cmd shell
  if printf '%s' "$COMMAND" | grep -qiE "cmd(\.exe)?[[:space:]]+/[cC].*(del|erase).*\.($EXT_RE)"; then
    if in_vault "$COMMAND"; then
      echo "BLOCKED: cmd del of a protected file bypasses the deletion gate. Requires approval." >&2
      echo "Command: $COMMAND" >&2
      exit 2
    fi
  fi
fi

# ─── PowerShell tool: same deletion and move gates, PowerShell-native verbs ──
# A gate written against the Bash tool does not automatically cover the
# PowerShell tool: same wall, second door. Covers Remove-Item and its
# aliases (rm, ri, del, erase), .NET IO deletes, git rm and git mv, and moves
# whose absolute destination sits outside the vault.

if [ "$TOOL_NAME" = "PowerShell" ]; then
  COMMAND=$(printf '%s' "$INPUT" | node -e "
    var d = '';
    process.stdin.on('data', function(c) { d += c; });
    process.stdin.on('end', function() {
      try {
        var j = JSON.parse(d);
        process.stdout.write((j.tool_input && j.tool_input.command) || '');
      } catch(e) { process.stdout.write(''); }
    });
  " 2>/dev/null)

  # Remove-Item and aliases on protected files
  if printf '%s' "$COMMAND" | grep -qiE "(^|[;&|({[:space:]])(Remove-Item|rm|ri|del|erase)[[:space:]].*\.($EXT_RE)"; then
    if in_vault "$COMMAND"; then
      echo "BLOCKED: PowerShell deletion of a protected content file requires approval." >&2
      echo "Command: $COMMAND" >&2
      exit 2
    fi
  fi

  # .NET IO delete/move bypass
  if printf '%s' "$COMMAND" | grep -qiE '\[(System\.)?IO\.(File|Directory)\]::(Delete|Move)' && printf '%s' "$COMMAND" | grep -qiE "\.($EXT_RE)"; then
    if in_vault "$COMMAND"; then
      echo "BLOCKED: .NET IO delete/move of a protected file bypasses the gate. Requires approval." >&2
      echo "Command: $COMMAND" >&2
      exit 2
    fi
  fi

  # git rm / git mv via the PowerShell tool: always hard block
  if printf '%s' "$COMMAND" | grep -qiE "(^|[;&|[:space:]])git[[:space:]]+(rm|mv)[[:space:]].*\.($EXT_RE)"; then
    echo "BLOCKED: git rm/mv of a protected content file requires approval." >&2
    echo "Command: $COMMAND" >&2
    exit 2
  fi

  # Move-Item / move / mi on protected files: block when any absolute path token sits outside the vault
  # Quoted tokens are captured whole (vault paths may contain spaces), so the
  # loop splits on newlines only, not on spaces inside a captured path.
  if printf '%s' "$COMMAND" | grep -qiE "(^|[;&|({[:space:]])(Move-Item|move|mi)[[:space:]].*\.($EXT_RE)"; then
    MOVE_TOKENS=$(printf '%s' "$COMMAND" | grep -oE "\"[A-Za-z]:[\\\\/][^\"]*\"|'[A-Za-z]:[\\\\/][^']*'|[A-Za-z]:[\\\\/][^\"'[:space:]]*")
    OLD_IFS=$IFS
    IFS='
'
    for t in $MOVE_TOKENS; do
      IFS=$OLD_IFS
      CLEAN_T=$(printf '%s' "$t" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
      if [ -n "$CLEAN_T" ] && ! in_vault "$CLEAN_T"; then
        echo "BLOCKED: PowerShell move of a protected file to a destination outside the vault requires approval." >&2
        echo "Command: $COMMAND" >&2
        exit 2
      fi
      IFS='
'
    done
    IFS=$OLD_IFS
  fi
fi

exit 0
