# THE MANUAL HAS DIVERGED BETWEEN THE TWO REPOS — FINDINGS

**2026-08-25 · read-only investigation · nothing fixed, nothing copied, nothing deleted.**

Repos at measurement time, both clean:

| repo | HEAD | working tree |
|---|---|---|
| `weird-baby-museum` | `5d6320a` | clean |
| `weird-baby-robots` | `3f78972` | clean |

---

## 0. THREE PREMISES THAT NEEDED CORRECTING, AND TWO OF THEM CHANGE THE FIX

- **The museum's render exists in no robots commit — not one of the 61.** It
  cannot be re-copied from "the source", because no source revision ever
  produced it. It survives only in the museum's own history.
- **The `manual-pages` check is not dead. It is PASSING.** `npm run
  docs:numbers` → `PASS`, `manual pages 61`. The phrase it hunts *is*
  published, in `OPEN_ACTIONS.md` row **E-b**. Two stale numbers agreeing.
- **It is not a pre-typewriter manual.** It is post-typewriter, mid-tuning.

---

## 1. WHAT THE TRUE CURRENT MANUAL IS

**The robots repo holds it: 63 pages**, at
`robots/mgk-viiip/manual/structure/pages`, HEAD `3f78972`.

The 63-vs-61 gap is **neither two appended pages nor a clean renumbering — it
is two text insertions, the second of which reflowed the back half.** Commit
`fdea38e` (2026-08-19): *"Manual: first body text. 7-19 power supply, SP 7-14
the video link, B-1 parity bias. 61 to 63 pages."*

Diffing `d7622f5` (61pp) → `fdea38e` (63pp), page by page, off the git blobs:

| pages | state |
|---|---|
| 01–06 | **byte-identical** |
| 07–10 | changed — 7-19 power supply, SP 7-14 video link; absorbed, no downstream push |
| 11–31 | **byte-identical** |
| 32–61 | all changed |
| 62–63 | new |

27 unchanged, 34 changed, 2 added. **The front 31 pages did not move; from
page 32 the document is different everywhere and two pages longer.**

**THE EXACT REMAP OF PAGES 32+ COULD NOT BE PROVED, AND THE REASON IS
STRUCTURAL RATHER THAN A GAP IN THE EFFORT.** Every page prints its own page
number, and the typewriter renderer applies per-page strike variation, so a
reflowed leaf never hashes equal to its predecessor. Tested directly: `new
page-(N+2) == old page-N` for N=32..61 returns **0 matches of 30**. The PDF
carries no text layer (`/Font` absent, `/Image` present, FlateDecode only), so
there is no cheap textual oracle either. Establishing which old page became
which new page needs the generator's pagination, not hashes — which is §5
below.

## 2. EVERY PAGE THAT DIFFERS

| | count |
|---|---:|
| identical | **0** |
| different | **61** (page-01 … page-61) |
| museum only | 0 |
| robots only | 2 (page-62, page-63) |

Museum total 118,076,129 bytes · robots total 140,371,248 bytes. Every page is
larger on the robots side except **page-42** (−74,543) and **page-61**
(−52,980).

**AND THE MUSEUM'S RENDER IS AN ORPHAN.** Museum `page-01.png` is sha256
`af4abdef…`. The robots blob at every commit that ever touched that path:

| commit | date | pages | page-01 |
|---|---|---:|---|
| `cb09e88` | 2026-08-21 | 63 | `6d0276fa…` |
| `fdea38e` | 2026-08-19 | 63 | `6d0276fa…` |
| `d7622f5` | 2026-08-18 | 61 | `6d0276fa…` |
| `616f9d8` | 2026-08-18 | 61 | `6d0276fa…` |
| `9e8daa0` | 2026-08-05 | 61 | `cfac1d3b…` |
| `4cd78ac` | 2026-08-05 | 61 | `88d7119b…` |
| `c58777e` | 2026-08-05 | 46 | `03c5aec4…` |

None match. Scanning **every blob object in robots history**, not one of the
museum's 61 pages appears — **0 of 61 even by byte-size**.

Placing it: the museum files are stamped **2026-08-13 08:21**, committed
`000a03c` at 09:05. That is *after* the typewriter pass (`4cd78ac`, Aug 5) and
*during* the tuning later described by `d7622f5` as *"2026-08-11 tuning, seven
rounds with Mike."* **The museum copied an intermediate render mid-round, and
that render was never committed anywhere.**

## 3. HOW IT GETS ACROSS

**No tool. A hand copy, and one that left no record.**

`reveal/schema.mjs` only READS the robots path — `MANUAL_SRC =
"robots/mgk-viiip/manual/structure/pages"` at line 88, consumed by
`manualSourceState()` and `manualPages()` to count and validate. It never
copies. No script in either repo writes `public/held/robots/manual`.
`package.json` has no manual sync target.

Unlike the twin — which has a named standing ritual in `robots/STATE.md`
(D7: `Copy-Item …viiip_twin.html …public/robots/twin.html -Force`) — **the
manual copy has no ritual, no logged run, and no date.** The only record that
it happened at all is museum commit `000a03c` (2026-08-13, *"The shelf goes
from eleven to a hundred and forty-three"*), in which 64 manual files ride
along inside a 2,888-line asset-table change. **It was a side effect of a
different round.**

## 4. WHAT THE MUSEUM PUBLISHES, AND WHAT IS WRONG

**Nothing about the manual's length reaches a visitor.** A sweep of `src/` and
`index.html` for any manual page count returns zero hits. The count lives only
on Ops surfaces:

| where | says | verdict |
|---|---|---|
| `docs/canon/07-MANUAL.md:18` | "**61 pages** · 12 roman sections · 8 appendices · 108 paragraph positions…" — *"Counted off `BODY` and `INDEX` in the generator on 2026-08-20"* | **WRONG — 63** |
| `docs/canon/07-MANUAL.html` | same; generated from the `.md` by `ops-desk.mjs` | **WRONG — 63** |
| `docs/OPEN_ACTIONS.md` **T-A** | "THE MANUAL WAS 24 PAGES ON THE GLASS AND **61** IN THE BUILD" | **WRONG — 63** |
| `docs/OPEN_ACTIONS.md` **E-b** | "The manual is **61** pages of structure" | **WRONG — 63**, and this is the one the gate reads |
| `docs/ASSET_TIMELINE.md` :256, :271, :278, :422 | 61-page structure issue | **WRONG — 63** |
| `reveal/schema.mjs` | carries no number, by G1's ruling | correct by construction |

**ONE DETAIL INSIDE CANON'S OWN CELL IS THE WHOLE DIAGNOSIS.** It dates the
count to **2026-08-20** — *after* the 63-page build of Aug 19 — and the
generator line count in the same cell (**2,151**) is **exactly right today**.
The line count was measured against the current file; the page count beside it
was not. The generator now carries `BODY_7_19` (line 105), `BODY_7_14` (134)
and `BODY_B_1` (153) as constants **separate from `BODY`** (183). Counting
"off `BODY` and `INDEX`" **cannot see the three blocks that added the two
pages.** That is a repeatably wrong answer, not a slip.

`canon-gate.mjs` does not check this number. Nothing does.

## 5. THE `manual-pages` CHECK — THE PREMISE WAS WRONG

The rule is `find: /the manual is\s*(\d+)\s*pages/gi`, scanning a **fixed
8-file set**: `CLAUDE.md` (live part), `docs/canonical/OPERATIONS.md`, four
`OPERATIONS_ARCHIVE/*.md`, `docs/OPEN_ACTIONS.md`, `docs/BACKLOG.md`.
`STATE.md` is skipped whole.

**The phrase IS published, inside that set.** `docs/OPEN_ACTIONS.md` line 254,
row **E-b**:

> "…**The manual is 61 pages of structure** and every position reads
> `[ TEXT REQUIRED ]`."

`measure.manualPages()` reads `public/held/robots/manual` → 61. Published 61 =
measured 61 → **PASS**. Confirmed by running it: *"11 published claim(s)
checked in 8 document(s) … PASS — every standing value published in the
governing documents matches what the repository actually holds."*

**THIS IS WORSE THAN A CHECK POINTED AT NOTHING.** A check pointed at nothing
is visibly inert. This one returns green because it compares a stale published
number against a stale directory, and **the two failure modes cancel.** It is
§8's *an instrument that returns healthy is not evidence of health*, with both
halves wrong in the same direction.

Two other phrasings exist but are **outside the scanned set**:
`ASSET_TIMELINE.md:422` (*"THE MANUAL IS 24 PAGES ON THE GLASS AND 61 IN THE
BUILD"* — the regex would capture **24**) and a round log. Canon's phrasing is
`| **Extent** | **61 pages · …`, which the regex cannot match at all.

**And one more thing worth naming before the check is repointed:**
`measure.manualPages()` measures the museum's **copy**. Corrected, it can only
ever prove the copy consistent with itself. **Nothing measures the source, and
nothing compares the two directories.**

## 6. WHAT ELSE CROSSES THE SAME WAY

Both repos hashed whole — 967 museum files, 530 robots files. **76 files are
byte-identical across the two**, in seven channels:

| channel (museum ← robots) | in step | diverged | robots-only |
|---|---:|---:|---:|
| `public/robots/twin.html` ← `tools/viiip_twin.html` | 1 | 0 | — |
| `public/held/robots/audio/build/SD-18\|20\|23` ← `…/content/build/SD/18\|20\|23` | 58 | 0 | 0 |
| `public/held/robots/audio/burps` ← `content/burps/derived` | 3 | 0 | 1 |
| `public/held/robots/manual/tuning` ← `…/structure/tuning` | 3 | 0 | 0 |
| `public/robots/reference/photos` ← `reference/photos` | 4 | 0 | 3 |
| **`public/held/robots/reference/photos`** ← `reference/photos` | 2 | **1** | 4 |
| **`public/held/robots/manual`** ← `…/structure/pages` | **0** | **61** | **2** |

**THERE IS A SECOND DIVERGENCE AND IT POINTS THE OTHER WAY.**
`front_screen.png` — museum `1,297,574` bytes (2026-08-11 22:34) against robots
`1,476,381` (2026-07-23 13:18). **The museum's copy is the newer one**, it is
`role: shipped`, and it is `usedBy: src/data/artists/robots-units.js` — so
unlike the manual, **this one is on the glass.** The robots repo is holding the
stale master.

Note also that the audio channel **reshapes paths** on the way across
(`SD/20` → `SD-20`), so any comparer written later has to know the mapping
rather than walk two trees side by side.

## 7. TWO THINGS THAT CHANGE THE SHAPE OF THE FIX

**THE 61 HELD PNGs ARE `role: unreferenced`, `usedBy: []` — ALL 64 OF THEM.**
Nothing in `src/` references `/held/robots/manual/`. What a visitor actually
reads are six WebP derivatives under `public/robots/manual/` — `scan-07-a`,
`scan-07-b`, `scan-11-a`, `scan-11-b`, `scan-31-a`, `marked-01-a` — all
`role: shipped`, all `usedBy: src/data/artists/robots-record.js`. Those are
stamped **2026-08-19 11:17 and 22:56 — after** the 63-page build of 08:49 that
morning. *(That is a timestamp argument, not a pixel-lineage proof; WebP was
not verified against PNG across formats.)* `scan-07-a` and `scan-11-b` share
one sha256, which is Ruling 12's shared leaf behaving exactly as ruled.

So **"real shipped content" is true in the payload sense and false in the
visitor sense**: 118 MB of stale render is uploaded and becomes publicly
readable at launch under `/held/robots/manual/page-NN.png`, but no museum
surface links it, and the pages a visitor is actually given are current.

**AND `public/held/robots/manual/tuning/` HOLDS THREE `compare-page-*.png` OPS
DIAGNOSTICS** — byte-identical to the robots originals — sitting behind the
launch door where they become publicly readable. That is a Doctrine 11
question about an Ops artefact on a public address, not a divergence, but it
is in the same directory and nobody has looked at it.

---

## HOW THIS WAS MEASURED

All read-only. Git blobs were read with `git show <commit>:<path>` and
`git cat-file --batch-all-objects`; neither working tree was checked out,
modified, or written to. `npm run docs:numbers` was run in its reporting form
(not `--gate`); it writes nothing. Both repos verified clean at HEAD before and
after.
