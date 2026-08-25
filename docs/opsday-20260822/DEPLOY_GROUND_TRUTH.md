# DEPLOY GROUND TRUTH — 2026-08-22

**Task:** measurement only. Nothing in either repo was changed. This file is the
only write.

**Repos read:** `C:\AI\Projects\weird-baby-museum` (HEAD `93417e7`),
`C:\AI\Projects\weird-baby-robots`.

**Evidence marking.** Every answer below is marked **RUN** (a command was
executed and its raw output is pasted) or **READ** (a file was read; no
behaviour observed). Nothing is marked RUN that was not run. Where an answer
could only be established by publishing, it is left **UNESTABLISHED** and says
so. No claim is reasoned across that gap.

**Nothing was deployed.** The only commands executed that touch the deploy path
are `node tools/deploy-guard.mjs` (imports `node:fs`, `node:path`, `node:url`,
`reveal/stage.mjs` only — no network, no child process: `tools/deploy-guard.mjs:32–35`),
`npm run reveal:day` without `--place` (its only writes, `fs.mkdirSync` /
`fs.renameSync` at `reveal/day.mjs:216–217`, sit inside `place()`, called only
under `if (PLACE)` at `:291`), and `--help` on wrangler.

---

## LEAD — the four things that change what happens next

1. **`npm run deploy` cannot publish. It refuses.** `tools/deploy-guard.mjs`
   sits between the build and `wrangler deploy` on **both** deploy scripts
   (`package.json:12–13`). RUN, three ways, below.
2. **The documented escape hatch does not reach the guard.** The guard prints
   `npm run deploy -- --i-know-this-publishes-development` (`:120`). RUN
   evidence below shows npm appends `--` args to the **last** command in an
   `&&` chain — so that flag lands on `wrangler deploy`, not on the guard. It
   fails **safe** (the guard still refuses, `&&` short-circuits, nothing
   uploads), but the printed instruction does not work as printed.
3. **Two unguarded publish paths exist and one of them is printed in the
   manual.** `OPERATIONS.md:1118` §2 instructs `npm run build && npx wrangler
   deploy` — which skips the guard entirely. A committed script,
   `docs/derived-era-WIP/derived_era_stage5_deploy.ps1:41,68`, does the same.
4. **The manual never mentions the guard.** Zero hits, four patterns, proved
   below. Its §5 file-map row for THE STAGE enumerates every other caller and
   omits `tools/deploy-guard.mjs`.

**A fifth, adjacent, flagged not ruled:** `src/worker.js:116`'s held-presence
probe points at `/held/robots/art/portal-cover.png`, and that file is no longer
under `public/held/` — Mike's Portal ruling moved it to the public address
today. The worker's own comment (`:107–110`) predicts this exact case and calls
it the safe failure direction. Detail in §F.

---

## A) THE GUARD

### A1. `tools/deploy-guard.mjs` — the only mechanism wired into a deploy command

**READ** — `package.json:12–13`:

```
deploy         = npm run build && node tools/deploy-guard.mjs && wrangler deploy
deploy:launch  = npm run build:launch && node tools/deploy-guard.mjs --launch && wrangler deploy
```

It refuses on **five** conditions. All five are `die()` → `console.error` +
`process.exit(1)` (`tools/deploy-guard.mjs:45–48`). There is no prompt and no
silent skip; every refusal is a non-zero exit that short-circuits the `&&`
chain, so `wrangler deploy` is never reached.

| # | line | refuses when | message opens |
|---|---|---|---|
| 1 | `:50–57` | `dist/weird_baby/index.js` does not exist | `deploy REFUSED — there is no built worker` |
| 2 | `:65–73` | the built worker states neither or both stages | `deploy REFUSED — …does not state one stage` |
| 3 | `:75–85` | built stage ≠ requested stage | `deploy REFUSED — the built worker is X and you asked to publish Y` |
| 4 | `:101–109` | `dist/` older than newest file in `src`/`public`/`reveal` | `deploy REFUSED — dist/ is older than the source` |
| 5 | `:111–125` | stage is development and not acknowledged | `deploy REFUSED — this publishes the DEVELOPMENT stage` |

**How it decides the built stage — READ, `:59–63`:** it regexes `"launch"` /
`"development"` out of `dist/weird_baby/index.js`, the artifact about to be
uploaded — not its own environment. The header (`:19–26`) gives the reason: the
project has already shipped a LAUNCH client with a DEVELOPMENT worker, and an
env-var check would have passed that build.

**RUN — three invocations, raw output:**

```
$ node tools/deploy-guard.mjs
deploy REFUSED — the built worker is LAUNCH and you asked to
publish DEVELOPMENT.

The client and the worker are built by two different vite environments and
have disagreed before. Nothing was uploaded.

      npm run build
exit=1

$ node tools/deploy-guard.mjs --launch
  deploy-guard OK — built worker is launch, and that is what you asked for.
exit=0

$ node tools/deploy-guard.mjs --i-know-this-publishes-development
deploy REFUSED — the built worker is LAUNCH and you asked to
publish DEVELOPMENT.
…
exit=1
```

Two facts fall out of that run. `dist/` on this tree is a **LAUNCH** build and
is **not stale** (condition 4 passed). And condition 5 could not be exercised
today, because condition 3 fires first — the acknowledgement branch is reached
only when the built worker is already development. **Condition 5 is READ only.**

### A2. What bypasses it

**RUN** — npm's `--` forwarding, probed in a scratch package outside both repos:

```
$ npm run a -- --i-know-this-publishes-development
> node echo.js FIRST && node echo.js SECOND --i-know-this-publishes-development
  [FIRST] argv tail: []
  [SECOND] argv tail: ["--i-know-this-publishes-development"]
```

npm appends `--` arguments to the **end of the whole script string**, i.e. to
the last command in the chain. Applied to `deploy` (READ, `package.json:12`),
`npm run deploy -- --i-know-this-publishes-development` expands to
`npm run build && node tools/deploy-guard.mjs && wrangler deploy --i-know-this-publishes-development`.
The guard receives no argv, `acknowledged` is false, it exits 1, and `&&`
prevents wrangler from running. **The documented bypass does not bypass; it
fails closed.**

The bypasses that do work are commands that never invoke the guard — §B.

### A3. Every other mechanism that constrains what reaches the live site

**Build-time, inside `vite build`** — these fail the build, so they do block a
deploy that goes through either npm script. **READ.**

| mechanism | path:line | refuses | how | stage |
|---|---|---|---|---|
| `held-chunk-guard` | `vite.config.js:389–404` | a locked/held module landing in a chunk outside `assets/locked/` or `assets/held/` | `this.error` in `generateBundle` | both (`:247`) |
| `wb-ops-braces` | `vite.config.js:443–487` | any `{ }` Ops-note in a string literal under `src/` | `this.error` in `buildStart` | **launch only** (`:447`) |
| `wb-ops-notes` | `vite.config.js:151–174` | (strips `[PAPA]`) errors on an unparseable file | `this.error` | — |
| `WB_STAGE` validation | `reveal/stage.mjs:83–92` | unknown stage value | `throw` | both |
| `tools/stage-build.mjs` | `:40–45` | — | spawns the CLI rather than vite's `build()` API, so both vite environments are built | launch |

**Request-time, in the worker** — these constrain what a visitor can fetch from
an already-published deployment. **READ.**

| door | path:line | refuses | how | stage-sensitive |
|---|---|---|---|---|
| PERMISSION | `src/worker.js:76`, `:278–283` | `/assets/locked/*`, `/locked/*` without cookie | plain `404` (not 403, `:272–273`) | **no — every stage** |
| STAGE | `src/worker.js:77`, `:284–289` | `/assets/held/*`, `/held/*` without cookie | plain `404` | **yes — only at launch** |
| RECORD CLOCK | `src/worker.js:312–315` | a file whose Record day has not come | plain `404` | partly (`wingOpenOn`, `:246–249`) |

All four prefixes reach the worker because `wrangler.jsonc:70–72` sets
`run_worker_first: ["/*"]`.

**Ignore / hold lists.** `.gitignore` (museum) has no deploy relevance beyond
`public/_lap.html:44` — the lap harness, which is why `npm run lap:clean`
exists. There is **no** `.assetsignore` and no `.wranglerignore` in either repo
— **RUN**: `find . -maxdepth 2 -name '.assetsignore' -o -name '.wranglerignore'`
returned nothing. `public/_routes.json` exists and excludes `/assets/*`, but it
is a Cloudflare **Pages** artifact and this project deploys as a **Worker**
(`wrangler.jsonc:8`, `"main": "src/worker.js"`); whether the platform reads it on
a Worker deployment is **UNESTABLISHED** here — it is recorded, not ruled.

### A4. What is NOT wired to a deploy — and this is the finding

**RUN**, both repos:

```
$ ls .git/hooks/ | grep -v '\.sample'     -> (museum: empty)
$ git config --get core.hooksPath          -> (unset, both repos)
$ ls .github/workflows                     -> NO .github/workflows (both repos)
```

The robots repo has four hooks (`post-checkout`, `post-commit`, `post-merge`,
`pre-push`) and **all four are stock git-lfs shims** — read in full, each is the
three-line `git lfs <hook> "$@"` wrapper. None touches deploy.

Therefore: **`provenance:gate`, `reveal:check`, `parity:gate`, `instory:gate`,
`docs:numbers`, `approve:check`, `assets:gate` and `lap:clean` are packet
discipline enforced by a human reading `OPERATIONS.md`. Not one of them runs on
a deploy, and nothing fails a deploy if they were skipped.** The only automatic
constraints on a publish are `deploy-guard.mjs` and the build-time vite plugins
in A3.

> **[CORRECTION 2026-08-25] TWO OF THOSE EIGHT ARE NOT PACKET DISCIPLINE AND
> `OPERATIONS.md` HAS NEVER NAMED ONE OF THEM.** The sentence above is right
> about the absence of automation and wrong about what fills the gap.
> **`approve:check` appears nowhere in `OPERATIONS.md` — nor in any archive cut,
> `CLAUDE.md`, `STATE.md`, `OPEN_ACTIONS.md` or `BACKLOG.md`** (searched
> 2026-08-25). No human reading OPERATIONS could have been enforcing it, because
> until today OPERATIONS did not know it existed. **It is red by design and was
> parked as a backlog item on 2026-08-17** (`c5b7943`); it now has a §5 row.
> **`assets:gate` is likewise not packet discipline** — Doctrine 15 says in as
> many words that it *"IS NOT A PACKET GATE AND MUST NOT BECOME ONE"*, and it
> has exited 1 continuously since it was built. **The six that ARE packet
> discipline, and are named in §9's list, are** `provenance:gate`,
> `reveal:check`, `parity:gate`, `instory:gate`, `docs:numbers` and the lap
> (`lap:clean` seals it). **Nothing else in this document is affected** — the
> hooks reading, the deploy commands and the guard are untouched and still
> stand.

---

## B) THE COMMANDS

Every command found that can put bytes on a live host.

| # | command | expands to | guard? | held files |
|---|---|---|---|---|
| 1 | `npm run deploy` | `npm run build && node tools/deploy-guard.mjs && wrangler deploy` | **YES** | would open the stage door — but it refuses |
| 2 | `npm run deploy:launch` | `npm run build:launch && node tools/deploy-guard.mjs --launch && wrangler deploy` | **YES** | uploads them; worker refuses them without the cookie |
| 3 | `npx wrangler deploy` | itself | **NO** | ships whatever `dist/` holds — no stage check, no staleness check |
| 4 | `pwsh docs/derived-era-WIP/derived_era_stage5_deploy.ps1` | `npm run build` … `npx wrangler deploy` (`:41`, `:68`) | **NO** | builds DEVELOPMENT and ships it |
| 5 | `npm run assets:r2:sync` | `node tools/sync-assets-to-r2.mjs` | **NO** | different host — see below |

**Source for 1–2:** `package.json:12–13`, printed verbatim by node. **READ.**

**3 — RUN**, `npx wrangler deploy --help`: *"🆙 Deploy a Worker to Cloudflare"*,
and it carries `--dry-run  Don't actually deploy`. Nothing in either repo hooks
it: **RUN**, `grep -rnE "wrangler deploy|npm run deploy" tools/ *.ps1 *.sh` —
every hit in `tools/` is prose inside a comment (`deploy-guard.mjs:8,9,15,119,120`,
`ops-desk.mjs:20`, `serve-mock.mjs:27`, `stage-build.mjs:20`,
`rwth_album_mvwrite.py:36`); no tool executes it. wrangler is **4.81.1** (RUN).

**4** is a tracked file (**RUN**: `git ls-files --error-unmatch` → TRACKED). It
removes `dist/`, runs plain `npm run build` (**development stage**), gates on a
typed `DEPLOY` at a `Read-Host` prompt (`:65`), then runs `npx wrangler deploy`
(`:68`). It predates the guard (dated 2026-07-07 in its own text; the guard
landed 2026-08-12) and was never updated. It is a working, committed, unguarded
development-deploy path.

**5 — READ.** `tools/sync-assets-to-r2.mjs:39` imports `PutObjectCommand`; it
uploads to the R2 bucket named by `R2_BUCKET` and records `R2_PUBLIC_URL`
(`.env` keys read, values not). It has `--dry-run` (`:24`). **It does not put
bytes on weird.baby**: **RUN**, `grep -rniE "r2\.dev|weird-baby-assets|R2_PUBLIC"
src/ reveal/ index.html provenance/` → zero hits, and
`grep -rn "sync-assets-to-r2-manifest" src/ reveal/` → zero hits. The manifest
exists on disk (`tools/sync-assets-to-r2-manifest.json`, 2026-06-12) and nothing
shipped reads it. So: it publishes to a public host, and no surface the museum
serves references that host. Both facts recorded; neither ruled.

**Not a publish — RUN**, `npx wrangler dev --help`: *"👂 Start a local server for
developing your Worker"*. `npm run preview` (`npm run build && wrangler dev`)
therefore does not publish.

**There are no `predeploy`/`postdeploy` npm lifecycle hooks** — **RUN**, node
over `package.json.scripts`; the only `pre*`-shaped key is the script literally
named `preview`, which npm would treat as a hook only for a script named `view`,
and no such script exists.

**Which one the guard protects:** 1 and 2 only. **Which it does not:** 3, 4, 5.

---

## C) THE COST

### The definition is itself a claim — so here are its sources

The tree's own definition of *held* is **a file under the stage-door prefix**.
`reveal/placement.mjs` exports `STAGE_PREFIX` and `GOVERNED_PREFIX`;
`reveal/day.mjs:132` composes them into `HELD_TREE = "public" + STAGE_PREFIX +
GOVERNED_PREFIX`, which resolves to `public/held/robots`. `day.mjs:168–197`
classifies every file under that tree as `HELD` unless an entry delivered it, it
is `SIGNAGE`, or it is `PUBLISHED_BY_RULING` (`:176–184`), and excludes exactly
one filename, `twin.html`, as `NOT_A_PICTURE` (`:138`). **READ.**

### Definition 1 — reachability (the difference the stage actually makes)

**137 files.** These are served to anybody in DEVELOPMENT and 404 without the
cookie at LAUNCH (`src/worker.js:284–289`).

**RUN — the instrument's own count:**

```
$ npm run reveal:day
  stage                 DEVELOPMENT
  record entries        5
  governed pictures     152
    public              15   (delivered by an entry, or signage)
    behind the door     137
    to place            0
    to pull back        0
  Nothing to move. The tree and the Record agree.
exit=0
```

**RUN — the tree, independently:**

```
$ find public/held -type f | wc -l       -> 137
$ du -sb public/held                     -> 186,888,028 bytes (178.2 MiB / 186.9 MB)
$ find dist/client/held -type f | wc -l  -> 137        # present in the LAUNCH dist
```

Breakdown (**RUN**):

```
robots/manual              61 files   120,346,035 b   (incl. tuning/ 3)
robots/audio               43 files    62,074,934 b   (SD-18 20, SD-20 18, SD-23 20, burps 3, 2 loose)
robots/art                  3 files     2,474,398 b
robots/reference            4 files     1,949,206 b   (photos 3, mgk-viii 1)
robots/twin                 2 files        25,683 b
robots/plates               1 file         17,772 b
by extension: 72 png, 43 wav, 20 mp3, 2 jpg
```

### Definition 2 — bytes uploaded

**The same 137 files are uploaded in BOTH stages**, so by this definition the
unguarded command costs **zero extra files**. The stage moves reachability, not
presence.

Source: the plugin that used to strip them, `wb-held-out-of-launch`, was
**removed on 2026-08-20** on Mike's ruling — *"Ship the held files and let the
worker refuse them. 190 MB per deploy is the honest cost of a door that works."*
(`vite.config.js:324–331`). **Proved absent — RUN**:
`grep -rn "heldOutOfLaunch" --exclude-dir=node_modules --exclude-dir=.git .`
returns exactly two hits, both prose in comments recording the removal
(`src/worker.js:307`, `vite.config.js:2`). No plugin by that name exists.
Corroborated by the measurement above: `dist/` is a LAUNCH build (guard, RUN)
and holds all 137.

**Caveat, stated rather than reasoned past:** I did not build the development
stage — doing so writes `dist/`, which is outside this brief — so the
development `dist/` file count is **UNESTABLISHED**. The launch `dist/` holds
**221** files total (**RUN**). Chunk names and contents differ between stages
(`wb-placement` resolves address literals at `enforce:"pre"`), so I do not claim
the two dists are file-for-file identical.

### Definition 3 — "photographs", the word the manual uses

No current subdivision of the tree yields either published figure.

- all held files: **137**
- held, excluding `manual/` and `audio/`: **10** (**RUN**, listed: 3 art, 1
  plate, 3 reference photos, 1 mgk-viii row, 2 twin renders)
- held `.png` + `.jpg`: **74**

**26 and 16 both fail against every one of these.** See §D for where each figure
is printed.

### Two defensible numbers, neither ruled

| definition | number | what it means |
|---|---|---|
| files that become publicly readable that would otherwise 404 | **137** (186,888,028 bytes) | Definition 1 |
| additional files uploaded | **0** | Definition 2 — they ship either way since 2026-08-20 |

Both are true of the same command. Ruling which one "the cost" means is Ops'.

---

## D) EVERY ACCOUNT IN THE MANUAL

`docs/canonical/OPERATIONS.md`, **2555 lines** (RUN, `wc -l`).

### D1 — the deploy command

**Search commands and raw counts (RUN):**

```
$ grep -c "npm run deploy" docs/canonical/OPERATIONS.md              -> 6   (lines)
$ grep -oE "npm run deploy(:launch)?" … | wc -l                      -> 7   (occurrences)
$ grep -oE "npm run deploy(:launch)?|npx wrangler deploy" … | wc -l  -> 8   (occurrences)
$ grep -c "wrangler deploy" …                                        -> 1
```

The first pattern **misses §2**, which is the most consequential hit — it is
written `npm run build && npx wrangler deploy`. A narrow grep here returns a
wrong answer.

**All 8 occurrences, 7 lines, 6 locations:**

| line | section | form | what it asserts |
|---|---|---|---|
| 1028 | §0 › MIKE IS THE LOCK | `npm run deploy:launch` | command form — **correct**, and explicitly forbids the plain form |
| **1118** | **§2 The three surfaces** | **`npm run build && npx wrangler deploy`** | **command form — this is the unguarded path (B#3), printed as the manual procedure** |
| 1213 | §5 THE OPS INSTRUMENTS row | `npm run deploy` | publish risk of `public/` |
| 1219 | §5 THE DAY'S STEP row | `npm run deploy` **and** `npm run deploy:launch` | command form **and** cost figure |
| 1975 | §7 Doctrine 26 | `npm run deploy` | command form — the model closing line for every report |
| 2259 | §8 (serve-mock hazard) | `npm run deploy` | publish risk of `public/` |
| 2447 | §9 Session-close ritual | `npm run deploy` | publish risk of `public/` |

Verbatim, the four that assert a command form:

- **1028** — `**DEPLOY IS ALWAYS ` + "`npm run deploy:launch`" + `.** Never plain `deploy` — that builds` / `the DEVELOPMENT stage and would publish everything behind the stage door. It has` / `been written short five times and caught five times; the sixth time nobody` / `catches it is the whole reason this line is here.`
- **1118** — `- There is no CI. Deploy is manual: ` + "`npm run build && npx wrangler deploy`" + `,`
- **1219** — `In DEVELOPMENT the whole plan is moot: everything PLACED renders and ` + "`npm run deploy`" + ` publishes the Portal and the sixteen held photographs. **The performance is ` + "`npm run deploy:launch`" + `, and the day it starts, `DEFAULT_STAGE` moves — which is Mike's word, not an inference.**`
- **1975** — `*"Nothing here needs you. Mirror and deploy: ` + "`npm run deploy`" + `."* is a` / `complete report.`

**Testing the prior report's claim.** It said **four** accounts, at **§0, §2, §5,
Doctrine 26**.

- The four it named are all real. §2 is real and my first grep missed it; the
  prior report had it right.
- **The count is wrong.** There are **six locations**, not four — **§8 (2259)
  and §9 (2447) were missed** — across **seven lines** and **eight
  occurrences**, because **§5 carries two separate lines (1213 and 1219)**, and
  1219 carries two forms.
- Stated plainly: **the real count is six, not four.**

### D2 — the cost

**Search commands and raw counts (RUN):**

```
$ grep -c "twenty-six" …            -> 6 lines
$ grep -c "sixteen" …               -> 7 lines
$ grep -noE "twenty-six [a-z]+|sixteen [a-z]+ ?[a-z]*" …   (full list below)
$ grep -c "190 MB" …                -> 0
$ grep -c "144 file" …              -> 0
$ grep -c "137" …                   -> 0
```

Full occurrence list with line numbers (RUN), classified:

| line | text | is it a deploy-cost figure? |
|---|---|---|
| 317 | `sixteen photographs` | **no** — the preview build copying `public/held/` into `docs/` |
| 595 | `twenty-six photographs` | **YES** — *"a deploy publishes the Portal and the twenty-six photographs"* |
| 603 | `twenty-six withheld` | no — count of address literals the first launch build carried |
| 705, 706 | `twenty-six instructions` / `answered` | no — unrelated |
| 816 | `sixteen only once` | no — Facebook plugin frames |
| 937 | `sixteen times across` | no — unrelated |
| 1192 | `twenty-six photographs` | **YES** — §5 THE STAGE row: *"a deploy publishes the Portal and the twenty-six photographs to anybody who visits weird.baby"* |
| 1192 | `twenty-six public` | no — address literals again |
| 1219 | `sixteen held photographs` | **YES** — §5 THE DAY'S STEP row |
| 1226 | `sixteen photographs` | **no** — §5 LIVE PREVIEW row, the `publicDir:false` trap |
| 1243 | `sixteen plugin frames` | no — Facebook |
| 2118 | `twenty-six photographs` | **borderline** — §8 two-addresses hazard, describing what `usedBy` would have misreported |

**Testing the prior report's claim of two cost accounts (26 and 16):** the two
*figures* are right. The account count is not two — there are **three
deploy-cost assertions** (595, 1192, 1219) plus a fourth borderline mention
(2118), and the same two numerals appear **five more times** meaning something
else entirely. A reader grepping `sixteen` gets 7 lines of which **one** is the
cost.

**Both figures are wrong against the tree.** Measured today: **137**. Neither 26
nor 16 matches the total, the non-manual/non-audio subset (10), or the image
subset (74). **Recorded as a conflict, not resolved** — the manual says 26 in
two places and 16 in one; the tree says 137; I do not rule which the manual
meant.

**`190 MB` — the figure Mike's own ruling uses (`vite.config.js:325`) — appears
ZERO times in `OPERATIONS.md`** (RUN, `grep -c "190 MB"` → 0). Measured today the
held tree is 186,888,028 bytes.

### D3 — the rest of `docs/`

**RUN:** `grep -rnoE "npm run deploy(:launch)?|npx wrangler deploy" docs/`,
excluding `docs/canonical/OPERATIONS.md`:

```
TOTAL occurrences: 48
  37  npm run deploy
   6  npm run deploy:launch
   5  npx wrangler deploy
across 30 files
```

Top files: `DEPLOY_RUN_REPORT-20260523-144857.md` (5),
`opsday-20260822/ANSWER_KEY.md` (4),
`EXHIBIT_BACKFILL_DEPLOY_RUN_REPORT-20260525-103322.md` (4),
`derived-era-WIP/derived_era_stage5_deploy.ps1` (2 — and this one is
**executable**, §B#4), then 26 files with 1–2 each.

**37 of the 48 are the bare `npm run deploy` form.** Most are historical run
logs, where the command was correct on its date. `docs/OPEN_ACTIONS.md` and
`docs/OPEN_ACTIONS.html` each carry one — those are live registers, not history.

### D4 — the robots repo

**RUN:** `grep -rnoE "npm run deploy(:launch)?|npx wrangler deploy|wrangler deploy" . --exclude-dir=.git`

```
./docs/BACKLOG-1Q-20260722.md:90    npm run deploy
./docs/WEB_INVENTORY-20260723.md:18 npm run deploy
./STATE.md:1236                     npm run deploy
TOTAL: 3
```

Verbatim:

- `BACKLOG-1Q:90` — `5. **Admin update path:** how do twin builds ship (manual copy vs museum-style ` + "`npm run deploy`" + ` lane)?`
- `WEB_INVENTORY:18` — `| Deploy ritual | documented (D7 copy line + museum commit + ` + "`npm run deploy`" + `) |`
- `STATE.md:1236` — `3. Commit museum-side, then ` + "`npm run deploy`" + ` (build + wrangler). The robots-repo commit ritual is unchanged and separate.`

**All three print the bare form. Zero mentions of `deploy:launch` in the robots
repo.** The third is a live procedure in `STATE.md`, not a historical log.

**Cost figures in robots — RUN:**
`grep -rniEo "twenty-six photographs|sixteen held photographs|190 ?MB"` returns
three `190 MB` hits (`docs/BULLPEN-all-personas-20260718.md:163`,
`docs/canonical/LINEAGE.md:110`, `docs/MGK_DISCOVERY_REPORT-20260713.md:39`) and
**they are unrelated** — read in context, all three are the size of the
`Weird.Baby\OPAs\` faceplate-art folder. Coincidence, not a deploy figure.

---

## E) THE SILENCE

**Does `OPERATIONS.md` mention the guard, by name, path, or behaviour?**

**RUN:**

```
$ grep -ic "deploy-guard"           docs/canonical/OPERATIONS.md  -> 0
$ grep -ic "deploy guard"           docs/canonical/OPERATIONS.md  -> 0
$ grep -ic "i-know-this-publishes"  docs/canonical/OPERATIONS.md  -> 0
$ grep -ic "DEPLOY_GUARD"           docs/canonical/OPERATIONS.md  -> 0
$ grep -ic "stage-build"            docs/canonical/OPERATIONS.md  -> 2   (lines 1192, 2117)
```

**The answer is no — zero, on all four patterns.**

The two `stage-build` hits are a **different tool** (`tools/stage-build.mjs`,
the `--launch` build wrapper), and one of them makes the silence exact. `:1192`
is §5's file-map row for **THE STAGE**, which enumerates the mechanism's callers:

> `reveal/stage.mjs` (the declaration and the ruling) · `reveal/placement.mjs`
> (`placeRule`, pure) · `src/lib/placement.js` (the runtime caller) · the
> `wb-placement` plugin + the `__WB_STAGE__` / `__WB_PLACEMENT__` defines in
> `vite.config.js` (the build caller) · `reveal/reachability.mjs` check 9 (the
> gate caller) · `tools/stage-build.mjs` (`npm run build:launch` / `deploy:launch`).

Six callers named. `tools/deploy-guard.mjs` — the thing that actually stops a
wrong-stage publish — is not among them.

**And the manual's live text contradicts the guard in two places.** §0:1028 says
plain `deploy` *"would publish everything behind the stage door"* — since
2026-08-12 it does not; it refuses. §2:1118 gives a procedure that routes around
the guard. Both are recorded here as accounts; neither is corrected.

**For completeness (outside E's scope, offered as data):** `grep -rniE
"deploy-guard|i-know-this-publishes"` across the robots repo returns **zero**.
`CLAUDE.md`'s Release-flow section says *"To publish today: 1. `npm run deploy`"*
— also unaware of the guard.

---

## F) THINGS IN THE BRIEF THAT TURNED OUT WRONG, AND CONFLICTS RECORDED UNRULED

**1. Nothing in the brief was impossible.** No line needed to be stopped on. Two
tasks had a limit worth naming: condition 5 of the guard (§A1) and the
development `dist/` file count (§C Definition 2) can only be established by
building or publishing, and both are left unestablished rather than inferred.

**2. The prior report's account count is wrong — six, not four** (§D1). Its four
named sections are all real; §8 and §9 were missed and §5 is two lines.

**3. The prior report's bypass claim needs correcting.** `ANSWER_KEY.md:72`
calls `npm run deploy -- --i-know-this-publishes-development` *"the documented
way through"*. **RUN evidence (§A2) shows the flag never reaches the guard.** As
written today there is no working way to complete `npm run deploy`; the ways
through are `npx wrangler deploy` and the `.ps1`. This is a correction to a
claim, not a leak — the failure is closed.

**4. `ANSWER_KEY.md`'s 137 files / 186,888,028 bytes is confirmed** —
independently re-measured today, same numbers.

**5. Two accounts of the held-file cost, both recorded, neither ruled** (§C).
137 files reachable vs 0 additional files uploaded. Both follow from the
2026-08-20 ruling.

**6. FLAGGED, adjacent, not ruled — the held-presence probe points at a moved
file.** `src/worker.js:116` sets
`HELD_PROBE = "/held/robots/art/portal-cover.png"`. **RUN, proving the
absence:**

```
$ ls public/held/robots/art/
  mgk-niac-cover.png   mgk-viiip-cover.png   viiip.png     # no portal-cover.png
$ find . -name "portal-cover*" -not -path "./node_modules/*" -not -path "./.git/*"
  ./dist/client/robots/art/portal-cover.png
  ./public/robots/art/portal-cover.png                     # PUBLIC address only
```

The file moved to the public address under Mike's Portal ruling of 2026-08-22
(`vite.config.js:260–276`; the Portal left `HELD_PATHS` the same day). So
`heldServed()` (`:119–130`) fetches a path that is not on the deployment and
returns `false`, and `/api/held` reports `served:false` to a key-holder on a
deployment that is fine. **The worker anticipated exactly this** —
`:107–110`: *"IF THAT FILE IS EVER RENAMED the probe reports `served:false` on a
deployment that is fine. That is the loud failure direction and it is the right
one."* Consequence is a false alarm, not a leak. Recorded for Ops; not ruled,
not fixed.

**7. `dist/client/assets/held/` is empty on this build — RUN**, `ls` returns
nothing, while `dist/client/assets/locked/` holds three chunks
(`HrArchive-Bjvfz5-C.js`, `HrSpine-fcR8h4YG.js`, `hunter-root-catalogue-Bqa2gFWk.js`).
Consistent with `HELD_PATHS` now containing only `robots-units.js`
(`vite.config.js:289`), which the file's own comment says nothing imports
(`:284–288`). Offered as an observation; no claim attached.

---

## APPENDIX — every command run for this report

```
node tools/deploy-guard.mjs                                  (x3, incl. --launch, --i-know-…)
npm run reveal:day                                           (no --place)
npx wrangler deploy --help ; npx wrangler dev --help ; npx wrangler --version
npm run a -- --i-know-this-publishes-development             (scratch pkg, outside both repos)
node -e "…package.json.scripts…"
git log --oneline -S… ; git ls-files --error-unmatch …
find / du / ls / wc / grep as quoted inline at each claim
```

Nothing was built. Nothing was committed. Nothing was deployed.
