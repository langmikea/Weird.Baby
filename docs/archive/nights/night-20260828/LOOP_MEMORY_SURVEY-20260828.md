# THE LOOP'S MEMORY — SURVEY

**2026-08-28. Report only. Nothing built, no design proposed.**
Supersedes `SOCIAL_PIPELINE_SCOPE-20260828.md` and the uncommitted
`docs/SOCIAL_PIPELINE_SCOPING-20260828.md`.

---

## 0. WHAT MIKE'S RULINGS REVERSE IN OPS' OWN PRIOR SCOPE

Said first, because a superseded document that does not say so is a trap.

| the prior scope said | ruling | now |
|---|---|---|
| **A schedule is a rule that generates due dates**, with anchors and cadences | **2** — *"We are not going to work backwards"* | **DEAD.** No calendar, no generated dates, no cadence arithmetic. |
| Three declared schedules: robots 3×/week, music fortnightly, house silent | **2** | **DEAD as mechanism.** Those are Mike's own words about intent, not a spec. |
| A `social:day` report — what is due, what is a gap | **2** | **DEAD.** Nothing is "due"; nothing is "late." |
| The house's silence as a *declared schedule* | **2** | **DEAD.** |
| It lives beside `reveal/` and `provenance/` and is read by museum instruments | **1** — *"not a museum tool"* | **WRONG VENUE.** No page, no wing, no place in the site. |
| A post is one object that is plan and receipt | — | **SURVIVES**, and is the part that matters. |
| Append-only dated readings | — | **SURVIVES**, and is less new than Ops thought (see **d**). |
| Do not duplicate the shelf / record-shape / the day editor | **6** | **SURVIVES and hardens.** |

**Ops built a calendar because Ops was asked what a schedule is. The right answer
was that it is not a schedule.** Recorded as a reversal at the site of the old
argument, which is this project's own practice.

---

## a. COULD THE RECORD WING, WITH A DIFFERENT VOCABULARY, BE THE WHOLE ANSWER?

### **PARTLY. The Record's SHAPE is the answer. The Record's WING is not, and cannot be.**

### What kills the wing outright — one measured fact

```
reveal/record-entries.mjs:55
  export const RECORD_SOURCE = "src/data/artists/robots-record.js";

src/data/artists/robots.js:326
  import { RECORD_ENTRIES } from "./robots-record.js";
```

**The Record's entries live under `src/` and are imported into the shipped
bundle.** They are parsed back out by acorn AST walk, placed by
`GOVERNED_PREFIX = "/robots/"`, gated by `reveal:check`, dated off
`RECORD_EPOCH`, and rendered by the worker against request time.

**Every one of those bindings is the thing ruling 1 forbids.** A Record entry
exists *in order to be read by a visitor*. It is in-story by Doctrine 21,
governed by Doctrine 11, and its strings need provenance rows. A release note
about a YouTube reel put through that machinery would either ship to visitors or
need every one of those mechanisms disabled — at which point none of the
machinery is doing anything.

**So: not the wing, not `src/`, not the epoch, not the door, not the ledger.**

### What ports, and it is most of the value

| the Record's | why it ports |
|---|---|
| **the entry as one object that is plan AND receipt** | the single most valuable idea in the building — no second file records that Record 003 went out, because the entry existing IS that record |
| **`no` authored, never derived from position** | paid for: numbering by index renumbers everything the day one is inserted |
| **the verbatim rule and the three marks** | Ops blue / **his words gold** / his-rule-Ops-wording amber — a paraphrase in his class is indistinguishable from his sentence a week later |
| **`record-shape.mjs`'s form** | plain data, no imports, no side effects, so the thing that enforces and the thing that warns read the same line; `enforcedBy` on every row; **`silent: true`** where a breach produces no error |
| **the day editor's `[SHAPE]` / `[WEIRD.BABY]` split** | 21 and 7 markers, and its own test: *the second instance is the test of the first* |

### What would have to change — plainly

1. **The source moves out of `src/`.** It stops being a bundled module and stops
   being AST-parsed out of one.
2. **The day stops being derived.** `recordDay(n) = epoch + (n − 1)` is the
   museum's story clock. Ruling 2 says there is no clock here. **A release
   carries the date it actually happened and derives nothing.**
3. **In-story goes.** Doctrine 21 makes anything through the dictation
   instruments in-story by construction. This is out-of-story and must never
   be mistaken for canon.
4. **The audience inverts.** A Record entry is written for a visitor. This is
   written for the **next Ops** — ruling 5 — and Mike is not its reader.

**The honest summary: the Record is the proof that this shape works in this
project, and it is the wrong instance of it.**

---

## b. WHAT ALREADY CARRIES DECISIONS AND THEIR REASONS

Five carriers exist. **Four are close and each lacks exactly one thing.**

### `docs/MUSEUM_RULINGS-20260817.md` — the closest to "what was decided and why"

*"Mike's decisions of this day, in one place, so a later round does not re-open
one of them as if it were an open question."* Settled rows, his words quoted,
each naming the reasoning and where an open remainder went.

**And it already contains the shape ruling 2 describes.** Ruling 3, SEO:

> **Not killed. Deferred with a trigger** … **TRIGGER: roughly 30 Records** —
> the point at which the museum has enough written surface for a name to have
> something to resolve TO.

**That is a forward-moving decision that advances on response rather than on a
date**, and it is the only instance of it in the tree.

**What it lacks:** it is dated per *day of rulings*, not per subject, and
**nothing carries the outcome.** A ruling closes; nothing records what happened
after.

### `docs/THREADS.md` — structurally the nearest thing to ruling 2's spirit

Its four rules are almost the brief:

> - **A thread is canon the moment it is written down.**
> - **Ops never rewrites a thread.** Mike's words go in as typed.
> - **When a Record uses a thread, mark it WOVEN and name the Record.**
> - **A LOOSE thread is not a task. Nobody has to use it. Nothing counts them,
>   nothing is late, and a thread that is never woven has not failed.**

**"Nothing counts them, nothing is late" is ruling 2, already written down and
already enforced by nothing but discipline.** It is a live-forever list with a
status and a used-by pointer, and it does not nag.

**What it lacks:** it is **in-story canon**. Right shape, wrong content class.

### `docs/OPEN_ACTIONS.md` — the register

Row shape: *the question · what he must supply · the row*. Doctrine 14 maintains
it every round; Doctrine 24 makes a closed row **leave** rather than sit as
clutter, with history in `OPEN_ACTIONS_CLOSED.md` which is deliberately **not**
on the Ops desk.

**What it lacks:** it holds only what is **open and waiting on somebody**. It is
not a record of what happened, and by Doctrine 24 the closed half is explicitly
put out of view.

### The 98 round logs — and the museum has already ruled these out

> **"A round log is a diary, and diaries do not answer questions. Nobody greps a
> diary for *which channel is the machine on*."**

The BREADCRUMBS rule follows from it: when a round produces a fact, **file it
where the fact belongs — not only in the round log.**

**What it lacks:** it is the wrong shape by the project's own doctrine.

### `docs/HANDOFF_next_session.md` — already tried, already demoted

This is the closest existing thing to *"notes for the next session"*, and the
museum's verdict on it is on the record:

> Truth ranking: `live tree > git log > STATE.md > handoffs > any chat memory`.
> **Handoffs rot in days.** A handoff's "recommended next step" is a suggestion
> stamped at write time, not a standing order.
> §9.3: **Process and facts do NOT go in handoffs.**

**And it has rotted exactly as predicted.** Last touched **2026-08-23**, at HEAD
`ea4c967` — five days and roughly ten rounds ago, describing a round that closed.

**This is the most useful finding in section b:** the obvious answer to ruling 5
is a handoff file, **the museum has already built one, ruled what may not go in
it, and watched it rot.** Whatever the loop's memory is, *it is not a handoff*.

### So what is the loop's memory today?

**Nothing.** The four carriers hold, between them: what is open, what was
decided, what a round did, and what is canon-but-unused. **None holds what went
out into the world, what came back, and what that changed.** That is the gap,
and it is a gap of *subject*, not of machinery.

---

## c. WHAT DOC CONTROL MEANS HERE, CONCRETELY

**Two things carry that name and they must not be confused.**

### 1. DOC CONTROL is a real, named object in this museum

Built at v50, `docs/MUSEUM_OVERNIGHT_LOG-20260804.md` §N3: **a fourth face on
the front desk**, in-story, about *how paper is handled here*. Its canon is
Mike's own, and its four states are printed on a rubber-stamp hook:

> **PRELIMINARY · FINAL · MARKED UP BY HAND · APPROVED**

> *"What is held is assembled out of copies caught at different stages:
> preliminary, final, marked up by hand, and one stamped APPROVED."*

**And it carries its own boundary, which is the part that bears on this job:**

> **THE LINE IT DOES NOT CROSS.** *"Nothing describes this repository, its
> directories, its verification runs or its backlog. That would be the making of
> the museum on the glass, which Doctrine 11 forbids however true it is."*

**That sentence is ruling 1 arrived at from the other side, eight weeks early.**

### 2. The museum's actual documentation-control mechanisms

These are real, enforced, and are what "as you do in the Museum" most plainly
names:

| mechanism | what it does | applies here? |
|---|---|---|
| **Provenance classes** — `MIKE / VERIFIED / DERIVED / HOUSE / RESTATED` | every visible string declares whose it is | **YES, and it is the core of it.** A stat read off YouTube is `VERIFIED`; Mike's assessment is `MIKE`; Ops' summary is `HOUSE`. Selecting an Ops-written option is **HOUSE, not MIKE** — approval is not authorship. |
| **The three marks** — Ops blue · **his words gold** · his-rule-Ops-wording amber | keeps his sentence from being "improved" and Ops' from being read as his | **YES.** A sit-down is a transcript problem before it is anything else. |
| **The verbatim rule / FLAG, NEVER FIX** | his words in as typed, typos carried; stale words are flagged and left | **YES.** |
| **`provenance:gate`** | default-deny over `src/` + `index.html` | **NO — it does not reach `docs/`.** |
| **`docs:numbers:gate`** | published values in governing documents must match the tree | **ONLY IF DECLARED.** It reads a hard-coded list of **8 documents**. A new file is ungated until added. |
| **Round log per round + BREADCRUMBS** | *file the fact where the fact belongs* | **YES.** |
| **Doctrine 14** — the register is maintained every round | open items never rot silently | **YES.** |
| **Doctrine 24** — ruled gone is gone from view | closed rows leave; history is off the desk | **YES, and it is a hazard here** — see **e**. |
| **The archive-is-a-snapshot rule**, cut at a named HEAD, never edited to track | old wording stays readable as what was said that day | **YES.** |
| **The approval law** — signature + fingerprint, a changed page stops being approved | `approve:check`, parked as a backlog item, law not weakened | **PARTLY** — the law is the useful half; the tool has no consumer. |

### The concrete answer

**Doc Control here means: every line in the loop's memory says whose it is and
where it came from, his words are never rewritten, a fact is filed where the
fact belongs, and nothing published in it may drift from what the tree
actually holds.**

**And the one hole to name out loud:** `provenance:gate` stops at `src/`, and
`docs:numbers:gate` reads a declared list of eight. **A memory living in `docs/`
inherits the doctrine and none of the enforcement** unless it is deliberately
declared into that list.

---

## d. WHAT IS GENUINELY NEW — RUTHLESSLY

Tested one by one. **Almost nothing survives.**

| candidate | verdict |
|---|---|
| A record of what went out, with what it points at | **NOT NEW.** A Record entry, minus the wing. §a. |
| A dated performance reading | **NOT NEW, AND THE PRECEDENT IS EXACT.** `worth-a-listen-facts.js` already carries `"18,242 views as of 2 August 2026."`, `"13,758 views as of 2 August 2026."`, `"61,645…"`, `"89,528… — the most-watched of her recent uploads"` — hand-captured YouTube counts, each stamped with the day read, each classified **`c: VERIFIED`** in the register with a `source:` tag, and a `"Snapshot taken 2 August 2026."` row naming the sweep. **The museum has been doing this for a month, for other artists, on the glass.** |
| A decision with its reason, settled | **NOT NEW.** `MUSEUM_RULINGS-*.md`. |
| A thing deferred until something changes | **NOT NEW.** Ruling 3's *"TRIGGER: roughly 30 Records"*. |
| A live list that nags nobody | **NOT NEW.** `THREADS.md`: *"nothing counts them, nothing is late."* |
| An open question waiting on Mike | **NOT NEW.** OPEN_ACTIONS' *question / what he must supply* row. |
| A spec Ops hands Mike | **NOT NEW.** OPERATIONS §3's brief — one task, explicit scope, explicit target; **MIKE DOES NOT EDIT BRIEFS**, so it goes complete or not at all. Different subject, same object. |
| Off-glass venue for Ops-facing documents | **NOT NEW.** `docs/` is exactly that. |
| Not duplicating the asset shelf | **NOT NEW.** `buildShelf()`, and the gate at `6307286`. |

### What is left — and it is three things

1. **THAT THE MUSEUM KNOWS WEIRD.BABY'S OWN PUBLISHED OUTPUT EXISTS AT ALL.**
   Measured: the whole Weird.Baby wing carries **two** `ytId`s — `c1vODrVXOg0`
   (Coconuts, Official Music Video) and `-IwcOSnyNBI` (E.D. Yahdah). **The one
   full reel and the four quarter reels of ruling 7 are not in either
   repository, in any form.** This is a **data** gap, not a mechanism gap:
   nothing needs building to hold it.

2. **A LINK FROM A MUSEUM ASSET TO A THING PUBLISHED OUTSIDE THE MUSEUM.**
   `usedBy` on an asset row answers *what in this repo builds from this file*.
   The ledger's `assets` arrays answer *what does a Record entry deliver*.
   **Nothing answers *where did this leave the building to*.** Thin, but real.

3. **A DECISION THAT NAMES WHAT IT IS WATCHING.** Ruling 3 does it once, in
   prose, for one subject. Ruling 2 asks for it as the normal case: *"constantly
   re-assessing… looking ahead, then striking strategically."* **The field that
   says *what would change this* does not exist on any row anywhere.**

**Everything else on the table is assembly.** That is the blob defence and it
should be the headline of any brief that follows.

---

## e. WHERE THE BLOB RISK IS

Six specific places, each with the line that would have to be drawn.

**1. IT BECOMES A MUSEUM SURFACE.** The strongest pull, because every instrument
Ops would reuse renders a page — the day editor, the tracker, the desk, the
light table. **The pull is the reuse itself:** reuse `day.mjs` and you have a
page, and a page in this project wants a room. Ruling 1 forbids it and DOC
CONTROL's own boundary forbids it independently.

**2. IT GROWS A CALENDAR BACK.** Ruling 2 kills it once; **the tree will offer it
back.** `RECORD_EPOCH`, `recordDay()`, `reveal:day` and the whole dictation
outline are a working, admired, date-driven pipeline sitting one import away, and
the honest-looking move — *"reuse the Record's day machinery"* — reintroduces
exactly what he ruled out. **This is the highest-probability failure.**

**3. IT BECOMES ANALYTICS.** One view count invites a second; two invite a chart,
a rate, a best-performing, a benchmark. Ruling 2 names this directly: *"Not as a
rigid set of specific metrics."* **The line: a reading is evidence for a
conversation, never a score.**

**4. IT REACHES FOR AN API.** The moment typing numbers by hand becomes tedious,
the YouTube Data API is the obvious fix — and it drags OAuth, tokens, refresh,
a secret store and a scheduled job behind it. **Mike's previous ruling on this
was explicit; the tedium is the cost of that ruling, not a defect in it.**

**5. IT GROWS A SECOND CATALOGUE.** *Which reel is which* is one small step from
a parallel asset table. `shelf.mjs`'s header already names this failure —
*"a parallel list on the day it was written and a divergent one within a round"*
— and `assign.html`/`shorts.html`/`artifacts.html` are the proof it recurs.

**6. IT SWALLOWS ADJACENT WORK.** *What should we post* is one question away from
*what should we make*, which is the backlog; from *what have we never shown*,
which is `surfacing.mjs`; and from *what is waiting on Mike*, which is the
register. **All three already exist and none of them should move into this.**

### And one risk that is not a blob risk but will look like one

**Doctrine 24 works against a memory.** *Once it is ruled gone, it is gone from
his view* — closed rows leave the register, and the closed file is deliberately
**not** on the Ops desk. **A memory of what happened is a memory of closed
things**, and the next Ops needs the closed half most. Doctrine 24 governs
**Mike's view**, not Ops' record — but the two have already been conflated once
in this project, and a round that tidies this file under Doctrine 24 would
delete precisely what ruling 5 is asking for.

---

## FOR THE NEXT OPS, IN ONE PARAGRAPH

The reel machinery works and is gated (`6307286`). What exists in the world is
Coconuts: one full reel and four quarter reels, each the next quarter of the
song, all on YouTube, **and none of them is named anywhere in either
repository.** There is no schedule and there must not be one. The museum holds
no handle for any account (**M60**, open since 2026-08-05) and cannot invent
one. The process is a recurring sit-down; Ops writes specs from it and Mike
makes and posts by hand. **The job is that the next sit-down does not start from
nothing** — and almost every part needed to do that already exists in this tree
under another name.
