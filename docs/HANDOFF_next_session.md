<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# HANDOFF — for the next Ops session

**Written 2026-08-31, at the close.** Session-scoped only: what Mike ruled,
what landed, and what is waiting. Process lives in
`docs/canonical/OPERATIONS.md`; standing rules are not repeated here.

**This was a writing session.** The manual stopped being a structure and
started being a document.

---

## 1 · MIKE'S RULINGS, AND THEY ARE THE SPINE OF EVERYTHING BELOW

**THE FIVE BLANK SCANS DO NOT PUBLISH.** The six-file hold is dead and
replaced. `scan-31-a.webp` is **killed** — it is the unmarked twin of
`marked-01-a.webp` and the museum does not need both. The four remaining
blank scans come off the 2026-09-09 schedule. **`marked-01-a.webp` stands on
the ninth exactly as it is.**

**THE MANUAL IS OPS' TO WRITE.** Not held, not deferred, not waiting on a
photograph — written, with seeds requested from Mike where the corpus fixes
nothing. That is the reversal the whole session runs on, and it is why
Appendix B and Section V now carry prose.

**`CODE:` PRINTS ON EVERY ROW OF TABLES B-1 AND B-2, AND IT IS NOT A
PLACEHOLDER.** A bracketed `[ ... REQUIRED ]` is Ops telling Ops a position is
unwritten. `CODE:` is the document telling whoever holds the sheet that a code
goes here and the sheet is where it gets written. It is the printed half of
the pen channel.

**`Offensive` RANKS BELOW `Uncouth`, AND THE DEFINITIONS DO NOT TRAVEL WITH
THE LABELS.** The NAME column keeps the sequence it had; the label above it
changes. `Offensive` took what `Uncouth` said and `Uncouth` took what
`Offensive` said. Rows three to five are unmoved in both columns.

**THE DOOR IS SETTINGS, NOT PREFERENCES.** The menu map's four doors are
ANSWERS / PROGRAMS / MESSAGES / SETTINGS. `Preferences` is the firmware's own
row name and is a real-build fact; the map is the in-story authority.
**Whether there are three doors or four stays open** and B-3 does not touch
it.

**INCLINATION GETS NO ROUTE.** Only Polarity and Clarity are reached from the
Settings door. Inclination keeps its mention in B-1 and its reserved Table
B-3 and gains nothing else. The object agrees by saying nothing: `inclination`
appears nowhere in the firmware.

---

## 2 · WHAT LANDED

| commit | repo | what |
|---|---|---|
| **`656d037`** | robots | `emit_table` and its dispatcher learn to carry rows and a foot. Appendix B's `B-3` written; Tables B-1 and B-2 filled. Section V's nine paragraphs and Table 5-1 written; `5-15` and Figure 5-1 reserved on purpose. |
| **`a878206`** | museum | `docs/FINDING-manual-index-drift-20260830.md`. The sheet index moves under growth and the printed label does not; today's drift measured per published asset; nothing repointed. |
| **`80f1874`** | robots | Per-table column stops. `CODE:` per row. B-2 re-ranked with the definitions held still. B-3 rewritten in the document's own vocabulary. Inclination given no route. |
| **`146136c`** | museum | The two viewer pages — five zoom steps, 25% and 50% below fit for page mass, 100% and 200% with drag-to-pan for type. |
| **`e31b4d6`** | museum | The seven plates at 1700x2200 WebP q82, 0.73 MB. A clone can now open the viewer without re-rendering anything. |

**Nothing deployed.** Deployed is still `3ccbad9`, stage **launch**, 2026-08-29.

---

## 3 · THE STATE THAT MATTERS, AND IT IS A TRAP

**THE DOCUMENT LAYS OUT AT 64 SHEETS. THE RENDERED LEAVES ON DISK ARE 63.**

`structure/pages/` has not been touched since before this session began —
`dc38450e1036a4231de86f34526d2252593d2cdc47909830611ed3ce1bee96ee` over its 63
leaves and the one marked page, byte-identical at every checkpoint today.
Every render this session went to a scratch directory. `main()` was never
called, because `main()` deletes every PNG in `pages/` and in `pages/marked/`
before rewriting them.

**EVERY GATE IS GREEN BECAUSE EVERY GATE MEASURES DISK.** `manualPages()`
reads the highest `NN` off the files in `structure/pages/`, so it answers
**63**, and `OPEN_ACTIONS.md` row E-b's *"The manual is 63 pages"* matches it.

> **THE FIRST DEFAULT-PATH RUN OF THE GENERATOR TURNS ROW E-b RED.** The
> moment somebody runs `python tools/manual_structure_build.py` with no flags,
> `pages/` becomes 64 leaves, `manualPages()` answers 64, and
> `docs:numbers:gate` fails on a claim that is true this minute. That row's
> count is one the gate's own note says is *"REPORTED, NEVER CORRECTED:
> editing them edits the sentence Mike is being asked to rule on."*

**And at the same instant the four `MANUAL_PAGE(32/33/34/47)` literals start
naming different leaves, and nothing will refuse them** — 32, 33, 34 and 47
are all still ≤ 64 and all four files still exist. That is the drift
`a878206` measured. **Nothing is repointed and nothing should be until the
writing stops**, because every section written moves it again: this session
moved it twice and moved it back once.

---

## 4 · THE INVENTORY — 134 reserved positions, classified

Taken off `BODY` this session. **95 `[ TEXT REQUIRED ]` · 10 `[ ART REQUIRED ]`
· 27 `[ ENTRIES REQUIRED ]` · 2 `[ EXPANSION REQUIRED ]`.**

| | count | meaning |
|---|---:|---|
| **WRITE** | **62** | the corpus already holds enough to write it |
| **SEED** | **55** | needs one fact from Mike; each named in one sentence in the round report |
| **CUT** | **17** | nothing behind it and the document is better without it |

Roughly half the document can be written from what the corpus already holds.
About a quarter of the SEEDs are art, which is Mike's camera or Mike's hand.

> **THE CUTS WAIT UNTIL THE WRITING IS DONE.** Cutting a position renumbers
> everything after it, and **paragraph numbers are what the pen points at** —
> `marked-01-a` carries `SEE 7-14` in Mike's own hand, and B-1's published
> prose points at B-3 and at three tables. A cut made now silently re-aims a
> mark that is already on a published sheet. Do the writing, then cut, then
> re-render once.

---

## 5 · WHAT IS WAITING, AS OF THIS PACKET

**Mike's, none blocking:**

- **The marked-copy pin.** `MARKED_PAGES` is keyed on the page label, so `B-1`
  survived moving from sheet 47 to 48 this session where an index key would
  have laid four strike-throughs across Appendix A. What that does *not* solve
  is a label staying correct while the page under it changes: `ASK ENGINEERING`
  was written beside B-3's `[ TEXT REQUIRED ]` and B-3 is prose now. Five
  options were put with their costs and none ranked.
- **`entry`** carries eight occurrences in B-3 and `MANUAL_VOCABULARY` fixes no
  meaning for it. It is the paragraph's most-loaded noun and the only one with
  no attestation.
- **`the Factor`** as a second-reference short form is unattested; **`Bias
  Strength Factor`** is the expansion the retired draft gives for `BS-Factor`
  and the live document carries it nowhere, including Appendix G.
- **Table B-2's rank against the passcode order.** The firmware enum and the
  2024 manual's passcodes run `Uncouth · Offensive · …`; the printed table now
  runs the other way. A code travels with the enum position, not the printed
  row. Matters the day the CODE column is filled.
- **Figure 5-1's 84 mm** would not fit under Table 5-1, so it pushed to sheet
  5-2 and left about thirteen blank rows at the foot of 5-1.
- **Section V holds nine paragraph positions** against a packet that said
  eight.
- **The `Co-Authored-By` trailers** on all five of this session's commits, kept
  because this repository's history carries them on every commit.
- **¶5-15 COMPLETION OF THE FACTORY TEST** is Egg 1's printed half. The
  diagnostic monitor's graph window has read `TEST` since the factory and what
  the procedure *is* has never been written down by anybody.

**Ops', none blocking:**

- **`docs/FINDING-manual-index-drift-20260830.md` says 65 in its prose** and
  the document is 64. Its drift table is still exact; only the total went
  stale, inside one packet, which is the thing the finding predicted.
- **`docs/canon/07-MANUAL.md`'s Extent cell** says 63 pages and asserts that
  `len(doc.pages)` and the leaves on disk *"agree exactly"*. They no longer do.
  Its *"30 reserved tables"* is now 27 reserved and 3 filled. Not in
  `numbers-gate`'s scope, so nothing reports it.
- **`mock-manual-six-20260830.html`** is untracked and superseded — it inlines
  base64 of the six already-published scans and predates the viewer.

---

## 6 · THE MANUAL HOLD IS STILL UNAPPLIED AND M61'S CLOCK IS RUNNING

**`docs/PREPARED-manual-hold.md` has not been applied and nothing in it was
touched all session.** It is the one-commit landing for holding the six manual
scans behind the stage door, and it remains what it has always been: the
change written out, not the change.

**M61's clock is 2026-09-09 at 17:00 America/New_York.** Read out of
`__WB_RECORD_ASSETS__` (`vite.config.js:613-614`) and `RECORD_HOUR`
(`reveal/record-clock.mjs:89`), not computed. On that day, as the tree stands,
all six publish.

**Mike's ruling this session changes what should be on that schedule** — five
of the six do not publish and `scan-31-a` is dead — **and nothing has been
built to carry it.** That is the largest single thing waiting.

---

## 7 · STATE, IN ONE READING

- **Deployed:** `3ccbad9`, stage **launch**, 2026-08-29. Nothing deployed since.
- **`day:proof`:** 1 of 49, exit 1 — the standing residual, Record 005 refused
  by guard 6. **Read, never run this session.** Running it bumps the Record's
  mtime and closes guard 8's landing window; both files still stamp
  `2026-08-30 11:03:14`, exactly where the last handoff left them.
- **Gates:** `lint` 9 errors / 7 warnings (the standing baseline, zero new) ·
  `build` 0 · `provenance:gate` 0 · `docs:numbers:gate` 0 · `shellstop:gate` 0.
  `assets:gate` is red by design — the Mike-approval gate, 0 of 49 signed.
- **The protected set:** `structure/pages/` and `structure/pages/marked/` at
  `dc38450e…`, 63 leaves and 1 marked, unchanged all session. The PDF was not
  rebuilt.
- **The next autonomous event is 2026-09-07 at 17:00** — the wing opens, Record
  001 appears, the countdown removes itself. Nothing has to be deployed for it.
  `docs/FINDING-autonomous-timeline.md` is the day-by-day.
- **To read this session's work:** `npm run mock`, then
  `http://127.0.0.1:8899/mock-appendix-b-firstpass-20260830.html` and
  `…/mock-section-v-firstpass-20260830.html`. The plates are in the tree; no
  re-render is needed.
