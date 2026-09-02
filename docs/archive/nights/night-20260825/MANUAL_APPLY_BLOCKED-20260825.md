# THE SIX — REPORTED BEFORE APPLYING. NOTHING WAS CHANGED.

**2026-08-25 · read-only · both repos clean at `5d6320a` / `3f78972`.**

Ops ruled six and said *"Report before applying if any of these cannot land
together."* **Two cannot. One is under-scoped. Three land clean.** Nothing has
been edited, deleted or copied.

---

## THE BLOCKER — ITEM 1, AND IT IS DOCTRINE 27

**Doctrine 27 (Mike, 2026-08-20 — STANDING):** *"AN ASSET CULL ASKS WHAT BUILDS
FROM A FILE, NOT ONLY WHAT DISPLAYS IT … A picture may have two jobs. Judging it
on the one you can see is how a live surface gets deleted by a round that
thought it was tidying a wall."* Its own text says **it has been paid for
twice, on consecutive days** — `monitor_base.png` and
`MGK-TWIN_MONITOR_SCREEN_BEZEL.png`.

**`role: unreferenced` answers the displaying question only.** The asset table
computes `usedBy` by scanning `src/`. It cannot see anything else, and the
premise *"it has no consumer"* rests on it.

**Swept properly — both repos, by path and by asset uid — six things build from
these 64 files:**

| builder | path refs | uid refs | kind |
|---|---:|---:|---|
| `docs/dictation-20260807/artifacts.html` | 192 | **64** | generated — the light table |
| `docs/shorts/shorts.html` | 129 | **64** | generated — the shorts studio |
| `docs/dictation-20260807/assign.html` | 64 | 0 | generated |
| `tools/dictation/.thumb-cache.json` | 64 | 0 | cache |
| **`docs/shorts/teaser.json`** | 22 | **5** | **authored — a saved recipe** |
| **`docs/shorts/recipes.json`** | 1 | 1 | **authored — a saved recipe** |
| **`docs/SUNDAY-20260830.md`** | 1 | 0 | **the launch deploy procedure** |

The first four regenerate. The last three do not.

### The one that decides it

**`docs/SUNDAY-20260830.md` is the launch deploy procedure and it runs in five
days.** Its own opening: *"This is a procedure for one night. Follow it top to
bottom. Do not read anything else. **Every decision in it has already been
made.**"*

Step **18 — the held door is shut**:

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" https://weird.baby/held/robots/manual/page-07.png
```

> **RIGHT:** `404` — **NOT RIGHT:** `200` → **STOP and roll back now.**

`page-07.png` is one of the 64.

**AND THE FAILURE IS THE QUIET KIND.** The stage door refuses **by prefix**,
before it ever looks for a file — `src/worker.js:555`:

```js
if (STAGE_DIRS.some(d => url.pathname.startsWith(d))) {
  if (__WB_STAGE__ === "launch" && !await heldOpen(request, env)) {
    return noStore(new Response("Not found", { status: 404 }));
  }
```

`STAGE_DIRS = ["/assets/held/", "/held/"]`. So after the deletion **step 18
still prints 404 and still passes** — but it would be proving that the prefix is
routed, not that the door is holding a real file. **The one check standing
between Mike and publishing the held wing would pass for the wrong reason, on
launch night, and say nothing.** That is §8's *an instrument that returns
healthy is not evidence of health when it cannot see the failure mode* — the
same class this whole packet started from.

### The two saved recipes

`teaser.json` and `recipes.json` are **inputs, not output**. They pin each asset
by `uid` **and** `sha256` — and the sha256 they carry is the **stale render's**
(`af4abdef…` for page-01). Deleting the files and pruning the rows destroys both
halves of the pin. Repointing them at the robots source would change what the
teaser looks like, which is not an Ops call.

---

## ITEM 3 IS UNDER-SCOPED — THE PAIR LIVES AT FIVE SITES, ONE GATED

| site | gated? |
|---|---|
| `docs/canonical/OPERATIONS.md:134` | **yes** — `held-cost`, `near: /publicly readable/i` |
| `src/worker.js:545` — *"`/held/*` is 137 files and 186,888,028 bytes"* | **no** — source comment, outside the 8-file DOCS set |
| `tools/numbers-gate.mjs:158` — the gate's own header quoting §0 | **no** |
| `docs/opsday-20260822/ANSWER_KEY.md`, `DEPLOY_GROUND_TRUTH.md`, `DEPLOY_REMAINDER_LOG` | **no** — a past day's record |

Ops is right that the gate catches §0. **It catches only §0.** The worker
comment and the gate's own header go stale silently, and the worker one sits at
the exact site where getting the door wrong publishes the wing.

**And the row prune has a second gated consequence that was not named.**
Removing 64 rows takes the table **475 → 411**, which breaks two *gated* claims:

- `CLAUDE.md:455` — *"`bucket` … Mike's, **null on all 475 rows**"*
- `docs/canonical/OPERATIONS_ARCHIVE/ROUND-LOGS.md:491` — the same sentence

Both match `asset-null-bucket`. Both must move in the same commit.

**`--cull` is the wrong instrument.** Current orphans are **8 JUDGED + 5
UNJUDGED = 13**, and `--cull` throws away *all* unjudged orphans — it would take
`assetMissing` to **8**, not hold it at 13. Holding at 13 needs a targeted
prune of exactly the 64.

---

## ITEM 5 CITES AN INSTRUMENT ITEM 4 DEFERS

Item 5 says canon's Extent cell is *"sourced to `--count`"*. Item 4 says
`--count` **is not this packet** — it is a robots-repo change, reported not
made. So canon would publish a citation to a flag that does not exist, which is
the hazard this repo already has a rule for (*a launcher must not draw a link to
a file that is not on disk*) and Doctrine 12's shape.

**Proposed resolution, one line, preserves the ruling's substance:** cite the
mechanism that exists and is reproducible today — the generator's two-pass
`layout()`, `len(doc.pages)` — and swap the citation to `--count` when the flag
lands. The ruling's point is *source it to the pagination, not to a summary line
that never carried a page number*, and this does that.

---

## WHAT LANDS CLEAN

- **Item 2** — repoint `measure.manualPages()` at the robots source, guarded.
  Fixes the ENOENT crash and the two-functions-one-name problem in one edit, and
  is worth doing **whether or not item 1 goes ahead**.
- **Item 6** — flag M2 and `portal.js:65` with the measurement. Nothing else
  reads those sentences; no gate is involved.
- **Item 5**, with the citation above.

---

## THE QUESTIONS

**1. The 64 files — which?**

- **A. Hold.** Fix the count (items 2, 5, 6) and leave the payload alone until
  after the 30 August launch. Nothing about the 118 MB is urgent; it is
  unreferenced by any visitor surface either way.
- **B. Delete, and repoint SUNDAY step 18 at a held file that will still
  exist** — `/held/robots/art/mgk-viiip-cover.png` or one of the audio files —
  plus a ruling on what happens to the two shorts recipes.
- **C. Delete only the three `tuning/compare-*.png` Ops diagnostics** (2,269,906
  bytes), which no recipe and no procedure names, and hold the 61 pages.

**2. If B — the two saved shorts recipes: repoint at the robots source
(changing what the teaser renders), or let them break and flag them?**

**3. Item 5's citation — the two-pass `layout()` as proposed, or wait for
`--count` and leave canon at 61 until then?**

---

## NOT THIS PACKET, REPORTED AS ASKED

**The generator's `--count` flag (robots repo).** Two-pass `layout()`, print
`len(doc.pages)`, render nothing. Verified achievable today: with `open` and
`os.makedirs/remove/rename` patched to raise, `layout(None)` → **55 pages**,
`layout(lists)` → **63**, against **63** PNGs on disk. The two-pass shape is not
optional — one pass reports 55. The argument against using a full run is the
generator's own `--marked-only` comment: *"A full run rewrites 120 MB of them to
produce one new page, and any drift in an encoder between then and now would
land as a silent change to a master the museum has already shown."*

**The robots master `front_screen.png`.** Still the upside-down original;
everything downstream of `reference/photos/front_screen.png` in that repo
consumes it.
