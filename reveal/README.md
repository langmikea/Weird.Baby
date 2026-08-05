# THE REVEAL LEDGER

**One row per revealable thing across both repos.** Built 2026-08-05 (v52) on
Mike's instruction: *"THE TABLE, as DATA not code — one source holding every row
plus the scheduling the story needs … Nothing in a page hard-codes availability;
surfaces read the table."*

```
reveal/ledger-declare.mjs   the authored source — EDIT THIS
reveal/ledger.json          the artifact pages read — GENERATED, never edited
src/lib/reveal.js           the only thing in src/ that reads it
tools/reveal-ledger.mjs     report · audit · integrity check
```

```
npm run reveal:build    rebuild ledger.json from the declaration
npm run reveal          the report
npm run reveal:audit    the five audit sections (docs/REVEAL_LEDGER_AUDIT.md)
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
| `note` | what the fields above cannot hold. |

### `build` and `state` are two different axes, and conflating them is the
### first mistake anyone will make

`build` is *does it exist*. `state` is *is a visitor meant to get to it yet*.
A thing can be **finished and held** (`egg.replay` — the sandbox replay is
wired, working, and deliberately unexposed) and a thing can be **reachable and
half-built** (`face.viiip.record` — one entry, live, on the glass). The table
would be worthless if these were one column, because the whole question the
ledger answers is what is available to SPEND.

### `when` is null on every row and that is Doctrine 12

Nobody has supplied a schedule. Nothing here invents one. The field exists so
that the day Mike gives a date it is a field and not a rebuild.

### `shown` is a judgement and cannot be derived

It marks the difference between a **gap** and a **debt**. Five Portal drum
positions are engraved where a visitor reads them and will not arm — that is
`shown: true`. The twin's stub app rows are equally unbuilt and are `shown:
false`, because THE STUB LAW strips them from the menus: *a row that leads to
"not built" is not a destination, it is a promise, and the menu is not the
place to keep promises.*

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

---

## 5. IF YOU ADD A ROW

Edit `reveal/ledger-declare.mjs`, run `npm run reveal:build`, then
`npm run reveal:check`. The declaration validates as it builds: duplicate ids,
a `REVEALED` row with no `reach`, a `RETIRED` row that is still reachable, a
`NOT_BUILT` row marked `REVEALED`, and an asset ref the asset table has never
heard of all fail loudly rather than landing in the JSON.

**Never edit `ledger.json`.** It is regenerated, and a hand edit is lost the
next time anyone runs the build.
