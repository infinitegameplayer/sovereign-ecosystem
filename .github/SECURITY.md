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
- **Run `node "Council Chamber/scripts/se-update.mjs" --check`.** It compares your framework files with this repo's and names every one that changed.

**Through v3.25.0 the Ecosystem Update Check skill could not read a single update.** It fetched a branch and a folder that never held them, and halted on a 404 every time it ran. If you installed any version before v3.26.0 and relied on that skill, it has told you nothing since you installed. Read the CHANGELOG from your version forward, and apply v3.26.0 to get a skill that works. A CI step now checks every upstream address the template ships.

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

- **The trust-anchor guard surfaces and does not block.** It names any edit to settings, `CLAUDE.md`, MCP and plugin files. Since v3.25.0 it reads Bash and PowerShell commands as well, so a redirect, `sed -i`, copy, move, delete or interpreter write aimed at one of them is named too. A path built at run time (a loop, `find -exec`, `Join-Path`, a script written now and run later) is beyond it; its header lists these limits.
- **The delete gate blocks by reading the command text.** It stops deletes and moves inside your containers. Its own header lists its blind spots: a path built at run time that names no container in its literal text (since v3.24.0 a variable path that names one is refused), a delete fed by a pipe, a string passed to an interpreter script as an argument and a file sitting directly in the vault root.
- **The Outward Gate asks before what it lists.** That means secret writes on fly, wrangler and vercel, writes through a connected MCP server and the scripts and commands you name in its config. Built-in deploys are logged and not asked. Anything off its lists passes.
- **The git guards read a command as tokens** (since v3.25.0). One refuses a sweeping `git add -A`, `git add .` or `git commit -a` in this vault, where another session may have work in progress, and asks when the folder comes from a variable or a command it cannot read. The other asks before a git command that destroys work (`branch -D`, `reset --hard`, `clean -f`, a forced or deleting push) in any spelling. Both read one level into `bash -c` and `powershell -Command`. A git command run from inside a script you call is beyond them.
- **Outside models refuse partner material** (since v3.25.0). `external-worker.mjs` refuses a context pack under `Collaborations/` and a prompt carrying a partner's full name (a `Collaborations/` folder name with a space, or one you list in `client-material.config.json`). It also blocks email addresses, card-like digit runs, payment ids, key-shaped strings and long encoded blobs unless you pass `--allow-sensitive`, which is logged. Text about a partner that never names them in full passes.
- **The browser fetcher refuses your own machine and network** (since v3.26.0). The Playwright skill's `run.js` fetches only http and https, and never a local name, loopback, private, link-local, CGNAT or cloud metadata address, checked on the URL, after DNS and on every request the page makes. Through v3.25.0 it fetched any URL it was handed, so a page that planted `http://169.254.169.254/` or `http://127.0.0.1/admin` could read your machine or network into the agent's context. `--allow-private` opens it for testing a site on your own machine. A name that resolves to a public address at the check and a private one at the connect is beyond it.
- **The settings deny reading `.env` files** (from v3.21.0; since v3.24.0 also `.env.local`, `.env.*.local`, `.env.development`, `.env.production` and `.env.test`). Claude Code enforces the rule on its file tools and on the shell readers it recognizes. A script you run can still read the file, which is how your scripts get their keys.

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