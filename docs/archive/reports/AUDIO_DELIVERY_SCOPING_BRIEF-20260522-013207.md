# Audio Delivery — Scoping Brief

**Date:** 2026-05-22 (session ~01:00–02:00 UTC)
**Trigger:** Phase B of Asset Delivery closed with a scope reversal (Option A,
per `docs/PHASEB_RUN_REPORT-20260522-010001.md` §2.2). The 15 audio
artifacts in MV's released set were deferred to a follow-on scoping brief.
This is that brief.
**Scope:** Scoping only. No code, no infrastructure changes, no MV writes,
no R2 writes in this session. Output is this document. Implementation is a
fresh-Claude follow-on session.
**Status:** SCOPING COMPLETE; implementation green-lit pending operator
answers to §5 (operator-call section).

---

## §0 — How to read this brief

Mirrors the format of `docs/ASSET_DELIVERY_SCOPING_BRIEF-20260521-114500.md`
with adjustments for what the read-through audit revealed. §1 inventories
the 15 audio artifacts including a file-extension breakdown (per
PHASEB_RUN_REPORT §7.1's lesson committed); §2 names the locked target
delivery shape; §3 specifies the build-step changes needed including a
render-layer audit (per PHASEB_RUN_REPORT §7.3); §4 plans the migration;
§5 enumerates operator decisions that must be made before implementation;
§6 sequences the work; §7 records what is explicitly out of scope.

All technical decisions in §2-§4 are LOCKED by this brief unless §5 calls
them open. The fresh-Claude implementation session executes the locked
decisions mechanically, modulo audit-on-entry re-verification.

**Path A scope** (per operator decision 2026-05-22): this work item ships
the 15 audio artifacts as P3 Artifacts inside `HrExhibitFlow.jsx`'s grid
— rendered by a new `AudioCard` component, with playback contained to the
card and not coordinating with the canonical `PlayerBar` in `Exhibit.jsx`.
The "v1.5 source-agnostic player" framing (RWTH as a real spine tile in
`hunter-root.js`, MP3 playback through the canonical PlayerBar) is
**explicitly out of scope** for this work item and named in §7 as a
follow-on. Path A's outputs (R2 audio URLs, manifest entries) are
forward-compatible with Path B; nothing this brief locks blocks the
follow-on.

---

## §1 — Audio inventory (verified 2026-05-22, audit-on-entry)

### 1.1 — Released, exhibit-badged, mixed media_type

Direct query of `C:\AI\Platform\MediaVault\core\mediavault.sqlite`,
filter: `media_type='mixed' AND status='released' AND tags LIKE
'%exhibit:hunter_root%'`. 15 artifacts:

| Artifact | Track title (from MV) | Album tag | type tags | source |
|---|---|---|---|---|
| MV-HR-20260416-014 | Park Bench Pigeons | run_with_the_hunt | audio, mp3 | reverbnation |
| MV-HR-20260417-001 | Brain Cell | run_with_the_hunt | audio, mp3 | reverbnation |
| MV-HR-20260417-003 | Dead Man | run_with_the_hunt | audio, mp3 | reverbnation |
| MV-HR-20260417-005 | Doors with Keys | run_with_the_hunt | audio, mp3 | reverbnation |
| MV-HR-20260417-007 | Eyes are Oceans | run_with_the_hunt | audio, mp3 | reverbnation |
| MV-HR-20260417-009 | Freezer Burnt | run_with_the_hunt | audio, mp3 | reverbnation |
| MV-HR-20260417-011 | Northern Light Streaks | run_with_the_hunt | audio, mp3 | reverbnation |
| MV-HR-20260417-013 | Playing Music with Our Bones | run_with_the_hunt | audio, mp3 | reverbnation |
| MV-HR-20260417-015 | Same Page | run_with_the_hunt | audio, mp3 | reverbnation |
| MV-HR-20260417-017 | Straightlaced | run_with_the_hunt | audio, mp3 | reverbnation |
| MV-HR-20260417-019 | Think My Mind | run_with_the_hunt | audio, mp3 | reverbnation |
| MV-HR-20260417-021 | Time Flow Zero | run_with_the_hunt | audio, mp3 | reverbnation |
| MV-HR-20260417-023 | Trees and Everything | run_with_the_hunt | audio, mp3 | reverbnation |
| MV-HR-20260417-025 | Whiskey to the Sun | run_with_the_hunt | audio, mp3 | reverbnation |
| MV-HR-20260421-001 | Song | run_with_the_hunt | audio, mp3 | reverbnation |

### 1.2 — Format breakdown by file extension

Per PHASEB_RUN_REPORT §7.1's lesson committed. From `local_asset_path`
inspection:

| Extension | Count | Notes |
|---|---|---|
| `.mp3` | 15 | All artifacts; ReverbNation downloads |

Single-format set. No HEIC-style decode surprises expected.

**File-system check needed in implementation session (NOT in this scoping
read):** for each artifact, confirm the file exists on disk at the
recorded `local_asset_path`, measure its size, hash its contents. Per the
brief's going-in state, total ~79 MiB across the 15 (~5.3 MiB average).

### 1.3 — Tag completeness

Every artifact carries the same 6-tag shape:
- `album:run_with_the_hunt`
- `exhibit:hunter_root` (routing tag, filtered out of pill discovery per `hr_dimensions.js`)
- `people:hunter_root`
- `source:reverbnation`
- `type:audio`
- `type:mp3`

**Two tag namespaces relevant to dispatch and rendering:**
- `type:audio` is what *actually* identifies these as audio artifacts.
  `media_type='mixed'` is ambiguous (PHASEB_RUN_REPORT §7.2). The
  Path A dispatch question (key on tags vs key on a normalized
  `media_type='audio'`) is a §5 call.
- `era:` is absent. UX_SPEC v0.3 §D.2 names `rwth` as the era for
  Run With The Hunt content. Adding `era:rwth` tags is a §5 call;
  v1 doesn't surface era as a visitor-operable filter (UX_SPEC
  §C.5.0) so the consequence today is data-layer only.

### 1.4 — Album-tag observation (Phase B §6.2 mismatch reconciliation)

PHASEB_RUN_REPORT §6.2 flagged a mismatch between MV's album tag and
`HrArchive.jsx`'s hand-coded ALBUMS constant. The mismatch has two parts:

1. **The album-tag-value differs from what Phase B's brief recorded.**
   Phase B's brief named the tag as `album:medusas_disco`. The live MV
   data uses `album:run_with_the_hunt`. The file paths under MV's
   catalogs confirm "Run With The Hunt" is the correct project
   (`C:\AI\Projects\Hunter Root\archive\reverbnation\runwiththehunt\`).
2. **`HrArchive.jsx`'s ALBUMS constant doesn't include "Run With
   The Hunt" or "Medusa's Disco."** Both are pre-2018 identities;
   ALBUMS lists only the 2018-2025 solo discography.

**Per UX_SPEC v0.3 §D.4, `HrArchive` is killed as a v1 visitor surface.**
The file remains in the repo but is not linked from any visitor UI;
direct URL to `/hr/archive` redirects to `/`. The reconciliation question
PHASEB §6.2 raised is therefore moot for v1. Recorded in §6 of this
brief, not §5.

If `HrArchive` is ever revived post-v1, the reconciliation will need MV
data on Run With The Hunt + Medusa's Disco + Seeds tracks (the
pre-2018 spine positions UX_SPEC §D.2 names but the code's SPINE doesn't
yet have).

### 1.5 — Repository HEADs at audit time

- MV: `0a9e953887e54633019ed86b75b7772c9d9b73ab` — matches Phase B exit.
- Museum: `2248990986f43f20c8dad7151d07e78aed4c105b` — matches Phase B exit.
- HR: `af1486a0b8af7583bff31c1e2fea1ab34a651f03` — matches Phase B exit.
- All five Phase B tracked outputs present (`tools/sync-assets-to-r2.mjs`,
  `tools/sync-assets-to-r2-manifest.json`, `tools/export-artifacts.mjs`,
  `src/data/exhibits/hunter_root.json`, `src/routes/hr/HrExhibitFlow.jsx`).
- Museum working tree contains only Phase A §5.3's documented untracked
  residue (disciplined-edit snapshots and pre-Phase-1 dist dirs).

PASS. Going-in state intact.

### 1.6 — Existing per-exhibit JSON state for audio artifacts

The 15 audio artifacts already appear in `src/data/exhibits/hunter_root.json`
with rich metadata (id, source_url, source_platform, media_type,
title, description, post_date, released_at, tags). Both `primary_url`
and `thumbnail_url` are `null` for all 15. Phase B's manifest-lookup
dispatch in `export-artifacts.mjs` correctly emits null when the audio
artifacts aren't in the sync manifest.

After this work item completes, those nulls become real R2 URLs and the
render layer dispatches to `AudioCard` instead of `PlaceholderCard`.

---

## §2 — Target delivery shape (LOCKED technical decisions)

### 2.1 — Same object store, same bucket: Cloudflare R2 / `weird-baby-assets`

LOCKED. Reasoning: Phase A activated R2 and Phase B proved end-to-end
delivery through `weird-baby-assets` via `assets.weird.baby`. Adding a
second bucket for audio would multiply ops surface without benefit. The
`wbm-asset-sync` token's permission scope (Object R/W on
`weird-baby-assets` only) already authorizes audio uploads.

### 2.2 — Audio URL prefix: `audio/<sha-prefix>/<sha>.mp3`

LOCKED. Parallel to Phase B's `assets/<sha-prefix>/<sha>.<ext>` and
`thumbnails/<sha-prefix>/<sha>.jpg`. Same content-addressed scheme
(per Phase B brief §2.3 — already LOCKED for all R2 content). Audio
thumbnails (if any — see §3.3) stay in the existing `thumbnails/`
prefix.

The trade-off (URLs are opaque) was accepted in Phase B's brief and
that decision propagates here. Audio file titles are stable but
content-addressing remains the right call:
- Idempotency under re-sync
- Dedup if MV ever ingests the same MP3 from two sources
- Consistency with the rest of the R2 layout

### 2.3 — URL persistence: content-addressed by source-file SHA-256

LOCKED. Inherited from Phase B brief §2.3. The audio file's bytes hash
determines its R2 path. Re-running sync against the same file is a no-op.

### 2.4 — Public read via custom domain

LOCKED. Inherited from Phase B. Audio URLs are served from
`https://assets.weird.baby/audio/...` — same TLS-1.2-minimum, same
`Cache-Control: public, max-age=31536000, immutable` as Phase B's
photo deliveries.

### 2.5 — Audio playback: HTML5 `<audio>` element, no canonical PlayerBar coordination

LOCKED (per Path A operator decision 2026-05-22).

The audio artifacts render in `HrExhibitFlow.jsx`'s grid as a new
`AudioCard` component. Each card carries its own play state. Playback
uses the browser's native HTML5 `<audio>` element (visible controls
shape is a §5 question — see §5.2).

The canonical `PlayerBar` in `Exhibit.jsx` is not modified. The
canonical player continues to play YouTube videos from the spine's
tracklist; the AudioCard plays independently. **Concurrent playback
(canonical PlayerBar + AudioCard) is acceptable** — the visitor can
mute one or pause one if they want. The museum does not auto-pause
across components; cross-component playback coordination is Path B
work and explicitly out of scope.

**One-card-at-a-time semantics within HrExhibitFlow** is desirable
(tapping play on card B while card A is playing should pause card A).
This is implementation-internal to HrExhibitFlow — accomplished by
lifting playing-card state to the HrExhibitFlow root component. Does
not require coordination with `Exhibit.jsx`. LOCKED.

### 2.6 — What lives in R2 per audio artifact

For each of the 15 delivery-scope audio artifacts:
- The primary `.mp3` file at `audio/<sha-prefix>/<sha>.mp3`
- A thumbnail at `thumbnails/<sha-prefix>/<sha>.jpg` (shape TBD per §5.1)

Both stored at content-addressed paths. The thumbnail's path hashes the
generated thumbnail bytes, not the source MP3 bytes, so changing the
thumbnail strategy later doesn't invalidate primary URLs.

### 2.7 — What stays in MV

- `local_asset_path` — remains canonical. The R2 copy is delivery, not
  source-of-truth. (Inherited from Phase B brief §2.5.)
- `thumbnail_path` — newly populated for audio iff §5.1 chooses an
  embedded-ID3 or static-file path that produces a local thumbnail.
  Inherited Phase B pattern: the R2 URL is derived in the manifest at
  sync time, not stored in MV.

### 2.8 — Export layer mediates (same as Phase B)

`tools/export-artifacts.mjs` continues to read
`tools/sync-assets-to-r2-manifest.json` and emit `primary_url` and
`thumbnail_url` per artifact in the per-exhibit JSON. No change to
the export script's contract — the manifest just gains 15 new
entries.

LOCKED.

### 2.9 — Tool: `node-id3` or `music-metadata` for ID3v2 extraction (conditional on §5.1)

LOCKED conditionally. If §5.1 selects embedded-album-art-from-ID3 as
the thumbnail strategy, the implementation session adds
`music-metadata` as a dev dependency (npm install). `music-metadata`
is the mature, well-maintained option for cross-format audio tag
reading (handles ID3v1/v2, FLAC, Vorbis, etc.). Falls back cleanly
when no APIC frame is present.

If §5.1 selects album-static or audio-glyph, no new dependency is
needed.

### 2.10 — Image tool for audio thumbnail processing: `sharp` (inherited)

LOCKED. The audio thumbnail (whatever its source — ID3 APIC, album
static, or glyph) gets the same 400×400 q85 JPEG processing as photo
thumbnails per Phase B brief §3.3. Reuses the existing `sharp`
dependency and the `generateThumbnail` function in
`sync-assets-to-r2.mjs` (with an audio-source branch).

---

## §3 — Build-step plumbing (LOCKED unless flagged §5)

### 3.1 — Render-layer audit (PHASEB §7.3 lesson committed)

Per PHASEB_RUN_REPORT §7.3, this brief audits the render layer's
coverage of media_type='mixed' artifacts BEFORE locking the dispatch
decision. Findings:

- `src/routes/hr/HrExhibitFlow.jsx`'s `ArtifactCard` dispatch (lines
  ~640–680) currently has two branches: `isLink` (media_type='link'
  + source_url), `isPhoto` (media_type='photo' + primary_url). Both
  produce a `<a>` element that opens the URL in a new tab. Audio
  artifacts (media_type='mixed') fall through to `PlaceholderCard`.
- `PlaceholderCard` renders a minimal tile showing title + media_type
  label.
- `pickSpan` (the deterministic grid-span hint function) currently
  biases LinkCard and PhotoCard slightly wider (2 columns). AudioCard
  needs a span policy too — see §3.5.

Coverage gap is clear and isolated: add an `isAudio` branch to
`ArtifactCard`. The dispatch logic is mechanical once §5.3 (dispatch
key) is settled.

No other component touches audio rendering. No `hr_dimensions.js`
change needed (it already discovers tag namespaces dynamically — the
`type:audio` tag will surface in pill columns once the manifest
populates and the export refreshes).

### 3.2 — Sync filter widening in `tools/sync-assets-to-r2.mjs`

Current `SCOPE_SQL` in `sync-assets-to-r2.mjs`:

```sql
SELECT id, media_type, storage_mode, local_asset_path
FROM artifacts
WHERE status = 'released'
  AND local_asset_path IS NOT NULL
  AND local_asset_path <> ''
  AND media_type = 'photo'
ORDER BY id
```

Widening to audio depends on §5.3 (`media_type` normalization):

- If `media_type='audio'` normalization is chosen (§5.3 option A):
  filter becomes `media_type IN ('photo', 'audio')`.
- If keying on tags is chosen (§5.3 option B): filter becomes
  `(media_type='photo' OR (media_type='mixed' AND EXISTS (SELECT 1
  FROM json_each(tags) WHERE value = 'type:audio')))`.

Locked once §5.3 settles. Either way, this is a one-line SQL change.

### 3.3 — Thumbnail generation: branch on source file type

`generateThumbnail()` in `sync-assets-to-r2.mjs` currently assumes the
source is a sharp-decodable image. Adding an audio branch:

```js
async function generateThumbnail(sourceBuf, sourceExt, artifactId) {
  if (sourceExt.toLowerCase() === ".mp3") {
    return generateAudioThumbnail(sourceBuf, artifactId);
  }
  // existing photo path
}
```

Where `generateAudioThumbnail` implements the strategy chosen in §5.1.

**Three implementation shapes, one per §5.1 option:**

- **§5.1 option A (ID3 APIC with album-static fallback):** uses
  `music-metadata` to extract APIC frame; if present, pipes those
  bytes through `sharp` per Phase B's 400×400 q85 JPEG path; if
  absent, falls through to the album-static.
- **§5.1 option B (album-static graphic for all 15):** ignores the MP3
  bytes; reads a single committed file (e.g.,
  `tools/audio-thumbnail-rwth.jpg`) and uses it as the thumbnail
  source for every audio artifact. Same SHA across all 15 → same R2
  path → one upload, fifteen manifest references.
- **§5.1 option C (audio glyph generated):** generate a minimal SVG
  → PNG via sharp at sync time (e.g., a static glyph on a colored
  background). Same single-image-fifteen-references pattern as
  option B, just synthesized rather than committed.

All three options produce a 400×400 JPEG q85 output that hashes,
uploads, and indexes the same way as Phase B's photo thumbnails.

### 3.4 — Audio MIME type and Content-Type header

LOCKED. `audio/mpeg` for `.mp3`. Added to the `MIME_BY_EXT` map in
`sync-assets-to-r2.mjs`:

```js
const MIME_BY_EXT = {
  ".heic": "image/heic",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp3": "audio/mpeg",   // ← new
};
```

The existing `r2Put` function uses this map; no other change needed.

### 3.5 — Museum-side render: `AudioCard` component

LOCKED structurally; one §5 question on the in-card affordance shape
(§5.2).

`AudioCard` lives in `HrExhibitFlow.jsx` alongside `LinkCard`,
`PhotoCard`, `PlaceholderCard`. Mirrors `PhotoCard`'s structure
(thumbnail + footer) with an audio play element. Receives the same
`card` prop from `ArtifactCard`. Renders inside an enclosing element
that, unlike PhotoCard's `<a>`, must NOT be a link — audio playback
happens in-place, not via navigation.

```jsx
function AudioCard({ card, isPlaying, onPlayPause }) {
  const visStyle = card.thumbnail_url
    ? { backgroundImage: `url(${card.thumbnail_url})`, ... }
    : null;
  return (
    <>
      <div className="hr-card-audio-vis" style={visStyle ?? undefined}>
        {/* §5.2-determined affordance: native <audio controls> OR custom button */}
      </div>
      <div className="hr-card-foot">
        <div className="hr-card-title">{card.title || "(untitled)"}</div>
        {card.post_date && <div className="hr-card-meta">{card.post_date}</div>}
      </div>
    </>
  );
}
```

`ArtifactCard` dispatch update:

```js
const isAudio = /* §5.3-determined predicate */ && !!card.primary_url;
// ...
if (isAudio) {
  return (
    <div className={className} style={baseStyle}>
      <AudioCard card={card} isPlaying={...} onPlayPause={...} />
    </div>
  );
}
```

`pickSpan` policy for audio: bias slightly wider (2 columns) like
LinkCard and PhotoCard — the thumbnail reads better at wider sizes
and the title + duration metadata fits the wider footer.

### 3.6 — One-card-at-a-time playback coordination

LOCKED. State lifted from individual AudioCards to `HrExhibitFlow`'s
root component (`HrExhibitFlow` default export function). New state
hook:

```js
const [playingAudioId, setPlayingAudioId] = useState(null);
```

Passed down to ArtifactCard → AudioCard. Each AudioCard's
`onPlayPause` callback either calls `setPlayingAudioId(card.id)` (to
start) or `setPlayingAudioId(null)` (to stop). Each AudioCard's
`useEffect` watches `isPlaying` (derived from `playingAudioId ===
card.id`) and starts/stops its `<audio>` element accordingly.

This is internal to HrExhibitFlow. No coordination with `Exhibit.jsx`'s
`useYTPlayer` hook or `PlayerBar`. The canonical player continues to
play YouTube tracks in parallel if the visitor has both running.

### 3.7 — Export script change: zero changes needed

LOCKED. `tools/export-artifacts.mjs` already does the
manifest-lookup-wins dispatch on R2 URLs per Phase B commit
`29dcd40`. When the audio sync populates manifest entries for the 15
audio artifacts, the next export run will emit non-null
`primary_url` and `thumbnail_url` for those artifacts automatically.

No code change to `export-artifacts.mjs` is required by this work
item.

### 3.8 — `hr_dimensions.js` change: zero changes needed

LOCKED. `hr_dimensions.js` already discovers tag namespaces
dynamically from the artifact set. The `type:audio` tag was already
present pre-Phase-B (it's been on the 15 artifacts since their
ingest). Whether it appeared as a pill in HrExhibitFlow before this
work item is a function of (a) which `tier` the vocabulary registry
assigns it (currently null → falls through to tier 3 / Deep Tracks
per the registry-fallback rule) and (b) whether any released
artifacts carry it (yes — these 15 always have).

No change.

---

## §4 — Migration plan

### 4.1 — Pre-migration audit

For the 15 delivery-scope audio artifacts:
- **File-system check:** every `local_asset_path` resolves to an
  existing `.mp3` file.
- **Size check:** total bytes (expected ~79 MiB, ~5.3 MiB average
  per file).
- **Hash each file's bytes (SHA-256):** record in pre-run report.
- **ID3v2 APIC frame inspection** (only if §5.1 option A chosen):
  per-file check for embedded album art presence; track the
  hit/miss rate to validate the option-A-with-fallback strategy.
- **If §5.4 chooses to tag `era:rwth`**: take a pre-write backup of
  `mediavault.sqlite`, apply UPDATE per Phase B's discipline
  (pre-flight verify-count + backup + abort-on-mismatch).
- **If §5.3 chooses MV-side `media_type='audio'` normalization**:
  same discipline; a separate UPDATE.

### 4.2 — First audio sync (one-time)

Run `tools/sync-assets-to-r2.mjs` after widening per §3.2. For each
of the 15 audio artifacts:
1. Read local bytes
2. Compute SHA-256
3. Check R2 for existing object at `audio/<prefix>/<hash>.mp3`
4. If absent: upload with `Content-Type: audio/mpeg` and
   `Cache-Control: public, max-age=31536000, immutable`
5. Generate thumbnail per §5.1 strategy
6. Upload thumbnail to `thumbnails/<prefix>/<thumb-hash>.jpg`
7. Record both URLs in manifest

Per Phase B precedent: first run uses `--dry-run`, then `--limit 1`
for the first artifact + visual verify, then full 15.

### 4.3 — Export refresh

Run `npm run export-artifacts`. Per-exhibit JSON regenerates with
the 15 audio artifacts now carrying real R2 URLs in
`primary_url` and `thumbnail_url`.

### 4.4 — Build and visual verify

`npm run build`. Then `npm run preview` and walk the HR exhibit's
HrExhibitFlow grid to confirm:
- 15 audio cards render (no longer PlaceholderCard)
- Thumbnail visible per §5.1 strategy
- Play affordance per §5.2 selection works
- Click-play on card B while card A is playing pauses card A
- Canonical PlayerBar (if started by clicking a YouTube track in the
  Tracklist above) continues independently — Path A non-coordination
  is the spec, but worth confirming visually that nothing crashes

### 4.5 — Deploy (out of scope)

Per Phase B §8.5, deploy is its own work item.

### 4.6 — Ongoing sync

`sync-assets-to-r2.mjs` re-runnable; idempotent because
content-addressed. If MV gains additional audio artifacts in the
future (e.g., the per-track release-curation flow), the script picks
them up on the next run.

---

## §5 — Operator decisions (NOT locked; implementation blocked on these)

Four calls. Each is UX-impactful and operator-only.

### 5.1 — Audio thumbnail strategy

The 15 audio cards in HrExhibitFlow's grid each need a thumbnail
visual. Three options, each with predictable trade-offs:

**Option A: ID3 APIC with album-static fallback.**
Read the embedded album art from each MP3's ID3v2 APIC frame at
sync time; if present, use it; if absent, fall back to a single
album-static graphic for that artifact. Per-file presence is
unverified — ID3 inspection deferred to implementation session.
- Pro: per-track-specific art if ReverbNation embedded it
- Pro: organic visual variety in the grid
- Con: unknown hit rate until implementation
- Con: even at 100% hit rate, ReverbNation's embedded art may be
  redundant across all 15 (single album → same artwork)
- Engineering: adds `music-metadata` dep; modest complexity

**Option B: Single album-static graphic.**
One committed graphic (e.g., `tools/audio-thumbnail-rwth.jpg`) used
as the thumbnail for all 15 artifacts. Same SHA → uploaded once,
referenced 15 times in the manifest.
- Pro: deterministic, simple, fast
- Pro: visually unifies all RWTH content (which IS one album)
- Con: 15 identical thumbnails in the grid — visually monotonous
- Con: requires the operator to provide a graphic, OR Claude
  generates one (would need a §5-extension decision on the visual)
- Engineering: simplest path; no new dependencies

**Option C: Generated audio glyph (synthesized at sync time).**
At sync time, generate a small SVG → PNG of a static audio-themed
glyph (e.g., a stylized waveform or note symbol on the existing
museum palette) and use it as every audio thumbnail. Functionally
the same as Option B with same-SHA dedup, just synthesized rather
than committed.
- Pro: museum-toned, fits the existing visual language
- Pro: no operator-side graphic-authoring required
- Con: still visually monotonous in the grid (same con as B)
- Engineering: ~30 lines of sharp/SVG code in
  `sync-assets-to-r2.mjs`

**Recommendation: Option A.** Implementation session checks ID3 hit
rate as the first step; if APIC frames are present, they're the most
visually rich answer. If absent (likely scenario: ReverbNation
strips them on download), the fallback is one of Options B or C.
This deferral keeps the §5 decision smaller — the operator chooses
the *fallback* strategy now, and the ID3 path gets used or skipped
mechanically based on what implementation finds.

**Effectively the §5.1 decision is: what's the fallback?**
B (committed graphic, operator-supplied) or C (synthesized glyph,
Claude-generated)?

### 5.2 — In-card play affordance shape

Each `AudioCard` needs a way to start/stop playback. Two options:

**Option A: Native `<audio controls>`.**
Use the browser's built-in audio control bar (play/pause + scrubber
+ volume + time display). HTML5 default. Accessible by default.
- Pro: zero custom UI; works everywhere
- Pro: accessible by default (keyboard, screen reader)
- Pro: scrubbing/seeking comes free (something the canonical
  PlayerBar doesn't have on YouTube per UX_SPEC §C.3.4)
- Con: visually inconsistent with the museum's tight visual
  language — browsers render this bar in their own style; no way
  to theme it deeply
- Con: visually heavy inside a small card

**Option B: Custom-styled play button + minimal progress indicator.**
A single play/pause button mirroring the museum's visual language,
plus a minimal progress strip or elapsed-time readout. The
underlying `<audio>` element is invisible (just exposed via ref).
- Pro: visually consistent with the museum
- Pro: fits inside the card cleanly
- Con: accessibility must be implemented (aria-label,
  keyboard-activation, focus management)
- Con: scrubbing/seeking UI would be more work; could ship without
  it in v1 of AudioCard

**Recommendation: Option B.** Matches the museum's tight visual
posture (per UX_SPEC §H.1's "minimal by design" shell principle).
Accessibility is implementable and table-stakes for any museum
component. Scrubbing can be deferred (matches the canonical
PlayerBar's v1 limitation).

### 5.3 — MV-side `media_type` normalization

The 15 audio artifacts carry `media_type='mixed'`. PHASEB_RUN_REPORT
§7.2 flagged that "mixed" is ambiguous. The dispatch in
`ArtifactCard` needs to identify audio artifacts somehow. Two
options:

**Option A: MV-side normalization to `media_type='audio'`.**
A Phase-B-style MV write (pre-flight verify + backup +
abort-on-mismatch): UPDATE the 15 artifacts to `media_type='audio'`.
Dispatch in `ArtifactCard` keys on `card.media_type === 'audio'`
(clean, single-token check, matches the LinkCard / PhotoCard
pattern).
- Pro: dispatch is consistent with existing branches
- Pro: introduces `audio` as a first-class media_type, which the
  deferred §6.1 v2.1-target normalization work item will eventually
  formalize anyway
- Pro: forward-compatible with Path B (RWTH-as-spine-tile)
- Con: one MV write, with the operational caveat that re-curating
  MV's released set is a curated change
- Engineering: ~5 lines of SQL + Python wrapper per Phase B precedent

**Option B: Dispatch on `type:audio` tag, no MV write.**
The dispatch becomes `card.media_type === 'mixed' &&
card.tags?.type?.includes('audio')`. Slightly more verbose but
correct against the existing data.
- Pro: no MV write; `mixed` ambiguity is acknowledged but not
  resolved this session
- Pro: smaller scope; faster to ship
- Con: dispatch logic is less clean — inconsistent with the
  one-token pattern of isLink and isPhoto
- Con: defers the `mixed` taxonomy question to the §6.1 v2.1-target
  work item; in the meantime, the museum keeps reading "mixed" as
  a polymorphic catch-all

**Recommendation: Option A.** The MV write is small (15 rows, single
column, Phase-B-tested pattern), and introducing `audio` as a
first-class media_type is the direction the v2.1-target normalization
is already heading. Cleaner dispatch is worth one disciplined MV
write.

### 5.4 — `era:rwth` tag addition

UX_SPEC v0.3 §D.2 names `rwth` as the era for Run With The Hunt
content. The 15 audio artifacts have `album:run_with_the_hunt` but
no `era:` tag. UX_SPEC §C.5.0 explicitly defers era-pill UI to the
post-v1 UX_PRESETS_SPEC preplanning session, so there's no v1
visitor consequence of adding or not adding the tag today. Two
options:

**Option A: Add `era:rwth` to all 15 in this work item.**
Same MV-write pattern as Phase B's step 1c (exhibit-tag addition).
- Pro: data layer matches UX_SPEC's vocabulary
- Pro: ready for whenever the era-filter UI lands post-v1
- Pro: one batched MV write captures both this and §5.3's
  normalization
- Con: minor — operator-time curation work, technically out of this
  brief's narrow audio-delivery scope
- Engineering: ~5 lines of SQL + Python wrapper, same backup
  discipline

**Option B: Defer to a future curation pass.**
Tag-only, MV-write-free. No v1 visitor consequence.
- Pro: tighter scope
- Con: future-Claude in a UX_PRESETS_SPEC implementation session
  will discover the gap and need to retag

**Recommendation: Option A**, batched with §5.3's `media_type`
write as a single Phase-0-style MV-side curation step. Both are
small, both use the same discipline, both close PHASEB §7.2's
"mixed is ambiguous" and the "no era tags on RWTH content" gap.

But the operator may reasonably prefer to scope this work item
strictly to audio-delivery and defer era tagging. Either is
defensible.

---

## §6 — Sequencing

### Phase 0 — Operator setup (pre-implementation)
1. §5 decisions all answered
2. If §5.1's fallback is option B (committed graphic): operator
   provides or Claude generates the file at
   `tools/audio-thumbnail-rwth.jpg`
3. No Cloudflare-side work — Phase A's R2 setup remains intact and
   the `wbm-asset-sync` token's scope already authorizes audio
   uploads

### Phase 1 — Implementation (fresh Claude session)
1. **Audit-on-entry** — verify the 15-artifact audio scope still
   holds; verify Phase B exit state is intact; verify the chosen
   §5.1 thumbnail source (ID3 inspection per Option A first step,
   or static file present per Option B, or generation code path
   ready per Option C).
2. **Apply §5.3 and §5.4 MV writes** (if those options chosen):
   take a pre-write backup of `mediavault.sqlite`, apply UPDATEs
   per Phase B discipline (`_cowork/phaseC_step1_*.py` script
   pattern).
3. **Widen `sync-assets-to-r2.mjs`** per §3.2 (filter) and §3.3
   (thumbnail branch).
4. **Add `node-id3` or `music-metadata` dep** (only if §5.1 Option A).
5. **Test sync on `--dry-run`** — validate manifest shape and
   thumbnail strategy works.
6. **Run real sync — first 1 artifact, verify, then full 15.**
7. **Run `npm run export-artifacts`** — regenerate
   `src/data/exhibits/hunter_root.json` with 15 newly-populated
   audio URLs.
8. **Add `AudioCard` to `HrExhibitFlow.jsx`** per §3.5; lift
   playing-audio state per §3.6.
9. **Run `npm run build` + `npm run preview`** — visual verify per
   §4.4.
10. **Commit work in disciplined increments** per Phase B precedent
    (one commit per logical unit: sync-tool widening, MV
    recuration, AudioCard wiring).
11. **Write Phase C run report** at
    `docs/PHASEC_RUN_REPORT-<UTCstamp>.md`.

### Phase 2 — Deploy (out of scope)
Per Phase B §8.5, deploy is its own work item.

---

## §7 — Out of scope

- **Path B: source-agnostic player in `Exhibit.jsx`.** Per Path A
  operator decision 2026-05-22. Means the 15 audio artifacts in
  HrExhibitFlow do NOT play through the canonical `PlayerBar`. They
  play via their own in-card HTML5 `<audio>` elements. The RWTH
  spine tile is NOT added to `hunter-root.js`'s SPINE in this work
  item. Becomes its own scoping brief when prioritized.
- **`HrArchive.jsx` reconciliation** (PHASEB §6.2). Per UX_SPEC
  §D.4, `HrArchive` is dormant for v1. The hand-coded ALBUMS vs
  MV-tagged-album mismatch is real but moot for v1. Recorded in
  §1.4 of this brief; revives only if `HrArchive` is revived
  post-v1.
- **Adding `era:rwth` to non-audio HR artifacts.** If §5.4 chooses
  Option A, only the 15 audio artifacts get the tag in this session.
  Other HR artifacts (the 3 photos, the 1 YouTube link) are
  out-of-scope. A future curation pass handles them.
- **The `mixed` media_type taxonomy normalization** (PHASEB §7.2).
  If §5.3 chooses Option A, this work item moves the 15 audio
  artifacts out of `mixed` into `audio`. Other `mixed` artifacts
  (none currently in MV's released set) remain in `mixed`. The
  full v2.1-target §6.1 normalization (a CHECK constraint on
  media_type, etc.) is a separate work item.
- **The `vocabularyCsvSha` cleanup** (PHASEB §6.3). Still a future
  cleanup pass.
- **Pre-existing `weird-baby build token` revocation** (PHASEB §6.9
  / §8.2). Still pending. Not blocked by this brief; can be done
  any time.
- **CORS policy on `weird-baby-assets`** (PHASEB §6.10). Audio
  delivery via `<audio src>` does not need CORS preflight (same
  category as Phase B's `<img src>` deliveries). Defer remains
  appropriate.
- **Per-track audio variants** (e.g., demo / live / remix versions).
  None currently in MV. If the catalog grows, the AudioCard's
  one-MP3-per-card model holds; multiple variants would each be
  their own released artifact.
- **Audio scrubbing/seeking in AudioCard** (if §5.2 Option B
  chosen). Can ship without it; matches the canonical PlayerBar's
  v1 limitation per UX_SPEC §C.3.4.

---

## §8 — Verification (this brief)

- Audio inventory verified against live MV: 15 artifacts match
  `media_type='mixed' AND status='released' AND
  tags LIKE '%exhibit:hunter_root%'`. Format breakdown: 15× `.mp3`.
- Phase B exit-state preserved: MV HEAD `0a9e953`, Museum HEAD
  `2248990`, HR HEAD `af1486a`, all five Phase B tracked outputs
  present.
- UX_SPEC v0.3 read for the architectural decisions (PlayerBar's
  scope, HrArchive's dormancy, v1.5 framing of source-agnostic
  player).
- `Exhibit.jsx` and `hunter-root.js` read for the spine and player
  architecture; the two-component split (`Exhibit.jsx` + per-artist
  `ExhibitFlow` plugin) is what makes Path A possible without
  touching the canonical player.
- `hr_dimensions.js` read — confirmed that no dimension-discovery
  code change is needed (tags are discovered dynamically).
- `sync-assets-to-r2.mjs` and `export-artifacts.mjs` read — confirmed
  the surface area changes are isolated (one filter widening, one
  thumbnail branch in sync; zero changes in export).
- PHASEB_RUN_REPORT lessons applied: §7.1 (format breakdown in §1.2),
  §7.3 (render-layer audit before locking dispatch in §3.1), §7.6
  (this file > 5KB, presented for file-handoff per operator's
  preference).
- Operator hard-line preserved: AI handles Ops; operator handles
  UX-facing decisions. §5 questions are explicitly operator-only,
  each with a recommendation and a defensible alternative.

---

## §9 — Operator decisions resolved (2026-05-22)

The four §5 questions were resolved by the operator in the same
scoping session that produced this brief. Recorded here so the
implementation session consumes the brief as a single source of
truth without needing to read this chat transcript.

### §9.1 — Audio thumbnail strategy (resolves §5.1)

**DECISION: ID3 APIC art per-track when present, synthesized audio
glyph as fallback.**

The implementation session adds `music-metadata` as a dev dependency
(`npm install --save-dev music-metadata`). The
`generateAudioThumbnail()` function in `sync-assets-to-r2.mjs`
inspects each MP3's ID3v2 APIC frame:

- If APIC bytes are present: pipe them through sharp per Phase B's
  400×400 q85 JPEG pattern.
- If APIC bytes are absent: synthesize an audio glyph (SVG → PNG via
  sharp, ~30 lines) on the museum palette and use it as the
  thumbnail. Same SHA across all glyph-fallback artifacts → uploaded
  once, referenced N times in the manifest.

The exact glyph design is left to the implementation session's
judgment, subject to:
- Museum palette (per `src/styles/museum-tokens.css` — same `--hr-*`
  CSS variables the deck uses).
- Static (no animation).
- Read as "audio artifact" to the visitor (a stylized note, waveform,
  speaker, or similar — implementation Claude's call).
- 400×400 JPEG q85 output (same as Phase B photo thumbnails).

### §9.2 — In-card play affordance shape (resolves §5.2)

**DECISION: Custom-styled play/pause button matching the museum's
visual language. Hidden `<audio>` element behind a ref. Scrubbing
deferred to a future iteration.**

AudioCard renders:
- A play/pause button styled to match the deck's existing buttons
  (consistent with PhotoCard's hover/active states, using
  `HrExhibitFlow.jsx`'s `GOLD` / `INK` / `BORDER` tokens).
- An `<audio ref={audioRef} src={card.primary_url} />` element,
  unstyled, no `controls` attribute.
- The thumbnail (from §9.1) as a background image on the card's
  visual area.
- The button's onClick toggles `isPlaying` (lifted state per §3.6).
- A `useEffect` watching `isPlaying` calls
  `audioRef.current.play()` or `.pause()`.

Accessibility requirements:
- The button has an `aria-label` reading "play" / "pause" per state.
- Keyboard activation (Enter / Space) works via the native `<button>`
  element.
- Focus ring visible (the museum's existing focus style on `<button>`
  elements).

Scrubbing UI is NOT shipped. No scrubber bar, no time display, no
volume slider. The visitor plays or pauses. Same v1 limitation as
the canonical PlayerBar's YouTube control set (per UX_SPEC §C.3.4).

### §9.3 — MV-side `media_type` normalization (resolves §5.3)

**DECISION: UPDATE the 15 audio artifacts to `media_type='audio'`.**

Implementation session, Phase B-style:
- Pre-flight verify-count: confirm 15 artifacts match
  `media_type='mixed' AND status='released' AND tags LIKE
  '%exhibit:hunter_root%' AND tags LIKE '%type:audio%'`.
- Pre-write backup: `core/backups/bak_pre_phaseC_step1_*.sqlite`.
- UPDATE: `media_type='audio'` where the pre-flight predicate
  matches.
- Post-verify: 15 rows changed.
- Abort-on-mismatch.

Dispatch in `ArtifactCard` (HrExhibitFlow.jsx) becomes:
```js
const isAudio = card.media_type === "audio" && !!card.primary_url;
```
Matches the existing one-token-check pattern of `isLink` and
`isPhoto`.

### §9.4 — `era:rwth` tag addition (resolves §5.4)

**DECISION: Add `era:rwth` to all 15 audio artifacts. Batched with
§9.3 as a single MV-side curation step (one backup, one script, two
UPDATEs).**

The batched script (e.g., `_cowork/phaseC_step1_apply_audio_curation.py`):
1. Pre-flight verify-count for both UPDATEs (15 each).
2. Single backup of `mediavault.sqlite`.
3. UPDATE 1: `media_type='audio'` per §9.3.
4. UPDATE 2: append `era:rwth` to `tags` JSON array (using
   `json_insert(tags, '$[#]', 'era:rwth')` per Phase B step 1c's
   precedent).
5. Post-verify each UPDATE separately.
6. Abort-on-mismatch.

Post-update tag shape per artifact:
- `album:run_with_the_hunt`
- `era:rwth` (new)
- `exhibit:hunter_root`
- `people:hunter_root`
- `source:reverbnation`
- `type:audio`
- `type:mp3`

No visitor consequence in v1 (era pills not in v1 visitor surface
per UX_SPEC §C.5.0). Data layer is ready for the future
UX_PRESETS_SPEC implementation session.

---

*End of scoping brief. Implementation green-lit. Path A scope: 15
audio artifacts shipped to HrExhibitFlow as P3 Artifacts with
in-card HTML5 audio playback; no modifications to `Exhibit.jsx`,
`useYTPlayer`, `PlayerBar`, or `hunter-root.js`'s SPINE.*
