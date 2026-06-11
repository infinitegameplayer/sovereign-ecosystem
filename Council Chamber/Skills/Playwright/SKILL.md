---
name: playwright
description: Use when you need to scrape pages, extract structured data or interact with web interfaces via headless browser automation without using screenshots.
status: active
tier: operational
---

# Playwright Skill

**Purpose:** Browser automation via headless Chromium. Scrape pages, extract structured data, and interact with web interfaces. Returns clean JSON — not screenshots.

**Token efficiency:** ~200-500 tokens per page vs 20,000-30,000 for screenshot-based approaches.

## When to Use

- Tech Watch repo checks — retrieve changelogs, release notes, README updates from GitHub
- Scraping any page for structured data (pricing tables, product lists, article text)
- Checking if a URL loads and what it contains
- Extracting links, headings or specific content from a page

## How to Use

The run.js script accepts a URL argument and returns JSON. Run it from your vault root using the vault-relative path to this skill's scripts directory.

```bash
node "Council Chamber/Skills/Playwright/scripts/run.js" https://example.com
```

Output format:
```json
{
  "url": "https://example.com",
  "title": "Page title",
  "text": "Cleaned body text...",
  "links": [
    { "text": "Link text", "href": "https://..." }
  ]
}
```

## Requirements

Playwright must be installed before first use. Run these once with explicit approval from your vault root:

```bash
npm install playwright --prefix "Council Chamber/scripts"
npx playwright install chromium
```

Chromium binary installs to `Council Chamber/scripts/node_modules/`. Add this path to your AI interface's ignore configuration so it does not appear in context reads.

## Troubleshooting

- **Empty text:** If a page returns empty text, switch `waitUntil` to `networkidle` and retry.
- **Browser binary not found:** Run `npx playwright install chromium` from the scripts directory.
- **Cloudflare blocking:** Add `playwright-extra` and `puppeteer-extra-plugin-stealth` if a site blocks the script.
- **Timeout:** Increase all timeouts to 15 seconds and switch to `networkidle` for slow pages.
- Always close the browser in a `finally` block. This is already handled in run.js.

## Invocation

Tell your AI interface what you need in plain English. Example prompts:

- "Scrape the changelog from github.com/[repo] and summarize what's new."
- "Check the releases page at [URL] and tell me what shipped since [date]."
- "Extract the pricing table from [URL] as a JSON array."

Your AI reads this SKILL.md, runs the script, and returns the data.

## Related

- Script: `Council Chamber/Skills/Playwright/scripts/run.js`

## External Orientation

> [!info] Ambassador Doctrine Active
> This skill operates under the [[Council Chamber/Protocols/Governance/Ambassador Doctrine]].
> Primary strategy: Āsana — browser automation is an intelligence retrieval tool; extract, clean, and return before acting.
> Secondary: Vigraha (assert data quality; surface failed or blocked scrapes rather than returning corrupted output), Saṃśraya (the browser always closes in a finally block; no persistent external state).
> Playwright does not write to external surfaces. It reads. The read-before-act posture is the doctrine embodied.

## Refinements

*(Empty — populated when execution mistakes occur during sessions.)*
