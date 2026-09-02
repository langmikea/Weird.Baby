# THE PARITY RULING + TRIM — round log

**2026-08-05 · autonomous, single agent, drafting lane · P1–P5**

Gates: lint **11 errors / 9 warnings = baseline** · `npm run build` green ·
`npm run provenance:gate` **PASS** · `npm run reveal:check` **PASS** ·
`npm run parity:gate` **PASS** · browser lap at desktop and 390px, on the
**dev server AND again on the built bundle**. Ledger **156 → 157**.
Surfacing logged: **13 spendable · 13 promised · 15 idle**.

---

## The shape of the round

Two rulings landed, one behaviour built, one idea banked, and a defect that
turned out to be four defects. Nothing here was invented: every sentence Mike
supplied is used as given, and the two places where Ops had to choose are named
as choices (§3's input method, §6's refusal to prune blind).

---

## P1 — THE PARITY RULING

**Mike's ruling, recorded verbatim in `tools/menu-parity.mjs`:** the three menu
divergences are **holdings gaps, not design** — the mainframe has no manual, no
portal feed and no questions of its own. Forcing parity would print rows leading
nowhere, which THE STUB LAW forbids on exactly those grounds. So parity is the
default, a divergence is a yellow flag, **and a flag justified in writing by a
holdings gap is RESOLVED rather than overridden.** NIAC's menu shows what NIAC
has. When the holdings arrive the rows arrive with them and the flag clears
itself.

**What R2 could not do, and this is why the ruling needed a build.** R2 shipped
four written reasons and no way to tell *this is answered* from *this is
excused*. Every reason read the same. So the justification table gains a `kind`
and the report gains a verdict:

| kind | meaning | verdict | may name a holding |
|---|---|---|---|
| `HOLDINGS` | the museum does not hold the material | **RESOLVED** | **must** |
| `PROPERTY` | a fact about the objects, permanent | **RESOLVED** | must not |
| `DESIGN` | somebody chose it | **standing yellow flag** | must not |

**`DESIGN` is declared and nothing uses it, which is the one place this file
argues with the Law of Subtraction and wins.** Without it the first divergence
that IS a preference has two boxes to go in and both say RESOLVED, and the
ruling's whole distinction dies the day it is first tested. It is the boundary
of a rule, not an object on the glass.

**"It clears itself" is now a mechanism rather than a sentence.** A holdings gap
must name the LEDGER ROW that would exist, and be built, if the museum held the
material — and the check reads `reveal/ledger.json` and faults when it does. A
row that is ABSENT and a row that is present-but-`NOT_BUILT` are the same fact
here and are treated as one, so a holding can be named before anybody has
thought to catalogue it:

- The Manual → `doc.manual.niac` — **not a ledger row at all.** The absence is
  the proof, and the day somebody declares one this reason faults.
- The Portal → `portal.feed.niac.1` / `.2` — **in the ledger, NOT_BUILT.** The
  only one of the three whose holding already exists as a row. `closes` said
  this in prose from the day R2 shipped; it is the same sentence, checkable.
- FAQ → `face.niac.faq` — the holdings here are QUESTIONS, so the holding and
  the divergence's own end are the same row and the stale check would catch it
  anyway. Named regardless: **a kind allowed to skip its own requirement is not
  a requirement.**

**Four new refusals, each broken on purpose and each fired** (exit 1, sandboxed
by FILE COPY — never `git checkout`, per the hazard v56 paid for):

| break | reported |
|---|---|
| kind `SOMEBODY-FELT-LIKE-IT` | UNCLASSED JUSTIFICATION |
| HOLDINGS with `holding: []` | HOLDINGS GAP WITH NO HOLDING |
| PROPERTY naming a holding | PROPERTY JUSTIFICATION NAMING A HOLDING |
| holding repointed at a built row | THE HOLDINGS ARRIVED |

**Today: 2 shared · 4 divergences — 4 resolved · 0 standing flags · 0
undeclared.** The ruling itself prints at the foot of a clean report, because a
reader of the output should meet the sentence that makes the verdict mean
something without scrolling to a header comment.

---

## P2 — TEXT NOT SUPPLIED DIES

**M45 ruled, and the reason is sharper than the question was.** The Manual's
plate read STRUCTURE ISSUE · STRUCTURE AND ARRANGEMENT ONLY · **TEXT NOT
SUPPLIED**, and the caption was written to hold the in-fiction reading — an
early issue circulated for arrangement. Mike: **too thin. It was the museum
admitting it had not written the manual, wearing a fiction as cover — Doctrine
11 hiding inside a picture.** Either the plate shows a page actually written, or
there is no plate until one exists. **Empty beats a placeholder in fiction's
clothing.**

**Struck:** `still` and `stillCaption` on `face.viiip.manual`. Not re-captioned —
and the tell is that the caption was already doing the one piece of work the
swap needed. *A caption that has to argue a picture out of its own lettering is
a caption losing an argument with a photograph.*

**What did NOT move, stated so nobody re-derives it:** `reel.plates` is still
`[]` and still waits on B8's ruling (photographs of the printed manual, never
renderings). The head plate was never a frame in the reader. **P2 in the art
register is untouched.**

**Two register rows close on one deletion.** M45 by the ruling; **M4 — "the
Manual's plate is a render where its own ruling requires a photograph" — because
there is no plate left to be a render.**

**Confirmed on the glass** at desktop, on the dev server and again on the built
bundle: zero `face-still` nodes, no `structure-issue-p1` anywhere in the DOM, no
trace of the old caption, and the face reads *FORMAT photographs of the printed
pages, not a rendering · NAV microfiche reader · **PLATES none on file*** over
**REEL EMPTY**. It is a better face than it was with the picture — the prose runs
the full width and the three honest absences are the whole of it.

**What it exposes and does not hide:** the face now has no image, which is the
same Visual Hook Law conflict M29 carried. M29 closed by INHERITING a real
photograph rather than by inventing an object; that is the order of preference
here too, and it is a row rather than a silence — **[M48](OPEN_ACTIONS.md#m48)**.
And `structure-issue-p1.png` joins the idle shelf: **M9, 14 files → 15.**

---

## P3 — THE GUEST LIST SCROLLS BY HAND

**Mike:** keep the stepped bounce and the rests, but let a visitor drive it —
drag, wheel, or arrows; **pick what fits the register and say why.** Manual input
pauses the auto-advance and it resumes after a rest.

### The choice, and the refusal

**DRAG, with ARROWS as its keyboard equivalent. Not two features — one gesture
and the thing any draggable owes.**

**Why drag fits this register.** The book is already described, in its own file,
as a hinged board of paper rows, and M23b's whole ruling is that it is **a ledger
being read down**. Paper is moved by pushing it. Pointer Events make the gesture
identical on a mouse, a finger and a pen. And — the part that matters to the
ruling — **it lands on a row**: the track follows the hand with the transition
OFF (there is no easing between a finger and the thing it is holding), and on
release it settles to the nearest signature with **the same 520ms
`cubic-bezier(.34,1.3,.64,1)` the timer uses.** The stepped register is not
replaced by free scrolling; it becomes the thing the hand is allowed to aim.

**WHY NOT THE WHEEL — a refusal, not an omission.** The book is three rows, 92px,
of a page people scroll past. A wheel handler there takes the wheel from the
PAGE, and every visitor scrolling the lobby drags their pointer across a strip
that hijacks it. Scroll-jacking to fix a list nobody complained about is a cure
worse than the disease, and `/booth`'s whole posture is that this place does not
do things to you that you did not ask for.

**The vertical TOUCH gesture is taken, and that is different.** `touch-action:
pan-x pinch-zoom`. A scrollable list inside a page takes the vertical drag
natively — **`.wb-entries`, the plain fallback, is a real scroll box and already
does** — so this makes the moving book behave like the still one rather than
like an exception. **Pinch-zoom is named explicitly and never taken:** the `pan-x`
shorthand alone would have removed a reader's zoom to animate a list.

**Arrows are the same quantity as the timer.** One press is `STEP`, one
signature. `↓` walks forward and wraps; **`↑` walks back and STOPS AT THE FIRST
SIGNATURE**, because a guest book has a beginning and running off the top of it
would be a claim about the collection that is not true. The box takes focus and
is **labelled by the "Guest Book" heading already above it** — no new string, no
register row, and nothing on the glass announces the control, because a list that
moves is its own invitation. `cursor: grab` is the entire affordance.

### The three things that make it safe

1. **THE CLAMP DID NOT MOVE.** A hand puts the track exactly where the timers
   could — `[0, n]`, the same expression, applied to the drag before it renders.
   Q1's GUARANTEE 1 and GUARANTEE 2 were written as properties of the RENDER
   rather than of the scheduling, and that is precisely why a second author of
   the offset costs them nothing.
2. **"RESUMES AFTER A REST" IS ONE DEPENDENCY, NOT A SECOND TIMER.** Every
   manual input bumps `nudge`; `nudge` is a dependency of the rest effect; a
   dependency changing tears the effect down and re-arms it. There is no new
   clock to fall out of step with the old one — **which is exactly what Q1 was.**
3. **THE ROW HEIGHT IS READ OFF THE STYLESHEET.** The transform is written in
   `--gb-row` units, so a drag measured in the same unit tracks the hand by
   construction. A constant in the component would be a second source for the one
   quantity both halves depend on. If the property cannot be read there is no
   drag — **the book does not guess its own row height.**

### One hazard found before it shipped

Hover-pause moved from `onMouseEnter`/`onMouseLeave` to
`onPointerEnter`/`onPointerLeave` **guarded on `pointerType === "mouse"`**. A
touch synthesises mouse enter/leave on most mobile browsers, so the old handlers
would have **frozen the book under the finger that had just dragged it** — a
control that stops working the first time it is used. Proved in the 390px rig:
touch-drag, then dispatch the synthetic `mouseenter` a phone leaves behind, and
the book resumed on schedule.

### Measured, on the built bundle

| check | result |
|---|---|
| drag tracks the hand | hand moved 70px → track moved **−70.0px**, exactly |
| settles on the nearest signature | 70/30 = 2.33 → **offset 2** |
| arrows | one signature per press; `↑` stops dead at the first |
| `Tab` not swallowed | `defaultPrevented: false` — you can leave the book |
| rest restarts on input | held 3.5s past where the old clock would have fired, stepped at 6.1s |
| unattended advance | one signature per 5s, wraps 8 → 9 → 0 |
| blank rows across 14 samples | **0**, minimum rows visible **3** |
| 390px | no horizontal scroll (386/386), three rows, all properties live |
| console | zero errors, zero warnings |

**Two method limits, stated rather than hidden.** The lap ran first on the dev
server and was **re-run whole on the built bundle** after the console showed
`@vite/client` — the numbers in the table are the built ones. And **the tab was
genuinely `document.hidden` throughout**, so the book was paused by Q1's own fix;
`document.hidden` was confirmed FIRST and then overridden to watch it move,
which is the method v53's lap used and the same order.

---

## P4 — THE POKE, LEDGERED AND NOT BUILT

**Mike:** *pixel-perfect tap on the Weird.Baby logo's EYE and he BLINKS, as if
poked. Three pokes in a row and he wears SAFETY GLASSES for the rest of the
session.*

`egg.lobby.poke` — NOT_BUILT · HELD · **`shown: false`**. Nothing was built, on
instruction. **OPS GRADE: A+++++**, and the grade is written down with its
reasons because the reasons are the specification:

- **It is found by doing something nobody is told to do.** No label, no cursor
  change, no hint. The only route in is a visitor idly poking a face on a screen,
  which is a thing people do to faces on screens.
- **It costs nothing on the glass.** Zero words, zero controls, zero furniture.
  Under the Law of Subtraction that is the strongest position an addition can
  occupy: nothing is lost if it is never found, and nothing was spent leaving it
  there.
- **The escalation is the part no other egg in the table has.** All thirteen
  others are a single state — you trip it or you do not. This one **answers back**
  on the third try, so the reward is for persistence rather than luck, and the
  second reward is **a joke about the first that is only legible to the person
  who caused it.**
- **It is on the one object every visitor meets.** The mark is on the front page
  and nowhere else in the building.

**What it waits on, and neither half is code:** the blink and the glasses are
ART — a closed-eye state of the mark and a glasses state — and this museum does
not invent its own images. **One constraint checked in advance so nobody
discovers it late:** *"for the rest of the session"* means browser storage, and
`/booth`'s privacy answer already covers exactly that shape (the machine
remembers you, the museum does not; settings survive; no cookie travels).
Building it this way does not change that answer. **Building it with a server
round-trip would, and that is the version not to build.**

Transfer class: **exempt — NOT MGK MATERIAL.** It lives on the house's own mark
and nothing arrives; somebody draws a blink. Register row **C40**.

---

## P5 — THE OPEN-ACTION WORK

Everything mechanical and unambiguous, and the two chosen are named with why the
rest were left.

### C39 — and it was never one file

The row said *two literal NUL bytes in `tools/asset-table.mjs`, so every grep
over `tools/` silently skips it*. **A scan of every `.mjs` in `tools/` and
`reveal/` found FOUR files, six bytes.** The pattern had already spread one round
after the row was written — `tools/menu-parity.mjs`, built at v56, carries the
same two.

| file | NULs | what they key |
|---|---|---|
| `tools/asset-table.mjs` | 2 | `mintUid`, the rename matcher |
| `tools/menu-parity.mjs` | 2 | the justification lookup |
| **`tools/provenance-sweep.mjs`** | **1** | **`keyOf` — every register key in the boundary** |
| `tools/migrate-vocabulary-pass1.mjs` | 1 | a dedupe pair key |

**The third one is the finding.** `keyOf` is the function that hashes every
visitor-facing string in the museum, and a grep for its name inside the
provenance boundary's own source came back *"binary file matches"*. This round
hit the defect twice while working: a `grep` for the parity tool's own code
returned nothing, and then an `Edit` failed to match a line it had just read,
**because the Read tool renders a NUL as a space.**

Fixed as the row specifies — the two-character escape, same value to JavaScript,
plain text to every tool. **Proved to change nothing: `provenance:gate` still
PASSES.** If `keyOf` had changed value, every register key would have changed and
all 1,300-odd declarations would have gone undeclared in one run. It passed, so
the hashes are identical. That is the strongest test available and it is free.

### C35 — `/admin` unreachable at a phone width

The header was `space-between` with **no wrap**, so at 390px the control row laid
out to x=633 in a document that does not scroll sideways: `/shop`, `↺ Refresh`
and `← Back` were clipped off the edge and could not be reached at all. Two of
five controls were the whole dashboard on a phone.

**Wrapping is the fix, not a media query** — the failure is not a width, it is a
row of fixed-size controls longer than whatever it is put in. `flex-wrap` is true
at every width; a breakpoint is only true at the one somebody measured. The
inline flex became `.adm-controls` in the same edit. **Measured at 386px: all
five controls in view, `allReachable: true`, no horizontal scroll.**

### What was left, and why

| row | why not this round |
|---|---|
| M9, M26, M37–M43, M45's neighbours | Mike's rulings, not mechanical |
| C17 | explicitly semantic — the lint-debt table says so |
| C16, C29, C30 | need content that does not exist |
| C36, C37 | three options each; a judgement, not a fix |
| C38 | a design change (derive `doc.record.evidence` per entry), correct today |
| **T-F** | **Ops-owned and still not mechanical.** Whether four `tool.*` rows belong in a catalogue of revealable things is a judgement that deletes four rows; the exemption already records the position honestly. Reported again, not taken. |

---

## What this round exposes

1. **[M48] The Manual's face has no image**, which is M29's conflict again on a
   different face. M29 closed by inheriting a real photograph, not by inventing an
   object; that is the bar here.
2. **[M49] The surfacing report cannot tell building-ahead from subtraction.**
   Idle files went 14 → 15 this round and 5 → 14 last round, so the shelf has
   grown **two packets running** — which is R7's own tripwire. But **both growths
   are DELETIONS**: v56/R4 took seven robot plates off a wall under Mike's canon,
   and P2 took a plate off a face under his ruling. A file that was shown and then
   struck lands on the same shelf as a file built and never shown, and only the
   second is *building ahead*. The tripwire was designed for over-production and
   is being tripped by the opposite. **The number is right; the reading is not,
   and no round should pretend otherwise by adjusting it.**
3. **C39 was a one-file row describing a habit.** Written at v55 against
   `asset-table.mjs`; by v56 a new tool had the same two bytes in it. A row that
   names an instance of a pattern will be closed on the instance. **A scan is now
   in the round log's own record — four files, six bytes — and it is cheap to
   re-run.**
4. **A prune was refused, and the refusal was the right call.** Striking the
   caption left one stale register row, and that row was **the anchor of 18
   RESTATED chains**. v52 and v56 both discovered that ordering *after* the prune;
   this round checked first, repointed all 18 onto the two surviving anchors (a
   VERIFIED row and a MIKE row on the same face), then pruned, then re-gated.
   **The hazard is now a procedure: check anchors, repoint, prune, re-gate — in
   that order, every time.**

---

## Files this round touched

| file | what |
|---|---|
| `tools/menu-parity.mjs` | P1: the ruling, `kind`, `holding`, the ledger read, four refusals · C39 |
| `tools/asset-table.mjs` · `tools/provenance-sweep.mjs` · `tools/migrate-vocabulary-pass1.mjs` | C39 |
| `src/data/artists/robots.js` | P2: the Manual's plate struck |
| `src/routes/WbHome.jsx` · `WbHome.css` | P3: drag + arrows + the rest-restart |
| `src/routes/WbAdmin.jsx` · `WbAdmin.css` | C35 |
| `reveal/ledger-declare.mjs` · `reveal/transfers.mjs` · `reveal/ledger.json` | P4 + P2's row |
| `provenance/register.json` · `provenance/asset-table.json` | the repoint, the prune, the re-scan |
| `docs/OPEN_ACTIONS.md` · `docs/SURFACING_LOG.md` · `docs/canonical/OPERATIONS.md` · `CLAUDE.md` | the record |
