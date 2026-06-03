# FB grid — true settled-layout state + FB JS SDK assessment (DIAGNOSTIC)

**Date:** 2026-06-01 21:06 UTC
**Session:** Cowork (diagnostic only — drove live Chrome, measured DOM, read code, researched Meta docs)
**Brief:** (1) Ground-truth the current FB grid layout on the live site after full settle — overlap / void / clean, per card. (2) Assess whether switching FB embeds from the bare `plugins/post.php` iframe to the official JS SDK `fb-post` plugin is the real fix for the clip/overlap/void class.
**Hard stops honored:** No build, no edit, no deploy, no commit. Findings only. Everything below is from live measurement + code read, not assumption.
**What was driven:** Connected Chrome "Chonger" (logged-in) → https://weird.baby/hr → FORMATS tab ("the artifact deck", 64 artifacts) → scrolled the panel to mount all 16 FB embeds → waited for FB content + postMessage heights → measured every card's geometry via DOM offsets + getBoundingClientRect → ran controlled CSS experiments on the live layout (ephemeral, non-persisted).

---

## TL;DR

1. **The overlap is real, systematic, and currently live.** After full settle: **15 cards overlap their lower neighbor by ~160px each (16 overlap pairs), 49 cards sit above a void, 0 cards are clean.** Every card is on a rigid 360px vertical lattice.

2. **The root cause is NOT the FB height handshake.** It is a one-line CSS bug: `.hr-card { grid-row: span 360 }`. The shorthand sets `grid-row-**start**: span 360`, which the browser uses for placement and which **cannot be overridden** by the masonry hook's `grid-row-**end**` writes. `useMasonryRowSpan` measures heights correctly and writes correct `grid-row-end` spans — and they are **completely inert**. Proven empirically (below).

3. **Therefore the SDK switch is not the real fix for the reported bug.** The overlap/void/clip class is a grid-placement bug that is orthogonal to how an embed obtains its height. A perfectly self-sizing SDK `fb-post` would still be locked to the 360px lattice and would overlap/void identically. The SDK is a defensible, separate improvement to the *within-card* height handshake, but adopting it would **not** remove `useMasonryRowSpan`, would **not** fix overlap/void on its own, and carries real new costs (350px-min width collision with the just-shipped single-column FB cards, SPA re-parse timing, third-party cookies/tracking, CSP).

**Recommended path:** fix the CSS lattice bug first (cheap, high-confidence, fixes overlap *and* void for **all** card types at once). Evaluate the SDK separately, on its own merits — not as the overlap fix.

---

## PART 1 — True settled-layout state (measured)

### Method

- Tab: FORMATS → the artifact grid (`.hr-artifact-grid`, `display:grid`, `grid-template-columns: repeat(4, minmax(0,280px))`, 4 columns at ~185px each on the operator's viewport). 64 cards; 16 are `.hr-card-fbembed`.
- Scrolled the inner scroll container (`.wb-scroll.hr-panel-scroll`, 647px tall over a 9021px grid) end-to-end to mount all 16 lazy FB iframes (`tileW>0` gate), then waited ≥6s for FB to load content and post `postMessage` heights and for the hook's settle sweeps (120/400/900/1800ms).
- Measured each card grid-locally via `offsetTop/offsetLeft/offsetWidth/offsetHeight` (scroll-independent) and cross-checked against `getBoundingClientRect()`.
- Overlap = two cards' boxes intersect by >2px in both axes. Void = card content height is shorter than its reserved 360px slot.

### Result — per-card census (64 cards, settled)

| State | Count | What it means |
|---|---|---|
| **Overlap** | **15 cards / 16 pairs** | content height > 360px → the card bleeds past its 360px slot into the next card below it |
| **Void** | **49 cards** | content height < ~346px → empty (INK/black) gap below the card before the next row |
| **Clean** | **0 cards** | nothing renders at exactly the 360px reservation |

The overlapping cards are the loaded tall FB embeds (FB **video**/**post** at ~520px when `show_text=true` renders the caption), each bleeding exactly **~160px** (520 − 360) into the card 4 positions later in the same column. Visually confirmed in a screenshot: in every column the next card's content (faces, a "Lyme Disease" caption, play buttons) sits on top of the bottom ~160px of the card above it.

### Why — the mechanism (root cause)

Distinct column-to-column strides measured: **360, 720, 1440, 2520 px** — *all exact multiples of 360*. Every card occupies an integer number of 360px slots. That lattice is set here:

```css
/* HrExhibitFlow.css ~line 162 */
.hr-card {
  ...
  grid-row: span 360;   /* ← the bug */
}
```

The intent (per the in-file comment) was a pre-measurement reservation that *"JS overwrites … with the measured height the same frame."* It does not. The hook writes the **wrong property**:

- CSS `grid-row: span 360` is shorthand → sets `grid-row-start: span 360` (end defaults to auto).
- `useMasonryRowSpan` writes `card.style.gridRowEnd = "span " + (h+14)` — i.e. `grid-row-**end**` only.
- Result computed style: `grid-row: span 360 / span 535` (start span 360 from CSS, end span 535 from JS). When **both** placement lines are spans, the browser resolves placement from the **start** span (360) and ignores the end span. So the card always spans 360px.

**Empirical proof the end-span is inert** (run live, then reverted):
- Set a card's `grid-row-end` to `span 1500` → column stride unchanged at **360**.
- Set it to `span 50` → stride unchanged at **360**.
- Re-wrote *all* cards' `grid-row-end` from their true measured heights and forced reflow → stride unchanged at **360**.
- Toggled `grid-auto-flow: dense → row` → overlap persisted (15). Dense is not the cause.

So `useMasonryRowSpan` is measuring correctly and is **entirely without effect**. Confirmed identical in the working tree (`HrExhibitFlow.css` line 171: `grid-row: span 360;`) and in the live deployed stylesheet (read from `document.styleSheets`: `.hr-card { ... grid-row: span 360; ... }`).

### One-line fix (not applied — diagnostic only)

Change the default so it sets the **end** (which JS already overrides), or remove it and let JS own placement:

```css
.hr-card { ... grid-row-end: span 360; }   /* JS grid-row-end:span N now wins; start stays auto */
```

This makes the *existing, correct* masonry measurements take effect and resolves **both** overlap and void for **all** card types simultaneously. It is independent of anything Facebook does.

---

## PART 2 — FB JS SDK (`fb-post`) assessment

Current FB embed (confirmed live): a bare `<iframe src="https://www.facebook.com/plugins/post.php?href=…&show_text=true&width=350">`, **no** `fb-root`, **no** `window.FB` / SDK. The app hand-rolls a `postMessage` height listener (`postedH`) and width-fill scaling.

Meta's intended method (official docs): load `sdk.js#xfbml=1` once with `<div id="fb-root">`, render `<div class="fb-post" data-href data-width>`, and let the SDK perform the cross-frame height handshake and fire `xfbml.resize` internally; `FB.XFBML.parse(dom, cb)` (re-)renders on demand.

### Does the SDK eliminate the clip/overlap/void class? — **No, not the overlap/void part.**

The overlap/void you reported is the **grid-placement** bug from Part 1, which is *upstream of and independent from* embed height. The SDK self-sizes the **iframe**; it does **not** size the **grid row**. With `.hr-card { grid-row: span 360 }` in place, an SDK embed that self-sizes to 520px is still clamped to the 360px slot and overlaps by 160px exactly as the bare iframe does. **Fixing the CSS fixes overlap/void with or without the SDK; adopting the SDK without fixing the CSS fixes neither.**

What the SDK *would* genuinely improve is the **within-card height handshake** — the thing hand-rolled across 5 sessions. The bare iframe does not reliably post its height to a custom listener with no SDK present; the SDK does the handshake internally. (Note: in this logged-in browser the hand-rolled `postMessage` path *did* fire — FB video cards received heights and grew to ~520px — so the handshake is partially working today; its reliability is the open question, especially for logged-out/strict-privacy viewers.)

### Concrete assessment against the requested points

**Feasibility in this React SPA — moderate.** Load `sdk.js` once (e.g. in `index.html` or a one-time effect) with `#xfbml=1`, inject `<div id="fb-root">`, render `<div class="fb-post" data-href={url} data-width={w}>` per card, and call `FB.XFBML.parse(gridEl)` after each render/filter change. Workable, but it replaces one custom mechanism (postMessage listener) with another (parse lifecycle management) — not a pure deletion of custom code.

**SPA / `FB.XFBML.parse()` re-parse timing — a real ongoing cost.** The deck re-renders the grid on every filter/tab change (`filterKey` dep). Each change requires re-parsing the new/changed `.fb-post` nodes. `FB.XFBML.parse()` accepts a scoped DOM node + callback, which helps. But a documented failure mode is that a manual `parse()` can render **0×0** posts under race conditions (SDK not ready, node not yet in DOM, double-parse). You would need to gate parse on `fbAsyncInit`, avoid re-parsing already-rendered nodes, and handle the resize callback to feed the masonry — i.e. timing logic comparable in complexity to today's listener.

**Logged-out behavior — unchanged.** Embedded Posts (both bare iframe and SDK) render only **public** posts and show the same "this content isn't available right now" / "Unavailable" fallback when a post is private/deleted or rights-blocked. One card on the live grid already shows FB's *"This video can't be embedded because it may contain content owned by someone else"* — the SDK does **not** change that. The SDK is not a fix for blank/unavailable embeds.

**Does it remove `useMasonryRowSpan`? — No.** The grid still needs to know each card's height to place it (write `grid-row`). The SDK resizes the iframe and fires `xfbml.resize`; you would still translate that into a grid-row span. So the masonry hook stays — and the Part 1 CSS bug must be fixed regardless. The SDK changes *where the height comes from*, not *whether the grid needs to be told the height*.

**Width floor collision — a new, concrete friction.** FB embeds have a **350px minimum** `data-width` (350–750). The FB cards were just forced to **single-column ~185px** (`FB_SPAN_NARROW`, 2026-06-01). The live bare iframe already works around this by requesting at 350px and applying `transform: scale(0.52)` to fit the 183px tile. The SDK `fb-post` shares the **same 350px floor** (and Meta explicitly says *"do not use CSS to size the plugin"*). So at 185px tiles you would **still need the downscale-transform hack on top of the SDK** — the SDK does not give a clean 185px self-sized embed. This materially weakens the "removes our custom sizing" argument for the current single-column layout.

**New risks if adopted:**
- **Weight:** `sdk.js` (~80KB gzipped) plus the SDK's sub-resources (xd_arbiter frame, per-plugin iframes) — a third-party blocking dependency on `connect.facebook.net` added to every `/hr` visit.
- **Privacy/tracking:** the SDK sets Facebook cookies and loads FB tracking pixels — a direct reversal of the deliberate privacy posture elsewhere in this file (YouTube embeds use `youtube-nocookie.com`; the bare FB iframe sets no first-party FB SDK cookie). This is a values trade-off, not just a technical one.
- **CSP:** would require allowing `connect.facebook.net` in `script-src` and `facebook.com`/`connect.facebook.net` in `frame-src` (and `style-src`/`img-src` for plugin chrome). Today's bare iframe needs only `frame-src facebook.com`.
- **Availability coupling:** an SDK outage or slow `connect.facebook.net` becomes a render-blocking dependency for the whole deck, not just one iframe.

### Recommendation

**The SDK switch is not the real fix for the overlap/void/clip you're seeing.** The reported bug is the CSS grid lattice (`grid-row: span 360`), and the highest-leverage action is the one-line CSS correction in Part 1 — cheap, reversible, high-confidence, and it fixes overlap *and* void for every card type at once, with zero new third-party dependency.

On the "prefer the platform's native mechanism" principle: it is sound, and the SDK *is* the native height-handshake mechanism. But (a) it solves a *different* problem than the visible bug, (b) it does not let you delete `useMasonryRowSpan`, (c) at the current 185px single-column width it does **not** remove the custom downscale-scaling either, and (d) it adds weight, tracking, and CSP surface that conflict with the existing privacy posture. So decouple the two decisions:

1. **Now:** fix `grid-row: span 360 → grid-row-end: span 360` (or remove it). This is the actual overlap/void fix. Re-verify in incognito.
2. **Separately, optional:** evaluate the SDK purely as a *height-handshake robustness* upgrade for logged-out/strict-privacy viewers, weighing it against the 350px-floor friction, re-parse timing, and the privacy/CSP/weight costs above. If handshake reliability proves to be a real problem *after* the CSS fix lands, revisit it then — with the overlap noise removed, the handshake's true reliability will finally be measurable.

---

## Verification

- **Overlap/void measured, not eyeballed:** grid-local offsets + `getBoundingClientRect` cross-check; 16 overlap pairs and 49 voids reproduced across two independent page loads; distinct strides all multiples of 360.
- **Root cause proven causal, not correlational:** live mutation experiments (grid-row-end span 50 / 1500 / per-card-true-height; dense→row) — none moved the 360 stride. Confirmed in both live stylesheet and working-tree CSS.
- **SDK claims grounded in Meta's current docs** (Embedded Posts; FB.XFBML.parse): 350–750px width range, `sdk.js#xfbml=1` + `fb-root` setup, scoped `parse(dom, cb)`, public-post-only + unavailable-post fallback, "do not size the plugin with CSS."
- **Width-floor collision verified live:** FB iframe requested at `width=350`, `transform: scale(0.5228)` over a 183px tile; no `fb-root`, `window.FB` undefined (bare-iframe path confirmed).
- **Hard stops:** no file in the repo was edited; all live-page mutations were ephemeral (reverted or discarded on reload).

## Sources

- [Embedded Posts — Meta for Developers](https://developers.facebook.com/docs/plugins/embedded-posts/)
- [FB.XFBML.parse() — Meta for Developers](https://developers.facebook.com/docs/reference/javascript/FB.XFBML.parse/)
- Live site: https://weird.baby/hr (FORMATS / the artifact deck), measured 2026-06-01 ~21:00 UTC
- Code: `src/routes/hr/HrExhibitFlow.css` (`.hr-card`, `.hr-artifact-grid`), `src/routes/hr/HrExhibitFlow.jsx` (`useMasonryRowSpan`, `FbEmbedCard`, `fbPluginSrc`)
- Prior reports: `FB_POST_SELFSIZE_RUN_REPORT-20260601-194321.md`, `CARD_SHAPE_FIX_RUN_REPORT-20260601-175457.md`, `FB_SPAN_NARROW_RUN_REPORT-20260601-185451.md`, `FB_POST_EMBED_RUN_REPORT-20260531-191027.md`
