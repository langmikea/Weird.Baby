# Phase 1.5b — Port the v28 prototype dock into a new HrExhibitFlow.jsx

**Date:** 2026-05-02
**Scope:** End-to-end implementation of the merge plan locked in 1.5a. New
`HrExhibitFlow.jsx` renders an artifact grid + 6-tab dock as an inline
section, mounted by `Exhibit.jsx` line 908.

---

## 1. Active dimension set (Step 1)

HR's data files were inventoried for populated fields:

| Source              | Fields populated                                           |
| ------------------- | ---------------------------------------------------------- |
| `hr_archive.js`     | `date`, `era`, `src`, `type`, `fact1`, `fact2`, `color`, `icon`, occasional `credit` / `postUrl` / `ytId` |
| `hr_artifacts.js`   | `date`, `era`, `type`, `src`, `fact1`, `fact2`, `color`, `icon`, occasional `credit` / `ytId` |
| `hr_exit_flow.js`   | `date`, `era`, `type`, `src`, `fact1`, `fact2`, `color`, `icon` |
| `artists/hunter-root.js` (SPINE) | `id`, `title`, `year`, `art`, `accent`, `tracks[]` (each with `videos[]`); not directly per-artifact |

From the prototype's 11 dimensions, four cleared the ≥3-distinct-values bar
across HR data **and** mapped to HR-populated fields:

| Dimension | HR field                | Distinct values in HR_CARDS                                            | Tab            |
| --------- | ----------------------- | ---------------------------------------------------------------------- | -------------- |
| `era`     | `era` (verbatim)        | `seeds, medusas, solo` (3)                                             | tier 1 — Artist |
| `year`    | derived `date.slice(0,4)` | `2012, 2013, 2014, 2016, 2017, 2018, 2019, 2020, 2022, 2023, 2024, 2025, 2026` (13) | tier 1 — Artist |
| `type`    | `type` (verbatim)       | `historical, interview, rarity, video, photo, quick, deep, highlight` in HR_CARDS; vocab also includes `poster, setlist, fan-art, handwritten, ticket` for forward-compat (8 present + 5 staged) | tier 2 — Formats |
| `src`     | `src` (verbatim, HR-specific dimension; not a prototype dim) | `archive, fb, insta, press, stage, youtube` (6)                       | tier 2 — Formats |

Dropped:

- `album` — only in SPINE, not on per-artifact records (no field on HR_ARTIFACTS / HR_ARCHIVE / HR_EXIT_FLOW). Adding it would require curating album per artifact.
- `song` — same.
- `people` — not in any HR data file.
- `venue` — not in any HR data file.
- `format` — prototype's "studio / live / demo / acoustic / rehearsal" doesn't map to anything HR carries.
- `media` — prototype's "audio / video / photo / text / mixed" likewise has no analog in HR.
- `provenance` — closest analog is HR's `src`, but values don't match the prototype's `band / fan / press / licensed`. Renamed to `src` and exposed under a fresh "Source" label.
- `odds` — sparse novelty tags from the prototype; not in HR data.

Tier 3 (Deep Tracks) has no dedicated dimension column — its tab body is the
search surface only, exactly as in v28.

`HR_GROUP_LABELS` is `{ era: "Era", year: "Year", type: "Type", src: "Source" }`.
First three are kept verbatim from the prototype's `GROUP_LABELS`; "Source" is
added for the HR-specific `src` dimension.

Saved to `src/routes/hr/hr_dimensions.js`.

---

## 2. Card adapter (Step 2)

Adapter shape: `(artifact, idx) => ({ id, render, title, meta, credit, source, pull, sub, kind, lede, era, year, type, src, span_w, span_h })`.

Render type assignments — HR_ARTIFACTS (named in brief):

| HR `type` | render | Reason |
| --------- | ------ | ------ |
| `poster`     | `art`     | per brief |
| `setlist`    | `essay`   | per brief |
| `photo`      | `photo`   | per brief |
| `fan-art`    | `art`     | per brief |
| `handwritten`| `essay`   | per brief |
| `video`      | `video`   | per brief |
| `ticket`     | `press`   | per brief |
| _(default)_  | `session` | safety |

**Deviation from a strict reading.** The brief says "HR's artifacts live in
hr_artifacts.js." A strict reading would feed only `HR_ARTIFACTS` (10 items)
into the grid. Combined with the ≥3-distinct-values rule, that limits the
dock to two filter dimensions (year and src) and a near-empty grid — the
dock would have very little to do. I broadened `HR_CARDS` to also include
`HR_ARCHIVE` and `HR_EXIT_FLOW`, with separate adapters per source. The
result: 56 cards across 6 render types.

Render type mappings for the broadened sources:

| HR_ARCHIVE `type` | render    | Reason |
| ----------------- | --------- | ------ |
| `historical`      | `photo`   | timeline / documentary feel |
| `interview`       | `press`   | quoted journalism |
| `rarity`          | `session` | uncommon catalog items |

| HR_EXIT_FLOW `type` | render    | Reason |
| ------------------- | --------- | ------ |
| `quick`             | `art`     | small punchy visual |
| `deep`              | `essay`   | long-form curatorial reads |
| `highlight`         | `session` | curatorial highlight |

Final tally in `HR_CARDS`:

```
total: 56
by render: { photo: 11, art: 12, video: 6, press: 9, essay: 5, session: 13 }
by source prefix: { art: 10, arc: 23, exit: 23 }
```

If Mike prefers strict, narrow `HR_CARDS` to `HR_ARTIFACTS.map(hrArtifactToCardShape)`.
The two non-artifact adapters (`hrArchiveItemToCardShape`, `hrExitFlowItemToCardShape`)
are also exported for that case.

Saved to `src/routes/hr/hr_cards.js`.

---

## 3. Files created

| Path                                          | Purpose |
| --------------------------------------------- | ------- |
| `src/routes/hr/hr_dimensions.js`              | `HR_DIMENSIONS` + `HR_GROUP_LABELS` for the dock filter logic |
| `src/routes/hr/hr_cards.js`                   | `HR_CARDS` array + three adapter functions, one per HR source file |
| `src/routes/hr/HrExhibitFlow.jsx`             | NEW component — replaces the quarantined version. Renders artifact grid + 6-tab dock |
| `src/routes/hr/HrExhibitFlow.css`             | Static styles for the new component (per O6 hybrid style strategy) |
| `_quarantine/hr_exhibit_flow_old/HrExhibitFlow.jsx` | Old `HrExhibitFlow.jsx` (729 lines), preserved for reference |
| `PHASE_1_5B_REPORT.md`                        | This report |

## 4. Files moved

`src/routes/hr/HrExhibitFlow.jsx` (729 lines, the pre-merge live version) →
`_quarantine/hr_exhibit_flow_old/HrExhibitFlow.jsx`.

## 5. Files edited

None outside the four targets above. `Exhibit.jsx`, `App.jsx`, `HrSpine.jsx`,
`Exhibit.css`, the Cloudflare worker, and the data files (`hr_archive.js`,
`hr_artifacts.js`, `hr_exit_flow.js`, `hr_journal_prompts.js`,
`hunter-root.js`) are untouched.

## 6. Code structure of the new `HrExhibitFlow.jsx`

Top-to-bottom:

```
imports ........................ React hooks, ./HrExhibitFlow.css, hr_dimensions, hr_cards, HR_JOURNAL_PROMPTS

color / font tokens ............ INK, INK_SOFT, INK_CARD, BORDER, BORDER_HI,
                                 GOLD, GOLD_HI, GOLD_LO, GOLD_MUTE, DIM, LED_*,
                                 serifDisplay, sansBody

dock constants ................. TAB_PEEK, TAB_STRIP_H, DOCK_MIN_H,
                                 DOCK_MAX_FRAC, DOCK_DEFAULT_H_SHARED,
                                 STORAGE_KEY = "wb-hr-dock-height" (O7),
                                 HOVER_DELAY_OPEN, HOVER_DELAY_CLOSE

TABS array (6 entries) ......... artist | media | deep | journal | presets | close

FACTORY_PRESETS ................ 5 entries: "Surprise me", "Press clippings",
                                 "Live captures", "Years past", "Video evidence".
                                 Adapted to HR's dimensions.

makeEntrySelection() ........... entry preset = empty Sets (locked filter rule
                                 makes empty groups silent → full catalog visible)

KALEIDOSCOPE (mothballed) ...... KAL_STATE_DEFAULT, KAL_KNOBS, pseudoRandom,
                                 runKaleidoscopeRecipe, kalIsDefault.
                                 Each block tagged "MOTHBALLED for v1 per
                                 STATE.md; do not render. Revives post-launch."

S = { ... } (parameterized) .... panelPos(dockPx), dock(dockPx),
                                 tab(active, dockOpen, width, isClose),
                                 resizeHandle(hovered),
                                 pill(active, zero, pillWidth),
                                 pillCount(active, zero),
                                 presetsPill(on), presetsPillState(on),
                                 presetSlotRow(hasContent),
                                 presetSummary(empty),
                                 presetRowBtn(enabled, primary),
                                 presetCard(active),
                                 tabCount(active)

spanStyle(w, h) ................ grid placement helper

filter helpers ................. itemHasTag, matchFilter, countForPill,
                                 cloneSelected, selectedIsEmpty,
                                 presetSummaryText, makePresetSnapshot (O8 comment),
                                 prettyTag, measureWidestLabel, useGlobalPillWidth

PillButton, PillGroupColumn .... pill rendering

KALEIDOSCOPE components ........ Knob, PillSwitch, VuMeter, KaleidoscopeContent
                                 (mothballed; never rendered)

card variants .................. PhotoCard, ArtCard, VideoCard, PressCard,
                                 EssayCard, SessionCard, ArtifactCard dispatcher

P3Panel ........................ page header + grid

ScrollFadeContainer ............ scroll wrapper

tab content components ......... TierContent, DeepTracksContent, JournalContent,
                                 PresetsContent

SEED_ENTRIES (Journal) ......... 13 fan-submitted entries, ported verbatim
                                 from the quarantined component

JournalContent ................. tab body — prompt rotation, submission UI,
                                 weighted-random feed (O5)

AuditStrip ..................... dev-only sanity audit (O12)

HrExhibitFlow (export default).. root component:
                                 - state: query, selected, _kalState, shuffle,
                                   loop, playingTrack, spinePosition, activeTab,
                                   hoverPeek, dockHeight, resizing, resizeHover,
                                   userPresets, searchFocusSignal
                                 - effects: localStorage persist, keyboard ESC,
                                   window resize clamp
                                 - hover open/close timers
                                 - render: <section> ▷ mobile fallback pill stack
                                                    ▷ dock host (grid + dock)
                                                    ▷ AuditStrip (dev only)
```

The component renders as an inline `<section>` (per O4 = B), with the grid
panel absolutely-positioned and the dock anchored to the section's bottom.
Section min-height: `calc(100vh - 64px)` and `scroll-snap-align: center` to
match the other live exhibit sections.

## 7. Style boundary (Step 5)

**To CSS** (`HrExhibitFlow.css`):
- All static styles: `.hr-section`, `.hr-section-dock-host`, `.hr-panel-scroll`,
  `.hr-page-header`, `.hr-eyebrow`, `.hr-page-title`, `.hr-page-sub`,
  `.hr-panel-head*`, `.hr-panel-count*`, `.hr-artifact-grid`, `.hr-card`,
  `.hr-tab-strip`, `.hr-strip-clear-btn`, `.hr-dock-body`,
  `.hr-scroll-fade-wrap`, `.hr-content-body`, `.hr-groups-row`,
  `.hr-group-column*`, `.hr-pill-label`, `.hr-deep-stack`, `.hr-search-wrap`,
  `.hr-corral*`, `.hr-presets-section-label`, `.hr-presets-top-row`,
  `.hr-presets-slots-col`, `.hr-presets-player-col`, `.hr-presets-player-label`,
  `.hr-preset-slot-label`, `.hr-factory-grid`, `.hr-preset-label`,
  `.hr-preset-desc`, all `.hr-card-*` visual classes, `.hr-jnl-*` journal
  classes, `.hr-kal-*` mothballed Kaleidoscope classes, `.hr-vu-*` mothballed
  VU classes.
- Globals reused from prototype: `.animated`, `.animated.quick`,
  `.animated.resizing`, `.card-fade-in`, `.wb-scroll`, `.pillscroll`,
  `.searchbar`, `.tab-hoverable:hover`, `.preset-row-btn:hover`, `.knob-wrap*`.
- `@media (max-width: 720px)` rule (O11) hides the dock and shows a vertical
  pill stack above the grid.

**Inline (parameterized JS objects in `HrExhibitFlow.jsx`)**:
- `S.panelPos(dockPx)`, `S.dock(dockPx)` — height changes with dock state.
- `S.tab(active, dockOpen, width, isClose)` — per-tab brightness/border/width.
- `S.resizeHandle(hovered)` — gradient toggles with hover.
- `S.pill(active, zero, pillWidth)`, `S.pillCount(active, zero)` — per-pill chrome.
- `S.presetsPill(on)`, `S.presetsPillState(on)` — shuffle/loop pill switch on/off.
- `S.presetSlotRow(hasContent)`, `S.presetSummary(empty)`, `S.presetRowBtn(enabled, primary)`, `S.presetCard(active)` — preset slot states.
- `S.tabCount(active)` — kept as parameterized though no caller uses it yet (forward-compat).

Rule of thumb applied: if a style takes a prop, it's inline. Otherwise it's
class-based.

## 8. Journal integration (Step 4)

The Journal lives as the 4th tab in `TABS` (between `deep` and `presets`).
Selecting it renders `JournalContent` inside `S.dockBody`.

Layout adaptations:

- **Width / scroll** — the existing Journal was sized for a sticky right column
  (40% of viewport). In the dock body it now uses the dock's full available
  width and scrolls vertically inside `.hr-content-body` when entries
  overflow. No horizontal layout split.
- **Textarea height** — reduced from 120px (live) to 96px (dock body) so the
  feed is visible at default dock height (480px).
- **Era filter prop** — accepted as `eraFilter` (a `Set` or `null`). The dock
  passes `null` since it doesn't seed era from the active album in v1; the
  weighted-feed shows all entries. Future enhancement could derive `eraFilter`
  from `activeAlbumId`.
- **Internal `weighted` order** — converted from `useRef([])` to
  `useState([])` to comply with React 19's `react-hooks/refs` rule (the v28
  pattern of reading `weighted.current` during render is now flagged). The
  value still recomputes on `[filtered.length, eraFilter]`.

`SEED_ENTRIES` (13 entries) ported verbatim. The submission flow (handle +
text + 10s undo countdown) is unchanged. There's no POST endpoint in the
existing Journal — it's local React state only — so no API change.

## 9. Build verification (Step 7)

`npx vite build` was attempted. Build deferred because the project's
`node_modules` was installed on Windows and the Linux sandbox cannot load
`@rolldown/binding-linux-x64-gnu`:

```
Error: Cannot find native binding. npm has a bug related to optional
dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i`
again after removing both package-lock.json and node_modules directory.
  [cause]: Cannot find module '@rolldown/binding-linux-x64-gnu'
```

This is the documented "run on Windows" deferral path. **Mike will need to
run `npx vite build` from Windows to confirm the bundle.** No code-level
build error has been observed.

In place of the bundler, the following local checks all pass on the Linux
sandbox:

| Check                                                                 | Result |
| --------------------------------------------------------------------- | ------ |
| `node --check` on `hr_dimensions.js`, `hr_cards.js`, all four HR data files | OK |
| acorn-jsx parse on `HrExhibitFlow.jsx` (1588 lines), `hr_dimensions.js`, `hr_cards.js` | OK |
| Runtime import of `HR_DIMENSIONS` + `HR_CARDS` (Node ESM)             | OK — 56 cards, 4 dimensions, all dimension fields populated on every card |
| `npx eslint --no-warn-ignored` on the three new files (project's existing config, including `react-hooks` v7) | **0 errors, 0 warnings** |

Sanity audit (the `AuditStrip` dev widget) runs four locked filter-rule
tests against `HR_CARDS`: all-off → full catalog; era=solo alone; era OR
within-group; era AND src across-group. All four pass at module load.

`wrangler deploy` was NOT invoked. Phase 2 handles deployment.

## 10. Open issues

1. **HR_CARDS scope deviation (most important).** I broadened `HR_CARDS` to
   include `HR_ARCHIVE` + `HR_EXIT_FLOW` in addition to `HR_ARTIFACTS`, on
   the grounds that the strict reading produces a near-empty dock (10 cards,
   2 useful filters). The brief's wording ("HR's artifacts live in
   hr_artifacts.js") could go either way. **Please review.** If you want
   strict, change the bottom of `hr_cards.js` to:
   ```js
   export const HR_CARDS = HR_ARTIFACTS.map((a, i) => hrArtifactToCardShape(a, i));
   ```
   and re-evaluate `hr_dimensions.js` against the resulting 10-card catalog —
   `era` and `type` will fall under the 3-value bar and need to be dropped
   too.

2. **Type → render assignments for non-artifact sources** (HR_ARCHIVE,
   HR_EXIT_FLOW). The brief specifies the mapping for `hr_artifacts.js` only;
   I picked sensible defaults for the broadened sources (see report §2). If
   you have a preferred mapping for `historical / interview / rarity / quick
   / deep / highlight`, the changes are isolated to the three constants in
   `hr_cards.js`.

3. **`type` dimension vocabulary forward-compat.** I included the five
   schema-listed-but-not-yet-used HR_ARTIFACTS types (`poster`, `setlist`,
   `fan-art`, `handwritten`, `ticket`) in `HR_TYPES` so that pills appear and
   show count=0 (dimmed) until data lands. If you'd prefer pills to only show
   types currently in the data, drop those five from `HR_TYPES` in
   `hr_dimensions.js`.

4. **Mobile (O11) is minimal.** Per the brief, I added a 720px breakpoint
   that hides the dock and renders pill columns inline above the grid. This
   keeps the page from breaking on a phone. It is not a real mobile design —
   no tab strip, no resizable dock body, no journal/presets surface. The
   pill list is dimensions-only, so the only filter mode on mobile is "tap a
   tag." The Journal and Presets tabs are unreachable on mobile in this cut.

5. **Sticky-bottom dock with absolute-position internals.** The dock uses
   `position: absolute` (within the section's host) per the prototype's
   pattern, anchored to `bottom: 0` of the host. The host is sized to
   `min-height: calc(100vh - 64px)`. This works as long as the section is
   the last scrollable section before PlayerBar. If a future section is
   added below this one, the dock will scroll out of view at the section's
   end. Reasonable for v1; flag for future review.

6. **Sanity audit strip (dev-only) carries no test for the JournalContent.**
   It only audits the filter rule against HR_CARDS. Journal logic is
   smoke-tested by the existing live exhibit's behavior, ported verbatim.

7. **`activeAlbumId` is currently unused.** The component accepts it for
   prop compatibility (per the export-signature constraint) but doesn't read
   it. The old behavior of seeding `eraFilter` from the active album does
   not exist in the new dock — the user toggles era pills directly. If you
   want the dock to react to the album carousel, the wiring point would be a
   `useEffect` in `HrExhibitFlow` that calls `setSelected` based on
   `activeAlbumId`.

8. **Kaleidoscope code is fully ported but never rendered.** The mothballed
   blocks (`KAL_*`, `Knob`, `PillSwitch`, `VuMeter`, `KaleidoscopeContent`)
   compile cleanly, are tagged with the required mothball comment, and are
   tree-shakeable if the bundler decides to drop them. The post-launch
   revival just needs to: (a) add a Kaleidoscope tab to `TABS`, (b) wire
   `kalState` / `setKalState` into the filter pipeline (replace `const
   finalMatched = tagFiltered;` with `runKaleidoscopeRecipe(kalState,
   tagFiltered)`), (c) render `<KaleidoscopeContent ... />` from the new
   tab.

9. **Filesystem sync glitch (tooling note, not a code issue).** During
   verification, the Linux mount of the project initially showed a stale
   view of `HrExhibitFlow.jsx` (cached metadata from before the rewrite). A
   single `mv x x.tmp && mv x.tmp x` round-trip refreshed the mount. No
   data was lost; the file on the host was complete throughout. Worth
   noting in case a future agent sees the same behavior.
