#!/bin/bash
# post-compact-reorienter.sh
# Fires after /compact runs. Re-injects the pre-compact state capture so
# context continuity is preserved without needing a separate primer.md.

STATE_FILE=".runtime/pre-compact-state.md"

if [ -f "$STATE_FILE" ]; then
  echo "--- Post-Compact Reorientation ---"
  cat "$STATE_FILE"
  echo "--- End Reorientation ---"
else
  echo "--- Post-Compact: No pre-compact state found. Proceeding fresh. ---"
fi
