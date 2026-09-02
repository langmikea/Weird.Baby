# THE MGK-VIII ROUND — 2026-08-03

Autonomous, single agent, drafting lane. Museum repo only. Nothing pushed,
nothing deployed, nothing mirrored — those are Mike's.

**Scope run:** V1 inventory · V2 MGK-VIII onto the carousel (obfuscated) ·
V3 sounds inventoried and NOT applied · V4 videos inventoried and NOT published.

---

## V1 — INVENTORY

Source root:
`C:\Users\macun\OneDrive\OneDrive MAJEL_04 (Archived Other)\Mike's Stuff\_ROBOTS\Coin Slot Robots (CSR)\_ROBOTS\`

Three siblings: `MGK-VIII\`, `MGK_VIIIp\`, `NRU-1000\`.

### MGK-VIII — 48 files

| Group | Count | Detail |
|---|---|---|
| Photographs (2013) | 6 | `MGKVIII_Photos\` · Panasonic DMC-ZS3 · 2784×1568 · 10–11 Feb 2013 |
| Photographs (2021) | 6 | root · iPhone X · 4032×3024 · 24 Mar 2021 (files stamped 30 Mar) |
| Video | 2 | `IMG_1526.MOV` 543 MB / 294 s · `IMG_E1526.MOV` 365 MB / 197 s |
| Audio | 5 mp3 + 2 `.URL` | `MGKVIII_Sounds\` — see V3 |
| Arduino | 9 zips | Jan 2026 bench sketches (LED Bar / Dot / Matrix ×4 / Servo / BB) |
| CAD / parts | 13 | Chest Bucket (dxf/svg/pdf/png), Foot 4 (+bracket), servo STL/SKP, Jet_Pack_Scan |
| Other | 3 | `LM3915.png` (+ a copy) — LED bar/dot driver IC · `LCD.psd` 17.7 MB |

**What the photographs actually show.** 2013: four frames of a bench —
Arduino Uno, six breadboards, a lit 8×8 LED matrix, a multimeter, and a vintage
split-flap counter reading "5 36"; one frame of the figure standing unpowered in
a workshop against a paper mock-up; one frame of a filing drawer of sorted
findings (jewelled indicators, bezels, knobs, braid). 2021: five frames of the
figure assembled and powered on a bench beside a large grille cabinet carrying a
lit LED column and rows of dot LEDs; one frame of a 3D printer on a safe.

### MGK_VIIIp — 1,877 files

Dominated by vendored Arduino libraries (Adafruit BusIO / GFX / SSD1306,
DFPlayerMini_Fast + its generated doxygen HTML). The real content:

- **~120 `.ino` files** across ~15 dated sketch folders, `MGK_VIII_P_2022_12_12_c`
  → `_2022_12_21`, module names `1_BOOT` / `2_SELECT_BALL` / `3_INPUT_Question` /
  `4_OUTPUT_Answer` / `Boops` / `GRAPHICS` / `Top Screen 01`.
- **`Audio\` — ~930 files.** See V3.
- No photographs. No video.

### NRU-1000 — 583 files

- **4 photographs**, 24 May 2011, of the unit.
- **`Google SketchUp\`** — v001→v025 model history (`.skp`/`.skb`), plus a `JUNK\`
  subfolder of earlier iterations and part models (body plate, Cytron SPG30 motor).
- **`NRU Fortune Photos\NO\`** — ~560 family/holiday photographs, 2001–2003.
  Filed under `NO`. **Not robot material and not touched.**
- 2 documents: `Microswitches, Motors, and Motor Controllers.doc`,
  `Motor thoughts.txt`.
- No audio. No video.

**Nothing was copied out of any of these folders except the twelve MGK-VIII
crops named in V2. The originals are untouched.**

---

## V2 — MGK-VIII ON THE CAROUSEL

### Where it sits

`src/data/artists/robots.js` → `spine[1]`, between the front desk (`wbr-logo`)
and `mgk-viiip`. The front desk keeps index 0; `defaultActiveIndex` unmoved.

Placed ahead of the VIIIp on the robots repo's own closed ruling
(`weird-baby-robots/STATE.md`, 2026-07-18, markup ruling 4): **NIAC-first — the
fiction's mainframe is MGK-NIAC; "VIII/VIIIp" is ABEAL's 1965 rebrand.** The
original stands before the portable, and the family order recorded there is
"MGK-NIAC, MGK-VIIIp, NRU-2000".

### The no-coming-soon credo is intact

R1 (2026-07-30) removed MGK-NIAC from this deck for being logo art plus a
"Coming soon" track, and wrote the condition for return: *when a family earns a
photograph and a tracklist*. It now has eleven plates and four faces read off
them. It returned on R1's own terms, as data, in one file, with no component
changed. NRU-2000 and the findings-log album are still out and still owe the
same rent — that note is now written into the file beside R1's own paragraph.

### Four tracks

| # | Track | What it carries |
|---|---|---|
| 01 | **MGK-NIAC** | The two names and the closed ruling behind them; mainframe-vs-portable; the Record's 9 Feb 2024 entry. Head plate: the lens. |
| 02 | **The Plates** | The eight-tile plate wall + a tombstone whose `Frame` row states the withholding. |
| 03 | **The Firmware** | Flagship v0.1 · 2026-02-23 · 1,385 lines · Uno R4 WiFi; the five rules in its header; the January-2026 bench facts. Head plate: the lit matrix. |
| 04 | **The Parts** | What the figure is made of, read off the photographs and stopping there. Head plate: the drawer. |

### The crops — what I chose and why

Mike's ruling: *enough to prove the unit is real and present, not enough to
spend the reveal.* The reveal here is **the whole figure**, so the governing
constraint I applied was: **no plate contains the unit's full silhouette.**
Every frame is cut at a joint, a panel or an edge.

| File | Source | Cut to | Why it earns a place |
|---|---|---|---|
| `head_lens.jpg` | IMG_1582 (2021) | the lens and its bezel only | Something is looking back and you cannot tell what it is mounted on. Strongest single detail in the set; least revealing of the shape. |
| `head_oblique.jpg` | IMG_1584 (2021) | head, three-quarters, cut at the neck | Establishes the head is a camera body. No torso, no scale. |
| `chest_grille.jpg` | IMG_1585 (2021) | torso, both shoulders, tops of two limbs | The one detail that reads as *a machine that stands up* without showing it standing up. Also the album poster and the contents plate. |
| `limbs_lower.jpg` | IMG_1583 (2021) | conduit into cast feet, cut at the knee | Materials and stance, no body. |
| `column_lit.jpg` | IMG_1584 (2021) | the lit column behind the grille | Nearly abstract; proves *powered* without proving *what*. |
| `bench_power.jpg` | IMG_1583 (2021) | plank, hub, relay board, two feet | Proves a working bench, discloses no form. |
| `torso_unfinished.jpg` | 9132 (2013) | same torso, unpowered, against the mock-up | The eight-year pair. Different mood, same object. |
| `feet_plinth.jpg` | 9132 (2013) | feet on a plywood plinth | Construction evidence at floor level. |
| `slot_mockup.jpg` | 9132 (2013) | a taped slot in a paper mock-up, limb across it | The most on-brand frame in the folder for a wing called Coin Slot Robots. |
| `matrix_lit.jpg` | 9114 (2013) | the lit matrix on the breadboard | The only frame in the set of *software doing something*. |
| `parts_drawer.jpg` | 9134 (2013) | one drawer of sorted findings | Needs no obfuscation — the unit is not in it. Gives away nothing about the figure and everything about the method. |
| `mgk-viii-cover.jpg` | IMG_1584 (2021) | square, grille + dot rows + aperture | Reads at 240×240 in the deck and is unmistakably a machine while being unmistakably not a portrait. |

**Left out, deliberately:**

- **IMG_1580** — a 3D printer on a safe. No unit in frame. It would be padding:
  it proves a workshop exists, which no one is asking, and proves nothing about
  MGK-VIII.
- **IMG_1581** — near-duplicate of 1582/1584 with a weaker head light.
- **9109 / 9112 / 9115** — three further frames of the same 2013 bench, differing
  only in which LEDs are lit. 9114 is the best of the four and one is enough.
- **The split-flap counter reading "5 36"** — a beautiful frame and I cut a crop
  of it, then dropped it. It sits on the bench beside the breadboard and I
  cannot establish that it is part of MGK-VIII. Publishing it under this album
  would be the museum implying a provenance it does not hold.
- **The whiteboard of dimensions** in 9132 — legible construction numbers.
  Obfuscation would reduce it to a grey smear; unobfuscated it is a spec sheet.
  Meaningless either way, per Mike's own escape clause.

### Two laws, two layers

- **The crop is baked into the file.** It is a ruling and has to survive anyone
  pointing a new renderer at these files.
- **The monochrome is not.** The wing enforces B&W once at the glass
  (`Exhibit.css` :2923, `.ex-root[data-exhibit="robots"] img`). Verified in the
  live DOM: all ten MGK-VIII images resolve `filter: grayscale(1) contrast(1.03)`
  with no new rule written. The negatives keep their colour on disk exactly as
  the other eight plates do.

**Format:** JPEG q92, where the VIIIp plates are PNG. The sources are camera
JPEGs, so PNG here would be a lossless wrapper around lossy data — ~16 MB of
repository for no visible pixel. Total added: **1.5 MB across 12 files.**

### One defect caught and fixed on the glass

The head plates were first cut at 1.60:1. `.vp-face-still` resolves to a
260×210 box (`max-width:260px` × `height:min(48cqh,210px)`) with
`object-fit:contain` — so they **letterboxed inside their own border**. This is
the exact F1 defect the CSS comment at `Exhibit.css:57` warns about ("the crop
came back wearing a different hat"), and the same trap the desk cards were sized
520×420 to avoid. The three head plates were re-cut to 1.238:1. Measured after:
rendered 260×210, natural 585×472, **letterboxed: false**.

### One copy defect caught and fixed

The marker scrub (P5) cuts by *sentence*, not by string. My first `papa` string
left "the uncropped photographs are on file and one line of data would publish
any of them" standing on the public wall — true, and written in the register of
one maintainer talking to another. The operational half now sits behind the
`[PAPA]` marker. What survives to the wall is:
*"The withholding is authored, and it is not a shortage of photographs."*

---

## V3 — SOUNDS: INVENTORIED, NOT APPLIED

**Nothing plays. No `videos` array populated, no audio path referenced anywhere
on the new album or in any file this round touched.**

### MGK-VIII\MGKVIII_Sounds\ — 5 mp3 + 2 shortcuts

| File | Length | Size | Apparent content |
|---|---|---|---|
| `254345_SOUNDDOGS__co(warm_up).mp3` | 11.91 s | 48 KB | filename: a warm-up cycle |
| `420737_SOUNDDOGS__sc(scanning).mp3` | — | **111 bytes** | **CORRUPT / truncated stub.** ffprobe: "Invalid data found". Not a playable file. |
| `420787_SOUNDDOGS__sc(scifi).mp3` | 16.46 s | 66 KB | filename: generic sci-fi bed |
| `580291_SOUNDDOGS__sc(overload).mp3` | 19.33 s | 77 KB | filename: an overload/failure cue |
| `Beeping and clicking.mp3` | 3.42 s | 34 KB | filename: short beep/click bed |

All four playable files are 33–82 kbps — **audition-quality, not master-quality.**
The four `SOUNDDOGS_` names are library-catalogue IDs.

The two `.URL` shortcuts are the sources, and they matter for rights:
`sounddogs.com` (a commercial SFX library, results page) and
`soundboard.com/sb/Star_Trek_Computer_sounds`. **The second is a third-party
Star Trek soundboard.** Any decision to publish MGK-VIII audio has a licensing
question in front of it, not just a design one.

### MGK_VIIIp\Audio\ — ~930 files (flagged; a much bigger asset than the above)

- **`RESPONSES (digital negatives)\`** — 12 named TTS voices (Aditi, Brian, Emma,
  Geraint, Joanna, Joey, Kendra, Lupe, Matthew, Penelope, Russell, Takumi) in
  three registers: **Standard** (260 files), **Prophane** (12), **Rude** (12).
- **`_SD_CARD\`** — the on-unit card images, dated `2022_11_30`, `2022_12_15`,
  `2022_12_16`, plus `_CURRENT`. `_CURRENT` holds numbered playback folders:
  `01 Responses ORIGINAL` (260), `02 PROFANE`, `03 RUDE`, `04–08 EMPTY`,
  `09 SAM64`, and SFX banks `10 MECHANICAL` (9) / `11 ELECTRICAL` (4) /
  `12 PHONE COMPUTER` (5) / `13 ALARM` (9) / `14 SONGS` (4).
- **`AUDIO NOTES.txt`** names the pipeline: SFX from **pixabay.com**, voices from
  **ttsmp3.com**, and the DFPlayer constraint that *file order* is what the
  hardware addresses ("255 files / folder … it's the order of the files that
  matters, sorted alphanumerically").

**NRU-1000: no audio.**

---

## V4 — VIDEOS: INVENTORIED, NOT PUBLISHED

Both are in `MGK-VIII\` root and both are the same session (19 Mar 2021,
~35 minutes apart; `E` = the iPhone edited derivative).

| File | Duration | Frame | Codec | Size | Created |
|---|---|---|---|---|---|
| `IMG_1526.MOV` | 294 s (4:54) | 1920×1080 @30 | h264 / aac | 543 MB | 2021-03-19 19:21 |
| `IMG_E1526.MOV` | 197 s (3:17) | 1920×1080 @30 | h264 / aac | 365 MB | 2021-03-19 19:55 |

`IMG_E1526` is the trimmed version — 97 seconds shorter, same source.
**Not opened frame-by-frame this round** (V4 said inventory, not review), so what
they contain is stated from metadata and context only: they are five days before
the 24 Mar 2021 stills, same build era, and 1080p30 handheld.

**Usable for the Record's evidence classes later, subject to review:** the
Record's model (`robots.js` B9 note) accepts a class WORD plus `plates`, and the
plate shape is `{img, label, date}` — **it takes stills, not video.** So the
realistic path is *frames pulled from these files as `evidence: "photograph"`
plates*, not a video player. If Mike wants motion in the wing, that is a new
mechanism and a separate ruling; the wing's standing rule is "photos are paper,
video is television," and the only television here today is the Portal's iframe.

Also relevant: `weird-baby-robots/STATE.md` classes the 2021 build videos
(952 MB) as **heavy media, NEVER in git, LINEAGE-indexed in place.** Publishing
frames is compatible with that; committing the `.MOV` files is not.

---

## VERIFICATION

| Check | Result |
|---|---|
| `node --check src/data/artists/robots.js` | PASS |
| `npx eslint src/data/artists/robots.js` | **0 problems** |
| `npm run lint` (whole repo) | 11 errors / 9 warnings — **all pre-existing**, none in a file this round touched. See note below. |
| `npm run build` | PASS (`built in 516ms`) |
| File integrity | 1,032 L / 61,595 B → **1,354 L / 80,418 B**; tail intact; growth matches the three edits exactly |
| Album on carousel | `MGK-VIII` at deck position 2, cover `/robots/art/mgk-viii-cover.jpg` |
| Tracks render | 4/4 — MGK-NIAC, The Plates, The Firmware, The Parts |
| Collage | 8/8 tiles, captions and dates correct |
| Images | 10/10 load, **0 broken**, all `filter: grayscale(1) contrast(1.03)` |
| Reader | opens on tile click, plate B&W at the glass |
| Head plate geometry | 260×210 rendered, **letterboxed: false** |

**Lint baseline note.** `CLAUDE.md` documents the baseline as 4 errors /
6 warnings. The live tree is at **11 / 9** and has been since before this round —
the doc is stale, not the tree. I did not "fix" either; flagging it because the
number is supposed to work as a regression tripwire and currently does not.

**Glass lap caveat, stated plainly.** Chrome's `Page.captureScreenshot` timed out
repeatedly on the first tab (the page stayed fully responsive to clicks, JS and
accessibility reads throughout). A second tab rastered normally and the
screenshots below came from it. Where a screenshot was unavailable I verified
against the live DOM instead — image `naturalWidth`, computed `filter`, rendered
box geometry — which is stronger evidence than a picture for every claim in the
table above.

---

## FILES

**Added (12):**

```
public/robots/art/mgk-viii-cover.jpg
public/robots/reference/mgk-viii/bench_power.jpg
public/robots/reference/mgk-viii/chest_grille.jpg
public/robots/reference/mgk-viii/column_lit.jpg
public/robots/reference/mgk-viii/feet_plinth.jpg
public/robots/reference/mgk-viii/head_lens.jpg
public/robots/reference/mgk-viii/head_oblique.jpg
public/robots/reference/mgk-viii/limbs_lower.jpg
public/robots/reference/mgk-viii/matrix_lit.jpg
public/robots/reference/mgk-viii/parts_drawer.jpg
public/robots/reference/mgk-viii/slot_mockup.jpg
public/robots/reference/mgk-viii/torso_unfinished.jpg
```

**Modified (1):** `src/data/artists/robots.js`

**Added (1):** `docs/MGK_VIII_ROUND_LOG-20260803.md` (this file)

**Untouched:** every source folder in OneDrive · `museum-tokens.css` ·
`Exhibit.jsx` · `Exhibit.css` · `RobotsExhibitFlow.jsx` · MediaVault ·
`weird-baby-robots`.

---

## OPEN FOR MIKE

1. **Which name goes on the door** — the album is filed `MGK-VIII` because the
   folder, the firmware and the parts are; the record prefers MGK-NIAC. Marked
   `[PAPA]` on track 01. Changing it is a one-line edit.
2. **How much is ever shown whole, and when.** The uncropped originals are on
   file. Marked `[PAPA]` on The Plates.
3. **Sound** — ruled separately, per V3. Note the licensing question before the
   design one.
4. **Video** — the realistic path is frames-as-plates, not a player. Needs a
   ruling before any work.
5. **The donor-part list** — deliberately not written. Marked `[PAPA]` on
   The Parts.

## NOT DONE — MIKE'S

Push. Deploy. Mirror. The commit is local and unpushed.
