# FINDING — guard 6, scoped for a ruling

**Round:** guard 6. **Written:** 2026-08-30.
**Scope:** READ ONLY. The comment was not moved, `robots-record.js` was not
edited, `record:land --write` was not run. Mike's draft was not touched.
**Repository:** `C:\AI\Projects\weird-baby-museum`, branch `main`.

**Method notation.** **READ** — the tree states it, at a named file and line.
**RUN** — a command was executed and this is its output.

> **TWO THINGS TO CARRY BEFORE THE RULING.**
> **Guard 6 is NOT the only thing between here and a clean `--write`.** Guard 8
> refuses **right now**, and not because of anything Mike did — `npm run
> day:proof`, a §9 gate, rewrites `robots-record.js` byte-identically and bumps
> its mtime past his save. §5.
> **And the packet's line-ending premise is wrong**: `robots-record.js` is pure
> LF, not CRLF, and it is not the only CRLF file in `src/`. §4.

---

## 1 · THE COMMENT, WHOLE

**`src/data/artists/robots-record.js`, lines 643–668.** 26 lines. **1,727
characters / 1,775 bytes** (UTF-8; the box-drawing rules and em dashes are
multi-byte). READ, and quoted here exactly as it sits, including its
indentation:

```js
              /* ═══ [2026-08-26] THE SHORTCUT — MIKE'S OWN ASK ════════════════
                 **"R005 - ADD attachment: Shortcut to the Feed screen, but
                 under the theatre that you are running a .bat file to run the
                 .exe via UNIX 6x, or whatever it was named."**

                 THE FILENAME IS RECORD 004'S AND THERE IS NO `.bat`. That
                 entry's cracked-ZIP listing carries three files —
                 `TERMINAL.EXE`, `PORTAL_2v16.CFG`, `QC_101.TIF` — and a search
                 of both repositories returns **zero** in-story `.bat`. So the
                 file that runs is the one that is there. Nothing was invented
                 to stand in front of it (Doctrine 12), and `or whatever it was
                 named` is answered by the listing rather than by Ops.

                 IT IS AN ATTACHMENT WITH NO PICTURE, WHICH IS THE HONEST SHAPE.
                 A program has no scan. It draws the document glyph and its own
                 name, and the name is the control.

                 THE EVENT IS DELIBERATELY NOT `wb-robots-open-twin`. This
                 module is PUBLIC — `robots.js` imports it — and the console's
                 declaration lives in `portal.js`, which is loaded as its own
                 chunk by `Robots.jsx` and by nothing else. Naming the full
                 detail here would drag the Portal's whole panel declaration
                 into the public entry and collapse a split the album's
                 architecture rests on. So this asks, and the one module that
                 already holds `portal.js` answers. Same seam the panel and the
                 channel strip use: **the button asks; it does not answer.** */
```

**It sits between Record 005's `sections: [ … ]` and its `docs: [ … ]`** — the
attachment it explains is the next thing in the file.

---

## 2 · WHAT GUARD 6 TESTS

**Its condition, not its name.** `tools/dictation/emit-record-entries.mjs:980-999`,
READ:

```js
const commentChars = (s) => (s.match(/\/\*[\s\S]*?\*\//g) || []).reduce((a, b) => a + b.length, 0);
const oldBody = before.slice(before.indexOf(OPEN) + OPEN.length, before.lastIndexOf(CLOSE));
const had = commentChars(oldBody), gets = commentChars(BODY_OUT);
if (gets < had) { … process.exit(1); }
```

**It counts the characters inside `/* … */` blocks in the ARRAY BODY ONLY** —
the slice between `export const RECORD_ENTRIES = [` and `];` — before the write
and after it, and **refuses if the number would go down by even one.** It is a
comparison, not a heuristic: it does not judge which blocks matter, *"because a
rule that decided that would be the thing making the mistake."*

**Why a comment inside the array trips it.** RUN, both sides measured:

| | comment characters |
|---|---:|
| the array body today (`had`) | **1,727** |
| what the emitter would write (`gets`) | **0** |

**A draft has no comments in it.** `record-draft.json` is `{no, date, title,
line, sections, docs}` and nothing else; `generate()` emits fields, never
prose-about-fields. So a write replaces a body containing 1,727 characters of
comment with one containing none, and `0 < 1727` fires.

**What it would lose if it did not fire: this exact block, in full, silently.**
And silently is the operative word — **every other guard would have passed.**
`--verify` reports ALL 52 STRINGS ROUND-TRIP (RUN), because the block is not a
string: it is not in the draft, so there is nothing for a string check to miss.
The guard's own header records the first time this nearly happened, when
**65 per cent of the entries body was comment** and a write was about to take
all eight blocks with it.

---

## 3 · WHAT "ABOVE THE ARRAY" MEANS, CONCRETELY

**The array opens at line 426:** `export const RECORD_ENTRIES = [`. READ.

**The destination is immediately before line 426.** What sits either side there:

- **Before:** a preamble comment block that closes at **line 425** with
  `the next round reaches for a comment block. */` — itself a passage about
  what the four entries taught, ending on the sentence *"What had none was why
  a thing works the way it does, and that is worth knowing before the next
  round reaches for a comment block."* **The block would land directly beneath
  a sentence about reaching for a comment block**, which is either apt or
  confusing and is worth seeing before ruling.
- **After:** `export const RECORD_ENTRIES = [`, then `{ no: 1,` on 427.

### 3.1 · What the line numbers do

Removing 26 lines at 643–668 and inserting them before 426:

| span | effect |
|---|---|
| lines 1–425 | **unchanged** |
| the block | now occupies 426–451 |
| old 426–642 | **shift down by 26** |
| old 669 onward | **unchanged** — 26 removed above, 26 added above, net zero |

### 3.2 · Yes, things reference its position

**RUN**, every `robots-record.js:NNN` citation in the tree, sorted by what the
move does to it:

| | count | examples |
|---|---:|---|
| **unaffected** (above 426, or at/after 669) | 5 | `:350`, `:380-381`, `:681`, `:682`, `:685` |
| **would shift by +26** | 14 | `:516`, `:526-532`, `:544-577`, `:549-550`, `:570-575`, `:585` … |
| **points INSIDE the block and must travel with it** | 1 | `docs/opsday-20260822/ANSWER_KEY.md:181` — *"an Ops-composed string is not authorship (`robots-record.js:648–660`)"* |

The 14 live in **seven documents**, all prose, no code: `BELL-103.md`,
`FINDING-day-editor-save.md`, `FINDING-manual-hold-path.md`,
`FINDING-manual-scans.md`, `MUSEUM_MODE_B_LOG-20260826.md`,
`opsday-20260822/ANSWER_KEY.md`, `PREPARED-manual-hold.md`.

**Nothing in code references a line number in that file** — RUN. So the move
breaks no build and no gate; it staleness-es fifteen citations in documents,
four of which are dated round logs that §0 rules are never edited.

---

## 4 · IS THE MOVE PURELY POSITIONAL?

**It can be. Not one byte of his prose need change — and the line-ending risk
the packet names does not exist.**

### 4.1 · Line endings — the packet's premise is wrong, corrected here

**RUN:**

```
src/data/artists/robots-record.js          CRLF=    0   LF=  677
src/data/artists/robots.js                 CRLF=  962   LF=    1
```

**`robots-record.js` is pure LF.** The CRLF file is `robots.js` — a different
file, and the one normalised on 2026-08-30 in the ROBOTS_OPEN landing. The two
are easy to conflate and this is the second time in a week they have been.

**And it is not the only CRLF file in `src/` either** — RUN, genuine source
files carrying CRLF: `robots-units.js` (1,045), `WbAdmin.jsx` (581),
`WbAdmin.css` (112). *(A handful of `.woff2` and `.png` also match a CRLF byte
pair; those are binary coincidences, not line endings.)*

**So there is no ending to preserve across the move beyond LF**, which any
ordinary edit keeps.

### 4.2 · Indentation — the one place bytes would move, and no word would

The block is indented **14 spaces** before `/*`, and every continuation line
carries **17 spaces**, uniformly — RUN, min 17, max 17, one distinct value.

| | bytes |
|---|---:|
| the block, whole | 1,775 |
| its prose with all leading whitespace stripped | 1,401 |
| **leading whitespace** | **374** (+14 on the opening line) |

**Moved verbatim — the 26 lines lifted with their indentation intact — not one
byte differs.** It would sit at top level wearing an inner-array indent, which
is visibly odd but is the only form in which the answer to *"did anything of his
change?"* is a flat no.

**Re-indented to column 0 — 388 bytes of leading whitespace change and no word
does.** His prose is untouched either way; what moves is spacing that was never
his, since the block was indented to sit inside an array it is leaving.

**One cosmetic consequence either way:** the opening line's `═══` rule is sized
to the indented column. At top level it reads short against the file's other
top-level rules. Cosmetic, and named so it is not discovered as a surprise.

### 4.3 · Comment syntax

Unchanged. `/* … */` is valid at top level exactly as it is inside an array
literal, and the block contains no `*/` before its terminator — RUN, the
non-greedy match returns the whole block in one piece.

**Guard 6 itself does not care about indentation:** its regex begins at `/*`, so
leading whitespace was never counted in the 1,727 either way.

---

## 5 · IS GUARD 6 THE ONLY THING? — **NO**

### 5.1 · Guard 8 refuses right now, and it is not Mike's fault

**RUN, measured this round:**

```
robots-record.js mtime  : 2026-08-30T14:39:43.530Z
last commit touching it : 2026-08-28T13:02:13.000Z
treeMovedAt()           : 2026-08-30T14:39:43.530Z   (the later of the two)
draft saved             : 2026-08-30T14:36:15.298Z
guard 8 refuses (saved < moved)?  TRUE
```

**Mike saved at 14:36:15. The file's mtime is 14:39:43 — three and a half
minutes later — and its content is unmodified in git.** So guard 8, which
*"compares the STAMP, not the WORDS"*, sees a draft older than the Record and
refuses.

**What moved the mtime, proved by experiment — RUN:**

```
content unmodified in git? 0 change(s)
mtime before day:proof: 10:39:43.529
mtime after  day:proof: 10:50:21.251
content still unmodified? 0 change(s)
-> day:proof BUMPS the mtime without changing a byte
```

**`npm run day:proof` snapshots `robots-record.js` and writes the snapshot back
unconditionally** (`day-proof.mjs:77-78`, READ:
`const restore = () => { for (const f of Object.keys(SNAP)) fs.writeFileSync(f, SNAP[f]); }`).
Writing identical bytes still stamps a new mtime.

**`day:proof` is a §9 gate. It runs at the close of every packet.** So the last
step of the session-close ritual makes the draft look stale to the lander, every
time, without anything having changed. **A draft can only be landed in the
window between Mike's save and the next `day:proof`.**

### 5.2 · So the order matters, and it is not the obvious one

Moving the comment writes `robots-record.js` — which bumps the mtime again, and
guard 8 refuses again. **The move does not clear the road; it re-closes the part
of it that guard 8 holds.**

The sequence that ends in a clean `--write`, stated rather than implied:

1. move the comment (guard 6's condition goes to `0 < 0` → false → passes)
2. **Mike saves again** — the editor reseeds from the moved tree, and the new
   `saved` is later than the new mtime
3. `record:land -- --write` — **without a `day:proof` in between**

### 5.3 · The other guards, checked

| guard | condition | state now |
|---|---|---|
| emit faults | a draft field the emitter cannot write | **passes** — `door` was taught 2026-08-30 |
| guard 3 | a record in the tree missing from the draft | **passes** — both carry 1–5 |
| guard 4 | the written file must parse | not reachable until a write is attempted |
| guard 5 | every string comes back | **passes** — `--verify`, 52 of 52 |
| the date guard | every date measurable from the epoch | **passes** — 2026-09-07…11 are indices 1–5 |
| guard 7 | `placed` import returns with a delivered picture | **not engaged** — RUN, zero entries carry a `still` |
| **guard 6** | comment characters may not go down | **REFUSES** — 1,727 → 0 |
| **guard 8** | the draft may not be older than the Record | **REFUSES** — §5.1 |

**Two refusals stand, not one.** Guard 6 is cleared by the move; guard 8 is
cleared by a save taken after it.

---

## 6 · IS RECORD 005 ALONE? — **YES**

**RUN**, every comment block inside the entries array, with the entry it falls in:

```
comment blocks inside the entries array: 1
  line 643 | chars 1727 | inside Record 005
```

**One block, and it is 005's.** Records 001, 002, 003 and 004 carry none —
which is what `robots-record.js:380-381` records: *"EVERY ENTRY IN THIS ARRAY NOW
CARRIES ZERO COMMENT BLOCKS, AND `record:land --write` WILL ACCEPT AN EDIT TO ANY
OF THEM."* **That sentence is true of four entries and was true of five until
005's shortcut comment was written on 2026-08-26** — the same day the
attachment it explains was added.

The file's other comment blocks — the long header and the preamble that closes
at line 425 — are **outside** the array and guard 6 never sees them. Moving 005's
block above line 426 puts it in exactly that company.

---

## 7 · EVERY COMMAND RUN

Nothing here moved, edited or landed anything.

```
node … locate the block: array span, comment span, char and byte counts
sed -n '640,670p' src/data/artists/robots-record.js          (quoted in §1)
grep -n "GUARD 6" -A 40 tools/dictation/emit-record-entries.mjs   ·  its code at :980-999
node … commentChars on the array body (1,727) and on the emitter's output (0)
sed -n '414,428p' … the destination, and what closes at line 425
grep -rhoE "robots-record\.js:[0-9]+(-[0-9]+)?" docs/ src/ tools/ reveal/   (20 citations, bucketed)
python … line endings of robots-record.js, robots.js, and every CRLF file in src/
node … the block's indentation: 14 / 17 uniform, 374 bytes of leading whitespace
node … treeMovedAt() vs draft.saved  -> guard 8 refuses
stat + npm run day:proof + stat   -> the mtime bump, content unmodified either side
node … comment blocks per entry; entries carrying a `still`
node tools/dictation/emit-record-entries.mjs --verify        (52 strings, exit 0)
```

Everything else is READ, at the file and line named beside it.
