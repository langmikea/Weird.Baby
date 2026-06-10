# HANDOFF — top-rail → tracklist/video block grouping — SCOPE & PRE-ANALYSIS (READ-ONLY)

**Pass type:** Read-only first pass. **Zero edits to `src/`.** This file (+ a stamped `_cowork/` copy) is the only deliverable.
**Generated:** 2026-06-10 (stamp `20260610T130345Z`) · **Mode:** READ-ONLY map for Mike's review. No source modified. No recommendations applied.
**Purpose:** Map how the top exhibit block (tracklist + video/PUV) is structured, and scope what it takes to anchor a tab rail to that *block* instead of the *viewport*. Patching deferred to a later pass.

Truth ranking honored (OPERATIONS §6): live tree > git log > STATE.md > handoffs.

---

## 0. Git state

```
$ git rev-parse --short HEAD
10bfd5a

$ git rev-parse --abbrev-ref HEAD
main

$ git rev-parse --short origin/main
10bfd5a

HEAD == origin/main ?  YES (working tree sits at the pushed tip)

$ git status -s
 M CLAUDE.md
 M docs/SCOPE-token-mirror.md
 M docs/canonical/OPERATIONS.md
 M src/routes/hr/HrExhibitFlow.jsx
?? docs/HANDOFF_clamp_fix.md
?? docs/HANDOFF_leftrail_applied.md
?? docs/HANDOFF_phase1_deckrail_grab.md
?? docs/HANDOFF_relayout_scope.md
?? docs/SCOPE-tabs-leftrail-extract.md
```

**`src/` confirmation:** the *only* dirty path under `src/` is `src/routes/hr/HrExhibitFlow.jsx` — matches the brief's expectation ("dirty from the deck-rail work"). `git ls-files --others --exclude-standard src/` is empty (no untracked source). Everything else dirty is **outside `src/`** (`CLAUDE.md`, two `docs/` files, five untracked `docs/` handoffs) — flagged so the tree being dirtier than "just the jsx" isn't a surprise; none touch the block or the rail.

> ⚠️ **BLOCKER-LEVEL FINDING — the dirty `HrExhibitFlow.jsx` is mid-edit and does not currently compile.** Its working-tree diff (below) shows the closing `*/}`, `</section>`, `);`, and component `}` were removed; the file now ends on an unterminated comment:
> ```
> {/* O12 ΓÇö AuditStrip removed: was a dev-only fixed-bottom-right pill at
>     z-index 9999
> ```
> The committed tip (`10bfd5a`) is intact; this is **uncommitted in-progress "rotate/equal-fill" work** (see `HANDOFF_phase1_deckrail_grab.md`). **Any rail work must start from a compiling tree** — either finish/close that edit or stash it first. This is not a defect to "fix" here (read-only pass), but it gates the next implementation pass.

### Working-tree diff of `HrExhibitFlow.jsx` (for context — not part of this task's edits)

```diff
@@ S.tab (HrExhibitFlow.jsx ~327) @@
-      width: TAB_STRIP_H + "px", height: "auto",
+      writingMode: "vertical-rl", textOrientation: "mixed",
+      width: "auto", minWidth: TAB_STRIP_H + "px", height: "auto",
       ...
-      padding: "0 6px", boxSizing: "border-box",
-      flexShrink: 0, marginBottom: "2px",
+      padding: "6px 0", boxSizing: "border-box",
+      ...(isClose ? { flexShrink: 0 } : { flex: "1 1 0", flexShrink: 1 }), marginBottom: "2px",

@@ component tail (HrExhibitFlow.jsx ~3644) @@
-          z-index 9999 that occluded the player bar's right-side controls.
-          The AuditStrip function is kept above for easy revival. */}
-    </section>
-  );
-}
+          z-index 9999          ← FILE TRUNCATES HERE, no close
```

---

## 1. TERMINOLOGY RECONCILIATION — read this before the answers

The brief names **two** rails: a **"TOP rail"** (to be grouped into the tracklist/video block) and a **"bottom deck rail"** (window-anchored/sliding, "correct as-is"). **The live tree contains exactly ONE tab-rail system**, the *deck rail* in `HrExhibitFlow.jsx`:

`.hr-deck` (`position:fixed`, viewport-anchored, **left-docked**, slides via `transition:left`) → contains `.hr-tab-strip` (the vertical tab column) + `.hr-deck-body` (the panel that opens to the right).

There is **no separate "top rail" element** in the code today. The lineage explains why (`HANDOFF_relayout_scope.md` → `HANDOFF_leftrail_applied.md` → `HANDOFF_clamp_fix.md` → in-progress rotate): the deck's tabs were **just migrated from a bottom horizontal dock to a left vertical rail**. So the only thing currently `position:fixed`/viewport-anchored *is* the deck rail.

That forces a fork the implementation pass must resolve **with Mike** before touching code:

- **Reading A (recommended) — "top rail" is NEW; deck rail is untouched.** Build a tab rail as the left edge of the `.ex-main-inner` block, *separate* from the deck rail. The deck rail (`.hr-deck`) keeps its fixed/sliding behavior verbatim — directly satisfying "the bottom deck rail must remain window-anchored/sliding." Under this reading, Q2's "current top rail" has **no existing referent** — nothing is un-stuck; a block-anchored rail is added.
- **Reading B — "top rail" IS the deck rail's tab strip, relocated.** Peel `.hr-tab-strip` out of the fixed `.hr-deck` and re-anchor it to the block, while `.hr-deck-body` keeps sliding. This **splits a currently-unified, nested element** (the strip drives the body's peek/open) and is structurally heavy; it also risks the very "don't-disturb-the-deck-rail" constraint in Q5.

The answers below are written for **Reading A** (it is the only reading that keeps the deck rail "correct as-is" per Q5), with Reading-B deltas noted where they differ. **Confirm the reading before implementation.**

---

## 2. VERBATIM GRABS

### 2a. `src/routes/exhibit/Exhibit.jsx` — the block container, columns, and the `<ExhibitFlow>` seam

The tracklist+video block is `.ex-main` → `.ex-main-inner` (a 3-column CSS grid). `TrackList` mounts in the left cell (`.ex-left`); the video/PUV/facts live in the right cell (`.ex-right`); the `<ExhibitFlow>` mount is a **sibling that follows the block**, not a child of it.

```jsx
867	  return (
868	    <>
869	      <div className={`ex-root${visible?" visible":""}`}>
870	
871	        {/* NAV */}
872	        <div className="ex-nav">
873	          <button className="ex-nav-logo" onClick={() => navigate(`/shop?from=${artist.shopExitParam}`)}>Weird.Baby</button>
874	          <div className="ex-nav-sub">{artist.name}</div>
875	          <button className="ex-nav-return" onClick={() => navigate(`/shop?from=${artist.shopExitParam}`)}>Gift Shop</button>
876	        </div>
877	
878	        {/* CAROUSEL */}
879	        <Coverflow
880	          spine={SPINE}
881	          active={active} cfH={cfH}
882	          onSelect={i => selectAlbum(i,false)}
883	          onSelectClick={i => selectAlbum(i,true)}
884	        />
885	
886	        {/* CAROUSEL HEIGHT DRAG */}
887	        <div className="cf-dh" onPointerDown={makeCfDrag}>
888	          <div className="cf-dh-line" />
889	          <div className="cf-dh-dot" />
890	          <div className="cf-dh-line" />
891	        </div>
892	
893	        {/* MAIN TWO-COLUMN AREA */}
894	        <div className="ex-main ex-snap">
895	          <div className="ex-main-inner" ref={bodyRef}
896	            style={{ gridTemplateColumns: `${split}fr 10px ${100-split}fr` }}>
897	
898	            {/* LEFT — tracklist */}
899	            <div className="ex-left">
900	              <TrackList
901	                album={album}
902	                playingTrackIdx={playingAlbum === activeDisplay ? playingTrack : null}
903	                activeTrack={activeTrack}
904	                selectedVis={selVis}
905	                onSelect={ti => handleTrackSelect(activeDisplay, ti)}
906	                onTagClick={(ti, vi) => handleTagClick(activeDisplay, ti, vi)}
907	              />
908	            </div>
909	
910	            {/* VERTICAL DRAG HANDLE */}
911	            <div className="vr-dh" onPointerDown={e => makeSplitDrag(e, bodyRef)}>
912	              <div className="vr-dh-line" />
913	            </div>
914	
915	            {/* RIGHT — permanent video + facts */}
916	            <div className="ex-right">
917	              {/* VIDEO AREA */}
918	              <div className="vp-area">
919	                <div className="vp-inner">
920	                  <div ref={ytDivRef} className="yt-player" />
921	                  … (audio-only overlay 925–943, thumbnail overlay 946–966,
922	                     empty-state 967–973 — omitted for length; inside .vp-inner)
923	                </div>
924	              </div>
925	
926	              {/* FACTS */}
927	              <FactScroller
978	                facts={FACTS}
979	                albumId={album.id}
980	                trackTitle={activeTrack !== null ? album.tracks[activeTrack]?.title : null}
981	                accent={album.accent}
982	              />
983	            </div>
984	
985	          </div>           {/* /.ex-main-inner */}
986	        </div>             {/* /.ex-main      */}
987	
988	        {/* EXHIBIT FLOW — optional, only rendered if artist provides one. */}
992	        {ExhibitFlow && (
993	          <ExhibitFlow
994	            activeAlbumId={album.id}
995	            playingTrack={playingTrackIds}
996	            onRestorePlayer={restorePlayerFromPreset}
997	            shuffle={shuffle} setShuffle={setShuffle}
998	            loop={loop} setLoop={setLoop}
999	          />
1000	        )}
1001	
1002	        <PlayerBar
1003	          video={curVideo} track={curTrack} album={curAlbum}
1004	          … />
1011	      </div>           {/* /.ex-root */}
1012	    </>
1013	  );
1014	}
```

> Note: lines 921–922 and 926 collapse the omitted right-pane overlay markup (verbatim spans `Exhibit.jsx:920–973`); `FactScroller` is the real next sibling after `.vp-area` inside `.ex-right`. The grid's left-column width is the `split` state, written inline at line 896.

**Box-defining JSX:** the only box rule in the JSX is the **inline grid template** at `Exhibit.jsx:896` (`gridTemplateColumns: ${split}fr 10px ${100-split}fr`). No `position` is set in JSX on the block; all positioning is in CSS (2b).

### 2b. `src/routes/exhibit/Exhibit.css` — block container, columns, height, and the player bar

```css
9    html,body{background:var(--hr-bg);color:var(--hr-gold);min-height:100vh;overflow-x:clip;scroll-snap-type:y mandatory;scroll-behavior:smooth}

12   .ex-root{opacity:0;transition:opacity .8s ease;display:flex;flex-direction:column;min-height:100vh;padding:0 8px 64px}
28   .ex-snap{scroll-snap-align:center}

66   .ex-main{display:grid;flex:1;border-top:1px solid var(--hr-border);position:relative;overflow:hidden}
67   .ex-main-inner{display:grid;height:100%}

70   .ex-left{overflow-y:auto;overflow-x:hidden;border-right:1px solid var(--hr-border);scrollbar-width:thin;scrollbar-color:var(--hr-border-hi) transparent}
71   .ex-left::-webkit-scrollbar{width:3px}
72   .ex-left::-webkit-scrollbar-track{background:transparent}
73   .ex-left::-webkit-scrollbar-thumb{background:var(--hr-border-hi);border-radius:2px}

76   .vr-dh{width:10px;cursor:col-resize;display:flex;align-items:stretch;justify-content:center;position:relative;z-index:10}
77   .vr-dh-line{width:1px;background:var(--hr-border);transition:background .2s;margin:auto}
78   .vr-dh:hover .vr-dh-line{background:color-mix(in srgb, var(--hr-gold) 33%, transparent)}

81   .ex-right{display:flex;flex-direction:column;background:#e7e3d8;overflow:hidden}

108  .vp-area{position:relative;width:100%;background:var(--hr-ink-card);border:1px solid var(--hr-border-hi);flex-shrink:0}
109  .vp-area::before{content:"";display:block;padding-top:56.25%}   /* 16:9 aspect spacer */
110  .vp-inner{position:absolute;inset:0}

152  .pb{ … position:fixed;bottom:0;left:0;right:0;height:60px; … z-index:100; … }   /* player bar — viewport-fixed */

/* mobile fallback */
172  .ex-main-inner{grid-template-columns:1fr !important}
173  .vr-dh{display:none}
174  .ex-right{border-top:1px solid var(--hr-border)}
```

### 2c. `src/routes/hr/HrExhibitFlow.jsx` / `.css` — the (only) rail, for Q2/Q3/Q5

Style builders (JS half of the split-brain geometry):

```jsx
284  panelPos: (deckW) => ({
285    position: "absolute", right: 0, top: 0, bottom: 0, left: deckW + "px",
286  }),

290  deck: (deckW) => ({
291    /* `position: fixed` so the deck pins to the viewport … */
296    position: "fixed", top: 0,
297    width: deckW + "px",
298    background: "transparent",
299    zIndex: 10,
300    pointerEvents: "none",
310    overflow: "hidden",
311  }),

316  tab: (active, deckOpen, width, isClose) => { … writingMode:"vertical-rl" (dirty);
                                                   border w/ borderLeft:"none";
                                                   flex "1 1 0" per-tab (dirty) … },

341  // resizeHandle: ew-resize affordance at right edge of the rail body.
342  resizeHandle: (hovered) => ({ position:"absolute", right:"-4px", top:0, bottom:0, width:"8px", cursor:"ew-resize", zIndex:14, … }),
```

Render (DOM):

```jsx
3469  return (
3470    <section className="hr-section">
        … overlays + mobile fallbacks …
3520    <div className="hr-section-deck-host">
3521      <div className={"animated " + …} style={{ ...S.panelPos(deckW), position:"absolute" }} …>  {/* artifact-grid pane */}
3525        <P3Panel … />
3537      </div>
3539      <div className={"hr-deck " + animClass} style={S.deck(deckW)} …>
3541        <div className="hr-tab-strip" onMouseEnter=…(peek) onMouseLeave=…>
3545          {TABS.filter(t => t.key !== "journal").map(t => ( <div style={S.tab(...)} onClick={handleTabClick}/> ))}
3587          {open && ( <div … onClick={() => setActiveTab(null)} style={S.tab(false,open,34,true)}>◂</div> )}
3599        </div>
3601        {open && currentTab && (
3602          <div className="hr-deck-body"> … resizeHandle + TierContent/DeepTracks/Journal/Presets … </div>
3642        )}
3539-3643  </div>  {/* /.hr-deck */}
3644    </div>    {/* /.hr-section-deck-host */}
        </section>   ← (THIS CLOSE IS CURRENTLY MISSING in the dirty tree — see §0)
```

CSS half (anchoring + height):

```css
50   .hr-section-deck-host { position:relative; flex:1; min-height:calc(100vh - 64px); overflow:hidden; }

550  .hr-deck { bottom:0; left:0; transition:left 0.18s ease; }
551  body:has(.pb) .hr-deck { bottom:60px; }                /* rides above the player bar */

554  .hr-tab-strip { position:absolute; left:0; top:12px; bottom:12px; width:30px;
                     display:flex; flex-direction:column; align-items:flex-end; pointer-events:auto; z-index:12; }

593  .hr-deck-body { position:absolute; left:30px; top:0; right:0; bottom:0;
                     background:#e7e3d8; border-left:1px solid var(--hr-gold-lo); … overflow:hidden; }
```

So `.hr-deck` = `position:fixed` (JS) + `left:0; bottom:0` (CSS) + inline `top:0; width:deckW` → a **left-docked, full-height, viewport-fixed** strip whose width swings (`deckW` = `TAB_PEEK`/`TAB_STRIP_H`/open width) and whose dock slides via `transition:left`. **This is the brief's "bottom deck rail." It is the only fixed rail in the tree.**

---

## 3. THE FIVE ANSWERS

### Q1 — Grouping: flex/grid child vs. relative wrapper?

**Recommend (a): add the rail as a grid child inside the existing block container (`.ex-main-inner`), as a new leading column.** Reason, grounded in the live structure: `.ex-main-inner` (`Exhibit.jsx:896`, `Exhibit.css:67`) is *already* a CSS grid whose track list is an inline template string — `gridTemplateColumns: ${split}fr 10px ${100-split}fr`. Adding a fixed-width rail column is a one-token change to that template (e.g. `RAILpx ${split}fr 10px ${100-split}fr`) plus one new first child before `.ex-left`. The rail then **is** the block's left edge by construction, shares the block's height automatically (grid rows stretch — see Q4), and needs no separate stacking context. It also rides the block's existing `overflow:hidden` clip (`.ex-main:66`) and the `.ex-snap` scroll-snap.

Option (b) (a `position:relative` wrapper + an absolutely-positioned rail) is **not** preferred here: the block already establishes a clean grid box and a positioning context (`.ex-main{position:relative}` at line 66 already exists), so absolute-positioning would duplicate geometry the grid gives for free, would not participate in `split` width math, and would have to manually track the block's height instead of stretching to it. Use (b) only if the rail must visually overlap the columns rather than reserve its own width.

> Reading-B delta: if the rail is the *relocated deck strip*, (a) still holds for the destination, but you additionally pay the cost of detaching `.hr-tab-strip` from `.hr-deck` across the file/component seam (Q3).

### Q2 — Un-sticking: where is it viewport-anchored, and what changes?

**The only viewport-anchored rail is the deck rail.** Its anchor is split across two files (the repo's documented "split-brain geometry"):
- JS: `S.deck` (`HrExhibitFlow.jsx:296–297`) — `position:"fixed"; top:0; width:deckW`.
- CSS: `.hr-deck` (`HrExhibitFlow.css:550–551`) — `bottom:0; left:0; transition:left …`; `body:has(.pb){bottom:60px}`.

To detach a rail from the window and bind it to the block you must remove **all** of: `position:fixed`, the viewport-edge offsets (`top/bottom/left`), the `:has(.pb)` bottom compensation, and the `transition:left` slide — and instead let it be sized/placed by the block (grid column, per Q1). For **Reading A** there is nothing to un-stick: you create a block-anchored rail and never give it `position:fixed`. For **Reading B** you would strip the above from `.hr-deck`/`.hr-tab-strip` — but note that doing so **is** disturbing the deck rail Q5 says to leave alone, which is the core tension of Reading B.

### Q3 — Seam: does the rail move files? What crosses `<ExhibitFlow>`?

**The block lives in `Exhibit.jsx`; the rail's tab machinery lives in `HrExhibitFlow.jsx`.** They meet only at the `<ExhibitFlow>` props seam (`Exhibit.jsx:992–1000`), which today passes `activeAlbumId`, `playingTrack` (= `playingTrackIds`), `onRestorePlayer`, `shuffle/setShuffle`, `loop/setLoop`. The rail's state (`activeTab`/`setActiveTab` :3274, `open` :3419, `handleTabClick` :3425, `TABS` :180, the `S.tab` chrome, and every tab body — `TierContent`/`DeepTracksContent`/`JournalContent`/`PresetsContent`) is entirely **inside `HrExhibitFlow`**.

- **Reading A (recommended):** the rail does **not** need to move files in the sense of relocating tab *logic*. The cleanest path keeps tab state + bodies in `HrExhibitFlow` and **lifts only the rail's DOM placement** so it renders into the block. Practically that means either (i) Exhibit renders the rail column and `HrExhibitFlow` portals/receives the tab UI into it, or (ii) the rail's presentational strip is extracted to a small shared component imported by both. Either way, what must newly cross the seam is **the visual rail placement + whatever selection/tab state the block needs to co-locate** — additive props on the existing `<ExhibitFlow>` seam, the same prop-widening mechanism presets already use.
- **Reading B:** moving `.hr-tab-strip` itself into the block means physically relocating render code from `HrExhibitFlow.jsx:3541–3599` into `Exhibit.jsx`, and then wiring `activeTab`/`handleTabClick`/`TABS` back across the seam (lifting that state up to `Exhibit`, or passing handlers down). Heavier, and it crosses the 16KB surgical-edit boundary in `HrExhibitFlow.jsx` (OPERATIONS §8).

**Net:** prefer keeping tab logic in `HrExhibitFlow` and only widening the seam to place the rail — no logic migration required under Reading A.

### Q4 — Block height: what establishes it?

**Content-/flex-driven, not fixed.** The chain: `.ex-root` is a `flex column; min-height:100vh` (`Exhibit.css:12`); inside it `.ex-main` has `flex:1` (line 66), so it **absorbs the leftover viewport height** after `.ex-nav`, `Coverflow`, and `.cf-dh`. `.ex-main-inner` is `height:100%` of that (line 67). The columns then stretch to that height (grid default `align-items:stretch`), and `.ex-left` scrolls internally (`overflow-y:auto`, line 70) while `.ex-right` is a flex column with a fixed-aspect video (`.vp-area` 16:9 spacer, line 109) above `FactScroller`.

**Consequence for a grouped rail:** because it is a grid child of `.ex-main-inner`, a rail column **fills the block height automatically** — no explicit height needed, and it tracks viewport resize through the same `flex:1` chain. (Contrast the deck rail, which fakes this with `position:fixed; top:0; bottom:0`.) If the rail instead needs to match only the *scrolling* tracklist area rather than the full block, scope that against `.ex-left`'s independent scroll.

### Q5 — Don't-break: confirm the bottom deck rail stays window-anchored/sliding

**Confirmable under Reading A; conditional under Reading B.**
- **Reading A:** the proposed change touches `Exhibit.jsx`/`Exhibit.css` (the block grid) and at most adds props on the `<ExhibitFlow>` seam. It does **not** touch `.hr-deck`/`.hr-tab-strip`/`.hr-deck-body`, `S.deck`/`S.panelPos`, the `transition:left` slide, the peek/open/resize model, or the `:has(.pb){bottom:60px}` player-bar compensation. The deck rail therefore remains `position:fixed`, left-docked, and sliding — **correct as-is, undisturbed.** Two adjacency watch-items (not breakage): both the deck rail and the new block rail would live on the same left edge, so verify they don't visually collide or double-up; and both paint from the shared token mirror (`HrExhibitFlow.jsx:109–122` vs `museum-tokens.css`) — any restyle must respect that manual mirror (OPERATIONS / `SCOPE-token-mirror.md`).
- **Reading B:** because it edits `.hr-deck`/`.hr-tab-strip` directly, it **cannot** be guaranteed non-disturbing — it is, by definition, re-architecting the deck rail. If Mike wants the deck rail "correct as-is," Reading B is self-contradictory and Reading A should be chosen.

---

## 4. PROPOSED STRUCTURAL APPROACH (unapplied — for Mike's review)

**Precondition:** start from a compiling tree (finish or stash the mid-edit `HrExhibitFlow.jsx` truncation, §0).

**Recommended shape (Reading A, grouping option (a)):**

1. **Block grid gains a leading rail column.** In `Exhibit.jsx:896`, widen the inline template from `${split}fr 10px ${100-split}fr` to lead with a fixed rail track (e.g. `var(--ex-rail-w) ${split}fr 10px ${100-split}fr`), and render a new first child `<div className="ex-rail">…</div>` before `.ex-left` (`:899`). The rail is now the block's left edge, full-block-height by grid stretch (Q4), inside the existing `overflow:hidden`/snap context.
2. **Rail content stays sourced from `HrExhibitFlow`.** Keep `activeTab`/`TABS`/tab bodies where they are; surface the rail UI into `.ex-rail` via a portal target or a small shared strip component, wiring tab state through additive props on the existing `<ExhibitFlow>` seam (same prop-widening presets already use). No tab logic migrates files (Q3).
3. **Leave the deck rail untouched.** No edits to `.hr-deck`/`.hr-tab-strip`/`.hr-deck-body`, `S.deck`, the slide, peek/open/resize, or the `:has(.pb)` offset (Q5).
4. **Height:** rely on the `flex:1` → `height:100%` → grid-stretch chain (Q4); no explicit rail height. Decide whether the rail spans the **full block** or only the **scrolling `.ex-left`** region and scope accordingly.
5. **Tokens:** if the rail restyles, honor the JS↔CSS token mirror (no auto-propagation).

**Edit surface (Reading A):** mostly `Exhibit.jsx` (grid template :896, new child near :899) + `Exhibit.css` (`.ex-main-inner` :67 / new `.ex-rail` rule, plus the mobile `1fr !important` override at :172) + additive props on the seam (`Exhibit.jsx:992` / `HrExhibitFlow` signature). This keeps the heavy, past-16KB `HrExhibitFlow.jsx` edits minimal (props only), avoiding the surgical-truncation hazard.

**If Mike intends Reading B** (relocate the actual deck tab strip into the block): expect lockstep JS+CSS edits in `HrExhibitFlow.jsx`/`.css`, render-code migration across the file boundary, state-lifting across the seam, all past the 16KB surgical boundary — and an explicit re-decision on Q5, since the deck rail would necessarily change.

---

## 5. Open items for Mike (decisions before implementation)

1. **Confirm the rail reading (A vs B).** A = new block rail, deck rail untouched (recommended, satisfies Q5). B = relocate the deck strip (heavier, contradicts "deck rail correct as-is").
2. **Finish or stash the mid-edit `HrExhibitFlow.jsx`** so the tree compiles before any rail pass (§0).
3. **Rail span:** full `.ex-main-inner` height, or only the scrolling `.ex-left` region (Q4).
4. **Same-edge coexistence:** the deck rail is left-docked too — confirm the new block rail and the deck rail aren't meant to be the same thing, and won't visually collide.

---

*Read-only pass. No source modified. Deliverable = this file; stamped copy at `_cowork/HANDOFF_toprail_group_scope_20260610T130345Z.md`. Commit/push is Mike's host-side step (OPERATIONS §1).*
