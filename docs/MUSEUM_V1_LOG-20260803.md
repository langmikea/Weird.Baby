# THE V1 ROUND — round log (v39, 2026-08-03)

Autonomous single-agent Code-lane round on Mike's remote-control brief. Items
V1–V3. Deliverable folder: `docs/v1-round-20260803/` (before/after frames).

Gates: **lint 11 err / 9 warn** (= HEAD baseline, zero new), **vite build green**,
browser lap at desktop (1706×810 CSS) AND a genuine 390×740 viewport via a
same-origin iframe harness — **and every V1/V2/V3 claim re-verified against the
LIVE BUILT bundle** (`vite build` → `wrangler dev`), as V2 required. The harness
was created for the lap and removed before seal; it is not in the diff.

**NOT PUSHED AND NOT DEPLOYED.** Both are Mike's.

---

## Per item

| # | Item | Outcome |
|---|---|---|
| V1 | ground correction — V1, not the file numbered 2 | **DONE** — the card is real; R0 kept, not reverted |
| V2a | the viewer: width must carry height | **FIXED** — 292.8px of dead stage per side → 1.6px |
| V2b | the PUV strip, sized to its content | **DONE** — 60.5px → **46px** for a one-line fact |
| V3 | track click: arm, then fire | **DONE** — exact ruling, all four cases verified |

Files touched, complete list:

```
src/routes/exhibit/Exhibit.css        V1 V2b V3
src/routes/exhibit/Exhibit.jsx        V2a V3
docs/MUSEUM_V1_LOG-20260803.md        this log
docs/v1-round-20260803/               the frames
```

Two source files. No token file, no data file, no routing file outside the
exhibit engine.

---

## V1 — the paper card on the dark stage

**The correction, taken literally.** Mike meant the variation *titled* "V1 —
paper card on the dark stage", not the file numbered 2. R0 (last round) read the
pick as an ordinal and wrote down V2, *house lights up one stop*.

**R0's work is kept, not reverted, and that is a judgement I will defend.** V2
changed the STAGE; V1 changes what stands ON it. They are not two answers to one
question — the lifted ramp is now the mat the card sits on, and every number R0
measured still holds for every surface still on the stage (the picture, M0b's
ring, the caption strip). Reverting it would have re-darkened the mat for no
stated reason, which is Doctrine #7 in reverse.

**Why it is structural and not cosmetic.** W6 → P9 → R0 were three consecutive
attempts to stop text-on-dark glaring, each moving the ground a stop. V1 stops
answering that question: the reading matter leaves the dark entirely, so the
stage can be as dark as the imagery wants — which is what the spotlight doctrine
asked for in the first place, and what *"black behind PICTURES reads well"* says
in Mike's own sentence.

**It is the building's own move, made twice now.** This is L5's sheet-on-mat from
the robots wing, structurally unchanged: the FACE is the mat (its padding is the
margin the sheet sits in), the BODY is the sheet (print stock, hairline, real
shadow). The only difference is what the mat is made of — paper there, lit
charcoal here. The mat is PADDING, not an inset, because L5 paid for that lesson:
`useYTPlayer` builds eagerly, so an opaque black iframe sits under every face and
a face moved in with `inset` uncovers it.

**The ramp comes back through the aliases that exist for exactly this.** L3 froze
a copy of the paper ramp in `museum-tokens.css` for *"anything nested INSIDE a
dark re-pin that belongs on paper"*, because CSS cannot revert a custom property
to its root value. This is the second consumer and the first one it was written
for. Twelve names, no literals.

### The audit — what the old ground was hiding

Not eyeballed: a walker over every text node on **all five faces of all four
artists**, computing each element's colour against its own resolved background.
Seven classes came back under AA on the card.

| class | before, on the card | why | now |
|---|---|---|---|
| `.vp-trail-fn` | **2.22:1** | `#c8a45c`, a gold picked to glow on a charcoal door | `--wb-gold-lo`, **6.94:1** |
| `.vp-metric-kind`, `.vp-record-when` | **2.75:1** | `--wb-gold-mute` = `#9b978d` on print stock | lifted mute, **4.82:1** |
| `.vp-face-sub` | **3.46:1** | `#8a857a` literal | `--wb-gold-mute` |
| `.vp-qcard-eyebrow`, `.vp-qcard-src` | **3.84:1** | `#7d7869` literal, on a quote card's mat | `--wb-gold-mute`, **4.57:1** |
| `.vp-face-papa`, `.vp-presets-note` | **4.15:1** | `#7d7869` literal | `--wb-gold-mute` |

**Re-audit after the fix: zero failures, all four artists, all five faces.**

**The mute step is the one value that is not a straight alias**, and R0 had to do
the same thing one ground up for the same reason: the mute is where a ground
shift quietly costs legibility at the bottom while fixing it at the top.
`#6a6659` is measured against **both** grounds the card carries — 4.82:1 on the
sheet `#faf8f3`, 4.57:1 on a quote card or collage mat `#f3efe6` — AA on the
darker of the two, which is the one that decides. It stays a clear step lighter
than `--wb-gold-lo` (6.94:1), so mute < lo < gold survives as a ramp.

**Five literals became one token.** That is L3's finding in its smallest form: a
palette re-typed by hand drifts from the palette the moment the ground moves, and
these five drifted on the day the ground moved.

### Three consequences of the ground, handled

1. **The prints needed their edge back.** Quote cards and collage tiles are paper
   mats (`#f3efe6`) with a heavy drop shadow — right on a dark stage, and on a
   print-stock sheet they are five units of luminance from their own ground across
   a hard edge. That is L5's *"there was no sheet; there was a field"*, one level
   in. A hairline plus the building's paper-on-paper two-part shadow.
2. **Three washes only existed on a dark ground.** `rgba(255,255,255,.03)` on a
   door and `rgba(232,228,216,.05)` on record and trail rows lift a surface on
   charcoal and are white-on-white on `#faf8f3` — the affordance vanished
   entirely. On paper a surface is raised by going darker; each takes ink at the
   weight it was taking light.
3. **`--wb-bg` was never in the stage's re-pin list.** The two PICTURE surfaces
   that read it — `.vp-thumb` and `.vp-audio-only` — painted the house's paper
   `#d9d5ca` inside a charcoal stage. It went unnoticed while the frame was short
   and letterboxed; V2a lets the frame be 1414×795, and a paper rectangle that
   size behind a 340px album cover is the loudest thing in the wing. **Found only
   because the geometry changed and I looked at the room afterwards.**

### Scope, checked and not assumed

- **/robots needs nothing.** Verified live: `--wb-ink` is `#ece9e0`, the face is
  a `#e7e3d8` mat, the body is a `#faf8f3` sheet. It is already a paper wing with
  L5's sheet-on-mat and **text never sits on black there** — V1's ruling is
  already satisfied. Mike's *"robots if it shares"* resolves to: it shares the
  sheet, it never had the disease.
- **The portal and the panel are excluded**, exactly as L5 excludes them: they
  declare a dark ground on purpose (a doorway to a running machine is not a
  document).
- **At ≤720px the mat stands down** (L5's own reasoning at the same breakpoint):
  18px each side of a 390px screen is 36px off the narrowest measure in the
  building. The sheet keeps its hairline and shadow.

### One call I made and am naming so Mike can overrule it in a word

**The PUV caption strip stays on the stage.** The ruling's own words are *"body
content sits on cream"*; a two-line caption printed under a photograph is not
body content — it is the photograph's label, and in a museum a label belongs in
the picture's frame, not on a separate sheet. The picture and M0b's ring stay
there with it. **One rule flips all three if that reading is wrong.**

---

## V2a — the width drag now carries the height

**Third round on this handle, and the arithmetic was never in doubt once
measured.** On the built page at 1706×810 with '94 cued:

| | before | after |
|---|---|---|
| `.vp-area` (the slot) | 1243.7 × 372 — a **3.4:1 letterbox** | 1243.7 × 372 on entry |
| `.vp-inner` (the picture) | 658.2 × 359.2 | 658.2 × 370.2 |
| dead stage **per side** | **292.8px** — 47% of the column | 292.8px on entry |
| **drag the split 190px wider** | picture stays **658.2 × 370.2, to the pixel** | picture → **1411 × 793.7** |
| dead stage per side, after the drag | **292.8px** (unchanged) | **1.6px** (the ring) |
| aspect through the whole drag | n/a — nothing moved | **1.778 at every step, both directions** |

**The cause was one property.** `.vp-area` carries `aspect-ratio:16/9`, but F3's
`--fit-area-max` caps its height in **pixels**, and a pixel max-height does not
move when a width does. So the slot grew and the picture — fitted to the slot's
height by M0b — did not.

**The fix is P1's ruling one lever over.** P1 already established that *"the fit's
cap yields to the hand"* for the carousel handle. The width handle now does the
same: on every move it re-derives the cap from the column's own width
(`(rect.width − 10) × (100 − pct) / 100 × 9/16`), so the frame is a true 16:9 of
whatever width the visitor chose. F3's promise is about **arrival** and is
untouched — the room still opens with everything on one screen; the moment a hand
touches the handle, aspect governs.

**Ceil and +1, deliberately:** the cap is set just PAST the natural height so
`aspect-ratio` resolves the box and `max-height` never binds. A cap rounded short
by a pixel would re-letterbox the picture by a pixel — the defect in miniature.

**Inert everywhere else.** Only WAL declares `fitOnEntry`, so only WAL has a cap;
wings without one were already plain 16:9 and this block never runs for them. The
handle is `display:none` below 720px, so V2a is desktop-only by construction.

---

## V2b — the strip, sized to its content

**P2's "fit" was three approximations in a row.** Measured on the live page,
one-line fact, no credit, before:

```
 12.00  margin-top (M0b's costed gift from the picture)          kept
  0.89  border-top, the rule that separates strip from picture   kept
  7.00  padding-top   ...on top of the line box's OWN 3.75px of half-leading
 29.60  viewport min-height (1.85rem) for a line box of 28.944px  0.66 dead
  5.00  .fs-footer margin-top ...on a footer that is 0px tall and has NO
        CHILDREN whenever the fact carries no breadcrumb          5.00 dead
  0.00  the footer itself
  6.00  padding-bottom ...on top of another 3.75px of half-leading
= 60.49px of strip for 28.94px of fact
```

Every number is now the content's own: floor and ceiling are **one line** and
**two lines** written as that arithmetic (`1.34rem × 1.35`) rather than rem
values that round to it; padding is 2px, which with the line's own half-leading
gives a symmetric 5.75px of air inside the rule; an **empty footer stops charging
for a margin above nothing** (`:empty{display:none}`).

| case | before | after | Δ |
|---|---|---|---|
| one line, no credit | 60.5px | **46px** | **−24%** |
| one line + credit | 77.5px | **68px** | −12% |
| two lines, no credit | 88.8px | **75px** | −16% |
| two lines + credit | 105.8px | **96.8px** | −9% |
| **`--fs-strip-reserve`** (what the fit books) | **108px** | **97px** | −11px |

The reserve is the second place the strip's height is spent — an over-booked
reserve makes the picture permanently shorter than the room can afford. **The
eleven pixels go back to the picture** (verified: the entry cap moved 361 → 372).
It is re-derived from the rules that set it, not adjusted.

**And the fade mask was eating a line it was never meant to touch.**
`.fs-viewport` inherits `mask-image:linear-gradient(#000 80%,transparent)` — a
fade written for the frames whose viewport is 3 or 4 lines, where a PARTIAL line
is visible and softening its cut is the point. In this wing the box is a whole
number of lines, so a third line begins exactly at the bottom edge and is clipped
**entirely** — the fade cannot soften what is not there. What it actually did was
dissolve the bottom 40% of line TWO, which always fits. The feather is now **4px**,
inside the line box's own 3.75px of trailing half-leading, so it cannot reach a
glyph that fits and still soft-edges a genuine cut.

**Four lines at stacked widths**, for the plain frame's own stated reason: at
390px a line holds a third of the characters, so a two-line ceiling that is
generous on a desktop truncates on a phone. Same trade `--fs-lines:4` already
makes for the plain frame at the same breakpoint. Verified at 390: strip 97px,
4-line ceiling active.

**/robots renders no scroller at all** (verified live: no `.fs-wrap`), so the
shared `[data-flat="1"]` rules cannot touch it. **/hr keeps its own frame
byte-for-byte** (verified: reserve `0px`, viewport `--fs-lines:3` at 87px,
`max-height:none`).

---

## V3 — arm, then fire

**Mike's ruling, implemented exactly.** Verified on the built page, all four
cases, by reading which row carries which class:

| step | expected | `tl-active` | `tl-playing` |
|---|---|---|---|
| idle | — | −1 | −1 |
| click A | **plays A** | 0 | 0 |
| click B while A plays | **selects B, does not interrupt** | 1 | **0** |
| click B again | **plays B** | 1 | 1 |
| click B a third time | no change | 1 | 1 |

**Why this is right and not merely asked for.** A tracklist beside a running
player does two jobs at once — it is the transport AND the index you read while
listening — and single-click-plays makes the second impossible: every attempt to
look at what else is here stops the music. Arm-then-fire returns the browsing
gesture without taking the playing gesture away, and costs one extra press only
when the visitor is already listening.

**It is a gate, not a new path.** The selection the new branch writes is the same
`albumActiveTrack` entry the play branch writes, so the viewer, the face, the PUV
context and the variant dropdown all follow the armed row exactly as they follow a
played one. The second click falls straight through and plays.

**The variant picker obeys the same law.** Picking a variant on the ACTIVE row
used to start it playing outright. Under V3 a row can be active without being the
row you are hearing, so that shortcut became a way to interrupt the music from a
control that never said it would — the exact interruption the ruling exists to
stop. It now fires only where it plainly means "play this": nothing running, or
this IS the running row and the visitor is swapping which cut plays.

### The two marks, made legible

Both states drew the **same 2px gold left rule** — `.tl-playing`'s from CSS,
`.tl-active`'s from an inline style in the JSX — leaving the whole distinction to
a background gradient. Under V3 those are different rows most of the time.

- **armed** = `--wb-gold-lo` rule + soft ground
- **running** = full `--wb-gold` rule (`!important`) + gradient + the bars in the
  number slot

Measured on /wal: armed `rgb(87,84,77)`, running `rgb(33,31,28)`. One ramp, two
ranks — no new colour, no new element, no label.

**The inline style had to go, not just change colour.** An inline value outranks
every stylesheet rule that is not `!important`, which had silently killed the
`@media (max-width:720px)` rule written to make the selected row loud on a phone.
With the mark in CSS the cascade can rank all three statements properly. On a
phone the 14% wash still does the shouting; the rule stays at the armed rank so
the two states separate where it matters most — the viewer is below the fold
there and the tracklist is the entire visible state.

**Wing scope: all of them.** V3 is in the shared engine, so /hr, /wb, /robots and
/wal get it. Mike's ruling names no wing, and /hr — twenty rows beside a running
player — is where the complaint bites hardest. Verified live on /hr: same four
outcomes, marks distinct.

---

## Gates

| gate | result |
|---|---|
| `npm run lint` | **11 errors / 9 warnings** — identical to HEAD baseline, zero new |
| `npm run build` | **green** (vite 8.0.7 + rolldown + Cloudflare plugin, 738ms) |
| desktop lap | 1706×810 CSS, dev server **and built bundle via `wrangler dev`** |
| 390px lap | genuine 390×740 viewport, same-origin iframe harness, **built bundle** |
| 390px horizontal scroll | **none** — `scrollWidth` 373 ≤ 390 on card and song faces |
| contrast audit | **zero AA failures**, 4 artists × 5 faces, re-run after the fix |
| /hr, /wb, /robots | strip rules and reserve unchanged; V3 verified working on /hr |

## Frames

`docs/v1-round-20260803/`

| file | what |
|---|---|
| `B1-ground-desktop-BEFORE.jpg` | Carsie · About the Artist — cream on charcoal, edge to edge |
| `A1-ground-desktop-AFTER.jpg` | the same face as a paper card on the dark stage |
| `B2-geometry-desktop-BEFORE.jpg` | the picture stranded in the column, 302.6px dead each side |
| `A2-geometry-desktop-AFTER.jpg` | after a width drag: 16:9, edge to edge, 1.6px |
| `B3-ground-390-BEFORE.jpg` | 390px — text on charcoal |
| `A4-ground-390-AFTER.jpg` | 390px — the sheet, mat stood down |
| `A3-track-click-marks-AFTER.jpg` | armed row and running row wearing different marks |

## Carry-forward — named, not fixed

- **The same five literals sit under /robots' sheet at the same numbers.** A real,
  pre-existing condition. Not fixed here because two of those rules also serve the
  PORTAL (`#0b0b0a` ground), where darkening the grey would be the same defect
  inverted. It wants its own scoped pass.
- **`--wb-gold-mute` is sub-AA on the museum's own paper ground** (`#9b978d` on
  `#d9d5ca` ≈ 1.9:1) wherever it is used outside a re-pinned scope.
  `museum-tokens.css` is off-limits without UX direction — this is that direction
  being asked for.
- **A backgrounded tab freezes CSS transitions and rAF**, so `getComputedStyle`
  reports a transition's START value and the FactScroller sits at `opacity:0`
  forever. Cost real time this round chasing a "transparent border" that paints
  correctly the instant the tab renders. **Verify animated properties from a
  screenshot, not from computed style.**
