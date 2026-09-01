# THE FOURTH SURFACE — TikTok in, and the order made structural

**2026-08-28.** HEAD at start `fb21109`. Nothing committed by Code; Mike commits.

> **[2026-09-01] SUPERSEDED IN TWO PLACES, AND THIS LOG IS NOT REWRITTEN — IT IS
> A ROUND LOG AND ROUND LOGS ARE THE NARRATIVE.** Read the pointer before you
> read §3 and §5 as the state of anything.
>
> **§3 and §5's `NO ACCOUNT YET`** was corrected the same day: **the TikTok
> account EXISTS** — `@papaweird.baby`, display name `Weird.Baby` — and it was
> never waiting on Mike. **§5's `TikTok does not permit a dot in a handle` is
> FALSE**, asserted from memory and never checked. Both corrections, and the
> lesson under the second, are in
> [`MUSEUM_HANDLES_AND_LOBBY_LOG-20260828.md`](MUSEUM_HANDLES_AND_LOBBY_LOG-20260828.md).
>
> **[2026-09-01] And the bio is set** — Mike's own sentence, live on the
> account, with the profile's website field carrying `weird.baby`. Recorded in
> `release/README.md` and in `release-shape.mjs`'s `SURFACES`, which are the
> current state; this log is the day.
>
> **What §3 says about the MECHANISM still stands** — the gate refuses an `out`
> posting on a surface whose account does not exist, and that is about any
> surface rather than about TikTok.

---

## 1. WHERE THE ORDERING BELONGS — ANSWERED PLAINLY

The brief asked: the release object, the README, or somewhere else? **It is
split, and the split is the answer:**

| what | where | why |
|---|---|---|
| **The ORDER itself** | `release/release-shape.mjs` | A machine needs it. `SURFACES` is now an **ordered array of objects**, not four strings — a set of names can be reordered by anyone tidying an alphabetical list and nothing would notice. |
| **One line per surface** — *THE DOOR / THE BRAND / THE ARCHIVE / LAST* | same file | The declaration carries enough reason that **nobody reorders it by accident.** `record-shape.mjs`'s own precedent: a declaration states its reason at the site. |
| **THE STRATEGY** — why this order, the research under it, the warning | `release/README.md` | **A data file is the wrong place to argue a position.** |
| **Nothing at all** | `release/releases.json` | The data file names a surface per posting and says nothing about why. |

**The two must not drift, and the README says so:** *if you reorder the array,
this section is what you are contradicting.*

---

## 2. THE STRATEGY, RECORDED WHERE THE NEXT OPS READS IT

`release/README.md` gained **THE FOUR SURFACES, AND WHY THE ORDER IS THE ORDER**,
which leads with the failure it exists to prevent:

> **Treating four surfaces as interchangeable.** They are not four copies of one
> act. Each is doing a different job, and a release planned as *post it
> everywhere* has no strategy in it at all.

| | | why |
|---|---|---|
| 1 | **TikTok — THE DOOR** | the only one built to show work to strangers; an account with 200 followers can reach 100,000 people |
| 2 | **Instagram — THE BRAND** | where the house looks like itself |
| 3 | **YouTube — THE ARCHIVE** | content compounds; a video from two years ago still drives streams |
| 4 | **Facebook — LAST** | it is there because he has an account |

**The door and the archive earn their place for opposite reasons** — one reaches
people who have never heard of the house, the other keeps working long after it
was posted. **A reel that only ever goes to YouTube is filed and not shown.**

**And the honest reading of today's state is written down beside it:** all five
releases are YouTube-only, which by that order means the run currently reaches
nobody who has not already found the house. **The door is not open.**

---

## 3. THE PRECONDITION IS CHECKED, NOT HOPED FOR

Mike ruled the TikTok account **a precondition, not a task** — he sets it up,
nothing here creates it, and no round should list it as work.

**A precondition nothing checks is a wish**, so the surface declaration carries
`account.exists` and the gate refuses a posting that claims to be `out` on a
surface whose account does not exist. The failure it prevents is specific: **a
posting recorded as PUBLIC on a surface that has no account is a false entry in
the one file whose whole job is to be true about what went out.**

**It does not block `planned` or `staged`.** Planning a TikTok post before the
account exists is exactly right, and saying so is what the state is for.

**Instagram is UNSTATED and is treated as its own case.** Mike has said YouTube
and Facebook exist; he has said nothing either way about Instagram, so
`exists: null` and the gate refuses an `out` posting there **for that reason and
in those words** — Ops does not infer it.

---

## 4. THE HANDLE — HIS ORDER, AND WHERE THE DOT GOES

Recorded in `release-shape.mjs` as `HANDLE`, and argued in the README:

- **His preference order, his order:** `Weird.Baby` · `WeirdBaby` · `weirdbaby`
- **TikTok does not permit a dot in a handle** — so his first preference is
  unavailable on the surface he ruled first
- **The resolution is not to drop the dot but to MOVE it:**
  **the dot lives in the NAME, not in the HANDLE** — handle `WeirdBaby` or
  `weirdbaby`, display name `Weird.Baby`

**Nothing is chosen.** `handle` is null on all four: no handle has been supplied
for any platform — register **M60**, open since 2026-08-05 — and a handle is not
something Ops may invent. **What is recorded is what he PREFERS and what is
POSSIBLE, which are not the same thing on one of the four.**

---

## 5. THE REPORT PRINTS THE ORDER EVERY RUN

Because a list nobody sees is a list that gets reordered:

```
  THE SURFACES — in the ruled order
    tiktok     THE DOOR     NO ACCOUNT YET
    instagram  THE BRAND    account unstated
    youtube    THE ARCHIVE  account exists · handle not supplied (M60)
    facebook   LAST         account exists · handle not supplied (M60)
    handle order: Weird.Baby · WeirdBaby · weirdbaby
    TikTok does not permit dots in handles. So: handle `WeirdBaby` or
    `weirdbaby`, display name `Weird.Baby`.
```

---

## 6. THE NEW CHECKS PROVED BY TRIPPING THEM

Each against a copy, tree restored after.

| # | trip | result | exit |
|---|---|---|---:|
| 8 | a TikTok posting set `out` | **is OUT, and the tiktok account does not exist** — with the precondition note printed | 1 |
| 9 | an Instagram posting set `out` | **nobody has said whether the instagram account exists. Ops does not infer it** | 1 |
| 10 | a TikTok posting set **`planned`** | **PASS** — planning before the account exists is correct | 0 |

**Trip 10 is the one that matters as much as the two failures:** a precondition
that blocked planning would have made the honest state unrecordable.

The seven checks from `fb21109` were re-run and still pass unchanged.

---

## 7. WHAT DID NOT GROW

Mike's constraint: *keep it tight, do not let it grow.* Measured against it:

- **No new object.** A surface is a field on a posting, exactly as before.
- **No new file.** Four files touched, none added.
- **No strategy in the data file.** `releases.json` is untouched by this round.
- **No new posting rows.** TikTok, Instagram and Facebook carry **no posting at
  all** — not `planned`, absent. Nothing exists there and nothing was invented
  to look ready.
- **Two new checks**, both on an existing loop, both trip-proved.

---

## 8. GATES

```
release:check         PASS
lint                  9 errors / 7 warnings — BASELINE, zero new
build                 green
build:launch          green
provenance:gate       PASS
reveal:check          PASS
parity:gate           PASS — 4 shared, 0 divergences
instory:gate          PASS — 0 findings
docs:numbers:gate     PASS
reveal:day            nothing to move
```

**Nothing under `src/` changed.** A sweep for stale "three surfaces" wording
across `release/` returns none.

---

## 9. FOR THE COMMIT

```
release/release-shape.mjs                          M   SURFACES ordered · SURFACE_KEYS · surfaceOf · HANDLE
release/README.md                                  M   THE FOUR SURFACES — the strategy
release/specs/SPEC-coconuts-quarters-20260828.md   M   four surfaces, the precondition, two new open items
tools/release-gate.mjs                             M   ordered keys · the account precondition · the order in the report
docs/MUSEUM_FOURTH_SURFACE_LOG-20260828.md        new  this file
```
