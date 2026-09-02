# THE CANON — run report, overnight 2026-08-19/20

**Deliverable: `weird-baby-museum/docs/canon/` — 15 markdown files, 5,632 lines,
one complete index, and a card on the Ops Desk.**

Read the deliverable, not this. This file records what was done, what was
verified, where it stopped, and what a future session must know.

---

## 1 · WHAT IS WAITING ON MIKE

**Nothing in this round is waiting on him.** The catalogue resolves nothing and
asks nothing; it is a reference.

**What it makes available to him, in one place, is the thing he asked for:**
**24 conflicts**, each with every account, its source, what depends on it, and
**what a ruling costs either way** — so that a ruling in the morning is a word
rather than a round.

---

## 2 · THE SHAPE

| file | what |
|---|---|
| `INDEX.md` | complete A–Z, the file map, the catalogue's own rules |
| `CONFLICTS.md` | K-01 … K-24 |
| `HOLES.md` | H-01 … H-28 |
| `BELL-103.md` | the integration, recorded as canon |
| `FAILURE-MODES.md` | the four, checked against the twin, costed |
| `01-WORLD` … `10-LAWS` | ten subject files |

**One card on the Ops Desk → `docs/canon/INDEX.html`.** Fourteen cards for one
catalogue would bury the eleven instruments the desk exists to launch
(Doctrine 25, applied to a launcher); the index is complete by construction, so
it is the door.

---

## 3 · GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 8 warnings = baseline** |
| `npm run build` | **green**, 660 ms |
| `npm run provenance:gate` | **PASS** |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** |
| `npm run instory:gate` | **PASS** |
| `npm run docs:numbers` | **PASS** |
| broken internal links across the 15 rendered pages | **0** — every href resolved against every id, mechanically |
| page overflow, 15 pages at 390px and 4 at 1280px | **0 everywhere** |
| `<pre>` blocks pushing the page | **0** — all 16 scroll inside themselves |
| bare tables (outside the `.tw` scroller) | **0** |
| broken images | **0** |

**Nothing in `src/` was changed. Nothing was committed, pushed or deployed.
Nothing in either repo was written except `docs/canon/`, the desk card, and the
renderer changes named in §6.**

---

## 4 · THE TWO THINGS TO BE RECORDED, NOT BUILT

### 4.1 · THE BELL 103 INTEGRATION — `docs/canon/BELL-103.md`

**Recorded as canon. Nothing built.** Eight places found where the corpus had
already, independently, said the same thing. The strongest three:

1. **FULL duplex IS SP 7-14, in settings.** *"The link is bi-directional by
   design. Assume the far end is attended."* Bi-directional-by-design and FULL
   are one statement in two registers, and *assume attended* is what FULL duplex
   is FOR — half duplex is what you choose when only one end will talk.
2. **300 BAUD is already on the glass, three times, verbatim from Mike.**
   `AUX CHANNEL OPEN 300 BAUD` / `ACK. LINK 300 BAUD CONFIRMED`. **Bell 103 IS
   the 300-bit-per-second standard** — the same fact arrived at from the other
   direction. **It also gives FT3 an argument it did not have** (K-18):
   `300 BAUD` is a checkable specific *that checks out*.
3. **The manual reasons its way to the right answer for the right reason.**
   *"…does not name the setting at fault, there being no means at this end of
   knowing which of them is wrong."* A 103 dataset genuinely cannot tell you —
   it has no channel to ask on, because the channel is the thing that is broken.

Plus: **CARRIER is already the vocabulary** · **7 BIT agrees with everything the
machine can draw** (the answer tables press `_` into service as a line-break
control) · **a 1965 document using a 1962 standard is exactly right** · **DTMF
in the dial sound is period-plausible by accident** (1963) · and **Record 005
already states the fact as a story beat** — *"A period operator would have known
this without being told."*

**AND ONE MISMATCH, REPORTED AND NOT FIXED.** `FX_dial90()` is a **1990s modem**
by its own comment and by the Speakable Index, on a **1962** link. Its 2250 Hz
warble is within 25 Hz of the Bell 103 answer mark; its "answer tone" at 1200 Hz
is not one; the multi-tone warble a listener reads as *modem* is a rate
negotiation from thirty years later, and a 103 link has no rate to negotiate.
**The one place the corpus's sound and its settings disagree.**

**STATUS: RULED AND BUILT, NOT YET PUBLISHED.** `marked-01-a.webp` and Record
003's fourth attachment are **both in the working tree, uncommitted.**

### 4.2 · THE FAILURE MODES — `docs/canon/FAILURE-MODES.md`

**Ops' reading of the four recorded for ruling. Nothing built, nothing
proposed.**

**THE HEADLINE ANSWER TO "CAN THE TWIN EXPRESS ANY OF THESE": NO — none of it
exists.** The strings `parity`, `duplex`, `stop bit`, `7 BIT`, `8 BIT`,
`far end` and `Bell` return **zero matches** across 10,802 lines outside three
unrelated comments. No settings state, no far-end model, **no video link at
all**, no link-failure path.

**And `FT_Dance()` is a handshake that cannot fail** — `FT_Seg_Plan()`
guarantees one stall and one fail-and-retry every run, and **every path
recovers.**

**COSTS, cheapest first:**

| mode | cost |
|---|---|
| **DUPLEX** | **cheapest by a wide margin** — a string transform before print. No model needed. Risk: a doubled line overflows T's five-row fitter, unmeasured. |
| **STOP** | two existing calls in sequence — one glyph, then `T_Hiss`. **Sound already exactly right.** Risk: it looks like the existing *nobody answered* beat, and the manual is explicit those are different things. |
| **WORD** | deterministic mapping, trivial — **and it hides a font problem**: the three faces are bitmap tables cut for printable ASCII, so a garble above 0x7F **has nowhere to land.** Either map back into range (a taste decision) or cut new glyphs (asset work). |
| **PARITY** | **render cheap, model is the whole cost.** *Every character fails its check* requires the machine to be CHECKING, which needs a receive path, which is the video link, which is not built. **The most faithful of the four and the most expensive.** |

**FOUR FINDINGS THAT CHANGE THE DESIGN AND WERE NOT IN THE BRIEF:**

- **THE NO-DEAD-WOOD LAW governs this.** *"NO fake reports anywhere unless Papa
  specifically asks."* A canned animation on a timer would look identical in a
  screenshot and would break a standing law. **The ask already satisfies it** —
  *reflect WHICH switch is wrong* is the law stated forward.
- **FT3 does not bite, and that is worth knowing.** These are BEHAVIOUR, not
  statement. **The theatre is the FT3-safe route** where an error message naming
  a setting would not be.
- **THE STORY HAS ALREADY PLACED THE SWITCHES, at the FAR END.** Record 004:
  *"Four toggle switches sit under a hinged guard, unlabelled"* — on the far
  end's console. Record 005: *"Four toggles. Sixteen combinations."* **Both post
  this week.** A design that put them on the instrument would contradict a
  published page.
- **The strict reading of B-1 may forbid the theatre entirely:** *"the
  instrument does not open the link"* — no link, therefore nothing to garble.
  **Two readings, two different builds, nobody has ruled.**

---

## 5 · WHAT THE ROUND FOUND THAT NOBODY ASKED FOR

- **K-02c — two five-value scales sharing indices without sharing names**, and
  the engine compares them numerically. **Three of five slots carry two
  different words for one number.** Measurable in `BIAS.ino:29-55` and written
  down nowhere else.
- **K-06 — the published Record and the working corpus disagree about the
  Everyman.** Record 003 published `THE EVERYDAY` (R3's ruling); the 2026-07-22
  registry rewrite, the persona set and the built content directories all say
  `Everyman`. **Neither is wrong; nobody has said they are the same decision.**
- **Doctrine 18 bears on K-08 and K-09 in a direction that is easy to miss.**
  *"The real firmware is not evidence about a 1965 machine at all."* The fit
  report lets the firmware WIN both. **Register row N-i**, already open — the
  catalogue now says so at the conflict rather than only at the doctrine.
- **The manual's own counts are one out from its build log in three places** —
  108 / 30 / 94 measured against 107 / 31 / 93 logged. **Live tree beats the
  log**; the difference is unchased and is stated on the page.
- **`00-FRONTMATTER.tif` is the one manual file in Record 002's manifest with no
  scan behind it.**
- **`CNC Vid-Link`** (Record 004) appears **nowhere else in either repo.**
- **The ashtray has been used** — on a console the same Record calls
  *unattended*, in a story whose canon says nobody is at headquarters.

---

## 6 · WHAT WAS CHANGED OUTSIDE `docs/canon/` — named, with reverts

**`tools/ops-desk.mjs`, three edits.** All are *the card*, in the sense the
brief meant: the card must link something a browser can render.

1. **`SIDE_PAGES` gains the 15 canon pages**, plus two capabilities the loop did
   not have: `up` (the pages live one directory down, so the back-links climb)
   and **sibling repointing** (`Foo.md#x` to `Foo.html#x`, scoped to the known
   set — a blanket rewrite would manufacture dead links). **One card in
   `INSTRUMENTS`.**
2. **Fenced-code-block support in `renderMarkdown`** — 9 lines, one block kind,
   no nesting, no languages. **Without it six blocks collapsed to one line with
   stray backticks**, which is the failure the whole file exists to avoid: a
   rendering that silently says something the source does not. The file's own
   rule is that the renderer must not grow *"the moment it needs a feature the
   register does not use"*, and its stated reason is that the REGISTER would
   then be written for the renderer. **Contorting quotations of a fixed-width
   page into br-soup would be exactly that inversion.** Judged the right side of
   the rule; **revert is deleting the block.**
3. **A `pre` rule in `DOC_CSS`.**

**THE THREE PRE-EXISTING SIDE PAGES RENDER IDENTICALLY, and the precise
statement is worth making rather than the loose one:** `BACKLOG.html`,
`OPEN_ACTIONS.html` and `THREADS.html` contain **zero `<pre>`**, so **nothing
they draw changed** — but the `pre` rule lives in the shared `DOC_CSS`, so all
three gained **13 lines of stylesheet they never exercise.** That is a real diff
on three files and it is named here rather than described as "unaffected".

**TWO OF MY OWN DEFECTS, BOTH CAUGHT BY LOOKING RATHER THAN BY READING:**

- **The `pre` block shipped light-on-light and unreadable.** It reached for a
  `--card` token the stylesheet does not define, took the light fallback, and
  the body's light text landed on it. **Zero broken links, zero overflow, and
  completely illegible** — found by one screenshot. Now on `--panel` with the
  `code` rule's colour.
- **A backtick inside a CSS comment closed the template literal**, and the parse
  error pointed at the top of the literal rather than at the line typed. A note
  to that effect is left in the file.

**AND ONE THING THE REBUILD SURFACED THAT IS NOT MINE:** `docs/BACKLOG.html` and
`docs/OPEN_ACTIONS.html` were **stale by three rounds** — their markdown was
edited on 2026-08-17 at 23:2x and the HTML last generated at 03:2x the same day.
This run regenerated them. The diffs are that catch-up, not this round's work.

---

## 7 · WHERE IT STOPPED, AND WHAT IS LEFT

**The catalogue is complete against everything it names as read.** It is not
complete against the whole corpus, and the closing section of `INDEX.md` names
the gaps rather than leaving them to be discovered:

1. **The largest known gap: `robots:content/` and the `BURP_*` / `MAGIC8_*`
   production documents.** Swept and found to hold production process — a rig
   test, storyboards, calibration — rather than facts about the world. **That
   sweep was a read of the doctrine and the storyboards, not of every file.** If
   a fact about this world is in there, it is not in here.
2. **The 89-folder 2024 firmware history and the 11 OneDrive originals** were
   read only through the MKR extraction as summarised in `SPEC_INVENTORY`. **The
   originals were not re-read.**
3. **Word-level content is described, not transcribed** — the persona answer
   grids cell by cell, the fortune cookies, the nicknames.
4. **`robots:STATE.md` round logs from line 3770 to 10405** were read by
   targeted search rather than end to end. Canon markers were followed; a fact
   buried in a round log without one could have been missed.
5. **The Weird.Baby music wing is out of scope by design** and is named as such.

**Nothing is half-written.** Every file in `docs/canon/` is finished to the
standard the others are held to; what is missing is corpus that was not reached,
and it is named.

---

## 8 · THE RULE THAT WAS HELD

**OPS RESOLVED NOTHING.** No account is marked likely, preferred, later or
better sourced. Where a document claims priority over another, that claim is
quoted as a fact about the document.

**Where Ops' own judgement appears it says so, in the text, three times:** the
reading of the four failure modes; the cost estimates for each; and one
observation about the figure `6.28`, explicitly labelled *not canon*.

**Nothing else on those pages is Ops' opinion.**
