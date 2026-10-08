#!/usr/bin/env node
// check-skill-frontmatter.mjs
// Every skill's frontmatter must parse, because a skill whose frontmatter does
// not parse is a skill your AI never discovers.
//
// This guard was written for v3.14.0. The Brainstorm skill shipped from v3.5.0
// with an unquoted description containing "Gate-bound: no code". In YAML a colon
// followed by a space inside a plain value starts a new key, so the whole
// frontmatter is invalid and the skill drops out of discovery without a word.
// Session Closeout carried the same fault in its description at v3.13.0. Two
// skills, one class, found by hand. This is the instrument.
//
// Scope is the narrow set of YAML mistakes a hand-written skill header actually
// makes, checked without a YAML library so the template stays dependency-free:
//   - a plain (unquoted) value containing ": " or " #", or ending in ":"
//   - a plain value opening with a YAML indicator (& * ! % @ `)
//   - a quoted value with no closing quote on the same line
//   - frontmatter that never closes, or that lacks name or description
// Quote the value and every one of these parses.
//
// Usage:
//   node "Council Chamber/scripts/check-skill-frontmatter.mjs"
//   node "Council Chamber/scripts/check-skill-frontmatter.mjs" --positive-control
//
// Exit 0: every skill parses (or every planted case was judged correctly).
// Exit 1: read the lines above the summary.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const VAULT = path.resolve(HERE, '..', '..');
const SKILLS = path.join(VAULT, 'Council Chamber', 'Skills');

// Returns a list of problems for one file's text. Empty means it parses.
export function frontmatterProblems(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  if (lines[0] !== '---') return ['no frontmatter: the first line is not ---'];
  const end = lines.indexOf('---', 1);
  if (end < 0) return ['frontmatter never closes with ---'];

  const problems = [];
  const keys = new Set();
  for (let i = 1; i < end; i++) {
    const line = lines[i];
    const m = line.match(/^([A-Za-z_][\w-]*):(?:\s+(.*))?$/);
    if (!m) continue; // indented lines and list items belong to the key above
    const [, key, raw = ''] = m;
    keys.add(key);
    const value = raw.trim();
    const at = `line ${i + 1}, ${key}`;
    if (!value || /^[|>]/.test(value)) continue;
    if (value[0] === '"' || value[0] === "'") {
      const q = value[0];
      if (value.length < 2 || !value.endsWith(q) || (q === '"' && /(^|[^\\])(\\\\)*\\"$/.test(value.slice(1)))) {
        problems.push(`${at}: quoted value has no closing ${q}`);
      }
      continue;
    }
    if (value[0] === '[' || value[0] === '{') continue;
    if (/[&*!%@`]/.test(value[0])) problems.push(`${at}: an unquoted value cannot open with ${value[0]}`);
    if (value.includes(': ') || value.endsWith(':')) problems.push(`${at}: unquoted value contains a colon and a space; quote it`);
    if (value.includes(' #')) problems.push(`${at}: unquoted value contains " #", which YAML reads as a comment; quote it`);
  }
  for (const k of ['name', 'description']) if (!keys.has(k)) problems.push(`missing ${k}`);
  return problems;
}

function positiveControl() {
  const fm = (body) => `---\n${body}\n---\n# Skill\n`;
  const cases = [
    ['colon in a plain description', fm('name: x\ndescription: Gate-bound: no code'), false],
    ['the same description, quoted', fm('name: x\ndescription: "Gate-bound: no code"'), true],
    ['a plain description with no colon', fm('name: x\ndescription: Use when the work ends.'), true],
    ['a hash after a space, which truncates the value', fm('name: x\ndescription: Use for step #2 and step #3'), false],
    ['a hash with no space before it', fm('name: x\ndescription: Use in C# projects'), true],
    ['an unclosed quote', fm('name: x\ndescription: "Use when'), false],
    ['no description', fm('name: x\nstatus: active'), false],
    ['frontmatter that never closes', '---\nname: x\ndescription: y\n# Skill\n', false],
    ['a block description', fm('name: x\ndescription: >\n  Use when: anything.'), true],
    ['CRLF line endings, valid', fm('name: x\ndescription: "a: b"').replace(/\n/g, '\r\n'), true],
  ];
  let fail = 0;
  console.log('check-skill-frontmatter: positive control');
  console.log('-'.repeat(70));
  for (const [name, text, shouldPass] of cases) {
    const passed = frontmatterProblems(text).length === 0;
    const ok = passed === shouldPass;
    if (!ok) fail += 1;
    console.log(`${ok ? '  ok  ' : ' FAIL '} ${name}: ${shouldPass ? 'accepted' : 'refused'} expected, ${passed ? 'accepted' : 'refused'} seen`);
  }
  console.log('-'.repeat(70));
  console.log(`pass=${cases.length - fail} fail=${fail}`);
  if (fail) {
    console.log('\nThe checker misjudged a planted case. Its verdict on the real skills cannot be trusted until it judges these correctly.');
    process.exit(1);
  }
  console.log('\nThe checker refused every broken header and accepted every valid one.');
}

function checkVault() {
  if (!existsSync(SKILLS)) {
    console.log(`Error: no skills directory at ${SKILLS}. A wrong root is not a clean vault.`);
    process.exit(1);
  }
  const files = readdirSync(SKILLS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(SKILLS, d.name, 'SKILL.md'))
    .filter((f) => existsSync(f));
  if (!files.length) {
    console.log('Error: no SKILL.md files found. A wrong root is not a clean vault.');
    process.exit(1);
  }
  let bad = 0;
  for (const f of files) {
    const problems = frontmatterProblems(readFileSync(f, 'utf8'));
    if (!problems.length) continue;
    bad += 1;
    console.log(`FAIL ${path.relative(VAULT, f).replace(/\\/g, '/')}`);
    for (const p of problems) console.log(`     ${p}`);
  }
  console.log(`${files.length - bad} of ${files.length} skill headers parse.`);
  if (bad) {
    console.log('A skill whose header does not parse is a skill your AI never discovers. Quote the value named above.');
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args.some((a) => a !== '--positive-control')) {
  console.log(`Unknown argument: ${args.find((a) => a !== '--positive-control')}`);
  console.log('Usage: node "Council Chamber/scripts/check-skill-frontmatter.mjs" [--positive-control]');
  process.exit(1);
}
if (args.includes('--positive-control')) positiveControl();
else checkVault();
