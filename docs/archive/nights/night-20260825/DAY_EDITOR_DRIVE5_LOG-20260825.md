# THE DAY EDITOR — THE LEGEND COMES OFF (2026-08-25, fifth pass)

**HEAD at start `d69867e`.** Mike committed pass four mid-round, so this is a
fifth commit. Two files: `tools/dictation/day.mjs` and the page it generates.

**THE SHAPE IS SETTLED** — *"Done! Looks great!"* This round is one kill.

---

## THE KILL: THE TOP BAR'S H E D S A P {} LEGEND

**IT WAS ONLY A KEY FOR THE CALENDAR ROWS.** The same seven marks were drawn
twice, one strip above the other: a legend across the top of the page, and the
row on every day in the calendar. The rows are how he reads across five days at
a glance; the bar told him nothing the rows were not already saying about the
day he had open. **A key that repeats the thing it explains, one line above it,
is furniture** — Doctrine 16, and it cost the page its whole top strip.

**WHAT WENT WITH IT, RATHER THAN BEING LEFT COMPUTED FOR NOBODY:**

| gone | why it existed |
|---|---|
| `.dy-top` / `.dy-bar` markup | the strip |
| `.dy-top`, `.dy-bar`, `.dy-ic`, `.dy-ic.ok/.warn/.bad` | its eight CSS rules |
| `MARKSBAR` | a JSON blob of every day's seven marks, inlined into the page **for the bar alone** — the calendar is rendered server-side by `calHtml` |
| `hintAttr()` | attribute-escaping for the bar's `innerHTML`; it had exactly one caller |
| `#dy-navspare` | an empty spacer span the painter appended |
| the painter block in `show()` | five lines that rebuilt the bar on every day change |

**AND TWO STRINGS ON THE GLASS WOULD HAVE BEEN LEFT LYING.** The calendar's
summary hint and its note both read *"the same seven marks as the bar above"* —
true until this round and false the moment the strip left. Both rewritten;
`/bar above/` now returns nothing on the rendered page. The `COLUMNS` block in
the source said the same thing in Ops' own words and now records that
`dayMarks()` has one caller, which is what that section was always describing.

**MEASURED ON THE SERVED PAGE:** `.dy-top` 0, `.dy-bar` 0, `.dy-ic` 0,
`#dy-icons` gone, `#dy-navspare` gone, and `MARKSBAR` / `hintAttr` return
**false** against the whole document source — nothing is left behind in the
markup or the script.

## THE CALENDAR ROWS ARE UNTOUCHED, WHICH WAS THE OTHER HALF OF THE INSTRUCTION

| | |
|---|---|
| days drawn | **5** |
| marks per row | **7, 7, 7, 7, 7** |
| the order, every row | **`H E D S A P {}`** — one unique string across all five |
| two-line hints | **every mark, all five rows** |
| states in use today | `quiet` and `off` |
| at 390px | **7, 7, 7, 7, 7** — unchanged |

## THE LAYOUT STILL HOLDS WITHOUT THE BAR

The bar was the first item of the body's flex column (`flex:0 0 auto`), so its
removal was worth re-measuring rather than assuming.

- `.dy-wrap` starts at **16px** (the body padding) and its bottom is inside the
  viewport — it still fills what is left.
- **The page cannot scroll**: `window.scrollTo(0,900)` plus
  `documentElement.scrollTop` plus `body.scrollTop` leaves the total at **0**.
- **The record scrolled 534px and the calendar and the shelf each moved 0px**,
  both still on screen.
- **The nav row did not drift.** `.dy-nav` still carries `margin-left:auto`,
  which existed to push it to the right end of the bar; measured, its left edge
  and the record column's left edge are the **same 286px**, because the rule is
  inert on a block-level flex container with auto width. **Left in place and
  named here** rather than removed — it is one inert declaration inside a rule
  that is still live for the previous/next buttons, and this round is a kill of
  one thing.
- Sideways overflow **0** at 1280 and at 390; the phone fallback still releases
  both `html` and `body`.

## NOTHING ELSE MOVED

- **404 marks, 404 two-line hints, zero bare** — and `[title]` returns exactly
  404. It was 411; the seven that left are the bar's.
- **One count on the page**, `128/130`.
- **The indent is one level on all five days** — first glyph at **343**, one
  value per day, first section to last.
- The state button still cycles `quiet → loud → off → quiet`, store back to `{}`.
- The viewer opens served at **742×960**, three buttons, closes clean.
- **0 console errors.**

**NOT PHOTOGRAPHED.** The browser pane would not composite — *"the page is not
compositing frames"* — so there is no screenshot this round either. Everything
above is measured through the DOM, computed styles and Range geometry.

## GATES — real exit codes, captured per gate

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
| `npm run reveal:day` | *"Nothing to move. The tree and the Record agree."* |
| `npm run lap:clean` | nothing left in `public/` |

**The museum lap was not run:** nothing in `src/`, `public/` or any data file
changed. `git status` is the two files this round touched.

## STILL OPEN, CARRIED

- **`STAGE_PREFIX` is imported by `day.mjs` and used by nothing.** Flagged since
  pass one.
- **Register `C-day1`** — the draft round-trip drops `wire`, `plates` and
  `{pre}`. It gates Piece 4, which is where his typing goes. Unchanged by this
  round.
