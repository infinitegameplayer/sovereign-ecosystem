#!/bin/bash
# pre-compact-state-capture.sh
# PreCompact hook: writes a state snapshot before context window compression fires.
#
# Purpose: prevents disorientation during long sessions (weekly reviews, coaching sessions,
# multi-session builds). Gives the Sovereign a breadcrumb if the session needs to be resumed
# from a different terminal or a later date.
#
# Output: <vault>/.runtime/pre-compact-state.md (overwritten each time compression fires)
#
# Anchored to the vault, never to the working directory.
#
# This was a bare relative ".runtime", which resolves against wherever the hook
# is invoked from. Fired from a subdirectory it silently created a second,
# orphaned .runtime there, and the snapshot its sibling post-compact-reorienter.sh
# later looked for at the vault root was never written. The capture reported
# success and the state was gone. Every other write-hook in this directory
# already accepted SOVEREIGN_VAULT_ROOT. This one simply never asked for it.
VAULT_ROOT="${SOVEREIGN_VAULT_ROOT:-$PWD}"
RUNTIME_DIR="$VAULT_ROOT/.runtime"
STATE_FILE="$RUNTIME_DIR/pre-compact-state.md"

mkdir -p "$RUNTIME_DIR" 2>/dev/null

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "unknown")

cat > "$STATE_FILE" << EOF
# Pre-Compact State Snapshot

**Captured:** $TIMESTAMP

Context compression fired. Resume with: claude --continue

---
*Written by pre-compact-state-capture.sh (PreCompact hook)*
EOF

exit 0
