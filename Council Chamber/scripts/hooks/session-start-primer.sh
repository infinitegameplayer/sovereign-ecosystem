#!/bin/sh
# session-start-primer.sh
# SessionStart hook (startup and clear): injects the Primer so every session
# begins oriented without a manual read. The Primer is stored state, read as
# data. It orients; it does not command.
#
# Also surfaces the BOOTSTRAP wizard on a fresh clone, so the very first
# session opens knowing what its first move is.
#
# Runs from the vault root. Non-blocking, output-only, safe.

if [ -f "BOOTSTRAP.md" ]; then
  echo "--- First Run Detected ---"
  echo "BOOTSTRAP.md is present, so this vault has not been personalized yet."
  echo "Suggested first move: the Sovereign asks the AI interface to read BOOTSTRAP.md and run the wizard."
  echo "--- End First Run Note ---"
fi

if [ -f "Primer.md" ]; then
  echo "--- Primer (forward handoff) ---"
  cat "Primer.md"
  echo "--- End Primer ---"
else
  echo "--- No Primer.md found at vault root. Session opens fresh. ---"
fi
