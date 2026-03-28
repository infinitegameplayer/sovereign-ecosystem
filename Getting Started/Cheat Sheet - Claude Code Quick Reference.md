# Cheat Sheet — Claude Code Quick Reference

Day-one reference for working with your AI inside VS Code.

---

## Starting a Session

1. Open VS Code
2. **File > Open Folder** — select your ecosystem folder
3. Click the Claude Code icon in the left sidebar
4. Start talking

That is it. No commands to memorize. No special syntax. Plain language works.

> **Claude Code Notifier:** if you installed the Notifier extension, you will hear an audible alert when your AI finishes responding or a command completes. Step away during longer operations and come back when you hear it.

---

## How to Talk to Your AI

Ask in plain language. Examples:

- "What's in my Inbox folder?"
- "Summarize what's in my constitution"
- "Help me write a note about my goal for this week"
- "Run session closeout"

Your AI reads the files in your vault and responds in context. The more it learns about you over sessions, the less you have to re-explain.

---

## Permission Approvals

When Claude Code asks for permission to do something, two options appear:

| Option | What it means |
|---|---|
| **Yes** | Approve this one time |
| **Yes, allow for this project** | Approve permanently for this folder |

**Always choose "Yes, allow for this project"** when working inside your ecosystem folder.
Choosing "Yes" means the same prompt will appear again next session.
Choosing the permanent option means it won't.

---

## Session Closeout

At the end of every working session, run session closeout.

What it does:
- Summarizes the work you did
- Creates a continuity log so the next session starts with memory of this one
- Commits your changes organized by theme

How to invoke it: type `session closeout` or `/session-closeout` in the Claude Code panel.

---

## Commit Strategy

**Do not commit changes during a session.**

Git will occasionally prompt you to commit. Ignore it until session closeout runs.

Reason: session closeout creates commits organized by theme. Mid-session commits fragment the history and make rollback harder.

The only exception: you have been explicitly instructed to commit something specific.

---

## Cost Awareness

Claude Code uses the Anthropic API. You pay per session based on how much you use it.

- Onboarding the full Foundation typically runs $10–25 total
- Check your usage at [console.anthropic.com](https://console.anthropic.com) after early sessions
- Short, focused sessions use less context and cost less
- One or two topics per session is the recommended rhythm

---

## Session Rhythm Tips

- Open one topic or task per session. Depth beats breadth.
- Run session closeout before closing VS Code. This is what creates continuity.
- If your AI seems to have lost context, run the activation protocol or start a new session with a brief summary of where you left off.
- The system gets better the more you use it. Early sessions build the memory layer.
