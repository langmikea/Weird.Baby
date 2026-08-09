# THE RECORD EDITOR — round log, 2026-08-09 (E1–E5)

Five instructions, all five done. Nothing was deployed.

**Gates:** lint **11 errors / 9 warnings = baseline** · build green · **launch
build green** · provenance **PASS** (13 stale rows pruned, 0 chains broken, 0
rows changed) · `reveal:check` **PASS** · `parity:gate` **PASS, 4 shared · 0
divergences** · `instory:gate` **PASS** · `assets:orphans` **0 judged, 0
unjudged** · `reveal:day` **nothing to move** · **the lap RAN at 390px and
1216px** on five museum routes and on the new editor page — page overflow 0,
painting past the edge 0 on the editor, broken images 0, console errors 0,
`[data-not-ux]` blocks on the Record **0** · `lap:clean` done.

---

## 0. WHAT IS WAITING ON MIKE

**Open `docs/dictation-20260807/record.html`.** It is the Record itself, and
every part of it is editable where it sits. **Your eight notes from Records 001
and 003 are in it**, in braces, in the exact places you wrote them.

Two of them are questions with answers, and the answers are not on the glass any
more because you struck that arrangement:

- *"(need name of device)"* — **the first four devices have no names.** What
  exists is the personas (CEO, Informer, Gambler, Everyman) and the unit numbers
  (-02, -07, -09). Whether the personas ARE the four units, or the units carry
  their own names, is unruled and is yours. Register **E-a**.
- *"Get me some examples from the manual"* (three times) — **the manual is 61
  pages of structure and every position reads `[ TEXT REQUIRED ]`.** There are no
  examples yet. Ops is writing it; you review and edit.
- *"Give me a list of the most common words Robots expects to use"* — from the
  firmware and the twin's own screens: PORTAL, FEED, LATCH, ARM, BOOT, POST,
  BIST, SEG, CHECKSUM, ACK, SYN, AUX LINK, MEM TEST, VIDEO, NOMINAL, LISTENING,
  ERROR, READY, STANDBY, SANDBOX.

And one thing changed on the glass that you should see rather than be told:
**two of your own sentences in Record 001 now end in a colon with nothing after
them** — the lines that introduced the ASCII snippets and the frequent strings.
The paragraphs that followed them were your notes, and they have gone to your
working copy. That is the true state of the report (the examples do not exist
yet) and inventing three lines to close a colon is the one thing Ops will not
do. Register **E-b**.

Nothing else in this round needs you.

---

## 1. E1 — HE EDITS THE RECORD ITSELF

> *"the two-column worksheet is retired as his writing surface. HE EDITS THE
> RECORD ITSELF, DIRECTLY — every part of it… He must feel he is IN THE REAL
> THING as much as feasible… Ops does not care how the illusion is achieved; it
> must be live, it must be the Record, and there must still be a COPY BUTTON."*

**There is no editor widget on the page.** `docs/dictation-20260807/record.html`
draws the museum's own `RecordEntry` and `RecordIndexRow` — the same modules
`/robots` renders, against the same stylesheets, through the same preview bundle
the D round built — and then makes the museum's own paragraphs
`contenteditable`. What he types into IS
`<p class="vp-rec-sect-body">`. There is no mirrored copy of the text anywhere on
the page and nothing is re-implemented.

**THE FIDELITY IS MEASURED AGAINST THE LIVE PAGE, NOT ASSERTED.** At 390px the
museum's `/robots/record` and the editor both compute `.vp-flat` **344.56px** and
a body of **15.3408px**; at the operator's own width both give **838.66px** and
**15.4031px**, which are the D round's recorded numbers for the live page. The
editor's own stylesheet may not change the size or position of anything the
museum draws — every control is `position: fixed`, every decoration is an
absolutely-positioned `::after`, and the only box-model property applied to a
museum element is `outline`, which does not participate in layout.

**The page is built FROM `tools/dictation/preview/frame.html`, read rather than
copied.** That file holds the ancestor chain — the eleven elements `Exhibit.jsx`
puts above an entry — which the fidelity note calls *the one part of the preview
that is a copy and can therefore drift*. A second hand-written copy on this page
would be a second thing that could drift, so the generator cuts the frame's own
script out and injects the editor in its place, and **fails by name if the
anchors move**.

**Fields are found by CLASS, not by a prop**, so two shipped components gained
nothing for an Ops tool. The classes used are the ones `Exhibit.css` already
targets. What a rename could still do is make a field quietly uneditable, so
`audit()` checks after every render that every field the model holds found a
node, and puts a red banner on the page if one did not.

**Every part is editable:** the index row's headline and summary, the entry's
headline, the lead, every section heading, every paragraph, the tombstone, plus
the record number and date in the bar. Enter splits a paragraph, Backspace at the
start merges it back, `+` buttons open the four slots that do not render when
empty, `+ NEW` starts a record numbered and dated off the one epoch. Live
character counts on the two budgeted fields come from `reveal/record-shape.mjs` —
imported, never retyped — and **warn without blocking**; there is no `maxlength`
on the page.

**COPY EVERYTHING** hands back the whole volume as plain text: every record, every
field, a `*` on anything that differs from what `robots.js` ships today, and every
brace note collected again at the foot. **It reads the clipboard back** and never
says *copied* on a write it has not verified (OPERATIONS §8). **Save to the repo**
writes `docs/dictation-20260807/record-draft.json` through `showSaveFilePicker`
with the handle remembered in IndexedDB — and **falls back to a download that says
where it went**, which was proved by removing the picker.

---

## 2. E2 — NOTES TO OPS LIVE IN CURLY BRACES

Anything inside `{ }` is a note to Ops. In the editor it is painted amber with the
Custom Highlight API — **ranges, not `<span>`s**, so the DOM he is typing in is
never touched by the thing highlighting it; a browser without the API simply does
not tint them and everything else still works.

**TWO GATES, AND BOTH WERE PROVED BY BREAKING THEM.** A brace note was injected
into Record 001 and each gate named it and the line:

| gate | when | what it reads |
|---|---|---|
| `npm run reveal:check` | **every packet** | every string in the Record, `+` concatenations folded |
| `wb-ops-braces` (vite) | **every launch build** | every string literal under `src/`, off the parsed source |

The launch gate reads the SOURCE and not the bundle, and that is forced rather
than chosen: the mark it replaces (`[MIKE-NOTE]`) was a string nothing else in a
JavaScript bundle could produce, and a curly brace is what compiled JavaScript is
made of. What that costs is stated in the code: a note reaching a visitor-facing
string by some other path is not seen there, which is why the packet gate walks
the Record itself. **Measured: `src/` holds 0 string literals containing `{…}`**,
so the gate has no exception list.

**THE RED/BLUE INLINE ANSWERS ARE RETIRED, AND DELETED RATHER THAN LEFT
DORMANT** — *"that was Ops answering in the wrong place."* Gone: the
`SectionBody` branch in `RecordEntry.jsx`, `DEV_MARK`/`devMark`/`devBody` in
`visitor-prose.js`, four rules in `src/index.css`, the DEV_MARK half of
`wb-ops-notes`, and `wb-dev-mark-guard` whole. `[PAPA]` is untouched: it is a
different mechanism for a different thing.

**HIS EIGHT NOTES LEFT `robots.js` WHOLE AND VERBATIM** — not cut at a
parenthesis, not split into a story half and a note half, not reworded — and are
carried into the editor's seed in braces, at the exact paragraph they followed.
The carry is keyed on that paragraph's text rather than on an index, and a key
that stops matching is REPORTED and the note appended rather than dropped.
Ops' three answers are on the glass nowhere; they are quoted in §0 above and the
one that is his to rule on is register **E-a**.

---

## 3. E3/E4 — WHAT MOVED OUT OF THE OLD FORM, AND WHAT DID NOT

`npm run record:report` prints it slot by slot. **Eleven of the thirteen answered
slots are already in the Record, character for character**; the two that are not
are `W1.D1.NOTES` and `W1.D3.NOTES`, and the only lines of them not in the Record
are **exactly the eight notes** this round moved to his working copy. A
fourteenth answer, `W1.SUM`, belongs to no Record field — it is the week's own
headline and has been on `arc.html` since the R round, carried there by that
page's own CARRY.

**E4's changes are not on disk, and that is measured rather than assumed.**
`answers.json` and the 2026-08-09 rescue dump are byte-identical to each other,
and `emit-record-entries --verify` showed every box round-tripping into what was
landed. `answers.json`'s `saved` stamp of 15:46Z is `rescue-import.mjs` writing
it, not a press of Save to the repo. **So anything he typed after the last export
lives in one place: his browser.**

That is why the migration runs TWICE. The generator folds `answers.json` into the
seed at build time; the page reads
`localStorage["wb.worksheet.2026-08-07"]` at open time — on a `file://` page every
local file shares one storage origin, so the editor can see what the worksheet
wrote **in his browser**, and it travels across without him doing anything.

**ONLY INTO BLANK RECORDS.** A field with any character in it is never
overwritten; sections move only into an entry that has no sections at all,
because merging a half-written body with a half-written box is a decision no tool
should make. Everything that moves and everything that is left is printed on the
page in a banner, named slot by slot.

**The two-column worksheet is retired.** `buildWorksheet()` and its five helpers
are deleted from `tools/dictation/worksheet.mjs` (−16 KB); `prep.mjs` prunes the
emitted `worksheet.html` by name, because a generator that stops writing a file
does not unwrite it; `arc.html`, `reference.html`, `index.html` and the Ops desk
now point at `record.html`. The weekday guard that lived inside the retired
builder — *a day headline written for a named weekday must not print on a
Wednesday* — was **exported and moved to the top of the run**, because a gate
belongs there rather than inside one builder that might be the next thing deleted.

---

## 4. E5 — THE ROUND TRIP, PROVED

Written into **every one of the 36 fields** of Record 001 through the real editing
path (focus, select, `insertText` — genuine `input` events), each with a brace
note in it, then the real COPY button pressed:

| | |
|---|---|
| fields written | **36 of 36** |
| model mismatches after writing | **0** |
| written strings absent from the paste | **0** |
| notes in the header vs in the list | **39 and 39** |
| records in the paste | **6 of 6** |
| survived a reload from the store | **yes** |
| `record:land --verify` on the saved draft | **78 of 78 strings round-trip** |

`Save to the repo` (with the picker removed, to force the fallback) wrote a real
`record-draft.json`; `npm run record:land` read it back, **refused to emit while
39 notes were still in it — quoting each one** — and emitted Record 002 as source
identical in shape to what `robots.js` holds, double spaces and all.

---

## 5. FIVE DEFECTS THE PROOF FOUND, AND FOUR OF THEM WERE INVISIBLE

**1. `innerText` RETURNS WHAT CSS DISPLAYS, NOT WHAT HE TYPED.**
`.vp-rec-sect-label` is `text-transform: uppercase`, so a heading typed *Detailed
report* came back **DETAILED REPORT** and would have travelled into `robots.js` as
an edit of his words that nobody made. Invisible on the glass, because the glass
upper-cases it either way — which is exactly why the case of his labels has always
been his free choice. `textContent` is the fix, with `<br>` mapped to a newline
explicitly. **Only writing into every field and comparing could have caught it.**

**2. `requestAnimationFrame` DOES NOT FIRE IN A TAB THAT IS NOT BEING PAINTED.**
The wiring waited on a frame; loaded in a background frame the editor drew its
entry perfectly and **never made a single field editable**, with no error
anywhere. Found by the 390px lap, which runs in exactly that condition. It is a
timeout now: correctness must not depend on the page being looked at.

**3. THE CARET GUARD DEADLOCKED THE PAGE.** A boolean set on `focusin` and cleared
on `focusout` stayed true forever, because `focusPath()` focuses a node and a
later render REPLACES it — and a removed element fires no `focusout`. Three
buttons appeared to do nothing while the model behind them updated perfectly. It
is a question now (`document.activeElement`) rather than a flag, because the
browser's answer cannot get stuck.

**4. `+ lead` WAS A BUTTON THAT DID NOTHING**, because *is there anything written
here* and *does this field exist* were the same test and a just-opened slot holds
one space.

**5. A NOTE IN A SECTION HEADING WAS NOT LISTED AT THE FOOT.** The collector
walked the four top-level fields and every paragraph and missed the labels — three
short of the count in its own header, which is how it was found: **the header
counts every string and the list did not.**

---

## 6. WHAT WAS NOT DONE

- **Nothing was deployed.** The packet is sealed; the hand-off is one command.
- **No entry was landed from the draft.** The eight notes are his to act on
  first, and `record:land` refuses while any brace is in the file.
- **`record-draft.json` is not in the tree.** It does not exist until he presses
  Save, and `record:land` says exactly that when it is absent.
