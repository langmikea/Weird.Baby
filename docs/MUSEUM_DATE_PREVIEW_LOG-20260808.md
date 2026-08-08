# THE DATE + THE LIVE PREVIEW — round log, 2026-08-08

**Six instructions (D1–D6). All six answered, and one of them rests on a premise
that is not true of this tree — said at the top rather than buried.**

Gates: lint **11 errors / 9 warnings = baseline** · build **green** ·
`provenance:gate` **PASS** · `reveal:check` **PASS** · `parity:gate` **PASS, 4
shared · 0 divergences** · `instory:gate` **PASS** · `assets:orphans` **0** ·
`reveal:day` **nothing to move** · **the lap RAN at 390px and at the operator's
own 1228px** on `/robots`, `/`, `/foundation`, `/wb` and all four Ops pages —
page overflow **0**, uncontained painting past the edge **0**, console errors
**0**.

---

## §0 — THE INSTRUCTION, VERBATIM

Cited by the provenance register: the date below is declared MIKE against this
section.

> **D1.** RECORD 001 IS DATED 2026-08-17 (Mike, pending launch happening that
> day). RECORD THE RULE ABOVE THE DATE: THE STORY PLAYS OUT IN REAL TIME ON REAL
> DATES — an entry's date is the actual calendar day it is published, not a
> fictional offset. Land the date, close C8, and confirm what it turns on: the
> dateline, the week number, the month band, and anything else counting from the
> epoch. If launch slips, one field moves and everything follows — verify that is
> true rather than assuming it.
>
> **D2.** I-a RULED — SUPPRESS. The index sentence prints once, in the index. It
> must not also render as the lead paragraph above Mike's own EXECUTIVE SUMMARY
> heading. Note that RecordEntry.jsx renders lead || line and 013 uses the same
> rule — do not break 013 to fix 001; if the render rule must change, make both
> correct.
>
> **D3.** I-b is WITHDRAWN by Mike — the phone-width height difference between
> index rows needs no action. Close it.
>
> **D4.** THE LIVE PREVIEW (Mike's ask, and it is the worksheet's biggest
> remaining gap): while he writes, he must see EXACTLY WHAT THE RECORD WILL LOOK
> LIKE ON THE PAGE, in real time. His own suggestions, any of which is
> acceptable: repurpose the left column where Ops notes currently sit; move the
> Ops notes elsewhere; or two views he can flip between. CHOOSE and say why. THE
> REQUIREMENT IS FIDELITY — the same type, the same scale, the same measure, the
> same wrapping, the same section rendering the live site uses. A preview that
> approximates is worse than none, because he will trust it. If true fidelity
> means rendering the actual component, do that rather than reimplementing its
> look. It updates as he types.
>
> **D5.** Apply this to every week he has completed and every week he has not —
> the preview is part of the instrument now, not a one-off for week 1.
>
> **D6.** Verify the legibility work from the previous round is reflected in the
> preview — whatever the Record's type became, the preview shows that, not what
> it was.

---

## §1 — D1: THE DATE, THE RULE ABOVE IT, AND THE SLIP TEST

`RECORD_EPOCH = "2026-08-17"` — one module-level constant in
`src/data/artists/robots.js`, used by Record 001's `date` and by the Record
face's `recordEpoch`. **The rule is written above it**, in the file, as a
standing rule and not a note about one entry: *an entry's date is the actual
calendar day it is published, not a fictional offset.*

### It agrees with his own text, and that was checked rather than assumed

**2026-08-17 is a Monday.** His report says the site went live *"at 12:00 am
Monday morning."* His `FRIDAY DAY (-3)` heading lands on **2026-08-14, a
Friday.** Nothing was adjusted to make either true.

### One field moves and everything follows — PROVED, not assumed

**(a) The wiring.** Parsed with acorn:

```
RECORD_EPOCH declarations : 1   literal: "2026-08-17"
date-shaped literals in the whole file : 1  [ '2026-08-17' ]
consumers:  recordEpoch  Identifier "RECORD_EPOCH"
            date         Identifier "RECORD_EPOCH"
```

(The file's other twenty-eight `date:` properties are plate captions — `MAR
2021`, `FRONT`, `REAR` — a different field on a different object, named here so
nobody counts them as dates.)

**(b) What follows.** `src/lib/record-model.js` run against the constant and
against two slipped days:

| epoch | stamp | weekday | week | dateline | band |
|---|---|---|---|---|---|
| **2026-08-17** | `17 AUG 26` | Monday | 1 | `Week 1 · Monday · Record 001` | AUG 2026, **not drawn** |
| 2026-08-24 | `24 AUG 26` | Monday | 1 | `Week 1 · Monday · Record 001` | AUG 2026, not drawn |
| 2026-09-01 | `01 SEP 26` | Tuesday | 1 | `Week 1 · Tuesday · Record 001` | SEP 2026, not drawn |

**(c) Why one field and not two — the failure the coupling removes.** Move the
entry and leave the epoch behind, as two literals invite:

```
entry 2026-08-24, epoch left at 2026-08-17
  ->  "Week 2 · Monday · Record 001"
```

The stamp is right and **the week number is wrong on day one**, and nothing
anywhere reports it. That is why it is a constant.

### What it turns on, and what it does not

| | |
|---|---|
| register stamp | **ON** — `17 AUG 26`, on the index row's mark rail and in the opened entry's head |
| weekday | **ON** — `Monday` |
| week number | **ON** — `Week 1`; needs both the entry's date and the face's epoch, and now has both |
| dateline | **ON** — `Week 1 · Monday · Record 001`, three parts where it printed one |
| **month band** | **OFF, and it is not a defect.** `shouldBand` needs **14 entries across more than one month**; the volume holds two. `C1` is unmoved and now says so with the real reason. |
| the outline's own dates | **ON, and this is the payoff nobody asked for** — every day of weeks one and two derives from the epoch, which is what lets the new preview print a real stamp. See §3. |
| `entriesMode:"log"` order | unchanged — 013 still renders above 001 |

**`C8` closes.** It has been sharpened three rounds running and waited on exactly
this field.

**Not done:** 013 is still undated, by Mike's own ruling that the prototype needs
no re-dating. Its dateline still prints `Record 013` alone — measured, unchanged.

---

## §2 — D2: THE FALLBACK IS GONE AND 013 DID NOT MOVE

`RecordEntry.jsx` rendered `{(entry.lead || entry.line) && …}`. It now renders
`{entry.lead && …}`.

**Why the fallback looked right and was not.** `line` is *one true sentence* and
a lead is *the one paragraph that survives being read alone*, so they looked like
one field seen from two places. They are not: `line` is written to a
130-character budget measured off the **index row**; a lead is written for the
top of a document. On Record 001 the difference was the whole problem — an
Ops-drafted summary in blockquote weight sitting directly above Mike's own
EXECUTIVE SUMMARY heading, which is two summaries of one report stacked, smaller
one first.

**013 could not be reached by the change, and that was the constraint rather than
luck.** It declares BOTH `lead` and `line`, so it always took the left-hand side.
Measured after, at 390px on the built bundle:

| | Record 001 | Record 013 |
|---|---|---|
| `.vp-rec-lead` present | **no** (was yes) | **yes**, 100.32px |
| first thing under the headline | his `EXECUTIVE SUMMARY` label | his lead paragraph |
| dateline | `Week 1 · Monday · Record 001` | `Record 013` |
| tombstone | — | `The unit is drawing power.` |
| sections | 2 | 4 |

**The door's peek keeps `lead || line`, and the asymmetry is deliberate.** A
newspaper door pops another record's HEAD — stamp, headline, one line — which is
an index row in a card, and the index row is exactly where the summary belongs.
Mike's ruling is about the LEAD PARAGRAPH of an opened entry.

---

## §3 — D4/D5: THE PREVIEW, AND WHY IT IS THE THIRD OPTION

### The choice, and the reason is arithmetic rather than taste

He offered three: repurpose the Ops column, move the Ops notes, or **two views he
can flip between.** It is the third, and the reason is one line of CSS:

```
--face-fs: calc(clamp(1.02rem, min(1.35vw, 4.4cqh), 1.28rem) * .94)
```

**The museum's entire type scale is a function of the viewport**, and every
measure on the page is in `ch` of it — 68ch of body, 46ch of lead, 26ch of
headline. A preview is exact only if it occupies the same viewport the museum
would. A pane sharing the page with the form is at some other width, which means
a different size, a different measure and different wrapping: **the three things
he named.** Option (a) would also have deleted the Ops column he reads from and
(b) would have moved it somewhere he then has to go and find; the third option
costs neither.

### It renders the actual components

Per his ruling. `tools/dictation/preview/entry.jsx` imports
`RecordEntry.jsx`, `RecordIndexRow.jsx`, `src/index.css` and
`src/routes/exhibit/Exhibit.css` and is built by its own small vite config into
`docs/dictation-20260807/_preview/`. There is **no second implementation** of the
row, the sections, the door markers or the type. If a component stops importing,
the build fails and `npm run dictation` writes no page at all — a worksheet whose
preview pane is blank is worse than one with no preview, because blank reads as
*nothing written yet.*

**`RecordIndexRow.jsx` is new and exists only for this.** Half of what he writes
lands in the index row — the headline and the one-sentence summary — and that
half was JSX inlined in a `.map()` five levels deep in `Exhibit.jsx`. The preview
could copy it or omit it, and a copy drifts silently into a preview he has been
told to trust. Nothing about the row changed in the move; what stayed in
`Exhibit.jsx` is what is about the LIST rather than the row.

### The fidelity measurement

Both surfaces in the **same browser window** (`innerWidth` 1228), the museum as a
top-level document on the built bundle under `wrangler dev`:

| | live `/robots` | preview | |
|---|---|---|---|
| `100vw` | 1213.8px | 1213.8px | ✔ |
| `documentElement.clientWidth` | 1216 | 1216 | ✔ |
| `.vp-flat` width | 838.66px | 838.66px | ✔ |
| body font-size / line-height / letter-spacing | 15.4031 / 24.9531 / 0.0770156 | identical | ✔ |
| body `max-width` (R4's 68ch) | 678.656px | 678.656px | ✔ |
| headline font-size / `max-width` (26ch) | 20.0241 / 261.332px | identical | ✔ |
| section label / dateline font-size | 13.0927 / 11.4304 | identical | ✔ |
| families | Fraunces · Syne · DM Serif Display · Courier Prime | identical | ✔ |

Static check: **all 117 `.vp-rec-*` selectors** in `Exhibit.css` are present in
the built `preview.css`.

### AND IT WAS 0.4% WRONG UNTIL THE LAP MEASURED IT

The first cut stacked a bar above the frame and an editor below it, leaving the
frame **368px tall**. The clamp's middle term is `min(1.35vw, **4.4cqh**)` — the
ramp reads the viewport's **height** as well as its width. `4.4cqh` fell to
16.192px, under `1.35vw`'s 16.386px, the clamp dropped to its 1.02rem floor, and
the preview drew its body at **15.3408px against the live page's 15.4031px.**

Four tenths of one per cent: invisible, wrong, and exactly the *"nearly right"*
he ruled out. **The frame is the whole window now and the two strips float over
it.** He loses a band of the preview to the editor and can scroll it; he does not
lose the type. The rule this leaves behind is in
`tools/dictation/preview/README-fidelity.md` §4: **anything that reduces the
frame's width OR its height changes the type.**

### Real time, and one source of truth

The editor under the frame is a **proxy**: it writes through to the real textarea
and fires its `input` event, so saving, the counters, the over-budget bar and the
map mirrors all run down the one path they already ran down. Typing in the page's
own field updates the frame too. **A duplicate input with its own value is the
"one question, two answers" defect that cost this instrument a round;** there is
exactly one place any answer lives.

### D5 — every week, written or not

**All ten days** of weeks one and two carry a *See it on the page* button (10
buttons measured on the page), and every one of them shows a **real date** — week
1 day 1 is `17 AUG 26`, week 2 day 5 is `28 AUG 26` — derived from the epoch, not
invented. **The generator refuses to write the page if the derived weekday
disagrees with the outline's own `MON…FRI`**, because every day headline is
written for a named weekday and a slip that turned the Friday into a Wednesday
would otherwise be silent.

The **record number is not derived.** `no` is authored (M19); the preview passes
none and the mark rail draws empty, which is the component's own honest state.

### The one judgement it makes, and he controls it

Sections. **A line on its own in CAPITALS starts a section and is its label**;
everything under it is that section's paragraphs. It is how he dictated Record
001 — *EXECUTIVE SUMMARY*, then *DETAILED REPORT* — so it is the format he
already writes in, and it is printed on the worksheet above the boxes. Verified
in the browser: his own text produced three labelled sections. Write no capitals
line and it draws as one run of paragraphs, which is also honest.

---

## §4 — D6: THE PREMISE IS NOT TRUE OF THIS TREE, AND THE SUBSTANCE IS STILL ANSWERED

**There was no legibility work in the previous round.** Round `a652340` (I1–I3)
changed one data field, the provenance register, three tools and the documents;
**it touched no stylesheet and no type token.** `src/routes/exhibit/Exhibit.css`
and `src/styles/museum-tokens.css` were last edited two rounds earlier at
`a31127b` (THE NIGHT ROUND, 2026-08-06), and neither of that round's changes was
a legibility pass on the Record. A grep for *legib* across the repository's
markdown returns nothing about the Record's type. **§7 rule 7: map every kickoff
anchor to the tree and surface the mismatch rather than build against it.**

**The substance is answered anyway, and it is the more useful half.** The preview
shows the Record's type as it is TODAY **by construction** — it is built from
`Exhibit.css` itself, so there is no "what it was" for it to be showing. The two
type decisions the Record's body actually has had are both measured present:

- **A4's 6% ramp reduction** (`--face-zoom: .94`) — the preview's body is
  15.4031px = 16.386 × .94, the same number the live page computes.
- **R4's 56ch → 68ch measure** — the preview's `max-width` is 678.656px, the same
  678.656px the live page computes.

**And the mechanism, not the coincidence, is the answer to D6:** the day anybody
changes the Record's type, the next `npm run dictation` rebuilds `preview.css`
from the changed file. There is no copy to forget.

---

## §5 — TWO THINGS FOUND THAT NOBODY ASKED ABOUT

**A build config put the stage door's contents at a second address.** The first
run of the preview build had `root: REPO` and no `publicDir: false`, so vite
copied the whole of `public/` into `docs/…/_preview/` — **including
`public/held/`, the sixteen withheld photographs of the machines.** That is §8's
*a picture has two addresses* hazard produced by a build config, and the fact
that `docs/` is never served is luck rather than a mechanism. `publicDir: false`,
with the reason written above it.

**React came out twice and would not have rendered at all.** Vite substitutes
`process.env.NODE_ENV` for an app build and **does not** for a library build, so
the first bundle carried both the development and production copies of React
(588 KB) and would have thrown `process is not defined` on the first render.
Caught by reading the bundle rather than by opening the page. `define:` added;
199 KB, no `process.env` references, and the output is byte-identical across
consecutive runs (sha1 checked twice).

---

## §6 — WHAT WAS NOT DONE

- **Nothing was deployed.** The seal is a commit; the deploy is Mike's.
- **`I-b` is closed as withdrawn, and nothing was built for it** (D3). The
  measurement stands in the register for whoever reads it next: identical at the
  desktop measure, one line of wrap apart at 390px.
- **`S-c` is untouched** — a long-form entry still draws no `wire`, `plates` or
  `docs`. It is a layout ruling and it is Mike's. It now has a second consequence
  worth knowing: the preview cannot show those payloads either, because the
  component does not.
- **`013` was not re-dated**, per B2.
- **The preview bundle is committed** rather than gitignored: `worksheet.html` is
  committed and links to it, and a committed page that links to an uncommitted
  file is S1's own rule broken one level down. It is deterministic, so it churns
  only when the components or React change.
- **Surfacing unmoved at 20 spendable — the eighth packet running.**
