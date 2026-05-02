# Phase 1.5d — `ytId` → `externalUrl` fallback

## Final `externalUrl` distribution (HR_CARDS, total = 56)

| Bucket | Count |
|---|---|
| With URL (total) | 6 |
| &nbsp;&nbsp;↳ from `postUrl` | 1 |
| &nbsp;&nbsp;↳ constructed from `ytId` | 5 |
| `null` | 50 |

Per-source breakdown of the URL-bearing entries:

- HR_ARTIFACTS (10 entries): 2 cards get a constructed YouTube URL from `ytId`. 0 carry `postUrl`.
- HR_ARCHIVE (23 entries): 1 card carries `postUrl` (Facebook post on `arc-0-2025-01-01`); 3 cards get a constructed YouTube URL from `ytId`.
- HR_EXIT_FLOW (23 entries): all `null` (adapter forces `externalUrl: null` by design — voice tiles stay non-clickable per 1.5c).

## Diff summary

`hrArtifactToCardShape` — extended the `externalUrl` resolution chain to fall back to `https://www.youtube.com/watch?v=${artifact.ytId}` when `artifact.ytId` is present and no other URL field is set. Comment block above the assignment updated to document the 1.5d behavior (and to drop the now-obsolete 1.5c claim that artifact cards always resolve to `null`).

`hrArchiveItemToCardShape` — same one-line change against `item.ytId`. Comment block updated similarly (and the "intentionally not treated as `externalUrl`" line from 1.5c removed).

`hrExitFlowItemToCardShape` — untouched. Voice tiles remain non-clickable.

Header docstring's `externalUrl` field comment updated to note the 1.5d `ytId` fallback and to make clear that HR_EXIT_FLOW entries remain `null` by design.

## ESLint result

`./node_modules/.bin/eslint src/routes/hr/hr_cards.js` → exit 0, no errors, no warnings. `node --check` also clean.

## Anomalies

**Card count delta from Phase 1.5c.** 1.5c reported 6 cards bearing `ytId`; the actual count of cards that resolve through the new `ytId` branch is **5**, not 6. Per-source: 2 in HR_ARTIFACTS, 3 in HR_ARCHIVE, 0 in HR_EXIT_FLOW (the exit-flow adapter forces `null` regardless, so any `ytId` there would be filtered out anyway, but for the record there are zero `ytId` fields on HR_EXIT_FLOW entries today).

A likely explanation for the 6-vs-5 gap: 1.5c may have counted raw `ytId` occurrences across the source data files (which could include duplicates or entries that also carry `postUrl`), whereas the current count is the number of HR_CARDS entries whose `externalUrl` actually resolves through the `ytId` fallback. Notable: the `ytId` value `FbOoHjoSyec` appears on both an HR_ARTIFACTS entry (`art-8-2022-09-09`) and an HR_ARCHIVE entry (`arc-20-2022-09-09`) — same video referenced twice across the two source files — so a count by raw `ytId` field would over-count the unique videos.

**Loose script left in repo root.** A throwaway runtime-check script `check_dist.mjs` was placed at the project root to import HR_CARDS and dump the distribution. Delete attempt was declined; please remove manually if undesired (`rm check_dist.mjs`).

## Constraints

One file edited (`src/routes/hr/hr_cards.js`). No commits. No deploy.
