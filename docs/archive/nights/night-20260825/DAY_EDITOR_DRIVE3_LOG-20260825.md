# THE DAY EDITOR — THREE FIXES, AND RULING A RECORDED (2026-08-25, third pass)

**HEAD at start `9138343`** — Mike committed pass two mid-round, so this is a
THIRD commit and neither earlier message file is touched.

---

## RULING A — RECORDED, NOT BUILT, AND FILED WHERE IT WILL BE FOUND

> **The day editor becomes where he writes, and Excel stops being the surface.**

**THE BIGGEST RULING OF THE DAY, AND A ROUND LOG IS THE WRONG PLACE FOR IT.**
OPERATIONS §0 BREADCRUMBS: *"a round log is a diary, and diaries do not answer
questions."* Nobody greps a diary for *is the workbook still the road*. So it is
filed at the three places a session would actually be standing when it needs to
know:

| where | why that place |
|---|---|
| **`tools/dictation/workbook_to_draft.py`**, at the head | This is where a session goes when it is about to **improve the workbook chain** — which is exactly the session that must know the chain is being retired. It says the script keeps working and keeps its place (a workbook that exists still has to land), and that **no round should widen it now**. Nothing about the script's behaviour changed. |
| **`docs/BACKLOG.md`**, a new NEXT AFTER A REPAIR section | The backlog **is the order**, and this changes the order. |
| **`docs/OPEN_ACTIONS.md`**, row **`C-day1`** | Doctrine 14. The register carries the thing that is actually blocking, which is not the ruling — it is the repair the ruling now depends on. |

**AND THE PREREQUISITE IS NAMED IN ALL THREE:** the draft round-trip **silently
drops `wire` and `plates`** — Record 013's defect. A writing surface that loses
a field the moment he types into it would lose his words on its first day, which
is the one outcome Piece 4 was sequenced last to avoid. **Repair first, then
Piece 4.** Nothing on the page takes a keystroke today.

---

## THE THREE FIXES

### 1. ONE BOX WIDTH — 68, and a MARK where a limit exists

**OPS WAS RIGHT ABOUT EACH NUMBER AND WRONG ABOUT THE PAGE.** 62 / 65 / 68 were
each taken from that element's own budget and each was correct. But he reads a
**column of boxes**, not three budgets: edges that do not line up for a reason
he cannot see read as sloppiness, not as information.

**EVERY BOX IS NOW 68 CHARACTERS** — `.vp-rec-sect-body { max-width: 68ch }`,
the museum's own body measure. Declared once in the sheet; **zero inline widths
left in the markup**. Measured on the served page, on the visible day: text area
**430.0px**, 68 characters **430.0px** — 68 fits, 69 wraps.

**THE MARK, AND EXACTLY WHEN IT FIRES.** The wrap warning only has to be honest
where a limit exists, and a limit exists on two fields. They get a mark instead
of a narrower box — `budgetMark()`, two states and nothing between them:

- **AMBER** — the string is within **5 characters** of its budget. It still
  passes. **This is Ops' slack band and NOT a gate, and the hint says so**,
  because a mark implying a gate nobody can find is the same defect as a gate
  nobody can read.
- **RED** — the string is **over** its budget. `npm run reveal:check` refuses
  the packet. A fact, not a judgement.

**IT FIRES NOWHERE ELSE. Measured on the built page: exactly ONE mark in the
whole document — `128/130` amber, Record 002's deck.** A section has no limit at
all, so it never carries a number: a box implying one would be inventing a gate.

**THE HEADLINE'S HINT STILL CARRIES THE MEASURED WRAP POINTS** — 64 characters
at 1280px, 58 at 768, 36 at 390 — because the gate is one number and a headline
is not. A headline can pass every check here and still wrap on his phone; that
is a fact about the museum, shown rather than turned into a second red.

### 2. THE LETTER IDS COME OFF THE ROWS

**Measured: `.dy-el .c-key` returns 0.** The bar still reads **H E D S A P {}**
and every calendar row still carries its seven. A letter beside the row it
labels is redundant when the row says EXECUTIVE SUMMARY in bold, in a box, an
inch away — the fixed column he asked for is the one in the summary.

### 3. THE TWO CHECKBOXES BECOME ONE MULTISTATE BUTTON

**Measured: 0 checkboxes left; one button per row** (9 rows / 9 buttons on
Record 003), 27×27, all in one column position, all tabbable, all with an
`aria-label` naming the state.

**THE FULL CYCLE, WALKED FIVE PRESSES ON THE SERVED PAGE:**

| press | state | glyph | row | lines | stored |
|---|---|---|---|---|---|
| — | ready | `·` | quiet | shown | *(nothing)* |
| 1 | NOT READY | `!` | loud | shown | `{notReady:true}` |
| 2 | not required | `–` | off | **hidden** | `{notRequired:true}` |
| 3 | ready | `·` | quiet | **back** | *(nothing)* |
| 4 | NOT READY | `!` | loud | shown | `{notReady:true}` |

**IT IS REVERSIBLE FROM EVERY STATE BECAUSE IT IS A CYCLE** — the third press
returns to ready, so no state is a corner. That is the defect this page was
already caught committing once: **a mark he cannot take off is a deletion.**
And the hint names the state it is IN and the state the next press moves to, so
the way out is never something he has to discover:
*"READS ready — press for not ready."*

**THE STORED SHAPE DID NOT CHURN.** `readiness.json` still carries the two
booleans; a state sets exactly one and clears the other. A file written by the
two-checkbox build reads correctly here. Both-true is not a state the button can
reach; if a hand-edited file carries it, `notRequired` wins — the same
precedence the generator uses.

Verified too: **clicking the title box does not cycle the state** (the button is
tested first in the delegated handler), and the store returns to `{}` when every
row is walked back to ready.

---

## VERIFIED SERVED

`http://127.0.0.1:8931/dictation-20260807/day.html` — measured on the built
artifact after the final build.

- **411 marks, 411 two-line hints, zero bare** — and `[title]` returns exactly
  411, so nothing outside the mark set wears one.
- One box width across the document: **429.947px** everywhere, **0 inline
  widths**.
- **One mark on the page**, amber, `128/130`.
- The viewer still has three buttons and opens at **742×960**.
- **0 console errors. Page overflow 0** at desktop and at 390px, where the
  button keeps its column and every box fits the screen.

### TWO PROBES OF MINE WERE WRONG, AND §8's RULE CAUGHT BOTH

**THE KEYBOARD COULD NOT BE EXERCISED ON THIS HOST, AND THAT IS THE HONEST
STATEMENT.** A real `Return` and a real `space` on the focused button did
nothing, which looks like a defect. **Suspect the probe:** a real `Right` arrow
also did nothing — and that handler is unchanged since the first build. A
*dispatched* `ArrowRight` moved the day 1 → 2 → 1 immediately, so the handler is
wired and the tool's key presses are simply not reaching the page. What IS
verified: the control is a real `<button>`, focusable, in the tab order, and a
**bubbling click event** — which is exactly what a native Enter or Space on a
button produces — cycles it. The physical key press is unexercised and is not
claimed.

**AND `docs:numbers:gate` "PASSED" WHEN IT HAD FAILED.** `| tail -3; echo $?`
reads *tail's* exit code, not the gate's. Re-read through `PIPESTATUS`: **exit
1, two stale published numbers** — my own register row had moved
`OPEN_ACTIONS.md` from 139 rows to 140 and from 134 open to 135, both published
in `BACKLOG.md`. **Corrected in the document, which is the gate's own
instruction** (*"correct the document — and never a round log"*), and every gate
was then re-run capturing real exit codes.

**NOT PHOTOGRAPHED THIS ROUND.** The browser pane would not composite —
*"the page is not compositing frames"* — so there is no screenshot. Everything
above is measured through the DOM and computed styles.

## THE MUSEUM LAP WAS NOT RUN

Nothing in `src/`, `public/` or any data file changed. `lap:clean` run anyway.

## FLAGGED, NOT FIXED

**`STAGE_PREFIX` is imported by `day.mjs` and used by nothing.** Carried from
pass one.

## GATES — real exit codes, captured per gate

| gate | exit |
|---|---|
| `npm run lint` | **1 — and that is the baseline**: 9 errors / 8 warnings, zero new. eslint exits 1 on any error, so this gate is read by its counts, never by its status |
| `npm run build` | green |
| `npm run provenance:gate` | **0** |
| `npm run reveal:check` | **0** |
| `npm run instory:gate` | **0** |
| `npm run parity:gate` | **0** — 4 shared, 0 divergences |
| `npm run arc:check` | **0** |
| `npm run ops:size` | **0** |
| `npm run docs:numbers:gate` | **0** — after the correction above |
| `npm run reveal:day` | *"Nothing to move. The tree and the Record agree."* |
| `npm run lap:clean` | nothing left in `public/` |

**One stray removed before sealing:** `tools/dictation/__pycache__/`, left by my
own `py_compile` check of the workbook script.
