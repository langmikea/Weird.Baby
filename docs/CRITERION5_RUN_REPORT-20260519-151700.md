# Criterion 5 Run Report — SPEC.md lifecycle correction

**Date:** 2026-05-19
**Criterion:** v2.1-target §12.5 / §5.3 — correct MV's `SPEC.md` lifecycle
section to the four-state model, removing the proposed `deleted` status.
**Status:** COMPLETE.

## What this was

MV's `SPEC.md` described the artifact lifecycle two ways the running code
never implemented: a nullable `archived_at` timestamp orthogonal to
`status`, and a phantom `deleted` status value. The live system has
neither — `/api/artifact-archive` sets `status='archived'`, the live
CHECK constraint is `('inbox','vault','released','archived')`, and the
`archived_at` column (added v0.5.1 to satisfy a museum-side reader) is
written and read by nothing. Criterion 5 corrects the spec to match the
code.

## Investigation before edit

A read-only investigation established why the drift existed and which
direction to correct it:

- The v0.5 refactor (2026-04-19) decided archive should be a timestamp;
  the running code was never migrated to match. The gap was caught twice
  in `_cowork/` reviews and deferred to a "v0.7 punchlist" each time.
- v0.5.1 added the `archived_at` column purely to silence a museum-side
  export diagnostic; the CHANGELOG entry explicitly deferred reconciling
  the status enum.
- Reader audit: no MV-side code reads or writes `archived_at`. One
  museum-side reader (`export-artifacts.mjs`) filters on it, but the
  filter is a tautology today and its real effect comes from the
  `status='released'` clause beside it.

**Path A (spec follows code) vs Path B (build the `archived_at`
mechanism):** Path A chosen. Path A is doc-only. Path B would reverse the
2026-05-14 Stance-B decision and modify a running v0.5.2 system, with a
backfill question for the one existing `status='archived'` row. The
work/risk asymmetry settled it.

## What ran

- **Apply script:** `_apply_criterion5.py` — 10 string-replacement edits
  to `SPEC.md`, each verified to match exactly once before any write.
- **Pre-write backup:** `SPEC.md.pre-criterion5-20260519-151254`

## The 10 edits (all `SPEC.md`, doc-only, no code or schema change)

1. v0.5 reconciliation preamble — drop the `archived_at`-is-canonical claim.
2. §4.1 — rewritten to `status='archived'`; historical note retiring
   `archived_at` with its full provenance.
3. §6 status comment — `inbox|vault|released|deleted` → `...|archived`.
4. §6 schema — `archived_at` column annotated "retired; present, never
   written/read".
5. §8.1 — vault default filter drops the dead `archived_at IS NULL` clause.
6. §8.2 — "Show archived" toggle re-keyed to `status='archived'`.
7. §10 Lifecycle row — enum corrected; archive described as a status value.
8. §10 Archive row — rewritten to `status='archived'`.
9. §12.2 — migration step keeps its historical record; pointer to §4.1 added.
10. §14 Hard Rules — "Archive is `archived_at IS NOT NULL`" → `status='archived'`.

## Verification

Post-edit grep of `SPEC.md`:
- `deleted` as a status value: 0 occurrences.
- `archived_at`: 5 occurrences, all in retired/historical context (the
  §4.1 note, the §6 annotation, the §12.2 history pointer).
- `archived` as a status value: present in §4.1, §6, §8.2, §10, §14.

## Scope held

Only `SPEC.md` was edited (plus a `CHANGELOG.md` entry). No code, no
schema, no DB. The other two Phase-2 drifts (`is_proposed` column,
composite slug uniqueness) were not touched.

## Follow-ups logged (not Criterion 5, not actioned)

- `STATUS_ENUM` in `core/imgserver_extensions.py` still lists both
  `archived` and `deleted` — a third copy of the enum, in running code.
- `handle_artifact_delete` hard-deletes a DB row (`DELETE FROM
  artifacts`) — worth checking against §14's no-hard-delete rule.
- `PROJECT.md`, `STATE.md`, `WORKFLOW.md` repeat the retired
  `archived_at` claim and need a doc pass.
