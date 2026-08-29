<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# Claude session notes

**READ FIRST: docs/canonical/OPERATIONS.md — the operating manual. It governs process; this file is reference.**

This file is for future Claude sessions on this repo. The human (Mike) doesn't read it. Keep it terse, practical, and up-to-date with anything that bit you.

If you're starting fresh: read this top-to-bottom before touching code. Then read `docs/MUSEUM_UX.md` for current direction.

---

## Canonical museum vocabulary

Before any work that touches museum tag vocabulary, pill columns, or artifact categorization, read `docs/CANONICAL_VOCABULARY.md`. The canonical vocabulary is the operator's locked design from April 2026. Specs in `docs/deep-dive-review/` describe architecture; they do not define vocabulary. Vocabulary inventions in spec sessions have been a repeated Ops failure mode — the canonical doc is authority.

---

## What this repo is

Weird.Baby Museum — a Vite + React + React Router site, deployed via Cloudflare Workers. The frontend is a "museum" with multiple artists/sections. Hunter Root (HR) is the primary artist content currently built out.

The "exhibit" surface (album coverflow + tracklist + video player + filter deck) lives at `/hr`.

**[V1 2026-08-06, THE VISIBILITY RULE] THERE ARE TWO STAGES, AND FOUR SHUT
PREFIXES IN TWO PAIRS. READ THIS BEFORE TOUCHING A PICTURE OR A DOOR.**
Mike reversed the pull-back for development — *"show everything that is PLACED,
until asked to filter; the pull-back is a LAUNCH-STATE rule"* — so the museum
builds in one of two stages, `WB_STAGE`, **default `development`**. In
DEVELOPMENT the Portal is in the `/robots` deck and the twenty-six machine
photographs are on the walls; at LAUNCH (`npm run build:launch` /
`deploy:launch`) an undelivered picture has **no address in the bundle at all**.
**THE TWO HOLDS ARE TWO DOORS AND MUST NEVER SHARE A LIST:**
`/assets/locked/` + `/locked/` is the PERMISSION hold (`/hr`) and is refused in
**every** stage; `/assets/held/` + `/held/` is the STAGE hold (the Portal, the
photographs) and opens in development. All four are in `src/worker.js` and in
`wrangler.jsonc`'s `run_worker_first`, and `reveal/reachability.mjs` reads both
files back — **it fails the gate if any of them loses an entry.**
**THE DATA DECLARES A PICTURE'S PUBLIC ADDRESS AND NOTHING ELSE** (`/robots/…`);
`src/lib/placement.js` computes the held prefix, and it is the only file in
`src/` allowed to name one. Read the **THE STAGE** and **A HELD THING MUST BE
UNREACHABLE** rows in `docs/canonical/OPERATIONS.md` §5 before touching any of
it, and §8's *a picture has two addresses* hazard before writing any tool that
reasons about an image path.

**[H1 2026-08-06] `/hr` IS NOT PUBLIC AND YOU CANNOT JUST OPEN IT.** Mike ruled the
Hunter Root wing HELD: online for him and for Ops, behind a password on `/admin`,
enforced by `src/worker.js` refusing `/assets/locked/*` without a cookie — in
EVERY stage; the visibility switch above does not reach it. Typing
`/hr` in a browser renders the Lobby. To work on it: open `/admin`, enter the key
(`env.HR_KEY`, a wrangler secret — **there is no default**, so `npx wrangler
secret put HR_KEY` must have been run on that environment), then `/hr`. Read the
**THE HELD WING** row in `docs/canonical/OPERATIONS.md` §5 before changing
anything in that chain — in particular `assets.run_worker_first` in
`wrangler.jsonc`, which is load-bearing for the API routes as well as the lock.

MediaVault is now under local-only git at `C:\AI\Platform\MediaVault\.git` (initialized 2026-05-08). Three commits as of init, branch `master`, no remote ever planned. See MediaVault's `STATE.md` "Version control" section and `CHANGELOG.md` for current state.

## Repo layout — where things actually live

```
src/
├── data/
│   ├── artists/hunter-root.js          ← SPINE: canonical album/track data
│   ├── exhibits/hunter_root.json       ← Artifact source (replaces hr_archive/hr_artifacts/hr_exit_flow)
│   ├── deep-dive-vocabulary.json       ← Deep Dive tag vocabulary (consumed by HrExhibitFlow + deep-tags export)
│   ├── hr_journal_prompts.js           ← Journal prompts
│   ├── wb_merch.js, wb_roster.js
├── routes/
│   ├── exhibit/
│   │   ├── Exhibit.jsx                 ← Coverflow + tracklist + video panel + player bar
│   │   └── Exhibit.css                 ← All exhibit-surface styles
│   ├── hr/
│   │   ├── HrArchive.jsx               ← Archive route — has its own ALBUMS array (mirror of spine)
│   │   ├── HrExhibitFlow.jsx           ← The deck (tabs/pills/journal/presets) layered over /hr
│   │   ├── HrExhibitFlow.css
│   │   ├── hr_dimensions.js            ← HR_ALBUM_OPTIONS + HR_SONG_OPTIONS (mirror of spine)
│   │   ├── hr_facts.js                 ← Facts indexed by albumId + trackId
│   │   ├── HrFanWall.jsx, HrHome.jsx, HrMedia.jsx, HrSpine.jsx
│   ├── shop/, WbAdmin.jsx, WbHome.jsx
├── styles/museum-tokens.css            ← --hr-* CSS variables (off-limits for population work)
└── worker.js                           ← Cloudflare Worker entry

tools/
└── Get-ProjectStatus.ps1               ← Project status reporter — reads git state, status docs, recent activity; suggests next step.
```

### Data model — albums and tracks

Three parallel representations of the same data. Mike calls these "variants" (which is overloaded with the music-variant taxonomy below — context disambiguates).

1. **`SPINE` in `src/data/artists/hunter-root.js`** — canonical. Each album: `{ id, title, year, art, accent, tracks: [{ title, videos: [{ ytId, label, type, credit? }] }] }`.
2. **`ALBUMS` in `src/routes/hr/HrArchive.jsx`** — title-only mirror. `tracks: ["Title 1", "Title 2", ...]`.
3. ~~**`HR_ALBUM_OPTIONS` and `HR_SONG_OPTIONS` in `src/routes/hr/hr_dimensions.js`**~~ — **GONE, AND HAD BEEN FOR A WHILE.** That module builds dimensions from the exhibit's artifacts at module-load (`buildDimensions`); the two mirrored constants survive only in a `.pre-T3-` backup and in this paragraph. Nothing to keep in step.

**[D1/D3c 2026-08-06] AND #2 IS GONE TOO, WHICH IS THE POINT.** `HrArchive.jsx`'s hand-typed `ALBUMS` array was a THIRD copy of this catalogue kept in step by nothing, and it had drifted two whole records and four misfiled songs away from the vault while three museum-wide figure sweeps walked past it. **It is deleted.** `/hr` and `/hr/archive` both read `HR_SPINE` from `src/data/artists/hunter-root-catalogue.js`, which builds it from the export. **There is one representation now**, and the paragraph that used to tell you to mirror by hand is the reason there were three. `hr_facts.js` still references tracks by exact `albumId` + `trackId` (== `title`) — don't rename a title without checking facts.

### Track media variant taxonomy

Per Mike (settled May 2026): variants are **Official / Live / Lyrics / Cover**. **Clips don't belong in tracklists** — drop them, don't tag them. The `type` field on each video is one of `"official" | "live" | "lyrics" | "cover"`.

There used to be `"clip"` entries; they're gone as of merge `e4ea01b`.

## Design tokens

**Canonical source of truth: `src/styles/museum-tokens.css`** — the `--hr-*` custom properties. Do not duplicate hex values here; read them from that file. (This table previously hard-coded the pre-graphite dark+gold palette — `INK #080808`, `GOLD… #b8974a` — which drifted out of date and became a stale third copy. Removed to prevent future work from scoping against wrong values.)

The JS constants at `HrExhibitFlow.jsx:109-122` (`INK`, `BORDER`, `GOLD*`, `DIM`…) are a **hand-copied mirror** of those `--hr-*` tokens, read by the `S.*` inline-style builders. They must be kept in sync with `museum-tokens.css` by hand — there is no build-time link, so edits to the CSS ramp do not propagate to the JS automatically. When changing palette, edit `museum-tokens.css` first, then re-sync the JS mirror to match. `HrExhibitFlow.css` consumes the tokens via `var(--hr-*)` and stays in sync by construction.

## Exhibit deck — non-obvious behaviors

These are the cumulative result of the May-2026 UX iterations. Reading the JSX without this context will mislead.

- **Tab strip is `position: fixed`** (in `S.deck`), not absolute-in-section. It pins to the viewport bottom, not to `.hr-section-deck-host`. This is to escape `.hr-section`'s `scroll-snap-align: center` which centers the section with a 32px gap above/below.
- **Player bar lift** is conditional via CSS `body:has(.pb) .hr-deck { bottom: 60px; }`. The default is `bottom: 0`. PlayerBar (Exhibit.jsx) returns null when no video plays, so `.pb` leaves the DOM and the deck slides back down.
- **Active tab merges with deck-body** via a 1px-tall `INK_SOFT` cover element (positioned `left:-1, right:-1, bottom:-1` inside the active tab when `open && active`) that overlays the deck-body's `border-top: 1px solid var(--hr-gold-lo)`.
- **`TAB_PEEK = TAB_STRIP_H = 30`** — the closed and hover-peek states render identically. Originally `TAB_PEEK=14` for a "tab tops only" peek effect, but at 30px tab height the labels get clipped mid-glyph. Pinned to full strip.
- **Pill semantics**: a column with **zero selections** is treated as "all selected" (no filter). Pills render in `GOLD_HI` with **transparent border**. Selecting any one pill flips the others to dim+border to indicate an explicit filter. This is the `noneSelected` prop threaded `PillGroupColumn → PillButton → S.pill / S.pillCount`.
- **Pill count color matches label color** in every state. Don't break this.
- **Tracklist variants are radio buttons** — only one variant active per track. Click an active variant to deselect to empty. (Was multi-select Set semantics pre-`f01ee88`.)
- **Per-tab clear `✕`** — small `✕` in each tab's top-right corner. Always rendered. Dim+unclickable when `tabHasSelection(tab)` is false; brighter+pointer when true. The strip-level "clear all" button no longer exists. The original `clear()` whole-deck reset is preserved with `eslint-disable-next-line` comment for potential revival.
- **AuditStrip is dev-only and intentionally not rendered** — was at z-index 9999 bottom-right and occluded the player bar's controls. The function is preserved in `HrExhibitFlow.jsx` for revival; the JSX render call is removed.

## Release discipline

1. Testing happens in a sandbox, not on the live Museum.
2. Features reach the Museum only after sandbox validation.
3. Releases to main happen only when Ops needs human testing.
   Not for morale. Not for "let's see it working." Operator-confirmed only.

## Workflow

**[2026-08-13] EVERYTHING IN THIS SECTION DESCRIBES A WAY OF WORKING THAT WAS
RETIRED, AND IT IS FENCED RATHER THAN DELETED BECAUSE NOBODY HAS RULED ON THE
BRANCH-AND-PR HALF.** Read `## THE ENVIRONMENT` below first. What is true
today: **Mike commits from PowerShell on `main`. No sandbox, no branches, no
PRs, and Code never commits, never pushes and never deploys.** The
cowork/PR/squash-merge flow below has not been used since at least 11 August.
The Conventions that survive it are the commit-message and out-of-scope habits,
which are about writing and not about git.

<details><summary>The retired flow, kept until someone rules on it</summary>

Mike develops on Windows; you usually run inside a Cowork Linux sandbox. The split:

- **You make edits + commits in the cowork sandbox.** Files write to disk via the FUSE mount → Mike's actual repo.
- **Mike pushes from PowerShell.** You can't push from the sandbox (no GitHub credentials).
- **You drive Chrome to open the PR.** Mike has the GitHub tab open; you navigate, fill the title and body, click Create, then Squash and merge, Confirm, Delete branch.
- **Mike runs the local cleanup** (checkout main, pull, branch -d).

Mike pre-approves the entire flow when he says "push" — drive end-to-end without re-asking for each click.

</details>

### Conventions

- **Commit author from cowork**: `cowork agent <cowork@local>`. GitHub overrides this on squash-merge to Mike's noreply (`98126530+langmikea@users.noreply.github.com`), so the squash commit on `main` is correctly authored.
- **Commit messages**: subject line under 72 chars, imperative mood. Body explains *why* and references the user's report verbatim where applicable.
- **[2026-08-26] A PATH ON ITS OWN LAST LINE IS A TRAILER. HOUSE COMMITS END ON
  PROSE.** `git interpret-trailers` reads **any** `Key: value` line in the final
  paragraph as a trailer — the key does not have to be one it has heard of. So
  `Log: C:\AI\_night-…\ROUND_LOG.md`, which is how a round log wants to be
  named, becomes a machine-readable trailer on a commit that was supposed to
  have none. **It is committed and pushed at `73179dc` and it stands** —
  rewriting history for one line is worse than the line.
  **PUT THE PATH IN A SENTENCE:** *"the log is at `C:\AI\…\X.md` and nothing was
  deployed."* Measured on the ten messages of 2026-08-25: **every one ends
  mid-sentence and all ten parse as zero trailers.** This is the house shape and
  it was already unanimous; one message broke it.
  **AND THE CHECK IS THE COMMAND, NOT A GREP.** The failure was not writing the
  line — it was *verifying* it by grepping for trailer NAMES
  (`co-authored-by`, `signed-off-by`, `generated with`) and reporting "no
  trailers" on zero hits. **A grep for known names cannot see trailer SHAPE.**
  Before handing over a message file:

  ```
  git interpret-trailers --parse < <message-file>      # must print nothing
  ```

  §0's *IF A RESULT SURPRISES YOU, SUSPECT THE PROBE* has a quieter half: an
  unsurprising green is exactly when nobody re-reads the probe.
- **PR bodies**: tabular fix summary, commit list, mechanism notes, "out of scope" section. Include the literal user-reported phrasing.
- **Squash merge** is the default — most branches accumulate iteration commits. Only choose merge-commit if the per-commit history is genuinely worth preserving.

### Pre-flight before commit

1. Verify file integrity: `wc -c <file>` matches expected, `tail -3 <file>` shows the proper end.
2. `npm run lint` — should be at the baseline (**9 errors / 7 warnings**, all pre-existing on main, all in routing files Mike has flagged for separate semantic review). **[2026-08-26] IT WAS 9 / 8 AND IT IS NOW 9 / 7, AND THE DROP IS REAL RATHER THAN SUPPRESSED — WHICH WAS CHECKED, BECAUSE THE FIRST CUT OF THE SAME EDIT WAS THE OTHER KIND.** `TEAR_SCRIPT` and `TEAR_MS` were declared inside `RobotsExhibitFlow`'s render body, so they were a fresh array every render and the effect that walks them could not honestly list them as dependencies; the ONE-SURFACE round first silenced that with an `eslint-disable-next-line`, which moved this number while changing nothing — **the exact tripwire-disabling failure the A1 note below describes, arriving from the other direction.** They are constants and are at module scope now, the deps are satisfiable, and the disable is gone. **A suppressed warning must never move this line.** **[CH8 2026-08-12] IT WAS 11 / 9 AND IT WAS 9 / 8, AND THAT DROP WAS ALSO REAL.** Making the YouTube player conditional (`useYTPlayer`'s `hasVideo` guard) removed the *unguarded* eager `useEffect` that raised both `Cannot access variable before it is declared` errors in `Exhibit.jsx`; they went with the code that caused them. Nothing was disabled and no rule was turned off. **The number is updated here in the same round that moved it** — for the reason the note below already gives, which had to be learned once in the other direction. **[A1 2026-08-04] This line said 4 / 6 and had been wrong since at least v40** — every round log from v40 onward records 11 / 9 and this file was never brought along. An orientation doc that publishes the wrong tripwire number disables the tripwire: a session that trusts it reads eleven pre-existing errors as seven new ones and starts hunting for a regression that is not there. The lint-debt table below lists four of the nine; the per-file breakdown is in that section, **measured 2026-08-13**. `eslint.config.js` ignores non-source trees (`_cowork/`, `dist`/`dist.pre_*`, `.phase1_retired_files/`) and `*.pre-*`/`*.old_v*`/`*.bak_*` backups, so the count reflects `src/` only — a higher number means you've introduced an error. **[2026-08-13] TWO STALE NUMBERS CAME OUT OF THIS PARAGRAPH AND BOTH WERE IN THE SENTENCE THAT WARNS ABOUT STALE NUMBERS.** It said the other errors "live in `HrExhibitFlow.jsx` and `RobotsExhibitFlow.jsx`" — measured, five of the nine are in `Exhibit.jsx` — and it closed with a sandbox caveat ending *"on Windows the file is intact and the count is 4/6"*, which contradicted the 9/8 at the head of the same paragraph. The caveat described a sandbox nobody runs in and is deleted with it.
3. `npm run build` — must pass. Vite + rolldown + Cloudflare plugin.

## Local tooling

`tools/Get-ProjectStatus.ps1` is a PowerShell helper that reads the current repo state and prints a recommended next step — git branch/ahead/behind/uncommitted counts, the next unchecked task in `TODO.md`/`NEXT.md` if present, detected manifests (Node, Python, etc.), and the five most recently modified files. Run it from the repo root: `.\tools\Get-ProjectStatus.ps1`. On a fresh Windows clone the script may be flagged as downloaded-from-web by SmartScreen — run `Unblock-File .\tools\Get-ProjectStatus.ps1` once to clear the zone-identifier ADS, then it executes normally.

### Deep Dive export

`npm run export-artifacts` reads released artifacts from MediaVault (`http://127.0.0.1:51822/db`) and writes per-exhibit JSON to `src/data/exhibits/<name>.json` (one file per `exhibit:` tag value). The museum imports these files statically at build time. MV must be running on the operator's laptop; the script won't work from CI or another machine.

Use `--dry-run` to see what would be exported without writing. Use `--verbose` to see the SQL query and per-card details.

### Release flow

**[CH4 2026-08-12] `npm run export-artifacts` IS OUT OF THE RELEASE FLOW AND THE
FLOW IS NOW ONE STEP.** See OPERATIONS.md §0 DEPLOY — THE ONLY ACCOUNT.

The old flow put the export at step 2 of every publish and called it "the
most-missed step". It is now the most DANGEROUS step, and the reason is on the
record: on 2026-08-11 three song lyrics were deleted from
`hunter_root.facts.json` and `hunter_root.json` by hand under the vault's rule 5
(*"NO LYRICS, EVER — not ours to reprint"*), and one of them had been public on
`/wal`. **They were deleted from the repo and not from MediaVault, where all
three are still `status = released`.** A routine export puts all three back,
silently, passing every gate — because a regenerated file is not a suspicious
file. A step listed as routine gets run routinely; that is the whole defect.

**The tool now refuses.** A plain run prints the three record ids and exits 1
without contacting MV. Running it is a deliberate act that needs a typed flag:

```bash
npm run export-artifacts -- --restores-deleted-lyrics
```

**Do not type that flag to get past it.** The fix is in MediaVault — unrelease
or archive `MV-HR-20260707-056` and `MV-HR-20260405-012`, clear the description
on `MV-HR-20260405-013` — and when that is done the guard block at the top of
`tools/export-artifacts.mjs` is deleted, not left standing and dismissed.

**To publish today:**

1. **In museum repo**: the deploy command — it builds and ships to weird.baby.
   See OPERATIONS.md §0 DEPLOY — THE ONLY ACCOUNT.

The exhibit JSON is a committed snapshot and ships as it stands. It has not been
regenerated since **2026-07-07**, MediaVault has had no write since the same day,
and nothing has missed it. If MV material genuinely needs to reach the site,
that is a deliberate export + review + commit, not a step in a deploy.

Long-term: HR acquisition tooling (T8, audit §6.4) will auto-emit
`exhibit:hunter_root` at capture time. That does not change the above.

### Cross-platform native dependencies

Any npm package with a native compiled component (currently `better-sqlite3`) requires `prebuild-install` in `devDependencies` so the operator's machine can fetch pre-built binaries on install without needing Visual Studio Build Tools. If a "not a valid Win32 application" error appears at runtime on Windows, `npm rebuild <package-name>` is the local fix. (This paragraph used to explain that the cowork sandbox built for Linux while Mike's machine needed a Windows binary; there is one machine now, and it is the Windows one.)

## THE ENVIRONMENT — WINDOWS HOST, AND THIS SECTION USED TO SAY OTHERWISE

**[2026-08-13] READ THIS BEFORE YOU TRUST ANY WORKAROUND IN THIS FILE.**

Code runs **on Mike's Windows host**, in Claude Code, with the Bash and
PowerShell tools and the ordinary Read/Write/Edit tools. There is no FUSE
mount, no virtiofs, no Linux sandbox, and no `mcp__cowork__*` tool.

**Two hundred lines here described a machine nobody is on**, and they were
not merely stale — several of them would cause harm if followed. They said
the `Edit` tool truncates files past 16 KB (it does not); that files must be
rewritten through a Python `rm + write` pattern instead of being edited (a
slower, riskier way to do what Edit does correctly); that `.git/HEAD`,
`.git/config` and `.git/index` arrive corrupted and must be hand-rebuilt
(they do not); that `git status` lies about mass deletions (it does not);
that `npm run build` cannot run and needs a rolldown symlink (it runs); and
that commits must be handed to the operator because the sandbox cannot stage
safely. **A session that believed them would spend its first hour deciding
whether its own tools work.** One did.

**THE ONE RULE IN THERE THAT IS STILL TRUE AND STILL MATTERS IS THE COMMIT
RULE, FOR A DIFFERENT REASON:** Code does not commit, push or deploy. Not
because staging is unsafe — because Mike owns everything host-side and runs
every command himself. Code edits, verifies, and reports.

**Nothing true was lost.** Three of those fourteen numbered rules were never
about the sandbox at all, and they are kept below, whole. Everything else went
with the machine it described; it is named once, in
`C:\AI\_night-20260812\JOB3-DOCS-CORRECTED.md`, and nowhere else.

### 1. Kickoff premises go stale — map every anchor before you design

Kickoff briefs reference file paths, function names and "existing X" claims
from a session start that may be hours or days old. T3 (2026-05-25) hit four
wrong anchors in one kickoff: a server change said to be "in mediavault.html"
was in `core/imgserver.py`; `hr_dimensions.js` was misremembered by one
directory; a heuristic flagged for retirement had been retired weeks earlier;
the export tool was named in the wrong repo.

**Hard rule**: map every anchor in a packet — file path, function name,
"existing X" claim — to the actual codebase BEFORE drafting anything. Surface
mismatches when you find them, not at patch time. **The packet is a planning
artifact; the codebase is ground truth.**

**[2026-08-13] AND IT APPLIES TO CONTENT, NOT ONLY TO PATHS** — a packet that
assumes its own material is already in the tree is making the same claim about
a different kind of anchor. It is §7 Rule 7's own extension and it has cost a
round: an instruction asked for a launch report *verbatim* that existed nowhere
on disk.

### 2. `export-artifacts` can SHRINK the released set

`npm run export-artifacts` writes MediaVault's *current* released set. If
release-status flips have shrunk it since the previous export (unrelease,
retire, status correction), the new JSON has fewer artifacts than the committed
one. T3 captured a 54 → 45 drop with no upstream change in scope.

Re-derive the before-count from the `hunter_root.json` **on disk** — never
from a count carried forward, which goes stale across sessions.

**Hard rule**: capture before/after artifact counts on every run. If after is
less than before, surface it before committing — the shrink may be intended
cleanup or an accidental unrelease, and the diff summary does not show which.
**A legitimate down-regen still gets an explicit acknowledgement; silence is
the bug, not the shrink.**

(See `### Release flow` above: the tool REFUSES to run at all today, because
MediaVault still holds three hand-deleted lyric records.)

### 3. THE RUN REPORT GOES TO DISK FIRST — OPERATIONS §13

Every session writes its report to a known path **before** it reports in chat
and before any commit. The chat is the delivery; **the file is the record.**

**Why it is a hard rule and not a habit:** the window that ran six packets on
11–13 August answered five of them in prose only. Those findings existed
nowhere but a chat that then closed. A packet that says "report" still means a
file.

**Hard rule**: write the report to disk first, then print it. Reports go to
`C:\AI\_night-<yyyymmdd>\` whether or not the packet says "write". If the
session produces a commit, the report lands before the commit text is handed
over.


## Things that are explicitly off-limits

- **`src/styles/museum-tokens.css`** — design tokens. Off-limits for population/data work; only touch with explicit UX direction.
- **Routing files** during data tasks — `Exhibit.jsx`, `HrExhibitFlow.jsx`, etc. are routing components. Population/data tasks should not modify them. UX tasks can.

## Pre-existing lint debt — the baseline is 9 errors / 7 warnings

**[2026-08-13] THIS HEADING SAID "(4 errors)" AND THE TABLE BELOW LISTS FOUR,
WHICH IS THE TRIPWIRE-DISABLING FAILURE THIS FILE'S OWN A1 NOTE WARNS ABOUT** —
a session that reads the heading as the baseline sees five phantom regressions
and goes hunting. **The baseline is 9 errors / 7 warnings**, confirmed by
running `npm run lint` on a clean tree on 2026-08-13, and it agrees with the
number in `### Pre-flight before commit` above. Measured per file on the same
run, so a future session can tell a regression from the debt:

| file | err | warn |
|---|---:|---:|
| `Exhibit.jsx` | 5 | 5 |
| `HrExhibitFlow.jsx` | 2 | 2 |
| `RobotsExhibitFlow.jsx` | 1 | 0 |
| `WbAdmin.jsx` | 1 | 0 |
| **total** | **9** | **7** |

The table below writes up four of those nine. It is not the whole baseline and
never was.

These four have been on `main` since before May 2026 and are deliberately untouched. Each needs semantic review, not a mechanical fix:

| Location | Rule | Notes |
|---|---|---|
| `WbAdmin.jsx:18` | react-hooks setState-in-effect | Could be a real cascading-render bug. Effect intent needs review. |
| `Exhibit.jsx:88` | react-hooks/immutability (`schedule` accessed before declared in FactScroller useEffect) | Reordering surfaces 3 new errors at lines 127–128 (`Cannot access refs during render`). The deeper fix is wrapping those reads — structural, not a lint cleanup. |
| `Exhibit.jsx:191` | "Compilation Skipped: Existing memoization could not be preserved" | React Compiler can't see through `ensureApi(() => initPlayer(ytId))`. Restructure useCallback deps. |
| `Exhibit.jsx:517` | Same forward-reference pattern as :88, with `advanceQueue` (declared at line 592). Same cascade risk. Cleaner fix: `useCallback(() => advanceQueueRef.current(), [])` with a stale-closure ref. |

If asked to do "lint cleanup", these are the targets. Don't pretend they're trivial — read the surrounding code first.

## THE LAW OF THE VISIBLE LINE (Mike, 2026-08-04 — STANDING)

> **If a line describes the work rather than doing the work, it does not ship.**

Canonical text + reasoning: `docs/canonical/OPERATIONS.md` §7 Doctrine 11.
Mirrored in `STATE.md`. **Read it before writing any visitor-facing string.**

The test is the line's SUBJECT, not its tone or its truth. Fails: the drafting,
the research, the revision history, what a round did, the form a page takes and
why, the typography, the renderers, unwritten-content plans, any builder named
on the glass, internal decision codes, `· v1` draft stamps. Ships: the objects,
the artists, the events in the record, the standing terms, and honest statements
of what is not held. *"No plate on file"* ships; *"nobody has photographed this
yet"* does not.

Two things that LOOK like meta and are not: **provenance** (sources lines,
accession numbers) and **mechanism state** (the Foundation's LIVE / NOT BUILT).

Corollary: **empty and honest beats populated and false.**

**The practical trap this cost a whole round:** the `why` field on a Portal drum
position, the `held` string on a Record door, and a `note` on a face entry are
all PRINTED. A "comment-shaped" string in a data file is not a comment. Grep for
what renders before assuming a field is internal.

**And a text sweep cannot see everything.** The largest placeholder in the
building on 2026-08-04 was marker lettering **painted into a JPEG**
(`public/museum.jpg`, now deleted) labelling four rooms that never existed. It
took a screenshot to find. Lap the glass, not only the strings.

## THE LAW OF SUBTRACTION (Mike, 2026-08-04 — STANDING)

> **If it does not help, it hurts. If it does not need to be there, it needs to
> not be there.**

Canonical text + reasoning: `docs/canonical/OPERATIONS.md` §7 Doctrine 16.
Mirrored in `STATE.md`.

**It is NOT the visible-line law again, and the case that produced it is the
proof.** Doctrine 11 tests a line's SUBJECT; this tests its NECESSITY. The 31½
tally card was a fact about the collection, passed the visible-line test on every
reading, was true, and was still wrong to set at 132pt — nothing was wrong with
it except that it did not need to be there.

Ask of any object, control, count, caption or badge: **what is lost if it goes?**
"Nothing a reader would miss" means it goes. Harmless is not passing — harmless
costs attention.

It is a reason to delete, never a reason to delete QUIETLY: everything struck
under it is named in the round log and, if it leaves a gap, given a row in
`docs/OPEN_ACTIONS.md`.

## THE PROVENANCE GATE (v48, 2026-08-04 — STANDING)

`npm run provenance:gate` runs beside lint and build on **every** packet. It
fails if any visitor-facing string in `src/` or `index.html` has no row in
`provenance/register.json`, or any referenced image has no row in
`provenance/assets.json`.

**If you add content, you add register rows in the same commit.**
`npm run provenance -- --emit` writes stubs for whatever is undeclared; fill in
`c` (MIKE | VERIFIED | DERIVED | HOUSE | RESTATED) and `s` or `r`, and move them
into `register.json`.

**Never re-run `provenance/backfill-20260804.mjs`.** It is the audit record of
the first classification; its coarse rules would silently absorb anything new
and the boundary would stop being one.

Read `provenance/README.md` before describing what the gate proves — §4 is the
hole-list, and the largest hole is that **it cannot verify a declaration is
true.** It also does not replace THE LAW OF THE VISIBLE LINE below: provenance
catches invented CONTENT, Doctrine 11 catches a line whose SUBJECT is the work.

## THREE STANDING RULES ADDED 2026-08-06 (THE NIGHT ROUND)

**IN-STORY TECHNICAL SPECIFICATIONS** — *"Technical Specifications" means THE
IN-STORY SPECS, NEVER THE REAL ONES.* `OPERATIONS.md` §7 Doctrine 18, mirrored in
`STATE.md`. **`npm run instory:gate` runs on every packet.** The board part
number, the source-tree filenames, the line count and the real build's dates are
all TRUE and are the provenance of a prop; a spec sheet is not a provenance
record. **The Record is exempt and must stay modern** — it is the house's log of
receiving the object this year. **Read Doctrine 18 before adding a fact to any
face whose subject is what a machine IS.**

**THE EXPANDER RULE** — *opening or closing a record moves what is beneath it;
the persistent part stays exactly as it is.* §7 Doctrine 19. Two mechanisms:
`html { scrollbar-gutter: stable }` in `src/index.css` (the scrollbar appearing
was moving 18 elements sideways) and `grid-template-rows: max-content 1fr` in the
stacked exhibit frame. **Test any new expander with `anchorTest` in
`tools/lap/harness.html`; zero above is the rule.**

**NOTES TO MIKE ARE NOT PART OF THE UX** — `[PAPA]` markers now render in a red
`.wb-ops-notes` block in DEVELOPMENT and are deleted from the SOURCE at LAUNCH by
`wb-ops-notes` in `vite.config.js`. **`visitorProse` is unchanged to the
character and must stay that way** — the body copy is identical in both stages,
which is what makes the page Mike reads the page that ships.

**AND THE 390px LAP WORKS NOW — `npm run lap`.** M97 is closed after four rounds.
A 403px same-origin iframe (`tools/lap/harness.html`) gives `innerWidth: 390`
exactly; the window's size was never the museum's viewport. **`npm run lap:clean`
before you seal** — the harness has to live in `public/` to be same-origin, and
anything in `public/` is one deploy from being published. See OPERATIONS.md
§0 DEPLOY — THE ONLY ACCOUNT.

## TWO STANDING RULES ADDED 2026-08-07 (THE TWO BUCKETS + 013)

**THE BOUNCY BALL LAW CAPS POINTS OF FOCUS, NOT ASSETS** — *"humans remember one
or two things; ten things reduces the odds they keep the one that matters."*
`OPERATIONS.md` §7 **Doctrine 20**, mirrored in `STATE.md`. **IT DOES NOT MEAN WE
MAY NOT SHOW MORE PICTURES.** Two buckets: **PRECIOUS** — genuine reveals, two or
three **a week**, the ceiling is on these — and **DUMP** — everything else, **no
ceiling**, because ten manual pages arriving is ONE point of focus. The law and
both runways are **`reveal/focus.mjs`**; the judged field is **`bucket`** on
`provenance/asset-table.json`, **Mike's, null on all 475 rows (re-measured
2026-08-21 when QC_101 landed; this said 460, 459, 404, 397 and 315 before
that), and Ops does not derive it**. **PRECIOUS divides into weeks; DUMP divides into nothing** — the old
tracker divided PHOTOGRAPHS by a ceiling on ATTENTION and printed *"16 pictures =
6–8 days"*, which is **VOID** and kept with its cause in `focus.mjs` `VOIDED`.
**Before writing any instrument that counts what the museum can show, read
Doctrine 20.**

**RECORD 013 IS A PROTOTYPE AND THE REAL RECORD STARTS AT 001** — Mike, 2026-08-07.
Not day one, no re-dating, no defending. **M19 closes with it** (a record number
is this volume's own, from 001). It is **kept rather than retired** because it is
the only thing exercising `RecordEntry.jsx`, the index budgets, the per-entry
ledger derivation and the pull-back rule's one delivered picture. **The prototype
mark is in `reveal/ledger-declare.mjs` and the dictation pages and NOWHERE ON THE
GLASS** — Doctrine 11. **Its number is untouched and open: `B-b`.**

## TWO STANDING RULES ADDED 2026-08-07 (THE WORKSHEET)

**REFERENCE AND WORK DO NOT SHARE A PAGE** — *"If it is reference, write it as
such. If it is the firehose I have to drink from to do anything, thanks, pass."*
Mirrored in `STATE.md`; the mechanism is the §5 **THE OPS INSTRUMENTS THAT RENDER
TO `docs/`** row. `week1.html` explained the rails, the transfer classes and five
collisions **before it showed a headline**, and had nowhere for Mike to write. It
is **`worksheet.html`** (the instrument: 32 slots, Ops left / input right,
`localStorage` autosave, one COPY EVERYTHING button) plus **`reference.html`**
(everything that explains the machine), and `prep.mjs` **prunes `week1.html` by
name** — a generator that stops writing a file does not unwrite it. **An
instrument must degrade honestly:** refused storage raises a red banner rather
than losing an hour of typing; a refused clipboard leaves the text selected.

**THE THREE MARKS, AND A `beat` MAY BE DELETED BUT NEVER REWORDED** —
`OPERATIONS.md` §5 *THE STORY OUTLINES, AND THE VERBATIM RULE*, mirrored in
`STATE.md`. `Ops` blue = Ops' sentence · **`your words` gold = VERBATIM** ·
`your rule · Ops wording` amber = his rule, Ops' sentence. **BOTH ERRORS COST THE
SAME:** a paraphrase in gold is indistinguishable a week later from something he
said, and **his own sentence left in blue gets quietly "improved" by the next
round.** Week one was SPOKEN (gold empty as a fact, not a policy); week two
arrived IN WRITING (`reveal/week-two.mjs`, six beats carried exactly). **Ops
divides and does not invent** — the one merge in week two is named in the file
header, and no `weight` was invented for the same reason no `bucket` is derived.

## THREE STANDING RULES ADDED 2026-08-07 (THE REVEAL MECHANISM)

**THE RECORD IS THE MANIFEST, AND THE NINETY DAYS ARE THE LAUNCH STAGE** - the
mechanism R1 asked for is H2's pull-back rule and it has been enforced since
2026-08-06; **what was missing was the daily step, and it is `npm run
reveal:day`** (`-- --place` moves files both directions, `-- --since <ref>`
prints the delta against an old Record). An entry's `assets` array IS the day's
publish list, so it costs Mike **zero actions** beyond the entry, and **a missed
day is a day with no entry, which is what a missed day looks like.** A dated
manifest was rejected on DUPLICATION, not on the clock. `deliveryFaults()` has
**four** checks now - the new one walks the ENTRY, because the first three walk
FILES and could not see an entry naming a picture at neither address. **IT IS
NOT A GATE and it never moves the stage:** in DEVELOPMENT everything PLACED
renders, so a deploy publishes the Portal and all sixteen photographs. See
OPERATIONS.md §0 DEPLOY — THE ONLY ACCOUNT.
**The performance is `deploy:launch`, and the day it starts `DEFAULT_STAGE`
moves - Mike's word, register R-a.** Read `OPERATIONS.md` §5's THE DAY'S STEP
row before touching any of it.

**A GENERATOR MAY REMOVE A FIELD; IT MAY NOT REMOVE THE ANSWER THAT WAS IN IT** -
the worksheet's `save()` wrote `JSON.stringify(values())`, and `values()` only
sees textareas **that still exist**, so retiring two slots would have silently
deleted whatever had been typed into them at the next blur. It carries foreign
keys through untouched now, and **the page that inherited the question carries
the answer across and marks the row in amber** - a silent pre-fill is
indistinguishable from something he typed there. **The same shape applies to any
future slot move on these pages.** And the cause was the more general rule:
**a question asked on two pages gets two answers**, in two `localStorage` keys,
neither able to see the other.

**THREE GRADES OF SECRET, AND A STORY LOCK NEEDS A THIRD DOOR** - `docs/HIDDEN_LINKS_SCOPING-20260807.md`,
scoped and **unbuilt**. GRADE A server-held (only `src/worker.js`) - **GRADE B
sealed in the open**, the material on the visitor's machine and useless without a
key that was never published, needing **no server and no state** - GRADE C
theatrical, ceremony only. **The rule that decides most of the design:
client-side decryption needs a passphrase that survives an OFFLINE attack; the
worker does not, because it can rate-limit.** And `/assets/locked/` is PERMISSION
and `/assets/held/` is STAGE, **named for their reasons** - a puzzle is a THIRD
reason and must never share either pair.

## TWO STANDING RULES ADDED 2026-08-07 (THE NIGHT DESK)

**AN INSTRUCTION THAT ASSUMES ITS OWN MATERIAL IS IN THE TREE IS A KICKOFF
ANCHOR, AND §7's RULE 7 APPLIES TO CONTENT AS WELL AS TO PATHS.** S2 said Mike's
day-one launch report *"exists only as text he pasted to Ops"* and asked for it
**verbatim, no editing, no smoothing** — and only a parenthetical summary of its
timeline reached this session. `Initial Launch Report` returns **zero hits across
`C:\AI\Projects`**. **Doctrine 12 is not suspended by an instruction that assumes
the content is in hand**, so Record 001 carries his headline and his eight
timeline beats and **nothing else**: no `line`, no `lead`, no `tomb`, no `date`.
**It breaks Mike's own R3 rule (every index row gets a summary) ON PURPOSE and
the breakage is measured rather than asserted** — 013's row is 157px, 001's is
84px at 390px on the built bundle. Registers **`S-a`** (is the report in-story or
real — Doctrine 11 turns on the answer) and **`S-b`** (the summary he wrote).

**A LAUNCHER MUST NOT DRAW A LINK TO A FILE THAT IS NOT ON DISK.** `npm run desk`
→ `docs/OPS_DESK.html`, eight instruments behind one desktop shortcut
(`Weird.Baby Ops`), plus `docs/OPEN_ACTIONS.html` rendered from the register's
markdown. **A dead link on a launcher is worse than an absent one** — a 404 reads
as *the tool is broken* when the truth is *a generator has not been run* — so
every card is `fs.statSync`'d and a missing file gets a red card and no link.
**"Current" is a property of the generator behind each page, never of the
launcher**, so each card prints its own mtime and its own `npm run …`. Rules:
`OPERATIONS.md` §5 **THE OPS DESK** row. **And its own first lap measured a 404
page and reported a clean zero** — check `document.title` and a node count before
believing an overflow reading.

## ONE STANDING RULE ADDED 2026-08-08 (RECORD 001)

**EVERYTHING IN THE FORM IS STORY** — *"the worksheet is a story instrument, not
a project log — in-story always."* `OPERATIONS.md` §7 **Doctrine 21**, mirrored
in `STATE.md`. **IT IS A RULE ABOUT THE INSTRUMENT, NOT A RULING ON ONE ENTRY** —
material arriving through the dictation instruments is in-story by construction,
so **Doctrine 11 is satisfied at the instrument** and no future dictation gets
re-adjudicated entry by entry. **IT DOES NOT EXEMPT OPS' OWN PROSE ANYWHERE,
including inside a Record entry**, and **it does not lower the provenance bar** —
in-story is not unsourced; every string through a form is still declared MIKE
against a round log that quotes the dictation in full.

**AND A VERBATIM LANDING HAS THREE COSTS WORTH KNOWING BEFORE THE NEXT ONE.**
(1) **His typos ship** — `was made made`, `=  86%`, `auto containment. and auto
alerts` are in Record 001 on purpose and a round that tidies one has broken the
instruction. (2) **A 477-character executive summary does not fit a 130-character
index row**, and picking which of his sentences becomes the summary is an edit —
so `line` is still empty and 001's row is still 84px against 013's 157px (`S-b`).
(3) **A double space is in the data and not on the glass** — measured, HTML
collapses it, and making it visible costs `white-space: pre-wrap` on every record
body (`S-e`). Full rules: `OPERATIONS.md` §5's RECORD 001 row.

## ONE STANDING RULE ADDED 2026-08-08 (THE CULL)

**ONCE IT IS RULED GONE, IT IS GONE FROM HIS VIEW** - *"once he says get rid of
something, HE NEVER WANTS TO SEE IT AGAIN - not archived where it resurfaces, not
listed in a tracker, not carried in a register as a closed row he has to scroll
past."* `OPERATIONS.md` §7 **Doctrine 24**, mirrored in `STATE.md`.
**IT BINDS THE TRACKERS AND REGISTERS, NOT ONLY THE FILES, AND IT OVERRIDES
DOCTRINE 14's "flip the status":** a closed row now LEAVES. `OPEN_ACTIONS.md`
went **801 -> 386 lines** on the day. Ops' history is
`docs/OPEN_ACTIONS_CLOSED.md` and is **not on the Ops desk** - the test is not
*is it archived*, it is *will he meet it again*. **A deleted thing is named ONCE,
in the log of the round that killed it, and nowhere else.** And removing rows
orphans links: 67 were flattened to plain text - §9's prune procedure applies
inside one file.

## ONE STANDING RULE ADDED 2026-08-08 (ATTACHMENTS + THE EMAIL-LIKE REGISTER)

**THE RECORD IS EMAIL-LIKE, NOT AN EMAIL PROGRAM** - *"no From, no To, no Subject
line, no reply affordances, no inbox, no message headers, no envelope furniture
of any kind. What is borrowed is the REGISTER ONLY: the plainness and the
attachments-at-the-bottom convention."* `OPERATIONS.md` §7 **Doctrine 23**,
mirrored in `STATE.md`. **THE TEST IS NOT *is it useful* - IT IS *would a mail
program have it*:** a count beside the ATTACHMENTS label and a per-row open
control were both reached for and refused. The face is **`--wb-plain`, a system
stack, Arial first, loading nothing**; bold at most, no italic, no display step.
**SCOPE IS THE RECORD ONLY** - every rule sits inside `.vp-rec-index` or targets
`.vp-rec-*`, because the index row is built from the SHARED `.vp-fe-*` classes
and restyling those bare retypes the FAQ, Worth A Listen and every other entry
list. **Check it with a cascade probe:** the same class inside and outside a
Record index must compute different families. **PAYLOADS ARE ATTACHMENTS at the
foot, one shape for all three kinds, with the payload's own words INSIDE the row
(R4).** And **"nothing drops silently ever again" is a GATE** - `reveal:check`
refuses any entry field nothing renders (`DRAWN_ENTRY_FIELDS`).

**[T2/T3 2026-08-08] THE PLAINNESS IS SPACING TOO, AND THE RECORD HAS ITS OWN
RHYTHM LADDER.** `--rec-hug` .30 - `--rec-para` .40 - `--rec-block` .55 -
`--rec-sect` **1.15** (the house's `--rh-sect` is **2.6**). **They are
Record-only for A4's reason:** R1's `--rh-*` paces every flat face, so tightening
it retunes /wal and /foundation to answer a complaint about the Record. **AIR
GOES ABOVE A HEADING, NEVER BELOW.** **THE LEADING FLOOR IS 1.35 AND THE MEASURE
SETS IT, NOT THE FACE** - the eye returns along the leading and a 68-character
line needs more of it than a 45-character one; the body sits at **1.40**, above
the floor. **A round that narrows the 68ch measure may spend some of that; a
round that only tightens leading may not.** **And the typewriter stays** on the
dateline, the stamp and the mark rail: the register governs the WRITER'S WORDS.

## TWO STANDING RULES ADDED 2026-08-08 (THE DATE + THE LIVE PREVIEW)

**THE STORY PLAYS OUT IN REAL TIME, ON REAL DATES** — *"an entry's date is the
actual calendar day it is published, not a fictional offset."* Mirrored in
`STATE.md`; the mechanism is `OPERATIONS.md` §5's THE STORY RUNS ON REAL DATES
row. Day one is **2026-09-07** and it is **ONE CONSTANT**, `RECORD_EPOCH` in
`src/data/artists/record-epoch.js`, read by Record 001's `date`, the face's
`recordEpoch` and (via `recordEpoch()` in `reveal/record-entries.mjs`) every day
of the worksheet's outline. **A slip is one line — proved, not assumed:** one
date-shaped literal in the file, both consumers identifier references, and the
half-updated two-literal case prints *"Week 2 · Monday · Record 001"* on day one
with nothing reporting it. **`C8` closes; the month band did NOT turn on** and
`C1` says so (14 entries across >1 month; the volume holds two). **The worksheet
generator refuses to build if a derived weekday disagrees with the outline's
declared `MON…FRI`.**

**[2026-08-28] THE DAY HAS MOVED TWICE AND THIS PARAGRAPH HAD NOT MOVED ONCE.**
It said **2026-08-17** and `src/data/artists/robots.js`; the constant left
`robots.js` at the 2026-08-11 split, **Ruling C** put day one on 2026-08-31 on
2026-08-24, and **Ruling D** put it on **Monday 2026-09-07** on 2026-08-28. Both
references are corrected above rather than flagged, because this file is
orientation and an orientation doc that publishes a wrong constant disables the
constant — the same argument the lint-baseline note in the pre-flight section
makes about a wrong tripwire number.

**AND THE DATE FIRES ON ITS OWN — THIS IS THE PART THAT IS NOT A NUMBER.**
**Nobody runs anything on 7 September.** No cron, no queue, no scheduled job.
The deployed worker plays the bundle against **request time**, so at **17:00
America/New_York on Monday 7 September** Record 001 posts, the Robots wing
opens, the lobby countdown removes itself, the share cards start naming the
robots, and the seven governed pictures begin publishing on the days after.
**A deploy does not decide that date — it ARMS it**, and the only way to not
have the day is to move `RECORD_EPOCH` **before it arrives**. Mike's RULING D
is the ORDER as much as the date: **move the epoch first, then deploy.** The
full account is OPERATIONS §0 → **THE DEPLOY ARMS A DATE**.

**A PREVIEW OF THE MUSEUM RENDERS THE MUSEUM'S OWN COMPONENTS, AT THE MUSEUM'S
OWN VIEWPORT** — §5's THE LIVE PREVIEW row. The ramp is
`clamp(1.02rem, min(1.35vw, 4.4cqh), 1.28rem)`, **a function of BOTH viewport
axes**, so *nothing may reduce the preview frame's width or its height* — a bar
and an editor stacked around it left 368px of height, `4.4cqh` fell under
`1.35vw`, the clamp hit its floor and the body drew **15.3408px against the live
15.4031px**. That is also why the preview is **two views and not a pane**: a pane
beside the form is a different `vw` and therefore a different measure and wrap.
**`RecordIndexRow.jsx` was extracted for it and must not drift back inline.**
**Two build traps are load-bearing in `tools/dictation/preview/vite.config.mjs`:**
`publicDir:false` (without it vite copies `public/held/` into `docs/`) and
`define: process.env.NODE_ENV` (vite does not substitute it for a LIBRARY build,
so the bundle carried both copies of React and would have thrown on first
render). Fidelity note: `tools/dictation/preview/README-fidelity.md`.

## ONE STANDING RULE ADDED 2026-08-08 (THE INDEX LINE + THE WARNING)

**A LIMIT IS SHOWN WHERE THE STRING IS WRITTEN** — *"he must never again discover
a limit from a report."* `OPERATIONS.md` §7 **Doctrine 22**, mirrored in
`STATE.md`. A 477-character summary was composed against a 130-character row and
surfaced three rounds later from a gate; **every part worked as designed and none
of them reached the writer while he was writing.** A constraint has three halves
now: a render that cannot lie, a gate that refuses, **and a live count on the
field.** **ONE DECLARATION, EVERY READER** — `reveal/record-shape.mjs`, imported
by the gate, the instrument and the page that documents it; a constant that
cannot be imported because it lives in a script **is the defect, and gets moved.**
**WARN, NEVER BLOCK** (no `maxlength`) · **count what would be SAVED, not the raw
field** · **say where there is NO limit** · **the warning travels into the paste.**
**AND THE AUDIT IS OF EVERY SLOT** — which is how the real defect surfaced: the
constrained field had never been asked for at all, and a meter on the wrong field
would have policed something unbounded. Seventeen constraints declared, **six
`silent: true`.** **Before adding any field Mike fills in, read Doctrine 22.**

**AND `line` DRAWS TWICE.** `RecordEntry.jsx` renders `entry.lead || entry.line`,
so an entry with no `lead` prints its index summary as the lead paragraph too.
Record 001's approved sentence is **filed RESTATED, not MIKE** — approval is not
authorship — and **must never be re-marked**: a paraphrase in his class is
indistinguishable from his words a week later.

## TWO STANDING RULES ADDED 2026-08-09 (THE RECORD EDITOR)

**HE WRITES IN THE RECORD ITSELF** — *"the two-column worksheet is retired as his
writing surface. HE EDITS THE RECORD ITSELF, DIRECTLY — every part of it… NOT
side by side. He must feel he is IN THE REAL THING as much as feasible."*
`OPERATIONS.md` §5's **THE RECORD EDITOR** row, mirrored in `STATE.md`. The page
is `npm run record` → `docs/dictation-20260807/record.html`. **THERE IS NO EDITOR
WIDGET:** it draws the museum's own `RecordEntry` and `RecordIndexRow` through
the preview bundle and makes the museum's own paragraphs `contenteditable`, so
**there is no second copy of his text on the page** — which is the only thing that
makes a copy button honest. **The fidelity is MEASURED against the live page** at
both widths (390px: `.vp-flat` 344.56px, body 15.3408px, identical), and nothing
in `record-edit.css` may change the size or position of anything the museum draws
— the ramp reads both viewport axes, so every control floats. **`worksheet.html`
is deleted**, `buildWorksheet()` with it, and its weekday guard was exported to
the top of `prep.mjs`. **Before touching that page, read the §5 row's seven
points** — in particular that fields are found by CLASS (no shipped component
gained an attribute for an Ops tool) and that `audit()` red-banners any field the
model holds that found no node.

**NOTES TO OPS LIVE IN CURLY BRACES** — *"Anything inside { } is a note to Ops,
not story… They must never reach a visitor — the launch gate fails on any brace
that survives. The red/blue inline answers in the published entry are retired;
that was Ops answering in the wrong place."* **TWO GATES, BOTH PROVED BY BREAKING
THEM:** `reveal:check` on every packet over the Record's own strings, and
`wb-ops-braces` on every launch build over every string literal under `src/`.
**The launch gate reads the SOURCE and not the bundle and that is forced, not
chosen** — compiled JavaScript is made of braces — and what it therefore cannot
see is stated in the code. **The `[MIKE-NOTE]`/`[OPS]` scheme is DELETED, not
left dormant**: the renderer branch, both marks, four CSS rules, the
source-emptying pass and `wb-dev-mark-guard` whole. **`[PAPA]` is untouched.**
His eight notes left `robots.js` **whole and verbatim** and are in his working
copy in braces, at the paragraph they followed.

**AND TWO HAZARDS THE PROOF FOUND ARE NOW §8 ROWS.** `innerText` returns what CSS
DISPLAYS — a `text-transform: uppercase` heading came back upper-cased and would
have landed in `robots.js` as an edit nobody made; use `textContent`. And
`requestAnimationFrame` **does not fire in a tab that is not being painted** — the
editor drew perfectly in a background frame and wired nothing, with no error
anywhere. Never put correctness behind rAF.

## ONE STANDING RULE ADDED 2026-08-09 (CLEANUP)

**LEAD WITH WHAT HE MUST DO OR DECIDE** - `OPERATIONS.md` §7 **Doctrine 26**,
mirrored in `STATE.md`. Every report to Mike opens with what is waiting on him;
everything else is omitted unless it changes something for him. **THE TEST IS NOT
*is it true* AND NOT *is it interesting* - IT IS *does this change what he does
next?*** Craftsmanship notes, measurements, before-and-after numbers and internal
findings go in the round log, where a future session reads them; **he is not a
future session.** **AN EMPTY ASK IS A COMPLETE REPORT** - *"Nothing here needs
you. Mirror and deploy."* The command it names is in OPERATIONS.md §0 DEPLOY
— THE ONLY ACCOUNT. Padding it makes him read a page to
discover it is empty, which is Doctrine 25's cost charged to a message instead of
a page. **A GATE TABLE IS NOT A DECISION:** one line at the end, or nothing.
**It is Doctrine 25 for prose and carries the same construction clause** - what
is worth keeping goes in the round log, in `OPEN_ACTIONS.md` if he needs it
later, or in `OPERATIONS.md`/`STATE.md` if it binds future work; never in the
opening paragraphs as evidence of effort.

## ONE STANDING RULE ADDED 2026-08-08 (THE LIGHT TABLE)

**THE TOOLS ARE FOR WORKING, NOT FOR BRIEFING** - *"All the stuff at the top, I
never read."* `OPERATIONS.md` §7 **Doctrine 25**, mirrored in `STATE.md`.
**THE MEASUREMENT IS THE ARGUMENT AND IT IS NOT CLOSE:** at 390px the first
control a person could use sat **2014px** down the artifact tracker, **2474** the
spec sheet, **1524** the worksheet, **1537** the register - three to six screens
of prose before the tool started. Now **126 / 727 / 219 / 398**.
**IT IS NOT THE LAW OF SUBTRACTION AGAIN**, and the worksheet is the proof:
Doctrine 16 asks whether a line is NEEDED and almost everything struck here WAS
needed by somebody - the CAPITALS section rule, the `ATTACH:` line, the date
format, what a band means. **What was wrong was WHERE they were**, so the rule
carries a construction clause: **on the field, in the footer, or on
`reference.html` - never above the work**; and if it fits none of those three,
**Ops raises it in conversation.** **A LEGEND IS NOT A BRIEFING** - the test is
whether the page is unreadable without it. **AND IT GROWS BACK:** `week1.html`
was split for this exact complaint on 2026-08-07 and the worksheet's masthead was
seven paragraphs three rounds later. **Before adding any line above a control,
read Doctrine 25.**

## Recent session log

Maintained here. Newest first.

### 2026-08-27 -> ONE LIVE UNIT: THE REBOOT, THE TWO BEZELS, THE STILL CONTROLS (fourteenth packet)
- **NOTHING NEW NEEDS MIKE.** **NOTHING IS COMMITTED.** Gates: lint **9/7 =
  baseline** - build green - launch green - provenance **PASS** (1 added, 1
  pruned) - `reveal:check` - `parity:gate` - `instory:gate` -
  `docs:numbers:gate` **PASS** - `reveal:day` nothing to move. Log:
  `docs/MUSEUM_ONE_LIVE_UNIT_LOG-20260827.md`, copy at
  `C:\AI\_night-20260827\ROUND_LOG_6-20260827.md`.
- **THE UNIT REBOOTED ON EVERY CHANNEL CHANGE, MEASURED FOUR TIMES BEFORE IT WAS
  TOUCHED.** Stamping the twin's `window` and reading `performance.timeOrigin`:
  **a new origin, a new stamp and an uptime of 3.6s on every switch.** Two causes
  in one line of JSX — CH3->CH4 changed the `src` (channel 4 carried
  `&view=closeup`) and CH3->television UNMOUNTED the element.
- **THE FRAME LEFT THE TERNARY AND IS NOW COVERED, NOT UNMOUNTED.** Verified:
  **one stamp across five channel changes, uptime 3.6 -> 6.1 -> 8.6 -> 11.1 ->
  13.6s.** **NOT `display:none`, and that is the load-bearing choice** — the
  emulator's clocks are `setInterval` (`osTick` 50ms, `refreshChrome` 200ms) and
  a frame outside the render tree is one a browser may stop servicing. That
  would have been **the version that looks fixed while the unit quietly stops**,
  which is the shape CH3's resize was fixed in once before and it came back.
- **THE VIEW BECAME A MESSAGE.** `?view=` is an ADDRESS and therefore a reload;
  `{wb:"portal-view"}` is a word to a running machine — one `img.src` and one
  class, the emulator untouched. **A PRESET change still reloads and that is
  correct**: a bank is a START MODE and those recipes exist to boot it
  differently. Changing the camera must not reboot it; changing how it starts
  must.
- **"TWO BEZELS" — HIS PLATE HAS THE FRAME COMPOSITED INTO IT.** Measured on the
  two files: where the museum's bezel is opaque **the close-up's pixels are
  IDENTICAL to it** (31/31, 41/41, 18/18, 26/26, 60/60, 20/20) and the alpha
  runs match to the pixel. **The 4:3 enlargement scaled his copy 1.0667x against
  a museum bezel at 1.0**, so both edges showed — nothing wrong with either
  object, they were drawn at two scales.
- **`exact: true` DRAWS A REGISTERED PLATE UNTOUCHED.** CH4's feed box is now
  **100.00% at 0.00%**; CH3 keeps **106.67% at -3.33%**. **The Portal's bezel is
  NOT suppressed and did not need to be** — his copy stops being visible because
  it is exactly where the museum's is. **A plate cut on the bezel's own canvas
  is REGISTERED with the opening, not FITTED to it**, and enlarging a registered
  picture is the one operation that can only break it.
- **THE STILL CONTROLS ARE HIS OWN T7 DEFECT, ONE LAYER OUT.** T7, 2026-07-29:
  *"the control panel must move WITH the glitch."* The fix then was structural —
  `#feedgroup` holds everything down the wire. **Then the chyron left the twin
  on 2026-08-26** and became a sibling of the moving group again, further out
  than where T7 fixed it. **The same defect, reintroduced by a migration.**
- **THE MACHINE REPORTS ITS OWN DISPLACEMENT** (`portal-jit`, on change only,
  always returning to 0,0) and the museum composes it with its own tear slip.
  Verified: at rest none; twin's glitch -> both groups `translate(1px, 0px)`;
  the tear -> picture `translateX(7px)` and both groups `translate(7px, 0px)`;
  **the bezel `none` throughout, inline and computed.** That is the other half
  of T7. And the hit areas travel with them, because it is a transform.
- **NEW `MG-a`:** one live emulator now runs behind a television for as long as
  the Portal is open. The honest reading of *"running regardless"*, and a cost
  nobody has measured — stated so a later round meets it as a decision.

### 2026-08-27 -> CH4's THREE MARKERS, AND THE SEARCH THAT MISSED TWICE (thirteenth packet)
- **ONE THING NEEDS MIKE'S EYE and it is old.** **NOTHING IS COMMITTED.** Gates:
  lint **9/7 = baseline** - build green - launch green - provenance **PASS** -
  `reveal:check` - `parity:gate` - `instory:gate` - `docs:numbers:gate` **PASS**.
  Log: `docs/MUSEUM_CH4_MARKERS_LOG-20260827.md`, copy at
  `C:\AI\_night-20260827\ROUND_LOG_5-20260827.md`.
- **HIS FOLDER IS REACHABLE AND THE TREE ALREADY HELD HIS FILES.**
  `OneDrive\Desktop - Laptop\ADD TO REPOS\TEMP - Use it or lose it!\Weird.Baby
  Files\EDITED IMAGES - VIIIp`. **The repo copies are BYTE-IDENTICAL** — marker
  `d9e04fc1…` and plate `d5d71828…`, both matching. **The only difference is the
  NAME**: his spaces became underscores on the way in, **which is exactly the
  shape that makes a filename search miss.** Outside git, same class as
  `C:\AI\START_HERE.md`; recorded now at the site that uses it.
- **THE THREE MARKERS ARE HIS THREE, IN HIS ORDER.** Sorted top-to-bottom then
  left-to-right they come out exactly as he listed: front (863.4, 692.6), top
  (2139.5, 693.6), both 1071x522; lens dot (861.2, 1935.5), 141x143. **The dot's
  fill ratio is 0.786 against pi/4 = 0.7854** — the arithmetic saying it is a
  circle, so the flash keeps its shape and only moves.
- **CH4 IS FOUR CSS OVERRIDES, NOT A SECOND IMPLEMENTATION.**
  `body.monbase.closeup` carries one extra class so it outranks `body.monbase`
  on `left/top/width/height` **while every other property still comes from CH3's
  rule** — the content, the radius, the gradient, the shadow, the
  `shutterflash` animation, the S9a feather, the W9 rolling band. Change how a
  screen behaves and both channels move together.
- **ALL THREE ELEMENTS VERIFIED LIVE ON BOTH CHANNELS**, to three decimals
  against his marker, including firing `Click_Flash()` and reading the
  pseudo-element back. **The toggle is seamless STRUCTURALLY**: both plates are
  3000x2400, so both stages are 1.25 and the frame does not reflow — measured
  1052x842 on each.
- **HE WAS RIGHT TWICE AND OPS HAD REPORTED BOTH AS NEVER-EXISTED.** Monitor
  resize is `Portal_Grip_In()`, built at `fc4cc80` to his own T3 ask, **still in
  the file**, made inert by `efc379f` on 2026-08-22 — disabled, not deleted.
  Channel 4 arrived at **`8e67b5b`, 2026-08-12**, carrying his close-up plate as
  a static picture on drum position 4. **And `docs/MUSEUM_CHANNEL_4_LOG-20260812.md`
  was in `docs/` the whole time**, with a section that answers the question
  outright — including that his marker was filed `role: source`, `ref: null`,
  **catalogued and never wired.**
- **THE LIVE TWO-SCREEN CH4 NEVER EXISTED, AND THAT WAS PROVED PROPERLY.**
  Pickaxe over ALL refs in BOTH repos on the marker centroids and the aperture
  fractions: **zero.** `--diff-filter=D`: nothing. `git fsck --lost-found`
  content-scanned: zero. No `closeup` tier in any revision of either twin.
  **`28.78` returns one commit in all history and it is a Bandcamp audio
  ingest.**
- **THE PATTERN IS NOW A §8 HAZARD ROW, because it is a method and not an
  incident.** A grep of HEAD is blind by construction to the four states lost
  work is in — **deleted, renamed, in the OTHER repo, or outside git**. **A
  silence from `grep` is evidence about HEAD and nothing else.** The search that
  would find it, cheapest first: **(1) read the round log of the day it landed**
  — one `grep -il` over `docs/`, skipped twice; **(2) `git log --all -S` on
  CONTENT not NAME**, because the name is what changes; (3) `--diff-filter=D`;
  (4) **the other repository**; (5) `git fsck --lost-found`; (6) off-git disk.
  **Steps 1 and 2 alone would have answered both.**
- **ALMOST NOTHING CHANGED IN THE TREE AND THE REPORT SAYS SO.** The
  three-element CH4 was built in the twelfth packet and is correct; this round
  proved it against his artefact and recorded the provenance. **No coordinate
  moved.**
- **`CH-d` FROM 2026-08-12 IS REOPENED AS `MF-a`:** his close-up is a composite
  with an **unfilled lower-right panel** and unread embossed lettering. It sat
  behind a static picture for a fortnight and is now the live plate at 3.27x.

### 2026-08-27 -> THE MARKERS AND THE GRIP (twelfth packet)
- **NOTHING NEW NEEDS MIKE BEYOND A LOOK.** Two rulings said INSPECT AND REPORT
  FIRST and both investigations ran before a line changed. **NOTHING IS
  COMMITTED.** Gates: lint **9/7 = baseline** - build green - launch green -
  provenance **PASS** (5 added, 3 pruned) - `reveal:check` - `parity:gate` -
  `instory:gate` - `docs:numbers:gate` **PASS** - `reveal:day` nothing to move.
  Log: `docs/MUSEUM_MARKERS_AND_GRIP_LOG-20260827.md`, copy at
  `C:\AI\_night-20260827\ROUND_LOG_4-20260827.md`.
- **CH3 AND CH4 ARE TWO PLATES WITH TWO MARKER SETS, AND BOTH MARKER FILES ARE
  IN THE TREE.** Resolved by connected-component scan, not by eye:
  `monitor_base_markers.png` (CH3) front **(869.2, 1047.1)** top
  **(2118.2, 764.0)**, both 327x159; `MGK-TWIN_MONITOR_CLOSE_UP_MARKERS.png`
  (CH4) front **(863.4, 692.6)** top **(2139.5, 693.6)**, both **1071x522**.
  Each also carries a lens dot.
- **CH3's LIVE NUMBERS WERE ALREADY HIS, AND THAT WAS VERIFIED NOT ASSUMED.**
  `twin.html`'s 28.9667%/43.6250%, 70.6000%/31.8333%, 10.9%x6.625% and the
  59.4583% flash all match his marker **to a tenth of a pixel**. Nothing about
  CH3 was ever eyeballed.
- **AND CH4 IS NOT A CROP OF CH3 — THE MARKERS PROVE IT.** In CH3 the two
  screens sit **283px apart vertically**; in CH4 they sit **one pixel apart**.
  No crop, scale or pan produces that. Two shots, two poses, exactly as he said.
- **OPS WAS WRONG ABOUT THIS TWICE AND THE SECOND TIME WAS WORSE.** First
  "EXACTLY" was read as identical, deleting the channel; told that was wrong,
  Ops made it a **3.2x crop of CH3's photograph**, derived by comparing a glass
  feature between the two images. **A number measured correctly, answering a
  relationship that does not exist** — which looked like diligence. Both
  readings threw his artwork away.
- **`view: "closeup"` -> `?view=closeup` SELECTS THE PLATE AND ITS MARKER
  GEOMETRY TOGETHER**, because they are the same fact. Verified served: CH4
  draws `CLOSE_UP.png` with apertures **375.6 x 183.0 at 28.78%/28.86% and
  71.32%/28.90%** — his marker converted against the canvas, landing exactly —
  and is live (`unitPowered` true). **CH3's address is unchanged to the
  character**; a standalone twin is untouched. The derived 3.2x zoom mechanism
  is **deleted, not left behind a falsy prop**.
- **THE DRAG-RESIZE'S SHAPE WAS REPORTED BEFORE IT WAS BUILT**, and the report
  found a real defect. `.ps` scales as one object (everything inside is already
  `cqw` or % of it), 0.35 to the fit, session-persisted on release, double-click
  resets. **The ceiling is the fit because above it `.ps-wrap` CROPS THE
  BEZEL** — the frame is the object.
- **THE CONSEQUENCE THAT WOULD HAVE BEEN DISCOVERED RATHER THAN NAMED:** the
  bend is measured from client rects, and a drag writes a CSS variable without
  a React render or a `resize` event. **Measured before the fix: dragging
  1000x800 to 700x560 left the `[X]` carrying `translate(12.19px, 5.04px)
  rotate(6.43deg)` BYTE FOR BYTE** — a bend sized for a frame 43% larger. The
  drag calls the bend now; verified the scales go 32.41 -> 22.68, exactly 0.7x.
- **AND ONE MORE, MEASURED:** `@container (max-width: 640px)` on `.pc-root` and
  `.ps-note` now fires at a size the VISITOR chooses. TERMINAL.EXE reads **27px
  at the fit, 21.6px at 0.60, 12.6px at 0.35.** Left alone — a dragged-small
  frame is a small frame — but stated. Row `ME-b`.
- **THE BARREL MOVED FROM A TRANSFORM TO AN `feDisplacementMap`, WHICH IS THE
  BETTER MECHANISM.** A CSS filter moves PIXELS and does not touch hit testing,
  so the ink bends while the box stays on the twin's measured grid. Measured:
  both groups filtered, maps 1634/1646 bytes, **displacement scales 32.41 and
  36.86** (±16.2px and ±18.4px of ink), **no button carries a transform**, and
  **all eight hit tests land on their own button**. The target does not move
  with the ink — it never moves.
- **A COMMENT BOUNDARY BROKE FOR THE FOURTH TIME TODAY, THE OTHER WAY ROUND.**
  The first three orphaned a `*/`; this one SWALLOWED one and `portal.js` would
  not parse. **The class is not "I append past a closed comment" — it is that I
  edit comment blocks by text replacement without checking the delimiters
  survive.**

### 2026-08-27 -> THE CURSOR, THE BARREL, CH4's ZOOM AND THE GRIP (eleventh packet)
- **ONE LOOK NEEDS MIKE.** He reviewed the tenth packet (*"NICE!!!"*) and ruled
  four things; two said INSPECT FIRST and both investigations ran before a line
  changed. **NOTHING IS COMMITTED.** Gates: lint **9/7 = baseline** - build green
  - launch build green - provenance **PASS** (6 added, 2 pruned, 0 inbound
  chains) - `reveal:check` - `parity:gate` - `instory:gate` -
  `docs:numbers:gate` **PASS**. Log:
  `docs/MUSEUM_FOUR_RULINGS_LOG-20260827.md`, copy at
  `C:\AI\_night-20260827\ROUND_LOG_3-20260827.md`.
- **"THE ONSCREEN CONTROLS HAVE NO EFFECT APPLIED" — HE WAS RIGHT, AND THE
  MEASUREMENT SAID WHY.** The ink WAS moving (up to 12.33px) but **no button was
  reshaped — width and height changed by 0.000 on all five, tilt 0°.** A
  translation is not a distortion. And **the group sits entirely in one
  quadrant**, so a radial field gives it a near-constant gradient: all five keys
  moved the same way by almost the same amount, which reads as nothing.
- **THE FIX WAS TO SUBTRACT THE MEAN AND ADD THE SHEAR.** The uniform part was
  invisible AND was the part that would relocate the group off the twin's own
  measured coordinates. With it gone the coefficient can rise: now **tilt 1.20°
  -> 6.43° across the strip, scale 0.984 -> 0.965, every button reshaped.**
- **AND THE POSITIONAL TERM HAD TO BE HELD BACK.** A first pass at 0.34 measured
  **70.05px of spread along the strip against 29.24px across it** — five keys
  that exactly fill a 311px box cannot fan out by 70px without becoming a
  different object, and the 2x2 above shares that box's edge by arithmetic.
  **A lens bows a row of keys; it does not pull them apart.**
- **HIS INVARIANT PROVED, NOT ASSERTED:** every part of the bend is a
  `transform`, so hit testing travels with the ink. `elementFromPoint` at each
  warped key's visual centre returns that key, **five of five**.
- **THE DRAG-RESIZE WAS NEVER REMOVED — IT HAS BEEN INERT SINCE 2026-08-22.**
  `git log -S "Framed_Fit"` gives `efc379f` (introduced) and `b56cc0e` (touched).
  **`b56cc0e`, the 4:3 crop and the obvious suspect, is NOT the cause** — the
  disabling rule is byte-identical in both and at HEAD. Measured in a framed
  twin: the grip is in the DOM at `opacity:.34`, `Portal_Size_Set` RUNS, and the
  stage reads **1185x948 before, at 140vh and at 50vh**. He was pulling a
  control that was drawn, wired, and moved nothing.
- **`efc379f`'s RULE STANDS; THE HANDLE WAS THE DEFECT.** A picture that resizes
  under a frame that cannot resize with it would never register — correct, and
  not reversed. What was wrong was leaving the handle drawn. Hidden framed now
  (standalone unchanged), and **the gesture is restored one layer out** on
  `.ps` — bezel, picture, controls and way out together, the twin's own mapping
  and its session rule. Measured: **1000x800 -> 740x592**, aspect held,
  persisted `0.74`, double-click back to fit.
- **"EXACTLY" WAS OPS' PARAPHRASE AND IT COST CH4 ITS ZOOM.** The brief said
  *"should show EXACTLY what CH3 shows"*; he meant RESPONSIVE like CH3, and
  **his own next sentence said so** — *"two zooms of the same unit."* CH4 is the
  live twin at **exactly 3.200x**, verified, with the scale **derived from the
  plate it replaces** (the same glass feature: 1014px vs 324px, and 981 vs 297).
  **It is layout, not `transform: scale()`** — a bigger iframe BOX, so the twin
  lays out larger and is sharp, which is the failure the top-screen enlargement
  was reverted for this morning. The top glass draws **370.4 x 180.1** against
  114.66 x 55.75 on CH3.
- **AND CH4 IS NOT THE ANSWER TO `MD-a`, WHICH IS SAID PLAINLY:** the canvas is
  still 384x192, so it is the same pixels drawn larger.
- **THE CURSOR LANDS ON THE VALUE NOW** — *"Scroll to READY (not to RUN)."* The
  first cut contradicted its own argument by marking the one half of the row
  that never changes. **The aerial was already right and is the proof of the
  rule.** Measured: `READY` computes the ink background, `RUN` computes
  transparent.
- **THREE DEFECTS OF MY OWN.** I appended prose past a closed comment **for the
  third time** (vite 500, empty page). **My own regex reported the barrel's
  translate as zero when it was not** — Chrome normalises `translate(-28.62px,
  -12.11px)` with a space after the comma and my pattern had none, so I nearly
  diagnosed a working feature as broken; **a regex over a normalised value is a
  probe, and §0 applies to it.** And the rig served a pre-edit module once.

### 2026-08-27 -> TERMINAL.EXE, THE CONTROL SETS AND THE BARREL (tenth packet)
- **FIVE THINGS NEED MIKE AND FOUR ARE ONE WORD EACH.** He reviewed the ninth
  packet served (*"Overall looks good"*) and ruled this one whole. **NOTHING IS
  COMMITTED.** Gates: lint **9/7 = baseline** - build green - launch build green
  - provenance **PASS** (18 added, 5 pruned, 0 inbound chains) - `reveal:check` -
  `parity:gate` - `instory:gate` - `docs:numbers:gate` **PASS**. Log:
  `docs/MUSEUM_TERMINAL_AND_CONTROLS_LOG-20260827.md`, copy at
  `C:\AI\_night-20260827\ROUND_LOG_2-20260827.md`.
- **"MODE A" AND "MODE B" ARE RETIRED, AND THE NAME WAS CAUSING THE BUG.** Mike:
  *"stop calling it Mode A and Mode B. This one is TERMINAL.EXE."* There was
  never a Mode A — there is the television, the machine on channel 3, the test
  signal, and TERMINAL.EXE. Naming three surfaces after the fourth's absence is
  what produced a single boolean `controls` gating the word group and the digit
  strip **together**, which is why the wrong controls were on the wrong screens.
  **17 substitutions across 8 files, all comment text**; checked first that zero
  register rows carry either phrase in a visitor-facing string.
- **THREE CONTROL SETS, DECLARED NOT BRANCHED.** *"It's OK for TV channels to
  have a different control set than the VIIIp controls."* Television `1 2 3 4 X`
  · CH3 `SCROLL CLICK SHAKE 1 2 3 4 X` · TERMINAL.EXE `SCROLL CLICK X` — all
  three verified served. **The boolean could not express what he ruled**: words
  without digits was not expressible at all. Two independent declarations now.
- **POWER CAME OFF, AND IT WAS MEASURED BEFORE IT WAS CUT.** `Power_Standby()`
  says the unit arrives OFF and POWER starts it — if true, removing POWER would
  have left channel 3 permanently dead. **Two readings taken first:**
  `unitPowered=true` inside the frame with POWER never pressed, and the museum's
  own mirror latched. Every arming bank carries `power:"on"`. **Reading the
  recipe would not have been evidence; the page was.**
- **1 2 3 4 X CAME BACK AND IT IS A SCOPE, NOT A REVERSAL** — *there are no
  channels* was about the bare terminal, and he got stuck with no way to change
  channel on the TV. `feedChannel` still decides what RUN opens; nothing from
  yesterday is undone. **The round trip cost one line each way, which is the
  argument for having deleted both ends**: a dead listener would have made the
  restoration invisible in the diff.
- **SCROLL AND CLICK, AND A NON-CHANGEABLE FIELD CANNOT TAKE THE CURSOR.**
  Measured: seven stops wrapping `ANT1..4 -> SOURCE -> RUN -> FEED`; CLICK acts
  on the stop it stands on. With a bank that does not arm, **RUN reads NOT READY
  in the open and the rotation drops to six with RUN unreachable.** *"A cursor
  that can only stand on a changeable field IS the mark"* — which is why he
  struck his own idea of underlines and asterisks.
- **THE SCREEN CLEARS, THE PANEL IS CGA-FAT, AND THE HALT IS THE BOOT
  BACKWARDS.** `> PORTAL_2v16.CFG / > Closing...... / > UNIX-6x Emulator / >
  TERMINAL.EXE` — **no noun that was not already published**, his six dots
  carried. **`Closing` is Ops' word and is filed HOUSE, not MIKE.** Measured:
  panel gone at 110ms, four lines out by 770ms, **overlay closed at 880ms**.
- **THE BARREL'S SIGN WAS WRONG ON PAPER FIRST.** `r(1+kr²)` moves corners
  further than mid-edges, which is **pincushion**. Verified on the rendered
  path: top edge midpoint **6.84 units ABOVE its pinned corners** — barrel. The
  card's geometry is BENT, not filtered (42 paths, 0 straight primitives): a
  filter would resample 0.7-wide hairlines into mush.
- **AND THE CONTROLS BENT THE WRONG WAY FIRST, PAST MY OWN WRITTEN REASONING.**
  The comment explaining why `offsetLeft` was the right choice was already in
  the file; **`offsetLeft` is relative to the nearest POSITIONED ancestor**,
  which is `.ps-ctl`, not the frame. Measured `SCROLL translate(-30.32px,
  -26.33px)` for a button in the lower-RIGHT quadrant. **A stated rationale is
  not a measurement.** Fixed with rects + a clear-first pass.
- **THE PANE'S VIEWPORT COLLAPSED TO `innerWidth: 0` MID-ROUND**, and every rect
  went to zero — which looked exactly like a regression in the component I had
  just rewritten, with §8's *circular size resolves to zero* describing that very
  element. **Settled by walking the ancestor chain**: `.ex-root` was 16px too.
  Fixed by a sized same-origin iframe rig (1280x800); every geometric claim was
  re-taken in it. Three more probe faults, same family: a period-6 scroll walk
  that was really 7 (React had not committed), `MutationObserver` reporting 0
  mutations, and a boot that looked stuck for 8s then advanced (coalesced
  timers). **None of them was the build.**
- **THE LINTER FOUND TWO REAL DEFECTS AND BOTH WERE FIXED, NOT SUPPRESSED**:
  `set-state-in-effect` on the phase (**the same rule this wing corrected itself
  on last round**) and a component created during render, which resets its
  subtree every pass — fatal on a screen whose whole job is a cursor sitting
  still. **And one invented string was REMOVED rather than declared:** a
  `|| "SOURCE"` fallback legend the code it replaced did not have.
- **THE TOP SCREEN IS REVERTED ON HIS LOOK** — *"put it back how it was because
  at least it was readable"*. `maskTop` and `maskFront` now measure identically.
  **Why bigger was worse:** the glass is a fixed 128x64 canvas, so enlarging
  adds no pixels of type — it magnifies the scanline gaps with it. The
  readability question is FILED (`MD-a`), not solved.
- **THE TITLE BARS ALREADY COMPLIED** and nothing changed; three other surfaces
  still carry the full form and **none is a title bar** — flagged, not changed,
  because one of them is a full form he ruled on purpose.

### 2026-08-27 -> THE CHANNELS, THE TEARS AND THE BOARD (ninth packet)
- **TWO THINGS NEED MIKE AND BOTH ARE LOOKS WITH A NUMBER ATTACHED**, plus the
  review he asked for and did not get last round. **NOTHING IS COMMITTED.**
  Gates: lint **9/7 = baseline** - build green - launch build green - provenance
  **PASS** (5 added, 7 pruned, **0 surviving rows changed**) - `reveal:check` -
  `parity:gate` - `instory:gate` - `docs:numbers:gate` **PASS** - `reveal:day`
  nothing to move. Log: `docs/MUSEUM_CHANNELS_AND_TEARS_LOG-20260827.md`, copy
  at `C:\AI\_night-20260827\ROUND_LOG-20260827.md`. Served at
  `http://localhost:5173/robots` -> Portal -> `01 TERMINAL.EXE`.
- **THE CHANNEL STRIP WAS A CONTROL THAT DID NOTHING, AND THAT WAS MEASURED
  BEFORE IT WAS TOUCHED.** At the declared default `1111` all four positions
  resolve to television, so pressing `3` lit the `3` and left the same picture
  playing. Mike's ruling — *"You do not change channels, as there are none. The
  channels are inherent to the feed"* — is the correct diagnosis, not a
  preference. The four digits and `wb-portal-select-channel` went **both ends
  together**; `feedChannel` makes the ROUTING the selection (lowest CAB
  position, else channel 1), which is the declaration's own sentence: *"every
  channel taken, nothing listening."* **RUN was `chRows[0].ch`** — his own
  *launches it, on channel 1* — and with the buttons gone that one line would
  have made three channels of four unreachable. Verified served: `1111` ->
  television, `0111` -> test signal, `1101` and `1110` -> the machine.
- **FOUR REVERSALS, EACH RECORDED AS A REVERSAL AT THE SITE WHERE THE OLD RULE
  WAS ARGUED** — the channel strip, the view-wide tear (CR1/FORK A (b)), CH4's
  close-up, and `f366d37`'s house name on the board. **None of the four old
  arguments was deleted**; three are still correct about what they were arguing
  and were outweighed rather than refuted. §8 of the round log tabulates all
  four in one place for a session that later finds the tree contradicting canon.
- **THE TEAR IS CROPPED BY THE OPENING AND NOTHING WAS ADDED TO MAKE IT.**
  `.ps-feed` is `z-index:0` (a stacking context) under `.ps-bezel` at `z-index:1`
  — the same mechanism that makes the curved edge a crop — and the bezel PNG is
  opaque across the band (measured on its own alpha: opaque `1..221`, opening
  `222..2773`, opaque `2774..2989`). It is a **sibling of `.ps-slip`, not a
  child**: the slip moves the picture, the tear is the seam it moved AT.
  Height is now a share of the picture; `1.1` drew 7.92px as `vh` and **7.9px**
  as `%`. No number in `TEAR_SCRIPT` changed.
- **THE 08-26 RESIZE FIX WAS ONE OF THREE STATES AND ITS PROBE COULD NOT SEE THE
  OTHER TWO.** It verified by removing the injected rule from an already-settled
  twin, which only ever measures that rule. Measured live pre-fix: **679.8 x
  332.9 @16.8 -> 546.1 x 436.9 @16.8 -> 944.8 x 755.8 @0**, the last scheduled by
  the network fetch that adds `body.portal`. Uncapping was not enough because
  each tier declares its own `display` and `aspect-ratio`; the framed stage is
  now declared whole. Proved by construction: **945 x 756 at x 0 in all three
  tiers**, against 945 x **8736** in the first tier under the 08-26 rule alone.
- **THE FRONT-GLASS VIGNETTE WAS FOUND BY ELIMINATION, NOT ASSUMED.**
  `elementsFromPoint` down the stack at `#maskFront`'s centre: the only mask,
  filter, opacity or blend anywhere on it is S9a's feather. Halved on the front
  ONLY (4% -> 2%, 1.2% -> 0.6%); T keeps it, because T also carries the W9
  rolling band and he named the front.
- **I LOOKED AS HE ASKED AND MY NUMBER IS NOT HIS, SO BOTH ARE ON THE RECORD.**
  The top aperture is +19.99% as ruled, but the photographed glass measures
  **~304 x 108** against an aperture that was **327 x 159 before** — already
  taller than the glass. *"Go look, but I est 20%"* asks for a number back, not
  a substitution: his number is built, the measurement is row `MC-b`.
- **THE BACKSLASH HAZARD FIRED TWICE BEFORE A SINGLE CHARACTER WAS VERIFIED** —
  a shell counter died on `grep: Trailing backslash` and a `node -e` on
  `Unterminated regexp literal`. Both probes moved to files. **Counted on disk:**
  one backslash in each of the four labels and each of the four new register
  rows. All four glyphs land at **x 167.85** desktop and **x 58.70** at a true
  390px. The row that was C36's binding case went from F7's 16px of slack to
  **125.41px**.
- **THREE STALE-EVIDENCE CLASSES CAUGHT IN ONE ROUND, ALL BY SUSPECTING THE
  PROBE.** `ResizeObserver` delivered **zero** callbacks (delivery rides the
  rendering steps, which this pane does not run — the rAF family again);
  `elementsFromPoint` named the iframe as topmost over the tear because both the
  tear and the bezel are `pointer-events:none`, so **a hit test cannot answer a
  paint-order question**; and the prune removed **seven** rows where six were
  predicted — the seventh was checked rather than accepted and was correct.
- **I WROTE A FALSE CLAIM AND THE GREP THAT PROVED IT WAS MINE.** A note said
  *"zero references to `wb-portal-select-channel` remain in either repository"*;
  `instrument-panel.jsx` still has one, on purpose. Corrected at the site — a
  retired component's internals are its account of itself, it mounts on
  `face.panel`, nothing declares that, and **unmounted code registers nothing.**
- **NO PIXEL SCREENSHOT** — the pane did not composite on any attempt.

### 2026-08-26 -> THE BIG CHANGE: THE FEED GOES ON THE MONITOR (eighth packet)
- **NOTHING BLOCKS IT AND NOTHING IS COMMITTED — Mike reviews the look first.**
  Gates: lint **9/7 = baseline** - build green - provenance **PASS** -
  `reveal:check` - `parity:gate` - `instory:gate` - `docs:numbers:gate` **PASS**.
  Log: `docs/MUSEUM_BIG_CHANGE_LOG-20260826.md`; served at
  `http://localhost:5173/robots` -> Portal -> `01 TERMINAL.EXE`.
- **"TV - I CANNOT CHANGE CHANNELS" WAS REAL, LIVE AND MINE.** Measured both
  routes: via the album panel the face stays mounted behind the overlay and
  pressing 3 lit 3; **via Mode B the `.ip` count went 1 -> 0 at the same instant
  the digit strip appeared.** `wb-portal-select-channel` was answered inside the
  panel COMPONENT, and Mode B's console IS the overlay's content — **the strip's
  only listener was destroyed by the act that showed the strip.** Closed by
  moving the state to `feed-control.js`, owned by `RobotsExhibitFlow`, which owns
  the overlay: **the listener now outlives the strip.**
- **"HW Feed Monitor" NAMES NO OBJECT IN EITHER REPO**, so the reading is stated
  with its evidence rather than assumed: `Launch the Portal`'s FACE *was* the
  hardware feed panel and nothing else drew it, so his two rulings are one act.
- **THE SIGNAL MESSAGES WERE LOOKED UP BEFORE BEING DELETED**, because *"unless
  I prescribed it"* is the whole instruction. Both read **HOUSE** and both
  sources say *"Ops' own words"*. **`Test signal` and `Television` SURVIVE** —
  they are accessible NAMES, not messages, and deleting them would leave two
  channels unnamed for assistive tech.
- **THE MONITOR'S CHARACTER WAS NOT INVENTED.** `twin.html`'s `Mon_DOS` already
  writes a `>` prompt, a short uppercase command typed a character at a time,
  terse output lines and a blinking block — under its own rule **"OS voice, zero
  personality"** — and `Mon_EventsLine` writes ALL-CAPS state lines. **A bay
  becomes a line.** No knob, no lamp, no 2x2: that is the foolish version he
  named and it is what Mode B's first cut did.
- **ONE INK, AND ON IS INVERTED RATHER THAN BRIGHTER.** He struck the `[X]`
  partly for being *"bright instead of matching the other text on this screen"*,
  so the console has exactly one value — the twin's own `CARD_OFF` — and a live
  control knocks out instead of lighting up, which is what the digit strip
  already does.
- **THE PHONE CASE STOPPED BEING A CONSTRAINT, AND THAT IS EVIDENCE.** The
  hardware panel fitted a 251px opening by **1.4px** and the boot had to be
  hidden. A terminal is nine lines and reflows by one size: **all nine rows
  inside at 375px with the boot KEPT.** `MB-b` closes because the thing it
  described no longer exists.
- **FOUR DEFECTS OF MY OWN.** The antenna defaulted **`0000` against a declared
  `1111`** — the hook mounts before the declaration arrives and `useState`
  initialises once, so RUN landed on the test signal instead of television;
  fixed with the *adjust-state-when-a-prop-changes* pattern during render, NOT an
  effect. The prune **broke two `RESTATED` chains** (§9's named hazard),
  repointed onto the live `MGK-VIIIp` row. I appended prose past a closed comment
  for the **second time this session**. And **the dev server served one module as
  EMPTY while the build was green** — a stale vite transform cache, found by
  curling the module and comparing bytes, cleared by a byte-identical rewrite.
  **§8's *suspect the probe before the site* reaches the dev server too.**
- **`InstrumentPanel` HAS NO CALLER AND IS KEPT** as the only written form of how
  the hardware panel was built; nothing declares `face.panel`, the mount
  mechanism stays live, revival is one declaration. **Two ledger rows are flagged
  rather than cut** — deleting one is the M99 guard's own question. Row `MB-c`.
- **NO PIXEL SCREENSHOT** — the pane did not composite on any attempt. Every
  claim is painted-DOM and geometry against the bezel's own coordinates.

### 2026-08-26 -> MODE B, THE CONSOLE (seventh packet)
- **ONE WORD NEEDS MIKE:** does the album page keep its feed panel now that Mode
  B has one? His *"instead of the feed panel"* could mean delete it, and that is
  a decision about what a visitor meets. Both exist today and **read ONE object,
  so they cannot drift.** Row **MB-a**. Gates: lint **9/7 = baseline** - build
  green - provenance **PASS** - `reveal:check` **PASS** - `parity:gate` -
  `instory:gate` - `docs:numbers:gate` **PASS**. Log:
  `docs/MUSEUM_MODE_B_LOG-20260826.md`; served at
  `http://localhost:5173/robots` -> Portal -> `02 TERMINAL.EXE` -> RUN.
- **THERE IS NO `.bat` AND THE LISTING SETTLED IT.** Record 004's cracked ZIP
  carries **three files** - `TERMINAL.EXE`, `PORTAL_2v16.CFG`, `QC_101.TIF` -
  and zero `.bat` exists in either repo, in or out of story. So the file that
  runs is the one that is there; nothing was invented to stand in front of it.
  **The listing also already named Mode A** - `/ANTENNA (PWD)` and
  `/CHANNEL_SELECT(PWD)`, written before either shipped.
- **THE PANEL NEEDED NO CHANGE - IT NEEDED A MOVE.** `InstrumentPanel` was
  already `decl` in / panel out and already scaled to its parent, so it did not
  know it was on a CRT. It left `Exhibit.jsx` for its own module because a
  second caller would have cost `react-refresh/only-export-components` - the
  `use-yt-player.js` trade exactly. **Measured before the cut:** its six helpers
  are each referenced twice and by nothing outside that file.
- **A MOVE RE-KEYS THE REGISTER, AND THAT IS THE THING TO KNOW BEFORE THE NEXT
  EXTRACTION.** A row is keyed on `sha256(file + " " + string)`, so moving 438
  lines staled **15 rows**. They were **CARRIED** - each new row took the old
  row's `c` and `s` verbatim, because **a move must never become a
  re-classification** - then pruned with the sweep's own `--prune` after a hand
  probe disagreed with it (22 against 15).
- **`reveal:check` CAUGHT THE BEST DEFECT IN THE ROUND.** Record 005's new
  attachment declares `door`, and the editor's reader did not know the field:
  **Mike's first save from the day editor would have silently deleted it.**
  Fixed the way `record-entries.mjs` itself rules - the reader carries it
  through AND the set is widened, because `door` is an OBJECT and `val()` would
  have returned null and gone quiet.
- **FOUR DEFECTS OF MY OWN, ALL FOUND BY MEASURING THE SERVED PAGE:** the `[X]`
  and the frame were missing (no `bezel` on the action - counted `.ps-chy-x` = 0);
  the boot drew **under the bezel** (46.3px of every line hidden on `canvas`
  placement); the panel escaped its box at 375px because **a transform does not
  change the layout box** and `align-items:center` centred the unscaled height;
  and `PORTAL_2V16.CFG` - **a filename the listing does not contain** - because
  `.vp-face-sub` uppercases. **A filename's casing is its identity**; removed
  from the label slot rather than patched.
- **MODE B IS ITS OWN SCREEN AND THE `[X]` IS NOT A MODE A CONTROL.** 2x2 gone,
  digits gone, note gone - all measured 0. The way out stays, at the same pixel
  (S4: an exit that disappears when the picture changes is not an exit). **And
  the LATCH still launches Mode A** - measured, television came up with Mode A's
  controls back on it.
- **AT 375px THE PANEL FITS BY 1.4 PIXELS**, clamped at its 0.60 legibility
  floor: 250.1px drawn into a 251.5px hole. Boot hidden, safe area zeroed,
  1.0/1.6px overhang, **latch inside**. Row **MB-b** - the edge of what a CRT
  opening can hold, stated rather than tuned until it passes.
- **NO PIXEL SCREENSHOT** - the pane did not composite (rAF family), four
  timeouts across two tabs. Geometry against the bezel's own coordinates says
  what is where and nothing about how it looks.

### 2026-08-26 -> TELEVISION FILLS THE OPENING (sixth packet)
- **NOTHING IS WAITING ON MIKE.** He ruled the bars out and, mid-round on what
  looking found, ruled captions out too: **"I do not want closed captions."**
  Both are built and verified served. Gates: lint **9/7 = baseline** - build
  green - provenance **PASS** (after one `SINK_ALL` entry, below) -
  `reveal:check` - `parity:gate` - `instory:gate` - `docs:numbers:gate` **PASS**.
  Log: `docs/MUSEUM_TELEVISION_FILL_LOG-20260826.md`; served at
  `http://localhost:5173/robots` -> the Portal album -> LATCH.
- **THE LETTERBOX WAS IN THE SOURCE AND MIKE READ IT RIGHT.** `aA5oKoCRjWw` is
  16:9 with the picture matted inside it. Measured on **four frames at four
  timestamps** at native resolution: matte edge at **12.97% of the frame width
  each side**, **centred to the pixel** (left bar - right bar = **0** on every
  frame), hard edge rather than a fade (x=165 reads 4.72, x=166 reads 168.60,
  identical at every threshold 12-56).
- **IT IS 1.3167, NOT 4:3 - 1.25% NARROWER, WHICH IS THE SAFE DIRECTION.** The
  brief said stop if it is not 4:3, *because a crop that eats his picture is
  worse than bars*. Narrower means the crop lands FURTHER inside the black: it
  takes **12.5% a side** and stops **0.47% of the frame width short of his
  picture**. Reported rather than stopped, on the stop's own reason. Wider by
  the same margin would have been a stop.
- **THE PREVIOUS ROUND MEASURED HALF THE BLACK.** Its `303.6 -> 254.5px` are the
  player's own letterbox, top and bottom. The SOURCE's matte was putting a
  further **10.4% of the opening's width down each side** and nothing had
  measured it. Before: **10.43 / 10.39 / 12.26 / 11.81%** of the opening. After:
  **0 on all four**, at 800px and again at a true 375px.
- **A WRAPPER, NOT A SPECIFICITY FIGHT.** `PortalScreen.css` owns the feed box
  and its `.ps-feed iframe` rule `(0,1,1)` outweighs anything `Television.css`
  could write against the same element. So `Television.css` sizes `.tv-fit`,
  which it owns outright, and that rule keeps doing exactly what it says.
  **`!important` was reached for first** - §8 calls it the honest answer to a
  two-owner layout - **and was not needed.** `aspect-ratio: 16/9` rather than
  `width: 133.333%`: the latter is right by coincidence at a 4:3 box and breaks
  silently the day the box moves.
- **THE PLACEMENT IS UNCONDITIONAL; ONLY THE SOURCE DECIDES WHAT IT COSTS.** It
  always crops 12.5% a side and only **70.15%** of the frame is inside the hole.
  Here that is all matte; **a true 16:9 clip would lose ~30% of its picture**
  with nothing reporting it, because no gate here can read a cross-origin
  frame's pixels. Filed at the swap site beside `ytId` and as row **T-a**.
- **THE CAPTION FIX NEEDED TWO MECHANISMS AND ONLY ONE BINDS.**
  `cc_load_policy: 0` is the weak half - YouTube documents `1` as *force on* and
  reads anything else as **the viewer's own preference**.
  `unloadModule("captions")` is the half that does not depend on the viewer, via
  a three-line passthrough on `useYTPlayer` that /hr and /wal never call.
  **It runs on its OWN 500ms timer**, because the refusal watcher stops the
  moment the set is playing - the moment before the module exists - and the
  module comes back on **every** `loadVideoById`, once every 1,743s on the loop.
  Verified on a browser that had captions ON.
- **`provenance:gate` FAILED ON `"captions"` AND `"cc"` AND WAS RIGHT TO.** It is
  default-DENY. Declaring a YouTube module name as museum content would have
  been the wrong shape, so `unloadModule` joins **`SINK_ALL`**, the sweep's named
  list of call targets whose string arguments are machinery, beside
  `postMessage`. **One entry, not a family** - the sweep's own rule is that an
  over-broad look-away is the defect. Counted: machinery-call **218**, up 2.
- **I BROKE THE PAGE AND THE PAGE SAID SO.** The caption note was appended to a
  block comment that was **already closed**, orphaning a `*/`; vite 500'd,
  HMR refused, `/robots` drew 30 elements and no text. Found by looking, named
  by the console on the first read. **And the two `POST /api/visits` 500s are
  NOT mine** - that endpoint needs the worker's D1, which `vite dev` does not
  serve.
- **THE 5173 DEV SERVER IS THE 16:25 ROUND'S LEFTOVER**, the hazard the third
  packet recorded. This round used it rather than starting a second, and killed
  nothing on Mike's machine.

### 2026-08-26 -> THE COVER FENCES (fifth packet)
- **NOTHING BLOCKS IT, AND TWO THINGS WAIT ON MIKE'S EYE RATHER THAN ON A
  BUILD.** He ruled A / B / B on the album art and said what the rulings are
  worth: **"For now at least. I will not know until I start looking at the
  entire site."** All three are `OPEN` register rows (`A-a`, `A-b`, `A-c`) with
  his sentence verbatim in each, plus short-list rows 67 and 68.
  **NO COVER WAS REGENERATED, REDRAWN OR CHANGED.** Gates: lint **9/7 =
  baseline** - build green - provenance **PASS** - `reveal:check` **PASS** -
  `parity:gate` **PASS** - `instory:gate` **PASS** - `docs:numbers:gate`
  **PASS** (2 stale values corrected). Log:
  `docs/MUSEUM_COVER_FENCES_LOG-20260826.md`; the survey it acts on is
  `C:\AI\_night-20260826\ALBUM_ART_SURVEY-20260826.md`.
- **THE FENCE WAS ON THE ONE TOOL THAT WRITES NOTHING.** `make_unit_covers.py`
  is retired and carried `HAND_AUTHORED` alone since 2026-08-10; the four tools
  that DO write those paths had no fence at all. `covers:house` would have
  destroyed Mike's vinyl master, `covers:robots` his own `NEW Robots.png`,
  `covers:template` both of Mikey's photographs. **`tools/cover_fences.py` is
  one set for all five**, keyed on the BASENAME because §8's *a governed
  picture has two addresses*, checked over the WHOLE intended set before the
  first write, and `--dry-run` is guarded on the same reasoning.
- **FOUR OF THE FIVE GENERATORS NOW REFUSE EVERY RUN**, because every path they
  own is hand-authored or superseded. That is not a side effect — it is the true
  state of those tools and has been since 2026-08-10 without being enforced.
  `make_house_covers.py` is the only one with live output, through **`--only`**.
- **PROVED BY TRIPPING, AGAINST A COPY.** All five refuse, **all exit 1**; the
  five legitimate covers rewrite **byte-for-byte identical** (sha256 unchanged);
  all twelve files in the copy unchanged after nine runs; 25 of 25 tool×name
  refusals; four spellings of one file all refused; `SUPERSEDED` correctly
  tool-scoped. **The first harness read `EXIT 0` on every refusal and was
  wrong** — it piped python into `tail` and read the pipeline's code. The
  refusal text was correct and visible, so a wrong number sat under a
  right-looking result.
- **`--verify` HAS BEEN RED SINCE 2026-08-09 AND IS IN NO GATE.** 419,442
  differing pixels; the template's rule at rows 992–995 against the shipped
  file's at 1061–1064. **It is not drift — the comparand changed** when Mike's
  art was installed. Repointing it is one line and is **deliberately not done**:
  a check wrong for seventeen days is repointed by a round that then watches it,
  and it must not join §9's list before it can pass (`Q-b`'s argument). Row
  `A-d`, owned by Code.
- **FOUR SENTENCES IN THE TREE READ AS PERMISSION TO OVERWRITE HIS ART**, two of
  them carrying *"a re-render cannot drift"* about a file that is hand-drawn.
  `robots.js` ×2, `asset-table.json`'s `what` + `qualityNote`, and
  `ledger-declare.mjs`'s `route.wb` comment. **`provenance/assets.json` was
  already right** and the others were conformed to it. `verdict` and `bucket`
  untouched on every row — they are Mike's.
- **THE BACKSLASH CLASS IS NOT A JAVASCRIPT FACT.** Writing `\MUSIC` through a
  `python - <<'PY'` heredoc raised `invalid escape sequence '\M'` and **landed
  correct by accident.** Counted on disk instead: exactly one backslash each.
  §8 row.
- **NO PIXEL SCREENSHOT AND NONE WAS OWED** — nothing in this packet renders.
  The covers are untouched, and the changes are a new tool, four guarded
  entry points, two JS comments, two JSON judged fields and three documents.

### 2026-08-26 -> THE WING NAMES TAKE THE BACKSLASH (fourth packet)
- **ONE THING NEEDS MIKE AND IT IS A LOOK**, plus one word: whether the Gift
  Shop and the Information Booth join the shape. "Every wing takes it" was read
  as the four EXHIBIT wings, on his own M8 list (the booth is in it and takes no
  house name; the shop was never in it). Two strings each either way.
  Gates: lint **9/7 = baseline** - build green - launch build green - provenance
  **PASS** (16 added, 38 pruned) - `reveal:check` - `parity:gate` -
  `instory:gate` - `docs:numbers:gate` **PASS**. The log is at
  `docs/MUSEUM_WING_NAMES_LOG-20260826.md` and nothing was deployed.
- **`"\WORTH A LISTEN"` IS A LEGAL JS STRING WHOSE VALUE IS `WORTH A LISTEN`.**
  `\W` is not a recognised escape and the backslash is dropped **silently**; the
  source reads correctly in every editor and every grep. Ten literals landed that
  way, a second pass over-corrected six to four backslashes (renders two), and
  **a substring scan of the built bundle passed the broken ones** because
  the two-character escape `\\WORTH` is a substring of the four-character
  `\\\\WORTH`. What settled it was an audit that
  PARSES each literal and reports its RUNTIME value: 21 literals, one backslash
  each. **A backslash in a JS string cannot be checked by reading it.**
- **EIGHT FORMS OF ROBOTS COLLAPSE TO ONE SHAPE.** Board `Weird.Baby \Robots`,
  bar `\ROBOTS`, FAQ subtitle `WEIRD.BABY \ROBOTS`. Every wing, every surface a
  visitor reads. **The Record's four in-story forms are untouched** - Doctrine 21,
  and `09-PUBLISHED` freezes them; he named the board, the door, the FAQ subtitle
  and the Founder row, not the Record.
- **HIS LOWERCASE `a` RENDERS NOWHERE.** `.wb-dir-entry`, `.wb-bar-room` and
  every FAQ subtitle are `text-transform: uppercase`, so the board is uppercased
  too and `Worth a Listen` reads `WORTH A LISTEN`. **The first draft of the note
  in `worth-a-listen.js` claimed it survived on the board and was wrong** -
  corrected after measuring the CSS rather than assuming it.
- **M26 CLOSES ON ITS OWN THIRD OPTION** (*a ruling that the two may differ*) and
  **had been load-bearing while open**: `foundation.js` cited *(M26's own
  reading)* as doctrine for `name: "The Foundation"`. **Ops had built on an
  unanswered register row.** Named at the edit site.
- **C36's `6px` WAS STALE BEFORE THIS ROUND TOUCHED IT** - measured 2026-08-05 in
  a 373px rig and before the 1.45rem title ruling. True 390px today: **21.4px,
  and 17.9px after the ruling - a cost of 3.5px a side, no overflow.** Two wings
  GAINED slack (`\Music` +21.0, `\Foundation` +14.9).
- **21 OF THE 38 PRUNED REGISTER ROWS WERE PRE-EXISTING DEBT**, not this round's -
  17 `portal.js` and 3 `Exhibit.jsx` strings the ONE SURFACE round left behind.
  Each verified absent from source first; inbound `r` chains checked and **zero**.
- **NO PIXEL SCREENSHOT** - the pane does not composite in this session (the rAF
  family). Verified by painted-DOM reads and Range geometry on the served page,
  which says what the text IS and nothing about how it looks.

### 2026-08-26 -> THE MARKING INVERTS (third packet) + THE TV WAS OPS'
- **THE TV MIKE COULD NOT STOP WAS OPS' OWN LEFTOVER**, and the lesson is a
  hazard: **a dev server started for verification and left running is a thing
  that makes noise on his machine.** A live unmuted YouTube player sat in the
  app's Browser pane for 20 minutes; **closing browsers could not touch it
  because it is not in one**, and **killing the server would not have stopped it
  either** — the page was already loaded and the audio streamed direct from
  youtube-nocookie.com. **Sound first (close the tab), then the tree.** Closed
  and verified gone. `record-serve.mjs` on 8899 and a stale `servedist.mjs` on
  8955 (an earlier session's) were left alone; the 8955 one is Mike's to clear.
- **THE UNREAD RULE WAS NEVER THIS WEEK'S WORK** — `8fe959f`, 2026-08-05, its
  only commit, and the unread path is untouched since 08-19. It became visible
  because the read set is `localStorage` **per origin**, and Ops' dev server is
  a different origin from weird.baby.
- **IT MARKED THE WRONG STATE.** A first-time reader has read nothing, so every
  row grew a rule — **loudest exactly when it carries no information.** Dimming
  READ rows inverts it: clean on arrival, marking appears as you go. The old
  comment's own argument survives the flip word for word.
- **THE GROUND WAS NEARLY GOT WRONG AND THE PAGE CAUGHT IT.** `.vp-face`
  declares `--wb-ink` #ece9e0; the first ancestor that actually PAINTS is
  **`.vp-face-body` #faf8f3**. Same two inks read **5.15 / 4.56** on the mat,
  **6.22 / 5.50** on ink, **7.12 / 6.30** on what is really there. Wrong in the
  safe direction, which is the kind that does not announce itself.
- **`.86` IS THE PALETTE'S AA FLOOR, NOT A TASTE:** number 5.01:1, day 4.53:1;
  at `.85` the day drops to 4.46 and under AA. **The day binds** because
  `--wb-gold-mute` was raised to clear 4.5:1 on exactly this small mono. `.80`
  reads more clearly at 3.98:1 on the day and **is Mike's call, not a tuning.**
- **`read` IS A SECOND PROP, NOT `!unread`** — `unread` carries a
  `list.length > 1` guard that is about the LIST, so `:not(--unread)` would have
  dimmed the single row the dictation preview renders, which is the row Mike
  writes into.
- **THIRD STRUCK-FACT-READING-AS-LIVE OF THE DAY** (after `1.24cqw` and the
  `no [X] on channel 4` note): a 2026-08-10 comment saying `.vp-rec-mark-day` is
  deleted sat directly under the rule C1 re-added on 08-11. Cleared, keeping the
  half that is still true — the DATE stays out of the rail at 71.97px.

### 2026-08-26 -> THE 4:3 CROP + THE RESIZE THAT NEEDED NO COVER (second packet)
- **ONE THING NEEDS MIKE AND IT IS A LOOK:** whether the crop took the reference
  he meant. Gates: lint **9/7 = baseline** - build green - launch build green -
  provenance **PASS** - `reveal:check` - `parity:gate` - `instory:gate` -
  `docs:numbers:gate` **PASS** - `reveal:day` nothing to move -
  `assets:orphans` **13, unchanged**. Log:
  `docs/MUSEUM_CROP_AND_COVER_LOG-20260826.md`.
- **THE APERTURE CANNOT BE MADE 4:3 AND THAT DECIDED THE READING.** The opening
  is **2532 x 2003 = 1.264** on a plate whose replacement is shelved, so "the
  center 4:3 area" is a fact about the PICTURE. The three surveyed candidates
  **collapse to one rule** — each placement already knows its own rectangle:
  canvas `3000x2400 -> 3200x2400 at x-100` (art **x16/15 exact**), feed
  `2540x2036 -> 2714.67x2036 at x139.67`. Cover-box, never inscribed;
  inscribing letterboxes, which is the opposite of ENLARGE. Verified served on
  all four channels, hole covered on both axes.
- **THE MEASURED OPENING WAS DELIBERATELY NOT USED**: the feed rect is taller
  than the hole ON PURPOSE (0 hole px outside it), and cropping to the hole's
  own bbox hands that no-leak guarantee back **to buy 13px**. And the three
  candidates are **within 1.2% of each other as enlargements** — if the built
  one looks wrong, the other two will not fix it.
- **THE CROP TAKES A SIXTH OFF TELEVISION'S BLACK AND DOES NOT CLOSE IT:**
  303.6 -> **254.5px** a side, 30.3% -> **25.4%** of the opening. Same root as
  CH4's: **`object-fit` is inert on an iframe**, so a wider box only changes how
  YouTube letterboxes inside it. Closing it means sizing the player to the box's
  HEIGHT and overflowing its width (3619.6 wide). **Separate job, not built.**
- **B WAS REPORTED AND NEITHER SHAPE WAS BUILT, BECAUSE B WOULD NOT HAVE FIXED
  IT.** B is about RETURNING to ch3; the resize happens on the FIRST open too,
  so it would have paid the ONE OUTPUT guarantee and left the defect standing.
- **THE CAUSE, MEASURED BY CONSTRUCTION:** removing the injected `#framedfit`
  rule from a live framed twin and reading the stage back gives
  **828x662 at x36** against **900x720 at x0** — an 8.7% growth and a 36px
  shift, scheduled by a network fetch (73.5ms on localhost). `Framed_Fit()` now
  runs in `setup()` before `Unit_LoadPhotos()`; nothing in it ever needed the
  probe, and `setup()` is inline at the end of the body. **It also fixes the
  missing-base-plate case, where framed styling had never run at all.**
- **"SOME COVER" WOULD HAVE BEEN HIS WORD AND IS MOOT:** a cover is a thing a
  visitor looks at, so it is UX — but **the resize is gone rather than hidden**,
  and what remains is a load, which is what every channel does.
- **FIRST-PAINT TIMING COULD NOT BE MEASURED AND THE PROBE SAID SO.** The pane
  does not composite: a 25ms sampler returned **5 samples across 4,682ms** and
  `getEntriesByType('paint')` returns empty. Measured the two layout STATES
  instead — a stronger oracle for what they are, and none at all for how long
  the wrong one shows.

### 2026-08-26 -> ONE SURFACE (the Portal's controls, all four channels)
- **NOTHING BLOCKS IT.** Gates: lint **9/7 — A NEW BASELINE** - build green -
  launch build green - provenance **PASS** (15 added, 1 pruned) -
  `reveal:check` **PASS** - `parity:gate` **PASS** - `instory:gate` **PASS** -
  `docs:numbers:gate` **PASS** (4 published values corrected) - `reveal:day`
  nothing to move - `assets:orphans` **13, unchanged**. Log:
  `docs/MUSEUM_ONE_SURFACE_LOG-20260826.md`.
- **THE SURVEY LED WITH A STRUCK NUMBER.** Ops reported the control quadrant
  FULL; it is **59.0% full**. The quoted *"1.24cqw on every side"* is the P2
  note of 2026-07-29 that **P2b superseded hours later**, and the live figure
  (3.34 / 4.06cqw) is stated eleven lines below it at `twin.html:903`. Mike's
  screenshot was the correction. **A struck number in a comment reads exactly
  like a live one** — the replacement paragraph states both and names which
  superseded which.
- **THE 2x2 LEFT THE TWIN BY THE SAME ARGUMENT THE DIGIT STRIP DID, NOT A
  SECOND ONE.** A control living in `twin.html` can appear on one channel of
  four, because the overlay unmounts that document. `Framed()` removes
  `#monctl` as it already removed `#monlayout`. **Two implementations on disk
  is FORCED**: the twin is single-file/no-network by standing constraint, so
  neither can import the other. They share five numbers (`CHY_M`), and every
  one was measured on the page at a 900px frame — 133.20 / 54.00 / 47.34, both
  rows 279.90 wide at the same x, **sharing one edge by arithmetic**.
- **SCROLL KEEPS ONE MEANING AND THE IGNORING IS THE RULING.** Mike withdrew
  channels-on-SCROLL after review, so §3's one-control-two-meanings fault is
  **not created**. A control reaching nothing on three channels of four reads
  like a `TODO`; the reasoning sits at the listener that ignores it.
- **BOTH TEARS, ON SEPARATE CLOCKS.** A press does not advance the script's
  index, reset its timer or consume a step — **a press cannot make an unbidden
  event less unbidden**, which is the whole of why the scripted rip keeps its
  point. **The absence of a reason for the tear is recorded as DELIBERATE at
  the tear** (Doctrine 12; an invented reason is worse than none).
  **And the slip had only ever reached the `<iframe>`** — on television the rip
  drew with nothing moving under it. It is on a wrapper now: measured
  `translateX(7px)` on ch3, `-4px` on television, both clearing.
- **CH4 IS AN `<img>` AND THE ART WAS NEVER THE PROBLEM.** 3000x2400, registers
  with the bezel at **0px across nine of eleven rows**. `object-fit` is inert on
  an iframe, so that rule had been dead since it was written and the browser's
  own image viewer was drawing. The channel declares `picture: true` — data, in
  the shape of `bezel` and `note`.
- **THE KNOCKOUT IS MEASURED, NOT ASSERTED.** The browser painted the shipped
  `--knock` to a canvas: corner `rgba(255,255,255,255)`, **centre
  `rgba(0,0,0,0)`**, 7.87% of the slug transparent, three runs down the middle
  column of a `3`. **Ink would read `[0,0,0,255]` and zero transparent.**
- **THE BASELINE MOVED AND THE FIRST ATTEMPT MOVED IT WRONG.** Hoisting
  `TEAR_SCRIPT` fixed the deps honestly; the first cut had silenced them with a
  disable, **which moves the number while changing nothing.** Undone. No rule is
  disabled anywhere in this packet.
- **`Launch the Portal` IS A REVERSAL, NOT A CORRECTION, AND CANON NOW CARRIES
  SIX NUMBERED STEPS** so a later round can tell step 5 (Ops fixing its own
  write-up) from step 6 (Mike ruling differently). The `id` stays `portal`.
- **FLAGGED, NOT FIXED (his ruling):** `monFeed` pinned at 1 inside the museum
  since 2026-08-21 — the selector doc's **WATCH IT** row predicted it and
  nothing read that document. `OPEN_ACTIONS.md` **W-a**.
- **NO PIXEL SCREENSHOT.** The Browser pane does not composite in this session
  (§8's rAF family: the page runs, it does not paint), so the visual claim was
  proved by reading painted pixels instead. **Mike is the first eye on the look.**

### 2026-08-21 -> RECORD 005 + THE QUEUE FILED - sealed
- **NOTHING IS WAITING ON MIKE. Deploy before 17:00: `npm run deploy:launch`.**
  Gates: lint **9/8** - build green - launch build green - provenance **PASS**
  (2 rows, 1 stale pruned in place) - `reveal:check` **PASS** - `parity:gate`
  **PASS** - `instory:gate` **PASS** - `docs:numbers` **PASS** - `reveal:day`
  nothing to move - `assets:orphans` **13**. Log:
  `docs/MUSEUM_RECORD_005_LOG-20260821.md`.
- **005 HAS ITS OWN HEADLINE AND THAT IS THE POINT OF IT.** `PORTAL CONNECTION
  ONLINE`; **002 and 004 still share `GENERAL STATUS UPDATE`** - Mike's, and
  deliberate. A headline that differs is the cheapest signal a Record has and it
  is spent on the week's payoff, not on a Tuesday.
- **ONLY THE DETAILED REPORT CHANGED**, from one line to three - the deck, the
  executive summary and OTHER were already correct to the character, checked
  before touching anything. **VERIFIED TWICE: on the built LAUNCH bundle** (all
  five strings present as single literals, and the old line plus six struck ones
  plus `{Mike to rewrite}` all return zero) **and on the page** (5 of 5, line for
  line).
- **TWO FIRST APPEARANCES, FILED AS CANON RATHER THAN LOGGED** -
  `docs/canon/06-PORTAL.md` **§10**, both PUBLISHED. The **UNIX-6x Emulator**
  (*"our"* - the 2026 side runs the 1965 software; it is the name of the shim the
  FAQ already described) and the **COMM payload with autosync** (the first thing
  in the corpus saying the Portal talks outward by itself). Neither string
  existed in either repo before this line. **`etc.` is his and is load-bearing.**
- **OPS INFERRED ANT/CAB BACKWARDS AND MIKE CORRECTED IT: `ANT` IS TELEVISION,
  `CAB` IS HARDWIRED AND CARRIES THE MGK UNITS.** The inference is kept, named:
  it chained three plausible readings (the ANTENNA legend, QC_101's `ANTENNA
  FEED ASSIGNMENT`, `BROADCASTS ON FEED NO. 3`) into a confident answer **with
  no measurement under any link**, and missed the ordinary reading - an aerial is
  how television arrives; a machine in the room is wired to the back.
  **It was filed as a READING rather than as canon, which is the only reason it
  cost one line to correct.**
- **FIFTEEN ITEMS OUT OF CONVERSATION AND INTO `docs/BACKLOG.md`** - the leak
  Mike told Ops to close. Filed under THE QUEUE, each with what is known, not
  ranked against his 08-16 order.
- **"THE FEED STEPPER DOES NOT STEP" - IT STEPS.** Measured: PATCHED -> COLD
  START -> FIRST RUN -> LAST STATE, both handlers bound. **What did not change
  is the only thing the eye was on:** every bank is `NIAC/VIIIp`, so the big lit
  line was identical in all five states and only an 11px dim sub-line moved.
  **A readout whose prominent half never changes reports nothing.** The state
  line is lit now - and it was the unpaid half of fixing the readout overflow.
- **AND `npm run mock` EXISTS BECAUSE THE EXTENSION REFUSES `file://`** - a mock
  written to disk is invisible to Ops by construction. `OPERATIONS.md` §8 carries
  the standing rule: any mock built for Mike is served, its URL goes in the
  report, and Ops looks first.

### 2026-08-21 -> THE ANTENNA SELECTOR, THE TWO RULINGS - sealed
- **NOTHING IS WAITING ON MIKE. Deploy: `npm run deploy:launch`.** Both rulings
  are built and verified. Gates (second sweep): lint **9/8** - build green -
  launch build green - provenance **PASS** - `reveal:check` **PASS** -
  `parity:gate` **PASS** - `instory:gate` **PASS** - `docs:numbers` **PASS** -
  `reveal:day` nothing to move - `assets:orphans` **13**.
- **TELEVISION PLAYS, AND RULING A DOES NOT REACH A LATCH.** *"They turned the
  TV on. Whatever channel it is on is playing. It's 1965!"* Ruling A governs a
  video NOBODY ASKED FOR; a latch is four deliberate acts ending in *open this
  channel*. **Ruling 21**, and the distinction is in `Television.jsx`'s header
  so a later round cannot misapply it.
- **A HAND-WRITTEN IFRAME CANNOT AUTOPLAY, AND THAT IS WHY THE HOOK WON.**
  Autoplay is a Permissions-Policy feature and must be DELEGATED: a bare iframe
  carries no `allow`, the API writes its own with `allow="…autoplay…"`. The
  first build drew a poster; the hook plays. **Ruling 23** - "reuse the hook"
  was the working choice, not the tidy one.
- **THE HOOK LEFT `Exhibit.jsx` AND THE LINTER NAMED THE REASON.** Exporting it
  from a file that default-exports a component costs
  `react-refresh/only-export-components`, and a baseline is only a tripwire
  while it is exact. It is `src/routes/exhibit/use-yt-player.js`, body
  unchanged, two callers. Baseline back to 9/8.
- **ONE OUTPUT, ENFORCED STRUCTURALLY:** the channel component destroys its
  player on unmount, and **after closing a channel zero iframes remain** -
  measured. The tracklist rule is deliberately the inverse.
- **A CLICK INSIDE A CROSS-ORIGIN IFRAME RAISES NO EVENT IN THE PARENT**, and
  the first unmute path listened on `window` and could never fire. Found by
  clicking the picture and watching nothing happen; no gate can see an
  unreachable listener. `OPERATIONS.md` §8 has the general rule.
- **SOUND, REPORTED AS OBSERVED:** unmuted autoplay was refused on this host
  even with a genuine latch click, so the picture starts MUTED AND MOVING and
  one real click turns the sound on - verified end to end. Some visitors will
  get sound on the latch; that is Chrome's media-engagement policy for the
  origin and the museum cannot read it. **The picture is never a poster.**
- **/wal VERIFIED LIVE** (`controls=1, autoplay=0`, focus still CUES at state 5,
  video playing). **/hr NOT OPENED - it is password-held and Ops does not handle
  credentials** - and it is the same call site: two `useYTPlayer` calls exist in
  the building and `Exhibit.jsx`'s passes no `playerVars`.
- **THE FAQ CLAUSE IS MIKE'S:** *"…and neither of them carries it."* Filed MIKE,
  old row replaced in place. **Ruling 22.**

### 2026-08-21 -> THE ANTENNA SELECTOR (first packet)
- **TWO THINGS NEEDED MIKE AND HE RULED BOTH; see the entry above.** (1) **Television does not autoplay unmuted** - the
  latch opens the channel and YouTube draws its own poster, title and red play
  button. `mute=1` DOES play, proved - but **ruling A says "no autoplay flag, no
  muted start"**, and whether that ruling reaches a channel the visitor
  explicitly latched open is his call, not Ops'. (2) **The Portal FAQ's
  *"neither of them arms"* is now false** and is FLAGGED RATHER THAN REWRITTEN -
  his sentence, his voice; the substance is untouched and the wing is held.
  Gates: lint **9/8 = baseline** - build green - **launch build green** -
  provenance **PASS** (15 rows) - `reveal:check` **PASS** - `parity:gate`
  **PASS** - `instory:gate` **PASS** - `docs:numbers` **PASS** - `reveal:day`
  **nothing to move** - `assets:orphans` **13, unchanged**. Log:
  `docs/MUSEUM_ANTENNA_SELECTOR_LOG-20260821.md`.
- **THE MECHANIC IS A PRIORITY PER CHANNEL, NOT A MAP: television > the
  machine's signal > the test signal.** A machine is FIXED to its channel, so
  the puzzle is getting the zero onto 3. **Verified on the page: only `1101`
  says SIGNAL PRESENT on channel 3**; the other three say TELEVISION. **`arms`
  stopped being the answer and became an INPUT** - it is how the resolver is
  told a machine is assigned - which is how the routing joined the one arming
  rule instead of sitting beside it.
- **CHANNEL 4 NEEDED NO CHANGE AND THE PER-POSITION `src` IS WHY.** Routed 1 it
  is television, routed 0 it is the close-up, and the close-up IS that channel's
  assigned signal. No id moved, no legend recut - P5's rule holds a fourth time.
- **THE TWIN'S FIVE FEEDS AND THE PANEL'S EIGHT CHANNELS DO NOT MAP, AND THE
  TWIN COULD NOT CARRY THE TEST SIGNAL HONESTLY.** *The twin IS MGK-VIIIp* - its
  no-signal card is the machine's own monitor, so opening it to say *no unit on
  this channel* puts the machine on a channel the routing just proved it is not
  on. So the card is DRAWN and **the hum is the twin's to the parameter** (60Hz
  + 120Hz bite, wobble .09, drift .13, off `Hum_Start()`). Two smaller reasons:
  the twin has no feed param, and an iframe has no user activation so its
  AudioContext would never resume.
- **OPS' OWN PREDICTION WAS WRONG AND THE MEASUREMENT SAYS SO.** The pre-round
  report predicted the fifth bay would shrink the instrument at every size.
  **Measured: scale 1.0000 at 1706px AND at 390px, nothing cropped, latch whole
  with 55px to spare.** `fit` only bites when the panel outgrows its frame and
  the frame tracks content here. The cost is **84px of height at 390px and
  nothing at desktop**, where the fourth bay joins the existing row.
- **`useYTPlayer` IS NOT REUSED - A NAMED DEVIATION.** Television is a plain
  nocookie iframe: **strictly less than the hook** (no `iframe_api` request at
  all) and it does not touch the ruled host/split. Reusing the hook meant
  parameterising the thing /hr and /wal play every song through, in an antenna
  round. It gives up `seekTo`, which is what an unmute-on-interaction fix would
  need.
- **THE PHASES ARE EXACTLY A THIRD APART, MEASURED ON THE PAGE:** 581s and
  1162s against 1743/3. One wall clock, `loop=1&playlist=<id>` so a join near
  the end cannot draw YouTube's end screen, `controls=0` so it cannot be
  scrubbed off the clock.
- **THE DEAD SOURCE FINDING RE-PROVED UNDER THE REAL PARAMETERS, AND THE PROBE
  LIED ONCE ON THE WAY.** Swapping the dead id into the museum's own overlay
  drew a poster and a play button for about a second before the refusal
  resolved - a screenshot in that window says the video is fine, and it nearly
  reversed a correct finding. **A rendered oracle must be read after it
  settles**; both facts are `OPERATIONS.md` §8 rows now.

### 2026-08-21 -> QC_101 ONTO RECORD 004 - sealed
- **NOTHING IS WAITING ON MIKE. Mirror and deploy: `npm run deploy:launch`.**
  He ruled the title in the round: **`QC_101 - Final test and inspection`** -
  his pick of three, over Ops' recommendation, and **filed HOUSE rather than
  MIKE because selecting an Ops-composed string is not authorship** (Record
  001's index line, same distinction).
  Gates: lint **9/8 = baseline** - build green - **launch build green** -
  provenance **PASS** - `reveal:check` **PASS** - `parity:gate` **PASS** -
  `instory:gate` **PASS** - `docs:numbers` **PASS** (two stale 460s corrected) -
  `reveal:day` **nothing to move** - `assets:orphans` **13, unchanged (M9)**.
  Log: `docs/MUSEUM_QC101_ATTACHMENT_LOG-20260821.md`.
- **THE FIRST TIME A PUBLISHED RECORD HAS GAINED AN ATTACHMENT.** 004 posted
  20 Aug 17:00 and had been live a full day. Mike ruled it; his reason is *"we
  have had no visitors."* **Ruling 18**, and the write-up says so in its own
  text: **the licence is about today's audience, not about Records**, and it
  expires when visitors arrive. **Ruling B holds** - his published text is
  untouched to the character, *"not meant to seen"* included.
- **THE LISTING SAYS `.TIF` AND THE MUSEUM SERVES WebP, AND THAT IS ALREADY
  LIVE RATHER THAN NEW.** Record 002's manifest names four `.tif` files and the
  museum delivered `scan-NN-a.webp`. **There is no `.tif` anywhere in either
  repo** - the masters are PNG - so emitting one would create the first, for no
  reader. **Ruling 19**, cross-linked from 14. The chain is *in-story name ->
  300-dpi master -> derivative*, and only the middle link is a file.
- **THE PUBLIC FILENAME IS THE DOCUMENT'S OWN NAME, WHICH IS WHY THE TITLE
  COULD SHIP UNSETTLED.** `scan-NN` and `marked-NN` derive from titles Ops
  chose; `qc-101` is what Mike has already published on the glass. A title
  ruling cannot move the file.
- **THE SIGNATURE IS RULED AND CLOSED at 2.5 lines** - *"It got its turn. Use
  it and proceed."* **Ruling 20**, and the diagnosis is kept with it because the
  first candidate was wrong: not clipping (81x104 flood-fill against an 88x100
  cut; a generous re-cut came back DENSER) but SIZE.
- **THE ASSET TABLE WENT 460 -> 475 AND ONLY ONE ROW WAS THIS ROUND'S.**
  `assets:scan` merges. Two were museum images the 17 Aug round shipped and
  never scanned in; twelve are robots-repo files. **FLAGGED: `marks/` and
  `portal/` are UNTRACKED in weird-baby-robots**, so those twelve rows are
  orphans until Mike commits - and **`digit-0..9.png` have no committed
  producer at all**, so a clean clone cannot re-render the form.
- **THREE CANON PAGES WERE DESCRIBING AN ENTRY THAT NO LONGER EXISTS.**
  `09-PUBLISHED.md` still had Record 004 as SCHEDULED with the unattended-terminal
  sentence, the bench addendum and two struck `docs` titles; `06-PORTAL.md` §7
  was headed *"written, scheduled, not yet published"* for a bench that was
  **struck before the entry posted and therefore never published**; and
  `marked-01-a.webp` was still marked UNCOMMITTED. All corrected in place.
- **TWO PROBE FAULTS, NEITHER THE SITE:** `naturalWidth` reads 0 for
  `loading="lazy"` images in an unpainted frame (the rAF hazard's family), and
  this automation host moves browser zoom on its own - `devicePixelRatio` was 2
  on a fresh tab. Measured through JS instead.
- **CLAUDE.md IS 1108 LINES AGAINST ITS OWN ~600 RULE.** Not touched this
  round; it wants an archive sweep.

### 2026-08-17 -> THE RULING, THE TWO OPEN ITEMS, THE PHOTOGRAPHS (second packet) - sealed
- **NOTHING IS WAITING ON MIKE. Mirror and deploy: `npm run deploy`.** Gates:
  lint **9/8 = baseline** - build green - **launch build green** - provenance
  **PASS** - `reveal:check` **PASS** - `parity:gate` **PASS** - `instory:gate`
  **PASS** - `docs:numbers` **PASS** - `reveal:day` **nothing to move** -
  `assets:orphans` **13, unchanged (M9)**. `assets:gate` exits 1 and always has
  (0 of 39 have his verdict; M22). Log appended to
  `docs/MUSEUM_COPY_AND_RECORD_LAYOUT_LOG-20260817.md`.
- **VARIANT b SHIPPED - ONE DECLARATION READING A TOKEN THAT ALREADY EXISTED.**
  `--rec-textcol` is the distance the headline's own grid puts it at, so the
  report lands on the headline's vertical and the two cannot drift. **Out by 0
  at 1280, 390 and 1920.** A/B'd by injecting the old state: **desktop costs
  NOTHING** (68ch binds before the container; height identical to 939.9px), and
  **390px costs 60.6px of measure and +9.4% of page height.** `a` and `a+b`
  **deleted rather than left dormant**; the directory is kept as the record.
- **THE SPAM NOTE HAD THREE STATEMENTS AND THE THIRD WAS DORMANT.** Mike's
  ruling is the part that binds: **a string one restored render away from the
  glass is a string on the glass with a delay.** `aboutNote`'s last sentence was
  also in the WRONG FIELD - a citations line carrying a note about a decision.
  **Proved absent from the built bundle**; the `[R-a]` ledger comment stays.
- **`Born | Born July 3, 1963` -> `July 3, 1963`, ON AN OPS RULING HE CAN
  REVERT.** Filed MIKE with the one-word edit named, so it cannot read next year
  as something he wrote. **76 tombstone rows swept museum-wide, 0 other
  stutters - and the probe was proved against the pre-fix row first**, because a
  zero is exactly what a broken check returns.
- **FOUR OF HIS PHOTOGRAPHS ARE ON THE ABOUT-THE-ARTIST TILES**, in
  `public/images/wb/`, filed **MIKE** in `assets.json` on the robots reference
  photographs' own sentence. **The `c` field was already the line between the
  house's pictures and the artists'** - no new class was invented. `profile`
  cards take an optional `img` now, the `.vp-fe-plate` mechanism on the other
  card shape.
- **TWO OF MY OWN DEFECTS, BOTH CAUGHT BY A MEASUREMENT.** A first
  `aspect-ratio:4/3` would have **cropped 44% off the two portrait objects** -
  the ratio was chosen before the files were measured, and `assets:scan` printed
  what they actually are. And `loading="lazy"` left all four unloaded at 1.8px
  tall in an unpainted frame: **same family as the rAF hazard**, now a §8 row.
- **AND A THIRD THAT WAS NOT MINE: `assets:scan` SWEPT IN TWELVE GITIGNORED
  FILES.** A row is committed and the file is not, so **the row is born an
  orphan** - the M9 class manufactured on purpose. `SKIP_PATH` (by path, not by
  name; deliberately not a `.gitignore` reader) plus a restore-and-re-scan,
  because **`--scan` merges and does not replace.** 385 -> **397**, exactly the
  twelve intended files.

### 2026-08-17 -> COPY + THE RECORD LAYOUT (two batches) - Batch 1 sealed, Batch 2 waiting
- **WAITING ON MIKE: open `docs/record-layout-variants/compare.html` and say a,
  b or a+b.** Then `npm run deploy` for Batch 1. Gates: lint **9/8 = baseline** -
  build green - **launch build green** - provenance **PASS** (14 pruned, 11
  added, **0 surviving rows changed, 0 chains broken**) - `reveal:check` **PASS**
  - `parity:gate` **PASS** - `instory:gate` **PASS** - `docs:numbers` **PASS** -
  `reveal:day` **nothing to move** - `assets:orphans` **13 / unchanged (M9)**.
  Log: `docs/MUSEUM_COPY_AND_RECORD_LAYOUT_LOG-20260817.md`.
- **NINE COPY CHANGES, HIS WORDS, AND THE THREE FACT-GRID CORRECTIONS WERE
  RULED RATHER THAN FLAGGED.** /robots FAQ, the /wb blurb, the /wb fact grid
  (five rows, `Founder` new), the Steven Tyler tile plus **a second tile under
  the same label** (his ruling), `AFFILIATION`'s third line (**one edit, booth
  and /wal both**), the /foundation donate answer, and two visitor-facing kills
  on /wal.
- **THE `NOTE` LINE MIKE ASKED TO KILL WAS A FIELD WITH NO GREP-VISIBLE
  CONSUMER.** `siteNote` is printed 380 lines away by
  `lines: a.siteNote ? ["NOTE     " + a.siteNote] : undefined`, and it was found
  by **loading the page and asking the DOM which element held the string** - a
  grep for a field name says nothing about whether it reaches a visitor. **The
  ledger stayed**: the `[R-a]` comment recording why findmikeymike.com is
  unlinked is untouched, and the sentence above it that pointed at `siteNote`
  was repointed rather than left aiming at a deleted field.
- **THE PAGE TITLE IS 1.2rem -> 1.45rem SITEWIDE AND THE BAND SURVIVED IT** -
  0 uncovered, **0 dead of 21 over the control**, centres 0, on /wal /wb
  /robots; 0 bar overlap at 1280 and 390 on six rooms. **AND THE STRICTER
  READING IMPROVED**: over-PLATE dead went **14 of 21 at 1.2rem -> 7 at
  1.45rem**, A/B'd by injecting the old rule into the same page.
- **THE PROBE WAS WRONG TWICE BEFORE IT WAS RIGHT.** `hit.contains(control)`
  makes every point pass, so a plate 192px from its control read 0 dead; and the
  plate's box and the control's box answer different questions. **The test is
  `hit === control || control.contains(hit)` across the CONTROL's whole box.**
  Separately, `resize_window` does nothing on this host, so every measurement
  was taken in a same-origin iframe sized until `clientWidth` IS the target.
- **BOTH RECORD-LAYOUT VARIANTS ARE BUILT AS REAL CSS AND PHOTOGRAPHED, AND
  NEITHER IS IN `src/`.** His complaint is arithmetically exact - the report
  starts **71.5px left of the headline**, which is `--rec-textcol` exactly, so
  variant **b** is one declaration reading a token the source already has.
  **The combination was broken in a way only a measurement could catch:** a
  custom property is resolved on the element that DECLARES it, so redefining
  `--rec-rail` below `.vp-face` left the indent at the old rail's width and
  reintroduced his own complaint, 40px smaller.

### 2026-08-09 -> THE RECORD EDITOR (E1-E5) - sealed
- **WAITING ON MIKE: open `docs/dictation-20260807/record.html`.** His eight
  notes from Records 001 and 003 are in it, in braces, where he wrote them. Two
  need him: **the four devices have no names** (`E-a`) and **two of his own
  sentences now end in a colon with nothing after them** (`E-b`). Gates: lint
  **11/9 = baseline** - build green - **launch build green** - provenance **PASS**
  (13 stale rows pruned, 0 chains broken, 0 rows changed) - `reveal:check`
  **PASS** - `parity:gate` **PASS** - `instory:gate` **PASS** - `assets:orphans`
  **0/0** - `reveal:day` **nothing to move** - **the lap RAN at 390px and 1216px**
  on five museum routes and the new editor page - `lap:clean` done. Log:
  `docs/MUSEUM_RECORD_EDITOR_LOG-20260809.md`.
- **THERE IS NO EDITOR WIDGET, AND THAT IS THE WHOLE DESIGN.** The page draws the
  museum's own `RecordEntry` and `RecordIndexRow` through the D-round preview
  bundle and then makes the museum's own paragraphs `contenteditable`. **What he
  types into IS `<p class="vp-rec-sect-body">`** - no mirror, no re-implementation,
  no second copy of the text anywhere on the page. Built FROM `preview/frame.html`
  read rather than copied, because that file holds the one ancestor chain.
  **Fidelity measured against the live page and identical at both widths.**
- **THE RED/BLUE INLINE ANSWERS ARE RETIRED AND DELETED RATHER THAN LEFT
  DORMANT** - his ruling, *"that was Ops answering in the wrong place."* Braces
  replace them, with two gates that were each proved by breaking them. **The
  launch gate reads the SOURCE and not the bundle and says why:** the mark it
  replaces was a string nothing else in a JS bundle could produce, and a curly
  brace is what compiled JavaScript is made of.
- **E3 IS A MEASUREMENT RATHER THAN A CLAIM.** `npm run record:report`: **11 of
  the 13 answered worksheet slots are already in the Record character for
  character**, and the only lines of the other two that are not are **exactly the
  eight notes** this round moved. `W1.SUM` belongs to no Record field and has been
  on `arc.html` since the R round. **E4's changes are not on disk** - `answers.json`
  and the rescue dump are byte-identical - so the migration ALSO runs in the page
  against the worksheet's own `localStorage` key, which a `file://` page shares.
- **E5 WROTE INTO ALL 36 FIELDS AND PRESSED COPY:** 0 model mismatches, 0 strings
  missing from the paste, header and list both **39** notes, all six records
  present, survived a reload, and `record:land --verify` round-trips **78 of 78**
  strings. The save bridge was proved by removing the picker and watching it
  download and say where it went.
- **THE PROOF FOUND FIVE DEFECTS AND FOUR WERE INVISIBLE.** `innerText` returns
  what CSS DISPLAYS (uppercased headings, silently, all the way into `robots.js`);
  `requestAnimationFrame` does not fire in a background tab (an uneditable page
  with no error); a focus BOOLEAN deadlocked the page because a node removed by a
  re-render fires no `focusout`; `+ lead` did nothing because *is anything written
  here* and *does this field exist* were the same test; and a note in a section
  HEADING was missing from the collected list - **three short of the count in its
  own header, which is how it was found.**
- **SURFACING UNMOVED AT 20 SPENDABLE - THE FIFTEENTH PACKET RUNNING.**

### 2026-08-09 -> THE RECORD LANDING + THE ALBUM ART (L1-L7) - sealed
- **RECORDS 001-005 ARE ON THE WALL**, dated by `recordDay(n)` off the one epoch;
  **013 untouched.** Gates: lint **11/9 = baseline** - build green - **launch
  build green** - provenance **PASS** - `reveal:check` **PASS** - `parity:gate`
  **PASS** - `instory:gate` **PASS** - `assets:orphans` **0/0** - `reveal:day`
  **nothing to move** - **the lap RAN at 390px and 1228px** on five routes, page
  overflow 0, broken images 0, console errors 0 - `lap:clean` done. Log:
  `docs/MUSEUM_RECORD_LANDING_LOG-20260809.md`.
- **THE ENTRIES ARE GENERATED, NOT RETYPED, AND THAT IS THE METHOD WORTH
  KEEPING.** `tools/dictation/emit-record-entries.mjs` cuts his rescued boxes
  into sections by the worksheet's own capitals rule and emits the JS; `--verify`
  strips the paragraphing and the markers back out and compares to the rescued
  string - **every box round-trips, his characters unchanged.** Record 001's
  landing PROVED verbatim after the fact; this removes the transcription step a
  character could go missing in.
- **001's BODY IS HIS LONGER DRAFT AND ONE DETAIL IS WORTH THE ROUND.** It gains
  SATURDAY/SUNDAY and MONDAY DAY(0), and where the 08-08 dictation read
  *"a clean hand-off was made made"* this draft reads *"was made"* - **the
  doubled word was his and so is the correction.** Two spaces preserved in
  `Full containment  was made` and `=  86%`.
- **HIS NOTES IN RED, OPS' ANSWERS IN BLUE, INLINE - AND `[PAPA]` COULD NOT DO
  IT.** A `[PAPA]` sentence is LIFTED OUT of the copy into a block beneath the
  page (N3); these must stay **exactly where he wrote them**, because a question
  and its answer four screens apart is not an answer. So `[MIKE-NOTE]` and
  `[OPS]` are **whole-paragraph** marks that never print - 5 red and 3 blue
  measured on the built bundle at 390px. **Blue is not decoration:** Ops'
  sentence must never be read next year as something Mike wrote. **The entries
  therefore READ DIFFERENTLY IN THE TWO STAGES - his instruction, not a defect -
  and N3's identical-copy principle has its first declared exception.**
- **THREE MECHANISMS, AND THE THIRD CANNOT BE REASONED WRONG.** The renderer
  drops a marked paragraph at launch; `wb-ops-notes` empties the literal in the
  SOURCE; and **`wb-dev-mark-guard` reads the launch build's own output and fails
  on a hit.** Proved by removing the strip - the launch build refused and named
  **13**. On the real launch bundle: **zero literal markers, zero of his note
  text, his story text intact**; the one residue is `DEV_MARK` itself, which
  cannot remove itself.
- **TWO ENTRIES LANDED AND DREW NOTHING AT ALL, AND ONLY THE LAP SAW IT.**
  `scrubFace`'s entry filter kept an entry with a title, a `line` or `lines` -
  **it did not know about `sections`.** Records 004 and 005 have no headline (he
  wrote none) and no `line`, so both read as *no title and no body*, were
  filtered out, and **never drew an index row** while the data was right, the
  ledger had rows and every gate passed. Six expected in the index, four counted.
  **S-c's shape one floor down.**
- **THE ALBUM ART IS MEASURED, NOT EYEBALLED.** Georgia 157 / track 17 identified
  by pixel **IoU 0.945** against his own `NEW Robots.png` (Georgia Pro .928,
  Times .712, Bodoni .492), Courier New for the sub-line. **The circle is closed
  with its own ink** - the three arcs rotated about the fitted centre (599.8,
  517.9, r 321.7), **16,608 pixels painted in** with six degrees of overlap so
  the hand-drawn tapers are buried rather than butted. No photograph. The two
  source files were in `OneDrive\Desktop - Laptop\ART\` under different names,
  not Downloads.
- **THE PRUNE HAZARD FIRED EXACTLY AS §9 DESCRIBES**, and the register nearly
  lost its own shape. Replacing 001's body staled four rows; pruning them broke
  the approved index line's RESTATED chain, repointed onto the same two
  paragraphs in the draft that replaced them. Separately, **the rows live under
  `.entries` and a first pass wrote 43 at the top level** - invisible to a reader,
  fatal to the gate, caught by the gate, then verified **43 added, 0 lost, 0
  pre-existing rows changed.**
- **SURFACING UNMOVED AT 20 SPENDABLE - THE FOURTEENTH PACKET RUNNING.**

### 2026-08-09 -> THE WORKSHEET EXPORT (U1-U5) - sealed
- **THE EXTRACTOR WAS WRITTEN BEFORE ANYTHING WAS DIAGNOSED** -
  `tools/dictation/RESCUE.md`, a console snippet that takes EVERY key in the
  browser store without filtering, prints a per-key character count and downloads
  it. It writes nothing and judges nothing: **a rescue that only takes what the
  rescuer expects to find is not a rescue.** Read back by
  `npm run dictation:import`.
- **ALL FOUR CANDIDATES IN THE BRIEF ARE FALSE OF THE BUILD ON DISK, AND THAT IS
  MEASURED RATHER THAN ARGUED.** 41 slots declared, 41 textareas rendered, same
  set both directions; ONE key (`STAMP` is the hardcoded constant `"2026-08-07"`,
  never a generation date, so no rebuild has ever moved it); and the timestamp is
  `new Date()` inside `collect()` - a full run printed `captured 2026-08-09
  10:00`, the real minute. **The page exports 41 of 41 correctly.**
- **THE ONE LINK NOBODY HAD EVER MEASURED WAS THE CLIPBOARD, AND THE W-ROUND HAD
  ALREADY FLAGGED IT AS UNMEASURED.** `navigator.clipboard.writeText` rejects
  with **"Document is not focused"**, and the fallback then printed *"Copied -
  4,293 characters"* on the strength of `document.execCommand("copy")`, **whose
  return value says the command was ENABLED and not that the clipboard changed.**
  Three identical pastes days apart, frozen at 2026-08-07 17:04, is exactly and
  only what an unverified write produces - the last copy that DID land, re-pasted.
  **Said as the cause the evidence supports, not as a certainty**; what is
  certain and enough to act on is that the tool claimed a success it never
  checked. His rescue file settles the rest.
- **TWO MECHANISMS SO IT CANNOT RECUR.** `assertSlotsMatchPage()` reads the
  generated HTML back and **refuses to write a page** whose textareas and whose
  `SLOTS` array are not the same set - missing, extra and duplicated - proved by
  removing one slot from the export list and watching the build name it. And the
  collector walks **file -> store -> live boxes**, weakest first, so an answer to
  a slot a later round retires still travels and is printed as `A RETIRED SLOT`
  instead of vanishing. Proof: 41 boxes + 1 injected retired answer -> **42
  exported blocks, timestamp at the press.**
- **THE COPY BUTTON READS THE CLIPBOARD BACK** and has three sentences, not one:
  VERIFIED, *the clipboard did not take it*, or *not verified - press Ctrl+C*.
  **It never says "Copied" on a write it did not check**, and the text is
  selected before the attempt so Ctrl+C works either way.
- **THE BRIDGE IS BUILT AND ITS FAILURE PATH IS THE ONE THAT WAS PROVED.** `Save
  to the repo` writes `docs/dictation-20260807/answers.json` via
  `showSaveFilePicker`, handle remembered in IndexedDB - a dialog once, one click
  after. A synthetic click has no transient activation, so the picker refused
  with `SecurityError` and the page **downloaded the same file and said where it
  went**; that file went through the importer at 42 answers, key intact. **A
  bridge that fails must fail into the old road, not into silence.**
- **THE SECOND DEFECT WAS THE OTHER DIRECTION: NOT THE REBUILD, THE BROWSER.** A
  rebuild does NOT destroy his content - 42 answers survived one, measured, and
  the key has always been constant. The risk was that his words lived in exactly
  one browser. The generator bakes the answers file into the page now, so a
  **wiped store** still opens on all of them, says which file they came from, and
  exports 42 of 42. It never overwrites the store, it always says when it filled
  a box, and the generator only READS that file.
- **HIS OWN `file://` STORAGE WAS NEVER TOUCHED** - every test ran against
  `http://127.0.0.1:8899`, a different origin. Gates: lint **11/9 = baseline** -
  build green - provenance **PASS** - `reveal:check` **PASS** - `parity:gate`
  **PASS** - `instory:gate` **PASS** - `assets:orphans` **0/0** - `reveal:day`
  **nothing to move** - **the lap RAN at 390px and 1228px on all ten Ops pages**,
  20 measurements, every one clean. Log:
  `docs/MUSEUM_WORKSHEET_EXPORT_LOG-20260809.md`.

### 2026-08-09 -> CLEANUP (D1-D4) - sealed
- **NOTHING IN THIS ROUND IS WAITING ON MIKE**, which is the first report written
  under its own new doctrine. Gates: lint **11/9 = baseline** - build green -
  provenance **PASS** - `reveal:check` **PASS** - `parity:gate` **PASS** -
  `instory:gate` **PASS** - `assets:orphans` **0 judged, 0 unjudged** -
  `reveal:day` **nothing to move** - **the lap RAN at 390px and 1228px on all ten
  Ops pages**, 20 measurements, every one clean. Nothing in `src/` changed. Log:
  `docs/MUSEUM_CLEANUP_LOG-20260809.md`.
- **THE LAST COPY OF THE ELEVEN PHOTOGRAPHS IS DELETED.** `C:\AI\Projects\_review\`
  removed whole - eleven files, the viewer page built to rule from, and the empty
  parent. Confirmed three ways: the directory is gone, a `find` for all eleven
  filenames across `C:\AI\Projects` returns nothing, and the only files still
  holding the string are round logs and the closed register. `L-b` closes.
- **THE ORPHAN CHECK HAD NEVER REPORTED A ROW IN ITS LIFE, AND THAT IS SHARPER
  THAN EITHER ROW THAT RAISED IT.** `--orphans` counted `missing && isJudged` -
  and **no missing row in this table has ever carried a judgement**, so its
  population was empty by construction and a reading of **0** was
  indistinguishable from a clean table. `isJudged` asks *what would be LOST*,
  which is the right test for **how loud to be** (C32) and not a test for whether
  a row is an orphan; it is a **GRADE** now, not a filter. On the unchanged table
  the check went **0 -> 27**. `L-a` predicted 24 and `K-a` predicted 3: **two
  rows for one defect, neither aware of the other.**
- **ALL 27 CULLED AFTER INSPECTION, NOT IN A BATCH.** 24 manual pages at a path
  the document left - it was **re-rendered as well as moved**, so no sha256
  matches and `--rename` could never have seen it; 2 public-side twins of
  pictures behind the stage door (§8's two-addresses hazard, an address dropped
  rather than a photograph); and `faq-cover.png`, whose row said `role: shipped`
  and named a `usedBy` - **both stale**, and `src/` references it nowhere. Table
  **277 -> 250, every row on disk.**
- **THE REGISTER LOST SIX ROWS AND THREE SHORT-LIST LINES AND HAD SEVEN REPAIRED
  IN PLACE, AND THE SHORT LIST IS THE FINDING.** Two of the three lines were
  **still asking questions that had answers** - row 8 pointed at M25 (closed at
  N4 by subtraction; the sentence it named no longer exists) and row 63 at M92
  (resolved at N2 in a third direction, and already covered by 15b). With 15a
  last round that is **four instances in two rounds of one failure: a row closes
  and leaves, and the SHORT LIST line that pulled it out stays behind.** The
  short list is derived from the tables by hand and nothing derives it.
- **SEVEN `(orig)` ROWS HAD NO PARENT LEFT** - the suffix marks original text
  kept beside a superseding row, and for M4, M29, M30, M45, M47, C31 and T-A the
  superseding row had closed and left, so a live open row was wearing a history
  label. Renamed to plain ids, inbound links checked first (**none**). Two rows
  that are linked to carried no anchor (C30, P2). **Dead intra-file links 0.**
- **M99 CLOSES AND THE SECOND DECLARER IS GUARDED.** `reveal/ledger-declare.mjs
  --write` regenerated `ledger.json` whole from its own array with nothing
  between it and a hand-added row - M99's shape, named in §8 and left there. It
  diffs row ids and **refuses** now, same words and same shape as
  `assets-declare.mjs`. **Drift measured ZERO before the guard was written**,
  which is the argument for writing it then: a guard added while the drift is
  zero cannot be wrong about what to keep, and one added after 45 rows must first
  decide which file is the source - which is what H-b cost. Proved by injecting
  `zz.guard.probe` and restoring byte-identically.
- **M84 WAS NOT CLOSED BY A FIX, IT WAS MOVED.** It carried *"nothing to decide;
  this is a note so nobody acts on a wrong reading"* - **a note is not an open
  action**, and the round it warns (a cleanup round reading the unreachable
  bucket as a dead-code list) starts by reading `OPERATIONS.md`. It is a §8
  hazard row now. **C39 (orig) closed on verification**: the NUL bytes have been
  gone for rounds; HEAD holds zero and `grep` reads the file as text.
- **SURFACING UNMOVED AT 20 SPENDABLE - THE TWELFTH PACKET RUNNING.**

### 2026-08-06 → 2026-08-08 — eight rounds, archived
Moved verbatim to `docs/CLAUDE_SESSION_LOG_ARCHIVE-202605.md` under this file's own
~600-line rule: THE LIGHT TABLE (L1–L4) · THE CULL (C1–C2) · TIGHTEN THE RECORD (T1–T5)
· ATTACHMENTS + THE EMAIL-LIKE REGISTER (A0–A6) · THE DATE + THE LIVE PREVIEW (D1–D6) ·
THE INDEX LINE + THE WARNING (I1–I3), and the six stub entries below them that had
already been archived once.

**Nothing live is only in there.** Every mechanism those rounds built is a §5 row in
`docs/canonical/OPERATIONS.md`, a §8 hazard row, or a standing-rule section at the head
of THIS file — which is the sentence the block at the foot of this log has been making
since K1. **Read §5 first and the archive second.**

### Older entries (2026-05-06 → 2026-08-06) — archived
Moved verbatim to `docs/CLAUDE_SESSION_LOG_ARCHIVE-202605.md` under this file's own
≈600-line rule: THE PORTAL HOLD + THE PULL-BACK (H1–H8) · THE COMBINED BRIEF (D1–D3 ·
A1–A3 · L1 · F1–F8 · W1–W2 · V1–V2 · C1–C4) · MIKE'S PAGE-BY-PAGE (L1 · R1–R7 · P1–P6 ·
N1–N11 · X1) · THE PRE-COMMENTARY ROUND (H1–H8), and everything back to 2026-05-06.

**[K1 2026-08-07] THIS BLOCK WAS FORTY LINES OF POINTER-CHAIN AND IS NOW FIVE, ON ITS
OWN FINAL SENTENCE.** It said, of every archived round in turn, *here is where the live
part lives* — and then closed by saying that **every live part it names is a row in
`docs/canonical/OPERATIONS.md` §5, which is where a session should be reading anyway.**
That sentence made the other thirty-five redundant the moment it was written; the Law of
Subtraction says what is redundant goes. **Nothing was lost:** the round entries are in
the archive file whole, and each live mechanism is a §5 row, a §8 hazard row, or a
paragraph at the head of THIS file. If you need to know what an archived round decided,
read §5 first and the archive second.

## Conventions for updating this file

- Add new "Recent session log" entries at the top, dated and PR-linked.
- Update "THE ENVIRONMENT" when you hit something new about the machine or the
  tools. **Check first that what bit you is real on this host** — the section it
  replaced was two hundred lines of workarounds for a sandbox nobody has run in.
- If you add a new piece of design vocabulary (a constant, a CSS variable, a behavior pattern), add it here so the next session doesn't reverse-engineer it.
- Don't let this file grow past ~600 lines. If it does, archive older session log entries to `docs/`.
