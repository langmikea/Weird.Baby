# M23 RULED + THE ALBUM ROUND — v51, 2026-08-04

Autonomous, single agent, drafting lane. Standing gates plus the provenance gate,
the vite build and a browser lap. No git until seal.

**What this round is.** Mike ruled on the two pairs of live alternatives v50 had
built for him, and both rulings went further than "pick one". Then he rebuilt the
robots wing's album art, moved and shrank the band above it, brought the top of
the viewer's type ramp down, and struck a number.

---

## 0. THE ONE-LINE ANSWER TO EACH ITEM

| Item | Outcome |
|---|---|
| **M23a** booth hook | **Both candidates deleted.** No replacement. The credo is the landing. |
| **M23b** guest book | **Scrolling wins, then changes:** three rows, a stepped page-advance with a bounce and a 5s rest. |
| **A1** album art | Two machine covers built on the ROBOTS template by a tool that lifts its constants from the ROBOTS tool. |
| **A2/A3** the band | Name centred under the active album, band 39.8px → 31.8px. |
| **A4** the viewer | The three ramp steps above body come down; title 27.03 → 24.37, display 31.95 → 26.62. |
| **A5** the 31½ logo | Struck, and the count with it in all three places. It emptied the provenance register's INVENTION class. |
| **A6** backlog | Two rows added, nothing built. |
| **A7** open actions | Two closed (C14, C15). One new defect found by closing one of them (C32). |

**Gates:** lint **11 errors / 9 warnings = baseline, zero new** · build **green,
70 modules** · provenance gate **PASS — 0 undeclared strings, 0 undeclared
assets, 0 stale rows, INVENTION 0** · asset table rescanned, **253 rows** · lap
at 1706px and at a genuine 386px viewport across nine routes, **zero horizontal
scroll everywhere**.

---

## 1. M23a — THE BOOTH IMAGE DIES, BOTH OF THEM

**Mike:** *"No ticket, no enamel sign, no replacement visual. THE TITLE IS THE
GRAB, and the copy already says it plainly. A picture arguing with text that
already works is clutter."*

**He struck the premise, not just the pair.** F1 built the ticket on the reading
that `/booth` was the building's purest failure of the VISUAL HOOK LAW — a sheet
of paper carrying a credo, eleven questions and an address, with nothing to look
at. N5 accepted that reading whole and argued only about WHICH object. The
ruling rejects it, and the reason is visible on the built page: **every word on
both candidates was already printed on that page.** The object was a picture of
the sentence, set on top of the sentence.

**Deleted:** `BoothTicket`, `BoothSign`, the `?hook=` selector, the
`useSearchParams` import, and ~180 lines of `InfoBooth.css` (the guilloche tint,
the perforation, the punch hole, the fired keyline, the four bolt gradients, and
the 680px block that stood their tilt down on a phone). All in one commit,
because a stylesheet holding rules for elements nothing renders is how the next
session finds a ticket in the codebase and puts it back.

**The exception is recorded, on his instruction** — *a page whose own words are
the hook needs no image* — in `STATE.md` under the Visual Hook Law, with the
scope stated: it applies where the landing is a short declarative set large and
an object could only restate it. It is not a licence to stop hooking a wall of
running text, which is what the law was written against.

---

## 2. M23b — THE GUEST BOOK, AND THE BEHAVIOUR CHANGES WITH THE RULING

**Deleted:** the static list as a shipped alternative, the `?book=` switch, the
`wb-book-drift` keyframes, the fade mask, and the two `max-height` media queries
that stepped a seven-row window down to five and then three.

**Built:** three rows visible, and a stepped advance.

- **The stop is a PAGE, not a row.** This is what makes *"tune the pause long
  enough to read three entries"* a quantity that can be tuned at all — advancing
  one signature at a time would mean two of the three had already been read at
  the previous stop. Each rest presents three signatures nobody has seen.
- **The rest is 5.0s against a 0.52s move**, so the book is still 90% of the
  time. Measured live: moves at 1.0s, 6.1s, 11.2s.
- **The bounce is one easing**, `cubic-bezier(.34,1.3,.64,1)` — it overshoots
  the stop and settles, which is what a hinged board does.
- **The wrap is arithmetic rather than a keyframe.** The track runs past the end
  of the first copy and drops back one copy's worth on `transitionend` with
  transitions off; the pixels are identical because the second copy is the
  first. Two copies are provably enough: the furthest the track reaches is
  `n+2`, the lowest row on screen is `n+4`, against `2n−1` available, which
  holds for every `n ≥ 5` — and 5 is already `SCROLL_MIN`. Verified live on a
  nine-signature book: `0 → 3 → 6 → 9 → 0`, no visible jump.
- **The `transitionend` handler is guarded** on `target === currentTarget` and
  `propertyName === "transform"`, because that event bubbles and a row that ever
  grew a transition would otherwise fire the wrap mid-page.

**The mask came off with the drift, and that is the one non-obvious deletion.**
N6 faded 14px top and bottom so rows surfaced and submerged instead of snapping
in at a hard edge — correct for something always moving. A stepped book rests ON
row boundaries, so the same gradient would sit permanently across the first and
last of the three visible rows and half-dim two of the three signatures a reader
is being given time to read. The whole point of the rest is that what is at rest
is fully legible.

**On the plain list still existing.** `GuestBookPlain` renders under
`prefers-reduced-motion: reduce` and under five signatures, and **nothing
selects it**. What Mike struck was the static book as a shipped ALTERNATIVE and
the switch that offered it; a fallback for a reader who asked their operating
system for no animation is the winner degrading, not the loser surviving. There
is no address that serves it by choice.

---

## 3. A1 — THE ALBUM ART, THIRD REVISION

**Mike:** *"use the ROBOTS art as the base — REPLACE the W.B logo with an image
of the unit, and REPLACE the word ROBOTS with the model number. Same treatment
for both albums so the wing shares one theme."*

`tools/make_unit_covers.py`. **Its constants are lifted from
`make_robots_cover.py` rather than re-chosen**, because "one theme" is a claim
about geometry and a hand-matched cover drifts the first time either is
re-rendered: same 1200² square, same paper, same 4px border at the same inset,
the same Georgia at the same size, the same rule, the same Courier strapline in
the same dim ink. The photograph goes into the disc the WB mark occupied, at the
mark's own measured diameter and top; the model number takes the word ROBOTS'
place.

**Two departures, both applied to BOTH machine covers so the pair cannot
diverge:**

- the rule drops **14px**, because "ROBOTS" has no descender and the base put the
  rule where one would be, and "MGK-VIIIp" has one;
- the letter-tracking is **solved per cover** rather than fixed, so nine glyphs
  set inside the same measure six do. A cover whose furniture moved to
  accommodate its own name would be the only one in the deck that did.

**MGK-VIIIp gets the instruction exactly:** `front_full.png`, the unit whole,
square on, sharp, and the disc crop takes it without cutting the machine.

**MGK-VIII cannot, and the reason is printed on its own wall.** This museum
holds no photograph of that machine whole — its archive is titled *DETAILS ONLY*
and its tombstone says *"Frame — Withheld: no plate carries the whole unit."* So
the badge is `head_lens.jpg`, the machine's face, which is the closest thing in
the set to a portrait and keeps V2's metered-revelation ruling intact. **Nothing
was generated, extended or composited to make a whole machine appear.**

**And it has a cost this round did not hide:** `head_lens.jpg` is also the still
on the MGK-NIAC face one press away, so the deck and the panel carry the same
photograph at once. `head_oblique.jpg` was rendered as the alternative and
compared on the built page; it is the weaker cover by a distance — off-centre,
unlit, a dark mass where the base cover puts a FACE looking out of the disc,
which is the theme the whole series inherits. Both ways out are Mike's: a
photograph of the unit whole (P4), or swapping the FACE's still. Ops did
neither. **Register M30.**

**What did not change:** the front desk keeps the ROBOTS cover — it is the base,
and it is the house rather than a unit. `viiip.png` stays in the build as the
tenth tile of its own Image Archive, where the composited BIOS beat is shown and
captioned; A8's crop is untouched. `mgk-viii-cover.jpg` is now referenced by
nothing and was **left on disk**, which is the same call `parts_drawer.jpg` got
at N1: a real photograph this museum owns is not deleted by a cover change, and
it is not re-homed onto a wall whose tombstone counts its plates. **Register M9,
now five files.**

---

## 4. A2 / A3 — THE NAME MOVES TO THE MIDDLE, AND THE BAND GETS SHORTER

**What left-alignment was saying by accident.** The band spans the WHOLE body —
the tracklist column and the viewer column both hang off it — and its title sat
40px from the left edge. On the glass that reads as the TRACKLIST'S heading, and
it was 700px from the cover it names.

**Measured, before and after:**

| | before | after |
|---|---|---|
| band height @1706px | 39.76px | **31.76px** |
| title centre @1706px | 173 (album centre 845) | **845 = 845** |
| title centre @386px | 86 (album centre 185) | **185 = 185** |

**Why a grid and not an absolute centre.** `1fr auto 1fr` centres the middle
column by construction: the side tracks are equal by definition, so a transport
wide enough to need more room widens both and the name stays on the centre line,
just narrower. An absolute centre would have been one line and would have let
the name slide UNDER the transport.

**One property is load-bearing and is now documented in the file map:
`.ex-album-banner-aux` must NOT carry `min-width:0`.** A `1fr` track is
`minmax(auto,1fr)` and refuses to go below its item's min-content — which is the
only thing stopping the transport painting across the name. The first draft kept
the flex layout's `min-width:0` and measured the transport overflowing to
**x=−31** inside a bar starting at x=8, across a title at x=86. Found by
injecting an over-wide transport stub at 386px, not by reading the rule back.

**One thing does not get the centre, and it is stated rather than hidden.** At
**≤720px the one wing with a transport falls back to two columns** (name left,
transport right — where they both were before this round). The arithmetic: at
386px the band has 242px between its padding and gaps, the album's name wants
198, and equal side tracks make a transport of width w cost the centre 2w. Even
the phone transport's floor — bars, play, stop, an 11ch title — takes the name
below its own width. **There is no transport width at 386px for which a centred
name survives.** Scoped to `.ex-banner-console`, so /robots, /hr and /wb keep the
centred name at every width; and it does not depend on whether anything is
playing, so the bar cannot re-lay itself out under a reader's thumb.

---

## 5. A4 — THE TOP OF THE RAMP COMES DOWN

**Mike:** *"they overpower and cannot be balanced against the small type they
ride with. Bring the top of the scale down until the ramp reads as one system."*

**The second clause rules out the two obvious fixes.** The small end cannot come
up — `--fs-micro` and `--fs-small` carry rem floors precisely because P7 found
the small end unreadable at narrow windows. `--face-fs` cannot move — it is the
dial, and turning it takes the small type with it, which is P7's own stated
failure mode read backwards. So the three steps above body are the only lever.

Measured at a 1706px window, where `--face-fs` is at its 1.28rem ceiling:

| step | before | after |
|---|---|---|
| micro | 14.75 | 14.75 |
| small | 17.41 | 17.41 |
| body | 20.48 | 20.48 |
| lead | 23.35 | **22.32** |
| head | 27.03 | **24.37** |
| display | 31.95 | **26.62** |

Below body the steps stay wide at 1.18× — that width is what keeps a caption
clear of a register line. Above body they close to 1.09×. **Quietest to loudest
falls from 2.17× to 1.80×.** Five ranks are still legible as five ranks.

**Not one call site changed.** P7's law is that nothing on a face may set a raw
font-size — it picks a step — and a face needing a size the ramp does not have
extends the ramp. This edit changed the ramp's ratios and nothing else.

---

## 6. A5 — THE 31½ LOGO, AND WHAT WENT WITH IT

**Mike, and he asked for the law itself to be recorded:** *"if it does not help,
it hurts; if it does not need to be there, it needs to not be there."* Of the
card: *"it speaks out loud about something not meant to be spoken out loud and
dilutes the experience."*

It is now **Doctrine 16, THE LAW OF SUBTRACTION**, in `OPERATIONS.md` §7 and
mirrored in `STATE.md`. **It is not Doctrine 11 restated and this case is the
proof:** "Thirty-one and a half" is a fact about the collection, it passed the
visible-line test on every reading, it was true, and it was still wrong to set at
132pt. Doctrine 11 tests a line's SUBJECT; this one tests its NECESSITY.

**The sweep he asked for found three places and all three are gone:**

1. `CARD_TALLY` — the 132pt card;
2. its caption on the FAQ face, *"Thirty-one and a half."*;
3. the FAQ's own entry **"How many are there?"**, whose answer WAS the count.

The entry is **removed rather than re-answered**, because there is no honest
short answer to "how many are there" that does not print the number, and writing
a different one is invention. The FAQ now runs five questions. Every remaining
mention of the count in the tree is inside a source comment; nothing on the glass
prints it.

**IT EMPTIED THE PROVENANCE REGISTER'S INVENTION CLASS, which nobody predicted.**
Those three strings were **all three** of the museum's `INVENTION` rows — the
holding pen for content with no origin, awaiting Mike's ruling. The count is now
**0**, and the ceiling is ratcheted from 3 to **0** with it: declaring an
INVENTION again requires raising that number in the same commit, which is a
visible edit and is the point. **Closes register M1** — two houses printed two
counts of the same machines and the museum was waiting on Mike to pick; there is
nothing left here to reconcile. The robots repo still says 31.4 in its own words
draft, and that is that repo's to keep or change.

**WHAT IT COST, NAMED RATHER THAN PAPERED OVER: the FAQ face now ships with no
picture.** The card was its only object. Nothing replaced it — inventing a second
typographic card to fill the slot is the thing the ruling was against. That is a
live conflict with the Visual Hook Law, resolved the way Mike resolved the same
conflict on `/booth` in this same round. **Register M29.**

---

## 7. A6 — BACKLOGGED, NOT BUILT

Neither was designed, scoped or started.

- **M31 · PAPA EMAIL MANAGEMENT** — Ops triages everything arriving at
  `papa@weird.baby` and surfaces only what actually needs Mike. Low urgency. No
  mechanism for it exists today.
- **C33 · THE ADMIN DASHBOARD** — exclude Mike's and Ops' own hits; add a
  return-visitor signal or a coarser same-area proxy; extend the logbook to hold
  at least a week. **The second has a constraint the other two do not:**
  `/booth`'s privacy answer states that three columns are the whole of what the
  site records, so a returning-visitor signal either fits inside that claim or
  the claim changes first — and N5b is this house's own record of what happens
  when it does not.

---

## 8. A7 — THE MECHANICAL AND UNAMBIGUOUS ITEMS

**Two qualified, and the register now says why the rest did not.**

**C14 — a WebP named `.jpg`.** `jesse-welles-plate.jpg` renamed to `.webp`, its
one reference in `worth-a-listen.js` updated and its declaration in
`provenance/assets-declare.mjs` with it. Asset-table file-integrity mismatches
3 → 2; both survivors are unreferenced orphans inside M9.

**C15 — collage captions were not scrubbed for `[PAPA]`.** A3 scrubbed spread
HEADINGS; the tiles' own `label` and `date` print under the picture and in the
lightbox's caption line and were not scrubbed at all. `scrubFace` now scrubs
both, on `face.collage` and on every spread's `tiles`. **A tile whose caption is
entirely the operator's keeps its picture and loses its words** — the rule the
spread heads already set, and it also protects a tombstone that counts its plates
out loud. The caption strip renders only when there is something in it.

*Proved live rather than reasoned about:* a `[PAPA]` marker written into one
tile's whole label, page reloaded — **8 tiles still rendered, that tile printed
its date alone, `[PAPA]` appeared nowhere in `document.body.innerText`.** Test
edit reverted.

**Everything else in the register was left, and why:** M9, M26 and the Foundation
rows are Mike's rulings, not mechanics; C17's lint debt is documented as needing
semantic review, not a mechanical fix; C16, C29 and C30 need content that does
not exist.

---

## 9. WHAT THIS ROUND EXPOSES

Every item below is a row in `docs/OPEN_ACTIONS.md`. Nothing here is reported
only in this log.

1. **C32 — the asset table is keyed by PATH, so a rename silently drops every
   judgement on a file.** Found by doing one: the `.jpg → .webp` rename produced
   a fresh row with `what`, `quality`, `qualityNote`, `verdict` and `revealArc`
   all null, and the old row vanished with the old path. **Nothing warned.** That
   file's verdict happened to be unset so nothing of Mike's was lost; the next
   rename may not be so lucky, and the Record Approval Gate would then report a
   pass over a row nobody had inspected. `provenance/README.md` §4 already states
   the sibling hole — an approved picture can be REPLACED under its own verdict —
   and this is that hole's other half. The assessment on that file was carried
   across by hand this time.
2. **M29 — the `/robots` FAQ face ships with no picture.**
3. **M30 — the MGK-VIII's cover wears a detail, and it is the same plate the
   face below it shows.**
4. **M9 is now five files, 3.1 MB** — `mgk-viii-cover.jpg` joined it.
5. **M22 is now 44 shipped assets with no verdict** — the two new covers joined
   the shipped set, the old MGK-VIII cover left it. `npm run assets:checklist --
   --room <slug>` prints the inspection.
6. **The Visual Hook Law now has two text-only surfaces under its exception**,
   `/booth` and the `/robots` FAQ. Two is a pattern rather than an exception; a
   third should prompt a re-read of the law rather than a third invocation.
7. **The centring does not reach /wal on a phone** (§4). It is the only surface
   in the building where Mike's A2 does not apply, and the arithmetic says no
   transport is narrow enough to change that.

---

## 10. FILES TOUCHED

**Rendered source**
`src/routes/InfoBooth.jsx` · `src/routes/InfoBooth.css` · `src/routes/WbHome.jsx` ·
`src/routes/WbHome.css` · `src/routes/exhibit/Exhibit.jsx` ·
`src/routes/exhibit/Exhibit.css` · `src/data/artists/robots.js` ·
`src/data/artists/worth-a-listen.js`

**Assets**
`public/robots/art/mgk-viii-cover.png` (new) ·
`public/robots/art/mgk-viiip-cover.png` (new) ·
`public/images/wal/jesse-welles-plate.jpg → .webp` (renamed)

**Tools**
`tools/make_unit_covers.py` (new)

**Provenance**
`provenance/register.json` (18 stale rows pruned, ceiling 3 → 0) ·
`provenance/assets.json` · `provenance/assets-declare.mjs` ·
`provenance/asset-table.json`

**Docs**
`docs/OPEN_ACTIONS.md` · `docs/canonical/OPERATIONS.md` (Doctrine 16, file map,
header stamp) · `STATE.md` (THE LAW OF SUBTRACTION, the Visual Hook Law's
exception) · `CLAUDE.md` · this log
