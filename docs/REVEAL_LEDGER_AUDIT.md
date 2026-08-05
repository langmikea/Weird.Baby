# THE REVEAL LEDGER — AUDIT · 2026-08-05 (v52)

**What this is:** the five questions Mike asked of the ledger, answered off the
ledger. Every count and every list below is produced by
`npm run reveal:audit`, not typed here — so this document can be regenerated
rather than believed. Where a sentence is a judgement rather than a count, it
says so.

**[v55 2026-08-05] REFRESHED FOR THE RECORD MACHINERY ROUND.** Three things
below moved and are marked where they moved: the counts (§ the table), the
fifth-class question (§7, which gained a second case that is not an artifact),
and §8 — **both of the things it designed are now built**, so it reads as a
record of the design and a pointer at the thing rather than as a plan.

**The table:** `reveal/ledger.json`, authored in `reveal/ledger-declare.mjs`.
**152 rows** across both repos.

| | |
|---|---|
| REVEALED — a visitor can reach it today | **94** |
| HELD — built or part-built and deliberately not reachable | **49** |
| RETIRED — was here, struck, named so nobody rebuilds it | **9** |
| LIVE / PARTIAL / STUB / NOT_BUILT | **94 / 16 / 6 / 36** |
| carrying a story date | **0** |
| carrying dependencies | **52** |
| joined to a file in the asset table | **12** |
| Record entries, one row each | **1** |
| manual pages, one row each | **0** of 24 |

**Every one of the five audit sections below is unchanged in count** — 12 / 11 /
22 / 49 / 58. The round added one row (`record.013`) and moved two dependencies
between existing rows; it released nothing and promised nothing.

---

## THE HEADLINE, BEFORE THE FIVE SECTIONS

**Nothing in this museum has a story placement.** Every one of the 152 rows
carries `when: null`. That is not an omission this round could have fixed —
nobody has supplied a schedule, and Doctrine 12 forbids inventing one — but it
means the ledger is today a **catalogue of what exists and what is held**, and
not yet a schedule. The scheduling half of Mike's instruction is built,
validated, and empty. **One field per row is all it takes to start.**

**[v55] AND THE ASKING IS NOW BUILT.** `npm run reveal:cards` prints the
question one row at a time — §8b's design, delivered. **49 cards**, one per HELD
row with no date; `--spendable` narrows to the twelve on the back shelf, which
are the only rows that can be released without building anything. The deck is
deliberately not all 143 undated rows: 93 of those are already REVEALED, and
asking what day a thing came out when nobody wrote the day down is an invitation
to invent one.

The consequence is worth stating plainly: *"where assets cluster on one day"*
cannot be answered at all today. That section below is not thin, it is
structurally empty, and it becomes the most useful section in this document the
moment a single date exists.

---

## 1. BUILT BUT NEVER REVEALED — THE BACK SHELF (12)

Things that are finished, or nearly, and that no visitor can reach. **These are
the only assets that can be spent without building anything new.**

| row | build | what |
|---|---|---|
| `route.hr` | PARTIAL | The Hunter Root reference wing — 8 albums, 93 tracks. **Held permanently by ruling:** reachable, never listed. Not spendable; do not read it as inventory. |
| `route.hr.archive` | LIVE | The Hunter Root discography. Nothing links to it. |
| `route.admin` | PARTIAL | The admin dashboard. Not linked from anywhere (C33). |
| `twin.scaffold` | LIVE | The honest scaffold screen — says what a stub row *will* be and admits it is a stub. A visitor never reaches it, because THE STUB LAW strips the rows that lead to it. |
| `doc.charter` | PARTIAL | `THE_CHARTER.md`, still DRAFT v0.3 (M12). |
| `phys.manual.original` | LIVE | The original printed manuals. Stated on DOC CONTROL, never shown. |
| `egg.replay` | LIVE | The sandbox replay of the install, step by step. **Wired and unexposed** — it needs a reason to tempt someone with it, not code. |
| `egg.cloud-alert` | PARTIAL | The ALERT: the assistant reveals it is listening and reporting back. Fires on the twentieth question. Words parked. |
| `egg.passcodes-msg` | PARTIAL | PASS CODES — a recording reading 0000, 69, 80085. The in-fiction path to a passcode. Fires at forty. |
| `egg.morse` | PARTIAL | STILL LISTENING, keyed in Morse. Fires at sixty. |
| `sound.datatransfer` | PARTIAL | The modem screech: mapped, correct, **and nothing calls it.** |
| `sound.electrical-short` | LIVE | The house's own recorded effect, on file in the robots repo and played nowhere. |

**The reading.** The back shelf is **not** mostly documents or pictures — it is
**four eggs and two sounds**, all of them already built and all of them waiting
on a sentence rather than on work. Three of the four eggs are on the same
trigger family (`ask_count_20 / 40 / 60`), which means they are already a
sequence and nobody has decided it is one.

`cls: "tool"` rows are excluded from this section and the exclusion is stated
rather than silent: the provenance gate, the asset table, this ledger and the
open-action register are all LIVE and all HELD, and none is a thing a visitor
could be given. Four house instruments at the top of the shelf would bury the
twelve rows that are actually spendable.

---

## 2. PROMISED BUT NOT BUILT (11)

**A promise is a label a visitor can read with nothing behind it.** The ledger
carries a `shown` flag for exactly this, because it cannot be derived: it is the
difference between a gap and a debt.

| row | what a visitor sees |
|---|---|
| `portal.feed.idling-updated` | engraved on the drum; will not arm |
| `portal.feed.boot-playback` | engraved on the drum; will not arm |
| `portal.feed.off-first-boot` | engraved on the drum; will not arm |
| `portal.feed.last-state` | engraved on the drum; will not arm |
| `portal.feed.test-bench` | engraved on the drum; will not arm |
| `portal.dial.seeded` | a dial position that does not arm |
| `doc.manual.plates` | DOC CONTROL and The Manual's own face both name them |
| `wal.artifacts` | the empty space below the line, on every artist |
| `channel.qr` | a register row printed **NOT BUILT** |
| `channel.supplies` | a register row printed **NOT BUILT** |
| `channel.services` | a register row printed **NOT BUILT** |

**The reading, and it is the sharpest finding in this document: six of the
eleven are one object.** The Portal's drum has six positions and **five of them
are promises.** A visitor rolls a drum with six engraved feeds and can arm
exactly one. That is the single largest concentration of unbuilt-but-visible
surface in the building, and it is deliberate — the held positions are Mike's
own metered-revelation instrument, built as held.

**It is also the single largest concentration of REVEAL LEVERS**, which is the
same fact read the other way. Five positions, five arrivals, and the mechanism
for each is one boolean.

**Three of the eleven are the Foundation's own honesty column** — and those are
promises the room makes ON PURPOSE, in Mike's own design: the state column
exists so a visitor learns the mechanism and learns, in the same glance, that it
is not there yet. They are listed here because the audit must not special-case
its own consumer.

---

## 3. NOT BUILT AND NOT PROMISED — THE QUIET GAPS (22)

Nobody is owed these. Listed because a catalogue's failure mode is silence.

Five are the twin's stub app families (`advice.rest`, `predictions.rest`,
`user.security`, `codes`, `mgkmodel`) — and they are quiet **by law**, not by
luck: THE STUB LAW strips every stub row from the menus, on the ruling that *a
row that leads to "not built" is not a destination, it is a promise, and the
menu is not the place to keep promises.* That law is the reason this section
exists as a separate category from §2, and it is the museum's own best answer to
the problem §2 describes.

Four are documents nobody has been told about (`doc.ads`, `doc.factlist`,
`doc.summary`, `doc.credo`). Four are physical (`phys.niac.whole`,
`phys.cases`, `phys.nickels`, `phys.time`). Three are commerce
(`shop.shirts`, `shop.domain`, `shop.mikes`). The rest are eggs and one
firmware gap.

**`twin.games.unit` deserves its own line.** Twelve games run in the twin and
**none of them runs on the actual machine** — the firmware has no handler, so
clicking a game on the unit does nothing today. That is marked in the
dispatcher as a TWIN DELTA. It is the largest gap between the simulator and the
object it simulates, and it is not promised anywhere, so nothing is broken; it
is just the biggest thing the twin says that the machine does not.

---

## 4. WHAT HAS NO STORY PLACEMENT AT ALL

**Everything. All 152 rows.** See the headline.

The 49 HELD rows are the ones where the absence bites, because a held thing
with no date is a thing with no plan to be released — which is a different
state from *"held until week 6"* and the ledger cannot currently tell them
apart. Today they are indistinguishable, and that is the honest reading of the
museum's own state, not a defect in the table.

---

## 5. WHERE ASSETS CLUSTER ON ONE DAY

**Nothing can cluster, because nothing carries a day.** This section is
structurally empty and the tool says so rather than printing a reassuring zero.

---

## 6. DEPENDENCY CHAINS THAT CANNOT RESOLVE (58)

The tool separates two kinds and the distinction is the whole value:

**(a) Chains that point at another ledger row that is itself unbuilt — 3.**
These are the real chains, and they are short:

- `face.wbr.doc-control` → `doc.manual.plates` (NOT_BUILT)
- `face.viiip.manual` → `doc.manual.plates` (NOT_BUILT)
- `egg.laststate` → `portal.feed.last-state` (NOT_BUILT)

**`doc.manual.plates` is the museum's only two-consumer bottleneck.** Two live
faces name plates the museum does not hold, and one photograph session
(register P2) resolves both at once. Nothing else in the table has that shape.

**(b) 55 chains that terminate OUTSIDE the table** — in a person, a ruling, a
camera, or a fact of the world. That is not a fault and the tool does not report
it as one. It is the single most important number in this audit, and it says the
same thing the asset table said at v49 and the open-action register said at v50,
in a third independent way:

> **The museum is not blocked on code. It is blocked on Mike.**

Sorted by what they terminate in — the buckets are keyword-classified, so read
them as proportions and not as a census:

| terminates in | count |
|---|---|
| a **ruling** or a decision nobody has made | 10 |
| **content or words** nobody has written (incl. `[PAPA]`) | 7 |
| **Mike's camera or art** | 6 |
| everything else | 32 |

The 32 are not a residue worth ignoring; they are the most specific rows in the
table and they fall into four recognisable shapes. **Eight are pointers into
`docs/OPEN_ACTIONS.md`** (`C18`, `C19`, `C20`, `C33`, `M12`, `M18`×2, `M19`) —
which is the two registers agreeing, and is what the `deps` field citing a
register row id was for. **Six are the Portal's own drum** (*"no feed on
file"*, five times, plus the seeded dial). **Three are the message eggs'
triggers** (`ask_count_20 / 40 / 60`), which are not blockers at all — they are
the machine's own counters, already wired, waiting only on the words. The rest
are one-of-a-kind conditions a schedule would have to respect: *"a rights check
before any scan is published"*, *"an artist earning one"*, *"a storyline
first"*, *"a reveal class that does not exist yet"*.

---

## HOW THIS AUDIT RELATES TO THE THREE REGISTERS THAT ALREADY EXIST

Four instruments now, and they do not overlap. Stated here because a fourth
register with no stated boundary becomes a rival to the other three within a
round:

| instrument | one row is | answers |
|---|---|---|
| `provenance/register.json` | a **string** | where did this line come from |
| `provenance/asset-table.json` | a **file** | what is it, is it any good, has Mike passed it |
| `docs/OPEN_ACTIONS.md` | an **open item** | what is waiting, on whom |
| `reveal/ledger.json` | a **revealable thing** | can a visitor get to it, should they yet, what first |

The ledger joins to the asset table through `assets: [uid]` and **never
restates a byte count, a dimension, a quality read or a verdict.** That join is
only survivable because of [C32], fixed in this same round: the asset table used
to be keyed by path, so a rename would have pointed every reference here at
nothing, silently.

The ledger does **not** replace `docs/OPEN_ACTIONS.md` and must not start to.
The register is what is *waiting on a person*; the ledger is what *exists and is
held*. Where they touch, the ledger's `deps` cite the register's row id (`M18`,
`P2`, `C33`) rather than restating it.

`docs/ASSET_REVEAL_CHECKLIST.md` in the robots repo is this ledger's ancestor —
Mike's four reveal classes and the first pass at the same board, written
2026-08-02. **It is now partly stale** (it records the Record as holding 436
paragraph records with 10 surfaced; v47 deleted the ten as fiction and the 436
was itself invented, and it still calls a face "The Firmware", renamed at v50).
It is kept as the document that named the four reveal classes and raised the
proposed fifth; it should not be read as current build state.

**[v55/R4] IT NOW SAYS SO ITSELF.** A superseded banner at its head points here
and at the commands, names what it is kept for, and tabulates its three wrong
claims against the truth. **Its body is deliberately not rewritten** — a first
pass edited to agree with what came after it stops being a record of what was
thought at the time, which is the only thing it is still for.

---

## 7. THE FIFTH REVEAL CLASS IS STILL PROPOSED AND STILL NOT ADOPTED

Carried forward unchanged, because this round had no standing to adopt it.
`SEALED` — **canon, physically present, deliberately unphotographed, and not
scheduled for reveal at all** — was raised by the buffalo-nickel ruling. None of
HELD / ANNOUNCED / HINTED / DISCOVERED covers it: HELD means *not reachable
yet*, and a sealed thing may be reachable **never**.

`phys.nickels` is in the ledger as `NOT_BUILT / HELD` with a dependency reading
*"a reveal class that does not exist yet"*, which is the most honest row the
table can carry until Mike names it.

**[v55] IT IS NOT ONLY THE NICKELS, AND BUILDING THE CUE CARDS IS WHAT FOUND
THE SECOND CASE.** `route.hr` — the Hunter Root reference wing — is **HELD
PERMANENTLY BY MIKE'S OWN RULING**: reachable by URL, never listed, and this
table has recorded that since it was built. Its cue card asks *what day does
this come out*, and the answer is **never**, and it was given long ago.

The mechanism underneath both is one field with two meanings it cannot tell
apart: **`when: null` means *nobody has scheduled this*, and it is also the only
way to say *this is deliberately never scheduled*.** A held thing with no date
and a sealed thing with no date are the same row.

That is the argument for a fifth class being a CLASS rather than a note about
nickels — one missing word covers an artifact inside a machine and a whole wing
of the museum. It is put to Mike as a single question at `OPEN_ACTIONS.md`
[M35], and **nothing was adopted**: adding a value here would be Ops naming the
class he was asked to name. A `no` is equally usable — it means HELD is the
answer for both and the cards stop asking.

---

## 8. WHAT THE TABLE WILL NEED WHEN THE RECORD GOES LIVE (R6)

**Designed here at v52, and BOTH BUILT at v55 (2026-08-05).** The design is left
standing below because it is the argument for the shape, and the shape did not
change when it was built; each half is stamped with what it became. A third
thing was built that this section did not foresee, and it is §8c.

### 8a. Per-entry asset references

The Record holds **one** entry today. At sixty it becomes the museum's largest
consumer of assets, and every entry will want to name its own — a plate, a
document, a photograph of the evidence. The ledger already has the right shape
for it: `assets: [uid]`, resolving through the C32-safe key.

**What it needs:** ledger rows at entry granularity — `record.013`,
`record.014` — rather than the one `doc.record` row that exists now. Nothing
about the schema changes; the granularity does. The join, the audit and the
check all work unaltered on a hundred rows.

**What it must NOT do:** duplicate the Record's own data. An entry's headline,
dateline and sections live in the Record; the ledger row holds only what the
ledger holds anywhere — is it reachable, should it be yet, what does it need
first. The temptation at sixty entries will be to let the ledger become a second
copy of the Record, and the moment it does, the two disagree.

> **BUILT [v55/R1].** `record.013` exists and the row is **derived, not typed**:
> `reveal/record-entries.mjs` parses the Record out of
> `src/data/artists/robots.js` and is split in two so that the half the ledger
> builds from returns **entry numbers and asset paths and nothing else.** A
> headline has no route in. Sixty entries will produce sixty rows with no edit
> to the declaration.
>
> **The constraint above is enforced three ways rather than asserted once:** the
> generator cannot see the words; `reveal/schema.mjs` refuses a row carrying the
> Record's field NAMES; and `reveal:check` refuses its SENTENCES — six
> consecutive words of Record prose, or any whole Record line of four words or
> more, in a row's `name`, `note`, `reach`, `where` or `deps`. All three were
> broken on purpose and all three reported. A fourth check came with them: the
> rows and the entries must be the same set in both directions.
>
> **`doc.record` stays and is now the volume only.** M18's twenty-seven
> questions are about entry 013 and moved onto it; M19 — what a record NUMBER
> means — is a property of the volume and did not. **An unnumbered entry fails
> the build** rather than being given an id, because minting one would be Ops
> answering M19 with a guess.

### 8b. The cue-card input view

The scheduling half of this table is unusable without a way to fill it that is
not editing a `.mjs` file. What Mike needs is **one row at a time, one question
at a time** — the same one-question format Doctrine 12 already specifies for
gaps: *here is a thing, here is what is known, what day does it come out.*

**The design, and the constraint that shapes it:** it is an OPS instrument, not
a museum surface. It never ships to a visitor and it is not a route. The cheapest
honest form is a generated checklist, exactly as `assets:checklist` already is
for the approval gate — a printed card per row with its id, its name, its
current state, its dependencies, and one blank. Mike answers as many as he
wants, in any order, at his pace, and the answers come back as `when:` values in
`ledger-declare.mjs`.

**Not built, because R5 did not need it and because building an input for a
schedule nobody has started is the same mistake as building a menu row that
leads to "not built".** It is a row in `docs/OPEN_ACTIONS.md`.

> **BUILT [v55/R2].** `npm run reveal:cards`. The form is exactly the one
> designed above — a printed card per row with its id, its name, its current
> state, its dependencies and one blank — and it is an Ops instrument that
> prints to a terminal, never a route.
>
> **One thing the design got wrong, and it was wrong in the first
> implementation too:** "one card per row" is 143 undated rows, and **93 of them
> are already REVEALED.** A card asking what day a thing comes out, for a thing
> that came out months ago, has no honest answer — nobody recorded those days,
> and Doctrine 12 forbids supplying them now. The deck is therefore **the 49
> HELD rows**, which is §4's own number. `--revealed` and `--all` put the rest
> back for anyone deliberately backfilling history.

### 8c. WHAT §8 DID NOT FORESEE — the manual is a supply line

**Not designed here at all; ruled by Mike at v55 and built the same round.** The
manual was one ledger row for one PDF plus one row for the whole set of 24
plates, and neither can track production. His ruling: **it arrived in pieces**,
so the museum needs only the specific pages the story reaches for — printed,
marked, photographed, one at a time, **as Record entries call for them.**

That is a supply line, and it only became expressible because §8a happened
first: a page is called for BY AN ENTRY, and until this round there were no
entry rows to be called for by. `manualPageRow()` in `reveal/schema.mjs` builds
`doc.manual.page.NN` with its own **production arc — needed · printed ·
photographed · placed** — and a `calledBy` naming real `record.NNN` rows.

**`prod` is not `arc`** and they are deliberately separate columns: `arc` is how
the house REVEALS a thing it has, `prod` is whether the house HAS it. `build` is
DERIVED from `prod`, so a page row cannot claim a state the world is not in.

**Nothing is populated** — the story has not asked for a page — and the vessel
is proved without one: `reveal:check` builds specimens at all four stages,
asserts the derived states against literals, and asserts that every refusal
(page 25, page 0, an unknown stage, a caller that does not exist, a placed page
with no photograph) actually refuses. `docs/OPEN_ACTIONS.md` [M44].

---

## WHAT THIS AUDIT CANNOT DO

Stated in full, because a register that overstates itself is worse than none:

1. **It cannot verify that `build` is true.** Every `LIVE` in the table is Ops
   reading code on the day of the walk. There is no test that fires a feature.
2. **`reach` is the field most likely to rot.** A route change makes it wrong
   without touching it, and nothing will notice.
3. **A missing row is invisible.** This is a catalogue; its failure mode is
   silence, not error. If something in either repo was never written down here,
   nothing in this document will tell you.
4. **The twin's rows are read off the DISPATCHER** (`Run_EXE` in
   `tools/viiip_twin.html`), on Mike's instruction that *"the DISPATCHER is
   truth — the CSVs have lied twice"*. A row is a STUB exactly when selecting it
   starts `SCAFFOLD_PROC`. If the dispatcher and a feature ever disagree, this
   table inherits the dispatcher's answer.
5. **The physical rows are canon, not inventory.** Nobody counted nickels.
6. **[v55] It cannot say NEVER.** `when: null` means *nobody has scheduled
   this* and has to double as *this is deliberately never scheduled*. Two rows
   are already in the second state. See §7 — it is one question for Mike, and
   nothing was adopted to paper over it.
