# Cheat Sheet: Tool Roles

Why you need each tool, and what each one actually does.

A common question when setting up the Sovereign Ecosystem: "Why do I need so many programs?"
Each tool has one job. None of them overlap. Here is what each one does.

---

## Node.js

The runtime engine. Claude Code cannot run on your computer without it.
You will never open Node.js directly. It works in the background.

**Windows + Mac:** Download the LTS version at [nodejs.org](https://nodejs.org).

---

## Git

Version control. Every change you make in your ecosystem gets tracked.
If something breaks, you can roll back. The Ecosystem Update Check skill uses Git to fetch new updates.

**Windows:** Download at [git-scm.com](https://git-scm.com).
**Mac:** Run `git --version` in Terminal. If not installed, macOS will prompt you to install it automatically.

---

## VS Code

The editor. This is where you open your vault and talk to your AI.
Think of it as the command center: your files live in Obsidian, but your AI interface lives here.

**Windows + Mac:** Download at [code.visualstudio.com](https://code.visualstudio.com).

---

## Claude Code Extension

The AI agent inside VS Code. This is your working interface.
Install it from the VS Code Extensions marketplace. Log in with your Anthropic account, no API key entry needed.

Once connected, you talk to your AI in plain language. No code required.

## Claude Code Notifier Extension

A companion to Claude Code. Plays an audible alert when your AI finishes a response or a bash command completes.

Useful when Claude is doing longer work: step away, do something else, and return when you hear the notification instead of watching the screen.

---

## Obsidian

The vault viewer. Your ecosystem files are plain markdown files on your computer.
Obsidian reads them beautifully: links, navigation, reading view, and light editing.

Use Obsidian to browse, read, and lightly edit your governance documents, notes, and templates.
Use VS Code when you want your AI to do something.

**Windows + Mac:** Download at [obsidian.md](https://obsidian.md).

---

## GitHub

Where the template lives. Your ecosystem starts as a download from the Sovereign Ecosystem GitHub repo.
A free account lets you download the template, watch for updates, and, eventually, publish your own version.

**Windows + Mac:** Free account at [github.com](https://github.com).

---

## Anthropic

The company behind Claude. Claude Code authenticates through your Anthropic account.
You pay per usage. There is no required subscription. Onboarding the full Foundation typically runs $10–25 total at a comfortable pace.

Create your account at [console.anthropic.com](https://console.anthropic.com).

---

## Summary

| Tool | Job |
|---|---|
| Node.js | Runtime engine, Claude Code runs on top of it |
| Git | Version control, tracks changes, enables updates |
| VS Code | Editor and command center, where you work |
| Claude Code extension | Your AI interface inside VS Code |
| Claude Code Notifier | Audible alerts when responses or commands complete |
| Obsidian | Vault viewer, read and navigate your files |
| GitHub | Template source, download and update the ecosystem |
| Anthropic | API provider, powers Claude, pay per use |
