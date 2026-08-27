# CH4's THREE MARKERS, AND THE SEARCH THAT MISSED TWICE — 2026-08-27 (fifth packet)

**Built from `8d32319` on the same day's uncommitted work. Nothing committed,
nothing pushed, nothing deployed.** Everything below the reports was already
correct in the tree; **this round is mostly a verification and a record**, and
says so rather than inventing work.

---

## 1 · THE FOLDER IS REACHABLE, AND THE TREE ALREADY HOLDS HIS FILES

`C:\Users\macun\OneDrive\Desktop - Laptop\ADD TO REPOS\TEMP - Use it or lose it!\Weird.Baby Files\EDITED IMAGES - VIIIp`
— **reachable from this session.** Five files:

| file | bytes |
|---|---|
| `MGK-TWIN MONITOR Close up RED MARKERS.png` | 556,169 |
| `MGK-TWIN MONITOR Close up.png` | 2,369,280 |
| `NEW Robots.png` | 364,390 |
| `PANEL.png` | 817,305 |
| `mgk-niac-cover.psd` | 3,818,344 |

**THE REPO COPIES ARE BYTE-IDENTICAL TO HIS ORIGINALS — PROVED, NOT ASSUMED:**

```
marker   d9e04fc1394515f6cb9e003b17a04a5d   supplied == repo
plate    d5d718285389cf8c44e2dd9dc2b36709   supplied == repo
```

**The only difference is the NAME** — his spaces became underscores and the case
was normalised on the way in. **That rename is exactly the shape that makes a
filename search miss**, and it is the second half of §4's finding.

**IT IS OUTSIDE BOTH REPOS AND OUTSIDE GIT**, same class as `C:\AI\START_HERE.md`
and the workbook: his artefact, nothing in the tree pointing at it. Recorded at
the site that uses it, in `twin.html`, with the hash.

---

## 2 · THE THREE MARKERS, MEASURED

`MGK-TWIN_MONITOR_CLOSE_UP_MARKERS.png` — 3000 × 2400, **the same dimensions as
the plate**, so the coordinates register directly with no mapping. Three solid
red regions, resolved by connected-component scan:

| his name for it | centroid | size | fill | as a fraction of the plate |
|---|---|---|---|---|
| **Top left — FRONT SCREEN ZOOMED** | (863.4, 692.6) | 1071 × 522 | 0.996 | 28.7800% / 28.8583%, 35.7% × 21.75% |
| **Top right — TOP SCREEN ZOOMED** | (2139.5, 693.6) | 1071 × 522 | 0.995 | 71.3167% / 28.9000%, 35.7% × 21.75% |
| **Dot — the lens** | (861.2, 1935.5) | 141 × 143 | **0.786** | 28.7067% / 80.6458%, ⌀ 4.7% |

**THE DOT'S FILL RATIO IS π/4.** 0.786 against 0.7854 — the arithmetic saying it
is a circle and not a square, so the flash keeps its round shape and only its
place and size change.

**HIS ORDERING IS THE MEASUREMENT'S ORDERING.** Sorted top-to-bottom then
left-to-right, the three regions come out in exactly the order he listed them.

---

## 3 · WHAT CH3 DOES FOR EACH ELEMENT, AND CH4 IS THE SAME MECHANISM

**MIKE: "All of this is EXACTLY as on Channel 3, except for the different
background and locations."**

| element | the mechanism, shared | CH3 | CH4 |
|---|---|---|---|
| front screen | `#maskFront`, a `.glassmask` holding the live `<canvas id="cvFront">` (`frontOLED`, 128×64 interlaced onto 64 rows). `translate(-50%,-50%)`, so `left`/`top` ARE the centroid | 28.9667% / 43.6250%, 10.9% × 6.625% | **28.7800% / 28.8583%, 35.7% × 21.75%** |
| top screen | `#maskTop`, same, holding `<canvas id="cvTop">` (`topOLED`), **plus the W9 rolling band** `#maskTop::before` | 70.6000% / 31.8333% | **71.3167% / 28.9000%** |
| the lens | `#unitfront.clickflash::before` (hot core) + `::after` (bloom at 5×), added by `Click_Flash()` on a CLICK and removed after 200ms | 28.95% / 59.4583%, ⌀ 1.4% | **28.7067% / 80.6458%, ⌀ 4.7%** |

**NOT A SECOND IMPLEMENTATION — FOUR CSS OVERRIDES.** `body.monbase.closeup`
carries one extra class, so it outranks `body.monbase` on specificity and wins
on `left`/`top`/`width`/`height` **while every other property still comes from
CH3's rule**: the `content`, the border radius, the background gradient, the box
shadow, the `shutterflash` animation, the S9a canvas feather, the rolling band.
Change how a screen behaves and both channels change together, which is the
whole of what *"exactly as on Channel 3"* asks for.

### VERIFIED LIVE, ALL THREE, ON BOTH CHANNELS

Measured as a percentage of the twin's own stage, against his marker:

| | CH4 measured | his marker |
|---|---|---|
| front screen | **28.780 / 28.857** | 28.7800 / 28.8583 |
| top screen | **71.316 / 28.900** | 71.3167 / 28.9000 |
| lens flash (fired) | **28.706 / 80.644** | 28.7067 / 80.6458 |

CH3 re-measured in the same run and **unchanged**: front 28.966 / 43.625, top
70.599 / 31.833, flash 28.949 / 59.458. Both canvases live (`cvFront`, `cvTop`),
the rolling band present on CH4's top glass, the front glass carrying the halved
feather from his *"less vignetting"* ruling.

### THE TOGGLE IS SEAMLESS, AND THAT IS STRUCTURAL RATHER THAN TUNED

Pressing 3 then 4 in the overlay, both routed to CAB:

| | CH3 | CH4 |
|---|---|---|
| address | `?user=1&preset=standard` | `?user=1&preset=standard&view=closeup` |
| plate | `…FAMILY_SHOT.png` | `…CLOSE_UP.png` |
| **stage** | **1052 × 842** | **1052 × 842** |
| controls | SCROLL · CLICK · SHAKE | SCROLL · CLICK · SHAKE |

**Both plates are 3000 × 2400, so both stages are 1.25 and the frame does not
reflow between them.** Only the picture and the three coordinate sets change.

---

## 4 · THE EARLIER CH4 — WHAT IT WAS, AND WHAT IT WAS NOT

**MIKE: "You have had them before; you have had CH4 working completely and
correctly at one time, just like you had monitor resize."**

**HE IS RIGHT ON BOTH, AND HERE IS EACH ONE EXACTLY.**

### MONITOR RESIZE — existed, still exists, disabled not deleted

`Portal_Grip_In()` in `twin.html`, built at **`fc4cc80`** to his own T3 ask
(*"make the monitor CORNER-DRAGGABLE to scale"*). **Still in the file today.**
Made inert inside the museum by **`efc379f`, 2026-08-22**, whose
`body.framed #unitstage{max-width:none!important}` nails the stage and says why
at the site. Not removed by anything — disabled by a rule with a stated reason.

### CHANNEL 4 — arrived 2026-08-12, and the round log was in `docs/` all along

**`8e67b5b` — "Channel 4 arrives, 013 and nine photographs go, and the export
refuses"**, 2026-08-12. It installed:

```
{ id: "idling-updated", ch: 4, label: "DETAIL", arms: true,
  src: "/held/robots/reference/photos/MGK-TWIN_MONITOR_CLOSE_UP.png",
  frameTitle: "MGK-VIIIp — the close-up" }
```

**So CH4 was his close-up plate, shown as a static picture, on drum position 4.**
That is CH4 having worked — it showed his artwork, correctly framed, and it did
so for a fortnight.

**AND `docs/MUSEUM_CHANNEL_4_LOG-20260812.md` IS STILL IN THE TREE**, 209 lines,
with a section headed `## C — CHANNEL 4` that answers today's question outright.
It records the marker file as **`role: source`, `ref: null`, "spec", not in
`assets.json`** — *"The markers file is a layout template"* — and files `CH-d`
about the composite. **The marker was catalogued and never wired to anything.**

### SO: RECOVERABLE?

**The static CH4 is recoverable and is in `8e67b5b`. The live two-screen CH4 is
not, because it never existed** — searched exhaustively, and this is the part
that had to be done properly rather than by filename:

| search | museum | robots |
|---|---|---|
| `git log --all -S` on `closeup` | 0 | 0 |
| on the marker centroids `863.4` / `2139.5` / `1935.5` | 0 / 0 / 0 | 0 / 0 / 0 |
| on the aperture fractions `71.31` / `80.64` / `35.7%` | 0 / 0 / 0 | 0 / 0 |
| `--diff-filter=D` for deleted close/marker files | none relevant | none |
| `git fsck --lost-found`, content-scanned | 0 hits | 0 hits |
| any `closeup` tier in any revision of either twin | 0 | 0 |
| whole-disk sweep outside git | only docs + this week's work | — |

**`28.78` returns exactly one commit in all history and it is a Bandcamp audio
ingest.** The numbers his marker declares have never been in either repository
before this week.

**So nothing was lost that today rebuilds** — what exists is his artwork and his
marker, and the wiring is new. **That is not a contradiction of him**: he had CH4
working as a picture, and the thing that was missing was that his marker was
filed as a spec instead of being read.

---

## 5 · THE PATTERN, AND WHAT A SEARCH THAT WOULD FIND LOST WORK LOOKS LIKE

**TWO MISSES IN ONE DAY, BOTH THE SAME HABIT: SEARCHING WHAT THE TREE *IS*
RATHER THAN WHAT IT *HAS BEEN*.** Filed as an `OPERATIONS.md` §8 hazard, because
it is a method and not an incident.

**A grep of HEAD is blind by construction to the four states lost work is in** —
deleted, renamed, in the OTHER repository, or outside git. **A silence from
`grep` is evidence about HEAD and about nothing else**, and writing it up as *it
never existed* is the error both times.

**THE SEARCH, CHEAPEST FIRST:**

1. **READ THE ROUND LOG OF THE DAY IT LANDED** — `docs/MUSEUM_*_LOG-*.md`, one
   per round. **Both of today's answers were in `docs/` the whole time**, and
   this step costs one `grep -il` over that directory. It was skipped twice.
2. **`git log --all -S"<content>"`** — the pickaxe, over ALL refs, and **on
   CONTENT rather than NAME**, because the name is precisely what changes. A
   coordinate or a distinctive number beats a filename every time.
3. **`git log --all --diff-filter=D --name-only`** — what was deleted.
4. **THE OTHER REPOSITORY.** Two repos here; `twin.html` lives in one and is
   referenced from the other.
5. **`git fsck --lost-found`** — for work lost to a reset or rebase.
6. **OFF-GIT DISK** — `_night-*`, `Archive/`, `Salvage/`, `_backups/`, OneDrive.

**Steps 1 and 2 alone would have answered both.**

---

## 6 · WHAT CHANGED IN THE TREE THIS ROUND

**Almost nothing, and that is the honest report.** The three-element CH4 was
built in the fourth packet and is correct; this round proved it against his
artefact and recorded where the numbers came from.

- `twin.html` — the marker block gains **his own naming of the three marks**, the
  π/4 finding, and **the artefact's location and hash** (outside git, same class
  as `START_HERE.md`).
- `docs/canonical/OPERATIONS.md` — **one §8 hazard row**: the search pattern.
- **No geometry changed. No coordinate moved.** CH3 and CH4 measure exactly as
  they did before this packet.

---

## 7 · GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 7 warnings — baseline, zero new** |
| `npm run build` · `build:launch` | green · green |
| `npm run provenance:gate` | **PASS** |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** |
| `npm run docs:numbers:gate` | **PASS** |

---

## 8 · OPEN AFTER THIS

- **`CH-d`** (from the 2026-08-12 log) — **the close-up composite has an
  unfilled lower-right panel and unread embossed lettering.** Raised then, never
  closed, and it is now on the glass at 3.27× on channel 4. Worth his eye.
- **`MD-c`** · **`MD-d`** · **`MD-b`** · **`MD-a`** · **`MC-c`** · **`ME-b`** —
  unchanged from the previous packets.
