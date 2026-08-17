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
