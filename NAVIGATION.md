# Navigation — Museum (Weird.Baby Museum)

You are standing in the Weird.Baby Museum. This document orients you to
the larger picture: what this project is, what the other related
projects are, and what the contract is between them. For everything
beyond orientation, follow the pointers at the bottom.

## What this project is

The Museum is the curation and render layer of the portfolio. It is a
Vite + React + React Router site, deployed via Cloudflare Workers,
which exhibits artists and their artifacts to visitors. Hunter Root is
the primary artist content currently built out; other artists are
planned. The Museum reads released artifacts from MV (the upstream
artifact vault) and renders them as exhibits. The Museum is
in-development — the deployed build at https://weird.baby exists, but
significant working-tree changes since the last deploy have not
shipped, and the Deep Dive / MV-export pipeline is still being
specified.

The YouTube ingest pipeline (YT) also lives inside this repo at
`tools/yt-ingest.mjs` and `tools/youtube-ingest-schema.md`. It is not
a separate project; it is a Museum-owned tool that pushes parsed
YouTube artifacts upstream into MV via HTTP POST.

## The portfolio

There are three systems, related as follows:

- **MV (MediaVault)** — `C:\AI\Platform\MediaVault\`
  The running HTTP + SQLite + HTML/JS artifact vault. Source of truth
  for artifacts: capture, intake, tagging, lifecycle, release. Binds
  loopback-only at `127.0.0.1:51822`.

- **Museum** — `C:\AI\Projects\weird-baby-museum\` (this project)
  The curation and render layer downstream of MV. Reads released
  artifacts from MV and presents them as exhibits at weird.baby.

- **YT (YouTube ingest pipeline)** — lives inside this repo at
  `tools/yt-ingest.mjs` and `tools/youtube-ingest-schema.md`.
  Reads YouTube data, produces per-video manifests in the
  `yt_archive/v1` schema, and posts the parsed artifacts into MV.
  Museum-owned, MV-feeding.

## How they connect

- **YT → MV**: the capture script writes per-video manifests under
  `C:\AI\Projects\Hunter Root\archive\youtube\<channel_slug>\<video_id>\`
  and then calls `POST /api/artifact-register` once per artifact
  (parent video page first, then thumbnail / transcript / page-save
  children, then a channel-card row once per channel). Parent linkage
  is threaded via `parent_artifact_id` in each child's POST body. The
  contract is defined in `tools/youtube-ingest-schema.md` (Museum
  side) and in MV's `_cowork/YT_INGEST_FROM_MUSEUM.md` (operator
  side).
- **MV → Museum**: the Museum reads released artifacts from MV's
  `/db` endpoint (`http://127.0.0.1:51822/db`). The
  `npm run export-artifacts` script is the current touchpoint —
  it extracts Deep Dive tags from released YouTube artifacts and
  writes `src/data/deep-tags.json`, which the bundle imports
  statically at build time.
- **MV is loopback-only.** All MV interaction happens on the
  operator's laptop, never from CI. Builds that need MV data must
  run on a machine with MV reachable, or consume a checked-in
  artifact.
- **The Deep Dive export shape is not yet settled.** A read-only
  Phase 0 audit lays out three candidate shapes (Vite plugin,
  prebuild script, manual operator export). See
  `docs/DEEP_DIVE_PHASE0_AUDIT.md`.

## Where you should read next

- If you need to act in the Museum: read `CLAUDE.md` (top-to-bottom),
  then `docs/MUSEUM_UX.md` for current direction.
  Canonical vocabulary lives in `docs/CANONICAL_VOCABULARY.md` — read
  it before touching tags, pills, or artifact categorization.
- If you need to act in MV: go to `C:\AI\Platform\MediaVault\NAVIGATION.md`
  and follow its pointers (PROJECT.md, SPEC.md, CHANGELOG.md).
- If you need YT ingest contract details: read this repo's
  `tools/youtube-ingest-schema.md` for the schema, and MV's
  `_cowork/YT_INGEST_FROM_MUSEUM.md` for the operator-side view
  (endpoints, pills, R-rule expectations, v0.5 limitations).

## Known state (as of 2026-05-14)

- **MV is in v0.5.2.** Three small drifts exist between MV's spec
  document and MV's running code: `artifacts.status` allows the value
  `archived` (the spec says it should be `deleted`); the column
  `tags.is_proposed` is physically present though logically retired;
  tag slug uniqueness is enforced as composite `(slug, category)` not
  global. These drifts are tracked in MV's CHANGELOG as a "Phase-2
  cleanup punchlist," deferred indefinitely.

- **The Museum integrates against MV-as-it-actually-is, not against
  MV's spec.** Two stances were considered:
  - Stance A — wait on MV cleanup. Don't write Museum code that
    reads from MV until the three drifts above (status=archived,
    is_proposed column, composite slug uniqueness) are fixed in MV.
    Museum code ends up cleaner; Museum work is blocked until MV
    cleanup lands.
  - Stance B — adapter layer. When Museum-to-MV integration work
    starts, it proceeds against MV v0.5.2 as-is, with a thin
    adapter layer in the Museum that normalizes the three drifts.
    The adapter does not exist in code yet — it will be written as
    part of the integration work, not before. If MV's punchlist
    ever lands, the adapter simplifies or disappears.

  Stance B was chosen, 2026-05-14. Museum work doesn't block on MV
  cleanup that has no scheduled date.

- **The deployed Museum is behind the working tree.** The build at
  weird.baby is from 2026-04-15; the working tree has accumulated
  significant uncommitted/unbuilt changes (exhibit UX iterations,
  Deep Dive scaffolding, vocabulary work). The release discipline
  recorded in `CLAUDE.md` is operator-confirmed only — features
  reach the live Museum after sandbox validation, not on cadence.

- **The Deep Dive export pipeline exists as design, not as
  committed code.** Phase 0 audit at `docs/DEEP_DIVE_PHASE0_AUDIT.md`
  enumerates the open questions; the spec is still being written.
  Prototypes may exist in `prototypes/` but the build-time export
  shape has not been picked.

## Current state and what's next

**Updated:** 2026-05-14

**Current state:** The Museum is deployed at https://weird.baby from
a build dated 2026-04-15. The working tree has unshipped work since
then (exhibit UX, Deep Dive scaffolding, vocabulary work). MV
integration has not started — Stance B adapter does not exist in
code yet.

**What's next:**
- Adapter layer for MV-to-Museum integration. Stance B is chosen
  but no code exists yet. This is the next non-trivial build item
  when Mike is ready.
- Phase 2b deploy verification. First deploy of the post-Phase-2a
  working tree has not happened. Production at weird.baby is behind
  the working tree.

**If nothing's queued:** No items above means there's no work
pre-decided. Don't pick something autonomously — ask Mike what to
work on.

---

*This section is updated by the AI at the end of each working
session. If the date above is older than your current session and
the bullets look stale, flag it to Mike before acting on them.*

## What's not here

This document does not cover:
- How the Museum works internally — see `CLAUDE.md`,
  `docs/MUSEUM_UX.md`, `docs/CANONICAL_VOCABULARY.md`.
- Implementation details of the YT-to-MV contract — see
  `tools/youtube-ingest-schema.md` and MV's
  `_cowork/YT_INGEST_FROM_MUSEUM.md`.
- Historical decisions — see `CHANGELOG.md` on the MV side and the
  `PHASE_*_REPORT.md` files in this repo's root.

If a future Claude finds itself needing something not covered by any
document, that's a real gap. Flag it to Mike.
