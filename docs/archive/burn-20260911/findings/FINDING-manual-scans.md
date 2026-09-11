# FINDING — the six files scheduled into `/robots/manual/`

**Round:** manual scans, read-only packet.
**Written:** 2026-08-29.
**Scope:** READ ONLY. Nothing in the tree was changed. Every defect below is
flagged and not fixed.
**Repository:** `C:\AI\Projects\weird-baby-museum`, branch `main`.

**Method notation.** Every fact below carries **READ** (the tree states it, at a
named file and line) or **RUN** (a command was executed and this is its output).
Nothing here is inferred from a filename — where the tree does not say a thing,
this report says that it does not say it.

**This report does not judge whether these files satisfy M61.** §6 states why.

---

## 1 · THE M61 ROW, QUOTED WHOLE

**Source:** [`docs/OPEN_ACTIONS.md:159`](OPEN_ACTIONS.md#m61) — READ. The two
header lines above it (`docs/OPEN_ACTIONS.md:108-109`) are included so the
columns can be read. The row is reproduced byte-for-byte inside the fence.

```
| ID | What it is | Where it came from | Status | Owner | Raised |
|---|---|---|---|---|---|
| <a id="m61"></a>**M61** | **THE MANUAL CANNOT GO ONLINE WITHOUT REVERSING YOUR OWN RULING FROM YESTERDAY.** *Known:* your P8 — *"THE MANUAL GOES ONLINE in a document viewer (microfiche register) — visitors page through what there is to page through, and no further."* **THE VIEWER IS BUILT AND WAS VERIFIED THIS ROUND**: `RobotsExhibitFlow`'s reader pages with ‹ Prev / Next ›, wraps at both ends, prints `title · date · frame n of m` on its rail and toggles Fit ↔ Magnify. A reel is a data block and nothing else moves. *Missing:* a page. **The museum holds exactly ONE manual document — the 61-page STRUCTURE ISSUE — and its cover reads `STRUCTURE AND ARRANGEMENT ONLY / TEXT NOT SUPPLIED` while its interior pages read `[ TEXT REQUIRED ]` and `[ ART REQUIRED ]`.** *Why it matters:* **P2, one round ago, struck a single page of that document from this same face**, in your words — *"it was the museum admitting it had not written the manual, wearing a fiction as cover"* — with the rule *either the plate shows a page actually written, or there is no plate until one exists*. Publishing 61 of them is that ruling reversed at 61× the scale. And B8 stands beside it: the artifact is a PHOTOGRAPH of a printed sheet, never a rendering, so even written pages need your printer and your camera. **Ops did not publish and did not silently do nothing** — the viewer is proved, and this is the one question. **RULED D6 (CLEAR THE DECK): THE MANUAL STAYS OFFLINE UNTIL REAL PAGES EXIST.** Mike: *"the viewer is built and stays built; nothing is published from the 61-page structure issue — same ruling as the single struck plate, one scale up."* **Nothing shipped, which is the ruling working:** the reader still pages, wraps, counts frames and toggles Fit ↔ Magnify; `reel.plates` is still `[]`; the face still says *No pages on file*. What it now waits on is a WRITTEN page, printed and photographed — which is [P2](#p2) in the art register and B8's standing spec, not a build. | P8 · REMOTE CONTROL | **RULED — HELD** | Mike | 2026-08-05 |
```

**THE STANDARD THE ROW SETS, in the row's own words.** Quoted out of the block
above so the rest of this report has something to be measured against — the
extraction is verbatim and adds nothing:

> **RULED D6 (CLEAR THE DECK): THE MANUAL STAYS OFFLINE UNTIL REAL PAGES EXIST.**

> Mike: *"the viewer is built and stays built; nothing is published from the
> 61-page structure issue — same ruling as the single struck plate, one scale
> up."*

> What it now waits on is a WRITTEN page, printed and photographed

and the standing spec the row names beside it:

> B8 stands beside it: the artifact is a PHOTOGRAPH of a printed sheet, never a
> rendering, so even written pages need your printer and your camera.

Status on the row: **RULED — HELD**. Owner Mike. Raised 2026-08-05.

---

## 2 · WHAT IS SCHEDULED INTO `/robots/manual/`, AND ON WHAT DAY

### 2.1 · How the schedule is established

The schedule is **not typed anywhere**. It is computed, and this report computed
it rather than reading a list somebody wrote down.

| step | where | method |
|---|---|---|
| The entries' own `assets` arrays are the input | `reveal/record-clock.mjs:196-197` — *"THE SCHEDULE IS BUILT, NOT GUESSED: it is the Record's own `assets` arrays keyed by the entry's own date"* | READ |
| `assetSchedule()` keys each path to the earliest entry that names it | `reveal/record-clock.mjs:206-216` | READ |
| The entries are read by `entries()` | `reveal/record-entries.mjs`, parsing `src/data/artists/robots-record.js` | READ |
| The day comes from a join on the entry's `no` | `vite.config.js:76-82` (`RECORD_DAY_OF`) | READ |
| The result is baked into the worker as `__WB_RECORD_ASSETS__` | `vite.config.js:613-614` | READ |
| The worker withholds a path until its day | `reveal/record-clock.mjs:219-224` (`assetWithheld`) | READ |

The schedule was then **executed**, not reconstructed:

```
node -e "Promise.all([import('./reveal/record-entries.mjs'),
                     import('./reveal/record-clock.mjs')]).then(([re,rc])=>{ ... })"
```

RUN, output verbatim:

```
RECORD_DAY_OF: [[1,"2026-09-07"],[2,"2026-09-08"],[3,"2026-09-09"],[4,"2026-09-10"],[5,"2026-09-11"]]
SCHEDULE:
   2026-09-09 /robots/manual/marked-01-a.webp
   2026-09-09 /robots/manual/scan-07-a.webp
   2026-09-09 /robots/manual/scan-07-b.webp
   2026-09-09 /robots/manual/scan-11-a.webp
   2026-09-09 /robots/manual/scan-11-b.webp
   2026-09-09 /robots/manual/scan-31-a.webp
   2026-09-10 /robots/portal/qc-101-a.webp
count 7
```

### 2.2 · The list

**SIX files are scheduled to publish into `/robots/manual/`. THE COUNT IS SIX,
MEASURED.** All six carry the same day.

| # | public path | publishes | named by |
|---:|---|---|---|
| 1 | `/robots/manual/scan-07-a.webp` | **2026-09-09** | Record entry `no: 3` |
| 2 | `/robots/manual/scan-07-b.webp` | **2026-09-09** | Record entry `no: 3` |
| 3 | `/robots/manual/scan-11-a.webp` | **2026-09-09** | Record entry `no: 3` |
| 4 | `/robots/manual/scan-11-b.webp` | **2026-09-09** | Record entry `no: 3` |
| 5 | `/robots/manual/scan-31-a.webp` | **2026-09-09** | Record entry `no: 3` |
| 6 | `/robots/manual/marked-01-a.webp` | **2026-09-09** | Record entry `no: 3` |

**All six are named by ONE entry — Record 003 — and by no other.** RUN: the
entries' `assets` arrays are `[]`, `[]`, the six above, `["/robots/portal/qc-101-a.webp"]`,
`[]` for entries 1–5 respectively.

**A SEVENTH GOVERNED PICTURE IS SCHEDULED AND IS NOT IN THIS LIST.**
`/robots/portal/qc-101-a.webp` publishes **2026-09-10** from Record entry `no: 4`.
It is in `/robots/portal/`, not `/robots/manual/`, and it is out of scope here.
It is named only so the six is not mistaken for a subset that lost one.
[`docs/HANDOFF_next_session.md:69`](HANDOFF_next_session.md) — *"Six of the seven
governed pictures publish into `/robots/manual/`"* — is confirmed by measurement.

### 2.3 · Where the day comes from

- `src/data/artists/robots-record.js:516` — entry `no: 3` carries `date: recordDay(3)`. READ.
- `src/data/artists/record-epoch.js:116` — `export const RECORD_EPOCH = "2026-09-07";`. READ.
- `recordDay(3)` resolves to `2026-09-09`. RUN.
- **2026-09-09 is a Wednesday.** The day the museum calls *the ninth*.
- The hour is **17:00 America/New_York**, not midnight — `reveal/record-clock.mjs:52-57`, Mike's ruling of 2026-08-17. READ.
- No date literal is written in the entry. The epoch has moved twice (Ruling C to 2026-08-31, Ruling D to 2026-09-07) and the entries were not edited either time — `src/data/artists/record-epoch.js:66,99`. READ. **Older logs in this tree therefore name older days for these same files** — e.g. `docs/MUSEUM_ASOF_FORWARD_LOG-20260827.md:244` shows `scan-07-a.webp [due 09-02]`, which was true under the previous epoch and is not true now.

---

## 3 · THE FILES ON DISK

**Method.** `stat -c %s` and `sha256sum` were executed against each path — RUN.
Presence is `test -f` — RUN. Git tracking is `git ls-files --error-unmatch` — RUN.
The right-hand columns compare that measurement against what
`provenance/asset-table.json` records — READ.

| file | present | bytes (RUN) | sha256 (RUN) |
|---|---|---:|---|
| `public/robots/manual/scan-07-a.webp` | **YES** | 109,982 | `1e5ccec1e0df13bc59d99c61a3e992dbce2f787db0d6baf17984c6c133cf758e` |
| `public/robots/manual/scan-07-b.webp` | **YES** | 58,310 | `fc5fff37af3470df807588e83c4c152d48efe55928070ea3b6c9214e29457506` |
| `public/robots/manual/scan-11-a.webp` | **YES** | 66,824 | `298b8db4461e3b8750129cc44cb3b1173c2e5a4d6ea6cad4050af574ef4f18e9` |
| `public/robots/manual/scan-11-b.webp` | **YES** | 109,982 | `1e5ccec1e0df13bc59d99c61a3e992dbce2f787db0d6baf17984c6c133cf758e` |
| `public/robots/manual/scan-31-a.webp` | **YES** | 98,104 | `b5572b9b61de7ef3cfb3c6efc02d00fee7f25413f894f9f628b920fc21ef840f` |
| `public/robots/manual/marked-01-a.webp` | **YES** | 111,224 | `d512acd04294794114cc0a6ce6217526c114be5129c3c8ee3116f7f10f448767` |

**All six are present. Nothing is missing.** RUN.

| file | git (RUN) | asset-table `bytes` (READ) | asset-table `sha256` (READ) | agrees |
|---|---|---:|---|---|
| `scan-07-a.webp` | TRACKED | 109,982 | `1e5ccec1…cf758e` | **yes** |
| `scan-07-b.webp` | TRACKED | 58,310 | `fc5fff37…457506` | **yes** |
| `scan-11-a.webp` | TRACKED | 66,824 | `298b8db4…f4f18e9` | **yes** |
| `scan-11-b.webp` | TRACKED | 109,982 | `1e5ccec1…cf758e` | **yes** |
| `scan-31-a.webp` | TRACKED | 98,104 | `b5572b9b…ef840f` | **yes** |
| `marked-01-a.webp` | TRACKED | 111,224 | `d512acd0…448767` | **yes** |

**The asset table's measurement and today's measurement agree on every file, in
both bytes and hash.** The same table records all six at **1700 × 2200**, format
`webp`, `role: "shipped"`, `usedBy: ["src/data/artists/robots-record.js"]` —
`provenance/asset-table.json`, READ.

**One cross-reference in the tree is stale and is flagged, not fixed:**
[`docs/canon/BELL-103.md:256`](canon/BELL-103.md) records `marked-01-a.webp` as
**"RENDERED, ON DISK, UNCOMMITTED … untracked in git"**. Measured today it is
**TRACKED**. See §7 F3.

---

## 4 · WHAT EACH FILE ACTUALLY IS, AS FAR AS THE TREE CAN SAY

**Rule followed here: nothing is read off a filename.** The tree explicitly
forbids it — [`docs/canon/09-PUBLISHED.md:488-499`](canon/09-PUBLISHED.md#ruling-11),
Ruling 11, READ:

> **`07`, `11` and `31` are frame numbers from whoever filmed the manual.** They
> match nothing in the document and **they are not meant to.** … **no public
> address may assert a page of the manual**

So `scan-07` is not page 7 of anything, by the tree's own ruling. Every binding
below is one the tree writes down somewhere, with the somewhere named.

**Four registers in this repository say something about these files. No fifth
was found.**

| register | what it binds | where |
|---|---|---|
| The Record entry | attachment title, source, page count, plate label, plate order | `src/data/artists/robots-record.js:544-577` |
| `provenance/assets.json` | the master render each file was derived from, and a transcription of the text in the image | `provenance/assets.json`, rows keyed by `ref` |
| `docs/canon/07-MANUAL.md` | the **position in the document** — paragraph or appendix, not page | `docs/canon/07-MANUAL.md:91-95` |
| `provenance/asset-table.json` | file facts only — path, bytes, hash, dimensions, who uses it | `provenance/asset-table.json` |

**`provenance/asset-table.json` says nothing about content.** For all six rows,
`what`, `quality`, `verdict`, `revealArc` and `bucket` are **`null`**. READ. The
file-level authority does not say what any of these pictures is.

---

### 4.1 · `scan-07-a.webp`

- **What names it.** Record entry `no: 3`, attachment 1 of 4: `title: "Scan 07 - Power supply and distribution"`, `source: "ABEAL 8P-OMI-1"`, `pages: 2`. `src/data/artists/robots-record.js:545-547`. READ.
- **Position inside the attachment.** `plates[0]` of 2 — `label: "Power supply and distribution, first page"`. `src/data/artists/robots-record.js:549-550`. READ.
- **Position inside the document.** **¶7-19, POWER SUPPLY AND DISTRIBUTION** — [`docs/canon/07-MANUAL.md:93`](canon/07-MANUAL.md#written), which lists it among *"THE THREE WRITTEN PARAGRAPHS"*, delivered as `scan-07-a.webp` + `scan-07-b.webp`. READ.
- **What it was made from.** `provenance/assets.json`, grade `VERIFIED`: *"generated by `tools/manual_structure_build.py` in the weird-baby-robots repo at `fdea38e`; master render `robots/mgk-viiip/manual/structure/page-33.png` at 2550x3300, published here as 1700x2200 WebP q82"*. READ.
- **Transcribed running foot.** `ABEAL 8P-OMI-1 | 7-4` — from the same provenance row's `text`, transcribed *"from the generator's own layout ops … not read off the render"*. READ.
- **The tree does not say it is a photograph.** The only origin it gives is a generator and a render. No printer, no camera and no photographed-on date is recorded for this file anywhere that was found.

### 4.2 · `scan-07-b.webp`

- **What names it.** Same attachment — `plates[1]` of 2, `label: "Power supply and distribution, second page"`. `src/data/artists/robots-record.js:551-552`. READ.
- **Position inside the document.** ¶7-19, with `scan-07-a` — `docs/canon/07-MANUAL.md:93`. READ.
- **Made from.** Master render `robots/mgk-viiip/manual/structure/page-34.png` at 2550x3300; same generator, same commit `fdea38e`; published 1700x2200 WebP q82. `provenance/assets.json`, grade `VERIFIED`. READ.
- **Transcribed running foot.** `ABEAL 8P-OMI-1 | 7-5`. READ.
- **The tree does not say it is a photograph.** Same as 4.1.

### 4.3 · `scan-11-a.webp`

- **What names it.** Record entry `no: 3`, attachment 2 of 4: `title: "Scan 11 - The video link"`, `source: "ABEAL 8P-OMI-1"`, `pages: 2`; `plates[0]` of 2, `label: "The video link, first page"`. `src/data/artists/robots-record.js:554-559`. READ.
- **Position inside the document.** **SP 7-14, THE VIDEO LINK** — `docs/canon/07-MANUAL.md:94`. READ. Also [`docs/canon/06-PORTAL.md:14`](canon/06-PORTAL.md) — *"it is published in full as `scan-11-a.webp` / `scan-11-b.webp`, Record 003."* READ.
- **Made from.** Master render `robots/mgk-viiip/manual/structure/page-32.png` at 2550x3300; generator `tools/manual_structure_build.py` at `fdea38e`. `provenance/assets.json`, grade `VERIFIED`. READ.
- **Transcribed running foot.** `ABEAL 8P-OMI-1 | 7-3`. READ.
- **The tree does not say it is a photograph.** Same as 4.1.

### 4.4 · `scan-11-b.webp`

- **What names it.** Same attachment — `plates[1]` of 2, `label: "The video link, second page"`. `src/data/artists/robots-record.js:560-561`. READ.
- **Position inside the document.** SP 7-14, with `scan-11-a` — `docs/canon/07-MANUAL.md:94`. READ.
- **Made from.** `provenance/assets.json` names master render **`robots/mgk-viiip/manual/structure/page-33.png`** at 2550x3300 — **the same master path it names for `scan-07-a.webp`** (§4.1). READ.
- **Transcribed text.** Its `text` field in `provenance/assets.json` is **character-for-character the same string** as `scan-07-a`'s, running foot `ABEAL 8P-OMI-1 | 7-4` included. READ.
- **So the tree binds one file to two positions.** The Record labels it *"The video link, second page"*; `provenance/assets.json` derives it from the master the Record's *"Power supply and distribution, first page"* is also derived from. Both statements are in the tree. **This report does not resolve which is right.** See §5 and §7 F2.
- **The tree does not say it is a photograph.** Same as 4.1.

### 4.5 · `scan-31-a.webp`

- **What names it.** Record entry `no: 3`, attachment 3 of 4: `title: "Scan 31 - Bias settings"`, `source: "ABEAL 8P-OMI-1"`, `pages: 1`; `plates[0]` of 1, `label: "Bias settings, the four communications settings"`. `src/data/artists/robots-record.js:563-568`. READ.
- **Position inside the document.** **B-1, BIAS SETTINGS** — `docs/canon/07-MANUAL.md:95`. READ.
- **Made from.** Master render named as `robots/mgk-viiip/manual/structure/page-47.png` at 2550x3300. `provenance/assets.json`, grade `VERIFIED`. READ. **That path does not resolve** — §7 F1.
- **Transcribed running foot.** `ABEAL 8P-OMI-1 | B-1`. READ.
- **The tree does not say it is a photograph.** Same as 4.1.

### 4.6 · `marked-01-a.webp`

- **What names it.** Record entry `no: 3`, attachment 4 of 4: `title: "Marked copy 01 - Bias settings"`, `source: "ABEAL 8P-OMI-1"`, `pages: 1`; `plates[0]` of 1, `label: "Bias settings, returned marked"`. `src/data/artists/robots-record.js:570-575`. READ.
- **Position inside the document.** **Appendix B-1** — [`docs/canon/06-PORTAL.md:389`](canon/06-PORTAL.md): *"Appendix B-1, published as `marked-01-a.webp` in Record 003"*. READ. `docs/canon/07-MANUAL.md:95` carries it in the B-1 row as *"(+ `marked-01-a.webp`, unpublished)"*. READ.
- **The tree states the filename asserts nothing.** [`docs/canon/BELL-103.md:275-277`](canon/BELL-103.md): *"The filename asserts no page. `marked-01`, not `marked-b1` — a sequence of marked copies, and nothing about the document."* READ.
- **The tree states it is not called a scan, and why.** `docs/canon/BELL-103.md:271-274`: *"It is deliberately not called a scan … this page was not recovered from the ZIP and was not filmed."* READ.
- **Made from.** `provenance/assets.json`, grade **`MIKE`** rather than `VERIFIED`: *"the same master page as `scan-31-a`, rendered a second time with Mike's own pen on it"* — sheet generated by `tools/manual_structure_build.py`, master render `robots/mgk-viiip/manual/structure/pages/marked/page-47.png` at 2550x3300, sha256 `3bc2150b71321e3d51644eab65f0f70aaba938d183b9281716d55c0e3d2989b9`, published as 1700x2200 WebP q82 by `tools/manual-derivative.mjs`. READ. **That master path resolves and its recorded hash matches the file on disk** — RUN, §7 F1.
- **The handwriting has its own origin, and it is the one photograph named in the set.** Same provenance row: *"The HANDWRITING is Mike's, ballpoint on paper, photographed 2026-08-19 and segmented by `tools/handwriting_segment.py` from `robots/mgk-viiip/manual/marks/source/handwriting-20260819.jpg`"*, with the four strike-throughs and the PRELIMINARY stamp *"drawn by the generator"*. READ. **The photograph inside this file is of Mike's marks, composited onto a rendered sheet. The tree does not say the sheet itself was printed or photographed.**
- **It is a second render, not a retouch.** `docs/canon/BELL-103.md:280-287`, READ — the unmarked and marked leaves are emitted separately *"so the pair can be differenced and audited."*

---

## 5 · `scan-07-a.webp` AND `scan-11-b.webp`

**YES — they are still byte-identical.** Measured today, RUN:

```
1e5ccec1e0df13bc59d99c61a3e992dbce2f787db0d6baf17984c6c133cf758e  public/robots/manual/scan-07-a.webp
1e5ccec1e0df13bc59d99c61a3e992dbce2f787db0d6baf17984c6c133cf758e  public/robots/manual/scan-11-b.webp
```

| | `scan-07-a.webp` | `scan-11-b.webp` |
|---|---|---|
| sha256 | `1e5ccec1e0df13bc59d99c61a3e992dbce2f787db0d6baf17984c6c133cf758e` | `1e5ccec1e0df13bc59d99c61a3e992dbce2f787db0d6baf17984c6c133cf758e` |
| bytes | 109,982 | 109,982 |
| asset-table uid | `A-4bf51d5e61` | `A-2719ecaec2` |
| Record label | *"Power supply and distribution, first page"* | *"The video link, second page"* |
| attachment | Scan 07, plate 1 of 2 | Scan 11, plate 2 of 2 |
| master named in `provenance/assets.json` | `…/structure/page-33.png` | `…/structure/page-33.png` |
| transcribed `text` | identical to the other | identical to the other |

**The hashes are equal, the byte counts are equal, and the two provenance rows
name the same master.** Two asset-table rows, two uids and two labels stand over
one photograph. That is what [`docs/HANDOFF_next_session.md:75-78`](HANDOFF_next_session.md)
recorded and what this round re-measured, and that handoff's own words still
hold: *"Whether that is one sheet legitimately appearing twice or a duplication
is not something the build can answer."*

---

## 6 · WHAT THIS REPORT DOES NOT DO

**This report does not judge whether these six files are the pages M61 requires.**

M61 is **RULED — HELD**, owner **Mike**, and what it waits on is *"a WRITTEN
page, printed and photographed"*. Whether the six files above are that is a
judgement, it is Mike's, and **he is not being asked for it in this window.**

The facts are in §2 through §5, and this report stops there. Nothing was fixed,
moved, renamed or corrected. §7 is a list of things found, flagged and
deliberately left alone.

---

## 7 · FLAGGED, NOT FIXED

### F1 · Five of the six provenance rows name a master render path that does not exist

`provenance/assets.json` gives each `scan-*` file a master at
`robots/mgk-viiip/manual/structure/page-NN.png`. Checked against the robots
repository on this machine (`C:\AI\Projects\weird-baby-robots`) — RUN:

```
ABSENT   robots/mgk-viiip/manual/structure/page-32.png
ABSENT   robots/mgk-viiip/manual/structure/page-33.png
ABSENT   robots/mgk-viiip/manual/structure/page-34.png
ABSENT   robots/mgk-viiip/manual/structure/page-47.png
PRESENT  robots/mgk-viiip/manual/structure/pages/page-32.png          2,289,488 b
PRESENT  robots/mgk-viiip/manual/structure/pages/page-33.png          2,477,299 b
PRESENT  robots/mgk-viiip/manual/structure/pages/page-34.png          2,219,481 b
PRESENT  robots/mgk-viiip/manual/structure/pages/page-47.png          2,473,115 b
PRESENT  robots/mgk-viiip/manual/structure/pages/marked/page-47.png   2,531,813 b
```

The leaves are one directory deeper, under `structure/pages/`.
`docs/canon/BELL-103.md:290-298` already flagged this **for `scan-31-a` alone**
on 2026-08-26. **It holds for all five `scan-*` rows, not one.** The
`marked-01-a` row is the only one whose master path resolves — and its recorded
sha256 `3bc2150b71321e3d51644eab65f0f70aaba938d183b9281716d55c0e3d2989b9`
matches the file on disk exactly (RUN).

### F2 · One photograph stands at two manual positions

§5. Two uids, two labels, one hash, one named master. Not resolvable from the
tree; recorded here so the ninth does not arrive with it unstated.

### F3 · `BELL-103.md` records `marked-01-a.webp` as uncommitted; it is tracked

[`docs/canon/BELL-103.md:256`](canon/BELL-103.md) — *"RENDERED, ON DISK,
UNCOMMITTED … untracked in git"* — and the row below it, *"A visitor has seen
it — NO — Neither file is committed or deployed."* RUN today:
`git ls-files --error-unmatch public/robots/manual/marked-01-a.webp` succeeds;
the file is tracked, as are the other five.
[`docs/canon/09-PUBLISHED.md:255`](canon/09-PUBLISHED.md) already carries the
correction — *"**PUBLISHED** (committed 2026-08-19; corrected here
2026-08-21)"* — so the two canon files disagree with each other.

### F4 · The structure issue renders 63 pages; the museum calls it 61

M61 and the canon both name *"the 61-page STRUCTURE ISSUE"*. RUN, in the robots
repository: `robots/mgk-viiip/manual/structure/pages/` holds **63** page
renders, `page-01.png` through `page-63.png`, plus the `marked/` directory.
Adjacent to this packet rather than inside it, and flagged only because M61's
own wording rests on that number.

---

## 8 · EVERY COMMAND RUN

Read-only throughout. No command in this list writes to the museum tree.

```
git branch --show-current
git status --short
git ls-files --error-unmatch public/robots/manual/<each of six>
stat -c %s public/robots/manual/<each of six>
sha256sum public/robots/manual/<each of six>
node -e "import('./src/data/artists/record-epoch.js') … recordDay(1..5)"
node -e "import('./reveal/record-entries.mjs') … entries() → no, date, assets"
node -e "… assetSchedule(recordEntries(), e => RECORD_DAY_OF.get(e.no) ?? null)"
sha256sum robots/mgk-viiip/manual/structure/pages/{page-32,page-33,page-34,page-47,marked/page-47}.png
ls robots/mgk-viiip/manual/structure/pages/*.png | wc -l
```

Everything else in this report is READ, at the file and line named beside it.
