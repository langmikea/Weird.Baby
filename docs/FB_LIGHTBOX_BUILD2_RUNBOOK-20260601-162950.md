# Facebook In-Site Lightbox — Build 2 of 6 — Runbook & Run Report

**Date:** 2026-06-01
**Session:** Cowork (sandbox edits only — build / deploy / commit / push run host-side per CLAUDE.md §2, §9)
**Plan:** `docs/UNIVERSAL_LIGHTBOX_EXPAND_SCOPING-20260531-204334.md` — this is the Facebook piece (Brief 3 in that doc's table; "build 2" in the kickoff). Build 1 (YouTube) shipped in `4335242` and is the pattern this mirrors.
**Scope held:** Facebook only. No YouTube / ReverbNation / gallery / album / Instagram / RN behavior touched. Front-end only — no MV write, no export change, no deploy-pipeline change. The grid card is left as-is (the click-to-expand is additive).

---

## 1. What changed

Each Facebook artifact card now exposes an **in-site expand** affordance (the foot title becomes a button with a `⤢` glyph). Clicking it opens the **existing in-site lightbox shell** with a **large, readable** `plugins/post.php` embed of the same post/video — instead of only being viewable as the compact inline tile. The shell's close / scroll-lock / keyboard behavior is reused verbatim from `YouTubeOverlay` / `GalleryOverlay` / `AlbumOverlay`.

**The grid tile is unchanged** — it stays the compact inline `post.php` embed that landed yesterday (`fd44298`/`9ed7cc2`), fully interactive. The lightbox is purely **additive** (scoping doc §4.3 **Option B — hybrid**: keep FB inline *and* allow expand-to-lightbox; zero regression to inline playback).

**The "Open on Facebook ↗" escape hatch is kept** — in the inline tile foot (as before) *and* in the overlay caption. It is the only path to comments (the post plugin renders the post text + media but **not** the comment thread — scoping doc §3.2 / §6.1).

### Files (2)

| File | Change |
|---|---|
| `src/routes/hr/HrExhibitFlow.jsx` | New `FacebookOverlay` component (mirrors `YouTubeOverlay` shell + reuses `fbEmbedFor` / `fbPluginSrc` / `useElementWidth` / the `postMessage` height listener from `FbEmbedCard`); `FbEmbedCard` foot title becomes an `onOpenFacebook` expand `<button>` (falls back to a plain title when no opener); `onOpenFacebook` threaded `HrExhibitFlow root → P3Panel → ArtifactCard → FbEmbedCard`; root `openFacebook` state + render site. |
| `src/routes/hr/HrExhibitFlow.css` | New `.hr-fb-ov*` rules mirroring `.hr-yt-ov` (full-viewport INK backdrop, ✕ close, large centered stage with a vertical scroll region for tall posts, caption + escape-hatch link) + `.hr-card-fb-expand*` for the foot expand button. |

### Mechanism notes

- **Shell reuse, not a new pattern.** `FacebookOverlay` copies the `YouTubeOverlay` shell contract: `role="dialog" aria-modal`, ✕ button, backdrop `onClick={onClose}` with inner-stage `stopPropagation`, `Escape` keydown listener, and `document.body.style.overflow = "hidden"` scroll-lock restored on unmount. Open state is held at the `HrExhibitFlow` root (`openFacebook`), so it layers above the deck/grid and survives grid reflows — same as `openGallery` / `openAlbum` / `openYouTube`.
- **Embed reuse.** The overlay renders the **same** `plugins/post.php` mechanism `FbEmbedCard` already uses (no app token, no FB JS SDK): `fbEmbedFor(source_url)` → `fbPluginSrc("post.php", href, true, reqW)`, with the **identical origin-checked `postMessage` height listener** so the frame grows to the full post height.
- **Large, readable sizing.** The overlay requests `post.php` at the **stage width** clamped to FB's 350–750 plugin range (10px-quantized for a stable src), centered, with a per-kind tall fallback height (`FB_FALLBACK_H`) until FB reports. A `.hr-fb-ov-scroll` region (`overflow-y:auto`, `max-height:80vh`) lets a tall post/video scroll fully in-site without cropping. The scoping doc confirmed FB posts render cleanly at larger sizes.
- **Player teardown.** The `{openFacebook && <FacebookOverlay/>}` conditional unmounts the iframe on every close path (✕ / backdrop / Escape), so a playing FB video's audio stops — scoping doc §4.5. One overlay open at a time (root state is a single card).
- **Why a foot control, not a whole-tile click.** Unlike a YouTube tile (a static `LinkCard` thumbnail), the FB tile is a **live cross-origin iframe** that captures its own clicks — a whole-tile click handler can't reliably fire over it and would fight inline playback. A dedicated foot expand button keeps the inline embed fully interactive with zero regression while giving a clear in-site expand path.
- **Scope discipline.** Only the FB path changed. `onOpenFacebook` is threaded alongside the existing `onOpenYouTube` / `onOpenGallery` / `onOpenAlbum` props; all other dispatch branches are byte-for-byte unchanged. A non-FB card never reaches `FacebookOverlay`.

---

## 2. Sandbox verification done

- **Edits verified host-direct (Read tool).** All edit sites confirmed present and well-formed; file integrity intact. `HrExhibitFlow.jsx` = **2990 lines** (was 2845; +145 matches the additions), clean EOF (`</section>` → `);` → `}`). `HrExhibitFlow.css` block balanced and transitions cleanly into `.hr-album-ov`. `--hr-gold` / `--hr-gold-hi` / `--hr-gold-lo` / `--hr-border` all confirmed defined in `museum-tokens.css` (reused by the YT block).
- **FB embed-resolution check (Node, against the git-HEAD-intact export):** `fbEmbedFor` resolves a valid `post.php` embed for **all 16** live Facebook cards — **10 video / 4 post / 2 reel** — and `fbPluginSrc("post.php", href, true, 750)` produces a well-formed src for every one (0 failures). Counts match the scoping doc §2.1 matrix (16 FB cards; 64 total; 39 YouTube; 5 ReverbNation), confirming no card-set drift.
- **Lint NOT run in sandbox — by design.** The FUSE view of `HrExhibitFlow.jsx` is truncated (bash sees ~2716 of 2990 lines), so a sandbox `eslint` / `node --check` hits the documented phantom parse error (CLAUDE.md cowork-sandbox quirk + §9). All edits were therefore made via the host-direct Read/Write/Edit tools (not bash read-modify-write, which would clip the tail) and verified via the Read tool. Authoritative lint runs host-side — step 4.
- **Build NOT run in sandbox** — workerd-blocked (CLAUDE.md §9). Runs host-side — step 3.

---

## 3. Build + deploy (host PowerShell)

This is a **front-end-only** change. There is **no MV data change**, so `npm run export-artifacts` is **NOT** needed (skip step 2 of the release flow — it does not apply here).

```powershell
cd C:\AI\Projects\weird-baby-museum
npm run lint     # expect baseline: 4 errors / 6 warnings (see step 4)
npm run build    # Vite + rolldown + Cloudflare plugin — must pass
npm run deploy   # vite build && wrangler deploy -> weird.baby
```

---

## 4. Lint check (host PowerShell)

`npm run lint` must be at the documented baseline — **4 errors / 6 warnings**, all pre-existing (`WbAdmin.jsx:18`; `Exhibit.jsx:88/191/517`; `HrExhibitFlow.jsx` 1 warning). A higher count means this change introduced something. (The sandbox 5/5 figure is the phantom-truncation artifact and does not apply on Windows.)

---

## 5. Live-verify checklist (operator) — weird.baby/hr — **INCOGNITO**

**Do this in a logged-out / incognito window, not your normal browser.** FB plugins render public content differently for a logged-out visitor than for your logged-in view — your logged-in browser systematically over-represents what a real visitor sees (scoping doc §3.2 / §6.2). A cross-origin iframe gives no load/error signal, so a blank/login-walled embed can't be auto-detected — that is exactly why the "Open on Facebook ↗" escape hatch is always present.

1. **Opens in-site:** click a Facebook card's title (the `⤢` expand control) → the in-site lightbox opens (no new tab) with a **large, readable** post/video — bigger than the grid tile.
2. **Video plays in the overlay**, and for a tall post the content **scrolls inside** the overlay (not cropped).
3. **Close works — all three:** ✕ button, backdrop click (outside the stage), and `Escape`. After each, the overlay is gone and **any playing FB video's audio has stopped** (teardown).
4. **Escape hatch:** the **"Open on Facebook ↗"** link in the overlay caption (and in the grid tile foot) opens the post on Facebook in a new tab (for comments).
5. **No regressions:**
   - The FB grid tiles still render the **compact inline embed** as before (unchanged), still interactive.
   - **YouTube cards still open the YouTube lightbox** (build 1) — unchanged.
   - Gallery and Album cards still open their own overlays.
   - ReverbNation (5) and the "other" ticketing link still open in a new tab.
   - The Instagram photo card unchanged.
   - The **Facebook filter facet** still filters correctly.
6. **Lint at baseline** (step 4): 4 errors / 6 warnings, no new entries.

If any FB embed shows blank/login-walled in incognito, that is the platform's logged-out behavior (scoping doc §3.2) — the escape hatch is the intended fallback, not a build bug.

---

## 6. Commit + push (host PowerShell)

Recovery prelude (always-safe per CLAUDE.md §2):

```powershell
cd C:\AI\Projects\weird-baby-museum
if (Test-Path .git\index.lock) { Remove-Item .git\index.lock }
git reset --mixed HEAD
git checkout -b facebook-in-site-lightbox-build2
git add src/routes/hr/HrExhibitFlow.jsx src/routes/hr/HrExhibitFlow.css docs/FB_LIGHTBOX_BUILD2_RUNBOOK-20260601-162950.md
git commit -m "feat(hr): Facebook cards expand in-site via lightbox overlay"
```

Suggested commit body:

```
Facebook artifact cards were only viewable as the compact inline post.php
embed in the grid. Each FB card now also exposes an in-site expand control
(the foot title + a glyph) that opens the existing in-site lightbox shell
(YouTube/Gallery/Album contract: dialog, X/backdrop/Escape close,
body-scroll lock, root-held open state) with a LARGE, readable post.php
embed of the same post/video, scrollable for tall posts. The iframe tears
down on close so video audio stops.

The grid tile is unchanged -- it stays the compact inline embed (Option B
hybrid, scoping doc 4.3); the lightbox is additive, zero regression to
inline playback. A foot control is used rather than a whole-tile click
because the inline FB iframe is cross-origin and captures its own clicks.

Build 2 of 6 of the universal-lightbox plan
(docs/UNIVERSAL_LIGHTBOX_EXPAND_SCOPING-20260531-204334.md). Facebook only;
YouTube/ReverbNation/gallery/album/Instagram behavior untouched. Front-end
only -- no MV write, no export change.

Comment ceiling: the post plugin renders the post text + media but no FB
plugin renders the comment thread without an app token. The "Open on
Facebook" escape hatch is kept (in the tile foot and the overlay) as the
only path to comments. Logged-out caveat: FB renders public content
differently for a logged-out visitor, so live-verify is done incognito.

Out of scope (later builds): other platforms; comments (platform wall);
the "Unavailable -- content owned by someone else" FB card (FB-side block).
```

Then push and open the PR per CLAUDE.md "Workflow" (squash merge, hyphenated branch). Branch name uses hyphens (`facebook-in-site-lightbox-build2`) — slashed names fail in the sandbox.

---

## 7. Honest ceilings carried forward (operator expectations)

- **Comments are not readable in any FB embed** — on any token-free plugin. "Open on Facebook ↗" is the only path to the thread, kept always-visible on both the tile and the overlay.
- **Logged-out ≠ your logged-in view** — verify incognito (§5).
- **Out of scope this build:** the **"Unavailable — content owned by someone else"** FB card is an FB-side block (not a render bug); other platforms are later builds.
