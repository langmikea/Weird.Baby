# Phase 1.5a — Merge plan: live `/hr` exhibit + prototype A v28 tab structure

**Date:** 2026-05-02
**Scope:** Inventory and merge plan only. **No code is written in this phase.** This document is for review before Phase 1.5b implements anything.
**Goal of the eventual merge (1.5b):** keep the current `/hr` exhibit's top section (carousel + track chooser + video viewer) intact; replace everything below it with the prototype's tab structure.

---

## 1. Prototype inventory

`prototypes/` contains nine HTML files, no JSX:

| File                          | Modified         | Bytes  | Lines | Notes                                                              |
| ----------------------------- | ---------------- | ------ | ----- | ------------------------------------------------------------------ |
| `kaleidoscope_v3.html`        | 2026-04-23 03:15 | 18,771 |   581 | Standalone visual prototype for the audio-meter "Kaleidoscope" control. Knobs + VU meter, gold-drift palette. Not the canonical exhibit prototype. Mothballed for v1 per `STATE.md` line 209. |
| `prototype_a_v17.html`        | 2026-04-23 01:02 | 49,697 |   937 | "v17 — handoff build". Earliest in this directory. Establishes data shapes (`ERAS`, `ALBUMS`, `SONGS`, `PEOPLE`, etc.) and grid layout. |
| `prototype_a_v20.html`        | 2026-04-23 15:40 | 63,636 | 1,264 | "v18 — Kaleidoscope wired" (per its `<title>`). Adds the Kaleidoscope dock tab. |
| `prototype_a_v21.html`        | 2026-04-23 18:26 | 63,879 | 1,272 | "v21 — every tag on at entry". Tweaks entry-state defaults. |
| `prototype_a_v23.html`        | 2026-04-24 03:43 | 75,745 | 1,520 | Title still says v21 but file is v23. Adds the 200-item generator + sanity audit. |
| `prototype_a_v28_1.html`      | 2026-04-30 19:48 | 86,363 | 1,720 | First v28 draft. Identical to v28_2 by md5 (`d3de13c5…`). |
| `prototype_a_v28_2.html`      | 2026-04-30 19:49 | 86,363 | 1,720 | md5-identical to v28_1 — same content, different filename. |
| `prototype_a_v28_3.html`      | 2026-04-30 19:51 | 86,352 | 1,720 | md5-identical to `prototype_a_v28.html` (`17c4cc6d…`). The "winning" v28 draft. |
| **`prototype_a_v28.html`**    | **2026-04-30 23:11** | **86,352** | **1,720** | **CANONICAL.** md5-identical to v28_3. Confirmed canonical by `STATE.md` line 203: *"CANONICAL PROTOTYPE: C:\Users\macun\Downloads\prototype_a_v28.html."* |

### Canonical: `prototypes/prototype_a_v28.html`

Picked unambiguously. Two independent signals agree:

1. `STATE.md` lines 198–207 names it explicitly under *CONTROLS SURFACE — current state (post-v27 + v28 simplification pass)*. Spec lives at `docs/canonical/UX_CONTROLS_SPEC_v0.3.md`.
2. md5 shows v28.html == v28_3.html and v28_1.html == v28_2.html — i.e., v28_1/v28_2 were intermediate drafts that were superseded by v28_3, then v28_3 was promoted to v28.html on Apr 30 23:11 (3+ hours after the v28_3 save). Latest mtime + highest version + most bytes (tied) all point to the same file.

### Format of all prototypes

Every file is a **single-page React app loaded via `babel-standalone`** at runtime. The JSX lives inside one `<script type="text/babel" data-presets="env,react" data-type="module">` block; React 18 + ReactDOM are pulled from unpkg CDN. The file is opened directly in a browser; nothing is bundled. This format is convenient for prototyping but **all logic must be ported into real `.jsx` files (with proper imports) before it can run inside the museum's Vite build**.

---

## 2. Live exhibit structure

### `src/routes/hr/HrSpine.jsx` (7 lines)

```jsx
import Exhibit from "../exhibit/Exhibit.jsx";
import { hunterRoot } from "../../data/artists/hunter-root.js";

export default function HrSpine() {
  return <Exhibit artist={hunterRoot} />;
}
```

Trivial wrapper. Passes `hunterRoot` data into the generic `Exhibit` component. Unaffected by this merge.

### `src/data/artists/hunter-root.js`

Defines `hunterRoot` with: `id`, `name`, `spine` (array of 6 albums × tracks × videos), `facts`, `defaultActiveIndex` (4 = Arkansas), `splitKey`/`cfKey` (localStorage keys), `visitPath`, `shopExitParam`, **`exhibitFlow: HrExhibitFlow`** (the artist supplies the below-seam component).

Album spine: `cracked` (2018) → `wheel` (2019) → `dandelions` (2020) → `skipping` (2021) → `arkansas` (2023, default) → `crooked` (2025). Each track has `title` and `videos: [{ ytId, label, type, credit? }]` where `type ∈ {music_video, live, lyric, audio, visualizer, acoustic, clip, cover}`.

### `src/routes/exhibit/Exhibit.jsx` (926 lines)

Top-to-bottom render structure (see lines 818–924):

| Sec | Lines      | What it is                                                          | Component / DOM                          |
| --- | ---------- | ------------------------------------------------------------------- | ---------------------------------------- |
| 0   | 820        | `<div class="ex-root">` opens                                       | container                                |
| 1   | 823–827    | **Top nav bar** (Weird.Baby logo · artist name · Gift Shop link)    | `<div class="ex-nav">`                   |
| 2   | 830–835    | **Album coverflow / carousel**                                       | `<Coverflow spine, active, cfH, …>`      |
| 3   | 838–842    | Carousel-height drag handle                                          | `<div class="cf-dh">`                    |
| 4   | 845–905    | **Main two-column body** (`flex: 1`, fills remaining viewport)       | `<div class="ex-main ex-snap">`          |
| 4a  | 850–862    | LEFT: tracklist (active album's tracks, type-tag pills per track)    | `<TrackList …>`                          |
| 4b  | 865–867    | Vertical drag handle (resizes split)                                 | `<div class="vr-dh">`                    |
| 4c  | 870–893    | RIGHT-TOP: video viewer (16:9 YouTube embed; idle album art when stopped) | `<div class="vp-area">`              |
| 4d  | 896–901    | RIGHT-BOTTOM: fact scroller (curatorial 2-line cards, 7.5s rotation) | `<FactScroller facts, albumId, trackTitle, accent>` |
| 5   | 907–908    | **`{ExhibitFlow && <ExhibitFlow activeAlbumId={album.id} />}`** ← **THIS IS THE SEAM** | (HR supplies HrExhibitFlow)              |
| 6   | 910–921    | Bottom player bar (fixed `position: fixed`, height 60px, with queue drawer) | `<PlayerBar …>`                          |
| —   | 922        | `</div>` closes `ex-root`                                            |                                          |

`ex-root` is `display: flex; flex-direction: column; min-height: 100vh; padding: 0 8px 64px` (the 64px bottom is for the fixed PlayerBar). `body` has `scroll-snap-type: y mandatory`. `ex-nav` snaps to start; `ex-main` snaps center; each ef-section inside ExhibitFlow also snaps center. The user scrolls vertically through these sections; PlayerBar overlays everything.

### `src/routes/hr/HrExhibitFlow.jsx` (729 lines)

The artist-supplied below-seam. Currently renders:

```
<HrExhibitFlow activeAlbumId={album.id}>
  <style>{…700 lines of inline CSS…}</style>
  <div class="ef-root">
    <div class="ef-grid">                                  // 60% / 40% grid
      <div class="ef-left">
        Panel 2 — "As It Happened"
          <ExhibitScroller items={p2Items}>                 // HR_ARCHIVE
            <TypePills tags={P2_TYPES} … />                 // historical | interview | rarity
        Panel 3 — "The Artifacts"
          <ExhibitScroller items={p3Items}>                 // HR_ARTIFACTS
            <TypePills tags={P3_TYPES} … />                 // poster | setlist | photo | fan-art | handwritten | video | ticket
        Panel 4 — "That's a Wrap"
          <ExhibitScroller items={p4Items}>                 // HR_EXIT_FLOW
            <TypePills tags={P4_TYPES} … />                 // quick | deep | highlight
      <div class="ef-right">                                // sticky right column
        "The Journal"
          <Journal prompts={HR_JOURNAL_PROMPTS} eraFilter={…} />
```

Filter shape:

- `eraFilter: Set` — auto-set from `activeAlbumId` via the `ALBUM_ERA` map (currently every HR album maps to `solo`; `medusas` and `seeds` exist in the data but no album maps to them).
- `p2Types`, `p3Types`, `p4Types` — each a `Set` defaulting to all-on. "At least one must remain on" guard in `toggleType`.

`ExhibitScroller` is a left-bleed/center/right-bleed scroller with auto-advance every 7.5s, paused on hover and on YouTube embeds. `Journal` lets fans submit entries; entries weighted-randomly cycle through.

### `src/routes/exhibit/Exhibit.css` (181 lines)

CSS prefixes: `ex-` (root/nav), `cf-` (coverflow), `tl-` (tracklist), `vp-` (video panel), `fs-` (fact scroller), `pb-` (player bar), `vr-` (vertical resizer). Loads Google Fonts: DM Serif Display, Syne, Courier Prime. No styles for the below-seam (those live inline in `HrExhibitFlow.jsx`).

### Section structure summary

The live exhibit lays out as a **vertical scroll-snap stack**, not a fixed dock:

1. NAV (snap-start)
2. CAROUSEL (carousel + drag handle)
3. MAIN (snap-center) — tracklist + video + facts. Fills the rest of the first viewport.
4. EXHIBIT FLOW (snap-center, 3 sub-sections, each `min-height: calc(100vh - 64px)`) — Panels 2/3/4 in a 60/40 grid with sticky Journal.
5. PLAYER BAR (fixed, overlays bottom 60px of viewport throughout).

The user reaches the below-seam by scrolling down past the main two-column area.

---

## 3. Prototype structure (`prototype_a_v28.html`)

### File layout (1,720 lines, all inside one `<script type="text/babel">`)

| Block        | Lines       | Contents                                                        |
| ------------ | ----------- | --------------------------------------------------------------- |
| HTML head    | 1–35        | Fonts, scrollbar CSS, React/ReactDOM/babel CDNs                 |
| Data         | 40–74       | `ERAS`, `ALBUMS`, `SONGS`, `PEOPLE`, `FORMATS`, `MEDIA`, `PROVENANCE`, `TYPES`, `VENUES`, `ODDS`, `ARTIFACT_SEED` (14 hand-curated artifacts) |
| Catalog gen  | 76–233      | `buildCatalog()` — Mulberry32 RNG + correlated tag assignment, generates 200 artifacts deterministically |
| Dimensions   | 237–249     | 11 dimensions across 3 tiers                                    |
| Tabs         | 251–273     | `TABS` array (5 entries) and `GROUP_LABELS`                     |
| Presets      | 275–298     | `FACTORY_PRESETS` (5 entries) + `makeEntrySelection`            |
| Kaleidoscope | 300–371     | `KAL_STATE_DEFAULT`, `KAL_KNOBS`, `runKaleidoscopeRecipe`, `kalIsDefault` (mothballed; preserved code, not invoked) |
| Styles       | 373–770     | The `S.*` style object. Inline JS object, ~400 lines.           |
| Filter logic | 774–822     | `itemHasTag`, `matchFilter` (LOCKED rule: within-group OR, across-group AND, empty-group-silent), `countForPill` |
| Sanity audit | 824–917     | `AUDIT_RESULTS` IIFE + `AuditStrip` debug widget (bottom-right) |
| Pill helpers | 919–1025    | `prettyTag`, `measureWidestLabel`, `useGlobalPillWidth`, `cloneSelected`, `selectedIsEmpty`, `presetSummaryText`, `makePresetSnapshot`, `PillButton`, `PillGroupColumn` |
| Kal blocks   | 1027–1168   | `Knob`, `PillSwitch`, `VuMeter` (all dormant in v28)            |
| Cards        | 1173–1195   | `PhotoCard`, `ArtCard`, `VideoCard`, `PressCard`, `EssayCard`, `SessionCard`, `ArtifactCard` dispatcher |
| Top panel    | 1197–1224   | `P3Panel` — page header + artifact grid                         |
| Scroll wrap  | 1239–1245   | `ScrollFadeContainer`                                           |
| Tab content  | 1247–1323   | `TierContent`, `DeepTracksContent`                              |
| Presets tab  | 1338–1440   | `PresetsContent`                                                |
| Kal tab      | 1451–1478   | `KaleidoscopeContent` (preserved, not mounted)                  |
| Root         | 1483–1713   | `Prototype` component (state, dock orchestration, JSX)          |
| Mount        | 1715–1716   | `root.render(<><Prototype /><AuditStrip /></>)`                 |

### Render tree, top-to-bottom

```
<Prototype>            // S.app (position: fixed, inset 0, full viewport)
  <style>{S.gFonts}</style>
  <div class="animated" style={S.panelPos(dockPx)}>      // top region (above the dock)
    <div class="wb-scroll" style={S.panelScroll}>
      <P3Panel matched={finalMatched} totalCount={…}>
        Page header ("eyebrow / pageTitle / pageSub")
        Panel head ("artifacts · the material evidence" + count)
        Artifact grid (gridTemplateColumns: repeat(4, 1fr); 200 cards)
      </P3Panel>
    </div>
  </div>
  <div class="animated" style={S.dock(dockPx)}>           // bottom dock — fixed-position to viewport bottom
    <div style={S.tabStrip}>                              // the 5 tabs
      <Tab key="artist"  label="Artist"      tier=1 />
      <Tab key="media"   label="Formats"     tier=2 />
      <Tab key="deep"    label="Deep Tracks" tier=3 />    // also carries search input + corral
      <Tab key="presets" label="Presets"     special     />// user slots + factory presets + shuffle/loop pills
      <Tab key="close"   label="✕"           close       />
      {anySelected && hovered/open && <button>clear all</button>}
    </div>
    {open && currentTab && (
      <div style={S.dockBody}>                             // tab body, opens upward to dockHeight
        <ResizeHandle ns-resize />
        <TierContent | DeepTracksContent | PresetsContent />
      </div>
    )}
  </div>
</Prototype>
<AuditStrip />          // floating debug strip, bottom-right, fixed
```

### The five tabs (per `TABS`)

| Key       | Label        | Kind    | Tier | Width | Body                                                                                                  |
| --------- | ------------ | ------- | ---- | ----- | ----------------------------------------------------------------------------------------------------- |
| `artist`  | Artist       | tier    | 1    | 120px | Pill columns for: era, album, year, song, people, venue.                                              |
| `media`   | Formats      | tier    | 2    | 130px | Pill columns for: format, media, provenance, type.                                                    |
| `deep`    | Deep Tracks  | tier    | 3    | 120px | Search input (autofocus) + matching-tag corral (when query present) + pill columns for: odds.         |
| `presets` | Presets      | special | —    | 110px | 3 user slots (P1/P2/P3) with inline APPLY/CLEAR/SAVE; Shuffle + Loop pill switches; 5 factory presets.|
| `close`   | ✕            | close   | —    |  48px | Clicking closes the dock to peek-state.                                                               |

### Filter rule (LOCKED — see `docs/FILTER_LOGIC_DECISION.md`)

> Within-group OR, across-group AND, empty-group-silent. *"I want early OR breakthrough, at Red Rocks, on audio."* Groups with zero ON tags do not constrain.

Counts per pill: probe the catalog with all current selections except the pill's own group, then add just the candidate pill, and count. This makes counts respond to cross-group context without being scrambled by sibling pills in the same group.

### Persisted state

- `localStorage["wb_v17_dock_height"]` — dock body height, default 480px, range 200..75% viewport.
- `userPresets` — only in React state (no persistence in v28 prototype).
- `selected` (active filter) — only in React state.

---

## 4. The seam

### Where the cut happens in the live tree

**`src/routes/exhibit/Exhibit.jsx`, line 907–908:**

```jsx
{/* EXHIBIT FLOW — optional, only rendered if artist provides one */}
{ExhibitFlow && <ExhibitFlow activeAlbumId={album.id} />}
```

**Above this line (kept):**
- Lines 822–827 — NAV
- Lines 829–842 — Coverflow + cf-dh
- Lines 844–905 — `ex-main` two-column area (TrackList | video viewer | FactScroller). *Note: the FactScroller's status is open question O3 below — strict reading of "carousel + track chooser + video viewer" doesn't include it.*

**At the seam:**
- Lines 907–908 — the `<ExhibitFlow />` mount point. The component instance changes, but the call site stays the same. `HrExhibitFlow` keeps its prop signature `({ activeAlbumId })` so `Exhibit.jsx` is unchanged at this line.

**Below this line (kept):**
- Lines 910–921 — `<PlayerBar />`. This is `position: fixed`; it overlays the bottom 60px of the viewport regardless of where the seam is. It is unaffected by the merge.

### The seam in the file being replaced

**`src/routes/hr/HrExhibitFlow.jsx`, lines 1–729 — entire file.** The file is rewritten end-to-end. The export signature (`export default function HrExhibitFlow({ activeAlbumId })`) is preserved so `Exhibit.jsx` line 908 keeps working without edit.

### Conceptual seam

| Above (lives in `Exhibit.jsx`)       | At seam (line 908)              | Below (lives in `HrExhibitFlow.jsx`)                |
| ------------------------------------ | ------------------------------- | --------------------------------------------------- |
| NAV, Coverflow, cf-dh, ex-main *     | `<ExhibitFlow activeAlbumId />` | NEW: artifact grid + 5-tab dock (ported from v28)   |

\* FactScroller — see open question O3.

---

## 5. What stays from live

### Code

| File                                       | Status   | Reason                                                                      |
| ------------------------------------------ | -------- | --------------------------------------------------------------------------- |
| `src/App.jsx`                              | unchanged | `/hr` route already points at `<HrSpine />` post Phase 1                  |
| `src/routes/hr/HrSpine.jsx`                | unchanged | Trivial wrapper, no merge concern                                           |
| `src/data/artists/hunter-root.js`          | unchanged shape (likely additive) | `exhibitFlow: HrExhibitFlow` keeps pointing at the rewritten file. Data shape may grow if open question O1 wants more dimensions. |
| `src/routes/exhibit/Exhibit.jsx`           | unchanged                        | The component is artist-agnostic. The seam is the `<ExhibitFlow />` mount, not Exhibit itself. |
| `src/routes/exhibit/Exhibit.css`           | unchanged                        | No selectors here belong to the below-seam. |
| `src/routes/hr/hr_facts.js`                | unchanged                        | Drives `<FactScroller>` in the kept top-region. |
| `src/data/hr_archive.js` / `hr_artifacts.js` / `hr_journal_prompts.js` / `hr_exit_flow.js` | **possibly unchanged, possibly retired** — depends on O1 and O3 |

### Behavior preserved

- Album coverflow with arrow keys, drag, click navigation.
- Active album debouncing (`activeDisplay` lags 600ms behind `active` for non-clicks).
- Tracklist with type-tag pills per track (the existing `TAG_SLOTS = ["official", "live", "lyrics", "clip", "cover"]`).
- YouTube player with skip-back-restart-vs-skip-back-track logic, mute/volume, queue drawer.
- User-queue (Up Next) with double-click-to-front and click-to-reorder.
- Auto-build per-album play queue + cross-album auto-advance.
- FactScroller (assuming O3 keeps it).
- Split persistence (`wb-hr-split`, `wb-hr-cfh` in localStorage).
- Visit POST to `/api/visits`.
- Gift Shop exit via `/shop?from=hr`.

---

## 6. What comes from prototype

The list below is *what needs to be ported into `HrExhibitFlow.jsx`* (unless otherwise noted). All of it currently lives inside `prototype_a_v28.html`'s single `<script>` block; porting means extracting into proper `.jsx` modules with imports.

### Core (must port)

- `DIMENSIONS` array — unless O1 prunes it for HR.
- `TABS` array (5 entries: Artist / Formats / Deep Tracks / Presets / ✕).
- `GROUP_LABELS` map.
- Filter logic: `itemHasTag`, `matchFilter`, `countForPill`, `cloneSelected`, `selectedIsEmpty`, `makeEntrySelection`.
- Pill components: `PillButton`, `PillGroupColumn`.
- Tab content components: `TierContent`, `DeepTracksContent`, `PresetsContent`.
- `Prototype` root component logic — but only its dock half (state for `selected`, `query`, `userPresets`, `shuffle`, `loop`, `activeTab`, `dockHeight`, `searchFocusSignal`; `toggle()`, `clear()`, `handleTabClick()`, `startResize()`, hover open/close timers).
- Artifact grid + `ArtifactCard` dispatcher + the six card variants (`PhotoCard`, `ArtCard`, `VideoCard`, `PressCard`, `EssayCard`, `SessionCard`).
- `S.*` style objects covering: `app`, `dock`, `tabStrip`, `tab`, `tabCount`, `stripClearBtn`, `dockBody`, `resizeHandle`, `contentBody`, `groupsRow`, `groupColumn`, `groupColumnLabel`, `pill`, `pillLabel`, `pillCount`, `searchWrap`, `corral`, `presetsSectionLabel`, `factoryGrid`, `presetsTopRow`, `presetsSlotsCol`, `presetsPlayerCol`, `presetsPill`, `presetSlotRow`, `presetSummary`, `presetRowBtn`, `presetCard`, `presetLabel`, `presetDesc`, `panelPos`, `panelScroll`, `pageHeader`, `eyebrow`, `pageTitle`, `pageSub`, `panelHead`, `panelHeadLabel`, `panelHeadMuted`, `panelCount`, `artifactGrid`, `card`, `scrollFadeWrap`.
- Color/font tokens: `INK`, `INK_SOFT`, `INK_CARD`, `INK_CARD_HI`, `BORDER`, `BORDER_HI`, `GOLD`, `GOLD_HI`, `GOLD_LO`, `GOLD_MUTE`, `DIM`, `OFF`, `serifDisplay`, `sansBody`.
- Constants: `TAB_PEEK`, `TAB_STRIP_H`, `DOCK_MIN_H`, `DOCK_MAX_FRAC`, `DOCK_DEFAULT_H_SHARED`, `STORAGE_KEY` (rename, see open question O7), `HOVER_DELAY_OPEN`, `HOVER_DELAY_CLOSE`.
- `useGlobalPillWidth`, `prettyTag`, `measureWidestLabel`.
- `presetSummaryText`, `makePresetSnapshot`, `FACTORY_PRESETS`.

### Dormant (port the code, do not render)

- `KAL_STATE_DEFAULT`, `KAL_KNOBS`, `runKaleidoscopeRecipe`, `kalIsDefault`.
- `Knob`, `PillSwitch`, `VuMeter`, `KaleidoscopeContent`.
- LED palette tokens (`LED_OFF`, `LED_GREEN`, `LED_YELLOW`, `LED_RED`).
- Kaleidoscope-specific styles (`kalWrap`, `kalConsole`, `kalKnobRow`, `kalBlock`, `kalBlockLabel`, `knobWrap`, `knob`, `knobIndicator`, `knobReadout`, `vuCluster`, `vuOuter`, `vuColumn`, `vuSeg`, `vuReadoutStack`, `vuReadoutNumber`, `vuReadoutLabel`, `switchStack`, `switch`, `switchKnob`).

`STATE.md` says Kaleidoscope is *MOTHBALLED for v1* (revives post-launch). The prototype follows this exactly: code present, never rendered.

### Likely skipped (debug-only)

- `AUDIT_RESULTS` IIFE and `AuditStrip` component — useful in the standalone prototype to verify the locked filter rule. Probably not for production. **Decision needed (open question O12).**

### Style integration target

The prototype writes inline JS-object styles. The exhibit's existing CSS is class-based in `Exhibit.css`. The new `HrExhibitFlow.jsx` will likely keep the inline `S.*` pattern (it's deeply parameterized — `S.tab(active, dockOpen, width, isClose)` etc.) rather than translating ~400 lines into static CSS classes. **Decision needed (open question O6).**

---

## 7. What gets removed

From `src/routes/hr/HrExhibitFlow.jsx`:

- `ALBUM_ERA` constant (replaced by prototype's tier-1 `era` dimension, which uses `ERAS = ["early", "breakthrough", "mature", "recent"]` — that's a *different* taxonomy than HR's `seeds | medusas | solo`; see O1).
- `tagLabel` map (replaced by `GROUP_LABELS` + `prettyTag`).
- `matchesEra`, `matchesType` (replaced by `matchFilter`).
- `TypePills` (replaced by `PillGroupColumn`).
- `ExhibitScroller` (no equivalent — the prototype displays a *grid*, not an auto-advancing single-card scroller).
- `Journal` component including `SEED_ENTRIES` (13 fan-submitted entries) — **unless O5 puts it somewhere new**.
- The 60/40 grid (`.ef-grid`, `.ef-left`, `.ef-right`) and all its inline CSS.
- The 3-section vertical scroll-snap layout (Panels 2/3/4 — `.ef-section`).
- `P2_TYPES`, `P3_TYPES`, `P4_TYPES` constants and their data files **if** O1 routes HR data through the prototype's taxonomy (`HR_ARCHIVE`, `HR_ARTIFACTS`, `HR_EXIT_FLOW`, `HR_JOURNAL_PROMPTS` may then be retired or repurposed).
- `react-social-media-embed` import (`FacebookEmbed`) — only used by `ExhibitScroller`; removed if `ExhibitScroller` is removed. Verify no other consumer in `src/`.
- ~700 lines of inline `<style>` covering the `ef-`, `jnl-` classes.

---

## 8. Open questions

These need resolution **before** Phase 1.5b writes any code. The choices change the scope of work materially.

### O1 — Data shape: keep HR's taxonomy, adopt prototype's, or merge them?

The prototype filters across **11 dimensions**: `era` (4 values), `album` (8), `year` (~16), `song` (13), `people` (10), `venue` (8), `format` (5), `media` (5), `provenance` (4), `type` (8), `odds` (8 sparse). Every one of its 200 generated artifacts carries a value (or array, for `people`/`odds`) for every dimension.

HR's actual data (`HR_ARCHIVE` + `HR_ARTIFACTS`) carries: `date`, `era` (3 values: `seeds | medusas | solo`), `src` (4 values), `type` (3 in archive, 7 in artifacts), `fact1`, `fact2`, `color`, `icon`, occasional `credit`/`postUrl`/`ytId`. **No** `people`, `venue`, `format`, `media`, `provenance`, `year` (year is implied by date but not stored as its own field), `song`, `album`, `odds`.

Three paths:

- **(a) Adopt prototype's 11-dimension taxonomy in HR data.** Augment every existing artifact with the missing fields (people, venue, format, media, provenance, year-as-string, song, album, odds where relevant). Substantial data work. Probably involves curating fields manually or auto-generating the missing ones from existing context.
- **(b) Reduce the prototype to HR's existing dimensions.** Tabs become Artist (era × album × year × song), Formats (type × src), Deep Tracks (search across known fields). Drops `people`, `venue`, `format`, `media`, `provenance`, `odds`. Smallest data change. Loses the prototype's richest filters.
- **(c) Hybrid.** Adopt the dimensions HR has reasonable data for already (era, album/year via SPINE, type, src) and stub out the rest as "coming soon" with empty pill columns or hide them.

This is the largest decision in the merge. **Recommend Mike pick before 1.5b begins.**

### O2 — Where do the artifact-grid items come from?

The prototype grids 200 artifacts in 4 column types (photo, art, video, press, essay, session). HR data is shaped around archive entries with `fact1`/`fact2` strings, color/icon placeholders, occasional embeds. The grid will need a card renderer adapter from HR shapes → prototype card shapes, or HR data restructured to match `ARTIFACT_SEED`'s shape (id, render, title, meta, credit, source, pull, sub, era, album, year, song, format, media, provenance, type, people, venue, odds, span_w, span_h).

**Related to O1.** Plan needs a concrete answer on what the artifact grid renders for HR.

### O3 — FactScroller: stays in the top section, or removed?

The user spec says *"keep the current /hr exhibit's top section (carousel + track chooser + video viewer)."* `FactScroller` lives in the same right column as the video viewer (lines 896–901 of `Exhibit.jsx`), below the video. Three options:

- **Keep it.** It's part of the right column's vertical pair (video on top, facts below). Removing it leaves the right column with just video + empty space. Implies the user means "everything above where ExhibitFlow gets mounted stays." This is the natural reading.
- **Remove it.** Strict reading of "carousel + track chooser + video viewer." But then the right column re-layouts and the video might want to grow vertically or shrink the pane. Adds a small UX question.
- **Move it elsewhere.** Could become a tab content (e.g., a sixth tab "Facts" in the dock), or absorbed into the Deep Tracks tab. Bigger change.

**Recommend keeping (option 1)** unless Mike intends otherwise. It's the safe default and matches how the column is already laid out.

### O4 — Dock as fixed-position viewport overlay, or as inline page section?

This is the **biggest architectural question** in the merge.

The prototype's dock is `position: absolute, bottom: 0` inside an `S.app` that is `position: fixed, inset: 0`. It overlays the bottom of the viewport regardless of scroll. The artifact grid above it lives in the same fixed app and scrolls only inside its own panel.

The live exhibit lays out as a vertical scroll-snap stack, where the user reaches the below-seam by scrolling down.

Two architectures:

- **(A) Dock overlays the whole viewport (true to prototype).** Hoist the dock OUT of `HrExhibitFlow` and render it at the `Exhibit.jsx` level, fixed-positioned across the bottom of the viewport above PlayerBar (which is also fixed). The artifact grid replaces the in-document below-seam; tracklist + video + facts above always cede the bottom 14px (peek) / 42px (hover) / 480px (open) to the dock. **Significant change to `Exhibit.jsx`** (the seam expands from "swap the component" to "rearrange the layout"). Loses scroll-snap below the main row.
- **(B) Dock as a section, inline.** Render the entire dock + grid as a vertically stacked section inside `HrExhibitFlow`. The "dock" sits at the section's bottom (using `position: sticky; bottom: 0` to the section), the grid above it scrolls within the section. **Smallest change to `Exhibit.jsx`** (no edit). Behaves more like a "page" than a dock when the user is past the main row.

Recommend (B) unless the user explicitly wants the prototype's overlay behavior. (B) preserves the scroll-snap exhibit shell. (A) is closer to the prototype's screenshot but reshapes the whole page.

### O5 — What happens to "The Journal"?

The Journal is a non-trivial existing feature: 13 seed entries, fan submission UI, voting, weighted random feed, undo/delete, prompt rotation. The prototype has no Journal. Options:

- **(a) Discard.** Phase 1's "single-artist exhibit, HR-only" simplification continues; Journal is removed. Lose fan content.
- **(b) Move.** A new sixth tab "Journal" in the dock. Or a separate inline panel above the dock. Or a sticky right column alongside the artifact grid (mirrors current 60/40 layout).
- **(c) Keep as-is in addition to the dock.** Render the Journal panel above or below the dock+grid section. Largest layout work.

`STATE.md` does not mention removing the Journal. `BACKLOG.md` and `docs/FEATURE_fan_playlists.md` may have context worth checking.

### O6 — CSS strategy: inline JS-objects vs. CSS classes

The prototype uses ~400 lines of inline `S.*` style objects. The live exhibit uses class-based CSS in `Exhibit.css`. Three choices:

- **(a) Port S.* as-is.** Keep the inline pattern in the new `HrExhibitFlow.jsx`. Easiest port. Inconsistent with rest of project.
- **(b) Convert to a new `HrExhibitFlow.css` (class-based).** Most consistent. Most work. Some `S.*` builders take parameters (e.g., `S.tab(active, dockOpen, width, isClose)`); these become harder as static CSS, requiring multiple modifier classes + style-prop overrides.
- **(c) Hybrid.** Static styles → CSS, parameterized styles stay inline. Pragmatic.

Recommend (c). Hybrid keeps the parameterized cases readable while bringing static styles in line with the project.

### O7 — localStorage key namespacing

The prototype uses `wb_v17_dock_height` (carried forward through versions despite being on v28). The live exhibit uses `wb-hr-split`, `wb-hr-cfh`. New key for the dock should follow the live convention: probably `wb-hr-dock-height` (or `wb-dock-height` if dock state should be artist-agnostic — discussion item).

If we ever add CB back, do dock heights stay artist-specific or shared? Recommend artist-specific until proven otherwise (`wb-hr-dock-height`).

### O8 — Player integration: `playingTrack` and `spinePosition` for preset snapshots

`makePresetSnapshot` captures `playingTrack: { id, positionSec, album } | null` and `spinePosition: album-id | null`. The live exhibit has `playingAlbum` (index), `playingTrack` (track index), `playingVideo` (video index). To make snapshots restorable, the merge needs:

- A coordinate translation: `(playingAlbum, playingTrack, playingVideo)` ↔ `{ id, positionSec, album }`.
- Decision on whether snapshots restore the player (rewind to track + position) or just capture for display. Prototype defers actual APPLY semantics — only `selected/shuffle/loop` are restored, not player state.

Recommend matching the prototype's posture: capture player state in the snapshot but don't restore it on APPLY in v1. Note the deferral in code.

### O9 — Shuffle and Loop: do they exist in the live player?

The prototype's Presets tab has Shuffle + Loop pill switches that, per spec §9, control player behavior. The live exhibit's player has no shuffle/loop. Either:

- **(a) Add shuffle/loop to the player.** Wire `shuffle: bool` into `advanceQueue` (random next track instead of sequential), and `loop: bool` into the album-end logic (loop within album instead of cross-fading to next album).
- **(b) Stub.** Render the switches but no-op them. Consistent with "prototype defers APPLY semantics."

Recommend (a) eventually but (b) for the first cut. Add a code comment explaining the deferral.

### O10 — Auto-focus on Deep Tracks search

The prototype focuses the search input every time the Deep Tracks tab opens. With React Router routing, multiple navigations to `/hr` will mount fresh state — focus should still work since `useEffect` fires on every `focusSignal` change. No change expected, but worth confirming after the merge runs.

### O11 — Mobile

The prototype is desktop-first (`overflow: hidden; height: 100vh`; the dock occupies real estate that's already tight at narrow widths). The live exhibit has an `@media(max-width:720px)` breakpoint that collapses the 2-column body to single column and hides the vertical resizer. The dock on a 380px-wide phone needs treatment: maybe collapse to a single tab strip at 100% width, or fall back to vertical inline panels (closer to the existing `ef-section` model).

This is plausibly out of scope for 1.5b's first cut — recommend punting to a follow-up phase, with a simple "if (window.innerWidth < 720) return null;" or a stripped layout to keep mobile from breaking.

### O12 — `AuditStrip`: include or strip?

`AuditStrip` is the bottom-right floating debug widget that shows the 6 sanity-test pass/fail. Useful in development, awkward in production. Options:

- **(a) Drop entirely.** Cleanest production. Loses debugging signal.
- **(b) Keep, gate behind `import.meta.env.DEV`.** Visible only in dev builds.
- **(c) Keep, gate behind a query param** (e.g., `/hr?audit=1`). Useful for production debugging.

Recommend (b).

### O13 — Visit tracking

`Exhibit.jsx` line 578–579 posts to `/api/visits` on mount. Independent of this merge; mentioned only because the prototype doesn't have it (it's standalone) and we need to confirm the POST path still fires after the merge. It does — `Exhibit.jsx` is unchanged.

### O14 — `<title>` and `<meta>` interaction

`index.html` description (post-Phase 1) reads *"Weird.Baby Museum. Currently exhibiting Hunter Root."* Once the dock UI is exposed, do we want to update the title or description further? Likely no, but worth asking.

### O15 — Filter taxonomy labels

`GROUP_LABELS` renames `format` → "Setting" and exposes `media` as "Media". `STATE.md` line 268-269 documents that this label drift was deliberate (renamed pre-v20 to "Setting", then `media` restored at v46 from "Format"). The merge inherits these labels verbatim. Worth confirming Mike still wants them now that this exhibit ships.

---

## 9. Estimated scope

**This is a MEDIUM merge.** Concretely:

- **One file rewritten end-to-end:** `src/routes/hr/HrExhibitFlow.jsx` is replaced. 729 lines out, ~1000–1400 lines in (after porting the v28 dock + grid + filter + presets + dormant Kaleidoscope code, modulo the open questions above).
- **Possibly one new file:** `src/routes/hr/HrExhibitFlow.css` if O6 lands on hybrid styles, or a new file for the artifact card components if they're split out.
- **One file untouched in code, possibly grown in data:** `src/data/artists/hunter-root.js`. The shape stays the same; if O1 picks (a) or (c), the SPINE+facts gain extra metadata fields per track or new sibling arrays for artifacts.
- **`Exhibit.jsx` untouched** if O4 picks (B) — inline section. **Modified ~30 lines** if O4 picks (A) — viewport-overlay dock requires hoisting state and rearranging the layout.
- **No changes to:** `App.jsx`, `HrSpine.jsx`, `Exhibit.css`, the worker, the build config, `wb_roster.js`.

### Things that bump scope toward LARGE

- O1 (a): adopting the prototype's 11-dimension taxonomy means substantial HR data work. Could double the merge effort.
- O4 (A): viewport-overlay dock means restructuring `Exhibit.jsx` — touches the kept top section.
- O5 (c): Journal kept alongside the dock means an additional layout decision and rendering it inside or beside the dock.

### Things that bump scope toward SMALL

- O1 (b) + O5 (a): adopt fewer dimensions and discard the Journal. Then the merge is essentially "render an artifact grid filtered by HR's existing fields, with a 5-tab dock at the bottom of the section." Could be ~600 LOC.

### Recommended phasing for 1.5b (after open-question resolution)

1. Resolve O1, O3, O4, O5 with Mike (these are the four that change the architecture).
2. Port the dock + filter + pill + presets infrastructure into a new `HrExhibitFlow.jsx`.
3. Wire `selected` + `dimensions` + `matchFilter` to HR data (O1's choice determines the adapter shape).
4. Render the artifact grid above the dock.
5. Resolve O6 (style strategy) once the structure is in.
6. Decide O8/O9 player integration after the dock UI is rendering.
7. Defer O11 (mobile) and O12 (AuditStrip) and O15 (label review) to polish.

### Reference docs referenced by this plan

- `STATE.md` — lines 198–227 describe the v28 controls surface; line 203 names the canonical prototype.
- `docs/canonical/UX_CONTROLS_SPEC_v0.3.md` — full v0.3 spec for the dock UI.
- `docs/FILTER_LOGIC_DECISION.md` — locked filter rule.
- `docs/SESSION_CLOSE_v27.md`, `…_v44.md`, `…_v45.md` — recent decision history that touches the dock.
- `docs/WRAP_PROBABILITY_ANALYSIS.md` — record of the deferred scroll-affordance question.

(Reading any of these docs in detail is a separate exercise — flagged here for reference, not consumed for this plan.)
