# HANDOFF — Deck-rail + seam remediation plan (post-Phase-2b)

**Mode:** READ-ONLY analysis. No source edits, no commits, no reverts, no deploy. This document is the only artifact produced.

**Refs**
- Committed base (Phases 1 + 2a, on `origin/main`): **`044a235`** — *"player bar: always render; idle shows cued-next track…"*. This is also current `HEAD`.
- Uncommitted in working tree: the **Phase 2b de-fix** of the deck, present in `src/routes/hr/HrExhibitFlow.jsx` + `HrExhibitFlow.css`. Read via `git diff -- src/routes/hr/`.

**Read-path note.** All structure below is sourced from the committed git blob (`git show 044a235:<path>`) plus the working-tree diff (`git diff -- <path>`), per the brief's instruction not to trust raw working-tree reads this session. Line numbers cite the `044a235` blob unless marked *(2b)*.

**Prior art this builds on.** `docs/HANDOFF_seam_scope.md` (written at ref `8ce53e0`) scoped the full reflow and laid out a phase sequence in which "de-fix the deck" was Phase 2 and the seam was Phases 3–4. Phase 2b is that de-fix, executed and deployed for review — and it broke the rail. This plan is the **remediation**: it re-sequences so the rail is restored first, then resumes the seam work. It does not contradict the seam_scope file; it slots in front of it.

---

# PART 1 — Structural map as it actually is now (blob `044a235` + 2b diff)

## 1.1 The DOM tree (deck section, `HrExhibitFlow`)

```
<section class="hr-section">                         CSS:26
  …mobile-only blocks (hidden >720px)…
  <div class="hr-section-deck-host">                 CSS:50   JSX:3520
    <div class="animated …" style={S.panelPos(deckW), position:absolute}>   JSX:3521-3522
      <div class="wb-scroll hr-panel-scroll">        CSS:58   JSX:3524
        <P3Panel/>   ← the artifact grid
      </div>
    </div>
    <div class="hr-deck {anim}" style={S.deck(deckW)}>          CSS:550  JSX:3539
      <div class="hr-tab-strip"> …tabs… </div>       CSS:554  JSX:3541   ← THE RAIL
      {open && <div class="hr-deck-body"> …content… </div>}     CSS:593  JSX:3602
    </div>
  </div>
</section>
```

Two facts about this tree drive everything:

1. **`.hr-deck` has only two children, and both are removed from normal flow.** `.hr-tab-strip` is `position:absolute` (CSS:554) and `.hr-deck-body` is `position:absolute` (CSS:593). Therefore `.hr-deck` derives **zero height from its own content** — its height has to come from somewhere else.
2. **The panel pane is also out of flow.** The `.animated` wrapper has `position:absolute` hard-coded inline in the JSX (JSX:3522), and `S.panelPos` (JSX:284) also returns `position:absolute`. So the whole grid subtree is absolutely positioned against `.hr-section-deck-host`.

In other words, **both** of the host's meaningful children (the panel and the deck) depend on an ancestor that supplies a real, non-zero height. Neither one contributes height back up the tree.

## 1.2 The positioning chain — committed `044a235` (working) vs. Phase 2b (broken)

| Element | Committed `044a235` (rail renders) | Phase 2b *(2b)* (rail gone) |
|---|---|---|
| `.hr-section` | `position:relative; min-height:calc(100vh-64px); display:flex; column` (CSS:34-44) | `min-height:240px` *(2b)* — collapses toward 240px |
| `.hr-section-deck-host` | `position:relative; flex:1; min-height:calc(100vh-64px); overflow:hidden` (CSS:51-55) | `position:relative` **only** — `flex`, `min-height`, `overflow` all removed *(2b)* |
| `.animated` panel wrapper | `position:absolute` (inset via `S.panelPos`) — unchanged | `position:absolute` — **unchanged** (still out of flow) |
| `.hr-panel-scroll` | `position:absolute; inset:0; overflow-y:auto` (CSS:59-61) | `position:relative; overflow-y:visible` *(2b)* |
| `.hr-deck` (inline `S.deck`) | **`position:fixed; top:0; width:deckW`** (JSX:296-297) | **`position:relative; width:100%`** *(2b)* |
| `.hr-deck` (CSS rule) | `bottom:0; left:0` + `body:has(.pb){bottom:60px}` (CSS:550-551) | `position:relative`; `bottom/left` and `:has` lift **removed** *(2b)* |
| `.hr-tab-strip` (rail) | `position:absolute; left:0; top:12px; bottom:12px; width:30px` (CSS:554-562) | unchanged |
| `.hr-deck-body` | `position:absolute; left:30px; top:0; right:0; bottom:0` (CSS:593-601) | unchanged |

## 1.3 Why the rail collapsed — exact cause

In the committed build, `.hr-deck` was **`position:fixed; top:0`** (JSX:296) combined with the CSS `bottom:0; left:0` (CSS:550). A fixed box with both `top:0` and `bottom:0` resolves to **full viewport height**, width `deckW`, pinned to the left viewport edge. That fixed box was the containing block for its two absolute children:

- `.hr-tab-strip` (`top:12; bottom:12`) resolved against a viewport-tall box → height ≈ `100vh − 24px`. **Rail visible, full height.**
- `.hr-deck-body` (`inset` from `left:30`) filled the same tall box.

Phase 2b changed `S.deck` to **`position:relative; width:100%`** and stripped `.hr-deck`'s `bottom/left`. `.hr-deck` is now an in-flow relative element — but, per §1.1, **both of its children are `position:absolute`, so it has no in-flow content and collapses to `height:0`.**

A child with `position:absolute; top:12px; bottom:12px` is sized by its containing block's height. The containing block is now the **0-height `.hr-deck`**, so the rail computes to `0 − 12 − 12` → clamped to **height 0**. The tab strip is still in the DOM, still `z-index:12`, still has its tabs — it just has no vertical extent to paint into. **That is the regression: the rail has no tabs anywhere because its positioning context (`.hr-deck`) lost the height that `position:fixed` used to give it.**

The collapse compounds upward, which is worth knowing even though the rail is the visible symptom:

- `.hr-section-deck-host` lost `flex:1; min-height; overflow` *(2b)*, so it no longer asserts a height of its own. Its children are the **absolute** `.animated` panel (out of flow) and the **0-height** `.hr-deck` → the host also collapses toward 0.
- The panel wrapper `.animated` is **still `position:absolute`** (unchanged by 2b). So even though `.hr-panel-scroll` was switched to `relative/visible` *(2b)* — the one change that does push grid content into normal flow — its absolutely-positioned **parent** is anchored to the now-collapsed host. The grid is therefore anchored to a zero-height box too.

So Phase 2b half-converted the deck: it relaxed the *panel's* inner scroll to normal flow but left the panel's **wrapper** absolute and removed every height source the **deck/rail** relied on. The single removed property that kills the rail is **`position:fixed` on `S.deck`** (the thing that supplied the rail's containing-block height); the host `min-height`/`overflow` and `.hr-section` `min-height` removals make the collapse total rather than partial.

---

# PART 2 — Phased remediation plan

Design constraints that shape the sequence:

- **Rail before seam.** The brief requires the rail back first, and it's the right order: the rail's "top rides under the seam" can't be validated until the rail exists, and the seam relocation (in `Exhibit.jsx`/`Exhibit.css`) is independent of restoring the rail's height. Each phase below is independently testable.
- **No re-collision.** Restoring the rail must *not* re-introduce the Flag-1 collision documented in `HANDOFF_seam_scope.md` (fixed deck rail overlapping the album section's top rail). The collision came specifically from `.hr-deck` being a **fixed, viewport-pinned, full-height** overlay that painted over the album section at all scroll positions. The cure is therefore: give the rail height **from its own in-flow section**, never from the viewport. Staying in normal flow is what dissolves the collision at the root — so we must not "fix" the rail by reverting to `position:fixed`.
- **Seam spans two files the brief didn't name.** The player bar (`.pb`) lives in `src/routes/exhibit/Exhibit.css:152` (`position:fixed;bottom:0`) and is rendered by `PlayerBar` in `Exhibit.jsx`, mounted *after* `<ExhibitFlow>` (Exhibit.jsx ~1056). Making it a seam **between** album and deck is a structural change in `Exhibit.jsx` + `Exhibit.css`, not in `HrExhibitFlow`. Flagged here so the seam phases are scoped correctly.

## Phase A — Restore the rail's height in the in-flow deck (rail comes back)

**Goal:** `.hr-deck` again provides a real, non-zero, section-derived height so the absolute `.hr-tab-strip` and `.hr-deck-body` have a sized containing block — **without** `position:fixed` and **without** viewport pinning.

**Files / rules touched**
- `HrExhibitFlow.css` — `.hr-section-deck-host` (CSS:50), `.hr-deck` (CSS:550), and the `.hr-deck-body` (CSS:593) / `.hr-tab-strip` (CSS:554) anchoring relationship.
- `HrExhibitFlow.jsx` — possibly `S.deck` (JSX:290) and the `.animated` panel wrapper's hard-coded `position:absolute` (JSX:3522), depending on which height model is chosen (see decision below).

**The change (mechanism).** Give the deck a height source that lives in flow. There are three viable models; the choice is partly a UX call (see §4, UX-D1):

1. **Min-height on the deck/host (simplest).** Restore a height on `.hr-section-deck-host` (e.g. `min-height` sized to the deck region, *not* `100vh`) and let `.hr-deck` fill it (`.hr-deck { position:relative; height:100% }` or `min-height` inherited). The absolute rail/body then resolve against a real height again. Closest to the old behavior; lowest risk; but "content-height" becomes "min-height," which only partially satisfies target #1.
2. **Let `.hr-deck-body` drive height in normal flow (truest to "content-height").** Make `.hr-deck-body` `position:relative` (in flow) so its content gives `.hr-deck` real height, and keep `.hr-tab-strip` `position:absolute` overlapping it (rail anchored to the now-sized `.hr-deck`). This makes the deck genuinely content-height (target #1) and keeps the rail as an overlay strip down the left edge of the body. Requires reworking `.hr-deck-body`'s `inset:0` (CSS:594) into a flow box with a `30px` left padding/margin for the rail, and handling the **closed state** (when `!open`, `.hr-deck-body` is not rendered at all — JSX:3602 — so the deck would have *no* content child and collapse again; the rail must then carry a `min-height`, or a zero-state spacer must exist).
3. **Flex the host (panel grows, deck sized by body).** Make `.hr-section-deck-host` `display:flex; flex-direction:column`, the panel wrapper in-flow (`flex:1`, drop the inline `position:absolute` at JSX:3522), and the deck a flow sibling sized by its body. Most structurally "correct" for a one-flow stack but the largest change and the one most likely to perturb the panel's existing scroll behavior.

**Recommended for Phase A:** Model 1 (min-height) as the *minimum* to bring the rail back and make the phase independently shippable/testable, then converge to Model 2 in Phase B if true content-height is required for the seam. Reason: Model 1 is the smallest diff that restores the visible rail and proves the anchor chain, and it doesn't block the seam work.

**Depends on:** nothing (can start immediately; it is, in effect, the correct completion of the Phase 2b de-fix).

**Verify:**
1. `git diff -- src/routes/hr/` shows only the intended CSS/JSX deltas.
2. Load the exhibit page for an artist with an `exhibitFlow` (hunter-root). The vertical ARTIST / SOURCE / DEEP TRACKS / PRESETS strip renders with non-zero height; tabs are clickable; opening a tab shows `.hr-deck-body` content.
3. Confirm the committed equal-fill / vertical-label behavior is intact (the `flex 1 1 0` tab sizing from `8ce53e0` and `writing-mode:vertical-rl` labels — `S.tab`, JSX:316).
4. Scroll the album section: the rail does **not** appear over it (no re-collision) because the deck is no longer viewport-fixed. This is the explicit anti-regression check.

## Phase B — Confirm/settle content-height + one continuous scroll flow (deck side)

**Goal:** the album section and deck section each take content height and live in one scroll flow (target #1), on the `HrExhibitFlow` side. (The album side's flow + snap relaxation was scoped in `HANDOFF_seam_scope.md` Phase 1; coordinate, don't duplicate.)

**Files / rules touched**
- `HrExhibitFlow.css` — `.hr-section` `scroll-snap-align` (CSS:37) relax/remove if still present after the album-side snap removal; finalize `.hr-section-deck-host` height model from Phase A (converge to Model 2 if needed).
- `HrExhibitFlow.jsx` — if converging to Model 2/3, drop the inline `position:absolute` on `.animated` (JSX:3522) and rework `S.panelPos` (JSX:284) so the grid pane is in flow.
- `Exhibit.css` — `html,body { scroll-snap-type … }` (Exhibit.css:9) and per-section snap-align; `.ex-main { flex:1; overflow:hidden }` (Exhibit.css:66). *(Per seam_scope Phase 1; listed for completeness — do not re-land if already done.)*

**Depends on:** Phase A (rail must exist and be anchored to a real height before we further change that height model).

**Verify:** page scrolls top→bottom as one flow; album content then deck content; no nested/competing scrollbars introduced; rail still renders and rides with the deck.

## Phase C — Make the player bar a single-edge seam

**Goal:** relocate `.pb` to sit **between** album and deck in the DOM and stick to one edge. (Establishes the seam so its dual-edge behavior and the rail's "top rides under the seam" can be built/validated.)

**Files / rules touched**
- `Exhibit.jsx` — move `<PlayerBar>` from after `<ExhibitFlow>` (~1056) to **between** `.ex-main` and `<ExhibitFlow>`; likely wrap album + bar + deck in one scroll-flow container.
- `Exhibit.css` — `.pb` (Exhibit.css:152) `position:fixed; bottom:0` → `position:sticky` with a single offset; revisit `.ex-root` 64px bottom pad (Exhibit.css:12, reserved for the old fixed bar).
- `HrExhibitFlow.css` — the `body:has(.pb) .hr-deck { bottom:60px }` lift is **already removed by Phase 2b**; confirm it stays gone (it's inert/harmful in the new model).

**Depends on:** Phases A–B (deck must be in-flow and rail-bearing so the bar has a real boundary to seam against).

**Verify:** the bar sits at the album→deck boundary, sticks to one edge correctly (e.g. parks at bottom while album is in view), and the deck's rail top tucks under it.

## Phase D — Dual-edge sticky clamp

**Goal:** target #2 in full — bar parks at top when scrolled down (deck scrolls under), parks at bottom when scrolled up (album scrolls under), rides the boundary in between, never leaves the viewport.

**Files / rules touched**
- `Exhibit.css` — `.pb` offsets (attempt CSS-only `top:0; bottom:0` within the shared flow).
- `Exhibit.jsx` — **if** CSS-only can't hold both edges across the seam (likely; see §3.2), add a minimal scroll handler toggling park-top ↔ riding ↔ park-bottom based on the seam's position vs. the viewport. Note `docs/HANDOFF_clamp_fix.md` exists on the tree and may carry prior clamp work — consult before writing new JS.

**Depends on:** Phase C (single-edge seam must exist first).

**Verify:** both scroll directions; album scrolls under from below, deck scrolls under from above; bar never leaves the viewport; deck rail top rides under the bar at the boundary.

## Phase E — Idle (no-video) case, mobile, polish

**Goal:** resolve the idle seam behavior, re-check mobile, remove dead offsets.

**Files / rules touched**
- `Exhibit.jsx` — `PlayerBar` returns `null` when nothing plays (no `video`), so the seam is absent when idle. Implement the chosen idle behavior (see §4, UX-D2). *(Note: Phase 2a already makes the bar always render with a cued-next track — confirm whether `.pb` is in fact always present now, which would make the idle-gap question moot; verify against the 2a behavior.)*
- `HrExhibitFlow.css` — mobile overrides (CSS:1200, 1207-1208) where the rail/deck are hidden ≤720px; confirm unaffected.
- `Exhibit.css` — mobile `.pb` padding (Exhibit.css:175) and `.ex-root` bottom pad.

**Depends on:** Phase D.

**Verify:** idle layout, mobile layout (≤720px: rail hidden, pill stack shown), no regressions; the Flag-1 collision and Flag-2 FACTS duplicate from `seam_scope` are both confirmed gone.

---

# PART 3 — Hard parts (called out explicitly)

## 3.1 Re-anchoring the rail in a content-height, in-flow deck without re-introducing the collision
This is the crux of Phase A. The rail's height came *entirely* from `.hr-deck` being a viewport-tall fixed box — which is the exact same property that caused the Flag-1 collision (fixed, full-height, paints over the album). So the two requirements pull against the naive fix: the tempting one-line "fix" is to restore `position:fixed`, which brings the rail back **and** brings the collision back. The rail must instead get its height from **in-flow section content**. The non-obvious trap (Model 2 above): when the deck is **closed** (`!open`), `.hr-deck-body` is not rendered at all (JSX:3602), so a content-driven deck has *no* content child and re-collapses — the rail must then carry its own `min-height`, or a zero-state spacer must hold the deck open. Whatever model is chosen, the anti-regression check (album section shows no rail bleed) must be run every phase.

## 3.2 The dual-edge sticky clamp — CSS-only vs. needs JS
`position:sticky` clamps to the offset(s) you give it **only while its containing block is in view**, and it releases at the parent's boundaries. A single sticky element with both `top:0` and `bottom:0` inside one shared scroll flow gets most of the way — it pins toward whichever edge it's being pushed against — but the precise "always-visible, hands-off, parks-top-going-down / parks-bottom-going-up across the album→deck boundary" behavior is the one thing plain sticky does **not** reliably cover across two sibling sections. **Plan for CSS-first, JS-fallback** (a scroll handler that toggles park-top / riding / park-bottom from the seam's viewport position). `docs/HANDOFF_clamp_fix.md` on the tree likely informs this. This is the highest-uncertainty phase.

## 3.3 Does "rail top rides under the seam" need the seam to exist first?
**Yes — partially.** The rail can be *restored and anchored* (Phase A/B) with the bar still fixed; that's why the rail comes back first and is independently testable. But the rail's **top offset under the seam** can only be positioned and validated once the seam is a real in-flow element at the album/deck boundary (Phase C), because "under the seam" is defined relative to the seam's resting position and height. So: restore the rail without the seam, but defer the final "tuck under the seam" offset until Phase C. Don't try to hardcode a 60px-style top inset in Phase A — that's what the now-removed `body:has(.pb)` lift used to do, and it's model-dependent.

## 3.4 Half-converted state is the real hazard
Phase 2b relaxed the panel's inner scroll (`.hr-panel-scroll` → relative/visible) but left the panel **wrapper** absolute (JSX:3522) and removed every deck height source. Any remediation that touches one side of this (panel vs. deck) without the other risks another half-state. Phase A should treat the panel wrapper's `position:absolute` and the deck's height model as a **single coupled change**, even if Model 1 lets us defer the panel rework.

---

# PART 4 — UX decisions (Mike's call) vs. implementation details (execute without asking)

## UX decisions — bring to Mike
- **UX-D1 — Deck height model: min-height vs. true content-height.** Whether the deck region is a fixed-ish `min-height` band (Model 1: simplest, closest to old feel) or genuinely content-height that grows/shrinks with the open tab's content (Model 2: matches the literal target-#1 wording). This changes how the page feels when opening/closing tabs and is a visible design choice, not a mechanical one.
- **UX-D2 — Idle (no-video) seam behavior.** When nothing is playing and the bar would be absent, do the album and deck areas **abut directly**, or does the seam **reserve its space always** (placeholder bar)? *(Cross-check first: Phase 2a may already keep the bar always-present with a cued-next track, which could make this moot — verify before asking.)*
- **UX-D3 — Closed-deck zero state.** When no tab is open, how tall is the deck and what shows — just the rail strip, a peek, or a zero-state panel? This falls out of UX-D1 but is independently visible (it's what the user sees most of the time).
- **UX-D4 — Scroll-snap removal.** The seam model wants free scroll; today three sections snap. Confirming the loss of snap is acceptable (already flagged in `seam_scope` Phase 1) is a feel decision.

## Implementation details — execute without asking
- Which exact CSS property restores the rail's containing-block height (`min-height` on host vs. `.hr-deck`, or making `.hr-deck-body` in-flow) — an engineering choice within whichever model UX-D1 selects.
- Reworking `.hr-deck-body`'s `inset:0` into a flow box with a `30px` rail gutter; keeping `.hr-tab-strip` as the absolute overlay strip.
- Dropping the inline `position:absolute` on `.animated` (JSX:3522) and converting `S.panelPos` when the panel goes in-flow.
- Removing now-dead offsets: the already-gone `body:has(.pb) .hr-deck` lift, the `.ex-root` 64px bottom pad reserved for the fixed bar.
- The DOM relocation of `<PlayerBar>` between `.ex-main` and `<ExhibitFlow>`.
- `position:fixed → sticky` on `.pb` and the single-edge offset.
- Whether the dual-edge clamp ends up CSS-only or needs the JS scroll handler (3.2) — this is an implementation outcome, not a UX choice; just build whichever holds the spec.
- Preserving the committed equal-fill (`flex 1 1 0`) / vertical-label tab behavior through all of the above.

---

*Analysis only. No source files were edited; no build, commit, or deploy was performed. Structure sourced from `git show 044a235:<path>` + `git diff -- src/routes/hr/`. Line numbers are against the `044a235` blob unless marked (2b).*
