# THE LIGHT TABLE — round log, 2026-08-08

**Four instructions (L1–L4), all four done.** L5's fallback was not needed.

Gates: lint **11 errors / 9 warnings = baseline** · build **green** ·
`provenance:gate` **PASS** · `reveal:check` **PASS** · `parity:gate` **PASS, 4
shared · 0 divergences** · `instory:gate` **PASS** · `assets:orphans` **0** ·
`reveal:day` **nothing to move** · **the lap RAN at 390px and 1228px on all ten
Ops pages**, page overflow 0, uncontained 0, leaf text overflow 0.

Nothing was deployed. Nothing in `src/` changed.

---

## §1 — L1: THE 27 CALIBRATION FRAMES ARE GONE, AND THE GLOVE QUESTION IS SHUT

**28 files, 3.20 MB.** `content/burps/derived/_cal/` — 27 frames
(`IMG_9766__s0…s8`, `IMG_9767__s0…s8`, `IMG_9768__s0…s8`), `cal.json`, and the
folder. The 27 asset-table rows went with them via `npm run assets:cull`; the
table is **277 → 250 rows on disk**.

**Before deleting, the reference scan was redone rather than trusted.** A grep
for the frame basenames across both repositories returns **`cal.json` and
nothing else**. `tools/burp_calibrate.py` and `tools/clip_pan.py` name the
`--work` convention, not the folder; nothing reads it.

**THE ONE FACT THIS ROUND WANTS ON THE RECORD: they were never in git.**
`content/burps/.gitignore` excludes the whole burp tree — `git ls-files` on that
directory returns one `.gitkeep`. There is no object to restore them from, and
`git status` in the robots repo is clean after a 3.20 MB deletion, which is
exactly the shape that makes a deletion look like it never happened.

### The glove videos — answered, and closed

> **Mike, 2026-08-08:** the burp MP4s **are** the glove videos.

The cull round searched for a filename (`*glove*`, `*.MOV`) and reported *"the
glove videos are in neither repository"*. The material was in front of it under
another name: `content/burps/processed/IMG_9766.MP4`, `IMG_9767.MP4`,
`IMG_9768.MP4`. **So the KEEP clause was satisfied all along** — the glove
footage survived as sources and was never at risk; the eleven stills that died
were frames pulled out of it.

It is written into `docs/MUSEUM_CULL_LOG-20260808.md` §2 as an answered
question so no future round goes looking. **And it is now visible:** the three
MP4s are three tiles on the light table and play in its viewer.

---

## §2 — L2 / C3: THE ARTIFACT TRACKER IS A LIGHT TABLE

> **Mike, on the page it replaces:** *"Without a preview, and a means to see it
> in a viewer — not very useful."*

`tools/dictation/lighttable.mjs` (new) · `buildArtifacts()` in
`tools/dictation/prep.mjs` (rewritten) · `docs/dictation-20260807/artifacts.html`.

**250 tiles. A tile is a picture, a filename, a size, and — only when it says
something he can act on — one chip.** Click it and the viewer opens the file at
full size with everything the old five columns carried beside it: what it shows,
reach today and why, the public address, quality / verdict / arc / bucket, the
uid, and what uses it. `←` `→` walk, `Esc` closes, and the walk follows the
**filtered** set rather than the whole table.

### The population widened, and it was his own sentence that widened it

*"Build it over the POST-CULL set so it shows only what still exists."*

The old page's first table was the **47 rows with a public address**. Everything
the cull touched is in the robots repo and has **no address at all** — so over
that population "post-cull" could not have meant anything. It is now **every
asset-table row whose file is on disk: 250**, and the 27 `missing: true` rows are
the only ones out, said in the footer rather than left as a shortfall.

### Four decisions worth knowing

| | |
|---|---|
| **The viewer loads the real file, not a bigger data URI** | The thumbnail is inlined at 240px so the grid paints with no file access; the viewer points at a relative path out of `docs/dictation-20260807/` into whichever repo owns the file (`../..` for the museum, `../../../weird-baby-robots` for the other). The page is **1.0 MB** instead of several hundred, and *"shows it properly"* means the actual pixels. |
| **A failure says so** | If the file cannot be read the viewer prints the path it tried and falls back to the 240px thumbnail. **Proved by pointing a row at a file that is not there.** A viewer that silently showed a re-encode while claiming the original is the quiet kind of wrong. |
| **`the machines` is a UNION** | `governed` needs a `/robots/…` public address, and the robots repo holds 143 pictures of the same two machines with none. A chip labelled *the machines* that showed seventeen of them would answer a question about the RULE while he is asking one about the OBJECTS. It reads **161**. |
| **Audio and video are not failures** | 69 audio rows draw a ♪ and play in the viewer; the three MP4s draw a ▶ and play. The first cut drew them *"no thumbnail · mp4"* — true, and it reads as broken. **Two tiles say no thumbnail and mean it**: `favicon.ico` and `icons.svg`, a format sharp will not open and a symbol sprite with nothing to render. |

**Thumbnails are cached by content hash** (`sha256 + px`, gitignored,
`--fresh` to ignore it): the first run rendered 168 and the next took 0. A file
whose bytes change gets a new key, so a stale thumbnail is unreachable by
construction.

**The ledger half stayed a table and stayed second.** Transfer class, arc and
dependencies are properties of a revealable THING, not of a file; faking them
into the grid would have been the full join the tracker has never had.

---

## §3 — L3 / C4: THE PREAMBLES, AND WHAT THE MEASUREMENT SAYS

> **Mike:** *"All the stuff at the top, I never read."*

**Ten instruments audited. The number is how far down the page the first control
he can use sits, at 390px, before and after.**

| instrument | before | after | |
|---|---|---|---|
| the artifact tracker → **the light table** | **2014px** | **126px** | −94% |
| the spec sheet | 2474 | 727 | −71% |
| the worksheet | 1524 | 219 | −86% |
| the open-actions register | 1537 | 398 | −74% |
| the egg tracker | 810 | 231 | −71% |
| the twelve-week table | 1421 | 661 | −53% |
| the Ops desk | 502 | 248 | −51% |
| the dictation index | 349 | 105 | −70% |
| the reference page | 482 | 279 | −42% |
| the contact sheet | 142 | 123 | −13% |

**Three to six screens of prose stood between him and the tool on four of them.**

### The rule that came out of it, because deleting was not the fix

**Almost nothing struck was WRONG.** The syntax of a section heading, the format
of a date, what a coloured band means — each was needed by somebody. What was
wrong was **where they were**. So Doctrine 25 carries a construction clause:

> a thing worth knowing goes **ON THE FIELD**, **IN THE FOOTER**, or on
> **`reference.html`** — and never above the work. If it fits none of those three,
> Ops raises it in conversation.

Worked examples:

- **ON THE FIELD.** *A line on its own in CAPITALS starts a new section* moved
  from the worksheet's masthead onto the `Executive summary` box. `ATTACH: what
  it is` moved onto the `Detailed sections` box. Both are syntax he cannot
  discover from the box, so the box is where they belong — the same argument
  Doctrine 22 makes about a limit.
- **IN THE FOOTER.** The egg tracker's *four eggs exist only as a ledger row* and
  *nothing reports an egg being tripped*. True, worth having, not needed to work.
- **ON `reference.html`.** The twelve headlines' provenance rule
  (`ARC_ORIGIN.rule`) is a third row in *Where the two weeks came from* rather
  than a paragraph over the twelve boxes.
- **DELETED OUTRIGHT.** The spec sheet's three paragraphs defending its own
  grouping; the reference page's *"this page exists because the last one put all
  of it in front of the work"*; the desk's *"a launcher cannot make a tool
  current"* over cards that each print their own age; the register's own
  restatement of Doctrine 14.

### A legend is not a briefing

The test is whether the page is unreadable without it. The arc's three bands and
the egg tracker's three states are printed on every row, so they survive — as
**one line of inline chips**, not a boxed note of five paragraphs.

### And it grows back, which is why it is a doctrine

`week1.html` was split into a worksheet and a reference page on **2026-08-07**,
for this exact complaint, with the split recorded as a standing rule. **Three
rounds later the worksheet's masthead was seven paragraphs** and the page it
replaced was 1524px from its first field. The pressure that writes a preamble is
a round wanting credit for what it understood.

---

## §4 — L4: DOCTRINE 24 INSIDE THE INSTRUMENTS

**The register lost 49 more lines (386 → 337)** and, more to the point, lost a
question it had been asking after the answer.

**SHORT-LIST ROW 15a WAS ASKING HIM TO RULE ON THE ELEVEN HELD PHOTOGRAPHS.** He
ruled **delete** at K1 on 2026-08-07 and all eleven left both repositories the
same day. The row survived, on the one page he is told is the one place he looks,
pointing at a review folder. It also cited `C-a` — a row id that had been
**re-used** by the cull round for the calibration frames, so the link went to the
wrong question.

Also gone from his view:
- **`C-a`** (the calibration frames) — ruled and executed this round; moved to
  `docs/OPEN_ACTIONS_CLOSED.md`, which is not on the Ops desk.
- **The short list's tail** — 2,031 characters of Ops accounting for what it
  looked at and did not build, three paragraphs of it round narrative. The one
  reason not already in a row (why the `[[n]]` door check stays unbuilt) moved
  **into `C6`'s row**.
- **The head of the file** — 1,284 characters of doctrine, provenance and legend
  before the first question. The status/owner legend now sits above the first
  table that uses it; the maintenance rule and the build note are at the foot.
- **The artifact tracker's two ruling recaps** — the bouncy-ball correction and
  013's prototype status, both read back at him above the work. Both are still on
  `reference.html`, where they are standing rules rather than a recap, and both
  still have open rows.

**One thing was found and deliberately NOT executed, and it is named rather than
done:** a copy of the eleven deleted photographs survives **outside both
repositories** at `C:\AI\Projects\_review\HELD-PHOTOGRAPHS-20260806\photographs\`.
Doctrine 24 says *not archived where it resurfaces*; C1's safety clause says a
real photograph is not deleted on Ops' word. Removing the LINK satisfies the
first without breaking the second. Register `L-b`.

---

## §5 — THE FINDINGS NOBODY ASKED FOR

### (a) A 27px page-level sideways scroll that read as zero

At 390px `CONTACT_SHEET.html` scrolled sideways by 27px while the overflow probe
reported **0 uncontained elements**. Both readings were correct: the offender is
the group heading `museum/public/held/robots/reference/photos`, a directory path
with no spaces in it, and **the `<h2>`'s own box is inside the viewport while its
TEXT is not.**

**A check that reads element boxes cannot see text overflow.** The probe was
extended with an `el.scrollWidth > el.clientWidth` pass over leaf elements, which
found it in one run. One line fixed it (`overflow-wrap:anywhere`), and all ten
pages now read 0 on both checks at both widths.

Worth carrying: this is the same shape as the round that measured a 404 page and
reported a clean zero. **A gate that reports zero should be asked what it is
capable of seeing.**

### (b) 24 asset-table rows point at a manual that moved, and the orphan tripwire is structurally blind to them

`robots/mgk-viiip/manual/pages/page-01…24.png` are all flagged `missing: true`.
The manual is at `robots/mgk-viiip/manual/structure/pages/` and has **61 pages**,
and the 24 stale rows share a sha256 with none of them — the document was
regenerated as well as moved.

**`npm run assets:orphans` reports 0 and is right by its own definition:** it
counts `missing && isJudged`, and all six judged fields on all 24 rows are null.
So the one instrument whose job is to notice a row whose file is gone **cannot
see 24 of the 27 rows in that state.**

Nothing draws them (the light table excludes them by Mike's own wording), so it
costs nothing today. **Not culled this round on purpose:** a 24-row deletion from
the asset table on the same day as a 27-row cull should be a deliberate act, not
a ride-along. `npm run assets:cull <the 24 paths>` is the whole of it. Register
`L-a`.

---

## §6 — WHAT WAS TOUCHED

**New:** `tools/dictation/lighttable.mjs`.

**Rewritten:** `buildArtifacts()` in `tools/dictation/prep.mjs`.

**Preamble audit:** `tools/dictation/prep.mjs` (spec sheet, egg tracker, index),
`tools/dictation/worksheet.mjs` (worksheet, arc, reference),
`tools/ops-desk.mjs` (the desk, the register rendering),
`tools/contact-sheet.mjs` (the marking box moved below the pictures; the
phone-width fix).

**Data:** `provenance/asset-table.json` (27 rows culled).
**Registers:** `docs/OPEN_ACTIONS.md`, `docs/OPEN_ACTIONS_CLOSED.md`.
**Doctrine:** `docs/canonical/OPERATIONS.md` §7 Doctrine 25.
**Deleted:** `weird-baby-robots/content/burps/derived/_cal/` (28 files).

**Generated:** all seven dictation pages, `docs/CONTACT_SHEET.html`,
`docs/OPS_DESK.html`, `docs/OPEN_ACTIONS.html`.
