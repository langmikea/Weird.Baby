# Canonical Museum Vocabulary

**Status:** Authoritative. Read this before any work that touches museum tag vocabulary, pill columns, or artifact categorization.

**Provenance:** Locked over a full day of iterative UX prototyping in April 2026, ending at controls-dock prototype v17 (and carried forward through v27/v28 in `prototypes/prototype_a_v28_3.html`). Captured in `docs/canonical/UX_CONTROLS_SPEC_v0.3.md` §§2, 4.8 and Appendix A. Re-confirmed by the operator in May 2026 after the deep-dive-review spec arc (v3 through v5.2) repeatedly drifted from this structure.

## The three tiers

Pill columns in the museum's exhibit deck are organized into three tiers, each presented as a tab in the controls dock.

### Tier 1 — Artist Info

- **era** — temporal/identity grouping
- **album** — album name / collection
- **song** — song title
- **people** — people involved (artist, band members, collaborators, etc.)

### Tier 2 — Media Formats

- **format** — physical/digital format (vinyl, CD, mp3, etc.)
- **media** — media type (audio, video, image, text)
- **provenance** — source (official, fan-recorded, bootleg, etc.)
- **type** — content type (studio recording, live show, interview, etc.)

### Tier 3 — Deep Tracks

- **venue** — physical or virtual venue
- **year** — calendar year (may be redundant with era; both kept for filter flexibility)
- **mood** — emotional/atmospheric tag
- **odds** — folksonomy sand slot for uncategorized tags

## Routing tag (not a pill column)

- **exhibit** — routing tag identifying which exhibit(s) an artifact belongs in. Used by the museum's export to discover exhibits and populate per-exhibit JSON files. Stripped from artifact records before pill columns are computed at render time, per `docs/deep-dive-review/SPEC_DRAFT_v5_2.md` §3. NEVER rendered as a visitor-facing pill column.

## Authority

- This document is canon.
- The `docs/deep-dive-review/` spec arc (v3 through v5.2) describes architecture, not vocabulary. Where any spec mentions specific tag categories, they must match this document.
- `SPEC_DRAFT_v5.md` §3.3 example output and `SPEC_DRAFT_v5_2.md` §3 example tags use `motif`, `theme`, `texture` — these were Ops-author inventions and are NOT canonical. Use the three-tier structure above.
- MV's `tags` table currently uses different categories (`bands`, `content_kind`, `topic`, `platform`, etc. — see `MediaVault/SPEC.md` §6 and §2.1). The MV-side categories are MV's internal classification; the museum's pill columns derive from the namespaces in `artifacts.tags`, which need to match the canonical vocabulary above.

## What this means for curation

When tagging a museum-bound artifact in MV:

- The artifact's `tags` array should contain `<namespace>:<value>` strings where namespace is one of: `era`, `album`, `song`, `people`, `format`, `media`, `provenance`, `type`, `venue`, `year`, `mood`, `odds`, `exhibit`.
- Additional non-canonical namespaces (legacy: `scope`, `content_kind`, `platform`, `author`) may be present in MV for MV's own purposes; the export will surface them as pill columns under strict tag equality, but they should be considered legacy and gradually consolidated into the canonical structure.

## What this means for code

The museum's deck (`HrExhibitFlow.jsx` + `hr_dimensions.js`) discovers pill columns dynamically from artifact tag namespaces. This means the code does not enforce the canonical vocabulary — it renders whatever's there. Discipline is operator-side: tag artifacts only with canonical namespaces.

Future work item: a validation step (in the export or as a CI check) that warns if an artifact's tags include non-canonical namespaces.

## Source

The structure above was determined by full-day iterative UX prototyping ending at controls-dock prototype v17, locked by operator decision. The tier names and group counts are reflected in `docs/canonical/UX_CONTROLS_SPEC_v0.3.md` §§2 and 4.8; the per-tier namespace lists are reflected in the JS constants of `prototypes/prototype_a_v28_3.html` (`ERAS`, `ALBUMS`, `SONGS`, `PEOPLE`, `FORMATS`, `MEDIA`, `PROVENANCE`, `TYPES`, `VENUES`, `ODDS`). This document consolidates both into a single authoritative reference after multiple spec sessions failed to honor it.
