# YouTube Ingest — `yt_archive/v1` schema

**Status:** Design v1.1 (2026-05-08). Targets shipped MediaVault v0.5. Design-and-docs only; the capture CLI is deferred pending decisions captured in §9.

**Scope decision:** YT-adjacent artifacts only. Per `weird-baby-museum`'s `VISION_LOCK_v0.3.md` G-01, YouTube videos themselves stay in SPINE (`src/data/artists/<artist>.js`). MediaVault holds the curation surface around them — thumbnails, descriptions, transcripts, page snapshots, and a stub metadata record that anchors the children.

The video itself is intentionally out of scope for MV. The watch URL and SPINE-level metadata (title, variant, `youtube_id`) stay where the museum already reads them. MediaVault never becomes the canonical home for the video.

## 1. Pipeline at a glance

A capture script (in `Hunter Root\tools\`, not yet written) walks one or more YouTube URLs, downloads adjacent assets, writes them under `Hunter Root\archive\youtube\<channel_slug>\<video_id>\`, and emits a `mediavault_manifest.json` in `yt_archive/v1` shape. The same script then POSTs each artifact in the manifest to MV's `/api/artifact-register` HTTP endpoint, threading the parent's minted `MV-YYYYMMDD-NNN` ID into each child's `parent_artifact_id` field.

This differs from the previously sketched "operator runs `ingest_engine.py scan --capture-json`" flow. That flag is documented in `MediaVault\SPEC.md` and `MediaVault\WORKFLOW.md` but **does not exist in v0.5 code** — see §6 for details and the path-of-least-resistance decision.

## 2. Manifest schema — `yt_archive/v1`

```jsonc
{
  "schema_version": "yt_archive/v1",
  "generated_at": "ISO8601",
  "page_type": "youtube_video",
  "canonical_url": "https://www.youtube.com/watch?v=<video_id>",
  "video_id": "<video_id>",
  "channel_id": "<channel_id>",
  "channel_name": "<channel display name>",
  "channel_url": "https://www.youtube.com/channel/<channel_id>",
  "artifacts": [ /* see §3 */ ],
  "curator_review_required": []
}
```

`page_type: "youtube_video"` is the discriminator that downstream tools key on. `canonical_url` is the watch URL. `video_id` and `channel_id` are extracted once at the top so consumers don't have to re-parse them out of every artifact.

Per-artifact entries follow the same envelope as `rn_archive/v1`:

```jsonc
{
  "mv_id": null,                     // null until ingested; MV assigns MV-YYYYMMDD-NNN
  "type": "<see §3>",
  "fact1": "short description",
  "fact2": "longer description",
  "weight": 1.0,
  "era": "<era_slug>",                // optional pre-pill era tag
  "src": "source URL",
  "date": "YYYY-MM-DD",              // upload date for parent; capture date for snapshots
  "date_source": "youtube_api | scrape | unknown",
  "tags": [ /* §4 */ ],
  "files": { /* §3 */ },
  "extracted_text": "...",            // populated for description and transcript
  "parent_role": "parent | child",    // structural hint; see §6
  "notes": []
}
```

`parent_role` is the only field that doesn't appear verbatim in `rn_archive/v1`. It tells the orchestrator which artifact to register first and which to register after. The previous draft of this schema used `parent_ref` to declare a within-manifest reference resolved by `ingest_engine`; that mechanism doesn't exist (see §6) and the field has been replaced.

## 3. Artifact types and storage modes

Five types: one parent + four children (one of which is channel-scope rather than video-scope and only emitted once per channel).

**`youtube_video_page`** — parent, required, one per video. The metadata stub for the watch page. `storage_mode: url_only`. `source_url` is the watch URL. `extracted_text` carries the full video description. `media_type: link`. `parent_role: "parent"`. This row exists so children have something to hang off and so the operator has a single place to attach video-level pills. It is *not* the video — that stays in SPINE — and `url_only` ensures no bytes are pulled.

**`youtube_thumbnail`** — child, recommended. `storage_mode: vaulted`. Maxres thumbnail JPEG (or hqdefault if maxres is unavailable). MV copies the bytes into `catalogs/_assets/`. `media_type: photo`. `files.image_file` points at the local file written by the capture script; the API call passes the absolute path. Worth vaulting because thumbnails are small, durable, and frequently consumed by the museum's poster slots.

**`youtube_transcript`** — child, recommended when available. `storage_mode: url_only` with the full transcript text in `extracted_text`. `media_type: text`. No separate file — the transcript lives in the DB column, queryable via MV's existing search. Source can be auto-captions, community captions, or operator-written; record which in `notes`.

**`youtube_page_save`** — child, optional. `storage_mode: vaulted`. A single-file HTML snapshot of the watch page (e.g., from SingleFile or a headless capture). `media_type: link`. Useful for forensic archival when YT later changes layout, removes the video, or alters the description. Skip on routine ingest; reach for it on rare or contentious items.

**`youtube_channel_card`** — channel-scope rather than video-scope. `storage_mode: url_only`. A separate row representing the channel itself, useful when ingesting a first video from a new channel. `source_url` is the channel URL; `extracted_text` carries the channel description. Only emit one of these per channel across the manifest set, not per video. `parent_role: "parent"` within its own (channel-scope) manifest; otherwise omitted.

A typical music-video ingest produces three rows: parent + thumbnail + transcript. A "scrape everything" ingest adds the page save and (first time only) the channel card.

## 4. Pill conventions and the `content_kind` / `artifact_kind` split

The earlier draft of this schema used `content_kind:` for two different purposes — the museum's locked variant taxonomy on the parent (music_video / live / lyrics / cover) and the asset-type label on children (thumbnail / transcript / page_save). That collision is corrected here: each concept gets its own namespace.

**Parent (`youtube_video_page`) pills:**

`content_kind:<official | live | lyrics | cover>` — the museum's locked-May-2026 variant taxonomy (see `CLAUDE.md` §"Track media variant taxonomy"). This is the *only* place `content_kind:` appears. The slug values are exactly the same as the `type` field in SPINE's `videos[].type`, so the cross-references line up trivially.

`platform:youtube` — source platform.

`scope:<project_slug>` — which downstream project consumes this. `scope:hunter_root` for HR; future projects mint new slugs.

`author:<artist_slug>` — v0.5+ replacement for the dropped `author_name` column. `author:hunter_root`, `author:carsie_blanton`, etc. Slug should match whatever the SPINE entry uses for the same artist.

**Child pills (`youtube_thumbnail`, `youtube_transcript`, `youtube_page_save`):**

`artifact_kind:<thumbnail | transcript | page_save>` — new namespace, asset-type label. No overlap with `content_kind:`.

`platform:youtube`, `scope:<project_slug>`, `author:<artist_slug>` — same as parent.

Children deliberately do **not** carry `content_kind:` — the variant is a property of the video, not of its thumbnail or its transcript. A consumer looking for "all live transcripts" should join across the parent's `content_kind:live` and the child's `artifact_kind:transcript` via `parent_artifact_id`.

**`youtube_channel_card`:** `artifact_kind:channel_card`, plus `platform:youtube`, `scope:<project_slug>`, `author:<artist_slug>`. No `content_kind:`.

**Optional pills** the capture script may propose (operator confirms or rejects in the Inbox UI):

`era:<era_slug>` — propagate from SPINE if present.

`rarity:<level>` — for unusual finds (deleted-then-restored, private-now-public, etc.). Don't mint by default.

`topic:<topic>` — anything thematic the description text suggests. Always emit as a `notes[]` entry prefixed `suggest_pill: <slug>` so the operator decides; do not put unconfirmed thematic pills in `tags[]`.

## 5. Parent / child structure

Within a single manifest there is exactly one parent (`youtube_video_page`) and zero or more children. `parent_role: "parent"` marks it. Child rows carry `parent_role: "child"`. The orchestrator (§6) registers the parent first, captures the assigned `MV-YYYYMMDD-NNN` ID from the API response, then registers each child with `parent_artifact_id` set to that captured ID.

The channel-scope manifest is its own ingest with one parent (`youtube_channel_card`) and zero children. Its purpose is to mint a stable channel-scope MV ID that future video-scope manifests can reference if the operator wants to attach `youtube_video_page` rows to it as a grandparent. That's optional — the v1.1 default is to leave video pages parentless at the artifact level and rely on `scope:` and `author:` pills for cross-video grouping.

## 6. Parent linkage — what v0.5 actually supports

Three findings, each load-bearing for this design:

**`scan --capture-json` is documented but unimplemented.** `MediaVault\SPEC.md` line 244 and `MediaVault\WORKFLOW.md` line 66 both reference `python ingest_engine.py scan --capture-json <file>`. The CLI parser at `core/ingest_engine.py:762-783` only accepts `scan`, `process`, `status` — no flags. The `scan()` function reads single-post Chrome-extension `mv-capture-*.json` files (`queue_capture_json` at line 188) and supported-extension files in the drop zone. There is no multi-artifact-manifest reader anywhere in the codebase.

**`parent_ref` is unimplemented.** None of MV v0.5's code parses a `parent_ref` field. The 19 existing `rn_archive/v1` manifests under `Hunter Root\archive\reverbnation\` do not use `parent_ref` either — their `artifacts[]` arrays list siblings without parent declarations.

**The parent-linkage mechanism that does exist is the API.** `POST /api/artifact-register` (in `core/imgserver_extensions.py:194-356`) accepts `parent_artifact_id` as an optional body field (line 210, line 329) and writes it into the artifacts table's self-FK. The endpoint validates enums, slugifies tags, and mints `MV-YYYYMMDD-NNN` via `_next_artifact_id` on each call. There is no batch endpoint and no within-manifest reference resolution.

**Path of least resistance for v0.5:** drop `parent_ref` entirely; do not patch `ingest_engine.py`; do not invent a vapor CLI flag. The capture script (when written) becomes the orchestrator: it parses the manifest, calls `POST /api/artifact-register` once for the parent, captures the response's `id`, then loops the children with `parent_artifact_id` threaded in. Bytes for `vaulted` children (thumbnails, page saves) are written to disk first by the capture script and the absolute path is passed in `local_asset_path`. `url_only` artifacts (parent video page, transcript, channel card) pass `local_asset_path: null` — MV's `/api/artifact-register` accepts null as of v0.5.1. Zero MV-side patches are needed for parent linkage to work.

Alternative path (rejected for now): patch `ingest_engine.py` to add `--capture-json` + `parent_ref` resolution. Lands the documented feature, but blocks YT ingest behind a v0.5 → v0.5.x release that's not on the punchlist. Not worth it unless the punchlist grows other reasons to do this.

## 7. Folder layout

The capture script writes to a folder per video, parallel to the RN archive:

```
C:\AI\Projects\Hunter Root\archive\youtube\
  <channel_slug>\
    _channel\
      mediavault_manifest.json        # channel_card only, written once
      channel_about.html               # optional HTML save
    <video_id>\
      mediavault_manifest.json        # parent + children for this video
      thumbs\<video_id>_maxres.jpg
      snapshots\<video_id>.html        # if page_save requested
      transcripts\<video_id>.txt       # mirror of extracted_text, for diff/review
      capture.log
```

`channel_slug` is the human-readable form (`hunter-root`, not `UCxxxxx`). One folder per video means each manifest is independently re-runnable. The `_channel/` folder is a sibling, not a parent, so adding a new channel doesn't shift any existing video paths.

Re-running an already-registered manifest: the orchestrator checks each artifact's `mv_id`. If non-null, skip. To force re-register, the operator clears `mv_id` in the manifest and re-runs (this will produce duplicate rows in MV — only do it deliberately).

## 8. Operator flow

The orchestrator (capture script) handles registration end-to-end. The operator's role is curation in the Inbox UI after registration completes, same as for any other MV ingest.

For each new video the operator: runs the capture script with the watch URL; the script writes the folder, the manifest, and POSTs each artifact, returning a list of minted MV IDs; opens the Inbox in MV at `http://localhost:51822/`; reviews the new rows (parent + thumbnail + transcript by default); confirms or adjusts pills; clicks Save to Vault on each. Standard R-rules apply (R1 won't fire if `post_date` was supplied via the upload date; R4 won't fire because `scope:` is supplied by the script).

Releasing a YT-adjacent artifact (★) follows the standard MV lifecycle. Releasing the parent does not auto-release children — that's an operator decision per artifact.

## 9. Open items and v0.7 considerations

**`local_asset_path` is now optional for `url_only` artifacts** (MV patch landed 2026-05-08, logged in MV `CHANGELOG.md` as v0.5.1). The capture script may pass `local_asset_path: null` for the parent video page, transcript, and channel card; MV records the row with a NULL path. Stub sidecar files are no longer needed.

**Capture script is the next deliverable.** Lives in `Hunter Root\tools\yt_archive_capture.py`. Two responsibilities: write the manifest folder; orchestrate the API calls. Keep them separable so a "manifest only" mode is possible (for review-before-register).

**v0.7 punchlist exposure.** The pending v0.7 changes (collapse five-state pill model to three, drop `is_proposed`, revert to global slug uniqueness, properly wire `archived_at`) do not affect this schema. Pills emitted by the capture script land in `tags[]` as plain slugs, which is the same input shape v0.5 and v0.7 both accept. The pill state machine v0.7 collapses is a UI/review-time concern, not a manifest concern.

**Transcript provenance.** Auto-captions are imperfect; community captions can be wrong. `notes[]` should record which source produced the transcript, and the operator should treat `youtube_transcript` artifacts as drafts unless personally reviewed.

**Copyright posture.** `vaulted` thumbnails and page saves are low-risk for archival/museum context. Video bytes are deliberately not vaulted — consistent with G-01 and avoids the larger fair-use question.

**Suggested next steps (in order).** First, decide whether to write the capture script before or after a dry-run with one HR video registered manually via curl. Second, write `Hunter Root\tools\yt_archive_capture.py` against this schema. Third, dry-run on one video, eyeball the three queue rows, save to vault, confirm pills and parent linkage round-trip. Fourth, document any deviations in `Hunter Root\_cowork\` and version-bump the schema if the deviations break the contract.

## 10. Example manifest

See `tools/yt_archive_v1.example.json` in this repo for a complete example with the current namespace conventions applied. The parent uses `content_kind:official` (museum's locked variant taxonomy); children use `artifact_kind:thumbnail | transcript | page_save`.
