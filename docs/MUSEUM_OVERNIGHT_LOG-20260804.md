# THE OVERNIGHT — round log (v50; N1–N9)

**2026-08-04. Autonomous single-agent Code-lane round on Mike's remote-control
brief. Drafting lane, no git until seal. PUSH AND DEPLOY ARE MIKE'S.**

The ledger of what is open is `docs/OPEN_ACTIONS.md` and it was updated in the
same commit (Doctrine 14). This file is the narrative.

---

## What the round was asked for, and what it actually turned out to be

Nine instructions, and seven of them were renames, removals and one new
surface — the kind of round that looks like a list of edits. Two things made it
not that.

**The first is that the tracking answer was written against the code and the
code disagreed with the answer that was already published.** `/booth` has said,
since it was built, that it counts which rooms get walked through and that *"that
is the whole of it"*. It is not the whole of it: `index.html` ships a
`<link rel="stylesheet">` to `fonts.googleapis.com` with preconnects to it and to
`fonts.gstatic.com`, so every visitor's browser makes a request to Google before
a word of the page is painted. Nobody was hiding it. The sentence was written by
people who meant it, and it was wrong, and it stayed wrong until somebody read
`worker.js` and `index.html` instead of trusting it. That is exactly what Mike's
phrase *"written against worker.js, not against goodwill"* buys, and it bought it
on the first pass.

**The second is that the asset table's orphan detection could be defeated by a
comment — and this round proved it by committing the defect.** N1 removed The
Parts, which orphaned `parts_drawer.jpg`, and the removal note named that file so
a future session would find it. The next `--scan` reported the file as **still
shipped, cited by the very file that had just stopped using it**, because
`usedBy` was a substring test over raw source text. The finding is the mechanism,
not the file: any orphan was invisible for as long as anybody had written its
name down. Fixed, and both counts moved (shipped 44 → 43, unreferenced 3 → 4).

Everything else follows.

---

## N1 — the renames and the removals

**THE MORGUE IS STRUCK; BOTH WALLS READ IMAGE ARCHIVE.** A3 deliberately printed
both candidate names — title THE MORGUE, subtitle IMAGE ARCHIVE — *so the choice
could be made by looking rather than by describing*. It was made. The subtitle
drops back to naming the unit, which is what every other subtitle in the wing
does. **The individual photographs are still called plates**, exactly as A3
ruled: a plate is the object, the archive is the room, and four other faces refer
to plates by name. Register row M6 closes.

**THE FIRMWARE → TECHNICAL SPECIFICATIONS, ON BOTH FACES THAT CARRIED IT.** This
is the round's one scope call and it is flagged as M24. Two faces were titled
"The Firmware": MGK-VIII's (a board, a numerical envelope, four output chains, a
brightness cap — literally technical specifications) and MGK-VIIIp's artifact
slot (two source trees, named as they sit). Renaming one would have left the
retired name on the glass, which is the single outcome the instruction cannot
have meant. Their subtitles do the telling-apart and are untouched. **The
ARTIFACT keeps its name** — only the FACE was renamed, and the file says so, so a
later sweep does not read this as licence to hunt the word "firmware" out of
prose.

**THE PARTS IS REMOVED, and what left with it is named.** Two of its three
entries were observations read straight off the photographs and are recoverable
from nothing else in the wing: the METHOD row (the parts drawer as the tell — a
graded stock of indicator jewels and switchgear kept long before any machine
needed one), and the EIGHT YEARS row (two plates are the same chest photographed
eight years apart, and very little between them changed). The CAUTION row was the
only place in the wing stating that the plates establish what the machine is made
OF and **nothing whatever** about where any single part came from. The four-line
materials register went too. It is a deletion Mike asked for and it is recoverable
from git; it is recorded here because a removal that costs something should say
what it cost.

**AND IT ORPHANED A PHOTOGRAPH.** `parts_drawer.jpg` is now referenced by
nothing. It was **not** deleted on Ops' word — it is a real photograph the museum
owns — and it was **not** re-homed onto the Image Archive, which would have added
a plate nobody asked for to a wall whose tombstone counts them. It is row M9.

**THE DIRECTORY.** Two of the three names Mike listed already lacked the article;
the Foundation was the only line on the board carrying one, which is why it read
as the odd one out. **The room's own name is untouched** — the instruction was
about the DIRECTORY, and a board is a list of where things are while a door
carries the full name. That divergence is flagged as M26 rather than resolved
unilaterally.

**THE INFORMATION BOOTH TAKES THE BOTTOM.** It was fourth of six, in the middle
of a list, wearing the same weight as the rooms either side of it. On a board this
short the last line is as exposed as the first, with the difference that the first
belongs to the house's own work — which is what a visitor came for — and the desk
is where they go when the rooms did not answer it. **The exhibit order under it is
unchanged**: ours, ours, theirs, then the Foundation, then the shop.

Verified on the built page: `Weird.Baby Robots · Weird.Baby Music · Other Music
Worth a Listen · Weird.Baby Foundation · Gift Shop · Information Booth`.

---

## N2 — the archive stacks, and the old spreads stow

A4 built the first half of Mike's sentence (*"latest spread at top"*) and then
printed every spread at full height, so an archive of a dozen albums would have
been a dozen walls of equal weight and the "frictionless newest" it was built for
would have been the shortest part of a very long page. **This round built the
second half.**

**WHY THIS IS NOT THE NO-HIDDEN-INFORMATION LAW BEING BROKEN**, which is a
standing doctrine and beats a convenience every time. That law's complaint is a
control whose label says nothing about what is behind it — *"Next ›"* — because
*"people will not flick to discover whether something is interesting."* A stowed
shelf here carries its own DATE and its own COUNT on the closed line:
`FEBRUARY 2013 · 3 plates` describes its contents completely before it is
touched. Nothing is discovered by opening it that was not already stated by it,
which is the same test the booth's question list passes.

- Native `<details>` (Doctrine 8): opens with a keyboard, announced to a screen
  reader, works with JavaScript having a bad day.
- **The first spread is never stowed, and an unheaded spread is never stowed** —
  so a one-spread archive and a plain `collage` face emit the DOM they emitted
  before. The MGK-VIIIp wall is byte-identical.
- Measured on the built bundle: MGK-VIII stacks **MARCH 2021 open with 5 plates**
  over **FEBRUARY 2013 stowed with 3**, total 8, matching the tombstone. The
  stowed shelf is **21px closed and 258px open**; its marker reads `+` closed and
  `−` open.
- The count needs a noun and the wall is generic, so `face.archiveUnit` is
  declarable per face (this wing says *plate/plates*) and defaults to
  *image/images* — the archive's own plain name, which cannot be wrong for an
  image archive.

**THE SIBLINGS ARE NAMED AND NOT BUILT.** VIDEO ARCHIVE and AUDIO ARCHIVE — the
same component with different data. THE REEL and THE TAPE LIBRARY retired along
with THE MORGUE: a house that has just struck one piece of trade slang does not
keep two more. Neither is scaffolded, because Mike's own words for this round were
**"build only what has content"**, and every `videos:` array in the wing is empty
and the wing has no audio.

---

## N3 — DOC CONTROL

A fourth face on the front desk, because its three subjects — manuals, originals,
files — are HOUSE functions running across every unit rather than properties of
one machine. The Manual face is a catalogue entry for one object; this is the desk
that says how paper is handled here, and the front desk is already where the house
explains itself.

**MIKE'S CANON IS PRINTED, AS ITS OWN ENTRY.** The manual came in pieces, like
everything else, and presumably that was the point — a complete document is a
document somebody can be caught holding. No complete table of contents, no index,
not every page, and therefore not every answer. What is held is assembled out of
copies caught at different stages: preliminary, final, marked up by hand, and one
stamped APPROVED. `[PAPA]` sits on the WORDING, because the substance is his.

**THE LINE IT DOES NOT CROSS.** Everything else on the face is a HOLDINGS
statement another face in the wing already carries and can be checked against —
the manual has no pages imaged, the photographs were taken and are held here, two
firmware trees are on file and no reading of them is. **Nothing describes this
repository**, its directories, its verification runs or its backlog. That would be
the making of the museum on the glass, which Doctrine 11 forbids however true it
is. Stating the incompleteness as a fact about the OBJECT is what makes it
shippable and, in Mike's own framing, the cover.

**The hook is a rubber stamp**, drawn as a rotated group so the frame and the word
cannot disagree about the angle, carrying APPROVED and the four state names — not
one word on it is new. Fourth typographic object in the building after the booth's
ticket, the Foundation's account card, and the front desk's tally.

---

## N4 — Welcome and Contact, burned down

**THE PROPOSAL FOR WELCOME'S REASON TO EXIST: it is the wing's ORIENTATION, the
only surface that says what is in this building and where.** Nothing was doing
that job. `/robots` opens on this face, and a stranger got a paragraph, the
house's trade, and three rows of posture — then a tracklist of proper nouns
(MGK-NIAC, Image Archive, The Record, The Portal) with nothing anywhere saying
which is a machine, which is a shelf of photographs, and which is the one thing
that actually runs. The three posture rows are good and are kept. What was missing
is that a visitor could read the whole face and still not know what the wing
holds.

So the register block stops being a business card and becomes a **contents list**
(`UNITS` / `ON FILE` / `TRADE` / `TAGLINE`), and a fourth entry — **WHERE TO
START** — routes: the image archives are what the machines look like, the record
is what happened, the portal is the only thing in the wing that is running. Every
clause names a face one press away. **Not one new fact**, which is the same rule
M11 held when it rewrote this desk.

**AND THE INVENTED COUNT COMES OUT.** *"three cartons of them arrived on a dock"*
— H4 established the carton count was invented and struck it from Record 013, and
the same number was left standing here in **the first sentence a stranger reads on
entering the wing**, carried as M15 since. It is not replaced with another number,
because nobody supplied one. The sentence now says a delivery arrived. M15 closes
by deletion, which is the only way Doctrine 12 permits it to close.

**CONTACT IS THE ADDRESS.** What the ceremony was, since it was all well-made and
that is why it lasted: the blurb ranked four reasons to write *by how much they
would help us* and then told the visitor which mattered most — leading, literally,
on a face whose job is to hand over an address. The REACH entry was four lines
arguing that the address being read by one person is why an answer from it is
worth having. The card said ONE / ADDRESS / READ BY ONE PERSON **and did not
contain the address**.

What is left is `papa@weird.baby` and three things worth writing about, one line
each — provenance, a correction, availability — with the ranking, the persuasion
and the self-description taken out. REACH is deleted outright rather than
shortened, because the address is now the first thing on the face and the picture
beside it. **It keeps its hook and the hook is now the plainest possible one: the
address, set large.** An instruction to be plain does not waive the Visual Hook
Law, and it did not have to.

---

## N5 — the booth's ticket, and the tracking answer

### Two faults, and they are different faults

- **The copy fault.** A ticket printing *"no ticket required"*. A visitor reads
  the object first and the words second, so the object says *here is your ticket*
  and the words say *there is no ticket*, and the reader resolves a contradiction
  to arrive at a fact the page states plainly four lines below.
- **The value fault.** It was `--wb-gold` ground — **#211f1c, the ramp's ink** —
  so the first object on the museum's lightest page was a near-black slab. F1
  chose that deliberately ("the one value inversion on the sheet, so the eye lands
  there first") and it works too well: it lands like a warning in the room whose
  whole register is welcoming.

### Both directions are built and both are live

**A — THE TICKET, MADE OF PAPER** (`/booth`, Mike's stated lean). Ticket stock on
the card rather than ink; a **guilloche rosette** tint, which is what security
printing puts under ticket copy and is the single strongest cue that a rectangle
is a ticket; a diagonal security hatch at a period that does not divide into the
rosette's, which is how real tint blocks avoid moiré; a real perforation with the
two discs painted in the sheet's own colour so the stub reads as **torn**; and a
**punch hole** lit from above, which is the detail that stops it being a drawing.
The curl is two shadows rather than a transform — a 3D transform would have cost a
compositing layer and a blurry text raster. Copy: `ADMIT ONE · NO CHARGE ·
ALWAYS`, all of it already on the page, "Always" being the credo's own word.

**B — THE ENAMEL SIGN** (`/booth?hook=sign`). A different object CLASS on purpose;
two variations on a ticket would not be a choice worth rendering. **The keyline
inset from the edge is the whole tell** — a vitreous-enamel plate's signature,
because the border is where the enamel is thinnest. Four bolt heads lit from the
same direction as the ticket's punch, so if the room ever shows both the light
agrees with itself. It sits at `--wb-gold-lo`, a full step off the ink.

**Neither adds a claim, and no serial number was invented** — "No. ∞" survives
precisely because it is a statement rather than a number somebody would have had
to make up.

**ONE THING WAS FOUND BY LOOKING AT THE BUILT PAGE AND NOT THE SOURCE:** the
sign's first subtitle was *"Equally free. Always."* — correct by the
not-one-new-word discipline, and on the glass it landed 120px above the credo
saying the same four words at three times the size. The ticket does not have this
problem because its own line is a different sentence from anything near it. The
subtitle now names the museum, which is the ticket's own kicker.

**The switch is temporary by declaration.** This building already owns the
cautionary tale: the lobby's `?subtitle=` was a shown-then-asked device that
outlived the asking and became four dead strings and a live URL rendering a
retired identity. **The loser is deleted the day Mike chooses, and that deletion
is register row M23 rather than an intention in a comment.**

### "Are you tracking me?"

The old question (*"Do I have to sign in? Are you watching me?"*) is **replaced,
not joined** — two near-identical questions on one list is worse than one good
one. Every clause of the new answer is falsifiable from one file:

| Clause | Read from |
|---|---|
| no account, nothing to sign in to | `src/worker.js` — no auth of any kind, on any route |
| **no cookies at all** | no `Set-Cookie` in the worker, no `document.cookie` in `src/` |
| three columns, and none of them is you | `POST /api/visits` inserts `(page, referrer, visited_at)` and nothing else |
| the lobby and the exhibit rooms | the only two components that fire it |
| exactly what you typed | `POST /api/guestbook` — name, note, a fixed badge, a timestamp |
| a few display settings, never sent | `use-arrival.js` (sessionStorage), `Exhibit.jsx` (localStorage) |
| **Google is asked for the typefaces** | `index.html` — the stylesheet `<link>` and two preconnects |

**The scope of the claim is deliberately "what this site records"**, not "what any
machine between you and it can see". The second is not knowable from this
repository, and a privacy answer that overreaches by one clause is the same defect
as one that hides a clause.

---

## N6 — the guest book, two ways

**The obvious reading was already built.** `.wb-entries` has been a fixed
seven-row window with `overflow-y:auto` and scroll-snap since the book was made —
the visitor can already scroll it, so a second version that is also a scroll box
would not be a choice. The variant is the book scrolling **itself**.

Same window, same rows, same order; the only variable is whether the list moves on
its own, because anything else that differed would confound the comparison.

- **The loop is two copies and a 50% travel**, and it was measured rather than
  asserted: at cycle end the track has travelled **270px against a 270px half**,
  so the reset is pixel-identical and there is no visible jump. The second copy is
  `aria-hidden` — the same signatures, and announcing the museum's guest book
  twice would be a defect dressed as an animation.
- **It stops when a reader arrives** — `:hover` and `:focus-within` pause it. A
  moving list nobody can stop is the failure mode of every ticker ever built.
- **`prefers-reduced-motion: reduce` falls back to the static list**, not to a
  slower one. The answer to that signal is *don't*, not *less*.
- **Below five signatures it renders the static list**, because the entries do not
  fill the window and the animation would drag a short list through empty space.

Verified on the built bundle with nine seeded local entries: two halves of nine,
track 540px in the window, `wb-book-drift 23.4s`, mask applied, `overflow:hidden`,
second half `aria-hidden="true"`. The hover-pause and reduced-motion rules were
confirmed present in the **built** CSS; CSS `:hover` cannot be exercised by a
synthetic event and that is said here rather than claimed otherwise.

---

## N7 — the Foundation's DONATED BY column

**Four values, and every one means something different.** A donor column whose
empty cells all print the same dash cannot tell *"nobody has given yet"* apart
from *"this was never a gift"*, and on a page about where money comes from that is
the whole distinction the page exists to draw.

| Value | Means |
|---|---|
| a name | printed as given |
| `ANONYMOUS` | a gift whose donor asked not to be named — **recorded**, because a person gave this and chose not to be named, and that is a fact about the gift |
| `NONE` → *Nobody yet* | nothing has come in this way. A holdings statement, and the true one for every giving channel in this house today |
| `NA` → *Not a gift* | the shop and the music are money the museum EARNED, and calling that donated would be the room flattering itself in its own ledger |

**AND NOT ONE CELL SAYS ANONYMOUS**, which is the point rather than a gap. Three
rows are NOT BUILT so nothing can have arrived through them; the other two are
sales. Writing ANONYMOUS into a cell to demonstrate that the column works would be
inventing a contribution that never happened — the exact failure Doctrine 12
exists for, on the exact page where it would matter most. The value is
**supported**, which is what was asked: declared, styled, documented, and one
field away.

The column is labelled in every row rather than headed once, because the register
stacks on a phone and a column heading that has scrolled away is a heading nobody
can read.

---

## N8 — the reveal arc

`revealArc` is the asset table's **fifth judged field** — carried across by a scan
and never written by one, exactly as `verdict` is, because no scan can read a
stage off a file's bytes. Values: `arrived | understood | partial | online |
null`, and the legend states plainly that **`null` means UNSET and is not a
stage**.

**Populated on 6 rows of 251, and unset on the rest by instruction.** The
MGK-VIIIp set is the unit the Portal IS, and only where the wing's own printed
tombstone or caption attests the stage:

- `arrived` — the family shot, the front, the top monitor, the rear power switch.
  The wall's tombstone says *"As received — before cleaning, before power."*
- `online` — `front_screen.png` (*"The front glass, lit"*, and the Technical
  Specifications face calls it *"the firmware, running"*) and `viiip.png` (the
  cover whose glass carries the BIOS beat).
- **Unset** — the three plates M7 disputes, and everything in every other wing.

**AND POPULATING IT SURFACED A CONTRADICTION NOBODY HAD NOTICED** (row M25): the
same tombstone that says all nine plates are *before power* sits on a wall
containing a plate captioned as the machine lit and running. Either the claim is
narrower than nine, or that plate is not "as received". Not resolved here — it is
a fact about the objects, so it is Mike's.

---

## N9 — the register, and two tool defects fixed on the way past

`docs/OPEN_ACTIONS.md` updated in this commit. **Closed:** M6, M15, and eight
mechanical items. **Added:** M23 (the two live pairs — the only rows that get
worse by waiting), M24 (the two-face rename scope), M25 (the power contradiction),
M26 (board name vs door name), M27 (the donor column's honest emptiness), M28 (the
arc's 6-of-251), C29–C31.

Two tool defects were found and fixed because this round tripped them:

1. **A path named in a COMMENT counted as a reference** — described at the top of
   this log. Fixed with a character scanner that strips comments while KEEPING
   string literals, because a path is a reference precisely when it is quoted, and
   a regex cannot do this in a tree where `//` and `/*` both live inside strings.
2. **`--scan` could never add a new header key**, because it spread the file's own
   header over the tool's. `HEADER` now wins for its own keys, so the legend is
   documentation with a source rather than a hand-edited field in a generated
   artifact.

**And the provenance boundary caught its own author twice**, which is worth
recording because it is the third round in a row it has done so:

- The gate refused all **82** new strings until they were declared, and the
  declaration is a script that names every key **explicitly** and refuses to run
  if a stub has no classification — so it cannot absorb a string nobody
  classified, which is the failure `backfill-20260804.mjs` is forbidden from
  repeating.
- **`--prune` then broke 14 surviving RESTATED rows**, because they were resting
  on two anchors this round deleted or edited. The rule requires **every**
  reference to resolve, not one, so a RESTATED row cannot quietly keep standing on
  a citation that has died. Ten were repointed at the successor of the sentence
  they restate; four at what is actually under them now. A dead citation was not
  replaced with a plausible one.

---

## Gates

| Gate | Result |
|---|---|
| `npm run lint` | **11 errors / 9 warnings = HEAD baseline, zero new** |
| `npm run build` | green, **70 modules** (unchanged) |
| `npm run provenance:gate` | **PASS** — 0 undeclared, 0 stale, INVENTION still **3** (capped, unchanged) |
| routes | 13/13 → 200, including `/money`, `/hr/archive` and a junk path landing on the Lobby |
| desktop lap, 1440×960 | `scrollWidth == clientWidth` on all 11 routes, **zero page-level horizontal scroll** |
| genuine 390×740 lap | **zero page-level horizontal scroll** on all 11 routes |
| console | **zero errors and zero warnings** across 11 routes, captured with an installed error hook rather than by reading a panel |

Provenance classes after the round: VERIFIED 1153 · HOUSE 1028 · RESTATED 270 ·
MIKE 95 · DERIVED 19 · **INVENTION 3** · UNDECLARED 0.

## Named honestly

- **Chrome's screenshot pipeline was unstable again**, as at v45–v49: it served
  frames from a stale scroll position on two pages. The load-bearing verification
  is DOM measurement on the built bundle via `wrangler dev` — every figure above
  is a measured value. **Screenshots were load-bearing for exactly one thing**,
  and it paid for itself: looking at the built booth is what caught the enamel
  sign repeating the credo verbatim 120px below it.
- **The scrolling guest book's animation could not be observed advancing**,
  because Chrome freezes animations in a backgrounded tab (`document.hidden` was
  true). The travel was verified by driving `Animation.currentTime` directly,
  which is why the seam figure is exact rather than approximate.
- **The hover-pause was not exercised**, only confirmed present in the built CSS.
  A synthetic `mouseover` does not trigger CSS `:hover`.
- **The guest book was seeded with nine local entries** to exercise the scroller.
  They live in `.wrangler/`, which is gitignored, and reach nothing.
- The quality of the two hook candidates is **Ops' read of two built pages**, not
  Mike's verdict. Choosing between them is M23 and is his.
