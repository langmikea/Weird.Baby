# DATA ARCHITECTURE SPEC — Weird.Baby Museum

**Version:** 1.1
**Date:** 2026-05-17
**Type:** As-built data architecture / structure specification. Build contract.
**Audience:** Machine. Future Claude / Cowork sessions and the operator's tooling.
**Supersedes:** v1.0 (2026-05-16). v1.0 failed an adversarial review; the
findings and their disposition are in Appendix A. Read Appendix A before
trusting any section against memory of v1.0.

---

## §0 — Status and scope

### 0.1 What this document is

This is the data architecture of the Museum pipeline **as it actually exists
on disk and in the live database, verified 2026-05-17** against
`mediavault.sqlite`, the tool scripts, `package.json`, and the file system.

Every status claim and every data-shape claim in this document is backed by a
command whose output was inspected. Where the live system is inconsistent with
itself or with project documents, the inconsistency is reported in §8, not
smoothed over. This document is authoritative for the *as-built fact* and for
nothing else.

### 0.2 The honest headline

The pipeline is **built end-to-end but has never run end-to-end into a rendered
exhibit, and is internally inconsistent.** Concretely:

- Every executable stage exists, including the YouTube capture script.
- The YouTube capture script has run exactly twice (both on 2026-05-10, both
  the same video) and registered real data into MV.
- **But no artifact in MV — none of 85 rows — carries a namespaced
  (`namespace:value`) tag.** The tag conventions in §2.6, the export's tag
  regrouping in §6.4, and the museum's tier derivation in §7.3 all describe a
  convention the live data does not follow.
- **No artifact carries an `exhibit:` badge.** The export's discovery query
  therefore matches nothing; `npm run export-artifacts` today writes one empty
  file.
- The live data is **multi-platform** (42 ReverbNation, 16 Facebook, 13 local,
  3 YouTube, others). The YouTube path documented in §2 is one of several
  ingest paths and is not the one that produced most of the data.

A build made against this spec will be correct about the *mechanics* of each
stage. It must not assume the pipeline currently delivers data to an exhibit —
it does not. See §8 for the gap register.

### 0.3 What this document is NOT

- Not the 3-table generic redesign in `DATA_ARCHITECTURE_SPEC_v0.1_critique.md`.
- Not vocabulary canon — `docs/CANONICAL_VOCABULARY.md` is that.
- Not a UX spec. UX-facing decisions are the operator's.

### 0.4 Pipeline status at a glance

| Stage | Component | Status (verified 2026-05-17) |
|---|---|---|
| 1. YT validation wrapper | `tools/yt-ingest.mjs` | BUILT |
| 1. YT capture/register engine | `Hunter Root/tools/yt_archive_capture.py` | **BUILT** — 880 lines, ran 2x on 2026-05-10 |
| 2. Manifest | `yt_archive/v1` schema | DESIGN-LOCKED (v1.1) |
| 3. Register | MV `POST /api/artifact-register` | BUILT (MV v0.5.2) |
| 4. MV storage | `artifacts` + `tags` tables | BUILT, live: 85 artifacts, 69 tags |
| 5. Export | `tools/export-artifacts.mjs` | BUILT — but produces empty output today (§5.7) |
| 6. Exhibit JSON | `src/data/exhibits/<name>.json` | BUILT — currently one empty file |
| 7. Museum consumption | Vite static import + deck render | BUILT |
| (build) | `prebuild` → `build-deep-tags-vocabulary.mjs` | BUILT (§1.4) |

No stage is missing an executable. The pipeline's problem is not absence of
code; it is that the data in MV does not match the conventions the later
stages require (§8.3, §8.4).

### 0.5 Sources verified for this version

Live DB `C:\AI\Platform\MediaVault\core\mediavault.sqlite`; `tools/
export-artifacts.mjs`; `tools/yt-ingest.mjs`; `package.json`;
`docs/ingest-log.md`; both `NAVIGATION.md` files (Museum and MV, full paths in
§8.2); `tools/youtube-ingest-schema.md`; `docs/CANONICAL_VOCABULARY.md`;
`docs/DEEP_DIVE_PHASE0_AUDIT.md`; grep of MV `*.py`/`*.mjs` for id-mint logic
and `vocabulary`-table access; existence check of `yt_archive_capture.py`.

---

## §1 — Pipeline overview

### 1.1 The seven stages (YouTube path)

```
[1] YouTube                  yt-ingest.mjs validates against SPINE,
     |                       shells out to yt_archive_capture.py (BUILT)
     v
[2] yt_archive/v1 manifest   mediavault_manifest.json, one folder per video
     v
[3] POST /api/artifact-register   one HTTP call per artifact, parent first
     v
[4] MediaVault SQLite        artifacts + tags tables. 127.0.0.1:51822.
     |                       Source of truth. Loopback only.
     v
[5] export-artifacts.mjs     operator runs `npm run export-artifacts`;
     |                       pulls /db blob, queries released artifacts
     v
[6] src/data/exhibits/<name>.json   per-exhibit JSON, committed to the repo
     v
[7] Vite build               static import; React deck derives pill columns
```

**This diagram is the YouTube path only.** It is not the only way artifacts
enter MV — see §2.8. It is the path the in-repo tooling
(`tools/yt-ingest.mjs`, `tools/youtube-ingest-schema.md`) is built for, and the
path NAVIGATION.md names as the Museum-owned pipeline.

### 1.2 Trigger model

Operator-triggered at three points: **ingest** (`yt-ingest.mjs` per video),
**export** (`npm run export-artifacts`, deliberate, never automatic), and
**build/deploy** (`npm run build` / `deploy`). Curation (review, release) is
manual operator work in the MV Inbox UI between ingest and export.

### 1.3 The build/MV boundary — load-bearing invariant

**The Vite build never reads MediaVault.** MV is loopback-only; a build host
cannot reach it. The only component that contacts MV is `export-artifacts.mjs`,
run by hand on the MV host. The build consumes the committed JSON.

Build-time scripts and their MV-contact status (all verified):
- `vite build` — no MV contact.
- `prebuild` → `tools/build-deep-tags-vocabulary.mjs` — reads
  `docs/deep-dive-vocabulary.csv`, writes `src/data/deep-dive-vocabulary.json`.
  **No network, no MV.** (§1.4.)
- `export-artifacts.mjs` — contacts MV, but is **not** part of `npm run build`;
  it is a separate manual command.

So a build can never half-ship MV data. If MV is down, the *export* fails
loudly (§5.6); the build proceeds on the last committed JSON.

### 1.4 The `prebuild` hook

`package.json` defines `"prebuild": "node tools/build-deep-tags-vocabulary.mjs"`.
npm runs it automatically before `npm run build`. It transforms the legacy
vocabulary CSV into a JSON file for the bundle. It does not touch MV and is not
part of the artifact data path. It is documented here only because v1.0 of this
spec incorrectly claimed no `prebuild` hook existed (Appendix A, C2).

---

## §2 — Stage 1-2: capture and the `yt_archive/v1` manifest

### 2.1 `yt-ingest.mjs` — museum-side validation wrapper — BUILT

Location `tools/yt-ingest.mjs`. Node CLI, no dependencies. Validates, then
shells out to the Python capture script; does no fetching or registering.

```
node tools/yt-ingest.mjs --album <id> --track "<title>" --type <variant> \
                         --url <youtube-url> [--credit "Name"] \
                         [--page-save] [--mv-base <url>] [--dry-run]
```

| Arg | Required | Validated against | Failure |
|---|---|---|---|
| `--album` | yes | an `id` in SPINE (`src/data/artists/hunter-root.js`) | exit 1 |
| `--track` | yes | exact track title under that album in SPINE | exit 1 |
| `--type` | yes | one of `official`, `live`, `lyrics`, `cover` | exit 1 |
| `--url` | yes | parseable YouTube watch / `youtu.be` / `embed` URL | exit 1 |
| `--credit` | when `--type cover` | non-empty | exit 1 |
| `--page-save` | no | flag; requests an HTML-snapshot child | — |
| `--mv-base` | no | **default `http://localhost:51822`** (see §8 S1) | — |
| `--dry-run` | no | flag; stages bytes + manifest, skips MV calls | — |

**Exit codes:** `1` museum-side validation failed; `2` Python capture script
not found at the expected path; `127` the `python` interpreter itself could
not be spawned; otherwise inherits the Python script's exit code. Note the
Python script also defines exit `2` (fetch failure) — a `2` from a run that got
past validation is ambiguous between the two meanings (§8 S2).

**SPINE parse method:** reads `hunter-root.js` as **text** and extracts
album/track/video structure by regex (SPINE transitively imports JSX and cannot
be `import`ed in Node). Fragile coupling — see §8.7.

**Side effect:** appends one row to `docs/ingest-log.md` per invocation
(append-only markdown table; header auto-written on first run).

### 2.2 `yt_archive_capture.py` — capture + register engine — BUILT

Location `C:\AI\Projects\Hunter Root\tools\yt_archive_capture.py`. **Verified
present: 880 lines, 36955 bytes, last modified 2026-05-10.** `yt-ingest.mjs`
shells out to it; if it were absent, `yt-ingest.mjs` would exit `2`.

**Run history (from `docs/ingest-log.md`):** exactly two invocations, both
2026-05-10, both album `arkansas` / track `Reverend` / type `official` /
video `7Lttb_59EYw`, both `ok`. The second is a re-run of the first. **The
script works; it has been exercised; it has not been exercised broadly.** One
real YouTube artifact reached MV from it — `MV-20260510-001` (§4.6).

**Contracted responsibilities** (from `tools/youtube-ingest-schema.md` §9):
walk the YouTube URL; download adjacent assets; write the per-video folder and
`mediavault_manifest.json` in `yt_archive/v1` shape; orchestrate registration
via `POST /api/artifact-register`, parent first, threading the minted parent id
into each child.

**Known nonconformance:** the one artifact this script registered carries
**bare-slug tags, not the namespaced tags §2.6 specifies** (§4.6, §8.4). Either
the script does not emit namespaced tags, or registration flattens them, or the
operator's curation stripped them. This spec cannot say which without reading
the script body — flagged as the top investigation item in §8.4. **Do not
assume this script produces §2.6-conformant output.**

### 2.3 `yt_archive/v1` manifest envelope — DESIGN-LOCKED v1.1

```jsonc
{
  "schema_version": "yt_archive/v1",
  "generated_at": "<ISO8601>",
  "page_type": "youtube_video",
  "canonical_url": "https://www.youtube.com/watch?v=<video_id>",
  "video_id": "<video_id>",
  "channel_id": "<channel_id>",
  "channel_name": "<display name>",
  "channel_url": "https://www.youtube.com/channel/<channel_id>",
  "artifacts": [ /* §2.4 */ ],
  "curator_review_required": []
}
```

A separate channel-scope manifest is emitted once per channel under `_channel/`.

### 2.4 Per-artifact entry shape

```jsonc
{
  "mv_id": null,                 // null until registered; MV mints the id (§3.1)
  "type": "<artifact type, §2.5>",
  "fact1": "short description",
  "fact2": "longer description",
  "weight": 1.0,
  "era": "<era_slug>",
  "src": "source URL",
  "date": "YYYY-MM-DD",
  "date_source": "youtube_api | scrape | unknown",
  "tags": [ /* §2.6 */ ],
  "files": { /* §2.5 */ },
  "extracted_text": "...",
  "parent_role": "parent | child",
  "notes": []
}
```

`parent_role` is the orchestration hint. The retired `parent_ref` mechanism is
not used — MV has no within-manifest reference resolver; linkage is API-only
(§3.2). (The "retired" status of `parent_ref` is asserted by
`tools/youtube-ingest-schema.md`; not independently re-verified here — §8 S7.)

### 2.5 Artifact types

| Type | Scope | storage_mode | media_type | Notes |
|---|---|---|---|---|
| `youtube_video_page` | video | `url_only` | `link` | parent; `extracted_text` = description |
| `youtube_thumbnail` | video | `vaulted` | `photo` | maxres JPEG; bytes copied to `catalogs/_assets/` |
| `youtube_transcript` | video | `url_only` | `text` | transcript in `extracted_text`; no file |
| `youtube_page_save` | video | `vaulted` | see §8 S9 | HTML snapshot; `media_type` value disputed |
| `youtube_channel_card` | channel | `url_only` | `link` | one per channel; separate manifest |

`vaulted` children pass a real absolute `local_asset_path` (must exist under
`C:\AI\`). `url_only` artifacts pass `local_asset_path: null` (accepted since
MV v0.5.1).

**§8 S9:** `youtube_page_save` is `storage_mode: vaulted` (a real local file)
but `tools/youtube-ingest-schema.md` labels it `media_type: link`. A vaulted
file labelled as a link is internally inconsistent. The correct `media_type`
for a stored HTML file is unresolved; flagged, not decided here.

### 2.6 Pill namespace conventions — SPECIFIED BUT NOT PRESENT IN LIVE DATA

This subsection documents the *intended* tag convention. **Verification
2026-05-17: zero of 85 artifacts in MV carry any `namespace:value` tag.** This
convention is specified by `tools/youtube-ingest-schema.md` and assumed by the
export (§6.4) and the museum (§7.3), but is **not implemented in the live
data.** Treat everything in §2.6 as a target, not an as-built fact. See §8.4.

Intended — parent (`youtube_video_page`): `content_kind:<official|live|lyrics
|cover>` (the only place `content_kind:` appears), `platform:youtube`,
`scope:<project_slug>`, `author:<artist_slug>`.

Intended — children: `artifact_kind:<thumbnail|transcript|page_save>`, plus
`platform:`, `scope:`, `author:`.

Intended — channel card: `artifact_kind:channel_card`, plus `platform:`,
`scope:`, `author:`.

Proposed pills (`era:`, `rarity:`, `topic:`) are intended to arrive as
`notes[]` entries prefixed `suggest_pill:`, promoted by the operator.

**As-built reality:** the one YouTube artifact registered to date
(`MV-20260510-001`) carries tags `["2023","arkansas","defiant","digital",
"hunter_root","music-video","official","reverend","snarky","video"]` — all
bare slugs, no namespaces. The ReverbNation artifacts carry
`["audio","hunter_root","mp3","reverbnation","run_with_the_hunt"]` — likewise
bare. The namespaced convention exists only in documentation.

### 2.7 Folder layout

```
C:\AI\Projects\Hunter Root\archive\youtube\<channel_slug>\
  _channel\  mediavault_manifest.json   (channel_card; once)
  <video_id>\
    mediavault_manifest.json            (parent + children)
    thumbs\  snapshots\  transcripts\  capture.log
```

One folder per video; each manifest independently re-runnable. Re-run skips any
artifact whose `mv_id` is non-null.

### 2.8 Other ingest paths into MV — NOT covered by this spec's stage 1-3

MV is a multi-project, multi-platform vault. The live `artifacts` table
(whole-table `source_platform` counts, verified 2026-05-17):

| `source_platform` | rows |
|---|---|
| reverbnation | 42 |
| facebook | 16 |
| local | 13 |
| other | 7 |
| youtube | 3 |
| instagram | 1 |
| (null) | 3 |

The YouTube path (§2.1-2.7) accounts for 3 of 85 rows. The majority arrived via
other paths — notably a ReverbNation path (`rn_archive/v1`, the sibling schema
referenced by `tools/youtube-ingest-schema.md`) and migration seed scripts in
MV's `_cowork/` (e.g. `v05_phase1_migration.py`). **Those paths are real and
feed the same `artifacts` table this spec's stages 4-7 read, but their
capture/manifest contracts are out of scope here.** Stages 4-7 are
platform-agnostic and cover all of them; stages 1-3 are the YouTube path only.
A complete portfolio data-architecture spec would document each ingest path;
this document does not, and that is a scope boundary, not an omission to fix
silently.

---

## §3 — Stage 3: Registration into MediaVault

### 3.1 `POST /api/artifact-register` and id minting

Endpoint `http://127.0.0.1:51822/api/artifact-register` (MV v0.5.2,
`core/imgserver_extensions.py`). One artifact per call; no batch endpoint.
Validates enums, slugifies tags, mints the id.

**Id format — two forms exist in the live database.** The current mint function
(`core/imgserver_extensions.py` `_next_artifact_id`, line ~185; and
`core/db_setup.py` line ~113) produces:

```
MV-YYYYMMDD-NNN          e.g. MV-20260510-001
```

`YYYYMMDD` is the date, `NNN` a 3-digit zero-padded daily sequence from the
`id_sequence` table (keyed on `date_str` alone — §4.4). **No scope segment.**

The database **also contains legacy ids of the form `MV-XX-YYYYMMDD-NNN`**
(e.g. `MV-HR-20260417-001`), created by the one-off migration
`_cowork/v05_phase1_migration.py`. MV's own id-parsing regex
(`core/migrate_to_v04.py` line ~470) is `^MV-(?:[A-Z]{2}-)?(\d{8})-(\d+)$` —
the two-letter scope segment is **optional**, present only on migration-era
rows.

**Contract for any consumer parsing artifact ids:** accept both
`MV-YYYYMMDD-NNN` (current) and `MV-<XX>-YYYYMMDD-NNN` (legacy). The regex
above is the authoritative shape. Newly minted ids will not have the scope
segment.

(v1.0 of this spec stated `MV-YYYYMMDD-NNN` as if uniform — wrong, legacy rows
exist. The v1.0 adversarial review stated `MV-<scope>-YYYYMMDD-NNN` as the
format — also wrong, that is the legacy form, not the minted one. Both forms
coexist; this is the corrected account. Appendix A, C4.)

### 3.2 Parent linkage — API-only

No within-manifest reference resolution exists. The capture script registers
the parent, captures the returned `id`, then registers each child with
`parent_artifact_id` set to it. `parent_artifact_id` is a self-FK on `artifacts`
with `ON DELETE CASCADE`. A child registered before its parent lands with
`parent_artifact_id: null` and must be fixed in the MV Inbox.

### 3.3 Partial-failure behavior

One POST per artifact; a mid-manifest crash leaves a partial set in the Inbox.
The capture script writes `mv_id` back into the manifest after each success, so
re-running resumes and skips registered rows.

### 3.4 R-rule expectations

R1 (social post missing `post_date`) and R4 (capture missing `scope` pill)
should not fire — the capture script supplies `post_date` and `scope:`
directly. Any other R-rule firing on YT-ingest rows is a capture-script bug.

---

## §4 — Stage 4: MediaVault storage (live schema)

Transcribed from `C:\AI\Platform\MediaVault\core\mediavault.sqlite`, verified
2026-05-17. Authoritative for the as-built schema. Where it conflicts with MV's
`SPEC.md` or either `NAVIGATION.md`, the live schema wins; conflicts logged in §8.

### 4.1 Server and access model

Binds `127.0.0.1:51822` only; loopback is the entire security model; no auth.
CORS permissive. The browser SPA reads the whole DB via `GET /db` and queries
it in-process with `sql.js`. No per-artifact read endpoint. Writes go through
JSON API endpoints.

### 4.2 `artifacts` table — live DDL

The DDL below is the live `sqlite_master` text. Column alignment is the
original source indentation; `archived_at` is appended to the `updated_at`
line in the source, reproduced faithfully.

```sql
CREATE TABLE "artifacts" (
                id                      TEXT PRIMARY KEY,
                source_url              TEXT,
                source_platform         TEXT,
                ingest_source           TEXT,
                ingest_date             DATE NOT NULL,
                storage_mode            TEXT NOT NULL DEFAULT 'vaulted'
                                            CHECK(storage_mode IN ('vaulted','referenced','url_only')),
                local_asset_path        TEXT,
                thumbnail_path          TEXT,
                link_status             TEXT CHECK(link_status IN ('live','dead','local-only')),
                parent_artifact_id      TEXT,
                media_type              TEXT,
                post_date               DATE,
                post_date_confidence    TEXT CHECK(post_date_confidence IN
                                            ('extracted','manual','estimated','unknown')),
                capture_date            DATE,
                status                  TEXT NOT NULL DEFAULT 'vault'
                                            CHECK(status IN ('inbox','vault','released','archived')),
                released_at             TEXT,
                released_by             TEXT,
                description_short       TEXT,
                description_long        TEXT,
                extracted_text          TEXT,
                tags                    TEXT NOT NULL DEFAULT '[]',
                confidence_flags        TEXT,
                notes                   TEXT,
                created_at              TEXT NOT NULL,
                updated_at              TEXT NOT NULL, archived_at TEXT,
                FOREIGN KEY (parent_artifact_id) REFERENCES "artifacts"(id) ON DELETE CASCADE
            );
```

**Indexes:** `idx_artifacts_ingest_date`, `idx_artifacts_parent`,
`idx_artifacts_post_date`, `idx_artifacts_source_url`, `idx_artifacts_status`,
`idx_artifacts_storage_mode`.

**Field contract notes:**

| Column | Contract fact |
|---|---|
| `id` | Two forms — `MV-YYYYMMDD-NNN` (current mint) and legacy `MV-XX-YYYYMMDD-NNN` (§3.1). |
| `status` | `inbox`, `vault`, `released`, `archived`. **No `deleted` value** (see §8.2). Export filters `status='released'`. Live: vault 65, released 19, inbox 1. |
| `archived_at` | TEXT timestamp; soft-delete marker. NULL = not archived. Export filters `archived_at IS NULL`. |
| `parent_artifact_id` | Self-FK, `ON DELETE CASCADE`. NULL = top-level. Export pulls parent-only rows. |
| `tags` | TEXT, `NOT NULL DEFAULT '[]'`. JSON array of strings. **Live data: every value is a bare slug; no `namespace:value` tag exists anywhere (§4.6, §8.4).** |
| `media_type` | Free TEXT, no CHECK. **Distinct live values (whole table): `link`, `mixed`, `photo`, `text`, `text-only`, `video`, and NULL.** Not the `{link,photo,text}` set v1.0 claimed. |
| `source_platform` | Free TEXT. Distinct live values: see §2.8. |
| `description_short` / `description_long` | Become exhibit JSON `title` / `description`. |
| `released_at` | TEXT timestamp, set on release; passed to exhibit JSON. |
| `released_by` | TEXT, set on release. Present in DDL; not consumed by the export. Listed here for completeness (v1.0 omitted it — Appendix A, S4). |
| `post_date` / `post_date_confidence` | Publish date and provenance enum. |

### 4.3 `tags` table — live DDL

```sql
CREATE TABLE "tags" (
                slug         TEXT    NOT NULL,
                display_name TEXT,
                description  TEXT,
                category     TEXT,
                is_exclusive INTEGER NOT NULL DEFAULT 0,
                is_proposed  INTEGER NOT NULL DEFAULT 0,
                usage_count  INTEGER NOT NULL DEFAULT 0,
                created_at   TEXT
            );
```

**Indexes:** `idx_tags_category`; `idx_tags_proposed`;
`idx_tags_slug_category` = `UNIQUE(slug, category)`;
`idx_tags_slug_when_null_cat` = `UNIQUE(slug) WHERE category IS NULL`.

Uniqueness is composite-with-a-null-guard: a slug may repeat across distinct
categories, is unique within a category, and is unique among category-less
tags. This is more precise than the "composite `(slug, category)`" phrasing in
both `NAVIGATION.md` files and in MV's `SPEC.md` — all three omit the
null-guard index (§8.2).

**Relationship to `artifacts.tags`:** the `tags` table is the vocabulary
registry (display names, categories, usage counts). The artifact↔tag
association is the JSON array in `artifacts.tags`. The export reads **only**
`artifacts.tags`; it does not join the `tags` table. `is_proposed` is inert for
the pipeline. Live: 69 tag rows.

### 4.4 Other tables

- `ingest_queue` — intake staging; `queue_id` PK; `status IN
  ('pending','keep','skip','enriched','approved','failed')`;
  `updated_at TEXT NOT NULL DEFAULT (datetime('now'))`. 35 rows. Not read by
  the export.
- `id_sequence` — `date_str` TEXT PK, `last_seq` INTEGER. Backs id minting.
  Keyed on date only — there is no scope partition (confirms §3.1: the scope
  segment cannot come from sequence allocation; it is a legacy-id artifact).
- `sqlite_sequence` — SQLite internal.

### 4.5 The `vocabulary` table — PRESENT, SEEDED BY A ONE-OFF SCRIPT, NOT IN THE PIPELINE

```sql
CREATE TABLE vocabulary (
    id           TEXT PRIMARY KEY,
    kind         TEXT NOT NULL CHECK (kind IN ('namespace','value','tab')),
    slug         TEXT NOT NULL,
    display_name TEXT NOT NULL,
    tier         INTEGER,
    namespace_id TEXT,
    sort_order   INTEGER,
    retired_at   TEXT,
    created_at   TEXT NOT NULL,
    updated_at   TEXT NOT NULL
);
```

**Indexes (v1.0 omitted these — Appendix A, C9):**
- `idx_vocabulary_kind_ns_slug` = `UNIQUE(kind, namespace_id, slug)`
- `idx_vocabulary_kind_slug_when_ns_null` = `UNIQUE(kind, slug) WHERE namespace_id IS NULL`
- `idx_vocabulary_kind_tier_sort` = `(kind, tier, sort_order)`

92 rows (20 namespace, 3 tab, 69 value), all sharing one `created_at`
(`2026-05-13T23:35:33.535Z`).

**Who touches it (grep of MV `*.py`/`*.mjs`, verified):** two one-off scripts in
MV's `_cowork/` directory — `v10_add_vocabulary_table.py` (creates the table,
`INSERT INTO vocabulary`, the 2026-05-13 seed) and
`v09_phase_v5_6_recanonicalize_reverend.py` (removes specific rows). **No
runtime pipeline code — not the HTTP server, not the export, not the museum —
reads this table.** MV's `/api/deep-dive-vocabulary` endpoint reads the CSV
file `docs/deep-dive-vocabulary.csv`, not this table.

**Verdict:** the table is the partially-built `vocabulary` structure from the
unadopted "Spec A" redesign — created and seeded by migration scripts on
2026-05-13, then left unwired. It is **not part of the pipeline this document
specifies.** It is documented here so future sessions do not mistake it for a
live component. Do not read from or write to it as pipeline work. Disposition
(drop it, or finish wiring it) is a separate operator decision (§8.5).

(v1.0 called it "abandoned scaffolding … read by nothing." The grep refines
that: it was *created and written* by one-off migration scripts, and is *read*
by no runtime code. "Read by nothing" was correct for runtime; "abandoned"
understated that real migration scripts built it deliberately.)

### 4.6 The released-data reality

The 19 released, non-archived, parent artifacts, verified 2026-05-17:

- 15 `source_platform='reverbnation'`, `media_type='mixed'`, identical
  bare-slug tags `["audio","hunter_root","mp3","reverbnation",
  "run_with_the_hunt"]`.
- 1 `youtube` / `link` — `MV-20260510-001`, bare-slug tags (§2.6).
- 1 `facebook`, 1 `local`, 1 NULL platform — `media_type` NULL, tags `[]`.

**None of the 19 carries an `exhibit:` tag. None carries a `namespace:value`
tag.** These two facts drive §5.7 and §8.3-8.4.

---

## §5 — Stage 5: Export (`export-artifacts.mjs`)

### 5.1 Trigger and purpose — BUILT

Location `tools/export-artifacts.mjs`. Node, depends on `better-sqlite3`.
Invoked manually: `npm run export-artifacts`. **Deliberate operator action,
never automatic.** It is not part of `npm run build`. (It is distinct from the
`prebuild` hook, §1.4, which is automatic but never contacts MV.)

```
node tools/export-artifacts.mjs [flags]
  --mv-base <url>      default http://127.0.0.1:51822   (note §8 S1: differs
                       from yt-ingest.mjs's localhost default)
  --output-dir <path>  default src/data/exhibits
  --dry-run            compute + summarize; write nothing
  --verbose            print SQL, row counts, per-artifact detail
  --help
```

### 5.2 Source read

`GET <mv-base>/db` returns the entire MV SQLite file as
`application/octet-stream`. The script writes the blob to a temp file, opens it
read-only with `better-sqlite3`, queries, deletes the temp file on exit.

### 5.3 Queries

**Exhibit discovery** — distinct exhibit names across released, non-archived
artifacts:
```sql
SELECT DISTINCT substr(value, 9) AS exhibit_name
FROM artifacts, json_each(tags)
WHERE status = 'released'
  AND archived_at IS NULL
  AND value LIKE 'exhibit:%'
ORDER BY exhibit_name;
```
`substr(value, 9)` strips the `exhibit:` prefix. Discovered names are validated
against `^[a-z0-9_-]+$`. **Verified 2026-05-17: this query returns zero rows
against the live DB** — no released artifact carries an `exhibit:*` tag.

**Per-exhibit pull** — parent rows badged for the exhibit:
```sql
SELECT a.id, a.source_url, a.source_platform, a.media_type,
       a.tags, a.description_short, a.description_long,
       a.post_date, a.post_date_confidence,
       a.released_at, a.parent_artifact_id
FROM artifacts a
WHERE a.status = 'released'
  AND a.archived_at IS NULL
  AND a.parent_artifact_id IS NULL
  AND EXISTS (SELECT 1 FROM json_each(a.tags) WHERE json_each.value = ?);
```
The `exhibit:<name>` badge is a bound parameter. The SELECT pulls 11 columns;
`buildArtifactRecord()` uses 9 — `post_date_confidence` and `parent_artifact_id`
are pulled but dropped (§8 S3).

**No-badge count** — released parent artifacts with no `exhibit:*` tag are
counted for the run summary. **Verified: this count is currently 19 of 19.**

### 5.4 Exhibit set written

One JSON file per exhibit in the union of discovered exhibits and
`KNOWN_EXHIBITS` (a hardcoded array in the script, currently `["hunter_root"]`).
`KNOWN_EXHIBITS` bootstraps a route before any artifact is badged: a known
exhibit with zero artifacts still gets a file containing full `metadata` and
`artifacts: []`. Extending the array is the documented way to introduce a new
exhibit route.

### 5.5 Output record shape

See §6.

### 5.6 Failure behavior — fail loud, never ship stale

- MV unreachable → abort, non-zero exit, message names the URL and
  `launch_mediavault.bat`; no files written.
- MV non-200 → abort, non-zero exit.
- Missing `archived_at` column (historical schema) → targeted diagnostic
  pointing at MV's `db_migrate.py`.
- All-empty result → exit `0`, empty files written (this is not an error path —
  but see §5.7, it is currently the *normal* path).

Because export is decoupled from build, a failed export means no new JSON is
committed; the build keeps using the last committed JSON. Staleness shows in
git, never in a half-built bundle.

### 5.7 Current real behavior — empty output

**As of 2026-05-17, `npm run export-artifacts` writes exactly one file,
`src/data/exhibits/hunter_root.json`, containing zero artifacts.** Discovery
matches nothing (§5.3); `KNOWN_EXHIBITS` forces the one bootstrap file. The
"all-empty result" case in §5.6 is not a corner case — it is the only outcome
the export currently produces. The export is correctly built; it has nothing
conformant to export. This is a data/curation gap (§8.3), not a code defect.

### 5.8 Write semantics

Atomic: serialize to `<name>.json.tmp`, then rename over `<name>.json`. A crash
mid-write cannot leave a truncated file in the build's input set.

---

## §6 — Stage 6: Exhibit JSON structure

### 6.1 Location and naming

`src/data/exhibits/<exhibit_name>.json`, one file per exhibit, `<exhibit_name>`
matching `^[a-z0-9_-]+$`. Committed into the repo; the build's static input.

### 6.2 File shape

```jsonc
{
  "metadata": {
    "exhibit": "<exhibit_name>",
    "exported_at": "<ISO8601>",
    "filter": "released, not archived, badged for this exhibit",
    "vocabulary_csv_sha": "<12-hex>|null"
  },
  "artifacts": [ /* §6.3 */ ]
}
```

`vocabulary_csv_sha` is the first 12 hex of the SHA-256 of
`docs/deep-dive-vocabulary.csv`, or `null` if absent. Provenance stamp only.

### 6.3 Artifact record shape

Produced by `buildArtifactRecord()` in `export-artifacts.mjs`. One record per
released, non-archived, exhibit-badged **parent** artifact. (Zero records are
produced today — §5.7.)

```jsonc
{
  "id": "<MV id, either form per §3.1>",
  "source_url": "<string|null>",
  "source_platform": "<string|null>",
  "media_type": "<string|null>",      // any of the §4.2 values, incl. mixed/null
  "title": "<string>",                // description_short, "" if null
  "description": "<string>",          // description_long, "" if null
  "post_date": "<YYYY-MM-DD|null>",
  "released_at": "<ISO8601|null>",
  "thumbnail_url": "<string|null>",
  "tags": { /* §6.4 */ }
}
```

`post_date_confidence` and `parent_artifact_id` are pulled by the §5.3 SELECT
but are **not** in the record — dropped by `buildArtifactRecord()` (§8 S3).

**`thumbnail_url` synthesis:** if `source_platform === "youtube"` AND
`media_type === "link"`, the export parses the YouTube video id from
`source_url` and synthesizes `https://i.ytimg.com/vi/<id>/maxresdefault.jpg`.
Every other row gets `null`. **Consequence for live data:** of 19 released
parents, exactly one (`MV-20260510-001`) meets both conditions; the 15
ReverbNation rows are `media_type='mixed'` and get `thumbnail_url: null`. The
render layer shows placeholder tiles for all non-matching rows (§7.2).

### 6.4 The `tags` transformation — and why it currently drops everything

`buildArtifactRecord()` splits each tag string on its first `:`. A tag with no
colon is **dropped** (`if (colon <= 0) continue;`). Tags that do split are
grouped into a namespace-keyed object, values de-duplicated and sorted.

```
intended input:  ["platform:youtube","content_kind:live","exhibit:hunter_root"]
intended output: { "content_kind":["live"], "exhibit":["hunter_root"],
                   "platform":["youtube"] }
```

**As-built reality:** every tag on every artifact in MV is a bare slug with no
colon (§4.6). The transformation therefore drops 100% of tags on 100% of
artifacts; every exported record's `tags` object would be `{}`. The
transformation logic is correct *given namespaced input*; the live data is not
namespaced (§8.4). The `exhibit:` namespace, when present, is preserved in the
record and stripped later by the museum render layer (§7.3).

---

## §7 — Stage 7: Museum consumption

### 7.1 Build-time static import — BUILT

Vite + React + React Router, deployed via Cloudflare Workers. Every
`src/data/exhibits/*.json` file is imported as a static ES module at build time
and bundled by Rollup. **No runtime fetch of MediaVault; no runtime fetch of
exhibit data.** Runtime fetches that exist target the museum's own Cloudflare
Worker D1 endpoints (`/api/visits`, `/api/guestbook`, `/api/admin`) — visitor
state, not catalog data.

### 7.2 Render dispatch

The deck dispatches on `media_type`. A `link` artifact with a `thumbnail_url`
renders a poster tile; rows without one render a placeholder. **Non-`link`
media types — `mixed`, `photo`, `text`, `text-only`, `video`, NULL — render
placeholder tiles in the current phase** (per the `export-artifacts.mjs` header
comment: "Non-link media types render a placeholder tile in the deck for this
phase"). Given §4.6, every released artifact except one renders as a
placeholder today.

### 7.3 Pill-column derivation

Pill columns derive from the namespaces present in each artifact's `tags`
object (§6.4), assigned to tiers per `docs/CANONICAL_VOCABULARY.md`: Tier 1
ARTIST (`year, album, song, venue, people`); Tier 2 MEDIA (`source, type`);
Tier 3 DEEP DIVE / "Deep Signals" (everything else, dynamic, hit-count
ordered). `exhibit` is a routing namespace, stripped before tier assignment,
never a visitor pill.

**As-built consequence:** because no live artifact has namespaced tags (§4.6),
the `tags` object on every exported record is empty, and **no pill columns can
be derived from current data.** The tier system is built and correct; it has no
conformant data to act on. See §8.4.

`CANONICAL_VOCABULARY.md` is authoritative for tier membership and labels. The
running deck code currently uses a larger hardcoded dimension set that does not
yet match canon — declared museum work, not a data-architecture defect (§8.6).

---

## §8 — Known gaps, drifts, and defects

Everything here is verified against the live system on 2026-05-17.

### 8.1 The pipeline has never delivered conformant data to an exhibit

Every executable exists and the YouTube capture script has run successfully
(twice). But: no artifact carries namespaced tags (§8.4); no artifact carries
an `exhibit:` badge (§8.3); the export consequently produces empty output
(§5.7). The pipeline is built; it has not been driven end-to-end with
conformant data. This is the single most important fact for anyone planning
work — the next task is not "build a missing piece," it is "make the data
conform to the conventions the built pieces require."

### 8.2 MV drifts — verified, and NAVIGATION.md is accurate

Both `NAVIGATION.md` files (`C:\AI\Projects\weird-baby-museum\NAVIGATION.md`
and `C:\AI\Platform\MediaVault\NAVIGATION.md`) record three MV drifts. Verified:

1. **`status` values.** Live CHECK is `('inbox','vault','released','archived')`
   — no `deleted`. NAVIGATION.md reports: "spec says it should be `deleted`,
   code allows `archived`." **NAVIGATION.md is correct.** MV's `SPEC.md`
   (status "DECISIONS LOCKED") still proposes `status='deleted'`; the live code
   uses `archived`. The drift is between MV's `SPEC.md` and MV's code;
   NAVIGATION.md faithfully relays it. The document out of sync with reality is
   MV's `SPEC.md`, not NAVIGATION.md.
   *(v1.0 of this spec wrongly called NAVIGATION.md "stale." Retracted — see
   Appendix A, C11.)*
2. **`tags.is_proposed`.** Column physically present (`NOT NULL DEFAULT 0`,
   index `idx_tags_proposed`), logically retired. Export never reads it. Inert.
3. **Tag slug uniqueness.** Live: two indexes — `UNIQUE(slug, category)` and
   `UNIQUE(slug) WHERE category IS NULL`. Both `NAVIGATION.md` files *and* MV's
   `SPEC.md` describe this as a single composite `(slug, category)` index,
   omitting the null-guard. All three docs are incomplete on this point; the
   live schema (§4.3) is authoritative.

Integration stance: Stance B (chosen 2026-05-14) — Museum-to-MV integration
proceeds against MV v0.5.2 as-is, with a thin adapter normalizing these drifts,
written as part of integration work. The current `export-artifacts.mjs` already
integrates with MV-as-it-is and is unaffected by drifts 1-3.

### 8.3 No artifact carries an `exhibit:` badge

The export keys exhibit discovery and per-exhibit membership on an `exhibit:`
namespaced tag. Zero of 85 artifacts have one. Until released artifacts are
badged `exhibit:<name>`, the export produces only the empty `KNOWN_EXHIBITS`
bootstrap file. Badging is operator curation work in the MV Inbox.

### 8.4 No artifact carries any namespaced tag — the central inconsistency

`tools/youtube-ingest-schema.md` §4 (§2.6 here) specifies `namespace:value`
tags. `export-artifacts.mjs` §6.4 assumes them. `CANONICAL_VOCABULARY.md` /
§7.3 derive pill tiers from them. **No artifact in MV has one.** The one
YouTube artifact the capture script registered (`MV-20260510-001`) has
bare-slug tags; so do all ReverbNation rows.

Open question, highest-value to resolve: *where does the convention break?*
Candidates — (a) `yt_archive_capture.py` does not emit namespaced tags; (b)
`POST /api/artifact-register` flattens them; (c) operator curation strips them;
(d) the convention was specified but never implemented anywhere. Resolving this
requires reading `yt_archive_capture.py` (880 lines, not yet read) and the
register endpoint. Until resolved, the export and the museum's pill system have
no conformant data and cannot function as designed. **This is the top
investigation item for the next work session.**

### 8.5 The `vocabulary` table — disposition undecided

§4.5: a 92-row `vocabulary` table, built and seeded by one-off `_cowork/`
migration scripts on 2026-05-13, read by no runtime code. It is the
partially-built "Spec A" structure. Whether to drop it or finish wiring it is
an operator decision outside this spec. Until decided, leave it untouched.

### 8.6 Deck dimension code lags `CANONICAL_VOCABULARY.md`

The running deck uses a hardcoded ~12-dimension set; canon defines a smaller
Tier 1/2 and a dynamic Tier 3. Canon is the target; code reconciliation is
declared museum work. Data-architecture-neutral.

### 8.7 `yt-ingest.mjs` parses SPINE by regex

`yt-ingest.mjs` extracts album/track/video data from `hunter-root.js` by text
regex (SPINE imports JSX, cannot be `import`ed in Node). The track regex uses
the character class `[^\]]*` for the `videos` array; a SPINE edit that
introduces a nested `]` inside that array can make a track silently invisible
to the validator, which then fails with "track not found." This is a real
fragility, not merely a "coupling." A SPINE format change is the trigger.

### Serious / minor items (from the v1.0 adversarial review, retained)

- **S1 — `--mv-base` default mismatch.** `yt-ingest.mjs` defaults to
  `http://localhost:51822`; `export-artifacts.mjs` to `http://127.0.0.1:51822`.
  Same destination on a normal host, but `localhost` ≠ `127.0.0.1` is not
  guaranteed on every Windows config. Pick one default in code.
- **S2 — exit-code collision.** `yt-ingest.mjs` uses exit `2` for "Python
  script not found"; the Python script uses exit `2` for "fetch failure." A `2`
  is ambiguous. Renumber or document.
- **S3 — over-selected columns.** §5.3's SELECT pulls `post_date_confidence`
  and `parent_artifact_id`; `buildArtifactRecord()` drops both. Prune the
  SELECT or annotate.
- **S7 — `parent_ref` retirement unverified.** §2.4's claim that `parent_ref`
  is retired comes from `tools/youtube-ingest-schema.md`; not independently
  re-verified here.
- **S9 — `youtube_page_save` media_type.** `storage_mode: vaulted` (a real
  local file) but documented `media_type: link`. Internally inconsistent; the
  correct value is unresolved.
- **Minor:** `ingest_queue.updated_at` has a `DEFAULT (datetime('now'))` (§4.4).
  The §4.2 DDL is the verbatim live source text. Data snapshot figures (85/69)
  are accurate as of 2026-05-17.

---

## §9 — Quick reference: the data contract at each boundary

| Boundary | Shape | Authority |
|---|---|---|
| Capture → Manifest | `yt_archive/v1` JSON, one file/video | `tools/youtube-ingest-schema.md` |
| Manifest → MV | `POST /api/artifact-register`, one call/artifact, parent first | MV `imgserver_extensions.py` |
| MV id format | `MV-YYYYMMDD-NNN` minted; legacy `MV-XX-YYYYMMDD-NNN` also present | §3.1 |
| MV storage | `artifacts` + `tags` SQLite tables | live DB (§4) |
| MV → Export | `GET /db` full SQLite blob | `export-artifacts.mjs` (§5) |
| Export → Bundle | `src/data/exhibits/<name>.json`, record shape §6.3 | `export-artifacts.mjs` (§6) |
| Bundle → Visitor | static import; pill tiers from `tags` namespaces | `CANONICAL_VOCABULARY.md` (§7) |

**Caveat on the last three rows:** the export and museum stages are built and
their contracts are accurate, but they currently operate on non-conformant data
(no namespaced tags, no `exhibit:` badges) and therefore produce empty / unpilled
output. See §8.1, §8.3, §8.4.

---

## Appendix A — Disposition of the v1.0 adversarial review

Every finding from the adversarial review of v1.0, with verdict and the
evidence that settled it. Verdicts: ACCEPTED (v1.0 was wrong, fixed),
ACCEPTED-REFRAMED (finding valid, but the precise fact differs from how either
v1.0 or the review stated it), REJECTED (with reason).

| # | Finding | Verdict | Resolution in v1.1 |
|---|---|---|---|
| C1 | `yt_archive_capture.py` called NOT BUILT; it exists | **ACCEPTED** | File verified: 880 lines, 2026-05-10. Ingest log shows 2 successful runs. §0.4, §2.2 corrected. |
| C2 | Spec says no `prebuild` hook; one exists | **ACCEPTED** | `package.json` has `prebuild`. §1.4 added; §1.3, §5.1 corrected. |
| C3 | NAVIGATION.md path wrong; spec implied `docs/` | **ACCEPTED** | Both files at repo roots, full paths now in §8.2. |
| C4 | Id format wrong | **ACCEPTED-REFRAMED** | v1.0 said `MV-YYYYMMDD-NNN` (uniform — wrong). Review said `MV-<scope>-YYYYMMDD-NNN` (the format — also wrong). Mint logic + regex prove: current mint is `MV-YYYYMMDD-NNN`, legacy `MV-XX-...` rows exist from migration. §3.1 documents both. |
| C5 | ReverbNation path undocumented | **ACCEPTED** | §2.8 added: full platform inventory; §2 scoped to "YouTube path." |
| C6 | `tags` are bare slugs, not namespaced; §6.4 drops them | **ACCEPTED, HARDENED** | Colon query proves *zero* namespaced tags in 85 artifacts. §2.6, §4.6, §6.4, §8.4 rewritten — the convention is unimplemented, not merely absent from sampled rows. |
| C7 | Export produces empty output | **ACCEPTED** | Discovery query returns 0; no-badge count 19/19. §5.7, §8.3 added; §0.4 status downgraded. |
| C8 | `media_type` enum incomplete | **ACCEPTED** | Live values: `link, mixed, photo, text, text-only, video, NULL`. §4.2 corrected. |
| C9 | `vocabulary` indexes missing | **ACCEPTED** | Three indexes transcribed into §4.5. |
| C11 | §8.2.1 wrongly called NAVIGATION.md "stale" | **ACCEPTED** | Retracted. §8.2 now states NAVIGATION.md is accurate and MV's `SPEC.md` is the out-of-sync document. Author error acknowledged. |
| §4.5 "read by nothing" | partially imprecise | **ACCEPTED-REFRAMED** | Grep shows two one-off `_cowork/` scripts create and write it; no *runtime* code reads it. §4.5 reworded — precise on both counts. |
| S1 | `--mv-base` default mismatch | ACCEPTED | §8 S1. |
| S2 | exit-code 127 / 2 collision | ACCEPTED | §2.1, §8 S2. |
| S3 | over-selected SQL columns | ACCEPTED | §5.3, §6.3, §8 S3. |
| S4 | `released_by` unmentioned | ACCEPTED | §4.2 row added. |
| S5 | "all-empty" framed as corner case | ACCEPTED | §5.7 states it is the normal case. |
| S6 | `KNOWN_EXHIBITS` "valid (empty)" imprecise | ACCEPTED | §5.4 states the file has full metadata + `artifacts: []`. |
| S7 | `parent_ref` retirement unverified | ACCEPTED | §2.4 + §8 S7 flag it as doc-sourced, not re-verified. |
| S8 | SPINE regex fragility understated | ACCEPTED | Promoted to §8.7 as a real fragility. |
| S9 | `youtube_page_save` media_type contradiction | ACCEPTED | §2.5 + §8 S9 flag it; value left unresolved. |
| M1 | §4.2 DDL reflowed | ACCEPTED | §4.2 now reproduces the verbatim live source text. |
| M2 | `ingest_queue.updated_at` default unmentioned | ACCEPTED | §4.4. |
| M3 | no freshness window | ACCEPTED | §0.1 / §0.5 date-stamp every claim 2026-05-17. |
| M4 | manifest "v1.1" label unverified | NOTED | `tools/youtube-ingest-schema.md` self-labels Design v1.1; not independently audited. |
| "two id forms" (review's stronger C4 claim) | partially wrong | **REJECTED in part** | The review asserted `MV-<scope>-...` *is the format*. It is not — it is the legacy form. The minted format has no scope segment. v1.1 §3.1 gives the corrected account; the review's underlying observation (scope segments exist in the data) is right, its conclusion about the format was wrong. |

---

*End of specification v1.1. Every status and shape claim verified against the
live system 2026-05-17. The pipeline is built but not yet conformant; §8.1 and
§8.4 are the gating issues. When any stage changes, update the affected section
and the §0.4 table, and bump the version.*
