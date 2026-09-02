# THE PORTAL — MODE A / MODE B, AND THE FOUR QUESTIONS

2026-08-26 · HEAD `6c80c1c`, tree clean · **READ ONLY, nothing built**
Supersedes §2(a) of `PORTAL_ESTABLISHMENT-20260826.md` on one number.

---

## 0 · THE CORRECTION — THE QUADRANT IS 59% FULL, NOT FULL

**Ops quoted a struck number.** The survey said *"leaves 1.24cqw on every side"*
and called the box full. That sentence is the **P2 polish note of 2026-07-29,
which P2b superseded hours later** when the button width was cut 16.90 → 14.8cqw
and the group narrowed 35.3 → 31.1cqw. The tree states the live figure eleven
lines further down and Ops read past it (`twin.html:903–905`):

> *"Panel margins land at 3.34cqw left and right, 4.06cqw top and bottom."*

Re-derived independently and it agrees:

```
PANEL   37.77 x 28.57 cqw   (1133 x 857 px on the 3000-wide canvas)
GROUP   31.10 x 20.46 cqw
SLACK   3.33 cqw a side horizontally  = 100 px
        4.05 cqw a side vertically    = 122 px
        the group occupies 59.0% of the panel by area
```

**Mike's shot is right and the survey's conclusion was wrong.** There is room,
and the constraint §2 went looking for does not exist in writing either. Nothing
else in the survey depends on that sentence.

---

## a · WHAT EACH CHANNEL HAS TODAY, CONTROL BY CONTROL

CH3 is the only one that carries anything from the twin, **and only because
those controls live inside the twin's document.** `Framed()` deletes
`#monlayout` (the digit strip) and leaves `#monctl` (the 2x2) — `twin.html:9951–9985`.

| on the glass | CH3 twin | CH4 photo | CH1/CH2 test | any ch at ANT (TV) |
|---|:--:|:--:|:--:|:--:|
| museum bezel `.ps-bezel` | ✔ | ✔ | ✔ | ✔ |
| museum strip `1 2 3 4 X` `.ps-strip` | ✔ | ✔ | ✔ | ✔ |
| museum note `.ps-note` | `SIGNAL PRESENT.` | `SIGNAL PRESENT.` | `TEST SIGNAL. NO UNIT…` | `TELEVISION ON THIS CHANNEL.` |
| **SCROLL / CLICK / POWER / SHAKE** (`#monctl`) | **✔** | ✘ | ✘ | ✘ |
| POWER's latched state (`Mon_Power_Sync`, 200ms) | ✔ | — | — | — |
| scanlines on the feed rect (`#unitstage::after`) | ✔ | ✘ | ✘ | ✘ |
| the barrel warp (`#monwarp`) | ✔ | ✘ | ✘ | ✘ |
| feed weather / glitch profile | ✔ (see below) | ✘ | ✘ | ✘ |
| the tear **band** | ✔ | ✔ | ✔ | ✔ |
| the tear **slip** on the picture | ✔ | ✔ | **✘** | **✘** |
| placement | canvas | canvas | feed | feed |
| element | `<iframe>` | `<iframe>` | React node | YT `<iframe>` |

**THE SCANLINES REGISTER EXACTLY, WHICH IS WORTH KNOWING BEFORE ANYTHING MOVES.**
`body.portal` sets `--feed-l:7.5667% --feed-t:8.0833% --feed-w:84.6667%
--feed-h:84.8333%` (`twin.html:536`). Against `portal.js:410`'s rect on the
3000 × 2400 canvas: 227/3000 = 7.5667%, 194/2400 = 8.0833%, 2540/3000 = 84.6667%,
2036/2400 = 84.8333%. **Identical to four places.** Two files, one measurement,
and they have not drifted.

**THE TEAR SLIP IS ON THE `<iframe>` ONLY** — `RobotsExhibitFlow.jsx:455`. The
band spans the whole view as canon requires, but on television and the test
signal the picture does not move under it, so the rip reads as a bar laid on a
still rather than as a seam. That is already a divergence from ruling 2.

**AND `monFeed` IS PINNED AT 1 INSIDE THE MUSEUM, SILENTLY, SINCE 2026-08-21.**
`Feed_Select` has exactly three call sites: `devLayout` (unreachable framed —
the strip that called it is deleted), the definition, and `Feed_Select(1)` at
boot (`twin.html:10639`). So the per-feed weather (`FEED_PROFILE`, quality,
wobble, drift, glitch rate) **collapses to profile 1 and stays there.**
`MUSEUM_PORTAL_CHANNEL_SELECTOR-20260821.md` §2 predicted this in the row marked
**WATCH IT** — *"monFeed pins at 1 for ever and the weather quietly collapses to
one profile. Not dead — changed, and it must not change silently."* It changed
silently. **Flagged, not fixed.**

---

## b · WHAT SCROLL AND CLICK DO, AND WHAT THE RULINGS WOULD MEAN

### They are the MGK's two real input devices, not decorations

They are wired into the emulated firmware's `5_INPUT.ino`
(`twin.html:2044–2058`). `SHUTTER` and `ROTARY_DIAL` are `Device_Manager` slots
with a `BUFFER_VALUE`:

```js
function devRotary(){  if(!unitPowered){Dev_Ack("OFF",…);return;}
                       if(rotaryPending<1)rotaryPending++;  Dev_Ack("SCROLL","one detent queued","run"); }
function devShutter(){ if(!unitPowered){Dev_Ack("OFF",…);return;}
                       if(shutterPending<1)shutterPending++; Click_Flash();
                       Dev_Ack("CLICK","shutter queued","run"); }

HW_Rescan_ROTARY_DIAL(){ if(rotaryPending>0){rotaryPending--; …=FULL; PlaySound(Scroll);} }
HW_Rescan_SHUTTER()   { if(shutterPending>0){shutterPending--; …=FULL; PlaySound(Select);} }
```

- **Edge-queued, depth 1** — *"hardware loses edges while buffer FULL; twin drops
  beyond 1 queued (closest match, flagged)"* (`twin.html:1792`).
- **Both refuse on a dead machine** with a Dev_Ack, `[X1]`.
- **Both are also on the keyboard**: ArrowDown → SCROLL, Enter → CLICK,
  Space → SHAKE (`twin.html:1815–1820`).
- `SCROLL` navigates the machine's menus; `CLICK` selects. They are how a
  visitor drives MGK-VIIIp, and they are the whole of its input.

**ONE MEASURED DEFECT IN `Click_Flash` ALREADY.** Its second half selects
`.btns button.ctl[onclick="devShutter()"]` (`twin.html:1810`) — but
`Mon_Controls_In` **moves the real button out of `.btns`** into `#monctl`
(`twin.html:9936–9942`), so that selector matches nothing once the controls are
on the monitor. The `#unitfront` half still fires (there is a `body.monbase
#unitfront.clickflash` rule at `:478`), so the tell survives at half strength.

### Ruling 3 — SCROLL changes channels

**It takes the machine's rotary away from the machine.** Inside the museum,
`devRotary` is the only pointing device MGK-VIIIp has on the glass; ArrowDown
would be all that is left, and a keyboard-only affordance is invisible — the
dead-control corollary of Doctrine 11 pointing the other way. Either SCROLL
carries two meanings depending on channel — **which is the exact fault
`MUSEUM_PORTAL_CHANNEL_SELECTOR-20260821.md` §3 argues against**, *"it gives ONE
control TWO meanings depending on context — the same class of thing that made a
`1` read as a channel this week"* — or the machine loses an input inside the
Portal and keeps it standalone.

Mechanically, changing channels means dispatching `wb-portal-select-channel`
with the next `ch` in `chList` — the strip's existing event, already resolved by
`openChannel` in one place. **The event exists; only the caller would be new.**

### Ruling 4 — CLICK causes a horizontal tear

**THE TEAR IS ALREADY BUILT, AND IT IS BUILT IN THE RIGHT PLACE.**
`RobotsExhibitFlow.jsx:72–141`, `[CR1 / FORK A (b) 2026-08-02]`:

- A band at `top:${y}%`, `height:${h}vh`, spanning the whole overlay, above
  everything — *"a tear can only cross both if both are the same surface."*
- The picture slips `translateX(slip)` for the same **130 ms**.
- **Deterministic by law** — no `Math.random` anywhere. A four-step script
  (`after` 26 s / 41 s / 33 s / 57 s, `h` 2.4 / 1.1 / 3.6 / 1.7 vh, `slip`
  +7 / −4 / +11 / −6 px) walked in order and wrapped; `y = 12 + ((i*37) % 74)`.
- *"RARE by design, tens of seconds apart, because a tear that happens often is
  a texture."*

**What ruling 4 changes is the TRIGGER, not the effect.** Today the tear is on a
timer bound to `twinOpen`. On CLICK it becomes an event. Two consequences worth
stating before anything moves:

1. **A press-driven tear stops being rare.** The script's whole argument is
   frequency; a visitor can press CLICK as fast as they like. Whether the timer
   survives alongside the press, and whether the script still governs `h`/`slip`
   or a press picks the next step, is undecided by the ruling.
2. **CLICK is inside the twin and the tear is in the museum.** The contract runs
   `postMessage({wb:"portal-close"})` twin → museum today; a tear would need the
   third word the selector doc already scoped (§1, *"`{wb:"portal-channel"…}` and
   the listener already exists"*). **Unless the 2x2 moves to the museum**, which
   is where rulings 1 and 2 point anyway — and then CLICK and the tear are in
   the same document and no message is needed at all.

### The absence of a reason is deliberate — and it must be written at the site

Mike: *"No reason, no explanation. Maybe someday we will learn why."*

This belongs at `RobotsExhibitFlow.jsx:72`, in the `[CR1]` block, **beside the
existing canon paragraph and not replacing it**. The existing block explains why
the tear is drawn *there*; it says nothing about why the tear *happens*, and a
later round reading it will find a well-reasoned mechanism with an unexplained
trigger and supply one. Doctrine 12 (**OPS DOES NOT INVENT CONTENT**) forbids
that, and Doctrine 11's corollary means a comment-shaped string is not
necessarily internal — this one is a comment and stays one. **An invented reason
is worse than none, and the note is what stops the invention.**

---

## c · CH4's IFRAME DEFECT

**The art is right, the rect is right, the element is wrong.**

- `MGK-TWIN_MONITOR_CLOSE_UP.png` is **3000 × 2400** — the bezel's own canvas —
  and **registers with it**: sampling eleven rows across the opening, the
  plate's own frame shows a ring of **0 px at nine of them**. (The two non-zero
  rows, y = 406 and y = 606, are the camera body in the picture.) So
  `place:"canvas"` is correct and no re-cut is needed.
- It loads into an **`<iframe>`** (`RobotsExhibitFlow.jsx:454–458`) because the
  machine branch is the ternary's `else`, and CH3 — an HTML document — shares
  it.
- **`object-fit` is inert on an iframe.** `PortalScreen.css:52–53` sets
  `object-fit:cover` on `.ps-feed iframe`; it does nothing.
- The document inside is **the browser's own image viewer**. Its scaling is the
  browser's, not the museum's, and **`Framed_Fit()` never runs** because an image
  document carries no script.
- The URL also picks up `?user=1&preset=standard` — meaningless to a PNG,
  harmless.

**THE RECEIVING CSS ALREADY EXISTS AND IS UNUSED.** The same rule already names
`img`:

```css
.ps-feed iframe,.ps-feed img,.ps-feed canvas,.ps-feed video{
  width:100%;height:100%;object-fit:cover;border:0;display:block}
```

And on `place:"canvas"` the rect is inset 0 and the art is exactly the canvas,
so `cover` would be a no-op — an `<img>` at 100%/100% fills it exactly, with no
scaling and nothing to measure twice.

**What is in the way is one fact about the seam:** `RobotsExhibitFlow`
deliberately knows nothing about what a channel carries, and today the only
discrimination is `kind`, decided in `openChannel`. CH3 and CH4 are both
`kind:"machine"` because both declare `unit:true`. **Distinguishing a document
from a picture is a new fact the overlay would have to be told** — and telling
it is data, not logic, in the same shape as `bezel` and `note`.

---

## d · THE SEVEN DRESS DIFFERENCES — AND WHETHER ONE COMPONENT SHOULD SERVE BOTH

### Ruling 2 answers this, and it answers it structurally

**"CH3's surface is the target for all four channels" cannot be satisfied by the
twin**, for exactly the reason the strip already left it. `MUSEUM_PORTAL_CHANNEL_SELECTOR-20260821.md`
§0: the overlay draws the three kinds as mutually exclusive branches, so
**leaving the machine unmounts the document the controls are in.** That argument
was made about `#monlayout` and it is the same argument, word for word, about
`#monctl`. A 2x2 that lives in the twin can appear on one channel of four.

**So there is one strip on the glass, the museum's, on all four channels** — and
the twin suppresses `#monctl` under `Framed()` exactly as it already suppresses
`#monlayout`, one `if` in a function that already has one.

**That collapses (d) from a reconciliation question into a transfer question:**
the seven differences are not two components disagreeing, they are the museum's
component **missing** seven things the MGK's carries. Nothing needs harmonising;
the dress needs carrying across.

### What must carry, and why each exists

| the MGK carries | why it is not cosmetic |
|---|---|
| the three-layer **chyron halo** | measured: white on the family shot's quadrant is *"about 1.6:1 — the words all but vanished"*. A broadcast chyron has always carried a dark edge because the station does not choose the picture. |
| the hairline `box-shadow` ring | the second half of the same fix |
| `--knock` + the `.chytxt` span + the 34% scrim | **the ON state itself** — see ruling 5 below |
| hover neutralised | *"No icons. No hover"* — the whole interaction vocabulary, `twin.html:790–793` |
| `outline:none` on focus | the museum's `:focus-visible{outline:1px solid #fff}` is a second white box inside a white box |
| `overflow:hidden` · `box-sizing:border-box` | the slug is an `::before` at `inset:0` and must not escape; *"the stated size IS the visible box"* |
| `background-size:100% 100%` | the hook Mike's button-art PNG set was parameterised for (`twin.html:797–801`) |

**THE GEOMETRY NEEDS NOTHING.** Both resolve to 5.26 × 5.26cqw squares, 1.2cqw
gaps, a 31.1cqw strip, centred 68.817%, top 55.359% + 15.2cqw. Same arithmetic,
typed twice — and `PortalScreen.css:4–8` already carries the instruction
*"Retype nothing: if the twin's strip is ever re-measured, these come with it."*
**That instruction is not currently enforceable by anything**, which is the drift
shape A was known to buy.

### Can literally one component serve both?

**No — and the reason is a standing constraint, not a preference.** The twin is
**single-file, no-network by law** (`twin.html:18`, Mike's own standing
constraint) and **must work with no museum** (selector doc §3). It cannot import
a React component and the museum cannot import a `<script>` from a 646 KB
document. *"The museum and the twin share NO CODE — only a contract about two
words."*

**So the honest shape is: one component ON SCREEN, two implementations on
disk** — the museum's for every framed view, the twin's for standalone, with the
twin's the reference. That is what ships today for the digit strip; ruling 2
extends it to the 2x2. **The cost is unchanged and it is drift**, and the only
thing that has ever caught drift in this pair is a person looking.

### Ruling 1 — reuse for Mode B

**Mode B already has a control surface and it is already unconstrained.** The
instrument panel (`InstrumentPanel`, `Exhibit.jsx:1454–1745`) is not inside the
monitor's quadrant, is not inside the bezel, and is not inside the overlay — it
is a face on a track, scaled to fit its frame. Four bays today: FEED (lit
readout + two steppers) · ANTENNA (four slot switches) · SOURCE (rotary knob
with **measured** pointer angles) · LATCH (+ lamp + state text), plus the ABEAL
badge and four screws at four different angles.

**WHAT IS REUSABLE, NAMED:**

- **The renderer itself.** It is data-driven from `face.panel` and *"does not
  know what a portal is, what MGK-VIIIp is, or why maintenance would be
  non-interruptible."* A new bay is a declaration, not a component — which is
  SAME EXCEPT DATA, the standing constraint.
- **The one arming rule**, evaluated in one place, and the resolver it feeds.
- **The `.ip-*` register** — screws, badge, engraved legends, lit readouts,
  lamps. Physical hardware.
- **`sessionStorage` persistence** (`panelLoad`/`panelSave`, `store` key), which
  degrades honestly on refused storage.

**WHAT IS RECOMMENDED AGAINST REUSING, and this is the substantive finding:**
**the chyron.** `.chy` / `.ps-chy` is the register of a **broadcast overlay keyed
onto a picture** — white outline boxes, inverse video, a knockout onto live feed,
a halo because the station does not choose the picture. Mode B is not on a
picture. Every reason the chyron looks the way it does is a reason about being
*over a tube*, and none of them holds on a control surface that is not.

**Ops' reading, offered not taken: reuse the panel wholesale, reuse the chyron
not at all.** Mike asked *"do what is best"*, and best here is that the two
registers already exist, are already distinct, and already mean two different
things — *the controls tell the story; they are not the story*.

---

## RULING 5 — CONFIRMED IN THE SHOT

The `3` is a white slug with **black ink**; POWER beside it carries the
**knockout**. One strip, two behaviours, one line apart:

```css
/* PortalScreen.css:79 — the museum's */
.ps-chy.ps-on{background:#fff;color:#000;font-weight:var(--dig-weight-on)}

/* twin.html:1030–1038 — the MGK's */
.chy.chydown        { background-color:rgba(18,18,18,.34); color:transparent;
                      text-shadow:none; border-color:#fff }
.chy.chydown .chytxt{ visibility:hidden }
.chy.chydown::before{ inset:0; background-image:var(--knock); background-size:100% 100% }
```

Ruled **T4 2026-07-29** (*"BLACK INK WAS NEVER A KNOCKOUT, on either"*) and
**S2 2026-07-30** (*"a knockout that looks like ink has not knocked anything out
as far as the eye is concerned"* — scrim cut .62 → .34 so the feed's own texture
carries through the letterform). **Neither reached the Portal strip on
2026-08-21.** No transitions on either strip; it is not an animation.

---

## THE ONE THING WAITING ON MIKE

**1. The track rename.** *"Launch the Portal"* reverses a ruling made
**2026-08-13, re-confirmed 2026-08-20, applied 2026-08-20** — *"the tracklist
DELETES `Portal` and RENAMES `Portal Feed Controller` to `Portal`. One track, not
two."* `docs/canon/06-PORTAL.md` §4 carries a correction entry because Ops
recorded that ruling backwards once already. **Ops is not reversing it on a note.
Your word, and the id stays `portal` either way.**
