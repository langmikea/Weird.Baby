# Weird.Baby Museum — UX Presets Spec, v0.4

**Date:** 2026-06-05
**Status:** Working draft v0.4. Not locked. Verified against live code (Cowork drift ledger, 2026-06-05). Produced from a live design session (Mike + system engineer) plus a full read of the canonical set.
**Fills:** `UX_CONTROLS_SPEC_v0.4 §C.5.0` names a "forthcoming `UX_PRESETS_SPEC`." This is that document's first draft.
**Authority above this doc:** `CANON_UX_LIFECYCLE_SPEC_v0.5` (F=ma, preset-as-artifact), `CANON_VISION_LOCK_v0.3`, `CANON_UX_SPEC_v0.3` (§C.5.0, §N.2, §N.7), `CANON_UX_CONTROLS_SPEC_v0.4` (§8.4, §9). Where they speak, they win. This doc adds what they don't say and records this session's decisions.

---

## §0 — What a preset is (grounded, not invented)

A preset is **an artifact** (`UX_LIFECYCLE_SPEC §4.5`, §1 #8). It carries tags, has a stable internal identity, and can be featured, shared, scheduled, and retired through the same mechanisms as any album or video. It is **a single slice** — one configuration; there is no chaining (locked 2026-05-12). It is **shareable** via a cryptic-but-stable short URL (`weird.baby/p/<shortid>`) that resolves to the preset's internal identity.

F=ma consequence: a preset is not a special UI mechanism. It is data, like everything else. The localStorage snapshot machinery currently in `HrExhibitFlow.jsx` (schema v1, `focusedAlbumId`, self-heal) is the **anonymous-session persistence substrate** beneath the artifact model — correct and useful for v1's session-scoped, account-less world (`VISION_LOCK T-02`), but it is not the model. The model is the artifact.

**There is no preset-less state** (`UX_LIFECYCLE_SPEC §4.2`). The museum's entry state *is* a preset, tagged as the entry preset for that surface, swappable by the operator at runtime. The visitor always stands inside some preset. "Now Playing" / "Active View" = the preset currently in effect.

---

## §0.1 — This layers onto the existing framework; it does not replace it

**Load-bearing constraint (Mike, this session).** Everything in this spec is implemented by wiring the preset/verb behavior **into the museum's existing surfaces** — the real coverflow shelf, the dock, the tracklist with its variant pills, the persistent player. The companion prototype's boxed two-column layout is a *thinking instrument only*; it is not the target UI. A build must not introduce a parallel "presets screen" that supplants the current views. Save / Play / Show / Reset / Now Playing attach to the surfaces that already exist (`UX_SPEC §C`, §N; `UX_CONTROLS_SPEC §9` presets tab).

---

## §1 — The two scopes (built, specced, confirmed)

The museum already runs two independent filtering surfaces. This is not a proposal; it is in code and promoted to spec.

**The Player (jukebox).** `UX_SPEC §N.7`: the persistent player keeps a track playing while the visitor browses to a different album; an audio-only overlay signals that what is *seen* is loosely coupled to what is *heard*. The player has its own selection — what is stocked and playing — independent of the wall.

**The Deck (wall).** The coverflow + the dock's tier/group/tag filters (`UX_CONTROLS_SPEC §3`: within-group OR, across-group AND, empty-group-silent). Shapes what the visitor browses.

**They filter independently.** Changing the deck does not interrupt the player (`UX_CONTROLS_SPEC §8.4`: interrupting playback the visitor chose is hostile). Changing the player does not move the wall.

**A preset captures both scopes.** (Mike, this session.) One snapshot spans the jukebox state and the deck state.

---

## §2 — Variant grammar (the "stock the jukebox — source" question, resolved by canon)

Per `UX_SPEC §N.2`, variant selection is **already locked as radio semantics**:

- Each track row carries its available variants (Official / Live / Lyrics / Cover — taxonomy in `hunter-root.js`). Availability is uneven: some tracks have only Official, some have Live, etc.
- **At most one variant active per track at any time.** Mutually exclusive within the row.
- Clicking an inactive variant activates it and deselects the prior. Clicking the active variant deselects it → row returns to no-variant-selected.
- This is one-of-N with the option of zero. Not checkboxes.

**Consequence for "stock the jukebox":** version selection is **per-song**, not a global preference. A catalog-wide "prefer Official, fall back to live" toggle would fight this grammar and silently mishandle uneven availability. The jukebox is stocked by the per-row variant radios plus shuffle and loop. (This corrects the flat source-pills in prototype v1/v2.)

**Default which version plays:** there is no separate "default version rule" because there is no preset-less state (§0). Whatever the active preset holds *is* the default. (Mike, this session.)

---

## §3 — The verbs (this session's decisions)

| Verb | Acts on | Behavior | Source |
|---|---|---|---|
| **Save** | both scopes | Writes the current jukebox + deck state into a preset (an artifact). Names it (editable; defaults to a filter summary). | Mike: rename from "SAVE HERE" |
| **Play** | both scopes | Commits a saved preset — jukebox + deck become the Active View. Replaces the old "Apply." | Mike: "Apply should say Play" |
| **Show** | deck only | Peeks at a preset's wall **without committing**. The jukebox keeps playing untouched. Nothing commits. | Mike + §8.4 |
| **Reset** | one slot | Empties a user slot. Replaces "CLEAR SLOT." | Mike: rename |
| **Now Playing** | both scopes | Returns the visitor to the Active View (the committed preset) after a Show peek. | Mike |

**Active View** (Mike's definition, locked for this doc): *the Player and Deck output resulting from the committed filters and settings.* Both scopes. It is "where you actually are."

**Show is consequence-free** because the deck is independent of the jukebox (§1) and there is no preset-less limbo (§0): a Show peek changes only the wall; the music plays on; nothing needs a Keep/Cancel step. Best-practice basis: preview-without-commit is a recognized pattern, but hover-based preview is rejected (undiscoverable, touch-hostile, accessibility-poor) — Show is an explicit, sticky, single-action peek with an explicit return (Now Playing).

**Idle auto-return** (Mike): after a Show peek, if the visitor does not touch anything *and* the jukebox advances to a new album, the wall returns to the Active View on its own — automatic Now Playing. (Timing TBD by feel; prototype uses a short value to make it testable.)

---

## §4 — Mobile floor (Mike + `VISION_LOCK G-10`)

Desktop is the museum's home: both scopes side by side, full deck filtering. The **phone floor** is narrower and specific: the **player (jukebox)** and the **default (factory) presets** must be usable. Deep deck filtering and wall-browsing ride in the back seat on mobile. `G-10` shape: spine as vertically-scrollable album tiles, one tap to open, persistent mini-player at bottom. The Show / Now Playing / Active View loop must remain legible when the deck is de-emphasized — a stress test of the model.

---

## §5 — Open questions (for the prototype to resolve by feel, then lock)

These are genuinely undecided and are what the prototype exists to answer:

1. **Now Playing placement** — a row among the preset slots (live, un-saveable Active View), a control near the player, or both? (Prototype tries "both" to react against.)
2. **Show's visual treatment** — how does "peeking vs committed" read at a glance? (Prototype uses a status ribbon + dashed peek outline.)
3. **Idle auto-return timing and trigger** — gentle or startling? Tie strictly to "jukebox advanced + idle," or simpler?
4. **Naming UI** — name-on-save dialog vs inline-editable slot label. (Prototype uses inline.)
5. **Shared-preset landing** (`UX_SPEC §C.5.0` Q3) — does `weird.baby/p/<id>` land at the Lobby first (default per §L.1) or directly in the preset state? Canon default is Lobby-first; confirm.

---

## §6 — Verify-against-live (Cowork brief; host-side only)

This draft rests on the five Drive-reachable canon docs plus the live deployed site. The following are **host-side only** (referenced by canon, not synced to Drive) and must be read by Cowork on Mike's machine before any integration code is written:

- `CANONICAL_VOCABULARY.md` — tag tier vocabulary; confirms how variant/era/source tags are actually structured.
- `DATA_WORKFLOW_SPEC_v0.2.md` — sovereign tag set, vocabulary-as-data, stable-ID rules.
- `STATE.md` — current project state and backlog.
- `weird-baby-museum` working tree — confirmed current repo (the `weird-baby-update` Drive copy is stale/retired). Specifically: `HrExhibitFlow.jsx` (preset machinery; persistence + hardening confirmed present, capture unwired), `Exhibit.jsx` (§N.7 audio-only overlay, §N.2 variant radios, player state), `hr_dimensions.js` (the `TIER_BY_NAMESPACE` heuristic flagged as drift in `LIFECYCLE §4.3`), the spine adapter `hunter-root-spine.js`.
- `prototype_a_v27.html` — the reference implementation for `UX_CONTROLS_SPEC §§4.8/5.5/6.5/9`.

**Cowork's task:** produce a drift ledger — for each item in this spec, does the live code match, partially match, or contradict it? Particular targets: is preset-as-artifact reflected anywhere, or only the localStorage snapshot? Is entry-state-as-preset implemented (`LIFECYCLE §5` says "likely no such mechanism today")? Does the variant radio (§N.2) match this spec's §2? The ledger tells us how far the built system sits from this spec before integration begins.

---

## §7 — Drift ledger results (Cowork verification, 2026-06-05)

Confirmed against the live `weird-baby-museum` tree:

- **MATCH:** variant radio grammar is verbatim (`handleTagClick`); preset persistence + id-hardening landed (`PRESET_SCHEMA_VERSION=1`, `focusedAlbumId`, self-heal).
- **PARTIAL:** capture is null-stubbed (`playingTrack`/`spinePosition` `useState(null)`, no setters, ~L3041–3042).
- **ABSENT:** artifact model, `/p/<id>` sharing, entry-state-as-preset, Show, Now Playing, idle-return. These are all net-new.
- `weird-baby-update` is dead code — zero refs. (Drive should still be re-synced so look-ups don't mislead. Ops.)

**Update 2026-06-06:** the PARTIAL row (null-stubbed capture) and the Show / Now Playing entries in the ABSENT row are historical — capture is wired and the Play / Show / Now Playing verbs landed. See §9. (Artifact model, `/p/<id>` sharing, entry-state-as-preset, idle-return remain absent.)

Spec corrections from the ledger:
- `TIER_BY_NAMESPACE` heuristic is **gone** — replaced 2026-05-19 by the `vocabulary.json` registry. Vocabulary-as-data is **implemented**, not pending. (Earlier draft was stale.)
- Prototype reference is `prototype_a_v28_3.html`, not v27.

---

## §8 — Prerequisites (must precede any build) [from ledger]

Two spec-vs-framework conflicts surfaced that block implementation until resolved:

### §8.1 — Mobile presets surface [RESOLVED 2026-06-05, Mike]
**Finding (live inspection at 390px):** the tabbed dock does not merely hide at ≤720px — it collapses into a single vertical scroll. Filter groups (SOURCE, CONTENT KIND, CARD KIND) and the artifact deck linearize into stacked, tappable sections; the desktop tabs become a legend in body copy. **Presets are the one section that did not make this transition** — hence unreachable on phone. So this was a missing section, not a hard hide.

**Resolution:** add a **PRESETS section to the mobile vertical scroll**, using the pattern the filter groups already establish (stacked header + tappable rows). Specifically:
- Factory/default presets render as full-width tap rows, each offering **Play** (commit) and **Show**. This satisfies the mobile floor (player + default presets usable on phone).
- **Mobile is view-and-apply only** (Mike): no Save / name / Reset slot authoring on phone. Slot authoring stays desktop-only. Mobile presets are for *steering with the defaults*, not creating them.
- **Placement: high** in the scroll (near the player/coverflow), treating presets as primary steering rather than an afterthought.
- No new interaction grammar required — reuses the existing stacked-section pattern.

(Note: this resolves the §4 mobile-floor contradiction. The remaining work is wiring, gated only by §8.2.)

#### §8.1.1 — Build scoping note (Cowork, 2026-06-07 — scoped, NOT built)

Verified against the live tree at `dcd4f7e`.

**How the mobile layout is produced.** There is no separate mobile component. The "Mobile (O11)" block in `HrExhibitFlow.css` (`@media (max-width: 720px)`, ~L1161) hides the deck chrome (`.hr-tab-strip`, `.hr-deck-body`, the animated deck panels) and shows `.hr-mobile-pills` — a stacked pill-column container that `HrExhibitFlow.jsx` renders **unconditionally** as the first content child of `<section className="hr-section">` (~L3308). Visibility is CSS-only so the React tree stays stable across the breakpoint. The mobile vertical scroll is therefore: `Exhibit.jsx`'s coverflow / tracklist / video / facts panels, then this section (inline filter pills + 2-column artifact grid), with the fixed PlayerBar at bottom.

**Which component renders presets on desktop.** `PresetsContent` (`HrExhibitFlow.jsx` ~L2556), mounted only as the deck's Presets tab body (~L3417) — unreachable on mobile because the entire deck is `display: none`, which is exactly the §8.1 finding. Factory presets are the in-file `FACTORY_PRESETS` array (~L178; five deck-scope filter recipes). User slots P1–P3 and shuffle/loop also live in `PresetsContent` but stay desktop-only per the resolution above.

**Mount point.** A new `.hr-mobile-presets` block inside `hr-section`, immediately **before** `.hr-mobile-pills` — the highest point of the scroll this component controls, directly after the player/coverflow in the page scroll. Satisfies "Placement: high."

**Minimal change (two files; contained):**

1. `HrExhibitFlow.jsx` — hoist `applyFactoryPreset` (currently closed over inside `PresetsContent`) to `HrExhibitFlow` scope; it needs only `setSelected` / `setPeekSelected` / `HR_DIMENSIONS`, all already in scope there. Add a factory Show analogue: `setPeekSelected(<the preset's apply()-shaped selection>)` — `peekSelected` already overlays the artifact filter (`tagFiltered`, ~L3139, including the `__randomIds` path in `matchFilter`). Render `FACTORY_PRESETS` as full-width tap rows with **Play** / **Show** buttons, plus a peek-return "now playing ↩" chip when `peekSelected !== null` (the desktop chip lives inside the hidden deck, so mobile needs its own). No new state, no new interaction grammar — the stacked-section pattern `.hr-mobile-pills` establishes.
2. `HrExhibitFlow.css` — `.hr-mobile-presets { display: none; }` on desktop, plus rules inside the existing O11 media block, mirroring `.hr-mobile-pills`.

No `Exhibit.jsx` change, no new props across the §9 seam, no Save / Reset / naming on mobile (view-and-apply only).

**Flags (what could make it more than a contained change):**

- **Factory presets are deck-only recipes** — they carry no player/jukebox state. Mobile Play on a factory preset steers the wall but never stocks the player. If the §4 mobile floor ("the player and the default presets must be usable") is read as factory presets *driving the jukebox*, that requires authoring player state into `FACTORY_PRESETS` and restoring it through the §9 seam — net-new content + wiring, beyond this scope. Decide before build.
- **"Surprise me" re-rolls per call** (`apply()` draws 3 random ids each invocation): Show-then-Play would peek one set and commit a different one. Either compute once per row interaction or accept the re-roll.
- **`HrExhibitFlow.jsx` is ~152 KB** — far past the Edit-tool truncation boundary; build edits must use anchor-based Python patches with byte verification (CLAUDE.md hard rules).
- Idle auto-return (§5 #3) remains unbuilt and is **not** part of this change.

### §8.2 — Stable track + variant IDs [RE-SCOPED 2026-06-05; LANDED 2026-06-06]

**Contract as-found (read from `src/data/exhibits/hunter_root.json`, the foundation export the adapter consumes — NOT the album-registry file):**
- **Every media item already has a stable `id`** (e.g. `MV-HR-20260417-001`). The earlier claim "tracks carry no IDs" was wrong — it described the album registry (`hunter-root.js`), not the real source. Track/variant identity already exists.
- **The variant model is FLAT, not nested.** Each rendition is its own first-class item in `tracks[]` with its own `id`, `media_type` (audio|video), `primary_url`, `title`, `tags`. The official video and the audio recording of the same song are *separate items*, not a nested `videos[]`. (Corrects the v0.2 nesting assumption.)
- **`song` is the GROUPING key**, not identity. Items sharing a `song` slug are renditions of one song. The variant radio (§N.2 "one version per song") = "choose one item from the set sharing a `song`."

**Coverage finding (full scan):** of ~90 media items, 81 have a `song` slug; the ~15 without are **all audio recordings** — videos were slugged, audio was not. The song name is in each title ("Dead Man — audio recording"). Audio variants currently orphan from their song group.

**Re-scoped work (smaller + mechanical):**
1. **IDs:** none to create. Propagate the existing item `id` onto the spine track object in the adapter (`hunter-root-spine.js`, currently drops it). One adapter change.
2. **Variant key:** renditions (inside `videos[]`) have NO id of their own — only tracks do. Derive in the adapter: `id = ytId ?? slug(audioUrl)`.
3. **Data task (the only one):** backfill `song` on the ~15 audio items, derivable from title and/or the matching video's slug. Mechanical, ~15 edits. Prerequisite for the §N.2 radio to group audio with video.

**Preset consequence:** per-song variant capture references the item `id` directly (stable, present). Apply-time resolution against the rebuilt export. No positional indices.

**Status (2026-06-06):** all three items landed — `song` backfill (9bbeb91), adapter id propagation + derived variant id (49cd044: every spine `track` carries `id`, every rendition carries `id = ytId ?? slug(audioUrl)`). No longer a blocker.

## §9 — Implementation seam (Q5, from ledger) [IMPLEMENTED 2026-06-06]

The single boundary between the two scopes is the `<ExhibitFlow>` element in `Exhibit.jsx`. **Chosen state-crossing mechanism: prop-widening at that existing seam** — the least invasive of the options this section anticipated (no context, no lifted state):

- **Capture (down):** `activeAlbumId` (the focused album's stable id) and `playingTrack` (`{ albumId, trackId, variantId }`, stable ids derived from the spine objects; `null` when idle) flow as props into `HrExhibitFlow`, replacing the former `useState(null)` stubs. `makePresetSnapshot` records them as `focusedAlbumId` + `playingTrack` — real state, schema v1 unchanged.
- **Restore (up):** an `onRestorePlayer` callback prop. `Exhibit.jsx` resolves the saved ids back to *current* spine indices at apply-time (ids are durable; indices are derived). A missing variant falls back to the track's first available rendition; a missing track or album degrades to focus-only. The restore reflects the active row + variant radio in the tracklist, then drives the player.
- **Verbs (§3) wired on the desktop slots:** Play (commits both scopes — the only verb permitted to interrupt active playback, per controls §8.4; presets saved while idle leave playback alone), Show (deck-only peek via a `peekSelected` overlay on the artifact filter; the jukebox is untouched and nothing commits), Now Playing (clears the peek, returning the wall to the Active View), Reset, Save.

Still open after this build: idle auto-return (§5 #3), shuffle/loop player semantics (O9), the mobile presets section build (§8.1 — design resolved), and the artifact/share model (§0).

---

*End of UX_PRESETS_SPEC v0.4 DRAFT. Not locked. Verified against live code via Cowork drift ledger 2026-06-05. Companion prototype: `prototype_presets_v3.html` (thinking instrument only — not the target UI, per §0.1).*
