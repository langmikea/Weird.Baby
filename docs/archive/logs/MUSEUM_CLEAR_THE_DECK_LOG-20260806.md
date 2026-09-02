# CLEAR THE DECK — D1–D9, 2026-08-06

**Nine instructions, all nine landed, and the biggest of them was found by
looking for something else.** Mike is holding new input until the backlog is
clear and he can do a clean review; the goal was to land everything already
ruled so his next pass finds only new problems.

Gates: lint **11 errors / 9 warnings = baseline, zero new** · build green ·
`provenance:gate` **PASS** (0 undeclared · 0 stale · 0 invention) ·
`reveal:check` **PASS** · `parity:gate` **PASS, 4 shared · 0 divergences** ·
lap **on the built bundle**, eleven routes, no horizontal overflow anywhere,
no console messages. Surfacing **13 · 13 · 15, unmoved** — three files added
and all three referenced, so the shelf did not grow.

---

## D1 · THE DUPLICATE-CONTENT FIX, AND THE DUPLICATE MAP

**MIKE:** *"the same content exists in multiple rooms with no link between the
copies, so fixing one never fixes the other and neither Mike nor Ops can tell
from a screenshot which copy he is looking at. He edited the contact answer once
and it survived elsewhere; that is the defect, not his memory."*

### How the map was made

Not by grep. The population is **exactly the population `provenance:gate`
polices** — `tools/provenance-sweep.mjs`'s own extractor was called directly, so
the map covers every visitor-facing string literal in `src/` and `index.html` and
nothing else. Groups were formed on normalised text (whitespace, quote marks,
case), then a second pass looked for NEAR-duplicates by token overlap, because
the copies that matter most are the ones that have already started to drift.

### The map

**EXACT, CROSS-FILE — three, and one of them is the defect he described**

| passage | sites | what happened |
|---|---|---|
| *"One person — Papa Weird.Baby. The job pays nothing…"* | `InfoBooth.jsx` · `weird-baby.js` | **HOISTED.** One declaration in `src/data/house-copy.js`, imported by both. |
| the manual reader's **FORMAT** and **NAV** lines, and the empty reel's note | `robots.js` ×2 (both machines' Manual faces) | **HOISTED** to module constants in that file. |
| *"No. The shop carries what the shop carries; the machines are not stock."* | `robots.js` ×2 (both machines' FAQs) | **HOISTED.** |

**DIVERGED — reported, NOT merged, because his instruction was to let him pick**

| the pair | how they differ | row |
|---|---|---|
| the contact answer: the booth's, and the robots front desk's *"How do I get in touch?" → `papa@weird.baby`* | the booth now carries his full sentence (D2); the robots row is the bare address. **Every answer on that face is his, word for word (P3)** — folding it in would be Ops rewriting his content under cover of a refactor. | **M66** |
| the two machines' FAQ blurbs — *"about the cabinet"* / *"actually get asked about the unit"* — and their *"Does it still work?"* answers | the NOUN differs by design; the word *actually* and a second sentence about the Portal do not obviously | **M67** |
| `index.html`'s `og:description` and `twitter:description` | the Twitter one drops *"The MGK robots, and music worth a listen."* and nothing says why | **M68** |
| Hunter Root's holdings sentence on his card and on the poster | same fact, two wordings — both correct, and both were checked this round | **M69** |

**THE THIRD MIRROR, WHICH IS NOT A PASSAGE AND IS THE WORST OF THEM** — see D3(c).
`HrArchive.jsx` held a hand-typed copy of Hunter Root's whole catalogue. It is
deleted, not corrected.

**WHAT WAS DELIBERATELY LEFT ALONE.** Repeated source citations
(*"— Wikipedia, read 2026"* ×54, *"— Apple Music, read 2026"* ×5, and their
kind) are not duplicated passages; they are one citation per fact and folding
them would make the sourcing harder to read, not easier. Two quotes that appear
in both `worth-a-listen-facts.js` and `worth-a-listen.js` are a FACT CARD and a
FACE LINE — different objects quoting the same person — and merging them would
be this round inventing a shared house line out of a coincidence of wording,
which is the mistake the provenance register already paid for once.

### The mechanism

`src/data/house-copy.js`. Its header states the rule for what may go in it and,
more usefully, what may not. **Every string in it is a plain literal on purpose:**
a passage assembled by interpolation would fall off the provenance boundary
silently, which is a worse defect than the duplication it would be curing.

---

## D2 · THE BOOTH'S CONTACT ANSWER

His wording, ruled, and it is the whole answer:

> Write to the guy running the place: papa@weird.baby.

**Two sentences were struck with it and both had earned it.** *"It is read by
the person who keeps the place"* restated the keeper answer four rows up — the
page explaining what the page already said, which is the shape B5 struck twice on
this same list. *"Corrections are especially welcome — if we have got something
wrong about a record, a date, or a person, we would rather know"* was the museum
advertising its own diligence, which is the subject Doctrine 11 keeps off the
glass and which the WAL poster's foot was struck for one round ago.

---

## D3 · WORTH A LISTEN — THREE FROM HIS READING PASS

### (a) The sourcing claim is struck — and it was on a second face

M53 closed. *"Every claim about an artist here is already on that artist's own
card, sourced there."* is gone from the poster's `papa` field, and the field is
now ONE marked sentence.

**THE SCRUBBER IS UNTOUCHED**, which M53 insisted on: `visitorProse` cuts by
SENTENCE on purpose, because a `papa` field routinely carries real provenance and
then the marker, and dropping the field would take the sourcing down with it.

**AND THE SAME DEFECT WAS LIVE ON THE MGK-NIAC PLATES WALL.** A sweep of every
`[PAPA]` string in `src/` against the scrubber found the residue *"The uncropped
originals are all on file and any of them can be published from this file
alone."* printing on the wall — a maintainer talking to another maintainer, in
the exact register that face's own comment says was removed at CS. A later edit
had split the note in two and marked only the first half. **The comment above it
had been false for a round and nobody read it.** Fixed the same way: one marked
sentence.

> **The rule, since it is now twice:** a `papa` string is not a comment. Write the
> whole note inside ONE marked sentence, or expect the rest on the glass.

### (b) Everything in the viewer comes down, as one

`--face-zoom: .94` on `.vp-face`. The word that decided the mechanism is
**everything**: A4 was the last instruction here and it named the LARGE sizes, so
it moved the three steps above body and left the rest — which is why the panel
still read heavy beside the tracklist it sits next to. Compressing the ramp again
would change the face's internal proportions; he wants **the same face, smaller**.

**IT IS ON THE FLOORS TOO.** Scaling only the dial would leave the rem floors
under `--fs-micro` and `--fs-small` standing, the small end would refuse to move
at narrow windows, and the ramp would FLATTEN rather than shrink — P7's failure
mode read backwards, which is exactly what A4 declared it could not do.

**AND NOT ONLY TYPE.** The face's own three measured sizes — the body's padding,
the head's gap and the plate's height — carry the multiplier as well. Everything
else on a face is already a ratio of the ramp by P7's law, so those three were the
whole of the remainder.

Measured at a 1706px window: micro 13.87 · small 16.37 · body 19.25 · lead 20.98
· head 22.91 · display 25.02. Six per cent, uniform; every ratio A4 set survives.

### (c) Hunter Root's text — every surface, verified against the vault

**THE COUNT WAS RE-DERIVED, NOT CARRIED.** Off `src/data/exhibits/hunter_root.json`
through `buildSpineFromArtifacts`, this round: **9 containers · 93 track rows ·
78 carrying a `song:` slug · and 91 DISTINCT TITLES.**

**W1's OWN FIX CARRIED THE DEFECT IT WAS CURING, ONE LAYER DOWN.** W1 struck *"78
songs"* because 78 counted SLUGS and was printed as a count of SONGS. The
sentence it replaced it with reads *"One of two Hunter Root songs surfaced in this
wing, out of ninety-three…"* — and 93 is a count of **track rows**. *Brain Cell*
and *Same Page* each sit on two records (a 2016 ReverbNation recording on Run
With The Hunt, a 2019 Bandcamp studio recording on Life Inside A Wheel): two
files, two years, one song, counted twice.

**NO SECOND NUMBER ENTERS THE BUILDING.** The fix is the UNIT, not the figure —
the line now names *tracks*, in the tombstone's own words, so the whole card says
one thing.

**AND THEN THE SURFACE NOBODY HAD LOOKED AT.** `/hr/archive` is a live route, and
it was not carrying a stale figure — **it was carrying a different catalogue.**
`HrArchive.jsx` held a hand-typed ALBUMS array, described in `CLAUDE.md` as "a
title-only mirror of the spine" and kept in step by nothing:

| what it printed | what the vault holds |
|---|---|
| six containers | **nine** — Run With The Hunt (15) and the Phone Recordings EP (5) were not on the page at all |
| a "Singles" strip of ONE title, Chase The Dragon | **SINGLES & RARITIES, seven tracks** |
| *Shapeshifter* on Life Inside A Wheel; *Wildfire* on Mimicking the Sun; *Cookin' in the Bathroom* and *A Pot Song* on Crooked Home | all four are SINGLES & RARITIES tracks |
| They Finally Cracked Me ending *Soul Sucker · The Shade* | *Depresto · Puzzles* |
| *"6 albums · 71 songs · 2018 – 2025"* | nine, ninety-three, and a span starting in 2017 |

**IT IS NOT CORRECTED — IT IS DELETED.** A corrected mirror is a mirror that will
drift again; this one drifted through six museum-wide figure sweeps without
anybody noticing, because nothing links a copy to its source. The array is gone
and the page reads the spine: MediaVault → the export →
`buildSpineFromArtifacts` → the page. `src/data/artists/hunter-root-catalogue.js`
is the one declaration both `/hr` and `/hr/archive` now read.

The header is rebuilt with every figure counted off the spine, and **the year
range is struck rather than corrected**: it was wrong at both ends, but the reason
it goes is that two of the nine containers carry no year at all, so any flat span
is a claim about holdings the museum cannot date. Each card prints its own year
and the two undated ones print an em dash.

**WHAT WAS CHECKED AND FOUND RIGHT**, so it is on the record rather than
re-checked next round: seven records + an EP + a set (by their own titles) ·
*two songs surfaced here* · *accessioned from April 2026* (earliest accession
`MV-HR-20260405-*`) · *sixteen releases on his Bandcamp* · Crooked Home **2025**
and Arkansas **2023** · *"Half of Crooked Home is about his brother"*
(`MV-HR-20260707-068`) · *gone at twenty-seven* (`-001`, `-037`) · the ’94 sleeve
being a childhood photo of Hunter and Nick (`-055`) · the plate caption's
**September 2024**, which is `post_date: "2024-09-19"` on the artifact and is
NOT an invention.

---

## D4 · THE GIFT SHOP'S TOP ROW

**MIKE:** *"the top-billed tile OWNS THE TOP ROW, centered. All tiles stay the
same size."*

This is the third setting of one law and it is the one that separates its halves
cleanly. P11/B1/J3 said who **leads**. S1 said nobody is **big**. What was left
over is that leading looked like nothing at all — the billed tile was simply the
first cell of a two-up grid, which on a five-tile page is indistinguishable from
alphabetical order. **A row of its own says LEAD without saying LARGER.**

**THE COLUMN COUNT IS NOW EXPLICIT AND THAT IS THE WHOLE MECHANISM.**
`repeat(auto-fit, minmax(min(420px,100%),1fr))` is unimprovable until you have to
ask it HOW WIDE ONE COLUMN IS, and centring a tile at exactly one column's width
is that question. `--gs-cols` answers it, so the billed tile spans the row and
takes one column's width back:
`width: calc((100% - (cols - 1) × gap) / cols)`. **At one column that is 100%**,
so the rule needs no mobile branch.

**THE BREAKPOINT IS NOT A NEW DECISION.** `.gift-shop` is max-width 960 with
1.5rem side padding, so two 420px floors plus a 22px gap need 862px of content and
910px of viewport — the exact width `auto-fit` was already switching at.

**MEASURED ON THE BUILT BUNDLE:** five tiles, **445×298 every one of them**;
the billed tile at x=386 in a 912px grid starting at x=152 — centre 608.5 against
the grid's 608. At one column: all five 912 wide at x=152.

---

## D5 · THE UNIT SPILLS OUT OF THE OVAL

**MIKE:** *"let the unit spill out of the oval, the way the Weird.Baby logo does.
Apply to both machines. NIAC shows the ENTIRE MAINFRAME."*

**THE MARK WAS NOT BEING COPIED PROPERLY AND THAT IS THE FINDING.** Look at
`WeirdBaby_PhotoID.png`: the ring is drawn BEHIND the baby, and the head comes out
of the top of it and the hands out of the bottom. Every unit badge until now was
masked INTO the disc — a porthole with a machine inside it, which is the opposite
arrangement wearing the same circle. **The ring is drawn FIRST now and the unit
stands over it.** The disc did not move — same diameter, same top, same stroke;
the ORDER moved.

The two numbers are set by the word, not by taste: `SPILL_FOOT` lands the unit's
bottom 28px clear of the model number's box, because the lettering is the one
thing on this cover that may not be crossed.

**THE TWO MACHINES GET TWO TREATMENTS AND THE REASON IS THE SOURCE, NOT THE
EFFORT.**

- **MGK-VIIIp** is a hard-edged dark body on a light counter, so it gets a real
  photographic **silhouette**. The threshold is 70 because the cast shadow bottoms
  out at 66; the bright ABEAL plate comes back as a filled interior hole rather
  than as a threshold exception; an opening severs the shadow where it touches the
  base. It is the cover the instruction describes.
- **MGK-NIAC rides over the ring AS A PLATE.** P7 cut that frame at the cabinet's
  own bounding box, so there is no background in it to remove. **Three mattes were
  rendered and every one damaged the object:** a luminance cut ate half the cabinet
  (the grille and the wall are one tone), a chroma cut took the red output row
  along with the wooden floor, and a per-column floor-line cut clipped the LED bank
  and left the mains adapter hanging. A crop to the cabinet body above the feet
  composes better than any of them — **and throws the feet away, which is the
  instruction's other half.** "The entire mainframe" is not something Ops trades
  for a nicer edge. A true cut-out here wants a frame with air around the machine:
  one photograph, and it is Mike's.

**THE WHOLE-CABINET FRAME WAS ALREADY IN PLACE** — P7 cut it from 00:58 of the
2021 build video yesterday. This round did not re-find it; it changed how it is
worn.

The **Portal** keeps the masked-disc treatment. It is not a machine — it is a
door into one — and its badge's whole subject is a round lit aperture. A round
thing masked to a round hole is the composition, not a compromise with one.

---

## D6 · M61 RULED — THE MANUAL STAYS OFFLINE

**MIKE:** *"the manual stays OFFLINE until real pages exist. The viewer is built
and stays built; nothing is published from the 61-page structure issue. Same
ruling as the single struck plate, one scale up."*

**Nothing shipped, which is the ruling working.** `RobotsExhibitFlow`'s reader
still pages, wraps, counts frames and toggles Fit ↔ Magnify; `reel.plates` is
still `[]`; the face still says *No pages on file*. M61 closes as **RULED — HELD**.

The row it rested on is unchanged: P2 struck ONE page of that document from that
same face on the grounds that it was *the museum admitting it had not written the
manual, wearing a fiction as cover*. Publishing 61 pages that read
`[ TEXT REQUIRED ]` is that ruling reversed at 61× the scale. **B8 stands beside
it** — the artifact is a PHOTOGRAPH of a printed sheet, never a rendering — so
even written pages still need his printer and his camera (art register P2).

---

## D7 · M62 RULED — OPTION A, AND THE FOUNDATION IS A WING

**MIKE:** *"OPTION A — teach the album shape to carry the Foundation's three
bespoke objects. Then give the Foundation albums and a tracklist like every other
wing, with all three mechanisms intact. Nothing of Mike's specified machinery is
lost to the port."*

**What was at stake, which is why M62 existed rather than being built on the day.**
`/foundation` was a SHEET carrying three objects the face model had no equivalent
for, two of them mechanisms he specified himself: the **$0.00 ACCOUNT CARD** (the
room's only visual hook, and typographic rather than a picture), the **REGISTER**
whose LIVE / NOT BUILT column reads live off `reveal/ledger.json`, and the
**LEDGER**.

**The face model learned all three.** `face.account`, `face.register` and
`face.ledger`, mounted on the presence of a field exactly the way
`InstrumentPanel` is — so a wing declaring none renders none and `Exhibit.jsx`
learns no wing-specific content.

**THE MARKUP AND THE STYLESHEET WERE MOVED, NOT REWRITTEN.** Every element, class
name and `data-` attribute in `src/routes/exhibit/FoundationObjects.jsx` is what
the sheet rendered, and it reads the same `Foundation.css`. That is the cheapest
possible guarantee that nothing was lost in the move: **if a rule still matches,
the object still looks like itself.** The reveal-ledger wiring crossed untouched —
flipping `channel.qr` to LIVE still changes this wing and no other file.

**The wing:** three albums in his order — **Ledger** (The account · The ledger),
**FAQ** (Questions), **Contribute** (The register) — with three typographic covers
on the robots wing's Template B geometry. The covers deliberately do NOT carry the
WB mark: three albums in one deck wearing the same photograph is M30's defect
multiplied by three and sitting side by side.

**THE ADDRESS DID NOT MOVE.** Same URL, same words, same room; only the container
changed, so nothing shared or linked breaks. `/money` → `/foundation` still runs.

### Three things the LAP caught that no gate could

1. **THE BILLIONAIRES QUESTION WAS PRINTING WITH SILENCE UNDER IT.** The face
   model's entry filter is an OR — a title may survive its own line, which
   /robots' FAQ depends on (M57) — and the sheet's was an AND. So an answer F3
   deliberately marked in EVERY sentence, on Mike's ruling that the ideas are good
   and the voice is his to write, came back as a published question with nothing
   beneath it. **On the one page whose entire subject is honesty.** The filter now
   drops an entry that HAD a body and lost all of it; a title-only entry, which
   never declared one, is untouched. 12 entries → **11**, and /foundation stops
   asking about billionaires again.
2. **A PLAYER BAR ON A WING WITH NOTHING TO PLAY.** The port brought the transport
   in with the album shape: five controls at the foot of a room that holds no
   audio and no video. The museum's own STAGE doctrine already forbids it — *a
   transport appears only where the setting has purpose for it* — and already
   built the opt-out. `playerBar: false`.
3. **THE OBJECTS DREW ABOVE THEIR OWN HEADING.** First placement was outside the
   stage/flat frame, so the register drew at the top of the viewer and the face's
   title came out a thousand pixels below it. An object is content and content
   goes under the title, beside `bill` and `tombstone`.

### Two calls made in the port, both stated rather than assumed

- **The bar carries "The Foundation"**, which is the sheet's own choice carried
  across. It is also the difference between fitting and not: C36 measured *Other
  Music Worth A Listen* at 26 characters with SIX PIXELS of slack at 390px, and
  *The Weird.Baby Foundation* is 25.
- **The Gift Shop exit is hidden.** The sheet had no shop link anywhere on it; the
  wing's bar would have added one, and a commercial door in the title bar of the
  room whose whole subject is that money does not stop here fails the first of the
  TONE RULING's four tests. The shop is not hidden from the room's CONTENT — it is
  the first row of the register.

### What the port cost, named

The FAQ was an ACCORDION — native `<details>`, every question visible, its answer
opening in place. The face model has no accordion, so the questions render as an
entry list with **every answer open**. That is more readable rather than less by
the museum's own no-hidden-information law (M1), and it is what /robots' FAQ face
already does — which is the whole of "like every other wing". Struck with it:
`.fnd-root`, the `html[data-room="foundation"]` page ground, `.fnd-sep`, and the
array-answer padding rule, all four dead the moment the sheet was.

---

## D8 · THE REGISTER, WORKED

**Landed:** [C41](OPEN_ACTIONS.md#c41) — `docs/SURFACING_LOG.md` was stamping
its rows in **UTC** while every other date in this repository is local, so a
reading taken at 21:2x on 2026-08-05 was logged as 2026-08-06. One line in
`tools/surfacing.mjs`. **The two rows already written are NOT touched** — the file's
own header says a measurement somebody adjusted is not a measurement, and this
line is why the rows after them differ.

Closed by the work above: **M53** (D3a) · **M61** (D6, ruled HELD) · **M62** (D7).

**Everything else in the register is genuinely waiting on Mike**, and §0 of
`docs/OPEN_ACTIONS.md` now states, for each remaining row, exactly what he must
supply. Nothing is pending on Ops.

Three items were looked at and deliberately NOT landed, each for a stated reason:

- **[C34]** click-to-load embeds. It is Ops' recommendation and it is not a
  ruling — **[M37]** asks him for a letter, and building B while A and C are on
  the table is Ops answering a question it put to him.
- **[C36]** `/wal`'s title bar at 390px. The row itself offers three ways out
  (shorten, wrap, drop the brand); picking one is a design call.
- **[C17]** the four pre-existing lint errors. Its own row says each needs
  semantic review, not a mechanical fix, and this round's diff is large enough
  already.

---

## D9 · THE REGISTER'S CLOSING STATE

### Closed this round

| row | how |
|---|---|
| **M53** | the poster's `papa` note is one marked sentence; the sourcing claim is off the glass, **and the same defect was found and fixed on a second face** |
| **M61** | **RULED — HELD.** The manual stays offline; the viewer is built and stays built |
| **M62** | **DONE.** Option A built; the Foundation is a wing with all three mechanisms intact |
| **C41** | the surfacing log stamps local dates |

### Opened this round

| row | what it is | waits on |
|---|---|---|
| **M66** | the robots front desk answers the contact question with the bare address while the booth carries his full sentence — a divergent copy, and that face is his verbatim | **Mike** |
| **M67** | the two machines' FAQ blurbs and *"Does it still work?"* answers differ in wording, not only in noun | **Mike** |
| **M68** | `og:description` and `twitter:description` are two different descriptions of one museum | **Mike** |
| **M69** | Hunter Root's holdings sentence has two wordings, on his card and on the poster; both are correct | **Mike** |
| **M70** | the Foundation's FAQ is an entry list now and its accordion is gone — a consequence of the port he ordered, reported rather than absorbed | **Mike** |

### A miss named as a miss

**W1 (2026-08-05) reported closing "all six sites" of M50 and there was a seventh
that nobody had looked at.** `/hr/archive` is a live route printing a
hand-typed catalogue that had drifted two whole records, four misfiled songs and
three wrong figures from the vault, and it was not in the six because the sweep
looked for FIGURES and this page was carrying a whole second COPY. That is D1's
defect and M50's defect turning out to be the same defect, and it is written here
as a miss rather than quietly landed.

**And one of this round's own fixes carried the error it was fixing:** W1 struck
*"78 songs"* for counting slugs and printing songs, and replaced it with a line
that counts track rows and prints songs. Same class, one round later, by the
round that had just named the class.

---

## FILES

**New:** `src/data/house-copy.js` · `src/data/artists/foundation.js` ·
`src/data/artists/hunter-root-catalogue.js` · `src/lib/foundation-state.js` ·
`src/routes/exhibit/FoundationObjects.jsx` ·
`src/routes/foundation/FoundationSpine.jsx` · `tools/make_foundation_covers.py` ·
`public/images/foundation/{ledger,faq,contribute}-cover.png`

**Deleted:** `src/routes/Foundation.jsx` (the sheet)

**Regenerated:** `public/robots/art/mgk-niac-cover.png` ·
`public/robots/art/mgk-viiip-cover.png`
