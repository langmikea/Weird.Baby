# FINDING — what the day-editor save actually writes

**Round:** the day-editor save, read-only packet. **Written:** 2026-08-29.
**Scope:** READ ONLY. The draft was not saved. `record:land --write` was not run.
The editor was not opened and nothing was clicked. Every defect is flagged and
none is fixed.
**Repository:** `C:\AI\Projects\weird-baby-museum`, branch `main`.

**Method notation.** **READ** — the tree states it, at a named file and line.
**RUN** — a command or an in-memory evaluation was executed and this is its
output. Nothing below was established by saving.

> **THE ONE-LINE ANSWER.** An untouched save cannot alter Mike's words —
> proved three ways in §2. But **the save does not clear `day:proof`, and it
> makes `record:land` refuse where it passes today.** Record 005's attachment
> carries a `door` field the emitter cannot write, and a fresh save is what puts
> that field in front of it. §5. That is a code change, not a save, and the
> previous packet's prepared file says otherwise — corrected in §6.

---

## 1 · WHAT A SAVE REWRITES AND WHAT IT CARRIES THROUGH

A save is three hops: the browser's model → `collect()` → `POST /day/save` →
`record-draft.json`.

### 1.1 · The six top-level keys the SERVER writes

`tools/dictation/record-serve.mjs:209-219`. READ.

| key | rewritten or carried | value |
|---|---|---|
| `_` | **rewritten every save** | a fixed sentence, from a literal in the server |
| `key` | carried, with a fallback | `parsed.key \|\| "wb.day.2026-08-26"` |
| `saved` | **rewritten every save** | `new Date().toISOString()` |
| `epoch` | carried from the page | `parsed.epoch \|\| null` — the page's, baked from the tree |
| `source` | **rewritten every save** | `sha256` + `mtime` of `robots-record.js` **as it is on disk at that instant**, `:106-118` |
| `entries` | **carried verbatim** | `parsed.entries` — the browser's `collect()` output, written through untouched |

`JSON.stringify(draft, null, 1) + "\n"` — `:219`. READ.

**`readiness.json` is written FIRST and the draft second, deliberately** —
`:222-230`, READ: if the second write fails, what survives is the small derived
file and his prose is still in the browser.

### 1.2 · The entry fields the COLLECTOR owns

`tools/dictation/day-collect.js:245-260`. READ.

```js
var STRING_FIELDS = ["stamp", "title", "line", "lead", "still", "tomb", "note"];
...
var edited = { no: 1, date: 1, sections: 1 };
for (i = 0; i < STRING_FIELDS.length; i++) edited[STRING_FIELDS[i]] = 1;
for (k in entry) if (... && !edited[k]) day.rest[k] = entry[k];
```

| | fields | treatment |
|---|---|---|
| **Owned — become boxes** | `stamp` `title` `line` `lead` `still` `tomb` `note`, plus `sections` (labels and bodies) | passed through `outOf()` / `blockOut()` |
| **Owned — not a box** | `no`, `date` | copied from the model; `date` comes from the page, which `draftEntries()` resolved against the CURRENT epoch |
| **Carried in `rest`, untouched** | everything else — **`docs`**, `wire`, `plates`, `stillCaption`, and any field this file has never heard of | spread back first, so an owned field always wins and an unknown field always survives |

`collect()` at `:269-272` spreads `rest` **before** the edited fields — READ —
which is why *"a field it does not own survives whether or not this file has ever
heard of it."*

**A cleared field is DELETED, not emitted as `""`** — `:282`, READ:
`if (v === "") delete e[k];`. **A section whose boxes are all empty is dropped
entirely, header with it** — `:302`. Both are the museum's own stated behaviour,
not a side effect.

---

## 2 · CAN A RESAVE ALTER MIKE'S WORDS?

**No — not an untouched one. Established three ways, none of them a save.**

### 2.1 · The collector returns the original object, not a rebuilt one

`day-collect.js:130-134`, READ — one box:

```js
function outOf(f) {
  var t = String(f.text == null ? "" : f.text);
  if (f.orig != null && dedent(f.orig).text === t) return f.orig;
  return reindent(t, f.cut || 0);
}
```

`:178-181`, READ — one block:

```js
if (b.items && itemTexts(b).join(PARA) === t) {
  /* UNTOUCHED: the items that arrived, in the shapes they arrived in. */
  return (b.items || []).slice();
}
```

**An untouched box returns `f.orig` — the string that arrived, byte for byte. An
untouched block returns the original item array, boundaries and shapes intact.**
The dedent is display-only: `:100-104`, READ — *"an untouched box emits the
original string byte for byte."*

### 2.2 · The proof asserts the identity, and it passes

**RUN — `npm run day:proof`, P1:**

```
  ok    OPENING 5 days and saving them untouched changes NOTHING — 5/5 deep-equal ignoring key order
```

That is `collect(modelOf(e)) === e` for all five entries, field for field and
character for character. `day-collect.js:236-240` names it as *"the single
strongest thing `day:proof` checks."* The proof loads the **same bytes** the page
inlines — the page inlines the file at `tools/dictation/day.mjs:205-213` and
`day-proof.mjs:94-100` asserts the two are byte-identical by sha256 before a
single check runs. RUN, its first line:

```
  ok    tools/dictation/day-collect.js is inlined in docs/dictation-20260807/day.html byte for byte  (sha dd16cf1c12755875…)
```

### 2.3 · The HTML hop — the one place a browser could eat a character

The boxes are seeded as HTML: `>${esc(b.text)}</textarea>` and
`value="${esc(b.text)}"` — `tools/dictation/day.mjs:1489-1498`, READ, with
`esc` escaping `& < > "` at `tools/dictation/shell.mjs:25`.

Three HTML behaviours could alter a string on the way in: a newline immediately
after `<textarea>` is swallowed by the parser; `\r` is normalised to `\n`; and an
`<input type=text>` value strips CR and LF outright.

**RUN — all 44 boxes of the five entries, `esc()` applied and the HTML rules
modelled in memory:**

```
boxes examined       44
start with newline    0
contain CR            0
esc round-trip fail   0
titles with newline   0
```

**No box in the Record can trip any of the three.** The one-line `<input>` is used
for `title` alone — `day.mjs:696-702`, READ, and *"no headline in the Record
carries a newline"* — which the run above confirms rather than assumes.

### 2.4 · The emitter's re-wrap is a SOURCE transform, and it is verified

`generate()` writes strings back through `wrap(...)`, which re-flows them into
concatenated source literals — `tools/dictation/emit-record-entries.mjs:271-296`.
That changes the file's line breaks, never the string.

**RUN — `node tools/dictation/emit-record-entries.mjs --verify` (no `--write`),
exit 0:**

```
  ok  Record 001  5 section(s), 6 paragraph(s), 13 string(s)
  ok  Record 002  3 section(s), 3 paragraph(s),  8 string(s)
  ok  Record 003  3 section(s), 4 paragraph(s), 13 string(s)
  ok  Record 004  2 section(s), 4 paragraph(s),  9 string(s)
  ok  Record 005  3 section(s), 3 paragraph(s),  8 string(s)

ALL 51 STRINGS ROUND-TRIP: his characters are unchanged.
```

**COVERAGE LIMIT, STATED.** Those 51 strings are the **current draft's**. Record
005's attachment `extract` — *"Runs on the UNIX-6x Emulator. Reads
PORTAL_2v16.CFG."* — is not among them, because the current draft has no `docs`
on 005 (§3). **A fresh save adds a string this verifier has never checked.**

### 2.5 · Nothing re-cases and nothing re-punctuates

No step in the chain changes case or punctuation. `dedent` and `reindent` touch
leading spaces only; `esc` maps four characters to entities and back; `wrap` and
`q` alter source layout and quoting. **There is no transformation of letters
anywhere in the path.** READ, across `day-collect.js`, `shell.mjs:25` and
`emit-record-entries.mjs:271-296`.

### 2.6 · THE TWO WAYS IT *CAN* CHANGE — both named exactly

Neither is reachable by opening the page and pressing Save. Both need him to
type in a specific box, and both are flagged, not fixed.

**(a) `blockOut` re-indents by POSITION, and one block in the Record has mixed
indents.**

`day-collect.js:184-190`, READ:

```js
var c = i < cuts.length ? cuts[i] : (cuts.length ? cuts[cuts.length - 1] : 0);
out.push(reindent(parts[i], c));
```

**RUN — every block in the Record, leading runs measured:**

```
Record 1 sec 2 block 0  items 2  cuts [4,4]
Record 3 sec 2 block 0  items 2  cuts [4,2]   <-- MIXED
blocks total 18 | blocks with mixed cuts 1
```

**The exact field:** `src/data/artists/robots-record.js`, entry `no: 3`, section
**`ADDENDUM 02 - Personnel Folders (empty, names only)`**, body items 0 and 1:

```
item 0  leading run 4  ::  "    THE CEO         - one page, redacted to the letter…"
item 1  leading run 2  ::  "  ? Four people are described in a manual for a machin…"
```

**The exact transformation:** the box shows both paragraphs dedented and joined.
Touch it and `blockOut` re-splits on the blank line and re-indents paragraph *i*
with `cuts[i]`. Edit a character in place and both get their own cut back.
**Insert, delete or reorder a paragraph in that one box and the cuts shift by
position: the `? Four people` line takes the 4-space indent and `THE CEO` takes
2.** His characters survive; his layout does not. `day-collect.js:160-168` names
this block as the measured case the per-item dedent exists for, and stops one
step short of the reorder.

**(b) The textareas set `spellcheck="true"` and set no autocorrect attributes.**

`day.mjs:1492` and `:1497`, READ. `autocorrect`, `autocapitalize` and
`autocomplete` appear nowhere in the file — RUN, `grep` returns only the two
`spellcheck` lines. On a desktop browser spellcheck underlines and rewrites
nothing. **On a platform with automatic correction switched on — macOS
"Correct spelling automatically", iOS — a textarea can be rewritten under the
cursor**, and the collector would treat that as an edit he made, because it is
indistinguishable from one. Not measurable from this side, stated as exposure
rather than as a defect.

---

## 3 · THE DRAFT AGAINST THE TREE

**RUN — field-by-field diff of `record-draft.json` against `draftEntries()`, which
reads `src/data/artists/robots-record.js` (`reveal/record-entries.mjs:592-593`,
READ — the editor is seeded from the TREE, never from the draft):**

```
--- Record 001 ---   date  tree="2026-09-07"  draft="2026-08-31"
--- Record 002 ---   date  tree="2026-09-08"  draft="2026-09-01"
--- Record 003 ---   date  tree="2026-09-09"  draft="2026-09-02"
--- Record 004 ---   date  tree="2026-09-10"  draft="2026-09-03"
--- Record 005 ---   date  tree="2026-09-11"  draft="2026-09-04"
                     KEYSETS tree=date,docs,line,no,sections,title
                             draft=date,line,no,sections,title
                     only-in-tree: docs
```

**Four of the five differ in DATE ONLY. Not one line of prose differs anywhere.**
The draft header, READ: `saved: 2026-08-26T13:17:10.927Z`, `epoch: 2026-08-31` —
Ruling C's epoch. The tree moved to `2026-09-07` on 2026-08-28 (Ruling D), and the
draft has not been saved since.

**RECORD 005 DIFFERS IN MORE THAN A DATE, AND THIS IS THE THING TO CARRY.** The
tree holds an attachment the draft does not:

```json
{ "title": "TERMINAL.EXE",
  "source": "ROOT/PORTAL",
  "extract": "Runs on the UNIX-6x Emulator. Reads PORTAL_2v16.CFG.",
  "door": { "event": "wb-portal-run-console" } }
```

**That `door` is a live control.** `src/routes/robots/Robots.jsx:105` —
`window.addEventListener("wb-portal-run-console", run)`, READ. It is what runs the
Portal console.

**RUN — the dry run from the current draft emits `docs` under entries 3 and 4 and
NOT under 5:**

```
docs under:  { no: 3,
docs under:  { no: 4,
```

against three `docs: [` blocks in the tree, at `robots-record.js:544, 608, 669`.

**So the draft on disk right now, if it could land, would delete Record 005's
TERMINAL.EXE attachment and the Portal's door with it.** It cannot land — guard 8
refuses it, §5.1 — and the reason to write this down is that the guard is the only
thing standing there.

---

## 4 · THE SEQUENCE FOR THE SEVENTH — ONE SHOT

**Read §5 before running step 8. The dry run is EXPECTED to refuse, and that
refusal is not a failed save.**

**Steps 1-3 and 7-9 are Ops. Steps 4-6 are Mike's hands and nobody else's.**

1. **Ops — prove the tree is clean.** `git status --short` prints nothing. A
   dirty tree means the page would be baked against something uncommitted.
2. **Ops — rebuild the page from the tree.** `npm run day`. This is what makes
   the save current: `draftEntries()` reads `robots-record.js` and resolves
   `recordDay(n)` against `RECORD_EPOCH` as it stands today, and the page bakes
   the Record's sha256 into itself.
3. **Ops — start the server.** `npm run day:serve`. It prints the URL and the
   sha256 it was built against. **Leave this terminal visible — it is the proof
   surface in step 7.**
4. **Mike — open `http://127.0.0.1:8899/`.**
5. **Mike — before touching anything, confirm all four:**
   - **No red stale banner across the top.** If one is there it says *"The
     Record moved under this page. Nothing was saved."* and the Save button is
     already disabled — `day.mjs:2157-2163`, READ. If he sees it, **stop**, and
     go back to step 2.
   - **The button reads `Save to the repo` and is not greyed out** —
     `day.mjs:1676-1677`, READ.
   - **The five days read 7, 8, 9, 10 and 11 September 2026.** If they read 31
     August through 4 September, the page is the old one — **stop**, step 2.
   - **Record 005 shows an attachment titled `TERMINAL.EXE`.** If it does not,
     the page was seeded from the draft rather than the tree — **stop**, and
     nothing below is safe.
6. **Mike — click `Save to the repo`** (or Ctrl+S). **He types nothing. Not one
   keystroke in any box.** Every untouched box returns its original string
   verbatim, §2; a keystroke is the only thing that reaches the re-indent path.
7. **Proof it worked — two places, both must agree:**
   - The `day:serve` terminal prints one line:
     `saved  docs/dictation-20260807/record-draft.json  <n> bytes, 5 record(s)`
     — `record-serve.mjs:271-272`, READ.
   - The page's own confirmation appears beside the button (`dy-save-said`).
   **A 409 instead means the page was stale and NOTHING was written** —
   `record-serve.mjs:192-197`, READ. That is safe: the draft on disk is untouched.
8. **Ops — verify the draft, without landing anything:**
   ```bash
   node -e "const d=require('./docs/dictation-20260807/record-draft.json');console.log(d.epoch,d.saved);console.log(d.entries.map(e=>e.no+':'+e.date).join(' '));console.log('005 docs:',JSON.stringify((d.entries.find(e=>e.no===5)||{}).docs))"
   ```
   **It must print `2026-09-07`, a `saved` stamp from today, `1:2026-09-07
   2:2026-09-08 3:2026-09-09 4:2026-09-10 5:2026-09-11`, and a `005 docs:` line
   containing `wb-portal-run-console`.** Anything else and the save did not do
   what it was for.
9. **Ops — `npm run record:land`** (dry run, no `--write`). **Expect exit 1 and
   the `door` refusal quoted in §5.2.** That is the guard working on new,
   correct data. **Do not run `--write`. Do not "fix" it by deleting the
   attachment.**

**If step 7 shows a 409 or step 8 disagrees:** nothing has been lost. The draft
on disk is the one that was there before, the tree is untouched, and step 2 can
be repeated as many times as needed. **The one irreversible thing in this
sequence is `record:land -- --write`, and it is not in it.**

---

## 5 · WHAT IS STILL RED AFTER THE SAVE

**`npm run day:proof` exits 1 today — RUN, `6 of 49 CHECK(S) FAILED` — and the
save clears none of the six.**

### 5.1 · What the save DOES clear

Only one thing, and it is not a `day:proof` check: **guard 8's staleness
refusal.** `emit-record-entries.mjs:847-873`, READ —

> `record:land --write REFUSED — this draft is OLDER than the Record it would overwrite.`

`saved 2026-08-26T13:17:10.927Z` against the Record's last move. A fresh save
makes the draft newer and guard 8 stands down.

### 5.2 · What replaces it — and this is the finding

**A fresh save puts Record 005's `door` field in front of an emitter that cannot
write it, and `record:land` refuses — dry run and `--write` alike.**

`emit-record-entries.mjs:372-373`, READ:

```js
const EMITTED_DOC_FIELDS = new Set(
  ["title", "source", "date", "scan", "extract", "note", "pages", "plates"]);
```

`door` is not in it. `emitFaults()` at `:375-394` refuses by name, and the check
runs at `:396-404` — **before** the `--write` test at `:448`, so it governs the
dry run too.

**RUN — `emitFaults()` evaluated in memory against both sides. Nothing was
written:**

```
--- emitFaults over the CURRENT DRAFT (what record:land reads today) ---
   none  → dry run exits 0
--- emitFaults over the TREE (what a fresh save would write into the draft) ---
   Record 005: attachment 1 carries `door`
```

The message it will print, `:397-403`:

```
record:land REFUSED — the draft carries something this cannot write:

  Record 005: attachment 1 carries `door` and this emitter cannot write it. Teach generate(), or add it to EMITTED_DOC_FIELDS with the ruling.

Nothing was written. A field that reaches the emitter and not the tree is
the silent half of the round trip, and it is the half that edits the source.
```

**`record:land` currently exits 0 on the dry run ONLY because the draft is
missing data.** Fix the draft and the tool starts refusing. That is the guard
being right about both states.

### 5.3 · So `day:proof` P1.3 does not clear either

P1.3 seeds its probe drafts from the TREE — `day-proof.mjs:134`,
`const ENTRIES = draftEntries().entries`, READ — so **every one of its five probes
already carries `door`**, and that is why all five refuse today:

```
        Record 001  REFUSED —
        Record 002  REFUSED —
        Record 003  REFUSED —
        Record 004  REFUSED —
        Record 005  REFUSED —
  FAIL  0 of 5 existing days accept an edit from this page today (none). THE REST
        ARE WALLED BY guard 6 AND THAT GUARD IS CORRECT …
```

**Two defects are visible in those six lines and neither is guard 6.**

- **The reason prints empty because the message starts with a newline.**
  `day-proof.mjs:324` reads `r.out.split("\n")[0]`, and the emitter's message at `:398` is
  `console.error("\nrecord:land REFUSED — …")`. The first line of the captured
  output is `""`. READ, both ends.
- **The summary blames guard 6 and guard 6 is not firing.** `:323` only reaches
  the guard-6 wording when the output matches `/CHANGED carries/`; it does not, so
  every row falls to the `REFUSED — ` branch — and the summary line at `:330`
  asserts guard 6 anyway, from a constant. **The stated cause is wrong: it is
  `EMITTED_DOC_FIELDS`, not comment blocks.**

### 5.4 · The full red list after the save

| check | after the save | why |
|---|---|---|
| P1.3 — 3 FAILs | **still red** | `door`, §5.2. A code change, not a save. |
| P2 — 14:00 / 16:00, 2 FAILs | **still red** | the stale-page pair; both are the proof demonstrating guard 8's blind spot, and neither is data |
| P6 — 1 LOST | **still red** | a cited line was deleted from `docs/MUSEUM_RULINGS-20260817.md`; entry 2 block 0's claim *"the doctrine it quoted"* no longer resolves |
| `npm run record:land` dry run | **0 → 1** | it starts refusing, correctly |
| guard 8 staleness | **cleared** | the only thing the save clears |

**`day:proof`'s expected exit is 1 both before and after. Judge it on the count —
6 — not on the code.**

---

## 6 · CORRECTION TO THE PREPARED FILE

[`docs/PREPARED-manual-hold.md`](PREPARED-manual-hold.md) §6.1 says *"Nothing
below should be run until he has"* saved, and presents the day-editor save as
what unblocks `record:land`. **It does not.** The save clears guard 8 and
immediately raises the `door` refusal in its place, so `record:land` cannot land
anything either side of it. §6.2's step 6 expectation — `day:proof` exit 1 with no
more than 6 failed checks — is right, and its reasoning about why is not.

**What that changes for a lander:** the prepared change's edits 1-3 are hand
edits to the tree and do not need `record:land` at all. The save is still worth
doing — it is what keeps the draft from being a loaded weapon aimed at Record
005 (§3) — but it is not a gate that opens. **`record:land -- --write` is
unavailable until somebody rules on `door`, and that ruling is Mike's.**

---

## 7 · FLAGGED, NOT FIXED

- **F5 — `EMITTED_DOC_FIELDS` has no `door`, and the round trip has been half
  open since the field was added.** The reader carries `door`, the emitter
  refuses it. Neither is wrong; nobody has ruled which side moves. Filed as
  `D-e` in `docs/OPEN_ACTIONS.md`.
- **F6 — `day-proof.mjs:323-330` reports a cause it did not measure.** It prints
  an empty reason (leading-newline slice) and then names guard 6 from a constant.
  A proof whose finding line is a guess is the shape §0 exists to refuse.
- **F7 — two save endpoints write `record-draft.json` and only one is guarded.**
  `/day/save` checks the source sha256 and answers 409 on a stale page
  (`record-serve.mjs:182-197`). `/save` — the mothballed record editor's, still
  mounted at `:254-275` — does `fs.writeFileSync(DRAFT, body)` with no sha check,
  no `saved` normalisation and no `source` key. The day page posts to the guarded
  one (`day.mjs:2120`), so this is a door nobody uses rather than a live loss.
- **F8 — `blockOut` re-indents by paragraph position.** §2.6(a). One block in the
  Record has mixed cuts and it is Record 003's ADDENDUM 02.
- **F9 — the textareas set `spellcheck="true"` and no autocorrect attributes.**
  §2.6(b).

---

## 8 · EVERY COMMAND RUN

Read-only throughout. **No save. No `--write`. The editor was never opened.**

```
git status --short
npm run day:proof
node tools/dictation/emit-record-entries.mjs --verify     (no --write; exit 0)
npm run record:land                                       (dry run; exit 0)
node -e "… modelOf() over the five entries: 44 boxes, esc()/HTML round trip"
node -e "… modelOf() over the five entries: per-block indent cuts"
node -e "… draftEntries() vs record-draft.json, field by field"
node -e "… emitFaults() over the draft and over the tree"
grep -n autocorrect|autocapitalize|autocomplete|spellcheck tools/dictation/day.mjs
```

Everything else is READ, at the file and line named beside it.
