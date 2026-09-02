# Derived-Era Design — Report (2026-06-16)

Companion to `derived-era-spec_v0.1.md`. What I found, what I decided as Ops, what's still yours.

## The reframe

Mike's words — "being tagged to an album MIGHT be enough to put you in an era" — *is* the design, not a hint toward it. Taken literally it means the weighted date set is mostly **derived from tags that already exist** (`album:`, `event:`), provided those vocabulary entities carry dates. So the design's center of gravity is not "store a list of dates per artifact" — it's "give albums dates once, and let existing tags do the work." Per-artifact date entry becomes the exception, not the rule.

## The data-shape decision

Two layers, deliberately in different homes:

- **Album/event dates → a git-tracked `era-config.json`** the export reads (alongside the era buckets). Reference data, ~23 rows, rarely changes, belongs in version control. No migration.
- **Per-artifact overrides → one additive nullable `referenced_dates` JSON column**, parsed like `notes` already is. Smallest possible migration; most leaves stay null.

I rejected the **tag-convention** option despite it sounding migration-free: encoding weighted dates as `refdate:` slugs pollutes the high-cardinality `tags` usage_count table and forces facet-stripping like `exhibit:`. I rejected a **full side table** as heavier than 22 leaves + 16 press warrant — it's the right shape only if album/event dates later grow into first-class entities.

## The one non-obvious engineering call

Era is bucketed by **weighted vote**, not weighted mean. Weighted mean breaks the exact case Mike cares about: a 2025 interview about a 2016 album averages to ~2020 and lands in *Finding the Sound* — between both eras, in neither. Weighted vote casts the album's weight into Early Days and the publish weight into Recent, then takes argmax → Early Days. It also makes "between buckets" structurally impossible. This is the heart of why the design holds together.

## Correction carried up from the live tree

The handoff lists `released_at` as a derivation input alongside `post_date`. It isn't — `released_at` is the museum-release timestamp (when the curator released the card), not a content date. Today the artifact carries exactly **one** usable content date, `post_date`. This is why the album-date registry is the real gating work: without it there is no second date to weight. (Truth ranking: live tree > docs.)

## Scope / risk

Config file + one nullable column + one function in `export-artifacts.mjs` (leaves-only, folds the stray `era:rwth` 15 into Early Days). Not a filter-engine change, not a destructive migration, not a full retag. Curation stays king: a manual `era:` tag overrides the derived value, so any retrospective-by-intent call Mike makes still wins.

## What's yours before I build (also in spec §7)

The album date table in spec §5 — confirm it, especially `medusas_disco` (phase-anchor to Finding the Sound vs. a real 2022 MD album that crosses into Breakthrough) and `rarities` (proposed: contributes no era). Then the two weights (`W_ALBUM_REF` 2.0 for interview/press/review, 0.0 for primary kinds) and the manual-override marker convention. Three confirms, then it's a clean build.
