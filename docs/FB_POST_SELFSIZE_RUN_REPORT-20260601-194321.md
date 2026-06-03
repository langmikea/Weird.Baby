# FB post embeds self-size — stop overriding native height — Run Report

**Date:** 2026-06-01 19:43 UTC
**Session:** Cowork (front-end build)
**Brief:** FB post cards are clipped at the bottom and show a large black empty gap below the embed. Stop imposing our own height on post embeds; let post.php self-size via its `postMessage` height. Keep video (16/9) and reel (9/16) at fixed ratios.
**Authority:** Operator directive — "prefer the embed's native self-sizing mechanics over our custom sizing wherever they conflict … remove our height-imposition on posts, not add more."
**Builds on (uncommitted):** RC-A/RC-B, IG photo lightbox, FB-span-narrow (`docs/FB_SPAN_NARROW_RUN_REPORT-20260601-185451.md`), universal lightbox build 2.
**Status:** BUILT (front-end only). Host build → deploy → incognito live-verify → commit/push pending (runbook below).
**Scope:** FB **post** cards only. Untouched: video/reel ratios, the narrow-span fix, YT/gallery/album/IG, RC-C, the FacebookOverlay lightbox.

---

## 1. Diagnosis first (operator step 1) — is the postMessage height handler receiving + applying FB's height?

**Apply side: correct.** When a height is received, `setPostedH(h)` runs and `effH` resolves to `postedH`; both the iframe (`frameStyle.height`) and its box (`visStyle.height = scale × effH`) size to it, consistently scaled by the width-fill `scale = tileW / reqW`. So *if* a height arrives, the frame sizes to the post's real content — no clip, no gap. The mechanism's plumbing was sound.

**Receive side: the likely failure, and it is structural to the raw-iframe embed.** Every FB card is embedded as a bare `<iframe src="…/plugins/post.php?…">` with **no FB JavaScript SDK** and no `fb-root`. Facebook's *reliable* auto-height path is the **XFBML / SDK** embed: `sdk.js` performs the cross-frame `postMessage` handshake with the plugin and resizes the iframe via `FB.XFBML.parse()`. The **iframe-method** plugin renders its content at a self-determined height *inside* the frame but does **not** reliably post that height back out to a custom listener with no SDK present. (Sources below.) So in practice `postedH` likely stays `0`, and the old `post: 1100` per-kind fallback is what rendered — which is exactly the reported symptom: an oversized fixed box, FB clipping its own content at its internal cutoff, and dead space below.

**Could not confirm message receipt from here.** FB embeds render blank for logged-out / automated browsers (noted in prior FB run reports), so even a live console probe needs the operator's logged-in incognito eyes. A 3-line probe is in the runbook to settle it empirically.

**What I did NOT do (per "report before changing the approach"):** I did **not** swap posts to FB's XFBML/SDK embed. That is the genuine "native self-sizing" path and is the escalation if the probe shows no message ever arrives — but it is a larger change (loads FB's third-party `sdk.js`, touches all FB kinds) and the operator asked to be told before any approach change. The in-scope fix below removes our height-imposition and lets the existing `postMessage` path drive the height whenever it does fire.

## 2. The change (posts only)

`HrExhibitFlow.jsx`, `FbEmbedCard` height resolution (~line 1690):

```js
// before
const fallbackH = Math.round((FB_FALLBACK_H[kind] || FB_FALLBACK_H.post) * (500 / reqW));
const effH = dims ? Math.round((reqW * dims.h) / dims.w) : (postedH || fallbackH);
// after
const isPost = kind === "post";
const POST_LOADING_H = 480; // frame px at reqW; displayed ≈ ×scale (~380px at 1-col)
const fallbackH = Math.round((FB_FALLBACK_H[kind] || FB_FALLBACK_H.post) * (500 / reqW));
const effH = dims
  ? Math.round((reqW * dims.h) / dims.w)
  : isPost
    ? (postedH || POST_LOADING_H)   // self-size to FB's reported height; else a modest loading box
    : (postedH || fallbackH);        // video/reel: unchanged
```

- **Posts now impose no height of our own.** Measured → `effH = postedH` (frame exactly as tall as its content). Unmeasured → a modest `POST_LOADING_H = 480` graceful loading box (~380px displayed at a 1-col tile), **not** the old `1100`-derived ~1247px void.
- **`FB_FALLBACK_H` left intact** (`{ video: 620, reel: 1040, post: 1100 }`) so the **video/reel** branch and the out-of-scope **FacebookOverlay** lightbox are byte-for-byte unchanged.
- **Width-fill mechanics unchanged** — request at `reqW` (FB 350–750, 10px-quantized), residual `scale` to fill the tile. Only the *height source* for posts changed.

`HrExhibitFlow.css`, post box floor (~line 248):

```css
/* before */ .hr-card-fbembed[data-fbkind="post"] .hr-card-video-vis { min-height: 320px; }
/* after  */ .hr-card-fbembed[data-fbkind="post"] .hr-card-video-vis { min-height: 120px; }
```

Lowered so a **short** measured post leaves no dead space either (the 320 floor would have capped a short post and reintroduced a small gap). It only keeps the box from collapsing pre-measurement; it never caps a taller post. Comment refreshed to the self-size model.

## 3. Verification (sandbox)

- **Edit integrity:** both files edited host-direct (Edit tool → Windows path, not the FUSE mount). Post-edit host-direct re-read confirms the edited region (1686–1727) and the file closing cleanly at line 3128 — no truncation. (Sandbox FUSE view of this file is the documented stale/byte-capped cache — 2644L vs 3128L real — so bash parse/lint of the whole file is non-informative; full lint/build run host-side per CLAUDE.md §9.)
- **Logic replica (Node):** standalone reimplementation of the new `effH` branch over post/video/reel cases — **ALL ASSERTIONS PASS**:
  - post measured tall (postedH 1600) → effH 1600, box 1271px (exact self-size, no clip/gap);
  - post measured short (postedH 230) → effH 230, box 183px (follows content, no floor gap);
  - post unmeasured → effH 480, box **381px** (modest loading, not the ~1247px void);
  - video/reel unmeasured → still equal their per-kind `fallbackH` (886 / 1486) — untouched;
  - video measured → honors postedH (300).
- **Syntax:** the edited statements parse cleanly under `node --check` in isolation.
- **Lint safety:** new locals `isPost` / `POST_LOADING_H` are consumed; `fallbackH` still referenced by the video/reel branch — no unused-var. Expected host baseline unchanged: **4 errors / 6 warnings**.

## 4. Host runbook (operator / PowerShell) — build → deploy → live-verify → commit + push

Run from `C:\AI\Projects\weird-baby-museum`:

```powershell
npm run lint            # expect 4 errors / 6 warnings (baseline; no new)
npm run build           # must pass (vite + rolldown + cloudflare)
npm run deploy          # vite build && wrangler deploy
```

**LIVE-VERIFY (incognito — embeds are blank to logged-out/automated browsers):** open https://weird.baby/hr and confirm:

- FB **post** cards show **full content with no bottom clip and no black gap below** — the card is exactly as tall as the embed.
- FB **video / reel** cards unchanged (fixed 16/9 and 9/16).
- Foot stays de-duped (no repeated caption/date); "Open on Facebook ↗" + "Expand" present.
- YT / gallery / album / IG / coverflow / audio unregressed; FORMATS → Facebook Source pill count unchanged.

**Diagnostic probe (settles whether postMessage actually fires — paste in the incognito DevTools console *before* scrolling FB cards into view):**

```js
window.addEventListener("message", e => {
  if (/(^|\.)facebook\.com$/.test((()=>{try{return new URL(e.origin).hostname}catch{return""}})()))
    console.log("FB msg:", e.origin, e.data);
});
```

- **If FB messages with a height log** → the self-size path is live; post cards should already be exact. Done.
- **If nothing logs** as cards render → the raw-iframe path posts no height. Posts will show the modest loading box (not a void), full content via "Expand". The next step is the flagged approach change: adopt FB's XFBML/SDK embed for posts. **Report back before I implement that** (operator asked to be told before changing approach).

**Commit (explicit paths) + push** — after live-verify:

```powershell
if (Test-Path .git\index.lock) { Remove-Item .git\index.lock }
git reset --mixed HEAD
git add src/routes/hr/HrExhibitFlow.jsx src/routes/hr/HrExhibitFlow.css docs/FB_POST_SELFSIZE_RUN_REPORT-20260601-194321.md
git commit -m "fix(hr): let FB post embeds self-size; drop imposed 1100px fallback"
git push    # or open a PR per the CLAUDE.md workflow
```

## 5. Out of scope (untouched)

video/reel aspect ratios; the FB-span-narrow fix; the FacebookOverlay lightbox; YT / gallery / album / IG; RC-C (masonry gutters); MV / export / deploy pipeline. No data change — no `export-artifacts` needed.
