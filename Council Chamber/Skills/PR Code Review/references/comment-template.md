---
status: active
parent: "[[Council Chamber/Skills/PR Code Review/SKILL]]"
---

# Comment Template

---

### Code review

Found [N] issues:

1. [Brief description of issue] (CLAUDE.md says "[exact quote]")

[Link to file and line: full SHA, line range with at least 1 line of context on each side]
https://github.com/[owner]/[repo]/blob/[full-sha]/[path/to/file]#L[start]-L[end]

2. [Brief description of issue] (bug due to [file and code snippet])

[Link]

---

If no issues passed the filter, post:

---

### Code review

No issues found. Checked for bugs and CLAUDE.md compliance.

🤖 Generated with [Claude Code](https://claude.ai/code)

---

When Lens 6 ran, the no-issues line reads "Checked for bugs, CLAUDE.md compliance and alignment with the governing plan." When it returned `no-plan-found`, the line stays as above. The comment never claims a plan check that did not happen.
