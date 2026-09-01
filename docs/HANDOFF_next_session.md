<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# HANDOFF — 2026-09-01, the close of the draw session

Session-scoped. Process and standing facts are not here — they are in
`docs/canonical/OPERATIONS.md` and `STATE.md`. **Truth ranking puts this file
below git log; if it disagrees with the tree, the tree is right.**

---

## WHAT THE NEXT SESSION IS FOR — read this before anything else

> # MIKE IS LEADING AN INVESTIGATION INTO THE WORKFLOW THAT OCCURS AFTER A REEL HAS BEEN PRODUCED.

**HE WILL HAVE CONTENT. NOTHING EXISTS TO MOVE IT.** That is the whole shape of
it: a finished reel, and no route from the file to a surface. The investigation
is his, he is leading it, and the next session's job is to help him look.

> ### **OPS IS NOT TO PROPOSE A BUILD.**
>
> Not a tool, not a script, not a pipeline, not a schema, not a directory.
> **He is investigating a workflow, not commissioning software**, and an Ops
> that answers an investigation with a design has changed the subject and taken
> the question off him. If a build is the answer it will be the answer after he
> has looked, and it will be his.

**What Ops may do:** read what is there, measure it, say plainly what exists
and what does not, and answer what he asks. `release/README.md` and the two
specs in `release/specs/` are the standing description of what this system
holds today — **including that it holds no route to a surface** and that every
posting in it is YouTube-only and staged.

---

## THE STATE

**Museum `01b64ef`, level with origin, on `main`.** Working tree carries two
modified paths and **both are Mike's, both are to be left alone** —
`docs/dictation-20260807/readiness.json` and `.../record-draft.json`. **He is
writing in the day editor on 8899.** Do not bind 8899. Do not touch
`docs/dictation-20260807/`.

**Robots `1890382`**, level with origin, clean but for seven untracked scratch
render directories.

### The deploy, and everything after it

**THE MUSEUM IS LIVE AT `8f5888d`, stage `launch`, deployed
2026-09-01T15:50:41.318Z** — `docs/DEPLOYED.md`, recorded dirty against the two
day-editor paths above. **Two commits landed after it and neither changes what
is served:** `67339d7` and `01b64ef` are Record entries about the deploy and
about the TikTok bio. **Nothing is waiting on a deploy.**

### What landed today, in order

`cc77a51` the front-page viewer and its four plates · `d6fc88b` the index-drift
finding brought current at 74 sheets · `7e60e46` the site description replaced
and the worker's rewrite dropped · **`8f5888d` the lobby note follows the live
day, superseding §14.3 option 3 — this is the deploy** · `67339d7` and
`01b64ef` the two Records.

**Then this packet:** `docs/FINDING-the-draw-20260901.md` — **the session's
substance, and it exists nowhere else**; the TikTok operating definition at
`release/specs/SPEC-tiktok-operating-definition-20260901.md`; four register
rows and one amendment; and `docs/PREPARED-ops-standing-rule-20260901.md`.

---

## THREE THINGS THAT ARE TRUE ON A CLOCK

**1 · THE WING OPENS ON 2026-09-07 AT 17:00 AND NEEDS NO DEPLOY.** `RECORD_EPOCH`
is `2026-09-07` (`src/data/artists/record-epoch.js:116`) and `RECORD_HOUR` is
`17` (`reveal/record-clock.mjs:89`). **The clock is read at request time, not at
build time**, and since `8f5888d` the lobby note turns with the live day in a
tab that is already open. `npm run reveal:day` reports **nothing to move** —
the tree and the Record agree, 10 pictures public and 137 behind the door.
**Nobody has to do anything on the seventh for the doors to open.**

**2 · TWO ROWS FIRE INSIDE TEN DAYS AND BOTH ARE MIKE'S.**
[M111](OPEN_ACTIONS.md#m111) — *"the first 100"* goes live on the **7th** and
nothing in the tree counts to 100; every signature is stamped `Founding
Visitor`. [M109](OPEN_ACTIONS.md#m109) — Record 003 publishes on the **9th**
carrying a DETAILED REPORT that still names three manual pages the entry no
longer shows.

**3 · MIKE'S RECORD 001 EDITS ARE UNLANDED, AND THERE WILL BE MANY MORE BEFORE
THE SEVENTH.** They live in the day editor's own files and have not been
landed. **Do not run `record:land`, do not run `day:proof`, and do not tidy
those two paths.** Expect the working tree to be dirty there on every session
between now and the opening; that is him working, not a defect.

---

## THE MANUAL — FINISHED AS FAR AS IT GOES

**Three sheets are approved. The rest is honestly unwritten, and it should stay
described that way.**

The front-page round put four plates on the desk at `cc77a51` —
`docs/plates-20260901-front/`, viewer `docs/mock-front-page-20260901.html`:
the **cover**, **leaf ii**, **leaf iv**'s scope statement, and **5-3**. **The
round named three of them; leaf ii was added by Ops** because the issue date
landed on it and a viewer that omits the sheet being ruled on cannot answer the
question.

**The census, measured 2026-08-31 and unchanged in shape:** 150 positions, 55
written, 95 left — `docs/FINDING-manual-survey-20260831.md`. **That file's §0
says what it does not contain and why**, and its §6 exists specifically to stop
a reader starting Section I.

**No number in this section was re-measured today.** It carries the 08-31 date
because that is when it was taken.

---

## THE ONE THING OPS RULED TODAY THAT TOUCHES A DOCUMENT

**The standing rule about determined decisions did not land in the manual, and
it is not lost.** `docs/canonical/OPERATIONS.md` is **39,357 bytes against a
40,000 ceiling** — 643 of headroom, and the rule is 714. **It breaches, so it
was not landed.** The complete text, the arithmetic, and the section it belongs
in are in `docs/PREPARED-ops-standing-rule-20260901.md`. **Landing it means
first cutting the oldest complete section to `OPERATIONS_ARCHIVE/`**, which is
the remedy `tools/ops-size-gate.mjs` prints and is a section-sized decision
nobody has taken.

**The rule itself is in force whether or not it is filed.** It reads: *Ops does
not bring Mike a decision whose answer is determined* — and its pair, *when Ops
has ruled something that touches what Mike sees, it goes at the top of the
message, on its own line, flagged as Ops' decision.*
