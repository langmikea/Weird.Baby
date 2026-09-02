# TWO DIAGNOSTICS — 2026-08-21

**Report only. Nothing was built into the museum; nothing is wired.** The one
new file is `tools/canon-gate.mjs`, a prototype that is in no npm script and no
gate sequence. The tree is otherwise clean.

---

# 1 · THE FOUR BANK STATES

## THE HEADLINE

**Three of the four are broken and two of them draw a black screen forever.**
Every line below was watched on the page, not read out of the recipe table.

| state | id today | on a clean session | verdict |
|---|---|---|---|
| **NIAC/VIIIp** | `standard` | powers, the ballet runs, mark `PB` | **works** |
| **COLD START** | `boot-playback` | powers at **level 2**, fires `SANDBOX_REPLAY` at **528 ms** | **wrong ceremony** — an established machine replaying its install, not a virgin one |
| **FIRST RUN** | `off-first-boot` | **`powered: false`, `mark: none`, both screens BLACK at 55 s** | **dead** |
| **LAST STATE** | `last-state` | **not a recipe at all** — nothing applied; `powered: false`, `mark: none`, BLACK at 25 s | **dead** |
| *(candidate)* | `clean-boot` | powers at **level 0**, ballet runs: `MGK-VIIIp BIOS` → `AUX IDENT / FACTORY ROM ON FILE / 20% E0` → `AUX CHECK / CHECKSUM / 84% E1` | **the real cold start** |

## THE RESUME HAZARD IS PROVEN, AND PHOTOGRAPHED

`standard` is the only recipe carrying `resume`, and resume is checked **before**
power. Latched twice in one session:

- **latch 1**, clean session, at 30 s: `powered: true`, ballet running, mark `PB`.
- **latch 2**, same session, **at 7 seconds: the MENU.**
  Front glass: `-(A)BEAL MGK-VIIIp )- / Please Select: / > Answers <`.
  Monitor: `WAITING FOR USER INPUT`.

**No ceremony at all.** That is the static-menu failure, reproduced on demand.
**None of the three bank states may carry `resume`.**

## WHAT I COULD NOT PROVE — AND IT IS THE THING YOU ASKED TO SEE

**No run reached the level-specific section of the ballet inside any observation
window.** At **89 seconds** `clean-boot` was still showing `SELF TEST / NO LINK /
RAM ....` — the POST, which comes *before* `Boot_Level_1`.

**So I have not seen `NOT ON FILE`, the dial, the download bar or the restart.**
I am not reporting that they do not happen. I am reporting that the ceremony did
not reach them in 89 s under this harness, and that **the harness is the prime
suspect**: `OPERATIONS.md` §8 already records that `requestAnimationFrame` does
not fire in a frame the browser is not painting, and every pause in the ballet is
a `Beat()` — so a throttled frame stretches a ceremony indefinitely rather than
failing it.

**WHAT WOULD SETTLE IT COSTS ONE MINUTE:** a human opening
`/held/robots/twin.html?user=1&preset=clean-boot` in a foreground tab and
watching once. That is the same rule the 20 Aug round wrote down — *when the only
oracle is a rendered view and Ops cannot render, ask Mike to look on round one.*

## THE EXACT REPOINTING — not applied

| bank state | point it at | status |
|---|---|---|
| `NIAC/VIIIp` | `standard` | unchanged |
| `NIAC/VIIIp · COLD START` | **`clean-boot`** | exists — `{power:"on", level:0}` — and is marked *"carried, still wired, currently unexposed"* |
| `NIAC/VIIIp · FIRST RUN` | **one new row** | `"niac-viiip-first": {power:"on", level:1}` in `PORTAL_RECIPES`, `twin.html` |
| `NIAC/VIIIp · LAST STATE` | **`idling-updated`** | exists — `{power:"on", level:2}` |

**READ THE OFF-BY-ONE BEFORE TOUCHING IT.** Mike's Level 1 / 2 / 3 are the
recipe's `level: 0 / 1 / 2` — *virgin / first-run / established*, in the recipe
table's own words. `Boot_Ballet` dispatches `lvl<=0 → Boot_Level_1`,
`lvl===1 → Boot_Level_2`, else `Boot_Level_3`.

**AND `level: 1` HAS NEVER BEEN EXERCISED.** No recipe carries it today, so
`Boot_Level_2` has no route into it from the museum at all. When FIRST RUN is
wired it will be the first time that path runs from a latch — and it contains
`Boot_Offer()`, **which waits for the visitor to answer.** A bank state that
stops and asks a question is a different object from one that plays; that wants a
look before it ships.

## THREE INSTRUMENTS, TWO OF WHICH LIED

Recorded because the round's own instruction is that reading code is not
evidence, and my first two instruments were not evidence either.

1. **Pixel-hashing the two screen canvases.** Worked, but told me only *that*
   something changed, never *what*. Useless for distinguishing a virgin install
   from an established one.
2. **Wrapping `Boot_Say` / `Boot_Ballet` on the iframe's window.** Reported
   **zero calls** for a machine I had watched boot with my own eyes. The wrap
   installed (`hooked: true`) and one hook — `Sandbox_Replay` — *did* fire, so
   the technique works; the level functions simply were never reached inside the
   window. **A silent instrument and a stalled ceremony look identical**, and I
   nearly filed "COLD START draws nothing" on the strength of it.
3. **Zooming into the two glasses and reading them.** The only one that could not
   lie. Everything asserted above comes from it or from a direct variable read.

---

# 2 · THE CANON GATE

## THE NUMBER

> ## **DAY-ONE FAILURE COUNT: 3**

Five without the match discipline described below; two of those five are
`Door` matching *"leaving the door shut"* and `Beat` matching *"the machine's own
opening beat"* — ordinary English colliding with canon terms. **Those are not
noise, they are wrong**, and a gate that is wrong twice stops being read. With
the discipline on: **3**.

**Run it:** `node tools/canon-gate.mjs` (add `--strict` to turn the discipline
off and see 5).

## THE THREE

| | term | where it reaches a visitor |
|---|---|---|
| **CONTESTED** | `Everyday, The / The Everyman` — **K-06** | `THE EVERYDAY`, Record 002's personnel manifest — **published** |
| **CONTESTED** | `Informer, The (−07)` — **K-05** | `THE INFORMER`, the same manifest — **published** |
| **CONTESTED** | `Portal, the — three objects` — **K-03** | `the Portal`, in *"Is the Portal the real machine?"* |

**Ops-register terms reaching a visitor string: zero.**

## THE DESIGN

**Two inputs, and neither is a second copy of anything.**

- **The catalogue is the truth.** Every term and every term's *state* is read
  from `docs/canon/INDEX.md`'s own A–Z, using the markers the catalogue already
  writes: a link to `CONFLICTS.md#k-nn` is **contested**, `**OPS**` is
  **Ops-register**, `**PUB` is already on the glass, `RULED` is **decided**.
  **Nothing is classified by the gate.** 329 terms parsed: 42 contested, 9
  Ops-register, 2 ruled.
- **`provenance/register.json` already knows what a visitor reads** — 2015
  declared strings with their files. Grepping `src/` would re-derive that badly
  and drag in identifiers, class names and comments, which is most of the noise
  a gate like this dies of.

**A RULED TERM IS SKIPPED.** Contested and decided are different states, and that
skip is the difference between a gate and a nag.

**THE MATCH DISCIPLINE.** A hit counts only if the occurrence is the catalogue's
own casing or ALL CAPS. `THE EVERYDAY` in a manifest fires; `the door` in a
sentence does not.

**PROVED BY BREAKING IT.** `Inclination` (K-07, contested, not otherwise on the
glass) was planted into the Portal FAQ's answer and declared. The gate went
**3 → 4** and named it, with the string, the file and the catalogue row. Both
edits were then removed: the count is back to 3, `provenance:gate` PASSES, zero
stale rows, and `git status` is clean.

## THE FINDING THAT MATTERS MORE THAN THE NUMBER

**The gate cannot catch the case you named.** `MGK-NIAC`'s index row reads
`[02](02-MACHINES.md#names) · **PUB**` — **no conflict link.** The ambiguity *is*
recorded, but as prose in a table cell on a **different term**: `MGK-VIII`'s row
says *"In the fiction it is the rebrand of NIAC. **The two uses are not the same
object**."*

**So the multi-definition is written down and is not marked.** A gate that reads
the catalogue's markers cannot see it — and that is not a gate defect. **It is
the catalogue defect the gate surfaces on its first run.**

## WHAT WOULD HAVE TO BE RULED — and it is small

**ONE COLUMN, NOT FORTY FIXES.** The A–Z gains an explicit state per term:
`CONTESTED` / `OPS` / `RULED` / blank. 329 rows, most of them blank. That single
column is what turns "catches 3" into "catches what Mike means", because it makes
the classification a declaration instead of an inference from which links a row
happens to carry.

**AND THE THREE FINDINGS NEED RULINGS, NOT FIXES.** Two of the three are in
**published** text, which Ruling B forbids editing. So the route to zero is:

| | what closes it |
|---|---|
| **K-03** — the Portal, three objects | a ruling on which object the word names |
| **K-05** — which units are which | a ruling on the registry |
| **K-06** — Everyday vs Everyman | a ruling on the name |

**All three are already written up in `CONFLICTS.md` with every account and what
a ruling costs either way.** The cost column exists precisely to make these cheap
in the morning.

## THE THRESHOLD

**None is needed.** At 3 findings, all three closable by rulings that are already
costed, the gate should be wired at **zero tolerance** the day those three are
ruled — not now, and not with an allowance. An allowance is how `facts:gate`
became a thing nobody reads at 98.

**Until then it stays exactly as it is: runnable, unwired, and producing one
number.**

## WHAT IS NOT BUILT, AND WHY

**The third requirement — "a term used with a meaning the catalogue does not
carry" — is not built.** It needs a meaning model per term, and the catalogue
does not carry one: it carries *where a term is defined*, not *what it means in
this sentence*. Detecting a wrong meaning is not a string match, and anything
that pretended otherwise would fire on every ordinary use of a canon word.
**That requirement is a research problem, not a missing feature**, and it should
be split off rather than left as an unbuilt third of a gate.
