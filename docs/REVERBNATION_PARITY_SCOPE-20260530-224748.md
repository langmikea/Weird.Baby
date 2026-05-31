# ReverbNation → Album-Parity — Scoping Report

**Date:** 2026-05-30 22:47 (sandbox UTC)
**Author:** Cowork scoping session
**Posture:** Read-and-report only. **Zero mutations.** No MV write, no export, no deploy, no git commit. Every fix below is a recommendation, gated behind operator review as a separate follow-on. The only file this session writes is this report.
**Operator intent (verbatim):** *"ReverbNation — in the end, these need to behave like every other HR album."*
**Inputs read:** `CLAUDE.md`, `NAVIGATION.md`, `STATE.md`, `BACKLOG.md`, `docs/COVERAGE_AUDIT-20260530-182406.md`, `src/data/artists/hunter-root.js` (SPINE), `src/routes/exhibit/Exhibit.jsx` (coverflow + player), `src/routes/hr/HrExhibitFlow.jsx` (the deck / AudioCard / gallery container), `src/routes/hr/hr_dimensions.js`, `src/data/exhibits/hunter_root.json` (RN records), `docs/AUDIO_DELIVERY_SCOPING_BRIEF-20260522-013207.md`, `docs/HR_ACQUISITION_SCOPING_BRIEF-20260523-154141.md`, `docs/MUSEUM_UX.md`.

---

## TL;DR

"Behave like every other HR album" has a concrete, code-grounded meaning: appear in the **coverflow carousel** at the top of `/hr` with a **cover image**, an **ordered tracklist**, **per-track variant tabs**, and **sequential playback through the bottom player bar** — all driven by the hand-authored **SPINE** (`src/data/artists/hunter-root.js`) and rendered by `Exhibit.jsx`.

The 13 ReverbNation "Run With The Hunt" tracks do **none** of that. They live in a **different data system** (the MV-exported `hunter_root.json`) and render in a **different surface** (the artifact **deck**, `HrExhibitFlow.jsx`) as 13 individual square `AudioCard` tiles. They *do* play — but as standalone mp3 tiles, one at a time, with no album cover, no order, no tracklist, no player-bar integration.

So RN→album parity is **not a data clean-up — it is a bridge across two systems plus one real code feature**. The single biggest blocker: the canonical coverflow player **only plays YouTube** (`useYTPlayer` → `new window.YT.Player`), and RN tracks are **mp3 audio with no YouTube IDs**. There is no audio path in the album player today.

The **album-carousel** the vaulted `-003`/`-004` thumbnails were staged for **is the existing coverflow** — it is already built and functional; it is **not** a separate unbuilt feature. What's missing is a way to put RN *into* it, plus real cover art.

There is a genuine **fork** the operator must decide (Path 1 vs Path 2 in §4) before this becomes a build brief. Everything below is sized and sequenced; nothing is executed.

---

## 1. What an "HR album" is, concretely (the reference behavior)

An album is a **SPINE entry** in `src/data/artists/hunter-root.js`:

```js
{ id, title, year, art, accent, tracks: [ { title, videos: [ { ytId, label, type, credit? } ] } ] }
```

There are exactly **6** of them (cracked / wheel / dandelions / skipping / arkansas / crooked), 2018–2025, each with bandcamp cover art (`art: BASE + "…jpg"`), a year, an accent color, and an ordered track array. This is the canonical model; `HrArchive.jsx` `ALBUMS` and `hr_dimensions.js` are documented mirrors of it (CLAUDE.md "Data model — albums and tracks").

`Exhibit.jsx` renders that SPINE as the album experience the operator calls "the carousel" (MUSEUM_UX.md:17 — *"Top half: carousel + track list + video player. Functional."*):

- **Coverflow** — 3D cover carousel of `album.art`, with year badge and accent; drag/arrow/keyboard navigation. `Coverflow` + `AlbumCover` (`Exhibit.jsx:244–325`). `AlbumCover` falls back to an accent-gradient placeholder when `album.art` is absent.
- **Ordered TrackList** — left column, numbered tracks, per-track variant tabs (OFFICIAL / LIVE / LYRICS / COVER) as radio buttons. `TrackList` (`Exhibit.jsx:328–391`).
- **Sequential playback** — click a track → build a play queue across the album, auto-advance on end, skip back/forward. `buildPlayQueue` / `startPlay` / `advanceQueue` (`Exhibit.jsx:31–44, 575–642`).
- **Persistent PlayerBar** — bottom bar showing album art + track title + variant. `PlayerBar` (`Exhibit.jsx:410–486`).
- **FactScroller** — facts keyed to `album.id` + track title (`hr_facts.js`).

**The load-bearing constraint:** playback is **YouTube-only**. `useYTPlayer` (`Exhibit.jsx:151–232`) instantiates `new window.YT.Player(...)` with a `videoId`; the play path is `yt.loadVideo(v.ytId)` (`Exhibit.jsx:586–590`). Every SPINE track plays by `ytId`. **There is no `<audio>` / mp3 path anywhere in the album player.** No spec models "album" beyond this SPINE shape — `DATA_ARCHITECTURE_SPEC` governs the MV-artifact side, not the coverflow.

---

## 2. What the 13 ReverbNation tracks are now

### 2.1 Which records

13 audio artifacts, all `source_platform: reverbnation`, `media_type: audio`, `tags.album:["run_with_the_hunt"]`, `tags.era:["rwth"]`, `tags.type:["audio","mp3"]`:

| # | ID | Title (raw) | source_url |
|---|---|---|---|
| 1 | `MV-HR-20260417-001` | Brain Cell — audio recording | …/song/14767555-brain-cell *(deep)* |
| 2 | `MV-HR-20260417-003` | Dead Man — audio recording | …/runwiththehunt *(bare)* |
| 3 | `MV-HR-20260417-005` | Doors with Keys — audio recording | …/runwiththehunt *(bare)* |
| 4 | `MV-HR-20260417-007` | Eyes are Oceans — audio recording | …/song/13297881-eyes-are-oceans *(deep)* |
| 5 | `MV-HR-20260417-009` | Freezer Burnt — audio recording | …/runwiththehunt *(bare)* |
| 6 | `MV-HR-20260417-011` | Northern Light Streaks — audio recording | …/runwiththehunt *(bare)* |
| 7 | `MV-HR-20260417-013` | Playing Music with Our Bones — audio recording | …/runwiththehunt *(bare)* |
| 8 | `MV-HR-20260417-015` | Same Page — audio recording | …/runwiththehunt *(bare)* |
| 9 | `MV-HR-20260417-017` | Straightlaced — audio recording | …/song/13563739-straightlaced *(deep)* |
| 10 | `MV-HR-20260417-019` | Think My Mind — audio recording | …/runwiththehunt *(bare)* |
| 11 | `MV-HR-20260417-021` | Time Flow Zero — audio recording | …/song/14309195-time-flow-zero *(deep)* |
| 12 | `MV-HR-20260417-023` | Trees and Everything — audio recording | …/runwiththehunt *(bare)* |
| 13 | `MV-HR-20260421-001` | Song — audio recording | …/runwiththehunt *(bare)* |

Each has a **unique, playable** `primary_url` (`.mp3` on `assets.weird.baby`) and **all 13 share one** `thumbnail_url` (`…/thumbnails/42/4289f4a0…jpg`) — the album-static thumbnail chosen by the Audio Delivery brief §5.1 Option B (*"visually unifies all RWTH content (which IS one album)"*). `post_date` is `null` on all 13.

### 2.2 How they render today

They are **not in the SPINE**, so they have **zero presence in the coverflow**. They render only in the **deck** (`HrExhibitFlow.jsx`) as `media_type:"audio"` → `AudioCard` (`HrExhibitFlow.jsx:900–1019`, dispatched at `:1306–1327`): a square album-art tile with a custom play/pause button over a hidden `<audio src={card.primary_url} preload="none">`. Playback is **one-card-at-a-time** via a lifted `playingAudioId` in the root component, and is **decoupled from the canonical PlayerBar** (Audio Delivery brief: *"Concurrent playback (canonical PlayerBar + AudioCard) is acceptable"*). They are hard-forced to a 1-column square (`:1267`) per the 2026-05-22 "matching album art" operator-lock.

The only "grouping" that exists today is a **pill filter**: under v5 the deck's pill columns are derived dynamically from artifact tags (`hr_dimensions.js::buildDimensions`), so `album:run_with_the_hunt` surfaces as a clickable **Album → "Run With The Hunt"** pill that filters the grid to these 13 tiles. (Note: the in-code comment at `HrExhibitFlow.jsx:1365` that says Album/Song pills "mirror the spine (un-clickable until tagged)" is **stale** — under v5 the album pill comes from tags and *is* clickable for RN.) A pill filter is not a visual album unit — no cover, no order, no tracklist, no sequencing.

### 2.3 Metadata completeness vs. what an album needs

| Album needs (from §1) | RN has? | Gap |
|---|---|---|
| `title` (album) | "Run With The Hunt" (from tag, prettified) | OK as a label; not a SPINE field |
| `art` (cover image) | **No** — only a shared 400×400 thumbnail | **Real cover art missing** |
| `year` | **No** — `post_date` null; era `rwth` ("pre-2018" per Audio brief §1.4) | **Missing** |
| `accent` | **No** | Missing (cosmetic) |
| ordered `tracks[]` w/ titles | 13 titles exist, but **no track order / numbers** (post_date null; no surfaced ID3 index) | **Ordering undefined** |
| per-track playable media | 13 unique mp3 `primary_url`s | Present — but **mp3, not `ytId`** |
| per-track variant (`type`) | `content_kind` absent on all audio (Coverage Audit G5) | N/A unless operator wants variants |

### 2.4 The shared-source-URL question — what it actually breaks

The Coverage Audit (G8) flagged "10 tracks → 1 URL." **Measured precisely here: 9 of the 13 carry the bare artist-page URL `reverbnation.com/runwiththehunt`; 4 carry per-song deep links** (-001, -007, -017, -021). This is **one fewer than the audit's "10"** — flagged for the next session to reconcile against a fresh MV pull; it does not change the conclusion.

**What it breaks for album parity: almost nothing.** `source_url` is *not* the playback mechanism — the per-track `primary_url` mp3 is, and those are **unique per track**. For audio cards `source_url` isn't even rendered (AudioCard has no `<a>` wrapper). No duplicate-card collapse results (export dedups on `id`, and the audit found no duplicate *source_url* among the audio set — the two dup pairs were Facebook). So the shared URL is a **provenance/"view original" enrichment gap**, not a parity blocker: 9 tracks point a visitor at the artist page rather than the specific song. "Album parity" does **not** require fixing it; per-track playback is already keyed off the unique mp3, which is what matters.

---

## 3. The album-carousel thread — resolved

**Question:** does an "Album-Carousel" feature exist / is it partially built / is it needed, and does RN parity depend on it?

**Answer: it EXISTS and is the *existing coverflow*.** "The carousel" in the operator's vocabulary is the top-half coverflow of `Exhibit.jsx` (MUSEUM_UX.md:17 calls it "carousel … Functional"). A repo-wide search for an `Album-Carousel` / `album_carousel` component returns **no separate, partially-built feature** — the "carousel" hits are the existing coverflow (`Exhibit.jsx`, `MUSEUM_UX.md`, `UX_SPEC`, CSS) and unrelated "multi-image carousel" (Instagram scraping).

**The vaulted `-003`/`-004` connection.** Per Coverage Audit §7, the operator identified `MV-20260419-004` (Medusa's Disco artwork) and `MV-20260419-003` (a candid guitarist photo) as **"intended Album-Carousel thumbnails"** that had been mis-living as untitled exhibit cards. They were un-released to `vault` (asset retained "for its intended use"). Read together, this reveals the operator's mental model: **pre-2018 ReverbNation-era projects (Run With The Hunt, and Medusa's Disco) should appear as cover-bearing albums in the carousel** — and cover-grade images are being staged for exactly that.

**So RN parity depends on the carousel only in this sense:** the carousel is *where albums live and behave*, and it already exists — RN parity does **not** require building a new carousel. What it requires is (a) a path to put RN into the carousel, (b) real cover art, and (c) audio playback in the player. **Caveat on the vaulted assets:** `-004` is *Medusa's Disco* art (a different project) and `-003` is a candid photo — **neither is confirmed as the Run With The Hunt cover.** Treat them as cover-art *candidates*, and expect the operator to designate/provide a true RWTH cover.

---

## 4. The fork — two paths to "behave like every other album"

Parity sits **across the boundary** between the hand-authored SPINE/coverflow and the MV-export/deck. The architecture (NAVIGATION.md Criteria 1–8) deliberately made **MV the source of truth** and removed hand-authored card data. That makes the path choice a real operator decision with different scope and different architectural cost. **This is the gating decision; it should be made before any build brief.**

### Path 1 — Promote RN into the SPINE / coverflow (literal parity)

Add a `run_with_the_hunt` album to the SPINE so it appears in the coverflow exactly like the other six.

- **Pro:** literal "behaves like every other album"; uses the exact reference surface; the vaulted cover-art intent fits naturally.
- **Con / cost:** requires the **mp3-in-album-player code feature** (the big one — see §5 F2); and it **re-introduces hand-authored album data into the SPINE**, which the source-of-truth refactor spent eight criteria removing — either you hand-key 13 tracks into `hunter-root.js` (duplicating MV data) or you build an **export→SPINE bridge** (code). Crosses the YouTube-only assumption baked into `useYTPlayer`.

### Path 2 — Album-group the RN tracks *in place*, inside the deck (parity-in-place)

Build an **album container** in the deck — modeled on the existing **gallery container** (`card_kind:"gallery"`, `GalleryCard`/`GalleryOverlay`, `HrExhibitFlow.jsx:1138–1247`, with `cover_artifact_id` + ordered `gallery[]`, e.g. `MV-20260529-001`) — as a new `card_kind:"album"` that shows a "Run With The Hunt" cover tile, opening to an ordered tracklist with sequential mp3 playback (extend the existing one-at-a-time AudioCard path with auto-advance).

- **Pro:** stays inside the deck's **existing mp3 audio path** (no surgery on the YouTube-only canonical player); reuses a proven container precedent; keeps **MV as source of truth** (the container is an MV artifact, like the gallery container); no SPINE duplication.
- **Con:** it's "album-like *within the deck*," not literally a tile in the top coverflow. If "behave like every other album" specifically means *in the top carousel*, Path 2 doesn't fully satisfy it.

**Recommendation:** confirm intent with the operator first. If the requirement is literally the top coverflow + the vaulted cover-art story, **Path 1**. If the requirement is "a real, ordered, cover-bearing, playable album unit" and the surface is flexible, **Path 2** is materially cheaper and architecturally cleaner. A viable **hybrid** also exists: do Path 2 now (cheap, MV-true), and treat coverflow promotion (Path 1) as a later milestone once an mp3 album-player exists.

---

## 5. Gap list — itemized, sized, classified, sequenced (zero execution)

Fix classes: **data-only** = MV data edit → `export-artifacts` → redeploy (no schema/code); **MV-write** = status/row mutation to MV (hard stop, operator-gated, snapshot + MV-closed write per CLAUDE.md); **asset** = produce/host an image or media file; **code** = museum/export source change. Sizes XS→L.

| # | Gap | Needed for | Class | Size | Notes / sequence |
|---|---|---|---|---|---|
| **G-DEC** | **Path 1 vs Path 2 decision** | both | decision | — | **Gating. Do first.** Everything downstream depends on it. |
| **F1** | **Album cover art for Run With The Hunt** — only a shared thumbnail exists; vaulted `-003`/`-004` are candidates, not confirmed (and `-004` is Medusa's Disco) | both | asset (+ data to attach) | S–M | Operator designates or provides a true RWTH cover; host on R2 / `assets.weird.baby`. Blocks the "cover" half of parity in either path. |
| **F2** | **mp3 playback in the album player** — `useYTPlayer` is YouTube-only; SPINE tracks carry `ytId`, RN is mp3 | **Path 1 only** | code | **L** | Add an `<audio>`/HTML5 path to the canonical player + PlayerBar; branch per-track on `ytId` vs `audioUrl`. Largest item; the true cost of literal coverflow parity. |
| **F3** | **Album-container renderer in the deck** (`card_kind:"album"`) modeled on the gallery container, with ordered tracklist + sequential mp3 auto-advance | **Path 2 only** | code | M | Reuses `GalleryCard`/`GalleryOverlay` + AudioCard patterns; no canonical-player change. |
| **F4** | **Album-container artifact in MV** (cover_artifact_id + ordered child list of the 13) | **Path 2** | MV-write | S | One container row, like `MV-20260529-001`. Then re-export. |
| **F5** | **SPINE entry for run_with_the_hunt** (id/title/year/art/accent + 13 ordered tracks → mp3) — or an export→SPINE bridge | **Path 1** | code + data | M–L | Direct hand-author duplicates MV data (architecture tension); a bridge is cleaner but more code. Depends on F1 (art), F6 (order), F7 (year). |
| **F6** | **Track ordering** — no order/track numbers exist (post_date null; no ID3 index surfaced) | both | data-only (+ maybe MV) | S | Operator supplies running order, or recover ID3 track index from the source mp3s (per Audio brief §9.1 ID3 path). |
| **F7** | **Album year / era** — `year` missing; era `rwth` ≈ pre-2018 (Audio brief §1.4) | both | data-only | XS | Operator confirms a display year. |
| **F8** | **Title cleanup** — strip the "— audio recording" suffix for tracklist display ("Brain Cell" not "Brain Cell — audio recording") | both | data-only (MV) or display | XS | Either retag titles in MV, or strip on render. |
| **F9** | **`accent` color** for the album | both | data-only | XS | Cosmetic; pick a hex like the other six. |
| **F10** | **Shared source_url (9 bare)** — provenance only; does NOT block parity (§2.4) | neither (enrichment) | data-only | M | Optional. Enrich 9 bare URLs with per-song deep links if recoverable. Low priority. |
| **F11** | **Reconcile shared-URL count** — this session found 9 bare vs the Coverage Audit's "10" | hygiene | verify-only | XS | Re-pull from MV to settle the off-by-one. |
| **F12** | **Confirm the vaulted-thumbnail provenance** — is `-003`/`-004` actually the RWTH cover, or just staged? `-004` is Medusa's Disco | F1 | decision | XS | Determines whether F1 is "attach existing" or "produce new." |

### Suggested sequence

1. **G-DEC** — operator picks Path 1 or Path 2 (or hybrid). *Nothing else starts first.*
2. **F12 + F1 + F7 + F6** — settle cover art, year, and track order (the data/asset facts parity needs regardless of path). F8/F9 fold in here cheaply.
3. **Then, by path:**
   - *Path 1:* **F2** (mp3 album player) → **F5** (SPINE entry / bridge).
   - *Path 2:* **F3** (album-container renderer) → **F4** (MV container artifact) → re-export.
4. **F10/F11** — optional enrichment/hygiene, any time; not on the parity critical path.

Per CLAUDE.md quirk #10, batch all MV-writes (F4, and any of F6/F8 done MV-side) into a single approved session — one snapshot, one re-export, one deploy — and capture before/after artifact counts.

---

## 6. Acceptance-criteria check

1. ✅ **"Behave like every other HR album" defined concretely**, grounded in the SPINE shape + `Exhibit.jsx` coverflow/tracklist/player and the YouTube-only player constraint (§1, cited to file:line).
2. ✅ **RN current state measured against that bar** — the 13 IDs, their mp3/thumbnail/tag shape, deck-only `AudioCard` rendering, and the shared-URL issue measured precisely (9 bare / 4 deep, with the audit-discrepancy flagged) (§2).
3. ✅ **Album-carousel question resolved** — it is the *existing* coverflow (built, functional), not a separate unbuilt feature; the vaulted `-003`/`-004` are staged cover-art candidates for putting RN-era projects into it; RN parity depends on the carousel as the destination, not on building a new one (§3).
4. ✅ **Gap list with sized, sequenced, classified fixes — zero execution** (§5).

**Mutations performed: 0.** This report is the deliverable.

> **Commit note (per CLAUDE.md §2 / FUSE-truncation risk):** do not commit from the sandbox. Stage host-side in PowerShell with the explicit path:
> `git add docs/REVERBNATION_PARITY_SCOPE-20260530-224748.md` then commit + push host-side.

---

## BUILD ADDENDUM — Path 2 executed (2026-05-30, later session)

Operator chose **Path 2** (album-group in place, MV-true) and the **full RN list** (15 tracks). G-DEC resolved.

**Museum-side code built + verified (sandbox):** `card_kind:"album"` container — the audio analogue of the
gallery container. `AlbumCard` deck tile (cover + track-count badge) opens `AlbumOverlay` (ordered numbered
tracklist, sequential mp3 auto-advance, reuses the existing `<audio>` path; **no new player subsystem**, so
F2 is avoided as intended). Export `card_kind:"album"` branch orders `tracks[]` by `notes.track_order`,
excludes the cover child, assigns `track_no`, resolves the cover thumbnail. Files: `HrExhibitFlow.jsx`,
`HrExhibitFlow.css`, `tools/export-artifacts.mjs`. Lint held at the documented **4 err / 6 warn** baseline
(zero new); babel-parse + export unit test + full pipeline dry-run all pass. Build/deploy are host-side.

**Cover (F1/F12) — resolved.** Operator confirmed `MV-20260419-003` (clean couch/acoustic-guitar shot) as
the cover. The MP3s' embedded art is the **same image watermarked "ReverbNation"**; the clean vaulted `-003`
is the master. `-004` is *Medusa's Disco* (unrelated). `-003` was R2-synced but `vault`; it is **re-released**
in the MV-write step so it survives re-sync.

**Track order (F6) — resolved.** Not in the data (post_date null; ID3 carries title only). Taken from the
**ReverbNation `/songs` page** per operator directive (the 15-song order, archive-confirmed).

**Scope correction (was stale).** "13 RN tracks" → MV actually holds **all 15** already; **no ingest**.
Whiskey to the Sun = `MV-HR-20260417-025` (`vault`→released). Park Bench Pigeons = `MV-HR-20260416-014`
(audio child of archived page `-011`; re-parented onto the album; a duplicate PBP family exists at `-005`).

**Remaining (host-side, gated):** run `rwth_album_mvwrite.py --apply` (MV closed, auto-snapshot) →
`sync-assets-to-r2` → `export-artifacts` (top-level 76→64, intended) → build → deploy → live-verify →
host-side commit. Full steps in `docs/RWTH_ALBUM_RUNBOOK-20260530.md`.
