# JOB 3 — FIX WHAT MISLED YOU
2026-08-13 · WRITE · one file changed: `CLAUDE.md` (274 lines rewritten, net −102)

---

## WHAT YOU NEED FROM ME

**One decision, and it is a real one.**

**`docs/canonical/OPERATIONS.md` §9 — the seal ritual, the section every session
reads before it closes — says the lint baseline is "11 errors / 9 warnings".
The real baseline is 9 / 8.** I measured it today on a clean tree.

That is the exact failure CLAUDE.md's own A1 note was written about: *a doc that
publishes the wrong tripwire number disables the tripwire.* A session that trusts
§9 sees nine errors where it expects eleven, reads two **fixed** errors as
normal, and — worse in the other direction — will wave through two **new** ones
without noticing.

**I did not fix it**, because the packet says report OPERATIONS.md changes before
making them. It is one line. Say the word.

Everything else in this job is done. Gates: lint **9/8 = baseline** · build
green · **launch build green** · provenance **PASS** · `reveal:check` **PASS** ·
`parity:gate` **PASS** · `instory:gate` **PASS**.

---

# 3a. THE COWORK-SANDBOX SECTIONS — REMOVED, WITH THE THREE TRUE RULES KEPT

## What was there

Two sections, `## Cowork sandbox quirks (READ THIS)` and `## Cowork environment
quirks (operational hygiene)` — **187 lines** describing a Linux sandbox with a
FUSE/virtiofs mount that nobody has run in. It was not merely stale. Several
rules would cause harm if followed:

| the doc said | the truth on this machine |
|---|---|
| the `Edit` tool truncates files past ~16 KB | it does not |
| rewrite files through a Python `rm + write` pattern via `mcp__workspace__bash` | that tool does not exist here; Edit works |
| `.git/HEAD`, `.git/config`, `.git/index` arrive corrupted; rebuild them by hand | they do not |
| `git status` reports phantom mass deletions | it does not |
| `npm run build` cannot run; symlink the rolldown binary first | it runs (587 ms today) |
| slashed branch names fail — the mount cannot mkdir under `.git/refs/heads/` | no mount, no limitation |
| call `mcp__cowork__allow_cowork_file_delete` once per session before any `rm` | no such tool |
| commits must be handed to the operator because sandbox staging corrupts the index | Code does not commit — but for a different reason, below |

**A session that believed this would spend its first hour deciding whether its
own tools work.** The previous window did.

## What replaced it

One section, **`## THE ENVIRONMENT — WINDOWS HOST, AND THIS SECTION USED TO SAY
OTHERWISE`** (85 lines), which states the machine plainly, says what the removed
material claimed and why it was harmful, and carries the one commit rule that
survives — **restated with its real reason**:

> Code does not commit, push or deploy. Not because staging is unsafe — because
> Mike owns everything host-side and runs every command himself.

That distinction matters: the old text made it a technical limitation, so a
session on a working machine could reasonably decide the limitation had lifted.
It is a role boundary, and role boundaries do not lift.

## Nothing true was lost — three of the fourteen numbered rules were never about the sandbox

Kept whole, renumbered 1–3 inside the new section:

1. **Kickoff premises go stale — map every anchor before you design.** (was §7)
   Extended, because this week proved the same rule applies to *content*: a
   packet that assumes its own material is already in the tree is making the same
   claim about a different kind of anchor.
2. **`export-artifacts` can SHRINK the released set** — capture before/after
   counts, surface a shrink before committing, and re-derive the before-count
   from the file on disk rather than a carried-forward number. (was §10)
3. **THE RUN REPORT GOES TO DISK FIRST.** (was §13) Kept and sharpened with the
   reason it is a hard rule: the window that ran six packets on 11–13 August
   answered five of them in prose only, and those findings existed nowhere but a
   chat that then closed.

## Everything else, named once and nowhere else — Doctrine 24

Removed: the 16 KB tail-truncation rule · the `rm + write` pattern · CRLF
handling for FUSE · `mcp__cowork__allow_cowork_file_delete` · slashed-branch
failure · sandbox `git status` desync · CRLF false positives in `git status` ·
FUSE-mangled `.git` internals (all four manifestations and their recovery
procedures) · virtiofs phantom deletions · virtiofs SQLite COMMIT failure and
the `/tmp` copy pattern · per-session delete permission · per-session folder
mounts · sandbox FUSE cache non-invalidation · workerd-blocked build smoke and
its four-step substitute · sandbox→MV HTTP unreachability · virtiofs PUA glyph
mapping for NTFS-illegal characters · the mount-truncation commit-integrity
guard. **That list appears here and in no tracker, register or other document.**

## Three dangling references, also fixed

- **`## Workflow`** opened *"you usually run inside a Cowork Linux sandbox"* and
  described a branch → PR → squash-merge flow. **Fenced, not deleted** — a note
  at the head states what is true today (*Mike commits from PowerShell on `main`;
  no sandbox, no branches, no PRs; Code never commits*) and the old flow is
  folded into a `<details>` block, because **nobody has ruled on whether the
  branch-and-PR half is coming back.** That is a decision, not a cleanup.
- **`### Cross-platform native dependencies`** said the cowork sandbox builds for
  Linux while Mike's machine needs a Windows binary. There is one machine now.
- **`## Conventions for updating this file`** said *"Update 'Cowork sandbox
  quirks' when you hit something new"* — pointing at a section that no longer
  exists. It now points at `THE ENVIRONMENT`, and adds: **check first that what
  bit you is real on this host.**

---

# 3b. THE LINT BASELINE — CONFIRMED, AND ONE CONTRADICTION FIXED

**Measured today on a clean tree: `npm run lint` → 17 problems (9 errors, 8
warnings), exit 1.** Unchanged by this packet's own edits.

**CLAUDE.md `### Pre-flight before commit` already said 9 / 8 and was correct.**

**But the section heading five screens down said `## Pre-existing lint debt (4
errors)`** and listed four — the stale count from before the CH8 change, sitting
under a heading that reads as the baseline. Fixed: the heading now names the
real baseline, explains that the table below documents four of the nine, and
carries a per-file breakdown measured on the same run, so a future session can
tell a regression from the debt:

| file | err | warn |
|---|---:|---:|
| `Exhibit.jsx` | 5 | 5 |
| `HrExhibitFlow.jsx` | 2 | 2 |
| `RobotsExhibitFlow.jsx` | 1 | 1 |
| `WbAdmin.jsx` | 1 | 0 |
| **total** | **9** | **8** |

I wrote that breakdown from an older note first, then measured it and corrected
it before it shipped — the note had the distribution wrong.

---

# 3c. THE TWO HARD FENCES — WHERE THEY ACTUALLY ARE

**Both located. Neither opened, copied, catalogued or planned. No file was read
except one README, to confirm the fence is the fence.**

## Fence 1 — the NIAC video sets

**Not in either repo, and not anywhere under `C:\AI\Projects`.** They are in
OneDrive:

```
C:\Users\macun\OneDrive\Desktop - Laptop\ADD TO REPOS\Weird.Baby Files\CUT VIDEO - NIAC
C:\Users\macun\OneDrive\Desktop - Laptop\ADD TO REPOS\Weird.Baby Files\RAW VIDEO - NIAC
```

Two details worth carrying forward:

- **Both are flagged read-only on disk** (`lar--`), and their four siblings in
  that folder — `EDITED IMAGES - VIIIp`, `MGKVIIIp`, `RAW IMAGES - VIIIp`,
  `RAW VIDEO - VIIIp` — are **not**. The fence is marked on the filesystem.
- **The declaration is real and I confirmed it**, in
  `RAW VIDEO - NIAC\README.txt`: *"FOR MIKE'S EYES — a review cut, NOT a
  publishable asset"* and *"OBFUSCATION LAW — NONE OF THESE SHIP AS-IS."* It
  cites `docs/canonical/OBFUSCATION_LAW.md` in the robots repo as the governing
  rule, and grades its own eight shots — **only one of the eight passes**.

**The neighbouring `RAW VIDEO - VIIIp` and the two IMAGES folders carry no such
README and are not read-only. Do not treat the whole folder as fenced; the fence
is on the two NIAC directories.**

## Fence 2 — photographs of Carter Bookman

**Not under `C:\AI\Projects`.** No file or directory anywhere in either repo has
`Bookman` or `Carter` in its name.

The directory older briefs call `_MAL\Photos\` exists, at a path no brief has
had right:

```
C:\Users\macun\OneDrive\OneDrive MAJEL_04 (Archived Other)\Mike's Stuff\_ROBOTS\
    Weird.Baby\PROJECT CLOSING - GOOGLE DRIVE COPY\_MAL\Photos
```

It holds 27 files. **I did not open it and did not list them**, so *whether those
are the fenced photographs is not something I verified* — verifying it would mean
looking, which the fence forbids. It is where the brief says they are, at the
corrected path. **Treat it as fenced.**

## And one thing that is NOT the fence, which matters more than the paths

**"Carter Bookman" appears 20+ times in `C:\AI\Projects\MGK-VIII\` — a third
repo no brief mentions — as an IN-STORY FICTIONAL CHARACTER**, not as a person's
name in a photo caption:

> *"Mainframe Generated Knowledge (MGK) technology was conceptualized by Carter
> Bookman at the Army Security Agency (ASA) in 1943."*
> *"Carter Bookman: Visionary leader of the MGK-NIAC project."*
> *"Name: Carter Bookman · Date of Birth: [REDACTED] · Place of Birth: [REDACTED]"*

**A future window grepping for "Carter Bookman" will hit this corpus first and
may conclude the fence has been breached, or that the fence covers story text.**
It does not. The fence is on **photographs**. The story text is ordinary museum
material in a third repo, and the character's dossier is `[REDACTED]` by
construction. If there is a real person behind the name, nothing under
`C:\AI\Projects` connects the two.

---

# 3d. WHAT ELSE IS NOW FALSE — REPORTED, NOT FIXED

**`docs/canonical/OPERATIONS.md` is 1,836 lines and has the same defect CLAUDE.md
just had, in more places.** I changed none of it.

### 1. §9 says the lint baseline is 11 / 9 — **the one that will bite**

Line 1872, step 0 of the seal ritual: *"`npm run lint` (baseline **11 errors / 9
warnings**, zero new)"*. It is 9 / 8. This is the governing document and §9 is
what a session reads at seal time. **Highest-value single-line fix in either
document.**

### 2. There is no §13

The standing law reads *"WRITE EVERY REPORT TO DISK FIRST. OPERATIONS §13."* —
in the onboarding brief, in the handoff, and now (without the citation) in
CLAUDE.md. **OPERATIONS.md has §1 through §9 plus an unnumbered "Delivery &
Commit Gates" section. There is no §13 and no §10, §11 or §12.** The rule itself
is real and correct; the citation points nowhere. Anyone told to "read §13" will
find nothing and may conclude the rule is not written down.

### 3. §1, §2 and §3 are built on the Cowork carry model

- **§2 "The three surfaces — capabilities matrix"** has a row for
  *"**Cowork** (desktop app) — Full, via per-session folder mount Mike approves"*
  and states *"Cowork folder mounts and delete permissions are per-session."*
- **§3 "Conduit protocols"** describes **Chat → Cowork** and **Cowork → Chat**
  as the two ways material moves, and says *"anything big or multi-file goes
  through Cowork instead (Doctrine #3)."*
- **§6 "Orientation protocol"** step 3 is *"Default to Cowork for repo work."*

None of that describes how this week worked. **This is a bigger change than 3a
was** — it is the document's model of who does what — and it needs a ruling, not
an edit.

### 4. §8 "Known hazards" carries four sandbox rows

`Cowork FUSE/sync truncation` · `Cowork mount READ-LAG (2026-07-06)` ·
`Virtiofs: phantom deletions in git status` · *"Sandbox breakage tests by FILE
COPY."* Same class as what I removed from CLAUDE.md. **The rest of §8 is
excellent and environment-independent** — the generator-overwrites-hand-edits
hazard, the two-addresses-for-a-picture hazard, the `innerText`/`textContent`
hazard. Only the four sandbox rows are dead.

### 5. `CLAUDE.md` §5 cross-reference, in the block I replaced

The old `### 6. The release flow (cross-reference)` pointed back at `### Release
flow`, which is still correct and still says `npm run export-artifacts` refuses.
**No change needed** — noted so nobody re-derives it.

### 6. `reveal:build` is listed as a gate and is a WRITER

Carried from the handoff and **verified today**: `npm run reveal:build`
regenerates `reveal/ledger.json` wholesale. It happens to be byte-identical
every time right now — I hashed before and after and it was — so it reads as a
check. It is not one. Not fixed anywhere; recorded here.

---

## WHAT I COULD NOT DETERMINE

- **Whether the branch/PR/squash-merge flow is retired or dormant.** Nobody has
  ruled. That is why `## Workflow` is fenced rather than cut.
- **Whether the 27 files in `_MAL\Photos` are the fenced photographs.** Checking
  means looking, which the fence forbids.
- **Whether a real person named Carter Bookman exists behind the story
  character.** Nothing under `C:\AI\Projects` connects them, and I did not
  search outside it for a person.
- **Why `assets:orphans` went 0 → 13.** Still unexplained, still not caused by
  any packet this week; today it reports 8 judged + 5 unjudged. Untouched.

## WHAT NEEDS MIKE

1. **OPERATIONS.md §9 says the lint baseline is 11/9. It is 9/8.** One line.
   This is the one that actively misleads. Say the word and it changes.
2. **OPERATIONS.md §1/§2/§3/§6 describe the Cowork carry model as the way work
   moves.** Correcting that is rewriting the document's model of who does what,
   which is your call and not a cleanup.
3. **`## Workflow` in CLAUDE.md is fenced, not deleted**, pending your ruling on
   whether branches and PRs are coming back.
