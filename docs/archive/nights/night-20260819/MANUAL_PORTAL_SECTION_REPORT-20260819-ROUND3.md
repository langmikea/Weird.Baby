# THE PORTAL SECTION PROPOSED · THE RED-INKED PAGE SCOPED (2026-08-19, round 3)

**Status: OPS. Nothing built. One comment corrected in
`tools/manual_structure_build.py` (my own error, §0).** Follows rounds 1 and 2.

---

## WAITING ON MIKE

**PART 1 — the section**

1. **DO "1, 2, 3, 4" MEAN THE FOUR SETTING SWITCHES OR THE FIRST FOUR CHANNELS?**
   Both are numbered 1–4 in the museum today — B-1 numbers its four settings
   `1 PARITY · 2 DUPLEX · 3 WORD · 4 STOP`, and the feed drum engraves channels
   1–8. It decides what Table 4-3 has rows for. Ops will not guess it.
2. **THE BOX IN SECTION IV, OR SECTION XII?** Ops recommends IV with its own
   figure and table. Reason and the alternative in §1.3.
3. **THIRTEEN POSITIONS, NOT NINE.** The hardware ruling turns what were rows in
   an existing table into a figure and a table of their own. §1.5 has the lever
   if he wants it back to nine.

**PART 2 — the red-inked page**

4. **THE ROBOTS WING IS BLACK AND WHITE BY YOUR OWN STANDING LAW, AND RED INK
   WILL RENDER GREY.** `.ex-root[data-exhibit="robots"] img:not([data-colour])`
   → `grayscale(1)`, scoped by wing on purpose so a new surface is monochrome by
   construction. **Nothing in the museum declares `[data-colour]` today.** The
   marked page would be the first, and that is your B&W law, so the exception is
   yours. §2.1.
5. **"FILL NOTHING NAKED" READS TWO WAYS AND THE PUZZLE TURNS ON IT.** Either
   *write no value in* — or *leave no blank unmarked*. **Striking ODD leaves
   EVEN, which supplies a value and spends PZ-a.** §2.5.
6. **THE ENTRY NAMES THREE SCANS IN YOUR OWN WORDS.** Record 003's DETAILED
   REPORT lists `SCAN 07 · SCAN 11 · SCAN 31`. **So the fourth attachment must
   not be a scan** — or ruling 10 forces an edit to text the museum has already
   shown. §2.6.
7. **THE INITIALS AND THE MARGIN WORDS SHOULD BE YOUR ACTUAL HAND, SCANNED.**
   Two minutes with a red pen and a phone. Code can draw the strike-throughs and
   the stamp convincingly; it cannot draw *your* initials. §2.3.

---

## 0. A CORRECTION TO MY OWN NOTE FIRST

The 3-14 reservation I wrote into the generator last round said subordinates are
*"the intervening even"* numbers. **That is wrong.** Measured off all fourteen SP
positions: **1-7, 3-9, 6-7, 7-11 are odd subordinates.** The real rule is that a
principal takes an odd number, its subordinates take the **consecutive** numbers
straight after it — odd or even alike — and the next principal resumes at the
next odd number that leaves a gap. 3-14 is still the first subordinate under
3-13, so the reservation stands unchanged; the reason I gave for it did not.
Comment corrected, `ast.parse` clean, output byte-identical.

---

# PART 1 — THE SECTION

## 1.1 The INDEX NO. objection — does it fall?

**It falls for the box, and it does NOT put the box into Table 4-1. Both halves
matter.**

**It falls,** because the objection was never about hardware-versus-software as
such. It was that `INDEX NO.` is a **call-out number keyed to a figure**, and a
software control has no place on a plate to point a leader line at. An interface
box is a face with controls screwed to it. It has index numbers the moment
somebody draws it.

**But it cannot join Table 4-1,** because that table is keyed to **Figure 4-1
"CONTROLS AND INDICATORS, FORWARD AND UPPER"** — the instrument's own two faces.
The box is wired *to* the instrument and is on neither face. Putting its controls
in Table 4-1 means either redrawing Figure 4-1 with a second object in it and
falsifying its caption, or printing index numbers that point at nothing.

**So: its own figure and its own table, inside Section IV.** Figure 4-2 is free
(only 4-1 exists) and Table 4-3 is free (4-1 and 4-2 are taken). Nothing existing
is touched. This is also period practice — HP 465A draws front and rear panels as
separate figures rather than cramming one plate.

**And it settles where the screenshot goes.** Q3's photograph is a picture of the
box's controls, so it is **Figure 4-2**, not a figure in Section VI. A call-out
plate over a photograph — numbered leader lines onto a real image — is exactly
what Table 4-1's `INDEX NO.` column already assumes exists.

## 1.2 How a software Feed Control and a hardware interface box sit together

**The manual has documented this exact pair since Section IV was written, and the
answer is to do it the same way again.**

The **rotary dial** and the **shutter** are hardware — real pins, `D4` and `D3`.
The **menu system** is the program that reads them. The manual splits them
without strain:

- **4-3 THE DIVISION OF CONTROL** — the hardware half. *The dial moves and does
  not choose; the shutter chooses.* What the controls **are**.
- **6-3 THE MENU SYSTEM** — the software half. What the program **does** when
  they move.

**The interface box and the Feed Control are the same relationship, one object
further out.** The box's switches, its channel selector, its power control and
its shake control are hardware, wired to the device under test: they go in
**Section IV**, on a plate, with index numbers. The **Feed Control** is the
program those controls drive — what a channel *resolves to*, which feeds exist,
which of them will arm: **Section VI**, as a function, exactly beside the menu
system.

Said in one line for the manual's own register: **the box is the face and the
Feed Control is the function; the operator's hand is on the box and the answer
comes from the program.** Nothing in either ruling has to bend for that.

**One consequence worth having on the record.** *"Device under test"* makes the
MGK-VIIIp the DUT and the whole arrangement a **test set** — which is consistent
with channel 8 being engraved `TEST BENCH`, and it is why the box reads as bench
equipment rather than as part of the instrument's body. TM 11-5556 gives that
kind of thing its own **Section II, SPECIAL TEST EQUIPMENT AND TOOLS**. Our manual
has no such section and Ops is **not** proposing one — recorded so a later round
does not discover the idea and think it is new.

## 1.3 Section IV, or Section XII?

**Ops recommends Section IV.** The alternative is real and should be named
rather than left implicit.

- **Section IV (recommended).** An operator reading *how do I turn this on* must
  not be sent to the back of the book to find out what the switches are. Section
  IV is CONTROLS AND INDICATORS and these are controls and indicators.
- **Section XII ACCESSORIES AND OPTIONAL EQUIPMENT.** Defensible — the box is
  separate equipment with its own existence — but Section XII's two tables are
  `CONFIGURATION / ACCESSORY / REMARKS` and `EQUIPMENT / CATALOG NO. / REMARKS`.
  Those are procurement tables. They say a thing exists and what it costs; they
  do not say what a switch does.

**Either way the box needs one row saying it exists as an item**, and that is a
row in a table that is already there rather than a new position: **Table 1-1
CONFIGURATIONS AND ITEMS SUPPLIED** if it ships with the unit, or **Table 12-2
OPTIONAL EQUIPMENT** if it does not. One row, one ruling.

## 1.4 The proposal — paragraphs, numbers, one line each

**SECTION IV — the box. What the controls ARE.** *(4-11 is the next free
principal; 4-12/13/14 its subordinates, on the 7-9 → 7-10/11/12 precedent;
Figure 4-2 and Table 4-3 are both free.)*

| Position | One line |
|---|---|
| **4-11 THE INTERFACE BOX.** | What it is, what it is wired to, and that the box is worked but the answers come from the Feed Control at 6-33. |
| **Figure 4-2 · INTERFACE BOX, CONTROLS AND INDICATORS** | The call-out plate — the screenshot of Q3, with numbered leader lines. |
| **Table 4-3 · INTERFACE BOX CONTROLS AND INDICATORS** | `INDEX NO. / CONTROL OR INDICATOR / FUNCTION` — the same three columns as Table 4-1, one row per control. |
| **SP 4-12 The setting switches.** | The four numbered switches: what they are for, that all four must agree with the far end, and that their values are in Appendix B. **Names them; supplies nothing.** |
| **SP 4-13 The power control.** | What it does and what it does not do — and it finally gives 5-17 SHUTTING DOWN something to point at. |
| **SP 4-14 The shake control.** | Requests a determination at the instrument; cross-references 4-5 MOTION INPUT rather than restating it. |

**SECTION VI — the link and the program. What the controls DO.** *(6-31 is the
next free principal after 6-29; Table 6-3 is free.)*

| Position | One line |
|---|---|
| **6-31 THE VIDEO LINK.** | What the link is in three sentences, and where the rest of it lives — theory at 7-14, settings at Appendix B, controls at Table 4-3, faults at Table 9-1. |
| **6-33 THE FEED CONTROL.** | The program the box drives: a feed is selected, one at a time, and a position that is not available does not arm. The pair to 6-3. |
| **Table 6-3 · FEED POSITIONS** | `POSITION / CHANNEL / AVAILABILITY` — every engraved position listed, the unavailable ones marked, in the manner of Table C-2. |
| **6-35 OPENING THE LINK.** | The procedure, numbered. **Stops exactly where B-1 stops.** |
| **SP 6-36 Where the far end does not answer.** | The honest half of *if nothing appears* — 7-14 already supplies the sentence. |
| **6-37 WHILE THE LINK IS UP.** | The upper display is not available to a program; signal shows in the graph window; the record holds that a link was opened and for how long. |
| **6-39 CLOSING THE LINK.** | How the operator gets out, and what the instrument does after. |

**EXISTING TABLES THAT GAIN ROWS — no new positions.**

| Where | Rows |
|---|---|
| **Table 9-1 TROUBLE CHART** | *no picture · picture but no signal · the link closes by itself · the box answers nothing.* Nine rows today against a reserved depth of about twelve. |
| **Table 9-2 REPORTED CONDITIONS** | the parity bias setting mismatch report — the one B-1 already says *names the condition and does not name the setting at fault.* |
| **Table 1-1 or Table 12-2** | one row: the box exists as an item. §1.3. |

## 1.5 Thirteen, not nine — and the lever if you want nine

Round 1's nine assumed the box's controls were **rows in Table 4-1**. The
hardware ruling makes them a figure and a table of their own, which is the right
answer and costs four positions. **13 new positions: 6 in Section IV, 7 in
Section VI**, plus rows in three existing tables.

**If that is too much, the trim is two folds and Ops would make them in this
order:** SP 4-13 and SP 4-14 fold into 4-11 as sentences (**−2**), and 6-31 folds
into 6-33 (**−1**) — leaving **ten**. Below ten something a reader needs starts
going: the last thing Ops would cut is 6-39, because *how do I get out* is
already an unanswered question elsewhere in this manual (5-17).

## 1.6 The B-1 discipline, held

Every position above that touches the four settings **names them and withholds
their values**, exactly as the written paragraph does. Concretely: SP 4-12 says
what the switches are for and sends the reader to Appendix B; 6-35's procedure
says *confirm the four agree with the far end* and stops; Table 4-3's FUNCTION
column describes each control's job, not its setting.

**The one thing that would spend PZ-a is a worked example**, and there is none in
the proposal. Flagged so a later round writing the prose does not add one as a
kindness.

---

# PART 2 — THE RED-INKED PAGE

## 2.1 The wing is black and white by your own law — this is the first ruling

`Exhibit.css`:

```
.ex-root[data-exhibit="robots"] img:not([data-colour]),
.ex-root[data-exhibit="robots"] .vp-qcard-still:not([data-colour]){
  filter:grayscale(1) contrast(1.03)}
```

Your ruling above it: *"Robots is B&W ONLY — the site-wide photo law applies to
the W.B R wing without exception (the plates included)."* And it is **scoped by
wing rather than by component on purpose**, so that a surface added next month is
monochrome by construction and nobody has to remember.

**A red-inked page in the robots wing renders grey — thumbnail and reader
alike.** The marks would be indistinguishable from the printed rules, and the
whole point of the exercise is lost on the glass while looking perfect on disk.

There is an escape hatch, and the comment says what it is for: **`[data-colour]`
is "deliberately something a surface must ASK for rather than something it gets
by being new. Nothing declares it today."**

**So the marked page would be the museum's first `[data-colour]` declaration.**
Ops will not take that on itself — it is your B&W law. There is a good argument
for the exception, and it is worth having in front of you: **the ink is the only
thing in the wing that is not a photograph of a 1965 machine.** It is somebody's
pen, now, and the law was written about *photographs of our own machine*. But
that is an argument, not a ruling.

**If the answer is no**, the mark still works — it just has to be legible by
*shape* rather than by colour: heavier stroke, and the PRELIMINARY stamp doing
the work that red would have done. Say which and Ops builds to it.

## 2.2 What red costs the generator

**The chain is greyscale end to end and there is no cheap way to make it
colour — but there is a cheap way to get red ink, and it is not the same
thing.**

What is single-channel today: the glyph atlas, the ink layer, the paper layer,
the supersampled rule layer, the numpy compositing (`out = paper − ink·field·
(paper−6)`), the copier S-curve, the dirt pass, both rotations' scalar
`fillcolor`, and the PDF embed (an `"L"` image goes in as DeviceGray).
**Converting all of that to RGB touches the strike model, the rule
supersampler, the dirt pass and the tone maths — and it would change every page
in the book, including the sixty that have no red on them.** That is the
expensive answer and Ops does not recommend it.

**The cheap answer is one function at the end, and it leaves every clean page
byte-identical.**

1. Render the page exactly as today → an `"L"` image.
2. `page.convert("RGB")`.
3. Draw the pen strokes into their own alpha mask, supersampled — the rule
   layer already works this way at `RULE_SS = 5`.
4. Composite the red through that mask with a multiply-style blend so the
   paper's grain and the copier's field still read through the ink.

**Roughly 60–90 lines, touching nothing that exists.**

**AND THE INSERTION POINT IS NOT ARBITRARY — it is a claim about what happened
to the sheet.** The real order is: typed → process camera → copier → **somebody
writes on the copy** → scanned. So the pen goes **after** the copier S-curve and
the toner dirt (that dirt was on the copy before the pen touched it) and
**before** the final Gaussian noise and the scan skew (the pen was scanned too,
and it must skew *with* the page). A mark drawn after the scan rotation would sit
at a different angle from every printed line on the sheet and read instantly as a
digital overlay.

**Two smaller costs, named:** the PDF page becomes DeviceRGB and roughly triples
that page's bytes (the whole PDF is already ~120 MB losslessly at 63 pages; the
`--jpeg` flag exists if that ever matters), and the museum's WebP derivative
carries colour, which it already supports.

## 2.3 Hand-drawn versus drawn-by-code

**A straight struck line reads as printed because it is straight, it is one
weight, and it stops where the type stops.** Seven things make a stroke read as a
ballpoint, and the generator already has the beginnings of two of them
(`hand_line`'s wobble, used for the hand-ruled table verticals and the scissor
cut):

1. **It over-runs.** A pen starts before the word and finishes after it. A
   printed rule stops on the character cell. This alone does most of the work.
2. **It is not parallel to the type.** A strike-through crosses the baseline at
   one to four degrees, and a different angle on every stroke.
3. **Its error is low-frequency, not noise.** A hand line **bows** — a slow curve
   of half a percent to two percent of its length. Per-pixel jitter reads as a
   bad printer, not as a hand. This wants two or three control points and a
   curve through them, not `wob`.
4. **Pressure varies, and width and darkness vary together but not identically.**
   Ballpoint starves at the start (the ball has to pick up ink) and pools where
   the pen slows — at direction changes and at the lift.
5. **The ends are not square.** It tapers in and usually hooks out, because the
   pen is still moving when it leaves the paper.
6. **The colour is not one red.** Heavy passages go darker and slightly toward
   maroon; light ones go pink-grey. So the composite modulates alpha *and* nudges
   hue, or it looks like a highlighter.
7. **Ink sits ON the paper.** It is not toner — it should not take the copier's
   S-curve, and the paper grain should read faintly through the thin parts. This
   is why §2.2 puts the pen after the copier rather than through it.

**THE STAMP IS EASY. THE HANDWRITING IS NOT.** A rubber `PRELIMINARY` is a solved
problem — a bold condensed face at 5–8 mm cap height, 10–25 % of the coverage
eroded by a noise mask (rubber does not ink evenly), soft edges, rotated 3–12°,
overlapping other content. **About 30 lines and it will pass.**

**Initials and margin words will not.** Code-drawn letterforms look drawn, a
handwriting font looks like a font, and a stroke model is expensive and usually
worst of the three. **Ops recommends the real thing: write them yourself in red
ballpoint on white paper, photograph it, and the generator keys them out and
composites them.** Two minutes of your time. It removes the entire "does it read
as drawn" risk from the hardest part, **and it is genuinely your hand on your own
machine's manual, which is the only version of this that is true.** Ops drafts
the words (§2.5); you write them.

## 2.4 The page, or the derivative?

**The page. And the mechanism should produce a second artifact rather than a
modified one — which is Ruling B falling out of the build instead of being
enforced by discipline.**

**Marking the derivative is the dishonest one, and it is dishonest in a way this
house has already been bitten by.** Ruling 14 says the 300-dpi masters live in
the robots repo and the museum publishes a 1700×2200 WebP derived from them. If
the marks exist only in the WebP, then **the published file carries content its
master does not have** — the exact class of defect the obfuscation law's Article
5 exists to prevent (*source file, timestamp, and derivation must be
recorded… an asset nobody can trace is a rumour*), and the same shape as *"a
regenerated file is not a suspicious file."* It is also, precisely, a retouch of
the file the museum has already shown — Ruling B in a different directory.

**Marking the page keeps provenance by construction:** deterministic from `SEED`,
in version control, reproducible, and the WebP stays a plain downscale as it
always was.

**The one wrinkle, and its answer.** The manual itself must not become a marked
document — the marks are on **one copy**, not on the printing. So the generator
gains a marked-copy output: `pages/page-47.png` stays exactly as it is today, and
`pages/marked/page-47.png` is a second render of the same page with the pen on
it. Two files, both real, both from the same master, neither a retouch of the
other. **The museum derives its fourth attachment from the second file.**

Safe by construction on the random stream, too: `rnd` is seeded per page
(`SEED + pno*7919`), pages share nothing, and the pen pass runs last — so a
marked page is identical to the clean one up to the moment the pen lands.

## 2.5 What the marks say — drafts only

**FIRST, THE AMBIGUITY, BECAUSE EVERYTHING ELSE DEPENDS ON IT.** *"Fill nothing
naked"* reads two ways:

- **(A) write no value in** — leave the choices unresolved;
- **(B) leave no blank unmarked** — resolve them.

**They give opposite pages, and (B) spends PZ-a.** The block is four either/or
pairs; striking `ODD` leaves `EVEN`, which *is* supplying a value. Two of the
four settings answered in red and the puzzle is most of the way solved by a
picture. Ops reads your own B-1 discipline — *the values are not given in this
manual* — as pointing hard at (A), but it is your sentence.

**Drafted on reading (A). None of this is a fact about the machine; all of it is
Ops asking you something in the open, which is what you said the channel is for.**

**Strike-throughs — things that are stale or wrong, never values:**

| # | Strike | Margin, in red |
|---|---|---|
| 1 | *"The values are not given in this manual."* | **"nor anywhere else"** — makes the absence deliberate instead of an omission, spends nothing, and is funny in the manual's own deadpan. **Ops' first choice.** |
| 2 | the word **"Polarity"** in *"Polarity, Clarity and Inclination"* | **"how many? five or six"** — a real open conflict (C-2), asked on the page, in character. |
| 3 | *"Four settings."* | **"4 only"** with a rule under it — emphasis rather than correction. Weakest of the three; it strikes something that is true. |

**A caret and a few words, no strike:**

| Where | Words |
|---|---|
| beside the four-line block | **"values on the installation record"** — restates what the page already says, points at a document that does not exist yet, supplies nothing. |
| head of the appendix | **"see me before issue"** — pure channel, zero content, and it is what a pen holder actually writes. |
| foot | **"guard fitted 3/65"** — *invents a date and a fact.* **Listed to be rejected**, because it is the shape a later round will reach for and it breaks Doctrine 12. |

**The stamp:** `PRELIMINARY` in red, over the head of the appendix, rotated,
partly across the rule. The manual's own revision line already reads
`REV. - / PRELIMINARY`, so the stamp agrees with the document rather than
asserting anything new.

**The initials:** yours, in your hand, with or without a date — your call, and
the date is the one thing on the page that would be a checkable specific.

**Ops will not choose among these**, and the second column exists so you can
strike the ones you do not want the way the page is about to be struck.

## 2.6 The attachment row — and the collision that decides its name

**RECORD 003 NAMES THREE SCANS IN YOUR OWN WORDS.** Its DETAILED REPORT reads:

```
Manual Pages Recovered
  SCAN 07 - POWER SYSTEM
  SCAN 11 - VID-LINK
  SCAN 31 - PARITY BIAS
```

**So the fourth attachment must not be a scan.** Call it `Scan 32` and ruling 10
(*what's said matches what's shown*) forces a fourth line into that list — which
is editing text the museum has already published, and Ruling B says it does not
do that.

**It also happens to be true.** The marked copy was not recovered from the ZIP
and was not filmed with anything. It is a page that came back with handwriting on
it — a different object with a different provenance. Ruling 12's own test is
*"the set of pages that were filmed together because they belong together"*, and
this belongs with nothing.

**PROPOSED ROW — fourth and last, after Scan 31:**

| | |
|---|---|
| `title` | **"Marked copy 01 - Bias settings"** |
| `source` | `ABEAL 8P-OMI-1` — same document, correctly |
| `pages` | 1 |
| `plates` | `/robots/manual/marked-01-a.webp`, label *"Bias settings, returned marked"* |

**Why that filename.** Ruling 11's practical half is that **no public address may
assert a page of the manual** — which is why the scans are `scan-NN`. A name like
`marked-b1.webp` would assert `B-1`, a real paragraph number. `marked-01` asserts
a sequence of marked copies and nothing about the document. And you have said
this is a recurring channel, so it wants a number from the first one.

**Why last.** The three scans run 07 → 11 → 31, ascending, which is reel order. A
non-scan sits after them and reads as a different class of thing, which it is.
Ruling B is served by the two being in one list, not by them being adjacent.

**Two supporting rows, both mechanical:** the asset gets a row in
`provenance/assets.json`, and `reveal/ledger-declare.mjs`'s `MANUAL_PAGE(47, …)`
gains the second asset — a manual page may already be delivered under more than
one name (page 33 carries two), so nothing new is invented there.

**AND ONE THING TO CHECK ON THE GLASS RATHER THAN ASSERT.** The report names
three scans and the rail would show four rows. There is **no count badge** —
Doctrine 23 refused one, so no number is printed anywhere — and the fourth row's
title does not begin with "Scan". Ops believes that reads clean. **It should be
looked at on the page before it ships, not reasoned about**, and Ops will lap it
at 390 px and 1280 px when the build happens.

---

## WHAT WAS TOUCHED

- `tools/manual_structure_build.py` — the 3-14 comment corrected (§0). Comment
  only; `ast.parse` clean; generator not run.
- Nothing else. No prose written, no positions added, no marks drawn, no asset
  created. Museum `npm run lint` unchanged at **9 / 8 = baseline**.
