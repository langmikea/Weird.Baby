# COPY + THE RECORD LAYOUT — round log, 2026-08-17

Two batches. **Batch 1 is done, verified on the built bundle, and needs a
deploy. Batch 2 is built and waiting on Mike's ruling; nothing of it is in
`src/`.**

Tree at start: `3f60d77`, working tree clean, lint **9 / 8 = baseline**.

---

## 0 — WHAT IS WAITING ON MIKE

1. **Open `docs/record-layout-variants/compare.html`** (double-click it) and say
   **a**, **b** or **a+b**. Nothing of Batch 2 ships until he does.
2. **`npm run deploy`** for Batch 1.

Everything else below is for the next session.

---

## 1 — BATCH 1, ITEM BY ITEM

His words are carried verbatim. The three corrections in the fact grid arrived
RULED and were applied without being flagged back at him, per the instruction.

| where | what changed | file |
|---|---|---|
| /robots FAQ | *"Is this stuff real?"* — his two-line answer replaces the one-line one | `src/data/artists/robots.js` |
| /wb About the artist | the blurb — `Sloppy-Guitar`, `Mournful Lyrics`, `the plight of the masses` | `src/data/artists/weird-baby.js` |
| /wb About the artist | the fact grid, all five rows, `Founder` new | `src/data/artists/weird-baby.js` |
| /wb About the artist | the Steven Tyler tile replaced, and a **second** Steven Tyler tile added | `src/data/artists/weird-baby.js` |
| /booth **and** /wal | `AFFILIATION` gains a third line — **one edit, both surfaces** | `src/data/house-copy.js` |
| /foundation FAQ | the donate answer, two lines, `a specific need` | `src/data/artists/foundation.js` |
| /wal · Mikey Mike | the `September 2019` sidebox and the `NOTE` line — **killed** | `src/data/artists/worth-a-listen.js` |
| /wal · Jesse Welles | the `Two links that are not his` sidebox — **killed**, links block untouched | `src/data/artists/worth-a-listen.js` |
| every wing | the page title 1.2rem → **1.45rem** (19.2px → 23.2px) | `src/components/MuseumBar.css` |

### The blurb's U+2011 survived and was checked as a result rather than a string

`Melodic‑Talker` still carries the non-breaking hyphen and still draws on one
line: a `Range` over the word returns **1 client rect** at 1706px. The word is
inside a string this round rewrote around, which is exactly when that character
gets lost.

### The `NOTE` line was not where a reader would look for it

Mike's kill block for Mikey Mike ended on *"NOTE  He does own
findmikeymike.com…"*, and grepping for that sentence finds `siteNote:` — a field
with **no consumer anywhere in `src/`**. It is printed by a line 380 lines
further down the same file that builds the artist face:

```js
lines: a.siteNote ? ["NOTE     " + a.siteNote] : undefined,
```

Read against the live page it draws as an `li` in `.vp-face-lines`. **The field
was located by loading the page and asking the DOM which element held the
string**, not by reading the data file — a grep for the field name says nothing
about whether it reaches a visitor.

**The ledger stayed.** The `[R-a 2026-08-02]` comment block above it — the
domain is his, it is serving an injected link farm, it is linked from nowhere,
do not "close the gap" — is untouched, and the sentence one block up that
pointed at `siteNote` was repointed at it rather than left aiming at a deleted
field.

**`siteNote` now has no declarer in the museum.** The builder line survives; it
is listed in the handoff as a mechanism exercised by nothing so it is neither
mistaken for live copy nor deleted as dead code.

### One string Mike did not name, and it is left alone

Mikey Mike's records block still reads *"…the domain he does own is currently
serving injected spam, so this museum will not send you there."* That is a
different object with different words in a different block, and the fact
scroller separately carries *"He does own the domain findmikeymike.com. / It is
not linked here, and the reason is in the ledger."* **Neither was in his kill
block**, so neither was touched. Flagged rather than absorbed.

### `sideboxes` left with its last member on both cards

An empty array is a field `scrubFace` still reasons about and nothing draws. One
sidebox survives in the wing — Carsie Blanton's — measured, not assumed:
`sideboxes:` is declared exactly once in `src/data/` after this round, so
`.vp-box` and its renderer are still exercised and there is no dead mechanism to
report.

---

## 2 — THE TITLE, AND THE BAND RE-VERIFIED

`.wb-bar-room` is the one element: the artist name on an artist wing, the page
name everywhere else, drawn only by `<MuseumBar/>`. One declaration moved.
The shop's own rule sets FAMILY and WEIGHT only, so /shop takes the size with
everybody else and keeps its Fredoka test.

**The ≤720px branch was deliberately not touched** — P6's reason, not caution:
it sets its own 0.8rem and its overlap arithmetic was measured at that size.
"Across the board" in his instruction is every WING; the parenthetical says so.

### The band, measured after the change on the built bundle, 1280×460

| route | plate | room | centres | uncovered L/R | dead of 21 | clipped |
|---|---:|---:|---:|---:|---:|---|
| /wal | 275 | 275 | 0 | 0 / 0 | **0** | no |
| /wb | 492 | 492 | 0 | 0 / 0 | **0** | no |
| /robots | 295 | 295 | 0 | 0 / 0 | **0** | no |

Bar overlap at **1280px** and at **390px**, on /wal /wb /robots /booth /shop
/foundation: **0 everywhere, 0 clipped**. (/hr renders the Lobby and has no bar,
which is correct.)

### THE PROBE WAS WRONG TWICE BEFORE IT WAS RIGHT, AND BOTH ERRORS ARE WORTH KEEPING

**First error — a clause that made every point pass.** The hit test read
`hit === room || room.contains(hit) || hit.contains(room)`. That last clause is
true whenever the hit is any ANCESTOR of the room — `.ex-root`, `body` — so a
plate 192px away from the room reported **0 dead of 21**. The specified test is
`hit === control || control.contains(hit)` and nothing else. It was caught
because a probe reported a clean result on a page where the band was visibly not
pinned; the surprise was in the number, and the number was the thing at fault.

**Second error — the wrong box.** With the strict test, sampling 21 points
across the PLATE's box gave **7 of 21 dead** — the plate is 29.8px tall against
a 27.6px room, so its top and bottom edges are over bar rather than over the
control. The instruction's probe is across **the control's whole box**, and that
reads **0 of 21**. Both numbers are reported here because they answer two
different questions, and only the first is the one Mike's fix was about.

**And the stricter number IMPROVED.** A/B in the same frame, the old `1.2rem`
injected as a stylesheet and removed again: **over-plate dead 14 of 21 at
1.2rem → 7 of 21 at 1.45rem.** The taller room box now covers the plate's bottom
edge as well as its middle. The title change did not cost the fix anything; it
gave it back a row of points.

**No ink escapes the plate.** The room's LINE box ends 0.68px below the plate,
which looks like a defect and is not: measured with canvas metrics for the room's
actual string in its own resolved font, the ink runs **19.28 → 36.28** inside a
plate of **11.12 → 40.88**. 4.6px of clearance below. The room name is uppercase
on every wing, so there are no descenders to find the gap.

**The measuring rig.** `resize_window` had no effect on this host (innerHeight
stayed 810 whatever was asked for), so the band could never be scrolled to its
pinned position on a tall window. Every measurement above was taken inside a
**same-origin iframe on the museum's own origin**, sized until
`documentElement.clientWidth` IS the target — the same correction
`tools/lap/harness.html` makes for the scrollbar, for the same reason. Nothing
was copied into `public/`.

---

## 3 — BATCH 2, THE RECORD LAYOUT

### His complaint is arithmetically exact

Measured at 1706px on the built bundle, Record 001 open:

```
.vp-flat / .vp-rec-openhead / .vp-rec-sects   left  831.3
.vp-rec-mark  (the rail)                      left  833.3   w 53.5
.vp-rec-headline / .vp-rec-deck               left  902.8
```

The report starts **71.5px left of the headline**: 2px of head padding + the
53.5px rail + the grid's 16px column gap. That is `--rec-textcol` exactly
(`--rec-rail + 18px`) — **the distance already has a name in the source**, which
is what makes variant b one declaration.

### What was built

`docs/record-layout-variants/variants.css` — real CSS, **not in `src/`, not
loaded by the museum**, injected at runtime to take the pictures. Scoped by
`data-rec-layout="a" | "b" | "ab"` on `<html>`.

| | headline | report | out by |
|---|---:|---:|---:|
| now | 902.8 | 831.3 | 71.5 |
| **a** grow the block | 942.9 | 831.3 | 111.6 |
| **b** indent the report | 902.8 | 902.8 | **0** |
| **a+b** | 942.9 | 942.9 | **0** |

**a** raises the mark to `1.75×` and the rail follows by construction
(`--rec-rail` is `2.55 × --fs-lead`), so four digits still fit the day the
volume reaches 1000 and nothing is hard-coded in pixels. The scale is one
declared token, `--rec-mark-scale` — the knob if a is right in kind and wrong in
degree. **a's cost, stated on the page he reads:** it breaks J1's ruling that
the index row and the opened head are the same object.

**b** is `padding-left: var(--rec-textcol)` on the lead, the sections, the
attachments, the tombstone, the note and the endmark — the whole body of
writing, because indenting some of it trades his complaint for a worse version.
The foot transport is left alone: furniture, right-aligned, and J1 pinned its
geometry. **b's cost:** ~72px of measure; nothing rewraps at this width, a phone
would and would need answering separately.

### THE COMBINATION WAS BROKEN IN A WAY ONLY A MEASUREMENT COULD CATCH

`--rec-textcol` is declared on `.vp-face` as `calc(var(--rec-rail) + 18px)`.
**A custom property is resolved on the element that declares it and inherits
down as a resolved value** — so a's redefinition of `--rec-rail` further down the
tree does not retroactively change it. The first cut overrode `--rec-rail` on
`.vp-flat` and the combination rendered with **a's 93.6px rail and b's 71.5px
indent**: headline 942.9, report 902.8. **Mike's own complaint, reintroduced by
the fix for it**, and it would have looked deliberate in a screenshot. The
combination now overrides the derived token itself, on the element the shipped
one is declared on, from the same one scale.

### The comparison

`docs/record-layout-variants/compare.html` — four 2× detail crops stacked so the
eye runs one vertical down the page, the four whole panels below them, the
measured numbers under each, and his own two sentences quoted as the captions.
Images are relative PNGs and there is nothing external, so it opens from disk.

**It was checked by loading it**, not by writing it: all eight images resolve,
`scrollWidth === clientWidth` (no sideways scroll), and it was read at 1690px.
For that check it was served from `dist/client/` — a build artifact, gitignored,
wiped by the next build — because the browser extension refuses `file://`.
**That copy was deleted afterwards**, the `lap:clean` habit applied to a
different folder.

---

## 4 — GATES, ON THE FINAL TREE

lint **9 / 8 = baseline** · build green · **launch build green** (144 files,
190.0 MB held out) · provenance **PASS** · `reveal:check` **PASS** ·
`parity:gate` **PASS, 4 shared · 0 divergences** · `instory:gate` **PASS** ·
`docs:numbers` **PASS** · `reveal:day` **nothing to move** ·
`assets:orphans` **13 rows, 8 judged / 5 unjudged — unchanged, and it is
backlog M9**.

**Every page that changed was loaded on the built bundle**: /wb, /robots FAQ,
/booth, /foundation FAQ, /wal (Jesse and Mikey Mike cards), /shop,
/robots/record.

### The register

**14 rows pruned, 11 added, 0 surviving rows changed, 0 chains broken** —
checked, because §9's prune hazard has fired on this file before. All 14 pruned
rows are strings this round replaced or killed; no pre-existing stale row was
swept up in them. The new rows are 10 MIKE and 1 HOUSE (`Founder` — the label is
Ops' word, the value beside it is his to the character, which is the rule every
other label on that grid already carries).

---

## 5 — SMALL THINGS FOUND AND NOT ACTED ON

- **`Born | Born July 3, 1963`** still repeats its label. Still his value as
  supplied, still flagged not corrected, and it is already backlog row `Q-c`.
- **`siteNote`'s builder line** has no declarer left. Kept and declared rather
  than deleted.
- **`tickets` on Jesse Welles** (`Tour & tickets`) is in the data and did not
  render on the card this round. Untouched by this round and not investigated —
  named so a later round does not read its absence as this round's doing.

---

# SECOND PACKET, SAME DAY — THE RULING, THE TWO OPEN ITEMS, AND THE PHOTOGRAPHS

Three jobs. **All three done. Nothing is waiting on Mike except a deploy.**

---

## 6 — JOB 1: VARIANT b IS SHIPPED

Mike ruled **b** — *"indent the report so it reads as subtext under the
headline."* One declaration in `Exhibit.css`, immediately after
`.vp-rec-openhead > .vp-rec-sum{grid-column:2}`:

```css
.vp-rec-openhead ~ .vp-rec-lead,
.vp-rec-openhead ~ .vp-rec-sects,
.vp-rec-openhead ~ .vp-rec-att,
.vp-rec-openhead ~ .vp-rec-tomb,
.vp-rec-openhead ~ .vp-fe-note,
.vp-rec-openhead ~ .vp-rec-end{padding-left:var(--rec-textcol)}
```

**Measured on the built bundle, Record 001 and Record 004** (the one with
attachments), headline vs section label vs section body:

| width | headline | section label | section body | out by | overflow |
|---|---:|---:|---:|---:|---:|
| 1280 | 403.4 | 403.4 | 403.4 | **0** | 0 |
| 390 | 83.6 | 83.6 | 83.6 | **0** | 0 |
| 1920 (the operator's) | 550.2 | 550.2 | 550.2 | **0** | 0 |

004's attachments head lands on 550.2 with them.

**WHAT IT COSTS, A/B'd IN THE SAME FRAME** by switching the rule off with an
injected stylesheet and back on again — the method the TIGHTEN round established
after run-to-run wrap noise produced a before-figure wrong by a whole line:

- **Desktop: nothing at all.** Body width 728px either way — the 68ch cap binds
  before the container does — and the report's height is identical to the tenth
  of a pixel (939.9).
- **390px: −60.6px of measure** (343.7 → 283.1, −17.6%) and **+107.4px of page
  height** (+9.4%). Nothing rewrapped, no overflow. Named rather than absorbed:
  a Record read on a phone is now about a tenth longer.

**THE SPECIFICITY WAS CHECKED, NOT ASSUMED.** `.vp-rec-sects{padding:0}` further
down the file is a shorthand that includes `padding-left`; these selectors are
0,2,0 against its 0,1,0, so they win regardless of source order and moving
either does not silently undo this.

**THE HEAD IS UNTOUCHED**, so J1's ruling that the index row carries into the
opened record without change survives — that is the property variant **a** would
have cost, and it is why it is worth saying that b was the cheaper ruling as
well as the chosen one.

**a AND a+b ARE DELETED FROM `variants.css`, NOT LEFT DORMANT.** A stylesheet in
`docs/` that still renders a rejected layout is one injection away from being
mistaken for the shipped one. What they were — and the custom-property finding
the combination produced — is written down once in that file, and
`compare.html` now says **ruled: b** at its head and keeps the eight pictures as
the record of the comparison.

---

## 7 — JOB 2a: THE SPAM NOTE, AND THE THIRD STATEMENT

Mike: *"findmikeymike.com STAYS in the ledger, linked nowhere and described
nowhere a visitor reads."*

| where | what went |
|---|---|
| `worth-a-listen-facts.js` | the whole scroller fact — "He does own the domain findmikeymike.com. / It is not linked here, and the reason is in the ledger." |
| `worth-a-listen.js`, the records block | the clause "and the domain he does own is currently serving injected spam, so this museum will not send you there" |
| `worth-a-listen.js`, `aboutNote` | **the third statement** — "His own domain is deliberately not linked — see the ledger." |

**ONE CLAUSE REMOVED FROM THE RECORDS NOTE AND NOT A WORD ADDED.** It closes on
the Bandcamp where it used to run on. P16's empty-shelf argument — *"a shelf with
a label on it is the honest object; a shelf that is simply absent reads as an
oversight"* — never depended on naming the address, so the honest-empty statement
survives intact. **The house is quieter, not less honest.**

**THE THIRD ONE WAS DORMANT AND MIKE RULED THAT IS NOT AN EXEMPTION.**
`aboutNote` stopped printing on 2026-08-17 when the `SOURCES` row was struck, so
the sentence reached nobody — and his ruling is that a sentence one restored row
away from the glass is a sentence on the glass with a delay. **It was also in
the wrong field on its own terms:** `aboutNote` is a citations line and this was
a note about a decision. Its other content is unchanged to the character.

**AND THE SWEEP WAS THE POINT, NOT THE TWO EDITS.** Grepping the source for
`spam | link farm | putarslot | vipwin | indo7poker | pedetogel | will not send
you | not linked here | unlinked | compromised | domain` across `src/` and
`index.html` returned nineteen hits; **sixteen are source comments** (the `[R-a]`
ledger block, `GiftShop.jsx`, `Exhibit.jsx`), **one is Hunter Root's own TikTok
caption** ("I'm gonna spam y'all with my single release"), and the three above
were the visitor-reachable ones.

**PROVED ON THE BUILT BUNDLE:** `findmikeymike.com` and `injected spam` appear
**nowhere in `dist/client/assets/`**. `@findmikeymike` — his verified YouTube
channel, a different object — is untouched and still on the card.

**A COMMENT THAT HAD BECOME A TRIPWIRE WAS CORRECTED IN PLACE.** The note above
the `lines:` builder still argued *"`NOTE` stays — Mikey Mike's is a live warning
that a domain bearing his name serves injected spam, which is a fact a visitor
needs."* That is now the opposite of his ruling, and a later round reading it
would have put the warning back. It says what happened instead.

---

## 8 — JOB 2b: THE `Born` STUTTER, AND IT IS THE ONLY ONE

`BORN | Born July 3, 1963` → **`BORN | July 3, 1963`**. An **Ops ruling**, not
his: it was raised twice and carried as typed twice on the standing rule that
Ops does not drop a word from a value he supplied. **He can revert it with one
word** and the original is named once in the source, so reverting costs a paste
rather than a memory. Filed **MIKE** in the register with the one-word Ops edit
stated explicitly, so it cannot read next year as something he wrote.

**THE OTHER FOUR WERE CHECKED AND ARE CLEAN** — no value opens with its own
label. Widened past the four because the defect is a class rather than a row:
**76 tombstone rows across the whole museum, 0 hits.**

**AND THE PROBE WAS PROVED RATHER THAN TRUSTED**, because a zero is exactly the
reading a broken check gives. Fed the pre-fix `Born | Born July 3, 1963` and a
synthetic `Founder | Founder of Weird.Baby`: it flags both and passes the four
real rows.

---

## 9 — JOB 3: THE FOUR PHOTOGRAPHS

**Verified before reading, as instructed** — all four match their stated size and
mtime to the byte and the minute. **Copied, never moved**; the operator's
originals are untouched and were re-listed afterwards to prove it.

```
CBW.jpg     345,355 B  16:09:42  ->  public/images/wb/cb-west-1981-antler.jpg
Hunter.jpg  362,408 B  16:04:26  ->  public/images/wb/hunter-root-signed-setlist.jpg
Rod.jpg     219,433 B  16:02:57  ->  public/images/wb/rod-stewart-signed-ball.jpg
Steven.jpg  367,856 B  16:07:23  ->  public/images/wb/steven-tyler-setlist-harmonica.jpg
```

**THE NAMES DESCRIBE THE OBJECT, NOT THE PERSON.** The yearbook is
`cb-west-1981-antler.jpg` rather than anything carrying P!NK's name, because the
object on that tile is the SCHOOL — Mike's own framing — and a filename saying
otherwise would be a claim the picture does not make.

**AND THE OBJECT CORROBORATED HIS OWN CORRECTION.** The framed sheet reads
`VEGAS #5 - NIGHT 2 - V16 - 1/31`, which is the January his 2026-08-17 rewrite
changed `Feb 2020` to. (Its ninth line reads `PINK` because that is an Aerosmith
song. Declared in the asset row so nobody later reads it as a link to the P!NK
tile.)

### The three questions, answered before anything was placed

**1. The tiles did not support a picture.** `profile` rendered `label` + `body`
and nothing else. The smallest way is three lines and **it does touch the shared
exhibit component** — there is no route-local renderer. But **the precedent is
in the same file for the same complaint**: `.vp-fe-plate`, added with the note
*"every surface needs something visually compelling besides written words…
OPTIONAL, SO NOTHING ELSE MOVES."* Same field name, same gate, same reasoning.
**The blast radius is one card, measured:** `profile` is declared by exactly one
face in the museum, and a lap of /wal, /robots, /foundation and /booth after the
change counted **0 profile cards, 0 plates, 0 console errors, 0 overflow**.

**2. `public/images/wb/`, not behind a door.** `/held/` is the STAGE hold and it
is scoped to `GOVERNED_PREFIX` = `/robots/` — the machines' pictures the Record
delivers one at a time. These are memorabilia on a live public card; `held/`
would render them for Mike and delete them at launch. `/locked/` is the
permission hold for /hr and is wrong twice over.

**3. There IS an existing pattern and these are not the first — the `c` field
already draws the line.** `/images/wal/*` (the artists' covers) are **VERIFIED**,
against a citation, because they are theirs; `/robots/reference/photos/*` and the
house artwork are **MIKE**, on the sentence *"the museum's own photographs of its
own unit"*. These four are MIKE on that same sentence. What is new is only the
context — the first museum-owned photographs of objects on an artist card. **No
new class was needed and none was invented.**

**WHAT DECLARING ONE COST:** four `assets.json` rows with `textInImage: true` and
the lettering transcribed — two setlists, three signatures, a yearbook cover —
because that field exists for the 2026-08-04 failure where marker lettering
painted into a JPEG was the largest placeholder in the building. Assets on the
boundary: **0 undeclared, text-bearing 18 → 22.**

### TWO DEFECTS FOUND BY MEASUREMENT, BOTH MINE

**(a) THE FIRST FRAME WAS `aspect-ratio: 4/3` AND IT WOULD HAVE DESTROYED TWO OF
THE FOUR.** The ratio was chosen before the files were measured. Then
`assets:scan` printed what they are:

```
cb-west-1981-antler         1144 x 1536   0.74  portrait
hunter-root-signed-setlist  1391 x 1847   0.75  portrait
rod-stewart-signed-ball     1169 x 1187   0.98  square
steven-tyler-setlist-...    1872 x 1278   1.46  landscape
```

A 4/3 landscape box over a 3/4 portrait crops away about 44% of its height — on
the Hunter setlist that is most of the songs and all three signatures. **The
photograph would have been of the object and the page would have shown a strip
of it.** Caught by a tool printing a number nobody asked it for.

**The rule is `height:auto` now and each picture keeps its own shape**, which the
block's own doctrine already argued for: *"NO MIN-HEIGHT, DELIBERATELY… padding
them to a common box would make the short one look unfinished."* Cropping four
objects to a common frame is that instinct one floor down, and it costs more — a
card's height is only layout; a photograph's crop is the object. **Measured after:
every drawn ratio matches its natural ratio to three decimals at both widths.**

**(b) `loading="lazy"` LEFT ALL FOUR UNLOADED AND COLLAPSED THE CARDS TO 1.8px.**
Three reasons it is gone, in order of weight: a profile card only exists when the
visitor is on it, so lazy cannot mean *only if needed*, only *later than needed*;
without a reserved box the card jumps 1.8px → 484.8px when the image lands; and
**it did not load at all under a probe** — the same family as the §8
`requestAnimationFrame` hazard, a browser deferring work in a frame it is not
painting. Correctness that depends on the frame being looked at is what that rule
forbids. Cost: four photographs, 1.26 MB, on a card the visitor has just opened.

### AND A THIRD DEFECT THAT WAS NOT MINE AND WOULD HAVE SHIPPED SILENTLY

**`assets:scan` SWEPT IN TWELVE GITIGNORED FILES.** Adding four photographs took
the table 385 → **409**: four photographs, eight comparison pictures, and twelve
files under `docs/shorts/out/`, which `.gitignore:60` excludes whole.

**A ROW IS COMMITTED; A GITIGNORED FILE IS NOT. So the row is BORN AN ORPHAN** —
correct on this machine the minute it is written, dangling on every clone and
every CI checkout. That is the M9 defect class (13 orphan rows open today)
manufactured on purpose, and the round that later finds them cannot tell them
from a real move.

The scanner has a `SKIP_PATH` list now, **by path and not by name** — the
directory is called `out` and skipping every `out/` in the repository to exclude
one would hide whatever a future round parks in another. **It is deliberately not
a `.gitignore` reader:** parsing that file would silently change this table's
population every time somebody edits it, and the population is a judged thing.

**AND THE FIX ALONE WAS NOT ENOUGH, WHICH IS THE PART WORTH KEEPING.** `--scan`
MERGES; it does not replace. With the skip in place the twelve rows written by
the first scan simply became *rows whose file is gone* (13 → 25) and stayed.
`asset-table.json` was restored from HEAD and re-scanned — **385 → 397, exactly
the four photographs and the eight comparison pictures, 0 removed, orphans back
to 13.**

---

## 10 — GATES, ON THE FINAL TREE

lint **9 / 8 = baseline** · build green · **launch build green** ·
`provenance:gate` **PASS** · `reveal:check` **PASS** · `parity:gate` **PASS** ·
`instory:gate` **PASS** · `docs:numbers` **PASS** · `reveal:day` **nothing to
move** · `assets:orphans` **13, 8 judged / 5 unjudged — unchanged (M9)**.

**`assets:gate` EXITS 1 AND THAT IS PRE-EXISTING.** It is the RECORD APPROVAL
gate: **0 of 39 presented assets have Mike's verdict**, including every favicon,
every /wal cover and the whole of the /wb audio. It is not in the packet gate
list for the reason `facts:gate` is not (Q-b): a gate that always fails is read
as noise and then skipped. My four join the 35 already waiting — register row
**M22**.

**THE REGISTER, ACROSS THIS PACKET:** 5 rows pruned, 3 added, **0 surviving rows
changed, 0 chains broken.** Anchors were checked before every prune and the
prune was run against a copy, per §9's four-step procedure. The shortened records
note carries the same six-key RESTATED chain as the row it replaced — checked,
because a RESTATED row's `r` must resolve and it is the only thing in the whole
boundary that notices a deletion.

**AND ONE FALSE PASS WORTH RECORDING.** A PowerShell loop running the gates and
reading `$LASTEXITCODE` reported `docs:numbers exit 0` while a direct run failed
on three stale row counts. **The loop was the thing at fault, not the gate** —
and it is the second measurement error in two packets, both caught by the result
being surprising. The published counts (`385` in `CLAUDE.md` and twice in
`OPERATIONS.md`) are now **397**.

**Nothing was pushed and nothing was deployed.**
