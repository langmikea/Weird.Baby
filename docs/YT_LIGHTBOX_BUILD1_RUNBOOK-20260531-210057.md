# YouTube In-Site Lightbox — Build 1 of 6 — Runbook & Run Report

**Date:** 2026-05-31
**Session:** Cowork (sandbox edits only — build / deploy / commit / push run host-side per CLAUDE.md §2, §9)
**Plan:** `docs/UNIVERSAL_LIGHTBOX_EXPAND_SCOPING-20260531-204334.md` — this is the YouTube piece (Brief 2 in that doc's table; "build 1" in the kickoff).
**Scope held:** YouTube only. No FB / ReverbNation / gallery / album behavior touched. Front-end only — no MV write, no export change, no deploy-pipeline change.

---

## 1. What changed

Clicking any of the 39 YouTube artifact cards now opens the **existing in-site lightbox shell** with an embedded `youtube-nocookie.com/embed/<id>` player, instead of opening a new browser tab. The shell's close / scroll-lock / keyboard behavior is reused verbatim from `GalleryOverlay` / `AlbumOverlay`.

**The "Watch on YouTube ↗" escape hatch is kept**, now inside the overlay caption — it is the only path to comments (the embedded player is player-only; no embed renders the comment thread — scoping doc §3.1 / §6.1).

### Files (2)

| File | Change |
|---|---|
| `src/routes/hr/HrExhibitFlow.jsx` | New `youtubeIdFromUrl` parser + `YouTubeOverlay` component; `ArtifactCard` routes YouTube cards to a `<button>` → overlay (was `<a target="_blank">`); `onOpenYouTube` threaded `P3Panel → ArtifactCard`; root `openYouTube` state + render site. |
| `src/routes/hr/HrExhibitFlow.css` | New `.hr-yt-ov*` rules mirroring `.hr-gallery-ov` (full-viewport INK backdrop, ✕ close, 16:9 responsive iframe frame, caption + escape-hatch link). |

### Mechanism notes

- **Shell reuse, not a new overlay.** `YouTubeOverlay` copies the `GalleryOverlay` shell contract: `role="dialog" aria-modal`, ✕ button, backdrop `onClick={onClose}` with inner-stage `stopPropagation`, `Escape` keydown listener, and `document.body.style.overflow = "hidden"` scroll-lock restored on unmount. Open state is held at the HrExhibitFlow root (`openYouTube`), so it layers above the deck/grid and survives grid reflows — same pattern as `openGallery` / `openAlbum`.
- **Player teardown.** The `{openYouTube && <YouTubeOverlay/>}` conditional unmounts the iframe on every close path (✕ / backdrop / Escape), so audio stops — scoping doc §4.5. One overlay open at a time (root state is a single card).
- **Scope discipline.** Split YouTube off from the generic `isLink` predicate via `card.source_platform === "youtube"` + a parseable video id. **ReverbNation and "other" link cards keep the `<a target="_blank">` new-tab behavior untouched.** A YouTube card whose URL has no parseable id falls through to `isLink` → new-tab (safe fallback).
- **No visual regression in the grid.** YouTube cards still render the `LinkCard` tile (thumbnail + play triangle) and keep their wide-bias span (`isYouTube` added to the `pickSpan` bias list). The only tile change: the `↗` external-arrow is dropped on YouTube tiles, since they no longer leave the site (the play triangle signals in-site playback).
- **Embed params:** `youtube-nocookie.com` (reduced initial tracking), `autoplay=1` (honored because the open is a user click), `rel=0`, `modestbranding=1`. `allowFullScreen` + standard `allow` list; `referrerPolicy="strict-origin-when-cross-origin"`.

---

## 2. Sandbox verification done

- **Edits verified host-direct (Read tool).** All 8 edit sites confirmed present and well-formed; file integrity intact: `HrExhibitFlow.jsx` = **2846 lines** (was 2729; +117 matches the additions exactly), clean EOF; CSS block balanced and transitions cleanly into `.hr-album-ov`. `--hr-gold-lo` confirmed defined in `museum-tokens.css`.
- **Parser unit test (Node):** `youtubeIdFromUrl` extracts the correct id for **all 39** live YouTube `source_url`s — including hyphen / underscore / leading-hyphen ids (`-2aU97nuzYE`, `L7-1T7F7_R0`, `_w0wz5o9dWU`, `n2m8sP17E-c`, `omU0Xt3yB-o`). `null` and non-YouTube URLs return `null` (fallback path). `youtu.be/<id>` also parses.
- **Lint NOT run in sandbox — by design.** The FUSE view of `HrExhibitFlow.jsx` is truncated (2716 of 2846 lines), so a sandbox `eslint` / `node --check` hits the documented phantom parse error (CLAUDE.md cowork-sandbox quirk + §9). Authoritative lint runs host-side — see step 4 below.
- **Build NOT run in sandbox** — workerd-blocked (CLAUDE.md §9). Runs host-side — step 3.

---

## 3. Build + deploy (host PowerShell)

This is a **front-end-only** change. There is **no MV data change**, so `npm run export-artifacts` is **NOT** needed (skip step 2 of the release flow — it does not apply here).

```powershell
cd C:\AI\Projects\weird-baby-museum
npm run lint     # expect baseline: 4 errors / 6 warnings (see step 4)
npm run build    # Vite + rolldown + Cloudflare plugin — must pass
npm run deploy   # vite build && wrangler deploy → weird.baby
```

---

## 4. Lint check (host PowerShell)

`npm run lint` must be at the documented baseline — **4 errors / 6 warnings**, all pre-existing (`WbAdmin.jsx:18`; `Exhibit.jsx:88/191/517`; `HrExhibitFlow.jsx` 1 warning). A higher count means this change introduced something. (The sandbox 5/5 figure is the phantom-truncation artifact and does not apply on Windows.)

---

## 5. Live-verify checklist (operator) — weird.baby/hr

Front-end only, public content — the YouTube logged-out/operator distinction does **not** apply (unlike FB). Verify:

1. **Opens in-site:** click a YouTube card → the in-site lightbox opens (no new tab) with the embedded player, and the video **plays**.
2. **Close works — all three:** ✕ button, backdrop click (outside the player), and `Escape`. After each, the overlay is gone and **audio has stopped** (teardown).
3. **Previously thumbnail-less videos:** the videos that were rendering without a thumbnail (the maxres-less ones — e.g. `Fa5GKxEgf7c`, `uaFHDfuohxc`) still show their thumbnail in the grid **and now play** in the overlay.
4. **Escape hatch:** the **"Watch on YouTube ↗"** link in the overlay caption is visible and opens the watch page in a new tab (for comments).
5. **No regressions on other card types:**
   - Facebook cards still embed **inline** in the grid (unchanged).
   - Gallery and Album cards still open their own overlays.
   - **ReverbNation (5) and the "other" ticketing link still open in a new tab** (not the YouTube overlay).
   - The Instagram photo card unchanged.
6. **Grid unchanged:** YouTube tiles look the same (thumbnail + play triangle), minus the `↗` corner arrow.

---

## 6. Commit + push (host PowerShell)

Recovery prelude (always-safe per CLAUDE.md §2):

```powershell
cd C:\AI\Projects\weird-baby-museum
if (Test-Path .git\index.lock) { Remove-Item .git\index.lock }
git reset --mixed HEAD
git checkout -b youtube-in-site-lightbox-build1
git add src/routes/hr/HrExhibitFlow.jsx src/routes/hr/HrExhibitFlow.css docs/YT_LIGHTBOX_BUILD1_RUNBOOK-20260531-210057.md
git commit -m "feat(hr): YouTube cards play in-site via lightbox"
```

Suggested commit body:

```
The 39 YouTube artifact cards opened a new browser tab (LinkCard ->
<a target="_blank">). They now open the existing in-site lightbox shell
(GalleryOverlay/AlbumOverlay contract: dialog, X/backdrop/Escape close,
body-scroll lock, root-held open state) with an embedded
youtube-nocookie.com/embed/<id> player that plays in place. The iframe
tears down on close so audio stops.

Build 1 of 6 of the universal-lightbox plan
(docs/UNIVERSAL_LIGHTBOX_EXPAND_SCOPING-20260531-204334.md). YouTube only;
FB/ReverbNation/gallery/album behavior untouched. Front-end only -- no MV
write, no export change.

Comment ceiling: the embedded player is player-only; no embed renders the
comment thread. The "Watch on YouTube ↗" escape hatch is kept inside the
overlay as the only path to comments.

Out of scope (later builds): other platforms; comments (platform wall);
the FB inline-vs-lightbox placement decision.
```

Then push and open the PR per CLAUDE.md "Workflow" (squash merge, hyphenated branch). Branch name uses hyphens (`youtube-in-site-lightbox-build1`) — slashed names fail in the sandbox.
