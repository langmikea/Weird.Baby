# CLOSE THE LAUNCH SURFACE
2026-08-12 · write packet · **not committed, not pushed, not deployed**
HEAD at start: `8e67b5b`.

---

## THE TWO PRECONDITIONS THAT DIFFERED

**D's photograph does not exist.** `HR_Photo_TAKEN_BY_MIKE.jpg` returns nothing,
and neither does `HR_Photo*` or `*TAKEN_BY*`, across Downloads, OneDrive,
Pictures, Desktop and all of `C:\AI`. Every `hunter`-named file on the machine is
a March/April document. **Section D is not done** — Mike's ruling: skip it, do the
rest. Same shape as S2's launch report: an instruction that assumes its material
is in the tree.

**A1 could not work as written.** `robots.js` imports `RECORD_ENTRIES` statically,
so every future entry is compiled into the client chunk — measured, not argued:
`"INITIAL LAUNCH REPORT"`, `"Weekend Robots Anomaly"` and `"Transfer complete"`
were all present in `dist/client/assets/index-*.js`. A worker clock can change
what the page DRAWS; it cannot remove text from a chunk it is only serving.
**Mike ruled: client-filter now, entries out to an endpoint later.** The hole is
declared here, in the code, and on the register rather than left implied.

---

## A — THE RECORD'S CLOCK

### The distinction, stated because A5 asked for it

`reveal/day.mjs` refused a BUILD that reads a clock and was **right**: a build
that reads a clock is not reproducible, and the same commit would produce a
different bundle on Tuesday than on Monday. **Nothing here weakens that.** This is
the WORKER at request time — the commit is a fixed input, the bundle is byte
identical every day, and the clock plays it back. Two visitors on two days get
two pages out of one artifact. That is a property of the server, not the build.

### The mechanism

**`reveal/record-clock.mjs`** — one declaration, three readers (the worker, the
glass, the build). `todayInRecordTz()`, `entryVisible()`, `visibleEntries()`,
`assetSchedule()`, `assetWithheld()`.

**The date is the worker's.** `src/worker.js` writes
`<script>window.__WB_TODAY__="…";window.__WB_RECORD_ALL__=…</script>` into the
head of every HTML response via `HTMLRewriter`. It is in the document before the
bundle's first line runs — **no round trip, no loading state, no flash of the
future**. A browser clock is the visitor's and can be wrong by accident or on
purpose; the clock that decides what the museum has published is the museum's.

**A2 — the timezone is `America/New_York`, and it is a decision.** `RECORD_EPOCH`
is a bare date and a bare date is not a moment; somebody has to say where midnight
is. It is Mike's clock: his Record, his working days, his commits stamped -0400,
and his own launch report says the site went live *"at 12:00 am Monday morning"* —
a claim about a wall clock in a room. **Cost, stated:** a visitor in Sydney reads
Monday's entry about fourteen hours into their own Monday. The alternative — a
per-visitor local clock — means the same entry appearing on two different calendar
days depending on who asked.

**A3 — the files are refused too.** `vite.config.js` bakes a date→path schedule
(`__WB_RECORD_ASSETS__`) from the Record's own `assets` arrays; the worker 404s a
governed path whose day has not come. **It is `{}` today** — Record 013 was the
only entry that ever named a picture and it was deleted — so the branch is built
and unexercised, which is reported rather than discovered later.

**A4 — the admin door is a THIRD door, for a third reason.** `/assets/locked/` is
PERMISSION and `/assets/held/` is STAGE; §8 is explicit that a new reason gets a
new door. Folding preview into `wb_held` would mean the code that shows next
Friday's entry also unlocks Hunter Root's wing. So: its own secret `RECORD_KEY`,
its own cookie `wb_record`, its own note. Fail-closed with no default, and
**nothing in `src/` renders it, names it or hints the door is there** — verified
by grepping the served HTML.

```
POST /api/record {"key":"…"}   -> sets the cookie
GET  /api/record               -> {today, tz, previewing, configured, note}
```

Mike runs `npx wrangler secret put RECORD_KEY` once, then POSTs the code once per
browser.

### The defect the first build hid

**Neither the injection nor the asset refusal fired**, and both had one cause:
`run_worker_first` listed only `/api/*` and the four shut prefixes, so documents
and `/robots/…` pictures were served straight off the asset layer and the worker
was never asked. `/api/record` answered perfectly the whole time, **which is what
made it look like it worked.**

`run_worker_first` is now `/*` alone — **forced, not chosen**:
`@cloudflare/vite-plugin` refuses the build on a redundant rule and named all six
("rule '/*' makes it redundant"). `reveal:check`'s doors pass was taught that a
catch-all counts, and **only** a catch-all; the worker's own refusal list is still
tested line by line.

### Proved

```
2026-08-12  ->  (none)          real today, five days before the epoch
2026-08-16  ->  (none)
2026-08-17  ->  001             day one
2026-08-19  ->  001, 002, 003   day three
2026-08-21  ->  001..005
admin all   ->  001..005        regardless of date
```

---

## B — THE STAGE

**`DEFAULT_STAGE` is untouched.** That is Mike's word on the day.

**`tools/deploy-guard.mjs`** now sits between build and upload on both scripts. It
reads `__WB_STAGE__` out of `dist/weird_baby/index.js` — **the artifact about to
be shipped**, not its own environment, because the failure this project already
had was a build whose client and worker disagreed and an env check would have
passed it happily. It refuses on: a missing worker, a worker stating no single
stage, a worker whose stage is not the one asked for, a `dist/` older than the
newest file in `src`/`public`/`reveal`, and — for plain `npm run deploy` — on not
having said so:

```
npm run deploy -- --i-know-this-publishes-development
```

**B3 — the deleted photographs are NOT still live, and my last report was wrong
about this.** They return 200, but the body is **4,731 bytes of `text/html`** —
the SPA shell. `not_found_handling: "single-page-application"` hands every unknown
path `index.html`, and `/images/wal/never-existed.jpg` returns byte-identical
output. Nothing persists and nothing needs clearing. **The trap worth keeping: on
this site a missing asset returns 200 HTML, so any liveness check by status code
is a false positive.** Check the content type.

### B4 — the rehearsal, run

| check | result |
|---|---|
| `npm run build:launch` prints the stage | `WB_STAGE = launch` |
| built worker states one stage | `"launch"` ×1, no `"development"` |
| `/api/held` | `{"open":false,"configured":true,"note":null,"stage":"launch"}` |
| `/held/robots/twin.html` | **404** |
| `/held/robots/art/portal-cover.png` | **404** |
| `/held/robots/reference/photos/MGK-TWIN_MONITOR_CLOSE_UP.png` | **404** |
| `/assets/held/portal-*.js` | **404** |
| `/assets/locked/*` (every stage) | **404** |
| `/` `/robots` `/wal` `/foundation` `/wb` | 200 |

**Development build restored afterwards** — worker reads `"development"`, harness
removed from `public/` and `dist/`.

---

## C — WHAT MIKE RULED HIDDEN

**One mechanism, not two:** `launched()`, the same switch `placed()` reads and the
same word the worker reads. In DEVELOPMENT everything renders; at LAUNCH the spine
is built without them.

| | at launch, measured |
|---|---|
| Foundation | 3 albums → **1** (Ledger and Contribute gone) |
| `/wb` | 2 albums → **1** (About the artist gone) |

**C2 — confirmed the right one.** `weird-baby.js` is imported only by
`src/routes/wb/WbSpine.jsx` — his own music. Worth A Listen's artist cards are
built by `aboutArtistTrack()` in `worth-a-listen.js` with ids
`<artist>-about-artist`; **nothing here touches them**, and /wal's four cards were
looked at afterwards.

It is the ALBUM and not the track on `/wb` because the `about` album holds exactly
one track, and hiding the track would leave a titled album with an empty room.

**Same limit as the Record: hidden from the page, strings still in the chunk.**
The Portal is genuinely absent because it lives in its own module behind a chunk
boundary; these are inside public modules. Open row `CH5-b`.

**C3 — nothing else is ruled-and-unhidden.** Every other hold has a mechanism:
`/hr` (`HeldWing` + `/assets/locked/`), the Portal (held chunk + worker), the
governed photographs (`placed()`).

---

## THE THING THE LAP FOUND

At launch, before day one, the Record drew **zero rows and no message** — a
heading over blank paper. It was the one shelf in the museum with no empty state,
while `archiveEmpty`, `docsEmpty` and `logEmpty` all exist for exactly this. Added
`logEmpty: "Nothing has been entered in the Record yet."` — **it names no date**,
because a promise about the future on the one surface whose point is that it only
shows what has happened would be the wrong sentence.

---

## GATES

| gate | result |
|---|---|
| lint | **11 errors / 9 warnings — baseline** |
| build | green |
| launch build | green |
| provenance:gate | **PASS** — 0 undeclared · 0 stale · 15 HOUSE rows added |
| reveal:check | **PASS** (incl. the retaught doors pass) |
| parity:gate | PASS — 4 shared, 0 divergences |
| instory:gate | PASS |
| reveal:day | nothing to move |
| **lap @ 1280px** | 6 routes on the LAUNCH build · overflow 0 · broken images 0 · console errors 0 |

Lint went to 13 first — `HTMLRewriter` and `__WB_RECORD_ASSETS__` are real
runtime globals eslint cannot see, declared in `eslint.config.js` beside
`__WB_STAGE__`, which is what that block is for.

---

## OPEN

- **`CH5-a`** — future entries still in the bundle; the endpoint move is its own packet.
- **`CH5-b`** — Ledger, Contribute and About-the-artist hidden from the page, strings still in the chunk.
- **`CH5-c`** — `RECORD_KEY` is not set on any deployment; the preview door cannot open until it is.
- **`CH5-d`** — `HR_KEY` is not set on the live deployment either; `/hr` is shut to Mike as well.
- **`CH5-e`** — D is not done: no photograph on the machine.
- **`CH5-f`** — a missing asset returns 200 HTML, so status-code liveness checks lie.
