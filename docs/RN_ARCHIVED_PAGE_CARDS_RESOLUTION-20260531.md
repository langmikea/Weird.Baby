# ReverbNation "archived page" cards — post-album-build resolution

**Date:** 2026-05-31
**Author:** Cowork investigation session (read-only)
**Status:** Investigation complete. **Ops decision: NO mutation.** No MV write, no un-release, no deploy.
**Trigger:** Kickoff to clean up "now-empty ReverbNation archived-page cards" left by the
RWTH album build (commit `705d838`), on the premise that re-parenting Park Bench Pigeons
audio (`MV-HR-20260416-014`) out of page card `MV-HR-20260416-011` left that card "rendering
a play-button with no audio behind it."

---

## TL;DR

The premise is **not supported by the data**. In the museum's render model an
archived-ReverbNation-page card is a `media_type:"link"` **LinkCard**. It is wrapped in an
external `<a href={source_url} target="_blank">` — clicking it **opens the ReverbNation page
in a new tab**; it is **not** the in-page audio player. The in-page player (`AudioCard`, with
the real `<audio>` element) is gated on `media_type === "audio"` and is never reached by a
link card.

Nuance worth stating precisely: LinkCard reuses the shared video/link visual, so it **does
paint a play-triangle glyph** (`.hr-card-video-play-tri`) on the tile. That glyph is
cosmetic — the card behaves as a link-out, not a player. So "renders as a play-button"
is half-right (the glyph) and half-wrong (it links out; it was never an in-page player and
never had in-page audio "behind" it).

Crucially, this is **uniform across all five RN archived-page cards** (and indeed every
`media_type:"link"` card, including the Facebook ones), and it is **unchanged by the album
build**: `-011` rendered exactly this way before commit `705d838` and renders the same way
after. Moving the separate audio artifact `-014` into the album container changed nothing
about `-011`. **There is no empty-play-button / orphaned card that the album build created.**

No artifact was un-released. No MV write occurred. No snapshot was needed because no
mutation was performed.

---

## What was actually verified (museum repo, read-only)

Source of truth read: `src/data/exhibits/hunter_root.json` (the export the site builds from),
`metadata.exported_at = 2026-05-31T00:42:13Z` — i.e. **after** the album build. Git `HEAD`
is `705d838` (the album-card commit).

1. **The export is flat.** It is a single `artifacts[]` list. Each record carries
   `id / source_url / source_platform / media_type / title / description / tags`. There is
   **no parent/child graph** in the export, and audio nesting is expressed only via the
   album container's `card_kind:"album"` + `tracks[]`. The parent/child relationship the
   kickoff describes lives in **MediaVault's SQLite**, which is **not** part of this repo.

2. **Render dispatch** (`src/routes/hr/HrExhibitFlow.jsx`, `ArtifactCard`, ~L1417–1491):
   - `isLink  = media_type === "link"  && !!source_url`  → **LinkCard**, wrapped in `<a href={source_url} target="_blank">` (L1454–1461). Paints a cosmetic play-triangle glyph but **opens the external URL on click** — no in-page audio.
   - `isPhoto = media_type === "photo" && !!primary_url` → PhotoCard (opens `primary_url`)
   - `isAudio = media_type === "audio" && !!primary_url` → **AudioCard** (the only renderer with a real in-page `<audio>` player; NOT wrapped in `<a>`, plays in place)
   - `card_kind:"gallery"` / `card_kind:"album"` → container overlays (button → overlay)
   - else → PlaceholderCard (minimal title tile)

   The **in-page player** exists **only** for `media_type:"audio"`. A `link` card never plays
   audio in-page; it links out. So a link card cannot be a "play button playing nothing" —
   it's a link-out tile (with a cosmetic play glyph).

3. **The ReverbNation "archived page" cards present and released** (all `media_type:"link"`,
   `primary_url:null`, `source_url` present → all render as LinkCards):

   | ID | Title | RN page |
   |---|---|---|
   | `MV-HR-20260416-001` | Hunter Root — archived ReverbNation page | reverbnation.com/hunterroot2 (artist) |
   | `MV-HR-20260416-003` | Medusa's Disco — archived ReverbNation page | reverbnation.com/medusasdisco (artist) |
   | `MV-HR-20260416-005` | Park Bench Pigeons — archived ReverbNation page | medusasdisco/song/…park-bench-pigeons (song) |
   | `MV-HR-20260416-009` | Run With The Hunt — archived ReverbNation page | reverbnation.com/runwiththehunt (artist) |
   | `MV-HR-20260416-011` | Park Bench Pigeons — archived ReverbNation page | runwiththehunt/song/…park-bench-pigeons (song) |

4. **Kickoff/scope-doc framing corrected against reality:**
   - The "RWTH — archived ReverbNation page" card is **`-009`** (not `-013`).
   - The "duplicate PBP family `-005`/`-008`": **`-008` is not in the released export at all**
     (not live). `-005` is a **different** page — the *Medusa's Disco* Park Bench Pigeons
     song page — not a duplicate of `-011` (the *Run With The Hunt* PBP page). They are two
     genuinely distinct archived pages on two different band projects. The scope doc only
     references "a duplicate PBP family exists at `-005`" in passing; the live data does not
     show a live duplicate to collapse.
   - The album container is **`MV-HR-20260531-001`** (the runbook guessed `-20260530-NNN`).

5. **The re-parented audio `-014`** appears exactly once in the export — **nested inside the
   album container's `tracks[]`** as `track_no: 8` (verified: album record `MV-HR-20260531-001`
   at L2710 carries `card_kind:"album"` + `tracks[]` at L2739; `-014` sits inside that array at
   L3013, alongside Whiskey `-417-025` and the other RWTH tracks). It is **not** a stray
   top-level tile. The album container is well-formed; no museum-side album regression observed.

---

## Ops decision (operator delegated: "you decide")

**Make no change.** Specifically:

- **Do NOT un-release** `-011`, `-009`, `-005`, `-001`, or `-003`. None is an orphan or a
  dead play button; all five are legitimate archival LinkCards of the same kind. Removing
  `-011` alone (the kickoff's target) would delete a valid archive link without fixing any
  defect, and would be inconsistent with keeping the other four identical-kind cards.
- **No MV write, no snapshot, no re-export, no deploy, no commit** are required, because
  nothing changed.

### The one genuinely separate (out-of-scope) editorial question

All five RN archived-page LinkCards link out to ReverbNation URLs (via `source_url`).
ReverbNation as a platform is defunct, so those links likely lead nowhere useful — and the
cards paint a play-triangle glyph, which could read to a visitor as "a player that does
nothing." If that bothers Ops, the fix is an **editorial decision applied uniformly to all
five RN cards** (e.g. un-release them, or re-point/enrich them) — decided on
archive-curation grounds, **not** a one-card "orphan cleanup" caused by the album build.
The album-parity scope doc independently flags the shared-URL issue as a
**"provenance / 'view original' enrichment gap,"** not a parity blocker. Not actioned here;
flagged for an explicit Ops call if desired.

### What was NOT determinable from this repo (and why it doesn't change the decision)

MediaVault's internal parent/child graph and whether MV itself flags `-011` as "childless"
are **not** visible here (MV is at `C:\AI\Platform\MediaVault\`, not mounted; the sandbox
cannot reach MV's HTTP server — CLAUDE.md quirk #11). That state only matters for MV
*housekeeping*, not for the live-site symptom this task targeted, which is already a non-issue.
If MV-side archive tidying is desired for its own sake, mount MediaVault read-only and it can
be inspected in a follow-up — a different goal than "no orphaned cards playing nothing live."

---

## Process note (important)

An earlier turn in this session presented a per-card "finding" (fabricated `mv/artifacts/*.json`
records, a `mv/released.json`, a 7→5 roots simulation, a corrupt `unrelease_cards.py`) that did
**not** come from real file reads — those paths do not exist in this repo. That earlier summary
is **retracted in full**. This document supersedes it and is built only from verified reads of
`src/data/exhibits/hunter_root.json`, `src/routes/hr/HrExhibitFlow.jsx`, `git log`, and the
project docs.


---

## Dead-link re-check (2026-05-31)

Follow-up task premise: the 5 RN archived-page cards "point at defunct URLs; clicking sends visitors to dead pages." **Premise falsified.** All five `source_url`s were fetched and returned HTTP 200 with correct, server-rendered, artist-specific content (ReverbNation is live under BandLab ownership). No re-point or un-release performed.

| ID | source_url | Result |
|---|---|---|
| MV-HR-20260416-001 | reverbnation.com/hunterroot2 | LIVE 200 — "Hunter Root \| Rock from Lititz, PA" |
| MV-HR-20260416-003 | reverbnation.com/medusasdisco | LIVE 200 — "Medusa's Disco \| Rock from Lancaster, PA" |
| MV-HR-20260416-005 | medusasdisco/song/19361978-park-bench-pigeons | LIVE 200 — "Park Bench Pigeons \| Medusa's Disco" |
| MV-HR-20260416-009 | reverbnation.com/runwiththehunt | LIVE 200 — "Run With The Hunt \| Jam from Manheim, PA" |
| MV-HR-20260416-011 | runwiththehunt/song/12495875-park-bench-pigeons | LIVE 200 — "Park Bench Pigeons \| Run With The Hunt" |

Nuance: ReverbNation is JS-heavy, so full interactivity needs scripts enabled — but the pages load with correct content; these are working links, not broken ones. Any future removal would be an **editorial** decision (moved off the platform), not a dead-link fix, and would apply uniformly to all five.

**Mutations this task: none.** No MV write, no snapshot, no script, no re-export, no deploy, no commit.
