# Contributing to the Sovereign Ecosystem

This repository is a template. Every Sovereign who uses it personalizes their own copy, and those copies are meant to diverge. Upstream stays lean so the divergence stays yours.

## What helps

**Issues.** Bug reports, stale references, broken links, unclear onboarding steps and places where the Getting Started arc lost you. A specific "this file says X but the repo does Y" report is the most valuable thing you can send.

**Pull requests.** Framework files only: governance documents, codices, protocols, skills, scripts, hooks and onboarding surfaces. Fixes and clarifications are welcome. New capabilities work best when an issue opens the conversation first, since the template holds a deliberate boundary between what ships as spine and what stays a door.

**Adaptations.** If you built something on top of the template, share it in an issue. Patterns proven in a lived vault are exactly how this repo grows.

## What stays out

Personalized vault content never belongs in a pull request. Your Primer, your Sovereign Command, your quests, your captures and anything the BOOTSTRAP wizard filled in are yours. Upstream ships the empty vessel.

## Style

Contributions follow the Expression Standards in `.claude/CLAUDE.md`:

- No em dashes anywhere. Use a period and a new sentence, a comma or a colon.
- No Oxford comma.
- Short declarative sentences. One idea per paragraph.
- Affirmative framing. Define things by what they are.

The write-time hook at `Council Chamber/scripts/hooks/post-write-em-dash-check.sh` catches the first rule automatically if your hooks are wired.

## Releases

Versions follow the .github/CHANGELOG.md convention: one entry per publish cycle, with a matching detail file in `.github/UPDATES/` and a tagged GitHub Release. Maintainers cut releases; contributors never need to touch version files.

## Security

Vulnerabilities and anything touching credentials, hooks or script execution: see `.github/SECURITY.md` for how to report privately.
