# 05 · THE BOOT, THE TWO MACHINES AND THE SOUND

**Register key:** `STORY` · `OPS`. **Publication key:** `PUB` · `—`.
**Nothing in this file is published.**

---

## 1 · THE THREE STARTING SEQUENCES
<a id="levels"></a>

**CANON, Mike, 2026-07-23.** `MANUAL_STRUCTURE_FIT` calls this *"the structure's
best fit anywhere"* — three sequences, three positions, ¶5-3 / 5-5 / 5-7.

| level | name | what happens |
|---|---|---|
| **L1** | **VIRGIN** | No record. Load fails → **investigates** → **fresh install determined** → **OS download** (EST 10–15 s; the front narrates for the user, the top runs rich compelling chatter — *needn't make sense, must SOUND like it does*; **egg / passcode real estate**) → completes → **self-retries the boot.** |
| **L2** | **FIRST-RUN** | File found, record not established → **visible setups and diagnostics** → the user **PERMITS or POSTPONES** the external-content download → menu. |
| **L3** | **ESTABLISHED** | Fast, sleep-like check → **recognises us** → reports → menu. |

**What the glass says:**

| level | on the glass |
|---|---|
| L1 | `SYSTEM RECORD - NOT ON FILE` → `INVESTIGATING` → `FRESH INSTALLATION DETERMINED` |
| L2 | `RESPONSE CURVE LOADED` and the rest of the first-run check |
| L3 | `USER RECORD - ON FILE` · `SYSTEM OK` |

**Words are descriptive, not sacred. The bar is *believable for the period AND
for the fiction*.**

**BOOT IS MANDATORY AND IT IS A LIVING SURFACE.** *"Sleep-return (short) is the
dominant wake pattern; reboot happens sometimes."*

**THE FRONT WAKES FIRST — canon, and the code disagrees.**
[K-10](CONFLICTS.md#k-10).

---

## 2 · EXTERNAL CONTENT TRANSFER
<a id="transfer"></a>

The offer, at L2: **`EXTRA CONTENT IS AVAILABLE` · `DOWNLOAD NOW` · `DOWNLOAD
LATER`.**

**Permitting** and **postponing** are the manual's two words for it; the
firmware's return values are still `permit` / `postpone`. **A 120-second
auto-postpone guard runs on the human clock.**

**It is never called "answers."** *The fiction's fancy-speak, the calibration
dance.*

**AND IT IS THE ENGINE OF THE WHOLE REVEAL FICTION** — see
[the downloads fiction](10-LAWS.md#the-downloads-fiction).

---

## 3 · SELF-CORRECTION
<a id="self-correction"></a>

**A step errors, retries and succeeds.** Frequency rides condition; **five or
more stutters fires a message.**

**The manual has two positions for it** — ¶5-13, during starting, and ¶9-5, as a
service matter.

The monitor tracks it as **`RECOVERED n`**. *"The escalation ladder past
narration — alerts → messages → the system takes the credit — is BANKED; the
trigger hook fires at 5. Spice, not epic."*

---

## 4 · F AND T — THE TWO MACHINES
<a id="f-and-t"></a>

| term | register | meaning |
|---|---|---|
| **F** | OPS | The front machine — the system GUI. |
| **T** | OPS | The top machine — apps and detail. |
| **MGK-AUX** | STORY | The header struck on T's own log during the boot. **T's own name for itself.** |
| **AUX LINK / IDENT / BIOS / CHECK / START / SYNC** | STORY | The six goals that ride the rail on F's install screen, one per act. |
| **The data bus** | STORY | Named on the glass. States: `REQUESTING` · `MAIN >>> AUX` · `AUX >>> MAIN` · `GRANTED`, under a `C:\SYS>` ARBITRATION line. **Traffic reads as a DIRECTION, not a label.** |
| **Segment** | STORY | One of **six** BIOS segments. |
| **Checksum** | STORY | Ephemeral theatre in the boot (**FT3-exempt**); a code utility in Section X. |
| **The ballet** | OPS | **The one boot.** *"A boot is not a list of steps. It is the choreographed start-up of a plant."* |
| **Beat** | OPS | **Every pause in the machine is an authored, named beat.** ~72 named beats, ~24.5 s of authored beat time. |
| **The stagger** | OPS | **F and T never both change in the same instant.** Conductor-enforced at a **110 ms floor.** |
| **The glitch** | OPS | `Glitch_Punctuate` — **subtle tier only**, 14 wired sites. ***Punctuation, not noise.*** |
| **The hum** | OPS | A **60 Hz** mains bed with a **120 Hz** transformer bite. **Transmissions ride it as a dip and a swell, not as beeps over silence.** |

---

## 5 · THE BALLET — seven acts
<a id="ballet"></a>

`Boot_Ballet()`, `robots:tools/viiip_twin.html:8284`. **There is no second copy
of the boot** — the preview buttons play this same function.

| act | what |
|---|---|
| **0 — POWER** | Two beats of dark before anything earns light. **The one FT5 exemption, stated:** both glasses change in the same instant, *"and that is CORRECT: power is ONE event on one rail, not two machines behaving."* Also the one exemption from the heartbeat law. |
| **1 — THE AWAKENING** | Both glasses race, **each running its own generator** (`Glass_Duet`, front delayed by `orgDesync()`, up to 260 ms). |
| **2 — THE COLLISION** | `SELF TEST` on T; `Bus_Contend()`. |
| **3 — THE CHARGE** | F takes the mark. T keeps grinding through F's whole spinout — **both glasses always have something to do.** |
| **4 — THE DANCE** | `FT_Dance()` — see below. |
| **5 — THE LEVEL** | `Boot_Level_1` / `_2` / `_3`. |
| **6 — THE HANDOFF, IN TANDEM** | `Tandem_Finish()`. |

### The F/T dance, act by act

`FT_Dance()`, `:8682`. **Every line is Mike's, carried verbatim.**

| act | what happens |
|---|---|
| **1 · FIRST CONTACT** | F calls `AUX CHANNEL OPEN 300 BAUD` into the dark. **Nothing answers** — 1100 ms of hiss labelled *"no answer"*. **760 ms of yearning.** F tries again. T stirs. `CARRIER?` |
| **2 · THE HANDSHAKE** | `SYN` → `SYN-ACK` → `ACK. LINK 300 BAUD CONFIRMED`. **The hum leans in.** 1000 ms to let it land. |
| **3 · IDENTIFY** | `AUX UNIT IDENTIFY` → T has to look it up → `MGK-AUX MK.II ROM FACTORY` → `FACTORY ROM ON FILE. PROCEED`. |
| **4 · THE LOAD** | Six segments. **`LOAD BIOS SEG n/6`.** |
| **5 · THE CHECK** | `CHECKSUM` → a held breath → `4F2A .... PASS` → `AUX SELF-START AUTHORIZED`. |
| **6 · THE BIRTH** | T takes its own glass. `MGK-AUX BIOS FACTORY` · `MEM TEST .... 4096 W OK` · `VIDEO .... OK` · the monitor is born. |
| **7 · REPORT** | `SYNC CLOCK` → `CLOCK SET 00:00:00` → `REPORT` → **the last hang** → `ALL SYSTEMS NOMINAL. LISTENING.` |

**THE LOAD IS NOT A SCRIPT — `FT_Seg_Plan()`, `:8669`.**

> **FIXED, every time:** six segments; **exactly one STALLS and resumes**;
> **exactly one FAILS and is retried**; the **last is always the SLOW deliberate
> one**; the rest are clean, with one QUICK relief among them.
>
> **VARIES, per seed:** *which* segment stalls, *which* one fails, and where the
> quick one falls.

The seed is drawn fresh at every page load and is shown in the chrome, **so the
pattern differs machine to machine and reset to reset, while staying
deterministic within one run.**

**AND EVERY PATH RECOVERS.** There is no branch in which the two machines fail to
agree — which is the finding in [FAILURE-MODES](FAILURE-MODES.md#cannot-fail).

---

## 6 · THE EIGHT F/T LAWS
<a id="ft-laws"></a>

**They govern what the machine may be made to say. Three of them are vocabulary
rulings.**

| law | ruling |
|---|---|
| **FT1** | **F and T are separate computer systems.** Different specs, different purposes, limited interoperability *"for obvious reasons"* — **verbatim; keep the wink.** |
| **FT2** | **The interrupt model.** T finishes its own boot while listening for F. **F's transmissions interrupt T. F has priority at all times; same in reverse.** |
| **FT3** | **No challengeable detail — fleet-wide.** Use **STATE-WORDS**. **Exempt: ephemeral theatre.** |
| **FT4** | **Egg logged, build nothing:** smash-DEL-to-enter-BIOS. MAYBE tier. |
| **FT5** | **The stagger law.** One leads, the other follows by a felt beat. |
| **FT6** | **Word rulings.** `MK.II` / `300 BAUD` / `4096 W` **stand** as period furniture. `98K OK` and `SEG n/12` are state-worded. — [K-18](CONFLICTS.md#k-18) |
| **FT7** | **The dot-line law.** **The dot IS the fully collapsed line** — one entity, not two events, **exactly once per warm start.** |
| **FT8** | **Glitch on major change.** Subtle tier only; deterministic punctuation. |

**STATE-WORDS: `FACTORY` · `CURRENT` · `ON FILE`.** Machine self-description
never asserts checkable specifics — versions, dates, counts — that could conflict
with canon later. `"98K OK"` became `"FACTORY OK"`; `"SEG n/12 OK"` became
`"SEG .... OK"`.

---

## 7 · THREE MORE LAWS FROM THE SAME NIGHT
<a id="night-laws"></a>

### THE HEARTBEAT LAW (Mike)

**ANY wait, for any reason, shows a heartbeat indicator — always. The machine
never sits dead-still while it is alive.** The blank-screen law's scripted pauses
are the **sole exception**, and **drama has to ask in writing**: `{still:true}`.

**ONE IDIOM: a pulsing cursor block, bottom-right.** Shopped from the DOS
register the boot already speaks.

**THE SPINNER WAS THE OTHER CANDIDATE AND WAS NOT TAKEN:** the spinner is already
spoken for as T's WORKING line, which means *"this machine is doing a job"* — a
different statement from *"this machine is alive and waiting."* **One mark, one
meaning.**

### THE STATIC-SOUND LAW (Mike)

**Static noise plays during visual static — ALWAYS AND ONLY.** No silent static;
no static-sound over clean glass.

**ENFORCED BY REFCOUNT, NOT BY A FLAG.** Any generator drawing static holds a
reference; the voice runs while at least one is held. **Two glasses showing
static share one voice instead of doubling it.**

**Three defects it found:** a single 0.28 s burst at the head of a 2000 ms static
(five sixths of every warm start was silent static); `T_Hiss` rolled its own
loop and was **entirely silent**; and `WhiteNoise` was doing double duty as a
game-impact sound, **which is what let static-sound play over clean glass.**

### THE THEATER LAW (2026-07-24, fleet-wide)

**Screen-clears drop text colour and gamma FIRST** — a slight fade persistence,
phosphor-decay style — **then clear. Everywhere clears happen.**

### THE CRT LIFECYCLE LAW (2026-07-24)

**Every screen-off is a CRT death** — collapse to a horizontal line, then a
point, then out. **Every screen-on is a suitable birth**, before static where
static exists. Fluidic is treated as a standard CRT for now. **A universal frame
around all screen transitions, including the three theatres.**

**FT7's dot-line law is the fine grain of this:** the dot IS the fully collapsed
line — **one entity, not two events.**

### THE CLICK-FEEDBACK LAW (2026-07-24)

**Every click flashes the lens/shutter LED colour** — the physical unit's own
tell. Subtle, period-true, in the composite/unit view.

---

## 8 · THE SOUND
<a id="sound"></a>

| element | what |
|---|---|
| **The hum** | 60 Hz bed + 120 Hz bite. Wobble 0.09 Hz, drift 0.13 Hz. `Hum_Blip` (a transmission rides it) · `Hum_Swell` (the machine leans in) · `Hum_Strain` (something is not going well). |
| **The dial-up handshake** | **~3 seconds of "90s modem"** — DTMF dial, answer tone, warble, static burst — narrated on the top glass as **`DIALING` · `CARRIER DETECTED` · `HANDSHAKE` · `LINK UP`.** **Nothing may download before it finishes** — *causality absolute.* **A period mismatch is recorded at [BELL-103 §4](BELL-103.md#mismatch).** |
| **The modem screech** | `FX_modem` — carrier warble + hiss, **while the line is hot.** A different function for a different event. |
| **The reveal** | *"mechanical thunk + fluidic settle — organic, not synth-bright."* |
| **The slosh** | Splash 0.022 · body 0.095 · tail 0.075. |
| **The glitch's audio** | The **"zowt"** — a mains-hum transient at 60 Hz sawtooth plus a noise tick. **Chosen over silence as the more period-true tell, and FLAGGED.** |
| **The voice** | A **period-flat WebAudio synth shim** — because the real voice was never audible in the shim. |

---

## 9 · THE GLITCH DOCTRINE
<a id="glitch"></a>

**CANON, 2026-07-23, fleet-wide.** *A very low per-instant probability of
non-deterministic errors everywhere* — stutters, pops, screen tears, audio
hiccups, and **boots that error and SELF-CORRECT** (locks transmission, retries
settings, resumes). **Lightly applied. One tunable.**

> *A 60-year-old repaired machine behaves like one.*

**Two layers, and they are not the same thing:**

| | the ambient layer | FT8 punctuation |
|---|---|---|
| **fires** | on probability — `GLITCH_RATE = 0.0006`, **scaled by health**: `× (1 + (100 − H)/25)` | **deterministically**, at a major screen change |
| **gated by** | the rate, and `bootRunning` | neither — *"a boot's act transitions need it most"* |
| **kinds** | invert · band slip · the zowt | invert snap **or** band slip |
| **cost** | **real wear** — `H_GLITCH_COST` | none |

**A neglected machine stutters more, and the stutter costs it condition.** That
is a real loop, not a decoration.

---

## 10 · THE SYSTEM MONITOR
<a id="monitor"></a>

**The top glass's resting face: three outlined windows.** Their names are in the
firmware's `windows[]` structs, and **the original never renders them — the boxes
are mute.**

| window | geometry |
|---|---|
| **CODE** | `0,0 37×42` |
| **GRAPH** | `39,0 89×42` |
| **STATUS** | `0,44 128×20` |

**THE CODE WINDOW RUNS A DOS PROMPT** — `Mon_DOS`, *"the code window runs process
commands — some tied to REAL machine work (condition, sessions, link state), some
flavour; OS voice, zero personality."*

| command | output |
|---|---|
| `STAT` | `PROC n` · `COND n%` |
| `MEM` | `FACTORY OK` — **state-worded; was a checkable size** |
| `SYNC` | `LINK UP` / `NO LINK` |
| `AGE` | `S n` — sessions |
| `CHK` | `1 WARN` if condition < 40, else `0 ERR` |

**THE GRAPH WINDOW CARRIES SIGNAL, AND IT IS REAL** — it rides `monConn`, the
download connection. **Which is what the manual says signal does for the video
link, on a different link entirely** — [FAILURE-MODES §2.2](FAILURE-MODES.md).

**THE GRAPH WINDOW HAS READ `TEST` SINCE THE FACTORY.** Completing the printed
procedure completes the test. **Egg 1, Papa-placed — and the one exemption from
the no-dead-wood law.** It is visible in `reference/photos/top_monitor.png`.

**MONITOR LAYOUT, ruled 2026-07-22:** the status line was printed **on** the box
border and obscured. Re-laid out; **the two lines in the bottom box centre
vertically.**
