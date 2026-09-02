# HANDOFF — for the next Code session

Rewritten **2026-08-29** at the close of the social-pipeline session, at HEAD
**`1f85f5c`**, tree clean.

---

## READ THIS FIRST: THIS FILE IS OUTRANKED BY EVERYTHING

`live tree > git log > STATE.md > handoffs > any chat memory` — OPERATIONS §6.
**Handoffs rot in days**, and this one is written expecting to.

**Nothing standing lives here.** Process is `OPERATIONS.md`. Facts are
`STATE.md`, the canon, and the round logs. Open items are
`docs/OPEN_ACTIONS.md`. **If this file disagrees with any of those, they win and
this file is the thing to correct.**

What is here: **what was mid-flight when the session closed, and nothing else.**
A "recommended next step" below is a suggestion stamped at write time, never a
standing order.

**Read the round logs before acting on any line here** — `docs/MUSEUM_*_LOG-*.md`,
one per round, and the five from this session are named where they matter.

---

## WHAT IS OPEN AND NEEDS MIKE

**Numbered so they can be put to him one at a time. None is Ops' to decide.**

1. **The TikTok bio is empty.** `@papaweird.baby` exists, display name
   `Weird.Baby`. **Facebook and Instagram handles are unset**, and Instagram's
   account is *unstated* — nobody has said whether it exists, and Ops does not
   infer it from the two that do. Register `M60`. Shape and observed values:
   `release/release-shape.mjs`.

2. **The guestbook entry he wants removed** — *"My birthday, I guess!
   Weird.Baby is open for business!"*, 2026-08-17. **Nothing is built and
   nothing is deleted.** It is a live D1 row, **there is no backup that contains
   it**, and what a read tool and a delete tool would each take is reported in
   `docs/MUSEUM_WHISPER_AND_GUESTBOOK_LOG-20260828.md`. Ops' reading: hiding
   beats deleting, and a backup should be taken before either.

3. **The arc: weeks 6, 7 and 8 have no headline.** `docs/ARC.md:176` says so in
   its own heading, and §212 lists *"Weeks 6–8, at all"* among what is open. The
   file's closing line is **"Mike defines the arc this weekend. This is the file
   he writes into."**

4. **The dress-rehearsal ruling has never landed in the tree.** Searched this
   session: **zero hits for "dress rehearsal" across `src/` and `docs/`.** It
   exists only in conversation.

5. **Audie Cornish on `/wal`** — he ruled *wait*, and it is still waiting.
   **Verified absent:** a word-boundary search for `\bcornish\b|\baudie\b`
   across `src/`, `docs/`, `provenance/` and `reveal/` returns nothing. *(A
   careless `audie` substring search hits "audience" and returns ten files —
   it did here first. The absence is real; the first probe was not.)*
   **Sourcing needs a rule before anything is gathered**, because there is
   nothing to build on.

---

## WHAT IS OPS' AND UNSTARTED

- **Public reads of his social accounts.** He asked for it; Ops scoped it
  **PUBLIC ONLY — no credentials, no write access** — and it starts with what is
  visible for free. **His constraint, carried verbatim: *"Do not work too far
  ahead."*** Nothing is built.
- **The gift shop.**
- **R001's dry-run note.**
- **The grey album covers.**
- **Mode B leftovers.**
- **The trailer gate** — see the correction below before scoping it.

---

## THE RECORD OF TODAY

### The launch, and the stale bundle

The site went live at **`ad0d73d`** after ten days undeployed. **A stale `dist/`
meant the first deploy shipped an older bundle**; one clean redeploy fixed it,
and `docs/DEPLOYED.md` carries both rows at the same sha with different worker
hashes.

**The staleness check reads mtime and cannot see a bundle built from something
else.** A fresh timestamp on the wrong contents passes it.

### OPS RECONSTRUCTED FILE LISTS AND MESSAGE PATHS TEN TIMES AND GOT ALL TEN WRONG

Wrong log names, wrong message paths, missed modified files, invented paths that
were never touched. **Every one was caught because Mike pasted the output back**
— nothing in the tooling caught any of them.

> **THE RULE FOR THE NEXT OPS: pass Code's command block through unchanged. If
> there isn't one, ASK for it. Never write one.**

**`git status --short` collapses a new directory to a single line** — that is how
five `release/` paths went missing in one round. **`--untracked-files=all` is the
only listing that is ever right.**

### Four things Mike used were reported as never-existed. THREE were misses. ONE WAS FOUND.

The three: **CH4's working version**, **the monitor drag-resize**, **the drag
handles** — all real, all reported absent from a grep of HEAD that never reached
them.

**The fourth was found**, and that is the half worth carrying:
**"You are early. That is noted."** — shipped `abf628a` 2026-04-13, killed
`30d9162` 2026-07-25 whose own message ends *"You-are-early killed."*
**Found in ONE command:** `git log --all -S"not open yet"` — the pickaxe over all
refs on CONTENT, step 2 of §8's own list.

**The method works. It was not used the first three times.** Mike ruled the
Lobby stays as it is; `WbHome.jsx` was not touched, and `.wb-whisper` remains an
orphan rule at `WbHome.css:113`.

### TWO NUMBERS FROM THE BRIEF, CORRECTED — measured this session

**"Three commits carry auto-appended trailers" is not what the tree holds.**

- **128 commits carry trailers across all history.** The overwhelming majority
  are `Co-Authored-By: Claude …` from long before the rule existed.
- **The rule landed 2026-08-26** (CLAUDE.md). `73179dc`, that same day, is the
  `Log:` trailer CLAUDE.md already documents by name.
- **Since the rule: exactly ONE — `a716017`, 2026-08-27**, a `Co-Authored-By`
  nobody caught.
- **All six of today's commits carry zero trailers**, verified individually.
  The message-file discipline held.

**So the gate's job is smaller than "three commits" suggests and its target is
different**: it is not a backlog of three to clean, it is one escape since the
rule plus a long pre-rule tail that is history and stays. **The diagnosis in the
brief is right — fresh sessions on the `C:\AI` root never read the project's
CLAUDE.md** — and that is what a gate would have to catch.

---

## WHAT LANDED THIS SESSION

`ad0d73d` → **`1f85f5c`**, six commits. Read the logs, not this list.

| | |
|---|---|
| `6307286` | the shorts gate — the compiler asks the shelf before it encodes |
| `fb21109` | the release objects, seeded with the five private Coconuts videos |
| `48fbee2` | TikTok in, the four surfaces ordered |
| `06191e5` | the gate reads the declaration `48fbee2` landed **(it was broken at HEAD in between)** |
| `1f85f5c` | the two early takes, the chips, the handle correction |

**`1f85f5c` touches `src/` and the bundle and HAS NOT BEEN DEPLOYED.**
`npm run deploy:launch` is what puts the two early takes in front of anybody.

---

## TWO THINGS OPS GOT WRONG TODAY, KEPT SO THEY ARE NOT REPEATED

- **Ops told Mike TikTok forbids dots in handles. It does not** —
  `@papaweird.baby` has one. Asserted from memory as a platform fact, never
  checked, and a recommendation was built on it. **A platform's rules are not in
  this repository and cannot be read from memory.** Kept as
  `HANDLE.retractedClaim`.
- **Ops answered "the Cloudflare console is the only path, and that's yours"**
  about the guestbook — while `tools/backup-guestbook.ps1`, Ops-built and
  read-only, was already in the tree. **A wing with no maintenance tool is a gap
  Ops closes**, and that one is now Ops' open item.

---

## WHAT WOULD MAKE THIS FILE WRONG

Any commit after `1f85f5c`; any ruling from Mike on the five numbered items; a
deploy. **Check `git log --oneline -15` and `git status -s` before trusting a
word of it** — OPERATIONS §6's read order, and the reason this file sits fourth
in the ranking.
