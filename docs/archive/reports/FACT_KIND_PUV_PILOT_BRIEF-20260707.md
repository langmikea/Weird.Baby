# COWORK BRIEF — `fact` Kind + PUV Pilot (EXECUTES — changes live MV data)
**ID:** FACT_KIND_PUV_PILOT-20260707 · **Status:** READY · **Authority:** PUV_FACT_MODEL_SPEC.md (committed, locked) + MV vocab migration run log (2026-07-06/07) deferred-items list + kind-governance-spec.md. Where this brief and the spec disagree, THE SPEC WINS — flag the conflict, don't improvise.

## Prerequisite — SATISFIED
Vocabulary reconciliation complete (2026-07-06/07 run). The spec's hard gate is open. Verify this claim against the run log in Stage 1 before any write.

## Hard rules (unchanged, non-negotiable)
- Stage 0 backup MANDATORY; verify readable before Stage 1.
- ALL mediavault.sqlite writes are HOST-SIDE PowerShell (virtiofs/FUSE cannot do SQLite journaled writes). Cowork writes scripts; Mike runs them; paste-back verifies.
- Commits host-side (index.lock hazard). Commit gate every stage: status + hash.
- One stage at a time; explicit "pass" from Mike at each gate — a word, not an inference.

## Stage 0 — Backup
Dated backup of mediavault.sqlite alongside the migration-run backup. Verify readable (open + row count). Commit nothing yet; record path in run log.

## Stage 1 — Read + reconcile authorities (read-only)
Read the spec, the migration run log (esp. deferred items), kind-governance-spec. Produce a short written delta: exact current kind CHECK set, exactly what the rebuild adds (`fact` + ONLY other changes the deferred list explicitly names — no re-litigation), and the spec's fact-artifact shape (tags, sourcing breadcrumb, attachment model). GATE: Mike reads the delta, says pass.

## Stage 2 — Table rebuild (host-side)
SQLite CHECK constraints don't ALTER: new table with expanded kind set → copy → integrity check (row counts, FK/index parity, PRAGMA integrity_check) → swap → re-verify. Script it as ONE reviewed host-side script with verification output at every step. GATE: paste-back verified, Mike passes.

## Stage 3 — Register + regenerate
Register `fact` in the vocabulary registry (usage_count 0, honest). Regenerate tag_vocabulary.json + client vocabulary.json from DB per the migration's established pattern. Commit gate.

## Stage 4 — Pilot facts (the proof)
Author 3–5 real facts as MV artifacts per spec — suggested seed set from verified session knowledge: Nick Root died 2021 (promo bios say 2020 — this fact EXISTS to correct the record, sourcing breadcrumb mandatory); RWTH is a confirmed band, Manheim PA; lineage SEEDS → RWTH → Medusa's Disco → solo. CONTENT AND WORDING ARE MIKE'S (voice = UX): draft them, present at the gate, he edits/approves before insert. Attach via tags at the levels the spec defines. Insert host-side. Verify queryable.

## Stage 5 — Export + client sanity
MV server running → `npm run export-artifacts` → verify facts present in hunter_root.json and vocabulary carries `fact`. Client must NOT break on the new kind: verify the filter board + exhibit render unregressed with facts present-but-undisplayed. NO display UI in this brief — if display turns out to be forced (client errors on unknown kind), smallest possible guard, flagged loudly.

## Stage 6 — Close
Deploy only if client artifacts changed (dist clean-remove first, wrangler 4.81.1). STATE.md updated (LIVE + this ID + fact count). Run log committed. Session-close check clean.

## Rider — AFTER Stage 3, its own commit
`instrument:harmonica` facet: add to vocabulary IF the migration didn't already; confirm exact scope with Mike at that gate (which artifacts get tagged is his call). Skip silently if already done.

## Out of scope (recorded)
Fact display UI (Pop Up Video UX — separate workstream, Mike-led design) · mass fact ingestion beyond the pilot · press-batch facts (gated behind derived-era re-wire) · any vocabulary change not named here or in the deferred list.
