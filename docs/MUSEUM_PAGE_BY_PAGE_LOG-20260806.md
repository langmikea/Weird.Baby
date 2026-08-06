# MIKE'S PAGE-BY-PAGE — LOBBY · THE RECORD · THE PORTAL · MGK-NIAC
**2026-08-06 · L1 · R1–R7 · P1–P6 · N1–N11 · X1 — twenty-six instructions, all
twenty-six answered, and the one that produced the most useful finding is the
one where the answer was a MEASUREMENT that killed the thing it measured.**

Gates: lint **11 errors / 9 warnings = baseline, zero new** · build green ·
`provenance:gate` **PASS — 0 undeclared · 0 stale · 0 invention** ·
`reveal:check` **PASS** · `parity:gate` **PASS, 4 shared · 0 divergences** ·
the lap on the **built bundle under `wrangler dev`**. Surfacing **13 · 13 · 15**
(ledger 159 → 160). One half of the lap did not run and is named at the bottom.

---

## THE HEADLINE: R4 WAS ANSWERED WITH A NUMBER, AND THE NUMBER SAID NO

He asked whether there is "a flatter better way" than a capped line with pane to
spare, and he named three candidates: a narrower pane, two columns, or the space
carrying something else. **Two columns was built, shipped to the built bundle,
and then read off the glass: each column came out at THIRTY-THREE CHARACTERS.**

The arithmetic is unforgiving and it is worth having in one place. The viewer
pane is ~76% of the viewport. Split in two it is ~430px a side. Take out the
record's mark rail and the gutter and each column is **324px — 33 characters**,
against a readable band of 65–75. An index of fixed-height cards is exactly what
columns are for, and at this pane it halved the one element whose entire job is
to be read at a glance. It becomes right somewhere past **1650px of viewport**,
and the operator's screen tops out at 1228.

So the two-column index is gone, and **the measurement is the answer rather than
a preference.** What shipped instead:

- **The entry body went from 56ch to 68ch, and the DIRECTION is the finding.**
  It was set BELOW the band, not above it — so the page was paying a narrow
  measure's costs (more carriage returns, a taller column) and collecting none
  of its benefits. Widening it is both the reading fix and most of the "pane to
  spare" answer.
- **The index row's reading matter is capped at the same 68ch**, so a visitor
  meets one column width in the index and the same one inside the record.
- **The slack on the right is left empty on purpose.** A list of fixed-height
  cards is SCANNED, not read, and air down one edge is what makes a column of
  headlines a column. Filling the pane was always the one wrong answer: a 140ch
  line loses the eye on the carriage return, which is why every newspaper on
  earth sets in columns and not across the sheet.
- **A narrower pane is refused with a reason.** The pane is the visitor's — they
  drag the splitter and the width is remembered for the session (P5). A page
  that shrinks its own container takes back a control somebody gave them.

---

## THE RECORD

**R1 — THE MARK, FAR LEFT, AND IT IS THE RECORD NUMBER.** He asked for a date
and/or a day number "or something better" and said he is open. The proposal is
the **record number**, set large and quiet in a fixed rail: `013`.

It is chosen over a date for a reason this volume has already paid for — **the
dates were invented and he deleted them.** The one surviving entry carries no
`date` and no `stamp` by his own ruling, so a rail built on a date would be an
empty rail today and an invented one tomorrow. The number is authored, held and
stable: it is what a bound volume actually files by, it does not renumber when
an entry is inserted the way an index position does, and the entry's own
dateline already prints `Record 013` inside — so the rail and the record agree
by construction. **The date is not dropped.** It sits under the number the
moment an entry carries one, derived by `entryStamp` exactly as before.

**R2 — NOTHING WAS TOUCHED.** He said the entry format is good, including using
intensity rather than size to draw the eye. It is untouched, and that is
recorded rather than assumed.

**R3 — THE HALF-SENTENCE TEASER IS GONE, AND "BY CONSTRUCTION" IS A MECHANISM.**
The old index was `-webkit-line-clamp: 1`, which cut this very entry at *"packed
unlike everything else that arrived with…"* — precisely the failure he
described. Two halves, and neither works alone:

- **RENDER.** There is no truncation left in the index at all. The clamp is
  gone, the headline's `text-overflow: ellipsis` is overridden, and the row is a
  fixed height (one headline line + two summary lines + padding, expressed in
  the two line-heights that draw them). **Nothing can clip, so nothing can lie.**
- **DATA.** Which means a string too long would OVERFLOW instead — so
  `reveal:check` now refuses one. `RECORD BUDGETS` in `tools/reveal-ledger.mjs`:
  **headline 62 characters, summary 130.** A row past either FAILS THE GATE.
  Proved by breaking it on purpose: a 105-character headline was named and
  refused, then restored, then PASS.

The reader is a third one in `reveal/record-entries.mjs` and **it does not
breach that file's own split**: `entries()` still sees numbers and asset paths
and no words at all, and is still the only half the ledger builds from. This one
sees two fields and builds nothing — the same standing as `prose()`, which
exists so a check can police a rule.

**R5 — THE "OBJECT" ICON COULD NOT BE MADE TO SERVE, AND THE REASON IS
STRUCTURAL.** He offered it a way out: open the object, or pop the object list
beside it. Neither exists. B9's model has **no permitted list of classes and no
registry of objects** — the badge printed a WORD with nothing behind it, and
giving it something to open would have meant inventing an object list, which is
Doctrine 12 with a button on it. **Struck, in all three places it rendered** —
the index, the short head and the long-form dateline — because one badge in
three places is one ruling in three places. `.vp-fe-class` is DELETED rather
than orphaned; it had zero callers the moment the JSX changed. The FIELD stays
in `record-model.js` with a note saying plainly that nothing draws it: it is his
own vocabulary and it comes back the day it points at something, and **a FILTER
over a long Record is the obvious day — the same mechanism as N9's presets.**

What still tells a reader what a week brought is `evidenceOf` — the counted
wire/plates/docs badges — which is a different mechanism, still rendered, and
absent here only because this entry carries no payloads.

**R6 — THE SUB-LINE, AND IT WAS A CATEGORY ERROR RATHER THAN A PREFERENCE.**
Three of the four covers were printing *PURVEYORS OF THE WEIRD*. That line is
the HOUSE's claim about itself and it belongs on the house's own album, first in
the deck, where its own cover is making it. Copied onto a photograph of a 1965
mainframe it stops being a claim and becomes a caption — and it captions the
machine as the weird thing purveyed. `tools/make_unit_covers.py`, one string,
three covers re-rendered at 1200×1200 with **same font, same size, same tracking
solve, same ink, same baseline**: the geometry claim that whole file rests on is
untouched.

**R7 — EVERY WING'S FAQ IS THE BOOTH'S FAQ NOW, AND IT REVERSES ONE OF OPS' OWN
RULINGS IN THE OPEN.** Four faces conformed: the robots front desk, both machine
FAQs, and `/foundation`. Every question on the page at once; clicking one opens
its answer under it; native `<details>`; the "+" ROTATES rather than swapping to
a "–", because two glyphs of different widths make the row twitch.

- **It is not the no-hidden-information law being bent.** M1's complaint is a
  control whose label says nothing about what is behind it. **A question is the
  description of its own answer** — the booth's own recorded reasoning, and the
  reason its accordion has always been allowed to stand.
- **D7 IS REVERSED ON `/foundation` AND M70 CLOSES.** That round flattened the
  accordion during the port on Ops' reading that a flat list was the stronger
  form, recorded it as a judgement, and put it to him as M70. He has answered it
  for every wing at once, so the flattening is undone rather than defended.
- **The "Q" and "START" stamps went with the flat list.** A list of questions
  under a heading reading FAQ does not need every row prefixed with the letter
  Q; the booth prints none. **M57's mechanism is untouched and still
  load-bearing** — the held slot on the front desk carries its marker in BOTH
  its title and its line, so the entry drops whole. An accordion makes that MORE
  important, not less: a question that opens onto silence is worse than one
  printed above silence. Verified live: 6 questions render of 7 declared.

---

## THE LOBBY

**L1 — THE RECORD IS OFF THE BOARD.** He ruled it clutter; visitors find it in
Robots. R1's argument for the row is not refuted — the Record is the one thing
in the wing that keeps happening — it is **outweighed by his own reading of the
board**: it was the only line there that was not a room, and a lobby directory
that lists one wing's contents invites the next four. **The address survives.**
`/robots/record` is still a route and still opens the wing with the Record
selected; the door is not bricked up, it is off the board.

---

## THE PORTAL

**P1 — "INSTRUMENT DIV." IS STRUCK, AND IT IS THE SECOND TIME THE SAME DRIFT HAS
GROWN.** He struck *"ABEAL Instrument Company"* off the manual cover on
2026-08-05 and it regrew here in a new costume, on a different object, inside a
fortnight. A name a maker never had is not a small error on a nameplate: **a
nameplate is the one object on a machine whose whole job is to say who made it.**
It reads `ABEAL · FEED CONTROL · TYPE 8p`. The hyphen went too — the wing's canon
spells it ABEAL, and "A-BEAL" was this file's spelling and nowhere else's.

**P2 — THE PLACARD LOOKS LIKE WHAT IT IS NOW, AND THE DIAGNOSIS IS WHY.** He
said it was unclear whether it is to be read, understood, changed or scrolled.
**What was wrong is that it was the same OBJECT as everything around it** —
engraved steel, dark ground, light letters, one hairline border, which is
exactly how the drum legend, the two switch legends and the dial legend are
drawn. Six things in one material at one value, and the one that is a fixed
maker's plate looked like the five that are controls.

So it inverts, to his reference: **bright rolled aluminium with black ink laid
over it**, the only light object on a dark panel — which is what a data plate is
on a real machine and is also, usefully, unmistakably not a control. Four parts,
each doing one job: the metal (cross-brushed grain, raised OFF the panel, shadow
falling outside where it used to fall inside) · the ink (near-black, at the
plate's own tracking) · **two rivets**, because a plate is fastened and every
real one shows how · **the struck field**, debossed, with the digits set
slightly off-square and off-baseline, because a hand-stamp is a hand.

**THE SERIAL FIELD SHIPS EMPTY AND HOLDS ITS WIDTH.** The space is his
instruction and it is built. The NUMBER is not Ops' to strike into it — a serial
is a specific nobody supplied, and a plausible one is Doctrine 12's exact
failure. An unstamped plate is a thing that exists. Register **M94**.

**P3 — THE READOUT IS STRUCK.** *"The unit as it stands: boots and updates
complete, powered, waiting at the opening prompt."* It was the panel narrating
what the panel already shows: AT PROMPT is lit, BOOTS + UPDATES DONE is engraved
under it, and the latch says FEED ARMED. Three instruments reporting a state and
then a sentence reporting the three instruments. `drum.line` is still rendered —
the field is undeclared, not removed.

**P4 — THE SCREWS, AND SIZE IS THE SMALLER HALF OF IT.** 11px → 18px (13px on a
small panel, where they used to be `display:none` and now are not — the panel is
SCALED to its frame, so nothing is competing with them for room). **What
actually makes a screw read as a fixing is the DISH AROUND IT, which did not
exist**: a dark ring with a bright lower lip, because the light in that room
comes from above and the far wall of a well catches it. One extra shadow layer,
and it is the difference between a disc printed on steel and a hole with metal
in it. The slot is cut deeper, with a near side and a far side.

**P5 — THREE ENGRAVINGS WERE NEITHER OBFUSCATED NOR PERIOD, THEY WERE
FILENAMES.** He caught the wrap on *"off, first boot"* and said the label makes
no sense to a human. The diagnosis is that "IDLING, UPD", "BOOT PLAYBK" and
"OFF · 1ST BOOT" were **the `id`s beneath them, truncated until they fitted** —
which is what a filename looks like and not what a drum looks like.

| id (unchanged) | ch | was | is |
|---|---|---|---|
| `idling-updated` | 4 | IDLING, UPD | **STANDBY** |
| `boot-playback` | 5 | BOOT PLAYBK | **COLD START** |
| `off-first-boot` | 6 | OFF · 1ST BOOT | **FIRST RUN** |

**THE MEANING DID NOT MOVE AND THAT IS THE CONSTRAINT.** The `id` is the key the
twin reads off the query string, and no id changed — so **M33's five engraved
reveal levers are exactly the five levers they were**. Each new word is the
period term for the state its id names, and each fits the drum face at one line.
**And the relabelling had to travel:** three rows in `reveal/ledger.json` were
printing the old engravings in their own names, which is the "fixing one never
fixes the other" defect Doctrine 17 is named for, one file out. Repointed.

**P6 — NOTED, NOT FOR ACTION.** The control panel occupies the centre and the
entire right of that area is empty; he wants it on the record as a someday and
not changed now. Register **M95**. Nothing was moved, filled or re-laid out.

---

## MGK-NIAC

**N1 / N10 — THE MENU IS TECHNICAL SPECIFICATIONS · IMAGE ARCHIVE ·
DOCUMENTATION · FAQ, ON BOTH MACHINES.** His instruction is under the MGK-NIAC
heading; obeying it on one album alone would have failed `parity:gate` on the
next commit, because that tool compares the two menus' ORDER as well as their
contents and **no written reason resolves a divergence** under the absolute rule.
He moved the ends; the middle two keep their relative order because nothing
about the middle was ruled on.

**N2 — THE ONE SHEET.** Struck by name: the subtitle *WHAT THE MACHINE IS
RUNNING* (the face takes the unit's name, like every other subtitle in the
wing), the two-generations blurb, the *"no reading of them is on file"* line
inside it, the output-row photograph, and the four prose entries — which are the
shape it is being converted out of. **Not one fact was lost and not one fact is
new**: every figure, rule and caveat became a register row.

    BOARD    Uno R4 WiFi
    PROGRAM  v0.1 · 2026-02-23 · 1,385 lines
    STATUS   baseline — pre-thermal-validation
    BENCH    8 single-subsystem sketches, January 2026
    MATRIX   8 × 16 — seven rows visible, the eighth wired, driven and behind something
    BAR      1 × 64, addressed as a single chain
    OUTPUTS  2 matrix chains · 2 bar chains · 3 servos
    LAMPS    all-at-once flashes capped at 32, a quarter of standard — a bench limit on a bench board
    DECLARED five rules, in the header, above the first include
    RULE 1   a numerical envelope
    RULE 2   a ceiling of eight core states
    RULE 3   mutual exclusion
    RULE 4   a reveal no faster than twelve seconds
    RULE 5   no adaptive learning — the machine is forbidden, in writing, from getting to know you

**The brightness cap keeps the caveat it arrived with** — 32 is measured on a
BENCH board and the flagship targets an R4 — because dropping a caveat while
keeping a number is how a spec sheet starts lying. **One real thing was lost:**
the builder's own line, *"If I make too bright at once the Nano will shut down
due to power draw."* It is a genuine quotation and the best sentence the old
face had, and a spec sheet has no row for it. **M87**, named rather than
absorbed. **And the face now has no picture**, which is a live conflict with the
standing Visual Hook Law and is his own instruction — **M88**, the third face in
this wing left imageless deliberately.

**N3 — DOCUMENTATION, AND THE TEMPLATE ALREADY EXISTED.** He said to check
first. It did: **L6's document card** — title, provenance, a STATE, and a scan
that opens in this wing's own reader — is a documentation template with another
name on it. It was **LIFTED OUT of the Record's renderer into `DocList`** and is
called from two places with one markup, one state vocabulary and one look.
Building a second one on the day the first was pointed at would have been Ops
doing the duplication to itself.

One field was added: **`plates`**, the house's own word and the house's own
shape (`{img,label,date}` — the plate wall's, the reader's), because a document
with more than one page needs an ordered set of page images and `pages` was
already taken as a COUNT. `scan` is still the one-page case.

**A DOCUMENT WITH NO PAGES IS NOT A BUTTON.** The manual is listed, stamped
`held`, and cannot be clicked — a control that opens nothing is the dead control
Doctrine 11's corollary removes, and M61 (the manual stays offline until real
pages exist) is untouched. The mainframe holds no documents and says so in one
sentence.

**WHAT WAS STRUCK IS THE LARGEST DELETION IN THE ROUND** and every item is
recoverable from git: the blurb (*"the typography is the evidence"* — the museum
explaining its own method), `MANUAL_FORMAT` and `MANUAL_NAV` (**NAV described
THE RENDERER**, a subject Doctrine 11 names explicitly, and it survived a
doctrine sweep in both rooms at once *because hoisting it had made it one string
instead of two* — a hoist collapses register rows, it does not make a passage
right), the empty reel and its note, and **the six attested section rows** —
§1–§4, APP. 1 and MARGINS. **MARGINS carried one of Mike's own `[PAPA]` slots**
(*"which hands, and what they wrote"*), so that slot is now recorded nowhere on
the glass: **M89**. The `reel` renderer is untouched in `Exhibit.jsx` and now
has no caller, kept for the same reason M61 kept the viewer built.

**N4 — THE LEAD-IN AND THE TOMBSTONE, ON BOTH WALLS.** He struck them on the
mainframe's; the portable's is the same face type and striking one copy is how
one object ends up in two forms in two rooms. **There is no replacement
lead-in**, and that is the answer to his "if one is genuinely needed": a wall of
photographs under a heading reading IMAGE ARCHIVE, with a row of named groupings
above it each carrying its own count, has already said what is in the archive
twice.

What the tombstones cost, named: the `Frame` row was the only place saying the
withholding is AUTHORED, and `Rights` was the only statement that the
photographs are ours (**M90**). Two things it did NOT cost: the `Plates` row was
a hand-typed COUNT and the groupings carry a live one, which is the defect class
W1 and D3c both paid for — and **M25 CLOSES BY SUBTRACTION**, because the
"before power" claim a lit plate contradicted was a tombstone row. **M7's
"Nine" half is moot** for the same reason; its caption half stands untouched.

**N5 — THE CONTROL ACTS.** He said FIT vs MAGNIFY is confusing and the button
appears not to work — it follows state rather than acting. **The ambiguity was
built in three ways at once**: the label said the ACTION ("Fit" while
magnified), while `aria-pressed` and the inverted fill said the STATE. One
control answering "what will happen" and "where am I" in the same instant, in
opposite directions — press it and the picture changed and the word flipped,
which reads exactly like a button that did nothing but rename itself. It is
**ZOOM IN / ZOOM OUT**, drawn the same way in both states, no `aria-pressed`, no
lit fill. Measured live: 856px → 1048px on one press. The zoom cursor on the
glass already said which state you were in, and always did.

**N6 — THE DESCRIPTIONS ARE OFF THE RAIL.** The viewer now carries identity and
position and nothing else: which archive, the frame's date, `Frame 3 of 5`. That
is what a microfiche reader's rail says. **The strike is scoped to the VIEWER,
which is where he read it and what he named** — the same `label` still captions
the tile on the WALL, where it is how a visitor chooses which photograph to
open, and a wall of unlabelled pictures is a different instruction from the one
he gave. That the two surfaces now disagree about whether a description is worth
printing is **M86**, reported rather than resolved by Ops.

**N7 — THE DATES, AND THERE ARE TWO PROBLEMS, NOT ONE.** He asked for any that
cannot make sense to the story to be flagged. **Fourteen frames, and nine of
them are not dates at all.** The portable's wall carries slot labels in the
`date` field — FAMILY SHOT · FRONT · SCREEN · BEZEL · TOP · BASE · BASE, NEW ·
REAR · COVER — and the reader prints them in the position a date occupies, so a
visitor reads FRONT as the date. One field doing two different jobs on two walls
of one wing. **And the five that ARE dates all say MAR 2021**, against a wing
whose front desk says a delivery arrived on a dock sixty years later and whose
Record's one entry is that delivery. A photograph of the mainframe dated March
2021 asserts the museum had the machine years before it arrived. It is true of
the PHOTOGRAPH and false of the STORY, and which one moves is not Ops' call.
**M93**, both halves.

**N8 — THE FOOTER AND THE WORD.** *"Five plates · Weird.Baby Robots"* was a
count and a house name; it is now **UNIT · OBJECT**, the sign-off every other
face in this wing already uses. And the unit noun is **PHOTOGRAPHS**, proposed
with its reasons because he asked for a proposal:

- **PLATE IS TRADE SLANG**, and this wing has retired trade slang before on
  exactly this reasoning — THE MORGUE went at N1, and *"a house that has just
  retired one piece of trade slang does not keep two more"* is this file's own
  sentence about it.
- **IMAGES IS TAUTOLOGICAL HERE.** "Five images" in the IMAGE ARCHIVE is the
  room's name counted back at you.
- **PHOTOGRAPH SAYS WHAT THE OBJECT IS**, and the distinction is load-bearing
  everywhere in this wing: B8's whole ruling on the manual is
  photographs-not-renderings, and P2 struck a plate for being a render. A word
  that keeps that distinction alive beats one that blurs it.

One caption was retitled with it — *"The cover plate"* → *"The cover image"* —
because that tile is the one thing on either wall that is a composite rather
than a photograph, and the new word usefully says so. **The SLIDES-not-Polaroids
idea is ledgered and not built**, per his instruction.

**N9 — THE GROUPINGS, AND HE IS RIGHT THAT IT IS THE BIGGEST ITEM.** Seven
curated cuts and two coarse ones across the two walls. `face.presets` — a named,
ordered subset, authored beside the wall it cuts, coarse one last:

| MGK-NIAC | | MGK-VIIIp | |
|---|---|---|---|
| The whole cabinet | 1 | As they arrived | 3 |
| Through the bars | 2 | The glass | 3 |
| Running, and in trouble | 2 | Above and below | 3 |
| Every photograph | 5 | Every photograph | 9 |

**The order is the curation.** Walk up to the machine, go into the cage, watch
it run, watch it go wrong. Arrive, meet the glass, look above and below. Every
LABEL is read off the tiles' own captions — the authorship is the CUT and the
SEQUENCE, not a new claim about any photograph.

Three things that are decisions rather than details: **every button carries its
count**, which is what keeps this inside M1 (a drawer labelled with its contents
and its size is fully described before it is opened) · **the reader walks the
PRESET, not the wall**, because the grouping IS the order he asked for ·
**a wall with one preset draws no strip**, and a wall declaring none renders the
DOM it rendered before, so no other wing is touched.

**AND THE CONSEQUENCE HE NAMED IS LEDGERED, NOT BUILT** — `egg.presets`, NOT_BUILT,
HELD, `shown:false`. His words: presets are a good way to hide an egg, to reveal
one, and to make certain things spell something out when they come together. The
three mechanisms are different and the third is the one nothing else in the
table can do: **a grouping's members, read in its own order, can carry something
none of them carries alone.** All three spend a photograph, an ordering or a
caption, and those are his — Doctrine 12 puts the CONTENT of an egg with him
even where the MECHANISM is Ops'. What shipped is the mechanism, empty.

**ONE HONEST WRINKLE:** *"Above and below"* groups `monitor_base` and
`unit_new_base`, two of the three plates the asset table already flags **wrong**
under M7 (*"there is no base in the picture"*). The grouping does not make M7
worse and does not depend on it being true — but its NAME rests on captions Ops
has already reported as describing objects the files do not contain. Named here
so the answer to M7 moves the grouping with it.

**N11 — LEFT ALONE.** "Exiting through the gift shop" and "back to the lobby"
are untouched, and that is recorded rather than assumed.

---

## X1 — THE EGGS

**THE HONEST ANSWER IS: THE LEDGER HELD ALL OF IT, AND NOBODY COULD ASK IT.**
Every egg in both repositories has been a row in `reveal/ledger.json` since v52 —
fifteen now — each with what it is, whether it is BUILT, whether it is SHOWN,
what it waits on, and **for four of them the egg ITSELF**, written in the `note`
and printed on no page anywhere. Nothing was missing from the table.

What was missing is the same diagnosis the surfacing report made about itself:
`reveal`, `reveal:audit` and `reveal:cards` all already knew, **and none of them
was ASKED.** An egg appeared in the audit's back shelf between a route and a
sound effect, filed by whether it was revealed rather than by what it is.

**`npm run reveal:eggs`** computes nothing new. It re-cuts the same table by the
one axis his question has:

    PLANTED  6   built and HELD — there right now, and nobody is told
    SPENT    4   REVEALED — on the glass; whoever finds them, finds them
    WAITING  5   not built — an idea with a row

`shown` is printed beside each because it is the line between an egg and a debt.
**Every row in the table today is `shown:false`.**

**AND IT NAMES THE OTHER HALF OF HIS QUESTION RATHER THAN PRETENDING TO HOLD
IT.** An idea that is not a revealable thing — a wording, a ruling, a photograph
he owes, a room nobody has argued for — is not in that table and is not going
into it. That is `docs/OPEN_ACTIONS.md`. A tool that quietly implied it held
both would be worse than one that holds half and says so.

---

## MECHANISM AND HOUSEKEEPING

**THE PRUNE PROCEDURE RAN FORWARDS AND THE GATE NAMED THE BREAKS EXACTLY.**
Backup taken, 55 rows declared, **88 stale rows pruned**, gate re-run: **ten
broken RESTATED chains, every one pointing at the same struck row** — the old
nameplate, `717117b59d2f401b`. They were **CARRIED, not re-decided**: repointed
onto the same object at its new key, because the nameplate is the panel's
identity anchor and re-classifying ten rows because a word changed is how a
sourced line quietly acquires a different provenance than it had yesterday.
Result **0 undeclared · 0 stale · 0 invention.**

**DOCTRINE 17 CAUGHT ITSELF TWICE THIS ROUND** — once on the ledger's three feed
names (P5), once on `.vp-fe-class`'s two render sites (R5). Both were one ruling
in more than one place.

**FOUR DEAD DECLARATIONS WERE DELETED RATHER THAN LEFT STANDING**: `.vp-fe-class`
and its three positioning rules, `capTitle` and `btnOn` in the reader. The second
would have been worse than dead — a `btnOn` style on a control that is no longer
a toggle would have looked like the reader still HAS a pressed state.

**WHAT DID NOT RUN, SAID PLAINLY: the 390px half of the lap.** The browser
window would not resize below **1228 CSS px** on this display (screen 1536×864 at
`devicePixelRatio` 3.125) and Chrome refused `window.resizeTo`. The desktop lap
ran on the built bundle over the lobby, `/robots` (all four albums, all their
faces), `/robots/record` and `/foundation`, with **no horizontal overflow** and
the reader exercised end to end. **Unverified this session:** the
`@media (max-width:620px)` rules this round added — the 13px screws, the plate's
narrow padding, and the groupings' unit noun dropping out of the buttons — plus
the archive strip's wrap at a phone width. **M97.**
