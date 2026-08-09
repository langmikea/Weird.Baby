# THE RECORD LANDING + THE ALBUM ART — round log, 2026-08-09

**Seven instructions (L1–L7), all seven done.**

Gates: lint **11 errors / 9 warnings = baseline** · build **green** ·
**launch build green** · `provenance:gate` **PASS** · `reveal:check` **PASS** ·
`parity:gate` **PASS, 4 shared · 0 divergences** · `instory:gate` **PASS** ·
`assets:orphans` **0 judged, 0 unjudged** · `reveal:day` **nothing to move** ·
**the lap RAN at 390px and 1228px** on five routes, page overflow **0**, broken
images **0**, console errors **0** · `npm run lap:clean` done.

---

## §0 — THE SOURCE, QUOTED

Every string landed this round is one of two things, and both are quoted here in
full because every register row added below cites this section.

**MIKE'S OWN WRITING** is `docs/dictation-20260807/wb-rescue-2026-08-09.json`,
key `wb.worksheet.2026-08-07` — 14 answers, 4,103 characters, rescued out of his
browser on 2026-08-09 and now also at
`docs/dictation-20260807/answers.json`. It is committed, so the quotation and the
source are the same artefact and this section does not restate it.

**OPS' THREE ANSWERS** are Mike's own round instruction of 2026-08-09, carried
word for word:

> - "Get me some examples from the manual" -> The manual is 61 pages of
>   structure; every position reads [ TEXT REQUIRED ]. There are no examples yet.
>   Ops is writing it; Mike reviews and edits.
> - "Need name of device" -> The first four devices HAVE NO NAMES YET. What
>   exists: the personas (CEO, Informer, Gambler, Everyman) and unit numbers
>   (-02, -07, -09). Whether the personas ARE the four units, or the units carry
>   their own names, is unruled and is Mike's call.
> - "The most common words Robots expects to use" -> from the firmware and the
>   twin's own screens: PORTAL, FEED, LATCH, ARM, BOOT, POST, BIST, SEG,
>   CHECKSUM, ACK, SYN, AUX LINK, MEM TEST, VIDEO, NOMINAL, LISTENING, ERROR,
>   READY, STANDBY, SANDBOX.

His ruling on landing all of it:

> "LAND ALL 14 ANSWERS, INCLUDING MIKE'S NOTES TO OPS. He needs it all in one
> place. Days 1, 2 and 3 go onto the wall and his bracketed notes and ??
> placeholders go WITH them. Nothing stripped, nothing smoothed, nothing filled."

---

## §1 — WHAT LANDED (L1, L3, L4)

**Five entries, Records 001–005, dated from the one epoch.**

| | date | headline | index line | sections | his notes | Ops answers |
|---|---|---|---|---|---|---|
| **001** | 2026-08-17 Mon | his | *Ops', approved* | 2 | 5 | 3 |
| **002** | 2026-08-18 Tue | his | his | 2 | — | — |
| **003** | 2026-08-19 Wed | his | his | 2 | 3 | 2 |
| **004** | 2026-08-20 Thu | **none** | none | 1 | — | — |
| **005** | 2026-08-21 Fri | **none** | none | 1 | — | — |

**Record 013 is untouched** — not its number, not a character.

### The dates are one constant, still

`recordDay(n)` counts from `RECORD_EPOCH`. Five literals would be five things a
slip has to find; day 1 IS the epoch by construction rather than by agreement.
UTC arithmetic deliberately — a local-midnight `Date` rolls the day backwards
west of Greenwich, which is how a dateline reads Sunday.

### L3: Record 001's body is his longer draft

The worksheet version supersedes what was on the wall. What changed: *"**The**
data continues to be received"*; the Friday block now ends *"we still did not
know **if the data was useful. The team was more intrigued than concerned.**"*;
and two whole blocks arrive — **SATURDAY DAY(-2) and SUNDAY DAY(-1)** and
**MONDAY DAY(0) - Weird.Baby Go-Live!**. His earlier *"was made made"* is
*"was made"* in this draft, so that is what ships: **the doubled word was his and
so is the correction.** The two spaces in `Full containment  was made` and in
`=  86%` are in the data.

**The index line is the one string in 001 that is not his** — Ops' sentence,
approved on 2026-08-08, still filed RESTATED, still not to be re-marked MIKE.

### THE ENTRIES ARE GENERATED, NOT RETYPED

`tools/dictation/emit-record-entries.mjs` cuts the rescued boxes into sections by
the worksheet's own documented rule (a capitals line starts a section) and emits
the JS. `--verify` strips the paragraphing and the markers back out and compares
to the rescued string:

```
EVERY BOX ROUND-TRIPS: his characters are unchanged.
```

There is no transcription step for a character to go missing in — which is the
lesson of Record 001's landing, applied one stage earlier.

---

## §2 — HIS NOTES IN RED, OPS' ANSWERS IN BLUE (L2, L5)

**Eight `[data-not-ux]` blocks in Record 001, measured on the built bundle at
390px: 5 red, 3 blue, `rgb(210,28,28)` and `rgb(22,104,210)`.**

`[PAPA]` could not do this, and that is why there are two schemes. A `[PAPA]`
sentence is **lifted out** of the copy into a block beneath the page (N3) — the
right shape for a note that must never be mistaken for copy. These must stay
**exactly where he wrote them**, because a question and its answer four screens
apart is not an answer. So they are whole-paragraph marks, `[MIKE-NOTE]` and
`[OPS]`, and the mark never prints: `devBody` takes it off, so the characters
drawn are the characters he typed.

**Blue for Ops is not decoration.** The one thing that must never happen is Ops'
sentence being read next year as something Mike wrote — the same failure the
gold/blue rails on the dictation pages exist to prevent, one surface further in.

### L5 — three mechanisms, and the third cannot be reasoned wrong

1. `RecordEntry.jsx` does not render a marked paragraph when `launched()`.
2. `wb-ops-notes` empties the literal in the **source** at launch.
3. **`wb-dev-mark-guard` reads the launch build's own output and fails on a hit.**

Parts 1 and 2 are the pair this house has shipped past four times — a runtime
filter stops the render and ships the material (R5's 153 vault URLs, H1's ledger,
V1's twenty-six addresses, N3's 35 markers). Part 3 is inside the one command
that produces the thing being checked, so a launch bundle carrying a marker
cannot come into existence.

**Proved by breaking it.** With the source strip removed, `npm run build:launch`
fails:

```
DEVELOPMENT MARKERS IN A LAUNCH BUNDLE — 13 hit(s). …
  assets/index-….js  [MIKE-NOTE]  …[MIKE-NOTE] Robot, portal, ??, ?? (Claude - Get me some exa…
  assets/index-….js  [OPS]        …[OPS] The manual is 61 pages of structure; every position re…
```

**And measured on the real launch bundle: zero literal markers, zero of his note
text, and his story text still there.** The one residue is `DEV_MARK` itself —
the regex that removes them, which cannot remove itself. That is a rule, not a
note, and it is the same residue `PAPA_MARK` leaves.

**THE ENTRIES READ DIFFERENTLY IN THE TWO STAGES, AND THAT IS HIS INSTRUCTION
RATHER THAN A DEFECT.** N3's principle is that body copy is identical in both
stages so the page Mike reads is the page that ships; these paragraphs are the
declared exception, because he ruled the notes onto the wall for now.

---

## §3 — THE ALBUM ART (L6)

**The Robots cover is his file**, installed at
`public/robots/art/wbr-cover-logo.png` (1200×1200), replacing the previous one.
Both source files were in `OneDrive\Desktop - Laptop\ART\`, not Downloads, and
under different names — `NEW Robots.png` and `Template (prelim).png`.

### Measured, as instructed, not eyeballed

| | |
|---|---|
| ground | `rgb(217,213,202)` — identical in both his files |
| border | x/y 52..1147, 4px, `rgb(33,31,28)` — identical in both |
| TITLE ink | rows 913..1027 (cap height **115**), x 242..958, centred 600 |
| RULE | rows 1061..1064 (4px), x 300..900 |
| SUBTITLE ink | rows 1089..1110 (height 22), x 203..998, `rgb(87,84,77)` |

**The faces were identified by fitting rather than by eye** — each candidate
rendered at the size that reproduces the measured cap height, tracked to the
measured ink width, scored against the real pixels:

```
Georgia 157 / track 17.0   IoU 0.945   <- the title
Georgia Pro 158            IoU 0.928
Times 166                  IoU 0.712
Bodoni MT 168              IoU 0.492
Courier New 39 / 13.8      IoU 0.624   <- the subtitle
```

That is the **same Georgia + Courier pairing** `make_unit_covers.py` already
uses. What moved on his new cover is the vertical position, not the setting: the
rule sits at 1061 where the generated covers put it at 1024.

### The circle is closed with its own ink

A geometric ellipse beside three hand-drawn arcs reads as a repair, so the gaps
are filled by **rotating the existing arcs** about the fitted centre. The ink in
the finished ring is the ink he drew — same brush, same weight variation, same
tapered ends. Fitted from the template's own 25,488 arc pixels: centre
(599.8, 517.9), radius 321.7, stroke ~39, gaps at 16–45°, 113–161°, 252–306°.
**16,608 arc pixels painted in**, with six degrees of overlap at each join so the
tapers are buried rather than left nose to nose.

**No photograph, on both.** Subtitle `WEIRD.BABY ROBOTS`, which is the two
existing machine covers' own sub-line and not a new string.

### One collision, reported rather than absorbed

`MGK-VIIIp` has a descender and `ROBOTS` does not, so his measured rule position
sits where the *p*'s tail lands. `make_unit_covers.py` met this and dropped its
rule 14px; **this file does not move the rule** — "exactly the positions the
Robots cover uses" — and prints the clearance instead:

```
mgk-niac-cover.png    CLEARANCE to the rule : 36px
mgk-viiip-cover.png   CLEARANCE to the rule : 5px  (tight)
```

Five pixels, not touching. Moving the rule is his call. Register `L-d`.

---

## §4 — THE FINDINGS

### (a) Two entries landed and drew nothing at all

`scrubFace`'s entry filter kept an entry if it had a title, a `line` or `lines`.
**It did not know about `sections`.** Records 004 and 005 have no headline (he
wrote none) and no `line` — their entire body is sections — so both evaluated to
*no title and no body*, were filtered out, and **never drew an index row.** The
data was right, the ledger had rows for them, every gate passed, and the Record
showed four entries where six exist.

**Only the lap saw it**: six rows expected in the index, four counted. It is
`S-c`'s shape one floor down — a renderer that does not know about a field it was
not told about. Fixed; the index now draws all six.

### (b) The prune hazard fired again, exactly as §9 describes

Replacing 001's body made four register rows stale. Pruning them broke the
approved index line's `RESTATED` chain, which pointed at two of them. Repointed
onto the **same two paragraphs in the draft that replaced them** — a better chain
than the one that broke, because those are the sentences on the glass. Procedure
followed in order: check anchors → prune against a copy → repoint → re-gate.

**And the register itself nearly lost its own structure:** the rows live under
`.entries`, and a first pass wrote 43 of them at the top level. That is invisible
to a reader and fatal to the gate; caught by the gate, then verified row by row
— **43 added, 0 lost, 0 pre-existing rows changed, `generated` and the invention
ceiling intact.**

### (c) Two headline-less entries are exempted BY NAME

`reveal:check` enforces R3's *every index row gets a headline*. He wrote none for
days 4 and 5 and ruled *do not fill a gap*, so the two are listed by number
rather than the rule being loosened — **a third headline-less entry still fails.**
What it costs is on the glass: both draw an index row showing only `004 20 AUG 26`
and `005 21 AUG 26`. Register `L-c`.

### (d) The four new entries needed a transfer class

`transfers.mjs` refused the build until they had one — the table working. All
four are **BLAST**, on the reading `record.001` already carries: their subject is
the week-0 event. 003 is the one worth reading twice — it creates
`/Robots/MGK-VIIIp` out of material that arrived in the pre-launch onslaught,
which is the same week-0 arrival, not a PACKAGE and not a TRANSMISSION.

---

## §5 — WHAT WAS TOUCHED

**New:** `tools/make_template_covers.py` ·
`tools/dictation/emit-record-entries.mjs` ·
`public/held/robots/art/mgk-niac-cover.png` and `mgk-viiip-cover.png` (rebuilt) ·
`docs/dictation-20260807/answers.json`.

**Art:** `public/robots/art/wbr-cover-logo.png` — his new file.

**Code:** `src/data/artists/robots.js` (five entries, `recordDay`) ·
`src/lib/visitor-prose.js` (the two marks) ·
`src/routes/exhibit/RecordEntry.jsx` (the inline pair) ·
`src/routes/exhibit/Exhibit.jsx` (the entry filter) · `src/index.css` (the two
colours) · `vite.config.js` (the source strip and the launch guard) ·
`reveal/transfers.mjs` · `tools/reveal-ledger.mjs`.

**Data:** `provenance/register.json` (+43 rows, 4 pruned, 1 chain repointed) ·
`provenance/asset-table.json` (rescanned) · `reveal/ledger.json`.
