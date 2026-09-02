# JOB 4 — THE ARTIFACT TRACKER

2026-08-12 · **BUILT, RUN, OPENED IN A BROWSER AND CLICKED.** Nothing committed.

## OPEN IT

**Double-click `docs\dictation-20260807\assign.html`** — or open the Ops desk
(`Weird.Baby Ops` shortcut) and it is now the **first card**.

To rebuild it after the tables change: **`npm run assign`**.

---

## WHAT IT SAYS THE MOMENT HE OPENS IT

**164 things the wing could show. Eleven of them need no work.**

| State | Count | What it means |
|---|---|---|
| **READY** | **11** | in the museum at a governed address, file on disk. Name it in an entry and it publishes. |
| **NEEDS A COPY** | **79** | robots repo only. Somebody must copy it in and declare it. |
| **REBUILDING** | **61** | uncommitted in the robots repo right now — all 61 manual pages. |
| **NO FILE** | **12** | has a row in the asset table and no file behind it. |
| **SIGNAGE** | **1** | the wordmark. Drawn, counted, and refused if clicked. |
| already out | **0** | no Record entry names any asset yet. |

**That table is the answer to 4e and it is the whole reason the page exists.**
On Saturday the honest supply for five days is **eleven pictures**, not 164.

---

## 4a — ONE SELF-CONTAINED PAGE

`docs/dictation-20260807/assign.html`, 336 KB, opens by double-clicking. No
server, no build step, no install. Thumbnails are inlined as WebP data URIs
(reusing the light table's existing content-hash cache — 86 cached, 0 re-made on
the second run), so the grid paints with no file access at all.

It is **generated**, not authored: `tools/dictation/assign.mjs`, wired to
`npm run assign`. It is not in `public/`, so it is not one `npm run deploy` from
being published — verified: nothing of mine appears in `dist/`.

## 4b — LEFT: THE CATALOGUE

Nine groups, in the order he would reach for them — what is in the building
first, what needs carrying second:

| Group | n | Note |
|---|---|---|
| Machine photographs — in the museum | 14 | 6 need no work |
| Covers and artwork — in the museum | 6 | 5 need no work, 1 signage |
| Manual pages — the 1965 manual | **61** | every one REBUILDING |
| Manual — tuning plates | 3 | |
| Build photographs — the SD cards | **58** | the largest untouched reservoir |
| Plates | 1 | |
| Reference photographs — robots repo | 11 | |
| Sound | 8 | an entry delivers audio the same way it delivers a picture |
| The twin — program assets | 2 | |

Each group header prints, from the tables: **how many of that kind · how many
are already out · how many remain · how many need no work.** Each tile carries
its filename, its readiness flag, and Ops' quality read — printed as *"Ops reads
it: usable"* or *"nobody has looked"*, never as a verdict.

## 4c — RIGHT: FIVE DAYS, BOTH DIRECTIONS

Records 001–005, **Monday 2026-08-17 → Friday 2026-08-21**, read from
`recordDay(n)` off the one `RECORD_EPOCH`. His real headlines are on the cards;
Records 004 and 005 print *"no headline written"* because he wrote none, and
inventing one for a rail label is the drift this page refuses.

Click a day, then click pictures. **Both directions, tested by clicking:**
- clicking an assigned picture again takes it off
- clicking the `×` in the day's list takes it off
- clicking a picture already on another day **moves** it rather than duplicating

Verified live: assigned two to Record 003 → counter read 2 → clicked one `×` →
counter read 1, the row left the day, and storage updated in the same action.

## 4d — IT WRITES BACK. HERE IS HOW, AND WHY THIS ONE

**Chosen: localStorage autosave + an always-present copyable text block.**
**Rejected: the `record:serve` localhost POST — as the primary.**

The reason is 4a. A page that opens by **double-clicking** is a `file://` page,
and `file://` is not a secure context, so `showSaveFilePicker` is unavailable —
that is exactly what sent his Record editor's Save to Downloads on 2026-08-11.
A localhost POST would work, but it costs a typed command before he can open the
page, and 4a asked for a double-click. So:

1. **localStorage, on every click.** Costs him nothing and survives closing the
   tab — **tested: assigned two, reloaded the page, both came back with their DAY
   tags and their warnings intact.** This is what makes Saturday survive to
   Sunday.
2. **If storage is refused, a red banner** says the assignments are still on
   screen and still in the box, and to copy them before closing. It never loses
   an afternoon quietly.
3. **A copyable text block**, always on the page, holding the day-by-day list,
   a **NOT READY** section, and the exact `assets` arrays keyed by record number
   — the strings `reveal/delivery.mjs` actually reads. **No clipboard API:** the
   button selects the text and says *"Selected — press Ctrl+C now"* plus the
   character count. It never claims a copy it did not make.
4. **A plain download** as a third road.

**If he would rather it land in the repo by itself**, that is `record:serve`'s
pattern applied here — about twenty lines, and it costs him one typed command
instead of a double-click. Say the word and it is a small follow-on.

## 4e — LEAD TIME: WHAT IT CAN KNOW AND WHAT IT CANNOT

**What it knows, and warns about at the moment of the click** (the banner is
sticky under the toolbar — see the defect note below):

- **the file is not on disk** → *"Record 3 would promise a picture the museum
  does not have."* This is `deliveryFaults()` check 4, which would otherwise
  surface on the day, silently, with every other gate passing.
- **the file is being rebuilt right now** → its bytes are uncommitted in the
  robots repo, so what he is looking at is not necessarily what ships.
- **it needs one copy step** before an entry can publish it.
- **it is signage** and can never be delivered by an entry.

Every warning **travels into the paste**, under a `NOT READY` heading. A decision
that leaves the page without the fact that would change it is not a decision.

**What it cannot know, and does not pretend to:**

1. **How long any of that work takes.** The ledger's field for exactly this —
   `prod`: needed · printed · photographed · placed — is **null on all 166 rows.**
   It has never been populated. If he wants the catalogue to say *"three days"*
   rather than *"needs a copy"*, that field is where it would come from.
2. **Whether he approves a picture.** `verdict` is null on all 253 rows and is
   his alone; this page never writes it and never guesses it.
3. **Whether a picture is PRECIOUS or DUMP.** `bucket` is null on all 253 rows,
   is his, and Ops does not derive it. So the page cannot tell him he has spent
   his two-or-three-a-week ceiling — it can only show him what he assigned.
4. **Whether a robots-repo file is any good.** `quality` is null on 223 of 253
   rows, including **all 61 manual pages and all 58 build photographs.** The
   catalogue says *"nobody has looked"* on those, which is honest and is not a
   passing grade.

## 4f — IT INVENTS NO PARALLEL LIST

Every row is read at generation time from:

- `provenance/asset-table.json` — the catalogue rows, quality, missing, uid
- `reveal/record-entries.mjs` + `record-epoch.js` — the five days and headlines
- `reveal/delivery.mjs` — `SIGNAGE` and `delivered()`
- `reveal/placement.mjs` — `GOVERNED_PREFIX`, so the public address is computed
  rather than typed (§8's two-addresses hazard)
- `git status --porcelain` in the robots repo, read-only — the only thing that
  knows what is mid-rebuild

`tools/dictation/assign.mjs` holds **no asset path, no record number and no
date of its own.** It reuses `esc`/`page`/`OPS_CSS` from `shell.mjs` and
`thumbnails`/`diskHref` from `lighttable.mjs` rather than re-implementing them.

---

## TWO DEFECTS FOUND BY LOOKING, BOTH FIXED

Both were invisible to lint and to the generator's own output. They are here
because the round log is where craftsmanship notes belong, and because the first
one is a hazard the next Ops page will hit too.

**1. I reused four class names that the shared Ops stylesheet already defines.**
`OPS_CSS` declares `.wrap`, `.bar`, `.day`, `.n` — and **`.rail`, which is the
three-marks verbatim badge** (`Ops` blue / `your words` gold / amber). My day
column inherited `white-space: nowrap` from it and pushed **196px of horizontal
scroll** onto the page. This is the A-round hazard exactly: a shared class
restyled bare reaches every page that uses the shell. Fixed by namespacing every
class I emit to `as-*` and **asserting zero intersection with `OPS_CSS`'s
selector set** — a check that now runs as part of the build sequence rather than
living in my head.

**2. The warning banner was invisible where it mattered most.** It was static at
the top of the document, so assigning a manual page — 1,043px down the
catalogue, where **every row is REBUILDING** — fired the warning **386px above
the viewport, measured.** A warning he cannot see is not a warning, and lead time
is the whole point of the page. The toolbar and the banner are now one sticky
unit; re-measured at the same scroll position, the banner sits at `top: 47px`,
on screen, and I photographed it there.

**A third finding is mine, not the page's:** one physical click at the signage
tile produced no banner, and I nearly reported that as a defect. Clicking the
same tile programmatically produced the correct refusal. **My click missed the
tile.** The mechanism was right; the report would have been wrong.

---

## GATES

Run after every change, in the museum repo:

| Gate | Result |
|---|---|
| `lint` | **9 errors / 8 warnings — baseline exactly** |
| `provenance:gate` | **PASS** |
| `reveal:build` | ran; **`ledger.json` regenerated byte-identically** (the M99 guard holds) |
| `reveal:check` | **PASS** — including *nothing publishes until the Record delivers it* |
| `parity:gate` | **PASS** — 4 shared, 0 divergences |
| `instory:gate` | **PASS** — 0 findings |
| `build` | **green** |
| `build:launch` | **green**, `WB_STAGE = launch` |
| `assets:orphans` | **13 rows — 8 judged, 5 unjudged. NOT CLEAN, AND NOT MINE — see below.** |

**The orphan count is a pre-existing drift and it is worth a sentence.** The last
sealed round (2026-08-09) recorded `assets:orphans` at **0 judged, 0 unjudged**.
It now reports **13**, of which **8 carry judgements**. `provenance/asset-table.json`
is **unmodified by tonight's work** — `git status` shows only `package.json`,
`tools/ops-desk.mjs`, `docs/OPS_DESK.html` and two new files — so these 13 rows
lost their files between 2026-08-09 and now. Seven of the twelve NO FILE tiles in
the catalogue are exactly this condition, which is why the page can warn about
them at all.

**Files changed:** `tools/dictation/assign.mjs` (new) · `package.json` (one
script) · `tools/ops-desk.mjs` (one card) · `docs/dictation-20260807/assign.html`
(generated) · `docs/OPS_DESK.html` (regenerated). **Nothing in `src/`.**

---

## WHAT I COULD NOT DETERMINE

- **How long any of the not-ready work actually takes.** The ledger's `prod`
  field is null on all 166 rows, so the page can say *what* is missing but never
  *how many days*. I did not populate it — it is a production fact, not a
  derivation.
- **Whether the 61 manual pages will still be 61 when the rebuild finishes.**
  All 62 dirty files in the robots repo are that rebuild. `reveal:check` reads
  the page count off disk rather than a declaration, so the count will follow —
  but what the rebuilt pages *look like* I have not seen and the tracker says so.
- **Whether the 58 build photographs are usable.** `quality` is null on every
  one. Nobody has looked, including me — I generated thumbnails but did not
  inspect 58 pictures and would not record a judgement if I had.
- **Whether `file://` will allow localStorage on his machine.** Every test ran
  against `http://127.0.0.1`, a different origin — deliberately, so his own
  storage was never touched. The worksheet used the same mechanism from
  `file://` successfully for weeks, so I expect it to work; the red banner exists
  because I could not prove it.
- **Whether the 13 orphaned asset rows are an intended cleanup or an accident.**
  I did not investigate and did not cull anything.
- **What the two 240px-thumbnail failures among the 12 unreadable files are.**
  Twelve rows could not be thumbnailed; the ones I checked are the missing files,
  which is expected, but I did not verify all twelve individually.

## WHAT NEEDS MIKE

1. **Open it and use it Saturday.** `docs\dictation-20260807\assign.html`, or the
   first card on the Ops desk. Nothing needs setting up.
2. **Know before you start: the ready supply for five days is eleven pictures.**
   Everything else needs a step first, and the page will tell you which as you
   click. If eleven is too few for week one, the cheapest next move is the
   **manual pages** — 61 of them, one copy step each, currently mid-rebuild.
3. **Press "Select it all for Ctrl+C" and paste the block to Ops when you are
   done.** That is what turns Saturday's clicking into Sunday's entries. The
   page remembers on its own, but the paste is what reaches the repo.
4. **One question, one word:** do you want the Save button to write straight into
   the repo instead of the paste? It costs you typing `npm run assign:serve`
   before opening the page, instead of a double-click. I chose the double-click.
