# CLEANUP — round log, 2026-08-09

**Four instructions (D1–D4), all four done. Nothing in this round is waiting on
Mike.**

Gates: lint **11 errors / 9 warnings = baseline** · build **green** ·
`provenance:gate` **PASS** · `reveal:check` **PASS** · `parity:gate` **PASS, 4
shared · 0 divergences** · `instory:gate` **PASS** · `assets:orphans` **0 judged,
0 unjudged** · `reveal:day` **nothing to move** · **the lap RAN at 390px and
1228px on all ten Ops pages** — 20 measurements, page overflow 0, uncontained
boxes 0, leaf text overflow 0, broken images 0, console errors 0.

Nothing in `src/` changed. Nothing was deployed.

---

## §1 — D1: THE LAST COPY IS GONE

`C:\AI\Projects\_review\HELD-PHOTOGRAPHS-20260806\` removed whole — the eleven
photographs (1.29 MB), the `index.html` viewer built to rule from, and the empty
`_review/` parent, which held nothing else and was created for this one purpose.

**Confirmed three ways.** The directory does not exist. A `find` across
`C:\AI\Projects` for all eleven filenames returns nothing. And the only files
that still contain the string `HELD-PHOTOGRAPHS` are round logs — the round that
built it, the round that found it, and this one — plus
`docs/OPEN_ACTIONS_CLOSED.md`, which is Ops' history and is not on the desk.
**Nothing Mike opens points at it.**

`L-b` closes and leaves the register.

---

## §2 — D2: THE ORPHAN CHECK, AND WHAT IT SAW WHEN IT COULD SEE

**An orphan is a row whose file is gone.** That is the whole definition.
`--orphans` had a second clause — `missing && isJudged` — and `isJudged` asks a
different question: *what would be LOST if this row were dropped.* That is the
right test for **how loud to be**, which is all C32 ever needed it for. It is not
a test for whether the row is an orphan.

So the clause survives as a **grade** rather than as a filter:

| grade | meaning | the move |
|---|---|---|
| **JUDGED** | an inspection is at stake | `--rename` moves it; `--cull` throws it away, and only a person may say so. C32, unchanged. |
| **UNJUDGED** | nothing is at stake | dead bookkeeping. `--cull`. |

Both are reported and the summary prints the two counts separately, so a round's
standing `assets:orphans` line keeps meaning what it meant. The same grading was
added to the banner the **scan** prints, which had the identical filter.

### What it found, and it was not 24

> **27 rows whose file is no longer on disk — 0 judged, 27 unjudged.**

`L-a` predicted 24 and `K-a` predicted 3. Both were right about their own rows
and both understated the defect, because the two are the same defect found twice
and neither noticed the other. **The real number is that `assets:orphans` has
never reported a single row in its life** — it could only ever report a judged
orphan, and no row in this table whose file went missing has ever carried a
judgement. A check that reads 0 because its population is empty by construction
is indistinguishable, from the outside, from a clean table.

### Then all 27 were culled, and each was looked at

- **24** — `robots/mgk-viiip/manual/pages/page-01…24.png`. The manual moved to
  `manual/structure/pages/` and was **re-rendered on the way**: 61 pages now, and
  not one shares a sha256 with the 24. Neither the path nor the hash could follow
  it, which is exactly the case `--rename` exists for and nobody ran.
- **2** — `robots/art/portal-cover.png` and
  `robots/reference/mgk-viii/cabinet_whole.jpg`. §8's two-addresses hazard: these
  are the public-side twins of pictures behind the stage door, and the held row
  is the live one. Culling drops an address, not a photograph.
- **1** — `images/foundation/faq-cover.png`. Its row said `role: shipped` and
  `usedBy: src/data/artists/foundation.js`, and **a grep of `src/` finds no
  `faq-cover` anywhere.** The scanned fields were stale from before the FAQ face
  stopped carrying a cover. Checked rather than assumed, because a shipped row
  with no file would have been a broken image on the glass.

**The table is 250 rows and every one points at a file on disk.** `L-a` and
`K-a` both close.

---

## §3 — D3: LEAD WITH WHAT HE MUST DO OR DECIDE

`OPERATIONS.md` §7 **Doctrine 26**, mirrored in `STATE.md`.

> Every report opens with what is waiting on him. Everything else is omitted
> unless it changes something for him. **The test is not *is it true* and not *is
> it interesting* — it is *does this change what he does next?***

Craftsmanship notes, measurements, before-and-after numbers and methodology go in
the round log; a future session reads them there, and he is not a future session.
**If a round has nothing for him, say so plainly and give him the commands** —
padding an empty ask makes him read a page to discover it is empty, which is
Doctrine 25's cost charged to a message instead of a page. **A gate table is not
a decision:** one line at the end, or nothing.

It is Doctrine 25 for prose, and it carries the same construction clause: what is
worth keeping goes in **the round log**, in **`OPEN_ACTIONS.md`** if he needs it
later, or in **`OPERATIONS.md`/`STATE.md`** if it binds future work — never in
the opening paragraphs of a report as evidence of effort.

**This round's report is the first one written under it, and it is the empty
case.**

---

## §4 — D4: THE REGISTER, EVERYTHING MECHANICAL

**331 lines, from 337.** Six rows and three short-list lines left; seven rows
were repaired in place.

### Closed and gone (Doctrine 14 → 24)

| | what closed it |
|---|---|
| **L-b** | §1. |
| **L-a** · **K-a** | §2. One defect, two rows, one fix. |
| **M99** | The refusal H2 built into `assets-declare.mjs --write` **is** the `--check` this row asked for, and the drift-repair half was answered by C1 (*this file is the source*). §8 named a second unguarded declarer in the same breath and left it; **this round guarded it** — see below. |
| **M84** | Not closed by a fix. It said *"nothing to decide; this is a note so nobody acts on a wrong reading."* **A note is not an open action**, and the round it warns is a cleanup round, which starts by reading `OPERATIONS.md`. It is a §8 hazard row now. |
| **C39 (orig)** | **Already fixed; verified rather than assumed.** `tools/asset-table.mjs` at HEAD holds **zero** NUL bytes — `mintUid` uses the escape `\0`, the rename matcher `\u0000` — and `grep` reads the file as text. The row had outlived its defect by rounds. |

### Two short-list lines were still asking questions that had answers

**Short-list 8** pointed at **M25**, which closed at N4 *by subtraction* — Mike
struck both walls' tombstones, so the sentence the lit plate was said to
contradict does not exist. **Short-list 63** pointed at **M92**, resolved at N2
in a third direction nobody offered (both faces lost their real-build register),
and what each face now needs is already short-list **15b**. Both lines went.

**That is the third and fourth instance of this exact failure in two rounds** —
15a was the first. A row closes and leaves; the SHORT LIST line that pulled it
out stays behind, still asking. **The short list is derived from the tables and
nothing derives it**, which is the whole mechanism of the bug.

### Seven rows repaired in place

**Seven `(orig)` rows had no parent left.** The suffix marks original text kept
beside a superseding row — and for `M4`, `M29`, `M30`, `M45`, `M47`, `C31` and
`T-A` the superseding row had closed and left, so the suffix reads as history on
a row that is live and open. Renamed to their plain ids; **nothing linked to the
old anchors**, checked before the rename. `M9 (orig)` and `C29 (orig)` keep
theirs — both still have a live parent.

**Two rows were linked to and carried no anchor** — `C30` (from `H-c`) and `P2`
(from `M61`). Added. **Dead intra-file links: 0.**

### The second declarer is guarded

`reveal/ledger-declare.mjs --write` regenerated `ledger.json` whole from an array
in its own source, with nothing between it and a hand-added row. That is M99's
shape and §8 named it. It now diffs the live file's row ids against its own and
**refuses**, in the same words and the same shape as `assets-declare.mjs`, so the
two cannot drift apart in their turn.

- **Drift measured zero before writing the guard** — a `--write` reproduced
  `ledger.json` byte for byte. That is the argument *for* adding it now: a guard
  written while the drift is zero cannot be wrong about what to keep, and one
  written after 45 rows have accumulated has to decide which file is the source
  first. That decision is what H-b cost.
- **Proved by breaking it**: a hand-added `zz.guard.probe` row was injected into
  `ledger.json`, `--write` refused and named it, and the file was restored
  byte-identically.

---

## §5 — WHAT WAS TOUCHED

**Code:** `tools/asset-table.mjs` (the orphan definition, the scan banner, the
`--orphans` command, the usage line) · `reveal/ledger-declare.mjs` (the drift
guard).

**Data:** `provenance/asset-table.json` — 27 rows culled, 277 → 250.

**Registers:** `docs/OPEN_ACTIONS.md` (337 → 331) ·
`docs/OPEN_ACTIONS_CLOSED.md`.

**Doctrine:** `docs/canonical/OPERATIONS.md` §7 Doctrine 26 and a new §8 hazard
row · `STATE.md`.

**Deleted:** `C:\AI\Projects\_review\` (12 files, 1.29 MB).

**Generated:** the seven dictation pages, `docs/CONTACT_SHEET.html` (205 → 178
tiles, and it no longer prints *27 rows point at a file that is not on disk*),
`docs/OPS_DESK.html`, `docs/OPEN_ACTIONS.html`.
