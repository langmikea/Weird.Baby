# THE TRACKER — SECOND PASS

2026-08-12 · **BUILT, OPENED, USED. Nothing committed, pushed or deployed.**
HEAD `82ad00c`. Rebuild with **`npm run assign`**.

---

## WHAT MIKE ASKED FOR, AND WHETHER IT IS THERE

| | Asked | Now |
|---|---|---|
| A | Record 001 opens the Robots wing must be assignable | **Yes.** It is the first tile on the page. |
| B | Preview manual pages large enough to read | **Yes.** 1482px for a 2550px page (58%). I read the type. |
| C | Sort unavailable down, dim it, count at top, say why | **Yes.** 36 usable first, 192 dimmed below, each with its reason. |
| D | What unblocks the manual pages | **Reported below. The 255 MB ruling does not block week one.** |

**THE SHELF: 11 pictures + 25 story events = 36 things he can use on Saturday.**

---

## A — WHAT A RECORD ENTRY CAN ACTUALLY CAUSE

Ops' scoping error was real. Here are all five mechanisms, established by reading
the code, not assumed.

| | Mechanism | Fires by itself? |
|---|---|---|
| 1 | **The wing opens.** `ROBOTS_OPEN` in `src/lib/wing-open.js` is derived from the Record having a *visible entry* — not a date, not a declaration. Consumed by `App.jsx` (the `/robots` and `/robots/record` routes) and `WbHome.jsx` (the wing's card). | **YES** |
| 2 | **A picture publishes.** The entry's `assets` array is the delivery list. | no — needs the file in place |
| 3 | **A picture appears at the entry's hook.** `still` + `stillCaption` through `placed()`. Record 013 was the only user; 013 is deleted, so the import is gone and returns by itself when a lander emits a `placed(` call. | no |
| 4 | **An attachment appears at the foot.** `wire`, `plates`, `docs`. | no |
| 5 | **The entry becomes visible at all.** `date`, through `record-clock.mjs`. | yes, by date |

### A3 — "Record 001 opens the Robots wing": ALREADY TRUE, NOTHING TO DECLARE

Plainly: **it needs nothing.** `wing-open.js` opens the wing the moment the Record
has a visible entry, so it happens on 2026-08-17 whether or not anybody writes it
down. The tile says `FIRES BY ITSELF` and, when clicked, says so in the banner.
Assigning it **records the fact; it does not cause it.**

### A2 — WHAT ELSE BELONGS IN THE STORY LIST: 63 HELD LEDGER ROWS

The ledger's `state` (`HELD` / `REVEALED` / `RETIRED`) is the only existing
mechanism for "a thing the museum is holding". So the story catalogue is the
**63 HELD rows**, split by whether the thing actually exists:

- **24 NEEDS DECLARING** — build `LIVE` or `PARTIAL`. The thing exists and is
  held. Includes both Portal surfaces, the feed panel, the Hunter Root wing and
  archive, five eggs, two sounds, the charter, the original printed manuals.
- **39 NOT BUILT** — build `NOT_BUILT` or `STUB`. Nothing exists to reveal.
  Dimmed, sorted last, each saying *"not built — nothing exists to reveal"*.
- **12 RETIRED rows are not offered at all** — Doctrine 24. Absent by rule, and
  the rule is recorded in the generator's header rather than left as a silent
  filter.

### THE FINDING THAT MATTERS MOST — A STORY DATE FIRES NOTHING

The ledger has a field for exactly this: `when`, *"the story day or week a row
becomes REVEALED"*. Three facts about it:

1. It is **null on all 166 rows.**
2. It is **stripped out of the bundle.** `PUBLIC_FIELDS` in
   `reveal/public-view.mjs` is `["id","build","state","shown"]`, so `when` never
   reaches the glass and no renderer could read it if it were set.
3. Its only consumers are one check in `reveal/transfers.mjs` and the Ops reports.

And `state` itself is narrower than it looks: `stateOf()` and `isRevealed()` are
exported from `src/lib/reveal.js` and **nothing in `src/` calls either of them.**
The only ledger field with a live consumer is `build`, through `isLive()` →
`foundation-state.js` → the Foundation register's LIVE / NOT BUILT column.

**So revealing a held thing is a human act, in three steps: flip `state` in
`reveal/ledger-declare.mjs` → `npm run reveal:build` → deploy.** The page says
this on every such tile rather than implying a switch exists.

### A4 — WHAT HE MIGHT WANT TO ASSIGN THAT HAS NO MECHANISM (gaps, not features)

Named and stopped, as asked:

1. **"This day retires something."** `RETIRED` exists as a state but there is no
   mechanism that *announces* a retirement to a visitor — and Doctrine 24 points
   the other way, so this may be a gap that should stay a gap.
2. **"This day opens a room inside a wing"** (e.g. the Portal alone, with `/robots`
   already open). Nothing composes per-room reveals; it is one `state` flip per
   ledger row with no notion of a parent being open.
3. **"This day changes something that is already public."** No mechanism at all —
   the ledger models held→revealed, not revealed→altered.
4. **"This day starts a countdown / arms something for later."** `transferWeek`
   records when material *arrived*; nothing schedules a future firing.
5. **"This entry links to that entry."** No cross-reference field exists.
6. **A story event with no ledger row at all** — anything Mike invents on Saturday
   that is not already a row. The page cannot offer what the tables do not hold,
   and inventing rows is not Ops' call.

---

## B — HE CAN SEE WHAT HE IS CHOOSING

**B1. The viewer.** Click the magnifier (⚲) on any picture tile. It loads the
**real file off disk by relative path** — not a bigger data URI — so the page
stays 410 KB and "read the type" means the actual pixels.

**Measured, then read by eye:** a 2550×3300 manual page draws at **1482×1917,
58%.** I could read *"MGK-VIIIp / OPERATING AND MAINTENANCE INSTRUCTIONS /
STRUCTURE ISSUE / STRUCTURE AND ARRANGEMENT ONLY"*. Capture attached.

It **fits the width, not the window** — and that was a real correction. Fitting
the window drew the same page at **511px (20%)**, where the type is grey texture.
A manual page is tall; the only axis worth spending is the horizontal one and the
vertical is what a scrollbar is for. A `100%` button gives full detail with
panning. `←` `→` step through pages, `Esc` closes.

**The assign button is inside the viewer** ("assign to Record 00n"), because he
decides *while reading*, and a viewer he has to close to act is a viewer that
makes him act from memory.

**B2. The thumbnail is `object-fit: contain`, and it was `cover`.** `cover` crops
— and on a 2550×3300 manual page the crop removes the head of the page, which is
exactly where the type he is looking for lives. A letterboxed thumbnail wastes
pixels; a cropped one **hides the thing being chosen.** Tile height went 118→132px
to give the letterbox somewhere to go.

**B3. Photographs get the same treatment** — same magnifier, same viewer, same
fit-width default. Audio files carry **no** magnifier, because there is nothing to
look at and a control that opens an empty box is worse than no control.

**B4. Still one self-contained page, no server.** The viewer uses relative paths
(`../../../weird-baby-robots/…`), which resolve from `file://` when the page is
double-clicked. *(Testing note: I had to serve `C:\AI\Projects` over localhost
because the Chrome extension refuses `file://` — that is a limit of my tools, not
of the page.)*

---

## C — THINGS HE CANNOT USE ARE OUT OF THE WAY

**C1.** Within every group, usable sorts first; everything else sorts below at
42% opacity, brightening on hover. **Nothing is deleted** — 192 dimmed tiles are
still there and still clickable, because a thing that vanishes gets assigned from
memory and then never appears. A new **"only what I can use"** button collapses
the page to the 36.

**C2.** One line at the top, above the work:
> **11** pictures ready · **25** story events you can use · 192 more need work first, sorted below and dimmed · 0 assigned

**C3.** Every not-ready tile carries its reason in gold, visible without
clicking: *the file is not on the disk* · *must be copied into the museum first* ·
*being rebuilt right now — uncommitted* · *not built — nothing exists to reveal* ·
*exists and is held — flip state, rebuild, deploy* · *signage — no entry can
deliver it*.

---

## D — THE MANUAL PAGES

### D1 — WHAT UNBLOCKS THEM. **THE 255 MB RULING IS NOT IN THE WAY.**

This is the most useful thing in this report, so it goes first: **the git decision
affects the robots repo's history, not the museum's ability to publish a page.**
The museum publishes from its own `public/held/robots/…`, which is a different
repo. A page can be copied in and shipped today with the 244 MB question still
open.

Two facts that make this concrete:

- **The pages are already tracked and committed.** `HEAD` holds
  `page-01.png` at **0.1 MB**; the working tree has it at **2.1 MB**. The dirty
  set is a *regenerated, heavier* render of an existing committed set — 63 files,
  **243.7 MB**, all of them `M` (modified-tracked), none new.
- **2.1 MB is normal for this museum.** The 11 ready pictures run **0.5–4.8 MB at
  up to 3000×2400**, 15.2 MB for twelve files. A 2550×3300 page at 2.1 MB needs no
  optimisation step to match existing practice.

**The order, for one page:**

1. Copy it to `weird-baby-museum/public/held/robots/…`.
   **Safe on its own** — I checked `deliveryFaults()`: a governed file that is
   *held and undelivered* hits `continue` with the comment *"held + undelivered is
   the rule working"*. No gate complains. (I had assumed this was an ordering trap
   and it is not.)
2. `npm run assets:scan` — gives it an asset-table row, so the tracker sees it.
3. `npm run assign` — it now reads **READY**.
4. Name it in the Record entry's `assets` array. That *is* the delivery
   declaration.
5. `npm run reveal:day -- --place` — moves it from `held/` to its public address.
6. `npm run reveal:check`, then `npm run deploy`.

**Only step 4 is Mike's.** Steps 1–3 and 5–6 are Ops'.

### D2 — WHAT IS READY TODAY. ONE LIST.

**11 pictures, no work:**

| | |
|---|---|
| `/robots/reference/mgk-viii/output_row.jpg` | usable |
| `/robots/reference/photos/front_screen.png` | ok |
| `/robots/reference/photos/MGK-TWIN_MONITOR_CLOSE_UP.png` | nobody has looked |
| `/robots/reference/photos/MGK-TWIN_MONITOR_SCREEN_BEZEL.png` | **Ops reads it: wrong** |
| `/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png` | usable |
| `/robots/reference/photos/top_monitor.png` | usable |
| `/robots/art/mgk-niac-cover.png` | usable |
| `/robots/art/mgk-viiip-cover.png` | usable |
| `/robots/art/portal-cover.png` | nobody has looked |
| `/robots/art/viiip-v2.png` | nobody has looked |
| `/robots/art/viiip.png` | usable |

*(`wbr-cover-logo.png` is the twelfth museum-side file and is SIGNAGE — never
deliverable by an entry.)*

**25 story events:** 1 that fires by itself (the wing opening) + 24 that exist and
are held. Of those 24, **four are Ops instruments** (the provenance gate, the
asset table, the ledger itself, the open-actions register) — in the ledger because
everything is, almost certainly not what he wants a Record to announce. They are
grouped last and labelled as such rather than hidden.

**So the honest working shelf is 11 pictures + 21 story events + the wing.**

### D3 — WHAT COULD BE MADE READY BY SATURDAY (three days)

| | Could it? | Why |
|---|---|---|
| **79 NEEDS A COPY** | **Yes, all of them** | It is a copy + a scan, batchable in one round. **The blocker is a decision about which, not labour.** Say which and they are READY. |
| **61 manual pages** | **Yes** | Same copy step. Needs one word from Mike on *which render* — the 0.1 MB committed one or the 2.1 MB regenerated one. Nothing else. |
| **24 story events** | **Yes** | Three steps each, all Ops': flip `state`, `reveal:build`, deploy. |
| **12 NO FILE** | **No** | Somebody must *find* files that are not on the disk. I cannot promise that by Saturday and would not. |
| **39 NOT BUILT** | **No** | The things do not exist. Building them is not a Saturday job. |

---

## E — WHAT I SAW, AND WHAT FELT WRONG

I opened the page and used it: assigned the wing event to Day 1, assigned
`page-01.png`, previewed it, stepped to `page-02.png`, assigned from inside the
viewer, then unassigned both — one by the `×` in the day, one by re-clicking the
tile. Storage went `{"1":["…page-01.png","event:wing-open"]}` → `{"1":[]}`.

**What it does right:** a story event and a picture sit in the same day list with
no separate code path, because a day holds *things*. The paste marks events
`[STORY]` and keeps them **out of the `assets` array** — an event is not an asset
and putting one there would hand Ops a delivery list with a non-path in it.

**What felt wrong, and what I did:**

- **The event tiles were 149px wide** — about twenty characters a line for a
  two-sentence tile. I measured first: **0 of 64 were clipped**, so this was
  legibility, not truncation. Event grids now use a 260px minimum column. *(I had
  read the screenshot as showing cut-off text; the measurement corrected me, and I
  did not "fix" a defect that was not there.)*
- **`FIRES BY ITSELF` sits alone in its own group** with one tile and a lot of
  white space to its right. It is honest and it is a bit forlorn. Left as is
  rather than merged, because merging it into "rooms" would put the one thing
  that needs nothing beside 23 that need three steps.
- **The 39 NOT BUILT tiles are still a long dim tail** to scroll past on
  "everything". The "only what I can use" button is the answer, and it is one
  click, but the default view is still long.

**Three defects I caused and fixed inside this pass:**

1. **I overloaded `kind`.** My artifact/event discriminator used the same field
   name as the asset table's `image`/`audio`/`video` column, so `thumbnails()`
   saw nothing it recognised and made **zero thumbnails** — a page of empty
   boxes. Caught because the generator prints its own thumbnail counts.
2. **I mislabelled 58 files as photographs.** The group read *"Build
   photographs — the SD cards … the largest untouched reservoir the museum has"*.
   They are **58 audio files** (20 mp3, 38 wav), and the manual is larger at 61 —
   wrong twice. I had named the group from its directory path and assumed. Found
   by auditing every group's label against the asset table's own `kind`/`format`
   columns; that audit is now part of building this page. **An invented label on a
   catalogue is worse than none:** he would have assigned "photographs" to a day
   and received sound.
3. **A capture came back as a high-DPI crop**, not a zoomed page —
   `devicePixelRatio` 2.5, layout unchanged at 1521px. Saying so rather than
   passing it off; the attached captures are full-viewport.

---

## GATES

| Gate | Result |
|---|---|
| `lint` | **9 errors / 8 warnings — baseline exactly** |
| `provenance:gate` | **PASS** |
| `reveal:build` | ran; **`ledger.json` byte-identical** (not in `git status`) |
| `reveal:check` | **CHECK: PASS** |
| `parity:gate` | **PASS** — 4 shared, 0 divergences |
| `instory:gate` | **PASS** — 0 findings |
| `build` | **green** |
| `build:launch` | **green**, `WB_STAGE = launch` |
| `assets:orphans` | **13 rows — 8 judged, 5 unjudged.** Unchanged from last night and **pre-existing**: `asset-table.json` is not in `git status`. |
| published? | **`assign.html` is not in `dist/`** — it lives in `docs/`, so no deploy can ship it |

**Files changed** — nothing in `src/`:

```
 M docs/OPS_DESK.html                        regenerated (card text)
 M package.json                              the assign script (first pass)
 M tools/ops-desk.mjs                        the card
?? tools/dictation/assign.mjs                the generator
?? docs/dictation-20260807/assign.html       generated, 410 KB
```

---

## THE COMMIT COMMANDS — NOT RUN

```powershell
cd C:\AI\Projects\weird-baby-museum
if (Test-Path .git\index.lock) { Remove-Item .git\index.lock }

git add tools/dictation/assign.mjs tools/ops-desk.mjs package.json `
        docs/OPS_DESK.html docs/dictation-20260807/assign.html

git commit -m @'
The tracker knows story events, and a page can be read before it is chosen

Mike used the tracker and found three things. The first was Ops' scoping
error: he asked for artifacts AND STORY LINKAGES and only the first half
was built, so "Record 001 opens the Robots wing" had no address on the
page and the tile refused him. There are two catalogues now, and a day
holds things rather than files.

Reading the code rather than assuming it, a Record entry causes five
things and exactly one fires by itself: ROBOTS_OPEN is derived from the
Record having a visible entry, so the wing opens on day one whether or
not anybody writes it down. That tile says FIRES BY ITSELF and says why.
The other 63 held ledger rows split on whether the thing exists — 24
NEEDS DECLARING, 39 NOT BUILT — and the 12 RETIRED rows are absent by
Doctrine 24 rather than by a silent filter.

The ledger's own story field fires nothing, which is worth writing down:
`when` is null on all 166 rows AND is stripped from the bundle by
PUBLIC_FIELDS, and nothing in src/ calls stateOf() or isRevealed(). The
only ledger field with a live consumer is `build`. Revealing a held
thing is three human steps, and every such tile says so instead of
implying a switch.

He also could not see what he was choosing. The viewer loads the real
file off disk and fits the WIDTH, not the window: a 2550x3300 manual page
drew at 511px (20%) fitted to the window and draws at 1482px (58%)
fitted to width, where the type reads. Thumbnails are `contain` and were
`cover` — cover crops the head off a manual page, which is where the
type is. And what he cannot use now sorts below what he can, dimmed,
each tile carrying its reason in one phrase.

Three defects of my own went with it: `kind` was overloaded and silently
produced zero thumbnails; 58 audio files were labelled "build
photographs" because the group was named from its directory path and not
from the table; and the warning banner is inside the sticky header so a
warning fired 1000px down the catalogue is on screen.

Gates: lint 9/8 baseline - provenance PASS - reveal:check PASS -
parity PASS - instory PASS - build and launch build green - ledger.json
byte-identical. Nothing in src/ changed. assign.html is in docs/ and
cannot be deployed.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_013KbQsfBaXC1qWPEwfp9hJt
'@
```

---

## WHAT I COULD NOT DETERMINE

- **Which manual render Mike wants** — the 0.1 MB committed one or the 2.1 MB
  regenerated one. The tracker shows the working-tree version because that is
  what is on disk; it does not know which he prefers.
- **Whether the regenerated pages are finished.** The last robots commit message
  describes typography tuning in progress. I did not read all 61 to judge.
- **Whether any of the 79 NEEDS A COPY files are worth showing.** `quality` is
  null on all of them — including every manual page and all 58 recordings.
  Nobody has looked, me included, and I would not record a judgement if I had.
- **How long the not-ready work takes.** The ledger's `prod` field
  (needed/printed/photographed/placed) is null on all 166 rows, so the page says
  *what* is missing and never *how many days*.
- **Whether `file://` allows `localStorage` on his machine.** Every test ran over
  `http://127.0.0.1`, a different origin, deliberately — his own storage was
  never touched. The red banner exists because I could not prove it.
- **Whether the four Ops-instrument story events should be offered at all.** I
  grouped them last and labelled them rather than filtering them, because
  dropping a ledger row would be Ops deciding for him.

## WHAT NEEDS MIKE

1. **Open it and use it.** `docs\dictation-20260807\assign.html`, or the first
   card on the Ops desk. "Record 001 opens the Robots wing" is the first tile.
2. **The 255 MB git ruling does not block week one** — that is the one thing to
   take from this report. Manual pages can be copied into the museum and shipped
   with that question still open. What Ops needs instead is **one word: the
   committed 0.1 MB render, or the regenerated 2.1 MB one.**
3. **Say which of the 79 copyable things you want**, in any number. Ops copies
   them and they are READY before Saturday. The blocker is your choice, not work.
4. **One judgement worth making before Saturday:**
   `MGK-TWIN_MONITOR_SCREEN_BEZEL.png` is READY and Ops reads it as **wrong** —
   the file may not show what its slot says. Four more ready pictures have never
   been looked at by anybody.
