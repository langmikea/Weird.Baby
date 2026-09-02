# THE ROUND-TRIP REPAIR (2026-08-25)

**HEAD at start `6a65070`.** Five files: `reveal/record-entries.mjs`,
`tools/dictation/emit-record-entries.mjs`, `tools/dictation/record-edit.mjs`,
`tools/dictation/day.mjs`, and the regenerated `docs/dictation-20260807/record.html`.

**This is what stood between the day editor and Mike typing into it.**

---

## 1. THE FULL SET — SEVEN ASYMMETRIES, AND OPS KNEW OF THREE

Established by measurement, not by reading the lists: a **fixture entry
carrying every field `DRAWN_ENTRY_FIELDS` names, in every shape the renderer
accepts**, run through the real reader and the real emitter. Each "drawn" claim
below was then confirmed at its render site rather than taken from the list.

| # | field | where the museum DRAWS it | what the round trip did | knew? |
|---|---|---|---|---|
| 1 | `stamp` | `record-model.js:100` → `Exhibit.jsx:5239, 5475` | reader **reported**, emitter dropped | no |
| 2 | `note` | `RecordEntry.jsx:749` | reader **reported**, emitter dropped | no |
| 3 | `wire` | `record-model.js:180, 221-226` → `Exhibit.jsx:5509-5511` | reader **reported**, emitter dropped | yes |
| 4 | `plates` (entry) | `record-model.js:181, 231-242` | reader **reported**, emitter dropped | yes |
| 5 | section `doors` | `RecordEntry.jsx` `SectionBody` | reader **reported**, emitter dropped | no |
| 6 | body `{pre}` | `SectionBody` → `Listing` | text carried, **marker lost** | yes |
| 7 | **`docs.*`** — `source`, `date`, `pages`, `scan`, `extract`, `note`, `plates` | `RecordAttachments` / `record-model.js:253-271` | **carried by the reader and DROPPED BY THE WRITER, in silence** | **no** |

Plus **`evidence`**, an eighth of a different kind: declared in his model,
**deliberately undrawn** since R5, and not carried.

### THE DISTINCTION THAT MATTERS MORE THAN THE COUNT

**SIX OF THE SEVEN WERE ALREADY LOUD.** The reader files them in `unreadable`,
and `recordShapeFaults()` — the list `reveal:check` and `npm run record` read —
returns them. Measured on the fixture: it returns a fault naming `evidence` and
a fault naming section `doors`, by record number and field name. The reader half
of this trip has been honest since 2026-08-11 and is not where the danger was.

**NUMBER 7 WAS THE ONLY SILENT ONE, AND IT IS THE ONE NOBODY HAD NAMED.** The
reader was taught `source`/`pages`/`plates` on 2026-08-19 *precisely so they
would travel*; the emitter then wrote them away, with nothing printed anywhere.

## 3. PROVED BY LOSING SOMETHING FIRST

**BEFORE, ON REAL DATA.** Record 003 read out of the tree with four attachments
carrying `source`, `pages` and six plates with their captions. Through the real
`record:land`:

```
docs: [
  { title: "Scan 07 - Power supply and distribution" },
  { title: "Scan 11 - The video link" },
  { title: "Scan 31 - Bias settings" },
  { title: "Marked copy 01 - Bias settings" },
]
```

**Four sources, four page counts and six published photographs with their
captions — gone.** And the tool's own proof said this, in the same run:

```
ALL 51 STRINGS ROUND-TRIP: his characters are unchanged.
```

**BEFORE, ON THE FIXTURE.** The emitted entry carried no `stamp`, no `wire`, no
`plates`, no `note`, no `doors`, and Record 004's folder tree came back as an
ordinary paragraph.

**AFTER.** Same fixture, same tools:

- field set in: `date, docs, lead, line, no, note, plates, sections, stamp,
  still, stillCaption, title, tomb, wire`
- field set out: **identical**
- **deep equal ignoring key order: true.** (Key order inside a JS object literal
  differs — `pages` is emitted after the string fields — and key order is not
  data. Stated rather than glossed.)
- the listing came back as `{"pre":"    ROOT\n     /PORTAL\n       TERMINAL.EXE"}`

**AFTER, ON THE REAL RECORD, END TO END** — real source → reader → real emitter
→ parsed back → compared field by field, all five entries:

```
WHOLE — every field of every entry survived the round trip.
reader reported: 0 on the way in, 0 on the way back
```

And `record:proof`'s strongest check still passes: **a no-op landing is
BYTE-IDENTICAL**, sha `20f4c8aa…`.

## 2. THE REPAIR — CARRY OR REFUSE, PER FIELD

| field | choice | why |
|---|---|---|
| `stamp` | **CARRY** | a plain string, printed on the index row and the opened head. Nothing to interpret. |
| `note` | **CARRY** | a plain string, drawn as `.vp-fe-note`. |
| `wire` | **CARRY** | a list of strings; the renderer draws one `<li>` per line. |
| `plates` (entry) | **CARRY** | `{ img, label }` — **the same shape the attachment half was already reading**, so it is now one `platesOf()` for both places a plate hangs. Two readers for one shape is how halves drift. |
| body `{pre}` | **CARRY the marker, not just the text** | folding it to a string kept every character and threw away the one bit that says they are COLUMNS. The item is returned in the shape the source wrote and the renderer accepts. |
| `docs.*` | **CARRY — the emitter writes them now** | the old comment said only `title` is written "because only `title` is what he wrote", and that filling the rest would be inventing provenance. **The first half is still true and the second confused authoring with carrying.** Nothing here authors a doc field; a field that arrived is written back. |
| section `doors` | **REFUSE, loudly** | doors are Ops' wiring, not his writing, and their shape varies by kind. A reader that half-understood one could emit a broken door, which is worse than refusing. It is reported by record number and section number, and `reveal:check` reads that list. |
| `evidence` | **REFUSE, loudly** | nothing draws it (struck at R5), no entry carries one, and its shape is undeclared. Teaching a reader for an unused field would be guessing at a shape. |

**AND THE EMITTER NOW REFUSES WHAT IT CANNOT WRITE.** `EMITTED_ENTRY_FIELDS`
and `EMITTED_DOC_FIELDS` are the mirror of the reader's sets — a list of what is
*emitted*, not of what is allowed, the same construction as
`DRAWN_ENTRY_FIELDS`. A draft carrying anything else stops the run by name
before a byte reaches disk. **That is the half that was missing: the reader has
refused since 2026-08-11 and the end that WRITES THE TREE never did.**

**THE TRAP THIS ROUND HAD TO AVOID IS NAMED IN THE FILE IT EDITS.** The
2026-08-19 note warns that widening `READ_ENTRY_FIELDS` *alone* silences a true
warning while the tool downstream still drops the field. So the set, the reader
and the emitter were widened together, and the before/after above is what proves
it rather than the list.

### WHAT ELSE HAD TO MOVE, AND WHY

- **`textOf()`**, exported from `record-entries.mjs`: the one place anything asks
  a body item for its words. Every site that assumed a string calls it, so a
  third shape is one function to teach rather than six sites to find.
- **`record-edit.mjs`**: `indexOf(c.after)` → `findIndex(p => textOf(p) === …)`,
  and the audit set stores `textOf(p)`. **Proved not to change behaviour where
  it matters:** Records 001 and 003 (the two that print misplaced-note warnings)
  carry **only string bodies**, and for an all-string body the two tests are the
  same test. Those warnings are pre-existing.
- **`day.mjs`**: draws `stamp` now — a field the reader carries and the editor
  hides is the same hole one surface further on — and its **`locked` flag came
  off**. That flag said `wire`, `plates` and `note` "cannot survive the draft
  round-trip": true when written, false as of today.
- **`record.html`** regenerated. **The only difference is Record 004's folder
  tree seeding as `{"pre":"…"}` instead of a bare string** — the repair landing.
  That editor already declared it will not find that node (mothballed for week
  one), and its own header says so.
- **`day.html` did not change at all**, and that is the expected reading: no
  entry carries `stamp`, `wire`, `plates` or `note` today, so the page is
  byte-identical.

## 4. THE GUARD THAT SHOULD HAVE CAUGHT IT — REPORTED, NOT BUILT

**NOTHING COMPARES THE THREE LISTS, AND THEY LIVE IN THREE FILES.**

| list | file | asks |
|---|---|---|
| `DRAWN_ENTRY_FIELDS` | `tools/reveal-ledger.mjs` | does anything RENDER this? |
| `READ_ENTRY_FIELDS` | `reveal/record-entries.mjs` | can the surface HOLD it? |
| `EMITTED_ENTRY_FIELDS` | `tools/dictation/emit-record-entries.mjs` (new today) | can the tree be WRITTEN with it? |

Each guards its own edge and **no one asserts the relation between them**, which
is why this bit twice: 013 lost four paragraphs at the reader, and the
attachments lost six photographs at the writer, years of process apart, for the
same structural reason.

**WHAT WOULD CATCH IT:** a check asserting **DRAWN ⊆ READ ⊆ EMITTED**, with an
explicit exemption list carrying a written ruling per exemption — the same
construction `DRAWN_ENTRY_FIELDS` already uses for `evidence`. It must cover the
sub-levels too: `READ_SECTION_FIELDS`, `READ_DOC_FIELDS`, `EMITTED_DOC_FIELDS`,
and the body-item shapes. **It does not merge the lists** — the three questions
are genuinely different and the files say so at length; it asserts a relation
between them and names the field that breaks it.

**WHERE IT BELONGS: `reveal:check`, not its own tool.** Three reasons.
(1) `reveal:check` **already owns `DRAWN_ENTRY_FIELDS`** — one of the three sets
is already in that file, so the check is a function beside its own data rather
than a new reader of somebody else's. (2) It **runs on every packet** and already
refuses one; a separate tool is a sixth command in §9's list, and §0 records that
every gate in this tree except the deploy guard is human discipline — a gate
nobody has to remember is the only kind that has held. (3) The other two sets
would need exporting, which is a one-line change each and makes the coupling
visible rather than implicit.

**AND A SECOND FINDING BELONGS WITH IT.** `record:land --verify` prints **"ALL
51 STRINGS ROUND-TRIP: his characters are unchanged"** — which is TRUE and is
read as *the entry round-tripped*. It compares prose, by design, because it was
built for the transcription-loss problem. It printed that green while six
photographs were being destroyed. Whatever the guard becomes, **that line should
say what it proved and what it did not.**

## FLAGGED, NOT FIXED

- **`npm run record:proof` FAILS 3 OF ITS CHECKS, AND IT DOES SO AT HEAD.**
  *"a CHANGE to a commented entry is REFUSED"*, *"a change to an UNcommented
  entry (005) lands and loses no comments"*, and *"guard 6: it may not eat the
  reasoning"*. **Verified pre-existing rather than assumed:** my four changed
  files were snapshotted with sha256, restored to HEAD with `git checkout --`,
  the proof re-run — **identical three failures** — and my work restored and
  proved byte-identical against the snapshot. Not touched: this round is the
  round trip, and a red that predates it is not mine to quietly absorb.
- **`STAGE_PREFIX` is imported by `day.mjs` and used by nothing.** Carried.

## GATES — real exit codes, captured per gate

| gate | exit |
|---|---|
| `npm run lint` | **1 — the baseline**: 17 problems, 9 errors / 8 warnings, zero new |
| `npm run build` | **0** |
| `npm run provenance:gate` | **0** |
| `npm run reveal:check` | **0** |
| `npm run instory:gate` | **0** |
| `npm run parity:gate` | **0** |
| `npm run arc:check` | **0** |
| `npm run ops:size` | **0** |
| `npm run docs:numbers:gate` | **0** |
| `npm run record` | exit 0, 16 sections read, **1 written as a list+pre** |
| `npm run record:land -- --verify` | exit 0 |
| `npm run reveal:day` | *"Nothing to move. The tree and the Record agree."* |
| `npm run lap:clean` | nothing left in `public/` |

**Nothing in `src/` changed and no page was rebuilt except `record.html`**, so
the museum lap does not apply. **Nothing was landed:** every round trip in this
round ran against a draft in the scratchpad, and `record:proof` reports the
source file *identical to where it started*.
