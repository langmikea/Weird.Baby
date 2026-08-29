# ONE SUMMARY, ONE EXIT — the shape every Ops message takes

Body of §7 doctrine 28. Landed 2026-08-29. STANDING, every Ops message.

---

## 1. The rule

Mike has an extremely small buffer. Every Ops message is a short
human-syntax summary of what he needs to know, followed by EITHER a single
block to copy to Code or pwsh, OR a single question to answer.

**Never both. Never neither. Never two blocks.**

The summary is prose, not a status dump — what changed, what it cost, what
it means. The exit is one thing to do: paste one block, or answer one
question. A message with two blocks makes him choose which to run. A
message with no exit makes him work out what Ops wants. Both spend buffer
he does not have.

---

## 2. The worked example

Mike's own seventh-fault message, reproduced verbatim — his line splits, his
casing, his typos, unsmoothed. Sent 2026-08-26 03:00:50 UTC (2026-08-25
local), recovered from the session log, not retyped. It is quoted here as a
literal block so nothing renders away.

One summary. One block. Named as the only block in the message. A
three-second check on what the block should print. No second block and no
question.

`````
The seventh was the one nobody named, and it's the worst. Six of the seven were already loud — `recordShapeFaults()` returns them by record and field. `docs.*` was carried by the reader and dropped by the writer, in silence.
And the proof on real data is brutal. Record 003 went into `record:land` with four attachments and came back as four bare titles — four sources, four page counts, and six published photographs with their captions, destroyed. In the same run the tool printed ALL 51 STRINGS ROUND-TRIP: his characters are unchanged.
True, and read as the entry round-tripped, printed over six photographs being destroyed.
The emitter now refuses what it cannot write — that was the missing half, and it's the end that edits the tree. Carried where it can be, refused loudly where it can't, and Code said which per field and why.
And the guard is named, not built: three lists in three files, each guarding its own edge, nothing asserting DRAWN ⊆ READ ⊆ EMITTED. That's why it bit twice. Belongs in `reveal:check` — its own tool would be a sixth command nobody remembers.
Run this. It is the only block in this message.

```
Set-Location 'C:\AI\Projects\weird-baby-museum'
git add reveal/record-entries.mjs tools/dictation/emit-record-entries.mjs tools/dictation/record-edit.mjs tools/dictation/day.mjs docs/dictation-20260807/record.html
git status --short
git commit -F 'C:\AI\_night-20260825\COMMIT_MSG_ROUNDTRIP-20260825.txt'
git status --short
git log -1 --pretty=%B | git interpret-trailers --parse
git push

```

Three-second check: five `M `, a commit naming 5 files, empty after, `interpret-trailers` silent.
That was the blocker. Piece 4 — writing — is next, and the page is safe to type into now.
`````

---

## 3. Why this is a file and not a section

`docs/canonical/OPERATIONS.md` runs against a 40,000-byte ceiling that
`npm run ops:size` enforces — the ground state has to come back through the
conduit whole. Before this edit the file was 38,867 bytes, leaving 1,133
bytes of headroom. This body is 3,502 bytes. It does not fit, and
shrinking it to fit would cut the verbatim example, which is the part that
teaches the rule.

So §7 carries the lead line and this file carries the body — the same split
`OPERATIONS_ARCHIVE/07-WORKING-DOCTRINE.md` already uses for doctrines 1–27.
