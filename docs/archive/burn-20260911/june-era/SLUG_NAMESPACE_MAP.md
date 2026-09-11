# Slug -> Namespace Map

**Status:** Authored by operator (Mike) with Project Software Ops, 2026-05-18.
**Purpose:** Satisfies DATA_ARCHITECTURE_SPEC_v2.1-target.md §12 Criterion 0.
Pairs every distinct tag slug in live `artifacts.tags` with its target namespace.

**Coverage:** 62/62 live slugs (100%). 15 mapped to visitor-facing groups; 47 to reserved `unsorted:`.

Source of slug list: read-only pull of `artifacts.tags` from `mediavault.sqlite`, 2026-05-18 (85 artifacts, 80 tagged).

## Map

| Slug | Namespace | Visitor-facing tab |
|---|---|---|
| `arkansas` | `album` | ARTIST |
| `medusas_disco` | `album` | ARTIST |
| `run_with_the_hunt` | `album` | ARTIST |
| `hunter_root` | `people` | ARTIST |
| `nick_root` | `people` | ARTIST |
| `reverend` | `song` | ARTIST |
| `2023` | `year` | ARTIST |
| `distrokid` | `source` | MEDIA |
| `instagram` | `source` | MEDIA |
| `reverbnation` | `source` | MEDIA |
| `tiktok` | `source` | MEDIA |
| `audio` | `type` | MEDIA |
| `mp3` | `type` | MEDIA |
| `poster` | `type` | MEDIA |
| `video` | `type` | MEDIA |
| `advance_tickets` | `unsorted` | DEEP DIVE (unsorted) |
| `artist_message` | `unsorted` | DEEP DIVE (unsorted) |
| `artist_page` | `unsorted` | DEEP DIVE (unsorted) |
| `band` | `unsorted` | DEEP DIVE (unsorted) |
| `common` | `unsorted` | DEEP DIVE (unsorted) |
| `defiant` | `unsorted` | DEEP DIVE (unsorted) |
| `digital` | `unsorted` | DEEP DIVE (unsorted) |
| `early_stages` | `unsorted` | DEEP DIVE (unsorted) |
| `early_version` | `unsorted` | DEEP DIVE (unsorted) |
| `event_listing` | `unsorted` | DEEP DIVE (unsorted) |
| `fall_tour` | `unsorted` | DEEP DIVE (unsorted) |
| `family` | `unsorted` | DEEP DIVE (unsorted) |
| `fan` | `unsorted` | DEEP DIVE (unsorted) |
| `fan_cover_song` | `unsorted` | DEEP DIVE (unsorted) |
| `gear` | `unsorted` | DEEP DIVE (unsorted) |
| `hacked_account` | `unsorted` | DEEP DIVE (unsorted) |
| `indieartist` | `unsorted` | DEEP DIVE (unsorted) |
| `instagram_hacked` | `unsorted` | DEEP DIVE (unsorted) |
| `lancaster_pa` | `unsorted` | DEEP DIVE (unsorted) |
| `live_show` | `unsorted` | DEEP DIVE (unsorted) |
| `loss` | `unsorted` | DEEP DIVE (unsorted) |
| `lyme_disease` | `unsorted` | DEEP DIVE (unsorted) |
| `mental_health` | `unsorted` | DEEP DIVE (unsorted) |
| `merch` | `unsorted` | DEEP DIVE (unsorted) |
| `milestone` | `unsorted` | DEEP DIVE (unsorted) |
| `music-video` | `unsorted` | DEEP DIVE (unsorted) |
| `new_music` | `unsorted` | DEEP DIVE (unsorted) |
| `new_song` | `unsorted` | DEEP DIVE (unsorted) |
| `notable` | `unsorted` | DEEP DIVE (unsorted) |
| `official` | `unsorted` | DEEP DIVE (unsorted) |
| `personal` | `unsorted` | DEEP DIVE (unsorted) |
| `pre_release` | `unsorted` | DEEP DIVE (unsorted) |
| `promotional_post` | `unsorted` | DEEP DIVE (unsorted) |
| `rare` | `unsorted` | DEEP DIVE (unsorted) |
| `rehearsal` | `unsorted` | DEEP DIVE (unsorted) |
| `released` | `unsorted` | DEEP DIVE (unsorted) |
| `snarky` | `unsorted` | DEEP DIVE (unsorted) |
| `social` | `unsorted` | DEEP DIVE (unsorted) |
| `solo` | `unsorted` | DEEP DIVE (unsorted) |
| `song_page` | `unsorted` | DEEP DIVE (unsorted) |
| `songwriting` | `unsorted` | DEEP DIVE (unsorted) |
| `songwriting_process` | `unsorted` | DEEP DIVE (unsorted) |
| `ticketing` | `unsorted` | DEEP DIVE (unsorted) |
| `tour` | `unsorted` | DEEP DIVE (unsorted) |
| `tour_announcement` | `unsorted` | DEEP DIVE (unsorted) |
| `tribute` | `unsorted` | DEEP DIVE (unsorted) |
| `unique` | `unsorted` | DEEP DIVE (unsorted) |

## Notes

- `unsorted:` is the reserved fallback namespace (v2.1-target §3.5).
  These tags stay attached to their artifacts; nothing is lost. They produce
  no visitor-facing filter group. The DEEP DIVE tab launches empty and is
  populated later by deliberate operator curation.
- `unsorted:` values are listed in the BUILD migration run report (§12.1).
- `music-video` retains its hyphen as a value; per §3.1 a hyphen is legal in a
  value, never in a namespace. It maps to `unsorted:` per operator decision.
