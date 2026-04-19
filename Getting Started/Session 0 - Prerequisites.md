---
status: draft
created: 2026-03-08
session: 0
---

# Session 0 - Prerequisites

Purpose: get the minimum environment ready before Foundation setup begins.

> **If you are reading this:** you have already downloaded the Sovereign Ecosystem from GitHub and opened it as an Obsidian vault — or you are previewing from the GitHub repo before downloading. Either way: this session confirms that the rest of your environment is ready before setup begins.

This session is intentionally practical.
No deep architecture work yet.
Just get the base tools and names in place.

It is also a self-location session.
Before you build, get honest about where you are actually starting.

## What You Need

- Obsidian installed
- Claude Code installed
- or Codex available as your working AI interface
- a GitHub account
- the Sovereign Ecosystem files available locally

## Session 0 Checklist

- [ ] **Pre-flight:** check whether your Desktop or Documents folder syncs to OneDrive (Windows) or iCloud Drive (Mac). If it does, note a plain local path to use for the ecosystem folder instead — something outside the sync boundary. Minor to catch early, harder to fix later.
- [ ] Install Obsidian.
- [ ] Confirm you can open a local vault.
- [ ] Decide whether you want mobile access and quick mobile capture.
- [ ] Install or confirm your primary AI coding interface.
- [ ] Confirm you have a GitHub account.
- [ ] Confirm the Sovereign Ecosystem exists locally on your machine — not inside a cloud-synced folder.
- [ ] If you may want to mine previous AI history, start exporting it now. Exports from platforms like ChatGPT are processed asynchronously — the download link arrives by email and can take 3–12 hours. Start early and continue setup while you wait.
- [ ] Choose an ecosystem name or keep the placecard for now.
- [ ] Choose an AI interface name or keep the placecard for now.

## Locate Yourself First

Before you move on, get a little context on your actual starting point.

Useful questions:
- Have you used AI before?
- If yes, how much and for what?
- Have you used tools like Obsidian before?
- Are local-first workflows familiar, or is this your first one?
- Do you tend to learn best by analogy, by direct instruction, or by trial and error?

This matters because the ecosystem should meet you where you are.
Some people will move quickly through setup.
Some will want slower pacing, more examples, and more translation from old workflows into new ones.

If your AI interface knows that context early, it can guide more intelligently.

## Recommended Tooling

### Obsidian

Use Obsidian because the files stay local, transparent, and portable.

If mobile capture matters to you, install Obsidian on your phone as well.

Many people find that the phone app becomes valuable for quick captures:
- a note you do not want to lose
- a task that wants to leave your head
- a thought you want parked somewhere safe so you can come back to the present moment

If you want that phone-to-desktop continuity, Obsidian Sync is a useful paid option.
It is not required.
It is simply one of the smoother ways to keep the same vault available across devices.

One practical use case:
drop a quick line into your to-do surface from your phone, get it out of your head, and return to what you were doing.

### AI Interface

Claude Code is the recommended starting path. Two options:

**VS Code + Claude Code Extension (recommended):** A full code editor with file tree, terminal and extensions. More capability as you grow into the workspace. Install VS Code, then install the Claude Code extension by Anthropic from the Extensions sidebar.

**Claude Code App:** A standalone desktop app with a simpler interface. Opens folders as projects, reads and writes files directly. Good for someone who wants the AI conversation without the code editor. Download from claude.ai/code.

Either option works. VS Code gives you more tools around the conversation. The Claude Code app gives you a cleaner, focused interface. Both read and write the same files.

The ecosystem is designed to become more tool-agnostic over time.
The long-term direction is more sovereign tooling, not dependency on one vendor forever.

**Cost note:** Claude Code authenticates through your Anthropic account. Two paths: (1) Claude Pro subscription ($20/month, usage included), or (2) the free tier with usage limits. When you open Claude Code in VS Code or the Claude Code app, you sign in with your Anthropic account. No API keys or billing console required. If you are using the CLI version of Claude Code, it can also authenticate via API key with pay-per-token pricing.

If you have a prior AI platform with a meaningful history, start the export request now.
Session 0.5 can use that material later for pattern analysis, but the export may take time to arrive.

### Voice Layer (Optional)

If speaking is more natural for you than typing, consider adding a voice dictation layer early.

One current option is `Wispr Flow`.
Wispr Flow typically offers a free trial period before a paid tier — check their site for current pricing, as this changes over time.

This is optional.
The ecosystem still works perfectly well with typing.

The reason to consider something like this is simple:
- it reduces friction during setup
- it lets you think out loud instead of keyboarding every idea
- it can make naming, reflections, session notes, and early capture much faster

If you want to try it:
- download it on your computer
- use the trial period to see whether voice actually helps your workflow
- keep only what feels useful after real use

This is especially helpful if:
- you think faster than you type
- you like talking ideas through
- you want the setup process to feel more conversational and less mechanical

Treat it as a support layer, not a requirement.
The goal is to make the build easier, not to add one more thing you feel like you are supposed to use.

## Naming Prompts

You do not need perfect names today.
You do want names early enough that the system can start feeling like yours.

### Ecosystem Name

Examples:
- `[Name] OS`
- `Kingdom`
- another name that fits your world

If you are unsure, keep `{{ECOSYSTEM_NAME}}` for now and decide by the Foundation naming checkpoint before module selection.

### AI Interface Name

The shipped baseline behavior still uses `Jarvis` through early Foundation.
That is a starting point, not a requirement.

If you already know your AI interface name, record it now.
If not, keep `{{AI_INTERFACE_NAME}}` for the moment and rename later with intention.

Rename help:
- [rename-ai-interface.md](rename-ai-interface.md)

### Your Name

Your ecosystem will reference you by name in governance documents and certain protocols.
Three levels are available — only the display name is required:

- **Display name** — what you want to be called day-to-day. This is `{{SOVEREIGN_DISPLAY_NAME}}`.
- **Formal name** — your full name for non-legal documents, emails, and formal correspondence. This is `{{SOVEREIGN_FORMAL_NAME}}`.
- **Legal name** — your name as it appears on legal documents and contracts. This is `{{SOVEREIGN_LEGAL_NAME}}`. Optional.

Record your display name now if you have one.
Formal and legal names can be filled in at the Foundation naming checkpoint.

## Early AI History Note

If you think there is a strong chance you will use Session 0.5, initiate your export now from the old platform.

Possible sources:
- ChatGPT
- Claude
- another AI tool you have used heavily

By the time you reach Session 0.5, the file may already be ready for pattern analysis.

## Sovereignty Orientation

This system is local-first, not purity-first.

That means:
- use the best current tools that help you build now
- keep ownership of your files
- avoid locking the system to one platform if you can help it
- move toward more sovereign infrastructure over time

The horizon is local models on personal hardware.
That horizon does not need to block the first build.

## Exit Condition

Session 0 is complete when:
- the tooling exists
- the workspace exists
- any likely old-AI export request has already been initiated
- the naming placeholders are either chosen or intentionally deferred

Then move to Session 1.
