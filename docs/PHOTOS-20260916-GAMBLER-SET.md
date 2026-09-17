# THE GAMBLER SET — what Mike shot on 2026-09-16, sorted (the baseline)

Mike, 09-16, recovering: "I took photos and videos and placed them into
Desktop › Weird.Baby › New folder. Sort through it and when I return we can
use this as a baseline to decide what is next."

Folder: `C:\Users\macun\OneDrive\Desktop - Laptop\Weird.Baby\New folder`
(OneDrive; the files were cloud-only until read). Nothing moved, renamed or
edited. Served page with the contact sheets: docs/desk/GAMBLER-SET.html.

## What is there

| count | what | frames |
|---|---|---|
| 50 | photographs, iPhone, 3024x4032, top-down on the white tray, steel rule in frame, shot 12:42 to 13:02 | IMG_0196 to IMG_0245 |
| 32 | Live Photo movies, 3 s each, 1744x1308, one per photograph from 0213 on | IMG_0213 to IMG_0245 .MOV |
| 1 | a 4K clip, 9.2 s, 60 fps, handheld: the Everyday unit on a white ground, turned in the hand, plate on | IMG_0249.MOV |
| 1 | a stray 1.2 s clip of the floor | IMG_0246.MOV (discard) |

## The subjects, in shooting order

| frames | subject | notes |
|---|---|---|
| 0196 | the slate: Mike's Gambler to-do card, handwritten | CASE: leather "ABEAL" label · hold-downs for cards and chips · glue blocks down · touch up. UNIT: faceplate. OTHER: mark and strip. |
| 0197–0198 | the Gambler's case, open: the unit in the upper well, cards and chips in the lower, the strap | the cover candidate under the 09-11 ruling (the full artifact) |
| 0199–0202 | the MGK-PHVDC, two positions, the cable coiled | kit |
| 0203–0206 | the casino chips, fifteen, laid in three columns | kit; four frames, small moves between them |
| 0207–0210 | a single chip, a dice cup on its side, a cup upright, two cups | kit, singles |
| 0211–0215 | the half dollars, ten to fifteen coins, three columns, one gold-toned | kit; the coins that arrived last weekend |
| 0216–0218 | a single coin, three frames | kit |
| 0219 | a hand placing a small boxed item | the Live Photo shows the placing |
| 0220–0225 | small pieces: a die, a bolt, a bulb, a screw, a small tool | kit, singles; the hand enters 0223 and 0225 |
| 0226–0234 | the book "Marked Cards and Loaded Dice" (Garcia): cover, spine, back, open, with a dice cup on the page | papers |
| 0235–0236 | "The Blue Book" (K.C. Card Co.): cover, back | papers |
| 0237–0245 | The Blue Book, nine spreads, held open by hand | papers; the hands are in every frame |
| 0249 | the Everyday, 4K, on white, turning | the first "turn" element, and colour hero material |

## What it serves, read against the rulings

- **The album's kit and papers** (Q4 of 09-11): every object in the Gambler's
  kit row of the catalogue is here, and two documents the catalogue does not
  yet list: the Garcia book and the Blue Book. Two catalogue rows to add.
- **The cover** (ruled 09-11: the full artifact, the case): 0197 and 0198 are
  the case open; a closed-case frame is not in the set.
- **The 4K clip** is the first element take that exists, and it is of the
  Everyday on white, not on the tray: it is also the first colour-on-white
  material, which the cover ruling (Q3, 09-10) asked for.
- **The slate card is the finished-state list** for the Gambler under ruling
  25: the case's label, hold-downs, glued blocks and touch-up are still to
  do, and the faceplate is out of scope by his own ruling. So this set is
  the record of the kit **before** finishing, or a rehearsal of the setup,
  not the finished plates. That is a fact about sequence, not a fault.
- **What did not land:** the Everyday element takes of Tuesday 09-15 (knob,
  turn, handheld, the glass plate) are not in the practice intake; the
  calendar row stays open. The 4K clip is a start on one of the four.
- **Treatment:** the strength-3 "handled" scan treatment, cropped inside the
  tray, applies to every tray frame here exactly as ruled on 09-10; the
  Live Photos give three seconds of motion per frame for the reel line's
  fly-by, which the 09-10 ruling asked to keep in mind.

## Questions for when Mike is back (one at a time, A/B/C)

1. **This set is:** A the before-record, kept as evidence and re-shot
   after the finishing work · B the album's plates as they are, finishing or
   not · C a rehearsal of the setup only; nothing from it is used.
2. **Where it goes:** A into OneDrive › WeirdBaby › photos › gambler and
   originals › 2026-09-16, untouched, and the manifest starts from it ·
   B stays in New folder until the finishing work is done · C into the repo.
3. **The two books** (Garcia; the Blue Book): A two new catalogue rows under
   the Gambler's papers, for the 09-20 sitting · B one row, "the Gambler's
   library" · C not on the wing.

## 2026-09-17, late: the set stands in (ruling C of the calendar re-cut)

Mike ruled the photo-set fork **C: both, Gambler first** — the 09-16 set
stands in on the Gambler's page now so the wing can be built and judged; the
tray re-shoot (B&W plates, a colour hero on white) replaces the plates album
by album, the Everyman's first. Questions 1 to 3 above are not otherwise
answered; the set is placed as the before-record it is.

**What was built (tools/photos-build.py, photos/manifest.json):**

- One manifest row per original, fifty rows, the originals untouched where
  Mike put them (New folder). The crop rule of 09-17 applied: at least the
  tray's floor, usually far beyond it, down to one element; the tool finds
  the subject, pads it, squares it to 4:5 or 5:4, and drops the steel rule
  whole when the subject stands clear of it (kept whole when it does not).
  A row can carry a hand-set box instead (the slate does).
- The treatment: strength 3, the handled print, on every frame; the annotation
  layer is reserved and empty.
- The prints land under `public/held/robots/photos/gambler/` (the stage hold)
  as a 1600 px print and a 640 px tile each, and `src/data/photos/gambler.json`
  lists them by their public address. `robots-albums.js` reads that file:
  the Image Archive gets six groupings (the case, the kit, the chips, the
  half dollars, the library, the slate) and "Every photograph"; the Kit's two
  catalogue rows carry a print each; the two books sit on The Papers as
  imaged documents (cover, spine, spreads) until question 3 rules their
  catalogue rows; the cover ring carries the case open (0197), a stand-in
  until the colour shoot.
- Six small pieces (0220–0225) are labelled "A small piece from the kit"
  until the re-shoot's slate cards name them.
