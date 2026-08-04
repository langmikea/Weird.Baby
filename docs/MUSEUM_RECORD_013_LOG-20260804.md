# RECORD 013 — THE PROTOTYPE ENTRY (v45)

Autonomous single-agent Code-lane round on Mike's remote-control brief,
2026-08-04. Frames: `docs/record-013-20260804/`.

**Scope, as briefed:** build ONE record entry as a real page so the CONTAINER
can be reviewed in situ. The other fifty-nine entries are NOT written this
round — the form gets proven first.

---

## What was built

| # | Thing | Where |
|---|---|---|
| R1 | The record-entry container — headline, dateline, lead, 4–7 sections, tombstone | `src/routes/exhibit/RecordEntry.jsx` (new), `Exhibit.css` |
| R2 | The four doors — TV / film strip / safe / newspaper, inline, overlay-in-place | same |
| R3 | Record 013 as real content | `src/data/artists/robots.js` |
| — | The dateline arithmetic (week + weekday derived from the date) | `src/lib/record-model.js` |
| — | The delegation seam | `src/routes/exhibit/Exhibit.jsx` |

Five files. No token file touched, no routing change, no data export, no
existing entry moved a byte.

---

## R1 — THE SHAPE, BUILT TO THE RULING

Headline · dateline (`WEEK n · DAY · Record nnn`) · blockquote-weight lead ·
four-to-seven labelled sections · closing italic tombstone. Verified on the
built bundle: six sections, all six labels rendering, the dateline printing
**`17 JAN 24 · WEEK 3 · WEDNESDAY · RECORD 013`**.

**WEIGHT VARIES BY WHAT HAPPENED, AND THAT IS ENFORCED BY BUILDING NOTHING.**
Mike's instruction was explicit — no formula, no fixed proportions. So a
section is a label and a body and nothing else: no `min-height`, no grid
track, no equalising gap, no cap. Record 013's longest section (the batteries
conversation) runs eleven lines and its shortest (also today, briefly) runs
four, and the page does not try to fix that. The only rhythm is BETWEEN
sections, and it is R1's existing `--rh-sect` step rather than a new number.

**IT IS A NEW FILE, NOT A NEW `entriesMode`.** The switch is the house's own
and it is the data: **an entry that declares `sections` renders the long form;
an entry that does not is byte-identical to before** — the same rule as `img`
on an entry (F1), `wire`/`plates` on a record (B9), `docs` (L6). Proved on
glass: opening "Three boxes" from inside Record 013 renders the LEGACY shape
(`.vp-rec-sects` absent), and walking ‹ NEWER three times returns to Record 013.

The component returns a FRAGMENT, so its parts stay siblings in the same
container — L6's ruling that an opened record is a run of blocks survives, the
flat wing's rhythm ladder sees the shape it already knows, and the mothballed
packer would see a list it can page.

**THE DATELINE IS ARITHMETIC, NOT AUTHORING.** `entryWeekday` and `entryWeek`
derive from the entry's own `date` plus a `recordEpoch` declared on the face
(`2024-01-01`, the drop). Sixty entries authoring their own week number by
hand is sixty chances for a week to disagree with its own date. Both are UTC
by construction, for the same reason `entryDate` parses by hand: a weekday
that changes with the reader's timezone is not a weekday.

**THE RECORD NUMBER IS AUTHORED AND CANNOT BE OTHERWISE**, and this is a
finding rather than a shortcut: position in the list is not the number. This
volume is a SAMPLE of a 436-record log, entries are not one per day, and
numbering by index would renumber the whole volume the day one is inserted.
An entry with no `no` prints no number — which is the state the other ten are
in, honestly, and is named in R5 below as work the full Record needs.

Degradation checked, not assumed: no epoch → no week; no `no` → no number;
no date → an empty dateline. Nothing fills a gap with a guess.

---

## R2 — THE DOORS

Mike's three laws: **inline, in the sentence · never a new window · always an
overlay that pops in place and closes back to exactly where you were.**

A door sets in the sentence via a `[[n]]` marker in the section body, split
out at render. A door declared but never placed still renders, at the end of
the section — an affordance silently swallowed by a typo in a marker is the
worst failure this could have, so it cannot happen.

| Door | State | What it does | Verified |
|---|---|---|---|
| **TV** | REAL | Dispatches the wing's own `wb-robots-open-twin` with the existing `record-day` recipe and the entry's own date | Twin opens at `/robots/twin.html?user=1&preset=record-day&day=2024-01-17`; the machine's own log prints **`[RECIPE] record-day — weather seeded from 2024-01-17 (1429620358) · install level 2 · power on`**. Escape closes it back to Record 013 with the dateline intact. |
| **SAFE** | REAL | Opens the wing's reader (the identical instrument a plate off the wall opens in) on a two-frame set | Reader opens `rear_power_switch.png`, rail reads "The back of the unit · REAR · Frame 1 of 2", Prev/Next/Magnify/Close present; Close returns to Record 013. |
| **NEWSPAPER** | REAL | Pops the target record's head in place — stamp, headline, lead — with OPEN THIS RECORD / BACK | Peek shows "Three boxes"; BACK, Escape and the backdrop all close to exactly where you were; OPEN THIS RECORD navigates and closes the peek with it. |
| **FILM STRIP** | HONEST PLACEHOLDER | Opens a note saying what is not here and why | Prints: not published, the camera was running for something else, the clip is not cut, and this wing has no in-place player to open it in. |

**THE SAFE-OR-LIBRARY CHOICE, STATED AS ASKED: SAFE.** At the size these draw
— about one line of running text — a library's signature is columns and books
and both are sub-pixel. A safe's signature is ONE CIRCLE ON ONE RECTANGLE,
which survives any size a browser will draw it at.

**WHY THE FILM DOOR IS A PLACEHOLDER RATHER THAN A LINK.** The clip exists in
the fiction and does not exist as an asset; more to the point, this wing
declares `videos: []` and `playerBar: false`, so there is no in-place moving-
picture surface to open into. A door that opened a browser tab would break the
second and third of Mike's three laws. It responds, and what it opens is the
reason — the same discipline as B8's empty reel and L6's `held` document.

**A DOOR CARRIES A WORD, NOT ONLY A GLYPH.** Mike's bar is "intuitively
obvious on first or second click", and an unlabelled 16px icon inside a
sentence is a guess on the first click. Icon + two or three words is a door
you can read, and it still sets inline. `title` and `aria-label` name the KIND
as well ("the archive — the back of the unit, in the archive").

**ONE DEFECT CAUGHT ON GLASS AND FIXED.** With `.12em` of margin on both
sides, "…and then left alone[[1]]. It is not…" printed a visible space between
the door and its full stop — punctuation floating off the end of a clause,
which reads as a typo rather than as a door. A door needs air on the side it
meets a WORD on and none on the side it meets punctuation. Right margin
removed; re-measured, the gap before the period is **0px**.

---

## R3 — THE CONTENT

Mike's approved draft, used as-is in substance. Six sections in his order,
the lead and the tombstone as he wrote them. Voice is the geek-noid colour
commentary: techno-jargon, honest about uncertainty, dry, never breathless
("the failure modes run from *nothing happens*, which is the overwhelming
favourite, through *a smell we regret*, to *the building has a bad
afternoon*").

**Dated 2024-01-17**, which is Week 3 Wednesday against the drop — verified
arithmetically, not assumed. It slots between the existing 12 Jan and 19 Jan
entries and nothing around it moved.

**The face's footer stopped saying "first layer only"**, because one of these
is no longer a first layer and a footer that counts wrong is the first thing a
careful reader catches. It now reads eleven of 436, ten first layer, one
written whole.

---

## R4 — THE STANDING LAWS

| Law | How it is met |
|---|---|
| **The Stage / no scroll traps** | **Zero** inner scrollers measured inside the record at 390px — the document scrolls, which is ordinary reading. The two overlays are sized to their content: the peek card measures 339×246 in a 740px frame and does not scroll internally. |
| **The visual hook law** | The entry opens on a photograph the museum already owns — the back of the unit as shot on arrival, which is where the cover and the indicator this entry is about actually are. It is a DOOR as well: clicking it opens the reader. Captioned only with what is visible in the frame, and it says outright that nothing in this entry has been photographed yet. |
| **B&W** | The plate is `img` inside `[data-exhibit="robots"]`, so L5's one-rule photo law greys it by construction. The door glyphs are inline SVG on `currentColor` — outside that rule by nature, monochrome by construction, and they tint as one object with their own label. |
| **Paper card on the dark stage** | Verified on the built page: `.vp-face-body` `rgb(250,248,243)` on `.vp-face` `rgb(231,227,216)` — V1's sheet-on-mat, unchanged. |
| **Fraunces body type** | Every reading surface is `var(--wb-read)`; measured `Fraunces, "Source Serif 4", Georgia, serif` at 16.59px/26.87px, measure **601.5px** — the house's 56ch ≈ 67 characters. |
| **No hidden information** | Nothing collapses, pages, truncates or hides behind a "more". Every section is visible. The only thing that overlays is a door, and a door is a destination the reader chose. |

---

## R5 — WHAT A FULL 60-ENTRY RECORD NEEDS THAT ONE ENTRY DOES NOT EXPOSE

Honest list. None of these is built and none of them was in scope.

1. **THE RECORD NUMBER HAS NO SOURCE.** Record 013 carries `no: 13` because
   Mike's brief names it. The other ten carry nothing and print nothing.
   Sixty entries need a decision: are the numbers the full 436-record
   numbering (in which case the ten need theirs looked up), or a numbering of
   this volume (in which case they are derived and the word "Record 013" means
   something different)? **A volume where some entries have numbers and some
   do not is the visible symptom of an undecided question**, and it is
   currently on the page.

2. **PAGINATION AT SCALE.** The index renders every entry. Eleven rows is a
   list; four hundred is a scroll. `shouldBand` already bands by month at ≥14
   entries and >1 month — that machinery exists and is untested at volume,
   because today's Record trips neither condition. Sixty entries WILL trip
   both, so the first thing a sixty-entry Record does is turn on a feature
   nobody has looked at.

3. **THE TIMELINE THERMOMETER.** `‹ NEWER / OLDER ›` says "8 of 11" and that
   is all the position a reader gets. At sixty it needs to say WHERE in the
   run you are — how far back, how much is left, which month you are standing
   in. A count is a position; it is not a map.

4. **THE INDEX HAS NO FILTER AND NO SEARCH.** `evidence` classes and the
   `evidenceOf` load counts already ride the index rows precisely so a reader
   can see what a week brought before opening it — and there is nothing that
   lets them ask for only the corrections, or only the weeks that brought
   photographs. At eleven rows the eye does it; at sixty it cannot.

5. **NEXT/PREV SKIPS NOTHING, INCLUDING THE THINGS IT SHOULD.** The walk is
   strictly adjacent. A sixty-entry Record wants at least "next entry that
   carries evidence" or "next correction" — the log's own spine, which is not
   the same as its chronology.

6. **A CROSS-REFERENCE HAS NO REVERSE.** Record 013's newspaper door points at
   "Three boxes"; "Three boxes" does not know it is pointed at. At sixty
   entries with a web of references, the entries being referred TO are the
   ones a reader arrives at, and they are the ones with no way onward.

7. **THE MARKER SYNTAX IS UNPOLICED.** `[[2]]` in a section with one door
   renders nothing at that spot and the door lands at the end. That is the
   right failure — nothing is lost — but at sixty entries it wants a build-time
   check rather than a reader noticing a door in the wrong place.

8. **SIXTY ENTRIES ARE SIXTY HOOKS.** The visual hook law binds every one of
   them, and this entry met it by borrowing a plate the wing already owned.
   That trick does not scale to sixty: the wing has eight photographs. **The
   Record's real answer is its evidence photographed, one picture per dated
   entry**, which is exactly what the visual-hook audit named and is still
   ART-pending.

9. **THE SECOND ENTRY IS THE REAL TEST OF THE FORM.** One entry cannot show
   whether the sections' all-caps labels start rhyming, whether two adjacent
   entries read as the same shape twice, or whether the tombstone becomes a
   formula. **Mike should read entry two before fifty-eight more are written.**

---

## Gates

- **`npm run lint` — 11 errors / 9 warnings, identical to the HEAD baseline,
  zero new.** Two errors WERE introduced and both were fixed properly rather
  than suppressed: a module-level regex whose `lastIndex` was reset during
  render (rewritten as a stateless `split` on a capturing group) and a
  `setState` inside an effect watching a prop (replaced by a `walk()` handler
  at the three call sites that can actually change the open record).
- **`npm run build` green**, 73 modules (72 + the new component).
- **Desktop lap** on the BUILT bundle via `wrangler dev`: zero page-level
  horizontal scroll, plate inside the sheet (right edge 1161.7 against 1189.7),
  measure 601.5px, all four doors fire, all four close back to Record 013.
- **Genuine 390×740 same-origin iframe lap**: zero horizontal scroll, one
  column at 323px, the plate unfloats (`float: none`), the evidence badge
  renders, the peek card fits at 339×246, **zero inner scrollers**.
- **No lap harness was written to the repo** — the 390px frame was an injected
  iframe and the icon-inspection overlay was injected and removed.

**One honest note about the evidence.** Chrome's screenshot pipeline was
unstable for this session — roughly every second `Page.captureScreenshot`
returned a stale or blank frame, and several timed out at 30s. The five frames
in `docs/record-013-20260804/` are the ones that came back clean. **The
load-bearing verification was not the screenshots**: it was DOM measurement on
the built page and functional door tests (click → assert the overlay/iframe/
reader appeared with the right content → close → assert we are back on Record
013), which is stronger evidence than a JPEG and is what every claim above
rests on.

---

## Carried, named not fixed

- Everything in R5.
- The Record's evidence is still unphotographed; the hook is a borrowed plate
  and the entry says so out loud.
- `docs/VISUAL_HOOK_AUDIT-20260803.md` lists The Record's depth as ART-pending.
  This round does not close that; it makes the container ready for it, since
  an entry's `still` is one string per entry when the camera comes out.
