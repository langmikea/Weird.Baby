# Ingest Behavior Audit — Scoping Brief

**Date:** 2026-05-22 (session ~17:00–18:30 UTC)
**Trigger:** Phase C of Audio Delivery closed
(`docs/PHASEC_RUN_REPORT-20260522-170000.md`) and operator asked, at
close: *"What lies between us and just pumping in and classifying new
artifacts?"*. This brief audits MV's current ingest behavior end-to-end,
maps every place a human is required today, and proposes the minimal set
of automations that close the gap between "drop a file" and "released,
tagged, exhibit-badged artifact."
**Scope:** Scoping only. No code, no infrastructure changes, no MV
writes, no museum-side commits except this brief. The deliverable is this
document.
**Status:** AUDIT COMPLETE. Roadmap locked in §5 unless §4's media_type
taxonomy question opens a UX-facing operator call (see §4.3).

---

## §0 — How to read this brief

Mirrors `docs/AUDIO_DELIVERY_SCOPING_BRIEF-20260522-013207.md` structurally
but is reshaped to the audit task per the session brief. §1 documents the
current intake-to-released code path; §2 inventories format support across
the three intake mechanisms surfaced by the read-through; §3 enumerates
every curation gate that has historically demanded a hand-written
`_cowork/*.py` script or operator intervention; §4 audits the `mixed`
media_type taxonomy against live data; §5 is the three-bucket automation
roadmap (mechanical / configurable / operator-only); §6 walks the engine's
predicted behavior against five representative files currently sitting in
`intake/drop/`; §7 names what's out of scope; §8 records what was read,
skimmed, and tested.

All technical findings in §1-§3 are read off live code and live data
(MV's `mediavault.sqlite` at HEAD `0a9e953`, 88 artifacts). §4's
recommendation is locked subject to one UX-facing call. §5's bucket
assignments are locked. §6's walkthroughs are prediction-only — see
§6.1 for the sandbox-feasibility decision.

---

## §1 — Current intake → released path

### 1.1 — Audit-on-entry results

Repository HEADs at session start match the Phase C exit state exactly:

- MV: `0a9e953` — matches Phase C scoping exit. PASS.
- Museum: `5fab185` — Phase C run-report commit. PASS.
- HR: `af1486a` — matches Phase B exit. PASS.

Tracked outputs from Phase C present:

- `docs/AUDIO_DELIVERY_SCOPING_BRIEF-20260522-013207.md` (40,053 bytes)
- `docs/PHASEC_RUN_REPORT-20260522-170000.md` (29,371 bytes)
- 4 Phase C Museum commits (`c44ee51`, `d14c13b`, `24d8720`, `d4d2db2`,
  `5fab185`) visible in `git log`.

MV live state via direct read-only Python `sqlite3` against
`core/mediavault.sqlite` (file:db?mode=ro):

- 88 artifacts total. media_type distribution: photo=25, text-only=22,
  audio=15, video=10, link=7, NULL=4, mixed=3, text=2.
- status: vault=67, released=19, archived=1, inbox=1. The 19 released
  matches the 15 Phase C audio + 3 Phase B photos + 1 Phase 0 link.
- storage_mode: referenced=62, vaulted=22, url_only=4. The dominant
  shape is "MV holds a pointer; bytes live elsewhere (mostly under
  `C:\AI\Projects\Hunter Root\archive\`)."
- ingest_source on artifacts: url-entry=48, local-drop=24,
  extension-capture=14, requeue=2. url-entry is the dominant intake
  mechanism — significant for §1.2.
- 470 tag instances across 88 artifacts; zero fail §3.1 grammar.

`intake/drop/` non-empty: 35 files (19 HEIC iPhone photos, 8 jpg, 5
html, 2 mp3, 1 png). 27 of the 35 have no corresponding `ingest_queue`
row — they are sitting un-queued. See §1.7 and §6.

**Two divergences from the brief's stated environment**, both Ops-level
(no UX implication, no operator decision needed):

1. **MV HTTP at `127.0.0.1:51822` unreachable from Cowork's Linux
   bash sandbox** — connection refused. This is expected: the bash
   sandbox sees its own loopback, not the Windows host's. Worked around
   by reading `mediavault.sqlite` directly via Python's sqlite3 module
   in URI-readonly mode. No HTTP API was exercised in this audit; the
   relevant handlers were read at source instead.
2. **`sqlite3` CLI not installed in the sandbox** — Python's `sqlite3`
   module is, so all queries ran via Python. No functional impact.

PASS. Going-in state intact; the audit proceeded read-only.

### 1.2 — Three intake paths

MV today accepts artifacts through **three distinct code paths**, not
one. The session brief's framing ("drop files in intake/, get released")
implicitly assumes Path A; Path B is where ~55% of current artifacts
actually came from (48 url-entry of 88); Path C is the Chrome extension
flow.

| Path | Entry point | Code | Stops at | Live count |
|---|---|---|---|---|
| **A** | `intake/drop/` filesystem | `python ingest_engine.py scan` | inbox (status='inbox' on artifact, after operator Save) | 24 of 88 (`ingest_source='local-drop'`) |
| **B** | `POST /api/artifact-register` (HTTP) | `core/imgserver_extensions.py:handle_artifact_register` | vault (status='vault' default; can be released directly) | 48 of 88 (`ingest_source='url-entry'`) plus 2 requeue |
| **C** | WB Capture Chrome extension dumps `mv-capture-*.json` (and `.png` screenshot) into `C:\Users\macun\Downloads\` | `ingest_engine.py scan` → `import_extension_captures()` → `queue_capture_json()` | inbox (queue row `status='enriched'` with AI-pre-filled `post_date`) | 14 of 88 (`ingest_source='extension-capture'`) |

There is a fourth de-facto entry surface — HR's `tools/yt_archive_capture.py`
— but it is a CLIENT of Path B (issues POSTs to `/api/artifact-register`
for parent + children), not a separate engine path.

The brief's exact phrase "drop files in intake/, get released, tagged,
exhibit-badged artifacts out" maps cleanly to Path A's `intake/drop/`,
but in practice the most ingested artifacts in MV today (and the 15
audio Phase C just shipped, and HR's YouTube-archive flow) go through
Path B. Any automation roadmap must address all three.

### 1.3 — Path A: `ingest_engine.py scan` (drop folder)

End-to-end code path, read at source from
`core/ingest_engine.py:443-482` (`def scan`) and dependencies:

1. **Sweep `intake/drop/`** for any file whose extension is in
   `SUPPORTED_EXTENSIONS = {.jpg, .jpeg, .png, .gif, .webp, .heic,
   .heif, .mp4, .mov, .avi, .mkv, .bmp, .tiff, .tif}` (line 47).
   Anything else is skipped silently.
2. **Dedup check** via `already_queued(conn, raw_path)` (line 485) —
   matches by full `raw_path` exact equality, then by filename in
   `intake/processed/` or `intake/images/`, then by `LIKE %filename` in
   `ingest_queue`. **No content-hash dedup**; byte-identical files under
   different filenames re-queue.
3. **Insert `ingest_queue` row** with `ingest_source='local-drop'`,
   `status='pending'`, `enrichment_json=NULL` (line 509). At this stage
   there is no artifact row — only a queue placeholder.
4. **EXIF extraction** (`extract_exif`, line 348) using PIL +
   pillow_heif. Pulls `DateTimeOriginal`, `Make`/`Model`,
   `XPTitle`/`XPSubject`/`XPKeywords`/`XPComment`/`XPAuthor`,
   `Copyright`, and GPS coordinates. GPS is reverse-geocoded against
   `nominatim.openstreetmap.org` (line 422) with a 5-second timeout —
   external network call, silent fail on timeout. Tag slugs derived
   from year + XPKeywords are appended to `enrichment_json.tags_proposed`
   (line 438) — a legacy field the inbox UI reads.
5. **`enrichment_json` is patched** into the queue row with EXIF results
   and `storage_mode='vaulted'` defaulted (line 472).
6. **`scan` returns**, prints the count, optionally prompts "Run triage?
   [y/N]" (line 790).

Path A then sits idle until the operator opens MV's web UI and works
through the inbox. The inbox is where:

- The operator assigns `media_type`. **The engine does not set
  `media_type` on Path A queue rows at any point.** This is the
  Phase A §3.6 root cause and §3 of this audit's first gate.
- The operator confirms / suggests / rejects pills per SPEC §2.3's
  three-state model.
- The operator authors `description_short` / `description_long`.
- The operator clicks Save (→ vault), Save & Release (→ released), or
  Scrap (→ delete).

When Save is clicked, the queue row's `enrichment_json` is consumed,
`POST /api/artifact-save` writes the artifact, and (per `process()`
at line 519) a subsequent `python ingest_engine.py process` run does:

7. **Thumbnail generation** via PIL's `Image.thumbnail((400, 400))` →
   JPEG q85 (`generate_thumbnail`, line 616). For `.mp4|.mov|.avi|.mkv`,
   shells out to `ffmpeg -vframes 1` (line 648). For `.heic`, relies on
   `pillow_heif.register_heif_opener()` (called once at module import,
   line 67).
8. **EXIF write** on the thumbnail via `exiftool -ImageDescription
   -XMP:Description -XMP:Identifier -XMP:Source -XMP:Subject`
   (`write_exif`, line 663). Silent skip if `exiftool` is unavailable.
9. **Original move** to `intake/processed/` (`move_original`, line 689)
   — or `send2trash` for `ingest_source='screenshot-pipeline'`.
10. `ingest_queue.status` updated to `'failed'` with `error_message
    ='file-moved'` (line 700). This is a deliberate naming choice that
    means "the file moved on; the queue row is done."

### 1.4 — Path B: `POST /api/artifact-register` (external HTTP)

Defined in `core/imgserver_extensions.py:236-450`
(`handle_artifact_register`). The handler is mounted at
`/api/artifact-register` in `imgserver.py:1703`. Callers include:

- HR's `tools/yt_archive_capture.py` (registers
  youtube_video_page parent + thumbnail / transcript / page-save
  children in dependency order).
- The ReverbNation preservation pipeline (per MV's docstring at
  `imgserver_extensions.py:23`).
- The WB Capture Chrome extension's eventual artifact-creation path
  (when the operator confirms a capture as worth saving).

The handler is materially different from Path A:

- **It infers `media_type` from extension** via
  `_infer_media_type(path)` at line 215. The mapping:
  `{.jpg/.jpeg/.png/.gif/.webp/.heic/.heif/.bmp/.tiff/.tif → photo}`,
  `{.mp4/.mov/.avi/.mkv → video}`,
  `{.mp3/.wav/.flac/.m4a/.ogg → audio}`,
  `{.html/.htm/.pdf → link}`,
  `{.txt/.md/.json → text}`,
  fallback → `'other'`.
- **It writes directly to `artifacts`**, skipping `ingest_queue`
  entirely. Default `status='vault'` (line 297). The inbox is never
  involved; the artifact is "saved" the moment the POST succeeds.
- **It validates strictly** against the enum whitelists at lines 105-123,
  rejects 400 on any out-of-set value, and 409 on duplicate id.
- **Tags are validated via `artifact_tags.validate_artifact_tags`**
  (the strict §3.1 grammar: every tag MUST be `namespace:value`, both
  parts non-empty, namespace `[a-z0-9_]+`, value `[a-z0-9_-]+`, exactly
  one colon). Bare slugs are REJECTED with 400 — not silently dropped.
- **It does NOT generate a thumbnail.** The caller may pass
  `thumbnail_path`; otherwise the artifact has no thumbnail. The
  `/api/thumbgen` endpoint exists but is not auto-called.
- **It does NOT extract EXIF.** The caller may pass `post_date`,
  `post_date_confidence`, etc.; otherwise those fields are NULL.
- **It uses the single coordinated writer** `write_artifact_tags` for
  the tags array (per `artifact_tags.py` §4.5.1's single-writer rule).

The net effect: Path B is a "I already know what this is" entry point.
The caller has done the curation work; MV just records the row. Most
of MV's released audio (the 15 RWTH MP3s) came in via this path, via
HR's archive-capture tooling.

### 1.5 — Path C: extension-capture (Chrome extension)

End-to-end:

1. **WB Capture Chrome extension** drops `mv-capture-<timestamp>.json`
   (and usually a paired `<timestamp>.png` screenshot) into the
   operator's `Downloads/` folder.
2. `ingest_engine.py scan` → `import_extension_captures()` at line 165
   moves the JSON + PNG into `intake/drop/` and `intake/images/`, then
   patches the JSON with `_screenshot_path`.
3. `queue_capture_json(conn, path)` at line 208 parses the JSON and
   creates an `ingest_queue` row with `ingest_source='extension-capture'`,
   `status='enriched'`, and an `enrichment_json` blob that includes
   `description_short`, `description_long`, `extracted_text`,
   `source_url`, `source_platform`, and `pill_states={}` (line 229 —
   author pill auto-emit was rejected by Mike in v0.6, see line 222-228).
4. `ai_preprocess()` at line 273 makes a Claude Haiku call (model
   `claude-haiku-4-5-20251001`) with the post text + capture timestamp
   and asks ONLY for `post_date` and `post_date_confidence`. No tag
   suggestion, no media_type guess, no description extraction (those
   come from the extension's DOM scrape).
5. Queue row sits with `status='enriched'` until the operator opens
   the inbox.

Path C is closer to "automated" than Path A — `post_date` arrives
pre-filled, descriptions arrive pre-filled, the screenshot is paired.
But `media_type` is still NULL on the queue row, and the operator still
must confirm the pill set, set the storage_mode, and click Save.

### 1.6 — Status taxonomy across paths

| Path | Queue row created? | Artifact row created? | Default artifact status | Operator gate to reach `released` |
|---|---|---|---|---|
| A | Yes (`status='pending'`) | No (operator-driven via `/api/artifact-save`) | `vault` (on Save) or `released` (on Save & Release) | Inbox triage (one click) |
| B | No | Yes (immediate) | `vault` (or caller-overridden to `released`) | Caller-driven (no operator gate if caller sends `status='released'`) |
| C | Yes (`status='enriched'`) | No (operator-driven) | Same as A | Inbox triage (one click) |

### 1.7 — Current intake/drop/ queue mapping (33 of 35 ungueued — surfaced)

A cross-check between filesystem and `ingest_queue` rows reveals:

- 33 of 35 intake/drop/ files have **no `ingest_queue` row at all**.
  They are sitting in the filesystem awaiting `scan`. None of the 19
  HEICs, none of the 5 HTMLs, none of the 2 MP3s, none of the JPG
  artist photos, none of 2 of the 4 JPG cover-arts are queued.
- The 2 that ARE queued: one `.png` screenshot (`MV-20260419-002`,
  queue status `keep`) and one `.jpg` (`MV-20260419-004`, queue status
  `keep`); a `.jpg` (`HOMESTEAD_Reboot_Complete.jpg`) was queued and
  skipped (queue status `skip`, requeue origin) and a JPG cover-art is
  associated with the NULL-media_type artifact `MV-20260419-003`.

This is the engine's current behavior, not a bug to fix in this audit
— Mike has not run `scan` recently. The point for the audit: even if
`scan` ran today, it would not pick up the 5 HTMLs or 2 MP3s
(extensions not in `SUPPORTED_EXTENSIONS`). Those 7 files can only
enter MV via Path B today.

---

## §2 — Format support inventory

### 2.1 — Engine `SUPPORTED_EXTENSIONS` (Path A + Path C)

`core/ingest_engine.py:47` defines exactly:

    {.jpg, .jpeg, .png, .gif, .webp, .heic, .heif,
     .mp4, .mov, .avi, .mkv, .bmp, .tiff, .tif}

Photo and video, primarily. Notable omissions from the perspective of
"any artifact in intake/drop/":

- `.mp3`, `.wav`, `.flac`, `.m4a`, `.ogg` — audio. **Not supported by
  the engine.** All 15 RWTH MP3s released in Phase C entered via Path B.
- `.html`, `.htm`, `.pdf` — page snapshots / documents. Not supported.
- `.txt`, `.md`, `.json` — text artifacts. Not supported.

### 2.2 — Register-endpoint `_infer_media_type` (Path B)

`core/imgserver_extensions.py:215-229` covers a much wider set:

| Extension(s) | inferred `media_type` |
|---|---|
| .jpg .jpeg .png .gif .webp .heic .heif .bmp .tiff .tif | `photo` |
| .mp4 .mov .avi .mkv | `video` |
| .mp3 .wav .flac .m4a .ogg | `audio` |
| .html .htm .pdf | `link` |
| .txt .md .json | `text` |
| anything else | `other` |

Verified against the 35 files in `intake/drop/`: if every file were
POSTed to `/api/artifact-register` today, the endpoint would assign
**28 photo, 5 link, 2 audio** (zero `other`, zero `video`, zero `text`).

### 2.3 — HEIC behavior

The engine handles HEIC end-to-end *for thumbnail generation*:

- `pillow_heif.register_heif_opener()` is called at module-import time
  (`ingest_engine.py:67`). `HEIC_SUPPORT` flags whether pillow_heif
  imported successfully.
- `extract_exif` (line 354) explicitly re-registers the opener for
  `.heic|.heif` paths.
- `generate_thumbnail` (line 638) uses the same PIL path for all image
  formats; HEIC reads succeed iff `pillow_heif` is present.

**This is distinct from PHASEB §3.2's HEIC issue.** PHASEB §3.2 was
about the **Museum-side `sharp` library** failing to decode iPhone HEIC
during R2 sync. The MV ingest engine has no such problem — PIL +
pillow_heif handles iPhone HEIC fine on Windows.

The Phase B fix was: HEIC primaries are excluded from Museum R2 sync;
only the JPEG/PNG re-encoded versions get delivered. The MV-side
question this audit needs to answer is whether HEIC should be
*transcoded* at ingest (write the JPEG once, alongside the HEIC) or at
curation (per-release re-encoding). See §3.4.

### 2.4 — MP3 / ID3 APIC

The engine does **not** read MP3 at all (extension missing from
`SUPPORTED_EXTENSIONS`). The 15 RWTH artifacts in MV got their ID3
APIC frames read by the MUSEUM-side sync tool (`tools/sync-assets-to-r2.mjs`
via `music-metadata`), not by MV.

If MP3 support were added to MV ingest, the architectural question is
whose layer owns ID3 extraction:

- **MV ingest extracts ID3 → `enrichment_json`** at queue time. Pros:
  audio artifact arrives in the inbox with title / artist / album /
  duration pre-filled, mirroring the EXIF flow for images. Cons: adds
  a new dependency (`mutagen`, `tinytag`, or equivalent — Python ID3
  libraries) and overlaps with the Museum's `music-metadata` work.
- **MV ingest stays format-agnostic; Museum sync extracts ID3 again at
  delivery time** (current state). Pros: ingest is dumb; the format-aware
  layer is the consumer. Cons: ID3 metadata never enters MV's catalog
  — `description_short` is hand-authored ("Park Bench Pigeons — audio
  recording") rather than read from ID3.

Phase C's `phaseC_step0c_id3_audit.py` showed APIC hit rate 15/15 on
the RWTH set with identical 53,745-byte payloads (PHASEC §1.6). That's
album art only; `mutagen.id3` would also pull title, artist, album,
TPE1, TLEN duration — none of which currently flow into MV.

### 2.5 — HTML page-saves

Treated as `link` by `_infer_media_type` (Path B only — Path A ignores
.html entirely). The catalog record stores a path to the snapshot;
`storage_mode` would typically be `vaulted` (we own the bytes) or
`referenced` (the bytes live elsewhere — the HR archive convention).
No HTML parsing — no `<title>` extraction, no Open Graph metadata, no
canonical URL inference. The caller is expected to set `source_url`,
`description_short`, etc. explicitly.

This is fine for HR's pre-curated page_save artifacts (the operator
authored proper titles via the rn_archive tool). It's awkward for the
"drop a captured HTML in intake/drop/" use case — the engine ignores
the file, and there's no path that auto-extracts `<title>` to seed
`description_short`.

### 2.6 — Multi-format folder grouping

**Not implemented at any layer.** The five HR-shape clusters currently
in `intake/drop/` (mixing audio, cover_art, page_save, artist photos
under the same `actor__album__*` filename stem) would be treated as 14
independent artifacts, with no automatic `parent_artifact_id` linking.

The filename grammar is rich enough that parsing is mechanical:

    <actor>___<role>__<kind>__<title>.<ext>            (artist-level)
    <actor>__<album_slug>__<kind>__<title>.<ext>       (release-level)

where `actor ∈ {hunterroot2, medusasdisco, runwiththehunt, ...}`,
`role = 'artist'` for artist pages, `album_slug` is the
release-identifier, and `kind ∈ {audio, cover_art, page_save,
artist_photo}`.

No code parses this. The audit explicitly tested the conjecture:
running a Python regex against `intake/drop/` against the grammar
above identifies all 5 clusters cleanly with no false positives.
Adding sibling grouping is mechanical given the filename convention
(see §5.2).

The Phase 2.5 HR archive script (`tools/rn_archive_extract.py`,
referenced in MV's `STATE.md`) is the producer of these filenames —
the convention is intentional. The consumer (MV ingest) currently
ignores the structure.

### 2.7 — Format support matrix

A single table the brief refers to as "the format support inventory":

| Format | Path A (`scan`) | Path B (`/api/artifact-register`) | Engine thumb? | EXIF/ID3 extracted? |
|---|---|---|---|---|
| JPEG / JPG | ✓ → photo | ✓ → photo | PIL → 400×400 q85 | EXIF (DateTimeOriginal, GPS, XP*) |
| PNG | ✓ → photo | ✓ → photo | PIL → 400×400 q85 | EXIF (limited) |
| GIF | ✓ → photo | ✓ → photo | PIL → 400×400 q85 | EXIF (limited) |
| WebP | ✓ → photo | ✓ → photo | PIL → 400×400 q85 | EXIF (limited) |
| HEIC / HEIF | ✓ → photo (via pillow_heif) | ✓ → photo | PIL + pillow_heif → 400×400 JPEG | EXIF (DateTimeOriginal, GPS) |
| BMP / TIFF | ✓ → photo | ✓ → photo | PIL | EXIF (limited) |
| MP4 / MOV / AVI / MKV | ✓ → video | ✓ → video | ffmpeg `-vframes 1` | None |
| MP3 / WAV / FLAC / M4A / OGG | ✗ ignored | ✓ → audio | None | **None — no ID3** |
| HTML / HTM | ✗ ignored | ✓ → link | None | None |
| PDF | ✗ ignored | ✓ → link | None | None |
| TXT / MD / JSON | ✗ ignored | ✓ → text | None | None |
| Everything else | ✗ ignored | ✓ → other | None | None |

The 28 photo / 5 link / 2 audio breakdown of `intake/drop/` (§2.2)
maps directly: 28 files are eligible via Path A; 5+2=7 are eligible
only via Path B. The 19 HEICs would go through Path A's PIL+pillow_heif
pipeline; the 5 page-save HTMLs and 2 MP3s require Path B.

---

## §3 — Curation gates list

Every place a human is required today (read directly off engine code,
inbox flow, and Phase A/B/C run reports):

### 3.1 — `media_type` assignment (Path A + Path C; Phase A §3.6)

Path A's `queue_item` does not set `media_type`. Path C's
`queue_capture_json` does not set `media_type`. The inbox UI is where
the operator chooses one of {photo, video, audio, link, text, mixed,
other} from a dropdown.

**Live evidence of the gate**: 4 NULL-media_type artifacts persist in
the live DB (`MV-HR-20260405-012`, `-013`, `-029`, `MV-20260419-003`).
The first two are extension-captures (FB posts) that the operator saved
without setting media_type — the schema does not require it (`media_type`
is nullable). The third is a `.MOV` file whose ingest path went via
local-drop (the `.mov` does map to video via Path B but never went
through Path B). The fourth is the cover_art JPG from the medusasdisco
PBP cluster — paired with an `ingest_queue` row but media_type never
filled.

This gate is **mechanical**: `_infer_media_type(local_path)` already
exists; running it during `queue_item` would set a confident default
that the operator can override in the inbox.

### 3.2 — `exhibit:*` tag application (Phase B §2.4)

The Phase B run report logged that the `exhibit:hunter_root` tag was
missing from MV-20260419-001 and -004 and required a Phase B step 1c
`_cowork/phaseB_step1c_add_exhibit_tag.py` script to apply.

Today's state per the DB: 19 artifacts carry an `exhibit:*` tag. They
are the Phase A/B/C delivery set. Every other artifact in MV (69 of
88) does not carry an exhibit tag, because there is **no rule that
applies one**.

The reason for the gate: an `exhibit:` tag is what tells the museum's
manifest-sync to surface the artifact in a given exhibit. Without it,
the artifact stays in the catalog but never reaches the museum. The
decision "this artifact belongs to exhibit X" is partly mechanical
(any artifact under `C:\AI\Projects\Hunter Root\archive\` is plausibly
exhibit:hunter_root) and partly editorial (not every HR archive item
is exhibit-worthy).

This gate is **configurable** (see §5.2).

### 3.3 — `era:*` tag application (Phase C §9.4)

Phase C added `era:rwth` to all 15 RWTH audio artifacts via a batched
`_cowork/phaseC_step1_apply_audio_curation.py`. Today's state: 15
artifacts carry an `era:` tag; 73 do not.

`era:` is documented in UX_SPEC v0.3 §D.2 (per the audio brief's
§1.3). Eras are artist career chapters: for Hunter Root, `seeds`,
`medusas`, `solo`, `rwth`. Like exhibit tags, the era rule is partly
mechanical (`album:run_with_the_hunt → era:rwth`,
`album:medusas_disco → era:medusas`, etc.) and partly editorial (an
artifact may span eras or refuse the question — e.g., a photo of a
2024 acoustic show with no album reference).

This gate is **configurable** (see §5.2).

### 3.4 — HEIC transcoding (Phase B §3.2)

PHASEB §3.2 documented that the Museum's `sharp` could not decode
iPhone HEIC. The Phase B brief's fix was to exclude HEIC primaries
from R2 sync; only the JPEG re-encoded versions get delivered.

Today MV ingest produces a 400×400 JPEG thumbnail from HEIC via PIL +
pillow_heif (§2.3 above) but does NOT produce a JPEG primary. The
primary stays HEIC under `catalogs/_assets/` (or stays at its
referenced path).

The gate is: when delivery-time comes, who creates the JPEG primary
that the museum can serve? Today this is operator-side — for the
Phase B 3 photos, the operator pre-cropped and re-saved as PNG/JPEG
before MV ingest; HEIC artifacts in MV that have not been delivered
yet have no JPEG primary.

This gate is **mechanical at ingest** (re-encode HEIC → JPEG primary
alongside the HEIC original at ingest time, mark the JPEG as
delivery-eligible) but it has a UX consequence: the JPEG would
duplicate disk usage. Operator policy question (see §5.2).

### 3.5 — `description_short` / `description_long`

The inbox operator authors these. The engine pre-fills from extension
captures (Path C, line 232) and from XP-Title EXIF fields when present
(Path A, line 396). But neither is sufficient for a published artifact
— the published descriptions in MV's released set are operator-edited.

This gate is **operator-only** (see §5.3).

### 3.6 — Release transition (`vault → released`)

The Path B caller can pass `status='released'` directly (handler accepts
it per `STATUS_ENUM={vault, released, archived}` at line 123). The
Path A/C operator clicks **Save & Release** in the inbox or
**Release** in the vault detail panel.

There is no time-based or rule-based auto-release. Every released
artifact in MV today went through an explicit operator action.

This gate is **operator-only by current design** (see §5.3); whether
that should change is itself a policy question.

### 3.7 — Filename-grammar parsing

Files like `medusasdisco__park-bench-pigeons_19361978__audio__Park_Bench_Pigeons.mp3`
encode a 4-tuple `(actor, album, kind, title)`. The engine does not
parse this. The operator restates it in pills / `description_short`
during inbox triage, or the upstream HR archive tool restates it in
the artifact-register POST body.

This gate is **mechanical** if the filename convention is treated as
contract (§5.1).

### 3.8 — Sibling grouping / `parent_artifact_id` linking

Multi-format clusters (audio + cover_art + page_save under one album)
are not auto-grouped at ingest. `parent_artifact_id` is a column the
caller can set (Path B), but Path A/C provide no auto-detect. The
operator links parents manually via the vault's Attach-to-parent modal
(SPEC §8.6).

The HR yt-archive flow IS auto-grouped (yt_archive_capture.py
explicitly threads the youtube_video_page parent's MV id into each
child's `parent_artifact_id`). That's the only place sibling linking
happens automatically today.

This gate is **mechanical for the HR filename convention** + 
**configurable for arbitrary clusters** (§5.2).

### 3.9 — ID3 → title / duration enrichment

For audio artifacts, ID3 carries title, artist, album, duration. None
of this reaches MV today (§2.4). The operator authors
`description_short` from external knowledge.

This gate is **mechanical** if MP3 support is added (§5.1).

### 3.10 — Content-hash dedup

`already_queued` (line 485) checks by `raw_path` string and by
filename match in processed/images. Two byte-identical files with
different names re-queue. No SHA-256 / content-hash check.

SPEC.md §14 (Carried-forward open issues) explicitly names "Hash-based
dedup on intake-upload" as deferred.

This gate is **mechanical** (§5.1).

### 3.11 — `text-only` media_type normalization

22 artifacts in the live DB carry `media_type='text-only'` — a value
that exists in NEITHER the SPEC §6 target set
`{link, mixed, photo, text, video, unknown}` nor the
imgserver_extensions validator `{photo, video, audio, link, text,
mixed, other}`. It is pre-v0.4 legacy that survived every migration.

The value's semantic intent: a social-media post or page that has text
but no embedded image/video — the screenshot IS the artifact. The
closest target-set candidate is `text`.

Normalization is a one-row-per-artifact MV write (UPDATE 22 rows
`SET media_type='text'`). The decision **what does text-only normalize
to** is mildly UX-impactful — see §4.

### 3.12 — NULL media_type cleanup

The 4 NULL-media_type artifacts (§3.1's evidence). These are old
saves the operator never returned to. Each could be inferred from
`local_asset_path` extension: `MV-HR-20260405-029` is a `.MOV` →
video; `MV-20260419-003` is a `.jpg` → photo; the two FB extension
captures have thumbnail paths that are `.jpg` but the source is a FB
post (likely media_type = `text-only` or `link` depending on what FB
exposed).

Mechanical for the first two; operator-judgment for the FB pair (§5.3).

### 3.13 — Bit-rotted helpers (surface only)

The audit surfaced two bit-rotted scripts in `core/`:

- **`enrich_helper.py`** (line 27): SELECTs the `domain` column, which
  was dropped at v0.4. Will throw `OperationalError` on run.
- **`rethumb.py`** (line 7): WHERE clause `domain='hunter_root'` will
  similarly fail.
- **`match_screenshots.py`**: v0.2-era one-shot utility with hardcoded
  file list. Functional but architecturally stale.
- **`db_setup.py`**: v0.2-era schema definition with 10 `tags_*`
  columns and `domain CHECK` constraints. Not used by anything that
  runs today; SPEC.md §6 is the schema source of truth.
- **`migrate_to_v04.py`**: shipped migrator from 2026-04-17. Still in
  `core/` despite v0.5 design §12 marking it for quarantine.

None of these are intake-blocking; they're cleanup candidates that
fall outside §3's automation roadmap. Noted for §6 of the eventual
implementation session.

### 3.14 — Gates summary

| Gate | Today | Bucket | Notes |
|---|---|---|---|
| 3.1 media_type assignment | Operator (inbox dropdown) | Mechanical | `_infer_media_type` already exists |
| 3.2 exhibit:* tag | Operator (or batched cowork script) | Configurable | path-based rule, e.g. `intake/drop/medusasdisco/* → exhibit:hunter_root` |
| 3.3 era:* tag | Operator (or batched cowork script) | Configurable | tag-based rule, e.g. `album:run_with_the_hunt → era:rwth` |
| 3.4 HEIC transcoding | Operator (pre-ingest re-save) | Configurable | policy: transcode at ingest vs at delivery |
| 3.5 description authoring | Operator | Operator-only | per-artifact judgment |
| 3.6 release transition | Operator (explicit click) | Operator-only by design | could become configurable (auto-release tags) |
| 3.7 filename parsing | Operator (re-states in pills) | Mechanical | parse `actor__album__kind__title` |
| 3.8 sibling grouping | Operator (vault Attach-to-parent) | Mechanical for HR convention | parent = `actor + album_slug` cluster |
| 3.9 ID3 → title/duration | Operator (authors description_short) | Mechanical | if MP3 support added |
| 3.10 content-hash dedup | None — files re-queue | Mechanical | SHA-256 over file bytes |
| 3.11 text-only normalization | Operator (case-by-case) | Operator-only call once | then mechanical |
| 3.12 NULL media_type cleanup | Operator (revisit each) | Mechanical for files with extensions; operator for FB captures | one-shot pass |

The bucket breakdown maps directly to §5's three roadmap buckets.

---

## §4 — The `mixed` media_type taxonomy question

PHASEB §7.2 + PHASEC §3.1 raised this twice. Phase C resolved it for
the 15 RWTH audio artifacts (UPDATE `media_type='mixed' → 'audio'`)
but not architecturally. SPEC.md §6.6 ratifies the drift and explicitly
names the architectural work item as out of scope of Phase 3 of the
source-of-truth refactor.

### 4.1 — Three sets in disagreement

| Source | Set |
|---|---|
| SPEC.md §6 target (v2.1-target documented set) | `{link, mixed, photo, text, video, unknown}` |
| `imgserver_extensions.py:107` runtime validator | `{photo, video, audio, link, text, mixed, other}` |
| Live data (88 artifacts) | `{photo (25), text-only (22), audio (15), video (10), link (7), NULL (4), mixed (3), text (2)}` |

The validator accepts `audio` and `other` (zero live rows of `other`
anywhere); SPEC's target set does not include `audio`. Live data has
`text-only` (22 rows) which appears in neither, and `NULL` (4 rows)
which is rejected by no validator. The three sets share `mixed`
syntactically but each means something subtly different:

- **In SPEC's target**: `mixed` means "an artifact spanning multiple
  formats" (e.g., a YouTube link + transcript). Used when the artifact
  is the parent of a multi-child cluster.
- **In the validator**: `mixed` is one accepted value among others;
  no semantic guidance.
- **In live data**: `mixed` was historically used as a "couldn't
  decide" placeholder by ingest tooling. Phase C drained 15 of 18
  `mixed` rows into `audio`. The remaining 3 are: an event-listing /
  ticketing page (MV-HR-20260405-010, plausibly `link`), a FB
  promotional post (MV-HR-20260405-034, plausibly `text-only` or
  `link`), and a Medusa's Disco MP3 (MV-HR-20260416-008, clearly
  should be `audio` — same shape as the 15 RWTH but not yet released).

### 4.2 — What each existing value plausibly means

This is the SPEC's job, not this audit's. But for the operator's
benefit:

- `photo` — single still-image artifact (any image format).
- `video` — single moving-image artifact (any video format).
- `audio` — single sound-only artifact (any audio format). Validator
  accepts; SPEC target does not list (audit recommendation: add).
- `link` — a URL-only artifact where the catalog record is the
  preservation entity (storage_mode='url_only') OR a snapshot of a
  link (HTML page_save).
- `text` — a text-only artifact (transcript, lyrics, notes).
- `text-only` — pre-v0.4 legacy alias for `text`-with-screenshot
  (e.g., a FB post with no media, where the captured screenshot is
  the visual representation but the artifact is the post's text).
  Recommendation: normalize 22 rows to `text` and retire the value.
- `mixed` — the audit recommends treating this as **deprecated** for
  new artifacts. Parent-of-cluster artifacts use the explicit
  parent_artifact_id linkage; the parent's media_type should reflect
  its OWN content (e.g., a YouTube video parent is `video`, its
  transcript child is `text`, its thumbnail child is `photo`). The
  3 remaining `mixed` rows should be re-classified case by case.
- `other` — defensive fallback in the validator; zero live rows.
  Recommendation: keep as defensive fallback, document as "should not
  appear in production data."
- `unknown` — SPEC target only; zero live rows. Recommendation: not
  needed if `media_type` is NOT NULL'd; remove from target set.

### 4.3 — Recommended path

Three components, ordered by dependency:

1. **Adopt as the canonical set** (SPEC.md update + validator update,
   no live-data change): `{photo, video, audio, link, text, mixed, other}`.
   This matches the validator. Adds `audio` to SPEC's target set;
   removes `unknown`. Documents `mixed` as deprecated-but-allowed for
   legacy rows.
2. **Normalize live data** (MV-side write, Phase B-style discipline):
   `text-only` (22 rows) → `text`. NULL (4 rows) → inferred from
   `local_asset_path` extension OR operator-decided per row. `mixed`
   (3 remaining) → operator-decided per row.
3. **Add a `CHECK` constraint** on `media_type` once normalization is
   complete: `CHECK (media_type IN ('photo','video','audio','link','text','mixed','other'))`,
   with `media_type NOT NULL` if the audit operator chooses to enforce.

**The one UX-facing question this audit cannot answer** (per the
"re-read postures" rule, the answer is not in any current brief or
SPEC section): **what does `text-only` normalize to — `text` or `link`?**

**OPERATOR-LOCKED 2026-05-22: `link`.** The 22 `text-only` artifacts
normalize to `media_type='link'`. The audit originally recommended
`text` on the semantic-purity argument (the snapshot IS the artifact);
the operator weighed the pragmatic counter (every `link` artifact
ships to the museum immediately via the existing LinkCard renderer;
`text` would require a new TextCard component before the artifacts
become visitor-visible) and chose `link`.

Forward-compatibility note: the choice is reversible. The snapshot
HTML files remain on disk under `intake/processed/` and
`catalogs/_assets/` regardless of `media_type`. If a future TextCard
renderer exists, OR if the underlying URL ever rots and the snapshot
becomes the only surviving evidence, a follow-on curation script can
shift specific rows from `link` to `text` per-artifact. Whichever
comes first.

Implementation consequence: M7 in §5.1 (`text-only → text`
normalization) becomes `text-only → link`. One-line script change
from the audit's original outline; same 22-row UPDATE shape.

The audit's posture is: this is the only §4-level decision that
materially affects UX (specifically, what `text-only` content reads as
in the museum's adapter). Treating it inline in §5.3 rather than as
its own decision section because the recommendation is clear-cut and
the alternative is defensible-but-defaulting-to-the-recommendation.

### 4.4 — Cost

The normalization migration is ~30-50 lines of Python under
`_cowork/phaseD_step1_apply_media_type_normalization.py` (modeled on
PHASEB §3.1 + PHASEC §3.1 discipline): pre-flight verify-count + backup
+ transactional UPDATEs + post-verify + abort-on-mismatch. The
SPEC.md edit is ~5 lines. The CHECK constraint is a
`ALTER TABLE artifacts ADD CONSTRAINT` (or, more likely, a rebuild
table per SQLite's CHECK semantics) — 1 migration step. Total work:
one focused session, ~2 hours active.

---

## §5 — Automation roadmap

Three priority buckets. Each bucket lists the gates from §3 that fit,
plus the engineering shape of the automation.

### 5.1 — Mechanical (no operator judgment)

Decisions the engine can make on its own from the file's properties
plus a small fixed table. These can land without any operator-policy
input.

- **M1. `media_type` from extension at queue time.** Today Path A's
  `queue_item` and Path C's `queue_capture_json` both omit
  `media_type`. Adding a call to `_infer_media_type(raw_path)` (already
  defined in `imgserver_extensions.py:215`) and stashing the result in
  `enrichment_json.media_type` would seed the inbox dropdown with a
  confident default. ~10 lines in `ingest_engine.py`. (Gate 3.1.)
- **M2. ID3 → enrichment_json for audio.** Add `.mp3 / .wav / .flac /
  .m4a / .ogg` to `SUPPORTED_EXTENSIONS`. Add a parallel
  `extract_id3(path)` function (modeled on `extract_exif`) using
  `mutagen` — read `TIT2` (title), `TPE1` (artist), `TALB` (album),
  `TLEN` (duration), and APIC bytes. Populate `enrichment_json.title`,
  `enrichment_json.duration_seconds`, etc. ~80 lines. (Gates 3.9 + 2.4.)
- **M3. Content-hash dedup.** Augment `already_queued` to also check
  SHA-256(file) against a new `ingest_queue.content_sha` column and
  against `artifacts.content_sha` (would need a schema addition).
  Alternatively, lazy hashing: compute hash when re-queue is suspected
  (filename match + size match), avoid hashing on the happy path. ~30
  lines + 1 column. (Gate 3.10 + SPEC §14 carried-forward item.)
- **M4. HTML / PDF / text extensions added to `SUPPORTED_EXTENSIONS`.**
  Path A picks them up; `_infer_media_type` already handles them; no
  thumbnail (the engine accepts that — no thumb is a valid state).
  Adds a single-line set extension. (Gates 3.4 partial + 2.5 partial.)
- **M5. Filename-grammar parsing for HR clusters.** Parse
  `actor__album__kind__title.<ext>` filenames in `intake/drop/`; emit
  `album:<album_slug>`, `people:<actor>` (mapped through a small table,
  e.g. `medusasdisco → medusas_disco`), `artifact_kind:<kind>` into
  `enrichment_json.tags_proposed`. ~40 lines + a 10-row mapping table.
  (Gates 3.7 + 3.8 partial.)
- **M6. NULL media_type cleanup pass.** One-shot script that walks
  `artifacts WHERE media_type IS NULL`, runs `_infer_media_type` against
  `local_asset_path` extension, applies non-null updates via the
  Phase-B discipline. Manual review for the 2 FB extension captures.
  (Gate 3.12.)
- **M7. `text-only → link` normalization (per §4.3 operator lock 2026-05-22).**
  One-shot script, 22-row UPDATE. (Gate 3.11.)
- **M8. Bit-rot cleanup of `enrich_helper.py`, `rethumb.py`,
  `match_screenshots.py`, `db_setup.py`, `migrate_to_v04.py`.** Either
  fix or quarantine to `D:\AI_OK_TO_DELETE\`. (Gate 3.13.)

### 5.2 — Configurable (operator sets policy once, engine applies)

Decisions where the rule is small, stable, and reviewable in a single
config file or short Python module — the operator authors policy once,
the engine applies it on every subsequent ingest. The
"operator-locked rule" pattern from PHASEC §7.4 applies: code comments
cite the rule + date, future-Claude doesn't re-litigate.

- **C1. Path-based `exhibit:*` rule.** A small rule table — e.g.,
  `intake/drop/<any-HR-shape-cluster> → exhibit:hunter_root`,
  `intake/drop/yt-staging/<any> → exhibit:hunter_root`, anything else
  → no exhibit tag (operator-set in inbox). Lives in
  `core/ingest_rules.py` or similar. ~20 lines + a config dict.
  (Gate 3.2.)
- **C2. Tag-based `era:*` rule.** Equivalent: `album:run_with_the_hunt
  → era:rwth`, `album:medusas_disco → era:medusas`, `album:seeds →
  era:seeds`, otherwise no era. ~15 lines. (Gate 3.3.)
- **C3. HEIC transcoding policy.** Two operator-set values: (a)
  `transcode_heic_at_ingest: bool` — if true, ingest produces a JPEG
  primary alongside the HEIC and stores it under
  `catalogs/_assets/<id>.jpg`; (b) `heic_jpeg_quality: int` — q85 to
  match the thumbnail spec. Implementation reuses
  PIL+pillow_heif. ~30 lines. (Gate 3.4.)
- **C4. Sibling-cluster `parent_artifact_id` auto-link.** For HR-shape
  clusters (M5's parse hits), elect the `page_save` HTML as the parent
  (storage_mode='referenced'), link the audio + cover_art siblings to
  it. Or elect the audio file as parent if no page_save exists.
  Policy: one rule per filename shape. ~40 lines on top of M5.
  (Gate 3.8.)
- **C5. Auto-release policy (optional).** Today every release is
  operator-clicked. If MV ever wants "files matching `album:rwth +
  type:audio + complete metadata` auto-release on ingest," that's a
  configurable rule. Policy default: stay manual. (Gate 3.6 — names
  this as available but does not commit to it.)

### 5.3 — Operator-only (per-artifact human call)

Decisions that resist any rule because the artifact's worth is itself
the judgment. The roadmap keeps these explicit and reserves operator
attention for them, freeing it from the §5.1/§5.2 work.

- **O1. `description_short` / `description_long` authoring.** Even
  with rich ID3 / EXIF / extension-capture enrichment, the published
  description is operator-authored. The §5.1 work seeds defaults; the
  operator polishes. (Gate 3.5.)
- **O2. "Is this artifact exhibit-worthy?"** Not every HR archive
  item belongs in the museum. The C1 rule auto-tags `exhibit:*`
  candidates; the operator's gate is to release (or not release) into
  the exhibit. Stays manual. (Gate 3.6.)
- **O3. Sensitive-content review.** Personal scope, identifiable
  minors, ongoing-legal-matter content. Not formally enforced today;
  the operator's general rule per UX_SPEC v0.3 §H is "default-private,
  release explicitly."
- **O4. The two FB extension captures still NULL after M6.** Need
  operator-side decision on `media_type` for the FB post pair
  (`MV-HR-20260405-012` and `-013`).
- **O5. The 3 remaining `mixed` rows.** §4.3's per-row re-classification.

### 5.4 — Sequencing

Suggested ordering for an implementation session:

1. M8 first (clean up bit-rot). Lowest risk; gets dead code out of the
   read path.
2. M1 (`_infer_media_type` at queue time). Highest leverage per line:
   eliminates Gate 3.1 across all future ingests.
3. M4 + M5 + M2 (extension widening + filename parsing + ID3).
   Together: Path A becomes a viable entry point for the full
   intake/drop/ queue. Eliminates the "27 files sitting un-queued"
   state from §1.7.
4. C1 + C2 + C4 (configurable tag rules + sibling grouping). The
   "released, tagged, exhibit-badged" goal becomes one-click per
   cluster.
5. §4.3 (taxonomy normalization). Lands after the engine is producing
   correct `media_type` values so the migration is small.
6. M6 + O4 + O5 (legacy cleanup of NULL / mixed rows).
7. C3 + C5 (transcoding + auto-release policies). Optional;
   pure policy work.
8. M3 (content-hash dedup). Independent; can land anywhere.

Each item is a focused, scoped work item — none requires a
multi-session program.

### 5.5 — Approval

**OPERATOR-APPROVED 2026-05-22: §5.4 is the committed sequencing plan.**
The roadmap is the spine for the next several implementation sessions.
Approval locks the ORDER, not a deliverable date and not a commitment
to all 13 items. The operator may stop after any session and the work
to date stands on its own. The next implementation session is scoped
from item 1 (M8 — bit-rot cleanup) per §5.4's ordering.

Per the PHASEC §7.4 operator-locked-rule pattern: subsequent
implementation sessions cite this approval rather than re-litigating
the sequence.

---

## §6 — Sample-set walkthrough

### 6.1 — Sandbox feasibility note

The session brief asks for "run the engine in a sandboxed copy of MV
(NOT against `core/mediavault.sqlite`)" where feasible. The decision:
**prediction-only with verified pure-Python helper execution**.

Reasoning:

- The MV engine's `BASE = Path(r"C:\AI\Platform\MediaVault")` is hard-
  coded (line 37) and the engine relies on Windows-resident `exiftool`
  + `ffmpeg`. Running the full `scan()` in a Linux bash sandbox would
  fail in a way that doesn't reflect production behavior — false
  negatives.
- Copying `mediavault.sqlite` to `/tmp/` is trivial and the audit DID
  this for read-only queries. Running an engine-equivalent against a
  COPY would still need PIL+pillow_heif+ffmpeg+exiftool on Linux. A
  Linux libheif install + Python `pillow_heif` install would let the
  HEIC EXIF path work; mutagen would not exist in the engine today.
- The pure-Python helpers (`_infer_media_type`,
  `SUPPORTED_EXTENSIONS` membership, `slugify`, the §3.1 tag validator)
  CAN be exercised cleanly in the sandbox against the real intake/drop/
  filenames. The audit ran this verification in-session.

Result: §6.2-§6.6 below state what each helper actually returns when
run against the live filenames (verified), and what the engine's
predicted end-to-end behavior is (read from code, not executed). Any
end-to-end claim that can't be sandbox-verified is flagged
**(predicted)**.

### 6.2 — Sample 1: iPhone HEIC (`20251011_011807044_iOS.heic`)

- Engine `SUPPORTED_EXTENSIONS` membership: `.heic` ∈ set ✓ (verified)
- `_infer_media_type`: `photo` ✓ (verified)
- Path A `scan` would queue with `ingest_source='local-drop'`,
  `status='pending'` (predicted)
- EXIF extraction: should yield `DateTimeOriginal`, Make='Apple',
  Model='iPhone <X>', possibly GPS (predicted; iPhone HEICs usually
  carry GPS)
- `enrichment_json.tags_proposed`: would contain `2025` (year slug
  from DateTimeOriginal) per `extract_exif:378` (predicted)
- Inbox state on operator open: queue row with EXIF date pre-filled,
  no `media_type` set yet (Gate 3.1 — predicted)
- After M1 lands (§5.1): same flow but `media_type='photo'` already
  seeded; one fewer click for operator
- Thumbnail: PIL+pillow_heif produces 400×400 JPEG q85 at
  `catalogs/_thumbs/MV-YYYYMMDD-NNN.jpg` (predicted)
- Surprise: none

### 6.3 — Sample 2: HR cluster MP3 (`medusasdisco__park-bench-pigeons_19361978__audio__Park_Bench_Pigeons.mp3`)

- Engine `SUPPORTED_EXTENSIONS` membership: `.mp3` ∉ set ✗ (verified)
- Path A `scan` would **silently ignore** this file (verified by
  code reading: `ingest_engine.py:454` predicates on extension
  membership)
- Path B `_infer_media_type`: `audio` ✓ (verified)
- Only path to ingest today: HR's `tools/rn_archive_extract.py` (the
  producer of the filename) POSTs to `/api/artifact-register` with
  the file at its archive-tree location (not at `intake/drop/`)
- Live-data confirmation: `MV-HR-20260416-008` IS an artifact for a
  Medusa's Disco PBP MP3 at the archive path
  `C:\AI\Projects\Hunter Root\archive\reverbnation\medusasdisco\park-bench-pigeons_19361978\audio\Park_Bench_Pigeons.mp3`,
  `media_type='mixed'` (not yet normalized per §4)
- The intake/drop/ copy is a duplicate awaiting either deletion or
  re-ingest via a path that doesn't exist yet
- After M2 + M4 land: Path A picks up the MP3; ID3 extraction populates
  `enrichment_json.title='Park Bench Pigeons'`,
  `enrichment_json.duration_seconds=…`; M1 sets media_type='audio'.
  C4 sibling-cluster rule links to the `__page_save__.html` parent
- Surprise: the intake/drop/ MP3 is currently a "shadow" of the
  already-ingested archive MP3. After M3 (content-hash dedup) lands,
  the engine would refuse to re-queue this if the bytes match. **The
  audit recommends an operator-facing decision here**: the
  intake/drop/ HR cluster files are either (a) the canonical drop
  zone for future HR archive captures, or (b) leftover from an
  earlier capture cycle. The choice affects whether M3's behavior is
  "skip" or "warn-and-skip." Operator call (see §5.3 O4-ish; not
  blocking the audit).

### 6.4 — Sample 3: HR cluster HTML page_save (`medusasdisco__park-bench-pigeons_19361978__page_save__Park_Bench_Pigeons_by_Medusa_s_Disco___ReverbNation.html`)

- Engine `SUPPORTED_EXTENSIONS` membership: `.html` ∉ set ✗ (verified)
- Path A `scan` would silently ignore (verified)
- Path B `_infer_media_type`: `link` ✓ (verified)
- Live equivalent: `MV-HR-20260416-009` (the page_save artifact)
  exists at the HR archive path, `media_type='text-only'` — i.e.,
  the operator ALREADY didn't go with the `link` default; they chose
  `text-only`. **This is a real-world test of §4.3's recommendation**:
  the operator's historical choice was `text-only` (now recommended to
  normalize to `text`), not `link`. If §4.3 normalizes to `text`, this
  artifact's media_type would shift from `text-only` to `text`. If the
  operator wants HTML page-saves to read as `link`, that recommendation
  flips.
- This is the §4.3 UX-facing call surfaced. Mike sees this concrete
  example: do page-saves catalogued in MV read as `text` (the snapshot
  text IS the artifact) or `link` (the snapshot points to the canonical
  URL)? The audit recommends `text`; the operator can disagree.

### 6.5 — Sample 4: HR cluster cover_art JPG (`medusasdisco__park-bench-pigeons_19361978__cover_art__64ada38845a0a8315d5bb92431db0b7d48374ded.jpg`)

- Engine `SUPPORTED_EXTENSIONS` membership: `.jpg` ∈ set ✓ (verified)
- `_infer_media_type`: `photo` ✓ (verified)
- Path A `scan` would queue ✓ (verified by reading the code path)
- Live equivalent: `MV-20260419-004` (one of the two intake/drop/
  files currently queued) is a cover_art JPG from this cluster,
  `media_type='photo'`, `status='vault'`
- Without C4 (sibling-cluster): the cover_art artifact has no
  `parent_artifact_id`. The audio + cover_art + page_save trio sits
  as three independent artifacts in MV's catalog.
- After M5 (filename parsing): `enrichment_json.tags_proposed`
  contains `album:medusas_disco`, `people:medusas_disco` (via the
  M5 mapping table). The cover_art file would gain `album:medusas_disco`
  on Save.
- After C4 (sibling-cluster auto-link): the cover_art's
  `parent_artifact_id` is set to the page_save's MV-id (or to the
  audio's MV-id if no page_save exists at ingest time).
- Surprise: even though M5 lands automatically, deciding which sibling
  is the cluster's "parent" is a configurable rule (page_save > audio
  > cover_art) — see C4.

### 6.6 — Sample 5: multi-format cluster grouping (the 4-file `medusasdisco park-bench-pigeons_19361978` set)

The 4 files share the prefix
`medusasdisco__park-bench-pigeons_19361978__`:

1. `__audio__Park_Bench_Pigeons.mp3`
2. `__cover_art__64ada38845a0a8315d5bb92431db0b7d48374ded.jpg`
3. `__cover_art__64ada38845a0a8315d5bb92431db0b7d48374ded_1_.jpg`
4. `__page_save__Park_Bench_Pigeons_by_Medusa_s_Disco___ReverbNation.html`

- Today: 4 files; engine picks up 2 (the two JPGs); ignores the MP3
  and HTML. No grouping at any level. The two JPGs would each become
  an independent artifact with `media_type='photo'` (after M1) and
  no `parent_artifact_id`.
- After M2 + M4: the MP3 and HTML join the queue. Now 4 files = 4
  queue rows.
- After M5: each queue row's `enrichment_json.tags_proposed` carries
  `album:medusas_disco`, `people:medusas_disco`, `artifact_kind:audio
  | cover_art | page_save` (depending on which file). The operator
  saves all 4 as separate artifacts; the album tag links them.
- After C4: the engine elects the page_save HTML as the cluster's
  parent (storage_mode='vaulted', media_type='text' per §4.3). The
  MP3 (audio child), the 2 JPGs (photo children) all get
  `parent_artifact_id = <page_save's MV-id>` set automatically.
  The operator opens the inbox and sees 4 artifacts grouped under a
  single page_save head. One Save & Release-on-the-parent could
  cascade-release the cluster (an §5.2 C5 rule).
- After C1 + C2: all 4 artifacts gain `exhibit:hunter_root` (via
  `actor in {medusasdisco, runwiththehunt, hunterroot2} → 
  exhibit:hunter_root`) and `era:medusas` (via `album:medusas_disco
  → era:medusas`).
- Surprise: the cover_art is duplicated (`_1_` suffix on the second
  JPG). M3 (content-hash dedup) would skip the duplicate; without M3,
  the operator sees 2 cover_art rows and must scrap one.
- Net effect of the full §5.1 + §5.2 work landing: this 4-file cluster
  goes from "4 ignored files in intake/drop/" to "1 cluster, 4
  artifacts, 1 click to release into exhibit:hunter_root + era:medusas
  + parent linkage intact." That's the §0 "pump in and classify" goal,
  concretely.

### 6.7 — Drift surfaced

The walkthrough surfaced one item not already known to the audit:

- **The intake/drop/ HR-shape clusters duplicate already-ingested
  archive artifacts** (the MP3 at `MV-HR-20260416-008` is the same
  audio file as `intake/drop/.../park-bench-pigeons_19361978/audio/Park_Bench_Pigeons.mp3`,
  via different paths). M3 (content-hash dedup) would handle the
  duplication invisibly; without M3, an implementation session adding
  M2+M4 would inadvertently re-queue these as new artifacts. The
  recommendation surfaces in §5.4's sequencing: M3 lands as part of
  the M2+M4+M5 wave, not as an afterthought.

No deeper drift between brief and engine. The audit's §1-§5 model of
the engine matches its actual behavior on real files.

---

## §7 — Out of scope

- **Implementation of any automation.** §5 names the work; landing
  any of M1-M8, C1-C5, O1-O5 is its own session.
- **Museum-side intake surface.** Showing the queue to museum
  visitors. Currently the museum reads MV's *released* set only; the
  inbox is operator-only.
- **Deploy.** Phase C's `dist/` is built and verified locally; pushing
  to weird.baby is its own work item per PHASEB §8.5.
- **Path B (source-agnostic player) work.** Per the Phase C run report
  §8.2. The audio cards in HrExhibitFlow play independently of the
  canonical PlayerBar; bridging that is a separate brief.
- **Engine changes themselves.** This brief identifies the gaps and
  names the engineering shapes; it does not write the code.
- **DB writes.** Read-only across the audit. The §5.1 M6 / M7 / O4 /
  O5 cleanup is implementation-session work.
- **MV's UI surface (the `ui/` dir).** Per Phase C audit, empty. Engine
  changes are deferred to whenever MV's frontend work happens.
- **The Phase C §6 deferred items** (visual layout roughness, APIC
  monotony, libuv assertion, dotenv mojibake, snapshot residue, npm
  vulnerabilities, build-token revocation, HrArchive reconciliation,
  vocabulary_csv_sha removal). All inherited as-is.
- **PHASEC §7.7 layout dependency lesson.** Carries forward
  unchanged.
- **The fb_candidates.html / FB-bridge flow.** Per SPEC §11. Still
  works, untouched by this audit.

---

## §8 — Verification (this brief)

**Read end-to-end (every line, byte-for-byte):**

- `docs/PHASEC_RUN_REPORT-20260522-170000.md` — Phase C run report.
- `docs/AUDIO_DELIVERY_SCOPING_BRIEF-20260522-013207.md` — format
  mirror.
- `C:\AI\Platform\MediaVault\SPEC.md` — current canonical spec
  (Phase 2.5 + Phase 3 doc-comment update).
- `C:\AI\Platform\MediaVault\README.md` — v0.5 package README.
- `C:\AI\Platform\MediaVault\MEDIAVAULT_V05_DESIGN.md` — full document
  including the SUPERSEDED IN PART banner (sections marked superseded
  cross-checked against SPEC.md for current truth).
- `core/ingest_engine.py` — every function, line by line. The 36 KB
  engine documented in this brief.
- `core/artifact_tags.py` — the single coordinated writer with strict
  §3.1 form validation.
- `core/attention_rules.py` — R1-R5 rules, namespace-aware after
  Phase 2.1.
- `core/imgserver_extensions.py` — `handle_artifact_register`,
  `handle_asset_raw`, `handle_deep_dive_vocabulary`, plus the validator
  whitelists at lines 105-123.

**Skimmed (purposive search rather than full read):**

- `core/imgserver.py` (1900+ lines) — endpoint route table extracted
  via grep against `/api/...` literals; handler-signature inventory via
  grep on `def handle_*`. Confirmed the 24 endpoints under
  `/api/` and the 12 file-serving routes. Did not read handler
  internals beyond the route table — those are out of audit scope
  unless they touch ingest.
- `core/db_setup.py` — v0.2-era; noted as bit-rot but not used by
  anything live.
- `core/migrate_to_v04.py` — first 120 lines for ingest-relevant
  semantics; flagged as v0.4-shipped migrator.
- `core/enrich_helper.py` — full read; flagged as bit-rotted.
- `core/match_screenshots.py` — full read; one-shot utility.
- `core/analyze_captures.py` — full read; 12-line introspector.
- `core/rethumb.py` — full read; flagged as bit-rotted (queries
  retired `domain` column).
- `Hunter Root/tools/yt_archive_capture.py` — first ~180 lines; enough
  to confirm Path B usage and `scope:hunter_root` / `platform:youtube`
  / `author:hunter_root` pill emission.

**Pure-Python helpers executed in sandbox against live data:**

- `_infer_media_type` from `imgserver_extensions.py:215` — verified
  against all 35 files in `intake/drop/`. 28 photo, 5 link, 2 audio.
- `SUPPORTED_EXTENSIONS` membership predicate from
  `ingest_engine.py:454` — 28 of 35 eligible; the 5 HTMLs and 2 MP3s
  ineligible.
- §3.1 tag-grammar validator (re-implemented to match
  `artifact_tags.py:36-72`) — 0 of 470 live tag instances fail.
- HR-shape filename grammar parser — identifies 5 clusters cleanly
  across 14 of the 35 files; zero false positives.

**Queried (read-only) against `core/mediavault.sqlite` at MV HEAD
`0a9e953`:**

- Full row counts per (media_type, status, storage_mode,
  source_platform, ingest_source).
- Per-namespace tag distribution (470 instances across 14
  namespaces; zero bare slugs).
- Per-table schema inventory (artifacts, tags, ingest_queue,
  id_sequence) via `PRAGMA table_info`.
- The 4 NULL-media_type artifact rows in full (id, status, path,
  tags).
- The 3 remaining `mixed`-media_type artifact rows in full.
- The 22 `text-only` rows (sample of 5 rows for shape analysis).
- The 19 `released` rows in full (id, media_type, description).
- Cross-check between `intake/drop/` filesystem and `ingest_queue.raw_path`
  for all 35 files.

**Not tested in sandbox** (per §6.1's feasibility note):

- Full `ingest_engine.scan()` execution against a copy of the DB.
  Depends on Windows-resident PIL+pillow_heif+exiftool+ffmpeg and
  hardcoded `BASE` paths.
- `handle_artifact_register` POST execution. Bash sandbox cannot
  reach MV's HTTP loopback on the Windows host.

**Surfaces (surprises that the audit's write-up explicitly reflects):**

- **Three intake paths, not one.** The session brief implied
  `intake/drop/` is the primary surface; in live data, Path B
  (`/api/artifact-register`) is the dominant intake mechanism (48 of
  88 artifacts). This reshaped §1's framing.
- **`intake/drop/` is currently 33-of-35 ungueued.** Engine hasn't
  run scan recently. The audit treats this as ambient state; the
  recommendations are about what happens WHEN scan runs.
- **All 470 live tag instances pass §3.1 strict form.** Earlier in the
  Phase 2.5 migration there was concern about whether legacy bare
  slugs would persist; the audit confirms none do. The grammar
  validator can be relied upon.
- **`text-only` (22 rows) is the silent third quarter of MV's media_type
  reality** alongside `photo` and `audio`. §4.3's recommendation
  surfaces it as a real category to normalize.
- **`enrich_helper.py` is bit-rotted at the SQL level** (selects the
  retired `domain` column). Will crash on first run. M8 in the
  roadmap.
- **The 15 RWTH MP3s came in via Path B** (HR's
  `tools/rn_archive_extract.py`), not Path A. The implication: the
  engine's lack of MP3 support has never been a blocker because the
  archive tooling sidestepped it. Adding MP3 support to Path A (M4)
  doesn't fix a current need; it opens a path for FUTURE drag-and-drop
  audio ingest.

---

*End of audit. §5's roadmap names 13 work items (M1-M8, C1-C5) plus
5 operator-only gates (O1-O5). §4 surfaces one UX-facing operator
question (text-only → text vs link); §5 surfaces no others. The path
from current state to "drop files in intake/, get released, tagged,
exhibit-badged artifacts" is mechanical given §5.1 + §5.2; no
schema-level rework is required.*
