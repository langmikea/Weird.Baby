# THE REMOTE-CONTROL ROUND — 2026-08-16

Four phases, in order, from Mike's instruction of 2026-08-16. **Nothing was
committed, pushed or deployed.** Working tree only.

---

## WAITING ON MIKE

**Updated at the close of §5 (the same day's follow-up), which answered three of
the six below.**

| # | what | why it is his |
|---|---|---|
| 1 | **The Short Story · The Long Story · The Blog are empty.** | His instruction: *"Do NOT write these yourself; they are Mike's voice."* The search for existing material is §3; the honest answer is that there is none in the repo. **He confirmed at §5 that they stay empty ON PLAN.** |
| 2 | **The Coalition tile needs a picture before it comes back.** | He hid it at §5.2 (*"looks like shit"*). The tile, its grid, its preview well and the ordering rule are all intact; ledger row `shop.friends` is HELD on this one dependency. |
| 3 | ~~The outbound door is struck~~ **— ANSWERED at §6. The donate passage is ruled in and the door is open again**, in one place, inside his own sentence. `S-i` closed. |
| 4 | **13 of the booth's 18 answer lines wrap on a phone.** | His no-wrapping ruling cannot be satisfied at 390px without shrinking type, which he forbade. Table in §2, **re-measured and corrected at §5**. |

**ANSWERED AT §5 AND CLOSED:** REC 004's production note (moved to column C,
`S-h`) · the three ABOUT THE ARTIST items (he ruled all three, `S-k`).

**ITEM 3 WAS RAISED AND HE ANSWERED IT THE SAME DAY.** Hiding the friend tile had
removed the door the FAQ's struck link was moving TO, so for a few hours the
building named a destination and published no route to it. His answer is §6's
donate passage, and it is a better door than either of the two it replaces: the
link is inside the sentence that explains why it is not everywhere else.

---

## GATES AT CLOSE

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 8 warnings = baseline** |
| `npm run build` | green |
| `npm run provenance:gate` | **PASS** — 39 rows added (36 MIKE, 3 HOUSE) |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** — 0 findings |
| `npm run docs:numbers:gate` | **PASS** |
| `npm run reveal:day` | nothing to move |
| `npm run assets:orphans` | **13 rows (8 judged, 5 unjudged) — PRE-EXISTING.** No asset was touched this round; the reading is HEAD's. |
| `record:land --verify` | **54 of 54 strings round-trip, 0 mismatches** |

**Backups written:**

```
C:\AI\_week01\_backup_robots-record_before-attach-20260816.js
C:\AI\_week01\_backup_foundation_before-phase3-20260816.js
C:\AI\_week01\_backup_weird-baby_before-W-a-20260816.js
```

---

## §1 — REC 001: THE ATTACHMENTS SECTION BECOMES THE ATTACHMENT FIELD

**Ruled by Ops and instructed: do it in the READER, not by editing his
workbook.** His ATTACHMENTS label is a bold cell in column B, so by the ordinary
rules it landed as a text section reading `> n/a` — beside a real attachments
mechanism (`attachmentsOf` → `RecordAttachments` → `RecordEntry.jsx:633`) that
would have drawn a second list of the same thing. Two lists of one thing drift;
one renders and one lies.

### What changed, and the one that mattered

| file | change |
|---|---|
| `tools/dictation/workbook_to_draft.py` | `split_attachments()` lifts an ATTACHMENTS section out of `sections` and into the entry's `docs` field, one row per line. |
| `tools/dictation/emit-record-entries.mjs` | emits `docs`; **`strings()` and `differences()` now walk it.** |
| `reveal/record-entries.mjs` | `draftEntries` reads `docs`; `READ_ENTRY_FIELDS` + new `READ_DOC_FIELDS`. |

**THE PROOF WAS THE PART THAT COULD HAVE GONE WRONG SILENTLY.** `strings()` is
what `--verify` round-trips. Moving his lines out of `sections` moved them out of
`strings()`, so `--verify` would have gone on printing *ALL STRINGS ROUND-TRIP*
while proving nothing about the field this round exists for. **A proof that
stops covering a field the moment that field moves is the failure it exists to
catch.**

**AND `docs` WAS DRAWN BUT NOT READABLE.** It was in `DRAWN_ENTRY_FIELDS`
(`reveal-ledger.mjs`) and **not** in `READ_ENTRY_FIELDS`
(`reveal/record-entries.mjs`). Those two lists ask different questions on
purpose — *does anything render this* versus *can the surface Mike writes on
hand it back* — and an entry carrying `docs` would have rendered on the glass
and vanished from his editor. That file's own comment names `docs` first among
the fields this would happen to. It was right.

### The rules the reader now carries

- **Marker prefixes come off HERE AND ONLY HERE.** `>` at the head of a body
  paragraph is his and is carried verbatim; at the head of an ATTACHMENTS line
  it is a bullet in front of a filename, and a document row titled
  `> View of the portal screen` is the marker rendered as content.
- **"n/a" MEANS NO ATTACHMENTS, NOT A SECTION SAYING "n/a".** A line reducing to
  `na` / `none` / `nil` is dropped, and a section left with nothing emits **no
  field at all**. That is the only place in the reader where a line of his does
  not travel, and it is deliberate: the alternative is a document row on the
  glass whose title is the word "n/a".
- **Only `title` is emitted.** `source`, `date`, `scan`, `plates` are facts about
  a photograph that exists; filling them in would be inventing provenance. A doc
  with a title and no image is a designed state — the row prints *not here yet*.

### Measured

- Reader → draft: `001 no attachments · 002 no · 003 no · 004 3 attachment(s) · 005 no`.
- Draft vs tree: **the ONLY difference across all five records was the
  ATTACHMENTS sections.** Nothing else moved. (His workbook is 18,524 bytes now
  against 23,681 at the last landing — an Excel resave; the content round-trips
  identical.)
- `--verify`: **54 of 54, 0 mismatches.** `--write`: all five regenerated,
  comment characters 0 before / 0 after, 26190 → 25702 bytes.
- **ON THE GLASS.** Record 001 draws five sections and ends at ADDENDUM 03's
  HASH line: **no ATTACHMENTS heading, no "n/a", no attachments block.** Record
  004 draws the real block — three rows, each `DOCUMENT · NOT HERE YET` — and
  the index row gains `DOCS 3`, which is the payload badge Mike ruled must carry
  (RecordEntry.jsx, 2026-08-11).

---

## §2 — /booth BECOMES THE STANDARD TEMPLATE

**MIKE: "This page is elegant and clean. This needs to be THE standard template
for FAQs, and likely for many other things."**

### The typography complaint was exactly right

The list was set in **two typefaces at the same size** — Syne 600 for the
question, DM Serif Display for the answer, both 1.02rem. The only thing
separating a question from its answer was that they were different fonts:
hierarchy carried entirely by a change of voice, which is the one signal a
reader has to stop and decode.

| | face | weight | size |
|---|---|---|---|
| question | Geist | 600 | 1.06rem |
| answer | Geist | 400 | 0.95rem |

**GEIST'S WEIGHTS ARE REAL, AND THAT WAS MEASURED RATHER THAN ASSUMED.**
`fonts.css` declares 400/500/600/700 against ONE file (the variable-font dedupe
of 15 August), which looks like four aliases for one face. It is not — the
`font-weight` descriptor on an `@font-face` sets the `wght` axis. Canvas
measurement of `Hamburgefonstiv 123` at 40px: **387.6 / 397.5 / 407.4 /
417.3px.** Had this been wrong, question and answer would render at identical
weight and **this exact complaint would be back wearing the fix's name.**

### Up, and indented

- **UP is 8px off the QUESTION's bottom padding** (17/17 → 17/9), not a negative
  margin on the answer. A negative margin pulls the answer over the summary's
  own click target, so the row a visitor presses stops being the row they see.
  The gap is closed where the gap is.
- **INDENT is 26px of left padding**, and the 62ch measure is UNTOUCHED — the
  indent takes the line's start, not its length. Shortening the measure to pay
  for the indent would re-wrap every answer in the room, which is the one thing
  his no-wrapping ruling forbids.
- **`hyphens: auto` is gone** for the same reason: a hyphenated break is a wrap
  with a dash in it. Measured first — nothing on the page hyphenates today, so
  this removes a mechanism rather than a result.

### The opening lines

Card top padding **64px → 34px**, and that air is spent below the credo as a
**52px bottom margin**. The underline (`border-bottom: 3px solid var(--wb-gold)`
on the `em` around *Always.*) is deleted; the `em` rule stays because
`font-style: normal` is what stops the browser italicising the word.

### The copy

Order is now: what is this place / really free / tracking / who keeps / how do
things get in / affiliated / take a cut / finished / **contact (last)** →
**"Return to the lobby"**.

**Two questions struck, each named once in the source (Doctrine 24):**
*"So, how does the site always know it is me?"* (*"Your computer / phone saves
your information for you. / We never touch it."*) and — on the Foundation, §3 —
*"Why do this at all?"*.

### The same treatment reaches `.vp-faq-*`

Applied to the wing FAQs (robots, wal, wb, foundation) because he ruled the
booth THE standard for FAQs and Phase 3c asks the Foundation's FAQ to follow it
exactly. **The RELATIONSHIP is shared, not the numbers** — a face reads
`--fs-lead` / `--fs-body` because it sits in a pane the visitor can resize and a
sheet does not, and a number copied across two ramps is a number that is wrong
on one of them.

### ⚠ THE NO-WRAPPING REPORT

**MIKE: "If my lines are too long, do not wrap them please. I will reword them
instead."** So: reported, not reworded, and the type was not shrunk.

**Desktop: zero of 18 authored lines wrap.** Longest is 74 characters in a 625px
column.

**At 390px: 13 of 18 wrap.** The column is 302px there.

**[CORRECTED §5] THE FIRST VERSION OF THIS SECTION SAID 26 AUTHORED LINES AND
THERE ARE 18.** The 13 that wrap was measured; the 26 was stated. The proportion
is therefore WORSE than first reported, not better — very nearly two thirds. The
table below is re-measured after §5's two rejoins, which is why two of its lines
are longer than they were.

| chars | line |
|---:|---|
| 74 | `No — Those exhibited on Weird.Baby are not partners, clients, or signings.` |
| 71 | `Every door in the gift shop leads to the Artists' own sites and stores.` |
| 63 | `NOTE: We do not speak for Social Media or Artist site policies.` |
| 56 | `No — a museum that stops accessioning is a storage unit.` |
| 55 | `That's not an introductory offer. It's the arrangement.` |
| 54 | `PRO-TIP: Just go out and do some good. We're watching.` |
| 51 | `Yes — no accounts or logins. Nothing behind a wall.` |
| 49 | `It gets discovered organically and fits the suit.` |
| 45 | `A place to freely share my stuff with others.` |
| 44 | `If you come back, there will be more to see.` |
| 43 | `No — Weird.Baby uses no logins, no cookies.` |
| 43 | `They are people we feel are Worth a Listen.` |
| 41 | `One person — The current Papa Weird.Baby.` |

**The longest needs 503px of text column; a phone gives 302px.** This is not a
rewording he can win — a phone cannot hold ~30+ characters at this size. It is a
decision: phone lines wrap, or the phone gets its own shorter lines.

---

## §3 — THE FOUNDATION

### a/b — the tracks

`executive-summary` and `happening-now` are **deleted**, named once in the
source. In their place: **The Short Story · The Long Story · The Blog**, then
FAQ.

**`ACCOUNT` NOW HAS NO READER AND IS KEPT ON PURPOSE.** It is the room's own
$0.00 register, declared beside the ledger it belongs to; the three new tracks
are unwritten, and deciding it is dead before he has written them would be Ops
choosing what his story needs.

**THE THREE ARE EMPTY AND HONEST.** Each face carries a `[PAPA]` blurb and
nothing else; `scrubFace` deletes a blurb that is entirely a marker, so the face
draws title and subtitle and nothing else in both stages. **It is deliberately
NOT `NOT_BUILT_YET`** — that constant states MECHANISM state, which Doctrine 11
names as the permitted case. A track with no writing in it has a working
mechanism and no words, and *"nobody has written this yet"* is a line whose
SUBJECT is the making of the museum.

**A DEFECT THE GLASS CAUGHT AND NO GATE DID.** The first version of those notes
was written as two sentences each. `visitorProse` cuts by SENTENCE and drops
only the sentence carrying the mark — so *"Nothing in the repo was close enough
to seed it; the search is in the round report."* **published as visitor copy** on
The Short Story. Found by looking at the page. All three are one sentence now.
`/wb`'s own `How to contact?` records the same trap in its own comment; it was
right and it was not enough.

### THE SEARCH FOR HIS EXISTING WRITING

**His instruction: "I have written about the story before. Look for it, instead
of me reinventing the wheel."** Searched: all of `docs/` (240 files), every
`HANDOFF_*`, the Records, `src/data/`, the dictation instruments,
`docs/dictation-20260807/`, `C:\AI\_week01\`, and the five `C:\AI\_night-*`
directories.

| where | what it is | verdict |
|---|---|---|
| **`C:\AI\VISION.md`** — 151 lines, filed 2026-04-14, "locked" | *"a place to fall deeper into artists who deserve that depth"*; the three identity layers (Weebie / Papa Weird.Baby / Mike Lang the artist); who it is built for; the Abundance Principle; the spine; the Guest Book; the Founding Visitor | **the closest thing that exists** — and it is OUTSIDE this repo, and its subject is the MUSEUM, not the giving. It does not mention homelessness or the Coalition once. It predates the Foundation turn entirely. |
| `C:\AI\VISION_LOCK_v0.3.md` (973 lines) | the locked spec behind it | mostly architecture |
| `docs/GIVING_RESEARCH-20260805.md` | Ops research answering his *"How much to solve immediate vs long term"* | research, and it says on its own face that nothing was decided |
| `C:\AI\_night-20260811\2_coalition-for-the-homeless.md` | Ops research on the Coalition | facts for him to use, not prose |
| `docs/dictation-20260807/answers.json`, `arc.html`, `C:\AI\_week01\_arc.json` | his week-one workbook and the robots story arc | **the Robots story**, already landed as Records 001–005 — a different story |
| the two tracks deleted above | *"Built from gifts. Gives everything away…"* and an empty log | he killed them |

**CONCLUSION: there is nothing to reuse without his ruling.** The one candidate
is a museum manifesto sitting where the giving story goes; reusing it would be
Ops deciding his story is about artists rather than about homelessness.

### c — the FAQ, full replacement

All eight questions, his words, his order. **His typed line breaks are
SENTENCES, not paragraphs** — the same reading D took on 2026-08-13 and applied
again rather than re-decided. The one blank line he left (*What happens when you
stop?*) is the only paragraph break in the set.

**`faqFor` NEEDED A ONE-LINE FIX OR NONE OF IT WOULD HAVE DRAWN.** It
destructured `({ q, a, link })`, so every `lines:` array would have become
`[undefined]` — silently, on all eight.

**STRUCK:** *"Why do this at all?"*; *"Why give all the money away?"*
(superseded — and **register row M40 is answered by this round**: the Ops marker
for the Mike-and-Mo half has arrived in his own words as the who-pays answer);
and **the outbound door** `link: { text: "Give to Coalition for the Homeless",
href: "…/donate" }`, the first and only real outbound anchor in the wing.

**THE FOOT IS CENTRED**, with `margin-inline: auto` on the paragraph — a centred
paragraph inside a left-aligned 68ch box sits centred within the box and
off-centre on the page, which reads as a bug rather than as a choice.

### d — the scroll, and it was real

**Measured at 403×660 on `/foundation`, before:** tapping FAQ fired
`scrollTo({top: 360.9})` and the page **stayed at 0**, with the face panel 479px
below the fold. The tap did nothing visible.

**Two causes, one root:** the glide (`F6 2026-08-02`) waited a flat 120ms,
measured `.vp-area`, fired ONE `window.scrollTo`, and **never checked it
arrived**.

1. The browser **CLAMPS** a scroll to the document's current maximum. Selecting a
   short face fires `scrollTo(361)` at a document exactly as tall as the
   viewport — maximum scroll ZERO. Instrumented: `scrollTo({top:360.9})` against
   `docH: 660, innerH: 660`.
2. **120ms is a guess about somebody else's layout.** The FAQ grows the document
   from 660 to 1156 as it renders.

`glideToFace()` (module scope, `Exhibit.jsx`) re-measures and re-applies until
the face is in view, on a ~600ms budget, stopping the moment it lands. **The last
attempt is `instant`** — if the smooth one did not land, easing again is the same
bet twice. `setTimeout` and not `rAF`, deliberately: §8's own hazard row says rAF
does not fire in a tab that is not being painted, and a glide is correctness here.

**THE FIRST VERSION OF THE FIX HAD ITS OWN BUG AND INSTRUMENTING IT CAUGHT IT.**
It bailed with a bare `return` when `.vp-area` was momentarily absent — which it
is, for a frame, while React swaps the face — and **the bail-out took the whole
remaining budget with it.** Three attempts fired and the chain died before ever
reaching the instant one. The next attempt is scheduled BEFORE any of the work
now. *A retry that can be killed by the very re-render it is waiting for is not a
retry.*

**After: y=361, panel top at exactly 118px in the viewport** (the intended offset,
clearing the fixed nav). The three story tracks still land at 0 — their faces are
empty, the page is exactly viewport-height, and there is nowhere to scroll. That
is physics, and it goes when he writes them.

---

## §4 — GIFT SHOP + ABOUT THE ARTIST

### Gift shop

| ask | done |
|---|---|
| less white space at the top | **first tile 144px → 88px**, which is 36px under a 52px bar. `.gift-shop`'s 5.5rem top padding is LEFT ALONE — it clears the fixed bar and is load-bearing. What was struck is the FIRST section's 3.5rem top margin, which separated a section from a bar already clear of it. |
| Coalition links to the front page | `https://www.coalitionforthehomeless.org/`, was `/donate`. **A change of intent rather than of host:** a shop tile that lands a visitor on a payment form is asking for money in a room whose whole doctrine is that this house does not. |
| the rule word | *"at the bottom"* → **"last"**, his wording, same behaviour. Changed in all three places it is quoted. |
| a preview image | **the mechanism is built and there is no picture.** `friend-tile__thumb` draws only when `image` is set, and `wbFriends` carries the field. **No fallback plate:** the artist tiles fall back to the name set in serif, and doing that on a tile whose only other content IS the name prints the name twice and calls it a picture. |

### ABOUT THE ARTIST — W-a CLOSES

His text, verbatim. It replaces Ops' blurb and Ops' one register row, both
tracked as placeholders since 2026-08-14 on his own instruction.

**THREE ITEMS ARE FLAGGED AND NOT CORRECTED, ON HIS EXPLICIT INSTRUCTION:**
*"Steven's Inst Tech"* is Stevens Institute of Technology · *"P!NK when to my
High School"* reads as *"went"* · *"Managmeent"*. **A round that tidies one has
broken the instruction** — the same rule Record 001 already carries for
`was made made` and `=  86%`.

**WHY IT IS TWO FIELDS AND NOT THREE, WHICH IS A MEASUREMENT.** The first cut put
his four biography lines in `lines`, the face's mono REGISTER — the right
instrument for a stack of short keyed facts. **The renderer draws
`.vp-face-lines` roughly 350 lines BELOW `.vp-prof`**, so on the page the face
read *blurb → ACHIEVEMENTS → CURRENT PROJECTS → Born 7/3 63*. **His order is part
of his text.** Moving the register up the renderer would reorder every face in
the museum that declares both to fix the one that does; inventing a heading so
the biography could be a `profile` card would be Ops writing on the one card
whose whole point is that it is not. So the biography sits in the lead, where he
put it, carried by the blank line he typed. **The cost, stated: the bio lines
take the lead's weight and measure rather than a mono column.**

**A CARD WITH NO LABEL WOULD HAVE VANISHED.** `scrubFace` filters profile cards
on `kept(label) && kept(body)`, and `kept(null)` is false — a card carrying the
biography under no heading would have been dropped in silence.

**`white-space: pre-line` reaches two more surfaces** — `.vp-face-blurb` and
`.vp-prof-body` — which makes four in the house (`.vp-rec-sum`,
`.vp-rec-sect-body`, `.sheet-faq-a`, and these). It collapses runs of spaces and
still wraps a long line, so every existing single-paragraph blurb and card is
byte-identical on the glass.

---

## PROVENANCE

39 rows added: **36 MIKE** (his instruction of 2026-08-16, quoted in this file)
and **3 HOUSE** — the `[PAPA]` markers on the three story tracks, which are not
visitor-facing by construction (`visitorProse` at the render seam in every stage,
`wb-ops-notes` emptying the literal from the source at launch) and are declared
as operator markers rather than as copy.


---

# §5 — THE FOLLOW-UP, SAME DAY (four items)

His four small items, in order. **Nothing committed, nothing deployed.**

## 5.1 — TWO FAKE LINE BREAKS ON /booth, AND A SWEEP

**MIKE: "Ops wrapped these lines inside a code block when writing the packet and
you carried them verbatim, correctly. They are not Mike's line breaks."**

**THE DEFECT WAS DOWNSTREAM OF A RULE WORKING.** `.sheet-faq-a` draws `
` as a
real break, and this room's standing instruction is that his newlines are his and
are never re-wrapped. Applied to a line that a code block had wrapped **on the way
in**, that rule published the wrapping.

**THE TEST THAT SEPARATES A BREAK FROM A WRAP IS CHECKABLE RATHER THAN TASTEFUL:
does the line end mid-sentence?** A break after a full stop is a decision; a break
after a comma, or before a line that opens lower-case and completes the clause
above it, is a wrap.

**SWEPT BOTH ROOMS ON THAT TEST.**

| room | authored breaks | failed the test |
|---|---:|---|
| `/booth` | 11 | **2** — exactly the two he named |
| `/foundation` | **0** | — |

`/foundation` has none because its answers are `lines` arrays landed **one
sentence per element** in the morning round, on the reading that his typed
wrapping is not a paragraph break. The booth's two came in with the 2026-08-15
rewrite, inside the two answers this packet listed under KEEP.

Measured after: **18 authored lines, 0 wrapping on desktop.**

## 5.2 — THE COALITION TILE IS HIDDEN

**MIKE: "looks like shit."** A name and a door in a box, no picture, beside four
tiles that are all picture.

**HIDDEN BY EMPTYING THE LIST, NOT BY DELETING ANYTHING.** `wbFriends` is `[]`;
`GiftShop.jsx` guards the whole section on `wbFriends.length > 0`, so the grid,
the rule and the tile all leave together with no branch anywhere and nothing
half-drawn. **The entry is kept whole and addressed** as `wbFriendsHeld`, one line
below the hold — so the friend-tile TYPE, its quarter-size grid, the preview well,
the ordering rule (*last in whatever content is already defined*) and the verified
URL are all untouched and all still true of the day it returns.

**A HIDING RULING IS NOT DONE UNTIL A LEDGER ROW MOVES, AND THIS ONE HAD NO ROW
TO MOVE.** `shop.friends` did not exist: **the tile shipped on 2026-08-15 and the
reveal ledger never knew it was there**, so nothing could have reported it as
either live or held. It is declared now — `NOT_BUILT` / `HELD`, `shown: true`,
one dependency (*a preview image — Mike, S-g*), and exempt from the transfer
classes under the standing *NOT MGK MATERIAL* clause its three shop siblings
already use. **Ledger 166 → 167 rows**, and `docs:numbers` caught the published
figure in `OPERATIONS.md` §5 within the same run.

## 5.3 — REC 004: THE PRODUCTION NOTE MOVES TO COLUMN C

Backed up first: `C:\AI\_week01\_backup_NEW_RECORD_MAKER_V3_before-colC-20260816.xlsx`
(18,524 bytes, sha256 `6F26C591F6842C5C…`).

`REC 1.4` **B32 → C32**, taking the look of an existing column-C note so it reads
like the other private notes. Re-landed: **53 of 53 strings round-trip, 0
mismatches**; `--write` changed **one record** and carried 001, 002, 003 and 005
through untouched.

**On the built page:** Record 004 draws two attachments, the index badge reads
`DOCS 2`, and neither *OPAs* nor *select and prepare* appears anywhere in the
document.

### THE SWEEP OF ALL FIVE RECORDS

Read every REC sheet cell by cell, column B (ships) and column C (never ships).

**ONE leak, and it was the one he named.** Everything else that looks like a note
is already caught by a mechanism that was built for it:

| what | where | why it does not ship |
|---|---|---|
| `OPAs, photos,  - Mike to select and prepare` | REC 1.4 B32 | **the leak — moved to C32 this round** |
| `None` under ATTACHMENTS | REC 1.3 B36 | the reader's `n/a` / `none` / `nil` rule drops it, so 003 emits no field |
| `Release the Portal Album.` | REC 1.5 B32 | below `{NOT PART OF THE REPORT}` — the cut is POSITIONAL, which is why an unbraced line inside that block still does not travel |
| `{Ops wrote 15-18…}`, `{EGGPLANT…}`, the Bell 103 proposal | rows below the cut on all five | same positional cut |
| the week-plan beat | row 3 on all five | dropped by position; `{Do not include in Record}` sits in column C beside three of them |
| 16 column-C notes | all five sheets | **proved, not asserted:** every column-C string was searched for in the landed `robots-record.js` with the JS concatenation folded away. **0 of 16 present.** |

## 5.4 — THE THREE ITEMS ON /wb, RULED

He ruled all three he had been flagged on:

| was | is |
|---|---|
| `Steven's Inst Tech` | **Stevens Institute of Technology** |
| `P!NK when to my` | **P!NK went to my** |
| `Eng Managmeent` | **Eng Management** |

**Nothing else in that copy changed**, on his instruction, and the source now says
so where the flag used to be. **The flag rule itself is unchanged and still binds
Record 001's `was made made` and `=  86%`**, which he has not ruled on — this
round is not permission to tidy those.

## 5.5 — THE THREE FOUNDATION TRACKS

**Empty on plan.** Not hidden, not written, not touched. `S-f` stands.

## GATES AT CLOSE (§5)

lint **9 / 8 = baseline** · build green · provenance **PASS** (4 rows added) ·
`reveal:check` **PASS** · `parity` **PASS** (4 shared, 0 divergences) ·
`instory` **PASS** · `docs:numbers` **PASS** (after correcting the ledger count in
`OPERATIONS.md`) · `reveal:day` nothing to move · `record:land --verify`
**53 / 53, 0 mismatches**.

Backups: `_backup_NEW_RECORD_MAKER_V3_before-colC-20260816.xlsx`,
`_backup_robots-record_before-colC-20260816.js`.

Closed this round: **S-h**, **S-k**. `S-g` re-pointed at the hold.

---

# §6 — THE LAUNCH ROUND (four items, same day)

**Nothing committed, nothing deployed.** The last round before he deploys and walks.

## 6.1 — THE DONATE PASSAGE, RULED IN

**MIKE: "This is the ONLY place on the site that links to giving. Mike's words,
lightly shaped by Ops; he will edit later."**

A new FAQ entry on `/foundation` — *Where's the donate button?* — four lines, one
sentence each, and **"donate here" is an anchor inside his own last line**
pointing at `https://www.coalitionforthehomeless.org/donate/`.

**IT RESOLVES `S-i`, THE ROW OPS RAISED THIS MORNING AND COULD NOT CLOSE.** He
had struck the FAQ's outbound anchor by naming its link text under KILL; Phase 4
pointed the gift shop's Coalition tile at their site; then he hid that tile. For
a few hours **the building named a destination and published no route to it.**
His answer is better than either door it replaces: the link is inside the
sentence that explains why it is not everywhere else.

**IT IS `inline`, NOT `link`, AND THAT IS NOT A PREFERENCE.** `en.link` already
existed and draws a door BELOW the answer — F6's block, a named destination with
a state stamp. His copy puts the words *in* the sentence, so the block would have
printed "donate here" twice: once as his prose and once as furniture under it.

**HIS SECOND INSTRUCTION SHAPED THE CODE MORE THAN THE FIRST: "DO NOT introduce a
general external-link affordance. This is one link in one answer, not a new
pattern."** So what exists is the smallest thing that draws his sentence:
`inlineDoor()` turns the first occurrence of one declared substring into an
anchor and does nothing else. **No link component, no icon, no "opens in a new
tab" tail, and deliberately NOT a `.vp-faq-a a` selector** — a bare descendant
rule would dress every link any wing's FAQ ever grows, which is the affordance he
refused. It is a named class, `.vp-faq-inline-link`, that **one anchor in the
building carries.** Measured on the built page: `.vp-faq-a a` → **1**.

**THE DOOR THAT CANNOT BE FOUND STILL DRAWS.** If the mark ever stops matching
its paragraph — a reworded line, a stray space — the anchor would vanish with
nothing said. It falls back to a plain trailing link instead. *"Nothing drops
silently ever again"* covers exactly this shape.

**AND IT IS IN THE LEDGER, WHICH IS THE PART WORTH KEEPING.** `door.coalition` —
LIVE / REVEALED, reach *"inside the Foundation's FAQ answer"*. **The 2026-08-14
door it replaces never had a row**, which is how a single outbound link could be
cut, struck and reopened three times in one day with the table saying nothing.

**THE GATE CORRECTED OPS ON THE TRANSFER CLASS, IN ONE LINE.** The row was first
written into the NOT-MGK-MATERIAL exemption beside its three shop siblings, and
`validate()` refused it: *"REVEALED and exempted — exemption covers what is NOT
shown; a visitor can reach this."* Exactly right. It is BLAST now, on the class's
own definition, beside `channel.shop` and `channel.music`. **Exemption is for what
the fiction does not describe, never for what is simply live.**

**POSITION IS OPS' JUDGEMENT AND IS FLAGGED AS ONE.** He supplied the copy and not
the slot. It sits directly under *Where do our donations go?* because the two are
one thought — that answer says where the money lands, this one says how a reader
sends some there without buying a t-shirt. Moving it is one object.

## 6.2 — THE TYPOS

### FIXED

**`coincedent` → `coincident`** — Record 001, DETAILED REPORT, visitor-visible.
Fixed **at source** in `NEW_RECORD_MAKER_V3.xlsx` (REC 1.1, B16) and re-landed,
not hand-edited into the tree. `--verify` **53 of 53, 0 mismatches**; `--write`
changed **one record** and carried 002–005 through untouched. Confirmed on the
built page.

### `made made` — WHERE IT WAS, AND WHY IT IS NOT A FIX

**He was right that it is not on the page. It is not in the data either.**
Measured on this file's shipping strings with comments stripped and the
concatenation folded:

| string | in shipping strings |
|---|---|
| `made made` | **absent** |
| `Incoming data =  86%` | **absent** |
| `auto containment. and auto alerts` | **absent** |
| `coincedent` | present → **fixed** |

**All three expired when his V3 workbook rewrote the sections they lived in** and
the 2026-08-16 landing replaced the text wholesale. The EXECUTIVE SUMMARY is now
two `>` lines ending *"Handoff is on track (T-6);"*; the 16:00 line reads
*"Instantaneous - RX sustained FULL LOAD - Packet Rejects = n!"*; the 16:10 line
reads *"auto-shutdown, auto-containment, and auto-alerts"*.

**SO THERE WAS NOTHING TO FIX, AND SOMETHING ELSE TO FIX INSTEAD.** `made made`
survives only in **comments and documents** — and one of those comments,
`robots-record.js`'s own preamble, was still instructing later rounds not to tidy
three strings that are not in the file. **That paragraph is what sent him
looking.** It is corrected in place: it now states, with the measurement, that all
three are gone, where the originals can still be read, and that the verbatim rule
itself is untouched. **A list of examples that has outlived its examples is worse
than no list — it is a tripwire pointing at empty ground.**

**THE ORIGINALS WERE NOT EDITED.** `docs/dictation-20260807/answers.json`, its
rescue dump, and `docs/MUSEUM_RECORD_001_LOG-20260808.md` are the record of what
he said. Same rule `docs:numbers` states for a round log.

### `=  86%` — REPORT ONLY, AS INSTRUCTED

**It is not on the rendered page because it is not in the Record at all.** It
lives in exactly two places, both archives of the 2026-08-07/09 dictation:

- `docs/dictation-20260807/answers.json`, key `W1.D1.NOTES`
- `docs/dictation-20260807/wb-rescue-2026-08-09.json`, same key

and in both it reads, in full:

```
  16:00 - Onslaught - Incoming data =  86% vs threshold
```

with **two spaces after the equals sign**. Left exactly as it is.

### LEFT ON HIS RULING

`Handoff is on track (T-6);` — the dangling semicolon. Untouched.

### THE SWEEP — ONE MORE THING, REPORTED NOT FIXED

Every shipping string in the Record, plus his booth FAQ, his Foundation FAQ and
his ABOUT THE ARTIST copy, checked for doubled words, runs of spaces, lower-case
after a full stop, and lines ending in a stray comma or semicolon.

| finding | verdict |
|---|---|
| `> Alert - Incoming Server Load  (contained)` — **two spaces** before the bracket, Record 001's deck | **the only new one.** In the data, **not on the glass** — the deck carries `white-space: pre-line`, which collapses runs of spaces. Row `S-l`. |
| doubled words | **none** |
| lower-case after a full stop | **none** (the old one went with the text) |
| lines ending `,` or `;` | one — the semicolon he ruled stays |
| the aligned registers (`THE CEO         - one page…`, `1  PARITY    ODD / EVEN`) | deliberate column alignment, not slips |
| `hands-on-the-ball`, `f(Ump)`, `5Kx`, `n!` | voice, not slips |

**He does not hunt: `S-l` carries the one finding and the ruled-stays semicolon
together**, so the next sweep does not raise the semicolon again as new.

## 6.3 — S-e IS CLOSED AS STALE, WHICH IS ITS OWN FINDING

`S-e` had been open since 2026-08-08 asking him to rule on three strings. **All
three had ceased to exist when V3 landed, and the row went on asking.** It is
closed as stale rather than decided, with the measurement in the history file.
A register row that outlives its subject is the same defect as the comment above
it, one level up.

## GATES AT CLOSE (§6)

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 8 warnings = baseline** |
| `npm run build` | green |
| `npm run provenance:gate` | **PASS** — 7 rows added (all MIKE) |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared · 0 divergences |
| `npm run instory:gate` | **PASS** — 0 findings |
| `npm run docs:numbers:gate` | **PASS** — after correcting the ledger count 167 → 168 |
| `npm run reveal:day` | nothing to move |
| `record:land --verify` | **53 of 53, 0 mismatches** |

Backups: `_backup_NEW_RECORD_MAKER_V3_before-coincident-20260816.xlsx`,
`_backup_robots-record_before-coincident-20260816.js`.

**Closed this round: `S-i`, `S-e`. Opened: `S-l`.**
