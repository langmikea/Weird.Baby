<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# Phase 1 Report — Make the museum HR-only in code

**Date:** 2026-05-02
**Scope:** Remove Carsie Blanton, the LyricMap workshop, and confirmed-orphan HR files from the live source tree. Quarantine only — no deletions, no commits, no deploy.
**Status:** Steps 1–8 complete. Step 9 (`vite build`) **could not be verified in the Cowork sandbox** for environmental reasons (see Step 9 below). Code-level changes are believed sound based on the import sanity check; the user must re-run `npx vite build` on Windows to complete verification.

**Note on continuation:** This report was first written end-to-end. After the user reviewed the pre-flight findings, the brief was supplemented with four clarifications (A–D below). The supplements are inline in the relevant sections; nothing has been re-executed on disk. The state captured in this report reflects what is currently on disk.

> **A** — For each file edit (Steps 2, 3, 7), capture current content of the relevant section before and after.
> **B** — For Step 2, report the full route table before and after.
> **C** — For Step 4, note which CB files were tracked vs. untracked at move time.
> **D** — For Step 8, if `grep` returns hits, check whether they're inside `.bak` files or comments before stopping.

---

## Step 1 — Pre-flight

### Git status at start of Phase 1

```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit (selection — full list captured in PHASE_1_PREFLIGHT.txt):
  modified:   .gitignore, README.md, STATE.md, eslint.config.js,
              index.html, package-lock.json, package.json, vite.config.js,
              wrangler.jsonc, public/_routes.json, public/icons.svg,
              src/App.css, src/App.jsx, src/main.jsx, src/worker.js,
              src/data/artists/carsie-blanton.js, src/data/artists/hunter-root.js,
              src/data/hr_archive.js, src/data/hr_artifacts.js, src/data/wb_roster.js,
              src/routes/WbAdmin.jsx, src/routes/WbHome.jsx,
              src/routes/exhibit/Exhibit.css, src/routes/exhibit/Exhibit.jsx,
              src/routes/hr/HrExhibitFlow.jsx, src/routes/hr/HrFanWall.jsx,
              src/routes/hr/HrMedia.jsx, src/routes/hr/HrMerch.jsx,
              src/routes/hr/HrWorkshop.jsx, src/routes/hr/workshop/LyricMap.jsx,
              src/assets/vite.svg
  deleted:    docs/HOMESTEAD_INSTAGRAM_SPEC_v0.2.md, docs/MUSEUM_STRUCTURE_SPEC_v0.1.md,
              docs/SESSION_CAPTURE_PANEL2.md, docs/SESSION_CAPTURE_PANEL2_INTEGRATION.md
  modified:   docs/COMPONENT_PHILOSOPHY.md, docs/PANEL3_ARTIFACTS_SPEC_v0.1.md

Untracked (selection):
  PHASE_0_REPORT.md, BACKLOG.md, RESET_PROTOCOL.md, deploy.ps1, facebook-post.md
  STATE.md.bak_pre_v47_close_20260430_220854
  src/data/cb_archive.js, src/data/cb_artifacts.js,
  src/data/cb_exit_flow.js, src/data/cb_journal_prompts.js,
  src/routes/cb/CbExhibitFlow.jsx
  poc/, prototypes/, tools/, docs/archive/, docs/canonical/, docs/superseded/
  (plus ~50 untracked design / session-close / inventory docs in docs/)
```

Full pre-flight capture: `PHASE_1_PREFLIGHT.txt`.

### File-presence check (Step 1 explicit asks)

| Path                                       | Status      | Notes                                         |
| ------------------------------------------ | ----------- | --------------------------------------------- |
| `src/bd_data.js`                           | **PRESENT** | 719,470 bytes                                 |
| `src/tp_data.js`                           | **PRESENT** | 170,234 bytes                                 |
| `src/routes/hr/workshop/LyricMap.jsx`      | **PRESENT** | 112,690 bytes                                 |
| `src/routes/hr/HrWorkshop.jsx`             | **PRESENT** | 296 bytes (small linker)                      |
| `src/routes/hr/workshop/` (directory)      | **EXISTS**  | Contains **only `LyricMap.jsx`** — no others. |

Both `bd_data.js` and `tp_data.js` exist. The Phase 0 inventory's "possible broken import" concern is not reproduced here: the files themselves were present in `src/`, so any broken imports in audit notes were likely about path expectations rather than missing files.

---

## Step 2 — App.jsx route + import removal

### Imports (lines 3–13) — before

```jsx
import WbHome     from "./routes/WbHome.jsx";
import WbAdmin    from "./routes/WbAdmin.jsx";
import HrSpine    from "./routes/hr/HrSpine.jsx";
import HrHome     from "./routes/hr/HrHome.jsx";
import HrMedia    from "./routes/hr/HrMedia.jsx";
import HrArchive  from "./routes/hr/HrArchive.jsx";
import HrFanWall  from "./routes/hr/HrFanWall.jsx";
import HrWorkshop from "./routes/hr/HrWorkshop.jsx";
import LyricMap   from "./routes/hr/workshop/LyricMap.jsx";
import CbSpine    from "./routes/cb/CbSpine.jsx";
import GiftShop   from "./routes/shop/GiftShop.jsx";
```

### Imports — after

```jsx
import WbHome     from "./routes/WbHome.jsx";
import WbAdmin    from "./routes/WbAdmin.jsx";
import HrSpine    from "./routes/hr/HrSpine.jsx";
import HrHome     from "./routes/hr/HrHome.jsx";
import HrMedia    from "./routes/hr/HrMedia.jsx";
import HrArchive  from "./routes/hr/HrArchive.jsx";
import HrFanWall  from "./routes/hr/HrFanWall.jsx";
import GiftShop   from "./routes/shop/GiftShop.jsx";
```

Removed: `HrWorkshop`, `LyricMap`, `CbSpine`. Other imports (`BrowserRouter, Routes, Route, useNavigate` from `react-router-dom` and `useEffect, useRef` from `react`) were untouched. `Exhibit` is not imported by `App.jsx` directly — HR routes wrap it internally — so no `Exhibit` import existed to touch.

### Full route table (clarification B) — before

```jsx
<Route path="/" element={<WbHome />} />
<Route path="/admin" element={<WbAdmin />} />
<Route path="/hr" element={<HrSpine />} />
<Route path="/hr/home" element={<HrHome />} />
<Route path="/hr/media" element={<HrMedia />} />
<Route path="/hr/archive" element={<HrArchive />} />
<Route path="/hr/fan-wall" element={<HrFanWall />} />
<Route path="/hr/workshop" element={<HrWorkshop />} />
<Route path="/hr/workshop/lyric-map" element={<LyricMap />} />
<Route path="/cb" element={<CbSpine />} />
<Route path="/shop" element={<GiftShop />} />
```

11 routes total.

### Full route table — after

```jsx
<Route path="/" element={<WbHome />} />
<Route path="/admin" element={<WbAdmin />} />
<Route path="/hr" element={<HrSpine />} />
<Route path="/hr/home" element={<HrHome />} />
<Route path="/hr/media" element={<HrMedia />} />
<Route path="/hr/archive" element={<HrArchive />} />
<Route path="/hr/fan-wall" element={<HrFanWall />} />
<Route path="/shop" element={<GiftShop />} />
```

8 routes total. Three removed: `/hr/workshop`, `/hr/workshop/lyric-map`, `/cb`. No other route was touched. Order of remaining routes preserved exactly. The `KeyWatcher` admin keystroke component is unchanged.

---

## Step 3 — Roster trim

### `wbRoster` array (lines 14–33) — before

```js
export const wbRoster = [
  {
    id: "hr",
    name: "Hunter Root",
    exhibitRoute: "/hr",
    storeUrl: "https://www.hunterroot.com/",
    storePlatform: "Squarespace",
    image: null, // typography fallback until photo added
    blurb: "Lancaster, PA. Six albums from Medusa's Disco to Crooked Home. Songs that arrive quietly and stay.",
  },
  {
    id: "cb",
    name: "Carsie Blanton",
    exhibitRoute: "/cb",
    storeUrl: "https://store.carsieblanton.com/collections/featured-merch",
    storePlatform: "Shopify",
    image: null, // typography fallback until photo added
    blurb: "Twenty years independent. Folk-pop, jazz standards, protest songs. Head Bitch Music. No gatekeeper.",
  },
];
```

### `wbRoster` array — after

```js
export const wbRoster = [
  {
    id: "hr",
    name: "Hunter Root",
    exhibitRoute: "/hr",
    storeUrl: "https://www.hunterroot.com/",
    storePlatform: "Squarespace",
    image: null, // typography fallback until photo added
    blurb: "Lancaster, PA. Six albums from Medusa's Disco to Crooked Home. Songs that arrive quietly and stay.",
  },
];
```

The `id: "cb"` Carsie Blanton object was removed. Hunter Root is the only roster entry. Helper functions `getArtistById` and `pickRandomArtist` and all surrounding comments were untouched.

---

## Step 4 — CB code quarantined

Created `_quarantine/cb/` and moved (no deletions). Tracked status determined by `git cat-file -e HEAD:<path>` against the last commit (April 13):

| Source (src/) path                          | Destination (_quarantine/cb/) path                | At HEAD?  |
| ------------------------------------------- | ------------------------------------------------- | --------- |
| `src/data/artists/carsie-blanton.js`        | `_quarantine/cb/data/artists/carsie-blanton.js`   | TRACKED   |
| `src/data/cb_archive.js`                    | `_quarantine/cb/data/cb_archive.js`               | UNTRACKED |
| `src/data/cb_artifacts.js`                  | `_quarantine/cb/data/cb_artifacts.js`             | UNTRACKED |
| `src/data/cb_exit_flow.js`                  | `_quarantine/cb/data/cb_exit_flow.js`             | UNTRACKED |
| `src/data/cb_journal_prompts.js`            | `_quarantine/cb/data/cb_journal_prompts.js`       | UNTRACKED |
| `src/routes/cb/CbSpine.jsx`                 | `_quarantine/cb/routes/cb/CbSpine.jsx`            | TRACKED   |
| `src/routes/cb/CbExhibitFlow.jsx`           | `_quarantine/cb/routes/cb/CbExhibitFlow.jsx`      | UNTRACKED |
| `src/routes/cb/cb_discography.js`           | `_quarantine/cb/routes/cb/cb_discography.js`      | TRACKED   |
| `src/routes/cb/cb_facts.js`                 | `_quarantine/cb/routes/cb/cb_facts.js`            | TRACKED   |

Totals: 4 tracked, 5 untracked. The five untracked files (`cb_archive.js`, `cb_artifacts.js`, `cb_exit_flow.js`, `cb_journal_prompts.js`, `CbExhibitFlow.jsx`) were created after the April 13 commit and were never committed — they're being quarantined directly from working-tree state. The four tracked files will appear as `D` (deleted) in `git status` until the next commit; their content is preserved verbatim under `_quarantine/cb/`.

`src/routes/cb/` directory removed (now empty after moves). `src/data/artists/` retains only `hunter-root.js`.

Note on git tracking: an attempted `git mv` was blocked by a stale `.git/index.lock` (timestamp Apr 14 03:11 — left over from a prior crashed git process; no live git process was found via `ps`). Plain `mv` was used instead — Phase 1's no-commits constraint makes this immaterial. The lock file was **not touched**; it is left for the user to remove when convenient.

---

## Step 5 — LyricMap and lyric data quarantined

Created `_quarantine/lyricmap/` and moved:

| Source path                                | Destination path                                         | At HEAD? |
| ------------------------------------------ | -------------------------------------------------------- | -------- |
| `src/routes/hr/workshop/LyricMap.jsx`      | `_quarantine/lyricmap/routes/hr/workshop/LyricMap.jsx`   | TRACKED  |
| `src/routes/hr/HrWorkshop.jsx`             | `_quarantine/lyricmap/routes/hr/HrWorkshop.jsx`          | TRACKED  |
| `src/bd_data.js`                           | `_quarantine/lyricmap/bd_data.js`                        | TRACKED  |
| `src/tp_data.js`                           | `_quarantine/lyricmap/tp_data.js`                        | TRACKED  |

All four tracked at HEAD. Step 1 confirmed `src/routes/hr/workshop/` contained nothing beyond `LyricMap.jsx`, so no additional files needed inclusion.

`bd_data.js` and `tp_data.js` were both present; both moved successfully. (Phase 0 had flagged a possible broken import — non-issue; the files exist and are large data files that LyricMap imports.)

---

## Step 6 — HR orphans verified, then quarantined

Pre-move grep:

```
$ grep -rn "HrPanel2\|HrPanel3\|HrMerch" src/
src/routes/hr/HrMerch.jsx:2:export default function HrMerch() {
src/routes/hr/HrPanel2.jsx:446:export default function HrPanel2({ activeAlbumId }) {
src/routes/hr/HrPanel3.jsx:4:import { Journal } from "./HrPanel2.jsx";
src/routes/hr/HrPanel3.jsx:232:export default function HrPanel3({ activeAlbumId }) {
```

Analysis:

- `HrMerch.jsx`: only its own `export default` — no live consumers.
- `HrPanel2.jsx`: only its own `export default` — no live consumers.
- `HrPanel3.jsx`: imports `Journal` from `HrPanel2.jsx`. This is an orphan-to-orphan reference; both files are being quarantined together, so the import remains internally valid inside `_quarantine/hr_orphans/` but is no longer referenced from the live tree.

No live (non-`.bak`, non-quarantined) file in `src/` imported any of the three. Safe to move:

| Source path                       | Destination path                          | At HEAD? |
| --------------------------------- | ----------------------------------------- | -------- |
| `src/routes/hr/HrPanel2.jsx`      | `_quarantine/hr_orphans/HrPanel2.jsx`     | TRACKED  |
| `src/routes/hr/HrPanel3.jsx`      | `_quarantine/hr_orphans/HrPanel3.jsx`     | TRACKED  |
| `src/routes/hr/HrMerch.jsx`       | `_quarantine/hr_orphans/HrMerch.jsx`      | TRACKED  |

No move was blocked by a live import. All three orphans were tracked at HEAD.

---

## Step 7 — index.html title and meta

### Full file — before

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/favicon-180.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weird.Baby</title>
    <meta name="description" content="Lyric Intelligence Engine — Word maps, theme analysis, and timeline for Hunter Root and Jesse Welles." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Full file — after

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/favicon-180.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weird.Baby</title>
    <meta name="description" content="Weird.Baby Museum. Currently exhibiting Hunter Root." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### One-line change

Only line 9 changed (the `<meta name="description">` `content` attribute). All 14 other lines, including line 8's `<title>Weird.Baby</title>`, are byte-identical.

### Discrepancy / anomaly

The audit framing implied both `<title>` and `<meta name="description">` would need replacement. In fact, the `<title>` was **already** `Weird.Baby` in the live file — only the `<meta name="description">` carried the old "Lyric Intelligence Engine — Word maps, theme analysis, and timeline for Hunter Root and Jesse Welles." string. Only the description line was edited. The title is unchanged. Reporting per the brief's instruction to flag if actual text differs significantly from what the audit described.

---

## Step 8 — Final import sanity check

```
$ grep -rn "import.*\(carsie-blanton\|cb_\|CbSpine\|CbExhibitFlow\|LyricMap\|HrWorkshop\|bd_data\|tp_data\|HrPanel2\|HrPanel3\|HrMerch\)" src/
(no output)
$ echo "exit=$?"
exit=1
```

Zero hits inside `src/`. Pass.

### Clarification D — `.bak` / comment guard

The brief's continuation said: if `grep` returns hits, check whether they're inside `.bak` files or comments before stopping. This guard **was not exercised** because the grep returned zero hits. The recursive grep at `src/` already includes `.bak` files in its sweep — they're inside the directory tree being walked. So the zero-hits result already covers the `HrSpine.jsx.bak` / `HrSpine.jsx.r23.bak` files in `src/routes/hr/`.

For explicit belt-and-suspenders confirmation, the same pattern was re-run constrained to `.bak` files only:

```
$ grep -rn --include="*.bak" "import.*\(carsie-blanton\|cb_\|CbSpine\|CbExhibitFlow\|LyricMap\|HrWorkshop\|bd_data\|tp_data\|HrPanel2\|HrPanel3\|HrMerch\)" src/
(no output)
$ echo "exit=$?"
exit=1
```

Zero hits in `.bak` files either. No comment-or-bak edge case exists to investigate.

---

## Step 9 — Build verification — **NOT VERIFIED IN SANDBOX**

`npx vite build` was run from the project root. It **failed before reaching any source file**, with the following error:

```
file:///…/node_modules/rolldown/dist/shared/binding-Rc5vBspi.mjs:507
  if (loadErrors.length > 0) throw new Error("Cannot find native binding...")

Error: Cannot find native binding. npm has a bug related to optional dependencies …

  [cause]: Error: Cannot find module '@rolldown/binding-linux-x64-gnu'
    code: 'MODULE_NOT_FOUND',
    cause: Error: Cannot find module '../rolldown-binding.linux-x64-gnu.node'
```

### Diagnosis

This is **not a code error.** It is an `npm` optional-dependency / cross-platform issue (npm bug [#4828](https://github.com/npm/cli/issues/4828)). Your `node_modules/` was installed on Windows, which pulled the Windows native binding for rolldown. The Cowork shell is Linux, so when vite tries to load `@rolldown/binding-linux-x64-gnu`, the package isn't present.

The brief instructed: **"If it fails, report the error and stop — do not attempt fixes."** I did not run `npm install`, did not delete `node_modules` or `package-lock.json`, did not switch package managers. The build is unverified in this sandbox.

### What this leaves

The code-level signal we have is the Step 8 grep, which shows no live file in `src/` references any of the moved modules under their old names. `App.jsx` still imports only files that still exist. `wb_roster.js` is internally consistent. No edit touched any file outside the three listed (App.jsx, wb_roster.js, index.html). It is *plausible* the build will succeed, but Phase 1's "must succeed" gate is not formally cleared.

### Recommended next action

Run `npx vite build` from `C:\AI\Projects\weird-baby-update\` on Windows. If it passes, Phase 1 is complete. If it fails, capture the error and report.

Per the brief I have **not** run `wrangler deploy`.

---

## Step 10 — Files edited and moved (consolidated)

### Files edited (3)

| File                              | Change                                                                                  |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| `src/App.jsx`                     | Removed `HrWorkshop`, `LyricMap`, `CbSpine` imports and three routes (`/cb`, `/hr/workshop`, `/hr/workshop/lyric-map`). |
| `src/data/wb_roster.js`           | Removed the `{ id: "cb", ... }` Carsie Blanton entry from the `wbRoster` array.         |
| `index.html`                      | Replaced `<meta name="description">` with `"Weird.Baby Museum. Currently exhibiting Hunter Root."`. Title was already `Weird.Baby` and untouched. |

### Files moved to `_quarantine/` (15)

CB (9 files):
```
src/data/artists/carsie-blanton.js  →  _quarantine/cb/data/artists/carsie-blanton.js
src/data/cb_archive.js              →  _quarantine/cb/data/cb_archive.js
src/data/cb_artifacts.js            →  _quarantine/cb/data/cb_artifacts.js
src/data/cb_exit_flow.js            →  _quarantine/cb/data/cb_exit_flow.js
src/data/cb_journal_prompts.js      →  _quarantine/cb/data/cb_journal_prompts.js
src/routes/cb/CbSpine.jsx           →  _quarantine/cb/routes/cb/CbSpine.jsx
src/routes/cb/CbExhibitFlow.jsx     →  _quarantine/cb/routes/cb/CbExhibitFlow.jsx
src/routes/cb/cb_discography.js     →  _quarantine/cb/routes/cb/cb_discography.js
src/routes/cb/cb_facts.js           →  _quarantine/cb/routes/cb/cb_facts.js
```

LyricMap (4 files):
```
src/routes/hr/workshop/LyricMap.jsx →  _quarantine/lyricmap/routes/hr/workshop/LyricMap.jsx
src/routes/hr/HrWorkshop.jsx        →  _quarantine/lyricmap/routes/hr/HrWorkshop.jsx
src/bd_data.js                      →  _quarantine/lyricmap/bd_data.js
src/tp_data.js                      →  _quarantine/lyricmap/tp_data.js
```

HR orphans (3 files):
```
src/routes/hr/HrPanel2.jsx          →  _quarantine/hr_orphans/HrPanel2.jsx
src/routes/hr/HrPanel3.jsx          →  _quarantine/hr_orphans/HrPanel3.jsx
src/routes/hr/HrMerch.jsx           →  _quarantine/hr_orphans/HrMerch.jsx
```

### Step 6 import-check failures preventing a move

None. All three orphans had no live consumers; all moved.

---

## Anomalies / discrepancies

1. **`<title>` already correct.** The brief implied both `<title>` and `<meta name="description">` would need updating; the title was already `Weird.Baby`. Only the description was edited.
2. **Stale `.git/index.lock`.** Present at `.git/index.lock` since Apr 14 03:11. No live git process. Blocked an initial `git mv`. Worked around by using plain `mv`. Lock file left in place — recommend `rm .git/index.lock` on Windows.
3. **Audit's "possible broken import" for `bd_data.js` / `tp_data.js`.** Both files were physically present in `src/`. They were imported by `LyricMap.jsx` (which has been quarantined). No broken-import condition surfaced; the audit's flag was not reproducible.
4. **Build verification deferred.** `npx vite build` cannot run in the Cowork Linux sandbox because `node_modules` was installed on Windows and the rolldown Linux native binding is missing. Per brief, no fix attempted. Build must be re-run on Windows.
5. **Backup files untouched.** `src/routes/hr/HrSpine.jsx.bak` and `src/routes/hr/HrSpine.jsx.r23.bak` remain in place per the brief's "Do not delete `.bak`-suffixed files" instruction.
6. **Files audit listed but already accounted for.** None of the audit's expected files were missing — all 15 quarantined items were found and moved.
7. **Files NOT on the audit's list but present.** None surfaced during this phase. The grep at Step 8 was clean.

---

## Constraints — all honored

- **No deletions.** Quarantine only. ✓
- **No code edits beyond Steps 2, 3, 7.** ✓
- **No commits, no deploy.** ✓
- **`.bak` files not touched.** ✓
- **Out-of-scope projects in `C:\AI\` not touched.** ✓ (only `weird-baby-update\` modified)
- **Stopped on unexpected condition (Step 9 environmental block) and reported.** ✓
