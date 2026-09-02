# GUARD 6 — WHAT IS ACTUALLY IN THE WAY, AND WHERE IT BELONGS (2026-08-26)

**HEAD `ebb72d0`, tree clean. NOTHING WAS MOVED.** This is the report Ops asked
for before anything moves.

---

## 0 · TWO CORRECTIONS TO THE REGISTER ROW, BEFORE THE ANSWERS

**`C-day2` SAYS 38,229 OF 49,535 CHARACTERS. THE FILE NUMBER IS RIGHT AND IT IS
NOT THE NUMBER THAT MATTERS.** Measured with the guard's own `spansOf`:

| | characters |
|---|---:|
| the file | 49,535 |
| **comments above the array** — already outside every entry span | **16,743** |
| **comments inside entry spans** — what guard 6 actually sees | **21,486** |
| comments after the last entry (the `tail`) | 0 |

**So 44% of the reasoning is already where this work would put it.** What is in
the way is **21,486 characters in 17 blocks across four entries** — a smaller
job than the row implies, and the row will be corrected when the first entry
moves.

**AND THE SECOND CORRECTION IS THE SHAPE.** Guard 6 takes *"everything between
the previous entry and this one"* into the span, so there is no such thing as a
comment floating between entries — it belongs to the one below it. **All 17
blocks are INSIDE the object literal**, attached to specific fields. There are
exactly two homes in this file that are outside every span: **above
`export const RECORD_ENTRIES = [`**, and the tail after the last entry.

---

## 1 · WHAT IS IN THE 21,486, PER ENTRY

| Record | span | comment | % | blocks |
|---|---:|---:|---:|---:|
| **001** | 3,250 | **0** | 0% | **0** — which is the whole reason it lands |
| **002** | 4,232 | 2,579 | 61% | 2 |
| **003** | 6,464 | 3,333 | 52% | 2 |
| **004** | 13,452 | **11,592** | **86%** | **7** |
| **005** | 5,236 | 3,982 | 76% | 6 |

**READ WHOLE AND CLASSIFIED BY HAND.** Three classes:

| class | what it is | characters | share |
|---|---|---:|---:|
| **A — STANDING** | a rule that binds beyond this entry | **~5,980** | **28%** |
| **B — ENTRY-SPECIFIC** | what changed in THIS entry, what was struck from it, what he typed and why | **~12,350** | **58%** |
| **C — NEITHER** | notes about CODE, about CANON, and one credit | **~3,120** | **14%** |

### AND THE FINDING INSIDE CLASS A IS THAT IT IS MOSTLY ALREADY WRITTEN DOWN

**Every ruling these blocks cite by number already exists in
`docs/MUSEUM_RULINGS-20260817.md`** — 9, 10, 11, 12, 18, 19, 20 — in fuller
form than the comment that restates it. Spot-checked verbatim:

- *"We do not hold back what we say we have"* is **Ruling 9** at
  `MUSEUM_RULINGS-20260817.md:277` **and** at `canon/09-PUBLISHED.md:395`. It is
  quoted a **third and fourth** time inside Records 002 and 004.
- 004's block 6 opens with the back-post reasoning that **is Ruling 18**, and
  says so in its own words: *"THE PRECEDENT IS WRITTEN UP IN
  `docs/MUSEUM_RULINGS-20260817.md` AS RULING 17, not in a round log — the next
  round that wants to touch published text will reach for the rulings, and a
  diary does not answer questions."*

**SO MOST OF CLASS A IS NOT A MOVE AT ALL — IT IS A DUPLICATE TO DELETE AND
CITE.** That is the cheapest 28% of this job and it is also the one that needs
the most care, because *"mostly"* is not *"all"* and the per-entry pass is where
each one gets checked against its ruling rather than assumed.

---

## 2 · WHERE EACH CLASS BELONGS — AND "ABOVE THE ENTRIES" IS WRONG FOR MOST OF IT

**OPS' INSTINCT IS RIGHT AND THE TREE ALREADY AGREES WITH IT.** A preamble
would be one long undifferentiated block above five entries, and 004's block 6
has already ruled against that shape for exactly this material.

| class | home | why |
|---|---|---|
| **A — standing** | **`docs/MUSEUM_RULINGS-20260817.md`** | It is already the declared home, already carries every ruling these blocks cite, and is organised as numbered rulings a later round can reach for. Most entries here become a deletion plus a citation. |
| **B — entry-specific** | **`docs/canon/09-PUBLISHED.md`**, per-Record | It is already the per-Record page — the three states, the freeze, the back-post anchor — and *why 004's deck says what it says* is a fact about Record 004, which is what that page is for. **Not a preamble.** |
| **C — code mechanism** | **the code it describes** | 004's `listingRows()` note belongs at `listingRows` in `RecordEntry.jsx`; 004's `docState()`/`held` note at `src/lib/record-model.js`; 005's braces note at `wb-ops-braces`. Each is about a function, not about a Record. |
| **C — canon fact** | **`docs/canon/06-PORTAL.md`** | Several already say they are there — the UNIX-6x Emulator, the COMM payload, the far end's console. The comment is a pointer with a copy attached. |
| **C — one credit** | the credits/provenance | 003's *"THE PEN IS MIKE'S OWN HAND — he is the PEN WRITER, logged for the credits page."* That is a credit, not reasoning about an entry. |

**THE ONE THING THAT MUST NOT MOVE INTO A DOCUMENT: nothing.** Every block is
Ops' prose about Mike's words. **None of it is his text**, and no character of
the Record's strings is touched by any of this.

---

## 3 · WHAT BREAKS IF IT MOVES

### WHAT THE GUARD SEES, BEFORE AND AFTER

Guard 6 is **two guards** and they behave differently:

| | before the move | after |
|---|---|---|
| **the per-entry block** (`emit-record-entries.mjs:574`) — `span.text.match(/\/\*…\*\//g)` on a CHANGED entry | 2 / 2 / 7 / 6 blocks → **REFUSED** | 0 blocks → the entry regenerates |
| **the global block** (`:908`) — `commentChars(oldBody)` vs `commentChars(BODY_OUT)`, refuses if `gets < had` | compares body-to-body | still compares body-to-body, both post-move → **equal, passes** |

**AN UNCHANGED ENTRY IS SPLICED BYTE FOR BYTE** (`pieces.push(span.text)`), so
moving comments out of 002 does **not** alter 003, 004 or 005 on any landing.

**AND THE ONE REAL COST, STATED: the first edit to an unblocked entry
REFORMATS that entry.** `generate(e)` writes it fresh, so its indentation and
string folding become the emitter's rather than the file's. No character of his
prose is lost — guard 5 byte-verifies every string and rolls back on mismatch —
but that entry's source shape changes in the same commit as his first edit.

### WHAT ELSE READS THAT FILE BY POSITION

Swept every reader of `robots-record.js` — 17 files:

- **`reveal/record-entries.mjs` parses with acorn.** AST, not position. Safe, and
  it is what the museum, the gates and the day editor all read through.
- **`emit-record-entries.mjs`** is the only positional reader that matters, and
  its positions are the thing being changed on purpose.
- **`tools/dictation/record-land-proof.mjs:100`** carries
  `/\n {12}\{ no: 6,[\s\S]*?\n {12}\},\n/` — **it assumes an entry starts at
  twelve spaces.** `generate()` emits `            { no: …` — twelve. It holds,
  and it is named here because a reformat that changed the indent would break a
  proof nobody would think to check.

### AND THE THING THE GUARD'S OWN HEADER PREDICTED — MEASURED, AND IT IS LIVE

> *"THE ONLY THING STOPPING `--write` FROM REVERTING THEM WAS THIS GUARD, and it
> was stopping it for an unrelated reason… the day somebody does the work this
> guard exists to force, the reversion becomes live."*

**MEASURED TODAY.** `record-draft.json` is stamped `2026-08-24` and **one of the
five entries has drifted:**

```
Record 001: in step      Record 004: DRIFTED on sections
Record 002: in step      Record 005: in step
Record 003: in step
```

The drift is exactly Record 004's folder tree:

```
draft  item 1:  "    ROOT\n     /(many pwd protected folders)\n     /PORTAL\n…"
tree   item 1:  {"pre":"    ROOT\n     /(many pwd protected folders)\n     /PORTAL\n…"
```

**That is the `{pre}` loss `a3356c6` repaired, sitting in the draft, held back
today only because 004 is blocked by its comments.** Unblocking 004 makes it
live: 004 reads as CHANGED, regenerates, and the listing lands as a paragraph.

**SO THE DRAFT REFRESH IS A PRECONDITION, NOT A FOLLOW-UP** — the guard's own
header says so, and this is the entry and the field it names.

---

## 4 · ONE COMMIT OR FOUR — I AGREE WITH FOUR, AND ASK FOR A FIFTH FIRST

**FOUR IS RIGHT AND THE REASON IS THE GUARD'S OWN SHAPE.** Guard 6 is
per-entry, so the unblocking is per-entry, and each commit ends with a
measurement that entry now lands. A judgement that turns out wrong costs one
entry. **No ordering dependency exists between them.**

**SEQUENCE, LIGHTEST FIRST, SO THE MECHANISM IS PROVED BEFORE THE HARD ONE:**

| # | entry | blocks | characters | why here |
|---|---|---:|---:|---|
| 1 | **002** | 2 | 2,579 | smallest; both blocks are one shape (struck lines + a Ruling 9 restatement) |
| 2 | **003** | 2 | 3,333 | the heaviest class-A share — the rulings-file half gets exercised early |
| 3 | **005** | 6 | 3,982 | many small blocks; tests the per-field pass |
| 4 | **004** | 7 | 11,592 | 86% of its own span, every class, and the `{pre}` drift lands on it |

**MY ONE DISAGREEMENT IS AN ADDITION, NOT A REDUCTION: a commit 0 that refreshes
`record-draft.json` from the tree.** It is a precondition (§3), it belongs to no
entry, and folding it into 002's commit would make that diff two unrelated
things. It is mechanical and lossless — `draftEntries()` reads the landed source
and returns the draft's own schema.

**So: five commits, four of which are one entry each.**

---

## 5 · WHAT PROVES NOTHING WAS LOST

**"IT LOOKS THE SAME" IS NOT AVAILABLE HERE — THE REASONING IS THE THING BEING
MOVED**, so the proof is that each block's bytes are somewhere else, named.

1. **PER BLOCK, BY sha256.** Before the move, every block in the entry is
   hashed. After, the check asserts **those exact bytes are present in the named
   destination file**. A block that was deliberately DELETED as a duplicate is
   listed separately with the ruling number that already carries it — **a
   deletion is allowed and it is never silent.**
2. **THE MUSEUM'S OWN READER RETURNS AN IDENTICAL ENTRY SET.** `draftEntries()`
   deep-equal before and after. The move touches only comments, so this must be
   **exactly** unchanged — the cheapest and strongest single check, and the one
   that would catch a comment marker eaten mid-string.
3. **COMMENT CHARACTERS ACROSS BOTH FILES BALANCE.** `source before` =
   `source after` + `destination gained` + `named duplicates deleted`.
4. **`npm run day:proof` ON EACH ENTRY AS IT LANDS**, and its `P1.3` table is
   the per-entry acceptance measurement — the entry just moved must flip to
   `lands`, and **the entries not touched must not move**.
5. **A NO-OP LANDING IS STILL BYTE-IDENTICAL** for every entry that was not
   touched, and `record:land -- --verify` still reads 51 of 51 strings.
6. **AND IT BECOMES RE-PROVABLE RATHER THAN PROVED ONCE.** I propose `P6` in
   `day:proof`: a manifest of moved blocks with their shas and destinations,
   asserted on every run. **Proved by breaking it first** — delete one line from
   a moved block in its destination and watch the check name it.

---

## WHAT I AM WAITING ON

Ops' ruling on all five, and in particular:

1. **The homes in §2** — the rulings file for A, `canon/09-PUBLISHED.md` for B,
   the code for C's mechanism notes. Not a preamble.
2. **Commit 0, the draft refresh.** It is a precondition and it is the one thing
   in this report that is not one of the four entries.
3. **Whether a duplicate may be DELETED rather than moved**, given it is already
   in the rulings file verbatim. That is Doctrine 24's shape and it is Ops'
   call, not mine — the alternative is carrying four copies of Ruling 9.
