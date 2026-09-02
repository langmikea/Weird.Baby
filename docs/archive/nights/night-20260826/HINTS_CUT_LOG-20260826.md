# THE HOVER HINTS, CUT (2026-08-26, second round)

**HEAD at start `30e61de`.** Mike drove the day editor — *"FANTASTIC!!!"* — and
ruled one kill.

> **"Kill the giant hover hint boxes - way too much to bother reading any of
> it."**

**OPS RULED: cut them down, do not cut them out. A mark whose meaning is not
obvious still needs a word. The test is whether a GLANCE is enough — if a hint
needs reading, it is still too long.**

**THREE FILES:** `tools/dictation/day.mjs`, `tools/dictation/day-collect.js`,
and the page they generate. **Nothing else changed.**

---

## 1 · WHAT IT WAS, MEASURED BEFORE ANYTHING WAS CUT

| | before | after |
|---|---:|---:|
| hints | 484 | **386** |
| total characters | **98,378** | **8,154** |
| median | 161 | **21** |
| p90 | 286 | **39** |
| longest | **894** | **60** |
| two-line | **484** | **0** |
| over 200 characters | 174 | **0** |

**A 98KB PARAGRAPH THAT ARRIVES WHEN THE POINTER STOPS MOVING IS NOT HELP.**
His words are the whole diagnosis, and the number under them is 894 characters
on the box he was typing into.

## 2 · THE RULE THAT DECIDED EACH ONE

**THE SECOND LINE WENT ENTIRELY.** The scheme was MEANING then READING, and the
meaning was **the same sentence every time that mark was drawn on any day.** It
earned its place on the first hover and was furniture on every one after.

Then, per mark, the test is **can the thing already speak for itself:**

| | |
|---|---|
| **a glyph or a one-letter mark** — the state button, the seven calendar letters, the door chip, the `{}` cell | **KEEPS a hint.** It cannot say what it is. A few words plus what it reads: `ready · press for not ready`, `EXECUTIVE SUMMARY · ready` |
| **anything already labelled in words on the glass** — a box titled EXECUTIVE SUMMARY, a filename under a tile, a plate's caption, `SECTIONS · 5`, the panel summaries, the shelf section labels, the dateline, `3 of 5` | **HINT DELETED.** Each was a sentence introducing a string printed an inch away. This was most of the 98,378 characters |
| **a live number worth a glance** — the lines box | **NUMBERS ONLY**, in the same grammar as the budget mark: `9 lines · longest 45/68 · 4 spaces off` |
| **a 52px shelf tile** | **its own LABEL**, which is the one hint on the page that beats the thing it sits on — a tile that small shows no caption |

**THE WORST ONE IS WORTH NAMING:** the lines box carried 894 characters
explaining what a section's lines are and where `68ch` comes from — **on a box
he is looking at and typing into.** *The box is the measure* was always the
argument for having a box; a paragraph restating it is the page not trusting its
own design.

## 3 · THE CEILING IS IN THE FUNCTION, NOT IN A NOTE

**DOCTRINE 25 RECORDS THAT THIS EXACT THING GROWS BACK.** `week1.html` was split
for this complaint on 2026-08-07 and the worksheet's masthead was seven
paragraphs three rounds later. **A ceiling written down is a ceiling that grows
back.**

So `hint()` **throws**. One line, `HINT_MAX = 60`, and a longer one or one
carrying a newline stops the build and names itself. It is not decoration:
**it caught four hints during this round's own cut** — the save box, the way-out
box and two buttons — after I had already been through the file by hand.

The client half cannot throw (nothing is being built while he types) so it
**cuts** to the same ceiling, and `short()` cuts the readings that are HIS — a
section header, a shelf label — rather than letting a long header he writes one
day stop a build.

## 4 · MEASURED ON THE SERVED PAGE — `http://127.0.0.1:8899/`

**NOT PHOTOGRAPHED. The browser pane would not composite** — the same refusal as
pass five and as yesterday. Everything is through the DOM and geometry.

| | |
|---|---|
| hints served | **379**, 7,987 characters, median **21**, max **60** |
| two-line, or over the ceiling | **0 and 0** — re-checked after clicking and typing |
| a calendar row, all seven | `HEADLINE · ready` · `EXECUTIVE SUMMARY · ready` · `DETAILED REPORT · ready` · `other sections · 4, all ready` · `attachments · none` · `files · none` · `notes to Ops · none` |
| the state button, live | `ready · press for not ready` → press → `NOT READY · press for not required` → two more → back to `ready` |
| the lines box | `2 lines · longest 63/68 · 2 spaces off` |
| the budget mark, live | prints `70/62`, hint `8 over — the packet gate refuses it` (35 chars) |
| the title box | **no hint at all** |
| `SECTIONS · 5` | **no hint at all** |
| console errors | **0** |

**NOTHING ELSE MOVED, AND IT WAS RE-MEASURED RATHER THAN ASSUMED:**

| | |
|---|---|
| box content width | **429.94px = 68ch** |
| indent | **14px, one level** |
| at 1280: page scroll | **0** — `window.scrollTo(0,900)` leaves html and window at 0 |
| at 1280: the record scrolled | **412px while the calendar moved 0** |
| sideways overflow | **0** at 1280 and at 375 |
| calendar marks | **7, 7, 7, 7, 7** |
| boxes overflowing at 375 | **0** |

**ONE READING LOOKED LIKE A REGRESSION AND WAS NOT.** A first measurement showed
the page scrolling 1,382px. The browser pane was **800px wide**, which is inside
the `@media (max-width:820px)` fallback where the page is *designed* to scroll —
`mediaQueryOneColumn` came back **true**. Re-measured at a forced 1280 the
desktop ruling holds exactly. **§8's rule applied and paid: suspect the probe,
and here the probe was the viewport nobody had checked.**

## 5 · GATES — real exit codes, captured per gate

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
| `npm run day:proof` | **0 — ALL 29 CHECKS PASSED**, 5 shown LOSING first |
| `npm run reveal:day` | *"Nothing to move. The tree and the Record agree."* |
| `npm run lap:clean` | nothing left in `public/` |

**Nothing in `src/` changed**, so the museum lap does not apply. The Record, the
draft and the marks are byte-identical to where they started —
`20f4c8aa…`, `13fe608b…`, `a1b65c0b…`.

## 6 · CARRIED, UNCHANGED

- **`C-day2`** — four of the five Records still cannot accept an edit, because
  `record:land` guard 6 protects their standing reasoning. Untouched by this
  round; `day:proof` still prints the table on every run.
- **`STAGE_PREFIX` is imported by `day.mjs` and used by nothing.**
- **`record.html` still has the picker fallback.** Mothballed, and Mike has
  ruled it dies when Piece 4 ships; that ruling is not Ops' to execute.
