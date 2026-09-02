# SATURDAY 15 AUG — ONE DELETION, AND WHAT THE REPORT STEP FOUND

2026-08-15 · The packet was three items: report, delete `About this record`,
file Mike's 14 Aug session notes. **Two are done. The third has no material.**

Mike writes the first week of Records today. Nothing here goes in front of it,
and nothing here was deployed.

---

## §0 — THE REPORT STEP, WHICH THE PACKET ASKED FOR FIRST

The instruction said *"The last handoff said 'clean' when it was not."* It was
run before anything was touched.

| | |
|---|---|
| `git rev-parse --short HEAD` | `c1d5058` |
| `git status --short` | **empty — the working tree genuinely was clean** |
| branch | `main`, **ahead of `origin/main` by 2** |
| `npm run lint` | **9 errors / 8 warnings — exactly the published baseline** |

**The two unpushed commits:**

```
c1d5058  The lobby's book, /wb's two albums, WAL's rack, the booth's credo
         and the Foundation's door
bbd3df8  The viewer takes its width from its column: the right-hand block,
         the dead splitter and the un-scrolling page were one fault
```

**SO THE HANDOFF WAS RIGHT ABOUT THE WORKING TREE AND THE WORD "CLEAN" WAS
STILL DOING TOO MUCH WORK.** `git status` was clean; `git log` was not. Two
rounds of Friday's work — the width fix and the whole walkthrough packet — are
committed and sitting on this machine only. That is the gap a one-word status
hides, and it is worth stating plainly rather than as a footnote: **everything
below is a third unpushed commit on top of two.**

**AND THE PROVENANCE REGISTER WAS NOT CLEAN, WHICH NO GIT COMMAND WOULD HAVE
SAID.** See §2 — thirteen stale rows were already there before this session
touched anything, and they were measured rather than inferred.

---

## §1 — THE DELETION

**`About this record` is gone from `About the Artist` on `/wb`.**

`src/data/artists/weird-baby.js` — the whole `about-record` track object
struck: the row, its `text` face, its subtitle, its one profile line and its
footer. The album now holds exactly the two rows Mike named on 14 August:

```
About the Artist   1
FAQ                2
```

**THE WORD WAS ALREADY WAITING FOR.** The 14 Aug round did not keep this row by
preference — it kept it because deleting it would have been an inference off a
sentence that was naming two positions, and it said so in the file and in its
own report: *"Raised in the round log; one word removes it."* That is the word.
The row is deleted, not hidden, not marked, not moved.

**VERIFIED ON THE BUILT BUNDLE, NOT ONLY IN SOURCE:** `About this record`
returns **zero occurrences across `dist/`** after `npm run build`.

**TWO COMMENTS WERE CORRECTED BECAUSE THE DELETION MADE THEM FALSE, AND ONLY
THOSE TWO.** This is not scope creep; leaving them would have put two untrue
sentences in the tree that were true an hour earlier:

1. The `REC_LABEL` note said the chip and *"the blurb on `About this record`"*
   say the same thing in the same words. There is no blurb now. Rewritten to
   say what the chip is, plus the fact that matters to a future round: **the
   chip is Mike's own approved wording and was never derived from the blurb** —
   both came from the same sentence of his — so deleting the blurb does not put
   the chip in question.
2. `vol1`'s note said the track *"is now the second row of `About the Artist`,
   above."* It is not anywhere. Marked so, without rewriting the history above
   it.

**WHAT WAS DELIBERATELY NOT TOUCHED — see §4.**

---

## §2 — THE REGISTER, AND THE THIRTEEN ROWS THAT WERE ALREADY STALE

The five strings the deletion removed all had rows in
`provenance/register.json`. §9's procedure was followed in its own order —
**CHECK ANCHORS → REPOINT → PRUNE → RE-GATE** — and the check came first:

**No surviving row references any of the five as its `r`.** Nothing to repoint.
That was measured before the prune, against a backup copy of the register, the
way the procedure's own correction (*prune against a copy and let the gate find
the breaks*) says to do it.

**THEN THE PRUNE REMOVED EIGHTEEN ROWS AND NOT FIVE, WHICH IS THE FINDING OF
THIS ROUND.** Rather than absorb thirteen unexplained deletions into a one-line
change, the tree was restored to `HEAD` with the original register and the sweep
re-run:

```
stale register rows (string gone) : 13     ← on untouched HEAD, before anything
```

So **thirteen rows were already stale on `main` before this session existed**,
and the five from this deletion make eighteen. The thirteen are the residue of
Friday's two rounds, which changed strings and never pruned after themselves:

- the `The Making of BoWB V1` retitle — four rows (`Recording — 2026-06`,
  `The Making of BoWB V1`, `THE MAKING OF BoWB V1`,
  `WEIRD.BABY · THE MAKING OF BoWB V1`) plus the holdings sentence that carried
  the old release name
- the lobby's old NOW copy — `The museum is open.` and the three fragments of
  *"A new Record every day for ninety days."*, which the walkthrough log §3
  records as leaving
- two RESTATED rows in `InfoBooth.jsx` and three small HOUSE rows

**Result, measured both directions:**

```
rows before 2008 · after 1990 · removed 18 · added 0 · changed 0
broken RESTATED chains: 0
```

**THE LESSON IS NOT "SOMEBODY FORGOT".** The prune is a whole-file operation and
the gate does not fail on a stale row, so a round that changes strings and does
not prune leaves no symptom at all — and the next round to prune anything
silently inherits the cleanup and cannot tell its own five from the inherited
thirteen unless it stops and measures. **A stale row is invisible to `git
status`, invisible to the gate, and indistinguishable from your own work.**
Worth a row of its own if it happens a third time.

---

## §3 — GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 8 warnings — baseline, zero new** |
| `npm run build` | **green** (1.93s) |
| `npm run provenance:gate` | **PASS** — 18 stale rows pruned, 0 chains broken, 0 rows changed |
| `npm run reveal:check` | **CHECK: PASS** |
| `npm run parity:gate` | **PASS — 4 shared · 0 divergences** |
| `npm run instory:gate` | **PASS — 0 findings** |
| `npm run docs:numbers:gate` | **PASS — 8 published claims in 3 documents** |

**THE LAP WAS NOT RUN AND THAT IS STATED RATHER THAN OMITTED.** The change
deletes a data object and adds no markup, no rule and no string; the built
bundle was checked directly for the removed text instead. **What has therefore
not been looked at on the glass is the album's menu with two rows instead of
three.** It is one row shorter and nothing else moved. The Inspection Law is
answered honestly here rather than claimed.

**Nothing was deployed. Nothing was pushed.**

---

## §4 — ONE THING SEEN AND DELIBERATELY LEFT

**A COMMENT IN THE SAME BLOCK NOW CONTRADICTS THE CODE THIRTY LINES ABOVE IT.**
Immediately after the deleted row, `weird-baby.js` still carries a seventeen-line
note headed *"THE FAQ ROW IS NOT BUILT, AND THAT IS THE HOUSE'S OWN RULE RATHER
THAN A GAP IN THE WORK."* **The FAQ row was built on 14 August** and is the
second track of that album.

It was already stale before this session and the staleness was not created here,
so under *one deletion, nothing else* it stands. It is named here because the
deletion moved a fresh comment directly above it, which makes the pair read as
one current statement about the album — and because a note explaining at length
why a thing is not built, sitting under the thing, is the exact shape a future
session reads as ground truth. **One line removes it.**

---

## WHAT NEEDS MIKE

1. **The 14 August session notes have not been supplied and are nowhere on
   disk.** See below. Nothing can be filed until the text arrives.
2. **`W-a` — `/wb`'s About the Artist copy.** Your words. Open, unchanged.
3. **`W-b` — `How to contact?`** An address, or your word that there will not be
   one. Open, unchanged; it still collides with your 2026-08-11 ruling.

`W-a` and `W-b` are untouched by this round and no row was opened or closed in
`docs/OPEN_ACTIONS.md` — **`About this record` never had a row**; it was raised
in the round log only, which is why the deletion closes nothing there.

---

## THE THIRD ITEM — NOT DONE, AND WHY

The packet said: *file Mike's session notes of 14 Aug covering the shorts spec,
the egg audit and the Ops desk quality box — Ops will supply the text.*

**The text was not supplied, and it is not in the tree.** Measured, not assumed:

- `shorts spec`, `egg audit` and `quality box` return **zero hits across all of
  `C:\AI`** — every `.md`, `.txt` and `.json`, node_modules excluded.
- There is no `C:\AI\_night-20260814`; the series stops at `_night-20260813`.
- `docs/MUSEUM_FRIDAY_LOG-20260814.md` exists and is Friday **morning** — the
  width fix, the lobby, `/wb`, WAL, the booth, the Foundation. **None of the
  three subjects appears in it.** It is a different session's record, not this
  one under another name.

**THIS IS THE STANDING RULE FIRING EXACTLY AS WRITTEN** — *an instruction that
assumes its own material is in the tree is a kickoff anchor, and §7 Rule 7
applies to content as well as to paths.* It cost a round on 2026-08-07 when a
packet asked for a launch report verbatim that existed nowhere on disk, and the
answer then is the answer now: **build the frame, fill what there is material
for, and print the gap at the top.** Doctrine 12 forbids the alternative —
three plausible paragraphs about a shorts spec nobody has described to Ops would
read true and be invented.

**The file will be written the moment the text arrives**, at
`docs/MUSEUM_SESSION_NOTES-20260814.md`, verbatim, no smoothing.

---

# SECOND SESSION — THE 001 CORRECTION AND THE WEEK 01 WORKBOOK

## §5 — I REPORTED RECORD 001 WRONG, AND THE TOOLING WAS RIGHT BOTH TIMES

Asked five questions about the workbook chain, I answered that Record 001 in the
tree had **"no date, no sections."** That contradicted the 13 August run, which
had carried 001 from the tree and reported **5 sections, 24 paragraphs**, and
`record:land`, which had emitted it with EXECUTIVE SUMMARY, DETAILED REPORT and
ADDENDUM 01/02/03.

**THE TOOLING WAS RIGHT. THE ERROR WAS ENTIRELY MINE, AND IT WAS TWO ERRORS IN
ONE THROWAWAY REGEX.**

Entry 001 is `src/data/artists/robots-record.js:136-231` — **96 lines**. I read
a **900-character window** from `{ no: 1,`, which ends around line 150. The
`sections:` key is at **line 179**, twenty-nine lines below where I stopped
looking. And I matched the date as `date:\s*"([^"]*)"` — a quoted literal —
while the field is `date: recordDay(1)`, an identifier call, so it read as
absent.

**What 001 actually holds:**

```
date     recordDay(1) -> 2026-08-17
title    INITIAL LAUNCH REPORT - Weird.Baby
line     "Weird.Baby website is live\nAlert — Incoming Email Server Load (contained)"
sections EXECUTIVE SUMMARY                              2 para
         DETAILED REPORT                                4
         ADDENDUM 01 - Event Log - Friday Launch(-2)   10
         ADDENDUM 02 - Weekend Summary                  3
         ADDENDUM 03 - Event Log - Monday Day(1)        5
                                              5 sections, 24 paragraphs
```

**THE LESSON IS THE ONE THE PACKET ALREADY STATES AND I APPLIED TO EVERYONE
EXCEPT MYSELF:** *verify, do not guess; the file is the truth; secondhand counts
are suspect.* A hand-rolled regex over a 96-line JS object literal **is** a
secondhand count. The repository has a parser for this file —
`reveal/record-entries.mjs`, the module `_prefill.json` was exported from — and
every number in this round is now read through it instead. **When a tool and my
own reading disagree about a file the tool was built to read, the tool wins
until I have read the whole object.**

The corrected inventory, and 004/005 having no headline does stand:

```
001  2026-08-17  headline y  deck y   5 sections, 24 para
002  2026-08-18  headline y  deck y   2 sections,  5 para
003  2026-08-19  headline y  deck y   2 sections,  7 para
004  2026-08-20  headline -  deck -   1 section,   2 para
005  2026-08-21  headline -  deck -   1 section,   4 para
```

## §6 — THE WEEK 01 WORKBOOK

```
C:\AI\_week01\WEEK01_records-001-to-005.xlsx     17,182 bytes
```

Six sheets: `READ ME FIRST` + `Day 1 - Record 001` through `Day 5 - Record 005`.

**PER TAB, WHAT ARRIVED:**

| tab | day | headline | sections | paragraphs |
|---|---|---|---:|---:|
| Day 1 - Record 001 | MON 2026-08-17 | **FILLED** — *INITIAL LAUNCH REPORT - Weird.Baby* | 5 | 24 |
| Day 2 - Record 002 | TUE 2026-08-18 | **FILLED** — *GENERAL STATUS UPDATE* | 2 | 5 |
| Day 3 - Record 003 | WED 2026-08-19 | **FILLED** — *DATA EXTRACTED - Weekend Robots Anomaly* | 2 | 7 |
| Day 4 - Record 004 | THU 2026-08-20 | **EMPTY** | 1 | 2 |
| Day 5 - Record 005 | FRI 2026-08-21 | **EMPTY** | 1 | 4 |

Days 4 and 5 arrive with an EXECUTIVE SUMMARY and no headline and no deck,
because that is what the tree holds — not because anything failed to carry.

**THE OLD PREFILL WAS GONE, WHICH MEANS THE OLD GENERATOR COULD NOT HAVE BEEN
RE-RUN.** `C:\AI\_night-20260811\_prefill.json` does not exist; the generator
reads it at line 9 and would have died on `FileNotFoundError`. A fresh one was
exported from `reveal/record-entries.mjs` to `C:\AI\_week01\_prefill.json`.
Worth knowing: **the old workbook was not reproducible from its own folder.**

**THE ROW LAYOUT IS UNCHANGED AND IT WAS PROVED, NOT ASSUMED.** The reader's
`EXPECT` guard checks column A on fifteen rows. Traced through the generator:
headline lands at row 4, deck at 5 and 6, sections at 9/10, 12/13, 15/16, 18/19,
21/22, 24/25 — the guard's table exactly. Then it was **run**:

```
read C:\AI\_week01\WEEK01_records-001-to-005.xlsx
  5 record(s): 001 002 003 004 005
    001  5 section(s), 24 paragraph(s)   headline   deck
    ...
  day one 2026-08-17
```

**AND THE ROUND-TRIP IS CHARACTER-FAITHFUL:** the draft the reader emitted was
compared field by field against the tree — **32 fields across 5 records, 0
mismatches.** Every title, deck and paragraph survives tree → prefill → workbook
→ draft unchanged.

**ONE THING ADDED THAT THE OLD GENERATOR DID NOT HAVE — A WEEKDAY GUARD.** The
date and the weekday are two statements of one fact and can disagree; the
museum's own worksheet generator refuses to build on that mismatch and this now
does the same, plus a second check that a hand-edited `DAYS` table cannot
re-date a Record the tree already dates. It refuses rather than warns.

**READ ME FIRST CARRIES BOTH RULES, AND ONE OF THEM CORRECTS THE OLD SHEET.**

- **Every Record must contain 314** — stated as its own section, and stated
  with the fact that goes with it: **none of the five carries a 314 today.**
  Checked across all five entries; the string appears in no Record and in no
  reveal tooling. **It is his to put in and Ops has not put it in for him** —
  inventing where his own number goes is exactly Doctrine 12.
- **Curly braces stop the land.** The old sheet said braces "never reach a
  visitor… a gate fails the build if a brace ever survives to launch, so you can
  **write in them freely**" — which points at the LAUNCH gate and reads as *the
  brace is harmless*. **The truth is earlier and harder:**
  `emit-record-entries.mjs` REFUSES to emit an entry containing a brace and
  names it (*"take it out of the entry before landing it"*). So a brace does not
  quietly ride to launch — **it stops the entry from landing at all.** The new
  sheet says so, and the section note in every TEXT cell says so too. This was
  verified in the emitter, not carried over on trust.

## §7 — THE OPS DESK CARD

Repointed to `C:/AI/_week01/WEEK01_records-001-to-005.xlsx`, with the reason in
the file: the old sheet **starts at Record 002 and has no tab for 001 at all**,
because 001 had already landed when it was generated. Week one is 001 to 005.

`npm run desk` → **10 instruments, 10 on disk.** The card resolves and is
linked; the old path appears nowhere in the desk's output. **The old workbook
and its whole folder are untouched** — `RECORD_days-2-to-6.xlsx` is still
15,619 bytes at 2026-08-12 01:25:57, byte-for-byte and mtime unchanged.

## §8 — GATES, SECOND SESSION

lint **9 / 8 = baseline** · build **green** · provenance **PASS** ·
`reveal:check` **PASS** · `parity` **PASS, 4 shared · 0 divergences** ·
`instory` **PASS** · `docs:numbers` **PASS**.

Tree files touched: `tools/ops-desk.mjs` (the card) and the two regenerated
`docs/*.html`. Everything else this round is outside the museum tree.

**Nothing deployed. Nothing pushed.**

---

# THIRD SESSION — THE 14 AUGUST NOTES LANDED

## §9 — THE DELETION WAS ALREADY DONE AND WAS NOT DONE TWICE

The packet re-issued *"DELETE `About this record` from About the Artist on /wb"*
as item 1. **It was already done in this session's first round** and is sitting
uncommitted in the working tree. Verified rather than assumed before standing
down: `about-record` is absent from `weird-baby.js`, the album's tracks are
`About the Artist` and `FAQ`, and the only surviving occurrence of the phrase in
`src/` is inside the comment that records the deletion.

**A re-issued instruction on an uncommitted change is exactly where a second
deletion gets made** — of the comment, or of the FAQ row that now sits at the
position the deleted row used to hold. Nothing was touched.

## §10 — THE NOTES ARE ON DISK

```
docs/MUSEUM_SESSION_NOTES-20260814.md     6,078 bytes · 148 lines
```

The gap reported at the head of this log **closes**. Ops supplied the text; it
is filed at the path this log named in advance.

**§1 IS HIS, VERBATIM — no editing, no smoothing, no reordering.** The two
column-aligned blocks (the Film A shot list and the three data files) are in
fenced blocks so their alignment survives; his prose is block-quoted. Checked by
string rather than by eye — ten spot-checks across the whole of it, every count
as expected, including the three that legitimately appear twice (`packets
3.1.4 / sec` and `source still —` are in both A1 and A2; `CONSIDER, not apply`
is in his §1 and again where Ops quotes it in §2.2).

**§2 IS OPS' AND IS MARKED AS SUCH**, for the three-marks reason: his sentence
left in Ops' voice gets improved by the next round, and an Ops paraphrase in his
voice is indistinguishable from his words a week later.

**NOTHING WAS BUILT, AND THE INSTRUCTION SAID SO TWICE** — *"do not build"* on
the filing and *"Film A: HOLD. Do not render today. Mike is writing."* No data
file, no recipe, no ffmpeg, no egg-audit row shape, no quality box. The
nine-variant is carried as **"in the drawer"**, his own words, rather than
converted into an open row.

**AND THE STANDING INSTRUCTION WAS RECORDED, NOT EXECUTED.** *"Consider the
audit's application across other work. CONSIDER, not apply."* Recording it is
the whole of the action taken; nothing elsewhere was audited or gated on it.
It is written into §2.2 so a future round cannot read the note as a mandate.

**ONE FACTUAL CONNECTION FLAGGED AND NOT ACTED ON.** 314 is now load-bearing in
two places set a day apart: the packet rate in all three Film A data files, and
his separate rule that every Record must contain 314 (the Week 01 workbook,
§6 above). Measured: **314 appears in none of Records 001–005 today.** His own
sentence is why this is a flag and not a task — *"314's meaning is in where it
stops appearing"* — so it is something the audit RECORDS. Ops has put 314 into
none of his text.

## §11 — GATES, THIRD SESSION

lint **9 / 8 = baseline** · build **green** · provenance **PASS** ·
`reveal:check` **PASS** · `parity` **PASS, 4 shared · 0 divergences** ·
`instory` **PASS, 0 findings** · `docs:numbers` **PASS**.

The `instory` result is the one worth a line: §1 carries in-story specification
text (`MGK-VIIIp   CH 3   STANDARD`, BIST, f(Ump)) and the gate is clean,
because a `docs/` record is not a specification SURFACE — Doctrine 18 governs
what a face says a machine IS, and nothing here reached a face.

**Uncommitted at close:** `src/data/artists/weird-baby.js` · `tools/ops-desk.mjs`
· `provenance/register.json` · two regenerated `docs/*.html` · and the new
`docs/MUSEUM_SESSION_NOTES-20260814.md` (untracked).

**Nothing deployed. Nothing pushed. Film A not rendered.**

---

# FOURTH SESSION — THE INGEST, THE PLAN SHEET, THE DESK CARD

## §12 — THE INGEST, AND THE ONE THING THAT NEEDS HIM

Workbook edited **17,182 → 21,792 bytes at 10:43**. Read clean: guard passed on
all five tabs, no cell moved, inserted or deleted, exactly as he said.

```
rec  headline  deck   sections  paragraphs      (was, as generated)
001  yes       yes    5          7              (24)
002  yes       yes    2          2              (5)
003  yes       yes    2          7              (7)
004  NO        NO     1          2              (2)
005  NO        NO     1          4              (4)
```

**001 LOST SEVENTEEN PARAGRAPHS AND 002 LOST THREE, AND NO TEXT WAS LOST WITH
THEM.** The file GREW by 4.6 KB. What changed is the SEPARATOR: the reader
splits paragraphs on a **blank line**, and in 001 and 002 his paragraph breaks
are now **single** line breaks. In 003, 004 and 005 they are still blank lines,
which is why those three are unchanged. **It is not a global reformat — it is
per tab, and it is even mixed inside 001** (ADDENDUM 01 and 03 each kept one
blank break, which is why they have 2 paragraphs and not 1).

**WHY IT MATTERS ON THE GLASS, MEASURED RATHER THAN ASSUMED.**
`.vp-rec-sect-body` in `Exhibit.css:4555` carries **no `white-space`
declaration**, so it is `normal` and **a newline inside a paragraph collapses to
a space.** (`.vp-rec-sum` — the deck — does declare `pre-line`; the body does
not.) So his ADDENDUM 01 event log would print as one run-on line:

```
15:00 - Weird.Baby email server Scheduled Early Auto Start 15:01 - Weird.Baby
System BIST - No deviations; f(Ump) = 100% 15:04 - First data packet received …
```

**Seven sections across 001 and 002 are in this state.** Nothing was corrected —
his text is untouched and the draft is his characters. **This is a question for
him and it is the only one in the round that changes what he does next.**

**EVERY OTHER FLAG IS CLEAN, AND TWO OF THEM ONLY LOOK CLEAN BECAUSE THE SCOPE
WAS CHECKED FIRST.**

- **Non-text cells: none.** Every cell the reader reads is a string. No date, no
  number, no formula residue.
- **Headlines: 34 / 21 / 39 characters** against 62. **Decks: 73 / 125 / 116**
  against 130. 002 at 125 is five under and worth knowing.
- **Curly braces in his cells: none.** The workbook holds **31 braces** and
  **every one is in column C** — Ops' own note text, which the reader never
  looks at (it reads column B). A whole-file brace count would have reported a
  false positive; the column matters.
- **314: ABSENT FROM ALL FIVE.** Checked in every written form the shorts spec
  uses — `314`, `3.1.4`, `3 1 4`, and a loose `3?1?4` — because the spec writes
  the packet rate as **`3.1.4`** and a naive search for `314` would have missed
  the egg entirely.

**AND THE EM DASH IS REAL.** A first console dump rendered it `?`; the codepoint
is **U+2014**. That was my terminal, not his data — checked because a mangled
dash landing in the tree is exactly the invisible edit §8 warns about.

**The emitted source is at `C:\AI\_week01\week01-emitted.txt`** (6,305 bytes) for
him to read. `label: null` on 002/003 section 2 is his deletion of those labels
and draws nothing — `RecordEntry.jsx:618` is `{s.label && …}`, so there is no
bald heading. Not a defect.

**NOTHING WAS WRITTEN TO THE TREE BY THE INGEST** and no text of his was
corrected.

## §13 — THE 12-WEEK PLAN

```
C:\AI\_week01\WEEK01_plan.xlsx      sheet "12-week plan"      12 rows + header
```

**SOURCE: `reveal/arc-twelve.mjs` → `WEEKS`.** That is the data behind
`docs/dictation-20260807/arc.html`, which is the *twelve-week table* card on the
Ops desk. **Taken from the module, not scraped from the page** — the HTML is a
rendering, and reading data back out of a rendering is how a count goes wrong.

**COLUMNS — every field the data carries, named with its own key, headline
first as instructed:**

```
A headline · B n · C rail · D band · E from · F days
G reach 1 · H reach 2 · I note · J invented
```

**`reach` is an array of at most two** (measured across all twelve), so it takes
two columns rather than being joined into one string — **joining would have been
a formatting decision about his data.** Numbers stay numbers, booleans stay
booleans, absent stays empty. Nothing invented, nothing summarised, no styling,
no widths, no fills.

**THE GENERATOR REFUSES IF THE DATA GROWS A FIELD IT HAS NO COLUMN FOR** — the
same shape as the record workbook's slot check. A field added upstream must not
vanish here silently. Verified after writing: **12 weeks × 10 columns read back
against the source, 0 mismatches.**

## §14 — THE DESK CARD NO LONGER HANDS HIM A COPY

**THE FAULT.** The card was `<a href="file:///C:/AI/…xlsx">`. A browser cannot
give a spreadsheet to Excel — for anything it cannot render it **downloads a
copy**, and Chrome does this for `file://` too. So the card never opened his
workbook; it manufactured a new one on every click. **He ended up with several,
and the one he types into is then not the one `record:workbook` reads.** It
fails silently: a download looks like a success.

**IT CANNOT BE FIXED WITH A BETTER LINK AND THAT IS STATED IN THE FILE.** No
browser mechanism launches an external application from a page, by design.
`file://` downloads; a `.lnk` is still a file to download; a custom scheme needs
a registry handler installed on the machine, which is a worse thing to own than
one honest sentence.

**SO THE CARD STOPS PRETENDING.** For an `abs` instrument there is now **no
anchor at all**. It shows the real path as selectable monospace text with a copy
control, above a plain instruction: open it from **File Explorer**, paste into
the address bar or **Win+R**, and **do not edit a copy — the copy is not the
file Ops reads back.**

**THE SPLIT IS EXACTLY `abs` VS `file`, WHICH THE DESK ALREADY HAD.** The seven
`docs/` cards are HTML, the browser renders them in place, and a link is the
right answer for them — **all seven still link and are untouched.** Measured on
the output: **`file://` hrefs 0, path blocks 1, docs links 7.**

**THE COPY CONTROL READS THE CLIPBOARD BACK BEFORE IT SAYS A WORD** — §8's U2
hazard, already paid for once on the worksheet. `writeText` rejects when the
document is not focused and `execCommand("copy")` returns true when the command
was merely *enabled*; neither says the clipboard changed. It writes, reads back,
compares, and says one of three things — **verified**, *the clipboard did not
take it*, or *written but not verified*. **It never says "copied" on a write it
did not check**, and the path is selected first either way so Ctrl+C works when
the button cannot.

**AND A SECOND DEFECT WAS FOUND ON THE RENDERED CARD RATHER THAN IN THE SOURCE.**
The meta line printed `it.abs` raw — forward slashes — directly beneath the
path block's normalised backslash form, so **the card showed one path twice in
two spellings.** *Which of these is the real one* is precisely the question this
card exists to stop him asking. The meta line drops the path for `abs` cards.
Measured after: backslash form **1**, forward form **0**.

**ONE SELF-INFLICTED BUG WORTH RECORDING BECAUSE IT WILL RECUR.** The first
build died with `SyntaxError: Unexpected identifier 'abs'`. The new CSS comment
contained **backticks** around a word, and it sits inside a **template
literal** — the backtick closed the string. **No backticks in a comment inside a
template literal**; the comment now says so where the next author will read it.

## §15 — SCOPE, STATED PLAINLY

The packet opened *"Nothing touches the museum tree"*, and **item 3 cannot be
done without touching it** — the desk card IS `tools/ops-desk.mjs` and its
output `docs/OPS_DESK.html`. Both changed, on that instruction. **`src/` is
untouched by this round** (the one `src/` modification in the working tree is
the `About this record` deletion from earlier today). Items 1 and 2 wrote
nothing to the tree at all.

Gates: lint **9 / 8 = baseline** · build **green** · provenance **PASS** ·
`reveal:check` **PASS** · `parity` **PASS** · `instory` **PASS** ·
`docs:numbers` **PASS**.

**Nothing deployed. Nothing pushed. No text of his corrected.**

---

# FIFTH SESSION — THE LINE BREAK, AND 314 IS DEAD

## §16 — `white-space: pre-line` ON THE SECTION BODY

One declaration added to `.vp-rec-sect-body` in `Exhibit.css`. **His text was not
touched and his paragraphs were not re-split.** The stylesheet was answering a
question nobody had asked it; the text was always right.

**IT IS THE DECK'S MECHANISM, NOT A NEW ONE.** `.vp-rec-sum` has carried
`pre-line` since the deck was ruled two lines that never wrap. The Record now has
**one** rule about what a newline means instead of two answers depending which
field you are in.

**VERIFIED IN A BROWSER, ON THE BUILT STYLESHEET, AGAINST HIS OWN TEXT** — his
edited 001 is not in the tree, so the built `tokens-*.css` was loaded into a
harness and fed the exact ADDENDUM 01 strings out of his draft.

**A RAW LINE-BOX COUNT WAS NOT ENOUGH AND WOULD HAVE MISLED.** The body is capped
at `max-width:68ch` (R4), so his long lines wrap — the count came back **20**,
not 10, and a lazier reading of that number proves nothing either way. The test
that answers the question is per LOGICAL line: does each newline-delimited
segment begin a fresh line box at the block's left edge?

```
                     logical lines   each starts own line   all tops distinct
LIVE   pre-line           10                YES                   YES
CONTROL normal            10                 no                    no
```

His ten lines, top coordinates, every one at the left edge:

```
60 · 82 · 103 · 125 · 146 · 168 · 189 · 211 · 238 · 282
```

Under the old `normal`, `15:00` and `15:01` shared **top 363px** — the run-on,
measured rather than described.

**003, 004 AND 005 ARE PIXEL-IDENTICAL.** Each was rendered under both rules and
every line box compared by geometry (left, top, width, height, relative to its
block): **identical true for all three**, 8 / 2 / 5 line boxes either way. Only
001 changes — `identical false`, 9 → 20 boxes.

`pre-line` collapses runs of spaces and still wraps long lines, so it honours the
newline and nothing else. Paragraph splitting is untouched: it happens upstream
in `workbook_to_draft.py` on a BLANK line and still yields separate `<p>`s spaced
by `--rec-para`.

Harness served over `http://127.0.0.1:8899` (the extension refuses `file://`),
tab closed, **listener killed and port confirmed free**. Nothing was written to
`public/`.

## §17 — THE 314 RULE IS DEAD

His ruling, 15 Aug: *"too much squeeze for the juice."* **314 as Film A's packet
rate is a separate use and is untouched** — that distinction is written into
every place the removal touched, so nobody restores the wrong half later.

**IT NEVER REACHED THE GOVERNING DOCUMENTS**, which is why this is small:
`OPERATIONS.md`, `CLAUDE.md`, `STATE.md` and `OPEN_ACTIONS.md` contain no `314`
at all. It lived in four places and all four are done:

| where | what happened |
|---|---|
| `tools/ops-desk.mjs` card | the sentence deleted, with the ruling and the Film A carve-out in a comment |
| `C:\AI\_week01\build-record-workbook.py` | the READ ME FIRST block and the per-tab guidance line removed, so a rebuild cannot reintroduce it |
| the workbook itself | edited **in place** — see below |
| `docs/MUSEUM_SESSION_NOTES-20260814.md` §2.3 | the whole subsection removed; its subject was the now-dead rule |

**§1 OF THE NOTES IS UNTOUCHED AND HIS FILM A 314 SURVIVES IN ALL FOUR PLACES**
— the two `packets 3.1.4 / sec` lines, *"314 is the packet rate in all three"*,
and *"314's meaning is in where it stops appearing."* Verified by grep after the
edit.

**THE WORKBOOK WAS EDITED IN PLACE AND NOT REGENERATED, AND THAT IS THE ONE
DANGEROUS PART OF THIS ROUND.** The generator seeds from `_prefill.json` — the
tree as it stood at 09:16 — so **running it would have destroyed his morning's
work.** It was not run against his file. Instead:

1. His file was **backed up** to
   `_backup_before-314-removal_WEEK01_records-001-to-005.xlsx`.
2. The corrected generator was run to a **throwaway path in the scratchpad**, to
   produce a reference sheet. This is why the workbook's READ ME FIRST and the
   generator cannot now disagree: the sheet was written FROM what the generator
   actually produces, not from a second hand-typed copy.
3. Only READ ME FIRST's column A and each day tab's **row 2** were replaced.

**PROVED BY COMPARISON, NOT BY CARE:** **595 day-tab cells compared against the
backup, excluding the one guidance cell — 0 differences.** `314` appears nowhere
in the workbook. The reader re-run gives **5/7 · 2/2 · 2/7 · 1/2 · 1/4**, exactly
what it gave before the edit, so his content is intact through the round-trip.

**ONE HONEST COST, FLAGGED RATHER THAN BURIED:** openpyxl rewrites formulas but
drops their **cached values**, so column D's live character counters read blank
to a tool until Excel opens the file and recalculates — which Excel does
automatically on open. The formulas themselves are intact (`D4` and `D6` checked
verbatim), and `workbook_to_draft.py` reads column B, so nothing in the chain is
affected. He will see the counters as normal.

## §18 — GATES

lint **9 / 8 = baseline** · build **green** · provenance **PASS** ·
`reveal:check` **PASS** · `parity` **PASS, 4 shared · 0 divergences** ·
`instory` **PASS** · `docs:numbers` **PASS** · `314` in the desk output **0**.

`src/` changed for the first time since the deletion: **one declaration** in
`Exhibit.css`.

**Nothing deployed. Nothing pushed. His paragraphs were not re-split and no text
of his was edited.**

---

# SIXTH SESSION — THE PLAN SHEET GOES INTO THE WRITING WORKBOOK

## §19 — THE GATE QUESTION, ANSWERED BEFORE ANYTHING WAS TOUCHED

**SAFE — IT SKIPS BY NAME PATTERN.** `workbook_to_draft.py:246`:

```python
for name in wb.sheetnames:
    if not re.search(r"Record\s+\d+", name):
        continue
```

A sheet is read only if its name contains `Record` followed by digits. **READ ME
FIRST is skipped because it fails that regex, not because it is first** — there
is nothing positional and nothing all-but-first anywhere in the loop. A sheet
named `12-week plan` is skipped for the same reason, wherever it sits.

## §20 — THE FIRST ATTEMPT WAS REFUSED, AND THE REFUSAL WAS RIGHT

On the first pass the named source did not exist. A plausible candidate did —
`C:\AI\_week01\WEEKLY PLAN TEMPLATE.xlsx`, saved 12:05, one sheet correctly named
`12-week plan`, the real week grid. **It was not substituted**, and the reason
was measured in the raw sheet XML rather than inferred: **zero `outlineLevel`
attributes, no `outlinePr`, and `summaryBelow` True.** The brief said *"the
grouping is the point — it must still collapse."* That file had no grouping to
copy, so inserting it would have delivered the one thing the task existed to
avoid. Two independent signals — the name and the missing outline — said it was
not the cleaned file.

**The real file arrived at `WEEKLY_PLAN_TEMPLATE_clean.xlsx` and measures
right:** `summaryBelow="0"` and **48 rows at `outlineLevel="1"`**.

## §21 — THE INSERT

```
C:\AI\_week01\WEEK01_records-001-to-005.xlsx      17,347 -> 20,292 bytes
sheets: READ ME FIRST · Day 1..Day 5 · 12-week plan      (appended LAST)
```

63 rows x 7 columns. Twelve week blocks, each a level-0 headline row with four
level-1 rows beneath it (FACTS / EVENTS / EGGS / NOTES), plus the header row and
his PARKED NOTE at row 63.

**EDITED IN PLACE. THE GENERATOR WAS NOT RUN** — it seeds from `_prefill.json`,
the tree as it stood at 09:16, so running it would have thrown away everything he
has typed since. Backed up first to
`_backup_before-plan-insert_WEEK01_records-001-to-005.xlsx`.

**THE THREE VERIFICATIONS, ALL CLEAN:**

| check | result |
|---|---|
| pre-existing cells vs backup | **632 compared · 0 differences** |
| sheet order | unchanged, plan appended last |
| the copied sheet vs source | **441 cells + row dims · 0 differences** |
| grouping in the SAVED file | **48 rows at outlineLevel 1**, `summaryBelow="0"` |
| column widths / freeze / gridlines | A7 B34 C–G30 · `C2` · off — all carried |
| reader re-run | **5 records · 5/7 · 2/2 · 2/7 · 1/2 · 1/4** — identical to before |
| column D formulas | intact |

**AND ONE MEASUREMENT ERROR OF MY OWN, CAUGHT AND WORTH KEEPING.** The first
grouping check reported **1** row with an outline level and read as a failure.
The fault was the probe: `grep -c` counts matching **lines**, and a sheet's XML
is a single line, so it can only ever return 1. `grep -o … | wc -l` gives the
true 48, in the source and in the saved file alike. **A count taken with
`grep -c` over XML is meaningless** — it answers "is there any" and looks like
"how many".

**HIS PARKED NOTE MENTIONS 3.1.4 AND THAT IS NOT THE DEAD RULE COMING BACK.**
Row 63 reads *"Instead of 3.1.4, look downstory and then come up with a
premonition, etc for inclusion earlier."* That is his own note about egg
placement — the Film A / egg use, which yesterday's ruling explicitly left
standing. It was copied verbatim and untouched. The dead thing was the
requirement that every RECORD carry a 314, and nothing here restores it.

**Nothing in the museum tree changed in this round.** No deploy, no push.
