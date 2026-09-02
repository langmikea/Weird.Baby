# HANDOFF — Top-rail flags + player-bar seam reflow scope

**Mode:** READ-ONLY analysis. No source edits, no commits, no reverts performed.

## Working-tree state (at time of analysis)

```
git rev-parse --short HEAD     → 8ce53e0
branch / upstream              → main → origin/main
HEAD vs origin/main            → 0 ahead / 0 behind  (== origin/main)
```

`git status -s`:

```
 M CLAUDE.md
 M docs/SCOPE-token-mirror.md
 M docs/canonical/OPERATIONS.md
 M src/routes/exhibit/Exhibit.css
 M src/routes/exhibit/Exhibit.jsx
?? docs/HANDOFF_clamp_fix.md
?? docs/HANDOFF_jsx_recovery.md
?? docs/HANDOFF_leftrail_applied.md
?? docs/HANDOFF_phase1_deckrail_grab.md
?? docs/HANDOFF_relayout_scope.md
?? docs/HANDOFF_toprail_build.md
?? docs/HANDOFF_toprail_group_scope.md
?? docs/SCOPE-tabs-leftrail-extract.md
```

The uncommitted top-rail build (`Exhibit.jsx` / `Exhibit.css`, both " M") is present on the tree as the brief describes.

---

# PART 1 — Resolve the two open flags

## Flag 1 — Rail collision: `.ex-rail` (new top rail) vs `.hr-deck` (deck rail)

**Verdict: REAL overlap.** The two rails occupy the same left-edge horizontal band whenever the album section is on screen on desktop, because the deck rail is `position:fixed` (pinned to the viewport left edge at all scroll positions) while the new top rail sits in normal flow ~8px in. They both render simultaneously — the deck mounts on this very page via `<ExhibitFlow>`.

### Are they ever in the DOM together? Yes.

`Exhibit.jsx:568` → `const ExhibitFlow = artist.exhibitFlow;`
`Exhibit.jsx:1043` → `{ExhibitFlow && ( <ExhibitFlow … /> )}`
`src/data/artists/hunter-root.js:33` → `exhibitFlow: HrExhibitFlow,`

So for any artist whose config sets `exhibitFlow` (hunter-root does), the exhibit page renders **both** the new `.ex-rail` *and* the `HrExhibitFlow` deck (`.hr-deck`). For artists with no `exhibitFlow`, the deck is absent and there is no collision.

### Horizontal geometry (the deciding CSS)

**New top rail** — leading grid column of `.ex-main-inner`, in normal flow:

`Exhibit.jsx:910-911`
```jsx
<div className="ex-main-inner" ref={bodyRef}
  style={{ gridTemplateColumns: `var(--ex-rail-w) ${split}fr 10px ${100-split}fr` }}>
```
`Exhibit.css:67` → `.ex-main-inner{display:grid;height:100%;--ex-rail-w:34px}`
`Exhibit.css:74` → `.ex-rail{display:flex;flex-direction:column;…overflow:hidden;min-height:0}` (no `position`, no `z-index` → static)
`Exhibit.css:12` → `.ex-root{…padding:0 8px 64px}`

The rail is the first grid track, width `var(--ex-rail-w)` = **34px**. Its content-box left edge = `.ex-root` left padding = **8px**. So the top rail occupies **x ≈ 8px → 42px**.

**Deck rail** — fixed to the viewport:

`HrExhibitFlow.jsx:296-300` (inline `S.deck`)
```js
position: "fixed", top: 0,
width: deckW + "px",
…
zIndex: 10,
pointerEvents: "none",
```
`HrExhibitFlow.css:550` → `.hr-deck { bottom: 0; left: 0; transition: left 0.18s ease; }`

So `.hr-deck` is `position:fixed; left:0; top:0; bottom:0` — a full-height column pinned to the **left viewport edge**. The visible rail inside it is the tab strip:

`HrExhibitFlow.css:554-564`
```css
.hr-tab-strip { position:absolute; left:0; top:12px; bottom:12px; width:30px; … z-index:12; }
```

The tab strip occupies **x = 0 → 30px**, fixed, `z-index:12`.

### Overlap

Top rail `x 8–42` ∩ deck strip `x 0–30` = **overlap band x ≈ 8–30px (~22px wide)**. Vertically both span the viewport center region (the deck strip is `top:12 → bottom:12`; the top rail is inside `.ex-main.ex-snap`, centered in the viewport). Because the deck is `position:fixed` with `z-index:12` and the top rail is static (paints in normal flow, beneath positioned/fixed layers), **the fixed deck tab strip paints on top of the left ~22px of the new top rail** — two vertical tab rails stacked in the same corner.

**Conditions:** Present whenever the album (`.ex-main`) section is in view, at any scroll position, for any artist with an `exhibitFlow`, on viewports **> 720px**. On ≤720px there is no collision — the rail is hidden: `Exhibit.css:198` → `.ex-rail{display:none}` inside `@media(max-width:720px)`.

**Minimal fix (name only, not applied):** Give the album block a left gutter that clears the fixed deck strip — e.g. a left padding/offset on `.ex-main` (or `.ex-main-inner`) ≥ the 30px deck-strip width on desktop, so `.ex-rail` starts to the right of the fixed deck. (This is a stopgap; the Part-2 reflow removes the fixed deck entirely and dissolves the collision at the root — see Phase 2.)

---

## Flag 2 — FACTS double-show: `.ex-left` vs `.ex-right`

**Verdict: REAL double-show. YES — when the top rail's FACTS tab is active, `<FactScroller>` renders in BOTH columns.** The right column (`.ex-right`) renders a `FactScroller` **permanently/unconditionally**; the left column (`.ex-left`) renders a **second** `FactScroller` whenever `railTab === "facts"`. Both are fed the same `facts={FACTS}`, same `albumId`, same `trackTitle` — so identical facts appear twice, side by side.

### Quoted JSX paths

**Left column** — conditional on the FACTS tab (`Exhibit.jsx:931, 951-958`):
```jsx
<div className="ex-left">
  …
  {railTab === "facts" && (
    <FactScroller
      facts={FACTS}
      albumId={album.id}
      trackTitle={activeTrack !== null ? album.tracks[activeTrack]?.title : null}
      accent={album.accent}
    />
  )}
</div>
```

**Right column** — unconditional, always mounted under the video (`Exhibit.jsx:967, 1028-1034`):
```jsx
{/* RIGHT — permanent video + facts */}
<div className="ex-right">
  <div className="vp-area"> … </div>
  {/* FACTS */}
  <FactScroller
    facts={FACTS}
    albumId={album.id}
    trackTitle={activeTrack !== null ? album.tracks[activeTrack]?.title : null}
    accent={album.accent}
  />
</div>
```

There is no guard tying the two together: the right-side `FactScroller` has no `railTab` condition, so selecting FACTS on the rail adds a duplicate rather than relocating the existing one. (Note `RAIL_TABS` is defined `Exhibit.jsx:871-872` and the rail comment at `863-868` explicitly says the rail only "swaps what fills the content column" `.ex-left` and that "zero state crosses the `<ExhibitFlow>` seam" — the permanent right-column facts were not reconciled with the new tab.)

**Where they appear:** left content column (because `railTab==="facts"`) **and** right column beneath the video/PUV region (always). Both visible at once.

**Minimal fix (name only, not applied):** Gate the right-column `FactScroller` so it does not render when the rail is already showing facts — wrap it in `{railTab !== "facts" && ( … )}` (or, conversely, treat the permanent right-column facts as canonical and drop the FACTS rail tab). Either removes the duplicate; the `railTab !== "facts"` guard is the smaller change and keeps the existing default view intact.

---

# PART 2 — Player-bar seam reflow scope

**Target model:** album area and deck area become two **stacked areas in one scroll flow**; the player bar (`.pb`) is a **seam** between them that clamps at both viewport edges (sticky-style) — rides with content, parks at the top when scrolled down (deck scrolls under it), parks at the bottom when scrolled up (album scrolls under it). The deck rail's top rides under the bar.

## How the exhibit page is structured today

It is **not one clean scroll flow** — it is the document scroll plus several nested scroll panes, with the deck and the player bar both lifted out as **fixed viewport overlays**.

Render tree (`Exhibit.jsx:882-1064`):

```
<ex-root>                       Exhibit.css:12  flex column; min-height:100vh; padding:0 8px 64px; NOT a scroll container
  ├─ <ex-nav>                   Exhibit.css:32  scroll-snap-align:start
  ├─ <Coverflow> + <cf-dh>
  ├─ <ex-main.ex-snap>          Exhibit.css:28,66  scroll-snap-align:center; display:grid; flex:1; overflow:hidden
  │     └─ <ex-main-inner>      rail | ex-left(scrolls) | vr-dh | ex-right
  ├─ {ExhibitFlow && <HrExhibitFlow>}   = <hr-section>  HrExhibitFlow.css:36  scroll-snap-align:center; min-height:calc(100vh-64px)
  │     └─ <hr-section-deck-host>       HrExhibitFlow.css:50  position:relative; flex:1; overflow:hidden
  │           ├─ <hr-panel-scroll>      HrExhibitFlow.css:59  position:absolute; inset:0; overflow-y:auto  (grid pane scrolls)
  │           └─ <hr-deck>              FIXED overlay (escapes the host)
  └─ <PlayerBar> → <pb>         Exhibit.css:174  position:fixed; bottom:0; left:0; right:0; z-index:100  (null when no video)
```

- **Scroll container(s):** the **document/body** is the primary scroller (`html,body{…scroll-snap-type:y mandatory;scroll-behavior:smooth}` — `Exhibit.css:9`). `.ex-root` just grows with content. On top of that there are independent inner scrollers: `.ex-left` (`Exhibit.css:92`), `.hr-panel-scroll` (`HrExhibitFlow.css:59`), `.hr-content-body` (`HrExhibitFlow.css:611-615`). So: **one outer snap-scroll + several nested panes**, not a single flow.
- **Where the deck is fixed today:** `S.deck` inline `position:"fixed"; top:0` (`HrExhibitFlow.jsx:296`) + `.hr-deck{bottom:0;left:0}` (`HrExhibitFlow.css:550`). It is pinned to the viewport, **independent of which snap section is showing** — which is exactly why it overlays the album section and collides with the new top rail (Flag 1). The `.hr-section-deck-host` comment (`HrExhibitFlow.css:46-49`) calls it a "sticky-bottom deck," but the live code is `fixed`; that comment is aspirational/stale.
- **What must change for the deck to live in normal flow under a sticky seam:** the deck has to stop being a viewport overlay and become an in-flow block inside its section, sized by the section (not the viewport), with its rail's top sliding beneath the seam. That means unwinding `S.deck`'s `position:fixed`, the `.hr-section-deck-host{overflow:hidden}` clip, and the `.hr-panel-scroll{position:absolute;inset:0}` pane that currently assumes a fixed sibling.

## How the fixed deck and the player bar relate today

Both are **fixed viewport overlays** that don't share a layout box: the deck (`z-index:10`/strip `12`) pins left, full height; the player bar (`z-index:100`) pins along the bottom, on top. Their **only coupling** is a lift so the deck's bottom tabs don't hide behind the bar:

`HrExhibitFlow.css:551` → `body:has(.pb) .hr-deck { bottom: 60px; }`

`.pb` is conditionally in the DOM — `PlayerBar` returns `null` when nothing is playing (`Exhibit.jsx:494` → `if (!video) return null;`). So `:has(.pb)` is true only while a video plays; then the fixed deck's bottom is raised by the bar's 60px height (`Exhibit.css:174` → `.pb{…height:60px}`). Documented inline at `HrExhibitFlow.css:544-549` and `Exhibit.jsx:301-303`.

**What `body:has(.pb)` does in the new model:** it becomes inert/harmful. There is no bottom-anchored fixed deck to lift, and the bar is no longer a fixed bottom overlay — so the 60px `bottom` offset no longer corresponds to anything. The separation it used to create is instead produced by the seam occupying its own space in the flow. **Remove the rule.** But its *conditionality* still raises a real design question: when no video plays, `.pb` is absent → there is no seam. Decide whether the album/deck areas abut directly when idle, or whether the seam reserves space always (placeholder bar). Flagged below.

## Every file / component / CSS rule the reflow touches

**`src/routes/exhibit/Exhibit.jsx`**
- `:1053-1061` — relocate `<PlayerBar>` from the tail (after `<ExhibitFlow>`) to **between** `.ex-main` and `<ExhibitFlow>` so it becomes the DOM seam.
- `:909` / `:1043` — likely wrap `.ex-main` + the player bar + `<ExhibitFlow>` in a single scroll-flow container.

**`src/routes/exhibit/Exhibit.css`**
- `:9` — `html,body{…scroll-snap-type:y mandatory…}` → remove/relax (mandatory y-snap fights a sticky seam).
- `:12` — `.ex-root{…padding:0 8px 64px}` (the 64px bottom pad was reserved for the fixed bar — revisit).
- `:28` `.ex-snap`, `:32` `.ex-nav` snap-align — snap removal.
- `:66` `.ex-main{…flex:1;overflow:hidden}` — height/overflow behavior in a continuous flow.
- `:174` `.pb{position:fixed;bottom:0;…z-index:100}` → **sticky seam** (offsets + z).
- `:191-206` media query (`.pb` padding; `.ex-main-inner` single-col; `.ex-rail{display:none}`).

**`src/routes/hr/HrExhibitFlow.jsx`**
- `:290-311` `S.deck` — remove `position:"fixed"`, `top:0`; rework to in-flow, section-sized.
- `:284-286` `S.panelPos` — the absolute grid pane positioning.
- `:3518-3539` the deck-host render block (`hr-section-deck-host` / `animated` panel / `hr-deck`).

**`src/routes/hr/HrExhibitFlow.css`**
- `:36` `.hr-section{…scroll-snap-align:center}` → remove snap.
- `:50-55` `.hr-section-deck-host{overflow:hidden;min-height:calc(100vh-64px)}` — must let the deck live in flow.
- `:59-64` `.hr-panel-scroll{position:absolute;inset:0;overflow-y:auto}` — rework (currently assumes a fixed deck sibling).
- `:550` `.hr-deck{bottom:0;left:0}` — de-fix.
- `:551` `body:has(.pb) .hr-deck{bottom:60px}` — **remove**.
- `:1200`, `:1208` mobile overrides (`hr-section-deck-host`, `hr-deck-body`).

## Hard parts

1. **The dual-edge sticky clamp (CSS-only vs needs JS).** The requested behavior — the bar parks at the **top** when scrolling down (deck scrolls under) *and* parks at the **bottom** when scrolling up (album scrolls under), never leaving the viewport across the section boundary — is the one thing `position:sticky` does **not** fully cover. A sticky element clamps to the offset(s) you give it only while its **containing block** is in view; it *releases* at the parent's boundaries and does not stay pinned across two sibling sections. Setting both `top:0; bottom:0` on a single sticky element inside one shared scroll flow gets ~80% of the way (it will pin toward whichever edge it's pushed to), but the precise "always-visible, hands-off-at-the-seam" transition across the album→deck boundary typically **needs JS** (a scroll handler that toggles park-top / riding / park-bottom based on the seam's position relative to the viewport). Plan for CSS-first, JS-fallback. (Note an existing `docs/HANDOFF_clamp_fix.md` is untracked on the tree — prior clamp work may inform this.)
2. **De-fixing the deck without losing reachability.** Today the panel pane (`.hr-panel-scroll`, absolute `inset:0`, its own scrollbar) and the deck (fixed) are decoupled. In flow, the deck section needs a height model where the grid pane scrolls *and* the deck rail rides under the seam — without producing nested/competing scrollbars in the continuous flow.
3. **`body:has(.pb)` + the idle (no-video) case.** Removing the lift is required, but the seam only exists while a video plays. Decide idle behavior: album/deck abut directly, or reserve seam space always.
4. **Scroll-snap removal vs. existing UX.** Three sections currently snap (`scroll-snap-type:y mandatory` + per-section `snap-align`). The seam model needs free scroll; confirm losing snap is acceptable (or scope a non-snapping inner scroll container).

## Phased build sequence

**Phase 0 — Prep / cheap wins.** Land the Flag-2 FACTS gate (`railTab !== "facts"` guard) — trivial and independent. *Verify:* facts render once. (Flag-1 collision is left to be dissolved by the reflow rather than stopgapped, unless an interim ship is needed.)

**Phase 1 — Collapse to one scroll flow.** Remove `scroll-snap-type:y mandatory` (`Exhibit.css:9`) and the per-section `snap-align` (`Exhibit.css:28,32`; `HrExhibitFlow.css:36`). Deck and player bar stay fixed for now. *Verify:* page scrolls top→bottom continuously; nothing else moves; no double scrollbars introduced.

**Phase 2 — De-fix the deck.** Move `.hr-deck` into normal flow inside `.hr-section-deck-host`; unwind `S.deck` `position:fixed`/`top:0` (`HrExhibitFlow.jsx:296`), `.hr-deck` `bottom/left` (`:550`), the host `overflow:hidden` (`:54`), and the absolute panel pane (`:59`). *Verify:* deck renders within its section, scrolls with the page, rail still functional; player bar still fixed. **This phase removes the fixed overlay → Flag-1 collision is gone at the root.**

**Phase 3 — Make the bar a single-edge seam.** Relocate `<PlayerBar>` in the DOM between album and deck (`Exhibit.jsx:1053` → between `:1038` and `:1043`); convert `.pb` `position:fixed`→`sticky` with one offset; remove `body:has(.pb) .hr-deck` (`HrExhibitFlow.css:551`). *Verify:* bar sits at the seam and sticks to one edge (e.g. parks at bottom) correctly; deck top tucks under it.

**Phase 4 — Dual-edge clamp.** Add the second edge: try CSS-only (`top:0; bottom:0` within the shared flow). If it can't hold both edges across the seam, add a minimal JS scroll handler to toggle park-top ↔ riding ↔ park-bottom. *Verify:* both scroll directions; album scrolls under from below, deck scrolls under from above; bar never leaves the viewport; deck rail top rides under the bar.

**Phase 5 — Idle + mobile + polish.** Decide/implement no-video behavior (`.pb` absent → seam absent): abut vs. reserved space. Mobile pass (`Exhibit.css:191-206`, `HrExhibitFlow.css:1200,1208`; rail already `display:none` ≤720px). Revisit `.ex-root` 64px bottom pad. *Verify:* idle layout, mobile layout, no regressions; confirm Flag-1 collision and Flag-2 duplicate are both gone.

---

*Analysis only — no source files were edited, no commits or reverts were made. All line references are against working tree `8ce53e0` + the uncommitted top-rail build.*
