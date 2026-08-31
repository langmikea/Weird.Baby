<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# HANDOFF — for the next Ops session

**Written 2026-08-31, at the close.** Session-scoped only: what Mike ruled,
what landed, and what is waiting. Process lives in
`docs/canonical/OPERATIONS.md`; standing rules are not repeated here.

**Two things happened today.** The manual scans came out of Record 003 for
real rather than on paper, and Section VI was written end to end.

---

## 1 · MIKE'S RULINGS

**THE BLANK SCANS WERE EARLY SCAFFOLDING AND THE REFERENCES ARE KILLED, NOT
HELD.** They were something to start releasing the manual with and they are
not important to the story. Scan 07, Scan 11 and Scan 31 come out of Record
003 **entirely — attachments and plates both** — and the five files are
deleted rather than moved behind the stage door. **`marked-01-a.webp`
survives untouched and publishes 2026-09-09 at 17:00.** Record 003's
DETAILED REPORT is not edited by this. **Mike will attach something that
fits the story when he writes it**, and that is the intended end state, not
the one-attachment entry the tree now holds.

**THE MANUAL'S FOUR DOORS TAKE THE MACHINE'S OWN NAMES** — MGK-VIIIp ·
Messages · Programs · Preferences. The menu map's ANSWERS / PROGRAMS /
MESSAGES / SETTINGS is a proposed arrangement and is not what the instrument
prints. **This retires yesterday's ruling that B-3's door is Settings**,
which read Doctrine 18 as making the in-story manual the authority here. It
is not: the doctrine makes the manual the authority for the in-story
SPECIFICATION — what the machine IS — and a door name is not a specification.
It is a string a visitor reads on the glass, and the manual does not get to
rename what is printed on the instrument. Both rulings and their dates are
recorded in a comment beside `BODY_B_3` so a later sweep does not reverse it
a third time.

---

## 2 · WHAT LANDED

| | repo | what it cost |
|---|---|---|
| **`26cdee1`** | museum | The removal written out as a landing document, **unapplied**. 504 lines, and the file that made the next commit a checklist rather than a design. |
| **`617c1ba`** | museum | **THE REMOVAL IS APPLIED.** Not prepared, not scoped — the `docs:` block and five `git rm` in one commit, plus the regenerated registers. 8 files, 334 insertions, 39 deletions. |
| **`b859e28`** | robots | Section VI written whole, the door corrected, the `CODE:` comment's false claim corrected, the ask-cycle caption and index row retired, the Rule 5 claim cut. 281 insertions, 25 deletions. |
| **`b00b5b2`** | robots | `docs/MANUAL_WRITING_BOOT.md`, 284 lines. |
| **`0b2a21a`** | museum | The Section VI viewer and its seven plates; Appendix B's page and its one changed plate. 10 files, 97 insertions. |

**Nothing deployed.** Deployed is still `3ccbad9`, stage **launch**,
2026-08-29. `main()` was never called, the structure PDF was not rebuilt, and
`day:proof` was read and never run.

---

## 3 · THE STATE THAT MATTERS

### `docs:numbers:gate` IS RED, AND HAS BEEN SINCE `617c1ba`

**And it was under-reported in that packet, which is the part worth knowing.**
The landing document's §6.2 called for `npm run docs:numbers`. That was run,
it prints the stale values as advisory, and **it exits 0** — which is what was
reported. **The `--gate` variant was not run, and it exits 1** on the same
three. So the packet's own gate table was accurate about the command it ran
and silent about the one this file tracks.

**Three stale instances of one claim: the asset table's row count, published
475 against 489 measured.** The cause is that packet's mandated
`assets:scan`, which swept in 14 plate and scratch files dating from
2026-08-30 that the table had never seen. **The removal added no rows** — it
flipped five to `missing: true`.

**Two of the three are correctable and one is not.** `CLAUDE.md:479` carries
it twice and is an ordinary document. The third is at
`docs/canonical/OPERATIONS_ARCHIVE/ROUND-LOGS.md:491`, and the gate's own
closing line is *"Correct the document — and never a round log."* It forbids
editing that file and reads it anyway. **Correcting `CLAUDE.md` clears two of
three and leaves the gate red on a line nobody is permitted to touch.**

**That is a defect in the gate's read-set, and it is Ops'.** The gate already
exempts `STATE.md` by name for exactly this reason, so the shape of the fix
exists; `OPERATIONS_ARCHIVE/` wants the same treatment. Do not clear it by
editing the round log.

### THE DOCUMENT LAYS OUT AT 67 SHEETS AND 63 LEAVES ARE ON DISK

**The gap widened every packet today** — 64 at the open, then 65, 66, 67 as
Section VI grew from four sheets to seven. `structure/pages/` has not been
touched: `dc38450e1036a4231de86f34526d2252593d2cdc47909830611ed3ce1bee96ee`
over its 63 leaves and the one marked page, read fresh at every checkpoint
today and identical at all of them.

**Every gate is green on this because every gate measures disk.**
`manualPages()` reads the highest `NN` off the files, so it answers 63, and
`OPEN_ACTIONS.md` row E-b matches it. **The first default-path run of the
generator turns that row red** — and the gate's own note says its count is
*"REPORTED, NEVER CORRECTED"*, because editing it edits the sentence Mike is
being asked to rule on.

### APPENDIX B'S FIRST LEAF MOVED FOUR TIMES TODAY AND NOTHING IN IT WAS EDITED

`B-1` went **48 → 49 → 50 → 51**, once for each packet that added a sheet to
Section VI. `provenance/assets.json` still names
`robots/mgk-viiip/manual/structure/page-47.png` as its master, and
`docs/FINDING-manual-index-drift-20260830.md` — which measured the first move
— is now three behind.

**Nothing is repointed and nothing should be until the writing stops**, per
the standing ruling. Every section written moves it again. The finding's
account of *why* is still exactly right; only its numbers are stale.

### FOUR LEDGER ROWS SURVIVE CLAIMING A PLACEMENT THAT NO LONGER EXISTS

`doc.manual.page.32`, `.33` and `.34` were left true-shaped and false by the
removal: their refs still resolve because the asset-table rows are **kept**
with `missing: true` and their `ref` intact, so nothing refuses them. Each
still prints *"an attachment on the Record entry that calls for it"* and *"a
frame in THE MANUAL's reader"*, and neither is so.

**`doc.manual.page.47` is the fourth, and the landing document predicted it
would come out right.** It did not. It still carries **two** assets —
`scan-31-a` alongside `marked-01-a` — because the same kept `ref` resolves.
The document's §5 chain explains why its own §4 prediction was wrong.

`reveal:check` passes and prints *"every asset uid resolves in the asset
table"*, which is precisely the blind spot. Fixing it is an edit to
`ledger-declare.mjs`, outside every change made today.

---

## 4 · THE MANUAL

**SECTION VI IS COMPLETE.** Seventeen text positions and both tables. Only
the two figure frames are reserved, and those are art.

> **THE COUNT IN THE PACKETS WAS NINETEEN AND IT IS SEVENTEEN.** Fourteen `P`
> and three `SP` — `6-1 6-3 6-5 6-9 6-11 6-13 6-15 6-17 6-19 6-21 6-23 6-25
> 6-27 6-29`, and `6-4 6-6 6-7`. Ops wrote "nineteen (16 P + 3 SP)" in the
> first Section VI report, and it travelled through five packets unchallenged
> because it was never re-measured. Nothing was written wrongly; the number
> describing the work was wrong. **Corrected here rather than carried, on
> this file's own rule about tripwire numbers.**

**`robots:docs/MANUAL_WRITING_BOOT.md` exists and is pasted once per session
before any manual packet.** It carries the standing rules — the protected
set, scratch-dir rendering, the verbatim check, the sweep and its standing
instruction to flag what you would not keep, the no-counts rule, Doctrine 18
in both directions, `determination` for the noun, measuring cells with
`wrap()`, verifying a served page by URLs read off it, and the report shape.
Each rule carries the cost that bought it. **It carries no per-session
values, deliberately, and the protected-set digest least of all** — it is a
measurement, and it means nothing unless read from the tree in the packet
that cites it.

**Four words were retired after sweeping** — `the readings`, `roster`,
`through the microphone`, and a count of shakes. None was caught by a
mechanical check; all four came out of the standing instruction to flag what
you would not keep.

### The inventory, re-measured

**113 reserved positions**, down from 134 at the last handoff: **78 text · 25
table bodies · 10 art.** Thirty text positions and five tables are now
written.

> **THE CUTS STILL WAIT UNTIL THE WRITING IS DONE.** Unchanged and still
> load-bearing. Cutting a position renumbers everything after it, and
> **paragraph numbers are what the pen points at** — `marked-01-a` carries
> `SEE 7-14` in Mike's own hand. Do the writing, then cut, then re-render
> once.

---

## 5 · WHAT IS WAITING

### Mike's

- **Whether Rule 5 binds the MGK-VIIIp.** *No adaptive learning — the machine
  is forbidden, in writing, from getting to know you* is published on the
  **NIAC's** specification face. The VIIIp's carries a different sentence.
  A paragraph at 6-27 asserted it in the instrument's own voice and was cut;
  the canon records that the rule and the learning-machine reading *"are not
  reconciled anywhere"*. **Not urgent.** The cut and the reason are in a
  comment beside `BODY_6_27` so it is not written back in good faith.
- **What replaces the three killed scans on Record 003.** The entry is a
  one-attachment entry until then, and its DETAILED REPORT names three
  recoveries it no longer declares. No gate sees it; a reader would.
- **The marked-copy pin.** `marked-01-a` carries `SEE 7-14` in his hand
  against a sheet index that has moved four times today. What the mark points
  at is a printed label and stable; what a register names is an index and is
  not.

### Ops'

- **`docs:numbers:gate`'s read-set** — §3. The fix is an exemption shaped
  like `STATE.md`'s, not an edit to a round log.
- **The CAUTION and warnings pass, over the whole document.** Deferred
  deliberately this session. Section VI's detector paragraph currently
  carries as body copy what the salvage carried as a CAUTION, which may be a
  demotion; the safety summary's `[ FURTHER WARNINGS AND CAUTIONS REQUIRED ]`
  is the other end of the same job.
- **The three drafting-state strings.** `STRUCTURE ISSUE`, `REV. -
  / PRELIMINARY`, and the cover's `[ ISSUING IDENTITY, DATE AND SIGNER TO BE
  SUPPLIED ]` describe the document's own drafting state — Doctrine 11's
  subject test. **They are correct for a structure issue and wrong on a
  finished manual, and nothing in the tree marks when that transition
  happens.** No gate will raise it; the issue changes character quietly.
- **The packets have been naming a path that does not exist.** The protected
  set's second directory is `structure/pages/marked/`. **`structure/marked/`
  is not a thing**, and it is what every packet this session said. No harm
  came of it — the digest recipe has always globbed the real location — but a
  session told to protect a path that is not there has protected nothing.
  Corrected in the writing boot; **the packet template still says it.**

---

## 6 · STATE, IN ONE READING

- **Deployed:** `3ccbad9`, stage **launch**, 2026-08-29. Nothing deployed
  since.
- **HEADs:** museum `0b2a21a`, robots `b00b5b2`, both pushed and level with
  `origin/main`. Museum tree clean; robots holds three untracked scratch
  directories, which stay untracked.
- **Gates:** `lint` **9 errors / 7 warnings** — the standing baseline, zero
  new · `build` **0** · `provenance:gate` **0** · `shellstop:gate` **0**, and
  neither document added today needs a guard because neither names a deploy ·
  **`docs:numbers:gate` 1 — see §3** · `assets:gate` red by design, the
  Mike-approval gate.
- **`day:proof`:** 1 of 49, exit 1 — the standing residual, Record 005 refused
  by guard 6. **Read, never run this session**, so the landing window it would
  close is still open.
- **The protected set:** `structure/pages/` and `structure/pages/marked/` at
  `dc38450e…`, 63 leaves and 1 marked, unchanged all session. The PDF was not
  rebuilt and still carries its 19 August mtime.
- **The next autonomous event is 2026-09-07 at 17:00** — the wing opens,
  Record 001 appears, the countdown removes itself. Nothing has to be deployed
  for it.
- **To read this session's work:** `npm run mock`, then
  `http://127.0.0.1:8899/mock-section-vi-firstpass-20260831.html`, and
  `…/mock-appendix-b-firstpass-20260830.html` beside it. The plates are in the
  tree; no re-render is needed. A mock server may already be listening on
  8899 — `EADDRINUSE` is not a failure, and it is not this session's to kill.
