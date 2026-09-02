# PIECE 4 — THE WRITING SURFACE, BUILT AND PROVED (2026-08-26)

**HEAD at start `a3356c6`, tree clean.** Ops ruled all four items of the
pre-build report and this is the build.

**FILES:** `tools/dictation/day-collect.js` (new) · `tools/dictation/day-proof.mjs`
(new) · `tools/dictation/day.mjs` · `tools/dictation/record-serve.mjs` ·
`package.json` (+2 scripts) · `docs/dictation-20260807/day.html` (regenerated) ·
`docs/OPEN_ACTIONS.md` · `docs/OPEN_ACTIONS_CLOSED.md` · `docs/BACKLOG.md` ·
`docs/canonical/OPERATIONS.md`.

**NOTHING IN `src/` CHANGED**, so the museum lap does not apply. **Nothing was
landed:** the Record, the draft and the marks are byte-identical to where they
started, proved by sha256 below.

---

## 1 · WHAT HE ASKED FOR, AND WHERE EACH ONE IS

> *"I can edit any line and add sections on demand."*
> *"How do I delete a row? Insert a row?"*

| his ask | built | argued at |
|---|---|---|
| **edit any line** | every section body, every section header, and the five string fields are boxes | `elementHtml`'s `editBox` |
| **add sections on demand** | `+ add a section` at the foot of the day | `dy-add` |
| **insert a row** | `+` on any section row, inserting directly below it | `rowControls` |
| **delete a row** | `×` on any section row — **struck through and kept, reversible until the save lands** | `rowControls` + `.dy-el.gone` |
| **the section recipe** | unchanged, and now built as the thing itself rather than as its shape | `elementHtml`, `blocksOf` |

**THE RECIPE IS HIS SPECIFICATION AND EVERY CLAUSE OF IT IS A MEASUREMENT.**
*accepts crlf* — a `textarea`. *expands* — `autosize()` sets the height from the
content on every keystroke, with `overflow:hidden`, so it has as many lines as
he gives it and never a porthole. *width sized to warn* — the same `68ch` in the
same monospace face, **measured on the served page at 429.94px of content box**,
which is 68 characters exactly. *spaced like I show it* — `pre-wrap`.
*indented automatically* — 14px, one level, **one left edge on every row**.

**AND `blocksOf` IS WHY A SECTION CAN HAVE MORE THAN ONE BOX.** A body is a LIST
of items and the museum draws one paragraph each, so consecutive strings group
into one box with a blank line as the boundary. **A `{pre}` item takes a box of
its own** — 004's folder tree carries blank lines inside itself, so grouping it
would let a blank-line split cut one Listing into three. Alone, there is no
split to get wrong and it is fully editable.

## 2 · THE SAVE — ONE ENDPOINT, TWO FILES, AND IT NEVER CLAIMS THE RECORD

**OPS WAS RIGHT THAT `record-serve.mjs` IS THE PATTERN, AND THE INSTANCE WAS
ALREADY POINTED AT THE RIGHT DIRECTORY** — its `ROOT` is where `day.mjs` writes
its page, so no second server and no second draft path exist. `/day/save` and
`/day/source` joined it; `/save` is untouched.

**THE MARKS TRAVEL WITH THE WORDS**, on Ops' ruling. `readiness.json` was a
clipboard with no writer — *"copy this and Ops lands it"* — and the textarea and
its copy button are **gone**, replaced by the save. Measured live: one request
wrote 5 records to the draft **and** a `notReady` mark to `readiness.json`.

**IT NEVER SAYS IT WROTE THE RECORD.** The endpoint answers with the landing
command; the page prints *"The Record itself is not written — that is
`npm run record:land -- --write`, and it is yours"*; the server window prints
the same line on every save. Asserted in `day:proof`.

**AND THERE IS NO FILE PICKER ON THIS PAGE, DELIBERATELY.** The Record editor
falls back to `showSaveFilePicker`, which **exists** on an http origin — so a
save aimed at a server that is not listening opens a folder dialog and reports
success about a file outside the repo. The day editor's only fallback is **the
whole draft as text, on the screen, with the reason above it**. Measured: when
the page went stale it put **7,859 characters** in that box.

## 3 · THE GUARD THE PIECE COULD NOT SHIP WITHOUT

**LOSS 5 FROM THE PRE-BUILD REPORT, AND IT IS BUILT ON BOTH ENDS.** `npm run
day` bakes the source file's sha256 into the page; `/day/save` refuses a POST
whose sha is not the file on disk NOW; the page re-asks `/day/source` on focus.

**PROVED BY LOSING IT FIRST, ON REAL DATA.** `day:proof` runs the sequence with
the guard absent:

```
14:00  a paragraph lands in Record 001:
       "The paragraph that arrived at 14:00 and was never seen again."
16:00  the STALE page saves with a TRUE timestamp, guard 8 PASSES (exit 0),
       and the 14:00 paragraph is GONE.
```

**Guard 8 compares the STAMP, not the WORDS, and the stamp is true.** It is not
defective — the draft really is new; it is the PAGE that is old. Then the same
save through the real server: **409, `stale: true`, by name, nothing written.**

**AND IT WAS DRIVEN IN THE BROWSER TOO, NOT ONLY IN THE HARNESS.** The Record
file was moved under an open page: the page went loud, **disabled Save**, named
both shas and both mtimes, and put every character in the way-out box.

## 4 · `npm run day:proof` — 29 CHECKS, 5 OF THEM LOSSES

**CHECK ZERO IS THAT THE COLLECTOR UNDER TEST IS THE ONE HE TYPES INTO.**
`day.html` inlines `day-collect.js` verbatim and the proof asserts the bytes
match before anything else runs. **A proof that passes against a second
implementation is a fact about the proof.**

Each breakage is **the real file with one behaviour removed**, not a stub:

| shown LOSING | what goes |
|---|---|
| the `rest` spread removed | Record 003 loses **4 attachments and 6 plates** — and the emitter *cannot* refuse it, because an ABSENT field is not something its guard can see |
| `{pre}` preservation removed | 004's folder tree comes back as **prose** — every character present, the shape gone |
| the box saves what it SHOWS | **opening the page and pressing Save** rewrites the indentation of every section he never touched |
| the staleness guard absent | the 14:00 paragraph, named above |
| a collector that drops a row by bug | reported **identically** to his own `×` — see the limit below |

**P1 ASSERTS THE FIELD SET, NOT ONLY THE PROSE**, because `record:land --verify`
printed *"ALL 51 STRINGS ROUND-TRIP"* on the day six photographs were destroyed.
It compares **every field of every entry**, and separately proves that opening
all five days and saving without typing leaves the Record **byte-identical**
(`20f4c8aa…`).

**P3's LIMIT IS STATED RATHER THAN GLOSSED, AS RULED:** the check cannot tell a
deliberate deletion from a bug. It makes sure **neither is silent**. Telling
them apart needs Mike to confirm, and that is a later piece.

## 5 · THE FINDING — FOUR OF THE FIVE DAYS CANNOT BE LANDED

**MEASURED, NOT ASSUMED.** `day:proof` lands a probe edit into each entry:

```
Record 001  lands
Record 002  REFUSED by guard 6 — it carries standing reasoning
Record 003  REFUSED by guard 6 — it carries standing reasoning
Record 004  REFUSED by guard 6 — it carries standing reasoning
Record 005  REFUSED by guard 6 — it carries standing reasoning
```

`record:land` guard 6 refuses a CHANGE to an entry carrying comment blocks,
because a generated entry has nowhere to put them. The Record is **38,229 of
49,535 characters of standing reasoning**. **THE GUARD IS CORRECT AND MUST NOT
BE WEAKENED.** The fix is its own instruction — move an entry's reasoning above
it, one entry at a time, with a judgement per entry.

**THE DAY EDITOR CAN WRITE A DRAFT FOR ANY DAY; FOUR OF THEM CANNOT BE MOVED
INTO THE TREE.** Register **`C-day2`**, and it is printed by `day:proof` on
every run so it is reported rather than discovered.

*(Related and pre-existing: `npm run record:proof` fails 3 checks at HEAD,
verified pre-existing 2026-08-25. One of them — "a CHANGE to a commented entry
is REFUSED, names Record 001" — now fails because **001's comments moved out**,
which is the same fact from the other side. Not touched.)*

## 6 · WHAT WENT, AND WHAT MOVED

- **THE MARKS TEXTAREA AND ITS COPY BUTTON** — replaced by the save (§2).
- **`day.mjs`'s PRINTED `npm run mock` URL** — it was correct for a read-only
  page and became **the documented way to lose a save** the moment the page took
  a keystroke, because the mock never reads `req.method`. It now prints
  `npm run day:serve` and says why the mock cannot do it. **A printed
  instruction that silently loses a save is not a doc fix.**
- **`dedent`, `blocksOf` and `budgetMark` LEFT `day.mjs`** for `day-collect.js`,
  which the generator now evaluates rather than duplicating. The first build of
  this piece had two of each and they happened to agree; the drawn arrangement
  and the saved arrangement are the two things that must never be able to.
- **`/` ON THE SERVER IS THE DAY EDITOR NOW.** The Record editor keeps its own
  address, unchanged.

## 7 · MEASURED ON THE SERVED PAGE — `http://127.0.0.1:8899/`

**NOT PHOTOGRAPHED. The browser pane would not composite** — *"the page is not
compositing frames"* — the same refusal as pass five, so everything below is
through the DOM, computed styles and geometry.

| | |
|---|---|
| box content width | **429.94px = 68ch exactly**, monospace |
| box total, before and after the overflow fix | **447.94px, unchanged** |
| left edges | titles **one**, lines **one**, control column **one** |
| indent | **14px, one level, every row** |
| sideways overflow | **0** at desktop, **0** at 375px |
| page scroll at desktop | **0** — pass four's ruling holds |
| calendar marks | **7, 7, 7, 7, 7** — pass five's ruling holds |
| hinted nodes | **476**, zero bare `title=` |
| console errors | **0** |
| edit a line | box grew 63px → 80px on the keystroke |
| insert a row | 5 → 6 sections, new row empty |
| delete a row | struck, **text kept**, says DELETED, **and comes back on a second press** |
| add a section | 6 → 7 |
| live budget mark | 70 characters → **`70/62` red**; back under → the mark **leaves** |
| a mark follows a rename | `section:EXECUTIVE SUMMARY` → `…RENAMED`, mark moved, old key gone |
| the save | **SAVED — 5 record(s), 7,798 characters**, both files written |
| the deletions | **named in the response, the page and the server log** |

**ONE DEFECT WAS FOUND BY LOOKING AND WOULD NOT HAVE BEEN FOUND ANY OTHER WAY:**
a hidden element has a `scrollHeight` of **zero**, so the boot-time autosize left
four of the five days' boxes one line tall — **16px of box holding 47px of
text** — and only the day that happened to be open was right. The height is set
when a day is revealed now. **A second was found at 375px:** a `content-box`
textarea at `width:100%` is its parent PLUS its padding, border and indent, so
the page scrolled sideways by 18px. Border-box with `max-width: calc(68ch +
18px)` keeps the content box at 68ch and the total identical.

## 8 · GATES — real exit codes, captured per gate

| gate | exit |
|---|---|
| `npm run lint` | **1 — the baseline**: 17 problems, **9 errors / 8 warnings**, zero new |
| `npm run build` | **0** |
| `npm run provenance:gate` | **0** |
| `npm run reveal:check` | **0** |
| `npm run instory:gate` | **0** |
| `npm run parity:gate` | **0** |
| `npm run arc:check` | **0** |
| `npm run ops:size` | **0** (re-run after the OPERATIONS edits) |
| `npm run docs:numbers:gate` | **0** (re-run after the OPERATIONS edits) |
| `npm run reveal:day` | *"Nothing to move. The tree and the Record agree."* |
| `npm run lap:clean` | nothing left in `public/` |
| `npm run record:land -- --verify` | **0** — 51 of 51 strings |
| **`npm run day:proof`** | **0 — ALL 29 CHECKS PASSED, 5 shown LOSING first** |

**THE THREE FILES THIS ROUND WROTE TO, AFTER:**

```
src/data/artists/robots-record.js          20f4c8aaae14f91a5cd3363a0142c0ec…
docs/dictation-20260807/record-draft.json  13fe608bc74714334b91eb1a6c42a900…
docs/dictation-20260807/readiness.json     a1b65c0bfa0106b7436da60a9a2fddc6…
```

All three identical to where they started. `day:proof` proves its own
restoration the same way on every run.

## 9 · CARRIED, UNCHANGED

- **`STAGE_PREFIX` is imported by `day.mjs` and used by nothing.** Flagged since
  pass one.
- **`reveal/day.mjs` exports `plan()` and nothing can import it** — a script
  with no main guard. Step 12 of `SUNDAY-20260830.md`.
- **`npm run record:proof` fails 3 checks at HEAD**, pre-existing (§5).
- **`record.html` still has the picker fallback** and will still open a folder
  dialog if served by the mock. It is mothballed and Mike has ruled it dies when
  Piece 4 ships; **that ruling is not Ops' to execute** and this round did not
  touch it. It is a hazard lead line in OPERATIONS §8.
- **The calendar's seven marks read the BUILD**, and dim with a note the moment
  anything is edited. The page does not recompute them: a second implementation
  of the seven columns would drift from the one that refuses a packet, and the
  one that drifted would be the one he is looking at.

## 10 · AFTER THE COMMIT — THE ONE LINE THAT WAS WRONG

**`73179dc` ENDS ON `Log: C:\AI\_night-20260826\PIECE4_BUILD_LOG-20260826.md`,
AND `git interpret-trailers` PARSES THAT AS A TRAILER.** Any `Key: value` line
in a message's final paragraph is one; the key does not have to be a name git
has heard of. **It is pushed and it stands** — rewriting history for one line is
worse than the line.

**THE REPORTED CHECK WAS THE REAL DEFECT.** This round confirmed "no trailers"
by grepping the file for trailer NAMES — `co-authored-by`, `signed-off-by`,
`generated with` — and reported zero hits as proof. **A grep for known names
cannot see trailer shape.** The command that can is
`git interpret-trailers --parse < <file>`, and run over the ten messages of
2026-08-25 it returns **clean on all ten**: the house shape was already
unanimous and this round was the one message that broke it.

**FILED WHERE THE NEXT MESSAGE GETS WRITTEN**, not here: `CLAUDE.md` §
Conventions, beside the commit-message rule it belongs to.

**THE MESSAGE FILE IS LEFT AS IT IS** — it is a faithful copy of what
`73179dc` carries, and correcting it would make the record disagree with the
history it records. It is therefore the one file in either night directory that
the new check flags, on purpose.
