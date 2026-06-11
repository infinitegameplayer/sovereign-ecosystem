---
status: draft
created: 2026-06-10
type: optional_path
---

# Optional Path - Obsidian MCP Bridge

Purpose: connect your Obsidian vault directly to the AI interface so it can read, search, create and edit notes without you copying content back and forth.

## When This Path Fits

This path is applicable if:

- you want the AI interface to access vault notes directly during a session
- you are running active research or drafting sessions and want the AI to pull context from the vault without manual copy-paste
- you want the AI to write new notes or update existing ones as session outputs land
- you use Obsidian as your primary vault container and want a first-class AI bridge rather than a workaround

Default next move:

- convert this path into a Pending Plan if it applies
- complete the two-step prerequisite install before the session where you want the bridge active

## What This Bridge Gives You

The bridge exposes your Obsidian vault as a set of tools the AI interface can call directly during a session:

- read any note by path
- search the vault by keyword or tag
- create new notes
- update existing notes with AST-aware frontmatter preservation (meaning frontmatter fields are surgically edited, not overwritten)
- soft-delete notes (moves to trash rather than permanent deletion)
- list all tags across the vault

Without the bridge, the AI interface sees only what you paste into the chat. With it, the vault is a live context source the interface can reach into.

## Security Posture: Read-Only By Default

Start with read-only operations enabled. Expand to writes only after deliberate choice.

Three controls govern a well-configured bridge:

1. **Scope to one vault.** The `OBSIDIAN_BASE_URL` in `.mcp.json` points at a single Obsidian vault only. Do not configure it to span multiple vaults unless you have a specific reason.
2. **Read-only default.** The cyanheads/obsidian-mcp-server supports a features allowlist. On first install, restrict the active tools to read and search operations. Add write tools only when you are confident in the session discipline.
3. **Features allowlist.** The server's configuration accepts an explicit list of enabled tools. Naming only what you need is safer than enabling everything by default.

Starting read-only means a misconfigured session or an over-eager AI response cannot modify or delete vault content until you have verified the bridge behaves as expected.

## Dependency Chain

Two things must be in place before the bridge works.

**Step 1: Obsidian Local REST API plugin**

The bridge depends on a community plugin called Local REST API. It runs a small HTTP server inside Obsidian that the MCP server calls.

1. Open Obsidian.
2. Go to Settings, then Community Plugins.
3. Turn off Safe Mode if prompted.
4. Search for "Local REST API" and install it.
5. Enable the plugin.
6. Open the plugin settings. You will see an API key and a port number (default is 27124). Copy the API key.

The plugin must be running (Obsidian must be open) whenever you want the bridge active in a session.

**Step 2: MCP server configuration**

The repo ships a `.mcp.json.example` file at the root. Copy it to `.mcp.json` and fill in your values.

```
cp .mcp.json.example .mcp.json
```

Open `.mcp.json` and replace the two placeholder values:

- `YOUR_LOCAL_REST_API_KEY_HERE`: paste the API key from the Local REST API plugin settings
- `http://127.0.0.1:27124`: leave this as-is unless the plugin is running on a different port

Your finished `.mcp.json` will look like this:

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": ["-y", "@cyanheads/obsidian-mcp-server"],
      "env": {
        "OBSIDIAN_API_KEY": "your-actual-key",
        "OBSIDIAN_BASE_URL": "http://127.0.0.1:27124"
      }
    }
  }
}
```

Do not commit `.mcp.json` to version control. It contains your API key. The `.gitignore` at the repo root excludes it by default; verify this before pushing.

## Setup Steps

1. Install the Local REST API plugin in Obsidian (Step 1 above).
2. Copy `.mcp.json.example` to `.mcp.json` and fill in your API key and port.
3. Keep Obsidian open with the plugin enabled before starting a session.
4. Start a new Claude Code session. The AI interface will pick up the MCP configuration automatically.
5. Verify the connection by asking the AI interface to list the tags in your vault or retrieve a known note path. If it returns real vault data, the bridge is live.

## Expanding to Writes

Once you have confirmed the read-only connection works across a few sessions, you can enable write operations.

The cyanheads/obsidian-mcp-server supports a `OBSIDIAN_ENABLE_WRITES` environment variable. Set it to `true` in your `.mcp.json` env block to unlock note creation and editing.

Treat this as a deliberate expansion, not a default. Read operations carry no risk of unintended change. Write operations do.

## Completion Signal

This optional path is complete when:

- the Local REST API plugin is installed and enabled in Obsidian
- `.mcp.json` is filled in with real values and excluded from version control
- the AI interface retrieves vault content correctly in at least one test session
- you have decided your starting write posture (read-only or writes enabled) and documented it in your Sovereign Command

After that, deepen it through use. The bridge is a low-overhead, high-leverage addition once the Foundation loop is already stable.

## References

- cyanheads/obsidian-mcp-server: https://github.com/cyanheads/obsidian-mcp-server
- Obsidian Local REST API plugin: search "Local REST API" in the Obsidian community plugin browser
- `.mcp.json.example` at the repo root
