# THE REVEAL LEDGER

**One row per revealable thing across both repos.** Built 2026-08-05 (v52) on
Mike's instruction: *"THE TABLE, as DATA not code — one source holding every row
plus the scheduling the story needs … Nothing in a page hard-codes availability;
surfaces read the table."*

```
reveal/ledger-declare.mjs   the authored source — EDIT THIS
reveal/schema.mjs           the row vessels and THE ONE VALIDATOR
reveal/transfers.mjs        THE FOUR TRANSFER CLASSES and how every row arrived
reveal/record-entries.mjs   reads the Record's entries out of the Record
reveal/ledger.json          the artifact pages read — GENERATED, never edited
src/lib/reveal.js           the only thing in src/ that reads it
tools/reveal-ledger.mjs     report · audit · cue cards · integrity check
```

```
npm run reveal:build    rebuild ledger.json from the declaration
npm run reveal          the report
npm run reveal:audit    the five audit sections (docs/REVEAL_LEDGER_AUDIT.md)
npm run reveal:cards    THE CUE CARDS — the scheduling questions, one per card
npm run reveal:check    integrity; exits 1 on a fault
```

---

## 1. WHAT A ROW IS

Not a file. **A revealable thing** — a route, a face, an app, a game, a menu
row, a document, an egg, a sound, a physical object, a giving channel, a state.
Most rows have no file at all.

| field | |
|---|---|
| `id` | stable slug. Never reused, never renamed — pages key off it. |
| `name` | one line: what it is. |
| `cls` | document · machine · app · game · surface · artifact · egg · prop · sound · commerce · tool |
| `where` | a repo-relative path, a route, or the physical world. |
| `build` | `LIVE` · `PARTIAL` · `STUB` · `NOT_BUILT` — what is TRUE TODAY, never what is planned. |
| `reach` | how a visitor reaches it today, in one phrase. `null` = they cannot. |
| `state` | `HELD` · `REVEALED` · `RETIRED`. |
| `when` | the story day or week it becomes available. |
| `deps` | what has to happen first. |
| `arc` | the REVEAL ARC: `arrived` · `understood` · `partial` · `online` · `null`. |
| `shown` | true where a visitor can READ THE LABEL of something not built. |
| `assets` | asset-table `uid`s. |
| `prod` | the PRODUCTION arc — `needed` · `printed` · `photographed` · `placed`. The manual-page vessel's field and no other row's. |
| `calledBy` | the `record.NNN` rows whose entries ask for this thing. |
| `transfer` | [T1] which of the four transfers brought it into the house — `BLAST` · `PACKAGE` · `UNLOCK` · `TRANSMISSION`. `null` = exempted in writing. |
| `transferWeek` | [T1] the week the material ARRIVED. `0` for BLAST and UNLOCK; `null` for PACKAGE and TRANSMISSION, whose weeks the arc does not name. |
| `note` | what the fields above cannot hold. |

### `arc` and `prod` are not the same field and must never be merged

`arc` is how the house **reveals** a thing it has. `prod` is whether the house
**has** it. A page can be `photographed` and `null` on the reveal arc, and the
two would be lying about each other if they shared a column.

`build` is **derived** from `prod`, not authored beside it: `needed` and
`printed` are `NOT_BUILT`, `photographed` is `PARTIAL`, `placed` is `LIVE`. A
page row therefore cannot be written into a state the world is not in.

### `build` and `state` are two different axes, and conflating them is the
### first mistake anyone will make

`build` is *does it exist*. `state` is *is a visitor meant to get to it yet*.
A thing can be **finished and held** (`egg.replay` — the sandbox replay is
wired, working, and deliberately unexposed) and a thing can be **reachable and
half-built** (`face.viiip.record` — one entry, live, on the glass). The table
would be worthless if these were one column, because the whole question the
ledger answers is what is available to SPEND.

### `when` is null on every row and that is Doctrine 12

Nobody has supplied a REVEAL schedule. Nothing here invents one. The field
exists so that the day Mike gives a date it is a field and not a rebuild.

**[T1 2026-08-05] He has now supplied the ARRIVALS, which is a different
field.** The arc — twelve weeks; month 1 the arrival, month 2 the turn, month 3
the reckoning; four Fridays that carry packages — says how material got into the
house, not what day a visitor gets it. That lives in `transfer` /
`transferWeek`; `when` is still null on all 152 rows.

### `transfer` — an asset may only be SHOWN after it has been TRANSFERRED

The four classes, the assignment of all 152 rows, the written exemptions and the
three checks are in **`reveal/transfers.mjs`**. The document Mike reads is
**`docs/ASSET_TIMELINE.md`**.

| | window | rows |
|---|---|---|
| **BLAST** | Friday→Sunday, pre-launch (week 0) | 102 |
| **PACKAGE** | weeks 3–7, four Fridays | 9 |
| **UNLOCK** | in hand from week 0, opened later | 13 |
| **TRANSMISSION** | months 2–3 | 6 |
| *exempt, in writing* | — | 22 |

Three things enforce it, in `validate()` so both callers run it: **every row is
placed or exempted in writing** (a fall-through fails the build); **nothing
unarrived is on the glass** (a row with no named arrival week may not be
`REVEALED`, and neither may an exempt row); **nothing is shown before it lands**.
`transferGuardFaults()` in `tools/reveal-ledger.mjs` proves each refusal
actually refuses.

**The consequence worth holding: all 94 rows a visitor can reach today are
BLAST**, because the blast is the only transfer that had happened when the doors
opened. That is Mike's own insight — the first Record had to produce the first
images of NIAC and VIIIp, so those images arrived in the blast, and that is
cover for everything else the site already shows.

### `shown` is a judgement and cannot be derived

It marks the difference between a **gap** and a **debt**. Five Portal drum
positions are engraved where a visitor reads them and will not arm — that is
`shown: true`. The twin's stub app rows are equally unbuilt and are `shown:
false`, because THE STUB LAW strips them from the menus: *a row that leads to
"not built" is not a destination, it is a promise, and the menu is not the
place to keep promises.*

---

## 1a. THE RECORD IS CUT ONE ROW PER ENTRY, AND THE ROWS ARE DERIVED

`record.013`, `record.014`, … — one row per entry, **read out of
`src/data/artists/robots.js` rather than typed.** Sixty entries produce sixty
rows with no edit to the declaration, and each carries its own assets, its own
dependencies and its own `when`. `doc.record` remains, and is now **the volume
only**: M19 (what a record NUMBER means) is a property of the volume and stays
there; M18's twenty-seven questions are about entry 013 and travel with it.

**THE LEDGER MUST NEVER BECOME A SECOND COPY OF THE RECORD.** Audit §8a states
why: an entry's headline, dateline and sections live in the Record, and the
moment both files hold the same sentence they can disagree and nobody knows
which is lying. It is enforced three ways, not asserted once:

1. **The generator cannot see the words.** `record-entries.mjs` is split in
   two — `entries()` returns numbers and asset paths and nothing else, and it
   is the only half the ledger builds from. A headline has no route in.
2. **`reveal/schema.mjs` refuses the Record's FIELD NAMES** on any row —
   `headline`, `dateline`, `sections`, `lead`, `body`, `tomb`, `still`, …
3. **`reveal:check` refuses its SENTENCES** — six consecutive words of the
   Record's own prose, or any whole Record line of four words or more,
   appearing anywhere in a row's `name`, `note`, `reach`, `where` or `deps`.

An entry the Record has not numbered **fails the build** rather than being
given an id. Minting one would be Ops answering M19 with a guess.

## 1b. THE MANUAL'S PAGES — A VESSEL, DELIBERATELY EMPTY

Mike's ruling: the manual **arrived in pieces**, so the museum needs only the
specific pages the story reaches for — printed, marked, photographed, one at a
time, as Record entries call for them. That is a supply line, not a scanning
project, and `doc.manual.plates` cannot express it: one row for a set of 24
reads `NOT_BUILT` whether twenty-three pages are done or none.

So `manualPageRow()` in `reveal/schema.mjs` builds `doc.manual.page.NN`, which
carries its own `prod` stage and the `calledBy` entry that asked for it. It
**refuses a page the manual does not have** (the range is the object's own 24,
and the source render is checked on disk), and it validates `calledBy` against
real `record.NNN` rows.

**Nothing is populated.** The story has not asked for a page, and writing one
before it does would be Ops choosing which page the story reaches for. The
vessel is instead **proved by `reveal:check`**, which builds specimens at all
four stages, asserts the derived build/state/reach against literals, checks
each refusal actually refuses, and throws them away. No page is invented to
prove the container.

---

## 2. HOW IT RELATES TO THE OTHER THREE REGISTERS

Four instruments, no overlap. A fourth register with no stated boundary becomes
a rival to the other three within a round, so the boundary is stated:

| instrument | one row is | answers |
|---|---|---|
| `provenance/register.json` | a **string** | where did this line come from |
| `provenance/asset-table.json` | a **file** | what is it, is it any good, has Mike passed it |
| `docs/OPEN_ACTIONS.md` | an **open item** | what is waiting, on whom |
| **`reveal/ledger.json`** | a **revealable thing** | can a visitor get to it, should they yet, what first |

**It is not a rival to the asset table and it does not restate it.** No byte
count, no dimension, no quality read, no verdict appears here. They meet at
`assets: [uid]`, and `ledger-declare.mjs` FAILS at build time if a ref is not in
the asset table — so a ledger row cannot quietly reference a picture the museum
does not hold.

**That join is only survivable because of C32**, fixed in the same round: the
asset table used to be keyed by PATH, so a rename would have pointed every
reference here at nothing, silently. `uid` is minted once and never rewritten.

**It does not replace `docs/OPEN_ACTIONS.md` and must not start to.** The
register is what is *waiting on a person*; the ledger is what *exists and is
held*. Where they touch, `deps` cites the register's row id (`M18`, `P2`,
`C33`) rather than restating it.

---

## 3. HOW A SURFACE READS IT

**The ledger returns STATE. It does not return WORDS.** This is the load-bearing
rule, not a style preference.

`provenance:gate` enumerates visitor-facing strings in `src/` and `index.html`.
A data file outside those two places is not swept. So the moment a ledger row
started supplying the actual letters printed on a page, every one of those
letters would leave the provenance boundary — the museum would have moved copy
somewhere nothing asks where it came from, in the same round that mechanised
asking.

So: the ledger says `LIVE` / `NOT_BUILT`, the page keeps its own labels in its
own file. `src/routes/Foundation.jsx` is the worked example.

```js
import { isLive } from "../lib/reveal.js";
const STATE_LABEL = { LIVE: "LIVE", NOT_BUILT: "NOT BUILT" };
// row carries `reveal: "channel.qr"` instead of `state: "NOT BUILT"`
```

`isLive()` is strict: only `LIVE` is live. `PARTIAL` and `STUB` read as
not-built, because the Foundation's own rule is that there is deliberately no
third state for "in progress" — every one of those is a promise. A surface that
genuinely wants three states asks `buildOf()` and decides for itself.

**One consumer is wired.** Everything else in the museum still hard-codes its
own availability, and converting more is a per-surface decision, not a sweep.

---

## 3a. THE CUE CARDS — how the schedule actually gets filled

`npm run reveal:cards`. **An Ops instrument: not a route, never shipped, prints
to a terminal.** Same shape and same reasoning as `assets:checklist`, which
prints Mike's inspection list for the approval gate — a scheduling UI at a live
address would be a museum surface whose subject is the making of the museum,
which Doctrine 11 forbids on the glass.

One card per row, in Doctrine 12's own order: what it is · where it stands ·
what has to happen first · one blank. Answers come back as `when:` values in
`ledger-declare.mjs`. Nothing about it blocks anything.

```
npm run reveal:cards                    the 49 HELD rows with no date  ← the deck
npm run reveal:cards -- --spendable     the back shelf: built, not revealed
npm run reveal:cards -- --cls egg       one class at a time
npm run reveal:cards -- --record        Record entries
npm run reveal:cards -- --revealed      include what is already out
npm run reveal:cards -- --all           every row, dated or not
```

**The default deck is HELD rows, not every undated row, and the difference is
the point.** 143 rows carry no date; 93 of those are REVEALED — already on the
glass — and asking what day something comes out when it came out months ago has
no honest answer, because nobody recorded those days and Doctrine 12 forbids
inventing them. The deck is the 49 the audit's §4 counts: the pile where the
absence bites.

## 4. WHAT IT CANNOT DO

Stated in full, because a register that overstates itself is worse than none.
The same section exists in `provenance/README.md` §4 for the same reason.

1. **It cannot verify that `build` is true.** Every `LIVE` is Ops reading code
   on the day of the walk. There is no test that fires a feature.
2. **`reach` is the field most likely to rot.** A route change makes it wrong
   without touching it, and nothing notices.
3. **A missing row is invisible.** This is a catalogue. Its failure mode is
   silence, not error.
4. **It cannot schedule anything.** With every `when` null it is a catalogue of
   what exists and what is held, not a schedule. The scheduling half is built,
   validated and empty.
5. **The twin's rows are read off the DISPATCHER** — `Run_EXE` in
   `weird-baby-robots/tools/viiip_twin.html` — on Mike's instruction that *"the
   DISPATCHER is truth, the CSVs have lied twice."* A row is a STUB exactly
   when selecting it starts `SCAFFOLD_PROC`. If the dispatcher and a feature
   ever disagree, this table inherits the dispatcher's answer.
6. **The physical rows are canon, not inventory.** Nobody counted nickels.
7. **There is no way to say NEVER, and building the cue cards is what found
   it.** `when: null` means *nobody has scheduled this*. It has to carry a
   second meaning it cannot distinguish — *this is deliberately never
   scheduled* — and at least one row is already in that state on a ruling:
   `route.hr` is HELD PERMANENTLY, reachable and never listed, so its cue card
   asks a question Mike has already answered. **This is the same gap the
   proposed fifth reveal class names for artifacts** (`SEALED`: canon,
   physically present, deliberately unphotographed, possibly reachable never —
   `phys.nickels`). Adopting a value here would be Ops adopting that class, so
   nothing was added. It is one question in `docs/OPEN_ACTIONS.md` M35.

---

## 5. IF YOU ADD A ROW

Edit `reveal/ledger-declare.mjs`, run `npm run reveal:build`, then
`npm run reveal:check`. The declaration validates as it builds: duplicate ids,
a `REVEALED` row with no `reach`, a `RETIRED` row that is still reachable, a
`NOT_BUILT` row marked `REVEALED`, and an asset ref the asset table has never
heard of all fail loudly rather than landing in the JSON.

**Never edit `ledger.json`.** It is regenerated, and a hand edit is lost the
next time anyone runs the build.
