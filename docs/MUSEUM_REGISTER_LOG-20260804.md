# THE REGISTER ROUND — run log

**v49 · 2026-08-04 · autonomous single-agent Code lane, on Mike's
remote-control brief (A1–A10). Drafting lane, no git until seal.**

**The deliverable is `docs/OPEN_ACTIONS.md`.** Everything else in this round is
either a thing that register now points at, or a thing that had to be true
before the register was worth writing.

---

## THE PROBLEM MIKE STATED, AND WHY IT IS NOT A REPORTING PROBLEM

> *"the round's spine — Mike has no way to see what is already reported."*

Every round since v40 has ended with a section titled *"what this exposes"* or
*"carry-forward"*, written honestly, listing what the round found and did not
fix. v43 listed nine. v45 listed nine more. v46 listed eleven. v47 listed nine.
v48 listed five and gave them their own document.

**All of it was reported. None of it was recorded.** A round log is a narrative
of one day, and nobody re-opens a narrative of a day three weeks ago to find out
whether its ninth bullet is still true. The operator's sentence is the exact
symptom: not *"you did not tell me"* but *"I have no way to see."*

So the register is not a summary of the round logs. It is a different KIND of
document — a ledger with a status column, which is the thing none of those logs
could be, because a log is finished the moment it is written and a ledger never
is.

---

## A1 — THE OPEN-ACTION REGISTER

`docs/OPEN_ACTIONS.md`. **60 rows** in five tables plus a nine-item short list of
what is waiting on Mike alone and nothing else.

Columns are Mike's: what it is in one line · where it came from · status
(OPEN / IN PROGRESS / RULED-AWAITING-BUILD / DONE) · owner (Mike / Ops / Code) ·
date raised.

**Harvested from**, in order: both `STATE.md` files (museum: full-launch gates,
NEXT, known issues, gift-shop still-open, backup status, cannot-verify, backlog;
robots: open issues, parked, design doctrine) · five round logs' carry-forward
sections (v43/E5, v45/R5, v46/C4, v47's exposures, v48/P4) ·
`PROVENANCE_RULINGS-20260804.md` · `RECORD_013_QUESTIONS-20260804.md` ·
`VISUAL_HOOK_AUDIT-20260803.md` · a count of `[PAPA]` markers inside string
literals in `src/` (**35 in content files** — robots 16, WAL 6, Foundation 7,
booth 6 — plus 4 in the scrubber's own documentation) · this round's findings.

**DELIBERATELY NOT HARVESTED: the ~130 historical run reports and briefs in
`docs/`.** Their open items were either closed by a later round or already
carried into `STATE.md`, and sweeping them would fill the register with rows
whose status nobody can determine — which is precisely the condition the
register exists to end. That decision is written into the file so the next round
extends it the same way rather than re-litigating it.

**Recorded as Doctrine 14** (`OPERATIONS.md` §7), with a step `1a` added to the
session-close ritual so it is updated in the commit a round seals, not after.

---

## A2 — THE TITLE BAR STAYS PUT

**Reported by Mike, unfixed, and it needed a diagnosis rather than a patch.**

### Measured before touching anything

`/robots`, 1706×810, scrolled to y=500:

```
.ex-album-banner   top −132.0   bottom −92.4     ← entirely out of the building
.wb-bar (fixed)    top    0.0   height  45.3
.ex-left (sticky)  top   64.0
```

`/hr`'s document is **4208px** tall, so its band leaves even sooner.

### The cause was a class name, not a layout

The band **was** pinned — on `/wal`, and only there. M-e (2026-08-02) put
`position:sticky` on **`.ex-banner-console`**, the class that exists to hold the
banner TRANSPORT, and `worth-a-listen.js` is the one artist config that declares
`transport: "banner"`. Every other wing rendered the same band with none of the
five declarations.

The stickiness was never about the transport. M-e's own note says a *stop
control* you have to go and find is the complaint — and a *title* you have to go
and find is the same complaint about the same band. Five declarations
(`position`, `top`, `z-index`, `background`, `border-bottom`) move onto
`.ex-album-banner`; `.ex-banner-console` keeps the transport's layout and
nothing else. F2's apron and P1's `pointer-events:none` travel with the pin,
because F2's gap is a fact about the fixed nav's font metrics against a
hard-coded `top:52px` and it opens under EVERY wing's band the moment that band
sticks.

### And the fix would have caused a second defect, which is why it is measured too

With the band pinned at 52 and 40.5px tall it occupies **52–92.5**. The flat
wing's sticky contents column sits at `top: calc(54px + 10px)` = **64** — so
**27.6px of the tracklist would have printed underneath an opaque band**.

Both offsets now derive from one declared number:

```css
.ex-root{--ex-banner-type:clamp(1rem,1.8vw,1.35rem);
  --ex-banner-h:calc(17px + 1.1 * var(--ex-banner-type));
  --ex-band-bottom:calc(52px + var(--ex-banner-h))}
```

`--ex-banner-type` is used BY the title's `font-size`, so the height cannot
disagree with the type it measures. Checked against the live box: 17 + 1.1×21.6
= **40.76** against a measured **40.53**, erring by a quarter-pixel in the
direction of extra clearance.

### The rule under the band is new and deliberate

A band that floats over moving text with no edge lets the next paragraph slide
up and touch the album's name. `.ex-banner-console` has carried exactly this
`border-bottom` since M-e, for exactly this reason.

### Verified, on the built bundle

| | desktop 1400×900 | phone 390×740 |
|---|---|---|
| `/robots` | band `top:52`, contents `top:102.8` | band `top:52` |
| `/hr` | band `top:52` | band `top:52` |
| `/wal` (the wing that already worked) | band `top:52`, contents `top:102.8` | band `top:52` |
| `/wb` | no scroll to pin against; band stays in flow | ditto |

`102.8 = 52 + 40.76 + 10` exactly — the derived value, not a coincidence. The
gap between the fixed nav's bottom (45.3) and the band's top (52) is **6.7px**,
inside the 16px apron.

---

## A3 — THE PLATES IS THE MORGUE, AND BOTH NAMES ARE ON THE GLASS

Mike's two options were **IMAGE ARCHIVE** (clear) and **THE MORGUE** (what a
newspaper or a wire service called its photo archive, which is the period this
wing is set in). Ops proposes THE MORGUE and prints **IMAGE ARCHIVE** underneath
as the plain-language subtitle — so a visitor is never guessing, and **Mike can
read both on the page and strike one.** Whichever loses is one string per face.

```
THE MORGUE
IMAGE ARCHIVE · MGK-VIII · DETAILS ONLY
```

**The individual photographs are still called plates**, everywhere they were:
the tombstone row, the footer, the blurb, the entries on The Parts and The
Firmware. A morgue is the room; a plate is the object in it. Renaming the
objects was not asked for and would break four faces that talk about plates by
name.

### The siblings, named and not built

Same-only-different says the sibling forms are the same component with different
data. Written into `robots.js`'s header:

| | media | state |
|---|---|---|
| **THE MORGUE** | images | **LIVE** — the two walls |
| **THE REEL** | video | **NOT BUILT.** Every `videos:` array in this wing is empty and the museum holds no clip of either unit. The word is not invented either — The Manual's face has called its own container a reel since B8. |
| **THE TAPE LIBRARY** | audio | **NOT BUILT.** This wing has no audio at all. `/wb` has six tracks and no archive face, which is where this would land first. |

**Neither is scaffolded.** An empty container at a live address is what the
house's NO-COMING-SOON credo and Doctrine 11's corollary both kill. The renderer
is already generic; building one on the day there is something to put in it
costs a data block and no code.

---

## A4 — THE ARCHIVE STACKS IN SPREADS, NEWEST AT THE TOP

New `ArchiveWall` + `archiveSpreads` at module scope in `Exhibit.jsx`, just
below `FaceFlow`.

**It is not a second renderer.** It is W2's collage wall with one thing added —
the wall may arrive in more than one piece, each piece headed. **A face that
declares no `spreads` is fed its `collage` as a single unheaded spread and emits
the DOM it emitted before**, which is the house's own rule for every optional key
on a face (F1's `img`, B9's `wire`/`plates`, L6's `docs`, v45's `sections`).

### The order is the record number, descending, and it degrades honestly

```js
const key = s => (typeof s.no === "number" ? s.no : -1);
[...declared].sort((a, b) => key(b) - key(a))
```

`sort` is stable, so a spread with no number keeps the order the file authored
it in and a numbered spread rises above the unnumbered, highest first.

**Not one spread carries a number today.** The museum holds no record number for
any of these photographs, and Ops does not get to invent one — so the field is
absent, the renderer prints nothing where it would go, the order falls to the
authored newest-first, and **the gap is a register row (M19), not a plausible
number on the glass.** The moment a number is known it is one field per spread.

### The lightbox walks the whole archive, not one spread

B6's contract is that a tile hands over the entire wall and its own index into
it. `wall` is the spreads flattened **in display order**, so the tilt does not
restart at each heading and the reader pages across the divide. Proved: opening
the FIRST tile of the SECOND spread reads **`THE MORGUE · FEB 2013 · Frame 6 of
8`** and shows `torso_unfinished.jpg`.

### What each wall got, and why one got nothing

- **MGK-VIII** splits into **MARCH 2021** (5 plates) over **FEBRUARY 2013** (3).
  The headings are the months already declared on each tile, spelled out —
  nothing else. Not "on the bench" or "in the workshop": those phrases are in
  the file, they describe SOME of the plates in each group, and applying them to
  all of a group would be a claim about photographs nobody made.
- **MGK-VIIIp takes no spreads, and that is the rule working rather than an
  exception to it.** Nine plates, one sitting, no record number and **no date
  declared on any of them** — the `date` field on those tiles carries a slot
  label (FRONT, SCREEN, BEZEL). There is nothing to stack them by, so they stay
  one unheaded wall. A shelf label on a one-shelf archive is furniture.

The date prints twice on the VIII wall on purpose — once on the shelf, once on
each print — because the READER's caption line is `title · date · frame n of m`
and a print that leaves the shelf has to carry its own date.

**One hardening on the way past:** `scrubFace` now scrubs `[PAPA]` from a
spread's `head`. A spread heading is printed on the shelf, and a marker written
into one would print exactly the way the Portal's five drum refusals did in v46.
**Tile `label`s are still not scrubbed** — a pre-existing gap, now a register row
(C15) rather than a thing nobody noticed.

---

## A5 / A7 — THE ASSET TABLE, AND WHAT LOOKING FOUND

`provenance/asset-table.json`, written by `tools/asset-table.mjs`.
**251 rows, 922.6 MB, across both repos** — museum 110, robots 141;
179 images, 69 audio, 3 video; 44 shipped, 3 unreferenced-in-`public/`,
204 source-side.

### Why it is a separate file from `provenance/assets.json`

That register answers ONE question — where did this picture come from — for the
33 images the authored source references. This table answers four others (what
is it, what depends on it, is it any good, has Mike passed it) for every media
file in both trees, referenced or not. Folding them would put a scanner's output
into a hand-curated file whose entire value is that a human wrote every row.
They share a directory and the `ref` join key and nothing else.

### The scan never overwrites a judgement

`--scan` re-walks and rewrites only the MEASURED fields. The four judged fields
— `what`, `quality`, `qualityNote`, `verdict` — are carried across by `id`.
**A file that leaves the disk keeps its row with `missing: true` rather than
being deleted, because a verdict Mike gave is a record and not a cache.**

### It reads the bytes, not the name

The first pass trusted extensions and got two files wrong. It now sniffs the
container from magic bytes and checks the tail for a terminator (PNG `IEND`,
JPEG `FFD9`):

```
.jpg on disk, webp inside   /images/wal/jesse-welles-plate.jpg     ← and it SHIPS
.png on disk, jpg  inside   /images/wb/vol1_cover_v0.png
TRUNCATED                   /WeirdBaby_PhotoID_backup.png
```

### The quality pass — 41 images looked at, 6 audio honestly not graded

Contact sheets at 400px/tile, every flagged file re-opened at full resolution.
**30 usable · 5 weak · 1 placeholder · 5 wrong.** The six `/wb` tracks are
recorded as **not listened to** rather than given a grade, because a bitrate is
not a quality read and a guess there would be worth less than the blank.

### THE FINDING OF THE ROUND — three plates that do not show what their captions say

The MGK-VIIIp wall's tombstone says **"Plates — Nine, all held by this museum"**
and its lead calls them photographs of a machine that had been sitting in the
dark since before the moon landing. Three of the nine are neither:

| File | Caption on the wall | What is actually in the frame |
|---|---|---|
| `MGK-TWIN_MONITOR_SCREEN_BEZEL.png` | *"The bezel around the glass"* | **A CRT/monitor FRAME GRAPHIC with a plain white rectangle where a picture is dropped in.** Not the unit's bezel; not a photograph. |
| `monitor_base.png` | *"The base it stands on"* | **The family-shot composite placed inside that frame.** There is no base in the picture. |
| `unit_new_base.png` | *"The unit on its new base"* | **The same pair on plain white with BOTH SCREENS MASKED OUT to blank shapes.** A masking intermediate from the compositing job. |

Read together they are three stages of one compositing job — the empty frame,
the frame filled, and the masked source — presented as three separate
photographs of an object.

**Nothing was fixed.** A7's own instruction is that the table is the deliverable
and nothing gets fixed without Mike; Doctrine 12 says the same. It is row M7.

### And four more that only looking could find

- **`front_screen.png` is mirror-reversed as a WHOLE PHOTOGRAPH**, not just its
  screen — the lettering behind the unit lower in the frame reads backwards too.
  **That sharpens R2 and makes the fix one horizontal flip of the file** rather
  than a re-shoot. Still Mike's call.
- **The WAL portrait of Hunter Root is a phone selfie taken in a vehicle** —
  steering wheel, rear-view mirror and a parking lot through the glass — doing
  the job of an artist's introduction portrait. R3 already had the shirt reading
  CHET VINCENT AND THE MUSIC INDUSTRY; cropping that out does not fix this.
- **Mikey Mike's cover** is a hand-held selfie down a cabin passage with a
  child's ride-on toy in frame, at 73 KB for 900² — the least data of any cover
  in the building.
- **`feet_plinth.jpg`** is captioned *"Feet, on a plywood plinth"* and shows two
  feet on what reads as a workbench beside a brass table lamp. "Plinth" is doing
  work the photograph does not support.

### 2.5 MB in `public/` that nothing points at

`/images/wb-merch/hunter-root.png` (1.7 MB — orphaned when F7b removed his
banner on Mike's order, and left behind), `/images/wb/vol1_cover_v0.png`,
`/WeirdBaby_PhotoID_backup.png` (the truncated one). Row M9; deleting an asset
is Mike's call, which is the whole spirit of A6.

---

## A6 — THE RECORD APPROVAL GATE

> **Final sign-off on a Record is Mike personally inspecting EVERY thing
> presented in it. Ops ensures nothing escapes that inspection.**

Recorded as Doctrine 15 and wired to the table's `verdict` field, which is
**unset by default and is never written by Ops**:

```
npm run assets:checklist -- --room robots   # the inspection, printed
npm run assets:gate      -- --room robots   # exits 1 while anything is unpassed
```

The gate also fails on a scope that matches **nothing**, because a gate that
matched nothing has not passed.

**IT IS NOT A PACKET GATE AND MUST NOT BECOME ONE.** lint, build and
`provenance:gate` run on every commit because they check things Ops can fix.
This one checks whether MIKE HAS LOOKED, so putting it in the packet would block
every commit on an inspection nobody has asked for — the exact opposite of
Mike's own condition, **that he must not have to perfect assets in advance.**
Slots move, things change, some assets are never needed. It runs against one
Record when that Record is being signed off.

**What it cannot do**, stated with it: it records that a verdict was given, not
that the inspection was careful. And `assets.json` is keyed on the PATH, so an
approved picture can be swapped under its own verdict and nothing fails. Both
holes are now in `provenance/README.md` §4.

Today: **44 shipped assets, 0 passed.**

---

## A8 — THE ROBOTS CAROUSEL

### The MGK-VIIIp cover is the machine and nothing else — DONE

Cropped to the unit's own measured bounding box (luminance < 100, smoothed
column and row profiles at 30% of peak: x 162–1337, y 327–1866). The unit is
1539px tall against a 1536px plate, so the largest square that holds the whole
machine is the full width centred on it: **(0, 328, 1536, 1864)**.

**A crop and a colour-mode change, nothing else** — no resample, no rotation, no
retouch. Written as 8-bit grey, which is lossless here because every RGB channel
was already identical (verified, max deviation 0). **2.69 MB → 1.40 MB.**

**And it fixed something nobody had noticed.** `.cf-album` is a 240×240 box with
`object-fit: cover`, so the 3:4 file had been centre-cropped by the renderer:
**the deck has never shown this machine's top or its base.** Square, it does.
The residual is a band of floor at the left and right edges, which no rectangle
can remove without cutting the machine — that needs a cut-out or a reshoot, and
both are Mike's.

### The straighten is REFUSED, and here are the numbers

Mike asked for the crooked cover to be straightened. It cannot be, by rotation,
and the measurement is unambiguous.

The machine's own rectangular aperture — a real rectangle in the frame:

```
TOP edge      −1.75°        BOTTOM edge   +2.48°      (4.23° apart)
LEFT edge      0.13° off plumb   RIGHT edge  1.52°    (1.39° apart)
```

A rectangle whose opposite edges disagree by 4.2° is **keystoned, not rotated.**
Cross-checked on the grille bars by cross-correlating band pairs at four
different heights (shift search bounded below half the 44.6px pitch, so no
aliasing): the same bars measure **−2.69°, +5.40°, +3.58° and +0.12°**, because
the frame holds two gratings at different depths.

A variance-over-angle sweep picks **+4.3°** for the verticals and **−2.1°** for
the horizontals. A single rotation levels one edge and tilts the other three:
**−1.76° levels the bottom rail and would tilt the LED row, which is currently
level to within 0.17° and is the one line in the picture a visitor actually
reads.**

So nothing was rotated. Row M8: it wants a photograph. The picture also has a
mains adapter, a wooden floor and loose cabling in frame, and it is the only
colour original among the three covers — the wing's greyscale law hides that at
the glass and cannot touch the composition.

### The common theme, written down because it was distributed across four files

**Template A — a unit's cover:** one machine alone in the frame · square
(`.cf-album` is a square box with `object-fit:cover`, so a non-square cover is
centre-cropped by the renderer and the visitor never sees what the file holds —
all three are square as of this round) · black and white, enforced once at the
glass by `.ex-root[data-exhibit="robots"] img:not([data-colour])` so the
negatives stay negatives · cut at a joint where the obfuscation law applies.

**Template B — anything that is not a unit:** the house card — museum paper, a
ruled border, the mark, the wing's name in the serif, a strapline in tracked
caps, generated by `tools/make_robots_cover.py` rather than hand-composited. A
room is not a machine and does not get photographed like one, which is the whole
of what same-only-different asks here.

---

## A9 / A10

**A9 — the five standing rulings are rows M1–M5** in the register, with their
one-question detail left in `PROVENANCE_RULINGS-20260804.md`. They are not
re-chased and not restated at length; a second document to lose is the problem
A1 exists to solve. **M2 and M3 carry new evidence from this round's quality
pass** and their rows say so.

**A10 — the `RESTATED` class stays**, recorded as an Ops ruling under Doctrine
13. Mike's four classes are ORIGINS; 282 rows are Ops connective prose that
originates nothing, and calling those MIKE would be false while calling them
INVENTION would bury the three real findings under 282 non-findings. **It is
kept because it has teeth:** a `RESTATED` row's reference must RESOLVE and may
not point at its own file — which is exactly the shape *"436 records, kept since
January 2024"* would have taken, the failure the whole boundary was built
against. It rejected twelve rows on its first run, including its author's.

---

## ONE ORIENTATION DEFECT FIXED ON THE WAY PAST

`CLAUDE.md`'s pre-flight section published the lint baseline as **4 errors / 6
warnings**. The live baseline has been **11 / 9** since at least v40, and every
round log since records it. **A doc that publishes the wrong tripwire number
disables the tripwire** — a session trusting it reads eleven pre-existing errors
as seven new ones and starts hunting a regression that is not there. Corrected,
with the reason written beside it.

---

## GATES

| Gate | Result |
|---|---|
| `npm run lint` | **11 errors / 9 warnings — identical to the HEAD baseline, zero new.** |
| `npm run build` | green, **70 modules** (unchanged), 677.25 kB / 187.54 kB gzip |
| `npm run provenance:gate` | **PASS.** It caught all nine new strings as UNDECLARED first, as designed; 7 rows declared (two strings appear on both walls and share a key). |
| Desktop lap, 1400×900, built bundle via `wrangler dev` | 11 routes · **zero page-level horizontal scroll · zero inner horizontal scrollers** |
| Phone lap, genuine 390×740 iframe | 11 routes · **zero page-level horizontal scroll.** The one `innerX` hit on the Lobby is `BODY` at `scrollWidth 390 / clientWidth 373` — the iframe's own vertical scrollbar, the same 373 v47 recorded, not content overflow. |
| Band pinned | `top:52` on `/hr`, `/wal`, `/robots`, desktop and phone. Contents column at `102.8` = the derived `52 + 40.76 + 10`. |
| Console + images | **zero errors, zero broken images** across 8 routes |
| Asset URLs | **40/40 shipped asset refs return 200** from the built bundle |
| Archive | 2 spreads / 5 + 3 tiles on MGK-VIII; **1 unheaded wall / 9 tiles on MGK-VIIIp, structurally identical to before**; reader opens the 6th of 8 across the spread divide |

---

## NAMED HONESTLY

- **The quality pass is Ops looking at contact sheets at 400px/tile**, with every
  flagged file re-opened at full resolution. It is a read of the FILE — is it
  sharp, is it framed, does it show what its caption says — **never of the
  idea**, and it is emphatically **not Mike's verdict.** 44 shipped assets carry
  no verdict.
- **The three miscaptioned plates are an Ops reading of what is in a picture.**
  The reading is stated in full in the table so Mike can disagree with it by
  looking at the same file.
- **`--scan` has never been run against a moved repo.** If `weird-baby-robots`
  is not at its sibling path the scan prints a warning and skips 141 rows rather
  than deleting them.
- Chrome's screenshot pipeline behaved this session. The load-bearing
  verification is still DOM measurement on the built bundle; **the single
  biggest find of the round came from looking at pictures**, which is the second
  round running that has been true.

---

## FILES TOUCHED

**New**
```
docs/OPEN_ACTIONS.md                 the register — the round's deliverable
docs/MUSEUM_REGISTER_LOG-20260804.md this file
tools/asset-table.mjs                the scanner + report + checklist + gate
provenance/asset-table.json          251 rows, both repos
```

**Changed**
```
src/routes/exhibit/Exhibit.jsx       ArchiveWall + archiveSpreads; scrubFace spreads; Fragment import
src/routes/exhibit/Exhibit.css       the band pins site-wide; --ex-band-bottom; .vp-spread-head
src/data/artists/robots.js           THE MORGUE ×2; MGK-VIII spreads; the common theme; the viiip crop note
public/robots/art/viiip.png          cropped to the machine, 1536², 8-bit grey
provenance/register.json             +7 rows
provenance/assets.json               viiip.png re-crop noted
provenance/README.md                 §4 — the path-keyed hole; the asset table
package.json                         assets · assets:scan · assets:checklist · assets:gate
docs/canonical/OPERATIONS.md         Doctrines 14 + 15; A10 under 13; file map; close ritual 0/1a
STATE.md                             two standing sections + the v49 seal
CLAUDE.md                            the lint baseline corrected
```

**Deliberately NOT changed:** every asset the quality pass flagged. Five `wrong`,
one `placeholder`, five `weak`, three orphans and one truncated PNG are all
exactly where they were. The table is the deliverable.

---

## WHAT IS YOURS

The nine-item short list at the top of `docs/OPEN_ACTIONS.md`. The first one is
one word: **THE MORGUE or IMAGE ARCHIVE** — both are on the glass so you can
pick by looking.
