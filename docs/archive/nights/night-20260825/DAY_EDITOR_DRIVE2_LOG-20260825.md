# THE DAY EDITOR — HIS EIGHT, DRIVING IT AGAIN (2026-08-25, second pass)

**Scope: `tools/dictation/day.mjs`, the page it generates, and one new file —
`docs/dictation-20260807/readiness.json`, which is where his marks live.**

HEAD at start: **`9d50e8d`**. **Mike committed the first pass mid-round as
`3342832`**, so this is a SEPARATE commit and
`COMMIT_MSG_DAY-20260825.txt` is not touched — it is a landed message now.
This round's message is `COMMIT_MSG_DAY_DRIVE2-20260825.txt`.

---

## THE ONE THING THAT NEEDED REPORTING FIRST: WHERE HIS MARKS LIVE

Reported before item 7 was built, and built as reported.

| | |
|---|---|
| **File of record** | `docs/dictation-20260807/readiness.json`, read by the generator and **baked into the page**. Committed to the tree today holding `{"marks":{}}` — an empty file, because **absence of a mark is not a mark** and Ops does not seed one. |
| **Live store** | `localStorage["wb.day.readiness.v1"]`, written on every tick, merged over the baked file with the browser winning (the browser is where the last tick happened). |
| **Honest degradation** | If the browser refuses storage the page raises `assign.html`'s red banner and says the marks are on the screen and in the marks box only. Not built as a silent loss. |
| **Keys are identities** | `field:title`, `field:line`, `section:<the header he wrote>`, `attachment:<its title>`, under the record number. **Never a position** — inserting a section must not move a mark (§5, NO ID MOVES WHEN A LEGEND IS RECUT). |
| **Orphans are shown** | A mark whose element is gone draws in a MARKS WITH NO ELEMENT panel. **Proved by planting one:** a renamed header produced `MARKS WITH NO ELEMENT · 1` naming the stale key, rather than swallowing it. |
| **Never inferred** | Only the two booleans are stored. The system's verdict is recomputed every build and never written to the file. |
| **Not built, named** | The browser→file road. The page copies the JSON **with clipboard read-back** (U2's rule) and Ops lands it. `record-serve.mjs` is the proven POST-to-tree pattern and is the next step. |

---

## THE EIGHT

### 1. CHARACTER COUNTS COME OFF THE DAY SUMMARY

**MEASURED ON THE SERVED PAGE: there is exactly ONE count in the whole
document — `128/130`, Record 002's deck, one character from the gate.** Every
other count is gone: the bar, the calendar rows and every field label carried
one and now carry none.

A count is emitted when the limit is at risk (inside five characters) or
already broken, and in no other case. The bar and calendar carry **no counts at
any time** — his ruling is that they are *"not useful at Day level"*, and the
day summary is the Day level.

### 2. x1 DIES

The viewer has three buttons — close, previous, next. No steps, no state, no
`Z`. **Measured served: it opens at 742x960**, the one size, and the tiles stay
at 480 because a tile is a tile. The shelf's pictures have no second copy and
the hint says so where it would otherwise be a lie.

### 3. HEADLINE AND DECK BECOME SECTIONS

`element()` builds them and `elementHtml()` draws them, and **that is the only
row-drawing function on the page** — the headline, the deck, every authored
section and every attachment go through it. There is no `fld()`, no
`headerHtml`/`linesHtml` pair, no special case left.

**THE FIELDS ARE NOT DELETED, WHICH IS THE PART WORTH KEEPING.** A field draws
when it carries something. Today none of the five Records has a lead, a
tombstone, a still or a locked field, so none draws. The day one does, it draws
— as a section, in the same recipe. Removing them outright is how two Records
once landed and drew nothing at all while every gate passed.

### 4. LEAD AND TOMBSTONE COME OFF

Gone from the page, on his own rule. Verified: `TOMBSTONE` returns nothing in
the rendered body.

### 5. FILES THIS RECORD NAMES COMES OFF ENTIRELY

Gone. The door state survives where it belongs — on the file tiles inside an
attachment, and in the `P` column — because those answer *is this picture
published yet*, which is a question he can act on. The scraped flat list is not.

### 6. THE THREE MANDATORY SECTIONS

`MANDATORY` — Headline (**H**), Executive Summary (**E**), Detailed Report
(**D**), matched on the header he writes so the match is his vocabulary.

**PROVED BY BREAKING IT ON PURPOSE**, because all five days carry all three and
nothing would otherwise exercise the path: withholding `DETAILED REPORT` from
every day produced `1 NOT READY: DETAILED REPORT` on all five in the build log,
and on the page the **D column went loud**, the row drew in place with its
letter, a red box, `NOT READY` and `no lines`. Restored and re-verified
byte-for-byte after.

### 7. READINESS ON EVERY ELEMENT

Two marks, both his, both overriding the system, on **every section and every
attachment**: `NOT READY` (even if it passes) and `NOT REQUIRED` (don't show
me). Storage as reported above.

**THREE VOICES, HIS WORDS:** loud is red — box, letter and a `NOT READY` line;
ready is discrete — dim, no fuss; not required is **not presented** — the lines
box is gone and one dim dashed title line remains carrying its two boxes.

**THE FIRST CUT MADE A MARK A ONE-WAY DOOR AND THAT IS THE DEFECT WORTH
RECORDING.** It rendered only the state the element was in, so clearing NOT
REQUIRED in the browser had nothing to put back — the lines box had never been
written. **A mark he cannot take off is not a mark, it is a deletion.** Every
row now carries its lines, its loud line and its quiet line, and the class on
the row is the only thing that changes. **Verified: tick → `off`, lines hidden;
untick → `quiet`, lines back with the text intact.**

**AND HIS MARK OVERRIDES A CLEAN SYSTEM VERDICT, MEASURED:** the deck marked
NOT READY reads `data-fault="0"` and still goes loud.

Applied to sections and attachments — the elements he authors. The `P` and `{}`
columns carry **no** checkbox: they are readouts about files and a gate, not
about his work. There is no story-point row in the tree to mark, so none was
invented.

### 8. THE SECTION RECIPE, AND WHAT THE BOXES ARE SIZED TO

Title box **bold**. Lines box: accepts crlf, expands, spaced as he wrote it,
automatically indented, and **sized to its own wrap point**.

**THE WIDTHS, EACH FROM THE MUSEUM'S OWN BUDGETS:**

| box | width | what it is |
|---|---:|---|
| HEADLINE | **62 characters** | `RECORD_TITLE_MAX` — what `reveal:check` refuses over. `TITLE_BUDGET_MEASURED` puts the real wrap at **64** at 1280px, 58 at 768, 36 at 390 — so 62 is two tighter than the desktop line and twenty-six looser than the phone. A wrap here means the gate is about to refuse. |
| DECK | **65 characters** | `RECORD_LINE_MAX` 130 over the **two** lines of the index row `BUDGETS.line.holds` declares. A second line reaching the edge is the budget, exactly. |
| SECTION | **68 characters** | `.vp-rec-sect-body { max-width: 68ch }` in `Exhibit.css` — the museum's own body measure, chosen at R4 from the 65–75 band. A line that wraps here wraps on the glass. |

**MEASURED ON THE SERVED PAGE, ON THE VISIBLE DAY: 62 fits and 63 wraps; 65 and
66; 68 and 69.** Text area 392.0px / 411.0px / 430.0px against 392.0 / 411.0 /
430.0 for the characters themselves.

**THE FIRST CUT WAS 22% TOO WIDE AND THE WARNING WOULD HAVE COME THIRTEEN
CHARACTERS LATE.** Two causes, both fixed at the mechanism and both written
down there:
- **A `ch` resolves in the font of the element that DECLARES the max-width.**
  The box sat in the page's sans face while its paragraphs were monospace, so
  62ch was 62 sans zeros — **479px** — against **392px** for 62 monospace
  characters. The face is on the box now.
- **`box-sizing: border-box`** (the sheet's own reset) made the padding and
  border eat the measure, wrapping ~3 characters early. The box is
  `content-box`, so `max-width` means the TEXT.

**AND IT IS A MAXIMUM, WHICH IS AN HONEST LIMIT WORTH STATING:** at 390px every
box is narrower than its budget and wraps early. That errs toward warning him
TOO SOON, never too late; the alternative is a horizontal scrollbar inside every
section on a phone. Read the boxes at desktop width.

---

## VERIFIED SERVED

`http://127.0.0.1:8931/dictation-20260807/day.html`

- **473 marks, 473 two-line hints, zero bare, zero single-line** — and
  `[title]` returns exactly 473, so nothing outside the mark set wears one.
- **The seven columns are fixed, and it is measured rather than asserted:**
  every row on a day returns the SAME three column positions — one unique value
  across sections and attachments alike (`14,44,74` at the pane width tested).
- **The viewer opens on a real click at 742x960**, walks, and closes. 6 tiles,
  0 broken.
- **One network request for the whole page.** No path is resolved anywhere.
- **0 console errors. Page overflow 0 at desktop and at 390px**, and the
  viewer's overlay scrolls inside its own box while zoomed.
- **The copy control refused honestly** in the automation context — *"not
  verified — press Ctrl+C, the text is selected"* — which is the designed
  fallback and never claims a write it did not read back.

**A PROBE OF MINE WAS WRONG ONCE AND §8'S RULE CAUGHT IT.** A wrap measurement
returned "62 does not fit" because it read a **hidden** day, whose `clientWidth`
is 0. Suspect the probe before the site: re-measured on the visible day, all
three widths are exact.

## THE MUSEUM LAP WAS NOT RUN

Nothing in `src/`, `public/` or any data file changed — the only surface that
moved is an Ops page under `docs/`, which the lap rig does not serve. Its
measurements were taken directly on the page that changed, at both widths.
`lap:clean` run anyway; `public/_lap.html` absent.

## FLAGGED, NOT FIXED

**`STAGE_PREFIX` IS IMPORTED BY `day.mjs` AND USED BY NOTHING.** Carried from
the first pass. One line whenever anyone is next in the file.

## GATES

| gate | result |
|---|---|
| `npm run lint` | 17 problems (**9 errors / 8 warnings**) — baseline, zero new |
| `npm run build` | green |
| `npm run provenance:gate` | **PASS**, exit 0 |
| `npm run reveal:check` | exit 0 |
| `npm run parity:gate` | 4 shared · 0 divergences |
| `npm run instory:gate` | **PASS** |
| `npm run docs:numbers:gate` | **PASS**, exit 0 |
| `npm run arc:check` | **PASS** |
| `npm run ops:size` | **PASS** |
| `npm run reveal:day` | *"Nothing to move. The tree and the Record agree."* |
| `npm run lap:clean` | nothing left in `public/` |
