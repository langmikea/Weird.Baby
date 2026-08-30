<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# HANDOFF — for the next Ops session

**Written 2026-08-30, at the close.** Session-scoped only: what happened, what it
cost, and what is waiting. Process lives in `docs/canonical/OPERATIONS.md`;
standing rules are not repeated here.

---

## 1 · MIKE SAVED. THE DRAFT IS HIS AND IT IS COMMITTED

**`bb8422a` — `record-draft.json`, 8,464 bytes, `eda603e7…`, saved 10:36:15.**
Committed byte for byte: not regenerated, not rebuilt, not normalised.

**Do not run `git checkout`, `restore`, `stash` or `clean` on that file or on
`readiness.json`, ever.** If they look modified, that is Mike writing. The rule
is in `OPERATIONS.md` §5 and it was paid for — see §6 below.

**What his save fixed:** all five entries are now identical to the tree, the four
dates that were a week behind are current, and Record 005's `docs` block —
`TERMINAL.EXE` and the Portal's door — is back in the draft it had been missing
from. `record:land` dry run now exits **0** with no refusal, emitting
`recordDay(1)`…`(5)` where the stale draft produced `recordDay(-6)`…`(-2)`.
`--verify` reports **52 strings round-trip**, up from 51: the extra one is 005's
attachment text, which the stale draft could never cover.

---

## 2 · THE LANDER IS CLEAN EXCEPT FOR TWO GUARDS

**`record:land -- --write` still refuses, and for two reasons, not one.**

**Guard 6 — the comment.** `robots-record.js:643-668` holds a 1,727-character
block inside the entries array: Record 005's TERMINAL.EXE reasoning. A draft
carries no comments, so a write would take it silently, and guard 6 counts
comment characters and refuses on any loss. **Record 005 is the only entry with
one.** Fully scoped in `docs/FINDING-guard-6.md`, quoted whole so Mike can rule
on where it lives. **Ops has NOT ruled the move.**

**Guard 8 — the window, and this is the one that will surprise you.**
`npm run day:proof` writes the Record's snapshot back **byte-identically** and
bumps its mtime. It is a §9 gate. So the last step of every session close makes a
fresh draft look stale to guard 8, which compares timestamps rather than words.
Measured: content unmodified in git either side, mtime `10:39:43 → 10:50:21`.

> **A draft lands only in the window between Mike's save and the next
> `day:proof`.** Filed as a §8 lead line today.

**The sequence, if he rules the move, is printed by guard 6's own refusal** —
`emit-record-entries.mjs`, where whoever is landing will actually be standing:
lift the block, **Mike saves again**, then `--write` with no `day:proof` between.
`ANSWER_KEY.md:181` cites inside the block and travels with it; fourteen other
citations shift by 26 lines across seven documents, all prose, no code.

---

## 3 · WHAT LANDED TODAY, AND WHAT EACH COST

| | cost |
|---|---|
| **`342dd59`** the emitter carries an attachment's `door` | Ops call, not Mike's. It also fixed an ordering trap: a save taken before it would have regenerated the draft whole and been refused, spending his one shot. |
| **`9e28201`** four `ROBOTS_OPEN` sites read the museum's live day | A tab open across 17:00 had no door to the wing. Proved on the launch bundle at a served origin, both visitors. |
| **`dc3bf5c`** `/save` closed | It wrote the draft with no sha and no stamp. **My F7 said "a door nobody uses" and it had a live caller** — `record-edit.client.js:928`. Refused rather than deleted, so that caller gets a reason. |
| **`3602915` · `8c25757`** eight CH/N-c/V-B ids became real rows | 22 citations pointed at rows that never existed. One was already done the day before it was listed. |
| **`c442b32`** F12 on the page · D-a repaired | The ADDENDUM 02 warning renders in the box, derived from mixed indentation rather than the section name — there are two ADDENDUM 02s and only one is mixed. `arc.mjs` now follows the epoch; at a Tuesday epoch the old code was wrong on 5 of 5 rows while `arc:check` printed PASS. |
| **`bb8422a`** Mike's save | §1. |
| **`79ca5c5`** guard 6 scoped | §2. |

---

## 4 · SEVEN THINGS WAIT ON MIKE

Not a list of everything open — 141 rows name him. These are the ones this
session put in front of him and that nothing else can move.

1. **[M61](OPEN_ACTIONS.md#m61) — the six manual scans, and the clock is on it.**
   They publish **2026-09-09 at 17:00 America/New_York**. M61 is RULED — HELD:
   the manual stays offline until real pages exist. Whether these six are those
   pages is his call and has never been made. `docs/PREPARED-manual-hold.md`
   holds the exact, unapplied change if he says hold; it is three files, not two,
   and the third is a published number.
2. **Guard 6's comment** — move it above the array, or leave it and accept that
   `--write` cannot land. §2.
3. **[CH5-a](OPEN_ACTIONS.md#ch5-a) / [CH5-b](OPEN_ACTIONS.md#ch5-b)** — future
   entries and hidden rooms ship in the public chunk. The citations disagree
   about whether this is an accepted limit or an outstanding job; the rows record
   the disagreement rather than resolving it.
4. **[CH6-b](OPEN_ACTIONS.md#ch6-b)** — three console values from his own screen.
   No gate can supply them.
5. **[V-B](OPEN_ACTIONS.md#v-b)** — 28 authored song paragraphs rendered by
   nothing. Re-home or strike. Waiting 24 days.
6. **[L-e](OPEN_ACTIONS.md#l-e)'s fourth consumer** — the lobby note still reads
   from the served day. Making it live reverses option 3, which is his ruling.
7. **[M40's class](OPEN_ACTIONS.md)** — nothing. Listed so the count is honest:
   M40 itself is closed and was my own false positive.

---

## 5 · `OPERATIONS.md` IS AT ITS CEILING AND THERE IS NO CUT LEFT

**39,281 of 40,000 — 98.2%. 719 bytes.**

The fifth cut was taken today and **took everything a cut can take**: there was
one bodied entry left, it recovered 263 bytes, and naming the archive cost 165
back. Net **98**. `08-KNOWN-HAZARDS-V.md` is at HEAD `3602915`.

**Do not create a sixth archive — there are no bodies to move.** §8's mass is now
lead lines: 42 of them, 7,253 bytes, averaging 172 against the 102 the pointer
block quotes as the rate. The only lever left is **shortening or dropping
existing lines**, and that is a decision about the record rather than a tidy-up.
Eleven heading-only stubs (1,038 bytes) whose bodies are already archived are the
obvious candidate and need a ruling first.

---

## 6 · TWO OPS ERRORS THIS SESSION, BOTH MINE

**They are here because a handoff that only carries wins is not a handoff.**

**(a) The packet that failed to protect Mike's save.** At 10:15:45 a complete,
correct save appeared — his epoch, his dates, the current fingerprint. I ran
`git checkout` on it **before establishing what had written it**, on the
assumption it was a stray from my own tooling. Every candidate of mine was then
ruled out by experiment; none had written it. A working-tree file has no reflog,
so it was gone, and he saved again at 10:36:15. **The cost was one repeated save,
not his words** — the prose was identical either way. The rule is now
`OPERATIONS.md` §5: *establish who wrote it before restoring it, not after.*
Written up in `docs/FINDING-f12-and-da.md` §5.

**(b) The CRLF claim, and it was wrong twice.** I reported in the ROBOTS_OPEN
round that `robots.js` was "the only CRLF file in `src/`" and normalised an
appended block to match it. The next packet inherited the claim and moved the
name to `robots-record.js`. **Both are wrong.** `.gitattributes` sets
`* text=auto eol=lf`, so **every text file is LF in the committed blob** —
working-tree CRLF is a local artifact git normalises away and never shows in a
diff. **The normalisation I reported as deliberate changed not one committed
byte.** Corrected at `docs/FINDING-guard-6.md` §4.1a with its origin named.

---

## 7 · STATE, IN ONE READING

- **Deployed:** `3ccbad9`, stage **launch**, 2026-08-29. Nothing has deployed
  since; every commit today is docs, tools or client code not yet shipped.
- **`day:proof`:** 1 of 49, exit 1. The residual is Record 005 refused by guard
  6 — the same comment. It has not moved all week and moving it is §2.
- **Gates:** all green except `lint` (9 errors / 7 warnings, the standing
  baseline, zero new) and `assets:gate` (the Mike-approval gate, 0 of 49 signed,
  red by design).
- **The next autonomous event is 2026-09-07 at 17:00** — the wing opens, Record
  001 appears, the countdown removes itself and the share cards stop being
  rewritten. Nothing has to be deployed for it. `docs/FINDING-autonomous-timeline.md`
  is the day-by-day.
