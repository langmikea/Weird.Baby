# TELEVISION FILLS THE OPENING — 2026-08-26

**Built from `067a795`, clean tree. Nothing committed, nothing pushed, nothing
deployed.** Served and looked at before Mike: **`http://localhost:5173/robots`**
→ the Portal album → LATCH.

---

## 0 · THE RULINGS

> **"I want the YT video scaled up so that none of the edges of the video are
> exposed... No black bars, pls."**
>
> **"The usable part of the video is 4:3, and I want to lose the black bars
> completely."**

And, mid-round, on what looking found:

> **"I do not want closed captions."**

---

## 1 · ITEM 1 — THE SOURCE, VERIFIED BEFORE ANYTHING WAS BUILT

**HIS READING IS RIGHT: THE LETTERBOX IS IN THE SOURCE.** `aA5oKoCRjWw` is a
16:9 file with the picture matted inside it, so filling the opening crops
YouTube's black rather than his content.

Measured on **four frames at four timestamps**, at native resolution, on the
frame images YouTube generates from the video itself:

| frame | size | left bar | right bar | picture | ratio | bars | L−R |
|---|---|---:|---:|---|---:|---:|---:|
| `maxresdefault` | 1280×720 | 166 | 166 | 948×720 | 1.3167 | 25.94% | **0** |
| `mq1` (25%) | 320×180 | 41 | 41 | 238×180 | 1.3222 | 25.62% | **0** |
| `mq2` (50%) | 320×180 | 41 | 41 | 238×180 | 1.3222 | 25.62% | **0** |
| `mq3` (75%) | 320×180 | 41 | 41 | 238×180 | 1.3222 | 25.62% | **0** |

**IT IS CENTRED TO THE PIXEL.** Left bar − right bar is **0 on every frame**.
That is the half of item 1 that could have stopped the round, and it is clean.

**THE MATTE EDGE IS A HARD EDGE, NOT A DARK FRAME.** Column means across the
boundary on `maxresdefault`: x=165 reads **4.72**, x=166 reads **168.60**. The
reading is threshold-independent from 12 upward — 12, 16, 24, 32, 40 and 56 all
return the same 166/166. It is a matte, and the picture does not fade into it.

### AND IT IS NOT EXACTLY 4:3 — 1.25% NARROWER, WHICH IS THE SAFE DIRECTION

**The picture is 1.3167 against 4:3's 1.3333.** A true 4:3 inside 16:9 would put
the matte edge at x=160; it is at x=166, six pixels further in on each side.

**THIS IS REPORTED RATHER THAN TREATED AS A STOP, AND THE REASON IS THE STOP'S
OWN REASON.** Item 1 says stop *"if it is off-centre or not 4:3 — a crop that
eats his picture is worse than bars."* The danger named there is the crop
reaching his frame. **It is measured absent, with margin:** the placement crops
**12.5%** of the frame width from each side and the matte is **12.97%** wide, so
the crop lands inside the black and stops **0.47% of the frame width short of
his picture.** The deviation is in the direction that leaves black over, never
the direction that eats picture.

**WHAT THE 1.25% COSTS IS A SLIVER OF BLACK THAT IS NEVER SEEN.** At the built
size that leftover is **3.58px each side** — and the bezel already covers the
box's edge by **14.84px on the left and 15.04px on the right**. The sliver is
behind the frame, four times over. A shortfall bigger than the bezel's own
overlap would have been visible; this one cannot be.

---

## 2 · ITEM 2 — THE FILL

**THE MECHANISM IS PLACEMENT, AND THAT WAS ESTABLISHED RATHER THAN ASSUMED.**
`object-fit` is inert on an iframe, so a wider box only changes how YouTube
letterboxes *inside* it. The player is therefore sized to the feed box's
**HEIGHT**, its width overflows, and `.tv-root`'s `overflow: hidden` and the
bezel over it do the cutting.

**A WRAPPER, NOT A RULE ON THE IFRAME.** `PortalScreen.css` owns the feed box and
sets `.ps-feed iframe { width:100%; height:100% }` — `(0,1,1)`, which outweighs
any single-class rule `Television.css` could write against the same element. So
`Television.css` sizes **`.tv-fit`**, a wrapper it owns outright, and that rule
keeps doing exactly what it says: 100% of the wrapper. **Two owners, one seam, no
specificity fight.** `!important` was reached for first — §8 says it is sometimes
the honest answer to a two-owner layout — and it was not needed.

**`aspect-ratio: 16 / 9` RATHER THAN A PERCENTAGE.** The feed box is 4:3 today,
so `width: 133.333%` computes the same number — and it would be right by
coincidence and would break silently the day the box's shape moved.
`height: 100%` plus a ratio is a statement about the PLAYER and is true at any
box.

---

## 3 · ITEM 3 — BEFORE AND AFTER, MEASURED ON THE SERVED PAGE

A/B'd by injecting the old state into the live page, which is how this
repository measures a placement. Black is computed from the hole's own
coordinates and the **measured** matte fraction, at a `.ps` of 632.79 × 506.23.

```
                 player box        video drawn      hole
BEFORE           572.61 x 429.45   572.61 x 322.09  535.55 x 424.18
AFTER            763.46 x 429.45   fills the box    535.55 x 424.18
```

| black inside the hole | before (px) | before (% of hole) | after |
|---|---:|---:|---:|
| left | 55.83 | **10.43%** | **0** |
| right | 55.63 | **10.39%** | **0** |
| top | 51.99 | **12.26%** | **0** |
| bottom | 50.10 | **11.81%** | **0** |
| **horizontal total** | **111.47** | **20.81%** | **0** |
| **vertical total** | **102.09** | **24.07%** | **0** |

**THE PRIOR ROUND MEASURED HALF OF IT.** `MUSEUM_CROP_AND_COVER_LOG-20260826.md`
§1.4 reported *"303.6 → 254.5px, 15.2% → 12.7% each side"* — those are the
**player's own letterbox, top and bottom.** The **source's** matte was putting a
further **10.4% of the hole's width of black down each side**, and nothing had
measured it. There was black on all four sides, not two.

**WHAT IS CROPPED FROM EACH SIDE, AND WHAT IT LANDS ON:**

```
cropped each side          95.43px   (12.500% of the player's width)
source black each side     99.01px   (12.969% of the player's width)
black left over each side   3.58px   -> behind the bezel, which covers 14.84 / 15.04
his picture cropped              0
```

**HELD AT PHONE WIDTH.** Re-measured at a true 375px viewport: box
339.50 × 254.63, player 452.66 × 254.63, **black 0 on all four sides**, margins
8.80 / 8.92px. The rule is a ratio, so it does not have a good width and a bad
one.

**LOOKED AT, NOT ONLY MEASURED.** Rendered captures of both states are in this
round's report; the before shows the picture floating in black on four sides, the
after fills the opening edge to edge. The Browser pane composited this session.

---

## 4 · ITEM 4 — IT HOLDS FOR THIS SOURCE, NOT FOR EVERY VIDEO

**THE PLACEMENT IS UNCONDITIONAL. WHETHER IT COSTS ANYTHING IS A PROPERTY OF THE
SOURCE.**

The rule always crops **12.5% of the player's width from each side**, and only
**70.15%** of the player's width falls inside the hole at all. For this file that
is entirely matte. **For a genuine 16:9 clip with picture to the edges it is
25% of the frame lost to the box and about 30% lost once the bezel is counted** —
and nothing would report it.

| | this source | a true 16:9 source |
|---|---|---|
| cropped by the box | 25% of the width, **all of it black** | 25% of the width, **all of it picture** |
| unseen once the bezel is counted | 29.85%, all black | **29.85% of his picture** |
| black left in the hole | none | none |

**SO A REPLACEMENT CLIP IS A MEASUREMENT, NOT A SWAP.** The finding is filed
where a future round would actually make the swap — beside `ytId` in
`portal.js` — and registered as **T-a**. The alternative was a runtime guard,
and it is not built: nothing in this tree can read a cross-origin frame's
pixels, so a guard could only re-state the fact, not check it.

---

## 5 · WHAT LOOKING FOUND, AND HIS RULING ON IT

**THE CAPTIONS.** The before state showed YouTube's captions sitting in the black
bar under the picture. Removing the bar removes their home: they land over the
bottom of the picture, and in two of four captured frames the second line was cut
by the curve of the opening. **That is intrinsic rather than a defect of this
implementation** — the caption was only readable because of the black Mike ruled
out, and no placement that fills the opening keeps both.

Reported, and **he ruled it in the round: *"I do not want closed captions."***

**IT TOOK TWO MECHANISMS AND ONLY ONE OF THEM BINDS.** `cc_load_policy: 0` is in
`TV_VARS` and is the weak half: YouTube documents `1` as *force on* and reads
anything else as **the viewer's own preference**, so a visitor with captions
switched on in their account keeps them. The half that does not depend on the
viewer is **`unloadModule("captions")`**, which needed a three-line passthrough
on `useYTPlayer`. **The passthrough is a passthrough and not a policy** — `/hr`
and `/wal` never call it, so their behaviour is unchanged to the character.

**IT REPEATS ON A TIMER, AND THAT IS THE POINT.** The module does not exist until
a video is loaded, and YouTube re-creates it on **every** `loadVideoById` — which
this component does on the wall-clock join and again on every loop, once every
1,743 seconds. A single unload on ready would read correctly and be gone by the
second reel. One guarded call every 500ms, stopping with the channel.

**VERIFIED ON A BROWSER THAT HAD CAPTIONS ON** — which is what made it a real
test rather than a green on a machine that was never going to show them. Before:
captions on screen, second line clipped. After: none, through a full reload,
latch and several minutes of playback.

---

## 6 · TWO DEFECTS OF MY OWN

**I BROKE THE PAGE AND THE PAGE SAID SO.** Adding the caption note to `TV_VARS`
appended prose to a block comment that was **already closed**, orphaning a `*/`.
Vite returned 500 on `Television.jsx`, HMR refused the reload, and `/robots`
rendered 30 elements and no text. Found by looking at the page rather than by
reading the edit — the console named the file on the first read.

**AND THE `/api/visits` 500s ARE NOT MINE.** Two errors were in the console
before this round touched anything: `POST /api/visits` needs the worker's D1
binding, which `vite dev` alone does not serve. Named here so a later round does
not go hunting for a regression that is not one.

---

## 7 · THE GATE CAUGHT THE CAPTION FIX, CORRECTLY

`provenance:gate` **FAILED** on two undeclared strings — `"captions"` and
`"cc"` — and it was right to: it is default-DENY, and every string is content
until a **named, counted** rule proves it is machinery.

**DECLARING `"cc"` AS MUSEUM CONTENT WOULD HAVE BEEN THE WRONG SHAPE.** These are
module names in Google's API. The answer the sweep provides is `SINK_ALL`, its
named list of call targets whose string arguments are machinery, and
`unloadModule` belongs there by the same logic as `postMessage` and
`addEventListener`.

**ONE ENTRY, NOT A FAMILY.** `loadModule` and the rest are deliberately not
added: the sweep's own §3 rule is that an over-broad look-away is the defect, and
a rule that swallows more than it was written for stops being a boundary.
**The look-away is counted** — `npm run provenance -- --rules` reports
**218 machinery-call** hits, up 2.

---

## 8 · GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 7 warnings — baseline, zero new** |
| `npm run build` | green |
| `npm run provenance:gate` | **PASS** (after the `SINK_ALL` entry above) |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** |
| `npm run instory:gate` | **PASS** |
| `npm run docs:numbers:gate` | **PASS** |

**WHAT WAS NOT EXERCISED:** the launch build. Nothing here is stage-conditional —
one CSS rule, one wrapper element, one player parameter and a hook passthrough —
but it is stated rather than implied.

**THE DEV SERVER ON 5173 WAS NOT STARTED BY THIS ROUND AND WAS NOT KILLED BY IT.**
It has been running since 16:25:40 today, from the wing-names round — the exact
"left running" hazard `CLAUDE.md`'s third packet recorded. It is Mike's machine
and his process to stop; this round used it rather than adding a second one.
