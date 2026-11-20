#!/bin/sh
# pre-write-floor-guard.sh
# PreToolUse hook (Write|Edit|Bash|PowerShell): surfaces any edit to a
# trust-anchor file, through the file tools or through the shell.
#
# Bulk-edit protections catch wholesale rewrites, but a single-line
# non-wildcard edit can slip past them. This closes that path: no edit to a
# trust-anchor file is ever silent.
#
# Trust-anchor files guarded, matched by suffix in any repo:
#   .claude/settings.json   (permissions, hooks, self-modification surface)
#   .claude/settings.local.json (your personal permission grants and hooks)
#   .claude/CLAUDE.md       (the ecosystem trust anchor)
#   .mcp.json               (the MCP servers a session starts)
#   .claude.json            (the home-level config, which also lists MCP servers)
#   .claude/plugins/**      (installed plugins, which carry their own hooks)
#   .vscode/tasks.json      (tasks that can run when a folder opens)
# The last four joined in v3.19.0. They are the persistence paths of the
# Shai-Hulud npm worm wave of October 2026, which writes .claude/settings.json
# and .vscode/tasks.json into every repo it reaches, so they match in any
# repo, not only this vault. settings.local.json joined in v3.19.1: it carries
# the same permissions and hooks as settings.json, and the guard missed it.
#
# This is a surface-and-log guard, not a hard block. Sovereign-directed edits
# to these files are legitimate, so the hook exits 0 and lets the edit
# proceed. Its job is to make the edit loud in the session and durable in
# the log, so a trust-anchor change is always visible to the Sovereign.
# The surface is a systemMessage on stdout, which Claude Code shows. Until
# v3.19.0 it went to stderr alone, which a hook exiting 0 shows nobody outside
# verbose mode. The stderr line stays for anyone reading the hook output.
# Runs alongside pre-tool-approval-gate.sh.
#
# Configuration: set SOVEREIGN_VAULT_ROOT to the absolute path of your vault
# root. Falls back to the current working directory, which is the vault root
# when hooks run under Claude Code.
#
# Shell writes (v3.25.0): an agent can edit the same files with sed -i, a
# redirect, tee, cp, mv, rm or an interpreter write, and with PowerShell's
# Set-Content, Out-File, Copy-Item, Remove-Item and their aliases. Through
# v3.24.0 the guard saw none of it. A Bash or PowerShell call is read by floor-guard-shell.mjs,
# which prints the trust-anchor paths the command writes, moves, copies onto or
# deletes (an rm or mv of .claude, .claude/plugins or .vscode counts, because it
# takes the files inside). Each hit gets the same three outputs as a Write hit.
# Its KNOWN LIMITS (paths built at run time and the like) are named in that
# file's header, so silence on a shell call is not coverage.
#
# When node cannot run on a shell call, the same lesson as v3.13.0 applies: a
# plain grep of the raw payload looks for any trust-anchor name and surfaces the
# call, worded as "matched by name without parsing". That reading cannot tell a
# write from a read, so it may surface a harmless cat. Unknown resolves toward
# visible. Write and Edit are read as they always were.
#
# Invoked by the AI interface's PreToolUse hook before each Write, Edit, Bash or
# PowerShell call. Register it on all four:  "matcher": "Write|Edit|Bash|PowerShell"

VAULT_ROOT="${SOVEREIGN_VAULT_ROOT:-$PWD}"
HOOK_DIR=$(cd "$(dirname "$0")" 2>/dev/null && pwd)
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

  # Resolve . and .. segments before matching. Until v3.18.0 the match read the
  # path as spelled, so .claude/hooks/../CLAUDE.md and .claude/./settings.json
  # reached a trust anchor in silence. awk rather than node, so the no-parser
  # path gets the same resolution. Proven by the "smuggle" floor-guard cases in
  # hooks-selftest.mjs.
  NORM=$(printf '%s' "$NORM" | awk -F/ '{
    n = 0
    for (i = 1; i <= NF; i++) {
      s = $i
      if (s == ".") continue
      if (s == ".." && n > 0 && seg[n] != ".." && seg[n] != "") { n--; continue }
      seg[++n] = s
    }
    out = seg[1]
    for (i = 2; i <= n; i++) out = out "/" seg[i]
    print out
  }')

  if printf '%s' "$NORM" | grep -qiE '\.claude/(settings\.json|settings\.local\.json|CLAUDE\.md)$|(^|/)\.mcp\.json$|(^|/)\.claude\.json$|(^|/)\.claude/plugins/.+$|(^|/)\.vscode/tasks\.json$'; then
    mkdir -p "$VAULT_ROOT/.runtime" 2>/dev/null
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "unknown")
    # NORM carries no backslashes, so a double quote is the one character to escape.
    SHOWN=$(printf '%s' "$NORM" | sed 's/"/\\"/g')
    printf '{"systemMessage":"TRUST-ANCHOR FILE EDIT: %s on %s. Confirmation required. Surfaced, not blocked."}\n' "$TOOL_NAME" "$SHOWN"
    echo "TRUST-ANCHOR FILE EDIT: $TOOL_NAME on $FILE_PATH. Confirmation required. Surfaced, not blocked." >&2
    echo "[$TIMESTAMP] $TOOL_NAME: $FILE_PATH" >> "$LOG_FILE" 2>/dev/null
  fi
fi

if [ "$TOOL_NAME" = "Bash" ] || [ "$TOOL_NAME" = "PowerShell" ]; then
  HITS=""
  PARSED=0
  if [ "$NO_PARSER" -eq 0 ] && [ -f "$HOOK_DIR/floor-guard-shell.mjs" ]; then
    RESULT=$(printf '%s' "$INPUT" | node "$HOOK_DIR/floor-guard-shell.mjs" 2>/dev/null)
    if [ $? -eq 0 ] && [ -n "$RESULT" ]; then
      # Line 1 of HITS names every hit for the message, the lines after it are
      # the log entries. Prints nothing when the command hit no trust anchor.
      HITS=$(printf '%s' "$RESULT" | node -e "
        var d = '';
        process.stdin.on('data', function(c) { d += c; });
        process.stdin.on('end', function() {
          var j = JSON.parse(d);
          if (!j.hits.length) return;
          var named = j.hits.map(function(h) { return h.path + (h.via ? ' via ' + h.via : ''); }).join('; ');
          var lines = j.hits.map(function(h) { return j.tool + (h.via ? ' (' + h.via + ')' : '') + ': ' + h.path; });
          process.stdout.write(named + '\n' + lines.join('\n') + '\n');
        });
      " 2>/dev/null)
      [ $? -eq 0 ] && PARSED=1
    fi
  fi

  mkdir -p "$VAULT_ROOT/.runtime" 2>/dev/null
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "unknown")

  if [ "$PARSED" -eq 1 ]; then
    if [ -n "$HITS" ]; then
      NAMED=$(printf '%s\n' "$HITS" | head -1 | sed 's/\\/\\\\/g; s/"/\\"/g')
      RAWNAMED=$(printf '%s\n' "$HITS" | head -1)
      printf '{"systemMessage":"TRUST-ANCHOR FILE EDIT: %s on %s. Confirmation required. Surfaced, not blocked."}\n' "$TOOL_NAME" "$NAMED"
      echo "TRUST-ANCHOR FILE EDIT: $TOOL_NAME on $RAWNAMED. Confirmation required. Surfaced, not blocked." >&2
      printf '%s\n' "$HITS" | tail -n +2 | sed "s/^/[$TIMESTAMP] /" >> "$LOG_FILE" 2>/dev/null
    fi
  else
    # The module could not run or answer. Flatten the raw payload to forward
    # slashes and look for any trust-anchor name, including a bare .claude or
    # .vscode directory, which an rm or mv takes with the files inside.
    FLAT=$(printf '%s' "$INPUT" | tr '\\' '/' | tr -s '/')
    MATCH=$(printf '%s' "$FLAT" | grep -oiE '\.claude([^[:alnum:]_-]|$)|\.mcp\.json|\.vscode([^[:alnum:]_-]|$)' | head -1)
    if [ -n "$MATCH" ]; then
      SHOWN=$(printf '%s' "$MATCH" | sed 's/"/\\"/g')
      printf '{"systemMessage":"TRUST-ANCHOR FILE EDIT: %s command names a trust-anchor path (%s). Matched by name without parsing, so it may only read it. Confirmation required. Surfaced, not blocked."}\n' "$TOOL_NAME" "$SHOWN"
      echo "TRUST-ANCHOR FILE EDIT: $TOOL_NAME command names a trust-anchor path ($MATCH). Matched by name without parsing. Confirmation required. Surfaced, not blocked." >&2
      echo "[$TIMESTAMP] $TOOL_NAME (matched by name, unparsed): $MATCH" >> "$LOG_FILE" 2>/dev/null
    fi
  fi
fi

exit 0
