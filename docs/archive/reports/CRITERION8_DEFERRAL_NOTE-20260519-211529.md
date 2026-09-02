# Criterion 8 — Deferral Note

**Date:** 2026-05-19
**Criterion:** v2.1-target §12.8 / §5.2 — demote the legacy `tags` table to a
per-value usage-count cache (drop `category`, `is_proposed`, `is_exclusive`,
`description`; refresh from `artifacts.tags`).
**Status:** **CLOSED (2026-05-20).** Resolved by Phase 2.5 of the
source-of-truth refactor (MV commit `fa45ca8`). The §5.2 demotion landed:
`tags` table reduced to 4 columns (`slug` PRIMARY KEY, `display_name`,
`usage_count`, `created_at`); registry-era columns dropped; cache parity
preserved (69 rows, SUM(usage_count)=453). §12 Criterion 8 is closed;
§12 reads 8 of 8 complete. The historical content below documents the
deferral period (2026-05-19 through 2026-05-20) and remains as a
record of why the work was paused before being unblocked by the
single-source-of-truth scoping (Decision Brief Parked-items,
2026-05-19).

---

### Original deferral content (preserved as record)

**Status (original):** **DEFERRED-BY-POLICY** — not started, blocked on the
single-source-of-truth scoping work recorded in the Decision Brief's
Parked-items section (2026-05-19).

## Why deferred

A read-only audit (`_tmp_c8_audit.py`, 2026-05-19) established that the legacy
`tags` table is load-bearing for MV's running code — not the
vestigial-registry §5.2 assumes. Findings:

- **~30 call sites** read or write the `tags` table across `imgserver.py`,
  `imgserver_extensions.py`, `ingest_engine.py`, and `artifact_tags.py`.
- The columns §5.2 names for drop (`category`, `is_proposed`, `is_exclusive`,
  `description`) are read by multiple paths:
  - `imgserver.py:389` — `SELECT * FROM tags` (tag-list endpoint)
  - `imgserver.py:732` — `display_name, category` (autocomplete)
  - `imgserver.py:1239-1438` — Vocab Admin sweeps (rename/merge/delete/edit),
    which depend on all four registry-era columns
  - `ingest_engine.py:115` — INSERT writes `category`/`is_proposed`/
    `is_exclusive` during intake
  - `imgserver_extensions.py:373` — INSERT writes the same during YT
    registration
- Data state: `tags` table holds 84 rows; live `artifacts.tags` has 69
  distinct slugs. The 15-row gap is stale entries from pre-Criterion-1
  bare-slug content.

Dropping those columns as §5.2 specifies, without first re-pointing the
~30 call sites at a different source, would break the Vocab Admin UI,
tag autocomplete, the tag-list endpoint, and intake registration. That
is not what §5.2 intends.

## The pattern

This is the same drift surfaced in Criteria 5, 6, and 7 — a definition
(here: namespace/tier metadata via `tags.category`) lives in multiple
places. The Decision Brief's Parked-items entry from 2026-05-19
("single-source-of-truth policy") explicitly named this class of work as
its own scoped item, separate from any single criterion's close-out.

Criterion 8 demotion is **one of that work item's dependents.** Cleanly
demoting the `tags` table to a usage-count cache requires:

1. Choosing the canonical source for tag-namespace/tier metadata (the
   `vocabulary` registry built by Criterion 4 is the standing candidate).
2. Re-pointing every reader of `tags.category` (and the other dropped
   columns) at that canonical source.
3. Resolving what happens to the Vocab Admin UI flows that depended on
   `is_proposed` — one-stage vocabulary (§2.5) already retired that
   workflow conceptually; the code hasn't caught up.
4. Reconciling the 15-row stale entries (drop the bare-slug residue;
   leave the rest matched 1:1 with `artifacts.tags` slugs).
5. Then, and only then, the actual schema operation §5.2 describes.

## What unblocks Criterion 8

The single-source-of-truth refactor — scoped, planned, and at least
partially executed (specifically: the readers of `tags.category` re-pointed
at the `vocabulary` registry). Once those readers no longer depend on the
columns §5.2 drops, the actual schema operation is small and matches the
shape of Criterion 5 (well-bounded, doc-clean).

Until then, treat §12 as **7 of 8 complete with Criterion 8 paused**, and
treat the legacy `tags` table as-it-is: load-bearing, internally
inconsistent with v2.1-target's vocabulary model, scheduled for cleanup
under the source-of-truth work item.

## Audit script

`_tmp_c8_audit.py` (quarantined to `D:\AI_OK_TO_DELETE\` after close-out)
produced the findings above. Re-runnable read-only if a future session
wants to confirm state before starting the unblock work.

## Scope held

No code changes. No schema changes. No tag writes. The `tags` table is
untouched. This note records a non-action.
