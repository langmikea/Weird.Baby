# THE CURSOR, THE BARREL, CH4's ZOOM AND THE GRIP — 2026-08-27 (third packet)

**Built from `8d32319` on the same day's uncommitted work. Nothing committed,
nothing pushed, nothing deployed.** Mike reviewed the second packet served —
**"NICE!!!"** — and ruled four things. Two of them said *inspect first*; both
investigations are §1 and §4 below and both were done before a line changed.

---

## 1 · THE BARREL — INSPECTED BEFORE ANYTHING WAS TOUCHED

**MIKE: "The onscreen controls have no effect applied to them at all from what I
can see. Inspect and advise."**

### WHAT WAS ACTUALLY HAPPENING

Measured on the served page, a 1000 × 800 frame, television's five controls:

| | |
|---|---|
| the ink WAS moving | up to **12.33px** at the `[X]` |
| any button reshaped? | **no — width and height changed by 0.000 on all five** |
| tilt | **0°** |
| across the whole group | 9.27px of spread, 3.87px of tilt |

**SO: THE INK WAS MOVING AND HE COULD NOT SEE IT, FOR TWO COMPOUNDING REASONS.**

1. **A translation is not a distortion.** Every key stayed a perfect
   axis-aligned square and simply sat a few pixels further out. Nothing bent,
   nothing leaned, nothing changed size. There was no *effect* to see because
   the only thing applied was an offset.
2. **The group is entirely inside one quadrant** — the lower right — so a radial
   field gives it a nearly constant gradient. All five keys moved the same
   direction by almost the same amount. The eye reads that as *the group sits
   very slightly further out*, which is indistinguishable from nothing.

He is right, and the measurement says exactly why. **The advice was: the ink
moves, but what it does is not a warp.**

### WHAT IT DOES NOW

**THE MEAN DISPLACEMENT IS SUBTRACTED AND ONLY THE RESIDUAL IS APPLIED**, which
is the change that makes the rest possible. The uniform part was doing nothing
the eye could read AND was the part that would relocate the group off the
coordinates the twin measured it into (`--strip-left`, `--grp-top`, S4's fifth
position). With it gone the coefficient can rise a long way while the group's
centre stays exactly where it was placed.

**AND EACH KEY NOW TILTS AND SHRINKS**, which is what a lens does to a small
object off its axis — the shear term of the same field, and the falloff in
magnification. Measured after the cut, same frame, same five controls:

| control | translate | tilt | scale | its own box grew |
|---|---|---|---|---|
| channel 1 | −8.42, −3.56 | **1.20°** | 0.984 | 0.23px |
| channel 2 | −5.77, −2.52 | **2.51°** | 0.982 | 1.25px |
| channel 3 | −1.88, −0.74 | **3.82°** | 0.978 | 2.13px |
| channel 4 | +3.88, +1.78 | **5.12°** | 0.972 | 2.88px |
| `[X]` | +12.19, +5.04 | **6.43°** | 0.965 | 3.50px |

**Every button is now reshaped** — against 0.000 before — and the row leans
progressively by **5.2° end to end** while bowing **8.6px** across itself.

### THE POSITIONAL TERM HAD TO BE HELD BACK, AND THAT IS A REAL FINDING

The first pass at making it visible set the bow coefficient to 0.34 and measured
**70.05px of spread along the strip against 29.24px across it**. The bow was
right; the spread was not. Five keys that exactly fill a 311px box cannot fan out
by 70px without becoming a different object — and the 2×2 above shares that box's
edge *by arithmetic*, which is the twin's own geometry. **A lens bows a row of
keys; it does not pull them apart.** The position now carries the bow only, and
the warp a visitor reads is the tilt and the scale, which cost no layout at all.

### HIS INVARIANT IS KEPT, AND IT WAS PROVED RATHER THAN ASSERTED

*"Nothing may move out from under his finger."* Every part of the bend is a
`transform`, so hit testing travels with the ink — the opposite of a CSS
`filter`, which moves pixels and leaves the hit area behind. **Measured:
`elementFromPoint` at each warped key's own visual centre returns that key, five
of five.**

---

## 2 · THE CURSOR LANDS ON THE CHANGEABLE HALF

**MIKE: "Scroll to the CHANGEABLE part of the line (not the label). Scroll to
READY (not to RUN)."**

**THE FIRST CUT CONTRADICTED ITS OWN ARGUMENT.** The whole case for having no
underlines or asterisks is that *a cursor which can only stand on a changeable
field IS the mark* — and then it stood on `RUN`, the one half of that row that
never changes. It marked the name of the thing instead of the thing.

**AND THE AERIAL WAS ALREADY RIGHT, WHICH IS THE PROOF OF THE RULE.** Its four
digits are values with no legend of their own, and the cursor has always
inverted the digit. The other three rows now behave the way that one already did.

**MEASURED:** with the cursor on the RUN row, `READY` computes
`background-color: rgb(220, 217, 210)` — the screen's one ink — and `RUN`
computes `rgba(0, 0, 0, 0)`. The label brightens to full and does not invert.

---

## 3 · CHANNEL 4 GETS ITS ZOOM BACK, AND STAYS LIVE

**MIKE: "Channel 4 is showing me the content that is to live on channel 3
(unzoomed front and top views) instead of the zoomed version."**

### THE INSTRUCTION OPS ACTED ON WAS OPS' PARAPHRASE, NOT HIS WORDS

The brief said *"should show EXACTLY what CH3 shows"* and Ops read **EXACTLY** as
*identical*. He meant *responsive, the way CH3 is* — and **his own next sentence
was there to be read**: *"They are just two zooms of the same unit."* Two zooms
are not one picture. The defect being fixed was a channel that could not answer a
press; the fix threw away the framing along with the photograph, and the framing
was never the complaint.

**THE HALF OF THAT READING THAT WAS RIGHT STILL STANDS:** a static photograph is
the wrong thing for this channel. Channel 4 is the live twin — same `src`, same
preset, same machine — at its own framing.

### THE NUMBER IS MEASURED OFF THE PLATE IT REPLACES

`MGK-TWIN_MONITOR_CLOSE_UP.png` and the family shot are both 3000 × 2400
photographs of the same unit, so the zoom is the ratio of one feature between
them. The top window's own glass:

| | close-up | family shot | ratio |
|---|---|---|---|
| at y = 600 | 1014px | 324px | **3.13×** |
| at y = 840 | 981px | 297px | **3.30×** |

So the plate was about a **3.2×** crop, and that is what this is.

**THE CENTRE IS AN OPS CHOICE AND IS STATED AS ONE.** The plate frames the window
a little right of its own centre — a photographer's framing — and recovering that
offset from luminance was not reliable enough to assert, so the zoom centres on
the number the museum already owns: `#maskTop`'s declared centroid, 70.6% /
31.83%. One look moves it.

### IT IS LAYOUT, NOT `transform: scale()`, AND THAT IS WHY IT IS SHARP

A transform would rasterise what is there and magnify its pixels — **exactly the
failure the top-screen enlargement was reverted for this morning.** Giving the
iframe a genuinely larger BOX makes the twin lay out at that size.

**MEASURED ON THE SERVED PAGE:**

| | |
|---|---|
| feed box | 1066.7 × 800 |
| the zoomed slip box | 3413.3 × 2560 — **exactly 3.200×** |
| the twin's own stage inside it | 3398 × 2718 — real layout, not a scaled bitmap |
| the child | `IFRAME /robots/twin.html?user=1&preset=standard` — the live machine |
| `unitPowered` | **true** |
| the top glass on screen | **370.4 × 180.1**, against **114.66 × 55.75** on channel 3 |

**AND THE CENTRING LANDS EXACTLY.** Canvas fraction 0.706 falls at 533.3px in a
feed box whose centre is 533.35; 0.3183 falls at 400.0 against a centre of 400.0.

**ONE HONEST CAVEAT, THE SAME ONE AS THIS MORNING'S REVERT.** The emulator's
canvas is still 384 × 192 — channel 4 shows the machine's glass 3.2× larger, but
it is the same pixels drawn larger, not more of them. It is a closer look at the
unit, not a fix for `MD-a`.

---

## 4 · THE DRAG-RESIZE — FOUND, AND IT WAS NOT LOST WHERE HE THOUGHT

**MIKE: "Changing the browser zoom makes the video effects scale, but nothing
else. I seem to have lost the ability to drag size the monitor itself, which
would solve some problems."**

### IT EXISTED, IT STILL EXISTS, AND IT HAS BEEN INERT SINCE 2026-08-22

**DID IT EVER EXIST?** Yes. `Portal_Grip_In()` in `twin.html`, built at
**`fc4cc80`** to his own T3 ask: *"make the monitor CORNER-DRAGGABLE to scale (a
grab handle at the corner, drag = resize, session-persist the result; the dial
can remain as the fallback)."*

**WHICH COMMIT REMOVED IT, AND WAS IT DELIBERATE?** Neither — **nothing removed
it.** `git log -S "Framed_Fit"` returns two commits: **`efc379f`, 2026-08-22,
"The Portal published; Record 005's claim made true"**, which introduced
`Framed_Fit()`, and `b56cc0e`, which touched it again. **`b56cc0e` — the 4:3 crop,
and the obvious suspect — is not the cause.** The rule that disables the drag is
byte-identical in both commits and at HEAD:

```
body.framed #unitstage{max-width:none!important;width:100%!important;…}
```

**AND IT WAS DELIBERATE, WITH THE REASON WRITTEN AT THE SITE ON THE DAY:**

> *"!important because the SIZE DIAL writes its width inline: framed, the overlay
> is the thing that decides how big the Portal is, and a picture the visitor can
> resize underneath a frame that cannot resize with it would never register."*

**MEASURED IN A FRAMED TWIN BEFORE ANYTHING WAS BUILT** — the probe that turns
this from a code reading into a finding:

| | |
|---|---|
| `body.framed` | true |
| `#portalgrip` in the DOM | **yes, `display:block`, `opacity:.34`** |
| `Portal_Size_Set` runs when dragged | **yes** |
| stage before / at 140vh / at 50vh | **1185 × 948 / 1185 × 948 / 1185 × 948** |

**So he was pulling on a control that was drawn, visible, and wired to a setter
that ran — and moved nothing.** Not lost: inert, for five days, with nothing
saying so.

### WHAT WAS BUILT, AND WHAT WAS NOT REVERSED

**`efc379f`'s RULE IS RIGHT AND STANDS.** A picture that resizes under a frame
that cannot resize with it would never register. What was wrong was leaving the
HANDLE drawn: **a control that is visible and does nothing is the dead control
Doctrine 11's corollary forbids**, and it is worse than an absent one because it
looks like a feature. It is hidden framed now — measured, `display: none` — and
**standalone nothing changes at all**, because `body.framed` only exists inside a
frame.

**THE GESTURE IS RESTORED ONE LAYER OUT, ON THE THING HE ACTUALLY MEANT.**
`.ps-grip` sizes `.ps` — the bezel, the picture, the controls and the way out
together — which is exactly the object `efc379f` said had to move as one. It uses
the twin's own mapping (one degree of freedom, `dx` projected through the aspect
and averaged with `dy`), sits on the bezel's own transparent outer corner for the
twin's own stated reason, and is drawn as the same corner bracket.

**MEASURED:**

| | |
|---|---|
| before | 1000 × 800 |
| after a drag up-left | **740 × 592** — aspect held at 1.25 |
| persisted | `0.74` in `sessionStorage`, on release only |
| the control strip | still inside the frame — everything scaled together |
| double-click | **1000 × 800** — back to fit |
| the grip's own position | flush to the frame's bottom-right corner, 0px on both |

Range clamped **0.35 – 1.25**; his T3 rule *"session-persist the result"* is why
it is session and not local.

---

## 5 · DEFECTS OF MY OWN, AND ONE PROBE THAT LIED

- **I APPENDED PROSE PAST A CLOSED COMMENT. THIRD TIME.** `*/` orphaned mid-block
  in `PortalScreen.jsx`; vite 500'd, the module failed to reload, and the rig
  rendered an empty page. Caught by the console naming the file, then `eslint`
  giving the line. **The pattern is always the same — extending a block comment
  that has already been closed — and knowing that has not yet been enough.**
- **MY OWN REGEX SAID THE BARREL'S TRANSLATE WAS ZERO WHEN IT WAS NOT.**
  `/translate\(([-\d.]+)px,([-\d.]+)px\)/` against Chrome's normalised
  `translate(-28.62px, -12.11px)` — **the browser inserts a space after the
  comma** and the pattern had none, so it failed to match and my reader reported
  `dx: 0, dy: 0` for all five buttons. I nearly diagnosed a working feature as
  broken. Reading the raw strings settled it in one call. §0: **suspect the probe
  before the site**, and a regex over a normalised value is a probe.
- **THE RIG SERVED A PRE-EDIT MODULE ONCE**, so a measurement came back with the
  old coefficients after the file had changed. Rebuilding the iframe fixed it.
  Same family as the stale vite transform cache of 2026-08-26.

---

## 6 · GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 7 warnings — baseline, zero new** |
| `npm run build` | green |
| `npm run build:launch` | green |
| `npm run provenance:gate` | **PASS** — 6 added, 2 pruned, 0 inbound RESTATED chains |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** |
| `npm run docs:numbers:gate` | **PASS** |

---

## 7 · WHAT IS OPEN AFTER THIS

- **`MD-c`** — three surfaces still carry the full wing name and none is a title
  bar. Untouched, one word.
- **`MD-d`** — the test signal's control set is still an Ops reading.
- **`MD-b`** — the test card bows and its raster does not.
- **`MD-a`** — the glass readability conversation. **Channel 4 is not the answer
  to it** and says so above: 3.2× larger, the same 384 × 192 canvas.
- **`MC-c`** — the bezel's transparent 2.7px outer edge.
- **NEW: `ME-a`** — channel 4's zoom CENTRE is the top window's centroid rather
  than the plate's own framing, which sits a little right of it. Stated as an Ops
  choice; one look moves it.
