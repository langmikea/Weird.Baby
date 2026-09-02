# COWORK BRIEF — Press Batch Ingestion + Fact Extraction (EXECUTES — MV writes)
**ID:** PRESS_BATCH_INGEST-20260707 · **Status:** READY (gate cleared: derived-era SHIPPED 2026-07-07) · **Authority:** docs/PRESS_INGESTION_SCOPING_FINDINGS-202606*.md (the 16-URL list + per-URL findings) > canonical ingest pattern (MV-20260617 batch, docs/ingest-log.md) > PUV_FACT_MODEL_SPEC.md + FACTSCROLLER_SPEC_v1.0.md (fact extraction) > this brief.

## Hard rules
- Stage 0 MV backup, verified readable, before any write.
- ALL MV writes host-side (virtiofs/SQLite). Cowork drafts, Mike runs, paste-back verifies. Commits host-side, commit gate every stage.
- One stage at a time, explicit "pass" per gate. Delegation split per standing arrangement: verification gates delegated; curation/wording/release gates are MIKE'S.
- Facts created here are VAULT-STATUS (hidden) per Mike's standing ruling — no fact reaches visitors until FactScroller display ships.

## Stage 0 — Backup. Verify. Record.

## Stage 1 — Ground-truth the scoping findings (read-only)
Read the scoping findings + ingest-log. Verify each of the 16 URLs is still reachable (fetch headers/content now — link rot check; findings are ~3 weeks old). Delta: per-URL status (live/moved/dead), proposed Kind per artifact (press vs interview per the activated Kind set), proposed tags (band/album/era/topic/source per reconciled vocabulary), anything requiring a NEW vocabulary value (controlled expansion is authorized but each addition is named and Mike-gated — no silent vocab growth). GATE: delta to Mike — this is a CURATION gate, his call per artifact.

## Stage 2 — Artifact ingestion (host-side)
Ingest approved artifacts per the canonical pattern (IDs continue MV-2026 sequence; provenance + source breadcrumbs mandatory). Release status per artifact = Mike's Stage 1 ruling (default: vault, release on his word). Verify counts, tags, registry deltas. Commit gate.

## Stage 3 — Fact extraction (the factory's first run)
From ingested press: extract candidate facts + reviewer quotes as `fact` Kind artifacts per PUV model — quote text verbatim-short, attribution + URL in sourcing breadcrumb, tags attach at the levels the content supports (album/song/band/era/topic). Target honest volume, not padding: every fact defensible from its source. Present the FULL candidate list to Mike with proposed wording — WORDING GATE, his pen, batch-editable. Insert approved set host-side, vault-status. Commit gate.

## Stage 4 — Export + close
Export; verify press/interview artifacts surface correctly (released ones only), facts remain hidden, filter board unregressed (press + interview facets appear per activated Kinds). Deploy only if client artifacts changed. STATE.md: SHIPPED block, content-expansion gate progress noted. Run log. Session-close clean.

## Feeds
FactScroller Sequencing C (this run fills the vault) · "Arkansas reviews" recipe card becomes buildable · interview Kind gets its first real inhabitants.

## Out of scope
FactScroller display/plumbing (next brief) · recipe-card shape · FB harvest (separate session per standing decision) · any vocab addition not surfaced and approved at Stage 1.
