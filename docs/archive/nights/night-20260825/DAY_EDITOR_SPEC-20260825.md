# THE DAY EDITOR — specification

**2026-08-25 · written outside both repositories · nothing was built.**
Museum HEAD `9d50e8d`, robots `0f3acf5`, both clean.

---

## WHAT NEEDS YOUR WORD

Read the shape and tell Ops what is wrong with it. Four things are genuinely
open and everything else is Ops':

1. **THE PANEL LAYOUT** — §6. The day is the main event; the calendar and the
   picker are panels beside it. Whether they sit left, right, or one of each is
   a look, and looks are yours.
2. **THE TOP BAR — WHICH SIX** — §3 lists eleven facts that already exist and
   could carry an icon. Six fit a bar without becoming wallpaper. Which six.
3. **THE THUMBNAIL TREATMENT** — §4. The measurement kills the crop. Contrast
   stretch and a bigger tile both work; both change what a page LOOKS like,
   which is yours.
4. **WHAT DIES** — §9. `record.html` folds in and stops existing. Doctrine 24
   says once a thing is gone you never meet it again, so that is your word and
   not Ops'.

**Nothing in this document is built. Nothing is committed. The site is frozen
until Sunday and none of this touches it.**

---

## SED — SAME EXCEPT DATA

**One shape, many instances, differing only in what fills it.**

Ruled by Mike 2026-08-25. **The tree has never carried this definition** — the
six existing uses of "SED" all name a different, narrower ruling about the
calendar (*"build for everyday drops, drop on the days you choose"*). This is
the general form, and it is written down here first because the next project
inherits it.

It is the standing constraint stated forward:

> **"Don't build me a standalone turd; for god's sake at least put them all in
> one pile!"**

and its test: **the second instance is the test of the first.** If adding a
second project means writing a component, the first one was built wrong.

**EVERY SECTION BELOW IS MARKED `[SHAPE]` OR `[WEIRD.BABY]`.** `[SHAPE]` is the
editor any project gets. `[WEIRD.BABY]` is what this project fills it with. A
project that adopts this brings its own vocabulary and gets the editor.

---

## WHY IT EXISTS — THE FINDING

**Nothing shows one day whole.** Every surface shows one facet across five days,
or five days across one facet:

| surface | what it shows about a single day |
|---|---|
| `record.html` | the entry's prose, and **five field kinds** are editable |
| `assign.html` | number, weekday, date, headline, and attachments being built |
| `arc.html` | the *week's* headline. Nothing per day |
| the workbook | everything he types, and nothing the tree knows |
| `artifacts.html` | assets, with a Record's name attached to some |
| `eggs.html` | eggs, grouped by egg |
| the desk | fourteen links |

**The day editor shows a day whole, in the same shape every day.** That
sentence is the whole specification; the rest is what "whole" contains.

---

# 1 · THE DAY, WHOLE

## 1.1 What a day is `[SHAPE]`

A day is **one entry, plus everything in the building that points at it.** Four
groups, and today they live in four files that never meet on one page.

**"Edit in place" is a wider surface than a re-layout of `record.html`.**
Measured: that page pushes exactly five field kinds — `title`, `line`, `lead`,
`sect.N.label`, `sect.N.body.K`, `tomb`. It has **zero** push-sites for `docs`,
`still`, `stillCaption`, `date` or `no`. Attachments, the date and the number
have never been editable anywhere but Excel.

## 1.2 THE ENTRY `[SHAPE]` — its fields are `[WEIRD.BABY]`

A field must be in **both** `DRAWN_ENTRY_FIELDS` (does anything render it) and
`READ_ENTRY_FIELDS` (can the writing surface hand it back). The two lists are
deliberately not merged, and the day editor must respect both.

| field | required | authored by | editable here | absent looks like |
|---|---|---|---|---|
| `no` | **yes** | Ops | **shown, not edited** | nothing can mint one; the ledger hard-exits |
| `date` | no | Ops, from the epoch | **editable** — new | renders, cannot band by month |
| `title` | **yes** | **you** | editable | no headline on the index row — 004 and 005 shipped like this |
| `line` | no | you | editable | **`lead \|\| line`**, so an entry with neither prints no deck *and* no lead |
| `lead` | no | you | editable | falls back to `line` |
| `tomb` | no | you | editable | nothing drawn |
| `sections[]` | no | **you** | editable | **a label whose body empties is dropped entirely, label included** |
| `docs[]` | no | title yours, wiring Ops' | **editable** — new | a doc with no plates prints **"not here yet"** |
| `still` / `stillCaption` | no | you | **editable** — new | no hero image |
| `note` · `wire[]` · `plates[]` | no | you | **shown, locked** — see below | — |
| `evidence` | no | you | **not shown** | struck by you; field kept, drawn by nothing |

**`wire` and `plates` are shown and locked, and that is a defect being contained
rather than a design choice.** Both render on the glass and **neither survives
the draft round-trip** — `draftEntries` reports them by name because *"an entry
declaring one would render on the glass and vanish from the editor: Mike would
open a record that was missing something, with nothing said."* Until that is
fixed the editor must **display them and refuse to edit them**, with the reason
on the field. Silently offering a field that eats its own content is the exact
failure Record 013 already paid for.

**Live budgets on the fields that have them `[SHAPE]`.** `title` 62, `line` 130,
declared once in `reveal/record-shape.mjs` and read by the gate, the page and the
docs. Doctrine 22 governs: **warn, never block; count what would be SAVED, not
the raw field; say where there is NO limit; the warning travels into the paste.**
Today Record 002's deck sits at **128 of 130** — one edit from failing
`reveal:check`, and nothing shows him that.

## 1.3 THE ATTACHMENTS `[SHAPE]`

An attachment is `{ title, files[] }` — **a name and the set of pages that were
filmed together.** It carries no `source` and no `pages`: the register files both
as Ops wiring, and `pages` counts PAGES rather than FILES, which is not the same
number when one leaf is filmed into two scans.

**They are created the way `assign.html` now creates them: files first, then the
name closes the set.** That ordering is not a preference. On 2026-08-20 you
struck two attachment titles that had landed with no files —

> **"the Record may withhold and the Record may not promise."**

A title with no files is a promise. The order of operations is what makes that
impossible rather than forbidden, and the day editor inherits it whole.

**Order is real inside a set** — plates render in array order — and is captured.
**Order across sets never meant anything** and is not.

## 1.4 THE FILES, AND WHICH SIDE OF THE DOOR `[SHAPE]` / door names `[WEIRD.BABY]`

An entry's asset list is **derived, not typed**: `parseRecord` scrapes every
path-shaped string anywhere under the entry (`/^\/[\w\-./]+\.\w{2,5}$/`). The day
editor never asks for it and never writes it.

Per file, shown: **its thumbnail · its name · public or behind the door · on disk
or not.** Today 003 names six files and 004 one; the other three name none.

`[WEIRD.BABY]` The two doors are **permission** (`/assets/locked/`, refused in
every stage) and **stage** (`/assets/held/`, opens in development). They must
never share a list. A generic project has one notion — *published yet or not* —
and that is the `[SHAPE]` half.

## 1.5 THE LEDGER ROWS THAT NAME IT `[WEIRD.BABY]` — the back-link is `[SHAPE]`

**`calledBy` is the only structural day↔thing link in the tree.** Four rows carry
one: `doc.manual.page.32 / 33 / 34 / 47 → ["record.003"]`. Every other record has
zero.

**And the link is incomplete in a way worth seeing on the page: QC_101 has no
ledger row at all.** Record 004's attachment is in the Record and in the asset
table and not in the ledger. The day editor showing "rows that name this day: 0"
beside an entry that has an attachment is how that gets noticed.

`prod` — `needed | printed | photographed | placed` — is a real per-thing
production ladder. **Four rows use it and all four say `placed`. Three of the
four stages have never been used.** It is the closest thing the tree has to a
generic *how far along is this*, which is why §7 names it as a seam candidate.

## 1.6 PROVENANCE `[WEIRD.BABY]` — the idea is `[SHAPE]`

49 register rows sit on the Record file: **34 MIKE · 13 HOUSE · 2 VERIFIED**.

**They are keyed on FILE + LINE, not on record number**, so a per-day count is
derivable from the entry's line span but is not directly queryable. That is the
one fact in this whole document that needs work rather than a read, and §8 puts
it late for that reason.

---

# 2 · MISSING, AND MISSING-BUT-NOT-REQUIRED

You named these separately and they are different states. **A third state is
needed to keep them honest, and it is the one that does the work.**

> **"the shape itself communicates any holes, deficiencies, opportunities"**

Three states, and only facts that exist today:

## 2.1 DEFECT — it is wrong and something already refuses it `[SHAPE]`

Every one of these is enforced by a gate that exists. The day editor is not
adding judgement; it is **showing him what a gate will say before he has to run
the gate.**

| shown when | why it is a defect |
|---|---|
| `title` over 62 or `line` over 130 | `reveal:check` refuses the packet |
| an unresolved `{brace}` anywhere in the entry | `reveal:check` refuses it, and the launch build refuses it again |
| a section whose body is empty | your own ruling — the label is dropped entirely and silently |
| an attachment with no files | Ruling 9. It draws **"not here yet"** on the glass |
| a named file not on disk | the build fails in both directions |
| an entry with neither `lead` nor `line` | prints no deck and no lead |

## 2.2 OPPORTUNITY — nothing is wrong and something is available `[SHAPE]`

Not a hole. A thing he could spend if he wanted to.

- **headroom** — 27 characters left on the headline, 2 on the deck.
- **files on the shelf this entry could carry** — 138 today, none of them owed.
- **a shared headline** — 002 and 004 both read `GENERAL STATUS UPDATE`. Your
  own ruling that a differing headline is *"the cheapest signal a Record has"*
  makes that visible rather than wrong.
- **fields never once used** — `lead`, `tomb`, `still` have been available for
  every entry and used by none.

## 2.3 ABSENCE THAT IS FINE — missing but not required `[SHAPE]`

**This is the state the editor exists to draw, and getting it wrong is what
makes a tool nag.**

> **001 having no attachments is not a hole — it is a deposit day.**

`ARC.md` says so in its own words: *"Week 1 is all deposit."* An editor that
badges 001 as incomplete is wrong about the story, and it will be ignored
within a week.

**The rule: a field is only MISSING if something requires it. Everything else
is BLANK, and blank prints as blank.** `no` and `title` are required. Nothing
else is. That is four required things across the whole model and it should stay
that way — *empty and honest beats populated and false*.

**How the editor tells the two apart without inventing a rule:** it does not.
It shows **what is there and what is available**, and only a real gate produces
a red mark. An absence with no gate behind it gets no mark at all.

**What it may NOT do:** score a day, rank days against each other, or compute a
percentage complete. There is no definition of a complete day in the tree and
inventing one would be Doctrine 12 with a progress bar on it.

---

# 3 · THE TOP BAR

Icons for characteristics, **from §5 of the survey only — every one is a fact
that exists today.** Nothing here is invented and nothing needs a new field.

**Eleven candidates. A bar holds about six before it becomes wallpaper — the
143 green READY badges taught that once. Which six is yours.** `[SHAPE]` for the
mechanism, `[WEIRD.BABY]` for the last two.

| icon reads | the fact behind it | source |
|---|---|---|
| **headline** | present / absent, and characters against 62 | the entry |
| **deck** | present / absent, characters against 130 — **red at 128/130 today** | the entry |
| **sections** | count, and whether any body is empty | the entry |
| **attachments** | count, and whether any has no files | `docs[]` |
| **files** | count, and how many sit behind the door | `delivered()` + `placeRule` |
| **notes open** | unresolved `{braces}` — the entry cannot ship | `reveal:check`'s own test |
| **on disk** | every named file exists | the asset table |
| **published** | the date is past, today, or ahead | `date` vs the clock |
| **ledgered** `[WEIRD.BABY]` | rows whose `calledBy` names this day — **003: 4, everyone else: 0** | the ledger |
| **judged** `[WEIRD.BABY]` | the named files' `verdict` — **null on all 475** | the asset table |
| **provenance** `[WEIRD.BABY]` | MIKE / HOUSE / VERIFIED on this day's strings | the register (needs §8's late piece) |

**Two rules for the bar `[SHAPE]`:**

- **An icon says a STATE, never an instruction.** *"Tells me what you need, not
  what I am to do."* It reads `3 files` or `deck 128/130`, never `NEEDS A COPY`.
- **A count of zero on an optional thing is not red.** 001 shows `attachments 0`
  in the same ink as everything else. Only §2.1's list goes red.

---

# 4 · THUMBNAILS

## 4.1 The measurement kills the crop `[SHAPE]`

The manual pages are **61 files, every one 2040 × 2640** — US Letter at 240 dpi
exactly, aspect 0.7727, **1.59–2.13 MB each**.

**They are FAINT, not small.** Mean luminance **246–250 of 255**. Per page,
**91–97% of all pixels sit in the brightest band (224–255)**. On page-31, **242
of 264 sampled rows carry no ink at all.**

**A crop to the inked region buys almost nothing** — ink is sparse but spread to
the margins by page numbers, headers and rules:

| page | ink (<200) | ink bbox as % of page | zoom a crop buys |
|---|---|---|---|
| page-01 | 1.6% | 88% | **×1.00** |
| page-07 | 1.8% | 92% | ×1.08 |
| page-11 | 0.7% | 85% | ×1.05 |
| page-31 | 0.3% | **61%** | **×1.24** |
| page-47 | 0.7% | 89% | ×1.13 |
| page-60 | 1.4% | 62% | ×1.23 |

`sharp.trim()` is worse — at threshold 18 it returns 98.4–99.7% of the page,
because the scans carry edge noise. And no single band is representative: the
densest contiguous 25% band holds only **34–51%** of a page's ink.

**So framing is not the problem and a crop is not the answer.**

## 4.2 What the numbers do support `[SHAPE]`

**(a) A CONTRAST STRETCH — the primary fix.** The ink occupies a narrow band
just under white. Mapping the used range to full black-to-white is exactly the
operation the data asks for, it needs no per-page decision, and `sharp` already
does it (`.normalise()`, or a linear map with the levels taken from the page's
own stats). **The engine is already in the tree** — `thumbnails()` in
`lighttable.mjs` — so this is one pipeline stage, not a new tool.

**(b) A LARGER THUMBNAIL.** `THUMB_PX = 240`. That is **8.5% of the source's
2640** and renders 185 × 240. Doubling to 480 costs cache size and nothing else;
the cache is keyed `sha256@px` so both sizes can coexist and the old entries stay
valid. **545 thumbnails are cached today and all 78 image rows on the shelf have
one**, so a re-render is a one-time cost, not a per-open one.

**(c) A DENSEST-CLUSTER crop, if (a) and (b) are not enough.** The bbox fails
because outliers at the margins stretch it; the densest region does not have that
problem. **Ops has not measured this** and will not claim it works.

**What is NOT supported by any number here: cropping to the ink bounding box.**
It buys ×1.00 on the first page tested.

## 4.3 `[4a]` "This file could not be loaded. There is nothing to look at."

**Established, and it is neither faintness nor a missing file.**

Two different mechanisms draw a picture on that page, and they disagree about
where the page is:

- **The tile** is an inline base64 data-URI, baked into the HTML. It **always
  renders**, however the page is opened.
- **The viewer**, on click, loads the **full-size file by RELATIVE path** —
  `diskHref` returns `../../public/held/robots/manual/page-01.png`, resolved
  against wherever the page happens to be sitting.

**So there is a whole class of page-state where every tile shows a picture and
every click fails.** That is precisely what you described.

**Measured today, both ways:**

| how the page is open | result |
|---|---|
| double-clicked from `docs/dictation-20260807/` (`file://`) | **all 138 files present.** The viewer works |
| served over HTTP by `npm run mock` | **404. Measured.** The server's root is `docs/`, so `../../public/…` resolves outside it and is refused |

**The trap is structural and it points at Ops, not at you.** OPERATIONS §8 says
Ops cannot see `file://` and must serve every mock — **so the way Ops is
required to look is the way that breaks, and the way you open it is the way that
works.** Ops has been looking at a copy where every click fails and reading that
as normal.

**What Ops could not establish: which one you were looking at.** No downloaded
copy of the page exists in Downloads or on the Desktop, so if it was a `file://`
open there is a third cause not yet found. **One word from you — served URL or
double-click — settles it.**

**The fix belongs in the spec because a day editor makes it worse:** the day
editor shows files constantly, and a viewer that works in one location and not
another cannot be trusted by either of you. **The day editor's viewer must not
use a path relative to the page.** Either it inlines a mid-size preview the way
tiles are inlined, or it is served by a small local server that knows the repo
root. `record-serve.mjs` already is that server, for a different page.

---

# 5 · POP FROM PAGE TO PAGE · SEE ALL PAGES AT ONCE

> **"pop from page to page, see all the pages with a click with the same summary
> completeness"**

Two features, both `[SHAPE]`.

## 5.1 POP

**Within a day**, the arrow keys step the viewer through that day's files in
order. **This already exists** — `assign.html`'s viewer has `‹ ›`, arrow keys,
zoom and fit, and steps through `figure.as-card[data-src]` in DOM order. What it
lacks is a set: it steps the whole shelf.

**The day editor's viewer steps the DAY's files**, and then **the day's
neighbours** — the last file of Monday is one press from the first of Tuesday.
That is the "pop" that a five-days-across-one-facet surface cannot do.

**Between days**, the same key pair moves the whole editor: Record 003 → 004,
with the panels holding their state.

## 5.2 ALL PAGES AT ONCE, WITH THE SAME SUMMARY COMPLETENESS

**"The same summary completeness" is the load-bearing half**, and it is what
makes this a view rather than a contact sheet. The overview is **the top bar of
every day, stacked** — the same icons, the same order, the same meanings, one
row per day. Nothing is summarised differently at the overview than in the day.

**That is the SED test applied to the editor's own two views:** the row is the
bar, the bar is the row. If the overview needed its own summary logic, the day
view's bar was built wrong.

**And it is what makes "the shape communicates the holes" true rather than
aspirational** — eleven days side by side, one column of icons each, and a
column that is empty everywhere except Wednesday is a fact about the week that
no current surface can show.

---

# 6 · THE PANELS

**The day is the main event. `[SHAPE]`**

Three regions. The day fills the middle and is never collapsed.

**THE CALENDAR** — every day that has an entry, in date order, each carrying its
top-bar row (§5.2). It is the overview and the navigation in one object, which
is why it is not a separate page.

`[WEIRD.BABY]` It shows **which days have no entry, without marking them wrong**
— your SED calendar ruling: `recordDay(n)` is `epoch + (n − 1)`, no weekend
logic, no holiday table, and **which days get a Record is decided by which
entries exist**. A gap is you not writing, and *"a gap in the numbers is not a
defect and must never be fixed."*

**THE PICKER** — the shelf, as it is now: sections, thumbnails, the viewer, the
add/remove control. It feeds the day's attachments.

**Both panels expand and collapse. The day does not.** When both are collapsed
the editor is one day, full width, and nothing else — which is the state for
writing rather than assembling.

**No frills or glamour.** The existing Ops pages are the visual reference: one
face, thin rules, gold only for a state that means something. Doctrine 25
governs the copy — **nothing above the work**; what needs explaining goes on the
field, in the footer, or on the reference page.

**One rule the expanders must obey `[SHAPE]`:** Doctrine 19 — opening or closing
a panel moves what is beneath it, and **the persistent part stays exactly as it
is**. `scrollbar-gutter: stable` is already in `src/index.css` for this reason,
and there is a harness that tests it.

---

# 7 · THE SEAM

**It is already drawn, and that is the strongest argument that this generalises.**
Everything pinning the machinery to Weird.Baby is an exported constant in three
files — not scattered assumptions:

```
reveal/record-entries.mjs   RECORD_SOURCE = "src/data/artists/robots-record.js"
                            RECORD_ENTRIES_EXPORT = "RECORD_ENTRIES"
                            RECORD_TRACK_ID = "record"
reveal/placement.mjs        GOVERNED_PREFIX = "/robots/"   STAGE_PREFIX = "/held"
src/data/artists/record-epoch.js   RECORD_EPOCH = "2026-08-31"
```

**`[SHAPE]` — what any project gets**

A dated log of entries, each *date · label · headline · deck · sections · ordered
attachments · one hero image*. Budgets declared once and shown **where the string
is written**. A draft file a lander reads. A lander that splices unchanged
entries byte-for-byte and refuses to regenerate a commented one. Guards that
nothing vanishes and nothing stale lands. A shelf with thumbnails. The
already-delivered check. **Empty is a state, not an absence.** And Ruling 9 —
**never let a label exist without its payload** — which is the general form of
what this whole surface is built on.

**`[WEIRD.BABY]` — what this project fills it with**

The field *names* (`tomb`, `still`, `wire`, `plates`, `docs`, `evidence`) · the
shelf's eight section labels · the two doors · the transfer classes and arrival
weeks · the twelve-week arc and the promises ledger · eggs · the obfuscation law
· the provenance classes · the in-story rule · ruling 12's *filmed together*.

**Where the seam actually cuts, and it is finer than it looks.** Two things
filed as Weird.Baby's are structurally general and only *named* locally:

- **`docState()`'s three states** — `imaged` / `quoted` / `held` — is the generic
  *what has arrived of this thing so far*.
- **The `prod` ladder** — `needed | printed | photographed | placed` — is the
  same idea one layer down, and **three of its four stages have never been
  used.**

**If the day editor generalises anything beyond layout, those two are the
candidates**, and both are already declared in one place. A project that adopts
this brings its own vocabulary and gets the editor.

---

# 8 · BUILD ORDER

**Optimised pieces. Each one is worth having alone, and none blocks the site.**

### PIECE 1 — THE DAY VIEW, READ-ONLY

Everything in §1, drawn, editing nothing. **First because it is the finding:**
nothing shows a day whole, and this shows a day whole. It needs no new data, no
new field and no writer — every fact is already computable.

**It is also the honest way to find out whether the shape is right** before
anything can be typed into it. You react to it, Ops fixes it, and nothing had to
be unbuilt.

### PIECE 2 — THE TOP BAR AND THE CALENDAR

§3 and §5.2, from Piece 1's own facts. **The bar and the calendar row are one
piece of code by construction** (§5.2), so they are one piece of work. This is
the half that makes the shape communicate the holes.

### PIECE 3 — THE THUMBNAIL FIX AND THE VIEWER

§4.2's contrast stretch and larger tile, and §4.3's viewer that does not depend
on where the page is sitting. **Independent of 1 and 2 — could go first if the
pictures are the thing that annoys you most.** It also fixes the light table and
the picker at the same time, because they share the engine.

### PIECE 4 — EDITING IN PLACE

The fields in §1.2, including the three `record.html` never had: **date,
attachments, and the number.** Last of the four **because it is the only one
that can lose your words**, and it should be built against a shape you have
already used and corrected.

**Depends on:** Pieces 1 and 2. **Also depends on one repair**, and it should not
ship without it — `wire` and `plates` render but cannot survive the draft
round-trip, so either they are fixed in the reader or the editor shows them
locked (§1.2). Shipping an editor that silently eats a field is Record 013's own
defect with a bigger surface.

## To the backlog, with reasons

- **EGGS.** **No egg is linked to a day by anything** — measured: 15 egg rows,
  zero carry a `when`, zero name a record in `deps`. **An egg panel is therefore
  a new field, not a view**, and the field it needs is the one whose unit is
  undecided (below). Parked until an egg has somewhere to say which day it
  belongs to.
- **PER-DAY PROVENANCE.** The register keys on FILE + LINE, so a per-day count
  is derivable from the entry's line span but not queryable. Real work, low
  value while it is only a count.
- **THE `when` FIELD'S UNIT.** Flagged and not fixed: `reveal/README.md` calls it
  *"the story day or week"*; the only consumer in the tree compares it to a
  transfer **week**. All 176 rows are null, so the ambiguity has never been paid
  for. **Whoever answers the first `reveal:cards` card pays it**, and the egg
  panel above is blocked behind that answer.
- **THE `prod` LADDER.** Three of four stages unused. It is the generic
  *how far along* and could carry the day editor's file states — but it is a
  design decision about the ledger, not an editor feature.

## Not built yet, and named so nobody builds it

**No completeness score, no percentage, no ranking of days.** §2.3: there is no
definition of a complete day in the tree, 001 is deliberately a deposit day, and
an editor that badges it as thin is wrong about the story.

---

# 9 · WHAT THIS REPLACES, FOLDS IN, AND RETIRES

| surface | what happens | why |
|---|---|---|
| **`assign.html`** | **FOLDS IN — it becomes the picker panel.** | Rebuilt this morning to capture attachments rather than days. That work is the day editor's §6 picker and its §1.3 attachment model. Nothing is thrown away. |
| **`record.html`** | **DIES**, once Piece 4 ships. **Your word, not Ops'.** | Mothballed since 2026-08-12 — *"Not the road for week one."* It edits five field kinds; the day editor edits those plus date, number and attachments, in a page that also shows the files and the ledger. Two writing surfaces for one entry is how a question gets two answers. Doctrine 24 says a thing you rule gone leaves your view, so this needs your word. |
| **the workbook** | **SURVIVES, and is not touched by this.** | You write in it, `record:workbook` reads it, and none of that changes. The day editor is where a written day is *assembled and checked*, not where prose is first typed — unless you want it to be, which is a bigger call than this document makes. |
| **`arc.html`** | **SURVIVES** — different scale. | It is the twelve-week table. The day editor's calendar is days; the arc is weeks. They do not overlap. *(Separately: `arc.html` and `docs/ARC.md` are two live twelve-week arcs that contradict each other. Out of scope here and still open.)* |
| **`artifacts.html`** (light table) | **SURVIVES, and gets better for free.** | It shares the thumbnail engine, so Piece 3 fixes it too. It answers *what does the museum have* across everything; the picker answers *what can this day use*. |
| **`eggs.html`** | **SURVIVES untouched.** | Backlog above. It is the only egg surface and nothing replaces it. |
| **the desk** | **GAINS ONE CARD, LOSES ONE EVENTUALLY.** | The day editor becomes the lead card. The Record editor's card goes when it does. |

**Nothing is deleted by this document.** Every retirement above is a consequence
of a piece shipping, and each one is named here so it happens deliberately
rather than by accumulation.

---

## THE ONE-LINE TEST

**Open a day. Everything true about that day is on the screen, in the same
places it is for every other day, and the shape tells you what is missing before
you have to ask.**

If a future round is deciding whether something belongs in the day editor, that
sentence is the test — and if it is not true of every day equally, it is not
SED.
