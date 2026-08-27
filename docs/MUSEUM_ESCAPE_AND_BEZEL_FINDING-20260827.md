# WHAT IS ESCAPING THE BEZEL, AND WHETHER HIS IMAGE IS THE FIX — 2026-08-27 (seventh packet, part 1)

**Built from `8d32319` on the same day's uncommitted work. Nothing committed,
nothing pushed, nothing deployed. NOTHING HAS BEEN CHANGED YET** — this packet
is the answer to the question he asked to be answered before building.

**HIS QUESTION, VERBATIM:**

> "I can supply the VIIIp ZOOM image without a bezel, and with bleed if that
> helps."

And the framing he put on it: three of his four reports are things escaping the
bezel — the tears, the jitter, and CH4's second frame a round ago. Is the
bezel-less plate the underlying fix, or is the escaping a clipping defect and
the image a separate improvement?

---

## 0 · THE ANSWER IN ONE LINE

**IT IS A CLIPPING DEFECT, AND HIS IMAGE FIXES A DIFFERENT ONE.** Both are
real, both are worth doing, and neither substitutes for the other. **YES to the
image** — it is the fix for *"the vertical jitter looks crummy"* on channel 4,
which is the one of the four that no amount of clipping reaches.

---

## 1 · THE ESCAPE, MEASURED — AND IT IS NOT ABOUT WHAT IS IN THE PICTURE

### THE FRAME IS NOT A RECTANGLE. THE CLIP IS.

`MGK-TWIN_MONITOR_SCREEN_BEZEL.png` is 3000 × 2400 and it is a **rounded CRT
silhouette on a fully transparent ground.** Measured on its own alpha channel,
the width of the not-fully-opaque margin at the outer edge, per row:

| row | left margin (px) | right margin (px) |
|---|---|---|
| 10 | **980** | **903** |
| 200 | 25 | 37 |
| 600 | 12 | 23 |
| 1200 | 1 | 10 |
| 1800 | 11 | 21 |
| 2200 | 31 | 42 |
| 2390 | **1014** | **944** |

The four corners are transparent outright (alpha 0 at all four), and rows
`0` and `2398..2399` and columns `2991..2999` are transparent across their
whole length.

**AND THE MUSEUM CLIPS THE PICTURE TO THE WHOLE 3000 × 2400 RECTANGLE.**
`.ps` carries `overflow:hidden`, so the feed is cut to the frame plate's
BOUNDING BOX — not to the shape the frame plate actually draws. Everywhere the
rounded silhouette falls short of that box — the entire outer curve, and above
all the four corner regions — **there is nothing over the picture at all.**

### WHY NOBODY SAW IT UNTIL SOMETHING BRIGHT MOVED THROUGH

`.ps-feed` paints `background:#000`, and the overlay's ground is black. At rest
the uncovered region is black on black. **The moment a bright band or a moved
edge lands in it, it appears outside the set.**

### PROVED ON THE SERVED PAGE, NOT REASONED

A plain red band was put inside the feed box at the tear's own coordinates —
same parent, same `z-index`, same full-width geometry as `.ps-tear` — and
photographed:

| probe | what is visible outside the monitor |
|---|---|
| band at 45% height, channel 3 | a red stub on the black ground beyond the frame's right edge |
| band at 45% height, channel 4 | the same stub, same place |
| band at the top of the feed | **a full-width red bar across the top of the screen, above the set** |
| band at the bottom of the feed | **a full-width red bar below the set** |

The same shot shows the bezel correctly covering the band everywhere the frame
is opaque. **So the paint order is right and the clip is wrong** — which is the
distinction this packet exists to draw.

**AND THE EARLIER CLIP DID LAND.** The round that moved the tear onto the
monitor screen was not undone and did not half-work: the tear is still
`.ps-tear` inside `.ps-feed`, still a sibling of the slip, still under the
bezel by `z-index`. What that round established was *the tear is inside the
picture box*; what nobody asked was *and is the picture box inside the frame's
shape*. It is not, and it never was.

### THE SIZE OF IT, IN THE FEED'S OWN TERMS

On channel 3 the feed box is the 4:3 enlargement — **106.67% of the frame at
−3.33%** — so it starts 35 CSS px outside the frame on each side before the
silhouette is even considered. On channel 4 (`exact`) the feed box is the frame
box exactly, and **it still escapes**, because the escape is the silhouette and
not the overhang.

---

## 2 · SO WHAT HIS IMAGE FIXES, WHICH IS NOT THIS

### HIS CH4 PLATE IS THE MUSEUM'S BEZEL, AND THAT IS NOW ARITHMETIC

Re-measured this packet against the whole frame rather than one scanline:
**2,148,159 pixels of `MGK-TWIN_MONITOR_CLOSE_UP.png` lie under fully-opaque
bezel, and all 2,148,159 are byte-identical to it — mean absolute difference
0.00.** His close-up is the frame with the picture composited into the opening,
in one file.

**AND THE FAMILY SHOT IS NOT.** The same measurement on
`MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png` gives a mean absolute difference of
**184.0**, with 354 pixels coinciding by chance. Its content stops at
`x 227..2766, y 194..2229` — **exactly the declared feed rect, to the pixel.**
Channel 3 carries no second frame; channel 4 does.

### WHICH IS WHY THE ROLL LOOKS WRONG ON CHANNEL 4 AND CANNOT BE CLIPPED RIGHT

The vertical-hold slip in `twin.html` moves `#feedgroup` by **6 to 15 px** and
snaps back. On channel 4 that group carries his plate, and his plate carries
the frame — **so the frame itself slides against the museum's frame.** No clip
can fix that: the two frames are both inside the opening, and one of them is
moving. It is the same defect as *"CH4 is showing two bezels"*, one round on,
in motion rather than at rest.

**A BEZEL-LESS PLATE WITH BLEED ENDS IT AT THE SOURCE.** Only the picture
rolls, the museum's frame is the only frame on the glass, and the strip the
roll vacates is filled with picture instead of with the plate's own cut edge.

**AND THE FAMILY SHOT HAS THE SECOND HALF OF THAT PROBLEM ALREADY.** It is cut
to the feed rect with **zero bleed**, so a vertical roll of any size pulls its
own edge into the opening. The 4:3 enlargement buys about 30 CSS px sideways
and only about 7 vertically, which is less than the roll.

---

## 3 · THE CLIP THAT CLOSES THE ESCAPE, AND IT COSTS NOTHING VISIBLE

**THE SAFE RECTANGLE IS COMPUTED FROM THE FRAME'S OWN ALPHA, NOT CHOSEN.** The
silhouette was resolved by flood-filling the transparent ground inward from the
border, giving frame ∪ opening; the opening's bounding box was then grown on
all four sides for as long as each whole edge line stayed inside the
silhouette:

```
opening bbox     x  231 .. 2761   y  207 .. 2207
SAFE RECT        x  102 .. 2896   y   46 .. 2336      2795 x 2291
as % of plate    left 3.4000   top 1.9167   right 3.4333   bottom 2.6250
```

**EVERYTHING THIS REMOVES IS UNDER OPAQUE FRAME.** The strip between the
rectangle and the silhouette is the frame itself on all four sides and the
whole of each rounded corner, so a visitor cannot lose one pixel they could
ever have seen. **It cannot come apart the day the bezel is re-cut** for the
same reason the opening's crop cannot: the numbers are the frame's own.

---

## 4 · THE THREE NUMBERED QUESTIONS FOR MIKE

Written out in the report to him. Recorded here so the packet is the record.

1. Do you want the bezel-less zoom plate with bleed handed over? (Ops says yes
   — it is the fix for the jitter on channel 4.)
2. How much bleed, if you are cutting it fresh?
3. Should channel 3's family shot be re-cut with bleed too, or is channel 3
   left as it is for now?

---

## 5 · WHAT HAS NOT BEEN TOUCHED

**Nothing.** No file in the working tree was changed by this packet. The four
fixes are built in part 2.
