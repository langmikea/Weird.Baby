# THE COMBINED BRIEF — round log, 2026-08-06

**Twenty-two instructions across four groups (D1–D3 · A1–A3 · L1 · F1–F8 ·
W1–W2 · V1–V2 · C1–C4). Twenty-one built, one answered as the proposal it asked
for, and one struck string does not exist in this repository.**

Gates: lint **11 errors / 9 warnings = baseline, zero new** · build green ·
`provenance:gate` **PASS (0 undeclared · 0 stale · 0 invention)** ·
`reveal:check` **PASS** · `parity:gate` **PASS, 4 shared · 0 divergences** ·
`assets:scan` re-run, `assets:orphans` **0** · `surfacing --log` written · lap
**on the built bundle under `wrangler dev`**, eleven routes, desktop only —
**the 390px half did not run and M97 stands** (see §12).

---

## 1. THE HEADLINE — A1 DELETED FORTY DECLARATIONS AND CHANGED NOTHING A VISITOR READS

Mike's A1 came with its own diagnosis and the diagnosis is the finding:

> THE BLACK POSTER BORDER DIES, everywhere it appears. It came from the "paper
> card on a dark stage" ruling, which answered a DIFFERENT problem — text
> unreadable on black — and WAL kept the scaffolding after the cause was gone.
> Nobody ever decided WAL should look unlike Robots. Obvious enough to stand
> out, with no reasonable guess as to why.

**THE FILE RECORDS THE ARC HE IS DESCRIBING, AND IT ATE ITS OWN PREMISE.** W6
dropped the house lights so the imagery could be the brightest thing in the
room. P9 and R0 then spent two rounds moving that dark ground a stop at a time
because TEXT ON IT GLARED — each one measuring contrast ratios, each one
correct. V1 finally answered the glare properly by taking the text off the dark
entirely, onto a paper card. **At that moment the dark ground had nothing left
to do except be the border around the card**, and four sets of rules survived
their own cause:

| what survived | what it was for |
|---|---|
| `[data-exhibit="wal"] .ex-right` — a 12-token dark re-pin | giving text a ground to stand on |
| `.vp-inner`'s 1px ring (M0b, sized at 2.82:1 against charcoal) | giving the picture an edge on a ground that swallowed it |
| the card's 18px mat, paper aliases, border, shadow, and a 720px stand-down | putting the text back on paper |
| twelve colour literals re-pinned for the card | values chosen while the ground was charcoal |

All of it is deleted. **What replaces it is three declarations that /robots has
had since L5**, re-scoped from a wing to the reason for the rule:

```css
.ex-root[data-flat="1"] .vp-area{background:#e7e3d8;border-color:transparent}
.ex-root[data-flat="1"] .vp-face:not(.vp-face-portal):not(.vp-face-panel){background:#e7e3d8;padding:18px}
.ex-root[data-flat="1"] …>.vp-face-body{background:var(--wb-ink-card);border:1px solid var(--wb-border);box-shadow:…}
```

`data-flat="1"` is exactly the set of wings whose viewer is a DOCUMENT —
/robots, /wal, /wb and /foundation all declare `faceFlow:"flat"` — which is A2
stated as a selector. **`[data-exhibit="wal"]` now appears FOUR times in
`Exhibit.css` and two of them are comments.** The two live ones are
`filter:none` on a plate and on a poster, which is A2's one permitted
difference: the artists bring the colour.

**FIVE FOLDED VALUES ALSO FIX /robots, WHICH V1's OWN NOTE PREDICTED AND COULD
NOT REACH.** That note said, of six colour literals: *"The same literals sit
under /robots' sheet at the same numbers — a real, pre-existing condition, and
not this round's to change… named in the round report rather than fixed by
reach."* Under A2 it IS this round's to change, because a rule scoped to a wing
was the only reason there were two of them. `.vp-face-papa`'s near-black dashed
rule, `.vp-presets-note`'s `#7d7869`, `.vp-trail-fn`'s `#c8a45c` (2.22:1 on the
sheet — decoration, not text), the quote card's and collage tile's 45%-black
drop shadows, and three white-at-3% washes that are invisible on paper: all
seven took the paper value in their BASE rule rather than being overridden into
it.

---

## 2. D1–D3 — THE ROOM OPENS ON ONE SCREEN, AND THE MEASUREMENT IS THE ANSWER

**BEFORE, MEASURED ON /wb AT 1706×810:** the carousel opened at 300px, the
contents column took **832px to hold six song titles**, the viewer took the same
832 and ran **739px tall**, and the document was **1229px inside an 810px
window**. Every wing except /wal opened this way, because `fitOnEntry` was
declared by /wal and nothing else.

**AFTER, same window, same page, cleared session:** carousel **200**, contents
column **521**, picture **559×314** with its left edge on the divider,
`document.scrollHeight` **810 = the window**. Everything fits.

**THE THREE CHANGES, AND ONE OF THEM REVERSES THIS FILE'S OWN RULING IN THE
OPEN.** `Exhibit.jsx`'s fit block said, in so many words: *"The split is not a
fit lever; it stays where the visitor (or the wing default) put it"* — written
after an earlier draft narrowed the viewer column and *"dutifully produced a
62%-wide tracklist that was mostly empty paper"*. **That finding stands and it
is the finding, not the rule.** What was wrong was the DIRECTION: solving for
the viewer's height by taking width off the viewer. D1 turns the same lever the
other way and anchors it to something real — the tracklist's own longest row —
so the failure case cannot recur, because the split is no longer solving for
height at all.

- **D2/D1 — the contents column is MEASURED.** The grid is asked for
  `max-content` for one synchronous moment inside a layout effect, the column is
  read back, and the template is restored before anything paints. A tracklist
  row is a flex line inside a `minmax(0, Nfr)` track, so its `offsetWidth` is
  the width it was GRANTED and tells you nothing about the width it wants; this
  is the only honest way to ask. Clamped to 22…46 (`TL_MAX` is D2 as a number:
  whatever the measurement says, it may not take half).
- **D1 — the viewer's fixed edge is justified against it.** `.vp-inner` was
  `left:50%; translateX(-50%)` — centred in the slack, which was right while the
  slack was black bars on a dark stage and spends the slack TWICE on a mat. It
  is `left:0` now. The slack lands on the outer edge, which is R4's own ruling
  on the Record's index one round ago.
- **D3 — `CF_DEF = 200`**, and it is the default AND the fit's ceiling. Lever 1
  used to run up to `CF_MAX` whenever a window had height to spare.

**TWO THINGS THE MEASUREMENT ITSELF CAUGHT, both invisible before this round:**

1. **A DOCUMENT WAS BEING FITTED LIKE A PICTURE.** On a wing landing on a face
   the viewer is STOWED — there is no 16:9 frame on screen — and the fit was
   computing one anyway, finding it did not fit, and pinning the carousel to its
   floor. Harmless while the default was 300 and the fit could raise it; with
   D3's lower default it would have pinned four wings out of five to `CF_MIN`
   forever, for a picture nobody is looking at.
2. **THE FIRST CUT OF D2 CLIPPED ITS OWN TITLES.** Only the ACTIVE album's rows
   are in the document, so a column measured from /wb's one-row "About the
   artist" came out at 366px and "Weird Baby Blues" arrived as *"Weird Baby …"* —
   R3's defect one room over. **An arithmetic fix was built first and is not
   exact:** measuring the longest TITLE across the spine in the live font misses
   the DESCRIPTOR, and a face track carries none, so a 483px row was estimated at
   343. It was replaced with a re-measure on every album change that **only ever
   grows**, and a drag ends it for the session. Growing-only is what makes
   re-measuring safe: no oscillation, and nothing a reader has read moves
   backwards.

---

## 3. A3 — THE COVERS, AND THE CLAUSE THAT IS THE DIAGNOSIS

> THE ROBOTS GRAY ALBUM ART IS THE STANDARD — its size, spacing, **and the fact
> that it does NOT fade into the background at the carousel's edges.**

The third clause is exact and it is checkable. The covers it replaces are
TYPOGRAPHIC on the museum's paper — and the museum's paper is `--wb-bg`, which is
**also the carousel's own ground**. A cover whose field is the page's field has
nothing to show but its keyline, so at ring 2 and beyond, tilted and hazed, there
is no card there: on /foundation, FAQ and CONTRIBUTE read as outlines floating on
the page. The robots cover does not do that **because THE MARK fills it with
ink**. That is the whole difference, and it is why the answer is the mark rather
than a darker paper — darkening the ground fixes the fade and loses the theme.

**IT REVERSES `make_foundation_covers.py`'s ONE DEPARTURE, IN THE OPEN.** That
tool deliberately put no mark on its three covers, with a stated reason: *"Three
albums in one deck each carrying the same photograph of the same baby is the
defect M30 was written about … multiplied by three and sitting side by side."*
The reasoning was sound and the result is the thing Mike is looking at. His
ruling settles it the other way — **a house sleeve is supposed to repeat; that is
what makes it a house sleeve.**

**`tools/make_house_covers.py` PROVES IT IS THE SAME GEOMETRY RATHER THAN
CLAIMING IT.** `--verify` re-renders the ROBOTS cover through the new tool's own
layout and compares it with the shipped `wbr-cover-logo.png` **pixel for pixel**.
It failed on the first run — in the strapline row only, y 1046–1069 — because
`make_foundation_covers.py` had capped the strapline at 0.66S for its own
25-glyph line and in doing so silently tightened the 22-glyph robots line it had
copied. `STRAP_MEASURE = 0.80S` binds on neither. **It passes now, exactly.**

Six covers built: `/foundation` ×3 (on F4's new names), `/wb` ×2, and `/wal`'s
house card — which was **an inline SVG data URI** and is now a real file.
`faq-cover.png` is deleted with the album F4 dissolves; `vol1_cover_v1.png` (the
one object in the museum using red display type) and `vol1_cover_v0.png` are
deleted rather than kept beside their replacement.

**A long album name WRAPS, and the extra line is taken out of THE MARK** rather
than out of the rule's drop — so the rule, the strapline and the border stay
where the template puts them, which is the part a visitor reads as "the same
cover". The house's own /wal card already wrapped its name across three lines, so
wrapping is the building's own handling of a long name.

---

## 4. F1–F8 — THE FOUNDATION, RESTRUCTURED

**F4's three albums, his names, his order**, replacing D7's port — which made
three albums out of the three OBJECTS the sheet happened to carry and put the
account card and the invoice together because they were both about money. That
is a filing system. His is a reading order: what this is, then what it costs and
where it goes, then how to help.

**F7 — WHERE THE THREE MECHANISMS LANDED, which is what he asked to be told:**

| mechanism | landed on |
|---|---|
| the **$0.00 account card** | The Foundation · **Executive summary** |
| the **register**, LIVE / NOT BUILT reading live off `reveal/ledger.json` | The Ledger · **Where, why, etc.** |
| the **ledger object** (the zero-total invoice) | The Ledger · **Money in, out** |

The reveal wiring crossed untouched: flipping `channel.qr` to LIVE still changes
this wing and no other file.

**F3 — the FAQ is preserved and SPLIT, and it is one declaration.** Each question
carries an `on: "foundation" | "ledger"` placement field and both tracks are
derived from the same `FAQ` array; five questions on the wing's own album (what
it is, why, billionaires, what happens when you stop) and seven on the Ledger's
(where it goes, the lights, donating, sending a thing, the shop, the artists).
R7's accordion, `lines`, the two marked link doors and the billionaires answer's
print-nothing path are all untouched.

**F6 — Contribute is empty and honest**, and the one true sentence is declared
ONCE (`NOT_BUILT_YET`) and used three times. Three tracks saying the same thing
in three slightly different wordings is the defect Doctrine 17 exists for, on the
day it is written rather than a month later.

**F5 — THE CADENCE, PROPOSED.** His shape is annual major reviews plus frequent
one-shots, *"not everything chronologically on one page; possibly a track per
update"*. **The proposal is: not a track per update — the Record's own
machinery.** A track per update is right for the first four and wrong for the
twelfth: the tracklist is the wing's menu, and a menu that grows a row every
month stops being a menu. `entriesMode:"log"` is an INDEX of numbered entries
that stands until one is chosen, then that entry fills the frame with nothing
competing — which is "not everything chronologically on one page" exactly, with a
navigation that does not grow. An annual review and a one-shot are the same
object at two lengths. **It is built and it is empty**, and a `logEmpty` field
was added because a log face with no entries rendered NOTHING at all — a
heading, then the footer. Invisible while the only log in the museum held a
record.

**F1 — the exit.** What every other wing has in the top right is a door out; this
room had a hole, because D7 correctly hid the shop exit and put nothing in its
place. **Hiding a door and giving a room no way out are two decisions and only
one of them was made.** The exit slot is per-wing config now (`exit`), the way
`playerBar` and `shopEntryHidden` already are, so `shopEntryHidden` stands
untouched and the wing says where its own way out goes. It reads **LOBBY**.

**F2 vs F7 — ONE THING TRAVELLED THAT HIS WORDS DID NOT NAME, AND IT IS FLAGGED
RATHER THAN DONE QUIETLY.** F2 burns the old "The ledger" TRACK; F7 preserves the
ledger OBJECT. The track also carried `POSTURE` — Mike's own sentence, recorded
by P10 as the room's heart, and the thing that says WHO IS CARRYING the costs the
invoice lists at zero. **It is kept, beside the object it explains.** If he meant
it to burn with the track it is one line. **M98.**

**F8** — the TONE RULING was already at the head of this file and governs the
wing; nothing written this round asks, flatters a giver, argues the house's need,
or would read differently to a richer reader.

---

## 5. V1/V2 — THE POSTER

**V1's first strike lands.** *"Four of them. Two songs each, all playable. Every
one of them is somebody's favourite record and none of them is ours."* — the
third clause is the room's curation posture stated out loud, which W1a struck
from the label on this same face and which M52 flagged for sitting above a panel
saying the museum holds his records; the first two are a COUNT of what is on the
page, which the page itself is.

**V1's SECOND STRIKE IS NOT IN THIS REPOSITORY, AND THAT IS THE HONEST REPORT.**
*"Artists that command Weird.Baby's respect and deserve your awareness."* appears
nowhere in `src/` or `index.html` — searched for the whole sentence and for
*respect*, *deserve* and *awareness* separately, and checked the live pages of
`/wal` and `/shop`. **Nothing was struck in its place.** Either it is on a
surface Ops cannot see, or the deployed build is behind `main`. **M100.**

**V2 — the poster is TWO REGISTERS off ONE array.** R5b's 2×2 grid gave every act
the same rank at the same size, which is a CONTACT SHEET; a poster's grammar is
that the same names appear twice at two scales. So: **four across, fitted to the
viewer** (picture, name, what) and **below, each artist again, larger** — the
plate as a fixed column beside the copy, full width, one per row. Both registers
are the same door.

`why` is already the "2-3 sentences of substance from verified facts" half and
**not one word of it is new** — every clause is carried, sourced, on that
artist's own card, documented claim by claim in `worth-a-listen.js`. Writing a
third sentence to reach "2-3" would be Doctrine 12 with a word count as its
excuse. **`pick` is the second half and it is a SLOT**: marked in its only
sentence, so the scrubber empties it and the poster prints nothing where it sits
— no placeholder, no dash, no *coming*. **M104.**

**AND THE BILL'S ACTS WERE NOT BEING SCRUBBED AT ALL.** `what`, `why` and now
`pick` are all printed, so a marker written into one would have printed — the
practical trap Doctrine 11 names by hand and the exact defect M53 paid for on
this same face. `scrubFace` learns the bill. **The act is not dropped when its
prose goes**: its name, picture and door come off `ARTISTS`, and a poster that
lost an act because nobody had written a sentence yet would advertise a show the
room is not putting on.

**One measured correction inside V2.** The first cut let the plate take its own
aspect in the column: Mikey Mike got a 275px plate against Hunter Root's 155, so
four blocks of the same object rendered at four heights. Fixed at 5/4.

---

## 6. C1–C4 — THE ARTIST PAGES

**C1 — "What are they up to?", and the sentence case with it.** The second half
is the structural one: an artist album's category rows read *About the Songs* /
*About the Artist* / *What they are up to* — two Title Case and one sentence case,
in a column three rows deep where a visitor sees all three at once. The house's
own rooms are sentence case already (`/wal` "About our current artists", "The
deal"; `/foundation` "The account", "The ledger"), so sentence case is the
convention and Title Case was the drift. **`About the Artist` → `About the
artist` on all four WAL artists and on /wb.** `The Record` and `FAQ` are left
alone: one is a masthead and one is an initialism, and neither is a descriptive
category label.

**C2 — reduced to the wall, and the question answered.** The *"Showing N of the
most recent"* row went: the page IS that count. **The SOURCE row stayed** — a
dated snapshot of somebody else's feed is provenance, which Doctrine 11 names
explicitly as passing, and it is the only line stopping an undated wall reading
as live. **The tour door stayed**, and it is the answer to his question:

> **DO WE HAVE TILES BESIDES YOUTUBE? No.** Every tile in every wall on every
> artist page in this wing is an `i.ytimg.com` thumbnail opening a
> `youtube.com/watch` page — 8 tiles for Carsie, 8 for Hunter Root, 11 for Jesse,
> 7 for Mikey Mike. The tour door is the only thing on those pages that is not
> YouTube. The ad-free research
> (`docs/AD_FREE_PLAYBACK_RESEARCH-20260806.md`) is what changes that answer, and
> it changes it for the SONGS before it changes it for the walls.

**C3 — PRESETS: proposed, and the material does not support them today.** His
word is *"Propose"*, so here is the count, from the feeds themselves:

| artist | "official" in the title | "live" in the title | an award | total tiles |
|---|---|---|---|---|
| Carsie Blanton | 5 | 1 | 1 (FAI 2026 Artist of the Year speech) | 11 |
| Jesse Welles | 0 | 1 (Bonnaroo Campground) | 0 | 11 |
| Hunter Root | 1 | 1 (live in studio) | 0 | 8 |
| Mikey Mike | 2 | 0 | 0 | 7 |

**The whole wing holds ONE award video and four live ones across four artists.**
A preset strip built on that is a control with one useful button, and "notable
moments" is a judgement nobody has made — deriving it from title keywords would
be invention wearing a classifier. **The proposal, for when the feeds grow:**
groupings are declared per artist beside the wall (N9's `face.presets`), every
button carries its count, coarse last, and a wall with one grouping draws no
strip. Nothing is built. **M101.**

**C4 — "About the Songs" is burned down.** He is describing the face's shape
rather than its writing: one numbered paragraph per song under the song's own
YouTube poster, beneath a tracklist in which those same two songs are the first
two rows, beside a card that says what the artist does. **Two songs is not enough
material for a page about the songs; it is a second listing of the tracklist with
a sentence attached.** The builder is deleted rather than left uncalled.
**WHAT IT COSTS, NAMED:** each song's `card.label` is now rendered by nothing.
The data stays — those are written paragraphs and striking them is Mike's call,
not a consequence of deleting a container — and the `card.tombstone`s stay for
the reason the file already gives. **M102.**

---

## 7. W1/W2 — WEIRD.BABY MUSIC

**W1 — burned down and rebuilt as categories.** What was there, item by item,
because three of the four were put there deliberately and two are good writing:

- the **RELEASE / TRACKS / PORTRAIT** register is the "record file that does not
  belong here" exactly — three lines of accession data telling a visitor the
  number of tracks on an album whose tracks are listed six inches to the left;
- **"Who keeps this place?"** is the booth's answer and one of the best passages
  in the building — **and it is about the HOUSE, on a card headed with an
  ARTIST's name.** It is not deleted from the museum; it is at `/booth`, and D1's
  hoist is why removing it here is one deleted import rather than a decision
  about which of two copies was real. **M107.**
- **"What the museum holds"** and the blurb survive: the only two things on the
  old card that were about this artist and true.

**THE CATEGORIES ARE THE DELIVERABLE, NOT THIS PAGE'S CONTENT** — six slots any
artist in any wing can be described by, in the order a stranger meets somebody:
where they are from · what they sound like · in their own words · start with ·
what the museum holds · what they are doing now. `face.profile` is data and the
renderer knows no category names, so a wing declaring different slots renders
without a code change. **Five of the six are marked and print nothing**, which is
the ruling working: nobody has told Ops where this artist is from or what he
sounds like. **M103.**

**They are CARDS and not rows, and that is the one thing the markup had to get
right.** `entries`/`lines` are read in order at one weight, which is exactly the
register he called useless. A wall of six categories with one filled is a wall
with one card on it, not a list with five holes.

**W2** — A3 replaced the art; chrome, spacing and type are now the shared
`[data-flat="1"]` rules from A1/A2, so /wb is conformed by construction rather
than by matching. Verified on the built bundle.

---

## 8. L1 — THE GUEST BOOK

**It is the same mechanism R3 built for the Record's index one round ago**, and
it is now the house's answer to this whole class of problem: **delete the
truncation so a too-long string cannot lie, and refuse the string at the input so
there is never a too-long one.** Take either half away and "it fits" is a promise
again.

What was here was the opposite arrangement: `white-space:nowrap` +
`text-overflow:ellipsis` + `maxLength={280}`, so a visitor could type 280
characters into a box that displays about 88 of them and nothing said so. The
`title` tooltip carrying the full note was the honest patch on a lossy row — and
the half a touch device could not use.

**THE ROW IS A TWO-LINE GRID and the note spans both lines** of the middle
column, with the name and the date holding the first line at the outer edges.
**Below 680px the note takes the whole row** on its own two lines, because at
310px of row the middle column is not a measure, it is a gap.

**THE TWO BUDGETS, measured against the NARROWEST display because that is the one
that decides:** at 390px, `.wb-right` pads to 334 and the row to 310; Courier
Prime at 0.72rem advances 6.907px, so a line holds 44 characters and the block
holds **88**. **The NAME's limit was the thing nobody had checked:** it shares
line one with the date, the longest date this formatter produces is 71px, and 60
characters of Syne at 0.78rem is roughly 420px inside a 310px row — so **32**.
Enforced in two places on purpose, `maxLength` and a `slice` in `src/worker.js`,
because an attribute is a courtesy to the browser and the database is where a row
becomes permanent.

**Verified by forcing the rule:** 88 characters and a 32-character name at a
334px box → row 74px, note 308×31 across two lines, nothing clipped. At desktop:
row 52px, note 31px, nothing clipped. **M108.**

---

## 9. THE PROVENANCE PASS, AND A DEFECT IT EXPOSED

41 new strings declared by hash from the sweep's own stub file, classed per text
— F4's structure and C1's wording as **MIKE** with his brief cited; ids, modes,
category labels, the footer and the two empty states as **HOUSE**; every `[PAPA]`
marker as MIKE with the standard source.

**31 stale rows were pruned against a copy and the gate named the breaks
exactly** (§9's own corrected procedure). Two: both were references from the tour
door's `scent`, pointing at the two rows C2 deleted from the same face. The
chain's third reference — the SOURCE tombstone row — survives and is the right
anchor, so the row was repointed onto it rather than reclassed.

**AND `provenance/assets-declare.mjs` HAD DRIFTED FROM THE FILE IT WRITES.**
Diffing the declarer's array against `assets.json` found **five rows in the JSON
that the declarer did not know about** — the Foundation's three covers (D7) and
two robots rows added by hand at P2 and P7. `--write` regenerates the whole
register from that array, **so the next `--write` would have silently deleted all
five.** Nothing runs that diff. All five are re-declared from the JSON verbatim;
the drift is now zero and the check is written down. **M99.**

`assets:scan` re-run; the two orphaned rows for the deleted Vol. 1 covers were
dropped (both `verdict=null`, nothing judged was lost) and `assets:orphans` is 0.

---

## 10. WHAT REVERSES EARLIER WORK, IN ONE PLACE

| this round | reverses |
|---|---|
| A1/A2 — the dark stage, the ring, the mat, the literals | V1 (2026-08-03) "the paper card on the dark stage", and R0/M0b with it |
| A2 — C4's plate geometry becomes the house's | C4's own scoping to `[data-exhibit="wal"]` |
| A3 — the mark goes on every house sleeve | `make_foundation_covers.py`'s stated "one departure" |
| D1 — the split IS a fit lever | F3's "the split is not a fit lever" (the finding under it stands) |
| D1 — the fit runs in every wing | `fitOnEntry` as an opt-in; the flag is deleted |
| D3 — the fit may not raise the carousel | F3's lever 1 running to `CF_MAX` |
| F4 — three albums by reading order | D7's three albums by object |
| F1 — a per-wing exit | the exit being the Gift Shop or nothing |
| W1 — the keeper's answer leaves /wb | P9's placement of it (D1's hoist stands) |
| C4 — About the Songs deleted | C1 (2026-08-02), which had trimmed rather than struck it |

---

## 11. THE REGISTER — M98 … M108

Every row is in `docs/OPEN_ACTIONS.md`. Summarised:

- **M98** F2 vs F7 — the POSTURE travelled with the ledger object; Ops read past
  the letter of "discard, do not port". One line either way.
- **M99** `assets-declare.mjs` vs `assets.json` — five rows would have been
  silently deleted; no check runs the diff.
- **M100** V1's second strike is not in this repository.
- **M101** C3's presets — the material does not support them today; the counts
  are in §6 and the scheme is proposed.
- **M102** C4's cost — each song's `card.label` is rendered by nothing.
- **M103** W1 — five of six profile categories are his to fill.
- **M104** V2 — four `pick` sentences, one per act.
- **M105** the profile template is built for ANY artist and is wired on ONE wing.
- **M106** F6 — Contribute's three tracks wait on his prompt.
- **M107** the keeper's answer left /wb's card; one import if he wants it back.
- **M108** L1 — 88/32 are the narrowest display's capacity; a longer budget
  needs a taller row.

---

## 12. WHAT DID NOT RUN, SAID PLAINLY

**THE 390px HALF OF THE LAP DID NOT RUN, AGAIN.** `resize_window` reports success
and `innerWidth` does not move — tried at 390, 600 and 900, all three returned
1706×810. That is M97 from the previous round, re-confirmed rather than
rediscovered, and it is now two rounds in which the narrow layout has been
reasoned about and not looked at.

**WHAT WAS DONE INSTEAD, and it is a rule-level check rather than a lap:** L1's
≤680px branch was verified by injecting its own rules and forcing the container
to the 334px the layout produces at 390px, then measuring an 88-character note
against a 32-character name. It holds. The ≤820px bill stack and the ≤720px mat
stand-down were **not** verified this way and are reasoned only.

**`/api/visits` returns 500 under local `wrangler dev`** — `D1_ERROR: no such
table: visits`, a local database without migrations. `/api/guestbook` returns 200
with `content-type: application/json`, which is the H1 hazard's own check: the
back end is reaching the worker and is not being answered by the asset store.
