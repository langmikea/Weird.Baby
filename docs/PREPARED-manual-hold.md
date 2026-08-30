<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# PREPARED — hold the six manual scans behind the stage door past 2026-09-09

> **NOT APPLIED. NOTHING IN THIS FILE HAS BEEN WRITTEN TO THE TREE.**
> The museum behaves identically before and after the packet that wrote it: the
> six still publish on 2026-09-09 at 17:00 America/New_York. This is the change
> spelled out so a person can land it in one commit, not the change.

**Written:** 2026-08-29. **Author:** Ops. **Landing:** Mike's call.
**Why it exists:** [`M61`](OPEN_ACTIONS.md#m61) is RULED — HELD, and the six are
scheduled to go public on 2026-09-09 regardless. See
[`FINDING-manual-hold-path.md`](FINDING-manual-hold-path.md) for how the hold
works; this file is only what it would take to use it.

---

## 0 · THE SHAPE

**THREE FILES MOVE AND THEY MOVE TOGETHER.** Two are the change; the third is a
published number that goes stale the moment the second one lands.

| # | file | what happens |
|---|---|---|
| 1 | `src/data/artists/robots-record.js` | Record entry `no: 3` stops naming the six paths |
| 2 | `public/robots/manual/*.webp` → `public/held/robots/manual/` | six files move behind the stage door |
| 3 | `docs/canonical/OPERATIONS.md:164` | §0 DEPLOY's held-cost numbers, `137 → 143` files and `186,888,028 → 187,442,454` bytes |

**Nothing else in the tree changes.** §7 names what this does not touch.

**The mechanism is the STAGE DOOR, not the schedule.** The schedule is keyed on
the entry's DAY and using it would mean moving `RECORD_EPOCH`, which is one
constant with five entries and the wing hanging off it. The stage door is keyed
on the file's LOCATION and is local to these six.
`src/worker.js:78` · `src/worker.js:625-630`.

---

## 1 · EDIT 1 — THE RECORD ENTRY

**File:** `src/data/artists/robots-record.js`
**Span:** lines 544-577, the `docs:` block of entry `no: 3`.

### 1.1 · BEFORE — exact, 34 lines

```js
              docs: [
                { title: "Scan 07 - Power supply and distribution",
                  source: "ABEAL 8P-OMI-1",
                  pages: 2,
                  plates: [
                    { img: "/robots/manual/scan-07-a.webp",
                      label: "Power supply and distribution, first page" },
                    { img: "/robots/manual/scan-07-b.webp",
                      label: "Power supply and distribution, second page" },
                  ] },
                { title: "Scan 11 - The video link",
                  source: "ABEAL 8P-OMI-1",
                  pages: 2,
                  plates: [
                    { img: "/robots/manual/scan-11-a.webp",
                      label: "The video link, first page" },
                    { img: "/robots/manual/scan-11-b.webp",
                      label: "The video link, second page" },
                  ] },
                { title: "Scan 31 - Bias settings",
                  source: "ABEAL 8P-OMI-1",
                  pages: 1,
                  plates: [
                    { img: "/robots/manual/scan-31-a.webp",
                      label: "Bias settings, the four communications settings" },
                  ] },
                { title: "Marked copy 01 - Bias settings",
                  source: "ABEAL 8P-OMI-1",
                  pages: 1,
                  plates: [
                    { img: "/robots/manual/marked-01-a.webp",
                      label: "Bias settings, returned marked" },
                  ] },
              ],
```

### 1.2 · AFTER — exact, 14 lines

```js
              docs: [
                { title: "Scan 07 - Power supply and distribution",
                  source: "ABEAL 8P-OMI-1",
                  pages: 2 },
                { title: "Scan 11 - The video link",
                  source: "ABEAL 8P-OMI-1",
                  pages: 2 },
                { title: "Scan 31 - Bias settings",
                  source: "ABEAL 8P-OMI-1",
                  pages: 1 },
                { title: "Marked copy 01 - Bias settings",
                  source: "ABEAL 8P-OMI-1",
                  pages: 1 },
              ],
```

**The four `plates` arrays go. Nothing else in the entry is touched** — not the
headline, not the dateline, not `date: recordDay(3)`, not the EXECUTIVE SUMMARY,
the DETAILED REPORT or ADDENDUM 02.

### 1.3 · Why the attachments stay and only their images go

**The entry's own published prose names three of them.** `robots-record.js:526-532`
carries, inside the DETAILED REPORT:

> `Manual Pages Recovered / SCAN 07 - POWER SYSTEM / SCAN 11 - VID-LINK / SCAN 31 - PARITY BIAS`

**Deleting the `docs` block would leave the entry naming three scans it does not
declare.** That is published text and it is not this change's to edit.

**Provenance-without-image is the museum's own declared shape for a held
document**, not an invention here — `src/lib/record-model.js:68-72`:

> *"EMPTY IS A STATE, NOT AN ABSENCE. A document that is held but not yet
> photographed declares its provenance and no `scan`, and the surface says so —
> the same discipline as B8's reel, which ships empty and prints 'reel empty'
> rather than rendering nothing and hoping."*

### 1.4 · What the glass does after this edit — derived, not guessed

| step | result | where |
|---|---|---|
| `docState(doc)` with no `plates`, no `scan`, no `extract` | `"held"` | `src/lib/record-model.js:327-333` |
| `DocList` renders title, state and provenance, and **no button** | not clickable | `src/routes/exhibit/Exhibit.jsx:2045-2048, 2072-2078` |
| the Listing row appends `not here yet` beside the provenance | `ABEAL 8P-OMI-1 · 2 pages · not here yet` | `src/lib/record-model.js:254-261` |

`Exhibit.jsx:2045-2048` states the rule this relies on:

> *"WHAT IT REFUSES TO DO: a document with no page images is NOT a button. It
> prints its provenance and its state and stops, because a control that opens
> nothing is the dead control Doctrine 11's corollary removes."*

### 1.5 · Why removing the strings is what empties `assets`

`assets` is not a field. It is **every string literal anywhere under the entry
object** that matches `ASSET_LIKE` — `/^\/[\w\-./]+\.\w{2,5}$/` at
`reveal/record-entries.mjs:67`, scanned at `reveal/record-entries.mjs:362-367`.

The six `img` strings are the only strings under entry `no: 3` that match.
Removing them makes entry 3's `assets` the empty array, which empties its row in
`__WB_RECORD_ASSETS__` and in `reveal/ledger.json`'s `record.003`.

---

## 2 · EDIT 2 — THE FILES

Six moves, tracked, bytes unchanged:

```bash
git mv public/robots/manual/scan-07-a.webp   public/held/robots/manual/scan-07-a.webp
git mv public/robots/manual/scan-07-b.webp   public/held/robots/manual/scan-07-b.webp
git mv public/robots/manual/scan-11-a.webp   public/held/robots/manual/scan-11-a.webp
git mv public/robots/manual/scan-11-b.webp   public/held/robots/manual/scan-11-b.webp
git mv public/robots/manual/scan-31-a.webp   public/held/robots/manual/scan-31-a.webp
git mv public/robots/manual/marked-01-a.webp public/held/robots/manual/marked-01-a.webp
```

**`public/held/robots/manual/` ALREADY EXISTS and is not empty.** Measured today,
RUN: **64 files, 120,346,035 bytes** — the museum's own copy of the structure
issue, `page-01.png` … `page-61.png`, plus a `tuning/` directory of three. It
agrees with `docs/opsday-20260822/DEPLOY_GROUND_TRUTH.md:300` exactly. The six
webps land beside them; the names do not collide and nothing there is touched.

*(It was emptied on 2026-08-07 — `docs/MUSEUM_DICTATION_PREP_LOG-20260807.md:28` —
and refilled since. **Note in passing, not this change's to fix:** that copy is
**61** pages where the source renders **63**, which is the same two-page gap F4
files at `docs/canon/07-MANUAL.md` §1, and it is the stale directory
`tools/numbers-gate.mjs:157-165` was repointed away from on 2026-08-25.)*

| file | bytes | sha256 (unchanged by the move) |
|---|---:|---|
| `scan-07-a.webp` | 109,982 | `1e5ccec1e0df13bc59d99c61a3e992dbce2f787db0d6baf17984c6c133cf758e` |
| `scan-07-b.webp` | 58,310 | `fc5fff37af3470df807588e83c4c152d48efe55928070ea3b6c9214e29457506` |
| `scan-11-a.webp` | 66,824 | `298b8db4461e3b8750129cc44cb3b1173c2e5a4d6ea6cad4050af574ef4f18e9` |
| `scan-11-b.webp` | 109,982 | `1e5ccec1e0df13bc59d99c61a3e992dbce2f787db0d6baf17984c6c133cf758e` |
| `scan-31-a.webp` | 98,104 | `b5572b9b61de7ef3cfb3c6efc02d00fee7f25413f894f9f628b920fc21ef840f` |
| `marked-01-a.webp` | 111,224 | `d512acd04294794114cc0a6ce6217526c114be5129c3c8ee3116f7f10f448767` |
| **total** | **554,426** | |

**`scan-07-a` and `scan-11-b` are byte-identical and both move** — see
[`FINDING-manual-scans.md`](FINDING-manual-scans.md) §5. The duplication is not
resolved by this change and must not be resolved by it in passing.

---

## 3 · EDIT 3 — THE PUBLISHED HELD COST

**File:** `docs/canonical/OPERATIONS.md`, line 164, in §0 DEPLOY.

**BEFORE:**

```
- **137 files (186,888,028 bytes)** become publicly readable.
```

**AFTER:**

```
- **143 files (187,442,454 bytes)** become publicly readable.
```

**This is not bookkeeping — it is a gate.** `tools/numbers-gate.mjs:294-298`
carries the `held-cost` claim, anchored on the phrase *"publicly readable"*, and
`measure.heldCost()` at `:200` is a recursive walk of `public/held` with no
filter by extension. Measured today, RUN:

```
find public/held -type f | wc -l                        → 137
find public/held -type f -printf "%s\n" | awk sum       → 186888028
```

Both agree with line 164 exactly, which is why `docs:numbers` is green today.
**Six files land behind the door and both numbers move: `137 + 6 = 143`,
`186,888,028 + 554,426 = 187,442,454`.** Leave line 164 alone and
`npm run docs:numbers` goes red on a claim that was true this morning.

The gate's own note at `tools/numbers-gate.mjs:290-292` says why both halves are
checked: *"a file count that agrees while the byte total does not is a door
nobody has re-measured."*

---

## 4 · ONE ATOMIC LANDING — WHAT FIRES IF A HALF LANDS ALONE

`deliveryFaults()` — `reveal/delivery.mjs:189-294` — is run by
`reveal/schema.mjs:283` (`npm run reveal:check`) and `reveal/day.mjs:261`
(`npm run reveal:day`). **It fires in both directions.** Edits 1 and 2 are one
landing because either alone is six faults.

### 4.1 · If EDIT 2 lands without EDIT 1 — files moved, entry still names them

`reveal/delivery.mjs:226-232`, resolved with real values:

```
delivery: `manual/scan-07-a.webp` IS delivered — a Record entry names it — and it is still behind the door. The rule runs both ways: an entry brings a thing into the story and the thing is then PLACED according to that entry. Move it to `public/robots/manual/scan-07-a.webp`.
delivery: `manual/scan-07-b.webp` IS delivered — a Record entry names it — and it is still behind the door. The rule runs both ways: an entry brings a thing into the story and the thing is then PLACED according to that entry. Move it to `public/robots/manual/scan-07-b.webp`.
delivery: `manual/scan-11-a.webp` IS delivered — a Record entry names it — and it is still behind the door. The rule runs both ways: an entry brings a thing into the story and the thing is then PLACED according to that entry. Move it to `public/robots/manual/scan-11-a.webp`.
delivery: `manual/scan-11-b.webp` IS delivered — a Record entry names it — and it is still behind the door. The rule runs both ways: an entry brings a thing into the story and the thing is then PLACED according to that entry. Move it to `public/robots/manual/scan-11-b.webp`.
delivery: `manual/scan-31-a.webp` IS delivered — a Record entry names it — and it is still behind the door. The rule runs both ways: an entry brings a thing into the story and the thing is then PLACED according to that entry. Move it to `public/robots/manual/scan-31-a.webp`.
delivery: `manual/marked-01-a.webp` IS delivered — a Record entry names it — and it is still behind the door. The rule runs both ways: an entry brings a thing into the story and the thing is then PLACED according to that entry. Move it to `public/robots/manual/marked-01-a.webp`.
```

### 4.2 · If EDIT 1 lands without EDIT 2 — entry emptied, files still public

`reveal/delivery.mjs:214-225`, resolved with real values:

```
delivery: `/robots/manual/scan-07-a.webp` is a picture of the objects at a PUBLIC address and no Record entry delivers it. Nothing publishes until the Record delivers it — move the file to `public/held/robots/manual/scan-07-a.webp`, or, if it is the museum's own lettering rather than a picture of the machines, add it to `SIGNAGE` in reveal/delivery.mjs with a reason.
delivery: `/robots/manual/scan-07-b.webp` is a picture of the objects at a PUBLIC address and no Record entry delivers it. Nothing publishes until the Record delivers it — move the file to `public/held/robots/manual/scan-07-b.webp`, or, if it is the museum's own lettering rather than a picture of the machines, add it to `SIGNAGE` in reveal/delivery.mjs with a reason.
delivery: `/robots/manual/scan-11-a.webp` is a picture of the objects at a PUBLIC address and no Record entry delivers it. Nothing publishes until the Record delivers it — move the file to `public/held/robots/manual/scan-11-a.webp`, or, if it is the museum's own lettering rather than a picture of the machines, add it to `SIGNAGE` in reveal/delivery.mjs with a reason.
delivery: `/robots/manual/scan-11-b.webp` is a picture of the objects at a PUBLIC address and no Record entry delivers it. Nothing publishes until the Record delivers it — move the file to `public/held/robots/manual/scan-11-b.webp`, or, if it is the museum's own lettering rather than a picture of the machines, add it to `SIGNAGE` in reveal/delivery.mjs with a reason.
delivery: `/robots/manual/scan-31-a.webp` is a picture of the objects at a PUBLIC address and no Record entry delivers it. Nothing publishes until the Record delivers it — move the file to `public/held/robots/manual/scan-31-a.webp`, or, if it is the museum's own lettering rather than a picture of the machines, add it to `SIGNAGE` in reveal/delivery.mjs with a reason.
delivery: `/robots/manual/marked-01-a.webp` is a picture of the objects at a PUBLIC address and no Record entry delivers it. Nothing publishes until the Record delivers it — move the file to `public/held/robots/manual/marked-01-a.webp`, or, if it is the museum's own lettering rather than a picture of the machines, add it to `SIGNAGE` in reveal/delivery.mjs with a reason.
```

**Do not take the `SIGNAGE` branch that second message offers.** Signage is the
museum's own lettering and these are photographs of a document —
`reveal/delivery.mjs:104-107` refuses that filing by name.

### 4.3 · The shortcut that is not one

**Rewriting the entry's `img` values to `/held/robots/manual/…` and leaving the
files where they are does NOT hold anything.** `/held/robots/manual/scan-07-a.webp`
still matches `ASSET_LIKE`, so it is still an asset;
`publicPlacements()` — `reveal/delivery.mjs:178-187` — normalises it straight
back to `/robots/manual/scan-07-a.webp`; and `isDelivered` at
`reveal/delivery.mjs:203` tests **both** forms. The file would be delivered, at a
public address, and the schedule would key on a string the worker never tests
(`url.pathname` is `/robots/…`). **The refusal would never fire.** The prefix in
the Record says where a file is parked, not whether it is held.

---

## 5 · THE DERIVED REGISTERS

These are regenerated, not authored. They are listed because a landing that
skips them leaves the tree inconsistent, not because they are separate calls.

| file | what changes | regenerated by |
|---|---|---|
| `provenance/asset-table.json` | six rows' `id`, `path`, `ref`; `usedBy` empties | `npm run assets:scan` |
| `provenance/assets.json` | six rows' `ref` gains the `/held` prefix | `provenance/assets-declare.mjs` |
| `reveal/ledger.json` | `record.003.assets` becomes `[]` | `npm run reveal:build` |

**The uids survive.** `reveal/ledger.json` `_assets` — *"The uid survives a
rename; the path does not"* — with content-carry taking a candidate only when its
own file is absent from disk. A `git mv` with unchanged bytes is exactly that
case, and the six sha256s in §2 are what it matches on.

---

## 6 · THE SEQUENCE, IN ORDER

### 6.0 · The two gates that are ALREADY RED, measured 2026-08-29 before any of this

**Read these first or the run below will look like it broke them.**

| gate | exit today | why, and it is not this change |
|---|---:|---|
| `npm run assets:gate` | **1** | the Mike-approval gate: *"presented assets in scope 49 · passed by Mike 0 · NOT INSPECTED 49"*. It is a signature gate, not a correctness one. |
| `npm run day:proof` | **1** | *"6 of 49 CHECK(S) FAILED"* — P1.3 (all five entries refuse an edit), P2's 14:00/16:00 stale-page pair. See §6.1. |

Every other gate named below exits **0** today.

### 6.1 · FIRST, AND IT IS MIKE'S HANDS — the day-editor save

**`docs/dictation-20260807/record-draft.json` is stale by one epoch move and
`record:land` would land negative days.** Measured today, RUN:

```
npm run record:land          → exit 0, and it emits:
    date: recordDay(-6)   date: recordDay(-5)   date: recordDay(-4)
    date: recordDay(-3)   date: recordDay(-2)
```

The draft header, READ:

```
saved: 2026-08-26T13:17:10.927Z
epoch: 2026-08-31
entries: 001 → 2026-08-31 … 005 → 2026-09-04
```

The tree's epoch is **2026-09-07** (Ruling D, 2026-08-28). The draft is seven days
behind, which is precisely the standing hazard at
`docs/canonical/OPERATIONS.md` §8: *"MOVING THE EPOCH DOES NOT MAKE THE SAVED
DRAFT STALE, AND `record:land` WOULD LAND IT AS NEGATIVE DAYS … AFTER MOVING THE
EPOCH, OPEN THE DAY EDITOR AND SAVE."*

**So the order is: land edits 1-3 by hand in the tree, then Mike opens the day
editor and saves.** The editor's page is built FROM the tree, so his save carries
both corrections into the draft at once — the current epoch's dates, and the four
attachments without their plates.

```bash
npm run day          # rebuilds the editor page from the tree
npm run day:serve    # serves it on 127.0.0.1:8899
```

**Then Mike opens it and presses Save. Ops does not press it** — §0, MIKE IS THE
LOCK, and `day.mjs:2425` says the save is what writes his words.
**Nothing below should be run until he has.**

> **[2026-08-29 · THE PRECONDITION IS MET, AND THE ORDER WAS ABOUT TO BE
> WRONG.]** This section was written when the emitter could not write an
> attachment's `door`, and it presented the save as the thing that unblocks
> `record:land`. **It was the other way round.** A save taken before the emitter
> carried `door` would have regenerated the draft with Record 005's attachment
> whole — and `emitFaults()` would then have refused it, on the dry run as well
> as on `--write`. The guard would have held and **his one shot would have been
> spent on a save that could not land.**
>
> **OPS RULED IT A MECHANISM CALL AND LANDED IT THIS COMMIT.** The Portal's
> console door already exists, already works and was already ruled on
> 2026-08-26; carrying an existing behaviour through a round trip is not a
> question for Mike. `door` is in `EMITTED_DOC_FIELDS` and `generate()` writes
> it — `tools/dictation/emit-record-entries.mjs`. Proved: `collect(modelOf(e))`
> deep-equals `e` **5/5 with the door included**, `--verify` still prints
> **ALL 51 STRINGS ROUND-TRIP** at exit 0, and `emitFaults()` over the tree
> raises **none**.
>
> **SO THE ORDER IS EMITTER FIRST, SAVE SECOND, AND THE EMITTER HALF IS DONE.**
> The save is still worth taking for the reason it was always worth taking: the
> draft on disk would delete the Portal's door if guard 8 ever slipped.
> **What the save still does NOT do is turn `day:proof` green** — see
> [`FINDING-day-editor-save.md`](FINDING-day-editor-save.md) §5.4 for what stays
> red, and §8 there for the correction this note supersedes.
>
> **ONE THING FOR HIS INSTRUCTIONS RATHER THAN FOR A FIX:** in Record 003's
> `ADDENDUM 02` box he may edit words freely, but **he must not insert, delete
> or reorder a paragraph** — that block is the one in the Record with mixed
> indents (4 and 2), and `blockOut` re-indents by position.

### 6.2 · The gate sequence

Run in this order. Every step must exit as stated.

| # | command | expect | what it proves |
|---:|---|---:|---|
| 1 | `npm run reveal:build` | **0** | `record.003.assets` regenerates to `[]` |
| 2 | `npm run assets:scan` | **0** | the six rows re-path; uids carry on content |
| 3 | `npm run reveal:check` | **0** | must still print *"nothing publishes until the Record delivers it"* and *"every HELD row is unreachable"* |
| 4 | `npm run reveal:day` | **0** | must print **to place 0 · to pull back 0**, with **public 9** and **behind the door 143** |
| 5 | `npm run docs:numbers` | **0** | proves EDIT 3 landed — this is the step that catches a forgotten line 164. Takes over two minutes; it shells out to eslint (§8 hazard). |
| 6 | `npm run day:proof` | **1**, and **no more than 6 failed checks** | it was 1 before; the number must not grow |
| 7 | `npm run ops:size` | **0** | `OPERATIONS.md` stays under 40,000 |
| 8 | `npm run shellstop:gate` | **0** | 0 unguarded |
| 9 | `npm run lint` | 9 errors / 7 warnings | unchanged — this change adds no code |

**Only after 1-9:** commit all three files plus the two regenerated registers and
the ledger as ONE commit. Then `npm run deploy:launch`, which is Mike's, and
`npm run door:check` after it.

### 6.3 · What the wire answers afterwards

| address | before this change | after it |
|---|---|---|
| `/robots/manual/scan-07-a.webp` | 404 until 2026-09-09, then 200 image/webp | **200 `text/html`** — the SPA fallback. No picture is served. |
| `/held/robots/manual/scan-07-a.webp` | (no such path) | **404**, refused by `STAGE_DIRS` at launch stage, `src/worker.js:625-630` |

**THE OLD ADDRESS ANSWERS 200, NOT 404, AND THAT IS NOT A FAILURE.** It is the
standing hazard at `docs/canonical/OPERATIONS.md` §8 — *"ON THIS SITE A MISSING
IMAGE IS A 200, AND ONLY THE DECODE TELLS THE TRUTH (2026-08-22)"*. Anybody
probing the old URL after landing and reporting it *"still live"* has measured
the fallback, not the picture. **`door:check` is the instrument for this, and it
will now sample the six** — they are under `/held/`, which is a prefix it reads.

---

## 7 · WHAT THIS DOES NOT TOUCH

| | untouched | proof |
|---|---|---|
| **The seventh picture** | `/robots/portal/qc-101-a.webp` still publishes **2026-09-10** | it is named by Record entry `no: 4`, a different entry, in `/robots/portal/`, not `/robots/manual/`. Edit 1 is inside entry 3's `docs` block only; edit 2 names six paths under `manual/`. Its row in `__WB_RECORD_ASSETS__` is untouched. |
| **The epoch** | `RECORD_EPOCH = "2026-09-07"` | `src/data/artists/record-epoch.js:116` is not in the file list. No entry's `date` is edited; entry 3 keeps `date: recordDay(3)`. All five Records still land 2026-09-07 … 2026-09-11. |
| **The wing** | opens on the same day | `src/lib/wing-open.js` derives from `RECORD_EPOCH`, and `__WB_RECORD_FIRST_DAY__` (`vite.config.js:623-624`) is the earliest entry's day — both unmoved. |
| **The countdown** | same target instant | `DOORS_OPEN_AT = recordVisibleAt(RECORD_EPOCH)` — `src/routes/WbHome.jsx:88`. Same constant, same moment. |
| **Record 003 itself** | still lands 2026-09-09, still reads the same | headline, dateline, EXECUTIVE SUMMARY, DETAILED REPORT and ADDENDUM 02 are all outside the `docs` block. The four attachments are still declared; only their images are gone. |
| **`scan-31-a`'s twin** | the duplicate stands | `scan-07-a` / `scan-11-b` are still byte-identical after the move. This change does not resolve that and must not. |
| **The epoch-move branch** | **deliberately not prepared** | it is one line and it is already written up at [`FINDING-manual-hold-path.md`](FINDING-manual-hold-path.md) §4.1. A second unapplied change competing with this one is how the wrong one gets landed. |

---

## 8 · ONE CORRECTION TO THE COMPANION REPORT

[`FINDING-manual-hold-path.md`](FINDING-manual-hold-path.md) §4.2 says
`npm run day:proof` **"would go red"** and that `record:land --write` **"would
accept the edit"**, citing `robots-record.js:380-381`.

**Measured while preparing this file: `day:proof` is ALREADY red — exit 1, 6 of
49 checks failed — and its P1.3 reports `0 of 5 existing days accept an edit from
this page today`.** The cause is not guard 6 and not comment blocks: it is the
stale draft in §6.1, seven days behind the epoch. The line in `robots-record.js`
is true about comment blocks and is not the whole story.

**What that changes for a lander:** the day-editor save in §6.1 is not tidiness
after the fact. **Nothing can land through `record:land` until Mike has saved**,
and `day:proof`'s expected exit is 1 both before and after, judged on the count
rather than the code.
