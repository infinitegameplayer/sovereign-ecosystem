# Playwright Skill

**Purpose:** Browser automation via headless Chromium. Scrape pages, extract structured data, and interact with web interfaces. Returns clean JSON — not screenshots.

**Token efficiency:** ~200-500 tokens per page vs 20,000-30,000 for screenshot-based approaches.

## When to Use

- Tech Watch repo checks — retrieve changelogs, release notes, README updates from GitHub
- Scraping any page for structured data (pricing tables, product lists, article text)
- Checking if a URL loads and what it contains
- Extracting links, headings or specific content from a page

## How to Use

The run.js script accepts a URL argument and returns JSON.

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

Playwright must be installed before first use. Run these once with explicit approval:

```bash
cd "Council Chamber/scripts" && npm install playwright
npx playwright install chromium
```

Chromium binary installs to `Council Chamber/scripts/node_modules/`. Covered by `.claudeignore` — will not appear in Claude context reads.

## Troubleshooting

- **Empty text:** If a page returns empty text, switch `waitUntil` to `networkidle` and retry.
- **Browser binary not found:** Run `npx playwright install chromium` from `Council Chamber/scripts/`.
- **Cloudflare blocking:** Add `playwright-extra` and `puppeteer-extra-plugin-stealth` if a site blocks the script.
- **Timeout:** Increase all timeouts to 15 seconds and switch to `networkidle` for slow pages.
- Always close the browser in a `finally` block — already handled in run.js.

## Invocation

Tell your AI interface what you need in plain English. Example prompts:

- "Scrape the changelog from github.com/[repo] and summarize what's new."
- "Check the releases page at [URL] and tell me what shipped since [date]."
- "Extract the pricing table from [URL] as a JSON array."

Your AI reads this SKILL.md, runs the script, and returns the data.

## Related

- Script: `Council Chamber/Skills/Playwright/scripts/run.js`

## Refinements

*(Empty — populated when execution mistakes occur during sessions.)*
