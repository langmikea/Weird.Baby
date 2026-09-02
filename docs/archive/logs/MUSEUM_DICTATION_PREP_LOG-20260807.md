# THE DICTATION PREP — round log, 2026-08-07 (K1–K6)

**Six instructions, all six answered.** Gates: lint **11/9 = baseline** · build
green · provenance **PASS** (0 undeclared · 0 stale · 0 invention) ·
`reveal:check` **PASS** · `parity:gate` **PASS** · `instory:gate` **PASS** ·
`assets:orphans` **0** · the four new pages lapped at **390px and 1228px**, zero
page-level horizontal scroll, zero console errors.

**The round's largest finding is that the instruction's own premise was wrong,
and saying so was the deliverable.** K5 asked for *week 1 as it stands* — the
week's headline, each day's headline, each day's topics with their weights. None
of it exists in either repository. The honest build was the frame with every
content slot empty and the finding printed at the top of the page.

---

## K1 — THE ELEVEN PHOTOGRAPHS ARE KILLED

**Mike's ruling:** *"none are very good, and if that view is ever needed it gets
reshot."*

**What went.** Ten operator plates from `public/held/robots/reference/mgk-viii/`
— `bench_power`, `chest_grille`, `feet_plinth`, `head_lens`, `head_oblique`,
`limbs_lower`, `matrix_lit`, `parts_drawer`, `slot_mockup`, `torso_unfinished`
— and `public/held/robots/manual/structure-issue-p1.png`. Eleven files, off
disk, out of `provenance/asset-table.json` (326 → 315 rows), out of
`provenance/assets.json` (44 → 33 rows), out of `provenance/assets-declare.mjs`.
The now-empty `public/held/robots/manual/` directory went with them.

**THE PRECEDENT IS NOT REVERSED, AND THAT IS WORTH WRITING DOWN BECAUSE THREE
FILES CITE IT.** N1's standing rule reads *"a real photograph this museum owns
is not deleted on OPS' word."* It is unchanged, exactly as written. C-a put the
decision to Mike with the irreversibility stated in full — the museum held the
only copies of those ten — and he answered it. This was not Ops' word.

**WHAT THE EGG IS LEFT WITH — the thing the instruction asked to be said.**
`egg.niac.operator` survives, `build` still LIVE, and its material is now **three
plates, all of them upstream and all of them regenerable**:
`MAGIC8-2021-P01-the-eye.jpg`, `P02-the-shoulder.jpg` and
`P04-the-hand-on-control.jpg` in the robots repo's culled 2021 set — the eye, the
shoulder, the hand on the control — cut from `IMG_1526.MOV` under that repo's
OBFUSCATION_LAW, with the crop rectangles recorded in `PLATES.md` so any of them
rebuilds from the source video with one `ffmpeg` call. **The museum now holds
nothing of the robot.** What changed is that the egg's material exists in ONE
repository instead of two; spending it is still one data block and no code, and
now it is also one file copy. The ledger row says all of that in writing, and a
second dependency was added to it — *a photograph, if the egg is ever to be spent
on the glass*.

**AND THE MANUAL'S TITLE PAGE COST NOTHING AT ALL.**
`structure-issue-p1.png` was **byte-identical** to
`weird-baby-robots/robots/mgk-viiip/manual/structure/pages/page-01.png` — same
sha256 `cfac1d3b…`, same 100,077 bytes — one of sixty-one pages that repo
generates from `tools/manual_structure_build.py`. The museum was holding a COPY
of a page whose source is upstream and regenerable. The delete removed a
duplicate, not an original. **M4 does not close with it**: whether that plate is
a render rather than a photograph of a print is a question about the upstream
document and it stays upstream.

**THREE STALE CLAIMS WENT WITH THE FILES, AND ONE OF THEM HAD BEEN FALSE SINCE
P7.** The deletion's own cleanup found them.

| where | what it said | what is true |
|---|---|---|
| `asset-table.json`, `mgk-niac-cover.png` `qualityNote` | *"The badge is head_lens.jpg because THIS MUSEUM HOLDS NO PHOTOGRAPH OF THE MGK-VIII WHOLE"* | R4 swapped the badge to `core_helical.jpg`; **P7 swapped it again to `cabinet_whole.jpg`, which IS that photograph**; D5 made it ride the ring whole rather than as a crop |
| `robots.js`, above the MGK-NIAC `art` | *"The badge is `core_helical.jpg`, still A DETAIL"* + `parts_drawer.jpg` cited as the standing precedent | one round stale on the badge; the precedent survives and the file does not |
| `make_unit_covers.py`, the HISTORICAL block | a recipe naming `head_lens.jpg` and `head_oblique.jpg` as the alternative | neither file exists; the block records WHY the badge moved off the robot, which is R4's canon and is still load-bearing, and it is no longer a recipe |

**No render path was touched and nothing on the glass changed.** All eleven were
`role: unreferenced`, `usedBy: []`, and no generator reads any of them —
`make_unit_covers.py` takes `cabinet_whole.jpg` for MGK-NIAC and
`front_full.png` for the VIIIp. `assets:orphans` **0**, `provenance:gate` PASS,
`reveal:check` PASS after the ledger rebuild.

**Registers:** C-a CLOSED (ruled kill) · C-b CLOSED (the `where` field is
corrected, and the original finding was right with one refinement — the robots
repo held no copy of *those ten files*, and does hold three DIFFERENT
photographs of the same subject) · C-c CLOSED · M9's robot half closes, nine of
its fourteen idle files gone; **the original five that predate v56 are untouched
and still want a ruling**.

---

## K2 — THE IN-STORY SPEC SHEET SOURCE

`docs/dictation-20260807/specsheet.html`, built from
`tools/dictation/spec-source.mjs`.

**IT IS THE MISSING ITEM IN TWO OPEN ROWS.** N-g and N-h both end on the same
sentence — *the unit's own particulars, what an ABEAL spec sheet for this machine
says* — and both say porting it is AUTHORING. So nothing here is written. Every
row is a value already asserted somewhere in one of the two repositories, carried
with its source key and its status, so the authoring pass has the whole corpus in
one place instead of across forty files.

**163 rows across two machines and the adjacents.** 18 CONTRADICTED (both
readings printed, conflict named by register id) · 20 ABSENT (the structure has a
position and nothing fills it) · 8 flagged **REAL-BUILD SOURCE**.

**THE MANUAL'S OWN SECTION STRUCTURE WAS THE NAMED CANDIDATE AND IT DOES NOT
SERVE** — the instruction asked to be told, so it is told on the page and in
register K-d. The structure issue is twelve sections and eight appendices
describing a whole manual, and **ten of the twelve are procedures**; the
specification is Section II plus pieces of VII and XII. Grouping a one-sheet by
the manual's twelve puts nine near-empty headings on a page whose only virtue is
that it is one page. What is used instead is the period specification's own
grouping — the shape Tables 2-1 and 2-2 already have — and **every heading
carries its manual paragraph position**, so an authored row lands where the
structure says it goes. *The structure is the destination; it is not the
arrangement.*

**THE RED FLAG IS THE MOST IMPORTANT MARK ON THE PAGE AND IT IS N-i's FINDING
MADE VISIBLE.** Eight rows carry values whose only source is the real Arduino
firmware — `0x3C`, `setRotation(2)`, `BMI270/BMM150`, `PDM.begin(1,16000)`,
`DFPlayer Mini on Serial1 at 9600`, `NUM_PIXELS = 2 on D6`, the display sizes,
the character sets. In one of them the firmware **overrules** the in-story
manual: the manual says one lamp and the fit table gave it to the firmware's two.
Under Doctrine 18 that is backwards, and a spec sheet that quietly inherits an
I²C address is exactly the failure the doctrine exists to stop. **Nothing in the
robots repo was changed on Ops' word**; the flag is on the sheet Mike authors
from.

**Set in the typed-page register**, per his own ruling that the manual was *made
on a typewriter by engineering — not typeset, not laid out, not designed*: elite
pitch, a 78-column measure, ragged right, sideheads in capitals and underscored,
no bold (a typewriter has none), rules typed as hyphens.

**Sources read for it, in full:** the block dictionary, all seven atlases, the
firmware fit audit, the twin, `STATE.md`, `LINEAGE.md`, `THE_STORY_ARC.md`,
`STORY_BIBLE.html`, the spec-and-lore inventory (D.1–E.4), the menu map, the
aesthetic canon, the Act-1 BOM, the health spec, the parcel spec, the 2022
proto-manual, THE RECORD, the manual's structure build, the fit table, the holes
report, the typed-page research, the props ledger, and the museum's own two
Technical Specifications faces.

---

## K3 — THE ARTIFACT TRACKER

`docs/dictation-20260807/artifacts.html`. Filterable like the contact sheet:
free text plus six filters on the asset table and five on the ledger.

**THE ONE QUESTION IT ANSWERS:** can Mike reach for this in a Record entry
today? **16 governed pictures are behind the stage door right now**, each one
entry away from a wall — writing an entry whose `assets` name the file is the
entire mechanism, no code. **One file has ever been delivered:**
`rear_power_switch.png`, by Record 013.

**THE JOIN IS NINE ROWS DEEP AND THE PAGE SAYS SO.** The asset table is the
authority on FILES; the ledger is the authority on REVEALABLE THINGS; the
ledger's own header says the two meet at `assets` and neither restates the other.
Nine ledger rows carry an asset uid. Transfer class, reveal arc and dependencies
are properties of a revealable thing rather than of a file, so they are in a
second table rather than faked into the first. **A tracker that quietly implied a
full join would be lying about its own coverage.**

**AND IT FOUND SOMETHING ON ITS FIRST RUN — REGISTER K-a.** Three asset rows
have `missing: true` while `npm run assets:orphans` reports **0**. The orphan
check is correct by its own definition — it counts `missing && isJudged`, and
none of the three carries a judgement — but **two of the three are §8's
two-addresses hazard in its quietest form**: they are the public-side twins of
pictures that moved behind the stage door, so the same photograph is in the table
twice, once at each of its two addresses, and the held copy is the live one.
Counting them as reachable would have told Mike three more pictures were an entry
away when one of them does not exist and two are already listed. **The first cut
of this tool did exactly that** — it reported 18 and the true number is 16 — and
the `missing` check went in first for that reason. Nothing was deleted; they draw
`no file` and are excluded from every reach count.

---

## K4 — THE EGG TRACKER

`docs/dictation-20260807/eggs.html`. Fifteen ledgered eggs — **7 planted, 3
spent, 5 waiting** — each with its mechanism, what it needs before it can be
planted, and where it stands. Same population as `npm run reveal:eggs`, in a
browser.

**THREE OF THE THINGS MIKE NAMED ARE NOT `egg.*` ROWS, AND WHY EACH IS NOT IS
THE USEFUL PART.** They get their own section with the reason attached.

- **The buffalo nickels** are an `artifact` row, not an egg, because *an egg is
  planted where somebody could find it and nothing about this is placed
  anywhere*. Its dependency literally reads *a reveal class that does not exist
  yet* — the honest row, until M35 is answered. And the persona work adds a
  second demand: the sports fanatic and the magician are two named personas with
  no case, **and both will need a nickel**.
- **The album-art screen egg** is **deliberately not a ledger row**, and the rule
  is the reason: *a ledger row is a claim that a thing EXISTS*. Nothing was built
  and no art was touched. It is M78, graded high by Mike's own reasoning — *once
  a visitor finds one, they will check every cover forever* — carried with his
  constraint, which is the harder half: **this does not mean eggs everywhere**.
- **The glass dice** are a prop in the other repository with an egg-shaped
  finding attached and nobody has proposed planting it. Five dice is diagnostic
  (the poker family); each is ~9.5 mm, miniature against 19 mm casino stock; and
  **the material is the story point** — glass has been the wrong material for
  working dice for two thousand years, so **a glass die cannot be loaded.**
  Against a marked deck, a sleeve clamp and a copy of *Marked Cards and Loaded
  Dice*, five transparent dice are **the one object in that case that is provably
  honest**. It is the best unplanted thing in either repository.

The other three Mike named are ledgered and were already there: the poke
(`egg.lobby.poke`, NOT_BUILT, and the standing gate on every future egg), the
passcode kicker (`egg.passcode`, STUB, waiting on Mike writing the egg) and the
channel 3/4 egg (`egg.channels`, LIVE, un-spent because the Portal is held —
*an egg planted on a held surface is not planted at all*).

**Four eggs have no written form anywhere but their ledger row.** And **nothing
in this museum reports an egg being tripped**, so *planted* is a statement about
the tree and never about a visitor.

---

## K5 — THE STORY OUTLINE, DAYS 1–5

`docs/dictation-20260807/week1.html`.

**THE FINDING IS THE ROUND'S LARGEST AND IT IS PRINTED AT THE TOP OF THE PAGE
RATHER THAN BURIED.** The instruction says *week 1 as it stands* — the week's
headline, each day's headline, each day's topics with their weights. **None of
that exists.** Both repositories were searched for a day-by-day outline, a week
headline, a topic list and a weighting: no such document, no such data file, no
such field. What exists is the transfer arc (weekly, and about how material
ARRIVED rather than what a day is *about*), the three-act story arc (about the
whole product, naming no days) and one Record entry.

**SO THE FRAME IS BUILT AND THE CONTENT IS NOT.** Writing five plausible day
headlines would have been the exact failure the instruction guards against —
*he must never mistake one for the other while dictating.* They would have been
unmistakable tomorrow and unattributable next week.

**ONE RULE ON THE PAGE, AND IT IS THE ONLY ONE:** a **gold** rail means the
material is Mike's — today every gold rail is empty. A **blue** rail means Ops
derived it and the rule is named. A **red** slot means the thing is not written.
Six gold rails, six blue rails, six red slots, nothing unlabelled.

**WHAT IS DERIVABLE IS DERIVED, AND IT IS IDENTICAL ON ALL FIVE DAYS**, because
the transfer arc is weekly and not daily: **106 things have arrived** (THE BLAST
and THE UNLOCKS, both in hand from week 0) and **14 have not** (THE PACKAGES,
weeks 3–7 on four Fridays, which *earn* their photographs; and THE LATER
TRANSMISSIONS, months 2–3). Which of the arrived things a given day reaches for
is the authoring decision and is not derivable — so the eligible set is printed
once rather than five times, because repeating it would imply a distribution
nobody has authored.

**The one thing week one is already committed to**, in Mike's own words and the
only written constraint on it: *the first Record must produce the first images of
NIAC and VIIIp so the site has images to post — which means those images arrived
in the email blast.*

---

## K6 — THE INDEX

`docs/dictation-20260807/index.html`. Four cards, one colour rule stated once,
and the K1 result summarised so the tree change is not something he has to find.

**Path for Mike:**
`C:\AI\Projects\weird-baby-museum\docs\dictation-20260807\index.html`

Regenerate any of it with **`npm run dictation`**.

---

## THE INSTRUMENTS

`tools/dictation/prep.mjs` + `tools/dictation/spec-source.mjs`, npm script
`dictation`. They read `provenance/asset-table.json`, `reveal/ledger.json`,
`reveal/transfers.mjs`, `reveal/delivery.mjs`, `reveal/placement.mjs` and
`reveal/record-entries.mjs`, and **write nothing back to any of them** — the same
arrangement, and the same reason, as `tools/contact-sheet.mjs`. `verdict` is
Mike's field and Ops never sets it.

**THEY ARE OPS INSTRUMENTS AND MUST NEVER BECOME ROUTES.** A page whose subject
is the museum's own housekeeping is meta under Doctrine 11 and fails the
visible-line test at any live address. They render to `docs/` and are
deliberately not written into `public/`, which is the same trap `npm run
lap:clean` exists to police.

**Lapped at both widths.** 390px (via a 403px same-origin iframe, N5's recipe)
and 1228px: **zero page-level horizontal scroll on all five pages, zero console
errors.** The first cut overflowed at 390 — a five-column table cannot fit a
phone and must not be made to try — so every table scrolls inside its own
`overflow-x` box and the page never scrolls sideways.

---

## REGISTERS

**Closed:** C-a (ruled kill) · C-b (the `where` corrected) · C-c (ruled kill,
and it cost nothing) · K-d (answered — the manual's structure does not serve a
one-sheet).
**Updated:** M9 — nine of fourteen gone, the original five untouched.
**Opened:** K-a (the orphan check cannot see an unjudged orphan; three are in
the table) · K-b (no authored week-one outline exists) · K-c (the spec sheet is
assembled and is not written; N-g and N-h stay open and are no longer blocked on
finding the material).
