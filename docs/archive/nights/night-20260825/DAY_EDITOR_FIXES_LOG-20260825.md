# THE DAY EDITOR — MIKE'S SEVEN, AFTER USING IT (2026-08-25)

**Scope: `tools/dictation/day.mjs` and the page it generates,
`docs/dictation-20260807/day.html`. Nothing else was touched, and the working
tree proves it — the same four paths as at the start of the round.**

HEAD at start and at end: **`9d50e8d`**. Nothing is committed; the day editor
was still untracked when these seven landed, so they fold into the SAME commit
as the build they correct. `COMMIT_MSG_DAY-20260825.txt` was therefore
**rewritten whole** rather than supplemented — see THE MESSAGE FILE below.

---

## THE SEVEN, AND WHAT EACH ONE COST

### 1. HOVER HINTS EVERYWHERE — every icon and every mark says what it means and what it read

**ONE FUNCTION, TWO LINES, AND NOTHING ON THE PAGE CARRIES A BARE `title`.**
`hint(means, read)` in `day.mjs` is the only thing that writes a `title` on the
server side, and `hint(el, means, read)` in the page's own script is the only
thing that writes one at runtime. Line one is the MEANING and is the same
sentence every time that mark appears on any day; line two is what it READ on
this one.

**THE SPLIT IS THE POINT.** A hint that only describes leaves him deriving the
reading from the glyph; a hint that only reports leaves him deriving the rule
from the reading. `P —` now says *files this Record delivers that are still
behind the stage door… READS 6 files, every one at its public address.*

**THE BUDGET HALVES ARE QUOTED, NOT RETYPED.** `BUDGETS.title.name` /
`.holds` / `.enforcedBy` come from `reveal/record-shape.mjs`, and the section
header's rule is pulled out of that file's `CONSTRAINTS` array by search. A hint
that restated a limit would be a second declaration of it, which is the defect
Doctrine 22 exists to stop.

**MEASURED ON THE SERVED PAGE: 338 marks, 338 two-line hints, 0 bare, 0
single-line — and `document.querySelectorAll('[title]')` returns exactly 338,
so nothing outside the mark set is wearing one either.** The first run of that
probe found one gap and it is worth recording: the `x2` button had its hint
written by `draw()` and therefore had NONE until a picture was open. A mark that
explains itself only after you have used it is the thing this item is about, so
it now carries a static hint in the markup as well.

### 2. ZOOM x2 ON THE VIEWER'S FINAL STEP

**IT IS A SECOND IMAGE, NOT A SCALE, AND THAT IS THE WHOLE DECISION.** The
sources are **1700x2200**; `VIEW_PX` fits them inside 480, so the viewer was
drawing **371x480** — its own natural size, which is what *"it is not enough"*
was measuring. Scaling that up to x2 would show exactly the detail x1 already
showed, at twice the size, and say it was showing more.

So the day's pictures are inlined **twice**, at `VIEW_PX` 480 and `ZOOM_PX`
**960**, and the x2 step swaps the source. **Measured served: x1 = 371x480
natural, x2 = 742x960 natural — `naturalWidth` actually doubles.**

**THE COST WAS MEASURED BEFORE IT WAS SPENT.** Seven pictures at ~45KB of
base64 each against ~20KB at 480; the page goes **795,538 -> 1,418,868 bytes**,
which also carries the flat file list of item 7. **The shelf gets NO second
copy** — 138 tiles would be about eight megabytes to answer a question the light
table already answers — so the viewer **disables x2 for a shelf picture and its
hint says why**, rather than upscaling and calling it a zoom. Verified: clicking
the disabled x2 on a shelf tile leaves it at 185x240.

**AND THE OVERLAY SCROLLS INSIDE ITS OWN BOX.** `#dy-vimg` has no `max-width`,
because a cap is not a zoom. At **390px** the x2 picture is still a true 742px
wide, `#dy-view` scrolls itself, and **page overflow is 0** — idle and while
zoomed.

### 3. SECTIONS ARE HEADER + LINES, AND THAT IS THE TERMINOLOGY

His words, carried into the file as the vocabulary rather than as a note:

> "SECTIONS exist. They start with a HEADER which always fits the constraints
> and displays per the standard recipe. The text following the header is the
> LINES, always formatted the same, indented, etc."

**TWO FUNCTIONS AND NO THIRD PATH.** `headerHtml(s)` and `linesHtml(s)`. Every
section on every day goes through both and there is nowhere else a section can
be drawn from. The data carries `header` / `runs` / `lines` now, not
`label` / `paras`.

**THE LINES ARE MONOSPACE AND `pre-wrap`, ON THE DATA'S OWN EVIDENCE.** Record
004's folder tree hangs `PORTAL.CFG` under `TERMINAL.EXE` at column 26 and 002's
addendum is a file manifest — the same finding that made `RecordEntry.jsx` opt
one paragraph into `pre`. Here it is not an opt-in: **one recipe, every time**,
so the editor cannot show him a shape the section does not have. Indent is a
13px rule down the left of every LINES block, identical on all sixteen.

**THE PARAGRAPHS ARE NOT JOINED.** `body` is a list, each item a run of lines he
wrote as one; joining them into a single flow would be Ops smoothing his writing,
which OPERATIONS §0 VERBATIM forbids in terms. They draw as separate blocks
through the same recipe, and the reading says *"25 lines, in 2 blocks as they
are stored."*

**THE HEADER'S MARK IS A READING, NOT A VERDICT.** Nothing in the tree gates a
section header — `CONSTRAINTS` says `enforcedBy: "nothing — the renderer draws
whatever it is given"` — so the character count lives in the HOVER and no
number is set on the glass beside it. Putting a visible budget there would be
this page inventing a judgement, which its own header forbids. **The one red it
raises is Mike's own ruling**: a header whose LINES are empty is dropped
entirely, header included.

### 4. SHOW THE TEXT, NEVER DESCRIBE IT

Two places were describing content they were holding:

- **The section bodies.** The page printed *"1 paragraph"* where the paragraph
  itself fits. It now prints the paragraph. **16 sections across 5 days, 73
  lines, all drawn.**
- **The plate labels, which reached no surface at all.** Every plate in an
  attachment carries a written label — *"The video link, first page"*, *"Bias
  settings, returned marked"* — and the tile drew a filename while the sentence
  describing the page sat on the floor. It is a caption on the tile now and it
  travels into the viewer.

The locked fields (`wire`, `plates`, `note`) draw their VALUES now too, not just
their names. No entry declares one today; the path exists so that the day one
does, the page shows it rather than announcing it.

### 5. THE DEPOSIT LINE IS OUT

It printed **"no attachments — not a hole. Week one is all deposit."** That is
Ops prose in Mike's own voice on a surface he reads, and reassurance is a
judgement. **The header states the count and stops:** `ATTACHMENTS · 0`, and
nothing follows it. Verified on the page — `/deposit/i` over the whole rendered
body returns false.

### 6. THE LEDGER ROWS PANEL IS OFF, WHOLE

*"Ops bookkeeping on his page; he will never act on it."* The panel is gone, and
**`calledBy`, the `reveal/ledger.json` read and the `LEDGER` constant went with
it** rather than being left computed for nobody. The build's own console line
dropped its ledger-row count and gained the section and line counts instead,
which is what the round now cares about.

### 7. THE FILES PANEL IS THE LIST AND NOTHING ELSE

The note explaining that *"anything that looks like a path gets published"* is
gone and nothing replaced it — Mike has ruled that mechanism a hack being
replaced and its replacement is a later round, so the page does not teach it.

**AND THE PANEL NOW HOLDS THE LIST ITS OWN HEADER NAMES.** It used to show only
the files that were NOT inside an attachment, which on every day that has files
is none of them — so `FILES THIS RECORD NAMES · 6` was drawing a panel with
nothing in it and a paragraph of explanation underneath. It draws all six.

**THAT MADE THE VIEWER'S WALK LIE, AND IT IS FIXED AT THE SAME TIME.** A file
inside an attachment is now on the page twice, so `shots()` **dedupes by public
address**: 12 `img[data-zoom]` in Record 003's DOM, 6 unique addresses, and the
viewer says *"1 of 6"*.

---

## VERIFIED SERVED, WHICH IS THE CONDITION THAT BROKE HERE BEFORE

`http://127.0.0.1:8931/dictation-20260807/day.html` — a mock server was already
up on 8931 and was serving the freshly built file (1,418,868 bytes, byte-for-byte
the file on disk).

- **The viewer opens on a real click and the picture decodes: x1 371x480,
  complete.** The final step gives **742x960**, walking to the next picture keeps
  the step and loads the next 960, x1 comes back to 371x480, Escape and `close`
  both close it.
- **One network request for the whole page — the HTML, 200.** Nothing else is
  fetched, which is the proof that no path is resolved anywhere: the x2 images
  are inline like everything else, so the page renders identically served and
  double-clicked.
- **0 console errors. 0 broken tiles. Page overflow 0 at desktop and at 390px.**

**WHAT I COULD NOT DO AND DID NOT PRETEND TO:** the first three screenshot
attempts failed — *"the Browser pane is not displayed, so the page is not
compositing frames"*, the same family as §8's rAF hazard. Everything above was
measured through the DOM first; the pane came back and the shape, the captions,
the x2 step and the pressed state were then confirmed by eye as well.

## THE MUSEUM LAP WAS NOT RUN, AND HERE IS THE REASON

`npm run lap` copies a harness into `public/` and needs a build and `wrangler
dev` to lap MUSEUM routes. **Nothing in `src/`, `public/` or any data file
changed this round** — the only surface that moved is an Ops page under `docs/`,
which the lap rig does not serve. The measurements the lap exists to take
(overflow, broken images, console errors, at 390px and desktop) were taken
directly on the page that changed, over http. `lap:clean` was run anyway;
`public/_lap.html` is absent.

## FLAGGED, NOT FIXED

**`STAGE_PREFIX` IS IMPORTED BY `day.mjs` AND USED BY NOTHING.** It was already
dead before this round — the door state is read off the asset table's literal
`public/held/` prefix — and it is left alone because this round's instruction is
that nothing else changes. One line whenever anyone is next in the file.

## GATES

| gate | result |
|---|---|
| `npm run lint` | 17 problems (**9 errors / 8 warnings**) — exactly baseline, zero new |
| `npm run build` | green, built in 2.10s |
| `npm run provenance:gate` | **PASS**, exit 0 |
| `npm run reveal:check` | exit 0 |
| `npm run parity:gate` | 4 shared · **0 divergences** |
| `npm run instory:gate` | **PASS** — 21 strings read, 0 findings |
| `npm run docs:numbers:gate` | **PASS** — 11 claims in 8 documents |
| `npm run arc:check` | **PASS** — published headlines match the tree |
| `npm run ops:size` | **PASS** — OPERATIONS.md 33,972 of 40,000 |
| `npm run reveal:day` | *"Nothing to move. The tree and the Record agree."* |
| `npm run lap:clean` | nothing left in `public/` |
| `git status --short` | the same four paths as at the start |

## THE MESSAGE FILE

`C:\AI\_night-20260825\COMMIT_MSG_DAY-20260825.txt` is **rewritten whole**, not
appended to. The day editor is still untracked, so there is one commit and it
covers the build and these seven together; a message describing paragraph counts
and a ledger panel would describe a tree that does not exist. §8's own lesson is
that a pushed message cannot be rewritten, and this one has not been pushed yet —
which is exactly when it is free to be correct.
