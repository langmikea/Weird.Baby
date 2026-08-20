# 04 · THE MENU, THE APPS AND THE CARDS

**Register key:** `STORY` · `OPS`. **Publication key:** `PUB` · `—`.
**Nothing in this file is published.** No visitor has met the menu.

---

## 1 · THE VOCABULARY OF THE MENU
<a id="vocabulary"></a>

| term | register | meaning as attested |
|---|---|---|
| **Door** | STORY | A top-level division. **Four named doors: ANSWERS · PROGRAMS · MESSAGES · SETTINGS**, sorted by **FUNCTION OVER STRUCTURE** — what it *gives* you. [K-19](CONFLICTS.md#k-19) |
| **Row** | STORY | One line of a menu table. **187 live rows across 28 tables.** Presented **one at a time.** |
| **Level** | STORY | A menu table. |
| **Passage** | STORY | A row that returns to the level above. |
| **Rows not shown** | STORY | ***A row appears when the instrument has cause.*** Read access decides. |
| **Read access / run access** | STORY | Per-row passcode columns. `readAccess_ENABLED`: **1 = visible, anything else = hidden.** **Run-access passcodes are carried in every row and checked nowhere in firmware** — [H-11](HOLES.md#h-11). |
| **Access code** | STORY | A number that reveals or runs a row. **A code, once accepted, is retained; a code may be accepted before its function exists and takes effect when the function arrives** — the *displayability doctrine*, Appendix A-3. |
| **Functions not fitted** | STORY | Rows that print **(not installed)** and go nowhere — Calculator, Notepad — and uninstalled personas, which show a **PERSONA NOT INSTALLED** card. |
| **`.end`** | OPS-in-source | The table terminator. Every table's last row. |

**THE DOOR NAMES ARE LIVE AND THE ON-GLASS POLISH IS MIKE'S**, at manual-print.
*"Advice" was rejected as a door name — too passive for the wondrous MGK-VIIIp.*

---

## 2 · THE TREE AS BUILT
<a id="tree"></a>

**28 tables · 187 live rows.** Source: `robots:docs/MENU_MAP_v3-four-doors-20260724.md`,
generated from the live twin; verbatim table data at `viiip_twin.html:2021`
(`MENU_TABLE_SRC`, parsed from `2_data_MENU.ino`).

### The DOORS ROOT — table 26

| row | label | goes to |
|---:|---|---|
| 0 | **Answers** | ANSWERS door (23) |
| 1 | **Programs** | PROGRAMS door (24) |
| 2 | **Messages** | Messages (2) — direct to the legacy branch, pending the unification build |
| 3 | **Settings** | SETTINGS door (25) |

### ANSWERS — table 23

`Answers` · `Advice` · **`Excuses`** · **`Lines`** · `Predictions` ·
`Probabilities` · **`ELIZ [-02]`** · back.

### PROGRAMS — table 24

`Games` · `Detectors` · **`Brain Training [-02]`** · **`Inkblots [-02]`** ·
`Calculator (not installed)` · `Notepad (not installed)` · **`Radio [-07]`** ·
**`Phone Tap [-07]`** · **`Casino [-21]` — code 2121** · back.

### SETTINGS — table 25

`Preferences` · `User` · `Codes` · back.

### The legacy tree, orphaned but intact **by design**

Tables **0** (Root: MGK-VIIIp / Messages / Programs / Preferences), **1**
(MGK-VIIIp: Answers / Predictions / Probabilities / **Advice code 411** /
**Detectors code 7**) and **3** (Programs: Games / Codes) are still there and
still reachable from the dev rail (`devLegacyMenu()`).

**THIS IS A FOURTH SHAPE.** The bible says three doors in one chapter and four in
its addendum ([K-19](CONFLICTS.md#k-19)); the firmware's own root table is this
legacy one. **The live tree today is the four-doors root with the legacy tree
underneath it.**

### The rest of the tables

| # | table | live rows |
|---:|---|---:|
| 2 | Messages | 4 |
| 4 | Preferences | 6 |
| **5** | **Answers** | **40** — 3 visible engines, 4 hidden engines, then the 32 unit positions |
| 6 | Predictions — Fortune · Horoscope | 3 |
| 7 | Probabilities — Coin Flip · Pick a number · Pick a card · Roll Dice · Lottery Numbers | 6 |
| 8 | Advice — Everyday · Career Chooser · Career Advice · Office Nickname · Water Cooler · Partners · Friends & Family · Inlaws and Outlaws | 9 |
| 9 | Detectors | 6 |
| 10 | Voice Msgs | 8 |
| 11 | Text Msgs | 6 |
| 12 | System Msgs | 4 |
| 13 | Games | 8 |
| 14 | Codes — Code Runner · BIST · Userdata · Checksum | 5 |
| 15 | User — Name · Security | 3 |
| 16 | Polarity Bias | 3 |
| 17 | Coarse Bias | 7 |
| 18 | Clarity | 3 |
| 19 | Clarity Setting | 6 |
| 20 | mgkModel — Classic · Large · Audio | 4 |
| 21 | Voice list | 12 |
| 22 | *(empty, firmware padding)* | 0 |
| 27 | **CASINO (Juan −21)** — Slots · Craps · Blackjack · Roulette | 5 |

---

## 3 · THE APPS
<a id="apps"></a>

### Detectors — [K-11](CONFLICTS.md#k-11)

**Bullshit · Stud · Trustworthy · Attractiveness**, plus **Spy [−07]**.

**The Bullshit Detector is the only feature that makes the microphone real.**
`The_Mic_Has_Data()` (RMS > 30) is written and works; `HW_Rescan_MIC` consumes
nothing. All four share one needle and differ only in the verdict band table.

**Spy Detector verdicts, ruled and landed: `SPY` / `SPY-NORMAL` / `WEIRDO`.**

### Games / diversions — [K-11](CONFLICTS.md#k-11)

`Tilt Drive` · `Gobble Don't Fall` · `AvoidSteroids` · `Snow Globe` ·
`Tic-Tac-Toe` · `Mail Run` · `Sniper [−07]`, plus the four-row casino behind
`2121`. A 346-line **Space** game is commented out in the firmware.

**Day-one games are ruled: Snow Globe + Tic-Tac-Toe.** WOPR tic-tac-toe is on the
egg slate.

**THE GAMES LIST IS DELIBERATELY UNSTABLE IN-FICTION** — *the AI renamed the
games* — and that is a live egg, `egg.renamed-games`, REVEALED, LIVE.

### The app-pattern engine — Excuses / Lines

**THE UNIVERSAL APP PATTERN:** `WHO` / `WHY` / bias settings local-or-global /
`INVENT-A-NAME` / per-field wing-it / **one overall WING IT button**.
REASON-aware innuendo and sass via BS config.

**LAW C RESIDUAL (Ops-ruled, reversible):** the engine is a **UNIVERSAL
carriage** — every unit carries it — and **word-lists compile per-persona.**

**WING-IT stays SHAKE even on config cards** — generative inside a navigational
screen.

### Persona apps

| app | unit |
|---|---|
| **ELIZ** — the psych suite | Everyman −02 |
| **Brain Training · Inkblots** | Everyman −02 |
| **Radio · Phone Tap · Sniper · Spy Detector** | Informer −07 |
| **The Career Suite** — Career Chooser + Career Advice | CEO −09 (**his estate; Career is CEO-only**) |
| **The Casino** — Slots / Craps / Blackjack / Roulette | Gambler −21 |

**ELIZ is the predecessor of ELIZA** — 1965 pre-dating 1966; **an
unreliable-record artifact.** The machine listens without comprehending (layer 1
holds); the act is famously mechanical one year *early*.

**CASINO DOCTRINE: ALL units get SOME casino games; only Gambler −21 gets ALL.**

**CALC + NOTEPAD = EVERY UNIT** — the *uselessly-useful universal* doctrine.
Both currently print **(not installed)**, honestly.

**Career Chooser's search is DELIBERATE BS THEATRE** — a visible match meter, a
slowing approach, occasional local-minimum detection → a faster back-up → a
global hunt. Deterministic-friendly. **SHAKE runs it, not click.**

**OFFICE NICKNAME = EARNED EGG (canon):** introspective mode — *what they call
YOU*; **NOT modifiable by BS; the truth.** Earn condition and nickname content
are `[PAPA]`.

### Messages

**Three branches today — Voice Msgs · Text Msgs · System Msgs — and the
unification spec is ADOPTED and not built:** *messages unify into ONE inbox,
senders differ, read/unread clear.*

**THE GENERIC INBOX HOLDS EXACTLY TWO FACTORY ITEMS** — welcome + start-up
procedure — **present from OS install, never "sent."**

**SYSTEM MSG 02 IS OFF-CANON.** It confesses a flash failure (*"Service is not
available in your region"*). Under the persistence ruling the machine has real
persistence and the server is theatre; **it would never file that defect. Kill or
redesign at the words pass.**

**ALL MESSAGE WORDS ARE PARKED PLACEHOLDERS.** **Message MECHANICS stand as
built** — delivery clock, status→visibility, reader, Morse.

### Codes

`Code Runner` · `BIST` · `Userdata` · `Checksum`. All four are named in the
manual's Section X. **`Userdata` ties to the ALERT egg and the 2022
usage-tracking idea — the nag itself is KILLED; the data is not.**

### User

**`Name` and `Security`. RULED (X1, 2026-07-30): `Preferences > User > Name` IS
the user settings station and carries NAME + BIRTHDATE.** The name is spelled on
a **letter ring** — scroll picks, click takes, `<DEL>` / `<END>` ride the ring —
*"the arcade high-score solution, which is the only one the machine's two inputs
allow."*

**THE ABSENT-NAME LAW: with no name on file, every user-reference surface says
`<NO USER NAME>`.**

**THE NAME EGG:** with a name and birthdate on file the **Horoscope** menu grows
a row wearing the user's name that reads their birthdate's sign. **The reading
itself NEVER carries the name — it is written to a sign, not to a person.**
Live: `egg.name`, REVEALED, LIVE.

**The year is entered and no surface consumes it** — [K-20](CONFLICTS.md#k-20).

---

## 4 · THE CARD VOCABULARY
<a id="cards"></a>

**These are the names the SPEAKABLE INDEX gives the drawn surfaces so that a
sentence about one lands everywhere it appears. All are OPS names for IN-STORY
objects: the objects are on the glass, the names are not.**

| term | what it is |
|---|---|
| **The rail card** | `" ----<          >----"` with the name struck in at column 40. ***"It opens almost everything."*** **An original firmware block with no function name — typed inline in two places.** |
| **The redirect card** | The rail card plus **OUTPUT REDIRECTED TO** over the destination. |
| **The test bars** | The row of vertical bars that means **signal present.** **Geometry deliberately identical everywhere**, so *signal OK* always reads the same. |
| **The hint zone** | The one line of verbs at the foot of the top glass — `<scroll back>`, `<shake again  scroll back>`. **One band, one place, cleared before it is written.** |
| **The menu card** | Header, `Please Select:`, and the current row in its brackets — `> ` … ` <`. |
| **The panel** | The app settings page: title with a rule, label/value rows, `<EXIT` low-left and `GO>` low-right. |
| **The bracket** | **Mike's selection tell** — `<cancel>` against ` cancel `, `<< >>` against `< >`. **The origin of the W3 bracket standard.** |

---

## 5 · THE INPUT GRAMMAR
<a id="input"></a>

**Full law text at [LAWS](10-LAWS.md#the-input-grammar-law).** The shape:

- **SHAKE = "another"** — re-run, re-roll, next.
- **SCROLL = "go back one level"** — context-aware, always one level up.
- **CLICK = select.**

**THE TWO-CONTEXT GRAMMAR (C2, 2026-07-24, the refinement):**

| context | SCROLL | CLICK | SHAKE |
|---|---|---|---|
| **NAVIGATION** — menus, config cards, readers, lists | browse | drill in / select (selecting a value pops back up one level) | — |
| **GENERATIVE** — answers, rolls, deals, searches, wing-it | back / exit | — | another |

***The boundary: "is the machine MAKING, or am I CHOOSING?"***

**The config card works exactly like a NESTED MENU:** scroll to a field, click to
enter, scroll among values, click to select-and-return.

**THE RADIO TUNING RULING (R1, 2026-07-24)** resolves the last grammar conflict:
SCROLL **sweeps the dial** — browsing stations. While the needle moves:
noise/static. **The pointer SNAPS TO SIGNALS, not to fraction marks** — the
needle finds broadcasts, not geometry. **The push-button band-step retires.**

**THE PANEL VERBS READ *"dial to change, press to keep."***

---

## 6 · THE MENU'S OWN MACHINERY
<a id="machinery"></a>

`MENU_TABLE[23][41][3]` and `MENU_PARAMETER_TABLE` — both generated from the
8Ball Specification's *Menu System* sheet (2,683 cells). The spreadsheet
**literally contains the C initialisers** that appear in `2_data_MENU.ino`.

**Parameter columns:** unique id · linked menu · linked line · `links_to_Exe` ·
then **four passcode columns** (read/run × two states).

**The states:** `MENU_SYSTEM_COLD_START` · `CHECK_FOR_INPUT` ·
`DETERMINE_IF_EXE` · `RUN_EXE_ST`.

**~111 executable leaves; 5 handlers wired in the 2024 firmware head.**

**THE STUB LAW:** stub rows are **stripped from the menus** rather than shown —
which is why the twin's stub rows are not `shown` in the reveal ledger.

**THE APP ENTRY GATE (D4 TEMPLATE LAW, 2026-07-27):** `App_Enter_Gate(name)`.
Every app enters the same way.
