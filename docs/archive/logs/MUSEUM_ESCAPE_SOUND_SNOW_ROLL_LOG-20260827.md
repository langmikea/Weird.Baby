# THE ESCAPE, THE SOUND, THE SNOW AND THE ROLL — 2026-08-27 (seventh packet)

**Built from `8d32319` on the same day's uncommitted work. Nothing committed,
nothing pushed, nothing deployed.** His four, and the question he attached to
them. **The question was answered before a line was changed** — that half is
`docs/MUSEUM_ESCAPE_AND_BEZEL_FINDING-20260827.md`, written first and on disk.

---

## 0 · THE QUESTION HE ASKED TO BE ANSWERED FIRST

> **"I can supply the VIIIp ZOOM image without a bezel, and with bleed if that
> helps."**

**IT IS A CLIPPING DEFECT, AND HIS IMAGE FIXES A DIFFERENT ONE. Both are real
and neither substitutes for the other. YES to the image.**

The full measurement is in the finding document. The short of it: the frame is a
rounded silhouette on a transparent ground, the museum was cutting the picture
to its BOUNDING BOX, and everything the silhouette does not cover was
uncovered — which is a code fault and not an artwork one. What his image fixes
is that **his close-up plate has the frame composited into it**, so any correct
roll or tear slides a second frame against the museum's.

---

## 1 · THE ESCAPE — MEASURED, PHOTOGRAPHED, CLOSED

### THE PROBE, BECAUSE READING THE CODE SAID IT WAS ALREADY FIXED

The paint order reads correct and IS correct: `.ps-tear` is inside `.ps-feed`
at `z-index:1`, `.ps-feed` is `z-index:0` and a stacking context, `.ps-bezel` is
`z-index:1` above it and opaque. Every previous round's claim about that holds.

So a plain red band was put inside the feed at the tear's own coordinates —
same parent, same z-index, same full-width geometry — and photographed on the
served page:

| probe | what was visible OUTSIDE the monitor |
|---|---|
| band at 45%, channel 3 | a red stub on the black ground past the frame's right edge |
| band at 45%, channel 4 | the same stub, same place |
| band at the top of the feed | **a full-width red bar above the set** |
| band at the bottom of the feed | **a full-width red bar below the set** |

### THE CAUSE, OFF THE PLATE'S OWN ALPHA

Not-fully-opaque outer margin, per row, on `MGK-TWIN_MONITOR_SCREEN_BEZEL.png`:

| row | left | right |
|---|---|---|
| 10 | **980** | **903** |
| 200 | 25 | 37 |
| 1200 | 1 | 10 |
| 2200 | 31 | 42 |
| 2390 | **1014** | **944** |

All four corners are alpha 0. Row 0, rows 2398–2399 and columns 2991–2999 are
transparent across their whole length. **`.ps`'s `overflow:hidden` clips to the
plate's rectangle; the plate draws a rounded CRT.** At rest the uncovered region
is black on black and nobody notices. The instant something bright moves through
it, it is outside the set.

**`MC-c` IS THE SAME DEFECT, SEEN THROUGH ONE SCANLINE.** That row measured the
right-edge margin at mid-height — 9 units, ~2.7px — and asked Mike whether that
column belonged to the picture or to the room. **The question was too small by
two orders of magnitude**, and it is not a taste call: what is outside the
monitor's outline is neither. `MC-c` closes.

### THE FIX — THE FRAME'S OWN SHAPE, COMPUTED NOT CHOSEN

The transparent ground was flood-filled inward from the border to give
frame ∪ opening; the opening's bounding box was then grown on each side for as
long as the whole edge line stayed inside:

```
opening bbox   x  231 .. 2761   y  207 .. 2207
SAFE RECT      x  102 .. 2896   y   46 .. 2336     2795 x 2291
```

Declared as `latch.bezel.safe` in `portal.js`, beside `feed`, so it is
re-measured with the plate rather than typed twice. `PortalScreen` converts it
into the feed box's own percentage space and applies it as `clip-path: inset()`,
which is one rule that answers four different boxes.

**IT CANNOT COST A VISIBLE PIXEL.** Everything between the rectangle and the
silhouette is opaque frame on all four sides and the whole of each rounded
corner.

**VERIFIED SERVED, EVERY KIND:**

| channel | feed box | clip |
|---|---|---|
| 3 — machine, canvas 4:3 | −3.33%, 106.67% | `inset(1.91667% 6.34375% 2.625% 6.3125%)` |
| 4 — machine, `exact` | 0%, 100% | `inset(1.91667% 3.43333% 2.625% 3.4%)` |
| 1 — television, feed 4:3 | 4.656%, 90.489% | **`inset(0%)`** |

**Television, the test card and TERMINAL.EXE clamp to zero on all four sides** —
their box was already inside the safe rectangle, which is the arithmetic saying
this was never their defect. Re-photographed after: the top and bottom bars are
gone entirely and the mid-band stops at the opening on both edges.

---

## 2 · THE SOUND — COVERED IS NOT OFF

**MIKE: "Sound from VIIIp is heard when on non-VIIIp channels. Fix pls."**

**THE RUNNING IS HIS OWN RULING AND IS NOT UNDONE.** The frame stays mounted for
the whole visit; what was wrong is that a machine nobody is watching was still
audible over the television.

**FOUR VOICES, NOT ONE.** `FX_AC` (the sound shim), `radioAC` (the radio band),
`sgAC` (Snow Globe's tune) and `currentAudio` (the DFPlayer's own element). The
contexts are **suspended** — a flag alone stops the next voice and leaves a hum
and a looping static already sounding — and the element is **muted rather than
paused**, so a track that was playing is still playing when the channel returns.

**THE GATE IS AT `FX_ctx()`, WHICH IS THE CHOKEPOINT THE SHIM ALREADY HAS.**
Every tone and noise burst goes through it and every caller already handles a
null return, because a browser that refuses an AudioContext returns exactly
that. Muting therefore costs no new branch at forty-odd call sites — the same
argument `unitPowered` won at that function two months ago. **The null comes
before the resume**, or the next tone the machine plays to itself would undo the
suspend.

`{wb:"portal-audio", on}` — the fourth word of the museum/twin contract, beside
`portal-control`, `portal-view` and `portal-power`. Declared in the register.

**VERIFIED ON A FRESH LOAD, ONE DOCUMENT THROUGHOUT:**

| | AudioContext | muted | uptime |
|---|---|---|---|
| opened on CH3 | running | no | 3.0s |
| → television | **suspended** | **yes** | 6.0s |
| → CH4 | running | no | 9.0s |

**The uptime climbs monotonically across both switches**, so the unit never
reloaded and never stopped — it stopped being heard, which is the whole
distinction.

---

## 3 · SNOW BETWEEN CHANNELS

**MIKE: "When changing channels go to noise instead of black during the
transition."**

**IT IS TWO DIFFERENT WAITS AND A FIXED BURST WOULD HAVE COVERED ONLY ONE.**
Switching to the machine or the test card is instant — the machine has been
mounted the whole visit and the card is drawn — so the black there is one or two
frames. **Television is seconds**: a player has to be built and has to join a
video mid-broadcast.

So it is a floor and a ceiling: **at least 380ms on every change**, and on
television until the set is actually PLAYING or 4s, whichever is first. The
ceiling is not a guess about speed — **it is the refusal path.** A browser that
blocks autoplay may never reach PLAYING, and snow for ever is worse than the
black it replaced. `Television` already watches for PLAYING for its own reasons;
it now says so.

**DRAWN, NOT AN IMAGE.** A `<canvas>` of monochrome noise repainted every
frame — no repeat to spot at any size, which a tiled texture cannot promise.

> **[SUPERSEDED THE SAME DAY — SEE §8.]** This shipped as a fixed **160 × 120**
> buffer stretched to the picture and held hard-edged by
> `image-rendering:pixelated`, on the reasoning that a small buffer gives a
> tube's grain rather than the visitor's pixel pitch. **That reasoning was
> wrong and Mike saw it at once** — *"much too pixelated and coarse. Does not
> look at all analog."* At his viewport every grain measured **6.57 × 7.01 CSS
> px, 13.2 × 14.0 device pixels.** The buffer is the element's own CSS-pixel
> size now. **The claim above is left standing rather than rewritten**, because
> the round said it and §8 is what corrected it.

**PHOTOGRAPHED SERVED:** full-screen snow filling the opening, cut by the
frame's own curve, nothing outside it.

---

## 4 · THE ROLL — TWO CAUSES, AND NEITHER WAS THE AMPLITUDE

**MIKE: "Vertical jitter looks crummy, and is also extending past the bezel."**

The second half is §1 and is closed. The first half measured as two things:

1. **IT EASED IN.** `fg-roll` put `transition:transform .10s linear` on the group
   and THEN set the transform, so a 6–15px displacement was tweened over a tenth
   of a second **in both directions**. A vertical hold does not ease — it loses
   lock between one field and the next. What he was watching was a photograph
   sliding.
2. **IT WENT STRAIGHT BACK TO ZERO.** A set that has lost lock hunts: it catches
   about half of what it lost, then settles.

**AND ONE THE DRAG INTRODUCED.** The magnitude was 6–15 **px** against a stage
the visitor can now drag to 0.35 of the fit, so the slip got proportionally
three times bigger as the monitor got smaller — past the plate's own bleed, at
which point his cut edge enters the opening. It is **0.75%–1.85% of the stage**
now, which is the same 6–15px at the default size and the same slip at every
other. Same correction the tear was given this morning, same reason.

**MEASURED AFTER, THROUGH the machine's own displacement report:**

| step | dy | class | transition |
|---|---|---|---|
| lock lost | **+11** | `fg-snap` | **0s — it jumps** |
| the hunt | **+5** | `fg-roll` | 0.1s |
| settled | **0** | `fg-roll` | 0.1s |

The controls ride every step, not just the first — `Portal_Jit_Post` is called
at each stage, which is T7 kept whole.

### THE BLANKING BAR WAS BUILT AND REMOVED, AND THAT IS REPORTED RATHER THAN HIDDEN

A rolling set shows the frame blanking bar at the seam, and it was built:
`#feedroll`, on the feed rect, riding the group. **Served and photographed, it
is invisible by construction at the size the Portal opens at** — the strip a
15px roll vacates is inside the plate's own overscan, so the bar landed at
museum y 72..87 with the opening starting at 72.6, leaving about three pixels of
visible band at the centre and nothing at the edges. **A visual nobody can see
is the dead control Doctrine 11's corollary forbids, wearing a different hat**,
so it is gone rather than enlarged into decoration.

**WHAT A VISIBLE BAR NEEDS IS THE PICTURE TO WRAP** — the bottom of the field
re-entering at the top — and that is a build rather than a defect fix. Row
**`MH-b`**, one word.

---

## 5 · DEFECTS OF MY OWN

- **I WROTE `provenance/register.json` BACK AT INDENT 2 AND IT IS AN INDENT-1
  FILE.** The diff came back **16,112 insertions against 15,859 deletions** for
  two added rows. Caught by reading `git diff --stat` rather than by trusting
  the gate, which passed either way. Re-serialised at indent 1; the diff is now
  the round's own changes. **A formatting round-trip is invisible to every gate
  in this tree** — none of them reads whitespace — and it would have landed in a
  commit as a 32,000-line diff nobody could review.
- **A BACKTICK IN A DOUBLE-QUOTED SHELL STRING RAN AS A COMMAND.** `` `latch.bezel.safe` ``
  inside a register description came back as *"command not found"* and the words
  vanished from the row it was written into. Caught by reading the row back.
  Rewritten from a script file rather than from the command line. **Same class as
  the heredoc backslash of 2026-08-26 and the same lesson: check the text on
  disk, never the text in the thing that wrote it.**

---

## 6 · GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 7 warnings — baseline, zero new** |
| `npm run build` · `build:launch` | green · green |
| `npm run provenance:gate` | **PASS** — 2 added (`{}%`, `portal-audio`) |
| `npm run reveal:check` | **PASS** (exit 0) |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** — 21 strings read, 0 findings |
| `npm run docs:numbers:gate` | **PASS** — 11 claims in 8 documents |
| `npm run reveal:day` | nothing to move |

---

## 7 · WHAT IS OPEN AFTER THIS

- **`MC-c` CLOSES.** It asked about 2.7px; the answer was the whole silhouette
  and it is fixed rather than ruled on.
- **NEW `MH-a`** — his bezel-less zoom plate with bleed. **Asked for**, with the
  measurement of what it fixes and what it does not. It also retires `exact`.
- **NEW `MH-b`** — whether the roll should wrap so the blanking bar can exist.
- **`MF-a`** · **`MG-a`** · **`MD-c`** · **`MD-d`** · **`MD-b`** · **`MD-a`** ·
  **`ME-b`** — unchanged.

---

## 8 · ADDENDUM — THE SNOW WAS TOO COARSE, AND THE HOUSE HAD ALREADY SAID SO

**MIKE, on review: "Otherwise, good!" and then — "The noise is much too
pixelated and coarse. Does not look at all analog."**

### WHAT IT WAS MADE OF, AND AT WHAT SCALE — REPORTED BEFORE IT WAS CHANGED

A **`<canvas>`**, not CSS, not an image, not a shader. A fixed **160 x 120**
buffer of uniform monochrome noise, repainted every frame on
`requestAnimationFrame`, stretched to the whole picture and held hard-edged by
`image-rendering: pixelated`.

**MEASURED AT HIS OWN VIEWPORT** — 1920 x 841, device pixel ratio 2, feed box
1052 x 842:

| | |
|---|---|
| buffer | 160 x 120 |
| grain, CSS pixels | **6.57 x 7.01** |
| grain, REAL device pixels | **13.15 x 14.03** |

**Fourteen device pixels across.** He is not describing a preference; he is
describing a mosaic.

### THE PRECEDENT EXISTED AND THE FIRST CUT WAS COARSER THAN THE VERSION IT REJECTED

**`twin.html`'s own snow plane is 420 x 336 and its comment says why:** *"420x336
keeps the grain fine when it is blown up to a full-width stage - at 200x160 each
'grain' landed about 5px across and read as blocks."* **The museum's first cut
was 160 x 120 — smaller than the size that document had already thrown out.**
That is the cost of a new surface re-deriving a number the house has paid for.

**AND THE SCANLINES ARE THE SIZE THAT SETTLES IT.** The stage's tube texture is
`repeating-linear-gradient(0deg, … 0 1px, transparent 1px 3px)` — **a 3px pitch
in real CSS pixels, unscaled** — and the controls carry the same at 2px. That is
the house's grain vocabulary, and noise has to be FINER than the line structure
it sits under or the picture reads as two grids fighting.

### WHAT IT IS NOW

**The buffer is the element's own CSS-pixel size**, re-taken when the box
changes, so the grain is one CSS pixel at every monitor size and dragging the
frame changes how much noise there is rather than how big a grain is.

| | before | after |
|---|---|---|
| buffer at his frame | 160 x 120 | **1122 x 842** |
| grain, CSS px | 6.57 x 7.01 | **1.000 x 0.999** |
| grain, device px | 13.15 x 14.03 | **2.00 x 2.00** |
| `image-rendering` | `pixelated` | **`auto`** |

**`pixelated` IS STRUCK, AND THAT IS THE POINT RATHER THAN A TIDY-UP.** With the
buffer at CSS size, a 2x display upscales each grain to a 2x2 block; hard-edged
that is a square again, smoothed it is film grain. The rule was only ever right
because the buffer was small, which was the defect.

**THE HORIZONTAL SMEAR IS THE OTHER HALF OF "ANALOG".** A tube's beam scans
across, so its noise is correlated ALONG a line and independent between lines.
Each pixel is three parts fresh noise to one part the pixel to its left — one
shift and one add — and it is what separates snow from digital salt-and-pepper.

### THE CEILING IS A MEASUREMENT, NOT A GUESS

Benchmarked on his machine, at his frame, with the generator that shipped:

| buffer | grain | ms/frame |
|---|---|---|
| 2104 x 1684 (one DEVICE pixel) | 1 device px | **15.01** — against a 16.7ms budget |
| **1122 x 842 (one CSS pixel)** | 2 device px | **6.11** |
| 390 x 312 (a phone's frame) | 2 device px | **0.74** |
| 1052 x 842 with `Math.random` | — | 9.77 against 6.62 |

**The full device-pixel version eats the whole frame budget for a grain nobody
can resolve**, so the buffer is CSS-sized and capped at 1.2M pixels; above that
the grain grows past one pixel instead of the frame rate collapsing. `Math.random`
is 1.5x the cost of an inline xorshift at this call count, which is why it is
not used. **The cost is proportional to the area, so a phone pays for a phone.**

### FLAGGED, NOT CHANGED

**`twin.html`'s own noise floor is still 420 x 336 with `pixelated`** — about
**2.6 CSS px** of grain at the twin's stage, which is coarser than the 3px
scanline pitch it sits under. It is a faint overlay at the feed's weather
opacity rather than a full-screen picture, **and he has said he likes the twin's
look**, so nothing was touched. The same arithmetic is here if he ever reads it
as blocks.

### GATES, RE-RUN WHOLE

lint **9 errors / 7 warnings — baseline, zero new** · `build` · `build:launch` ·
`provenance:gate` · `reveal:check` · `parity:gate` · `instory:gate` ·
`docs:numbers:gate` — all green · `reveal:day` nothing to move.

**Re-verified served after the change, on a fresh load:** mute on television and
back on the machine with uptime climbing **3.0 → 6.0 → 9.0s** across two channel
changes (one document, never reloaded), the clip still
`inset(1.91667% 3.43333% 2.625% 3.4%)` on channel 4, and the snow coming down
after its burst.
