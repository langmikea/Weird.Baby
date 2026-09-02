# RECORD 001 — MIKE'S WORDS

**Round log · 2026-08-08 · drafting lane · single agent · nothing deployed**

This file exists for one reason before any other: **§0 below is the source every
`MIKE` row added this round cites.** The provenance gate can check that a string
has a declared origin; it cannot check that the declaration is true. The only
thing that can is a copy of the material as it arrived, written down before it
was touched. That is §0.

---

## §0 — THE DICTATION, AS IT ARRIVED

Relayed to Ops on 2026-08-08 through the remote-control kickoff, quoted here in
full and unedited. Everything the Record's entry 001 prints comes from inside
this block.

> RECORD 001 — MIKE'S WORDS. Single agent, drafting lane, NO GIT until seal,
> standing gates. S-a IS RULED: EVERYTHING IN THE FORM IS STORY. The worksheet is
> a story instrument, not a project log - in-story always. Doctrine 11 is
> satisfied by that ruling; record it as a general rule, not an answer about one
> entry.
>
> Land Mike's dictation into Record 001 VERBATIM. No editing, no smoothing, no
> reordering, no added prose. All of it declared MIKE, gold rail.
>
> HEADLINE: Weird.Baby Initial Launch Report
>
> EXECUTIVE SUMMARY:
> Congratulations!
> Weird.Baby launched to the world at 12:00 am Monday morning, on schedule and on
> spec; the Weird.Baby website is live, a clean hand-off was made made, and
> Operations has the ball.
> Reportable Incident - The Weird.Baby email server has been subject to an
> onslaught of data that would appear to be unrelated to our primary mission.
> Full containment was made to prevent disruptions of service prior to turning on
> the Weird.Baby website. Data continues to be received.
>
> DETAILED REPORT:
> FRIDAY DAY (-3)
> &nbsp;&nbsp;15:00 - Weird.Baby email server goes public (scheduled early auto start)
> &nbsp;&nbsp;15:01 - Weird.Baby email server BIST - PASS
> &nbsp;&nbsp;15:14 - First data packet received
> &nbsp;&nbsp;15:58 - Second data packet received
> &nbsp;&nbsp;16:00 - Onslaught - Incoming data =  86% vs threshold
> &nbsp;&nbsp;16:10 - Server auto-shutdown, auto containment. and auto alerts
> &nbsp;&nbsp;16:13 - REACT - Team is convened
> &nbsp;&nbsp;23:30 - REACT - RULING - Restart with 50x resources. Stress test.
> The decision to resume was determined to be low risk, reversible, and we still
> did not know exactly what the data meant.
>
> VERBATIM MEANS VERBATIM: "made made" in the executive summary is his text - do
> not correct it. The double space in "= 86%" is his - do not normalise it. If a
> typo genuinely cannot ship, FLAG IT for him rather than fixing it silently.
> Reconcile with the eight timeline beats already on the entry - they came from an
> Ops paraphrase and his own text supersedes them; do not print both.
> Then answer S-b with his actual material rather than as an open question, and
> report what the entry looks like at 390px now that it carries a summary.
> SEAL per §8, explicit paths, push if permitted (else hand to Mike), report.
> STOP - mirror/deploy Mike's.

**The `&nbsp;&nbsp;` above is this file's markdown, not his text** — the eight
beats arrived indented two spaces under `FRIDAY DAY (-3)` and a markdown
blockquote eats leading whitespace. The beats themselves are quoted from the
first character of the time. Nothing else in the block is annotated.

**A machine-checkable copy of the thirteen strings** lives in the verification
script quoted in §3; it is what proved the entry byte-identical to this block.

---

## §1 — WHAT LANDED

`src/data/artists/robots.js`, Record entry `no: 1`, thirteen strings in two
sections:

| Section | Body |
|---|---|
| `EXECUTIVE SUMMARY` | three paragraphs — *Congratulations!* · the launch paragraph · the Reportable Incident paragraph |
| `DETAILED REPORT` | `FRIDAY DAY (-3)`, the eight beats, and his closing sentence about the decision to resume |

**The eight Ops beats are gone, not kept beside his.** S2 shipped
`15:00 · SERVER PUBLIC`, `16:13 · REACT CONVENED` and six more in the house's
register voice, built from a parenthetical summary of a timeline nobody had
sent. His own text supersedes them: the strings are deleted from the file and
their nine register rows (eight beats plus the Ops label `Timeline`) are pruned.
Printing both would put two accounts of one afternoon on one page and ask a
reader to reconcile them.

### The one structural decision, named

His document has three levels — `DETAILED REPORT:` → `FRIDAY DAY (-3)` → the
beats. `RecordEntry.jsx` has two: a section label and a section body. So
**`FRIDAY DAY (-3)` is the section's first paragraph** — his words at their own
position, one level of hierarchy flattened, nothing added and nothing dropped.
The alternative was a third section labelled with his day heading and a second
one holding only the closing sentence, which invents a section boundary he did
not write.

### The two labels are his own headings, in his capitals

`.vp-rec-sect-label` is `text-transform: uppercase`, so the glass is identical
whichever case sits in the data. That makes his capitals the free choice, and
therefore the right one.

---

## §2 — THE THREE THINGS THAT LOOK LIKE ERRORS AND ARE KEPT

Named here, in the file's own comment, and reported to him — so that no later
round "tidies" one and no later reader assumes a transcription slip.

| In his text | What it looks like | Status |
|---|---|---|
| `a clean hand-off was made made` | a doubled word | **KEPT.** He named it in the instruction. |
| `Incoming data =  86% vs threshold` | two spaces after the equals sign | **KEPT IN THE DATA.** See below — the renderer, not the data, is where it changes. |
| `auto containment. and auto alerts` | a full stop mid-clause, then a lower-case *and* | **KEPT AND FLAGGED.** He did not name this one; it is the third typo and it is his to rule on. |

**The double space is a rendering fact, and it is reported rather than papered
over.** The string in `robots.js` has both spaces and the verification in §3
asserts it. HTML collapses runs of whitespace in normal `white-space` mode, so
the paragraph draws with one. Preserving it on the glass would mean either a
`white-space: pre-wrap` on record bodies — a layout change to every entry, for
one character — or replacing his space with a `&nbsp;`, which changes his
character. **Neither was done.** If he wants the second space visible, that is a
one-line ruling and it is his.

Nothing else was touched: not the hyphens standing in for dashes, not `50x`, not
the order, not the paragraphing.

---

## §3 — VERBATIM, PROVED RATHER THAN ASSERTED

The entry is authored with string concatenation (the file wraps at ~78 columns
and two of his paragraphs are 178 and 283 characters). Concatenation is exactly
the construction that can lose a space at a join, so it was checked by machine
rather than by eye: the block was sliced out of `robots.js`, evaluated, and
compared element by element against a literal copy of §0.

```
VERBATIM MATCH — 13 strings byte-identical
title: "Weird.Baby Initial Launch Report" 32 chars (budget 62)
exec summary: 477 chars over 3 paragraphs; 479 joined
line/lead/tomb/date: undefined undefined undefined undefined
double space present: true
made made present: true
```

---

## §4 — S-a IS RULED, AND IT IS RULED AS A GENERAL RULE

> **"EVERYTHING IN THE FORM IS STORY. The worksheet is a story instrument, not a
> project log — in-story always."** — Mike, 2026-08-08

S-a asked one question about one entry: is the launch report an event in the
story, or a real report about building this website? **He answered a larger
question than the one asked, and the larger answer is the one that was
recorded.** It is now `OPERATIONS.md` §7 **Doctrine 21**, mirrored in `STATE.md`
and `CLAUDE.md`.

**Why the general form matters more than the ruling on 001.** S-a was going to
recur. Every future dictation through `worksheet.html` produces material whose
subject can be read two ways — a launch, a server, a decision at 23:30 — and
Doctrine 11 would have made each one a fresh adjudication with an entry sitting
on the glass while it waited. The instruments are in-story by construction, so
what comes out of them is in-story, and Doctrine 11 is satisfied at the
instrument rather than at the entry.

**What it does NOT do, stated so the doctrine is not over-read:** it does not
exempt Ops' own prose. A line Ops writes about the drafting, the round, the
renderer or the register still fails Doctrine 11 wherever it appears, including
inside a Record entry. The rule is about material that arrives THROUGH the
dictation instruments, not about everything that ends up near it.

S-a closes.

---

## §5 — S-b IS ANSWERED WITH HIS MATERIAL, AND ONE HALF OF IT DOES NOT FIT

S-b asked for three things: **the summary (130 characters), the lead, and the
detailed sections.** He supplied an executive summary and a detailed report.

**Two of the three landed whole.** The detailed sections are §1. The lead —
the paragraph that survives being read alone — is his executive summary, and it
is carried in the entry as the first section.

**The third does not fit, and no sentence of his was drafted into the gap.**

| | |
|---|---|
| his executive summary | **477 characters**, three paragraphs |
| the index row's slot | **130 characters** (`RECORD_LINE_MAX`, `tools/reveal-ledger.mjs`) |
| his own rule behind that number | *"every index row gets a headline and a summary beneath it, ALL CONSTRAINED TO THE SAME HEIGHT, and THE ENTIRE SUMMARY MUST FIT."* |

The number is not taste — it is the measured two-line capacity of a fixed-height
row with no truncation left in it anywhere. A 477-character summary is seven
lines at that measure, which is not an index row.

**What was NOT done, and why.** Only one paragraph of his executive summary fits
130 characters — `Congratulations!`, at 16 — and setting that as the row's
summary would tell a reader nothing about the report while claiming to summarise
it. His closing sentence from the detailed report fits at 120 characters, but it
is the last line of the report rather than its summary. **Choosing which of his
sentences becomes the summary is an edit**, and the instruction forbids edits;
it is also the precise shape of the failure S-b was raised to prevent.

So `line` is still absent, `001`'s index row is still short, and the residual
ask is **one sentence, ≤130 characters**, in his words. That is a smaller
question than S-b asked yesterday and it is recorded as such.

`lead` and `tomb` are absent for their own reasons: `lead` renders a single
paragraph and his summary is three, so flattening them is the same edit by
another route; he wrote no closing line and Ops will not invent the place the
lights go off. `date` is absent because none was supplied — *Monday morning* and
*FRIDAY DAY (-3)* are in his text, a calendar date is not — which is why
**C8** (`recordEpoch`) has not moved either.

---

## §6 — THE ENTRY AT 390px, MEASURED

Measured on the built bundle through `npm run lap`, driven in Chrome, viewport
asserted at **`clientWidth: 390` exactly** on every route below.

### The opened entry — this is what his summary bought

| | |
|---|---|
| dateline | `Record 001` (undated, as designed) |
| headline | *Weird.Baby Initial Launch Report* |
| `EXECUTIVE SUMMARY` | 3 paragraphs · **339px** |
| `DETAILED REPORT` | 10 paragraphs · **497px** |
| lead / tombstone | none rendered — neither is declared |
| walk | `2 of 2`, ‹ NEWER / OLDER › both live |
| page-level horizontal overflow | **0** |
| console errors | **0** · broken images **0** |

All thirteen paragraphs render. `was made made` is on the glass. `auto
containment. and auto alerts` is on the glass. The section labels draw as
`EXECUTIVE SUMMARY` and `DETAILED REPORT`.

### The index row — the honest answer to the question asked

| row | height at 390px | what it carries |
|---|---|---|
| **013** | **157px** | headline + a four-line summary |
| **001** | **84px** | headline only |

**Unchanged from S-b's measurement.** The ENTRY carries his summary; the INDEX
ROW does not, and cannot at 130 characters. §5 is why.

### The double space, measured rather than described

The paragraph was cloned into the live page and measured at the same computed
font, twice:

| | |
|---|---|
| `=  86%` (his two spaces), `white-space: normal` | **385.16px** |
| `= 86%` (one space), `white-space: normal` | **385.16px** |
| `=  86%` under `white-space: pre` | **388.67px** |

Identical to the hundredth of a pixel with and without his second space: the
browser collapses it. Under `pre` it is worth **3.51px**. The data keeps both
spaces; the glass shows one; the ruling that would change that is his.

### Routes lapped

| route | clientWidth | page overflow | past the edge | errors |
|---|---|---|---|---|
| `/robots` | 390 | 0 | 6 (the coverflow, pre-existing) | 0 |
| `/robots/record` | 390 | 0 | 6 (the coverflow, pre-existing) | 0 |
| `/` | 390 | 0 | 0 | 0 |
| `/booth` | 390 | 0 | 0 | 0 |

The six elements painting past the right edge on the wing are `div.cf-album`
and their images — the coverflow's off-stage covers inside
`div.cf-wrap { overflow-x: hidden }`. Pre-existing, unrelated to this round, and
the page itself does not scroll sideways.

**The Doctrine 19 anchor test does not apply to this expander and the reading
says so.** `anchorTest("button.vp-rec-open", 1)` reports 8 of 47 elements moved
above the anchor with `scrollDelta 0` — and all 8 are the index rows and their
own children, which the open state REPLACES (`.vp-rec-index` is not in the DOM
once a record is open). Opening a Record is a swap, not a disclosure. Nothing
outside the index moved.

---

## §7 — GATES

| gate | result |
|---|---|
| `npm run lint` | **11 errors / 9 warnings — baseline, zero new** |
| `npm run build` | **green** |
| `npm run provenance:gate` | **PASS** — 0 undeclared, 0 stale, invention ceiling 0 |
| `npm run reveal:check` | **PASS** — *"the 2 Record row(s) match the Record's own entries exactly"*, *"every Record headline fits 62 characters and every summary 130"* |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** — 22 strings read, 0 findings |
| `npm run assets:orphans` | **0** |
| `npm run reveal:day` | *Nothing to move. The tree and the Record agree.* — 2 record entries, 18 governed pictures, 0 to place, 0 to pull back |
| the lap | **RAN at 390px**, four routes, 0 page overflow, 0 console errors |
| `npm run lap:clean` | **run before the seal**, `public/_lap.html` absent, rebuilt after |
| `npm run surfacing` | **20 spendable, unmoved — the SIXTH packet running.** Not a gate and it cannot fail; recorded because it is the only clock this repository has. This packet landed dictated content and moved nothing off the shelf. |

### Register bookkeeping

15 rows added (13 bodies + 2 labels), all `MIKE`, all citing §0 of this file.
9 rows pruned (8 Ops beats + the Ops label `Timeline`). **The prune procedure was
followed in its corrected form** — register copied first, then the stale set
checked for inbound `RESTATED` references (**0**), then `--prune`, then the gate.
No chain broke.

---

## §7a — ONE INSTRUMENT DEFECT FOUND IN PASSING, AND FIXED

**The lap was about to run at 386px while every report of it said 390.** The
harness sized its iframe at 405px on the arithmetic that a classic scrollbar is
15px wide. On the operator's Chrome this round it is **19px**, so the first
measurement of the round came back `clientWidth: 386`.

Nothing was ever false — the harness has always printed the true `clientWidth`,
which is exactly how this was caught, by reading the number instead of assuming
it. But a gate whose one job is to measure at a width must ESTABLISH the width
rather than assume it. `window.__lap.fit()` now adjusts the frame until the
viewport is the target and returns the real number if it cannot get there;
`go()` calls it on every navigation. Re-run: **390 on all four routes.**

---

---

## §8 — WHAT THIS ROUND DID NOT DO

- **Nothing was deployed and nothing was mirrored.** Both are his.
- **`line` was not written.** §5.
- **The third typo was not fixed.** §2.
- **The double space was not made visible.** §2.
- **`RECORD_LINE_MAX` was not raised.** Widening the budget without widening the
  row makes the gate looser than the glass, which is the unsafe direction; the
  row height is a layout ruling and it is his.
- **S-c was not fixed.** A long-form entry still drops `wire`, `plates` and
  `docs` silently. It did not bite again this round — the timeline is a section
  body — and where a payload sits against authored sections is still his ruling.
