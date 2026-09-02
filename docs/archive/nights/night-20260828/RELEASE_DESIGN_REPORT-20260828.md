# THE RELEASE OBJECTS — DESIGN REPORT

**2026-08-28. Report before building. Nothing built.**
Follows `LOOP_MEMORY_SURVEY-20260828.md`. Three surfaces now: **YouTube,
Facebook, Instagram.** One 9:16 video, uncut, to all three.

---

## 0. ONE CORRECTION BEFORE THE DESIGN, BECAUSE IT CHANGES IT

**A SEPARATE ROOT DIRECTORY IS NOT ENFORCEMENT.** Ops assumed that data living
outside `src/` could not reach the bundle. Measured, that is false:

```
src/lib/placement.js:26      import { placeRule }  from "../../reveal/placement.mjs"
src/lib/record-clock.js:31   import { … }          from "../../reveal/record-clock.mjs"
src/lib/reveal.js:44         import LEDGER         from "../../reveal/ledger.json"
src/routes/WbHome.jsx:27     import { … }          from "../../reveal/record-clock.mjs"
src/worker.js:73             import { … }          from "../reveal/record-clock.mjs"
```

**`reveal/` is a root directory that `src/` imports from five places, JSON
included.** So placement buys legibility and nothing else, and Mike's ruling 2 —
*a rule a gate checks rather than a boundary Ops trusts* — is not belt-and-braces
here. It is the only thing holding the line.

---

## a. THE THREE OBJECTS

### 1. THE RELEASE — a reel that exists and is not part of the story

**Lives:** `release/releases.json`, with `release/README.md` beside it carrying
the discipline — the shape `reveal/README.md` and `provenance/README.md` already
use.

One release is **one video**. The three surfaces are **not** three releases:

| field | | |
|---|---|---|
| `id` | **authored, never derived from position** | `coconuts-full`, `coconuts-q1` … |
| `what` | one line — what the video is | |
| `shape` | `"9:16"` | one value today; it is recorded rather than assumed because the whole three-surface economy rests on it |
| `made` | the date it was made, or absent | |
| `source` | the museum asset or recipe it came from — **or `null` carrying a reason** | the Coconuts reels were made by Mike outside the shorts bench; `null` with *"made by Mike, not from a recipe"* is honest, a blank is not |
| `postings[]` | **one per surface** | below |

**`postings[]` is where "three posting events" lives**, and it is a list inside
the release rather than a second object — because a posting has no existence
apart from the video it posts:

```
{ surface: "youtube" | "facebook" | "instagram",
  ref:     the platform's own id or URL,
  posted:  the date it actually went out,
  outcome: … }
```

**`posted` is the day it WENT, never a day it should go.** There is no due date
anywhere in this design; that is ruling 2 made structural.

### 2. THE OUTCOME — views, and what was concluded

**Lives:** inside each posting. Views are per-surface, so they belong per
posting — *"three sets of numbers"*, exactly as ruled.

```
outcome: {
  readings:  [ { on: <the day it was READ>, views: <n> } , … ]   append-only
  concluded: [ { on: <date>, said: "<one line>", c: MIKE | HOUSE } , … ]
}
```

**THE HONESTY RULE IS ENFORCED BY ABSENCE, NOT BY A VALUE.** Mike's ruling: *a
post without numbers reads as "not yet checked", never as zero; a field nobody
fills is worse than no field.* So:

- **`outcome` is absent until there is something in it.** No empty object, no
  empty array, no `views: 0` placeholder, no `null`.
- **`readings` is never empty if present**, and **`views: 0` means a genuine
  zero that somebody read**, which is a real and different fact from silence.
- **Anything that prints a release prints `not yet checked`** for an absent
  outcome and must never print `0`.
- **`on` is the day the number was READ**, never the day it was typed in. This
  is the hazard the tree has filed twice — *any tool that stamps `saved` at the
  moment of saving is answering a question nobody asked it.*

**And the numbers are not new.** `worth-a-listen-facts.js` already carries
`"18,242 views as of 2 August 2026."` classified **`c: VERIFIED`**. A reading is
`VERIFIED`; Mike's conclusion is `MIKE`; Ops' conclusion is `HOUSE`.

### 3. THE SPEC — what Ops hands Mike

**Lives:** `release/specs/SPEC-<id>-<yyyymmdd>.md`.

**It is a brief and inherits the brief rules whole** — OPERATIONS §0: **MIKE
DOES NOT EDIT BRIEFS.** It goes to him complete or not at all; if it is wrong it
is rewritten whole, never amended.

It carries: **what to make** · **which surfaces** · **what it points at** ·
**the caption(s), marked** · **why now** · and **what we are watching** — the
one field the survey found genuinely new, the thing that says *what would change
this decision*. Its only precedent is ruling 3's *"TRIGGER: roughly 30
Records"*, written once in prose.

**A spec has no due date and no cadence.** It says what to make and why now.
When it gets made is Mike's.

### Where the loop's memory is — and it is not a fourth object

A sit-down produces three things and each already has a home: **what we
concluded** → `outcome.concluded` · **what we decided to do** → the next spec ·
**what we are waiting to see** → that spec's *watching* field. Plus
`release/README.md` for the standing discipline.

**No log, no journal, no handoff.** The survey's sharpest finding was that this
project already built *notes for the next session*, ruled that facts may not go
in it, and watched it rot: `docs/HANDOFF_next_session.md`, last touched
**2026-08-23**, ten rounds ago.

---

## b. HOW THE CANON LINE IS ENFORCED

**The model is `reveal/reachability.mjs`**, whose own doctrine is the right one
here: *"nothing here reads a row's opinion of itself except to contradict it"* —
eight checks, each a different way for the boundary to break.

**The line is ONE-DIRECTIONAL and that has to be said first.** The Record is the
story; a reel is promotion *about* the story. **Story → spec is allowed:** a
caption may quote the museum. **Release → story is forbidden.** A gate that
blocked both directions would forbid a reel from quoting the thing it promotes.

### Four ways the line breaks, and the check for each

**1. A `src/` FILE IMPORTS THE RELEASE DATA.** Static walk of `src/` from disk,
refusing any import specifier resolving into `release/`. Cheap, exact, and it is
the check the five `reveal/` imports above prove is necessary.

**2. A RELEASE STRING IS RETYPED INTO `src/` WITH NO IMPORT AT ALL.** The real
risk — somebody moves a caption into a Record entry by hand. The template exists
and works: **`wb-ops-braces`** in `vite.config.js`, which walks `src/**/*.{js,jsx}`
**from disk in `buildStart`**, parses each with acorn, visits every string
literal and calls `this.error()` on a hit. Its own comment says why disk and not
per-module: *"it sees a file even when nothing imports it: a note sitting in a
module the bundler tree-shook away is still a note somebody has to act on."*
Same walk, matching **release-originated strings and platform refs**.

**3. A REEL REF REACHES THE BUILT BUNDLE.** The `wb-dev-mark-guard` shape —
read the launch build's own output and fail on a hit. It catches anything the
first two miss, including a route Ops has not thought of.

**4. RELEASE DATA IS SMUGGLED INTO A RECORD ENTRY.** **Already enforced, today,
with no new code.** `reveal:check`'s `DRAWN_ENTRY_FIELDS` refuses any entry field
nothing renders:

> *"declares `<k>`, and nothing renders it… 'Nothing drops silently ever again'
> (Mike, 2026-08-08)."*

### The false positive that check 2 would otherwise produce — and the existing fix

**If a caption legitimately quotes the museum, its string is in `src/` on
purpose**, and a naive string match would fail the build on correct work.

**The provenance classes already solve this and no new idea is needed.** A
quoted caption is **`RESTATED`**, the class that already means *this restates
something else*, carrying its `r` pointer to the row it restates — the same
mechanism whose chains the prune had to repoint on 2026-08-09. **The gate matches
only on strings the release file declares as its OWN (`HOUSE` / `MIKE`).**
`RESTATED` strings are exempt **by carrying a pointer at the museum row they came
from**, which is a claim the gate can check rather than a permission it grants.

**So the class is not decoration here — it is what makes the gate possible.**

### What the gate is not

It is not a new discipline (ruling 5) and it does not read `docs/`. And it must
be named honestly as **one gate among the human-discipline set** — OPERATIONS §0
is blunt that of every gate in this manual, only `deploy-guard.mjs` runs at
deploy time and *"every other gate named in this manual… is human discipline."*
Checks 1, 2 and 4 run at build; check 3 runs at launch build. **None of them runs
at deploy.**

---

## c. WHAT THIS WALKS INTO ANYWAY — SAID NOW

Four of the survey's six, honestly.

**#5 A SECOND CATALOGUE — WALKED INTO, PARTLY, AND UNAVOIDABLY.** `releases.json`
is a list of things that exist, beside an asset table that is also a list of
things that exist. **The line drawn:** a release names a museum asset by **uid**
when one exists and never re-describes it; where no museum asset exists — which
is every Coconuts reel today — `source` is `null` **with a reason**. It holds no
bytes, no dimensions, no sha256, no `usedBy`. **The day it grows a second copy of
a field the asset table owns, it has become the thing `shelf.mjs` warns about.**

**#3 ANALYTICS — WALKED UP TO THE EDGE.** Views are in the design; ruling 3 put
them there. **The line drawn: nothing computes.** `readings` is an append-only
list. No rate, no total, no average, no best-performing, no comparison between
surfaces, no chart. Ruling 2: *"Not as a rigid set of specific metrics."*
**A reading is evidence for a conversation, never a score** — and the moment
something derives a number from two readings, that line is gone.

**#6 SWALLOWING ADJACENT WORK — ONE REAL COLLISION.** The spec's *watching*
field is genuinely close to the register's *what he must supply*. **The line
drawn:** `OPEN_ACTIONS.md` holds what is **waiting on a person**; *watching*
holds **what would change a decision already made**. Nothing appears in both,
and if something does it belongs in the register.

**#1 A MUSEUM SURFACE — NOT WALKED INTO NOW, AND IT WILL PULL.** There is no
page in this design. **The pull arrives at about fifteen rows**, when reading
JSON stops being pleasant and the day editor is sitting right there. Saying it
now so a later round meets it as a decision.

**Not walked into: #2 (no calendar — no due date exists anywhere) and #4 (no
API — every number is typed).**

---

## d. WHAT MIKE MUST DECIDE

Numbered, plain, one at a time. **Question 1 decides the shape of the first data
that goes in, so it decides the round.**

**1. FIRST.** The four quarter reels — each the next quarter of the song. Are
they **A.** four separate things that happen to be related, or **B.** one thing
released in four parts? It changes how they are written down and how they are
counted later.

**2.** The same video goes to all three places. Do the words that go with it stay
the same everywhere, or does each place get its own?

**3.** When a reel is on YouTube, does the museum ever point at it — a link on
the Coconuts page, say — or do the reels live entirely outside the building?

**4.** For each of the five reels that already exist: what it is called and where
it is. *(This is his to supply rather than decide, and nothing can be written
down without it.)*

**5.** The three accounts' handles — register **M60**, open since 2026-08-05, and
the site still carries his own *"Follow us on social media"* with nothing behind
it. *(Also supply, not decide.)*
