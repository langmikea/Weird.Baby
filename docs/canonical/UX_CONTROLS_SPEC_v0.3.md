# Weird.Baby Museum — UX Controls Specification

**Version:** 0.3
**Date:** 2026-04-24 (v28 simplification pass)
**Author:** Bit-Man (pruning session)
**Parent:** `UX_CONTROLS_SPEC_v0.2.md` (predecessor, now superseded by this file).
Prior predecessors: `UX_CONTROLS_SPEC_v0.1.md`. v0.3 is additive/corrective
over v0.2.
**Peer records:** `docs/FILTER_LOGIC_DECISION.md` (§3 decision).
`docs/KALEIDOSCOPE_v3_DECISIONS.md` (§7 mothballed).
`prototypes/prototype_a_v27.html` (reference implementation for §§4.8, 5.5,
6.5, 9).
**Ground truth:** `VISION_LOCK_v0.3.md`.

**What changed in v0.3 (v28 simplification pass):**
- **§7 Kaleidoscope mothballed for v1.** Full section preserved as
  decision record. Not a tab in the dock.
- **§5.5 Search** moved inside Deep Tracks tab. Not a peer tab.
- **§4.8 dock tabs** reduced from seven to five:
  `Artist Info · Media Formats · Deep Tracks · Presets · ✕`.
- **§6.5 Clear All** clarified — clears all, lives in tab strip. A
  prior retirement proposal (watch-list #10) retired as superseded
  by §3 filter logic.
- **§9 Presets** rewritten as spec (not demonstration). Shuffle and
  Loop moved here from §7. Inline APPLY / CLEAR SLOT / SAVE HERE
  actions; user slots top-left; Shuffle/Loop inline to the right.
- **§7.4 VU meter** gas-gauge semantics (1R/3Y/8G bottom-up).
  Superseded the v0.2 reverse-VU framing in v25 prototype and
  landed formally in v0.3.
- **§11 Open Questions** split: v1 questions (Q1–Q12) stay in §11,
  Kaleidoscope questions (Q13–Q17) moved to new §12 Post-Launch
  Questions.
- **§1.5 + §1.7** compressed Kaleidoscope proof points to notes;
  principles stand standalone.
- **Appendix A** segmented: v1 prototype (A v27), mothballed, and
  deferred-post-launch sections.

**Status markers** (unchanged from v0.1):
- **[locked]** — validated against a prototype, now spec.
- **[working draft]** — under active prototype work; may change.
- **[deferred]** — scope and rationale recorded; explicitly out of v1.
- **[MOTHBALLED for v1]** — new in v0.3. Validated design preserved for
  post-launch revival.

---

## §1 — Principles

Load-bearing. If you find a contradiction elsewhere in this spec, these win.

### 1.1 — Granularity is the unlock **[locked]**

Massive, deeply-granular tag vocabularies are *enabling*, not
overwhelming — provided two workflows both work:

- **Drill-from-above:** the visitor picks a coarse tag; counts on
  fine tags adjust, low-count specifics surface.
- **Dig-in-the-dirt:** the visitor picks a low-count specific tag
  first; counts on coarse tags contract to show what context that
  specific lives in.

Live counts keep the visitor oriented in both directions.

### 1.2 — Dig directly in the sand is first-class **[locked]**

A visitor must be able to reach any tag — regardless of tier — without
going through another tag first.

### 1.3 — Panels are lenses, not rooms **[locked, from UX_SPEC §C.5]**

Tag interaction filters the panel that is already there. It does not
generate a "results" zone. The content area rearranges in place.

### 1.4 — Dewey decimal framing **[locked]**

The tag vocabulary is a predefined, curator-authored, static, logical
classification. Tiers and groups serve visitor navigation, not
anything intrinsic about the items. The classification is virtual for
the user.

### 1.5 — Reusable-template principle **[locked]**

The tier component, the group component, and the pill component are
each reusable templates. Every tier is the same UI with different
content. Every group is the same UI with different tags. This
generalizes: the museum's UI is composed of instances of a small set
of templates.

*Validated also by the Kaleidoscope knob template (every knob is the
same knob with a different label). Kaleidoscope mothballed for v1 —
see §7 — but the principle stands for any future instance-based surface.*

### 1.6 — Search and direct tag manipulation are the same interaction **[locked]**

Search is a retrieval lens onto the same tag vocabulary, not a
parallel system. One system with two entry points.

### 1.7 — Mooshy dimensions are a feature, not a bug **[locked in v0.2]**

Some control surfaces use dimensions that are **legible in name but
slightly opaque in exact function.** A knob labeled "Depth" that does
*something about depth* is more enjoyable than one that does a
precisely specified thing. Target feel: the Dolby noise reduction
button. Cocktail-bar logic, not library-catalog logic.

**Why this isn't in tension with §1.1:** granularity (§1.1) governs
the tag system, which is the museum's **retrieval** layer — its
purpose is to find exactly the thing. A mood layer is the museum's
**mixer** layer — its purpose is to shift the feel without precision.
Different surfaces, different grammar. Both are legitimate; neither
is a defect of the other.

The boundary matters: any surface presented as a filter obeys §1.1.
Any surface presented as a mixer obeys §1.7. Don't mix them on a
single surface.

*Note: Kaleidoscope (§7) was the v0.2 proof point for this principle.
Kaleidoscope is mothballed for v1 but the principle remains valid and
applies to any future mixer surface — including whatever the
post-launch Kaleidoscope revival looks like.*

---

## §2 — Tag Vocabulary Architecture

Unchanged from v0.1. See v0.1 §2.

Summary: three nested levels (Tier → Group → Tag), three tiers in v1
(T1 Artist Info, T2 Media Formats, T3 Deep Tracks), curator-authored
vocabulary, fan authorship deferred.

---

## §3 — Logic

**[Locked in v0.2 late-session, supersedes v0.1 §3 summary.]**

The filter rule is: **within-group OR, across-group AND,
empty-group-silent.**

Stated over the catalog: an artifact is in the output if, for every
group that has at least one tag ON, the artifact carries at least one
of that group's ON tags. Groups with zero tags ON are skipped — they
do not constrain and they do not veto.

This applies uniformly to all three tier tabs (Artist Info, Media
Formats, Deep Tracks). No hybrid, no per-tier variation, no
strategy-pattern dict. One function, everywhere.

**Entry state:** all tags OFF. Empty-group-silent means every group is
silent at rest, the full catalog is visible, and the first click
narrows rather than emptying.

**Count display:** per-pill counts reflect *what this pill would
narrow to given the current state of other groups*. Selecting a tag in
one group updates counts in other groups, teaching the catalog's
shape. This is the v0.1 §3 count behavior; the v21 raw-cardinality
detour is retired.

**Empty result:** legitimate when across-group AND has no overlap.
Render per §8.5 ("nothing in this combination yet"). Rare in practice;
not a bug.

**Authoritative decision record:** `docs/FILTER_LOGIC_DECISION.md`.
That file has the pseudocode, the rationale (visitor's verb is
*shape*, not *narrow*), and what this rule replaces (THE LAW,
strict-per-group, hybrid proposals).

---

## §4 — Visual Grammar

§§4.1–4.7 unchanged from v0.1. See v0.1 §4.

### 4.8 — Dock integration **[locked in v0.2, from Prototype A v17]**

The controls surface lives in a **bottom dock** — a horizontal strip
pinned to the bottom of the viewport, peeking above the fold at rest
and expanding upward when engaged. Rationale: the content (panels,
spine, player) is the reason the visitor is here; the controls serve
the content and should not dominate it at rest.

**Locked v17 behaviors:**

- **Dock position: bottom only.** No top dock. No side dock. Consistency
  across exhibits.
- **Tab strip always visible.** At rest, only the tab tops peek above
  the fold, outlined in muted gold so they read as tabs (not a
  decorative strip). Peek height: 14px.
- **Five tabs, fixed order:** Artist Info · Media Formats · Deep
  Tracks · Presets · ✕. Tier tabs first, then Presets, then close.
  ✕ is a close affordance, not a fifth content area. (Kaleidoscope
  mothballed for v1 — see §7. Search merged into Deep Tracks — see
  §5.5.)
- **Hover behavior.** Hovering the tab strip after a 60ms delay lifts
  the strip to its full 42px height (tabs legible but no content
  panel). Moving away triggers a 450ms delay before collapse. Clicking
  a tab opens the full dock body.
- **Single dock height, shared across tabs, persisted.** The visitor
  sizes the dock once (via the top-edge resize handle) and that height
  applies to every tab and survives across sessions (localStorage).
  Rationale: per-tab heights proliferate memory and create surprise
  when switching tabs.
- **Dock height bounds:** minimum 200px, maximum 75% of viewport
  height. Default on first load: 480px.
- **Active tab signaled by:** brighter gold border, slight INK_SOFT
  fill (the only tab with any fill), and a 1px gold hairline beneath
  it where the tab meets the body. **Only the active tab carries any
  visual lift.** Inactive tier tabs remain at their rest color regardless
  of whether their tier has selections. The top-strip **Clear All**
  button (below) is the global signal that some filter is active; it
  appears only when the selection state is non-empty. The visitor who
  wants to know which tier holds the selection clicks in — this is
  acceptable because the tab-click cost is cheap and the alternative
  (per-tab indicators) adds chrome that competes with the content.
- **Clear All** lives in the tab strip itself, right of the tabs,
  shown only when any filter is active. Not in the dock body, because
  it applies across tabs.
- **Close (✕)** collapses the dock to peek. It does not clear state.
  Esc key behaves the same.

**Within tier tabs, pill layout is multi-column.** Each group is a
column: group label on top (bold, dashed underline, uppercase), pills
stacked below. Columns wrap to new rows when horizontal space runs
out. This is a change from the v0.1 assumption of full-width group
bands; v17 demonstrated that column layout reads cleaner at dock scale
and makes scanning faster.

**Pill width is globally equalized** across all groups, all tiers, all
tabs. Width is set by the widest label-plus-count pair in the entire
vocabulary. Rationale: pills that share a shape teach each other
(§1.5). Visitors learn the control once.

---

## §5 — Search

Unchanged from v0.1 with one clarification:

### 5.5 — Search placement **[locked in v0.2]**

Search lives **inside the Deep Tracks tab** as a surface at the top of
that tab's body, above the tag columns. Rationale: search is a
retrieval entry point into the same tag vocabulary (§1.6); Deep Tracks
is already the tab that holds the long tail and the "dig directly in
the sand" affordance (§1.2). Putting search there co-locates both
low-count tag discovery paths (browse the columns, type the name) on
one surface.

When Deep Tracks is open, the tab body contains, top to bottom:

- **Search input** — fixed at the top of the tab body, auto-focused
  on first open of the tab in a session. Returns to its last-typed
  value when the tab is re-opened.
- **Search results corral** (horizontal scroll of result pills) —
  present only when the search input has text. Empty search = no
  corral, no vertical space consumed.
- **Tag columns** — the normal multi-column Deep Tracks layout.

Pill behavior in the search corral is identical to pill behavior in a
tag column. Tapping a search-result pill toggles the tag exactly as
tapping the same pill in its column would. Both surfaces operate on
the same selection state.

Search is **not a peer tab** in v1. The earlier v17 dock put Search
on its own tab; v2+ experience consolidated that surface into Deep
Tracks because the functional distinction ("find a tag by name" vs.
"browse the sand") is smaller than the chrome cost of a dedicated
tab.

---

## §6 — Selection State and Clearing

Unchanged from v0.1 with one clarification:

### 6.5 — Clear-all placement **[locked in v0.2]**

Clear All lives in the tab strip (§4.8), not the dock body. It is
visually static (always the same place when present) and appears only
when any filter is active. Per v0.1 §6.2, it can render in a disabled
visual state when nothing is selected, or hide entirely — v17 chose
hide-when-empty. Either is spec-compliant; hide-when-empty preferred
for a cleaner tab strip at rest.

**Clear All clears all.** Every tag ON across every tab returns to
OFF. With within-group OR / across-group AND / empty-group-silent
filter logic (§3), "all off" is the natural rest state — the full
catalog visible, every group silent. One button, one semantic. A
prior proposal (watch-list #10, retired) had suggested scoping Clear
All to the Deep Tracks tab only; that proposal pre-dated the §3
filter logic decision and has no remaining rationale.

---

## §7 — Kaleidoscope **[MOTHBALLED for v1]**

> **Kaleidoscope is deferred from the v1 launch scope.** The section
> below is preserved as the decision record for when Kaleidoscope
> returns post-launch. Until then: Kaleidoscope is not a tab in the
> dock (§4.8 describes a five-tab dock that does not include it),
> Shuffle and Loop have moved to §9 Presets where they control
> player behavior directly, and the VU meter described in §7.4 is
> not rendered in v1. The spec text that follows describes a design
> that is ready to ship when the museum's v1 surfaces stabilize and
> the mood-layer question returns to the front of the queue.
>
> **Mothballed 2026-04-24.** Rationale: v1 scope simplification.
> Kaleidoscope adds a mixer-console surface on top of the tag
> surface; v1 proves out the tag surface first. The two surfaces
> are grammatically distinct (§1.7) and can be added on a
> post-launch cadence without revisiting the tag-layer design.

---

*Original §7 content — preserved as decision record:*

**[New in v0.2. Locked items validated against `kaleidoscope_v3.html`.
See `docs/KALEIDOSCOPE_v3_DECISIONS.md` for the decision record. Mood
dimension removed from v1 in the v23 session — see §7.3. Shuffle and
Loop moved to §9 Presets in the v28 simplification — see below.]**

### 7.1 — What Kaleidoscope is **[locked]**

Kaleidoscope is a **mixer console** — a control surface that shapes
what the museum presents by *feel* rather than by *precision*. It lives as a peer tab in the dock (§4.8), alongside the
tier tabs and other special-function tabs.

The tier tabs are filters: click a pill, narrow the set, clean cause
and effect. Kaleidoscope is a different animal: knobs, switches, and
a meter. Dimensions are **mooshy on purpose** (§1.7). You turn a knob,
the museum shifts, you like it or you don't.

Metaphor family: mixing console, cocktail bar, Dolby noise reduction
button, loudness compensation, "add a pinch of paprika."

### 7.2 — Four-layer architecture **[locked]**

Kaleidoscope is built in four separable layers. Each layer knows
nothing about the others' internals. This separation is the reason
Kaleidoscope's surface can evolve without a rebuild.

| Layer | Responsibility | Swap cost |
|---|---|---|
| **Data** | Catalog of artifacts with tags. Source of truth for content. | N/A — shared with rest of museum. |
| **Controls** | Reusable UI blocks: knob, switch, meter. Pure UI, no semantics. | New control block = new component. |
| **Recipe** | One pure function `(state, catalog) → filtered`. Defines what the knobs *mean*. | Swap wholesale to redefine the console's behavior. |
| **Console config** | An ordered list of `{ id, type, label }` entries that drives rendering. | Rename = one-line edit. Reorder = move an entry. |

Consequences:

- UI layer knows nothing about semantics. Renaming "Jitter" to "Drift"
  is a string edit.
- Recipe knows nothing about UI. Changing what "Depth" means is a
  pure function edit with no visual impact.
- Adding a knob means one config entry + recipe handling for its id.
  No new UI plumbing.

### 7.3 — Control set, v1 **[locked — but v1 scope retired; see header]**

**Three knobs + two switches** (in original design). The ceiling for
"fun, not frantic" at dock-strip size is **four knobs + two switches**;
original v1 shipped three knobs because the Mood dimension was retired
(watch-list #2, v23). The cap stands — a fourth knob can be added later
without breaking the grammar.

**Shuffle and Loop have moved to §9 Presets** (v28 simplification).
They govern player behavior, which is more naturally expressed as
player-surface controls than as Kaleidoscope switches. When
Kaleidoscope returns post-launch, Shuffle and Loop do NOT return
to it.

| Control | Type | What it does (mooshy) | Status |
|---|---|---|---|
| **Depth** | Knob | Surface hits ↔ deep cuts / rarities | Kaleidoscope (mothballed) |
| **Breadth** | Knob | Music-heavy ↔ everything balanced (90° to Depth) | Kaleidoscope (mothballed) |
| **Jitter** | Knob | Variance / scatter. Name provisional (see §7.6). | Kaleidoscope (mothballed) |
| **Shuffle** | Switch | Boolean. | **Moved to §9 Presets (v1)** |
| **Loop** | Switch | Boolean. | **Moved to §9 Presets (v1)** |

The knob count is deliberate. The console metaphor wants **more**
controls than strictly needed — abundance is part of the feel — but
more than six on a dock-strip console tips into frantic. Four knobs
plus two switches remains the cap; if Kaleidoscope returns with just
the three knobs, that's acceptable.

### 7.4 — Visual grammar **[locked]**

**Layout, three columns:**

- **Left:** 2×2 knob grid.
- **Center:** VU meter, vertical.
- **Right:** stacked pill switches.

**Knob behavior:**

- Visual indicator: thin gold line on face, rotates −135° to +135°
  across the knob's 0–1 range.
- Drag: right OR up = increase, left OR down = decrease. Combined
  delta; diagonal drags feel natural.
- Hover readout: numeric value (0–100) appears inside the knob on
  hover, 60ms fade in / 450ms fade out. Matches dock hover timing
  (§4.8) — same grammar, same rhythm.
- **Readout rule:** the hover readout shows the **input state** (where
  the knob is). It does not show output (what the knob produced).
  Inputs and outputs are grammatically distinct (see §7.5).

**Switch behavior:**

- Pill-shaped, knob slides left (off) / right (on).
- Click to toggle. No drag.

**VU meter:**

- **Vertical segmented column,** 12 segments stacked bottom-to-top.
- **Gas-gauge semantics.** Bottom-to-top: **1 red, 3 yellow, 8 green.**
  Full tank (all 12 lit) = all green topped out; the meter drains
  downward as the filtered set grows small, through yellow, down to the
  lone red segment at the bottom that signals "empty — you are sitting
  still." Standard fuel-gauge reading: green = good, yellow = running
  low, red = out. No convention to learn.
- **Transient pop on change:** when the target jumps, the meter
  briefly overshoots (~120ms settle) before resting. Communicates
  "something happened" in peripheral vision.
- **Peak marker:** a white segment at the highest recent level, holds
  for 800ms, then decays at ~400ms/segment. Standard VU vocabulary;
  kept as-is.
- **No numeric % readout.** The meter is the readout. (See §7.5.)

**Ambient motion:**

- Gold hue drifts on a 90s cycle (cosmetic, unrelated to state).
  Respects `prefers-reduced-motion`.
- See §7.7 for the Weird switch / Weirdness slider, which governs
  visual intensity beyond this baseline.

### 7.5 — Inputs and outputs are grammatically distinct **[locked]**

**Knobs and switches take input. Meters show output. Never put a
persistent output readout on a knob face.**

The hover-readout on a knob is showing the input state (current
setting) — that's acceptable. A meter on a knob face showing filter
effect would cross the grammar line.

Why this matters: the console's legibility depends on the visitor
knowing at a glance which surfaces they can act on and which ones are
telling them something. Mixing the grammar makes both roles harder to
read.

Corollary: **peripheral snap beats smooth motion.** Segmented VU
beats a swung needle. Humans detect discrete changes in peripheral
vision better than continuous ones. This is why the meter is
segmented, not a sweeping dial.

### 7.6 — Parked items **[working draft]**

Items identified during the v3 prototype cycle but not yet locked:

- **Jitter naming.** Candidates considered: Drift, Jitter, Spread,
  Wander, Scatter. Jitter won v3; not locked. Resolves in a future
  prototype cycle or in language review.
- **Mode lights.** Three dim labels at the console header (linear /
  shuffle / loop) are present in v3 as placeholder output lights.
  They are not yet wired. Three paths under consideration:
  (a) mirror the switches — dead weight, rejected on grammar grounds
  (§7.5, output shouldn't duplicate a visible input);
  (b) fire based on derived state from other knobs — on-vibe but risky;
  (c) show external player status (is audio playing, track progress,
  loop state) — this is the only option that gives them a distinct
  job. Parked until the player integration story is clearer.
  Alternative: retire the header strip entirely and use that real
  estate for the Weird switch / Weirdness slider (§7.7).
- **Real catalog integration.** v3 uses 200 fake artifacts. Waits on
  real tag data for whichever exhibit Kaleidoscope ships in first
  (likely HR).
- **Dock wiring.** Kaleidoscope is currently a free-standing
  prototype. Integration into the v17 dock as a real tab is a
  separate prototype cycle.
- **Mobile / touch.** Drag semantics don't translate to touch
  gestures. Touch surface is a separate design problem; not in v3
  scope.
- **Retro-tag aesthetic.** An earlier design direction ("tags done
  retro") parked for when full museum aesthetic locks.

### 7.7 — Weird switch / Weirdness slider **[working draft — not yet prototyped]**

A second console surface proposed for Kaleidoscope, **visuals-layer
only**. Shapes the ambient motion and chrome of the museum UI itself,
not the content it presents.

**Role:**

- Discovery toy, not daily control. Visitor encounters it, plays with
  it, probably rarely returns. Like the easter-egg grass field (§VISION)
  but with a volume knob.
- **Scope is visuals only.** Color, tint, sparkle, flash, disco-ball
  ambient effects, psychedelic cycling. Not audio. Not content
  selection. Not playback behavior.

**Scale:**

- **Low setting:** tint addition, slow cycling. Present but calm.
- **High setting:** "tripping heavily." Saturated, shifting, patterned.
- **The ceiling is character, not intensity.** At no point does
  Weirdness become a throbbing, flashing, overstimulating
  assault. Weird, not obnoxious. A heavy trip that stays watchable.

**Hard constraints:**

- **No strobe. No flashing below ~3Hz.** This is both aesthetic (the
  Fountain Principle — calm motion, not throbbing motion) and an
  accessibility requirement (photosensitive visitors). State the
  constraint explicitly; don't rely on it being obvious from the
  aesthetic goal.
- **Respects `prefers-reduced-motion`.** At any Weirdness setting,
  users who have asked their OS for reduced motion get the low-motion
  baseline regardless of slider position.

**Open questions, to resolve in prototype:**

- Slider-only or switch + slider? (Switch = "weird on/off", slider =
  "how weird." Mike's note suggests both.)
- What real estate does it occupy? Candidate: the console header
  strip currently held by Mode lights placeholder.
- Does it affect the panel area, the dock, or both? Likely both, but
  bounded (the dock probably doesn't sparkle while a visitor is
  reading a pill label).
- Persistence: per-session, per-visitor (localStorage), or always
  resets to off?

Parked for its own prototype cycle. Not in v3.

---

## §8 — Integration with Panels

*(This was §7 in v0.1. Content unchanged. Renumbered for v0.2.)*

### 8.1 — Scope of this section **[working draft]**

This section describes how the tag control surface integrates with the
museum's panels (P1 Fact Scroller, P2 Social Archive, P3 Artifacts,
P4 Exit Flow / Journal — see UX_SPEC §C.5). Prototype A v4 validated
the control surface itself but used a generic card stack as the
content area. How tag state affects *real panel shapes* has not been
prototyped.

### 8.2 — Panels filter in place **[locked, from UX_SPEC §C.5]**

Tag narrowing affects each panel's content *in place*. The panel does
not vanish, move, or restructure. It narrows.

### 8.3 — Spine behavior under tag state **[working draft]**

Options: (a) spine ignores tag state; (b) spine dims unmatched tiles;
(c) spine reorders or re-scopes. Recommendation: (a) or (b). Prototype
before locking.

### 8.4 — Player behavior under tag state **[working draft]**

Options: (a) player ignores tag state; (b) player's "next up" queue
narrows; (c) filter change interrupts playback. Recommendation: (a)
or (b). (c) is almost certainly wrong — interrupting playback when
the visitor was listening to something they picked is hostile.

### 8.5 — Empty-state behavior **[working draft]**

Per UX_SPEC §L.2 pattern: a quiet line, "nothing in this combination
yet." Not "no results found" / "try a different search" / "0 items."

### 8.6 — Cross-panel coordination **[working draft]**

Shared filter state across all panels is recommended (simpler, matches
mental model). Per-panel state is an alternative worth prototyping
before dismissing.

### 8.7 — Kaleidoscope's relationship to panels **[working draft, new in v0.2]**

Kaleidoscope is a filter-layer surface (it narrows what's shown) but
with mooshy semantics (§1.7). Its relationship to the tag tier
filters is additive but grammatically separate:

- Tag filters: deterministic, visitor authors the exact constraint.
- Kaleidoscope: probabilistic/mood-based, visitor shapes the feel.

Whether they combine (AND across both surfaces) or are mutually
exclusive modes (one active at a time) is **open.** Combining feels
right in principle (they're different grammars on the same catalog)
but may produce confusing results in practice. Resolve in the
integration prototype cycle.

---

## §9 — Presets

*(This was §8 in v0.1. Expanded and redirected in v0.2 + v28.)*

### 9.1 — Purpose **[locked in v28]**

A preset is a saved filter + player state that the visitor can
return to with one tap. In v1 the preset surface also hosts the
player behavior controls (Shuffle, Loop) that were originally drafted
in Kaleidoscope — v28 simplification consolidates "ways to shape what
the museum plays" onto one tab.

v1 ships a **working Presets surface.** This is no longer
demonstration; it is spec.

### 9.2 — Layout **[locked in v28]**

The Presets tab body has, left to right, top row:

- **User slots (top-left).** Named, saved preset states. v1 ships
  three slots (P1, P2, P3) matching the v17 demonstration count.
  Each slot shows its saved filter state at a glance (era, venue,
  or other distinctive tag if present) or the word "empty" in dim
  text if unsaved.
- **Shuffle and Loop (inline to the right of the slots).** Pill
  switches matching the pill grammar elsewhere in the dock. Shuffle
  randomizes the player's next-up queue; Loop replays the current
  selection on end. Both are persistent across tabs within the
  session; both are part of the preset save state.

A factory-presets section lives below the user slots row. Factory
presets are curator-authored filter states offered as starting
points (e.g., "rare audio," "live only," "demos and outtakes").
Factory presets do not save; they apply.

### 9.3 — Slot actions **[locked in v28]**

Per slot, inline (not in a separate "SAVE CURRENT" bar):

- **APPLY** — load this slot's saved state into the current filter +
  player state. Shown when the slot is non-empty.
- **CLEAR SLOT** — empty this slot. Shown when the slot is non-empty.
- **SAVE HERE** — write the current filter + player state into this
  slot. Shown when the slot is empty or when the current state
  differs from what's saved.

These three actions are inline with the slot itself — the slot is the
primary object, the actions operate on it.

### 9.4 — What saves **[locked in v28]**

A preset captures a **state snapshot** at save time:

- Every ON tag across every tab
- Shuffle state (boolean)
- Loop state (boolean)
- Currently playing track (ID + position in seconds + which album, if any)
- Currently focused spine position (album in focus)

A preset does NOT capture:
- Dock height (that's a visitor preference, separate)
- Search input text (ephemeral)

**What APPLY does with the snapshot is deferred.** v1 ships the data
capture; the exact APPLY semantics — does the player jump to the
saved track and position, or does it just reshape the filter and let
whatever is currently playing continue — can be decided post-launch
without schema changes. The snapshot is cheap and reversible; the
behavior is a design call that benefits from live-use evidence.

### 9.5 — Outstanding design questions **[deferred]**

- Named vs automatic presets (v1 ships named)
- Museum-wide vs exhibit-scoped (v1 ships exhibit-scoped)
- Shared-preset URL entry pattern
- Persistence across session cookie expiry (v1 uses localStorage)
- Preset as a first-class contribution kind (deferred post-launch)

---

## §10 — Fan Authorship

*(This was §9 in v0.1. Unchanged. Renumbered.)*

Deferred for v1. See v0.1 §9 for rationale.

---

## §11 — Open Questions

*(This was §10 in v0.1. Pruned for v28 — Kaleidoscope questions moved
to §12 Post-Launch Questions, since Kaleidoscope is mothballed.)*

### Active questions (v1 scope)

| # | Question | Status |
|---|---|---|
| Q1 | Multi-term search: space-as-OR or space-as-AND? | [working draft] |
| Q2 | Subgroups within a group? | [working draft] |
| Q3 | Should the selection summary line be interactive? | [working draft] |
| Q4 | Panel behavior under tag state — each of P1/P2/P3/P4 | [working draft] |
| Q5 | Spine behavior under tag state | [working draft] |
| Q6 | Player behavior under tag state | [working draft] |
| Q7 | Cross-panel coordination: shared state or per-panel? | [working draft] |
| Q8 | T3 auto-promotion on count threshold | [deferred] |
| Q9 | Per-tier or per-group clear buttons | [deferred] |
| Q10 | Fan-proposed tag workflow | [deferred] |
| Q11 | Preset architecture (base behavior locked v28; extensions) | [deferred] |
| Q12 | Cross-exhibit tag vocabulary — HR and CB T1 schema sharing | [deferred] |

---

## §12 — Post-Launch Questions

Questions tied to mothballed or deferred surfaces. Return to these
after v1 ships and launch pressure clears.

| # | Question | Status |
|---|---|---|
| Q13 | Jitter's final name (Drift / Jitter / Spread / Wander / Scatter) | Post-launch, Kaleidoscope revival |
| Q14 | Mode lights — wire or retire (see §7.6) | Post-launch, Kaleidoscope revival |
| Q15 | Weird switch / Weirdness slider — scope, placement, persistence | Post-launch, Kaleidoscope revival |
| Q16 | Kaleidoscope ∩ tag filters — combine or exclusive modes? | Post-launch, Kaleidoscope revival |
| Q17 | Kaleidoscope preset storage — same store as tag presets, or separate? | Post-launch, Kaleidoscope revival |

---

## Appendix A — Validation Status

**Validated against Prototype A v4:**
- §1.1–1.6
- §2 entire
- §3 entire
- §4.1–4.6, §4.7 (partial — tier-default state only, not persistence)
- §5.1, 5.2, 5.4
- §6.1–6.4

**Validated against Prototype A v17 (v0.2):**
- §4.8 (dock integration) — original seven-tab version

**Validated against Prototype A v27 (v28 simplification):**
- §4.8 (dock integration, five-tab version)
- §5.5 (Search inside Deep Tracks)
- §6.5 (Clear All placement + "clears all" semantic)
- §9 (Presets — user slots, Shuffle/Loop inline, APPLY/CLEAR SLOT/SAVE HERE)

**Mothballed (validated, retired from v1):**
- §7 entire — Kaleidoscope. Validated against `kaleidoscope_v3.html`.
  Returns post-launch.

**Deferred post-launch (no v1 prototype):**
- §1.7 second surface (Kaleidoscope revival)
- §8 entire (panel integration — depends on panel work not in v1 dock scope)

**Out of scope for v1, with hooks:**
- §10 (fan authorship)

---

## Appendix B — Relationship to other specs

| Document | Relationship |
|---|---|
| `VISION_LOCK_v0.3.md` | Ground truth. This spec serves it. |
| `UX_SPEC_v0.3.md` §C.5.0 | Parent. This spec expands what §C.5.0 deferred. |
| `UX_SPEC_v0.3.md` §C.5 (panels) | Peer. §8 integrates; full panel spec lives there. |
| `UX_CONTROLS_SPEC_v0.1.md` | Direct parent. v0.2 is additive. |
| `docs/KALEIDOSCOPE_v3_DECISIONS.md` | Peer decision record. §7 of this spec codifies its [locked] items. |
| `prototypes/prototype_a_v17.html` | Reference implementation for §4.8, §5.5, §6.5. |
| `prototypes/kaleidoscope_v3.html` | Reference implementation for §7.1–§7.5. |
| Future: `UX_PRESETS_SPEC.md` | Child. Extends §9. |
| Future: `UX_KALEIDOSCOPE_SPEC.md` | Possible child if §7 grows large enough to warrant extraction. |

---

*End of UX_CONTROLS_SPEC_v0.2.*
