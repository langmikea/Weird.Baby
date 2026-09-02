# THE WING NAMES TAKE THE BACKSLASH — 2026-08-26

**Built from `b56cc0e`, clean tree. Nothing committed, nothing pushed, nothing
deployed.** The census this round acts on is in the same session's report; its
finding was **eight forms of the Robots wing's name in use at once**, and the
board and the door disagreeing on four of six rooms.

---

## 0 · THE RULING

Mike, verbatim, on how the museum refers to itself:

> Lobby Directory (and everywhere) - this is how to refer to Weird.Baby:
> Weird.Baby / Weird.Baby \Robots / Weird.Baby \Music / Weird.Baby \Foundation /
> etc. / \Robots / \Music / \Foundation / etc.

Ruled the same day, on the census:

1. **BACKSLASH.** The full form is `Weird.Baby \Wing`; the short form is `\Wing`.
   **Including** `weird-baby.js`'s Founder row, the one string of his the census
   surfaced — *"It becomes backslashes. RECORD IT AS HIS RULING, NOT A HOUSE
   EDIT — Ops is not restyling his words; he changed them."*
2. **THE TITLE BARS CARRY IT TOO** — `\ROBOTS`, `\MUSIC`, `\FOUNDATION`, and the
   rest. *"Measure /wal at 390px before and after."*
3. **/wal TAKES THE HOUSE NAME** — `Weird.Baby \Worth a Listen`, his lowercase `a`.

---

## 1 · WHAT IS ON THE GLASS NOW — measured on the served page, not read off source

Dev server, `http://localhost:5173`.

| surface | before | after |
|---|---|---|
| Lobby board · Robots | `Weird.Baby Robots` | **`Weird.Baby \Robots`** |
| Lobby board · Music | `Weird.Baby Music` | **`Weird.Baby \Music`** |
| Lobby board · WAL | `Other Music Worth a Listen` | **`Weird.Baby \Worth a Listen`** |
| Lobby board · Foundation | `Weird.Baby Foundation` | **`Weird.Baby \Foundation`** |
| `/robots` bar | `ROBOTS` | **`\ROBOTS`** |
| `/wb` bar | `WEIRD.BABY` | **`\MUSIC`** |
| `/wal` bar | `WORTH A LISTEN` | **`\WORTH A LISTEN`** |
| `/foundation` bar | `THE FOUNDATION` | **`\FOUNDATION`** |
| `/robots` FAQ subtitle | `WEIRD.BABY ROBOTS` | **`WEIRD.BABY \ROBOTS`** |
| `/wb` FAQ subtitle | `WEIRD.BABY` | **`WEIRD.BABY \MUSIC`** |
| `/wal` FAQ subtitle | `WORTH A LISTEN` | **`WEIRD.BABY \WORTH A LISTEN`** |
| `/foundation` FAQ subtitle | `THE WEIRD.BABY FOUNDATION` | **`WEIRD.BABY \FOUNDATION`** |
| `/robots` album banner | `Weird.Baby Robots` | **`Weird.Baby \Robots`** |
| `/wb` face subtitle + footer | `WEIRD.BABY` · `WEIRD.BABY · ABOUT THE ARTIST` | **`WEIRD.BABY \MUSIC` (both)** |
| `/wal` face subtitle + 3 footers | `WORTH A LISTEN` · `WORTH A LISTEN · <artist>` · `WORTH A LISTEN · WEIRD.BABY` | **`WEIRD.BABY \WORTH A LISTEN` (all)** |
| `/foundation` — six face subtitles | `THE WEIRD.BABY FOUNDATION` | **`WEIRD.BABY \FOUNDATION`** |
| `/wb` Founder row | `Weird.Baby /Foundation /Robots /Music - August 16, 2026` | **`Weird.Baby \Foundation \Robots \Music - August 16, 2026`** |

**Eight forms of Robots are now three, and all three are one shape:**
`Weird.Baby \Robots` (board, album) · `\ROBOTS` (bar) · `WEIRD.BABY \ROBOTS`
(FAQ). The Record's four in-story forms are untouched — see §5.

---

## 2 · THE /wal MEASUREMENT HE ASKED FOR

Dev server, **true 390px viewport**, gap measured between the text boxes with a
Range over the glyphs.

| route | room, before | gap L | gap R | room, after | gap L | gap R | Δ |
|---|---|---:|---:|---|---:|---:|---:|
| `/wal` | `Worth A Listen` | **21.4** | 27.8 | `\Worth a Listen` | **17.9** | 24.3 | **−3.5** |
| `/robots` | `Robots` | 57.4 | 63.8 | `\Robots` | 53.9 | 60.3 | −3.5 |
| `/wb` | `Weird.Baby` | 39.5 | 45.9 | `\Music` | 60.5 | 66.9 | **+21.0** |
| `/foundation` | `The Foundation` | 18.3 | 56.1 | `\Foundation` | 33.2 | 71.0 | **+14.9** |

**It does not overflow.** Not ellipsised, no document overflow, on any of the
four. `/wal` cost 3.5px a side and is still the floor at 17.9px.

**AND C36's OWN NUMBER WAS STALE BEFORE THIS ROUND TOUCHED IT.** Its `6px` was
measured 2026-08-05 in a 373px-content iframe rig and **before** the 2026-08-17b
ruling took every wing's title from 1.2rem to 1.45rem. At a true 390px today the
same bar reads 21.4px. **The finding stands and the number was wrong**; C36 now
carries both readings and stays open.

---

## 3 · A DEFECT OF MY OWN, CAUGHT BY THE RIGHT ORACLE

**`"\WORTH A LISTEN"` IS A LEGAL JS STRING WHOSE VALUE IS `WORTH A LISTEN`.**
`\W` is not a recognised escape, so JavaScript silently drops the backslash. Ten
literals landed that way and **the source read correctly in every editor and
every grep.** A second pass then over-corrected six of them to four backslashes,
which renders two.

**A SUBSTRING SCAN OF THE BUILT BUNDLE SAID PASS ON THE BROKEN ONES**, because
`\\WORTH` is a substring of `\\\\WORTH`. That probe was wrong in the direction
that does not announce itself — §0's own rule, arriving from inside.

**WHAT SETTLED IT** was an audit that parses every string literal under `src/`
containing a backslash and a wing word and reports its **runtime** value:
**21 literals, every one exactly one backslash.** Its three FAILs are the probe,
not the site — two are `robots-record.js`'s `\n` newlines and one is the Founder
row's three wings.

**The general form is worth keeping: a backslash in a JS string literal cannot
be checked by reading it. Evaluate it.**

---

## 4 · THE REGISTER

**16 rows written, one at a time. The backfill was not re-run.**

- **14 declared MIKE**, sourced to today's ruling quoted in full — every string
  whose entire content is a wing name.
- **2 declared HOUSE** — `WEIRD.BABY \MUSIC · ABOUT THE ARTIST` and
  `WEIRD.BABY \WORTH A LISTEN · {}`. A wing name inside an Ops-assembled frame;
  the frame is chrome and did not move.

**38 ROWS PRUNED, AND ONLY 17 OF THEM WERE THIS ROUND'S.** Inbound `r` chains
into the doomed set were checked first and were **zero**, so §8's prune hazard
did not fire. The other **21 are pre-existing register debt** and are named here
rather than deleted quietly:

- `portal.js` (17): `FEED CONTROL` · `MGK-NIAC` · `This feed is not available.` ·
  `AUTO MAINT` · `NON-INTERRUPTIBLE` · `Maintenance is running. The machine will
  not be hurried.` · `amber` · `AT PROMPT` · `BOOTS + UPDATES DONE` · `The unit
  is not at its prompt.` · `warm` · `no seeded feed on file — …` ·
  `/held/robots/twin.html` · `Portal` · `MODEL NO.` · `TYPE 8p` · `SER. NO.` ·
  `DATE` · `MGK-VIIIp — the close-up` · `MGK-VIIIp (zoom)`
- `Exhibit.jsx` (3): `roll up` · `roll down` · `antenna`

Each was verified absent from source before accepting the prune. They are the
residue of the ONE SURFACE round of 2026-08-26, whose log records *"15 added, 1
pruned"* — it added correctly and under-pruned. **Register rows 2075 → 2053**,
which `docs:numbers:gate` then confirmed against its own published figure.

---

## 5 · WHAT WAS DELIBERATELY NOT TOUCHED

**The line Ops drew: SIGNAGE changes, PROSE is flagged.** A label whose job is to
name the room took the ruling; a sentence that mentions a wing while saying
something else did not.

- **THE RECORD'S FOUR IN-STORY FORMS.** `W.B/Robots` (001) · `Robots - Nothing to
  Report` (003) · `/Robots ZIP File Cracked` (004) · `The Portal is accessible
  via the Robots Exhibit` (005). All classed MIKE, all inside a fictional 1945
  operations log, governed by **Doctrine 21 — EVERYTHING IN THE FORM IS STORY**.
  `/Robots` there reads as a path because in the story it *is* one.
  **`docs/canon/09-PUBLISHED.md`'s first line is that a published entry is
  FROZEN**, and its own clock puts `RECORD_EPOCH` at 2026-08-31 — five days out,
  which would make all five SCHEDULED and editable. **Measured today: all five
  are visible on `https://weird.baby`.** That conflict is reported, not resolved.
  He named the board, the door, the FAQ subtitle and the Founder row; he did not
  name the Record.
- **The share card / search description** — one sentence across three tags, his,
  ruled 2026-08-17, lowercase generic (`Robots arriving one day at a time`).
  Not a wing name.
- **`/wb`'s artist blurb** — *"And Robots!"*, *"And Robots."* Prose.
- **The Foundation's incoming register** — `The gift shop` (his, lowercase) and
  the line *"Weird.Baby Music is Papa's own recordings…"*. Prose in his voice.
  **The second one now disagrees with the board**, and it is flagged below.
- **The Gift Shop and the Information Booth.** See §6.
- **`/foundation`'s first album, still titled `The Foundation`** — a section
  alongside `The Ledger` and `Contribute`, not the wing's sleeve. A visitor reads
  `\FOUNDATION` on the bar above `The Foundation` on the banner.
- **The nine PNGs.** See §7.

---

## 6 · THE ONE ASSUMPTION, FLAGGED FOR HIS WORD

**"Every wing takes it" was read as the four EXHIBIT wings. The Gift Shop and
the Information Booth were left alone.**

The evidence, such as it is: **his own M8 list** reads *"Weird.Baby Robots ·
Weird.Baby Music · Other Music Worth a Listen · Information Booth"* — the booth
is in his list and takes no house name — and the shop was never in it, on M8's
own note that *"it is not an exhibit and was not in his list."* The museum's
vocabulary calls the Foundation a **wing** (D7/M62), the booth **the desk** and
the shop **the shop**.

**One word from him puts either into the shape.** It is two strings each.

---

## 7 · NOT THIS ROUND — WHAT THE PNGs WOULD NEED

Nine images carry a wing name **in the pixels**, all declared MIKE in
`provenance/assets.json` with `textInImage: true`.

**SIX ARE REGENERABLE**, from `tools/make_house_covers.py` — deterministic, and
`covers:house` is already a script. The strings are at `:91`, `:93`, `:95`
(`THE WEIRD.BABY FOUNDATION` ×3), `:98` (`WEIRD.BABY MUSIC`) and `:103`
(`WEIRD.BABY`), plus `make_robots_cover.py:72` (`ROBOTS`). **`WEIRD.BABY MUSIC`
exists nowhere else in the museum — the only place that string is authored is
inside a picture.** What a redraw needs: the new strings, a re-render, and a
re-inspection of each `text` field in `assets.json` by a human looking at the
image — the file is **keyed on path, not bytes**, so replacing the art under the
same filename fails no gate and silently invalidates the declaration
(`provenance/README.md §4.2`).

**THREE ARE HAND-AUTHORED BY MIKEY AND THE GENERATOR IS FENCED FROM THEIR PATHS**
(`make_unit_covers.py:92`): `mgk-niac-cover.png`, `mgk-viiip-cover.png` and
`portal-cover.png`, all reading `… - WEIRD.BABY ROBOTS`. **A redraw is not a
rebuild.** It needs Mikey, and it needs Mike's eye under the robots repo's
`OBFUSCATION_LAW.md`, whose authority clause covers every image the museum
publishes of a physical MGK unit.

**Until then the album title and its own sleeve disagree** on `/robots` — the
banner reads `Weird.Baby \Robots` over a cover reading `ROBOTS`. Stated here so
it is met as a known cost rather than discovered.

---

## 8 · REPORTED, NOT RESOLVED

### (a) `WbHome.jsx` said four names were his; the register said HOUSE

**Both claims were in the tree.** M8's note, 2026-08-03: *"Mike's list, verbatim:
Weird.Baby Robots · Weird.Baby Music · Other Music Worth a Listen · Information
Booth."* `register.json` classed the same four **HOUSE**.

**WHICH SURFACE CARRIES WHICH CLAIM NOW:**

- **`register.json`** — the four new board rows are **MIKE**, sourced to today's
  ruling. There is no ambiguity about *today's* strings: he wrote the shape.
- **`WbHome.jsx`** — a dated block now stands above M8's note recording the
  contradiction, naming `provenance/README.md §4.1` as the hole that lets it
  stand (*"MIKE on a row is a claim by whoever wrote the row"*, and HOUSE needs
  no source at all, so the hole runs both ways), and stating that the question of
  **what the predecessors were** is untouched.
- **M8's own paragraph is preserved**, with the three retired strings named once.

**The open question is unchanged and is his:** were the 2026-08-03 names his
words or Ops'? Nothing in this round answers it, and the evidence was not
overwritten in order to look tidy.

### (b) M26 — closed, and it had been load-bearing while open

**M26 CLOSES, ON ITS OWN THIRD OPTION.** It asked for *"one name for the bar, one
for the board, **or a ruling that the two may differ**."* Mike ruled the third:
the board carries the full form, the door the short one. They differ **by a
stated shape** now instead of by which instruction happened to reach which
surface. Filed in `docs/OPEN_ACTIONS_CLOSED.md`; the row has **left**
`OPEN_ACTIONS.md` (Doctrine 24) and the two links to it were flattened.

**WHAT M26 STILL HAD IN IT, AND IT IS NOT A QUESTION — IT IS A FINDING.**
`foundation.js` cited *(M26's own reading)* — *"a door carries the full name and
a bar carries the room"* — as its justification for `name: "The Foundation"`.
**M26 was an OPEN ACTION, not a ruling, and Ops had built on it as doctrine.**
That is recorded at the edit site so a later round meets it as a decision. Its
*measurement* survives and was helpful: D7 refused `The Weird.Baby Foundation` at
25 characters; `\Foundation` is eleven, so this wing **gained** 14.9px.

**One residue, and M26 never named it:** the wing's first album is still titled
`The Foundation` (§5).

### (c) The reveal ledger's seventh set of forms — unreconciled, untouched

`reveal/ledger.json`, authored in `reveal/ledger-declare.mjs`, carries wing names
in its `name` fields that match no surface and now match the glass less than they
did:

| ledger row | reads |
|---|---|
| `route.robots` | *The Robots wing — the front desk, the Record, and two machines…* |
| `route.wal` | *Worth A Listen — four artists the house wants heard.* |
| `route.wb` | *Weird.Baby Music — the house's own record.* |
| `route.foundation` | *The Weird.Baby Foundation — where the money goes.* |
| `route.shop` | *The Gift Shop — …* |
| `route.booth` | *The Information Booth — …* |
| `robots.faq` | *FAQ — the robots wing's whole front desk…* |

**NOT TOUCHED, AND THE REASON IS A RULE RATHER THAN CAUTION.** OPERATIONS §0 —
*NO ID MOVES WHEN A LEGEND IS RECUT* — has fired **four times**, most recently on
2026-08-22 when eight renamed rows took `reveal/transfers.mjs` down with them and
the M99 guard refused the write. `name` is the field that restates the glass and
it *may* move; but the ledger is Ops' own instrument, nothing a visitor reads
comes from it, and `reveal:check` passes as it stands. **Recutting seven legends
in the same commit as the glass would put the one file with a refusing guard into
a round that did not need it.** It is a separate, mechanical job.

---

## 9 · GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 7 warnings — baseline, zero new** |
| `npm run build` | green |
| `npm run build:launch` | green |
| `npm run provenance:gate` | **PASS** — 16 rows added, 38 pruned, 0 surviving rows changed |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** — 21 strings read, 0 findings |
| `npm run docs:numbers:gate` | **PASS** — 11 published claims in 8 documents |

**AND IT CAUGHT ONE, WHICH IS THE POINT OF IT.** Closing M26 moved the
open-action counts, and `docs/BACKLOG.md:278` publishes them. It failed with
*published 136 / 115, measured 135 / 114* on the first run after the closure.
Corrected in the document to **140 rows · 135 OPEN · 114 owned by Mike**;
the round log is not edited to track a count, per the gate's own rule.

**THE VISUAL HALF WAS NOT PHOTOGRAPHED AND THAT IS STATED RATHER THAN GLOSSED.**
The Browser pane does not composite in this session — a screenshot times out with
*"the page is not compositing frames"*, the same rAF family §8 already carries.
Every claim above is from **painted-DOM reads and Range geometry on the served
page**, which is a strong oracle for *what the text is* and no oracle at all for
*how it looks*. **Mike is the first eye on the look.**

---

## 10 · A FLAG THAT IS NOT IN ANY OF THE THREE

**HIS LOWERCASE `a` RENDERS NOWHERE.** He specified `Worth a Listen` and it is
carried to the character in the data. But `.wb-dir-entry` (`WbHome.css:53`),
`.wb-bar-room` and every FAQ subtitle all set `text-transform: uppercase`, so
**every surface in the museum that prints a wing name is uppercased** and a
visitor reads `WORTH A LISTEN` either way.

The casing is in `textContent`, in what a copy takes and in what the register
hashes — and on no pixel. A first draft of the note in `worth-a-listen.js`
claimed it survived on the board; that was wrong and was corrected after
measuring the CSS. **Un-uppercasing four surfaces to reveal one letter is a
visual decision and it is his.**

**AND ONE SENTENCE OF HIS NOW DISAGREES WITH HIS OWN BOARD.** The Foundation's
incoming register reads *"**Weird.Baby Music** is Papa's own recordings…"* while
the board four rooms away reads `Weird.Baby \Music`. It is prose, in his voice,
and he did not name it — so it is flagged rather than conformed. It is one string.
