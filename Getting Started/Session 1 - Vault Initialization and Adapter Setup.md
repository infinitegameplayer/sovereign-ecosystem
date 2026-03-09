---
status: draft
created: 2026-03-08
session: 1
---

# Session 1 - Vault Initialization and Adapter Setup

Purpose: establish the first working adapter layer so your AI interface can operate inside the Sovereign Ecosystem without becoming the source of truth.

This is the first real setup session.
Move slowly enough that the paths and boundaries make sense.

This is the point where the system starts becoming a place instead of only an idea.

## Session Goal

By the end of this session you should have:
- a working local vault
- a first adapter anchor for your chosen coding interface
- a support structure for that interface if needed
- enough setup to continue into governance initialization

## Principle

The files are primary.
The AI interface is an adapter.

That means:
- your notes stay canonical
- the AI works inside the vault
- the AI does not become the place where truth lives

Simple and working beats elegant and unfinished.
Do not overbuild the bridge before you have crossed it once.

## Step 1 - Confirm Local Workspace

Confirm that the local Sovereign Ecosystem folder exists and opens correctly in Obsidian.

You should be able to see at minimum:
- `Council Chamber/`
- `Library/`
- `Vault (Archive)/`
- `MODULES.md`
- `Sovereign Command.md`

If that structure is missing, stop and fix the workspace before continuing.

## Step 2 - Confirm The Adapter Anchor

The Foundation ships with a template anchor file for your AI interface.

**If using Claude Code:**
Open `.claude/CLAUDE.md` — this file already exists in the vault with the governance anchor structure ready. Confirm it is present and that the tokens (`{{ECOSYSTEM_NAME}}`, `{{AI_INTERFACE_NAME}}`) are visible. You will replace these in Step 5 or during the Session 4 naming checkpoint.

**If using Codex (OpenAI):**
Open `.codex/CODEX.md` — the equivalent anchor for Codex is pre-configured with the same governance structure.

**If using another interface:**
Create the equivalent anchor file for your tool. The minimum it should do:
- identify this vault as your Sovereign Ecosystem
- point the AI toward the governance files
- make clear that vault files are the source of truth, not chat memory

## Step 3 - Confirm `.claude/` Support Structure

The `.claude/` folder ships with the Foundation.
Open it and confirm it contains `CLAUDE.md`.

To make skills available as slash commands, you will link them using your operating system's symlink mechanism. Do this now or after Session 4 once the full skills list is clear.

**Windows (run Command Prompt as Administrator):**
```
mklink /J ".claude\skills\Session Closeout" "Council Chamber\Skills\Session Closeout"
```

**Mac or Linux:**
```
ln -s "Council Chamber/Skills/Session Closeout" ".claude/skills/Session Closeout"
```

Repeat for each skill you want available as a command. Start with just Session Closeout for now — you can add others in Session 4 once you know which skills you will use regularly.

If you are not yet sure which skills matter, skip the symlinks for now and come back after Session 4.

## Step 4 - Confirm Adapter Boundaries

Before going further, confirm:
- the adapter anchor file exists and is readable
- the AI can locate governance files when asked
- the AI is not relying on copied notes outside the vault
- the AI is not being treated as the permanent memory substrate

The goal here is not technical perfection.
The goal is a trustworthy first bridge between:
- you
- your files
- your AI interface

## Step 5 - Handle AI Naming

If you already know your AI interface name, this is the moment to make the visible rename after the adapter is working.

Use:
- [rename-ai-interface.md](rename-ai-interface.md)

Important:
- rename the interface if you want
- keep the underlying Foundation behavior intact for now
- do not turn a naming choice into a full behavioral redesign during Session 1

## Jarvis Baseline Note

You may still encounter `Jarvis` as the shipped baseline during early Foundation.
That is expected.

The initial rename is about visible fit, not deep protocol surgery.

## Rename Prompt

You will notice your AI responds to "Jarvis." That's the default, inherited from the original build. At some point today, you are probably going to want to give it your own name. That does not change how anything works. It changes how it feels. When you are ready, rename it in your adapter anchor and in the visible protocol or skill surfaces that refer to it. Your AI will answer to whatever you call it.

## Why This Session Matters

Think about what becomes possible when structural organization is no longer something you have to carry alone.

This is not only about digital neatness.
It is about capacity.

It can create more room for:
- expression
- curiosity
- experimentation
- clearer follow-through
- building things that have been waiting for enough structure to move through you

Even the process of building this can be organizing.
It can organize the mind.
It can organize the subconscious.
It can create more room than you expected.

Do not pressure this session to be perfect.
Take small steps.
Feel into them.
Stay present with the process.

What you think the system will be at the start of the session may be different from what it wants to become by the end.
That is not failure.
That is iteration.

Follow your aliveness.
Follow your authenticity.
Take it one step at a time.

## Exit Condition

Session 1 is complete when:
- the workspace is locally stable
- the adapter anchor exists
- the basic adapter structure exists
- the naming question is either handled or intentionally deferred

After this, move to Governance Initialization.
