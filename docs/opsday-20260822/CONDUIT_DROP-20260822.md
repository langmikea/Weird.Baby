<!-- CONDUIT: HEAD 427140b · 2026-08-22T13:42:24Z -->

# THE CONDUIT DROP BECOMES A COMMAND

`npm run conduit` → `tools/conduit-drop.mjs`. Written, wired, self-tested
against a temp destination. **The real drop was not run — see §5.**

---

## 1 · THE CONVENTIONS I MATCHED, AND WHERE I READ THEM

Read before writing anything: `tools/ops-desk.mjs` (799 lines) and
`tools/arc.mjs` (91 lines).

| convention | where I read it | what I did |
|---|---|---|
| ESM `.mjs`, `node:` prefixed imports (`fs`, `path`, `url`) | `ops-desk.mjs:53–55`, `arc.mjs` | same three, plus `node:crypto` and `node:child_process` |
| `#!/usr/bin/env node` first line | `arc.mjs:1` | same (`ops-desk.mjs` has none — I followed `arc.mjs`) |
| `REPO` resolved from `import.meta.url`, never from `cwd` | `ops-desk.mjs:57–58`, `arc.mjs:31` | same, and it is what makes refusal 1 testable |
| a long block header stating **why the file exists** before any code, with `═══` rules | both | same |
| a hand-held array with a comment saying it is hand-held, one row per thing | `ops-desk.mjs:65` `INSTRUMENTS`, with `/* ── THE EIGHT ── */` | `DOCUMENTS`, with `/* ── THE LIST ── */` |
| refuse-and-say-why rather than warn-and-continue | `ops-desk.mjs:713` (`missing`, drawn as a red card with no link), `arc.mjs:74–79` | six refusals, each aborting |
| `console.error(lines)` + `process.exit(1)` | `arc.mjs:76–79` | same, via a `die(lines)` helper |
| the `die(lines)` helper shape itself | `tools/deploy-guard.mjs:45–48` — read as a third reference because it is the repo's other refusing tool | copied verbatim in shape |
| error text names the fix on its own last line | `arc.mjs:78`, `deploy-guard.mjs:83` | every refusal ends with what to run or what to do |
| `npm run <short-noun>` script naming | `package.json` — `desk`, `arc`, `mock`, `lap`, `record` | `conduit` |

**Preferred the repo's own mechanics over what I would otherwise reach for, in
three places:**

1. **`git rev-parse` via `execFileSync`, not a `.git/HEAD` read.** `CLAUDE.md`'s
   THE ENVIRONMENT section records that a previous era of this repo hand-parsed
   `.git/HEAD` and that it was wrong. A detached HEAD, a packed ref and a
   worktree all resolve through git and none resolve through a file read.
2. **Files-only delete, one level, directories reported and left.** A recursive
   delete pointed at an env-var path is a bigger weapon than this job needs.
3. **Read back off the disk to verify, rather than trusting the write** — the
   same discipline as `ops-desk.mjs:713`'s `fs.existsSync` per card, and as this
   week's standing rule that the only oracle for a written thing is the written
   thing.

---

## 2 · THE RESOLVED LIST — 20 FILES

**6 named in `DOCUMENTS` + 14 resolved from the canon index = 20.**

```
docs/canonical/OPERATIONS.md          docs/canon/01-WORLD.md
docs/MUSEUM_RULINGS-20260817.md       docs/canon/02-MACHINES.md
docs/ARC.md                           docs/canon/03-ANSWERS.md
docs/BACKLOG.md                       docs/canon/04-MENU.md
docs/THREADS.md                       docs/canon/05-BOOT.md
docs/canon/INDEX.md                   docs/canon/06-PORTAL.md
                                      docs/canon/07-MANUAL.md
                                      docs/canon/08-PEOPLE.md
                                      docs/canon/09-PUBLISHED.md
                                      docs/canon/10-LAWS.md
                                      docs/canon/BELL-103.md
                                      docs/canon/CONFLICTS.md
                                      docs/canon/FAILURE-MODES.md
                                      docs/canon/HOLES.md
```

### How the index's links are resolved

`canonLinks()` reads `docs/canon/INDEX.md` and matches `](target)`, then:

- **strips the fragment** — the index links to 174 distinct targets, but most are
  `01-WORLD.md#abeal`-style deep links into the same fourteen files;
- **drops pure anchors** (`#a-z`) and anything with a scheme or `//`;
- **keeps `.md` only**;
- **resolves relative to the index's own directory**, so a future
  `../elsewhere/X.md` works;
- **de-duplicates, preserving first-mention order**, so the drop reads the way
  the catalogue does.

**174 link targets → 14 distinct files.** Independently checked: `docs/canon/`
contains exactly 15 `.md` files, and the 15th is `INDEX.md` itself. **The index
links to every file in its own directory and to nothing outside it** — so the
resolution is complete today, and it will follow the index rather than go stale
when the canon grows to fifteen.

**Not hand-typed, by instruction.** Proof that the resolution is live rather than
a coincidence: removing one entry from `DOCUMENTS` changed the run's own summary
line from `6 listed, 14 resolved` to `5 listed, 14 resolved` — the two halves are
counted separately and the canon half is never enumerated in the source.

---

## 3 · THE SIX REFUSALS — EACH ONE TRIGGERED, NOT REASONED ABOUT

Every command below was run. `WB_CONDUIT` pointed at
`C:\Users\macun\AppData\Local\Temp\conduit-test` throughout.

### Refusal 1 — no HEAD, no drop

Triggered by copying the script to a directory that is not a git repository, so
that `REPO` resolves outside version control:

```
$ cd /tmp/nogit && node tools/conduit-drop.mjs

conduit REFUSED — cannot read HEAD, so nothing can be stamped.
  Command failed: git -C C:\Users\macun\AppData\Local\Temp\nogit rev-parse --short HEAD
fatal: not a git repository (or any of the parent directories): .git

A drop with no provenance is the thing this tool exists to prevent.
Nothing was written and the destination was not touched.

exit=1
```

### Refusal 2 — dirty tree

Triggered by appending one comment line to `docs/THREADS.md`:

```
$ node tools/conduit-drop.mjs

conduit REFUSED — 1 file(s) in the drop differ from HEAD 427140b:
      docs/THREADS.md

The stamp would name a commit that does not contain these bytes — a lie
with a citation on it, which is worse than no citation at all.

  Commit them, or drop anyway with:   npm run conduit -- --allow-dirty
Nothing was written and the destination was not touched.

exit=1
```

**And the escape, proved as well as the refusal:**

```
$ node tools/conduit-drop.mjs --allow-dirty

  ############################################################
  ##  WARNING — DIRTY DROP. 1 file(s) differ from HEAD.
  ##  Their stamps read `sha256 DIRTY` and name no commit.
  ##    docs/THREADS.md
  ##  What arrives is NOT what 427140b contains.
  ############################################################
```

The stamp that arrived on the dirty file, read back off the destination:

```
<!-- CONDUIT: HEAD 427140b · 2026-08-22T13:41:10Z · sha256 DIRTY · docs/THREADS.md -->
```

**The dirty check is scoped to the listed files.** `package.json` and
`tools/conduit-drop.mjs` were both uncommitted during every run above and
correctly did not block anything — they are not in the drop.

### Refusal 3 — a listed source is missing

Triggered by moving `docs/THREADS.md` aside:

```
$ node tools/conduit-drop.mjs --allow-dirty

conduit REFUSED — 1 listed source file(s) are not on disk:
      docs/THREADS.md

A drop that skips a named file is the failure this tool exists to catch.
Nothing was written and the destination was not touched.

exit=1
```

**Measured, not assumed: the destination still held its previous 21 files after
this refusal.** Nothing was cleared, because the clear happens after every
source has been read and staged.

### Refusal 4 — non-UTF8

Triggered by appending the bytes `FF FE 00` plus `binary` to `docs/THREADS.md`:

```
$ node tools/conduit-drop.mjs --allow-dirty

conduit REFUSED — `docs/THREADS.md` is not valid UTF-8.

Re-encoding it would change the bytes and the sha in its own stamp would
describe a file nobody has. Nothing was written.

exit=1
```

**Refusal 4 has a second half that cannot be triggered on demand** — the
post-write read-back (`Buffer.compare(back, out)`) that fires if what arrived is
not what was sent. It is proved positively in §4 instead.

### Refusal 5 — HEAD is not on origin/main

**Added 2026-08-22, second packet.** The stamp records LOCAL HEAD; a reader
measures staleness against `origin/main`. A stamp naming a commit the reader
cannot resolve is a complete-looking answer that is wrong — which is the exact
failure this whole tool exists to prevent, arriving through the stamp itself.

`git fetch --quiet origin main` runs FIRST, always. **A stale remote-tracking
ref answers the question wrongly and confidently, which is the same failure
shape as not asking it at all.**

Triggered against the real repo, whose HEAD `93417e7` is genuinely unpushed:

```
$ WB_CONDUIT=<temp>/dest-ok node tools/conduit-drop.mjs

conduit REFUSED — HEAD 93417e7 is not on origin/main (427140b).

Every stamp in the drop would name a commit the reader cannot resolve.
They would look complete, and checking one against origin would fail to
find it at all — a complete-looking answer that is wrong.

  Push, then drop:   git push origin main
Nothing was written and nothing was cleared.

exit=1
```

**The destination held 0 files afterwards** — it was never opened.

**THERE IS NO OVERRIDE FLAG, AND THAT IS THE DESIGN.** No `--allow-unpushed`,
no stamping `UNPUSHED`. A refusal that advertises the way past it is the defect
found in the deploy guard this morning; it is not rebuilt here. Push, then drop.

### Refusal 5's offline path — the fetch fails, so the drop refuses

**If the fetch fails for any reason, including no network, the drop refuses.**
Push state cannot be verified offline and guessing at it is the thing being
guarded against. Induced two ways, in a clone whose HEAD *is* on its origin —
so the only thing failing is the fetch:

```
$ git remote set-url origin https://no-such-host.invalid/weird-baby.git
$ node tools/conduit-drop.mjs

conduit REFUSED — cannot fetch `origin main`, so push state is unknown.
  fatal: unable to access 'https://no-such-host.invalid/weird-baby.git/': Could not resolve host: no-such-host.invalid

THE DROP CANNOT VERIFY PUSH STATE OFFLINE. The stamp names local HEAD and
a reader resolves it against origin/main; without a fetch, the
remote-tracking ref on this machine may be days old and would answer that
question wrongly and confidently.

  Get on the network and re-run.
Nothing was written and nothing was cleared.

exit=1
```

`Could not resolve host` is the same error a genuinely offline machine
produces. The second induction points `origin` at a path that is not a
repository — a dismounted drive rather than a dead network — and refuses
identically:

```
  fatal: '<temp>/no-such-origin-repo' does not appear to be a git repository
fatal: Could not read from remote repository.
```

**The destination held its previous 21 files after both**, unchanged.

### Refusal 6 — the destination is not an existing directory

**It is never created. No `mkdir`, no `mkdir -p`.** A drop into a folder nobody
reads looks exactly like a successful drop; an unmounted `G:` would turn a
helpful `mkdir -p` into a silent, complete, local folder that syncs nowhere.
This closes X6d below, which recorded the hole and left it open.

**Missing destination:**

```
$ WB_CONDUIT=<temp>/there-is-no-such-folder/deeper/still node tools/conduit-drop.mjs

conduit REFUSED — the destination does not exist:
      <temp>/there-is-no-such-folder/deeper/still

It was NOT created. A drop into a folder nobody reads looks exactly like
a successful drop — an unmounted drive or a renamed folder would take the
whole payload and report twenty-one files.

  Check the drive is mounted and the folder is where you think it is.
Nothing was written and nothing was cleared.

exit=1
```

**Checked afterwards, which is the half that matters** — not one of the three
path segments exists:

```
absent   : <temp>/there-is-no-such-folder
absent   : <temp>/there-is-no-such-folder/deeper
absent   : <temp>/there-is-no-such-folder/deeper/still
```

**Destination exists and is a file:**

```
$ WB_CONDUIT=<temp>/dest-is-a-file.txt node tools/conduit-drop.mjs

conduit REFUSED — the destination exists and is not a directory:
      <temp>/dest-is-a-file.txt

The drop writes one file per document into a folder. Nothing was written,
and the thing at that path was not touched.

exit=1
```

The file was 27 bytes before and 27 bytes after, contents unchanged.

### The order: all six are evaluated before the clear

**Read off the control flow and then measured.** In source order:

| # | refusal | where |
|---:|---|---|
| 1 | no HEAD | `headSha()`, first statement of THE RUN |
| 6 | destination is not an existing directory | `assertDestination()`, immediately after |
| 5 | HEAD not on `origin/main` (fetch first) | `assertHeadOnOrigin()`, immediately after |
| 3 | a listed source is missing | after the list is resolved |
| 2 | dirty tree among the listed files | after 3 |
| 4a | a source is not valid UTF-8 | the staging loop |
| — | **THE CLEAR** | after every one of the above |
| 4b | a written file did not arrive as written | after the write — *the one exception* |

**Refusal 6 is checked before refusal 5 deliberately:** it is local, certain and
free, and there is no point asking the network whether a payload may travel to a
place that is not there.

**4b cannot obey the rule and the code says so rather than leaving it to be
discovered** — there is nothing to read back until something has been written.

### `WB_CONDUIT` is test-only, and it is the only name

The destination override is `WB_CONDUIT`, read at startup, defaulting to
`G:\My Drive\_conduit`. **It exists so refusal 6 can be demonstrated without
pointing anything at the real conduit.** A real drop sets nothing and takes the
default.

**There is exactly one name for it.** A second spelling was proposed and added
earlier the same day and removed: two names for one thing means a reader who
greps for the wrong one concludes the override does not exist, and a drop aimed
by the name the tool no longer reads goes to the default — which is the real
conduit. An alias kept "for compatibility" is that defect with a reason attached.

### A clean run, for comparison — 20 files plus manifest

Run in a clone whose `origin/main` equals its HEAD, with the museum's own
working-tree bytes copied in, so what the tool read is byte-for-byte what a real
drop would read:

```
  conduit  ->  <temp>/dest-clean
  HEAD 93417e7 · 2026-08-22T14:50:48Z
  cleared: 1 file(s) — STALE-LEFTOVER.md
     291786  OPERATIONS.md
      38420  MUSEUM_RULINGS-20260817.md
      10071  ARC.md
      14871  BACKLOG.md
       5366  THREADS.md
      29541  INDEX.md
      ...
       1852  MANIFEST.md

  20 file(s) + manifest. 6 listed, 14 resolved from docs/canon/INDEX.md.
exit=0
```

**The `OPERATIONS.md` manifest row is byte-identical to the pre-amendment
value**, which is the check that the amendment changed nothing it should not
have:

```
| OPERATIONS.md | 291786 | `0c464c5b67567362` | `docs/canonical/OPERATIONS.md` |
```

21 files delivered, 21 of 21 beginning `0x3c`, the planted stray gone.

### Every mutation was reverted and the revert was verified

`docs/THREADS.md` was disturbed to trigger refusals 2, 3 and 4. Restored from a
byte copy taken first:

```
sha256 before : c7465c57eb8371f4731341ad541f5b494ef90a640f45f723b9c261ab8cd2b9d8
sha256 after  : c7465c57eb8371f4731341ad541f5b494ef90a640f45f723b9c261ab8cd2b9d8
git status --porcelain -- docs/THREADS.md : (empty)
```

`tools/conduit-drop.mjs` was likewise disturbed for the §4 list-removal proof and
restored from a copy. **No document in the drop list carries an edit.**

---

## 4 · THE THREE POSITIVE PROOFS

### A · Byte 0 is the stamp, on every output

```
$ for f in <dest>/*.md; do head -c1 "$f" | od -An -tx1; done
  files checked: 21   non-conforming: 0
  first 3 bytes of OPERATIONS.md:   <  !  -
```

**21 of 21 begin `0x3c` (`<`).** This is the direct answer to this morning's
`OPERATIONS.md` arriving with 60 bytes of binary in front of its first heading:
the tool refuses a non-UTF8 source, strips a BOM if the source carries one, and
then reads every written file back and compares it byte-for-byte with what it
meant to write.

### B · Every manifest sha matches its source file

```
   rows checked: 20   matching: 20   mismatched: 0
```

The check recomputes `sha256(source)[:16]` from the repo and compares it with the
manifest row, and separately compares the manifest's byte count against
`stat` on the delivered file. Both agree on all twenty.

### C · A file removed from the list disappears, and so does a stray

Removed `docs/THREADS.md` from `DOCUMENTS`, planted an unrelated
`STALE-LEFTOVER.md` in the destination, re-ran:

```
before : THREADS.md YES   total 21
run    : 19 file(s) + manifest. 5 listed, 14 resolved from docs/canon/INDEX.md.
after  : THREADS.md no    STALE-LEFTOVER.md no    total 20
```

**Both vanished** — the delisted file and the stray. That is the clear-first rule
doing the job it exists for: a file that leaves the list cannot linger and be
read as current, which is the stale-revision failure arriving by another road.

---

## 5 · WHAT I COULD NOT TEST, AND WHY

**The real drop to `G:\My Drive\_conduit\` was NOT run.** I did not write a
single byte there.

I probed it non-destructively and it is reachable and reports writable:

```
$ [ -d "/g/My Drive/_conduit" ]  -> dir exists
$ [ -w "/g/My Drive/_conduit" ]  -> writable: YES
$ ls -1 "/g/My Drive/_conduit"   -> 7 entries:
    ARC.md  BACKLOG.md  HANDOFF_relayout_scope.md  INDEX.md
    MUSEUM_RULINGS-20260817.md  OPERATIONS.md  THREADS.md
```

**Two reasons for not running it, and the second is the one that matters.** The
packet's write scope is two paths in the museum repo, and step 4 says to
self-test against a temp destination. And `test -w` on a Google Drive mount is
not proof that a write succeeds — the mount can accept a create and fail to
sync, which is a failure mode this tool cannot see and I should not simulate.
**Mike runs the real drop.**

**Worth knowing before he does:** the current conduit holds **7** files against
this tool's **21**. Six of the seven are in the new list and will be overwritten
with stamps; **`HANDOFF_relayout_scope.md` is not in the list and will be
deleted.** It is the clear-first rule working as specified — flagged so its
removal is expected rather than discovered.

**Also not tested:** refusal 4's post-write read-back (§3), and the
unknown-extension refusal in `commentFor()` — every file in the list is `.md`, so
neither branch is reachable without a source that does not exist. Both are
**READ, not RUN.**

---

## 6 · WHAT CONTRADICTS THIS PACKET, OR SITS AWKWARDLY WITH IT

**None of it was fixed. Recorded and left.**

**X1 · "fourteen named files" is right today and is right for the wrong reason.**
The packet warns that a hand-typed fourteen would go stale. Measured: the canon
index links to **exactly** the fourteen `.md` files in its own directory, and to
nothing else. So a hand-typed list would have been correct today — the
resolution earns its place on the day the canon grows, not now. I mention it
because a reader checking the count against `ls docs/canon/` will see 15 and
should know the 15th is the index itself.

**X2 · The stamp format cannot round-trip through the tool.** A dropped file's
first line is a stamp; if a dropped file were ever fed back in as a source it
would acquire a second stamp, and the sha in the outer one would describe bytes
that already contain the inner one. Nothing in this packet asks for that and the
list contains no dropped file — but the conduit is a folder of stamped markdown,
and the failure mode is one careless list edit away.

**X3 · `MANIFEST.md`'s own stamp carries `sha256 MANIFEST`, not a hash.** It has
no source file to hash. That is deliberate and is stated in the code, but it does
mean the manifest is the one file in the drop whose stamp cannot be verified
against anything. **The count on its last line is the thing to check instead.**

**X4 · The tool trusts `git status --porcelain` to mean "differs from HEAD".**
It reports staged changes, unstaged changes and untracked files, which is what is
wanted — but a file that is staged and then reverted in the worktree reads clean
to the drop while HEAD still lacks it. This has not happened; it is the one gap I
can see in refusal 2 and I am not closing it today.

**X5 · The deploy contradiction found this morning is untouched**, by
instruction. `CLAUDE.md` and the standing brief say plain `npm run deploy`
publishes the development stage; `tools/deploy-guard.mjs:110–126` refuses it.
That is the next packet's.

**X6 · THE CONDUIT IS ALREADY GOVERNED, AND I MISSED IT ON THE FIRST PASS.**
`docs/canonical/OPERATIONS.md` **§3, lines 1139–1150** — *The Drive conduit —
`G:\My Drive\_conduit\`* — has specified this folder since before today. I
first wrote in this report that nothing governed it, on the strength of a grep I
had not run. **I ran it, got 12 hits, and this section is the correction.** The
absence rule cuts both ways: an unproven absence is a wrong answer even when the
thing is genuinely absent, and here it was not absent at all.

What §3 already says, and what this tool does about it:

| §3 says | this tool |
|---|---|
| *"Everything in it is a **transfer payload**, not a reference copy."* | same words, same behaviour — clear-first |
| *"`_conduit` is disposable. Clear it freely."* | clears first, prints what it removed |
| *"Every file dropped into `_conduit` MUST start with a freshness stamp header"* | does, on all 21 |

**And three places where the packet and §3 do not agree. Recorded, not
resolved — I built to the packet, because the packet is today's instruction.**

**X6a · The stamp is longer than §3's.** §3 specifies
`<!-- CONDUIT: HEAD <short-sha> · <ISO timestamp> -->` — two fields. The packet
specifies four, adding `sha256 <16 hex>` and the repo-relative path. The tool
emits the packet's. **A reader checking a dropped file against §3 will find more
than §3 describes**, which is harmless — but §3 now understates the stamp.

**X6b · §3 says non-markdown takes a `#` comment line. The tool does not.**
§3: *"(or a `#` comment line for non-markdown)"*. `commentFor()` emits `/* … */`
for `.js`, `.mjs`, `.jsx` and `.css`, returns "no stamp possible" for `.json`,
and **refuses** an unknown extension rather than guessing. **`#` is not a comment
in JavaScript, CSS or JSON** — following §3 literally would produce a syntax
error in three of the four types this repo actually contains. Every file in
today's list is `.md`, so nothing is affected in practice; the disagreement is
live the day a non-markdown file joins the list.

**X6c · §3's staleness test is against `origin/main`; the stamp records local
HEAD.** §3: *"if the stamp's HEAD doesn't match current `origin/main` … treat it
as STALE."* **CLOSED 2026-08-22 by refusal 5** — the tool now fetches `origin
main` and refuses unless HEAD is contained in it, so a stamp can only ever name
a commit the reader can resolve. This section originally read *"refusing on an
unpushed commit would block the normal case — Mike commits and drops before
pushing"*, and **that reasoning was rejected**: blocking the drop is the point,
because the alternative is a drop that looks fresh and cites a commit nobody
else has. The cost is real and is the intended one — push, then drop.

**X6d · Two files in the repo record the conduit failing for a different
reason.** `docs/HANDOFF_leftrail_applied.md:109–111` and its `_cowork` twin:
*"The Drive conduit is `G:\My Drive\_conduit\` (OPERATIONS §3), which is **not
mounted** in this session (only `C:\AI` is)."* **The mount is not guaranteed.**
This tool used to create the destination if it was missing (`fs.mkdirSync`),
which on an unmounted `G:` would silently create a local folder that syncs
nowhere — a complete-looking drop into a destination nobody reads. **CLOSED
2026-08-22 by refusal 6**: the destination is never created, and a missing one
or a non-directory one aborts before a single source is read.

**X7 · `HANDOFF_relayout_scope.md` is in the live conduit and is not in the
list.** See §5 — it will be deleted by the first real run. It is the only one of
the seven current files that is not in the new twenty.
