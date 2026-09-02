# JOB 2 — THE MANUAL EXAMPLES
2026-08-13 · READ-ONLY · nothing in either repo was written.

Mike asked for this four ways on 11 and 13 August. It is one request:
**pull the real material out of the document.**

---

## WHAT YOU NEED FROM ME

**Two things, and the first one changes what you can write.**

**1. THE MANUAL HAS NO SENTENCES IN IT.** It is the *STRUCTURE ISSUE* — its own
title page says so: *"THIS ISSUE CARRIES THE ARRANGEMENT OF THE MANUAL ONLY…
TEXT, TABLE ENTRIES AND ILLUSTRATIONS ARE SUPPLIED SEPARATELY."* Every place a
statement about the machine would go prints `[ TEXT REQUIRED ]` — **192 of
them** across 61 pages. Every one of the ten figures prints `[ ART REQUIRED ]`.
Every one of the thirty tables prints `[ ENTRIES REQUIRED ]`.

**There are exactly three real sentences in the whole book**, and they are in
§C below. So a Record that quotes "a passage from the manual" cannot quote a
paragraph — **there are none to quote.** What it CAN quote is headings, table
captions, column headers, glossary terms and abbreviations, and there are
**hundreds** of those, all listed below verbatim with page numbers.

*This is not a problem with the document — it is the document's own subject.
A machine-readable dump of a manual that is all headings and all
`[ TEXT REQUIRED ]` is arguably a better story object than a finished one.*

**2. YOUR BRACE NOTES ASKED FOR "THE MOST COMMON WORDS ROBOTS EXPECTS TO USE."**
The juicy ones are in §A. The single best page in the book for your purpose is
**page 56, APPENDIX G, ABBREVIATIONS** — 21 rows, fully written, no
placeholders. It reads exactly like something recovered from a hex dump. It is
in §C1 in full, ready to paste.

**Nothing here needs a decision from you.** Take what you want.

---

# 2a. THE VOCABULARY

## Method, stated

Counted across the four places the machine's words actually live:

| source | what it is | display strings | word tokens |
|---|---|---:|---:|
| `manual` | all 61 pages, every struck character | 61 pages | 1,372 |
| `tables` | `robots/mgk-viiip/content/tables/*.csv`, display columns only | 1,048 | 2,865 |
| `twin_menu` | `MENU_TABLE_SRC` in `public/held/robots/twin.html` | 153 rows | 187 |
| `firmware_menu` | `MENU_TABLE` in the device's `2_data_MENU.ino` | 326 literals | 396 |

**1,561 distinct terms. 4,820 tokens.**

**What I dropped, counted rather than filtered silently:** 3,344 non-display
table cells (provenance, audit notes, evidence, cost estimates — Ops
commentary, never on the glass) · 192 manual `[ … REQUIRED ]` placeholders ·
44 `.end` sentinels · 20 `[stub]`/`[PLACEHOLDER]` cells.

**One contaminant I did not catch and am naming rather than hiding:** 14
`[PAPA]` markers in `appwords_*.csv` `value` cells are reserved flavour slots,
not machine words, and they counted as the word "PAPA". Discount that row.

---

## A1 — THE WORKING LANGUAGE (in three or four of the four sources)

These are the words the machine uses *everywhere*. If a hex dump coughed up
ASCII, these are what would fall out.

**The four doors and the branch names** — the top of the menu:

```
ANSWERS      PREDICTIONS    PROBABILITIES   ADVICE      DETECTORS
MESSAGES     PROGRAMS       PREFERENCES     CODES       GAMES
```

**The two bias axes, and their register names** — the most-repeated real words
in the machine after the menu itself:

```
POLARITY   Negative · Pessimistic · Neutral · Favorable · Optimistic · Affirmative
CLARITY    Uncouth · Offensive · Discourteous · Impartial · Mannerly
```

Frequency, merged across sources: `Uncouth` 41 · `Offensive` 39 ·
`Discourteous` 38 · `Impartial` 38 · `Mannerly` 17 · `Affirmative` 9 ·
`Negative` 8 · `Favorable` 7 · `Optimistic` 6.

**The recurring system nouns:**

| term | n | in |
|---|---:|---|
| `SYSTEM` | 62 | all four |
| `VOICE` | 57 | all four |
| `< Back` | 49 | firmware, tables, twin |
| `Msg` / `MESSAGES` | 42 | all four |
| `MGK-VIIIp` | 19 | all four |
| `SETTING` | 24 | firmware, manual, twin |
| `BIAS` | 14 | firmware, manual, twin |
| `CODE` / `CODES` | 31 | all four |
| `BIST` | 7 | all four |
| `CHECKSUM` · `USERDATA` · `CODE RUNNER` | 6 each | all four |
| `NAME` · `USER` | 14 | all four |

---

## A2 — THE JUICY ONES

Marked juicy because they are *specific and slightly wrong* — the register that
reads as recovered machine text rather than as prose someone wrote.

**Menu rows that are funny on their own:**

```
Bullshit Detector          Stud Detector
Trustworthy Detector       Attractiveness Detector
Inlaws and Outlaws         Friends & Family          Partners
Office Nickname            Water Cooler              Career Chooser
Gobble Don't Fall          AvoidSteroids             Tilt Drive
Snow Globe                 Lottery Numbers           Roll Dice
```

**Engine names — the personalities the machine can wear:**

```
MGK-NIAC        MGK-v2.0        MGK-65          MGK-Einstein
MGK-Yogi        MGK-DYK         MGK-HR          The Everyman
The Informer    The CEO         The Assistant   The Intelligencer
The Gambler     The Marksman    The Futurist    The Executive
The Machine     The Translator  The Astronaut   The Commander
The Mechanic    The Reactor
```
…then it runs out of names and the last ten rows are literally
`MGK-VIIIp-23` through `MGK-VIIIp-32`. **The table is 41 rows wide and the
naming gave up at 22.** That is juicy on its own.

**Abbreviations that sound like they mean something and are never expanded** —
these are the best "suspiciously frequent text strings" in the whole corpus:

```
AMMMS       [ EXPANSION REQUIRED ]
PHVDC       [ EXPANSION REQUIRED ]
MIALLO      (glossary term, p54 — no expansion anywhere)
```

**Abbreviations that ARE expanded, and are absurd:**

```
MGK    Mainframe Generated Knowledge
EED    Electronic Electronics Distributor
TAC    Tricycle Alternating Current
MAME   MGK Augmented Matrix Emulation
A&P    Accuracy and Precision
```

**Trade names — capital-letter compounds, the period's own tic:**

```
GyroMotion    SonicWave    VibroSense    PressPulse
MindsEye      ElectronScope             Fluidic Nano-Matrix
Fluidic Matrix Luminescence             Enunciator
```

**The company:**

```
ABEAL, A DIVISION OF SCRAPCO — ENGINEERING DEPARTMENT
Document number:  ABEAL 8P-OMI-1
Revision:         REV. - / PRELIMINARY
Model:            MODEL MGK-VIIIp
Serials prefixed: MGK-VIIIp-
```

---

## A3 — THE SPOKEN LEXICON (the content tables only)

What the machine *says*, as opposed to what it is labelled. Top recurring words
in the answer/fortune/persona tables: `Yes` 40 · `today` 21 · `Outlook` 13 ·
`Absolutely` 12 · `awaits` 12 · `Odds` 9 · `RISK` 9 · `soon` 10 · `later` 9 ·
`CERTAIN` 8 · `surprise` 8 · `Luck` 7 · `Patience` 5 · `dreams` 5 ·
`reappear` 5 · `intuition` 4.

**`awaits` and `reappear` are the two words that only a fortune machine uses.**

---

# 2b. THE FOURTEEN DULL PAGES — CONFIRMED, WITH THREE CORRECTIONS

I opened all fourteen by driving the manual's own layout engine, and verified
the reconstruction against the rendered PNGs at 240 dpi (page 56 and page 54
inspected as images; the reconstruction matched character for character).

| pg | folio | chars | figure? | closes a section? | verdict |
|---:|---|---:|---|---|---|
| 19 | 3-2 | 71 | no | **yes** — ends Section III | **DULL. The dullest page in the book.** Two lines. |
| 24 | 5-2 | 427 | **yes** Fig 5-1 `[ART REQUIRED]` | no | dull enough — but it carries a figure blocker |
| 25 | 5-3 | 176 | no | **yes** — ends Section V | **DULL.** Three paragraph stubs. |
| 31 | 7-2 | 402 | **yes** Fig 7-2 `[ART REQUIRED]` | no | dull — figure blocker |
| 32 | 7-3 | 555 | **yes** Fig 7-3 `[ART REQUIRED]` | no | dull — figure blocker + a table |
| 33 | 7-4 | 616 | no | **yes** — ends Section VII | **DULL.** Table 7-2 + four stubs. |
| 37 | 9-2 | 584 | no | **yes** — ends Section IX | **DULL.** |
| 38 | 10-1 | 433 | **yes** Fig 10-1 `[ART REQUIRED]` | no (opens X) | **section opener** — see correction 2 |
| 39 | 10-2 | 70 | no | **yes** — ends Section X | **DULL.** Two lines. |
| 41 | 11-2 | 60 | no | **yes** — ends Section XI | **DULL. Tied for dullest.** Two lines. |
| 43 | 12-2 | 389 | no | **yes** — ends Section XII | **DULL.** One table. |
| 44 | A-1 | 577 | no | no (opens App. A) | **section opener, no art blocker** — see correction 3 |
| 56 | G-1 | 855 | no | **yes** — the whole appendix | **NOT DULL — CORRECTION 1** |
| 57 | H-1 | 520 | no | **yes** — the whole appendix | dull, and it is the last content page |

### Correction 1 — **page 56 is the richest page in the book, not a dull one**

`APPENDIX G · ABBREVIATIONS` is **fully populated**: 21 rows, 19 of them with
real expansions, no `[ TEXT REQUIRED ]` anywhere except two deliberate
`[ EXPANSION REQUIRED ]` blanks. It is the single most quotable page in all 61.
**Do not spend it on an ordinary day.** Full text in §C1.

### Correction 2 — **page 38 is a section opener**

It carries `SECTION X · BUILT-IN SELF TEST AND CODE UTILITIES` as a centred
banner. Section openers are the pages that look like something. It is dull in
content but it is not visually ordinary.

### Correction 3 — **page 44 is an appendix opener and its table is the one that matters**

`APPENDIX A · ACCESS CODES`, `Table A-1. ACCESS CODES`. It has no art blocker,
which makes it publishable today — but the story reason to hold it is that
**ACCESS CODES is the appendix a reader would want most.** Spending it on a
quiet day wastes it. (Its column header wraps to two lines — `FUNCTION OR` /
`SECTION` — and the rule under it is one character short. Both are the
generator's hand-ruling jitter, not damage.)

### Excluded pages — confirmed, and now characterised precisely

- **Page 54 (F-1, glossary) — the column overrun is ONE ROW.** The term
  `Fluidic Matrix Luminescence (FML)` is 33 characters against a 26-character
  column. It overruns the hand-ruled vertical divider and the `(FML)` strikes
  straight through `[ TEXT` in the meaning column, leaving a black blob.
  **Verified by looking at the rendered page, not inferred.** The other 29 rows
  are clean. A one-row crop would be publishable; the page as a whole is not.
- **Pages 58 and 59 — the rendering defect is a DUPLICATE FOLIO.**
  `OPERATOR'S NOTES` and `RECORD OF SERVICE` carry the printed folios
  **`Index-1` and `Index-2`** — the same two folios printed again on pages 60
  and 61, the real index. Cause: `page_label()` in
  `tools/manual_structure_build.py` falls through to `"Index-%d"` for any part
  that is not cover/front/section/appendix, and the back matter is emitted
  under `new_part("back")`. **Two pairs of pages in one book with the same page
  number.** That is the defect; it is one line to fix and it is in the robots
  repo, which I did not write to.

---

# 2c. THE EXAMPLES — VERBATIM, WITH PAGES

## C1 — Page 56, APPENDIX G, ABBREVIATIONS *(the whole page, verbatim)*

```
                                  APPENDIX G
                                ABBREVIATIONS

    A&P       Accuracy and Precision
    AMMMS     [ EXPANSION REQUIRED ]
    BIST      Built-In Self Test
    BS        Bias Setting
    CCS       Click Control System
    EED       Electronic Electronics Distributor
    FML       Fluidic Matrix Luminescence
    FNM       Fluidic Nano-Matrix
    GMI       GyroMotion Input
    IG        Inertial Gyroscope
    MAME      MGK Augmented Matrix Emulation
    MGK       Mainframe Generated Knowledge
    OMI       Operating and Maintenance Instructions
    PHVDC     [ EXPANSION REQUIRED ]
    PPI       PressPulse Input
    SCAT      System Configuration and Test
    SCS       Scroll Control System
    SWI       SonicWave Input
    TAC       Tricycle Alternating Current
    VCS       Voice Control System
    VSI       VibroSense Input
```
Running head `Appendix G` / `MODEL MGK-VIIIp`; foot `ABEAL 8P-OMI-1` / `G-1`.

## C2 — The three real sentences in the book

**Page 4 (folio iii), SAFETY SUMMARY:**

> The following applies throughout this manual and is repeated where it bears
> on a procedure.

**Page 4, inside the ruled CAUTION box** — *the one line quoted from the record
rather than written for the manual (source: the 2022 proto-manual, carried into
the 2024 instruction manual's power section):*

> **CAUTION**
> Never allow power port connections to come in contact with tongue, lips, or
> other fleshy appendages.

**Page 3 (folio ii), title page, foot:**

> THIS ISSUE CARRIES THE ARRANGEMENT OF THE MANUAL ONLY. SECTION, PARAGRAPH,
> TABLE AND FIGURE POSITIONS ARE FIXED BY THIS ISSUE AND ARE NOT TO BE
> RENUMBERED. TEXT, TABLE ENTRIES AND ILLUSTRATIONS ARE SUPPLIED SEPARATELY.

## C3 — The cover and title block *(page 1)*

```
                              M G K - V I I I p
                          OPERATING AND MAINTENANCE
                                 INSTRUCTIONS
                               STRUCTURE ISSUE
                        STRUCTURE AND ARRANGEMENT ONLY
                              TEXT NOT SUPPLIED
                                    ABEAL
                            A DIVISION OF SCRAPCO
                            ENGINEERING DEPARTMENT
                  ABEAL 8P-OMI-1        REV. - / PRELIMINARY
```

## C4 — The twelve sections *(verbatim titles, with the page they open on)*

```
p12   SECTION I     GENERAL DESCRIPTION
p15   SECTION II    SPECIFICATIONS
p18   SECTION III   INSTALLATION
p20   SECTION IV    CONTROLS AND INDICATORS
p23   SECTION V     STARTING PROCEDURE
p26   SECTION VI    OPERATING INSTRUCTIONS
p30   SECTION VII   THEORY OF OPERATION
p34   SECTION VIII  MAINTENANCE
p36   SECTION IX    TROUBLESHOOTING
p38   SECTION X     BUILT-IN SELF TEST AND CODE UTILITIES
p40   SECTION XI    SERVICE AND PARTS
p42   SECTION XII   ACCESSORIES AND OPTIONAL EQUIPMENT

p44   APPENDIX A    ACCESS CODES
p46   APPENDIX B    BIAS SETTINGS
p48   APPENDIX C    ANSWER ENGINE SCHEDULE
p50   APPENDIX D    MENU INDEX
p52   APPENDIX E    VOICE AND AUDIBLE SCHEDULE
p54   APPENDIX F    GLOSSARY
p56   APPENDIX G    ABBREVIATIONS
p57   APPENDIX H    SERVICE OFFICES
```

## C5 — Table captions and their real column headers *(all 30, verbatim)*

The captions and the column headers are real. Only the bodies are reserved.
**A table row you could quote does not exist anywhere in the book** — but a
caption plus its headers reads exactly like a row of recovered ASCII.

```
p13  Table 1-1   CONFIGURATIONS AND ITEMS SUPPLIED     CONFIGURATION | ITEMS SUPPLIED
p14  Table 1-2   RELATED PUBLICATIONS                  PUBLICATION | NUMBER | COVERS
p15  Table 2-1   SPECIFICATIONS                        ITEM | SPECIFICATION
p16  Table 2-2   SUBSYSTEM DESIGNATIONS                SUBSYSTEM | DESIGNATION | REFERENCE
p18  Table 3-1   ITEMS TO BE LOCATED ON UNPACKING      ITEM | QUANTITY | REMARKS
p21  Table 4-1   CONTROLS AND INDICATORS               INDEX NO. | CONTROL OR INDICATOR | FUNCTION
p22  Table 4-2   INDICATOR LAMP CONDITIONS             CONDITION | INDICATION | REFERENCE
p23  Table 5-1   STARTING SEQUENCES                    SEQUENCE | CONDITION | OPERATOR ACTION
p26  Table 6-1   THE FOUR DOORS                        DOOR | CONTENTS | REFERENCE
p29  Table 6-2   MESSAGE CLASSES AND STATES            CLASS | STATE | INDICATION
p32  Table 7-1   DISPLAY DUTIES                        DISPLAY | DUTY | MODE AT REST
p33  Table 7-2   CHARACTER SETS AND THEIR DUTIES       SET | FACE | DUTY
p34  Table 8-1   PREVENTIVE MAINTENANCE SCHEDULE       INTERVAL | ATTENTION | REFERENCE
p35  Table 8-2   CONDITION READINGS AND THEIR SOURCES  READING | SOURCE | SHOWN WHEN
p36  Table 9-1   TROUBLE CHART                         OBSERVATION | PROBABLE CAUSE | ACTION
p37  Table 9-2   REPORTED CONDITIONS                   REPORT | MEANING | ACTION
p40  Table 11-1  REPLACEABLE PARTS                     REF. DESIG. | DESCRIPTION | PART NO.
p42  Table 12-1  ACCESSORIES SUPPLIED, BY CONFIGURATION  CONFIGURATION | ACCESSORY | REMARKS
p43  Table 12-2  OPTIONAL EQUIPMENT                    EQUIPMENT | CATALOG NO. | REMARKS
p44  Table A-1   ACCESS CODES                          FUNCTION OR SECTION | CODE | REMARKS
p46  Table B-1   POLARITY SETTINGS                     SETTING | NAME | CODE
p46  Table B-2   CLARITY SETTINGS                      SETTING | NAME | CODE
p47  Table B-3   INCLINATION SETTINGS                  SETTING | NAME | CODE
p47  Table B-4   BIAS BLENDING MATRIX                  USER BIAS | SYSTEMIC BIAS | RESULT
p48  Table C-1   ENGINES FITTED AS STANDARD            ENGINE | COMPILE DATE | PRESENTATION
p49  Table C-2   ENGINE POSITIONS NOT FITTED IN INSTRUMENTS OF GENERAL ISSUE
                                                       POSITION | DESIGNATION | REMARKS
p51  Table D-1   MENU INDEX                            LEVEL | ROW | ACCESS | REFERENCE
p52  Table E-1   VOICE SCHEDULE                        NO. | VOICE | FITTED TO
p53  Table E-2   AUDIBLE INDICATIONS                   INDICATION | OCCASION
p57  Table H-1   SERVICE OFFICES                       OFFICE | ADDRESS | TELEPHONE
```

**The three best captions in the book, for your purposes:**
`ENGINE POSITIONS NOT FITTED IN INSTRUMENTS OF GENERAL ISSUE` (p49) ·
`BIAS BLENDING MATRIX` (p47) · `THE FOUR DOORS` (p26).

## C6 — The ten figure captions *(all `[ ART REQUIRED ]`, all quotable)*

```
p12  Figure 1-1   MGK-VIIIp, GENERAL VIEW
p20  Figure 4-1   CONTROLS AND INDICATORS, FORWARD AND UPPER
p24  Figure 5-1   STARTING SEQUENCE, SIMPLIFIED FLOW
p27  Figure 6-1   MENU SYSTEM, LEVEL DIAGRAM
p28  Figure 6-2   THE ASK CYCLE, SIMPLIFIED FLOW
p30  Figure 7-1   MGK-VIIIp, SYSTEM BLOCK DIAGRAM
p31  Figure 7-2   RESPONSE CURVE, TYPICAL
p32  Figure 7-3   UPPER DISPLAY, DIAGNOSTIC MONITOR, WINDOW LAYOUT
p38  Figure 10-1  SELF TEST, TYPICAL REPORT
p45  Figure A-1   CODE LANDSCAPE, PLATE
```

`CODE LANDSCAPE, PLATE` and `THE ASK CYCLE, SIMPLIFIED FLOW` are the two that
sound most like something you'd find in a data dump.

## C7 — Paragraph titles worth quoting *(from the 107 positions)*

The paragraph numbering is odd-only (`1-1`, `1-3`, `1-5`…) — period practice,
leaving room to insert. Sub-paragraphs are even and indented.

```
1-5.   INSTRUMENT IDENTIFICATION.
  1-6.   Serial designation.
  1-7.   Compile date and issue.
3-8.   The supplied adapter.
3-9.   Adapters of the original pattern.
5-9.   EXTERNAL CONTENT TRANSFER.
  5-10.  Permitting the transfer.
  5-11.  Postponing the transfer.
5-13.  SELF-CORRECTION DURING STARTING.
5-15.  COMPLETION OF THE FACTORY TEST.
6-3.   THE MENU SYSTEM.
  6-4.   Rows, passages, and rows not shown.
6-5.   OBTAINING A DETERMINATION.
  6-6.   The minimum reading interval.
  6-7.   Requesting a further determination.
6-9.   THE ANSWER ENGINES.
6-29.  FUNCTIONS NOT FITTED.
7-7.   FLUIDIC SUSPENSION AND MATRIX EMULATION.
  7-10.  Polarity.   7-11.  Clarity.   7-12.  Inclination.
7-21.  RETENTION OF THE RECORD.
7-23.  CONDITION AND WEAR.
9-5.   SELF-CORRECTION.
10-3.  BUILT-IN SELF TEST (BIST).
10-7.  USERDATA.
10-9.  CODE RUNNER.
10-11. SYSTEM CONFIGURATION AND TEST (SCAT).
C-3.   PERSONALITY INSTALLATION.
```

**`Rows, passages, and rows not shown.` (6-4) is the best single line in the
book** — it says out loud that the menu hides rows. `FUNCTIONS NOT FITTED`
(6-29), `RETENTION OF THE RECORD` (7-21) and `PERSONALITY INSTALLATION` (C-3)
are the next three.

## C8 — Glossary terms *(page 54–55, all 35, verbatim)*

```
Answer Engine · AMMMS · Bias Setting (BS) · BIST · Ceremony set · Clarity
Code, access · Density set · Determination · Door · EED · ElectronScope
Engine · Enunciator · Fluidic Matrix Luminescence (FML) · Fluidic Nano-Matrix
(FNM) · Fluidic suspension · GyroMotion · Inclination · MAME · MIALLO
MindsEye · Monitor, diagnostic · Passage · PHVDC · Polarity · PressPulse
Prediction Engine · Record, operator · Record, system · SCAT · Self-correction
SonicWave · System set · VibroSense
```

`Ceremony set` · `Density set` · `System set` · `Passage` · `MIALLO` are the
five that appear nowhere else in the corpus and are never explained.

## C9 — Not the manual, but the strongest raw ASCII you have

Your brace note asked for *"suspiciously frequent text strings."* The strongest
material for that is the machine's own answer table —
`robots/mgk-viiip/content/tables/answer_core.csv`, 20 rows, `_` marks the
line break on the two-line display:

```
Ask again_later.            Definitely_No.              As I see it,_yes.
Cannot_predict now.         Don't count_on it.          It is_certain.
Concentrate_and ask again.  My reply_is no.             It is_decidedly so.
Reply hazy._Try again.      My sources_say no.          Most_likely.
                            Outlook_not so good.        Outlook good.
                            Very doubtful.              Signs point_to yes.
                                                        Yes.
                                                        Yes,_definitely.
                                                        You may_rely on it.
                                                        Without_a doubt.
```

And the message subjects, `messages.csv` — *these read as an inbox:*

```
Welcome!                Start Up Procedure       New Feature Added
ALERT!                  Language Advisory
```
with statuses `READ` · `NOT_READ` · `NOT_SENT`, sender `MGK-Assistant`.

---

# 2d. RICHEST AND EMPTIEST

## The richest pages for quotable material

| rank | pg | what it gives you |
|---:|---:|---|
| 1 | **56** | 21 abbreviations, fully written. The best page in the book. |
| 2 | **54** | 30 glossary terms. One overrun row; the rest clean. |
| 3 | **6–8** | the contents pages — every section and paragraph title with leader dots and section-relative page numbers. **Page 7 is the densest page in the book at 2,967 characters.** |
| 4 | **60–61** | the alphabetical index. 92 entries, mechanically true page numbers. |
| 5 | **1 / 3 / 4** | cover, title page, safety summary — where all three real sentences live. |
| 6 | **10** | LIST OF TABLES — all 30 captions in one column. |
| 7 | **55** | glossary continuation, 5 terms, clean, and it is a *short* page. |
| 8 | **51** | Table D-1 `MENU INDEX` — a 150 mm reserved table with `LEVEL | ROW | ACCESS | REFERENCE`. Empty, but the headers are the whole conceit. |

## Empty scaffolding — pages that are almost nothing

Measured by struck characters, excluding running heads and rules:

| pg | folio | chars | content |
|---:|---|---:|---|
| **41** | 11-2 | **60** | one paragraph title, one `[ TEXT REQUIRED ]` |
| **39** | 10-2 | **70** | same shape |
| **19** | 3-2 | **71** | same shape |
| 45 | A-2 | 102 | a figure frame and its caption, nothing else |
| 50 | D-1 | 129 | appendix banner + one stub |
| 5 | iv | 175 | three bracketed requirements |
| 25 | 5-3 | 176 | three paragraph titles |
| 2 | i | 176 | three bracketed requirements |
| 17 | 2-3 | 47 | **the emptiest page in the book** |

**Page 17 (folio 2-3) is 47 characters** — one paragraph title
(`2-15. PHYSICAL DATA.`) and one `[ TEXT REQUIRED ]`. It was not on the
fourteen-page list and it is duller than anything that was.

---

## WHAT I COULD NOT DETERMINE

- **Whether `AMMMS`, `PHVDC` and `MIALLO` have meanings anywhere.** They are
  `[ EXPANSION REQUIRED ]` in the manual and I found no expansion in the
  firmware, the twin, or the content tables. They may be deliberate blanks.
- **Whether the 240 dpi PNGs in the museum are byte-identical to what the
  generator produces today.** I verified two pages by eye against my
  reconstruction and they matched exactly, but I did not re-run the generator
  — that would write into the robots repo, which this job is read-only against.
- **Whether the page-58/59 duplicate folio is known.** I found the cause in the
  source; I did not find a register row or a note about it.
- **What `Ceremony set` and `Density set` are.** Glossary terms with no
  definition and no other appearance in any of the four sources.

## WHAT NEEDS MIKE

**Nothing is blocked on you.** Two things you may want to rule on when you get
to them, neither urgent:

1. **Page 56 is too good to spend on a quiet day.** It is currently on the
   dull-page list. My reading is that it should come off it.
2. **The page-58/59 duplicate folio is a one-line fix in the robots repo**
   (`page_label()` in `tools/manual_structure_build.py`). Fixing it means
   re-rendering those two pages. Say the word and it becomes a packet; I did
   not touch it.
