# REPORT — collapse of the operating process, 2026-09-01

Packet: "collapse the operating process (Ops moves into Code)". Run by Code
against `C:\AI\Projects\weird-baby-museum`. Nothing under `src/` was written.
Nothing was deployed.

## Ground state

The tree was not clean at the start: `docs/dictation-20260807/readiness.json`
and `record-draft.json` carried Mike's Record edits from the day page. On his
ruling (option A) they were committed first as `b9517e6`, "Save Mike's Record
draft for 2026-08-26", and the packet ran from that HEAD.

## Archived (byte-identical copies, never to be edited)

- `docs/canonical/OPERATIONS_ARCHIVE/OPERATIONS-FULL-b9517e6.md` — 39,357 bytes
- `docs/canonical/OPERATIONS_ARCHIVE/OPS_BOOT-b9517e6.md` — 5,896 bytes
- `docs/canonical/OPERATIONS_ARCHIVE/OPEN_ACTIONS-b9517e6.md` — 244,712 bytes

## Deleted

- `tools/numbers-gate.mjs` and its scripts `docs:numbers`, `docs:numbers:gate`
- `tools/ops-size-gate.mjs` and its script `ops:size`
- `tools/conduit-drop.mjs` and its script `conduit`

No caller outside `package.json` and the docs: the only other mentions are
comments in `vite.config.js`, `tools/arc.mjs`, `tools/dictation/shelf.mjs`
and `src/data/artists/robots-record.js` that cite the gate by analogy.

## Rewritten

- `docs/canonical/OPERATIONS.md` — **7,987 bytes** (was 39,357). SHELL-STOP is
  line 1. The DEPLOY block is lines 116–201 of the archive copy, carried
  byte-for-byte (verified by diff), plus one re-measure line. The held-cost
  pair was re-measured by the last run of `docs:numbers:gate` before it was
  deleted: 137 files, 186,888,028 bytes, unchanged.
- `CLAUDE.md` — boot block after the SHELL-STOP: read OPERATIONS.md, then the
  handoff, then `git log --oneline -10` and `git status --short`; believe the
  tree. House rule: `git commit -F`, subject under 72, imperative, ends on
  prose, no trailers.
- `docs/OPEN_ACTIONS.md` — one retirement paragraph pointing at the archive.
  `OPEN_ACTIONS_CLOSED.md` untouched.
- `docs/canonical/OPS_BOOT.md` — one retirement line. The Drive folder was
  not touched.
- `docs/HANDOFF_next_session.md` — four sections, 1,460 bytes.
- `docs/canon/10-LAWS.md` — doctrines 13, 14, 15, 17, 19 and 27 were absent;
  their lead lines were appended verbatim from §7 with anchors, and the
  Part Two pointer now names the archive copy instead of the live manual.
- `docs/THURSDAY-20260827.md`, `docs/PREPARED-manual-hold.md`,
  `docs/PREPARED-manual-removal-20260831.md` — the retired gates removed
  where they were named as steps. Round logs and findings that record past
  runs were left as history.

## Links into the retired register

`OPEN_ACTIONS.md#<anchor>` links under `docs/`: **93 occurrences in 23
files** (91 outside the two archive copies that also carry one). Not
rewritten; the anchors resolve inside `OPEN_ACTIONS-b9517e6.md`.

## Gates

| gate | exit |
|---|---|
| `npm run lint` | 1 — 9 errors / 7 warnings, the baseline, zero new |
| `npm run build` | 0 |
| `npm run provenance:gate` | 0 |
| `npm run reveal:check` | not run — neither the ledger nor a Record changed |
| `npm run parity:gate` | not run — no album changed |
| `npm run instory:gate` | 0 |
| `npm run shellstop:gate` | 0 — 72 name a deploy, 62 in shell position, 0 unguarded |

## Commit

`3566f56` "Collapse the operating manual and move Ops into Code", pushed;
`origin/main` = `3566f56`; `git status --short` empty at push time. This
report is written after that commit, as the packet orders it, so it is
untracked until the next commit.

## Left as found, for the record

- The carried DEPLOY block still cites `§8`, `§9` and `docs:numbers`, which no
  longer exist in the live manual; the packet said not to shorten it.
- `npm run desk` renders `OPEN_ACTIONS.md` to HTML and checks its anchors; it
  now reads the retirement paragraph. `docs/OPEN_ACTIONS.html` is stale.
- `npm run ops:archive` was not rerun; `OPERATIONS_ARCHIVE/INDEX.md` does not
  list the three new files.
- Doctrine 14 (the register is maintained by every round) is carried verbatim
  into 10-LAWS.md although the register is retired.
