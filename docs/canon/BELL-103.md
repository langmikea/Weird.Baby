# THE BELL 103 INTEGRATION — recorded as canon

> **Mike: "Coordinated and meaningful richness is beautiful."**

**STATUS: RULED AND BUILT. NOT YET PUBLISHED** — see [where it stands](#where-it-stands).
**Recorded here, not built here.** Nothing on this page is a proposal.

---

## 1 · THE FACT

The four correct communications settings are

```
1  PARITY    EVEN
2  DUPLEX    FULL
3  WORD      7 BIT
4  STOP      1
```

**They are a period-correct 1962 Bell 103 link**, and they are stated as such at
`robots:tools/manual_structure_build.py:1577`.

The manual itself declines to give them. Its own written prose, `BODY_B_1`:

> *"The values are not given in this manual. They are established at the far end
> and are entered on the installation record at the time the link is made. An
> instrument moved to another far end is to be set again."*

So the answer reaches a reader **only through the pen**, on a marked copy of the
same page. The pen strikes the **wrong** option in each pair and leaves the right
one standing.

**MIKE'S RULING ON WHY THE PEN AND NOT SOMETHING ELSE** (closing register row
`PZ-a`):

> *"the puzzle is knowing you saw it, and even if not, you can guess in 16. I
> think the pen is the better puzzle; the other is confirmed guessing."*

**Attention is rewarded and nobody is locked out.**

**AND THE FOUR STRIKES ARE NOT ALL IN THE SAME COLUMN** — first, first, second,
second — *"which is what stops four strikes reading as a pattern rather than as a
hand."* The strike geometry is at `manual_structure_build.py:1602-1605`.

---

## 2 · WHY EACH SETTING IS THE ONE IT IS

**This is Mike's reading, recorded as canon. It is not Ops' derivation.**

| setting | what it means as a period fact | what it says about this machine |
|---|---|---|
| **EVEN** | The classic ASCII teleprinter configuration: seven data bits and an even parity bit in the eighth. | The eighth bit is spent on checking rather than on carrying. |
| **FULL** | Both ends transmit at once; neither has to yield the line. | *"The link is bi-directional by design. Assume the far end is attended."* |
| **7 BIT** | A character set with room for plain text and nothing else. | No graphics, no extended set, no escape into anything but words. |
| **1** | One stop bit rather than two — the faster framing, chosen when the receiving mechanism can keep up. | Built for speed, not caution. |

---

## 3 · WHERE IT ALREADY AGREES WITH SOMETHING WRITTEN
<a id="agreements"></a>

**This is the part of the round the brief asked for: not whether the settings are
correct, but where the corpus had already, independently, said the same thing.**
Each row below is a thing written down before, by somebody who was not thinking
about Bell 103.

### 3.1 · FULL duplex is SP 7-14, in settings

**The strongest agreement, and the one already named in the brief.** The manual's
video-link paragraph is written and published:

> *"The link is bi-directional by design. **Assume the far end is attended.**"*

*Bi-directional by design* and *FULL* are the same statement in two registers.
And *assume the far end is attended* is what FULL duplex is **for** — half duplex
is the setting you choose when you know only one end will be talking.

Source: `robots:tools/manual_structure_build.py:136-140` (`BODY_7_14`);
published as `scan-11-a.webp` / `scan-11-b.webp`, Record 003.

### 3.2 · 300 BAUD is already on the glass, verbatim from Mike

**Bell 103 is the 300-bit-per-second standard.** It is the rate, and the machine
already says it — three times, in Mike's own dance lines, carried verbatim:

```
AUX CHANNEL OPEN 300 BAUD          F, twice, calling into the dark
ACK. LINK 300 BAUD CONFIRMED       F, when it lands
```

`robots:tools/viiip_twin.html:8689`, `:8693`, `:8704`.

**These were written for the front-and-top link, not for the video link**, and
nothing says the two links run at the same rate. What they establish is that
**300 baud is this machine's idea of what a data link is** — which is the rate
the four settings belong to, arrived at from the other direction.

They are also the subject of a live tension: **FT6** ruled `300 BAUD` stands as
period furniture, **FT3** says the machine may never assert a checkable specific.
See [K-18](CONFLICTS.md#k-18). **The Bell 103 finding makes `300 BAUD` a
*checkable specific that checks out*, which is an argument FT3 did not have when
it was written.** Recorded; not a ruling.

### 3.3 · CARRIER is already the vocabulary

The dial-up narration on the top glass reads

```
DIALING...  ·  CARRIER DETECTED  ·  HANDSHAKE  ·  LINK UP
```

and inside the F/T dance T answers the dark with a single word: **`CARRIER?`**

`robots:tools/viiip_twin.html:7989-7995`, `:8697`.

**Carrier detect is the Bell 103 concept**, not a generic one — it is the thing a
103 dataset asserts on a physical pin and the thing an operator watches a lamp
for. The machine already speaks it.

### 3.4 · 7 BIT agrees with everything the machine can draw

Nothing in the corpus has ever needed a character outside plain ASCII:

- The answer tables use **`_` as the line-break control** — `Ask again_later.`,
  `Concentrate_and ask again.` A corpus that presses an underscore into service
  as a control character is a corpus with no room for one.
  (`robots:tools/viiip_twin.html:1859`, `CSV_CORE`.)
- The three character sets are a 6×8 `classic`, `TomThumb` and `FreeSansBold` —
  all plain-text faces, no extended set anywhere
  ([H-12](HOLES.md#h-12)).
- The manual is **typed**, at 12 characters per inch on a 6-lines-per-inch grid,
  Courier, bold by overstrike, headings underscored with the underline key. A
  typewriter has no eighth bit either.

### 3.5 · The instrument holding its peace is what a mismatch does

B-1's written prose:

> *"It is not set to a preference. It is set to agree with the far end, and until
> it agrees **the instrument holds its peace.** Four settings. The unit will not
> speak until all four agree with the far end."*

and

> *"A disagreement in any one of the four is reported as a parity bias setting
> mismatch. The report names the condition and **does not name the setting at
> fault, there being no means at this end of knowing which of them is wrong.**"*

**That last clause is period-exact.** A 103 dataset at one end genuinely cannot
tell you which of the four the other end disagrees about — it has no channel to
ask on, because the channel is the thing that is broken. The manual reasons its
way to the right answer for the right reason.

**It is also the sentence that makes [FAILURE-MODES](FAILURE-MODES.md) a design
problem rather than a message problem**: the machine may not *name* the fault,
so the fault has to be *shown*.

### 3.6 · The manual is a 1965 document using a 1962 standard

`ABEAL 8P-OMI-1`, `MODEL MGK-VIIIp`, and the fiction dates the VIIIp to 1965.
**Bell 103 is 1962.** A three-year-old standard is exactly what a 1965 machine
would be built to — new enough to be the modern choice, old enough to have
installed base at the far end.

### 3.7 · The published Record already frames it as a period competence

Record 005 (`SCHEDULED`, posts 17:00 on 2026-08-21), in the museum's own voice:

```
  ? A period operator would have known this without being told.
  ! We are not period operators.
```

and

```
  > Four toggles. Sixteen combinations. One of them is correct.
```

**That is the Bell 103 fact stated as a story beat, and it was written before
this page existed.** It is also the tightest statement of Mike's principle
anywhere in the corpus: the richness is meaningful *because* a period operator
would not have needed the pen.

### 3.8 · DTMF in the dial sound is period-plausible, and was not chosen for that

`FX_dial90()` opens with seven **DTMF** pairs before the answer tone. Touch-tone
dialling is a 1963 Bell service — one year after 103 and two before the machine.
Nothing in the code says this was the reason; the function is named for the
nineties. **Recorded as an accidental agreement**, and see the mismatch below.

---

## 4 · WHERE IT DOES **NOT** AGREE — one mismatch, reported not fixed
<a id="mismatch"></a>

**`FX_dial90()` is a 1990s modem and the link is a 1962 one.**

- The function's own comment: *"a ~3s 90s dial-up — DTMF dial, carrier handshake
  warble, static burst."*
- `robots:docs/SPEAKABLE_INDEX-20260726.md` §The dial-up handshake: *"The ~3-second
  **90s modem**: dial tones, the answer, the warble, the static."*
- What it synthesises: DTMF, then **1200 Hz** square described as *the answer
  tone*, then 2250 Hz and 1800 Hz warbles, then a noise burst.

A Bell 103 answering station marks at **2225 Hz** and spaces at 2025 Hz; an
originating station marks at 1270 and spaces at 1070. **The 2250 Hz warble is
within 25 Hz of the 103 answer mark and is called a warble; the 1200 Hz tone is
called the answer tone and is not one.** The multi-tone warble a listener reads
as "modem" is a rate negotiation from thirty years later — a 103 link has no rate
to negotiate, because it has exactly one.

**NOTHING IS PROPOSED HERE.** The mismatch is recorded because it is the one
place the corpus's sound and the corpus's settings disagree, and because Mike's
own principle is what makes it worth knowing: a link whose settings are
period-exact and whose sound is thirty years late is the coordination breaking in
the one channel nobody was looking at.

Related and separate: **`FX_modem()`** (the download screech) is a different
function for a different event and is not part of this.

---

## 5 · A SECOND INSTANCE OF THE SAME PRINCIPLE, ALREADY IN THE BUILDING
<a id="second-instance"></a>

**The brief asked where else this kind of agreement already exists. There is one
more, and it is already a planted egg**, so it is named here and **not explained
on any glass**.

The Portal's feed drum engraves channels **1–8**, and the two machines fall where
they fall: MGK-NIAC on 1 and 2, MGK-VIIIp starting at **3**. The corpus's own
output designation for the ElectronScope is **CH4 / CH3 / 8K**
(`SPEC_INVENTORY` §D.8).

The reason the numbering starts where it does is recorded **once**, in
`museum:reveal/ledger.json` (`egg.channels`, state HELD, build LIVE), and
`museum:src/data/artists/portal.js` carries Mike's instruction verbatim: *"the
reason is the egg and it must not be explained on the glass."*

**Same shape as Bell 103**: a real period convention, load-bearing, planted where
a person who knows it is rewarded and a person who does not is given a numbered
drum.

---

## 6 · WHERE IT STANDS
<a id="where-it-stands"></a>

| thing | state | evidence |
|---|---|---|
| The four values | **RULED** | `manual_structure_build.py:1577`, in the generator's own comment block |
| The pen-strike mechanism | **RULED** (`PZ-a` closed) and **BUILT** | `manual_structure_build.py:1565-1611` |
| `marked-01-a.webp` | **RENDERED, ON DISK, UNCOMMITTED** | `museum:public/robots/manual/marked-01-a.webp` — untracked in git |
| Record 003's fourth attachment | **WRITTEN, UNCOMMITTED** | `museum:src/data/artists/robots-record.js`, working-tree change |
| **A visitor has seen it** | **NO** | Neither file is committed or deployed |

**It becomes published the moment that commit deploys**, and after that it is
governed by the published-facts rule: it can be built on and it cannot be
changed.

**THE MARKED PAGE IS BACK-POSTED ONTO A LIVE RECORD, ON MIKE'S RULING**, and his
reason is recorded with it: *"We have had no visitors."* The original `scan-31`
is untouched and stays — **the museum does not edit what it has already shown; a
page comes back with somebody's handwriting on it.**

Three further rulings sit on that attachment and are worth carrying:

- **It is deliberately not called a scan.** Record 003's published DETAILED
  REPORT names three — SCAN 07, SCAN 11, SCAN 31 — and adding a fourth would edit
  published text. It also happens to be true: this page was not recovered from
  the ZIP and was not filmed.
- **The filename asserts no page.** `marked-01`, not `marked-b1` — a sequence of
  marked copies, and nothing about the document. Mike has said this is a
  **recurring channel**, so it takes a number from the first one.
- **The pen is Mike's own hand.** He is the PEN WRITER, logged for the credits
  page.
- **It is a SECOND RENDER of the same master, not a retouch of the first file,
  and that is so the pair can be differenced and audited.** The generator emits
  `robots/mgk-viiip/manual/structure/pages/page-47.png` and
  `robots/mgk-viiip/manual/structure/pages/marked/page-47.png` **separately**,
  so the unmarked leaf and the marked one can be laid against each other and
  every mark on the page accounted for. A retouch would have left one file and
  no way to ask what changed. *(Carried here 2026-08-26 from Record 003's source
  comment, which was the only place it was written down — see
  [C-day2](../OPEN_ACTIONS_CLOSED.md), closed 2026-08-26.)*

  > **[FLAG 2026-08-26 · found here, not fixed]** `provenance/assets.json`'s
  > `scan-31-a` row names its master as
  > `robots/mgk-viiip/manual/structure/page-47.png` — **there is no file at that
  > path.** The leaf is at `structure/pages/page-47.png`, as the marked row and
  > the deleted comment both have it. Measured 2026-08-26: the row's path is
  > absent, the other two exist. Not corrected here because this round moves one
  > Record's reasoning and does not edit a gated provenance record on the way
  > past.

**AND ONE MARK ON THAT PAGE IS FLAGGED AND NOT SPENT.** The sheet carries two
registers — a careful hand and a loose one — and *"a page marked in both is a
page two people wrote on."* B-1 is the careful hand throughout. The **monogram**
is the one deliberate exception, taken from the loose column, *"because a
signature is the one mark a person does not vary by mood."* Flagged for Mike.

**HIS SPELLING STANDS.** The mark `careful-check-w-far-side-first` reads **FAR
SIDE**; the manual says **FAR END**. He wrote it both ways on one sheet and the
slip is not corrected — *"a pen holder who gets his own document's term slightly
wrong is a person, and that is the whole point of the channel."*
