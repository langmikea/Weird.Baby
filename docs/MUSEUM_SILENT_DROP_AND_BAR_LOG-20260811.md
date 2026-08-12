# THE SILENT DROP, AND THE BAR (A · B · C)
2026-08-11 · write packet · not committed, not pushed, not deployed
HEAD at start: `eb571e1`, working tree clean.

---

## A. THE EDITOR NO LONGER DROPS PARAGRAPHS

### A1 — the reader takes either shape, and says which it found

`paragraphsOf()` in `reveal/record-entries.mjs` is now the one place a section
body's shape is decided. It accepts exactly what the renderer accepts:

| written as | example | result |
|---|---|---|
| a list | `body: ["one", "two"]` | two paragraphs |
| a string | `body: "one"` | one paragraph |
| a concatenation | `body: "one " + "two"` | one paragraph, folded |
| anything else | `body: SOME_CONST` | **fault, by name** |

**The asymmetry was the whole defect.** `SectionBody` in `RecordEntry.jsx` has
always read `Array.isArray(body) ? body : [body]`; the reader understood only
the list. A renderer that accepts two shapes and a reader that accepts one is a
data-loss machine with no error in it — whatever the reader cannot see, the
writer cannot preserve.

`npm run record` now prints which shape every section was found in:

```
15 section(s) read, 46 paragraph(s) — 11 written as a list, 4 written as a string
```

Nobody could ask that question before, which is why it took a screenshot to find.

### A2 — 013 opens whole

| | before | after |
|---|---|---|
| sections drawn | 4 | 4 |
| paragraphs drawn | **0** | **4** |
| characters | **445** | **850** |

Its lead (161) and tombstone (26) were never affected — they are scalar fields
and came through the whole time, which is part of why the gap read as a styling
question rather than a data one. Seen on the served page: four headings, four
paragraphs, lead, tombstone, 12 editable fields, no warning banner.

### A3 — it refuses now, and the refusal was proved by breaking it

**A printed warning was already there and it is not what failed.** The list it
printed was empty, because the reader did not KNOW it had lost anything: an
unknown shape became `[]`, which is a legal answer. So both halves changed —
the reader now tells *absent* from *a shape I do not understand*, and two things
refuse on the second:

- **`npm run record`** throws, names every record and field, and **does not
  overwrite the page on disk.** Proved by breaking `robots-record.js`: it
  refused, named `Record 13: section 4 \`body\` is a Identifier…`, and
  `record.html` was byte-identical afterwards (sha256 compared).
- **`npm run reveal:check`** fails the packet on the same list
  (`recordShapeFaults`). Same break: `CHECK: FAIL — 1 fault(s)`.

The file was restored from a copy and verified identical to git.

**Why refusing rather than warning.** A writing surface missing part of a record
is worse than no writing surface, because he cannot see what is not there — he
would type around the gap and save over it. An error takes ten seconds to read;
the silent gap took a round and a screenshot.

### A4 — the sweep

Every place a field was read by assuming one shape. **Fixed** where a reader
silently produced nothing; **reported** where it is covered by a gate.

| # | where | assumed | now |
|---|---|---|---|
| 1 | `draftEntries` `body` | must be a list | **FIXED** — either shape, else a named fault |
| 2 | `draftEntries` `sections` | must be a list | **FIXED** — a non-list is a named fault, not `[]` |
| 3 | `draftEntries` section element | must be an object | **FIXED** — named fault instead of a silent `.filter` |
| 4 | `draftEntries` entry element | must be an object | **FIXED** — named fault instead of a silent `.filter` |
| 5 | `draftEntries` `label` | `strOf` or nothing | **FIXED** — string, concat **or explicit `null`** (a real value: 002 and 003 both use it); anything else faults |
| 6 | entry keys the editor cannot carry | not checked at all | **FIXED** — `READ_ENTRY_FIELDS`. `wire`/`plates`/`docs`/`note` are all DRAWN by the museum and none was read here: an entry declaring one would render on the glass and be missing from the editor |
| 7 | section keys | not checked at all | **FIXED** — `READ_SECTION_FIELDS`. `doors` is the one to expect and would be lost on the first save |
| 8 | **`summaries()`** | pre-split walk only | **FIXED** — see below. The expensive one |
| 9 | `parseRecord` entry element | must be an object | **REPORTED, not re-fixed.** Same array, same condition, now refused by `reveal:check` through #4. A second copy of the guard would be a second thing to keep in step — which is what caused #8 |
| 10 | `read2` entry element | must be an object | **REPORTED**, same reason |
| 11 | `recordEpoch` | already dual-shape | OK — and see the false-alarm note below |
| 12 | `emit-record-entries.mjs` writer | assumes list bodies | **REPORTED, correct as-is.** It reads the DRAFT, and every draft body is a list by construction |

#### #8 — the budget gate had been checking nothing

`summaries()` carried its own copy of the pre-split walk (find the track whose
`id` is `"record"`, read `face.entries`). When the entries moved into
`robots-record.js` as a top-level array, three walks were repointed at
`entriesArrayOf` and this one was not. There is no track and no face in that
file, so it returned **an empty array**.

Downstream of that empty array is `recordBudgetFaults()` — the gate that refuses
a headline over 62 characters, a summary over 130, and an entry with no headline
at all. **It had been iterating nothing**, while `reveal:check` printed *"every
Record headline fits 62 characters and every summary 130"*.

Measured: **0 rows returned against 6 entries in the Record.** Now 6, and the
check prints the count — `all 6 Record headlines fit 62 characters…` — because a
pass on zero rows is otherwise indistinguishable from a pass on six.

It also **throws** now instead of returning `[]` when it cannot find the Record.
A reader that cannot find its subject must say so, not agree with everything.

#### A false alarm the proof caught, worth keeping

The first cut of the check reported five `date` fields as unreadable on an
**unbroken** Record. Cause: `draftEntries(src)` hands `src` to `recordEpoch`,
and since the split the epoch is not in the entries file — so `recordDay(n)`
could not resolve and "no epoch" was being filed as "unknown shape". Two
different failures wearing one label. They are two lists now (`unreadable` and
`epochless`), and a gate whose false positives look exactly like its true
positives is a gate nobody reads.

#### The shape check, proved on 12 synthetic Records

`4 legal shapes accepted, 8 illegal shapes refused, 0 wrong.` Every refusal
names the record, the section and the field.

### A5 — all six round-trip with no text lost

Driven in the page: every record opened, the model read, and every source string
looked for in what a **save** would write. Nothing was written to disk.

| record | in the source | in the editor | strings lost |
|---|---|---|---|
| 001 | 1,704 | 2,066 | **0** |
| 002 | 523 | 523 | **0** |
| 003 | 578 | 911 | **0** |
| 004 | 93 | 93 | **0** |
| 005 | 254 | 254 | **0** |
| 013 | **445 → 850** | 850 | **0** |
| total | **3,597 → 4,002** | | **0** |

001 and 003 carry more than the source because the generator re-inserts his
eight notes in braces (362 and 333 characters). Those are excluded from the
comparison by their braces; every other string matches exactly.

---

## B. THE TITLE BAR — FIXED STRUCTURALLY, **BUT THE OVERLAP WAS NOT REPRODUCED**

### B1 — the three slots, before

One component (`MuseumBar.jsx`), one stylesheet, **two mechanisms**:

| | above 720px | 720px and below |
|---|---|---|
| brand | `flex: 0 0 auto`, nowrap | same |
| room | **`position: absolute; left: 50%`** | `flex: 1 1 auto`, `min-width: 0`, ellipsis |
| exit | `flex: 0 0 auto`, nowrap | same |

**Above 720px nothing reserved anything.** The centre was out of flow, so the
flanks were laid out as if it did not exist and it was drawn as if they did not.
An absolutely positioned element cannot push; it can only run underneath. That
is not a wide-name problem with a short-name workaround — it is a mechanism with
no collision term in it, and every room was one longer name away from the same
picture.

**Two mechanisms is also why it survived.** The phone half was measured to zero
overlap at the merge and the desktop half was never re-measured, so the bar had
a fixed half and a broken half and read as fixed.

### B2 — one mechanism, the robots band's

`.wb-bar` is a grid at every width:

```css
grid-template-columns: minmax(min-content, 1fr) auto minmax(min-content, 1fr);
```

Same idiom as `.ex-album-banner`, whose own note states the rule it rests on: a
track's `1fr` is `minmax(auto, 1fr)`, and `auto` refuses to go below its item's
min-content width. The band had to name a length (`--ex-flank: 132px`) because
its side tracks are **empty**; these two hold the wordmark and the exit, so the
reservation is those items' own width and needs no number to maintain.
`min-content` is written explicitly so that a future `min-width: 0` on a
flank — exactly what broke the band's first draft — cannot quietly re-open it.

The 720px branch keeps only what is about SIZE (padding, tracking, type step).
The geometry is unconditional.

### B3 — the longest room name

**"Information Booth" (17 characters), /booth.** After the fix:

| viewport | clear space left of the name | right | ellipsised |
|---|---|---|---|
| 390 | 10.0px | 33.6px | no |
| 768 | 122.1px | 150.6px | no |
| 1280 | 378.1px | 406.6px | no |

### B4 — every page that carries the bar

`<MuseumBar>` is drawn by `Exhibit.jsx` (/robots, /wb, /wal, /foundation, and
/hr behind its lock), `InfoBooth.jsx` (/booth) and `GiftShop.jsx` (/shop). The
Lobby has no bar. **Six measurable routes × three widths = 18 measurements after
the fix: zero overlap, zero ellipsis.** /hr renders the Lobby without a key and
has no bar to measure — stated rather than skipped.

| route | room | 390 | 768 | 1280 |
|---|---|---|---|---|
| /foundation | The Foundation | 22.1 / 54.0 | 148.2 / 176.7 | 404.2 / 432.7 |
| /booth | Information Booth | 10.0 / 33.6 | 122.1 / 150.6 | 378.1 / 406.6 |
| /wal | Worth A Listen | 25.2 / 30.3 | 152.7 / 149.4 | 408.7 / 405.4 |
| /robots | Robots | 61.1 / 66.3 | 211.3 / 208.0 | 467.3 / 464.0 |
| /wb | Weird.Baby | 43.3 / 48.4 | 182.3 / 179.0 | 438.3 / 435.0 |
| /shop | Gift Shop | 59.1 / 91.0 | 206.6 / 235.1 | — |

### **B — WHAT I COULD NOT DO, STATED PLAINLY**

**I did not reproduce the overlap in Mike's capture.**

The old rules were injected back into the live page and measured beside the new
ones on /foundation, /booth and /wal at 768, 1024 and 1280: **the gaps are
identical to the digit.** That is expected — with equal `1fr` flanks the grid
centres the name on the bar in exactly the place absolute centring did. The two
mechanisms differ only when there is NOT enough room, and with the museum's
current six room names there is never not enough room above 720px. Below 720 the
old code already used the flex row that was measured to zero overlap at the
merge.

So the change is right and the reason for it is structural — a bar that could
not detect a collision now cannot have one — but **it is not proof that it is
the thing Mike photographed.**

Two candidates I could reach and cleared: the bar's own three slots (measured
above), and `.ex-album-banner-title`, which on /foundation carries **the same
string, "The Foundation"**, sits at `z-index: 95` against the bar's 90, and is
`position: sticky; top: 0` — i.e. it is built to travel up onto the bar. I could
not drive it into that position in the iframe rig (the exhibit's scroller does
not respond to a synthetic scroll), so **it is not cleared, it is untested.**

What would settle it: the capture, or the window width it was taken at.

---

## C. WHAT WAS SEEN

- **Record 013, served, opened by clicking its chip**: four headings and four
  paragraphs, the lead, the tombstone. No banner. 12 editable fields.
- **/foundation's bar at a true 390px** (same-origin iframe, `npm run lap`):
  `Weird.Baby  ·  THE FOUNDATION  ·  LOBBY`, clean space either side, nothing
  clipped.
- **/foundation at desktop**: the bar clean, and a second "THE FOUNDATION"
  lower down that is the face heading, not the bar.
- `npm run lap:clean` run; `public/_lap.html` removed.

---

## GATES

| gate | result |
|---|---|
| `npm run lint` | **11 errors / 9 warnings — baseline** |
| `npm run build` | green |
| `npm run build:launch` | green |
| `npm run provenance:gate` | **PASS** |
| `npm run reveal:build` | green |
| `npm run reveal:check` | **PASS** — 11 checks, one of them new |
| `npm run assets:orphans` | **0 — 0 judged, 0 unjudged** |
| `npm run parity:gate` | **PASS** |
| `npm run instory:gate` | **PASS** |
| `npm run reveal:day` | nothing to move |

## FILES

```
reveal/record-entries.mjs             paragraphsOf / labelOf, the fault list,
                                      READ_ENTRY_FIELDS, summaries() repointed
tools/reveal-ledger.mjs               recordShapeFaults wired into check()
tools/dictation/record-edit.mjs       refuses rather than warns; prints shapes
src/components/MuseumBar.css          one grid, flanks reserved at every width
docs/dictation-20260807/record.html   regenerated
```

`record-draft.json` untouched. Every editor test ran against
`http://127.0.0.1:8899`, a different storage origin from Mike's `file://` page;
that store was cleared afterwards.
