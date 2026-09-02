# BUILD BRIEF — day-gated deliveries in the twin, and the ZIP browser

**Written 2026-09-02, Ops, for execution after Sunday 2026-09-06.** Mike's rulings behind it: the reveal choreography (A, third cut; `reveal/schedule.json`), the ZIP as a browsable in-story surface (`docs/ARC.md` §6), and the standing rule that nothing on the Record path moves before clock day. Everything below was read from the tree today (paths and lines cited); nothing is assumed.

## What exists to build on

| piece | where | what it gives us |
|---|---|---|
| The museum's day | `reveal/record-clock.mjs:104-113` `todayInRecordTz`; worker injects `window.__WB_TODAY__` once per response (`src/worker.js:1019`, `:476-541`); client hook `useMuseumDay()` (`src/lib/use-museum-day.js:51-74`) | one ISO day string, live in every tab, driveable with `?as-of=` |
| The two gate primitives | `visibleEntries(entries, today, all)` (`record-clock.mjs:179-188`) for entries; `assetWithheld(schedule, path, today)` (`:206-223`) for files, enforced in the worker | the house pattern: derive from data, take `day` as a parameter, let `showingAll()` fold in stage, preview and driven |
| The story schedule | `reveal/schedule.json` (week, day, date per id); `reveal/zip-tree.json` (folders and entries with a week each); `recordDay(n)` in `src/data/artists/record-epoch.js:153-157` | week N, day D → an ISO date, from the one epoch constant |
| The twin's own gate | `public/robots/twin.html:6553-6674`: a menu row is a `[table][row]` slot whose `READ_ACCESS_PASSCODE` is 1 (shown) or 2 (hidden); `Parcel_Sync_Menu()` (`:6580-6606`) writes the whole visibility map from `parcel.stage` (engines) and `parcel.keys` (games, tools, apps, detectors); `parcel.personas`; state persisted in `localStorage["wbr_parcel"]` (`:6567`); progress-based, never time-based | one function already decides every row; it just needs a second input |
| The museum's one channel into the twin | `src/routes/robots/RobotsExhibitFlow.jsx:671-673` builds the iframe query string (`user`, `preset`, `day`); the twin reads `?parcel=all` at `Parcel_Load` (`twin.html:6566-6570`) | a query parameter is the whole interface, by design |
| The existing tree renderer | `listingRows` / `Listing` in `src/routes/exhibit/RecordEntry.jsx:232-290` (classes `vp-rec-list*`), used by Record 004's `{pre}` | a folder tree the Record already draws |
| The attachment model and reader | `attachmentsOf` (`src/lib/record-model.js:217-287`), `RecordAttachments.jsx`, `docState` imaged / quoted / held; a `door` on a doc row runs something (`Robots.jsx:95-110`) | ZIP entries render as document rows: a plate opens in the reader, a door runs, a held entry says so |
| Routing | `src/App.jsx:87-214`; day-gated routes are `robotsOpen ? <X/> : <WbHome/>`; catch-all renders the Lobby | one line per new route |
| Provenance | every visitor string in `src/` needs a register row (`provenance/README.md` §2); `npm run provenance:gate` | strings from data files are not swept; component literals are |

## Part one · day-gated deliveries in the twin

**The shape.** The twin keeps its parcel law (features earned by asking) and gains a second grantor: the museum's day. On day D every feature whose schedule date is on or before D is granted before `Parcel_Sync_Menu()` runs. Earned and delivered are the same state to the menu; the ceremony (`Parcel_EXE`, the offer card, DOWNLOADING, INSTALLED) is played once per newly delivered key, so a visitor arriving on a delivery day sees the download happen, which is the Downloads Fiction's own requirement (capability arrives as a transmission).

**The steps.**

1. **A schedule module the museum owns.** `src/lib/schedule.js`: imports `reveal/schedule.json` and `reveal/zip-tree.json`; `dateOf(week, day)` via `recordDay`; `deliveredOn(day)` returns the set of schedule ids whose date ≤ day; `zipOn(day)` returns the tree with each entry marked readable or locked. Pure, parameterised by `day`, no module-load date.
2. **A key map, twin-side names.** The twin's parcel keys and engine stages are its own names (`PARCEL_NAMES`, `APP_PARCELS`, `twin.html:6555-6564`). One table maps schedule ids to them (`twin.app.probabilities → "probabilities"`, `engine.v2 → stage 2`, `twin.game.snowglobe → "game:snowglobe"`, and so on). Written once, next to the schedule module, verified against the twin's table by reading it, not by guessing names.
3. **The query parameter.** `RobotsExhibitFlow.jsx:671-673` adds `delivered=<comma-joined twin keys>` and `stage=<n>` from `deliveredOn(useMuseumDay())`. The driven session (`?as-of=`) already changes `useMuseumDay()`, so Mike can look at any future day's twin with the same drive he uses for the Record.
4. **The twin honours it.** `Parcel_Load` (`twin.html:6566-6570`) reads `delivered` and `stage`; keys not yet in `parcel.keys` are queued for the ceremony; `parcel.stage` is raised; `Parcel_Sync_Menu()` runs after. The persisted `wbr_parcel` keeps earned keys as before; delivered keys are re-derived from the query each load, so a visitor's own progress and the museum's day never fight.
5. **The inbox says so.** `MESSAGES › Text Msgs › New Feature Added` (`twin.html:5730-5739` writes message rows at runtime) is re-dated and re-worded per delivery from the schedule's headline. The words are Mike's to approve; the mechanism is ours.
6. **Nothing hidden today is un-hidden by accident.** The STUB LAW (`STUB_ROWS`, `twin.html:7074-7079`) and REFUSAL rows stay as they are. A scheduled key that names a stub row is a bug in the schedule, and the sync should say so on the console.

**The grain, found on the first build step (2026-09-02, branch `zip-and-parcels`).** The twin's `Parcel_Sync_Menu()` knows three coarse inputs: `stage` (0 NIAC · 1 adds v2.0 and Mail Run · 2 adds 65), five keys (`gamepack` for three games together, `apps` for Excuses and Lines, `detectors` for every detector at once, `tools`, `pool_excuses_2`) and one `personas` boolean that shows all four personas' apps together. The choreography delivers games two at a time, the Bullshit detector before the other three, and one persona a week. So step 4 must first give the twin per-row keys (`game:<name>`, `det:<name>`, `persona:<name>`) alongside the coarse ones, and `Parcel_Sync_Menu()` must read the fine key when present. `src/lib/twin-keys.js` on the branch carries both columns and says which rows are coarse today. Until the fine keys exist, sending the schedule to the twin would open more than the day allows, so the query parameter is not wired before that change.

**What it does not do.** It does not gate by date inside the twin file itself (the twin has no clock and should not grow one; the museum's day is the only day). It does not change the physical unit's firmware.

**Provenance.** No new visitor strings in `src/` beyond the query key names, which are not visitor-facing. The twin's own words are outside the sweep.

**Test.** Drive `?as-of=2026-09-13` (nothing delivered), `2026-09-14` (NIAC, the manual pages), `2026-09-18` (the Everyday's three apps), `2026-09-23` (the casino behind 2121): the menu shows exactly the choreography's rows, the ceremony plays once per new key, and reloading does not replay it.

## Part two · the ZIP browser

**The shape.** A room under the robots wing, `/robots/zip`, day-gated like the wing. It draws the ZIP as the Record published it: `ROOT`, the folders, the entries, in the `Listing` grid the Record already uses for the tree, with three states per entry: **readable** (a plate opens in the wing's reader; a document shows its state; a door runs), **recovered but not shown** (the Record named it; nothing to open yet; says "not here yet", the `held` state of `docState`), and **locked** (`(PWD)`, greyed, un-clickable; the honest scaffold's rule: a row that leads nowhere is not a control). Folders that have not cracked yet render as `/(pwd protected)` exactly as Record 004 printed them.

**The steps.**

1. **Data.** `reveal/zip-tree.json` is the source (folders, entries, week, renders, ledger id). `zipOn(day)` (Part one, step 1) resolves each entry's date and marks it. Entry `renders` values that are plate paths become `docs`-shaped rows so the reader opens them; entries whose `renders` is a door event (`TERMINAL.EXE` → `wb-portal-run-console`) run; everything else is a row with a state.
2. **Component.** `src/routes/robots/ZipBrowser.jsx`: header (the ZIP's name, size and password as Record 004 published them: "31.4 GB", "355113"), then the tree. Reuses `Listing`'s grid classes and `RecordAttachments`' row styles rather than new CSS; the tokens file is not touched.
3. **Route and door.** `App.jsx`: `<Route path="/robots/zip" element={robotsOpen ? <Robots open="zip" /> : <WbHome />} />` or a standalone page under the robots shell; and a door from Record 004's listing (the `{pre}` block) to the browser, so the published tree becomes a link into the same tree, live.
4. **Directory.** No new lobby line: the ZIP is reached from the robots wing and from the Record, which is where the story puts it.
5. **Provenance.** The component's literals (the header labels, "not here yet", "locked") are declared as HOUSE rows; folder and entry names come from the data file and are not swept. `npm run provenance:gate` must be green before merge.
6. **Ledger.** One new row in `reveal/ledger-declare.mjs`: `route.robots.zip`, surface, NOT_BUILT until the merge, then LIVE, with `when: 2` (it opens with the first delivery).

**What it does not do.** It never offers a download. It never shows a locked entry's contents. It never lists an entry the Record has not named or the schedule has not dated.

**Test.** Drive the four dates above; the tree opens folder by folder; Record 004's printed tree and the browser's tree agree on every name; every readable plate opens in the reader; `TERMINAL.EXE` runs the console; `(PWD)` rows are inert.

## Order and size

Part one first (it is what makes week two's Monday true on the glass), Part two second (it is what makes week two's Monday findable afterward). Both on a branch off `main` after Sunday's landing; gates green; one commit each; Mike looks at the driven pages before either is merged; his deploy.

Rough size: Part one is a day (a schedule module, a key map read off the twin, two query parameters, one twin function). Part two is a day to two (a component, a route, a door, the provenance rows). Neither touches the clock, the worker's gates or the Record's data.
