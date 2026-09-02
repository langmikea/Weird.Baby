# THE RELEASE OBJECTS — built, and the canon line proved by tripping it

**2026-08-28.** HEAD at start `6307286`. Nothing committed by Code; Mike commits.

---

## 1. WHAT MIKE RULED, AND WHAT EACH RULING CHANGED

| ruling | what it changed in the design |
|---|---|
| **The five Coconuts videos are uploaded and PRIVATE.** Not published. | **The first thing in the system is a PLAN, not history.** Forced a third posting state — see §3. |
| **The four quarters go in order. 2 cannot precede 1.** Sequence is real. | Made `seq` a **check**, not a field. A number nothing enforces is a label. |
| **The full reel has no place yet** — *"I don't know. I had it, so I included it."* | `UNDECIDED` is a **legitimate state the system holds**, not a gap to fill. |
| **Coconuts is a single; E.D. Yahdah is next.** | The **run** is the grouping, and it is why `outcome` exists at all. |
| **Instagram joins.** One 9:16 video, three surfaces, uncut. | Three posting events and three sets of numbers **inside one release**. |

---

## 2. THE THREE OBJECTS, AND NOTHING ELSE

| | where | what |
|---|---|---|
| **THE RELEASE** | `release/releases.json` | one **video**. The three surfaces are not three releases. |
| **THE OUTCOME** | inside each posting | views and conclusions — the numbers are per-surface, so they live per-surface. |
| **THE SPEC** | `release/specs/SPEC-*.md` | what Ops hands Mike. It **is a brief** and inherits the brief rule: he does not edit them. |

**There is no fourth object and the loop's memory is not one.** A sit-down
produces three things and each has a home already: what we concluded →
`outcome.concluded`; what we decided → the next spec; what we are waiting to
see → that spec's *watching* section.

**And it is deliberately not a handoff.** The survey's sharpest finding was that
this project already built *notes for the next session*, ruled that facts may not
go in it, and watched it rot — `docs/HANDOFF_next_session.md`, last touched
2026-08-23.

---

## 3. THE THIRD POSTING STATE IS MIKE'S RULING MADE STRUCTURAL

`planned` → **`staged`** → `out`.

**`staged` exists because of one sentence:** *the five Coconuts videos are
uploaded and private.* Without it the system cannot tell **nothing exists there**
from **it exists there and the world cannot see it** — which are the two states
every row in this system is actually in today. A boolean could not express it.

**And the honesty rule is enforced by ABSENCE, not by a value.** Mike: *a post
without numbers reads as "not yet checked", never as zero; a field nobody fills
is worse than no field.* So `outcome` is **absent** until there is something in
it — no empty object, no empty array, no `null`, no `views: 0` placeholder. The
gate refuses each of those. **`views: 0` therefore means a real zero somebody
read**, which is a different and useful fact.

---

## 4. THE CANON LINE, AND WHY IT HAD TO BE A GATE

**Ops assumed a separate root directory kept data out of the bundle. That is
false, and measuring it is what shaped the whole design:**

```
src/lib/placement.js:26      import { placeRule }  from "../../reveal/placement.mjs"
src/lib/record-clock.js:31   import { … }          from "../../reveal/record-clock.mjs"
src/lib/reveal.js:44         import LEDGER         from "../../reveal/ledger.json"
src/routes/WbHome.jsx:27     import { … }          from "../../reveal/record-clock.mjs"
src/worker.js:73             import { … }          from "../reveal/record-clock.mjs"
```

**`reveal/` is a root directory `src/` imports from five places, JSON included.**
Placement buys legibility and nothing else. Mike's *"a rule a gate checks rather
than a boundary Ops trusts"* is not belt-and-braces here — it is the only thing
holding the line.

### The line is ONE-DIRECTIONAL, and that had to be designed in

- **STORY → RELEASE is ALLOWED.** A caption may quote the museum; a run's
  `promotes` names a museum video by the museum's own id.
- **RELEASE → STORY is FORBIDDEN.**

A gate blocking both directions would forbid a reel from quoting the thing it
promotes, which is what a reel *is*.

### `RESTATED` is what makes the gate possible

A quotation has its string under `src/` **on purpose**, so a gate matching raw
strings would fail the build on correct work. The gate matches only what a
release declares as **its own**, and a quotation is exempt **by carrying a
pointer the gate resolves** — exempt by evidence, never by permission.

**THE FIRST RUN OF THE GATE PROVED THIS BY FAILING ON IT.** It reported three
faults in `weird-baby.js` for carrying the string `coconuts` — which is the
**museum's** track id, written there long before this directory existed. The gate
was reporting the museum for carrying its own word. The run id is exempt now,
**and the exemption is checked**: the run id must equal `promotes.track`, and
that track must really be in the museum's source. Two lines, and without them the
exemption would be Ops asserting it.

---

## 5. EACH CHECK PROVED BY TRIPPING IT

Every trip ran against a copy and the tree was restored after each.

| # | trip | result | exit |
|---|---|---|---:|
| 1 | a release caption retyped into `weird-baby.js` | **`weird-baby.js:835` carries a release string — "Coconuts, first quarter of the song."** | 1 |
| 2 | `src/lib/reveal.js` imports `release/releases.json` | **`src/lib/reveal.js:45` imports … — src/ may not import from release/** | 1 |
| 3 | q2 goes public before q1 | **`coconuts-q2` (seq 2) is OUT on youtube but `coconuts-q1` (seq 1) is staged** | 1 |
| 4 | `promotes.museumRef` pointed at a fake id | **does not appear in `weird-baby.js`. A RESTATED pointer that does not resolve turns the gate off** | 1 |
| 5 | `readings: []` — the empty-field case | **present and empty. Leave it out until there is one** | 1 |
| 6 | a `due` key added to a release | **THERE IS NO DUE DATE IN THIS SYSTEM** | 1 |
| 7 | `coconuts-full` loses its `undecidedNote` | **is UNDECIDED and says nothing about why** | 1 |

**Trip 3 is the one worth keeping in mind:** the sequence is not documentation.

---

## 6. WHAT IS SEEDED

```
runs                  1
releases              5      4 sequenced · 1 UNDECIDED
public on any surface 0
src/ files walked     68
```

All five are `youtube` / `staged` / `ref: null`. **The addresses were not
supplied and Ops does not invent a platform id** — the gate counts them under
**WITHHELD** rather than leaving a silent blank, because *a silent filter is
indistinguishable from a bug.*

**Facebook and Instagram carry no posting at all** — not `planned`, absent.
Nothing exists there and nothing has been decided.

---

## 7. E.D. YAHDAH — THE QUESTION ANSWERED WITHOUT CROSSING THE LINE

Its video landed 2026-08-26 at `6c80c1c`, so it exists in the museum before it
exists as a single. **Should the system know? Yes — and the mechanism needed
nothing new.**

A run's `promotes` block points **INTO** the museum by the museum's own id. That
is the allowed direction: the museum gains no field, no import, and does not know
this directory exists. **Coconuts carries one today** and E.D. Yahdah's will be
identical in shape — which is the demonstration, done on a run that is actually
in scope rather than on one seeded ahead of its facts.

---

## 8. THE BLOB LINES, WRITTEN WHERE A LATER ROUND WILL MEET THEM

All nine are in `release/README.md`, each with its reason. The four that this
design walks toward and does not cross:

- **No page.** Not a museum tool, by his decree. **The pull arrives at about
  fifteen rows.**
- **No calendar.** `posted` is the day it went; the gate refuses a `due` key.
  The museum's own `RECORD_EPOCH` / `recordDay()` pipeline is one import away and
  reusing it would reintroduce exactly what he ruled out.
- **No derived number.** No rate, total, average or best-performing. A reading is
  evidence for a conversation, never a score.
- **No second catalogue.** A release names a museum asset by uid and never
  re-describes it — no bytes, no dimensions, no sha256.

---

## 9. GATES

```
release:check         PASS
lint                  9 errors / 7 warnings — BASELINE, zero new
build                 green
build:launch          green
provenance:gate       PASS
reveal:check          PASS
parity:gate           PASS — 4 shared, 0 divergences
instory:gate          PASS — 0 findings
docs:numbers:gate     PASS
reveal:day            nothing to move
```

**Nothing under `src/` changed.** No visible string, no ledger row, no asset row,
no register row moved. The only edit outside the new directory is two script
lines in `package.json`.

---

## 10. FOR THE COMMIT

```
release/releases.json                          new   the data, seeded
release/release-shape.mjs                      new   the declared shape and rules
release/README.md                              new   the discipline, for the next Ops
release/specs/SPEC-coconuts-quarters-20260828.md  new   the first spec
tools/release-gate.mjs                         new   the gate
package.json                                    M    release + release:check
docs/MUSEUM_RELEASE_OBJECTS_LOG-20260828.md    new   this file
docs/MUSEUM_SHORTS_GATE_LOG-20260828.md         M    §7, the deploy-record breadcrumb
```

**`docs/MUSEUM_SHORTS_GATE_LOG-20260828.md` is carried from the previous round**
and its own commit was never run. Its §7 records that `docs/DEPLOYED.md` rode into
`6307286` against the runbook's step 15, and that `6307286`'s message mentions
neither — so the one commit that finally lands the deploy record is the one nobody
searching for it would open.
