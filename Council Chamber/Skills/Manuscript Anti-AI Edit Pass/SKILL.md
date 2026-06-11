---
name: manuscript-anti-ai-edit-pass
description: Use when a long-form manuscript (book chapter, ebook, multi-chapter playbook, long-form digital product) needs an editing pass to identify and remove AI writing tells against the Anti-AI Writing Patterns Codex. Triggered by the Sovereign after draft completion, by a Pending Plan handover map naming this skill at the edit phase, or by any post-draft state where AI-assisted prose needs the anti-pattern sweep before final review.
status: active
tier: foundational
contrast_tier: 1
external_orientation: true
created: 2026-05-21
links:
  - "[[Council Chamber/Codices/Expression/Anti-AI Writing Patterns Codex]]"
  - "[[Council Chamber/Codices/Expression/Writing Style Codex]]"
---

# Manuscript Anti-AI Edit Pass Skill

Purpose: Run the canonical anti-AI editing pass over a long-form manuscript. Load the Anti-AI Writing Patterns Codex (106 entries across 8 categories), sweep the target text in phases (mechanical lexical first, then judgment-heavy structural and voice passes), assemble a structured edit packet for Sovereign review, and apply approved edits.

Trigger: Sovereign invocation after a manuscript draft is complete. Also bundled from inside Pending Plan Implementation when the active plan's `## Skill Handover Map` names this skill at the edit phase. Runs chapter-by-chapter during drafting to prevent accumulating a manuscript-sized backlog.

Inputs: `target_path` pointing to the manuscript file or directory. Optional parameters defined in Entry Contract.

Outputs: A structured edit packet organized by category, followed by the edited manuscript with all Sovereign-approved changes applied and a changelog entry.

Status: active

Related Protocols/Codices: [[Council Chamber/Codices/Expression/Anti-AI Writing Patterns Codex]] | [[Council Chamber/Codices/Expression/Writing Style Codex]]

---

## Entry Contract

**Required input:**

- `target_path`: file path, directory path or wikilink to the manuscript being edited. The skill HALTS if `target_path` is missing or unreadable.

**Optional inputs (skill detects and parameterizes behavior):**

- `chapter_scope`: when target_path is a directory, names the specific chapter(s) to edit. Default: all chapters in directory.
- `vocab_overrides`: additional Sovereign-vocab exceptions specific to this manuscript that are not yet in the codex reconciliation table. Surfaced for Sovereign approval before sweep begins.
- `sample_first`: when set, runs all 8 sweeps on the first chapter only and surfaces findings for Sovereign calibration before processing the remainder. Default behavior on first invocation against any new manuscript.
- `lexical_intensity`: `light` (Category I only), `standard` (Categories I, II, III, VIII) or `full` (all 8 categories). Default: `full`.
- `apply_mode`: `surface_only` (build packet, do not edit), `apply_approved` (apply edits after Sovereign review) or `auto_apply_safe` (auto-apply Category I and VIII fixes, surface the rest). Default: `apply_approved`.

---

## Steps

**Step 1. Entry validation and target load.**

Verify `target_path` exists. If it is a directory, enumerate all `.md` files. Apply `chapter_scope` filter if provided. Parse frontmatter on each file to capture title, chapter number and any voice-addenda notes. HALT if any file fails to load.

If `sample_first` is set or this is the first invocation against this manuscript (no prior run logged in changelog), default to sampling the first chapter.

---

**Step 2. Codex load and reconciliation cross-check.**

Load [[Council Chamber/Codices/Expression/Anti-AI Writing Patterns Codex]] into working memory. Note codex version (currently v1.0, 106 entries). If `vocab_overrides` is provided, surface the proposed additions to the codex reconciliation table for Sovereign approval before sweep begins. The override approval gate prevents drift in the codex over time without explicit codex update.

Note any SOVEREIGN-VOCAB-RECONCILED entries. These hold special handling: the word is permitted in embodied use, flagged in mechanical use. See the Personalization Note in the codex for how to mark and maintain these.

---

**Step 3. Lexical Sweep (Category I).**

Run a Grep-based scan for each of the Category I entries across the target text. For each hit, capture: file path, line number, surrounding sentence, the matched pattern entry and whether the surrounding context appears embodied (likely the Sovereign's authentic voice) or mechanical (likely AI-generated).

For SOVEREIGN-VOCAB-RECONCILED entries, apply the codex heuristic. If the word reads as "use this for mechanical advantage" framing, flag. If it reads as embodied physical-force usage or genuine weight, permit.

Output: lexical findings array, with embodied-vs-mechanical pre-classification.

---

**Step 4. Opener Sweep (Category II).**

Extract the first sentence of every chapter, major section break and subsection. For each opener, judge against the Category II entries. Flag any opener matching: Temporal Opener, Whether-You're Opener, Let's-Dive Opener, Corrupted Imagine Opener, Sycophantic Opener or "By the End of This..." Opener.

Special attention to chapter-opening sentences. The chapter's first sentence is the highest-stakes line in the manuscript. An AI-tic opener compounds damage across the rest of the chapter because the reader's register-detector calibrates against it.

Output: opener findings array with proposed Sovereign-voice replacements per the codex entries.

---

**Step 5. Hedging, Padding and Disclaimer Sweep (Category III).**

Line-by-line scan for all Category III entries. Flag every hit. For accumulation-density patterns (hedge stacking, tautological padding), measure density per paragraph and flag paragraphs above threshold (3 or more qualifiers in one paragraph, 4 or more near-identical restatements in consecutive sentences).

The most pervasive category in AI-assisted prose. Expect this sweep to produce the largest finding volume.

Output: hedging findings array with replacements and density notes.

---

**Step 6. Negation and Pivot Sweep (Category IV).**

Whole-construction detection for Category IV entries. Flag every "It's not X, it's Y" pivot. Flag every "Not A. Not B. Not C." triad. Flag every "Not just X, but Y" escalation. Flag every balanced-perspective sandwich. Flag every false concession.

Cross-reference the Writing Style Codex. The Sovereign's permitted negation idioms stay. Reflexive negation defaults get the replacement treatment.

Output: negation findings array.

---

**Step 7. Rhetorical Reflex Sweep (Category V).**

Multi-sentence pattern detection for Category V entries. Flag every faux-Socratic chain (3 or more questions in succession without answers). Flag every rhetorical-question-as-transition. Flag every "Let me explain" preamble. Flag every "Here's why this matters" frame. Flag every anaphoric hammer (3 or more consecutive sentences opening with the same phrase).

Output: rhetorical findings array.

---

**Step 8. Voice and Register Sweep (Category VI).**

This step requires the most senior model available because the failure modes are tonal, not pattern-matchable. Read each chapter holistically. Judge against Category VI entries: wisdom-broker register, performed warmth, false intimacy, coach voice, corporate warmth, teacher-explaining-to-the-class, TED-talk cadence, sage tone, manufactured stakes, wholesome-uplift drift, uniform register.

Apply the Voice Anchoring Sequence from the Writing Style Codex before judging: read the Sovereign's Governing Essence section, Rolling Pattern Signals and the most recent published piece on file. The voice anchor must be loaded before voice judgment can be reliable.

Output: voice findings array with chapter-level register notes.

---

**Step 9. Structural Sweep (Category VII).**

Chapter-level and manuscript-level architecture judgment for Category VII entries. Read the chapter intro paragraphs against Reader-Walkthrough, Chapter-Opening-Preamble and "By the End of This" patterns. Read the chapter closing paragraphs against Conclusion-That-Closes, Therapeutic Close, Generic High-Note Close and Chapter-Closing Recap patterns. Read mid-chapter section breaks against Section-Closing Summary.

If the manuscript has 3 or more chapters with parallel structure (every chapter opens with a hypothetical scenario, every chapter ends with a recap), flag the Predictable Section-of-Three Architecture pattern at the manuscript level.

Output: structural findings array with manuscript-level notes when relevant.

---

**Step 10. Formatting Sweep (Category VIII).**

Mechanical scan for Category VIII entries. Count bold markers per paragraph (flag any paragraph with bolded text where bold is not carrying genuine emphasis). Count headers per chapter (flag if header density exceeds one per roughly 500 words). Identify TL;DR labels, Key Takeaways boxes, Pro Tip callouts, definition-list reflexes, nested bullets beyond 2 levels. Scan for emoji bullets and decorative horizontal rules between every paragraph.

Special check: Elegant Variation Spiral. Track the named subject of each chapter. Flag any chapter where the subject is referred to by 4 or more different synonyms in consecutive paragraphs.

Special check: Uniform Paragraph Weight. Measure paragraph length variance across the chapter. If variance is below threshold (every paragraph 3-5 sentences with similar word count), flag as uniformity tell.

Output: formatting findings array with quantitative measures where applicable.

---

**Step 11. Vocabulary Reconciliation Cross-Check.**

For every Category I finding involving a SOVEREIGN-VOCAB-RECONCILED word, apply the codex judgment. Distinguish embodied-Sovereign-usage from mechanical-AI-usage. The pattern: Sovereign vocabulary used embodied is authentic voice. The same vocabulary used mechanically is the failure mode.

When in doubt, surface for Sovereign review rather than auto-flag.

Output: reconciled findings: embodied uses removed from flag list, mechanical uses retained, ambiguous cases marked for Sovereign review.

---

**Step 12. Edit Packet Assembly.**

Assemble all findings into a single structured edit packet for Sovereign review. Format:

```
# Manuscript Anti-AI Edit Pass: Edit Packet
## Manuscript: [name]
## Date: [YYYY-MM-DD]
## Codex version: v1.0 (106 entries)

### Summary
- Total findings: [count]
- By category: I [n], II [n], III [n], IV [n], V [n], VI [n], VII [n], VIII [n]
- Highest-density chapter: [name] ([n] findings)
- Voice register notes: [chapter-level register observations from Step 8]

### Category I: Lexical Findings
[file:line] [pattern entry] | [current text] → [proposed replacement] | [embodied/mechanical pre-classification]
...

### Category II: Opener Findings
[file:line] [pattern entry] | [current opener] → [proposed Sovereign-voice opener] | [chapter or section]
...

[continue for all 8 categories]

### Ambiguous Cases: Sovereign Review Required
[Findings the skill could not auto-classify; surface for Sovereign judgment]

### Recommendations
[Skill-level synthesis: which chapters need deepest rework, which patterns appear most frequently, which Sovereign-vocab exceptions surfaced new usage worth adding to the codex reconciliation table]
```

Output: edit packet markdown ready for Sovereign review.

---

**Step 13. Sovereign Review.**

YIELD. Present edit packet to the Sovereign. The Sovereign reviews and approves, modifies or rejects each finding. The Sovereign may also:
- Add new vocab exceptions discovered during review (these flow back to the codex reconciliation table)
- Flag new AI tells discovered during review that the codex did not catch (these flow back to the codex as new entries)
- Reject the embodied-vs-mechanical pre-classification on any specific finding

The skill does not proceed without Sovereign input. No auto-apply.

---

**Step 14. Apply Approved Edits.**

For each Sovereign-approved edit, apply via the Edit tool. Preserve all surrounding context. Match indentation, list markers, frontmatter. Do not introduce em dashes or Oxford commas in any replacement (verify before write).

For edits that affect chapter-level structure (removing a chapter-opening preamble, restructuring a chapter close), apply via larger Edit calls with explicit before/after context windows. Confirm each Edit succeeded before moving to the next.

If any Edit fails (old_string not unique, file state drift), HALT and surface to the Sovereign. Do not proceed past a failed edit.

Output: edit application log, with file:line of every change applied.

---

**Step 15. Verification Pass.**

Re-run a lightweight version of Steps 3, 5, 7 and 10 against the edited manuscript. Goal: confirm fixes landed and did not introduce new tells. Replacement sentences should not themselves contain em dashes, Oxford commas or new AI tics.

If verification surfaces new findings, loop back to Step 12 with a second-pass edit packet (typically much smaller than the first).

Output: verification report. Pass/fail per category.

---

**Step 16. Changelog Entry.**

Append a changelog entry to the manuscript's index or scratch pad noting:
- Date of edit pass
- Codex version used
- Total findings, total applied
- Any new Sovereign-vocab exceptions surfaced (with note: "flow to codex reconciliation table update")
- Any new AI tells surfaced (with note: "flow to codex as new category entry")

---

## Constraints

- Does not edit prose without Sovereign approval (unless `auto_apply_safe` mode is explicitly set for Category I and VIII).
- Does not rewrite passages wholesale. Flags and proposes. The Sovereign writes the replacement when a proposed replacement does not fit.
- Does not run voice judgment (Steps 8, 9) without first loading the Voice Anchoring Sequence from the Writing Style Codex.
- Does not commit or publish. Editing is complete at Step 16. Commit and deploy follow the vault's standard session closeout.
- Does not update the codex itself. New entries and reconciliation updates are surfaced as proposals; the Sovereign applies them in a separate codex-update session.

## Planning Mode Rule

If status is `draft`, execution is not authorized. If status is `active`, execution is authorized.

## Contrast Layer Integration

Tier: 1 (foundational).

<!--
Internal Contrast Layer
- contrast_not: not a proofreading pass (grammar, typos, punctuation). Not a content review (ideas, argument, structure beyond AI-tic patterns). Not a voice rewrite. It removes AI patterns and surfaces replacements; the Sovereign supplies the authentic voice.
- false_twins: Writing Style Codex sweep (which establishes affirmative voice direction). This skill removes the negative patterns, not constructs the positive ones.
- anti_patterns: auto-applying all changes without Sovereign review; treating the AI writing tells list as absolute bans rather than contextual flags; running voice sweep without loading the voice anchor.
- boundary_conditions: SOVEREIGN-VOCAB-RECONCILED words require the codex's embodied-vs-mechanical heuristic, not a blanket flag. When a word appears on both the Sovereign's authentic vocab list and the AI-tell list, the heuristic resolves it.
-->

## Refinements

*(Empty. Populated when execution mistakes occur during sessions.)*
