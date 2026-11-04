---
status: active
parent: "[[Council Chamber/Skills/Autonomous Improvement Session/SKILL]]"
---

# Step 9: Commit, then present the board detail

The tool calls come first, so the board is the last thing the Sovereign sees.

1. **Commit by path, twice when Acts items edited files.** `git add` names each file the run touched, new files by name, and `git commit` takes the same paths: the edited files first, then write that commit into this run's fix checks and commit the log with the rest. A fix check left with no commit reads unverifiable at the next re-check. Never `git add -A` and never a path the run did not touch: sibling sessions may hold uncommitted work in the same tree. A run never edits its own skill files (the Floor); that is the return session's work.
2. **Check the board before sending it.** Four headings in order (Done, Your decisions, Your hands, Plans to approve), an empty one saying "None this run.", and a Verified line on every Your-decisions and Plans entry. A Stop hook in your AI interface can hold this shape for you if you choose to add one. Each Your-decisions and Plans entry is a numbered line, its options sit under it as bullets and never as numbers, and it carries one Verified line. A Done line reads `[Item ID]: [outcome]`. A Your-hands item names the action, why only those hands can do it and the fastest route.
3. **Render the whole board as the closing message.** Every entry in full with its recommendation and its Verified line, never a count, a digest or a link. The test: a Sovereign who opens no file can read and answer the whole board from the message alone. Pointing the Sovereign at a file in place of the board is the failure this step exists to prevent. A run that halted before its board says "No board this run" instead.
4. **End the message** with one line after the full board: "Log updated. Answer any item inline and I will run the return session."
