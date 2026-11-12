#!/usr/bin/env node
// emit-context.mjs
// Wraps a hook's warning text, read from stdin, as the JSON the AI reads:
//   {"hookSpecificOutput":{"hookEventName":"<event>","additionalContext":"<text>"}}
//
// Why (v3.22.0): a PostToolUse hook's plain stdout on exit 0 never reaches the
// AI. Claude Code writes it to the debug log; stdout reaches the model only on
// UserPromptSubmit, UserPromptExpansion, SessionStart and PostModelSwitch
// (hooks reference, read 2026-11-11). Through v3.21.0 the em dash check, the
// move audit and the encoding check all printed plain stdout, so each fired,
// printed its warning and was never read by the AI it was written for. A live
// run on Claude Code 2.1.322 showed it: the em dash hook printed
// "[WARN] 1 em dash(es) found" and the AI reported no feedback at all.
// additionalContext is the PostToolUse channel the AI reads, shown next to the
// tool result.
//
// Usage, from a bash hook in this folder:
//   printf '%s' "$OUT" | node "$HOOK_DIR/emit-context.mjs" [EventName]
// EventName defaults to PostToolUse. Empty or whitespace-only input prints
// nothing, so a clean check stays silent.

let d = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { d += c; });
process.stdin.on('end', () => {
  if (!d.trim()) return;
  const event = process.argv[2] || 'PostToolUse';
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: d } }) + '\n');
});
