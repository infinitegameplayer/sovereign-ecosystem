# Sovereign Ecosystem Quick Start Guide

Your AI workspace setup, from first install to first activation.

Work top to bottom. Each section has an exit condition before moving on.

> Steps marked **Windows** or **Mac** have platform-specific instructions. Steps with no label are the same on both.

---

## Before You Begin

Check whether your Desktop or Documents folder syncs to OneDrive (Windows) or iCloud Drive (Mac). If it does, identify a plain local path to use for your workspace. Something outside the sync boundary.

Cloud sync and local vaults do not mix well. Catch this early.

---

## Step 1: Install the Software

### Node.js

1. Go to [nodejs.org](https://nodejs.org) and download the **LTS** version
2. **Windows:** Run the installer. Accept defaults. Confirm "Add to PATH" is checked
3. **Mac:** Open the .pkg installer and follow the prompts
4. Close any open terminal windows, open a new one, and run: `node -v`
5. Confirm a version number appears

### Git

1. **Windows:** Go to [git-scm.com](https://git-scm.com), download Git for Windows, run the installer with defaults
2. **Mac:** Open Terminal and run `git --version`. If Git is not installed, macOS will prompt you to install Xcode Command Line Tools. Accept it
3. Confirm `git --version` returns a version number

### Your AI Interface: Choose One

You need one tool to talk to Claude. Two options. Pick whichever fits.

**Option A: VS Code + Claude Code Extension (recommended)**

VS Code is a code editor with a file tree, built-in terminal and extensions. It gives you the most capability as you grow into the workspace.

1. Go to [code.visualstudio.com](https://code.visualstudio.com) and download
2. Install and confirm it opens
3. Click the Extensions icon in the left sidebar
4. Search: `Claude Code`
5. Install the extension published by **Anthropic**
6. Optional: search and install `Claude Code Notifier` for audible alerts when responses finish
7. Confirm the Claude Code icon appears in the sidebar

**Option B: Claude Code App**

Claude Code also lives inside the Claude desktop app as its **Code** tab. Simpler interface, no code editor to learn. It opens folders as projects and reads your files directly. Good for someone who wants the AI conversation without the editor.

1. Go to [claude.com/download](https://claude.com/download) and download the Claude desktop app
2. Install, sign in and click the **Code** tab. Confirm it opens

Either option reads and writes files in your workspace. VS Code gives you more tools around the conversation. The Claude Code app gives you a cleaner, focused interface. Both work.

### Obsidian

1. Go to [obsidian.md](https://obsidian.md) and download
2. Install and launch. Skip vault setup for now

---

## Step 2: Accounts and Download

### GitHub

1. Go to [github.com](https://github.com) and create a free account (or confirm existing)

### Download the Sovereign Ecosystem

1. Go to [infinitegameos.io/sovereign-ecosystem](https://infinitegameos.io/sovereign-ecosystem) and click the **Download ZIP** button
2. Unzip to a permanent local folder:
   - **Windows:** `C:/Users/YourName/Documents/Sovereign Ecosystem`
   - **Mac:** `~/Documents/Sovereign Ecosystem`
3. Rename the folder if you want. This is your workspace. Call it whatever feels right
4. Confirm the folder contains: `Council Chamber/`, `Library/`, `README.md`, `Sovereign Command.md`

> **Prefer GitHub?** Clone or download directly at [github.com/infinitegameplayer/sovereign-ecosystem](https://github.com/infinitegameplayer/sovereign-ecosystem). Both paths give you the same files.

> **Do not place this folder inside a cloud-synced folder.** Windows: avoid OneDrive. Mac: avoid iCloud Drive. If your Documents folder syncs, use an alternative local path.

### Anthropic Account

1. Go to [claude.ai](https://claude.ai) and create an account
2. Subscribe to Claude Pro ($20/month) or higher. Claude Code runs on a paid plan; the free account covers the claude.ai chat website only
3. This is the account you will sign into from VS Code or the Claude Code app

---

## Step 3: Open Your Workspace

### Obsidian

1. Open Obsidian
2. Click **Open folder as vault**
3. Navigate to your ecosystem folder. Click it once to select, then click **Open** (do not double-click)
4. Confirm the folder structure is visible in the left sidebar

### Open Your Workspace in Your AI Interface

**If you chose VS Code (Option A):**

1. Open VS Code
2. **File > Open Folder**, select the same ecosystem folder
3. Confirm the file tree appears
4. Click the Claude Code icon in the sidebar
5. Log in with your Anthropic account
6. Confirm Claude Code loads without error

**If you chose Claude Code App (Option B):**

1. Open the Claude desktop app and click the **Code** tab
2. Choose **Local** and select your ecosystem folder
3. Confirm Claude Code loads and can see your files

### Git Permissions (Windows only)

1. Open a terminal (VS Code: **Terminal > New Terminal**, or use the Claude Code app's built-in terminal)
2. Run `git status`
3. If you see a "fatal: unsafe repository" error, run:
   ```
   git config --global --add safe.directory "C:/Users/YourName/Documents/Sovereign Ecosystem"
   ```
4. Run `git status` again. Confirm it responds without a "fatal" error

---

## Step 4: First Activation

1. With the ecosystem folder open, open the Claude Code panel (VS Code sidebar or Claude Code app)
2. Type: `What files are in the Getting Started folder?`
3. Confirm Claude Code responds and lists the session files
4. In Obsidian, navigate to `Getting Started/Session 0 - Prerequisites.md`
5. Read through it. Mark off anything already handled during this setup

---

## Common Issues

**Cloud sync conflict.** Your vault folder is inside OneDrive or iCloud Drive. Move it to a plain local directory before continuing.

**Obsidian Sync password.** If setting up mobile access, the vault password is separate from your Obsidian account login. Write it down. It cannot be recovered.

**Git "unsafe repository" error (Windows).** Run the `safe.directory` command from Step 3. This is a Windows-specific permission check.

**VS Code opens wrong folder.** Click the folder once to select, then click Open. Do not double-click.

**Claude Code app cannot find files.** Make sure you opened the ecosystem folder as a project, not a subfolder inside it.

**Code tab asks you to upgrade.** Your account is on the free tier. Claude Code needs Pro or higher. Subscribe at claude.ai, then restart the app.

---

## You Are Set Up When

- All software is installed and confirmed
- Your vault opens in both Obsidian and your AI interface (VS Code or Claude Code app)
- Claude Code responds to a test prompt
- You've read through Session 0 and know where to begin

From here, open Session 1 and let the Getting Started sessions walk you through everything at your pace.

Live orientation lives at infinitegameos.io/sovereign-ecosystem.

Enjoy the Journey.
