# `approve:check` — WHAT IT IS, AND WHY IT IS RED

**2026-08-25 · read-only investigation · museum `5a2b2d9`, robots `3f78972`,
both clean.** Nothing was signed and `provenance/approvals.json` was not touched.

**IT IS NEITHER A DEFECT NOR A SUPERSEDED MECHANISM. It was deliberately parked
on 2026-08-17, with the Approval Law explicitly preserved and a named return
condition that has not been met.** The closure is written down; it is not
written down anywhere a session would look.

---

## 1 · WHAT IT CHECKS, AND WHAT A SIGNATURE ASSERTS

**THE LAW**, Mike's words, in `reveal/approval.mjs`'s header: *"An approval is a
signature on a page AS IT STOOD. Any change to what that page shows drops the
approval, automatically. Ops never re-approves; Mike does."*

The mechanism is a **fingerprint** — a hash of everything a page shows, in three
parts:

1. **the words** — every `provenance/register.json` hash for a string in a
   reachable file;
2. **the look** — every reachable `.css`, comments stripped, whitespace
   normalised;
3. **the pictures** — every asset-table row whose `usedBy` names a reachable
   file, by `sha256`.

**A page is a ROUTE**, read off `App.jsx`'s AST — parsed, never listed, because
*"a hand-kept copy of the routes would be a second list that drifts."* What a
page shows is every string in every file that route reaches transitively.

**Comments are deliberately excluded**, and the header says why: a fingerprint
over raw bytes *"would drop every approval in the building every time somebody
explained something."*

He signs a fingerprint. When the page changes the fingerprint changes and **the
signature stops applying rather than being revoked** — *"Nothing has to remember
to drop it, which is the only version of this that survives a busy week."*

**WHO SIGNS, AND HOW.** Only Mike, `npm run approve -- <route>`. The tool says
it in its own mouth: *"OPS MUST NEVER RUN THE SIGNING FORM… a signature Ops
applied is worth nothing."* `approvals.json`'s `_` field repeats it. The report
forms — `approve`, `--why`, `--blast`, `--check` — are Ops' to run at any time.

`approvals.json` holds **one row**: `/`, signed 2026-08-16, `by: Mike`.

## 2 · WHEN IT WAS BUILT, AND WHY

**`8ddd0ba`, 2026-08-13** — *"The approval mark, the numbers gate, and two
marker files ruled out."* One commit added `reveal/approval.mjs` (437 lines),
`tools/approve.mjs`, `tools/approval-proof.mjs`,
`src/components/ApprovalMark.jsx`, `provenance/approvals.json` and the
`vite.config.js` define.

**THERE IS NO ROUND LOG FOR IT.** That commit's `docs/` changes are +24 lines in
`OPERATIONS.md` and **every one of them is about the numbers gate.** The
approval mechanism was built and never documented, which is why it is named in
no governing document today.

The problem it solved is stated only in its own header: making Mike's law a
mechanism rather than a promise, so a stale sign-off expires itself.

## 3 · THE `/` SIGNATURE

**THE ROW WAS NEVER REMOVED.** It is still in `approvals.json`. What "dropped"
means is that the fingerprint stopped matching — the mechanism working as
designed.

Signed at `b479069`, **2026-08-16 21:13**. What moved:

| part | at signing | now |
|---|---|---|
| words | `02bb41e3…`, 109 strings | `bcd12043…`, **116** |
| look | `899d965d…`, 5 stylesheets | `899d965d…` — **unchanged** |
| pictures | `7bb6461b…`, **1** asset | `e3e1e8ff…`, **8** |

**IT WAS A SIDE EFFECT, AND THE CAUSE IS THE FINDING.** `/` is the Lobby. It
reaches 14 files, one of which is `src/data/artists/robots-record.js`, pulled in
for the countdown and the wing-open gate. **So every asset the Record carries
counts as a picture on `/`.** The one picture at signing was
`WeirdBaby_PhotoID.png`. The seven that broke it are Record attachments — the
six manual scans and `qc-101-a.webp` — landed 2026-08-19 to 08-21 by Records
003 and 004.

**A visitor to `/` sees none of those seven.**

The first commit after the signature that could have moved it is `6a7ab9f`
(08-17); it was certainly gone by `93ce750` (08-19, Record 003's scans). **So
the signature lasted between one and three days, and what killed it was content
on a different page.** The exact commit is a bracket rather than a point:
computing the fingerprint at each intermediate commit needs a checkout, and this
packet was read-only.

## 4 · WAS IT EVER GREEN?

**No. Not once.**

- `8ddd0ba` created `approvals.json` with `approvals: {}` — **zero signatures
  against 11 real pages.** Red from birth.
- `b479069` added `/` — **1 of 11.** Still red.
- **Only those two commits have ever touched the file.**

The highest it ever reached is one page in eleven, and that page's signature had
expired within days.

## 5 · WHAT DEPENDS ON AN APPROVAL — THE RECOLLECTION IS CORRECT

`vite.config.js:634` — `STAGE === "launch" ? null : {…}`. At LAUNCH
`__WB_APPROVALS__` is **the literal `null`**, so `ApprovalMark`'s first line
becomes `if (!null) return null;`, a constant condition rollup folds, taking the
component, its styles and the whole map out of the bundle. *"There is no runtime
flag to forget and no stage to check at runtime."* The map carries **route →
date only** — never fingerprints, never file lists.

`approval:proof` recorded **PROVED** on 2026-08-14 (`MUSEUM_FRIDAY_LOG`). **Two
caveats the record does not carry:**

- **It proved TWO OF THREE TELLS.** The third — a route→date pair from the map —
  is skipped when nothing is signed, and on 08-14 nothing was. The tool prints
  that note itself; the log's one-word "PROVED" does not.
- **IT WOULD NOW REPORT INCONCLUSIVE AND EXIT 1.** The define filters to
  `status === "approved"`; nothing is approved, so the development map is `{}`
  and the signature tell is in NEITHER bundle → `WEAK` → `INCONCLUSIVE`. Tells 1
  and 2 still pass. **Read off the code path, not run** — `approval-proof.mjs`
  shells out to `build:launch`, which writes `dist/`.

Nothing else consumes an approval. `deploy-guard.mjs` names `approvals.json`
only to say it is uncovered and *"matters less."*

## 6 · NOTHING ELSE DOES THE JOB, AND IT WAS NOT SUPERSEDED

`docs/OPEN_ACTIONS_CLOSED.md:481`, landed in `c5b7943`:

> **the approve tool** — **A STAMP WITH NO CONSUMER.** `npm run approve` writes
> a signature into `provenance/approvals.json` and **nothing reads it back** — a
> fingerprint that stops matching stops matching in silence, and Mike would have
> to go and look to find out. **THE APPROVAL LAW IS NOT CLOSED AND IS NOT
> WEAKENED**… What is closed is the TOOL as a backlog item. **It returns when it
> feeds the quality box**… A stamp nobody reads is not a check; it is a note.

**THE TIMING IS THE SHARPEST FACT IN THE ROUND.** Mike signed `/` at 21:13 on
2026-08-16. The tool was closed at **00:07 on 2026-08-17 — two hours and
fifty-four minutes later.**

**THE RETURN CONDITION IS UNBUILT AND PARKED.** The quality box is Mike's own
(2026-08-14): *"One box, three states. Green = clean. Yellow = things happened,
contained, look when you like. Red = a problem, and Mike should already know
before he sees the box."* `docs/BACKLOG.md` files it under **PARKED — no date.**

**NOTHING ELSE DOES PER-PAGE SIGN-OFF.** The Record Approval Gate (Doctrine 15)
is per-ASSET and per-Record, wired to the asset table's `verdict`: it answers
*has Mike inspected this file*, not *has Mike signed this page as it stood*.
Provenance classes answer *who authored this string*. The rulings answer *what
was decided*. `assets:gate` exits 1 today for the same reason this does.

## 7 · VERDICT — NONE OF THE THREE, AND DOCTRINE 15 DECIDES TWO OF THEM

**WIRE IT INTO THE RITUAL: REFUSED BY STANDING DOCTRINE.** Doctrine 15, on
`assets:gate`: *"IT IS NOT A PACKET GATE AND MUST NOT BECOME ONE. lint, build
and `provenance:gate` run on every commit because they check things Ops can fix.
**This one checks whether MIKE HAS LOOKED**, and putting it in the packet would
block every commit on an inspection nobody has been asked for — the exact
opposite of Mike's own condition, that he must not have to perfect assets in
advance."* `approve:check` is that shape exactly.

**MAKE IT GREEN: NOT OPS' TO ASK FOR, AND IT WOULD NOT HOLD.** Green means Mike
signing eleven pages — perfecting in advance, the thing Doctrine 15 refuses. And
the one signature that has ever existed died in under three days to content on
another page.

**REMOVE IT: REFUSED BY THE CLOSURE ITSELF.** The Law is preserved in writing
and `approvals.json` was ruled untouched.

**WHAT IT ACTUALLY IS: a parked mechanism whose documentation is missing.**
Three defects, two of them in the writing and one in the design:

1. **NAMED IN NO GOVERNING DOCUMENT** — not `OPERATIONS.md`, not any archive
   cut, not `CLAUDE.md`, `STATE.md`, `OPEN_ACTIONS.md` or `BACKLOG.md`. Verified
   by direct search. `assets:gate` has Doctrine 15 saying what it is and why it
   is red; this has nothing, **so a session that finds it red has no way to
   learn it was parked.**
2. **`DEPLOY_GROUND_TRUTH.md:180` CLAIMS OTHERWISE** — it lists `approve:check`
   among gates that are *"packet discipline enforced by a human reading
   `OPERATIONS.md`."* OPERATIONS has never mentioned it.
3. **THE FINGERPRINT OVER-REACHES.** Reachability is the import graph, not what
   renders. Under this design **`/` cannot hold a signature for more than a few
   days**, and signing it is close to futile until the fingerprint separates
   *reached* from *shown*.

---

## WHAT WAS APPLIED ON THIS RULING

Ops ruled the three options wrong and directed four records. **The mechanism,
`approvals.json`, the Law and the fingerprint's behaviour are all untouched — the
over-reach is RECORDED, not fixed.**

1. **A §5 row** in the live `OPERATIONS.md` — parked instrument, red by design,
   returns with the quality box, closure cited by file and date. It goes in the
   ground state rather than the archive because **§0 rules the archive a
   snapshot that is never edited to track this file**, and §8 states the cycle:
   a body raised since the last cut lives in the ground state until a cut sweeps
   it.
2. **`DEPLOY_GROUND_TRUTH.md:180`** corrected to what is true.
3. **The over-reach** recorded in `reveal/approval.mjs`, where the fingerprint is
   computed, as the thing the quality-box round must solve first.
4. **The `approval:proof` reading** recorded in `tools/approval-proof.mjs`.
