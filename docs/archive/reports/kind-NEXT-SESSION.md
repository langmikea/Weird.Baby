# Kind — Next-Session Orientation

> **READ `docs/canonical/OPERATIONS.md` FIRST** — it is the cross-session
> operating manual (process authority: roles, the carry model, the three
> surfaces). Then `docs/canonical/START_HERE.md`. Only then this note.

Orientation for the next Claude picking up Kind work. Read this first, then
`docs/kind-governance-spec.md`.

## Status: DDL + backfill COMPLETE — one operation remains

The Kind governance spec is **complete and committed** at `8c5d1bc`
(`docs/kind-governance-spec.md`). Design is settled: labels resolved,
single-select chosen (multi-Kind is a logged future migration, spec §5a).

Execution status (host-side, against MediaVault at
`C:\AI\Platform\MediaVault\core\mediavault.sqlite` — its own git repo, the
`.sqlite` is gitignored so DB changes are NOT in version control; durability is
the live file + timestamped backups in `core/`):

- **DONE — Schema DDL.** `kind` column added, nullable, with
  `CHECK(kind IN (performance,release,announcement,studio,candid,interview,fan))`.
  Vocabulary registered in `core/tag_vocabulary.json` (committed, MediaVault repo).
- **DONE — Backfill.** 146 leaves assigned, 65 leaves left NULL, 69 containers
  exempt. Distribution: release 107, performance 19, candid 13, announcement 5,
  studio 2. Verified host-side (integrity_check ok, CHECK fail-loud confirmed).
  Pre-write backup: `core/mediavault.sqlite.bak-WRITE-20260614T012458Z`.
- **REMAINING — `CANONICAL_VOCABULARY.md` demotion** (see below).

## Confirmed Kind display labels (slug → display)

| slug          | display        |
|---------------|----------------|
| performance   | Performance    |
| release       | Music          |
| announcement  | Announcement   |
| studio        | In the Studio  |
| candid        | Off Stage      |

Reserved for inflow (defined, not yet populated): `interview`, `fan`.

## The one remaining operation

### `CANONICAL_VOCABULARY.md` demotion (spec §5 supersession)

`docs/CANONICAL_VOCABULARY.md` still self-declares authoritative over the
**retired tier model**. Mark it **superseded by the Kind spec** so the next
Claude doesn't orient to the dead model. No sequencing constraint — independent.

## Backfill notes (for the record)

- Bandcamp `content_kind` is dirty (reads `studio` uniformly); was ignored —
  79 bandcamp seeded to Music by source, not by `content_kind`.
- 56 derived leaves (thumbnail/transcript, all parented) were exempted like
  containers — a logged extension of the §2 container-exemption principle.
- 9 no-fit leaves left NULL (empty rows, ReverbNation profile/lyric captures).

## One-line reminders

- Single-select is final; multi-Kind = logged migration (spec §5a), not a toggle.
- Containers (69) exempt at every layer; leaves carry Kind (146 set, 65 NULL).
- Commit host-side only — Mike commits.
