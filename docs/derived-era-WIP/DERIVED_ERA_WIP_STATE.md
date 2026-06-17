# Derived-Era v0.2 — WIP State Note

**Written:** 2026-06-17 · **Status:** PARKED, proven-but-not-surfaced · **Repo HEAD at park:** d395496

This folder holds the validated derived-era implementation. The data model is PROVEN CORRECT but NOT wired into the client. The build was reverted to known-good after the client render failed and the slider was found to be built to the wrong spec. Read this before resuming so nothing here is re-derived from scratch.

---

## What is DONE and PROVEN (do not redo)

- The data model works. Pre-test against live MV passed both hard proofs:
  - Correctness: derive-at-shallow reproduced all 37 hand-applied era: tags, 0 mismatches.
  - rwth fold: all 15 era:rwth -> Early Days (14 via run_with_the_hunt->2016 album-reference fallback).
  - Underivable leaves: 0 (not the spec's stale "2" — the 6/11-6/12 track ingestion gave every bare leaf an album reference; live data supersedes the spec number).
  - Histogram: 389 weights, 70 distinct values, range 0.77-2.00. Healthy spread; the 2.0 pile is the publish anchor by design.
- Live MV carries the referenced_dates column (nullable TEXT, all rows NULL, integrity ok, backed up). Applied host-side via Python sqlite3. Do NOT re-migrate — it is already there.
- v0.2 spec is committed and pushed at d395496: docs/derived-era-spec_v0.2.docx (authority) + .md (parse) + docs/DERIVED_ERA_REPORT-20260616.md.

## What is PARKED here (the implementation, intact)

- era-derivation.mjs — Export-side: computes the weighted date-set per leaf (publish anchor + referenced dates, centrality-weighted). Tunable constants.
- hr_era.js — Client-side: maps a record's dates -> era bucket slugs at a given cutoff. The dates->buckets logic.
- era-config.json — Reference-date registry: year anchors per album/event/etc. (root-level at build time).
- era-buckets.json — The 5 locked buckets (date-range -> label). Belongs under src/data/ when live.
- era-pretest.mjs — Harness that ran the proofs via node:sqlite against live MV. Re-runnable.
- migrate-referenced-dates.mjs — The schema migration (ALREADY APPLIED — keep for reference, do not re-run blindly).
- DERIVED_ERA_PRETEST_REPORT-20260617.md — Full proof output.
- derived-era-pretest-preview.json — Per-leaf derived-era preview.
- hunter_root.dated-preview.json — A hunter_root.json with dates baked — the export output, for reference.

## What was DROPPED and WHY

- The era-depth slider — built to the wrong spec. It was specced as "how many eras an artifact belongs to." Mike's actual intent: a PROXIMITY/APPLICABILITY filter — include/exclude artifacts by how well they match the WHOLE active filter set, deep-to-shallow. Different instrument. Do NOT resurrect the era-depth slider; respec the proximity filter as its own workstream.
- The client render edits to HrExhibitFlow.jsx / .css — reverted. They left the Era column dark (legacy tags stripped from the json, client not refilling them) and carried the wrong slider. Reverted to HEAD.

## ENVIRONMENT LESSON (the cause of the failure — heed this)

The Cowork FUSE mount VIOLATED the standing host-only rule and delivered silently-broken files: it truncated export-artifacts.mjs and HrExhibitFlow.jsx on the way to disk and did not reliably land the MV migration. The DATA work survived because it was validated against real code paths and the schema/configs were independently re-verifiable host-side. The CLIENT work did not, because it was never rendered on the host and the mount corrupted the wiring.

Next session, hard rule: all client edits go through host-side PowerShell. Nothing is "done" until it renders on Mike's machine.

## HOW TO RESUME (the corrected plan)

1. Move the parked files back to their live locations (era-derivation.mjs, era-pretest.mjs, migrate-referenced-dates.mjs -> tools/; hr_era.js -> src/routes/hr/; era-config.json -> root; era-buckets.json -> src/data/).
2. Re-apply the export edits HOST-SIDE (PowerShell heredoc, per repo rule) — bake dates, strip legacy era label. Logic is in era-derivation.mjs.
3. Wire hr_era.js into the client so era derives at a FIXED DEFAULT DEPTH — NO slider. Era pills must populate from derived tags.era. Verify the Era column lights up with real counts on a host render.
4. Re-run era-pretest.mjs against live MV to confirm proofs still hold.
5. Render on host, exercise the Era facet (not a slider — just the facet), confirm it works, THEN deploy.
6. The proximity/applicability slider is a SEPARATE, later, freshly-scoped workstream. Not part of the derived-era re-wire.

## Truth ranking reminder
Live tree > git > docs > chat. When resuming, re-verify the live MV schema and the live client code before trusting this note — it was accurate at d395496 on 2026-06-17 but the tree is the authority.
