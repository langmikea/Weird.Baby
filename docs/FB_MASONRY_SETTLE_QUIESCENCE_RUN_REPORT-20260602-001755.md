# FB masonry — over-reserve jaggies + column-3 clip → quiescence settle fix — Run Report

**Date:** 2026-06-02 00:17 UTC
**Session:** Cowork (diagnose + front-end build)
**Brief (operator, Option A — KEEP live FB embeds):** Two operator-confirmed
symptoms on the live FORMATS artifact deck (incognito, embeds mounted, settled):
1. **Jaggies / chaotic columns** — cards do not pack tightly; columns reach
   wildly different total heights with large dead/void space *below the content
   inside* many cells. Severe and patternless (not the mild ragged-bottom of
   normal masonry). Indicates cards **reserve MORE height than their settled
   content uses**, so `grid-auto-flow: dense` can't backfill.
2. **Column-3 clip** — at least one card's embed is clipped ~half a text line at
   the bottom. That card **reserves LESS than its settled content**.

**Decision honored:** KEEP live FB embeds (Option A). No switch to previews, no
removal of embeds, no FB JS SDK. Front-end only.
**Status:** DIAGNOSED + BUILT (front-end). Host build → deploy → **incognito,
FB-mounted, full-scroll-settle** live-verify with the before/after delta snippet
in §5 → commit/push. Runbook in §6.
**Scope:** `useMasonryRowSpan` (the masonry measurement / settled-height read) in
`src/routes/hr/HrExhibitFlow.jsx`. **Untouched:** the lattice fix
(`grid-row-end: span 360`), `pickSpan` / span variety, `grid-auto-flow: dense`,
the FB embed sizing (`effH`/`postedH`/`scale`), YT / gallery / album / IG /
coverflow / audio, and all data / MV / export. No CSS change.

---

## 1. Diagnosis — measured, then reasoned

### 1.1 What was measured live (this session)

Drove the connected Chrome to `https://weird.baby/hr` → FORMATS artifact grid
(`.hr-artifact-grid`, 64 cards, 16 `.hr-card-fbembed`). Read computed grid
geometry and every card's reserved-vs-content delta directly from the DOM.

**Grid track model — confirmed exactly as intended:**

| Property | Value |
|---|---|
| `grid-auto-rows` | **1px** |
| `row-gap` | **0** |
| `grid-auto-flow` | **dense** |
| `grid-template-columns` | `repeat(4, …)` |

So a card with `grid-row-end: span N` reserves **N × 1px + (N−1) × 0 = N px**.
The hook writes `span = ceil(height) + 14`. Reserved = content + 14 (the baked-in
vertical gap). **The masonry arithmetic is correct.**

**Per-card census (64 cards), reserved (span×track) vs content box:**

| Bucket | Count | Note |
|---|---|---|
| reserved == content + 14 (gap) | **63** | exact, every card |
| over-reserve > gap | **1** | a `link` card, +31 (≈+17 over gap) — a thumbnail that loaded after its span was set; a one-off, same class as the bug below |
| under-reserve (clip) | **0** | — |

The point: **when a card's height is stable, the span equals it (plus the 14px
gap) for every card.** The lattice fix works; `useMasonryRowSpan`'s writes are
effective; the packing math is sound. There is **no static over/under-reservation
bug.**

### 1.2 Why I could not reproduce the *mounted-settled* FB deltas here (honest limit)

The operator's symptoms only appear once the **FB iframes mount and settle**. In
this automation the driven tab is a **background tab** (`document.visibilityState
=== "hidden"`), so Chrome throttles `requestAnimationFrame`, `ResizeObserver`,
and timers to ~1 Hz and never paints. Consequences I measured directly:

- `useElementWidth`'s rAF/RO never commits a non-zero width → the FB cards'
  React `tileW` stays **0** → the `embed && tileW > 0` gate never fires →
  **0 FB iframes mounted on the whole page** (`document.querySelectorAll('iframe')
  .length === 0`). A 40-tick scroll/resize sweeper landed only **6** ticks in
  9 s — proof of the throttle.

So the FB embeds never reached the failing (mounted, late-settling) state in my
view. The mounted-settled deltas must be captured in the operator's **foreground
incognito** browser — the snippet in §5 does exactly that, before and after.
(The prior diagnostic `FB_MASONRY_OVERLAP_AND_SDK_DIAGNOSIS-20260601-210604.md`
ran in a foreground browser and *did* see FB cards mount and grow to ~520px — the
mounted state this session's background tab can't reach.)

### 1.3 Root cause (code + the measured-stable fact + prior reports)

Because the span equals the content box whenever the box is **stable** (§1.1),
the operator's over/under-reservation can only be a **timing** desync: the span
is captured from a height the FB card had at some moment, then the card's height
changes and **no trigger re-fires to re-measure the final height**. An FB
embed's height is asynchronous and arrives in *several* `postMessage` steps — FB
reports an initial (often taller) height, the card grows, then FB **collapses to
its settled height** as its own images / video thumbnails / fonts load, which can
happen **after the hook's last fixed sweep at 1800 ms**.

The old `useMasonryRowSpan` re-measured at four fixed delays
(`[120, 400, 900, 1800]` ms) and otherwise relied on the per-card
`ResizeObserver`. Under the **16-iframe mount burst**, the RO coalesces / drops
notifications (the documented "ResizeObserver loop … undelivered notifications" —
the hook's own comment names this), so the late settle change can fire **no
trigger at all**. Result:

- **Most cards over-reserve → jaggies.** FB reports tall, the card grows, the
  span is set tall; FB then collapses *after 1800 ms* with the RO notification
  dropped → the span is **stranded at the taller height**. The cell reserves more
  than the settled content → a trailing void **inside** the cell → `dense` can't
  backfill an occupied-but-empty cell → severe, patternless raggedness. Matches
  "most cards reserve MORE than their settled content uses."
- **The odd card under-reserves → clip.** A card whose embed **grows late**
  (e.g. a video thumbnail resolving after 1800 ms) keeps its earlier, **too-short**
  span; with the card's `overflow: hidden`, the extra content is cropped → the
  column-3 "~half a text line" clip. Matches "that card reserves LESS than its
  settled content."

This is precisely the operator's hypothesis — *measuring before FB's final
postMessage height / measuring a stale height* — confirmed against the code and
the measured-stable fact. It is **not** gap math (gap is correct, §1.1), not
off-by-padding, and not the lattice (already fixed).

> Out-of-scope sibling (flagged, not actioned): if an FB embed's *own* iframe
> renders shorter/taller than the height FB **reports** (FB over/under-reporting
> in its handshake), a residual void/clip can remain *within* the white embed box
> even with a perfect span. That is FB's height handshake, addressable only via
> the FB JS SDK — which the SDK assessment in
> `FB_MASONRY_OVERLAP_AND_SDK_DIAGNOSIS-20260601-210604.md` advised against
> (weight, tracking, CSP, 350px width floor). The §5 snippet distinguishes the
> two: a **span≠box** delta is this fix; a **box≠embed-content** void is the SDK
> sibling. Re-measure after this fix lands; only chase the SDK if a box-internal
> void survives.

## 2. The fix

**`src/routes/hr/HrExhibitFlow.jsx` — `useMasonryRowSpan` only.** Replace the
four **fixed** settle delays with a **quiescence settle watcher**: poll the layout
until spans stop changing, then stop. This captures the *true final settled
height* regardless of **when** — or **whether** — FB emits an observable event.

- `applyOne` now **returns whether it changed** a card's span; `applyAll` returns
  whether **any** card changed (drives quiescence).
- A settle loop re-measures every `MASONRY_SETTLE_POLL_MS` (150 ms). Each pass
  that changes a span resets the stable counter; once spans hold steady for
  `MASONRY_SETTLE_STABLE_PASSES` (3) consecutive polls (~450 ms quiet) the loop
  stops. **Every** trigger — the FB `postMessage`, the per-card RO, nested
  iframe/img `load`, window `resize` — re-arms the watcher, so a late/silent FB
  collapse is always caught and re-measured. Bounded by
  `MASONRY_SETTLE_MAX_MS` (15 s) from mount so animated / never-settling content
  can't poll forever. Re-runs fresh on every filter/tab change (the `dep`).
- All existing triggers and the synchronous pre-paint first pass are **kept**.

**Why no reflow loop / no perf issue:** `align-items: start` + explicit card
heights mean writing `grid-row-end` never changes the measured card's own height,
and `applyOne` writes **only on change** — so a re-measure can't grow the thing it
just measured (the existing invariant, preserved). The poll is a handful of
`getBoundingClientRect` reads per pass, only during the initial settle, then it
goes idle. Common case: stops < 1 s after the embeds settle.

**Net effect:** the reserved span converges to each card's **final** rendered
height → reserved == settled for every card → cells pack tight, `dense` backfills,
columns end roughly even, no internal voids, no clip — for **all** card types
(the late-thumbnail `link` over-reserve in §1.1 is fixed by the same watcher).

## 3. Why this is non-regressing

- **One function touched** (`useMasonryRowSpan`); no CSS, no other component.
- The **lattice line** (`grid-row-end: span 360`), `pickSpan`/span variety,
  `grid-auto-flow: dense`, and the FB sizing path are **untouched**.
- The watcher only writes a span **when the measured height changed** — identical
  write semantics to before; it just keeps looking longer and stops on quiescence
  instead of at a fixed 1800 ms. Deterministic cards (YT/gallery/album/photo/
  audio/link) settle in the first pass or two and the loop stops immediately —
  same spans as before, reached the same way.
- Self-terminating + capped: no standing interval, cleaned up on unmount.

## 4. Verification done in this session

- **Live measurement** of the grid track model + 64-card census (§1.1): math
  proven sound; throttled-tab limitation documented (§1.2).
- **Edit integrity:** edits made host-direct (Edit tool → Windows path); the
  edited `useMasonryRowSpan` region re-read intact via the Read tool (balanced
  braces, no truncation; the bash/FUSE view of this 3.1k-line file is the
  documented truncated cache per CLAUDE.md §1/§9, so whole-file bash lint is
  non-informative and was not used as ground truth).
- **Isolated syntax check:** the new hook body extracted with hook stubs →
  `node --check` **PASS**, loads as a function. No new identifiers are unused
  (`MASONRY_SETTLE_MS` and its only reference were removed). Expected host lint
  baseline unchanged: **4 errors / 6 warnings**.
- **Deferred to host** (sandbox can't do reliably per CLAUDE.md §9): `npm run
  lint`, `npm run build` (workerd-blocked), `npm run deploy`, and the
  **FB-mounted incognito** live-verify (FB embeds render blank to logged-out /
  automated browsers — needs the operator's foreground eyes).

## 5. Operator measurement — before/after reserved-vs-settled deltas (the decision-rule numbers)

Run this in the **incognito** DevTools console on `weird.baby/hr` at **FORMATS →
the artifact deck**, after scrolling the panel so **all FB cards mount** and
waiting ~8 s for FB to load + settle. Run it **once on the current live site
(BEFORE)** and **again after deploying this fix (AFTER)**. It needs no app hooks —
it reads the DOM the same way this session did.

```js
(() => {
  const grid = document.querySelector('.hr-artifact-grid');
  const cs = getComputedStyle(grid);
  const track = parseFloat(cs.gridAutoRows) || 1;
  const rowGap = parseFloat(cs.rowGap) || 0;
  let over = 0, under = 0, ok = 0;
  const rows = [...grid.children].map((c, i) => {
    const box = Math.round(c.getBoundingClientRect().height);           // settled content box
    const span = parseInt((getComputedStyle(c).gridRowEnd.match(/span\s+(\d+)/) || [])[1] || '0', 10);
    const reserved = Math.round(span * track + (span - 1) * rowGap);     // px the cell reserves
    const delta = reserved - box;                                       // >14 void · <0 clip
    const kind = (c.className.match(/hr-card-(fbembed|link|youtube|photo|audio|gallery|album)/) || [,'plain'])[1];
    const iframeH = (() => { const f = c.querySelector('iframe'); return f ? Math.round(f.getBoundingClientRect().height) : null; })();
    if (delta > 16) over++; else if (delta < -1) under++; else ok++;
    return { i, kind, box, span, reserved, delta, iframeH };
  });
  console.log('track', track, 'rowGap', rowGap, '| over(void)', over, 'under(clip)', under, 'ok', ok);
  console.table(rows.filter(r => r.kind === 'fbembed'));                 // FB cards in detail
  console.table(rows.slice().sort((a,b)=>b.delta-a.delta).slice(0,6));   // worst voids
  console.table(rows.slice().sort((a,b)=>a.delta-b.delta).slice(0,6));   // worst clips
  return { over, under, ok };
})();
```

**Pass criteria (AFTER):** every card `delta ≈ 14` (= the baked gap; allow ±2 for
ceil). `over(void)` and `under(clip)` both **0** for FB cards. If a card shows
`delta ≈ 14` (span matches box) **but** still has visible white space below the
post *inside* the box, that is the FB-handshake sibling in §1.3's note —
`iframeH` < `box` — not this fix; flag it separately.

## 6. Host runbook (operator / PowerShell)

From `C:\AI\Projects\weird-baby-museum`:

```powershell
npm run lint            # expect 4 errors / 6 warnings (baseline; no new)
npm run build           # must pass (vite + rolldown + cloudflare)
npm run deploy          # vite build && wrangler deploy
```

**LIVE-VERIFY (incognito; FB iframes MUST mount):** open an incognito
`https://weird.baby/hr` → **FORMATS → the artifact deck** → **scroll the panel so
the FB cards lazy-mount** → wait ~8 s for FB to load + settle. Then:

- Run the §5 snippet → confirm `over(void)=0`, `under(clip)=0`, all FB `delta≈14`.
- By eye: columns end roughly even; **no large internal voids**; **column-3 (and
  every post) NOT clipped**; live FB embeds still render; YT/gallery/album/IG/
  coverflow/audio unchanged; span variety preserved.

> Scroll-to-mount matters: a never-scrolled / background tab never mounts the FB
> iframes (this session hit exactly that), so it measures the un-mounted case and
> reports 0 voids without testing the failing one. Verify **mounted + settled**.

**Commit (explicit paths) + push — after live-verify:**

```powershell
if (Test-Path .git\index.lock) { Remove-Item .git\index.lock }
git reset --mixed HEAD
git add src/routes/hr/HrExhibitFlow.jsx `
        docs/FB_MASONRY_SETTLE_QUIESCENCE_RUN_REPORT-20260602-001755.md
git commit -m "fix(hr): masonry settles to final FB height (quiescence watch)"
git push    # or open a PR per the CLAUDE.md workflow
```

## 7. Out of scope (untouched)

The lattice fix (`grid-row-end: span 360`); `pickSpan` / span variety;
`grid-auto-flow: dense`; the FB embed sizing (`effH`/`postedH`/`scale`/fallbacks);
the FB JS SDK question (the box-internal handshake void sibling, §1.3); YT /
gallery / album / IG / coverflow / audio; MV / export / deploy pipeline. No data
change — no `export-artifacts` needed.
