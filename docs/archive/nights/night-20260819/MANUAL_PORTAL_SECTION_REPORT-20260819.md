# THE PORTAL SECTION OF THE MANUAL — Steps 1–4, reported (2026-08-19)

**Status: OPS, read-only on both repos. NOTHING BUILT. Nothing in `src/`
changed, nothing in `tools/` changed, no generator re-run.** Two documents were
written: this report and
`weird-baby-robots/docs/MANUAL_VOCABULARY-20260819.md` (Step 2).

---

## WHAT IS WAITING ON MIKE

Six rulings. Everything below the line is the reasoning.

1. **THE SHAPE.** Ops is second-guessing the plan, as asked. *Overview /
   Theory of Operation / Troubleshooting* builds a small manual inside the
   manual — the document already has a Theory of Operation section (VII) and a
   Troubleshooting section (IX), and the video link's theory is **already
   written** at SP 7-14. **None of the three is a procedure, and a procedure is
   what "how to turn it on" is.** Ops proposes a run of paragraphs in Section VI
   instead, with the controls, the trouble rows and the settings going to the
   positions that already exist for them. §3 has the paragraph list.

2. **WHOSE EQUIPMENT IS THE FEED CONTROL?** Its badge reads
   `ABEAL · FEED CONTROL · MODEL NO. TYPE 8p` — **a separate instrument with its
   own model number.** Supplied with the VIIIp (Section XII, Table 12-1), owner
   -provided (1-13 EQUIPMENT REQUIRED BUT NOT SUPPLIED), or at the far end and
   therefore barely this manual's business at all? All three fit everything
   written. **The answer decides which section the procedure lives in.**

3. **PASTED OR TAPED — they are two different stories, not two finishes.**
   The generator's doctrine is *figures sitting in hand-cut rectangles **pasted**
   onto the mechanical* — engineering put it there before the camera, so it comes
   out halftoned and grey like the page. **Tape says somebody stuck a real
   photograph onto this copy afterwards, by hand** — same register as a
   handwritten margin note, and it would be the only object on the page that is
   not a photocopy. §4.

4. **THERE IS NO PHOTOGRAPH OF THE PORTAL.** Seven files in
   `reference/photos/`; measured this pass, **one is a compliant photograph of
   the machine** (`top_monitor.png` — the diagnostic monitor with `TEST` in the
   graph window, Egg 1), one is mirrored, one fails the obfuscation law's first
   article, and four are compositing assets rather than photographs. **Nothing
   in either tree shows the video link, the feed control or a far end.** §4.

5. **PARAGRAPH 3-14 IS FREE. PAGE 3-14 IS OUT OF RANGE.** Do not build. §1.

6. **TWO SMALL ONES.** (a) The Portal drum's legend reads `SELECT · ONE ARMED`
   and **two positions arm** since channel 4 took the close-up on 2026-08-12 —
   one word, and it is on a held page, so nobody has met it yet. (b) `keeper` and
   `operator` are both used for the same person **inside one written paragraph**
   of the manual. §2.

---

## 1. STEP 1 — DOES 3-14 EXIST?

**Answer: as a PARAGRAPH it is FREE and it is the very next number. As a PAGE it
is OUT OF RANGE.**

### The paragraph

Section III INSTALLATION holds these positions and no others
(`tools/manual_structure_build.py:216-226`):

| | |
|---|---|
| 3-1 | INTRODUCTION. |
| 3-3 | UNPACKING. |
| — | *Table 3-1 · ITEMS TO BE LOCATED ON UNPACKING* |
| 3-5 | INITIAL INSPECTION. |
| 3-7 | POWER REQUIREMENTS. |
| 3-8 | *The supplied adapter.* (subordinate) |
| 3-9 | *Adapters of the original pattern.* (subordinate) |
| 3-11 | PLACEMENT. |
| **3-13** | **PREPARATION FOR RESHIPMENT OR STORAGE.** ← the last position in the section |

`3-14` appears nowhere in the generator, nowhere in the 93-entry index, and
nowhere in any document in either repo. **It is free.**

**And it is free in the right shape.** The period discipline the manual follows
(HP 465A, TM 11-5556, recorded in `MANUAL_PERIOD_MODEL` §4.4) gives principal
paragraphs the odd numbers and lets **subordinate paragraphs take the
intervening even numbers, indented** — 3-7 has 3-8 and 3-9 under it exactly this
way. So **3-14 is precisely the first subordinate paragraph under 3-13**, and it
needs no renumbering, no insertion and no argument. It is the next number the
section would reach on its own.

**Neighbours:** 3-13 PREPARATION FOR RESHIPMENT OR STORAGE immediately above;
SECTION IV CONTROLS AND INDICATORS immediately below. It would land on printed
page **3-2** — physical page **19** of 63.

**One thing worth knowing before he spends it.** 3-13 is currently
**DEMANDED, ABSENT** (`HOLES` D-7): the 2022 proto-manual and TM 11-5556 both
have the position and both of ours are empty. So writing 3-14 means writing 3-13
first — the egg would arrive as the subordinate clause of a reshipment
paragraph. That may be exactly right (nobody reads it, which is the point of an
egg) or exactly wrong (nobody reads it). His call.

### The page

Pages are section-relative (`N-n`). **Section III is two pages, 3-1 and 3-2.** A
page 3-14 would require Section III to grow sevenfold. **Out of range**, and it
cannot be reserved the way a paragraph number can.

**Not built. Reported only.**

---

## 2. STEP 2 — THE GLOSSARY

**Delivered:** `weird-baby-robots/docs/MANUAL_VOCABULARY-20260819.md`.

Roughly 130 terms across 11 categories, each with its source and its meaning as
attested: the instrument and its maker · the glass and the controls · the
determination · the bias (both kinds) · the menu · the trade names · starting
and the two machines · the video link · maintenance and the record · the
character sets · the manual's own register, including the eight F/T laws.

**Three rules held: no term invented, no conflict resolved, and every term's
register recorded** — `IN-STORY` where the machine or its documents say it,
`OPS` where we say it about the machine and it has never been on a page.
Doctrine 18 turns on that difference, and about a third of what is in there is
`OPS` and must never reach Appendix F.

### Twenty conflicts, none resolved. Four of them block sentences already written.

The two Ops was told to expect are both worse than the record says, and one is
new.

**THE POWER STORIES ARE FOUR, AND TWO OF THEM ARE IN THE SAME TABLE.** PHVDC
300 V DC (the 2024 spec) · 240 V tricycle alternating current with a 240TAC-to
-USB-B adapter (the 2022 proto-manual) · *"an adapter of the PHVDC type"* (the
manual's own paragraph 7-19, written, on the glass today) · and the real object,
which charges over USB. **New this pass: the manual's Appendix G carries `PHVDC`
and `TAC` as two rows of the same abbreviations table.** Whichever story wins,
the table currently declares two of them.

**POLARITY IS FIVE OR SIX, AND THE NAMES DISAGREE THREE WAYS — AND THE THIRD
WAY IS NOT WRITTEN DOWN ANYWHERE.** The known part is that the menu offers six
values and the firmware enum holds five, with slot 2 called *Exactitude* in the
2024 manual and *Neutral* in the spec (R4 settled the naming, not the count).
**The part nobody has recorded is that there are two five-value scales and they
share indices without sharing names.** What the keeper SETS is
`Negative · Pessimistic · Neutral · Favorable · Optimistic`. What each answer is
TAGGED is `Negative · Pessimistic · AskAgain · Optimistic · Affirmative`. And
`Polarity_Engine_Response` compares them **numerically** — `abs(tag − setting)`.
So setting *Neutral* is matched against tag *AskAgain*, *Favorable* against
*Optimistic*, and *Optimistic* against *Affirmative*: **three of five slots carry
two different words for one number.** Table B-1 has to print one of them.

**AND A THIRD, FOUND WHILE COUNTING: THE MANUAL DOES NOT AGREE WITH ITSELF
ABOUT WHO IS HOLDING IT.** `keeper` appears **exactly twice in the whole tree**,
both in the manual's own written prose — the CAUTION at 7-19 (*"The keeper is
answerable for the state of the cell"*) and B-1 (*"set by the keeper"*).
`operator` appears six times in the structure's furniture: OPERATOR ACTION,
THE OPERATOR RECORD, *Record, operator*, OPERATOR'S NOTES — **and once inside
the very paragraph that carries the CAUTION**: *"The cell is not an
operator-replaceable item."* One paragraph, both nouns, one person. Nothing
anywhere says whether they are the same person, and the Portal section will use
the word twenty more times.

**PORTAL IS THREE OBJECTS.** The round aperture the front glass sits behind
(THE PORTAL LAW, canon, and a physical constraint on every centring decision) ·
the 65's diamond reveal · and the doorway, the `p` in MGK-VIIIp. All three are
canon. **A glossary entry has to choose**, and this section is written in the
third sense.

The other sixteen — voices 13 or 11, doors three or four, the forward display's
size, one lamp or two, which glass wakes first, detectors four or five,
diversions five/six/seven, engines "three plus one reserved" against seven
named, AMMMS and PHVDC not expanding, whether the record survives a power cut,
which units are which, the digit ring's year, the named-once list (MindsEye,
MGK-66, SCAT, NY8, DYN, MGK-2.5, MGK-65x), the `p`, which ASA, and FT6 standing
against FT3 — are in §12 of the glossary with every reading side by side.

---

## 3. STEP 3 — THE SECTION, PROPOSED. AND THE SHAPE SECOND-GUESSED.

### 3.1 Why *Overview / Theory / Troubleshooting* is the wrong shape

Mike named three parts. **The manual already has all three, as sections of the
whole document**, and building them again inside one Portal section would give
the manual two of each.

- **Theory of Operation is SECTION VII**, and *the video link's theory is
  already written there.* SP 7-14 is one of the three body paragraphs that
  exist. It says what the link is, that the far end is a station in its own
  right drawn on its own glass, that it is bi-directional by design, that the
  settings must agree before it opens, what happens to the graph window, and
  what the record does and does not hold. **It is done.** A Portal section with
  a Theory of Operation heading would either repeat it or contradict it.
- **Troubleshooting is SECTION IX**, with Table 9-1 TROUBLE CHART (9 rows, and
  the table is sized for about 12) and Table 9-2 REPORTED CONDITIONS. In this
  document type a fault goes in the trouble chart. A second chart in Section VI
  is where an operator would not look for it.
- **Overview**, in this document's own idiom, is a paragraph called **GENERAL.**
  — one paragraph, the way 4-1, 6-1, 8-1 and 9-1 already are. Not a part.

**And the thing he actually asked for is in none of the three.** *"Show you how
to turn it on and use it"* is an **operating procedure** — numbered steps, in
order, with what you should see. Overview is not a procedure, Theory is not a
procedure, and Troubleshooting is what you read when the procedure failed.

**THE REAL HOLE IS EXACTLY THERE.** Section VI OPERATING INSTRUCTIONS has
fourteen paragraph positions covering the menu, the ask cycle, all six answer
families, messages, settings, the operator record and functions not fitted —
and **not one position for the video link.** Section IV CONTROLS AND INDICATORS
has five positions covering the dial, the shutter, motion, sound and the lamp —
and **no drum, no source dial, no latch.** The theory is written and the
settings are written and **nobody can turn it on.**

So the recommendation is: **not a section. A procedure, plus rows in the tables
that already exist.**

### 3.2 What Ops proposes

**In Section VI, at 6-31 and up** (numbering cost stated in §3.3):

| Position | Covers |
|---|---|
| **6-31 THE VIDEO LINK.** | What it is in three sentences, and where the rest of it is: theory at 7-14, settings at Appendix B, controls at Table 4-1, faults at Table 9-1. This is the "Overview", and it is one paragraph. |
| **6-33 OPENING THE LINK.** | **The procedure, numbered.** Confirm the four communications settings agree with the far end (Appendix B) · select the feed · set the source · throw the latch · what should appear, and how long it should take. **This paragraph is the whole reason the run exists.** |
| **SP 6-34 Selecting a feed.** | The drum: every position is engraved whether or not it is available; one is selected at a time; a position that is not available does not arm and says so. |
| **SP 6-35 The source.** | LIVE and SEEDED, and what each is for. |
| **6-37 WHILE THE LINK IS UP.** | What the operator may and may not do — the upper display is not available to a program, signal shows in the graph window, absence of signal is not itself a fault. **Cross-references 7-14; does not repeat it.** |
| **6-39 CLOSING THE LINK.** | How you get out, and what the instrument does after. **A genuine hole** — 5-17 SHUTTING DOWN is also empty (`HOLES` D-9), and the museum's Portal has an `[X]` that nothing in the corpus names. |
| **Table 6-3 · FEED POSITIONS** | POSITION / CHANNEL / AVAILABILITY. This is where the engraved-but-inert positions become period-honest: a period manual lists the positions a control has and marks the ones not fitted. Same move as 6-29 FUNCTIONS NOT FITTED, on a different control. |
| **Figure 6-3 · VIDEO LINK, CONTROL ARRANGEMENT** | The call-out — or the photograph. See §4. |

**And in positions that already exist, rather than in a section of their own:**

- **Table 4-1 CONTROLS AND INDICATORS** gains rows for the drum, the two
  switches, the source dial and the latch. The table's columns are
  INDEX NO. / CONTROL OR INDICATOR / FUNCTION — **it was built for this.**
- **Table 9-1 TROUBLE CHART** gains rows: *no picture* · *picture but no
  signal* · *the latch will not throw* · *the link closes by itself.* Nine rows
  exist and the reserved depth wants about twelve.
- **Table 9-2 REPORTED CONDITIONS** gains the parity bias setting mismatch
  report — the one the manual already says *"names the condition and does not
  name the setting at fault."*
- **Appendix B** needs nothing. B-1 is written and the four settings are there.

**Nine new positions. Four table rows sets. One figure.** Against Mike's shape
it is the same size and it puts each fact where an operator of a 1965 instrument
would go looking.

### 3.3 The numbering cost, stated rather than discovered

Section VI's last principal paragraph is **6-29 FUNCTIONS NOT FITTED**, and
between 6-27 and 6-29 there is only **6-28**, which is a subordinate number.
**A principal paragraph cannot be inserted there**, and `MANUAL_PERIOD_MODEL`
§4.4 forbids renumbering to make room: *"Renumbering a manual because a
paragraph was inserted is a modern habit; the period reserved the numbers
instead."*

So the run takes **6-31 upward, and FUNCTIONS NOT FITTED stops being the last
paragraph of Section VI.** That is the honest price of the discipline the manual
chose, it is small, and Mike should approve it rather than meet it in a page
image.

### 3.4 Three alternatives considered and rejected

- **A new SECTION XIII.** `MANUAL_PERIOD_MODEL` §4.2 records that both
  instrument makers stop at six or seven sections and push the rest into
  appendices; ours is already at twelve. A thirteenth moves further from the
  model, and it would put an operating procedure outside OPERATING INSTRUCTIONS.
- **A new APPENDIX I.** The appendices in the model hold schedules, code lists
  and service offices — reference matter. A procedure in an appendix is a modern
  habit.
- **Section V.** Tempting, because Section V is called STARTING PROCEDURE. But
  its three positions are the three boot levels, and **the link is not a boot.**

### 3.5 The two questions Ops was told are Mike's, and where they land here

- **A boot that fails.** 6-33 needs a *"if nothing appears"* clause and Table 9-1
  needs the fault rows, and today the ballet always succeeds and has no failure
  ending. **The procedure can be written either way** — a period manual quite
  happily says *"if no picture appears within N seconds, see Section IX"* about
  a machine that never fails in practice. But if Friday wants a boot that fails,
  the trouble rows should be written to it rather than retro-fitted.
- **The television spec.** It is needed by **Figure 6-3**, by the Table 4-1 rows,
  and by any sentence in 6-31 naming what the feed lands on. The corpus has a
  bezel, an opening, a feed, eight engraved channels and a source dial — **and no
  receiver.** Nothing names the glass, its size, its type, its warm-up, its own
  controls or a catalogue number. Confirmed absent from both repos this pass.

### 3.6 One thing the section must not spend

Channel numbering is an egg and **the reason must not be explained on the
glass** (`portal.js`, R6). It is recorded once, in `reveal/ledger.json`. **A
Table 6-3 that lists POSITION / CHANNEL / AVAILABILITY prints the numbers, which
is right, and must not print the reason, which would spend it.** Flagged so a
later round writing that table does not helpfully add a REMARKS column.

---

## 4. STEP 4 — ONE PHOTOGRAPH TAPED IN

### 4.1 Does the generator have a mechanism for an image on a page?

**It has the frame, the cut, the shadow and the caption. It has never had the
image.**

The block kind is `("F", label, caption, h_mm)` →
`emit_figure()` (`manual_structure_build.py:1035`) →
`doc.paste(rows, col0=5, ncols=COLS-10, angle)` →
`draw_paste()` (`:1480`) at render time. What `draw_paste` already does, all of
it deterministic from `SEED`:

- lays a **photographic print** at value 244 on 252 paper;
- cuts all four edges with `hand_line(..., wob=0.9)` — *"a scissor cut is not
  perfectly straight"*;
- outlines the print at value 132 and blurs 0.6 / 0.8;
- **rotates it**: `stable("F", label)` gives one figure in six a ±0.9–1.1° tilt
  and the rest ±0.17°;
- **pastes a drop shadow first** — the alpha blurred at radius 4, value 206,
  offset +4 px right and +5 px down;
- then strikes `[ ART REQUIRED ]` over the middle at density 0.80.

**Ten figure frames exist**, heights 66–96 mm, in Sections I, IV, V, VI, VII, X
and Appendix A. Both the LIST OF ILLUSTRATIONS and the index resolve to the page
each one actually landed on, mechanically.

**What is missing is one thing: nothing opens a file.**

### 4.2 What an image would cost

- **Carrying it:** an optional `img` on the `F` tuple, through `emit_figure` into
  a new layout op and into `draw_paste`. ~15 lines.
- **Fitting it:** the box is fixed by `h_mm` and the full text width, so either
  the image is cropped or the height comes from the file. **The height must come
  from the file.** Choosing a ratio before measuring the files is exactly the
  defect the museum's 2026-08-17 round caught, where a chosen `4/3` would have
  cropped 44 % off two portrait objects.
- **Making it period:** this is the real work and the only part that can look
  wrong. A photographic print pasted onto a mechanical and shot through a process
  camera comes out a **halftone**, and the generator has no halftone — it has a
  glyph atlas, a strike model and copier dirt. A screen plus a tone curve is
  perhaps 60–90 lines, and it wants an eye on it.

**Total for a pasted-in photograph: ~100 lines, one of which is interesting.**

### 4.3 What tape would cost — and why it is a ruling, not a cost

Tape corners are cheap: four translucent quadrilaterals lighter than the paper,
soft-edged, each at its own small angle, drawn **over** the print and overlapping
onto the sheet. ~25 lines, same machinery as the cut edge.

**But taped and pasted are two different objects, and the generator's own
doctrine sentence says which one it makes:** *"figures sitting in hand-cut
rectangles **pasted** onto the mechanical."* That is engineering putting a
picture in the artwork **before** the camera — so it halftones, it greys, it
belongs to the document.

**Tape says somebody stuck a real photograph onto this copy afterwards, by
hand.** Which means:

- it would **not** halftone — it is a photographic print sitting on top of a
  photocopy, and it would be the only object on the page that is not a copy;
- it is the same register as a handwritten margin note, which the corpus already
  wants (`BOM1` S15);
- and it probably should **not** occupy a reserved `[ ART REQUIRED ]` frame,
  because a reserved frame is evidence that engineering meant a picture to be
  there. A taped-in photograph belongs beside a paragraph, or over something.

**That is the choice, and it is Mike's.** Both are buildable; they are different
stories about who put the picture in the book.

### 4.4 What could be it — measured, not assumed

Seven files in `weird-baby-robots/reference/photos/`, opened and measured this
pass:

| File | Size | What it actually is | Obfuscation law |
|---|---|---|---|
| **`top_monitor.png`** | 2048×1536 | **A real photograph of the physical unit's upper display**, cropped at the hood. The three monitor windows are legible — the rolling code, **`TEST` in the graph window**, and `Waiting for User Input` in the status window. | **COMPLIANT.** No traceable silhouette (Art. 1) · cut at the hood panel (Art. 2) · proves the machine without spending the reveal (Art. 3) · colour master (Art. 4) · needs a provenance row (Art. 5). |
| `front_screen.png` | 2048×1536 | The lit front glass. **M2 records it is MIRRORED — every word on the screen backwards.** | would need the mirror ruled on |
| `unit_crt_base.webp` | 1294×924 | The whole unit and its hood, front face, `MGK-VIIIp / The Informer / ABEAL`, the round portal aperture visible. | **FAILS Article 1** — the full silhouette is traceable against the background. Also already baked B&W. |
| `monitor_base_markers.png` | 3000×2400 | Not a photograph — a marker/registration asset. | n/a |
| `MGK-TWIN_MONITOR_CLOSE_UP_MARKERS.png` | 3000×2400 | Not a photograph — a bezel with knocked-out rectangles and red registration marks (M7's own finding). | n/a |
| `MGK-TWIN_MONITOR_SCREEN_BEZEL.png` | 3000×2400 | Compositing asset. | n/a |
| `MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png` | 3000×2400 | Compositing asset. | n/a |

**ONE CLEAN CANDIDATE, AND IT IS ALREADY THE RIGHT SUBJECT FOR A FRAME THAT
EXISTS.** `top_monitor.png` is a photograph of the diagnostic monitor's three
windows — which is precisely **Figure 7-3 · UPPER DISPLAY, DIAGNOSTIC MONITOR,
WINDOW LAYOUT**, reserved at 70 mm and empty. It also carries **`TEST` in the
graph window**, which is Egg 1 — the window that has read TEST since the factory,
and the thing paragraph 5-15 COMPLETION OF THE FACTORY TEST points at. A
photograph of an egg, in a frame the structure already reserved, is a better
first photograph than one commissioned for it.

**AND THE HONEST PART: there is no photograph of the Portal.** Nothing in either
tree shows the video link, the feed control, a far end or a receiver. The
museum's channel-4 close-up (`public/held/robots/reference/photos/
MGK-TWIN_MONITOR_CLOSE_UP.png`, live on the drum since 2026-08-12) is a composite
inside the twin-monitor bezel, not a plate. **If the photograph must be of the
Portal, it does not exist yet and is capture work.** If it may be of the machine,
`top_monitor.png` is ready today.

---

## 5. WHAT WAS TOUCHED

- **Read-only across both repos.** No generator run, no PDF rebuilt, no page
  images regenerated, nothing in `src/`, nothing in `tools/`.
- **Two files written:** this report, and
  `weird-baby-robots/docs/MANUAL_VOCABULARY-20260819.md`.
- Both repos were clean at the start of the session and neither has had a
  tracked file modified: museum at `e90c657`, robots at `fdea38e`.
