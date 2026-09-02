# THE CHANNELS, THE TEARS AND THE BOARD — 2026-08-27

**Built from `8d32319` on top of the same tree's uncommitted Mode B and BIG
CHANGE work. Nothing committed, nothing pushed, nothing deployed.** Served and
driven throughout: `http://localhost:5173/robots` → the Portal album →
`01 TERMINAL.EXE`.

**Eight rulings. All eight built. Four of them are reversals of standing rules
and every one is recorded as a reversal, at the site where the old rule was
argued.**

---

## 0 · THE ONE THING THAT DECIDED THE ROUND, MEASURED BEFORE ANYTHING WAS BUILT

**MIKE: "You do not change channels, as there are none. The channels are
inherent to the feed, not the bare terminal program."**

The brief carried this as *the hole was in the ruling, and he has now closed it*.
Before touching it, the served page was asked what the four digits actually did:

| ANTENNA | pressed `3` on the picture | what changed |
|---|---|---|
| `1111` (the declared default) | the `3` lit | **nothing else — television again** |

**THE STRIP WAS A CONTROL THAT DID NOTHING, AND THE DECLARATION SAYS WHY IN ITS
OWN WORDS.** `portal.js` on the default: *"DEFAULT `1111` — every channel taken,
nothing listening."* Every position routed to ANT is television, so all four
buttons opened television. The listener worked (the BIG CHANGE round fixed that,
and that fix is untouched); the button worked; **there was nothing on the other
side of it to change to.**

So his ruling is not a preference about a control — it is the correct diagnosis.
The channel is a property of the FEED, and the strip was a second opinion about
a question the feed had already answered.

### WHAT WAS BUILT

1. **The four digits and `wb-portal-select-channel` are gone**, both ends
   together — an event with no dispatcher is the same object as an event with no
   listener, which this file's own history already cost a round.
2. **The routing became the selection.** `feedChannel` in `feed-control.js`: the
   lowest-numbered position routed to CAB, or channel 1 when every position is
   ANT. **This is the declaration's own sentence, not a new rule** — *nothing
   listening* is the broadcast; one listening is the one you get.
3. **RUN opens it.** The line was `chRows[0].ch` — his own 2026-08-21 *"launches
   it, on channel 1"* — which was right while the picture carried four buttons to
   move off channel 1 with. With those gone it was the one line that would have
   made three channels of four unreachable.

**THE PUZZLE IS UNTOUCHED AND IS NOW THE THING THAT PAYS.** QC_101 reads
`BROADCASTS ON ......... FEED NO. 3` in the installer's hand; the visitor
switches 3 to CAB; the machine is what comes up.

### MEASURED ON THE SERVED PAGE — ALL FOUR KINDS, FROM THE CONSOLE ALONE

| ANTENNA | RUN opens | element |
|---|---|---|
| `1111` — nothing listening | **television** | `div.tv-root` |
| `0111` — ch1 to CAB, no unit on it | **test signal** | `div.ts-root` |
| `1101` — ch3 to CAB | **the machine** | `iframe /robots/twin.html?user=1&preset=standard` |
| `1110` — ch4 to CAB | **the machine** | same `src`, same title |

**The strip now holds one control**, measured: `["close the portal"]`.
The `[X]` has not moved — `.ps-strip` is `justify-content:flex-end`, and the
button measures left 894.45 + width 47.33 = 941.78 = the strip's own right edge.

**`controls` NOW GATES THE 2x2 ALONE**, which is all it was ever really about,
and `.ps-strip--exit` is deleted rather than left as a selector modifying
nothing.

---

## 1 · CHANNEL 4 IS CHANNEL 3

**MIKE: "Channel 4 is non-responsive and should show EXACTLY what CH3 shows.
They are just two zooms of the same unit."**

`picture: true`, `src` and `frameTitle` are struck from the channel-4 row and
**nothing replaces them**. With no `src` and no `frameTitle` of its own the
resolver falls through to the latch's — `src: row.src || L.src` — so the two
channels are identical **by the absence of a declaration rather than by two rows
being kept in step.** Measured: same tag, same `src`, same title.

**THE 08-26 DIAGNOSIS IS NOT REVERSED.** `object-fit` really is inert on an
`<iframe>`, and drawing the plate as an `<img>` really was the fix for how it was
drawn. What Mike has ruled is that a photograph is the wrong THING for this
channel. **The plate is still published** at `/robots/reference/photos/
MGK-TWIN_MONITOR_CLOSE_UP.png` and the `picture` branch still exists in
`RobotsExhibitFlow.jsx`; a channel that wants a still is one field away. Row
**MC-a**: nothing declares `picture` now.

---

## 2 · THE TEARS COME ONTO THE SCREEN

**MIKE: "Tears must only happen on the Monitor Screen (not bezel, background,
etc)"**

**THIS REVERSES CR1 / FORK A (b), AND THE OLD ARGUMENT IS KEPT WHOLE AT THE
SITE.** That rule held that a rip crossing the ground and the portal together is
the only way to show both are one surface, so a rip confined to the picture
proves nothing. **It is not refuted; it is overruled**, and it is left standing
in `RobotsExhibitFlow.jsx` under a heading that says so — deleting it would leave
a later round free to rebuild the view-wide rip from the same reasoning and think
it was finishing something.

**THE OPENING DOES THE CLIPPING AND NOTHING WAS ADDED TO MAKE IT.** Measured
computed values on the served page:

```
.ps-feed   {position:absolute; z-index:0}   <- a stacking context
.ps-bezel  {position:absolute; z-index:1}   <- above all of it
```

so anything inside the feed box is already under the frame everywhere the frame
is. That is the same mechanism that makes the curved edge a crop, which is why
it cannot come apart the day the bezel is re-cut.

**AND THE FRAME IS OPAQUE ACROSS THE BAND.** Sampling the bezel PNG's own alpha
along its mid-height scanline (3000 x 2400): opaque `x 1..221`, transparent
`222..2773` (the opening), opaque `2774..2989`.

**MEASURED WITH A TEAR UP** (CLICK, caught on the first microtask turn):

| | |
|---|---|
| parent | `.ps-feed` — and a **sibling** of `.ps-slip`, not a child |
| children of `.ps-feed` | `["ps-slip", "ps-tear"]` |
| tear rect | `152.5, 295.2, 960 x 7.9` |
| feed rect | `152.5, 0, 960 x 720` — wholly inside, both axes |
| the overlay it used to span | `0 .. 1265` |

**IT IS A SIBLING OF THE SLIP AND THAT IS LOAD-BEARING.** The slip moves the
picture; the tear is the seam the picture moved AT. Inside `.ps-slip` it would
travel with the picture and stop being a seam.

**THE HEIGHT IS A SHARE OF THE PICTURE NOW AND THE NUMBERS DID NOT MOVE.**
`TEAR_SCRIPT`'s `1.1` drew 7.92px as `1.1vh` of a 720 viewport and drew **7.9px**
as `1.1%` of the 720-tall feed box. What changes is what it answers to: a rip in
the picture scales with the picture instead of with the window. **No number in
`TEAR_SCRIPT` changed and neither clock was touched.**

---

## 3 · THE TWO GLASSES ON CH3

### 3.1 · LESS VIGNETTING ON THE FRONT — AND IT WAS FOUND BY ELIMINATION

**MIKE: "Less vignetting on ch3 front VIIIp screen."**

`elementsFromPoint` at the centre of `#maskFront` on the served twin returns
`canvas#cvFront` → `#maskFront` → `.monimg` → `#feedlive` → `#feedgroup` →
`#unitstage` → `#portalbar` → `body`, and **the only mask, filter, opacity or
blend on any of them is S9a's feather.** `#maskFront` has no `::before` (the W9
rolling band is `#maskTop`'s alone); both the canvas and the aperture compute
`opacity:1`, `filter:none`; the `crtbase` tier's baked-in photographic vignette
is a different base and is not mounted. **Nothing else is available to be the
thing he sees.**

Halved, on the front only:

| axis | before | after | on the live aperture |
|---|---|---|---|
| vertical | 4% | **2%** | 2.00px → **1.00px** a side of 50.1px |
| horizontal | 1.2% | **0.6%** | 1.24px → **0.62px** a side of 103px |

**S9a IS NOT REVERSED AND MUST NOT BE** — the feather exists because the physical
window is round and a straight cut edge reads as a hard seam against the photo's
own black; **a feather at zero is the seam back.** The horizontal axis is the one
that ruling protects (*"a full-width line dims at its very ends rather than
losing them"*) and halving it is strictly in its favour.

**THE TOP GLASS IS DELIBERATELY UNTOUCHED** — he named the front, and T also
carries the W9 rolling band, so changing T's feather would move two things at
once on a glass he did not mention. Verified served: `#maskTop`'s canvas still
computes `4%` / `1.2%`, `#maskFront`'s computes `2%` / `0.6%`.

### 3.2 · THE TOP SCREEN GROWS 20% — HIS NUMBER, AND MY MEASUREMENT DISAGREES

**MIKE: "Make Ch3 top screen larger. Go look, but I est 20%. (The VIIIp's screen
size)"**

Built: `width 10.9% → 13.08%`, `height 6.625% → 7.95%`. **Verified served:
103 x 50.1 → 123.59 x 60.09 — +19.99% on both axes.**

**THE CENTRE DOES NOT MOVE.** `.glassmask` carries `translate(-50%,-50%)`, so
`left`/`top` are the measured marker centroid, and scaling about a centre leaves
it there. `left` and `top` are untouched.

**I LOOKED, AS HE ASKED, AND THE NUMBER I GOT IS NOT HIS.** Scanning the family
shot itself for the glass's own luminance plateau against the housing, on 15 rows
and 15 columns through the centroid:

| | |
|---|---|
| photographed top glass | `x 1962..2265`, `y 715..822` — **~304 x 108 image px** |
| the aperture **before** this cut | **327 x 159** |
| the aperture **after** | **392.4 x 190.8** |

So the aperture was **already 7.6% wider and 47% taller than the glass in the
photograph**, and at +20% it is 29% wider and 77% taller.

**HIS NUMBER IS BUILT AND THE MEASUREMENT IS REPORTED, RATHER THAN OPS PICKING
ONE**, for three reasons. *"Go look, but I est 20%"* is an estimate offered WITH
an instruction to measure — an invitation to come back with a number, not a
licence to substitute one. The aperture's height was never fitted to the glass:
the OLED is 128x64 and the aperture is 2.06:1 while the photographed window is
2.8:1, so the 47% overshoot is the state he has been looking at, not a regression
this round made. And the plateau scan finds the LIT area, which is not
necessarily the whole window — the top glass reads luminance 36 against the
front's 11 because it faces up and catches the ceiling. **He is the eye.** Row
**MC-b**; the next word can be a number.

### 3.3 · THE STARTUP RESIZE — THE 08-26 FIX WAS ONE OF THREE STATES

**MIKE: "Ch3 resizes visibly at startup. It should not."**

**MEASURED LIVE, ON THE PRE-FIX TREE**, sampling `#unitstage` every 40ms from the
press inside an overlay whose iframe is a constant 960 x 720 throughout:

| t | body class | `#unitstage` |
|---|---|---|
| 67ms | `usermode framed unitview` | **679.8 x 332.9** at x 16.8 |
| 82ms | `+ monbase` | **546.1 x 436.9** at x 16.8 |
| 120ms | `+ portal` | **944.8 x 755.8** at x 0 |

**Two visible jumps and a 16.8px shift, ending 1.73x the size of the second
state.** The last is the same class the 08-26 round named: `body.portal` is added
by `Portal_In()` inside `probe.onload`, so **the final size of the picture was
scheduled by a network fetch for the base photograph.**

**WHY THE 08-26 ROUND DID NOT SEE IT.** It checked its work by removing the
injected `#framedfit` rule from an already-settled twin, which can only ever
measure the difference that rule makes. **It could not see the states that arrive
after it.**

**UNCAPPING WAS NOT ENOUGH BECAUSE THE BOX'S SHAPE ALSO CHANGES** — each tier
declares its own `display` and `aspect-ratio`. So the framed stage is now
declared whole at its final values (`display:block`, `aspect-ratio:3000/2400`,
`overflow:hidden`, `width:100%`, `container-type:inline-size`), all `!important`,
all knowable before first paint.

**PROVED BY CONSTRUCTION, WHICH NEEDS NO CLOCK** — toggling the tier classes on a
live framed twin and reading the stage back:

| tier | with no framed rule | with the 08-26 rule alone | **with this round's** |
|---|---|---|---|
| `unitview` | 912 x **8768** at 16.5 | 945 x **8736** at 0 | **945 x 756 at 0** |
| `+ monbase` | 921.6 x 737.3 at 11.7 | 945 x 756 at 0 | **945 x 756 at 0** |
| `+ portal` | 828 x 662.4 at 66 | 945 x 756 at 0 | **945 x 756 at 0** |

**One box in every tier, whatever content has loaded.** `overflow:hidden` is what
makes the pre-monbase bench harmless: it is clipped inside the final box for the
~50ms it exists, instead of the box growing to fit it and then shrinking.

**WHAT COULD NOT BE MEASURED, STATED PLAINLY.** The live post-fix transient could
not be re-timed. The Browser pane does not composite in this session, and every
timer-based sampler starved — a 40ms `setInterval` returned 2 samples in 1.6s,
`ResizeObserver` delivered **zero** callbacks (its delivery is tied to the
rendering steps), and a `MutationObserver` armed too late because the arming
interval was throttled too. **The "before" is a live measurement and the "after"
is a construction proof**; there is no stopwatch reading of the fixed transient.
Row **MC-d**.

**THIS IS NOT THE "COVER" HE ASKED FOR ON 08-26 AND DOES NOT NEED TO BE.** A
cover hides a resize; there is no resize left to hide.

---

## 4 · THE BOARD TAKES THE SHORT FORM

**MIKE: "RENAME 'Weird.Baby \Worth a Listen' to '\Worth a Listen'. In the
directory, all of the '\' should line up vertically."** — and the reasoning,
which is the substance: **"\Worth a Listen is parallel to \Music in this
context."**

**RECORDED AS A REVERSAL, NOT A CORRECTION.** `f366d37` carried out his ruling of
2026-08-26 exactly as given — *"/wal TAKES THE HOUSE NAME… Every wing takes
it"* — and the board read the full form because he said so. He has now ruled the
other way **for the board**. Both rulings are his; the register rows say so in
his own words, both times.

**THE FULL FORM IS NOT RETIRED.** His 08-26 point 1 stands whole: the two forms
are `Weird.Baby \Wing` and `\Wing`, both his. What moved is which form the
DIRECTORY takes.

**THE HOUSE IS NAMED ONCE, ABOVE — AND THAT IS WHAT ALIGNS THE BACKSLASHES.** The
wordmark sits at the head of the column (`.wb-logo`, `alt="Weird.Baby"`), so
repeating `Weird.Baby` down four consecutive rows named the house five times on
one screen. With it named once, the four rows are the same kind of thing starting
in the same place. **The alignment is a consequence of the naming, not a layout
applied on top of it.**

### THE INDENT IS GONE, AND HIS RULING IS WHAT REMOVED IT

`.wb-dir-entry-sub { padding-left: 14px }` — F7's, 2026-08-05 — indented the WAL
row by one character. **A backslash 14px right of three others does not line up
with them.** The 08-26 round flagged this rule and deliberately left it, on the
correct ground that he had ruled the NAME and not the layout. **He has now ruled
the layout, so the flag closed on an answer** rather than on a later round
deciding it had waited long enough. Nothing replaces it: *parallel* is the whole
instruction, and a smaller indent would be the same mistake wearing an apology.
**M8's ORDER is untouched** and still carries *ours, ours, theirs, then the desk*.

### MEASURED ON THE SERVED PAGE, AND ON DISK

Every label's **first glyph**, by `Range` geometry:

| | desktop | true 390px |
|---|---|---|
| `\Robots` · `\Music` · `\Worth a Listen` · `\Foundation` | **all four at x 167.85** | **all four at x 58.70** |
| `Gift Shop` · `Information Booth` | 167.85 | 58.70 |

Backslash glyph width 6.50 on all four. **The whole board starts on one
vertical.**

**C36's RISK IS GONE ON THE ROW THAT CARRIED IT.** F7 recorded 16px of slack for
the indented label at its tightest measured width. At a true 390px the row now
has **125.41px** of slack to the arrow; the tightest row on the board is the
untouched `Information Booth` at 100.48px.

**THE BACKSLASHES WERE COUNTED IN THE FILE ON DISK, NEVER IN THE SOURCE THAT
WROTE THEM** (§8). A shell one-liner to count them failed with `grep: Trailing
backslash` and a `node -e` failed with `Unterminated regexp literal` — **the
hazard fired twice in this round before a single character was verified.** Both
probes were moved to files. Result: exactly **one** backslash in each of the four
labels, and one in each of the four new register rows' `t`.

### THE LAUNCH BUNDLE WAS CHECKED FOR WHAT SURVIVED

`Weird.Baby \` appears **twice** in the launch bundle and **neither is the
directory**: the `/wb` fact grid's `Founder` row (`Weird.Baby \Foundation
\Robots \Music`, his own copy of 2026-08-17) and the Robots album's own title
(`spine[wbr-logo].title`). **The directory is the only surface that changed**,
which is the scope he named.

---

## 5 · WHAT EACH ROOM'S TITLE BAR CARRIES — the separate question, answered

Measured on the served pages, `.wb-bar-room` (`textContent` → `innerText`, the
element being `text-transform: uppercase`):

| route | in the data | on the glass |
|---|---|---|
| `/robots` | `\Robots` | **`\ROBOTS`** |
| `/wb` | `\Music` | **`\MUSIC`** |
| `/wal` | `\Worth a Listen` | **`\WORTH A LISTEN`** |
| `/foundation` | `\Foundation` | **`\FOUNDATION`** |
| `/shop` | `Gift Shop` | **`GIFT SHOP`** |
| `/booth` | `Information Booth` | **`INFORMATION BOOTH`** |
| `/` (the lobby) | — | **no bar** |

**ALL FOUR WINGS ALREADY CARRIED THE SHORT FORM AND NOTHING IN THIS ROUND
CHANGED ANY OF THEM.** That was his 08-26 point 2 — *"THE TITLE BARS CARRY THE
SHORT FORM"* — and it was already built. **So today's ruling brings the BOARD
into agreement with the DOORS**: before it, the board said `Weird.Baby \Music`
and the door said `\MUSIC`; now both say the same thing. The shop and the booth
take no house name and are untouched, which is his own M8 list.

---

## 6 · WHAT WAS NOT DONE, AND WHAT IS FLAGGED

- **THE BEZEL PNG HAS A TRANSPARENT OUTER MARGIN AND THE PICTURE HAS ALWAYS SHOWN
  THROUGH IT.** Measured on its own alpha at mid-height: fully transparent at
  `x 2991..2999` (9 units ≈ **2.7px** at a 900px frame) and partial at `x 0`
  (alpha 75, under a third of a pixel); 2 transparent rows at the top. So a
  ~2.7px column down the frame's outer right edge shows `.ps-feed` — and now the
  tear with it. **This predates the round and is not the tear's doing**, and
  closing it means deciding whether the PICTURE should stop there too, which is a
  look. `PortalScreen.jsx`'s note that *"everything of the picture that is not in
  the hole is under opaque frame"* is true of the opening and mildly untrue of
  that outer margin. Row **MC-c**, flagged not fixed.
- **`instrument-panel.jsx` STILL REGISTERS `wb-portal-select-channel` AND STILL
  BUILDS `chList`, ON PURPOSE.** It has had no caller since 2026-08-26 and is
  kept as the only written account of how the hardware feed panel was built.
  **A retired component's internals are its account of itself**; conforming them
  to a ruling made after it was retired would make it a worse record and no
  better a module. It is statically imported by `Exhibit.jsx`, so its strings are
  in the bundle — but it mounts on `face.panel`, nothing declares that, and
  **unmounted code registers nothing.** A first draft of the note in
  `feed-control.js` claimed *"zero references remain in either repository"*; that
  was false and is corrected at the site. `MB-c`'s sibling; the round that
  decides whether that file goes is the round that finds it still unmounted.
- **`.ps-note` AND THE `note` FIELD ARE LEFT IN PLACE.** Mike struck the signal
  messages on 2026-08-26 and the string resolves empty, so the element does not
  render — measured `0` on every kind again this round. Removing the mechanism is
  a separate subtraction and he did not ask for it.
- **THE CLOSE-UP PLATE IS STILL PUBLISHED AND ON NO CHANNEL.** `reveal:day`
  reports `to pull back 0`, so an entry still calls for it and the stage door is
  correct either way. Row **MC-a**.
- **NO PIXEL SCREENSHOT.** The Browser pane did not composite on any attempt
  (§8's rAF family) — screenshots timed out at 5s on a fronted tab, and the
  timing hazards in §3.3 are the same cause seen from another side. Every claim
  above is painted-DOM reads, `getBoundingClientRect` geometry, computed styles,
  `Range` geometry, and direct pixel sampling of the source PNGs on a canvas.
  **That is a strong oracle for what is where and none at all for how it looks.
  Mike is the first eye on the look**, which is why this is served and not
  committed.

---

## 7 · GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 7 warnings — baseline, zero new** |
| `npm run build` | green |
| `npm run build:launch` | green |
| `npm run provenance:gate` | **PASS** — 5 added, 7 pruned, **0 surviving rows changed**, 0 inbound RESTATED chains |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** — 21 strings read, 0 findings |
| `npm run docs:numbers:gate` | **PASS** — 11 published claims in 8 documents |
| `npm run reveal:day` | nothing to move |

**THE PRUNE WAS CHECKED FOR CHAINS BEFORE IT RAN, NOT AFTER** — §9's named
hazard, which cost the BIG CHANGE round two repointed chains. Zero rows anywhere
in the register referenced any of the six rows this round's renames would stale.
**The sweep pruned seven where six were predicted, and the seventh was checked
rather than accepted**: channel 4's struck `frameTitle` (`MGK-VIIIp - the
close-up`), which is correct and was simply not on the list.

---

## 8 · THE FOUR REVERSALS, IN ONE PLACE

A later session looking for *why does the tree contradict the canon* should find
all four here.

| what was ruled before | what Mike ruled 2026-08-27 | where the old argument is kept |
|---|---|---|
| **The latch launches on channel 1 and four buttons on the picture pick** (Mike, 2026-08-21) | *"You do not change channels, as there are none."* | `feed-control.js`, at `feedChannel` and at `openChannel` |
| **The tear rips through everything at once, because that is the only way it proves one surface** (CR1 / FORK A (b), 2026-08-02) | *"Tears must only happen on the Monitor Screen."* | `RobotsExhibitFlow.jsx`, the H-TEAR block, kept whole under a heading that says it is overruled |
| **Channel 4's close-up photograph IS that channel's assigned signal** (2026-08-21, re-affirmed 2026-08-26) | *"Channel 4 … should show EXACTLY what CH3 shows."* | `portal.js`, at the channel-4 row |
| **/wal takes the house name; every wing takes it — the board carries the full form** (Mike, 2026-08-26, `f366d37`) | *"RENAME … to '\Worth a Listen'. In the directory, all of the '\' should line up vertically."* | `WbHome.jsx`'s directory block, `WbHome.css`, `worth-a-listen.js`, and all four register rows |

**None of the four old arguments was deleted.** Three of them are still correct
about the thing they were arguing and were outweighed rather than refuted; the
fourth (the channel strip) was faithful to a ruling that had a hole in it, which
is the brief's own reading and is now measured.
