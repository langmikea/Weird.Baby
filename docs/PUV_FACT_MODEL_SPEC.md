# PUV Fact Model — Spec v0.1 (2026-06-24)

**Status:** DRAFT — approved decisions locked, implementation not yet built.
**Owner:** Mike (UX/editorial) + Ops (Claude).
**Purpose:** Define how PUV (Pop-Up-Video) facts are modeled, sourced, tagged,
and surfaced. This is the single reference for facts. Shared tag vocabulary
lives in `docs/taxonomy/` — this doc points there, does not duplicate it.

---

## Why this exists

PUV facts today are 51 hand-authored placeholder seeds in
`src/routes/hr/hr_facts.js` — object shape `{id, albumId, trackId, type,
weight, lines[2]}`, no source, no tags, no link to MV. They were built to
"prove the machinery," not to be correct or durable. FactScroller renders
`lines[0]`/`lines[1]` via a filter-by-album/track weighted-random ticker.

"Wrong facts" (BACKLOG: PUV-FACTS-FIX) can't be fixed durably on that base:
nothing records where a fact came from, nothing ties it to the museum's
artifact system, and each exhibit would need its own facts file. This spec
replaces the seed model.

---

## The four locked decisions (2026-06-24, Mike)

1. **Facts are MV artifacts.** A fact is a first-class MediaVault artifact,
   not a repo file. It inherits MV's provenance fields, tagging, curation
   lifecycle, export path, and the future vote field — rather than rebuilding
   any of that in parallel.

2. **Sourcing is a breadcrumb, not a citation.** Every fact records WHERE WE
   HEARD IT — a pointer back to origin so a future "is that real?!" can be
   retraced. Not an academic citation, not a verification gate. Diligence
   (judging whether a source is trustworthy) happens in Ops/editorial review,
   not as a constraint baked into the data. Sources may be flimsy (a YouTube
   comment, an FB post, a conversation) — validity is judged later; the data's
   job is retraceability.

3. **Facts attach at any level, via tags.** A fact's scope — track, album,
   artist, era — is expressed through MV tags, not rigid id keying. The PUV
   surfaces facts matched to whatever the visitor is currently viewing, at the
   right scope. This is the payoff of facts-as-artifacts: scope is just tags.

4. **`fact` is its own Kind.** A new value in the Kind vocabulary (alongside
   release/performance/announcement/studio/candid + reserved interview/fan).
   A fact is a small dedicated artifact that LINKS to its source(s) via the
   breadcrumb — it is NOT derived from / parented to a single existing
   artifact (a fact may come from outside the artifact set, or from several
   sources at once).

---

## Deferred (designed-for, not built now)

- **Likes/dislikes on facts.** Mike's "like every other artifact" premise was
  INCORRECT per Cowork ground-truth: NO MV artifact has any like/dislike/vote
  field today (not a column, not a tag). Building fact-voting now would balloon
  a content-correctness job into a D1 feature build AND duplicate the existing
  BACKLOG Tier-2 "Persistent Vote Counts (D1)" work. DECISION: decouple. The
  fact model reserves a clean slot for a future vote signal; the voting
  machinery is built separately, likely folded into the Tier-2 vote work, and
  ideally retrofit to ALL artifacts at once (not facts-only).

---

## Proposed fact-artifact shape

A fact is an MV artifact of Kind `fact`. Beyond standard MV artifact fields
(id, status, dating, etc.), a fact carries:

- **The fact text** — the assertion shown in the PUV. Current renderer reads
  two lines (`lines[0]`, `lines[1]`); model preserves a two-line display
  surface (exact field name TBD against MV's text storage convention).
- **Breadcrumb source** — uses MV's EXISTING provenance fields
  (`source_url`, `source_platform`, `ingest_source`). Where no citable source
  exists, an explicit marker value (e.g. `operator-knowledge`,
  `artist-direct`, `unverified`) records the origin honestly rather than
  faking a URL or excluding the fact. The marker is a real, filterable value.
- **Scope tags** — track / album / artist / era via the existing
  Kind/Topic/Era/Format vocabulary (`docs/taxonomy/`). Drives PUV matching.
- **Weight** — the existing weighted-ticker signal carries forward.
- **Vote slot (reserved, unbuilt)** — a designated place for a future
  like/dislike signal; no machinery now.

*Exact field names/types are finalized against the live MV schema during the
build-prep step, not guessed here.*

---

## Client impact (FactScroller)

Today FactScroller filters by `albumId`/`trackId` + weighted-random. Moving to
tag-based scope means selection matches on TAGS, not just ids — the PUV shows
facts scoped to the current view (album cover → album+era facts; track drill →
track facts too). This is real client work, but it mirrors the pattern the
tracklist/discovery system already uses. Scope before building.

---

## Dependency: vocabulary drift MUST be reconciled first

Cowork flagged that the tag vocabulary has DRIFTED across two surfaces — it is
not internally consistent today. Adding `fact` as a Kind to a drifted
vocabulary builds on sand, and every fact then tagged inherits the
inconsistency. THEREFORE: reconcile the two drifted surfaces, THEN add `fact`
as a Kind cleanly. This precedes any fact collection.

---

## Execution sequence (Ops-owned)

1. **This spec** — approved by Mike. (You are here.)
2. **Build-prep read** — confirm exact MV schema fields a `fact` artifact will
   use (text storage, how Kind is added, provenance field names), so the
   collection brief writes into real columns, not assumptions. MV-side.
3. **Vocabulary-drift reconcile** + add `fact` Kind. MV-side, host-executed.
4. **Collection brief (Cowork)** — gather facts INTO the locked shape:
   sourced (breadcrumb), tagged (real vocabulary), scoped. This is the
   "get the facts right" work — last by design, so it pours into a sound mold.
5. **Client re-wire (FactScroller)** — tag-based scope matching. Own scoped
   task; can follow collection.

---

## Open questions for a later pass (not blocking this spec)

- Exact reserved-slot mechanism for the future vote signal (resolve when the
  Tier-2 vote work is scoped — don't pre-commit a shape).
- Whether `fact` artifacts export through the same `export-artifacts` path as
  other artifacts or need a dedicated PUV export (build-prep read answers).
- The marker vocabulary for sourceless facts (`operator-knowledge` etc.) —
  finalize the closed set during build-prep.
