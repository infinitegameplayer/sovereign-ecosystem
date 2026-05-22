---
version: 1.0
status: template
parent: [[Council Chamber/Codices/Expression/Writing Style Codex]]
purpose: Catalog of AI writing tells with affirmative-voice replacements. Personalize during onboarding after running the Sovereign's vocabulary reconciliation pass.
---

# Anti-AI Writing Patterns Codex

Connections: [[Council Chamber/Codices/Codices Index]] | [[Council Chamber/Codices/Expression/Writing Style Codex]]

This codex catalogs the writing patterns that betray LLM authorship. Each entry names a tell, shows how it appears, names the training pressure that produces it, and gives the affirmative-voice replacement.

This is the negative space of the Sovereign's voice. The Writing Style Codex says what the Sovereign sounds like. This codex says what the Sovereign never sounds like.

## I. Purpose and Scope

**Purpose.** Drive the editing pass over long-form drafts where AI assistance touched the text. Primary targets: book manuscripts, ebooks, long-form digital products, multi-chapter playbooks, any substantial prose passed through an LLM in any phase of its creation.

**Scope.** Audience-facing prose. Articles, book chapters, product pages, long-form emails, white papers. Internal ecosystem documents (session logs, governance notes, technical strategy) operate under looser constraints.

**Out of scope.** AI-generated poetry and lyric tics, dialogue patterns for fiction, character-voice construction, AI tells in code comments and READMEs, and academic-paper AI patterns are out of scope for the prose-book focus of v1.0. They become in-scope when ecosystem output expands to those forms.

**Not a replacement.** This codex extends the Writing Style Codex. It does not replace it. The Writing Style Codex defines the affirmative voice. This codex defines the failure modes to remove. Both run simultaneously on any draft.

## II. How to Use This Codex

Three modes:

**Sweep mode.** Run the full catalog against a manuscript. A Manuscript Anti-AI Edit Pass skill operationalizes this.

**Reference mode.** When a sentence feels off but the reason is not yet named, scan the catalog. The entry that fits names the mechanism and the fix.

**Drafting mode.** Read Categories I, III and VI before any long-form draft session. The most pervasive tells live there. Loading them up front prevents most of the work down the line.

## III. The RLHF Mechanism Layer

Every entry in this codex names not only the tell but the reason the model produces it. This layer matters because pattern recognition without mechanism awareness produces whack-a-mole editing. When the editor understands that a tell is a direct product of RLHF training pressure for perceived helpfulness, they can predict where the same pressure will surface differently elsewhere.

Common RLHF pressures named throughout:

- **Helpfulness scoring.** Annotators reward responses that appear thorough, organized and confident. Produces hedging-then-pivoting, listicle creep, explicit insight delivery.
- **Harmlessness scoring.** Annotators penalize confrontational or strongly-positioned responses. Produces balanced-perspective sandwiches, neutered hedging, faux humility.
- **Warmth scoring.** Annotators reward perceived warmth and rapport. Produces sycophantic openers, performed warmth, false intimacy, reader-validation reflex.
- **Engagement scoring.** Annotators reward responses that "feel insightful" or "feel profound." Produces wisdom-broker register, manufactured stakes, the TED-talk cadence.
- **Structural-completion scoring.** Annotators reward responses with clear structure. Produces header-above-everything, key-takeaways boxes, chapter-recap loops.
- **Repetition-penalty architecture.** Built into the decoding loop, not RLHF. Produces the elegant variation spiral (same noun referred to by five different synonyms in consecutive paragraphs).
- **Markdown-native training corpora.** Models trained on GitHub, Reddit, Notion and Medium produce markdown-shaped prose by default. Produces formatting tics in book-form contexts where markdown should be absent.

Naming the mechanism is half the discipline. The other half is the replacement.

## IV. Category I: Lexical Blacklist

*Single words and short phrases that appear so often in AI-generated text they read as fingerprints. Some of these may surface in the Sovereign's natural vocabulary. The Vocabulary Reconciliation pass (see Personalization Note at the end of this codex) identifies the verified exceptions. Until reconciliation is complete, surface any candidate exception before sweeping.*

**1. The Delve Tic**
- **Pattern:** "Delve into" as the default verb for exploration, regardless of whether depth is warranted.
- **Specimen:** "Let's delve into the complexities of this framework."
- **Why AI produces it:** "Delve" is disproportionately present in academic training corpora. RLHF rewards responses that feel thorough; "delve" signals thoroughness cheaply.
- **Replacement:** Name the specific act. "Here is what this framework does."

**2. The Tapestry Noun**
- **Pattern:** "Tapestry" as a container noun for anything complex or interconnected.
- **Specimen:** "A rich tapestry of experiences shapes who we become."
- **Why AI produces it:** "Tapestry" appears heavily in literary-review training data. Editors confirm it now appears almost exclusively in AI drafts.
- **Replacement:** Name the actual things in the mix. Drop the container.

**3. The Landscape Noun**
- **Pattern:** "Landscape" as a spatial metaphor for any field or domain.
- **Specimen:** "The current technology landscape demands a new approach."
- **Why AI produces it:** Safe high-frequency abstraction in business and editorial training data.
- **Replacement:** Name the actual terrain. "The tools available now" beats "the current landscape."

**4. The Realm Abstractor**
- **Pattern:** "Realm of" introducing any domain, elevating the ordinary to the mystical.
- **Specimen:** "In the realm of personal development..."
- **Why AI produces it:** "Realm" signals intellectual seriousness in academic and literary training text.
- **Replacement:** Drop it. "Personal development" needs nothing in front of it.

**5. The Lever Verb Cluster**
- **Pattern:** Reflexive use of "utilize," "harness" instead of simpler verbs. The flag fires on uncritical defaults, not on every use.
- **Specimen:** "Utilize this framework to harness your creative potential."
- **Why AI produces it:** Heavy presence in business and management corpora. RLHF reinforces because professional-background annotators rate favorably.
- **Replacement:** "Use." Or the specific action.

**6. The Elevation Verb Cluster**
- **Pattern:** "Foster," "unleash," "unlock" as default verbs for positive change without specifying mechanism.
- **Specimen:** "Foster a culture of innovation to unleash your team's potential."
- **Why AI produces it:** Motivational training data saturation. RLHF rewards aspirational framing.
- **Replacement:** Name what actually changes and how. "Your team catches problems earlier" beats "elevate performance."

**7. The Robust Adjective**
- **Pattern:** "Robust" applied to systems, frameworks, approaches as filler intensifier.
- **Specimen:** "Build a robust framework for personal growth."
- **Why AI produces it:** Sounds precise without being measurable. Safe across all annotator backgrounds.
- **Replacement:** Say what makes it strong. "A framework that holds under pressure" is specific.

**8. The Comprehensive Adjective**
- **Pattern:** "Comprehensive" before any noun to signal completeness.
- **Specimen:** "This comprehensive guide covers everything you need."
- **Why AI produces it:** High-frequency descriptor in educational and reference corpora. Signals effort to RLHF annotators.
- **Replacement:** Cut it. A guide that covers everything does not announce it.

**9. The Pivotal / Multifaceted / Meticulous Adjective Family**
- **Pattern:** "Pivotal," "multifaceted," "nuanced," "meticulous," "thoughtfully crafted" applied to inflate ordinary significance.
- **Specimen:** "A pivotal moment in the multifaceted journey of meticulously cultivated growth."
- **Why AI produces it:** Each adjective signals intellectual seriousness or quality without requiring evidence.
- **Replacement:** Show what makes it pivotal. Name one of the facets. Drop the adjective.

**10. The Testament / Serves-As Construction**
- **Pattern:** Copula avoidance via "is a testament to," "serves as," "stands as," "acts as," "functions as," "represents."
- **Specimen:** "Her success is a testament to the power of perseverance. This framework serves as a reminder that..."
- **Why AI produces it:** Copula avoidance is learned from academic and formal writing. "Is" feels flat to annotators; richer verbs score higher.
- **Replacement:** Use "is." The Sovereign's voice is direct. The copula is not weakness.

**11. The Business Jargon Cluster**
- **Pattern:** Corporate-speak imported into personal-growth or leadership writing: "move the needle," "circle back," "double down," "low-hanging fruit," "shift the paradigm."
- **Specimen:** "Use this approach to move the needle on your most important goals. Then we can circle back next quarter."
- **Why AI produces it:** Management and consulting corpora bleed into any professional-frame topic.
- **Replacement:** "What actually changes" beats "move the needle." The Sovereign's vocabulary is embodied and specific, not corporate.

**12. The Vague Demonstrative Anchor**
- **Pattern:** Overuse of "this" and "these" as paragraph openers without clear antecedent, creating continuity without logical connection.
- **Specimen:** "This is what makes it so powerful. These insights can transform your approach."
- **Why AI produces it:** Reference glue used to stitch paragraphs together without building an actual argument.
- **Replacement:** Name the actual thing. Or start a new thought.

## V. Category II: Opener Tells

*Failure modes at the first sentence of a piece, chapter or section. The opener is the highest-stakes surface. Most opener AI tics share the same root: the model orienting itself before generating substance, with the orientation landing in the prose.*

**13. The Temporal Opener**
- **Pattern:** "In today's fast-paced world," "In an era of," "In the digital age," "As we move forward" as opening frame.
- **Specimen:** "In today's fast-paced world, staying ahead requires..."
- **Why AI produces it:** Context-setter skeleton that structures the paragraph before the model has decided what to say.
- **Replacement:** Start with the actual situation. Drop the temporal frame.

**14. The Whether-You're Opener**
- **Pattern:** "Whether you're X or Y" naming two audience types before stating the point.
- **Specimen:** "Whether you're a seasoned entrepreneur or just starting out, this principle applies."
- **Why AI produces it:** Inclusive framing signals welcome to RLHF. Template for audience-range signaling without actual differentiation.
- **Replacement:** Write to the reader directly. The right reader has found the page.

**15. The Let's-Dive Opener**
- **Pattern:** "Let's dive in," "Let's dive deeper," "Let's explore," "Let's unpack this" before an explanation that would have begun anyway.
- **Specimen:** "Ready to dive in? Let's explore what makes this approach unique."
- **Why AI produces it:** Mimics conversational enthusiasm from tutorial transcripts. Gives the model a moment to orient.
- **Replacement:** Start the explanation. Genuine invitations to reflect are permitted; preamble filler is not.

**16. The Imagine Opener (Corrupted)**
- **Pattern:** "Imagine..." or "Picture this..." followed by a hypothetical scenario as emotional buy-in before the actual argument.
- **Specimen:** "Imagine waking up every morning with absolute clarity about your purpose."
- **Why AI produces it:** Low-cost scene-manufacture from copywriting training. Avoids the harder work of dropping into a lived moment.
- **Replacement:** Drop into the lived moment. The Writing Style Codex permits "Imagine..." as genuine invitation. This entry names the corrupted scene-manufacture version.

**17. The Sycophantic Opener**
- **Pattern:** "Great question!" "Absolutely!" "Certainly!" "What a fascinating question." Validation before engagement.
- **Specimen:** "Absolutely! Here is how to think about this challenge..."
- **Why AI produces it:** Direct RLHF product. Annotators rated validating responses higher; the behavior was reinforced. Confirmed across GPT, Claude and Gemini families.
- **Replacement:** Answer the question. In prose without Q and A form, the tic sneaks in as "Indeed," "Certainly," or an affirmation before substance. Cut all of it.
- **Cross-model note:** "Certainly!" is the GPT-4 signature opener. "Absolutely!" is the GPT-4o variant. "Great question!" is the cross-family lowest-common-denominator. All three migrate into Claude-produced prose by training-data osmosis from corpora that include GPT-4 outputs.

**18. The "By the End of This..." Opener**
- **Pattern:** Promising the reader what they will know, feel or be able to do by the end of the piece.
- **Specimen:** "By the end of this chapter, you'll understand exactly what this practice is and how to start applying it."
- **Why AI produces it:** Sales-page and course-landing-page training. Outcome-preview as conversion hook.
- **Replacement:** Begin with the lived moment or felt tension. The reader discovers what they received by experiencing it.

## VI. Category III: Hedging, Padding and Disclaimer Reflexes

*The most pervasive category. Every entry here is a direct product of RLHF pressure to avoid overconfidence, project sensitivity or signal effort. The fix is almost always the same: state the claim. The hedging wrapper is the entire problem.*

**19. The Importance Hedge**
- **Pattern:** Opening with "It's important to note," "It's worth noting," "It's important to consider" before stating something the writer will say anyway.
- **Specimen:** "It's important to note that this process takes time."
- **Why AI produces it:** RLHF rewards hedging that preempts disagreement. Flagging importance before stating a fact softens assertion.
- **Replacement:** State the thing. The wrapper is the problem.

**20. The Moreover Escalator**
- **Pattern:** Opening consecutive sentences with "Moreover," "Furthermore," "Additionally," "In addition" to simulate logical progression.
- **Specimen:** "Moreover, this approach allows for greater flexibility. Furthermore, teams find it easier to adopt."
- **Why AI produces it:** Academic-text saturation in training data. Signals organization without requiring it.
- **Replacement:** Cut the transition. Or name the relationship: "Because of that," "Which means."

**21. The That-Said Pivot**
- **Pattern:** "That said," "With that said," "Having said that," "That being said" before a contrasting point.
- **Specimen:** "That said, it's important to maintain balance."
- **Why AI produces it:** Conversational and editorial training saturation. Signals nuance without developing any.
- **Replacement:** Start the contrasting sentence without the pivot. Trust the contrast.

**22. Hedge Stacking**
- **Pattern:** Multiple qualifiers pile onto a single assertion until the claim disappears: "could potentially," "may often," "might ultimately."
- **Specimen:** "This approach could potentially offer some interesting possibilities that might ultimately prove useful in certain contexts."
- **Why AI produces it:** Each individual hedge is a safe move. RLHF rewards caution without flagging accumulation.
- **Replacement:** "This works. Here is why." Or name the genuine uncertainty specifically.

**23. Faux Humility**
- **Pattern:** "I'm just one perspective here," "I could be wrong," "Take this with a grain of salt" preemptively discounting before claiming.
- **Specimen:** "I'm just one perspective here, and I could absolutely be wrong, but it seems like maybe this might matter."
- **Why AI produces it:** Harmlessness training rewards appearing nonthreatening. Disclaiming authority is a safe move.
- **Replacement:** State what you know. If uncertainty is genuine, name the specific uncertain thing, not your capacity to have opinions.

**24. False Vulnerability**
- **Pattern:** Performative admission of uncertainty or limitation that simulates authenticity without genuine risk.
- **Specimen:** "I'll be honest, this is a topic I find deeply personal. I've struggled with it myself."
- **Why AI produces it:** Self-disclosure phrases score as well as actual vulnerability in rater assessments. Cheaper to produce.
- **Replacement:** Name the actual thing struggled with. The specific moment. The specific feeling.

**25. The "I Want to Be Clear" Disclaimer**
- **Pattern:** "I want to be clear," "to be clear," "let me be direct" before saying something. Performs directness rather than being direct.
- **Specimen:** "I want to be clear about this: I'm not saying you need to abandon everything."
- **Why AI produces it:** Meta-commentary on the model's own honesty signals sincerity to raters.
- **Replacement:** Be direct. The directness is in the sentence, not in the announcement.

**26. Tautological Padding**
- **Pattern:** The same point restates itself in slightly different phrasing across three to four consecutive sentences, producing cadence without movement.
- **Specimen:** "Clarity matters. When you're clear, things get clearer. The clearer you become, the more clarity you develop."
- **Why AI produces it:** Next-token prediction produces semantically similar continuations. RLHF rewards "felt thorough."
- **Replacement:** Write the sentence once. Trust it. Move on.

**27. The "I Should Mention" Hedge (GPT-4 family)**
- **Pattern:** "I should mention," "I should note," "It's worth pointing out," "One thing to keep in mind" as preface before any qualifying information. GPT-4 family signature.
- **Specimen:** "I should mention that this approach works best when you have some experience with the practice."
- **Why AI produces it:** OpenAI RLHF heavily rewards explicit conscientiousness. The model surfaces every caveat with a flag, treating the surfacing itself as a service. Distinct from "It's important to note" (which is universal AI) by the first-person "I should" framing.
- **Replacement:** State the caveat directly if it matters. Or cut it. The "I should" framing puts the model between the reader and the information.

**28. The "As an AI" Disclaimer Leakage**
- **Pattern:** "As an AI language model," "I'm just an AI," "I don't have personal experiences but," "I can't claim to know what it feels like, but" disclaimers leaking from chat-mode into long-form prose. Most visible when AI assists drafting first-person human writing and forgets to suppress the AI-identity reflex.
- **Specimen:** "As someone reflecting on this, though I haven't personally experienced it, I think the principle still applies."
- **Why AI produces it:** Anthropic, OpenAI and Google all train for AI-identity transparency in chat mode. The reflex leaks into assisted prose drafting and produces a strange third-person-AI tone inside what should be the Sovereign's first-person voice.
- **Replacement:** The Sovereign has lived experience. Write from it. If the model is drafting the Sovereign's voice, the AI-identity disclaimer is the exact thing that breaks the voice.

## VII. Category IV: Negation and Pivot Constructions

*The signature reframe move. Used sparingly in specific idioms. Used reflexively by AI as default rhetorical structure.*

**29. The "It's Not X, It's Y" Pivot**
- **Pattern:** Whole-sentence reframe via "It's not X, it's Y" delivered as revelation.
- **Specimen:** "It's not about finding the right answers. It's about learning to ask better questions."
- **Why AI produces it:** Motivational and thought-leadership training data saturation. Reads as rhetorically crisp.
- **Replacement:** "Better questions are the practice." State Y directly.

**30. The Not-A-Not-B-Not-C Negation Triad**
- **Pattern:** Pure negation run three times before any affirmative content.
- **Specimen:** "Not a framework. Not a methodology. Not a set of rules you follow."
- **Why AI produces it:** Creates artificial suspense. Marketing-copy pattern.
- **Replacement:** "It's a practice you feel your way into." Lead with affirmative.

**31. The Not-Just-But-Also Escalation**
- **Pattern:** "Not just X, but Y" implying first framing is insufficient and second is the real truth.
- **Specimen:** "This isn't just a productivity hack. It's a fundamental reorientation of how you relate to work."
- **Why AI produces it:** Escalation patterns score as insight delivery.
- **Replacement:** "It reorients how you relate to work."

**32. The Balanced-Perspective Sandwich**
- **Pattern:** Position A, position B, resolution that "the truth lies somewhere between" or "both have value."
- **Specimen:** "On one hand, structure gives us safety. On the other hand, spontaneity creates aliveness. The truth lies in finding the balance."
- **Why AI produces it:** RLHF strongly rewards appearing balanced. Both/and resolutions never alienate any rater.
- **Replacement:** Have a position. "Structure and spontaneity are the same thing at different scales."

**33. The False Concession**
- **Pattern:** Granting the opposing position ("while X has merit") then failing to actually engage with it.
- **Specimen:** "While there are certainly valid arguments on the other side, ultimately the evidence points in one direction."
- **Why AI produces it:** RLHF rewards acknowledging multiple perspectives. Gesture concession satisfies the rater without requiring engagement.
- **Replacement:** Either take the other position seriously and let it change the argument, or do not bring it up.

## VIII. Category V: Rhetorical Reflexes

*Multi-sentence rhetorical patterns the model deploys to simulate thoughtful structure. The reader senses them as theater.*

**34. The Faux-Socratic Chain**
- **Pattern:** Sequence of escalating rhetorical questions simulating inquiry but answering nothing.
- **Specimen:** "But what does that really mean? What are we actually saying? And more importantly, what does it ask of us?"
- **Why AI produces it:** Pattern-matches to Socratic dialogue. Scores as "thought-provoking" without genuine inquiry.
- **Replacement:** One question, let it work. A chain of rhetorical questions produces theater, not thought.

**35. The Preamble Announcement**
- **Pattern:** Announcing the coming content rather than producing it. "Let me explain what I mean." "Let me break this down."
- **Specimen:** "Let me explain what I mean by that. To fully appreciate the significance of this shift, it's important to first establish the foundational principle."
- **Why AI produces it:** Helpfulness training rewards signposting. Model hedges against miscomprehension by narrating its own output.
- **Replacement:** "The foundational principle is simple."

**36. The "Here's Why This Matters" Frame**
- **Pattern:** Announcing importance before delivering. "Here's why this matters," "And that's the real point," "This is why it's significant."
- **Specimen:** "Here's why this matters: when we operate from alignment rather than obligation, everything we create carries a different quality."
- **Why AI produces it:** Business-communication signposting reflex.
- **Replacement:** "Operating from alignment changes the quality of everything created."

**37. The Engagement-Bait Revelation**
- **Pattern:** Promising insight "nobody is talking about," "everyone is getting wrong," "you won't find anywhere else."
- **Specimen:** "Here is the truth nobody wants to say out loud. This is the thing everyone's missing."
- **Why AI produces it:** RLHF training on viral content. Scores well on "felt novel" proxies.
- **Replacement:** Make the observation. If genuinely rare, the rarity is obvious from the observation.

**38. The Anaphoric Hammer**
- **Pattern:** Same phrase opens three or more consecutive sentences in quick succession. Speech-rhythm applied to mundane content.
- **Specimen:** "It's about showing up. It's about doing the work. It's about trusting the process."
- **Why AI produces it:** Anaphora patterns saturate inspirational training data. Reproduces form without earned emotional stakes.
- **Replacement:** One declarative sentence. Then white space.

**39. Explicit Insight Delivery**
- **Pattern:** Announcing the insight before it arrives. "Here's the key insight." "The real shift happens when." "This is the part that changes everything."
- **Specimen:** "Here's the key insight: the resistance you feel isn't a reason to stop."
- **Why AI produces it:** Flagging insights signals value delivery to raters.
- **Replacement:** The revelation arrives immediately after the pivot, without flag.

## IX. Category VI: Voice and Register Signatures

*Personality-level tells. Above structure, in the felt register the reader picks up.*

**40. The Wisdom-Broker Register**
- **Pattern:** Every paragraph delivers one portable insight. Writer's purpose is to hand the reader a quotable truth rather than think alongside them.
- **Specimen:** "Clarity is speed. When you know what you want, decisions make themselves. The clearest thinkers move fastest."
- **Why AI produces it:** Next-token prediction optimizes for aphoristic sentences that feel complete. RLHF reinforces the "insightful" label.
- **Replacement:** Hold the thought longer. Let it arrive through a scene before naming it. One insight per piece is enough.

**41. Performed Warmth**
- **Pattern:** Declaring warmth rather than demonstrating it. Intensifiers like "truly," "sincerely" assert emotional presence.
- **Specimen:** "I genuinely care about this. Truly. And I think you deserve to know that."
- **Why AI produces it:** RLHF optimizes for perceived warmth.
- **Replacement:** Warmth lives in noticing a specific thing. No declaration needed.

**42. False Intimacy**
- **Pattern:** Performing closeness not earned. "Between you and me," "let's be honest," "here's the thing."
- **Specimen:** "Let's be honest. Between you and me, most people are getting this completely wrong."
- **Why AI produces it:** Candor-opener phrases score well on "felt like a real conversation" proxies.
- **Replacement:** Be honest without announcing the honesty. If true, write it plainly.

**43. The Coach Voice**
- **Pattern:** Positioning the reader as student who must be told. "You need to," "the key is to," "the most important thing."
- **Specimen:** "You need to learn to trust yourself here. The key is building that muscle every day."
- **Why AI produces it:** RLHF training on coaching transcripts. "Helping" measured as telling people what to do.
- **Replacement:** Offer curiosity, never commands. "Whatever you're drawn to, explore it."

**44. The TED-Talk Cadence**
- **Pattern:** Build, build, build, drop the line. Engineered to feel like revelation.
- **Specimen:** "We've been thinking about this all wrong. For years, we've approached it one way. Billions have been spent. And it's not working. The reason is simpler than you think. It's us."
- **Why AI produces it:** Scores well on "felt profound" proxies. Mimics TED format overrepresented in training data.
- **Replacement:** Land the observation at the start. The reader earns the walk, not the drop.

**45. Vague-Attribution Authority**
- **Pattern:** Claims grounded in unnamed consensus. "Experts say," "research shows," "studies suggest," "many people find."
- **Specimen:** "Research shows that most people struggle with this more than they realize."
- **Why AI produces it:** Vague attributions are low-risk high-reward versus specific citations that require verification.
- **Replacement:** Own the claim or drop it. "I found this to be true." Or: "I don't know why, but it works."

**46. Wholesome-Uplift Drift**
- **Pattern:** Every piece must end inspiring. Arc always resolves upward.
- **Specimen:** "So as you move forward, remember: you have everything you need inside you. This is just the beginning. Keep going."
- **Why AI produces it:** Raters penalize bleak or unresolved endings. Uplift is always safe.
- **Replacement:** End where the thought ends. If the road is better than the destination, say that.

**47. The Uniform Register**
- **Pattern:** Single tonal temperature throughout. Never shifts, never gets weird. Flat professional warmth that real writers never sustain.
- **Specimen:** Any 1,200-word piece in exactly the same register: warm, professional, slightly encouraging, structurally symmetric.
- **Why AI produces it:** Next-token prediction at fixed temperature produces statistically consistent tone. No RLHF reward for tonal variation.
- **Replacement:** Let register move. A section can be dry. A line can be funny. A paragraph can slow down until it barely breathes.

## X. Category VII: Structural Tics

*Multi-section and multi-chapter patterns. Most damaging in book form, where they compound across chapters.*

**48. The Triadic Reflex**
- **Pattern:** Everything in threes. Three adjectives, three examples, three parallel clauses. Rule of three applied mechanically regardless of natural fit.
- **Specimen:** "This approach is powerful, transformative and deeply human. It shows up in boardrooms, living rooms and quiet moments of reflection."
- **Why AI produces it:** Tricolon scores as "compelling" with raters. Default cadence structure.
- **Replacement:** Name the actual count. If two things, write two. Triads are earned, not defaulted.

**49. The Fractal Summary**
- **Pattern:** Summaries at every level. Intro ("in this piece I'll cover"), each section end, conclusion. Same content restated at every scale.
- **Specimen:** "In this article, we'll explore three core principles... As we've seen, these three principles work together... To summarize: principle one was X."
- **Why AI produces it:** Educational content rewards "tell them what you'll tell them, tell them, tell them what you told them."
- **Replacement:** The piece has one arc. It goes somewhere and arrives. No announcement, no recap.

**50. The Conclusion That Closes**
- **Pattern:** Closing paragraph summarizes what was just said. Wraps the piece instead of opening it.
- **Specimen:** "In conclusion, following your aliveness is the key to a fulfilling life."
- **Why AI produces it:** Academic conventions in training data. RLHF rewards closure.
- **Replacement:** End on image or forward pull. Summation closes the door. Image opens it.

**51. The Chapter-Opening Preamble**
- **Pattern:** Every chapter opens with explicit statement of what it covers. "In this chapter, we will..."
- **Specimen:** "In this chapter, we will explore the concept of presence, examine how conditioning forms, and offer practical tools."
- **Why AI produces it:** Academic textbook conventions. Applied universally regardless of register.
- **Replacement:** Open on the experience or question. The chapter's territory reveals itself through the first true move.

**52. The Chapter-Closing Recap**
- **Pattern:** Chapter ends restating main points. "In this chapter, we covered..." or "We've explored X, Y and Z. In the next chapter..."
- **Specimen:** "In this chapter, we covered what aliveness is, how conditioning forms, and three practices for following it."
- **Why AI produces it:** Textbook structure. Damage compounds across multiple chapters.
- **Replacement:** End on the last true line. Leave the reader in it.

**53. The Elegant Variation Spiral**
- **Pattern:** Same concept referred to by a different name every time it appears. A "practice" becomes "this approach" becomes "the method" becomes "this work" in consecutive paragraphs. Driven by the LLM's built-in repetition penalty.
- **Specimen:** "The practice of intentional reflection creates clarity. This approach has transformed how I work. The method is deceptively simple. This work has a way of revealing what was hidden."
- **Why AI produces it:** Repetition penalty in the decoding loop actively suppresses word reuse. Model cycles through synonyms to avoid penalty, producing incoherence.
- **Replacement:** Repeat the name of the thing. Repetition for reinforcement is a strength. "This approach / this work / the method" reads as evasive, not elegant.

## XI. Category VIII: Formatting and Visual Tics

*Visual fingerprints. Especially damaging in book-form prose, where formatting density signals "blog post" not "chapter."*

**54. Bolded-Every-Paragraph**
- **Pattern:** Every paragraph contains at least one bolded phrase. Bold as visual punctuation, not emphasis.
- **Specimen:** "The body knows before the mind does. **You can feel it as a pull rather than a push.** The question is whether you follow it."
- **Why AI produces it:** RLHF rewards structured scannable output.
- **Replacement:** Let the sentence carry its own weight. A sentence needing bold to feel important needs to be rewritten.

**55. Header-Above-Everything**
- **Pattern:** Descriptive header precedes every paragraph. Continuous prose becomes an indexed document.
- **Specimen:** ### Understanding the Roots / ### How Conditioning Interrupts / ### Practical Tools
- **Why AI produces it:** Blog and documentation training. Generalizes "structure equals clarity."
- **Replacement:** Visual breaks between major turns. Section identity emerges from prose.

**56. Listicle-Creep**
- **Pattern:** Prose reasoning that could run as connected sentences broken into bullets. Logic fragmented into parallel lines.
- **Specimen:** "Three things happen: body relaxes, decisions feel cleaner, relationships improve" formatted as three bullets.
- **Why AI produces it:** Bullets rewarded as organized and scannable. Cognitively easier to generate.
- **Replacement:** Write the sentence that holds all three. One sentence. One breath.

**57. The Key-Takeaways Box**
- **Pattern:** Visually demarcated block at end of section labeled "Key Takeaways," "Main Points," "What to Remember."
- **Specimen:** **Key Takeaways:** bulleted recap of section content.
- **Why AI produces it:** Pedagogical templates from instructional content.
- **Replacement:** Prose carried the point. Trust that. End on image or feeling.

**58. The Markdown-in-Book Pattern**
- **Pattern:** Asterisks, hashes, backticks, decorative dividers, emoji bullets in prose meant to be read as a book.
- **Specimen:** "## Chapter 4 / **Core concept:** ... / - Notice: where ... / - Release: the pattern..."
- **Why AI produces it:** Trained on GitHub, Reddit, Notion, Medium. Markdown is not a choice for the model. It is the native form.
- **Replacement:** A book chapter is not a pull request. Strip every markdown convention. Ask: does the remaining structure serve the reader or the model?

**59. Uniform Paragraph Weight**
- **Pattern:** Every paragraph approximately the same length and density. No paragraph breathes differently from any other.
- **Specimen:** Five consecutive paragraphs at roughly the same sentence count, ending on similar rhythmic cadence.
- **Why AI produces it:** Token-level optimization produces homogeneous paragraph rhythm. No felt sense of pacing.
- **Replacement:** Paragraphs vary. Single-line breaths next to dense concept paragraphs. The weight differential is load-bearing.

**60. The Significance Tail**
- **Pattern:** Sentence ends with dangling present-participle phrase claiming significance: "highlighting the importance of X," "reflecting a deeper truth," "underscoring the need for Y."
- **Specimen:** "Leaders who embrace uncertainty tend to perform better over time, reflecting a deeper truth about ego and adaptability."
- **Why AI produces it:** Academic and journalism training rewards explicit observation-to-significance connections.
- **Replacement:** "Leaders who embrace uncertainty tend to outperform. Ego and adaptability are at the root of it." Two sentences. No tail.

## Cross-Codex References

- [[Council Chamber/Codices/Expression/Writing Style Codex]] — affirmative voice the Sovereign aims for
- [[Council Chamber/Codices/Contrast Layer Codex]] — internal contrast processing; output defaults to affirmative framing
- [[Council Chamber/Codices/Codices Index]]

## Personalization Note

This codex ships in template form. Personalize during onboarding:

1. Run a Vocabulary Reconciliation pass for the Sovereign. Grep candidate banned words against the Sovereign's actual writing corpus before sealing the blacklist. Words the Sovereign actually uses stay. AI-reflex use of the same word gets flagged.
2. Mark verified exceptions inline with a `(SOVEREIGN-VOCAB RECONCILED)` tag and a short note naming the source (article, book chapter, brand vocabulary).
3. Add the Sovereign's signature words that should be preserved (the affirmative-voice anchors that AI substrate tends to flatten).

The codex is sealed only after this pass.
