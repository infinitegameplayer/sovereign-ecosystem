#!/bin/bash
# pre-compact-state-capture.sh
# PreCompact hook: writes a state snapshot before context window compression fires.
#
# Purpose: prevents disorientation during long sessions (weekly reviews, coaching sessions,
# multi-session builds). Gives the Sovereign a breadcrumb if the session needs to be resumed
# from a different terminal or a later date.
#
# Output: .runtime/pre-compact-state.md (overwritten each time compression fires)
# Runs from vault root. .runtime/ is relative to the vault.

RUNTIME_DIR=".runtime"
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
