# THE HIDDEN WING, THE SCROLL, AND THE SWEEP
2026-08-12 · write packet · **not committed, not pushed, not deployed**
HEAD at start: `d15898a`. Site live in LAUNCH stage.

---

## JOB 1 — /robots IS SHUT UNTIL RECORD 001

**The mechanism has no date in it, and that is the design.** Mike's rule was
*"nothing reveals by clock alone; the story does the revealing."* The obvious
build — `TODAY >= "2026-08-17"` — is a second date literal beside `RECORD_EPOCH`
agreeing with it by hand, and it is a clock revealing a wing.

So `src/lib/wing-open.js` opens the wing when **the Record has an entry**:

```js
export const ROBOTS_OPEN =
  !launched() || recordEntriesForToday(RECORD_ENTRIES).length > 0;
```

`recordEntriesForToday` already folds in the worker's injected date, the admin
preview cookie and the stage, so the wing inherits all three without knowing
about any of them. No date to drift; if Mike moves day one the wing moves.

**The coupling is named rather than discovered:** an empty Record means a hidden
wing. That is the ruling read literally and it is the requested behaviour, not
an accident of the derivation.

**1a — it renders the Lobby.** `/hr`'s behaviour and E2's catch-all. Not a 404
(which tells a visitor there is a room they are being kept out of) and not a
redirect (which rewrites the address bar to say they were wrong to type it).
`HeldWing` was **not** reused — it reads /hr's PERMISSION flag, and §8's rule is
that a new reason gets its own door.

**1c — the early wording is restored from `1e45ae2^`, not from the round log.**
The log recorded that the sentence was replaced and quoted only its first line;
a paraphrase of Mike's own words back onto his own lobby is what the verbatim
rule exists to stop. Its seven strings were re-declared **MIKE** with the
original `s` recovered from the pre-replacement register, rather than reclassed.

**1d/1e — the share cards were false and are held.** Two of the three
descriptions in `index.html` name the MGK robots. The worker rewrites them while
the wing is shut, **reusing `twitter:description`** — already true in both states
— rather than writing a third sentence. `__WB_RECORD_FIRST_DAY__` is derived
from the Record, so there is still no second date literal. Verified on the wire.
The Booth's `/robots` mentions are all in comments. `WbAdmin`'s jump button is
Ops' and stays.

---

## JOB 2 — THE SCROLL: NOT REPRODUCED, AND NO FIX PROPOSED

**Programmatic `scrollTo(0,0)` reached true top on `/`, `/booth`, `/foundation`
and `/wal` at 100 / 90 / 80 / 67 %.** `restY: 0` every time. The symptom was not
reproduced, so no cause is claimed and no fix is proposed. Two prior per-page
fixes failed because the cause was never found; a third guess repeats that.

**What is there:** `html{scroll-snap-type:y proximity; scroll-behavior:smooth}`
(Exhibit.css:30) + `html{scroll-padding-top: calc(var(--wb-bar-h)+25px)}`
(MuseumBar.css:50) = **71px** above 720px, **67px** below. `.wb-bar` is
`position:fixed`, computed **53px**. Plus 15 × `100vh`, 11 snap declarations,
and `use-arrival.js` forcing `scrollTo(0,0)` and three `scrollTop = 0` writes on
every arrival.

**The snap hypothesis is refuted where it could be tested:** `/wal` has **zero**
elements with `scroll-snap-align` at all four zooms — a snap container with
nothing to snap to. The snap targets are in `HrExhibitFlow.css` (`/hr`,
password-held) and the exhibit sections — **the pages Mike named**, which Job 1
has just hidden from the launch build.

**Zoom, measured:** zoom does not change a CSS pixel in layout; it changes how
many fit the viewport. At 90 % on a 1280px device the layout viewport is ~1422
CSS px, so `71px` and `46px` stay put while every `100vh` grows ~11 %. The
`≤720px` breakpoint that drops the padding to 67px is crossed by zooming **in**,
not out, so it is not Mike's case.

**The zoom statistic does not exist**, and the reason is structural: browser zoom
and a Retina display both surface as `devicePixelRatio`, so analytics cannot
separate them. What is established is the floor — WCAG 1.4.4 (200 % text) and
1.4.10 (reflow at 400 %). The instruction stands without the number.

---

## JOB 3 — THE BOWB TRACKS

Six tracks, `type: "audio"`, `label: REC_LABEL` (`weird-baby.js:33`).

Mike's sentence is placed verbatim on a new **"About this record"** face on the
`vol1` album, filed **MIKE**, explicitly provenance and not a legal claim.

**It is not in `label`, and that is measured:** `REC_LABEL` renders in
`.tl-rend` — a **96px wide, 0.66rem, uppercase** button in the tracklist row
(`Exhibit.css:1175`). A twenty-word sentence there wrecks the row, which is what
3c forbids. `REC_LABEL` is untouched. **One statement, not six.** It is on
`vol1` because `about` is hidden at launch (CH5) and a line parked there would
be invisible on the day it matters.

---

## JOB 4 — THE SWEEP, AND THIS ROUND PRODUCED THE FINDING ITSELF

63 HELD rows, 12 RETIRED, and `reveal:check` proves every HELD row unreachable.
**The three failures were never ledger rows.** Ledger, Contribute and the
machines were `REVEALED` rows Mike later ruled hidden in conversation; nothing
moved, so no gate could object.

**Then this round did it too, and the gate caught it.** Hiding the wing made
eight `face.*` rows wrong. Flipping them to HELD was written, run, and REFUSED:

> `record.002`: built, HELD, and carried by `src/data/artists/robots-record.js`
> — which is NOT in `HELD_PATHS`, so its code and every string in it ship in a
> chunk the public fetches. **A boolean in a public module stops the render and
> publishes the material anyway.**

It is right, and the rows are left as they were. `face.wbr.record` is what the
`record.NNN` rows inherit from, so flipping the face flipped all five entries —
and the gate said what `CH5-a` already says: the Record's text is in a public
chunk. **Marking them HELD would have made the ledger claim a concealment that
does not exist**, which is the same error as leaving them REVEALED and the more
dangerous direction because it reads as safe.

**The fix is not a state field.** It is moving `robots.js` + `robots-record.js`
into `HELD_PATHS` so the wing is genuinely absent. Open `CH6-a`.

**4c — half of it is computable.** Not the missing input: a ruling spoken and
never written cannot be found in a tree that never received it. What is
computable is a reconciliation gate — every `REVEALED` row asserted actually
reachable in a launch build (new, ~one packet), and every row whose `where` names
a public module refused the HELD state (**exists**, check 5, and it just fired).
The durable half is procedural: **a hiding ruling is not done until a ledger row
moves**, and the row is what the gate reads.

---

## GATES

| gate | result |
|---|---|
| lint | **11 errors / 9 warnings — baseline** |
| build · launch build | green · green |
| provenance:gate | **PASS** — 13 rows declared, 0 stale |
| reveal:check | **PASS** |
| parity:gate | PASS — 4 shared, 0 divergences |
| instory:gate | PASS |
| reveal:day | nothing to move |
| lap @ 1280px, launch build | Lobby, /robots, /wb inspected |

Self-inflicted break, named: a ledger comment landed inside a function body and
crashed `ledger-declare.mjs`; lint caught it at 12, repaired, back to 11.

---

## OPEN

- **`CH6-a`** — the ledger's eight `face.*` rows say REVEALED while the wing is hidden at launch. Fixed by `HELD_PATHS`, not by editing state.
- **`CH6-b`** — the scroll cause is unfound; three console values from Mike's own screen would settle it.
- **`CH6-c`** — the guest-book "Founding Visitor" confirmation still reads as early-visitor copy after the 17th.
- **`CH5-a`** — future Record entries still in the public bundle (unchanged).
