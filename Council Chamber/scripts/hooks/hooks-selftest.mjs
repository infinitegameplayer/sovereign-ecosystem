#!/usr/bin/env node
// hooks-selftest.mjs
// Positive control on every hook EXCEPT the Permanent Floor gate, which has its
// own dedicated control in floor-gate-selftest.mjs.
//
// The governing law: a guard is verified by firing, never by reading. A hook
// that has never reacted is not known to work, and a hook that reacts to
// everything has become a wall. Both are failures and both are checked here.
//
// This file exists because all six of these hooks were once trusted on reading,
// and firing them found three defects in an afternoon:
//   - post-write-index-regen.sh could never regenerate anything, because no
//     regen script shipped for it to call.
//   - post-write-em-dash-check.sh went silently dark when Windows handed it a
//     lowercase drive letter, and warned on the entire filesystem when its vault
//     root was unset. It failed in both directions at once.
//   - the two compact hooks resolved .runtime against the working directory, so
//     firing from a subdirectory wrote a snapshot the reorienter never found.
//
// Payloads are built with JSON.stringify. A hand-quoted shell string can carry
// an escaping bug that is indistinguishable from a hook failure, which is the
// bad-instrument trap this whole practice exists to avoid.
//
// ── THE SECOND INSTRUMENT ────────────────────────────────────────────────────
//
// A test suite fails by reporting clean, which is the same shape as success.
// That makes a green suite the least informative possible result unless
// something is pointed at the suite itself. Two things are:
//
//   node hooks-selftest.mjs --negative-control
//
// re-runs every case against a do-nothing stub in place of the real hook. Any
// case that STILL passes is vacuous: it proves nothing, because a hook that
// does nothing already satisfies it. A green suite of vacuous cases is a mood,
// not evidence.
//
// Cases divide into two kinds, declared per case, because the distinction is
// real and hiding it would be its own dishonesty:
//   'reacts' . the hook must DO something. A stub cannot satisfy it, so the
//              negative control can falsify it. These are the ones that carry the proof.
//   'quiet'  . the hook must NOT do something. A stub satisfies it trivially,
//              so the negative control cannot falsify it and does not pretend to.
//              Reported as n/a rather than counted as a pass.
//
// The registration audit is the other blind spot. Every case here fires its
// hook DIRECTLY, which proves the script works and proves nothing about whether
// the session will ever call it. A perfect guard nobody wired up is a
// decoration. So the suite reads the settings file and asks, for each hook on
// disk, whether an event is registered that would actually reach it.
//
// Usage:
//   node "Council Chamber/scripts/hooks/hooks-selftest.mjs"
//   node "Council Chamber/scripts/hooks/hooks-selftest.mjs" --negative-control
//
// Exit 0: every hook behaved as specified. Exit 1: read the FAIL lines.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, existsSync, rmSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..', '..');
const hook = (n) => path.join(HERE, n);

const NEGATIVE = process.argv.includes('--negative-control');

// A throwaway vault, so the self-test never writes into the real one.
const VAULT = mkdtempSync(path.join(os.tmpdir(), 'se-hooks-')).replace(/\\/g, '/');
mkdirSync(path.join(VAULT, 'Council Chamber', 'Skills', 'Demo'), { recursive: true });
mkdirSync(path.join(VAULT, 'Scriptorium'), { recursive: true });
// The fixture builds .runtime itself rather than inheriting it from a hook.
// Before the primer moved out of the root, writing it needed no directory at
// all. Once it moved, the positive run still passed because the pre-compact
// hook happened to create .runtime first, while the negative run crashed:
// stubs create nothing. A fixture that depends on the code under test to
// build itself is not a fixture.
mkdirSync(path.join(VAULT, '.runtime'), { recursive: true });

// The stub the negative control substitutes for a real hook. It consumes its
// payload and exits 0 without acting, which is exactly what a dead hook does.
const STUB = `${VAULT}/__stub.sh`;
writeFileSync(STUB, '#!/bin/sh\ncat >/dev/null 2>&1\nexit 0\n');

const CLEAN = `${VAULT}/Scriptorium/clean.md`;
const DIRTY = `${VAULT}/Scriptorium/dirty.md`;
const OUTSIDE = path.join(os.tmpdir(), 'se-outside.md').replace(/\\/g, '/');
writeFileSync(CLEAN, 'This file is clean. No long dashes here.\n');
writeFileSync(DIRTY, 'This file has an em dash — right here.\n');
writeFileSync(OUTSIDE, 'Outside the vault, with an em dash — here.\n');

const results = [];
// kind: 'reacts' (falsifiable by the stub) or 'quiet' (not falsifiable by it).
const record = (name, ok, detail, kind) => {
  results.push({ name, ok, detail, kind });
};

// Fire a hook with a payload. Returns {code, out}.
// Under --negative-control the real hook is replaced by the do-nothing stub.
// A node that cannot start, for the cases where the hook's environment has no
// working node. Claude Code no longer needs node, and hooks inherit the app's
// environment rather than a login shell, so this is a state a real install meets.
const NO_NODE_DIR = `${VAULT}/__no-node`;
mkdirSync(NO_NODE_DIR, { recursive: true });
writeFileSync(`${NO_NODE_DIR}/node`, '#!/bin/sh\nexit 127\n', { mode: 0o755 });
const PATH_KEY = Object.keys(process.env).find((k) => k.toUpperCase() === 'PATH') || 'PATH';

function fire(hookFile, payload, { vaultRoot = VAULT, cwd = VAULT, nodeBroken = false, extraEnv = {} } = {}) {
  const env = { ...process.env, ...extraEnv };
  if (nodeBroken) env[PATH_KEY] = `${NO_NODE_DIR}${path.delimiter}${env[PATH_KEY] || ''}`;
  if (vaultRoot === null) delete env.SOVEREIGN_VAULT_ROOT;
  else env.SOVEREIGN_VAULT_ROOT = vaultRoot;
  const r = spawnSync('bash', [NEGATIVE ? STUB : hookFile], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    cwd,
    env,
  });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || ''), stdout: r.stdout || '' };
}

const write = (file_path) => ({ tool_name: 'Write', tool_input: { file_path } });
const bash = (command) => ({ tool_name: 'Bash', tool_input: { command } });

// The channel the AI reads. A PostToolUse hook's plain stdout on exit 0 goes to
// the debug log and never reaches the AI, so a warning that is printed is not a
// warning that is delivered. Through v3.21.0 every case below checked only that
// the warning was printed, and all three warning hooks passed while warning no
// one. This returns the additionalContext the AI would read, or '' if none.
function contextOf(r) {
  for (const line of r.stdout.split('\n')) {
    try {
      const j = JSON.parse(line);
      const c = j?.hookSpecificOutput?.additionalContext;
      if (j?.hookSpecificOutput?.hookEventName === 'PostToolUse' && typeof c === 'string') return c;
    } catch { /* not a JSON line */ }
  }
  return '';
}

// The bytes a Windows-1252 round trip leaves behind, built from the damage
// itself rather than typed: each UTF-8 byte of the original read as a cp1252
// character. An em dash ends in a curly right double quote, a checkmark in a
// curly left one. Through v3.21.0 the plants were typed with a straight quote,
// which matched the hook's own straight-quote pattern and proved nothing about
// real damage, which the hook could not see.
const CP1252 = { 0x80: '€', 0x93: '“', 0x94: '”', 0x9c: 'œ' };
const mojibake = (s) => [...Buffer.from(s, 'utf8')].map((b) => CP1252[b] ?? String.fromCharCode(b)).join('');

// ── post-write-em-dash-check.sh ─────────────────────────────────────────────
// It must WARN on an em dash in the vault, stay SILENT on a clean file, and
// stay silent on a file outside the vault. And it must survive a lowercase
// drive letter, which is the exact input that once made it go dark.
{
  const H = hook('post-write-em-dash-check.sh');

  let r = fire(H, write(DIRTY));
  record('em-dash: warns on an em dash', /em dash/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'reacts');
  record('em-dash: the warning reaches the AI as additionalContext', /em dash/i.test(contextOf(r)) && r.code === 0, `code=${r.code} stdout=${r.stdout.trim().slice(0, 60)}`, 'reacts');

  r = fire(H, write(CLEAN));
  record('em-dash: silent on a clean file', !/WARN/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'quiet');

  // THE REGRESSION TEST. Same file, lowercased drive letter. This is the bug.
  const lowerDrive = DIRTY.replace(/^([A-Za-z]):/, (_, d) => d.toLowerCase() + ':');
  r = fire(H, write(lowerDrive));
  record(
    'em-dash: survives a lowercase drive letter',
    /em dash/i.test(r.out),
    lowerDrive === DIRTY ? '(no drive letter on this platform, vacuous)' : `out=${r.out.trim().slice(0, 40)}`,
    'reacts'
  );

  // Fail closed, never open: with no vault root it must not police the whole disk.
  r = fire(H, write(OUTSIDE), { vaultRoot: null, cwd: VAULT });
  record('em-dash: ignores a file outside the vault when unconfigured', !/WARN/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'quiet');
}

// ── pre-write-floor-guard.sh ────────────────────────────────────────────────
// Surface-and-log, never blocking. It must react to a trust-anchor edit and
// stay quiet on an ordinary file, and it must never block either.
{
  const H = hook('pre-write-floor-guard.sh');

  let r = fire(H, write(`${VAULT}/.claude/settings.json`));
  record('floor-guard: surfaces a trust-anchor edit', /\S/.test(r.out) && r.code === 0, `code=${r.code}`, 'reacts');

  r = fire(H, write(CLEAN));
  record('floor-guard: quiet on an ordinary file, never blocks', r.code === 0, `code=${r.code}`, 'quiet');

  // Its one promise is that no trust-anchor edit is silent. Until v3.13.0 the
  // guard read its payload only through node, so without a working node it
  // exited 0 and said nothing. Both path spellings, because a Windows path
  // arrives JSON-escaped and the fallback has to read it without a parser.
  r = fire(H, write(`${VAULT}/.claude/settings.json`), { nodeBroken: true });
  record('floor-guard: still surfaces a trust-anchor edit without node', /TRUST-ANCHOR/.test(r.out) && r.code === 0, `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');

  r = fire(H, write(`${VAULT}/.claude/CLAUDE.md`.replace(/\//g, '\\')), { nodeBroken: true });
  record('floor-guard: reads a backslash path without node', /TRUST-ANCHOR/.test(r.out) && r.code === 0, `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');

  // Smuggles: a trust anchor reached by another spelling of its path. Until
  // v3.18.0 the guard matched the path as spelled, and the first three of these
  // passed in silence when planted. Named one per vector after
  // odere-pro/claude-wiki-pages-plugin's protect-raw.bats (MIT).
  const smuggles = [
    ['through ../', `${VAULT}/.claude/hooks/../CLAUDE.md`, {}],
    ['through ./', `${VAULT}/.claude/./settings.json`, {}],
    ['backslashes with ..', `${VAULT}/.claude/agents/../settings.json`.replace(/\//g, '\\'), {}],
    ['through ../ without node', `${VAULT}/.claude/hooks/../CLAUDE.md`, { nodeBroken: true }],
  ];
  for (const [how, file, opts] of smuggles) {
    r = fire(H, write(file), opts);
    record(`floor-guard: SMUGGLE ${how} still surfaces`, /TRUST-ANCHOR/.test(r.out) && r.code === 0, `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');
  }

  r = fire(H, write(`${VAULT}/.claude/../Scriptorium/clean.md`));
  record('floor-guard: quiet on a traversal that lands on an ordinary file', !/TRUST-ANCHOR/.test(r.out) && r.code === 0, `code=${r.code}`, 'quiet');

  // v3.19.0: the rest of the self-modification surface. The Shai-Hulud npm worm
  // wave of October 2026 persists by writing .claude/settings.json and
  // .vscode/tasks.json into any repo it reaches, so these match outside the vault
  // too. Each "surfaces" case below stayed silent on the v3.18.0 guard.
  const OTHER = path.join(os.tmpdir(), 'se-other-repo').replace(/\\/g, '/');
  const newAnchors = [
    ['.mcp.json in the vault', `${VAULT}/.mcp.json`, {}],
    ['the home .claude.json', `${VAULT}/home/.claude.json`, {}],
    ['an installed plugin hook', `${VAULT}/home/.claude/plugins/cache/x/hooks/run.sh`, {}],
    ['.vscode/tasks.json in another repo (the worm shape)', `${OTHER}/.vscode/tasks.json`, {}],
    ['.mcp.json with backslashes, without node', `${VAULT}/.mcp.json`.replace(/\//g, '\\'), { nodeBroken: true }],
    // v3.19.1: the local settings file carries permissions and hooks too, and
    // stayed silent on the v3.19.0 guard.
    ['.claude/settings.local.json in the vault', `${VAULT}/.claude/settings.local.json`, {}],
    ['.claude/settings.local.json without node', `${VAULT}/.claude/settings.local.json`, { nodeBroken: true }],
  ];
  for (const [what, file, opts] of newAnchors) {
    r = fire(H, write(file), opts);
    record(`floor-guard: surfaces ${what}`, /TRUST-ANCHOR/.test(r.out) && r.code === 0, `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');
  }
  r = fire(H, write(`${OTHER}/.claude/settings.json`));
  record('floor-guard: surfaces .claude/settings.json in another repo (the worm shape)', /TRUST-ANCHOR/.test(r.out) && r.code === 0, `code=${r.code}`, 'reacts');
  for (const [what, file] of [
    ['.vscode/settings.json', `${OTHER}/.vscode/settings.json`],
    ['a settings.json outside .claude', `${VAULT}/Council Chamber/scripts/settings.json`],
    ['an mcp.json with no leading dot', `${VAULT}/Scriptorium/mcp.json`],
    ['a .claude/plugins-notes.md beside the plugin folder', `${VAULT}/.claude/plugins-notes.md`],
  ]) {
    r = fire(H, write(file));
    record(`floor-guard: quiet on ${what}`, !/TRUST-ANCHOR/.test(r.out) && r.code === 0, `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'quiet');
  }

  // The surface has to reach the session. A hook that exits 0 shows its stderr to
  // nobody outside verbose mode, so the guard prints a systemMessage on stdout,
  // which Claude Code shows. Until v3.19.0 it wrote stderr alone.
  for (const [how, opts] of [['with node', {}], ['without node', { nodeBroken: true }]]) {
    r = fire(H, write(`${VAULT}/.claude/settings.json`), opts);
    let msg = '';
    try { msg = String(JSON.parse(r.stdout.trim()).systemMessage || ''); } catch { msg = ''; }
    record(`floor-guard: the surface is a systemMessage the session shows, ${how}`, /TRUST-ANCHOR/.test(msg) && msg.includes('.claude/settings.json') && r.code === 0, `code=${r.code} stdout=${r.stdout.trim().slice(0, 60)}`, 'reacts');
  }

  // ── shell writes: Bash and PowerShell ─────────────────────────────────────
  // An agent edits a trust anchor through the shell as easily as through Edit, and
  // until the shell reader landed the guard saw none of it. Each 'reacts' case below
  // must surface a systemMessage naming the tool AND log a line AND exit 0; each
  // 'quiet' case must print nothing, log nothing and exit 0. Paths are the fixture
  // VAULT or invented repo names: the hook only reads the text of a command, it never
  // touches the path, so no real file is involved.
  const logCount = () => {
    const f = `${VAULT}/.runtime/floor-guard.log`;
    return existsSync(f) ? readFileSync(f, 'utf8').split('\n').filter(Boolean).length : 0;
  };
  const shell = (tool, command, cwd) => ({ tool_name: tool, ...(cwd ? { cwd } : {}), tool_input: { command } });
  const ps = (command, cwd) => shell('PowerShell', command, cwd);
  const sh = (command, cwd) => shell('Bash', command, cwd);
  // Fire one shell payload and judge it both ways. A surface is the systemMessage,
  // the stderr line and the log line together, not any one of them.
  const judgeShell = (payload, opts = {}) => {
    const before = logCount();
    const res = fire(H, payload, opts);
    let msg = '';
    try { msg = String(JSON.parse(res.stdout.trim()).systemMessage || ''); } catch { msg = ''; }
    const logged = logCount() - before;
    const surfaced = res.code === 0 && /^TRUST-ANCHOR FILE EDIT: /.test(msg) && msg.includes(payload.tool_name) && /TRUST-ANCHOR FILE EDIT: .*\n?/.test(res.out) && logged >= 1;
    const quiet = res.code === 0 && !/TRUST-ANCHOR/.test(res.out) && res.stdout.trim() === '' && logged === 0;
    return { res, surfaced, quiet, logged, msg };
  };

  // Bash must-surface. Each shape is one the source guard's own suite learned from a miss.
  const bashReacts = [
    ['sed -i, relative path', sh('sed -i "s/a/b/" .claude/settings.json')],
    ['sed -i.bak', sh('sed -i.bak "s/a/b/" "Some Repo/.claude/settings.local.json"')],
    ['sed -Ei combined flags', sh('sed -Ei "s/a/b/" .claude/CLAUDE.md')],
    ['perl -pi -e', sh(`perl -pi -e 's/a/b/' ".mcp.json"`)],
    ['perl -0777 -pi', sh(`perl -0777 -pi -e 's/a/b/g' "${VAULT}/.claude/CLAUDE.md"`)],
    ['redirect >', sh(`echo x > "${VAULT}/.claude/settings.json"`)],
    ['redirect >> with no space', sh('echo x >>.claude/settings.local.json')],
    ['redirect into .mcp.json', sh('echo {} > .mcp.json')],
    ['redirect into the home .claude.json', sh('echo {} > "$HOME/.claude.json"')],
    ['heredoc into a trust anchor', sh(`cat > "${VAULT}/.claude/CLAUDE.md" <<'EOF'\nnew text\nEOF`)],
    ['heredoc with an apostrophe, then a write', sh("cat > /tmp/x <<'EOF'\nthe owner's note\nEOF\nsed -i s/a/b/ .claude/CLAUDE.md")],
    ['tee', sh(`echo x | tee "${VAULT}/.mcp.json"`)],
    ['tee -a', sh(`echo x | tee -a "${VAULT}/.mcp.json" > /dev/null`)],
    ['mv a trust anchor away', sh(`mv "${VAULT}/.claude/settings.json" /tmp/settings.json`)],
    ['mv onto a trust anchor', sh(`mv /tmp/x.json "${VAULT}/.mcp.json"`)],
    ['cp onto a trust anchor', sh(`cp /tmp/s.json "${VAULT}/.claude/settings.json"`)],
    ['SMUGGLE: cp onto settings.json through ../', sh('cp /tmp/x ".claude/agents/../settings.json"')],
    ['SMUGGLE: redirect through ./', sh('echo x > .claude/./settings.json')],
    ['SMUGGLE: case variant', sh('echo x > .CLAUDE/Settings.JSON')],
    ['rm a trust anchor', sh('rm -f .claude/settings.local.json')],
    ['git mv a trust anchor', sh('git mv .claude/settings.json old.json')],
    ['git rm a trust anchor', sh('git -C . rm .claude/CLAUDE.md')],
    ['git checkout --', sh('git checkout -- .claude/CLAUDE.md')],
    ['git restore', sh('git restore .vscode/tasks.json')],
    ['variable holds the directory', sh('D=".claude"; sed -i "s/a/b/" "$D/settings.json"')],
    ['braced variable', sh('D=".claude" && echo x > "${D}/settings.json"')],
    ['cd then a relative write', sh('cd Some/Repo/.claude && sed -i "s/a/b/" settings.json')],
    ['relative to the payload cwd', sh('echo x >> settings.json', `${VAULT}/.claude`)],
    ['node -e writeFileSync', sh(`node -e "require('fs').writeFileSync('${VAULT}/.mcp.json', '{}')"`)],
    ['python open for write', sh(`python -c "open('${VAULT}/.claude/settings.json', 'w').write('x')"`)],
    ['second segment writes', sh('cat .claude/settings.json && sed -i "s/a/b/" .claude/settings.json')],
    ['env prefix', sh('env FOO=1 sed -i s/a/b/ .claude/CLAUDE.md')],
    ['nohup prefix', sh('nohup sed -i s/a/b/ .claude/CLAUDE.md')],
    ['time prefix', sh('time sed -i s/a/b/ .claude/CLAUDE.md')],
    ['then inside an if', sh('if true; then echo x >> .claude/CLAUDE.md; fi')],
    ['bash -c', sh('bash -c "echo x >> .claude/CLAUDE.md"')],
    ['sh -c', sh("sh -c 'sed -i s/a/b/ .claude/CLAUDE.md'")],
    ['lone ampersand', sh('echo a & sed -i s/a/b/ .claude/CLAUDE.md')],
    ['escaped space in the path', sh('echo x > My\\ Repo/.claude/settings.json')],
    ['install', sh('install -m 644 /tmp/foo .claude/CLAUDE.md')],
    ['truncate', sh('truncate -s 0 .claude/CLAUDE.md')],
    ['dd of=', sh('dd if=/dev/null of=.claude/CLAUDE.md')],
    ['cp into the .claude directory', sh('cp /tmp/a.json ".claude/"')],
    ['cp -r a directory into .claude', sh('cp -r /tmp/h ".claude"')],
    ['mv onto the .vscode directory', sh('mv /tmp/a.json ".vscode"')],
    ['cp into an installed plugin folder', sh('cp /tmp/evil.sh "home/.claude/plugins/cache/x/"')],
    ['cp a tasks.json into .vscode', sh('cp /tmp/tasks.json .vscode/tasks.json')],
    ['rm -rf .claude', sh('rm -rf .claude')],
    ['rm -rf .claude/ with a trailing slash', sh('rm -rf .claude/')],
    ['rm -rf .vscode', sh('rm -rf .vscode')],
    ['rm -rf the installed plugins folder', sh('rm -rf home/.claude/plugins')],
    ['mv the .claude directory away', sh('mv .claude /tmp/claude-old')],
    ['$HOME settings path', sh('echo x >> "$HOME/.claude/settings.json"')],
    ['a trust-anchor name in another repo surfaces (by design)', sh('echo x >> .claude/CLAUDE.md', `${os.tmpdir().replace(/\\/g, '/')}/se-other-repo`)],
  ];
  for (const [what, payload] of bashReacts) {
    const j = judgeShell(payload);
    record(`floor-guard: Bash surfaces ${what}`, j.surfaced, `code=${j.res.code} log+${j.logged} out=${j.res.out.trim().slice(0, 50)}`, 'reacts');
  }

  // Bash must-stay-quiet. A guard that surfaces every command has become a wall.
  const bashQuiet = [
    ['git status', sh('git status')],
    ['cat a trust anchor', sh('cat .claude/settings.json')],
    ['grep a trust anchor', sh('grep -n hooks .claude/settings.json .claude/CLAUDE.md')],
    ['sed without -i', sh('sed -n 1,20p .claude/settings.json')],
    ['perl reading only', sh(`perl -ne 'print if /x/' .mcp.json`)],
    ['cp FROM a trust anchor', sh('cp .claude/settings.json /tmp/settings.json')],
    ['cp a trust anchor into scratch', sh('cp .claude/CLAUDE.md /tmp/')],
    ['a stderr redirect only', sh('wc -l .claude/settings.json 2>&1')],
    ['redirect to /dev/null', sh('git diff -- .claude/settings.json > /dev/null')],
    ['a write to another file', sh('sed -i "s/a/b/" Scriptorium/notes.md')],
    ['a settings.json outside .claude', sh('sed -i "s/a/b/" config/settings.json')],
    ['.vscode/settings.json', sh('echo x > .vscode/settings.json')],
    ['a commit message naming a write', sh('git commit -m "sed -i on settings.json, echo x > .mcp.json"')],
    ['git add a trust anchor', sh('git add -- .claude/settings.json')],
    ['git checkout a branch', sh('git checkout main')],
    ['an unknown variable', sh('sed -i "s/a/b/" "$UNSET/settings.json"')],
    ['an ordinary file', sh('echo x > notes.txt')],
    ['bash -c reading', sh('bash -c "cat .claude/CLAUDE.md"')],
    ['an ampersand inside quotes', sh('echo "a & b" > /tmp/x')],
    ['rm in the runtime directory', sh('rm -rf .runtime/fixtures/case1')],
    ['a heredoc body naming a write', sh("cat > /tmp/notes <<'EOF'\nsed -i s/a/b/ .claude/CLAUDE.md\nEOF")],
    ['a copy into a plain directory', sh('cp /tmp/n.md Scriptorium/')],
    ['an mcp.json with no leading dot', sh('echo x > Scriptorium/mcp.json')],
  ];
  for (const [what, payload] of bashQuiet) {
    const j = judgeShell(payload);
    record(`floor-guard: Bash quiet on ${what}`, j.quiet, `code=${j.res.code} log+${j.logged} out=${j.res.out.trim().slice(0, 50)}`, 'quiet');
  }

  // PowerShell must-surface. Backslash paths unquoted, because a reader that took the
  // backslash as an escape would miss exactly those.
  const psReacts = [
    ['Set-Content -Path', ps('Set-Content -Path ".claude/CLAUDE.md" -Value x -Encoding UTF8')],
    ['Set-Content, absolute backslash path', ps('Set-Content -LiteralPath "C:\\work\\repo\\.claude\\settings.json" -Value x')],
    ['Set-Content, unquoted absolute backslash path', ps('Set-Content C:\\work\\repo\\.claude\\CLAUDE.md x')],
    ['Remove-Item, unquoted relative backslash path', ps('Remove-Item .claude\\settings.local.json')],
    ['(Get-Content) -replace | Set-Content', ps("(Get-Content .claude/settings.json -Encoding UTF8) -replace 'a','b' | Set-Content .claude/settings.json -Encoding UTF8")],
    ['Out-File -FilePath', ps('"{}" | Out-File -FilePath "C:\\work\\repo\\.mcp.json" -Encoding UTF8')],
    ['Add-Content positional path', ps("Add-Content '.vscode\\tasks.json' 'x'")],
    ['Copy-Item onto a trust anchor', ps('Copy-Item x .vscode/tasks.json')],
    ['Copy-Item -Destination', ps('Copy-Item -Path C:\\tmp\\x.json -Destination ".claude\\settings.json"')],
    ['Copy-Item into the .claude directory', ps('Copy-Item C:\\tmp\\x.json ".claude\\"')],
    ['Remove-Item the .claude directory', ps('Remove-Item -Recurse -Force ".claude"')],
    ['Remove-Item the .vscode directory', ps('Remove-Item -Recurse -Force .vscode')],
    ['rm alias on the .claude directory', ps('rm -r -fo .claude')],
    ['Move-Item a trust anchor away', ps('Move-Item ".claude/settings.json" C:\\tmp\\settings.json')],
    ['Rename-Item a trust anchor', ps('Rename-Item .mcp.json mcp.old')],
    ['redirect >', ps('"x" > .claude/CLAUDE.md')],
    ['redirect >> with a stream prefix', ps('echo x 2>&1 >> ".mcp.json"')],
    ['variable holds the path', ps('$p = "C:\\work\\repo\\.claude\\CLAUDE.md"; Set-Content -Path $p -Value x')],
    ['variable holds the directory, glued assignment', ps('$d=".claude"; Set-Content "$d\\settings.json" x')],
    ['[IO.File]::WriteAllText', ps('[IO.File]::WriteAllText("C:\\work\\repo\\.claude\\settings.json", "x")')],
    ['the home .claude.json through $env:USERPROFILE', ps('Set-Content "$env:USERPROFILE\\.claude.json" "{}"')],
    ['an installed plugin hook', ps('Set-Content "$HOME\\.claude\\plugins\\cache\\x\\hooks\\run.ps1" "x"')],
    ['alias sc', ps('sc .claude/CLAUDE.md x')],
    ['relative to the payload cwd', ps('Set-Content settings.json "{}"', `${VAULT}/.claude`)],
    ['a second statement writes', ps('Get-Content .claude/CLAUDE.md; Set-Content .claude/CLAUDE.md x')],
    ['git rm a trust anchor', ps('git rm ".claude/CLAUDE.md"')],
    ['sed -i through PowerShell', ps('sed -i "s/a/b/" .claude/settings.json')],
    ['node -e writeFileSync', ps(`node -e "require('fs').writeFileSync('${VAULT}/.mcp.json', '{}')"`)],
  ];
  for (const [what, payload] of psReacts) {
    const j = judgeShell(payload);
    record(`floor-guard: PowerShell surfaces ${what}`, j.surfaced, `code=${j.res.code} log+${j.logged} out=${j.res.out.trim().slice(0, 50)}`, 'reacts');
  }

  const psQuiet = [
    ['Get-Content a trust anchor', ps('Get-Content .claude/CLAUDE.md -Encoding UTF8')],
    ['Select-String a trust anchor', ps('Select-String -Path ".claude/CLAUDE.md" -Pattern hooks')],
    ['a read with stderr to $null', ps('Get-Content .claude/settings.json 2>$null')],
    ['a write to another file', ps('Set-Content -Path "Scriptorium\\notes.md" -Value x -Encoding UTF8')],
    ['Copy-Item FROM a trust anchor', ps('Copy-Item .claude/CLAUDE.md C:\\tmp\\claude.md')],
    ['a commit message naming a write', ps('git commit -m "Set-Content .claude/CLAUDE.md" -- x.md')],
    ['git add a trust anchor', ps('git add -- ".claude/CLAUDE.md"')],
    ['Copy-Item a note into a plain directory', ps('Copy-Item C:\\tmp\\n.md "Scriptorium\\"')],
    ['git status', ps('git status')],
  ];
  for (const [what, payload] of psQuiet) {
    const j = judgeShell(payload);
    record(`floor-guard: PowerShell quiet on ${what}`, j.quiet, `code=${j.res.code} log+${j.logged} out=${j.res.out.trim().slice(0, 50)}`, 'quiet');
  }

  // The three outputs together, read off one Bash hit: the message names the tool and
  // the path, stderr carries the line, the log carries the line with the tool and path.
  {
    const before = logCount();
    const res = fire(H, sh(`sed -i "s/a/b/" "${VAULT}/.claude/settings.json"`));
    let msg = '';
    try { msg = String(JSON.parse(res.stdout.trim()).systemMessage || ''); } catch { msg = ''; }
    const logTail = existsSync(`${VAULT}/.runtime/floor-guard.log`) ? readFileSync(`${VAULT}/.runtime/floor-guard.log`, 'utf8').split('\n').filter(Boolean).slice(before).join('\n') : '';
    record('floor-guard: a Bash hit names the tool and the path in the message', /Bash on /.test(msg) && msg.includes('.claude/settings.json') && res.code === 0, `msg=${msg.slice(0, 60)}`, 'reacts');
    record('floor-guard: a Bash hit writes the stderr line', /TRUST-ANCHOR FILE EDIT: Bash on .*\.claude\/settings\.json/.test(res.out.replace(res.stdout, '')), `out=${res.out.replace(res.stdout, '').trim().slice(0, 60)}`, 'reacts');
    record('floor-guard: a Bash hit writes the log line', /^\[[^\]]+\] Bash \(sed -i\): .*\.claude\/settings\.json$/m.test(logTail), `log=${logTail.slice(0, 60)}`, 'reacts');
  }

  // No node, shell calls: the same promise as the Write path. The reading cannot tell
  // a write from a read, so it names the path and says it matched without parsing.
  for (const [what, payload] of [
    ['a Bash write to a trust anchor', sh(`sed -i "s/a/b/" "${VAULT}/.claude/settings.json"`)],
    ['a Bash redirect into .mcp.json', sh('echo {} > .mcp.json')],
    ['a PowerShell write with a backslash path', ps('Set-Content C:\\work\\repo\\.claude\\CLAUDE.md x')],
    ['a Bash rm -rf of the .claude directory', sh('rm -rf .claude')],
  ]) {
    const j = judgeShell(payload, { nodeBroken: true });
    record(`floor-guard: still surfaces ${what} without node`, j.surfaced && /without parsing/.test(j.msg), `code=${j.res.code} log+${j.logged} out=${j.res.out.trim().slice(0, 50)}`, 'reacts');
  }
  for (const [what, payload] of [
    ['git status', sh('git status')],
    ['a PowerShell git status', ps('git status')],
    ['an ordinary Bash write', sh('echo x > notes.txt')],
  ]) {
    const j = judgeShell(payload, { nodeBroken: true });
    record(`floor-guard: quiet on ${what} without node`, j.quiet, `code=${j.res.code} log+${j.logged} out=${j.res.out.trim().slice(0, 50)}`, 'quiet');
  }

  // With the vault root unset the log lands under the working directory.
  {
    const j = judgeShell(sh('sed -i "s/a/b/" .claude/settings.json'), { vaultRoot: null });
    record('floor-guard: a Bash hit surfaces with SOVEREIGN_VAULT_ROOT unset', j.surfaced, `code=${j.res.code} log+${j.logged}`, 'reacts');
  }

  // The module on its own: a payload that is not a JSON object exits 1, and a clean
  // object exits 0 with an empty hit list. Under --negative-control the stub stands in.
  {
    const mod = (input) => spawnSync(NEGATIVE ? 'bash' : process.execPath, [NEGATIVE ? STUB : hook('floor-guard-shell.mjs')], { input, encoding: 'utf8' });
    for (const [what, input] of [['garbage', 'not json at all'], ['an array', '[]'], ['null', 'null'], ['empty input', '']]) {
      const m = mod(input);
      // The module's own refusal line, so a missing module (which also exits 1) fails the case.
      record(`floor-guard-shell: ${what} payload exits 1`, m.status === 1 && /payload is not a JSON object/.test(m.stderr || ''), `exit=${m.status} err=${(m.stderr || '').trim().slice(0, 50)}`, 'reacts');
    }
    const m = mod(JSON.stringify(sh('git status')));
    let parsed = null;
    try { parsed = JSON.parse(m.stdout); } catch { parsed = null; }
    record('floor-guard-shell: a clean Bash payload exits 0 with no hits', m.status === 0 && parsed && Array.isArray(parsed.hits) && parsed.hits.length === 0, `exit=${m.status} out=${(m.stdout || '').trim().slice(0, 40)}`, 'reacts');
    const h = mod(JSON.stringify(sh('echo x > .mcp.json')));
    try { parsed = JSON.parse(h.stdout); } catch { parsed = null; }
    record('floor-guard-shell: a hit lists the path and the verb', h.status === 0 && parsed && parsed.hits.length === 1 && /\.mcp\.json$/.test(parsed.hits[0].path) && parsed.hits[0].via === '>', `exit=${h.status} out=${(h.stdout || '').trim().slice(0, 60)}`, 'reacts');
  }
}

// ── the compact pair ────────────────────────────────────────────────────────
// The capture must write where the reorienter reads. They are checked together,
// because each one alone can look healthy while the pair is broken.
{
  const CAP = hook('pre-compact-state-capture.sh');
  const REO = hook('post-compact-reorienter.sh');
  const snapshot = path.join(VAULT, '.runtime', 'pre-compact-state.md');

  // Fire the capture from a SUBDIRECTORY. This is the bug: it used to plant an
  // orphaned .runtime right there and the vault snapshot was never written.
  const sub = path.join(VAULT, 'Scriptorium');
  fire(CAP, {}, { cwd: sub });

  record(
    'compact: capture writes to the VAULT root, not the cwd',
    existsSync(snapshot),
    existsSync(snapshot) ? 'snapshot at vault root' : 'snapshot MISSING at vault root',
    'reacts'
  );
  record(
    'compact: capture plants no orphan in the subdirectory',
    !existsSync(path.join(sub, '.runtime')),
    existsSync(path.join(sub, '.runtime')) ? 'ORPHAN .runtime in subdir' : 'no orphan',
    'quiet'
  );

  // The reorienter must FIND what the capture wrote, also from a subdirectory.
  const r = fire(REO, {}, { cwd: sub });
  record(
    'compact: reorienter finds the snapshot the capture wrote',
    /Pre-Compact State Snapshot|Reorientation/i.test(r.out) && !/No pre-compact state found/i.test(r.out),
    `out=${r.out.trim().slice(0, 44)}`,
    'reacts'
  );
}

// ── session-start-primer.sh ─────────────────────────────────────────────────
{
  const H = hook('session-start-primer.sh');
  writeFileSync(path.join(VAULT, '.runtime/primer.md'), '# Primer\nThe session state lives here.\n');
  const r = fire(H, {}, { cwd: VAULT });
  record('primer: injects .runtime/primer.md when present', /session state lives here/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'reacts');

  const empty = mkdtempSync(path.join(os.tmpdir(), 'se-empty-'));
  const r2 = fire(H, {}, { cwd: empty });
  record('primer: degrades cleanly with no .runtime/primer.md', r2.code === 0, `code=${r2.code}`, 'quiet');
  rmSync(empty, { recursive: true, force: true });
}

// ── post-write-index-regen.sh ───────────────────────────────────────────────
// It must actually REGENERATE, not merely log that it noticed. A hook that logs
// "no regen cmd configured" forever is a hook that does nothing, dressed as one
// that does something.
//
// This assertion used to test for the ABSENCE of that string, and the negative
// control caught it: a hook replaced by a do-nothing stub writes no log at all,
// so the absent string was absent and the case passed against nothing. It now
// demands positive evidence in the log instead, which a stub cannot produce.
{
  const H = hook('post-write-index-regen.sh');
  const r = fire(H, write(`${VAULT}/Council Chamber/Skills/Demo/SKILL.md`));
  const logPath = path.join(VAULT, '.runtime', 'index-regen.log');
  const logged = existsSync(logPath) ? readFileSync(logPath, 'utf8') : '';
  const inert = /no regen cmd configured/i.test(r.out) || /no regen cmd configured/i.test(logged);
  const acted = /skills-index/i.test(logged);
  record(
    'index-regen: is wired to a real regen command',
    acted && !inert,
    !acted ? 'NO EVIDENCE it ran. Log is empty of any skills-index record.'
      : inert ? 'INERT. It only logs that it noticed.'
      : 'a regen command is configured and ran',
    'reacts'
  );

  // The tier refusal (v3.25.0). The fixture gets the real builder and an index,
  // then a skill written with no tier. The rebuild must refuse, name the skill to
  // the AI and leave the index as it was. With the tier added, the same write
  // must rebuild the index in silence. Fired from a subfolder cwd, since the
  // session is often not at the vault root.
  const SCRIPTS = path.join(VAULT, 'Council Chamber', 'scripts');
  mkdirSync(SCRIPTS, { recursive: true });
  writeFileSync(path.join(SCRIPTS, 'build-skills-index.mjs'), readFileSync(path.join(ROOT, 'Council Chamber', 'scripts', 'build-skills-index.mjs')));
  const INDEX = path.join(VAULT, 'Council Chamber', 'Skills', 'Skills Index.md');
  const INDEX_BEFORE = '# Skills Index\n\n## Skills\n- Other (active, tier: operational)\n';
  writeFileSync(INDEX, INDEX_BEFORE);
  mkdirSync(path.join(VAULT, 'Council Chamber', 'Skills', 'Other'), { recursive: true });
  writeFileSync(path.join(VAULT, 'Council Chamber', 'Skills', 'Other', 'SKILL.md'), '---\nname: other\nstatus: active\ntier: operational\n---\n');
  const DEMO = path.join(VAULT, 'Council Chamber', 'Skills', 'Demo', 'SKILL.md');
  const SUB = path.join(VAULT, 'Scriptorium');
  writeFileSync(DEMO, '---\nname: demo\nstatus: active\n---\n');
  let r2 = fire(H, write(DEMO.replace(/\\/g, '/')), { cwd: SUB });
  let ctx = contextOf(r2);
  record('index-regen: an untiered skill is named to the AI, not only logged', /Demo\/SKILL\.md tier is missing/.test(ctx) && /not rebuilt/.test(ctx), `context=${ctx.trim().slice(0, 60)}`, 'reacts');
  record('index-regen: a refused rebuild leaves the index untouched', readFileSync(INDEX, 'utf8') === INDEX_BEFORE, 'index compared byte for byte', 'quiet');
  writeFileSync(DEMO, '---\nname: demo\nstatus: active\ntier: foundational\n---\n');
  r2 = fire(H, write(DEMO.replace(/\\/g, '/')), { cwd: SUB });
  ctx = contextOf(r2);
  record('index-regen: a tiered skill is indexed from a subfolder cwd', /- Demo \(active, tier: foundational\)/.test(readFileSync(INDEX, 'utf8')), `index=${readFileSync(INDEX, 'utf8').replace(/\n/g, ' | ').slice(0, 80)}`, 'reacts');
  record('index-regen: a clean rebuild says nothing to the AI', ctx === '', `context=${ctx.trim().slice(0, 40)}`, 'quiet');
}

// ── post-bash-encoding-check.sh ─────────────────────────────────────────────
// A mojibake detector. It must WARN when a recently modified vault file carries
// the byte signature of UTF-8 read as Windows-1252, stay SILENT when the recent
// files are clean, and it must watch the PowerShell tool, which is the tool that
// causes the corruption. A detector registered on Bash alone is blind to the one
// door it exists for.
{
  const H = hook('post-bash-encoding-check.sh');
  const MOJI = `${VAULT}/Scriptorium/mojibake.md`;

  // The bytes UTF-8 leaves behind when an em dash makes the round trip through
  // Windows-1252. This is the damage, written on purpose, built by mojibake()
  // so it is the real damage and never a typed look-alike.
  writeFileSync(MOJI, `A corrupted em dash lives here: ${mojibake('—')} and it should be caught.\n`);
  let r = fire(H, bash('echo touched'));
  record('encoding: warns on a corrupted file in the vault', /mojibake|corruption/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'reacts');
  record('encoding: the warning reaches the AI as additionalContext', /mojibake/i.test(contextOf(r)) && r.code === 0, `code=${r.code} stdout=${r.stdout.trim().slice(0, 60)}`, 'reacts');

  // A checkmark ends in the other curly quote. Its own case, so neither
  // signature can go blind behind the other.
  writeFileSync(MOJI, `A corrupted checkmark lives here: ${mojibake('✓')} and it should be caught.\n`);
  r = fire(H, bash('echo touched'));
  record('encoding: warns on a corrupted checkmark', /mojibake|corruption/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'reacts');

  // A real em dash beside straight quotes is writing, not damage.
  writeFileSync(MOJI, 'A real em dash — and "straight quotes" are not damage.\n');
  r = fire(H, bash('echo touched'));
  record('encoding: quiet on a real em dash beside straight quotes', !/mojibake|corruption/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'quiet');

  writeFileSync(MOJI, `A corrupted em dash lives here: ${mojibake('—')} and it should be caught.\n`);

  // Same damage, delivered by the PowerShell tool. It must still be seen.
  r = fire(H, { tool_name: 'PowerShell', tool_input: { command: `Set-Content "${MOJI}" "x"` } });
  record('encoding: watches the PowerShell tool, which causes it', /mojibake|corruption/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'reacts');

  rmSync(MOJI, { force: true });
  r = fire(H, bash('echo touched'));
  record('encoding: silent when the recent files are clean', !/mojibake|corruption/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'quiet');

  // node_modules is pruned, never walked (v3.21.0). Damage inside it stays unreported.
  mkdirSync(`${VAULT}/node_modules/pkg`, { recursive: true });
  writeFileSync(`${VAULT}/node_modules/pkg/README.md`, `A corrupted em dash lives here: ${mojibake('—')} and it should be caught.\n`);
  r = fire(H, bash('echo touched'));
  rmSync(`${VAULT}/node_modules`, { recursive: true, force: true });
  record('encoding: never reports from node_modules', !/mojibake|corruption/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'quiet');
}

// ── post-bash-move-audit.sh ─────────────────────────────────────────────────
// It must WARN when a moved .md still has wikilinks pointing at the old name,
// stay SILENT on a move nothing references, and it must NOT hang. A move of a
// short-named file outside the vault once made it grep the whole vault for a
// single letter, which is a stall dressed as a scan.
{
  const H = hook('post-bash-move-audit.sh');

  // A referenced file: something in the vault wikilinks to it. Moving it must warn.
  mkdirSync(path.join(VAULT, 'Library'), { recursive: true });
  writeFileSync(`${VAULT}/Council Chamber/Skills/Demo/Note.md`, '# Note\n');
  writeFileSync(`${VAULT}/Library/refers.md`, 'See [[Council Chamber/Skills/Demo/Note]] for detail.\n');
  let r = fire(H, bash('mv "Council Chamber/Skills/Demo/Note.md" "Library/Note.md"'));
  record('move-audit: warns when a moved file still has references', /move audit|wikilink|reference/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'reacts');
  record('move-audit: the warning reaches the AI as additionalContext', /move audit/i.test(contextOf(r)) && r.code === 0, `code=${r.code} stdout=${r.stdout.trim().slice(0, 60)}`, 'reacts');

  // A move of a file nothing links to: correctly silent, not a false alarm.
  writeFileSync(`${VAULT}/Scriptorium/lonely.md`, '# Lonely\n');
  r = fire(H, bash('mv "Scriptorium/lonely.md" "Library/lonely.md"'));
  record('move-audit: silent on a move nothing references', !/move audit|wikilink/i.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'quiet');

  // THE HANG REGRESSION. A short-named .md moved OUTSIDE the vault must not send
  // the hook grepping the whole vault for its stem. Timed: a stall is a failure.
  const t0 = Date.now();
  r = fire(H, bash('mv /tmp/a.md /tmp/b.md'));
  const elapsed = Date.now() - t0;
  record('move-audit: does not stall on a short-named external move', elapsed < 10000 && !/move audit/i.test(r.out), `elapsed=${elapsed}ms`, 'quiet');
}

// ── outward-gate.sh ─────────────────────────────────────────────────────────
// Acts that leave the vault: connected-service tools (mcp__*) and the outward
// scripts the Sovereign names in outward-gate.config.json.
// Consent is once per service per session and is recorded only on PostToolUse, so
// a denied call can never set it. An "ask" forces a prompt even in auto mode, so
// the cases look for the ask decision, never for a block. The config is a fixture
// in the temp vault, reached through OUTWARD_GATE_CONFIG; the shipped example is
// empty, so the default install has nothing open and no script named.
{
  const H = hook('outward-gate.sh');
  const NO_CONFIG = { extraEnv: { OUTWARD_GATE_CONFIG: `${VAULT}/no-such-outward-gate.config.json` } };
  const CONFIG_FILE = `${VAULT}/outward-gate.config.json`;
  const WITH_CONFIG = { extraEnv: { OUTWARD_GATE_CONFIG: CONFIG_FILE } };
  let seq = 0;
  const session = () => `selftest-${process.pid}-${++seq}`;
  const mcp = (tool_name, sid, event = 'PreToolUse') => ({ hook_event_name: event, session_id: sid, tool_name, tool_input: {} });
  const sh = (command, sid, event = 'PreToolUse') => ({ hook_event_name: event, session_id: sid, tool_name: 'Bash', tool_input: { command } });
  const asks = (r) => /"permissionDecision":"ask"/.test(r.out);
  const silent = (r) => r.code === 0 && !/permissionDecision/.test(r.out);

  let sid = session();
  let r = fire(H, mcp('mcp__acme__create_post', sid), NO_CONFIG);
  record('outward-gate: asks on the first write to a service', asks(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');
  record('outward-gate: the ask names the service and the session', /acme/.test(r.out) && /rest of this session/.test(r.out), `out=${r.out.trim().slice(0, 40)}`, 'reacts');

  // A denied call never ran, so PostToolUse never fired, so consent is not set.
  r = fire(H, mcp('mcp__acme__create_post', sid), NO_CONFIG);
  record('outward-gate: a denied call leaves no consent behind', asks(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');

  fire(H, mcp('mcp__acme__create_post', sid, 'PostToolUse'), NO_CONFIG);
  const again = fire(H, mcp('mcp__acme__delete_post', sid), NO_CONFIG);
  const other = fire(H, mcp('mcp__other__create_post', sid), NO_CONFIG);
  const consentFile = path.join(VAULT, '.runtime', 'outward-consent', `${sid}.json`);
  record(
    'outward-gate: passes after consent is recorded, only for that service',
    existsSync(consentFile) && silent(again) && asks(other),
    `recorded=${existsSync(consentFile)} same=${silent(again) ? 'pass' : 'ask'} other=${asks(other) ? 'ask' : 'pass'}`,
    'reacts'
  );

  sid = session();
  r = fire(H, mcp('mcp__acme__list_posts', sid), NO_CONFIG);
  record('outward-gate: a read verb passes', silent(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'quiet');

  r = fire(H, mcp('mcp__acme__export_all', sid), NO_CONFIG);
  record('outward-gate: an export verb is not a read verb, it asks', asks(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');

  // Some connectors name their tools after themselves first (claude_ai_Slack's
  // slack_list_user_channels). The verb is the word after the service's own name,
  // so the read passes and the send still asks (v3.21.0).
  r = fire(H, mcp('mcp__claude_ai_Slack__slack_list_user_channels', sid), NO_CONFIG);
  record('outward-gate: a read named after its own connector passes', silent(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'quiet');
  r = fire(H, mcp('mcp__claude_ai_Slack__slack_send_message', sid), NO_CONFIG);
  record('outward-gate: a send named after its own connector still asks', asks(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');

  // find and download only read (v3.21.0). A compound name reads only when every
  // verb after an "and" reads too, so find_and_replace still asks.
  r = fire(H, mcp('mcp__acme__find_funders_by_topic', sid), NO_CONFIG);
  record('outward-gate: a find verb passes', silent(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'quiet');
  r = fire(H, mcp('mcp__acme__download_file_content', sid), NO_CONFIG);
  record('outward-gate: a download verb passes', silent(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'quiet');
  r = fire(H, mcp('mcp__acme__find_and_replace', sid), NO_CONFIG);
  record('outward-gate: find_and_replace asks, since replace writes', asks(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');

  // Fails closed: a payload that is not a JSON object, and one that is an array.
  r = fire(H, 'not an object', NO_CONFIG);
  record('outward-gate: fails closed on a payload that is not an object', r.code === 2, `code=${r.code}`, 'reacts');
  r = fire(H, [1, 2], NO_CONFIG);
  record('outward-gate: fails closed on an array payload', r.code === 2, `code=${r.code}`, 'reacts');

  // Write and Edit are never matched, so a broken gate always leaves the repair door.
  r = fire(H, { hook_event_name: 'PreToolUse', session_id: sid, tool_name: 'Write', tool_input: { file_path: CLEAN } }, NO_CONFIG);
  record('outward-gate: Write is never matched', silent(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'quiet');

  // Configured lists: a named outward script asks, --dry-run passes, an unlisted
  // script passes, a listed open server passes.
  writeFileSync(CONFIG_FILE, JSON.stringify({ openServers: ['localdocs'], outwardScripts: { 'send-newsletter': 'resend' } }));
  sid = session();
  r = fire(H, sh('node "Council Chamber/scripts/send-newsletter.mjs" --live', sid), WITH_CONFIG);
  record('outward-gate: a configured outward script asks', asks(r) && /resend/.test(r.out), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');
  r = fire(H, sh('node "Council Chamber/scripts/send-newsletter.mjs" --dry-run', sid), WITH_CONFIG);
  record('outward-gate: --dry-run on a configured script passes', silent(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'quiet');
  r = fire(H, sh('node "Council Chamber/scripts/link-checker.mjs"', sid), WITH_CONFIG);
  record('outward-gate: a script not in the config passes', silent(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'quiet');
  r = fire(H, mcp('mcp__localdocs__create_note', sid), WITH_CONFIG);
  record('outward-gate: a configured open server passes whole', silent(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'quiet');
  // v3.24.0: a --dry-run anywhere in the command used to stand the whole gate down,
  // so a live send chained after its own dry run passed with no ask.
  r = fire(H, sh('node "Council Chamber/scripts/send-newsletter.mjs" --dry-run && node "Council Chamber/scripts/send-newsletter.mjs" --live', session()), WITH_CONFIG);
  record('outward-gate: a live send chained after its own dry run asks', asks(r) && /resend/.test(r.out), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');
  r = fire(H, sh('node "Council Chamber/scripts/send-newsletter.mjs" --live --note "checked after the --dry-run"', session()), WITH_CONFIG);
  record('outward-gate: a live send whose quoted note names the flag asks', asks(r) && /resend/.test(r.out), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');
  r = fire(H, { hook_event_name: 'PreToolUse', session_id: session(), tool_name: 'PowerShell', tool_input: { command: 'node "C:\\vault\\Council Chamber\\scripts\\send-newsletter.mjs" --dry-run' } }, WITH_CONFIG);
  record('outward-gate: --dry-run passes in the PowerShell form', silent(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'quiet');
  r = fire(H, sh('node "Council Chamber/scripts/send-newsletter.mjs" --live', sid), NO_CONFIG);
  record('outward-gate: with no config the default list is empty', silent(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'quiet');

  // A config that exists but is unusable must never open the gate.
  writeFileSync(CONFIG_FILE, '{ "outwardScripts": ');
  r = fire(H, sh('node "Council Chamber/scripts/send-newsletter.mjs" --live', sid), WITH_CONFIG);
  record('outward-gate: a malformed config fails closed', r.code === 2 && /does not parse/.test(r.out), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');
  writeFileSync(CONFIG_FILE, JSON.stringify({ openServers: 'localdocs' }));
  r = fire(H, mcp('mcp__acme__list_posts', sid), WITH_CONFIG);
  record('outward-gate: a config of the wrong shape fails closed', r.code === 2, `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');
  rmSync(CONFIG_FILE, { force: true });

  // v3.19.0: secret writes ask with no config at all. Each passed in silence on the
  // v3.18.0 gate.
  const ps = (command, sid) => ({ hook_event_name: 'PreToolUse', session_id: sid, tool_name: 'PowerShell', tool_input: { command } });
  for (const [label, make, service] of [
    ['fly secrets set', (s) => sh('fly secrets set API_TOKEN=x -a my-app', s), 'fly'],
    ['wrangler secret put', (s) => sh('wrangler secret put API_KEY', s), 'cloudflare'],
    ['vercel env add', (s) => sh('vercel env add API_KEY production', s), 'vercel'],
  ]) {
    r = fire(H, make(session()), NO_CONFIG);
    record(`outward-gate: asks before ${label}`, asks(r) && r.out.includes(`outward act on ${service} `), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');
  }

  // v3.20.0: CLI deploys are quiet. No ask, one "quiet" line in the gate's log. The
  // log line is what makes these falsifiable: a gate that did nothing writes none.
  const GATE_LOG = path.join(VAULT, '.runtime', 'outward-gate.log');
  const gateLog = () => (existsSync(GATE_LOG) ? readFileSync(GATE_LOG, 'utf8') : '');
  for (const [label, make, service] of [
    ['flyctl deploy, PowerShell form', (s) => ps('flyctl deploy .\\app -a my-app --remote-only 2>&1', s), 'fly'],
    ['npx wrangler deploy after cd', (s) => sh('cd worker && npx wrangler deploy', s), 'cloudflare'],
    ['vercel deploy --prod', (s) => sh('vercel deploy --prod --yes', s), 'vercel'],
    ['npm run deploy', (s) => sh('npm run deploy', s), 'deploy'],
  ]) {
    const s = session();
    r = fire(H, make(s), NO_CONFIG);
    record(`outward-gate: ${label} is quiet, logged and never asked`, silent(r) && gateLog().includes(`quiet ${s} ${service} `), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');
  }

  // An asking act in the same command outranks a quiet one.
  r = fire(H, sh('npx wrangler deploy && npx wrangler secret put API_KEY', session()), NO_CONFIG);
  record('outward-gate: a deploy chained to a secret write asks', asks(r) && r.out.includes('outward act on cloudflare '), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');
  // v3.24.0: the dry run excuses only its own segment.
  r = fire(H, sh('npx wrangler deploy --dry-run; npx wrangler secret put API_KEY', session()), NO_CONFIG);
  record('outward-gate: a secret write after a dry-run deploy asks', asks(r) && r.out.includes('outward act on cloudflare '), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');

  // A quiet deploy that ran records no consent, so a later secret write still asks.
  sid = session();
  fire(H, sh('npx wrangler deploy', sid), NO_CONFIG);
  fire(H, sh('npx wrangler deploy', sid, 'PostToolUse'), NO_CONFIG);
  r = fire(H, sh('npx wrangler secret put API_KEY', sid), NO_CONFIG);
  record('outward-gate: a quiet deploy opens no door to a secret write', asks(r) && !existsSync(path.join(VAULT, '.runtime', 'outward-consent', `${sid}.json`)), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');

  // A server launched with --read-only in .mcp.json passes whole; the same server
  // without the flag asks, and so does one with no .mcp.json entry at all.
  const MCP_FILE = `${VAULT}/.mcp.json`;
  writeFileSync(MCP_FILE, JSON.stringify({ mcpServers: { docs: { command: 'npx', args: ['-y', 'docs-server', '--read-only'] } } }));
  r = fire(H, mcp('mcp__docs__execute_sql', session()), NO_CONFIG);
  const roPass = r;
  writeFileSync(MCP_FILE, JSON.stringify({ mcpServers: { docs: { command: 'npx', args: ['-y', 'docs-server'] } } }));
  r = fire(H, mcp('mcp__docs__execute_sql', session()), NO_CONFIG);
  record('outward-gate: a --read-only server passes whole, and removing the flag asks again', silent(roPass) && asks(r), `ro=${silent(roPass) ? 'pass' : 'ask'} flagless=${asks(r) ? 'ask' : 'pass'}`, 'reacts');
  writeFileSync(MCP_FILE, '{ "mcpServers": ');
  r = fire(H, mcp('mcp__docs__execute_sql', session()), NO_CONFIG);
  record('outward-gate: an unreadable .mcp.json fails toward ask', asks(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');
  rmSync(MCP_FILE, { force: true });
  for (const [label, command] of [
    ['flyctl status', 'flyctl status -a my-app'],
    ['flyctl ssh running a script', 'flyctl ssh console -a my-app -C "node /app/probe.mjs"'],
    ['wrangler dev', 'npx wrangler dev'],
    ['vercel env ls', 'vercel env ls production'],
    ['a deploy with --dry-run', 'npx wrangler deploy --dry-run'],
    ['npm run deploy:check', 'npm run deploy:check'],
  ]) {
    r = fire(H, sh(command, session()), NO_CONFIG);
    record(`outward-gate: silent on ${label}`, silent(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'quiet');
  }

  // outwardCommands: the Sovereign names their own deploy commands, matched as whole
  // words at the start of a command, so a longer word sharing the prefix passes.
  writeFileSync(CONFIG_FILE, JSON.stringify({ outwardCommands: { 'firebase deploy': 'firebase' } }));
  r = fire(H, sh('cd site && firebase deploy --only hosting', session()), WITH_CONFIG);
  record('outward-gate: a configured outward command asks', asks(r) && r.out.includes('outward act on firebase '), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'reacts');
  r = fire(H, sh('firebase deploy:list', session()), WITH_CONFIG);
  record('outward-gate: a longer word sharing a configured prefix passes', silent(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'quiet');
  r = fire(H, sh('firebase emulators:start', session()), WITH_CONFIG);
  record('outward-gate: an unconfigured subcommand passes', silent(r), `code=${r.code} out=${r.out.trim().slice(0, 40)}`, 'quiet');
  writeFileSync(CONFIG_FILE, JSON.stringify({ outwardCommands: ['firebase deploy'] }));
  r = fire(H, sh('git status', session()), WITH_CONFIG);
  record('outward-gate: an outwardCommands list of the wrong shape fails closed', r.code === 2 && /outwardCommands/.test(r.out), `code=${r.code} out=${r.out.trim().slice(0, 60)}`, 'reacts');
  rmSync(CONFIG_FILE, { force: true });
}

// ── pre-bash-git-add-guard.sh and pre-shell-git-verb-gate.sh ────────────────
// Two git guards on Bash and PowerShell. The add guard refuses a sweeping
// stage or commit aimed at this vault, where other sessions may be working; the
// verb gate asks before a git command that destroys work, in any spelling.
// Each case reads the decision the session acts on (deny, ask or nothing), never
// only the exit code. New in v3.25.0; every 'reacts' case below failed against
// v3.24.0, which shipped neither hook.
{
  const ADD = hook('pre-bash-git-add-guard.sh');
  const VERB = hook('pre-shell-git-verb-gate.sh');
  const OTHER = path.join(os.tmpdir(), 'se-other-repo').replace(/\\/g, '/');
  const shellCall = (tool, command, cwd = VAULT) => ({ tool_name: tool, tool_input: { command }, cwd });
  const decisionOf = (r) => {
    try { return JSON.parse(r.stdout.trim()).hookSpecificOutput?.permissionDecision || 'none'; } catch { return 'none'; }
  };
  // The Git Bash spelling of a Windows path (/c/Users/...). Elsewhere, the path itself.
  const gitBashForm = VAULT.replace(/^([A-Za-z]):\//, (_, d) => `/${d.toLowerCase()}/`);
  const heredoc = 'git commit -m "$(cat <<\'EOF\'\nNever git add -A and never git commit -a, other sessions run here.\nEOF\n)" -- "Council Chamber/x.md"';
  const herestring = 'git commit -m @\'\nmentions git add . and git commit -am in the text\n\'@ -- "x.md"';

  // [name, tool, command, cwd, expected decision, options]
  const addCases = [
    ['denies git add -A in the vault', 'Bash', 'git add -A', VAULT, 'deny'],
    ['denies git add --all', 'Bash', 'git add --all', VAULT, 'deny'],
    ['denies git add .', 'Bash', 'git add .', VAULT, 'deny'],
    ['denies git add -u with no path', 'Bash', 'git add -u', VAULT, 'deny'],
    ['denies git add -- . (a dot is not a pathspec of files)', 'Bash', 'git add -- .', VAULT, 'deny'],
    ['denies git commit -a', 'Bash', 'git commit -a -m "x"', VAULT, 'deny'],
    ['denies git commit -am', 'Bash', 'git commit -am "x"', VAULT, 'deny'],
    ['denies git commit --all', 'Bash', 'git commit --all -m x', VAULT, 'deny'],
    ['denies a chained add -A then commit', 'Bash', 'git add -A && git commit -m x', VAULT, 'deny'],
    ['denies in PowerShell with a backslash cwd in another case', 'PowerShell', 'git add -A', VAULT.replace(/\//g, '\\').toUpperCase(), 'deny'],
    ['denies from a vault subfolder cwd', 'Bash', 'git add .', `${VAULT}/Council Chamber`, 'deny'],
    ['denies the Git Bash cwd form', 'Bash', 'git add .', gitBashForm, 'deny'],
    ['denies git -C pointing at the vault from another cwd', 'Bash', `git -C "${VAULT}" add -A`, OTHER, 'deny'],
    ['denies cd into the vault then add .', 'Bash', `cd "${VAULT}" && git add .`, OTHER, 'deny'],
    ['denies the call inside bash -c', 'Bash', 'bash -c "git add -A"', VAULT, 'deny'],
    ['denies a cd through a variable assigned to the vault', 'Bash', `S="${VAULT}"; cd "$S" && git add -A`, OTHER, 'deny'],
    ['denies a PowerShell Set-Location through a variable', 'PowerShell', `$S = '${VAULT}'; Set-Location $S; git add .`, OTHER, 'deny'],
    ['denies a cd through an environment variable naming the vault', 'Bash', 'cd "$SE_TEST_VAULT" && git add -A', OTHER, 'deny', { extraEnv: { SE_TEST_VAULT: VAULT } }],
    ['asks when the cd target is a variable it cannot read', 'Bash', 'cd "$SE_NO_SUCH_VAR" && git add -A', OTHER, 'ask'],
    ['asks when the cd target is a command substitution', 'Bash', 'cd "$(git rev-parse --show-toplevel)" && git add -A', OTHER, 'ask'],
    ['denies in the folder it shipped in, with the vault root unset', 'Bash', 'git add -A', ROOT, 'deny', { vaultRoot: null }],
    ['allows a pathspec add', 'Bash', 'git add -- "Council Chamber/x.md"', VAULT, 'none'],
    ['allows two quoted paths without --', 'Bash', 'git add "a.md" "b.md"', VAULT, 'none'],
    ['allows add -u with a path', 'Bash', 'git add -u -- "Council Chamber/x.md"', VAULT, 'none'],
    ['allows a pathspec commit', 'Bash', 'git commit -m "msg" -- "Council Chamber/x.md"', VAULT, 'none'],
    ['allows commit --amend', 'Bash', 'git commit --amend --no-edit', VAULT, 'none'],
    ['allows add -A in another repo', 'Bash', 'git add -A', OTHER, 'none'],
    ['allows add . in another repo through PowerShell', 'PowerShell', 'git add .', OTHER, 'none'],
    ['allows git -C at another repo while cwd is the vault', 'Bash', `git -C "${OTHER}" add -A`, VAULT, 'none'],
    ['allows a cd through a variable assigned to another folder', 'Bash', `S="${OTHER}"; cd "$S" && git add -A`, VAULT, 'none'],
    ['allows the same through PowerShell', 'PowerShell', `$S = '${OTHER}'; Set-Location $S; git add -A`, VAULT, 'none'],
    ['allows a heredoc message that mentions the words', 'Bash', heredoc, VAULT, 'none'],
    ['allows an unquoted heredoc body with a line reading git add -A', 'Bash', 'git commit -F - -- "x.md" <<\'EOF\'\ngit add -A\ngit commit -a\nEOF', VAULT, 'none'],
    ['allows a PowerShell here-string message that mentions the words', 'PowerShell', herestring, VAULT, 'none'],
    ['allows a quoted message that mentions the words', 'Bash', 'git commit -m "never git add -A" -- "x.md"', VAULT, 'none'],
    ['allows echo of the words', 'Bash', 'echo "git add -A"', VAULT, 'none'],
    ['allows git status', 'Bash', 'git status --short', VAULT, 'none'],
    ['ignores other tools', 'Write', 'git add -A', VAULT, 'none'],
  ];
  for (const [name, tool, command, cwd, want, opts = {}] of addCases) {
    const r = fire(ADD, shellCall(tool, command, cwd), opts);
    const got = decisionOf(r);
    record(`git-add-guard: ${name}`, got === want && r.code === 0, `expected ${want}, got ${got} (code=${r.code})`, want === 'none' ? 'quiet' : 'reacts');
  }
  let r = fire(ADD, 'not an object');
  record('git-add-guard: fails closed on a payload that is not an object', r.code === 2, `code=${r.code}`, 'reacts');
  r = fire(ADD, []);
  record('git-add-guard: fails closed on an array payload', r.code === 2, `code=${r.code}`, 'reacts');
  r = fire(ADD, shellCall('Bash', 'git add -A'), { nodeBroken: true });
  record('git-add-guard: holds the call when node cannot run', r.code === 2, `code=${r.code}`, 'reacts');

  // [name, tool, command, expected decision]
  const verbCases = [
    ['asks: branch -D', 'Bash', 'git branch -D old', 'ask'],
    ['asks: git -C dir branch -D', 'Bash', `git -C "${OTHER}" branch -D old`, 'ask'],
    ['asks: branch --delete --force', 'Bash', 'git branch --delete --force old', 'ask'],
    ['asks: branch -d -f', 'Bash', 'git branch -d -f old', 'ask'],
    ['asks: branch -fd', 'PowerShell', 'git branch -fd old', 'ask'],
    ['asks: git.exe head', 'PowerShell', 'git.exe branch -D old', 'ask'],
    ['asks: absolute-path head', 'Bash', '"/c/Program Files/Git/bin/git" branch -D old', 'ask'],
    ['asks: PowerShell call operator', 'PowerShell', '& git branch -D old', 'ask'],
    ['asks: --no-pager before the verb', 'Bash', 'git --no-pager branch -D old', 'ask'],
    ['asks: --git-dir= before the verb', 'Bash', 'git --git-dir=.git reset --hard', 'ask'],
    ['asks: reset HEAD~1 --hard', 'Bash', 'git reset HEAD~1 --hard', 'ask'],
    ['asks: clean -df', 'Bash', 'git clean -df', 'ask'],
    ['asks: clean -xdf', 'Bash', 'git clean -xdf', 'ask'],
    ['asks: clean --force', 'Bash', 'git clean --force -d', 'ask'],
    ['asks: update-ref -d', 'Bash', 'git update-ref -d refs/heads/x', 'ask'],
    ['asks: push --force', 'Bash', 'git push --force origin main', 'ask'],
    ['asks: push -f', 'Bash', 'git push -f origin main', 'ask'],
    ['asks: push --force-with-lease=', 'Bash', 'git push --force-with-lease=main origin main', 'ask'],
    ['asks: push delete refspec', 'Bash', 'git push origin :old', 'ask'],
    ['asks: push force refspec', 'Bash', 'git push origin +main', 'ask'],
    ['asks: push --delete', 'Bash', 'git push origin --delete old', 'ask'],
    ['asks: reflog expire', 'Bash', 'git reflog expire --expire=now --all', 'ask'],
    ['asks: gc --prune=now', 'Bash', 'git gc --prune=now', 'ask'],
    ['asks: chained after a safe command', 'Bash', 'git status && git branch -D old', 'ask'],
    ['asks: inside bash -c', 'Bash', 'bash -c "git branch -D old"', 'ask'],
    ['asks: inside powershell -Command', 'Bash', 'powershell -Command "git reset --hard"', 'ask'],
    ['passes: branch -d (merged-only delete)', 'Bash', 'git branch -d merged', 'none'],
    ['passes: branch -f moves a branch, no delete', 'Bash', 'git branch -f topic HEAD', 'none'],
    ['passes: reset --soft', 'Bash', 'git reset --soft HEAD~1', 'none'],
    ['passes: clean -n dry run', 'Bash', 'git clean -nd', 'none'],
    ['passes: clean -fdn dry run', 'Bash', 'git clean -fdn', 'none'],
    ['passes: plain push', 'Bash', 'git push origin main', 'none'],
    ['passes: push a feature branch', 'Bash', `git -C "${OTHER}" push origin feature/fix`, 'none'],
    ['passes: commit message naming the verbs', 'Bash', 'git commit -m "never git branch -D or git reset --hard" -- "x.md"', 'none'],
    ['passes: heredoc body naming the verbs', 'Bash', 'git commit -F - -- "x.md" <<\'EOF\'\ngit reset --hard\ngit push --force\nEOF', 'none'],
    ['passes: echo of the verbs', 'Bash', 'echo "git branch -D x"', 'none'],
    ['passes: git log', 'Bash', 'git log --oneline -5', 'none'],
    ['passes: other tools', 'Write', 'git branch -D old', 'none'],
  ];
  for (const [name, tool, command, want] of verbCases) {
    const r2 = fire(VERB, shellCall(tool, command));
    const got = decisionOf(r2);
    record(`git-verb-gate: ${name}`, got === want && r2.code === 0, `expected ${want}, got ${got} (code=${r2.code})`, want === 'none' ? 'quiet' : 'reacts');
  }
  r = fire(VERB, 'not an object');
  record('git-verb-gate: fails closed on a payload that is not an object', r.code === 2, `code=${r.code}`, 'reacts');
  r = fire(VERB, shellCall('Bash', 'git branch -D old'), { nodeBroken: true });
  record('git-verb-gate: holds the call when node cannot run', r.code === 2, `code=${r.code}`, 'reacts');
}

// ── the registration audit ──────────────────────────────────────────────────
// What this suite cannot see. Every case above fires its hook directly, which
// proves the script works and says nothing about whether a session will ever
// call it. A hook that is perfect and unregistered is a decoration.
//
// So: read the settings file, and for every hook on disk ask whether some event
// is registered whose command would reach it. An unregistered hook is a FAIL,
// not a note, because its self-test passing is precisely what makes it
// dangerous. It looks covered.
function registrationAudit() {
  const settingsPath = path.join(ROOT, '.claude', 'settings.json');
  const rows = [];
  if (!existsSync(settingsPath)) {
    return { rows, error: `no settings file at ${settingsPath}` };
  }

  let settings;
  try {
    settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
  } catch (e) {
    return { rows, error: `settings file does not parse: ${e.message}` };
  }

  // Flatten every registered command into {event, matcher, command}.
  const registered = [];
  for (const [event, groups] of Object.entries(settings.hooks || {})) {
    for (const group of groups || []) {
      for (const h of group.hooks || []) {
        registered.push({ event, matcher: group.matcher || '(all)', command: h.command || '' });
      }
    }
  }

  return { rows, registered };
}

// Every hook script actually on disk next to this file. Read from the directory
// rather than a hardcoded list, so a hook added tomorrow is audited tomorrow
// instead of being silently exempt.
const shippedHooks = readdirSync(HERE).filter((f) => f.endsWith('.sh')).sort();

const audit = registrationAudit();
const registrationRows = [];
if (audit.error) {
  registrationRows.push({ name: `registration: ${audit.error}`, ok: false, detail: 'cannot audit' });
} else {
  for (const file of shippedHooks) {
    const hits = audit.registered.filter((r) => r.command.includes(file));
    if (hits.length === 0) {
      registrationRows.push({
        name: `registration: ${file}`,
        ok: false,
        detail: 'UNREGISTERED. Nothing will ever call it.',
      });
    } else {
      const where = hits.map((h) => `${h.event}[${h.matcher}]`).join(' ');
      registrationRows.push({ name: `registration: ${file}`, ok: true, detail: where });
    }
  }

  // The specific lesson, kept as a named assertion rather than a general rule:
  // the two hooks that exist because of PowerShell must be reachable FROM
  // PowerShell. Registering them on Bash alone is the blindness itself.
  for (const file of ['post-bash-encoding-check.sh', 'post-bash-move-audit.sh']) {
    const hits = audit.registered.filter((r) => r.command.includes(file));
    const seesPS = hits.some((h) => /PowerShell/i.test(h.matcher));
    registrationRows.push({
      name: `registration: ${file} watches PowerShell`,
      ok: seesPS,
      detail: seesPS ? 'matcher includes PowerShell' : 'BLIND to the tool that causes the damage',
    });
  }

  // The Outward Gate must be reachable from every tool it guards, and from none
  // it must never hold. Each matcher is a regex, so each registration's matcher
  // is tested on its own against each tool name. Joining several matchers into
  // one string builds a different regex ("Write|Edit Bash" has the alternative
  // "Edit Bash") and calls a correctly wired guard blind.
  const gateWiring = [
    ['PreToolUse', ['mcp__acme__create_post', 'Bash', 'PowerShell'], ['Write', 'Edit']],
    ['PostToolUse', ['mcp__acme__create_post', 'Bash', 'PowerShell'], ['Write', 'Edit']],
  ];
  for (const [event, mustReach, mustNotReach] of gateWiring) {
    const hits = audit.registered.filter((r) => r.event === event && r.command.includes('outward-gate.sh'));
    const reaches = (tool) => hits.some((h) => { try { return new RegExp(h.matcher === '(all)' ? '.*' : h.matcher).test(tool); } catch { return false; } });
    const blind = mustReach.filter((t) => !reaches(t));
    const wall = mustNotReach.filter((t) => reaches(t));
    registrationRows.push({
      name: `registration: outward-gate.sh on ${event}`,
      ok: hits.length > 0 && blind.length === 0 && wall.length === 0,
      detail: hits.length === 0 ? 'NOT REGISTERED' : blind.length ? `BLIND TO: ${blind.join(', ')}` : wall.length ? `MATCHES (must never): ${wall.join(', ')}` : `reaches ${mustReach.length} tools, spares Write and Edit`,
    });
  }

  // The guards that read shell commands must be reachable from both shell tools
  // (v3.25.0). A guard that reads Bash and is registered on Write alone reads
  // nothing. The two git guards must never hold Write or Edit, which stay the
  // door to repair a broken guard.
  const shellWiring = [
    ['pre-bash-git-add-guard.sh', ['Bash', 'PowerShell'], ['Write', 'Edit']],
    ['pre-shell-git-verb-gate.sh', ['Bash', 'PowerShell'], ['Write', 'Edit']],
    ['pre-write-floor-guard.sh', ['Write', 'Edit', 'Bash', 'PowerShell'], []],
  ];
  for (const [file, mustReach, mustNotReach] of shellWiring) {
    const hits = audit.registered.filter((r) => r.event === 'PreToolUse' && r.command.includes(file));
    const reaches = (tool) => hits.some((h) => { try { return new RegExp(`^(?:${h.matcher === '(all)' ? '.*' : h.matcher})$`).test(tool); } catch { return false; } });
    const blind = mustReach.filter((t) => !reaches(t));
    const wall = mustNotReach.filter((t) => reaches(t));
    registrationRows.push({
      name: `registration: ${file} on PreToolUse`,
      ok: hits.length > 0 && blind.length === 0 && wall.length === 0,
      detail: hits.length === 0 ? 'NOT REGISTERED' : blind.length ? `BLIND TO: ${blind.join(', ')}` : wall.length ? `MATCHES (must never): ${wall.join(', ')}` : `reaches ${mustReach.join(', ')}`,
    });
  }

  // Every PreToolUse command hook must carry onFailure "block", so a guard that
  // cannot start holds the call instead of waving it through.
  try {
    const settings = JSON.parse(readFileSync(path.join(ROOT, '.claude', 'settings.json'), 'utf8'));
    const open = [];
    for (const group of settings.hooks?.PreToolUse || []) {
      for (const h of group.hooks || []) if (h.onFailure !== 'block') open.push(path.basename((h.command || '').replace(/"\s*$/, '')));
    }
    registrationRows.push({
      name: 'registration: every PreToolUse hook blocks on failure',
      ok: open.length === 0,
      detail: open.length === 0 ? 'onFailure "block" on all' : `no onFailure "block": ${open.join(', ')}`,
    });
  } catch (e) {
    registrationRows.push({ name: 'registration: every PreToolUse hook blocks on failure', ok: false, detail: `cannot read: ${e.message}` });
  }

  // The settings deny reading a .env file anywhere in the vault (v3.21.0), so a key
  // kept there never enters a session's context. Claude Code enforces the rule; this
  // row proves the rule is still in the file. v3.24.0: every common spelling, since a
  // key in .env.local was read as freely as no rule at all.
  try {
    const settings = JSON.parse(readFileSync(path.join(ROOT, '.claude', 'settings.json'), 'utf8'));
    const deny = settings.permissions?.deny || [];
    const ENV_SPELLINGS = ['.env', '.env.local', '.env.*.local', '.env.development', '.env.production', '.env.test'].map((s) => `Read(**/${s})`);
    const missing = ENV_SPELLINGS.filter((r) => !deny.includes(r));
    registrationRows.push({
      name: 'registration: settings deny reading .env files',
      ok: missing.length === 0,
      detail: missing.length === 0 ? `${ENV_SPELLINGS.length} .env spellings denied` : `NO DENY for ${missing.join(', ')}`,
    });
  } catch (e) {
    registrationRows.push({ name: 'registration: settings deny reading .env files', ok: false, detail: `cannot read: ${e.message}` });
  }
}

// ── report ──────────────────────────────────────────────────────────────────
rmSync(VAULT, { recursive: true, force: true });
rmSync(OUTSIDE, { force: true });

if (NEGATIVE) {
  // Inverted reading. A 'reacts' case that still passes against a do-nothing
  // stub is proving nothing. A 'quiet' case cannot be falsified this way and is
  // reported as such rather than counted.
  const falsifiable = results.filter((r) => r.kind === 'reacts');
  const vacuous = falsifiable.filter((r) => r.ok);

  console.log('Hooks: NEGATIVE CONTROL (every hook replaced by a do-nothing stub)');
  console.log('-'.repeat(78));
  for (const r of results) {
    if (r.kind === 'quiet') {
      console.log(`  n/a  ${r.name.padEnd(52)} asserts absence, a stub satisfies it`);
    } else if (r.ok) {
      console.log(` VACUOUS ${r.name.padEnd(49)} passed against a dead hook`);
    } else {
      console.log(`  ok   ${r.name.padEnd(52)} correctly falsified`);
    }
  }
  console.log('-'.repeat(78));
  console.log(`falsifiable=${falsifiable.length} correctly_falsified=${falsifiable.length - vacuous.length} vacuous=${vacuous.length} not_falsifiable=${results.length - falsifiable.length}`);

  if (vacuous.length > 0) {
    console.log('\nA case passed with the hook removed. It proves nothing. Rewrite it to demand positive evidence.');
    process.exit(1);
  }
  console.log('\nEvery falsifiable case failed without its hook, which is what makes the green run mean something.');
  process.exit(0);
}

const pass = results.filter((r) => r.ok).length;
const fail = results.length - pass;
const regPass = registrationRows.filter((r) => r.ok).length;
const regFail = registrationRows.length - regPass;

console.log('Hooks: positive control');
console.log('-'.repeat(78));
for (const r of results) {
  console.log(`${r.ok ? '  ok  ' : ' FAIL '} ${r.name.padEnd(52)} ${r.detail}`);
}
console.log('-'.repeat(78));
console.log('Registration audit: what firing a hook directly cannot tell you');
console.log('-'.repeat(78));
for (const r of registrationRows) {
  console.log(`${r.ok ? '  ok  ' : ' FAIL '} ${r.name.padEnd(52)} ${r.detail}`);
}
console.log('-'.repeat(78));
console.log(`behavior: pass=${pass} fail=${fail}    registration: pass=${regPass} fail=${regFail}`);

if (fail > 0 || regFail > 0) {
  console.log('\nA hook did not behave as specified, or is not wired to anything. Do not trust it until this is green.');
  process.exit(1);
}
console.log('\nEvery hook reacted to what it must react to, stayed quiet otherwise, and is registered to an event that reaches it.');
console.log('Run with --negative-control to check that these cases could have failed.');
process.exit(0);
