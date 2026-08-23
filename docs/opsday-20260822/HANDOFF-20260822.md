# HANDOFF — Ops Day, 2026-08-22

## ROOTS
  museum  C:\AI\Projects\weird-baby-museum   — live at weird.baby
  robots  C:\AI\Projects\weird-baby-robots
Neither is readable by Ops. Every host command Ops writes
carries its own Set-Location with one of these two paths
spelled out. If you have not been told the current HEAD, ask
Mike for `git log --oneline -1` and `git status --short` in
both repos before trusting any number in this file.

## STATE
Ops Day. No UX, no story. Deploy is reconciled and landed:
one canonical account in OPERATIONS.md §0, the guard
(tools/deploy-guard.mjs) named there and in the §5 file map,
both working bypasses removed, the guard's broken escape hatch
deleted, derived_era_stage5_deploy.ps1 disarmed with an exit 1,
and both cost numbers (137 files / 186,888,028 bytes) enforced
by docs:numbers:gate, proved by watching it fail. The last
seven live deploy forms in CLAUDE.md, docs/OPEN_ACTIONS.md and
docs/START_HERE-20260612.md are collapsed to pointers.

The conduit is the ground state: `npm run conduit`, six
refusals, one name (WB_CONDUIT), current at the HEAD the last
drop printed.

## DATED BACKLOG ITEMS — all three delivered
Record 003 artwork, Records 2.1-2.5, and /robots + /robots/record
are DONE. Record 003 is PUBLISHED 2026-08-19
(docs/canon/09-PUBLISHED.md:76). Rows 1-3 were deleted from
docs/BACKLOG.md per Doctrine 24 — a closed row leaves the file —
and recorded in docs/OPEN_ACTIONS_CLOSED.md under
"CLOSED 2026-08-22 — THE THREE DELIVERED". The BACKLOG now runs
0-9 contiguously. Item 0, the Portal FAQ false line, is Mike's
to rewrite and is untouched.

## SPEC, REMAINING
1. OPERATIONS.md splits into a ground state plus a generated
   archive. That is the whole next job.
2. One name per thing — the twin has two.

## THE SPLIT INHERITS FOUR
- §3 is a rule ABOUT stamps — every document is a hint unless
  stamped — and its two-field stamp form is superseded by the
  four-field stamp the tool writes. Its `#`-comment rule is
  also wrong: a `#` line is a syntax error in JS, CSS and JSON,
  and the tool is right. The rule is live mechanism. Its
  current text is wrong. Ground state gets the corrected rule.
- CRLF: OPERATIONS.md's working tree is CRLF, HEAD's blob is
  LF. git calls it clean only because the index stat matches.
  Twelve content-identical files will trip the dirty-tree
  refusal on an mtime change. Detect and preserve each file's
  EOL. Do not normalize.
- /api/held probes /held/robots/art/portal-cover.png, which the
  Portal ruling moved. It reports served:false on a healthy
  site. Probe the door with a real held file —
  /held/robots/art/mgk-niac-cover.png — not with /api/held.
  Verified live 2026-08-22: a held path returns 404 "Not found",
  9 bytes, from src/worker.js:284-288, refusal at :286. A merely
  missing path returns the 200 shell. The moved file serves at
  /robots/art/portal-cover.png, 200 image/png, 641,677 bytes.
- Drive full-text search returns FALSE POSITIVES. A phrase
  search matched OPERATIONS.md and also BACKLOG.md, which
  cannot contain it. Neither a hit nor a miss is proof. The
  ground state must be small enough to read whole rather than
  search.

## OPEN, AND YOURS TO RULE
- Flag placement: inline at the site, or one ledger.
- If a ledger: §0 or a new file, and which side of the split.
- Whether a dated filename (START_HERE-20260612.md) makes a
  file an archive candidate by convention.
- Which name the ground state keeps.
- What generates the archive, when, and gated by what.
- The size ceiling for the ground state. The reason the ceiling
  exists: 291 KB could not be read through the conduit, and a
  doctrine change had to be verified by its stamp instead of
  its sentence. The test is whether you can read it whole.
- Which sections go which side, §0 and §5 included.
- Which of the twin's two names is canonical. This is a canon
  question and the canon is in the conduit — INDEX.md,
  CONFLICTS.md, THREADS.md, 02-MACHINES.md. Read it. A name
  ruled from memory is how a thing gets a third name.

## FLAGS, NOT FIXED
- STATE.md is NOT among the conduit's twenty files, which is why
  Ops cannot see what shipped. Adding it means changing the
  hardcoded list in tools/conduit-drop.mjs. Not ruled.
- docs/ARC.md:149 still lists P7 PERSONNEL/CEO/ as OPEN — the
  artefact in the delivered Record 003 artwork row. P8-P10 sit
  alongside it. The production arc is a separate tracker with
  its own rules. Not touched.
- `npm run desk` regenerates all nineteen HTML pages at once and
  sweeps in time-derived churn (relative-age labels, "last
  written" stamps) on every run. Any commit that includes a desk
  run carries that churn.

## ASK CODE, NOT OPS
- Whether docs:numbers:gate scopes OPERATIONS.md. If the split
  moves 137 and 186,888,028, the re-baseline lands in the same
  commit and is proved by watching the gate fail first, which
  is how those rows were proved the first time.

## STANDING
- Number every question.
- Flag, never fix.
- Mike rules UX. Ops rules mechanism.
- Do not send Mike Ops decisions.
- Every host command carries its own Set-Location.
- Two factual errors of Ops, caught by anyone, ends the session.