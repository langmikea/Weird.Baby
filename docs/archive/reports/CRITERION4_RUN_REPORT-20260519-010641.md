# Criterion 4 Run Report — vocabulary registry regeneration

**Date:** 2026-05-19
**Criterion:** v2.1-target §12.4 — regenerate the `vocabulary` table from a
named build step; confirm every namespace in live `artifacts.tags` has a
registry row.
**Status:** COMPLETE.

## What ran

- **Named build step:** `tools/build-vocabulary-registry.py`
- **Verification check:** `tools/check-vocabulary-registry.py`
- **Pre-write MV backup:** `core\backups\mediavault.pre-criterion4-20260519-010641.sqlite`

## Schema change

The live `vocabulary` table (10 columns: id/kind/slug/display_name/tier/
namespace_id/sort_order/retired_at/created_at/updated_at, 3 indexes, 92 rows
of abandoned seed data) was DROPPED and replaced with the §5.4 namespace-only
target: `namespace` PK, `display_name`, `tier`, `sort_order`,
`retired_at`. This is the structural replacement §5.4 specifies — a
DROP + CREATE + re-seed, not an in-place edit.

## Result — 14 rows

- **Tier 1 (canon, locked):** year, album, song, venue, people — visible.
- **Tier 2 (canon, locked):** source, type — visible.
- **Tier 3 (auto-discovered from live tags, all retired):** unsorted, author,
  platform, scope, artifact_kind, content_kind — sort_order by live hit count.
- **exhibit:** routing tag (§3.3), tier NULL, retired. Row present so the
  §12.4 check passes; not a pill column.

13 of 14 rows correspond to a live namespace. `venue` has zero live uses
and is included because the canon doc is the source of truth for Tier 1
membership, not the data.

## Verification

`check-vocabulary-registry.py`: 13 live namespaces, 14 registry rows,
0 missing. PASS. The check is checked in and re-runnable; it exits non-zero
on any namespace lacking a row.

## Decisions recorded

- **DEEP DIVE launches empty.** All six Tier 3 namespaces are marked
  `retired_at`, consistent with NAVIGATION.md ("DEEP DIVE tab will launch
  empty and be populated later by deliberate operator curation"). Operator
  promotes a namespace to visible by clearing `retired_at` during curation.
- **Tier 3 source.** CANONICAL_VOCABULARY.md defines Tier 3 as a dynamic
  rule, not a list, so it cannot enumerate Tier 3 namespaces. The build step
  auto-discovers them from live `artifacts.tags`. Operator decision,
  2026-05-19.
- **unsorted** (186 tag entries, the Criterion 1 migration residue) gets a
  registry row but is retired — not surfaced as a visitor pill.

## Note for future sessions

This build step contacts MV. It is therefore NOT the §0.5 prebuild hook
(`build-deep-tags-vocabulary.mjs`, which never contacts MV). It is an
operator-run maintenance step, closer in character to `export-artifacts`.
It is idempotent (`DROP TABLE IF EXISTS`) and safe to re-run when
`CANONICAL_VOCABULARY.md` changes.

## Scope held

Only the `vocabulary` table was touched. `artifacts`, the legacy `tags`
table, and all other tables are unchanged.
