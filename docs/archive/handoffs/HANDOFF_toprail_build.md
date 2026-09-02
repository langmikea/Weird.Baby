# HANDOFF — TOP tab rail grouped into the tracklist/video block — BUILD (WRITE, verified, NOT committed)

**Pass type:** WRITE + build-verify. **No commit, no push, no deploy.**
**Base:** `8ce53e0` (== origin/main at start). **Reading:** A (new block rail; deck rail untouched), grouping **option (a)** — rail is a new leading grid column of `.ex-main-inner`, per `docs/HANDOFF_toprail_group_scope.md`.
**Result:** Compiles. `npx vite build` → **exit 0** (worker env + client env, 46 modules). Files dirty under `src/`: only `Exhibit.jsx` + `Exhibit.css`. Deck rail (`.hr-deck` / `HrExhibitFlow`) **not touched**.

---

## 0. Git state (start + end)

```
$ git rev-parse --short HEAD
8ce53e0
HEAD == origin/main ?  YES (verified at start)

src/ dirty at start: (clean — none)   ← brief gate satisfied, proceeded
```

> Note vs. the scope doc: that read-only pass ran at `10bfd5a` with `HrExhibitFlow.jsx` mid-edit and **not compiling** (the rotate/equal-fill truncation). That work has since been finished and committed — at `8ce53e0` the deck tabs already carry `writing-mode:vertical-rl`, rounded right edge, and `flex:1 1 0`, and the file closes cleanly. So the "start from a compiling tree" precondition was already met; nothing had to be stashed.

---

## 1. What was built

A new vertical tab rail (`.ex-rail`) added as the **leading column of `.ex-main-inner`** — part of the block, sized by grid stretch (full block height via the existing `flex:1 → height:100% → grid stretch` chain), never `position:fixed`. Three tabs — **TRACKS · PRESETS · FACTS** — split the block height equally (`flex:1 1 0`, same model as the deck rail), labels rotated top-to-bottom (`writing-mode:vertical-rl`), rounded corners on the right (open) edge, INK/GOLD chrome mirrored from the deck rail's `S.tab` via the shared museum tokens.

Clicking a tab swaps what fills the **content column** (`.ex-left`); the right-hand video/PUV region (`.ex-right`) is untouched and stays put:

| Tab | Content column shows | Source | Crosses `<ExhibitFlow>` seam? |
|-----|----------------------|--------|-------------------------------|
| TRACKS (default) | track rows | `<TrackList>` — already in `Exhibit.jsx` | No |
| FACTS | the facts list | `<FactScroller>` — already in `Exhibit.jsx` | No |
| PRESETS | placeholder panel (`.ex-presets-panel`) | local | No |

### Decision record (PRESETS sourcing)

Mike delegated the Ops call ("If Ops, decide"). Per the guardrail *"if tab state/content must cross the `<ExhibitFlow>` seam, keep it minimal and document what crosses,"* PRESETS ships this pass as a clean, on-brand **placeholder** rather than lifting the real preset machine. The live preset cards (`PresetsContent`, `HrExhibitFlow.jsx:2595`) are wired deep into the deck's own state — `userPresets`/`selected`/`makePresetSnapshot`/`/api/presets`/factory presets — so rendering functional presets in the block would mean lifting that state across the seam and editing past the 16 KB surgical boundary in `HrExhibitFlow.jsx`: exactly the heavy/risky path the scope doc and guardrails steer away from. **Net: nothing crosses the seam this pass.** Full preset wiring is a deliberate follow-up (see §6).

**Human/UX consequence Mike should know:** clicking PRESETS today shows a short "wired in a later pass; for now available from the deck rail" note, not live cards. TRACKS and FACTS are fully live.

---

## 2. Files changed

Only two files, both under `src/routes/exhibit/`. Unified diff:

```diff
diff --git a/src/routes/exhibit/Exhibit.css b/src/routes/exhibit/Exhibit.css
index 47f61d0..26cb6ac 100644
--- a/src/routes/exhibit/Exhibit.css
+++ b/src/routes/exhibit/Exhibit.css
@@ -64,7 +64,29 @@ html,body{background:var(--hr-bg);color:var(--hr-gold);min-height:100vh;overflow
 
 /* MAIN TWO-COLUMN BODY */
 .ex-main{display:grid;flex:1;border-top:1px solid var(--hr-border);position:relative;overflow:hidden}
-.ex-main-inner{display:grid;height:100%}
+.ex-main-inner{display:grid;height:100%;--ex-rail-w:34px}
+
+/* TOP TAB RAIL — leading column of the block. Sibling of the deck rail in
+   HrExhibitFlow; chrome mirrors it (INK/GOLD tokens, vertical-rl labels,
+   rounded open edge facing the content, equal flex:1 1 0 fill). Part of the
+   block: inherits its height via grid stretch, never position:fixed. The
+   deck rail (.hr-deck) is NOT touched. */
+.ex-rail{display:flex;flex-direction:column;gap:2px;padding:12px 0;overflow:hidden;min-height:0}
+.ex-rail-tab{flex:1 1 0;min-height:0;writing-mode:vertical-rl;text-orientation:mixed;
+  display:flex;align-items:center;justify-content:center;
+  font-family:'Geist',system-ui,-apple-system,sans-serif;
+  font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;font-weight:500;
+  color:var(--hr-dim);background:var(--hr-ink);
+  border:1px solid var(--hr-gold-lo);border-left:none;
+  border-top-right-radius:6px;border-bottom-right-radius:6px;
+  cursor:pointer;padding:6px 0;white-space:nowrap;
+  transition:border-color .12s,color .12s,font-weight .12s,background .12s}
+.ex-rail-tab-active{color:var(--hr-gold-hi);background:var(--hr-ink-soft);border-color:var(--hr-gold-hi);font-weight:900}
+
+/* PRESETS placeholder panel (content wiring deferred — see handoff) */
+.ex-presets-panel{padding:24px 20px;display:flex;flex-direction:column;gap:10px}
+.ex-pp-title{font-family:'DM Serif Display',Georgia,serif;font-size:1.1rem;color:var(--hr-gold)}
+.ex-pp-note{font-family:'Courier Prime',monospace;font-size:.74rem;line-height:1.7;color:var(--hr-gold-lo);max-width:34ch}
 
 /* LEFT — scrollable tracklist */
 .ex-left{overflow-y:auto;overflow-x:hidden;border-right:1px solid var(--hr-border);scrollbar-width:thin;scrollbar-color:var(--hr-border-hi) transparent}
@@ -170,6 +192,10 @@ html,body{background:var(--hr-bg);color:var(--hr-gold);min-height:100vh;overflow
   .ex-nav{padding:16px 16px 0}
   .cf-dh{padding:0 16px}
   .ex-main-inner{grid-template-columns:1fr !important}
+  /* Rail is a desktop affordance; on the stacked mobile layout the content
+     column isn't split, so hide it (deck rail / mobile presets surface are
+     unaffected). */
+  .ex-rail{display:none}
   .vr-dh{display:none}
   .ex-right{border-top:1px solid var(--hr-border)}
   .pb{padding:0 12px}
diff --git a/src/routes/exhibit/Exhibit.jsx b/src/routes/exhibit/Exhibit.jsx
index f663db0..7780552 100644
--- a/src/routes/exhibit/Exhibit.jsx
+++ b/src/routes/exhibit/Exhibit.jsx
@@ -858,6 +858,21 @@ export default function Exhibit({ artist }) {
   }
 
   const bodyRef = useRef(null);
+
+  // ── TOP TAB RAIL ────────────────────────────────────────────
+  // Leading column of the .ex-main-inner block (a sibling of the deck rail in
+  // HrExhibitFlow — NOT the deck rail). It swaps what fills the content column
+  // (.ex-left). Default "tracks" preserves the prior tracklist-on-mount view.
+  // TRACKS + FACTS reuse in-file components (TrackList / FactScroller) — zero
+  // state crosses the <ExhibitFlow> seam. PRESETS is a placeholder this pass;
+  // the live preset cards live in HrExhibitFlow's deck scope (see handoff).
+  const RAIL_TABS = [
+    { key: "tracks",  label: "TRACKS"  },
+    { key: "presets", label: "PRESETS" },
+    { key: "facts",   label: "FACTS"   },
+  ];
+  const [railTab, setRailTab] = useState("tracks");
+
   const canSkipBack    = playingTrack !== null;
   // O9: with Loop on, skip-forward at the end of the queue refills from the
   // selection (advanceQueue handles it), so the control stays live.
@@ -893,18 +908,54 @@ export default function Exhibit({ artist }) {
         {/* MAIN TWO-COLUMN AREA */}
         <div className="ex-main ex-snap">
           <div className="ex-main-inner" ref={bodyRef}
-            style={{ gridTemplateColumns: `${split}fr 10px ${100-split}fr` }}>
+            style={{ gridTemplateColumns: `var(--ex-rail-w) ${split}fr 10px ${100-split}fr` }}>
+
+            {/* TOP TAB RAIL — leading column; swaps the content column below.
+                Mirrors the deck rail's chrome (INK/GOLD, vertical labels,
+                rounded open edge, equal flex fill) so the two read as
+                siblings, but is part of THIS block (no position:fixed). */}
+            <div className="ex-rail" role="tablist" aria-orientation="vertical" aria-label="Content view">
+              {RAIL_TABS.map(t => (
+                <button
+                  key={t.key}
+                  type="button"
+                  role="tab"
+                  aria-selected={railTab === t.key}
+                  className={`ex-rail-tab${railTab === t.key ? " ex-rail-tab-active" : ""}`}
+                  onClick={() => setRailTab(t.key)}
+                >{t.label}</button>
+              ))}
+            </div>
 
-            {/* LEFT — tracklist */}
+            {/* LEFT — content column (swapped by the rail) */}
             <div className="ex-left">
-              <TrackList
-                album={album}
-                playingTrackIdx={playingAlbum === activeDisplay ? playingTrack : null}
-                activeTrack={activeTrack}
-                selectedVis={selVis}
-                onSelect={ti => handleTrackSelect(activeDisplay, ti)}
-                onTagClick={(ti, vi) => handleTagClick(activeDisplay, ti, vi)}
-              />
+              {railTab === "tracks" && (
+                <TrackList
+                  album={album}
+                  playingTrackIdx={playingAlbum === activeDisplay ? playingTrack : null}
+                  activeTrack={activeTrack}
+                  selectedVis={selVis}
+                  onSelect={ti => handleTrackSelect(activeDisplay, ti)}
+                  onTagClick={(ti, vi) => handleTagClick(activeDisplay, ti, vi)}
+                />
+              )}
+              {railTab === "presets" && (
+                <div className="ex-presets-panel">
+                  <div className="ex-pp-title">Presets</div>
+                  <div className="ex-pp-note">
+                    Saved mixes &amp; factory presets are wired into this panel in a
+                    later pass. For now they remain available from the deck rail.
+                  </div>
+                </div>
+              )}
+              {railTab === "facts" && (
+                <FactScroller
+                  facts={FACTS}
+                  albumId={album.id}
+                  trackTitle={activeTrack !== null ? album.tracks[activeTrack]?.title : null}
+                  accent={album.accent}
+                />
+              )}
             </div>
 
             {/* VERTICAL DRAG HANDLE */}
```

### 2a. Grid-template change (explicit)

`Exhibit.jsx` — the inline template on `.ex-main-inner` gains a fixed leading rail track:

```
- gridTemplateColumns: `${split}fr 10px ${100-split}fr`
+ gridTemplateColumns: `var(--ex-rail-w) ${split}fr 10px ${100-split}fr`
```

`--ex-rail-w: 34px` is defined on `.ex-main-inner` in `Exhibit.css`. The rail `<div className="ex-rail">` is the new **first child** of `.ex-main-inner` (before `.ex-left`), so it maps to column 1; `.ex-left` / `.vr-dh` / `.ex-right` shift to columns 2/3/4. On mobile (`max-width:720px`) the existing `grid-template-columns:1fr !important` override still collapses the grid and the rail is set `display:none`, so the stacked mobile layout (and the mobile presets surface) are unchanged.

### 2b. What crosses the `<ExhibitFlow>` seam

**Nothing.** Tab state (`railTab`/`setRailTab`) lives entirely in `Exhibit`. TRACKS and FACTS reuse components already defined in `Exhibit.jsx` (`TrackList`, `FactScroller`). No props were added to the `<ExhibitFlow>` call; `HrExhibitFlow.jsx`/`.css` are unmodified.

### 2c. Deck rail untouched (verification)

```
$ git diff --stat -- src/routes/hr/
(no output — zero changes under src/routes/hr/)
```

`.hr-deck`, `.hr-tab-strip`, `.hr-deck-body`, `S.deck`/`S.panelPos`, the `transition:left` slide, peek/open/resize, and the `:has(.pb){bottom:60px}` player-bar offset are all untouched. The deck rail remains `position:fixed`, left-docked, sliding — correct as-is.

---

## 3. FUSE write-cap incident + recovery (process note)

The first edit attempt used the in-place file editor, which on this mount **capped each write at the file's original byte length** — new content landed at the top while an equal byte-count was lost from the tail (`Exhibit.jsx` truncated mid-JSX at line ~1002; `Exhibit.css` lost its `.pb` rule and the media query). This is the 16 KB/FUSE hazard the brief flagged.

**Recovery (the guardrail's "build-in-temp-then-copy, byte-count verified"):** the clean originals were re-extracted from the git object store (`git show HEAD:…`, no index lock needed), the two edits re-applied off-mount with anchor asserts (each anchor matched exactly once), the complete files written to an off-mount scratch dir, then `cp`'d onto the mount. Byte counts and md5 were verified identical between source-of-truth and mount, and both files confirmed to close on `}`. The vite build (below) is the final proof the deployed mount files are whole and valid.

---

## 4. Verbatim build result (proves it compiles)

Built with `outDir` redirected off-mount (so the cloudflare plugin's `.dev.vars`/dist artifacts land off the FUSE mount — the EPERM-avoidance the recovery pass used):

```
$ npx vite build --outDir <off-mount>/dist --emptyOutDir
vite v8.0.7 building weird_baby environment for production...
[2Ktransforming...✓ 4 modules transformed.
rendering chunks...
Using secrets defined in .env
computing gzip size...
../../../../../../tmp/nzg.qmHxMn/dist/weird_baby/.vite/manifest.json  0.15 kB │ gzip: 0.11 kB
../../../../../../tmp/nzg.qmHxMn/dist/weird_baby/.dev.vars            0.35 kB
../../../../../../tmp/nzg.qmHxMn/dist/weird_baby/wrangler.json        1.45 kB │ gzip: 0.74 kB
../../../../../../tmp/nzg.qmHxMn/dist/weird_baby/index.js             4.84 kB │ gzip: 1.28 kB

✓ built in 61ms
vite v8.0.7 building client environment for production...
[2Ktransforming...✓ 46 modules transformed.
rendering chunks...
computing gzip size...
../../../../../../tmp/nzg.qmHxMn/dist/client/.assetsignore                       0.02 kB
../../../../../../tmp/nzg.qmHxMn/dist/client/index.html                          0.61 kB │ gzip:   0.35 kB
../../../../../../tmp/nzg.qmHxMn/dist/client/assets/oswald-600-plFmSr5g.woff2   12.74 kB
../../../../../../tmp/nzg.qmHxMn/dist/client/assets/index-3L3XhiMw.css          50.43 kB │ gzip:   9.69 kB
../../../../../../tmp/nzg.qmHxMn/dist/client/assets/index-xhnKXCCQ.js          420.05 kB │ gzip: 123.34 kB

✓ built in 683ms
npm notice
npm notice New major version of npm available! 10.9.8 -> 11.16.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.16.0
npm notice To update run: npm install -g npm@11.16.0
npm notice
```

(`Using secrets defined in .env` / `.dev.vars` lines are the cloudflare plugin writing into the **off-mount** dist, not the repo.) Exit status: **0**.

---

## 5. git status -s (end state)

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
?? docs/HANDOFF_toprail_group_scope.md
?? docs/SCOPE-tabs-leftrail-extract.md
```

Under `src/`: only `Exhibit.jsx` and `Exhibit.css` (this pass). The `CLAUDE.md` / `docs/SCOPE-token-mirror.md` / `docs/canonical/OPERATIONS.md` modifications and the untracked `docs/*.md` handoffs were **already dirty before this pass** (pre-existing, not from the rail work) — flagged so the tree being dirtier than "just the two files" is not a surprise. No artifacts were written to the mount by the build.

---

## 6. Open items / watch-items for Mike

1. **PRESETS content (deferred by design).** To make the PRESETS tab show live cards, the deck's preset state must be surfaced to the block — either lift `userPresets`/`selected`/snapshot fns up to `Exhibit` and pass them down, or portal `PresetsContent` into `.ex-rail`'s content slot. Both cross the seam and touch `HrExhibitFlow` past the 16 KB boundary; scoped as its own pass.
2. **FACTS appears in two places when FACTS is active.** `.ex-right` keeps its permanent `FactScroller` (the "video/PUV region stays put" guardrail = no edits to `.ex-right`), and the FACTS tab also shows a facts list in the content column. Independent React instances, no conflict — but if Mike wants facts to leave the right column when the FACTS tab is active, that's a small follow-up edit to `.ex-right` he should sign off on (it modifies the "stays put" region).
3. **Same-edge coexistence with the deck rail.** Both the new block rail and the deck rail (`.hr-deck`, `position:fixed`, left-docked) live on the left edge. The deck rail paints above the block (z-index) and can overlap the new rail's column. Not a compile issue and out of scope here (don't-touch-the-deck guardrail), but a visual watch-item the scope doc also raised (Q5). Verify in-browser whether they collide and decide the resolution.
4. **Build is host-side only.** No commit/push/deploy performed, per the brief.

---

*WRITE pass. Source modified: `Exhibit.jsx`, `Exhibit.css`. Build verified (exit 0). Commit/push/deploy remain Mike's host-side steps (OPERATIONS §1). Stamped copy at `_cowork/HANDOFF_toprail_build_20260610T141213Z.md`.*
