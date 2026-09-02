# THE DAY EDITOR — THE SCROLL AND THE INDENT (2026-08-25, fourth pass)

**HEAD at start `4c7e6df`.** Mike committed pass three mid-round, so this is a
fourth commit and no earlier message file is touched. Two files changed:
`tools/dictation/day.mjs` and the page it generates.

---

## 2. THE INDENT — THE CAUSE, FOUND BEFORE ANYTHING WAS CHANGED

**IT WAS NOT NESTING, AND THE MEASUREMENT SAYS SO.** On the served page, before
any edit, every section on Record 001:

| | first section | … | last section |
|---|---|---|---|
| TITLE box left edge | **326** | 326 | **326** |
| LINES box left edge | **340** | 340 | **340** |
| **first GLYPH** | **349** | **362** | **374** |

**The boxes were already equal — first and last. What deepened was the first
glyph.** So the recipe's one level was never the problem; there is no cumulative
rule and nothing nests.

**THE DEPTH IS IN THE TEXT.** Measured across all five days: every section body
carries its own leading run of spaces — **2 for the summaries, 4 for the
addenda**, and 7 to 10 deeper inside two of them. It reads as deepening down the
page because the addenda always come after the summaries. That is *"artificial
indents, each at a deeper level"* exactly.

**AND IT REACHES NO VISITOR — WHICH IS WHAT MAKES "ARTIFICIAL" THE RIGHT WORD.**
The museum sets a Record body `white-space: pre-line` (`.vp-rec-sect-body`,
`Exhibit.css:4931`), and `pre-line` collapses a run of spaces. **Measured in the
browser rather than read off the stylesheet** — the same string, same face:

- `pre-line` (the museum): first glyph at **0px**
- `pre-wrap` (this editor): first glyph at **25.3px**

So the indentation is an artefact of how the source is typed, the glass has
never shown it, and only this page's `pre-wrap` exposed it. My own choice last
round, made for a good reason — Record 004's folder tree is columnar and
`pre-line` would flatten it — with a consequence I did not measure.

### THE FIX: THE COMMON PREFIX COMES OFF FOR DISPLAY

`dedent()` removes the **smallest** leading run across the non-empty lines of
each body. That takes off exactly the uniform artificial level and leaves every
relative step he authored.

**AFTER, MEASURED ON ALL FIVE DAYS, FIRST SECTION TO LAST:**

| | value |
|---|---|
| TITLE box edges | **320** — one value, every section, every day |
| LINES box edges | **334** — one value. One level = **14px** |
| **first GLYPH** | **343** — ONE value, every section, every day |

Before: three glyph depths on one day. After: one, and it is the same one on
Records 001–005, on the first section and on the last.

**HIS STRUCTURE SURVIVED, CHECKED ON THE TWO PLACES IT MATTERS.** Record 004's
folder tree still hangs `PORTAL_2v16.CFG` and `TERMINAL.EXE` under `/PORTAL`,
with `QC_101.TIF` under `/INSTALL`; Record 003's `SCAN 07 / 11 / 31` still sit
under `Manual Pages Recovered`. Only the uniform prefix moved.

**IT IS NEVER SILENT.** The hint reads *"…longest 65 of 68 characters, 4 leading
spaces removed"*, and says the museum collapses it entirely and that nothing is
written to the data. This page still writes nothing.

**WHY NOT SIMPLY MATCH THE GLASS WITH `pre-line`:** it collapses EVERY run, so
the folder tree and the manifest would flatten into prose — worse than the
glass, which draws a `{pre}` body as an aligned listing. Dedenting keeps more of
what he wrote than either rule.

> **[FLAG — found here, filed onto register row `C-day1`] THE DRAFT LOSES
> `{pre}` AS WELL AS `wire` AND `plates`.** `robots-record.js:531` declares
> Record 004's folder tree as `{ pre: "…" }` and the museum renders it through
> its `Listing` component; `draftEntries()` hands this page a plain string, so
> the editor cannot tell a listing from a paragraph. **It is a THIRD field lost
> in the same round-trip**, and it belongs to the same repair that now gates
> Piece 4. Recorded in `day.mjs` at `dedent()`; the register row already exists.

---

## 1. THE RECORD SCROLLS, NOT THE PAGE

`html` and `body` are pinned to the viewport, the bar is a fixed-size first
item, and the three columns own their own overflow.

**MEASURED AT 1280×800:**

- **The page cannot scroll at all** — `window.scrollTo(0,900)` plus
  `documentElement.scrollTop = 900` plus `body.scrollTop = 900` leaves the
  total at **0**.
- **The record scrolled 567px and the bar, the calendar and the shelf each
  moved 0px**, all three still on screen with the record at its bottom.
- The shelf, **open with 138 tiles**, is 732px tall, its bottom inside the
  viewport, and it scrolls inside itself.

### TWO DEFECTS IN MY FIRST CUT, BOTH CAUGHT BY MEASURING RATHER THAN LOOKING

**(1) `overflow:hidden` ON `body` ALONE DID NOT HOLD THE PAGE.** The `html`
element still scrolled: every column sat still while `window.scrollTo` moved the
page 500px. The furniture stayed put only for as long as nobody put a wheel over
it. `html{overflow:hidden}` as well, and the page now refuses every method
tried.

**(2) THE SHELF PANEL SPILLED INSTEAD OF SCROLLING.** With the scroll on the
panel's inner box, the shelf's content measured **2102px tall inside a 732px
panel, scrolling nothing** — with `min-height:0` and `flex-shrink:1` both
already set. The cause: a panel is `align-self:start` so a CLOSED one is its own
height, which makes its height **auto**, and `max-height` only caps the box
afterwards — a flex child laid out against that auto height never shrinks. **The
scroll moved onto the element that carries the `max-height`**, which does not
depend on any child-sizing rule. The cost, stated: the shelf's own summary
scrolls with its tiles.

**AND ONE COLUMN IS A PHONE, SO A PHONE SCROLLS THE PAGE.** Below 820px the
whole mechanism releases — `html` and `body` both back to `visible`, no second
scroller, page scrolls normally. **Verified at 390px: the page scrolls, sideways
overflow 0, and the indent is still one level (glyph edge 343 → 71, one value).**
Three stacked independent scrollers on a phone is a worse instrument than the
ordinary one.

**A PROBE OF MINE READ FALSE FIRST.** The initial scroll test reported the
layout inert — `body` overflow `visible`, page scrollable, the shelf 2733px down
the document. Suspect the probe: the browser pane was **under 820px wide**, so
my own phone fallback was doing exactly what it says. Re-measured at 1280×800.

---

## VERIFIED SERVED

`http://127.0.0.1:8931/dictation-20260807/day.html`

- **411 marks, 411 two-line hints, zero bare**, `[title]` returns exactly 411.
- **One count on the page** — `128/130`, 002's deck.
- The viewer opens served at **742×960**; the state button still cycles
  `quiet → loud → off → quiet` after the layout change, store back to `{}`.
- **0 console errors.** Sideways overflow 0 at both widths.

**NOT PHOTOGRAPHED.** The browser pane would not composite — *"the page is not
compositing frames"* — so there is no screenshot this round either. Everything
above is measured through the DOM, computed styles and Range geometry.

## GATES — real exit codes, captured per gate

| gate | exit |
|---|---|
| `npm run lint` | **1 — the baseline**: 17 problems, **9 errors / 8 warnings**, zero new. eslint exits 1 on any error, so this gate is read by its counts |
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
changed. **`git status` is the two files this round touched.**

## FLAGGED, NOT FIXED

**`STAGE_PREFIX` is imported by `day.mjs` and used by nothing.** Carried from
pass one.
