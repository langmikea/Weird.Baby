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

Mike develops on Windows; you usually run inside a Cowork Linux sandbox. The split:

- **You make edits + commits in the cowork sandbox.** Files write to disk via the FUSE mount → Mike's actual repo.
- **Mike pushes from PowerShell.** You can't push from the sandbox (no GitHub credentials).
- **You drive Chrome to open the PR.** Mike has the GitHub tab open; you navigate, fill the title and body, click Create, then Squash and merge, Confirm, Delete branch.
- **Mike runs the local cleanup** (checkout main, pull, branch -d).

Mike pre-approves the entire flow when he says "push" — drive end-to-end without re-asking for each click.

### Conventions

- **Branch naming**: hyphenated (e.g. `ux-exhibit-tweaks-2`). **Slashed names like `ux/foo` fail in the cowork sandbox** — the FUSE mount can't create subdirectories under `.git/refs/heads/`. Always use hyphens.
- **Commit author from cowork**: `cowork agent <cowork@local>`. GitHub overrides this on squash-merge to Mike's noreply (`98126530+langmikea@users.noreply.github.com`), so the squash commit on `main` is correctly authored.
- **Commit messages**: subject line under 72 chars, imperative mood. Body explains *why* and references the user's report verbatim where applicable.
- **PR bodies**: tabular fix summary, commit list, mechanism notes, "out of scope" section. Include the literal user-reported phrasing.
- **Squash merge** is the default — most branches accumulate iteration commits. Only choose merge-commit if the per-commit history is genuinely worth preserving.

### Pre-flight before commit

1. Verify file integrity: `wc -c <file>` matches expected, `tail -3 <file>` shows the proper end.
2. `npm run lint` — should be at the baseline (**11 errors / 9 warnings**, all pre-existing on main, all in routing files Mike has flagged for separate semantic review). **[A1 2026-08-04] This line said 4 / 6 and had been wrong since at least v40** — every round log from v40 onward records 11 / 9 and this file was never brought along. An orientation doc that publishes the wrong tripwire number disables the tripwire: a session that trusts it reads eleven pre-existing errors as seven new ones and starts hunting for a regression that is not there. The lint-debt table below still lists the four errors it was written for; the other seven live in `HrExhibitFlow.jsx` and `RobotsExhibitFlow.jsx`. `eslint.config.js` ignores non-source trees (`_cowork/`, `dist`/`dist.pre_*`, `.phase1_retired_files/`) and `*.pre-*`/`*.old_v*`/`*.bak_*` backups, so the count reflects `src/` only — a higher number means you've introduced an error. (Sandbox caveat: a cowork-sandbox `eslint .` may show **5 err / 5 warn** — a phantom parse error in `HrExhibitFlow.jsx` from the FUSE truncation quirk. On Windows the file is intact and the count is 4/6.)
3. `npm run build` — must pass. Vite + rolldown + Cloudflare plugin.

## Local tooling

`tools/Get-ProjectStatus.ps1` is a PowerShell helper that reads the current repo state and prints a recommended next step — git branch/ahead/behind/uncommitted counts, the next unchecked task in `TODO.md`/`NEXT.md` if present, detected manifests (Node, Python, etc.), and the five most recently modified files. Run it from the repo root: `.\tools\Get-ProjectStatus.ps1`. On a fresh Windows clone the script may be flagged as downloaded-from-web by SmartScreen — run `Unblock-File .\tools\Get-ProjectStatus.ps1` once to clear the zone-identifier ADS, then it executes normally.

### Deep Dive export

`npm run export-artifacts` reads released artifacts from MediaVault (`http://127.0.0.1:51822/db`) and writes per-exhibit JSON to `src/data/exhibits/<name>.json` (one file per `exhibit:` tag value). The museum imports these files statically at build time. MV must be running on the operator's laptop; the script won't work from CI or another machine.

Use `--dry-run` to see what would be exported without writing. Use `--verbose` to see the SQL query and per-card details.

### Release flow

To publish newly-released MV artifacts to weird.baby, run these in order:

1. **In MV**: flip artifact status to `released` via inbox triage.
2. **In museum repo**: `npm run export-artifacts` — regenerates `src/data/exhibits/hunter_root.json` from MV's current released set. (MV must be running; see Deep Dive export above.)
3. **In museum repo**: commit the refreshed snapshot:
   ```bash
   git add src/data/exhibits/hunter_root.json src/data/vocabulary.json
   git commit -m "data: regen hunter_root.json"
   ```
4. **In museum repo**: `npm run deploy` — builds and ships to weird.baby.

**Step 2 is the most-missed step.** `npm run deploy` runs `vite build && wrangler deploy`; it does NOT regenerate the JSON from MV. Skipping step 2 ships a stale snapshot — visitors see yesterday's released set, not today's. The "released video didn't show up" symptom of 2026-05-25 was exactly this: 36 newly-released YT artifacts got triaged into MV but `export-artifacts` was skipped, so the SPA bundle still carried the prior export's 19-artifact JSON.

Long-term: HR acquisition tooling (T8, audit §6.4) will auto-emit `exhibit:hunter_root` at capture time, removing the manual exhibit-tag step. The 4-step release flow above stays the same.

### Cross-platform native dependencies

Any npm package with a native compiled component (currently `better-sqlite3`) requires `prebuild-install` in `devDependencies` so the operator's machine can fetch pre-built binaries on install without needing Visual Studio Build Tools. The cowork sandbox builds for Linux; Mike's Windows machine needs its own platform-specific binary. If a "not a valid Win32 application" error appears at runtime on Windows, `npm rebuild <package-name>` is the local fix on the operator's side.

## Cowork sandbox quirks (READ THIS)

The FUSE mount has multiple defects that cost real time. Work around them:

1. **`Edit` tool truncates files.** When you call Edit on an existing file, the FUSE mount preserves the original byte count and pads/truncates. If your edit makes the file longer, content from the end gets clipped. **Mitigation**: always `tail -3` and `wc -c` after an Edit. For non-trivial edits, use a Python `rm + write` pattern via `mcp__workspace__bash`:
   ```python
   with open(path, 'rb') as f: data = f.read()
   data = data.replace(old, new, 1)
   os.remove(path)
   with open(path, 'wb') as f: f.write(data)
   ```

   Related manifestation: bash views of files in the FUSE mount may show truncated content even when the `Read` tool sees full content for the same path — the host-side (Windows) file is usually intact, the bash view is the unreliable one. When pre-flighting (`wc -c`, `tail -3`) the file looks wrong via bash, cross-check via the `Read` tool before assuming the file on disk is broken. Verified at PR #14 (Phase 3 session, 2026-05-10): `CLAUDE.md` read fine via Read but bash `tail -3` cut off mid-word; on-disk content was intact. When this hits, don't read-modify-write via Python — construct fresh content from the Read-tool view and write-only via the rm+write pattern.

2. **CRLF line endings.** Files on Windows disk are CRLF; the FUSE mount preserves them. `sed` and Python regex matching needs to handle both LF and CRLF. Pattern:
   ```python
   if old_b in data: data = data.replace(old_b, new_b)
   elif old_b.replace(b'\n', b'\r\n') in data: data = data.replace(...)
   ```

3. **`rm` requires explicit permission**. First call `mcp__cowork__allow_cowork_file_delete(path)` once per session — Mike approves a directory and then deletes work for the rest of the session. Without it, `rm`, `git stash`, `git checkout -b` (any op that creates and removes lock files) fail with "Operation not permitted". Scope the request narrowly the first time. Asking for delete permission on a whole project tree (e.g. `MediaVault/`) will be rejected; asking for the specific subdirectory the work needs (e.g. `MediaVault/.git/`) will be approved. State explicitly in the request that no user files will be touched. Re-requesting after a rejection wastes a round trip.

4. **Slashed branch names fail** (see above). The sandbox can't `mkdir` under `.git/refs/heads/`.

5. **Build needs a manual symlink.** The rolldown native binary is nested wrong for Linux. The lookup path is `node_modules/rolldown/dist/rolldown-binding.linux-x64-gnu.node` (one directory level deeper than `node_modules/rolldown/`):
   ```bash
   ln -sf ../../@rolldown/binding-linux-x64-gnu/rolldown-binding.linux-x64-gnu.node \
     node_modules/rolldown/dist/rolldown-binding.linux-x64-gnu.node
   ```
   Run this before `npm run build` if you're getting `Cannot find module '../rolldown-binding.linux-x64-gnu.node'`. The symlink is gitignored and harmless on Mike's Windows side. Verified at PR #14 (Phase 3 session, 2026-05-10) — earlier path documentation was off by one directory level. The exact target path may rotate (the `.binding-linux-x64-gnu-<hash>` suffix is content-addressed and changes when rolldown updates); locate first with `find node_modules -name 'rolldown-binding*linux*' -not -type l` and symlink to the heaviest non-symlink hit. Verified again 2026-05-25 (T3 session).

6. **Sandbox `git status` can desync after heavy activity.** If you see "No commits yet" or every file as "new", the sandbox view is broken — Mike's actual git state on disk is fine. Verify by asking Mike to run `git status` in PowerShell, or by using the `Read` tool (which reads the Windows path directly, separate from the FUSE git view).

7. **CRLF false positives in `git status`.** On a freshly-mounted repo, `git status` may show every routing-file CSS/JSX as `M` due to CRLF round-tripping through FUSE. Verify with `git diff --ignore-cr-at-eol --stat`; if empty, it's noise — proceed with explicit `git add` paths to keep the noise out of your commit.

8. **FUSE mangles git's internal files — multiple symptoms across multiple triggers.** Originally discovered 2026-05-08 during MediaVault `git init`; further manifestations surfaced at PR #14 (2026-05-10) during normal session work. The common root cause is the same as quirk #1 (FUSE byte-preservation / truncation), but applied to git's atomic `.lock`-rename writes rather than the Edit tool. The trigger is not only `git init` — it can fire on session mount and on any git operation that rewrites internal files atomically (`git stash`, branch ops, etc.).

   Known manifestations:
   - **`.git/config` written as null bytes** (54 bytes of `\x00`) from bash's view on a fresh `git init`, while the host-side filesystem shows partial valid content. Fix: rewrite `.git/config` via the rm+write Python pattern from quirk #1.
   - **`.git/objects/` missing entirely** after `git init`. Without it, `git status` reports "not a git repository." Subdirectories `info/` and `pack/` are also missing. Fix: `mkdir -p .git/objects/info .git/objects/pack`.
   - **`.git/HEAD` arriving with trailing null bytes on session mount** (e.g. 34 bytes instead of 21, with `\x00` padding after `ref: refs/heads/main\n`). Symptom: `git rev-parse HEAD` errors with "Failed to resolve HEAD as a valid ref" / "ambiguous argument 'HEAD'"; `git status` may also error. Fix: rm+write Python pattern with a clean `ref: refs/heads/main\n` (21 bytes).
   - **`.git/index` corrupted by `git stash` (or other atomic-rewrite ops)**. Symptom: "bad signature 0x00000000" or "index file corrupt". Fix: `rm .git/index && git read-tree HEAD` to rebuild the index from the committed tree. No working-tree changes are lost — `git read-tree HEAD` only rewrites the staging area.

   Symptoms appear immediately: `git status` errors; `cat` of the file returns nulls; `git rev-parse HEAD` fails; `xxd .git/HEAD | head` shows trailing `00`s.

   Workaround (general pattern):
   ```bash
   # Write the broken file via the rm+write Python pattern (bash-side won't trust the host write).
   # Use the same Python rm+write block from quirk #1.

   # If `.git/objects/` is missing, create it manually:
   mkdir -p .git/objects/info .git/objects/pack

   # If `.git/index` is corrupt, rebuild it from HEAD:
   rm .git/index
   git read-tree HEAD

   # Verify:
   git status      # should now report a clean repo
   git rev-parse HEAD
   git fsck --full # should be silent / no errors
   ```

   Additional constraint: the host-side `Edit` and `Write` tools refuse `.git/` paths ("resolves to a protected location"). All `.git/` writes must go through bash via FUSE — which is the layer that breaks. The rm+write Python pattern is the only reliable path.


## Cowork environment quirks (operational hygiene)

The section above ("Cowork sandbox quirks") catalogues the underlying bugs. This section is the operational protocol that accumulated across the Phase C → tagging audit arc (May 2026). Hard rules; follow them before re-discovering each lesson.

### 1. The 16 KB tail-truncation rule (M1 §7.3)

When the `Edit` or `Write` tool produces a file larger than ~16 KB *post-edit*, the tail silently truncates. Pre-edit size doesn't matter; post-edit size does. Refines quirk #1 with the concrete boundary.

**Detection**: `wc -l` + `tail -3` after every edit on a file near the boundary; compare actual line count to expected delta.

**Recovery**: pull intact version from `git HEAD`, reassemble in `/tmp/`, `shutil.copy2` back to the live path, SHA-verify and re-grep anchors.

**Hard rule**: files at or past the boundary use anchor-based Python patches via heredoc, never direct `Edit`/`Write` tool calls. Confirmed sites past the boundary: `mediavault.html`, `yt_archive_capture.py`, `CHANGELOG.md`, all audit briefs, all multi-section run reports.

### 2. Virtiofs phantom-deletions in `git status`

When sandboxed bash runs `git status` against a mounted Windows repo, it frequently reports mass deletions (`D path1 path2 ...`) and `bad signature 0x00000000` errors. These are virtiofs-side view artifacts. The real files exist on disk; host git is fine. Specialised manifestation of quirk #6 (sandbox `git status` desync) + quirk #8 (FUSE-mangled git internals).

**Detection**: `ls` the "deleted" paths from sandbox — they exist. `git log` and `git show <hash>:<path>` work correctly. Host PowerShell `git status` is clean.

**Hard rule**: **Git commits run on host PowerShell only — for any virtiofs-mounted repo.** Sandbox can write the working tree; sandbox cannot safely stage or commit, because `.git/index.lock` writes succeed but `rm -f .git/index.lock` fails with "Operation not permitted" on virtiofs. Originally surfaced in HR; confirmed Museum and MV exhibit the same constraint (release-flow arc, 2026-05-28).

**Recovery prelude** for any host-side HR commit (always-safe, idempotent):

```powershell
if (Test-Path .git\index.lock) { Remove-Item .git\index.lock }
git reset --mixed HEAD
# then proceed with git add / git commit as usual
```

Recovers any HR index corruption that bled through from sandbox activity. Cheap; include in every host-paste block by default.

**First-sighting note**: rule and first confirmed sighting coincided. During the same hygiene-commit session (`af8e761`) that banked this rule, sandbox `git status --short` flagged `hunter_root.json` as a 1,929-line phantom delete while host `git status --short` returned clean.

### 3. Virtiofs COMMIT failure on SQLite writes (M1 §7.2 expanded)

SQLite `COMMIT` against a DB on a virtiofs-mounted path fails with "disk I/O error" / "database is locked" / silent corruption. Pattern is universal — any DB write that needs to COMMIT must run against a copy on the sandbox's native filesystem.

Working pattern (v0.5.6, v0.5.7, v0.5.8 sessions):

1. `shutil.copy2(live_db, '/tmp/<unique>.sqlite')`.
2. Open the `/tmp/` copy; do all writes; COMMIT there.
3. Independent re-verify on the `/tmp/` copy.
4. `shutil.copy2('/tmp/<unique>.sqlite', live_db)` — **not** `os.replace`, which fails cross-device on virtiofs mounts.
5. Final verify on the host DB from a fresh connection.

Step 4 is the trap: `os.replace` looks idiomatic for atomic rename, but virtiofs is a different device than `/tmp` and the rename errors out. `shutil.copy2` is the safe variant.

### 4. Cowork delete permission is per-session

`mcp__cowork__allow_cowork_file_delete` for `C:\AI` does NOT persist across sessions. Budget one re-grant call at GATE 2 time per session, or earlier if file deletion is needed mid-session (e.g. `.git/index.lock` cleanup). Refines quirk #3 with the "per-session" constraint.

### 5. Folder mounts are per-session too

Fresh Cowork sessions start with no mounts. Audit-on-entry must call `mcp__cowork__request_cowork_directory` for each repo the session needs (typically Museum + MV + HR) before any other work. The request is reliable and idempotent.

### 6. The release flow (cross-reference)

The 4-step release flow lives in `### Release flow` above (the one that ships MV's released artifacts to weird.baby). Step 2 (`npm run export-artifacts`) is the most-missed step; the `EXHIBIT_BACKFILL_DEPLOY` session traced the "released video didn't show up" symptom directly to skipping it. Re-read that section before any release-related work.

### 7. Audit-on-entry kickoff premises can be stale

Kickoff briefs reference file paths, function names, and existing-code states from the operator's memory of a session start that may be hours or days old. T3 (2026-05-25) hit four wrong anchors in one kickoff: server change "in mediavault.html" was actually in `core/imgserver.py`; `hr_dimensions.js` placement was misremembered by one directory; a heuristic flagged for retirement was already retired weeks earlier; the export tool location was named in the wrong repo.

**Hard rule**: map every kickoff anchor (file path, function name, "existing X" claim) to the actual codebase BEFORE drafting the design. Surface mismatches at GATE 3, not at patch time. The kickoff is a planning artifact; the codebase is ground truth.

### 8. Sandbox FUSE cache doesn't auto-invalidate on host writes

When the operator runs a host-side write mid-session (an export script, `npm install`, a Python script invoked from PowerShell), the sandbox's view of the rewritten files remains the pre-write stale version. Symptoms: sandbox `stat` shows old mtime, `wc -c` shows old size, `cat` returns old content, `git status` doesn't list the files. The Read tool (host-direct) shows fresh content. `drop_caches` requires root and is not available. No reliable sandbox-side invalidation exists.

**Hard rule**: when a host-side write occurs mid-session, assume the sandbox view is stale until cross-checked via the Read tool. If staging or commit comes next, hand off to host PowerShell (per §2). Generalises sandbox-quirk #6 beyond `git status` desync to any file content. Surfaced T3 (2026-05-25) on the museum-side JSON regen.

### 9. Build smoke is workerd-blocked in sandbox

`npm run build` cannot run in the cowork sandbox: rolldown and workerd both have Windows-installed binaries that don't work on Linux. Rolldown is fixable via the symlink in sandbox-quirk #5. Workerd would require `npm install @cloudflare/workerd-linux-64` which mutates node_modules too invasively for a verification check.

**Substitute smoke pattern for museum-side JS changes**:

1. `node --check <file>` — syntax.
2. `npx eslint <file>` — isolated lint.
3. Full-repo `npm run lint` baseline-diff — zero new errors.
4. If the change is a function/comparator, write an inline Node `--input-type=module` unit test with mocked dependencies.

Build itself runs on the operator's Windows side. Applied T3 (2026-05-25); all four steps cleared.

### 10. hunter_root.json regen can shrink the released set

`npm run export-artifacts` writes the *current* MV released set. If MV release-status flips have shrunk the set since the previous export (unrelease, retire, status correction), the new JSON will have fewer artifacts than the committed version. T3 session captured a 54 → 45 drop with no upstream change in scope. Two clarifications: re-derive the before-count from the prior `hunter_root.json` on disk — never trust a carried-forward count, which goes stale across sessions. And a legitimate down-regen (intended cleanup, retag, unrelease) still warrants an explicit acknowledgement at surfacing time; silence is the bug, not the shrink itself.

**Hard rule**: capture before/after artifact counts on every `export-artifacts` run. If after-count is less than before-count, surface to operator before committing — the shrink may be intended (cleanup) or a regression (accidental unrelease), and it isn't visible from the diff summary alone.

### 11. Sandbox cannot reach MV HTTP server

`npm run export-artifacts` hits `fetch('http://127.0.0.1:51822/db')` to read MV's released set. From the cowork bash sandbox, `127.0.0.1` is sandbox-local — not the Windows host. `host.docker.internal` DNS-fails; the default gateway (172.16.10.1:51822) times out. No working sandbox→host route to MV's HTTP server exists.

**Hard rule**: any flow that calls MV's HTTP server runs on host PowerShell, with MV launched first via `C:\AI\Platform\MediaVault\launch_mediavault.bat`. `export-artifacts` is the canonical case. Sandbox handles verification, build, and deploy; sandbox does NOT run `export-artifacts`. Surfaced release-flow run, 2026-05-28.

### 12. Virtiofs maps NTFS-illegal characters to PUA glyphs

Linux-created filenames containing NTFS-illegal characters (`: \ * ? " < > |`) appear on the Windows side with those characters mapped to U+F0xx private-use-area glyphs. PowerShell then parses the displayed glyph back as the original illegal character and tries to resolve it as a path component (e.g., `'.\C:\AI\...'` becomes a drive-letter attempt and fails).

**Hard rule**: address such files by substring wildcard, never literal name.

```powershell
Get-ChildItem -Force | Where-Object { $_.Name -like '*substr*' } | Remove-Item -Recurse -Force
```

First sighting (release-flow run, 2026-05-28): a stray `C:\AI\Platform\MediaVault/`-named directory in the museum repo — a leaked path-string-as-folder from an earlier session. Resolved via the wildcard pattern above.

### 13. Run reports land on disk before the session's final commit

Every cowork session writes its run report to a known path on disk BEFORE that session's final commit (if any). The path goes into the next session's kickoff `§LOCKED_CONTEXT` so the report is recoverable.

**Why**: backfilling after commit means the commit's accompanying artifact is missing from the moment it lands. The hygiene-commit session (`af8e761`) backfilled successfully; the release-flow session's report apparently never landed in a locatable place at all — which forced this deferred-banking close-out session to exist. The very gap this rule addresses is the gap that created it.

**Hard rule**: for any cowork session that produces a commit, write the run report to disk first, name it into the operator's kickoff, then hand the commit text to the operator. Sessions that don't commit still write a report and name it into the carryforward.

### 14. Commit integrity (mount truncation guard)

Commit integrity (mount truncation guard, learned 2026-06-02): the Cowork repo mount can return a STALE cached file size while serving correct content on read. git's stat optimization then either skips the file or hashes a TRUNCATED blob capped at the stale size — silently dropping the bottom of the file into the commit. On commit 0cf9604 this nearly committed a STATE.md with its bottom third chopped off. Therefore, before ANY Cowork commit: for every staged file, compare the committed blob byte-count (git cat-file -s :<path>) against the host file's true size (host-side Get-Item Length, not the mount's stat). If they differ, do NOT commit — rebuild the file from git objects (original body from HEAD + the intended edit) and re-verify until sizes match. This applies to ALL files, not just large ones — a 49-line file was the one that got hit.

## Things that are explicitly off-limits

- **`src/styles/museum-tokens.css`** — design tokens. Off-limits for population/data work; only touch with explicit UX direction.
- **Routing files** during data tasks — `Exhibit.jsx`, `HrExhibitFlow.jsx`, etc. are routing components. Population/data tasks should not modify them. UX tasks can.

## Pre-existing lint debt (4 errors)

These have been on `main` since before May 2026 and are deliberately untouched. Each needs semantic review, not a mechanical fix:

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
`provenance/asset-table.json`, **Mike's, null on all 315 rows, and Ops does not
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

## Recent session log

Maintained here. Newest first.

### 2026-08-07 -> THE WORKSHEET (W1-W8) - sealed
- **THE PRIOR PAGE FAILED ON NEITHER ACCURACY NOR TONE, WHICH IS WHY NOTHING
  CAUGHT IT.** `week1.html` explained the rail scheme, the provenance model, the
  transfer classes, the bouncy ball law and five collisions **before it showed a
  single headline**, and then had nowhere for Mike to write - *"if it is the
  firehose I have to drink from to do anything, thanks, pass."* It is two files
  now: **`worksheet.html`** (32 slots across two weeks and ten days, Ops left /
  input right, `localStorage` autosave surviving a reload, one button that
  gathers everything into plain text) and **`reference.html`**. The generator
  **prunes `week1.html` by name** rather than leave an orphan every other page
  still links past. Gates: lint **11/9 = baseline** - build green - provenance
  **PASS** - `reveal:check` **PASS** - `parity:gate` **PASS** - `instory:gate`
  **PASS** - `assets:orphans` **0** - **the lap RAN, six pages, 390px and
  1228px**, zero sideways scroll, zero console errors. Log:
  `docs/MUSEUM_WORKSHEET_LOG-20260807.md`.
- **WEEK TWO ARRIVED IN WRITING, WHICH MAKES IT QUOTABLE, AND THE OLD RAIL SCHEME
  HAD NO WAY TO SAY SO.** W1's rule was built for a week Mike SPOKE, so
  gold-empty was a fact about week one rather than a policy. Carrying six written
  beats on the blue rail would have been the **inverse** of the error the rails
  exist to prevent: **his own sentence left in blue gets quietly "improved" by
  the next round and nothing can tell it was ever his.** `reveal/week-two.mjs`
  carries a `beat` field that **may be deleted but never reworded**. Ops divided
  six beats into five days and **the one merge is named** - *the unlabeled table
  holding more codes* + *the codes that fail when typed directly*, one object -
  and **no `weight` was invented** (K-b), for the same reason no `bucket` is
  derived (B-a).
- **THE OUTLINE PRODUCED EXACTLY ONE COLLISION AND IT IS THE ROUND'S OPEN ITEM
  (X-1).** Week two's Friday is a box on a porch; `TRANSFERS.PACKAGE.opens` is
  **3**; that beat is the only one in either week outside its own window. Three
  ways out, all Mike's, and **the cheapest - rule that an unlabelled box is not a
  package - is a change to the transfer model's own boundary, which Ops does not
  make on an inference.** Where it is surfaced is half the answer: one amber line
  on the day-5 block, the argument on the reference page. Four other checks agree,
  two of them unarranged.
- **THE SHELL WAS MOVED AND THE MOVE WAS PROVED.** Seven declarations left
  `prep.mjs` for `tools/dictation/shell.mjs`; the three pages that did not change
  came out **byte-identical** to copies taken before the split. **AND THE LAP
  FOUND A BUG NO GATE HERE CAN SEE:** `font: 14px/1.5 inherit` is invalid - the
  shorthand takes a family - so Chrome dropped it and every writing field came up
  in the UA's monospace, **on the one page whose job is writing**. The same
  construction is in the shared `OPS_CSS` three times, noted rather than changed.
- **ONE THING IS UNMEASURED AND IS SAID PLAINLY.** Whether `clipboard.writeText`
  succeeds under a genuine user click: real mouse input stopped reaching the page
  mid-session, so every test click was synthetic and carried no user activation.
  The fallback (select the text, say so) was observed working and the button is
  useful either way. **Also: never call `navigator.clipboard.readText()` from the
  driver** - it raises a tab-modal permission prompt that froze the renderer and
  timed out CDP. **Nothing in `src/` changed.** **Surfacing unmoved at 20
  spendable - the FOURTH packet running.**

### 2026-08-07 -> THE TWO BUCKETS + 013 (B1-B3) - sealed
- **THE BOUNCY BALL LAW CAPS POINTS OF FOCUS, NOT ASSETS, AND THE OLD SENTENCE WAS
  NOT FALSE - WHICH IS WHY NOTHING CAUGHT IT.** It was carried as *"never more than
  two or three offerings in a day"*, and Ops supplied the wrong UNIT twice: in the
  rule's own bearing line, and in the tracker, which divided a count of PHOTOGRAPHS
  by a ceiling on ATTENTION and printed **"16 pictures = 6-8 days of material"**.
  Every input was a real measurement and the arithmetic was sound. **VOID.** The law,
  the two buckets and the two runways are **`reveal/focus.mjs`** (Doctrine 20);
  `VOIDED` keeps the dead figure with its cause, because a superseded number that is
  merely deleted comes back the next time somebody does the obvious arithmetic. Gates:
  lint **11/9 = baseline** - build green - provenance **PASS** - `reveal:check`
  **PASS** - `parity:gate` **PASS** - `instory:gate` **PASS** - `assets:orphans`
  **0** - **the lap DID NOT RUN**, said plainly below. Log:
  `docs/MUSEUM_TWO_BUCKETS_LOG-20260807.md`.
- **THE ASYMMETRY IS THE MECHANISM AND THE THIRD NUMBER IS THE HONEST ONE.** PRECIOUS
  has a ceiling (two or three A WEEK - the period moved with the unit), so it divides
  into weeks; **DUMP has none, so it divides into nothing** and `runways()` is
  structurally unable to print one for it - a symmetrical table would re-commit the
  original error in the other bucket. **`bucket` is the sixth JUDGED field on the
  asset table** beside `verdict`, carried across a scan, **null on all 315 rows**, and
  **Ops does not derive it**: a heuristic calling every machine photograph precious
  would make every tracker read as answered while nothing had been answered. So the
  16 pictures behind the door are **between nothing at all and 6-8 WEEKS** - the
  number survived, the unit moved - and the whole gap is **B-a**.
- **RECORD 013 IS THE PROTOTYPE AND IS KEPT, ON MIKE'S OWN CRITERION.** He offered
  retire-or-mark and one test - *honest AND the machinery exercised* - and retiring
  empties the volume: `RecordEntry.jsx` never mounts, the index budgets police no
  string, the per-entry derivation loops over nothing, and `delivered()` goes empty,
  **leaving the pull-back rule with no positive case anywhere in the museum**. **The
  mark is in the ledger and the dictation pages and NOWHERE ON THE GLASS** - that
  line's subject is the making of the museum (Doctrine 11), and the entry's own text
  asserts nothing false. **Nothing in `src/` changed this round at all.**
- **W-1 CLOSES WITH A FOURTH ANSWER THAT WAS NOT ON THE LIST** - all three readings
  assumed the entry in the tree and day one's entry were the same entry; Mike
  dissolved the premise, so day 1's entry is **001 and does not exist yet**. **M19
  closes**: a record number is THIS VOLUME'S own, from 001. **And closing M19 exposed
  that C8's stated blocker was the wrong one** - `recordEpoch` is a DATE, not a
  number, so C8 waits on Record 001's date and always did. **013's NUMBER is
  deliberately untouched (B-b)** - he said it needs no re-dating, and `no` is the
  field the whole ledger is keyed on.
- **THE LAP DID NOT RUN: the Chrome extension is not connected in this session.** No
  `src/` file changed, so the glass is byte-identical to yesterday's 389px/1233px
  measurement, and a static structural check cleared all five pages (every table
  inside a `.tw` scroller, no new hard widths, no images). **That is mitigation, not
  a measurement, and it is not being called one.** Surfacing unmoved at **20
  spendable - the third packet running** with nothing off the back shelf.

### 2026-08-07 -> THE WEEK ONE OUTLINE (W1) - archived
Moved verbatim to `docs/CLAUDE_SESSION_LOG_ARCHIVE-202605.md` under this file's
own ~600-line rule. **What is still load-bearing in it is NOT in the archive:**
the outline is `reveal/week-one.mjs` and its rail scheme is now the THREE MARKS
section above; its `MIKE-NAMED` marker is the amber *your rule - Ops wording*
tag; and **W-1 was closed by B2** (013 is a prototype), with **W-4 closed by B1**
and **W-2, W-3, W-5 standing as agreements** - all five still print, beside week
two's five, on `docs/dictation-20260807/reference.html`.

### 2026-08-07 -> THE DICTATION PREP (K1-K6) - archived
Moved verbatim to `docs/CLAUDE_SESSION_LOG_ARCHIVE-202605.md` under this file's
own ~600-line rule. **What is still load-bearing in it is NOT in the archive:**
the four pages are `npm run dictation` and `tools/dictation/prep.mjs`; its
findings are registers **K-a** (an orphan check cannot see an unjudged orphan,
and §8's two-addresses hazard holds the same picture as two rows), **K-b** (no
authored week-one outline — now IN PROGRESS, see W1 above), **K-c** and **K-d** in
`docs/OPEN_ACTIONS.md`; and **the eleven photographs are deleted on Mike's
ruling**, with what the robot egg is left with written into the ledger row.

### 2026-08-06 -> THE NIGHT ROUND (N1-N6) - archived
Moved verbatim to `docs/CLAUDE_SESSION_LOG_ARCHIVE-202605.md` under this file's
own ~600-line rule. **What is still load-bearing in it is NOT in the archive:**
N2's Doctrine 18 is `npm run instory:gate` and the THREE STANDING RULES section
above; N4's expander rule is `scrollbar-gutter: stable` in `src/index.css` and is
that section too; N3's `[PAPA]` strip is `wb-ops-notes` in `vite.config.js` with
`visitorProse` unchanged to the character; and **N5's 390px recipe is
`tools/lap/harness.html` and `npm run lap`** — a 403px same-origin iframe, which
is what this round's own four pages were lapped with. **N-j is still open** and
is the one thing that lap found on `/hr`.

### 2026-08-06 -> THE VISIBILITY RULE + FORMAT CONFORMANCE (V1-C1) - archived
Moved verbatim to `docs/CLAUDE_SESSION_LOG_ARCHIVE-202605.md` under this file's
own ~600-line rule. **What is still load-bearing in it is NOT in the archive:**
V1's two stages and four shut prefixes are the paragraph at the head of this
file and `OPERATIONS.md` §5's THE STAGE and A HELD THING MUST BE UNREACHABLE
rows; **its "a picture has two addresses" hazard is §8's own row** and is the
thing that broke four instruments in one round; F1's FAQ factory is the §5 FAQ
FORMAT row; G1's measured guest-book row is `--gb-row`, 23px, measured off the
tallest signature; and C1's cull is the eleven kept photographs, which N1 has
now put in a folder Mike can open. **M97 was its fourth consecutive record of
the 390px lap not running; N5 closed it.**


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
- Update "Cowork sandbox quirks" when you hit something new.
- If you add a new piece of design vocabulary (a constant, a CSS variable, a behavior pattern), add it here so the next session doesn't reverse-engineer it.
- Don't let this file grow past ~600 lines. If it does, archive older session log entries to `docs/`.
