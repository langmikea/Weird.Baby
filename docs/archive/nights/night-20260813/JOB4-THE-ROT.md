# JOB 4 — THE ROT
2026-08-13 · READ-ONLY · nothing was deleted or changed.

---

## WHAT YOU NEED FROM ME

**Four one-word rulings. None urgent.**

**And one correction to what I told you last night.** I said the 26 backup files
in the tree could be deleted because "git is the backup." **That was wrong.**
They are all gitignored, and **9 of them hold states git does not have.** The
recommendation is now split.

---

# 4a — THE BACKUP FILES

**26 files, 1,376 KB. All 26 are UNTRACKED** — `.gitignore:34` carries
`*.pre-*`, so git has never held any of them under their own name.

I checked each one's exact bytes against every commit of the file it backs up.

## 17 are already in git — safe to delete

Their bytes appear verbatim in a commit of the live file, so deleting them loses
nothing.

| KB | file |
|---:|---|
| 179 | `src/routes/hr/HrExhibitFlow.jsx.pre-keystone-nullexempt` |
| 174 | `src/routes/hr/HrExhibitFlow.jsx.pre-barmove-20260616` |
| 162 | `src/routes/hr/HrExhibitFlow.jsx.pre-tabsout-A-20260615T154940Z` |
| 76 | `src/routes/hr/HrExhibitFlow.jsx.pre-phaseC-20260522-163720` |
| 70 | `docs/TAGGING_SYSTEM_AUDIT-…pre-T1-supersession-…` |
| 64 | `src/routes/hr/HrExhibitFlow.css.pre-barmove-20260616` |
| 56 | `src/routes/hr/HrExhibitFlow.css.pre-tabsout-A-…` |
| 56 | `src/routes/hr/HrExhibitFlow.css.pre-v7popover-…` |
| 46 | `src/routes/exhibit/Exhibit.jsx.pre-barmove-20260616` |
| 17 | `DECISION_BRIEF_target_data_architecture.md.pre-c7closeout-…` |
| 16 | `NAVIGATION.md.pre-c8close-20260520-200800` |
| 13 | `tools/yt-ingest.mjs.pre-followon2-…` |
| 12 | `tools/sync-assets-to-r2.mjs.pre-phaseC-…154711` |
| 12 | `tools/sync-assets-to-r2.mjs.pre-phaseC-…154737` |
| 8 | `src/routes/hr/hr_dimensions.js.pre-T3-…` |
| 4 | `docs/CRITERION8_DEFERRAL_NOTE-…pre-c8close-…` |
| 4 | `src/styles/museum-tokens.css.pre-B11-20260730` |

> **RECOMMENDATION: delete these 17 (968 KB).** Git holds every byte.

## 9 are NOT in git — deleting loses that state forever

| KB | file |
|---:|---|
| 164 | `src/routes/hr/HrExhibitFlow.jsx.pre-v7popover-20260616T020045Z` |
| 107 | `src/routes/hr/HrExhibitFlow.jsx.pre-fbwidth-20260531T193449Z` |
| 40 | `src/routes/hr/HrExhibitFlow.css.pre-fbwidth-20260531T193449Z` |
| 20 | `DECISION_BRIEF_…md.pre-statusenum-20260519-220253` |
| 19 | `DECISION_BRIEF_…md.pre-c8defer-20260519-211529` |
| 16 | `NAVIGATION.md.pre-c8defer-20260519-211529` |
| 15 | `NAVIGATION.md.pre-c7closeout-20260519-210619` |
| 14 | `NAVIGATION.md.pre-c6closeout-20260519-154523` |
| 13 | `NAVIGATION.md.pre-closeout-20260519-151700` |

**408 KB of states that exist nowhere else.** They are mid-session snapshots
taken between commits — the work in progress of a round, not any committed
state.

> **RECOMMENDATION: `git add -f` these 9 into one commit, then delete them.**
> That puts the states in history where they belong and takes the clutter out of
> `src/`. One word if you would rather just delete them; they are six-week-old
> intermediate saves of files that have been rewritten several times since.

**Either way `src/` stops holding six files called `HrExhibitFlow.jsx*`**, which
is a grep hazard every time anyone works in that directory.

---

# 4b — BRINGING `OPEN_ACTIONS.md` UNDER THE NUMBERS GATE

**It publishes 17 count-shaped claims and the gate cannot see it.** Two are
already stale (`315 rows` → 385, and the ledger's `152 rows` → 166, both found
last night).

## What it would take — about 20 minutes

**One line in `tools/numbers-gate.mjs`'s `DOCS` array:**

```js
{ file: "docs/OPEN_ACTIONS.md",
  historyFrom: null,
  note: "every row is live by Doctrine 24 — a closed row leaves the file" },
```

**`historyFrom: null` is the whole reason it is cheap.** The gate's hard part is
telling a standing value from a recorded measurement, and it solves that by
knowing where each document's round log starts. **`OPEN_ACTIONS.md` has no round
log** — Doctrine 24 means a closed row *leaves*, so the entire file is live
claims. There is no boundary to declare.

## What it would catch, and one thing it would not

The existing checks would immediately catch the two stale counts. The other 15
claims (`154 strings`, `49 cards`, `93 rows`, `14 entries`, `61 pages`…) would
need a measurer each, and **most of them are not worth one**: they are
descriptions of a moment inside a question Mike is being asked, not tripwires.

> **RECOMMENDATION: add the file with the checks that already exist.** It costs
> one line and closes the two known holes. Do not write fifteen new measurers
> for numbers nobody navigates by.

**One caution.** Several stale numbers sit *inside* a row's question — row 15h
says *"the field exists now and is unset on all 315 rows."* Correcting the count
edits the sentence Mike is being asked to rule on. **The gate should report
those, and a human should decide whether the correction changes the question.**

---

# 4c — THE PORTAL DRUM: RESOLVED

**Three counts were on record. The truth is 8 channels, 2 arming — and one of
the three wrong answers was mine.**

| source | says | verdict |
|---|---|---|
| `docs/OPEN_ACTIONS.md` M33 | *"six engraved feeds and five will not arm"* | **wrong** |
| the 12 Aug handoff §0d | *"8 channels, 2 arming"* | **correct** |
| my own Job 4 report, 13 Aug | *"11 feeds, 4 arm, 7 do not"* | **wrong — mine** |

## What `src/data/artists/portal.js` actually declares

```
ch 1  MGK-NIAC      arms: false
ch 2  MGK-NIAC      arms: false
ch 3  STANDARD      arms: true      <-
ch 4  DETAIL        arms: true      <-   (carries a photograph)
ch 5  COLD START    arms: false
ch 6  FIRST RUN     arms: false
ch 7  LAST STATE    arms: false
ch 8  TEST BENCH    arms: false
```

**Eight channels. Two arm. Six do not.**

## Why my count was wrong, which is the useful part

I counted every `arms:` in the file — there are **11** — and called them all
feeds. Two of them are not:

```
{ id: "live",   label: "LIVE",   arms: true  }
{ id: "seeded", label: "SEEDED", arms: false, why: "no seeded feed on file …" }
```

**Neither carries a `ch`.** They are a different control — a mode selector — and
counting them as drum channels is what produced "11 feeds, 4 arm." **The `ch`
field is the thing that makes a row a channel**, and a regex over `arms:` cannot
see that.

## Where M33's "six" probably comes from

Eight channels carry **seven distinct labels** — `MGK-NIAC` appears on both ch 1
and ch 2. If someone also read the two NIAC channels as one feed and missed one
more, six is reachable. **It is still wrong.**

> **Changed nothing**, as instructed. M33's row needs its numbers corrected from
> "six engraved feeds and five will not arm" to "eight channels and six will not
> arm" — but that is inside a question Mike is being asked, which is exactly the
> caution in §4b.

**The handoff's FEED-channel-4 contradiction is real and separate:** `portal.js`
gives ch 4 `arms: true` and a photograph; the ledger says `NOT_BUILT`. One is
wrong and I did not resolve it.

---

# 4d — THE 60 DEAD SCRIPTS: FOUR WORDS

Unchanged from last night's measurement. Dead means **not named by any npm
script and not imported by any live code** — 25 are live and 36 are libraries,
and neither is on this list.

### GROUP 1 · COMPLETED STAGED MIGRATIONS · 31 files · `.ps1`
`mv_vocab_*` (19) and `fact_kind_*` / `factscroller_*` / `press_batch_*` /
`retag_v1` (12). Numbered stages of one-way migrations that finished.
**A staged migration that has run cannot run again — its stages assume a state
that no longer exists.**

> **DELETE.** Their run reports are the record; the scripts are not.

### GROUP 2 · ONE-OFF SCRIPTS THAT HAVE ALREADY RUN · 20 files
`batch1_*`, `batch2_*`, `migrate_tags_criterion1.py`, `photo_reparent.py`,
`verify_migration_result.py`, `migrate-vocabulary-pass1/2.mjs`,
`verify-export-diff.mjs`, `provenance/_declare_rc.mjs`, `_repoint_p.mjs`.
Each did one job once, against data that has since moved.

> **DELETE.**

### GROUP 3 · GENERATORS THAT COULD RUN AGAIN · 6 files
`make_foundation_covers.py` · `make_house_covers.py` · `make_robots_cover.py` ·
`make_template_covers.py` · `make_unit_covers.py` ·
`build-vocabulary-registry.py`. They produce artwork and a registry from inputs
that still exist. Nothing calls them because covers are made rarely.

> **KEEP, and give them npm scripts** so they stop reading as dead. A generator
> nobody can find gets rewritten.

### GROUP 4 · STILL HAS A JOB · 3 files
`backup-guestbook.ps1` · `backup-guestbook-scheduled.ps1` ·
`Get-ProjectStatus.ps1`. Something has been running the guest-book backups —
`backups/scheduled-run.log` proves it — and `Get-ProjectStatus.ps1` is
documented in `CLAUDE.md`.

> **KEEP.** These are not rot; they are unwired.

**Two that resist the four groups, called out rather than filed:**
`tools/yt-ingest.mjs` (named in **10** documents) and
`tools/sync-assets-to-r2.mjs` (named in **8**). Nothing imports or runs either,
but `CLAUDE.md` names HR acquisition tooling as future work and R2 sync is
infrastructure. **Treat both as GROUP 3.**

---

## WHAT I COULD NOT DETERMINE

- **Whether the 9 untracked backup states are worth keeping.** They are
  mid-session snapshots of files rewritten several times since. I can tell you
  git does not have them; I cannot tell you anyone will ever want them.
- **Which of `portal.js` and the ledger is right about FEED channel 4.**
  `portal.js` arms it and gives it a photograph; the ledger says `NOT_BUILT`.
  Carried from the 12 August handoff, still unresolved, and it is a question
  about the object.
- **Whether M33's "six" was ever right.** It may have been true of an earlier
  drum. I did not walk the history of `portal.js`.
- **What the other 15 counts in `OPEN_ACTIONS.md` should be.** Measuring them
  needs a measurer each, which is the work §4b recommends against.

## WHAT NEEDS MIKE

1. **The backups — two words.** Delete the 17 that are in git; and for the 9
   that are not: commit-then-delete, or delete.
2. **`OPEN_ACTIONS.md` into the numbers gate?** One line.
3. **The dead scripts — four words.** Delete · delete · keep-and-wire · keep.
4. **The drum:** M33 says six, the truth is eight. Correcting it edits a
   question you are being asked, so it is yours.
