# THE WALKTHROUGH — A · B · C · D · E · F · G · H

2026-08-13 · WRITE · the packet Mike gave after walking the museum.

This file exists for two reasons. It is the round's record, and it is the
**source cited by every `MIKE` row this round adds to
`provenance/register.json`** — the standing rule is that a string declared as
his is declared against a log that quotes his instruction in full. §0 is that
quote.

---

## §0 — THE INSTRUCTION, VERBATIM

> **A · THE PANEL BUG — do this first**
>
> On `/wb` the viewer panel sizes to its content at mount instead of to its
> container. Three symptoms, one cause:
>
> * a visible seam where the grey panel ends and cream resumes, roughly
>   three-quarters down the column
> * scroll misbehaving until the tracklist/viewer is resized, after which it
>   corrects itself
> * the whole thing dependent on window height
>
> WAL (`/wal`) has no seam because its panel runs full height. Fix the
> measurement, not the symptoms. Verify by loading at two window heights without
> resizing.
>
> **B · `/wb` — two albums, not one**
>
> This is a restructure. The page currently holds one album; it holds two.
>
> Album A — The Best of Weird.Baby Vol. 1
>
> * Keeps the existing vinyl cover.
> * Page title `THE MAKING OF BOWB V1` → `The Best of Weird.Baby Vol. 1`. No
>   "making of" anywhere on the site.
> * `01 About this record` leaves this album entirely — it becomes a track on
>   Album B. Remaining seven renumber 01–07.
> * Track chip `RECORDING — 2026-06` → `first pass`, matching the approved
>   blurb.
> * Blurb approved as written: "The first pass. Rough, unrefined — and the
>   version that went in as the original copyright submission."
>
> Album B — About the Artist
>
> * Gray WB album art from the Robots repo — copy it here and bank it. Never
>   write the Robots repo.
> * Its tracks are the sections: About, FAQ. Photos and more later.
> * Voice is Mike's own. Papa Weird.Baby is him, not a persona.
>
> Carousel: two covers now, so `<` `>` go live.
> Template: WAL is the standard — About + FAQ. Same template on every album
> page; only the data differs.
> Viewer:
>
> * Remove the thin light line around the album art, or darken it to hide.
> * Background blends — no seam, continuous through the column.
> * Small controls above the viewer, WAL-style. Delete the black player bar.
>
> Click behavior: first click on an unfocused track focuses only, never plays.
> Play on a click while the track already has focus, and on double-click.
>
> **C · Lobby / guest book**
>
> * NOW copy: approved, no change.
> * LAUNCH copy swaps Sunday night: "Welcome. The first 100 people who sign the
>   guest book will be remembered differently than the ones who come later."
> * Number the entries in the scroller. Mini egg.
> * Two names on one line → split the line. (`papa weird.baby, Larry Liebenxyz,
>   James E`)
> * Comments stacked straight, not jagged. Reserve column width for the name.
> * Not yet: entry 31 gets something extra, silent — TBD by Mike. At 100, kill
>   "The first…" — TBD. Build neither now.
>
> **D · Foundation**
>
> * Top-left `Weird.Baby` wordmark currently exits to the gift shop. It must
>   exit to the lobby. Top-right `LOBBY` is already correct.
> * ADD to section `03 FAQ` — existing content stays. Mike polishes later.
>
> ```
> YOUR DONATIONS
>   100% of every donation goes directly to Coalition for the Homeless.
>
> MERCH PROFITS / MUSIC ROYALTIES
>   100% of Weird.Baby profits and royalties goes directly to
>   Coalition for the Homeless.
>
> WHO PAYS FOR ALL THE STUFF?!?!
>   Mike and Mo Lang pay all the bills (Internet, robot parts,
>   pens and pencils, etc.)
>
> FOR HOW LONG?
>   We intend to keep it that way forever; time will tell.
>
> CAN PEOPLE CONTRIBUTE IN WAYS OTHER THAN CASH?
>   Yes. We will speak up when we have a need to fill.
>
> Weird.Baby is dedicated to preventing the soul-sucker that is
> Homelessness.
>
> What's your purpose in life? Wanna pitch in?
> ```
>
> (`dedictated` → `dedicated` corrected. Everything else verbatim.)
>
> **E · Across the site**
>
> Increase the font size of the top-left and top-right header links
> (`Weird.Baby`, `GIFT SHOP`, `LOBBY`). Currently too small on every page.
>
> **F · The emitter — from tonight's rehearsal**
>
> RULING: a section whose body is empty after notes are removed is dropped
> entirely, label included. A bald heading never reaches the page. Reproduce:
> clear a section's only paragraph, re-run — the section must not appear.
>
> Two holes found, neither Saturday-blocking:
>
> * `workbook_to_draft.py` has no npm script. It's the first link in Saturday's
>   chain and the only one unreachable by name. Wire it.
> * The reader's `EXPECT` guard checks rows 4, 5 and 6 only — not the twelve
>   section rows. A workbook shifted below row 8 lands sections into the wrong
>   slots silently.
>
> **G · Ops desk**
>
> Prune it. Add the Excel workbook to it.
>
> **H · JOB 4 leftovers — ruled**
>
> * DELETE all three: `tools/batch1b_covers_mvwrite.py`,
>   `tools/batch1c_photo_repoint.py`, `tools/press_batch_stage3_facts.json`.
> * KEEP `docs/taxonomy/RETAG_PLAN.md`, unmarked.
> * Leave the regexes alone.

---

## §1 — A · THE PANEL BUG · FIXED AT THE MEASUREMENT

**THE CAUSE IS TWO NUMBERS FOR ONE BOX.** `--fit-area-max` is a pixel count the
fit effect (`Exhibit.jsx`, the `useLayoutEffect` at the head of the component)
writes ONCE at mount from `window.innerHeight`, and caches in `sessionStorage`
under `<cfKey>-cap`. It was applied as `max-height` on `.vp-area-flat`, which is
`flex:0 0 auto`. The column around it, `.ex-right`, is sized by the grid row —
the flex leftover — computed continuously. `.ex-right` carries the house cream,
so the difference between the two numbers is painted, with a hard edge across
it.

**MEASURED BEFORE, `/wb`, album 2, one song selected, viewport 1690×810:**

```
.ex-right  400px      the container
.vp-area   297px      the panel      cap = 297px
GAP        103px      bare cream, edge at 74% down the column
```

74% is *"roughly three-quarters down the column"*, to the word. It did not
settle: identical at +350ms and at +2s, and it moved only when the window height
moved, which is his third symptom. `/wal` shows the same shape smaller — 424 vs
321 + a 56px scroller, 35px over — and shows no seam on a **face**, because a
stowed face is `height:auto` and grows into the column. That is the state he was
comparing against.

**THE FIX.** `.ex-root[data-flat="1"] .vp-area-flat:not(.vp-area-stowed)` is
`flex:1 1 auto; min-height:0` and carries neither `aspect-ratio` nor the cap. In
this column that flex IS the subtraction the cap was approximating
(`avail − carousel − scroller-reserve`), done by the layout engine on every
frame, with no stored copy. The picture keeps its ratio off `.vp-inner`, which
is 16:9 off its own height, and simply fills a taller slot. `.fs-wrap` is
`flex:0 0 auto` and keeps its reserved room.

**THE ONE-COLUMN FRAME GETS ITS RATIO BOX BACK** under `@media (max-width:720px)`
— the same guard the `:not([data-flat])` rule at that break already carries, and
for the reason its own note gives: stacked, that row is sized by its content, so
`flex:1 1 auto` divides a nothing and the picture collapses to zero.

**VERIFIED HIS WAY — loaded at two window heights, no resizing** (same-origin
iframe at a set size, the museum's own lap technique, because the window itself
would not change height under the automation):

| | `.ex-right` | `.vp-area` | GAP | picture |
|---|---:|---:|---:|---|
| 1280×760 | 350 | 350 | **0** | 619×348, ratio 1.778 |
| 1280×560 | 180 | 180 | **0** | 318×179, ratio 1.778 |

And the neighbours, same technique: `/wal` at 760 and at 560 leaves exactly
12px, which is `.ex-right>.fs-wrap`'s own `margin-top` and not a seam;
`/foundation` leaves 0.

## §2 — B · `/wb`

| | |
|---|---|
| album A retitled | `The Making of BoWB V1` → **`The Best of Weird.Baby Vol. 1`** |
| "making of" swept | four occurrences, all in `weird-baby.js`; `grep -ri` over `src/` now returns only comments |
| `01 About this record` | moved to album B, second row |
| track chip | `Recording — 2026-06` → **`first pass`** |
| album B un-hidden | `HIDDEN_AT_LAUNCH` emptied — the carousel shows two covers at launch and `<` `>` go live |
| album B's first row | `About the artist` → **`About`** |
| the black player bar | gone; `transport: "banner"` |
| the thin light line | deleted from `.vp-thumb img.vp-thumb-album` |
| click behaviour | arm-then-fire is unconditional; double-click plays |

**THE GRAY ALBUM ART WAS ALREADY HERE AND ALREADY BANKED.** He asked for it to
be copied from the Robots repo. `public/images/wb/about-cover.png` **is** that
sleeve — built on the robots template by `tools/make_house_covers.py` at A3
(2026-08-06) and committed. Checked before doing it twice: the robots repository
holds **no album art at all** — no cover PNG, no album directory, no logo file —
so there was nothing to copy and nothing was written to that repo.

**THE PLAYER BAR IS ONE LINE BECAUSE THE MECHANISM WAS WAL'S ALREADY.**
`transport: "banner"` (M-e, 2026-08-02) stows the transport into
`.ex-album-banner`, the half-empty artist-name bar directly above the viewer,
and the same flag stands `.pb` down. M-e's own note names /wb as one of three
wings that "declare nothing and are untouched"; this is /wb declaring.
`playerBar:false` — /robots' and /foundation's flag — would have been the wrong
one: it deletes the transport outright, and this wing has six songs.

**THE CLICK RULE IS HIS OWN V3 WITH ONE CONDITION REMOVED, AND IT IS
ENGINE-WIDE.** V3 (2026-08-03, also his) armed-then-fired only *while something
was playing*; from silence, one click played. `somethingPlaying` is gone, so the
first song of a visit now behaves like every song after it. Double-click is the
escape hatch the gate needs, and the first click of a double still arms, so the
two gestures compose. **It moves `/wal`, `/hr`, `/robots` and `/foundation`
too** — one rule, one implementation — and the change can only ever cost a
press; it can never start something he did not ask for.

**THE ROW COUNT DOES NOT MATCH HIS.** He wrote *"Remaining seven renumber
01–07."* Album A held seven rows, one of which was `About this record`, so six
remain and they number 01–06. Numbering is `index + 1` and needed no edit.

**THE FAQ ROW ON ALBUM B IS NOT BUILT.** He named the album's tracks as "the
sections: About, FAQ" and supplied no questions. `faqFace()` is one data block
away, /wal and /foundation both drive it from a plain array — what is missing is
his questions. Building an empty one is what the NO-COMING-SOON credo kills, and
inventing five is Doctrine 12. The house's own FAQ at /booth is deliberately not
copied here: W1 removed the keeper's answer from this very card for being an
answer about the HOUSE printed under an ARTIST's name.

**"Voice is Mike's own. Papa Weird.Baby is him, not a persona."** Nothing was
rewritten on that instruction. The album's blurb is Ops' third-person sentence
and is left standing rather than re-voiced, because writing his voice for him is
the invention Doctrine 12 forbids. It is a slot waiting for his line.

## §3 — C · LOBBY / GUEST BOOK

**NOW COPY UNTOUCHED TO THE CHARACTER**, which is what "approved, no change"
means. The `ROBOTS_OPEN` branch carries his new sentence; the switch is the
wing's own (`src/lib/wing-open.js`), read by the worker at request time, and
Sunday night is when it turns. **Nothing counts to 100** — "the first 100" is a
promise in his copy and what happens at 100 is his own TBD, deliberately not
built, as is entry 31.

**WHAT LEFT WITH THE OLD OPEN WORDING**, named once here: *"The museum is open.
A new Record every day for ninety days."* and the `/robots/record` link inside
it — the only prose door to the Record on that board. `wb-note-link` is left in
the stylesheet rather than swept, because the room is re-walked Sunday and a
class deleted in the same hour as its sentence is two things to unpick if he
wants the door back.

**THE SIGNATURES ARE NUMBERED BY POSITION, NOT BY `id`.** The live book runs
1, 2, 5, 6, 7, 8 — two rows were removed at some point — so printing `id` would
number six signatures up to eight. The list arrives newest first, so the number
is `total − i`: Papa Weird.Baby signed first, is 1, and is at the bottom, where
a guest book's first name belongs. Every copy in the loop carries the same
numbers; a loop that counted 7, 8, 9 on the second pass would be inventing
people.

**THE JAG, MEASURED ON THE LIVE LOBBY AT 1706px.** Every `.wb-entry` is its own
grid, so column 1 was `auto` against ONE name. The notes began at six different
x positions:

```
Mo 944 · Tommy 972 · James E 980 · Sammy B 986 ·
Papa Weird.Baby 1037 · Larry Leibensperger 1054
```

a **110px stagger down a six-row book**. The name column is now one number for
the whole book — the widest name in it, measured, released and read in the same
layout pass as the row height, because releasing the width changes the note
column, which changes how a note wraps, which changes the tallest row. That is
G1's own answer to the row height applied to the axis it did not cover.
Subgrid would also do it and is not used: `.wb-entries` is not the rows' grid
parent in the stepped scroller, so a subgrid would work in the plain list and
quietly stop working in the one he is looking at.

**"Two names on one line → split the line" IS NOT DONE, AND IT IS THE ONE THING
IN THIS PACKET OPS COULD NOT RESOLVE.** See §7.

## §4 — D · FOUNDATION

**THE WORDMARK.** `brandTo` is per-wing config now, defaulting to the shop, and
/foundation declares `"/"`. `MuseumBar.jsx`'s own header flagged this in 2026-08
as the one thing the three merged bars disagreed about and did **not** unify —
"the exhibit's wordmark goes to the GIFT SHOP; the shop's and the booth's go to
the LOBBY… Flagged for Mike in the round log rather than unified here." This is
his answer, applied where he gave it. No other wing moves.

**HIS FIVE, ADDED TO `03 FAQ`, VERBATIM** — capitals, `?!?!` and all, with the
one correction he made himself (`dedictated` → `dedicated`). Three of the five
answers were typed across two lines in his block; each is one sentence and is one
string, because splitting on the newline would have invented five paragraphs he
did not write.

**THE TWO CLOSING LINES ARE A CLOSING BLOCK, IN THE OPEN.** `faqFace()` gained a
third argument. The alternatives are named rather than glossed: appending them to
the last answer files a statement about the whole room under "CAN PEOPLE
CONTRIBUTE IN WAYS OTHER THAN CASH?"; giving them a question of their own invents
a heading he did not write; dropping them edits his instruction. They are not
inside a `<details>` — a statement nobody asked a question about must not need a
click to appear.

**IT IS NOT THE STRUCK SIGN-OFF RETURNING.** What D (2026-08-11) struck was the
wing's NAME and the word FAQ set as furniture under five faces. `closing` takes
paragraphs and nothing else — no title, no link, no address — and exactly one
caller passes it.

**ONE THING FOR HIM:** his five headings are in capitals and sit beside eleven
sentence-case questions. That is his line and his instruction says he polishes
later, so it was not restyled. Raised, not changed.

## §5 — E · THE HEADER LINKS

`.wb-bar-brand` 0.85rem → **1rem** (13.6 → 16px). `.wb-bar-exit` 0.7rem →
**0.82rem** (11.2 → 13.1px). The room name in the middle track is untouched at
1.2rem, so the bar's hierarchy is unchanged.

**RE-MEASURED AT THE WIDTH WHERE THE BAR'S DOCUMENTED COLLISION WAS.** The
2026-08-11 note records "32px of HUNTER ROOT printed on top of GIFT SHOP" at
390px. Measured after this change, five rooms at 390px and two at 1280px:
**overlap 0 and clipped characters 0 on every one.** The geometry is a grid with
min-content flanks and an ellipsising centre, so a wider end squeezes the room's
name instead of printing over it.

## §6 — F · THE EMITTER

**THE RULING IS ENFORCED IN THREE PLACES.** `workbook_to_draft.py` drops the
slot when it reads it, `emit-record-entries.mjs` refuses to write it into the
tree, and `RecordEntry.jsx` refuses to draw one that arrives by any other road —
a hand edit, an old draft landed, an importer nobody has written yet.

The reader's test used to be `if not label and not body`, so a slot with a LABEL
and an empty TEXT cell survived. That is not a hypothetical shape: his notes to
Ops live in curly braces inside the body, so a section whose only paragraph is a
note becomes exactly this the moment the note is acted on and deleted — and the
heading he wrote for it has no reason to be deleted at the same time.

**HIS OWN REPRODUCE, RUN.** Cleared row 10 of `Day 2 - Record 002` (the only
paragraph of `EXECUTIVE SUMMARY`), left the heading in place, re-ran:

```
before   002   2 section(s), 5 paragraph(s)
after    002   1 section(s), 2 paragraph(s)   — the EXECUTIVE SUMMARY slot is gone, label included
```

**THE `EXPECT` GUARD NOW COVERS ALL TWELVE SECTION ROWS.** Each row is checked
for several substrings rather than one whole string, because column A reads
`Section 3 — LABEL` with an em dash and matching the literal would make the
guard fail the day somebody retypes the sheet with a hyphen — a guard that cries
wolf gets deleted.

**PROVED BY BREAKING IT.** Inserted one row at row 8 of `Day 2` — above THE
SECTIONS, below the three rows the old guard watched — and re-ran. The old guard
would have passed and read every label and paragraph one row out: section 1's
label becomes section 1's text, section 2's text becomes section 3's label, and
nothing says so, because the draft is well-formed and the round-trip proof
compares the mangled draft against itself. The new guard **named all twelve
rows, exited 1, and wrote nothing.**

**`npm run record:workbook`** is the first link in the chain, now reachable by
name. `npm run record:proof` after all of it: all guards hold,
`robots-record.js` sha256 identical to where it started.

## §7 — G · THE OPS DESK

**PRUNED IN WORDS AND FURNITURE, NOT IN INSTRUMENTS.** The lead card's `what`
ran 66 words explaining how to click a day, what the magnifier does and how the
sort works — Doctrine 25, a briefing above the work, on the page whose whole job
is to get him into the work. Every card's copy is one line now. Off the top:
"Generated \<date\> by tools/ops-desk.mjs" (the watch, not the time — and every
card already prints its own age), a rebuild-everything command, and
`<h2>The instruments</h2>` on a page titled "the Ops desk" above a grid of
instruments. Off the foot: how to re-create the desktop shortcut with a
PowerShell one-liner. The one line kept is how to refresh the page he is on.

**NO INSTRUMENT WAS REMOVED, AND THAT IS DELIBERATE.** Doctrine 24 makes a card's
removal one-way, so it must be his word rather than Ops' reading of "prune it".
Two are the obvious candidates and neither is Ops' to take: the **Record
editor**, whose own card says NOT THE ROAD but whose 2026-08-11 note argues
against deleting it in writing — *"a mothballed instrument that vanishes from
the desk is one nobody can find when it is wanted again"* — and the **spec sheet
and egg tracker**, neither of which is week-one work. One word each.

**THE WORKBOOK HAS A CARD**, marked `lead` beside the artifacts page. It lives
outside `docs/`, so the desk gained an `abs` field: an outside file is stat'd at
its own absolute path and linked as `file://`, and gets a red unlinked card if it
has been moved — the desk's standing rule, unchanged.

## §8 — H · THE JOB 4 LEFTOVERS

All three deleted. `RETAG_PLAN.md` untouched and unmarked. No regex widened;
`315 → 385` and `152 → 166` stay stale, reported and uncorrected, and row B-a's
stray backtick is noted and not chased.

---

## WHAT NEEDS MIKE

1. **"Two names on one line → split the line."** Ops could not determine what
   this is. Measured on the live lobby, every `.wb-entry` renders exactly one
   signature; no two names share a line anywhere in the DOM. The three he names
   — `Papa Weird.Baby`, `Larry Leibensperger`, `James E` — are the three
   **longest names** in the book and the three whose notes are longest, and with
   the name column reserved their comments now start at the same x as everybody
   else's. The likeliest reading is that the reserved column IS the fix and this
   bullet and the next one are one defect; the other reading is that those three
   want their comment on its own line beneath the name. **One word.**
2. **The FAQ row on `/wb`'s About the Artist album needs his questions.** See
   §2.
3. **The Ops desk: which instruments go?** See §7.
4. **His five FAQ headings are in capitals** beside eleven sentence-case
   questions. Left as written. See §4.
5. **Album A has six rows after the move, not the seven he wrote.** See §2.
