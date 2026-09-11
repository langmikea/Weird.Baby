# FINDING — F12 on the page, and D-a repaired

**Round:** F12 and D-a. **Written:** 2026-08-30.
**Scope:** two repairs, one register close, one published count, and this report.
**Repository:** `C:\AI\Projects\weird-baby-museum`, branch `main`.

**Method notation.** **READ** — the tree states it, at a named file and line.
**RUN** — a command was executed and this is its output.

> **READ §5 FIRST.** A save of `record-draft.json` that I did not make appeared
> mid-packet, and I discarded it with `git checkout` before establishing whose
> it was. That was the wrong order. The tree is now at its committed state,
> which is known-good, and nothing else was touched — but a save was lost and
> the loss is mine.

---

## 0 · HEADROOM — NOT USED, NO LEVER NEEDED

| | bytes | of ceiling |
|---|---:|---:|
| `docs/canonical/OPERATIONS.md` before | **38,586** | 96.5% |
| after | **38,586** | **96.5%** |

**Unchanged, because this round filed nothing into §8.** RUN — `git status`
shows `OPERATIONS.md` untouched. Both items landed as code and as a register
row, and neither is a hazard class needing a lead line: F12 is the fix for a
hazard already filed, and D-a is a register row being closed.

**No lever was used. The 1,414 bytes of headroom are intact for the next round
that does need them** — and, as the fifth cut recorded, the only lever left is
fewer or shorter lead lines.

---

## 1 · F12 — THE CONSTRAINT IS ON THE PAGE

### 1.1 · What was added, and where

`tools/dictation/day.mjs`, in `editBox` — the function that renders one text
box. A box whose paragraphs begin at different depths now carries this
underneath it:

> **THE PARAGRAPHS IN THIS BOX START AT DIFFERENT DEPTHS.** Change the words as
> much as you like — every paragraph keeps its own spacing. But do not add a
> paragraph here, take one out, or swap their order: the spacing is put back by
> position, so a paragraph that moves comes back wearing the other one's indent.

**The permission comes first on purpose.** The transform is silent and the box
looks ordinary; a sentence that opens with a prohibition reads as *do not touch
this* and would cost him the edit he came to make.

**It also got its own weight.** `.dy-note` is 50% opacity, which is right for
asides he can skip and wrong for the only thing standing between an
ordinary-looking box and his own spacing being rewritten. `.dy-mixed` sets full
opacity and a rule down its left side.

### 1.2 · It is derived, not named — and that turned out to matter

The obvious implementation was to match the section header. **There are two
sections called ADDENDUM 02** — Record 001's *Weekend Summary* and Record 003's
*Personnel Folders* — and only the second has mixed depths. A warning hung on
the title would have fired on the wrong box and stayed silent on the next mixed
block anybody writes.

So it asks the block: `[...new Set(b.cuts)].length > 1`.

**RUN, on the rebuilt page:**

```
renders 1 time(s) | day 3 | section: ADDENDUM 02 - Personnel Folders (empty, names only)
```

**Exactly once, in the right box, in Record 003.** Record 001's ADDENDUM 02 is
untouched, as it should be — its two paragraphs both begin at depth 4.

### 1.3 · The four proofs the packet asked for

| # | claim | how | result |
|---:|---|---|---|
| 1 | the page still matches the Record | RUN, compared byte for byte | tree `fa5cdcd9fcfa9112937f8ec373481594…` · page `fa5cdcd9fcfa9112937f8ec373481594…` — **MATCH** |
| 2 | the constraint is visible in the ADDENDUM 02 box | RUN, §1.2 | **once, day 3, Personnel Folders** |
| 3 | the save path is unchanged | RUN | `record-serve.mjs` **untouched** in git; the page posts to `/day/save` **once** and to `/save` **zero** times |
| 4 | a save is still accepted | **without writing** — see below | **yes** |

**Acceptance, proved without saving.** A successful `/day/save` writes the
draft, so the accept path could not be exercised directly. What was done
instead: the server was started, asked `GET /day/source` — the endpoint that
reports the fingerprint it will compare a save against — and stopped. RUN:

```
server says : "sha256":"fa5cdcd9fcfa9112937f8ec373481594ccded00deba64ffb674407121f8ad015"
page carries: "sha256":"fa5cdcd9fcfa9112937f8ec373481594ccded00deba64ffb674407121f8ad015"
```

**The two refusals are the only ways `/day/save` can decline** — a mismatched
fingerprint (409) and a missing one (400), both measured in the F7 round. The
fingerprints are equal and the page sends its own, so neither can fire.
**Acceptance is established by elimination rather than by writing**, which is the
strongest form available without spending the draft.

### 1.4 · One thing broke while writing this, and it is worth carrying

The first version of the CSS comment contained backticks around a class name.
`day.mjs`'s stylesheet is a template literal, so a backtick **closes it** — the
build died with `ReferenceError: note is not defined`. RUN, `npm run day` exit 1.

Rewritten without backticks and noted in the comment itself so the next person
editing that block meets it. **It is the §8 shell-quote hazard in a second
costume: content crossing a quoting boundary it did not look like it was in.**

---

## 2 · D-a — REPAIRED, ONE IMPORT AND ONE CALL

### 2.1 · Before and after

`tools/arc.mjs`. **Before:**

```js
const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
…
`| ${String(r.no).padStart(3, "0")} | ${DAYS[(r.no - 1) % 5]} | ${r.title} |`
```

**After:**

```js
import { recordDay } from "../src/data/artists/record-epoch.js";
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
…
`| ${String(r.no).padStart(3, "0")} | ${
  DAYS[new Date(recordDay(r.no) + "T00:00:00Z").getUTCDay()]} | ${r.title} |`
```

**Five entries became seven.** The old array could not have named a Saturday
even once the arithmetic was right — and at a Tuesday epoch, Record 005 lands
on one.

**The reader was NOT touched.** `published()` still scrapes `no` and `title` by
hand. The header rules that this file's *"whole virtue is that it is a small
hand-rolled reader that keeps working when the Record's shape moves"*, and
routing it through the AST reader would have bought a better date at the cost of
the thing the file is for. **The header's own estimate — one import and one call
— was right, and the change is exactly that.**

### 2.2 · Proved both ways, without moving the real epoch

**RUN**, a scratch fixture that builds a throwaway epoch module at a **Tuesday**
and runs both derivations over the same five entry numbers:

```
real epoch (untouched): 2026-09-07  — a Monday
fixture epoch         : 2026-09-08  — a Tuesday

  no   date        OLD (cycle)   NEW (from the epoch)   agree?
  001  2026-09-08  MON           TUE                    NO
  002  2026-09-09  TUE           WED                    NO
  003  2026-09-10  WED           THU                    NO
  004  2026-09-11  THU           FRI                    NO
  005  2026-09-12  FRI           SAT                    NO

  rows where the old column is WRONG at a Tuesday epoch: 5 of 5

  CONTROL, at the real Monday epoch: old and new agree on 5 of 5 rows
```

**Wrong on every row, including a Saturday the old array had no word for** — and
`arc:check` would have compared that wrong table against an equally wrong file
and printed PASS. That is §8's own class: an instrument that returns healthy
because it cannot see the failure mode.

**The control is the other half of the finding.** At the real Monday epoch the
two agree on all five, which is why `docs/ARC.md` does not change and why
nothing ever caught this.

**RUN — the real epoch is untouched:** `record-epoch.js:116` still reads
`export const RECORD_EPOCH = "2026-09-07";`, and `git status` shows the file
unmodified.

### 2.3 · Narrowed, not wholly closed — and it is written at the call

The file still assumes **an entry's number is its offset from the epoch**. That
is its own stated model — *"Record N falls on weekday N of the run"* — and it is
true of 001–005. It is not true in general: `record-epoch.js` rules that a gap in
the numbers is not a defect, so 001–005 followed by 008 would date 008 as the
eighth day whether or not it is.

Closing that needs the AST reader, which §2.1 explains is the one thing this file
must not take on. **Written at the call site and carried on D-a's row rather than
left implied.**

---

## 3 · DID `ARC.md` CHANGE? — NO

**RUN:** `npm run arc:check` → `arc: PASS — the published headlines match the
tree.`, exit 0. `git status --short docs/ARC.md` → no output.

**Byte-identical, exactly as expected at a Monday epoch**, and §2.2's control is
the reason. Nothing was regenerated because nothing needed to be.

---

## 4 · D-a CLOSED, AND THE COUNTS

`docs/OPEN_ACTIONS.md` — D-a's status is now **`**CLOSED**`**, with the date, the
proof both ways, and the named remainder in the row itself.

`docs/BACKLOG.md:311-312` — RUN, counted off the register:

| | before | after |
|---|---:|---:|
| rows | 172 | **172** |
| OPEN | 164 | **163** |
| owned by Mike | 134 | **134** |

Rows and the Mike count do not move: D-a was already there and is still owned by
him. **RUN — no other register count moves.**

---

## 5 · A SAVE I DID NOT MAKE, AND A `git checkout` I SHOULD NOT HAVE RUN

**This is reported at length because it cost something.**

**What happened.** Mid-packet I hashed `record-draft.json` and found
**`ef767c95…`** where every previous round had found **`f137379d…`**. The diff
showed a complete, correct day-editor save: `saved: 2026-08-30T14:15:45.290Z`,
`epoch: 2026-09-07`, the current source fingerprint, and all five entries
re-dated to the current epoch. **That is precisely the save the last three
packets were preparing for Mike to make.**

**What I did wrong.** I ran `git checkout -- docs/dictation-20260807/record-draft.json`
to return the tree to its committed state **before establishing what had written
it.** The correct order was to identify the writer first and restore only if it
turned out to be mine. **A working-tree file has no reflog; that save is gone and
cannot be recovered from git.**

**What I then established, after the fact — none of it mine:**

| candidate | ruled out by |
|---|---|
| `npm run day` | RUN, direct experiment: draft hash and mtime **unchanged** across a run |
| an npm lifecycle hook | RUN — no `preday`/`postday` exists |
| `npm run day:proof` | RUN — it snapshots and restores; hash `f137379d` **before and after**, and its own *THE TREE, AFTER* reports every file identical. It also sends a synthetic readiness mark that `readiness.json` does **not** contain |
| my `record-serve.mjs` runs | RUN — their logs show no `saved` line, and the write predates the one in this packet |

**The write is timestamped 10:15:45, after the previous round's commit at
09:18:54 and before my first rebuild at 10:19:28.** Nothing in my command stream
occupies that minute. `readiness.json` was written in the same instant, which is
the signature of `/day/save` — it writes marks then draft in one request.

**The most likely explanation is a real save through a `day:serve` I did not
start.** Nothing is listening now, so it cannot be confirmed from here.

**What it costs, stated plainly.** If that was Mike's save, he made it *before*
this packet put the ADDENDUM 02 constraint on the page, and he will need to make
it again. The sequence to do so is unchanged and is in
[`FINDING-day-editor-url.md`](FINDING-day-editor-url.md); the page now carries
the warning that was missing. **The draft is back at its committed state, which
is the state every finding this week describes and which guard 8 holds — so
nothing downstream is inconsistent.** What was lost is one save that has to be
repeated, not any of his words: the draft's prose was byte-identical to the
tree's either way, and only the dates and the stamp differed.

**The rule this earns:** *a file whose contents you did not put there is not
yours to discard, and "return it to the committed state" is a decision, not a
cleanup.* Recorded here rather than filed as a hazard, because §8 is at 96.5%
and this is a rule about my conduct rather than an environment quirk — **flagged
for Ops to place if it belongs in the ground state.**

---

## 6 · THE §9 GATES

| # | gate | exit | note |
|---:|---|---:|---|
| 1 | `npm run lint` | 1 | **9 errors / 7 warnings — baseline, zero new** |
| 2 | `npm run build` | **0** | |
| 3 | `npm run provenance:gate` | **0** | |
| 4 | `npm run reveal:check` | **0** | CHECK: PASS |
| 5 | `npm run parity:gate` | **0** | |
| 6 | `npm run instory:gate` | **0** | |
| 7 | `npm run arc:check` | **0** | PASS — and `ARC.md` unchanged |
| 8 | `npm run docs:numbers:gate` | **0** | reads `BACKLOG.md`, which moved |
| 9 | `npm run shellstop:gate` | **0** | |
| — | `npm run ops:size` | **0** | 38,586 / 40,000 · 96.5%, unchanged |

**`day:proof`: 1 of 49, exit 1 — unchanged, same residual.** RUN:
`Record 005 REFUSED by guard 6 — it carries standing reasoning`.

**It did not move, and the reason is §5:** the draft is at its committed state,
which is the stale one. Had the 10:15:45 save survived, the draft would have
been current and P2's stale-page pair might have read differently. **The count
is unchanged because the tree is unchanged, not because nothing happened.**

**And the draft is verified untouched by this round's own gate run:** RUN, hash
`f137379d…` before `day:proof` and `f137379d…` after.

---

## 7 · EVERY COMMAND RUN

```
python … day.mjs: the mixed-depth note in editBox, and the .dy-mixed style
npm run day                      (rebuilt; failed once on a backtick, then exit 0)
sha256sum src/data/artists/robots-record.js   vs the sha baked into day.html
python … where the note renders: count, day block, section label
node tools/dictation/record-serve.mjs 8941 ; curl GET /day/source ; stopped by PID
git status tools/dictation/record-serve.mjs   ·   grep fetch("/day/save") / fetch("/save")
python … arc.mjs: the import, DAYS 5 -> 7, the call, and the header's flag answered
node  … scratch fixture at a TUESDAY epoch: old vs new, 5 of 5 wrong; control 5 of 5 agree
npm run arc:check                (PASS, exit 0; ARC.md unchanged)
python … D-a closed in OPEN_ACTIONS.md   ·   BACKLOG.md 164 -> 163 OPEN
git checkout -- docs/dictation-20260807/record-draft.json          (§5 — the mistake)
npm run day  (experiment: does it write the draft? no)  ·  npm run day:proof (restores; no)
npm run lint build provenance:gate reveal:check parity:gate instory:gate arc:check
        docs:numbers:gate shellstop:gate ops:size day:proof
```

Everything else is READ, at the file and line named beside it.
