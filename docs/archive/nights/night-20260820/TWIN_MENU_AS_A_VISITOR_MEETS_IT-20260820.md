# THE TWIN'S MENU, AS A VISITOR MEETS IT

**Read-only report. Nothing built, nothing changed.** 2026-08-20.
Source: `robots:tools/viiip_twin.html`, read at HEAD.

---

## 0 · THE ONE THING THAT REFRAMES THE QUESTION

**The machine is already very limited, and it limits itself by two mechanisms
that are already built and already ruled.**

| mechanism | what it does |
|---|---|
| **THE PARCEL LAW** (`Parcel_Sync_Menu`) | On a fresh machine `parcel = {stage:0, keys:[], personas:false}`. That **hides MGK-v2.0, MGK-65, Detectors, Calculator, Notepad, Excuses, Lines, Mail Run, three of the six games, and every persona row.** |
| **THE STUB LAW** (`Scaffold_Strip`) | *"A row that leads to 'not built' is not a destination — it is a promise, and the menu is not the place to keep promises."* It hides every stub row **and any parent whose destinations are all stubs** — which removes **Codes** and **mgkModel** entirely. |

**So the honest starting point for "very limited" is not a blank sheet.** It is a
menu that already opens with **four doors, one answer engine, and about
seventeen reachable leaves.** The proposal Ops owes Mike is what to cut from
*that*, not from the 187-row tree.

---

## 1 · WHAT THE MENU ACTUALLY SHOWS

### The screen itself

`MENU_SYSTEM_COLD_START` is a **state in the FSM, not a table** — it redraws
wherever the menu already stands. The boot leaves it at
`menuNum_PTR = DOORS_ROOT, lineNum_PTR = 0` (`Doors_Restructure`, last line).

**The front glass is 128×32 and shows THREE rows. It shows ONE menu item at a
time.** Verbatim, from `Draw_the_Menu_Screen` / `Draw_the_Menu_Line`:

```
-(A)BEAL MGK-VIIIp >-          Header_01, row 0
        Please Select:         MENU_PROMPT, row 13, x=21
           > Answers <         SEL_OPEN + label + SEL_CLOSE, row 24, centred
```

**That is the whole first screen.** `> ` and ` <` are the house bracket
standard. SCROLL advances one row; `.end` wraps to the top. A row whose label
contains *back* is drawn **without brackets** — it is a passage, not a
selection.

**A depth indicator sits top-right**: one 2×2 pixel dot per drill level, up to
five.

### The first screen's four items, in order

Scrolling from the landing, a visitor meets exactly these:

| # | printed | what it is |
|---|---|---|
| 1 | **`> Answers <`** | door → the answers-class door |
| 2 | **`> Programs <`** | door → the programs door |
| 3 | **`> Messages <`** | door → **straight to the legacy inbox**, not to a door page |
| 4 | **`> Settings <`** | door → the settings door |

**All four are plain visible** (`READ_ACCESS_PASSCODE = 1`) and none is
executable — each drills one level.

**There is no fifth item and no back row at the root.**

---

## 2 · WHAT EACH ITEM DOES

**The test used throughout: `Run_EXE()` is the authority.** A row is *live* when
its `linked_menuNum` has a case there; a row is a *stub* exactly when it starts
`SCAFFOLD_PROC`; a row is *dead* when it falls to `default:` and only chips a
warning. That predicate is the twin's own — the scaffold CSV has gone stale and
still calls Fortune, Horoscope and the Advice family "scaffold" although all
three were built.

### ANSWERS door — what a fresh machine shows

| printed | state | what happens |
|---|---|---|
| **`> ASK MGK <`** | **LIVE** | drills to the engine list — **the answers engine** (§6) |
| **`> Advice <`** | **LIVE** | drills to three panel-model apps |
| **`> Predictions <`** | **LIVE** | Fortune and Horoscope, both built |
| **`> Probabilities <`** | **LIVE** | five real micro-interactions |
| `back` | passage | to the root |
| ~~Excuses~~ | **HIDDEN** — parcel `apps`, earned at 25 asks | |
| ~~Lines~~ | **HIDDEN** — parcel `apps` | |
| ~~ELIZ [-02]~~ | **HIDDEN** — `parcel.personas` false | |

### PROGRAMS door — and this is the emptiest room in the machine

| printed | state |
|---|---|
| **`> Games <`** | **LIVE** |
| `back` | passage |
| ~~Detectors~~ | **HIDDEN** — parcel `detectors`, 30 asks |
| ~~Brain Training [-02]~~ · ~~Inkblots [-02]~~ · ~~Radio [-07]~~ · ~~Phone Tap [-07]~~ | **HIDDEN** — personas |
| ~~Calculator~~ · ~~Notepad~~ | **HIDDEN** — parcel `tools` |
| ~~Casino [-21]~~ | **HIDDEN** — `READ_ACCESS_PASSCODE = 2121` |

**On a fresh machine the PROGRAMS door contains one item and a way out.**

**AND A PASSCODE IS NOT A PROMPT.** `readAccess_ENABLED()` returns true only for
`1`; **every other value — 2121, 411, 101 — simply means the row is not
drawn.** There is no code-entry path anywhere in the menu. A coded row is
invisible, not locked.

### SETTINGS door

| printed | state |
|---|---|
| **`> Preferences <`** | **LIVE** |
| **`> User <`** | **LIVE** — row 0 *Name* is the user station |
| **`> Maintenance <`** | **LIVE** — the care ritual |
| `back` | passage |
| ~~Codes~~ | **HIDDEN by the Stub Law** — all four of its rows are stubs, so the parent goes too |

### MESSAGES

Goes **directly** to the legacy inbox table — no door page. Three rows:
`Voice Msgs`, `Text Msgs`, `System Msgs`, `< Back`.

---

## 3 · HOW DEEP IT GOES — the tree a fresh machine actually has

```
DOORS ROOT
├── Answers
│   ├── ASK MGK ──────────► ENGINE LIST
│   │                        ├── MGK-NIAC        LIVE — the only engine
│   │                        │                    (v2.0 and 65 hidden by stage)
│   │                        └── < Back
│   ├── Advice ───────────► Everyday Advice      LIVE   ┐ the C4 panel model,
│   │                        Work Advice          LIVE   │ one app, three modes
│   │                        Personal Advice      LIVE   ┘
│   │                        < Back
│   ├── Predictions ──────► Fortune               LIVE
│   │                        Horoscope            LIVE   (menu-style sign pick)
│   │                        < Back
│   ├── Probabilities ────► Coin Flip             LIVE
│   │                        Pick a number        LIVE
│   │                        Pick a card          LIVE
│   │                        Roll Dice            LIVE — shake to roll
│   │                        Lottery Numbers      LIVE
│   │                        < Back
│   └── back
├── Programs
│   ├── Games ────────────► Snow Globe            LIVE
│   │                        Tic-Tac-Toe          LIVE
│   │                        Stop On A Number     LIVE
│   │                        < Back
│   │                       (Tilt Drive, Gobble Don't Fall, AvoidSteroids
│   │                        hidden — gamepack, 10 asks; Mail Run — stage 1;
│   │                        Sniper [-07] — personas)
│   └── back
├── Messages ────────────► Voice Msgs ──► " Welcome"            AUDIO
│                          Text Msgs ───► " Welcome!"
│                                          " Start Up Procedure"
│                                          "*New Feature Added"
│                          System Msgs ─► "*System Msg 01"
│                          < Back
└── Settings
    ├── Preferences ─────► User ──────► Name       LIVE (letter ring)
    │                       Polarity ──► Polarity Bias    LIVE
    │                                    Polarity Setting LIVE (6 rows)
    │                       Clarity ───► Clarity Bias     LIVE
    │                                    Clarity Setting  LIVE (5 rows)
    │                       Voice ─────► Voice 00 … Voice 10   LIVE (11 rows)
    │                       BS Level ──► LIVE
    │                       < Back
    │                      (mgkModel hidden — Stub Law)
    ├── User ────────────► Name         LIVE
    │                      (Security hidden — stub)
    ├── Maintenance ─────► LIVE — the care ritual
    └── back
```

**Reachable leaves on a fresh machine: about seventeen**, plus the message rows
and the settings values. **Maximum depth: four** (root → Settings → Preferences
→ Polarity → Polarity Setting).

**The `*` before a message subject is the unread mark**; the star beside a
settings value (`> Neutral * <`) means *this is the current setting*.

---

## 4 · WHAT DIFFERS BY LEVEL — almost nothing, and that is the finding

**The menu is built identically at every level.** `Doors_Restructure()`,
`Parcel_Init()` and `Scaffold_Strip(true)` all run once in `setup()`, before any
boot and regardless of level. **No level branch touches a menu table.**

What actually differs:

| | L1 VIRGIN | L2 FIRST-RUN | L3 ESTABLISHED |
|---|---|---|---|
| **The menu you land on** | identical | identical | identical |
| Ceremony before it | install, OS download, **self-retry into L2** | diagnostics + the permit/postpone offer | fast recognition |
| `System Msg 01` | delivered — `Messages_Trigger("first_boot")` fires in `setup()` **and** again in the L1 install path | delivered | delivered |
| Engine availability | **same** — parcels key off `askCount`, not level | same | same |

**ONE REAL LEVEL DEPENDENCY EXISTS AND IT IS INVISIBLE AT THE MENU:**
`Parcel_Eligible()` gates the v2.0 offer on `bootLevel() >= 2` as well as 20
asks. So a machine left at L1 can never be offered v2.0 — but nothing on the
menu shows that.

**AND THE PARCEL STATE OUTLIVES THE LEVEL.** `parcel` persists in
`localStorage` (`wbr_parcel`), so a returning visitor keeps whatever they
earned even though the iframe was destroyed. **A first visit is the only fresh
one.**

`?parcel=all` unlocks everything — the comment calls it *"museum demo param"*.

---

## 5 · WHAT REACHES FOR SOMETHING THAT WILL NOT ANSWER ON THE PORTAL

### 5.1 · Audio — **broken today, and it is a path mismatch, not a missing file**

```
the twin asks for : /held/robots/mgk-viiip/content/build/SD/NN/NNN.wav (then .mp3)
the museum serves : /held/robots/audio/build/SD-18/NNN.mp3   (20 files)
                    /held/robots/audio/build/SD-20/, SD-23/
```

`AUDIO_BASE = "../robots/mgk-viiip/content/build/SD/"` resolved from
`/held/robots/twin.html` gives `/held/robots/mgk-viiip/…`, and **there is no
`mgk-viiip` directory under `public/held/robots/`.** Every call misses and the
twin chips *"♪ missing NN/NNN"*.

**What that costs a visitor, concretely:**

- **The `Welcome` voice message is the first thing under Messages and it plays
  nothing.** Its own front card prints `click=play  scroll=exit`, so the machine
  offers a verb it cannot honour.
- Every answer reveal computes a folder and file and asks for audio it will not
  get. **The text still draws** — the reveal is not blocked — so this is silent,
  not fatal.
- The Radio app is persona-hidden, so its audio never comes up.

**Not a museum decision yet: the files exist, at a different address.**

### 5.2 · The microphone — **reaches for nothing; it is already a shim**

`Mic_RMS()` returns a synthetic level (`MIC_LEVEL × jitter`). There is **no
`getUserMedia` anywhere in the file.** The Bullshit / Stud / Trustworthy /
Attractiveness detectors run off that shim and work — and they are **hidden by
the parcel law anyway** on a fresh machine.

### 5.3 · The sensors — **synthetic, and the visitor has a button for them**

The IMU is a shimmed accel vector. `SHAKE` spikes it; `W A S D` tilt it. In user
mode the four controls **`⏻POWER · ⟳SCROLL · ◉CLICK · ≋SHAKE`** stay on screen —
`body.usermode .dev{display:none}` hides the workshop rail but **not** `.btns`.
So shake is reachable.

**BUT `.keyhint` IS HIDDEN IN USER MODE**, so the keyboard equivalents are not
advertised. A visitor has four buttons and no instructions.

### 5.4 · The far end — **not built at all**

No video link, no far-end model, no parity/duplex/word/stop state anywhere in
10,802 lines. **Nothing in the menu reaches for it**, so nothing breaks — but
the machine the manual describes has a subsystem this menu cannot offer.

### 5.5 · Speech synthesis

One site: `SpeechSynthesisUtterance` + `speechSynthesis.speak`. Browser-native,
needs no permission, **and is a modern voice on a 1965 machine.** Flagged, not
judged.

### 5.6 · Flash

`Save_To_Flash()` is a stub that prints and returns. **Every settings change a
visitor makes is RAM-only** and dies when the overlay closes. The parcel and
health state persist (localStorage); **the bias settings do not.**

---

## 6 · THE ANSWERS ENGINE — how a visitor reaches it, and what it says

### The route

```
Answers  →  ASK MGK  →  MGK-NIAC  →  [the ask]
```

**Four presses from the landing screen**, and the engine list is a screen a
visitor must pass through even though **it has exactly one entry** on a fresh
machine.

The engine list draws in its own layout — `menuNum_PTR === ANSWERS` gives it a
header of its own:

```
 ASK MGK >
       > MGK-NIAC <
          < Back
```

### What the ask looks like

1. **The redirect card** — the rail card, then
   ` OUTPUT REDIRECTED TO` over `  FLUIDIC SUSPENSION `.
2. **The ask**, on the top glass, in the ceremony face:
   ```
    Ask question,
      then shake.
   ```
   with `<scroll back>` in the hint band.
3. **SHAKE (>1.3 g) reveals.** Bubbles spawn; condition is spent.
4. **The answer HOLDS with no timeout** — the reveal-hold law. Scroll exits.
   Shake before the minimum read time is refused; **three early shakes fire the
   recalibration ritual** (`ERROR DETECTED.` / `RECALIBRATION REQUIRED!`, hold
   still ~2 s, `RECALIBRATED.`).

**AND THE ONE THING THAT MATTERS MOST FOR A MUSEUM VISITOR: MGK-NIAC IS
SHAKE-ONLY.** `if(M8B_ID !== MGK_NIAC) { … REVEAL … }` — **the click is consumed
and ignored.** A visitor who presses `◉CLICK` gets nothing and is told nothing.
The only engine a fresh machine has is the one engine that will not answer a
click.

### What a first-boot machine would say

Defaults, verbatim from the twin:

```
polaritySettingNOW = Neutral (2)      claritySettingNOW = Impartial (3)
polarityBiasNOW    = 0                clarityBiasNOW    = 100
```

- **Polarity bias 0 → the weight is 100 for every answer → all twenty are
  reachable, flat.** This is the classic Magic 8-Ball spread, and it is a ruled
  fix: at the firmware's original 100 only the four *ask again* answers were
  reachable at power-on, on every engine.
- **Clarity bias 100 → only the Impartial column has any weight.** Clarity is
  pinned to the setting. On MGK-NIAC it makes no difference — the core table has
  one text per answer.

**So a first-boot machine says any one of the classic twenty, uniformly**, in
the plain 1946 wording: *Ask again later.* … *Without a doubt.*

### Polarity and Clarity are reachable; Inclination is not

`Settings → Preferences → Polarity → Polarity Setting` offers **six** rows —
`Negative · Pessimistic · Neutral · Favorable · Optimistic · Affirmative` — while
the enum has **five** and the twin's own comment says *"NOTE: no Affirmative -
preserved bug"*. Selecting Affirmative writes 5 into a 0–4 enum. **At bias 0 it
is harmless**, because every weight is 100 regardless.

**Inclination appears nowhere in this menu.** It is in the manual and in the
specs and in no firmware.

**AND CHANGING EITHER SETTING DOES ALMOST NOTHING TODAY**, which is worth
knowing before anything is limited: with polarity bias at 0 the *setting* has no
effect on the draw at all. A visitor can move Polarity from Negative to
Optimistic and the answers will not shift. **The bias is what does the work, and
it lives one level deeper, under `Polarity Bias` / `BS Level`.**

---

## 7 · THINGS OPS SHOULD PUT IN FRONT OF MIKE WITH THE PROPOSAL

**Not decisions — the four facts that will shape whichever way he rules.**

1. **The machine already limits itself, twice, by ruled mechanisms.** Any new
   limit should say whether it is a third mechanism or a change to the parcel
   thresholds — which are one tunable line (`P_V20_ASKS=20, P_GAMEPACK_ASKS=10,
   P_APPS_ASKS=25, P_DET_ASKS=30, P_65_ASKS=60`).
2. **`PROGRAMS` currently holds one item.** A door with one thing behind it is
   already close to the Law of Subtraction's question.
3. **The click does nothing on the only engine a visitor can reach**, and the
   machine does not say so.
4. **The seeded inbox is three text messages and a voice message**, against
   canon's *"the generic inbox holds exactly TWO factory items"*. Recorded as a
   divergence, not corrected.
