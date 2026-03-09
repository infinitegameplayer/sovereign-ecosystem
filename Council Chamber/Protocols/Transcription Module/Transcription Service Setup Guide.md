---
status: active
module: Transcription Module
tier: operational
---

# Transcription Service Setup Guide

Purpose: Guide the Sovereign through selecting and configuring a transcription service that feeds voice captures into the Sovereign Ecosystem inbox.

## What This Module Does

The Transcription Module enables voice-first capture. Rather than typing notes, you speak — on a walk, in a car, during a hike — and your transcription service converts that audio into text. That text flows into the Sovereign Ecosystem inbox, where it is classified, analyzed for Expression potential and routed according to the Transcript Inbox Protocol or Solo Voice Note Protocol.

This is a capture-speed upgrade, not a requirement. The foundation works without it. Add this when you are ready to build the habit.

## How It Works (Pattern)

```
Voice recording (phone or device)
    --> Transcription service (audio to text)
    --> Transcript lands in Inbox/ (manual or automatic)
    --> {{AI_INTERFACE_NAME}} classifies and routes (proposal-first)
    --> Library or Scriptorium destination
```

## Common Service Options

Choose based on what fits your workflow and sovereignty preferences.

| Service | Notes |
|---|---|
| Fireflies.ai | Cloud-based. Strong for meeting transcripts and solo notes. MCP integration available for direct API access. |
| Otter.ai | Cloud-based. Good for real-time and solo voice capture. Manual export to inbox. |
| Whisper (OpenAI) | Open-source model. Can be self-hosted for greater sovereignty. Requires local setup. |
| Apple Dictation / Google Recorder | Built-in. Low friction. Manual copy-paste to inbox. |
| Notion AI / other embedded tools | Platform-dependent. Works if already in your stack. |

Sovereignty preference: Open-source and local options (Whisper) align best with the Sovereign Ecosystem's progressive sovereignty direction. Cloud services are acceptable starting points — they reduce setup friction while you build the habit. Migrate toward local when it makes sense for your infrastructure.

## General Setup Pattern

Regardless of service, the integration follows this pattern:

### Step 1 — Choose Your Service
Select based on your device, workflow and sovereignty preference. You do not need the most sophisticated option to start. Start with what you will actually use.

### Step 2 — Record and Transcribe
Test a solo voice note. Walk outside, speak for 3-5 minutes on any topic. Let the service transcribe it.

### Step 3 — Get the Transcript into Inbox
- **Manual:** Copy the transcript text and paste into a new note in `Inbox/`. Follow the filename standard: `Transcript - Solo - {Short Topic} - YYYY-MM-DD.md`.
- **Automated:** If your service supports webhooks, API polling or direct file export, configure it to deposit transcripts into `Inbox/` automatically. Document the configuration in a support file under `Inbox/`.

### Step 4 — Run the Protocol
With a transcript in `Inbox/`, run the Solo Voice Note Protocol or Transcript Inbox Protocol depending on the transcript type.

### Step 5 — Create a PendingPlan (If Automating)
If you want automated ingestion (transcript lands in Inbox without manual copy-paste), create a PendingPlan for it. Use the support files folder to store:
- service credentials / API key references (never store tokens in vault files)
- any helper scripts
- configuration notes
- setup progress breadcrumbs

This keeps the active vault clean while you work through the automation setup.

## Pending Plan Template (Automation Setup)

Use this as a starting point if you are building automated ingestion:

```
PendingPlan - Transcription Service Automation.md

Objective: Configure [service name] to automatically deposit transcripts into Inbox/ on the Sovereign Ecosystem vault.

Key steps:
- Research API capabilities of chosen service
- Build or configure ingestion script
- Test manual trigger before scheduling
- Document final config in support files

Support files:
- Council Chamber/Pending Plans/Support Files/Transcription Module/
```

## Connecting to {{AI_INTERFACE_NAME}} Activation

Once your service is configured, add a check to your {{AI_INTERFACE_NAME}} Activation sweep:

1. During Activation, {{AI_INTERFACE_NAME}} checks `Inbox/` for new transcript files.
2. New transcripts surface as routing proposals (no auto-ingest).
3. Sovereign approves routing before any processing begins.

This keeps the capture layer clean and the governance layer in control.

## Related Protocols

- `[[Council Chamber/Protocols/Transcription Module/Solo Voice Note Protocol]]` — for single-speaker, exploratory voice notes
- `[[Council Chamber/Protocols/Transcription Module/Transcript Inbox Protocol]]` — for all transcript types including collaboration
- `[[Council Chamber/Protocols/Inbox/Capture Classify Route Protocol]]` — the parent routing protocol for all inbox intake
