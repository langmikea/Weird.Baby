# THE TWO BUCKETS + 013 — round log

**Museum · B1–B3 · 2026-08-07 · single agent, drafting lane, standing gates.**
Written to disk before the commit, per `OPERATIONS.md` §9 / Cowork hygiene §13.

---

## What the instruction was

Two rulings from Mike and one housekeeping instruction:

- **B1** — the bouncy ball law is corrected: it caps **points of focus, not
  assets**. Two buckets — **precious** (two or three genuine reveals a week) and
  **dump** (everything else, no ceiling). Record it as law, then **fix the
  trackers**, which were counting assets against the cap. The
  *"16 pictures = 6–8 days"* figure is void; replace it with the honest
  two-number version.
- **B2** — Record 013 was a **prototype**. Not day one, no re-dating, no
  defending; the real Record starts at **001**. Clear it out of the way — retire
  it or mark it — *whichever keeps the Record honest and the machinery
  exercised*. W-1 and M19 close by the ruling; say how.
- **B3** — OPEN_ACTIONS per Doctrine 14; regenerate the dictation pages.

---

## B1 — THE CORRECTION IS A CHANGE OF UNIT, AND THAT IS WHY NOTHING CAUGHT IT

The law was carried in `reveal/week-one.mjs` as a MIKE-NAMED standing rule and
read, verbatim: *"never more than two or three offerings in a day."*

**Nothing about that sentence is false.** What was wrong is the unit every reader
supplied, and Ops supplied the wrong one **twice** — once in the rule's own
`bearing` line (*"a hard ceiling on what any single entry may put in front of a
reader"*) and once, expensively, in the tracker, which divided a count of
**photographs** by a ceiling on **attention**.

> **16 pictures at three a day is 6 days of material, at two a day 8 — so 1.1 to
> 1.6 five-day weeks.**

Every input was a real measurement and the arithmetic was sound. That is the
whole reason it survived a round: there was nothing to catch. **The figure is
void.**

### Where the law lives now

**`reveal/focus.mjs`** — a new data module beside `transfers.mjs` and
`week-one.mjs`. Exports `ORIGIN` · `LAW` · `BUCKETS` · `BUCKET_KEYS` ·
`bucketOf` · `split` · `runways` · `VOIDED`.

It is a data module for the same reason those two are: a rule that lives inside a
rendering function cannot be diffed, cannot be checked, and quietly becomes the
generator's opinion — **which is precisely the failure it exists to correct.**

**`VOIDED` is the design decision worth naming.** A superseded number that is
merely deleted comes back the next time somebody does the obvious arithmetic. So
the void figure is kept in writing with what produced it and why it is wrong —
the same service `retired.*` does in the ledger.

### The period changed with the unit, and it was not meant to be missed

The old sentence said *in a day*. The ceiling on precious reveals is **two or
three A WEEK**. Both halves of the correction move the same way: the law is
**scarcer** than it was read as being about the things that count, and **silent**
about the things that do not.

### The asymmetry is the mechanism

| bucket | ceiling | what a tracker may say |
|---|---|---|
| **PRECIOUS** | two or three **a week** | a count with a ceiling over it — it **divides into weeks** and the weeks mean something |
| **DUMP** | **none** | a **pile size**. It divides into nothing. |

`runways()` is **structurally unable** to print a runway for the dump bucket, and
`runwayBlock()` in the tracker will not draw one however symmetrical the table
wants to look. Printing weeks for the dump would re-commit the original error in
the other bucket.

### The bucket is a judged field, and Ops does not derive it

`bucket` (`precious` | `dump` | `null`) is the **sixth JUDGED field** on
`provenance/asset-table.json`, beside `verdict` and `revealArc` — declared in
`JUDGED` and documented in `_bucket` in `tools/asset-table.mjs`, carried across a
scan and never written by one. `npm run assets` prints the tally.

**It is null on all 315 rows**, and the refusal to derive it is deliberate. A
heuristic — *a machine photograph is precious, a manual page is dump* — would
make every tracker read as **answered** while nothing had been answered, which is
the same class of defect as the void figure with better manners.

### So the honest two-number version is a bound, and it says so

| bucket | assigned | runway |
|---|---|---|
| PRECIOUS | **0** | nothing assigned — no runway to compute |
| DUMP | **0** | no ceiling, so no runway. A pile size. |
| UNASSIGNED | **16** | the honest state today |

Of the 16 pictures an entry can reach for today, **0 are assigned precious and 16
could be** — so the precious runway runs from **nothing at all to 6–8 weeks**,
and the whole of that gap is a judgement nobody has made. Open row **B-a**.

**Note what happened to the number itself:** 6–8 survives and its **unit** moved
from days to weeks. That is visible on the page on purpose.

---

## B2 — 013 IS KEPT, AND MIKE'S OWN CRITERION IS WHAT PICKED IT

He offered two ways to clear it out of the way — retire it, or leave it clearly
marked as the prototype it was — and **one criterion**: whichever keeps the
Record honest **and the machinery exercised**. The criterion picks the second,
and the arithmetic is not close.

**Retiring it empties the volume, and an empty volume exercises nothing:**

- `RecordEntry.jsx` never mounts.
- `RECORD_TITLE_MAX` / `RECORD_LINE_MAX` — R3's *"that failure disappears by
  construction"* — police no string.
- The per-entry `record.NNN` derivation in `ledger-declare.mjs` loops over
  nothing, and `reveal:check`'s Record-parity check becomes vacuous.
- `delivered()` returns the empty set — which pulls `rear_power_switch.png` back
  behind the stage door and **leaves the pull-back rule with no positive case
  anywhere in the museum.**

Every one of those is a mechanism that would rot silently until 001 lands.

### And the mark goes in Ops' instruments, never on the glass

*"This entry was a prototype"* is a line whose **subject is the making of the
museum**. Doctrine 11 refuses it at any live address. **The entry's own text
asserts nothing false** — four facts Mike supplied about a real object, with a
real photograph of it — so the glass needs no correction at all; only the
instruments that reason about the story do.

Marked in: `RECORD_ENTRY[13]`'s note and the notes on `doc.record` and
`face.wbr.record` in `reveal/ledger-declare.mjs` (the ledger's `note` and `deps`
never ship — `publicLedger()` is a four-field allowlist), the artifact tracker,
the week-one page and the index. **Nothing in `src/` changed this round at all.**

### How W-1 closes — with a fourth answer that was not on the list

W-1 offered three readings: *day 1 opens with the entry that is there, or that
entry is re-dated, or day 1 adds one.* **All three assumed the entry in the tree
and day one's entry had to be the same entry.** Mike dissolved the premise
instead: 013 is not in the sequence. So day 1's entry is **001 and does not exist
yet**, and the collision is **gone rather than decided**.

The check is **kept on `week1.html` in gold with his ruling beside it**, not
deleted — the collision was real, it is why the ruling was needed, and a page
that quietly drops what it used to say cannot be checked against itself a week
later. Day 1's `shape` in `reveal/week-one.mjs` lost *"and holds one entry"*, which
was the sentence doing the false implying.

### How M19 closes

*"THE REAL RECORD STARTS AT 001 when Mike dictates it"* answers *what a record
number means*: the numbers are **this volume's own and they begin at 001** — not
the full 436-record numbering, which v47 had already deleted for having been
invented. Deps struck from `doc.record` and `face.wbr.record`.

### THE FINDING M19's CLOSURE PRODUCED, AND IT IS ABOUT A DIFFERENT ROW

**C8's stated blocker was the wrong one.** That row read *"it works the moment
M19 is answered."* M19 is answered and **nothing moved** — because
`face.recordEpoch` is a **DATE** (which day is day one, `src/lib/record-model.js`
`entryWeek`) and M19 was about **numbers**. What C8 actually waits on is **the
date of Record 001**, which arrives when Mike dictates it. Same status, honest
blocker. Only closing M19 could have exposed it.

### What was deliberately NOT done: the number

Under Mike's own ruling the volume counts from 001, which makes **013 a number in
a sequence that has not started.** It is left alone:

- he said the entry **needs no re-dating or defending**;
- `no` is the field `record.NNN`, `delivered()`, the ledger parity check and the
  budgets are all keyed on;
- changing it is his word, not Ops' inference.

It is **B-b** and it is one word. Worth knowing while answering it: **the
machinery for an unnumbered entry already exists and has never run** —
`record-entries.mjs` carries `no: null` deliberately, and `ledger-declare.mjs`
**hard-exits** on one rather than mint an id. That refusal was written while M19
was open and now needs re-reading against an answered M19.

---

## B3 — the register and the pages

**`docs/OPEN_ACTIONS.md`:** `M19` **CLOSED** · `W-1` **CLOSED** · short-list row
`15f` struck · `C8`'s blocker corrected · two new rows **`B-a`** (nothing is
bucketed) and **`B-b`** (013's number), each with its short-list entry `15h` /
`15i`.

**`docs/canonical/OPERATIONS.md`:** §7 **Doctrine 20** (the corrected law) · two
§5 file-map rows. **`STATE.md`:** both rulings mirrored.

**The pages Mike opens are unchanged in path** —
`docs/dictation-20260807/index.html`, rebuilt with `npm run dictation`. The
artifact tracker gains a **bucket** line on every row, three filters
(*precious* / *dump* / *no bucket yet*) and the two-runway table; week one's void
arithmetic is replaced by the same block; the index carries both rulings.

---

## Gates

| gate | result |
|---|---|
| `npm run lint` | **11 errors / 9 warnings — baseline, zero new** |
| `npm run build` | **green**, built in 475ms |
| `npm run provenance:gate` | **PASS** |
| `npm run reveal:check` | **PASS** — all nine checks |
| `npm run parity:gate` | **PASS** — 4 shared · 0 divergences |
| `npm run instory:gate` | **PASS** — 0 findings |
| `npm run assets:orphans` | **0** |
| the lap | **DID NOT RUN — see below** |

**Provenance needed no rows.** The gate's boundary is `src/` and `index.html`;
nothing in `src/` changed and these pages render to `docs/` and are never served.

### THE LAP DID NOT RUN, AND THAT IS SAID PLAINLY RATHER THAN LEFT AS A SILENCE

**The Chrome extension is not connected in this session** — `tabs_context_mcp`
returns *"Browser extension is not connected"*, twice. N5's recipe needs a real
browser to drive the same-origin iframe; headless Chrome and CDP emulation were
both considered and rejected when the rig was built (`tools/lap.mjs` header), and
installing one now to close a gate is not a thing to do at seal time.

**What mitigates it, stated as mitigation and not as a substitute:**

- **No `src/` file changed.** The museum's glass is byte-identical to the state
  lapped yesterday at 389px and 1233px.
- The three changed files are `docs/` Ops instruments, **never served**.
- A **static structural check** was run over all five generated pages instead:
  every `<table>` is inside a `.tw` scroller (**3 of 3 on week1, 3 of 3 on
  artifacts, 0 unwrapped anywhere**), no new hard width was introduced (the
  `min-width:760px` and `width:280px` literals both pre-date this round and are
  in the HEAD version W1 measured), and there are **no images on any page** so
  there is nothing to break.
- The one new element is a **third `.tw` table** on two pages, of the same class
  and construction as the two W1 measured — whose 42 elements painting past the
  edge were *"all inside the two `.tw` table scrollers"*, by design.

**That is weaker than a measurement and it is not being called one.** The rig is
committed and the pages are unchanged on disk; the lap should run on the next
session that has a browser.

**The lap rig was removed before the seal** — the harness copy in
`docs/dictation-20260807/` is deleted and the throwaway server killed, same
reasoning as `npm run lap:clean`.

---

## Surfacing — read, not a gate

**20 spendable · 13 promised and unbuilt · 0 idle files.** Unmoved again, and
this is **the third packet running** that has not taken anything off the back
shelf — K was tooling, W1 was drafting, B is a correction. The proposed cadence
says one round of building ahead is stock and **two is a habit**; three is worth
saying out loud. Nothing was logged with `--log` because nothing moved.

The report also still reports `2 row(s) belong to no wing` — `room.curtain` and
`room.slow`. Pre-existing, untouched, visible in its own output.

---

## What this round did NOT do

- **Did not assign a single bucket.** `B-a` is the whole of that, and deriving
  one would have been the void figure's own defect in a new coat.
- **Did not touch Record 013's number.** `B-b`.
- **Did not touch any file in `src/`.** Nothing a visitor sees changed.
- **Did not close K-b.** Still no outline authored by Mike; unmoved by this
  round.
- **Did not run the lap.** Said above, not buried.
