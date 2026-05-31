# Universal Card → In-Site Lightbox Expand — Scoping & Feasibility Map

**Date:** 2026-05-31
**Author:** Cowork scoping session (read-only — audit + plan, no build)
**Status:** SCOPING ONLY. No build, no MV write, no deploy. Findings doc for operator review.
**Repo state read:** `src/data/exhibits/hunter_root.json` (`metadata.exported_at = 2026-05-31T00:42:13Z`), `src/routes/hr/HrExhibitFlow.jsx` (~2729 lines, host), prior docs (`RN_ARCHIVED_PAGE_CARDS_RESOLUTION-20260531`, `FB_POST_EMBED_HANDOFF-20260531`, `REVERBNATION_PARITY_SCOPE-20260530`).

---

## 0. The vision, in one line

Clicking **any** artifact card opens a large **in-site** lightbox where the full content is
viewable / playable / readable without leaving weird.baby — applied **uniformly** across every
card type (YouTube, Facebook, Instagram, TikTok, ReverbNation, gallery, album, audio, photo, link).

This doc turns that one line into a concrete, per-platform, honestly-bounded build plan. The
single most important honest finding is stated up front so nothing downstream over-promises:

> **No platform lets you read its comment threads inside an embed.** YouTube, Facebook,
> Instagram, and TikTok embeds all render the *content* (video / photo / post text) but **not**
> the comment thread or live engagement. "Click to expand and read the content in-site" is
> achievable everywhere. "Click to read the comments in-site" is achievable **nowhere**. Every
> card therefore keeps an **"Open on [platform] ↗"** escape hatch as the only path to comments.

---

## 1. The foundation that already exists (what we build on)

The capstone is **not** greenfield. Two in-site overlays already ship, and a third inline embed
path landed today. The new work generalizes the existing overlay mechanism to every card type.

### 1.1 The existing overlay pattern (`HrExhibitFlow.jsx`)

Two full-viewport overlays already implement the exact "large in-site expand" the vision asks for:

- **`GalleryOverlay`** (Phase 3, ~L1285) — photo lightbox. Large active image with prev/next
  arrows, a thumbnail strip, a caption, and three close affordances (✕ button, backdrop click,
  Escape). Arrow keys step photos. Falls back to a titled placeholder when an asset isn't synced.
- **`AlbumOverlay`** (RWTH parity, ~L1402) — audio lightbox. Album cover + ordered numbered
  tracklist, one shared `<audio>` element, sequential playback with auto-advance on `ended`.

Both share an identical **overlay shell contract** worth naming, because it is the reusable core:

| Shell property | Implementation |
|---|---|
| Container | `<div role="dialog" aria-modal="true" aria-label=…>` full-viewport, INK/GOLD/BORDER language |
| Open state | Held at the **HrExhibitFlow root** (`openGallery` / `openAlbum` `useState`), so the overlay layers above the deck + grid and survives grid reflows |
| Close | ✕ button, backdrop click (`onClick={onClose}` on the container; inner stage calls `e.stopPropagation()`), and Escape (`keydown` listener) |
| Scroll lock | `document.body.style.overflow = "hidden"` on mount, restored on unmount |
| Render site | `{openGallery && <GalleryOverlay …/>}` / `{openAlbum && <AlbumOverlay …/>}` at the component root (~L2597 / L2600) |
| Dispatch in | `ArtifactCard` renders the card as a `<button>` whose `onClick` calls `onOpenGallery(card)` / `onOpenAlbum(card)` |

**This shell is the spine of the unified lightbox.** The capstone consolidates these two into one
shell and adds per-type bodies for the remaining card types.

### 1.2 The Facebook inline embed (landed today, 2026-05-31)

`FbEmbedCard` (~L1565) renders FB video/reel/post **inline in the grid tile** (not in a lightbox)
via a `plugins/post.php?href=…` iframe. It self-sizes via a `postMessage` height listener and
letterboxes-to-fit on a per-kind fallback. No app token, no FB JS SDK. It already carries the
**"Open on Facebook ↗"** escape hatch and documents the logged-out / cross-origin caveats in code.
This is the embed-fidelity reference implementation; the capstone's question for FB is **placement**
(keep inline vs. move into the lightbox), not feasibility.

### 1.3 What every other card type does **today** (the gap the capstone closes)

| Card type | Today's behavior | In-site? |
|---|---|---|
| Gallery container | `GalleryOverlay` lightbox | ✅ in-site |
| Album container | `AlbumOverlay` lightbox | ✅ in-site |
| Facebook (all 16) | `FbEmbedCard` inline iframe in the grid | ⚠️ in-site but inline, not a lightbox |
| Standalone audio | `AudioCard` inline play-in-place | ⚠️ in-site but inline |
| YouTube (all 39) | `LinkCard` wrapped in `<a target="_blank">` | ❌ **new tab** |
| ReverbNation page links (5) | `LinkCard` → `<a target="_blank">` | ❌ **new tab** |
| Other link (ticketing, 1) | `LinkCard` → `<a target="_blank">` | ❌ **new tab** |
| Instagram photo (1) | `PhotoCard` → `<a target="_blank">` to hosted image | ❌ **new tab** |

The biggest single win is **YouTube (39 cards, 61% of the deck)** moving from new-tab to an in-site
player.

---

## 2. The data: what source types actually exist

Enumerated from `hunter_root.json` (`source_platform` × `media_type` × `card_kind`). **64 top-level
cards.** (Sandbox note: the FUSE mount serves a 96 KB-truncated copy of this 100 KB+ file; counts
below were recovered by parsing the host-intact file via the Read tool + a boundary-repair parse —
the final RWTH album card sat in the truncated tail and is included manually.)

### 2.1 Top-level card matrix

| source_platform | media_type | card_kind | count | renders as today |
|---|---|---|---:|---|
| youtube | link | — | **39** | LinkCard → new tab |
| facebook | video | — | 10 | FbEmbedCard (inline iframe) |
| facebook | link | — | 4 | FbEmbedCard (the `/posts/` & `/permalink/` URLs match `fbEmbedFor`) |
| facebook | photo | — | 2 | FbEmbedCard (the `/posts/` & `/reel/` URLs match first; PhotoCard not reached) |
| reverbnation | link | — | 5 | LinkCard → new tab |
| other | link | — | 1 | LinkCard → new tab (theticketing.co) |
| instagram | photo | — | 1 | PhotoCard → new tab (self-hosted PNG) |
| (null) | other | gallery | 1 | GalleryOverlay (11 nested photos: 6 `local`, 5 `other`) |
| (null) | other | album | 1 | AlbumOverlay (15 nested `reverbnation`/`audio` mp3 tracks) |

**Key nuance on Facebook:** all 16 FB cards route through `FbEmbedCard` regardless of their
`media_type`, because `ArtifactCard` checks `source_platform === "facebook"` **first** and
`fbEmbedFor` matches `watch?v=` / `/reel/` / `/posts/` / `/permalink/` URLs. So the FB `photo` and
`link` rows above do **not** reach `PhotoCard`/`LinkCard` — they embed. The only true `PhotoCard`
is the single Instagram photo.

### 2.2 TikTok is NOT present as a card type

There are **zero** top-level `source_platform:"tiktok"` cards. TikTok appears only as a cross-post
`source:` **tag** on 2 Facebook clips (`-008`, `-011`) — those render as FB embeds. The "Tiktok (2)"
figure in the FB handoff is that **tag-facet count**, not 2 TikTok cards. **Consequence:** a TikTok
renderer can be *designed* but cannot be *tested against real data* today. Treat TikTok as
forward-compat spec, not a v1 deliverable, and flag it for a live check if/when a TikTok card lands.

### 2.3 ReverbNation reality

The 5 RN cards are archived **page** links (artist pages + song pages). Per
`RN_ARCHIVED_PAGE_CARDS_RESOLUTION-20260531`, all 5 URLs were re-fetched and return **HTTP 200 with
correct content** — ReverbNation is **live** (BandLab-owned), not defunct. The actual RWTH **audio**
is already self-hosted as mp3s on `assets.weird.baby` and plays in-site via the album overlay, so the
RN page-links are **archival provenance links**, not the audio surface.

---

## 3. Per-platform / per-card-type feasibility map

For each type: (1) what renders in-site and at what fidelity; (2) the hard walls / comment ceiling;
(3) logged-out vs. operator view; (4) the fallback.

### 3.1 YouTube — 39 cards (the bulk)

1. **In-site render:** **Full video playback** via an `<iframe>` player (`youtube.com/embed/<id>`,
   or `youtube-nocookie.com/embed/<id>` for reduced initial tracking). Full fidelity: HD, fullscreen,
   captions, scrubbing — the complete player. Sized 16:9, letterboxed in the lightbox stage.
2. **Hard wall — comments:** The embedded player is **player-only**. There is **no parameter, API, or
   supported path to render the YouTube comment thread inside an embed.** Confirmed against YouTube's
   embed docs — comments live only on the watch page. *(You get the video, not the comments.)*
3. **Logged-out vs. operator:** No meaningful difference — public videos play for everyone. (Age-restricted
   or owner-embed-disabled videos refuse to embed; none of HR's 39 appear to be, but a cross-origin
   iframe gives no readable error, so a refused embed shows blank → must keep the escape hatch.)
4. **Fallback:** "Watch on YouTube ↗" (the existing `source_url`). Always present.

**Verdict:** Highest-value, lowest-risk conversion. 39 cards go from new-tab to in-site player with a
standard iframe. No token, no SDK.

### 3.2 Facebook — 16 cards

1. **In-site render:** Already working via `plugins/post.php` — renders the post (text + image collage
   or inline video) self-sized via `postMessage`. Medium-to-high fidelity for **public** content.
2. **Hard wall — comments:** The post plugin shows post text + a **reaction/share count and limited
   engagement chrome**, **not the full comment thread**. Reading comments in-site is **not possible**
   via the social plugin. (The Graph API oEmbed / full comment plugin would need an `app_id` +
   app-access-token — out of scope, no credentials.) *(You get the post, not the thread.)*
3. **Logged-out vs. operator — THE DEMO TRAP:** FB plugins render **public** content, but a
   **logged-out** visitor frequently sees a **login-wall overlay or a degraded/blank frame**, while the
   **operator (logged into FB in the same browser)** sees a richer, fully-rendered embed. **The operator's
   own view systematically over-represents what a public visitor gets.** A cross-origin iframe exposes
   **no load/error signal**, so a blank embed can't be auto-detected. Live-verify must be done in a
   logged-out / incognito window, not the operator's logged-in browser.
4. **Fallback:** "Open on Facebook ↗" — already on every FB card.

**Verdict:** Feasibility proven; the open decision is **placement** (§4.3). The logged-out caveat is the
single biggest honesty risk in the whole capstone — see §6.

### 3.3 Instagram — 1 card

1. **In-site render:** This specific card (`MV-HR-20260405-037`) is a **photo already self-hosted** on
   `assets.weird.baby` (`primary_url` PNG + `thumbnail_url`), with the post caption in `description`.
   So the best in-site experience is **our own hosted image at full resolution + the caption text** —
   **full fidelity, no embed, no token, no third-party dependency.** It behaves exactly like a gallery
   photo we already own.
2. **Hard wall — comments:** Not available. Even the live IG embed (blockquote `embed.js`) shows only
   the post + caption, **never the comment thread**. And Meta **retired the legacy oEmbed in April 2025**
   — the Graph `instagram_oembed` endpoint now requires a reviewed Facebook app + app-access-token. The
   token-free `embed.js` blockquote still works for public posts, but we don't need it here because the
   asset is self-hosted. *(You get the photo + caption, not the comments.)*
3. **Logged-out vs. operator:** None — it's our own asset, identical for everyone.
4. **Fallback:** "Open on Instagram ↗" (`source_url`).

**Verdict:** Trivially full-fidelity in-site *for this card* because it's self-hosted. **Forward-compat
flag:** a *future* IG card **without** a hosted asset would need the `embed.js` blockquote path
(token-free, public only, no comments) — design for it, but it's not exercised by current data.

### 3.4 TikTok — 0 cards (forward-compat only)

1. **In-site render (if a card existed):** TikTok iframe player at `tiktok.com/player/v1/<id>` —
   player-only, `postMessage` control (play/pause/mute), 9:16 portrait. Or the oEmbed blockquote
   (`embed.js`). No token.
2. **Hard wall — comments:** Player-only; **no comments in the embed.**
3. **Logged-out vs. operator:** Public videos play for everyone; private/removed refuse silently.
4. **Fallback:** "Open on TikTok ↗".

**Verdict:** **No current data to render or test.** Spec it in the dispatch table for completeness;
**do not build a renderer with nothing to verify against.** Flag for a live check when a real TikTok
card appears.

### 3.5 ReverbNation — 5 cards

1. **In-site render:** Two honest options:
   - **(a) Recommended — link-out provenance card.** The audio these pages represent is **already
     in-site** (self-hosted RWTH album mp3s). RN pages are archival provenance. A lightbox that shows
     the card's metadata (title, description, post date) + a prominent **"Open on ReverbNation ↗"** is
     the honest, robust choice. *Low fidelity in-frame by design, because the real content is elsewhere
     in-site already.*
   - **(b) Possible but flaky — RN widget embed.** ReverbNation still offers embed widgets + an oEmbed
     endpoint (`reverbnation.com/embed/widgets`, `/developers/oembed`) yielding an HTML5 player widget.
     **BUT** these are archived 2016–2020 pages; whether the widget still resolves for *these specific*
     artist/song IDs is **unverified and must be live-checked** before promising it. RN is also
     JS-heavy and renders differently without scripts.
2. **Hard wall — comments:** N/A (RN has no comment-thread concept like the social platforms).
3. **Logged-out vs. operator:** RN pages are public; widget embeds (if used) render for everyone.
4. **Fallback:** "Open on ReverbNation ↗" — links confirmed **live (HTTP 200)**.

**Verdict:** Default to **(a)**. Only pursue **(b)** if the operator wants an in-frame player AND a live
check confirms the widget resolves for the archived IDs — otherwise it risks an empty/blank widget.

### 3.6 Gallery container — 1 card (already in-site)

Full fidelity already: `GalleryOverlay` shows large images, a thumb strip, captions, keyboard nav, and
self-hosted assets. **No change needed beyond folding it into the unified shell (§4).** Comments: N/A.

### 3.7 Album container — 1 card (already in-site)

Full fidelity already: `AlbumOverlay` plays the 15 self-hosted RWTH tracks with auto-advance. **No
change needed beyond folding into the unified shell.** Comments: N/A.

### 3.8 Standalone audio — 0 standalone top-level cards today

`AudioCard` (inline play-in-place) exists and handles `media_type:"audio"` with `primary_url`. The 15
audio artifacts currently all live **inside** the album container, so there are no standalone audio
tiles in the present export. The renderer exists if one appears; in a unified lightbox it would mirror
the album's single-track player.

### 3.9 Standalone photo — covered by §3.3 (Instagram) + gallery

The only standalone photo is the Instagram one (self-hosted). Any future self-hosted photo lightboxes
identically to a gallery photo (large `FallbackImg` + caption). Full fidelity.

---

## 4. Proposed unified lightbox design

### 4.1 Core: one shell, dispatch by card type

Introduce a single overlay component that owns the shell contract from §1.1 and dispatches its **body**
by card type:

```
LightboxOverlay({ card, onClose })
  └─ LightboxFrame  (role=dialog, aria-modal, backdrop+✕+Escape close, body-scroll lock)
       └─ dispatch on the SAME predicate ladder ArtifactCard already uses:
            youtube link            → <YouTubeStage/>      (iframe nocookie, 16:9 letterbox, teardown on close)
            facebook (any)          → <FbStage/>           (reuse FbEmbedCard's iframe + postMessage sizing)
            instagram / photo       → <PhotoStage/>        (large FallbackImg + caption from description)
            gallery                 → <GalleryStage/>      (current GalleryOverlay body)
            album                   → <AlbumStage/>        (current AlbumOverlay body)
            audio (standalone)      → <AudioStage/>        (single-track player + art)
            reverbnation / other    → <LinkStage/>         (metadata + big "Open on [platform] ↗")
            tiktok (future)         → <TikTokStage/>       (player/v1 iframe, 9:16) — spec only, no data
            else                    → <LinkStage/>         (graceful default)
```

Consolidate the root state: replace the two separate `openGallery` / `openAlbum` `useState`s with one
`openCard`, and make **every** `ArtifactCard` a `<button>` that calls `onOpenCard(card)` (the gallery/
album buttons already do this; extend to the rest). The single render site becomes
`{openCard && <LightboxOverlay card={openCard} onClose={() => setOpenCard(null)} />}`.

### 4.2 Sizing / stage

The stage letterboxes per aspect, exactly as `FbEmbedCard` already does: 16:9 (YouTube), 9:16
(reels/TikTok), self-sized (FB post), native (photo). One `.hr-lightbox-stage` with per-type aspect,
centered, max-width/height clamped to the viewport with margin. Reuse the existing INK/GOLD language.

### 4.3 The one real design decision: Facebook placement

FB currently embeds **inline in the grid**. Two coherent options — operator picks:

- **Option A — uniform lightbox:** FB cards become click-to-open like everything else; the grid tile
  shows a thumbnail/title (lighter grid, consistent interaction). Most faithful to "click any card to
  expand." Requires the FB tile to render a static preview instead of a live inline iframe.
- **Option B — hybrid:** keep FB inline (it already self-sizes) **and** also allow expand-to-lightbox.
  Less consistent, but preserves today's working inline behavior with zero regression risk.

**Recommendation:** Option A for interaction uniformity, *if* a clean static FB preview is acceptable
(FB doesn't give a guaranteed thumbnail for all post types — may fall back to a titled placeholder). If
the operator values the live inline preview, Option B is the safe path. **This is the main thing to
decide before Brief 3.**

### 4.4 Classification: front-end only

**Every card type above renders from fields the export already carries** — `source_platform`,
`media_type`, `source_url`, `primary_url`, `thumbnail_url`, `description`, `card_kind`, `tracks[]`,
`gallery[]`. **No MV write, no export schema change, no deploy-pipeline change is required for v1.**

- **YouTube:** the video id is parseable from `source_url` (`watch?v=<id>`) — no new field.
- **Facebook:** `FbEmbedCard` already reads `media_width`/`embed_width` tolerantly (returns null today).
- **Instagram/photo:** self-hosted `primary_url` + `description` caption — already present.

**Optional, NOT required — later export enhancement:** emitting intrinsic embed dimensions
(`embed_width`/`embed_height`) for FB/TikTok would let the stage size exactly instead of letterboxing.
`fbEmbedDims` is already wired to consume them. This is a *nice-to-have* that **does** touch MV/export,
so it is explicitly out of v1 front-end scope and flagged separately.

### 4.5 Player teardown discipline (correctness, not cosmetics)

Video/audio iframes keep playing audio if merely hidden. The lightbox **must unmount the player iframe
on close** (the `{openCard && …}` conditional already guarantees this) and mount **one stage at a time**.
The album/audio "one-at-a-time" logic is the model; extend the same teardown to the YouTube/FB/TikTok
iframes. Escape / backdrop / ✕ / navigating to another card must each fully tear down the prior player.

---

## 5. Sizing, sequencing, classification (build briefs)

Each brief is independently shippable and front-end only. Suggested order = value × safety.

| # | Brief | Cards moved in-site | Size | Risk | Class |
|---|---|---|---|---|---|
| 1 | **Lightbox shell consolidation** — merge `openGallery`/`openAlbum` → one `openCard` + `LightboxFrame`; migrate gallery + album bodies unchanged | 0 (refactor) | M | Low (pure refactor; visual parity) | FE only |
| 2 | **YouTube in-lightbox player** — `YouTubeStage` iframe (nocookie), 16:9, teardown; replace LinkCard new-tab for YT | **39** | S–M | Low | FE only |
| 3 | **Facebook placement** — move `FbEmbedCard` into `FbStage` (Option A) or add expand (Option B); surface logged-out caveat | 16 | M | Med (FB render variance; needs logged-out live-verify) | FE only |
| 4 | **Photo / Instagram lightbox** — `PhotoStage` (self-hosted image + caption); replace new-tab | 1 (+ future) | S | Low | FE only |
| 5 | **Link fallback lightbox** — `LinkStage` for ReverbNation + other (metadata + "Open ↗"); or keep direct new-tab — operator call | 5 + 1 | S | Low | FE only |
| 6 | **TikTok stage (deferred)** — spec `player/v1` iframe; **blocked on real TikTok data** | 0 | S | n/a (no data) | FE only |
| — | *(optional, separate)* **Export embed dimensions** — emit `embed_width/height` for exact FB/TikTok sizing | — | M | Med | **MV + export** (out of v1) |

Briefs 1+2 alone deliver the headline outcome (the 39 YouTube cards + a unified shell). 3–5 complete the
"uniform across all card types" promise. 6 and the export enhancement are explicitly deferred.

---

## 6. Biggest risks & the honest "you get X, not Y"

1. **Comments are unreachable in-site on every platform.** This is the headline honesty item. If the
   operator's mental model is "expand the card and read the comments without leaving," that is **not
   deliverable on YouTube, Facebook, Instagram, or TikTok.** You get the *content*; comments require the
   "Open on [platform] ↗" hop. Design the UI so the escape hatch reads as "comments & more live here,"
   not as a failure state.

2. **Facebook logged-out ≠ operator's view.** The operator, logged into FB, will see richer embeds than a
   public visitor, who may hit a login wall or blank frame. **Every FB live-verify must use a logged-out /
   incognito window.** Risk: a demo that looks great on the operator's machine and broken to the public.

3. **Cross-origin iframes give no success/failure signal.** A blank YouTube/FB/TikTok embed (refused,
   removed, private, login-walled) cannot be auto-detected. **Mitigation:** the "Open on [platform] ↗"
   escape hatch is mandatory on *every* stage, always visible — never gated on detecting a failure.

4. **ReverbNation widget is unverified for archived IDs.** If the operator wants an in-frame RN player
   (Option b, §3.5), it must be live-checked for the 2016–2020 artist/song IDs before promising it;
   otherwise it risks an empty widget. The safe default is the link-out card — and the real audio is
   already in-site via the album anyway.

5. **TikTok has no data.** Building a TikTok renderer now means shipping untested code. Defer until a real
   card exists.

6. **Instagram oEmbed token wall (future-only).** Today's single IG card is self-hosted, so unaffected. But
   *future* IG cards without a hosted asset can only use the token-free `embed.js` blockquote (public
   posts, no comments) — the Graph `instagram_oembed` API needs a Meta app token we don't have.

7. **Facebook placement regression risk (Brief 3).** Moving FB from inline to lightbox (Option A) trades
   today's working live inline preview for a static tile preview that FB may not always supply. Option B
   avoids the regression at the cost of interaction uniformity.

### The one-paragraph honest summary for the operator

> You will get: **in-site video playback** (YouTube ×39, Facebook ×16, TikTok later), **in-site photo
> viewing** (gallery, Instagram, FB photos), **in-site audio** (album + the self-hosted RWTH tracks), and
> **post text inline** — all without leaving weird.baby, in one consistent lightbox. You will **not** get:
> **comment threads in-site** on any platform (always a click-out), **logged-out parity** with your own
> logged-in Facebook view, or a **guaranteed ReverbNation in-frame player** for the old archived pages.
> The build is **front-end only** — no MediaVault write, no export change, no risk to the data — except an
> optional, separate later enhancement to emit embed dimensions for tighter sizing.

---

## 7. What still needs a live check (don't promise without testing)

- **FB embeds in a logged-out/incognito browser** — confirm what a public visitor actually sees per kind
  (video / reel / post) vs. the operator's logged-in view. *(Cross-origin → not auto-detectable.)*
- **YouTube embed refusals** — confirm none of the 39 HR videos are owner-embed-disabled or age-gated
  (they appear not to be, but an iframe can't report it).
- **ReverbNation widget resolution** for the 5 archived artist/song IDs — only if Option (b) is pursued.
- **TikTok** — no card exists; re-scope when one lands.
- **Instagram `embed.js` blockquote** — only relevant for a *future* non-self-hosted IG card.

---

## 8. Hard stops honored

No build, no MV write, no deploy, no commit were performed in producing this document. It is a read-only
audit + plan. The findings doc is delivered to `docs/` for host-side commit by the operator. All platform
capability claims are sourced from the existing code + the platforms' embed documentation; every claim that
could not be verified without a live test is explicitly flagged in §7.
