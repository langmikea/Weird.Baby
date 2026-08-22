# DEPLOY — THE REMAINDER (2026-08-22)

Brief: DEPLOY, THE REMAINDER. Execution round. Ops did not commit, push or deploy.

## 0. WAITING ON MIKE

Nothing in Tasks 1–3. Three flagged items in §4 are OUTSIDE this brief's write
scope and are left un-actioned by rule, not by oversight.

## 1. FILES CHANGED (4)

| file | change |
|---|---|
| `STATE.md` (museum) | 3 live-procedure deploy forms → pointer |
| `STATE.md` (robots) | 2 archive occurrences → `[superseded — see §0 DEPLOY]` |
| `docs/canonical/OPERATIONS.md` | §5 THE STAGE row gains `tools/deploy-guard.mjs` |
| `tools/numbers-gate.mjs` | `measure.heldCost()` + `held-cost` check + report line |

**STATE.md is at repo ROOT in both repos, not `docs/canonical/`.** The brief's
paths were adjusted; `docs/canonical/STATE.md` does not exist in either repo.

## 2. TASK 1 — THE THREE NAMED LINES, AND TWO THE BRIEF DID NOT NAME

### Pointer applied (live procedure) — museum STATE.md, edited bottom-up

- **:2743** — `Build: npx vite build. Deploy: npx wrangler deploy.`
  → `Build: npx vite build. See OPERATIONS.md §0 DEPLOY — THE ONLY ACCOUNT.`
- **:2719** — rule 6 Durability, `npm run build && npx wrangler deploy`
  → `deployed. See OPERATIONS.md §0 DEPLOY — THE ONLY ACCOUNT.`
- **:291** (NOT IN THE BRIEF) — Doctrine 26 mirror, `Mirror and deploy: npm run deploy.`
  → follows the precedent already set at OPERATIONS.md:2017–2019, which shortened
  the same quoted report line and pointed at §0.

Both :2719 and :2743 sit BELOW the `END LIVE LEDGER` fence at :2670–2672
("Durable reference (pre-2026-06-17) follows"). That fence does not make them
archive: they are present-tense prescriptive reference ("Deploy: X", "Work isn't
done until…"), not a record of what was true on a day. Pointer, per the brief.

### Archive marker applied — robots STATE.md, edited bottom-up

**BOTH robots occurrences are archive, including the one the brief called LIVE
PROCEDURE.** The archive exception the brief supplied is what settles it.

- **:1236** — inside `TWIN-ONLINE COMBINED SHIFT 2026-07-23 (§D rulings recorded
  above; voice excavated; museum build STAGED — nothing shipped)`, header at
  :1207. A dated shift entry. Marker appended.
- **:2492** (NOT IN THE BRIEF; found only by the multiline pattern) — inside
  `MILESTONE 6 — THE EXHIBIT BUILD 2026-07-24 (museum repo, STAGED ONLY, zero
  deploys…)`, header at :2471. Marker appended.

Neither line was rewritten. Marker text exactly: `[superseded — see §0 DEPLOY]`

## 3. THE SWEEP — THE PATTERN, NOT ONLY ITS RESULT

`scratchpad/sweep2.mjs`, run over **every tracked file in both repos**
(`git ls-files`, binaries skipped by a NUL probe), whole-file regex so `\s` spans
newlines:

```js
const GAP = String.raw`[\s\\>|*#\-]*`;   // whitespace, markdown continuation, bullets
'npm-run-deploy'  : new RegExp(`npm${GAP}run${GAP}deploy[\w:-]{0,12}`, 'gi')
'wrangler-deploy' : new RegExp(`wrangler${GAP}deploy[\w:.-]{0,20}`, 'gi')
'npx-wrangler'    : new RegExp(`npx${GAP}wrangler[\w:.\- ]{0,20}`, 'gi')
```

The trailing capture is what separates the canonical `deploy:launch` from a bare
`deploy` — the first sweep, which stopped at `deploy`, could not tell them apart.

**RAW TOTALS: 150 occurrences across 57 files.**
Classified: **58 BARE** · **73 DIRECT-WRANGLER** · **19 launch-ok** (`deploy:launch`).

### The four MULTILINE hits — the class single-line greps miss

```
.        docs/DEPLOY_RUN_REPORT-20260523-144857.md  55    "npm run\ndeploy"
.        reveal/day.mjs                             115   "npm run\r\n   deploy"
.        reveal/stage.mjs                           33    "npm run\n   deploy"   (deploy:launch — clean)
robots   STATE.md                                   2491  "npm run\ndeploy"      <- ACTED ON
```

`OPERATIONS.md:1276` — the line-split form the brief cited — **is not a deploy
form today.** That line now reads `**[v53 2026-08-05] THE THIRD PARTIES THIS SITE
TOUCHES…`. The manifest moved, as the brief predicted.

### `npx wrangler` is NOT `npx wrangler deploy`

Most DIRECT-WRANGLER hits are `wrangler secret put HR_KEY` / `RECORD_KEY`
(OPERATIONS.md:1236, OPEN_ACTIONS.md:72/168, register.json ×3) and
`wrangler d1 export|execute|time travel` (backups/README.md ×7). **None publish
the worker**, so none goes around the deploy guard in the sense §0 warns about.
Reported, not marked. The pattern over-matched here by design — a narrower one
would have missed a real `npx wrangler deploy`, which is how :25 below surfaced.

### 41 files: dated logs / run reports / handoffs — NOTHING DONE

A recorded measurement is history and must never be rewritten. These carry no
live procedure and no marker is warranted; marking 41 archives would be noise.
Named in full in `scratchpad/sweep2.txt`.

### CODE that implements or describes the deploy — NOTHING DONE

`package.json` (the scripts themselves), `tools/deploy-guard.mjs` (excluded by
the brief), `tools/stage-build.mjs`, `reveal/day.mjs`, `reveal/stage.mjs`,
`src/worker.js`, `tools/lap.mjs`, `tools/ops-desk.mjs`, `tools/serve-mock.mjs`,
`tools/backup-guestbook.ps1`, `tools/rwth_album_mvwrite.py`,
`src/routes/WbAdmin.jsx`. A script that IS the mechanism is not prose printing a
procedure.

## 4. FLAGGED — LIVE DEPLOY FORMS OUTSIDE THIS BRIEF'S WRITE SCOPE

Not touched. The brief's WRITE list is four files and its rule is "do not resolve
anything this brief did not rule."

| file:line | form | note |
|---|---|---|
| `CLAUDE.md:180` | `npm run deploy` | "THE FLOW IS NOW ONE STEP" — live |
| `CLAUDE.md:206` | `npm run deploy` | "To publish today" step 1 — live |
| `CLAUDE.md:443` | `npm run deploy` | live prose |
| `CLAUDE.md:508` | `npm run deploy` | live prose |
| `CLAUDE.md:734` | `npm run deploy` | **the same Doctrine 26 mirror fixed at STATE.md:291** |
| `docs/OPEN_ACTIONS.md:243` | `npm run deploy` | row R-a; live by Doctrine 24 |
| `docs/START_HERE-20260612.md:25` | `npx wrangler@4.81.1 deploy` | **a direct wrangler publish, guard-bypassing, in a START_HERE** |

CLAUDE.md:956 and :1000 are inside `## Recent session log` (history from :762) —
archive, correctly left.

**START_HERE-20260612.md:25 is the sharpest of these**: it is the one live
document that prints a form reaching wrangler directly, which is exactly what
§0's "WHAT GOES AROUND THE GUARD" forbids.

## 5. TASK 2 — THE FILE MAP NAMES THE GUARD

`docs/canonical/OPERATIONS.md` §5 THE STAGE row, appended to the caller chain
after `tools/stage-build.mjs`, in the row's existing `·`-separated form:

> `tools/deploy-guard.mjs` (the refusal that stops a wrong-stage publish: it
> reads `__WB_STAGE__` back out of the built worker and exits 1 when that is not
> the stage the deploy asked for).

Verified it is genuinely a stage caller before describing it as one: it imports
`{ DEVELOPMENT, LAUNCH }` from `reveal/stage.mjs` at `tools/deploy-guard.mjs:37`
and reads `__WB_STAGE__` out of `dist/weird_baby/index.js`. Seventh caller; the
row listed six. One row changed, nothing else in §5.

## 6. TASK 3 — THE TWO NUMBERS GET A PRODUCER

`tools/numbers-gate.mjs`:

- `measure.heldCost()` — recursive walk of `public/held`, returns `{files, bytes}`.
  No extension filter: a file behind the door is exposed whatever it is called,
  and a filter is how a count starts disagreeing with the door.
- check `held-cost` — one check, two capture groups (the `lint-baseline` shape,
  since both numbers sit in one sentence). `near: /publicly readable/i` anchors
  on the phrase, not the digits, so the same figures in a round log cannot match.
- a `held behind the door` line in the measured-tonight report block.

**The definition is §0's own** (`OPERATIONS.md:1073–1074`): files behind the door
and present under `public/held`. It reproduces both canon numbers exactly.

### THE THREE RUNS

**RUN 1 — passing as the tree stands** (`npm run docs:numbers:gate`, real repo):

```
    held behind the door 137 files (186,888,028 bytes)
  11 published claim(s) checked in 4 document(s)
PASS — every standing value published in the governing documents
matches what the repository actually holds.
EXIT: 0
```

(10 claims before this round; the 11th is the new one.)

**RUN 2 — FAILING.** Perturbed in a SCRATCH COPY, never the real manual: a
scratch repo root at `scratchpad/gatetest/` with the four read documents copied
and `public` / `provenance` / `reveal` / `src` / `node_modules` as NTFS
junctions. Control first — the unperturbed scratch produces **0** `held-cost`
findings (its 2 findings are lint 0/0, harness noise from eslint inside a
junctioned root, constant across all three runs).

Both halves proved independently measured:

```
--- file count perturbed 137 -> 136 ---
  docs/canonical/OPERATIONS.md:1056
    the launch door's cost — the files behind it and their byte total (§0 DEPLOY)
    published  136 / 186888028
    measured   137 / 186888028
    | - **136 files (186,888,028 bytes)** become publicly readable.
EXIT: 1

--- byte total perturbed 186,888,028 -> 186,888,999 ---
  docs/canonical/OPERATIONS.md:1056
    the launch door's cost — the files behind it and their byte total (§0 DEPLOY)
    published  137 / 186888999
    measured   137 / 186888028
    | - **137 files (186,888,999 bytes)** become publicly readable.
EXIT: 1
```

**RUN 3 — passing again.** Scratch manual restored and proved byte-identical to
the real one by sha256 (`0d267fe29a1263896288d012fee7c83b294587c9d414bd3fe5a648b33c1cc780`,
both files, one hash); `held-cost` findings back to **0**; junctions removed and
the real trees confirmed intact; the real gate re-run **PASS / EXIT 0**. The real
`OPERATIONS.md` diff for this round is one line and it is the Task 2 row.

## 7. GATES

lint **9 errors / 8 warnings = baseline** · `reveal:check` PASS ·
`instory:gate` PASS · `parity:gate` PASS · `docs:numbers:gate` PASS.

## 8. ONE THING A FUTURE SESSION SHOULD HOLD

`tools/numbers-gate.mjs` is **CRLF**; the two `STATE.md` files are **LF**. A patch
script that assumes `\n` silently matches nothing in the gate and reports a
missing anchor rather than a corruption. Anchor on single lines, or detect the
EOL — do not assume one.
