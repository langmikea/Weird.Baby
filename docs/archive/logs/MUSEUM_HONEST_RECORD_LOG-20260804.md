# THE HONEST RECORD ROUND — run log

**Date:** 2026-08-04 · autonomous single-agent, Code lane, drafting lane
**Frames:** H1–H6 from Mike's remote-control brief
**Gates:** `npm run lint` **11 err / 9 warn = HEAD baseline, zero new** ·
`npm run build` green, **70 modules** (unchanged) · desktop 1690px and a genuine
390px iframe lap, **zero page-level horizontal scroll at either** · 27-pattern
ban sweep over all authored source, **zero visible hits**
**Push and deploy are Mike's.**

**Companion deliverable:** `docs/RECORD_013_QUESTIONS-20260804.md` — the
question list. It is the point of the round, not an appendix.

---

## THE LAW, BANKED FIRST

> **OPS DOES NOT INVENT CONTENT. Where a fact is missing, Ops asks Mike in
> one-question format — what is known, what is missing, why the gap matters —
> and Mike supplies it. Ops never fills a gap with plausible detail.**

Written into `docs/canonical/OPERATIONS.md` §7 as **Working Doctrine 12**,
site-wide and standing, with:

- **What counts as invention** — not only a false claim, but any specific the
  operator did not supply and the record does not hold: a date, a count, a time
  of day, a measurement, a material, a name, a quotation, an ordering, a
  consequence. **Plausibility is the failure mode, not the defence.** A round
  that produced sixty entries where one was supplied produced fifty-nine
  inventions however well they fit.
- **The one-question format** — WHAT IS KNOWN / WHAT IS MISSING / WHY IT
  MATTERS, one gap per question, answerable one at a time, never blocking.
- **What Ops does with the gap meanwhile** — ships the surface without it. A
  section that cannot survive without invention is CUT and named as cut; a field
  that cannot be filled honestly is DELETED rather than approximated. The
  question list is what replaces the invention, and **it never goes on the
  glass** — a question to the operator is meta and fails Doctrine 11.

The existing no-invented-provenance rules are a subset of this one. This is the
general form.

**Why it was needed:** ten dated log entries, a "436 records" source line, a
register block and a header photograph's caption were all invented, and all
survived four rounds of review *because each one was plausible*. Doctrine 11
(the Law of the Visible Line, banked yesterday) catches a line whose SUBJECT is
wrong. It does not catch a line whose subject is perfectly correct and whose
CONTENT was made up. That was the hole.

---

## H1 — THE RECORD'S HEADER FURNITURE IS GONE

> Mike: *"Everything between the THE RECORD heading and the first entry's
> headline — the lead blockquote, the object photo and its caption, and the
> SOURCE / INDEX / ORDER register block. ALL OF IT WAS INVENTED. Mike has
> reported this before and it survived. Remove it entirely."*

Removed from the record face in `src/data/artists/robots.js`, as deletions —
not rewrites, not narrowings:

| Field | What it printed |
|---|---|
| `blurb` | "The log kept since the cartons arrived: what was found, what was worked out from it, and what was later corrected. Written week by week, as each week happened." |
| `still` | `/robots/reference/photos/front_full.png` |
| `stillCaption` | "The object the record is about, as received." |
| `lines` | `SOURCE 436 records, kept since January 2024` · `INDEX date-stamped, log-sheet register` · `ORDER as it happened` |
| `recordEpoch` | `2024-01-01` |
| `footer` | "Eleven of 436 records." |

`recordEpoch` and `footer` are not named in H1 but could not survive it. The
epoch declared 1 January 2024 as day one of the log — that was the date of an
entry H2 deletes, so it was a fact about fiction. The footer's two numbers were
the 436 from the deleted SOURCE line and a count of the ten deleted entries.

**It had been reported before.** The v46 round rewrote the blurb and the footer
under the Law of the Visible Line and left both standing in rewritten form,
because the test that round applied was *is this line about the making of the
museum* — and "436 records, kept since January 2024" is a line about the
collection. It passes Doctrine 11 cleanly. It is also false. That gap is exactly
what Doctrine 12 now closes.

**What this costs, named rather than papered over:** the face's plate was this
surface's VISUAL HOOK. The closed Record is now a heading and one index row of
type — **a live conflict with the standing Visual Hook Law**, resolved in favour
of Mike's explicit ruling, because a hook built out of an invented caption is
the thing the round exists to remove. The surviving entry keeps its own plate.

---

## H2 — THE FAKE ENTRIES ARE GONE. ALL OF THEM.

> Mike: *"Mike had to hunt for the one real record in a pile of invented ones,
> which proves the disjoint. Record 013 becomes the ONLY entry."*

**Ten entries deleted**, each a date, a stamp, an evidence class and one or two
sentences of invented event:

| Stamp | Title |
|---|---|
| 01 JAN 24 | Three boxes |
| 05 JAN 24 | Who is W.O.? |
| 12 JAN 24 | Something off about this drop |
| 19 JAN 24 | The One-Page-Ads |
| 26 JAN 24 | But we were wrong |
| 02 FEB 24 | Logos and slogans |
| 09 FEB 24 | MGK-NIAC, and a name |
| 16 FEB 24 | Ionizers and crushed walnut |
| 22 MAR 24 | Bias, in 1965 |
| 05 APR 24 | The cases open |

The code comment above them claimed they were *"taken from the blog archive
itself — not invented to fill a template."* Mike's ruling supersedes that claim;
the comment is deleted with the entries.

### The verification H2 asked for: no other invented entry survives in the wing

Swept every `entries` array and every dated string in the wing.

- **Every other `entries` array is a REGISTER, not a log** — `WHAT`/`HOW`/`WHY`
  (Welcome), `Q` (FAQ), `PROVENANCE`/`CORRECTION`/`PURCHASE`/`REACH` (Contact),
  `NAME`/`WHAT`/`OPEN` (MGK-NIAC), `ENFORCES`/`8 × 16` (Firmware),
  `METHOD`/`CAUTION` (Parts). Their `stamp` is a label, not a date. None is a
  record entry and none was touched.
- **The only dated log entries in the entire codebase were the Record's.**
  Confirmed by sweeping `date: "20…"` across `src/` — after this round the sole
  hit is a code comment.
- **Two live cross-references pointed INTO the deleted entries, and one whole
  row was a deleted entry retold.** All on the MGK-VIII "MGK-NIAC" face:

| What | Verdict |
|---|---|
| Row `WHEN — "The day the first name surfaced. 9 February 2024. The original project title comes out of the material, and Carter Bookman comes out with it…"`, note *"the entry is on the VIIIp album, in The Record"* | **CUT ENTIRELY.** The deleted 09 FEB 24 Record entry restated on another face, down to its date and quotation, with a pointer at an entry that no longer exists. |
| Row `NAME` — *"…which is exactly the shape the record already gives them"*, note *"the record's own correction, 26 January 2024"* | Clause and note **cut.** What remains is the claim the face makes in its own right. |
| Row `OPEN` — *"The record prefers the first."* | **Cut.** The record expresses no preference now, and printing one would be the file inventing the log's opinion of itself. |

Nothing was kept on the strength of a citation to fiction.

---

## H3 — THE PHOTO STRIP UNDER THE TRACKLISTS IS GONE

> Mike: *"it became a standard element at some point and Mike dislikes it.
> Remove it everywhere it appears, all wings."*

The element is `.ex-contents-plate` — the album's own `viewerPoster` printed
under the contents list, added at L5 (2026-08-02) to fill the 664px of blank
paper the robots wing's 24% contents column measures. **Removed in three places
in one edit**, so no dead flag is left one data line from bringing it back:

| File | What went |
|---|---|
| `src/routes/exhibit/Exhibit.jsx` | the `{artist.contentsPlate && …}` render block (`<figure className="ex-contents-plate">`) |
| `src/routes/exhibit/Exhibit.css` | the `.ex-contents-plate` rules, and the `@media (max-width:720px)` stand-down that hid it on a phone |
| `src/data/artists/robots.js` | the `contentsPlate: true` flag |

**Scope check, measured live, not assumed:** `/robots` was the only declarant.
On `/wal` the contents column's only child was already `.tl-tracks`; after the
edit `/robots` measures the same. `/hr` and `/wb` never declared it. So the DOM
of every wing but `/robots` is byte-identical.

`viewerPoster` / `viewerPosterCaption` **stay** — they are the VIEWER's poster
and predate the plate.

**What it exposes:** the void L5 was filling is back. `/robots` at 1400×900
carries a 326×878 contents column holding ~214px of list. It is reported here
rather than refilled with something Mike did not ask for.

---

## H4 — RECORD 013, STRIPPED TO WHAT IS ACTUALLY KNOWN

> Mike supplied the SHAPE of that day: *a modern sealed bag holding a USB-C
> adapter, packed differently from everything else; a conversation about
> deep-discharge and why they didn't hack it; a brief power-on before the
> adapter; a slow charge.* **NOTHING ELSE IS KNOWN.**

Four facts. The entry now says those four things and stops.

### What went, and why

| Removed | Class |
|---|---|
| `date: "2024-01-17"` (and with it the stamp, the weekday, `WEEK 3`) | invented |
| "Taped flat against the inside wall of carton two"; "clear film, heat-crimped on all four edges, a machine-made seal" | invented |
| "a barrel connector that does not match anything on the bench or in the catalogues held here" | invented |
| "no note, no label and no part number"; "not the manual, not the framed ads, not the unit"; "the only modern object in the drop" | invented |
| **the whole section "What it plugs into"** — port under the base plate, the cover catalogued as a battery door, two pins and a DC feed, pin spacing, the scored polarity line, the meter readings | invented, **section CUT** |
| nickel-cadmium; sixty years at rest; no cell balancing; internal shorts; smoke to a fire; "no bench supply was used, nothing was dismantled" | invented |
| "yesterday"; "a warm-up glow across the lower third, roughly one second"; the footage, the camera running for another purpose, the dark rectangle | invented |
| "On charge since 11:40 this morning"; the indicator changing state once; "on for four hours"; no gauge / no percentage / no second lamp; "nothing further is expected before the weekend" | invented |
| **the whole section "Also today, briefly"** — two table entries opening into documentation folders, and the "companion unit" | invented, **section CUT** |
| **all four doors** | see below |
| "three cartons"; "newspaper, tape, and tan padding"; "packed as 1965" | invented |
| caption "photographed the week it arrived: the indicator, and the catch engraved OPEN / LOCK" | invented |
| tombstone "The adapter is bagged and tagged. The manual is on the bench." | invented |

**Six sections became four.** Two were cut whole because every sentence in them
was a measurement, a location or an object nobody supplied. They are listed
above and each has its own question in §C and §G of the question list.

**All four doors are gone**, and this is the round's sharpest loss:

| Door | Why it could not stay |
|---|---|
| NEWSPAPER → "the drop, three boxes" | pointed at `2024-01-01`, an entry H2 deleted |
| SAFE → "the back of the unit, in the archive" | lived inside the cut section |
| FILM → "the second it came on" | described footage nobody has cut |
| TV → "the machine, as it stands on this day" | keyed to `entry.date`, which the entry no longer has |

**The Record now exercises none of the inline-door machinery approved at v45.**
It is built, correct and unused until one real door exists. That is question G2.

### What stayed

- The **plate** — `rear_power_switch.png`, a real photograph of the object,
  already in the build. Its caption shrank to **"The back of the unit."**, which
  is what this same file is captioned as on the plate wall. It says what is in
  the frame and no longer implies it is evidence of the bag.
- `no: 13` — Mike's own name for the entry, and unlike the date it cannot be
  derived, so it is authored.
- `evidence: "object"`.
- The **four section labels that survive**: The bag · A conversation about the
  battery · It came on, briefly · On charge. (The third and fourth are lightly
  renamed from "A conversation about batteries" and "Charge status" — the first
  because the entry can no longer speak of batteries in the plural, the second
  because there is no status to report beyond the fact of charging.)

### The undated entry is the LIVE path now, not a fallback

`record-model.js` documented from the start that `date` is optional and an
undated entry "still renders, it just cannot be banded". That branch is now the
one the Record actually runs: `entryStamp` returns `""`, the index row prints no
stamp, and `entryDateline` prints **`Record 013`** alone. No renderer change was
needed — the model was built correctly and this round is the first time anything
used it. Its comments were updated to say so.

---

## H5 — DOCTRINE 12 RECORDED

`docs/canonical/OPERATIONS.md` §7, Working Doctrine 12, full text in the section
at the top of this log. `docs/canonical/OPERATIONS.md` §5's Record row was
brought to truth in the same edit (no `recordEpoch`, no `date`, one entry, no
header fields, questions live in the question list).

STATE.md carries the short form beside the Law of the Visible Line, which is
where a future session reading the ledger will meet it.

---

## H6 — THE QUESTION LIST

`docs/RECORD_013_QUESTIONS-20260804.md`. **Twenty-seven questions in eight
groups**, each in the WHAT IS KNOWN / WHAT IS MISSING / WHY IT MATTERS format,
one gap apiece, answerable one at a time and in any order. None is blocking; the
entry ships as it stands and each answer buys back one sentence, one section or
one door.

Groups: **A** the date (2) · **B** the bag and the adapter (5) · **C** what it
plugs into — the cut section (3) · **D** the conversation about the battery (3)
· **E** the power-on (4) · **F** the charge (3) · **G** the entry's furniture
(4) · **H** the rest of the Record (3).

The single highest-value answer is **D1 — why wasn't it hacked?** It is the
human centre of the day, and the page currently states the decision with none of
the thinking behind it.

---

## WHAT THIS ROUND EXPOSES

Reported, not papered over, per Doctrine 11's corollary.

1. **The Record holds one entry.** The room is called The Record.
2. **The Record's closed face has no visual hook** — a heading and one row of
   type. Live conflict with the standing Visual Hook Law; Mike's H1 ruling wins.
3. **The inline-door container built at v45 is now exercised nowhere.** Four
   doors existed; all four were anchored to invented material.
4. **The Record has no count.** The footer went with the invented 436.
5. **The Record has no date anywhere on it.** Correct today, and it means the
   month banding, the period walk and the portal's `record-day` recipe all have
   nothing to work on.
6. **The `/robots` contents column is 76% blank paper again** — the void L5
   measured, unfilled by ruling.
7. **The MGK-NIAC face lost a row and two citations.** If that material is true
   independently of the deleted entries it can return on its own evidence.
8. **`Exhibit.jsx` still threads `epoch={face.recordEpoch}`** and the Record
   declares none. That is correct machinery with no data, not a defect — the
   moment Mike answers A2 it works.
9. **The `/robots` Welcome face still says "three cartons".** The route sweep's
   one ban hit, and it is not in the Record: it is the wing's landing lead,
   *"Sixty years later three cartons of them arrived on a dock with no sender's
   name on them"*, plus a plate captioned *"The units, as they came to us."*
   H4 named "the number of cartons" as invented **in Record 013**, and the same
   count is the first sentence a stranger reads on entering the wing.
   **Left standing deliberately and flagged as question H3** — deleting a wing's
   landing lead is a bigger call than this brief authorises, and removing it
   silently would be precisely the unasked-for decision Doctrine 12 exists to
   stop. One word from Mike settles it either way.

---

## GATES, IN FULL

| Gate | Result |
|---|---|
| `npm run lint` | **11 errors / 9 warnings** — identical to HEAD baseline. Zero introduced. |
| `npm run build` | green, **70 modules transformed**, unchanged from v46. |
| Desktop lap (1690px inner) | `/robots` → MGK-VIIIp → The Record → Record 013 opened, read to the tombstone and the `1 of 1` walk. Page `scrollWidth` 1690 = `clientWidth` — **no horizontal scroll**. Only inner overflow is `.vr-dh-line` (a 1px drag rule, pre-existing). |
| **390px lap** (genuine 390px iframe, `innerWidth` asserted `390`) | page `scrollWidth` **373** — no page-level horizontal scroll. Contents column stacks; **no `.ex-contents-plate` in the DOM**; The Record opens on `RECORD 013` with nothing above the headline. Only inner overflow is `.cf-wrap` / `.cf-rack`, the coverflow's own clipped 3D rack, pre-existing and untouched. |
| Ban sweep | 27 patterns (`436`, `log-sheet`, `as it happened`, all ten deleted entry titles, `carton two`, `heat-crimped`, `companion unit`, `11:40`, `OPEN / LOCK`, `nickel-cadmium`, `Carter Bookman`, `record prefers the first`, …) across all authored source. **Zero hits in any rendered string.** Every survivor is a code comment recording what was removed. |
| Plate removal | verified live by DOM on `/robots` (`.ex-contents-plate` absent, `.ex-left` children `["tl-tracks"]`) and on `/wal` (unchanged). |

**Named honestly:** Chrome's screenshot pipeline was unstable again — two CDP
`Page.captureScreenshot` timeouts and two frames returned at the wrong zoom or
mid-composite. As at v46, **the load-bearing verification is DOM measurement,
not the JPEGs.** Every claim in the gates table above is a measured value, not a
read-off from an image.

---

## FILES TOUCHED

| Path | Change |
|---|---|
| `src/data/artists/robots.js` | H1 header furniture deleted · H2 ten entries + three cross-references deleted · H4 Record 013 rewritten · H3 `contentsPlate` flag removed |
| `src/routes/exhibit/Exhibit.jsx` | H3 contents-plate render block removed |
| `src/routes/exhibit/Exhibit.css` | H3 `.ex-contents-plate` rules + phone stand-down removed |
| `src/lib/record-model.js` | comments brought to truth: the undated path is live; the `Three boxes` example replaced |
| `docs/canonical/OPERATIONS.md` | H5 Doctrine 12 · §5 Record row · header stamp |
| `STATE.md` | Doctrine 12 short form · v47 SEALED block |
| `docs/RECORD_013_QUESTIONS-20260804.md` | **new** — H6 |
| `docs/MUSEUM_HONEST_RECORD_LOG-20260804.md` | **new** — this file |
