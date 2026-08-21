# 06 · THE PORTAL, THE VIDEO LINK AND THE FAR END

**Register key:** `STORY` · `OPS`. **Publication key:** `PUB` · `—`.

**THREE OBJECTS WEAR THE WORD *PORTAL* AND ALL THREE ARE CANON** —
[K-03](CONFLICTS.md#k-03). This file is about the third: **the doorway.**

---

## 1 · THE VIDEO LINK — the instrument's side
<a id="video-link"></a>

**This is the only subsystem in the manual whose theory is already written, and
it is published in full as `scan-11-a.webp` / `scan-11-b.webp`, Record 003.**
Quoted whole, because every term in it is load-bearing.

> *"The upper display may be given over to a **video link** with a **far end**.
> The link is not an extension of the upper display: the far end is a **station
> in its own right and is drawn on its own glass.** The link is bi-directional by
> design. **Assume the far end is attended.**"*
>
> *"The link opens only where the communications settings of Appendix B agree
> with those held at the far end. Where they do not agree the instrument does not
> open the link, and **reports the disagreement rather than the far end.**"*
>
> *"While the link is up, **signal is shown in the graph window of the diagnostic
> monitor** and the upper display is not available to a program. **Absence of
> signal is not in itself a fault; a far end that is not answering is not a far
> end that is not there.**"*
>
> *"The instrument's record holds **that** a link was opened and **for how
> long**. It does not hold **what passed over it.**"*

| term | register | pub | meaning as attested |
|---|---|---|---|
| **Video link** | STORY | **PUB** | The manual's own name for the thing. |
| **Far end** | STORY | **PUB** | The other station. **Attended by assumption.** [H-03](HOLES.md#h-03) |
| **Station** | STORY | **PUB** | *"a station in its own right… drawn on its own glass."* |
| **Signal** | STORY | **PUB** | Shown in the graph window while the link is up. |
| **The installation record** | STORY | **PUB** | Where the four communications values are entered at the time the link is made. **The values are not given in the manual.** An instrument moved to another far end is to be set again. |

**IT IS NOT BUILT.** Nothing in the twin implements a video link — see
[FAILURE-MODES §2](FAILURE-MODES.md#what-the-twin-can-do).

---

## 2 · THE PORTAL — the doorway
<a id="the-doorway"></a>

**CANON, Mike, 2026-07-29 — THE PORTAL REVELATION:**

> *"The bezel is the transitional frame between the webpage's real world and a
> camera feed / controller arrangement arriving from **an unknown source, an
> unknown location, and for an unknown reason.** The MGK-portal. **Three
> unknowns, and they are the point — the frame does not explain itself.**"*

**And it is the `p`** — [K-17](CONFLICTS.md#k-17).

| term | register | meaning as attested |
|---|---|---|
| **The bezel** | STORY | Renders as **its own layer ABOVE everything** and takes **no video treatment whatsoever** — it is the real world's frame. **Every feed treatment applies inside the opening and nowhere else.** |
| **Feed** | STORY | What arrives through the opening. |
| **Channel** | STORY | An engraved number on the drum, 1–8. |
| **Arms / armed** | STORY | A position that lights the drum and permits the latch. |
| **Latch** | STORY | The control that opens the feed. Reads **`FEED ARMED`** or **`NOT ARMED`.** |

**SIGNAL QUALITY IS WEATHER** — doctrine, recorded as canon at the Portal polish
round, 2026-07-29.

---

## 3 · THE FEED CONTROL
<a id="feed-control"></a>

**`museum:src/data/artists/portal.js`.** Register STORY. **HELD — no visitor has
seen any of it.**

### The nameplate

```
ABEAL  ·  FEED CONTROL
MODEL NO.   TYPE 8p
SER. NO.    (blank)
DATE        (blank)
```

**MIKE, NAMING HIS REFERENCES:** *"a raised chrome bezel; a black field with
brushed-metal letterforms sitting PROUD of it; stamped-in-place fields (MODEL
NO., SER. NO., DATE) with values struck into a lighter recess; an accent panel
beside the wordmark. **It must be unmistakably a BADGE bolted to a machine — not
a label, not a caption.**"*

**TWO OF THE THREE FIELDS ARE DELIBERATELY BLANK** —
[H-21](HOLES.md#h-21).

### The drum

**Legend `FEED`. The sub is STRUCK** — ruled 2026-08-20. It read
`SELECT · ONE ARMED`, two positions arm, and Mike ruled it deleted rather than
corrected to TWO: the lamp under the latch already reports `FEED ARMED` /
`NOT ARMED` for the channel the drum is showing, and the readout above it
already names that channel. A count that went stale once under a stepper will
go stale again. Doctrine 16. `drum.sub` is undeclared, not removed, and
`Exhibit.jsx` renders it conditionally, so nothing draws and no gap is left.
**[H-22](HOLES.md#h-22) half-closes:** its sub complaint is gone and `CH-a` goes
with `DETAIL`, but **channels 5 to 8 still wear Ops' words** and the hole stays
open for them. Positions read **top to bottom.**

| ch | id | engraved | arms | what it opens |
|---:|---|---|---|---|
| 1 | `niac-1` | **MGK-NIAC** | no | *"This feed is not available."* |
| 2 | `niac-2` | **MGK-NIAC** | no | *"This feed is not available."* |
| **3** | `standard` | **MGK-VIIIp** | **yes** | the twin |
| **4** | `idling-updated` | **MGK-VIIIp (zoom)** | **yes** | `MGK-TWIN_MONITOR_CLOSE_UP.png` — the close-up |
| 5 | `boot-playback` | **COLD START** | no | *"This feed is not available."* |
| 6 | `off-first-boot` | **FIRST RUN** | no | *"This feed is not available."* |
| 7 | `last-state` | **LAST STATE** | no | *"This feed is not available."* |
| 8 | `test-bench` | **TEST BENCH** | no | *"This feed is not available."* |

**CHANNELS 3 AND 4 CARRY THE MACHINE'S NAME — MIKE, 2026-08-20.** `STANDARD`
and `DETAIL` are struck. *"Both channels show the same machine; one is
closer."* The words they replace **described a feed rather than naming what you
are looking at**, which is the one thing a drum position is for — and it makes
the barrel one kind of thing, since 1 and 2 have carried a machine's name and
nothing else since R6. **`CH-a` closes:** `DETAIL` was Ops' word, registered as
such because the engraved legends are Mike's to write, and he has written them.
**No `id` moved**, for the third time (P5, CH4): the `id` is what the latch puts
in the event and what a twin URL carries.

**AND THE RECORD'S FOLDER NAMES DO NOT FOLLOW.** Record 002's Tuesday manifest
publishes `PORTAL/CH3-STANDARD/` and `PORTAL/CH4-DETAIL/`, and Record 004
prints the same tree. **Those are the far end's own directory names on a 1965
disk; these are the museum instrument's engraved legends.** A disk and a badge
may say different things about one channel, and here they deliberately do.

**THE NUMBERING IS AN EGG AND IT MUST NOT BE EXPLAINED ON THE GLASS.** Mike's
instruction: the feed positions renumber — **MGK-NIAC takes 1 and 2 and MGK-VIIIp
moves to 3 and 4** — and *the reason is the egg.* It is recorded **once**, in
`museum:reveal/ledger.json` (`egg.channels`), and nowhere else.

**THE NIAC POSITIONS ARE NOT INVENTED FEEDS.** Each carries the machine's name
and nothing else — no state, no mode, no feed title, because nobody has supplied
one. **Neither arms: the mainframe does not run on the Portal**, and the day it
does is a ruling and a feed, not a label.

**THE ENGRAVINGS ARE ENGRAVINGS.** Mike ruled that every position must be
**deliberately obfuscated or dressed in period garb — nothing merely awkward.**
Three of them had been the `id`s truncated until they fitted, *"which is what a
filename looks like and not what a drum looks like."* **The `id`s did not move**
— the `id` is the key the twin reads as `preset` in the URL.

**THE REFUSAL LINES WERE CHANGED ONCE AND THE REASON IS A DOCTRINE.** They used
to read *"held — one entry state (C3)"*, *"held — awaiting a privacy ruling"* and
*"held — workshop entry, by URL"*: **internal decision codes, an unmade ruling,
and the existence of an undisclosed URL, all shown to whoever rolls the drum.**
They now say the one thing an instrument says when a position will not arm.

### The switches, the dial, the latch

| control | states | note |
|---|---|---|
| **AUTO MAINT** · `NON-INTERRUPTIBLE` | off today | Thrown up: *"Maintenance is running. The machine will not be hurried."* **The launch fortnight, as an instrument.** |
| **AT PROMPT** · `BOOTS + UPDATES DONE` | **on** | **The entry state today.** |
| **SOURCE** dial | **LIVE** (arms) / **SEEDED** (does not) | SEEDED: *"no seeded feed on file — the lamps read the seed, and there is nothing to read."* |
| **LATCH** | `FEED ARMED` / `NOT ARMED` | Throws only when the panel is armed. |

**THE CONTROLS TELL THE STORY; THEY ARE NOT THE STORY (Mike).** *"The same two
lamps say both — AUTO MAINT lit + AT PROMPT dark is the launch fortnight; AUTO
MAINT dark + AT PROMPT lit is today. Nothing about the fortnight is built; the
panel is simply an instrument capable of reporting it, set to today."*

---

## 4 · THE PORTAL ALBUM
<a id="album"></a>

**Mike: *"THE PORTAL becomes ITS OWN ALBUM — it is very important and this keeps
it top-shelf visible."*** It sits at index **1** — second in the deck — *"the only
position that is both top-shelf and not the landing."* The two machines keep
their canon order behind it: **the original mainframe, then the portable.**

**Two tracks:** `Portal` (the panel) · `FAQ`. It was three until 2026-08-20.

**AND MIKE HAS RULED THEM TWO — IT IS A RENAME, NOT A KEEP.**

> **The tracklist DELETES `Portal` and RENAMES `Portal Feed Controller` to
> `Portal`. One track, not two.**

Ruled 2026-08-13, re-confirmed 2026-08-20, **APPLIED 2026-08-20**. The album is
two tracks now: `Portal` (the panel, `id: portal`) and `FAQ`.

**OPS RECORDED THIS WRONG ON 2026-08-20 AND THE CORRECTION IS THE ENTRY.** It
was written here and in two round reports as *"drops `Portal`, keeps `Portal
Feed Controller`"* — which keeps the panel's own name on the glass and is the
opposite of what he ruled. **The surviving track is called `Portal`.** The `id`
on the panel track is already `portal`, so the change is a title and a deletion
and nothing else.

**WHAT THE DELETION COSTS, named because it was a deliberate build:** the
`portal-door` track was the one Ops judgement in this album (`P-b`) — Mike named
a row and did not say what stood behind it, and Ops made it the door so it would
not be the dead control Doctrine 11's corollary forbids. **His ruling supersedes
that judgement.** The LATCH on the panel is already the door that opens the feed.

**Its FAQ, both questions moved word for word from the public machines' FAQs:**

> **Is the Portal the real machine?** — *"It is the real firmware on shimmed
> hardware — the twin. The unit itself is a physical object in a room; the twin
> is how it is met from here."*
>
> **Is the mainframe on the Portal?** — *"Not yet. Two channels are engraved for
> it on the feed drum and neither of them arms."*

**THEY WERE MOVED, NOT COPIED.** *"An FAQ on a public page answering questions
about a held room is a listing of it."*

---

## 5 · THE PORTAL IS HELD
<a id="held"></a>

**MIKE'S RULING: the Portal is HELD FROM LAUNCH and development continues.**

**A held thing must be UNREACHABLE BY A VISITOR** — no route, no link, no
listing, no share tag, no crawler path.

**AND THAT IS WHY THE ALBUM IS ITS OWN MODULE.** A boolean in `robots.js` would
have stopped the RENDER and still shipped the MATERIAL — the drum's eight
engravings, the refusal lines, the twin's address — **in a public chunk anybody
can read.**

**THE TWIN'S ADDRESS TRAVELS IN THE EVENT, NOT IN THE LISTENER.** The door's
`src` and `title` are declared in `portal.js` and ride the dispatch, so the
public flow component **holds no address for a held thing and no string naming
it.**

**TWO HOLDS, TWO DOORS, AND THEY MUST NEVER SHARE A LIST:**

| prefix | what | opens |
|---|---|---|
| `/assets/locked/` + `/locked/` | **the PERMISSION hold** | never — refused in **every** stage |
| `/assets/held/` + `/held/` | **the STAGE hold** | in development |

**The Portal and the machine photographs are the STAGE hold.**

---

## 6 · THE PRESETS — a recipe is data
<a id="recipes"></a>

**Mike's ruling: *"Recipes are DATA, so Mike can direct new ones in plain
language."*** The switch that used to live in code is a **row** now, and every
row is the same handful of knobs the machine actually has.

| knob | values |
|---|---|
| `power` | `"on"` / `"off"` — the rear switch |
| `level` | `0` / `1` / `2` — virgin / first-run / established |
| `replay` | `true` — Sandbox Tech replays the install |
| `day` | `"YYYY-MM-DD"` — seed the weather from a Record date |
| `dev` | `true` — leave the workshop showing |
| `resume` | `true` — checked before `power` |

**Anything not named is LEFT ALONE**, which is what makes these **deltas** rather
than states. **An unknown id is chipped and ignored**, so the museum may name a
recipe before the machine learns it and *"the failure mode is 'nothing
happened'."*

| id | recipe |
|---|---|
| `standard` | `resume:true, power:"on", level:2` |
| `idling-updated` | `power:"on", level:2` |
| `boot-playback` | `power:"on", level:2, replay:true` |
| `off-first-boot` | `power:"off", level:0` |
| `test-bench` | `power:"on", level:2, dev:true` |
| `clean-boot` | carried, wired, **unexposed** |
| `record-day` | carried, wired, **unexposed** — `day:"1965-01-01"` |

**ORDER MATTERS AND IS FIXED:** the weather first (it is what the picture is
drawn with), then the install level (it decides which boot the power-on
performs), then power, then the replay (it is a performance and wants a machine
to perform on).

**RESUME IF THIS VISIT ALREADY HAS A MACHINE.** *"It did not stop being a machine
when the overlay closed, and making it perform its own install again on the way
back would be the lie, not the shortcut."*

**AND THIS IS THE CHEAPEST PLACE TO PUT THE FOUR COMMUNICATIONS SETTINGS IF THEY
ARE EVER BUILT** — [FAILURE-MODES §3.5](FAILURE-MODES.md#where-state-lives).

---

## 7 · THE FAR END'S OWN BENCH — canon only; it never published
<a id="the-bench"></a>

**[2026-08-21] THIS SECTION'S PREMISE HAS CHANGED AND THE HEADING WITH IT.** It
was written while `ADDENDUM 01 - Bench Description` was scheduled inside Record
004 and said so — *"written, committed, and in the bundle a visitor could open
devtools and read."* **Mike struck the addendum whole on the morning of 20 Aug,
before the entry posted.** Record 004 is `PUBLISHED` now and the bench is not in
it and never was. **So the bench is canon and nothing else: no visitor has read
these lines, and none of what follows may be cited as something the museum has
said.** The strike is named once in `robots-record.js`; this is where its subject
lives.

**ADDENDUM 01 — Bench Description. Mike's words:**

```
Console is a single welded steel desk. No maker plate, no model number.
Display is a vidicon-tube monitor, long-persistence phosphor, green.
Readouts are cold-cathode numeric tubes. Eight digits, four lit.
Input is a light pen on a coiled cord, seated in a cradle at the right.
There is an ashtray cast into the desk and it has been used.
A paper-tape reader is fitted and empty. The take-up reel is full.
Four toggle switches sit under a hinged guard, unlabelled.

  ! Nothing here postdates 1969. Everything here works.
```

**THREE THINGS IN IT BEAR ON EVERYTHING ELSE IN THIS CATALOGUE:**

1. **The four toggle switches under a hinged guard are the communications
   settings, and they are at the FAR END, not on the instrument.** Record 005
   (`SCHEDULED`, 2026-08-21) confirms it — *"Four toggles. Sixteen combinations.
   One of them is correct."* **That sentence publishes at 17:00 today
   (2026-08-21) and is unchangeable from then**, and it constrains any
   failure-mode design
   ([FAILURE-MODES §3.5](FAILURE-MODES.md#where-state-lives)). **The bench's own
   version of the placement publishes never** — see the heading.
2. **The ashtray has been used** — the one detail on the page that says a person
   sat there, on a console Record 004 **called** *"an unattended remote access
   terminal"* **until 2026-08-21**, in a story whose canon says **nobody is at
   headquarters.** Recorded; not reconciled. **The phrase left the Record when
   Mike rewrote 004's detailed report** (see below); the ashtray and the canon
   line it sits against are unchanged.
3. **`No maker plate, no model number`** — the far end's console is deliberately
   the opposite of the FEED CONTROL, which is a badge whose whole job is to say
   who made it.

**AND THE MUSEUM'S READING AND THE MANUAL'S INSTRUCTION DISAGREED — BUT ONLY
ONE HALF IS STILL ON THE GLASS.** Record 004 read *"It appears to be an
unattended remote access terminal."* against SP 7-14's *"Assume the far end is
attended."* **[2026-08-21] MIKE REWROTE 004's DETAILED REPORT AND THE MUSEUM'S
HALF WENT WITH IT**, so the manual's line now stands unopposed and this entry
records a disagreement that WAS rather than one a visitor can read. The
sentence is preserved here and nowhere else — it is named once in the strike
note in `robots-record.js` and once here. Neither was a ruling. **Both are Mike's, and the
disagreement is between the 1965 document and the 2026 restorers reading it,
which is exactly the register the corpus uses everywhere** — recorded rather than
flagged.

---

## 8 · QC_101 — THE FORM THAT TELLS A VISITOR WHICH CHANNEL
<a id="qc-101"></a>

**PUBLISHED 2026-08-21, attached to Record 004** (`/robots/portal/qc-101-a.webp`;
[Ruling 18](../MUSEUM_RULINGS-20260817.md) on the back-post,
[Ruling 19](../MUSEUM_RULINGS-20260817.md) on why the listing says `.TIF`).
A one-sheet 1965 **FINAL TEST AND INSPECTION**, `FORM QC-101`, ABEAL, a division
of ScrapCo. Built by `tools/qc101_form_build.py` in the robots repo, which
imports the manual's own engines rather than re-implementing them.

**IT IS THE FIRST PLACE A VISITOR CAN LEARN THE CHANNEL.** Section 1, ANTENNA
FEED ASSIGNMENT, reads `BROADCASTS ON ......... FEED NO.` with a **3** written
in by hand. That agrees with the drum — VIIIp on channel 3 — and it is the fact
**THE ANTENNA SELECTOR** is designed around: of the four routings, `1101` is the
one that leaves channel 3 to the Portal. **Until the selector is built, this
sheet is the only published source for it.**

**WHAT ELSE THE SHEET ESTABLISHES, all of it agreeing with what was already
published:**

| on the sheet | agrees with |
|---|---|
| `VERSION ... 2.16` | `PORTAL_2v16.CFG` in Record 004's own listing |
| `ASSEMBLY ... PORTAL - CNC VID-LINK` · `ONE HALF OF A BI-DIRECTIONAL PAIR` | Mike's Record 004 text, and §1 above |
| `FAR END ... REQUIRED.` | SP 7-14; the link will not open alone |
| the four settings struck to **EVEN / FULL / 7 BIT / 1** | Appendix B-1, published as `marked-01-a.webp` in Record 003 |
| `PASS` ticked, signed, dated | new — 1965 QC passed this machine |

**IT PASSES, AND THAT IS DELIBERATE.** The mark set has no alphabet, so the
inspector can only strike and tick; all eight available written phrases are
doubts (`ASK ENGINEERING`, `SAME AS B-3?`, `CHECK W/ FAR SIDE FIRST`) and **none
of them is used.** The hand does four strikes, one tick, a feed digit, a date
and a monogram — the marks of a man finishing a job. **The unease belongs
entirely to a reader who knows what bi-directional means.** The 2026 QC ruling
(*"Unsafe to run in any sandbox; permanently quarantined"*) is in Record 004 and
is **not** on this sheet.

**TWO THINGS ON IT ARE NOT CANON AND MUST NOT BE READ AS FACTS ABOUT THE WORLD:**

- **The inspection date `8/14/65` is Ops' choice.** No inspection date exists
  anywhere in the corpus. It is declared as such in the generator's own FIELDS
  block, and it is deliberately NOT restated on the attachment's catalogue card.
  The reserved `3/14/65` stays unplaced.
- **Serial number, works order, contract, test equipment, ambient and revision
  are blank rules.** A blank line on an internal form is ordinary and says
  nothing false — it is not a hole to be filled by a later round.

**THE SIGNATURE IS RULED FINAL** at 2.5 lines, 1:1 with Mike's own monogram cut.
[Ruling 20](../MUSEUM_RULINGS-20260817.md) — do not re-render it.

---

## 9 · THE ANTENNA SELECTOR — BUILT 2026-08-21
<a id="antenna"></a>

> **[2026-08-21, SECOND PASS] THE FOUR SWITCHES SELECT BETWEEN `ANT` AND `CAB`
> — ANTENNA OR CABLE — PER CHANNEL.** Mike's canon. **The mechanics below are
> unchanged; only the naming is, and the naming lives in THE MANUAL and nowhere
> else.** It is not on the panel and it is not in a caption: *"It's a little egg
> to figure this stuff out."* See [§9.3](#ant-cab) for where in the manual it
> belongs and what it costs.
>
> **`1 = television, 0 = free` WAS OPS' WORDING AND NEVER MIKE'S.** It is
> retired everywhere it was written, including off the panel itself, where it
> was Ops explaining the machine under the machine.

**MIKE'S DESIGN, RULED AND BUILT.** A control on the FEED CONTROL panel. The
shipped build cycles four routings over channels 1–4; **the rebuilt panel makes
the four bits individually settable — a DIP block, any pattern** — which is the
same mechanic with the cycler taken off it:

| routing | zero on | what channel 3 carries |
|---|---:|---|
| `1110` | 4 | television |
| `1011` | 2 | television |
| **`1101`** | **3** | **MGK-VIIIp — the machine comes through** |
| `0111` | 1 | television |

**EVERY CHANNEL RESOLVES BY PRIORITY, AND THE ORDER IS THE WHOLE MECHANIC:**

1. **TELEVISION**, if the routing gives that channel a `1`. It overrules
   everything.
2. **THE MACHINE'S SIGNAL**, if a machine is assigned to that channel and
   television is not on it.
3. **THE TEST SIGNAL**, if neither.

**A MACHINE IS FIXED TO ITS CHANNEL.** MGK-VIIIp is on 3 and does not move. It
does not appear on whichever channel happens to be free — it appears on 3, or
not at all. **So the puzzle is to get the zero onto channel 3, and television is
what is in the way.** [QC_101](#qc-101) is where a visitor reads which channel:
`BROADCASTS ON ......... FEED NO. 3`, in the installer's hand.

**CHANNEL 4 NEEDED NO CHANGE.** `MGK-VIIIp (zoom)` is a photograph and that
photograph IS channel 4's assigned signal. Routed `1` it is television; routed
`0` it is the close-up. Nothing on the drum moved.

**CHANNELS 5–8 ARE NOT ANTENNA BUSINESS** and are unchanged: COLD START, FIRST
RUN, LAST STATE and TEST BENCH still refuse with *"This feed is not
available."* Verified on the page.

**THE SOURCE DIAL DOES ITS OWN HALF AND NEEDED NO NEW CONTROL.** At `SEEDED` the
panel does not arm, the routing display reads **`0000`**, and the dial prints its
own refusal — which IS Mike's *"no signal on any channel"*. `LIVE` turns the
ones into television. Verified.

**THE BROADCAST IS A WALL CLOCK.** One source — A/V Geeks, *Assorted 1960s TV
Commercials*, 1743 s — on three channels at phases `0`, `d/3`, `2d/3`, joined at
`(now + phase) mod duration`. **Measured on the page: 581 s and 1162 s, against
1743/3 = 581.** Two visitors on two machines are on the same frame, which is what
makes surfing feel like rejoining a broadcast. `controls=0` and `disablekb=1` so
the reel cannot be scrubbed off the clock, which a 1965 television could not be
either. **The loop is the museum's own, on the player's ENDED** rather than
YouTube's `loop=1&playlist=`, which does not survive the `loadVideoById` a
wall-clock join requires — a reel joined seconds from its end would otherwise run
out and draw YouTube's end screen on the Portal's glass.

**AND IT PLAYS, WITH SOUND.** Mike: *"They turned the TV on. Whatever channel it
is on is playing. It's 1965!"* The set is driven through the museum's ONE player
hook (`useYTPlayer`, parameterised), not a hand-written iframe — see
[Ruling 21](../MUSEUM_RULINGS-20260817.md) for why a latch is not the case
ruling A governs, and [Ruling 23](../MUSEUM_RULINGS-20260817.md) for why a bare
iframe could not autoplay at all.

**ONE OUTPUT.** *"not like the tracklist you can peruse while another track
continues playing."* Rolling the drum to another channel switches what comes out.
Enforced structurally: the channel component destroys its player on unmount, and
**after closing a channel, zero iframes remain in the document** — measured.

**IF THE BROWSER REFUSES SOUND**, the picture starts muted and the first touch
turns it on — a silent picture is a television with the volume down; a still
poster is a broken television. The catcher is a node the museum owns, because a
click inside a cross-origin iframe raises no event in the parent
(`OPERATIONS.md` §8). **Verified end to end on the page: latch → muted picture →
one real click → sound on.**

### 9.1 · WHAT CHANGED IN THE ARMING RULE
<a id="antenna-arming"></a>

**CHANNELS 1 AND 2 NOW ARM.** They carry television or a test signal depending
on the routing, and neither of those is MGK-NIAC. `arms: true` on a drum
position stopped being the answer and became an INPUT — it is how the resolver
is told *a machine is assigned to this channel*.

**THE PORTAL'S FAQ WAS CORRECTED IN THE SAME ROUND, ON MIKE'S APPROVAL.**
*"Is the mainframe on the Portal?" — "Not yet. Two channels are engraved for it
on the feed drum and **neither of them carries it**."* The old clause read
*"neither of them arms"* and became false the moment channels 1 and 2 began
arming. **The substance never moved** — the mainframe is still not on the Portal
— and `carries` is the truer word in any case: arming is a fact about the latch,
and what the answer is about is what comes out. His sentence, his approval, filed
MIKE. [Ruling 22](../MUSEUM_RULINGS-20260817.md).

### 9.2 · THE TEST SIGNAL, AND WHY IT IS NOT THE TWIN'S
<a id="test-signal"></a>

**MIKE, VERBATIM:** *"The machine only hosts three TV signals at a time; the
reason the fourth has a test signal is unknown. Maybe one of the switches needs
flipped? Or maybe there is another module that will come on line? Innocent
footholds for future claims of foreshadowing, and a bit of richness."*

**SO IT IS A FACT ABOUT THE MACHINE, NOT AN ABSENCE**, and nothing in the museum
explains it or resolves it. It is a foothold, left standing.

**THE TWIN'S NO-SIGNAL STATE WAS EXAMINED AND NOT USED, AND THE READING IS THE
BREADCRUMB:** the twin numbers **five** feeds and the panel numbers **eight**
channels, and they are not the same numbers — FEED 4 in the twin is the chronic
underperformer; channel 4 on the drum is the VIIIp close-up. **They do not map,
and they do not need to**, because the panel never needed a per-channel
correspondence. What it needed was one state, and **the twin cannot supply it
honestly: the twin IS MGK-VIIIp.** Its no-signal card is the machine's own
monitor showing nothing on one of ITS feeds. Opening it to say *there is no unit
on this channel* would put the machine on a channel the routing has just
established it is not on.

**So the card is drawn by the museum** — a 1965 monoscope in the wing's B&W,
carrying no lettering — **and the hum is the twin's, to the parameter**: 60 Hz
sine with a 120 Hz transformer bite, volume wobble at 0.09 Hz and frequency
drift at 0.13 Hz, read straight off `Hum_Start()`. Two smaller reasons are
recorded in `TestSignal.jsx`: the twin has no feed parameter, and an iframe has
no user activation of its own so its AudioContext would never resume.

### 9.3 · `ANT` / `CAB` — the switch positions, and they live in the manual
<a id="ant-cab"></a>

**MIKE, 2026-08-21:** the four switches select between **`ANT`** and **`CAB`** —
antenna or cable — per channel. **It does not go on the panel. It goes in the
manual, as text, without detail.** *"It's a little egg to figure this stuff
out."*

**THE MECHANICS DO NOT MOVE.** One position leaves the channel carrying
television; the other frees it, and a unit fixed to that channel comes through.
Everything in §9 above is unchanged.

**WHICH POSITION IS WHICH — MIKE RULED IT, 2026-08-21, AND IT REVERSES OPS'
INFERENCE:**

> **`ANT` IS TELEVISION — the aerial pulls it out of the air.
> `CAB` IS HARDWIRED AND CARRIES THE MGK UNITS.**

So a channel switched to **`CAB`** is the one a unit comes through on, and
`1101` in the old cycler's terms is *cable on channel 3*.

**OPS INFERRED THE OPPOSITE AND THE INFERENCE IS KEPT HERE, NAMED, BECAUSE IT
WAS REASONABLE AND WRONG.** It ran: the panel's legend is ANTENNA, QC_101 is
headed `ANTENNA FEED ASSIGNMENT` and reads `BROADCASTS ON ......... FEED NO. 3`,
therefore the unit is on the aerial. **What it missed is the more ordinary
reading of a 1965 set:** an aerial is how television arrives, and a machine
sitting in the same room is *wired to the back of the thing*. `ANTENNA FEED
ASSIGNMENT` is the form naming the panel it is describing, not a claim about
which side the unit is on.

**THE LESSON IS THE ONE THE ROUND SHOULD KEEP:** a chain of three plausible
readings produced a confident answer with no measurement under any link of it.
It was filed as a reading rather than as canon, which is the only reason it cost
one line to correct.

**WHERE IN THE MANUAL IT BELONGS — three candidates, and the cheapest is the
best.**

| place | what it would say | cost |
|---|---|---|
| **Appendix G — ABBREVIATIONS** | two rows: `ANT` and `CAB`, expanded and nothing more | **two rows.** The appendix already has 21, *two of which do not expand at all* — so a row that expands and explains nothing is the appendix behaving normally |
| **Section III — INSTALLATION** | one sentence in passing: a channel's input is selected at the panel | one paragraph, and installation is the right act — a technician patching units into channels is installing them, and QC_101 came out of the ZIP's `INSTALL` folder |
| Section IV — CONTROLS AND INDICATORS | the switch block enumerated with the rest of the face | the largest, and the most explanatory — it is the section whose job is to say what every control does, which is the opposite of an egg |

**RECOMMENDED: Appendix G, and Section III only if a sentence is wanted.**
Appendix G costs two rows, says the words and nothing else, and is the one place
in the document where saying nothing further is the established behaviour.
**Section IV is refused** — a controls-and-indicators entry explains, and this is
not to be explained.

**NOT WRITTEN THIS ROUND.** The manual is generated from
`tools/manual_structure_build.py` in the robots repo and its page count is a
published standing number (**63**). Adding rows to Appendix G is a change to that
generator, a re-render, and a page-count check — it belongs in the round that
next writes the manual, not in a panel round.

---

## 10 · WHAT THE PORTAL RUNS ON — Record 005, 2026-08-21
<a id="what-it-runs-on"></a>

**TWO FIRST APPEARANCES, BOTH IN ONE LINE OF MIKE'S, BOTH PUBLISHED.** Record
005's DETAILED REPORT, in his words:

```
  > Portal is now up and running on our UNIX-6x Emulator.
  > It carried its own COMM payload, autosync, etc.
  > The Portal is accessible via the Robots Exhibit.
```

**Neither `UNIX-6x` nor `COMM payload` existed anywhere in either repo before
this line** — checked across the museum and the robots repos before it landed.

### 10.1 · THE UNIX-6x EMULATOR — **PUBLISHED**

**The Portal runs on an emulator, and the emulator is Weird.Baby's, not
ABEAL's.** *"our UNIX-6x Emulator"* — the possessive is the whole of what it
establishes: the 2026 side is running the 1965 software, rather than the 1965
machine having been repaired.

**IT AGREES WITH WHAT THE MUSEUM ALREADY SAYS AND IT SHARPENS IT.** The FAQ's
answer to *"Is the Portal the real machine?"* reads *"It is the real firmware on
shimmed hardware — the twin."* **`UNIX-6x Emulator` is the name of the shim.**
That answer was written before this line and needs no change; it is now specific
where it was general.

**WHAT IS NOT ESTABLISHED, AND MUST NOT BE INVENTED:** what UNIX-6x is, who made
it, what it runs on, whether it is period or modern. The line names it and stops.

### 10.2 · THE COMM PAYLOAD AND AUTOSYNC — **PUBLISHED**

*"It carried its own COMM payload, autosync, etc."* — **the Portal arrived with
its own communications software.** `autosync` is named and nothing else about it
is.

**IT IS THE FIRST THING IN THE CORPUS THAT SAYS THE PORTAL TALKS OUTWARD BY
ITSELF**, and it lands beside two things already published: the manual's
bi-directional CNC Vid-Link (Section VII, Record 003), and Record 004's
*"QC RULE: Unsafe to run in any sandbox; permanently quarantined."* **The museum
put it in a sandbox; it carried its own sync.** Nothing in 005 draws that
conclusion and nothing here should either — it is recorded as an adjacency, not
as a finding.

**`etc.` IS HIS AND IS LOAD-BEARING.** It says there was more in the payload
than the two things named, without naming any of it — which is a hole the story
may fill later and a fact the museum may not invent into.

---
