# THE PROBE, THE EMPTY PLAYER, AND THE COVER
2026-08-12 · write packet · **not committed, not pushed, not deployed**
HEAD at start: `e0b68de`. Site live in LAUNCH stage.

---

## A — THE SCROLL. NO THIRD THEORY.

**No cause is proposed and no fix shipped.** Two theories have failed; the
instrument is the deliverable.

### A1 — `tools/scroll-probe.js`

Paste-into-console, one line out, measures before it touches anything. It
reports `scrollY`, `max` computed **both** ways (`innerHeight` and
`clientHeight` — they differ by the scrollbar at fractional zoom), `scrollHeight`
against the **fractional** `getBoundingClientRect().height`, `devicePixelRatio`,
the **visual viewport** block, computed overflow/snap/anchor/padding/behavior on
`html` and `body`, **every scrollable ancestor innermost-first**, the snap-target
count, and `scrollTo(0,0)` sampled at three times — immediately, after two
frames, after half a second.

**That last triple is the one that splits the remaining possibilities.** A
`scrollY` that is 0 immediately and non-zero later is *something putting it
back*. One that never reaches 0 is a different bug. Nobody has distinguished
those yet.

### A2 — the harness cannot do this, and there is no substitute here

An iframe's layout viewport rounds to whole pixels (`innerHeight` came back
`820`, never fractional), so the fractional-zoom condition **cannot exist** in
the lap rig. Checked for a real substitute: **no puppeteer, no playwright, not
resolvable** — and the browser driver cannot set page zoom (its own docs say the
zoom shortcuts are unsupported and error). CDP `Emulation.setDeviceMetricsOverride`
with a fractional `deviceScaleFactor` would do it and is not reachable from here.

**So there is no way to reproduce it from this side, and the A1 probe on Mike's
own window is the whole answer.** Stated plainly rather than worked around.

### A3 — the visual viewport, and which one `scrollY` is measured against

**`window.scrollY` is an offset in the LAYOUT viewport.** `visualViewport.offsetTop`
is the visual viewport's offset *inside* the layout viewport, and it is non-zero
only for pinch-zoom and the on-screen keyboard. **Page zoom is not supposed to
touch it** — it resizes the layout viewport instead.

Measured here (100%, dpr **2.5**): `scale: 1`, `offsetTop: 0`, `pageTop: 0`, and
`visualViewport.pageTop === window.scrollY` exactly.

**That is the check neither of us had run, and it is now in the probe.** If
Mike's stuck page prints `scale ≠ 1` or `offsetTop ≠ 0`, every measurement either
of us has taken was against the wrong box and the 0.111 lives there. If it prints
`1 / 0`, the visual viewport is eliminated and the answer is in `scrollers` or in
the three-sample `scrollTo` result.

### A4 — nothing speculative shipped

---

## B — THE EMPTY PLAYER

**`useYTPlayer` now takes `hasVideo`**, and the eager build returns early without
it. `hasVideo` is **derived from the spine**, not passed by hand — the day a
track gets a `ytId` the player returns by itself:

```js
const wingHasVideo = useMemo(() => (SPINE||[]).some(al =>
  (al.tracks||[]).some(t => (t.videos||[]).some(v => v && v.ytId))), [SPINE]);
```

(Named `wingHasVideo` at the call site: `hasVideo` already exists in that scope
meaning *the currently selected track has one*. The build caught the collision.)

**B2 — the mobile first-click fix is kept where it can matter.** The condition is
"this wing has a video", not "the visitor pressed something", so on `/wal` the
player is still built eagerly on mount exactly as before. On a wing with no video
there is no first click to lose.

### B3 — measured, before and after, launch build

| route | BEFORE | AFTER |
|---|---|---|
| `/` `/booth` `/shop` `/robots` | fonts only | fonts only |
| **`/foundation`** | fonts + **www.youtube.com**, YT API, **1 iframe** | **fonts only, no YT API, 0 iframes** |
| **`/wb`** | fonts + **www.youtube.com**, YT API, **1 iframe** | **fonts only, no YT API, 0 iframes** |
| `/wal` | fonts + www.youtube.com, 1 iframe | unchanged — **correct**, it holds videos |

`/foundation` and `/wb` make no request to youtube.com, and therefore none to
doubleclick.net, which is reached only from inside the embed.

---

## C — THE BOOTH. THREE CLAUSES, NOT TWO.

Mike's words; only what was factually wrong was touched.

**C1 — "rooms with music" was wrong in BOTH directions, and B only fixed one.**
Before B, `/foundation` had no music and loaded the player. After B it does not —
but `/wb` **has** music (six recordings) and does **not** load YouTube, because
they are our own audio files. The sentence still over-claimed. The true
distinction is video, not music.

> **BEFORE:** "The rooms with music in them load YouTube's player when the room
> loads, before you press anything."
> **AFTER:** "The rooms with video in them load YouTube's player when the room
> loads, before you press anything — the rooms with only our own recordings in
> them do not, and play from this site."

**C2 — Facebook.** The embed is `HrExhibitFlow.jsx`, i.e. `/hr`, behind the
password. Measured: **nothing at launch fetches Facebook.**

> **BEFORE:** "And one exhibit carries posts embedded from Facebook, which arrive
> as they scroll into view — later than the player, and still nothing you
> pressed."
> **AFTER:** *(deleted)*

**C3 — the clause B changed the truth of, found by measuring.**

> **BEFORE:** "Google, YouTube and Facebook each know you turned up, and they are
> the whole of the outside."
> **AFTER:** "Google and YouTube know you turned up, and they are the whole of
> the outside."

**Unchanged and re-verified:** "This site sets none [cookies]" — no `Set-Cookie`
on a plain visit to `/` or `/foundation`. "The typefaces are served by Google" —
every route. "No analytics, no advertising and no tracking pixel anywhere in this
site" — now true without argument on six of seven routes; on `/wal` the embed
still reaches Google's ad host, which is the residue B4 left with Mike.

The register row was re-declared VERIFIED with the measurement carried into its
source, and the stale row pruned.

---

## D — THE COVER

| | dimensions | format | bytes | sha256 |
|---|---|---|---|---|
| supplied ALT master | 4506×4506 | PNG 32bpp ARGB | 8,138,653 | `8d359007f17259c9…6bd2a1` |
| previous `vol1-cover.png` | 1200×1200 | PNG 24bpp | 214,002 | `2c030d2d021ceabc…be24cc3` |
| **placed** | **1200×1200** | PNG 32bpp ARGB | **1,375,277** | `8bb0043770eab7a2…40917` |

Resampled to the 1200×1200 the other sleeves ship at. **It is 6× the old file**
— vinyl grooves are continuous-tone and PNG compresses them badly. Same image as
JPEG would be roughly a tenth of that but changes the format convention and the
ref, so it is reported rather than done.

**D2 — every surface:** one declaration, `weird-baby.js:175` `art:`. It renders
as the coverflow sleeve **and** as the viewer poster on `/wb` — three `<img>` at
`1200×1200` measured on the launch build.

**D3 — what needs Mike:** the asset-table row carries `verdict: null` and the
declaration's text reading is marked **NOT READ BY MIKE**. Ops can see three runs
of lettering — *"The Best of"* red at the top, *"Weird.Baby"* in the outline face
across the label well, *"Vol. 1"* red at the foot. **Nothing was written into
either field.**

---

## GATES

| gate | result |
|---|---|
| lint | **9 errors / 8 warnings** — see below |
| build · launch build | green · green |
| provenance:gate | **PASS** — 0 undeclared, 0 stale (1 declared, 1 pruned) |
| reveal:check · parity · instory | PASS · PASS · PASS |
| assets:orphans | 13 (unchanged — the cover replaced in place) |
| reveal:day | nothing to move |
| lap @ 1280px launch | 7 routes · `snap: none` · `anchor: none` · scrollY 0 · 0 broken · 0 console errors |

**LINT WENT DOWN, NOT UP: 11/9 → 9/8.** The two `Cannot access variable before it
is declared` errors in `Exhibit.jsx` were raised by the *unguarded* eager effect
and went with it when it gained its condition. That is a real reduction, not a
suppression — but **CLAUDE.md still documents 11/9 as the baseline**, and a
tripwire that publishes the wrong number disables itself (the A1/2026-08-04
lesson, in the other direction). The number needs updating there.

---

## WHAT I COULD NOT DETERMINE

- **The scroll cause.** No reproduction is possible from this side: iframe
  viewports round to integers, no headless browser is installed, and page zoom
  cannot be driven. The probe on Mike's window is the answer.
- Whether `/wal`'s embed is acceptable, which is B4 and remains his.

## WHAT NEEDS MIKE

1. **Run `tools/scroll-probe.js`** on the stuck page at 90% and paste the one
   line back.
2. **`verdict` and the text reading** on the new cover.
3. **`/wal` still reaches Google's ad host** — the one route where the embed is
   legitimate. B4's options stand.
