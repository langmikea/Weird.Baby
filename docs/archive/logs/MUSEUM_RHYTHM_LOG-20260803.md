# THE RHYTHM ROUND — round log (v38, 2026-08-03)

Autonomous single-agent Code-lane round on Mike's remote-control brief. Items
R0–R6. Deliverable folder: `docs/rhythm-20260803/` (before/after frames + notes).

Gates: **lint 11 err / 9 warn** (= HEAD baseline, zero new), **vite build green**,
browser lap at 1456×900 desktop AND a genuine 390px viewport via the same-origin
iframe harness. The harness (`public/_lap.html`) was created for the lap and
removed before seal; it is not in the diff.

**NOT PUSHED AND NOT DEPLOYED.** Both are Mike's.

---

## Per item

| # | Item | Outcome |
|---|---|---|
| R0 | V2 is the exhibit ground | **DONE** — recorded, measured, scope verified |
| R1 | rhythm and pacing | **DONE** — one missing declaration was the whole soup |
| R2 | type legibility | **DONE** — the face was the problem; face changed |
| R3 | resize + tracklist head | **BOTH FIXED** — and M0a's fix was right in the wrong place |
| R4 | align the register columns | **DONE** — aligned wins; judged and stated |
| R5a | WELCOME | **DONE** — "Welcome", justified; no collapse, justified |
| R5b | the poster | **DONE** — bill of four, names are doors |
| R6 | artist metrics | **DONE** — two boards with facts, two honest empty ones |

Files touched, complete list:

```
src/routes/exhibit/Exhibit.css        R0 R1 R2 R3 R4 R5b R6
src/routes/exhibit/Exhibit.jsx        R5b R6 (two new render blocks)
src/styles/museum-tokens.css          R2 (--wb-read)
src/data/artists/worth-a-listen.js    R5a R5b R6
docs/rhythm-20260803/                 the deliverable
```

---

## R0 — the optometrist's V2, written down

Mike picked variation 2. It lived only as an injected screenshot (the
optometrist's own rule: *"nothing here is in the repo's CSS"*), so adopting it
meant reconstructing it as a real rule at `Exhibit.css`'s WAL stage re-pin.

**Measured, so "one stop" is a number:**

| | before | after |
|---|---|---|
| body ink on ground | `#f1ecdd` on `#211d18` = **14.18:1** | `#f7f2e4` on `#3b352c` = **10.44:1** |
| quiet ink on ground | — | `#c4bba4` = **6.11:1** (AAA body) |
| mutest ink on ground | — | `#b0a68e` = **4.83:1** (AA body) |

What leaves is 3.7 points at the top of the ramp, which is the glare. Every step
still clears its own job. `--wb-gold-mute` is lifted a shade past a flat
one-stop translation on purpose — the literal translation (`#a49a83`) measures
**4.19:1**, under AA for the register's small mono, so a palette lift would have
quietly cost legibility at the bottom while fixing it at the top.

**M0b's ring keeps its number.** M0b sized `.vp-inner`'s 1px edge by contrast
against the stage (2.82:1). On the lifted ground `#867c66` measures **2.83:1** —
the same edge, not a re-tuned one.

**Scope, verified rather than assumed.** The brief said "robots if it shares".
It does not: `/robots` was driven live and its `.ex-right` reports
`--wb-ink: #ece9e0` — the paper ramp. Only two rules in the building re-pin this
ramp (`.pb`, and this one). Robots is a paper wing (L5's sheet-on-mat) and is
untouched by R0.

## R1 — "humanly soup" was one missing declaration

**The diagnosis.** `.vp-flat` — the flat wing's top-level container — was a
**plain block**. Every other container on a face is a flex column with a gap
(`.vp-face-body` 12px, `.vp-card-label` .7em, `.vp-records` 8px, `.vp-deck`
11px). The one container holding fifteen blocks of completely different kinds
supplied none, so the distance between the last line of the artist's biography
and the first row of the register was **0px**, measured on /wal. Fifteen blocks,
all butted at zero. That is the soup, and it is one declaration.

**The ladder**, all four steps derived from `--face-fs` so the pacing follows the
type instead of drifting from it at other sizes:

```
tight  .55x   inside a movement (a heading and the lead beneath it)
block  1.0x   between kin (two sideboxes; a label and its note)
sect   2.6x   A NEW SECTION BEGINS
end    3.8x   the document is over
```

The ratios are the point: 1 : 2.6 : 3.8 is legible **as a ratio** at a glance. A
flat 12px everywhere is legible as nothing. `margin-top` on the adjacent sibling
rather than `gap`, because `gap` is one number for the whole container and cannot
say "but this one is a section", which is the entire job.

**The rules came off, and that is what paid for the space.** `.vp-deck`'s
full-width hairline, `.vp-face-lines`' and `.vp-face-entries`' are gone. With
2.6× of air above a head that is now full-ink and a size up, a 1px line across
the page is a third signal saying what two stronger ones already said. Mike's
"not more rules and lines", applied by subtraction. Row rules on the log sheet
**stay** — a log sheet is ruled by row and that is the form itself, not a divider.

**The section heads were dressed as footnotes.** `.vp-records-head` and
`.vp-deck-head` were `--fs-micro` mono at `--wb-gold-lo` — the same size, face,
weight and ink as a caption, a credit line and a footnote. They are Syne 800 at
`--fs-small` in full ink now: three signals at once, none of them a line, and
still a clear rank below `.vp-face-title`.

**Found while measuring: the biggest hole on the page was in the head.**
`.vp-face-head` is 216px tall because the plate is; `.vp-face-headtext` inside it
is **60px**. The other **156px is nothing** — a void between the artist's name
and the first sentence about her. Not a gap anyone chose: F1 built the head as a
two-column composition when the lead lived inside the text column, and L5 later
moved the lead out (correctly, for the stage packer), leaving the text column
holding a title and a subtitle against a 210px picture. The flat wing has no
packer, so the plate now **floats** and the words set beside it and close under
it — which is a magazine head and is what F1's own note describes.

**The document is 26% longer after** (3,772px against 3,002px on Carsie's card).
That is the breathing room, and it is the intended trade.

## R2 — it was never the size

**Measured before the change:** the interpretive label ran at **19.6px** —
`--face-fs` had already resolved to its ceiling — over a 62ch measure at 1.5
leading. Nineteen-point-six pixels is not small type, and the only dial P7 left
is `--face-fs` itself, which raises the headline and the register too. P7's own
note rules that move out: *"blows up the big text to rescue the small."*

Four things were wrong and every one is a property of the FACE or the LINE:

- **FACE** — DM Serif Display, and the name is the specification: a Didone-class
  display serif whose thins go sub-pixel at reading size and whose counters close
  up. Right for a word set large, wrong for four hundred words at 17–20px.
- **MEASURE** — `ch` is the advance of *zero*, which on this face is 13.24px
  against a **10.20px average character**. `ch` under-reports the line by about a
  quarter, so 62ch was running ~80 characters. Now 56ch = 741px = **67
  characters, counted** (range rects on Carsie's first paragraph) — one off
  Bringhurst's 66. Counted rather than assumed, precisely because `ch` is not a
  character.
- **LEADING** — 1.5 is a sans number. 1.62.
- **TRACKING** — light type on a dark ground blooms and closes its own word
  spaces. +.005em. Invisible until it is missing.

**The choice, stated: Fraunces.** It costs nothing — already in this repo's one
font `<link>`, already loaded on every page, and already **Mike's own pick** (the
v28_3 pairing he chose for the HR deck, `HrExhibitFlow.css:32`). It is also the
only face in the bundle with an **optical size axis** (opsz 9..144): at low opsz
the design opens its apertures, drops its stroke contrast and grows its
x-height — the difference between a face that has been shrunk and a face drawn to
be small. `--wb-serif` is untouched and still means display; the new `--wb-read`
token means reading, and is applied to reading matter only (nine rules), never to
the register (mono by design) or to titles (display by design).

## R3 — both halves, and the first one is not the same bug as M0a

**(a) The grip M0a added is parked below the fold.** M0a fixed a real defect
(`.vr-dh-line` was 1px wide by zero pixels tall) and put the new grip at `top:50%`
**of the handle**. On the flat wing the handle is as tall as the document.
Measured, /wal at 1456×900, Carsie Blanton, About the Artist:

```
.vr-dh              10 × 2864px
the grip (::after)  top: 1432px within it  ->  viewport y = 1782
window height                                              811
```

**971px below the fold.** What a visitor at the top of the card can see of the
resize control is `.vr-dh-line`: 1px wide, `#9b978d` on `#d9d5ca` = **1.99:1**.
M0a measured that number itself and quieted the line deliberately *"so the grip
is the thing that reads, not the line"* — correct reasoning that silently depends
on the grip being on screen. Mike's report is accurate for the second time and it
is a different bug.

Fixed: the grip becomes **sticky**, offset to the middle of the viewport, so it
rides down the page with the reader and is reachable at every scroll position of
a document of any length. Sticky clamps to its parent, so on a short card (the
house page, 587px) it sits exactly where M0a put it. No DOM change, still
`pointer-events:none`, drag still owned by `.vr-dh` — M0a's stated invariant
holds by construction.

Both drags were re-verified alive by synthetic pointer events before and after:
split 432→615, carousel 160→240.

**(b) The contents column was 95.4% empty paper.** Measured, same page:

```
.ex-left          433 × 2864px
its only content  .tl-tracks — 133px
```

The 133px sat pinned at the top and left the screen the moment a reader scrolled
to read the card — 2.8 screens of scrolling on this page — and came back only by
scrolling all the way home. "For no benefit" is exactly right: nothing was gained
by the column being 2864px tall. It was tall because W7 made the flat wing's grid
row the document's height and `.ex-left` stretched into it by default, which is a
consequence nobody chose.

Fixed: `align-self:start` stops the stretch, `position:sticky` under the fixed
title bar keeps the head reachable, and `max-height` + `overflow-y:auto` is the
**bound** — load-bearing rather than defensive, because a wing with twenty rows
must not become a sticky column taller than the window. Stands down below 720px,
which is the frame's own one-column threshold, read off that rule rather than
picked.

## R4 — aligned, and it is not close

**Why they did not line up.** Every row was its own grid
(`.vp-tomb-row{display:grid}` with `minmax(88px,auto)`), so the key column sized
itself to that row's key and nothing else. Measured on the house card, before:
the value column starts at **x = 597, 605 and 561** on three consecutive rows.
On Carsie's seven-row card, five different x positions. After: **665, seven
times.**

**Judged at the real measure, as asked. Aligned wins**, and the reason is the
failure mode of the alternative rather than a preference: a ragged key column
puts the eye's return point in a different place on every line, so scanning the
values — which is the only thing anyone does with a register — becomes seven
separate searches instead of one downward glance. Nothing about the ragged
version was doing work that the aligned version loses. No second render was
needed to settle it; the before frame in the deliverable is the ragged version if
Mike wants to flip.

Built with `subgrid` (the dl owns the tracks, rows opt in), which also survives
`data-stage-split` cloning a row into its own container. `max-content` means the
column is as wide as the longest key and no wider, at every card, with no number
typed anywhere. Row padding 5px → 8px: the register was the densest texture on a
page whose complaint was that everything had the same texture. Stacks below
560px, where an unbounded key track would leave the value a two-word ribbon.

## R5a — "WELCOME", and why not the longer one

Mike offered "Welcome" or "Welcome to the Listening Room". **The room already has
a name and it is printed twice on this page** — the title bar says WORTH A LISTEN
and the card's own subtitle says WORTH A LISTEN directly under the heading. "The
Listening Room" would be a **third name for one room**, introduced at the door,
in the sentence whose whole job is to stop a stranger being confused. A greeting
does not need to re-name the building it is standing in.

It also fixes what the old title got wrong: "What this room is" is a heading on a
**definition** — a visitor who has just walked in is handed a specification.
"Welcome" is addressed to them.

**The three masters, one path, no announced levels.** The doctrine forbids
announcing the tiers, so the page cannot say "in brief" and "in detail" — it has
to be one descent each reader leaves at their own depth. The face's existing
blocks already are that descent and nobody had used them as one:

```
blurb      the SECONDS — one sentence; a skimmer leaves knowing what it is for
label ¶1   what is here and what you can do with it
label ¶2   the standard — why these four
label ¶3   what we are not, and where every door goes
label ¶4   the WHY — how the cards were made, and what that costs us
tombstone  the checkable version, for the reader who wants to verify
```

**No collapse, and that is the ruling rather than an oversight.** The page is
~280 words. A disclosure control would hide the depth the doctrine asks for
behind a press, add a decision to a page whose job is to remove one, and save
roughly one flick of a scroll wheel. Where a collapse genuinely earns its place
in this wing is the Record on the robots side (ten long entries) — and that one
already has it.

**Every fact on it is checkable in this repository**, deliberately: four artists
and eight songs (the `ARTISTS` array and its two-songs-each shape); the four
surfaces (`tracksFor`); the doors (`doorsFor`); *"a page name and a timestamp, no
accounts, no profiles"* — the `visits` table in `src/worker.js` stores page,
referrer and a timestamp and nothing else, so the privacy line is a statement
about the code, the same way M3 wrote the booth's; the pictures and the
come-down-on-request undertaking, `docs/WAL_PHOTO_PROVENANCE-20260802.md`.

M6's quiet booth pointer **moved here**, and moving it is keeping M6 rather than
overriding it: its ruling was that the link belongs *"at the end of the paragraph
a stranger has just read about who runs this place"*, and that paragraph is now
label ¶3 on this card.

## R5b — the bill

"Its place in the museum" is killed. The page proved Mike right by having nothing
to do: one paragraph of the museum explaining its own filing system to a visitor
who came to hear music. A room's place in a building is an architect's fact.

What replaces it is the **poster for the show**: the standard across the top, a
2×2 block of acts each carrying the artist's own picture in colour, their name at
poster scale, one line of what they are and one sentence of why they are here,
and the small print underneath.

**A poster's names are doors.** Each act presses through to that artist's room
(`selectAlbum` on the album it names) — the one thing a printed bill cannot be,
and the reason this page earns its place in a room rather than being an image of
one. An act whose id names nobody renders as type and cannot dead-end.

**Two-up explicitly, and P10 already paid for this lesson in this wing.** The
first cut used `auto-fit/minmax(17rem,1fr)` and dealt **four across** at 1231px:
panels 230px wide, every name broken over two lines ("Carsie / Blanton"), the
acts set smaller than the paragraph above them. P10's note on the doors says the
same thing about the same mechanism. A poster's running order is a decision, and
a decision does not change because a window did.

**In full colours, and the colours are theirs.** The panels are the artists' own
covers at full strength (W8 — the B&W law does not reach this wing), which is the
"WEIRD.BABY IN FULL COLORS" instruction rendered without the house inventing a
palette to compete with four photographs the artists chose of themselves. The one
house value per act (`--act`) is a design choice and is declared as one in the
data; it is not a fact about anybody.

**Not one new fact about any artist enters the building here.** Name, album id
and picture are read off `ARTISTS` by a builder that throws on an unknown id, so
the bill cannot advertise someone the room does not contain. Only the promotional
copy is authored, and every claim in it is already carried, sourced, on that
artist's own card.

A sixth ramp step (`--fs-display`, 1.56×) was added for the act names — P7's law
is *"nothing on a face may set a raw font-size again: it picks a step"*, which
means a face needing a size the ramp lacks must **extend the ramp**, not defect
from it. 1.56 keeps the ~1.18× progression exactly one step past `--fs-head`, and
it is used by `.vp-bill-name` and nothing else.

## R6 — the record board

A per-artist block between the register and the records shelf, and the position
is the argument: the register says what this artist **is**, the board says what a
third party **wrote down that they did**, the shelf says where to go and hear it.
That is the order a fan reads in.

Every row carries a KIND (chart / award / nominations / billing / sync / credit /
label / catalogue / stage) and a WHEN, because the whole use of the block is
comparison — a fan looking for chart history should not have to read a biography
to find out there is none. The kind column is `max-content` and shared across
rows, for the same reason R4 gave the register subgrid.

| artist | rows | what the board says |
|---|---|---|
| **Jesse Welles** | 7 | three US AAA chart peaks, four Grammy nominations, the Americana free-speech award, Farm Aid, the label |
| **Mikey Mike** | 5 | **the Canon sync — Mike's own named model** — plus the Rubin production, the *Unapologetic* co-production, Universal publishing, the London sell-out |
| **Carsie Blanton** | 5 | the Folk Alliance award, twelve independent records, three billings |
| **Hunter Root** | **0** | an honest empty board, and it says why |

**Nothing invented, nothing estimated.** Every row was already carried, sourced,
in `worth-a-listen.js`. Rows whose source is a readable page keep that page as a
door (Wikipedia for Jesse's charts and awards — his own `aboutNote` already
declares *"Wikipedia for the biography, discography, charts and awards"*; Faded
Glamour for all four of Mikey's; her own upload of the acceptance speech for
Carsie's award). Rows whose source is real but has no readable public page stay
**plain type** and the block's note says where they came from — P20's rule for
the register, reused: *a row whose fact has no readable public source stays plain
type rather than borrowing a link that does not prove it.*

**Dropped on purpose:** Jesse's Kimmel and Colbert appearances. Both are real and
both stay in the biography; neither carries a **date** anywhere in this
repository, and a board with a year column is not the place to estimate one.

**Two boards are empty and say so**, which is P16's ruling applied one block up
(*a missing shelf reads as an oversight; a shelf with a note on it reads as the
truth*). Carsie has no documented chart entry or certification in our sources.
Hunter Root has none of any kind — and he is the one who had to be got right,
because he is ours: the museum holds his whole catalogue and could have dressed
vault counts up as achievements. A vault count is not a chart position, and this
museum does not get to blur the two on its own artist and then claim the standard
on everyone else's. His board says exactly that.

**Nothing was duplicated.** Three blocks moved rather than being copied:
Jesse's "On the charts" sidebox is **retired** (chart history is not an aside on
a card about a charting artist; it was in a box beside a warning about SEO
domains); Carsie's "On stage" sidebox loses its three billings and keeps the
band; Mikey's "September 2019" sidebox loses the sell-out and keeps the week.

### The weekly-refresh doctrine's candidates — what a future automation pass could refresh

Named here because the brief asked for it, and because nothing below is on the
record board on purpose:

1. **`feed[].v` — 37 baked view counts** across the four artists (Carsie 11,
   Jesse 11, Hunter 8, Mikey 7), stamped *"read 2 August 2026"*. These are the
   pure stale-by-next-week class. The face already carries its snapshot date,
   which is the honest holding position; a weekly job reading each channel feed
   would keep both the counts and the **upload list** current, and the upload
   list is the half that actually rots — a "what they are up to" wall that has
   not moved in three months is worse than a stale number.
2. **One tombstone row**: Jesse's "There's A Hole" carries
   *"Reach — 205,991 views as of 2 August 2026"* on the song card. Same class,
   and its own label already admits it: *"the count is a snapshot and carries its
   date, because a number without a date is a claim that rots."*
3. **Chart positions are NOT in this class and should not be automated into
   moving numbers.** A chart PEAK is durable — "no. 2 in 2025" is true forever.
   A current position is a live count wearing a chart's clothes. If a refresh job
   is ever pointed at charts, it should add new peaks and never rewrite old ones.

---

## Open for Mike

1. **The V2 lift is on `/wal` only.** `/robots` is a paper wing and shares none
   of the ramp — verified live, not assumed. If he wants the warm-charcoal ground
   anywhere else, that is a new ruling, not an oversight in this one.
2. **The reading face is scoped to the exhibit faces** (`/wal` and `/robots` —
   the two flat document wings). The Information Booth, the lobby and the gift
   shops still set DM Serif Display for their own reading matter. Whether R2
   should sweep the building is a UX call and I did not take it.
3. **R0's price, small but real.** The lifted ground is one stop closer to the
   collage tiles and the quote cards, which are warm paper at `#f3efe6`. They
   still read as lit objects on a dark stage, but the gap between card and stage
   is narrower than it was. Worth a flip on his own screen.
4. **The four poster accents** (`--act`: pink, green, amber, bone) are a house
   design choice, declared as one. They are the one thing on the bill that is not
   read off the artists' own material, and they are the easiest thing to change.
5. **Two record boards are empty.** That is the honest answer from our sources
   and it is written to be read as one — but if he holds a documented chart entry,
   certification or festival billing for Carsie or for Hunter Root that this
   repository does not, those boards are the place for it.
6. **`--fs-display` exists now** (a sixth ramp step, 1.56×). Used by the poster
   only. If anything else wants poster scale later, it picks the step.
