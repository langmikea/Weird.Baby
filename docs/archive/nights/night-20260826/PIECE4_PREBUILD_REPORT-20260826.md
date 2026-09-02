# PIECE 4 — THE THREE ANSWERS, BEFORE ANYTHING IS BUILT (2026-08-26)

**HEAD `a3356c6`, `git status --short` empty.** Read whole this round:
`docs/canonical/OPERATIONS.md` (556 lines), `tools/dictation/day.mjs` (1,585),
`tools/dictation/record-serve.mjs` (115), the save half of
`record-edit.client.js`, the guard half of `emit-record-entries.mjs`, and
yesterday's round logs in `C:\AI\_night-20260825\`.

**NOTHING WAS BUILT AND NOTHING WAS WRITTEN INTO THE TREE.** This file and the
directory holding it are the round's only output.

---

## 1 · HOW THE PAGE GETS WHAT HE TYPES BACK INTO THE TREE

**OPS IS RIGHT ABOUT THE MECHANISM. `record-serve.mjs` IS THE PATTERN, AND THE
EXACT INSTANCE IS ALREADY POINTED AT THE RIGHT DIRECTORY.** Three corrections
follow, and the third is where the work is.

### CONFIRMED, AT THE LINES

| claim | where | reads |
|---|---|---|
| loopback only | `record-serve.mjs:104` | `server.listen(PORT, "127.0.0.1", …)` — not `0.0.0.0`, not a LAN address |
| POST writes the draft | `:67`, `:82` | `POST /save` → `fs.writeFileSync(DRAFT, body)` |
| one path, uninfluenceable | `:56` | `DRAFT` is a module constant. There is no filename in the protocol to traverse with |
| refuses an unreadable body | `:77–81` | no `entries` array → 400, nothing written |
| cannot be walked out of | `:97` | `path.resolve` + `startsWith(ROOT)` |

**AND `day.html` IS ALREADY INSIDE `ROOT`.** `record-serve` serves
`docs/dictation-20260807/` and that is where `day.mjs` writes its page. So the
day editor is reachable at `http://127.0.0.1:8899/day.html` today, unchanged.
**Piece 4 needs no new server** — one endpoint, one draft path, one lander,
which is also the answer to *two writing surfaces for one entry is how a
question gets two answers*.

### CORRECTION 1 — THE CHAIN DOES NOT END AT `record-draft.json`

That file is a **working copy**. The tree is
`src/data/artists/robots-record.js`, and the only thing that writes it is
`npm run record:land -- --write`, behind eight guards, **run by Mike**. So
"back into the tree" is two moves and only the first is the page's:

    his keystroke → POST /save → docs/dictation-20260807/record-draft.json
                                                      ↓  [MIKE]
                            npm run record:land -- --write → the Record

**The page must never say it wrote the Record.** `record-serve` answers with
`path: docs/dictation-20260807/record-draft.json` and the client says *"It is in
the repo; nothing to move"* — both true, neither claiming the landing.

### CORRECTION 2 — THE SEEDING RUNS THE OTHER WAY

`draftEntries()` (`reveal/record-entries.mjs:583`) reads **`RECORD_SOURCE` — the
tree** — not the draft. `day.mjs` calls it at build time. So `record-draft.json`
is only ever a **destination** for these pages, never their source, and it can
fall behind the tree with nothing noticing. **It already has:** that file's own
`_` field records the 2026-08-24 regeneration — *"entries had been edited
directly in the source and this file had fallen behind — Records 003 and 005
differed."*

### CORRECTION 3 — WHEN THE SERVER IS NOT RUNNING: THREE ROADS, AND TWO ARE QUIET

| how it is open | what happens | honest? |
|---|---|---|
| **`file://`** (double-click) | `saveViaServer` returns false at the protocol test without sending a request (`record-edit.client.js:926`) → picker → `file://` is not a secure context, so `showSaveFilePicker` is undefined → **downloads to Downloads and says so loudly**, with the fix named | **YES** |
| **`npm run mock`** | `tools/serve-mock.mjs:76` **never reads `req.method`**. `POST /save` is treated as a request for the file `docs/save`, which does not exist → **404** → `r.ok` false → picker. But `http://127.0.0.1` **IS** a secure context, so the picker **exists**: a folder dialog, his choice, and the page says *"Saved … Nothing to paste"* — truthfully, about a file outside the repo | **NO** |
| **served, then stopped** (Ctrl-C, crash, sleep) | `fetch` rejects → `.catch(() => false)` → picker → same silent dialog. He was on the road that works and it became the road that does not, unannounced | **NO** |

**AND `day.mjs` PRINTS THE TRAP ITSELF, AS ITS LAST LINE:**

    npm run mock 8931   →  http://127.0.0.1:8931/dictation-20260807/day.html

That was **correct for Piece 1**, which is read-only. **The moment the page takes
a keystroke it becomes the documented way to lose a save.** That line changes in
the same commit that makes the page writable, or the first thing Piece 4 ships is
an instruction to use the server that cannot accept the work.

**SO THE MECHANISM IS NOT WHAT NEEDS BUILDING. THE FALLBACK IS.**

---

## 2 · WHAT CAN STILL BE LOST

**WHAT `a3356c6` CLOSED, EXACTLY:** the field set between the draft and the
tree. `EMITTED_ENTRY_FIELDS` — 14 fields — and `EMITTED_DOC_FIELDS` — 8 — are
the emitter's mirror of the reader's sets (`emit-record-entries.mjs:339–344`),
and `emitFaults()` (`:346`) refuses by name anything else. `doors` and
`evidence` are refused by name, with a written ruling each.

**IT CLOSES NOTHING BETWEEN HIS FINGERS AND THE DRAFT, AND THAT IS THE WHOLE OF
PIECE 4'S NEW SURFACE.** Six things. The last two are the ones I would build for
first.

**1 · THE UNSAVED EDIT.** `day.html` holds **no text at all** today. Its only
store is `wb.day.readiness.v1`, and it holds **two booleans per element**
(`day.mjs:341`) — no prose. `record.html` autosaves prose to `localStorage`
every 400ms (`record-edit.client.js:112`); the day editor has no equivalent
because it had nothing to save. **On the first keystroke Piece 4 adds, that gap
is unprotected in a way `record.html`'s is not.**

**2 · THE BROWSER CLOSE.** Follows from 1. **There is no `beforeunload` handler
in either page** — grepped, nothing warns on close. And note that
`#dy-marks-out` is today a **clipboard bridge with no writer**: *"Nothing on
this page writes to the tree — copy this and Ops lands it."* His readiness marks
already survive only if he presses copy. **Piece 4 either gives the marks the
same POST road as the prose, or it ships a page where half the state is durable
and half is a clipboard.**

**3 · TWO TABS.** Both stores are **last-writer-wins on a whole JSON object** —
`store.setItem(CFG.key, JSON.stringify({… entries}))` (`record-edit.client.js:96`)
and `saveMarks()` in `day.html`. **No `storage` event listener exists in either
page.** The endpoint has no compare-and-set either: `fs.writeFileSync(DRAFT,
body)` takes the last body that arrived. Two tabs on one day means the second
save overwrites the first tab's work wholesale and **neither tab knows**.

**4 · A STALE DRAFT OVER A NEWER TREE — GUARD 8 COVERS THIS, BY THE CLOCK.**
`emit-record-entries.mjs:798–826` refuses when the draft's `saved` is older than
the later of the tree's last commit and its mtime. That is the right test, and
it holds **if the stamp is honest**.

**5 · A STALE PAGE OVER A NEWER TREE, WHICH GUARD 8 CANNOT SEE. THIS IS THE
SHARP ONE.** `day.html` is a **generated snapshot** — `npm run day` bakes the
entries in at build time — and **nothing in it records which tree state it was
baked from.** Checked: `shell.mjs`'s `page()` writes no HEAD sha and no
timestamp. So:

> 09:00 `npm run day`; he opens the page and leaves the tab open.
> 14:00 the tree moves — a landing, a hand edit, a `git checkout`.
> 16:00 he types in the **still-open** tab and saves. The POST stamps
> `saved` = 16:00, **honestly**, because that is when he saved.
> Guard 8 compares 16:00 to 14:00 and **PASSES**.
> `record:land --write` lands 09:00's content over 14:00's.

**Guard 8 compares stamps, not content, and the stamp is true.** This is the
workbook hazard exactly, one surface over — OPERATIONS §8 records that the
staleness guard *"IS INERT ON THE WORKBOOK PATH — `workbook_to_draft.py` STAMPS
`saved` WITH `now()`, SO A WORKBOOK OF ANY AGE PASSES IT."* **A generated page
that stamps at POST time has the identical defect**, and it arrives the day
Piece 4 ships unless the page carries the tree state it was baked from. The
divergence class is not hypothetical: see §1 Correction 2.

**6 · A DELETION, WHICH IS A LOSS CLASS PIECE 4 CREATES.** He asked for *"How do
I delete a row? Insert a row?"* — so deletion becomes a thing the surface does.
The repair made an **unknown field** loud; it can do nothing about an **absent**
one. Guard 3 (`:630`) protects whole **records** from vanishing, not sections
inside one. **A section he deletes on purpose and a section the page drops by a
bug produce a byte-identical draft.** Nothing in the tree covers this today.

**AND ONE LINE THAT IS CORRECT BEHAVIOUR AND WILL READ AS A BREAKAGE.** The
repaired trip still refuses `doors` and `evidence` **by name**. The day he types
into a section that has doors, the lander refuses the whole landing. That is the
guard working. **The page should say it before he types, not the console after.**

---

## 3 · THE GUARD THAT HAS TO EXIST BEFORE HE TYPES

**"IT WORKS" IS NOT THE STANDARD AND THE TREE ALREADY OWNS THE ALTERNATIVE.**
`tools/dictation/record-land-proof.mjs` exists, and the round-trip repair's own
§3 is titled **PROVED BY LOSING SOMETHING FIRST**. This is that instrument
pointed at the new surface, not new doctrine.

**`npm run day:proof` — three properties. Each names the loss it catches, and
each is shown FAILING against a deliberately broken build before it is shown
passing.**

### P1 — A KEYSTROKE SURVIVES TO THE TREE, CHARACTER FOR CHARACTER

Drive **the real served page** — not a unit test against a second
implementation. `record-edit.client.js:990` exposes `window.WBRecordEditor` for
exactly this reason and Piece 4 gets the same hook. Type a known string with
CRLF, leading spaces and a brace-free body. POST. Read `record-draft.json` off
disk. Run the **real** `record:land --write` against a **scratch copy** of the
source. Parse the result with **the museum's own reader**. Compare.

**PROVED BY LOSING FIRST:** run the same drive with the `{pre}` marker
deliberately stripped in the collector, and with one `docs.source` deliberately
not collected. **P1 must name both.**

**AND IT MUST ASSERT THE FIELD SET, NOT ONLY THE PROSE.** The repair log records
that `record:land --verify` printed *"ALL 51 STRINGS ROUND-TRIP"* **while six
photographs were being destroyed.** P1's output says which of the two it proved.

### P2 — THE PAGE KNOWS WHICH TREE IT WAS BAKED FROM, AND REFUSES TO SAVE OVER A NEWER ONE

**The fix for loss 5, and the one that must exist before he types.** `npm run
day` bakes the tree's state into the page — sha256 of `robots-record.js` at
generation, plus its mtime. The POST carries it. The endpoint compares it to the
file on disk **now** and refuses with a sentence naming what moved, rather than
writing a draft that will pass guard 8 by carrying a true stamp on stale words.

**PROVED BY LOSING FIRST:** generate the page → move the tree → save from the
open tab. The **unguarded** build lands the stale content over the new, and I
name the destroyed paragraph. The **guarded** build refuses at the POST and the
tree is **byte-identical**.

### P3 — A DELETION IS NEVER SILENT

**For loss 6.** Every element already carries an identity key — `field:title`,
`section:<the header he wrote>` — and `day.mjs:337` already rules it: **THE KEY
IS AN IDENTITY, NEVER A POSITION.** The POST carries the key set the page
**started** with alongside the one it **ends** with; a key that left is named in
the response and in the lander's diff. Guard 3 protects records; this protects
sections, with the scheme that is already in the file.

**PROVED BY LOSING FIRST:** delete a section through the UI — the diff names it
and the landing proceeds. Then build a variant whose collector **drops** an
element by bug — and the check names it **identically**.

**AND THAT IS P3's HONEST LIMIT, STATED RATHER THAN GLOSSED: it cannot tell a
deliberate deletion from a bug. It can only make sure neither is silent.**
Telling them apart needs him to confirm, and a confirmation step is UX, which is
Mike's.

### WHAT NONE OF THE THREE PROVES

**They prove data survival. They do not prove a usable page.** OPERATIONS §0 —
*reading code is not evidence, the only oracle for a rendered thing is a
rendered thing* — so all three drive the served page rather than the module. But
whether the boxes are good to write in is **Mike's eye on a served URL**. Pass
five's log records the browser pane would not composite (*"the page is not
compositing frames"*), so a screenshot may again be unavailable and the
measurements will be through the DOM, computed styles and Range geometry.

---

## OPEN FOR OPS, BEFORE ANY CODE

1. **Where P2's refusal lives.** (A) the server, which is the thing that writes
   and is one round-trip cheaper. (B) the page, which can tell him what happened
   in his own words before he has typed for an hour. (C) **both** —
   recommended: the server refuses because it writes; the page checks on focus
   because he should learn early.
2. **Do the readiness marks join the POST?** They are the page's other durable
   state and they are on a clipboard today. Leaving them there ships a page
   where half the state is durable and half is not.
3. **`day.mjs`'s last printed line** — the `npm run mock 8931` URL — is a defect
   the moment the page is writable. It changes in the same commit.

## CARRIED, UNCHANGED THIS ROUND

- **`STAGE_PREFIX` is imported by `day.mjs` and used by nothing.** Flagged since
  pass one.
- **`npm run record:proof` fails 3 of its checks at HEAD**, verified
  pre-existing on 2026-08-25. **Not re-measured this round** — it writes and
  restores the source file, and this round wrote nothing into the tree.
- **`reveal/day.mjs` exports `plan()` and nothing can import it** — it is a
  script with no main guard.
