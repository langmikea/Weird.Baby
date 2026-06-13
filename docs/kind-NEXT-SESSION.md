# Kind — Next-Session Orientation

Orientation for the next Claude picking up Kind work. Read this first, then
`docs/kind-governance-spec.md`.

## Status: spec is COMPLETE

The Kind governance spec is **complete and committed** at `8c5d1bc`
(`docs/kind-governance-spec.md`). The two open design questions are resolved:

- **Labels resolved** — display labels are settled (see below).
- **Single-select chosen** — one Kind per artifact. Multi-Kind is a logged
  future migration (spec §5a), not a config flag or toggle.

No further design work is needed on the spec. What remains is **host-side
execution** — Mike runs these; this session does not.

## Confirmed Kind display labels (slug → display)

| slug          | display        |
|---------------|----------------|
| performance   | Performance    |
| release       | Music          |
| announcement  | Announcement   |
| studio        | In the Studio  |
| candid        | Off Stage      |

Reserved for inflow (defined, not yet populated): `interview`, `fan`.

## Remaining host-side operations (in order)

Three operations remain. Do each as its own future session. Order matters for
the first two (DDL before backfill); the third can run anytime.

### 1. Schema DDL — add the `kind` column + `CHECK` (spec §2)

Add the `kind` column with a `CHECK` constraint to MediaVault, mirroring the
existing `media_type` pattern.

**Constraint:** the column is **nullable** — containers are exempt from Kind.
The `CHECK` enforces the closed 7-value set (5 active + 2 reserved). Leaf-level
**required-non-null is enforced at ingest** (spec §3), **not** as a `NOT NULL`
on the column.

**Sequencing:** this must run **before** the backfill — the column has to exist
before anything can be written into it.

### 2. The 280 backfill — seed/curate Kind on leaf artifacts (spec §4)

Seed and curate Kind across the 211 leaf artifacts. The 69 containers are
**exempt** (no Kind). This is the retag pass.

- **~88 mechanically seedable:**
  - 79 bandcamp → **Music** (`release`)
  - 9 live → **Performance** (`performance`)
- **~123 need curation** — Mike's editorial calls, one by one.

**Key constraint — do NOT trust bandcamp `content_kind`.** The bandcamp
`content_kind` data is dirty: it reads `studio`, which is misleading. Bandcamp
items are **Music**, regardless of what `content_kind` says. Ignore the field;
seed by source, not by `content_kind`.

### 3. `CANONICAL_VOCABULARY.md` demotion (spec §5 supersession)

`docs/CANONICAL_VOCABULARY.md` still self-declares authoritative over the
**retired tier model**. Mark it **superseded by the Kind spec** so the next
Claude doesn't orient to the dead model.

**Constraint:** none on sequencing — this can run anytime, independent of the
DDL and backfill.

## One-line reminders

- Single-select is final; multi-Kind = logged migration (spec §5a), not a toggle.
- Containers (69) are exempt at every layer; leaves (211) carry Kind.
- Commit host-side only — Mike commits.
