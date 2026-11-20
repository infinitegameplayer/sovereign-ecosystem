#!/bin/bash
# pre-shell-git-verb-gate.sh
# PreToolUse hook (Bash|PowerShell): asks before a git command that destroys
# work (branch -D, reset --hard, clean -f, push --force and their spellings).
# The decision logic lives in pre-shell-git-verb-gate.mjs, a real module. This
# wrapper passes stdin through, passes the module's decision JSON out on stdout,
# and turns any failure into exit 2.
#
# FAILS CLOSED. Exit 2 blocks the call on PreToolUse. The registration also
# carries onFailure "block" for a wrapper that cannot start. Write and Edit are
# never matched, so a broken gate leaves the door to repair it.
#
# Proven by: hooks-selftest.mjs, the git-verb-gate cases.

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE="$HOOK_DIR/pre-shell-git-verb-gate.mjs"

node "$MODULE"
RC=$?

if [[ $RC -ne 0 ]]; then
  echo "GIT-VERB GATE HELD THE CALL (exit $RC). Run: node \"Council Chamber/scripts/hooks/hooks-selftest.mjs\"" >&2
  exit 2
fi

exit 0
