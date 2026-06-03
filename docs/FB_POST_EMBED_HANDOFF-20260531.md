# Handoff — Render FB artifacts as post embeds (fix crop) + letterbox fallback

**Created:** 2026-05-31 (session stalled on sandbox I/O; operator chose to restart and re-run).
**Builds on:** `9f61e39` (feat(hr): add Facebook filter facet; per-video FB sizing groundwork). Branch `main`.
**Scope:** Front-end only — `src/routes/hr/HrExhibitFlow.jsx` + `src/routes/hr/HrExhibitFlow.css`. No data / export / MV change.
**Out of scope:** per-video dimensions in the export (this approach replaces that need); the FB-side "Unavailable — content owned by someone else" card; guestbook display bug.

This doc is self-contained. A fresh session can apply it without re-reading the old run reports. Apply the two JSX blocks + the CSS comment edit, run the in-sandbox verification, write a run report, then hand the host runbook to the operator for build/deploy/**live-verify**/commit/push.

---

## Why (operator decision)

FB **video** embeds (`plugins/video.php`, used for `watch?v=` and `/reel/`) render cropped/unusable: FB serves them at a fixed internal width and the height is cross-origin-unreadable, so front-end sizing can't fit them. FB **post** embeds (`plugins/post.php`) self-size to content AND report their real content height to the parent via `postMessage`. Operator confirmed a post embed shows the full text + image collage, properly sized.

**Approach:** render *every* FB artifact through `plugins/post.php?href=<original FB URL>` — including the `watch?v=`/`/videos/` and `/reel/` VIDEO urls, not just `/posts/`. A video is also a post, so post.php embeds the video inside a self-sizing post frame, sidestepping the measurement problem. Wire a `postMessage` listener to receive FB's posted height and size the frame to it. For any embed that doesn't post-size, **letterbox to fit (never crop)**. Keep the "Open on Facebook ↗" link on every card.

**Acceptance:** FB embeds render fully visible, never cropped — post-sized where FB reports height, letterboxed-to-fit otherwise; FB filter + all other cards unregressed; lint at baseline (host `npm run lint` = 4 errors / 6 warnings).

---

## Sizing model (the key invariant)

The box height is ALWAYS kept equal to the scaled frame height, so the frame can never overflow its box → **never cropped**:

- Frame laid out at FB's fixed `&width=500`, `transform: scale(--fb-w / 500)` to fill the column (`--fb-w` = live tile width from `useElementWidth`, same mechanism as before).
- Frame pre-scale height `effH` = (export dims if ever present) → else (measured `postedH` from postMessage) → else generous per-kind letterbox fallback.
- Box (vis) height = `calc(var(--fb-w,280) / 500 * effH px)` = exactly the scaled frame height.
- Measured height → exact fit (post-sized, no crop, no gap). No message → generous fallback box shows the whole frame with whitespace below short content (letterbox), never crops typical posts.

`kind` (video/reel/post) is retained ONLY for grid span (video may lean 2-col) and the `data-fbkind` CSS hook; all kinds now route through post.php.

---

## EDIT A — `HrExhibitFlow.jsx`: replace `fbEmbedFor`

NOTE: `HrExhibitFlow.jsx` is ~109 KB / 2705 lines (host). DO NOT use the host `Edit`/`Write` tool on it (>16 KB → tail truncation, CLAUDE.md quirk #1 / hygiene §1). Patch via the Python rm+write pattern over bash (read bytes, `.replace(old, new, 1)`, `os.remove`, write), then verify with the host `Read` tool. Watch for CRLF: if a literal match fails, retry with `old.replace('\n','\r\n')`.

REPLACE this exact block:

```jsx
function fbEmbedFor(url) {
  if (!url || typeof url !== "string") return null;
  const vMatch = url.match(/[?&]v=(\d+)/) || url.match(/\/videos\/(\d+)/);
  const reelMatch = url.match(/\/reel\/(\d+)/);
  if (vMatch) {
    const href = `https://www.facebook.com/watch/?v=${vMatch[1]}`;
    return { kind: "video", src: fbPluginSrc("video.php", href, false) };
  }
  if (reelMatch) {
    const href = `https://www.facebook.com/reel/${reelMatch[1]}/`;
    return { kind: "reel", src: fbPluginSrc("video.php", href, false) };
  }
  if (/\/posts\//.test(url) || /\/permalink\//.test(url) || /story\.php/.test(url)) {
    return { kind: "post", src: fbPluginSrc("post.php", url, true) };
  }
  return null;
}
```

WITH:

```jsx
// Render EVERY embeddable FB artifact through plugins/post.php — including
// watch?v= / /videos/ and /reel/ VIDEO urls, not just /posts/. Operator
// decision 2026-05-31: a video is also a post, and post.php frames self-size to
// content AND report that height to the parent via postMessage — the measurable
// path video.php lacked (video.php serves a fixed internal width with a
// cross-origin-unreadable height, so it could only be cropped or letterboxed).
// post.php takes the ORIGINAL FB url as href and resolves watch/reel/post alike.
// `kind` is retained only for grid span (video may lean 2-col) and the
// data-fbkind CSS fallback hook.
function fbEmbedFor(url) {
  if (!url || typeof url !== "string") return null;
  const isVideo = /[?&]v=\d+/.test(url) || /\/videos\/\d+/.test(url);
  const isReel = /\/reel\/\d+/.test(url);
  const isPost = /\/posts\//.test(url) || /\/permalink\//.test(url) || /story\.php/.test(url);
  if (!isVideo && !isReel && !isPost) return null;
  const kind = isVideo ? "video" : isReel ? "reel" : "post";
  return { kind, src: fbPluginSrc("post.php", url, true) };
}
```

`fbPluginSrc(plugin, href, showText)` is unchanged (already builds `plugins/${plugin}?href=...&show_text=...&width=500`). `fbEmbedDims(card)` is unchanged (forward-compat; returns null today). The `ArtifactCard` dispatch (`isFbEmbed`, `isFbVideo`, span logic, `data-fbkind`) is unchanged — `fbEmbedFor` still returns `{kind, src}`.

---

## EDIT B — `HrExhibitFlow.jsx`: replace the whole `FbEmbedCard` function

REPLACE this exact block (function `FbEmbedCard({ card }) { ... }`, the version that has `const dims = fbEmbedDims(card);` and the `--fb-w` comment):

```jsx
function FbEmbedCard({ card }) {
  const embed = fbEmbedFor(card.source_url);
  // --fb-w carries the tile's live width so the CSS can scale FB's fixed
  // 500px-wide plugin canvas to fill the column at any span/viewport (see the
  // FB embed sizing block in HrExhibitFlow.css).
  const [visRef, visW] = useElementWidth();
  // Per-card aspect (2026-05-31): the front-end half of per-video FB sizing —
  // the proper fix for mixed-orientation FB videos (a single per-kind box must
  // either crop portrait clips or letterbox landscape ones; the cross-origin
  // frame exposes no size to read). When the export carries the embed's
  // intrinsic pixel dimensions, size THIS card to that exact aspect: box
  // aspect-ratio = w/h, and since fbPluginSrc fixes &width=500 the frame's
  // pre-scale height = 500 × h/w, so the scaled frame fills the box with no crop
  // and no gap. The export does not emit these fields yet, so today every card
  // falls through to the per-kind .hr-card-fbembed[data-fbkind] CSS box —
  // byte-for-byte the prior behavior, no regression. When MV/export later
  // carries FB video dimensions, the fit corrects with no further front-end change.
  const dims = fbEmbedDims(card);
  const visStyle = {};
  if (visW) visStyle["--fb-w"] = visW;
  if (dims) visStyle.aspectRatio = `${dims.w} / ${dims.h}`;
  const frameStyle = dims ? { height: `${Math.round((500 * dims.h) / dims.w)}px` } : undefined;
  return (
    <>
      <div
        className="hr-card-video-vis"
        ref={visRef}
        style={Object.keys(visStyle).length ? visStyle : undefined}
      >
        {embed && (
          <iframe
            className="hr-fbembed-frame"
            src={embed.src}
            style={frameStyle}
            title={card.title || "Facebook embed"}
            loading="lazy"
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          />
        )}
      </div>
      <div className="hr-card-foot">
        <div className="hr-card-title hr-card-title-sm">{card.title || "(untitled)"}</div>
        {card.post_date && <div className="hr-card-meta">{card.post_date}</div>}
        <a
          className="hr-card-fb-open"
          href={card.source_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open on Facebook ↗
        </a>
        <ContentKindBadge card={card} />
      </div>
    </>
  );
}
```

WITH:

```jsx
// Generous per-kind FALLBACK frame heights (px, pre-scale at FB's fixed 500px
// plugin width) for when FB has NOT posted a measured height (blank/login-wall
// embed, or a frame that didn't post-size). Erring tall = the whole frame
// letterboxes inside its box with whitespace; it is never cropped. Operator
// floor: a visible-but-letterboxed embed is acceptable, a cropped one is not.
const FB_FALLBACK_H = { video: 620, reel: 1040, post: 720 };

function FbEmbedCard({ card }) {
  const embed = fbEmbedFor(card.source_url);
  const kind = embed ? embed.kind : "post";
  // --fb-w carries the tile's live width so the 500px-wide plugin canvas scales
  // to fill the column at any span/viewport (see the FB embed block in the CSS).
  const [visRef, visW] = useElementWidth();
  const frameRef = useRef(null);

  // post.php reports its real content height to the parent via postMessage — the
  // clean, measurable path video.php lacked. Size the frame (and its box) to it:
  // post-sized, no crop, no gap. FB has shipped several message shapes, so parse
  // tolerantly; accept only messages from facebook.com and from THIS card's
  // iframe window. State is set from the async message callback (never
  // synchronously in the effect body), matching useElementWidth/useResolvedThumb
  // so this does not trip react-hooks/set-state-in-effect. CONFIRM the shape on
  // live-verify; the letterbox fallback below guarantees full visibility even if
  // no message ever arrives.
  const [postedH, setPostedH] = useState(0);
  useEffect(() => {
    function onMessage(e) {
      let host = "";
      try { host = new URL(e.origin).hostname; } catch { return; }
      if (host !== "facebook.com" && host !== "www.facebook.com" && !host.endsWith(".facebook.com")) return;
      const win = frameRef.current && frameRef.current.contentWindow;
      if (win && e.source && e.source !== win) return;
      let d = e.data;
      if (typeof d === "string") { try { d = JSON.parse(d); } catch { return; } }
      if (!d || typeof d !== "object") return;
      const h = Number(
        d.height ?? d.frameHeight ?? (d.data && d.data.height) ?? (d.params && d.params.height)
      );
      if (Number.isFinite(h) && h > 40) setPostedH(Math.ceil(h));
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Export-provided intrinsic dimensions still win when present (forward-compat;
  // not emitted today). Otherwise the measured posted height, else the generous
  // per-kind letterbox fallback. The box height is ALWAYS kept equal to the
  // scaled frame height (calc below), so the frame can never overflow its box —
  // i.e. never cropped; short content just letterboxes.
  const dims = fbEmbedDims(card);
  const effH = dims
    ? Math.round((500 * dims.h) / dims.w)
    : (postedH || FB_FALLBACK_H[kind] || FB_FALLBACK_H.post);
  const visStyle = {};
  if (visW) visStyle["--fb-w"] = visW;
  if (dims) {
    visStyle.aspectRatio = `${dims.w} / ${dims.h}`;
  } else {
    visStyle.height = `calc(var(--fb-w, 280) / 500 * ${effH}px)`;
  }
  const frameStyle = { height: `${effH}px` };
  return (
    <>
      <div
        className="hr-card-video-vis"
        ref={visRef}
        style={Object.keys(visStyle).length ? visStyle : undefined}
      >
        {embed && (
          <iframe
            ref={frameRef}
            className="hr-fbembed-frame"
            src={embed.src}
            style={frameStyle}
            title={card.title || "Facebook embed"}
            loading="lazy"
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          />
        )}
      </div>
      <div className="hr-card-foot">
        <div className="hr-card-title hr-card-title-sm">{card.title || "(untitled)"}</div>
        {card.post_date && <div className="hr-card-meta">{card.post_date}</div>}
        <a
          className="hr-card-fb-open"
          href={card.source_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open on Facebook ↗
        </a>
        <ContentKindBadge card={card} />
      </div>
    </>
  );
}
```

Lint note: `useState`/`useRef`/`useEffect` are already imported and used elsewhere; new locals (`kind`, `frameRef`, `postedH`, `effH`, `FB_FALLBACK_H`) are all consumed. No new unused vars → no new lint constructs.

---

## EDIT C — `HrExhibitFlow.css`: refresh the comment block (functional rules unchanged)

Sizing is now driven by inline styles from `FbEmbedCard` (box height = scaled frame height via the `calc`), so the per-kind `aspect-ratio` and per-kind `.hr-fbembed-frame { height }` rules are now overridden by inline height in every case and act only as a pre-ResizeObserver hint. The `.hr-fbembed-frame { width:500px; transform: scale(calc(var(--fb-w,280)/500)); position:absolute; }` rule and `.hr-card-fbembed .hr-card-video-vis { overflow:hidden; background:#fff; ... }` rule are still needed — keep them.

Replace the top comment line of the FB block so it documents the new model (optional but expected by the task):

REPLACE:
```css
/* ── FB social-plugin embed cards (2026-05-31; scale-fit 2026-05-31) ──────
```
WITH:
```css
/* ── FB social-plugin embed cards (2026-05-31; post.php + postMessage auto-height + letterbox fallback) ──────
```

Optionally append, before `.hr-card-fbembed .hr-card-video-vis {`, a short note:
```css
/* 2026-05-31: ALL FB artifacts now embed via plugins/post.php (video/reel/post).
   post.php posts its real content height to the parent; FbEmbedCard listens and
   sets the frame + box height inline (box height = scaled frame height), so the
   frame is post-sized when measured and letterboxed-to-fit (never cropped) on
   the generous per-kind fallback. The aspect-ratio + per-kind frame-height rules
   below are a pre-measurement hint only and are overridden by those inline
   heights. */
```

(Functional CSS is unchanged; this is documentation parity.)

---

## In-sandbox verification (build is workerd-blocked in sandbox — CLAUDE.md §9)

1. `node --check src/routes/hr/HrExhibitFlow.jsx` — syntax. (If the sandbox FUSE view is truncated, copy the host file to /tmp first and `node --check` that.)
2. `npx eslint src/routes/hr/HrExhibitFlow.jsx` — expect 0 errors / 1 warning (the documented pre-existing warning); 0 new.
3. Full-repo `npm run lint` baseline-diff — expect 4 errors / 6 warnings (documented debt). A higher number = you introduced something.
   - Sandbox caveat: `eslint .` may show 5 err / 5 warn = the FUSE phantom parse in this file; verify the intact host/git-HEAD copy lints clean (0 err / 1 warn) so host `npm run lint` reports the true 4/6.
4. Classifier sanity (Node): assert `fbEmbedFor` returns `{kind:"video", src:/post\.php/}` for a `watch?v=` url, `{kind:"reel", src:/post\.php/}` for `/reel/`, `{kind:"post", src:/post\.php/}` for `/posts/`, and `null` for a bare profile/non-FB url. Confirm every `src` now contains `plugins/post.php` and none contain `video.php`.

---

## Host runbook (operator / PowerShell) — build → deploy → live-verify → commit + push

Sandbox can't build (workerd), can't safely commit (virtiofs index.lock), can't push (no GH creds). Run on the Windows host from `C:\AI\Projects\weird-baby-museum`:

```powershell
# 1) build + deploy to weird.baby
npm run lint            # expect 4 errors / 6 warnings (baseline)
npm run build           # must pass (vite + rolldown + cloudflare)
npm run deploy          # vite build && wrangler deploy
```

**2) LIVE-VERIFY (operator eyes — embeds render blank in automated/logged-out browsers, so this step is yours):** open https://weird.baby/hr and check:
- The FB cards — **video, reel, and post** — now render **fully, without cropping** (post-sized where FB reports height; letterboxed-to-fit with whitespace otherwise, never cut off).
- The "Open on Facebook ↗" link is present on every FB card; any FB-side "Unavailable" block still falls back to that link.
- FORMATS tab: the **Facebook** Source pill still = **16** and selects exactly the 16 FB cards; Youtube (39) / Reverbnation / Tiktok (2) etc. unchanged.
- Gallery, album, coverflow, audio, photo, YouTube cards unchanged.

If a card is still cropped, capture which kind/URL and report back — the fallback heights (`FB_FALLBACK_H`) or the postMessage shape parse may need a tweak.

**3) commit (explicit paths) + push** — only after live-verify passes:
```powershell
if (Test-Path .git\index.lock) { Remove-Item .git\index.lock }
git reset --mixed HEAD
git add src/routes/hr/HrExhibitFlow.jsx src/routes/hr/HrExhibitFlow.css
git commit -m "fix(hr): render FB artifacts as post.php embeds; postMessage auto-height + letterbox fallback"
git push    # or open a PR per the CLAUDE.md workflow if preferred
```
(Recent FB work — `9ed7cc2`, `651643e`, `9f61e39` — landed directly on `main`; match that or branch+PR per preference. Use hyphenated branch names only.)

---

## Files to add when committing the session record
- This handoff: `docs/FB_POST_EMBED_HANDOFF-20260531.md`
- A run report once applied+verified (per CLAUDE.md hygiene §13: write before the final commit), e.g. `docs/FB_POST_EMBED_RUN_REPORT-<ts>.md`.
