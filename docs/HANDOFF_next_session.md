<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# HANDOFF — for the next session

Rewritten **2026-08-29**. Live is **`3ccbad9`** at stage **launch**.

**Session-scoped context only.** Process and standing facts are in
`docs/canonical/OPERATIONS.md`, `docs/canonical/OPS_BOOT.md` and
`docs/MUSEUM_RULINGS-20260817.md`. **Nothing below is a standing order.** Run
`git log --oneline -8` and `git status --short` and believe those.

---

## 1 — THE RULING YOU INHERIT, WITH EIGHT DAYS LEFT ON IT

**Mike writes nothing between 2026-08-29 and the seventh.** Ops works only on
what needs no words from him.

That is the shape of every packet until day one. Anything whose next step is a
sentence from Mike is parked, not queued — and asking him for one is the thing
the ruling forbids, not a way around it.

---

## 2 — THE OPENING NEEDS NOBODY, AND THAT IS MEASURED

**No cron, no queue, no scheduled job, no person.** The deployed bundle plays
against request time and the day arrives on its own.

- **One request-time read in the worker**, `src/worker.js:1039` — every
  consumer downstream is handed its result. A second call would split the
  museum in half, and **nothing counts them**; the rule holds because it is
  written there.
- **The countdown removes itself on the museum's clock**, not on a module-load
  const — `src/routes/WbHome.jsx:88` derives its target from the epoch, and the
  component returns null once the doors are open.
- **The wing opens on the Record having an entry, not on a date** —
  `src/lib/wing-open.js:55`. There is no date in that file to drift, which is
  why two epoch moves went through without it being touched.
- **The seven governed pictures ship with the deploy and the worker holds each
  until its own day** — the schedule is baked from the entries' own `assets`
  arrays, and the refusal is `src/worker.js:625–630`, 404 at `:627`.

**Read out of the built artefact rather than out of source:** `RECORD_EPOCH`
`2026-09-07` (`src/data/artists/record-epoch.js:116`), `RECORD_HOUR` **17** and
`RECORD_TZ` **America/New_York** (`reveal/record-clock.mjs:89` and `:46`) all
survive into the build. **Record 001 is baked**, found in the client bundle by
its own prose rather than by a label.

---

## 3 — WHAT IS FRAGILE, AND IT IS KNOWN BEFORE THE SEVENTH RATHER THAN ON IT

**`arc:check` derives its day column from the ENTRY NUMBER and never reads the
epoch.** `tools/arc.mjs:100` is `DAYS[(r.no - 1) % 5]`, a hard-coded MON…FRI
cycle, and that file imports `fs`, `path` and `url` and nothing that reads a
date. So a day one that is not a Monday leaves `docs/ARC.md` wrong for every
Record **while `npm run arc:check` goes on printing PASS**, because it compares
a generated block against a file and both are wrong the same way.

**It holds only while day one is a Monday.** 2026-08-31 was one and 2026-09-07
is one; that is two draws, not evidence the urn is safe. Carried as
[`D-a`](OPEN_ACTIONS.md#d-a), flagged at `74223d2`, **still not fixed** — the
repair is one import and one call, and it is a scoping call rather than a typo.

---

## 4 — THREE THINGS FLAGGED, NONE TOUCHED

**Six of the seven governed pictures publish into `/robots/manual/` on the
ninth.** Whether those scans are the written, printed and photographed pages
[`M61`](OPEN_ACTIONS.md#m61) waits on is **not established**. M61 ruled the
manual stays offline until real pages exist; nobody has checked whether these
six are them. **Check before the ninth, not after.**

**`scan-07-a.webp` and `scan-11-b.webp` are byte-identical** — same sha256,
109,982 bytes each. One photograph is scheduled at two manual positions. Whether
that is one sheet legitimately appearing twice or a duplication is not something
the build can answer.

**The backlog row for the `/wb` reader is written from the wrong end.**
[`BACKLOG.md:69`](BACKLOG.md) calls it hoisting a reader out of
`RobotsExhibitFlow.jsx`. Measured: **`/wb` has no flow file, no listener and no
link event** — `src/routes/wb/WbSpine.jsx` is five lines and renders `Exhibit`
with none of them, and the omission is deliberate and documented at
`src/data/artists/weird-baby.js:26`. The four photographs are `profile` cards
with no click handler; they never reach the engine's door at all. **So that item
is not a hoist. It is giving a page a door it was built without — and that is a
Mike ruling nobody has taken.** Under §1's ruling it is parked.

---

## 5 — TWO DEPLOYS TODAY

| when | what | commit |
|---|---|---|
| **14:03:26.328Z** | unchosen, published during a shell runaway | `83f06a0`, **dirty tree** |
| **21:36:57.292Z** | `deploy:launch`, run by Mike at Ops' request | `3ccbad9`, **clean** |

**The cause of the first is unknown and stays unknown.** Two hypotheses were
tested and both measured false: `OPERATIONS.md` as entry point, and the
recursion chain. The entry point cannot be recovered. **Do not supply a third.**

The second replaced it. **Live is `3ccbad9` at stage `launch`.**

---

## 6 — THE HAZARD THIS SESSION PAID FOR

**Ops probed the held door from Mike's browser, which holds the key cookie.**
It read four 200s as a leak, told Mike his own `M61` was being broken on the
live wire, and asked him for a deploy on that basis.

**A cookie-free client returned 404 on all four in the same minute.** The 200s
were the door working for a key-holder, which is what it is built to do.

`npm run door:check` now prevents it: no cookie, no key, no credential; it
reads the four prefixes out of `src/worker.js` rather than retyping them, and
it **requires a control** — a known-public path answering 200 in the same run —
because four 404s are also what an outage looks like. **It is not in the close
ritual and must not join it.** It measures the wire, the wire changes only on
deploy, and a check that needs the network fails on a train. **Its home is after
a deploy.**

---

## 7 — UNTOUCHED BACKLOG

The lobby · the gift shop · Audie Cornish on `/wal` · social · the arc's blank
weeks 6, 7 and 8 · **the dress-rehearsal ruling, still not landed in the tree**.

---

## 8 — FOR WHOEVER READS THIS NEXT

**`RECORD_EPOCH` is 2026-09-07 at 17:00 Eastern and it fires on its own.** If
the workflow is not ready, the epoch moves **BEFORE** that day — Ruling D: move
first, deploy second.

The failures this session corrected share one shape: **naming a thing from its
likely shape instead of reading it.** §9 holding the cut procedure. Line 117
firing the deploy. The recursion chain. Four 200s in a browser holding the key.
Every one plausible; every one wrong; every one caught by reading rather than
by reasoning.

**That reading is the load-bearing part of this system. Do not optimise it
away.**
