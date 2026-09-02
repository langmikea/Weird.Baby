# ROUND LOG — `approve:check` DOCUMENTED, NOT CHANGED

**2026-08-25 · museum repo · applied, verified, NOT committed** (§0 MIKE IS THE
LOCK). Started clean at `5a2b2d9`. Robots repo untouched at `3f78972`.

Ops ruled all three of its own options wrong: the tree already held the answer.
**Four records applied. The mechanism, `approvals.json`, the Law and the
fingerprint's behaviour are all untouched.** Findings:
`APPROVE_CHECK_FINDINGS-20260825.md`.

---

## GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 8 warnings = baseline, zero new** |
| `npm run build` | **green**, 2.01s |
| `npm run provenance:gate` | **PASS** (exit 0) |
| `npm run reveal:check` | **PASS** (exit 0) |
| `npm run parity:gate` | **PASS** — 4 shared · 0 divergences |
| `npm run instory:gate` | **PASS** — 0 findings |
| `npm run docs:numbers:gate` | **PASS** (exit 0) — 11 claims, 8 documents |
| `npm run ops:size` | **PASS** — 31,675 bytes, 79.2% of the 40,000 ceiling |
| the lap | **NOT RUN** — nothing under `src/` changed at all this round |
| `npm run approve:check` | **11 of 11, exit 1 — unchanged, and that is the point** |

**`provenance/approvals.json` is byte-identical to HEAD** (`git diff HEAD` on
that path is empty). Nothing was signed.

## WHAT CHANGED

```
docs/canonical/OPERATIONS.md              a §5 row for approve:check  (+1,407 bytes)
docs/opsday-20260822/DEPLOY_GROUND_TRUTH  a dated correction to line 180
reveal/approval.mjs                       the over-reach, in the header
tools/approval-proof.mjs                  the INCONCLUSIVE reading, in the header
```

Four files, **all comment or prose. No executable line moved.**

## 1 — THE §5 ROW

Says of `approve:check` what Doctrine 15 says of `assets:gate`: **red by design,
nobody's packet gate, must never join §9's list** — it checks whether MIKE HAS
LOOKED, not anything Ops can fix, and putting it in the packet would block every
commit on an inspection nobody has asked for.

It carries the closure by file and date — **`c5b7943`, 2026-08-17,
`docs/OPEN_ACTIONS_CLOSED.md`** — the fact that the Approval Law was explicitly
**not** closed and **not** weakened, and the return condition: **it comes back
when it feeds the quality box**, which `docs/BACKLOG.md` files under **PARKED —
no date**.

**And it says why the row exists:** the closure lives in
`OPEN_ACTIONS_CLOSED.md` and **nothing links to it**, so *a red gate with no
explanation is how a later round "fixes" something that was parked on purpose.*

**IT WENT IN THE LIVE `OPERATIONS.md`, NOT THE ARCHIVE, AND THAT IS §8's OWN
CYCLE RATHER THAN A CHOICE.** §0 rules the archive a snapshot that is never
edited to track the ground state; §8 states the consequence — a body raised
since the last cut has nowhere else to live until a cut sweeps it. A pointer
line was added under §5 saying so, because §5 previously said only *moved whole
to the archive* and a reader would not know a new row was allowed there.

## 2 — THE GROUND-TRUTH CORRECTION

`DEPLOY_GROUND_TRUTH.md:180` listed eight commands as *"packet discipline
enforced by a human reading `OPERATIONS.md`."* **Two of the eight are not, and
`OPERATIONS.md` had never named one of them.**

The correction is **appended and dated rather than written over the sentence**,
because that document is a past day's ground-truth record and rewriting a
measurement falsifies it. It states: `approve:check` appears nowhere in
`OPERATIONS.md`, any archive cut, `CLAUDE.md`, `STATE.md`, `OPEN_ACTIONS.md` or
`BACKLOG.md`; **no human reading OPERATIONS could have been enforcing it,
because until today OPERATIONS did not know it existed**; `assets:gate` is
likewise not packet discipline by Doctrine 15's own words; and the six that
**are** are the six in §9's list. **The hooks reading, the deploy commands and
the guard are untouched and still stand** — the document is wrong in one
sentence, not in its substance.

## 3 — THE OVER-REACH, RECORDED WHERE THE FINGERPRINT IS COMPUTED

In `reveal/approval.mjs`'s header, beside the three parts it hashes:

**Reachability is the import graph, not what renders.** `/` is the Lobby and it
reaches `src/data/artists/robots-record.js` for the countdown and the wing-open
gate, **so every asset any Record carries counts as a picture on the Lobby.**

**It is not hypothetical — it killed the only signature this file has ever
held.** Mike signed `/` on 2026-08-16 against **one** picture, the house mark.
Records 003 and 004 attached six manual scans and `qc-101-a.webp` between 08-19
and 08-21, the pictures part went **1 → 8**, and the signature stopped applying.
**He signed the Lobby and it was dropped by seven pictures no Lobby visitor
sees.**

**The consequence is structural:** under this design `/` cannot hold a signature
for more than a few days, because a Record gains attachments most weeks. Any
page reaching `robots-record.js` inherits it.

**The behaviour is unchanged by the note, by ruling**, and the note says so —
narrowing reachability has a real cost on the other side (a fingerprint that
tracked only what renders would have to know what renders, which is the thing
the import graph stands in for), and it belongs to the round that builds the
quality box.

## 4 — THE `approval:proof` READING

In `tools/approval-proof.mjs`'s header. **It would report INCONCLUSIVE and exit
1 today.** The third tell is a route→date pair from `approvals.json`; the vite
`define` admits only pages whose status is `approved`; nothing is approved, so
the development map is `{}` and that pair is in **neither** bundle → `WEAK` →
INCONCLUSIVE. **Tells 1 and 2 still pass** — in development `__WB_APPROVALS__`
is `{}`, which is truthy, so the component survives with its tooltip and
z-index.

**That is the file working, not failing.** `WEAK` exists so a term that has
stopped matching reports INCONCLUSIVE instead of passing.

**And the 2026-08-14 `PROVED` was two of three tells** — no page was signed
until 08-16, so the third was skipped. The tool printed that note; the Friday
log's one-word entry did not carry it. **The launch fold itself is not in
doubt** — `__WB_APPROVALS__` is the literal `null` at LAUNCH and two independent
tells were measured absent.

**READ OFF THE CODE PATH, NOT RUN.** `approval-proof.mjs` shells out to
`build:launch`; the investigation was read-only and this round had no reason to
spend a launch build on it.

## NOT TOUCHED, BY RULING

`provenance/approvals.json` · `tools/approve.mjs` · the Approval Law · the
fingerprint's behaviour. All ruled, and the over-reach is recorded rather than
fixed.

## WHAT IS STILL OPEN, AND IS NOT THIS PACKET

**The quality box** — Mike's own, 2026-08-14, *"One box, three states"* —
`docs/BACKLOG.md` **PARKED — no date**, rows `M32` · `C40`. It is the condition
on which `approve:check` returns, and the round that builds it is the round that
must decide whether the fingerprint separates REACHED from SHOWN. Until then
`approve:check` reads 11 of 11 and **that is the correct reading, not a fault.**
