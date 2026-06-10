# HANDOFF — exhibit-page relayout SCOPE (read-only map)

**Written:** 2026-06-09 · **Repo HEAD:** `36b2182` (== `origin/main`) · **Mode:** READ-ONLY. No source files modified.
**Purpose:** Map what exists before a planned two-part relayout. (1) Move the deck tabs from their bottom dock to the side. (2) Repurpose the left tracklist area for new content. **No layout recommendations — that is Mike's UX call.** This file maps the surface and what each move touches.

Orientation order honored (OPERATIONS §6): OPERATIONS.md → STATE.md → newest HANDOFF → git log/status. Truth ranking: live tree > git log > STATE.md > handoffs.

---

## 1. Current state summary

**Git truth**

| Fact | Value |
|---|---|
| `git rev-parse --short HEAD` | `36b2182` |
| `git rev-parse --short origin/main` | `36b2182` |
| HEAD == origin/main? | **YES** — local is in sync with remote (nothing unpushed except working-tree edits below) |
| `git status -s` | dirty: ` M CLAUDE.md`, ` M docs/SCOPE-token-mirror.md` — two uncommitted **doc-only** tweaks, nothing in `src/` |

`git log --oneline` top: `36b2182` (deck accent constants synced to canonical `--hr-*` ramp) ← `e4db90c`, `8e7e10e` (START_HERE) ← `77e18b0` (handoff refresh) ← `347b1e8` (OPERATIONS.md authored) ← `b1a1c4e` (Retag tooling).

**Conduit stamp `b1a1c4e` — is it current? NO. It is STALE.**
`b1a1c4e` is **5 commits behind** HEAD (`b1a1c4e` → `347b1e8` → `77e18b0` → `8e7e10e` → `e4db90c` → `36b2182`). Per OPERATIONS §3 staleness rule, any `_conduit` payload stamped `b1a1c4e` is usable as a hint only, **never as scoping ground truth.** This scope file carries the current stamp (`36b2182`).

**STATE.md picture:** Weird.Baby Museum, currently exhibiting Hunter Root at `/hr`. Stack: React 19, Vite 8, Cloudflare Workers, D1. The HR exhibit page is **two stacked components** mounted `HrSpine → Exhibit → HrExhibitFlow`, joined at the `<ExhibitFlow>` seam (`Exhibit.jsx:992`). Presets capture/restore, shuffle/loop, and sharing all LANDED (June 6–7) and cross that seam via prop-widening. No CI; deploy is manual and host-side only.

**Truth-ranking correction (live tree wins over docs):** OPERATIONS §5 (line 98) and `HANDOFF_next_session.md` both still describe the **JS token-mirror drift** (`GOLD_HI/GOLD_LO/DIM` flattened to one tone `#211f1c`) as an **open** finding and name "token-mirror fix" as the recommended next step. **That fix has already LANDED at HEAD** in `36b2182`. Live `HrExhibitFlow.jsx:118–122` now reads `GOLD=#211f1c`, `GOLD_HI=#000000`, `GOLD_LO=#57544d`, `GOLD_MUTE=#9b978d`, `DIM=#3b3933` — all matching `museum-tokens.css`. So the handoff's "do this next" is a stamped-at-write-time suggestion that is now done, not a standing order (OPERATIONS §6). The structural coupling that *caused* the drift still exists — see §4.1.

---

## 2. Change 1 — Move the tabs from the bottom dock to the side

### What owns the current layout

| Concern | Location |
|---|---|
| Tab set (data) | `HrExhibitFlow.jsx:180–188` — `const TABS = [...]`: 5 entries — `artist` (tier 1), `media`/"Source" (tier 2), `deep`/"Deep Tracks" (tier 3), `presets` (special), `journal` (special). A 6th synthetic "close ▾" tab is injected at render only when open. |
| Dock container | `HrExhibitFlow.jsx:3539` — `<div className="hr-deck" style={S.deck(deckPx)}>` inside `<div className="hr-section-deck-host">` (3520). |
| Tab strip render | `HrExhibitFlow.jsx:3540–3599` — `<div className="hr-tab-strip">` maps `TABS.filter(t => t.key !== "journal")` → one `<div>` per tab styled by `S.tab(...)`. ⚠️ **Journal is currently filtered OUT of the visible strip** (3545); it still has a body handler (3626) but no clickable tab today. |
| Tab body | `HrExhibitFlow.jsx:3601–3642` — `<div className="hr-deck-body">`, rendered only when `open && currentTab`; switches on `currentTab.kind`: `tier` → `TierContent`/`DeepTracksContent`, `special:journal` → `JournalContent`, `special:presets` → `PresetsContent`. |
| Tab chrome (geometry + color) | `HrExhibitFlow.jsx:316–339` — `S.tab(active, deckOpen, width, isClose)` inline-JS builder (per-tab border/fill/radius/`height:TAB_STRIP_H`/`width`). Colors come from JS mirror constants `GOLD_HI/GOLD_LO/DIM/INK/INK_SOFT` (see §4.1). |
| Deck box geometry (JS half) | `HrExhibitFlow.jsx:290–311` — `S.deck(deckPx)`: `position:"fixed"`, `left:0,right:0`, `height:deckPx`, `zIndex:10`, `pointerEvents:"none"`, `overflow:"hidden"`. |
| Deck box geometry (CSS half) | `HrExhibitFlow.css:550–551` — `.hr-deck{bottom:0}` and `body:has(.pb) .hr-deck{bottom:60px}` (rides above the player bar when one is mounted). |
| Tab strip geometry (CSS) | `HrExhibitFlow.css:554–563` — `.hr-tab-strip{position:absolute; top:0; left:12px; right:12px; height:30px; display:flex; align-items:flex-end; z-index:12}`. A **horizontal flex row** pinned to the top edge of the bottom-anchored fixed deck. |
| Deck body geometry (CSS) | `HrExhibitFlow.css:592–601` — `.hr-deck-body{position:absolute; top:30px; left:0; right:0; bottom:0; …}` — opens **upward** from below the strip. |
| Grid pane reservation | `HrExhibitFlow.jsx:284–286` `S.panelPos(deckPx)` → `position:absolute; inset 0; bottom:deckPx` — the artifact grid above the deck reserves **bottom** space equal to the deck height. |

### How it's positioned
**Bottom-anchored fixed overlay.** `.hr-deck` is `position:fixed` pinned to viewport bottom (`bottom:0`, or `60px` when the player bar is present). Inside it, the tab strip is `position:absolute; top:0` (a horizontal flex rail), and the body is `position:absolute; top:30px` opening upward. Geometry is **split-brain**: position/height/overflow live in inline JS (`S.deck`, `S.panelPos`), while `bottom`/`left`/`right`/`top` live in CSS (`.hr-deck`, `.hr-tab-strip`, `.hr-deck-body`).

### What the tabs are bound to
- State: `activeTab` / `setActiveTab` (`HrExhibitFlow.jsx:3274`). `open = activeTab !== null && activeTab !== "close"` (3419). `handleTabClick` (3425) toggles a tab open/closed. `currentTab = TABS.find(t => t.key === activeTab)` (3461) selects which body renders.
- Height driver: `deckPx` (3419–3423) swings between `TAB_PEEK` (30) / `TAB_STRIP_H` (30) / `deckHeight` (resizable open height, persisted to `localStorage` `wb-hr-deck-height`).
- Peek-to-open: `onMouseEnter` on `.hr-tab-strip` (3542) → `scheduleHoverOpen` (3404); resize via `S.resizeHandle` (`ns-resize`, top of body, 342–350). All of these are **vertical-axis** behaviors.

---

## 3. Change 2 — Repurpose the left tracklist area

### What owns the current layout

| Concern | Location |
|---|---|
| Column container | `Exhibit.jsx:899–908` — `<div className="ex-left"><TrackList …/></div>`, the LEFT cell of `.ex-main-inner`. |
| Grid definition | `Exhibit.jsx:894–896` — `.ex-main` / `.ex-main-inner` with inline `gridTemplateColumns: `${split}fr 10px ${100-split}fr`` → `[tracklist] [drag handle] [video+facts]`. Left-column width = `split` state. |
| Drag handle | `Exhibit.jsx:910–913` — `.vr-dh` (`onPointerDown → makeSplitDrag`); width persisted to `localStorage` `wb-hr-split`. |
| TrackList component | `Exhibit.jsx:404–467`. |
| CSS | `Exhibit.css:66–105` — `.ex-main{display:grid}`, `.ex-left{overflow-y:auto; border-right}`, `.vr-dh`, and the `.tl-*` rules (rows, `.tl-num`, `.tl-title`, `.tl-tags` grid, `.tl-tag` variant buttons). |

### How it's positioned
**CSS-grid column.** `.ex-main-inner` is a 3-column grid; the tracklist is the left `fr` column, its width controlled by `split` (user-draggable via `.vr-dh`, persisted). The column scrolls internally (`.ex-left{overflow-y:auto}`).

### What the tracklist currently feeds (and is fed by)
- **Fed by (props, `Exhibit.jsx:900–907`):** `album` (active album off `SPINE`), `playingTrackIdx`, `activeTrack`, `selectedVis` (per-track variant-selection `Set`s).
- **Feeds (callbacks → the player):** `onSelect(ti)` → `handleTrackSelect` drives the player + the right-pane video area; `onTagClick(ti, vi)` → `handleTagClick` picks the variant/rendition (which video plays). Variant buttons are built from `TAG_SLOTS` / `typeToVi` / `typeColor` / `typeLabel` (radio-per-track).
- **Downstream:** the right pane (`.ex-right`: video area + `<FactScroller>`, `Exhibit.jsx:916–984`) reacts to the selection the tracklist drives.
- **Crosses the seam:** the same selection state becomes `playingTrackIds`, passed into `<ExhibitFlow>` (`Exhibit.jsx:993–999`) as `playingTrack` — this is what the **deck's Presets feature snapshots** for capture/restore. So the tracklist is the player-identity source the preset system depends on.

**Net:** the tracklist isn't a passive list — it is the **primary track + variant selector** that drives the player, the right-side video/facts, and (via the seam) preset capture.

---

## 4. Coupling / risk notes — what makes each move surgical vs. simple

1. **Shared tokens, with a JS-mirror seam.** Both `Exhibit.css` and `HrExhibitFlow.css` paint from `museum-tokens.css` `--hr-*`. But the deck's **inline `S.*` styles read hand-copied JS constants** (`HrExhibitFlow.jsx:109–122`), not the CSS vars. As of HEAD `36b2182` those values **match** the CSS ramp (drift resolved in `36b2182`), but it remains a **manual literal mirror** — any token edit during relayout will NOT auto-propagate to inline styles. The tab chrome (`S.tab` → `GOLD_HI/GOLD_LO/DIM/INK/INK_SOFT`) is entirely on this mirror, so a tab relocation that restyles hits the mirror seam. (Related un-wired color copies — stale CLAUDE.md token table, `WbHome/WbAdmin/HrArchive/HrHome/Exhibit` raw-hex — are catalogued in `docs/SCOPE-token-mirror.md §6`; out of scope, but relevant if relayout touches color.)

2. **The ~16KB post-edit boundary (OPERATIONS §8).** `HrExhibitFlow.jsx` is ~162KB / 3650 lines. The tab-strip render (~3540), `S.tab`/`S.deck` (~290–339), and `TABS` (~180) all sit **far past** the 16KB mark, where patches silently tail-truncate. Tab-move edits therefore require anchor-based patches + `wc -l` + tail verify, host-side and surgical. **This alone makes Change 1 "surgical, not simple."**

3. **Split-brain geometry (JS ⇄ CSS).** The dock's position is divided between inline JS (`S.deck`/`S.panelPos`: position/height/overflow) and CSS (`.hr-deck` bottom-anchor, `.hr-tab-strip` absolute top rail, `.hr-deck-body` top:30px). Moving the tabs to the side means editing **both** in lockstep — a JS-only or CSS-only change leaves the deck half-moved.

4. **Vertical-axis assumptions baked into the open/peek/resize model.** `deckPx` reserves **bottom** space (`S.panelPos` `bottom:deckPx`); the body opens **upward** (`top:30px`); resize is **`ns-resize`**; peek triggers on the bottom strip's `mouseenter`. A side dock inverts the axis → not a coordinate tweak but a re-architecture of how the deck peeks, opens, resizes, and reserves space for the grid.

5. **Journal tab is currently hidden from the strip** (`HrExhibitFlow.jsx:3545` filters `key !== "journal"`) while its body handler still exists (3626). Note this current-state quirk before any tab-set change.

6. **Tracklist is load-bearing for the player AND presets.** Repurposing `.ex-left` can't just swap content: `onSelect`/`onTagClick` are the player's track/variant entry point, and the selection becomes `playingTrackIds` crossing the `<ExhibitFlow>` seam for preset capture. Either preserve those bindings or rehome them, or the player loses its driver and presets lose their source.

7. **`split` grid machinery comes attached.** The left column's width is user-draggable (`.vr-dh` → `makeSplitDrag`) and persisted (`localStorage` `wb-hr-split`); the right pane's width is the complement (`100-split`). Repurposed content inherits this drag/persist behavior unless reworked.

8. **Two-component seam keeps the changes mostly independent.** Tabs live in `HrExhibitFlow.jsx`; tracklist in `Exhibit.jsx`. They touch only at the `<ExhibitFlow>` props seam (`Exhibit.jsx:992`). The two moves are largely separable **except** both feed/consume the shared selection + preset state across that seam.

9. **Environment hazards (OPERATIONS §8).** Cowork FUSE/sync has truncated large files mid-write — never do read-modify-write on `HrExhibitFlow.jsx`/`Exhibit.jsx` in the sandbox; big-file edits are surgical and host-side. Virtiofs phantom deletions mean HR commits go host-side with the index-lock prelude.

---

## 5. Files touched by each change (quick index)

**Change 1 (tabs → side):** `HrExhibitFlow.jsx` (`TABS` :180; `S.deck` :290; `S.tab` :316; `S.panelPos` :284; `S.resizeHandle` :342; strip render :3540–3599; body :3601–3642; `activeTab`/`deckPx`/`handleTabClick` :3274/:3419/:3425) · `HrExhibitFlow.css` (`.hr-deck` :550; `.hr-tab-strip` :554; `.hr-deck-body` :592; `.hr-section-deck-host` :50) · color mirror `HrExhibitFlow.jsx:109–122`.

**Change 2 (repurpose tracklist):** `Exhibit.jsx` (`.ex-main-inner` grid :894; `.ex-left` :899; `TrackList` :404–467; `handleTrackSelect`/`handleTagClick`; seam props :993) · `Exhibit.css` (`.ex-main`/`.ex-main-inner` :66–67; `.ex-left` :70; `.vr-dh` :76; `.tl-*` :84–105).

**Shared/canonical (read for both, do not edit without UX direction):** `src/styles/museum-tokens.css` (`--hr-*` ramp + typography, 63 lines).

---

*Read-only pass. No source modified. This file is the deliverable; a stamped copy is in `G:\My Drive\_conduit\`. Durability (commit/push) is Mike's host-side step per OPERATIONS §1.*
