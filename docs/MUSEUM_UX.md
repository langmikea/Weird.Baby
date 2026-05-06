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

**Status.** Committed locally in 9c05d06 (2026-05-05). Awaiting deploy.
On deploy, move this item out of the backlog and update Current State
above to describe the v28_3-shape deck a visitor now walks into.

---

(End of MUSEUM_UX.md)
