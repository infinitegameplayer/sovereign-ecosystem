#!/bin/bash
# post-compact-reorienter.sh
# Fires after /compact runs. Re-injects the pre-compact state capture so
# context continuity is preserved without needing a separate primer.md.

# Anchored to the vault, never to the working directory. This must resolve to
# the exact same path pre-compact-state-capture.sh writes to. When the two
# disagree, this hook reports "no state found" while the state sits elsewhere,
# and the failure is invisible: a reorienter that finds nothing looks the same
# as a session that had nothing to reorient.
VAULT_ROOT="${SOVEREIGN_VAULT_ROOT:-$PWD}"
STATE_FILE="$VAULT_ROOT/.runtime/pre-compact-state.md"

if [ -f "$STATE_FILE" ]; then
  echo "--- Post-Compact Reorientation ---"
  cat "$STATE_FILE"
  echo "--- End Reorientation ---"
else
  echo "--- Post-Compact: No pre-compact state found. Proceeding fresh. ---"
fi
