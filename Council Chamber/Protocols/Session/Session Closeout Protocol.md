# Session Closeout Protocol

Purpose: Capture learnings and decisions from foundational sessions to fuel the flywheel without bloat.

## Triggers
- Governance changes
- New codices, protocols or skills
- System-level reorganizations
- Major North Star updates

## Closeout Steps (5-12 minutes, lightweight by default)
1. Session summary (3 bullets)
2. Decisions made (3 bullets)
3. Meta-Analysis Capsule (3-6 bullets)
   - Patterns observed
   - Learnings
   - Process improvements
   - One small change to implement (if any)
4. New risks or gaps (1-3)
5. Flywheel inputs (what should be tested next)
6. Approval gate: Sovereign confirms the meta-analysis and any proposed refinements
7. Create session log in `Vault (Archive)/Session Logs/`
8. Add a AI Interface Change Log entry (one line summary)
9. Convert deferred ideas into Pending Plans if needed
   - Before creating a new PendingPlan, check for overlapping existing PendingPlans and propose merge/scope-split options if overlap exists.
10. Run Pending Plan Reconciliation to archive or update any Pending Plans now satisfied by this session.
    - Write PendingPlan breadcrumb updates automatically for matched plans (activity/applicability/partial implementation/evidence/reconciliation notes).
    - Do not change PendingPlan status or archive any PendingPlan without explicit Sovereign approval.
    - If Pending Plans changed, sync `Council Chamber/Pending Plans/Index.md` (recommended: `Council Chamber/Tools/Pending Plans Index Sync.ps1`).
11. Run Inbox + Consult Closeout Sweep (proposal-only until approved):
   - Process deferred Activation recommendations first (especially extended-sweep items not required for in-session execution)
   - Apply approved Inbox routing moves deferred from Activation
   - Re-check Consults that produced downstream artifacts in-session and propose/confirm `status: complete` where appropriate
   - Apply approved Consult status changes and Vault descent moves
   - Apply approved transcript/coaching routing or Vault descent moves per transcript protocol
   - Sync `Inbox/Index.md` if changed
12. Approval prompt: confirm or decline each proposed archival or status change before execution
13. Archive the session conversation (if available) to `Vault (Archive)/Session Logs/`
14. Engagement calibration (first 5 activations + closeout; optional after activation 5):
   - Ask for one adjustment (humor, illumination, tone, cadence).
   - Log it in [[Council Chamber/AI Interface/AI Interface Engagement Calibration Log]].

## Commit Strategy (If Changes Were Made)
- Commit by theme (protocols, templates, codices, domains, vault logs), not by session bundle.
- Use concise messages that reflect the domain of change.
- Avoid committing `.obsidian/*` unless explicitly approved.
- If governance or protocol changes were made, confirm a AI Interface Change Log entry exists.

## Output
- Session log file
- AI Interface Change Log entry
- Pending Plans (optional)
- Conversation archive (optional)
- Reconciliation summary (proposals + approval status)
- PendingPlan breadcrumb writeback summary (which plans were annotated, if any)
- Inbox/Consult closeout summary (approved routes/status changes/archive moves)

## Contrast Layer Integration (Mandatory)
Tier: 1 (foundational).
- Include contrast fields in frontmatter for foundational updates.
- Store deeper contrast reasoning in the footer block when needed.
- Primary body remains affirmative.

<!--
Internal Contrast Layer
- Add contrast notes here if needed.
-->

## Compliance Checklist
- Use [[Council Chamber/Checklists/Sovereign Ecosystem Compliance Checklist]].
- Use [[Council Chamber/Checklists/Pending Plan Reconciliation Checklist]] after governance/system changes.

## Reconciliation Sweep (Inadvertent Completions)
- Activation/Closeout split: Activation may produce proposal-only Inbox and archival eligibility reports; Closeout is the default execution point for approved archival/flywheel cleanup.
- Activation/Closeout split: deeper startup sweep items not required for the current `Sovereign Command` direction should be deferred to Closeout by default.
- Consults: if downstream artifacts were created and the Consult is now primarily provenance, propose `status: complete` (approval-gated) and Vault eligibility.
- Pending Plans: check for topic overlap with new artifacts and archive or update.
- Pending Plans: write breadcrumb updates into matched PendingPlan notes even when no status change is approved.
- Pending Plans: scan for any `status: proposed` plans whose goals were fulfilled via indirect paths â€” other plans, organic governance work, or prior sessions. Ask "Is this effectively done?" even if the work never ran through that plan's own execution path. Propose closure for approval.
- Classification drift: check whether any newly created/updated Quest or PendingPlan should be reclassified (Quest vs PendingPlan boundary); propose conversion for approval.
- Quests: if completed or retired, apply Quest Completion Protocol and move to Vault.
- Quests: if completed and Trifecta Reflection + Archetypal ROI are present, run [[Council Chamber/Protocols/Flywheels/Conduction Flywheel Protocol]] before Vault handoff.
- Experiments: if concluded, update status and ensure log is complete.
- Intake items: if resolved, mark complete/archived and remove from active queues.
- Transcripts/Coaching Sessions: route or archive only via [[Council Chamber/Protocols/Inbox/Transcript Inbox Protocol]] and with approval.
- Superseded governance protocols/templates: propose archival with breadcrumbs to active replacements.
- Approval gate: obtain Sovereign approval before any archival, status change or plan updates.
- Record reconciliation proposals and approval status in the session log.

## Continuity Notes
- Add 1-3 lightweight process improvements to [[Council Chamber/AI Interface/Continuity Log]].
- Review active continuity items and propose resolution candidates for approval.







