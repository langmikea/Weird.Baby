# FINDING — the manual's sheet index has drifted and its printed labels have not

**Round:** Appendix B and Section V, first pass.
**Written:** 2026-08-30. **Author:** Ops.
**Re-measured:** 2026-09-01, front matter and Section V round. The document
was 65 sheets when this was written and is **74** now; every figure below has
been brought current and the original measurement is kept beside it, because
what this file is for is showing that the number moves.
**Status: NOTHING IS REPOINTED AND NOTHING IS BROKEN ON THE GLASS TODAY.**
This file measures a drift. It does not propose a fix, it changes no register,
no ledger and no provenance row, and it is not an instruction to anybody.
As of 2026-09-01 it also carries one ruling, at section 7, and the ruling is
that the drift is **not** to be closed before launch.

---

## 0 · THE TWO NUMBERS, AND THEY ARE NOT THE SAME NUMBER

The manual carries two page numbers and only one of them is printed on the
page. Every confusion in this file comes from the pair being read as one.

| | **the sheet index** | **the printed label** |
|---|---|---|
| what it is | the position of the leaf in the document, counting the cover as 1 | the folio the typist struck at the foot of the page |
| where it lives | the filename — `pages/page-NN.png`, from `render_page(pg, i + 1, atlas)` in `tools/manual_structure_build.py` | inside the picture, from `Doc.page_label()` |
| what it counts | sheets, from the front | pages **within a section**: `7-4` is Section VII's fourth page, `B-1` is Appendix B's first |
| who reads it | the museum — ledger row ids, provenance master paths, the page-count gate | a person holding the sheet |
| behaviour under growth | **moves** | **stays** |

`page-47.png` and `B-1` named the same leaf for as long as nothing before
Appendix B changed length. They are not the same kind of name and nothing in
either repo says so.

---

## 1 · WHY THE LABEL IS STABLE AND THE INDEX IS NOT

Every section and appendix starts a new page and resets its own page counter
(`Doc.new_part`, `Doc.new_page`). A label is therefore **local to its part**:
Section VII's fourth page is `7-4` whatever happens in Section V, and Appendix
B's first page is `B-1` whatever happens in Section VII.

The sheet index is global. It is the count of leaves from the front, so **one
sheet added anywhere shifts every sheet after it by one**, and the shift
propagates to the end of the document.

That is what happened this round. Section V was written and grew from three
sheets to four. Everything after it moved down by one, and not one page's own
printed label changed.

---

## 2 · THE DRIFT, MEASURED 2026-08-30 AND AGAIN 2026-09-01

The document was 63 sheets when the six webps were published. Appendix B's
first pass added one sheet (63 → 64) and Section V's added another (64 → 65).
Appendix B sits after Section VII, so only the Section V sheet moved the
published masters.

**[2026-09-01] It is now 74.** The nine sheets came from **one round**:
Sections IV, VI, VIII and IX, written 2026-08-31. Section VI alone went from
four sheets to seven. **The 2026-09-01 round added none** — Section V was
rewritten in place and the front matter was filled into leaves that already
existed, and the layout measured 74 before that round and 74 after it. The
drift the table below recorded as one leaf is now **six leaves for the Section
VII masters and eleven for Appendix B's**, and the last two columns are what
that costs.

| the webp the museum publishes | printed label | master path named in `provenance/assets.json` | index that master WAS | index at 65 sheets, 2026-08-30 | index at 74 sheets, 2026-09-01 | adrift |
|---|---|---|---:|---:|---:|---:|
| `/robots/manual/scan-11-a.webp` | `7-3` | `robots/mgk-viiip/manual/structure/page-32.png` | 32 | 33 | **38** | **+6** |
| `/robots/manual/scan-07-a.webp` | `7-4` | `robots/mgk-viiip/manual/structure/page-33.png` | 33 | 34 | **39** | **+6** |
| `/robots/manual/scan-11-b.webp` | `7-4` | `robots/mgk-viiip/manual/structure/page-33.png` | 33 | 34 | **39** | **+6** |
| `/robots/manual/scan-07-b.webp` | `7-5` | `robots/mgk-viiip/manual/structure/page-34.png` | 34 | 35 | **40** | **+6** |
| `/robots/manual/scan-31-a.webp` | `B-1` | `robots/mgk-viiip/manual/structure/page-47.png` | 47 | 48 | **58** | **+11** |
| `/robots/manual/marked-01-a.webp` | `B-1` | `robots/mgk-viiip/manual/structure/pages/marked/page-47.png` | 47 | 48 | **58** | **+11** |

**Every one was off by one on 2026-08-30. Five of the six are off by six or
eleven now. The printed labels are still unchanged** — which is the finding
restated at four times the amplitude, and the reason the last column exists.

**[2026-09-01] ONE LEAF WAS LOST AFTER APPENDIX B AND THIS FILE CANNOT SAY
WHICH.** The arithmetic does not close: sheets *before* `B-1` grew by ten
(47 → 57) while the *total* grew by nine (65 → 74), so exactly one leaf
disappeared somewhere between `B-2` and the back matter between the two
measurements. It is recorded here as measured and **not explained**, because
the 65-sheet layout cannot be reconstructed from the present tree and a guess
in this file is the thing this file exists to prevent. It touches nothing
published: every one of the six masters sits ahead of `B-2`.

Two facts about that table that are older than this round and are restated so
they are not read as new:

- **`scan-07-a` and `scan-11-b` name the same master** because they are the
  same sheet. `7-4` carries the tail of SP 7-14 and the head of ¶7-19, so it
  is honestly both *the video link, second page* and *power supply, first
  page*. The Record entry attaches it twice.
- **Five of the six name a path that does not resolve.** The leaves are one
  directory deeper, under `structure/pages/`. Only `marked-01-a`'s row is
  right. That is already recorded at `docs/canonical/OPERATIONS.md:545` and
  flagged at `docs/canon/BELL-103.md:290-297`; it is a separate defect from
  the drift and is not touched here.

---

## 3 · WHERE THE OLD INDICES ARE NAMED

Searched: both repositories, every tracked file, for `page-32`, `page-33`,
`page-34`, `page-47` and for `doc.manual.page.32` / `.33` / `.34` / `.47`;
then the museum's `reveal/` and `tools/` for every caller of `manualPages()`
and `manualPageRow()`. The robots repository returns **no hits outside the
generated `pages/` directory itself** — the number lives entirely on the
museum side and in the filenames.

**READS the number** — the value is a key, or an input to logic that can
refuse:

| where | what it does |
|---|---|
| `reveal/ledger-declare.mjs:632, 634, 637, 645` | `MANUAL_PAGE(32…)`, `(33…)`, `(34…)`, `(47…)` — the four literals, passed to `manualPageRow()` |
| `reveal/schema.mjs:140-156` (`manualPageRow`) | refuses a page above `manualPages()`, and refuses one with no source render at `pages/page-NN.png` |
| `reveal/schema.mjs:112-120` (`manualPages`) | reads the highest `NN` off the files on disk |
| `reveal/ledger.json:1769, 1792, 1816, 1839` | the emitted rows `doc.manual.page.32 / .33 / .34 / .47` — the number is inside the row id |
| `provenance/asset-table.json` | rows keyed on `page-NN.png` as file identities, both the museum's held copy and the robots source |

**PRINTS the number only** — prose, comments, or a generated display; nothing
resolves or validates it:

| where | what it is |
|---|---|
| `provenance/assets.json:247, 255, 263, 271, 279, 287` | the master-render sentence inside each row's `s` field — prose in a data file, and no gate resolves a path a provenance row cites |
| `docs/canon/BELL-103.md:282-283, 292-293` | canon prose about the marked pair |
| `docs/FINDING-manual-scans.md:198-306` | a dated finding; a snapshot, correct as of 2026-08-29 |
| `src/data/artists/robots-record.js:338-339` | a source comment carrying the unresolvable-path flag |
| `tools/manual-derivative.mjs:22` | a usage example in the tool's own header |
| `docs/CONTACT_SHEET.html:2288-2330, 2513-2525` | generated contact sheet, regenerated from disk |
| `docs/dictation-20260807/artifacts.html`, `assign.html` | generated instruments, regenerated from disk |
| `docs/dictation-20260807/moved-blocks.json:184` | a find-string in a moved-blocks record |

---

## 4 · THE LABEL KEY SURVIVED THE SHIFT. AN INDEX KEY WOULD NOT HAVE

`MARKED_PAGES` in `tools/manual_structure_build.py` is keyed on the page
**label**:

```python
MARKED_PAGES = {
    "B-1": ([ …marks… ], ("PRELIMINARY", …)),
}
```

`B-1` moved from sheet 47 to sheet 48 this round and the key did not notice,
because `B-1` still names Appendix B's first page. The marked copy re-renders
onto the right leaf.

**Had the same dictionary been keyed on `47`, the pen would this round have
rendered onto Appendix A's first page** — a different appendix, a different
subject, four strike-throughs laid across text that has no settings in it —
and nothing in either repository would have reported it.

That is an argument for the key that is already in place. **It is not an
answer to the question the marked copy actually raises**, which is that a
label can stay correct while the page under it changes: `B-1` still resolves,
and ¶B-3's `[ TEXT REQUIRED ]` — the thing `ASK ENGINEERING` was written
beside — is prose now. The two problems are separate and only the first one
is settled.

---

## 5 · THE DRIFT WILL MOVE AGAIN, AND THAT IS THE POINT OF THIS FILE

The document has twelve sections and eight appendices. **Two positions of a
hundred and eight carry prose today**, three tables of thirty-one are filled,
and every remaining paragraph that gets written can add a sheet.

Section V added one. Appendix B added one. Section VI is the largest reserved
section in the document — twenty-one positions and two tables — and Section
VII is the one the published scans are cut from.

**[2026-09-01] RE-MEASURED, AND THE PARAGRAPH ABOVE HELD.** Forty-five of the
hundred and eight positions carry prose, and ten tables of thirty are filled;
one table position was removed in the interval, which is why the denominator
fell by one. The written positions are Sections IV (5 of 5), V (9 of 10),
VI (17 of 17), VII (2 of 15), VIII (5 of 6), IX (4 of 4), Appendix B (2 of 3)
and Appendix F (1 of 1). **Section VI was the largest reserved section and is
now the longest written one, seven sheets** — it alone accounts for most of
the six-leaf drift on the Section VII masters. Section VII, the one the
published scans are cut from, still carries two positions of fifteen, so it
has not begun to grow.

**So a repointing done today is wrong by the next packet.** Moving the four
ledger literals from 32/33/34/47 to 33/34/35/48 would be correct for exactly
as long as nobody writes another paragraph, and it would have to be done again
after every pass, forever, with no gate watching whether it was. A number
corrected on a schedule nobody keeps is worse than a number known to be
stale — this repository has already recorded that shape twice, at `A-d`
(`make_house_covers.py --verify`, red for seventeen days in no gate) and at
`Q-b` (`facts:gate`, built and deliberately unwired because it cannot pass).

**[2026-09-01] THE PREDICTION IN THAT PARAGRAPH WAS TESTED AND HELD.** A
repoint to 33 / 34 / 35 / 48 carried out on the day this file was written
would already be wrong: the correct targets are **38 / 39 / 40 / 58** as of
this morning, two days and five render rounds later, and nothing anywhere
would have said so. The paragraph above is left exactly as it was written,
because being right in advance is the only evidence it has.

---

## 6 · WHAT IS TRUE ON THE GLASS TODAY

**Nothing is broken and nothing is repointed.**

- `structure/pages/` still holds the 63 rendered leaves it held before this
  round, byte-identical. `structure/pages/marked/` likewise.
- The six published webps are unchanged on disk and unchanged in the museum.
  What a visitor would meet on 2026-09-09 is exactly what it was.
- `page-32.png`, `page-33.png`, `page-34.png` and `page-47.png` still exist,
  still carry the labels `7-3`, `7-4`, `7-5` and `B-1`, and are still the
  correct masters for the six.
- The four ledger rows still resolve, because they resolve against the files
  on disk and those files have not moved.

The drift is between the document **as the generator now lays it out** and the
document **as it was last rendered to disk**. It becomes real on the day
somebody re-renders the pages, and not before. Nobody has, and this round
deliberately did not: every render this round went to a scratch directory.

**[2026-09-01] ALL FOUR BULLETS ABOVE STILL HOLD, VERBATIM, TWO DAYS ON.**
`structure/pages/` holds the same 63 leaves, `structure/pages/marked/` the same
one, and the whole set still digests to
`dc38450e1036a4231de86f34526d2252593d2cdc47909830611ed3ce1bee96ee` — read fresh
at the end of every packet since. The PDF's mtime is still 19 August. Five
further rounds have rendered to scratch directories — `scratch-iv`,
`scratch-vi`, `scratch-viii`, `scratch-ix` and `scratch-front` — and none has
touched the tree. `npm run docs:numbers` prints `manual pages 63 (robots source)` and exits
**0**: green, because it reads the disk, and the disk has not moved.

---

## 7 · [2026-09-01] THE PUBLISH SURVEY, AND THE RULING

Written after the front-matter round, which asked what it would take to put
five sheets — the cover, the title leaf, the scope statement, `5-3` and
`marked-01-a` — into the Record. The survey is not repeated here. Two of its
findings belong in this file because they are findings about the INDEX, and
one ruling belongs here because it is a ruling about the re-render.

### 7.1 · THREE SHEETS IN THIS DOCUMENT CANNOT DRIFT, AND THEY ARE THE FRONT

The front matter sets in a fixed order — cover, `i` certification, `ii` title
page, `iii` safety summary, `iv` scope and arrangement — and **all five sit
ahead of the contents**. The contents, list of tables and list of illustrations
are the only front-matter leaves whose length depends on the body, and they
come after. Nothing written anywhere in the document can push a leaf that
precedes them.

| sheet | index | can it drift? |
|---|---:|---|
| the cover | **1** | **no. Ever.** |
| leaf `ii`, the title page | **3** | **no. Ever.** |
| leaf `iv`, the scope statement | **5** | **no. Ever.** |

**These are the only sheets in the manual of which that is true**, and it is
worth saying plainly because every argument in this file up to here has been
that an index key is a key that moves. For these three it does not. A
`MANUAL_PAGE(1, …)` row would be correct on the day it was written and correct
at a hundred and eight written positions, with no gate needed to keep it so.

### 7.2 · `5-3` IS THE OPPOSITE CASE AND WANTS A LABEL KEY

`5-3` is sheet **27** today. It was a different leaf at 63 sheets and at 65,
and it will be a different leaf again the first time Section IV, the front
matter's lists, or anything else ahead of Section V grows — which section 5
says will keep happening.

**If `5-3` is ever published it should be keyed on its label, not its index.**
The precedent is in this repository's own tooling and is recorded at section 4
above: `MARKED_PAGES` in the generator is keyed on `"B-1"`, that leaf moved
47 → 48 → 58 as the document grew from 63 sheets to 74, and the key has not
once noticed. A row
keyed `doc.manual.page.27` would have to be re-checked after every future
pass, by somebody who remembered to, with nothing watching whether they did.
That is the shape section 5 already refused twice.

**This is a change to the vessel, not to the data.** `manualPageRow()` takes
an integer and resolves `pages/page-NN.png`; a label key needs the generator to
publish its label→index map, or the museum to read it. Neither is written and
neither is proposed here.

### 7.3 · THE RULING — THE PROTECTED SET IS NOT REGENERATED BEFORE LAUNCH

**Ruled 2026-09-01.** None of the four new sheets can reach the Record without
a master at `structure/pages/page-NN.png`, because `manualPageRow()` checks the
file on disk and refuses to name a page that is not there. The only thing that
writes that directory is `main()`. **It is not to be run before launch.**

The four reasons, each measured rather than argued:

1. **It deletes all 63 masters first.** `main()` removes every PNG in `pages/`
   and in `pages/marked/` before rewriting them, and the first default-path run
   also re-encodes ~120 MB of tracked masters through whatever encoder happens
   to be installed today. There is no partial version of this: publishing only
   the cover costs the same run as publishing everything.
2. **It turns a green gate red.** `manualPages()` would answer 74, and
   `docs:numbers` would fail on a claim that passed the minute before.
3. **It silently re-aims four live ledger rows.** `doc.manual.page.32 / .33 /
   .34 / .47` would begin naming different leaves, and **nothing would refuse
   them** — the numbers stay in range and the files still exist. That is the
   failure with no alarm on it, and it is the one that reaches the glass.
4. **`marked-01-a` needs none of it.** It is already declared, already has its
   provenance rows and its asset uid, already hangs off Record 003, and is
   already scheduled — 2026-09-09, derived from `recordDay(3)` and not typed
   anywhere. It ships on the ninth exactly as it stands. **The one sheet that
   is due is the one sheet that needs no work.**

So the four new sheets wait. What exists of them is committed as a viewer and
four plates at `docs/mock-front-page-20260901.html`, which is a mock and is not
the Record.

**What this ruling does not say.** It does not say the drift is acceptable
forever, and it does not close this file. When the re-render is taken it is one
deliberate job with a four-row repoint hanging off it, and it lands either
before the ninth or well after it — **never across it.**

---

## 8 · HOW TO REPRODUCE THE MEASUREMENT

The layout is pure and cheap; nothing below writes to the tree.

```
python -c "
import importlib.util
spec = importlib.util.spec_from_file_location('msb','tools/manual_structure_build.py')
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
probe = m.layout(None)
lists = {'toc':probe.toc,'lot':probe.lot,'loi':probe.loi,'where':probe.where}
doc = m.layout(lists)
idx = {}
for i, pg in enumerate(doc.pages):
    idx.setdefault((pg['hl'], pg['label']), i + 1)
print('total sheets:', len(doc.pages))
for hl, lab in (('Section VII','7-3'), ('Section VII','7-4'),
                ('Section VII','7-5'), ('Appendix B','B-1')):
    print('  %-4s -> sheet %d' % (lab, idx[(hl, lab)]))
"
```

Run in `weird-baby-robots`. It printed **65, and 33 / 34 / 35 / 48**, on
2026-08-30. Run again unchanged on **2026-09-01**, the same block printed:

```
total sheets: 74
  7-3  -> sheet 38
  7-4  -> sheet 39
  7-5  -> sheet 40
  B-1  -> sheet 58
```

Both numbers in this file come from this one probe, and neither was typed from
memory. **A figure in this file that was not printed by this block is a figure
to distrust** — that is how the 65 went stale for two days while five rounds
of work went past it.

**`main()` must never be called to check this.** It deletes every PNG in
`pages/` and in `pages/marked/` before rewriting them, which would turn a
measurement into the very re-render this file says has not happened.
