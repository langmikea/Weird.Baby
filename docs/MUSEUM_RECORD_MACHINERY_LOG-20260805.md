# RECORD MACHINERY — round log · v55 · 2026-08-05

**The brief:** Mike is about to produce the Record's first two weeks in voice
sessions. This round builds what must exist to catch what he says.
**Doctrine 12 governs the whole of it: build the vessels, invent no contents.**

Nothing in `src/` was touched. No visitor-facing string changed. No page moved.
The museum looks exactly as it looked yesterday, and the difference is that the
table behind it can now hold sixty entries, ask its own questions, and refuse to
become a second copy of the thing it catalogues.

| | |
|---|---|
| lint | **11 errors / 9 warnings — baseline, zero new** |
| build | **green, 72 modules** |
| `provenance:gate` | **PASS** — no `src/` change, so no register row moved |
| `reveal:check` | **PASS**, and it checks four things it did not check yesterday |
| ledger | **151 → 152 rows**; joined to an asset **11 → 12** |
| browser lap | **NOT RUN, and correctly not run** — see § THE LAP |

---

## R1 · THE LEDGER IS CUT PER ENTRY, AND THE ROWS ARE DERIVED

The ledger held one `doc.record` row. The Record will hold sixty entries and
every one of them will name its own assets — a plate, a document, a photograph
of the evidence. Audit §8a called for `record.NNN` granularity and said the
schema does not change, only the cut.

**It did not change. One row exists today: `record.013`.**

### The rows are read out of the Record, not typed against it

`reveal/record-entries.mjs` parses `src/data/artists/robots.js` with the same
acorn + acorn-jsx pair `tools/provenance-sweep.mjs` already uses. It parses
rather than imports because that file imports a JSX component at its head, so
node cannot import it and never will.

**The module is split in two, and the split is the enforcement rather than a
tidy-up:**

- **`entries()` returns entry numbers and asset paths. Nothing else.** It is the
  only half the ledger builds from, so a headline, a dateline or a section has
  **no route into the table** — not by discipline, by construction. Sixty
  entries will produce sixty rows with no edit to the declaration.
- **`prose()` returns every sentence in the Record.** Nothing builds from it. It
  exists so `reveal:check` can police the constraint, and it is the only reader
  that can see the words — the one that forbids them.

Asset paths are read **generically** (a leading slash and a real extension),
not by field name, so an entry that carries a second photograph joins the asset
table without this file being edited.

### What the cut paid for on day one

- **013's plate joined the asset table by itself.** Rows joined to an asset went
  11 → 12 with nothing typed. That is §8a's entire argument, working.
- **M18 moved off the volume onto the entry that has it.** The twenty-seven
  questions in `docs/RECORD_013_QUESTIONS-20260804.md` are questions about entry
  013; **M19 — what a record NUMBER means — is a property of the volume** and
  stayed on `doc.record`. Before the cut both hung off one row and neither could
  be answered against anything smaller than "the Record".
- **An unnumbered entry now fails the build.** Not silently, not with an
  index-derived id: the declaration stops and names M19. Minting a number would
  be Ops answering the open question with a guess, on the one surface that has
  already cost this museum ten invented entries.

### The constraint is enforced three ways, and all three were broken on purpose

The audit stated it and nothing enforced it: **the ledger must never duplicate
the Record's own data.** Now:

1. **The generator cannot see the words** (above).
2. **`reveal/schema.mjs` refuses the Record's FIELD NAMES** on any row —
   `headline`, `dateline`, `sections`, `lead`, `line`, `tomb`, `body`, `still`,
   `stillCaption`, `title`, `evidence`.
3. **`reveal:check` refuses its SENTENCES** — **six consecutive words** of
   Record prose, or any whole Record line of **four words or more**, anywhere in
   a row's `name`, `note`, `reach`, `where` or `deps`.

**Why six.** A row that has started restating an entry restates a clause, and a
clause is longer than five words. Below six, ordinary English collides — *"the
unit is on the"* would fire on half the robots wing. The whole-line rule exists
because the Record's short lines produce no six-word window at all: *"The charge
is slow."* is four words and would otherwise be invisible.

**Proved by injection, not by reading the code.** Four faults were written into
the built ledger and the check reported every one and exited 1:

| injected | caught as |
|---|---|
| a six-word clause lifted from entry 013's own section | `record.013: holds the Record's own words — "it was packed differently from everything"` |
| `"The charge is slow."` — four words, no six-word window | `doc.record: holds the Record's own words — "the charge is slow"` |
| a `sections` field on `doc.manual` | `carries \`sections\` — that is the Record's field, not the ledger's` |
| a phantom `record.014` row | `a row for a Record entry that is not in the data` |

**A fourth check came with them**, and it is the one that will matter most in a
year: **the rows and the Record's entries must be the same set, in both
directions.** It catches a hand-edit of `ledger.json` — which the README forbids
and nothing enforced — and a rebuild that silently dropped an entry. Tested by
deleting `record.013` from the JSON: reported, exit 1.

### One judgement call, named so it is a decision and not a drift

**`doc.record` was kept, as the VOLUME.** The audit's phrasing was "rather than
the one `doc.record` row that exists now", which reads as strike-and-replace,
and Doctrine 16 would ask what is lost if it goes.

It was kept for two reasons. **The pattern:** `doc.manual` and
`face.viiip.manual` are already a document/face pair, and breaking that shape
for one document makes the table inconsistent for a reader. **The work it
does:** M19 is a question about the volume, not about any entry, and after the
split there is nowhere else honest to hang it.

**The alternative is one deletion and one moved dependency**, and it is Mike's
if he wants the table cut finer.

### The rules lived in two places and the two lists disagreed

Not a finding of this round's making, but this round had to touch it.
`ledger-declare.mjs` checked five rules as it wrote; `reveal:check` checked four
afterwards; **neither list was a superset of the other**, so a rule was enforced
at whichever moment the author happened to run. They are one `validate()` in
`reveal/schema.mjs` now, and both callers run it.

---

## R2 · THE CUE CARDS

Audit §8b designed this and deliberately did not build it. `npm run
reveal:cards`.

**It is an Ops instrument. Not a route, never shipped, prints to a terminal** —
the same shape and the same reasoning as `assets:checklist`, which prints Mike's
inspection list for the approval gate. A scheduling UI at a live address would
be a museum surface whose subject is the making of the museum, which Doctrine 11
forbids on the glass.

One card per row, in Doctrine 12's own order — what it is · where it stands ·
what has to happen first · one blank:

```
- [ ] egg.replay
      The sandbox replay — the install, step by step, as an egg-hosting surface.
      build: LIVE · state: HELD · reach: — a visitor cannot
      needs first a reason to tempt someone with it
      note: Wired; currently an unexposed recipe.
      WHEN: ________________________________
```

`--spendable` · `--cls <class>` · `--record` · `--revealed` · `--all`. A scope
that matches nothing exits 1 and says so, because a checklist that matched
nothing has not been completed.

### The deck is 49 and the first implementation had it at 143

**The first draft printed every undated row, and it was wrong.** 143 rows carry
no date — and **93 of those are REVEALED, already on the glass.** A card asking
*what day does this come out* for something that came out months ago has no
honest answer: nobody recorded those days, and Doctrine 12 forbids supplying
them now. A deck three times too big, two thirds of it unanswerable, is a deck
nobody works through.

The default is **the 49 HELD undated rows**, which is exactly the number the
audit's §4 counts. `--revealed` and `--all` put the rest back for anyone
deliberately backfilling history.

`--spendable` is the twelve on the back shelf: built, reachable by nobody, **the
only rows that can be released without building anything.** If Mike answers
twelve cards, twelve things come out.

---

## R3 · THE MANUAL'S PAGES — A VESSEL, POPULATED WITH NOTHING

**Mike's ruling changed what the manual is for.** It arrived **in pieces**, so
the museum needs only the specific pages the story reaches for — printed,
marked, photographed, one at a time, **as Record entries call for them.**

That is a supply line, not a scanning project, and `doc.manual.plates` cannot
express it: one row for a set of 24 reads `NOT_BUILT` whether twenty-three pages
are done or none. It stays as the set-level row, because it carries the one
promise the glass actually makes — DOC CONTROL and The Manual's own face both
name the plates, and a per-page row claiming `shown` would double-count it.

`manualPageRow()` in `reveal/schema.mjs` builds `doc.manual.page.NN`:

- **its own production arc — `needed` · `printed` · `photographed` · `placed`**
- **`calledBy`** — the `record.NNN` entries that asked for it, **validated
  against real rows**, so nothing can be called for by an entry that does not
  exist. This only became expressible because R1 happened first: until this
  round there were no entry rows to be called for by.

**`prod` is not `arc`, and merging them would make both fields lie.** `arc` is
how the house REVEALS a thing it has; `prod` is whether the house HAS it. A page
can be `photographed` and `null` on the reveal arc, honestly, at the same time.

**`build` is DERIVED from `prod`** — `needed`/`printed` → NOT_BUILT,
`photographed` → PARTIAL, `placed` → LIVE — so a page row cannot be written into
a state the world is not in.

**It refuses a page the manual does not have.** The range is the object's own
24, and where the robots repo is reachable the source render is checked on disk
(`robots/mgk-viiip/manual/pages/page-NN.png`, all 24 verified present). The
vessel cannot be used to invent a twenty-fifth page.

**Nothing is populated, on instruction.** The story has not asked for a page,
and choosing which page it reaches for would be Ops writing the story. When one
is called for it is one line. `docs/OPEN_ACTIONS.md` [M44].

### The vessel is proved with zero rows shipped

An empty container nobody has exercised is C7's shape — the Record's inline
doors, built at v45, exercised by nothing since. So `reveal:check` builds
specimens at all four stages, asserts the derived build/state/reach, runs each
through the same validator the declaration uses, and asserts that **every
refusal actually refuses**: page 25, page 0, an unknown stage, a caller that
does not exist, a placed page with no photograph, and `prod` on a row that is
not a page. Then throws them away. **No page of the manual is invented to prove
the container.**

### The self-test could not fail, and only breaking it on purpose found that

The first version compared the vessel's output against `BUILD_FOR_PROD` — **the
table the vessel derives FROM.** Corrupting the mapping corrupted the
expectation with it. `photographed → PARTIAL` was deliberately changed to
`LIVE`, the suite was run, and it reported **PASS**.

The expected values are literals now, and the stage NAMES are asserted too, so
renaming a stage in `schema.mjs` surfaces here instead of silently shrinking the
loop's coverage. Both breaks were re-run afterwards and both fail correctly:

```
vessel: "photographed" derived build LIVE, expected PARTIAL
vessel: the production stages are needed · printed · scanned · placed,
        and this test covers needed · printed · photographed · placed.
```

**Worth carrying forward as a property, not an anecdote: a self-test that reads
its answer out of the thing under test is not a test, and the only way to find
out is to break the thing and watch.** `reveal/schema.mjs` was diffed
byte-for-byte against its pre-mutation copy afterwards; identical.

---

## R4 · THE STALE ANCESTOR, MARKED AND NOT DELETED

`weird-baby-robots/docs/ASSET_REVEAL_CHECKLIST.md` (2026-08-02) recorded the
Record as **436 paragraph records with 10 surfaced** — both numbers invented,
both deleted at v47 — and still called a face **"The Firmware"**, renamed
TECHNICAL SPECIFICATIONS at v50/N1.

A banner at its head now: superseded, the live board is `reveal/ledger.json`,
here are the commands and the audit.

**What it is kept for is stated, because that is the difference between marking
a document and burying it: this is where the four reveal classes were named** —
ANNOUNCED · HINTED · DISCOVERED · HELD — **and where the proposed fifth was
raised.** The ledger inherited those classes; it did not invent them. A source
is not superseded by the thing built on it.

The three wrong claims are tabulated against the truth so nobody has to find out
the hard way. **The body is deliberately not rewritten** — a first pass edited to
agree with what came after it stops being a record of what was thought at the
time, which is the only thing it is still for.

One thing worth knowing: the ledger's `route.hr` row cites this file's §E as the
source of the permanently-held ruling. That citation is still correct, and it is
exactly the kind of thing the banner says the file is kept for.

---

## R5 · THE FIFTH REVEAL CLASS — PUT AS ONE QUESTION, ADOPTED BY NOBODY

It has been carried three rounds as a description. A thing described is a thing
nobody has to answer, so it is set down in Doctrine 12's three-part format at
`docs/OPEN_ACTIONS.md` [M35]: what is known · what is missing · why it matters.

**And building the cue cards found a second case, which is not an artifact at
all.** `route.hr` — the Hunter Root reference wing — is **HELD PERMANENTLY BY
MIKE'S OWN RULING**: reachable by URL, never listed. Its cue card asks what day
it comes out. He answered that long ago, and the answer was *never*.

The mechanism under both is one field carrying two meanings it cannot tell
apart: **`when: null` means *nobody has scheduled this*, and it is also the only
way to say *this is deliberately never scheduled*.** A forgotten row and a
sealed one are the same row.

That is the argument that this is a CLASS and not a note about nickels: **one
missing word covers an artifact hidden inside a machine and a whole wing of the
museum.** A `no` is equally usable — it means HELD is the answer for both and
the cards stop asking.

**Ops adopted nothing and added no value to the schema**, because naming the
class is the question being asked.

---

## R6 · THE REGISTER

- **[M32]** rewritten — the instrument the audit designed is built; 49 cards,
  what the flags do, and why the deck is not 143.
- **[M35]** rewritten as one question, with the second case.
- **[M44]** added — the manual supply line is open and nothing has been called
  for; the first call comes out of Mike's voice sessions, not out of a build.
- **[C38]** added — `doc.record.evidence` is still one row for a per-entry
  thing. Right today with one entry; wrong at the second entry that carries
  evidence. Recorded because the round that would naturally have done it is the
  round that walked past it.
- **[C39]** added — `tools/asset-table.mjs` holds two literal NUL bytes
  (deliberate key separators written as raw characters), so **every `grep` over
  `tools/` reports "binary file matches" instead of the line.** Found by doing
  it twice this round. Two characters to fix; wants its own commit.
- §0 short list amended; the closed sections renumbered 5a–5e.
- **Five dead anchors fixed** — `#c7`, `#c12`, `#c14`, `#c15`, `#m21` were
  linked and never defined. Verified: zero dead anchors in the file.

### One register-maintenance gap, reported and not reconstructed

**v54 sealed without a closed-this-round section**, breaking the pattern v49–v53
all follow. It did amend and add rows (M38–M43) correctly; only the closed table
is missing. Its outcomes are in `CLAUDE.md`, `OPERATIONS.md` §5 and
`docs/MUSEUM_FOUNDATION_COPY_LOG-20260805.md`. **Rebuilding it from secondhand
notes would put a reconstruction in the one file that is supposed to be the
ledger**, so it is named rather than filled.

---

## THE LAP

**Not run, and this is the one round where that is the right answer rather than
an omission.** v52 sealed without a lap and was rightly called on it; the
difference is what changed. **Nothing in `src/` was touched.** No component, no
stylesheet, no string, no route, no asset. `provenance:gate` passes with zero
register movement because there was nothing to declare, and the build's 72
modules are the same 72.

The one thing that reaches the glass at all is `reveal/ledger.json`, read by
`src/lib/reveal.js` for `/foundation`'s LIVE / NOT BUILT column — and **that
column reads five `channel.*` rows, none of which this round touched.** Verified
by build, not by assumption: the file builds and the five rows are byte-identical
in the diff.

What a lap could not have caught here, and what did the catching instead: the
adversarial injections in R1, the deliberate breakage in R3.

---

## QUESTIONS FOR MIKE — two, neither blocking

Everything below is held honestly today. Nothing waits on either answer.

**1 · Is there a fifth reveal class, and is it called `SEALED`?**
- **KNOWN.** You named four — ANNOUNCED, HINTED, DISCOVERED, HELD — and gave the
  case that does not fit: *"Maybe the nickels are hidden inside of the thing so
  they're not even photographed."*
- **MISSING.** One word: whether a fifth class exists for a thing that is canon,
  physically present, deliberately unphotographed, and scheduled for reveal
  **never**.
- **MATTERS.** HELD means *not yet*. Two rows are already in the gap and only
  one is the nickels — `route.hr` is held permanently by your own ruling and its
  cue card asks what day it comes out. A `no` is equally usable.

**2 · Which page of the manual does the story reach for first?**
- **KNOWN.** Your ruling: it arrived in pieces, so the museum needs only the
  pages the story reaches for, one at a time, as Record entries call for them.
  The vessel is built and refuses to invent a page.
- **MISSING.** Nothing at all yet — no entry has named a page.
- **MATTERS.** It does not block: the vessel sits empty and nothing on the glass
  promises a page. It starts moving the moment an entry names one, which is your
  voice sessions rather than a build. P2 is unchanged — still *print and
  photograph* — and this only says which page, and for whom.

---

## FILES

**Museum repo**

```
reveal/record-entries.mjs        NEW — the Record's entries, read out of the Record
reveal/schema.mjs                NEW — the row vessels and the one validator
reveal/ledger-declare.mjs        record.NNN generator, manual-page vessel, shared validation
reveal/ledger.json               REGENERATED — 152 rows
reveal/README.md                 §1a §1b §3a, the two new fields, hole #7
tools/reveal-ledger.mjs          --cards, and four new checks
package.json                     reveal:cards
docs/OPEN_ACTIONS.md             M32 · M35 rewritten; M44 · C38 · C39; §5; anchors
docs/REVEAL_LEDGER_AUDIT.md      counts refreshed; §7 second case; §8a/§8b built; §8c new
docs/MUSEUM_RECORD_MACHINERY_LOG-20260805.md   this file
CLAUDE.md · docs/canonical/OPERATIONS.md · STATE.md
```

**Robots repo**

```
docs/ASSET_REVEAL_CHECKLIST.md   superseded banner; body deliberately untouched
```
