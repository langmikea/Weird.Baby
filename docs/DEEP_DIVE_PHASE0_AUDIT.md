# Deep Dive — Phase 0 audit

**Date:** 2026-05-10
**Scope:** Read-only audit. No code changes. No build/test/lint execution.

## Q1 — Existing museum search

Yes — the museum has a search feature today, but it is narrow in scope.

**Where it lives.** Inside the HR exhibit deck, on the "Deep Tracks" tab. The
component is `DeepTracksContent` in
`src/routes/hr/HrExhibitFlow.jsx` (defined ~lines 969–1043; the wiring lives in
the `HrExhibitFlow` parent at lines 1484, 1510, 1573, 1751–1758). The input
markup uses class `searchbar` with placeholder
`"search for any tag across all tiers"`. CSS for the search shell lives in
`HrExhibitFlow.css` under the `Deep Tracks search` rule block (~line 507,
classes `.hr-search-wrap`, `.hr-search-input-holder`, `.hr-corral`,
`.hr-corral-empty`).

**UI surface.** Not a route, not a modal, not a global header bar. It is an
input rendered inside the deck-body when the Deep Tracks tab is the active
tab. The input auto-focuses when the deck opens that tab
(`searchFocusSignal`, line 1510 / 1630). When the deck is closed or another
tab is active, the search input is not in the DOM.

**What it searches over.** The values of `HR_DIMENSIONS` (defined in
`src/routes/hr/hr_dimensions.js`) — i.e., the static pill vocabulary
(era / album / year / song / people / venue / format / media / provenance /
type / src / odds). The query iterates every `(group, slug)` pair, resolves
the slug to its display label via `displayFor`, and matches with
`label.toLowerCase().includes(q.trim().toLowerCase())` (lines 980–991).

**Matching strategy.** Case-insensitive substring match against the
canonical display label (proper-case via `HR_LABELS`). Trim only; no token
splitting, no fuzzy matching, no stemming, no scoring. The legacy slug
itself is not matched against — only the resolved label is — so typing
`hunter root` finds the era pill stored as legacy slug `solo` (this
intentional behavior is documented in the comment at lines 974–979).

**What it does NOT search over.** No artifact descriptions, no `hr_facts.js`
content, no track titles outside what the SONG dimension already exposes,
no journal entries, no archive items by free text, no MediaVault records.
Hits are presented as a row of `PillButton`s in a "corral" (`.hr-corral`,
`.pillscroll`); clicking a hit toggles that pill in the same `selected`
state the deck's other tabs use, so search is effectively a typeahead over
the existing pill grid rather than a free-text content search.

**Empty-state.** When the query yields no matches the corral renders
`<span class="hr-corral-empty">no tags match "{query}"</span>` (line 1012).
The comment at lines 974–979 explicitly notes that cross-artist thematic
words ("breakthrough," "mature") not in HR's locked vocab simply produce
zero hits.

No other search surface exists elsewhere in `src/routes/`. The matches
returned by the codebase grep for `search`/`Search`/`filter`/`Filter`/
`query`/`Query` outside `HrExhibitFlow.jsx` are all `Array.prototype.filter`
calls in unrelated logic, the CSS `filter` property in `WbHome.jsx`, or
mothballed Kaleidoscope code.

## Q2 — Existing filter mechanics in HrExhibitFlow.jsx

**Pill columns today.** Defined as `HR_DIMENSIONS` in
`src/routes/hr/hr_dimensions.js` (lines 231–247):

  - Tier 1 (Artist tab): `era`, `album`, `year`, `song`, `people`, `venue`
  - Tier 2 (Formats tab): `format`, `media`, `provenance`, `type`, `src`
  - Tier 3 (Deep Tracks tab): `odds`

Each entry is built by `dim(key, kind, tier, options)` (line 224) and
carries `key`, `kind` (`"single"` or `"multi"`), `tier` (1/2/3), `options`
(an array of `{slug, label}` pairs), and `values` (the slug array,
derived from `options`). Per-column display labels live in
`HR_GROUP_LABELS` (lines 252–265). The slug→label resolution map
`HR_LABELS` (lines 273–278) is built from the same `options` arrays so it
can never drift from `values`.

**Source data per column.**

  - `era` — locked vocabulary (`HR_ERA_OPTIONS`, lines 56–61). Hardcoded
    in `hr_dimensions.js`. Legacy slugs (`medusas`, `solo`) are paired
    with canonical proper-case labels so historical card data continues
    to filter without rewriting `HR_CARDS`.
  - `album` — mirrored from the SPINE
    (`src/data/artists/hunter-root.js`); slug == spine `id`, label ==
    spine `title`. Hardcoded in `HR_ALBUM_OPTIONS` (lines 69–76). The
    file's own header comment names this as a manual mirror that must be
    kept in sync.
  - `year` — hardcoded numeric range `2012`–`2026` skipping a few years
    (`HR_YEAR_OPTIONS`, lines 79–82). Slug == label.
  - `song` — mirrored from SPINE tracklists, deduplicated, slug derived
    via `slugify(label)`. Hardcoded in `HR_SONG_OPTIONS` (lines 91–160).
  - `people`, `venue`, `format`, `media`, `provenance`, `odds` — empty
    arrays today (lines 169–174). Render as headers only with no pills
    until pre-launch tagging fills them in.
  - `type` — proper-case labels per slug, hardcoded vocabulary
    (`HR_TYPE_OPTIONS`, lines 183–197). Spans the union of types across
    `HR_ARCHIVE`, `HR_ARTIFACTS`, and `HR_EXIT_FLOW`.
  - `src` — hardcoded HR-specific column (lines 206–213): Archive /
    Press / Facebook / Instagram / Stage / YouTube. Header comment notes
    this is finer than v28_3's `provenance` and may eventually be folded
    into it.

The filtered card pool is `HR_CARDS` from `src/routes/hr/hr_cards.js`,
which in turn imports `HR_ARTIFACTS`, `HR_ARCHIVE`, and `HR_EXIT_FLOW`
from `src/data/`. Filter columns and card data are coupled by exact
match on the dimension key: `itemHasTag(item, group, tag)` reads
`item[group]` (lines 379–384), with `year` special-cased to compare
`String(item.year)` and `kind === "multi"` columns checking for array
membership.

**"None-selected = all-selected" semantics.** The code matches the
playbook's description.

  - In `matchFilter` (lines 386–402), each dimension's selection set is
    skipped when `!sel || sel.size === 0` (`continue`), meaning an empty
    column contributes no constraint — i.e., the catalog is unfiltered
    on that axis. Confirmed: empty-column == no filter applied.
  - The visual signal is threaded as the `noneSelected` prop:
    `PillGroupColumn` computes `const noneSelected = !(selected[group]
    instanceof Set) || selected[group].size === 0;` (line 567) and
    passes it to each `PillButton`. `S.pill(...)` and
    `S.pillCount(...)` (lines 281–310) use it to render unselected
    pills in `GOLD_HI` (the same gold as active) with a transparent
    border, distinguishing "all-selected because nothing's filtering"
    from an explicit "this pill is OFF while a sibling is ON."

No drift between the playbook description and the code. The wiring path
the playbook calls out (`PillGroupColumn → PillButton → S.pill /
S.pillCount`) is present and intact.

**Adding a new pill column — what would change.** Architecturally, a new
column is a five-touch operation across two files:

  - `src/routes/hr/hr_dimensions.js`:
    1. Add a new `HR_<KEY>_OPTIONS` array at the top (slug/label
       pairs).
    2. Add a `dim("<key>", "<single|multi>", <tier>, HR_<KEY>_OPTIONS)`
       entry to the `HR_DIMENSIONS` array (lines 231–247) at the
       desired tier and position.
    3. Add a `<key>: "Header"` entry in `HR_GROUP_LABELS` (lines
       252–265). `HR_LABELS` and `displayFor` derive automatically.
  - `src/routes/hr/hr_cards.js` and the upstream data files
    (`hr_artifacts.js`, `hr_archive.js`, `hr_exit_flow.js`):
    4. Cards must carry an `<key>` field (string for `single`, array
       for `multi`) using the same slug grammar; otherwise every pill in
       the new column reads zero-count and renders un-clickable per the
       sameness rule.

No changes are required in `HrExhibitFlow.jsx` itself: `PillGroupColumn`,
`countForPill`, `matchFilter`, `itemHasTag`, the per-tab clear logic,
and the Deep Tracks search loop all iterate `HR_DIMENSIONS` generically.
The deck's three tabs (Artist / Formats / Deep Tracks) auto-render the
columns that match their tier via
`HR_DIMENSIONS.filter(d => d.tier === currentTab.tier)` at lines 1750
and 1571. If a new column belongs in a tier that doesn't exist today
(there are only 1/2/3) the `TABS` array (lines 106–112) would also need
a new entry, but the same logic still applies.

## Q3 — MediaVault API surface for read

Server binds to `127.0.0.1:51822` only (`imgserver.py` lines 48–49). No
authentication is enforced on any endpoint; the only access control is
the loopback bind. Localhost-only is the security model. CORS is
permissive (`Access-Control-Allow-Origin: *` on every response;
`OPTIONS` preflight returns 204 with `*` and `Content-Type` allowed).

Read endpoints below are limited to those that expose artifact-or-tag
data; pure mutators (queue update/delete, artifact save/update/release/
unrelease/archive/delete/requeue, thumbgen, tag-create/update/accept/
reject/delete/merge/bulk-delete, fb-candidate-save, intake-* writers,
artifact-register) are excluded. Per the brief, POST-for-read patterns
are included.

| Route | Method | Returns | Inputs | Auth | In SPEC.md? |
|---|---|---|---|---|---|
| `/db` | GET | Raw bytes of `core/mediavault.sqlite` as `application/octet-stream`. The whole DB blob — artifacts, tags, queue, id_sequence — read by `mediavault.html` via `sql.js`. (`imgserver.py` `handle_db`, lines 282–286.) | none | loopback only | Yes — §10 (read path stays WASM-fast), §8 (browser reads `/db` as binary blob), §11. |
| `/api/queue` | GET | `{ok, rows: [<ingest_queue rows>]}` — pending intake records, ordered by `queue_id` DESC. (`handle_queue_list`, lines 327–343.) | optional `?status=` filter | loopback only | Implicit — SPEC mentions the queue table (§6) and the inbox pane (§8.1) but doesn't enumerate this URL. |
| `/api/tags` | GET | `{ok, rows: [<tags rows>]}` — full tag vocabulary, ordered by `usage_count` DESC then `slug`. (`handle_tags_list`, lines 346–368.) | optional `?proposed_only=1`, `?category=`, legacy alias `?group=`, `?min_usage=N` | loopback only | Implicit — vocabulary surface (§2.2, §8.4) but URL not enumerated. **Drift:** the `proposed_only=1` filter still works against the live `is_proposed` column. SPEC v0.5 (§2.5, §10) declares `is_proposed` retired with a one-stage vocabulary; the column is still in the schema and the endpoint still honors it. The v0.7 punchlist hasn't dropped it yet. A consumer that wants "approved-only" reads will get inconsistent results depending on whether it filters. |
| `/api/fb-candidates` | GET | `{ok, candidates: [...]}` — content of `core/fb_candidates.json` (the FB candidates bridge table). (`handle_fb_candidates_get`, lines 371–378.) | none | loopback only | Indirect — §5.4 names the bridge but doesn't enumerate this URL. |
| `/image-raw` | GET (prefix-matched) | Raw image bytes for any file under `C:\AI` or the MV base, with HEIC→JPEG transcoding. (`handle_image_raw`, lines 289–308.) | `?path=<absolute>` | loopback only + path-inside-`C:\AI` check | Yes — §11 references it implicitly via `catalogs/_assets/`; URL not enumerated in SPEC. |
| `/asset-raw` | GET (prefix-matched) | Raw bytes for any file under `C:\AI`, with `Content-Type` from `mimetypes.guess_type`, supports HTTP `Range` for `<audio>` scrubbing. (`imgserver_extensions.py` `handle_asset_raw`, lines 393–456.) | `?path=<absolute>` | loopback only + path-inside-`C:\AI` check | Yes — listed in `imgserver_extensions.py` docstring; SPEC mentions `_assets/` storage but not this URL by name. |
| `/ext/hr_manager_renderer.js` | GET | Raw JS file (`ext/hr_manager_renderer.js`). Static asset, but exposed as a route. (`handle_renderer_js`, lines 311–314.) | none | loopback only | Yes — §10 marks `hr_manager_renderer.js` as off-limits / external integration. |
| `/api/enrich` | POST | `{ok, queue_id, prompt, note}` (no API key) or `{ok, queue_id, enrichment}` (key present). Returns the constructed enrichment prompt + read-fetched vocab slice. (`handle_enrich`, lines 674–771.) | body: `{queue_id}` | loopback only; reads `ANTHROPIC_API_KEY` env var to decide round-trip vs prompt-only | Implicit — §6 references the enrichment flow; URL not enumerated. **Side-effect note:** despite the brief framing this as POST-for-read, this endpoint *does* mutate when an API key is present (writes `enrichment_json` and flips queue `status` to `enriched`, may upsert proposed tags). Without `ANTHROPIC_API_KEY` set it is read-only and just echoes the constructed prompt. Listed because it returns vocab data and could be called for reconnaissance, but a downstream consumer should not call it lightly. |
| `/ping` | GET | `{ok: true, ts, version: "0.4"}` — health check. (`handle_ping`, lines 278–280.) | none | loopback only | No. |
| `/` | GET | `mediavault.html` (the SPA). | none | loopback only | Yes — §8. |
| `/fb` | GET | `fb_candidates.html`. | none | loopback only | Yes — §5.4. |

There is **no per-artifact read endpoint** (no `/api/artifact/<id>`, no
`/api/artifacts?filter=...`). The browser UI reads artifact rows
exclusively by pulling the whole DB as a blob via `/db` and querying
it with `sql.js` in-process. This is called out as an architectural
choice in SPEC.md §10 ("Browser reads `/db` as a binary SQLite blob via
`sql.js` and performs all writes through JSON API endpoints") and §8.

**Build-time export feasibility.** A build-time export of "all
artifacts for HR with their tags" would be straightforward without any
new MediaVault development:

  - `GET /db` returns the whole SQLite blob in one call. A build script
    could pull it into `better-sqlite3` (Node) or `sqlite3` (Python),
    `SELECT * FROM artifacts WHERE …` and join to `tags` via
    `json_each(artifacts.tags)`, then emit whatever JSON shape the
    museum wants to bundle.
  - "Artifacts for HR" needs a tag-based filter. SPEC.md describes the
    HR scoping convention as a `bands:hunter_root` pill (§2.1, §2.2);
    the HR-card-side data shape uses an `era` slug (`solo`, `medusas`,
    `seeds`). The export script would need a filter rule established —
    see Constraints below.
  - The asset bytes themselves (thumbnails, vaulted files) live on
    disk under `catalogs/_thumbs/` and `catalogs/_assets/`. A build
    script with filesystem access doesn't need an HTTP endpoint to
    grab them; a script without filesystem access can pull each via
    `/asset-raw?path=...` or `/image-raw?path=...`.

So: yes, `/db` alone is sufficient to power a build-time export of
artifact-with-tags JSON without further MV development. Asset bytes
are available either via filesystem read or via the existing raw-asset
endpoints if HTTP is preferred.

## Q4 — Museum's current consumption of MV data

**No runtime consumption of MediaVault from the museum bundle.** All
data the museum renders is statically imported from local JS modules:

  - `src/data/artists/hunter-root.js` (SPINE)
  - `src/data/hr_archive.js`
  - `src/data/hr_artifacts.js`
  - `src/data/hr_exit_flow.js`
  - `src/data/hr_journal_prompts.js`
  - `src/data/wb_merch.js`, `src/data/wb_roster.js`
  - `src/routes/hr/hr_dimensions.js`, `hr_cards.js`, `hr_facts.js`

Every `import` for data resolves locally inside `src/`. No `fetch` call
in the React tree references MediaVault: the only `fetch` calls in
`src/` target the museum's own Cloudflare Worker D1 endpoints
(`/api/visits`, `/api/guestbook`, `/api/admin` in `WbHome.jsx`,
`WbAdmin.jsx`, `Exhibit.jsx`). No `import.meta.env` or `process.env`
reference targets MV. No environment variable, hardcoded MV URL, or MV
asset path is read at build or runtime.

**The references to MediaVault that do exist in the repo are not
runtime consumption:**

  1. **Comment / narrative content.** `src/data/hr_artifacts.js` line
     16 is a header comment listing MediaVault's `STATE.md` as a
     content source for the file's hand-curated entries; line 165
     contains the string `"18 photos captured and cataloged in
     MediaVault. GPS confirmed: Harrisburg, Pennsylvania."` inside a
     `fact2` field — narrative text describing a vault state, not a
     live read.
  2. **Developer-side CLI tool.** `tools/yt-ingest.mjs` is a Node
     script that POSTs to MV's `/api/artifact-register` at
     `http://localhost:51822` (default for `--mv-base`). It is not in
     `package.json` `scripts`, is not invoked by `vite build`, and
     does not produce any artifact that the museum bundle imports. It
     pushes MV-shaped artifacts *to* MV from museum-side validation; it
     never pulls data back.
  3. **Documentation.** `tools/youtube-ingest-schema.md`,
     `docs/canonical/VISION_LOCK_v0.3.md`, `BACKLOG.md`,
     `PHASE_0_REPORT.md`, `RESET_PROTOCOL.md`,
     `docs/archive/DECISION_INDEX.md`, `docs/archive/STATUS_SURFACE.md`,
     `PHASE_2A_REPORT.md`, `CLAUDE.md` — design + status docs that
     name MV but produce no code-level dependency.

`docs/canonical/VISION_LOCK_v0.3.md` G-01 ("MediaVault's role in the
public museum") states the intended architecture explicitly:

> "Nothing on weird.baby serves a byte from MediaVault today. Every
> [byte] currently shipped is hand-curated."
> "MediaVault is the museum's curation and staging surface. … weird.baby
> never serves directly from MediaVault — it renders from a
> Cloudflare-native delivery layer (R2 + D1) populated from MediaVault
> on a deliberate export step."

So the architectural target for Deep Dive is a deliberate, build-time
export from MV → museum, not a runtime read. Today's state is
"greenfield" with respect to MV consumption: no existing pattern to
extend, no existing fetch wrapper to reuse.

## Q5 — Build-time vs. runtime data flow

**Current pattern: all data is statically bundled at build time as
JS-module imports. There is no `prebuild` step, no Vite plugin
generating data, no runtime MV fetch.**

`package.json` scripts:

```
"dev":     "vite"
"build":   "vite build"
"lint":    "eslint ."
"preview": "npm run build && wrangler dev"
"deploy":  "npm run build && wrangler deploy"
```

There is no `prebuild`, `predeploy`, or `prepare` hook. `vite build`
runs cold against the working tree.

`vite.config.js` (19 lines, full content reviewed):

  - Plugins: `@vitejs/plugin-react` and `@cloudflare/vite-plugin`. No
    custom plugin. No `dataLoader`, no virtual module, no transform
    hook that reads MediaVault.
  - `define.__BUILD_TIME__` injects an ISO timestamp at build time —
    the only build-time data injection in the entire config.
  - `rollupOptions.output.manualChunks` splits a `LyricMap` chunk if it
    exists; not data-related.

`wrangler.jsonc`:

  - Configures the Cloudflare Worker (`main: "src/worker.js"`), SPA
    fallback, and a D1 database binding (`weird_baby_db` →
    `weird-baby-db`). No KV, no R2, no MV reference. The D1 binding
    powers `/api/visits`, `/api/guestbook`, `/api/admin` — visitor
    interaction state, not catalog data.

**Data ingest pattern.** Every `src/routes/**` JSX file imports
deck/catalog data through ES module specifiers
(`import { HR_CARDS } from "./hr_cards.js"`,
`import { hunterRoot } from "../../data/artists/hunter-root.js"`,
etc.). Vite + Rollup bundles those modules into the static asset
graph; the Cloudflare Worker serves the resulting HTML/JS bundle.

**Runtime fetches that DO exist** (none of them MV):

  - `src/routes/WbHome.jsx` — `POST /api/visits` (analytics ping),
    `GET /api/guestbook`, `POST /api/guestbook` (guestbook CRUD)
  - `src/routes/WbAdmin.jsx` — `GET /api/admin` (admin dashboard data)
  - `src/routes/exhibit/Exhibit.jsx` line 523 — `POST /api/visits`
  - All target the museum's own Worker (`/api/*`); responses come from
    the D1 binding declared in `wrangler.jsonc`.

**Implication for Deep Dive's eventual MV export shape.** Three
plausible shapes are consistent with what's already in the repo:

  - **Vite plugin** that runs during `vite build`, calls MV (via `/db`
    or a future tag-filtered endpoint), and exposes a virtual module
    consumed by an `import` in the bundle. Closest fit to existing
    static-import pattern; would require MV reachable at build time.
  - **`prebuild` script** that fetches from MV (or reads
    `mediavault.sqlite` directly) and writes a JSON file under
    `src/data/` that the bundle then statically imports. Would require
    adding a `"prebuild"` entry in `package.json` (npm runs `prebuild`
    automatically before `build`). Closest fit to "the export is a
    deliberate step" framing in `VISION_LOCK_v0.3.md`.
  - **Manual operator-run export step** that is *not* part of `npm run
    build` — operator runs a CLI, commits the resulting JSON, then
    builds. Closest fit to today's `tools/yt-ingest.mjs` pattern (CLI
    not in build scripts) and to the "no runtime fetch from MV" hard
    rule in G-01.

The audit doesn't pick among these — that's the spec's job — but
`VISION_LOCK_v0.3.md` G-01's wording ("R2 + D1 populated from
MediaVault on a deliberate export step") and the absence of any
existing build-time MV touch suggest the spec should weigh shape #2
or #3 over #1, since #1 implicitly couples build success to MV being
running.

## Constraints / unknowns I couldn't resolve from the code alone

  - **Deep Tracks search overlap with the Deep Dive feature.** The
    brief calls this work "Deep Dive" and asks about existing search.
    A search input already lives on the Deep Tracks tab and is
    arguably the same conceptual surface. Mike should confirm whether
    Deep Dive is an extension/replacement of the Deep Tracks search
    (in which case the spec should describe migration / coexistence
    of the existing input) or a separate surface (in which case the
    spec should clarify how a visitor distinguishes them). I did not
    propose a resolution.

  - **HR scoping rule for an MV export.** SPEC.md §2.1 / §2.2 describe
    a `bands:hunter_root` pill convention; museum-side data uses an
    `era` slug (`solo`, `medusas`, `seeds`, plus the new locked
    `run-with-the-hunt`). The MV vocabulary categorizes pills under
    `bands` / `era` / `people` / etc. (§2.2), so a build-time export
    of "all HR artifacts" needs a defined filter — likely
    `tags @> 'bands:hunter_root'` — but I did not find a written
    decision picking that exact slug or category. Spec author should
    confirm the scoping query.

  - **`is_proposed` drift on the `tags` table.** SPEC.md §2.5 / §10
    declare a one-stage vocabulary with no `is_proposed` distinction.
    The schema in `mediavault.sqlite` still has `tags.is_proposed`
    (referenced at `imgserver.py` lines 180–190, 354–355, 753–761,
    828–857, etc.) and `/api/tags?proposed_only=1` still works.
    `STATE.md` notes the v0.7 punchlist will drop the column but it
    has not been dropped. A build-time export consumer needs a rule:
    include proposed tags, exclude them, or treat them as approved.
    I did not find a written decision.

  - **Pill-states / four-state shape leakage in MV code.**
    SPEC.md §2.3 reduces inbox pill states to three session-only
    values (`on` / `suggested` / `off`). `imgserver.py`
    `handle_intake_from_fb_candidate` (line 470) and the enrichment
    prompt builder (`_build_enrich_prompt_v05`) still emit/expect the
    four-state v0.4-era shape (`on_confident`, `on_uncertain`,
    `off_suspected`, `off_maybe`). This isn't directly a Deep Dive
    blocker, but if the Deep Dive export reads `enrichment_json` for
    any reason it will see a mix of two shapes. STATE.md flags this
    as expected v0.7 work; spec should note the shape it depends on.

  - **Loopback-only reachability of MV.** MV binds to
    `127.0.0.1:51822`. A build that runs in CI (Cloudflare deploy,
    GitHub Actions, etc.) cannot reach MV. If the export shape is a
    Vite plugin or `prebuild` that requires MV running, the build
    must run on a machine with MV accessible — i.e., Mike's laptop or
    a fixed dev machine — and CI builds must use a checked-in
    artifact rather than re-fetching. I did not find a written
    decision on where the build runs; this constrains the export
    shape and should be settled before the spec.

  - **Asset delivery model.** The brief asks about the export shape
    for "all artifacts with their tags" but doesn't ask about asset
    bytes (thumbnails, vaulted images, video posters). The museum's
    today-pattern is YouTube embeds for video and (presumably) bundled
    assets for images, but I didn't trace the existing image-asset
    pipeline in `Exhibit.jsx` / `HrSpine.jsx` because the brief
    didn't ask. If Deep Dive needs to render images, the spec should
    include asset-delivery (R2? bundled? linked back to localhost MV
    in dev only?) explicitly.

  - **`hr_facts.js` as a search target.** Q1 asks about existing
    search. The Deep Tracks search only searches the dimension
    vocabulary. `hr_facts.js` (referenced by `Exhibit.jsx` for fact
    rendering) holds significant prose content keyed by `albumId` +
    `trackId`. I couldn't tell from the code whether Deep Dive is
    intended to search fact text, or only artifact metadata. Spec
    should specify the search scope.

  - **Things I wanted to run but didn't (per the read-only rule).**
    None of the answers above were blocked by inability to execute.
    I considered running `npm run build` to confirm the bundle
    contains no MV references at runtime, but the same conclusion
    follows from the static import graph and the absence of any
    fetch-MV call in `src/`, so the audit doesn't depend on it.
