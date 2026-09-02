# SCOPING THE THREE — counting, the 118 MB, and front_screen.png

**2026-08-25 · read-only · companion to `MANUAL_DIVERGENCE_FINDINGS-20260825.md`.
Nothing fixed, nothing copied, nothing deleted.** Both repos clean at
`5d6320a` / `3f78972` before and after.

---

## 1. CANON'S COUNT — THE GENERATOR CAN REPORT ITS OWN PAGINATION, AND IT ALREADY DOES

### 1.1 What the defect actually is

**Canon did not invent a counting method. It copied the generator's own summary
line — and that line has no page count in it.**

`manual_structure_build.py` prints, after a full run:

```
      %d sections, %d appendices, %d paragraph positions, %d tables, %d figures, %d index entries
```

built from `sum(1 for b in BODY if b[0] == …)` and `len(INDEX)`. Measured
against the live generator today, that line emits:

> `12 sections, 8 appendices, 108 paragraph positions, 31 tables, 10 figures, 94 index entries`

Canon's Extent cell is that line, six numbers in the same order — **with
"61 pages" prepended, which that line never produced.** The page count comes
from two *different* prints, on the rendering path:

```
PDF   …  (%d pages, %.1f MB)          <- len(imgs)
PAGES …  (%d images, %dx%d at %d dpi) <- len(d), the rasterised PDF
```

So the failure is not arithmetic. **A number was taken from a line that does
not contain it**, and the six numbers around it — which do come from that line
— are still right. That is why canon's generator line count (2,151) is exactly
correct today while the page count beside it is two out.

`BODY_7_19` (6 entries), `BODY_7_14` (4) and `BODY_B_1` (8) are **not inside
`BODY`** — verified by identity, `False`. Anything counting off `BODY` is blind
to them by construction, and will stay blind to the next body block too.

### 1.2 Yes — and it can do it without rendering anything

`layout()` is **pure**. It builds a `Doc`, appends pages, and returns; it opens
no file and writes nothing. The module's only top-level imports are
`argparse, math, os`. The `--marked-only` path already relies on this — it calls
`layout()` twice and touches nothing but `MARKEDDIR`.

Measured, with `builtins.open` and `os.makedirs/remove/rename` monkeypatched to
raise on any write:

| call | result |
|---|---|
| `layout(None)` | **55 pages** — first pass, no TOC / LOT / LOI / index yet |
| `layout(lists)` | **63 pages** ← the answer |
| rendered PNGs on disk | **63** |

**63 = 63, in about a second, with nothing written.** `len(doc.pages)` after the
two-pass layout is the authoritative count, and the two-pass shape is not
optional: a single pass reports **55**, because the front and back matter are
sized from the first pass's own lists. **A naive one-pass count is a third way
to get a wrong answer.**

### 1.3 The recommendation

**Add a `--count` (or `--pages`) flag that runs the two-pass `layout()` and
prints `len(doc.pages)`, then have canon quote that.** It is a handful of lines,
it renders nothing, and it makes the number derivable on demand instead of
remembered.

**A full run must NOT be the way to get the number.** The generator's own
comment says why, at `--marked-only`:

> *"The clean PDF and its 63 page images are TRACKED FILES and one of them is
> already published. A full run rewrites 120 MB of them to produce one new page,
> and any drift in an encoder between then and now would land as a silent change
> to a master the museum has already shown."*

### 1.4 One thing to fix while in there, and one not to rule on

- **The two `manualPages()` are different functions reading different trees.**
  `reveal/schema.mjs` → the robots source → **63**. `tools/numbers-gate.mjs` →
  the museum's copy → **61**. Same name, same repo, opposite answers. That is
  the whole of the two-number problem.
- **Do not rule canon's table count wrong without deciding the definition.**
  The generator prints `tabs + 1` = **31**; canon says **30 reserved tables**.
  Canon's number equals raw `tabs`. Whether "reserved" excludes the +1 is a
  definition question, not a measurement error — flagged, not fixed.

### 1.5 The ledger is already right, and it is the only surface that is

`reveal/ledger.json`'s `doc.manual` row:

> *"The live source is the STRUCTURE ISSUE … at
> `robots/mgk-viiip/manual/structure/pages`, **63 pages as this was built**.
> The count is derived, never declared."*

**G1's "derive it, never declare it" ruling produced the one correct published
number in the building.** Every surface that declared a literal is two out.

---

## 2. THE 118 MB — WHAT REMOVES IT, AND WHAT BREAKS

### 2.1 Confirmed: the asset table does have rows

| | |
|---|---|
| rows under `public/held/robots/manual/` | **64** |
| of those, `page-NN.png` | 61 |
| of those, `tuning/compare-page-*.png` | 3 |
| role | **`unreferenced`, all 64** |
| verdict | **`null`, all 64** |
| bytes | **120,346,035** (matches the disk walk exactly) |

**And nothing else names them.** `reveal/ledger.json`, `provenance/register.json`
and `src/data/artists/*.js` contain **zero** occurrences of
`held/robots/manual/page-`. `provenance/assets.json` has **0** rows for them.
The four ledger rows that mention manual pages — `doc.manual.page.32/33/34/47` —
point at the **public WebP derivatives**, not at these PNGs.

### 2.2 They are 64% of the launch door

| | files | bytes |
|---|---:|---:|
| `public/held` today | **137** | **186,888,028** |
| ├ `manual/page-NN.png` | 61 | 118,076,129 |
| ├ `manual/tuning/compare-*` | 3 | 2,269,906 |
| └ everything else | 73 | 66,541,993 |
| **after removing all 64** | **73** | **66,541,993** |

The current pair is exactly what OPERATIONS §0 publishes, and `docs:numbers`
confirms **MATCH**.

### 2.3 What each candidate does

| candidate | effect | verdict |
|---|---|---|
| **`.gitignore`** | Nothing. All 64 are **git-tracked** (`git ls-files` → 64), and ignoring does not untrack. Worse: **the deploy payload is `public/` on disk, not git** — vite copies the directory at build. A git-level change cannot stop them shipping. | **useless twice over** |
| **`reveal:day`** | Moves files between the held and public addresses **off a Record entry's `assets` array**. These files are in no entry. It will never see them — which is why every round log reads *"reveal:day nothing to move"*. | **not the tool** |
| **asset table** | Rows are a record, not a gate. `assets:scan` **merges and does not replace**, so the rows survive the files and become *missing from disk*: **13 → 77**. Pruning is a deliberate act. | **necessary, not sufficient** |
| **delete from disk** | The only thing that removes them from the payload. | **the operation** |

### 2.4 What breaks — three things, one of them a crash

1. **`docs:numbers` THROWS.** `measure.manualPages()` is
   `fs.readdirSync(path.join(REPO, "public/held/robots/manual")).filter(…)` with
   **no existence guard** — there is no `existsSync` anywhere in
   `numbers-gate.mjs` — and it is called unconditionally at line 354 as well as
   inside the rule. **Delete the directory and the gate dies with ENOENT, not
   with a finding.** Whoever removes the files must repoint or guard that
   function in the same change — which is the same edit as fixing the check.
2. **OPERATIONS §0's published pair goes stale and the gate catches it.** The
   `held-cost` rule (`near: /publicly readable/i`) matches §0's
   *"137 files (186,888,028 bytes) become publicly readable"*. §0 must be
   updated to **73 files (66,541,993 bytes)** in the same commit or
   `docs:numbers:gate` exits 1. **This one is the gate working correctly.**
3. **`assetMissing` goes 13 → 77** unless the 64 rows are pruned in the same
   commit. §9's prune procedure applies.

**What does NOT break:** no visitor-facing surface, no ledger row, no register
chain, no Record entry, and not `reveal:check` — `reachability.mjs` proves the
**prefixes** agree across `worker.js`, `wrangler.jsonc` and vite, not that any
particular file exists behind them. The three `tuning/compare-*.png` are
**byte-identical to the robots originals**, which stay in the robots repo, so
deleting the museum copies loses nothing.

### 2.5 The question underneath

Even corrected, this copy has **no consumer**. Every published manual page
reaches a visitor as a WebP derivative under `public/robots/manual/`, cut from
the robots master by `tools/manual-derivative.mjs`. Re-copying the manual
correctly would put **~140 MB** behind the door for the same zero readers.
**The live question is not "which render should the copy hold" but "should the
copy exist at all."**

---

## 3. `front_screen.png` — THE MUSEUM IS CORRECT, AND IT WAS RULED, NOT DRIFT

### 3.1 The transform, measured

The two files are the same 2048×1536 RGBA image with an identical pixel
histogram. Tested directly:

| relation | result |
|---|---|
| identical | False |
| **rot180** | **True** |
| flip horizontal | False |
| flip vertical | False |

**The museum's file is the robots master rotated exactly 180°** — pixel for
pixel, no resample, no retouch. The byte difference (1,476,381 → 1,297,574) is
PNG re-compression after the rotation.

### 3.2 The direction of travel, from the blobs

| | sha256 | bytes |
|---|---|---|
| museum, before `6897b5c` | `a0800856de09…fe9727` | 1,476,381 |
| museum, after `6897b5c` (on disk today) | `3a6cb1b0f338…9db2a` | 1,297,574 |
| **robots master today** | **`a0800856de09…fe9727`** | **1,476,381** |

**The museum's pre-edit blob is byte-identical to the robots master.** The
museum changed it on 2026-08-11; the robots file has not moved since
`6628fbb`, 2026-07-23. There is no ambiguity about who edited.

### 3.3 It was deliberate, diagnosed, and logged — and the ruling's operation was wrong

`docs/MUSEUM_RED_NOTES_LOG-20260811.md` §**B3 — front_screen.png — FIXED, AND
THE RULING'S OPERATION WAS THE WRONG ONE**:

> *"The ruling said one horizontal flip. A horizontal flip does not fix it, and
> I looked before believing it. Applied first, exactly as instructed: the glass
> came back with the words in the right ORDER and every glyph vertically
> inverted — still unreadable. The file is **rotated 180°**, not mirrored. …
> **So the correction applied is a 180° rotation**, which is the one operation
> that achieves what the ruling was for."*

The log's own before/after sha256 table carries `a0800856…` as *before* —
**the same hash the robots master carries today**, which corroborates the whole
chain from a second source.

**So the answer to "which is correct" is the museum's, and not because it is
newer.** It is correct because the original photograph is upside down, a
horizontal flip does not fix an upside-down photograph, and someone rendered
both and looked before choosing.

### 3.4 Three consequences

1. **The robots master is the one that needs updating** — a robots-repo change,
   as Ops expected. Everything downstream of `reference/photos/front_screen.png`
   in the robots repo is still consuming the upside-down plate.
2. **`OPEN_ACTIONS` M2 is still `OPEN` and still carries the disproved
   diagnosis** — *"the WHOLE PHOTOGRAPH is flipped … so the fix is a horizontal
   flip of the file"* — four days after the round that measured it false and
   applied the right operation instead. `portal.js:65` repeats it: *"the plate
   M2 says is MIRRORED — every word on the screen backwards."* **Two live
   surfaces still publish a diagnosis the tree disproved.**
3. **It crossed in a commit about something else**, exactly like the manual:
   `6897b5c` *"The red notes are gone, and so are the boxes that showed them"* —
   14 files, one binary, no mention in the subject. The round log records it
   properly; the commit message does not.

---

## 4. THE PATTERN UNDER ALL THREE

Every crossing between these repos is a hand copy that **rides along inside a
commit about something else** — the manual in `000a03c` (*"The shelf goes from
eleven to a hundred and forty-three"*), `front_screen.png` in `6897b5c`
(*"The red notes are gone…"*). Only the twin has a named ritual, and it is the
only channel that is provably in step.

**Nothing in either repo compares the two trees.** The one instrument that
could — `measure.manualPages()` — reads the museum's copy, so even repointed it
can only prove the copy consistent with itself.
