# OPERATIONS — Weird.Baby Museum (cross-session operating manual)

<!-- ) SHELL-STOP. Do not remove: this makes bash abort if the file is ever executed. §8, 2026-08-29 -->

**Authority:** This file governs HOW any agent/session works on this project.
`STATE.md` governs WHAT exists. `docs/canonical/` governs design intent.
On conflict about process, this file wins. On conflict about facts of the
tree, the live working tree wins — always.

**Read this file FIRST in every session, before STATE.md, before any handoff.**

**Round log:** the `Last verified against live tree` chain is in
`OPERATIONS_ARCHIVE/ROUND-LOGS.md`.

---

## 0. THE OPERATING SHAPE — how Mike and Ops work

**READ THIS FIRST AND READ IT WHOLE.** Everything here was learned by getting it
wrong at least once. It is written down because a reset Ops that has to relearn
it costs Mike the same rounds twice. §1 below is the compressed version of the
first heading; this section is the one that settles arguments.

### WHO DECIDES WHAT

> **"WHAT WE DO = UX, and that is Mike's. WHEN WE DO = Ops."** — Mike

It settles most disputes on its own. **Ops rules the technical**: sequencing,
mechanism, which of two equivalent implementations, what order things ship in.
**Mike rules anything a visitor sees, reads, or feels** — copy, layout, the
story, what is on the glass and what is held.

When the two touch, the UX half wins and Ops says how. A mechanism that changes
what a visitor reads is not a mechanism decision wearing a technical hat.

### HOW TO ASK MIKE A QUESTION

**NUMBER EVERY QUESTION.**

> **"When you number the items I have a better chance of answering the ones you
> want answered and not trying to read into shit I should not read into."**

An unnumbered question gets read into. A numbered one gets answered.

- **One load-bearing question at a time.** If there are three, they are numbered
  1 / 2 / 3 and the first one is the one that decides the round.
- **Plain human syntax. No jargon, no file paths, no function names.** He is
  ruling on the museum, not on the repository.
- **Options as A / B / C, never more.** Four options is Ops failing to think.
- **If you want a decision, ASK for it.** A flag buried in a list is not a
  question and will not be answered as one.
- **Do not ask about something already ruled.** Read the ruling back in your own
  words first, then ask the ONE thing that is genuinely open. Re-litigating a
  ruling spends his patience on ground already paid for.

### BRIEFS

**MIKE DOES NOT EDIT BRIEFS.** He has said so twice. A brief goes to him
**complete or not at all** — never a brief plus a correction, never "with this
one change", never "ignore the third paragraph". **Ops rewrites; Mike pastes.**

If a brief is wrong after it is written, the brief is rewritten whole.

### MIKE HAS APHANTASIA

**He cannot judge a visual from a description.** No amount of careful prose about
a layout is a substitute for looking at it. **Every visual ruling needs a
RENDERED comparison** — the thing itself, and the alternative beside it.

And **any mock or render must be SERVED OVER HTTP** — `npm run mock` — **with the
URL in the report.** The Chrome extension refuses `file://`, so a mock written to
disk is invisible to Ops by construction and can reach Mike unseen. That has cost
two rounds; see §8.

**OPS LOOKS BEFORE MIKE DOES. Always.**

### VERBATIM

**Mike's words are verbatim.** His line splits and his casing are the
instruction, not incidental. **Do not join his lines. Do not correct his casing.
Do not smooth his writing.** Typos are carried unless he asks otherwise — Record
001 ships `was made made` and `=  86%` on purpose.

**FLAG, NEVER FIX.** When his words have gone stale, say so and leave them. A
paraphrase filed in his class is indistinguishable from his own sentence a week
later, which is why the three-mark scheme exists (§5) and why a `beat` may be
deleted but never reworded.

### ONE THING AT A TIME

> **"In EVERY case, work on only ONE thing at a time. Stop interweaving."**

**Ops controls the flow.** He gets the next brief when the current one is done
**and deployed**, not before. Holding a finished brief back is Ops doing its job,
not Ops being slow.

**The only exception is a Record on a clock.**

### MIKE IS THE LOCK

He runs the one line that publishes. Ops edits, verifies, reports, commits
and pushes; **Ops never deploys.**

**THE MARKER IS `[MIKE]`.** Anywhere in this file, a clause marked **[MIKE]**
is his: Code prepares it, **stops there, and does not go on until he has run
it.** It attaches to the clause that is his, never to the whole step — mark
the step and a session hands him its own work and waits for it.

**[2026-08-29] Mike's ruling: the marker narrowed to the deploy alone — commit
and push are Code's, and `npm run deploy:launch` is the only clause still his.**

**THERE IS ONE DEPLOY.** See §0 DEPLOY — THE ONLY ACCOUNT, immediately below.
The short form has been written five times and caught five times; the sixth time
nobody catches it is the whole reason that block exists.

### DEPLOY — THE ONLY ACCOUNT

```
npm run deploy:launch
```

That is the deploy. **Nothing else in this file prints a deploy command. If you
find one, it is a defect and this block wins.**

**THE GUARD.** `tools/deploy-guard.mjs` runs inside both deploy scripts and
exits 1 when the built worker's stage does not match the deploy you asked for.
**It has no working override.** It is the only thing that stops a wrong-stage
publish: there are no git hooks and no CI in either repo, so every other gate
named in this manual — `provenance:gate`, `reveal:check`, `parity:gate`,
`instory:gate`, `docs:numbers`, `lap:clean` — is human discipline, and **not one
of them runs at deploy time.**

**WHAT GOES AROUND THE GUARD.** Any command that reaches wrangler directly, and
any script that does, never touches the guard. **Do not run one.** This block
deliberately does not print that form.

#### THE DEPLOY ARMS A DATE, AND NOBODY RUNS ANYTHING ON IT (2026-08-28)

**`RECORD_EPOCH` IS `2026-09-07`, A MONDAY, AND THE MUSEUM OPENS ITSELF AT 17:00
AMERICA/NEW_YORK ON IT.** There is **no cron, no queue, no scheduled job and no
person in the loop.** The worker plays the deployed bundle against **request
time**, so the day arrives on its own: Record 001 posts, `wing-open.js` opens
`/robots`, the countdown removes itself, the share cards start naming the robots,
and the seven governed pictures publish on the days after.

**SO A DEPLOY DOES NOT DECIDE THE DATE — IT ARMS IT.** Nothing about the command
above asks this constant, and nothing about calling the relaunch back-burner
reaches it. **Whatever day one says when you deploy is the day the museum opens,
whether or not anybody is watching**, and the only way to not have that day is
to move it **before it arrives** — one line in `src/data/artists/record-epoch.js`,
which moves the entries, the wing, the countdown and the pictures together.
**Deploying and then deciding is not available.** Mike's RULING D, 2026-08-28,
is the ORDER as much as the date: asked deploy-first or move-first, he answered
**move first**.

**IT MUST LAND ON A MONDAY.** `npm run dictation` refuses to build when the
epoch's weekday disagrees with the outline's ten declared `MON…FRI` rows — but
`docs/ARC.md` goes on printing `MON` for Record 001 whatever the epoch says, and
`arc:check` passes on the wrong table. Two moves, two Mondays, both luck. See
[D-a](../OPEN_ACTIONS.md#d-a).

**THE COST — TWO NUMBERS, BOTH TRUE.**

- **137 files (186,888,028 bytes)** become publicly readable.
- **0 additional files are uploaded.** Held files have shipped in both stages
  since the ruling of 2026-08-20; **the door changes, not the payload.**

**CHECKING THE DOOR.** At launch, a held path answers 404 `Not found` from the
worker itself (`src/worker.js:284–288`). A path that is merely missing falls
through to the site shell with status 200 — §8's *"on this site a missing image
is a 200"* is about that case, not this one. A held path never reaches the
fallback, because the door answers first. So a status check on a held path
**does** discriminate: **404 is the door holding. A 200 means that path is not
held at all.**

**HAZARD.** `/api/held` probes `/held/robots/art/portal-cover.png`, which the
Portal ruling moved out of held. It therefore reports `served:false` on a
healthy deployment, and a 200 on that address is the shell, not a leak. **Do not
use it to check the door.** Flagged 2026-08-22, not fixed.

> **[FLAG 2026-08-23 · verified probe, placed not fixed]**
> `/held/robots/art/mgk-niac-cover.png` returns 404 `Not found`, 9 bytes, from
> `src/worker.js:625–630`, refusal at `:627`. The moved file serves at
> `/robots/art/portal-cover.png`, 200 `image/png`, 641,677 bytes.
> **[2026-08-29] THE MEASUREMENT REPRODUCED AND ONLY ITS CITATION WAS STALE** —
> it read `:284–288`, refusal at `:286`, which is now the as-of clock note. Line
> numbers in a citation rot; the measurement did not. `npm run door:check` took
> the same reading cookie-free and got the same 404 at 9 bytes.

**`/api/held` REPORTS `stage` WITHOUT THE KEY. Only `commit`, `served` and
`probe` are gated on `open`, so the live stage is publicly measurable** —
`stage: __WB_STAGE__` is unconditional in the GET branch.

**AND A PROBE FROM A BROWSER ON THE KEY-HOLDER'S MACHINE ALWAYS ANSWERS `open`
AND PROVES NOTHING ABOUT THE DOOR.** Measured 2026-08-29: four held paths
returned 200 in that browser and 404 to a cookie-free client in the same minute.
**Check the door with `npm run door:check`, which sends no cookie and needs no
key** — it is not a gate and is not in §9; its home is after a deploy.

Counted **2026-08-22** at HEAD **`ee94ee0`**. Definition: files behind the door
as reported by `reveal:day` and present under `public/held`.

### SAME EXCEPT DATA

The standing design constraint.

> **"Don't build me a standalone turd; for god's sake at least put them all in
> one pile!"**

**A new robot should be a data drop, not a rebuild.** Every instrument, face and
deck is the museum's shared machinery driven by an artist config. **The second
robot is the test of the first** — if adding it means writing a component, the
first one was built wrong.

### BREADCRUMBS

> **"Leave breadcrumbs or we will become lost."**

When a round produces a **fact** — a measurement, a mechanism, a defect, a
resolved conflict — **file it where the fact belongs**: the canon
(`docs/canon/`), the rulings (`docs/MUSEUM_RULINGS-*.md`), the threads
(`docs/THREADS.md`), this file's §5 or §8. **Not only in the round log.**

**A round log is a diary, and diaries do not answer questions.** Nobody greps a
diary for *which channel is the machine on*.

### THE ARCHIVE IS A SNAPSHOT

`OPERATIONS_ARCHIVE/` holds what the ground state shed, cut at a named HEAD.
**It is never edited to track this file.** When ground-state text changes, the
archive keeps the old wording and this file's pointer carries the cut point —
so the archive stays readable as what the manual said on the day it was cut,
which is the only thing it is for.

### EVIDENCE

**Reading code is not evidence.** From one week, all four measured:

- a preset recipe that read correctly opened a **dead menu** — the function that
  applies it was never called;
- a video **healthy on every public signal** would not embed;
- a harness that **could not paint** reported a boot as stalled;
- the Portal **stayed held by its own path, quoted inside the comment that
  recorded its release.**

**The only oracle for a rendered thing is a rendered thing.** Load the page.
Green gates are not a working site.

**IF A RESULT SURPRISES YOU, SUSPECT THE PROBE BEFORE THE SITE.** Probes have
been wrong more often than the museum has this month: an off-by-one that read
`+1` then `−2`, a status check that called three deleted files present, a
`hit.contains(control)` that made every point pass. When a measurement is
surprising, the first thing to re-measure is the measurement.

### FOUR MORE THAT COST A ROUND EACH

- **A HOLD IS NOT A HOLD IF IT DEPENDS ON ANOTHER HOLD.** Mike's own words, and
  the reason `robots-units.js` exists. Anything held must be held **on its own
  condition** — a flag in a public module stops the render and ships every string
  anyway.
- **A RULING IS NOT DONE UNTIL A LEDGER ROW MOVES — AND NEITHER IS A REBUILD.**
  The panel was rebuilt and its twelve ledger rows still described a drum and two
  bat switches, with every gate passing.
- **NO ID MOVES WHEN A LEGEND IS RECUT.** An `id` is identity; the `name` is what
  restates the glass. Renaming rows to match new vocabulary broke the transfer
  table and looked like a deletion to the guard — which refused, correctly.
- **THE WORK GOES TO DISK BEFORE IT GOES TO CHAT.** Every round writes its report
  to a file first. The chat is the delivery; **the file is the record**, and a
  chat that closes takes everything in it.

---

## 1. Roles & the carry model

- **Mike** owns all UX-facing / UX-impactful calls, alone runs **the
  deploy**, and **carries** material between the three surfaces below.
  Nothing moves between surfaces unless Mike moves it.
- **Claude (any surface)** owns Ops: scoping, briefs, verification,
  drafting, **commit and push**. Claude never deploys, never decides UX.
- Questions to Mike: one at a time, only when genuinely load-bearing and
  undecidable; phrased in UX-impactful terms, concise bullets, plain
  syntax. Otherwise assume-and-state.

## 2. The three surfaces — capabilities matrix

| Surface | Repo reach | Can write repo | May push/deploy | Role |
|---|---|---|---|---|
| **Chat Claude** (claude.ai) | NONE. No filesystem access to `C:\AI`. Has: Google Drive connector, Chrome browser, web, chat uploads. | No | No — and no way to | Scoping, briefs, doctrine, reading conduit drops |
| **Code** (Claude Code, on the host) | Full, native, as Mike's account | Yes — straight to the tree | **Pushes. Never deploys.** | Repo reads/writes, verification, drafting, reports, commit and push |
| **Host pwsh** (Mike) | Full, native | Yes | **Deploy — the only permitted path** | Deploy, MV launch |

Facts every session must hold without rediscovering them:
- Chat Claude has NO filesystem and no tool that reaches one. It writes
  **briefs**; Mike carries them to Code.
- Code writes straight into the working tree — no mount, no sandbox, no
  output folder, nothing to carry out. A file Code writes IS the file.
- There is no CI. Deploy is manual and host-side only.
  See §0 DEPLOY — THE ONLY ACCOUNT.
- Code runs as Mike's own account and shares his push and deploy
  credentials. It commits and pushes; the deploy is §0's and his.

## 3. Conduit protocols (how material moves)

**Chat → Code:** Chat Claude writes a self-contained brief (one task,
explicit read-only/write scope, explicit target path). Mike pastes it
into Code, which writes to that path directly.

**Code → Chat:** Code writes the file to its path in the tree and says
so in chat; the file is the record. To reach a session that cannot see
disk, Mike runs `npm run conduit` (below) or uploads directly — Drive is
preferred for code files (chat Claude reads them via the Drive connector).

**Host → Code:** Mike runs what Code may not — `npm run deploy:launch` — and
pastes the output back. Everything else Code runs itself and reports. A
paste-back is for what is gated, not for size.

**The Drive conduit — `G:\My Drive\_conduit\`:**
- A dedicated folder. Everything in it is a **transfer payload**, not a
  reference copy.
- Every file dropped into `_conduit` MUST start with a freshness stamp
  header carrying four fields: `<!-- CONDUIT: HEAD <short-sha> · <ISO
  timestamp> · sha256 <sha256-16> · <source path> -->`. Writer adds it;
  reader checks it. **A `#` comment line is not the non-markdown form** — a
  `#` line is a syntax error in JS, CSS and JSON. The tool decides the comment
  syntax per file type.
- **Staleness rule:** if the stamp's HEAD doesn't match current
  `origin/main`, or the file has no stamp, treat it as STALE — usable as
  a hint, never as scoping ground truth. (Drive has served stale/retired
  trees before; loose files in Drive root from past sessions are stale by
  default.)
- **Drive full-text search returns false positives.** A phrase search has
  matched a file that cannot contain the phrase. **Neither a hit nor a miss is
  proof.** Anything that must be relied on is read whole, not searched.
- **The stamp is added on the way out and is not in the source file.** A
  dropped file is **114 bytes larger** than its source and **every line number
  in the drop is one higher** than the same line in the repo. A byte count or
  a line number taken from the conduit is a fact about the payload, never
  about the tree.
- `_conduit` is disposable. Clear it freely.

## 4. Script rules (anything run host-side)

1. **No placeholders, ever.** Every path, every value concrete. If a
   value is unknown, the script's first job is to discover and print it.
2. **Flat statements.** No load-bearing work inside `if/else` in scripts
   pasted line-by-line — the `else` orphans in the console and silently
   skips. Use explicit verify-or-abort lines.
3. **Read-only by default.** Scripts that write say so in their first
   comment line and name every path they touch.
4. PowerShell 7; single-line or `@'...'@` heredoc; UTF8 **no BOM**.
5. After any write script: print verification (byte counts, `git status`,
   tail of file) so the paste-back proves the result.

## 5. Verified file map (as of 2026-06-09)

> Moved whole to `OPERATIONS_ARCHIVE/05-FILE-MAP.md`, cut at HEAD `b3812cc`.
> Stamped *as of 2026-06-09*; §6 rules that the live working tree outranks it.
>
> **A ROW RAISED SINCE THAT CUT CARRIES ITS BODY HERE** — §8's own cycle, for
> §8's own reason: a snapshot cannot be appended to without ceasing to be one.

- **[2026-08-25] `approve:check` IS RED BY DESIGN, IS NOBODY'S PACKET GATE, AND
  WAS PARKED ON PURPOSE — 11 of 11 pages, and that is the expected reading.**
  It is Doctrine 15's shape exactly: it checks **whether MIKE HAS LOOKED**, not
  anything Ops can fix, so it must never join §9's list — putting it there would
  block every commit on an inspection nobody has been asked for, which is the
  opposite of his own condition that he must not perfect things in advance.
  **THE TOOL WAS CLOSED AS A BACKLOG ITEM ON 2026-08-17** (`c5b7943`) — *"a
  stamp with no consumer… nothing reads it back"* — and **THE APPROVAL LAW WAS
  EXPLICITLY NOT CLOSED AND NOT WEAKENED**: the signature, the fingerprint and
  the rule that a changed page stops being approved all stand, and
  `provenance/approvals.json` is untouched. **It returns when it feeds the
  quality box**, which is `docs/BACKLOG.md` **PARKED — no date**. The closure is
  `docs/OPEN_ACTIONS_CLOSED.md` and **nothing links to it**, which is why this
  row exists: **a red gate with no explanation is how a later round "fixes"
  something that was parked on purpose.** Before any page is worth signing, read
  the over-reach recorded at the head of `reveal/approval.mjs`.

## 6. Orientation protocol (every fresh session)

**Read order:** (1) this file → (2) `STATE.md` → (3) newest
`docs/HANDOFF_*.md` if present → (4) `git log --oneline -15` +
`git status -s`.

**Truth ranking when they disagree:**
`live tree > git log > STATE.md > handoffs > any chat memory/summary`.
Handoffs rot in days; git log is the progress record. A handoff's
"recommended next step" is a suggestion stamped at write time, not a
standing order.

**Files that do NOT exist (do not look for, do not invent):**
`BUILD_LOCK.txt` — no build-lock mechanism exists. (`C:\AI\START_HERE.md` is now REAL: the cross-project bootstrap, canonical at `docs/canonical/START_HERE.md`, added 2026-06-09.)
(These were hallucinated by a past session and propagated through two
handoffs. If a future session adds a real lock mechanism, it updates this
line.)

**Do not re-investigate closed items.** Check STATE.md "Decisions /
closed" first (e.g., the COL3 FB clip — read
`docs/FINDING-fb-post-clip.md` before touching it).

## 7. Working Doctrine (process rules — paid for by real failures)

Mirrors STATE.md → Working Doctrine; this copy is canonical for process.

> **[FLAG 2026-08-23 · flagged, not fixed]** Measured this round: STATE.md's
> Working Doctrine block is 2,009 bytes and carries 6 numbered doctrines; §7
> carries 27. The mirror claim is not true in the direction that matters —
> there is no second full copy of §7 anywhere. Whether STATE expands or the
> claim is dropped is a second decision and it has not been made.

> Every doctrine's body is in `OPERATIONS_ARCHIVE/07-WORKING-DOCTRINE.md`,
> cut whole at HEAD `b3812cc`. Lead lines only below.

1. **Verify before scoping.**
2. **Don't guess — look it up.**
3. **Repo work is done in the tree, not through a relay.**
4. **Drive the live UI by accessibility ref, not pixel coordinates**
5. **No load-bearing if/else in pasted scripts** (§4.2).
6. **Durability:** committed AND pushed AND (UI) deployed. Scratch files,
7. **A behavior does not change unless there is a stated reason.**
8. **Prefer native/platform mechanics over custom logic.**
9. **Verify before commit; commit after every verified step** — never
10. **Understand the problem before acting.**
11. **THE LAW OF THE VISIBLE LINE (Mike, 2026-08-04 — STANDING, site-wide).**
12. **OPS DOES NOT INVENT CONTENT (Mike, 2026-08-04 — STANDING, site-wide).**
13. **EVERY VISIBLE STRING CARRIES ITS ORIGIN (v48, 2026-08-04 — STANDING).**
14. **THE OPEN-ACTION REGISTER IS MAINTAINED BY EVERY ROUND (Mike,
    2026-08-04 — STANDING).**
15. **THE RECORD APPROVAL GATE (Mike, 2026-08-04 — STANDING).**
16. **THE LAW OF SUBTRACTION (Mike, 2026-08-04 — STANDING, site-wide).**
17. **ONE PASSAGE, ONE DECLARATION (Mike, 2026-08-06 — STANDING, site-wide).**
18. **IN-STORY TECHNICAL SPECIFICATIONS (Mike, 2026-08-06 — STANDING, site-wide).**
19. **THE EXPANDER RULE (Mike, 2026-08-06 — STANDING, site-wide).**
20. **THE BOUNCY BALL LAW (Mike, named 2026-08-02 — CORRECTED 2026-08-07 —
    STANDING, site-wide).**
21. **EVERYTHING IN THE FORM IS STORY (Mike, 2026-08-08 — STANDING,
    site-wide).**
22. **A LIMIT IS SHOWN WHERE THE STRING IS WRITTEN (Mike, 2026-08-08 —
    STANDING, every instrument).**
23. **THE RECORD'S REGISTER — EMAIL-LIKE, NOT AN EMAIL PROGRAM (Mike,
    2026-08-08 — STANDING, the Record and anything that inherits it).**
24. **ONCE IT IS RULED GONE, IT IS GONE FROM HIS VIEW (Mike, 2026-08-08 —
    STANDING, every surface Ops builds).**
25. **THE TOOLS ARE FOR WORKING, NOT FOR BRIEFING (Mike, 2026-08-08 —
    STANDING).**
26. **LEAD WITH WHAT HE MUST DO OR DECIDE (Mike, 2026-08-09 — STANDING).**
27. **AN ASSET CULL ASKS WHAT BUILDS FROM A FILE, NOT ONLY WHAT DISPLAYS IT
    (Mike, 2026-08-20 — STANDING).**
28. **ONE SUMMARY, ONE EXIT (Mike, 2026-08-29 — STANDING, every Ops
    message).** Body: `docs/OPS-RESPONSE-SHAPE-20260829.md`.
29. **OPS BOOTS FROM A FILE, NEVER FROM A PASTED MESSAGE (Ops,
    2026-08-29 — STANDING).** Body: `docs/canonical/OPS_BOOT.md`.

## 8. Known hazards (environment quirks)

> **LEAD LINES, AND EVERY BODY THAT HAS BEEN CUT IS IN THE ARCHIVE — in FOUR
> cuts**, because §0 rules an archive a snapshot that is never edited:
> `OPERATIONS_ARCHIVE/08-KNOWN-HAZARDS.md` at HEAD `b3812cc`,
> `08-KNOWN-HAZARDS-II.md` at HEAD `2f94fd7`, `08-KNOWN-HAZARDS-III.md` at HEAD
> `35f805b`, and `08-KNOWN-HAZARDS-IV.md` at HEAD `09efc03`. Each is true of
> its own moment.
> **[2026-08-29] THE FOURTH CUT WAS ALSO TAKEN BY THE CEILING** — the day's
> doctrines and the SHELL-STOP left 244 bytes, and the deploy sweep that comes
> next needs room for a hazard line. **Seven bodied entries went, 6,050 bytes.**
> The third cut was taken the same way at 108%. **The one bodied entry left is
> 2026-08-29's, which is the cycle below rather than an exception.**
>
> **A HAZARD RAISED SINCE THE LAST CUT CARRIES ITS BODY HERE, AND THAT IS THE
> CYCLE RATHER THAN AN EXCEPTION.** A snapshot cannot be appended to without
> ceasing to be one, so a new body has nowhere else to live until the next cut
> sweeps it — which is exactly what happened between `b3812cc` and `2f94fd7`.
> **Bodies accumulate here and a cut moves them; the ceiling is what says when.**
> Keep them few and keep them short: the arithmetic below is why.
>
> **THE UNIT IS THE BOLDED LEAD SPAN WHERE IT CLOSES ON TERMINAL PUNCTUATION,
> OTHERWISE THE WHOLE FIRST PHYSICAL LINE.** The `wrangler dev` entry below is
> the second case — its bold closes mid-sentence at `open**` — and it is why the
> rule has two halves rather than one.
>
> **[2026-08-24] A BODIED ENTRY COSTS EIGHT TIMES A LEAD LINE, AND THE CEILING
> IS WHAT SAID SO.** Measured at this cut: **848 bytes for a bodied entry
> against 102 for a lead-only one.** §8 was 5,026 of the 6,032 bytes this file
> gained after `4a0ef11`, and ONE packet's three bodied entries were 2,536 of
> that — **42% of the whole file's growth in one round.** Three bodied hazards
> spend about a fifth of the headroom. Write the lead line here, the body there.
>
> **[2026-08-24] ONE HAZARD, ONE HOME.** The NUL-byte class was filed TWICE — a
> lead line here and a full body inside §9's close ritual — and the duplicate
> came from **a hazard being written into a RITUAL section rather than a hazard
> one.** §9's copy is gone; the lead line below is the home.

- **A PUBLISH SCOPE RESOLVED FROM CODE REACHABILITY IS NOT THE SAME QUESTION AS
  THE LAW THAT GOVERNS THE CONTENT, AND ON 2026-08-22 ONLY THE FIRST WAS ASKED
  (2026-08-25).** Ruled 2026-08-25 — RULING A, the six photographs stand.

- **`CF-Cache-Status` IS APPENDED BY THE ASSET WORKER, NOT BY THE ZONE CDN
  (2026-08-24).** The HTML is not edge-cached: **no cache purge for HTML.**

- **[2026-08-17] `assets:scan` WALKS DISK, AND DISK INCLUDES GITIGNORED TREES.
  A ROW IS COMMITTED; THE FILE MAY NOT BE, AND THEN THE ROW IS BORN AN ORPHAN.**
- **[2026-08-17] A LAZY IMAGE DOES NOT LOAD IN A FRAME THE BROWSER IS NOT
  PAINTING — the same family as the `requestAnimationFrame` row below.**
- **Cowork FUSE/sync truncation.**
- **Cowork mount READ-LAG (2026-07-06).**
- **Virtiofs:** phantom deletions in `git status` from the sandbox (HR
- **~16KB post-edit boundary** silently tail-truncates patched files —
- **`assets.run_worker_first` IS A LIST WITH A DEFAULT ON THE OTHER SIDE OF IT (H1, 2026-08-06).**
- **A LITERAL NUL BYTE WRITTEN BY A PATCH SCRIPT — THE CLASS IS THREE ROUNDS OLD AND STILL PRODUCING (H8, 2026-08-06).**
- **`wrangler dev` CACHES ITS ASSET MANIFEST AT STARTUP, AND A REBUILD MID-LAP 404s THE WHOLE SITE (H1, 2026-08-06).**
- **A GENERATOR WHOSE OUTPUT HAS BEEN EDITED BY HAND WILL DELETE THE EDIT ON ITS NEXT RUN, SILENTLY (A3, 2026-08-06).**
- **A BUILD THAT BUILDS HALF THE APPLICATION LOOKS LIKE A BUILD (V1, 2026-08-06).**
- **A GOVERNED PICTURE HAS TWO ADDRESSES, AND ANYTHING THAT MATCHES ON ONE OF THEM IS WRONG (C1, 2026-08-06).**
- **`wrangler dev` holds `dist/weird_baby/.wrangler` open**, so `npm run build` fails with `EPERM … dist\weird_baby\.wrangler` while it is running. Stop the dev server (and any leftover `workerd` processes) before rebuilding. It also **caches its asset manifest at startup**, so a file added or removed under `dist/client` mid-run is not seen until it restarts — which is what makes an honest break-it-on-purpose test need a restart to be real.
- **A CLIPBOARD WRITE IS NOT DONE UNTIL IT HAS BEEN READ BACK (U2, 2026-08-09).**
- **A GENERATED PAGE AND THE LIST ITS SCRIPT WALKS MUST BE PROVED THE SAME SET, NOT ASSUMED (U3, 2026-08-09).**
- **THE PROVENANCE SWEEP'S "UNREACHABLE" BUCKET IS NOT A DEAD-CODE LIST, AND A CLEANUP ROUND COULD DELETE A LIVE WING FROM IT (M84, 2026-08-06 — moved here from the register 2026-08-09 because it is a note, not an action).**
- **`innerText` RETURNS WHAT CSS DISPLAYS, NOT WHAT IS IN THE DOM (E5, 2026-08-09).**
- **`requestAnimationFrame` DOES NOT FIRE IN A TAB THAT IS NOT BEING PAINTED (E5, 2026-08-09).**
- **FOUR WAYS TO PROVE A FEATURE ABSENT THAT IS PRESENT AND RUNNING (2026-08-16).**
- `export-artifacts.mjs` prints a harmless `UV_HANDLE_CLOSING` assertion
- Drive root contains loose stale code copies from past sessions — stale
- **`docs/canonical/START_HERE.md` HAS AN UNVERSIONED TWIN AT `C:\AI\START_HERE.md`, AND NOTHING NOTICES WHEN THEY DRIFT (2026-08-23).**
- **`docs:numbers:gate` TAKES OVER TWO MINUTES BECAUSE IT SHELLS OUT TO `npx eslint .`, AND IT WILL TIME OUT UNDER ANY DEFAULT AGENT CEILING WHICHEVER WAY IT IS INVOKED (2026-08-23, corrected the same day).**
- **THE DESK'S REGISTER CHECK IS ONE-DIRECTIONAL: IT PROVES EVERY LINK POINTS AT A LIVE ROW, AND NOTHING PROVES A ROW IS REACHABLE (2026-08-23).**
- **NO GATE IN THIS TREE READS A RESPONSE HEADER, SO THE WORKER'S CACHE MARKS ARE ENFORCED BY NOTHING (2026-08-24).**
- **NOTHING COUNTS `todayInRecordTz` CALL SITES, AND A NAIVE COUNT IS INFLATED BY THE SENTENCE THAT STATES THE RULE (2026-08-24).**
- **NOTHING READS THE DICTATION PAGES' PUBLISHED NUMBERS, AND THEY WERE WRONG FOR EIGHT DAYS (2026-08-24).**
- **`record:land`'s STALENESS GUARD IS INERT ON THE WORKBOOK PATH — `workbook_to_draft.py` STAMPS `saved` WITH `now()`, SO A WORKBOOK OF ANY AGE PASSES IT, AND WHAT IS HOLDING THE DOOR IS THE COMMENT REFUSAL FIRING FOR AN UNRELATED REASON (2026-08-25).**
- **A DATED RUNBOOK IS OUTSIDE `docs:numbers:gate`'s SET, SO ITS VALUES ARE PROSE — AND THE PROSE LOST WITHIN A DAY OF THIS ROW BEING WRITTEN (2026-08-25, FIRED 2026-08-27).**
- **A GENERATED PAGE IS A SNAPSHOT, AND A SAVE FROM A STALE ONE CARRIES A TRUE TIMESTAMP ON OLD WORDS — WHICH IS WHY `record:land`'s GUARD 8 PASSES IT (2026-08-26).**
- **A BACKSLASH CANNOT BE CHECKED BY READING IT IN ANY LANGUAGE, AND A HEREDOC IS ONE MORE LAYER THAT EATS ONE (2026-08-26).**
- **A GENERATOR'S FENCE PROTECTS THE TOOL IT LIVES IN AND NOTHING ELSE, AND FOUR OF FIVE COVER TOOLS HAD NONE (2026-08-26).**
- **`npm run mock` NEVER READS `req.method`, SO A POST TO IT IS A 404 — AND ON AN http ORIGIN `showSaveFilePicker` EXISTS, SO `record.html`'s FALLBACK THEN OPENS A FOLDER DIALOG AND REPORTS SUCCESS ABOUT A FILE OUTSIDE THE REPO (2026-08-26).**
- **A GREP OF THE WORKING TREE CANNOT SEE LOST WORK, AND REPORTING ITS SILENCE AS ABSENCE HAS NOW MISSED TWICE IN ONE DAY (2026-08-27).**
- **A MARKDOWN FILE IS EXECUTABLE AND ITS INLINE BACKTICKS ARE COMMAND SUBSTITUTION — a `node -e` string broke out of its quoting on 2026-08-29, bash ran repo files, and a deploy published at 14:03:26.328Z. THE LINE THAT DEPLOYED IS NOT ESTABLISHED: this file fires only `npm run mock` and `npm run dictation` in isolation, eight other tracked files DO fire a deploy, and the SHELL-STOP at the head of this file now aborts bash before any of it. Body: ruling 29.**
- **CONTENT MUST NEVER CROSS A SHELL QUOTE BOUNDARY — BUILD A SCRIPT AS A FILE AND RUN IT WITH `node <path>` (2026-08-29).** `node -e` with escaped quotes inside a quoted shell string is what published the museum at 14:03:26.328Z, and the cause beyond that is unestablished and expected to stay so. Prose, paths and markdown go in the file; the shell sees only the path.
- **A PROVENANCE ROW'S MASTER-RENDER PATH IS UNCHECKED PROSE, AND FIVE OF THE SIX MANUAL SCANS NAME ONE THAT DOES NOT EXIST — the leaves are a directory deeper, under `structure/pages/` (F1, 2026-08-29).** `BELL-103.md` flagged `scan-31-a` alone on 2026-08-26; it holds for all five. No gate resolves a path a provenance row cites, so the row reads VERIFIED either way.
- **A PUBLISHED NUMBER IN A REGISTER ROW IS A MEASURED CLAIM, AND EDITING THE ROW WITHOUT RE-MEASURING TURNS A GATE RED ON A LINE THAT WAS TRUE THAT MORNING (2026-08-29).** Twice in two rounds: `OPERATIONS.md:164`'s held-cost pair, which `numbers-gate`'s `held-cost` claim walks `public/held` to check, and `BACKLOG.md:310-311`'s 162/156/130, which it counts off this register's own rows.
- **A PARAGRAPH RECORDING A RULING CONTRADICTED ITSELF WITHIN ITSELF, CLAIMING BOTH *“nothing stale on the glass”* AND CORRECTNESS *“in a tab left open across midnight”* — WHICH IS THE ONE CASE WHERE THAT COPY IS THE SHUT COPY (F11, 2026-08-30).** It travelled from a round log into `src/routes/WbHome.jsx` and gained an attribution on the way, so a later round meets it as settled. The sentence is NOT edited; the defect it hid is [`L-e`](../OPEN_ACTIONS.md#l-e).
### AN INSTRUMENT THAT RETURNS HEALTHY IS NOT EVIDENCE OF HEALTH
### WHEN IT CANNOT SEE THE FAILURE MODE (2026-08-21)

### A VIDEO CAN BE UNEMBEDDABLE WITH EVERY PUBLIC SIGNAL READING HEALTHY,
### AND IT IS NOT ALWAYS AN AGE GATE (2026-08-21)

### A CLICK INSIDE A CROSS-ORIGIN IFRAME RAISES NO EVENT IN THE PARENT (2026-08-21)

### OPS CANNOT SEE `file://`, SO EVERY MOCK IS SERVED — `npm run mock` (2026-08-21)

### A STALLED HARNESS AND A STALLED CEREMONY LOOK IDENTICAL — THE ONLY ORACLE
### FOR PLAYBACK IS A PERSON IN A FOREGROUND TAB (2026-08-21)

### `getAttribute("style")` IS THE TARGET, `getComputedStyle` IS THE
### INTERPOLATED VALUE, AND FOR 420ms THEY DISAGREE (2026-08-21)

### A CIRCULAR SIZE RESOLVES TO ZERO, NOT TO AN ERROR (2026-08-21)

### `!important` IS SOMETIMES THE HONEST ANSWER, AND IT IS THE SECOND HALF OF A
### TWO-OWNER LAYOUT (2026-08-21)

### A COMMENT INSIDE A LIST A REGEX PARSES IS NOT A COMMENT (2026-08-22)

### ON THIS SITE A MISSING IMAGE IS A 200, AND ONLY THE DECODE TELLS THE TRUTH
### (2026-08-22)

### MOVING THE EPOCH DOES NOT MAKE THE SAVED DRAFT STALE, AND `record:land`
### WOULD LAND IT AS NEGATIVE DAYS (2026-08-28)

- **A stale draft lands `recordDay(-6)`…`(-2)` and `Week 1` vanishes from the
  dateline; the `--write` guard reads `robots-record.js` and never the epoch.
  AFTER MOVING THE EPOCH, OPEN THE DAY EDITOR AND SAVE** before anybody runs
  `record:land -- --write`.


## 9. Session-close ritual

**Code works this ritual end to end** — §0 MIKE IS THE LOCK.

> **The steps stay here; the reasoning under step 0 is in**
> `OPERATIONS_ARCHIVE/09-SESSION-CLOSE.md`, cut at HEAD `2f94fd7`. The hazard
> narrative that had accreted in the same step went to `08-KNOWN-HAZARDS-II.md`
> instead — a prune procedure and a NUL-byte defect class are hazards, and a
> hazard filed in a ritual section is how that class came to be filed twice.

0. **Gates, in this order:** `npm run lint` (baseline **9 errors / 7
   warnings**, zero new — moved from 9 / 8 on 2026-08-26 by a real removal,
   and the round checked that it was one: see CLAUDE.md's pre-flight note,
   where the first cut of the same edit moved this number by SUPPRESSION and
   was undone) → `npm run build` (green) → **`npm run
   provenance:gate` (exit 0)** → **`npm run reveal:check` (exit 0) if the
   ledger changed — [R3 2026-08-06] OR IF THE RECORD DID, because it now
   carries `RECORD BUDGETS` and a Record edit that never touches the ledger is
   exactly the edit that can overflow an index row** → **[v56] `npm run parity:gate` (exit 0) if either machine
   album changed** → **[N2 2026-08-06] `npm run instory:gate` (exit 0) on EVERY
   packet, not conditionally — a spec surface drifts back when somebody adds a
   true fact to it, and "did I touch a spec face" is exactly the question a
   session that just added one answers wrongly (Doctrine 18)** → **[2026-08-13]
   `npm run docs:numbers:gate` (exit 0) on EVERY packet — see the row below** →
   **[2026-08-29] `npm run shellstop:gate` (exit 0) on EVERY packet — a tracked
   file that names a deploy where a shell would run it must carry a SHELL-STOP.
   It covers BOTH repositories and REFUSES if the robots clone is not beside the
   museum, because measuring one and reporting a clean class is the failure it
   exists to catch** → the lap.

1. Commit + push everything durable (explicit paths).
1a. **Update `docs/OPEN_ACTIONS.md`** (Doctrine 14) — statuses flipped for what
   closed, rows added for what this round exposed. Same commit.
2. If facts in THIS FILE or STATE.md changed (file map, hazards,
   protocols, closed decisions) — update them in the same session, same
   commit discipline. An orientation doc more than a few days
   behind git log is a defect.
3. Write/refresh `docs/HANDOFF_next_session.md` only for session-scoped
   context (what's mid-flight, open UX questions). Process and facts do
   NOT go in handoffs — they go here or in STATE.md.
4. Optionally drop refreshed OPERATIONS.md + STATE.md into
   `G:\My Drive\_conduit\` (with stamps) so chat sessions can self-orient
   without a paste.

## Delivery & Commit Gates (RCCA 2026-07-06 — stranded-Downloads incident)

Root cause: delivery and commit steps completing silently, unverified. Proven
losses: MV_VOCAB_MIGRATION_BRIEF-20260624 (stranded in Downloads 12 days),
MV_VOCAB_RECONCILE_PLAN-20260624 (believed committed 6/24; was untracked until
2026-07-06), weird_baby_combined.docx (stranded 75 days).

1. LANDING GATE — a chat deliverable does not exist until it is at its target
   path in the tree. Downloads is transit, never storage. Prefer heredoc
   direct-write to target path over browser download. Any file that does
   transit Downloads is copied to the tree and committed in the same
   session.
2. COMMIT GATE — Code runs the commit, then verifies it by
   re-running `git status --short` and confirming the new hash in `git log`.
   No commit is "done" until that read has happened. Narrating a commit is
   not a commit.
3. SESSION-CLOSE CHECK — before any session ends: `git status --short` is
   empty, or every remaining line is explained and accepted.
4. DB dumps (`backups/`) are gitignored by policy. Durable home: OneDrive
   mirror, not git history.
