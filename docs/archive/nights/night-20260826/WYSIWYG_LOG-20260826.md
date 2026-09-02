# THE MUSEUM PRESERVES WHAT HE TYPES (2026-08-26, third round)

**HEAD at start `f0a4fd2`.** Mike's question killed the hint and found the
mechanism underneath it.

> **"Is it WYSIWYG? If so, that is the test."**
> **"a long line can be used to make a paragraph; the short line is defined
> when wrapping is not preferred."**

**IT WAS NOT.** The editor drew `pre-wrap`, the museum drew `pre-line`. A run
of spaces showed in the box and collapsed on the page — what he typed and what
a visitor read were two different strings, and the `2 spaces off` hint existed
only to announce the gap.

**SIX FILES:** `src/routes/exhibit/Exhibit.css`,
`src/routes/exhibit/RecordEntry.jsx`, `tools/dictation/day.mjs`,
`tools/dictation/day-collect.js`, `tools/dictation/day-proof.mjs`, and the page
they generate.

---

## 1 · THE SWEEP — EVERY PLACE THE TWO ENDS DISAGREED

**IT WAS NOT ONE PLACE AND ONE OF THEM WAS DESTROYING DATA TODAY.**

| # | where | the disagreement | status |
|---|---|---|---|
| **1** | `.vp-rec-sect-body` — every section body | museum `pre-line`, editor `pre-wrap` | **FIXED** |
| **2** | `.vp-rec-sum` — the deck, index and opened | museum `pre-line`, editor `pre-wrap` | **FIXED** |
| **3** | **the DECK's CONTROL** | the museum draws two lines; **Piece 4 put it in an `<input>`, which cannot hold one** | **FIXED — and it was live data loss** |
| **4** | `.vp-rec-lead`, `.vp-rec-tomb`, `.vp-rec-sect-label`, `.vp-rec-still-cap`, the Record's `.vp-fe-note` | **no `white-space` at all** → `normal`, which turns a newline into a space. Latent: no entry carries one today | **FIXED while latent** |
| **5** | the dedent | the editor stripped his common indent for display and put it back on save, and **announced it** | **REMOVED** |
| **6** | a `{pre}` listing | museum draws a GRID, editor draws a monospace box | **REPORTED, not changed — see §5** |
| **7** | the box's FACE | editor `ui-monospace` at 68ch, museum Arial at 68ch — the same cap, different wrap points | **REPORTED — see §5** |

### THE ONE THAT WAS LOSING HIS WORDS TODAY

**ALL FIVE DECKS ARE TWO LINES.** Every `line` in the Record carries a `\n`,
and the museum has drawn them as two since Mike ruled it on 2026-08-10.
**Piece 4 put the deck in a single-line `<input>`, and a browser strips CR and
LF from an input's value.** Measured on the served page before the fix:

```
orig    "> Weird.Baby website went live\n> Alert - Incoming Server Load  (contained)"
box     "> Weird.Baby website went live> Alert - Incoming Server Load  (contained)"
saved   the box's version.   IDENTICAL: false
```

**Opening the page and pressing Save flattened all five decks** — two lines run
together with nothing between them.

**AND `day:proof` WAS GREEN THE WHOLE TIME.** That is the finding underneath
the finding: P1–P3 drive `modelOf` and `collect` in node, so they prove the
COLLECTOR and can say nothing about the CONTROL the collector reads. **A proof
that never types into the real control cannot see a control that cannot hold
its own data.** `P4.1` closes it, on the built markup.

## 2 · WHAT CHANGED, BOTH ENDS

**MUSEUM.** `.vp-rec-sect-body` and `.vp-rec-sum` are `pre-wrap`, and one new
grouped rule gives the five latent fields the same declaration, scoped to the
Record so the shared `.vp-fe-note` does not retype the FAQ (A4). **Verified in
the built bundle**, not in the source: `dist/client/assets/tokens-*.css` carries
all three, and `vp-rec-sect-body{…pre-line}` returns **0**.

**EDITOR.** The deck is a `textarea`. **The dedent is gone** — `dedent`,
`reindent`, the per-block `cut`, `indentCut`, `data-cut` and the `· 2 spaces
off` hint are removed rather than defaulted to zero, because a transformation
that is always the identity is one waiting to be switched back on by somebody
who does not know why it was there.

**`S-e` IS CLOSED BY RULING.** The 2026-08-10 note recorded the double space in
Record 001's `=  86%` as *"not a thing this rule may decide"*. He decided it.

## 3 · WHAT A VISITOR SEES CHANGE — ALL FIVE RECORDS

**20 strings, 242 characters of his spacing that a visitor was not seeing.**

| Record | characters | lines gaining an indent | indent depths | inner runs of 2+ spaces |
|---|---:|---:|---|---:|
| **001** | **+92** across 7 strings | 25 | 2, 4, 7 | 1 |
| **002** | +50 across 3 strings | 15 | 2, 4 | 0 |
| **003** | **+78** across 4 strings | 13 | 2, 4, 7, 9 | 4 |
| **004** | +10 across 3 strings | 5 | 2 | 0 |
| **005** | +12 across 3 strings | 6 | 2 | 0 |

The biggest single ones: **003's attachment manifest +38** (`THE CEO         -
one page, redacted…` keeps its column), **002's manual listing +40**, **001's
event log +32**.

**RECORD 004's FOLDER TREE IS EXCLUDED AND THAT IS NOT AN OVERSIGHT.** It is a
`{pre}` item, drawn by `Listing`, which derives its columns from the text and
emits them as grid padding — it never reaches `.vp-rec-sect-body`, so no
white-space value has ever applied to it. Counting its 59 characters would have
reported a change to a visitor that does not happen.

### MEASURED ON THE REAL BUILT BUNDLE, NOT MODELLED

The museum was served from `dist/client` and Record 001 opened. The old
declaration was injected, measured, removed, and the restoration proved
identical.

| | at 1280 | at 390 |
|---|---|---|
| his indent, first glyph | **0 → 8.91px** (2 spaces), **0 → 17.84px** (4 spaces) | same |
| block height | **719 → 719px, unchanged** — nothing re-wraps | **1073 → 1138px, +6.1%** |
| extra lines | 0 | 2 paragraphs gain **2** and **1** |
| sideways overflow | 0 | **0** |
| console errors | 0 | 0 |

**SO THE HONEST SUMMARY IS: at desktop his indents appear and nothing moves; on
a phone two paragraphs of Record 001 get one and two lines taller.** He is
re-editing every Record before launch and this is what he is walking into.

## 4 · `day:proof` — P4, AND IT IS PROVED BY BREAKING IT

**38 checks, 7 of them losses.** P4 is three properties:

- **P4.1 THE CONTROL CAN HOLD THE DATA** — read off the BUILT PAGE. A box
  seeded with a newline must be a `textarea`; all five decks are named
  explicitly, because a check that only counts is a check that can go quiet.
  **LOST FIRST:** the deck's own box is turned back into the `<input>` on the
  real markup and the check names it.
- **P4.2 BOTH ENDS DECLARE THE SAME WHITE-SPACE** — the editor's out of the
  built page, the museum's out of `Exhibit.css`, plus the four latent classes.
- **P4.3 HIS STRINGS SURVIVE THAT DECLARATION** — all 46 render
  character-identical under `pre-wrap`. **LOST FIRST:** under `pre-line`, 20 of
  46 come out different and 242 characters are eaten, per Record.

**TWO BREAKAGES WERE WRONG BEFORE THEY WERE RIGHT, AND BOTH ARE WORTH
KEEPING.** The dedent mutation first hit `outOf` and changed **nothing** —
a `strs` block short-circuits in `blockOut` and never calls it, so the breakage
missed the path his bodies travel. And the deck check first read **0 deck
boxes**, because its search window ended before the box: the deck row carries
`data-budget`, the whole budget object as JSON, so the control is over a
kilobyte behind the attribute that names it. **A breakage that misses the live
path proves the check is asleep.**

## 5 · THE TWO PLACES THEY STILL DIFFER, REPORTED RATHER THAN CHANGED

**1 · A `{pre}` LISTING.** The editor shows a monospace box where his alignment
is true as typed; the museum shows a grid derived from that alignment. **This
survives on its own measurement, not on the one that just went away:** in Arial
the tree's second column spreads from 0 to **88.48px**, because a typed run of
spaces only measures anything in a uniform advance. `pre-wrap` keeps every one
of those spaces and the column still staggers — the grid is the only thing that
holds it at 0. Changing it would undo Mike's own 2026-08-20 ruling, *"This is
the wrong font. This is not a paste in."* **The comment in `RecordEntry.jsx`
that justified it by `pre-line` is rewritten**, because that half is now false.

**2 · THE FACE.** The editor's box is `ui-monospace` at 68ch — 68 characters
exactly, which is what makes the wrap warning honest. The museum is Arial at
68ch, where 68ch is 68 zeros and holds a different number of characters in
every sentence. **So the two agree about what is stored and still break lines
in different places.** Closing it means either giving up the honest character
count in the box or giving the museum a monospace body, and both are his call,
not a mechanism decision. **Flagged, not fixed.**

## 6 · GATES

| gate | exit |
|---|---|
| `npm run lint` | **1 — the baseline**: 17 problems, **9 errors / 8 warnings**, zero new |
| `npm run build` | **0** |
| `npm run provenance:gate` | **0** |
| `npm run reveal:check` | **0** |
| `npm run instory:gate` | **0** |
| `npm run parity:gate` | **0** |
| `npm run arc:check` | **0** |
| `npm run ops:size` | **0** |
| `npm run docs:numbers:gate` | **0** |
| `npm run record:land -- --verify` | **0** — 51 of 51 strings |
| `npm run day:proof` | **0 — ALL 38 CHECKS PASSED**, 7 shown LOSING first |
| `npm run reveal:day` | *"Nothing to move. The tree and the Record agree."* |
| `npm run lap:clean` | `removed public/_lap.html` |

**THE MUSEUM LAP: `npm run lap` STAGED THE HARNESS AND THE HARNESS WAS NOT
DRIVEN.** It wants `wrangler dev` on 8787. **What it measures was measured
directly instead, on the same built bundle** — served from `dist/client`, at
1280 and 390, Record 001 opened: sideways overflow **0** at both, console
errors **0**, and the pre-line/pre-wrap A/B above. Said plainly rather than
claimed as a lap.

**NOT PHOTOGRAPHED.** The browser pane would not composite, the same refusal as
pass five and the two rounds before this one.

**Nothing was landed:** `robots-record.js`, `record-draft.json` and
`readiness.json` are byte-identical to where they started.

**ONE PROBE LIED AND §8's RULE CAUGHT IT.** A sideways-overflow reading of
226px on the day editor was a **zero-width viewport** — `clientWidth` was 0
after a preset reset, so every element on the page "overflowed". Re-measured at
1280 and 390: **0 and 0.**

## 7 · CARRIED

- **`C-day2`** — four of five Records still cannot accept an edit; guard 6
  protects their standing reasoning. Untouched.
- **`STAGE_PREFIX` is imported by `day.mjs` and used by nothing.**
- **`record.html` still has the picker fallback**, mothballed.
