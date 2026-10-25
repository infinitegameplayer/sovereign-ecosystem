# Security Policy

## Supported Version

The latest `master` branch is the supported public version of the Sovereign Ecosystem.
Older snapshots and unpublished local variants may diverge and should not be assumed current.

## How You Learn That A Fix Shipped

Read this section if you templated or cloned this repo. It is the honest answer to a question most templates never ask.

**Nothing reaches you automatically, and you should plan for that.**

Clicking "Use this template" gives you a detached copy. GitHub keeps no link back to this repo, so there is no dependency graph, no Dependabot alert and no notification. Watching a repo you templated is a separate, manual act that almost nobody performs. This is a structural property of template distribution rather than an oversight here, and naming it plainly is more useful than implying a safety net that does not exist.

So the burden is shared, and here is each half of it.

**What this repo does:** every security fix ships through all four of these at once. A fix that lands quietly has been published and never delivered.

1. A `.github/CHANGELOG.md` entry that leads with who must act.
2. An `.github/UPDATES/` package written as **spec plus test**, so a fix still lands in a copy your agent has customized beyond recognition.
3. A GitHub Release, since the Releases page is what a returning visitor checks.
4. Plain language at the top: "If you installed vX, apply this update."

**What you can do:** any one of these closes the gap.

- **Watch this repo, Releases only.** One click, and it is the single highest-value action a recipient can take.
- **Run the guards' own tests** after any update, and periodically regardless:
  ```sh
  node "Council Chamber/scripts/hooks/floor-gate-selftest.mjs"
  node "Council Chamber/scripts/hooks/hooks-selftest.mjs"
  ```
  These fire the guards rather than reading them. A guard that has never refused anything is not known to work.
- **Check `.github/CHANGELOG.md`** against the version you installed, whenever you next open the vault.

## Responsible Use

Three parts: what this template will not help with, what you are responsible for and what this section does not change.

### What this template will not help with

It is built to run your own life and work. It will not be extended to reach into anyone else's systems, accounts or data without their permission. A request, issue or pull request asking it to do that is out of scope and will be closed.

### What you are responsible for

- **What your AI does.** You approve its actions in your vault and on your machine, and you own the results.
- **Your keys.** From v3.19.1, git ignores `.mcp.json` and `.claude/settings.local.json`. A key pasted anywhere else in the vault is published the moment you push.
- **What you connect.** Every MCP server, plugin and script you add runs with your user rights.
- **Staying current.** See "How You Learn That A Fix Shipped" above.

### What this section does not change

It does not amend the MIT License, which still governs the code. It applies to every past release and every copy, wherever you got it. Knowing how a guard works is not permission to test it against a vault that is not yours.

### The hooks are guardrails, not a sandbox

The hooks in `.claude/settings.json` catch common mistakes. They do not contain an agent that is working to get around them.

- **The trust-anchor guard surfaces and does not block.** It names any edit to settings, `CLAUDE.md`, MCP and plugin files, and it watches the Write and Edit tools only. A shell command that writes the same file passes it.
- **The delete gate blocks by reading the command text.** It stops deletes and moves inside your containers. Its own header lists its blind spots: a path built at run time, a delete fed by a pipe, a string passed to an interpreter script as an argument and a file sitting directly in the vault root.
- **The Outward Gate asks before what it lists.** That means the deploy and secret commands it names and MCP writes. Anything off its list passes.

Containment comes from your operating system and from what you allow: your user account, Claude Code's permission prompts and its sandbox where your platform supports it.

## Reporting a Vulnerability

Please do not open a public issue for sensitive security findings.

Use this order of operations:

1. If GitHub private vulnerability reporting is enabled for this repository, use it.
2. Otherwise contact the maintainer through a private channel listed on the repository profile or associated project site before sharing details.
3. Include the affected file or path, reproduction steps, impact, and any redaction needs.

## What To Report

Relevant reports include:

- exposed secrets, tokens, credentials, or private config
- unintended personal or collaborative data in the public repo
- unsafe automation behavior or privilege escalation paths
- supply-chain or dependency issues that materially affect the shipped repo

## Scope Notes

This repository is a local-first template. Practical, lightweight disclosure is preferred over heavy process.