# THE RECORD EDITOR — HUMAN PASS (A · B · C · D)
2026-08-11 · write packet · not committed, not pushed, not deployed
HEAD at start: `8c6cc2a`, working tree clean.

Two defects Mike reported after using the editor, both of the same kind: the
page was behaving like an instrument and he needed a writing surface.

---

## A. THE COUNTER IS DELETED AND THE LINE ITSELF SAYS IT

> *"I do not need a number. Just make it obvious if I try to enter too many."*

### A1 — what went

The whole readout. `.wb-lim` the element, `.wb-lim` / `.on` / `.near` / `.over`
the four CSS rules, `limitOf()` the function, the `focusin` listener that
called it, the `elLim.className` reset in `focusout`, and `says` on both
budgets in the emitted config (it existed only to be printed by that box).
The character count, the three viewport figures and the gate number went with
them.

**And one thing that was never in the complaint, measured before deleting it:
the box overlapped the headline it was counting.** It was positioned at
`rect.top − 26px` of the focused field, and on the built page the head sits
close enough to the top of the frame that the box sat ON the line — so the
readout obscured the string it described. Screenshot taken before the change;
not delivered, because the code that draws it no longer exists to re-photograph.

### A2 — what replaces it

**Past the budget the characters go to REVERSE TYPE.** `::highlight(wb-over)`
paints them on the museum's own ink (`--wb-gold`, #211f1c) in the museum's own
paper (`--wb-bg`, #d9d5ca) — the two colours the Record is already set in,
swapped. No number, no word, no tooltip, nothing to hover. The tail of the
headline turns into a black bar and stops looking like part of the line, which
is the proof-reader's mark for *this does not belong*.

**It is a RANGE and not a node, for the brace highlight's exact reason.** A
`<span>` inside a contenteditable is a thing the caret falls into and a paste
splits; the mark would then be capable of damaging the text it marks.
`CSS.highlights` touches no DOM.

**And the field says it too**, so the signal survives a browser with no
Highlight API: `[data-wb-field][data-wb-over]` takes a solid outline in the
same ink, beating `:hover` and `:focus`. One signal, two expressions, no new
object on the page — and an outline is drawn outside the box, so nothing moves
(this stylesheet's first rule).

### A3 — the register

Nothing new entered the palette. The two colours are the face's own tokens,
read through `var()` with their own values as fallback (custom-property
inheritance into a highlight pseudo is a young corner of the platform; either
way the mark is the ink and the paper and cannot come out transparent).
Measured on the page: the outline computed to `rgb(33, 31, 28)` — the token
resolved.

### A4 — the phone caveat is DROPPED, and this is the reason

The measured budgets are 64 characters at 1280, 58 at 768, **36 at 390**. A
second, fainter grade starting at 36 was designed and rejected.

**It would have been on almost permanently, and it would have been marking
something that is not a fault.** Record 003's headline is 39 characters and
013's is 46 — both wrap on a phone today, both shipped that way with Mike's
knowledge. A mark that fires on nearly every headline he will ever write says
nothing after the second one, and A4 says to drop it rather than add noise.

**Desktop leads, so the threshold is fixed and does not follow the window.**
If he narrows the browser the mark does not move — "too long" means too long
for the surface he writes for, not for the surface he happens to be looking at.

### A5 — nothing is blocked

No `maxlength` anywhere. Measured: the model held all 65 characters of the
over-long headline and all 145 of the over-long summary. Nothing truncated,
nothing refused, nothing typed that did not land.

### A6 — one declaration, and it is `reveal/record-shape.mjs`

`overAt()` reads `CFG.budgets`, which the generator fills from `BUDGETS` and
`TITLE_BUDGET_MEASURED`. **No figure is retyped in the page.**

**The threshold is the STRICTER of the gate's number and the widest measured
width** — `min(62, 64) = 62` for the headline, `130` for the summary (which has
no measured band). Both are ways of being too long; a mark that fired at the
looser one would let the tighter one through in silence. Verified on the page:
the reverse type starts at character **62** exactly.

**A field with no budget is never marked, and that is now the whole statement
that it has no limit.** The old readout said *"no limit on this field"* in
words, on every field, every time it was focused. Doctrine 22's "say where
there is NO limit" is satisfied by construction instead of by a sentence — and
that is a genuine loosening of that doctrine's letter, made on Mike's explicit
ruling. Named here so a future round does not read it as an oversight.

---

## B. THE INDEX BLOCK DRAWS ONCE

> *"Index content repeated — Remove extra view."*

### B1 — the index row goes; the opened record's head stays

**The choice was forced rather than preferred.** Since J1 the opened head IS
the index row: `RecordEntry` prints the same six classes inside
`.vp-rec-openhead` that `RecordIndexRow` prints inside `.vp-rec-index`, and
`Exhibit.css` gives the two **one selector list** — same grid, same `gap: 1px
16px`, same padding, same `min-height`, same `.vp-fe-title` and `.vp-fe-line`
declarations. So removing the row loses no view.

The other direction was not available at any price: the head is markup *inside*
a shipped component, and hiding it would have meant forking `RecordEntry.jsx`
for an Ops tool.

### B2 — the one he sees is the one he edits

`fields()` no longer looks inside `.vp-rec-index`. Each field has exactly one
node again (38 wired → **36**, the two duplicates gone), and `line` moved from
the index row's `.vp-rec-sum` to the opened head's `.vp-rec-deck`.

**Both classes exist for this purpose and `Exhibit.css` says so at both of
them** — *"`.vp-rec-headline` remains as a HANDLE — `record-edit.client.js`
finds Mike's headline field by this class"* and *"`.vp-rec-deck` survives as a
HANDLE and nothing else"*. This is the contract being used as designed, not a
class being borrowed.

**Had `line` been left unwired it would have been on the page and uneditable —
which `audit()` would have caught, in red. Being caught is not the same as
being right.** Measured after: `WBRecordEditor.fields()` returns `line`, no
warning banner, `.vp-rec-index` count 0, `.vp-rec-openhead` count 1,
`.vp-rec-headline` count 1, `.vp-rec-deck` count 1.

### B3 — how, without forking anything

**A flag on the preview HARNESS, not on a museum component.**
`tools/dictation/preview/entry.jsx` is Ops' own wrapper; its `Preview` takes
`index` (default **true**) and the editor calls `WBPreview.render(…, { index:
false })`. `RecordIndexRow.jsx` and `RecordEntry.jsx` are untouched. Nothing
third is drawn — the flag chooses which of the two real components mounts.

`frame.html` calls `render` with three arguments and is byte-identical to what
it drew yesterday: a caller that has not been taught the option cannot lose a
view by not knowing about it.

---

## C. WHAT ELSE IS ON THAT PAGE (reported, not touched)

### C1 — things speaking to Ops rather than to Mike

| Where | What it says |
|---|---|
| the `*` on a record chip, and `[CHANGED]` in the paste | *differs from what `robots.js` ships today* — a fact about a source file |
| the status line | see C2 |
| the migration banner | slot names — `W1.D1.HEAD → Record 001, 2 section(s)` |
| the "could not draw" warning | `_preview/preview.js`, `npm run dictation` |
| the "field not found" warning | *"a class name in `RecordEntry.jsx` has moved"* |
| Save's messages | `docs/dictation-20260807/`, `npm run record:serve`, `npm run record:land` |
| the paste box header | `src/data/artists/robots.js`, `record-draft.json` |
| the paste's per-record line | `INDEX LINE (34 of 130 characters)` — **the number A deleted from the field is still in the handoff text** |

The last one is the only one worth a ruling: it is Ops-facing by construction
(it is the document he hands over), but it is on his screen when he presses
COPY EVERYTHING. Left as it is.

Not reported as Ops-facing, deliberately: the field placeholders (*headline*,
*lead paragraph*, *tombstone — where things stand when the lights go off*), the
dashed outlines, the `+` buttons and the brace tint. Those are writing aids and
Doctrine 25 puts them exactly where they are — on the field.

**One fidelity gap, not an instrument:** Record 013's plate draws as a broken
image. `record:serve` serves only `docs/dictation-20260807/`, and the picture
lives at a museum address. Pre-existing; it is a hole in the picture, not in
the writing.

### C2 — what "2 changed · 8 note(s) to Ops" counts

**`8 note(s)` is true.** Eight strings in curly braces across the volume —
Mike's own eight carried notes, five on 001 and three on 003. The paste's
footer lists eight and the header counts eight; they agree.

**`2 changed` is true of the words and misleading in what they suggest.** It
counts records whose drawable form differs from `robots.js` — and on a fresh
page it reads **2 before he has typed a character**, because the generator
itself re-inserts his eight notes into 001 and 003 as braces. It says
*changed*; what a reader hears is *changed by me*. Reported, not touched.

---

## D. WHAT WAS SEEN

Served with `npm run record:serve`, driven in Chrome at a 1536 CSS px viewport,
whole frames, nothing cropped. **Typed into it rather than measured at it.**

- Opened cold: **one head**, no rule, no second block. `01`/`02` in the folder.
- Typed the headline to 56 characters: **nothing happened.** No box, no count,
  no colour. `03`.
- Typed on to 65: **`pen to everyone` went to reverse type and the outline went
  solid black.** Model held all 65. `04`.
- Typed the summary past 130: **same mark, same place in the sentence**, and
  both fields stayed marked at once. Model held 145. `05`.
- Walked to 013 and back, pressed COPY EVERYTHING: 7,930 characters, live
  timestamp, `=== NOTES TO OPS (8) ===`, text selected. No warning banner at any
  point.

**One transient capture was discarded rather than delivered.** After a CDP
timeout one frame came back showing about 40% of the page at 2.5× — a clipped
capture, not a zoomed page. It is not in the folder and nothing was measured
off it.

---

## FOUND WHILE LOOKING — RECORD 013 LOSES ALL FOUR OF ITS PARAGRAPHS

**Not part of A/B/C. Not fixed — out of this packet's scope.**

Record 013 opens in the editor with its four section headings and **no
paragraph under any of them**. The text is in `robots-record.js` and on the
live site; it does not reach the editor, and nothing anywhere says so.

**The cause is one branch.** `reveal/record-entries.mjs`, in `draftEntries()`:

```js
const body = bodyNode && bodyNode.type === "ArrayExpression"
  ? bodyNode.elements.map(…)
  : [];                       // ← anything that is not an array becomes nothing
```

013's four bodies are authored as plain concatenated strings, not arrays. Every
other field of 013 — `title`, `line`, `lead`, `tomb` — is also a concatenation
and comes through fine, because `strOf` handles it. Only `body` is gated on the
node being an array.

**It is silent at every level that could have caught it.** Nothing is pushed to
`unreadable`, so the generator prints no warning. `audit()` compares the model
to the page and the model has no paragraphs, so nothing is missing. `edited()`
compares the draft to `SHIPPED` — and `SHIPPED` comes from the same parser, so
both sides are equally empty and 013 reads *unchanged*.

**Scope, measured, not assumed:** 013 only. 001–005 have 11 sections between
them and every body is whole.

**What it would cost.** If Mike wrote in 013 and Ops landed the draft, the four
paragraphs would be emitted empty. It cannot happen today for an unrelated
reason — `record:land --write` already refuses the real file over the comment
guard — which is luck, not a mechanism.

**Not registered in `docs/OPEN_ACTIONS.md`** — that is Ops' register and Mike's
ruling. Named here and in the report so it is not lost.

---

## GATES

| gate | result |
|---|---|
| `npm run lint` | **11 errors / 9 warnings — baseline** |
| `npm run build` | green, 531ms |
| `npm run build:launch` | green, 797ms |
| `npm run provenance:gate` | **PASS** |
| `npm run reveal:build` | green |
| `npm run reveal:check` | **PASS** — 8 checks |
| `npm run assets:orphans` | **0 rows — 0 judged, 0 unjudged** |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** — 0 findings |
| `npm run reveal:day` | nothing to move |

Nothing in `src/` changed, so no provenance rows were needed and none were
added. No lap: the editor is a desktop writing surface and no museum route
moved.

## FILES

```
tools/dictation/preview/entry.jsx        the index flag (default on)
tools/dictation/record-edit.client.js    one view · one node per field · the over mark
tools/dictation/record-edit.css          .wb-lim deleted · ::highlight(wb-over) added
tools/dictation/record-edit.mjs          the readout element and `says` out of the config
docs/dictation-20260807/record.html      regenerated
docs/dictation-20260807/_preview/preview.js   rebuilt (entry.jsx changed)
```

**Mike's own working copy was never touched.** Every test ran against
`http://127.0.0.1:8899`, which is a different storage origin from the `file://`
page. The two test stores were cleared afterwards; `record-draft.json` on disk
is untouched (mtime unchanged, git sees no modification).
