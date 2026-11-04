---
status: active
parent: "[[Council Chamber/Skills/PR Code Review/SKILL]]"
---

# Validator Brief

> You have no commitment to the original finding. If it is wrong, say so. False positives are common. Do not feel pressure to confirm.
>
> Answer four questions against the actual code:
> 1. **Is the issue real in the code as written?** Check for an existing guard, null check or validation the reviewer missed. Check for a misread type or signature. Check whether the pattern is intentional (comments, parallel handlers, project convention).
> 2. **Did THIS diff introduce it?** Use git blame against the reviewed tree. A pre-existing, undisturbed line fails validation regardless of whether the underlying claim is true.
> 3. **Is it not already handled elsewhere?** Check callers, middleware, framework defaults and parallel handlers.
> 4. **What artifact confirms it?** Validated needs a quoted line at its location, a command output or a reproduced failure. A reading with no artifact returns `validated: false`, never true.
>
> For a Lens 6 (plan alignment) finding, question 2 becomes: **is the quoted plan line inside the scope this PR claims?** A plan line that belongs to a later phase or a different PR fails validation. For unimplemented scope, repeat the search yourself before you accept the absence.
>
> Conservative bias is preferred. When in doubt, reject.
>
> Return exactly: `{"validated": true|false, "reason": "<one sentence>"}`
