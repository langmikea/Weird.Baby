# OPERATIONS — Weird.Baby Museum (cross-session operating manual)

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

He alone runs git and deploy. Ops edits, verifies and reports; **Ops never
commits, never pushes, never deploys.**

**THE MARKER IS `[MIKE]`.** Anywhere in this file, a clause marked **[MIKE]**
is his: Code prepares it, **stops there, and does not go on until he has run
it.** It attaches to the clause that is his, never to the whole step — mark
the step and a session hands him its own work and waits for it.

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
> `src/worker.js:284–288`, refusal at `:286`. The moved file serves at
> `/robots/art/portal-cover.png`, 200 `image/png`, 641,677 bytes.

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

- **Mike** owns all UX-facing / UX-impactful calls, alone runs **commit,
  push and deploy**, and **carries** material between the three surfaces
  below. Nothing moves between surfaces unless Mike moves it.
- **Claude (any surface)** owns Ops: scoping, briefs, verification,
  drafting. Claude never pushes, never deploys, never decides UX.
- Questions to Mike: one at a time, only when genuinely load-bearing and
  undecidable; phrased in UX-impactful terms, concise bullets, plain
  syntax. Otherwise assume-and-state.

## 2. The three surfaces — capabilities matrix

| Surface | Repo reach | Can write repo | May push/deploy | Role |
|---|---|---|---|---|
| **Chat Claude** (claude.ai) | NONE. No filesystem access to `C:\AI`. Has: Google Drive connector, Chrome browser, web, chat uploads. | No | No — and no way to | Scoping, briefs, doctrine, reading conduit drops |
| **Code** (Claude Code, on the host) | Full, native, as Mike's account | Yes — straight to the tree | **Has them. Never uses them.** | Repo reads/writes, verification, drafting, reports |
| **Host pwsh** (Mike) | Full, native | Yes | **YES — the only permitted path** | Push, deploy, MV launch, anything load-bearing |

Facts every session must hold without rediscovering them:
- Chat Claude has NO filesystem and no tool that reaches one. It writes
  **briefs**; Mike carries them to Code.
- Code writes straight into the working tree — no mount, no sandbox, no
  output folder, nothing to carry out. A file Code writes IS the file.
- There is no CI. Deploy is manual and host-side only.
  See §0 DEPLOY — THE ONLY ACCOUNT.
- Code runs as Mike's own account and is NOT fenced off from his push
  and deploy credentials. Nothing technical stops it. §0 does.

## 3. Conduit protocols (how material moves)

**Chat → Code:** Chat Claude writes a self-contained brief (one task,
explicit read-only/write scope, explicit target path). Mike pastes it
into Code, which writes to that path directly.

**Code → Chat:** Code writes the file to its path in the tree and says
so in chat; the file is the record. To reach a session that cannot see
disk, Mike runs `npm run conduit` (below) or uploads directly — Drive is
preferred for code files (chat Claude reads them via the Drive connector).

**Host → Code:** Mike runs what Code may not — `git push`,
`npm run deploy:launch` — and pastes the output back. Everything else Code
runs itself and reports. A paste-back is for what is gated, not for size.

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

## 8. Known hazards (environment quirks)

> Every hazard's body is in `OPERATIONS_ARCHIVE/08-KNOWN-HAZARDS.md`,
> cut whole at HEAD `b3812cc`. Lead lines only below — except entries raised
> after that cut, which carry their bodies here, because the archive is a
> snapshot (§0) and is never edited.

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
  > **[FLAG 2026-08-23 · flagged, not fixed]** This entry's bold closes
  > mid-sentence — at `open**` — so it falls back to its whole first physical
  > line, which in this hazard is the whole hazard. That is why it carries body
  > text where the other entries do not. The `**` is not moved and the source
  > line is not edited.
- **A CLIPBOARD WRITE IS NOT DONE UNTIL IT HAS BEEN READ BACK (U2, 2026-08-09).**
- **A GENERATED PAGE AND THE LIST ITS SCRIPT WALKS MUST BE PROVED THE SAME SET, NOT ASSUMED (U3, 2026-08-09).**
- **THE PROVENANCE SWEEP'S "UNREACHABLE" BUCKET IS NOT A DEAD-CODE LIST, AND A CLEANUP ROUND COULD DELETE A LIVE WING FROM IT (M84, 2026-08-06 — moved here from the register 2026-08-09 because it is a note, not an action).**
- **`innerText` RETURNS WHAT CSS DISPLAYS, NOT WHAT IS IN THE DOM (E5, 2026-08-09).**
- **`requestAnimationFrame` DOES NOT FIRE IN A TAB THAT IS NOT BEING PAINTED (E5, 2026-08-09).**
- **FOUR WAYS TO PROVE A FEATURE ABSENT THAT IS PRESENT AND RUNNING (2026-08-16).**
- `export-artifacts.mjs` prints a harmless `UV_HANDLE_CLOSING` assertion
- Drive root contains loose stale code copies from past sessions — stale
- **`docs/canonical/START_HERE.md` HAS AN UNVERSIONED TWIN AT `C:\AI\START_HERE.md`, AND NOTHING NOTICES WHEN THEY DRIFT (2026-08-23).** `C:\AI` is a plain directory — there is no `.git` at `C:\AI` or at `C:\` — so the twin has no history, no `git diff`, no `git checkout --` to undo a bad write, and it never appears in any `git status`. It is the copy a fresh session outside this repo actually opens. It held one md5, `1c020bd0`, from 2026-06-09 until `0fa8709`: the governed copy was edited that day and the twin stayed stale until it was copied over. **The twin is COPIED byte-for-byte from the governed file after a push, never hand-edited** — an unversioned file gets no manual write while an identical governed copy exists. No gate, no generator and no `git status` will report the next drift; only someone reading both will.
- **`docs:numbers:gate` TAKES OVER TWO MINUTES BECAUSE IT SHELLS OUT TO `npx eslint .`, AND IT WILL TIME OUT UNDER ANY DEFAULT AGENT CEILING WHICHEVER WAY IT IS INVOKED (2026-08-23, corrected the same day).** Measured: `npm run desk` **1s**, `npm run docs:numbers:gate` **136s**, `node tools/numbers-gate.mjs --gate` **134s**. **npm costs about two seconds, not two minutes.** This entry first blamed npm startup and was disproved by running the thing it described — the expense is `measure.lint`, which runs `npx eslint .` over the whole repo on every gate. Allow 300s and either route completes. **The npm-versus-node distinction survives as reporting honesty, never as a workaround:** "the gate passed" and "the npm script completed" are different sentences, a direct `node` call never exercises the `package.json` wiring, and a renamed or broken script entry would pass unnoticed. **Say which one was run.**
- **THE DESK'S REGISTER CHECK IS ONE-DIRECTIONAL: IT PROVES EVERY LINK POINTS AT A LIVE ROW, AND NOTHING PROVES A ROW IS REACHABLE (2026-08-23).** `npm run desk` collects every `OPEN_ACTIONS.md#id` on each side page and reports any that resolves to no row. It is a real check and the only anchor validation in the tree, but it says nothing in the other direction: **a row nothing links to passes by not being referenced**, which is how `g-a`, `g-b` and `g-c` passed on their first run. A clean anchor report is not evidence that a row is findable — only that no page points at a row that has gone.
- **NO GATE IN THIS TREE READS A RESPONSE HEADER, SO THE WORKER'S CACHE MARKS ARE ENFORCED BY NOTHING (2026-08-24).** The class named below, with the instrument missing altogether: `src/worker.js` marks every cookie-decided exit `private, no-store` (`5acff0e`), and deleting all of them leaves `lint`, `build`, `provenance:gate`, `reveal:check`, `instory:gate`, `parity:gate` and `docs:numbers:gate` every one of them green. **THE REMEDY IS A RUNTIME PROBE, NOT A GREP:** which exits are cookie-decided is a judgement rather than a pattern, so the only honest check boots the worker and asserts the header on the real addresses. **AND THE RAW COUNT IS NOT A GATE INPUT:** 16 `Cache-Control` sites at HEAD, 2 of them inside the `noStore` and `withSetCookie` helper bodies.
- **NOTHING COUNTS `todayInRecordTz` CALL SITES, AND A NAIVE COUNT IS INFLATED BY THE SENTENCE THAT STATES THE RULE (2026-08-24).** `src/worker.js` must keep exactly ONE call (`f2dc391`); a second splits the museum in half — part of a page answering the driven day and part the real one — and does it silently. The rule is a comment and nothing else. **`grep -c "todayInRecordTz(" src/worker.js` RETURNS 4: one call and three prose mentions, TWO OF WHICH ARE THE DOCTRINE TEXT DESCRIBING THE INVARIANT.** A gate reading that number would be inflated by the sentence stating the thing it checks, so a real check strips comments first — the same trap as the header count above, and neither raw number is usable as a gate input.
- **NOTHING READS THE DICTATION PAGES' PUBLISHED NUMBERS, AND THEY WERE WRONG FOR EIGHT DAYS (2026-08-24).** `docs/dictation-20260807/` published 16 pictures behind the stage door against a real 144, and 44 addressable files against 183, from 2026-08-16 until `80c6fb8`. **THEY WERE NOT FALSE WHEN WRITTEN:** `prep.mjs` computed them correctly and nobody regenerated the pages while their inputs moved, so this is DERIVED-ARTIFACT STALENESS and not a false published claim. **THE REMEDY IS REGENERATE-TO-A-TEMP-DIR AND DIFF, AND IT IS NAMED HERE RATHER THAN BUILT:** `prep.mjs` is deterministic — `specsheet.html` and `arc.html` came back byte-identical after twelve days — and no page carries a build stamp, so a byte-diff is exact and needs no measurers. **EXTENDING `docs:numbers:gate` IS THE WRONG JOB:** its model is a `near` phrase in markdown prose against a `measure.*` value, and every count here would need a measurer re-implementing the asset-table × ledger JOIN — the third copy `prep.mjs`'s own header forbids.

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

## 9. Session-close ritual

**Code works this ritual, except where marked [MIKE]** — §0 MIKE IS THE LOCK.

0. **Gates, in this order:** `npm run lint` (baseline **9 errors / 8
   warnings**, zero new) → `npm run build` (green) → **`npm run
   provenance:gate` (exit 0)** → **`npm run reveal:check` (exit 0) if the
   ledger changed — [R3 2026-08-06] OR IF THE RECORD DID, because it now
   carries `RECORD BUDGETS` and a Record edit that never touches the ledger is
   exactly the edit that can overflow an index row** → **[v56] `npm run parity:gate` (exit 0) if either machine
   album changed** → **[N2 2026-08-06] `npm run instory:gate` (exit 0) on EVERY
   packet, not conditionally — a spec surface drifts back when somebody adds a
   true fact to it, and "did I touch a spec face" is exactly the question a
   session that just added one answers wrongly (Doctrine 18)** → **[2026-08-13]
   `npm run docs:numbers:gate` (exit 0) on EVERY packet — see the row below** →
   the lap.

   **[2026-08-13] THE NUMBERS GATE, AND WHY IT IS UNCONDITIONAL.** `npm run
   docs:numbers` measures every standing value published in THIS file and in
   `CLAUDE.md` — the lint baseline, the asset table's row count, the ledger's,
   the manual's page count — and refuses on a mismatch, naming the document, the
   line and both numbers. It exists because **six stale published numbers were
   found on 2026-08-13 and it was the third time**, and because the failure is
   worse than "out of date": a baseline is only useful as a comparison, so
   publishing the wrong one does not weaken the tripwire, **it inverts it.**
   IT RUNS ON EVERY PACKET FOR THE REASON DOCTRINE 18's GATE DOES: a number goes
   stale when somebody changes the thing it counts, and "did I change something a
   document publishes a count of" is exactly the question a session answers
   wrongly. On its first honest run it found a SEVENTH — the ledger's `when`
   field published as null on 152 rows against a real 166.
   **IT NEVER READS A ROUND LOG.** `STATE.md` is excluded whole and this file has
   no round log; in `CLAUDE.md` the gate stops at `## Recent session log`. A
   recorded measurement is history and rewriting it would falsify the record that
   makes the tripwire legible. See the header of `tools/numbers-gate.mjs`.

   **[N5 2026-08-06] AND THE LAP HAS BOTH HALVES AGAIN — `npm run lap`.** M97
   recorded four consecutive rounds in which the 390px half did not run, because
   the operator's window will not go below 1228 CSS px and Chrome refuses
   `window.resizeTo`. **The window's size was never the museum's viewport.** A
   403px same-origin iframe gives a document whose `innerWidth` is 390 exactly,
   and same-origin means the driver takes real measurements instead of reading
   pixels off a screenshot. The harness is committed at `tools/lap/harness.html`;
   `npm run lap` copies it into `public/` for the run and `npm run lap:clean`
   takes it out, because anything left in `public/` is in `dist/client` and one
   deploy would publish it (see §0 DEPLOY — THE ONLY ACCOUNT).
   **`npm run lap:clean` before the seal is part of the ritual, not an
   afterthought.** A packet that added visitor-facing
   content adds its register rows in the same commit **[MIKE]**; a packet that
   added or changed a media file re-runs `npm run assets:scan` in the same
   commit **[MIKE]**.

   **[v56/R7] AND THEN READ `npm run surfacing`, which is NOT a gate.** It
   cannot fail — an unshown thing is inventory, not a defect. It is here because
   **the packet is the only clock this repository has**, and the number it prints
   is the one Mike asked for a mechanism to be able to say: *what has this wing
   built and never shown anybody.* The proposed cadence is ONE SURFACING PER
   PACKET, and **the shelf must not grow two packets running** — one round of
   building ahead is stock, two is a habit. A round that moves it runs
   `npm run surfacing -- --log` so the next round's number means something.

   **[v56] TWO HAZARDS THIS ROUND RE-CONFIRMED, both worth reading before you
   trip them again.** `provenance-sweep --prune` broke **44 RESTATED chains** in
   one run — v52 already recorded that *a rename plus a prune is two safe
   operations that are unsafe in sequence*, and it is now twice. Re-run the gate
   after any prune; the RESTATED class's requirement that a reference RESOLVE is
   the only thing in the whole boundary that notices a deletion. And **never use
   `git checkout --` to undo a deliberate test break on a file that also holds
   uncommitted work** — it reverted this round's own G1 edits along with the
   break. **Sandbox breakage tests by FILE COPY.**

   **[P1–P5 2026-08-05] THE PRUNE HAZARD IS NOW A PROCEDURE, AND IT IS FOUR
   STEPS IN THIS ORDER: CHECK ANCHORS → REPOINT → PRUNE → RE-GATE.** v52 and v56
   both discovered the ordering after the fact; this round checked first and
   found that the single stale row left by deleting one caption was **the anchor
   of 18 RESTATED chains.** Read `r` across `provenance/register.json` for the
   stale key BEFORE pruning; repoint every hit onto a surviving sourced row (and
   refuse to prune if any chain would be left with no reference at all); then
   prune; then run the gate. Deleting one visitor-facing string is enough to
   trip this — it is not a hazard of big edits.

   **[REMOTE CONTROL P1–P11 2026-08-05] AND THE PROCEDURE IS CORRECTED BY ITS
   OWN FAILURE: PRUNE AGAINST A COPY AND LET THE GATE FIND THE BROKEN CHAINS.**
   Step 1 above — read `r` across the register for the stale key BEFORE pruning —
   assumes you can enumerate the stale set, and **you cannot do it by hand**. The
   check written for it folds `"a " + "b"` concatenation but not `\u2014`
   escapes, so it reported 154 rows where the sweep's own count was 61, and an
   over-report is useless for deciding what to repoint. What worked: **copy
   `register.json`, run `--prune`, run the gate.** The gate's own `badRestated`
   check named all eleven broken chains exactly, because IT is the thing that
   defines "resolves"; the copy is what makes it safe, since a broken chain can
   always be read back to the row it used to point at. **It also exposed a
   mis-classification no reading would have found:** five of the eleven were not
   repointed but RECLASSED — they were RESTATED for a COINCIDENCE OF WORDING with
   a face this round replaced, and two of them are Mike's own words.

   **[D1–D9 2026-08-06] AND A PRUNE PLUS A *MOVE* IS THE SAME HAZARD AS A PRUNE
   PLUS A RENAME — THE PROCEDURE HELD, AND THE GATE NAMED ELEVEN CHAINS EXACTLY.**
   The register is keyed on `keyOf(file, text)`, so a string that changes FILE
   goes undeclared and its old row goes stale even though not one character of it
   changed; this round moved 106 such strings. **They were CARRIED, not
   re-classified** — matched on exact text, from the exact file they left —
   because re-deciding 138 origins is 138 chances to give a sourced line a
   different origin than it had yesterday. **A carry is only sound when the text
   is byte-identical, so that is the test:** a string whose old row cannot be
   found under its old file is left undeclared and reported, never handed a row.
   Then, per the procedure above: **prune against a copy and let the gate find
   the breaks.** Nine of the eleven were the WAL poster's acts pointing at a
   `papa` note this round shortened — and they were **repointed onto the
   artist-card rows that actually carry each claim, which is a better chain than
   the one that broke**, because the old anchor merely ASSERTED that the sourcing
   existed. The other two pointed at rows the carry had re-keyed. Result: **0
   undeclared · 0 stale · 0 invention.**

   **AND A DEFECT CLASS WORTH KNOWING BY SIGHT: a LITERAL NUL byte in a source
   file makes every `grep`/`rg` over that file report "binary file matches" and
   nothing else — and the Read tool renders it as a SPACE, so an `Edit` whose
   anchor crosses it fails to match a line you just read.** P5 found six such
   bytes in four `tools/*.mjs`, including `keyOf` in `provenance-sweep.mjs`.
   Write them as the two-character escape `\0`; it is the same value to
   JavaScript and plain text to everything else. **The proof that such a change
   is inert is free: if `keyOf` had shifted by one bit, every register key would
   have changed and `provenance:gate` would have failed on every string in the
   museum. A passing gate after the edit is the test.**
1. **[MIKE]** Commit + push everything durable (explicit paths).
1a. **Update `docs/OPEN_ACTIONS.md`** (Doctrine 14) — statuses flipped for what
   closed, rows added for what this round exposed. Same commit **[MIKE]**.
2. If facts in THIS FILE or STATE.md changed (file map, hazards,
   protocols, closed decisions) — update them in the same session, same
   commit discipline **[MIKE]**. An orientation doc more than a few days
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
   session **[MIKE]**.
2. COMMIT GATE — Mike runs the commit **[MIKE]**; Code verifies it by
   re-running `git status --short` and confirming the new hash in `git log`.
   No commit is "done" until that read has happened. Narrating a commit is
   not a commit.
3. SESSION-CLOSE CHECK — before any session ends: `git status --short` is
   empty, or every remaining line is explained and accepted.
4. DB dumps (`backups/`) are gitignored by policy. Durable home: OneDrive
   mirror, not git history.
