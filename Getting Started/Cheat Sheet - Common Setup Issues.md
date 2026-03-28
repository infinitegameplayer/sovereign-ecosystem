# Cheat Sheet — Common Setup Issues

Six friction points that come up during setup — and how to handle each one.

---

## 1. Your vault folder is inside a cloud sync folder

**What happens:** Obsidian behaves unexpectedly, files appear to save but aren't fully local, or sync conflicts appear later.

**Why it happens:** On Windows, the Desktop and Documents folders often sync to OneDrive by default. On Mac, the same folders may sync to iCloud Drive. The vault folder ends up in the cloud rather than on local storage.

**Fix:** Move your ecosystem folder to a plain local directory before opening it as a vault.
- **Windows:** Move to `C:/Users/YourName/Local Files/` or any folder outside the OneDrive boundary
- **Mac:** Move to `~/Documents` only if iCloud Drive sync is off, otherwise use a folder like `~/Local/`

This is a minor inconvenience to catch early. Much harder to fix after the vault is set up.

---

## 2. Obsidian Sync vault password is separate from your account password *(mobile users only)*

**What happens:** When setting up Obsidian Sync for mobile access, you are asked to create a vault password. It looks like a duplicate login step and causes confusion.

**Why it happens:** The vault password encrypts your synced vault. It is completely separate from your Obsidian account login.

**Fix:** When the vault password prompt appears, create a new password just for this vault. Write it down somewhere safe — it cannot be recovered if lost.

This only applies if you are setting up Obsidian Sync for phone access. It is optional.

---

## 3. Git shows a "fatal: unsafe repository" error (Windows only)

**What happens:** You run `git status` and see: `fatal: detected dubious ownership in repository`.

**Why it happens:** Windows Git has a permission check that blocks operations in folders owned by a different user profile. This is common on shared machines or certain Windows configurations.

**Fix:** Run this command in the VS Code terminal (replace the path with your actual folder location):

```
git config --global --add safe.directory "C:/Users/YourName/Documents/Frank's Reality"
```

Then run `git status` again — it should respond normally.

**Mac:** This issue does not occur on Mac.

---

## 4. VS Code opens the wrong folder level

**What happens:** You go to **File > Open Folder**, navigate to your ecosystem folder, and VS Code opens the contents of the folder instead of the folder itself.

**Why it happens:** Double-clicking a folder in the file picker enters it rather than selecting it.

**Fix:** Click the folder once to highlight it, then click **Open**. Do not double-click.

---

## 5. ChatGPT export takes hours — not minutes

**What happens:** You initiate the ChatGPT data export expecting a download, but nothing arrives.

**Why it happens:** ChatGPT's data export is asynchronous. It queues the archive and emails you a download link when it is ready. This can take 3–12 hours or longer.

**Fix:** Start the export as early as possible — ideally at the beginning of your setup session.
Go to ChatGPT > Settings > Data Controls > Export Data.
Continue setup while you wait. When the email arrives, download the ZIP file and drop it into your ecosystem folder.

This is only needed if you plan to use Session 0.5 to mine your old AI history.

---

## 6. Git prompts you to commit during setup — ignore it

**What happens:** While working through setup, a prompt or notification suggests you commit your changes.

**Why it happens:** Git tracks every file change and surfaces commit suggestions.

**Fix:** Ignore all commit prompts until you run session closeout at the end of the session. Session closeout creates commits organized by theme automatically. Mid-session commits fragment the history and make rollback harder.

The only exception: you have been explicitly instructed to commit something specific.
