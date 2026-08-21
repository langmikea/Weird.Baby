# 07 · THE MANUAL — the document, and what is written in it

**Register key:** `STORY` · `OPS`. **Publication key:** `PUB` · `—`.

---

## 1 · WHAT IT IS
<a id="what-it-is"></a>

| | |
|---|---|
| **Title** | **Operating and Maintenance Instructions** — the document's own type, `OMI`. |
| **Part number** | **`ABEAL 8P-OMI-1`**, at the foot of every page (HP 465A practice). **PUB** |
| **Model** | `MODEL MGK-VIIIp`, on every running head. |
| **Issue** | `STRUCTURE ISSUE` · `REV. - / PRELIMINARY` |
| **Maker** | **ABEAL** — [see 01-WORLD](01-WORLD.md#abeal) |
| **Generator** | `robots:tools/manual_structure_build.py`, 2,151 lines. Deterministic — **byte-identical across two builds.** |
| **Extent** | **61 pages · 12 roman sections · 8 appendices · 108 paragraph positions (93 principal + 15 subordinate) · 30 reserved tables · 10 figures · 94 index entries.** Counted off `BODY` and `INDEX` in the generator on 2026-08-20. *The build log for the last manual commit says 107 / 31 / 93 — one out in three places, in the same direction. **The live tree beats the log**, so the measured numbers stand; the difference is either drift since that commit or a different counting convention, and nobody has chased it.* |
| **Museum's description** | **PUB:** *"Held. Incomplete, assembled out of copies caught at different stages."* |

**THE STRUCTURE WAS RESEARCHED, NOT CHOSEN.** Models cited: **HP 465A (March
1965) · Tektronix 561A · TM 11-5556 · MIL-M-38784.**

**AND IT IS TYPED, NOT TYPESET — that reframe is the whole of the period model.**
*"HP 465A, Tek 561A and the PDP-8 Handbook are all professionally TYPESET and
cannot supply a typed character."* The model came from the other production
class: **the in-house typed-and-offset report**, exemplar **MIT/IL R-477** (AGC
Block II, memo of 7 September 1965), read page by page.

| the physical page | |
|---|---|
| **Grid** | 12 cpi × 6 lpi — elite pitch, single spacing. 78 columns, 55 rows. |
| **Face** | Courier New at elite pitch |
| **Bold** | by **overstrike** |
| **Headings** | underscored **with the underline key** — still the rule at MIL-STD-38784B 4.7.11.5.1.1 |
| **Table horizontals** | typed with hyphens; **verticals ruled by hand** |
| **Figures** | hand-cut paste rectangles — 8 of 10 inside 0.15°, two off at −1.1° and +0.9° |
| **Finish** | a photocopy pass over everything |
| **Seed** | `19650301` — deterministic |

**THE PARAGRAPH NUMBERING IS BY POSITION, WITH GAPS.** *"The period numbers
paragraphs by position, leaving gaps. Renumbering a manual because a paragraph
was inserted is a modern habit; **the period reserved the numbers instead.**"*
**Odd numbers are principal paragraphs; the intervening even numbers are
subordinate paragraphs, indented.**

**THE MANUALS ARE SCANS (canon, Amendment 2):** *"shipped 1965, recovered in the
roundup, scanned into the servers during cataloging. Hence electronic manuals
bearing handwritten notes by technicians and/or original owners."* **THE MARGINS
ARE RECOVERED EVIDENCE.**

---

## 2 · THE STRUCTURE
<a id="structure"></a>

| | section |
|---|---|
| **I** | GENERAL DESCRIPTION |
| **II** | SPECIFICATIONS |
| **III** | INSTALLATION |
| **IV** | CONTROLS AND INDICATORS |
| **V** | STARTING PROCEDURE |
| **VI** | OPERATING INSTRUCTIONS |
| **VII** | THEORY OF OPERATION |
| **VIII** | MAINTENANCE |
| **IX** | TROUBLESHOOTING |
| **X** | BUILT-IN SELF TEST AND CODE UTILITIES |
| **XI** | SERVICE AND PARTS |
| **XII** | ACCESSORIES AND OPTIONAL EQUIPMENT |

| | appendix | state |
|---|---|---|
| **A** | ACCESS CODES | [H-17](HOLES.md#h-17) |
| **B** | **BIAS SETTINGS** | **B-1 is WRITTEN and PUBLISHED** |
| **C** | ANSWER ENGINE SCHEDULE | blocked — [K-12](CONFLICTS.md#k-12), [K-05](CONFLICTS.md#k-05) |
| **D** | MENU INDEX | 187 rows or ~60 — [H-25](HOLES.md#h-25) |
| **E** | VOICE AND AUDIBLE SCHEDULE | two possible lengths — [K-13](CONFLICTS.md#k-13) |
| **F** | GLOSSARY | **35 terms, 35 empty meanings** |
| **G** | ABBREVIATIONS | **21 rows, two that do not expand** |
| **H** | SERVICE OFFICES | empty |

---

## 3 · THE THREE WRITTEN PARAGRAPHS
<a id="written"></a>

**Only three positions in the whole document carry prose. All three are
published.** Everything else prints `[ TEXT REQUIRED ]`.

| position | subject | delivered as |
|---|---|---|
| **¶7-19** | POWER SUPPLY AND DISTRIBUTION | `scan-07-a.webp` + `scan-07-b.webp` |
| **SP 7-14** | THE VIDEO LINK | `scan-11-a.webp` + `scan-11-b.webp` |
| **B-1** | BIAS SETTINGS | `scan-31-a.webp` (+ `marked-01-a.webp`, unpublished) |

**Their full text is quoted at [03-ANSWERS §5](03-ANSWERS.md#second-kind),
[06-PORTAL §1](06-PORTAL.md#video-link) and below.**

### ¶7-19, in full

> *"The instrument carries its own cell and does not require a continuous supply
> to remain in service. Power reaches the instrument at the power port from an
> adapter of the PHVDC type. The adapter carries the supply and the data channel
> on one pair. It is matched to the instrument and no substitution is to be
> attempted. Supply figures are given in Section II; the requirements of the
> premises are given in paragraph 3-7."*
>
> *"The instrument may be worked while charging. **Charging has no effect upon
> the determination.**"*
>
> *"When the instrument is off, the power control alone remains live. No input is
> read, no sound is made, and no part of the display system is driven. **An
> instrument that answers any other control while off is not off, and is to be
> withdrawn from service.**"*
>
> **CAUTION** — *"Do not service under load. **The keeper is answerable for the
> state of the cell.**"*
>
> *"The caution given in the SAFETY SUMMARY bears on every operation at the power
> port and is not repeated at each step."*
>
> *"**The cell is not an operator-replaceable item.** Its condition is carried
> with the other condition readings; see paragraph 8-9 and Table 8-2. Where the
> instrument advises attention to the cell, place the instrument on charge and
> run the maintenance routine of paragraph 8-7 before further use. **Attention
> advised is not a fault reported.**"*

---

## 4 · THE ONE QUOTED LINE
<a id="the-caution"></a>

**The SAFETY SUMMARY carries the only sentence in the whole structure issue
quoted verbatim from the record — 2022 proto-manual, carried into the 2024
manual:**

> **CAUTION** — *"Never allow power port connections to come in contact with
> tongue, lips, or other fleshy appendages."*

---

## 5 · APPENDIX F — the 35 terms with no meanings
<a id="appendix-f"></a>

**The terms are real and attested. Every meaning column is reserved.** Writing
them is what the whole of this catalogue exists to make possible.

```
Answer Engine · AMMMS · Bias Setting (BS) · BIST · Ceremony set · Clarity ·
Code, access · Density set · Determination · Door · EED · ElectronScope ·
Engine · Enunciator · Fluidic Matrix Luminescence (FML) ·
Fluidic Nano-Matrix (FNM) · Fluidic suspension · GyroMotion · Inclination ·
MAME · MIALLO · MindsEye · Monitor, diagnostic · Passage · PHVDC · Polarity ·
PressPulse · Prediction Engine · Record, operator · Record, system · SCAT ·
Self-correction · SonicWave · System set · VibroSense
```

**SIX OF THEM HAVE NOTHING TO PUT IN THE ROW:** `AMMMS` · `MIALLO` ·
`MindsEye` · `PHVDC` · `SCAT` · and the three set names
([H-12](HOLES.md#h-12)). **Two more are contested:** `Determination` is coined
([H-13](HOLES.md#h-13)) and `Inclination` exists in no firmware
([K-07](CONFLICTS.md#k-07)).

**ROUGHLY A THIRD OF THIS CATALOGUE IS OPS REGISTER AND MUST NEVER REACH THAT
PAGE.** See [Doctrine 18](10-LAWS.md#doctrine-18).

---

## 6 · APPENDIX G — the 21 abbreviations
<a id="appendix-g"></a>

| abbr | expansion |
|---|---|
| A&P | Accuracy and Precision |
| **AMMMS** | **`[ EXPANSION REQUIRED ]`** |
| BIST | Built-In Self Test |
| BS | Bias Setting |
| CCS | Click Control System |
| EED | Electronic Electronics Distributor |
| FML | Fluidic Matrix Luminescence |
| FNM | Fluidic Nano-Matrix |
| GMI | GyroMotion Input |
| IG | Inertial Gyroscope |
| MAME | MGK Augmented Matrix Emulation |
| **MGK** | **Mainframe Generated Knowledge** |
| OMI | Operating and Maintenance Instructions |
| **PHVDC** | **`[ EXPANSION REQUIRED ]`** |
| PPI | PressPulse Input |
| SCAT | System Configuration and Test |
| SCS | Scroll Control System |
| SWI | SonicWave Input |
| **TAC** | **Tricycle Alternating Current** |
| VCS | Voice Control System |
| VSI | VibroSense Input |

**PHVDC AND TAC ARE TWO ROWS OF THE SAME TABLE** — [K-01](CONFLICTS.md#k-01).

---

## 7 · THE PLACEHOLDER MARKS
<a id="placeholders"></a>

| mark | register | what prints it |
|---|---|---|
| `[ TEXT REQUIRED ]` | OPS | every unwritten paragraph position |
| `[ ART REQUIRED ]` | OPS | every reserved figure frame |
| `[ ENTRIES REQUIRED ]` | OPS | every reserved table body |
| `[ EXPANSION REQUIRED ]` | OPS | AMMMS and PHVDC in Appendix G |
| `[PAPA]` | OPS | **a note to Mike.** Renders red in development and is **deleted from the SOURCE at launch.** Never visitor-facing. |
| `{ curly braces }` | OPS | **a note to Ops, not story.** *"They must never reach a visitor — the launch gate fails on any brace that survives."* |

---

## 8 · THE MARKED COPY
<a id="marked-copy"></a>

**The channel by which a manual page comes back with somebody's handwriting on
it.** `robots:robots/mgk-viiip/manual/marks/`.

### THE HAND CANNOT WRITE, AND THAT IS WHY THESE DOCUMENTS LOOK RIGHT

**Measured 2026-08-21, building QC_101: the mark set has NO ALPHABET.** 52
marks, and the whole vocabulary is **digits** (cut as rows — `1 2 3 4 5 6 7 8`,
`9 0`, and a fast loose `1234567890`, each of which segments cleanly into single
glyphs), **punctuation** (`! ? . / * ( ) [ ] -`), **tick and caret stock**
(seven upright strokes and slashes), **a monogram** — *an initialling, illegible
by design* — and **eight fixed phrases**: SEE 7-14 · ASK ENGINEERING · NOT FOR
FIELD UNITS · SAME AS B-3? · CHECK W/ FAR SIDE FIRST · DOES NOT APPLY ·
SUPERSEDED! · SEE REV B. Plus marginalia: stars, faces, squiggles, underlines,
scribbles.

**IT CANNOT WRITE `EVEN`, `FULL`, `BIT`, `PASS`, A NAME OR A WORD OF ANY KIND**
outside that list.

**THE CONSTRAINT PRODUCED THE CORRECT OBJECT, WHICH IS THE FINDING.** A form
whose values had to be *written* was never available — so the form **prints its
options and the inspector strikes or ticks**, which is what a real 1965
inspection form is. B-1's marked copy already worked exactly this way (`ODD /
EVEN` printed, ODD struck, EVEN standing). **Any future hand-marked document is
governed by this**: the printed side carries every word, and the hand only ever
strikes, ticks, numbers and initials.

**A DATE IS COMPOSABLE AND `reserved-date-3-14-65` IS STILL NOT SPENT.** Digits
plus the slash make any date; the reserved sheet stays unplaced, because it is
π and 3-14 is the reserved paragraph.

**MIKE'S INSTRUCTION: *"do not invent margin words."*** So none are invented:
**every word placed on a page is a phrase he actually wrote on the handwriting
sheet**, cut out and put where it bears. **The only marks DRAWN are the
strike-throughs and the stamp** — geometry and a machine-pressed letterform,
neither of which is handwriting.

**TWO REGISTERS ON THE SHEET, AND THEY MUST NOT BE MIXED INSIDE ONE
ANNOTATION** — *"a page marked in both is a page two people wrote on."*

| register | character |
|---|---|
| **careful** | the marks resolve rather than complain |
| **loose** | the angry hand |

**B-1 IS THE CAREFUL HAND THROUGHOUT** — *"it is the first marked copy, the marks
resolve rather than complain, and spending the angry hand here would leave
nowhere to escalate to."*

**THE ONE DELIBERATE EXCEPTION IS THE MONOGRAM**, taken from the loose column,
*"because a signature is the one mark a person does not vary by mood."* Flagged
for Mike.

**Marks placed on B-1:** `careful-check-w-far-side-first` ·
`careful-see-7-14` · `careful-ask-engineering` · `loose-monogram`, plus the
`PRELIMINARY` stamp.

**HIS SPELLING STANDS** — see [BELL-103](BELL-103.md#where-it-stands).

**AND `reserved-date-3-14-65` IS CUT, INDEXED AND DELIBERATELY NOT PLACED.** *It
is π, and 3-14 is the reserved paragraph.* See
[12a](CONFLICTS.md#not-conflicts).

**Marks cut and available, not all placed:** `careful-see-7-14` ·
`careful-ask-engineering` · `careful-not-for-field-units` ·
`careful-same-as-b-3` · `careful-check-w-far-side-first` ·
`reserved-date-3-14-65` · `loose-monogram`, among others.

**THE PEN IS DRAWN SO IT CANNOT BE MISTAKEN FOR A RULED LINE** — seven properties
are named in the generator and all seven are implemented: it **over-runs**; it is
**not parallel to the type**; its error is **low-frequency** (it bows on a
quadratic, because per-pixel jitter reads as a bad printer); **pressure varies**,
width and darkness together; it **starves at the start** while the ball picks ink
up; it **pools and hooks at the lift**; and **it sits on the paper**, drawn after
the copier so the sheet's grain reads through the thin parts rather than under
them.

---

## 9 · THE TWO GENERATORS
<a id="two-generators"></a>

**There are two, and they cannot both be the manual.** *Upstream: holes report
`D` 1.*

| | v1 — retired | the structure issue |
|---|---|---|
| **file** | `tools/manual_build.py` — **RETIRED 2026-08-05** | `tools/manual_structure_build.py` |
| **shape** | 22 arabic sections, no lists, no index, no glossary appendix | 12 roman sections, 8 appendices, three front-matter lists, an index |
| **numbering** | invented | **attested** |
| **prose** | **2,428 words, salvaged verbatim first** into `robots:docs/drafts/MANUAL_PROSE_SALVAGE-20260805.md` | three written paragraphs |

**Nothing has been deleted, moved or rewired.** **Nobody has ruled which is the
manual.**

**AND THE SALVAGE FILE CARRIES ITS DEFECTS WITH IT** — the disagreements are
reproduced at the head of the file *"so no sentence is lifted without its defect
attached."*

---

## 10 · THE FIT REPORT'S OWN NUMBERS
<a id="fit"></a>

**The structure was loaded with 100 fact families to see which would fit:**

| outcome | count |
|---:|---|
| **fit** | 62 |
| **demanded and absent** | 20 |
| **no room** | 6 |
| **no home** | 8 |

**A manual is a fact-placing machine. Load one and it tells you which of your
facts disagree, because two of them want the same cell.** That sentence is the
reason [CONFLICTS](CONFLICTS.md) and [HOLES](HOLES.md) exist in the shape they
do.

---

## 11 · THE PROTO-MANUAL — 2022
<a id="proto-manual"></a>

**`MGKVIIIp User Manual new.docx`, 2022-12-01, 31 KB. Built directly over the
Sears Silvertone radio's parts-list leaflet — the donor chassis.**

> *"PLEASE READ THESE INSTRUCTIONS VERY CAREFULLY BEFORE OPERATING YOUR
> **MGK-Viiip HIGH SPEED DECISION MAKER**… you will have the finest possible
> reception."*

**What it holds that nothing else does:**

- The **uncrating list** — charging adapter *"240TAC to USB-B micro"*, a
  fashionable travel case, spare parts.
- **TAC** — [K-01](CONFLICTS.md#k-01) — and **the fleshy-appendages caution**,
  which survives verbatim into 2024.
- **RADIONET** and **Catalog No. 6710** — [K-21](CONFLICTS.md#k-21).
- **A checkbox MODES list, an entirely different answer-engine taxonomy:**
  ☒ MGKviii · ☒ MGKviii 95 · ☐ French–Profane · ☐ Psychiatrist *(may ask
  clarifying questions)* · ☐ Quantify *(percentage calculator)* · ☐ Psychic
  *(binary toggle bias ratio)* · ☐ Researcher *(continually adjustable bias
  ratio)* · ☒ SigO *(Relationship)*.
  **"Psychic" and "Researcher" are the embryo of Polarity and Clarity.**
- A **Background** stub: *"was invented in 1946 by Albert C. Carter and Abe
  Bookman"* — **the Carter/Bookman egg predates the whole ABEAL mythology.**
- **Skeleton headings** — Theory of Operation, **SCAT — System Configuration and
  Test**, Start Up, **Shut down**, Troubleshooting. **Two of those five are still
  empty four years later** ([H-07](HOLES.md#h-07), [K-21](CONFLICTS.md#k-21)).

---

## 12 · THE PARCEL PROBLEM
<a id="parcel"></a>

*Upstream: holes report `A-16`, flag `P9b`, raised 2026-07-24 and unmoved.*

**The manual documents the machine AS SOLD, and under the parcel law the day-one
machine is NIAC, two toys and the inbox.** Section VI has **eleven paragraph
positions describing capability that arrives later.**

**Either** the manual describes a machine the buyer does not yet have — which is
period-true, catalogues did it constantly, and `ACT1_BOM` (e) makes the gap
itself an egg — **or** Section VI shrinks to the day-one set and the rest moves
to a supplement. **Untouched.**
