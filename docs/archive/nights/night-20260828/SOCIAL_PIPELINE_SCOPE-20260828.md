# THE SOCIAL PIPELINE — SCOPE

**2026-08-28. Scoping only. Nothing here is built.**
Written after the leak was closed (`docs/MUSEUM_SHORTS_GATE_LOG-20260828.md`).

Mike's four rulings, as read:

1. **The museum does not assemble reels. Mike makes them.** No encoder. The
   flash-bang storyboard stays where it is. *(A for now, B later.)*
2. **The whole shebang, to best practices** — plan, record, and performance.
   Not the minimum record.
3. **The museum runs daily operations. YouTube's own scheduler publishes.**
   Mike uploads and sets a time there. **No API calls, no OAuth tokens, nothing
   firing at 9am.**
4. **Facebook is a channel with no scheduler.** When a post is due the museum
   says which surfaces it is due on; the record captures Facebook when he posts
   it. No mechanism, no assumption.

**The shape those four rulings force:** the museum holds the **intention** and
the **record**. The platform holds the **mechanism**. Nothing the museum runs
ever reaches outward — which means every hard problem here is a file problem,
and that is the good news.

---

## a. WHAT A POST IS

### The object

**A post is one declared thing that starts as an intention and becomes a
receipt.** It is not two objects. That is the Record's own property and it is
the single most valuable thing to copy:

> *"Which days get a Record is decided by WHICH ENTRIES EXIST, and that is Mike
> writing or not writing."*

A Record entry is simultaneously the plan and the proof it happened. **There is
no second file recording that Record 003 went out.** A post needs exactly that,
because §5 of the survey found the opposite everywhere else: a schedule with no
record of what went out is not a workflow.

### The fields, split at the SED seam

**`[SHAPE]` — what any project gets:**

| field | what it is |
|---|---|
| `no` | **Authored, never derived from position.** The Record paid for this: numbering by index renumbers every post the day one is inserted. |
| `due` | `YYYY-MM-DD`. The day a schedule generated. |
| `schedule` | which schedule generated it — so a post can always name its own reason for existing |
| `surfaces` | which channels it is due on, declared per post |
| `pointsAt` | the address it sends a viewer to |
| `carries` | which artifact — by name, never by embedding: the MP4 is gitignored and regenerable, the recipe is the durable thing |
| `state` | `planned` → `staged` → `out` → `captured` |
| `out[]` | per surface: the date it actually went, and the platform's own id |
| `readings[]` | **append-only** performance, each entry carrying its own as-of date |

**`[WEIRD.BABY]` — what this project fills it with:** that the surfaces are
YouTube and Facebook; that the schedules are robots / music / house; that the
addresses are the museum's wings; the caption text; the cadences.

### The four states, and why four

- **`planned`** — a schedule generated a due date. Nothing exists yet.
- **`staged`** — Mike has uploaded it and set a time in YouTube. **This is the
  state ruling 3 creates and it is the reason four rather than three:** the post
  is real, it is scheduled, and the museum cannot see it. Without this state the
  museum cannot tell *not made* from *made and waiting*, which is the difference
  between a gap and a false alarm.
- **`out`** — its day has passed.
- **`captured`** — Mike has told the museum where it landed.

### Where it lives, and what reads it

A declared data file beside `reveal/` and `provenance/`, **not in `src/`** — a
post is not visitor-facing and does not go through the worker, the door, or
Doctrine 11. Three readers, in build order:

1. **a day report** — what is due, what is staged, what is a gap
2. **the day editor**, taught a second vocabulary (see **d**)
3. **the gate already built**, for anything that names an asset

### The one thing that is genuinely hard

**Everything about the post is knowable except whether it actually went out.**
Ruling 3 removes the only mechanism that could tell the museum. So the seam
between `staged` and `out` is **a person pasting a link**, and the honest
consequence — *the record is only as current as the last time Mike pasted* —
belongs printed on the instrument, not discovered three weeks in.

---

## b. THE THREE SCHEDULES

### The question as asked: a rule, or a list?

**A rule that generates due dates. Not a list someone fills.**

The argument is not preference:

- **A list stops being filled.** 3×/week for a year is 156 rows nobody types.
  `docs/SURFACING_LOG.md` is the proof already in the tree — a genuinely useful
  instrument that was meant to run every session close and **stopped on
  2026-08-06**, twenty-two days and sixteen rounds ago.
- **The museum already rules this way.** `recordDay(n)` is `epoch + (n − 1)`
  and *"will never be anything else — NO weekend logic, NO holiday table,
  ever."* The calendar is dumb on purpose.

### But the rule generates a QUESTION, not an obligation

This is the half that keeps a schedule from becoming a nag:

> **"A GAP IN THE NUMBERS IS NOT A DEFECT — 001–005 followed by 008 means
> nobody wrote on three days — and a later round must not 'fix' one."**

So: **the schedule generates due dates; the post record answers them; a due
date with no post is a gap, reported and never an error.** That is exactly
`reveal:day`'s existing posture — *"Nothing to move. The tree and the Record
agree"* — pointed at a different manifest.

### A schedule declares four things

An anchor date · a cadence · the surfaces it is due on · and **its own silence
if it is silent.**

| schedule | cadence | surfaces | open |
|---|---|---|---|
| **Robots** | 3× / week | YouTube + Facebook | **which three days** — question 1 |
| **Music** | fortnightly | YouTube + Facebook | **which day, from when** — question 2 |
| **The house** | **SILENT — declared** | none | is it silent for now, or as a rule — question 3 |

**The house's silence must be a declared schedule carrying its reason, not an
absence.** This is the museum's own standing discipline — *a silent filter is
indistinguishable from a bug* — and without it a later round finds a wing with
no schedule and helpfully gives it one.

### What a schedule is NOT

It is not a queue, not a cron, and not a thing that fires. Nothing in this
project runs on a clock and ruling 3 keeps it that way. **A schedule here is
arithmetic over a calendar, evaluated when somebody asks.**

---

## c. THE RECORD — AND WHERE PERFORMANCE COMES FROM

### What went out, when, on what

- **what** — the post object itself; it was the plan and it is the receipt.
- **when** — captured, not derived. YouTube published it; the museum was not
  told.
- **on what** — the `surfaces` list, confirmed per surface. **YouTube and
  Facebook confirm separately**, because ruling 4 makes them different kinds of
  thing: YouTube is scheduled and lands on its own, Facebook is posted by hand.
  A single "it went out" flag would quietly assert Facebook happened.

### How it did — with no API

**Mike reads it off YouTube Studio and it is captured as a dated reading.**

Three properties this needs, and each is paid for by something already in the
tree:

1. **Append-only, never a single number.** A view count overwritten in place
   destroys the trend, and the trend is the entire point — `SURFACING_LOG.md`'s
   own header: *"It exists so the numbers become a TREND rather than a
   reading."*
2. **Every reading carries its own as-of date.** A view count without one is
   meaningless. This is the hazard the tree has already filed twice —
   *"any tool that stamps `saved` at the moment of saving is answering a
   question nobody asked it."* **A reading is stamped with the day Mike read
   it, never with the day he typed it in.**
3. **It says how stale it is.** The instrument prints the age of its newest
   reading, so nobody reasons from a three-week-old number without knowing.

### The one thing the museum CAN detect on its own

A post that is `staged`, whose due date has passed, and which has no capture.
**That is the whole of what the museum can notice without asking anything**, and
it is worth having: it is the difference between *he forgot to post* and *he
forgot to tell us.*

---

## d. WHAT ALREADY EXISTS — AND WHAT MUST NOT BE BUILT TWICE

### Reuse, and building a second one is the defect

| what | why it binds |
|---|---|
| **The shelf — `buildShelf()`** | Anything that offers an asset uses it. Its own header: *"A second tool that re-derived the shelf would be a parallel list on the day it was written."* Non-negotiable. |
| **`record-shape.mjs`'s PATTERN** | `BUDGETS` / `FORMATS` / `CONSTRAINTS`, each row naming its `enforcedBy`, and **`silent: true`** on every constraint whose breach produces no error. Per-platform limits are this shape with different numbers. Doctrine 22: *he must never again discover a limit from a report.* |
| **The day editor — `day.mjs`** | **This is the SED test itself.** *"The second instance is the test of the first. If adding a second project means writing a component, the first one was built wrong."* It already carries 21 `[SHAPE]` and 7 `[WEIRD.BABY]` markers and names its three pinning constants. **A separate post editor would be the first instance failing its own test.** |
| **`reveal/day.mjs`'s report shape** | *what is due, what is out of step, nothing to move.* A social day report is the same instrument pointed at a different manifest. |
| **`surfacing.mjs`** | **A planner asking *what should I post* is asking surfacing's question.** It already re-cuts the ledger by wing and knows what has never been shown. Do not build a second one — **restart the one that stopped.** |
| **`tools/shorts-gate.mjs`** | Built this round. Anything that names an asset asks it. |
| **The register** | Open questions go in `OPEN_ACTIONS.md`, not in a new tracker. |

### Genuinely new — nothing in the tree does these

The post object and its four states · the schedule rule and its gap reporting ·
the append-only dated performance series · the per-platform numbers.

### Said plainly: is any of this a second copy?

**A post is not a Record entry, and it must not become one.** They differ on
every axis that matters: a Record entry is **in-story** (Doctrine 21), sits on
the glass (Doctrine 11), is published by the worker against request time, and is
governed by the approval law. A post is **out-of-story**, is on nobody's glass,
and is published by YouTube. **Same shape, different object.** Do not file posts
in the Record and do not make the Record generate them.

**The one real duplication risk is the calendar.** The Record has a day; a post
has a due date. If both grow their own date arithmetic, that is two calendars
drifting. The resolution: **the schedules take their own anchors and must not
read `RECORD_EPOCH`** — a posting cadence is not the story's cadence, and
chaining them means moving the epoch silently reschedules a quarter of social —
but both should use the same date primitives, so there is one place where a day
is computed.

**And `SURFACING_LOG.md` is not the post record.** It counts what has *not been
shown*; the post record counts what *went out*. Adjacent, not the same. But they
are two views of one fact, and **a post going out should move a surfacing
number** — if it does not, one of the two is wrong. That is a useful check to
have and it costs nothing.

---

## e. WHAT MIKE MUST DECIDE

To be put to him **one at a time**, in plain terms, no mechanism in the
question. **Question 1 decides the round; the rest can wait behind it.**

> **1. FIRST — the one that decides the round.**
> The robots go out three times a week. Which three days?
> **A.** Monday, Wednesday, Friday **B.** Tuesday, Thursday, Saturday
> **C.** He names three.

> **2.** The music goes out every two weeks. Which day of the week, and does the
> first one land the week the museum reopens or the week after?

> **3.** The house stays quiet. Is that **A.** for now, and it gets a schedule
> later, or **B.** a standing rule — the house does not post?

> **4.** A day comes round and nothing got made. What should the museum do?
> **A.** Say nothing — an empty day is an empty day.
> **B.** Show the gap and count it, so a quiet fortnight is visible.
> **C.** Ask him what happened.

> **5.** A reel points people back at the museum. Some of what the reels are
> made of is not on the site yet. Should a reel point at a picture that is still
> behind the door — **A.** no, only at what a visitor can already see;
> **B.** yes, that is the tease; **C.** yes, but the post says *arriving* rather
> than linking to it.

> **6.** How the posts are doing has to be typed in by hand — nothing here can
> ask YouTube. How often is he willing to do that? **A.** once a week
> **B.** once a fortnight **C.** whenever he happens to be in there.

### And one thing he must SUPPLY, not decide

**The handles.** Register row **M60** has been open since 2026-08-05, and the
site still carries his own sentence *"Follow us on social media"* with nothing
behind it. **A handle is not something Ops may invent.** The accounts now exist;
the tree cannot name them, and everything in **a**, **b** and **c** that links
outward is blocked on that one paste.

---

## APPENDIX — TWO THINGS FOUND IN THE SURVEY THAT BEAR ON THIS

**The Twitter card is advertising a shut wing.** `src/worker.js` holds the
descriptions back while the Robots wing is closed, but only two of three:
`twitter:description` is not rewritten, and on 2026-08-17 commit `4e29e4f`
unified all three into one string that names the robots. **Any link shared to a
platform reading that card promises a wing that answers 404 until 2026-09-07.**
Registers **M68** and **M83** are open on adjacent questions and M68's body
still prints the pre-`4e29e4f` strings. **Flagged, not fixed** — a share card is
the museum introducing itself, which is Mike's sentence.

**The 2021 review cut must never be a post.**
`weird-baby-robots/docs/MAGIC8_ACTION_REEL-20260803.md`: *"Nothing here is
publishable. Nothing here becomes publishable by being copied."* It is exempt
from the obfuscation law only as a review cut, out of tree and marked. It is not
at the address that document gives, which is evidence about that address and
nothing else. **If a reel ever needs that footage it is re-derived under the
law, never copied.**
