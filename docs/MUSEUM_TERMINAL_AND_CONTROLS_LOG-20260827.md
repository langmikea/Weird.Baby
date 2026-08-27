# TERMINAL.EXE, THE CONTROL SETS AND THE BARREL — 2026-08-27 (second packet)

**Built from `8d32319` on top of the same tree's uncommitted work. Nothing
committed, nothing pushed, nothing deployed.** Mike reviewed the first packet
served — *"Overall looks good"* — and then ruled the whole of this packet in one
conversation, resolved a question at a time.

---

## 0 · THE NAMES GO FIRST, BECAUSE THEY CAUSED THE REST

**MIKE: "stop calling it Mode A and Mode B. This one is TERMINAL.EXE."**

**HE IS DESCRIBING A DEFECT, NOT A PREFERENCE, AND THE PACKET IS THE PROOF.**
"Mode A" never named anything — there is the television, the machine on channel
3, the test signal, and TERMINAL.EXE. Naming three surfaces after the fourth's
absence is what produced a single boolean called `controls` that turned the word
group and the digit strip on and off **together**, and that boolean is exactly
why the wrong controls were on the wrong screens.

**SWEPT: 17 substitutions across 8 files, all of them comment text.** Checked
before the sweep ran: **zero register rows have a visitor-facing string
containing "Mode A" or "Mode B"**, so nothing declared could move, and the
provenance gate re-run after it is the proof rather than the promise. The phrase
now survives in five sentences across three files — every one of them quoting
the ruling that retired it, which is where a retired term is named.

**`docs/MUSEUM_MODE_B_LOG-20260826.md` KEEPS ITS FILENAME AND IS NOT RENAMED.**
It is yesterday's round log and it is called what that round was called. A round
log is a diary of its own day; renaming one to match a ruling made afterwards
falsifies the record of what was true when it was written — which is the
`docs:numbers` gate's own instruction in as many words, *"correct the document —
and never a round log."* **Stated here so a later session does not tidy it.**

---

## 1 · THREE SURFACES, THREE CONTROL SETS

**MIKE: "it's OK for TV channels to have a different control set than the VIIIp
controls."** — and *do not force one strip everywhere*.

| surface | ruled | **measured on the served page** |
|---|---|---|
| Television | 1 2 3 4 X | `words: []` · `strip: 1,2,3,4,X` ✅ |
| Channel 3 | SCROLL, CLICK, SHAKE, 1 2 3 4 X | `SCROLL, CLICK, SHAKE` · `1,2,3,4,X` ✅ |
| TERMINAL.EXE | SCROLL, CLICK, X | `SCROLL, CLICK` · `X` ✅ |
| *test signal (not one of his three)* | — | read as television's, **stated not assumed** |

**THE BOOLEAN COULD NOT EXPRESS WHAT HE RULED.** `controls` gated both groups at
once, so *"SCROLL, CLICK, X"* — words but no digits — was **not expressible at
all**. It is two independent declarations now, `words` and `channels`, resolved
in the one file that knows which surface is up. **A flag that answers two
questions with one bit is the defect**, and his three sets are the proof.

**THE TEST SIGNAL IS A READING AND IS FLAGGED AS ONE.** He named three surfaces
and it is not one of them. It carries television's set because it is a
broadcast-shaped picture with no machine behind it: SCROLL would reach nothing,
and a visitor who lands on it needs a way OFF it more than on any other screen.
One word changes it.

### POWER CAME OFF — AND THAT WAS MEASURED BEFORE IT WAS CUT

**MIKE: "POWER COMES OFF the VIIIp's control surface."**

`Power_Standby()` in `twin.html` says in as many words that **the machine
arrives OFF and the POWER control starts it**. If that were the live behaviour,
removing POWER would have left channel 3 permanently dead. **It is not, and two
independent readings were taken before the word was deleted:**

- inside the frame, POWER never pressed: **`unitPowered = true`**
- the museum's own mirror: the slug carried `ps-on` and `aria-pressed="true"`

Every bank that arms declares `power:"on"` in `PORTAL_RECIPES`, so the preset
powers the unit and the control was never the only way in. **Reading the recipe
would not have been evidence; the page was.**

`unitOn`, the `ps-on` latch on that button and the `wb-portal-power` listener
went with it. **`twin.html` still POSTS that message** from `Mon_Power_Sync`
into a room with no listener — deliberate, because that document is single-file
by a standing constraint and its own chrome sync is not the museum's to remove.
Named at the removal site, because an event with no receiver cost the B7 round a
real minute once already.

### 1 2 3 4 X CAME BACK, AND IT IS A SCOPE RATHER THAN A REVERSAL

He ruled the digits away yesterday — *"You do not change channels, as there are
none"* — and then **got stuck: no way to change channel once he was in.** His
correction is a scope, and he said so: *there are no channels* was about **the
bare terminal**, not about the television.

**BOTH RULINGS STAND AND NOTHING FROM THE FIRST IS UNDONE.** `feedChannel` still
reads the aerial and still decides which channel RUN opens; TERMINAL.EXE still
carries no digits. What came back is the strip on the surfaces that HAVE
channels. The two answer different questions: **the console says which channel
the feed brings up, the set says which one you are watching.**

The event and its listener came back together, as they went. **The round trip
cost one line each way, which is the argument for having deleted both ends**: a
dead listener left in place would have made this restoration invisible in the
diff — the strip would simply have started working again with nothing recording
that a ruling had moved.

---

## 2 · TERMINAL.EXE — BOOT, CLEAR, PANEL, HALT

### 2.1 · THE SCREEN CLEARS

**MIKE: "Boot first — I like how the initial commands come up and the size they
come up at. THEN CLEAR THE SCREEN and draw the interface."**

Three phases. **The clear is a real clear**: the boot's lines leave the document
rather than scrolling out of view. Measured, in sequence, on the served page:

```
boot      skip present · panel 0 · lines ["> TERMINAL.EXE"]                      (typing)
panel     skip gone    · panel 1 · lines []           rows: FEED / ANTENNA / SOURCE / RUN
```

**THE PHASE IS DERIVED, NOT STORED, AND THE LINTER CAUGHT THE FIRST CUT.** It
held `phase` in state and moved it to "halt" from inside an effect watching
`halting` — `react-hooks/set-state-in-effect`, **the same rule this wing
corrected itself on in the 2026-08-26 round.** There is one piece of state per
real fact now (has the boot finished, how many lines are up) and the phase falls
out of those; the reset on the way into the halt is the documented
adjust-state-during-render pattern `feed-control.js` already uses.

### 2.2 · CGA-FAT, AND IT REPLACED A DIFFERENT COMPLAINT

**MIKE: "feel free to use more of a CGA fat graphic, then simple ASCII"** — and
what it settles: **"Using the CGA fat graphics on its freshly cleared screen
will address the problem"**, the problem being an inline menu of dimmed `>`
prompts.

Two weights, meaning two things: the **legend** is fat — `scaleX(1.62)`, bold,
tracked, the way a CGA text mode draws forty columns in the room for eighty —
and the **datum** is the boot's own simple ASCII. Solid block rules above and
below. **The `>` caret is off the panel rows** and stays on the boot, where he
likes it.

**ONE INK, AND THAT RULING IS UNTOUCHED.** CGA-fat is a letterform and a block
graphic, not a palette. Nothing here is brighter than anything else; the cursor
INVERTS.

**THE TWO COLUMNS ARE A GRID, NOT A PAD, AND THAT IS THE ONE NON-OBVIOUS
CHOICE.** A stretched `inline-block` keeps its UNSCALED layout width, so padding
the legend to N characters in JS and stretching it in CSS puts the datum column
N × 0.62 characters too far left — and compensating for that in CSS makes the
stylesheet depend on a constant in the component. **Two declarations that must
agree is the defect this repository keeps paying for.** The JS pad is gone.

### 2.3 · SCROLL AND CLICK — HE ARRIVED AT IT HIMSELF

**MIKE: "In the spirit of the VIIIp it should simply be scroll and click.
Scrolling takes you to the next changeable field and click changes it."**

He had asked for underlines or asterisks to mark the live fields, then replaced
his own idea and struck the marks with it: **"We don't have that problem now
that we're going with scroll and click."** He is right, and the reason
generalises: **a cursor that can only stand on a changeable field IS the mark.**

**MEASURED — the full rotation, seven stops, wrapping:**

```
ANT 1 → ANT 2 → ANT 3 → ANT 4 → SOURCE → RUN → FEED → ANT 1 → …
```

**CLICK acts on the stop it is standing on**, measured: FEED `PATCHED → COLD
START → FIRST RUN`; ANT 3 `1111 → 1101`.

**AND A NON-CHANGEABLE FIELD CANNOT BE HIGHLIGHTED, WHICH IS HIS ACTUAL
DEFECT.** Stepping FEED to `LAST STATE` (a bank that does not arm):

```
RUN reads   NOT READY        (in the open, where a visitor can see it)
rotation    ANT1 ANT2 ANT3 ANT4 SOURCE FEED     — six stops, RUN unreachable
```

**Saying no and being unselectable are the same statement made twice**, which is
what a control that declines silently fails to do. *"The fields that were
changing were the right fields"* — the set is unchanged.

**THE ROTARY DIAL IS STILL DOING ITS OWN JOB**, so the 2026-08-26 ruling
(*"scroll only does what it was originally designed to do"*) is intact rather
than bent — it moves a selection on the machine and on the terminal alike. **And
the case that ruling was written for has gone entirely**: television and the
test signal draw no SCROLL at all now, so there is no surface on which it
reaches nothing. **A control that is absent cannot read as an unfinished one.**

**CLICK TEARS WHERE IT IS THE SHUTTER AND NOT ON THE TERMINAL** — on the
terminal the press visibly changes a field, so it proves itself, and a rip on
every field change would be the texture the H-TEAR block exists to prevent. The
scripted tear is untouched everywhere.

### 2.4 · THE HALT

**MIKE: "X RUNS A VISIBLE CLEAN SHUTDOWN — quick, but it happens — then lands
back on the ALBUM."**

**IT IS THE BOOT PLAYED BACKWARDS AND IT INVENTS NO NOUN.** Same four lines
reversed, with the one word that had to change:

```
> PORTAL_2v16.CFG
> Closing......
> UNIX-6x Emulator
> TERMINAL.EXE
```

`TERMINAL.EXE` and `PORTAL_2v16.CFG` are Record 004's cracked-ZIP listing;
`UNIX-6x Emulator` is Record 005's line; all three are already declared MIKE.
**The six dots are his punctuation, carried from `> Loading......` as typed.**
`Closing` is Ops' word and **is filed HOUSE, not MIKE** — a word Ops chose must
not sit in his class, which is the whole reason the three-mark scheme exists.

**MEASURED, from the press:**

| t | |
|---|---|
| 110ms | the panel is gone |
| 220 → 770ms | the four lines type out in order |
| **880ms** | **the overlay closes — back on the album** |

*"Quick, but it happens"* — 880ms, four visible lines. **Escape runs the same
halt** (W2 preserved), and **the [X] on television and on the machine still
closes instantly**: a picture owes nothing on the way out; a program does.

**THE [X] ON TERMINAL.EXE IS A REVERSAL OF HIS OWN "Kill the [X] lower right. I
see no use for it here."** He has given it a use. His second complaint about it
— *"the format is poor (bright instead of matching the other text on this
screen)"* — is answered by where it now sits: a chyron on the glass beside
SCROLL and CLICK, in their register, not a bright mark over a terminal. With no
digits beside it, `flex-end` keeps it on the same pixel as ever.

---

## 3 · THE BARREL

**MIKE — ON: the test signal image, and the clickable controls overlaid on the
monitor. OFF: YouTube video, the VIIIp, and the terminal itself — "first pass,
explicitly."**

### 3.1 · THE SIGN WAS GOT WRONG ON PAPER FIRST, AND THAT IS THE THING TO KNOW

The intuitive `r' = r(1 + k·r²)` moves the CORNERS further than the mid-edge
points, which pulls every edge inward at its middle — **that is PINCUSHION.**
Barrel is the other sign. Checked on the border's own numbers before a line was
drawn (top-edge centre at r² = 0.64, its corner at r² = 1.28) and then
**verified on the rendered path**:

```
top edge   left corner (40, 30)   midpoint (200, 23.16)   right corner (360, 30)
```

**The midpoint sits 6.84 units ABOVE its corners — the edge bows outward.**
Barrel, confirmed from the geometry the browser actually drew. The corners are
pinned exactly where they were, so the card still fills the same rectangle and
only its interior bows.

### 3.2 · THE CARD'S GEOMETRY IS BENT, NOT FILTERED

Every mark on the monoscope is emitted through `bend()`. `<line>`, `<rect>` and
`<circle>` are gone: **42 paths, 0 straight primitives**, measured. A filter
over the finished card would resample hairlines that are already sub-pixel and
turn a 0.7-wide grid rule into mush; bending the coordinates keeps every stroke
one stroke wide.

**AND A MONOSCOPE IS THE ONE PICTURE THIS IS ABOUT.** Its whole job is to show
whether the geometry is right — the circle and the frame are there so an
engineer can see the tube bowing them. **A test card drawn flat on a curved
screen was the only object in the wing actively saying something false.**

### 3.3 · THE CONTROLS BEND, AND THE FIRST CUT BENT THEM THE WRONG WAY

Each button is nudged along its own radius by an amount proportional to r². It
is a `transform` and not a filter, deliberately: **a CSS filter moves the pixels
and leaves the hit area behind**, so a warped button would be clickable
somewhere it is not drawn.

**THE FIRST CUT USED `offsetLeft`/`offsetTop` AND WAS WRONG.** The stated reason
was that a transform does not change them, so the bend would be idempotent —
true, and beside the point: **`offsetLeft` is relative to the nearest POSITIONED
ancestor**, which for these buttons is `.ps-ctl` or `.ps-strip`, not the frame.
Every button measured from the corner of its own little group, read as *up and
left of centre*, and got pushed the wrong way. Measured:

```
SCROLL   translate(-30.32px, -26.33px)     ← and it sits in the lower-RIGHT quadrant
```

Rects give the right frame of reference; the idempotence `offset*` was chosen
for is bought back by clearing every transform before reading any of them.
**After the fix, on channel 3 — all in the right-bottom quadrant, all outward,
magnitude growing with distance from centre:**

```
SCROLL   0.38, 0.26        channel 1   0.85, 3.18
CLICK    3.93, 1.06        channel 2   2.04, 3.65
SHAKE    0.87, 1.21        channel 3   3.79, 4.45
                           channel 4   6.38, 5.59
                           [X]        10.12, 7.05
```

**The digit row bows outward monotonically across the strip**, which is what a
curved glass does to a straight line of buttons.

### 3.4 · OFF WHERE HE RULED IT OFF

Measured computed styles: the terminal's root, the terminal's panel, the feed
box and the slip wrapper all read `transform: none, filter: none`. Television
and the twin are inside those, untouched.

**TWO COEFFICIENTS, BOTH DECLARED, BOTH ONE NUMBER FOR HIM TO MOVE:** the card's
`BARREL_K = 0.08` and the controls' `BARREL_CONTROLS = 0.045`. They are separate
because the picture behind the controls is NOT bent on three channels of four by
his own ruling — a bend big enough to match a bent picture would read as the
controls sliding off a flat one. **`.ts-scan` and `.ts-band`, the card's raster
overlays, are NOT bent** — they are CSS gradients and bending them needs a
filter. Flagged, row **MD-b**.

---

## 4 · CH3's TOP SCREEN — REVERTED

**MIKE: "put it back how it was because at least it was readable, and at some
point we're going to have to talk about what we can do to make it larger and
more readable."**

Back to `10.9% × 6.625%`. **Verified served: `maskTop` and `maskFront` now
measure IDENTICALLY — 114.66 × 55.75** on a 1052-wide stage, which is 10.90% and
6.625% exactly. Before the revert the top was 20% larger than the front; they
are the same aperture again.

**WHY IT GOT WORSE WHEN IT GOT BIGGER, AND THIS IS WHAT THE NEXT CONVERSATION
STARTS FROM.** The glass is a fixed 128×64 canvas scaled into the box. Making
the box bigger adds **not one pixel of type** — it magnifies the same pixels, so
every baked-in scanline gap grows with them and the aliasing gets coarser. **The
type did not become larger; it became a larger picture of small type.**

**THE READABILITY QUESTION IS FILED, NOT SOLVED.** *"At some point we're going
to have to talk about"* is not an instruction to go and fix it, and the fix is
not a number in that rule: it is a font, a screen height, or a render scale
inside the emulator, and all three change what the machine draws. Row **MD-a**.

The measurement from this morning is kept at the site, because it is the ground
that conversation starts from: the photographed top window is **~304 × 108
image px** against an aperture of **327 × 159** — already wider and half again
as tall as the glass it sits on.

---

## 5 · NAMING — THE TITLE BARS ALREADY COMPLIED

**MIKE: "title bars take the short form too, matching the directory."**

**MEASURED ON THE SERVED PAGES, AND NOTHING NEEDED TO CHANGE:**

| route | `.wb-bar-room` |
|---|---|
| `/robots` · `/wb` · `/wal` · `/foundation` | `\Robots` · `\Music` · `\Worth a Listen` · `\Foundation` |
| `/shop` · `/booth` | `Gift Shop` · `Information Booth` |

That was his 08-26 point 2 and it was already built. **So today's ruling is
satisfied by the board having moved**: before this morning the board said
`Weird.Baby \Music` and the door said `\MUSIC`; now both say the same thing.

**THREE SURFACES STILL CARRY THE FULL FORM AND NONE IS A TITLE BAR. NOT
CHANGED — REPORTED.**

| surface | reads | what it is |
|---|---|---|
| `/robots` album banner | `Weird.Baby \Robots` | the wing's own SLEEVE title, `spine[wbr-logo].title`. Sits at y≈239, 225px BELOW the bar — measured, so it is not the bar |
| `/wal` FAQ subtitle | `WEIRD.BABY \WORTH A LISTEN` | a face subtitle |
| `/foundation` FAQ subtitle | `WEIRD.BABY \FOUNDATION` | a face subtitle |

The album banner is the likeliest thing he was looking at, and it is **the one
`f366d37` gave the full form deliberately**, with a stated reason ("THE WING'S
OWN SLEEVE TAKES THE FULL FORM"). Reversing a stated decision of his on an
inference about which element he meant is the move Ops does not make. **One word
puts any or all three into the short form.** Row **MD-c**.

---

## 6 · WHAT HE LIKED, AND WHAT WAS THEREFORE NOT TOUCHED

**MIKE: he likes the rolling dim horizontal line scrolling vertically, and the
tear staying inside the bezel.**

- **THE W9 ROLLING BAND IS UNTOUCHED.** It is `#maskTop::before` and it is why
  the front glass's feather was halved this morning **and the top glass's was
  not** — changing T's feather would have moved two things at once on a glass he
  had not mentioned. That call now reads as the right one.
- **THE TEAR IS UNTOUCHED.** Still `.ps-tear` inside `.ps-feed`, still a sibling
  of the slip, still cropped by the opening. No number in `TEAR_SCRIPT` moved.

---

## 7 · WHAT WAS NOT DONE, AND WHAT IS FLAGGED

- **THE TEST SIGNAL'S CONTROL SET IS A READING** (§1). One word.
- **`.ts-scan` AND `.ts-band` ARE NOT BENT** — CSS gradients, and bending them
  needs the filter the card's geometry was bent to avoid. Row **MD-b**.
- **THE READABILITY OF THE VIIIp's GLASS IS HIS CONVERSATION** — row **MD-a**,
  filed on his own words and deliberately not solved.
- **THE THREE FULL-FORM SURFACES** — row **MD-c**.
- **`instrument-panel.jsx` IS STILL UNMOUNTED AND STILL KEPT**, unchanged from
  this morning's note.
- **NO PIXEL SCREENSHOT**, and this round the hazard got worse in an instructive
  way — see §8.

---

## 8 · THE PANE WENT TO ZERO, AND EVERY EARLIER MEASUREMENT STILL STOOD

**THE BROWSER PANE'S VIEWPORT COLLAPSED TO `innerWidth: 0` PART-WAY THROUGH THE
ROUND.** Measurements taken earlier in the same session had returned real
geometry; after the collapse every rect in the document read `0`, up to and
including `.ps` at 0×0 and `.ex-root` at 16px.

**THE FIRST READING OF THAT LOOKED EXACTLY LIKE A REGRESSION I HAD JUST CAUSED**
— a collapsed screen, right after rewriting the component that sizes it, with
§8's *a circular size resolves to zero* sitting in the manual describing that
very element. **What settled it was walking the ancestor chain instead of
staring at `.ps`:** the whole document was zero, including elements this round
never touched, and `window.innerWidth` was 0 with `visibilityState: "hidden"`.
**The barrel effect's own guard had correctly declined to run** rather than
writing NaN into a style, which is the only reason it looked like nothing was
happening rather than like everything was broken.

**THE FIX WAS A SIZED SAME-ORIGIN IFRAME**, the rig the wing-names round used
for 390px work: `1280×800`, real layout, driveable. **Every geometric claim in
§3.3 and §4 was taken in it.**

**THREE MORE PROBE FAULTS, ALL THE SAME FAMILY:**

- **A period-6 scroll walk that should have been 7.** One MessageChannel turn
  was not enough for React to commit, so each sample read the previous cursor.
  Six settle turns per step and the rotation reads correctly. **The build was
  never wrong.**
- **`MutationObserver` reported 0 mutations** across a window in which the DOM
  demonstrably changed — its delivery rides the rendering steps, exactly as
  `ResizeObserver`'s did this morning.
- **A boot that looked stuck at one line for 8 seconds, then advanced.** The
  pane coalesces throttled timers into bursts, so the same boot completed inside
  one 1s `await` earlier and crawled later. **Neither reading is the wall-clock
  behaviour**, and the 420ms/190ms figures are stated as authored rather than as
  measured.

**AND ONE REAL DEFECT THAT LOOKED LIKE A PROBE FAULT AND WAS NOT:** the
`offsetLeft` frame-of-reference error in §3.3. It survived my own written
reasoning — the comment explaining why `offset*` was the right choice was
already in the file — and was caught only by reading the numbers it produced and
noticing the signs were negative for a control in the bottom-right quadrant.
**A stated rationale is not a measurement, and this one was wrong in the file
before it was wrong on the screen.**

---

## 9 · GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 7 warnings — baseline, zero new** |
| `npm run build` | green |
| `npm run build:launch` | green |
| `npm run provenance:gate` | **PASS** — 18 added, 5 pruned, 0 inbound RESTATED chains |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** — 0 findings |
| `npm run docs:numbers:gate` | **PASS** — 11 claims in 8 documents |

**THE LINTER FOUND TWO REAL DEFECTS IN THIS PACKET AND BOTH WERE FIXED RATHER
THAN SUPPRESSED**: `set-state-in-effect` on the phase, and a component created
during render (`Row`), which resets its subtree every pass — on a screen whose
whole job is a cursor sitting still, the one thing that must not happen.

**ONE INVENTED STRING WAS REMOVED RATHER THAN DECLARED.** The rebuilt SOURCE row
carried a `|| "SOURCE"` fallback legend that the code it replaced did not have.
A hard-coded stand-in is Ops writing a legend for a panel that failed to declare
one; the row draws what the declaration says, or nothing.

---

## 10 · THE REVERSALS THIS PACKET RECORDS

| ruled before | ruled 2026-08-27 | kept where the old rule was argued |
|---|---|---|
| **"Once running, Kill the [X] lower right. I see no use for it here"** | the [X] is on TERMINAL.EXE and runs a clean shutdown | `PortalScreen.jsx`, at the strip |
| **the four digits are gone from every surface** (this morning) | scoped to the bare terminal; they return on television | `feed-control.js`, `PortalScreen.jsx` |
| **POWER is one of the four controls** (2026-07-29, his 2×2 order) | POWER comes off | `PortalScreen.jsx`, at `MON_CTL` |
| **the top glass grows 20%** (this morning, his estimate) | put it back — it was readable before | `twin.html`, at `#maskTop` |

**Two of these reverse rulings made the same day**, which is what a review loop
is for. Each is recorded as his, both times, at the site — not as a correction
of Ops.
