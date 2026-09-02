# Run report — FB embed sizing + YT thumbnail fallback

**Session:** 2026-05-31 (cowork)
**Builds on:** `9ed7cc2` (feat(hr): embed Facebook artifacts inline as social-plugin cards)
**Branch:** main
**Files touched (front-end only):**
- `src/routes/hr/HrExhibitFlow.css`
- `src/routes/hr/HrExhibitFlow.jsx`

No data / export / MV change. No routing-file change beyond the deck component itself.

---

## Part A — FB embed sizing (the main work)

### Diagnosis (measured live on weird.baby/hr, old code 9ed7cc2)
A raw FB social plugin lays its content out at a **fixed pixel width** — the
`&width=` param, hard-coded to `500` in `fbPluginSrc`. The iframe *element*,
however, is the grid column:

| kind  | span  | vis box (measured) | FB content width | symptom |
|-------|-------|--------------------|------------------|---------|
| video | 2-col | 572 × 322          | 500              | ~72px white margin right + bottom letterbox |
| reel  | 1-col | 278 × 494          | 500              | ~222px clipped off the right edge |
| post  | 1-col | 278 × 348          | 500              | ~222px clipped off the right edge |

A `width:100%`/`height:100%` iframe only shows a 278/572-px window onto 500px-wide
FB content. With no FB JS SDK there is no fluid-width mode, and the cross-origin
frame exposes no size to read — so pure `aspect-ratio` boxing cannot fix it. This
is exactly the reported "cards overflow/letterbox, masonry is ragged."

### Fix — scale-to-fit
Lay the iframe out at FB's exact native size (`500 × per-kind height`) and
uniformly `transform: scale()` it to fill the tile. `--fb-w` is the tile's live
pixel width, set by a `ResizeObserver` (`useElementWidth`) on the vis in
`FbEmbedCard`; `scale = --fb-w / 500` maps the 500px FB canvas onto the column
width exactly. Per-kind pre-scale heights (`500 × inverse aspect`:
video 281, reel 889, post 625) make the scaled frame fill the aspect box with no
letterbox. The `aspect-ratio` on the vis still defines the masonry tile shape,
mirroring the gallery/album 4/5 tiles.

### Verification (simulated on live grid before deploy)
Injected the new CSS + `--fb-w` onto the live (old-code) cards and measured the
scaled frame vs the vis box:

| kind  | vis box | scaled frame | fills W | fills H |
|-------|---------|--------------|---------|---------|
| video | 573×322 | 573×322      | ✓       | ✓       |
| post  | 279×348 | 279×349      | ✓       | ✓       |
| reel  | 279×495 | 279×496      | ✓       | ✓       |

No horizontal clip, no letterbox, at both column spans.

---

## Part B — thumbnail-less YouTube cards

### Diagnosis: render bug, NOT data
Reported: `Fa5GKxEgf7c` and `uaFHDfuohxc` show no thumbnail. Both videos are
**live and public** — YouTube oEmbed returns full metadata, embed HTML, and a
valid `hqdefault.jpg` (480×360) for each. Not deleted / private / region-blocked.

Root cause: the MV export hard-codes `i.ytimg.com/vi/<id>/maxresdefault.jpg`.
YouTube only generates a maxres render for uploads at ≥720p; these lack one.
**A missing resolution does not 404** — YouTube serves a 120×90 gray placeholder
with HTTP 200, so an `onload`/`onerror` probe can't detect it. Detection must
inspect the decoded width (real maxres = 1280×720; sentinel = 120×90).

### Regression sweep — it was 4, not 2
Probed all 39 YouTube `maxresdefault` thumbnails in the released set:
- **35** have a real maxres render (untouched by the fix).
- **4** are 120×90 placeholders: `uaFHDfuohxc`, `Fa5GKxEgf7c` (reported) **plus
  `KMJVLWr34Rc` ("Don't Blame the Breeze") and `XdiGZUWlU0Y` ("Sleight of Hand")**
  — not reported but the same root cause; both confirmed live/public via oEmbed.

### Fix — render-path fallback (front-end, general)
`useResolvedThumb(url)` in the card path: when a `…/maxresdefault.jpg` URL decodes
at ≤320px wide (or errors), swap to `…/hqdefault.jpg`. Applied in `LinkCard`
(where YouTube cards render). Non-ytimg and already-hqdefault URLs pass through
untouched. Fixes all 4 maxres-less cards, regresses none of the 35. Robust for
any future maxres-less video, independent of the upstream export.

> Upstream note (not actioned, MV-side / out of scope): the YT ingest stores the
> `maxresdefault` URL. The render fallback makes the museum resilient regardless;
> a future MV-side fix could store `hqdefault` when maxres is absent.

---

## Out of scope / left as-is
- The one FB card showing "Unavailable — content owned by someone else" is
  Facebook refusing to embed that video on their end. Not fixable in code; the
  "Open on Facebook ↗" fallback link is correct. Left untouched.

## Lint
Source baseline unchanged: host `npm run lint` = **4 errors / 6 warnings**
(documented pre-existing debt). Sandbox `eslint .` = 5 err / 5 warn (the extra
error is the FUSE phantom parse in `HrExhibitFlow.jsx`, now at line ~2560 as the
file grew; host file intact to 2621 lines). **Zero new lint problems introduced.**

## Pending (host-side — sandbox can't build/deploy/commit)
build → deploy → live-verify on weird.baby/hr → commit (explicit paths) + push.
See the host runbook handed to the operator.
