#!/bin/bash
# pre-bash-git-add-guard.sh
# PreToolUse hook (Bash|PowerShell): refuses a sweeping git add or git commit
# aimed at this vault, because other sessions may be working in it at the same
# time and a sweep commits their work in progress. Commit by pathspec instead.
# The decision logic lives in pre-bash-git-add-guard.mjs, a real module, because
# shell-quoted regex is the shape that takes a whole tool down. This wrapper
# passes stdin through, passes the module's decision JSON out on stdout, and
# turns any failure into exit 2.
#
# FAILS CLOSED. Exit 2 blocks the call on PreToolUse. The registration also
# carries onFailure "block" for a wrapper that cannot start. Write and Edit are
# never matched, so a broken guard leaves the door to repair it.
#
# Configuration: SOVEREIGN_VAULT_ROOT names the vault (settings.json sets it
# from CLAUDE_PROJECT_DIR). Unset, the module uses the folder it shipped in.
#
# Proven by: hooks-selftest.mjs, the git-add-guard cases.

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE="$HOOK_DIR/pre-bash-git-add-guard.mjs"

node "$MODULE"
RC=$?

if [[ $RC -ne 0 ]]; then
  echo "GIT-ADD GUARD HELD THE CALL (exit $RC). Run: node \"Council Chamber/scripts/hooks/hooks-selftest.mjs\"" >&2
  exit 2
fi

exit 0
