# ONE LEVEL OF INDENT, BOTH ENDS (2026-08-26, fourth round)

**HEAD at start `698c5b2`.** Mike, on the editor:

> **"From Exec Summary and on, the indent is double indented, should not be."**

**FIVE FILES:** `src/routes/exhibit/RecordEntry.jsx`, `tools/dictation/day.mjs`,
`tools/dictation/day-collect.js`, `tools/dictation/day-proof.mjs`, and the page
they generate. **`Exhibit.css` is NOT among them** — `pre-wrap` stays.

---

## 1 · THE CAUSE, MEASURED BEFORE ANYTHING WAS TOUCHED

**OPS' HYPOTHESIS WAS RIGHT ABOUT THE MECHANISM AND UNDERSTATED THE COUNT: it
is THREE levels, not two, and it deepens down the page.**

Every section of every day, first glyph, at 1280:

| | editor, from the title box | museum, from the section label |
|---|---|---|
| structural indent (the recipe's one level) | **23px on every row** | **18px on every body** |
| HEADLINE, DECK — no leading spaces | + 0 | — |
| EXECUTIVE SUMMARY, DETAILED REPORT — 2 spaces | **+ 12.66px** | **+ 8.91px** |
| ADDENDA — 4 spaces | **+ 25.3px** | **+ 17.84px** |
| **distinct left edges** | **23 / 36 / 48** | **18 / 27 / 36** |

**BOTH ENDS. The museum double-indents exactly as Ops predicted** — `pre-wrap`
preserves the same leading spaces on the live page.

### AND THE CAUSE IS THE PREVIOUS ROUND'S OVER-REACH, NOT THE DEDENT'S REMOVAL BY ITSELF

**`pre-line` WAS DOING TWO THINGS AND ONLY ONE OF THEM WAS WRONG.** Measured:

```
SOURCE    "  > Weird.Baby launched on schedule.\n  > Operations has…"
pre-line  "> Weird.Baby launched on schedule.\n> Operations has…"   leading indent REMOVED
pre-wrap  "  > Weird.Baby launched on schedule.\n  > Operations has…" leading indent KEPT

inner run, source    "Incoming data =  86% vs threshold"
inner run, pre-line  "Incoming data = 86% vs threshold"              COLLAPSED
```

1. It **collapsed runs of spaces inside a line**. That was wrong, that is what
   his *"Is it WYSIWYG?"* was about, and moving to `pre-wrap` fixed it.
2. It **removed the leading indent of each line**. **That was RIGHT, and the
   editor's dedent agreed with it** — both ends put a body at one level.

Last round removed the dedent along with (1), on the reading that his indent now
reached a visitor. **It missed that the museum had been removing it too**, so
the box and the glass gained a second level on the same afternoon.

## 2 · THE FIX — ONE LEVEL, THE SAME REMOVAL AT BOTH ENDS

**MUSEUM:** `RecordEntry.jsx` gains `dedentPara`, which removes the **common**
leading run of each paragraph at render. `pre-wrap` stays, so `=  86%` still
draws with both spaces.

**EDITOR:** the dedent comes back in `day-collect.js`, and is put back on save.
**The data is not touched** — §0 VERBATIM, and `record:land` guard 6 refuses a
change to four of the five entries anyway (`C-day2`). An untouched box emits its
original byte for byte; a box he changed is re-indented to that paragraph's own
level.

**THE `2 spaces off` ANNOUNCEMENT DOES NOT COME BACK.** Mike killed it, and a
rule both ends obey has nothing to announce.

### THE ONE THE FIRST CUT GOT WRONG, AND IT WAS THE LAST SECTION OF A DAY

**Ops asked for the LAST section as well as the first, and that is where it
was.** The museum dedents **per paragraph**; the editor's box **groups**
paragraphs, and a first cut dedented the joined text. Record 003's ADDENDUM 02
holds one paragraph at 4 spaces and one at 2, so the group's minimum is 2:

```
editor box      "  THE CEO         - one page, redacted to th…"
museum paragraph  "THE CEO         - one page, redacted to the…"
AGREE? false
```

**The cut is per paragraph now, at both ends**, and each block carries one cut
per item. A newly typed paragraph takes the level of the one before it.

**P5.1 HAD ALREADY PASSED ON THAT SECTION** because it compared one BODY ITEM
against one museum paragraph — the wrong unit. It compares **the BOX** now,
which is the unit a person looks at.

## 3 · WHAT IT MEANS FOR THE MUSEUM — BOTH ENDS, VERIFIED SERVED

**EDITOR — `http://127.0.0.1:8899/`, all five days, every box:**

```
distinct left edges:  { "23px + 0 spaces": 26 }     ← one, across all 26 boxes
1 FIRST 23px+0  field:title        1 LAST 23px+0  section:ADDENDUM 03 …
2 FIRST 23px+0  field:title        2 LAST 23px+0  section:ADDENDUM 01 …
3 FIRST 23px+0  field:title        3 LAST 23px+0  section:ADDENDUM 02 …
4 FIRST 23px+0  field:title        4 LAST 23px+0  section:DETAILED REPORT
5 FIRST 23px+0  field:title        5 LAST 23px+0  section:OTHER
```

**MUSEUM — the real built bundle, all five Records walked with the record's own
nav, 19 bodies:**

```
distinct left edges:  { "18px + 0": 19 }            ← one, across all 19
1 of 5 FIRST 18px+0 … LAST 18px+0      4 of 5 FIRST 18px+0 … LAST 18px+0
2 of 5 FIRST 18px+0 … LAST 18px+0      5 of 5 FIRST 18px+0 … LAST 18px+0
3 of 5 FIRST 18px+0 … LAST 18px+0
```

**AND WHAT HAD TO SURVIVE, DID.** On Record 003, live:

```
lines:            leading spaces:
"> Ops now wants an Early-Pull-Off …"      0
"> Data Deluge ZIP File - The outer …"     0
"     Manual Pages Recovered"              5
"       SCAN 07 - POWER SYSTEM"            7
"       SCAN 11 - VID-LINK"                7
"       SCAN 31 - PARITY BIAS"             7
```

First line flush, `SCAN 07` still hanging under `Manual Pages Recovered`. And
the manifest's inner run is intact: `"THE CEO         - one page, redacted…"`.
**Console errors 0 at both ends.**

**NOT PHOTOGRAPHED.** The browser pane would not composite — the fourth round
running.

## 4 · `day:proof` GAINS P5 — 45 CHECKS, 9 LOSSES

- **P5.1 THE TWO DEDENTS AGREE**, compared at the BOX across all 15 section
  boxes. `RecordEntry.jsx`'s `dedentPara` is lifted out of its own source and
  run, not reimplemented in the proof.
  **LOST FIRST:** a museum stripping ALL leading whitespace rather than the
  COMMON run — 2 of 19 bodies disagree, every relative step would flatten, and
  a flat paragraph would look identical.
- **P5.2 ONE LEVEL** — no body reaches either surface with a leading run left.
  **LOST FIRST:** before the cut, **19 of 19** carried one, at 2 and 4 spaces.
- **P5.3 AND HIS STRUCTURE SURVIVES IT** — relative steps in 2 bodies, inner
  runs in 1.

**THE TWO DUPLICATED DEDENTS ARE ASSERTED, NOT MERGED.** A museum component may
not import from `tools/`, so the relation is checked instead — the tree's own
answer to a pair of functions that must not drift.

## 5 · THREE PROBES LIED THIS ROUND AND EACH IS WORTH THE LINE

- **A BREAKAGE THAT MISSES THE LIVE PATH PROVES THE CHECK IS ASLEEP — third
  time in this file.** The `save-what-you-show` mutation removed the re-indent
  and changed nothing, because the untouched short-circuit returns the original
  items before the re-indent is reached. It removes **both halves** now.
- **P5.1's UNIT.** Named above: it passed on the section that was wrong.
- **A `\n\n` THAT BECAME A REAL NEWLINE.** Two of this round's patch scripts
  wrote a literal line break into a JS string through a shell heredoc, in
  `day-collect.js` and `day-proof.mjs`. `node --check` caught both; the join is
  a named constant, `PARA`, now.

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
| `npm run day:proof` | **0 — ALL 45 CHECKS PASSED**, 9 shown LOSING first |
| `npm run reveal:day` | *"Nothing to move. The tree and the Record agree."* |
| `npm run lap:clean` | nothing left in `public/` |

**THE MUSEUM LAP WAS NOT DRIVEN** — it wants `wrangler dev` on 8787. What it
measures was measured directly on the same built bundle, at 1280, walking all
five Records. Said plainly rather than claimed as a lap.

**Nothing was landed:** `robots-record.js`, `record-draft.json` and
`readiness.json` are byte-identical to where they started.

## 7 · CARRIED

- **`C-day2`** — four of five Records cannot accept an edit; guard 6 protects
  their reasoning. **It is also why the fix is a render rule and not a data
  normalisation**, which would otherwise have been the tidier mechanism.
- **The `{pre}` listing and the box's FACE** remain the two places the editor
  and the museum draw the same string differently. Unchanged, and argued at
  `RecordEntry.jsx`.
- **`STAGE_PREFIX` is imported by `day.mjs` and used by nothing.**
