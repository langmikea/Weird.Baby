# YouTube → Tagging → MediaVault Pipeline — Recon Findings

**Posture:** Read-only. Zero mutations — no edits, no commits, no crawl runs, no MV writes. All numbers pulled live from the working tree at museum HEAD `d4d7eff` and from a read-only (`mode=ro`) open of the MediaVault SQLite DB on **2026-06-08**.

**Repos touched (read-only):**
- `C:\AI\Projects\weird-baby-museum` (museum, HEAD `d4d7eff`)
- `C:\AI\Projects\Hunter Root` (capture/bulk tooling + archive tree)
- `C:\AI\Platform\MediaVault` (the MV SQLite store)

**One stale-doc warning up front:** `tools/youtube-ingest-schema.md` (dated 2026-05-08) repeatedly says the capture CLI is "deferred / not yet written." That is **no longer true** — the capture script and bulk tooling shipped 2026-05-24/25 and have been run successfully. Trust the code and the run reports over that schema doc's status language; the *schema shape* it defines is still largely accurate, with the drift noted in §4.

---

## 1. YT crawl / ingest tooling — what we already have

**Verdict: WORKS (proven, has been run) — but capture is page-scrape, not API; and the channel list is a static snapshot, not a live crawler.**

**The schema & example (read in full):**
- `tools/youtube-ingest-schema.md` — defines the `yt_archive/v1` manifest: one parent `youtube_video_page` (`url_only`, `media_type:link` — the *video itself stays in SPINE, never in MV*) plus children `youtube_thumbnail` (`vaulted` JPEG), `youtube_transcript` (`url_only`, text in DB), optional `youtube_page_save` (`vaulted` HTML), and a once-per-channel `youtube_channel_card`. Registration is parent-first via `POST /api/artifact-register`, threading the minted `MV-YYYYMMDD-NNN` id into each child's `parent_artifact_id`.
- `tools/yt_archive_v1.example.json` — a 4-artifact example (parent + thumbnail + transcript + page_save) with the corrected pill namespaces (`content_kind:` on parent, `artifact_kind:` on children).

**The scripts that actually touch YouTube:**

| File | Role | Output | Runnable? | Deps / creds |
|---|---|---|---|---|
| `weird-baby-museum/tools/yt-ingest.mjs` (412 ln) | Museum-side wrapper. Validates `--album/--track/--type` against SPINE, then shells out to the Python capture script. Appends one line per run to `docs/ingest-log.md`. | ingest-log row; delegates capture | Yes (Node, stdlib only) | Needs SPINE file + the Python script present |
| `Hunter Root/tools/yt_archive_capture.py` (1238 ln) | The real per-video capturer. Scrapes the watch page HTML for title/description/channel/upload-date, pulls the maxres thumbnail from `i.ytimg.com`, optionally saves page HTML, builds the `yt_archive/v1` manifest, and POSTs each artifact to MV. | manifest folder under `Hunter Root\archive\youtube\<chan>\<vid>\` + byte staging under `MediaVault\intake\drop\yt-staging\` + MV rows | Yes (proven) | **stdlib `urllib` only** for metadata/thumbnail — **no YouTube Data API key, no quota, no yt-dlp.** Transcript step needs optional `pip install youtube-transcript-api` (silently skipped if absent). Needs MV server live at `localhost:51822`. |
| `Hunter Root/tools/yt-bulk-acquire.py` (565 ln) | Bulk channel-walk. Iterates the discovered video list, cross-refs SPINE, dedups against MV, shells `yt-ingest.mjs` per eligible video. Modes: `--dry-run` / `--video-id` / `--batch N` / `--all`. | per-video PASS/FAIL/SKIP rollup + triage report | Yes (proven) | stdlib only; same MV-live requirement |
| `Hunter Root/tools/yt-bulk-backfill-tags.py` (509 ln) | Retro-fits the richer tag rules (album/song/year/format/release_type) onto the 38 sparsely-tagged v1 cluster-roots and flips them vault→inbox via `/api/artifact-requeue`. | MV tag/status updates | Yes (proven) | stdlib; MV live |

**Channel/playlist list vs manual:** **Static snapshot, semi-manual.** Bulk acquisition reads `Hunter Root/yt_research/channel_videos.json` — **208 videos**, fields `{ytId, title, published, views}`, dated **2026-04-11**. There is **no live crawler** in the tree that regenerates this file; how it was produced is not recorded in any script I could find (see Unknowns). Of the 208, only **39 are in SPINE**; v1 scope (operator decision 2026-05-23) ingested those 39 and dumped the other **169** (shorts/promos) into a markdown triage report (`yt_research/yt_bulk_triage_*.md`) for manual follow-on. So new content is gated on a video being in SPINE first.

**Evidence it has run:** `docs/ingest-log.md` records ~30 successful `ok` ingests on 2026-05-24 plus earlier tests; `Hunter Root/archive/youtube/hunter-root/` contains **39 per-video folders** (manifest + capture.log + transcripts), matching the 39-SPINE-known scope; run report `Hunter Root/_cowork/YT_BULK_ACQUIRE_V1_RUN_REPORT-20260524T010500Z.md` marks the batch **SHIPPED (38/38)**.

---

## 2. MediaVault data model — what MV is, structurally

**Verdict: WORKS / well-defined. MV is a single SQLite DB; it is the source of truth for the museum's exported data.**

**The store** (`tools/backup_mediavault.py` → `DB = C:\AI\Platform\MediaVault\core\mediavault.sqlite`): a **single SQLite file** (1.95 MB, last modified 2026-06-05), living in the *separate* `Platform\MediaVault` project — **not** inside the museum repo. Tables: `artifacts`, `tags`, `vocabulary`, `ingest_queue`, `id_sequence`, plus sqlite internals.

**The `artifacts` record** (26 columns) — key fields: `id` (`MV-YYYYMMDD-NNN` / `MV-HR-…`), `source_url`, `source_platform`, `media_type`, `storage_mode` (`url_only`/`vaulted`), `local_asset_path`, `thumbnail_path`, `parent_artifact_id` (self-FK — this is how clusters/containers hang together), `status` (`inbox`/`vault`/`released`/`archived`), `released_at/by`, `description_short` (→ museum `title`), `description_long` (→ `description`), `extracted_text` (transcripts/descriptions), `tags` (a JSON array of `namespace:value` slugs), `notes` (JSON), `archived_at`, timestamps.

**How media types are distinguished:** by the `media_type` column. Live distribution (all 185 rows): `link` 71, `photo` 63, `text` 16, `audio` 16, `video` 11, `other` 8. Note the YT pattern: a YouTube *video* is `media_type:link` (the `url_only` watch-page stub), its thumbnail is `photo`, its transcript is `text`. Native `video` rows are Facebook embeds; `audio` rows are ReverbNation tracks; `other` is album/gallery container artifacts.

**Relation to the front-end** — MV is the single source of truth, bridged by one export step:
- `npm run export-artifacts` (`tools/export-artifacts.mjs`, via `better-sqlite3`) reads MV's **released, non-archived, `exhibit:<name>`-badged** artifacts and writes `src/data/exhibits/<name>.json` **plus** a snapshot of MV's registry to `src/data/vocabulary.json`. **The site build never contacts MV** — these committed JSONs are what ship.
- The deck's `ARTIFACTS` = `src/data/exhibits/hunter_root.json` directly.
- The carousel `SPINE` is **also derived from that same export**: `src/data/artists/hunter-root-spine.js` reshapes `hunter_root.json` into the `album → track → video` contract Exhibit.jsx consumes (its header: *"the foundation is the source of truth; this module only reshapes"*). So SPINE is no longer hand-authored.
- The `song` slug is an MV tag (`song:<slug>`), applied at ingest/curation and carried through the export into both surfaces.

So: **MV (SQLite) → export-artifacts.mjs → exhibits/hunter_root.json (+ vocabulary.json) → deck ARTIFACTS and (reshaped) carousel SPINE.** One source of truth, one bridge.

---

## 3. Current contents — what's actually loaded

**Verdict: PARTIAL. Real catalog exists (one artist, Hunter Root), but a lot sits in vault/inbox and tags are heavily parked in the `unsorted:` catch-all.**

**MV totals (185 artifacts):**
- By `media_type`: link 71, photo 63, text 16, audio 16, video 11, other 8.
- By `status`: **released 97**, vault 81, inbox 6, archived 1.
- By structure: 41 root/parent, 144 child.
- By `source_platform`: youtube 96, reverbnation 42, facebook 16, local 12, null 11, other 7, instagram 1.
- **Artist/album:** effectively a single artist — `bands:hunter_root` on 180, `author:hunter_root` on 93. Album spread (by `album:` tag): crooked_home 38, run_with_the_hunt 36, arkansas 29, mimicking…dandelions 15, skipping…thrown 8, medusas_disco 7, life_inside_a_wheel 5, they_finally_cracked_me 3; **44 carry no `album:` tag**.

**Populated vs stub / tags:**
- All 185 rows carry **≥1 tag** (none are literally tag-less), but that overstates richness: **182 of 185 carry an `unsorted:` tag** (the migration catch-all), and **44 lack any of `album:`/`song:`/`year:`** (the music-identity dimensions). So ~141 are "richly" tagged on music identity; ~44 are sparse.
- The most recent coverage audit (§5) measured the *exported* set on metadata completeness: titles/descriptions ~96% present, but `post_date` missing on ~20%, and many YT/FB items render placeholder-only (no thumbnail).

**What actually reaches the museum deck:** `src/data/exhibits/hunter_root.json` (exported 2026-06-05) holds **31 records** (media_type: video 10, link 10, photo 3, other 8). The gap between MV's 97 released and the 31 deck cards is the **144 child artifacts** (thumbnails, transcripts, and the album-track audio re-parented under album containers on 2026-05-31) — children render inside their parent/carousel, not as standalone top-level deck cards. (Exact export inclusion rule for children vs roots is worth a one-line confirm — see Unknowns.)

---

## 4. Tagging vocabulary — taxonomy and enforcement

**Verdict: PARTIAL. The taxonomy is documented and namespace-validated, but tag *application* is manual/operator-curated, there is no value-level allow-list enforcement, and doc/data/registry are drifting.**

**Canon (`docs/CANONICAL_VOCABULARY.md`):** three visitor-facing tiers —
- **Tier 1 ARTIST (locked):** `year, album, song, venue, people`
- **Tier 2 MEDIA (locked):** `source, type`
- **Tier 3 DEEP DIVE (dynamic):** every other namespace, ordered by hit-count; label "Deep Signals."
- `exhibit:` is a **routing tag**, stripped before pill columns render (drives the export's per-exhibit discovery), never shown.
- Canon explicitly notes MV-internal namespaces (`scope`, `content_kind`, `platform`, `author`, `provenance`) route to dynamic Tier 3 and are *not* promoted to Tier 1/2 unless canon is updated first.

**Registry / committed snapshot (`src/data/vocabulary.json`, 19 namespaces):** year/album/song/venue/people/**bands/era** at Tier 1; source/type/**format/release_type/content_kind/card_kind** at Tier 2; unsorted(retired)/author/platform(retired)/scope/artifact_kind/exhibit(retired) at Tier 3. **This already diverges from canon** (canon's Tier 1 is 5 namespaces; the registry has 7, adding `bands`+`era`; Tier 2 has 6 vs canon's 2). The file's own `metadata.manual_edits` note warns these were hand-edited on 2026-06-07 and **must be mirrored into MV's vocabulary table before the next `export-artifacts` or they're overwritten** — i.e. a known fragile, drift-prone hand-sync.

**Dimensions/values seen in the deck come from the live data, not a value allow-list.** Allowed *namespaces* are governed; allowed *values* within a namespace are not centrally enforced — the canonical authority for **slug→namespace** is `docs/SLUG_NAMESPACE_MAP.md` (62/62 live slugs mapped: 15 to visitor groups, 47 parked in `unsorted:`).

**Enforcement tooling (read in full):**
- `tools/build-vocabulary-registry.py` — DROP+CREATE+reseed of MV's `vocabulary` table; Tier 1/2 transcribed from canon (note: this script's hardcoded Tier1/2 = `year,album,song,venue,people` / `source,type` — i.e. it matches *canon*, not the richer `vocabulary.json`, another drift point); Tier 3 auto-discovered from live tags and marked retired.
- `tools/check-vocabulary-registry.py` — fails non-zero if any live-tag namespace lacks a registry row. **Namespace-level only.**
- `tools/verify_slug_coverage.py` / `tools/verify_migration_result.py` — confirm every tag is namespaced (`ns:value`), none bare/malformed, and that the slug map covers 100% of live slugs.
- `tools/migrate_tags_criterion1.py` — one-time migration that namespaced bare slugs using the map (dry-run by default; `--apply` writes + emits a run report).

**Applied manually or scripted?** **Both, but human-gated.** Ingest scripts emit a *proposed* tag set; per the schema and `TAGGING_SYSTEM_AUDIT-20260524`, the operator confirms/adjusts pills in MV's Inbox UI before releasing. `yt-bulk-backfill-tags.py` scripts the *rule-based* portion (album/song/year/format/release_type derived from SPINE + metadata). **There is no semantic auto-tagger** — thematic/`topic:` pills are emitted only as `notes: suggest_pill:` for the operator to decide. So routine identity tags are scriptable; everything judgmental is hand-done.

---

## 5. Coverage / quality state

**Verdict: PARTIAL, and the freshest full audit is ~9 days old (pre-dates the latest export).**

**Latest comprehensive report:** `docs/COVERAGE_AUDIT-20260530-182406.md` (2026-05-30, read-only audit of the then-exported set of 79). Findings, against a *proposed* (un-ratified) definition of "comprehensive coverage" (the term appears in no committed spec):
- Structural badge present: 79/79. Title/description: 76/79. `source_url`/`source_platform`: 75/79. **`post_date` missing: 16/79.** **Renderable asset (thumb or primary): 58/79 — 21 render placeholder-only** (11 FB video + 10 YT link), mitigated by a broken-preview fallback that shipped 2026-05-30. `content_kind` set on only 40/79 (all on YT links; 0 on FB video / RN audio).
- Itemized gaps G1–G8 (blank record, empty photos, missing post_dates, missing thumbnails, content_kind asymmetry, off-spec `content_kind:other`, duplicate FB cards, shared RN source_url).
- **§7 resolution (same day):** 3 blank/empty records un-released (released 91→88; export 79→76). Remaining gaps (G3–G8) left open pending operator rulings.

**Verifier scripts** (`verify_slug_coverage.py`, `verify_migration_result.py`) test **tag well-formedness**, not content coverage — last formal pass was the Criterion-1 migration (`docs/MIGRATION_RUN_REPORT_criterion1-*`, 2026-05-18). CRITERION 7 (museum renders per-exhibit JSON with correct tiers) = COMPLETE (2026-05-19); CRITERION 8 (legacy `tags` table demotion) = CLOSED (2026-05-20). Per instruction I did **not** re-run anything; the above are the committed report outputs and their dates.

**Caveat:** the audit measured a 79/76-artifact export; the current `hunter_root.json` is 31 (re-exported 2026-06-05 after the RWTH album-container re-parenting). So the *specific per-ID gap list is partly stale*; the *classes* of gap (missing post_date, placeholder-only renders, content_kind asymmetry, manual triage backlog) almost certainly persist.

---

## 6. The gap to "load lots of high-grade, fully-tagged YT content"

**Path for one new YT video → fully-tagged MV record → visible in the museum:**

1. **Discover the video** → it must appear in `yt_research/channel_videos.json`. *Manual / stale* — that list is a 2026-04-11 snapshot of 208 videos; no live crawler regenerates it.
2. **Make it SPINE-known** → the video's album/track/type must exist in `src/data/artists/hunter-root.js`, or the wrapper rejects it. *Manual* (hand-edit SPINE). 169 of the 208 discovered videos are currently non-SPINE and sit in a triage report.
3. **Capture + register** → `yt-ingest.mjs` (validates) → `yt_archive_capture.py` (scrapes page, pulls thumbnail, optional transcript, POSTs parent+children to MV). *Automated*, but requires the **MV server running locally** and the operator to run it on the Windows host (the sandbox has no network route to MV).
4. **Enrich tags** → identity tags (album/song/year/format/release_type) via rules in capture or `yt-bulk-backfill-tags.py` (*automated*); thematic/Deep-Signal pills (*manual*, operator confirms `suggest_pill:` proposals).
5. **Curate + release in MV Inbox** → operator reviews each row, confirms pills, sets `exhibit:hunter_root`, flips status to `released`. *Manual, per-artifact.* (The `TAGGING_SYSTEM_AUDIT` "picking out the crumbs" complaint is exactly this step's friction.)
6. **Export + deploy** → `npm run export-artifacts` regenerates `hunter_root.json` + `vocabulary.json`; `sync-assets-to-r2.mjs` pushes vaulted bytes; `npm run build` / `deploy`. *Automated, operator-triggered.*

**Bottlenecks (where the throughput actually dies):**
- **Discovery is manual & stale (steps 1–2).** No live channel crawler; new content requires hand-updating a JSON snapshot *and* SPINE. This is the single biggest blocker to "load lots."
- **The 169-video non-SPINE backlog** is parked in triage with no automated intake path.
- **Per-artifact curation/release (step 5) is fully manual** and is the documented pain point.
- **Tagging is namespace-validated but not value-enforced or semantically auto-applied;** `unsorted:` carries 182/185 rows, so much tagging is parked rather than categorized.
- **Vocabulary drift** between `CANONICAL_VOCABULARY.md`, `src/data/vocabulary.json`, MV's `vocabulary` table, and `build-vocabulary-registry.py` — a manual mirror step that's easy to miss and silently overwritten on export.
- **The MV server must be up and runs are host-only;** no headless/sandbox path, so bulk runs are operator-supervised.
- **Asset coverage:** ~1 in 4 exported items render placeholder-only (no thumbnail), and `post_date`/`content_kind` are unevenly populated across platforms.

---

## Biggest unknowns (couldn't determine read-only; need a decision or a test)

1. **How `channel_videos.json` is/was generated** — no crawler script found. Is there a manual export step, a browser pull, or a tool living outside these repos? Without this, "discover new uploads" has no automation story.
2. **Exact export inclusion rule for children vs roots** — the export header says "every released badged artifact is exported," yet the deck JSON is 31 while MV has 97 released. Strongly implied: children/re-parented rows are embedded in containers rather than emitted as top-level cards. Worth one `--verbose`/`--dry-run` read host-side to confirm the precise filter and the released-but-unbadged count (`Released artifacts with no exhibit badge: N`).
3. **Whether the YT pipeline still runs clean today** — last proven run was 2026-05-24; since then MV schema/status work and the album-container re-parenting landed. A single `--dry-run` (`yt-bulk-acquire.py --dry-run`, no POSTs) would re-confirm without mutating.
4. **Schema-vs-data tag drift** — the data uses `source:youtube` (93 rows) and `platform:youtube` is 0, but the schema doc specifies `platform:youtube`; `platform` is marked retired in `vocabulary.json`. Need a ruling on which namespace is canonical for "this came from YouTube" before bulk-loading more.
5. **The four-way `type` / `format` / `content_kind` / `artifact_kind` overlap** flagged in `TAGGING_SYSTEM_AUDIT-20260524` — resolved in that brief's §9, but whether the resolution was fully applied to live data is not verifiable from the exported snapshot alone.
6. **Multi-artist scope** — everything today is Hunter Root (single exhibit). The `scope:`/`author:` machinery anticipates other artists, but there's no second exhibit to confirm the pipeline generalizes.
7. **"High-grade" and "fully-tagged" are undefined** — like "comprehensive coverage" (which the May-30 audit flagged as absent from all specs), these acceptance bars aren't written down. They need an operator definition before throughput work can be scoped.
