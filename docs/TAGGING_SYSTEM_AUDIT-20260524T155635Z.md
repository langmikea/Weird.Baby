# Tagging System Audit — Scoping Brief

**Date:** 2026-05-24 (session ~15:30–?? UTC)
**Trigger:** Operator session after the v1B follow-on shipped
(`Hunter Root/_cowork/YT_FOLLOWON_V1B_RUN_REPORT-20260524T151812Z.md`).
Mike opened MV's inbox, tried to save the first of 38 v1-batch
YT cluster-roots, and hit eight findings in one sitting (recorded
verbatim in the session brief). The findings span the validator
(save blocked), the sidebar (layout / column / collapse), the tag
group order (mismatch with Museum tabs), per-value sort order
(albums chronological, songs by album/track), and the four-way
overlap between `type` / `format` / `content_kind` / `artifact_kind`.
The aggregate finding ("I am being used to pick out the crumbs")
is the trigger to do this end-to-end pass.
**Scope:** Scoping only. Read-only across the three repos. No code
changes, no DB writes, no vocabulary edits. The deliverable is this
brief. Operator decisions in §5 surfaced one at a time per GATE 5;
resolutions recorded in §9.
**Status:** SCOPING COMPLETE. §1–§4 + §7 drafted off live
code + live SQLite. §5's 8 operator decisions resolved in-session
per GATE 5 (resolutions in §9). §6 sequenced post-resolution.
Implementation green-lit.

---

## §0 — How to read this brief

Mirrors `docs/INGEST_BEHAVIOR_AUDIT-20260522-182616.md` structurally
(§0 prelude, §1 inventory, §2 cognitive frame, §3 findings mapped,
§4 architecture, §5 operator decisions, §6 roadmap, §7 out-of-scope,
§8 verification, §9 resolved decisions). Where the ingest audit
collected operator-locked rules inline, this brief collects them in
a dedicated §9 — Mike asked for the cleaner shape.

**Posture: the tagging system is one coherent system, not a
per-namespace catalog.** Each namespace is documented for its own
sake in §1, but the analytical work in §2–§4 treats the set as one.
The failure mode this brief is meant to prevent is fixing a
namespace at a time and discovering the conflicts only when they
surface in the inbox — exactly what triggered this session.

What's locked vs what's open:

- **LOCKED by V1B (`HR 3a215e9`, `MV 020c5bc`, `Museum aa3bb93`):**
  - `platform:` namespace retired; `source:youtube` is the canonical
    per-source pill.
  - Five revived tier-3 namespaces (`author`, `scope`, `content_kind`,
    `artifact_kind`, plus the now-retired `platform`) stay revived
    minus `platform`. Per Option A in
    `YT_VOCABULARY_ALIGNMENT-20260523T171458Z.md` §5.
  - YT cluster shape per `tools/youtube-ingest-schema.md` v1.1.
  - `type:video` added to every YT parent.
  - Album fidelity: SPINE title (not id) feeds `album:<slug>`.
  - 38 v1-batch YT cluster-roots are in MV's inbox awaiting triage
    (37 youtube + 1 other = 38 inboxed; the 1 "other" is a
    pre-existing inbox row, not from the v1 batch).
- **LOCKED by PHASEC §7.4 + §7.5:** operator-locked-rule pattern (cite
  rule + date in code comments at the point of decision) and re-read
  postures rule (scan briefs for posture statements before raising
  binary UX questions).
- **OPEN — §5 questions in this brief.** Eight enumerated. §5.1
  resolves the save-blocked validator bug; §5.2–§5.7 resolve the
  overlapping-namespace, sort-order, group-order, and collapse
  questions; §5.8 names the vocab-registration housekeeping for the
  three unregistered live namespaces (`era`, `format`, `release_type`).
- **NOT in scope (per §7):** vision-AI enrichment, semantic dedup,
  the album/cluster/thumbnail data-model question, HR repo index
  corruption, MV-067 SPINE drift, IG/TT/FB vocabulary additions.

Format-mirror note: the ingest audit shipped at 1250 lines; this
brief targets ~700. Comprehensive but not padded.

---

## §1 — Current state inventory

### 1.1 — Every namespace (MV's `vocabulary` table + live tag instances)

Read live from `core/mediavault.sqlite` at MV HEAD `020c5bc`. 14
rows in `vocabulary`; live tag instances cross-checked via
`json_each(artifacts.tags)` across all 178 artifacts.

| # | Namespace | Display | Tier | Sort | State | Instances | Distinct | Populated by |
|---|---|---|---|---|---|---|---|---|
| 1 | `year` | Year | 1 | 1 | LIVE | 92 | 7 | `rule_year_tag` (HR yt_archive_capture); legacy ingest from EXIF / extension |
| 2 | `album` | Album | 1 | 2 | LIVE | 134 | 8 | `rule_album_tag` (SPINE title, v1B); legacy HR RN ingest |
| 3 | `song` | Song | 1 | 3 | LIVE | 92 | 33 | `rule_song_tag` (SPINE track title); legacy HR RN ingest |
| 4 | `venue` | Venue | 1 | 4 | LIVE | 0 | 0 | Manual entry only (no rule today) |
| 5 | `people` | People | 1 | 5 | LIVE | 82 | 2 | Manual entry; legacy ingest. **No HR rule emits this today** — see §1.3. |
| 6 | `source` | Source | 2 | 1 | LIVE | 140 | 5 | `SOURCE_SLUG` static (HR); legacy ingest |
| 7 | `type` | Type | 2 | 2 | LIVE | 100 | 4 | `TYPE_VIDEO_SLUG` static (HR parent, v1B); legacy ingest |
| 8 | `unsorted` | Unsorted | 3 | 1 | **RETIRED 2026-05-19** | 185 | 47 | Legacy ingest (pre-v0.5.3). No live rule emits this. |
| 9 | `author` | Author | 3 | 2 | LIVE | 93 | 1 | `AUTHOR_SLUG` static (HR) |
| 10 | `platform` | Platform | 3 | 3 | **RETIRED 2026-05-24** | 0 | 0 | Retired this V1B; tags migrated to `source:`. |
| 11 | `scope` | Scope | 3 | 4 | LIVE | 93 | 1 | `SCOPE_SLUG` static (HR) |
| 12 | `artifact_kind` | Artifact Kind | 3 | 5 | LIVE | 54 | 2 | `child_static_tags(<kind>)` (HR) — thumbnail / transcript |
| 13 | `content_kind` | Content Kind | 3 | 6 | LIVE | 39 | 3 | `parent_static_tags(<variant>)` (HR) — official / live / lyrics |
| 14 | `exhibit` | Exhibit | NULL | NULL | **RETIRED 2026-05-19** | 20 | 1 | Manual + cowork backfill scripts. **Retired but in active use** (drift). |

**Plus three namespaces live in `tags` dictionary + `artifacts.tags`
JSON but absent from `vocabulary`** (the upstream registration
carryforward from V1B §7 / HR brief §4.2):

| Namespace | Instances | Distinct | Populated by | Vocab row? |
|---|---|---|---|---|
| `era` | 15 | 1 (rwth) | Cowork PHASEC script (one-shot) | **No** |
| `format` | 2 | 1 (short) | `rule_format_short_tag` (HR; <= 60s videos) | **No** |
| `release_type` | 3 | 1 (single) | `rule_release_type_single` (HR; phrase match) | **No** |

These tags **validate** at write time (MV's strict §3.1 grammar keys
on `namespace:value` shape, not vocabulary registration), and they
appear in `tags`-dictionary rollups. But they don't surface in the
inbox's pill-wall categorisation logic the way registered namespaces
do — `tier`/`sort`/`display_name` come from `vocabulary`. UI
behaviour for these three is undefined-but-defaulting (alphabetical,
trailing position, prettified slug).

**Distinct values per namespace** (top entries; full table in
`_cowork/audit-data-2026-05-24.txt` if needed for traceability):

- `year`: 2025 (34), 2023 (24), 2020 (9), 2024 (8), 2021 (7), 2022 (6), 2019 (4) — natural order is chronological, **stored alphabetical**.
- `album`: crooked_home (37), run_with_the_hunt (35), arkansas (28), mimicking_the_sun_like_dandelions (14), medusas_disco (7), skipping_stones_that_sink_before_theyre_thrown (7), life_inside_a_wheel (4), they_finally_cracked_me (2) — natural order is **chronological by release date**, stored alphabetical.
- `song`: 33 distinct; town_rat_heathen (7) top; long tail (16 singletons). Natural order is **by album + track number**; stored alphabetical.
- `people`: hunter_root (81), nick_root (1). Only 2 values.
- `source`: youtube (93), reverbnation (42), distrokid (2), tiktok (2), instagram (1).
- `type`: video (39), audio (30), mp3 (30), poster (1). **`mp3` is a sub-type of `audio`** — §2 overlap.
- `unsorted`: 47 distinct values; long tail. Notable (23), live_show (20), gear (16), solo (15), band (13), personal (13). **Many read as meaningful semantic content that wants a real namespace** (per HR brief §1.4).
- `author`: hunter_root only.
- `scope`: hunter_root only.
- `artifact_kind`: thumbnail (39), transcript (15).
- `content_kind`: official (25), live (11), lyrics (3). Variant taxonomy (museum-locked).
- `exhibit`: hunter_root only (retired but in use).
- `era`: rwth only.
- `format`: short only.
- `release_type`: single only.

### 1.2 — Every acquisition rule that writes tags (HR `yt_archive_capture.py`)

Read end-to-end. Five tag-rule functions + two static composers.

**Static tag composers (always emit):**

| Composer | Emits | Where applied |
|---|---|---|
| `COMMON_STATIC_TAGS` | `scope:hunter_root`, `source:youtube`, `author:hunter_root` | Every cluster artifact (parent + every child) |
| `parent_static_tags(<variant>)` | `COMMON_STATIC_TAGS` + `type:video` + `content_kind:<variant>` | Only on `youtube_video_page` parent. Variant ∈ `{official, live, lyrics, cover}`. |
| `child_static_tags(<kind>)` | `COMMON_STATIC_TAGS` + `artifact_kind:<kind>` | Only on cluster children. Kind ∈ `{thumbnail, transcript, page_save, channel_card}`. |

**Five rule functions (`_apply_tag_rules`):**

| Rule | Inspects | Emits | Fires when | Destination |
|---|---|---|---|---|
| `rule_album_tag(album_for_tag)` | SPINE album title (v1B; falls back to album id) | `album:<slug>` | `album_for_tag` non-empty | Common (all cluster artifacts) |
| `rule_song_tag(track_title)` | SPINE track title | `song:<slug>` | `track_title` non-empty | Common |
| `rule_year_tag(metadata)` | YT `upload_date` first 4 chars | `year:<YYYY>` | `metadata.date_source == 'scrape'` AND date parsable | Common |
| `rule_format_short_tag(metadata)` | YT `length_seconds` | `format:short` | duration <= 60s | **Parent-only** |
| `rule_release_type_single(title, description)` | Title + description text | `release_type:single` | regex matches `out now\|new single\|new release\|available now` (case-insensitive) | **Parent-only** |

**Notable absences from the live rule set** (per HR brief §4.1's
spec):

- **No `people:` rule.** HR brief §4.1 specifies
  `people:hunter_root` as an auto-applied tag for every HR-source
  capture. The implementation does not emit it. Cross-check (live
  SQLite): **37 of 38 v1-batch inbox parents lack `people:hunter_root`**.
  The 1 that has it is a pre-V1 row, not from the batch.
  Direct trigger for §3.1 / §5.1.
- **No `exhibit:` rule.** HR brief §4.1 also specifies
  `exhibit:hunter_root`. Not in any rule. Currently applied only via
  manual cowork backfill scripts. 20 live instances; all manual.
- **No `era:` rule.** `era:<album_slug>` is suggested in the parent
  manifest's `notes[]` (`suggest_pill: era:<slug>`) but **not
  committed to `tags[]`**. The 15 live `era:rwth` instances all came
  from PHASEC's one-shot `_cowork/phaseC_step1_apply_audio_curation.py`.
- **No `credit:` rule.** HR brief §9.3 approved a new `credit:`
  namespace for fan-cover attribution; the CLI's `--credit <name>`
  flag exists, but the value goes to the parent's `notes[]` and
  `fact2`, never to `tags[]`. Vocabulary row not added either.
  Same shape as the `era` gap.

**Backfill peer (`tools/yt-bulk-backfill-tags.py`):** unions the
parent/child static set + rule outputs onto each cluster's existing
tags; strips legacy `platform:*` (V1B collapse) and legacy short-name
`album:*` slugs. Does **not** add `people:` / `exhibit:` / `era:` /
`credit:`. Re-running it against the 38 in-inbox parents would not
unblock save.

### 1.3 — The validator and required-categories model

The required-category logic lives in two places that **must agree
but currently differ**:

1. **Canonical:** `MediaVault/core/attention_rules.py` (Python,
   server-side). R1–R5; `R3` is the people-or-bands rule. Per V2.1
   refactor: "band names live in the `people` namespace, so the
   legacy 'people or bands' disjunct collapses to a single check"
   (module docstring + R3 comment). R3 now checks only the `people`
   namespace; the warning slug `missing_category:people_or_bands` is
   retained verbatim for backward compat with persisted warning
   records.

2. **JS port:** `mediavault.html` lines 1149–1188 (`computeWarnings`).
   R3 still checks `countInCategory('people') === 0 && countInCategory('bands') === 0`
   — the **old disjunct** of two categories. The JS is out of sync
   with the canonical Python by one V2.1-refactor commit.

**What blocks save** (line 1037): any `missing_category:*` warning
in the computed set blocks `/api/artifact-save`. So R3 firing →
unblockable save → Mike's reported error.

**The five rules** (canonical Python):

| Rule | Fires when | Warning |
|---|---|---|
| R1 | `source_platform ∈ {facebook,instagram,tiktok,reverbnation}` AND no `post_date` | `missing_field:post_date` |
| R2 | `media_type ∈ {photo,video}` AND no parent_artifact_id AND no `content_kind:*` pill on | `missing_category:content_kind` |
| R3 | Description (short / long / extracted) contains a `[A-Z][a-z]+ [A-Z][a-z]+` bigram AND no `people:*` pill on | `missing_category:people_or_bands` |
| R4 | `ingest_source='extension-capture'` AND no `scope:*` pill on | `missing_category:scope` |
| R5 | Any pill is on AND `media_type` is empty | `missing_field:media_type` |

**For the 38 v1-batch YT inbox parents specifically:**

- R1: not applicable (YT not in SOCIAL_PLATFORMS — note: this looks
  like a separate gap; YT is the dominant source, but R1 only fires
  for the four legacy social platforms).
- R2: **FIRES** when MV's inbox flips the row's media_type to
  `video` AND no `content_kind:*` pill is "on" in the UI. Every
  v1-batch parent does carry `content_kind:official` / `live` /
  `lyrics` (static parent tag). So R2 should not fire — provided
  the inbox loads those tags as "on_confident" pill state.
- R3: **FIRES.** Every YT title/description contains title-case
  bigrams ("Hunter Root", "Mimicking the Sun", etc.). No
  `people:*` pill is present on any v1-batch parent (§1.2). →
  Validator returns `missing_category:people_or_bands`. → Save
  blocked. → Mike's exact reported error.
- R4: not applicable (ingest_source ≠ 'extension-capture' for HR
  bulk-ingest path).
- R5: not applicable (media_type is set).

**Where `people_or_bands` is defined** — the literal string lives in
exactly two places:

- `core/attention_rules.py:130` — `warnings.append("missing_category:people_or_bands")`. Comment cites the legacy disjunct.
- `mediavault.html:1180` — same warning slug; comment line 1182–1184 cites the V0.6 Item 8c removal of R4-old.

**There is no `bands` namespace anywhere** in MV's `vocabulary`
table, `tags` dictionary, or live `artifacts.tags` JSON. The JS port
at line 1226–1227 splits the warning under `people` AND `bands`
categories for display, but the bands "category" never renders
because no namespace by that name exists in `TAG_LIST` (loaded from
`/api/tags`, derived from `vocabulary`).

**Net (this is the §3.1 + §5.1 finding in one sentence):** the
validator requires a `people:*` pill that the acquisition layer
doesn't emit, and the UI shows a warning under a "bands" group that
doesn't render.

### 1.4 — The UI display (MV inbox `pillWall`)

Read `mediavault.html`. The inbox's pill wall is rendered by
`renderPillWall()` (line 1190). Behaviour:

- **Group discovery.** Categories are derived from each tag's
  `category` field, which is server-side derived from the slug's
  namespace prefix (`core/imgserver.py:257`,
  `vocab_row_for_slug`). The `category` column on `tags` was dropped
  in Phase 2.5; the field is synthesised on read for legacy UI
  compat.
- **Group order** (`CATEGORY_ORDER`, mediavault.html:706):
  `['people', 'bands', 'places', 'content_kind', 'topic', 'platform', 'rarity']`.
  Each of these is checked against `byCat` (the live grouping); if
  the category exists in the loaded TAG_LIST, it renders in this
  order. Remaining categories sort **alphabetically** after.
  `__uncategorized__` last.
- **Live applied order.** Of the 7 entries in CATEGORY_ORDER, **only
  2 map to live registered namespaces** (`people`, `content_kind`).
  The other 5 (`bands`, `places`, `topic`, `platform`, `rarity`)
  reference namespaces that don't exist post-refactor. So the
  actual rendered order for HR captures is:
  1. `people` (CATEGORY_ORDER[0])
  2. `content_kind` (CATEGORY_ORDER[3])
  3. Then alphabetical for the rest of the live namespaces:
     `album, artifact_kind, author, exhibit, scope, song, source, type, unsorted, year, venue` + any unregistered (`era, format, release_type`).
  4. `__uncategorized__` last (today: empty — every slug carries a
     namespace).
- **Within-group sort.** State-rank first (on_confident > on_uncertain
  > off_suspected > off_maybe > unset), then `usage_count` desc,
  then `slug` asc.
- **Collapsibility.** Per V0.6 Item 8d follow-up C5/C6 (code comment
  line 1251): "categories are always-open sections now — no
  details/summary, no collapse toggle. Mike wants the whole pill
  surface visible at once; hiding any of it is friction."
  Confirms Mike's now-different posture in §3.7.
- **Layout / column count.** `.pillCategory .pills` is
  `display: flex; flex-wrap: wrap; gap: 4px; padding: 6px 8px;`
  (CSS line 162). Pills wrap horizontally. There is **no
  multi-column grid** — long pills push the wrap point. Mike's "one
  column for all sidebar tag groups" finding maps to:
  flex-wrap-wrapping appears as "multiple columns" when many
  short-named pills fit on one row (e.g. year:2019..year:2025
  pills are all short, so the year group looks 4-wide; album pills
  are long, so the album group looks 1-wide). The inconsistency is
  the visual artifact of pill-name-length variance under
  flex-wrap, not an intentional multi-column setting.
- **Header status indicator.** `<span class="summaryCount">${onCount}/${pills.length}</span>` —
  `onCount` is the number of pills in this category whose state is
  `on_confident` or `on_uncertain`; the denominator is total pills
  visible in this group. Warnings render as a `⚠️` icon next to the
  category label when the category has a `missing_category:*` warning
  attached (line 1273).
- **Applied-tags accumulated strip.** At the top of the wall, all
  applied pills across every category are listed in one strip
  (lines 1244–1249). This is a SEPARATE region from the category
  sections — Mike's "APPLIED" view. Sorted by `category` then `slug`.

**Category constants drift summary:** `CATEGORY_ORDER` was written
for a v0.5-era category model that no longer exists. It is now ~71%
dead labels with 29% live mapping. Replacing it with a registry-driven
order (per §4) is mechanical.

### 1.5 — The Museum's display order

Museum tab/group ordering lives in two places that **already agree**:

1. **Tab declaration** (`HrExhibitFlow.jsx:124`):

   ```js
   const TABS = [
     { key: "artist",  label: "Artist",      kind: "tier", tier: 1, width: 120 },
     { key: "media",   label: "Formats",     kind: "tier", tier: 2, width: 130 },
     { key: "deep",    label: "Deep Tracks", kind: "tier", tier: 3, width: 120 },
     { key: "presets", label: "Presets",     kind: "special", ... },
     { key: "journal", label: "Journal",     kind: "special", ... },
   ];
   ```

   The first three tabs are **tier-grouped pill columns**; the
   namespaces appearing under each are filtered from `HR_DIMENSIONS`
   by `tier === tab.tier`.

2. **Dimension builder** (`hr_dimensions.js:125-178`,
   `buildDimensions`):
   - Walks every artifact's `tags` object.
   - Skips `exhibit:` (routing-only).
   - Skips any namespace with `retired_at IS NOT NULL` per the
     committed `src/data/vocabulary.json` (built from MV's
     `vocabulary` table at export time).
   - Namespaces sorted **alphabetically** (line 147).
   - Values within each namespace sorted **alphabetically** (line 150).
   - Falls back to tier 3 for unknown namespaces.

**Resulting Museum group order for HR's current corpus:**

| Tab | Tier | Namespaces (alphabetical) |
|---|---|---|
| Artist | 1 | `album, people, song, venue, year` |
| Formats | 2 | `source, type` |
| Deep Tracks | 3 | `artifact_kind, author, content_kind, era, format, release_type, scope` (the last three fall through to tier-3 fallback because they're not in `vocabulary`) |

The Museum hides `unsorted` (retired), `platform` (retired V1B),
`exhibit` (skipped explicitly). It surfaces 12 namespaces today, in
the order above.

**Mike's finding #3 ("Applied tags + tag categories should follow
the Museum tab order") therefore concretely means**: MV's inbox
should render groups in the same tier-grouped + alphabetical-within-
tier order the Museum already uses. The current MV order
(`people, content_kind, album, artifact_kind, author, exhibit, …`)
matches neither tier nor alphabetical.

### 1.6 — Repo HEADs + production state at audit time

- Museum: `aa3bb93` — `feat(yt-ingest): plumb --album-title from SPINE to capture script (v1B)`. PASS.
- MV: `020c5bc` — `docs(changelog): v0.5.5 — platform→source collapse per YT followon v1B`. PASS.
- HR: `3a215e9` — `fix(yt-acquisition): author/type tagging + album fidelity + vocab reconciliation`. PASS.
- MV SQLite readable; 178 artifacts; 38 in inbox (37 youtube + 1 other). PASS, with one note: the session brief said "38 inboxed YT cluster-roots" — actual is 37 YT + 1 pre-existing "other"; the pre-existing inbox row is not from the V1 batch. Minor — does not change the audit's conclusions.
- MV HTTP at `127.0.0.1:51822` unreachable from sandbox (Linux sandbox can't see Windows host loopback; carryforward from PHASEC §1.1 and the ingest-audit §1.1). Worked around by direct SQLite read in URI-readonly mode.
- `.git/*.lock` clean across all three repos at audit start.
- The v1B follow-on commits (HR `3a215e9`, MV `020c5bc`, Museum `aa3bb93`) all match the V1B run report `_cowork/YT_FOLLOWON_V1B_RUN_REPORT-20260524T151812Z.md` §1's expected end-state.

Going-in state intact.

---

## §2 — The cognitive model

For each live namespace: one sentence answering *"what question does
this namespace answer?"* Then surface the cases where multiple
namespaces answer overlapping questions.

### 2.1 — Clear, unambiguous namespaces

| Namespace | Question it answers |
|---|---|
| `year` | When was this artifact created/uploaded? |
| `album` | Which album does this artifact belong to? |
| `song` | Which song does this artifact represent? |
| `venue` | Where was the live recording made? (unused today) |
| `source` | Which platform did this artifact come from? (youtube, reverbnation, instagram, tiktok, distrokid) |
| `exhibit` | Which museum exhibit should this artifact route to? (today: only `hunter_root`) |
| `era` | Which career chapter does this artifact belong to? (today: only `rwth`) |
| `release_type` | Was this a single? album-cut? compilation? (today: only `single`) |

These are factual attributes — single, well-defined values. They
**do not overlap with each other**.

### 2.2 — Overlapping or ambiguous namespaces

Five overlap clusters surface from the inventory.

#### 2.2.1 — The four-way "what is this thing?" question

| Namespace | Stated purpose | Live values |
|---|---|---|
| `type` (tier 2) | The medium / format-family of this artifact. | `video (39), audio (30), mp3 (30), poster (1)` |
| `format` (unregistered) | The duration / shape / form-factor qualifier. | `short (2)` |
| `content_kind` (tier 3) | The CREATIVE ROLE of a parent artifact (museum's variant taxonomy). PARENT-ONLY. | `official, live, lyrics, cover` (3 live values; `cover` registered but no live instances yet) |
| `artifact_kind` (tier 3) | The STRUCTURAL ROLE of a child within a cluster (asset-type label). CHILD-ONLY. | `thumbnail (39), transcript (15), page_save, channel_card` |

**The defensible distinction** (built by the audit, not the data):

- `type` = *what kind of media object IS this*. Medium.
- `content_kind` = *what creative role does it play*. Variant.
  Locked museum-side May 2026.
- `artifact_kind` = *what relationship does it have to its cluster*.
  Asset-type label. Computer-readable role.
- `format` = *what shape/duration qualifier applies*. Orthogonal —
  could combine with any `type`.

The distinction holds — but the SLUG NAMES collapse it for a
human reader. "Artifact Kind" and "Content Kind" both sound like
"kind of thing"; "Type" and "Format" both sound like medium.

Internally there's also overload inside `type` itself: `mp3` IS a
sub-type of `audio` — having both as peers is technically wrong
(the museum's audio cards are media_type=audio regardless of
codec). Pre-V1 ingest emitted both for the 15 RWTH MP3s; pure
mp3-as-codec value provides no information the file extension
doesn't already.

Operator decision routed to §5.2.

#### 2.2.2 — `author` vs `scope`

Both currently carry the single value `hunter_root` only. Both fire
unconditionally from `COMMON_STATIC_TAGS` (HR's static set). Both
appear on every cluster artifact — parent AND every child.

| Namespace | Stated purpose | Distinction |
|---|---|---|
| `author` | Who MADE this artifact | The person/entity that created the source content |
| `scope` | What PROJECT this artifact belongs to | The exhibit/topic context |

**The distinction matters only when they diverge.** For HR's own
captures: author = scope = hunter_root (always). For fan-cover
content (HR brief §9.3): author = the fan creator (`credit:`),
scope = hunter_root. The future-scope channel-aware tagging from
V1B §3 / §7 names this exactly: when YT channel ≠ Hunter Root,
emit `scope:hunter_root` + `credit:<channel>` but NOT
`author:hunter_root`.

So they're **architecturally distinct** but **operationally
redundant** today. The redundancy is benign now and becomes
load-bearing when fan content lands.

Operator decision routed to §5.3.

#### 2.2.3 — `people` vs `bands` (the validator's ghost limb)

- `people` is a real namespace. 82 live instances. 2 distinct values
  (hunter_root, nick_root). Tier 1 in vocabulary.
- `bands` is **not** a registered namespace. Zero tags. Zero vocab
  row.

But `bands` is referenced in:

- `mediavault.html:706` `CATEGORY_ORDER` — between `people` and `places`.
- `mediavault.html:1179` R3 disjunct — `countInCategory('people') === 0 && countInCategory('bands') === 0`.
- `mediavault.html:1226-1227` warning-display split — when
  `missing_category:people_or_bands` fires, display warning under
  both `people` AND `bands` groups.
- `core/attention_rules.py:53` `CATEGORY_BANDS = "bands"` constant —
  declared as "legacy alias, mapped to `people` at the rule".

Per the V2.1 refactor (`attention_rules.py` module docstring):
"Under v2.1-target band names live in the `people` namespace, so
the legacy 'people or bands' disjunct collapses to a single check."
The Python rule already collapsed. The JS rule did not. The
warning slug + the JS UI references are remnant.

**Mike's mental model** treats bands ("Hunter Root") and people
("Mike Lang") as distinct concepts. The V2.1 collapse merged
them. The brief's framing question is whether the COLLAPSE was the
right call — i.e., would Mike rather UN-MERGE (re-introduce a
`bands` namespace alongside `people`) or KEEP MERGED (and drop
the `bands` references from validator + UI)?

Operator decision routed to §5.4.

#### 2.2.4 — `exhibit` (retired but in use)

`exhibit:hunter_root` has 20 live instances across released
artifacts. The namespace was retired 2026-05-19 with the cleanup
batch (per VOCAB_ALIGNMENT §2.2). The Museum's `hr_dimensions.js`
explicitly **excludes** `exhibit:` from pill columns (line 133) —
it treats `exhibit:` as routing-only metadata.

So the namespace functions today as a "send to museum X" flag, not
a content tag. That's a legitimate role — but it's retired in MV's
vocabulary table, so the inbox surfaces it weirdly (as an
unregistered namespace in the UNCATEGORIZED bucket after the
alphabetical sort, even though it has a registered vocab row,
because that row carries `retired_at`).

Operator decision routed to §5.5.

#### 2.2.5 — `unsorted` (retired with 185 living instances)

47 distinct values, 185 instances. Retired 2026-05-19. Code is
explicitly told (HR brief §1.4): "the acquisition layer should NOT
keep filling `unsorted:`. New auto-tags pick a non-retired tier-1
or tier-2 namespace, or propose a new one."

Several `unsorted:` values read as meaningful semantic content:

- `notable (23)`, `live_show (20)`, `gear (16)`, `solo (15)`,
  `band (13)`, `personal (13)`, `common (9)`, `new_music (7)`,
  `tour (4)`, `tour_announcement (4)`, `lyme_disease (2)`,
  `mental_health (1)`, `songwriting (1)`, `family (1)`,
  `loss (1)`, `tribute (1)`, …

These split roughly into:

- **Topic tags** (`live_show, gear, songwriting, personal, family,
  lyme_disease, mental_health, loss, tribute, mileage, …`) — would
  want a `topic:` namespace.
- **Marker tags** (`notable, rare, unique, milestone, defiant, snarky`)
  — would want a `marker:` or `quality:` namespace.
- **Page-type tags** (`artist_page, song_page, event_listing,
  ticketing, promotional_post, tour_announcement`) — already
  partially handled by `artifact_kind:` and `content_kind:`.
- **Status tags** (`released, pre_release, early_stages, early_version,
  rehearsal`) — would want a `release_status:` namespace, related to
  `release_type:`.

Operator decision routed to §5.8 (housekeeping).

### 2.3 — Namespaces with no clear purpose

None today. Even `unsorted` is a deliberate "we don't know yet"
catchall (per design intent); the issue is that the catchall
accumulated live content the registry never absorbed.

The retired-but-in-use combos (`exhibit`, `platform` → V1B closed
`platform`; `unsorted` survives) all have clear stated purposes;
their drift is governance, not semantics.

---

## §3 — Mike's findings, mapped

Each of the 8 findings recorded in the session brief, with concrete
diagnosis + proposed fix + operator-decision routing.

### 3.1 — `people_or_bands` validator error vs visible UI

**The finding.** "Save blocked: missing required category
(people_or_bands)" but only `People` group visible — bands tags
missing or misvalidated.

**Diagnosis.** Two compounding bugs, per §1.3:

1. **The acquisition layer doesn't emit `people:hunter_root`.** HR
   brief §4.1 spec'd it; yt_archive_capture.py never wired it (37 of
   38 inbox parents lack the tag). Validator R3 sees a title-case
   bigram in description and no `people:*` pill → warning fires.
2. **The `bands` half of the warning has no UI to render under.** No
   `bands` namespace exists; the JS attempt to display the warning
   under both "People" AND "Bands" categories shows only "People"
   because `byCat['bands']` is undefined.

**Proposed fix.**
- Mechanical (no §5 input needed): drop the `bands` half of R3 in
  the JS port (sync with `attention_rules.py`'s collapsed
  single-check version); retire the `bands` references in
  CATEGORY_ORDER + the warning-split code path.
- Acquisition-side (needs §5.4 confirmation): emit `people:hunter_root`
  from HR's COMMON_STATIC_TAGS so every cluster artifact gets it.
  Backfill the 38 in-inbox parents + their children (one-shot
  script, same shape as V1B's reconciliation).

Routed to §5.1 (with §5.4 dependency).

### 3.2 — Sidebar layout consistency

**The finding.** One column for all sidebar tag groups (except
APPLIED), consistent column spacing.

**Diagnosis** (per §1.4). Current CSS:
`.pillCategory .pills { display: flex; flex-wrap: wrap; gap: 4px; }`.
Short-named pills (year:2025) fit multiple per row; long-named pills
(album:they_finally_cracked_me) take a full row. The visual
"multi-column" effect is the wrap behaviour, not a configured
column count. Mike wants pills to render **one per row** in every
group except the top APPLIED strip.

**Proposed fix.** Change `.pillCategory .pills` to
`display: flex; flex-direction: column; gap: 4px;`. The APPLIED
strip (`.pillAccumulated`) stays at `flex-wrap: wrap`.

Mechanical. Routed to §6.1. No §5 input needed.

### 3.3 — Tag-group ordering vs Museum tab order

**The finding.** Applied tags + tag categories should follow the
Museum tab order.

**Diagnosis** (per §1.4 + §1.5). MV's `CATEGORY_ORDER` constant is a
v0.5-era 7-entry list that only partially maps to live namespaces.
Museum's `buildDimensions` sorts namespaces alphabetically within
each of 3 tier-grouped tabs. So Mike's "follow the Museum tab
order" concretely means: tier-grouped (1, then 2, then 3) +
alphabetical within tier.

**Proposed fix.** Replace `CATEGORY_ORDER` with a derivation that
reads `tier` + `sort_order` from MV's `vocabulary` rows
(server-side: include both in the `/api/tags` response). Then in
the JS: sort by `(tier asc, sort_order asc, namespace asc)`, with
unregistered namespaces falling through to tier 3 alphabetical
(matches the Museum's `tierForNamespace` fallback).

Routed to §6.1 (mechanical given §5.5's vocab-registration answer).

### 3.4 — Album chronological; song by album/track

**The finding.** Album ordering chronological. Song ordering by
album/track.

**Diagnosis.** Both namespaces are currently sorted alphabetically
by slug, both in MV (Museum-side alphabetical from `hr_dimensions.js`,
MV-side alphabetical fallback for free-tier values). For HR's
8 albums: alphabetical produces `arkansas, crooked_home,
life_inside_a_wheel, medusas_disco, mimicking_the_sun_like_dandelions,
run_with_the_hunt, skipping_stones_that_sink_before_theyre_thrown,
they_finally_cracked_me` — order has no information value to Mike.

For songs: alphabetical produces 33 values in slug order, ignoring
album grouping entirely.

**The right ordering** requires data the registry doesn't currently
carry:

- For albums: a release date per album. SPINE (`src/data/artists/hunter-root.js`)
  may already carry this — needs verification (V1B confirmed SPINE
  has `id` + `title` per album; release-date field unverified this
  audit).
- For songs: a (album, track) tuple per song. SPINE carries `tracks`
  arrays per album in order; index within array IS the track number.

**Proposed fix.**

- Mechanical (after operator picks the policy): a build-time export
  step writes an ordered list per namespace to `vocabulary.json`
  alongside tier/sort_order. The Museum's `buildDimensions` consults
  it; MV's `/api/tags` consults it.
- Configurable: the policy choice — chronological for albums,
  album+track for songs, usage-count or alphabetical for everything
  else (Mike picks per namespace).

Routed to §5.6 (album sort) + §5.7 (song sort).

### 3.5 — Artifact Kind vs Type clarification

**The finding.** "Artifact Kind vs Type — what's the difference?"

**Diagnosis.** Per §2.2.1: `type` answers *medium*; `artifact_kind`
answers *role within cluster*. They're orthogonal — a thumbnail is
`type:photo, artifact_kind:thumbnail`; a transcript is `type:text,
artifact_kind:transcript`. But the names sound interchangeable.

In the live data the orthogonality is even partially broken:
`artifact_kind:thumbnail` artifacts also carry `type:` only when
they're children of a video parent that the parent inherits — the
children today carry SOURCE/SCOPE/AUTHOR + artifact_kind but no
explicit `type:` (the YT capture script does not emit `type:` on
children). So `artifact_kind` is currently functioning as a
de-facto sub-type for cluster children.

**Proposed fix.** Three components — pick one per §5.2:
- A) Sharpen distinction: keep both, document precisely
  (`type` = "what file/medium IS this"; `artifact_kind` = "what
  STRUCTURAL role within its cluster"), rename `artifact_kind`
  display to "Cluster Role" so the human-readable label drops
  "kind". Add `type:` emission for cluster children too.
- B) Merge: collapse `artifact_kind` into `type` with values like
  `type:thumbnail, type:transcript`. Loses the structural-role
  distinction but reduces namespace count.
- C) Rename for clarity: `artifact_kind` → `role` (more semantic);
  `content_kind` → `variant` (matches museum-locked term).

Routed to §5.2.

### 3.6 — Type / Format / Content Kind / Artifact Kind — the four-way question

**The finding.** "Type and Format and… (trailed off — sensing more
overlap)."

**Diagnosis.** Per §2.2.1. Four namespaces that all answer some
variant of "what is this thing?" Defensible distinctions exist
(medium / qualifier / creative-variant / cluster-role) but the
slug names obscure them.

**Proposed fix.** This is the load-bearing namespace decision. §5.2
covers the four-way merge-or-sharpen call.

Cross-references §3.5.

### 3.7 — Collapsible groups with auto-collapse

**The finding.** Each group collapsible; auto-collapse "answered"
groups leaving only selected tags visible.

**Diagnosis.** Per §1.4 / mediavault.html line 1251 comment:
collapse was REMOVED in v0.6 Item 8d follow-up C5/C6 with the
explicit Mike-quoted rationale "Mike wants the whole pill surface
visible at once; hiding any of it is friction." Mike's current
posture reverses that.

**Proposed fix.**

- Mechanical: reinstate `<details>/<summary>` semantics for each
  category group (CSS still has the selectors at line 152–162, just
  unused). Wire toggle handlers.
- Configurable: an "auto-collapse when answered" rule. The semantic
  question is **what counts as "answered"**: per-group, possible
  definitions are:
  - **Strict** — group has 1+ on_confident pill AND no
    missing_category warning attached.
  - **Permissive** — group has 1+ on_* pill (either confidence).
  - **Required-only** — only required groups (per R2/R3/R5) auto-
    collapse when satisfied; free namespaces stay open.

Routed to §5.7 (collapse policy).

### 3.8 — The operator-as-crumb-collector posture

**The finding.** "I am being used to pick out the crumbs" — operator
wants end-to-end review, not per-artifact discoveries.

**Diagnosis.** Posture, not bug. The acquisition + ingest layers
have shipped enough small gaps (no people: rule; no era:/format:
vocab rows; CATEGORY_ORDER drift; collapse-toggle removed; sort-order
alphabetical even where chronological is right) that each gap
surfaces at triage time. Mike triages, hits a wall, flags it. The
flagged item gets fixed in the next session. Repeat.

This audit is the inverse pattern: scope the whole tagging system
in one pass, ship the fixes as one tracked roadmap, free triage to
be just triage.

**Proposed posture rule** (the operator-locked-rule pattern from
PHASEC §7.4):

> **Tagging-system changes ship in audited batches, not per-artifact
> discoveries.** Before any tagging change lands, scope its blast
> radius across MV vocabulary + HR rules + Museum render. Mike's
> triage attention is reserved for content judgment, not for finding
> system gaps.

Bank as posture; cite in code comments at relevant sites
(`yt_archive_capture.py` static-tag composers, MV's
`renderPillWall`, Museum's `buildDimensions`).

Not routed to §5 — posture rule, not a discrete decision.

---

## §4 — Architectural recommendations

Whole-system shape. Each item proposes; the corresponding §5 item
locks the operator-facing choice.

### 4.1 — One source of truth for tag-group display order

Today's three orderings:

- **Museum:** `tier` (from `vocabulary.json` export) + alphabetical
  within tier. Filters out retired + `exhibit:`.
- **MV inbox:** hardcoded `CATEGORY_ORDER` (7 entries, 2 live) +
  alphabetical fallback. Drift from Museum.
- **HR acquisition:** no order concept — tags emitted in whatever
  set-union order the JSON serializer chooses.

Recommendation: **the `vocabulary` table is the source of truth for
group order across all three surfaces.** Specifically:

- MV's `/api/tags` response includes `tier` + `sort_order` per row
  (already in the table; just expose them).
- MV's `mediavault.html` replaces `CATEGORY_ORDER` with
  `tier asc, sort_order asc, namespace asc` (matching Museum).
- Museum's `hr_dimensions.js` adds `sort_order` to its
  `tierForNamespace` reads (today uses only `tier`).
- HR's acquisition layer doesn't need to change — set-union order
  is non-load-bearing for emit; sort happens at read.

§5.5 picks the operator-facing exception (whether to keep CATEGORY_ORDER's
2 live entries as a manual override or fold everything to registry).

### 4.2 — Required-category model: `people_or_bands` is misleading

Today's warning slug `missing_category:people_or_bands` references
two categories where only one exists. Three coherent ways out:

- **A — Single category** (`missing_category:people`). Match
  `attention_rules.py`'s already-collapsed R3. Drop the JS disjunct.
  Drop `bands` from CATEGORY_ORDER + the warning-split code path.
  Document the legacy slug name as kept-for-historical-compat in
  persisted warning records (or rename and migrate).
- **B — Re-introduce `bands`** as a separate tier-1 namespace
  alongside `people`. Mike's mental model treats bands ("Hunter
  Root", "Medusa's Disco") differently from people ("Mike Lang",
  "Nick Root"). Migrate the existing `people:hunter_root` (81
  instances) and `people:nick_root` (1) appropriately — `hunter_root`
  → `bands:hunter_root`, `nick_root` stays in `people`. R3 disjunct
  stays valid.
- **C — Single category, renamed** `actors` or `people_and_bands`.
  Disambiguates from "people" the everyday word; explicitly carries
  both individuals and groups.

§5.4 picks.

### 4.3 — Sort-order conventions per namespace

Defensible defaults by namespace shape:

| Namespace shape | Default sort |
|---|---|
| Time-bound (year, era) | Chronological (latest first or earliest first — operator picks) |
| Title-bound (album, song) | Operator-curated order (release date for album; album+track for song) — source: SPINE or MV `vocab_value_order` table |
| Source/medium (source, type, content_kind, artifact_kind, format, release_type) | Usage-count descending (matches the Museum's current dynamic-tab-counting) |
| Free namespaces (people, venue, scope, author, unsorted) | Alphabetical |

Where "operator-curated" applies, the data needs a place to live.
Two shapes available:

- **In SPINE** (`src/data/artists/hunter-root.js`) — already carries
  album ids in some order; can extend to carry `release_date` per
  album. Museum-side natural fit (SPINE is already a museum data file).
- **In MV** — a new `vocab_value_order` table joined to `tags` /
  `vocabulary`. Centralised, but adds schema.

Recommendation: keep order data in SPINE for HR's known albums/songs
(they're already there at slug-only fidelity; adding `release_date`
+ `track_number` is a minor extension). Export the derived order to
`vocabulary.json` for the Museum + a new `/api/value-order/<namespace>`
endpoint for MV. For non-SPINE namespaces, use the §4.3 defaults.

§5.6 + §5.7 pick.

### 4.4 — Acquisition spec / implementation gap closure

HR brief §4.1 specifies tags that the implementation doesn't emit:
- `people:hunter_root` (§3.1 root cause)
- `exhibit:hunter_root` (manual / cowork-script only)
- `era:<album_slug>` (notes-only, never committed)
- `credit:<creator_slug>` (notes-only, never committed)

**Recommendation: close the spec/implementation gap in one focused
session** as part of the §6 mechanical bucket. The fixes:

- Add `people:hunter_root` to `COMMON_STATIC_TAGS` (one constant +
  one composer addition).
- Add a path-based `exhibit:` rule per the ingest audit's C1
  (`intake/drop/yt-staging/* → exhibit:hunter_root`).
- Add an SPINE-driven `era:` rule (album_id → era mapping):
  `crooked → rwth, wheel → rwth, dandelions → seeds, …` — Mike
  defines the mapping once.
- Add a `credit:` rule that fires when `--credit <name>` is passed:
  emit `credit:<slug>` on the parent.

The four together close the §1.2 gap. Backfill against the 38 in-
inbox parents unblocks Mike's save flow (people:hunter_root
specifically) and lights up the era/credit pills the Museum already
knows how to render.

### 4.5 — Namespace lifecycle: register unregistered, retire fully

Three live namespaces (`era`, `format`, `release_type`) carry live
tags but no vocab row. The Museum falls them through to tier-3
alphabetical; MV's inbox renders them in the `__uncategorized__`
bucket OR (more precisely) interleaved alphabetically among the
live-registered tier-3 namespaces because the JS doesn't
distinguish.

Two retired-but-active drifts: `unsorted` (185 instances, retired)
and `exhibit` (20 instances, retired). The Museum hides `unsorted`
(per `RETIRED_NAMESPACES` filter); the Museum hides `exhibit` (per
explicit skip). MV's inbox still surfaces both — `unsorted:` pills
appear in the inbox at the alphabetical tail.

Recommendation:

- **Register `era`, `format`, `release_type`** in `vocabulary` with
  appropriate tiers. Operator picks tiers in §5.8.
- **`exhibit`: un-retire if the routing-tag posture is canonical;
  alternatively keep retired and document the routing-only role**
  explicitly. Today's state (retired + 20 live instances) is unstable.
- **`unsorted`: leave retired**. The 185 instances are pollution
  from pre-cleanup ingest; they'll get re-classified as part of
  release triage (not en-masse). New ingest never fills `unsorted`
  per HR brief §1.4's "don't fill" rule.

§5.5 + §5.8 cover.

---

## §5 — Operator decisions

Eight decisions queued. Mike resolves one at a time per GATE 5.
Each below names the question, the proposed answer (with a brief
"why"), and where the resolution lives in the brief.

### §5.1 — Should `people:hunter_root` be auto-emitted on every HR cluster?

**Why this matters.** Closes the §3.1 validator-blocked-save bug
directly. HR brief §4.1 already specifies it; the audit confirms
implementation never wired it.

**Proposed answer: YES — add to `COMMON_STATIC_TAGS` + backfill
the 38 in-inbox parents (+ their children) as a one-shot script
mirroring V1B's reconciliation discipline.**

Why: the alternative (loosen R3 instead) erodes the validator's
purpose. R3 catches the case where a description names a person/
band but the tags don't reflect it — that's a real curation gap
detector for non-HR captures. Closing the implementation gap
matches the spec and unblocks save without weakening the rule.

> **§5.1 — partial implementation (2026-05-25, HR commit `3fc7a09`):**
> T8's `yt_archive_capture.py` branch applies the §5.1 auto-emit-on-every-
> capture pattern to ingest-audit C1's exhibit rule: `exhibit:hunter_root`
> now emits automatically on all future YT captures (parent + children).
> The `bands:hunter_root` / `people:hunter_root` half of the §9.1 decision
> (T4 in §6.1) is separate and not yet shipped. See §6.1 T8.

### §5.2 — How do we resolve the `type` / `format` / `content_kind` / `artifact_kind` overlap?

**Why this matters.** Four namespaces, four overlapping flavours
of "what is this thing?" Mike's finding #5 explicitly asked the
question. This is the highest-impact namespace decision in the
audit.

**Three options on the table:**

- **A. Sharpen + rename for clarity.** Keep all four. Rename
  `artifact_kind` display label to "Cluster Role" (slug stays for
  back-compat). Rename `content_kind` display label to "Variant".
  Document the canonical distinctions in `core/attention_rules.py`
  + `vocabulary` `display_name` fields. Add `type:` emission for
  cluster children too (currently absent — children carry only
  `artifact_kind`).
- **B. Merge `artifact_kind` into `type` with role-like values.**
  Collapse to three namespaces: `type` (any file role: video,
  audio, mp3, thumbnail, transcript, page_save), `format` (short/
  long qualifier), `content_kind` (variant taxonomy). Migrate
  existing `artifact_kind:thumbnail` → `type:thumbnail`. Loses
  the structural-role/medium distinction.
- **C. Mike-proposed-merge alternative** (operator-introduced —
  if you have a fourth shape in mind, name it here).

**Proposed answer: A — sharpen + rename.**

Why: the V1B work already committed to keeping all four as distinct
namespaces (HR rules emit them; museum tab structure consumes them).
Renaming display labels is cheap; the distinctions are real once
named. B's merge collapses the parent/child structural pattern that
the cluster shape relies on — backfilling the museum-side rendering
to handle merged-`type` would be substantial.

### §5.3 — `author` vs `scope`: keep both, merge, or rename?

**Why this matters.** Both currently fire unconditionally with the
same value (`hunter_root`). Architecturally distinct, operationally
redundant. The distinction becomes load-bearing when fan content
lands (per V1B §3 future-scope channel-aware tagging).

**Three options:**

- **A. Keep both, sharpen rules.** `scope` = "exhibit project this
  artifact belongs to"; `author` = "creator of this artifact" — gated
  on channel match per V1B §3's future-scope rule (HR's own channel
  → `author:hunter_root`; fan channel → `author:<channel_slug>` +
  `credit:<channel_slug>`, scope stays `hunter_root`).
- **B. Merge into `author`** (`scope:hunter_root` retired; replaced
  by `author:hunter_root`). Loses the "project-membership" concept;
  fan covers would need a new mechanism to indicate exhibit
  membership without authorship.
- **C. Merge into `scope`** (`author` retired; `scope` carries
  exhibit-project membership; authorship indicated by `credit:`
  always — `credit:hunter_root` for HR's own captures,
  `credit:<channel>` for fan content). Single semantics for
  attribution.

**Proposed answer: A — keep both, sharpen.**

Why: the channel-aware future-scope rule needs the
project-membership vs authorship distinction. Collapsing now and
splitting later is more work than splitting carefully now.

### §5.4 — `people_or_bands` validator: single category, dual category, or rename?

**Why this matters.** The §3.1 root validator bug. §4.2 sketched
three coherent paths.

**Three options:**

- **A. Single category** (`people` only). Match attention_rules.py.
  Drop bands references from JS + CATEGORY_ORDER. Rename warning slug
  to `missing_category:people` (with one-shot migration for any
  persisted records).
- **B. Re-introduce `bands` namespace.** Bands and people are
  separate categories (Mike's mental model). Migrate
  `people:hunter_root` → `bands:hunter_root` (81 instances; one-shot
  vocab + tag rewrite). R3 disjunct stays.
- **C. Single category, renamed** (`actors` or `attribution`).
  Disambiguates without splitting.

**Proposed answer: B — re-introduce `bands`.**

Why: Mike's mental model already separates them, the merge was a
V2.1 simplification done without operator UX consultation, the
migration is small (81+1 instances), and the validator stays
expressive (covers both a band-name mention and a person-name
mention case).

### §5.5 — Tag-group display order: tier+alphabetical, custom, or fully manual?

**Why this matters.** Today's MV order is essentially random.
Museum order is tier+alphabetical. Mike's finding #3 says
"follow Museum tab order."

**Three options:**

- **A. Tier + alphabetical** (match Museum exactly). Replace
  CATEGORY_ORDER. `tier asc, sort_order asc, namespace asc`.
- **B. Tier + operator-curated within tier.** Use `sort_order`
  column in `vocabulary` (already exists, mostly populated). Mike
  can re-order within a tier without touching tiers.
- **C. Fully manual** (a single linear ordering of all
  namespaces). Authored in one place; tiers become labels rather
  than groupings.

**Proposed answer: B — tier + sort_order within tier.**

Why: matches Museum tab structure (tier-grouped) AND respects
the existing `sort_order` column. Pure alphabetical loses some
Mike-set ordering already in the table (year=1, album=2, song=3
matches Mike's preferred flow, not alphabetical).

### §5.6 — Album sort order: chronological, alphabetical, or usage-count?

**Why this matters.** Mike's finding #4 explicitly asked for
chronological.

**Three options:**

- **A. Chronological by release date.** Source: SPINE; needs
  `release_date` field per album. Direction: latest-first (the
  museum's tour-the-corpus convention) or earliest-first.
- **B. Alphabetical** (current behaviour).
- **C. Usage-count descending** (most-tagged-first).

**Proposed answer: A — chronological by release date, latest-
first.**

Why: Mike explicitly asked for chronological. SPINE is the
natural place to carry release_date. Latest-first matches "new
music" framing where most attention goes.

Requires a one-time SPINE extension: add `release_date` per album
(8 values to fill in). Mike fills them once; the export step
emits the order.

### §5.7 — Song sort order + collapse behaviour

**Why this matters.** Finding #4 (song by album/track) and #7
(auto-collapse answered groups) are two questions; pairing them
because both touch the within-group experience.

**Song sort.** Three options:

- **A. By album + track.** SPINE-derived. Album order per §5.6;
  within an album, track order per SPINE's array index.
- **B. Alphabetical** (current).
- **C. Usage-count.**

**Collapse behaviour.** Three options:

- **A. Auto-collapse on "any on_* pill applied"** — once Mike
  has marked anything in a group, the group collapses to show
  only the applied pills + a header.
- **B. Auto-collapse only required groups when satisfied**
  (R2/R3/R5-required groups collapse; free namespaces stay open).
- **C. Manual only** (per-group toggle, never auto). Revert to
  pre-v0.6-Item-8d behaviour.

**Proposed answers: song A (album + track); collapse A (any on_*
applied).**

Why song A: matches finding #4 exactly. Why collapse A: aligns
with Mike's "leaving only selected tags visible" framing; A is
the strongest version of that.

### §5.8 — Register `era`, `format`, `release_type`; un-retire or retire-fully `exhibit`

**Why this matters.** §1.1 / §4.5 named the lifecycle gaps. Cheap
housekeeping; locks namespace tiering for the §5.5 ordering.

**Sub-questions:**

- **Q1.** Register `era`, `format`, `release_type`. Proposed tiers:
  `era` tier 1 (alongside year/album/song — temporal); `format`
  tier 2 (alongside source/type — medium qualifier);
  `release_type` tier 2.
- **Q2.** `exhibit` namespace status. Proposed: keep retired,
  document explicitly as routing-only. Today's working behaviour
  (Museum's explicit skip + retired vocab row) is coherent IF we
  document the role.
- **Q3.** `unsorted` namespace. Proposed: stay retired; accept the
  185 instances as triage pollution to clean up case-by-case during
  release review. Do not bulk-rewrite.

**Proposed answer: register the three; keep `exhibit` retired-as-routing;
keep `unsorted` retired.**

Why: the three live namespaces need registry rows to participate in
the §5.5 ordering. `exhibit`'s routing-only role is real and
already working — formalising the docstring closes the drift.
`unsorted` cleanup is operator-judgment per pill and shouldn't be
batched.

---

## §6 — Implementation roadmap

Three-bucket shape per the ingest-audit pattern. Sequencing locked
post-§5 resolution.

### 6.1 — Mechanical (no operator judgment beyond §5 answers)

- **T1. Validator JS-port sync** — drop `bands` half of R3 in
  `mediavault.html`; warning slug stays per §5.4 outcome. (Depends
  on §5.4.)

  > **T1 SUPERSEDED (2026-05-24, V1B Tagging-S1 §2.1 → V1B Bands-Migration §4):**
  > §9.4 reverses this T1. The existing R3 disjunct
  > `countInCategory('people') === 0 && countInCategory('bands') === 0`
  > in `mediavault.html:1179` is **CORRECT as-written** for the
  > post-migration dual-category world. No code change required.
  > Bands migration (vocab register + 173 tag rewrites) landed
  > 2026-05-24 per MV CHANGELOG v0.5.6. Cross-references: §9.4.

- **T2. Sidebar single-column layout** — CSS change:
  `.pillCategory .pills { flex-direction: column; }`. APPLIED
  strip unchanged.

  > **T2 DONE (2026-05-24, MV commit `609b739` — Tagging-S1):**
  > Sidebar pill columns now render single-column;
  > `.pillCategory .pills { flex-direction: column; }` shipped.
  > APPLIED strip unchanged.

- **T3. Tag-group order via tier + sort_order** — server-side:
  expose `tier` + `sort_order` in `/api/tags` response. Client-side:
  replace `CATEGORY_ORDER` constant with sort by `(tier, sort_order,
  ns)`. (Depends on §5.5.)

  > **T3 DONE (2026-05-25, MV commit `691f0ff` + Museum commit `5740596`):**
  > Server-side `/api/tags` extended with `tier`, `sort_order`,
  > `namespace_display_name`, `namespace_retired_at` per-tag fields
  > (option α — unregistered ns falls to `tier=99` / `sort_order=99`).
  > Client-side `CATEGORY_ORDER` retired in favour of `NAMESPACE_META` +
  > `nsCompare` / `orderCats` helpers driven by the new `/api/tags` fields.
  > Museum-side sort comparator at `hr_dimensions.js:147` consults
  > `REGISTRY[ns]?.tier` / `.sort_order` with the same fallback.
  > Retired namespaces hidden cross-surface. Unblocks T6. Live in
  > production via release-flow regen (Museum HEAD `d0e9f4f`, 2026-05-28).
- **T4. People-emission fix** — add `people:hunter_root` to HR's
  `COMMON_STATIC_TAGS`; backfill the 38 in-inbox parents + children
  via one-shot reconciliation script (mirrors V1B
  `_cowork/mv_vocab_reconcile_v1B.py` discipline). (Depends on §5.1.)
- **T5. Collapse-toggle reinstatement** — re-wire `<details>/<summary>`
  for each `.pillCategory`. Add auto-collapse on `on_* applied` per
  §5.7. CSS selectors already in place.

  > **T5 DONE (2026-05-24, MV commit `609b739` — Tagging-S1):**
  > `<details>/<summary>` re-wired for each `.pillCategory`.
  > Auto-collapse on `on_* applied` shipped per §9.7 / §5.7.

- **T6. Album/song sort-order export** — extend SPINE with
  `release_date` per album (8 values, operator-fills); extend
  `tools/export-artifacts.mjs` to emit `value_order` arrays in
  `vocabulary.json`; Museum's `buildDimensions` consults; MV's
  `/api/tags` consults. (Depends on §5.6 + §5.7.)
- **T7. Era / format / release_type vocab registration** — one-shot
  `_cowork/mv_register_unregistered_v1.py` (insert 3 rows).
  Tiers per §5.8.

  > **T7 DONE (2026-05-25, MV commit `53d40f5` — v0.5.8):**
  > `era`, `format`, `release_type` registered in MV `vocabulary`
  > with tiers per §9.8 / §5.8. Unblocks T3.

- **T8. Era + credit + exhibit emission** — HR `yt_archive_capture.py`
  extension: SPINE-driven `era:<slug>` mapping; `--credit` flag
  emits `credit:<slug>` to tags (not just notes); path-based
  `exhibit:hunter_root` rule per ingest-audit C1. Backfill the 38.

  > **T8 PARTIAL DONE (2026-05-25, HR commit `3fc7a09`):**
  > `yt_archive_capture.py` branch shipped per ingest-audit C1:
  > `EXHIBIT_SLUG = 'exhibit:hunter_root'` added to `COMMON_STATIC_TAGS`
  > so every future YT capture auto-emits `exhibit:hunter_root`.
  > Era + credit emission and the path-based exhibit rule for non-YT
  > intake paths are still pending. Closes the manual exhibit-backfill
  > loop opened by EXHIBIT_BACKFILL_DEPLOY (MV CHANGELOG v0.5.7) for
  > new YT captures only. Cross-reference: §5.1.

### 6.2 — Configurable (operator sets policy once, engine applies)

- **C1. The per-namespace sort policy table.** Lives in
  `vocabulary.json` (`sort_policy` per namespace: `chronological`,
  `value_order`, `usage_count`, `alphabetical`). The dynamic
  fallback chain.
- **C2. The SPINE album-era mapping table.** One JSON object in
  `hr_archive_capture.py` or SPINE itself:
  `{cracked: rwth, crooked: rwth, dandelions: seeds, wheel: rwth,
  skipping: rwth, arkansas: rwth, medusas_disco: medusas, …}`.
  Operator-authored once.
- **C3. The collapse-on-answered policy.** One JS const naming
  which groups auto-collapse (§5.7's "any on_*" answers A across
  the board; if Mike picks B later, the const captures the
  required-only subset).

### 6.3 — Operator-only (per-artifact human call)

Carries forward from the ingest audit's §5.3 — no changes from this
audit's scope:
- Release judgment.
- Description authoring (short + long).
- Sensitive-content review.
- Per-fan-content credit assignment (when fan covers arrive — HR
  brief §9.3).
- Per-artifact pill-state adjustment in the inbox.

### 6.4 — Sequencing order

Smallest-blast-radius-first:

1. **T1 + T2 + T5** (UI polish, no model changes) — same session.
   Unblocks Mike's UX irritations without touching data.
2. **T4 + the people-backfill** (validator-unblock) — closes the
   save-blocked path. Single session.
3. **T7** (register era/format/release_type) — prerequisite for T3.
4. **T3** (tier+sort_order ordering) — depends on T7.
5. **T8** (era + credit + exhibit emission) — same session as T4
   if scope allows, otherwise next session.
6. **T6** (album/song sort-order from SPINE) — depends on Mike
   filling SPINE `release_date` values. Can run in parallel with T8.

Each item is one focused session; together they bring the tagging
system from "operator picks crumbs" to "operator releases artifacts".

---

## §7 — Out of scope

- **Vision-AI enrichment** of artifacts (Mike's mention of
  semantic similarity / auto-tagging from image content).
- **Semantic dedup.** Byte-identical dedup is ingest-audit M3;
  semantic equivalence (this YT video IS this Bandcamp track) is
  its own scoping problem.
- **The album / cluster / thumbnail data-model question** (whether
  the parent-child cluster shape should expand to include album
  thumbnails as first-class artifacts, etc.). Banks for the next
  acquisition scoping pass; this audit is taxonomy-focused, not
  data-model-focused.
- **HR repo index corruption** — pre-existing per V1A / V1B; not
  addressed; dedicated repair session.
- **MV-067 SPINE drift artifact correction** (Shapeshifter /
  Sleight of Hand). Re-noted; tagging-system audit does not
  resolve.
- **Vocabulary additions for IG / TT / FB** (post-HR-brief §2.2–§2.4
  per-source acquisition). Deferred until those sources are
  scoped for ingest.
- **`unsorted:` bulk re-classification.** 185 instances need
  per-artifact judgment; not batched here. Per §5.8 stays as
  triage pollution to address during release review.
- **`fb_poster/` outbound flow.** This audit is about inbound
  tagging.
- **The R1 social-platform list update** (YT is not in
  SOCIAL_PLATFORMS; R1 doesn't fire on YT today). Worth surfacing
  for a future ingest-audit follow-on; not load-bearing for this
  audit's findings.
- **The 22 `text-only`-normalised-to-`link` rows from
  ingest-audit §4.3.** Already operator-locked.

---

## §8 — Verification (this brief)

**Read end-to-end (every line):**

- `Hunter Root/_cowork/YT_FOLLOWON_V1B_RUN_REPORT-20260524T151812Z.md` —
  the v1B run report. Source-of-current-state.
- `weird-baby-museum/docs/YT_VOCABULARY_ALIGNMENT-20260523T171458Z.md` —
  Option A revival decision + drift logic.
- `weird-baby-museum/docs/HR_ACQUISITION_SCOPING_BRIEF-20260523-154141.md` —
  §0–§9 in full; especially §4 (tagging spec) which is the
  source-of-truth this audit validates against.
- `weird-baby-museum/docs/INGEST_BEHAVIOR_AUDIT-20260522-182616.md` —
  the format mirror.
- `Hunter Root/tools/yt_archive_capture.py` lines 130–890 — every
  static-tag composer + rule function + manifest builder.
- `Hunter Root/tools/yt-bulk-backfill-tags.py` — backfill loop in
  full; confirms which rules apply vs which don't.
- `MediaVault/core/attention_rules.py` — every R1-R5 rule.
- `weird-baby-museum/src/routes/hr/hr_dimensions.js` — full module.

**Skimmed (purposive search):**

- `MediaVault/mediavault.html` lines 700–1400 — `CATEGORY_ORDER`,
  `computeWarnings`, `renderPillWall`, pill-styling CSS. The HTML
  is ~17 KLOC; ingest behaviour outside the inbox triage path was
  not re-read.
- `MediaVault/core/imgserver.py` lines 180–500 — tag list API
  handler + vocab_row_for_slug. Confirmed the `category` is
  derived from `slug` namespace prefix.
- `weird-baby-museum/src/routes/hr/HrExhibitFlow.jsx` lines 1–200 —
  TABS array + dimension intake.

**Pure-Python helpers executed in sandbox against live data:**

- Vocabulary table dump (14 rows).
- Per-namespace instance counts via
  `json_each(artifacts.tags)` — 14 namespaces with live tags;
  3 unregistered.
- Cross-check: 37 of 38 v1-batch inbox parents lack
  `people:hunter_root`. Confirms §3.1 root cause direct from data.
- All distinct values per namespace, with usage counts.

**Queried (read-only) against `core/mediavault.sqlite` at MV HEAD
`020c5bc`:**

- Full `vocabulary` + `tags` + `artifacts.tags` distributions.
- Inbox parent sample (first 10 parents' tag arrays).
- Artifact count by status (inbox 38, vault 119, released 20,
  archived 1; total 178). Matches V1B §6.

**Surfaces (surprises the audit's write-up explicitly reflects):**

- **The save-blocked bug has two compounding causes** (no
  people-emit rule + no bands UI render), not one.
- **CATEGORY_ORDER is ~71% dead labels** — 5 of 7 reference
  namespaces that no longer exist.
- **Three live namespaces have no vocab rows** (era, format,
  release_type) and one retired-but-active (exhibit). Lifecycle
  drift broader than the V1B report named.
- **The Museum's tier+alphabetical ordering was already coherent**;
  MV diverged because CATEGORY_ORDER predates the V2.1 refactor.
- **`mp3` is a sub-type of `audio` and both exist as peer `type`
  values** — a smaller overload inside the type-vs-format overlap
  question.
- **`era` is suggested in HR's manifest `notes[]` but never
  committed to `tags[]`** — the same shape as `credit:`. Two
  separate spec/implementation gaps with the same root cause
  (notes-only emission).
- **The 38 inboxed YT cluster-roots from V1 are technically 37 YT
  + 1 pre-existing inbox row**, not 38 from the V1 batch. Minor;
  noted in §1.6.

**Not tested in sandbox:**

- Live MV HTTP API calls (sandbox loopback isolation; carryforward).
- Browser-side rendering of the inbox UI under the proposed fixes.
- Backfill execution itself (this is scoping-only).

---

## §9 — Operator decisions resolved

Resolved in-session 2026-05-24 per GATE 5 (one at a time). The
audit's recommended option carried on every question; resolutions
below carry the brief "why" Cowork surfaced + any cross-decision
reconciliation.

### §9.1 — (resolves §5.1) — Emit + backfill the 38

**DECISION (2026-05-24): Emit `people`/`bands` tag on every HR
cluster + backfill the 38.**

Closes the §3.1 save-blocked bug at its root: the acquisition layer
matches the HR brief §4.1 spec. One-shot reconciliation script
mirrors V1B's `mv_vocab_reconcile_v1B.py` discipline (BEGIN
IMMEDIATE / post-verify / md5 round-trip / Mike-stopped-MV gate).

**Cross-reconciliation with §9.4:** the §5.4 decision re-introduces
the `bands` namespace and migrates `hunter_root` from `people` to
`bands`. So the static tag emitted is `bands:hunter_root` (not
`people:hunter_root`). The validator (R3) checks people OR bands;
either satisfies. `people:nick_root` stays in `people` (Nick is a
person, not a band).

### §9.2 — (resolves §5.2) — Sharpen + rename for clarity

**DECISION (2026-05-24): Keep all four namespaces; rename display
labels.**

- `artifact_kind` display label → "Cluster Role" (slug unchanged).
- `content_kind` display label → "Variant" (slug unchanged).
- `type` and `format` display labels unchanged.
- Document canonical distinctions in `vocabulary.display_name`
  description fields AND in code comments at static-tag composers
  (`yt_archive_capture.py:parent_static_tags/child_static_tags`).
- Also: add `type:` emission for cluster children (currently absent;
  children carry only `artifact_kind`). The medium/role orthogonality
  becomes data-visible.

The four-way distinction holds; the slug names mask it. Renaming
display labels (not slugs) closes Mike's "what's the difference?"
finding without breaking back-compat with existing tags.

### §9.3 — (resolves §5.3) — Keep both, sharpen rules

**DECISION (2026-05-24): Author and Scope stay distinct; gating
rules sharpen.**

- `scope:hunter_root` — emitted unconditionally on every HR-exhibit
  cluster artifact (parent + every child). Means "this artifact
  belongs to the HR project."
- `author:<channel_slug>` — emitted unconditionally for HR's own
  channel content (`author:hunter_root` when YT channel ==
  Hunter Root). For fan content (YT channel != HR), emit
  `author:<channel_slug>` and `credit:<channel_slug>` per the
  V1B §3 future-scope channel-aware rule + HR brief §9.3.

The redundancy is benign now and becomes load-bearing when fan
covers arrive. Implementation: extend HR's `parent_static_tags` to
read `metadata['channel_id']` and gate `AUTHOR_SLUG`. Future-scope
in V1B §3 names this exactly.

### §9.4 — (resolves §5.4) — Re-introduce Bands as its own group

**DECISION (2026-05-24): Bands is a separate tier-1 namespace.
Migrate.**

Migration shape (one-shot script, V1B-discipline):

- Add `bands` to `vocabulary` (tier 1; sort_order picks per §9.5;
  display_name "Bands").
- Migrate `people:hunter_root` (81 instances) → `bands:hunter_root`.
- Keep `people:nick_root` (1 instance) in `people`.
- Add `bands:hunter_root` to HR's `COMMON_STATIC_TAGS` (replaces
  the `people:hunter_root` emit from §9.1).
- JS port of R3 in `mediavault.html` stays as the disjunct
  `countInCategory('people') === 0 && countInCategory('bands') === 0`
  — this is now CORRECT (matches the dual-category reality).
- `attention_rules.py` R3: re-introduce the disjunct check (revert
  the V2.1 collapse), keep the warning slug `missing_category:people_or_bands`
  (now accurate again).
- `CATEGORY_ORDER` in `mediavault.html` gets replaced wholesale per
  §9.5 — `bands` falls out of that constant's job.

Net: validator stays expressive (catches both a band-name and a
person-name mention case). Mike's mental model is restored.

### §9.5 — (resolves §5.5) — sort_order, both surfaces

**DECISION (2026-05-24): Both MV inbox and Museum tabs honor
`vocabulary.sort_order`.**

Implementation:

- MV's `/api/tags` response: include `tier` + `sort_order` per row
  (already in the table; expose them).
- MV's `mediavault.html`: replace `CATEGORY_ORDER` constant with a
  sort `(tier asc, sort_order asc, namespace asc)` for the live
  tag-group rendering. The 7-entry hardcoded list goes away.
- Museum's `hr_dimensions.js`: extend `buildDimensions` to read
  `sort_order` from the registry; sort namespaces by `(tier,
  sort_order, ns)` instead of alphabetical.
- Unregistered namespaces fall through to tier 3 + alphabetical
  (matches the Museum's existing fallback).

Post-resolution tier-1 sort order:
`year=1, album=2, song=3, venue=4, people=5, bands=6` (bands lands
at the end of tier 1 alphabetically after the renumber; operator
may re-order via UPDATE if a different position is preferred).
Post-resolution tier-2 sort order:
`source=1, type=2, format=3, release_type=4` (per §9.8 registration).
Post-resolution tier-3 sort order: `author=2, scope=4, artifact_kind=5,
content_kind=6, era=N` (era's slot picks below).

### §9.6 — (resolves §5.6) — Latest-first chronological

**DECISION (2026-05-24): Albums sort latest-first by release_date.**

Implementation:

- Extend SPINE (`src/data/artists/hunter-root.js`) with
  `release_date` field per album. Eight albums: Mike fills the
  values once.
- Extend `tools/export-artifacts.mjs` to emit a per-album
  `value_order` array in `vocabulary.json` for the `album`
  namespace.
- Museum's `buildDimensions` and MV's `/api/tags` consult the
  emitted order for `album` values.

Reverse-chronological direction: Crooked Home (most recent) →
... → Medusa's Disco (earliest). New material at the top.

### §9.7 — (resolves §5.7) — Song by album+track; collapse on any-on

**DECISION (2026-05-24): Songs sort by (album order, track order);
groups auto-collapse the moment any pill in them is `on_*`.**

**Song sort:**
- SPINE `tracks` array index per album IS the track number.
- Album order per §9.6 (latest-first chronological).
- Sort key: `(album_order, track_index)`.
- Songs not in SPINE fall through to alphabetical tail.

**Collapse behaviour:**
- Re-wire `<details>/<summary>` for each `.pillCategory` group.
  CSS selectors at `mediavault.html:152-162` are already in place;
  they're currently unused per V0.6 Item 8d follow-up.
- Auto-collapse rule: the moment any pill in a group transitions to
  `on_confident` OR `on_uncertain`, the group collapses. Header
  remains visible showing the count + `⚠️` warning if applicable.
- Toggling a pill OFF re-opens the group automatically (operator's
  re-evaluation in progress).
- APPLIED strip at the top stays as-is (the accumulated view).

V0.6 Item 8d follow-up C5/C6's rationale ("hiding any of it is
friction") is explicitly reversed by this decision; new posture:
collapse-on-answered is the friction reducer once Mike's made a
call.

### §9.8 — (resolves §5.8) — era=1, format=2, release_type=2

**DECISION (2026-05-24): Register the three; era to tier 1, format
+ release_type to tier 2.**

One-shot `_cowork/mv_register_unregistered_v1.py` (idempotent;
abort-on-surprise; same shape as V1B's reconcile script):

- INSERT `era` into `vocabulary`: tier=1, sort_order=6 (after
  bands per §9.5), display_name="Era".
- INSERT `format` into `vocabulary`: tier=2, sort_order=3 (after
  source, type), display_name="Format".
- INSERT `release_type` into `vocabulary`: tier=2, sort_order=4
  (after format), display_name="Release Type".
- `exhibit`: stays retired. Documentation: route-only, not a
  content tag. Code comment at the Museum's `hr_dimensions.js:133`
  cites this decision date.
- `unsorted`: stays retired. 185 live instances stay as triage
  pollution; cleanup is per-pill judgment during release review
  (operator-only, per §6.3 carryforward).

---

*All §5 decisions resolved 2026-05-24 in-session. The recommended
option carried on every question; cross-decision reconciliation
(§9.1 × §9.4 → emit `bands:hunter_root` not `people:hunter_root`;
§9.5 × §9.8 → era lands at tier-1 sort 6, format/release_type at
tier-2 sorts 3/4) folded inline. Implementation roadmap in §6
sequences accordingly.*

