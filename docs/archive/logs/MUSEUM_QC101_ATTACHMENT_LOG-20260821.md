# QC_101 → RECORD 004 — the round log, 2026-08-21

**Nothing is waiting on Mike.** The one open question — the attachment's title —
was put to him in the round and he ruled it. Everything is built, gated, on disk
and re-verified on the running page after the ruling.

---

## WHAT SHIPPED

| | |
|---|---|
| the file | `public/robots/portal/qc-101-a.webp` — 1700x2200 WebP q82, 76 KB |
| the master | `weird-baby-robots robots/mgk-viiip/portal/install/QC_101.png`, 2550x3300, 1 channel, 300 dpi, sha256 `ac9b86dc…f5c030` |
| the derivation | `node tools/manual-derivative.mjs --src … --out …` — the manual's own tool, unmodified |
| the docs row | Record 004, `src/data/artists/robots-record.js` |
| the badge | **ATTACHMENTS 1** on 004, measured on the running page |
| assets.json | `6c42acfb9464ce8b`, class **MIKE**, `textInImage: true` |
| register.json | three rows — the title (HOUSE), `ABEAL FORM QC-101` (VERIFIED), the plate label (HOUSE) |
| asset table | `A-26a62c7fdc`, `role: shipped`, joined to `record.004` in the ledger |

---

## THE TITLE — MIKE RULED IT

**`QC_101 - Final test and inspection`.** Ops drafted three and he took the
document's own name.

**OPS' RECOMMENDATION WAS NOT TAKEN, AND THAT IS WORTH THE LINE.** The
recommendation was `Install document - QC_101 final test and inspection`, on the
ground that *install document* is Mike's own published noun in 004's DETAILED
REPORT (*"Install document looks proprietary"*) and Ruling 10 favours a word
already on the glass. He preferred the shorter form that leads with the
filename. **Both halves of what he chose still restate things that exist**:
`QC_101` is the name he published in the folder listing, and FINAL TEST AND
INSPECTION is the sheet's own printed heading — so nothing about the ruling
weakens the Ruling 10 position, it just answers it a different way.

**What the two drafts shared and the ruling kept:**

- **Not `Scan`.** Record 003's published report names SCAN 07, SCAN 11, SCAN 31
  in his words; a fourth scan would force an edit to published text, which
  Ruling B forbids. It also happens to be true: this sheet was never filmed. It
  came out of the ZIP's INSTALL folder.
- **No number.** `Marked copy 01` took one because Mike said marked copies
  recur. Nothing says a second install document is coming, and `01` would
  promise one — Ruling 9's own shape, one size down.

**And the title could not move the file, which is why it was safe to ship
unsettled.** The public name is `qc-101-a.webp` — the document's OWN name,
published on the glass by Mike — not a class word Ops chose. `scan-NN` and
`marked-NN` derive from their titles; this one does not. **The ruling changed
the title and the register key and touched nothing else.**

**Filed HOUSE, not MIKE.** He selected a string Ops composed, and approval is
not authorship — the same distinction Record 001's index line is filed under.

---

## THE FORMAT QUESTION — OPS' READING CONFIRMED, WITH EVIDENCE

**The listing keeps `.TIF`; the museum serves WebP. No TIF is emitted.**
Written up as **Ruling 19**; the evidence is:

1. **Record 002's ADDENDUM 01 manifest names four `.tif` files.** The museum
   delivered them as `scan-07-a.webp`, `scan-07-b.webp`, `scan-11-a.webp`,
   `scan-11-b.webp`, `scan-31-a.webp`. Published since 19 Aug. **The precedent
   is not analogous — it is the same arrangement, already live.**
2. **There is no `.tif` anywhere in either repo.** The masters are PNG. Emitting
   one would create the first in the project's history, for no reader.

**The chain has three links and only the middle one is a real file:** the
in-story archive name (`QC_101.TIF`) → the 300-dpi master (`QC_101.png`, robots
repo) → the derivative a visitor downloads (`qc-101-a.webp`, museum repo).
Ruling 14 governed the second step; the first had never been written down.

**Ruling 14 now covers a sheet that is not a manual page**, and the tool's own
`2550x3300` refusal is what makes that safe to assert rather than assume — a
master of another size is refused by name, so reuse cannot silently rescale
something that is not a Letter page. QC_101 measured 2550x3300 and passed.

---

## THE PRECEDENT — FIRST ATTACHMENT ONTO A PUBLISHED RECORD

**Ruling 18**, in `docs/MUSEUM_RULINGS-20260817.md`, not here. Record 004 posted
20 Aug 17:00 and had been live a full day. Mike ruled it; his standing reason is
*"we have had no visitors."*

**Two things the write-up is careful about:**

- **The licence is about today's audience, not about Records.** It expires when
  visitors arrive, which is why the ruling says so in its own text rather than
  leaving a general-sounding permission behind.
- **It is the second back-post and the first onto published text.** Marked copy
  01 reached Record 003 on 19 Aug under Ruling B. What is new is only that a
  full day of publication had passed. **Record 004's own text is untouched to
  the character**, including *"not meant to seen"*.

---

## THE SIGNATURE — RULED AND CLOSED

> **"It looks like an evil little devil scribble. I am not willing to polish it
> further right now. It got its turn. Use it and proceed."**

**Ruling 20.** 2.5 lines, 1:1 with the source cut. **Recorded as closed rather
than as done**, and the diagnosis is kept with it, because the first candidate
was wrong and a later round would reach for it again: it was not clipping (the
flood-filled component is 81x104 against an 88x100 cut, and a generous re-cut
came back DENSER at 43.4% ink against 38.6%) — it was size, and at 1.7 lines the
0.68 downscale closed the interior loops. There is no alternative cut on the
sheet.

---

## WHAT WAS VERIFIED BY LOOKING, NOT BY A GATE

**The page was loaded.** `/robots/record` at `localhost:5179`, entry 004 opened,
and:

- the index row draws **ATTACHMENTS 1** — 003 still draws 4;
- the attachment row reads **QC_101 - Final test and inspection** /
  `DOCUMENT · ABEAL FORM QC-101 · 1 PAGE` — **re-read on the page after the
  title ruling, not carried over from the first pass**, which had shown the
  drafted title;
- the thumbnail is in the DOM at 44px and the reader opens a second `<img>` of
  the same file at **589 × 762** with `naturalWidth 1700` — it loads;
- the folder listing above it still draws as a pure indent tree, `/INSTALL` →
  `QC_101.TIF (hand written notes on form)`, with the attachment directly
  beneath it.

**The 2x-zoom check was done against the DELIVERED file, not the master.** The
reader draws 589px from a 1700px source, so 2x is ~1178px — under 1:1. Read at
that scale: the four strikes, the feed digit `3`, the PASS tick, `8/14/65` and
the monogram all resolve. Three overlapping full-resolution crops covered all
1700x2200 with no gap, which is also where the `textInImage` transcription's
written half came from.

**TWO PROBE FAULTS, NEITHER OF THEM THE SITE.**

1. **`naturalWidth` came back 0 for every image on the page, including the two
   cover logos.** The attachment thumbnails are `loading="lazy"` and lazy images
   do not load in a frame the browser is not painting — the same family as the
   `requestAnimationFrame` hazard and as the 08-17 `loading="lazy"` finding. A
   screenshot forces the paint; after that, 1700.
2. **The browser's zoom jumped to ~2x on scroll and on one plain click**, twice,
   which made three screenshots useless. It is the automation host, not the
   page: `devicePixelRatio` reported 2 on a freshly opened tab with no
   interaction. Measurements were taken through JS instead.

---

## GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 8 warnings — baseline** |
| `npm run build` | green |
| `npm run build:launch` | green |
| `npm run provenance:gate` | **PASS** (3 new rows) |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** — 0 findings |
| `npm run docs:numbers` | **PASS**, after correcting two stale counts (below) |
| `npm run reveal:day` | **nothing to move** — public 8, to place 0, to pull back 0 |
| `npm run assets:orphans` | **13 — unchanged (M9)** |

---

## THE ASSET TABLE WENT 460 → 475, AND ONLY ONE OF THE FIFTEEN WAS THIS ROUND'S

`npm run assets:scan` merges, it does not replace, so a scan run for one file
sweeps in everything else that has appeared since the last one. **Named, because
a count that moves by fourteen unexplained rows is exactly the M9 shape:**

- `public/robots/portal/qc-101-a.webp` — **this round.**
- `public/images/wb/steven-tyler-harmonica.jpg`, `public/images/wb/weird-baby-mark.png`
  — **legitimate and overdue.** Both are committed (`b7681c1`, 17 Aug); that
  round wrote their `assets.json` rows and never re-scanned the table.
- `robots:robots/mgk-viiip/portal/install/QC_101.png` — the master. Wanted:
  every manual master has a row, and Article 5 traceability needs it findable.
- `robots:…/manual/marks/digit-0.png` … `digit-9.png`, `tick-single.png` — **11
  sub-cuts of Mike's handwriting strips.** The strips themselves
  (`digits-1-to-8.png`, `digits-9-0.png`, `strokes-ticks.png`) already had rows;
  these are cuts taken from them.

**FLAGGED FOR MIKE, BECAUSE IT IS HIS REPO AND HIS COMMIT:** `marks/` and
`portal/` are **untracked in weird-baby-robots** — not gitignored, just not
committed. Every one of those twelve rows is an orphan until he commits them.
**And `digit-0.png` … `digit-9.png` have no committed producer**:
`qc101_form_build.py` reads them by name, `handwriting_segment.py` declares only
the strips, and nothing in either repo emits the individual digits. On a clean
clone the QC form cannot be re-rendered. `tick-single.png` IS regenerated on
every run, by `one_tick()`.

**Not treated as the M9 class and not skipped.** M9 is about *gitignored* trees,
where a row can never stop being an orphan; these resolve the moment Mike
commits. `SKIP_PATH` could not have excluded them anyway — it matches
directories, not files.

---

## TWO STALE PUBLISHED NUMBERS, CORRECTED WHERE THEY WERE PUBLISHED

`docs:numbers` failed on the `bucket`-is-null-on-all-N claim in two governing
documents, both reading **460** against a measured **475**:
`CLAUDE.md:454` and `docs/canonical/OPERATIONS.md:498`. Both corrected in this
round, with the prior value appended to the history each line already keeps
(315 → 385 → 397 → 404 → 459 → 460 → **475**). **`bucket` is still null on every
row and Ops still does not derive it.**

---

## BREADCRUMBS — WHERE THE FACTS WENT

| fact | filed in |
|---|---|
| a published Record may gain an attachment | `MUSEUM_RULINGS-20260817.md` **Ruling 18** |
| the in-story `.TIF` vs the served derivative | **Ruling 19**, cross-linked from Ruling 14 |
| the signature is final at 2.5 lines | **Ruling 20** |
| what QC_101 says, and the channel-3 fact | `docs/canon/06-PORTAL.md` **§8**, new |
| Record 004 as it actually published | `docs/canon/09-PUBLISHED.md`, rewritten |
| the bench never published | `06-PORTAL.md` §7 heading + `INDEX.md` |
| QC_101 in the concordance | `docs/canon/INDEX.md` |
| the 1965 inspector is NOT THREAD-003's man | `docs/THREADS.md` |

**Three canon corrections were found while filing and are not cosmetic:**

1. **`09-PUBLISHED.md`'s Record 004 section described an entry that no longer
   exists.** It listed the unattended-terminal sentence, the bi-directional
   Vid-Link sentence, the bench addendum and two `docs` titles — all struck by
   Mike on 20 Aug, the morning it posted. The page had not been brought along.
   Rewritten to what actually went out, with the correction stated in place.
2. **`06-PORTAL.md` §7 was headed *"written, scheduled, not yet published"*** and
   said the bench was *"in the bundle a visitor could open devtools and read."*
   The addendum was struck before 004 posted. **It never published and it is
   canon only** — the heading, the opening paragraph and the INDEX row all said
   otherwise.
3. **`09-PUBLISHED.md` still marked `marked-01-a.webp` "UNCOMMITTED. Not yet
   published."** `git ls-files` says otherwise; it went out with Record 003 on
   19 Aug.
