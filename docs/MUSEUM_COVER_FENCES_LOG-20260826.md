# THE COVER FENCES — 2026-08-26

**Built from `f366d37`, clean tree. Nothing committed, nothing pushed, nothing
deployed. NO COVER WAS REGENERATED, REDRAWN OR CHANGED.** Every generator run in
this round was run **against a copy** in a scratch tree, never against
`C:\AI\Projects\weird-baby-museum\public`.

The survey this acts on is `C:\AI\_night-20260826\ALBUM_ART_SURVEY-20260826.md`.

---

## 0 · THE RULINGS, AND THEY ARE PROVISIONAL

Mike ruled three, and ruled them **A, B, B**. He then said what the three
rulings are worth, and it is the load-bearing half:

> **"For now at least. I will not know until I start looking at the entire
> site."**

| ruled | his answer | register row |
|---|---|---|
| The grey albums lose the W.B logo, and the fade comes back with it | **A** — remove it anyway | [A-a](OPEN_ACTIONS.md#a-a) |
| Does the ROBOTS sleeve — his own art — keep its logo | **B** — *"the Foundation's sleeve keeps its wording for now"* | [A-b](OPEN_ACTIONS.md#a-b) |
| Do the nine PNGs follow the glass to the backslash | **B** — *"`WEIRD.BABY MUSIC` stays as it is for now"* | [A-c](OPEN_ACTIONS.md#a-c) |

**ALL THREE ROWS CARRY `OPEN — PROVISIONAL` IN THE STATUS COLUMN, AND HIS
SENTENCE IS IN EACH OF THEM VERBATIM.** They are not in
`OPEN_ACTIONS_CLOSED.md`, they did not leave the register under Doctrine 24, and
two of them have short-list lines (67, 68) saying what he still owes: *his walk
of the site, then a confirmation or a different call.*

**A LATER ROUND MUST NOT READ THEM AS SETTLED.** M26 is the precedent and it is
four days old: `foundation.js` cited an **open register row** as doctrine, and
the wing-names round found it. A provisional ruling is closer to an open row
than to a closed one.

**AND NOTHING WAS REMOVED ON RULING A.** The logo is still on all five grey
sleeves. This round built fences; it changed no cover. Protection does not wait
on a look, and neither does the look wait on protection.

---

## 1 · THE FENCES — one set, five tools

`tools/cover_fences.py`, new. **It writes nothing.** It is imported by every
generator that can write an album cover.

### WHY IT IS ONE SET AND NOT FIVE

`make_unit_covers.py` carried the fence alone from 2026-08-10, and its own
argument for listing a file it does not write is the argument for moving the
list out of it:

> *"a fence that only lists what a tool happens to write today stops being a
> fence the first time somebody adds a row to UNITS."*

Read one step further out: a fence that lives inside ONE tool stops being a
fence the first time somebody reaches for a DIFFERENT tool — **and that was
already true of three of them.** The fence was on the retired tool that writes
nothing, and absent from the four that write these exact paths.

### WHAT IS FENCED

**`HAND_AUTHORED` — five files, no generator may write them, ever.** Mike's
2026-08-10 ruling, *"all four wing covers are now hand-authored"*, plus a fifth:
`vol1-cover.png`, which was not hand-authored when that list was written and
became so two days later. Each name carries its own reason in the set — who made
it, when, at which commit, and what a run would replace it with.

**`SUPERSEDED` — one tool, retired for its own output.** A different reason and
therefore a different exception. Nothing `make_foundation_covers.py` writes is
hand art; what is wrong is the TOOL. Its own docstring has said it is superseded
since 2026-08-06, and **a tool superseded in a docstring and live in
`package.json` is superseded in a docstring only.**

### THREE PROPERTIES, EACH PAID FOR BY SOMETHING ALREADY IN THIS TREE

**IT MATCHES ON THE BASENAME.** §8's *A GOVERNED PICTURE HAS TWO ADDRESSES, AND
ANYTHING THAT MATCHES ON ONE OF THEM IS WRONG.* `mgk-niac-cover.png` lives at
`public/held/robots/art/` and is declared at `/robots/art/`. A path-keyed fence
protects one address and leaves the other open. Proved on four spellings of one
file in §2C.

**IT REFUSES BEFORE THE FIRST WRITE, NOT AT THE OFFENDING ROW.** `guard()` takes
the whole set a run intends to write. A tool that writes four covers and raises
on the fifth has half-finished its job. **Refusing a run is a state; refusing a
run halfway is a mess.** `--dry-run` is guarded on the same reasoning — a dry run
printing `would write vol1-cover.png` is the misleading line the fence exists to
prevent.

**IT PRINTS, IT DOES NOT TRACEBACK.** `run_main()` catches **only** the two
fence exceptions — every other error still raises with its full stack — and
writes the refusal to stderr with `exit 1`. A ruling printed under nine lines of
Python stack is a ruling the reader scrolls past, which is THAT before WHY: the
exact order this fence exists to reverse.

---

## 2 · THE PROOF — every fence tripped, against a copy

A scratch tree at `…\scratchpad\fence-proof\` holding `tools/` and the twelve
PNGs. **Its baseline sha256s match `provenance/asset-table.json` exactly**
(`206091eb…`, `8bb00437…`, `cafb2b47…`, `63b0a75f…`, `61e1cb86…`, `eaf63685…`),
so the copy is the tree.

### A · EVERY TOOL REFUSES, AND EVERY ONE EXITS 1

| command | refuses on | exit |
|---|---|---|
| `make_house_covers.py` | `vol1-cover.png` | **1** |
| `make_house_covers.py --dry-run` | `vol1-cover.png` | **1** |
| `make_house_covers.py --only vol1-cover.png` | `vol1-cover.png` | **1** |
| `make_robots_cover.py` | `wbr-cover-logo.png` | **1** |
| `make_template_covers.py` | `mgk-niac-cover.png` (+ names the second) | **1** |
| `make_foundation_covers.py` | retired for all three of its outputs | **1** |
| `make_unit_covers.py` | `mgk-niac-cover.png` — **unchanged behaviour** | **1** |

**THE FIRST HARNESS REPORTED `EXIT 0` ON ALL OF THEM AND WAS WRONG.** It piped
python into `tail` and read the pipeline's exit code. §0's *IF A RESULT SURPRISES
YOU, SUSPECT THE PROBE* arriving from the direction that does not announce
itself: the refusal text was correct and visible, so the wrong number sat under
a right-looking result. Re-measured with the exit code captured directly.

### B · EACH STILL WRITES WHAT IT LEGITIMATELY OWNS

| command | wrote | result |
|---|---|---|
| `--only about-cover.png` | 1 file | **sha256 UNCHANGED** |
| `--only foundation-cover.png,ledger-cover.png,contribute-cover.png,worth-a-listen-cover.png` | 4 files | **all four sha256 UNCHANGED** |
| `--only nope.png` | nothing | exit 1, prints the six names it writes |

**ALL FIVE LEGITIMATE COVERS REWROTE BYTE-FOR-BYTE IDENTICAL.** That is a
stronger result than the round needed and it proves two things at once: the
template still reproduces the shipped sleeves exactly, and the fence did not cost
the legitimate path anything.

**AND AFTER ALL NINE RUNS, EVERY ONE OF THE TWELVE FILES IN THE COPY IS
UNCHANGED BY sha256** — including all five protected ones.

### C · THE FENCE IS PATH-KEYED, NOT TOOL-KEYED

Because four of the five tools now own nothing they may write, "it still writes
what it owns" cannot be shown by running them. It is shown directly instead:

- **all five tools PASS** on `some-new-cover.png` — nothing protects it;
- **all five tools RAISE** on all five protected names, 25 of 25;
- **four spellings of one file all refuse** — `public/held/robots/art/…`,
  `public/robots/art/…`, an absolute Windows path, and the public ref
  `/robots/art/…`;
- **`SUPERSEDED` is correctly tool-scoped**: `make_foundation_covers.py` is
  refused `ledger-cover.png` and `make_house_covers.py` is allowed it.

### D · WHAT THE FENCE COSTS, STATED PLAINLY

**FOUR OF THE FIVE GENERATORS NOW REFUSE EVERY RUN**, because every path they
own is protected or superseded. That is not a side effect — it is the true state
of those tools, and it has been true since 2026-08-10 without being enforced.
`make_house_covers.py` is the only one with live output, reachable through
`--only`.

---

## 3 · `--only` — the backlog's other half

**`docs/BACKLOG.md` item 2 said *"regenerate the cover from
`tools/make_house_covers.py`"*, and the tool had no way to regenerate one
cover.** A round doing exactly what the row said, with Mike's own *as soon as
feasible* on it, would have destroyed his vinyl master while reporting six
successful writes.

Both ends are closed:

- **the row names its target** — `public/images/wb/about-cover.png` — and
  carries `npm run covers:house -- --only about-cover.png`;
- **the tool would refuse the old row anyway.**

`--only` takes basenames, matched against `COVERS`. **An unknown name is an
error, not a silent empty run** — a typo that writes nothing and exits 0 reads
exactly like a fence firing, and the two must never look alike.

The row also now carries what the survey found and the backlog could not have
known: the rename lives in `weird-baby.js` so **the render is the LAST step of
that item, not the first**, and its strapline `WEIRD.BABY MUSIC` is a string
authored nowhere but inside a picture — which is [A-c](OPEN_ACTIONS.md#a-c),
ruled provisionally, and must be carried unchanged until he has walked the site.

---

## 4 · THE FOUR STALE SENTENCES

All four described `wbr-cover-logo.png` as this repository's own output. **Two
of them carried *"a re-render cannot drift"*, which is not merely stale — it
reads as permission.**

| where | was | now |
|---|---|---|
| `src/data/artists/robots.js` (S10 block) | *"Generated by `make_robots_cover.py` — not hand-composited, so a re-render cannot drift."* | kept as the record of the PLACEHOLDER and of Mike's S10 ruling, with the claim about the file retired and the measurement beside it |
| `src/data/artists/robots.js` (wbr-logo entry, written by `f366d37`) | *"from `tools/make_robots_cover.py:72`"* | source corrected; and `PURVEYORS OF THE WEIRD` named as the house strapline, not a wing name |
| `provenance/asset-table.json` → `what` | *"Generated by tools/make_robots_cover.py."* | **NOT GENERATED**, with the date and the commit |
| `provenance/asset-table.json` → `qualityNote` | *"generated rather than composited by hand, so a re-render cannot drift"* | both halves named wrong, with the pixel numbers |
| `reveal/ledger-declare.mjs` `route.wb` | *"[A3] the sleeve was rebuilt on the robots template"* | true on 2026-08-06 and superseded on 2026-08-12; named, because **that array is a publish list** |

**`provenance/assets.json` WAS ALREADY RIGHT AND IS UNTOUCHED** — `MIKEY_ART …
Not generated` since 2026-08-10. The other surfaces were conformed to it, not
the other way round.

**`verdict` AND `bucket` ARE UNTOUCHED ON EVERY ROW.** They are Mike's and Ops
does not write them. Only `what` and `qualityNote` moved, which the table's own
header rules are Ops'. The re-serialisation moved **two lines and no others**.

---

## 5 · `--verify` — said, deliberately not wired

**RED SINCE 2026-08-09, AND NOTHING RUNS IT.** It is in no gate, no packet
ritual and no npm script, so seventeen days of red went unseen.

**419,442 differing pixels; 303,783 by more than 16 of 255; max delta 255.** The
mark, the word, the rule and the strapline all differ; the border does not. **It
is not drift — the comparand changed.** The template's rule falls at rows
**992–995**; the shipped file's at **1061–1064**, which is the landmark
`make_template_covers.py` records as measured off `NEW Robots.png` and which
register row [L-d](OPEN_ACTIONS.md#l-d) already cites.

**WHAT WOULD RUN IT:** a comparand this template owns. The five house sleeves are
pixel-identical to `build()` — §2B proved it byte-for-byte — so `--verify`
against any of them is green today and proves the same geometry claim.

**IT IS A ONE-LINE REPOINT AND IT IS NOT MADE HERE.** A check that has been wrong
for seventeen days should be repointed by a round that then watches it, not by a
round building fences. And it must not join §9's list before it can pass — a gate
that always fails is read as noise and then skipped, which is the
tripwire-disabling failure this repository has recorded twice.
[Q-b](OPEN_ACTIONS.md#q-b) makes the identical argument about `facts:gate`.
Registered as [A-d](OPEN_ACTIONS.md#a-d), owned by Code.

---

## 6 · A DEFECT OF MY OWN, AND IT IS THE BACKSLASH CLASS AGAIN

Writing the register rows through a heredoc raised
`SyntaxWarning: invalid escape sequence '\M'`. **The source I typed and the
source Python parsed were not the same text** — a layer between them ate a
backslash, Python read the survivor as an invalid escape and kept it literal, and
the result was correct **by accident**.

`MUSEUM_WING_NAMES_LOG-20260826.md` §3 recorded this class four days ago in
JavaScript: *"a backslash in a JS string literal cannot be checked by reading it.
Evaluate it."* It is not a JavaScript fact. **It is a fact about every layer a
backslash passes through**, and a heredoc is one of those layers.

**MEASURED RATHER THAN READ:** each of `WEIRD.BABY \MUSIC` and
`WEIRD.BABY \FOUNDATION` carries **exactly one** backslash in the file on disk,
counted by parsing the row back out. Filed as a §8 hazard row.

---

## 7 · WHAT WAS NOT TOUCHED, AND WHY

- **No cover.** Not one file under `public/` changed. This round is the fences.
- **`provenance/assets.json`** — already correct.
- **`verdict` and `bucket`** — Mike's fields.
- **`reveal/ledger.json`** — only `ledger-declare.mjs`'s COMMENT moved; no id,
  no row, no `name`. `--write` was not run, so the M99 guard was not engaged.
- **The seven ledger `name` fields carrying pre-backslash wing names** — left,
  on the same reasoning `f366d37` gave (§8c of its log): *NO ID MOVES WHEN A
  LEGEND IS RECUT*, and it is a separate mechanical job.
- **`package.json`** — the four npm scripts stay. A script whose tool refuses
  and says why is more use than a deleted script that leaves a `covers:foundation`
  in somebody's shell history with no explanation.
- **The MGK-NIAC colour flag** — the survey measured that sleeve at 22.86% of
  pixels above chroma 30 against 0.00% for the other two. It is **held**, so
  nothing publishes wrong today, and whether it is one of Article 4's colour
  family shots is Mike's word.
