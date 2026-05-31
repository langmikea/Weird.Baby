# Run report — FB embed fit refinement + Facebook filter facet

**Session:** 2026-05-31 (cowork)
**Builds on:** `651643e` (fix(hr): scale-fit FB embeds; maxres->hq YT thumbnail fallback)
**Branch:** main
**Files touched (front-end only):**
- `src/routes/hr/HrExhibitFlow.jsx`
- `src/routes/hr/HrExhibitFlow.css` (comment-only)

No data / export / MV change. No routing-file change beyond the deck component itself.

---

## Part B — Facebook filter facet (the shippable win)

### Diagnosis (confirmed live on weird.baby/hr, FORMATS tab)
Every pill column is discovered from artifact `tags` namespaces (`buildDimensions`
in `hr_dimensions.js`); `matchFilter` filters on `item.tags[ns]`. YouTube is
filterable because its artifacts carry `source:["youtube"]`, surfacing a
"Youtube" pill in the tier-2 **Source** column (Formats tab). The 16
`source_platform:"facebook"` artifacts carry **no** `source` tag (only
`bands`/`exhibit`/`unsorted`), so no Facebook pill existed. Verified live: the
Source column listed Distrokid / Instagram / Reverbnation / Tiktok / Youtube —
**no Facebook**.

### Fix — synthesize `source:["facebook"]` from `source_platform`
At load (`HrExhibitFlow.jsx`, the `ARTIFACTS` map over `RAW_ARTIFACTS`), **append**
`"facebook"` to the `source` tag of every `source_platform === "facebook"`
artifact, so all 16 join the **same** Source column as one new "Facebook" pill —
consistent with the existing facet pattern, no new column. Front-end only; the
JSON stays MV-authoritative (the derivation never writes back). Idempotent;
shallow-clones to avoid mutating the imported JSON.

**Append, not replace — the non-obvious bit:** 13 of the 16 carry no `source`
tag, but **3 cross-posted clips already do** — `MV-HR-20260405-008` and `-011`
carry `["distrokid","tiktok"]`, `-014` carries `["instagram"]` (their content
origin). Appending preserves those values (their existing pills stay intact)
while still surfacing all 16 under Facebook — the `source` namespace is
multi-value, so a card can sit under several source pills. A replace would have
either clobbered those pills or left the Facebook pill at 13.

### Verification (unit test, sandbox node — all pass)
Replicated synthesis + `buildDimensions` value-union + `matchFilter` against a
dataset mirroring the real tag shapes (incl. the 3 cross-posted clips):

| Assertion | Result |
|---|---|
| Facebook pill count | **16** ✓ |
| Facebook pill = exactly the source_platform==facebook set | ✓ |
| distrokid / tiktok / instagram pills unchanged (2 / 2 / 1) | ✓ |
| youtube (39) / reverbnation (5) unchanged | ✓ |
| cross-posted clip `008` source = `["distrokid","tiktok","facebook"]` | ✓ |
| source value union gains only `facebook` | ✓ |
| `bands` / `unsorted` namespaces unchanged | ✓ |
| imported JSON not mutated; idempotent on re-run | ✓ |

Real-data scan confirmed: 16 FB artifacts (10 video / 2 reel / 4 post by URL
kind), 3 already carrying a non-facebook `source` tag, 0 already carrying
`facebook`.

---

## Part A — FB embed fit (per-video sizing groundwork; proper fix deferred)

### Diagnosis
The `651643e` scale-to-fit **geometry is correct** — confirmed live: with the
`--fb-w` width variable applied (the ResizeObserver sets it for real visitors),
the scaled frame fills its tile box exactly (video 572×322, post 278×348, reel
278×495). The remaining "crop at top / ragged heights" is a **per-kind height**
problem: FB content height at width=500 is **cross-origin (unreadable by script)**
and **varies by orientation**. The "video" bucket mixes landscape music clips and
portrait TikTok/reel-style clips; a single fixed per-kind aspect box must either
**crop** portrait clips (16:9 box too short) or **letterbox** landscape clips
(tall box). Avoiding both is impossible front-end-only without per-embed
dimensions.

### Measurement was blocked (environmental)
FB content could not be measured in the automated browser: embeds render **blank**
(logged-out + cross-origin + the automation tab is `document.hidden`, which
throttles ResizeObserver/rAF and FB iframe paint), FB exposes no `postMessage`
size without the JS SDK (absent by design), and a metadata WebFetch of the FB
watch page times out. A 500×700 probe iframe injected on the live page rendered
pure white. This is the same degradation the code comments already document.

### Operator decision (2026-05-31)
Asked the operator how to handle the mixed-orientation tradeoff. Decision:
**per-video sizing — defer the proper fix** (add FB video dimensions to the
export later; out of current front-end scope), **ship both parts in one commit
with a best-effort Part A.**

### Fix shipped — the front-end half of per-video sizing
`FbEmbedCard` now reads an embed's intrinsic pixel dimensions from the artifact
record via `fbEmbedDims(card)` (tolerant of `media_width`/`media_height` or
`embed_width`/`embed_height`, string or numeric). When present it sizes **that
card** exactly: vis `aspect-ratio = w/h` and frame pre-scale `height = 500 × h/w`
(width is fixed at 500 in `fbPluginSrc`), so the scaled frame fills the box with
**no crop and no letterbox** — per video, not per kind.

The export emits **no** such fields today, so `fbEmbedDims` returns `null` for
every current artifact and each card falls through to the existing per-kind
`.hr-card-fbembed[data-fbkind]` CSS box — **byte-for-byte the prior behavior, no
regression, no visible change yet.** When MV/export later carries FB video
dimensions, each embed corrects automatically with **no further front-end
change.** CSS change is a documentation note only (per-kind rules unchanged).

### Deferred (the other half, for a future session)
Have the MV→museum export emit per-embed `media_width`/`media_height` (e.g. from
FB `og:video:width`/`og:video:height` at capture/ingest time). Once present, the
front-end shipped here renders per-video aspect with no crop/gap. Posts remain
text-variable (no intrinsic media aspect); a post-specific strategy can follow.

---

## Regression analysis (by construction)
- **CSS:** edit is inside the sizing comment block only — rules byte-identical →
  zero functional/visual CSS change.
- **JSX:** changes are confined to (a) the `ARTIFACTS` synthesis, which only adds
  a `source` value to `source_platform==="facebook"` artifacts, and (b)
  `FbEmbedCard` / `fbEmbedDims`, rendered only for FB embeds. Gallery, album,
  coverflow, audio, photo and YouTube (LinkCard) render paths are untouched.
- **Today's render:** `fbEmbedDims` returns null for all current data → FB embeds
  render exactly as on `651643e`.

## Out of scope / left as-is
- The "Unavailable — content owned by someone else" FB card (FB-side embed
  block; the "Open on Facebook ↗" fallback is correct). Untouched.
- The guestbook display bug (separate).

## Lint / build (host-side — sandbox can't)
Sandbox cannot validate `HrExhibitFlow.jsx`: the FUSE mount truncates the
sandbox view (~2529 lines) while the host file is intact (**2705 lines**, clean
component closure, verified via the host Read tool). eslint on the sandbox view
chokes at the truncation (the documented phantom parse). No new lint constructs
were introduced (no new unused vars; `RAW_ARTIFACTS`, `fbEmbedDims`, `dims`,
`visStyle`, `frameStyle` all consumed). Expect host `npm run lint` to hold the
documented baseline **4 errors / 6 warnings**. Build (`vite`+`rolldown`+workerd)
is host-only.

## Pending (host-side — sandbox can't build/deploy/commit)
build → deploy → live-verify on weird.baby/hr → commit (explicit paths) + push.
See the host runbook handed to the operator. Live-verify focus: Source column
shows a **Facebook** pill = **16**, selecting it shows exactly the 16 FB cards,
other Source pills (Youtube 39, Reverbnation, Tiktok 2, etc.) unchanged; FB
embeds render as before (no visual change expected from Part A today).
