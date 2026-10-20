#!/bin/bash
# outward-gate.sh
# PreToolUse and PostToolUse hook (^mcp__.*|^Bash$|^PowerShell$): the Outward Gate.
# The decision logic lives in outward-gate.mjs, a real module, because shell-quoted
# regex is the shape that takes a whole tool down. This wrapper passes stdin
# through, passes the module's decision JSON out on stdout, and turns any failure
# into exit 2.
#
# FAILS CLOSED. Exit 2 blocks the call on PreToolUse (the hooks reference: "Exit
# with code 2 to block the action"). The registration also carries onFailure
# "block" for a wrapper that cannot start. Write and Edit are never matched, so a
# broken gate leaves the door to repair it.
#
# Configuration: set SOVEREIGN_VAULT_ROOT to the absolute path of your vault root
# (settings.json does this from CLAUDE_PROJECT_DIR). Falls back to the current
# working directory. Optional lists live in outward-gate.config.json beside this
# file; see outward-gate.mjs.
#
# Proven by: hooks-selftest.mjs, the outward-gate cases.

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE="$HOOK_DIR/outward-gate.mjs"

node "$MODULE"
RC=$?

if [[ $RC -ne 0 ]]; then
  echo "OUTWARD GATE HELD THE CALL (exit $RC). Run: node \"Council Chamber/scripts/hooks/hooks-selftest.mjs\"" >&2
  exit 2
fi

exit 0
