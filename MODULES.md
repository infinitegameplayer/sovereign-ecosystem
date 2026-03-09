---
status: active
created: 2026-03-08
---

# Sovereign Ecosystem Modules

Purpose: define the boundary between the Sovereign Ecosystem Foundation and the optional modules that can be added later without confusing setup, ownership or install order.

This file is an architecture map, not a setup guide.
It explains what belongs together, what depends on what, and when each layer should be installed.

## Reading Rule

- `Foundation` means the minimum viable Sovereign Ecosystem.
- `Module` means an optional capability bundle.
- `Onboarding-generated` means a surface that becomes real during setup or personalization.
- `Runtime-created` means a surface that is updated through normal use.

## Foundation

The Foundation is the smallest complete system that can:
- activate the AI interface
- capture and route new material
- manage Pending Plans and Quests
- close sessions cleanly
- archive and back up approved work
- preserve governance and security boundaries

### Foundation includes

- Governance core
  - Constitution
  - Interface Adapter Registry
  - Layer Map
  - Object Model
  - Structural Containers
  - Security
  - Translation to Action
  - Flywheel Integration Standard
  - Quest Operating Guide
- AI Interface baseline
  - Operating Charter
  - Knowledge Map
  - Activation / Engagement / Power Down / Change Log / Sovereign Command protocols
  - activation and engagement checklists
- Core codices
  - Challenge and Illumination
  - Contrast Layer
  - Tag Dictionary
  - Codices Index
- Core workflows
  - Capture Classify Route
  - To-Do Dock Protocol
  - Pending Plan workflow
  - Quest Progress Update
  - Session Closeout
  - Batch Archival
  - Backup
  - Universal Vault Flywheel
  - Security Flywheel
  - Naming and Versioning
  - Platform-Agnostic Interface Adapter
- Foundation skills
  - AI Interface Activation
  - Batch Archival
  - Pending Plan Implementation
  - Pending Plan Progress Update
  - Quest Progress Update
  - Security Check
  - Session Closeout
  - Weekly Backup
  - Skills Index
  - Skills Governance Protocol
- Foundation templates
  - Inbox Intake Analysis Template
  - InboxItem
  - Spark
  - PendingPlan
  - Quest
  - Experiment
  - Session Summary

### Foundation does not include

- voice-transcription ingestion
- structured publishing/drafting lanes
- weekly review ritual
- deeper stewardship flywheels and taste/archetype refinement
- consult and collaboration-specific planning lanes
- builder/maintainer extension authoring surfaces

### Foundation prerequisites

- none beyond the base local workspace

### Foundation creates or expects later

- `Library/North Star.md` is onboarding-generated
- `Council Chamber/Codices/Humor Codex.md` is onboarding-generated
- `Sovereign Command.md` is runtime-created
- `Council Chamber/AI Interface/Continuity Log.md` is runtime-created
- `Council Chamber/AI Interface/AI Interface Change Log.md` is runtime-created
- `Council Chamber/AI Interface/AI Interface Engagement Calibration Log.md` is runtime-created
- `Council Chamber/AI Interface/AI Interface Readiness Snapshot.md` is runtime-created
- `Council Chamber/AI Interface/Sovereign Command Refresh Log.md` is runtime-created
- `Council Chamber/Pending Plans/Index.md` is runtime-created
- `Vault (Archive)/Sovereign Ecosystem Backup Log.md` is runtime-created
- `To-Do Dock.md` is a runtime surface even if a protocol mentions it on day one

## Module Install Logic

Install modules only when the Foundation loop is already understandable.
The rule is simple:

1. Install Foundation first.
2. Add modules only when the Sovereign has a real use case for them.
3. Install the smallest module bundle that completes a workflow.
4. Avoid installing partial layers that create references to files or habits the user does not yet need.

## Module Summary

| Module | Adds | Depends on | Recommended timing |
|---|---|---|---|
| Expression | structured drafting and output lanes | Foundation | later, when publishing or writing is active |
| Transcription | voice-first capture and transcript routing | Foundation | early only for voice-heavy users |
| Weekly Review | weekly review ritual and command refresh cadence | Foundation, North Star setup | after the daily/session loop feels stable |
| Stewardship | deeper flywheels, governance sensing, taste/archetype refinement | Foundation, enough lived system data | later |
| Collaboration and Consult | consult intake preservation and collaboration archival boundaries | Foundation | only when those workflows are real |
| Builder | extension-authoring and packaging surfaces | Foundation | maintainer-only or advanced users |

## Expression Module

### What it adds

- `Council Chamber/Protocols/Expression/Expression Drafting Protocol.md`
- `Council Chamber/Protocols/Expression/Article Drafting Protocol.md`
- `Council Chamber/Protocols/Expression/Article Archival Protocol.md`
- future companion surfaces that belong with it:
  - `Artifact.md`
  - Expression domain templates
  - Writing Style installation surface

### Why someone would install it

- they want a real drafting lane, not just capture and planning
- they are publishing, writing articles, creating social posts, or refining strategic memos

### Depends on

- Foundation archival rules
- Foundation capture and planning surfaces

### Install timing

- not day one by default
- recommended when the user has active creative or publishing output

### Boundary rule

Do not install only one Expression protocol in isolation.
If Expression is installed, install the full drafting bundle so the user gets a coherent path from draft creation to archival handoff.

## Transcription Module

### What it adds

- `Council Chamber/Protocols/Transcription Module/Solo Voice Note Protocol.md`
- `Council Chamber/Protocols/Transcription Module/Transcript Inbox Protocol.md`
- `Council Chamber/Protocols/Transcription Module/Transcription Service Setup Guide.md`

### Why someone would install it

- they capture ideas by voice more naturally than by typing
- they want transcript-driven routing into Library, Collaborations, or Expression

### Depends on

- Foundation capture/routing logic
- Foundation AI Interface Activation flow

### Install timing

- optional early install for voice-heavy users
- otherwise later, once the base capture loop is already working

### Boundary rule

The service setup guide and transcript routing rules belong together.
Do not install transcript automation guidance without the transcript routing protocol that governs it.

## Weekly Review Module

### What it adds

- `Council Chamber/Protocols/Session/End-of-Week Protocol.md`
- `Council Chamber/Skills/End-of-Week/SKILL.md`

### Why someone would install it

- they want a recurring weekly review cadence
- they want `Sovereign Command` refreshed from a structured weekly ritual
- they want an AI-briefed weekly intelligence review covering creation, operations, and trajectory

### Depends on

- Foundation session and command surfaces
- `Library/North Star.md` being meaningfully set up
- enough runtime data to review

### Install timing

- after the basic day-to-day loop is stable

### Boundary rule

Weekly review is not Foundation-core because the system can function without a weekly ritual.
It becomes high-value only after real runtime signals exist.

### Pre-shipped note

The End-of-Week protocol and skill files are included in the Foundation directory as a convenience.
Their presence in the folder does not mean the module is active.
Module activation happens through intentional selection in Session 5 and implementation in Session 6.
Before activation, these files are available but not part of the working Foundation loop.

## Stewardship Module

### What it adds

- `Council Chamber/Codices/Conduction Codex.md`
- `Council Chamber/Protocols/Flywheels/Conduction Flywheel Protocol.md`
- `Council Chamber/Protocols/Flywheels/Flywheel Codex Stewardship Protocol.md`
- `Council Chamber/Protocols/Flywheels/North Star Flywheel.md`
- `Council Chamber/Protocols/Flywheels/North Star Recalibration Protocol.md`
- `Council Chamber/Protocols/Flywheels/Universal Taste Calibration Protocol.md`
- `Council Chamber/Protocols/Governance/Meta-Governance Audit.md`

### Why someone would install it

- they want deeper review loops, not just operational hygiene
- they want taste, archetype, drift and pattern refinement to shape governance

### Depends on

- Foundation
- `Library/North Star.md` being live
- enough completed work, Quests, Experiments, or runtime logs to synthesize

### Install timing

- later
- best after the system has enough history for pattern analysis to be real rather than imagined

### Boundary rule

Stewardship is a depth layer.
It should not ship as mandatory first-run architecture because it adds reflective complexity before the user has enough signal to benefit from it.

## Collaboration and Consult Module

### What it adds

- `Council Chamber/Protocols/Inbox/Consult Inbox Protocol.md`
- `Council Chamber/Protocols/Archival/Collaboration Archival Protocol.md`
- future owned surfaces:
  - `Consult.md`
  - collaboration containers
  - collaboration support notes and dashboards

### Why someone would install it

- they actively use consult-style planning artifacts
- they need collaboration records and collaboration-specific archival handling

### Depends on

- Foundation planning and archival rules

### Install timing

- only when consults or collaborations are actually part of the user's life/workflow

### Boundary rule

This module stays optional because the Foundation already supports general planning without consult-specific source preservation or collaboration-specific archival rules.

## Builder Module

### What it adds

- `Council Chamber/Protocols/Governance/Domain Pack Architecture Protocol.md`
- `Council Chamber/Protocols/Governance/Skill Export Packaging Protocol.md`
- `Council Chamber/Skills/Skill Template.md`
- `Council Chamber/Skills/Skill Export Packaging Template.md`

### Why someone would install it

- they are extending the ecosystem itself
- they want to create new domain packs, reusable skills, or exportable architecture layers

### Depends on

- Foundation
- clarity on naming/versioning and governance rules

### Install timing

- later
- maintainer-oriented, not first-run

### Boundary rule

Builder surfaces should not be treated as mandatory user-facing workflow.
They belong to ecosystem evolution, not ordinary day-to-day operation.

## What This Means In Practice

- A clean first install is `Foundation` plus onboarding-generated identity and naming setup.
- Most users should add modules only after living in the Foundation for a bit.
- The first likely optional module depends on actual behavior:
  - voice-heavy user -> `Transcription`
  - writing-heavy user -> `Expression`
  - review-oriented user with enough data -> `Weekly Review`
- `Stewardship`, `Collaboration and Consult`, and `Builder` should usually come later.

## Out Of Scope Here

- step-by-step installation instructions
- onboarding/session choreography
- publication-facing explanations
- GitHub release structure

Those belong to the onboarding/publication handoff plan.

---

## AI Guidance for Session 5 (Module Selection)

*This section is for the AI interface when helping a Sovereign choose modules in Session 5.*

When a Sovereign reviews this file during module selection, your role is to translate architecture into lived relevance. Use everything you have learned about the Sovereign through Sessions 0–4 to make the selection feel personal and clear, not like reading a technical spec.

For each module the Sovereign shows interest in, offer a one-sentence translation:

- **Expression:** "This adds a real drafting lane — if you are writing, publishing, or creating structured output, this is likely your first module."
- **Transcription:** "If you capture ideas by voice more naturally than by typing, this routes your voice notes into the system automatically."
- **Weekly Review:** "This gives you a structured weekly intelligence briefing — useful once you have a few weeks of real system use to reflect on."
- **Stewardship:** "This adds deeper reflective loops — governance sensing, taste refinement, drift detection. Best after the system has real history."
- **Collaboration and Consult:** "This adds structured handling for consulting work or collaboration records — install only when those workflows are genuinely part of your life."
- **Builder:** "This is for extending the ecosystem itself — creating new skills, domain packs, or exportable layers. Maintainer-level, not first-run."

Let the Sovereign's actual rhythm, expressed over the past sessions, guide the recommendation. If they have been voice-heavy, lean toward Transcription. If they have been writing-focused, lean toward Expression. If the daily loop is still new, suggest they live in the Foundation first before adding anything.

The goal is discernment, not accumulation.
