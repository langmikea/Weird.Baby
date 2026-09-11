<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# PREPARED — the five scan references come out of Record 003, and the marked copy stands

> **NOT APPLIED. NOTHING IN THIS FILE HAS BEEN WRITTEN TO THE TREE.**
> The museum behaves identically before and after the packet that wrote it. As
> the tree stands, all six manual files publish on 2026-09-09 at 17:00
> America/New_York. **This is the change spelled out so a person can land it in
> one commit. It is not the change.**

> **THIS SUPERSEDES [`docs/PREPARED-manual-hold.md`](PREPARED-manual-hold.md)
> AND IS NOT AN EDIT TO IT.** That file was written on 2026-08-29 to move all
> six behind the stage door as one set. It is left exactly as it stands — a
> superseded document rewritten in place is a document nobody can date. **It
> also supersedes the Ops ruling of earlier today that the Scan 31 attachment
> stays listed as held.** Both are wrong now, for the same reason: they hold
> something Mike has said to remove.

**Written:** 2026-08-31. **Author:** Ops. **Landing:** Mike's call.

**MIKE'S RULING, which this is scoped against:** the four blank pages were
early scaffolding — something to start releasing the manual with — and they
are not important to the story. **Kill the references.** Scan 07, Scan 11 and
Scan 31 come **out of Record 003 entirely: attachments and plates both.** Mike
will attach something that fits the story when he writes it.
**`marked-01-a.webp` survives untouched and publishes 2026-09-09 at 17:00.**
**Record 003's DETAILED REPORT text is NOT edited by this change.**

---

## 0 · THE SHAPE — A REMOVAL IS NOT A HOLD

**NOTHING LANDS BEHIND THE DOOR, SO THE PUBLISHED HELD COST DOES NOT MOVE.**
That is the largest single difference from the superseded file and it deletes
a whole edit from the landing. §8 lists the rest.

| # | file | what happens |
|---|---|---|
| 1 | `src/data/artists/robots-record.js` | Record entry `no: 3`'s `docs:` block goes from four attachments to **one** |
| 2 | five files under `public/robots/manual/` | **`git rm`** — deleted, not moved |
| 3 | `public/robots/manual/marked-01-a.webp` | **NOT TOUCHED** |

**There is no third edit.** `docs/canonical/OPERATIONS.md:164` is not in this
change — see §3.

**Nothing else in the tree is authored.** §4 names the registers that are
regenerated. §7 names what this does not touch.

---

## 0.1 · THE HAZARD THIS CHANGE INTRODUCES — READ IT BEFORE THE EDITS

**A REMOVAL LOSES A GUARD THAT THE HOLD HAD, AND IT LOSES IT IN ONE DIRECTION
ONLY.** This is at the top rather than in the sequence because it is a property
of the change itself, not a step in landing it.

`deliveryFaults()` — `reveal/delivery.mjs:189-235` — **iterates the files on
disk**, walking `PUBLIC_TREE` and `HELD_TREE`. It never iterates the delivered
set. That asymmetry did not matter while the change was a move, because a moved
file is still in one of the two trees. It matters now.

| a half landing alone | under the superseded HOLD | under this REMOVAL |
|---|---|---|
| entry emptied, files still at public addresses | faults, one per file | **five faults**, `reveal/delivery.mjs:214-225`. Loud and correct. |
| **files gone, entry intact** | faults, one per file | **NONE. `reveal:check` PASSES.** |

**In the second row the loop never reaches them, because they are in neither
tree.** `reveal:day` likewise reports nothing to move, for the same reason —
`plan()` walks the same two trees.

**A RECORD ENTRY NAMING FIVE FILES THAT EXIST AT NO ADDRESS IS CAUGHT BY
NOTHING IN THIS TREE.** What a visitor would meet is the SPA fallback,
`200 text/html` — the standing hazard at `docs/canonical/OPERATIONS.md` §8:
*"ON THIS SITE A MISSING IMAGE IS A 200, AND ONLY THE DECODE TELLS THE TRUTH."*

**So edits 1 and 2 are one landing, and the reason is weaker than it was.**
Under the hold the tooling enforced atomicity. Under the removal it does not.
**Land them together because a person is watching, not because a gate is.**

**No fix is proposed here.** The guard's blind spot is a property of
`deliveryFaults()` and not of this change, and closing it is a separate job
with its own scope.

---

## 1 · EDIT 1 — THE RECORD ENTRY

**File:** `src/data/artists/robots-record.js`
**Span:** lines 544-577, the `docs:` block of entry `no: 3`.

### 1.1 · AFTER — printed whole, exact

```js
              docs: [
                { title: "Marked copy 01 - Bias settings",
                  source: "ABEAL 8P-OMI-1",
                  pages: 1,
                  plates: [
                    { img: "/robots/manual/marked-01-a.webp",
                      label: "Bias settings, returned marked" },
                  ] },
              ],
```

**One attachment. Nothing else.** The three `Scan` attachment objects go whole
— `title`, `source`, `pages` and `plates` together. `marked-01`'s object is
unchanged in every character.

Nothing else in the entry is touched: not the headline, not the dateline, not
`date: recordDay(3)`, not the EXECUTIVE SUMMARY, **not the DETAILED REPORT**,
not ADDENDUM 02.

### 1.2 · The authored strings that leave the glass

Written down because a string that disappears without being recorded somewhere
is a string nobody can put back. **Eight visitor-readable strings and five
paths.**

```
{ title: "Scan 07 - Power supply and distribution", source: "ABEAL 8P-OMI-1", pages: 2 }
    "/robots/manual/scan-07-a.webp"   "Power supply and distribution, first page"
    "/robots/manual/scan-07-b.webp"   "Power supply and distribution, second page"

{ title: "Scan 11 - The video link", source: "ABEAL 8P-OMI-1", pages: 2 }
    "/robots/manual/scan-11-a.webp"   "The video link, first page"
    "/robots/manual/scan-11-b.webp"   "The video link, second page"

{ title: "Scan 31 - Bias settings", source: "ABEAL 8P-OMI-1", pages: 1 }
    "/robots/manual/scan-31-a.webp"   "Bias settings, the four communications settings"
```

### 1.3 · What the glass does after this edit

`docState`, `DocList` and the `not here yet` listing row are **not reached**,
because there is nothing left to be held. The entry renders one document, and
it is a button, and it opens.

**RECORD 003 BECOMES A ONE-ATTACHMENT ENTRY.** Whether that still reads as an
entry is a question for the writing and is not answered here — §9.

### 1.4 · Why removing the strings is what empties `assets`

`assets` is not a field. It is **every string literal anywhere under the entry
object** that matches `ASSET_LIKE` — `/^\/[\w\-./]+\.\w{2,5}$/` at
`reveal/record-entries.mjs:67`, scanned at `reveal/record-entries.mjs:362-367`.

The six `img` strings were the only strings under entry `no: 3` that matched.
**Removing five leaves one**, so entry 3's `assets` becomes a one-element
array — which is what `__WB_RECORD_ASSETS__` and `reveal/ledger.json`'s
`record.003` carry afterward.

---

## 2 · EDIT 2 — THE FILES

### 2a · The five, `git rm`, named individually

```bash
git rm public/robots/manual/scan-07-a.webp
git rm public/robots/manual/scan-07-b.webp
git rm public/robots/manual/scan-11-a.webp
git rm public/robots/manual/scan-11-b.webp
git rm public/robots/manual/scan-31-a.webp
```

**No wildcard.** A glob over `public/robots/manual/*.webp` takes
`marked-01-a.webp` with it, and that is the one file in this directory that
must survive. The five are written out so a `*` can never be substituted.

| file | bytes | sha256 |
|---|---:|---|
| `scan-07-a.webp` | 109,982 | `1e5ccec1e0df13bc59d99c61a3e992dbce2f787db0d6baf17984c6c133cf758e` |
| `scan-07-b.webp` | 58,310 | `fc5fff37af3470df807588e83c4c152d48efe55928070ea3b6c9214e29457506` |
| `scan-11-a.webp` | 66,824 | `298b8db4461e3b8750129cc44cb3b1173c2e5a4d6ea6cad4050af574ef4f18e9` |
| `scan-11-b.webp` | 109,982 | `1e5ccec1e0df13bc59d99c61a3e992dbce2f787db0d6baf17984c6c133cf758e` |
| `scan-31-a.webp` | 98,104 | `b5572b9b61de7ef3cfb3c6efc02d00fee7f25413f894f9f628b920fc21ef840f` |
| **total removed** | **443,202** | |

Hashes re-verified 2026-08-31, RUN. **`scan-07-a` and `scan-11-b` are
byte-identical** — the same sheet, manual page `7-4`, filmed into both sets and
carrying both delivered names. Both go.

### 2a.1 · THE FILES ARE DELETED, NOT LEFT UNREFERENCED — RULED

**OPS RULING, 2026-08-31.** Mike's instruction was *kill the references*, and
whether that reached the FILES as well as the references was raised as an open
reading. **It is settled: the five files are deleted.**

**The reason is what a permanently red gate does to a house.** A picture at a
public address that no Record entry delivers is exactly what
`reveal/delivery.mjs:214-225` faults on, so leaving the files on disk while
removing their references would put **five permanent faults into
`reveal:check`** — faults nobody intends to clear, on a gate that is supposed
to mean something. **A gate that is permanently red is a gate everyone learns
to look past**, and this repository has already paid for that shape twice, at
`A-d` (`make_house_covers.py --verify`, red for seventeen days in no gate) and
at `Q-b` (`facts:gate`, built and deliberately unwired because it cannot pass).
Trading a clean removal for a standing red is the worse of the two.

**Nothing is lost by deleting them.** `git rm` removes a file from the working
tree and the index, not from the repository. **All five stay in history and any
one of them is a single checkout away** — `git show <ref>:public/robots/manual/scan-07-a.webp`,
or `git checkout <ref> -- <path>` to bring it back. The bytes are not going
anywhere; only the museum's claim to be showing them is.

### 2b · `marked-01-a.webp` — NOT TOUCHED

**`public/robots/manual/marked-01-a.webp` stays exactly where it is, at its
public address, and publishes on 2026-09-09 at 17:00 America/New_York.**

**111,224 bytes**, sha256
`d512acd04294794114cc0a6ce6217526c114be5129c3c8ee3116f7f10f448767`.

This line exists so that no later reader infers its fate from the pattern of
the five above it. **It is not deleted, it is not moved, its plate stays in the
Record entry, and its schedule does not change.** After this change it is the
only thing in `public/robots/manual/` and the only attachment in Record 003.

---

## 3 · THERE IS NO HELD-COST EDIT

**`docs/canonical/OPERATIONS.md:164` is NOT in this change**, and the reason is
worth stating rather than leaving as an absence.

The line reads:

```
- **137 files (186,888,028 bytes)** become publicly readable.
```

It is checked by the **`held-cost`** claim at `tools/numbers-gate.mjs:294-298`
— regex anchored by `near: /publicly readable/i` — measured against
`measure.heldCost()` at `:200`, a recursive walk of `public/held` with no
filter by extension.

**A removal adds nothing to `public/held`.** The five are deleted; they do not
arrive behind the door. Measured 2026-08-31, RUN: `find public/held -type f |
wc -l → 137` and the byte total `186,888,028`, both agreeing with line 164
exactly. **They still agree after this change. Leave the line alone.**

Editing it would turn `docs:numbers` red on a claim that was true before and
after.

---

## 4 · THE DERIVED REGISTERS

Regenerated, not authored. Listed because a landing that skips them leaves the
tree inconsistent.

| file | what changes | regenerated by |
|---|---|---|
| `provenance/asset-table.json` | the five rows gain `missing: true` and are **KEPT**; `marked-01-a` untouched | `npm run assets:scan` |
| `provenance/assets.json` | **UNDECIDED — see below** | `node provenance/assets-declare.mjs --write` |
| `reveal/ledger.json` | `record.003.assets` drops to **one** element; `doc.manual.page.47` drops from two assets to one; `doc.manual.page.32/33/34` — see §5 | `npm run reveal:build` |

**THE FIVE ASSET-TABLE ROWS ARE KEPT, NOT DELETED.** `tools/asset-table.mjs:583-586`
pushes `{ ...e, missing: true }` for any prior row whose file is gone, and
`:24-28` gives the rule in the file's own words:

> *"A file that disappears from disk is kept with `missing: true` rather than
> deleted, because a verdict Mike gave is a record and not a cache."*

Nothing needs doing to achieve that and nothing should be done to prevent it.
The five keep their `id`, `path`, `ref` and their five judged fields.
**Measured 2026-08-31: 13 rows in the table already carry `missing: true`, 9 of
them still carrying a `ref`** — so this is the table behaving normally, not a
new state.

`assets:gate` filters `!x.missing` (`tools/asset-table.mjs:690`, `:715`), so the
five drop out of the approval gate rather than failing it.

> **FLAGGED, NOT RESOLVED: what `provenance/assets.json`'s five rows become is
> UNDECIDED.** That register is regenerated whole from an array inside
> `provenance/assets-declare.mjs`, guarded in the M99 shape, and **nothing
> anywhere in either repository says what a killed file's provenance row should
> be.** The asset table has a written answer; this register does not. Landing
> without a decision leaves five rows describing files that exist at no
> address. This is a decision, not a mechanism, and it is not made here.

---

## 5 · `doc.manual.page.32 / 33 / 34` — THEY SURVIVE, AND THAT IS THE PROBLEM

**These three rows' only assets were the killed files.** What happens to them
is the question a hold never had to ask, and the answer is not the obvious one.

**THEY DO NOT DISAPPEAR. THEY DO NOT TRIP THE M99 GUARD. THEY SURVIVE INTACT,
STILL CARRYING THEIR ASSETS, AND THEY BECOME FALSE.**

The chain, traced rather than assumed:

1. The declaration is unchanged. `reveal/ledger-declare.mjs:632-638` still
   calls `MANUAL_PAGE(32, …)`, `(33, …)`, `(34, …)` with their asset paths.
   **This change does not edit `ledger-declare.mjs`.**
2. `resolve()` at `reveal/ledger-declare.mjs:104-110` maps a public ref to a
   uid **through the asset table, not through disk** —
   `byRef = new Map(table.entries.filter(e => e.ref)…)` at `:99`, **with no
   `missing` filter**.
3. §4 establishes that the five asset-table rows are KEPT with their `ref`
   intact. **So every ref still resolves and no uid is lost.**
4. `manualPageRow()` at `reveal/schema.mjs:140-157` refuses a page only if the
   **robots-side source render** is missing — `pages/page-NN.png`. Those masters
   are untouched by this change and all three exist.
5. `calledBy: ["record.003"]` still validates, because `record.003` still
   exists.

**So `npm run reveal:build` succeeds, `unresolved` stays empty, and the M99
deletion guard at `reveal/ledger-declare.mjs:1183-1198` never fires** — it
refuses rows that vanish, and none vanishes.

**WHAT THE THREE ROWS THEN CLAIM IS UNTRUE.** With `prod: "placed"`,
`manualPageRow` sets:

- `where` → *"src/data/artists/robots-record.js — an attachment on the Record entry that calls for it"* — **no attachment calls for them**
- `reach` → *"a frame in THE MANUAL's reader, on /robots"* — **there is no frame**
- `state` → the REVEALED value for `placed`
- `assets` → uids pointing at rows marked `missing: true`

**This file does not solve that and does not propose a fix.** The honest
options are all edits to `ledger-declare.mjs`, which is outside this change,
and choosing between them is a decision about what a ledger row means when the
thing it describes is withdrawn. **Stated and stopped.**

**`doc.manual.page.47` is the one that comes out right.** It is declared at
`:645-647` carrying both `scan-31-a` and `marked-01-a`, because the row is keyed
on the manual page and not on the delivered file — its own comment: *"a page
may reach the museum under more than one address."* After this change it keeps
**`marked-01-a` as its one remaining asset**, and everything it claims stays
true: an attachment does call for it, and there is a frame.

---

## 6 · THE SEQUENCE, AND THE GUARD A REMOVAL LOSES

### 6.1 · ONE LANDING, AND NOT BECAUSE A GATE SAYS SO

**Edits 1 and 2 are one commit.** The reason is §0.1: under this change the
files-gone-entry-intact direction produces no fault at all and `reveal:check`
passes, so nothing in the tree will catch a half landing. Read §0.1 before
running anything below.

### 6.2 · The gate sequence

`npm run assets:gate` exits **1** today and is not this change — it is the
Mike-approval gate, a signature gate rather than a correctness one.
`npm run day:proof` reads **1 of 49, exit 1**, the standing residual (Record
005, guard 6); it is not part of this landing and its expected exit is 1 either
side.

| # | command | expect | what it proves |
|---:|---|---:|---|
| 1 | `npm run assets:scan` | **0** | the five rows gain `missing: true` and keep their `ref` |
| 2 | `npm run reveal:build` | **0** | `record.003.assets` → one element; `doc.manual.page.47` → one; `unresolved` empty; **M99 does not fire** |
| 3 | `npm run reveal:check` | **0** | must still print *"nothing publishes until the Record delivers it"* and *"every HELD row is unreachable"* |
| 4 | `npm run reveal:day` | **0** | **governed pictures 147 · public 10 · behind the door 137 · to place 0 · to pull back 0** |
| 7 | `npm run shellstop:gate` | **0** | 0 unguarded |
| 8 | `npm run lint` | 9 errors / 7 warnings | unchanged — this change adds no code |

**Step 1 runs before step 2 deliberately.** `reveal:build` resolves refs through
the asset table; running the scan first makes the `missing: true` state the one
the ledger is built against.

**Step 4's numbers are derived from today's measured baseline**, RUN 2026-08-31:
`governed pictures 152 · public 15 · behind the door 137 · to place 0 · to pull
back 0`. Five files leave the public tree and are not added to the held tree, so
**152 − 5 = 147** and **15 − 5 = 10**; the held count does not move.

**Only after 1-8:** commit the two authored changes plus the regenerated
registers and the ledger as ONE commit. Then `npm run deploy:launch`, which is
Mike's, and `npm run door:check` after it.

### 6.3 · What the wire answers afterwards

| address | before | after |
|---|---|---|
| `/robots/manual/scan-07-a.webp` (and the other four) | 404 until 2026-09-09, then 200 image/webp | **200 `text/html`** — the SPA fallback. The file exists nowhere. |
| `/robots/manual/marked-01-a.webp` | 404 until 2026-09-09, then 200 image/webp | **unchanged** |
| `/held/robots/manual/scan-*.webp` | (no such path) | **still no such path** — nothing is held by this change |

Anybody probing an old address and reporting it *"still live"* has measured the
fallback, not a picture.

---

## 7 · WHAT THIS DOES NOT TOUCH

| | untouched | proof |
|---|---|---|
| **Record 003's published prose** | headline, dateline, EXECUTIVE SUMMARY, **DETAILED REPORT**, ADDENDUM 02 | all outside the `docs` block. Mike's ruling says the DETAILED REPORT is not edited by this change. **See §9.1.** |
| **The seventh picture** | `/robots/portal/qc-101-a.webp` still publishes **2026-09-10** | named by Record entry `no: 4`, a different entry, under `/robots/portal/`. Its row in `__WB_RECORD_ASSETS__` is untouched. |
| **The epoch** | `RECORD_EPOCH = "2026-09-07"` | `src/data/artists/record-epoch.js:116` is not in the file list. No entry's `date` is edited; entry 3 keeps `date: recordDay(3)`. All five Records still land 2026-09-07 … 2026-09-11. |
| **The wing** | opens on the same day | `src/lib/wing-open.js` derives from `RECORD_EPOCH`, and `__WB_RECORD_FIRST_DAY__` (`vite.config.js:623-624`) is the earliest entry's day — both unmoved. |
| **The countdown** | same target instant | `DOORS_OPEN_AT = recordVisibleAt(RECORD_EPOCH)` — `src/routes/WbHome.jsx:88`. |
| **`reveal/ledger-declare.mjs`** | not edited | §5 is the consequence of that, stated rather than solved. |
| **`docs/canonical/OPERATIONS.md`** | not edited | §3. |
| **The robots repository** | not touched at all | the masters these were cut from are unaffected, and no file in that repo names any of the five. |

---

## 8 · WHAT A REMOVAL CHANGES THAT A HOLD DID NOT

Against [`docs/PREPARED-manual-hold.md`](PREPARED-manual-hold.md).

**FALLS AWAY ENTIRELY:**

- **Its EDIT 3, the held-cost line.** Nothing lands behind the door. §3.
- **Its whole §2 destination analysis** — the 64-file/120,346,035-byte
  measurement of `public/held/robots/manual/` and the name-collision check.
  There is no destination.
- **The `uid` survives-a-rename argument.** Content-carry takes a candidate
  only when its own file is absent from disk; a `git mv` was exactly that case.
  A `git rm` is not a rename and the uid survives for a different reason —
  the asset-table row is kept. §4.
- **Its §6.3 `/held/…` wire row.** No held address is created.
- **Its §7 row on the byte-identical pair.** Both halves are deleted; there is
  no "the duplicate stands after the move".
- **Half its atomicity guarantee.** §6.1.

**NEWLY APPEARS, AND A HOLD NEVER NEEDED ANY OF IT:**

- **`git rm` as a verb**, five times, and the fact that history keeps the files.
- **Five asset-table rows going `missing: true`** rather than re-pathing.
- **The `provenance/assets.json` question, five times over** rather than once.
- **`doc.manual.page.32/33/34` becoming rows about nothing** — §5. Under a hold
  their assets moved with them and the rows stayed true.
- **The silent half-landing** — §6.1. Under a hold both directions faulted.
- **Record 003 dropping to a single attachment** — §1.3, §9.3.
- **The DETAILED REPORT naming three scans the entry does not carry at all**,
  where a hold left the attachments standing to answer it — §9.1.

**ALSO CORRECTED, independent of the ruling.** The superseded file's §6.0 says
`day:proof` is *"6 of 49"*; it has read **1 of 49** since the emitter fix landed
2026-08-29. Its §6.1 says the day-editor draft is stale by an epoch move; read
2026-08-31 it is `"saved": "2026-08-30T14:36:15.298Z"`, `"epoch": "2026-09-07"`
— **Mike saved on the 30th and the draft matches the tree.** Its §6.2 step 4
expects *"public 9"*; the measured baseline is **15**. None of the three is
carried forward.

---

## 9 · WHAT THIS DOES NOT RESOLVE — for Mike, at the writing stage

### 9.1 · The DETAILED REPORT names three scans the entry no longer carries

`robots-record.js:527-531`, published, and **not edited by this change**:

```
       Manual Pages Recovered
         SCAN 07 - POWER SYSTEM
         SCAN 11 - VID-LINK
         SCAN 31 - PARITY BIAS
```

**After this change the entry names three recoveries and declares none of
them.** Under the superseded hold the attachments stayed precisely to answer
this. Under the removal nothing does.

It is not a fault and no gate sees it. It is a reader meeting a report of three
recovered pages beside one attachment that is not any of them. **Mike's ruling
says the text is not edited by this change; it does not say the text is
final.** Whatever he attaches when he writes may make it true again.

### 9.2 · The canon and the arc cite the five by path

None of these is machinery. All of them go stale silently.

| where | what it says |
|---|---|
| `docs/ARC.md:148` | *"07, 11 and 31 were delivered by 003; the frontmatter was not"* — by scan NUMBER, so no path change reaches it, but **all three will no longer have been delivered in any checkable sense** |
| `docs/canon/07-MANUAL.md:103-105` | the three written paragraphs, delivered as these files |
| `docs/canon/09-PUBLISHED.md:252-255` | the four attachments and their files |
| `docs/canon/03-ANSWERS.md:47, :147` | *"published as `scan-31-a.webp`"* — twice |
| `docs/canon/06-PORTAL.md:14` | *"published in full as `scan-11-a.webp` / `scan-11-b.webp`, Record 003"* |
| `docs/canon/BELL-103.md:81` | the same claim for the video link |
| `docs/canon/FAILURE-MODES.md:34` | *"`BODY_B_1`, written, published as `scan-31-a.webp`"* |
| `docs/canon/HOLES.md:100, :138, :352` | ¶7-19 and SP 7-14 *"written and published"* |
| `docs/canon/CONFLICTS.md:67, :155` | both scans by name |

**The canon's claim is that three of the manual's written paragraphs are
PUBLISHED.** After this change they are written and not published. That is a
canon-level fact changing, and it is not one this file may decide.

### 9.3 · Whether an entry with one attachment still reads as an entry

Record 003 goes from four documents to one. The remaining one is the marked
copy — **a page returned with somebody's handwriting on it, with no unmarked
page beside it and no other document in the entry.**

Nothing measures this. It is a reading, and it is the reading Mike is best
placed to take when he decides what to attach instead.

### 9.4 · The rest

- **`provenance/assets.json` for five killed files.** §4.
- **`doc.manual.page.32/33/34` claiming a placement that no longer exists.** §5.
  Fixing it is an edit to `ledger-declare.mjs`, outside this change.
- **The lost atomicity guard.** §0.1. Nothing in the tree will catch a
  half-landing in the silent direction, and no fix for that is proposed here.
- **What comes back.** When Mike attaches something that fits the story, the
  attachment shape, the asset rows and pages 32/33/34 all come back into
  question together. Nothing here forecloses any of it.
