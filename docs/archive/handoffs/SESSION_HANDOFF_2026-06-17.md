# Weird.Baby Museum — Session Handoff (2026-06-17)

Purpose: clean seed for a fresh chat. Supersedes SESSION_HANDOFF_2026-06-16. The 2026-06-16 handoff is now STALE — it describes derived-era and press ingestion as upcoming; derived-era was built/proven/parked and press never ran. Read THIS, not that.

## Operating model (unchanged)
- Claude = Ops (scoping, briefs, verification, sequencing). Never pushes/deploys/decides UX. Assumes-and-states on Ops calls.
- Mike = all UX-facing/UX-impactful decisions + all host execution (pwsh, git, deploy) + courier between Claude and Cowork.
- Cowork = repo+MV-connected agent surface; builds and PRE-TESTS before Mike renders. No push/deploy.
- Truth ranking — CODE FACTS: live tree > git > docs > chat. DECISIONS: Mike's current statement outranks any locked spec.
- Questions to Mike only when load-bearing AND undecidable by Claude AND UX-impactful: one at a time, plain bullet syntax. No guessing.

## Verified current state (live tree, end of 2026-06-17)
- Repo C:\AI\Projects\weird-baby-museum, branch main, HEAD bab797d == origin (pushed, in sync).
- Working tree clean (only pre-existing KEYSTONE_FIX_RENDER_CHECKLIST.md untracked). npm run build passes.
- Live MV carries a nullable referenced_dates TEXT column (all rows NULL, integrity ok, backed up). Verified present.
- The exhibit renders in its pre-build known-good state: Era facet populates from legacy hand-applied era: tags, no slider.

## What SHIPPED tonight (committed + pushed)
- d395496 — derived-era v0.2 spec (authority .docx + parse .md), DERIVED_ERA_REPORT-20260616.md, PRESS_INGESTION_SCOPING_FINDINGS-20260616.md.
- bab797d — the proven derived-era implementation, parked in docs/derived-era-WIP/ with a self-contained state note (DERIVED_ERA_WIP_STATE.md).

## What was BUILT, PROVEN, then PARKED (not live)
The derived-era / weighted-date model (v0.2) was fully built and pre-tested against live MV. Both hard proofs passed: correctness 37/37 hand-tags reproduced at shallow (0 mismatches); all 15 rwth -> Early Days; 0 underivable leaves; healthy weight histogram (70 distinct values, 0.77-2.00). The DATA MODEL WORKS.

It is NOT live on the client. The build was reverted to known-good because:
- The client render failed — Era column went dark (legacy tags stripped, client not refilling).
- The slider was built to the WRONG spec — specced as era-depth (how many eras an artifact is in); Mike's actual intent is a PROXIMITY/APPLICABILITY filter (include/exclude by how well an artifact matches the WHOLE active filter set). Different instrument.

ROOT CAUSE: the Cowork FUSE mount violated the standing host-only rule — it truncated export-artifacts.mjs and HrExhibitFlow.jsx on delivery and did not reliably land the MV migration. Data work survived (validated against real code paths, schema/configs independently re-verifiable host-side). Client work did not (never rendered on host, mount corrupted the wiring).

Everything needed to resume is in docs/derived-era-WIP/ — read DERIVED_ERA_WIP_STATE.md there first.

## Correct next sequence
1. RE-WIRE derived-era into the client, HOST-SIDE ONLY (pwsh heredoc, per repo rule — NOT through the Cowork mount). Era derives at a FIXED DEFAULT DEPTH, NO slider. Era pills must populate from derived tags.era. Render on host, confirm the Era facet lights up with real counts, THEN deploy. Logic + configs are in docs/derived-era-WIP/. The MV column is already applied.
2. THEN run the 16-URL press batch through the finished pipeline (captured in PRESS_INGESTION_SCOPING_FINDINGS-20260616.md; never ran tonight).
3. SEPARATELY, freshly scope the PROXIMITY/APPLICABILITY filter Mike actually wants — relevance across the active filter set, deep-to-shallow. NOT era-depth, NOT a salvage of what got built. Its own design pass.

## Hardened rule from tonight
All client edits go through host-side PowerShell. Nothing is "done" until it renders on Mike's machine. The mount cannot be trusted to deliver edits to this repo intact — this is the standing rule's whole reason, now demonstrated.

## Carried-forward state (still true)
- P2 filter live (pop-over + player-bar triggers); keystone matchFilter scoping fix shipped (f2eeea9).
- 16 press URLs captured, still waiting (now gated behind the derived-era client re-wire, step 1 above).
- Standing environment rules from prior handoffs all still apply (terminal resets to C:\Users\macun; MV closed for --apply writes, open for export; wrangler pinned 4.81.1; build/deploy separate; commits with explicit paths).
