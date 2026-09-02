# JOB 3 — THE CONTENT SCHEDULE: A DESIGN, NOT A BUILD

Read-only. Nothing in the repo was created or modified. This file is the only output.

**THE ONE DECISION THAT GATES THE BUILD:** this instrument must not be built unless the
same commit adds its §5 row in `docs/canonical/OPERATIONS.md`, its line in §9's
session-close ritual, and its card on the Ops desk. Job 1 found ~62 of 106 files in
`tools/` are stranded one-shot runners and `docs/CONTACT_SHEET.html` is a live generator
that **no governing doc names**. A report nothing tells anyone to run is the failure mode
here, not a bad table. If the three doc edits are not in scope, do not build the tool.

---

## 3a. THE TABLE

### File and format

```
content/schedule.mjs          the table. Authored by hand. No generated JSON twin.
```

**A new top-level directory, on purpose.** `provenance/` owns files, `reveal/` owns
revealable things on the museum's own walls. This owns **off-site posts**, which is a
third boundary. Putting it in `reveal/` invites exactly the merge that must never happen
(see §Boundary).

**Why an ES module and not JSON — three reasons, the third decisive.**

1. `reveal/week-one.mjs`, `week-two.mjs`, `arc-twelve.mjs`, `transfers.mjs` and
   `focus.mjs` are all authored data modules with no JSON twin, and `arc-twelve.mjs`
   states the rule in its own header: *"This is a data module for the same reason
   `week-one.mjs`, `week-two.mjs`, `transfers.mjs` and `focus.mjs` are: a list that lives
   inside a rendering function cannot be diffed, cannot be checked, and becomes the
   generator's opinion."* This table is that shape — a list nothing in `src/` renders.
2. The `_`-prefixed doc keys in `reveal/ledger.json` and `provenance/asset-table.json`
   exist **because JSON cannot hold a comment**. An `.mjs` header carries the same prose
   natively. The convention is honoured, not departed from — see below.
3. **JSON cannot write `recordDay(5)`.** A due date on the story clock must be an
   expression off `RECORD_EPOCH`, not a literal. `D1 2026-08-08` made the epoch **one
   constant** precisely because a second date literal prints *"Week 2 · Monday · Record
   001"* on day one with nothing reporting it. A JSON schedule would hard-code 90 dates —
   90 new copies of the epoch. This is the argument that settles the format.

**The `_` convention is kept.** The module exports a `DOC` object whose keys mirror the
JSON tables' `_` keys (`DOC.states`, `DOC.posted`, `DOC.refs`, `DOC.brand`, …), so the
report and the gate print the field documentation from the same strings a reader of the
file sees. One declaration, every reader — the `reveal/record-shape.mjs` pattern.

**No writer, and no guard.** `ledger-declare.mjs`'s guard exists to catch a declarer
drifting from the JSON it writes (M99's shape). With no generated twin there is nothing to
drift from, so no guard is needed and none should be added.

### The exact field list

| field | allowed values | notes |
|---|---|---|
| `id` | `wb-NNNN` · `rb-NNNN` · `mu-NNNN` | Minted once, never reused, never renamed. Brand prefix so a row's brand is legible in a diff. |
| `brand` | `WB` · `ROBOTS` · `MUSIC` | **Exactly three. There is no `FOUNDATION` value and its absence is the enforcement.** |
| `platform` | `IG` · `TIKTOK` · `YT` · `SHORTS` · `X` · `FB` · `THREADS` · `REDDIT` · `EMAIL` · `SITE` | Ops' vocabulary; the repo has none. Every one has **no handle on file** today — M60. |
| `type` | `STILL` · `SET` · `SHORT` · `LONG` · `TEXT` · `LINK` · `SOUND` | Ops' vocabulary. `SHORT` is a CUT and **this repo cannot see whether one was made** (`tools/surfacing.mjs` says so of itself). |
| `due` | ISO `"YYYY-MM-DD"` · `null` | `null` = handed in, not scheduled. Story-clock rows authored as `recordDay(n)`, never a literal. |
| `what` | one line, required | Ops'. What the post is. |
| `copy` | string · `null` | The words that go out. |
| `rail` | `OPS` · `VERBATIM` · `MIKE-NAMED` | The house's three marks. **A `VERBATIM` string may be deleted but never reworded.** |
| `refs` | array of `reveal/ledger.json` row ids and/or asset-table `uid`s; `[]` allowed | Validated. An unknown id fails the gate — the `resolve()` discipline. |
| `posted` | `null` · `{ at: "YYYY-MM-DD", url: string\|null, note: string }` | **The only field that costs hand work.** See 3d. |
| `note` | free text | Ops'. Nothing in this file reaches a visitor, so Doctrine 11 does not bind it — stated so no future round strips it. |

Eleven authored fields. **There is no `state` field, and that is the answer to the hard
constraint.** Mike never checks anything off; Ops must not have to either. State is
derived from `due`, `posted` and the file's own git mtime:

| derived state | rule |
|---|---|
| `MET` | `posted` is non-null. |
| `DUE` | `due` === today. |
| `PLANNED` | `due` is in the future. |
| `MISSED` | `due` has passed, `posted` is null, **and the file's last commit is later than `due`** — Ops looked at the table after the day and it still says nothing went out. A real miss. |
| `UNKNOWN` | `due` has passed, `posted` is null, and the file has **not** been touched since — the report cannot tell a missed post from an unmaintained table, so it says so. |

`UNKNOWN` is the whole honesty of the design. Without it an untended table reads as *90
missed posts*, which is a report lying about a tool nobody ran. The staleness is derived
from `git log -1 --format=%cI -- content/schedule.mjs` — **zero hand cost, no `checked`
field, nothing for anyone to tick.**

**There is no `DROPPED` state and no `dropped` field.** Doctrine 24: a row Mike rules gone
**leaves the file** and is named once in that round's log. A struck row carried as a closed
state is the thing that doctrine deleted 415 lines of `OPEN_ACTIONS.md` to stop.

### Worked rows — one per brand

```js
import { recordDay } from "../src/data/artists/record-epoch.js";

export const ROWS = [
  /* ── ROBOTS ─ week 1, Friday. THE FRIDAY FORMULA day: "One password was
        short enough." The post goes out after the entry, never before it. */
  { id: "rb-0004", brand: "ROBOTS", platform: "IG", type: "STILL",
    due: recordDay(5),                       // 2026-08-21, derived, no literal
    what: "The first zip opens at four o'clock — one still of the screen, and the Record's own line.",
    copy: null,
    rail: "OPS",
    refs: ["record.005", "A-ae718e7ac8"],    // ledger entry + the cover it shows
    posted: null,
    note: "Waiting on the entry landing. Ref A-ae718e7ac8 is behind the stage door until day 5." },

  /* ── WB (house) ─ opening day. Not on the story clock; the museum's own day. */
  { id: "wb-0001", brand: "WB", platform: "SITE", type: "LINK",
    due: "2026-08-17",
    what: "The museum opens. One link to the Lobby, no claim beyond that.",
    copy: "A museum of weird things worth keeping.",
    rail: "VERBATIM",                        // his index.html line; never reworded
    refs: ["route.lobby"],
    posted: null,
    note: "" },

  /* ── MUSIC ─ handed in, not scheduled. `due: null` is a legitimate state. */
  { id: "mu-0002", brand: "MUSIC", platform: "YT", type: "SOUND",
    due: null,
    what: "One song from the Weird.Baby Music wing, with the wing's own cover.",
    copy: null,
    rail: "OPS",
    refs: ["route.wb"],
    posted: null,
    note: "Mike handed the file in; no date, no caption. Nothing invented (Doctrine 12)." },
];
```

---

## 3b. THE REPORT — HTML, and I argue against the other two

```
npm run content            → docs/CONTENT_SCHEDULE.html    (the report)
npm run content -- --log   → also appends one dated line to docs/CONTENT_LOG.md
npm run content:gate       → structural checks, exit 1 on a fault
```

`tools/content-schedule.mjs`. Two npm scripts, one desk card, nothing else.

**HTML, because the delivery channel already exists and it is the only one Mike can
open.** The desktop shortcut `Weird.Baby Ops.lnk` → `docs/OPS_DESK.html` is the one door
he uses; eight instruments are already behind it; a ninth card costs one entry in
`INSTRUMENTS` in `tools/ops-desk.mjs`. A `.html` in `docs/` opens on a double-click — and
a `.js` or `.lnk` **runs** instead of opening, which rules out anything else double-
clickable. The repo's own division is already this: **terminal output is what Ops reads at
a gate** (`surfacing`, `reveal`, `assets`), **HTML in `docs/` is what Mike opens.** This is
not a departure; it is the existing rule applied.

**Against Excel — four reasons, the second fatal.** (1) There is no xlsx library in the
tree; `package.json` has three runtime dependencies and adding a spreadsheet writer for
one report is disproportionate, and CSV instead re-parses dates by locale on open.
(2) **A spreadsheet is editable, so the day it exists it is a second source of truth free
to disagree with `content/schedule.mjs`** — the exact shape §5's THE DAY'S STEP row
rejected: *"a dated manifest was rejected on DUPLICATION rather than on the clock: it is a
second source of truth about what is public, sitting beside the Record and free to
disagree with it, and this repository has paid for that shape four times."* (3) Excel is
where Mike **writes** — `RECORD_days-2-to-6.xlsx`, one tab per day, per the Ops desk's own
Record card. Handing him a read-only report in his writing application invites him to type
in it, and nothing reads it back. (4) A grid of glyphs is worse in a cell than in a table
cell you can style.

**Against terminal — three reasons.** (1) It cannot be double-clicked and cannot be a card
on the launcher; it requires him in a shell, in the repo, typing. (2) **The grid dies at
80 columns.** What Mike asked for — *"a grid showing what has been met"* — is a
two-dimensional matrix, and terminal wrapping destroys a matrix in a way it does not
destroy a list. (3) Scrollback is not "on demand": he asked for past, present and future
at once, which is a page you scan, not a stream you scroll past.

### The page, in order — and there is no preamble (Doctrine 25)

1. **TODAY.** The rows due today, then anything `MISSED` or `UNKNOWN`. If there is
   nothing: one line, *"Nothing due today."* This is the first thing on the page because
   it is the only part that changes what anyone does next (Doctrine 26).
2. **THE GRID.** Rows = dates that carry at least one row; columns = the three brands.
   Cell glyphs: `●` MET · `◐` DUE · `○` PLANNED · `✗` MISSED · `?` UNKNOWN · blank =
   nothing scheduled. **One line of inline chips as the legend, under the heading, not
   above the grid** — a legend is not a briefing and the grid is unreadable without it.
3. **PAST** — most recent first, each row printing its permalink where `posted.url` has
   one.
4. **FUTURE** — chronological. Rows with `due: null` sit in their own short block at the
   foot of it, labelled *handed in, no date*.
5. **Footer:** generated timestamp · **the table's own git mtime** · `npm run content` ·
   a link to the field docs. "Current" is a property of the generator, never of the page —
   the Ops desk's rule (3), stated on the card and again here.

Facts the page prints and does **not** derive a ceiling from: posts per week per brand.
`reveal/focus.mjs` is explicit that PRECIOUS divides into weeks and DUMP divides into
nothing, and that Ops never derives a bucket. A social cadence ceiling is the same
judgement and is Mike's. Print the count, draw no bound.

### `content:gate` — the checks

Fails (exit 1): an unknown id in `refs`; a duplicate `id`; a value outside a declared set;
a `due` that is not a real ISO date; `rail: "VERBATIM"` with `copy: null` (a gold mark on
no words); **a `ref` resolving to anything under `route.foundation` / `face.*` in the
Foundation** — Foundation is never advertised, and that constraint becomes a check rather
than a memory; and **a `due` earlier than the day the museum itself publishes the
referenced asset**, computed through `assetSchedule()` in `reveal/record-clock.mjs`. That
last one is the only reason the join is worth having: it stops a post revealing an artifact
the museum has not shown, which is H2's pull-back rule enforced on the one surface that
currently escapes it.

Warns, never blocks (Doctrine 22): a `platform` with no handle in the module's `ACCOUNTS`
map — **empty today, all ten platforms** — and a `due` past day 90.

---

## 3c. HOW IT SURVIVES A SESSION ENDING

Five mechanisms, in the order they catch a lapse:

1. **The table is a committed file.** `content/schedule.mjs` in git. A chat ends; a commit
   does not. Every fact the report prints is re-derivable from the file alone.
2. **`content:gate` runs beside the other gates in §9.** The packet is the only clock this
   repository has — `surfacing.mjs` says so of itself and `reveal:day` says it again. A
   session that never opens the schedule still gets told when it is structurally broken.
3. **A §5 row in `docs/canonical/OPERATIONS.md`.** §6's orientation protocol makes §5 the
   first thing a fresh session reads. Without the row the instrument is invisible to the
   next session, which is exactly how `docs/CONTACT_SHEET.html` became a live tool nobody
   is told to run.
4. **A card on the Ops desk**, with its own mtime and its own rebuild command, and the
   desk's `fs.statSync` rule means a missing file draws a red card and no link.
5. **`docs/CONTENT_LOG.md`** — one dated line per `--log` run, the `SURFACING_LOG.md`
   pattern. It is what turns *"three met this week"* into a trend, and it is the second
   place (after git mtime) a future session can see when the table was last honestly
   touched.

The cautionary case is `docs/OPEN_ACTIONS.md`: hand-maintained markdown whose **SHORT LIST
is derived by hand and nothing derives it** — four instances in two rounds of a row
closing and leaving while the short-list line that pulled it out stayed behind. This design
avoids it by having **no hand-derived summary at all**: every heading, every count, every
grid cell and every state on `CONTENT_SCHEDULE.html` is computed from `ROWS` at generation.
There is nothing in the report a human types, so there is nothing in it that can go stale
independently of the table.

---

## 3d. WHAT IT COSTS AND WHO PAYS

**Ops pays, by hand, and there is exactly one field that costs anything.**

| work | who | when | cost |
|---|---|---|---|
| Authoring future rows | Ops | when Mike hands content in | ~10 min a week. Cheap; it is transcription of a decision already made. |
| **Recording `posted`** | **Ops, by hand** | **after each post goes out** | **~1 min per post, and nothing in this repository can do it.** |
| Running the report | Ops | at session close, one command | seconds |
| Anything at all | **Mike** | — | **nothing beyond handing content in, which he already does.** |

**Say the unwelcome half plainly: nothing in this repo can see a platform.** There is no
API key, no handle (M60: *"nothing in this repository names a Weird.Baby account on any
platform"*), and `tools/surfacing.mjs` already records the general form of this limit —
*"IT DOES NOT COUNT SHORTS, and cannot. A short is a CUT … nothing in this repository can
see whether one was made. The report says so in its own output rather than printing a zero
that would read as 'none were made'."* `posted` is the same class of fact as `verdict` and
`bucket`: a JUDGED field, hand-written, that no scan may ever fill.

**So the honest failure mode is designed in rather than argued away.** If Ops stops
recording, the report does not silently report failure — every un-recorded past row reads
`UNKNOWN`, the grid shows `?`, and the footer prints the table's git mtime beside the
generation time. **A stale table announces its own staleness.** That is the only defence
available and it is worth more than a fabricated `MET`.

**And the strandedness verdict, since I am proposing tool number 90 in a directory with
~62 dead runners:** this is worth building only because it is *one* data file, *one* tool,
*two* npm scripts and *three* doc edits, and because the alternative — a hand-maintained
section in `OPEN_ACTIONS.md` — is the repo's own documented failure. If the doc edits slip,
this becomes number 63.

---

## THE BOUNDARY WITH JOB 4 — AND WHETHER THE TABLES EVER JOIN

| question | `reveal/ledger.json` + `provenance/asset-table.json` (Job 4) | `content/schedule.mjs` (Job 3) |
|---|---|---|
| subject | what the **museum's own walls** show, and whether a visitor can reach it | what goes out on **platforms this repo cannot see** |
| governed by | the pull-back rule, `WB_STAGE`, `reveal:day`, the two held prefixes | nothing mechanical — a human posts it |
| authority on | files, revealable things, reveal state | posting intent and posting fact |

**They join ONE WAY ONLY: `refs` points from a content row into the ledger, and nothing
points back.** No ledger row gains a field, no asset row gains a field. The join is
resolved and validated at gate time (the `resolve()` discipline), and it earns its keep by
one check: a post may not be dated before the day the museum publishes what it shows.

**They must never merge.** §5's THE OPS INSTRUMENTS row already sets the rule for this
shape: *"an instrument that computes a third answer is a third copy"*, and the same row
records that the existing ledger↔asset join is **nine rows in a 166-row ledger against a
253-row asset table** — a partial join that says so on the page rather than drawing the
unjoined rows as joined. This table's join will be sparser still. **A content row with
`refs: []` is normal, not a fault**, and the report must never print an empty ref column in
a way that reads as *unclassified* when it means *not joined* — the same mistake
`reveal:day` deliberately avoids by drawing no transfer class.

---

## WHAT I COULD NOT DETERMINE

1. **Whether "Worth A Listen" sits under Weird.Baby Music or is a fourth thing.** The
   kickoff says WAL sits under Music. `src/routes/WbHome.jsx:647` prints **Mike's list,
   verbatim**: *"Weird.Baby Robots · Weird.Baby Music · Other Music Worth a Listen ·
   Information Booth"* — three wings, with WAL separate, at its own route `/wal`. The
   design above uses three brands with WAL posts filed under `MUSIC`; if WAL is a fourth
   brand the enum needs a fourth value and the grid a fourth column. **This is a kickoff
   anchor that disagrees with the tree** (§7 rule 7).
2. **Which platforms exist.** No account on any platform is named anywhere in the repo
   (M60, still open). The ten-value `platform` enum is Ops' guess at a candidate list and
   `ACCOUNTS` is empty. The gate warns rather than blocks so the table is usable before the
   answer arrives, but no row can be verified as postable today.
3. **Whether social posting is in-story or real.** Register `S-a` asks the same question of
   Mike's launch report and is unanswered. If a Robots post is *in-story* — the museum's
   voice, on the story's clock — then Doctrine 21's "everything in the form is story" may
   reach these captions, and Doctrine 11 turns on it. If it is the house advertising a
   website, it does not. The `rail` field records authorship either way, but the answer
   changes what Ops may write into `copy` at all.
4. **`RECORD_EPOCH`'s location, as given, is stale.** The kickoff names
   `src/data/artists/robots.js`; it is now `src/data/artists/record-epoch.js:49` (robots.js
   imports it). The worked example above uses the real path. Noted because a build that
   imports the named file would import nothing.
5. **Whether the report should include the Record's own entries as rows.** The Record is
   on-site publishing and belongs to Job 4's tables, so I excluded it — but Mike asked for
   *"the schedule past, present and future"* without saying whether an entry landing counts
   as scheduled content. Including it means reading `robots-record.js` read-only and drawing
   its days as a fourth, uneditable column; that is one function and no new field, and it is
   a call rather than a finding.
6. **The `--log` cadence.** `surfacing`'s log is one line per packet. Whether a content log
   line is per packet, per posting day, or per week is a rhythm question, and `M46` (*"How
   often should a SHORT come out? A number and an owner."*) is the open row that shows this
   repo does not have the answer.

## WHAT NEEDS MIKE

1. **The accounts.** One handle per platform he actually holds — or one word that there are
   none yet. Until then every row in the table names a destination that does not exist.
   This is `M60`, already open, and this design is the second thing now waiting on it.
2. **One word: is "Other Music Worth a Listen" its own brand for posting, or does it post
   under Weird.Baby Music?** Three columns or four. His own lobby list says separate; the
   brief says under Music.
3. **One word: are Robots posts in the story's voice, or the house's?** It decides whether
   Ops may draft a caption at all, or whether every `copy` field waits for him. Related to
   register `S-a`.
4. **Nothing else.** He hands content in and never marks anything. The design has no field
   he fills, no box he ticks, and no page he has to visit — and if he never opens
   `CONTENT_SCHEDULE.html` at all, nothing about it breaks.
