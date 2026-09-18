# Take stock: every drop played once, sorted into families

2026-09-18, Ops. Board row `take-stock` (due 09-23). Step 1 of the path in
`docs/PLAN-20260918-LAUNCH.md` section 2b, done once for everybody.

**The picture to look at:** `docs/desk/take-stock/FAMILIES.png` (one frame per drop, a
family to a row, the lead first). One contact sheet per drop sits beside it
(`<id>.png`), and the same again as a stranger gets it today (`stranger/<id>.png`).

## 1. What was done

- The catalogue has 32 rows with a day, across 26 days. 24 of them play in the twin
  (the Answers door and MGK-NIAC are the same ask, so 23 programs). All 24 were opened
  on their own address (`?preset=arrive&at=<id>`), pressed with the unit's own inputs
  (SCROLL, CLICK, SHAKE) and photographed after every press, twice: once with every
  program unlocked, once as a stranger gets it today. No page errors in either pass.
- The other 8 rows are not programs: the four characters, the Gambler's case, the
  Everyday's box, unit and case. They are album plates and belong to the shoot line
  (`shoot-pilot-shoot`, `shoot-pilot-line`), not to this path.
- The code was surveyed once beside the play (section 6), so each thing seen on the
  glass is tied to the function that draws it.
- Tools, kept: `tools/take-stock.py` (the driver; `--only <id>`, `--stranger`),
  `tools/take-stock-plays.json` (four drops with their own script),
  `tools/take-stock-families.py` (the one sheet). Needs `npm run dev`.

## 2. The families, and the lead of each

The sort is by how a program behaves in the hand (what the three inputs do, what it
shows, how it ends), because that is what the conventions will be decided on. The lead
is the member that drops first, unless another is plainly the fuller shape.

| # | Family | Members (day) | Lead | Why this lead |
|---|---|---|---|---|
| 1 | **The ask** | MGK-NIAC (1), MGK-v2.0 (13) | MGK-NIAC | Day 1, the most finished thing on the machine, the ask reel is already cut on it |
| 2 | **The machine itself** | Starting (2), The monitor at rest (3) | Starting | Nothing to press in either; the boot is the one with a beginning and an end |
| 3 | **Settings** | User, your name (4), Polarity (5), Clarity (6) | User, your name | First to drop, and already on the panel grammar the newer programs use |
| 4 | **Draws** (ask for a result, get one, shake for another) | Probabilities (7), Detectors (9), The Bullshit Detector (10), The Career Chooser (23) | Probabilities | First to drop, five members inside it (coin, number, card, dice, lottery) |
| 5 | **Readers** (a list, open one, read, back) | Messages (8), Phone Tap (26) | Messages | First to drop; Phone Tap is the same program with other words |
| 6 | **Games and toys** | Tic-Tac-Toe (11), Snow Globe (12), Radio (25) | Tic-Tac-Toe | The only one with the whole shape: a mode card, play, an ending, again or exit |
| 7 | **Sessions** (it talks, you click on, it listens to the microphone) | ELIZ (14), Brain Training (15), Inkblots (16) | ELIZ | First to drop; all three are one skeleton |
| 8 | **The casino** | Blackjack (18), Roulette (19), Craps (20), Slots (21) | Blackjack | First to drop; all four are one skeleton; Mike already has its milestone approach |

Eight families, eight full paths, fifteen short ones. Days 11 to 26 lean on families
whose lead drops on or before day 18.

## 3. What they share today, and where they differ

This is the raw material for `conventions-range` (09-26). Nothing here is a proposal.

**Getting in.** Twenty destinations play the same three seconds: the front glass says
OUTPUT REDIRECTED TO AUX DISPLAY, the top glass shows test bars, then the program. The
ask has its own (FLUIDIC SUSPENSION, static, bubbles). Messages, Polarity, Clarity and
four of the five Probabilities rows have no way-in card at all. Coin Flip shows the
fluidic card and then does not use the fluid.

**Getting out.** SCROLL is the way out almost everywhere, and `<scroll back>` is the
hint. The exceptions: Radio leaves on CLICK (its own glass calls that click "set"); the
panels (your name, the Career Chooser) leave by a row named `<EXIT`; Polarity and
Clarity leave by `cancel` or `ok` and show no hint; from a Phone Tap message SCROLL goes
to the list, not out. The hint itself sits in four different places: the bottom of the
top glass, the bottom of the front glass, a raw line in the casino, a hand-typed row in
Detectors and Probabilities.

**A score.** Only the casino shows one: `s 0` at the top right of the top glass, and the
word `+1` (Slots `+2`, `+10`) in the result line. No best is kept for the casino, nothing
is remembered after you leave. Tic-Tac-Toe and Snow Globe have no score on purpose. Brain
Training is self-scored on purpose. A `score N  best N` card exists, and only the five
later games (Tilt Drive and its kind) reach it.

**Text.** There is no pager. Each reader has its own typed limit (Messages 9 lines,
Phone Tap 7) and anything past it is dropped without a sign. The front glass clips long
lines (section 4). The Sessions family has the one good shared helper: a line split in
two and centred.

**An ending.** Only Tic-Tac-Toe ends: a result, `click=again scrl=exit`, and a return to
the menu by itself after ten seconds. ELIZ files the session and leaves by itself after
two and a half seconds. Everything else holds forever: a casino hand restarts in place,
Inkblots shows another blot, Detectors reads again, Snow Globe and Radio never finish.

**Again.** SHAKE or CLICK in Tic-Tac-Toe, Brain Training and Blackjack; SHAKE only in
Probabilities, Detectors and the Career Chooser (the click is swallowed).

**Sound and voice.** MGK-NIAC plays its recorded answers; MGK-v2.0 has no recordings and
speaks through the browser's robot voice, a word at a time. Snow Globe plays a square-wave
Jingle Bells, Radio makes its own static and numbers. The casino is silent. The sound at
a result is one of three different chirps with no pattern.

## 4. Seen on the glass: plain faults (Ops, no ruling)

Fix in the robots master twin, copy across, one at a time, in the lead's full path or
before it. None changes a line.

1. **Messages:** the subject and the `click=play scroll=exit` row print on top of each
   other on the front glass (`twin.app.messages.png`, frame 11).
2. **Detectors:** `click=verdict scroll=exit` runs off the front glass; the way out is the
   part that is cut off.
3. **Games:** `OUTPUT: FLUIDIC DISPLAY` is clipped to `FLUIDIC DISP` (Snow Globe).
4. **Blackjack:** a long hand can run off the right edge of the top glass (code; not yet seen).
5. **Casino:** the best score is never recorded, because no casino game reaches the
   shared ending.
6. **Clarity Bias** saves into Polarity's slot. It is the firmware's own slip, carried
   over faithfully. Flagged, not fixed: the fix belongs in the firmware first.

Q1 (the glass rules the words, ruled 09-18) already covers 1 to 3 in principle:
`glass-fit-recut` measures answers today; the same measure should run over every
program's own lines.

## 5. Words on the glass that are stand-ins (his pen, by family, one sitting)

A stand-in cannot ship (rule 5), so each of these is needed before its day.

| Program (day) | What the glass says today |
|---|---|
| Detectors (9), The Bullshit Detector (10) | `[stub] Bullshit Detector`, `[stub] NO TRACE`, `[verdict words parked]`; four of five detectors have no words |
| Snow Globe (12) | Santa's follow-up message ends on `[PAPA - santa spicy line]` |
| MGK-v2.0 (13) | no recorded voice |
| ELIZ (14), Brain Training (15) | a missing ELIZ prompt; no encouragement lines for Brain Training |
| The Career Chooser (23) | the guidance lines and the nickname are `[PAPA ...]` slots; the job words are a 6 x 6 x 6 sample of the 196 |
| Phone Tap (26) | every intercept is `[scaffold - channel proof] ... CONTENT IS PAPA'S PEN` |

Earliest need: the Detectors' words, day 9, Sun 11-08.

## 6. As a stranger gets it today

Ten of the 24 refuse a stranger who lands on them: your name (4), Probabilities (7) and
the Career Chooser (23) say NOT FITTED or NO RECORD; Messages (8) says NO RECORD;
Tic-Tac-Toe (11), Snow Globe (12) and all four casino games (18 to 21) say NOT FITTED.
The arrival recipe walks to the row, and the row then refuses. This is the known work of
`no-dead-ends` (10-09); the count is new. ELIZ, Brain Training, Inkblots, Radio and Phone
Tap still wear their parcel marks in the menu (`ELIZ [-02]`, `Radio [-07]`).

Also seen: with everything unlocked, Calculator is reachable from the row after Inkblots
and runs; it is a later drop marked "not installed" in the catalogue.

## 7. The code survey, in short

Made by a read-only search agent over `public/robots/twin.html` at museum 7914ec9.

- **Shared helpers that exist:** `Aux_Handoff` (the way in), `Rail_Head` (the front title
  bar), `Game_Front_Card`, `Psy_Front` / `Psy_Card` / `Psy_Meter` (the Sessions), `PanelG_Draw`
  / `PanelG_Input` (the panels), `Hint` and the `HINT_*` words, the `Fit_*` family
  (measure, clip, split), `Game_Over()` with `gameScore` / `gameBest`.
- **Shared helpers that do not exist:** a text pager; one ending routine for everything;
  one "any input returns" routine (two copies exist).
- **Who does their own thing:** Detectors and Probabilities draw raw front cards; the
  casino prints its hint raw; Messages and Phone Tap cap their lines by hand; almost no
  body text goes through `Fit_*`.
- **Dead code:** `Adv_Panel_Draw`, `BS_Panel`, `NO_Do_Overs`.
- **Natural code families** match section 2: the three engines; the three Sessions; the
  four casino games (one skeleton, none reaches `Game_Over`); Phone Tap and Notepad (line
  for line the same program); the panel programs; the five later games that do end.

## 8. What this hands to the next rows

- `conventions-range` (09-26): section 3 is its brief. Four things to range: in, out,
  a score, an ending; text is already ruled by Q1 and needs a pager, which is an Ops call.
- `no-dead-ends` (10-09): section 6 is its list.
- `twin-update` (09-24): the faults of section 4 can ride with it.
- Each lead's full path starts after he points at the conventions.

## 9. For Mike, at most three things

1. Look at `FAMILIES.png`. If a program sits in the wrong row, say which.
2. Nothing else is due from this page. The words of section 5 come to him by family,
   later, with the glass drawn.
