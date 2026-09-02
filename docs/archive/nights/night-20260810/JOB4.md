# JOB 4 — THE MANUAL: WHAT THE EXISTING BODY OF WORK SAYS

**Read-only reconnaissance. 2026-08-10. Nothing was created, moved, renamed or
deleted in either repo. No script was executed. `manual_structure_build.py` was
READ, not run.**

Repos read: `C:\AI\Projects\weird-baby-museum` (referred to below as **MUSEUM**)
and `C:\AI\Projects\weird-baby-robots` (**ROBOTS**).

---

## LEAD — WHAT NEEDS MIKE (short form; full list at the foot)

**The CLEAN PNG ruling collides head-on with a standing ruling of his own (B8,
2026-08-02), and B8 is not a note in a log — it is wired into four mechanisms.**

1. **B8 says the opposite, in his own words.** *"the manual must be ACTUAL SCANS
   of the ACTUAL manual via microfiche-class technology, and the generated
   PDF/plates become the source Mike prints and photographs — not the artifact."*
   Two later rulings (P2/M45, M61) were decided ON TOP of B8 and cite it. **B8
   needs to be explicitly superseded or it will keep governing.**
2. **The machinery is already built on printing and photographing.** A four-stage
   production arc `needed · printed · photographed · placed` is the schema in
   `MUSEUM/reveal/schema.mjs`, with `build` DERIVED from it. Under a CLEAN PNG
   reveal, two of the four stages describe events that will never happen, and the
   derivation `photographed → PARTIAL` / `placed → LIVE` has no input.
3. **"Clean" needs one word of definition.** The 61 existing PNGs are not clean
   in the ordinary sense: they are deliberately dirtied — toner specks, baseline
   drift, feed skew, scan skew, a smoothstep contrast crush and an uncovered
   platen edge — to look like a photocopy of a typed sheet. **Does "the CLEAN
   PNGs" mean these files as they are, or type without the distress pass?**
   Nothing in the body of work answers this, because the question could not exist
   before the ruling.
4. **The blank-page bar is a separate ruling and the CLEAN PNG ruling does not
   obviously reach it.** M61 (2026-08-06): *"the manual stays OFFLINE until real
   pages exist… nothing is published from the 61-page structure issue."* Every
   one of the 61 pages reads `[ TEXT REQUIRED ]` / `[ ART REQUIRED ]`. **Does the
   new ruling lift M61, or only change the FORM in which a written page arrives?**
5. **The one hard number in the existing shoot spec is 2400px and the PNGs are
   1650px.** B8's ≥2400px long edge was called *"the one thing that cannot be
   fixed later in code."* The live renders are 1275×1650. This one IS fixable —
   `--dpi` is a flag and the internal master is 240 dpi — but it is a real
   consequence, not a rounding.

Nothing else in either repo is waiting on him for this job.

## LEAD — WHAT I COULD NOT DETERMINE (short form)

- Whether **any** page has ever been printed or photographed. I found **no
  evidence anywhere that it has** (see 4c), which is itself the finding — but
  absence of a log entry is not the same as absence of the event, and Mike's own
  camera roll is outside both repos.
- What the **"marked-up printed manual"** is or where it is. It is named twice in
  ROBOTS/STATE.md as *the only un-captured source* and a *standing lead*, and it
  is never described.
- Whether `phys.manual.original` ("The original printed manuals — held, not
  published") is the same object as that lead.

---

# 4c · `ROBOTS/tools/manual_structure_build.py`

**Path:** `C:\AI\Projects\weird-baby-robots\tools\manual_structure_build.py`
**1,509 lines. Added and last touched 2026-08-05 (git).** Companion of the
retired `tools/manual_build.py` (v1, deleted at commit `4cd78ac`).

## What it CONSUMES

It is close to a self-contained document. There is **no data file, no JSON, no
CSV, no source-text file** — the manual's entire content is literal Python data
inside the script.

| Input | Path / form | Expected shape |
|---|---|---|
| The font | `C:\Windows\Fonts\cour.ttf` (`FONTS` is a hardcoded absolute Windows path, line 75) | TrueType, loaded at `FONT_PX = 33` via `ImageFont.truetype` |
| The structure | `BODY`, in-file (lines 103–391) | list of tuples: `("SEC", roman, n, TITLE)` · `("APX", letter, TITLE)` · `("P", label, TITLE)` · `("SP", …)` · `("T", label, CAPTION, [headers], depth_mm)` · `("F", label, CAPTION, h_mm)` · `("GLOSS", [terms])` · `("ABBR", [(abbr, expansion_or_None)])` · `("NOTES", h_mm)` · `("GAP", mm)` |
| The index | `INDEX`, in-file (lines 397–491) | 93 `(entry, key)` pairs; key is a paragraph label, `T<label>`, `F<label>` or `APX-<letter>`, resolved to the page the position actually landed on |
| The one quoted sentence | `CAUTION_TEXT`, in-file (lines 85–86) | Cited to `robots/mgk-viiip/sources/2022-proto-docs/MGKVIIIp User Manual new.docx` — **the .docx is NOT opened by the script**; the sentence is transcribed into the source |
| Identity constants | `DOCNO = "ABEAL 8P-OMI-1"`, `ISSUE`, `REVISION`, `MODEL`, `BUILD_DATE = (2026, 8, 5)`, `SEED = 19650301` | in-file |
| Libraries | Pillow (`PIL`), `numpy`, `fpdf` (FPDF), `fitz` (PyMuPDF) | imported lazily inside functions |
| CLI | `--pdf-only` · `--dpi` (default **150**) · `--proof N` · `--jpeg` (default **62**) | argparse |

**Two consumption facts worth naming.** (a) `ROMAN` (line 492) is **defined and
never used** — `emit_section` reads the tuple's own tag string, so the numeral is
authored, not derived. (b) There is no read of anything in the museum repo; the
dependency runs the other way (`MUSEUM/reveal/schema.mjs` reads the robots tree).

## What it EMITS

| # | Format | Path | Notes |
|---|---|---|---|
| 1 | **PDF** | `robots/mgk-viiip/manual/structure/MGK-VIIIp_OMI_STRUCTURE_v1.pdf` | Letter, portrait, `set_auto_page_break(False)`, one full-bleed image per page. Title/author/creation-date set; creation date pinned to `BUILD_DATE` so the binary is byte-stable |
| 2 | **JPEG** (embedded, never written to disk on its own) | inside the PDF | every page is `im.save(buf, format="JPEG", quality=62, optimize=True)` before `pdf.image()`. **This is the actual pixel source of the PNGs** |
| 3 | **PNG** ×61 | `robots/mgk-viiip/manual/structure/pages/page-NN.png` | rasterised **from the PDF** by PyMuPDF at `--dpi` (default 150), `colorspace=fitz.csGRAY`. The directory's existing `*.png` are `os.remove`d first |
| 4 | **stdout report** | console | page count and MB; `%d sections, %d appendices, %d paragraph positions, %d tables, %d figures, %d index entries`; the grid line; and either `INDEX KEYS UNRESOLVED: …` or `index: all 93 entries resolved to real pages` |

**The full list is four, and the non-obvious one is #2.** The PNGs are not
rendered directly from the raster — they are a re-decode of a lossy JPEG at
quality 62, re-rasterised through the PDF. Any "clean PNG" reveal is shipping
JPEG artefacts baked into a PNG container. That is a fact about the pipeline, not
a complaint.

Also in the tree but written by a **different** script
(`tools/manual_tuning_compare.py`): three before/after sheets at
`robots/mgk-viiip/manual/structure/tuning/compare-page-{08,46,60}.png`.

## The 61 PNGs — measured

- **Location:** `C:\AI\Projects\weird-baby-robots\robots\mgk-viiip\manual\structure\pages\`
- **Naming:** `page-NN.png`, zero-padded two digits, `page-01.png` … `page-61.png`
  (`"page-%02d.png" % (i + 1)`), contiguous, no gaps.
- **Count: exactly 61.** No other file in the directory.
- **Dimensions (PNG IHDR, offset 16):** every one of the 61 is
  **1275 × 1650, bit depth 8, colour type 0 (greyscale)** — 8.5 × 11 in at
  150 dpi. Zero variation.
- **Byte sizes:** min **63,414** (page-59) · max **395,990** · mean **140,741** ·
  total **8,585,254 bytes** (8.59 MB).
- **The PDF:** 5,787,778 bytes (5.79 MB).

## Does the manual exist in any other form?

Searched both repos for SVG, per-page PDF, HTML, markdown, JSON, TeX, InDesign
and source text.

**Live on disk (ROBOTS):**

| Form | Path | Count |
|---|---|---|
| PNG page renders | `robots/mgk-viiip/manual/structure/pages/` | **61** |
| PDF, whole document | `robots/mgk-viiip/manual/structure/MGK-VIIIp_OMI_STRUCTURE_v1.pdf` | 1 |
| PNG, tuning comparison sheets | `robots/mgk-viiip/manual/structure/tuning/` | 3 |
| **Source text of the structure** | `tools/manual_structure_build.py` `BODY` + `INDEX` | 1 file — the only machine-readable rendition of the section/paragraph/table/figure scheme |
| **Prose, markdown** | `docs/drafts/MANUAL_PROSE_SALVAGE-20260805.md` | 1 file, **664 lines** — 2,428 words of drafted manual prose (60 numbered paragraphs, 3 bullets, 7 NOTEs, 3 CAUTIONs, 7 `[PAPA]` slots, 10 tables' entries) rescued verbatim from the retired v1 generator, plus the whole body of the retired markdown draft. **Explicitly not adopted.** |
| Compiled artefact | `tools/__pycache__/manual_structure_build.cpython-313.pyc` (74,053 bytes, mtime 2026-08-05 16:39) | 1 |

**Retired / deleted, recoverable from git only:**

- `robots/mgk-viiip/manual/MGK-VIIIp_OMI_v1.pdf` — the 24-page v1, deleted at `4cd78ac` (2026-08-05).
- `robots/mgk-viiip/manual/pages/page-01..24.png` — 24 rasters, same commit.
- `tools/manual_build.py` — the v1 generator (added `b14752e`, 2026-07-30).
- `docs/drafts/OWNERS_MANUAL-draft1-20260723.md` — the markdown owner's-manual draft (added `78312c3`, 2026-07-23).
- `MUSEUM/public/robots/manual/working-copy-p1.png` — a still of page 1, on the museum's Manual face; struck at the parity round (present in `2dc9a39`, `b3cba4a`, `725e108`).

**Not renditions, but adjacent and easy to mistake for one:**
`MUSEUM/docs/evening-round-20260803/07-robots-manual-plate.png` (754,955 B) and
`MUSEUM/docs/renders/stage-02-manual-plate.png` (14,833 B) are **screenshots of
the museum's Manual face**, not manual pages.

**Real-world source documents (not renditions of the OMI):**
`robots/mgk-viiip/sources/2022-proto-docs/MGKVIIIp User Manual new.docx`
(31,531 B) — the 2022 proto-manual; plus `AUDIO NOTES.txt`, `MGKVIIIp Ideas.txt`,
`README.md` in the same folder.

**Found nowhere in either repo:** SVG, per-page PDF, HTML, JSON, TeX, InDesign,
or a plain-text transcription of the structure issue.

## Has any page EVER been printed or photographed?

**No log, note, register row, ledger row or asset row in either repository
records a printing or a photography event for any page of this manual. I report
that absence as the finding.**

The evidence for the negative, five independent ways:

1. `MUSEUM/reveal/ledger.json` — `prod` is **null on all 167 rows**. Not one row
   sits at `printed` or `photographed`.
2. **No `doc.manual.page.NN` row exists at all.** `ledger-declare.mjs` line 470
   reads `/* (no calls — see above) */`; the vessel is deliberately unpopulated.
3. `doc.manual.plates` is `build: NOT_BUILT`, `state: HELD`, `assets: []`, with
   `deps: ["Mike's camera — P2; ≥2400px long edge…"]`.
4. `MUSEUM/src/data/artists/robots.js` — the Manual face's `plates: []`, with the
   note *"No page images on file."*
5. `MUSEUM/provenance/asset-table.json` — 66 rows whose path contains "manual":
   61 page renders, 3 tuning sheets, 2 museum face screenshots. **No photograph
   of a page.** All 66 carry `quality: null`, `verdict: null`, `bucket: null` —
   i.e. nobody has inspected any of them.

**Distinguishing proposal from record, as instructed.** Every "printed /
photographed" string I found is one of: (a) a **ruling that it must happen**
(B8), (b) a **field vocabulary anticipating it** (`PROD`), (c) an **open register
row asking for it** (P2), or (d) a **fiction sentence about the in-story object**
("the original printed manuals"). None is a record of an event.

**One trap worth naming.** `PROVENANCE_RULINGS-20260804.md` R4 discusses a still
captioned *"The working copy, printed with PRELIMINARY — NOT FOR DISTRIBUTION
across it."* That reads like a record of a print. It is not: the file was **a
clean digital render of type that says those words**, and that is precisely why
R4 flagged it and why P2/M45 struck it.

**Two physical objects do exist and are outside this pipeline:**
`phys.manual.original` — *"The original printed manuals — held, not published"*
(`state: HELD`, `deps: ["[PAPA] — whether an original is ever published"]`); and
the **"marked-up printed manual"**, named in ROBOTS/STATE.md as *"the only
un-captured source… standing lead"* (§ACT ONE BUILD) and again as
*"marked-up-manual location lead (MENU_MAP §3)"*. Neither has been captured.

---

# 4d · VERBATIM BODY ENTRIES

## The "SECTION X" ambiguity — both readings reported

**Reading 1 — roman numeral ten. This one exists and is unambiguous.** The tuple
is `("SEC", "X", 10, …)`: the third element is the integer `10`, the paragraph
labels run `10-1 … 10-11`, and the page labels are `10-1`, `10-2`. The literal
string `"X"` in slot 2 is the numeral, not a placeholder. (`ROMAN[10] == "X"`
agrees, though `ROMAN` is dead code and the heading is drawn from the tuple.)

**Reading 2 — a placeholder letter X. This one has no referent.** I read the
whole `BODY` list and every `("SEC", …)` / `("APX", …)` tuple: sections are
`I II III IV V VI VII VIII IX X XI XII`, appendices are `A B C D E F G H`. There
is **no** placeholder-X section, appendix, table, figure or index key anywhere in
the document. So only reading 1 exists, and only it is printed below.

## SECTION X — verbatim, `tools/manual_structure_build.py` lines 250–258

```
 # ------------------------------------------------------------------ SECTION X
 ("SEC", "X", 10, "BUILT-IN SELF TEST AND CODE UTILITIES"),
 ("P", "10-1", "GENERAL."),
 ("P", "10-3", "BUILT-IN SELF TEST (BIST)."),
 ("F", "10-1", "SELF TEST, TYPICAL REPORT", 66),
 ("P", "10-5", "CHECKSUM."),
 ("P", "10-7", "USERDATA."),
 ("P", "10-9", "CODE RUNNER."),
 ("P", "10-11", "SYSTEM CONFIGURATION AND TEST (SCAT)."),
```

## APPENDIX F — verbatim, `tools/manual_structure_build.py` lines 319–358

```
 # ----------------------------------------------------------------- APPENDIX F
 ("APX", "F", "GLOSSARY"),
 ("P", "F-1", "GENERAL."),
 ("GLOSS", [
    "Answer Engine",
    "AMMMS",
    "Bias Setting (BS)",
    "BIST",
    "Ceremony set",
    "Clarity",
    "Code, access",
    "Density set",
    "Determination",
    "Door",
    "EED",
    "ElectronScope",
    "Engine",
    "Enunciator",
    "Fluidic Matrix Luminescence (FML)",
    "Fluidic Nano-Matrix (FNM)",
    "Fluidic suspension",
    "GyroMotion",
    "Inclination",
    "MAME",
    "MIALLO",
    "MindsEye",
    "Monitor, diagnostic",
    "Passage",
    "PHVDC",
    "Polarity",
    "PressPulse",
    "Prediction Engine",
    "Record, operator",
    "Record, system",
    "SCAT",
    "Self-correction",
    "SonicWave",
    "System set",
    "VibroSense",
 ]),
```

(35 terms. Related, not part of the Appendix F block: `docs/MANUAL_STRUCTURE_FIT`
§1 #99 records that *"all 35 meanings are DEMANDED, ABSENT."*)

## Which `page-NN.png` each lands on — with the derivation shown

**Answer: SECTION X is `page-38.png` and `page-39.png`. APPENDIX F is
`page-54.png` and `page-55.png`.**

The derivation, in five steps. Steps 1–3 are the mechanism; step 4 is direct
observation of the artifact; step 5 is an independent cross-check. **I did not
assert the numbers from the mechanism alone, because the layout has
page-break-on-fit behaviour (`need()`) that cannot be run without running the
script.**

**1 · The file name is the physical leaf, not the printed page number.**
`main()` writes `pix.save(os.path.join(PAGEDIR, "page-%02d.png" % (i + 1)))`
looping `i` over the PDF's pages, and the PDF is one image per `doc.pages` entry.
So `page-NN.png` is the NN-th leaf of the document, 1-based, front cover = 01.

**2 · The printed label is section-relative and is NOT the leaf number.**
`Doc.page_label()` returns `""` for the cover, `roman_lower(n)` for front matter,
`"%d-%d" % (part_num, part_page)` for a section, `"%s-%d" % (part_tag, part_page)`
for an appendix, `"Index-%d"` for back matter.

**3 · Every section and appendix starts a fresh leaf.** `emit_section()` and
`emit_appendix()` both call `new_part(...)` then `new_page()`, and `new_part`
resets `part_page = 0`. So SECTION X's first leaf necessarily carries the label
`10-1`, and APPENDIX F's first leaf carries `F-1`.

**4 · Read off the rendered pages themselves** (the four images were opened and
read; this is the evidence, not a simulation):

| leaf | running head | title block | body seen | footer right |
|---|---|---|---|---|
| `page-38.png` | `Section X` | `SECTION X` / `BUILT-IN SELF TEST AND CODE UTILITIES` | 10-1 GENERAL · 10-3 BUILT-IN SELF TEST (BIST) · the `[ ART REQUIRED ]` paste frame captioned `Figure 10-1. SELF TEST, TYPICAL REPORT` · 10-5 CHECKSUM · 10-7 USERDATA · 10-9 CODE RUNNER | **`10-1`** |
| `page-39.png` | `Section X` | — (continuation) | 10-11 SYSTEM CONFIGURATION AND TEST (SCAT) and nothing else | **`10-2`** |
| `page-40.png` | `Section XI` | `SECTION XI` / `SERVICE AND PARTS` | 11-1 … | **`11-1`** |
| `page-54.png` | `Appendix F` | `APPENDIX F` / `GLOSSARY` | F-1 GENERAL · `Table F-1. GLOSSARY OF TERMS AND TRADE NAMES`, TERM/MEANING, the first **30** terms (`Answer Engine` … `Record, system`) each against `[ TEXT REQUIRED ]` | **`F-1`** |
| `page-55.png` | `Appendix F` | — (continuation box) | the remaining **5** terms: SCAT · Self-correction · SonicWave · System set · VibroSense | **`F-2`** |

30 + 5 = 35 = the length of the `GLOSS` list, so no glossary page is unaccounted
for. `page-40.png` bounding Section X at leaf 39 is what makes 38–39 a closed
range rather than a lower bound.

**5 · Independent cross-check.** `docs/MANUAL_TYPED_PAGE_TUNING-20260805.md` §5
names three leaves from a different session's work: `compare-page-08.png` =
"Contents, vii", `compare-page-46.png` = "Appendix B, B-1",
`compare-page-60.png` = "Index-1". Appendix B at leaf 46 and the alphabetical
index at leaf 60 bracket Appendix F at 54–55 consistently.

---

# 4b · PRINTED IN FULL — the rulings and the methods

Selection rule I applied: a passage is printed here only if it **rules** (Mike
decided X) or states a **method** (this is how the thing is built, released or
rendered). Passages that merely mention the manual are left in the 4a table.
Where a ruling is quoted inside a log, I print the log's own quoting so the
provenance is visible.

---

### [1] RULING — **⚠ CONFLICTS WITH THE CLEAN PNG RULING (the primary conflict)**
**B8, 2026-08-02.** `MUSEUM/docs/MUSEUM_BINGE_TEMPLATE_LOG-20260802.md`, lines 146–172.

> ### B8 · The manual becomes real — the ruling recorded, the container built
> `src/data/artists/robots.js` + `Exhibit.jsx` + `Exhibit.css` + the reader.
> **The ruling is recorded where the thing lives**, in full: the manual must be
> ACTUAL SCANS of the ACTUAL manual via microfiche-class technology, and the
> generated PDF/plates become **the source Mike prints and photographs** — not the
> artifact. The reason is the one the face already gave for refusing transcription:
> the typography is the evidence, and a rendering of typography is a drawing of
> evidence.
>
> B6 and B8 are **one build**, which is why they are one component: a reader that
> pages and zooms a reel of photographed pages does B6's job for free, because a
> wall of plates IS a reel with nine frames on it. One reader, two ways in.
>
> **What the viewer needs — recorded in the data file so the scans are made once
> and made right:**
> - **≥ 2400px on the long edge** — what it takes to read 6pt corporate
>   small-print at 1:1. This is the one thing that cannot be fixed later in code.
> - **The whole page including its edges** — the margins carry the technicians'
>   handwriting (§ MARGINS is already in the contents); a page cropped to its type
>   block throws that away.
> - **Reel order = reading order** — `plates` is ordered and the transport walks it.
> - **Per frame: `label` and `date`** (the section mark) — both print on the rail.
> - Zoom/page-turn are built.
>
> The reel ships **empty and says so** — "The reader is built and the reel is
> empty" — rather than promising. When the scans land they are `plates` entries in
> that file and nothing else moves.

Mirrored in `MUSEUM/STATE.md` lines 2332–2341:

> **B8's ruling recorded in `robots.js`:** the manual must be ACTUAL SCANS via
> microfiche-class technology; the generated PDF/plates are **the source Mike
> prints and photographs**, not the artifact. Scan spec recorded with it —
> **≥2400px long edge** (the one thing code cannot fix later), whole page
> including margins, reel order = reading order, `label` + `date` per frame.

---

### [2] METHOD — **⚠ CONFLICTS WITH THE CLEAN PNG RULING**
`MUSEUM/reveal/schema.mjs`, lines 32–57 and 140–177. The production arc, and
`build` derived from it.

> \* ═══ R3: THE MANUAL'S PAGES ════════════════════════════════════════════════
>    MIKE'S RULING, which is what shapes this and not a schema preference: the
>    manual ARRIVED IN PIECES, so the museum needs only the specific pages the
>    story reaches for — printed, marked, photographed, one at a time, as Record
>    entries call for them. Not a scanning project; a supply line.
>
>    THE PRODUCTION ARC IS ITS OWN VOCABULARY AND IS NOT `arc`. `arc` is the
>    REVEAL arc (arrived · understood · partial · online) — how the house shows a
>    thing it has. This is the PRODUCTION arc — whether the house has it yet.
>    A page can be `photographed` and still `null` on the reveal arc, and the two
>    fields would be lying about each other if they shared a column. \*/
> export const PROD = ["needed", "printed", "photographed", "placed"];
>
> /\* `build` is DERIVED from the production stage rather than authored, because
>    the two cannot legally disagree: a page nobody has photographed is not built,
>    and a page in `plates` is on the glass. Deriving it means the row cannot be
>    written into a state the world is not in. \*/
> export const BUILD_FOR_PROD = {
>   needed: "NOT_BUILT",        // the story has asked for it; nothing exists
>   printed: "NOT_BUILT",       // paper exists; the museum holds no image
>   photographed: "PARTIAL",    // an image exists and is on nobody's wall
>   placed: "LIVE",             // it is a frame in the reader
> };
> export const STATE_FOR_PROD = {
>   needed: "HELD", printed: "HELD", photographed: "HELD", placed: "REVEALED",
> };

and, inside `manualPageRow()` (lines 163–175), the two places the print/photograph
premise is written into the emitted row:

> ```
>     where: prod === "placed"
>       ? "src/data/artists/robots.js face.plates"
>       : `the physical world — printed from weird-baby-robots/${src}`,
> ```
> ```
>       deps: deps || (prod === "photographed" || prod === "placed"
>         ? [] : ["P2 — Mike prints and photographs this page (≥2400px long edge, whole page including margins)"]),
> ```

---

### [3] METHOD — **⚠ CONFLICTS WITH THE CLEAN PNG RULING**
`MUSEUM/reveal/ledger-declare.mjs`, lines 429–465. The `doc.manual.plates` row
and the §7b vessel header.

> R("doc.manual.plates", "The Manual's microfiche plates — the photographed pages.",
>   "document", "src/data/artists/robots.js face.plates", "NOT_BUILT", null, "HELD",
>   { deps: ["Mike's camera — P2; ≥2400px long edge, whole page including margins, reel order = reading order"],
>     shown: true, note: "[R3] DOC CONTROL is struck, so The Manual's own face is now the only place they are named — the promise is unchanged in force and narrower in reach. THE SET-LEVEL PROMISE LIVES HERE and nowhere else — the individual page rows below are not `shown`, because the museum makes one promise about plates and it is this one." });
>
> /\* ═════════ 7b. THE MANUAL'S PAGES — THE VESSEL, EMPTY [R3 2026-08-05] ══════
>    MIKE'S RULING, and it changes what this is FOR: the manual ARRIVED IN PIECES,
>    so the museum needs only the specific pages the story reaches for — printed,
>    marked, photographed, one at a time, as Record entries call for them.
>
>    THAT IS A SUPPLY LINE, NOT A SCANNING PROJECT, and the difference is the
>    whole design. `doc.manual.plates` above is one row for the WHOLE SET and can
>    only ever read NOT_BUILT until all of it is done; every page but one would
>    read exactly the same as none. A page that carries its own production stage,
>    and names the entry that asked for it, can be finished on its own.
>    …
>    NOTHING IS POPULATED, BY INSTRUCTION: the story has not asked for a page yet,
>    and a page row written before an entry calls for it would be Ops deciding
>    which page the story reaches for. When one is called for, it is one line:
>
>        MANUAL_PAGE(7, { prod: "needed", calledBy: ["record.013"] })

Also the ledger's own field glossary (`ledger.json` `_prod`, `ledger-declare.mjs`
line 917):

> "prod: [R3] THE PRODUCTION ARC — needed · printed · photographed · placed. The manual-page vessel's field and no other row's; null everywhere else. NOT the same field as `arc`: `arc` is how the house REVEALS a thing it has, `prod` is whether the house HAS it. `build` is DERIVED from it, so a page cannot claim a state the world is not in."

---

### [4] RULING — **⚠ CONFLICTS WITH THE CLEAN PNG RULING (on the glass, in shipped data)**
`MUSEUM/src/data/artists/robots.js`, the MGK-VIIIp Documentation face
(around lines 2059–2080). This is a **visitor-facing string**, not a comment.

> ```
>           docs: [
>             { title: "The owner's manual",
>               source: "ABEAL 8P-OMI-1",
>               note: "Held. Incomplete, assembled out of copies caught at " +
>                     "different stages. No page images on file — when they are " +
>                     "made they are photographs of the printed sheet, edges and " +
>                     "margins included.",
>               /* [B8 2026-08-02] THE SCANS ARRIVE FROM MIKE, ordered, reading
>                  order, one entry per page: { img, label, date }. The shape is
>                  the plate wall's shape on purpose — one reader serves both. */
>               plates: [] },
>           ],
> ```

**The sentence a visitor reads today promises photographs of a printed sheet.**
If the reveal is clean PNGs, that string is a promise the museum will not keep.

---

### [5] RULING — the CONTENT bar (P2 / M45, 2026-08-05). Not resolved by the CLEAN PNG ruling.
`MUSEUM/docs/MUSEUM_PARITY_RULING_AND_TRIM_LOG-20260805.md`, lines 88–104.

> admitting it had not written the manual, wearing a fiction as cover — Doctrine
> 11 hiding inside a picture.** Either the plate shows a page actually written, or
> there is no plate until one exists. **Empty beats a placeholder in fiction's
> clothing.**
>
> **Struck:** `still` and `stillCaption` on `face.viiip.manual`. Not re-captioned —
> and the tell is that the caption was already doing the one piece of work the
> swap needed. *A caption that has to argue a picture out of its own lettering is
> a caption losing an argument with a photograph.*
>
> **What did NOT move, stated so nobody re-derives it:** `reel.plates` is still
> `[]` and still waits on B8's ruling (photographs of the printed manual, never
> renderings). The head plate was never a frame in the reader. **P2 in the art
> register is untouched.**

---

### [6] RULING — **M61, 2026-08-06. The blank-page bar, in Mike's words.**
`MUSEUM/docs/MUSEUM_CLEAR_THE_DECK_LOG-20260806.md`, lines 267–280.

> ## D6 · M61 RULED — THE MANUAL STAYS OFFLINE
>
> **MIKE:** *"the manual stays OFFLINE until real pages exist. The viewer is built
> and stays built; nothing is published from the 61-page structure issue. Same
> ruling as the single struck plate, one scale up."*
>
> **Nothing shipped, which is the ruling working.** `RobotsExhibitFlow`'s reader
> still pages, wraps, counts frames and toggles Fit ↔ Magnify; `reel.plates` is
> still `[]`; the face still says *No pages on file*. M61 closes as **RULED — HELD**.
>
> The row it rested on is unchanged: P2 struck ONE page of that document from that
> same face on the grounds that it was *the museum admitting it had not written the
> manual, wearing a fiction as cover*. Publishing 61 pages that read
> `[ TEXT REQUIRED ]` is that ruling reversed at 61× the scale. **B8 stands beside
> it** — the artifact is a PHOTOGRAPH of a printed sheet, never a rendering — so
> even written pages still need his printer and his camera (art register P2).

**Flag:** this is the passage where the two bars are explicitly separated —
*written* and *photographed*. The CLEAN PNG ruling plainly removes the second.
Whether it removes the first is the open question.

---

### [7] RULING — the manual's length (G1, 2026-08-05). Compatible with the new ruling.
`MUSEUM/docs/MUSEUM_ROBOTS_SIMPLIFICATION_LOG-20260805.md`, lines 16–23.

> **MIKE:** *the old 24-page manual is DEAD and its page numbering with it. 61 is
> the current number — and **the manual is as long as the manual needs to be, and
> not longer.** Page count is a consequence of content, never a target.*
>
> T1 left `reveal:check` RED and refused to repoint it, on the correct reasoning
> that page 7 of the 61 is not page 7 of the 24. Mike's ruling removes the
> premise: there is no 24-page manual to be page 7 of.

Mechanism: `manualPages()` in `MUSEUM/reveal/schema.mjs` counts
`robots/mgk-viiip/manual/structure/pages/page-NN.png` at build time. **The count
is derived, never declared.** This is why the museum knows the manual is 61 pages
without a constant.

---

### [8] RULING — **the typewriter ruling (2026-08-05). The physical character of the page.**
`ROBOTS/docs/MANUAL_TYPED_PAGE-20260805.md`, lines 20–23.

> **The ruling this document serves.** Mike, 2026-08-05: *THIS WAS MADE ON A
> TYPEWRITER BY ENGINEERING. Not typeset, not laid out, not designed — typed.*
> Structure, sections, index and numbering are unchanged from the first pass.
> Only the document's physical character changed.

And the method it produced, `tools/manual_structure_build.py` lines 19–29:

> HOW IT IS MADE - Mike's ruling, 2026-08-05: THIS WAS MADE ON A TYPEWRITER BY
> ENGINEERING. Not typeset, not laid out, not designed - typed. So the renderer
> is not a typesetter. It is a character grid (12 characters to the inch across,
> 6 lines to the inch down, both fixed), a glyph struck one at a time with the
> strike variation of a type slug on a fabric ribbon, headings underscored with
> the underline key, rules typed with hyphens or ruled by hand against a
> straightedge, figures sitting in hand-cut rectangles pasted onto the
> mechanical, and the whole page then put through what a process camera and an
> office copier do to a typed original. Nothing is justified, nothing is kerned,
> nothing is proportional. Attested and cited in
> docs/MANUAL_TYPED_PAGE-20260805.md.

**Flag — this is where "CLEAN" has to be defined.** The renderer's final pass is
an explicit simulation of *being photographed and photocopied*
(`MANUAL_TYPED_PAGE-20260805.md` §3, last row):

> | Photocopy of a typed original | **TUNED** — ink field × low-frequency density variation, 0.75 px blur, a smoothstep contrast crush, toner specks (55–120/page, heavier near the gutter), fine grain, a **±0.16°** scan rotation and an edge the sheet did not cover |

The 61 PNGs therefore already *look photographed*. Under a CLEAN PNG reveal, that
is either exactly right (the file is the artifact and it looks period-correct) or
exactly wrong (a fake scan artefact on a file we are admitting is a file). **The
body of work does not decide this, because the question did not exist.**

---

### [9] RULING (level corrections, 2026-08-05). Method, no conflict.
`ROBOTS/docs/MANUAL_TYPED_PAGE_TUNING-20260805.md`, lines 8–19.

> **The ruling this document serves.** Mike, 2026-08-05, on the typewriter pass:
> *THE FORMAT IS EXACTLY RIGHT — "SPOT ON".* Then three corrections, all of them
> levels:
>
> - **T1** — ink density range too wide; letters run from too dark to too faint.
>   Narrow it; keep the strike-to-strike life, lose the extremes at both ends.
> - **T2** — the density variation shows strong vertical banding, columns of dark
>   or light. Mike's hypothesis: *almost certainly the per-character density is
>   correlated by column position or seeded off the grid x.*
> - **T3** — the line waggle is too distressed; baseline drift and per-line skew
>   read as damage rather than as a typed page. Soften, keep the character.

Determinism, same document §4:

> **Determinism holds.** Two consecutive builds produced identical SHA-256s:
> ```
> PDF          88bba04469762c88e1d6df6ee1157d07becf01bef236c89fd9e60ca1c2abb8b7
> 61 pages     ead0538f060dc4ba61e18dbc60f8c0d1d587b161e683e854e73e5ed95e976e6a
>              (sha256 over the page PNGs concatenated in order)
> ```

---

### [10] METHOD — what is and is not authored in the structure issue.
`ROBOTS/tools/manual_structure_build.py`, lines 50–61.

> WHAT IS AND IS NOT AUTHORED HERE. Section titles, paragraph titles, table
> column headers, figure captions, the numbering system, and the furniture are
> Ops - they are structure. Every position that would hold a statement about the
> machine prints [ TEXT REQUIRED ]; every figure prints [ ART REQUIRED ]; every
> table prints its real column headers over a reserved body. The one exception is
> the CAUTION on the safety page, which is quoted verbatim from the record
> (2022 proto-manual; carried into the 2024 instruction manual) rather than
> written here.
>
> The build is deterministic: SEED fixes every jitter, every strike density,
> every speck of copier dirt, so the same source produces the same page images
> on every run.

---

### [11] METHOD — how the manual reaches the museum. Compatible, but note the transfer-class reasoning.
`MUSEUM/docs/ASSET_TIMELINE.md` §5.1, lines 140–160.

> ### 5.1 The Manual spans classes 1 and 2 — and that is the fiction working
>
> The volume `doc.manual` is **BLAST**: named, on the glass, readable from launch
> — the cover and the first contents page inside the first 48 hours. Its pages
> (`doc.manual.plates`, and every `doc.manual.page.NN` the v55 vessel will build)
> are **PACKAGE**, because a photographed page is a photograph of paper somebody
> is holding.
>
> One object, two arrivals, and **no contradiction: nobody ever had the whole
> manual in one piece.** That is precisely the no-single-copy fiction Mike ruled,
> and the transfer model expresses it rather than arguing with it.
>
> **A gap inside the tension, and it is real.** The v55 vessel is empty by
> instruction (M44). So the class-1 half of the manual is carried by exactly
> **one** row — the volume — and *the first-48-hours pages Mike describes have no
> rows at all.*

**Flag — soft conflict.** The pages sit in the slow transfer class **because**
they are photographs of paper. A clean PNG is not paper somebody is holding, so
the stated reason for PACKAGE no longer applies. The class may still be right for
story reasons; the *argument* recorded for it is gone.

---

### [12] METHOD — page images, not transcription. Compatible with the new ruling, and worth keeping.
`ROBOTS/docs/EXHIBIT_CONTAINER_PROPOSAL-20260729.md`, lines 137–143.

> **`plate` — THE MANUAL.** Page IMAGES, original look-and-feel. **Not text
> digitization** — the ruling is explicit and it is the right one: the manual's
> authority is its typography, its paper, its handwritten margin notes. A text
> extract would be a different, lesser object.
> Nav is **microfiche-flavoured**: a continuous strip of page edges you scrub
> rather than a pager you click; the frame follows the scrub; a fiche-style
> column/row coordinate readout in the caption rail. Zoom to legibility is
> mandatory (plates are unreadable at fit-width).
> Payload: `{ plates: [{ src, w, h, page, note? }], fiche: {cols, rows} }`

This one **survives the CLEAN PNG ruling intact** — the page-image-over-transcript
principle is the half of B8 that does not depend on a camera.

---

### [13] METHOD — the period model, in one block.
`ROBOTS/tools/manual_structure_build.py`, lines 31–48.

> THE PERIOD MODEL. Section order, front/back matter, and the numbering
> discipline follow documents actually published in the period; every borrowed
> convention is cited in docs/MANUAL_PERIOD_MODEL-20260805.md. In short:
>   - Section-relative page numbers (page 4-3 = Section IV, third page) and
>     paragraph numbers of the form N-n, both from the HP Model 465A OPERATING
>     AND SERVICE MANUAL, printed March 1965.
>   - Roman section numerals, front matter in lower-case roman, CONTENTS +
>     LIST OF TABLES + LIST OF ILLUSTRATIONS as separate front-matter lists,
>     appendices lettered - same source.
>   - Warranty/certification leaf ahead of the title page - HP 465A and the
>     Tektronix Type 561A INSTRUCTION MANUAL (1962).
>   - CHARACTERISTICS/SPECIFICATIONS as the first body section, ACCESSORIES and
>     PARTS as their own late sections - Tektronix Type 561A.
>   - A safety summary ahead of the contents, and an alphabetical index at the
>     back - Army technical-manual practice (TM 11-5556, 1956) and the arrangement
>     prescribed by MIL-M-38784.
>   - Glossary carried as a lettered appendix - IBM Systems Reference Library
>     practice.

---

### [14] METHOD / adjacent flag — the one place the body of work proposes a real typewriter and a real scan.
`ROBOTS/docs/MANUAL_TYPED_PAGE-20260805.md` §4.1, lines 222–234.

> ### 4.1 The glyphs are outline-perfect. Real type is damaged.
>
> We vary a character's **position and its ink density**. We do not vary its
> **shape**. A real machine's `e`, `a`, `o` and `g` fill with ink and lint
> until their counters close; a bent type bar prints one character
> consistently high for the whole document; a chipped slug loses the same
> serif on every strike. Ours are 6 clean rotations of a clean outline.
>
> **This is the single biggest gap, and only one thing fixes it:** type a page
> on a real machine (or acquire a high-resolution scan of one), cut a glyph
> library out of that page, and build the atlas from real strikes. That is the
> difference between "reads as typed at a glance" and "survives being looked
> at closely at print size."

**Flagged as ADJACENT, not conflicting.** This proposes typing and scanning a
*specimen sheet to source glyphs from* — it is not a proposal to print or
photograph the manual. Under the CLEAN PNG ruling it becomes the highest-value
remaining quality lever, because the file itself is now the artifact.

---

# 4a · THE SWEEP

## How I filtered

Terms swept case-insensitively across both repos, all file types (not just
`docs/`): `manual · OMI · structure · plate · page · facsimile · print · scan ·
photograph · Appendix · BIST · glossary`.

The noise was severe and predictable. `manual` alone returned **461 occurrences
in 57 files** in ROBOTS and **405 in 80 files** in MUSEUM; a case-insensitive
`OMI` matched inside *coming*, *prominent*, *economic*. **`structure`, `page`,
`plate`, `print` and `scan` are near-useless as free terms** in a repo whose
subject matter includes page layout, printing presses, image plates, data
structures and CSS.

So I filtered in three passes and I say which pass produced each row:

- **Pass A — the discriminating terms.** `\bOMI\b` (word-bounded, case-sensitive)
  · `MGK-VIIIp_OMI` · `manual/structure` · `page-\d\d\.png`. This is the tight
  net: **8 files in ROBOTS, 22 in MUSEUM**, and essentially no false positives.
- **Pass B — `manual` with a manual-subject qualifier** in the same line or
  block: `plates`, `microfiche`, `scan`, `photograph`, `structure issue`,
  `61`, `24-page`, `8P-OMI-1`, `typed`, `glossary`, `Appendix`, `BIST`.
- **Pass C — the machine-facing terms** `BIST`, `glossary`, `Appendix`,
  `facsimile`. `facsimile` returns **zero hits in either repo** — worth recording,
  because the word the ruling implicitly negates is not a term this body of work
  ever used. `BIST` (word-bounded) returns **36 hits in 23 ROBOTS files**, mostly
  about the *machine's* self-test — firmware, twin, menu tables — reaching the
  manual only through Section X. `glossary` returns **21 hits in 7 ROBOTS files
  and every one of the seven is a manual document** (the generator, the period
  model, the fit test, the holes report, the tuning doc, the prose salvage,
  STATE) — i.e. the glossary exists nowhere in this project except as Appendix F.

**Excluded as passing mentions** (mentioned in 4a only as a group): the many
occurrences of "manual" meaning *by hand* (manual deploy, manual copy step,
`scrollRestoration:"manual"`); "plate" meaning a photographic plate on the image
wall; "page" meaning a web page; "print" meaning `console.log`; and "structure"
meaning a data structure.

## Coverage key

**IS** = what the manual is · **MADE** = how it is made · **RELEASED** = how it is
released · **REACHES** = how it reaches the museum · **SEEN** = how a visitor sees
it.

## The table

### ROBOTS repo

| path · date | covers · what it decides or proposes |
|---|---|
| `tools/manual_structure_build.py` — 2026-08-05 (git log) | **MADE, IS.** The live generator: one source, two outputs (PDF + `pages/page-NN.png`), rasters made FROM the PDF so the two can never disagree; the whole 12-section / 8-appendix structure and 93-entry index are literal data inside it. |
| `docs/MANUAL_PERIOD_MODEL-20260805.md` — 2026-08-05 (filename + git) | **IS.** Rules that the arrangement must be *attested, not chosen*, and cites every borrowed convention to HP 465A (Mar 1965), Tektronix 561A (1962), TM 11-5556 (1956) and MIL-M-38784. |
| `docs/MANUAL_TYPED_PAGE-20260805.md` — 2026-08-05 | **MADE, IS.** Carries Mike's typewriter ruling verbatim, establishes that the four structural models are all *typeset* and therefore cannot supply physical character, and adopts the Class-B typed-and-offset exemplar (MIT/IL R-477); §4 is the honest list of what the renderer cannot do. |
| `docs/MANUAL_TYPED_PAGE_TUNING-20260805.md` — 2026-08-05 | **MADE.** Records Mike's *"SPOT ON"* plus three level corrections (T1 ink range, T2 banding, T3 waggle), proves his banding hypothesis measurably false, and lists every changed constant; nothing structural moved. |
| `docs/MANUAL_STRUCTURE_FIT-20260805.md` — 2026-08-05 | **IS.** Loads 100 known facts about the machine into the structure: 62 fit, 20 demanded-and-absent, 6 no-room, 8 no-home. Decides nothing; concludes *the manual is structurally hostile to the story.* |
| `docs/MANUAL_STRUCTURE_HOLES-20260805.md` — 2026-08-05 | **IS.** 17 factual disagreements the manual exposes (display size, lamp count, which glass wakes first, detector/diversion counts, where the Answer Engine lives, power type), 20 empty demanded positions, 11 undeveloped areas, and 7 decisions the structure forces onto Mike. |
| `docs/drafts/MANUAL_PROSE_SALVAGE-20260805.md` — 2026-08-05 | **IS.** Holding doc: 2,428 words of drafted manual prose rescued verbatim from the two retired sources, with a warning table naming six places the prose is measurably wrong. Explicitly *not adopted, ruled or verified.* |
| `tools/manual_tuning_compare.py` — 2026-08-05 | **MADE.** Builds the three before/after comparison sheets in `manual/structure/tuning/`; holds `BEFORE_HAND`, the pre-tuning straightedge constants, for veto. |
| `docs/EXHIBIT_CONTAINER_PROPOSAL-20260729.md` — 2026-07-29 | **SEEN, REACHES.** Proposes the `plate` container kind for the manual: page images not text digitisation, microfiche-flavoured scrub nav, mandatory zoom-to-legibility; asks whether the manual jumps the build queue. |
| `docs/ASSET_REVEAL_CHECKLIST.md` — undated in name | **RELEASED, SEEN.** Lists The Manual as BUILT and proposes three reveal modes — ANNOUNCED (a track today) · HINTED (a plate at a time) · DISCOVERED (findable via the Portal only). **Its figures are stale**: it still says *24-page, 22 sections, 5 `[ART REQUIRED]`, 9 `[PAPA]`*. |
| `docs/SPEC_INVENTORY-viiip-ux-20260714.md` — 2026-07-14 | **IS.** Not about this document: it inventories the *2024 instruction manual* and 2022 proto-manual as source material (D.4 etc.). It is the origin of most facts the structure issue must eventually hold. |
| `robots/mgk-viiip/sources/2022-proto-docs/README.md` — 2026-07-14 | **IS.** Provenance of the 2022 proto-manual `.docx` (rescued under ruling 6, MD5-verified) — the source of the one quoted CAUTION and of SCAT, RADIONET and the uncrating list. |
| `STATE.md` (§ACT ONE BUILD, §MANUAL SHIFT 2026-07-23, §B6, §THE WALK PACKET) — 2026-07-17 → 2026-08-05 | **MADE, RELEASED.** Records the v1 generator (24 pages), the owner's-manual draft, "doors lock at **manual-print**" and "rearrangeable-free until **manual-print lock**" as a project milestone, and twice names the **marked-up printed manual** as the only un-captured source / a standing location lead. |
| `docs/SPEC-health-degradation-20260724.md` — 2026-07-24 | **IS.** Specifies a monitor line of the class **SEE MANUAL p.NN** — the one place the *machine* points at a page of the manual that does not exist. |
| `docs/ACT1_BOM-20260717.md`, `docs/PLACEHOLDER_LEDGER-20260724.md`, `docs/MENU_MAP_v3-…`, `docs/BENCH_MANIFEST-20260724.md` — Jul 2026 | **IS.** Passing: each names manual positions or `[PAPA]` slots the manual will have to carry. Not printed in 4b. |

### MUSEUM repo

| path · date | covers · what it decides or proposes |
|---|---|
| `docs/MUSEUM_BINGE_TEMPLATE_LOG-20260802.md` §B8 — 2026-08-02 | **RELEASED, SEEN.** **THE CONFLICTING RULING.** The manual must be actual scans via microfiche-class technology; the generated PDF/plates are *the source Mike prints and photographs*, not the artifact. Records the shoot spec (≥2400px, whole page, reel order, `label`+`date`). |
| `reveal/schema.mjs` — R3, 2026-08-05 | **RELEASED.** **CONFLICTS.** Defines `PROD = ["needed","printed","photographed","placed"]`, derives `build` and `state` from it, and writes `"Mike prints and photographs this page"` into every unfinished page row's `deps`. Also `manualPages()` — the length read off the robots tree. |
| `reveal/ledger-declare.mjs` §7 / §7b — 2026-08-05 | **RELEASED.** **CONFLICTS.** `doc.manual.plates` = *"The Manual's microfiche plates — the photographed pages"*, `deps: ["Mike's camera…"]`, `shown: true`. The `MANUAL_PAGE()` vessel is built and **deliberately called zero times**. |
| `reveal/ledger.json` — generated | **RELEASED.** The state of record: `doc.manual` LIVE/REVEALED · `doc.manual.plates` NOT_BUILT/HELD · `face.viiip.manual` PARTIAL with no picture · `phys.manual.original` HELD. `prod` is **null on all 167 rows**. |
| `src/data/artists/robots.js` (VIIIp `Documentation` face) — 2026-08-06 (N3) | **SEEN.** **CONFLICTS on the glass.** Ships the sentence *"when they are made they are photographs of the printed sheet, edges and margins included"* with `plates: []`. |
| `src/data/artists/robots.js` (NIAC `Documentation` face) — 2026-08-06 | **SEEN.** States the mainframe holds no document, and that the portable arrived with *"a manual — ABEAL 8P-OMI-1, incomplete, assembled out of copies caught at different stages."* |
| `docs/MUSEUM_PARITY_RULING_AND_TRIM_LOG-20260805.md` — 2026-08-05 | **SEEN.** P2/M45: the Manual's face loses its only picture. *Either the plate shows a page actually written, or there is no plate until one exists.* |
| `docs/MUSEUM_CLEAR_THE_DECK_LOG-20260806.md` §D6 — 2026-08-06 | **RELEASED.** M61 RULED: the manual stays offline until real pages exist; nothing is published from the 61-page structure issue. |
| `docs/MUSEUM_REMOTE_CONTROL_LOG-20260805.md` — 2026-08-05 | **RELEASED, SEEN.** Raises M61: the reader is built, the pipeline is one data block, and *there is no page to put in it* — every page reads `[ TEXT REQUIRED ]`. |
| `docs/MUSEUM_ROBOTS_SIMPLIFICATION_LOG-20260805.md` §G1 — 2026-08-05 | **IS.** Mike: *the old 24-page manual is DEAD… the manual is as long as the manual needs to be.* The count becomes derived. Also documents the last live still (`working-copy-p1.png`) and the M45 judgement call. |
| `docs/MUSEUM_RECORD_MACHINERY_LOG-20260805.md` §R3 — 2026-08-05 | **REACHES, RELEASED.** Builds the manual-page vessel and proves it with throwaway specimens; opens **M44** — *which page does the story reach for first?* — and refuses to populate a single row. |
| `docs/ASSET_TIMELINE.md` §5.1 — 2026-08-07-ish | **REACHES.** The manual spans transfer classes: the volume is BLAST (launch), the pages are PACKAGE *because a photographed page is a photograph of paper somebody is holding*. Names the gap: the first-48-hours pages have no rows. |
| `docs/PROVENANCE_RULINGS-20260804.md` §R4 — 2026-08-04 | **SEEN.** Finds the Manual's still is a clean digital render where B8 requires a photograph of a print; asks whether it is the source-shown-as-source or a placeholder. |
| `docs/VISUAL_HOOK_AUDIT-20260803.md` — 2026-08-03 | **SEEN.** Wants the manual's own WORKING COPY title page *"labelled as the source that gets printed and photographed"*; notes the reel is empty and B8 untouched. |
| `docs/MUSEUM_EVENING_LOG-20260803.md` — 2026-08-03 | **SEEN.** Chooses the working-copy title page as the face's still precisely because its own type says PRELIMINARY — WORKING COPY / NOT FOR DISTRIBUTION and so argues against being mistaken for the artifact. |
| `docs/MUSEUM_PAGE_BY_PAGE_LOG-20260806.md` §N3/N8 — 2026-08-06 | **SEEN.** "THE MANUAL" becomes "DOCUMENTATION"; the unit noun becomes PHOTOGRAPH *because* photographs-not-scans-not-renders is load-bearing in this wing — citing B8 by name. |
| `docs/MUSEUM_CLEAN_SLATE_LOG-20260804.md` — 2026-08-04 | **SEEN.** Rewrites the reel note to *"No pages on file. A plate here is a photograph of the printed sheet, edges and margins included."* |
| `docs/MUSEUM_ATTACHMENTS_LOG-20260808.md` — 2026-08-08 | **SEEN.** Verifies the attachment row for *"The unphotographed page"* — `document · Unknown · 1 page · not here yet` — the museum's shape for a page it does not hold. |
| `docs/OPEN_ACTIONS.md` — live register | **All five.** Live rows: **M44** (which page first — *"It comes out of his voice sessions, not out of a build"*), **M48** (the face has no picture), **P2** (the microfiche plates + shoot spec), **M89** (six attested sections struck, one carried a `[PAPA]`), **15c** (when the manual and the firmware disagree about a 1965 machine, which wins). |
| `docs/REVEAL_LEDGER_AUDIT.md` — audit | **RELEASED.** Audits `phys.manual.original` as LIVE-but-never-shown. |
| `docs/MUSEUM_CULL_LOG-20260808.md` / `docs/MUSEUM_LIGHT_TABLE_LOG-20260808.md` / `docs/MUSEUM_CLEANUP_LOG-20260809.md` — Aug 8–9 | **Bookkeeping, but load-bearing.** `usedBy` is empty on all 139 robots-repo asset rows **including the 61 manual pages**, so a naive cull *"would have deleted the manual"*; and 24 stale asset rows pointing at the retired 24-page manual were found and culled. |
| `docs/canonical/OPERATIONS.md` — living | **All five, by reference.** Carries the above as §5 rows and hazard rows; the manual is named in the cull, the orphan-check and the transfer-class sections. |
| `tools/dictation/spec-source.mjs` + `docs/dictation-20260807/specsheet.html` — 2026-08-07 | **IS.** Argues why the in-story spec sheet does **not** use the manual's twelve-section structure (ten of the twelve are procedures), but makes every group carry its manual position so nothing has to be re-derived. Cites register **N-i**: the firmware overrules the manual in one row. |
| `provenance/asset-table.json` — generated | **REACHES.** 66 manual-path rows (61 pages + 3 tuning + 2 face screenshots). Every one `quality: null` / `verdict: null` / `bucket: null` — **nobody has inspected any page of this manual.** |
| `STATE.md` — living | **All five.** Mirrors B8, R4, M61 and the "ART-pending" status of the reel. |

## The five questions — current settled answer, and where it is contradicted

**1 · What the manual IS.**
*Settled.* `ABEAL 8P-OMI-1`, MGK-VIIIp Operating and Maintenance Instructions, a
1965 in-house engineering document — **STRUCTURE ISSUE**, structure and
arrangement only, text not supplied. 12 roman sections, 8 lettered appendices,
107 paragraph positions, 31 tables, 10 figures, a 93-entry index, **61 pages**.
Its arrangement is attested to four period documents; its physical character is
typed, not typeset. In the fiction it is *incomplete, assembled out of copies
caught at different stages.*
*Contradicted:* only by stale figures in `ROBOTS/docs/ASSET_REVEAL_CHECKLIST.md`,
which still says 24 pages / 22 sections. Everything else has been brought along.

**2 · How it is MADE.**
*Settled.* One deterministic Python generator, `SEED = 19650301`, emitting a PDF
and rasterising 61 greyscale PNGs from it. Character grid 12 cpi × 6 lpi, Courier
New struck one glyph at a time, bold by overstrike, heads underscored with the
underline key, table rules typed with hyphens and verticals ruled by hand,
figures in hand-cut paste rectangles, and a final pass simulating a process
camera and an office copier.
*Contradicted:* nowhere. Every level of it was reviewed by Mike on 2026-08-05 and
called *"SPOT ON"* with three level-only corrections, which were made and
measured.

**3 · How it is RELEASED.**
***NOT settled, and this is where the CLEAN PNG ruling lands.*** The body of work
holds **two live bars**, and they are separable:
- **The FORM bar (B8, 2026-08-02):** the artifact is a photograph of a printed
  sheet, never a rendering. **The CLEAN PNG ruling reverses this.** B8 is cited
  as still standing as recently as 2026-08-06 and is wired into `schema.mjs`,
  `ledger-declare.mjs`, `ledger.json`, `robots.js` and `OPEN_ACTIONS` P2.
- **The CONTENT bar (P2/M45 2026-08-05, M61 2026-08-06):** nothing is published
  from a document whose pages read `[ TEXT REQUIRED ]`. **The CLEAN PNG ruling
  does not obviously speak to this**, and M61's own wording separates the two
  ("*even written pages still need his printer and his camera*").

**4 · How it REACHES the museum.**
*Settled in shape, empty in fact.* The manual arrives **in pieces, as a supply
line rather than a scanning project**: the museum takes only the pages a Record
entry reaches for, one at a time. The volume is transfer class BLAST (on the
glass at launch); the pages are PACKAGE. The vessel `manualPageRow()` is built,
validated and proven with throwaway specimens, and is **called zero times by
instruction** — populating it would be Ops deciding which page the story reaches
for. That decision is open as **M44**.
*Contradicted:* the PACKAGE classification's stated *reason* ("a photographed
page is a photograph of paper somebody is holding") does not survive the CLEAN
PNG ruling, though the classification itself may.

**5 · How a VISITOR SEES it.**
*Settled as machinery, held as content.* A microfiche-flavoured reader is built
in `Exhibit.jsx` / `RobotsExhibitFlow.jsx`: pages, wraps, counts frames, Fit ↔
Magnify, arrow keys, Escape, opens in place. The Documentation face is a document
card template shared with the Record. **Today a visitor sees: one card, titled
"The owner's manual", source ABEAL 8P-OMI-1, marked held, not clickable, saying
no page images are on file.** `plates: []`.
*Contradicted:* the card's own sentence promises *photographs of the printed
sheet* — a promise the CLEAN PNG ruling makes false. That string is shipped, not
a comment.

---

## WHAT I COULD NOT DETERMINE

1. **Whether the 61 PNGs, as they exist, are what "the CLEAN PNGs" means.** They
   carry a deliberate simulated-photocopy pass (toner specks, ±0.10° feed skew,
   ±0.16° scan skew, contrast crush, an uncovered platen edge) and are re-decoded
   from JPEG at quality 62. Nothing in the body of work distinguishes "clean" as
   *these files* from "clean" as *undistressed type*, because the distinction had
   no reason to exist before the ruling.
2. **Whether the CLEAN PNG ruling reaches the blank-page bar (M61) or only the
   form bar (B8).** Both readings are consistent with the corpus.
3. **Whether any page has ever actually been printed or photographed.** I found
   no evidence in either repo, and I list five independent confirmations of the
   negative in 4c — but the event would have happened at Mike's desk, and neither
   repo would necessarily know.
4. **What the "marked-up printed manual" is.** Named twice in ROBOTS/STATE.md as
   the only un-captured prior source and a standing location lead, never
   described, never located. I could not tell whether it is the same object as
   the ledger's `phys.manual.original`.
5. **What `manual-print lock` was supposed to mean as a milestone.** ROBOTS/STATE
   twice makes the menu structure *"rearrangeable-free until manual-print lock"*
   and says *"doors lock at manual-print"*. Whether that milestone survives a
   reveal with no print, I cannot tell from the text.
6. **The exact page-image byte identity of the current renders against the
   recorded SHA-256s.** The tuning doc records a hash over the 61 PNGs
   concatenated; I did not recompute it, because verifying it is not this job and
   the number is only meaningful against a rebuild.
7. **Whether Section X or Appendix F ever appeared in the retired 24-page
   document under the same numbering.** The v1 generator used 22 arabic sections;
   its pages are deleted and only reachable through git history, which I read the
   log of but did not check out.

## WHAT NEEDS MIKE

1. **B8 must be explicitly superseded, or it keeps governing.**
   *"the manual must be ACTUAL SCANS of the ACTUAL manual via microfiche-class
   technology, and the generated PDF/plates become the source Mike prints and
   photographs — not the artifact."* Two later rulings were decided on top of it
   and cite it by name (P2/M45, M61). It is not a note in a log — it is quoted in
   `robots.js`, `schema.mjs`, `ledger-declare.mjs`, `STATE.md` and the art
   register.
2. **One word on "clean".** Do the 61 existing PNGs ship as they are — carrying
   the simulated photocopy dirt, skew and specks — or does CLEAN mean the distress
   pass comes off? This changes whether anything has to be rebuilt at all.
3. **Does the CLEAN PNG ruling lift M61?** *"the manual stays OFFLINE until real
   pages exist… nothing is published from the 61-page structure issue."* Every
   page still reads `[ TEXT REQUIRED ]`. If M61 stands, the CLEAN PNG ruling
   changes the delivery form of a thing that still cannot be delivered.
4. **The production arc `needed · printed · photographed · placed` needs a
   replacement vocabulary or a ruling that it stays.** `build` is *derived* from
   it in `schema.mjs`, so this is not cosmetic: under a CLEAN PNG reveal, two of
   the four stages describe events that will not occur, and `photographed →
   PARTIAL` has no input to derive from.
5. **One shipped visitor-facing sentence becomes false the moment the ruling
   takes effect.** On `/robots`, the Documentation card reads: *"No page images
   on file — when they are made they are photographs of the printed sheet, edges
   and margins included."* This is data in `src/data/artists/robots.js`, not a
   comment.
6. **Resolution.** B8's ≥2400px long edge was called *"the one thing that cannot
   be fixed later in code."* The live PNGs are **1275 × 1650** (150 dpi). The
   internal master is 240 dpi and `--dpi` is a flag, so this one IS fixable — but
   somebody has to say what number the clean PNGs ship at.
7. **M44 is still the gating question and the CLEAN PNG ruling does not answer
   it:** *which page does the story reach for first?* The register's own note says
   *"It comes out of his voice sessions, not out of a build."*
8. **P2 in the art register** (the microfiche plates, with the shoot spec) is
   either closed by this ruling or rewritten by it. It cannot stay as written.
9. **Optional, and the highest-value remaining quality lever now that the file is
   the artifact:** `MANUAL_TYPED_PAGE-20260805.md` §4.1 says the one fix for
   outline-perfect glyphs is to type a specimen page on a real machine (or get a
   high-resolution scan of one) and cut a glyph library from it. That is a
   *specimen*, not a facsimile of the manual — it does not conflict with the
   CLEAN PNG ruling, and it is the difference between *"reads as typed at a
   glance"* and *"survives being looked at closely."*
