# JOB 4 — EXECUTED

2026-08-13 · WRITE · four commits on `main`, nothing pushed, nothing deployed.
All gates green. Tree clean.

---

## WHAT YOU NEED FROM ME

**Three one-word rulings. None urgent, and none of them blocks Saturday.**

1. **Group 2 was scoped at 20 files and only 10 exist under the names the
   packet gives.** I deleted those 10 and stopped. Three leftovers are sitting
   right beside them and I did not guess:
   - `tools/batch1b_covers_mvwrite.py` — dead, and it was the *only* thing in
     the repo still calling `batch1_renditions_mvwrite.py`, which is now gone
   - `tools/batch1c_photo_repoint.py` — dead
   - `tools/press_batch_stage3_facts.json` — the data file belonging to
     `press_batch_stage3.ps1`, which I deleted; the packet scoped "31 `.ps1`"
     so I left it

   **DELETE or KEEP.** If delete, that is 13 of the missing 10 accounted for
   and the other 7 never existed.

2. **`docs/taxonomy/RETAG_PLAN.md` names `retag_v1.ps1` six times, as its own
   runbook.** It is the record of a migration that finished in June, so I left
   it exactly as written — the same reason a round log is never rewritten. Say
   the word if you would rather it carried a line saying the script is gone.

3. **The numbers gate flagged neither of the two numbers the packet expected,
   and the line is not at fault.** Details below. **Reported, not corrected**,
   as instructed.

---

## THE TWO NUMBERS — REPORTED, NEVER CORRECTED

Both are still stale. Neither is worded in a shape any existing check can see,
so the gate reads the file and passes.

| where | what it says | measured today |
|---|---|---:|
| `OPEN_ACTIONS.md:26` (row **15h**) | *"the field exists now and is unset on all **315** rows"* | **385** |
| `OPEN_ACTIONS.md:223` (row **B-a**) | *"It is **`null` on all 315 rows**"* | **385** |
| `OPEN_ACTIONS.md:123` (row **M32**) | *"`reveal/ledger.json` holds **152** rows"* | **166** |
| `OPEN_ACTIONS.md:289` | *"all **152** rows are placed or exempted"* | **166** |
| `OPEN_ACTIONS.md:298` (row **T-C**) | *"Nothing in the **152** rows"* · *"across **152** rows"* | **166** |

**Why nothing fired, precisely:**

- The `asset-null-bucket` check is anchored on the literal phrase `null on all`.
  Row **15h** writes *"unset on all"*. Row **B-a** writes ``**`null` on all``
  — **a single backtick between `null` and `on` is the whole distance between
  that claim and a hit.**
- The two ledger checks are anchored on ``` `when` … null on all ``` and on the
  phrase `one per REVEALABLE`. `OPEN_ACTIONS.md` says *"holds 152 rows"*,
  *"all 152 rows are placed"*, *"across 152 rows"* — three more shapes, none of
  them either anchor.

**Row 15h in particular is a question, not a claim** — correcting the count
edits the sentence you are being asked to rule on. The note in the gate now
says so in the file itself.

**I did not widen a single regex.** The packet said existing checks only, and a
gate whose patterns get loosened to make a specific document fail is a gate that
can later fail on something nobody meant.

---

## 4a — THE BACKUPS · DONE

**Step 1 — the nine that git did not have.** Re-measured independently rather
than taken from last night's report: every `.pre-*` file hashed and tested
against all 5,055 objects reachable from any commit. **17 in git, 9 not** —
the same 9, file for file.

Committed as `cc61c38`, forced past `.gitignore:34`. **Verified all nine
tracked before proceeding**, and verified each stored blob is byte-identical to
what was on disk (`.gitattributes` has `text=auto eol=lf`, so this was worth
proving rather than assuming — the bytes came through untouched).

**Step 2 — all 26 deleted**, `4a8d582`. Zero `.pre-*` files remain anywhere in
the tree.

**GATE: PASS.** `src/routes/hr/` holds exactly one `HrExhibitFlow.jsx` and
exactly one `HrExhibitFlow.css`.

> Noted in passing, not touched: that directory also holds `_patch_fbwidth.log`
> and `_patch_fbwidth_css.log`, leftovers of the same May patch run.

---

## 4b — `OPEN_ACTIONS.md` INTO THE NUMBERS GATE · DONE

One line in `DOCS`, `historyFrom: null`, the note carrying the
report-never-correct rule verbatim. `5965945`. No new measurers.

**Proved live by breaking it**, because a gate that reads a file and finds
nothing is indistinguishable from a gate that never opened it. A planted line —
`the lint baseline 11 errors / 9 warnings` — was caught at
`docs/OPEN_ACTIONS.md:341` and named, with published `11 / 9` against measured
`9 / 8`. The file was restored byte-identically afterwards.

The gate now reads **3 documents** and checks 8 published claims.

---

## 4c — THE PORTAL DRUM · NO CHANGE

Ruled no change; nothing was touched. `portal.js`, `M33` and the FEED-channel-4
contradiction are all exactly as they were.

---

## 4d — THE DEAD SCRIPTS · DONE

**41 deleted, 8 wired**, `6a04eb2`.

| group | count | what happened |
|---|---:|---|
| 1 · completed staged migrations | **31** `.ps1` | deleted — `mv_vocab_*` 19, `fact_kind_*` 5, `factscroller_*` 4, `press_batch_*` 2, `retag_v1` 1 |
| 2 · one-offs already run | **10** of 20 | deleted — see the ruling above |
| 3 · generators that could run again | **8** | kept and wired |
| 4 · still has a job | 3 | untouched and deliberately unwired |

**Before deleting, every reference into the delete set was measured** across
every `.mjs/.js/.jsx/.py/.ps1/.json/.md/.html` file in the repo:
**exactly one code reference, and it came from inside the set** —
`batch1b_covers_mvwrite.py` calling `batch1_renditions_mvwrite.py`. That is
ruling 1 above. The other 27 references are prose, and 22 of them are the four
migration round logs, which are the record and were left alone.

**One live pointer did break and is fixed in the same commit:**
`OPERATIONS.md`'s *Retag tooling* row named `tools/retag_v1.ps1`. It now names
only `tools/coverage_check.py`, which is still on disk.

### The eight new npm scripts

```
covers:foundation        python tools/make_foundation_covers.py
covers:house             python tools/make_house_covers.py
covers:robots            python tools/make_robots_cover.py
covers:template          python tools/make_template_covers.py
covers:unit              python tools/make_unit_covers.py
vocab:registry:rebuild   python tools/build-vocabulary-registry.py
yt:ingest                node tools/yt-ingest.mjs
assets:r2:sync           node tools/sync-assets-to-r2.mjs
```

**`vocab:registry:rebuild` is named the way it is on purpose.** That script
opens MediaVault's SQLite and runs `DROP` + `CREATE` + re-seed on the vocabulary
table. Wiring it puts a destructive operation one command away, so the command
says `rebuild` rather than reading like something you can run to look at
something.

**None of the eight were executed** — they write artwork, write to MediaVault,
or talk to YouTube and R2. Each was verified to exist and to be well-formed.

Group 4 stayed unwired as ruled: `backup-guestbook.ps1` and
`backup-guestbook-scheduled.ps1` are already driven by Task Scheduler, and
`Get-ProjectStatus.ps1` is documented in `CLAUDE.md`.

---

## GATES

| gate | result |
|---|---|
| `lint` | **9 errors / 8 warnings — baseline, unmoved** |
| `provenance:gate` | PASS |
| `docs:numbers:gate` | PASS — 8 claims in 3 documents |
| `reveal:build` | ran; `ledger.json` byte-identical, tree clean |
| `reveal:check` | PASS (exit 0) |
| `assets:orphans` | 8 judged / 5 unjudged = **13, unchanged** — not touched by this round |
| `approval:proof` | PROVED |
| `build` | green, 522ms |
| `build:launch` | green, 781ms · 144 files / 190.0 MB held out |

Working tree clean after all nine.

---

## THE FOUR COMMITS

```
6a04eb2  Delete 41 dead scripts and wire the 8 generators that can run again
5965945  Bring OPEN_ACTIONS.md under the numbers gate
4a8d582  Remove all 26 .pre-* backups from the tree
cc61c38  Preserve 9 untracked .pre-* mid-session states before removal
```

Nothing pushed. Nothing deployed. `robots-record.js`, the Robots repo and
everything Portal were not touched.
