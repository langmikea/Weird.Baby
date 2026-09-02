# THE ALBUM ART SURVEY — 2026-08-26

**Read-only round. Built at HEAD `f366d37`, clean tree, nothing written into the
museum repo. No generator was run.** Every render below was produced by
importing `build()` and comparing **in memory**; `.save()` was never called and
`main()` was never entered. Where a claim is visual it was made by LOOKING at
the file, not by reading the code that wrote it.

---

## 0 · WHAT MIKE MUST DECIDE — and the trap that must be closed either way

**THE ANSWER TO HIS RULING CHANGES ONE FILE OF SIX, NOT SIX OF SIX.** "Remove
the W.B logo from the standard gray albums" reaches **five** sleeves. The sixth
row in the generator's list is a **live grenade** and is unrelated to his
ruling.

**AND THE TRAP IS BIGGER THAN THE BRIEF SAYS. THERE ARE THREE OF THEM, NOT ONE.**
`covers:house`, `covers:robots` and `covers:template` each destroy hand-supplied
art on their next run. Only `covers:unit` has a fence.

| npm script | on run, destroys | what it writes instead |
|---|---|---|
| `covers:house` | `public/images/wb/vol1-cover.png` — **Mike's vinyl master** | grey sleeve, `THE MAKING / OF BOWB V1` — a name retired 2026-08-13 |
| `covers:robots` | `public/robots/art/wbr-cover-logo.png` — **Mike's own `NEW Robots.png`** | template sleeve, rule 69px higher |
| `covers:template` | `mgk-niac-cover.png` + `mgk-viiip-cover.png` — **Mikey's hand art** | ring-and-type sleeve, **no photograph** |
| `covers:foundation` | `ledger-cover.png`, `contribute-cover.png` | the pre-A3 markless typographic covers Mike ruled against |
| `covers:unit` | **nothing — it raises `HandAuthoredCover` and stops** | — |

---

## 1 · WHICH COVERS ARE THE STANDARD GREY ALBUMS

**Six paths are in `tools/make_house_covers.py`'s `COVERS` list. FIVE of them
are the standard grey albums. The sixth is not a grey album at all.**

Proof, and it is a pixel proof rather than a reading: each path was compared
against what `build()` produces from the same row today.

| # | file | word in the pixels | strapline in the pixels | vs generator |
|---|---|---|---|---|
| 1 | `public/images/foundation/foundation-cover.png` | THE / FOUNDATION | THE WEIRD.BABY FOUNDATION | **byte-for-pixel IDENTICAL** |
| 2 | `public/images/foundation/ledger-cover.png` | THE LEDGER | THE WEIRD.BABY FOUNDATION | **IDENTICAL** |
| 3 | `public/images/foundation/contribute-cover.png` | CONTRIBUTE | THE WEIRD.BABY FOUNDATION | **IDENTICAL** |
| 4 | `public/images/wb/about-cover.png` | ABOUT THE / ARTIST | WEIRD.BABY MUSIC | **IDENTICAL** |
| 5 | `public/images/wal/worth-a-listen-cover.png` | WORTH / A LISTEN | WEIRD.BABY | **IDENTICAL** |
| — | `public/images/wb/vol1-cover.png` | *(Mike's art)* | *(none)* | **DIFFERS over the whole 1200×1200 frame** |

Rows 1–5 are `colorType 2` (RGB, no alpha), 199–274 KB, zero coloured pixels.
`vol1-cover.png` is `colorType 6` (RGBA), **1,375,277 bytes**, carries Photoshop
`gamma`/`dpi` chunks and **11,504 coloured pixels**. It is not of this series and
never was.

### THE LOGO IS THE SAME OBJECT ON ALL FIVE, AND IT IS ONE FILE

**`public/WeirdBaby_PhotoID.png`** — the photographic baby inside a heavy black
ring, with the outline-face **`Weird.Baby`** wordmark laid across the chest.
`build()` greyscales it, trims it to its own ink, scales it to **0.58 S** and
pastes it at **y = 0.070 S**. On a one-line album name it occupies the top ~58%
of the square; on a two-line name it is shrunk by exactly one line's height so
the rule, strapline and border never move.

**IT IS THE ONLY THING ON THESE COVERS THAT IS NOT TYPE.** Everything else is
paper, a 4px ruled border, Georgia caps, a 4px rule and a Courier strapline.

### WHAT REMOVING IT LEAVES — and this is the load-bearing finding

**It leaves the covers `make_foundation_covers.py` already made, and those are
the covers Mike rejected on 2026-08-06.** The A3 ruling in the generator's own
header is explicit about why:

> "THE ROBOTS GRAY ALBUM ART IS THE STANDARD — its size, spacing, and the fact
> that it does NOT fade into the background at the carousel's edges."

The diagnosis recorded beneath it is arithmetic, not taste: the cover's field is
`PAPER = (217,213,202)`, which **is `--wb-bg`, which is the carousel's own
ground.** A markless cover has nothing but its keyline to show, so at ring 2 and
beyond, tilted and hazed, *"there is no card there at all"* — measured on
`/foundation`, where FAQ and CONTRIBUTE read as outlines floating on the page.

**THE MARK IS THE ONLY INK IN THE FIELD.** Measured on `foundation-cover.png`:
1,181,798 of 1,440,000 pixels are bare paper. Take the mark out and the figure
goes higher — the type sits in the lower half and the top 58% becomes empty
ground.

**SO HIS RULING AND THE A3 RULING COLLIDE, AND IT IS A UX COLLISION, NOT A
TECHNICAL ONE.** He rules what a visitor sees. The honest statement of the cost
is: *the five grey sleeves will fade at the carousel's edges again unless
something else fills the field.* That is a second decision and it is his — a
darker ground was considered and rejected at A3 because *"darkening the ground
would fix the fade and lose the theme."* **This survey does not re-litigate it;
it names the cost so he rules once with it in front of him.**

### AND `wbr-cover-logo.png` IS A GREY ALBUM TOO — HIS RULING'S EDGE CASE

`/robots/art/wbr-cover-logo.png` is the same grey paper, the same 4px border,
the same Georgia setting, the same rule, the same Courier strapline, and it
carries **the same W.B logo**. By appearance it is a standard grey album. **By
authorship it is Mike's own hand-drawn art** (§3). His ruling names one
exception, `BOWBv1`, and does not name this one. **This is the one genuinely
open question in the ruling and it is put to him in §6.**

---

## 2 · WHAT THE GENERATOR ACTUALLY PRODUCES

`tools/make_house_covers.py`, 222 lines, added `551f2b7` 2026-08-06, npm script
`covers:house`. Nothing else in the tree invokes it.

**INPUTS**
- `public/WeirdBaby_PhotoID.png` — 2048×2048 RGBA, the mark. Read only.
- `C:\Windows\Fonts\georgia.ttf` and `cour.ttf`. **Host-local, outside the repo.**
- The `COVERS` array at `:89–105` — six rows, hard-coded. No CLI input, no data
  file, no config. **Editing the strings means editing the source.**

**TEMPLATE** — `build()` at `:135`, on a 1200×1200 square:
paper `(217,213,202)` · 4px border inset `26/600·S` · greyscaled mark at
`0.58 S` wide, top at `0.070 S` · Georgia at `0.132 S`, tracked `0.016 S`,
measure `0.760 S` · 4px rule from `0.25 S` to `0.75 S` · Courier strapline at
`0.0345 S`, tracked `0.010 S`, measure `0.800 S`.

**WHAT IT WOULD WRITE TODAY** — all six rows, unconditionally, in one loop at
`:210`. There is no per-file guard, no `HAND_AUTHORED` set, no mtime check, no
skip. `--dry-run` prints; anything else writes.

**EVERY PATH IT TOUCHES**

```
public/images/foundation/foundation-cover.png     ← rewritten, byte-identical result
public/images/foundation/ledger-cover.png         ← rewritten, byte-identical result
public/images/foundation/contribute-cover.png     ← rewritten, byte-identical result
public/images/wb/about-cover.png                  ← rewritten, byte-identical result
public/images/wb/vol1-cover.png                   ← *** MIKE'S ART DESTROYED ***
public/images/wal/worth-a-listen-cover.png        ← rewritten, byte-identical result
```

**FIVE OF THE SIX WRITES ARE NO-OPS. THE SIXTH IS THE ONLY REASON THE TOOL IS
DANGEROUS**, and that is what makes it dangerous — a run reports six cheerful
`wrote …` lines and five of them are true in the boring sense.

`vol1-cover.png` would become a grey sleeve reading **`THE MAKING` / `OF BOWB
V1`** over **`WEIRD.BABY MUSIC`**. Mike retired that title on 2026-08-13. The
file it replaces was placed 2026-08-12 at `e998d03`, resampled from a 4506×4506
master, and is his own vinyl artwork: the record's black grooves, the baby seen
through the label well, **`The Best of` in red** at the top, `Weird.Baby` in the
house outline face across the middle, **`Vol. 1` in red** at the foot. No house
mark, no border, no strapline, no grey paper. **1.37 MB replaced by ~200 KB.**

### THE SECOND TRAP: `docs/BACKLOG.md` POINTS A FUTURE ROUND AT IT

`docs/BACKLOG.md:134–142`, item 2 — THE ARTIST:

> - rename the album from *About the Artist*
> - add an Influences track
> - **regenerate the cover** from `tools/make_house_covers.py`
>
> **MIKE HAS RULED THE COVER IN AS SOON AS FEASIBLE.**

The intended target is `about-cover.png`. **The tool has no way to regenerate
one cover.** A round that reads that bullet and types `npm run covers:house`
destroys `vol1-cover.png` while doing exactly what the backlog told it to do,
with Mike's own *as soon as feasible* on the row.

### THE THIRD TRAP: `--verify` IS RED, AND ITS OWN DOCSTRING IS THE CLAIM IT DISPROVES

The header says `--verify` re-renders the ROBOTS cover and *"compares it pixel
for pixel with the shipped `wbr-cover-logo.png`. If the geometry has drifted by
one pixel the check fails."*

**MEASURED, IN MEMORY: 419,442 differing pixels; 303,783 of them differ by more
than 16 of 255; max delta 255.** The difference is not drift — it is a different
picture. Band by band, strong differences:

| band | rows | differing px |
|---|---|---:|
| border / top | 0–80 | **0** |
| the mark | 84–560 | 121,921 |
| the word ROBOTS | 560–760 | 98,705 |
| the rule | 760–900 | 45,653 |
| the strapline | 900–1000 | 23,191 |

**The generator puts its rule at rows 992–995. The shipped file's rule is at rows
1061–1064** — the exact landmark `make_template_covers.py` records as measured
off Mike's `NEW Robots.png`, and the exact landmark register row **L-d** cites.
The shipped file also carries Adobe Photoshop Elements 19 XMP, `CreateDate
2026-08-09T11:15:20`.

**`--verify` cannot have passed since 2026-08-09.** Nothing runs it: it is in no
gate, no packet ritual, and no npm script. Its failure has therefore been
invisible for seventeen days, and the docstring's boast — *"a hand-matched cover
drifts the first time either is re-rendered"* — is being made about a file that
is now hand art.

---

## 3 · THE HAND-DRAWN COVERS — Ops' reading is CORRECT, and the COUNT IS WRONG

### THE COUNT IS FOUR, NOT THREE

`f366d37`'s own commit message and `docs/MUSEUM_WING_NAMES_LOG-20260826.md` §7
both say **"the nine PNGs with a wing name in the pixels, three of them
hand-drawn."** §7 lists the six regenerable as five rows of `make_house_covers.py`
**plus `make_robots_cover.py:72`** — i.e. it counts `wbr-cover-logo.png` as
regenerable.

**IT IS NOT REGENERABLE. IT IS MIKE'S OWN ART, AND THE TREE ALREADY SAYS SO IN
THREE PLACES:**

- `provenance/assets.json` → `MIKEY_ART`: *"the house's own artwork - hand-
  authored by Mikey … **Not generated**; make_unit_covers.py is fenced from this
  path."*
- `tools/make_unit_covers.py:110–115` lists it in `HAND_AUTHORED`, and Mike's
  2026-08-10 ruling quoted at `:91` says **"all four wing covers are now
  hand-authored."** *Four.*
- `27a9200`'s commit body: **"L6 - the album art. His NEW Robots.png is
  installed."**

**AND THREE PLACES IN THE TREE SAY THE OPPOSITE, INCLUDING ONE WRITTEN
YESTERDAY:**

- `src/data/artists/robots.js:740` — *"Generated by `tools/make_robots_cover.py`
  — not hand-composited, so a re-render cannot drift."*
- `src/data/artists/robots.js:753` — added by `f366d37` — *"has `ROBOTS -
  PURVEYORS OF THE WEIRD` in the pixels, **from `tools/make_robots_cover.py:72`**."*
- `provenance/asset-table.json` — *"Generated by tools/make_robots_cover.py …
  generated rather than composited by hand, **so a re-render cannot drift**."*

**THE PIXELS SETTLE IT AND THE PIXELS ARE ABOVE.** `assets.json` is right;
`asset-table.json` and `robots.js` are wrong, and the sentence *"a re-render
cannot drift"* is not merely stale — **it is an invitation.** It reads as
permission to run `covers:robots`, which would overwrite Mike's art.

### THE FOUR, AND WHOSE THEY ARE

| file | subject | strapline in pixels | who |
|---|---|---|---|
| `public/robots/art/wbr-cover-logo.png` | the W.B logo, whole | `PURVEYORS OF THE WEIRD` | **Mike** — his `NEW Robots.png`, installed `27a9200` 2026-08-09 |
| `public/held/robots/art/mgk-niac-cover.png` | colour photograph of the NIAC cabinet | `WEIRD.BABY ROBOTS` | **Mikey**, `dd367c7` 2026-08-10 |
| `public/held/robots/art/mgk-viiip-cover.png` | B&W photograph of the VIIIp unit | `WEIRD.BABY ROBOTS` | **Mikey**, `dd367c7` 2026-08-10 |
| `public/robots/art/portal-cover.png` | B&W photograph of the VIIIp in a monitor bezel | `WEIRD.BABY ROBOTS` | **Mikey**, `dd367c7` 2026-08-10 |

`mgk-niac` and `mgk-viiip` carry a **pixel-identical** strapline block (x
270–928, rows 1089–1110). `portal`'s sits at rows 1080–1099, x 239–960 — **a
differently set line**, which is itself evidence of a hand and not a template.
`wbr-cover-logo`'s runs x 203–998, the 22-glyph `PURVEYORS OF THE WEIRD`.

### WHY THE GENERATOR IS FENCED, IN THE FENCE'S OWN WORDS

`make_unit_covers.py:100–109` — **it refuses rather than skips**, and says why:

> "A skip prints a line nobody reads and exits 0, so a run looks like it worked
> and the hand-authored art is still on disk by luck. A raise stops the run and
> names the ruling."

And `:112–115` explains why `wbr-cover-logo.png` is in a fence belonging to a
tool that never writes it: *"a fence that only lists what a tool happens to
write today stops being a fence the first time somebody adds a row to UNITS."*

**THAT REASONING IS EXACTLY RIGHT AND IT WAS APPLIED TO THE WRONG TOOL.** The
fence is on `make_unit_covers.py`, which is retired and writes nothing.
**`make_robots_cover.py` and `make_template_covers.py` — the two tools that
DO write these four paths — have no fence at all.** `make_template_covers.py`
writes `mgk-niac-cover.png` and `mgk-viiip-cover.png` directly (`:63`, `:204–205`),
and it is one `npm run covers:template` away.

**What it would write is worse than a name change.** Its own header carries
Mike's instruction *"DO NOT ADD A PHOTOGRAPH."* Both current files **are
photographs.** A run replaces Mikey's photographic sleeves with a closed-ring
type sleeve — the 2026-08-09 design that 2026-08-10 superseded.

### A WING-NAME CHANGE ON THESE THREE IS A REDRAW — CONFIRMED

**Ops' reading is correct on both halves.**

1. **It is a redraw, not a rebuild.** There is no tool that can set new type on
   these files. The only tool that targets those paths (`make_template_covers.py`)
   composes the whole cover from Mike's blank template and cannot accept a
   photograph. Changing `WEIRD.BABY ROBOTS` to `WEIRD.BABY \ROBOTS` in the pixels
   means Mikey re-setting the line on the art she made. **It needs Mikey.**

2. **It needs Mike's eye under the obfuscation law.** Confirmed, and the
   authority clause is exact: `weird-baby-robots/docs/canonical/OBFUSCATION_LAW.md`
   governs *"every image, clip, still, plate, thumbnail, poster, share card and
   preview the museum publishes of a physical MGK unit."* All three are
   photographs of physical MGK units. Articles 1 (no full silhouette), 2 (cut at
   a joint) and 3 (reveal economy) are **visual judgements with no mechanical
   test**, and OPERATIONS §8's 2026-08-25 row exists precisely because a scope
   round once resolved a file list from code reachability and never opened this
   law. **A redraw re-cuts the crop; a re-cut crop is a fresh Article 1/2/3
   question every time.**

**ONE CORRECTION TO ADD TO OPS' READING:** the law is engaged **even if the
strapline is the only thing that moves**, because a redraw of the type is done
on a re-export of the composite, and Article 4's delivery half plus Article 5's
provenance clause bind the new file rather than the old one.

**AND ONE MEASURED FLAG, PLACED NOT RESOLVED.** `mgk-niac-cover.png` ships
**22.86% of its pixels at chroma > 30** — it is a colour delivery, blue and red
LEDs. `mgk-viiip-cover.png` and `portal-cover.png` measure **0.00%**. Article 4's
site-wide half is *"colour at capture, B&W at delivery"* with a named exception
for colour family shots. NIAC is currently **held** (`public/held/`), so nothing
is published wrong today. **It is one file, and whether it is a family shot is
Mike's word, not a defect Ops should fix.**

---

## 4 · WHETHER THE PIXELS MUST FOLLOW THE GLASS

**IT MATTERS, IT MATTERS TO EXACTLY ONE PERSON, AND THAT PERSON IS THE VISITOR
STANDING IN FRONT OF ONE ROOM.**

The disagreement is real and is already recorded as a known cost by the round
that made it (`MUSEUM_WING_NAMES_LOG-20260826.md` §7): *"the banner reads
`Weird.Baby \Robots` over a cover reading `ROBOTS`."* Measured across the nine:

| where the visitor is | the glass says | the sleeve says | disagrees? |
|---|---|---|---|
| `/robots` — the wing's own album | `Weird.Baby \Robots` | `ROBOTS` + `PURVEYORS OF THE WEIRD` | **the album title does; the strapline is not a wing name at all** |
| `/robots` — MGK-NIAC, MGK-VIIIp, PORTAL | `\ROBOTS` on the bar | `WEIRD.BABY ROBOTS` | **YES — one backslash** |
| `/wb` — About the Artist | `\MUSIC` on the bar, `WEIRD.BABY \MUSIC` on the face | `WEIRD.BABY MUSIC` | **YES** |
| `/foundation` — three albums | `\FOUNDATION` on the bar, `WEIRD.BABY \FOUNDATION` on the face | `THE WEIRD.BABY FOUNDATION` | **YES — and by more than a backslash** |
| `/wal` — Worth a Listen | `WEIRD.BABY \WORTH A LISTEN` | `WEIRD.BABY` | **no — it is the house name, which did not change** |

**THE SHARPEST CASE IS `/foundation`, AND IT IS NOT A BACKSLASH.** The three
sleeves read `THE WEIRD.BABY FOUNDATION`; the glass now reads `WEIRD.BABY
\FOUNDATION`. The definite article and the word order both moved. A visitor
reading the face subtitle and the sleeve beneath it sees two different names for
the same wing.

**THE SHARPEST CASE FOR OPS IS `/wb`, AND IT IS A DIFFERENT PROBLEM.**
`WEIRD.BABY MUSIC` — the string on `about-cover.png` — **exists nowhere else in
the museum.** The only place it is authored is inside a picture. Nothing greps
it, no gate reads it, and the register that governs every visible string cannot
see it. It is the one wing name in the building with no textual home.

**AND `wbr-cover-logo.png` IS NOT REALLY IN THIS SET.** Its lettering is
`ROBOTS` and `PURVEYORS OF THE WEIRD`. `PURVEYORS OF THE WEIRD` is the house's
strapline, ruled in `make_unit_covers.py:401` to belong *"ONLY on the first
album, where it literally applies"* — not a wing name. `ROBOTS` alone is the
wing's word without the house's, which is what the bar's short form `\ROBOTS`
also is minus the mark. **Whether it must gain a backslash is a taste question
about one word on Mike's own art**, and it is the weakest of the nine.

**WHO IT MATTERS TO, PLAINLY:** it does not matter to any gate — every gate in
this tree is blind to pixels, and all nine pass today. It does not matter to a
grep. **It matters to the eye, in the four rooms where the two are on screen at
once, and the eye is Mike's.** Doctrine 11's own note is the precedent: *the
largest placeholder in the building was marker lettering painted into a JPEG,
and it took a screenshot to find.*

---

## 5 · WHAT ELSE READS THESE FILES — what a regeneration reaches

**Five surfaces. Only one of them notices, and the one that notices is the one
that matters least.**

### (a) The glass — `src/data/artists/*.js`
`foundation.js:1101,1191,1224` · `weird-baby.js:147,753` ·
`worth-a-listen.js:1947` · `robots.js:765` · `robots-units.js:221,673` ·
`portal.js:109`. All reference by **path**. **A regeneration is invisible here** —
same path, same render, different picture.

### (b) `provenance/assets.json` — the origin register
All ten declared `c: MIKE`, all `textInImage: true`, each with a `text` field
saying what the picture says and an `inspected` field saying **how a human made
that claim**.

**IT IS KEYED ON THE PATH, NOT ON THE BYTES**, and `provenance/README.md §4.2`
states that as a known hole in its own words: *"a picture can be replaced under a
declaration that no longer describes it and nothing fails."*

**So a regeneration silently invalidates a human inspection claim.** Two rows
would be false the moment `covers:house` runs:
- `vol1-cover.png` — *"Mike's own artwork … the ALT master he supplied
  2026-08-12, resampled from 4506×4506 … this one is a photograph-style
  full-bleed"* — describing a file that would no longer exist.
- Its `text` field — *"'The Best of' in red at the top … 'Vol. 1' in red at the
  foot"* — describing lettering that would be gone.

`provenance:gate` **passes either way.** It is in the packet ritual and cannot
see this.

### (c) `provenance/asset-table.json` — the scan plus judgements
Carries **`sha256` and `bytes`** — the only place in the tree that would notice
a changed picture. But:

- The scan is `node tools/asset-table.mjs --scan`, run on demand, **not in
  §9's gate order.** It **rewrites** sha and bytes rather than comparing them,
  so a regeneration is absorbed, not reported.
- The six judged fields — `what`, `quality`, `qualityNote`, `verdict`,
  `revealArc`, `bucket` — **a scan never touches.** They would carry forward
  describing the old picture. `wbr-cover-logo`'s already does: *"Generated by
  tools/make_robots_cover.py … a re-render cannot drift."*
- **`verdict` is Mike's and is `null` on all ten.** Nothing is currently
  carrying a stale pass — **which is luck, not design.** The day he passes one,
  a regeneration under the same path inherits his signature on art he never saw.
  That is the exact failure `MIKEY_ART`'s own correction note at
  `assets-declare.mjs:63–68` was written about: *"An `inspected` field that
  credits a person with an inspection they did not make is the one failure this
  whole register is built to refuse."*

### (d) `reveal/ledger.json` — via `reveal/ledger-declare.mjs`
- `route.wb` names `/images/wb/vol1-cover.png` in its `assets` array
  (`:151`) — so the ledger's own publish list points at the trap file. **And its
  comment is already stale:** *"[A3 2026-08-06] the sleeve was rebuilt on the
  robots template and the old file is deleted"* — describing the 2026-08-06
  state, four days before Mike's art arrived.
- `route.portal` names `/robots/art/portal-cover.png` (`:357`).
- `reveal/delivery.mjs:80` declares `art/wbr-cover-logo.png` **SIGNAGE**, and its
  reason line calls it *"the WEIRD.BABY ROBOTS wordmark"* — **a fourth
  description of this file, and also not what is in the pixels.**
- `reveal/delivery.mjs:117` declares `art/portal-cover.png` PUBLISHED_BY_RULING.
- **Seven ledger `name` fields carry pre-backslash wing names** and were
  deliberately left (log §8c), on `NO ID MOVES WHEN A LEGEND IS RECUT`.

`reveal:check` reads the ledger's shape. **It does not read a byte of any PNG.**

### (e) `src/worker.js:116`
`HELD_PROBE = "/held/robots/art/portal-cover.png"` — the `/api/held` probe, which
OPERATIONS §0 already flags as broken: the Portal ruling moved that file out of
held, so it reports `served:false` on a healthy deploy. **A regeneration does not
change that; it is named here only so the file's readers are complete.**

### THE SUMMARY A REGENERATION REACHES

| reader | notices a replaced picture? |
|---|---|
| the glass (`src/data/artists/*`) | **no** — keyed on path |
| `provenance/assets.json` + `provenance:gate` | **no** — keyed on path, by design, documented |
| `provenance/asset-table.json` | **only if someone runs `--scan`**, and then it overwrites rather than reports |
| `reveal/ledger.json` + `reveal:check` | **no** — reads ids and shape |
| `docs/CONTACT_SHEET.html`, `docs/dictation-*/artifacts.html` | **no** — generated snapshots, stale by construction |
| lint · build · parity · instory · docs:numbers · deploy-guard | **no** |

**NOT ONE GATE IN THE PACKET RITUAL CAN SEE IT.** Mike's vinyl master can be
destroyed by a one-word npm command and every gate in §9 stays green.

---

## 6 · WHAT FIXES BOTH — stated, not built

Nothing below has been done. `git status --short` is empty.

**THE FENCE IS THE FIX, AND IT IS THE FENCE THE TREE ALREADY WROTE.**
`make_unit_covers.py:100–115` has the mechanism, the reasoning and the ruling in
it. Three tools need the same `HAND_AUTHORED` refusal — **raise, never skip** —
against the four hand-authored paths, plus `vol1-cover.png`:

- `make_house_covers.py` → refuse `vol1-cover.png`
- `make_robots_cover.py` → refuse `wbr-cover-logo.png`
- `make_template_covers.py` → refuse `mgk-niac-cover.png`, `mgk-viiip-cover.png`

**AND THE SET BELONGS IN ONE PLACE.** Five copies of a frozenset is five things
that drift; the fence's own argument — *a fence that only lists what a tool
happens to write today stops being a fence* — applies to the fence itself.

**THE BACKLOG BULLET IS THE OTHER HALF AND A FENCE DOES NOT FIX IT.** With a
fence, `covers:house` would raise on row 5 and **write nothing at all** — item 2
would then be blocked rather than destructive. The row needs to name its target,
and the tool needs a way to write one cover.

**THE FOUR STALE SENTENCES**, each in the tree, each read as permission:
`robots.js:740`, `robots.js:753`, `asset-table.json`'s `what` + `qualityNote` on
`wbr-cover-logo`, and `ledger-declare.mjs:151`'s A3 comment. **`assets.json` is
already correct and is the one to conform the others to.**

**AND `--verify` SHOULD EITHER TARGET SOMETHING THAT EXISTS OR GO.** It is red,
it is unrun, and its docstring makes a claim about geometry that is now false.

---

## 7 · THE QUESTIONS FOR MIKE — numbered, three, first one decides the round

**1. The grey albums will fade again without the logo. Do you want them to?**
Removing the mark leaves five sleeves that are grey paper, a thin border and
some type — and grey paper is the same colour as the shelf they sit on. That is
the exact thing you told us to fix in August, when FAQ and CONTRIBUTE looked like
empty outlines floating at the edge of the carousel. **A · Remove it anyway — the
fade is acceptable.** **B · Remove it and put something else in that space —
we'd come back with options for you to look at.** **C · Look at both side by side
first, rendered, before you decide.**

**2. Does the ROBOTS album cover keep its logo?** It is the one you drew
yourself. It is grey like the others and it has the logo on it, but it is your
art, not ours. **A · It keeps it — your art is not a "standard grey album."**
**B · It comes off that one too.**

**3. Three album covers say `WEIRD.BABY ROBOTS` in the picture, and the room's
sign above them now says `\ROBOTS`.** Those three are Mikey's — real photographs
of the machines, not something we can retype. Changing them means she draws them
again and you look at the new crops. **A · Leave them; the difference is small.**
**B · Have her redo them.** **C · Show me what it looks like on screen first.**

---

## 8 · GATES AND STATE

| check | result |
|---|---|
| HEAD | `f366d37` |
| `git status --short` at start | empty |
| `git status --short` at end | empty — **nothing in the repo was written** |
| generators run | **none.** `build()` imported and rendered in memory only; `.save()` never called |
| covers looked at with an eye | `vol1`, `wbr-cover-logo`, `about`, `mgk-niac`, `mgk-viiip`, `portal` |

**NO GENERATOR WAS RUN, INCLUDING `--verify`.** `--verify` is a mode of the tool
under discussion; its result was reproduced in a separate read-only script that
imports `build()` and never reaches `main()`.
