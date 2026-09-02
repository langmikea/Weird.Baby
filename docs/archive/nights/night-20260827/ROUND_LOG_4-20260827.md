# THE MARKERS AND THE GRIP — 2026-08-27 (fourth packet)

**Built from `8d32319` on the same day's uncommitted work. Nothing committed,
nothing pushed, nothing deployed.** Two of the four rulings said INSPECT AND
REPORT FIRST; both investigations are §1 and §2 and both ran before a line
changed.

---

## 1 · CH3 AND CH4 ARE TWO PLATES WITH TWO MARKER SETS — REPORTED FIRST

**MIKE: "I created the artwork for CH3 and CH4, and also handed you the marker
for where the screen is to land. I created CH3 so I could see the entire front
and top, and I created CH4 such that they were zoomed in versions of the same."**

### WHAT MARKER EACH PLATE CARRIES, AND WHERE IT CAME FROM

**BOTH MARKER FILES ARE IN THE TREE, IN BOTH REPOSITORIES.** Resolved by
connected-component scan over the red channel, not by eye:

| | `monitor_base_markers.png` — **CH3** | `MGK-TWIN_MONITOR_CLOSE_UP_MARKERS.png` — **CH4** |
|---|---|---|
| front screen | centroid **(869.2, 1047.1)**, 327 × 159 | centroid **(863.4, 692.6)**, **1071 × 522** |
| top screen | centroid **(2118.2, 764.0)**, 327 × 159 | centroid **(2139.5, 693.6)**, **1071 × 522** |
| the lens dot | (868.5, 1427.1), 42 × 43 | (861.2, 1935.5), 141 × 143 |
| fill ratio | 0.994 – 0.996 (solid rectangles) | 0.995 – 0.996 |

Both are 3000 × 2400. Both carry three marks in the same arrangement. **Neither
was measured by Ops.**

### CH3's LIVE NUMBERS WERE ALREADY HIS, AND THAT WAS VERIFIED RATHER THAN
### ASSUMED

The question was whether the tree's CH3 geometry came from his marker or from
somebody's eye. It came from his marker, and it matches to a tenth of a pixel:

| live in `twin.html` | his marker |
|---|---|
| `#maskFront{left:28.9667%;top:43.6250%}` → (869.0, 1047.0) | **(869.2, 1047.1)** |
| `#maskTop{left:70.6000%;top:31.8333%}` → (2118.0, 764.0) | **(2118.2, 764.0)** |
| `width:10.9%;height:6.625%` → 327 × 159 | **327 × 159** |
| `clickflash{top:59.4583%}` → y 1427.0 | **1427.1** |

**All four marks are in use and every one is his.** Nothing about CH3 was ever
eyeballed.

### AND CH4 IS NOT A CROP OF CH3 — THE MARKERS PROVE IT

**In CH3 the two screens sit 283px apart vertically (1047.1 against 764.0). In
CH4 they sit ONE pixel apart (692.6 against 693.6).** No crop, scale or pan of
one photograph can produce the other. They are two separate shots of the same
machine, posed differently — exactly what he said they were.

**OPS WAS WRONG ABOUT THIS TWICE.** First *"should show EXACTLY what CH3 shows"*
was read as identical, which deleted the channel. Told that was wrong, Ops made
it a **3.2× crop of CH3's photograph**, derived by comparing one glass feature
between the two images — a number that measured correctly and answered the wrong
question. **Both readings threw his artwork away.** The second was worse than
the first because it looked like diligence: a measurement, carefully taken,
of a relationship that does not exist.

### WHAT WAS BUILT

`view: "closeup"` on the channel → `?view=closeup` on the twin → **the plate and
its marker geometry together**, because they are the same fact. Verified served:

| | channel 3 | channel 4 |
|---|---|---|
| address | `?user=1&preset=standard` | `?user=1&preset=standard&view=closeup` |
| body class | `… monbase portal` | `… monbase **closeup** portal` |
| plate drawn | `…FAMILY_SHOT.png` | **`…CLOSE_UP.png`** |
| front aperture | 114.7 × 55.8 at 28.97% / 43.62% | **375.6 × 183.0 at 28.78% / 28.86%** |
| top aperture | 114.7 × 55.8 at 70.60% / 31.83% | **375.6 × 183.0 at 71.32% / 28.90%** |
| `unitPowered` | true | **true** |

**Every CH4 figure is his marker converted against the canvas and nothing else**
— 863.4/3000 = 28.780%, 2139.5/3000 = 71.3167%, 692.6/2400 = 28.8583%,
693.6/2400 = 28.9000%, 1071/3000 = 35.7%, 522/2400 = 21.75%. The rendered
positions land on those percentages exactly.

**CH3's ADDRESS IS UNCHANGED TO THE CHARACTER** — it declares no view, so the
default twin is the twin it has always been, and a twin opened standalone is
untouched.

The glass is **3.27× larger on CH4** — 35.7% of the frame against 10.9% — which
is what *"zoomed in versions of the same"* means. **It is the same 128 × 64
canvas drawn bigger**, so it is a closer look rather than more resolution; that
distinction belongs to `MD-a` and is not claimed here.

**AND OPS' DERIVED 3.2× IS DELETED, NOT KEPT AS A FALLBACK.** A second geometry
for the same channel is the next round's puzzle. The `zoom` prop, the slip-box
scaling and the payload field all went with it.

---

## 2 · THE DRAG-RESIZE — THE SHAPE, REPORTED BEFORE BUILDING

**MIKE ruled it built, knowing it never existed.** He is right that it never
existed **on the monitor**: `twin.html`'s `Portal_Grip_In()` resizes the twin's
own stage, and inside the museum that has been nailed by `Framed_Fit` since
`efc379f` on 2026-08-22. Nothing has ever resized the Portal's monitor.

### WHAT RESIZES

**`.ps` — the monitor as one object**: the bezel, the picture, both control
groups, the way out, the grip and the tear band. **Nothing is repositioned by
hand and nothing needed to be.** Every dimension inside the frame is already
either a `cqw` of it (the twin's own control geometry — `--chy-w`, `--dig-h`,
`--strip-left`, `--grp-top`) or a percentage of it (the feed rect, the bezel,
the tear). They scale by construction, which is the property the twin chose
`cqw` for in the first place. **Verified: after a drag the control strip is
still inside the frame.**

### THE LIMITS

**0.35 to 1.00, and the ceiling is the fit.** At 1 the frame is already
`min(100cqw, 100cqh × ratio)` — whichever axis binds, filled. Above 1 it does
not get bigger, it pushes past `.ps-wrap`, whose `overflow:hidden` then **crops
the bezel**. The frame is the object — *"standard 60s CRT"* — and a monitor with
its corners cut off to gain picture is a different object. **Verified: a drag
past the fit clamps at 1000 × 800.** If he wants past it the crop is the cost,
and it is one number.

### WHETHER IT PERSISTS

**sessionStorage, written on release only** — his own T3 rule for this exact
control, *"session-persist the result"*. A write per `pointermove` is dozens a
second for a value nobody reads until the next open. Verified: `0.7` after a
drag. Double-click resets to the fit.

### WHAT IT COSTS THE MEASURED GEOMETRY — THREE CONSEQUENCES, NAMED

**(1) THE BEND HAD TO BE RECOMPUTED, AND THE DEFECT WAS REAL BEFORE IT WAS
FIXED.** The warp is measured from client rects; a drag writes a CSS variable
and neither re-renders React nor fires `window.resize`. **Measured on the served
page before the fix: dragging 1000 × 800 down to 700 × 560 left the `[X]`
carrying `translate(12.19px, 5.04px) rotate(6.43deg)` byte for byte** — a bend
sized for a frame 43% larger, applied to the small one. The drag now calls the
bend directly. **Verified after: the displacement scales go 32.41 → 22.68 and
36.86 → 25.80, exactly 0.7×.** This is the consequence that would have been
discovered rather than named.

**(2) THE CONTAINER-QUERY BREAKPOINTS FIRE AT A SIZE THE VISITOR CHOOSES.**
`.pc-root` and `.ps-note` both switch treatment at `@container (max-width:
640px)`, so a monitor dragged below 0.64 gets the phone layout on a desktop.
**Measured on the terminal:** 27px type at the fit, **21.6px at 0.60** (the
phone rule has fired), 12.6px at 0.35. **This is arguably correct** — those
rules exist because a small frame needs proportionally bigger type, and a
dragged-small frame is a small frame — but it is now reachable by choice and is
stated rather than left to be met.

**(3) EVERY ABSOLUTE PIXEL FIGURE IN THE LOGS IS NOW A FIGURE AT `--ps-size:
1`.** The opening's 761.7 × 603.3, the tear's 7.9px, the bend's displacement
scales: all of them are the fit-size reading. **Ratios, percentages and marker
fractions are unaffected**, which is everything the plates and the bezel are
measured in — so the fixed-plate geometry the Portal is built on costs nothing.
A future round quoting a pixel from a log should say which size it was taken at.

---

## 3 · THE BARREL REACHES THE INK, AND THE CLICK TARGET DOES NOT MOVE

**Ops' scope, and it is a better mechanism than the one it replaces.** The
previous cut transformed the whole `<button>`: the ink moved rigidly and the hit
area moved with it. Now each control group carries an **`feDisplacementMap`**,
and a CSS `filter` moves PIXELS without touching hit testing — so the border,
the label and the punched slug bend as glass bends them **while the button's box
stays exactly on the twin's measured grid**.

**THE MAP IS THE REAL FIELD, NOT AN APPROXIMATION.** Each pixel of a 48 × 24
raster is the barrel displacement at that point of the group's own box —
`d = K·p·r²` against the frame's centre, with the group's mean removed so the
group does not travel. R carries x, G carries y, 0.5 is no displacement;
`feDisplacementMap` reads them back as `scale × (channel − 0.5)`.

**MEASURED SERVED:**

| | |
|---|---|
| `.ps-ctl` | `filter: url(#ps-bend-0)`, map 1634 bytes, **scale 32.41** |
| `.ps-strip` | `filter: url(#ps-bend-1)`, map 1646 bytes, **scale 36.86** |
| button transforms | **none — all eight** |
| hit test at each button's centre | **lands on its own button, eight of eight** |

So the ink is displaced by up to **±16.2px and ±18.4px** and **the click target
has not moved at all** — not "moved with the ink", but never moved. Filter
region grown to 140% so displaced ink is not clipped, and
`color-interpolation-filters="sRGB"` because the default would re-read the map's
channel values as light rather than as the numbers they are.

---

## 4 · SCROLL LANDS ON THE VALUE — UNCHANGED FROM THE THIRD PACKET

Built and verified there; re-verified here. `READY` computes the ink background,
`RUN` computes transparent. The aerial's digits were already right and are the
proof of the rule.

---

## 5 · DEFECTS OF MY OWN

- **A COMMENT BOUNDARY, FOR THE FOURTH TIME THIS DAY, AND THE OTHER WAY ROUND.**
  The previous three orphaned a `*/`; this one **swallowed** one, so a block
  comment ran into the channel-4 declaration and `portal.js` would not parse.
  Caught by `eslint` on the file. **The class is not "I append past a closed
  comment" — it is that I edit comment blocks by text replacement without
  checking the delimiters survive.** That is the sentence worth carrying.
- **The rig served a pre-edit module once**, so a barrel measurement came back
  with old coefficients after the file had changed. Rebuilding the iframe fixed
  it — the same family as the stale vite transform cache of 2026-08-26.

---

## 6 · GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 7 warnings — baseline, zero new** |
| `npm run build` | green |
| `npm run build:launch` | green |
| `npm run provenance:gate` | **PASS** — 5 added, 3 pruned |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** |
| `npm run docs:numbers:gate` | **PASS** |
| `npm run reveal:day` | nothing to move |

---

## 7 · WHAT IS OPEN AFTER THIS

- **`ME-a` CLOSES.** It asked about a zoom centre Ops derived; there is no
  derived centre any more — CH4 is his plate at his marker.
- **`MD-c`** — three surfaces still carry the full wing name, none a title bar.
- **`MD-d`** — the test signal's control set is still an Ops reading.
- **`MD-b`** — the test card bows and its raster does not.
- **`MD-a`** — the glass readability conversation. **CH4 is not the answer** and
  says so: 3.27× larger, the same 128 × 64 canvas.
- **`MC-c`** — the bezel's transparent 2.7px outer edge.
- **NEW `ME-b`** — the monitor's size is now a visitor choice, so the phone
  container-query rules are reachable on a desktop below 0.64 of the fit.
  Measured, stated, and left as it is because the behaviour is arguably correct.
