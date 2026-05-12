# Museum UX Lifecycle Spec, v0.4 (reconciled)

**Date:** 2026-05-12
**Status:** Reconciled with canonical docs. Operator review pending.
**Authority:** This spec extends and integrates `UX_SPEC_v0.3.md`, `VISION_LOCK_v0.3.md`, `UX_CONTROLS_SPEC_v0.3.md`, and `CANONICAL_VOCABULARY.md`. Where they speak, they are authority. This spec adds what they don't say.

**Supersedes:** The draft `UX_LIFECYCLE_SPEC.md` from earlier in this session, which reinvented material already covered by the canonical docs. This v0.4 is the proper place for it.

---

## §0 — The Principle: F=ma

**Locked, operator-direct.**

Everything in the museum is exactly the same as everything else, except for the data it contains. Tags inform the system what to show, when, and where. Everything is a tag.

The system is **database-index-style**: standardized objects with standardized fields, snapping together via tag relationships. **Special cases are forbidden** unless both operator and system architect agree they are optimal and required.

The system must reward defining structure from essence (the operator's strength) and protect against hidden complexity (the operator's weakness).

This principle is the through-line of the entire system. Every other section of this spec, and every section of every other canonical doc, must remain consistent with it. Where prior docs implicitly hold this principle, this spec names it as law.

---

## §1 — Capability Invariants

The system MUST support every one of these. They are not negotiable.

1. **Operator-editable vocabulary at runtime.** Add, rename, reorder, retire categories and tags without code changes or redeploys.
2. **Multi-exhibit membership.** A single artifact assignable to multiple exhibits simultaneously.
3. **Reversibility of every stage transition except DELETE.** Every state change must be undoable.
4. **Durable in-progress state.** Artifacts persist in any stage indefinitely (e.g., sit in CURATE for weeks).
5. **Complete inventory visibility.** Every artifact's current stage queryable at any time.
6. **Anonymous-first.** Full visitor capability without an account.
7. **Identity decoupled from accounts.** Visitors can self-identify with a name without creating an account.
8. **Presets are shareable artifacts.** First-class, treated identically to any other artifact.
9. **Tag-driven everything.** Featuring, newness, exhibit membership, scheduling, retirement — all expressed as tags.
10. **F=ma.** Uniform architecture, no special cases without mutual approval.

---

## §2 — The Eight-Stage Lifecycle

Every artifact moves through these stages. Stages are operator-observable but **not necessarily operator-driven**: some transitions are temporal, computed from data the operator sets.

| Stage | What it means | Who/what advances it |
|---|---|---|
| **ACQUIRE** | An artifact source is identified | Operator |
| **INTAKE** | The artifact enters the system with provisional identity | Operator action; system assigns stable identity |
| **CURATE** | Tags, descriptions, exhibit assignments, born-on date | Operator |
| **PUBLISH** | Born-on date is past; artifact becomes visitor-visible | System (temporal) |
| **LIVE** | Artifact is being served to visitors | System |
| **REVISE** | Operator adjusts a live artifact's tags/metadata | Operator |
| **RETIRE** | Retirement date is reached, or operator sets retirement tag | System (temporal) or operator |
| **DELETE** | Operator soft-deletes; artifact is relocated, retrievable later | Operator |

**Key property:** PUBLISH and RETIRE are **data, not actions**. The operator sets a born-on date; the system honors it. No "publish" button. No "retire" event. Hands-off, end-to-end lifecycle management.

**Multi-exhibit consistency:** When an artifact appears in multiple exhibits, all exhibits read the same born-on and retirement dates. There is no per-exhibit publication state.

Stages are not strictly sequential beyond INTAKE. An artifact can be REVISED while LIVE, RETIRED then un-retired (back to LIVE), and so on. DELETE is the only one-way door (and even that is soft, with relocation to a separate storage location).

---

## §3 — What's Already Locked (defers to canonical docs)

The following surfaces and behaviors are fully specified in the canonical docs and are not redrawn here. This spec defers to them as authority.

### From `UX_SPEC_v0.3.md`:

- **§A — Sitemap and room topology.** Three room-types (Lobby, Exhibit, Gift Shop), directional edges, no side entrances.
- **§H — Site shell.** Persistent player (no sound crosses room edges), guest book, admin shortcut.
- **§B — Lobby panels.** Featured exhibit, curator-controlled featured slot, exhibit chooser, all-exhibits carousel.
- **§C — Exhibit pattern.** Entry, shelf, player, tracklist, panels P1–P4 with their card mechanics, cross-panel ambient rhythm, context capture, exit flow.
- **§D — Hunter Root specifics.**
- **§E — Carsie Blanton (prepared but deferred).**
- **§F — Gift Shop.** Museum-owned, per-exhibit featuring, external store links, no revenue captured.
- **§I — Ambient behaviors and what reveals over time.**
- **§J — Interaction catalog.**
- **§K — Fountain Principle audit.**
- **§L — Edge cases.**
- **§M — Explicit non-goals.**

### From `VISION_LOCK_v0.3.md`:

- **§1 — Architectural rules** (numbered constitutional rules; quoted as `§1 #N` where referenced).
- **§C-03 — Persistent player rules.** No sound crosses any edge.
- **§C-05 — Contribution shell.** One-object-many-types architecture for visitor contributions (guest book entries, fan playlists, future contribution types).
- **§C-06 — Context capture.** Silent player-state snapshot on contributions.
- **§C-07 — Automatic context tagging.**
- **§C-09 — Founding Visitor.**
- **§C-10 — Per-song / per-show guest books.**
- **§G-02 — Admin surface gaps.**
- **§G-08 — Time Capsule.**

### From `UX_CONTROLS_SPEC_v0.3.md`:

- **All of it.** The dock/deck control surface, tab structure, filter mechanics (within-OR / across-AND / empty-silent), pill grammar, search placement, presets, mothballed Kaleidoscope.

### From `CANONICAL_VOCABULARY.md`:

- **All of it.** Tag tier vocabulary — ARTIST / MEDIA / DEEP DIVE — locked Tier 1 + Tier 2 membership, dynamic Tier 3, display-name lookup, `exhibit` routing-tag rule, legacy-doc disposition.

**Reading order for the canonical set:** VISION_LOCK_v0.3 (architectural rules) → UX_SPEC_v0.3 (room and panel surfaces) → UX_CONTROLS_SPEC_v0.3 (dock and filtering) → CANONICAL_VOCABULARY (tag structure) → this spec (capability invariants, lifecycle, additions).

---

## §4 — Additions (operator-direct, this session)

These are new since the canonical docs were last updated. They are the substantive additions of this spec.

### §4.1 — Card shape is curator-selectable

Cards are uniform in **mechanics** (hover-activates-in-place, click-opens-viewer, content-rendered-in-place) but not in **shape**.

During curation, the operator selects card shape: **S/M/L for both height and width**, in any combination. Each artifact type (`media:video` YouTube, `media:photo` FB post, etc.) has a sensible default; the operator can override.

Override use cases:
- "A really cool poster that begs to be BIG" — operator selects L×L or similar.
- "A collection of seashells to look over and pick at" — operator selects S×S grid pattern.
- A music video with strong landscape framing — operator selects M×S landscape.

The grid renders variable-shape cards harmoniously. Cards differ in shape because their data says so. **No special-case card types** — shape is data, not code.

### §4.2 — Museum entry state is a preset

The visitor's first encounter with the museum (or with an exhibit) is itself a **preset**.

The "home" state of any exhibit is the preset configured as default for that entry point. The operator can swap entry-state presets at runtime to refresh the visitor experience — featured artifact, mood, season, whatever.

This means: **there is no separate "home page logic" anywhere in the system.** The home state of any exhibit (or the museum's top-level entry) is a preset, marked with a tag designating it as the entry preset for that surface. The operator changes the tag assignment to change what visitors land on.

F=ma. Even the home page is data, not code.

### §4.3 — Vocabulary-as-data

Every category, every tag value, every tier assignment, every display name is a **row in the system's data** — never a hardcoded string in code.

The operator adds, renames, reorders, and retires vocabulary entries at runtime via the operator's curation surface (separate spec — see open questions §6).

**Renames preserve identity:** when the operator renames a tag (e.g., "Mood" → "Vibes"), every artifact already tagged with it follows the rename. The rename changes a single row's display value; the underlying identity is stable.

**Vocabulary entries are not lifecycle objects.** Tags do not have stages, born-on dates, or retirement. The system may *choose to exclude* certain tag values from rendering (for instance, the `exhibit` namespace is a routing tag, never shown as a pill column). That exclusion is system behavior, not tag state. Tags belong to the artifacts that carry them; the artifact's tag set is sovereign and is never modified by system-level decisions about how to use those tags.

**Implication for current code:** the museum's deck currently uses a hardcoded `TIER_BY_NAMESPACE` heuristic in `hr_dimensions.js`. This is drift from the invariant. A future commit must replace the heuristic with a data-driven lookup.

### §4.4 — Born-on and retirement dates as data

Publication is the system's reading of the artifact's born-on date. Retirement is the system's reading of the artifact's retirement date.

- Born-on date in the past → artifact is live.
- Born-on date in the future → artifact is scheduled.
- Born-on date empty → artifact is draft.
- Retirement date present → retires on that date.
- Retirement date empty → no automatic retirement.

The operator does not push a "publish" button. The operator sets a date. The system honors it.

This gives **hands-off, end-to-end lifecycle management**. Mike sets dates; the system schedules and retires automatically.

### §4.5 — Presets are artifacts

A preset is a curated configuration of the museum: a filter state, a sort order, a set of likes, optionally narrative text at chosen logical milestones within the view.

A preset is **an artifact**. It carries tags. It has identity. It can be featured, shared, scheduled, retired — through the same mechanisms as any other artifact.

A preset is a **single slice** — one filter configuration. Sequencing happens by chaining presets ("next" preset).

Presets are **shareable**. A visitor can share a preset URL with another visitor. Sharing produces a visitor experience: arriving at the URL opens the museum in the preset's configured state.

Presets enable the "Experiential Playlist" — a curated end-to-end museum exhibit experience that includes the curator's own narrative.

### §4.6 — Multi-exhibit membership via badge tags

An artifact appears in an exhibit because it carries that exhibit's badge tag (`exhibit:<name>`). A single artifact can carry **multiple badges** and appear in multiple exhibits simultaneously.

The Hunter/Carsie collaboration use case is canonical: a shared show carrying `exhibit:hunter_root` and `exhibit:carsie` appears in both exhibits, with the full content tags available for filtering in each.

Multi-exhibit is a feature, not an edge case.

### §4.7 — The `exhibit` namespace is a routing tag

`exhibit:<name>` is a **routing tag**, not a content tag.

- The system reads it to know which exhibits an artifact belongs to.
- The system **strips it from artifact records before rendering pill columns.**
- It is **never rendered as a visitor-facing pill column.**

This is the only namespace with this special behavior. Every other namespace renders as a pill column under strict tag equality (per CANONICAL_VOCABULARY).

### §4.8 — Lifecycle formalization

The eight-stage lifecycle (§2) is new formalization. The prior docs cover lifecycle implicitly through workflow descriptions; this spec names the stages, their transitions, and their drivers.

The lifecycle is a UX lens on what the prior docs already describe. It is also a framework for the operator's curation tool design (separate spec — see open questions §6).

---

## §5 — The Compare-Against-Live Backlog

The next step after this spec is a **compare pass against the live system.** Goals:

1. **Surface hardcoded special cases** — places where code defines what should be data. Particular suspects:
   - Tier-to-namespace assignments in `hr_dimensions.js`
   - Tab labels in `HrExhibitFlow.jsx`
   - Display-name derivation from slug (currently slug-to-titlecase in code)
   - Any tab-or-tier-naming string literals
   - The `exhibit` namespace's render-time stripping (need to verify this is actually happening)

2. **Surface undocumented good work.** The prior canonical docs encode considerable detail. The compare will find:
   - Behaviors already built that this spec needs to honor explicitly
   - Patterns that emerged in implementation that should be promoted to spec
   - Quiet decisions baked into code

3. **Surface drift between this spec and the live system.** Specifically:
   - Card-shape invariant — current cards are uniform, not curator-shape-selectable
   - Entry-state-is-a-preset — likely no such mechanism today
   - Vocabulary-as-data — currently heuristic + hardcoded
   - Born-on/retirement dates — MV has release dates, but the museum's render may not honor them as the lifecycle gate
   - Display-name lookup — does not currently exist
   - The `exhibit` namespace stripping — needs verification

4. **Produce the implementation backlog** — what needs to change for the system to match the spec.

The compare itself is a separate Cowork session. This spec is the destination; the compare tells us how far from the destination the system currently sits.

---

## §6 — Open Questions Surfaced by This Spec

For the system architect (Cowork or operator) to answer:

1. **Are notes themselves artifacts?** UX treats them as attached-to-artifact contributions (VISION_LOCK §C-05 contribution shell suggests yes). Under F=ma, the answer should be yes — notes are tagged artifacts with `attaches-to:<artifact-id>` tag. Implementation must be explicit.

2. **How does the system store and retrieve attached content** (fan-submitted photos, precious-archive captures) versus referenced content (URLs to external sources)? The data architecture must distinguish.

3. **How are visitor-shared preset URLs structured** to preserve the preset's identity without exposing internal IDs?

4. **What's the migration story for the museum's currently-hardcoded vocabulary** to the data-driven model this spec requires? The current code's `TIER_BY_NAMESPACE` heuristic, slug-to-titlecase rendering, and hardcoded tab labels all need to migrate.

5. **What's the operator's curation tool design?** This spec specifies capabilities for the operator (saving partial work, durable state, runtime vocabulary editing, etc.) but does not design the UI. That's a downstream design pass against this spec's invariants.

6. **What's the journal lifecycle from `SESSION_CAPTURE_PANEL2.md` (archived)** — compose → 10s undo → commit → vote → delete? Does this still apply? If so, it should be promoted out of archive into a canonical doc.

7. **What's the visitor's "preset chaining" experience?** A preset is a single slice; sequencing happens by chaining. Is chaining a property of the preset (preset A names preset B as "next")? Or a session-level construct? UX behavior is implied; mechanism is open.

---

## §7 — What This Spec Does Not Do

- It does not specify UI design — no screens, no layouts, no widgets.
- It does not specify implementation — no databases, no tables, no APIs, no code.
- It does not specify performance, scaling, or operational characteristics.
- It does not specify the operator's curation tool design (MV's UI). That's a downstream design pass.
- It does not redraw what the canonical docs already specify. It defers to them.
- It does not pick between alternative architectures that all honor the invariants.

---

## §8 — Reading Path

For someone new to the museum or returning after time away:

1. **Read this spec first** for the principle (§0) and capability invariants (§1).
2. **Read CANONICAL_VOCABULARY** for the tag tier structure.
3. **Read VISION_LOCK_v0.3** for the architectural rules.
4. **Read UX_SPEC_v0.3** for the visitor surfaces.
5. **Read UX_CONTROLS_SPEC_v0.3** for the dock/filter mechanics.

After reading all five, you have the complete UX specification of the museum.

---

*End of UX_LIFECYCLE_SPEC_v0.4.md.*
