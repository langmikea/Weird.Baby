# FRIDAY MORNING — THE WIDTH FIX, THE LOBBY, /wb, WAL, THE BOOTH, THE FOUNDATION

2026-08-14 · WRITE · gates green.

Source cited by every `MIKE` row this round adds to `provenance/register.json`.
§0 is his packet in full.

---

## §0 — THE INSTRUCTION, VERBATIM

> **PACKET — Friday morning**
>
> One fix first, and it's the big one. The right-hand block, `/wb` not
> scrolling, and the splitter doing nothing are one fault in the shared exhibit
> component — the panel takes its width once at mount while the column
> recomputes. Same shape as yesterday's height fix, other axis. Verify by
> dragging the splitter and watching the viewer reflow, on `/wb` and on at least
> two WAL artists.
>
> **Lobby**
>
> * Guest book numbers to two digits, slid left into the whitespace.
> * On resize, the date collapses before the note. The note is the content.
> * Name column sized to the longest contiguous run of letters, not the longest
>   full name, then wrap. Mike's solution, and it makes wrapping automatic.
>
> **/wb**
>
> * Opens on The Best of Weird.Baby Vol. 1, not About the Artist.
> * About the Artist: track 1 → `About the Artist`, track 2 → `FAQ`.
> * Track 1 copy as supplied, placeholder — Mike replaces before launch, track
>   it.
> * FAQ from the standard template, seeded with Who is Weird.Baby? and How to
>   contact?
> * Remove the light square right of the viewer (covered by the width fix —
>   verify, don't patch separately).
>
> **WAL**
>
> * Hunter Root moves to the end of the carousel.
> * The `▾` after track names: hidden unless a track has more than one version.
>   Keep the mechanism.
>
> **Museum FAQ**
>
> * Delete "The museum owns nothing and takes nothing."
> * Delete the no-ads line and the separator.
> * Title stays, dressed down — less bold, less large, sitting with the rest of
>   the museum.
>
> **Foundation**
>
> * Outbound link to coalitionforthehomeless.org/donate.
>
> Backlog, not now: the picture-in-picture scroller (full spec captured), Gmail
> management, Coalition co-branding and tally.

---

## §1 — THE WIDTH FAULT · HE DIAGNOSED IT AND HE WAS RIGHT

**ONE LINE.** A1 (yesterday) made the SLOT take its height from the column. The
PICTURE inside it still took its width from its own height —
`height:100%; width:auto; aspect-ratio:16/9` — so the column's width reached
the picture only as a clip and never as a size.

**ALL THREE SYMPTOMS MEASURED BEFORE ANYTHING CHANGED**, `/wb`, album 2, one
song selected, 1706px:

| | |
|---|---|
| the right-hand block | column 1198 wide, picture 751 wide — **446px of bare cream** |
| the splitter doing nothing | column 1198 → 1081 → 882, picture **751×423 at every step**, changing only at 682 when `max-width:100%` finally clipped it |
| `/wb` not scrolling | `scrollHeight` **810 against a viewport of 810**, at every one of those widths |

A picture whose height is capped by the column it sits in can never make the
room taller than the window, so there is never anything to scroll. The lever
moved the room and did not move the thing in it.

**THE FIX.** Width drives, height follows: the picture takes the column's full
width and resolves its height at 16:9; the slot takes the picture's height; the
grid row takes the slot's. `.vp-inner` is in FLOW rather than absolutely
positioned, which is the load-bearing half — an absolutely positioned inner
gives its parent no height, so the slot could only ever be sized from outside,
which is this entire family of bugs.

**VERIFIED HIS WAY — dragged the splitter and watched the viewer reflow:**

```
/wb                   1198 -> 1081 -> 882 -> 682 -> 1381
/wal Carsie Blanton   1059 -> 869 -> 516
/wal Hunter Root      1045 -> 869 -> 516
```

Picture **16:9 to three decimals at every width on all three**, right-hand gap
**1px** (the border) at every width, and the page scrolls in proportion —
`/wb` 1060/810 open, 810/810 at the narrowest column.

**`--fit-area-max` IS DELETED, NOT LEFT WRITTEN-AND-UNREAD.** A1 left it being
written "in case", which is how a cap that governs nothing survives to be
restored by a session that finds it and assumes it matters. All four write sites
in `Exhibit.jsx` and both `sessionStorage` keys go with it.

**V2a FOUND THIS EXACT FAULT ON 2026-08-03 AND PATCHED THE LEVER.** Its note
reads: *"drag the split 200px wider and the slot grows to 1430.9 while the
picture stays 638.6 x 359.2 TO THE PIXEL."* That is the splitter symptom Mike
reported eleven days later, in the same words, having found it himself. What
V2a did was make the cap follow the hand — recompute `--fit-area-max` on every
pointer move — which worked and left the picture height-driven on every path the
hand had not taken: arrival, window resize, album change. **The right-hand block
and the un-scrollable page lived in that gap for eleven days.**

**THE LIGHT SQUARE IS GONE AS HE PREDICTED IT WOULD BE**, and it was not patched
separately: the right-hand gap is 1px at every width tested, on all three wings.

**D1's "THE SLACK ON THE RIGHT IS DELIBERATE" IS SUPERSEDED**, and by him. That
note (2026-08-06) argued air down the outer edge is what makes a column a
column; he has now named that air as the defect, by its symptom, twice.

## §2 — THE LOBBY

**TWO DIGITS, SLID LEFT.** The number is `01`, not `1` — padded in `GuestRow`,
because it is the STRING that is two digits. The sliding-left half is the row's
own left padding: **12px → 4px**, so the numbers sit against the card edge and
the 8px goes to the note rather than to a margin. Past 99 the string is three
characters in a 2ch track and borrows one character of the 12px gap beside it;
measured, invisible, and the alternative is a third column of air on every row
for two years.

**THE DATE COLLAPSES BEFORE THE NOTE, IN A BAND WITH BOTH ENDS REASONED.** The
note's track is `minmax(0,1fr)` and the date's is `auto` + `nowrap`, so the note
paid for the date the whole way down. Measured, note width and Courier
characters per line:

```
1400px  402px ~58 chars      860px  132px ~19 chars
1100px  252px ~36 chars      800px  102px ~14 chars
 950px  177px ~25 chars
```

A fourteen-character measure is a column of syllables. The date goes between
**681 and 1000px** — below 681 the frame is already stacked and the note has the
full width, so the date costs it nothing and comes back; above 1000 the note
still clears a line with the date present. Measured after: 950px goes 25 → 36
characters, 860px goes 19 → 30, and at 680px the note is 87 characters on its
own line with the date back.

**AND THE NAME COLUMN IS HIS SOLUTION, WHICH IS BETTER THAN THE ONE IT
REPLACES.** Yesterday's version read the widest WHOLE name and spent it on every
row. His rule spends only what cannot be avoided.

`min-content` **is that rule, computed by the thing that actually breaks lines.**
Releasing the column to `min-content` and reading a name back gives the width of
its longest unbreakable run, because that is what min-content means. Tokenising
the string with a regex would be a second opinion about where text may break —
and it would be wrong about `Weird.Baby`, about hyphens, and about every
non-Latin script the book will eventually meet.

**MEASURED, with the live book's three long names standing in at 1400px:**

```
--gb-name = 94px            (yesterday's whole-name reading: 131px)
Larry Leibensperger   94px wide, 2 lines
Papa Weird.Baby       94px wide, 2 lines
James E               94px wide, 1 line
every note starts at the same x; every row 38px
```

**37px a row, given back to the note**, and the wrapping is automatic exactly as
he said. It only works because `white-space:nowrap` came off `.wb-entry-name` in
the same change — with nowrap on, every name is one unbreakable run and
`min-content` reads the whole name again. **The two halves are one change.**

## §3 — `/wb`

| | |
|---|---|
| opens on | **The Best of Weird.Baby Vol. 1** (`defaultActiveIndex: 1`) |
| About the Artist | 01 **About the Artist** · 02 **FAQ** · 03 About this record |
| the six songs | 01–06, chip **FIRST PASS**, all six carets hidden |
| the light square | gone with the width fix, right-hand gap 1px |

**THE LANDING AND THE ORDER WERE KEPT APART, DELIBERATELY.** P9 (2026-08-05) is
also his: *"add an ABOUT THE ARTIST album, FIRST in the wing."* Both hold — About
the Artist is still the first cover in the rack, and the room opens on the second
one. Reordering the spine would have satisfied this instruction and broken that
one, silently, with no note anywhere saying a ruling had been reversed.

**`About this record` IS KEPT AT POSITION 3.** He named this album's tracks as
"track 1 → About the Artist, track 2 → FAQ" and did not mention it — and he moved
it onto this album YESTERDAY, in writing. His instruction is satisfied exactly,
and nothing he placed has been deleted on an inference. One word removes it.

**THE FAQ IS FROM THE STANDARD TEMPLATE — `faqFace()`, the same factory /wal,
/foundation, /robots and the booth all draw through.** Both his seed questions
are in the data. One draws:

- **"Who is Weird.Baby?"** — answered with `KEEPER`, the house's own standing
  sentence, imported rather than retyped. W1 (2026-08-06) struck KEEPER from the
  ARTIST CARD one row up, on the ground that it is "an answer about the HOUSE
  printed under an ARTIST's name". A question that ASKS who Weird.Baby is has
  that answer as its subject rather than as a stray — and his own instruction
  yesterday, *"Papa Weird.Baby is him, not a persona"*, is the ruling that the
  house and the artist are one person here.
- **"How to contact?"** — a `[PAPA]`, and therefore drawing nothing at all in
  either stage. See below; open row **W-b**.

**A `[PAPA]` NOTE MUST BE ONE SENTENCE, AND THIS ROUND PROVED IT ON THE GLASS.**
`visitorProse` splits a string into SENTENCES and drops only the ones carrying
the mark. Written as two sentences, this note published its second one —
*"This answer needs an address from you before it can say anything."* — to
visitors. **Caught by looking at the page. No gate saw it**, because the
provenance sweep does not read markers and the launch guard reads the source.
Rewritten as one sentence, the entry drops whole and the page is clean.

**AND THE `[PAPA]` STRING IS DECLARED IN THE REGISTER RATHER THAN EXEMPTED FROM
IT**, for that exact reason: a marker string can still leak, and did.

## §4 — WAL

**Hunter Root is last**: `Worth A Listen · Carsie Blanton · Jesse Welles ·
Mikey Mike · Hunter Root`. Done at the point the rack is BUILT, not by moving the
artist inside `ARTISTS` — that array is ~900 lines of authored content per
artist, and cutting one out of the middle is a diff nobody can read over data
where a dropped brace is a silent content loss.

**THE `▾` IS HIDDEN ON A SINGLE-VERSION ROW**, which reverses a 2026-07-06 note
that is also his: *"it ALWAYS drops, even with one option — a type that sometimes
does nothing is disorienting."* What that reading missed is the other half of
the same complaint: an arrow that never disappears promises a choice on every
row, and on `/wb` every one of the six songs has exactly one version, so the
promise is false six times a page. **"Keep the mechanism" is doing work** — the
`<select>` stays in the DOM on every row, so a track that gains a second version
gets its arrow back with no code change. What is hidden is the affordance, not
the machine. Measured on /wb: six rows, six carets hidden.

## §5 — THE MUSEUM FAQ (`/booth`)

Both lines struck and named once, here: `No tickets, no tiers, no ads.` and
`The museum owns nothing and takes nothing.`, with the 52px rule under them.
**Nothing true is lost from the building** — both statements are answered at
length by questions on the same page — so what goes is a summary printed above
the thing it summarises.

The credo is dressed down on two dials and no more: **weight 600 → 500**, and
the ramp **1.5–2.05rem → 1.15–1.5rem**. Measured after: **24px at 1400px**,
where it was ~32.8px. It now sits just above the bar's own room name (1.2rem)
instead of nearly twice it.

**THE FACE IS NOT CHANGED.** This is still the only thing on the page in the
brand face, by its own note's account; that is a third dial and he named two.

## §6 — THE FOUNDATION

The donate door is on **`YOUR DONATIONS`** and not on `Can I donate?`, which is
the answer that looks like its home. That question is about giving to
WEIRD.BABY and its answer is a refusal — *"if your help would arrive as money in
Weird.Baby's hands to spend, it is not help we can take, and we will gladly show
you the door that is."* **This IS that door**, and it belongs on the sentence
that says where the money goes.

**IT DOES NOT CONTRADICT THE ROOM.** Nothing here collects anything: the address
is the Coalition's own, the visitor gives to them directly, and Weird.Baby is not
in the transaction at any point.

**F6's RULE IS HONOURED RATHER THAN BROKEN.** F6 says *"a door with no address
supplied is not made into an `<a>`"* — a rule about the ABSENT case, which has
never had a positive case to answer because until today no door in this building
had a real address. A door WITH an address takes no state stamp: `state()`
resolves through the reveal ledger and prints NOT BUILT for anything that is not
LIVE, so a real anchor routed through it would sit under the words NOT BUILT
while working perfectly. **Having an address IS the state.** It leaves in a new
tab with `noopener noreferrer`.

**THE ADDRESS RESOLVES**, checked 2026-08-14: it redirects to
`coalitionforthehomeless.givingpage.org/donate`, titled "Coalition for the
Homeless Donation Page". The redirect target is deliberately not used — their
vanity address is the durable one and the hop is theirs to change.

---

## GATES

| gate | result |
|---|---|
| `lint` | **9 errors / 8 warnings — baseline** |
| `provenance:gate` | PASS — 7 rows added, 0 lost, 0 changed |
| `docs:numbers:gate` | PASS |
| `reveal:build` | ran; `ledger.json` byte-identical |
| `reveal:check` · `parity:gate` · `instory:gate` | PASS |
| `approval:proof` | PROVED |
| `assets:orphans` | 8 judged / 5 unjudged — unchanged |
| `build` · `build:launch` | green |

**Launch-bundle checks:** the two struck booth lines are absent; the `[PAPA]`
note is absent; the donate address and `Who is Weird.Baby?` are present.

## WHAT NEEDS MIKE

1. **`/wb`'s About the Artist copy is yours to write** — open row `W-a`, at your
   own instruction.
2. **`How to contact?` needs an address**, or your word that there will not be
   one — open row `W-b`. It collides with your 2026-08-11 ruling that struck the
   house address sitewide, and `house-copy.js` records the consequence in its own
   words: *"THE MUSEUM NOW PUBLISHES NO WAY TO REACH IT."*
3. **`About this record` is still on the About the Artist album, at position 3.**
   You named two positions and it was not one of them; you placed it there
   yesterday. One word removes it.
4. **The booth's credo is still in the brand face** — the only thing on that page
   that is. You named two dials and both are turned.

## BACKLOG, CAPTURED AND NOT BUILT

The picture-in-picture scroller, Gmail management, and Coalition co-branding and
tally. Named here so they are on the record; no row was opened and no code was
written for any of them.
