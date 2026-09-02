# JOB 1 — THE STALE DRAFT
2026-08-13 · WRITE · one file changed: `tools/dictation/emit-record-entries.mjs`

---

## WHAT YOU NEED FROM ME

**Nothing. This one is closed and nothing is waiting on you.**

The danger was real and is now refused by name. Your eight brace notes were
never at risk and are safe in two places, neither of which I touched.

One thing worth knowing and not acting on: **your working copy of the Record is
a day and a half behind the Record itself.** If you open the record editor it
will reseed correctly from the live Record, so there is nothing to clean up —
just don't hand the old copy to anything.

Gates: lint **9/8 = baseline** · build green · **launch build green** ·
provenance **PASS** · `reveal:check` **PASS** · `reveal:build` byte-identical ·
`parity:gate` **PASS** · `instory:gate` **PASS** · `assets:orphans` 13
(8 judged / 5 unjudged — pre-existing, not this packet).

---

# 1a. WHAT THE DRAFT HOLDS AGAINST WHAT THE TREE HOLDS

`docs/dictation-20260807/record-draft.json`, saved **2026-08-12T00:30:05Z**
(11 Aug, 20:30 local) against `src/data/artists/robots-record.js`, whose last
change was **2026-08-12T15:52:35Z**. **The draft is 15 hours and 22 minutes
older than the Record it would overwrite.**

Read with the museum's own parser (`reveal/record-entries.mjs`), not a second
one written for the comparison.

| | draft | tree |
|---|---|---|
| records | **1, 2, 3, 4, 5, 13** | **1, 2, 3, 4, 5** |
| epoch | 2026-08-17 | 2026-08-17 |
| brace notes | 8 | 0 |

### Record 013 — in the draft, deleted from the tree

Deleted 2026-08-12 in commit `8e67b5b` *"Channel 4 arrives, 013 and nine
photographs go, and the export refuses."* The draft still carries it whole:
4 sections, a `still`, a `stillCaption`, a `lead` and a `tomb`. **Landing the
draft would have put it back**, and it would also have re-armed the `placed`
import — the tool announced exactly that during the test:
*"an entry delivers a picture, so the `placed` import was restored."*

### Record 001 — 30 differences. The draft is the SUPERSEDED dictation.

The tree's 001 is your 2026-08-10 dictation, five sections, typos corrected on
your own instruction. The draft's 001 is the 2026-08-08 one, two sections, that
that text replaced. **Landing the draft is not a partial loss — it is the
earlier draft written back over the later one.**

| | draft | tree |
|---|---:|---:|
| sections | 2 | **5** |
| paragraphs in DETAILED REPORT | 23 | 4 |
| ADDENDUM 01 · Event Log · Friday Launch(-2) | — | **10 paragraphs** |
| ADDENDUM 02 · Weekend Summary | — | **3 paragraphs** |
| ADDENDUM 03 · Event Log · Monday Day(1) | — | **5 paragraphs** |

All three ADDENDUM sections would have been **deleted**. Other reversions:

- `line` — the tree's two-line deck with the real newline and the em dash
  (`Weird.Baby website is live\nAlert — Incoming…`) reverts to the draft's
  one-line, hyphen version. That newline is load-bearing: `white-space:
  pre-line` on `.vp-rec-sum` is what makes the deck two lines.
- `Handoff is on track (T-6); …` reverts to `Handoff to Operations (T-6) is on
  track; …`
- Four bullet paragraphs carrying your `o ` markers revert to the older
  indented prose, including the duplicated line
  `Operations remains unaffectedOperations remains unaffected`.
- `23:30 - REACT RULING - Restart with 5000x resources.` reverts to **50x**.
- `16:00 - Incoming data crosses 86% vs threshold` disappears entirely.

### Record 003 — 6 differences, all of them the three brace notes

Draft section 2 has 7 paragraphs, tree has 4. The three extra are your notes,
which were taken out of the tree on purpose and left in your working copy.
Landing the draft puts three curly braces back into the museum's data.

### Records 002, 004, 005 — **identical**, character for character.

### The eight brace notes, verbatim

```
Record 001 · section 2, paragraph 12
  {Robot, portal, ??, ??  (Claude - Get me some examples from the manual, etc)}
Record 001 · section 2, paragraph 14
  {MGK, PI,  (Claude - Get me some examples from the manual, etc)}
Record 001 · section 2, paragraph 15
  {RE:  (Claude - Get me some examples from the manual, etc)}
Record 001 · section 2, paragraph 16
  {Look for what we really do use a lot.}
Record 001 · section 2, paragraph 17
  {Look for sections of the documents that are "true", but not "juicy". It all
   has to come out at some point. Start dumping.}
Record 003 · section 2, paragraph 3
  {IMAGE - Device marked 'MGK-VIIIp' and '(need name of device)'}
Record 003 · section 2, paragraph 5
  {ASCII - (Give me a list of the most common words Robots expects to use, pick
   the juicy ones - A more compete list  and analysis to be printed below in
   detail section.}
Record 003 · section 2, paragraph 7
  {containing the files referenced above. (That is how we get the album art and
   set up the Manual link)}
```

**Five of the eight are answered by `JOB2-MANUAL-EXAMPLES.md` in this
directory.** The remaining three are `(need name of device)`, the album-art /
manual-link wiring, and the image list.

---

# 1b. MAKING IT SAFE — WHAT I CHOSE, AND WHY

**I changed nothing about the draft. It is byte-identical, proved by sha256
before and after every test** (`1cbc7f75…1bb2cb`).

Four options were on the table. Here is why the other three lose.

| option | why not |
|---|---|
| **Hand-edit the draft** to match the tree | Its own header says *"Ops does not hand-edit this file."* It is Mike's working copy; Ops editing it is the thing the whole instrument exists to avoid. |
| **Move it aside** to a dated archive name | The lander would then print *"No working copy"* — and that message sends the reader to `RESCUE.md` to recover words from a browser store, which would be a lie about what happened. It also takes the eight notes off the one path that prints them. |
| **Delete it** | The tree has no copy of your older 001 text. Deleting is unrecoverable and nobody ruled it gone. |
| **Leave it and aim a guard at it** ✔ | Nothing of yours is touched; the danger is refused at the only door it could come through. |

## The notes were never in danger, and that corrects the handoff

The handoff says the eight notes exist only in the draft and that *"only `npm
run record:land` prints them."* **Both halves are wrong, and I checked rather
than repeated it.**

`tools/dictation/record-edit.mjs` lines 90–106 hold a constant called
`CARRIED_NOTES` containing **all eight notes, verbatim, in committed source**,
each keyed to the exact paragraph it followed. `seedOf()` re-injects them into
the editor's seed on every build. So:

- the notes have a **second, committed home** that no draft operation can reach;
- `npm run record` prints them too;
- they now have a **third** home — quoted in full in §1a above.

**One live consequence, found by reading that code:** two of the three anchors
for Record 001 (`"We ran some of the data through a ML Monitor…"` and
`"Also, not \"words\", but suspiciously frequent text strings include:"`) are
paragraphs the 2026-08-10 rewrite removed from the tree. `seedOf()` handles this
exactly as designed — it appends the notes to the end of the last section and
**reports the move** rather than dropping them. Nothing is lost; they will just
appear under ADDENDUM 03 instead of where you wrote them, and the tool will say
so when it happens.

## And the editor is not poisoned

`record-edit.mjs` seeds from **`draftEntries()` — the tree**, not from the
draft file. The draft's path is passed to the page only as a save target. So
opening the editor today shows the current Record, not the stale copy. **The
stale draft is dangerous to exactly one command and no others.**

---

# 1c. THE AIMED GUARD

## Why the old protection was a coincidence

Two guards happened to stop this draft, and neither knows what staleness is:

1. the **note check** — it refuses any draft with a curly brace in it;
2. **guard 6** — it refuses a write that would delete comment characters, and a
   draft carries no comments.

Answer either one — take the braces out after acting on them, or teach the
emitter to carry comment blocks through — and **the same draft lands**, past
every remaining guard, silently, because every string in it round-trips
perfectly. That is not a protection. It is a good run of luck.

## The test is the clock, and that is the whole design

The obvious guard — *refuse when the draft disagrees with the tree* — **refuses
every real landing**, because a landing IS a draft that disagrees with the tree.
There is no structural difference between "Mike rewrote this paragraph" and
"this paragraph is last week's": both are a string in the draft that is not the
string in the tree.

What separates them is **which is newer**, and that is knowable. The editor
seeds itself from the tree, so:

> **A draft is a trustworthy superset of the Record if and only if it was saved
> AFTER the Record last changed.**

Saved after: every difference is his. Saved before: every difference is a
reversion wearing an edit's clothes.

So the clock decides whether to refuse, and **the diff says which records and
how — and the diff prints either way**, because a landing about to change five
paragraphs should say so even when it is allowed.

## What was built — GUARD 8, in `tools/dictation/emit-record-entries.mjs`

**(a) RESURRECTION.** For any record in the draft and not in the tree, it asks
the file's own history whether that number has ever been there. Both homes are
searched — `robots-record.js` and `robots.js`, because the entries lived inside
`robots.js` before the 2026-08-11 split, and a check reading only the new file
would call every pre-split record "never seen" and wave it back in. A number
never carried is a new record and is allowed; a number carried and now absent
was **deleted on purpose** and is refused by name.

**(b) STALENESS.** The Record's timestamp is the **later of its last commit and
its file mtime** — an uncommitted edit is still a move, and taking the later of
the two cannot understate when the Record last changed, which is the only
direction that fails open.

**(c) THE DIFF.** Field by field, section by section, paragraph by paragraph,
printed on refusal and on success.

**It degrades by refusing, never by assuming.** No `saved` field, no readable
mtime, git absent — each says which fact it could not establish and stops. A
record number it cannot classify is refused rather than guessed at, because a
new record and a resurrected one are the same shape.

**No bypass flag.** The fix for a stale draft is to reopen the editor, which
reseeds from the Record, and save again. A flag would become routine, and
`### Release flow` in CLAUDE.md already records what that costs.

---

# 1d. PROVED BY BREAKING IT

Four probes. Mike's real draft was copied out, hashed, replaced with each probe,
and restored — **and the restoration is proved by hash, not asserted.**

### Probe 0 — the real draft, as it stands

```
record:land --write REFUSED — the draft would RESURRECT record(s) 013.

Each of those numbers has been in src\data\artists\robots-record.js before and
is not in it now, which means it was deleted on purpose. A working copy saved
before the deletion still holds it, and landing that copy undoes the deletion
silently — every string in it round-trips, so no other guard would say a word.
```
→ exit 1 · **`robots-record.js` sha256 identical.**

### Probe 1 — the residual danger: stale, with 013 removed

This is the scenario the packet warns about — the braces get answered, 013 is
taken out, and the same old draft is landed.

```
record:land --write REFUSED — this draft is OLDER than the Record it would overwrite.

    draft saved     2026-08-12T00:30:05.977Z
    Record moved    2026-08-12T15:52:35.000Z   (file mtime 2026-08-12T15:04:30.526Z;
                                                last commit 2026-08-12T15:52:35.000Z)

WHICH RECORDS, AND HOW — 2 record(s) would change:

  Record 001 — 30 difference(s)
      `line`  tree "Weird.Baby website is live\nAlert — Incoming Email Server Load (contained)"
              ->  draft "Weird.Baby website is live Alert - Incoming Email Server Load (contained)"
      sections: the Record has 5, this draft has 2
      section 2 "DETAILED REPORT": the Record has 4 paragraph(s), this draft has 23
      …
```
→ exit 1 · **file unchanged. The refusal names the records and the differences.**

### Probe 2 — a fresh draft with one real edit · **MUST BE ALLOWED**

```
record:land — this draft is newer than the Record (saved 2026-08-13T15:58:24Z,
Record moved 2026-08-12T15:52:35Z), so the changes below are edits.
2 record(s) change:
  Record 002 — 1 difference(s)
      section 1, paragraph 3:
        tree  "Blockers - Nothing to Report"
        draft "Blockers - Nothing to Report, and a probe wrote this."
```
→ **guard 8 passed it and named the edit.** The write was then stopped by
**guard 6** (*"it would delete 10124 characters of comment"*) — the
pre-existing, documented limitation, unchanged by this work. **Guard 8 does not
block a legitimate edit.**

### Probe 3 — a fresh draft adding a brand-new Record 006

→ reported as `Record 006 — a new record`. **Not called a resurrection.** The
history check correctly distinguishes a number that has never been in the
Record from one that was deleted from it.

### Probe 4 — a draft with no `saved` timestamp

```
record:land --write REFUSED — this draft carries no `saved` timestamp, so there
is no way to tell whether it is newer than the Record it was seeded from. The
editor writes one; a draft without it was not written by the editor.
```
→ exit 1 · refuses and names the fact it could not establish.

### Restoration, proved

```
draft  sha256 before : 1cbc7f75134e8eea421f762fe5982d550aaa5d3b5232a7460666f034821bb2cb
draft  sha256 after  : 1cbc7f75134e8eea421f762fe5982d550aaa5d3b5232a7460666f034821bb2cb
record sha256 after  : c95f6e3452a71a1d02366426fb2a5e2101d94ca8e87537fffbf0ca2b2855725a  (unchanged in all four)
```

Existing behaviour is unchanged: the bare dry run still prints the eight notes
and exits 1, and `--verify` still round-trips **all 71 strings**.

---

## WHAT I COULD NOT DETERMINE

- **Whether Mike's browser store still holds Record 013.** The editor's client
  merges `localStorage["wb.record.2026-08-09"]` over the tree-derived seed, so a
  browser that has not been cleared since 11 August could put 013 back into a
  freshly-saved draft. Guard 8's resurrection half catches that, which is why it
  is a second, independent check and not folded into the clock test. I did not
  open his browser store.
- **Whether the draft's older Record 001 text has any value worth keeping.** It
  is the superseded dictation; the tree's is the one he corrected. I left both
  in place rather than judge it.
- **Whether guard 6 should learn to carry comment blocks through.** It is the
  stated follow-on in its own note and it is what stops every landing today,
  including legitimate ones. Out of scope for this packet.

## WHAT NEEDS MIKE

**Nothing.** Two things for the record, neither requiring an answer:

1. **Your working copy is 15 hours behind the Record.** Opening `npm run record`
   reseeds it from the live Record; nothing needs cleaning up first.
2. **`record:land --write` cannot land any draft today**, stale or fresh, because
   guard 6 refuses to delete the 10,124 characters of standing reasoning in
   `robots-record.js`. That was already true before this packet and is unchanged
   by it.
