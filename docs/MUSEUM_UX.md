# MUSEUM_UX.md

The Weird.Baby Museum, told as a visitor walks through it.
This is the only UX document. Current state above the line, backlog below.

---

## Current State — what a visitor sees today

Baseline: commit 620885b (Phase 4b: Reconcile deck palette and typography to museum).
This is what is deployed at weird.baby right now.

**Home / front door.**
Warm-aesthetic landing. Reconciled museum palette and typography.

**Hunter Root exhibit (the first artist room).**
- Top half: carousel + track list + video player. Functional.
- Bottom half: current deck. Functional, but slated for replacement
  (see backlog: "HR exhibit deck — adopt v28_3 shape").

**Gift shop (/shop).**
Live.

**Capsule (/cb).**
Live.

---

## Era vocabulary (locked, per-artist principle)

Hunter Root's eras, in order:

  Run With The Hunt
  SEEDS
  Medusa's Disco
  Hunter Root

Display strings: proper case as written.
Storage slugs: lowercase-hyphenated, derived via slugify() helper.

Pills with zero matching content are un-clickable. All pills behave the same;
sameness means un-clickable when there is nothing behind them.

Cross-artist thematic search ("breakthrough," "mature," etc.) routes to
free-text search, not pills.

---

## Backlog

### 1. HR exhibit deck — adopt v28_3 shape

**Visitor consequence.** When a fan enters the Hunter Root room, the bottom
half of the exhibit becomes the deck shape from prototype_a_v28_3.html,
populated with Hunter Root content. Top half is unchanged.

**Reference, not source.** prototypes/prototype_a_v28_3.html is the canonical
deck shape. It is a reference. Code is not copied verbatim.

**Out of scope for this task.** Anything outside the HR bottom half. The top
half stays as-is from baseline 620885b.

**Status.** Locally complete, awaiting deploy. Lineage, in order:

- Baseline `9f4d8c5` already carried the deck SHAPE — six tabs (Artist ·
  Formats · Deep Tracks · Journal · Presets · ✕), page header with
  eyebrow + italic-serif h1 + sub paragraph, panel head with count,
  artifact grid, hover-peek + resizable deck behavior, locked filter
  rule. Doc commit `a9ade8f` framed `9c05d06` as "v28_3 deck adoption
  committed"; that framing was misleading — the structural adoption was
  already in the baseline. `9c05d06` was the vocabulary work, narrower
  than `a9ade8f`'s headline.
- `9c05d06` (2026-05-05): locked Hunter Root Era vocabulary
  (Run With The Hunt · SEEDS · Medusa's Disco · Hunter Root) routed
  through `displayFor(group, slug)` + `slugify()`; proper-case rendering
  across all pill columns.
- `3739e40` (2026-05-05): restored the v28_3 dimension columns dropped
  in HR's earlier reduction, under the locked sameness rule. Tier 1
  Era · Album · Year · Song · People · Venue. Tier 2 Format · Media ·
  Provenance · Type · Source (Source is HR-specific, appended). Tier 3
  Odds + search. Album and Song values mirrored from the spine;
  People / Venue / Format / Media / Provenance / Odds render as empty
  columns until pre-launch tagging fills them in. Journal moved from
  index 4 to index 5 (after Presets, before ✕) per default-to-last
  placement.
- `792d8b7` (2026-05-05): Stage 3 follow-up. (a) Deck typography matches
  v28_3 — Fraunces (serif) + Geist (sans) — scoped to `.hr-section`
  via CSS variable override; museum-wide tokens left intact, so the top
  half of the HR page (carousel / track list / video player) keeps
  DM Serif Display + Syne. (b) Pill widths moved from global to
  per-column so long Album / Song labels don't bloat Era / Year / Type.
  (c) Bright + dim color tiers across the museum collapsed to canonical
  `#b8974a` — the WEIRD.BABY logo color. Applied to HR, gift shop, and
  home; `WbAdmin.jsx` out of scope per direction.

On deploy, move this item out of the backlog and update Current State
above to describe (a) the v28_3-shape deck a visitor now walks into and
(b) the single canonical gold tone across HR / shop / home.

---

(End of MUSEUM_UX.md)
