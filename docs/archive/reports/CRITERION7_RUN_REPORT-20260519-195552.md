# Criterion 7 Run Report — museum renders per-exhibit JSON with correct pill tiers

**Date:** 2026-05-19
**Criterion:** v2.1-target §12.7 — the museum builds from the per-exhibit
JSON and renders each artifact's text and metadata with correctly derived
pill tiers (§8.3). Asset-bearing artifacts rendering placeholder tiles
pending §6.2 is an accepted BUILD-done outcome.
**Status:** COMPLETE on outcomes. One source-of-truth question carried
forward as an operator decision (see below).

## What ran

- **Prebuild + site build:** `npm run build` — both environments (`weird_baby`
  worker and `client` bundle) transformed cleanly. Built into a sandbox
  outDir (`/tmp/wb-build`) only because the existing on-disk `dist/` was
  written by a Windows-side user the Linux sandbox can't unlink (EPERM on
  `dist/weird_baby/.vite/manifest.json` and `dist/client/*`). The build
  itself ran end-to-end; the EPERM is a host-ACL artifact, not a build
  failure. Output: `client/assets/index-MOEbPXgM.js` 337.30 kB,
  `index-D4Js7viF.css` 34.13 kB, `client/index.html`, the worker entry.
- **Render-path inspection:** read `src/routes/hr/HrExhibitFlow.jsx`
  (deck + card dispatch) and `src/routes/hr/hr_dimensions.js` (pill-tier
  derivation), the two modules that consume `hunter_root.json`.
- **Dimension probe:** invoked `buildDimensions(EXHIBIT.artifacts)`
  directly in node against the exported JSON and inspected the result.

## Outcomes — met

### Check 1: all 17 hunter_root artifacts render — text and metadata visible

- `EXHIBIT.artifacts.length === 17` (matches the Criterion 6 export).
- All 17 IDs (`MV-HR-20260416-014`, the 14 `MV-HR-20260417-*` rows, the
  Facebook reel `MV-20260419-002`, the late ReverbNation row
  `MV-HR-20260421-001`, the YouTube link `MV-20260518-001`) appear in
  the minified client bundle.
- Verbatim text spot-check across all 17: titles, descriptions,
  source_urls, and post_dates are all present in the bundle (0 missing).
- Tag values across every namespace are present in the bundle (0 missing).
- Vite bundles `hunter_root.json` at build time via the static import at
  `HrExhibitFlow.jsx:47`; this is §8.1 build-time static import.
- PASS.

### Check 2: pill tiers derive correctly per §8.3

`buildDimensions(artifacts)` returned 10 namespaces, with tiers:

| Namespace      | Tier | §8.3 expectation                              |
|----------------|------|------------------------------------------------|
| `album`        | 1    | Tier 1 ARTIST — matches                        |
| `people`       | 1    | Tier 1 ARTIST — matches                        |
| `song`         | 1    | Tier 1 ARTIST — matches                        |
| `year`         | 1    | Tier 1 ARTIST — matches                        |
| `source`       | 2    | Tier 2 MEDIA — matches                         |
| `type`         | 2    | Tier 2 MEDIA — matches                         |
| `author`       | 3    | every other namespace → Tier 3 — matches       |
| `content_kind` | 3    | every other namespace → Tier 3 — matches       |
| `platform`     | 3    | every other namespace → Tier 3 — matches       |
| `scope`        | 3    | every other namespace → Tier 3 — matches       |

`venue` (Tier 1 in canon) is absent because no artifact in this exhibit
carries it — correct; the museum surfaces only namespaces present in
the data. The output matches §8.3 exactly. PASS on the rendered result.

See OPEN ITEM below for the source-of-truth question (the spec's "from
the registry" wording vs. how this code currently derives tiers).

### Check 3: `exhibit:` tags stripped before pill-tier derivation (§3.3)

`hr_dimensions.js:96` explicitly continues past `ns === "exhibit"` during
namespace walk. Probe result: `exhibit` is **not** present in
`HR_DIMENSIONS` (verified `HR_DIMENSIONS.some(d => d.key === "exhibit") === false`).
The 11th namespace in the raw artifact tags (`exhibit`, with value
`hunter_root` on all 17 rows) is filtered out exactly where §3.3
specifies. PASS.

### Check 4: asset-bearing artifacts render placeholder tiles — no crash

The card dispatch lives at `HrExhibitFlow.jsx:848-877`:

- `media_type === 'link'` **and** `source_url` truthy → `LinkCard`
  (poster tile when `thumbnail_url` is present; play-triangle tile when
  not, via the same component).
- everything else → `PlaceholderCard` (minimal tile showing
  `title || "(untitled)"` and `media_type || "(unknown)"`).

Of the 17 artifacts:

- **1** is `media_type='link'` with a synthesized YouTube
  `thumbnail_url` (`MV-20260518-001` — Reverend music video) → poster tile.
- **15** are `media_type='mixed'` (the ReverbNation audio recordings) →
  PlaceholderCard.
- **1** has `media_type=null` (`MV-20260419-002`, the Facebook reel) →
  PlaceholderCard (the `media_type || "(unknown)"` branch covers this).

No crash; all 17 reach a renderer; the 16 non-poster rows render as
placeholders per §8.4. PASS, and matches §12.7's accepted BUILD-done
outcome.

## OPEN ITEM — operator decision required

§8.3 says tier assignment "comes from the `vocabulary` registry (§5.4)."
Criterion 7's task wording repeats that. The current implementation
derives tiers from a **hardcoded const** in `hr_dimensions.js:45-48`:

```js
const TIER_BY_NAMESPACE = {
  year: 1, album: 1, song: 1, venue: 1, people: 1,
  source: 2, type: 2,
};
// everything else → Tier 3 (the ?? 3 fallback)
```

The const mirrors `CANONICAL_VOCABULARY.md` exactly, so the **output**
matches §8.3 (verified above). But the **source** is not the registry —
it is a third copy of the tier definition (canon doc, MV registry, JS
const). Three copies of a fact tend to drift; canon-only is the spec's
stated discipline.

This is unblocked by §0.5 / §1 principle 5: the site build cannot contact
MV. So "from the registry" can only mean "from a committed build artifact
that is *generated from* the registry." Three plausible paths:

- **(a)** Accept the const as-is. It mirrors canon, the output is
  correct, and §0.4's "registry adds display polish; it is never required
  to *understand* a tag" supports a permissive read. Drift risk is real
  but small (Tier 1+2 membership is locked in canon).
- **(b)** Replace the orphan prebuild hook
  (`tools/build-deep-tags-vocabulary.mjs`, which still reads the 6-row
  legacy `deep-dive-vocabulary.csv` and writes
  `src/data/deep-dive-vocabulary.json`; the JSON is not imported anywhere
  in `src/`) with a hook that emits a committed `src/data/vocabulary.json`
  built from a registry export (or directly from
  `CANONICAL_VOCABULARY.md`). `hr_dimensions.js` reads tiers, display
  names, and `sort_order` from that committed artifact. Brings the
  museum onto the registry path the spec describes and retires the
  legacy CSV.
- **(c)** Embed the registry in per-exhibit JSON metadata at export
  time (`tools/export-artifacts.mjs` already has DB access). The museum
  reads `EXHIBIT.metadata.vocabulary` instead of its const. Tighter
  coupling between export and registry; less coupling to canon doc.

Path (a) is the cheapest and what shipped. Path (b) is what most cleanly
satisfies §8.3's wording and resolves the parallel observation from the
Criterion 6 report ("the `build-deep-tags-vocabulary` prebuild hook still
sources the 6-row legacy `deep-dive-vocabulary.csv`"). Path (c) is the
most "MV-is-source-of-truth"-shaped.

This needs an operator decision. Until made, treat Criterion 7 as
**done by output** (all four checks pass; placeholder-tile outcome is
accepted per §12.7) and **deferred-by-mechanism** on tier source.

## Observations — not Criterion 7, not actioned

- **Prebuild hook is orphan.** `build-deep-tags-vocabulary.mjs` still
  runs in `npm run prebuild`, still reads the legacy 6-row CSV, still
  writes `src/data/deep-dive-vocabulary.json`. A repo-wide grep for that
  JSON shows zero importers in `src/`. The hook is now dead code that
  emits a committed file no consumer reads. Likely candidate for
  cleanup if (b) above isn't chosen.
- **`vocabulary_csv_sha`** in the exhibit JSON metadata is the legacy
  CSV's sha, not the registry's. Informational only — the museum
  doesn't consume it — but is misleading once the legacy CSV is retired.
- **Tier 3 ordering** is alphabetical in `hr_dimensions.js`. §8.3 says
  Tier 3 is "ordered by registry `sort_order` then hit count." Aligned
  with the OPEN ITEM above — without the registry on the museum side,
  there is no `sort_order` to consult.
- **Tier 3 retirement.** Criterion 4 retired all six Tier 3 registry
  rows (`retired_at` set) consistent with "DEEP DIVE launches empty."
  The museum currently surfaces Tier 3 namespaces present in the data
  regardless of `retired_at` — because it doesn't read the registry.
  Same root cause as the OPEN ITEM; flagged separately for visibility.
- **Build output destination.** `npm run build` against the mounted
  `dist/` failed with EPERM on host-ACL'd files. The build itself
  succeeded when redirected to `/tmp/wb-build`. The on-disk `dist/`
  from the Criterion 6 session may be stale; an operator-run build from
  Windows will refresh it.

## Scope held

No code edits. No schema change. No tag writes. The exhibit JSON, the
deck, the dimension builder, the prebuild hook, and the export tool
were all read-only in this session. Anything that needs to change
(the OPEN ITEM paths, the orphan hook, the misleading metadata field)
is flagged for an operator decision rather than decided here.
