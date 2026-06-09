# HANDOFF — next session (written 2026-06-09, HEAD 347b1e8)

**Orientation is NOT in this file.** Read `docs/canonical/OPERATIONS.md`
first (CLAUDE.md points there), then STATE.md, then this. This file is
session-scoped context only.

## Where the UX-overhaul arc stands
- Job: top-down UX overhaul — (1) aesthetic foundation, (2) master
  layout, (3) components. Session brief is with Mike.
- Ground truth gathered: a verified read-only map of the aesthetic
  layer, layout, tracklist, and PUV/FactScroller (line ranges in
  OPERATIONS.md §5). Key finding: JS token mirrors at
  `HrExhibitFlow.jsx:109-122` flatten the photo-black ramp to one tone
  (#211f1c) and inline `S.*` styles do not track CSS token edits.

## Recommended next step
Scope + build the **token-mirror fix** (foundation before aesthetics).
BLOCKED ON one open UX question to Mike, asked but not yet answered:
- Deck chrome: (A) join the page's tonal ramp (more hierarchy), or
  (B) stay deliberately flat black (fix propagation only, pixel-identical).
Get the answer FIRST; A and B are different edits.

## Then, in order
1. Logo placement system (overhaul #1; logo image is Lobby-only today).
2. Mike's parked aesthetic reads: variant-pill type colors, journal
   green/red, per-album accents.
3. Overhaul #2 master layout, #3 components (Exhibit.jsx owns
   tracklist/player/PUV; HrExhibitFlow.jsx owns deck/dock — see map).

## Parked (unchanged)
S8.1 mobile presets phase 2; preset-as-artifact; entry-state-as-preset;
facts content fill (hr_facts.js is seed data); gitignore cleanup
(dist_stale_1780929658/ et al.); STATE.md refresh for June 8-9 work.
