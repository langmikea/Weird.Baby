# HANDOFF — for the next session

Rewritten **2026-08-29** at museum HEAD `011c2d9`, robots `ea5450b`.

**Session-scoped context only.** Process and standing facts are in
`docs/canonical/OPERATIONS.md`, `docs/canonical/OPS_BOOT.md` and
`docs/MUSEUM_RULINGS-20260817.md`. **Nothing below is a standing order.**
Run `git log --oneline -8` and `git status --short` and believe those.

---

## 1 — What the day did

**Morning: how Ops works got written down.** Doctrine 28 — one summary,
one exit — with its body at `docs/OPS-RESPONSE-SHAPE-20260829.md`.
Ruling 29 narrowed `[MIKE]` to the deploy alone; it now appears once in
the manual. Doctrine 29 and `docs/canonical/OPS_BOOT.md` ended the
practice of booting Ops from a message Mike hand-edits.

**Afternoon: an entire class of fault was closed.** It began as *defuse
one line* and became a gated class across both repositories.

---

## 2 — The deploy at 14:03:26Z: the cause is unknown and stays unknown

A deploy ran at **2026-08-29T14:03:26.328Z** during a shell runaway.
`DEPLOYED.md` records it. It changed nothing a visitor sees.

**Two hypotheses were tested and both measured false:** `OPERATIONS.md`
as entry point, and the recursion chain. The entry point cannot be
recovered.

**Do not supply a third.** This record carried two wrong causes in one
day, each stated confidently. Unknown is the finding.

---

## 3 — What IS established, and what closed it

Markdown inline backticks are command substitution in **bash**, so a
backticked command in ordinary prose executes if a file is handed to a
shell. Files were inert only because bash aborted on a syntax error
above their deploy line — **and that abort point moves whenever prose
above it is edited.**

**The exposure is bash-specific.** Under pwsh, backtick is an escape
character and does not fire; `$( )` does. Mike runs pwsh.

**57 files now carry a shell-stop** — 54 museum, 3 robots — each an
invisible comment that adds a line and alters nothing.
`npm run shellstop:gate` fails on any tracked file naming a deploy in a
runnable position without one. **884ms, wired into §9.**

It **skips `OPERATIONS_ARCHIVE/`** on a stated principle, not a list: a
sealed snapshot is never a live packet's input. **It refuses rather
than skipping if the robots clone is missing** — measuring one of two
repositories and reporting clean is the failure it exists to catch.

`§0 THE ARCHIVE IS A SNAPSHOT` was **not** amended. It was the pressure
point and it held.

---

## 4 — Gates and headroom at close

`ops:size` **PASS — 35,860 / 40,000, 89.6%, 4,140 left.** §8 took its
fourth cut today at `09efc03`; `OPERATIONS_ARCHIVE/08-KNOWN-HAZARDS-IV.md`
holds seven bodied entries.

**The cut procedure is NOT in §9.** §9 is the session-close ritual. The
procedure is in `tools/ops-size-gate.mjs`'s failure text and §8's
preamble. Ops asserted §9 twice today and was wrong twice.

`docs:numbers:gate` **PASS** — 11 claims, 8 documents, 121s.
`shellstop:gate` **PASS** — 71 name a deploy, 61 runnable, 0 unguarded.

---

## 5 — Where the platform stands

Mike's goal: **a proven stable platform for editing, publishing,
promoting and adding content.** Ops ordered the backlog against it.

- **Editing** — has a proven surface. The day editor.
- **Publishing** — safe as of today. This was item 1 and it is done.
- **Adding content** — *no surface.* The media intake pipeline,
  backlog item 5, no register row. **This is next.**
- **Promoting** — *no surface.* Social, item 3, `M60`. Mike's
  constraint: public reads only, no credentials, do not work too far
  ahead.

Below the line: the shared plate reader — the `/wb` photographs that
will not open. About a round, and it gets more expensive per wing.

---

## 6 — Waiting on Mike

The TikTok bio · the guest book row he wants removed · the arc's blank
weeks 6, 7 and 8 · **the dress-rehearsal ruling, still never landed in
the tree** · Audie Cornish on `/wal`, ruled *wait* · the portal FAQ's
known-false line, his to rewrite · the About the Artist rewrite.

## 7 — Ops' and unstarted

Public reads of his social accounts · the gift shop · R001's dry-run
note · the grey album covers · Mode B leftovers · the trailer gate.

---

## 8 — For whoever reads this next

**`RECORD_EPOCH` is 2026-09-07 at 17:00 Eastern and it fires on its
own.** Nobody runs anything. If the workflow is not ready, the epoch
moves BEFORE that day — Ruling D: move first, deploy second.

Ops was replaced once today under the two-error rule and the
replacement made three more, all of the same shape: **naming a thing
from its likely shape instead of reading it.** §9 holding the cut
procedure. Line 117 firing the deploy. The recursion chain. Every one
plausible; every one wrong; every one caught by Code checking rather
than obeying, or by Mike reading.

**That checking is the load-bearing part of this system. Do not
optimise it away.**
