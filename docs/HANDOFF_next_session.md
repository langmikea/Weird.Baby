# HANDOFF — for the next session

Rewritten **2026-08-29** at HEAD `0f23e96`, after an Ops handoff triggered
by the two-error rule.

**Session-scoped context only.** Process and standing facts went into
`docs/canonical/OPERATIONS.md`, `docs/canonical/OPS_BOOT.md` and
`docs/MUSEUM_RULINGS-20260817.md` today, and are not restated here.
**Nothing below is a standing order.** Run `git log --oneline -5` and
`git status --short` and believe those.

---

## The day, in three commits

Base was `442495f`.

| hash | what it did |
|---|---|
| `83f06a0` | Doctrine 28 — ONE SUMMARY, ONE EXIT — with its body at `docs/OPS-RESPONSE-SHAPE-20260829.md`. |
| `019fbd3` | Ruling 29 in full; the §8 executable-manual hazard; `DEPLOYED.md` as the accidental deploy wrote it. |
| `0f23e96` | `docs/canonical/OPS_BOOT.md`; doctrine 29; `tools/conduit-drop.mjs` carries the boot file, placed first. |

The robots repo was not touched.

---

## 1 — Ops now boots from a file

`docs/canonical/OPS_BOOT.md` is what Mike pastes to open a fresh Ops
session, whole and unedited, every time. **It holds no per-session values
by design** — no HEAD, no dates, no task lists — because a value Mike has
to hand-update is a value that will be wrong the first time he forgets.

It also holds the three carry rules, which until today lived nowhere in
the tree and rode in a pasted message.

**If a future session needs Mike to edit that file before sending it, the
file has a defect. Fix the file.**

It travels in the conduit, first in the drop, ahead of this handoff.

---

## 2 — The unauthorized deploy, and why it stands

At **2026-08-29T14:03:26.328Z** the museum published at stage launch,
worker sha256 `85ac466ac948642c`, from `83f06a0` with
`docs/canonical/OPERATIONS.md` uncommitted. Nobody asked for it.

A `node -e` string with an escaped single quote broke out of shell
quoting; bash then executed `docs/canonical/OPERATIONS.md` line by line,
and **line 117 is the §0 deploy block's body**.

**It changed nothing a visitor sees.** Every diff since the clean
`124b7dd` deploy at 12:30Z is under `docs/`, which the site build does not
read. The worker sha256 moved because `vite.config.js` stamps
`__BUILD_TIME__` into every build. The guard passed, the stage matched.
`RECORD_EPOCH` was never touched.

**Ops verified the live site by eye at ~14:42Z** — directory intact, guest
book at seven signatures, and the countdown reading 9 days 6 hours 18
minutes, which resolves to Monday 2026-09-07 at 17:00 Eastern. That
render is the evidence the epoch is intact, not the constant.

**Ops ruled the deploy stands.** `DEPLOYED.md` keeps its dirty-tree record
because it is true, and a tidying re-publish would spend Mike's one line
to change nothing.

---

## 3 — Open, and deliberately not decided: defusing §0

The §0 DEPLOY block prints a live command inside a file that is
executable. Today proved that is not theoretical. **The block was not
touched** — defusing it is a real decision and nobody has made it. The
hazard is a §8 lead line.

---

## 4 — The ceiling is close

`ops:size` **PASS at 39,475 / 40,000 — 98.7%, 525 bytes left.** Today
spent 477 across three commits.

**The next substantive round probably takes a cut.** The procedure is §9's
and `npm run ops:archive` regenerates the index. **Measure before cutting**
— it may have moved either way.

---

## 5 — Gates at close

`ops:size` **PASS** — 39,475 bytes.
`docs:numbers:gate` **PASS** via npm, exit 0 — 11 claims across 8
documents, 128s.
`npm run conduit` clean at `0f23e96` — 23 files plus manifest.

The full packet gate list is §9's and did not run — no source, no ledger
and no asset changed. **If your round touches any of those, run the list.**

---

## 6 — Waiting on Mike, untouched

The TikTok bio · the guest book row he wants removed · the arc's blank
weeks 6, 7 and 8 · **the dress-rehearsal ruling, still never landed in the
tree** · Audie Cornish on `/wal`, which he ruled *wait*.

## 7 — Ops' and unstarted

Public reads of his social accounts — public only, no credentials, and his
constraint is *do not work too far ahead* · the gift shop · R001's dry-run
note · the grey album covers · Mode B leftovers · the trailer gate.

---

## 8 — Why this handoff exists

Ops made five errors Mike caught in one session: host-command phrasing on
a packet; calling for a gate route that had already run; sending Mike a
re-publish decision that was Ops'; asking Mike to rule on Ops' own error
count; and closing with jargon that would have required Mike to hand-edit
a pasted instruction.

**They share one shape: deciding by pattern instead of reading what was in
front of it.** The last one is why `OPS_BOOT.md` exists — the defect was
load-bearing, not cosmetic, and it got fixed on the way out.

A fresh session inherits the tree, not the habit.
