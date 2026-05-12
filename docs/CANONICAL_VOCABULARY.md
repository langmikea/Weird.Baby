# Canonical Museum Vocabulary

**Status:** Authoritative. Read this before any work that touches museum tag vocabulary, pill columns, or artifact categorization.

**Provenance:** Locked across multiple sessions of iterative UX prototyping in April–May 2026, culminating in the v28_3 controls-dock prototype and confirmed in the May 11 2026 canonical recovery session.

## The three tiers

The museum's exhibit deck organizes pill columns into three tabs. Each tab is a tier with a different shape and intent.

### Tier 1 — ARTIST (locked membership)

Fixed list of five groups, in this order:

- **year** — calendar year
- **album** — release / album name
- **song** — song / track title
- **venue** — physical or virtual venue
- **people** — people involved (artist, band members, collaborators)

### Tier 2 — MEDIA (locked membership)

Fixed list of two groups:

- **source** — typically the URL owner or contributor (FB, YT, website owner, etc.)
- **type** — video, photo, mp3, social media, PDF, website, etc.

### Tier 3 — DEEP DIVE (dynamic membership)

**The catch-all tier.** Every tag whose namespace isn't in Tier 1 or Tier 2 lands here.

- **Membership is dynamic.** Whatever tag namespaces appear in the data that aren't in Tier 1 or Tier 2 become groups in Tier 3.
- **Group ordering within Tier 3:** by hit count (most-used first), tiebreak alphabetical.
- **Category label displayed to visitors:** "Deep Signals"
- **Operator can add and rename groups over time** without code changes. Renames happen via the site's display-name lookup mechanism (the same one used elsewhere for slug-to-display-name translation).
- **Structural parity:** Tier 3's pill rendering, filter behavior, and search integration are identical to Tiers 1 and 2. Only the membership rule differs (dynamic-from-data versus locked-list).

Example: if the data contains `mood:snarky`, `mood:defiant`, `motif:pink-hats`, then Tier 3's groups would be `mood` (2 hits) and `motif` (1 hit), in that order.

## Routing tag (not a pill column)

- **exhibit** — routing tag identifying which exhibit(s) an artifact belongs in. Used by the museum's export to discover exhibits and populate per-exhibit JSON files. Stripped from artifact records before pill columns are computed at render time, per `SPEC_DRAFT_v5_2.md` §3. NEVER rendered as a visitor-facing pill column.

## Tab labels (visitor-facing)

The three tabs render in uppercase via CSS:

- **ARTIST**
- **MEDIA**
- **DEEP DIVE**

Internal code may use lowercase or other variants; visitor-facing CSS uppercases them.

## Display names

All visitor-facing labels — tab labels, group labels within each tier, individual pill labels — come from a display-name lookup table. The lookup maps internal slugs to human-readable text. This means:

- Renaming any group (e.g., "Mood" → "Vibes") is a lookup-table edit, not a code change.
- Renaming any pill value (e.g., "hunter_root" → "Hunter Root") is a lookup-table edit.
- Adding a new Tier 3 group (because new tag data appeared) requires only that the lookup table have a display name for it; the group surfaces automatically once data exists.

The exact storage shape of the lookup is implementation-detail (could be a DB table, a CSV column, or inlined defaults). It is *not* the deep-dive-vocabulary CSV — that file is legacy and its role has been narrowed (see "Legacy" below).

## Authority

- This document is canon. All other vocabulary descriptions in the repo are either implementation detail or historical record, not authority.
- The `docs/deep-dive-review/` spec arc describes architecture, not vocabulary. Where any spec mentions specific tag categories, this document supersedes.
- MV's `tags` table currently uses different categories (`bands`, `content_kind`, `topic`, `platform`, etc. — see `MediaVault/SPEC.md` §6). The MV-side categories are MV's internal classification; the museum's pill columns derive from the namespaces in `artifacts.tags`, which need to follow the structure in this document.

## Legacy

The following are historical and not canonical:

- **`docs/deep-dive-vocabulary.csv`** — defined `mood`, `motif`, `theme`, `texture` as the four "Deep Dive" groups during the v3-v5.2 spec arc. That arc drifted from this document; the CSV is retained for git-history continuity but no longer drives the museum's pill columns. Future cleanup may retire it.
- **MV-side namespaces in `artifacts.tags`** including `scope`, `content_kind`, `platform`, `author` — these came from MV's classification system and predate the canonical museum vocabulary. Under strict tag equality, they currently surface as pill columns. Operator decision pending: coexist, strip-on-export, or migrate. See `SPEC_DRAFT_v5_2.md` Q-5 follow-up.

## What this means for code

The museum's deck (`HrExhibitFlow.jsx` + `hr_dimensions.js`) currently uses a heuristic `TIER_BY_NAMESPACE` to assign namespaces to tiers. **The heuristic needs to match this document.** Specifically:

- Tier 1 must contain: year, album, song, venue, people
- Tier 2 must contain: source, type
- Tier 3 catches everything else (default)
- `exhibit` is stripped before tier assignment

The current heuristic in `b29f9fe` does not match this. A follow-up commit will fix it — separate from this documentation commit.

## Source

The structure above is the resolution of a recovery session on 2026-05-11 after the operator pointed out that the deep-dive-review spec arc had drifted from a previously-locked UX design. Sources consulted during recovery:

- `prototypes/prototype_a_v28_3.html` — v28_3 controls-dock prototype constants
- `docs/canonical/UX_CONTROLS_SPEC_v0.3.md` — tab framing
- Chat history: the April 22-23 v17 prototyping session, the May 3 v28_3 commit session ("11 dimensions canonical"), the April 24 PowerShell retrieval-bundle session (Tier 3 extension proposal), the May 1 v49 Dog-barking session, and the May 11 recovery conversation that produced this final structure.

The structure here corrects errors in the initial recovery (commit `2236e64`).
