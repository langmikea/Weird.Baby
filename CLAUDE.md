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

- **Branch naming**: hyphenated (e.g. `ux-exhibit-tweaks-2`). **Slashed names like `ux/foo` fail in the cowork sandbox** — the FUSE mount can't create subdirectories under `.git/refs/heads/`. Always use hyphens.
- **Commit author from cowork**: `cowork agent <cowork@local>`. GitHub overrides this on squash-merge to Mike's noreply (`98126530+langmikea@users.noreply.github.com`), so the squash commit on `main` is correctly authored.
- **Commit messages**: subject line under 72 chars, imperative mood. Body explains *why* and references the user's report verbatim where applicable.
- **PR bodies**: tabular fix summary, commit list, mechanism notes, "out of scope" section. Include the literal user-reported phrasing.
- **Squash merge** is the default — most branches accumulate iteration commits. Only choose merge-commit if the per-commit history is genuinely worth preserving.

### Pre-flight before commit

1. Verify file integrity: `wc -c <file>` matches expected, `tail -3 <file>` shows the proper end.
2. `npm run lint` — should be at the baseline (**9 errors / 8 warnings**, all pre-existing on main, all in routing files Mike has flagged for separate semantic review). **[CH8 2026-08-12] IT WAS 11 / 9 AND IT IS NOW 9 / 8, AND THE DROP IS REAL RATHER THAN SUPPRESSED.** Making the YouTube player conditional (`useYTPlayer`'s `hasVideo` guard) removed the *unguarded* eager `useEffect` that raised both `Cannot access variable before it is declared` errors in `Exhibit.jsx`; they went with the code that caused them. Nothing was disabled and no rule was turned off. **The number is updated here in the same round that moved it** — for the reason the note below already gives, which had to be learned once in the other direction. **[A1 2026-08-04] This line said 4 / 6 and had been wrong since at least v40** — every round log from v40 onward records 11 / 9 and this file was never brought along. An orientation doc that publishes the wrong tripwire number disables the tripwire: a session that trusts it reads eleven pre-existing errors as seven new ones and starts hunting for a regression that is not there. The lint-debt table below lists four of the nine; the per-file breakdown is in that section, **measured 2026-08-13**. `eslint.config.js` ignores non-source trees (`_cowork/`, `dist`/`dist.pre_*`, `.phase1_retired_files/`) and `*.pre-*`/`*.old_v*`/`*.bak_*` backups, so the count reflects `src/` only — a higher number means you've introduced an error. **[2026-08-13] TWO STALE NUMBERS CAME OUT OF THIS PARAGRAPH AND BOTH WERE IN THE SENTENCE THAT WARNS ABOUT STALE NUMBERS.** It said the other errors "live in `HrExhibitFlow.jsx` and `RobotsExhibitFlow.jsx`" — measured, five of the nine are in `Exhibit.jsx` — and it closed with a sandbox caveat ending *"on Windows the file is intact and the count is 4/6"*, which contradicted the 9/8 at the head of the same paragraph. The caveat described a sandbox nobody runs in and is deleted with it.
3. `npm run build` — must pass. Vite + rolldown + Cloudflare plugin.

## Local tooling

`tools/Get-ProjectStatus.ps1` is a PowerShell helper that reads the current repo state and prints a recommended next step — git branch/ahead/behind/uncommitted counts, the next unchecked task in `TODO.md`/`NEXT.md` if present, detected manifests (Node, Python, etc.), and the five most recently modified files. Run it from the repo root: `.\tools\Get-ProjectStatus.ps1`. On a fresh Windows clone the script may be flagged as downloaded-from-web by SmartScreen — run `Unblock-File .\tools\Get-ProjectStatus.ps1` once to clear the zone-identifier ADS, then it executes normally.

### Deep Dive export

`npm run export-artifacts` reads released artifacts from MediaVault (`http://127.0.0.1:51822/db`) and writes per-exhibit JSON to `src/data/exhibits/<name>.json` (one file per `exhibit:` tag value). The museum imports these files statically at build time. MV must be running on the operator's laptop; the script won't work from CI or another machine.

Use `--dry-run` to see what would be exported without writing. Use `--verbose` to see the SQL query and per-card details.

### Release flow

**[CH4 2026-08-12] `npm run export-artifacts` IS OUT OF THE RELEASE FLOW AND THE
FLOW IS NOW ONE STEP: `npm run deploy`.**

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

1. **In museum repo**: `npm run deploy` — builds and ships to weird.baby.

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

## Pre-existing lint debt — the baseline is 9 errors / 8 warnings

**[2026-08-13] THIS HEADING SAID "(4 errors)" AND THE TABLE BELOW LISTS FOUR,
WHICH IS THE TRIPWIRE-DISABLING FAILURE THIS FILE'S OWN A1 NOTE WARNS ABOUT** —
a session that reads the heading as the baseline sees five phantom regressions
and goes hunting. **The baseline is 9 errors / 8 warnings**, confirmed by
running `npm run lint` on a clean tree on 2026-08-13, and it agrees with the
number in `### Pre-flight before commit` above. Measured per file on the same
run, so a future session can tell a regression from the debt:

| file | err | warn |
|---|---:|---:|
| `Exhibit.jsx` | 5 | 5 |
| `HrExhibitFlow.jsx` | 2 | 2 |
| `RobotsExhibitFlow.jsx` | 1 | 1 |
| `WbAdmin.jsx` | 1 | 0 |
| **total** | **9** | **8** |

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
anything in `public/` is one `npm run deploy` from being published.

## TWO STANDING RULES ADDED 2026-08-07 (THE TWO BUCKETS + 013)

**THE BOUNCY BALL LAW CAPS POINTS OF FOCUS, NOT ASSETS** — *"humans remember one
or two things; ten things reduces the odds they keep the one that matters."*
`OPERATIONS.md` §7 **Doctrine 20**, mirrored in `STATE.md`. **IT DOES NOT MEAN WE
MAY NOT SHOW MORE PICTURES.** Two buckets: **PRECIOUS** — genuine reveals, two or
three **a week**, the ceiling is on these — and **DUMP** — everything else, **no
ceiling**, because ten manual pages arriving is ONE point of focus. The law and
both runways are **`reveal/focus.mjs`**; the judged field is **`bucket`** on
`provenance/asset-table.json`, **Mike's, null on all 404 rows (re-measured
2026-08-19; this said 397, and 315 before that), and Ops does not
derive it**. **PRECIOUS divides into weeks; DUMP divides into nothing** — the old
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
renders, so `npm run deploy` publishes the Portal and all sixteen photographs.
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
row. Day one is **2026-08-17** and it is **ONE CONSTANT**, `RECORD_EPOCH` in
`src/data/artists/robots.js`, read by Record 001's `date`, the face's
`recordEpoch` and (via `recordEpoch()` in `reveal/record-entries.mjs`) every day
of the worksheet's outline. **A slip is one line — proved, not assumed:** one
date-shaped literal in the file, both consumers identifier references, and the
half-updated two-literal case prints *"Week 2 · Monday · Record 001"* on day one
with nothing reporting it. **`C8` closes; the month band did NOT turn on** and
`C1` says so (14 entries across >1 month; the volume holds two). **The worksheet
generator refuses to build if a derived weekday disagrees with the outline's
declared `MON…FRI`.**

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
you. Mirror and deploy: `npm run deploy`."* Padding it makes him read a page to
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
