# JOB 1 — THE EMITTER CARRIES COMMENTS
2026-08-13 · WRITE · gates green.

---

## WHAT YOU NEED FROM ME

**Nothing. Saturday's landing is automatic now.**

`npm run record:land -- --write` carries every comment block through, and
`npm run record:proof` proves it against the real file in about twenty seconds.
**A no-op landing is byte-identical.** A new record lands beside the commented
ones with nothing lost.

**One thing stays a hand edit, deliberately:** changing the text of an entry
that carries comments. That is refused by name, not written without them. New
records — Saturday's whole shape — land automatically.

---

# 1a — THE APPROACH

## What the file actually is, measured first

| | |
|---|---:|
| `robots-record.js` | 18,491 chars |
| comment characters | 12,042 (**65%**) |
| the entries body | 16,488 chars |
| — of which comment | **10,124 (61%)** |
| comment blocks in the file | 6 (4 inside the array) |

*The packet's figures — 23,143 and 15,054 — are from before Record 013 was
deleted on 2026-08-12. The 65% is right; the absolute numbers moved.*

## Why this is not a comment-reattacher

The obvious design binds each comment to the thing it explains and re-emits it
there. **I measured before designing and the obvious design is the wrong one**,
for a reason only a diff reveals:

**THE EMITTER CANNOT REPRODUCE A HUMAN'S LINE BREAKS.** `wrap()` folds a long
string into a `+` chain at 74 columns. The breaks in this file were made by a
person moving text out of `robots.js` by hand. Measured on the real file, every
string round-trips to the same **value** and almost none to the same **source**:

```
  file:  "Weird.Baby launched on schedule. No deviations; "
       + "f(Ump) = 100%"
  emit:  "Weird.Baby launched on schedule. No deviations; f(Ump)"
       + " = 100%"
```

A reattacher would carry every comment perfectly **and still rewrite every line
around them** — so the diff of a no-op landing would be the whole file, and
nobody could review Saturday's five records inside 400 lines of reflowed text.

## So an unchanged entry is not regenerated at all

**Its original source is spliced through byte for byte** — comments, line
breaks, spacing and all. Only an entry whose text actually differs is generated
afresh.

**Saturday is five NEW records appended to five untouched ones**, so this
carries 100% of the existing reasoning *by construction* and generates only what
Mike wrote that morning.

"Unchanged" is decided by **the museum's own reader** — `draftEntries`, the same
function that seeds the editor Mike writes on — so the word means the same thing
to the lander as it does to his surface.

## What a comment is bound to, and what happens if its entry goes

**A comment is bound to the entry it sits in or immediately precedes, and it
travels with that entry's source.**

**If an entry is deleted:** guard 3 already refuses a draft that drops a record,
before any of this runs. **If an entry survives but its text changed:** it must
be regenerated, a generated entry has no source to splice into, and so it is
**refused by name** — naming the record, the block count, the character count
and the first line of each block. Nothing is ever written without them.

---

# 1b — THE HARD CASES

Four shapes exist in the file. I found them by parsing with `onComment` and
printing every comment's range against every entry's range, rather than reading
and hoping.

| shape | where | example | handled |
|---|---|---|---|
| **before an entry** | between `[` and the first entry, or between two entries | the **6,898-char** Record 001 block | the entry's span is extended **backwards** to the previous entry's end, so the comment travels with the entry it is about |
| **inside an entry, before a property** | within the object literal | Record 001's blocks before `line` (1,477) and before `sections` (1,376) | inside the span already |
| **nested inside a section's body array** | deeper than the entry's own properties | Record 003's block after the last paragraph of its second section (373) | inside the span already |
| **after the last entry** | between the last entry and `]` | none today | carried verbatim as a `tail` |
| *above the file* | before `RECORD_ENTRIES = [` — the 1,318-char header and the 600-char `placed` note | | **already safe**: `--write` only ever replaces the array and keeps the preamble. Untouched by this work. |

**Nothing is silently dropped.** The span walk is *contiguous*: each entry's span
starts where the previous one ended, so every byte between the array's brackets
belongs to exactly one entry or to the tail. There is no gap for a comment to
fall into.

---

# 1c — THE ROUND TRIP: EMPTY DIFF

Derive a draft **from the tree**, land it, compare:

```
  a no-op landing is BYTE-IDENTICAL  (exit 0, sha c95f6e3452a71a1d…)

  carried through untouched: 001 002 003 004 005
  comment characters: 10124 before, 10124 after
  18491 -> 18491 bytes
```

**sha256 before and after are the same string.** The diff is empty.

*This needed `--draft <path>`, added so the proof can run against a draft that
is not Mike's working copy. The default is unchanged and is still his file.*

---

# 1d — UNDER CHANGE

### A NEW record beside the commented ones — Saturday's shape

```
  a NEW record 006 lands; 6 comment block(s) survive, 0 lost
  with 006 removed the file is identical to the original — only the new entry moved

  carried through untouched: 001 002 003 004 005
  new: 006
  comment characters: 10124 before, 10124 after
  18491 -> 18849 bytes
```

**The second line is the strong one.** Delete the new entry from the result and
you get the original file back, byte for byte — so *only* the new entry moved.

### A CHANGE to a commented entry — refused by name

```
record:land --write REFUSED — an entry whose text CHANGED carries
comment blocks, and a generated entry has nowhere to put them.

  Record 001 — 3 block(s), 9751 characters:
      /* ==== [S2 2026-08-07 · REBUILT 2026-08-08] RECORD 001 ===========
      /* ═══ [2026-08-10] THE DECK IS HIS, AND THE OPS SENTENCE IS GONE
      /* [2026-08-10] HIS DICTATION, TYPOS CORRECTED ON HIS OWN

Edit that entry by hand, or move its reasoning above the entry so a later
landing carries it. NEW records beside commented ones land fine; it is only
a CHANGE to a commented entry that stops here.
Nothing was written.
```

### A change to an UNcommented entry — lands cleanly

```
  a change to an UNcommented entry (005) lands and loses no comments
  carried through untouched: 001 002 003 004
  regenerated: 005
  comment characters: 10124 before, 10124 after
```

---

# 1e — EVERY GUARD STILL FIRES

**No guard was weakened.** Guard 6 — the one that was refusing every write — now
passes because the emitter stopped deleting comments, not because the guard
stopped counting them. It still compares comment characters before and after and
still refuses on any loss.

```
  ok    guard 1    `--no` is a preview filter                   exit 1
  ok    guard 2    the preamble must be found                   exit 1
  ok    guard 3    no record may vanish                         exit 1
  ok    guard 6    it may not eat the reasoning                 exit 1
  ok    guard 8    a stale draft may not land                   exit 1
  ok    guard 8a   a draft may not resurrect a retired record   exit 1
  ok    guard 8b   a draft with no `saved` is refused           exit 1
  ok    guard 0    curly-brace notes are refused                exit 1

  identical to where it started: true
```

Guards **4** (it must parse, by the museum's own reader) and **5** (every string
round-trips or the original goes back) are not in the battery: both are
*post-write* checks that only fire on a bug in the emitter itself, and I could
not construct a case that triggers them without first breaking the emitter.
**They are unchanged and still run on every write** — guard 5 is what printed
*"every string round-tripped"* in each successful landing above.

**`record:land --write` succeeds on the real record file.** It is still refused
against the **default draft on disk**, because that file is the stale
2026-08-11 working copy holding Record 013 — guard 8 doing exactly its job. That
is the pre-existing condition from the previous packet, not a regression.

## The proof is a repo tool now

```
npm run record:proof
```

Both batteries, against the real file, every write reverted and the reversion
proved by sha256. **Run it before Saturday and after any change to the emitter.**
A proof that ran once is worth less than one that can be re-run.

---

# 1f — IS IT SAFE?

**Yes, and the reason is that it does less than asked rather than more.**

The dangerous version of this job is a tool that takes 10,124 characters of
standing reasoning and *reflows* them. This one never touches them: an unchanged
entry is a byte-for-byte splice, and an entry it cannot carry safely is refused.

**Three things I would want a future session to know:**

1. **The safety rests on `sameAsTree`.** If that comparison ever returned a
   false *positive* — "unchanged" for an entry that changed — the landing would
   silently keep the old text. It compares every string the reader can see, via
   the same reader the editor uses, and guard 5 independently re-reads the
   written file and checks that every draft string is present. Two independent
   checks, and they would have to fail together.
2. **A comment between two entries binds to the FOLLOWING one.** That is a
   judgement. Record 001's 6,898-character block is titled `RECORD 001` and sits
   above Record 001, so it is right here. A comment written as a *footnote* to
   the entry above it would travel with the wrong entry — it would not be lost,
   it would move.
3. **The `_` fields in the draft are not carried.** A draft may hold `_`
   annotations; the emitter ignores them, as it always has.

---

## WHAT I COULD NOT DETERMINE

- **Whether guards 4 and 5 still fire**, since triggering them requires breaking
  the emitter first. Reasoned unchanged, not tested.
- **Whether Saturday's draft will actually contain dates.** The proof had to
  fill them in: `draftEntries(src)` cannot resolve `recordDay(n)` against a
  source that is not `record-epoch.js`, so a tree-derived draft has null dates
  and guard 8's diff reports every record as changed. **Mike's editor writes real
  dates**, so this is a harness artifact — but a workbook-derived draft must
  include them or Saturday's diff will be noisy. It is in the runbook.
- **What happens to a comment placed inside a section's `label`.** No such
  comment exists; the span walk would carry it, but it is untested.

## WHAT NEEDS MIKE

**Nothing.** One thing worth knowing: **if you want to change the words of
Records 001 or 003 on Saturday**, that is the one case the lander refuses — it
would have to be a hand edit, or Ops moves those comment blocks above the entry
first. Records 002, 004 and 005 carry no comments and can be changed freely.
