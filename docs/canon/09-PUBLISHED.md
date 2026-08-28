# 09 · THE PUBLISHED RECORD — what a visitor has already read

**EVERYTHING ON THIS PAGE MARKED `PUBLISHED` IS FROZEN. It cannot be changed —
only built on.**

That is not a style rule. A visitor read it; the museum does not edit what it has
already shown. **A correction is a later Record that discovers something, not an
edit to an earlier one.** The one exception is the one Mike has already used and
named: *"We have had no visitors"* — see [the back-post](#back-posting).

---

## THE THREE STATES
<a id="the-three-states"></a>

**A Record entry is in exactly one of three states, and the difference matters
every time somebody asks *can we change this*.**

| state | meaning | can it change? |
|---|---|---|
| **PUBLISHED** | The museum's clock has passed its posting instant. A visitor could have read it. | **No.** Build on it. |
| **SCHEDULED** | Written, committed, **in the shipped bundle** — a visitor with devtools can read it — but the page does not draw it. | **Yes**, until it posts. |
| **UNPUBLISHED** | Not written, or written and not committed. | Yes. |

**THE HONEST DESCRIPTION OF THE FILTER IS *"the Record does not show you the
future"*, NEVER *"the future is not there."*** `RECORD_ENTRIES` is imported
statically, so every entry — including days that have not happened — is compiled
into the chunk. **That is a known and accepted limit, ruled 2026-08-12**, and the
entries move to a worker-served endpoint as their own packet. Open row `CH5-a`.

**The asset half has no such hole:** `src/worker.js` refuses the FILE a future
entry names, and a file the worker refuses is not in the page at all.

---

## THE CLOCK
<a id="the-clock"></a>

| | |
|---|---|
| **Epoch** | `RECORD_EPOCH = "2026-09-07"` — **one constant**, `src/data/artists/record-epoch.js`. A slip is that one line and nothing else. **Moved twice: 2026-08-17 → 08-31 (Ruling C, 2026-08-24) → 09-07 (Ruling D, 2026-08-28).** |
| **Timezone** | `America/New_York` |
| **Posting hour** | **17:00** — *"Records post at 17:00 America/New_York on their day. Record N becomes visible at 5pm on day N."* |
| **Dating** | `recordDay(n)`, UTC arithmetic, counted from the epoch. **Not typed.** |
| **Whose clock** | **The museum's, on the server.** `src/worker.js` injects `window.__WB_TODAY__` on every HTML response. **Not the browser's** — *"a browser clock belongs to the visitor: it can be wrong by accident or on purpose."* |

**RECORD 001'S OWN TEXT SAYS THE SITE WENT LIVE *"at 12:00 am Monday morning"*
AND THAT IS CANON AND UNTOUCHED.** It is STORY, carried verbatim.

> **[2026-08-28] WHAT THIS PARAGRAPH USED TO CLAIM AROUND IT IS STRUCK.** It read
> *"RECORD 001 IS THE EXCEPTION AND IT STAYS ONE. It posted at 00:00 Monday. Not
> backdated, not hidden. `/robots` opened at 00:00 Monday and stays open."*
> **Nothing has posted.** RULING C, 2026-08-24: *last week was design and
> development, the site was never live.* The wing is derived — `wing-open.js`
> opens it when the Record has a visible entry — and on the museum's own clock
> the first visible entry arrives **at 17:00 on Monday 7 September**, not at
> 00:00. **The 00:00 exception was a description of a launch that did not
> happen, and this page went on describing it for four days after the ruling.**

**AND THE BOUNDARY IS READ OFF THE WALL CLOCK, NOT BY SUBTRACTING 17 HOURS.** On
8 March 2026 a flat subtraction posts the Record an hour late, because the day is
23 hours long. Tested on both 2026 transition days.

**THERE ARE TWO REQUEST-TIME CLOCKS AND ANY DATE OVERRIDE MUST SET BOTH:**
`todayInRecordTz()` (the **day**, `worker.js:210`) and
`window.__WB_NOW__` (the **instant**, for the lobby countdown, `worker.js:180`).
**Move the day and leave the instant and the lobby countdown contradicts the
Record on the same page.**

**AND A CLOCK OVERRIDE IS NOT AN AS-OF QUERY.** The museum's data carries **no
`valid-from` and no `superseded-at`** — so a date parameter shows **today's text
under an older date.** *Never label it as seeing the past.* The honest answer to
*"walk the museum as it stood"* is immutable deploys, recorded and not built.

---

## THE FIVE ENTRIES
<a id="entries"></a>

| no | date | title | state as of **2026-08-28** |
|---:|---|---|---|
| **001** | 2026-09-07 | INITIAL LAUNCH - Weird.Baby Website | **SCHEDULED** — posts 17:00 Mon 7 Sep |
| **002** | 2026-09-08 | GENERAL STATUS UPDATE | **SCHEDULED** |
| **003** | 2026-09-09 | DATA RECOVERY - LEVEL 1 - SUCCESS! | **SCHEDULED** |
| **004** | 2026-09-10 | GENERAL STATUS UPDATE | **SCHEDULED** |
| **005** | 2026-09-11 | **PORTAL CONNECTION ONLINE** | **SCHEDULED** |
| **013** | — | *the prototype* | see [Record 013](#record-013) |

> **[2026-08-28] EVERY DATE AND EVERY STATE IN THAT TABLE MOVED, AND THE STATES
> ARE THE PART TO READ.** The dates are arithmetic — `recordDay(n)` off the
> epoch, re-derived twice (Ruling C, then Ruling D) and typed here because this
> is a catalogue and a catalogue prints values.
>
> **THE STATES ARE A RULING BEING APPLIED FOUR DAYS LATE.** This table said
> 001–004 were **PUBLISHED** and 005 **SCHEDULED — posts 17:00 today**, as of
> the museum's 2026-08-21. **RULING C, 2026-08-24, says the site was never
> live** — *"nothing is unpublished because nothing was published, so we never
> go backwards is not broken."* **So none of the five has ever been read by
> anybody, and all five are SCHEDULED.**
>
> **WHY THAT MATTERS MORE THAN THE DATES:** this page is the answer to the
> index's fourth question — *"Can I change this, or has a visitor read it?"* —
> and it was answering **four Records cannot be changed** when the ruling says
> all five can. **A catalogue that is wrong about what is frozen is worse than
> no catalogue**, which is the thing INDEX.md's own opening says about picking
> winners quietly. Flagged in the round log as question 2: **Ops applied Ruling C
> here rather than leaving a known falsehood standing, and Mike confirming that
> reading is the last step.**

---

## RECORD 001 — PUBLISHED
<a id="record-001"></a>

**Mike's own launch report, carried VERBATIM.** The dictation instrument's rule
holds: *everything in the form is story*, and **Ops does not tidy.**

**HIS TYPOS SHIP ON PURPOSE.** `was made made` · `=  86%` · `auto containment.
and auto alerts` are in the entry deliberately, and **a round that tidies one has
broken the instruction.**

**Facts it establishes, all frozen:**

- **The Weird.Baby website went live**, on schedule, at 00:00 Monday.
- **An incoming server load >1000× nominal**, contained. **Multi-source swarm
  payloads precluded IP/domain blocking.**
- **`f(Ump) = 100%`** — the museum's own recurring metric, never explained.
- **The RX ended abruptly and coincident with the Weird.Baby launch.**
- The Friday timeline: **15:04 first data packet · 15:58 second · 16:00
  instantaneous sustained FULL LOAD, packet rejects = n! · 16:10 server
  auto-shutdown, auto-containment, auto-alerts · 16:13 REACT team convened ·
  23:30 REACT ruling — restart with 5K× incoming server resources.**
- *"The decision to resume was determined to be low risk, reversible, and a
  real-world stress test. The engineering team was more intrigued than concerned,
  and not involved in the determination."*
- The weekend: **pages of hexadecimal numbers; presumably to be compiled into
  something of use.**
- Monday: **00:02 the incoming data stream ends.** *"The remainder of the day was
  completely uneventful."*
- **`ADDED PAGE - W.B/Robots added (to track what happened, just for a few
  days)`** — with a hash line ending `>> Complete!`

**ITS INDEX ROW HAS NO SUMMARY AND THAT IS DELIBERATE.** A 477-character
executive summary does not fit a 130-character index row, and **picking which of
his sentences becomes the summary is an edit.** Measured: 001's row is 84px
against 013's 157px at 390px.

---

## RECORD 002 — PUBLISHED
<a id="record-002"></a>

**Establishes:**

- **The incoming server data assault has ceased; no impact.**
- **All processes 6+ sigma.**
- **`Incoming Data: ZIP file (31.4 GB) Password Protected`** — **and the figure
  is 31.4**, the fleet's own number.
- Manifest extraction attempted **against the stream still in flight.**
- **THE PARTIAL MANIFEST — names only, no contents:**

```
MGK-VIIIp/MANUAL/00-FRONTMATTER.tif
MGK-VIIIp/MANUAL/07-POWER-SYSTEM.tif
MGK-VIIIp/MANUAL/11-VID-LINK.tif
MGK-VIIIp/MANUAL/31-PARITY-BIAS.tif
PERSONNEL/CEO/
PERSONNEL/INFORMER/
PERSONNEL/EVERYDAY/
PERSONNEL/GAMBLER/
PORTAL/CH3-STANDARD/
PORTAL/CH4-DETAIL/
```

**FOUR THINGS IN THAT MANIFEST BIND ELSEWHERE:**

1. **`00-FRONTMATTER.tif` is named and has never been delivered.** It is the
   only manual file in the manifest with no scan behind it.
2. **The four personnel folders** — [H-01](HOLES.md#h-01).
3. **`PORTAL/CH3-STANDARD/` and `PORTAL/CH4-DETAIL/`** are **the drum's two
   arming channels, by their engraved names**, published before anybody has seen
   the drum. The Portal wing is HELD; its channel numbering is
   [an egg](06-PORTAL.md#feed-control).
4. **`31-PARITY-BIAS`** — the scan numbers are **frame numbers from whoever
   filmed the manual**, not page numbers. See [ruling 11](#ruling-11).

**FLAGGED AND NOT CORRECTED:** the DETAILED REPORT ends *"- Appendix 01"* while
the section heading below it reads *"ADDENDUM 01"*. **Both are Mike's, both
carried as typed.**

**AND ONE LINE WAS STRUCK FROM THIS ENTRY BEFORE IT POSTED.** The `_tmp/`
manifest line and its marginal note promised something the museum could not show.
See [ruling 9](#ruling-9). **A post-publication edit to this entry was missed by
luck, not by design** — the DETAILED REPORT was rewritten at 09:51 on 18 August
and the entry published at 17:00 the same day.

**WHERE THE STRUCK TEXT ITSELF IS.** Five lines left this entry on 18 August and
Doctrine 24 puts a deleted thing in the log of the round that killed it. That log
is `docs/MUSEUM_COPY_AND_RECORD_LAYOUT_LOG-20260817.md`, **§ 27** for the words
and **§ 28** for the proof they are absent from the built launch bundle:

| what left | where its words are |
|---|---|
| the `_tmp/` manifest line and its marginal note | § 27, and `MUSEUM_RULINGS-20260817.md` § 9 |
| the closing line — *"The last entry is the only one we can open…"* | § 27, and ruling 9 |
| the ZIP-index line | § 27 |
| the per-file-header line | § 27 |
| the recovered-names line, **with the invented count** | § 27 — deliberately kept out of the source, because a figure for something the museum cannot produce is a fact a later round could reinstate believing it was data |

**HIS CHARACTERS IN WHAT REPLACED THEM ARE CARRIED AS TYPED** — `SUMMARY -All`
with no space after the dash, and the colon in `Incoming Data:` where the old
line had an equals. Both are Mike's; a round that tidies either has broken
Doctrine 21. Recorded at § 27 of the same log.

**[2026-08-26] THE SOURCE NO LONGER CARRIES ANY OF THIS.** Record 002's two
comment blocks in `src/data/artists/robots-record.js` were **deleted rather than
moved** — every claim in them was already in the two files above, in fuller form
— so that the entry can accept an edit from the day editor. The preamble of that
file records the deletion, and `npm run day:proof` P6 asserts on every run that
each claim is still findable here. Register [C-day2](../OPEN_ACTIONS_CLOSED.md), closed 2026-08-26.

---

## RECORD 003 — PUBLISHED
<a id="record-003"></a>

**The first delivery. Establishes:**

- *"Ops now wants an Early-Pull-Off with Confidence >> 6.28 sigma"* — **the
  figure is `6.28`.** *(Ops observation, not canon: nothing in either repo
  connects this figure to anything. The π motif is established elsewhere — the
  fleet is 31.4, the ZIP is 31.4 GB, `reserved-date-3-14-65` is cut and
  deliberately unplaced — and whether `6.28` belongs to it is Mike's to say.)*
- **The outer layer was not password protected.**
- **Three manual pages recovered: `SCAN 07 - POWER SYSTEM` · `SCAN 11 - VID-LINK`
  · `SCAN 31 - PARITY BIAS`.**
- **ADDENDUM 02 — the personnel folders, opened:**

```
THE CEO         - one page, redacted to the letterhead
THE INFORMER    - photographs only, no text
THE EVERYDAY    - not yet opened
THE GAMBLER     - not yet opened

  ? Four people are described in a manual for a machine. No explanation is offered.
```

**THE ATTACHMENTS — the first pages of the manual any visitor has seen:**

| attachment | pages | files |
|---|---:|---|
| **Scan 07 - Power supply and distribution** | 2 | `scan-07-a.webp` · `scan-07-b.webp` |
| **Scan 11 - The video link** | 2 | `scan-11-a.webp` · `scan-11-b.webp` |
| **Scan 31 - Bias settings** | 1 | `scan-31-a.webp` |
| **Marked copy 01 - Bias settings** | 1 | `marked-01-a.webp` — **PUBLISHED** (committed 2026-08-19; corrected here 2026-08-21). |

**SO ¶7-19, SP 7-14 AND B-1 ARE ALL PUBLISHED IN FULL.** Their text is at
[03-ANSWERS](03-ANSWERS.md#second-kind) and
[06-PORTAL](06-PORTAL.md#video-link). **Everything they say is frozen** —
including *Inclination* ([K-07](CONFLICTS.md#k-07)), the *determination*
([H-13](HOLES.md#h-13)), the *keeper* ([K-22](CONFLICTS.md#k-22)) and the *cell*
([H-02](HOLES.md#h-02)).

**AN ATTACHMENT IS THE PAGES THAT WERE FILMED TOGETHER.** *"We show the things
that need to be shown. Each page is a page, and if we need to include a couple
more pages, fine. Those pages were in the outer layer for a reason."* **The three
scans are four manual pages delivered as five files — one page is in two scans**,
because the leaf that closes the video link also opens the power supply.

---

## RECORD 004 — PUBLISHED
<a id="record-004"></a>

**[2026-08-21] THIS SECTION WAS DESCRIBING AN ENTRY THAT NO LONGER EXISTS.**
Mike rewrote the DETAILED REPORT on 20 Aug, the morning it posted, and this page
was not brought along — it still listed the unattended-terminal sentence, the
bi-directional Vid-Link sentence, the bench description and two `docs` titles,
all of which he struck. What follows is what actually went out.

**Establishes:**

- *"> Weird.Baby Website - All Systems Favorable"* · *"> /Robots ZIP File
  Cracked"* — the deck.
- **The ZIP password: `[355113]`.** 355/113 = 3.14159292, Zu Chongzhi's ratio to
  six decimals. The egg is the digits.
- **The folder listing** — a pure indent tree: `ROOT` · `/(many pwd protected
  folders)` · `/PORTAL` · `TERMINAL.EXE` · `PORTAL_2v16.CFG` · `/ANTENNA (PWD)` ·
  `/CHANNEL_SELECT(PWD)` · `/INSTALL` · `QC_101.TIF (hand written notes on
  form)`. **The version is on the glass in the filename.** `PORTAL/CH3-STANDARD/`
  and `PORTAL/CH4-DETAIL/` from Record 002's manifest are the far end's own
  directory names and are NOT the drum's engraved legends (`MGK-VIIIp` /
  `MGK-VIIIp (zoom)`).
- *"> Install document looks proprietary. Probably not meant to seen."* —
  **his typo, carried as typed** (Doctrine 21).
- *"> QC RULE: Unsafe to run in any sandbox; permanently quarantined."*

**ATTACHMENTS 1 — and it arrived a day AFTER publication.**

| attachment | pages | files |
|---|---:|---|
| **QC_101 - Final test and inspection** | 1 | `qc-101-a.webp` |

**That is the first time a published Record has gained an attachment.** Mike
ruled it on 21 Aug; his reason is *"we have had no visitors."* See
[Ruling 18](../MUSEUM_RULINGS-20260817.md). The published text is untouched to
the character — an attachment arrives beside what was shown, it does not rewrite
it.

**The listing says `.TIF` and the museum serves `.webp`, on purpose.** Same
arrangement as Record 002's `.tif` manifest and the `scan-NN-a.webp` files that
answered it. See [Ruling 19](../MUSEUM_RULINGS-20260817.md).

**WHAT WAS STRUCK FROM THIS ENTRY, named once:** the two plate-less `docs`
titles (*View of the portal screen* · *Manual ref to Portal*), the `OTHER`
requisition section, and `ADDENDUM 01 - Bench Description` whole. The bench
survives where it belongs, in [06-PORTAL](06-PORTAL.md).

**AND STRIKING THE TWO ROWS COST NO PROSE, WHICH WAS MEASURED BEFORE IT WAS
CLAIMED.** The entry was searched for `attach`, `contents`, `enclos`, `appendix`,
`below` and `see ` — **zero hits.** Its one backward reference is to Record 003
and is delivered: it read *"Excerpts from the Manual earlier in the week"* on
20 August, and when Mike rewrote the section on the 21st it became *"The
Manual's bi-directional CNC Vid-Link is one half of it"* — **still pointing at
003's delivered scan, so the finding held and only its quotation moved.** Not
one character of his text moved to allow the strike.

*(Carried here 2026-08-26 from Record 004's source comment, which was the only
place this measurement was written down. The second row's sharper fault — that
it DENIED something Record 003 had already shown — is now at
[Ruling 10](../MUSEUM_RULINGS-20260817.md). See
[C-day2](../OPEN_ACTIONS_CLOSED.md), closed 2026-08-26.)*

---

## RECORD 005 — posts 17:00 on 2026-08-21 (today)
<a id="record-005"></a>

**[2026-08-21] THIS SECTION DESCRIBED A DRAFT THAT NO LONGER EXISTS.** Mike gave
the final text hours before it posts, and it is the first entry in the volume
with **its own headline** — 002 and 004 still share `GENERAL STATUS UPDATE` and
005 does not. That is deliberate and his: **a headline that differs is the
cheapest signal a Record has, and it is spent on the week's payoff.**

**HEADLINE — `PORTAL CONNECTION ONLINE`**

**Establishes, in his words:**

```
DECK
  > Portal Data Link - Connection Achieved
  > ZIP Extraction - Outer Layers Complete / Stopped

EXECUTIVE SUMMARY
  > Portal appears to function. Intended purpose unknown.
  > ZIP - We have reached the capability limit of brute force.

DETAILED REPORT
  > Portal is now up and running on our UNIX-6x Emulator.
  > It carried its own COMM payload, autosync, etc.
  > The Portal is accessible via the Robots Exhibit.

OTHER
  > APPROVED - Req 0628 - Internal Transfer - No net increase in head count
```

**TWO FIRST APPEARANCES IN THE CORPUS, BOTH IN THE DETAILED REPORT** — the
**UNIX-6x Emulator** and the **COMM payload with autosync**. Neither string
existed anywhere in either repo before this line. Filed as canon:
[06-PORTAL §10](06-PORTAL.md#what-it-runs-on).

**CARRIED VERBATIM, WITH TWO THINGS FLAGGED AND NOT FIXED** (Doctrine 21): his
first line says *Portal* and his third says *The Portal*, and `etc.` closes the
second sentence with the period doing double duty. Both are his, as typed.

**`> The Portal is accessible via the Robots Exhibit.` STILL SITS AGAINST THE
WING BEING HELD**, which was recorded against the draft and is unchanged: the
sentence is true in DEVELOPMENT and, at LAUNCH, true only for a visitor with the
cookie. Recorded, not resolved.

**WHAT WENT WITH THE REWRITE, NAMED ONCE** (Doctrine 24): *"The launch controls
are intuitive looking, but the system fails to boot."*,
`Error: Communications Parity Bias Setting Mismatch`, *"Four toggles. Sixteen
combinations. One of them is correct."*, *"< The Manual names the settings and
declines to name the values."*, and **ADDENDUM 01 — The Four Settings, as
printed** entire, including *"? A period operator would have known this without
being told."* and *"! We are not period operators."* **The four settings remain
published** — Wednesday's marked manual page carries them in pen, delivered by
Record 003.

**VERIFIED ON THE BUILT LAUNCH BUNDLE, 2026-08-21:** all five strings present
exactly as above, and no earlier version of any of them survives anywhere in the
entry.

---

## RECORD 013 — the prototype
<a id="record-013"></a>

**RULED, Mike, 2026-08-07: Record 013 is a PROTOTYPE and the real Record starts
at 001.** Not day one, no re-dating, no defending.

**It is KEPT rather than retired** because it is the only thing exercising
`RecordEntry.jsx`, the index budgets, the per-entry ledger derivation and the
pull-back rule's one delivered picture — **the photograph of the power switch
round the back, the single picture the pull-back rule let through onto this
wing.**

**THE PROTOTYPE MARK IS IN `reveal/ledger-declare.mjs` AND THE DICTATION PAGES
AND NOWHERE ON THE GLASS.** Its number is untouched and open: register row `B-b`.

---

## THE MUSEUM'S OTHER PUBLISHED ROBOTS SURFACES
<a id="other-surfaces"></a>

### The front desk FAQ — `PUBLISHED`

> **Where do I start?** — *"Finish the FAQ, then follow The Record."*
>
> **Is this stuff real?** — *"The hardware is; I mean you can hold it at least.
> And it's heavier than you might expect."*
>
> **Does it work?** — *"See "Is this stuff real?""*
>
> **Can I buy one?** — *"Monitor the website for availability. Follow us on
> social media."*
>
> **Can I try one?** — *"Yes."* / *"Well, not now, but soon. Hopefully. That's
> all I can say right now."*

### The two machines' faces — `PUBLISHED`

Full text at [02-MACHINES §8](02-MACHINES.md#museum-albums). The load-bearing
ones:

- **MGK-NIAC's Technical Specifications** — the matrix, the bar, the outputs and
  **the five declared rules**, including **RULE 5: *no adaptive learning — the
  machine is forbidden, in writing, from getting to know you.***
- **MGK-VIIIp's Technical Specifications** — *"The Record says what was found.
  The Manual says what it was sold as. **The firmware is the only one of the three
  that cannot be wrong about the machine, because it is the machine.**"*
- **Both Documentation faces name `ABEAL 8P-OMI-1`** and describe it as *"Held.
  Incomplete, assembled out of copies caught at different stages."*
- **Both FAQs:** *"Yes. Both units power on and run their own firmware."* and
  *"No. The shop carries what the shop carries; the machines are not stock."*

### The museum's own description — `PUBLISHED`

On all three description tags, one string:

> **Weird.Baby Museum** — *"A free museum of weird things worth keeping. Robots
> arriving one day at a time, music worth a listen, and a guest book that
> remembers who got here early."*

---

## THE RULES THAT GOVERN WHAT A RECORD MAY SAY
<a id="record-rules"></a>

### Ruling 9 — WE DO NOT HOLD BACK WHAT WE SAY WE HAVE
<a id="ruling-9"></a>

> **"We do not hold back what we say we have. We hold back what we don't have
> yet."**

**DOCTRINE.** A Record **names only what it can produce.**

**IT IS THE INVERSE OF THE PULL-BACK RULE AND THE TWO NOW MEET.** The pull-back
rule governs a thing the museum HAS and is not showing yet. This governs a thing
the museum does NOT have: **it may not be named as though it did.** Between them:
**the Record may withhold, and the Record may not promise.**

### Ruling 10 — WHAT'S SAID MATCHES WHAT'S SHOWN
<a id="ruling-10"></a>

> **"What's said matches what's shown."**

**Ops makes it true and asks Mike for what is missing. Ops does not hedge the
Record's wording to cover a gap.** *A sentence that says eleven while three are
on the glass is not fixed by softening the sentence; it is fixed by showing
eleven or by saying three.*

**Applied the same hour it was made:** Record 003's DETAILED REPORT read *"Eleven
manual pages and four personnel folders"* against three attachments. **ELEVEN
became THREE.**

### Ruling 11 — THE SCAN NUMBERS ARE NOT PAGE NUMBERS
<a id="ruling-11"></a>

**`07`, `11` and `31` are frame numbers from whoever filmed the manual.** They
match nothing in the document and **they are not meant to.**

**No renumbering anywhere.** The document keeps its own page numbering; the
ledger keys its rows by the manual's page index; **the two never meet.**

**THE PRACTICAL HALF: no public address may assert a page of the manual** —
which is why the files are `scan-NN` and the marked copy is `marked-01` rather
than `marked-b1`.

**THE VOCABULARY WENT WITH IT: *manual pages*, never *plates*.** `PLATE 07`
became `SCAN 07`. The museum's remaining uses of *plate* are for a **photographic**
plate and a **maker's** plate, which is a different word, and they stand.

### Ruling 14 — the museum publishes a derivative
<a id="ruling-14"></a>

**The 300-dpi PNG masters stay in the robots repo. The museum publishes
1700×2200 WebP q82.** *"It is a measurement, not a preference"* — the source
masters would have cost a visitor **9.02 MB to paint five 52px squares**; the
derivative costs **0.42 MB**, and legibility was checked at 1:1.

### The pull-back rule (H2)
<a id="pull-back"></a>

> **NOTHING PUBLISHES UNTIL THE RECORD DELIVERS IT.**

**Mike, stating it generally:** *"this applies to images, the manual, and probably
more. Every asset stays held until a Record entry brings it into the story, at
which point it is placed according to that entry. The archive and the viewer stay
built; they are simply empty until the story fills them."*

**The population is "a picture of the objects", and that is the whole of the
boundary.** The museum's own signage is not delivered by anybody and is not
governed.

**AND IT IS A LAUNCH-STATE RULE.** *"DURING DEVELOPMENT, SHOW EVERYTHING THAT IS
PLACED, until asked to filter. Mike cannot direct what he cannot see."*

### Back-posting
<a id="back-posting"></a>

**Record 003 gained a fourth attachment after it published, on Mike's ruling, and
his reason is the whole of why it was allowed: *"We have had no visitors."***

**RULING B: THE ORIGINAL SCAN STAYS.** The marked copy arrives **beside** it as a
new attachment. **The museum does not edit what it has already shown; a page
comes back with somebody's handwriting on it.**
