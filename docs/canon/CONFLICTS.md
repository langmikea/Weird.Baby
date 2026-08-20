# THE CONFLICTS — every account, side by side, none resolved

**Nothing on this page is decided. Every row is Mike's to rule.**

Each conflict carries: **every account** with its source · **what depends on
each** · **what a ruling costs, either way**. The cost column is the point of
the page — it is what makes a ruling cheap in the morning, because the work a
ruling creates is already counted.

Conflicts are numbered `K-nn` in this catalogue. Where a conflict already
carried an id in an upstream document (`C-n` in the robots vocabulary, `A-n` in
the holes report, `#n` in the spec inventory's ledger) that id is printed beside
it so the two can be matched.

**Ranking is deliberately absent.** No account here is marked likely, preferred,
later, better sourced or more canonical. Where a document itself claims priority
(a dated supersession, a recorded ruling) that claim is quoted as a fact about
the document — it is not this page agreeing with it.

**Ordering is by blast radius, not by importance:** the conflicts that block
sentences already written or already published come first.

---

## THE SHORT LIST — what is blocked today

| id | conflict | blocking |
|---|---|---|
| [K-01](#k-01) | What the machine runs on — four stories | Manual ¶2-11, SP 3-8, 7-19 (7-19 is **written**), Appendix G, Table 2-1 |
| [K-02](#k-02) | Polarity — five or six, two scales, three double-named slots | Manual Table B-1's row count; the firmware enum; the live menu |
| [K-03](#k-03) | The Portal — three objects wear the word | Manual Appendix F glossary; the museum's own Portal album |
| [K-04](#k-04) | Where the answer engine lives | Manual ¶7-3 and ¶7-5 |
| [K-05](#k-05) | Which units are which — three registries | Manual Appendix A and Appendix C; **the published Record 003** |
| [K-06](#k-06) | The Everyday vs the Everyman | **Published** in Record 003; the bible registry says the other |
| [K-07](#k-07) | Inclination exists in specs and in no firmware | Manual SP 7-12, Table B-3 |

---

## K-01 · WHAT THE MACHINE RUNS ON
<a id="k-01"></a>

*Upstream: robots vocabulary `C-1` · holes report `A-13` · spec ledger `#8`.*

**FOUR ACCOUNTS.**

| # | account | source |
|---|---|---|
| 1 | **PHVDC.** Pulsed high-voltage DC carrying supply and data on one pair. **300 V DC nominal · data 3 kHz / 1 Mbps.** | `MGK-VIIIp Instruction manual.docx` (2024), summarised at `robots:docs/SPEC_INVENTORY-viiip-ux-20260714.md` §D.4 |
| 2 | **TAC — tricycle alternating current.** *"240 volt, 60-20-30 tricycle alternating current"*, with a charging adapter described as *"240TAC to USB-B micro."* | `robots:robots/mgk-viiip/sources/2022-proto-docs/MGKVIIIp User Manual new.docx` (2022-12-01), summarised at `SPEC_INVENTORY` §E.1 |
| 3 | **An adapter of the PHVDC type** — *"The adapter carries the supply and the data channel on one pair. It is matched to the instrument and no substitution is to be attempted."* | `robots:tools/manual_structure_build.py:105-113` (`BODY_7_19`) — **this is written prose, not a position** |
| 4 | **USB.** The real object charges over USB. | The object; and the Record's own restoration line (*"upgrades the PHVDC power adapters to USB"*, `SPEC_INVENTORY` §D.5, the 2024 blog) |

**AND THE MANUAL'S OWN APPENDIX G CARRIES PHVDC AND TAC AS TWO ROWS OF THE SAME
ABBREVIATIONS TABLE.** Whichever account wins, the table currently declares two
of them.

**Note that accounts 3 and 4 are not necessarily rivals.** Account 3 is what the
1965 document says; account 4 is what the 2024 restoration did to the object.
The blog states both in one sentence. Nobody has said whether that reconciles
them or whether it is a third position. Recorded, not decided.

**WHAT DEPENDS ON EACH**

- Manual **¶7-19** is written to account 3 and is one of only three written
  paragraphs in the document. It is also **published** — Record 003 delivers
  `scan-07-a.webp` / `scan-07-b.webp`, *"Power supply and distribution"*. See
  [PUBLISHED](09-PUBLISHED.md#record-003).
- Manual **SP 3-8** ("adapter, PHVDC type") and **SP 3-9** ("adapter of the
  original pattern") both name the class.
- Manual **¶2-11** and **¶3-7** are positions, unwritten, and both need one
  answer. ¶7-19 points at ¶3-7 by name (*"the requirements of the premises are
  given in paragraph 3-7"*).
- **Table 2-1** (the specification) needs a supply figure. It has none —
  see [HOLES](HOLES.md#h-02).
- The **SAFETY SUMMARY** caution is about the power port and survives any
  ruling: it is about the port, not the current.

**WHAT A RULING COSTS**

| if Mike rules… | what changes |
|---|---|
| **PHVDC** | Nothing written changes. Appendix G's TAC row must be struck, or TAC must be given a reason to be in the table (a superseded standard, a different market). The 2022 proto-manual becomes a dated source that says something else, which the corpus already tolerates. |
| **TAC** | ¶7-19 is rewritten — the one long written paragraph in the document, **already published as a scan**. Under the published-facts rule that is not a repair, it is a new page. Appendix G keeps TAC and loses PHVDC. SP 3-8's name changes. |
| **Both, deliberately** (TAC 1962-ish, PHVDC 1965-ish) | Nothing is struck. Appendix G's two rows become the evidence rather than the defect. Costs one sentence somewhere placing the changeover, and that sentence does not exist. |
| **USB, in-story** | Contradicts a 1965 document on its own page. Would have to be a restoration note, not a manual statement — the manual cannot know about it. |

---

## K-02 · POLARITY
<a id="k-02"></a>

*Upstream: robots vocabulary `C-2` · holes report `A-12` · spec ledger `#7`.*

**This is three conflicts wearing one name.** They are separable and are
separated here.

### K-02a · How many values — five or six

| where | count | source |
|---|---|---|
| Firmware `enum polaritySettings` | **5** (`Negative, Pessimistic, Neutral, Favorable, Optimistic`, then `polaritySetting_Max`) | `robots:robots/mgk-viiip/firmware/MGK_VIIIp_01__20240721_WORKS/BIAS.ino:1-6` |
| The live menu (`Polarity Setting` table) | **6** — the five above plus `Affirmative` | `robots:tools/viiip_twin.html:2021` (`MENU_TABLE_SRC`, parsed verbatim from `2_data_MENU.ino`) |
| 2024 instruction manual, Appendix 1 | **6** — `Negative · Pessimistic · Exactitude · Favorable · Optimistic · Affirmative`, passcodes `0000`…`1111` | `SPEC_INVENTORY` §D.4 |
| 8Ball Specification, STATUS sheet | **6** — as the menu, with `Neutral` at slot 2 | `SPEC_INVENTORY` §D.8 |

**The sixth setting exists as a bug and is PARKED.** Selecting `Affirmative`
writes 5 into a 0–4 enum. Recorded harmless at `polarityBiasNOW = 0` — verified
across 200 draws, zero `-1` returns — at `robots:STATE.md` open issue 10. It is
also the mechanism by which the menu's sixth row is reachable at all.

### K-02b · The slot-2 name — Neutral or Exactitude

**RULED 2026-07-14 (Mike, `SPEC_INVENTORY` §RULINGS R4): Neutral is canon;
Exactitude is preserved as the in-fiction manual's earlier-compile name.**
Recorded here because the *naming* is settled and the *cardinality* (K-02a) was
explicitly left open in the same ruling.

### K-02c · TWO FIVE-VALUE SCALES SHARING INDICES WITHOUT SHARING NAMES

**This is the part that is written down nowhere else, and it is measurable in
the firmware.**

| index | what the keeper **SETS** (`polaritySettings`) | what an answer is **TAGGED** |
|---:|---|---|
| 0 | Negative | Negative |
| 1 | Pessimistic | Pessimistic |
| 2 | **Neutral** | **AskAgain** |
| 3 | **Favorable** | **Optimistic** |
| 4 | **Optimistic** | **Affirmative** |

- Setting scale: `BIAS.ino:1-6`.
- Tag scale: `robots:docs/POLARITY_MAP-release1-20260722.md:38-39` and
  `robots:docs/FINDING-polarity-bias-default-20260715.md:34`.
- The engine compares them **numerically**:
  `polarityDifference = abs(tag − polaritySettingNOW)`;
  `weight = constrain(100 − polarityBiasNOW × polarityDifference, 0, 100)`
  — `BIAS.ino:29-55`.

**So three of five slots carry two different words for one number:** setting
*Neutral* is matched against tag *AskAgain*, setting *Favorable* against tag
*Optimistic*, setting *Optimistic* against tag *Affirmative*.

The tag scale describes the **answer families of the classic twenty** (slots
0–3 of the answer table are the four *ask again* answers; 4/6/7 are the flat
noes; 5/8/9 are the soft noes; 10/13/14/15 are the soft yeses; 11/12/16–19 are
the flat yeses). The setting scale describes a **lean**. Nobody has said whether
those are the same axis.

**WHAT DEPENDS ON EACH**

- **Manual Table B-1** must print a row count and a set of names. It can print
  one scale.
- **The published Record does not touch polarity.** Record 003 delivers
  `scan-31-a.webp`, *"Bias settings, the four communications settings"* — that
  is Appendix **B-1**, the communications parity bias, which is
  [the other kind of bias](03-ANSWERS.md#the-two-kinds-of-bias) and is not
  affected by any of this.
- The **factory default** is `polaritySettingNOW = Neutral`, `polarityBiasNOW`
  ruled 100 → 0 (`STATE.md` open issue 10). At bias 100 with setting Neutral
  only the four AskAgain answers were reachable — 4 of 20 on every engine.

**WHAT A RULING COSTS**

| if Mike rules… | what changes |
|---|---|
| **Five values** | The menu loses its sixth row. `Affirmative` leaves the `Polarity Setting` table (one row in `2_data_MENU.ino`, one row in the twin's parsed copy). The parked out-of-enum bug closes by deletion. Table B-1 prints five rows. |
| **Six values** | The firmware enum gains a value and every `abs(tag − setting)` widens by one — the weight formula's behaviour changes at the edges, which is a bench question, not a paper one. Table B-1 prints six. |
| **One scale, renamed** | Whichever names lose, the losing document is a dated source. Cheapest on paper, and it is the only ruling that makes Table B-1 printable without a footnote. |
| **Two scales, deliberately** | Table B-1 has to print both columns and say which is which — which is a paragraph the manual does not have a position for. It also makes the numeric comparison a *feature* (a lean matched against a family) rather than a coincidence. |

---

## K-03 · THE PORTAL — THREE OBJECTS WEAR THE WORD
<a id="k-03"></a>

*Upstream: robots vocabulary `C-5`.*

**All three are canon. Nothing says whether this is one word with three uses or
three words that collided.**

| # | the object | source |
|---|---|---|
| 1 | **The aperture.** The round window the front glass sits behind. *"CENTERING MATTERS ON THE FRONT GLASS SPECIFICALLY BECAUSE OF THE ROUND PORTAL THE SCREEN SITS BEHIND. The glass is a rectangle but the aperture is a circle."* | `robots:STATE.md:3881`, THE PORTAL LAW, Mike, canon |
| 2 | **The 65's reveal.** A one-pixel diamond portal at dead centre blossoming to full width or beyond; shake runs it in reverse and the answer is swallowed. | `robots:STATE.md` MILESTONE 1 CANON (4), Mike 2026-07-24; `Portal_65()` in `robots:tools/viiip_twin.html` |
| 3 | **The doorway.** The `p` in MGK-VIIIp; the bezel, the feed, the museum's held album. *"the transitional frame between the webpage's real world and a camera feed / controller arrangement arriving from an unknown source, an unknown location, and for an unknown reason."* | `robots:STATE.md:4078` THE PORTAL REVELATION, Mike, CANON 2026-07-29; `museum:src/data/artists/portal.js` |

**WHAT DEPENDS ON EACH**

- **Manual Appendix F** is a 35-term glossary and a glossary entry has to choose
  one meaning, or print three.
- **The museum's Portal album is built and held**, and it uses sense 3
  throughout — `PORTAL_ALBUM`, `FEED CONTROL`, the drum, the latch.
- **Record 004 (SCHEDULED, posts 17:00 on 2026-08-20)** uses sense 3: *"Portal may be the 'answer' this
  whole mystery… an unattended remote access terminal."*
- Sense 1 governs every centring decision on the front glass and is a physical
  constraint, not a taste.

**WHAT A RULING COSTS**

| if Mike rules… | what changes |
|---|---|
| **One word, three uses** | Nothing is renamed. Appendix F gets one entry with three senses, which is what a real glossary does. |
| **Three words** | Two of them need new names. Sense 1 is the cheapest to rename (it appears in `STATE` and in composition rules, nowhere a visitor reads). Sense 2 is `Portal_65()` in the twin plus the block dictionary. Sense 3 **cannot** be renamed: it is the `p` in the model number, it is published, and it is the name of a museum album. |
| **Nothing** | Appendix F cannot be written. |

---

## K-04 · WHERE THE ANSWER ENGINE LIVES
<a id="k-04"></a>

*Upstream: robots vocabulary `C-4` · holes report `A-7` · spec ledger `#9`.*

| # | account | source |
|---|---|---|
| 1 | **Self-contained.** A Fluidic Nano-Matrix inside the instrument. | 2024 instruction manual, `SPEC_INVENTORY` §D.4 |
| 2 | **Cloud-linked co-processor.** *"Prediction Engine vs cloud-linked Answer Engine co-processor"*, three working units. | The Record blog, 15 March 2024 — `SPEC_INVENTORY` §D.5 |

**AND THE CORPUS PLAYS WITH THIS DELIBERATELY.** The `TXT_MSG` egg has the
assistant reveal it is listening and reporting back to the cloud —
`museum:reveal/ledger.json` row `egg.cloud-alert`, state HELD, build PARTIAL,
delivery *"triggers on the twentieth question"*. `MANUAL_STRUCTURE_FIT` #65
records that the contradiction **may be load-bearing rather than accidental, and
nobody has said which.**

**A THIRD FRAME SITS OVER BOTH AND DOES NOT SETTLE THEM.** The story arc's
persistence conceit (`robots:docs/canonical/THE_STORY_ARC.md`, ruled B) says
real-world persistence is genuine and the *fiction's* server is completely
virtual — the machine performs the network. That tells you the wire is theatre;
it does not tell you which of the two the 1965 document claims.

**WHAT DEPENDS ON EACH** — manual **¶7-3** and **¶7-5**. They cannot both be
written until this closes.

**WHAT A RULING COSTS**

| if Mike rules… | what changes |
|---|---|
| **Self-contained** | ¶7-3/7-5 write to the FNM. The blog line becomes a 2024 misreading by the restorers, which is in register for the blog. The cloud egg becomes *the machine lying*, which is a different and larger claim. |
| **Cloud-linked** | ¶7-3/7-5 write to the co-processor. The cloud egg becomes confirmation rather than surprise, and spends itself. |
| **Deliberately unresolved** | Both paragraphs must be written to *not* say — passive, procedural, no signature, which is exactly the layer-3 writing discipline the arc already specifies. This is the only ruling that costs nothing anywhere else, and it is a ruling. |

---

## K-05 · WHICH UNITS ARE WHICH
<a id="k-05"></a>

*Upstream: robots vocabulary `C-15` · holes report `A-10` · spec ledger `#5`.*

**THREE POSITIONS FOR THE SAME PEOPLE.**

| source | Everyman/Everyday | Informer | CEO | Gambler |
|---|---|---|---|---|
| `robots:docs/canonical/STORY_BIBLE.html`, registry rewritten at the 2026-07-22 gate | **−02** | **−07** | **−09** | **−21** |
| `robots:docs/MENU_MAP_v3-four-doors-20260724.md` Table 5 — the live serial mapping | code `101` | code `102` | code `103` | code `106` |
| `SPEC_INVENTORY` R2, ruled 2026-07-14 | — | **−02 canonical** | — | — |

Plus the pre-rewrite record: the Storyline sheet has the Informer owning **−03**;
the Reference Document tags McKenna **SME-02**; the release plan had CEO at −03.

**THE 2026-07-22 GATE IS A RULING AND IT IS RECORDED AS ONE.** It rewrote the
registry (`robots:STATE.md`, 2026-07-22, ruling 2) and it explicitly supersedes
the earlier launch-three roster. **It does not reconcile the `101`–`132` serial
mapping**, which MENU_MAP flags itself: *"Answers rows 7–38 = legacy persona
names/order — the registry rewrite's serials/names await the naming/lock pass."*

**AND R2 (Informer = −02) IS EARLIER THAN THE GATE (Informer = −07).** The gate
moved him and gave −02 to the Everyman. Both are on the record; the gate is
later; nothing marks R2 superseded.

**WHAT DEPENDS ON EACH**

- **Manual Appendix C** (the engine/unit roster) and **Appendix A** (access
  codes) are the first documents that have to print it.
- **Record 003 is published** and names four personnel folders **by name and not
  by serial** — `THE CEO`, `THE INFORMER`, `THE EVERYDAY`, `THE GAMBLER`. That
  was a good instinct: the published Record commits to no serial and is
  therefore not falsified by any ruling here.
- `robots:robots/mgk-viiip/content/build/units/` holds built content under
  directories `02`, `07`, `09`, `21` — the gate's numbering, on disk.

**WHAT A RULING COSTS** — the naming/lock pass is already scheduled and is where
this lands. Whichever way it goes, the cost is the same shape: the `101`–`132`
read-access codes in `2_data_MENU.ino` either stay as an unrelated code space
(cheap; they are codes, not serials) or are renumbered to match (187 rows, and
the passcodes are **checked nowhere in firmware** — see
[HOLES](HOLES.md#h-11)).

---

## K-06 · THE EVERYDAY OR THE EVERYMAN
<a id="k-06"></a>

*Upstream: spec ledger `#6`; ruled R3 2026-07-14; and **contested again by what
was published**.*

| account | source |
|---|---|
| **The Everyday** — the 1965 roster row, and the OPA master artwork is titled `OPA 01 The Everyday` | Storyline sheet, `SPEC_INVENTORY` §D.7 |
| **The Everyman** — the blog, the release plan, the 8Ball Specification, the persona set, the bible registry row −02 | `SPEC_INVENTORY` §D.5/§D.8; `robots:docs/PERSONA_SET-everyman-20260722.md`; `STORY_BIBLE.html` |
| **The Homemaker** — a 1965 row that then vanished | Storyline sheet, `SPEC_INVENTORY` §D.7 |

**R3 RULED (2026-07-14): The Everyday is canon; "Everyman" is modern-layer
corruption, documented in the record as such.**

**AND THEN THE REGISTRY REWRITE OF 2026-07-22 PRINTED `−02 The Everyman`**, and
the persona set is titled THE EVERYMAN, and the built content lives at
`content/build/units/02/` under that name.

**AND THE MUSEUM PUBLISHED `THE EVERYDAY`** — Record 003, ADDENDUM 02, on
2026-08-19. See [PUBLISHED](09-PUBLISHED.md#record-003).

**So the published surface follows R3 and the working corpus follows the
rewrite.** Neither is wrong; nobody has said they are the same decision.

**WHAT A RULING COSTS**

| if Mike rules… | what changes |
|---|---|
| **The Everyday** | The published Record is already right. The bible registry row, the persona set title, and every `everyman` filename in `robots/mgk-viiip/content/drafts/` are the in-fiction corruption — which R3 already says they are, so they can stay as artefacts. Cheapest. |
| **The Everyman** | Record 003 is published and says EVERYDAY. Under the published-facts rule it cannot be changed — it can only be built on: a later Record would have to be the thing that discovers the two names are one unit, which is a scene, not an edit. |
| **Both, as the corruption** | This is R3 as written. It costs a sentence somewhere saying so on the glass, and no such sentence exists yet. |

---

## K-07 · INCLINATION
<a id="k-07"></a>

*Raised in the brief. Upstream: robots vocabulary §4; `SPEC_INVENTORY` §D.4.*

**IT EXISTS IN SPECIFICATIONS AND IN NO FIRMWARE.**

| account | source |
|---|---|
| **Inclination Bias, −2 … +2, passcodes redacted as `▓▓▓`.** A tilt-cheat. | 2024 instruction manual, Appendix 1 — `SPEC_INVENTORY` §D.4 |
| **Inclination is one of three settings the keeper sets**, named in the manual's own written prose: *"Polarity, Clarity and Inclination are set by the keeper, are enabled, set and adjusted by the procedure of paragraph B-3, and are given in Tables B-1, B-2 and B-3."* | `robots:tools/manual_structure_build.py:155-160` (`BODY_B_1`) — **written, and published as `scan-31-a.webp`** |
| **Nothing.** No `inclination` symbol exists in the 2024 firmware head; `BIAS.ino` holds `polaritySettings` and `claritySettings` and no third enum. The live menu's `Preferences` table has `Polarity` and `Clarity` and no `Inclination` row. | `robots:robots/mgk-viiip/firmware/MGK_VIIIp_01__20240721_WORKS/BIAS.ino`; `MENU_TABLE_SRC` |

**THIS ONE IS ALREADY PUBLISHED AND IS THE MOST EXPENSIVE ROW ON THE PAGE.**
Record 003 delivered the B-1 page as a scan on 2026-08-19. A visitor has read the
sentence naming Inclination. It cannot be unpublished.

**WHAT DEPENDS ON IT**

- **Manual SP 7-12 and Table B-3** — positions that exist because the name does.
- `MANUAL_STRUCTURE_FIT` #70 records that **the redaction is itself the
  content**: the source censors the passcodes and reproducing the censorship is
  a strong period move. That is a live design choice, not a defect
  ([HOLES](HOLES.md#h-16)).
- The manual's own doctrine of *displayability* (Appendix A-3) already covers a
  function named before it exists: *"a code may be accepted before its function
  exists and takes effect when the function arrives."*

**WHAT A RULING COSTS**

| if Mike rules… | what changes |
|---|---|
| **Inclination is real and not fitted** | Nothing published breaks. Table B-3 prints the −2…+2 scale and the redaction. Table C-2 (positions not fitted) is where it goes. The firmware owes nothing. This is the only ruling the published page already supports. |
| **Inclination is built** | Firmware work: a third enum, a third menu table, a third weight term, and a tilt input the corpus says is `GyroMotion (GMI)` / a 6-axis IMU that is already read. Table B-3 prints and the redaction has to be spent or kept. |
| **Inclination is struck** | The published sentence names it. It cannot be struck from a page a visitor has read. |

---

## K-08 · THE FORWARD DISPLAY'S SIZE
<a id="k-08"></a>

*Upstream: robots vocabulary `C-8` · holes report `A-1`.*

| account | source |
|---|---|
| **128 × 32** | `robots:robots/mgk-viiip/firmware/MGK_VIIIp_01__20240721_WORKS/MGK_VIIIp_01__20240721_WORKS.ino:30` — `const int FRONT_SCREEN_HEIGHT = 32;` and `:127`, constructed with `SMALL_SCREEN`; `robots:docs/AESTHETIC_CANON-20260723.md` §2.2 — *"13px pitch, on the 32-row driver"*; `robots:tools/viiip_twin.html:1833` |
| **128 × 64** | The 2024 manual, Table 2-1 |

Two sources agree with each other and with the hardware. **Recorded, not
resolved** — the manual is a document in the fiction and a document in the
fiction may be wrong. Nobody has said whether this one is.

**AND DOCTRINE 18 BEARS ON THIS AND ON [K-09](#k-09), IN A DIRECTION THAT IS
EASY TO MISS.** *"The in-story manual is the authority for the in-story spec, and
**the real firmware is not evidence about a 1965 machine at all.**"* The fit
report marks six rows of the manual's SPECIFICATIONS section `FITS` **with the
real Arduino firmware cited as their source**, and lets the firmware WIN this
class of contradiction. **Under Doctrine 18 that is backwards.** Nothing in the
robots repo was changed on Ops' word; it is museum register row **N-i**.

**So "the hardware agrees" may not be an argument here at all** — which is a
thing to know before ruling, and is not a ruling.

**COST:** if the manual is right, Table 2-1 already prints 64 and nothing on
paper moves; the twin and the firmware are then describing a different, real
object, which Doctrine 18 says they are. If the hardware is right, Table 2-1
prints 32 and the 2024 manual becomes a source with an error in it — a texture
the corpus already uses everywhere.

---

## K-09 · HOW MANY LAMPS
<a id="k-09"></a>

*Upstream: robots vocabulary `C-9` · holes report `A-2`.*

| account | source |
|---|---|
| **Two.** `const int NUM_PIXELS = 2;` | `…WORKS.ino:17` |
| **One multi-colour lamp.** | The 2024 manual, Table 2-1 |

The manual's own written prose at ¶4-9 and Table 4-2 narrates a boot sequence of
**red → green → orange**, which is a *colour* sequence and is silent on count.

**THIS IS THE NAMED INSTANCE IN DOCTRINE 18.** It is the row the museum's own
doctrine cites: *"one of them lets the firmware WIN a contradiction against the
in-story manual (`NUM_PIXELS = 2` over the manual's 'one lamp'). Under this
doctrine that is backwards."* Register row **N-i**.

**COST:** Table 2-1 prints a number. Nothing else in the corpus depends on it.
The NeoPixel doctrine (`indicator day-job / egg delivery system / ambiguous
sender`, `robots:docs/PORCH_CAPTURE-20260717.md`) works at either count.

---

## K-10 · WHICH GLASS WAKES FIRST
<a id="k-10"></a>

*Upstream: robots vocabulary `C-10` · holes report `A-3`.*

| account | source |
|---|---|
| **The front wakes first.** | `robots:docs/canonical/STORY_BIBLE.html`, CANON 2026-07-23 — *"wake order FLIPS — FRONT first ('PLEASE WAIT' class), then top into monitor mode"* |
| **Timing-dependent interleave.** The code activates TOP at `twin:5512` and FRONT at `5513` and calls `crtWarmStart()` twice **without await**. | `robots:docs/atlas/ATLAS-boot-20260726.md` A2, flagged MISMATCH M1, a real race |
| **The forward display wakes first in all three sequences.** | The 2024 manual |

The manual agrees with canon and disagrees with the machine. **Paragraph 5-1
must say one thing.**

**COST:** the canon ruling is dated and explicit, so the cheap path is to fix the
race and let ¶5-1 print what canon says. That is a twin change (two `await`s),
not a paper one.

---

## K-11 · HOW MANY DETECTORS, AND HOW MANY DIVERSIONS
<a id="k-11"></a>

*Upstream: robots vocabulary `C-11` · holes report `A-4`, `A-5`.*

**Detectors:** five rows in `MENU_MAP_v3` Table 9 (Bullshit, Stud, Trustworthy,
Attractiveness, **Spy [−07]**) against *"four are provided"* in the 2024 manual.
Reconcilable — Spy is persona-gated — **but not reconciled anywhere**, and the
manual does not say *"four, plus one on certain units."*

**Diversions:** **three counts.**

| count | source |
|---:|---|
| **seven** | `MENU_MAP_v3` Table 13 — Tilt Drive, Gobble Don't Fall, AvoidSteroids, Snow Globe, Tic-Tac-Toe, Mail Run, Sniper [−07]; plus a four-row Casino behind code `2121` |
| **six** | `robots:docs/drafts/OWNERS_MANUAL-draft1-20260723.md` §5.2 |
| **five** | The 2024 manual |

**Two drafts of the same manual disagree with each other and both disagree with
the machine.**

**AND THERE IS AN IN-FICTION LICENCE THAT DOES NOT COVER IT.**
`robots:docs/ACT1_BOM-20260717.md` (e) 9 makes the games list *deliberately*
unstable — *"the AI renamed the games"*, a live egg (`egg.renamed-games`,
REVEALED, LIVE, in the museum ledger). **That is a licence for the manual to
differ from the machine. It is not a licence for the manual to differ from
itself.**

**COST:** one number in Table 6-1 and one in the Section VI prose. Cheap on
paper; the reason it is here is that nobody has picked which of three.

---

## K-12 · HOW MANY ENGINES ARE FITTED
<a id="k-12"></a>

*Upstream: robots vocabulary `C-12` · holes report `A-9`.*

| account | source |
|---|---|
| **Three standard; one reserved.** | The 2024 manual, Table 2-1 |
| **Seven named engine rows** — MGK-NIAC, MGK-v2.0, MGK-65 visible; MGK-Einstein, MGK-Yogi, MGK-DYK, MGK-HR hidden — before the 32 unit positions begin. | `MENU_MAP_v3` Table 5; `MENU_TABLE_SRC` in the twin |
| **Three compiled.** `M8B_AnswerTable[3][20][5][2]` — the Answers Compiler merges three engines and no more. | `SPEC_INVENTORY` §D.8; `BIAS.ino:20` |

**"One reserved" is four short.** Appendix C-2 has to list the positions that
exist, and four of them are named engines nobody has decided the status of.

**COST:** Appendix C-2 is a table of positions. Ruling each of the four
(Einstein, Yogi, DYK, HR) as *fitted*, *not fitted* or *not a position* is four
words and nothing else moves. Nothing is blocked but the table.

---

## K-13 · HOW MANY VOICES
<a id="k-13"></a>

*Upstream: robots vocabulary `C-6` · holes report `A-8` · spec ledger `#11`.*

| account | source |
|---|---|
| **13** — `Aditi, Brian, Emma, Geraint, Joanna, Joey, Kendra, Lupe, Matthew, Penelope, Russell, Takumi, SAM c64`; the spec renames Brian/Joey/Matthew to Informer/Everyman/CEO and slot 13 becomes ROBOT | `robots:robots/mgk-viiip/sources/2022-proto-docs/AUDIO NOTES.txt`; 8Ball Spec `Voice_ID` enum, `SPEC_INVENTORY` §D.8/§E.3 |
| **11** — `Voice 00` … `Voice 10` | `MENU_TABLE_SRC`, the live menu; `MENU_MAP_v3` Table 21 |

`currentVoiceID` is hardcoded to 8. Open since 2026-07-14. **Table E-1 has two
possible lengths.**

**AND THE COST IS NOT ONLY A TABLE.** The DFPlayer's **255-files-per-folder**
limit is the real wall — `folder = M8B_ID × 5 + clarity + 10` — and the limit is
hit at answer 19 with voices ≥ 8 (`STATE.md`, 2026-07-14, MENU_MAP gate; voice ID
capped at ≤ 7 that pass). So the count is a storage decision as well as a
paper one.

---

## K-14 · WHETHER THE RECORD SURVIVES A POWER INTERRUPTION
<a id="k-14"></a>

*Upstream: robots vocabulary `C-14` · holes report `A-15`.*

| account | source |
|---|---|
| **It does not.** *"Correspondence is held in the instrument's own record and does not survive a supply interruption. This is a known condition of the present issue."* | The 2024 manual (retired v1 generator) |
| **It does — real engineering.** Flash persistence is *"real engineering"* per canon ruling B. | `robots:docs/ACT1_BOM-20260717.md` M5; `THE_STORY_ARC.md` persistence conceit |
| **`Save_To_Flash` is a stub.** `Serial.println("Save to flash not implemented");` — the whole body. | `robots:robots/mgk-viiip/firmware/…/FLASH.ino:11-22`; mirrored exactly in the twin at `viiip_twin.html:1938` |
| **The boot level does persist.** | `robots:docs/atlas/ATLAS-boot-20260726.md` P3 |

**The manual's NOTE is true of the unbuilt half and false of the built half.**
¶7-21 cannot be written until the flash work is scheduled or the sentence is
deliberately kept as a period defect.

**COST:** keeping the sentence is free and is period-true (*"a known condition of
the present issue"* is exactly how a 1965 manual admits a defect). Striking it
requires the flash work.

---

## K-15 · TWO ACRONYMS THAT DO NOT EXPAND
<a id="k-15"></a>

*Upstream: robots vocabulary `C-13` · holes report `C-1`, `C-3`. Strictly a hole
rather than a disagreement — it is here because Appendix G has to print
something either way. Also listed at [HOLES](HOLES.md#h-05).*

- **AMMMS** — named beside BIST as maintenance messaging in the 2024 manual, and
  **never expanded, never defined, never mentioned again in four years of
  documents.**
- **PHVDC** — used as an acronym everywhere. The corpus gives its *behaviour*
  and never its letters.

Appendix G prints `[ EXPANSION REQUIRED ]` beside both.

---

## K-16 · WHICH ASA
<a id="k-16"></a>

*Upstream: robots vocabulary `C-19` · spec ledger `#3`.*

| account | source |
|---|---|
| **Army Security Agency** | `MGK-VIIIp Reference Document.docx`; the Storyline sheet; `STORY_BIBLE.html` CANON |
| **Army Signal Agency** | The Record blog, 26 January 2024 |

The real-world ASA was **Security**. The blog is the in-fiction voice of the
restorers, which is a voice allowed to be wrong.

**COST:** one word, in one blog entry, in a document class the corpus already
treats as unreliable. It is here because the bible states one and the Record
states the other, and the Record is the thing being republished.

---

## K-17 · WHAT THE `p` MEANS
<a id="k-17"></a>

*Upstream: robots vocabulary `C-18`.*

**RULED: PORTAL, canon since 2026-07-29** — `robots:STATE.md:4080`, Mike:
*"It was never 'portable.'"*

The retired reading ("portable") survives in the 2026-07-14 50Kft capture, which
keeps its *later / more powerful / adjustable personality* content and loses only
the word. **Recorded so a reader meeting the capture does not treat it as live.**

---

## K-18 · MK.II / 300 BAUD / 4096 W — FT6 AGAINST FT3
<a id="k-18"></a>

*Upstream: robots vocabulary `C-20`.*

**FT3** says the machine may never assert a checkable specific about itself —
use state-words. **FT6** ruled that `MK.II`, `300 BAUD` and `4096 W` stand as
period furniture. They are Mike's own verbatim dance lines, and they are
checkable specifics.

`robots:STATE.md` records the tension explicitly — *"his call whether to
state-word them"* — and it is still his.

Live in the twin at `viiip_twin.html:8712` (`MGK-AUX MK.II ROM FACTORY`),
`:8689` (`AUX CHANNEL OPEN 300 BAUD`), `:8776` (`MEM TEST .... 4096 W OK`).

**COST:** state-wording them is three strings. Keeping them costs nothing until
a later document has to agree with a number the machine printed.

---

## K-19 · THREE DOORS OR FOUR
<a id="k-19"></a>

*Upstream: robots vocabulary `C-7` · holes report `A-11`.*

`robots:docs/canonical/STORY_BIBLE.html` states the app architecture is **three
doors** — ANSWERS / LINES / SPECIALIZED (ruling B, 2026-07-22) — in Chapter II,
and **four doors** — ANSWERS / PROGRAMS / MESSAGES / SETTINGS (CANON 2026-07-23)
— in the addendum near the end.

**The later ruling wins by date and the earlier passage is not marked
superseded**, so a stranger reading the bible top to bottom meets the dead
architecture first.

**This is a documentation defect with a ruling behind it, not an open question** —
recorded here because the file is canonical and a reader will hit it.

**COST:** one strike-through in one HTML file. The live menu's root table is the
LEGACY tree (`Root → MGK-VIIIp / Messages / Programs / Preferences`), which is a
*fourth* shape and is what the firmware actually holds today.

---

## K-20 · THE YEAR ON THE DIGIT RING
<a id="k-20"></a>

*Upstream: robots vocabulary `C-16` · holes report `A-6`.*

`robots:STATE.md` ~5602 records that *"the manual's §14 was made wrong by this
ruling ('The year is not requested') and was corrected in the same pass."*
**The correction never landed in the tree.**

The underlying ruling (`STATE.md` ~5588) is that the year **is** entered and **no
surface consumes it**.

**This is a class as well as an instance** — see [HOLES](HOLES.md#h-19), *a
correction the tree does not carry*.

---

## K-21 · NAMED ONCE, NOTHING BEHIND
<a id="k-21"></a>

*Upstream: robots vocabulary `C-17` · holes report `C-2`, `C-4`, `C-5`, `C-6`.
Also listed at [HOLES](HOLES.md#h-06).*

Each has a table row waiting and nothing to put in it. **They are not conflicts;
they are single-attestation terms.** Listed here because Appendix F and Table 2-2
have to do something about each one.

| term | attestation |
|---|---|
| **MindsEye™** | An input option in the MGK-Options matrix. **Appears once in the entire corpus.** |
| **MGK-66** | *"†† standard options for all MGK-66 models."* A designation in no lineage, no menu, no registry. |
| **SCAT — System Configuration and Test** | A heading in the 2022 proto-manual with nothing under it, four years running. Position 10-11 exists because the name does. |
| **NY8 / DYN / MGK-2.5 / MGK-65x** | Engine designations in the option matrix and nowhere else. **65x is explicitly REJECTED — do not re-propose** (`STORY_BIBLE.html`). The other three have no status at all. |
| **MIALLO™** | Voice generation. Trademarked in the source, never explained. |
| **Noise BS (unsolicited) = 10** | Named once in the 2024 manual's Appendix 1. Never explained. |
| **Response curve** | Named on the glass during first-run setup (`RESPONSE CURVE LOADED`), given a paragraph position (7-9) and a figure. **No definition exists anywhere in the corpus.** |
| **RADIONET** | A whole section in the 2022 proto-manual — an internal Silvertone antenna, *"opportunistic local reception of AOL Standard Broadcast and FM"*, and an optional AM-FM antenna kit, **Catalog No. 6710**. The live machine has a Radio *program* gated to −07, which is not a receiver. Table 12-2 has a real catalogue number for a part of a machine that may no longer exist. |

---

## K-22 · KEEPER AND OPERATOR — **NOT A CONFLICT**
<a id="k-22"></a>

**RULED DELIBERATE, 2026-08-19.** Recorded here so a later sweep does not "fix"
it.

`keeper` appears **exactly twice in the whole robots tree**, both in the manual's
own written prose: the caution at 7-19 (*"The keeper is answerable for the state
of the cell"*) and B-1 (*"set by the keeper"*). `operator` appears six times in
the structure's furniture — **OPERATOR ACTION** (Table 5-1 header), **THE
OPERATOR RECORD** (6-27), *"Record, operator"* (Appendix F), **OPERATOR'S NOTES**
(back matter), and, in the same paragraph as the caution, *"The cell is not an
operator-replaceable item."*

> *A machine's document calling you an operator everywhere except in the line
> about who is to blame is better than either word used consistently.*

**For a writer adding to Section VI: `operator` by default, `keeper` only where
responsibility is being placed.**

---

## K-23 · ACQUISITION DATE, AND HOW MANY CRATES
<a id="k-23"></a>

*Upstream: spec ledger `#4` and `#1`.*

| account | source |
|---|---|
| **2023** — *"In 2023, Weird.Baby acquired (32) MGK-VIIIp prototypes."* | Reference Document, `SPEC_INVENTORY` §D.3 |
| **1 January 2024** — the three W.O. crates arrive | The Record blog, `SPEC_INVENTORY` §D.5 |
| **(3) prototypes** | Storyline sheet, final row |
| **17** — *"the crates containing the 17 MGK-VIIIps"* | Written stories draft 8, `SPEC_INVENTORY` §D.6 |
| **31.4** | **RULED R1, 2026-07-14** — fleet = 31.4; `.4` is the prototype; the missing-unit mystery orbits it |

**R1 SETTLED THE FLEET AND NOT THE CRATES.** 31.4 is how many exist. How many
arrived at Weird.Baby, and when, still has four answers, and the 2024 blog is the
one the museum's own Record descends from.

---

## K-24 · THE ORIGIN STORY
<a id="k-24"></a>

*Upstream: spec ledger `#2`.*

Four tellings, and the bible states the corpus's own rule about them —
**contradictions are PLACED, never inherited.**

| account | source |
|---|---|
| **ASA → CSAW → ScrapCo → ABEAL/BDS.** The canon spine. | Storyline sheet; Reference Document; `STORY_BIBLE.html` |
| **ASA built the VIIIp itself, uncompleted; ABEAL finished "the looks."** | The Record blog, 26 January 2024 |
| **Military ploy for the Elite; a postal truck sinks into the Hudson; divers recover the crates.** | BackStory draft |
| **DoD "project Book Cart" / IKS / CNN-t.** | Backstories draft |

**AND ONE CONTRADICTION IS RULED TO SHIP.** DR-2, frozen as placed, 2026-07-22:
the record says the company works out what it has in 1965, and the record also
says Mr. ABEAL the man knew in 1964, before the gavel fell. **Both stand
forever.** Mike's verdict for the record: *"ABEAL knew it. Dirty bastard.
Liar."*

---

## 12a · RECORDED, AND NOT CONFLICTS
<a id="not-conflicts"></a>

- **[K-22](#k-22) keeper vs operator** — ruled deliberate.
- **[K-17](#k-17) the `p`** — ruled PORTAL.
- **[K-02b](#k-02) the slot-2 name** — ruled Neutral.
- **[K-24](#k-24) DR-2** — ruled to ship as a contradiction.
- **Paragraph 3-14 is reserved and empty.** Mike wants the number; it is deferred
  until Section III is written (*"I need to see section 3 to have any idea how to
  weave it in"*). It is the first subordinate position under 3-13 and takes no
  insertion and no renumbering. **A subordinate paragraph added under 3-13 must
  start at 3-15.** It is π, and `reserved-date-3-14-65` is cut, indexed and
  deliberately not placed on the marked copy
  (`robots:tools/manual_structure_build.py:1596`).
