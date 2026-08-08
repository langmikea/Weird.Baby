# THE INDEX LINE + THE WARNING — round log, 2026-08-08

**Three instructions (I1–I3). All three answered. Nothing deployed.**

Gates: lint **11 errors / 9 warnings = baseline** · build **green** ·
`provenance:gate` **PASS** · `reveal:check` **PASS** · `parity:gate` **PASS,
4 shared · 0 divergences** · `instory:gate` **PASS** · `assets:orphans` **0** ·
`reveal:day` **nothing to move** · **the lap RAN at 390px** on the built bundle
for `/robots` and on all four Ops pages — page overflow **0** everywhere,
uncontained painting past the edge **0**, console errors **0**.

---

## §0 — THE INSTRUCTION, VERBATIM

This section exists because the provenance register cites it. Every row added
this round names this file and this section as its source.

> **I1.** RECORD 001's INDEX SUMMARY, approved by Mike: "Weird.Baby launched on
> schedule. The email server took an onslaught of unexplained data starting
> Friday." (105 characters). Land it. Declare it MIKE-approved, Ops-drafted -
> mark it honestly for what it is.
>
> **I2.** THE WORKSHEET MUST WARN HIM (Mike's ruling, and it is the general
> fix): the tool let him write a 477-character executive summary against a
> 130-character index budget and said nothing until a gate caught it three
> rounds later. FIX THE INSTRUMENT: every slot in the worksheet that feeds a
> constrained field shows its budget and its live count as he types, and warns
> visibly when he crosses it. He must never again discover a limit from a
> report. Audit every other slot for the same defect - any field with a
> downstream constraint that the worksheet does not surface - and fix them all,
> not just this one. State which limits exist and where they come from.
>
> **I3.** While you are in there: does a Record entry have any OTHER downstream
> constraint the worksheet is silent about (headline length, section count,
> asset naming, date format)? Surface every one.

**One measurement against the instruction, and it changes nothing.** The
sentence is **104 characters**, not 105. It is landed character for character as
supplied; the count is simply reported because this repository measures rather
than restates.

---

## §1 — I1: THE SENTENCE IS LANDED, AND IT IS THE ONLY STRING IN RECORD 001 THAT IS NOT HIS

`src/data/artists/robots.js`, entry `no: 1`:

```js
line: "Weird.Baby launched on schedule. The email server took " +
      "an onslaught of unexplained data starting Friday.",
```

### It is filed RESTATED, not MIKE, and that is the honest mark

Register key `9bc06a08f1257070`, class **RESTATED**, `r` resolving to the two
MIKE rows it restates — `f6a32ef902e54edf` (his launch paragraph) and
`21eff46d69225dde` (his reportable-incident paragraph), both two fields below it
in the same entry.

The instruction says *"declare it MIKE-approved, Ops-drafted — mark it honestly
for what it is."* The five origin classes make that one choice and only one:

- **MIKE** means *his words, his facts, his rulings*. It is his facts and his
  approval; **it is not his sentence.** Filing an Ops paraphrase as MIKE is the
  exact error the three-mark rule was written against — *a paraphrase in gold is
  indistinguishable a week later from something he said* — and it would sit in a
  register where the other fifteen rows for this entry are genuinely verbatim.
- **RESTATED** means *Ops prose that adds no specific*, and `r` must **resolve**.
  Every specific in the sentence — launched on schedule, the email server, an
  onslaught, Friday — is in the two rows named. It adds nothing.

So the approval is recorded in the row's `n` note, in the file's own comment
block, and here. **Three places, one of which a machine re-checks every run.**

### Why picking one of his sentences was refused and drafting one was not

The previous round left the row empty and gave the reason: his executive summary
is 477 characters against a 130-character budget, and **choosing which of his
sentences becomes the summary is an edit.** That has not changed. What changed is
that Mike drafted-and-approved is a different act from Ops-selected: Ops wrote a
sentence, he read it and approved it, and the register says which of those two
things happened.

### IT DRAWS IN TWO PLACES AND THAT WAS NOT ASKED FOR

`RecordEntry.jsx` renders `entry.lead || entry.line` as the lead paragraph. With
no `lead` on Record 001, **this sentence is both the index row's summary and the
opening paragraph above his EXECUTIVE SUMMARY heading.** Measured on the built
bundle at 390px: the lead renders, 75.23px, correct text, no overflow.

It was shipped rather than suppressed. It is a one-sentence summary that stands
alone, which is what a lead is for; it condenses his three paragraphs rather
than competing with them; and they remain whole and unedited underneath it.
**Suppressing it would mean changing a house render rule that Record 013 also
uses, on an inference.** One word from Mike reverses it either way — new register
row **I-a**.

### THE MEASUREMENT S-b ASKED FOR, ON THE BUILT BUNDLE

| | 013 | 001 | apart |
|---|---|---|---|
| index row, **1247px viewport** (the measure the budgets were taken at) | **94.39px** | **94.39px** | **0.00px** |
| index row, **390px** | 157.22px | 132.99px | 24.24px |
| the summary itself, 390px | 123 chars → 4 lines | 104 chars → 3 lines | one line |

**Before this round: 84px against 157px, 73px apart.**

**At the desktop measure Mike's R3 rule is now satisfied exactly** — both rows
94.39px, both summaries two lines in a 494.1px column. **At 390px it is not, and
the reason is the rule's own arithmetic rather than a defect:** a budget
guarantees a string FITS a measure; it cannot make two strings of different
length occupy the same number of lines at a NARROWER measure. Equal height at
phone width would need either a fixed-height row — which reintroduces the
truncation R3 deleted — or two summaries of near-identical length, which is
authoring. **It is reported, not fixed.** Row **I-b**.

---

## §2 — I2: THE INSTRUMENT WARNS NOW, AND THE DEFECT WAS BIGGER THAN A MISSING COUNTER

### The audit, slot by slot

Fifty-three slots exist across the two writing pages — 41 on the worksheet
(was 30) and 12 on the twelve-week table. What each one feeds:

| slot | feeds | limit | before | now |
|---|---|---|---|---|
| `W*.D*.HEAD` (×10) | Record entry `title` | **62 characters** | silent | live counter, warns |
| `W*.D*.LINE` (×10) | Record entry `line` | **130 characters** | **the slot did not exist** | new slot, live counter, warns |
| `W*.D*.EXEC` (×10) | a section body | none | silent | says plainly that it has no limit and is **not** what the index prints |
| `W*.D*.NOTES` (×10) | the sections | none | silent | says the 4–7 section shape and the payload drop |
| `REC.EPOCH` (×1) | `face.recordEpoch` | **format `YYYY-MM-DD`** | **the slot did not exist** | new slot, live format check |
| `ARC.W*` (×12) | a heading on these pages and nothing else | **none** | — | the page says so, once |

### THE DEFECT WAS A MISSING QUESTION, NOT ONLY A MISSING COUNTER

`EXEC` asks for *the paragraph a reader gets if they read nothing else*. That is
unbounded and correct — it lands in a section, and the length of a section is a
fact about the day. **The constrained field is a different one and the worksheet
never asked for it at all.** So he wrote the paragraph, Ops had nothing to put in
the row, and the row stayed empty for three rounds.

**Putting a 130-character meter on `EXEC` would have been wrong twice:** it would
police a field that has no limit and still never ask for the field that does.
`LINE` is the fix and the meter is the other half.

### The numbers are imported, never retyped

`RECORD_TITLE_MAX` and `RECORD_LINE_MAX` were module-private constants inside
`tools/reveal-ledger.mjs` — a script that reads the tree at load and dispatches
on `process.argv` at the bottom, so nothing could import it for two numbers. The
instrument's three options were retype them, import a script for its side
effects, or say nothing. **It said nothing.**

They now live in **`reveal/record-shape.mjs`** — plain data, no imports, no side
effects — with the whole of their measurement reasoning. Three readers: the gate
that enforces them, the worksheet's counters, and the reference page's table.
`tools/reveal-ledger.mjs` imports them and keeps a pointer where they used to be.

### It warns; it does not block

No `maxlength`. An input that refuses the 131st character has made the decision
for him mid-sentence and thrown the rest of the thought away. The text is always
his; the count is always visible; crossing the line turns the counter to
**"43 OVER"**, opens a red sentence saying by how much and which command will
refuse the packet, marks the textarea, and adds **"· 2 over the limit"** to the
fixed bar at the foot — because the field he broke is usually three screens above
the one he is typing in by the time he stops.

**And it travels.** An over-limit answer carries its own number into the *copy
everything* export (`!! OVER LIMIT: 140 characters, budget 130`), with a count in
the header. A length problem visible only in his browser is a length problem Ops
discovers at landing time, which is the same failure one step later.

**Three states, legible without colour.** The number itself changes to "43 OVER";
colour is the second signal, never the only one.

### It counts what would be SAVED, not what is in the box

`values()` strips trailing whitespace before storing. Counting the raw value
would report a character the packet never sees and put a field one over budget
for pressing the space bar. The meter and the gate must agree or the meter is
lying in the safest-looking direction.

### THE LAP FOUND A BUG THAT WOULD HAVE MADE THE WHOLE FEATURE INVISIBLE AT THE MOMENT IT MATTERED

The counter takes the state class `over`. The warning paragraph was written as
`.over{display:none}` / `.over.on{display:block}`. **The same selector.** So the
live counter's `display` computed to `none` **exactly when it went over budget** —
the one instant it had something to say. Caught by reading `getComputedStyle`
after a screenshot showed the number missing, not by reading the source: both
declarations are correct on their own and the collision is only visible in the
cascade. The warning is `.limwarn` now. **Two elements, two names.**

---

## §3 — I3: EVERY OTHER CONSTRAINT ON A RECORD ENTRY, SURFACED

Seventeen, declared in `reveal/record-shape.mjs` and printed as a table on
`reference.html#entry-shape`. **Six of the seventeen are SILENT** — breaking them
produces no error anywhere and the entry simply loses something.

The ones the instruction named by hand:

- **Headline length** — 62 characters, `reveal:check`. Now metered.
- **Section count** — Mike's approved container is **four to seven sections**,
  each one thought under a short all-caps label. **Nothing enforces it.** 013 has
  four; 001 has two. Advisory, and now said on the NOTES slot.
- **Asset naming** — every path-shaped string anywhere in an entry IS the day's
  publish manifest. It must exist at one of a governed picture's two addresses
  and have a row in the asset table (`deliveryFaults` check 4, `reveal:day`).
  Not a slot: he describes the picture, Ops resolves the path.
- **Date format** — exactly `YYYY-MM-DD`. **This is the worst of the six silent
  ones.** `entryDate()` returns null for anything else and nobody reports it: the
  entry renders and quietly has no dateline, no week number, no month band and no
  target for a newspaper door. **It is now one slot with a live format check** —
  one, not ten, because `entryWeek()` counts from a declared epoch and asking ten
  times is nine chances for two answers to disagree. It is also the only thing
  **C8** has ever waited on and half of **S-b**.

The other silent ones, for the record: `line` drawing twice (§1); `lead`
rendering exactly one paragraph; `sections` suppressing `wire`/`plates`/`docs`
entirely (**S-c**, still open); and the two date-dependent derivations.

---

## §4 — WHAT WAS MEASURED

**`/robots`, built bundle under `wrangler dev`, 390px** — clientWidth 390
(established by `__lap.fit()`, not assumed), page overflow **0**, console errors
**0**, broken images **0**. Six elements paint past the right edge and all six
are the coverflow's own albums inside `div.cf-wrap` (`overflow-x: hidden`) —
pre-existing, unchanged by this round.

**Record 001 opened at 390px** — headline, lead (the new sentence, 75.23px), both
his section labels, page overflow 0, errors 0.

**The four Ops pages at 390px** — `worksheet.html` (705 nodes, 41 slots, 21
meters), `arc.html` (322 nodes, 12 slots, **0** meters, correctly), 
`reference.html` (578 nodes, 6 scrolling tables), `index.html`. **Page overflow 0
on all four; uncontained painting past the edge 0 on all four** — the 165
elements past the edge on `reference.html` are all inside `overflow-x:auto` boxes,
which was checked rather than assumed. Console errors 0.

**The counter exercised end to end in the browser**: 43 over → `lim over`,
`limwarn on`, textarea `bad`, bar reads 2, export marks both rows; back under →
all four clear; `10 August 2026` → `NOT A DATE`; `2026-08-10` → `reads as a date`,
green. Test values were cleared from the throwaway origin's storage afterwards.

**Not run:** the Doctrine 19 anchor test. Neither writing page has an expander,
and a Record index row REPLACES the index rather than disclosing beneath it —
the same reading the previous round recorded.

---

## §5 — WHAT WAS NOT DONE, AND WHY

- **Nothing was deployed.** The seal is a commit; the deploy is Mike's.
- **`RECORD_LINE_MAX` was not raised** to fit a longer summary. Widening a budget
  without widening the box makes the glass stricter than the gate, which is the
  unsafe direction.
- **The lead render was not suppressed.** Row I-a.
- **Equal row height at 390px was not engineered.** Row I-b.
- **`sections` dropping `wire`/`plates`/`docs` was not fixed.** Still S-c; it is a
  layout ruling and it is Mike's.
- **Surfacing is unmoved at 20 spendable — the seventh packet running.** This
  packet landed one approved sentence and rebuilt an instrument; it took nothing
  off the back shelf. Said plainly, because the packet is the only clock this
  repository has.
