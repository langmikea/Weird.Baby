# THE PORTAL CONTROL PANEL — design report

**Report only. Nothing built.** 2026-08-20.

---

## 0 · THE FILE — verified, and it is not at the name given

**The brief says `_incoming\portal-panel-design.png`. What is on disk is:**

```
C:\AI\Projects\weird-baby-museum\_incoming\PANEL_MOD.jpg   88,718 B   09:10
```

**Different name, different extension, and it is the only file in that
directory.** Opened and read: it matches the brief's description in every
particular — ABEAL badge, `3 | STANDARD` stepper readout, two bat switches with
lamps, SOURCE knob, wide lit LATCH, green FEED ARMED lamp, four slot screws,
chassis with drop shadow. **Confirmed as the right image.**

`/mnt/user-data/uploads/` **does not exist on this host** — that is a sandbox
path, and this session runs on the Windows host (`CLAUDE.md` → THE ENVIRONMENT).

**Named because §7 Rule 7 is about anchors:** a packet that names a path is
making a checkable claim, and this one was wrong twice over. Nothing was assumed
from the filename; the image was opened.

---

## 1 · IS IT BUILDABLE IN CSS/SVG? — YES, ENTIRELY. NO IMAGE ASSETS.

**And most of it is already built.** `.ip-*` is **64 selectors** in
`Exhibit.css` today, and the design reuses the majority of them.

### Already exists, unchanged

| design element | what is already there |
|---|---|
| **Chassis, brushed steel, top/bottom lip, drop shadow** | `.ip` — five stacked gradients (radial sheen, two diagonal lights, a 3px repeating brush) over `--steel`, plus six box-shadows including `0 14px 28px -12px rgba(0,0,0,.85)`. **The design's housing is this rule.** |
| **Four slot-head screws at different angles** | `.ip-screw` + four corner rules. Already a slotted head in a **countersunk dish** with a light-catching lower lip, each turned by the renderer — *"a screw that lines up with its neighbours is a logo."* |
| **Two bat switches, lamp left of lever** | `.ip-sw` is `grid-template-columns: auto auto 1fr` — lamp, bat, legend. **The design's order exactly.** |
| **Lamps, dark and lit** | `.ip-lamp` + `.ip-lit`, in `warm` / `amber` / `green`. The design's dark AUTO MAINT lamp and lit amber AT PROMPT lamp are the existing `on:false` / `on:true` states. |
| **Rotary knob with a pointer** | `.ip-knob` + `.ip-knob-mark`, angle measured at layout. |
| **Green FEED ARMED lamp** | `.ip-state` — lamp + text, already green, already tied to `armed`. |
| **Two-line switch legends** | `.ip-sw-name` / `.ip-sw-sub`. |

### Needs new CSS — all of it gradients and shadows, none of it images

| design element | what it is |
|---|---|
| **The lit `3 \| STANDARD` readout** | A dark inset well with an amber glow and a rule between number and name. `.ip-armed .ip-drum` **already does the lit-amber treatment** (`#17140c` ground, `#6a5c3a` border, `#f2c879` text, 9px glow) — it is the same material, re-shaped from a 34px drum window into a wider readout. |
| **▲ / ▼ stepper buttons** | `.ip-roll` exists and is exactly these two buttons; the design gives them a raised key face and moves ▼ to the right of the readout rather than below. **Restyle, not new machinery.** |
| **The ABEAL badge, engraved and lit** | New. A bright bezel, a black field, letterpress-styled caps with a light top edge and dark bottom, and the four small screws in its own corners. `text-shadow` + `background-clip` — **no image.** |
| **The wide lit LATCH key** | `.ip-latch` exists; the design widens it and lights the face amber. |

### The one honest caveat

**The badge's lettering in the design has a specific engraved-and-backlit look**
— bright metal letters on black with an inner glow — that CSS can approach and
not photograph. **If Mike judges the CSS badge short of the design, the fallback
is an SVG, not a raster**: the letterforms are type, the shape is geometry, and
an SVG scales with the `fit` transform where a PNG would soften. **No PNG at any
point.**

---

## 2 · DOES THE ARMING LOGIC SURVIVE THE STEPPER? — YES, UNCHANGED.

**Confirmed by reading it. The arming rule does not know what the drum looks
like.**

```js
const drum   = drumPos[drumIdx] || {};
const dial   = dialPos[dialIdx] || {};
const swBad  = swDecl.findIndex((w, i) => swOn[i] !== !!w.armsWhen);
const armed  = !!drum.arms && !!dial.arms && swBad === -1;
function roll(d) { setDrumIdx(i => (i + d + N) % N); }
```

**Every one of these survives verbatim:**

| behaviour | survives? | why |
|---|---|---|
| `armed` = drum ∧ dial ∧ every switch | **yes** | It reads `drumIdx`, not the render |
| The wrap-around `roll(±1)` | **yes** | It is already a stepper — the ▲/▼ buttons call it today |
| **Opening on the first `arms:true` position** (R6) | **yes** | `useState(() => findIndex(p => p.arms))` is untouched, and it matters **more** now: with eight faces on a cylinder a visitor could see the neighbours; with one readout the landing position is the only thing they see |
| The refusal line, most-specific-first | **yes** | Reads `drum.why` / `dial.why` / `swDecl[swBad].held` |
| Per-position `src` / `frameTitle` (CH4) | **yes** | The latch reads `drum.src \|\| L.src` |
| Channel numbers as data (`p.ch`) | **yes** | The readout prints `p.ch` and `p.label` — **the design's `3 | STANDARD` IS those two fields** |

**WHAT IS DELETED IS PURELY GEOMETRY:** `FACE_H`, `RADIUS`, `STEP`, the
`rotateX/translateZ` cylinder, `.ip-drum-spin`, `.ip-drum-face`,
`.ip-drum-glass`. **No state, no condition, no event.**

### The interaction change, stated honestly

**A visitor no longer sees that eight channels exist.** The cylinder let the
neighbouring engravings rotate past; a single readout shows one. **That is a
real loss and it is the design's deliberate trade** — a rack instrument shows
its setting, not its menu.

**It cuts both ways, and the second half is the reason it may be right:** M33's
five engraved reveal levers were *visible* on a rolling drum, which made the
size of the room legible. A stepper makes them *findable* instead — you step and
they arrive. **Nothing is removed from the data either way.** Mike's call; it is
not a defect in the design.

---

## 3 · WHAT IT COSTS, IN PIECES

| # | piece | size |
|---:|---|---|
| 1 | **Readout replaces the cylinder** — `.ip-drum*` markup and CSS out, one lit well in; delete `FACE_H`/`RADIUS`/`STEP` | **medium**, and it is a net deletion |
| 2 | **Steppers restyled** and ▼ moved beside the readout | small |
| 3 | **ABEAL badge replaces the four-region nameplate** — `.ip-np-*` is **15 selectors**; the design keeps the bezel and the wordmark and drops the accent panel and the struck data cells | **medium** |
| 4 | **`nameplate` shape changes in `portal.js`** — `fields[]` no longer rendered | small (data) |
| 5 | **LATCH widened and lit** | small |
| 6 | **Layout: two columns** — FEED + SOURCE left, switches + latch right | small; `.ip-deck` is already a wrapping flex |
| 7 | **Legend under the readout** — `SELECT · ONE ARMED` is stale (below) | **Mike's words** |

### THE LARGEST RISK — and it is not any of the above

**THE `fit` SCALER, AND THE DESIGN'S ASPECT RATIO.**

The panel is scaled down to fit its frame's height — *"a panel is scaled to fit,
never cropped"* — and today it is a **wrapping** flex whose bays stack at narrow
widths, so at 390px it becomes tall and thin and the scaler takes over.

**The design is a fixed two-column rack instrument at roughly 2.1 : 1.** A fixed
two-column layout cannot reflow, so at narrow widths it can only be **scaled**,
and the readout's lit text and the two-line switch legends are already at
`--fs-micro`. **The failure mode is legibility at 390px, and it will not show up
on a desktop screenshot.**

**It is the largest risk because it is invisible until measured**, and because
the previous panel round hit exactly this class of thing twice (the pointer that
aimed at nothing; the plate that read as a control).

**What removes it: measure at 390px before agreeing the layout**, and be
prepared for the design to need a declared stacking order rather than a scale.

### Two smaller risks, both real

**(a) THE DESIGN'S SOURCE BAY REVERTS AN N1 RULING.** In the image, LIVE and
SEEDED are **stacked vertically** to the right of the knob, and the pointer aims
**up and to the left, at neither of them.**

That is precisely the fault N1 fixed on 2026-08-02, in its own words: *"at LIVE
the mark aimed up and to the LEFT, away from both legends… stacked in a column
they measured 82° and 98° from the knob — the pointer aimed at the right legend
and the SIXTEEN DEGREES between them was invisible, so the instrument looked
broken while being exactly correct."* The fix put the legends on a 100° arc.

**Not a defect in Mike's drawing — a conflict between the drawing and a measured
ruling, and Ops does not choose.** Either the arc stays and the design's SOURCE
bay is adjusted, or the stack returns and N1 is knowingly reversed.

**(b) "FEED ARMED as a green lamp, not a word" HAS TWO READINGS, and the image
shows the words.** The drawing has a green lamp **and** the text `FEED ARMED`.
Today the text **toggles** — `FEED ARMED` / `NOT ARMED`. The reading that fits
both the sentence and the image is: **the label is constant and the lamp is what
changes.**

**If that is right, `latch.idle` (`"NOT ARMED"`) stops being rendered**, and the
refusal line below becomes the only place the panel says why. **One word from
Mike settles it.** Ops has not assumed.

---

## 4 · SHARED OR ROUTE-LOCAL? — THE FILE IS SHARED, THE BEHAVIOUR IS NOT.

**`InstrumentPanel` lives in `src/routes/exhibit/Exhibit.jsx`** (line 1495) and
its CSS in `src/routes/exhibit/Exhibit.css`. **Both are shared by every wing.**

**But it is mounted on the presence of a field**, and **exactly one face in the
museum declares one:**

```
grep 'kind: "panel"' src/data/  →  src/data/artists/portal.js:189   (one hit)
grep 'panel:'        src/data/  →  src/data/artists/portal.js:204   (one hit)
```

**So nothing else moves.** `/hr`, `/wb`, `/wal` and `/foundation` declare no
panel and cannot notice the change — which is the arrangement `portal.js`'s own
note describes: *"`kind:"panel"` adds a renderer that knows how to draw a drum, a
bat switch, a lamp, a dial and a latch — and knows nothing about MGK, portals or
maintenance."*

**WHAT THIS DOES MEAN, and it is the honest half:**

- **`Exhibit.jsx` is one of the lint-debt files** (2 errors / 2 warnings at
  baseline) and is a file CLAUDE.md flags as routing. Touching it needs the
  usual care; the baseline must come back at **9 / 8**.
- **The `.ip-*` block is 64 selectors in a stylesheet five wings load.** Adding
  to it costs every wing the bytes. It is already the case today; the design is
  roughly cost-neutral, because the cylinder's 10 selectors leave as the
  readout's arrive.
- **A route-local move was considered and is NOT recommended.** Extracting
  `InstrumentPanel` into `src/routes/robots/` would fork it away from
  `FoundationObjects.jsx`, which is explicitly documented as mounting *"the way
  it mounts `InstrumentPanel` — on the presence of a field."* **The pattern is
  shared even though the component has one caller**, and breaking the pattern to
  save five wings a few hundred bytes is the wrong trade.

---

## 5 · THE FOUR RULINGS THAT CAME WITH IT

### (a) TRACKLIST — corrected, and the correction is Ops' error

> **DELETE `Portal`. RENAME `Portal Feed Controller` → `Portal`. One track, not
> two.**

**Ops recorded this wrong this morning** — as *"drops Portal, keeps Portal Feed
Controller"* — in the canon catalogue and in two round reports. **The catalogue
is corrected** (`docs/canon/06-PORTAL.md`, rerendered), and the correction names
itself as a correction.

**The `id` on the panel track is already `portal`**, so this is a title change
and a deletion. **Not applied** — it lands with the panel.

**What the deletion costs, named:** `portal-door` was the one Ops judgement in
this album (`P-b`) — a row Mike named without saying what stood behind it, made
into the door so it would not be a dead control. **His ruling supersedes it**,
and the LATCH is already the door.

### (b) ALBUM ART — NOT OPS' TO MAKE

> The Portal album art needs the controls showing in the lower right portion.

**`tools/make_unit_covers.py` REFUSES to write `portal-cover.png` by name**, and
raises rather than skips — *"a skip prints a line nobody reads and exits 0."*
The fence is Mike's own ruling of 2026-08-10: **the four wing covers are
hand-authored; the tool raises rather than writes.** The old recipe is
commented out beside it, and *"restoring this line does not restore the tool's
authority."*

**So this is Mike's to draw.** Ops' part is to land the file and declare it.
**Recorded, not scheduled.**

### (c) THE GLITCHES — HIS NEW RULING REVERSES HIS OWN CANON, AND OPS WILL NOT DO THAT SILENTLY

> **"PORTAL GLITCHES must stay inside the monitor. They currently tear through
> the bezel and out onto the webpage. Wrong."**

**He is describing the H-tear, and it is doing exactly what it was built to
do.** `RobotsExhibitFlow.jsx`, `[CR1 / FORK A (b) 2026-08-02]`, recorded as his
canon:

> *"Mike's canon: the whole portal view is ITSELF a screen, and the portal is a
> screen ON it. The evidence-in-fiction is a tear that rips through EVERYTHING AT
> ONCE — background and portal together — **because a tear can only cross both if
> both are the same surface.** SO IT IS DRAWN HERE, ABOVE THE IFRAME, AND NOT
> INSIDE THE TWIN. **A tear inside the twin could only ever cross the twin; it
> would prove the opposite of what it is there to prove.**"*

**Mechanically it is two things, both in the museum and neither in the twin:**

1. a band at `position:absolute; left:0; right:0` inside an overlay that is
   `position:fixed; inset:0` — **the whole viewport**;
2. the iframe itself sliding sideways by `translateX(tear.slip)` for the same
   130 ms.

It is **deterministic by the glitch-realism law** — a fixed `TEAR_SCRIPT` of four
steps, walked and wrapped, no `Math.random` — and **rare on purpose**, tens of
seconds apart.

**The twin's own glitches are already contained.** `Glitch_Punctuate` and
`Glitch_Tick` draw on the twin's canvases and add `gl-jit` to `#unitstage`,
all inside the iframe. **Nothing of the twin's escapes.**

**SO THE TWO STATEMENTS CANNOT BOTH STAND**, and which one goes is his:

| if he rules | what happens |
|---|---|
| **The new ruling** | The tear is confined to the monitor — and **the thing it was built to prove is gone**: a tear that only crosses the twin proves the twin is a screen, which nobody doubted. CR1's canon is struck and named once. |
| **CR1 stands** | The tear keeps crossing, and what he saw is the feature. |
| **Something between** | e.g. the tear crosses the *feed* but stops at the bezel's outer edge — which is a third position and would need its own sentence, because the bezel is *"the real world's frame"* and a tear stopping at it says the frame is real. |

**Ops has changed nothing and will not until he has seen that the two
disagree.**

### (d) `SELECT · ONE ARMED` — stale, confirmed, and the stepper changes what it should say

**Two positions arm:** `standard` (ch 3) and `idling-updated` (ch 4, DETAIL,
since CH4 2026-08-12). The legend says one. **Already logged as `H-22` in the
canon catalogue and already carrying his ruling to fix it when the Portal is next
touched — which is now.**

**AND THE STEPPER CHANGES THE QUESTION, WHICH IS WHY THIS IS NOT JUST A NUMBER.**
Under a rolling drum, *ONE ARMED* told you how many **of the eight you could
see** would arm. Under a readout showing one channel, the same words read as a
statement about **the channel currently displayed**. *"TWO ARMED"* would be
literally true and would answer a question the instrument no longer poses.

**The legend's replacement is Mike's words, not a number Ops corrects.**
Recorded, unwritten.

---

## 6 · WHAT OPS RECOMMENDS AS THE ORDER

**Nothing is built until he answers (c) and the two flags in §3.** When he does:

1. **the three ruled items that are independent of the design** — tracklist
   rename, the drum legend, and whichever way (c) goes;
2. **the panel**, measured at 390px before the layout is agreed;
3. **the cover**, when he has drawn it.

**And the panel round is the visit that closes `H-22` and `P-b` together.**
