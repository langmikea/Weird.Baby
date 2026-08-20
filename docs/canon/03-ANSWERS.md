# 03 · THE ANSWER MACHINERY — the determination, the two biases, the twenty

**Register key:** `STORY` · `OPS`. **Publication key:** `PUB` · `—`.

---

## 1 · THE DETERMINATION
<a id="determination"></a>

| term | register | pub | meaning as attested |
|---|---|---|---|
| **Determination** | STORY | **PUB** | **The manual's noun for what the machine produces.** It never says *answer* in its own prose. *"Charging has no effect upon the determination."* — a coined word; see [H-13](HOLES.md#h-13). |
| **Ask cycle** | OPS | — | The seven states from redirect to exit. **The position is ¶6-5 + Figure 6-2; the phrase is Ops'.** |
| **Prediction Engine** | STORY | — | Receives the request and sub-parcels it. [K-04](CONFLICTS.md#k-04) |
| **Answer Engine** | STORY | — | Holds the response set and the bias. [K-04](CONFLICTS.md#k-04) |
| **Response curve** | STORY | — | Named on the glass during first-run setup (`RESPONSE CURVE LOADED`), given ¶7-9 and a figure. **No definition exists anywhere.** [H-08](HOLES.md#h-08) |
| **Fluidic suspension** | STORY | — | Where output is **redirected** for a determination. Drawn as the bubble field on the top glass. `" FLUIDIC SUSPENSION "` in `M8BALL.ino`. |
| **Prediction accuracy** | STORY | — | **98.2 % ± 0.03**, results possible up to 100 %. |

**Named in the theory of operation and never explained:** *Prediction Padding
Algorithms*, *Confirmation Bias Exploits*, and *"hyper long range decision making
with subjective outcome determination and temporal decountability."*

---

## 2 · THE ASK, AS BUILT
<a id="the-ask"></a>

| term | register | meaning as attested |
|---|---|---|
| **Minimum reading interval** | STORY | **2500 ms.** The answer then holds **with no timeout** — THE REVEAL-HOLD LAW. |
| **The reveal-hold law** | STORY, canon 2026-07-22 | *"An answer stays until the user disturbs it — no machine timeout — and a shake re-asks only after a minimum read time. No instant re-rolls; the do-over gate is 'long enough to read it.'"* |
| **No do-overs** | STORY | Shake during the answer's dwell and **the rail card is redrawn** — the handoff is shown again, **not a new answer.** On the glass as `<no do-overs>`. `NO_Do_Overs()`. |
| **Recalibration** | STORY | **Three early shakes fire the ritual:** hold still ~2 s under 1.05 g. |
| **The reveal / theatre** | OPS | The per-engine ceremony: **the rising die (NIAC) · the triangle spin-out (v2.0) · the diamond portal (65).** `MANUAL_STRUCTURE_FIT` §5.4: *"A period manual would not describe it at all."* |
| **Post-answer shake** | STORY, ruled 2026-07-24 | Flashes `ASK A QUESTION...` then proceeds **INSTANTLY — no dwell.** |

**THE INPUT GRAMMAR LAW** (Mike, 2026-07-24, global canon) is at
[LAWS](10-LAWS.md#the-input-grammar-law) and governs every ask surface.

---

## 3 · THE TWO KINDS OF BIAS
<a id="the-two-kinds-of-bias"></a>

**The manual draws this line itself, in the one appendix it has written, and it
is published as `scan-31-a.webp`:**

> *"This appendix carries the Bias Settings of the instrument. **They are of two
> kinds and they are not interchangeable.**"*

---

## 4 · THE FIRST KIND — it shapes the determination
<a id="first-kind"></a>

> *"The first kind shapes the determination. Polarity, Clarity and Inclination
> are set by the keeper, are enabled, set and adjusted by the procedure of
> paragraph B-3, and are given in Tables B-1, B-2 and B-3. **They alter what the
> instrument says. They do not decide whether it says anything.**"* — `BODY_B_1`,
> **PUB**

| term | register | meaning as attested | contested |
|---|---|---|---|
| **Bias Setting (BS)** | STORY | The collective name for the three below. | |
| **Polarity** | STORY | Which way the determination leans. | **[K-02](CONFLICTS.md#k-02)** |
| **Clarity** | STORY | Five registers. Factory default **Impartial**. | |
| **Inclination** | STORY, **PUB** | Bias **−2 … +2**. **The source redacts the passcodes as `▓▓▓`.** | **[K-07](CONFLICTS.md#k-07)** |
| **BS-Factor** | STORY | **0–100**, the user-to-systemic ratio. | |
| **Blending matrix** | STORY | The A\*-BS matrix — user bias against systemic bias, giving a result. Appendix B-5, Table B-4. | |
| **Noise BS (unsolicited)** | STORY | **Value 10.** Named once, never explained. | [K-21](CONFLICTS.md#k-21) |
| **Enable, set, adjust** | STORY, **PUB** | The three-step procedure by which the keeper works the first kind. ¶B-3. | |

### 4.1 · Clarity — the one scale nobody disputes
<a id="clarity"></a>

**Five registers, in firmware order:**

| # | name | passcode (2024 manual) |
|---:|---|---|
| 0 | **Uncouth** | 69 |
| 1 | **Offensive** | 666 |
| 2 | **Discourteous** | 80085 |
| 3 | **Impartial** | 1 |
| 4 | **Mannerly** | 123 |

`enum claritySettings { Uncouth, Offensive, Discourteous, Impartial, Mannerly,
claritySetting_MAX };` — `BIAS.ino:8-13`. **Factory default `Impartial`.**

The menu's `Clarity Setting` table carries exactly these five and a `< Back`.
**Firmware, menu and spec agree. This is the only one of the three that does.**

### 4.2 · Polarity — see [K-02](CONFLICTS.md#k-02)
<a id="polarity"></a>

**Two five-value scales share indices without sharing names**, the menu offers
six values against a five-value enum, and slot 2 has two names on the record. The
full table, all four sources, and what a ruling costs are at
[K-02](CONFLICTS.md#k-02). **Nothing is decided.**

### 4.3 · The weight formula
<a id="weight"></a>

**Exact, from `BIAS.ino:29-84`, and carried verbatim into the twin:**

```
polarityDifference = abs( answer.polarity_tag  -  polaritySettingNOW )
weight             = constrain( 100 - polarityBiasNOW * polarityDifference, 0, 100 )
```

and the same shape for clarity, over `abs(i - claritySettingNOW)`.

The engine sums the weights, draws a random number in `[0, total)`, and walks the
table until the running sum passes it. **A weight of 0 makes an answer
unreachable.**

| variable | factory | note |
|---|---|---|
| `polaritySettingNOW` | `Neutral` (2) | |
| `claritySettingNOW` | `Impartial` (3) | |
| `polarityBiasNOW` | **0** | **RULED 2026-07-15**, was 100 |
| `clarityBiasNOW` | **100** | pins clarity to the setting — **the ruled defaults-only behaviour, not a defect** |

**THE FACTORY-DEFAULT STALL, AND WHY IT MATTERS TO ANYBODY READING THIS.** At
`polarityBiasNOW = 100` with setting `Neutral`, every answer whose tag differs by
1 or more weighs 0 — **so only the four AskAgain answers (indices 0–3) were
reachable at power-on, on EVERY engine.** Four of twenty. Diagnosed with a
100-ask distribution proof at
`robots:docs/FINDING-polarity-bias-default-20260715.md`. **It was never a 65
bug.**

**A BENCH PREDICTION IS ATTACHED TO THE FIX AND HAS NOT BEEN TESTED:** on a fresh
boot, NIAC should only ever stall. *"If it varies, the model is wrong and this
reopens."*

**BIAS IS CHARACTERISATION.** Unit-custom answer sets may carry their own bias
adjustments — *a persona's default bias is part of who it is, not just a user
preference.* Resolution order `unit ?? engine ?? firmware default`. **Designed,
not built.** A persona's bias **activates when its personality downloads.**

---

## 5 · THE SECOND KIND — the communications parity bias
<a id="second-kind"></a>

**The manual is emphatic that it is a different animal, and every word of this is
published on `scan-31-a.webp`:**

> *"The second kind is the communications parity bias. **It is not set to a
> preference. It is set to agree with the far end, and until it agrees the
> instrument holds its peace.**"*
>
> *"Four settings. The unit will not speak until all four agree with the far
> end."*

| # | setting | values |
|---:|---|---|
| 1 | **PARITY** | ODD / EVEN |
| 2 | **DUPLEX** | HALF / FULL |
| 3 | **WORD** | 7 BIT / 8 BIT |
| 4 | **STOP** | 1 / 2 |

> *"**The values are not given in this manual.** They are established at the far
> end and are entered on **the installation record** at the time the link is
> made. An instrument moved to another far end is to be set again."*
>
> *"A disagreement in any one of the four is reported as a **parity bias setting
> mismatch**. The report names the condition and **does not name the setting at
> fault, there being no means at this end of knowing which of them is wrong.**"*

**THE CORRECT VALUES ARE RULED AND ARE NOT IN THIS MANUAL** — they reach a reader
only through the pen, on a marked copy. **EVEN / FULL / 7 BIT / 1**, a
period-correct 1962 Bell 103 link. See **[BELL-103](BELL-103.md)**.

**WHAT HAPPENS WHEN ONE IS WRONG** is Mike's A++ ask and is at
**[FAILURE-MODES](FAILURE-MODES.md)**. **Nothing in either repo produces the
state today.**

**THE INSTALLATION RECORD IS A NAMED OBJECT WITH NO DESCRIPTION** —
[H-03](HOLES.md#h-03).

---

## 6 · THE TWENTY
<a id="the-twenty"></a>

**The classic Magic 8-Ball set, with the polarity tag each answer carries.**
Source: `answer_core.csv`, carried into the twin at `viiip_twin.html:1859`
(`CSV_CORE`) and into the firmware's parameter table at `BIAS.ino:20-24`.
**`_` is the line-break control character.**

| # | text | tag | family |
|---:|---|---:|---|
| 0 | Ask again later. | 2 | AskAgain |
| 1 | Cannot predict now. | 2 | AskAgain |
| 2 | Concentrate and ask again. | 2 | AskAgain |
| 3 | Reply hazy. Try again. | 2 | AskAgain |
| 4 | Definitely No. | 0 | Negative |
| 5 | Don't count on it. | 1 | Pessimistic |
| 6 | My reply is no. | 0 | Negative |
| 7 | My sources say no. | 0 | Negative |
| 8 | Outlook not so good. | 1 | Pessimistic |
| 9 | Very doubtful. | 1 | Pessimistic |
| 10 | As I see it, yes. | 3 | Optimistic |
| 11 | It is certain. | 4 | Affirmative |
| 12 | It is decidedly so. | 4 | Affirmative |
| 13 | Most likely. | 3 | Optimistic |
| 14 | Outlook good. | 3 | Optimistic |
| 15 | Signs point to yes. | 3 | Optimistic |
| 16 | Yes. | 4 | Affirmative |
| 17 | Yes, definitely. | 4 | Affirmative |
| 18 | You may rely on it. | 4 | Affirmative |
| 19 | Without a doubt. | 4 | Affirmative |

**All three compiled engines carry the same tags** — the parameter table's three
rows are identical but for the table index.

**"Definately" → FIX**, ruled 2026-07-14: clean spelling.

**AND THE TAG NAMES ARE THE OTHER SCALE.** *AskAgain*, *Optimistic* and
*Affirmative* above are **tag** names and are not the names of the settings a
keeper picks — that is [K-02c](CONFLICTS.md#k-02).

---

## 7 · THE PER-ENGINE OVERLAYS
<a id="overlays"></a>

- **MGK-NIAC (engine 0)** — the pure twenty, unskinned.
- **MGK-v2.0 (engine 1)** — an **8-row overlay** on the core, from the D.8
  workbook's MGK-2.0 sheet, Impartial column. `CSV_ENGOV` in the twin.
- **MGK-65 (engine 2)** — a **full 20 × 5 clarity grid**. `CSV_CLOV` in the twin.
  This is the one that carries the Windows-95 register:
  *"VVindows has encountered an error."* · *"Negative, ghost rider. System says
  NOPE!"* · *"[Triumphant Windows Startup Sound]"* · *"Error 404: Question not
  found"*.
- **The persona tables** — 20 answers × 5 clarity columns × polarity tags, one
  sheet per persona. See [PEOPLE](08-PEOPLE.md).

**THE UNIQUENESS LAW:** *no persona answer slot may reprint core.* **Unique-20
complete is a per-persona ship gate**, and **fallback-to-generic is dead as a
shipping strategy.**

**THE ARCHITECTURAL LAW (MENU_MAP §1.5):** common core + per-unit overlay, linked
tables, **one source of truth per string.** SD audio and firmware initialisers
are **generated-only.**

---

## 8 · THE OTHER GENERATORS
<a id="generators"></a>

Content the 8Ball Specification holds and the machine may or may not have reached:

| sheet | what it is |
|---|---|
| **Fortune Cookie** | Fortunes × clarity — 344 cells, 44 rows, fully authored. **Deferred: Answers-shaped, and Mike ruled *not more of those.*** |
| **Generators** | 785 cells — **techno-jargon**, **euphemism** and **financial-proverb** mad-lib columns. |
| **JOBS** | 196 cells, three columns (adjective / noun / role) plus a clarity column → *"Amateur Ninja Accountant."* **The mechanic is GENERATIVE, not selective.** An X-rated sub-block exists. |
| **NIcknames** | 230 cells / 149 rows. Crude prank-name lists, Bart-Simpson register. **Needs a vulgar-mode ruling against the Clarity registers.** |
| **TXT_MSG** | Message system enums and seed messages, including the egg where the assistant *"accidentally reveals it is listening and reporting back to the cloud."* |
| **MGK-2.0 EZClick** | |
| **Voice_ID** | 13 entries — [K-13](CONFLICTS.md#k-13) |

---

## 9 · CONDITION — the health system
<a id="condition"></a>

**`condition` is the manual's noun for what the spec calls `H = 0–100`. Real
persisted state.**

| | |
|---|---|
| **Declines with** | power-ons · asks · uptime · glitches |
| **Constants** | `H_CARE_GAIN 15` · `H_ASK_COST 0.15` · `H_BOOT_COST 1.0` · `H_GLITCH_COST 0.2` · `H_RETRY_AT 85` · `H_ADVISE_AT 50` |
| **Floor** | **20. No death state. Answers are never gated.** |
| **Recovers by** | **the maintenance routine** — enter the maintenance row, hold still, three clicks. **Gated on real IMU stillness.** |
| **Condition readings** | EFFICIENCY · RETRIES · POWER CYCLES · UPTIME · the CPU graph · condition history · **CARE ADVISED** |
| **Service notice** | fires at **120 / 480 / 1440** minutes of uptime |
| **The manual's line** | *"Attention advised is not a fault reported."* — ¶7-19, **PUB** |

**`MANUAL_STRUCTURE_FIT` #80 calls the maintenance routine *"the single strongest
tie between paper and machine."*** **Care as gameplay; invitation, never
punishment.**

**And the page it points at does not exist** — [H-10](HOLES.md#h-10).

---

## 10 · WHAT THE MACHINE REPORTS ABOUT ITSELF
<a id="reported-condition"></a>

`SYSTEM OK` · `UPTIME` · `PROCESSES` · `EFFICIENCY` · `RETRIES` · `RECOVERED n` ·
`AUDIO NOT DETECTED` · `CONNECTION STARTED…CLOSED`.

**And every one of them must be true** — see
[THE NO-DEAD-WOOD LAW](10-LAWS.md#no-dead-wood). `TEST` is the one exemption.
