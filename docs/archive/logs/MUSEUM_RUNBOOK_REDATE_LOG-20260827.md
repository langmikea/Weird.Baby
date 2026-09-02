<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# THE RUNBOOK RE-DATED — SUNDAY 30 AUGUST BECOMES THURSDAY 27 AUGUST

**2026-08-27.** Tree clean at **`7b687cf`**. Nothing committed by Ops.
`docs/SUNDAY-20260830.md` → `docs/THURSDAY-20260827.md`.

---

## 0. WHY IT MOVED

`7b687cf` landed `?as-of=` driving forward. **Mike's condition on the deploy is
met**, and ten days of work is waiting to go out. The old document was written
on 2026-08-24 for a night that is not happening.

Two of his rulings decide the shape of the new one, and they pull in opposite
directions:

> *"Relaunch is back-burner. When we launch is of little consequence; but
> launching with a fully equipped workflow supporting us is non-negotiable."*

> *"I want the website updated so I can always see what it is I am actually
> getting. I understand that if anyone sees it they see everything. I do not
> care."*

**So this deploy is not the launch. It is Mike seeing his own work.**

---

## 1. THE LOUD LINE WAS WRONG AND THE REPLACEMENT IS NOT THE OBVIOUS ONE

The old head read **"THE MUSEUM WILL BE SHUT WHEN YOU FINISH TONIGHT. THAT IS
THE DESIGN."** Measured against the tree, that half is **still true** — on
2026-08-27 the wing is shut, the Record is empty, the countdown runs and the
seven pictures 404.

**But it is no longer the important sentence, and carrying it forward would have
hidden the thing that is.**

`RECORD_EPOCH` is still `2026-08-31`. The museum reads the clock at REQUEST
time, so **nothing about a deploy asks it and nothing about back-burnering the
launch reaches it.** Measured on `visibleEntries` against the real entry dates:

    on 2026-08-27: 0 entries -> wing shut
    on 2026-08-30: 0 entries -> wing shut
    on 2026-08-31: 1 entry   -> WING OPEN
    on 2026-09-02: 3 entries -> six pictures publish
    on 2026-09-03: 4 entries -> the seventh publishes
    on 2026-09-04: 5 entries

**THIS DEPLOY ARMS AN UNATTENDED LAUNCH ON MONDAY 31 AUGUST AT 17:00, FOUR DAYS
LATER, WITH NOBODY TYPING ANYTHING.** That sits directly against *"relaunch is
back-burner"*, and it is not something Ops may resolve by inference — moving
`RECORD_EPOCH` moves the entries, the wing, the countdown and the pictures
together, and it is one line in `src/data/artists/record-epoch.js`.

So the new loud line is **"THIS DEPLOY IS NOT THE LAUNCH — AND IT ARMS ONE,"**
with the armed schedule as a table and one sentence putting the decision where
it belongs: *if you do not want Monday, the time to say so is before step 14.*

---

## 2. EVERY PUBLISHED VALUE RE-MEASURED

The old document's own rule says a commit that moves one of these moves the
runbook with it. **Eighty-two commits landed and one value moved.**

| step | published | measured 2026-08-27 | verdict |
|---|---|---|---|
| 3 | `17 problems (9 errors, 8 warnings)` | **`16 problems (9 errors, 7 warnings)`** | **STALE — corrected** |
| 8 | `PARITY: 4 shared · 0 divergences` | identical | holds |
| 9 | `arc: PASS — the published headlines match the tree.` | identical | holds |
| 10 | `PASS — the ground state can be read whole.` | identical | holds |
| 12 | `Nothing to move. The tree and the Record agree.` | identical | holds |
| 20/21 | seven pictures, six on 09-02, one on 09-03 | **7 — six 2026-09-02, one 2026-09-03** | holds |
| 20/21 | `scan-07-a.webp` · `qc-101-a.webp` | both in the schedule, at those dates | holds |
| 21/22 | card begins `A museum of weird things worth keeping. No ads,` | identical | holds |
| 13/14 | 137 files · 186,888,028 bytes | **137 · 186,888,028** | holds |
| 22/24 | *"about eighteen hours"* | **92.2 hours — about four days** | **STALE — corrected** |
| 18/19 | probe `/held/robots/manual/page-07.png` | on disk, **2,129,500 bytes** | holds, and the size is now published |

### THE ONE THAT MOVED, AND IT IS THE HAZARD FIRING

**`64830e1` moved the lint baseline from 9/8 to 9/7 on 2026-08-26** — a real
removal, checked at the time as real rather than suppressed — **and the runbook
was not moved with it.** For two days step 3 published a number the tree does
not answer.

**That is not a stale number, it is an aborted deploy.** The failure mode the
old document names in its own box: *a tired man at 11pm reading NOT RIGHT →
STOP against a change that was fine.* The hazard was recorded in OPERATIONS §8
on 2026-08-25 as prose discipline; it took **one day** to break. §8's row is
rewritten to say so, because a hazard that has fired reads differently from one
that might.

The countdown's *"eighteen hours"* was correct for a Sunday-night deploy against
a Monday epoch. It is **92.2 hours** from Thursday, and the runbook now says
*about four days* with the `03 DAYS 20 HOURS` shape a late-Thursday deploy sees.

---

## 3. WHAT THE NEW DOCUMENT ADDS

**Step 13 — WRITE DOWN WHAT IS LIVE, BEFORE YOU REPLACE IT.** New, and it exists
because `docs/DEPLOYED.md` **has never existed in git history** — measured, not
gitignored, so no `deploy:launch` has completed since `e08e2b4` landed the tool
on 2026-08-24. Nothing in the repository can say what is running. The wire can,
to a key-holder. The sha goes on paper because ROLLBACK R3 needs it.

**Step 15 — the deploy record, made unmissable.** It was step 14, headed *"commit
the deploy record IMMEDIATELY"*, and it has never once been done. It is now
headed **⚠ COMMIT THE DEPLOY RECORD NOW. NOT AFTER. NOW.** and says plainly that
it is the most skippable step in the document and the one with a perfect record
of being skipped.

**Step 23 — SEE YOUR OWN WORK.** New, and it is the reason the deploy is
happening. The browser flow first, because it is the one he will use: `/admin` →
The Record door → `?as-of=2026-09-04`. Then the wire proof, then **the half that
is his condition** — the same URL with no cookie must read
`__WB_TODAY__="2026-08-27"`, and it is the third rollback trigger if it does not.

Two things in it are counter-intuitive and both are called out at the site:
`"showingAll":false` is the CORRECT answer while driving (the date outranks the
preview door — `7b687cf`), and **he does not need to close the Record door
first**, which was true before that commit and is not now.

**TWO KEYS, NOT ONE.** The old document said *"the HR key"* throughout and step
23 needs `RECORD_KEY`, a different secret. Named in BEFORE YOU START.

**WHAT IS ACTUALLY IN THIS DEPLOY** — a new section. Eighty-two commits,
`4e29e4f` (17 Aug) → `7b687cf` (27 Aug), grouped by area, so a step that goes
wrong has somewhere to be traced to.

---

## 4. WHAT DID NOT CHANGE

- **The twelve pre-deploy gates, in order, with their remedies.** All still
  correct; only step 3's expected number moved.
- **The deploy itself** — one command, four things to watch, the guard's refusal
  as a STOP with no override.
- **The rollback triggers for held material** — stage reads `development`, or
  the held door returns 200. Both unchanged. **A third was added** (step 23's
  stranger check), not substituted.
- **The step-19 essay** on what a 404 at the held door does and does not prove.
  Still exactly right, and the probe is now confirmed pointed at a real 2.1 MB
  file rather than assumed to be.
- **CONTINGENCY — PURGE** as the only cache action, and only for the pictures.
- **The closing counsel** — *the site as it stands this morning is a working
  museum.* Its second half changed: the old one said Monday 17:00 is the
  deadline that matters. **There is no deadline now**, which is the one thing
  that genuinely changed, and the closing paragraph says that instead.

### Renumbering

Two steps were inserted, so 23 became 25. Old 13–23 shifted to 14–25. **Every
cross-reference was rewritten with them** — the HR-key note in BEFORE YOU START,
the ROLLBACK triggers, the PURGE contingency, step 19's pointer at step 20, and
the values table.

---

## 5. REFERENCES FOLLOWED

Deleting the old file would have left two dead pointers. Both were found by
`git grep` and both moved:

- **`docs/canonical/OPERATIONS.md` §8** — the hazard row naming the file.
  Rewritten to name the new path AND to record that the hazard has now fired,
  with the lint case as its evidence.
- **`tools/dictation/day.mjs:486`** — a `NOT FIXED HERE` flag citing *step 12 of
  `SUNDAY-20260830.md`*. Repointed; **step 12 is still step 12**, which is why
  the note survives unchanged otherwise.

---

## 6. GATES

    npm run lint              16 problems (9 errors, 7 warnings) — BASELINE
    npm run build             green
    npm run provenance:gate   PASS
    npm run reveal:check      exit 0
    npm run instory:gate      PASS
    npm run ops:size          PASS
    npm run arc:check         PASS
    npm run parity:gate       4 shared · 0 divergences
    npm run reveal:day        Nothing to move
    npm run docs:numbers:gate PASS

---

## 7. WHAT IS STILL OPEN

1. **MONDAY.** `RECORD_EPOCH = 2026-08-31` and this deploy arms it. **Mike's
   call, and it must be made before the deploy rather than after.**
2. **A DATED RUNBOOK IS STILL OUTSIDE `docs:numbers:gate`.** The question was
   raised 2026-08-25 and left open; it has now cost one stale value. Still open,
   still undecided — but the argument for it is no longer hypothetical.
3. **`RECORD_KEY` AND `HR_KEY` IN PRODUCTION ARE UNVERIFIED FROM HERE.** Both
   are wrangler secrets with no default and nothing in the tree can read them.
   Steps 17 and 23 report `configured`; that is the first honest reading either
   way, and it comes after the deploy rather than before it.
