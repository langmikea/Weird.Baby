# THE FEED PANEL — third pass, 2026-08-21

## THE URL

```
npm run mock
http://127.0.0.1:8899/panel-rebuild-20260821/panel.html
```

Nothing is in `src/`. The DIP sliders, the FEED steppers and the SOURCE knob are
live; Mike's drawing is at the foot of the page. Ops looked first.

---

## THE FIVE FIXES

| # | fault | before | after |
|---|---|---|---|
| 1 | labels still too small | legend **13px** | **17px** — and everything of its kind with it |
| 2 | the knob glitches on a FEED step | new knob node every click → **180ms swing from 12 o'clock** | knob node **survives**; pointer unchanged across four steps |
| 3 | the panel grows and shrinks | **454 → 516px** on a dial turn, **62px** | **454px in every state.** 0 on FEED, 0 on SOURCE |
| 4 | default the DIP | `1101` | **`1111`** |
| 5 | the legend | `1 = TELEVISION · 0 = FREE` | **deleted** |

### [1] THE ENGRAVING — 17px, measured against the drawing rather than nudged

13px was a nudge and Mike is right that it was not enough. **17px is measured:**
in `PANEL_MOD.jpg` the word `FEED` spans about **8% of the plate's width**, which
at 780px with this tracking is 17px.

Everything of its kind moved with it, because a legend that outgrows its
neighbours reads as a heading rather than as engraving:

| | before | now (780 / 390) |
|---|---:|---|
| FEED · ANTENNA · SOURCE | 13px | **17 / 14** |
| DIP numbers 1 2 3 4 | 12px | **14 / 12** |
| LIVE · SEEDED | 14px | **16 / 12** |
| FEED ARMED | 12px | **14 / 11** |
| the readout's state line | 11px | **13 / 10** |
| LATCH | 15px | **16 / 13** |

### [2] THE KNOB — the cause was structural, not a transform

**MEASURED:** the mock rewrote the whole panel's `innerHTML` on every state
change. A FEED step therefore **destroyed the knob and built a new one with no
transform**, and `transition: transform .18s` then animated the fresh pointer
from twelve o'clock up to LIVE. **A 180ms swing on the knob every time an
unrelated control was touched.**

*(Found by reading the inline style against the computed one: the element said
`rotate(71.9deg)` while its computed matrix was the identity — a transform that
had been set and was still animating away from zero.)*

**THE FIX IS STRUCTURAL AND IT IS THE HONEST ONE.** The DOM is built **once** and
updated in place — text, classes and attributes into nodes that persist — which
is what React does in the real panel and is therefore how the rebuild will behave
anyway. **The transition went with it:** a pointer that is only ever re-aimed by
a turn of its own knob does not need to be told to move smoothly, and leaving it
would keep the same class of bug one refactor away.

**Verified:** the knob node is the *same object* after four FEED steps, and the
pointer reads `rotate(73deg)` before and after. It moves only when the knob turns
— 73° at LIVE, 107° at SEEDED.

### [3] THE PANEL DOES NOT BREATHE — and the fix is the line, not a band

**MEASURED:** turning SOURCE to SEEDED added a refusal paragraph at the foot and
the chassis went **454 → 516px. 62px, on a dial turn.**

**The refusal line is deleted rather than the space reserved.** A permanently
empty strip at the foot is the object Mike deleted last pass, and the line was
already a restatement: the dial's position is legible, the pointer is on it, and
the lamp beside the latch says NOT ARMED. **That is the same reasoning that
struck `SELECT · ONE ARMED` on 2026-08-20** — the lamp under the latch already
reports it.

**Nothing declines silently.** Under Ruling 25 (no lock) the dial is the only
thing that can refuse, so **the control that refuses is the control the visitor
just turned.**

**Verified: 454px in every state** — FEED steps 0px, SOURCE turns 0px.

### [4] and [5]

DIP defaults to **`1111`** — every channel taken, nothing listening. The legend
is **gone**: the panel carries `ANTENNA`, the numbers `1 2 3 4`, and nothing
else.

---

## THE DIP IS `ANT` / `CAB` — recorded in the canon, not written into the manual

**Mike's canon: the four switches select between `ANT` and `CAB` — antenna or
cable — per channel.** It is off the panel and it is in the manual, as text,
without detail. *"It's a little egg to figure this stuff out."*
**Recorded now: `docs/canon/06-PORTAL.md` §9.3, with a pointer waiting in
`07-MANUAL.md` §5b so the manual round finds it.**

**`1 = television, 0 = free` WAS OPS' WORDING AND IS RETIRED EVERYWHERE.** It
never reached `src/` or the canon — only the mock's own legend and Ops' last
report, both now gone.

**WHICH POSITION IS WHICH — Ops' reading, and one word settles it.** `ANT` frees
the channel; `CAB` carries television. The panel's legend is ANTENNA and the
control is the antenna's; **QC_101 is headed `ANTENNA FEED ASSIGNMENT` and reads
`BROADCASTS ON ......... FEED NO. 3`**, which puts the unit's own signal on the
`ANT` side. Filed as a reading rather than as canon, because Mike gave the pair
and not the mapping.

### WHERE IN THE MANUAL, AND WHAT IT COSTS

**RECOMMENDED: Appendix G — ABBREVIATIONS. Two rows.** `ANT` and `CAB`, expanded
and nothing more. **The appendix already carries 21 rows, two of which do not
expand at all** — so a row that says the words and stops is that appendix
behaving normally, which is exactly what an egg wants. Optionally one sentence in
**Section III · INSTALLATION**, which is the right act: a technician patching
units into channels is installing them, and QC_101 came out of the ZIP's
`INSTALL` folder.

**SECTION IV · CONTROLS AND INDICATORS IS REFUSED.** Its job is to say what every
control does. That is the opposite of this.

**COST:** the manual is generated by `tools/manual_structure_build.py` in the
robots repo and its page count is a **published standing number (63)**. Two
appendix rows mean a generator change, a re-render, and a page-count check.
**Small, but it belongs to the round that next writes the manual** — not to a
panel round.

---

## THE BANK STATES — the level field is exactly right and all three ids are wrong

**Ops was wrong last round and Mike's correction is confirmed by the code.** The
twin's recipe table already carries what is needed:

```js
level  0 | 1 | 2   install state: virgin / first-run / established
```

**READ THE OFF-BY-ONE BEFORE WIRING ANYTHING.** Mike's Level 1 / 2 / 3 are the
recipe's `level: 0 / 1 / 2`, and `Boot_Ballet` dispatches `lvl<=0 → Boot_Level_1`,
`lvl===1 → Boot_Level_2`, else `Boot_Level_3`.

**AND EVERY ONE OF THE THREE DRUM IDS POINTS AT THE WRONG THING** — measured
against the live recipe table:

| bank state | wants | the drum points at | what that actually does |
|---|---|---|---|
| **COLD START** | `{power:"on", level:0}` | `boot-playback` | `{power:"on", level:2, replay:true}` — **a Sandbox replay of an established machine**, not a cold start |
| **FIRST RUN** | `{power:"on", level:1}` | `off-first-boot` | `{power:"off", level:0}` — **it never boots.** Measured after 4s: `unitPowered: false`. **This is precisely the "sits on a static menu" failure** |
| **LAST STATE** | `{power:"on", level:2}` | `last-state` | **not a recipe at all.** The seven ids are `standard · idling-updated · boot-playback · off-first-boot · test-bench · clean-boot · record-day` — an unknown id is chipped and the portal opens plain |

**THERE IS NO `level: 1` RECIPE.** Measured: `Object.entries(PORTAL_RECIPES)
.filter(v => v.level === 1)` returns **empty**.

**AND THE COLD START ALREADY EXISTS, UNEXPOSED.** `clean-boot`
(`{power:"on", level:0}`) is in the table marked *"carried, still wired,
currently unexposed."* **Verified with a real load — the boot plays**: opened at
`?user=1&preset=clean-boot`, the unit powered itself and the front display ran
its startup frames.

**SO THE ANSWER TO MIKE'S QUESTION IS: yes, it is the level field — and the
wiring is three repointings and one new row.**

1. `clean-boot` → COLD START *(exists)*
2. a new recipe, `{power:"on", level:1}` → FIRST RUN *(one row in `twin.html`)*
3. `idling-updated` → LAST STATE *(exists)*

**ONE HAZARD TO CARRY INTO THAT BUILD.** `standard` alone has `resume:true`, and
resume is checked **before** power — a returning visit is put straight at the
menu without the ceremony, deliberately. **None of the three bank states may
carry `resume`**, or a second latch in the same session lands on a static menu,
which is the failure Mike named.

**NOT WIRED THIS ROUND, and the reason is scope rather than difficulty:** the
bank states exist only in the mock, the shipped drum positions are `arms: false`,
and the panel they belong to is not built. Wiring them into the current drum and
then moving them to banks is churn. **The recipe mapping above is the durable
part and it is now measured rather than assumed.**

---

## TEST BENCH — report only

### 1 · WHERE THE FOUR CHANNEL BUTTONS LIVE

**They already exist, and they are already four.** The twin's own screen carries
a digit strip inside the picture: measured on the live page,
`#monlayout .chy` reads **`1` `2` `3` `4` `X`**. S4 turned the fifth into the
close control. **Four numbered buttons and a way out — the keypad is built.**

Under **Ruling 26** the museum's overlay carries the television's own controls,
so a channel strip belongs there for the channels the twin does not host
(television, the test signal). **The twin's strip is the machine's own and stays
where it is.** Whichever surface a visitor is on, they are pressing 1–4.

### 2 · WHAT SIX DIGITS OF BASE-4 COSTS

**4⁶ = 4096.** At a generous one attempt per second that is **~68 minutes to
exhaust and ~34 to average** — enough that it is **a code to be given, not
guessed**, which is what Mike means by *"They are meant to require a code."*

**The number only holds if the museum gives nothing away.** No attempt counter,
no partial-match feedback, no "wrong code" — any of those cuts 4096 to a handful.
**Silence is not politeness here; it is the entire strength of the lock.**

### 3 · HOW ENTRY IS SHOWN WITHOUT ANNOUNCING THAT A CODE EXISTS

**By not being a mode.** Pressing `1 2 3 4` in sequence is what changing channel
already looks like. If the keypad IS the channel strip, a visitor entering a code
is indistinguishable from a visitor surfing — which is Mike's *"we hide in plain
sight"* stated as a mechanism rather than as a wish.

**So: no entry field, no digit echo, no progress dots.** The only feedback that
would not announce the mechanism is feedback the machine already produces —
the per-feed weather, a glitch, a flicker — because those already happen for
their own reasons and a visitor cannot tell a hint from the weather.

**The cost is real and should be said: a visitor who has the code and mistypes it
gets nothing and no way to know why.** That is the price of the lock being
invisible, and it is why the code has to be *given* rather than discovered.

### 4 · VISIBLE OR SILENT REFUSAL

**Silent. TEST BENCH arms and latches like any other bank state, and opens the
ordinary portal until the sequence is right.**

**AND THAT IS DELIBERATELY THE OPPOSITE OF THE PANEL'S OWN RULE**, so the
difference is worth stating: `InstrumentPanel`'s doctrine is *a control that
declines silently is the same defect as a menu that hides what it is not
offering.* **That rule is about CONTROLS. This is an EGG.** A control that
refuses must say why or the visitor is stuck; an egg that says why is not an egg.
A visitor who never enters the code has lost nothing — TEST BENCH behaves like
every other state.

**NOT DECIDED, AND NOT OPS' TO DECIDE:** what the code opens, and the sequence —
Mike has ruled *"I do not want to give them both at the same time."* The lock and
the key arrive apart; **which comes first is Ops' to sequence and neither is
invented here.**

---

## WHAT IS NOT BUILT

Nothing has moved in `src/`. Still waiting on Mike looking at the mock: the
rebuild proper — `InstrumentPanel`, the banks, the DIP, the deleted switches, the
eight stale register rows, and the channel selector moving to the overlay under
Ruling 26.

Carried forward from last pass and still true: **the museum's `--engrave` token
is under AA on this chassis**, so the rebuilt panel wants its own ramp.
