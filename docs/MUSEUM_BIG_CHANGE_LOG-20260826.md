# THE BIG CHANGE — THE FEED GOES ON THE MONITOR — 2026-08-26

**Built from `8d32319` on top of the same day's uncommitted Mode B work.
Nothing committed, nothing pushed, nothing deployed.** Served and driven:
**`http://localhost:5173/robots`** → the Portal album → **`01 TERMINAL.EXE`**.

---

## 0 · WHAT WAS REPORTED BEFORE ANYTHING WAS BUILT

### 0.1 · THE CHANNEL DEFECT — CAUSE FOUND, AND IT WAS MINE

**MIKE: "TV - I cannot change channels!"** Reproduced and isolated on the served
page, both routes:

| route | panel mounted after latching? | pressed 3 |
|---|---|---|
| the ALBUM panel's own LATCH | **yes** — the face stays behind the overlay | **3 lit. Worked.** |
| **MODE B's console** | **no** — `.ip` went **1 → 0** at the same instant | **1 still lit. Dead.** |

**THE CAUSE, EXACTLY:** `wb-portal-select-channel` was answered by `openChannel`
*inside the panel component*, and the panel was a page widget. Mode B's console
IS the overlay's content, so latching REPLACED it — **the digit strip's only
listener was destroyed by the very act that showed the digit strip.**

It was introduced by Mode B, one round old, and never shipped.

### 0.2 · THE "HW Feed Monitor" — NOT A NAME IN THE TREE

**No object in either repository is called that.** What the sentence resolves to
is read from his own two rulings sitting together:

> **"\Robots — DELETE 'Launch the Portal'"** … **"KILL THE HW Feed Monitor."**

**`Launch the Portal`'s FACE WAS THE HARDWARE FEED PANEL.** `face.panel` — the
lit FEED readout that replaced the drum, the four dip switches, the rotary dial
and the latch, mounted on the album page. **Nothing else in the museum drew it.**
So the two rulings are one act: deleting the track is how that object dies.

The candidates that were considered and rejected: the FEED bay's readout alone
(he names *the feed panel* separately in the same sentence, so a bay is too
small), and the twin's `SYSTEM MONITOR` (software inside the machine, and not a
feed monitor). **Stated as a reading, with the evidence, so it can be corrected
in one word if it is wrong.**

### 0.3 · WHOSE WORDS THE SIGNAL MESSAGES ARE — THE REGISTER ANSWERED

**MIKE: "KILL all messages RE: signal present or not - unless I prescribed it."**
The `unless` is the whole instruction, so every string was looked up before it
was touched.

| string | class | the register's own source line |
|---|---|---|
| `SIGNAL PRESENT.` | **HOUSE** | *"Ops' own words - the readout under the latch when a machine's signal reaches the selected channel"* |
| `TEST SIGNAL. NO UNIT ON THIS CHANNEL.` | **HOUSE** | *"Ops' own words - the readout under the latch on a channel the routing leaves listening"* |

**Neither was prescribed. Both are struck**, along with the `says` block that
declared them and the `note` the payload carried.

**AND TWO THAT SURVIVE, WHICH IS THE OTHER HALF OF THE INSTRUCTION.**
`Test signal` and `Television` are also HOUSE — and they are **accessible
names**, not messages. They are what a screen reader is told the picture IS.
Deleting them would leave two channels unnamed for assistive tech, which is not
what "kill all messages" asks for and is a regression nobody looking at the
glass would ever see. `TELEVISION ON THIS CHANNEL.` was the third of the family
and Mike struck it himself earlier the same day.

### 0.4 · "MONITOR FORMAT AND CHARACTER" — THE MACHINE ALREADY HAS ONE

**Nothing was invented.** `twin.html` writes in one register and this screen
writes in it:

| precedent | what it establishes |
|---|---|
| **`Mon_DOS()`** | a `>` prompt · a short UPPERCASE command typed a character at a time · terse output lines under it · a `>` and a blinking block. Its own comment rules the voice: **"OS voice, zero personality."** |
| **`Mon_EventsLine()`** | ALL-CAPS state lines — `SYSTEM OK`, `UPTIME 4 MIN`, `PROCESSES 3 RUN`, `EFFICIENCY 87%` |
| **`Mon_ProcessLine()`** | **Title-Case name + lowercase datum** — the A6 letter |
| the line width | `.slice(0, 41)` — 41 columns |
| the boot Mike already approved | `> TERMINAL.EXE`, Courier, off-white on black |

**A BAY BECOMES A LINE.** `> FEED      NIAC/VIIIp PATCHED`. That is the whole of
the translation, and every part of it was already on the machine's own screen.

---

## 1 · WHAT WAS BUILT

### 1.1 · THE FUNCTION LEFT THE HARDWARE — `feed-control.js`

**MIKE: "Move the FUNCTIONALITY of the feed panel to the MONITOR."**
`FUNCTIONALITY` is the word the new module honours. Five banks with three that
arm, four independent aerial bits, two source positions, the arming rule, the
session memory, and the one resolver that says what a channel carries — all of
it, **with no opinion about form.** It does not know what a knob, a lamp, a
slider or a readout is.

**AND IT IS WHERE THE CHANNEL DEFECT CLOSES.** The hook is owned by
`RobotsExhibitFlow`, which owns the overlay and is mounted for the whole visit,
so **the listener now outlives the strip** instead of the other way round.

### 1.2 · THE FORM IS THE MONITOR'S — the console rebuilt

```
> TERMINAL.EXE
> UNIX-6x Emulator
> Loading......
> PORTAL_2v16.CFG

> FEED      NIAC/VIIIp  PATCHED
> ANTENNA   1 1 1 1
> SOURCE    LIVE

> RUN       READY
>█
```

Every row is the control. The word is pressed, because on a terminal the word is
always what is pressed. **No knob, no slider, no lamp, no readout bezel, no
2×2** — mapping those onto a CRT is the foolish version he named, and it is
exactly what the first cut of Mode B did.

`FEED` is carried because the register classes it **MIKE** — *"on QC_101 in the
installer's hand: 'BROADCASTS ON ......... FEED NO. 3'"*. `LATCH` becomes `RUN`
because `Mon_DOS` runs commands rather than throwing switches, and both legends
are HOUSE.

**NOTHING ON THE SCREEN IS BRIGHTER THAN ANYTHING ELSE.** Mike struck the `[X]`
partly on that ground — *"bright instead of matching the other text on this
screen"* — so there is one ink, `#dcd9d2`, the twin's own `CARD_OFF`, and a
control that is ON is **inverted, not lit**. That is the machine's own register
for *this is the one*, and it is what the digit strip already does.

### 1.3 · THE THREE SMALLER RULINGS

| ruling | what changed |
|---|---|
| **"DELETE 'Launch the Portal'"** | the track is gone; the album is `01 TERMINAL.EXE` · `02 FAQ` |
| **"it should run it instead"** | the row has **no face at all** — clicking it dispatches. It is the third branch on a click beside `jumpTo`, which already established that some rows are not pages. **There is nothing behind the row to land on**, which is what removes the intermediary page rather than hiding it. |
| **"Kill the [X] lower right"** | `exit={false}` on the console. Escape still closes — W2's ruling, which he did not name. **On television the `[X]` returns**, because there it is Mode A's way out and S4 still binds. |

---

## 2 · MEASURED ON THE SERVED PAGE

**THE DEFECT IS CLOSED.** From Mode B: RUN → **television** → pressed 3 → **3
lit, kind changed** → pressed 4 → **4 lit.**

| | desktop (`.ps` 900) | 375px |
|---|---|---|
| opening | 761.7 × 603.3 | 317.4 × 251.4 |
| all nine rows inside it | **yes** — 39.0 / 38.6 / 42.4 / 171.6 | **yes** — 12.8 / 12.7 / 16.0 / 28.9 |
| the boot after loading | kept | **kept** |

**THE PHONE CASE STOPPED BEING A CONSTRAINT, AND THAT IS EVIDENCE RATHER THAN
TIDINESS.** The hardware panel fitted a 251px opening by **1.4px**, clamped at
its 0.60 legibility floor, and the boot had to be HIDDEN to make room. A
terminal is nine lines of text and reflows by changing one size. **MB-b closes
because the thing it described no longer exists.**

Also verified: `.ps-note` **0** on every kind · Mode A's controls **0** on the
console · `.ip` **0** anywhere in the museum · both doors open the same object.

---

## 3 · FOUR DEFECTS OF MY OWN

**(1) THE ANTENNA DEFAULTED TO `0000` AGAINST A DECLARED `1111`.** The hook is
mounted for the whole visit, so its `useState` initialisers ran against an EMPTY
declaration — the console had not been run yet — and `useState` runs once.
`chRows` was `[]`, so `bits` initialised to `""` and stayed. **Measured: RUN
landed on the test signal where it should have landed on television.** The strip
worked; what it opened was wrong. Fixed with React's documented *adjust state
when a prop changes* pattern during render — **not an effect**, which would be
the `set-state-in-effect` rule this round had already corrected once and would
paint one frame of the wrong routing.

**(2) THE PRUNE BROKE TWO `RESTATED` CHAINS — §9's OWN NAMED HAZARD.** Deleting
the track removed `MGK-VIIIp` at `portal.js:192`, and `The Record` and
`The Portal` both restated it. `provenance:gate` refused with *"3 RESTATED rows
do not resolve"*. **Repointed onto the live `MGK-VIIIp` row in
`robots-units.js`** — the string still exists in the museum, at a different
address — which is exactly the repair the 2026-08-09 round made.

**(3) I APPENDED PROSE PAST A CLOSED COMMENT. AGAIN.** Second time this session,
same shape: a `*/` orphaned mid-block, `RobotsExhibitFlow.jsx` refused to parse.
Caught by `eslint` on the file rather than by reading the edit.

**(4) AND ONE THAT WAS NOT MINE BUT COST THE MOST TIME.** The dev server was
serving `PortalScreen.jsx` as an **empty module** — 175 bytes, `sourcesContent:
[""]` — while `npm run build` was green and the file had a default export.
**Vite's per-file transform cache had gone stale**, on that file and on
`Exhibit.jsx`; the browser was running the pre-edit click handler while the
render was new. Diagnosed by curling the module and comparing served bytes, then
cleared with a byte-identical rewrite. **Neither the source nor the build was
ever wrong, and §8's *suspect the probe before the site* applies to the dev
server too.**

---

## 4 · WHAT WAS NOT DONE

- **`InstrumentPanel` HAS NO CALLER NOW AND IS KEPT.** Nothing declares
  `face.panel`. It is the only written form of how the hardware feed panel was
  built — the drum's cylinder geometry, the detent arc, the fit rule, the arming
  rule's one-place evaluation. Kept for `make_unit_covers.py`'s reason: **what is
  retired is its authority over a surface, not its account of one.** The mount
  mechanism stays live and correct — two other files cite it by name — so
  **revival is one declaration.** *"If a future round finds this still unmounted,
  that is the round that should decide whether it goes"* — not the round the
  ruling landed in.
- **TWO LEDGER ROWS ARE FLAGGED, NOT CUT.** `portal.door` and `viiip.portal`
  describe the deleted track and its face. Deleting a ledger row is the **M99
  guard's** own question — `--write` diffs ids and refuses — and forcing it
  inside a round already rebuilding two surfaces is how §0's lesson gets paid for
  a fifth time. Row **MB-c**; the same call the wing-names round made about seven
  stale `name` fields.
- **NO PIXEL SCREENSHOT.** The Browser pane did not composite (§8's rAF family) —
  it timed out on every attempt this round. Everything above is painted-DOM reads
  and `getBoundingClientRect` geometry against the bezel's own coordinates: a
  strong oracle for **what is where** and none at all for **how it looks. Mike is
  the first eye on the look**, which is the whole reason this is served and not
  committed.

---

## 5 · GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 7 warnings — baseline, zero new** |
| `npm run build` | green |
| `npm run provenance:gate` | **PASS** — 4 carried, 7 declared, 6 pruned, 2 chains repointed |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** |
| `npm run instory:gate` | **PASS** |
| `npm run docs:numbers:gate` | **PASS** — register 147 → 148 rows corrected |
