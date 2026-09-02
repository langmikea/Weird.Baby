# CODE — NEW WINDOW, STOPPED BEFORE STARTING

2026-08-13 · READ-ONLY · nothing was written, changed or deleted.

---

## WHAT YOU NEED FROM ME

**Two things.**

1. **JOB 0 — the FAQ into the desk — never reached me.** The onboarding brief
   ends with a bracket telling me to paste five jobs. Nothing was pasted. Jobs
   1–4 turned out to be already done and on disk; **JOB 0 is the only one with
   no report anywhere**, and I have no packet for it. Paste it and I run it.

2. **Your tree is not clean, and what is in it is the four jobs' work.**
   Ten files — five modified, five new — all of them today's output from JOBs
   1, 2 and 3. Nothing of mine. **Commit it or tell me to leave it**; I do not
   commit.

Everything else below is record.

---

## 1. THE PRECONDITION DIFFERS — that is why I stopped

The brief states: `MUSEUM C:\AI\Projects\weird-baby-museum HEAD 8ddd0ba, clean`.

**HEAD is right. Clean is wrong.**

```
 M package.json
 M tools/dictation/emit-record-entries.mjs
 M tools/shorts-compile.mjs
 M tools/shorts-recipe.mjs
 M tools/shorts-verify.mjs
?? docs/shorts/teaser.json
?? tools/dictation/declare-record-strings.mjs
?? tools/dictation/record-land-proof.mjs
?? tools/dictation/workbook_to_draft.py
?? tools/shorts-pad.mjs
```

397 insertions, 43 deletions across the five tracked files.

**Every one of the ten maps to a job that ran earlier today:**

| file | job |
|---|---|
| `tools/dictation/emit-record-entries.mjs` (+198 lines) | JOB 1 — the emitter carries comments |
| `tools/dictation/record-land-proof.mjs` (new) | JOB 1 — `npm run record:proof` |
| `tools/dictation/declare-record-strings.mjs` (new) | JOB 1 — `npm run record:declare` |
| `tools/dictation/workbook_to_draft.py` (new) | JOB 2 — the rehearsal's workbook reader |
| `tools/shorts-compile.mjs`, `-recipe`, `-verify`, `-pad` (new) | JOB 3 — pad colour, pace ramp, push and pull |
| `docs/shorts/teaser.json` (new) | JOB 3 — the rendered teaser recipe |
| `package.json` | two new scripts: `record:proof`, `record:declare` |

`src/data/artists/robots-record.js` is **not** among them, which agrees with
JOB 2's own header — *"WRITE then revert · tree confirmed byte-identical to
HEAD."* The tool it built stayed; the landing it rehearsed was reverted.

**Nothing here contradicts anything.** It is finished work waiting on a commit.

---

## 2. THE JOBS WERE ALREADY RUN — reports are on disk

`C:\AI\_night-20260813\` already holds, written between 16:58 and 17:20 today:

```
JOB1-EMITTER-CARRIES-COMMENTS.md   11,057   16:58
JOB2-REHEARSAL.md                   8,503   17:07
SATURDAY-RUNBOOK.md                 6,906   17:06
REHEARSAL-workbook.xlsx            15,534   16:59
JOB3-VIDEO-TWO-FIXES.md             8,876   17:17
JOB4-THE-ROT.md                    10,333   17:20
```

All four are reports, not packets — each opens with **WHAT YOU NEED FROM ME**.
Three say *nothing*. JOB 4 asks for **four one-word rulings** on the backup
files, and carries a correction to what the previous window told you last night
(it said the 26 `.pre-*` backups could be deleted because git holds them;
**9 of the 26 hold states git does not have**).

Also in that directory from earlier in the day: `JOB1-SOCIAL.md`,
`JOB2-APPROVAL-MARK.md`, `JOB3-NUMBERS-GATE.md`, `JOB5-RECIPE-TO-MP4.md`,
`SUNDAY-SOCIAL.md`.

**There is no JOB 0, and no FAQ packet, in any `_night-*` directory.**
The only files mentioning the FAQ are the two social packets, which is a
different subject.

---

## 3. WHAT I VERIFIED MYSELF

- `C:\AI\_night-20260812\CODE-HANDOFF.md` read in full, including §0's five
  stranded findings.
- **Museum**: HEAD `8ddd0ba`, tree dirty as above.
- **Robots**: HEAD `dcca301`, **63 files dirty** — matches the brief exactly.
  Not touched, not read into, not written.
- **Lint: 9 errors / 8 warnings — the stated baseline, confirmed.**
  5 err / 5 warn `Exhibit.jsx` · 2/2 `HrExhibitFlow.jsx` (plus 2 unused-disable
  warnings) · 1/1 `RobotsExhibitFlow.jsx` · 1/0 `WbAdmin.jsx`.

No other gate was run — this window has written nothing, so nothing needs
gating.

---

## 4. STANDING, FROM THE HANDOFF, IF ANY JOB LANDS NEXT

- `reveal:build` is listed as a gate and is a **writer** — it regenerates
  `reveal/ledger.json` wholesale.
- Mike's writing surface is `C:\AI\_night-20260811\RECORD_days-2-to-6.xlsx`,
  not the record editor.
- `docs/dictation-20260807/record-draft.json` is stale and would resurrect
  Record 013 and truncate 001. Do not land it.
- Eight of Mike's brace notes have been unanswered in that draft since 11 Aug.
