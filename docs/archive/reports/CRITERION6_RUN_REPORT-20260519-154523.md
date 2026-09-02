# Criterion 6 Run Report — exhibit badging + real export

**Date:** 2026-05-19
**Criterion:** v2.1-target §12.6 — released artifacts carry `exhibit:` tags;
`npm run export-artifacts` produces per-exhibit JSON with real records.
**Status:** COMPLETE on outcomes. One open item carried forward (see below).

## What ran

- **Badging:** 17 released artifacts given `exhibit:hunter_root`.
- **Export:** `tools/export-artifacts.mjs` — wrote `src/data/exhibits/hunter_root.json`.
- **Build:** `npm run build` — site builds from the exported JSON.

## Outcomes — met

- **17 of 19 released artifacts** carry `exhibit:hunter_root`. The two
  not badged are operator-decided exclusions (below), not gaps.
- **Export produces real records.** `hunter_root.json`: 17 artifact
  records, 12,950 bytes, valid JSON, metadata block present
  (`exported_at`, filter `released, not archived, badged for this exhibit`).
  Verified by direct parse.
- **Site builds clean.** `npm run build` — both environments transformed,
  `dist/` written, no errors.

## Method — recorded honestly

Badging was done via 17 scripted `POST /api/artifact-update` calls
(read current tags, append `exhibit:hunter_root`, write the merged set).

This is **not** the "via the MV Inbox" path that §12.6 and §4.5 describe.
This was **not a deliberate deviation** — the spec's "via the MV Inbox"
wording was not checked against the method until session close-out. It
is recorded here as what it was: an unflagged divergence of method,
caught at the end of the work, not chosen.

**Why the outcome still stands.** `/api/artifact-update` routes through
`write_artifact_tags` — the §4.5 single coordinated writer (the
`core/artifact_tags.py` routine landed by Criterion 3). The
single-writer guarantee is intact; the §4.5.1(b) grep-check is
unaffected. The divergence is one of *method* (scripted calls vs.
operator-in-the-Inbox), not of *correctness*. All 17 tag writes are
namespaced, validated, and committed through the one legitimate writer.

## OPEN ITEM — operator decision required

§4.5 / §12.6 say `exhibit:` badging is done "via the MV Inbox." Criterion
6 badged via scripted `/api/artifact-update` instead. Both paths use the
same §4.5 single writer, so both are correctness-compliant — but the spec
names only one. This is unresolved and is **not** resolved by this report:

- **(a)** the spec wording is too narrow — widen §4.5/§12.6 to "any §4.5
  single-writer path," ratifying scripted badging; or
- **(b)** badging is deliberately Inbox-only — scripted badging should not
  recur, and future badging goes through the Inbox UI.

This needs an operator decision. Until made, treat scripted badging as
done-but-not-blessed.

## Operator-decided exclusions

Two released artifacts were left unbadged by explicit per-artifact
operator decision during this session — decisions, not omissions:

- **`MV-20260419-001`** — "Hunter Root acoustic solo set, Harrisburg PA."
  Real content, but `source_url` is empty. Operator chose to leave it
  until the URL is added.
- **`MV-20260419-004`** — no URL, no description, no tags. Operator chose
  to leave it in place and manage it later.

## Observations — not Criterion 6, not actioned

- The 15 `MV-HR-*` artifacts each carry both `type:audio` and `type:mp3`
  — two values in the `type:` namespace. May be intended; flagged for a
  possible curation review.
- The `build-deep-tags-vocabulary` prebuild hook still sources the
  6-row legacy `deep-dive-vocabulary.csv`; the deep-dive vocabulary is
  not yet derived from the newly-exported artifacts. Separate from §12.6.

## Scope held

`artifacts.tags` was the only DB column written, via the §4.5 writer
only. No schema change. No code change. Export and build are existing
tooling, run as-is.
