# THE PORTAL — WHAT EXISTS TODAY

2026-08-26 · HEAD `6c80c1c`, `git status --short` empty · **READ ONLY, nothing
changed** · facts only, nothing proposed

**HOW THIS WAS ESTABLISHED, AND WHAT IT THEREFORE CANNOT SETTLE.** Everything
below is read from the working tree plus static measurement of the plates
(alpha flood-fill, luminance sampling). **Ops did not load the page** — serving
it is a host command and Mike runs those. OPERATIONS §0 says reading code is not
evidence and the only oracle for a rendered thing is a rendered thing, so the
three items marked **UNLOOKED** below are read-from-code and are not closed.

---

## 1 · WHAT THE PORTAL IS TODAY

**Five files, and the album is public.** It was held from launch; `efc379f`
opened the door and `docs/MUSEUM_PORTAL_PUBLISHED_LOG-20260822.md` records the
walk. The Portal is live at weird.baby.

| file | lines | what it is |
|---|---:|---|
| `src/data/artists/portal.js` | 461 | the album, the two tracks, the whole panel declaration, the bezel geometry |
| `src/routes/exhibit/Exhibit.jsx` §`InstrumentPanel` | 1310–1745 | the panel renderer, the channel resolver, `openChannel` |
| `src/routes/robots/PortalScreen.jsx` | 118 | the bezel + the channel strip, drawn over whatever is on the glass |
| `src/routes/robots/PortalScreen.css` | 105 | the strip's geometry and its ON state |
| `src/routes/robots/RobotsExhibitFlow.jsx` | 32,982 B | the overlay host; the three-way ternary |
| `public/robots/twin.html` | 646,521 B | the machine itself |

**WHAT A VISITOR DOES, IN ORDER.** `/robots` → album 2, `The Portal` → track
`Portal` → an instrument panel (`ABEAL` badge · FEED stepper · four ANTENNA
sliders · SOURCE dial · LATCH) → LATCH opens a full-screen overlay on **channel
1** → the strip `1 2 3 4 X` picks the channel → `X` or Escape leaves.

**THE ONE RESOLVER.** `resolveChannel()` (`Exhibit.jsx:1370`) returns one of
four words on a priority per channel: television if the switch is `1`; else the
machine if `unit`; else the test signal. The strip **asks**
(`wb-portal-select-channel`), the panel **answers** with the same payload the
latch sends (`Exhibit.jsx:1563–1621`). There is exactly one resolver, which is
what canon §11 ruled.

---

## 2 · THE LIMITED-CONTROLS REQUIREMENT

**IT IS NOT WRITTEN ANYWHERE. THAT IS THE FINDING.**

`predefined` · `limited selection` · `limited predefined` · `control surface` ·
`requirement` — grepped across `docs/canon/`, `docs/canonical/`, all four
`MUSEUM_PORTAL_*` documents, `MUSEUM_PANEL_*`, `portal.js`, `twin.html`, and
the whole of `weird-baby-robots`. **Zero hits.** There is no rule to quote.

**WHAT STANDS IN ITS PLACE ARE THREE REAL THINGS, AND KILLING THE REQUIREMENT
MEETS ALL THREE.**

**(a) A GEOMETRIC BUDGET — and this is the load-bearing one.** The controls are
not floating on the glass; they are fitted into **THE PANEL**, the measured
blank lower-right quadrant of the family shot (`twin.html:386–393`):

```
px    x 1498..2630   y 1207..2063        (1133 x 857)
frac  L 49.933%  R 87.700%  T 50.292%  B 86.000%
centre 68.817%, 68.146%     luminance min 102 median 182
```

*"The group is sized so it sits inside with ONE margin all round rather than
filling the panel edge to edge: 35.3 x 26.1cqw leaves 1.24cqw on every side."*
Later cut to 31.1cqw wide (`twin.html:844–860`). **The 2x2 and the strip
together already fill that quadrant to within ~1.24cqw a side.** Any control
added is added to a box that is full.

**(b) A FIXED SET, IN TWO HARD-CODED LISTS.**
- `MON_CTL` — four pairs, `twin.html:9861`
- `for(let i=1;i<=4;i++)` plus one `X`, `twin.html:9963–9980`
- the museum's mirror: `chList` from `antenna.channels` (four rows,
  `portal.js:341–349`) plus a hard-coded `X` at `PortalScreen.jsx:105`

**(c) AN INTERACTION VOCABULARY, stated once** (`twin.html:790–793`):
*"white label in a white-outlined box, nothing else. No icons. No hover.
INVERSE VIDEO while pressed, and that is the whole interaction vocabulary."*

**EVERY CONSUMER OF (a), NAMED.** All of these resolve against the quadrant's
numbers and move if the control count moves:

| where | what stands on it |
|---|---|
| `twin.html:877–908` | `--chy-w/h/gap/line/text/weight`, `--dig-h/gap/text/weight`, `--chy-round` |
| `twin.html:893–905` | `--stack-w` (31.1cqw), `--stack-h` (13.5cqw), `--grp-gap`, `--chy-cx` 68.817%, `--grp-top` **55.359%** (stated, not calc'd, because a calc mixing cqw and % on `top` resolves the halves against different axes), `--dig-top` |
| `twin.html:929–934` | `#monwarp` — the barrel-warp wrapper **is sized to the group**; a filter warps about the element's own centre, so the wrapper's bounds ARE the group's bounds |
| `twin.html:9866–9917` | `CHY_M` + `Chy_Knock` — each knockout SVG's `viewBox` is stated in that button's own cqw dimensions so `mask-size:100% 100%` cannot distort the letterform |
| `PortalScreen.css:29–44` | `--dig-*`, `--strip-w:31.1cqw`, `--strip-left:calc(68.817% - 31.1cqw/2)`, `--strip-top:calc(55.359% + 15.2cqw)` — **hand-copied from the twin's numbers**, with the file's own instruction *"Retype nothing: if the twin's strip is ever re-measured, these come with it."* |
| `PortalScreen.css:82–98` | `.ps-note` hangs off `--strip-left/--strip-top/--strip-w` |
| `twin.html:9951–9985` | `Framed()` — inside the museum the twin **deletes its own digit strip** and keeps the 2x2 |
| `twin.html:10203–10204` | `Feed_Select` lights the strip; `monFeed` is read by the glitch weather at two other sites |

**AND ONE THING THAT WAS PUT TO MIKE AND NEVER ANSWERED.**
`MUSEUM_PORTAL_CHANNEL_SELECTOR-20260821.md` §4.1 asks whether `X` is *the fifth
position — off*. It closes: *"Worth Mike confirming rather than inheriting."*
It was inherited.

---

## 3 · THE CHANNELS

`portal.js:341–349`. A switch at `1` is **ANT** (television); at `0` it is
**CAB** (hardwired). Default routing is **`1111`** — every channel taken.

| ch | `unit` | at ANT | at CAB | how it is drawn |
|---:|---|---|---|---|
| 1 | false | television | test signal | `Television.jsx` / `TestSignal.jsx`, `place:"feed"` |
| 2 | false | television | test signal | same |
| 3 | **true** | television | **the twin** — `L.src` = `/robots/twin.html` | `<iframe>`, `place:"canvas"` |
| 4 | **true** | television | **the close-up photograph** — its own `src` | `<iframe>`, `place:"canvas"` |

### CH3 — WHY THE RESIZE IS VISIBLE

**It is a two-stage layout, gated on an asynchronous image probe.** In order:

1. The iframe navigates to `twin.html`. The document parses and lays out at
   `#unitstage{ margin:10px auto; max-width:min(96vw,880px) }`
   (`twin.html:157`) — **a small, centred stage**.
2. `tryMonBase()` fires an `new Image()` probe for the base photograph
   (`twin.html:754–780`) — **a network round trip**.
3. `probe.onload` → `Framed_Fit()` (`twin.html:9768`, defined `:10008`) injects
   a `<style>` at that moment:
   `body.framed #unitstage{max-width:none!important;width:100%!important;margin:0!important}`.
   **The stage jumps from 880px to the full overlay width.**
4. Then `Portal_In` → `Portal_Build` → `Portal_Layout()` →
   `Portal_Size_Set(Portal_Size_Load())` → `Portal_Size_In()` → `Portal_Grip_In()`
   → `Feed_Weather_Init()` → `Feed_Select(1)` (`twin.html:10630–10641`).

`Framed_Fit`'s own header already names the cause of the first half: *"this is
the half that ONLY A SCREENSHOT COULD HAVE FOUND… art at 880px under a bezel at
the overlay's width, with black showing between them."* **The fix put the jump
on the far side of a network load rather than removing it.**

### CH4 — WHY IT DOES NOT RESIZE

**The art is right and the element is wrong.**

- `MGK-TWIN_MONITOR_CLOSE_UP.png` is **3000 x 2400** — the same canvas the bezel
  was cut from — and **it registers with the bezel**. Measured: sampling eleven
  rows across the bezel's opening, the plate's own frame shows a ring of **0 px**
  at nine of them (the two non-zero rows are the camera body in the picture, not
  a frame edge). `place:"canvas"` is therefore correct for it.
- It is loaded into an **`<iframe>`** (`RobotsExhibitFlow.jsx:454–458`), because
  the machine branch is the ternary's `else`.
- **`object-fit` does not apply to an iframe.** `PortalScreen.css:53` sets
  `object-fit:cover` on `.ps-feed iframe`; it is inert.
- The document inside is **the browser's own image viewer**, whose scaling rule
  is the browser's, not the museum's — and **`Framed_Fit()` never runs**, because
  an image document has no script.

**Two source comments are STALE on this and are flagged, not fixed**
(`RobotsExhibitFlow.jsx:426–428` and `Television.css:4–5`): both still say
channel 4's photograph and the drawn channels carry *"no controls, no close
button… the way out is Escape."* Since 2026-08-21 `PortalScreen` draws the strip
over all three kinds.

---

## 4 · THE CONTROLS — THE PORTAL'S AND THE MGK'S

**THEY ARE TWO COMPONENTS, NOT ONE, AND THAT IS BY RULING.** The selector doc's
shape **A** was taken: the museum owns the strip; the twin suppresses its own
when framed (`twin.html:9951–9985`). Its stated cost, written down at the time:
*"Costs a second strip that must match the twin's bezel exactly, or drift."*

**THE GEOMETRY DOES NOT DIFFER.** Both resolve to 5.26 x 5.26cqw squares,
1.2cqw gaps, 31.1cqw strip, centred on 68.817%, top 55.359% + 15.2cqw. Same
arithmetic, typed twice.

**THE DRESS DIFFERS IN SEVEN WAYS.** Everything the MGK's `.chy` carries that
the Portal's `.ps-chy` does not:

| MGK `.chy` (`twin.html:944–971`) | Portal `.ps-chy` (`PortalScreen.css:67–78`) |
|---|---|
| **THE CHYRON HALO** — three `text-shadow` layers: white glow `.30cqw/.45`, dark halo `.12cqw/.80`, drop `0 .04cqw .07cqw/.55` | none |
| **the hairline dark ring** — `box-shadow:0 0 0 .05cqw rgba(18,18,18,.38)` | none |
| the label rides a `.chytxt` span so the pressed state can hide it | text is a bare child |
| `:hover{background:transparent;color:#fff}` — hover explicitly neutralised | no hover rule |
| `:focus,:focus-visible{outline:none}` | `:focus-visible{outline:1px solid #fff;offset 2px}` |
| `overflow:hidden`, `user-select:none`, `box-sizing:border-box`, `background-size:100% 100%` | `min-width:0` only |
| **`--knock`** — a per-button SVG built at boot | none |

**The halo is not decoration.** Its own note records the measurement: white on
the family shot's quadrant is *"about 1.6:1 — the words all but vanished."*

**AND THE 2x2 IS ABSENT ENTIRELY.** `SCROLL / CLICK / POWER / SHAKE` exist only
inside `twin.html`. `PortalScreen.jsx:38–41` states the reason:
*"there is no machine to control while television is playing."*

---

## 5 · THE REVERSE-VIDEO DEFECT — MEASURED

**WHAT DRAWS IT.** `PortalScreen.jsx:92–102` puts `ps-on` on the button whose
number equals `ch`. One CSS line does the rest:

```css
/* PortalScreen.css:79 */
.ps-chy.ps-on{background:#fff;color:#000;font-weight:var(--dig-weight-on)}
```

**A white slug with the numeral painted SOLID BLACK. That is the "filled in".**

**WHAT THE MGK DOES INSTEAD** (`twin.html:1030–1038`) — five declarations:

```css
.chy.chydown        { background-color: rgba(18,18,18,.34);   /* the scrim */
                      color: transparent; text-shadow: none; border-color:#fff }
.chy.chydown .chytxt{ visibility: hidden }
.chy.chydown::before{ inset:0; background-image: var(--knock);
                      background-size:100% 100% }
```

`--knock` is an SVG built by `Chy_Knock` (`twin.html:9872–9916`): a white `rect`
masked by a `<mask>` containing the glyph in black — so **the numeral is a
transparent hole** and the picture, dimmed 34%, moves through the letterform.

**THE DIFFERENCE, IN ONE LINE:** MGK = a hole. Portal = ink.

**AND THIS EXACT DEFECT IS ALREADY RULED, TWICE, IN THIS TREE.**
- **T4, 2026-07-29** (`twin.html:975–1010`): *"the real finding is that **BLACK
  INK WAS NEVER A KNOCKOUT**, on either."*
- **S2, 2026-07-30** (`twin.html:1015–1028`): *"a knockout that looks like ink
  has not knocked anything out as far as the eye is concerned."* Measured then:
  glyph 84.6 against slug 234.6; the scrim was cut `.62 → .34` to land it near
  133 so the feed's own texture carries through.

**The Portal's strip was built on 2026-08-21 with neither ruling applied.**

Two dead hooks, noted: `ps-chy-x` and `chy-x` have **no CSS rule anywhere**.
There are **no transitions** on either strip, so "keeps getting filled in" is
not an animation.

---

## 6 · THE BEZEL AND THE 4:3 CROP

**WHAT THE BEZEL IS.** `MGK-TWIN_MONITOR_SCREEN_BEZEL.png`, 3000 x 2400 RGBA — a
barrel-curved black CRT frame cut out on transparency. It is the top layer:
`.ps-bezel{z-index:1}` over `.ps-feed{z-index:0}`, which is what makes the
opening a **crop** rather than a border.

**MEASURED THIS ROUND** (flood-fill from the border to separate the outside
transparency from the interior opening):

| | x | y | size | ratio |
|---|---|---|---|---|
| **the opening, measured** | 231..2762 | 206..2208 | **2532 x 2003** | **1.2641** |
| the feed rect, declared (`portal.js:410`) | 227..2766 | 194..2229 | 2540 x 2036 | 1.2475 |
| the canvas | 0..2999 | 0..2399 | 3000 x 2400 | 1.2500 |

**THE DECLARATION'S OWN CLAIM VERIFIES: 0 opening pixels fall outside the feed
rect.** The overscan is real and is what makes any picture legal there.

**WHAT SITS BEHIND IT — two placements, and they behave differently.**

- `place:"canvas"` (CH3 the twin, CH4 the photograph) — inset 0, the full
  3000 x 2400. Both are cut on that canvas and register with the frame. **No
  letterbox.**
- `place:"feed"` (television, test signal) — the measured rect, 2540 x 2036.
  **The test signal is drawn, so it fills. Television does not.**

**TELEVISION IS THE ONE THAT IS SHORT TODAY, and the arithmetic is exact.** The
YouTube API's iframe is 100% x 100% of `.ps-feed` = 2540 x 2036 canvas px. The
reel is 16:9 and the player letterboxes it:

```
picture drawn   2540 x 1428.75
black bar       303.6 px top and bottom   = 14.9% of the opening's height EACH
                                             29.8% of the opening, total
```

To fill the opening's height the picture would scale to 3619.6 wide — **cropping
1079.6 px of width, 539.8 a side, 29.8% of the frame.**

**WHAT "THE CENTRE 4:3 AREA" RESOLVES TO, in real pixels.** The opening is
1.2641 — **narrower than 4:3 (1.3333)** — so a 4:3 region inscribed in it is
width-bound and loses height:

| taken against | centre 4:3 region | what is lost |
|---|---|---|
| the measured opening (2532 x 2003) | **2532 x 1899**, y **258..2156** | 52 px off the top and 52 off the bottom |
| the declared feed rect (2540 x 2036) | **2540 x 1905**, y **259.5..2164.5** | 65.5 px each |
| the 3000 x 2400 canvas | **3000 x 2250**, y **75..2325** | 75 px each |

**Which of the three he means is a visual call and is not Ops'.**

---

## 7 · WHICH ITEMS ARE ALREADY RULED

| his item | already ruled? | where |
|---|---|---|
| **Album art lacks controls** | **the same complaint as an unbuilt half of an existing ruling.** MIKE 2026-08-21: *"Channels are selected on the portal screen, **along with shake, power, etc.**"* The channels half shipped; the *shake, power, etc.* half did not. | `docs/canon/06-PORTAL.md` §11 |
| **KILL "Television on this channel"** | not ruled. String at `portal.js:367`; register row `ceef789ffa98df27`, class **HOUSE** — Ops' words, so it is his to strike. Its two siblings (`SIGNAL PRESENT.` / `TEST SIGNAL. NO UNIT ON THIS CHANNEL.`) are unaffected. | `provenance/register.json` |
| **Enlarge behind the bezel to centre 4:3** | not ruled, and it **cuts against a standing one**. MIKE 2026-08-21: *"standard 60s CRT"* — quoted at `portal.js:406` and `PortalScreen.jsx:29`, and the reason `cover` + overscan was chosen. | `portal.js:399–411` |
| **Controls identical to the MGK's** | **ruled once, and the divergence was priced in writing.** Shape **A** was taken knowing it *"costs a second strip that must match the twin's bezel exactly, or drift."* | `MUSEUM_PORTAL_CHANNEL_SELECTOR-20260821.md` §0 |
| **CH3 resize behind cover** | **predicted, in writing, before it shipped.** *"If the reload turns out to be visible — a flash, a re-layout, a lost menu — **B is the fallback and the reason to reach for it is measurable, not theoretical**."* Shape **B** = keep the twin mounted, hidden. | same doc, §5 |
| **CH4 fails to resize / no controls** | not ruled. | — |
| **Reverse video, stop the fill** | **RULED TWICE AND BOTH RULINGS ARE IN THE TREE** — T4 (2026-07-29) and S2 (2026-07-30). The Portal's strip was built without either. | `twin.html:975–1028` |
| **ADM-3A style** | not ruled anywhere — `adm3a` / `ADM-3A` return **zero hits in both repos**. **It supersedes *"standard 60s CRT"*** and would move the plate every registered number in §6 is measured off. | — |
| **Rename to `Launch the Portal`** | **RULED, TWICE, THE OTHER WAY.** *"The tracklist DELETES `Portal` and RENAMES `Portal Feed Controller` to `Portal`. One track, not two."* Ruled 2026-08-13, **re-confirmed 2026-08-20**, applied 2026-08-20 — and canon carries a correction entry because Ops recorded it backwards once already. | `docs/canon/06-PORTAL.md` §4 |

**WHAT A RENAME TOUCHES:** `portal.js:133` (the title), register row
`96a0abf5cdd448c6`, and canon §4 which records the superseded ruling. **The `id`
stays `portal`** — OPERATIONS §0: *NO ID MOVES WHEN A LEGEND IS RECUT*.

---

## UNLOOKED — three items no static read can close

1. **CH4 "lacks onscreen controls."** By code the museum's `1 2 3 4 X` strip
   **is** drawn on CH4 (`bezel` rides every kind; `place:"canvas"`; `.ps-strip`
   at `z-index:2` above the bezel). Mike reports otherwise. Either the reading
   is *the 2x2 is missing* — same as the Album-art item, and the unbuilt half of
   canon §11 — or something suppresses the strip that the source does not show.
   **Not resolvable without loading it.**
2. **How visible the CH3 jump actually is.** The two-stage layout is certain from
   the code; its duration is a network fetch and was not timed.
3. **What the reverse-video ON state looks like at size.** The CSS difference is
   certain; whether Mike is describing the ink or something else about it is not.

**Serving the page is a host command.** `npm run mock` never reads `req.method`
and `npm run dev` is the ordinary route; OPERATIONS §8 requires any mock be
served, never `file://`.
