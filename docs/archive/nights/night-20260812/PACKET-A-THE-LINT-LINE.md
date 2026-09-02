# PACKET A — THE LINT LINE, AND EVERY OTHER PUBLISHED NUMBER
2026-08-13 · WRITE · `docs/canonical/OPERATIONS.md` and `CLAUDE.md` changed.

---

## WHAT YOU NEED FROM ME

**Nothing. A1 is fixed, and the sweep found five more of the same defect.**

One thing worth knowing because it changes how the next one gets caught:
**every number in this class is measurable, and none of them is measured.**
They are typed by hand into prose and re-typed by hand when someone notices.
That is the whole failure. §A3 says what would end it; it is not built.

---

# A1 — THE LINT LINE

`docs/canonical/OPERATIONS.md:1872`, §9 step 0 — the seal ritual every session
reads before it closes.

```diff
- 0. **Gates, in this order:** `npm run lint` (baseline **11 errors / 9
-    warnings**, zero new) → `npm run build` (green) → …
+ 0. **Gates, in this order:** `npm run lint` (baseline **9 errors / 8
+    warnings**, zero new) → `npm run build` (green) → …
```

Measured on a clean tree today: **17 problems (9 errors, 8 warnings)**.

---

# A2 — THE SWEEP

I measured the thing each claim counts, then grepped all three governing
documents for numbers next to countable nouns. **`STATE.md` is the third
document** — CLAUDE.md's standing-rules block names it as the mirror of
OPERATIONS.md throughout, so it was swept too.

## Measured today

| thing | real |
|---|---:|
| asset-table rows | **385** (250 image · 132 audio · 3 video) |
| — of which missing from disk | 13 |
| — of which carry a `bucket` | **0** |
| — of which carry a `verdict` | **0** |
| ledger.json rows | **166** |
| register.json entries | 1,977 |
| Record entries | 5 |
| manual pages on disk | 61 |
| twin.html | 606 KB |
| `robots-record.js` entries body | 16,486 chars, **10,124 of them comment** |
| CLAUDE.md | 1,023 lines |
| OPERATIONS.md | 2,001 lines |
| STATE.md | 2,811 lines |
| lint | **9 errors / 8 warnings** |

## Fixed — five stale standing values

| where | said | is | note |
|---|---:|---:|---|
| `OPERATIONS.md:1872` §9 seal ritual | 11 / 9 | **9 / 8** | A1 |
| `OPERATIONS.md:1049` §5 THE REVEAL LEDGER | 152 rows | **166** | |
| `OPERATIONS.md:1054` §5 the asset table | 251 media files | **385** | also now names the 13 missing |
| `OPERATIONS.md:498` Doctrine 20 | null on all 315 rows | **385** | the *rule* held; the count did not |
| `OPERATIONS.md:1574` §7 | null on all 315 rows | **385** | same claim, second site |
| `CLAUDE.md:454` THE TWO BUCKETS | null on all 315 rows | **385** | same claim, third site |

Each fix carries `(measured 2026-08-13; the row said N)` in place, so the next
reader can see it was checked rather than assumed.

## Fixed — a paragraph that contradicted itself twice

`CLAUDE.md`'s `### Pre-flight before commit` opens by stating the baseline
correctly as **9 / 8** and then, in the same paragraph:

- said the other errors *"live in `HrExhibitFlow.jsx` and
  `RobotsExhibitFlow.jsx`"* — **measured, five of the nine are in
  `Exhibit.jsx`**;
- closed with a sandbox caveat ending *"On Windows the file is intact and the
  count is 4/6"* — **contradicting the 9/8 forty words earlier**, with the
  doubly-stale number, inside the very sentence warning about stale numbers.

Both replaced with the measured per-file table. The sandbox caveat is deleted
with the sandbox.

## Found and deliberately NOT changed — thirteen sites

**`STATE.md` carries `lint 11 err / 9 warn` thirteen times and `11 err / 10
warn` once, and every one of them must stay.** They are round-log entries
recording what the gates read *on the day that round sealed*:

```
STATE.md:1080  - **Gates:** lint **11 err / 9 warn = HEAD baseline, zero new**; build green
STATE.md:1181  - **Gates:** lint **11 err / 9 warn = HEAD baseline, zero new**; build green
STATE.md:1248, 1315, 1379, 1442, 1492, 1560, 1662, 1767, 1856, 1964, 2033, 2227, 2371, 2505
```

Those were **true when written**. Rewriting a recorded measurement to match
today is falsifying the history that makes the tripwire legible in the first
place.

**`STATE.md:1178` likewise stays** — it is the round log of the A1 fix itself,
recording that *CLAUDE.md* once published 4 / 6. It is a report about a wrong
number, not a wrong number.

**This is the distinction the sweep turns on**, and it is the reason a
find-and-replace would have been wrong:

> **A published STANDING value is a tripwire and must be current.
> A recorded MEASUREMENT is history and must not be touched.**

## Found, reported, not a number — the ~600-line rule

`CLAUDE.md`'s own last line: *"Don't let this file grow past ~600 lines."*
**It is 1,023 lines** — 70% over its own limit, and that is after this packet
removed 187. Not a stale number: a rule being broken. It is yours to rule on;
the archive procedure it names already exists.

---

# A3 — THE CLASS: A TRIPWIRE PUBLISHING ITS OWN WRONG VALUE

**You have been bitten by this twice, and the sweep says why it will happen a
third time.**

The defect is not that a number went stale. It is that **the number is prose.**
Every value in the table above can be computed in milliseconds from a file in
the repo, and not one of them is. They are typed into a sentence, and a
sentence has no gate.

That produces a failure with a specific and nasty shape:

1. **It disables the check it is part of.** A baseline is only useful as a
   comparison. Publishing the wrong one does not weaken the tripwire, it
   **inverts** it — a session reading "11 / 9" against a real 9 / 8 concludes
   two errors were *fixed* and moves on; the same session, having introduced
   two errors, reads 11 and concludes *nothing changed*.
2. **It is invisible to every gate you have.** `provenance:gate` reads `src/`
   and `index.html`. `reveal:check` reads the ledger and the Record. Nothing
   reads the governing documents at all. All eight gates passed today with §9
   publishing a false baseline.
3. **It rots fastest where it matters most.** The three sites carrying "315
   rows" are all in Doctrine 20 and §7 — the rules about the asset table —
   which is exactly the table that grew to 385.
4. **It has already been "fixed" once and came back.** `CLAUDE.md` published
   4 / 6 for months; A1 corrected it to 11 / 9 on 2026-08-04 with a note saying
   a doc that misstates the tripwire disables it; CH8 moved the real value to
   9 / 8 on 2026-08-12 and updated CLAUDE.md; **OPERATIONS.md was not brought
   along, and neither were the other five.** A hand-maintained number that has
   been corrected twice will need correcting a third time.

## Instances found, by kind

| kind | sites | fixed |
|---|---:|---|
| lint baseline published as a standing value | 2 | 2 |
| asset-table row count | 4 | 4 |
| ledger row count | 1 | 1 |
| per-file error distribution | 1 | 1 |
| a document's own size limit, violated | 1 | reported only |
| historical measurements (correctly stale) | 14 | untouched by design |

## The recommendation, not built

**A `docs:numbers` gate that runs beside the others.** The shape already exists
twice in this repo — `assertSlotsMatchPage()` refuses to write a worksheet whose
declared slots and rendered textareas disagree; `ledger-declare.mjs` refuses to
write a ledger whose row ids drifted. The same idea, pointed at prose:

- a small table of `{ pattern, measurer }` pairs — the regexes in this report
  are the first draft of it;
- it **measures** the thing, greps the three documents, and **fails the packet**
  on a mismatch, naming file, line and both numbers;
- it must distinguish a standing value from a round-log entry. The cheapest
  honest rule: **only sweep outside the round-log sections**, which are
  delimited already (`## Recent session log`, and STATE.md's dated headings).
  A marker like `<!--measured-->` on the standing values would be exact, and is
  more work.

**It is roughly an hour and it ends the class.** I did not build it — the packet
said fix the measurable ones and report the class. This is the report.

---

## WHAT I COULD NOT DETERMINE

- **Whether the four `docs/canonical/UX_*_SPEC` and `VISION_*` documents carry
  stale numbers too.** I swept the three governing documents the packet named
  (OPERATIONS.md, STATE.md, CLAUDE.md). The specs are 228 KB more and were out
  of scope.
- **Whether "251 media files" was ever right.** It matches no count I can
  reconstruct; the table has been 277 and 250 within the last fortnight per the
  round logs. I set it to what is true today rather than reconstruct its past.
- **Why `assets:orphans` reports 13** (8 judged, 5 unjudged). Unchanged by this
  packet and still unexplained from earlier rounds.

## WHAT NEEDS MIKE

**Nothing is blocked.** Two rulings when convenient:

1. **The `docs:numbers` gate** — build it or leave the class open. It is the
   only thing that stops a fourth correction.
2. **CLAUDE.md is 1,023 lines against its own ~600-line rule.** The archive
   procedure it names is ready; somebody has to say go.
