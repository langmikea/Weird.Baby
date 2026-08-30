# FINDING — the hold path for the six manual scans

**Round:** the hold path, read-only packet.
**Written:** 2026-08-29.
**Scope:** READ ONLY. Nothing that publishes was changed. No date was moved. No
part of the change described in §3 was prepared, staged or written.
**Repository:** `C:\AI\Projects\weird-baby-museum`, branch `main`.
**Companion:** [`docs/FINDING-manual-scans.md`](FINDING-manual-scans.md) — the
same six files, measured as files. This report is about what holds them.

**Method notation.** Every fact carries **READ** (the tree states it, at a named
file and line) or **RUN** (a command was executed and this is its output).

---

## 1 · THE REFUSAL

**`src/worker.js:673-680`.** READ. The branch is five lines; the comment blocks
above it run from 632 to 672 and are not part of the test.

```js
    const governed = assetWithheld(__WB_RECORD_ASSETS__, url.pathname, recordToday);
    if (governed && !showEveryRecord(await previewOpen(request, env), clock)) {
      return noStore(new Response("Not found", { status: 404 }));
    }
```

### 1.1 · The exact condition

The test resolves through four declarations, each read at its own line:

| name | resolves to | where |
|---|---|---|
| `assetWithheld(s, p, today)` | `const day = s && s[p]; if (!day) return false; return day > today;` | `reveal/record-clock.mjs:219-223` |
| `__WB_RECORD_ASSETS__` | the build-time table, `path → earliest day an entry names it` | `vite.config.js:613-614` |
| `recordToday` | `clock.today`, which is `asOf.day || realToday` | `src/worker.js:582`, `src/worker.js:1050-1055` |
| `realToday` | `todayInRecordTz()` | `src/worker.js:1039` |
| `showEveryRecord(previewing, clock)` | `previewing && !clock.driven` | `src/worker.js:260` |

**Stated in one sentence: a governed picture is refused when the day its own
Record entry gives it is STRICTLY GREATER than the museum's own day, and the
caller is not a previewer on an undriven clock.**

**Both sides are ISO day STRINGS and the comparison is a string comparison.**
`reveal/record-clock.mjs:136-138`, READ — *"parsing them back into moments to
compare them is how a timezone bug gets in."* The only place a day becomes a
moment is `recordVisibleAt`, which the countdown uses and this branch does not.

**The day turns over at 17:00 America/New_York, not at midnight.**
`todayInRecordTz()` returns the previous calendar day until `RECORD_HOUR` —
`reveal/record-clock.mjs:104-113`, READ. So the six become fetchable at
**17:00 on 2026-09-09 New York time**, not at 00:00.

**For a cookie-free client the second half of the condition is constant.**
`previewOpen` is false with no `wb_record` cookie, so `showEveryRecord` is false,
so `!showEveryRecord(...)` is true and the branch reduces to `governed` alone.
`governed` short-circuits, so the cookie is only read for a path that is actually
on the schedule — `src/worker.js:670-672`, READ.

**The refusal is a 404 with the body `Not found`, marked `Cache-Control:
no-store`** by `noStore` at `src/worker.js:190-194`. READ. Nine bytes of
`text/plain` — the same shape the door probe measured on the stage door in §2.

**Every path reaches this branch.** `wrangler.jsonc:70-72` sets
`"run_worker_first": ["/*"]`. READ. There is no static-asset path that bypasses
the worker.

**It sits after the two directory doors on purpose** — `src/worker.js:636-638`,
READ. A path both governed and behind a shut directory has already been answered
above; this branch only ever sees paths a visitor is otherwise allowed to have.
**The six are in that category: they are at public addresses.**

---

## 2 · WHAT THE SIX ANSWER, TODAY AND ON 2026-09-09

### 2.1 · `door:check` does not cover these paths — stated plainly

**RUN — `npm run door:check`:**

```
  DOOR PROBE — cookie-free, against the live wire

    origin      https://weird.baby
    credentials NONE — no cookie, no key, no HR_KEY
    prefixes    read from src/worker.js: /assets/locked/  /locked/  /assets/held/  /held/

  CONTROL — must answer 200 or this run has measured nothing
    200     739420 B  image/png
         /WeirdBaby_PhotoID.png

  HELD SAMPLES — each must answer 404 to a cookie-free client
    skipped  /assets/locked/  — no tracked file under public/assets/locked/ (built chunks only)
    skipped  /locked/  — no tracked file under public/locked/ (built chunks only)
    skipped  /assets/held/  — no tracked file under public/assets/held/ (built chunks only)
    404          9 B  text/plain;charset=UTF-8
         /held/robots/art/mgk-niac-cover.png   [stage]

  /api/held — stage is reported without a key; commit is not
    200  stage="launch"  open=false

PASS — control 200, 1 held sample(s) 404, open false. Stage on the wire: "launch".
```

**The probe passed, and it did not touch any of the six.** It reads its prefixes
out of `LOCKED_DIRS` and `STAGE_DIRS` — `src/worker.js:77-78`, READ:

```js
export const LOCKED_DIRS = ["/assets/locked/", "/locked/"];
export const STAGE_DIRS  = ["/assets/held/", "/held/"];
```

**The six live at `/robots/manual/…`, which is none of those four prefixes.**
They are held by the ASSET SCHEDULE (§1), which is a different mechanism from
the directory doors the probe measures. `door-probe.mjs` has no notion of the
schedule and cannot acquire one without a second source of truth about which
doors exist — which its own header, `tools/door-probe.mjs:20-24`, refuses on
principle.

**So the wire reading for these six paths does not exist, and this report does
not manufacture one.** No browser was opened and no substitute probe was run.
**What follows is the worker's own decision function, executed — not the wire.**

### 2.2 · The decision function, executed

**RUN**, calling the same `assetWithheld` the worker calls, against the same
schedule `vite.config.js` bakes:

```
todayInRecordTz() = 2026-08-29
--- as of 2026-08-29 ---
    WITHHELD -> 404 /robots/manual/scan-07-a.webp
    WITHHELD -> 404 /robots/manual/scan-07-b.webp
    WITHHELD -> 404 /robots/manual/scan-11-a.webp
    WITHHELD -> 404 /robots/manual/scan-11-b.webp
    WITHHELD -> 404 /robots/manual/scan-31-a.webp
    WITHHELD -> 404 /robots/manual/marked-01-a.webp
    WITHHELD -> 404 /robots/portal/qc-101-a.webp
--- as of 2026-09-08 ---
    (all seven: WITHHELD -> 404)
--- as of 2026-09-09 ---
    not withheld -> 200 /robots/manual/scan-07-a.webp
    not withheld -> 200 /robots/manual/scan-07-b.webp
    not withheld -> 200 /robots/manual/scan-11-a.webp
    not withheld -> 200 /robots/manual/scan-11-b.webp
    not withheld -> 200 /robots/manual/scan-31-a.webp
    not withheld -> 200 /robots/manual/marked-01-a.webp
    WITHHELD -> 404 /robots/portal/qc-101-a.webp
--- as of 2026-09-10 ---
    (all seven: not withheld -> 200)
```

**TODAY (2026-08-29), all six answer 404 to a cookie-free client.**
**ON 2026-09-09, from 17:00 America/New_York, all six answer 200.**

### 2.3 · The bridge from this tree to the deployed worker

The schedule above is the *tree's*. The bundle in production was built from a
particular commit, and if that commit differed the live table would differ.

- `docs/DEPLOYED.md` — live commit **`3ccbad9`**, stage **launch**, deployed
  **2026-08-29T21:36:59.254Z**, tree clean. READ.
- `door:check` independently reports `stage="launch"` on the wire — RUN, §2.1 —
  which agrees with that row.
- The three inputs to the table at `3ccbad9`, RUN via `git show`:
  - `src/data/artists/record-epoch.js:116` → `RECORD_EPOCH = "2026-09-07"` — same.
  - `src/data/artists/robots-record.js` → the same six `/robots/manual/` paths at
    lines 549-574, and `/robots/portal/qc-101-a.webp` at 613 — same seven.
  - `src/worker.js:673` → the same `assetWithheld(__WB_RECORD_ASSETS__, …)` call
    at the same line — same refusal.

**The deployed worker's inputs are byte-identical to the ones computed above, so
the answers in §2.2 are the answers production will give.** That is an inference
from three matching inputs, and it is offered as exactly that — **not as a wire
measurement.** Nothing in this round measured the wire on these six paths.

---

## 3 · WHERE A CHANGE WOULD HAVE TO LAND

**Nothing here was prepared, staged or written. This section names files and the
SHAPE of an edit, and stops.**

### 3.1 · There are exactly two mechanisms that can hold a governed picture

| | mechanism | keyed on | declared |
|---|---|---|---|
| **A** | the asset schedule | the entry's DAY | `reveal/record-clock.mjs:206-223`, `src/worker.js:673-680` |
| **B** | the stage door | the file's LOCATION under `/held/` | `src/worker.js:78`, `src/worker.js:625-630` |

Nothing else refuses a governed picture. `run_worker_first: ["/*"]` means there
is no third path a request can take.

**Mechanism A cannot be used without moving a date**, and the packet forbids
that. It is also not a local move: `RECORD_EPOCH` is one constant and all five
entries derive from it — see §4.1.

**So holding the six past 2026-09-09 means mechanism B**, and mechanism B has a
two-part shape.

### 3.2 · The two places, and why they cannot move separately

| # | file | shape of the edit |
|---|---|---|
| 1 | `src/data/artists/robots-record.js:544-577` | Record entry `no: 3`'s `docs[]` — the four attachments and their six `plates[].img` values — stop naming the six public paths. |
| 2 | `public/robots/manual/*.webp` (six files) | the files move to `public/held/robots/manual/`. |

**THEY CANNOT MOVE SEPARATELY, AND THE REASON IS A GATE THAT FIRES IN BOTH
DIRECTIONS.** `deliveryFaults()` — `reveal/delivery.mjs:189-294`, READ — is run
by `reveal/schema.mjs:283` (so `npm run reveal:check`) and by `reveal/day.mjs:261`
(so `npm run reveal:day`).

**Move the files alone (2 without 1)** and this fires, `reveal/delivery.mjs:226-232`:

> `delivery: <base> IS delivered — a Record entry names it — and it is still
> behind the door. The rule runs both ways: an entry brings a thing into the
> story and the thing is then PLACED according to that entry. Move it to
> public/robots/<base>.`

**Remove them from the entry alone (1 without 2)** and the opposite half fires,
`reveal/delivery.mjs:214-225`:

> `delivery: /robots/<base> is a picture of the objects at a PUBLIC address and
> no Record entry delivers it. Nothing publishes until the Record delivers it —
> move the file to public/held/robots/<base>…`

**One edit alone turns `reveal:check` and `reveal:day` red six times over. The
pair is the unit.** This is the pull-back rule (H2) enforced structurally:
*"NOTHING PUBLISHES UNTIL THE RECORD DELIVERS IT"* —
[`docs/canon/09-PUBLISHED.md`](canon/09-PUBLISHED.md#pull-back), READ.

**A THIRD THING THAT LOOKS LIKE A SHORTCUT AND IS NOT.** Rewriting the entry's
`img` values to `/held/robots/manual/…` while leaving the files where they are
does **not** hold them. `publicPlacements()` normalises both forms back to the
public path — `reveal/delivery.mjs:178-187`, READ — and the schedule would then
key on the `/held/…` string while the worker tests `url.pathname`, which is
`/robots/…`. **The lookup would miss and the refusal would never fire.** The
prefix in the Record says where the file is parked, not whether it is held.

### 3.3 · The registers that would have to be regenerated with the move

These are derived, not authored. They are named because a move that skips them
leaves the tree inconsistent, not because they are separate decisions.

| file | why it moves | regenerated by |
|---|---|---|
| `provenance/asset-table.json` | one row per FILE, keyed by `repo:path`; six `path`/`id`/`ref` values change | `npm run assets:scan` |
| `provenance/assets.json` | rows keyed by `ref`; six refs change | `provenance/assets-declare.mjs` |
| `reveal/ledger.json` | `record.003.assets` holds six uids resolved from public refs | `npm run reveal:build` |

**The uids survive the move by design** — `reveal/ledger.json` `_assets`, READ:
*"The uid survives a rename; the path does not"*, with content-carry taking a
candidate only when its own file is absent from disk. A move with unchanged bytes
is exactly the case that note describes.

### 3.4 · What does NOT have to change

- **`src/worker.js`** — the refusal already covers `/held/` via `STAGE_DIRS` and
  covers the schedule via §1. No new code.
- **`wrangler.jsonc`** — `run_worker_first` is already `["/*"]`.
- **`src/data/artists/record-epoch.js`** — no date moves.
- **`reveal/placement.mjs`** — `STAGE_PREFIX` and `GOVERNED_PREFIX` already
  describe the destination.

---

## 4 · WHAT ELSE MOVES

### 4.1 · If the date were moved instead (the route §3 rejected)

**`RECORD_EPOCH` is one constant and every entry derives from it.** RUN:

```
1 2026-09-07   2 2026-09-08   3 2026-09-09   4 2026-09-10   5 2026-09-11
```

Moving it moves **all five Record entries, both datelines, the wing-open date and
the seventh picture** — `src/lib/wing-open.js:21-27` and `src/routes/WbHome.jsx:88`
derive from the same constant, READ. It has been moved twice on that basis
(Ruling C, Ruling D) and each time all seven scheduled paths re-dated with it.
**This is why the packet's "do not move a date" and "keep the six behind the
door" cannot be satisfied by the same edit.**

### 4.2 · If the §3.2 pair were made — what else goes red, proved rather than asserted

**Baseline first. RUN, all four gates green today:**

```
npm run reveal:check   → CHECK: PASS  (11 clauses, including
                          "nothing publishes until the Record delivers it")
npm run reveal:day     → to place 0 · to pull back 0 · "Nothing to move."
npm run docs:numbers   → PASS — 11 published claim(s) checked in 8 document(s)
npm run door:check     → PASS — control 200, held sample 404, open false
```

`reveal:day` counts **152 governed pictures — 15 public, 137 behind the door, 0
to place, 0 to pull back.** RUN. That zero/zero is the proof that the tree and
the Record currently agree; it is the number the §3.2 pair would have to leave at
zero/zero.

**What the pair moves, each traced to the line that reacts:**

| what | reacts | why |
|---|---|---|
| `reveal:day` counts | **15 public → 9; 137 held → 143** | the six change side of the door — `reveal/day.mjs:176-177` |
| `npm run day:proof` | **would go red** | it diffs the landed entries against `docs/dictation-20260807/record-draft.json`, which carries the six `img` values at lines 86-127 — `tools/dictation/day-proof.mjs:64`. The draft is Mike's words; the landed entry would no longer match it. |
| `npm run record:land --write` | **would accept the edit** | every entry now carries zero comment blocks — `src/data/artists/robots-record.js:380-381`, READ. This was NOT true before `C-day2` closed on 2026-08-26. |
| `docs/canon/07-MANUAL.md:93-95` | **prose goes stale** | it lists the three written paragraphs as *"delivered as"* those files |
| `docs/canon/09-PUBLISHED.md:248-255` | **prose goes stale** | *"THE ATTACHMENTS — the first pages of the manual any visitor has seen"* |
| `docs/canon/06-PORTAL.md:14`, `:389` | **prose goes stale** | both name the files as published in Record 003 |

**What does NOT move, proved:**

- **No other picture.** The six appear in exactly one `assets` array. RUN — the
  five entries' arrays are `[]`, `[]`, the six, `["/robots/portal/qc-101-a.webp"]`,
  `[]`. Nothing else in `src/` references them: `grep -rn "robots/manual" src/`
  returns **six lines, all in `robots-record.js`** (549, 551, 558, 560, 567, 574).
  RUN.
- **No other entry.** Entries 1, 2 and 5 name no assets at all; entry 4 names only
  the portal picture. RUN.
- **No dateline.** Datelines derive from `entry.date`, and no date is touched —
  `src/lib/record-model.js:83-91`, READ.
- **`docs:numbers` stays green.** Its eight documents are `CLAUDE.md`,
  `OPERATIONS.md`, three archive files, `OPEN_ACTIONS.md`, `BACKLOG.md` and
  `STATE.md` — `tools/numbers-gate.mjs:66-116`, READ. None of its eleven claims
  is a count of what is public.
- **`door:check` stays green.** It measures only the four directory prefixes; six
  more files under `public/held/robots/` would be six more files it does not
  sample.
- **The `61` in M61 is untouched either way** — see the F4 filing in §6.

---

## 5 · THE SEVENTH PICTURE — `/robots/portal/qc-101-a.webp`

**It shares every piece of machinery in §3, and differs only in directory and
day.**

| | the six | the seventh |
|---|---|---|
| named by | Record entry `no: 3` | Record entry `no: 4` |
| day | 2026-09-09 | 2026-09-10 |
| the entry's `assets` array | `reveal/record-entries.mjs` `entries()` | the same |
| baked into | `__WB_RECORD_ASSETS__`, `vite.config.js:613-614` | the same |
| refused by | `src/worker.js:673-680` | the same |
| governed tree | `GOVERNED_PREFIX = "/robots/"` | the same |
| two-way delivery rule | `reveal/delivery.mjs:189-294` | the same |
| behind a directory door | **no** | **no** |
| covered by `door:check` | **no** | **no** |

**It is the seventh row of one table, not a separate mechanism.** RUN, §2.2: it
is `WITHHELD` on 2026-09-09 and released on 2026-09-10, by the same string
comparison.

**Consequence for §3.** Anything done to the six under mechanism B leaves the
seventh untouched — different entry, different directory, its own row in the
schedule. Anything done under mechanism A (moving the date) takes the seventh
with it, because there is one epoch. **The two mechanisms differ in blast radius,
and the seventh picture is the thing that makes the difference visible.**

`src/worker.js:648-651` already records this — READ: *"Six became seven on
2026-08-21 when Mike back-posted `qc-101-a` onto Record 004 — this note went on
saying six for three days and nothing reported it, **because no gate counts these
rows**."* **That is still true. Nothing counts the schedule's rows.**

---

## 6 · THIS PACKET ENDS HERE

**No part of the §3 change was prepared, staged or written.** No file that
publishes was touched, no date was moved, and the working tree carries only this
report and the three separate filings the round asked for:

- **F1** filed as a lead line in `docs/canonical/OPERATIONS.md` §8.
- **`docs/canon/BELL-103.md:256`** corrected to agree with
  `docs/canon/09-PUBLISHED.md:255`, with the correction date recorded.
- **F4** filed at `docs/canon/07-MANUAL.md` §1, where the manual's extent is
  stated.

**Two things found while filing those, flagged and not fixed:**

- **`docs/canon/BELL-103.md:257-258` are stale in the same way line 256 was.**
  Line 257 calls Record 003's fourth attachment a *"working-tree change"*; it is
  committed. Line 258's verdict — *"A visitor has seen it: NO"* — is still
  correct, but its stated evidence, *"Neither file is committed or deployed"*, is
  false: both are committed and deployed. **The right evidence is §1's refusal,
  not the commit state.** The packet named line 256 and this report did not widen
  the edit past it.
- **`docs/ASSET_TIMELINE.md:256` and `:271` still say 61 pages.** They are dated
  narrative rather than a live claim, and `docs:numbers` does not read that file.

---

## 7 · EVERY COMMAND RUN

Read-only throughout. Nothing in this list writes to the museum tree.

```
npm run door:check
npm run reveal:check
npm run reveal:day
npm run docs:numbers
npm run ops:size
node -e "… todayInRecordTz(); assetWithheld(sched, p, day) for four days × seven paths"
node -e "… recordDay(1..5)"
git show 3ccbad9:src/data/artists/record-epoch.js
git show 3ccbad9:src/data/artists/robots-record.js
git show 3ccbad9:src/worker.js
grep -rn "robots/manual" src/
```

Everything else is READ, at the file and line named beside it.
