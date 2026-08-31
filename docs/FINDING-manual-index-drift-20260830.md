# FINDING — the manual's sheet index has drifted and its printed labels have not

**Round:** Appendix B and Section V, first pass.
**Written:** 2026-08-30. **Author:** Ops.
**Status: NOTHING IS REPOINTED AND NOTHING IS BROKEN ON THE GLASS TODAY.**
This file measures a drift. It does not propose a fix, it changes no register,
no ledger and no provenance row, and it is not an instruction to anybody.

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

## 2 · TODAY'S DRIFT, MEASURED

The document was 63 sheets when the six webps were published. Appendix B's
first pass added one sheet (63 → 64) and Section V's added another (64 → 65).
Appendix B sits after Section VII, so only the Section V sheet moved the
published masters.

| the webp the museum publishes | printed label | master path named in `provenance/assets.json` | sheet index that master WAS | sheet index carrying that label NOW |
|---|---|---|---:|---:|
| `/robots/manual/scan-11-a.webp` | `7-3` | `robots/mgk-viiip/manual/structure/page-32.png` | 32 | **33** |
| `/robots/manual/scan-07-a.webp` | `7-4` | `robots/mgk-viiip/manual/structure/page-33.png` | 33 | **34** |
| `/robots/manual/scan-11-b.webp` | `7-4` | `robots/mgk-viiip/manual/structure/page-33.png` | 33 | **34** |
| `/robots/manual/scan-07-b.webp` | `7-5` | `robots/mgk-viiip/manual/structure/page-34.png` | 34 | **35** |
| `/robots/manual/scan-31-a.webp` | `B-1` | `robots/mgk-viiip/manual/structure/page-47.png` | 47 | **48** |
| `/robots/manual/marked-01-a.webp` | `B-1` | `robots/mgk-viiip/manual/structure/pages/marked/page-47.png` | 47 | **48** |

**Every one is off by one. The printed labels are unchanged.**

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

**So a repointing done today is wrong by the next packet.** Moving the four
ledger literals from 32/33/34/47 to 33/34/35/48 would be correct for exactly
as long as nobody writes another paragraph, and it would have to be done again
after every pass, forever, with no gate watching whether it was. A number
corrected on a schedule nobody keeps is worse than a number known to be
stale — this repository has already recorded that shape twice, at `A-d`
(`make_house_covers.py --verify`, red for seventeen days in no gate) and at
`Q-b` (`facts:gate`, built and deliberately unwired because it cannot pass).

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

---

## 7 · HOW TO REPRODUCE THE MEASUREMENT

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

Run in `weird-baby-robots`. It printed 65, and 33 / 34 / 35 / 48, on
2026-08-30.

**`main()` must never be called to check this.** It deletes every PNG in
`pages/` and in `pages/marked/` before rewriting them, which would turn a
measurement into the very re-render this file says has not happened.
