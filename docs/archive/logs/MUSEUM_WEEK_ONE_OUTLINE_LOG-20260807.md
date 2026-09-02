# THE WEEK ONE OUTLINE — round log

**Museum · W1 · 2026-08-07 · single agent, drafting lane, standing gates.**
Written to disk before the commit, per `OPERATIONS.md` §9 / Cowork hygiene §13.

---

## What the instruction was, and what it changed

K5 (yesterday's packet, same date) asked for *"week 1 as it stands"* — the week's
headline, each day's headline, each day's topics with their weights — and
**correctly refused to write it.** Nothing of the kind existed in either
repository, so it built the frame, left every content slot empty, and printed the
finding at the top of the page rather than burying it. That is register **K-b**.

This round supplies the content **from Ops**, whose material it is: Mike spoke the
week's shape aloud on **2026-08-02** and Ops structured it. The whole outline is
**BLUE RAIL — Ops-derived, rule named.** The gold slots are still empty.

**K-b is not closed by this.** There is still no outline authored by Mike in
either repository. What K-b now has is a working draft to argue with, which is a
different thing from an answer, and the page says so in those words.

---

## Where it went, and why not into the generator

**`reveal/week-one.mjs`** — a new data module, 13,345 bytes, sitting beside
`transfers.mjs` and `record-entries.mjs`.

The instruction said *"write this into whatever the dictation frame reads."* The
frame reads **data modules under `reveal/`**, and that is the whole reason this
did not go into `tools/dictation/prep.mjs` as prose: story material that lives
inside a rendering function cannot be diffed, cannot be checked against the
ledger, and quietly becomes the generator's opinion. `prep.mjs` reads it and
writes nothing back — the arrangement `contact-sheet.mjs` already carries.

Exports: `ORIGIN` · `WEEK` · `PRELUDE` (7 rows) · `DAYS` (5) · `FRIDAY_FORMULA` ·
`RECORD_RULES` (5) · `COLLISIONS` (5).

---

## THE ATTRIBUTION MODEL, WHICH IS THE ONLY DESIGN DECISION IN THIS ROUND

The instruction is explicit twice over: **BLUE RAIL**, and *"nothing here is his
verbatim except where marked."* Those two together forced a third marker, because
two grades of attribution were being asked to share one rail.

| grade | what it means | how it renders |
|---|---|---|
| `OPS` | Ops structured it from his spoken framing. The default; every day, the headline, the prelude, the topics. | blue rail, `blue rail` tag |
| `MIKE-NAMED` | He named the **rule** as a rule — the Friday formula, the five standing Record rules, the bouncy ball law. **The rule is his; the sentence is still Ops'.** | blue rail, amber `his rule · Ops wording` tag |
| — | his own words | **gold rail, and it is empty on every day** |

**NOTHING ON THE PAGE IS QUOTED AND THE PAGE SAYS SO IN ITS FIRST SENTENCE.** The
amber marker is deliberately *not* gold: a paraphrase wearing gold is
indistinguishable a week from now from something he actually said, and that is
the exact failure K5 refused to create. Marking the Friday formula gold would
have re-opened it under a new coat.

**One sentence on the page IS verbatim, and it is the one that was already there**
— the asset timeline's founding sentence, carried from `reveal/transfers.mjs`
where it has been in writing since 5 August with its source named. The page now
labels it *the only verbatim sentence anywhere on it*, which it could not do
before, because before there was nothing to contrast it with.

---

## THE FIVE CHECKS — and the one that does not agree

The useful thing Ops can do with an outline it did not write is run it against
the tree. Five checks, printed at the foot of the page, **named and not
resolved** — resolving one is authoring.

| id | check | verdict |
|---|---|---|
| **W-1** | **The one entry the Record holds is not about the transmissions.** | **UNRESOLVED — red** |
| W-2 | The prelude and the BLAST window are the same weekend, independently. | agrees |
| W-3 | Friday's payoff needs no arrival, and the model already says so. | agrees |
| W-4 | The bouncy ball law is the only rule here a tracker can measure. | agrees |
| W-5 | Nothing in week one reaches a PACKAGE, and the outline never asks it to. | agrees |

### W-1 in full, because it is the round's finding

Day 1 says the wing opens holding one entry. **That is true of the tree today** —
the Record holds exactly one. But it is **entry 013**, and its subject is a
physical delivery: a sealed modern bag, a USB-C adapter, a unit on charge. Read
`reveal/record-entries.mjs`; nothing in it touches a transmission, a manifesto or
a weekend.

Three readings, all three Mike's: day 1 opens with the entry that is there, or
that entry is re-dated, or day 1 adds one. **And `M19 — what a record number
means` is already open**, which is exactly the question "opens with one entry"
numbered 013 asks.

### W-2 is worth knowing about because nobody arranged it

The transfer model calls class 1 *"THE BLAST — Friday to Sunday, pre-launch"*,
written 2026-08-05 off the asset timeline. The prelude puts the address live
Friday 2pm and the museum open Monday. **They agree on the window without either
having been written from the other.** W-3 is the same shape: *"one password was
short enough"* is an UNLOCK by the model's own definition — *"things already held
that could not be opened. No arrival needed"* — so the week's biggest moment
costs the story no new arrival. The model was built for this and nobody checked
until now.

### W-4 is arithmetic and it is printed live

The bouncy ball law is a ceiling of two or three offerings a day. **16 pictures
are behind the stage door one entry away.** At three a day that is 6 days of
material; at two a day, 8 — **1.1 to 1.6 five-day weeks, if every offering were a
photograph, and they are not.** Read it as a ceiling on the picture supply and
nothing more. The count is computed at render time, not written into the data,
because the count moves.

---

## What the standing rules do to the frame

Printed as a two-column table, each rule beside **what it does to week one**,
because "waiting on a rule" is a status and not an instruction:

- **End-of-day summary, published in the afternoon** → a day's entry can know how
  the day ended.
- **Rests on weekends; the team never does** → five entries at most, not seven,
  and Monday can inherit a weekend. This is where `WEEK.spanRule` comes from —
  the five-day frame is derived from this rule rather than guessed.
- **A daily record may run across multiple days** → **THE DAY COUNT IS NOT THE
  ENTRY COUNT.** The frame is a frame of days; it promises nothing about entries.
- **Status can be reported through the box** → a day can be substantial without
  opening anything. This is what makes day 4 a day rather than a wait.
- **The bouncy ball law** → see W-4.

---

## Gates

| gate | result |
|---|---|
| `npm run lint` | **11 errors / 9 warnings — baseline, zero new** |
| `npm run build` | **green**, built in 403ms |
| `npm run provenance:gate` | **PASS** |
| `npm run reveal:check` | **PASS** — all nine checks |
| `npm run parity:gate` | **PASS** — 4 shared · 0 divergences |
| `npm run instory:gate` | **PASS** — 0 findings |
| `npm run assets:orphans` | **0** |
| the lap | **see below** |

**Provenance needed no rows.** The gate's boundary is `src/` and `index.html`;
these pages render to `docs/` and are never served — they are Ops instruments and
must never become routes, for the same Doctrine 11 reason as `reveal:cards` and
the contact sheet.

### The lap, and the rig it needed

The dictation pages are files under `docs/`, not museum routes, so `npm run lap`
does not reach them — its harness needs same-origin HTTP. **A throwaway static
server on 127.0.0.1:8899 rooted at the repo, with `tools/lap/harness.html` copied
in beside the pages**, gave the same measurement N5's recipe gives: a real
`clientWidth` inside a real iframe, not pixels read off a screenshot.

| | narrow | wide |
|---|---|---|
| measured `clientWidth` | **389** (iframe 402) | **1233** (iframe 1245) |
| page horizontal overflow | **0** | **0** |
| elements painting past the edge | 42, **all inside the two `.tw` table scrollers** | **0** |
| inner scrollers | `div.tw` ×2 — by design | none needed |
| console errors · broken images | **0 · 0** | **0 · 0** |

All five pages were re-lapped narrow, not only the two that changed:
`index` · `week1` · `artifacts` · `eggs` · `specsheet` — **zero page overflow and
zero console errors on every one.**

**The harness copy was deleted and the server killed before the seal.** Same
reasoning as `npm run lap:clean`: a lap rig left in a content directory is one
command away from shipping.

---

## Files

| file | change |
|---|---|
| `reveal/week-one.mjs` | **new** — the outline as data, 13,345 bytes |
| `tools/dictation/prep.mjs` | imports it; `buildWeek1` renders prelude, days, Friday formula, standing rules and collisions; `buildIndex` card rewritten; header block rewritten; `.rail` / `.tl` CSS added |
| `docs/dictation-20260807/week1.html` | regenerated — 12 KB → **31 KB** |
| `docs/dictation-20260807/index.html` | regenerated |
| `docs/dictation-20260807/artifacts.html`, `eggs.html` | regenerated — **+12 lines each, the shared CSS block only** |
| `docs/dictation-20260807/specsheet.html` | **unchanged**, correctly |

**The path Mike opens is unchanged: `docs/dictation-20260807/index.html`,
rebuilt with `npm run dictation`.**

---

## Surfacing — read, not a gate

**20 spendable · 13 promised and unbuilt · 0 idle files.** Unmoved by this round,
and this is **the second packet running** that has not taken anything off the back
shelf — K was a tooling packet and W1 is a drafting packet. The proposed cadence
says one round of building ahead is stock and two is a habit. **Recorded here so
the next round's number means something**; nothing was logged with `--log`
because nothing moved.

The report also still reports `2 row(s) belong to no wing` — `room.curtain` and
`room.slow`. Pre-existing, untouched, and already visible in its own output.

---

## What this round did NOT do

- **Did not close K-b.** Status moved, not closed. See the register.
- **Did not write a gold line.** Every gold slot on every day is empty.
- **Did not resolve W-1.** Three readings named, none chosen.
- **Did not touch the Record, the ledger, the asset table or any `src/` file.**
  Nothing visitor-facing changed; `git status` is five files and one of them is
  new.
- **Did not add weights.** The instruction's own source material carries topics
  but no weighting, and inventing a distribution would have been the same defect
  as inventing a headline. The absence is not printed as a gap on the page
  because the topics are lists, not a ranking — but it is recorded here.
