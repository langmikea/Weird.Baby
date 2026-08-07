# THE NIGHT ROUND — N1–N6, 2026-08-06

**Autonomous, single agent, drafting lane. Six instructions, all six answered.**

**Gates:** lint **11 errors / 9 warnings = baseline, zero new** · build green ·
provenance **PASS** (0 undeclared · **0 stale** · 0 invention) · `reveal:check`
**PASS** · `parity:gate` **PASS, 4 shared · 0 divergences** · `assets:orphans`
**0** · **`instory:gate` PASS (new this round)** · **the lap ran at 390px AND at
1228px, on the built bundle under `wrangler dev`, for the first time in five
rounds.**

**The photograph folder Mike asked for:**
`C:\AI\Projects\_review\HELD-PHOTOGRAPHS-20260806\` — open `index.html`.

---

## THE HEADLINE

**Two of the six instructions turned out to be about the same defect wearing two
costumes, and neither could have been found by reading source.**

N2 asked whether the museum's spec sheets describe the machine or the workshop.
They described the workshop — `BOARD Uno R4 WiFi`, `PROGRAM v0.1 · 2026-02-23 ·
1,385 lines` — under a heading reading MGK-NIAC, on a machine the same wing dates
to 1945. **And the provenance register was not silent about it; it was the
evidence.** Every one of those rows was classed `VERIFIED` with the source
*"the unit's own `.ino` trees, read off the files."* The boundary was working
perfectly and recording, in writing, that a 1965 spec sheet was sourced from an
Arduino. **Doctrine 13 asks whether a string HAS an origin. It cannot ask whether
the origin belongs to the fiction.** That is the whole gap, and it is now
Doctrine 18 with a gate under it.

N4 asked whether opening a record disturbs the page above it. **The vertical axis
was already honest and the horizontal one was not.** Native `<details>` measured
**0 of 24** elements above it moving in the booth, **0 of 47** in the wing FAQs.
What moved was every element on the page, sideways, because opening Record 013
takes the document past the window's height, the scrollbar appears, and the
viewport goes **403 → 390**. Eighteen elements above the change, including the
title bar's exit and all four covers. **Nothing in the museum's code is doing
that, which is why four rounds of reading never found it.**

**Both were found by measuring, and the measuring is the thing M97 said had not
run for four rounds.**

---

## N1 — THE ELEVEN PHOTOGRAPHS, IN A FOLDER MIKE CAN OPEN

**`C:\AI\Projects\_review\HELD-PHOTOGRAPHS-20260806\index.html`**

The ten `egg.niac.operator` plates and the manual's title page, copied out of
`public/held/robots/`, **verified byte-for-byte against `asset-table.json`'s
recorded sha256 for all eleven**, with a one-page index carrying each
photograph, its file name, what it shows in the asset table's own words, its
dimensions and its quality flag.

**Nothing was deleted and nothing moved.** The originals are where they were.

**IT IS OUTSIDE THE REPOSITORY ON PURPOSE.** Copies of eleven governed pictures
inside the tree would be eleven new rows for `assets:scan`, eleven new orphans
for `--cull`, and a second address for a picture that already has two — which is
this round's own §8 hazard, applied to the round that was reading it.

The page states the two facts that make the call Mike's and not Ops': **the
museum holds the only copies** (C-b — the ledger's claim that they also live in
`weird-baby-robots` was checked file by file and is false), and they are
**held-but-declared**, which is the carve-out his own rule already has. It asks
for one word per photograph or one word for the lot, and names a third answer
worth more than either: **which of them should come out from behind the door.**

---

## N2 — "TECHNICAL SPECIFICATIONS" MEANS THE IN-STORY SPECS

**Recorded as law: `OPERATIONS.md` §7 Doctrine 18.** Mike's forecast — *"this
drifts back easily"* — is written into the doctrine with the reason, because the
reason is structural rather than careless: **the real facts are the ones Ops can
verify.** A session looking for something true to put on a spec sheet reaches for
the firmware tree every time, and it will feel like diligence while it does it.

### The audit

`npm run instory:all` — every face in the fiction, 13 surfaces, **304 strings**.

| surface | finding |
|---|---|
| MGK-NIAC · Technical Specifications | **6 rows of the real 2026 build** |
| MGK-VIIIp · Technical Specifications | **4 register rows + 1 entry, all of the real source trees** |
| MGK-NIAC · Image Archive | **10 plate tiles dated `MAR 2021`** — reported, not fixed (below) |
| everything else — the Record, both FAQs, both Documentation faces, the Portal's three | **clean** |

### What was struck, by name

**MGK-NIAC.** `BOARD Uno R4 WiFi` · `PROGRAM v0.1 · 2026-02-23 · 1,385 lines` ·
`STATUS baseline — pre-thermal-validation` · `BENCH 8 single-subsystem sketches,
January 2026` · `LAMPS … a bench limit on a bench board` · and the second half of
`DECLARED five rules, in the header, above the first include`.

**LAMPS WAS STRUCK WHOLE RATHER THAN STRIPPED OF ITS CAVEAT, and the previous
round wrote the reason before there was a rule.** Its own comment says the
brightness cap *"keeps the caveat it arrived with — because dropping the caveat
while keeping the number is how a spec sheet starts lying."* Exactly so: the 32
is a limit of the bench BOARD, so the caveat could not be saved without the fact
it qualifies, and the fact is not this machine's. The row went.

**What survives is nine rows and every one describes the object** — two displays,
an output census, and five declared rules of behaviour a 1965 selector could have
been sold with. Read off the built page at 390px to confirm.

**MGK-VIIIp.** All four register lines (`TREES` · `PRIMARY
MGK_VIIIp_01__20240721_WORKS` · `SECOND MGK_VIIIp_02__20260724_AUDIT` · `FORM
.ino modules`) and the `ON FILE` entry whole. **The previous round left this face
alone on a scope argument** — its own note says *"he did not read it this
round"* — and reported the divergence as M92/N-f rather than resolving it. The
standard is global, so the scope argument is spent and **M92 resolves in the
direction nobody chose: both faces lose their real-build register.**

**The `[PAPA]` moved rather than dying with its entry.** It marks a POSITION —
the artifact slot is Mike's to name — and the position outlived the sentence, so
it is `face.papa` now, which is the field built for exactly that. Under N3 it
prints in red on that face during development.

### What was NOT fixed, and why

**NOTHING WAS WRITTEN TO REPLACE WHAT WENT.** The in-story specification for both
units exists — the robots repo's manual work, Section II, two tables' worth — and
porting it is authoring, which is Doctrine 12's line. **N-g** and **N-h**.

**AND THE SUPPLY LINE IS CONTAMINATED AT THE SAME SEAM, which is the finding the
audit produced rather than the instruction.** Six rows of the in-story manual's
own SPECIFICATIONS section are marked `FITS` in
`weird-baby-robots/docs/MANUAL_STRUCTURE_FIT-20260805.md` with the real Arduino
firmware cited as their source — `0x3C`, `setRotation(2)`, `BMI270/BMM150`,
`PDM.begin(1,16000)`, `DFPlayer Mini on Serial1 at 9600` — **and one of them lets
the firmware WIN a contradiction against the in-story manual** (`NUM_PIXELS = 2`
over the manual's *"one lamp"*). Under Doctrine 18 that is backwards. Nothing in
that repo was changed on Ops' word: **N-i**.

**The ten `MAR 2021` plate dates are reported, not struck** — a plate date is
either capture provenance (which Doctrine 11 ships) or a claim about when the
object was built (which Doctrine 18 forbids), and deciding which is a reading of
the wall, not a mechanical fix. It is the same object as the already-open
**M93**.

### The check

`npm run instory:gate` — beside lint and build on **every** packet, not
conditionally, because *"did I touch a spec face"* is exactly the question a
session that just added a row to one answers wrongly. It walks the album data
rather than grepping a file, so a face that moves file keeps its scope; it fails
on seven classes of tell; and its escape hatch takes a written reason per entry,
with **an allow that has no reason failing the gate.**

---

## N3 — NOTES TO MIKE RENDER IN RED, AND THEY LEAVE THE BUNDLE AT LAUNCH

**IT DOES NOT REVERSE P5, AND THE SHAPE IS V1's.** P5's sentence — *they must
never be visible to visitors* — is untouched and is now enforced **twice** rather
than once. What was wrong is what was wrong with the pull-back rule: the scrub
had only one state, so the only way to obey it was for Mike to be unable to see
his own list either.

**`visitorProse` IS UNCHANGED, TO THE CHARACTER, AND THAT IS THE LOAD-BEARING
PART.** The body copy is identical in both stages, so the page Mike reads is
exactly the page that ships. The notes are **lifted out** of the prose into a
block beneath the surface — red, dashed, monospace, headed *Not part of the UX ·
notes to Mike*, styled with no `--wb-*` token so it can never come to look like
the museum. **A note that is never inside the copy cannot be read as copy**,
which is a stronger guarantee than red ink inside a paragraph.

**THE WALK IS A WALK, NOT A FIELD LIST.** `scrubFace` scrubs a named set of
fields — a list somebody has to remember to extend, which is precisely the defect
P5 was fixing. `opsNotesOf` recurses over the raw face, so a field nobody
remembered is still reported. In the booth it walks `FAQ` and not the scrubbed
list, **because a question whose answer is entirely a marker disappears from the
room by design and is the one Mike most needs to be told about.**

### The third part, and the measurement that made it necessary

**A RUNTIME FILTER STOPS THE RENDER AND STILL SHIPS THE MATERIAL — the fourth
time this repository has paid for that sentence.** Measured on the built bundle:
**35 `[PAPA]` markers in the JS chunks**, among them the Foundation's four
unpublished ledger figures and the wording of several answers Mike has not
written. R5 shipped 153 vault mp3 URLs that way; H1 shipped the whole reveal
ledger; V1 shipped the address of twenty-six withheld photographs.

`wb-ops-notes` in `vite.config.js`, `enforce:"pre"`, LAUNCH only.

**IT IS AN AST PASS AND NOT A REGEX, FOR ONE REASON THAT DECIDES IT.** The data
files break long passages across concatenated literals and a marker sentence
routinely straddles the break. Stripping literal-by-literal would apply the
sentence rule to half-sentences and could take a sentence the runtime keeps or
keep one it takes — **which would mean the copy Mike approved in development is
not the copy that ships**, a worse defect than the one being cured. The pass
folds each `+` chain into the one string the runtime sees, runs the same
`visitorProse`, and writes back a single literal.

**Result, measured on the launch build: `dist/client/assets/` carries ONE
`[PAPA]`, and it is `PAPA_MARK` — the regex that removes them.** The development
build carries 36: the 35 notes and the same regex.

### What the pass cannot reach, said plainly

`public/held/robots/twin.html` is a 620 KB standalone machine emulator that is
not a module and is not built. It prints **76 operator slots on its own glass** —
`[PAPA - ARIES]`, `[PAPA slot 1 - traffic]` — by its own declared content law. It
is unreachable at LAUNCH for a different reason (the stage door refuses
`/held/`), and it is **N-k**.

---

## N4 — THE EXPANDER RULE

**Recorded as law: `OPERATIONS.md` §7 Doctrine 19.**

### What was already right

| surface | above the change | below |
|---|---:|---|
| `/booth` accordion, open | **0 of 24** | 23 of 24 moved |
| `/robots` wing FAQ, open **and** closed | **0 of 47** | 15 of 17 moved |

Native `<details>` was never the problem. **And the Stage's repagination risk —
the one structural hazard a reading would have flagged — is not live:** all four
face wings declare `faceFlow: "flat"`, so no face is paginated today.

### The two things that were breaking it

**1. THE SCROLLBAR.** `/robots/record` at 403px: opening entry 013 takes the
document **780 → 1347px**, the bar appears, the viewport goes **403 → 390**.
Centred things shift left 6.1px, right-anchored things 12.2px. **18 elements
above the change.** Fixed by one declaration on the root —
`html { scrollbar-gutter: stable }` — which is the platform's own mechanic
(Doctrine 8) and which satisfies *"everywhere a surface expands"* **without a
single expander knowing about it**, because the defect belongs to the viewport
rather than to any expander.

**2. A SHARED GRID ROW.** Stacked at ≤720px the exhibit's two rows shared slack.
With the record open the slack is gone, so `.ex-left` collapses **140 → 80px** —
its own natural height, having been padded out by 60px nobody wanted — and
everything under it, **including the face's own heading**, comes up sixty pixels.
Consistent at scrollY 0, 200 and 400, so it is layout and not scroll. Fixed with
`grid-template-rows: max-content 1fr` in the stacked frame: the contents row is
its content's height in every state and the viewer grows downward.

### After

| test | result |
|---|---|
| Record 013 **open**, 390px, scrollY 0 / 200 / 400 | **0 of 35 above moved** |
| Record 013 **close**, 390px | **0 of 35 above moved**, index restored |
| Record 013 **open**, 1228px | **0 of 37 above moved** |

**The cost is stated rather than absorbed:** a page short enough not to scroll is
now ~13px narrower. A constant 13px nobody can see beats an intermittent 13px
that moves the furniture.

---

## N5 — M97 IS CLOSED, AND THE LAP THAT WAS OWED HAS RUN

**THE WINDOW'S SIZE WAS NEVER THE MUSEUM'S VIEWPORT.** Four rounds recorded the
same obstacle honestly — the display will not go below **1228 CSS px** and Chrome
refuses `window.resizeTo` — and four rounds shipped without half of a standing
gate. A **403px same-origin iframe** gives a document whose `innerWidth` is
**390 exactly** (asserted, not assumed), and same-origin means the driver takes
real measurements instead of reading pixels off a screenshot.

**The recipe is committed this time.** `tools/lap/harness.html` + `npm run lap` /
`npm run lap:clean`. It has to be same-origin, so it has to be served, so it has
to sit in `public/` — where one `npm run deploy` would publish it. The script
copies it in for the run and takes it out again; **`npm run lap:clean` before the
seal is in the ritual now, not an afterthought.** v50 solved this once and lost
the recipe with the scratch file.

### The lap — eleven routes at 390px

| | reading |
|---|---|
| page-level horizontal scroll | **zero on all eleven** |
| console errors / warnings | **zero on all eleven** |
| images | every `src` fetched: **no non-200 from the museum's own origin** |
| inner horizontal scrollers | `div.cf-wrap` only (the coverflow, `overflow:hidden`, by design) — plus `/hr`, below |
| red NOT-UX blocks | present on `/booth`, `/wal`, `/wb` and the robots faces; **zero anywhere at LAUNCH** |

**What four rounds of unverified phone rules actually did: they held.** The 13px
screws, the nameplate padding, the groupings' unit noun and the grouping strip's
wrap all survive at 390px — the archive picks print *1 photograph · 2 photographs
· 5 photographs* with their nouns intact and nothing wrapped past the edge. That
is a real answer and it is worth as much as a defect would have been, because it
was four rounds of assertion until tonight.

### Except on `/hr`, which nobody had ever seen at phone width

It is behind the password, so it is Mike's own wing and not a visitor's problem —
but it is the one route where the lap found something:

- **`div.pb-track` has `clientWidth: 0`.** The player bar's track name has no
  width at all at 390px; the title is entirely absent from the bar. **N-j.**
- **Five `b.tl-tt` variant chips are clipped to as little as 41% of their text**
  (230px of content in 94px). They carry `text-overflow: ellipsis`, so it is an
  honest truncation rather than a silent one — but *OFFICIAL LYRIC VIDEO* in 94px
  is not a label. Reported with N-j.
- 24 elements paint past the viewport edge, all inside `.cf-wrap`.

### Two false alarms, both caught before they reached this file

**`img.complete` read across the frame boundary is unreliable** — it reported all
four `/robots` covers as never-loaded while a screenshot showed them rendered.
The image check is fetch-based now, and the earlier *"0 broken images"* readings
taken with the old metric are not claimed anywhere in this log.

**And the permission hold looked open and is not.** `/hr` rendered Hunter Root's
whole wing in the harness and `/assets/locked/…` answered 200. The wing's chunks
are correctly refused: `curl` with no cookie gets **404 on all three**, and this
browser holds a valid HttpOnly `wb_held` cookie from an earlier session —
which `document.cookie` cannot see, which is what made the false reading
plausible. `/api/held` reports `open:true · configured:true`. **The door works.**

---

## N6 — THE REGISTER

`docs/OPEN_ACTIONS.md` updated in the sealing commit per Doctrine 14. **M97
CLOSED.** **M92/N-f resolved** by N2. Eleven new rows, **N-a** through **N-k**;
every one waiting on Mike carries the one line of what he must supply.

---

## WHAT THIS ROUND EXPOSES

1. **A gate that proves a string has an origin cannot prove the origin belongs**
   (N2). Doctrine 13 and Doctrine 18 are orthogonal, and the register was the
   evidence for the defect rather than a defence against it.
2. **A runtime filter ships the material — four for four** (N3). The next round
   that writes one should write the build pass in the same commit.
3. **A layout rule cannot be read off source** (N4). Both defects were invisible
   in the CSS and obvious in a measurement; `anchorTest` exists so the next one
   is found in minutes.
4. **A verification recipe that lives in a gitignored scratch file dies with the
   session** (N5). v50 solved M97 and the fix was lost; four rounds paid for it.
5. **The 76 operator slots on the twin's glass are governed by nothing** (N-k).
   The museum's scrubber, the launch strip and the provenance boundary all stop
   at the edge of that file.
