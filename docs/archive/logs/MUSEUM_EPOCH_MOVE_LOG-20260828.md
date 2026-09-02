# THE EPOCH MOVES TO MONDAY 7 SEPTEMBER — RULING D

**2026-08-28.** Tree clean at **`35f805b`**. Nothing committed by Ops.
`RECORD_EPOCH`: `2026-08-31` → **`2026-09-07`**.

---

## 0. THE RULING, AND THE ORDER IS HALF OF IT

Mike ruled **B then A**: **move the epoch before deploying.** Day one is
**Monday 7 September 2026** — his dad's birthday and Labor Day, and the
relaunch date he named.

`docs/THURSDAY-20260827.md` put the question in the document and said *"if you
do not want Monday, the time to say so is before step 14."* He said so. **The
deploy is unblocked and the arming has moved with the epoch rather than gone
away**, which is the sentence the runbook now leads with.

**FIRST, A CORRECTION TO THE BRIEF, BECAUSE IT CHANGES A PUBLISHED NUMBER.**
The brief said *"It is 2026-08-31 today"* and, at the end, *"today
2026-08-27."* **Both are wrong and the tree says so:** the host clock reads
**Friday 2026-08-28 07:09 EDT**, and `35f805b` was committed
2026-08-27 21:04. Thursday's runbook was written for a night that has passed.
Everything below is measured against **2026-08-28**, and the one place it
matters is the countdown: **about ten days, not four.**

---

## 1. ONE DECLARATION, NO ENTRY LITERAL — RE-CHECKED, NOT ASSUMED

`74223d2` established it ten days ago and the brief asked for it to be
re-established rather than carried. Measured on the tree at `35f805b`:

| claim | how it was checked | result |
|---|---|---|
| one declaration | `grep '"20\d\d-\d\d-\d\d"'` across `src/data/artists`, `src/lib`, `src/routes` | **one** — `record-epoch.js:74`. Everything else date-shaped is `worth-a-listen.js` video rows |
| no entry carries a literal | `grep 'date:' src/data/artists/robots-record.js` | five hits, **all `recordDay(n)`**, `n = 1…5` |
| `wing-open.js` has no second literal | read whole | `ROBOTS_OPEN` is derived from the Record's own entries; the only dates in the file are in comments |
| `vite.config.js` bakes no literal | read the two `define`s | `__WB_RECORD_ASSETS__` and `__WB_RECORD_FIRST_DAY__` are both computed from the entries' own dates |
| the day editor | `tools/dictation/day.mjs:243` | `const RECORD_EPOCH_VALUE = draftEntries().epoch` — parses the tree, not the draft |

**It still holds. The move cost one literal.** The five entries were not
edited, and every derived value followed: entry dates, stamps, weekdays, week
numbers, datelines, both build bakes, the share cards, the wing, the countdown
and the seven governed pictures.

---

## 2. 2026-09-07 IS A MONDAY, AND THE OUTLINE IS UNTOUCHED

    2026-09-07  Mon        2026-09-10  Thu
    2026-09-08  Tue        2026-09-11  Fri
    2026-09-09  Wed

`recordDay(1..5)` = **09-07 Mon, 09-08, 09-09, 09-10, 09-11**.

**The guard was run, not reasoned about.** `npm run dictation` exits **0** and
prints `5 record(s), day one 2026-09-07`. `git diff --stat reveal/week-one.mjs
reveal/week-two.mjs` is **empty** — the ten `MON…FRI` rows were not touched and
did not need to be.

**AND IT IS THE SECOND CONSECUTIVE PIECE OF LUCK, WHICH IS NOW WRITTEN DOWN AS
LUCK.** 31 August was a Monday and 7 September is a Monday. `tools/arc.mjs`
still derives its day column from `DAYS[(r.no - 1) % 5]` — the entry NUMBER —
and never reads the epoch, so a non-Monday would leave `docs/ARC.md` printing
`MON` for Record 001 **while `npm run arc:check` printed PASS**, because it
compares the generated block against the file and both would be wrong the same
way. Flagged at that file since `74223d2`, flagged again now with the count at
two, and still not fixed for the same scoping reason.

---

## 3. THE COMMENTS THAT WENT FALSE

`74223d2` corrected **eight files**. This round touched those eight and
**found six more that it had missed** — four of them in documents whose whole
job is being right about this.

### The eight, again

| file | what moved |
|---|---|
| `src/data/artists/record-epoch.js` | the literal, the weekday paragraph, the derived five-day list, and a new RULING D block. **Ruling C's block is left as written** and marked superseded rather than edited — OPERATIONS §0, VERBATIM |
| `src/lib/wing-open.js` | three prose dates; `ROBOTS_OPEN` untouched for the second time |
| `src/routes/WbHome.jsx` | the target instant, `2026-09-07T04:00:00Z`, and the doors-open sentence |
| `src/data/artists/robots-record.js` | a second *"the day moved and this entry did not"* note |
| `src/worker.js` | two notes: the schedule comment's own prediction that a quoted date would go stale **came true four days later**, and the future-dated-assets list gains a third bullet |
| `vite.config.js` | the same prediction, from the bake side |
| `tools/arc.mjs` | the luck note, now at two draws |
| `provenance/register.json` | §4 below |

### The six it missed, and four of them matter more than the eight

- **`docs/canon/01-WORLD.md`** — the timeline row read **`2026-08-17`** and was
  marked **PUB**. The catalogue was written 2026-08-20; **Ruling C never
  reached it.** Corrected to 2026-09-07 and **PENDING**, because Ruling C's own
  words are *"the site was never live."*
- **`docs/canon/09-PUBLISHED.md`** — same: `RECORD_EPOCH = "2026-08-17"`, and
  **THE FIVE ENTRIES table said 001–004 were PUBLISHED.** See §7, question 2.
- **`docs/MUSEUM_RULINGS-20260817.md`** — **Ruling C was never filed here at
  all.** It is now §27, with the four-day gap recorded as the failure it is,
  and Ruling D is §28.
- **`CLAUDE.md`** — the standing-rules section said day one was `2026-08-17`
  and that the constant lived in `src/data/artists/robots.js`. It left
  `robots.js` at the **2026-08-11 split**. Both corrected in place: an
  orientation doc publishing a wrong constant disables the constant, which is
  the argument that file already makes about the lint baseline.
- **`STATE.md`** — the same two facts, the same two errors.
- **`docs/OPEN_ACTIONS.md` D-a** — updated; see §5.

### The runbook, under its own rule

`docs/THURSDAY-20260827.md`'s head box says a commit moving a value it
publishes moves the document in the same commit. **This is that commit.**

| where | published | now |
|---|---|---|
| READ THIS FIRST | *"about four days"* | ***"about ten days"*** |
| READ THIS FIRST | the armed schedule, 31 Aug – 4 Sep | **7 – 11 Sep** |
| head box | *six dated 2026-09-02, one 2026-09-03* | **six 2026-09-09, one 2026-09-10** — re-read off the launch build's `__WB_RECORD_ASSETS__` |
| step 21 | *six on 2 September, the last on 3 September* | **9 September / 10 September** |
| step 23 | `?as-of=2026-09-04`, `"today":"2026-09-04"` | **`2026-09-11`** |
| step 24 | `03 DAYS 20 HOURS` | **`09 DAYS 18 HOURS`** for a late-Friday deploy |
| what is in the deploy | `RECORD_EPOCH → 2026-08-31 (Ruling C)` | **`→ 2026-09-07 (Ruling D, in this deploy)`** |
| the close, and the last line | *Monday 31 August* | **Monday 7 September** |

**AND THE LOUD LINE CHANGED CHARACTER RATHER THAN VALUE.** It was
*"THIS DEPLOY IS NOT THE LAUNCH — AND IT ARMS ONE"*, with the decision put to
Mike before step 14. **The decision is made.** The head now says the question
was answered, that the arming **moved rather than went away**, and carries the
sentence §5 is about.

**THREE VALUES IN IT ARE NOT EPOCH-DERIVED AND WERE WRONG ANYWAY.** They are
the wall clock, and no gate can see them:

- step 23's `"realToday":"2026-08-27"` and `__WB_TODAY__="2026-08-27"` →
  **`2026-08-28`**, published now **as a rule** — *both must equal today in New
  York* — with the literal as the shortcut rather than the check.
- step 15's `git commit -m "deploy: launch from 7b687cf, 2026-08-27"` → the sha
  and the date are **placeholders** now. `7b687cf` is two commits back and
  Thursday has passed; a typed sha there is a message claiming a deploy that
  did not happen. `docs/DEPLOYED.md` carries the real pair.

**THE FILE WAS NOT RE-DATED A SECOND TIME.** That is question 1 below.

---

## 4. THE PROVENANCE ROW RE-KEYS

The key is `sha256(file + NUL + text)` truncated to 16
(`tools/provenance-sweep.mjs:230`), so a date change **is** a re-key and
cannot be an edit in place. Verified by re-deriving both prior keys:

    src/data/artists/record-epoch.js + NUL + 2026-08-17  ->  70c2e7724abf2808   (Mike, 2026-08-08)
    src/data/artists/record-epoch.js + NUL + 2026-08-31  ->  40201658f6504625   (RULING C)
    src/data/artists/record-epoch.js + NUL + 2026-09-07  ->  7ac60b4d08f97dce   (RULING D)

The first two match what is on the row today, which is how the derivation was
confirmed rather than assumed. **`40201658f6504625` → `7ac60b4d08f97dce`**,
`t` → `2026-09-07`, `l` → **116** (the comment block above the constant grew),
`s` re-sourced to Ruling D with the C→D→prior chain named, `n` carrying the
second move beside the first.

**Nothing RESTATED the old key** — checked the same way `74223d2` checked it —
so no chain broke. `npm run provenance:gate` **PASS**.

---

## 5. THE DATE FIRES ON ITS OWN, AND IT IS WRITTEN IN FOUR PLACES

**Nobody runs anything on 7 September.** No cron, no queue, no scheduled job,
nobody typing. The deployed worker plays the bundle against **request time**,
and at **17:00 America/New_York** the clock passes a number: Record 001 posts,
`wing-open.js` opens `/robots`, the countdown returns `null` and unmounts, the
share cards start naming the robots, and the governed pictures publish on their
own days after. Confirmed in the launch build — `wingOpenOn` folds to
`return today >= "2026-09-07";`.

**So a deploy does not decide the date. It arms it.** The brief asked for that
to land where a session will meet it rather than only in a log. It is in four
places, and the reason for four is that the last time it was written once, in a
round log, and nobody read it:

1. **`docs/canonical/OPERATIONS.md` §0 → DEPLOY — THE ONLY ACCOUNT**, a new
   sub-section **THE DEPLOY ARMS A DATE, AND NOBODY RUNS ANYTHING ON IT**. §0
   is the *READ THIS FIRST AND READ IT WHOLE* section and DEPLOY is the block a
   session lands on when it is about to ship.
2. **`CLAUDE.md`**, in the standing-rules section that already owns the date —
   the file every session in this repo reads first.
3. **`src/data/artists/record-epoch.js`**, in the constant's own header, where
   somebody editing the line meets it.
4. **`docs/OPEN_ACTIONS.md` D-a**, which is **deliberately not closed by this
   ruling.** *"A new date if it moves"* is answered for today; the row is now
   the standing reminder that **if 7 September arrives and the workflow is not
   ready, the line moves again BEFORE that day**. It closes when a launch
   happens, not when a date is chosen.

Ruling D is filed as §28 of `docs/MUSEUM_RULINGS-20260817.md`, which is the home
the register row names.

---

## 6. WHAT A VISITOR SEES AFTER THE DEPLOY

**Today is 2026-08-28, not 2026-08-27** — the brief's date, and the number below
is the one it moves.

### A stranger, with no key, from now until 7 September

| | |
|---|---|
| the lobby | the museum, and **a countdown reading about ten days** |
| the Robots wing | **not in the directory.** It does not exist to them |
| the Record | not reachable — it lives inside the wing |
| the seven pictures | **404 `Not found`, 9 bytes, from the worker itself** |
| the share card | *"A museum of weird things worth keeping. No ads,"* — the shut-wing card |
| `?as-of=` in the address | **does nothing.** `__WB_TODAY__` reads the real day |

### The countdown, measured

`DOORS_OPEN_AT = recordVisibleAt("2026-09-07")` = **2026-09-07T21:00:00Z**.

    from now  (2026-08-28 07:09 EDT)   10 DAYS 09 HOURS
    deployed  2026-08-28 22:00 EDT     09 DAYS 19 HOURS
    deployed  2026-08-28 23:00 EDT     09 DAYS 18 HOURS
    deployed  2026-08-29 00:30 EDT     09 DAYS 16 HOURS

**THE RUNBOOK'S LOUD LINE WAS WRONG AGAIN AND IS CORRECTED.** It said *about
four days* / `03 DAYS 20 HOURS`, measured on Thursday against the old epoch.
It is now *about ten days* / `09 DAYS 18 HOURS`.

**AND THE TWO-DIGIT CASE WAS CHECKED RATHER THAN HOPED FOR**, because this is
the first reading over nine days: `cell()` in `WbHome.jsx` is
`String(n).padStart(2, "0")` with no clamp, so ten days prints **`10 DAYS`** in
the same four cells. Nothing needs widening. A bigger number on that counter is
this commit working.

### Then, with nobody doing anything

    2026-09-06        0 entries  ->  wing SHUT
    2026-09-07 17:00  1 entry    ->  WING OPENS, countdown removes itself
    2026-09-08        2 entries
    2026-09-09        3 entries  ->  six pictures publish
    2026-09-10        4 entries  ->  the seventh publishes
    2026-09-11        5 entries

Measured with `visibleEntries(RECORD_ENTRIES, day)`, not read off prose.

### Mike, with `RECORD_KEY`, on the night

Everything, at any date, through step 23 — `/admin` → The Record door →
`?as-of=2026-09-11`. **The same URL handed to a stranger still shows the shut
museum**, which is his condition and is step 23's third rollback trigger.

---

## 7. WHAT THIS ROUND FOUND THAT NOBODY ASKED FOR

### a. `record:land` would land the stale draft as NEGATIVE DAYS

**Measured, not reasoned.** `emit-record-entries.mjs` measures each drafted
entry's own date against the **tree's** epoch.
`docs/dictation-20260807/record-draft.json` was saved 2026-08-26 against the old
epoch. A dry `npm run record:land` now prints:

    { no: 1, date: recordDay(-6),   through   { no: 5, date: recordDay(-2),

Landing that dates the five Records **31 Aug – 4 Sep, a week before day one** —
the epoch move undone by a file nobody thinks of as a date source. What it
costs on the glass was measured too: `entryWeek()` returns `null` for any date
before the epoch, so the dateline **drops `Week 1` and prints `Monday · Record
001`**. Nothing throws.

**THE GUARD THAT EXISTS DOES NOT COVER IT.** `--write` refuses a draft older
than the Record, and `treeMovedAt()` reads `robots-record.js` and **nothing
else**. `record-epoch.js` is not in it. **Today the refusal fires by accident**,
because this round happened to add a comment to `robots-record.js`; an epoch
move on its own would not trip it.

**NOT FIXED, and the reason is that it may not be a defect** — the emitter's own
header rules that *the entry's own day is the authority*, which is the opposite
reading of the same facts. Question 3. Filed at the site, in OPERATIONS §8 as a
lead line, and in full in the third cut.

### b. OPERATIONS.md went over its ceiling, and the third cut was taken

Adding §0's standing note and §8's hazard took the ground state from **39,690 to
43,186 bytes — 108%**, and `npm run ops:size` FAILED with the remedy printed.
**That is the mechanism working**: §8's own preamble already said *bodies
accumulate here and a cut moves them; the ceiling is what says when.*

`docs/canonical/OPERATIONS_ARCHIVE/08-KNOWN-HAZARDS-III.md` is new, cut at HEAD
`35f805b`. It holds the **three** bodied entries that were in §8 — the publish-
scope/obfuscation-law entry (2026-08-25), the `CF-Cache-Status` entry
(2026-08-24) and the new one — and §8 keeps a lead line for each. **No bodied
entry is left in §8.** `npm run ops:archive` regenerated the index.

**The file is now 38,867 bytes — 97.2%, against 99.2% at `35f805b`.** It came
out of this round carrying a new standing section and a new hazard and slightly
smaller than it went in.

### c. the desk run, measured — and Ops ruled it into this commit

**NINETEEN pages are regenerated by `npm run desk`. SEVEN differ from
`35f805b`.** Ops ruled the desk run into this commit rather than a separate
one: *a page generated mid-round is wrong rather than stale, and a deploy
should not carry a wrong page for the sake of a tidier diff.*

**FOUR OF THE SEVEN ARE OTHER ROUNDS' CONTENT CATCHING UP.**
`docs/canon/06-PORTAL.html`, `docs/canon/BELL-103.html`, `docs/BACKLOG.html` and
`docs/OPS_DESK.html` have markdown sources **this round never touched** —
verified, none of them is modified in the tree — so 100% of those diffs is
earlier rounds editing the `.md` and not re-rendering. The 06-PORTAL diff is the
`Launch the Portal` rename of 2026-08-26.

**EXACTLY ONE PAGE OF THE NINETEEN IS TIME-DERIVED, AND IT IS THE ONE THE
RULING IS ACTUALLY ABOUT.** `docs/OPS_DESK.html` carries **relative-age labels
and UTC stamps** — `just now`, `34 hours ago`, `9 days ago`. The desk run made
mid-round printed **"34 hours ago" against pages it had itself just rewritten**,
which is a wrong page rather than a stale one, exactly as ruled. **The desk was
re-run against the settled tree afterwards** and that page now reads
`72 minutes ago` for the dictation pages and correct ages for the rest.

**THE OTHER EIGHTEEN ARE DETERMINISTIC, AND THAT WAS TESTED RATHER THAN
ASSUMED:** `npm run desk` twice back to back, `md5sum` on all 22 rendered pages,
**zero differences.** So *"most of it timestamps"* is not what the tree says —
it is **one page in nineteen**, and the number is in the commit message as
measured rather than as estimated.

> **AND IT CONTRADICTS A DOCUMENTED RULE, WHICH IS NAMED HERE RATHER THAN
> QUIETLY COMPLIED WITH.** `tools/ops-archive-index.mjs`'s own header says, in as
> many words, that a generated file which changes when nothing changed *"is churn
> that sweeps itself into whatever commit it touches, **which is exactly why
> `npm run desk` is unsafe to include in one**."* Ops has ruled it in on the
> ground above, and the ground is sound. **The standing consequence: `OPS_DESK.html`
> will churn again on the next desk run, in whatever commit that run lands in.**
> Whether the desk should stamp ages at all is not a question this round opened.

### d. the dictation pages, separated

| page | verdict |
|---|---|
| `assign.html` | **clean** — 7 changed lines, **every one a date line**, checked |
| `record.html` | **clean** — 1 line, `"epoch":"2026-09-07"` |
| `day.html` | the five dates **and** ~8 lines of catch-up from an earlier round — `ATTACHMENTS · 0` → `· 1`, a `TERMINAL.EXE` row, a `REST` reorder |
| `artifacts.html` | **158+/158− with ZERO epoch dates in the diff** — base64 thumbnail payloads moving between `data-i` slots. In this commit under the same ruling as the desk twins, not because the epoch moved it |

---

## 8. GATES

    npm run lint              16 problems (9 errors, 7 warnings) — BASELINE, zero new
    npm run build             green
    npm run build:launch      green — wingOpenOn folds to `today >= "2026-09-07"`
    npm run provenance:gate   PASS
    npm run reveal:check      exit 0
    npm run instory:gate      PASS
    npm run ops:size          PASS — 38,867 / 40,000 (97.2%)
    npm run arc:check         PASS
    npm run parity:gate       4 shared · 0 divergences
    npm run docs:numbers:gate PASS
    npm run reveal:day        Nothing to move. The tree and the Record agree.
    npm run dictation         exit 0 — 5 record(s), day one 2026-09-07

**The lap was not run: no layout and no visitor-facing string changed.** The
countdown's digits are derived from the clock, not from a string, and the same
four cells render them.

**RE-RUN IN FULL AFTER THE DESK RUN AND AFTER THE ARCHIVE CUT**, not carried
from the first pass — every line above is from the tree as it stands.

### And the caveat that outranks the whole table

**NOTHING IN THIS COMMIT HAS RUN ON A LIVE DEPLOYMENT.** Every value in this log
was measured on this tree, on the local build, and through node. **weird.baby
has not been touched.** `docs/DEPLOYED.md` has never existed in git history, so
**nothing in the repository can say what is currently running**, and the first
honest reading of any of this will be the runbook's verify steps 16–24. Whether
`RECORD_KEY` and `HR_KEY` are set in production is still unknown from here — the
runbook says so at steps 17 and 23 and this round did not change it.

---

## 9. WHAT IS STILL MIKE'S — THREE NUMBERED QUESTIONS

1. **Does `docs/THURSDAY-20260827.md` get re-dated a second time?** Its night
   has passed. Its epoch-derived values are corrected and its wall-clock values
   now publish the rule rather than only a literal, so **it is usable tonight as
   it stands** — but its title says Thursday and it was already re-dated once
   from `SUNDAY-20260830.md`. **A or B: A — leave the name and let it be the
   catch-up deploy's document whatever night that lands on. B — re-date it
   again.** Ops did not rename on its own; the last rename cost two dead
   pointers that had to be chased.

2. **Ops applied Ruling C to the canon's five-entry table. Confirm the
   reading.** `docs/canon/09-PUBLISHED.md` said 001–004 were **PUBLISHED**;
   Ruling C says *the site was never live*, so **all five are now SCHEDULED**
   and the *"Record 001 posted at 00:00 Monday"* exception is struck. That page
   answers the catalogue's own fourth question — *can I change this, or has a
   visitor read it?* — and it was answering **four Records are frozen** when the
   ruling says none is. **Leaving a known falsehood in the one document that
   question is asked of was the worse option**, so Ops applied it; confirming it
   is yours.

3. **`record:land` and a moved epoch — which rule wins?** *The entry's own day
   is the authority* (the emitter's header) or *one line moves and everything
   follows* (D1). They disagree, and today the answer is `recordDay(-6)`.
   Nothing is blocked on it: the discipline in the meantime is **open the day
   editor and save after moving the epoch.**

---

## 10. NOT DONE, AND SAID PLAINLY

- **`tools/arc.mjs` is still not fixed.** Two Mondays running. One import and
  one call; deliberately still a scoping call, not a typo.
- **A dated runbook is still outside `docs:numbers:gate`.** Raised 2026-08-25,
  cost one stale value on 2026-08-27, and this round moved eight more of its
  numbers by hand. **Third time it has been named. Still undecided.**
- **`docs/dictation-20260807/record-draft.json` was not touched.** Its own
  header says *Ops does not hand-edit this file*, and it is Mike's saved words.
