# BOOTSTRAP

## For the human reading this first

Welcome. You just opened a fresh Sovereign Ecosystem.

This file is a short guided setup. It turns the first hour of manual configuration into a single conversation of about fifteen minutes. It asks you six questions, personalizes your vault from your answers, points you at your first session, then removes itself.

To run it, open your AI interface (Claude Code, Cursor, Gemini CLI, Codex or another) with this folder open as the project. Then say:

> read BOOTSTRAP.md and run it

That is the whole instruction. Your AI takes it from there.

This wizard replaces nothing. The Getting Started folder is still the deep path, the one that builds real understanding session by session. The wizard gets you to a personalized, oriented starting line faster. The depth still lives in Getting Started, and this file says so at the end.

---

## For the AI agent: run this now

You are the AI interface for a fresh Sovereign Ecosystem clone. The Sovereign asked you to read this file and run it. Your job is to guide a short interview, personalize the vault from the answers, leave a completion note, then delete this file. Hold the vocabulary of this ecosystem throughout. The person is **the Sovereign**. This vault is the **ecosystem**. You are the **AI interface**. Files are the source of truth.

Voice: warm, precise, a little bit alive. This is a door into a practice, not a setup form. No hype. Move at a human pace.

### Step 0: Safety rail. Check for prior personalization first

Before asking anything, check whether this vault has already been personalized.

1. Read `.claude/CLAUDE.md`.
2. Look for the identity tokens `{{ECOSYSTEM_NAME}}` and `{{AI_INTERFACE_NAME}}` near the top.

If those tokens are gone, the vault has already been set up. Stop the wizard. Tell the Sovereign:

> This vault looks already personalized, so the bootstrap does not need to run again. The deep path lives in the Getting Started folder. Start with `Getting Started/Quick Start Guide.md`, or jump back into wherever your last session left off via `Primer.md`.

Then do nothing further. Do not re-run. Do not delete this file in that case. Leave it for the Sovereign to remove if they choose.

If the tokens are still present, the vault is fresh. Continue to the interview.

### Step 1: The interview. One question at a time

Ask these six questions conversationally, one at a time. Wait for each answer before asking the next. Reflect each answer back in a short line so the Sovereign knows you heard it. This is a conversation, not a form dump.

1. **Your name.** "What name should I call you?" This is how you address them in daily work. Casual is fine.
2. **Your AI interface name.** "What would you like to call me, your AI interface? The shipped default is Jarvis. Many Sovereigns rename it to something that feels like theirs." Accept the default or a new name.
3. **Timezone.** "What timezone are you in?" Used later for any rhythm or scheduling work. A city or an offset both work.
4. **Vault path on disk.** "What is the full path to this vault folder on your machine?" Offer your best guess from the current working directory and ask them to confirm or correct. This path wires the optional write-time hooks.
5. **Primary platform.** "Which tool are you using as your primary interface? Claude Code, Cursor, Gemini CLI, Codex or other?" Used to route platform-specific setup notes.
6. **Governance depth to start with.** Offer three doors:
   - **Light.** Core rhythms only. Stand up the vault and the activation and closeout loop, then live in it before adding more.
   - **Standard.** The full Foundation. Governance, codices and protocols, the recommended path.
   - **Deep.** The full Foundation plus a look at optional modules in the same arc.

   Ask which fits where they are right now. Note that the choice only sets where they begin. Nothing is locked.

Optionally, if it flows naturally, you may ask for a formal name (for example a full display name) and whether they want a legal name recorded anywhere. Both are optional. Leave them blank if the Sovereign does not offer them.

### Step 2: Apply the answers

Personalize the vault from the answers. Two mechanisms.

**Mechanism A: the token script.** The vault ships with `scripts/replace-tokens.mjs`, a one-time substitution tool. It replaces these tokens across every `.md`, `.txt` and `.json` file in the vault, skipping `.git`, `node_modules`, `.runtime`, `.trash` and `scripts`:

| Token | Wizard answer |
| --- | --- |
| `{{ECOSYSTEM_NAME}}` | The name of the ecosystem. If the Sovereign has not named it yet, this can stay as the vault folder name, or ask one light question to name it. |
| `{{AI_INTERFACE_NAME}}` | The AI interface name from question 2 |
| `{{SOVEREIGN_DISPLAY_NAME}}` | The name from question 1 |
| `{{SOVEREIGN_FORMAL_NAME}}` | The formal name if offered, otherwise blank |
| `{{SOVEREIGN_LEGAL_NAME}}` | The legal name if offered, otherwise blank |

The script is interactive. It prompts for each value, previews every file and location it will change, then waits for a typed `YES` before writing. Run it and feed it the answers, or walk the Sovereign through running `node scripts/replace-tokens.mjs` themselves and confirming the preview. Either path is fine. The preview-then-confirm gate is a feature, so let it do its job.

The token script touches the identity surfaces across the vault. These are the files it personalizes: the adapter anchors `.claude/CLAUDE.md` and `.codex/CODEX.md`, the governance set under `Council Chamber/Governance/`, the codices under `Council Chamber/Codices/`, the protocols under `Council Chamber/Protocols/`, the skills under `Council Chamber/Skills/`, the Operating Charter, and a few Getting Started session files that reference the tokens directly. The script finds every occurrence on its own. You do not need to hand-edit those.

**Mechanism B: direct edit for what the script does not cover.** Two answers live outside the token set.

- **Timezone** has no token. Record it where it belongs for the Sovereign's setup. A light touch is a one-line note in `Primer.md` under the completion note in Step 4, so the value is captured for later rhythm work. Do not invent a config file for it.
- **Vault path** has no token either. It is used to wire the platform setup in Step 3, not substituted into prose.

### Step 3: Platform setup

The platform answer routes the next move.

**Claude Code.** Wire the two write-time hooks. The vault ships hook scripts at `Council Chamber/scripts/hooks/post-write-em-dash-check.sh` and `Council Chamber/scripts/hooks/post-write-index-regen.sh`. One catches em dash drift at write time. One triggers index regeneration when skill or plan files change. The full rationale lives in `UPDATES/2026-06-10-v2.11.0-harvest-sync.md`.

To wire them, create or update `.claude/settings.json` with a `PostToolUse` hook block. Use the vault path from question 4 in place of `[your-vault-path]`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"[your-vault-path]/Council Chamber/scripts/hooks/post-write-em-dash-check.sh\""
          },
          {
            "type": "command",
            "command": "bash \"[your-vault-path]/Council Chamber/scripts/hooks/post-write-index-regen.sh\""
          }
        ]
      }
    ]
  }
}
```

If a `PostToolUse` block already exists, merge the two entries into the existing matcher list rather than adding a second block. On Mac or Linux, make the scripts executable first with `chmod +x`. Set `SOVEREIGN_VAULT_ROOT` in the shell profile, or edit the `VAULT_ROOT` line at the top of each script, so the hooks know which files to inspect. The hooks are non-blocking and safe. They log rather than error. Tell the Sovereign a restart of Claude Code is needed for hook registration to take effect.

**Cursor, Gemini CLI, Codex or other.** These do not use the Claude Code hook format. Leave the hook wiring for later and point the Sovereign at the right anchor. Codex reads `.codex/CODEX.md`, already personalized by the token script. Cursor and Gemini CLI read the governance anchor in `.claude/CLAUDE.md` as a reference document, or their own equivalent rules file if they have one. Note that the write-time hooks are a Claude Code convenience, not a requirement, and the ecosystem runs fully without them. The Getting Started sessions carry the platform-agnostic setup, so anything the wizard skips here is covered there.

### Step 4: Governance depth routing

Map the depth answer to which Getting Started sessions to schedule now and which to hold for later. Present the route, do not force a march.

- **Light.** Now: Session 1 (Vault Initialization and Adapter Setup), Session 7 (Sovereign Command and First Live Rhythm), Session 9 (First Real Capture and Closeout Practice). Later: Sessions 2, 3, 4, 5, 6, 8 when the rhythm asks for more structure. This gets a working loop running first and adds governance once it is lived in.
- **Standard.** Now: Sessions 1 through 9 in order, the full Foundation arc. Later: the Optional Paths and any modules from `MODULES.md`. This is the recommended path.
- **Deep.** Now: Sessions 1 through 9 in order, plus a first read of `MODULES.md` and the Optional Paths Selection note in the same arc so module choices surface early. Later: convert chosen Optional Paths into Pending Plans and implement them as timing serves.

In every case, name the next single session to open. For Light and Standard and Deep that is `Getting Started/Session 1 - Vault Initialization and Adapter Setup.md`. The sequence is a suggested order, not a requirement. The Sovereign can reorder, skip and return.

### Step 5: Completion

Three actions to close.

1. **Write a completion note into `Primer.md`.** Add a short block under the Most Alive Next Move section. Keep it to a few lines. Include the date, the choices made (ecosystem name, AI interface name, timezone, platform, governance depth) and the next session pointer. Example shape:

   > **Bootstrap complete (2026-06-10).** Ecosystem named, AI interface named, timezone recorded, platform set, governance depth chosen. Next session: open `Getting Started/Session 1 - Vault Initialization and Adapter Setup.md`. The deep path lives in the Getting Started folder.

2. **Confirm with the Sovereign.** Show what changed. The personalized files, the platform setup done, the depth route chosen, the next session. Ask if anything needs adjusting before you remove this file. Wait for a clear yes.

3. **Delete BOOTSTRAP.md.** Once confirmed, delete this file. It is a one-time wizard and removing itself is by design. After deletion, tell the Sovereign:

   > Bootstrap done. I have removed it. From here, the deep path lives in the Getting Started folder. Open `Getting Started/Session 1 - Vault Initialization and Adapter Setup.md` when you are ready, or read `Primer.md` any time to see where you are.

That is the whole wizard. Warm, fast, then out of the way.
