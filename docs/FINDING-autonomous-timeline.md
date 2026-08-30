# FINDING — everything that fires on its own before 2026-09-14

**Round:** the autonomous timeline, read-only packet. **Written:** 2026-08-29.
**Scope:** READ ONLY. Nothing that publishes was changed. Every defect is
flagged and none is fixed.
**Repository:** `C:\AI\Projects\weird-baby-museum`, branch `main`.

**Method notation.** **READ** — the tree states it, at a named file and line.
**RUN** — a command or an in-memory evaluation was executed and this is its
output.

> **THE ANSWER TO §4 IS NOT NOTHING.** Eight mechanisms fire on a clock in this
> window and seven are accounted for in writing. The eighth is **one const with
> four consumers, and only two of the four were ever traced.** §5.

---

## 1 · THE MECHANISMS

Every one of these changes what a visitor sees, on a date or a clock, with
nobody in the loop. **The whole set is driven by ONE date literal** — RUN,
`grep` for a `20NN-NN-NN` literal in live (non-comment) code under `src/`
returns `src/data/artists/record-epoch.js:116`, `RECORD_EPOCH = "2026-09-07"`,
and a table of past YouTube publication dates in `worth-a-listen.js` that
nothing compares to today.

| # | mechanism | keyed on | the line that decides it |
|---|---|---|---|
| **M1** | **The museum's day** — turns at **17:00 America/New_York**, not midnight | a clock | `reveal/record-clock.mjs:104-113` (`todayInRecordTz`); read once per request at `src/worker.js:1039`; injected as `__WB_TODAY__` / `__WB_NOW__` at `src/worker.js:543-545` |
| **M2** | **Record entry visibility** — an entry appears on its own day | a day string | `reveal/record-clock.mjs:179-188` (`entryVisible` / `visibleEntries`); client `src/lib/record-clock.js:139-140`; applied `src/data/artists/robots.js:409`; worker `/api/record` `src/worker.js:967` |
| **M3** | **The wing door** — `/robots` exists or does not | the Record having an entry | worker `src/worker.js:564-567` (`wingOpenOn`, against `__WB_RECORD_FIRST_DAY__`, `vite.config.js:623-624`); client `src/lib/wing-open.js:55-56` (`ROBOTS_OPEN`) |
| **M4** | **The share cards** — two `<meta>` descriptions are overwritten while the wing is shut | `wingOpen` | `src/worker.js:549-556`, with `CARD_WHILE_SHUT` at `:483-485` |
| **M5** | **The asset schedule door** — a governed picture 404s until its day | a day string | `src/worker.js:673-680`; `reveal/record-clock.mjs:219-223` (`assetWithheld`); table baked at `vite.config.js:613-614` |
| **M6** | **The lobby countdown** — counts to the opening instant, then removes itself | an instant | `src/routes/WbHome.jsx:88` (`DOORS_OPEN_AT = recordVisibleAt(RECORD_EPOCH)`), `:90-100`, `:131` |
| **M7** | **The Record index banding** — the index groups by month | an **entry count** | `src/lib/record-model.js:149-158` (`shouldBand`, `minEntries = 14`, and more than one month) |
| **M8** | **The television join** — a live channel seeks to the wall clock | a clock | `src/routes/robots/feed-control.js:53-59` (`televisionStart`) |

**Deliberately not a mechanism, and written down as such:** the guest book's
*"first 100"* — `src/routes/WbHome.jsx:1198-1200`, READ: *"Nothing here counts
to 100 — 'the first 100' is a promise in his copy, and what happens AT 100 is
his own TBD, deliberately not built."*

**Checked and excluded:** `era-config.json` is read only by `tools/` and is not
in the bundle (RUN, `grep`). `public/robots/twin.html` has one clock read and it
is `performance.now()` for animation, not a date (RUN). `/api/visits` and
`/api/guestbook` stamp with `datetime('now')` but only ever change when a person
acts — `src/worker.js:756`, `:786`. `WbAdmin.jsx`'s cookie-expiry and build-time
readouts are behind the admin key.

---

## 2 · WHAT EACH ONE DOES, DAY BY DAY

**RUN**, driving the museum's own functions across the window:

```
RECORD_EPOCH = 2026-09-07 | __WB_RECORD_FIRST_DAY__ = 2026-09-07
day         wing  entries  assets released that day
2026-08-30  shut   0 []
2026-08-31  shut   0 []
2026-09-01  shut   0 []
2026-09-02  shut   0 []
2026-09-03  shut   0 []
2026-09-04  shut   0 []
2026-09-05  shut   0 []
2026-09-06  shut   0 []
2026-09-07  OPEN   1 [001]
2026-09-08  OPEN   2 [001 002]
2026-09-09  OPEN   3 [001 002 003]   manual/scan-07-a.webp manual/scan-07-b.webp
                                     manual/scan-11-a.webp manual/scan-11-b.webp
                                     manual/scan-31-a.webp manual/marked-01-a.webp
2026-09-10  OPEN   4 [001 002 003 004]   portal/qc-101-a.webp
2026-09-11  OPEN   5 [001 002 003 004 005]
2026-09-12  OPEN   5 [001 002 003 004 005]
2026-09-13  OPEN   5 [001 002 003 004 005]
2026-09-14  OPEN   5 [001 002 003 004 005]
```

### 2.1 · Now → 2026-09-06: **nothing moves at all**

Eight days in which no mechanism crosses a threshold. The wing is shut, no
entry is visible, all seven governed pictures 404, and both share-card
descriptions are being overwritten on every HTML response. M6 ticks down once a
second and M8 keeps seeking a video to the wall clock; neither crosses anything.

### 2.2 · **2026-09-07, 17:00:00 America/New_York** — the one hour that matters

Six things move on the same tick of `todayInRecordTz`, and none of them is a
deploy:

| what | from → to | mechanism |
|---|---|---|
| **The museum's day** | `2026-09-06` → `2026-09-07` | M1 |
| **Record 001** | absent → on the glass | M2 |
| **The wing** | `/robots` renders the lobby → renders the wing | M3 |
| **`__WB_RECORD_FIRST_DAY__` test** | `"2026-09-07" >= "2026-09-07"` false → true | M3 |
| **The share cards** | `<meta name="description">` and `og:description` overwritten with `CARD_WHILE_SHUT` → **left alone**, so `index.html`'s own wording (which names the MGK robots) goes live | M4 |
| **The countdown** | ticking → **removes itself**, `remainingAt` returns `null` and the component returns `null` | M6 |

**Two things do NOT move that hour** and both are correct: no asset is released
(the first is two days later, M5), and the index does not band (M7 — five
entries against a floor of fourteen).

**Nothing is deployed, and nothing needs to be.** `reveal/record-clock.mjs:9-21`
is the ruling: the commit is a fixed input, the bundle is byte-identical every
day, and the worker plays it back against request time.

### 2.3 · 2026-09-08 → 2026-09-11: one entry a day

Records 002, 003, 004, 005 at 17:00 on each. **On 2026-09-09 the six manual
scans stop being 404 and start being 200** — [`FINDING-manual-scans.md`](FINDING-manual-scans.md)
and [`FINDING-manual-hold-path.md`](FINDING-manual-hold-path.md) are that day in
full. **On 2026-09-10 `/robots/portal/qc-101-a.webp` follows.**

### 2.4 · 2026-09-12 → 2026-09-14: nothing moves again

**The Record runs out after 005.** No sixth entry exists, so from 2026-09-12 the
museum is static again until somebody writes one. `shouldBand` still cannot fire.

---

## 3 · THE BRIDGE TO PRODUCTION

`docs/DEPLOYED.md` — live commit **`3ccbad9`**, full sha
`3ccbad9fb0d98f1ae05c03e1ca53fabfcc99e7db`, stage **launch**, deployed
**2026-08-29T21:36:59.254Z**. READ. `npm run door:check` independently reported
`stage="launch"` on the wire this session — RUN, in
[`FINDING-manual-hold-path.md`](FINDING-manual-hold-path.md) §2.1.

**RUN — every input to the bundle, diffed between the deployed commit and HEAD:**

```
git diff --stat 3ccbad9 HEAD -- src/ public/ vite.config.js index.html wrangler.jsonc reveal/
(no output)
```

**Empty. Every line cited in §1 is byte-identical in the deployed commit.**

**The whole diff since the deploy, for completeness** — RUN,
`git diff --name-only 3ccbad9 HEAD` over all nine commits: eleven files under
`docs/`, `tools/door-probe.mjs`, `tools/dictation/emit-record-entries.mjs`, and
`package.json` — whose only change is one added line, `"door:check": "node
tools/door-probe.mjs"`. **Not one of them reaches the bundle**, and the two
`tools/` files are run by a person, never by the worker.

**THIS IS AN INFERENCE FROM MATCHING INPUTS, NOT A MEASUREMENT.** Nothing in
this round observed production doing any of the things in §2. What is
established is that the sources the live worker was built from are the sources
described here; that the built artifact behaves as its sources say is the
ordinary assumption a build makes, and it is stated as an assumption. The only
wire reading taken this session was `door:check`, which covers four directory
prefixes and none of the mechanisms above.

---

## 4 · WHAT NOBODY HAS LOOKED AT

**Seven of the eight mechanisms have a ruling, a finding or a row behind them.**
Named, so the eighth is not lost among them:

| mechanism | what accounts for it |
|---|---|
| M1 | `reveal/record-clock.mjs:52-57` — Mike's 17:00 ruling, 2026-08-17 |
| M2 | the Record's own design; `reveal/record-clock.mjs:5-21` |
| M3 | CH6 2026-08-12, ruled and written up at `src/lib/wing-open.js:1-42` |
| M4 | CH6 2026-08-12, `src/worker.js:475-482` — *"IT IS A HOLD, NOT AN EDIT"* |
| M5 | [`M61`](OPEN_ACTIONS.md#m61), plus two findings this week |
| M6 | `docs/MUSEUM_SITE_CHANGES_LOG-20260815.md` §14.3 — four options put to Ops, option 3 built |
| M7 | arithmetic: 5 entries against `minEntries = 14`. Cannot fire in this window |
| M8 | carried verbatim from `instrument-panel.jsx`; crosses no threshold in the window |

### 4.1 · THE ONE THAT IS NOT — `ROBOTS_OPEN` has FOUR consumers and only TWO were traced

`src/lib/wing-open.js:55-56` is a **module-load `const`**:

```js
export const ROBOTS_OPEN =
  !launched() || recordEntriesForToday(RECORD_ENTRIES).length > 0;
```

It is evaluated once, when the bundle loads, and **nothing re-evaluates it** —
RUN: no `setInterval`, no `location.reload`, no re-render path touches it. In a
tab left open across 2026-09-07 17:00 it holds `false` for as long as the tab
stays open.

**That fact is written down.** `docs/MUSEUM_SITE_CHANGES_LOG-20260815.md:550-554`,
READ: *"`ROBOTS_OPEN` is a `const` evaluated once at module load. A tab left open
across midnight holds the pre-launch value until it is reloaded."* Four options
were listed for Ops and **option 3 was built** — the counter removes itself and
leaves the copy beneath it standing.

**BUT THAT ANALYSIS TRACED THE CONST TO ONE CONSUMER.** It discusses only
*"which of the two lobby paragraphs draws"*. `ROBOTS_OPEN` has **four**:

| # | consumer | what a stale `false` does at 17:00 | traced? |
|---:|---|---|---|
| 1 | `src/routes/WbHome.jsx:1211` — the lobby note | keeps *"We're not open yet."* on the glass | **yes**, 2026-08-15 §14.3 and again in `MUSEUM_HANDLES_AND_LOBBY_LOG-20260828.md:85-97` |
| 2 | `src/routes/WbHome.jsx:1001` — the `\Robots` directory row | **the row is absent; the wing has no door on the board** | **NO** |
| 3 | `src/App.jsx:160` — the `/robots` route | **routes to `<WbHome />`; the wing renders as the lobby** | **NO** |
| 4 | `src/App.jsx:173` — the `/robots/record` route | **same; the Record's own address renders the lobby** | **NO** |

**SO THIS IS WHAT HAPPENS IN THAT TAB AT 17:00 ON OPENING NIGHT.** The countdown
reaches zero and removes itself, correctly, on the museum's clock. The worker
begins serving the wing to every new request and stops rewriting the share
cards. And in the tab that was watching the countdown: **there is no `\Robots`
row on the directory, `/robots` still renders the lobby, and the note still says
the museum is shut.**

**A visitor who watches the counter hit zero and then goes looking for the thing
it was counting to is the single most likely visitor at that hour, and they get
the lobby back.** A reload fixes it — every HTML response is `no-store`
(`src/worker.js:190-194`, `:523`), so a reload cannot serve a cached
pre-launch page. **Nothing tells them to reload.**

**There is no ruling, no finding and no open-action row on consumers 2, 3 or 4.**
RUN: `grep -rn "ROBOTS_OPEN" docs/OPEN_ACTIONS.md docs/BACKLOG.md docs/HANDOFF_next_session.md`
returns nothing; the seven dated round logs that mention it discuss the wing's
derivation and the lobby paragraph, and none of them reaches the directory row
or the router.

### 4.2 · AND THE 2026-08-15 ANALYSIS IS WRONG ABOUT THE OPTION IT RECOMMENDED

Same file, `:571-572`, READ:

> **Ops' note, not a ruling:** 1 and 3 are the only two that leave nothing stale
> on the glass, and 3 is the one that needs no new copy from Mike at all.

**Option 3 is defined four lines above as *"The counter removes itself and
leaves the copy beneath it standing."*** The copy beneath it is *"We're not open
yet."* **Option 3 is the one option that leaves something stale on the glass by
construction, and it is the one that was built** — on a recommendation whose
stated reason for choosing it is contradicted by its own definition.

Whether that is acceptable is a judgement about the lobby, and it is not made
here. What is reported is that the sentence which decided it does not survive
reading.

### 4.3 · Adjacent, and NOT part of this finding

`TODAY` (`src/lib/record-clock.js:100`) is a module-load `const` too, so the
same stale tab also cannot draw Record 001. That is the same mechanism reaching
the same tab, and it is subsumed: a tab whose wing is shut has nowhere to draw a
Record entry anyway.

---

## 5 · THE TIMELINE IS NOT FULLY ACCOUNTED FOR

**§4 is not nothing, so §5's alternative does not apply.**

Stated plainly: **eight mechanisms fire between now and 2026-09-14. Seven are
accounted for in writing. The eighth — the wing's own switch — was traced to one
of its four consumers, and the three that were missed are the directory row, the
`/robots` route and the `/robots/record` route.** They will change what a visitor
sees on 2026-09-07 at 17:00, in the tab most likely to be open at that moment,
with nobody in the loop and nothing behind them.

**Flagged, not fixed.** No ruling is offered on what any of the three should do;
the 2026-08-15 analysis put four options for one consumer and the same question
has not been put for the other three.

---

## 6 · EVERY COMMAND RUN

Read-only throughout. Nothing in this list writes to the museum tree.

```
git diff --stat 3ccbad9 HEAD -- src/ public/ vite.config.js index.html wrangler.jsonc reveal/
node -e "… entryVisible / assetSchedule / wingOpenOn across 2026-08-30 … 2026-09-14"
grep -rn "todayInRecordTz|recordVisibleAt|entryVisible|visibleEntries|assetWithheld|wingOpenOn|DOORS_OPEN_AT" src/
grep -rn "Date.now()|new Date(" src/
grep -rn "20[0-9][0-9]-[01][0-9]-[0-3][0-9]" src/            (live code vs comments)
grep -rn "Date.now|new Date(" public/robots/twin.html
grep -rn "ROBOTS_OPEN" src/ docs/
grep -rn "setInterval|location.reload" src/routes/WbHome.jsx src/App.jsx src/lib/wing-open.js src/lib/record-clock.js
```

Everything else is READ, at the file and line named beside it.
