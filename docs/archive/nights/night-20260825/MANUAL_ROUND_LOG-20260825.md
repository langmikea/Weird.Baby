# ROUND LOG — THE COUNT REPOINTED, THE DOOR CHECK FIXED

**2026-08-25 · museum repo · applied, verified, NOT committed** (§0 MIKE IS THE
LOCK). Started clean at `5d6320a`.

Ops ruled A: **hold the 64 files.** Four things applied — items 2, 5, 6 and
item 3's step-18 fix. **The delete and the row prune were NOT applied**, and
§0's held-cost pair does not move.

---

## GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 8 warnings = baseline, zero new** |
| `npm run build` | **green**, built in 744ms |
| `npm run provenance:gate` | **PASS** (exit 0) |
| `npm run reveal:check` | **PASS** (exit 0) |
| `npm run parity:gate` | **PASS** — 4 shared · 0 divergences |
| `npm run instory:gate` | **PASS** — 0 findings |
| `npm run docs:numbers:gate` | **PASS** (exit 0) |
| the lap | **NOT RUN** — see below |

**THE LAP WAS NOT RUN, AND THE REASON IS MEASURED RATHER THAN ASSUMED.** The
only change under `src/` is ten lines **inside an existing block comment** in
`portal.js` — confirmed from the diff, every added line between the same
`/* */`. The build strips it: grepping `dist/client/assets/` for the flag's own
text returns nothing. No visitor-facing string, layout, style or asset moved, so
the lap has nothing it could see. **Said plainly rather than quietly skipped.**

---

## WHAT CHANGED

```
docs/OPEN_ACTIONS.md        E-b's count 61 -> 63; M2 flagged, still OPEN
docs/OPEN_ACTIONS.html      regenerated
docs/SUNDAY-20260830.md     step 18's claim corrected; the other half added to 19
docs/canon/07-MANUAL.md     Extent cell 61 -> 63, re-sourced
docs/canon/07-MANUAL.html   regenerated
docs/OPS_DESK.html          regenerated (mtime churn only)
src/data/artists/portal.js  M2 flag, block comment only
tools/numbers-gate.mjs      measure.manualPages repointed + guarded
```

## 1 — `measure.manualPages()` REPOINTED AND GUARDED

**`tools/numbers-gate.mjs` now calls `reveal/schema.mjs`'s `manualPages()`
instead of deriving a second answer beside it.** There were two functions of
that name in one repo — schema's counting the robots source (63) and the gate's
counting `public/held/robots/manual` (61) — and the gate compared its 61 against
a published 61 and printed PASS.

**The finding is the PASS, not the staleness.** Both halves were stale in the
same direction, so they cancelled. A check whose two failure modes cancel is
worse than one pointed at nothing: an inert check is visibly inert, and this one
published a verdict.

**AND IT IS GUARDED NOW, WHICH IT WAS NOT.** The old body was a bare
`readdirSync` with no `existsSync` anywhere in the file, called unconditionally
in the summary as well as inside the rule — a missing directory killed the gate
with ENOENT rather than reporting a fault. It returns `null` when the robots
tree is unreachable, and the runner's existing `!measured` branch names it in
`skipped`.

**PROVED, NOT ASSERTED:**

```
state today            : ok
wrapper, real state    : 63
wrapper, no-robots     : null
wrapper, no-source     : null
runner, source ok      : compared: 63
runner, source missing : SKIPPED (named in skipped[])
```

**The limit of that proof, named:** it exercises the wrapper expression and the
runner's branch verbatim, not a live run with the robots repo physically absent
— which would mean moving the other repo.

`docs:numbers` now prints **`manual pages 63 (robots source)`** and checks
**11 published claims in 8 documents**. It is comparing something real for the
first time.

## 2 — `OPEN_ACTIONS` ROW E-b

*"The manual is 61 pages of structure"* → **63**, with the correction marked in
place so it cannot read next year as Mike's own sentence.

**Why this is not the thing `OPEN_ACTIONS`' own note forbids.** That note says
*"Counts inside a row's question are REPORTED, NEVER CORRECTED: editing them
edits the sentence Mike is being asked to rule on."* E-b's count sits in
***Known:***, the factual context — his question is *"the examples, or one word
that the two lines stand as they are, or a rewrite of them"*, and it is
untouched. **Flagged here because the distinction is fine and a later round
should be able to check the reasoning rather than the outcome.**

## 3 — CANON'S EXTENT CELL

**61 → 63**, sourced to the generator's own pagination — the two-pass
`layout()`, `len(doc.pages)` — **not to `--count`, which does not exist yet.**
Citing a flag nobody has built is the defect this packet exists to fix, and the
repo already has the rule (*a launcher must not draw a link to a file that is
not on disk*).

The cell now records what the defect actually was: the generator prints one
summary line, **that line has no page count in it**, the six numbers here are
that line and were never wrong, and "61 pages" was prepended from elsewhere and
went stale on 2026-08-19. It also records that counting "off `BODY`" cannot see
`BODY_7_19`, `BODY_7_14` or `BODY_B_1`, which sit outside that array.

**Two numbers left unchased and recorded rather than ruled:** the generator
prints `tabs + 1` = 31 where canon says 30 *reserved* tables, and the older
build log says 107 / 31 / 93. Whether "reserved" excludes the +1 is a definition
nobody has settled.

## 4 — M2 AND `portal.js`

Both flagged with the measurement. **M2 stays OPEN — it is Mike's.**

The plate is **rotated 180°, not mirrored**, and M2's prescribed horizontal flip
does not fix it. Established 2026-08-11 by applying the flip and looking
(`MUSEUM_RED_NOTES_LOG-20260811.md` §B3), re-measured today: `rot180` **True**,
`flip horizontal` **False**, identical pixel histogram, and the museum's
pre-edit blob `a0800856…` is byte-identical to the robots master as it stands.

**What is still open is the ROBOTS master**, not the museum's file.
`portal.js`'s flag also says the paragraph's *conclusion* survives — the
lettering is unreadable either way, which is the whole of why that badge was
rejected.

## 5 — SUNDAY STEP 18

**Ops' premise was half right, and the half that was wrong matters, so it is
recorded rather than quietly corrected.**

Ops said a 404 *"proves the prefix is routed and nothing else."* **It proves
more than that.** The worker refuses `/held/*` by prefix before it looks for a
file, so a 404 proves three things jointly: the request reached **this** worker
first for that prefix, the built worker's stage is **launch**, and `heldOpen()`
refused a request with no key. A `200` means one of those three failed — which
is the leak the step exists to catch, and it does catch it.

**What it genuinely cannot prove is that anything is behind the address.** A
path with no file answers the same 404 from the same line. Today the file is
present, so the ambiguity is latent — but the probe carries no evidence of that,
and §0's HAZARD block already records the identical failure biting `/api/held`,
which probes a path the Portal ruling moved out of held and so reports
`served:false` on a healthy deployment.

**Can it be distinguished from outside? Only by opening the door.** From a
stranger's position the two states are indistinguishable — same status, same
9-byte body, no header separates them. With the key they separate cleanly, and
**the procedure already mints the cookie at step 19**, so the fix costs one line
and no extra key entry:

- step 18 keeps the 404 check, with its claim narrowed to what it proves and a
  pointer forward;
- step 19 gains, before its cleanup, a second shot at **the same address** with
  the jar it already created: **`200 image/png` and a size in the millions** =
  the door is shut *on something that is really there*; **`404`** = the address
  is empty and step 18 proved nothing tonight — repoint the probe, **not a
  rollback**; **`200` at about 9 bytes** = the refusal body arriving with a 200.

**It is written so 18 alone is still the rollback trigger** if the night is
short.

---

## THE HELD-COST PAIR — FIVE SITES, ONE GATED, FOR THE NEXT ROUND

Nothing was deleted, so **the pair does not move**. Recorded because the next
round that does delete will need all five:

| site | gated? |
|---|---|
| `docs/canonical/OPERATIONS.md:134` | **yes** — `held-cost`, `near: /publicly readable/i` |
| `src/worker.js:545` — *"`/held/*` is 137 files and 186,888,028 bytes"* | **no** — source comment |
| `tools/numbers-gate.mjs:158` — the gate's own header quoting §0 | **no** |
| `docs/opsday-20260822/ANSWER_KEY.md:77` | **no** — a past day's record |
| `docs/opsday-20260822/DEPLOY_GROUND_TRUTH.md:275, 330, 431, 543` | **no** — same |

**And the row prune has a second gated consequence:** removing 64 rows takes the
asset table **475 → 411**, breaking `CLAUDE.md:455` and
`OPERATIONS_ARCHIVE/ROUND-LOGS.md:491` (*"null on all 475 rows"*), both matched
by `asset-null-bucket`. **`--cull` is the wrong instrument** — orphans are 8
judged + 5 unjudged, and it drops all unjudged, taking `assetMissing` to 8
rather than holding it at 13.

## NOT THIS PACKET — BOTH ROBOTS-REPO, REPORTED

1. **`--count` on the manual generator.** Two-pass `layout()`, print
   `len(doc.pages)`, render nothing. Verified achievable with writes blocked:
   `layout(None)` → 55, `layout(lists)` → **63**, against 63 PNGs on disk. The
   two-pass shape is not optional — one pass reports 55. The argument against a
   full run is the generator's own `--marked-only` comment: *"A full run
   rewrites 120 MB of them to produce one new page."* When it lands, canon's
   citation becomes a one-word change.
2. **The robots master `front_screen.png`** — still the uncorrected original.

## STILL HELD, BY RULING

The 64 files under `public/held/robots/manual/` stay until after the
30 August launch. Doctrine 27 caught the premise: `role: unreferenced` answers
the *displaying* question only, and six things build from those files —
including `SUNDAY-20260830.md` itself.
