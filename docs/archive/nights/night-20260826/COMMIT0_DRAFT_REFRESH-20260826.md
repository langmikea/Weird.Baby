# COMMIT 0 — THE DRAFT REFRESH (2026-08-26)

**HEAD at start `ebb72d0`.** Ops ruled all five scoping questions and ordered
commit 0 alone: refresh the draft, correct `C-day2`, stop.

**TWO FILES:** `docs/dictation-20260807/record-draft.json`,
`docs/OPEN_ACTIONS.md`. **No entry moved. No comment moved.**

---

## 1 · WHAT THE REFRESH CHANGES

### CONTENT — ONE THING, AND NOT A CHARACTER OF HIS IS INVOLVED

| Record | |
|---|---|
| 001, 002, 003, 005 | **unchanged** |
| **004** | `sections[1].body[1]` regains its `{pre}` marker |

```
before   "    ROOT\n     /(many pwd protected folders)\n     /PORTAL\n…"
after    {"pre":"    ROOT\n     /(many pwd protected folders)\n     /PORTAL\n…"}
```

**THE CHARACTERS ARE IDENTICAL AND ONLY THE WRAPPER MOVED.** Measured as a set:
**75 strings in the old draft, 75 in the new, and 0 present before and absent
after.** This is the `{pre}` loss `a3356c6` repaired, which had been sitting in
the draft since **2026-08-24** because the draft is written one way — source to
draft — and nothing had refreshed it since the repair.

**AND THE DRAFT NOW DEEP-EQUALS THE TREE ON ALL FIVE ENTRIES**, ignoring key
order.

### SHAPE — TWO CHANGES, BOTH BECAUSE THE SURFACE CHANGED

| | before | after |
|---|---|---|
| top-level keys | `_, key, saved, epoch, entries` | **`+ source`** |
| `key` | `wb.record.2026-08-09` | `wb.day.2026-08-26` |
| `_` | *"Written by … record.html"* | *"Written by … day.html (tools/dictation/day.mjs)"* |
| `epoch` | `2026-08-31` | unchanged |

**`source` IS THE PROVENANCE BLOCK PIECE 4 ADDED** — the sha256 and mtime of
`robots-record.js` the draft was written against. **NOTHING READS `key`:** swept,
the lander reads `draft.entries` and `draft.saved` and nothing else.

**KEY ORDER DIFFERS ON 003 AND 004 AND KEY ORDER IS NOT DATA** — `docs` now
leads, because the collector spreads `rest` before it sets the fields it owns.
Named rather than glossed; the round-trip repair established the same point.

### AND THE FILE WAS WRITTEN BY THE PAGE, NOT BY A SCRIPT

**THE REFRESH IS A SAVE FROM THE DAY EDITOR**, served at
`http://127.0.0.1:8899/`, with nothing typed. That removes the question of
whether a script's shape matches the surface's: the committed file **is** what
the surface writes. Cross-checked against a draft computed independently from
`draftEntries()` — **deep-equal ignoring key order.**

## 2 · THE CONSEQUENCE, PROVED ON THE REAL TREE

Before the refresh, Record 004 read as CHANGED (the `{pre}` mismatch) and was
held only by its comments. **Now it carries.** A real `--write` against the real
Record:

```
carried through untouched: 001 002 003 004 005
comment characters: 21486 before, 21486 after
5 record(s): 001 002 003 004 005
49535 -> 49535 bytes
every string round-tripped through reveal\record-entries.mjs

sha256 before 20f4c8aaae14f91a5cd3363a0142c0ecd775db3473716bfec5a119769590891e
sha256 after  20f4c8aaae14f91a5cd3363a0142c0ecd775db3473716bfec5a119769590891e
```

**BYTE-IDENTICAL.** The tree was snapshotted and restored around it, and the
lander's own counter independently confirms the register's corrected number:
**21,486.**

**THIS IS THE PRECONDITION DISCHARGED.** The guard's own header warned that *"the
day somebody does the work this guard exists to force, the reversion becomes
live."* It is no longer live.

## 3 · TWO FINDINGS THE REFRESH TURNED UP, NEITHER OF THEM THE DRAFT

**1 · A SAVE FROM A BROWSER THAT HAS BEEN USED FOR TESTING CARRIES THE TEST'S
MARKS.** The first save wrote `readiness.json` with

```json
"marks": { "1": { "section:EXECUTIVE SUMMARY RENAMED": { "notReady": true } } }
```

— a mark left in `localStorage` by an interaction test **two rounds ago**. Disk
had been restored that round; the browser had not. **The store is doing exactly
what it is designed to do — the browser is the working copy and it wins — and
that is precisely how a test artefact reaches a commit.** Cleared from the
browser, re-saved, and `readiness.json` is byte-identical to HEAD. **The general
rule: restoring a file on disk does not restore the browser that writes it.**

**2 · `day.html` IS NOT REPRODUCIBLE, AND THE CAUSE IS MINE.** `SOURCE_STATE`
bakes the source file's **mtime**, and `day:proof` writes-and-restores that file
on every run — so its mtime moves without its content moving, and the next
`npm run day` produces a different `day.html`. The sha256 is identical; only the
mtime line differs.

**IT IS COSMETIC TODAY AND IT IS STILL WRONG.** Swept: **nothing compares
mtime** — `record-serve.mjs:192` and `day.mjs:2168` both test `sha256` and
nothing else; the mtime is display-only in the refusal message. So `day.html` was
restored rather than rebuilt this round, and the fix — dropping mtime from the
baked block and letting the server supply it at refusal time — **is its own
change and is not in a commit-0 that Ops scoped to one file.** Flagged here.

## 4 · P6 IS NOT IN THIS COMMIT, AND THE REASON IS THAT IT WOULD HAVE NOTHING TO SAY

Ops ruled P6 built and proved by deleting a line from a moved block. **No block
has moved yet.** A manifest of moved blocks is empty until commit 1, and a check
that asserts an empty list cannot be shown going red — which is this proof's
whole standard. **P6 lands with 002**, against that entry's blocks, with the
deletion demonstrated on one of them.

## 5 · GATES

| gate | exit |
|---|---|
| `npm run lint` | **1 — the baseline**: 17 problems, **9 errors / 8 warnings**, zero new |
| `npm run build` | **0** |
| `npm run provenance:gate` | **0** |
| `npm run reveal:check` | **0** |
| `npm run instory:gate` | **0** |
| `npm run parity:gate` | **0** |
| `npm run arc:check` | **0** |
| `npm run ops:size` | **0** |
| `npm run docs:numbers:gate` | **0** |
| `npm run record:land -- --verify` | **0** — 51 of 51 strings |
| `npm run day:proof` | **0 — ALL 45 CHECKS PASSED**, 9 shown LOSING first |
| `npm run reveal:day` | *"Nothing to move. The tree and the Record agree."* |
| `npm run lap:clean` | nothing left in `public/` |

**Nothing in `src/` changed**, so the museum lap does not apply.
`robots-record.js`, `readiness.json` and `day.html` are all byte-identical to
HEAD — the only files in the commit are the draft and the register.

## 6 · WHAT IS NEXT, UNCHANGED

**Commit 1 is Record 002** — two blocks, 2,579 characters — with P6 landing
beside it. Then 003, 005, 004.
