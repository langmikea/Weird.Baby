# THE BINGE + TEMPLATE ROUND — run log (v35)

**Date:** 2026-08-02 · **Lane:** autonomous, single agent, drafting lane
**Brief:** D-BINGE / D-EPISODE / D-WEEKLY-EVERYWHERE + B1–B9
**Gates:** lint · vite build · browser lap (desktop + phone) — all below
**Deploy:** MIKE'S. Nothing was pushed or deployed from this round.

---

## What shipped, item by item

### D · The three doctrines — recorded
`STATE.md` gains **THE RELEASE DOCTRINES** above the Spotlight Doctrine.
D-BINGE and D-EPISODE are recorded with their build consequences named (a
container that breaks at 400 entries is not finished; an episode needs a slot
that carries a week). D-WEEKLY-EVERYWHERE is recorded as doctrine with **nothing
built**, plus five concrete notes on what automation would need — including the
one honest blocker: MV runs on Mike's laptop and no scheduler can reach it, which
is a hosting decision and the first real question of that workstream.

### B1 · Gift shop — house top billing on no-exhibit exits, and a view that resets
`src/routes/shop/GiftShop.jsx`.
Mike's ruling replaces P11's stated-not-decided reading: a direct arrival is not
an absence of an owner, it is the house's own room. `ownerKey` now falls through
to `wb` on a direct arrival, so Weird.Baby takes the top slot and all five are
shown.
The reset is real but was not where it looked: billing has always been derived
from the URL and was never stale — the SIGHT of it was, because the browser
restores the previous scroll offset. `history.scrollRestoration = "manual"` +
`scrollTo(0,0)` on mount and on any change of who is billed; restored on the way
out so the rest of the museum keeps the browser's own behaviour.

**Verified — all seven exit cases, against the real roster:**

| entry | top billing | shown | W.B listed |
|---|---|---|---|
| direct arrival | **Weird.Baby** | 5 | yes |
| `from=robots` | Weird.Baby | 5 | yes |
| `from=wb` | Weird.Baby | 5 | yes |
| `from=hr` | Hunter Root | 4 | no |
| `from=wal&owner=carsie-blanton` | Carsie Blanton | 4 | no |
| `from=wal&owner=hunter-root` | Hunter Root | 4 | no |
| `from=wal` (no owner) | — | 4 | no |

Order beneath is earliest-first with alphabetical ties in every case (HR
2026-04-05, then the WAL trio 2026-07-30 alphabetical). The last row is listed as
a judgment call in the review (J3): it cannot bill the house without breaking
Clause 3, which is the clause Mike reported broken.
Live re-entry check: scrolled, changed `?from=`, scroll returned to 0 and top
billing updated to Hunter Root.

### B2 · The guest book becomes the input-field template
`src/routes/WbHome.jsx`.
Both fields now use the "what brought you here" mechanics AND font: a bordered
box on the page's paper, the question INSIDE as placeholder, one face and one
size across the pair, border darkening on focus. Named `.wb-field` so the
template is a thing in the stylesheet rather than a habit — a third field is
correct by default.
Composition per Mike: the note full width; **"what should we call you?" at half
width and SIGN at half width, on the same line, directly below.** Button label
shortened to "Sign" — at half width the long label wrapped and unbalanced the
row, and it sits beside the field it acts on under a heading that already says
Guest Book.
Two things found while building it: the squash (`transform: scaleY(1.15)`) makes
an element PAINT 15% taller than its box, which is invisible on a full-width
block and reads as misalignment on a pair — removed from the row, and the stale
comment that had been paying for it corrected. And a flex row could not hold the
halves equal (368.67 vs 370.67 of a 739.33 line), so the row is a **grid** —
equal is now a property of the layout, not an outcome of it.
**Verified:** both halves 369.667px exactly, same line, same 41.264px height,
same font and size, note above.
P13's caption is superseded; its argument is preserved in the code with the
reason it lost. The deck's journal composer already conformed and was not
touched — the template is the mechanic, the type is the room's.

### B3 · Post-its get the collage's tilt
`src/routes/exhibit/Exhibit.jsx`.
The formula was `((ci * 5) % 5) - 2`. A multiple of five is never anything but
zero modulo five, so **every card in every deck was pinned at exactly −2°** — the
feature had never once worked. The wall it imitates uses a stride coprime with
its modulus. The decks now use the wall's own numbers.
**Verified** on Hunter Root's card: three distinct angles (−4°, 3°, 1°) across
six cards, visibly different in the glass.

### B4 · Robots is B&W only
`src/routes/exhibit/Exhibit.css` + the reader's own style.
The law was written per component, which is why the plate wall — added in a later
round, inheriting a renderer whose grayscale lived elsewhere — arrived in colour.
It is now **one rule scoped to the wing** (`.ex-root[data-exhibit="robots"]`), so
a surface added next month is monochrome by construction and nobody has to
remember. Files on disk untouched; the law applies where a plate is shown.
**Verified:** `grayscale(1) contrast(1.03)` computed on the plate tiles and in
the reader. WAL keeps its colour (checked on the shop and the artist cards).
**Flagged (J2):** the Portal's live twin is deliberately outside it — an iframe
of the machine's own running screen is not a photograph, and the wing's standing
rule is "photos are paper; video is television". One line closes it either way,
Mike's call.

### B5 · The plates pager — diagnosed, and it was one cause with two faces
`src/routes/exhibit/Exhibit.jsx`.
**Measured on the live page before touching anything:** the plate wall is a grid
that auto-fills to two tiles across in a 582px column, so nine plates stack five
rows deep and the block measures **1134px against a column that holds 758**. The
stage did exactly what it promises — gave it a column of its own, warned, and
overran — and `overflow:hidden` ate **376px, three plates, with no scrollbar to
reach them.** The footer, the only block left over, then took a page to itself:
**17px of type on an empty sheet**, which is the "page 2 renders BLANK".

Two fixes, because there were two defects:
1. **`data-stage-full` — a wall takes the PAGE**, at the page's full width. The
   same nine tiles auto-fill five across in 1203px and land in two rows.
   Splitting by tile was tried and rejected: it is what the component's own error
   message recommends, and it turns the wall into a strip of half-empty rows.
2. **The footer rides the transport**, which is the home it was built for.
   `footer={face.footer ? null : null}` — a ternary whose branches are the same
   value — had neutered the prop since it was written, so `Stage`'s footer slot
   had never been fed while the face's footer stranded itself as the last block.

**Then the lap found the same bug at phone width and it was fixed too (D7).** At
387px the sheet is 223px and the wall is 823px: six of nine plates clipped. A
full block that overruns is now divided into as many full pages as it needs, and
the division is measured off the grid's real **row** geometry — the obvious
arithmetic (height ÷ page) is wrong, because three tiles across a two-column grid
is two rows, not one and a half.

| | before | after |
|---|---|---|
| desktop 1707px | 2 pages · **376px clipped, 3 plates lost** · page 2 = a 17px footer | 2 pages · wall 5-across × 2 rows · **0px clipped** · 336px headroom |
| phone 387px | **600px clipped, 6 plates lost** | 8 pages (3 card + 5 wall, 2/2/2/2/1) · **all 9 reachable** · worst overflow **0px**, 54px headroom |

Desktop is byte-identical to the pre-chunking behaviour — the division path is
inert there by construction (one chunk, one page).

### B6 · MGK panels open in place
`src/routes/robots/RobotsExhibitFlow.jsx`.
The wall opened plates with `window.open(_blank)`. The old comment argued Mike's
case against itself: it reasoned that opening a plate "should not throw away the
exhibit the visitor is standing in", then threw the visitor into a browser tab
showing a bare 4.9MB PNG on white — no caption, no next plate, no way back but
the tab strip. Replaced with **the reader** (below). The new-tab path survives
only as a fallback for a door that carries no set, so a future outbound link
cannot land in a reader with nothing to read.
**Verified:** opens on the room · pages 1→9 and wraps · arrow keys · Escape ·
zero new tabs · the exhibit is still behind it on close.

### B8 · The manual becomes real — the ruling recorded, the container built
`src/data/artists/robots.js` + `Exhibit.jsx` + `Exhibit.css` + the reader.
**The ruling is recorded where the thing lives**, in full: the manual must be
ACTUAL SCANS of the ACTUAL manual via microfiche-class technology, and the
generated PDF/plates become **the source Mike prints and photographs** — not the
artifact. The reason is the one the face already gave for refusing transcription:
the typography is the evidence, and a rendering of typography is a drawing of
evidence.

B6 and B8 are **one build**, which is why they are one component: a reader that
pages and zooms a reel of photographed pages does B6's job for free, because a
wall of plates IS a reel with nine frames on it. One reader, two ways in.

**What the viewer needs — recorded in the data file so the scans are made once
and made right:**
- **≥ 2400px on the long edge** — what it takes to read 6pt corporate
  small-print at 1:1. This is the one thing that cannot be fixed later in code.
- **The whole page including its edges** — the margins carry the technicians'
  handwriting (§ MARGINS is already in the contents); a page cropped to its type
  block throws that away.
- **Reel order = reading order** — `plates` is ordered and the transport walks it.
- **Per frame: `label` and `date`** (the section mark) — both print on the rail.
- Zoom/page-turn are built.

The reel ships **empty and says so** — "The reader is built and the reel is
empty" — rather than promising. When the scans land they are `plates` entries in
that file and nothing else moves.
**Verified both paths:** empty state renders the honest note; and with three
frames temporarily loaded, "3 FRAMES / LOAD REEL" → reader at "§ 1 · Frame 1 of
3" → Next → "§ 2 · Frame 2 of 3" → Close. **Temporary data reverted and the file
confirmed clean** (0 occurrences, byte count back to 42,178).

### B9 · The Record takes evidence classes
`src/routes/exhibit/Exhibit.jsx` + `.css` + `src/data/artists/robots.js`.
A log entry may now carry `evidence` (a WORD — there is **no permitted list** in
the code or the CSS, so a class Mike invents next month needs no build), `wire`
(short lines in the machine's own register block) and `plates` (the same shape
the wall and the reader take, so a photograph attached to a Tuesday in 2024 opens
in the identical reader as a plate off the wall). No new species: three existing
vocabularies, now attachable to an entry. An entry declaring none renders exactly
as before.
The ten existing entries are classed from their own sentences (document ×2,
record ×4, correction, object, firmware, photograph) and the footer says the
classes are Mike's to confirm.
**The `wire` and `plates` payloads ship EMPTY and that is deliberate**: the only
photographs this repository holds are of the MGK unit as received, and attaching
them to entries about boxes, ads and restoration would be inventing provenance.
The container is the deliverable; the evidence is Mike's to bring.
One correction made during the lap: the class badge on its own row added ~20px to
each of ten rows and pushed the Record's index onto a second page. **A class badge
that costs a page of navigation is not paying for itself** — it now shares the
title's line and costs nothing. Back to Page 1 of 1, all ten rows.

### B7 · The adversarial template review
**`docs/TEMPLATE_ADVERSARIAL_REVIEW.md`** — the deliverable. 8 drift items fixed,
6 conformance items recommended with reproducible evidence, 4 judgment calls
listed for Mike, 5 templates verified holding, and a **template register** (§4)
naming what the fourteen templates actually ARE, because drift cannot be measured
without a baseline.

The two findings worth surfacing here:

- **J1 — the retired 2025 gold is still painting, on the most-used control.**
  30 live occurrences of `#b8974a` across five files. Verified painting right now
  on `/hr`: nine elements compute to `rgb(184,151,74)`, including **the player
  bar's play, volume and CC buttons**. This is the pre-2026 gold-on-dark accent
  on a museum whose `--wb-gold` has been photo black since the B&W rework.
  **Listed, not fixed** — it is a palette decision on the building's most-used
  control, and it reads as either leftover or a deliberate surviving warm accent.
  Either answer beats the current state, where a retired colour survives by
  inertia.
- **R1 — four visitor-facing surfaces use ZERO tokens.** 151 hard-coded colours,
  **96 of them byte-for-byte a `--wb-*` value that already exists.** GiftShop.css
  cites "museum-tokens" in its own header while using none of them. Verified this
  round that the tokens ARE reachable on every route, so nothing blocks the sweep
  but the typing. Recommended as its own gated round.

**One conformance fix was taken** (mechanical, three lines): the shop's and the
booth's wordmarks read `var(--wb-brand, …)` like the exhibit's, instead of the
literal `'Fredoka'`. `--wb-brand` is a LIVE trial — the fork meant moving it
would have changed one room in three, and a brand trial nobody can see whole
cannot be judged.

---

## GATES

**Lint — `npm run lint`: 11 errors / 9 warnings.** HEAD baseline is 11 / 10.
**Errors match baseline exactly; zero new findings.** Verified rigorously rather
than by the total: both runs' findings were normalised (line numbers stripped),
sorted and compared with `comm`. The ONLY difference in either direction is one
warning that HEAD had and this tree does not — *"Unused eslint-disable directive
(react-hooks/exhaustive-deps)"* at the Stage's plan effect. It stopped being
unused because the effect now reads `full` / `fullMeta`, which are deliberately
NOT in its deps (both are new objects every render; adding them would re-plan on
every render, and the document they describe is already captured by `deps` +
`blocks.length`). A dead directive became a working one.
Caught and fixed at this gate: the first run reported **12** errors. The extra
was a second `catch (e)` with an unused binding, added by this round beside a
pre-existing one that is documented debt. Changed to an optional catch binding —
new code should not add a twelfth error because an eleventh already exists.

**Build — `npx vite build`: green.** Client + worker, no warnings.

**Console: clean.** Fresh load of `/robots`, walked to the plates: three
messages, all vite/react-devtools INFO. **No `[stage]` overrun warnings**, which
is itself a gate — the stage warns when it crops, and it is silent.

**Browser lap — desktop (1707×811):**
`/` guest book measured · `/shop` all seven billing cases + reset · `/hr` player
bar and tracklist (and the J1 gold caught here) · `/wal` Hunter Root card, three
decks, tilts · `/robots` **every one of the six MGK tracks walked** (Plates 2pp,
Record 1pp, Manual 2pp, Firmware 1pp, Portal panel face, FAQ 1pp) plus the front
desk · `/wb` and `/booth` render unregressed.

**Browser lap — phone (387×841): by genuine narrow viewport, not by
measurement.** The window manager refused `resize_window` again (the hazard
STATE banked last round — `outerWidth` reports 313 while `innerWidth` stays
1549). Worked around it with a **same-origin 390px iframe**, in which media
queries genuinely fire (`max-width:720` and `max-width:640` both matched) — a
real narrow viewport rather than a proxy. That is what caught D7, which a
min-content probe would not have found. **Recommended as the standard phone
technique for this repo until the window manager cooperates.**

---

## Files touched

Bytes are HEAD → working tree, read off disk at seal time.

```
src/routes/exhibit/Exhibit.jsx           B3 B5 B6 B8 B9   160,489 →  181,410
src/routes/exhibit/Exhibit.css           B4 B8 B9         100,568 →  106,789
src/routes/robots/RobotsExhibitFlow.jsx  B6 B8             14,371 →   23,924
src/data/artists/robots.js               B8 B9             37,193 →   42,178
src/routes/WbHome.jsx                    B2                21,242 →   25,233
src/routes/shop/GiftShop.jsx             B1                 9,095 →   11,178
src/routes/shop/GiftShop.css             B7/R2             10,124 →   10,679
src/routes/InfoBooth.jsx                 B7/R2              8,653 →    8,761
STATE.md                                 D + seal
docs/TEMPLATE_ADVERSARIAL_REVIEW.md      B7                       new
docs/MUSEUM_BINGE_TEMPLATE_LOG-20260802.md                        new (this file)
```

Nothing else was touched. `museum-tokens.css` untouched. `HrExhibitFlow.jsx` and
`.css` untouched (the journal composer was inspected and found already
conforming). No MV read, no export, no deploy.

---

## Open / carried forward

- **J1 the retired gold** — the one question worth answering first; it is
  painting on every page with a player bar.
- **J2 the twin's colour** vs the B&W law — one line either way.
- **J3 a WAL exit with no owner** bills nobody — correct under the law, but a
  stale link lands on the look B1 rejected.
- **R1 the token sweep** (96 mechanical substitutions + ~55 decisions), and R3
  the overlay primitive (8 overlays, 6 duplicated Escape handlers) — each its own
  round.
- **The manual's scans** — Mike's to make, to the spec recorded in `robots.js`.
- **The Record's evidence payloads** — Mike's to bring; the model accepts them.
- **D-WEEKLY-EVERYWHERE** — doctrine only; the first real question is whether MV
  can be reached by a scheduler.
