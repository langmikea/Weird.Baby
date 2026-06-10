# HANDOFF — Phase 1 deck-rail equal-fill + rotate — GRAB & PRE-ANALYSIS (READ-ONLY)

**Pass type:** Read-only first pass. Zero edits applied to `src/`.
**Generated:** 2026-06-10 (stamp `20260610T124226Z`)
**Scope:** Extract live deck-tab-rail code verbatim and pre-analyze the two style changes
(equal-fill of the tab strip; rotate tabs 180°). Patching deferred to the next pass after Mike reviews.

---

## 0. Git state

```
$ git rev-parse --short HEAD
10bfd5a

$ git rev-parse --abbrev-ref HEAD
main

$ git rev-parse --short origin/main
10bfd5a

HEAD == origin/main ?  YES (equal — working tree is at the pushed tip)

$ git status -s
 M CLAUDE.md
 M docs/SCOPE-token-mirror.md
 M docs/canonical/OPERATIONS.md
 M src/routes/hr/HrExhibitFlow.jsx
?? docs/HANDOFF_clamp_fix.md
?? docs/HANDOFF_leftrail_applied.md
?? docs/HANDOFF_relayout_scope.md
?? docs/SCOPE-tabs-leftrail-extract.md
```

**Confirmation re: `src/`** — the *only* dirty path under `src/` is `src/routes/hr/HrExhibitFlow.jsx`
(the in-progress rotate fix). There are **no untracked files under `src/`** (`git ls-files --others
--exclude-standard src/` returns empty). ✔ matches the brief.

**Deviation from the brief's expectation (worth a glance, all OUTSIDE `src/`):** three tracked
non-source files are also dirty — `CLAUDE.md`, `docs/SCOPE-token-mirror.md`,
`docs/canonical/OPERATIONS.md` — and the untracked set is four docs, not the loosely-described
"HANDOFF docs" (`HANDOFF_clamp_fix.md`, `HANDOFF_leftrail_applied.md`, `HANDOFF_relayout_scope.md`,
`SCOPE-tabs-leftrail-extract.md`). None of these touch the deck rail or any source file, so they do
not affect this pass — flagging only so Mike isn't surprised the tree is dirtier than "just the jsx".

**Sidecar backups present (not in git, informational):**
`HrExhibitFlow.jsx.pre-fbwidth-20260531T193449Z`, `HrExhibitFlow.jsx.pre-phaseC-20260522-163720`,
`HrExhibitFlow.css.pre-fbwidth-20260531T193449Z`.

**File sizes:** `HrExhibitFlow.jsx` = 165,381 bytes / 3,647 lines · `HrExhibitFlow.css` = 1,888 lines.

---

## 1. Verbatim grabs (with line numbers)

### 1a. `TABS` array — `HrExhibitFlow.jsx` L173–188

```jsx
173 // ─── TABS — six entries; Journal sits last among functional tabs ────────────
174 // Stage 3 placement: Journal sits AFTER the v28_3 functional tabs in their
175 // v28_3 order (Artist · Formats · Deep Tracks · Presets), then ✕. This is
176 // the "default to last" call from the visitor-consequence brief — v28_3
177 // doesn't include Journal, so there's no more-natural insertion point to
178 // surface; Journal becomes the right-most non-close tab. Was position 4
179 // (between Deep Tracks and Presets) in Stage 2; moved to position 5 here.
180 const TABS = [
181   { key: "artist",  label: "Artist",      kind: "tier",    tier: 1, width: 120 },
182   // 2026-06-07 Mike: "Formats" → "Source" — the tab's actual content is the
183   // Source column (plus content/card kind, re-tiered in vocabulary.json).
184   { key: "media",   label: "Source",      kind: "tier",    tier: 2, width: 130 },
185   { key: "deep",    label: "Deep Tracks", kind: "tier",    tier: 3, width: 120 },
186   { key: "presets", label: "Presets",     kind: "special", special: "presets", width: 110 },
187   { key: "journal", label: "Journal",     kind: "special", special: "journal", width: 110 },
188 ];
```

> Note: the header comment says "six entries" but the array has **5** (Artist, Source, Deep Tracks,
> Presets, Journal) and there is **no `kind:"close"` entry** — the close/hide control is synthesized
> at render time (see 1c, L3587–3598). Stale comment; not a functional issue.

### 1b. `S` builders for context — `HrExhibitFlow.jsx` L281–350

`panelPos`, `deck`, `tab`, `resizeHandle`:

```jsx
281 const S = {
282   // panelPos: positions the artifact-grid pane above the deck. deckW changes
283   // as the deck peeks / opens / resizes.
284   panelPos: (deckW) => ({
285     position: "absolute", right: 0, top: 0, bottom: 0, left: deckW + "px",
286   }),
287
288   // deck: bottom-anchored. height swings between TAB_PEEK / TAB_STRIP_H /
289   // resizable open height.
290   deck: (deckW) => ({
291     /* `position: fixed` so the deck pins to the viewport bottom
292        regardless of the section's scroll-snap-align: center. With
293        `absolute` it followed the section, which is centered in the
294        viewport with a 32px gap above and below — that gap pushed the
295        tabs 32px above viewport bottom. */
296     position: "fixed", top: 0,
297     width: deckW + "px",
298     background: "transparent",
299     zIndex: 10,
300     pointerEvents: "none",
301     /* `left` (rail dock) + `bottom` are set by .hr-deck in HrExhibitFlow.css;
302        `bottom` stays conditional on whether the player bar is in the DOM (60
303        when playing, 0 when not).
304        Clip the tab strip's bottom-overhang at the deck's bottom edge.
305        The strip is 42px tall but the closed-idle deck is only 14px
306        (TAB_PEEK), so 28px hangs below. Without overflow:hidden the
307        hangover is visible in any gap between deck and viewport (or
308        deck and player bar). Original layout relied on the viewport
309        edge for this clip; explicit clip is more robust. */
310     overflow: "hidden",
311   }),
312
313   // tab: per-tab chrome. Active = bright + bold + INK_SOFT fill, no
314   // bottom rule under tab (cover element below merges with deck-body).
315   // Inactive = GOLD_LO border + dim text. isClose = small ✕ tab.
316   tab: (active, deckOpen, width, isClose) => {
317     const borderColor = active ? GOLD_HI : GOLD_LO;
318     const textColor   = active ? GOLD_HI : DIM;
319     return {
320       position: "relative",  // anchor for the active-tab bottom-cover
321       cursor: "pointer", fontFamily: sansBody,
322       fontSize: isClose ? "14px" : "10.5px",
323       letterSpacing: isClose ? "0" : "0.12em",
324       textTransform: isClose ? "none" : "uppercase",
325       fontWeight: active ? 900 : 500,
326       color: textColor,
327       background: active ? INK_SOFT : INK,
328       border: `1px solid ${borderColor}`, borderLeft: "none",
329       borderTopRightRadius: "6px", borderBottomRightRadius: "6px",
330       writingMode: "vertical-rl", textOrientation: "mixed",
331       width: "auto", minWidth: TAB_STRIP_H + "px", height: "auto",
332       display: "flex", alignItems: "center", justifyContent: "center",
333       gap: "6px",
334       transition: "border-color 0.12s, color 0.12s, font-weight 0.12s, background 0.12s",
335       padding: "6px 0", boxSizing: "border-box",
336       flexShrink: 0, marginBottom: "2px",
337       whiteSpace: "nowrap", overflow: "visible", textOverflow: "ellipsis",
338     };
339   },
340
341   // resizeHandle: ew-resize affordance at right edge of the rail body.
342   resizeHandle: (hovered) => ({
343     position: "absolute", right: "-4px",
344     top: 0, bottom: 0, width: "8px",
345     cursor: "ew-resize", zIndex: 14,
346     background: hovered
347       ? `linear-gradient(to right, transparent 0%, ${GOLD_LO} 45%, ${GOLD_LO} 55%, transparent 100%)`
348       : "transparent",
349     transition: "background 0.15s",
350   }),
```

Relevant constants (`HrExhibitFlow.jsx` L109–148):

```jsx
109 const INK = "#ece9e0";
110 const INK_SOFT = "#e2ded3";
119 const GOLD_HI = "#000000";  // synced to --hr-gold-hi (deepest tier)
120 const GOLD_LO = "#57544d";  // synced to --hr-gold-lo (dim tier)
122 const DIM = "#3b3933";       // synced to --hr-dim (body)
147 const TAB_PEEK = 30;  // === full strip; previously 14 (1/3 peek) but labels were clipped
148 const TAB_STRIP_H = 30;
```

### 1c. Tab-strip render site — `HrExhibitFlow.jsx` L3539–3599

```jsx
3539         <div className={"hr-deck " + animClass} style={S.deck(deckW)} onClick={(e) => e.stopPropagation()}>
3540           <div
3541             className="hr-tab-strip"
3542             onMouseEnter={() => { if (!open) { cancelHoverTimer(); scheduleHoverOpen(); } }}
3543             onMouseLeave={() => { if (!open) scheduleHoverClose(); }}
3544           >
3545             {TABS.filter(t => t.key !== "journal").map(t => {
3546               const isActive = activeTab === t.key;
3547               const isClose = t.kind === "close";
3548               return (
3549                 <div
3550                   key={t.key}
3551                   className={isActive ? "" : "tab-hoverable"}
3552                   style={S.tab(isActive, open, t.width, isClose)}
3553                   onClick={(e) => { e.stopPropagation(); handleTabClick(t.key); }}
3554                   role="button"
3555                   title={t.label}
3556                 >
3557                   <span>{t.label}</span>
3558                   {(() => {
3559                     const has = tabHasSelection(t);
3560                     return (
3561                       <span
3562                         role={has ? "button" : undefined}
3563                         title={has ? `clear ${t.label.toLowerCase()} selections` : undefined}
3564                         onClick={has ? (e) => { e.stopPropagation(); clearTab(t.key); } : undefined}
3565                         style={{
3566                           position: "absolute", top: 2, right: 4,
3567                           fontSize: 12, lineHeight: 1, padding: "0 4px",
3568                           cursor: has ? "pointer" : "default",
3569                           color: GOLD_HI,
3570                           opacity: has ? 0.85 : 0.18,
3571                           transition: "opacity 0.12s",
3572                         }}
3573                         onMouseEnter={has ? (e) => { e.currentTarget.style.opacity = "1"; } : undefined}
3574                         onMouseLeave={has ? (e) => { e.currentTarget.style.opacity = "0.85"; } : undefined}
3575                       >{"✕"}</span>
3576                     );
3577                   })()}
3578                   {isActive && open && (
3579                     <span aria-hidden style={{
3580                       position: "absolute", top: -1, bottom: -1, right: -1,
3581                       width: 1, background: INK_SOFT, pointerEvents: "none",
3582                     }} />
3583                   )}
3584                 </div>
3585               );
3586             })}
3587             {open && (
3588               <div
3589                 role="button"
3590                 aria-label="Hide panel"
3591                 title="Hide panel"
3592                 className="tab-hoverable"
3593                 onClick={(e) => { e.stopPropagation(); setActiveTab(null); setHoverPeek(false); cancelHoverTimer(); }}
3594                 style={S.tab(false, open, 34, true)}
3595               >
3596                 <span aria-hidden="true">◂</span>
3597               </div>
3598             )}
3599           </div>
```

`deckW` resolution that feeds `S.deck`/`S.panelPos` (`HrExhibitFlow.jsx` L3419–3423):

```jsx
3419   const open = activeTab !== null && activeTab !== "close";
3420   let deckW;
3421   if (open) deckW = deckWidth;
3422   else if (hoverPeek) deckW = TAB_STRIP_H;
3423   else deckW = TAB_PEEK;
```

### 1d. CSS — `.hr-deck` / `.hr-tab-strip` / `.hr-deck-body` and neighbors — `HrExhibitFlow.css` L550–602

```css
550 .hr-deck { bottom: 0; left: 0; transition: left 0.18s ease; }
551 body:has(.pb) .hr-deck { bottom: 60px; }
552
553 /* ── Tab strip ─────────────────────────────────────────────────────────── */
554 .hr-tab-strip {
555   position: absolute;
556   left: 0; top: 12px; bottom: 12px;
557   width: 30px;
558   display: flex;
559   flex-direction: column;
560   align-items: flex-end;
561   pointer-events: auto;
562   z-index: 12;
563   user-select: none;
564 }
565 .hr-strip-clear-btn {
566   margin-left: 12px;
567   align-self: center;
568   background: transparent;
569   border: 1px solid var(--hr-gold-lo);
570   color: var(--hr-gold);
571   font-family: var(--hr-sans);
572   font-size: 9.5px;
573   letter-spacing: 0.22em;
574   text-transform: uppercase;
575   font-weight: 500;
576   padding: 4px 10px;
577   cursor: pointer;
578   transition: all 0.15s;
579   white-space: nowrap;
580   height: 24px;
581   box-sizing: border-box;
582   flex-shrink: 0;
583 }
584 .hr-strip-clear-btn:hover {
585   border-color: var(--hr-gold);
586   color: var(--hr-gold-hi);
587 }
588
589 /* tab-hoverable applies to inactive tab divs */
590 .tab-hoverable:hover { border-color: var(--hr-gold) !important; color: var(--hr-gold-hi) !important; }
591
592 /* ── Deck body (the panel that opens upward) ───────────────────────────── */
593 .hr-deck-body {
594   position: absolute;
595   left: 30px; top: 0; right: 0; bottom: 0;
596   background: #e7e3d8;
597   border-left: 1px solid var(--hr-gold-lo);
598   pointer-events: auto;
599   display: flex;
600   flex-direction: column;
601   overflow: hidden;
602 }
```

`.hr-section-deck-host` (host wrapper) — `HrExhibitFlow.css` L50:

```css
50 .hr-section-deck-host {
```

### 1e. Mobile `@media` block naming those classes — `HrExhibitFlow.css` L1199–1217

```css
1199 @media (max-width: 720px) {
1200   .hr-section-deck-host { overflow: visible; min-height: auto; }
1201   .hr-panel-scroll {
1202     position: static;
1203     inset: auto;
1204     overflow-y: visible;
1205     padding: 1rem 0.75rem;
1206   }
1207   .hr-tab-strip,
1208   .hr-deck-body {
1209     display: none;
1210   }
1211   /* Hide the absolute deck chrome entirely. */
1212   .hr-section .animated {
1213     transition: none;
1214   }
1215   .hr-section .hr-section-deck-host > .animated:not(:first-child) {
1216     display: none;
1217   }
```

> **The deck rail (`.hr-tab-strip` + `.hr-deck-body`) is `display:none` below 720px.** The pill columns
> render inline instead (`.hr-mobile-pills`, L1237). Both style changes in this brief are therefore
> **desktop-only in effect** — mobile cannot regress.

---

## 2. Pre-analysis

### Q1 — Equal-fill: minimal change to split the strip's full height equally

**Is `.hr-tab-strip` already a full-height flex column?** — **Yes.** It is `position:absolute` with
`top:12px; bottom:12px` (CSS L556), so its height is fixed at the deck height minus 24px, and it is
already `display:flex; flex-direction:column` (L558–559). It has **no `justify-content` set**, so the
main-axis default is `flex-start` — that is exactly why the tabs currently bunch at the top and leave
empty rail below.

**What forces the bunching?** In `S.tab` (JSX L319–338) each tab is sized to its content on the main
(vertical) axis and is pinned non-growing:

- `height: "auto"` (L331) — main-axis size follows content.
- `flexShrink: 0` (L336) — won't shrink.
- (no `flexGrow`) — defaults to `0`, so won't grow into free space.
- `marginBottom: "2px"` (L336) — 2px gap after each tab.

**Minimal change (single edit, JSX-side):** in `S.tab`, replace the main-axis sizing trio so each tab
grows to an equal share:

- L336 `flexShrink: 0,` → `flex: "1 1 0",` (sets grow=1, shrink=1, basis=0 → equal division of the
  strip's free height). `flex:1 1 0` supersedes the separate `flexShrink:0`.
- L331 `height: "auto"` → leave as-is OR set `height: "auto"` is harmless with `flex-basis:0`; with
  `flex:1 1 0` the basis wins, so **no change strictly required to `height`**, but for clarity it can be
  dropped. (Cross-axis `width:"auto"`/`minWidth` are horizontal — untouched.)
- `marginBottom: "2px"` — optional. With 4 tabs that is 8px of cumulative gap eaten out of equal
  division; acceptable, but if pixel-exact equal thirds/quarters are wanted, switch the strip to
  `gap` (CSS) and drop the per-tab margin. Not required for "equal fill."

**Will `justify-content` fight it?** **No.** The strip has no `justify-content`, and even if it did,
`justify-content` only distributes *leftover* free space — once tabs are `flex-grow:1` there is no
leftover space for it to act on, so it becomes a no-op. `align-items: flex-end` (CSS L560) is the
**cross axis** (horizontal) and only governs tab right-alignment/width; it does not interact with
vertical equal-fill. **No CSS change needed for Q1** — the one JSX property flip is sufficient.

**Caveat — the synthesized controls also receive `S.tab`:** the `◂` hide button (JSX L3594) and any
future close tab call `S.tab(...)` too, so they would *also* become `flex:1 1 0` and take an equal
share. Since the hide button only exists while `open` (and the strip then sits beside the open body),
confirm with Mike whether the hide control should be equal-height with the four data tabs or pinned
(`flex:0 0 auto`). Cheapest correct version: pass an explicit flag or branch in `S.tab` on `isClose`
to keep the close/hide control `flex:0 0 auto`.

**Exact properties/lines for Q1:** `HrExhibitFlow.jsx` **L336** (`flexShrink:0`→`flex:"1 1 0"`),
optionally **L331** (`height:"auto"`) and **L336** (`marginBottom`). No `.hr-tab-strip` CSS change
required.

### Q2 — Rotate 180°: placement and collisions

**Where it goes:** `transform: "rotate(180deg)"` belongs in the `S.tab` return object (JSX L319–338),
as a per-tab property (e.g. alongside L330's `writingMode`). Applying it on the strip instead would
also flip tab order/stacking, so tab-level is correct.

**Collision 1 — `writingMode: "vertical-rl"` (L330):** No conflict in the CSS cascade (`writing-mode`
and `transform` are independent properties), **but they compound visually.** `vertical-rl` already
makes the label read top→bottom down the right edge; `rotate(180deg)` flips the glyphs and reverses
that to bottom→top. This compounding is almost certainly the *intent* of the rotate (flip vertical
text direction), so it's expected — just confirm the resulting reading direction is the desired one.
`textOrientation:"mixed"` (L330) is unaffected.

**Collision 2 — active-tab cover sliver (JSX L3578–3583) + the `position:relative` anchor (L320):**
**This is the real interaction to flag.** `transform` on the tab establishes a containing block and
rotates the entire subtree, *including absolutely-positioned children*. The cover sliver is anchored
to `right:-1; top:-1; bottom:-1` (L3580) — i.e. the **right edge**, where it overlaps the deck-body
border to merge the active tab into the body. After a 180° rotation the sliver renders on the
**left edge** (away from the body), so the merge effect breaks: a 1px gap/line reappears on the body
side and a stray sliver shows on the rail side. **Fix path:** either move the sliver to `left:-1`
when rotation is active, or render the sliver *outside* the rotated element (it is sibling-level inside
the tab today), or counter-rotate the sliver. Must be decided in the patch pass.

**Collision 3 — the `✕` close/clear glyph (JSX L3558–3577):** Same mechanism. It is positioned
`top:2; right:4` (L3566) → top-right corner. After 180° it lands at the **bottom-left** corner.
Functionally still clickable (hit area rotates with it), but the visual placement moves and its own
`writing-mode`-inherited orientation flips, so the `✕` may read mirrored/upside-relative. Decide
whether to counter-rotate just the glyph (`transform: rotate(180deg)` on the inner span to cancel) or
accept the new corner.

**Net:** rotate is a one-line add to `S.tab`, but it has **two downstream absolute-child interactions**
(cover sliver, ✕ glyph) that need explicit handling. Do not ship rotate without addressing the cover
sliver — it is load-bearing for the active-tab/body merge.

### Q3 — Risk / coupling

**16KB edit boundary + FUSE truncation:** `HrExhibitFlow.jsx` is ~165KB. Sandbox/FUSE access can
truncate large reads/writes around the ~16KB boundary, so **edits in the next pass must be
anchor-based and host-side** — i.e. use the host `Edit` tool with unique surrounding-text anchors
(not offset/line rewrites, not sandbox `sed`/`python` over the mounted file). The grabs above already
include enough surrounding context to form unique anchors for each of the three edit sites
(`flexShrink: 0, marginBottom: "2px",` in `S.tab`; the `writingMode` line for the rotate add; the
cover-sliver span). Verify each anchor is unique before editing — `S.tab` shares idioms (`position:
"relative"`, `flexShrink`) with `S.pill` and others, so anchor on the full multi-property line.

**ExhibitFlow seam / Exhibit.jsx coupling:** **None for the deck-rail geometry.** `Exhibit.jsx`
renders `<ExhibitFlow>` (L992–999) passing only `activeAlbumId`, `playingTrack`, `onRestorePlayer`,
`shuffle/setShuffle`, `loop/setLoop`. No deck width, tab, or rail-geometry prop crosses the seam —
`deckW`, `deckWidth`, `TAB_PEEK`, `TAB_STRIP_H` are entirely internal to `HrExhibitFlow`. The only
cross-component touch is a **CSS sibling relationship, not a prop**: `body:has(.pb) .hr-deck
{ bottom:60px }` (CSS L551) lifts the deck when the player bar (`.pb`) is in the DOM. Equal-fill and
rotate change main-axis sizing/transform *inside* the strip and do not alter deck height, `left`
dock, or the `.pb` lift, so the player-bar interaction is unaffected. **No edits to `Exhibit.jsx`
required; the seam is safe.**

**Other coupling notes:** `.hr-deck-body` is docked at `left:30px` (CSS L595) matching strip
`width:30px` (L557) and `TAB_STRIP_H/TAB_PEEK = 30` (JSX L147–148) — these three must stay in sync,
but **neither change in this brief touches strip width**, so the 30px contract is untouched. The
mobile block (CSS L1207–1209) hides the rail entirely below 720px, so no mobile regression surface.

### Q4 — Labels

**Confirmed — no relabel needed for the deck set.** The render filters Journal out of the strip
(`TABS.filter(t => t.key !== "journal")`, JSX L3545), so the live deck rail renders exactly four tabs
in order: **Artist · Source · Deep Tracks · Presets** (JSX L181–186). Journal is defined in `TABS`
(L187) but surfaced elsewhere, not on this rail. Labels are correct as-is.

---

## 3. Proposed minimal patch list (NOT applied — for the review pass)

All edits are host-side, anchor-based, JSX-only unless noted. No CSS change is strictly required for
either feature.

1. **Equal-fill (1 edit, `HrExhibitFlow.jsx` ~L336, inside `S.tab`):**
   change `flexShrink: 0, marginBottom: "2px",` → `flex: "1 1 0", marginBottom: "2px",`
   (optionally drop `height: "auto"` at L331 for clarity; optionally move the 2px gap to a CSS `gap`
   on `.hr-tab-strip` if pixel-exact equal shares are wanted).
   - **Decision needed:** keep the synthesized `◂` hide control (L3594) equal-height, or branch
     `S.tab` on `isClose` to keep it `flex: "0 0 auto"`.

2. **Rotate 180° (1 edit, `HrExhibitFlow.jsx` ~L330, inside `S.tab`):**
   add `transform: "rotate(180deg)",` next to the `writingMode` line.

3. **Rotate fallout — active-tab cover sliver (`HrExhibitFlow.jsx` L3578–3583):**
   move the sliver from `right:-1` to `left:-1` (or render it outside the rotated tab, or
   counter-rotate) so the active-tab→body merge survives the flip. **Required** if patch #2 ships.

4. **Rotate fallout — `✕` clear glyph (`HrExhibitFlow.jsx` L3558–3577, ~L3566):**
   decide between counter-rotating the inner span (`transform: rotate(180deg)` to cancel) or accepting
   its move to the opposite corner. Cosmetic but visible.

**Sequencing:** land #1 (equal-fill) first and verify alone — it is independent and low-risk. Then
land #2 only together with #3 (and #4), never #2 alone. Take before/after screenshots at desktop width
and at the player-bar-present state (`.pb` in DOM) for verification, since the `.pb` lift changes the
strip height that equal-fill divides.

**Verification checklist for the patch pass:** (a) four tabs visually equal-height, closed-peek and
open states; (b) active tab still merges seamlessly into `.hr-deck-body` with no 1px seam; (c) `✕`
clear control still clickable and legible; (d) `◂` hide control behaves per the Q1 decision; (e) no
regression at ≤720px (rail hidden); (f) deck still lifts 60px when a track/video plays.

---

*End of read-only pass. No `src/` files were modified. Next pass applies §3 after Mike's review.*
