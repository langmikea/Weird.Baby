# JOB 2 — `_MAL` reconnaissance

**Read-only. Nothing was created, modified, moved, deleted or renamed in any source folder or either git repo. The only files written are this report and `JOB2-inventory.json`, both under `C:\AI\_night-20260810\`.**

Source: `C:\Users\macun\OneDrive\OneDrive MAJEL_04 (Archived Other)\Mike's Stuff\_ROBOTS\Weird.Baby\PROJECT CLOSING - GOOGLE DRIVE COPY\_MAL`
Date of scan: 2026-08-10 · ffprobe/ffmpeg 8.0.1 present and used.

---

## LEAD — WHAT NEEDS MIKE

**1. The 17,011-file audio folder is NOT a cache. It is the robot's own shipped SD-card audio payload — project content, and it contains material generated from third-party services.** Verdict detail in §2b. Per the escalation rule I stopped characterising it there and am handing the question to you. **Nothing about it should be treated as disposable scratch.**

**2. This folder does not contain what your note implies, and that is the single most important finding.** Your note reads *"USE THIS FOR TEASER VIDEO SHORTS - FAST JUMP CUTS."* **There are exactly 3 video files in all of `_MAL`, totalling 85.7 seconds**, and 2 of them are the same 3.6-second logo animation at two aspect ratios. The one real clip (78.6 s) has **one detectable cut in 78 seconds** and is dark, slow and continuous — it is the opposite of jump-cut material. **Either a different folder was meant, or the jump cuts were meant to be built from the 63 stills.** I need you to say which.

**3. `Weird.Baby_Screen_Leak.MOV` — I could not see it, and it needs your eyes.** 231 MB, 1920×1080, 60 fps. I could not extract a frame (the write fence forbids it), so I characterised it only by measurement: very dark throughout (mean luma 30.9 of 255), near-silent audio (mean −52.8 dB), continuous. I cannot tell you whether it is a light-leak overlay asset, a recording of the robot's screen, or something not for publication. **Do not assume it is publishable until you have looked at it.**

## LEAD — WHAT I COULD NOT DETERMINE (short)

- What is actually **on screen** in the three videos (no frame extraction permitted).
- Whether the pixabay / ttsmp3 material in the audio folder carries **licence terms that allow museum publication**.
- Whether the `.psd`, `.skp` and `.doc/.docx` files contain anything beyond what their names say (not opened).

---

## 0. VERIFICATION OF THE REPORTED NUMBERS

| Claim | Measured | Result |
|---|---|---|
| 18,008 files | **18,008** | exact match |
| 0.77 GiB | **827,515,470 bytes = 0.7707 GiB** | exact match |
| directories | 326 | — |
| folders containing files | 270 | — |

**No discrepancy.**

**`_MAL` and `Graphics\_mal` are two distinct directories**, not the same directory via a link. Both were checked: `LinkType` is empty and `Target` is empty on both, and their full paths differ. Job 3's scope is untouched by this report.

*Note on OneDrive:* all 18,008 files carry the `ReparsePoint` attribute (OneDrive Files-On-Demand placeholders) but **0 are `Offline`** — every file was locally hydrated, so hashing and probing read real bytes and triggered no downloads.

**HARD FENCE CHECK: clear.** No folder named `CUT VIDEO - NIAC` or `RAW VIDEO - NIAC` exists anywhere under `_MAL`, and zero files under `_MAL` have `NIAC` anywhere in their path. The fenced material is not in Job 2's scope, so no branch of this job touched it.

---

## 2a. FULL FOLDER TREE

Whole-tree extension breakdown first:

| ext | files | bytes |
|---|---:|---:|
| .mp3 | 15,713 | 255,728,734 |
| .wav | 1,291 | 49,248,339 |
| .ino | 450 | 1,928,597 |
| .h | 206 | 2,673,669 |
| .html | 68 | 334,939 |
| .jpg | 63 | 57,708,121 |
| .js | 54 | 248,421 |
| .png | 35 | 484,950 |
| .cpp | 29 | 623,924 |
| .txt | 19 | 57,876 |
| .md | 14 | 138,179 |
| .pdf | 11 | 175,562,271 |
| .properties | 9 | 3,575 |
| *(none)* | 8 | 233,634 |
| .css | 5 | 49,283 |
| .mk | 4 | 197 |
| .psd | 4 | 49,321,787 |
| .skp | 4 | 672,967 |
| .s65 | 3 | 14,759 |
| .py | 3 | 5,480 |
| .c | 2 | 19,334 |
| .json | 2 | 1,962 |
| .mp4 | 2 | 984,334 |
| .zip · .lesser · .sh · .docx · .doc · .code-workspace · .xml · .yml | 1 each | 848 · 7,652 · 1,221 · 102,815 · 61,952 · 70 · 7,695 · 32 |
| .mov | 1 | 231,287,853 |

### Top level (depth 1)

```
_MAL/                                          18,008 files   827,515,470 B
├── [d0] <root files>                               3 files   231,452,620 B   .mov:1 .docx:1 .doc:1
├── [d1] Audio/                                17,011 files   304,982,215 B   → see §2b
├── [d1] INSTRUCTION MANUAL_IDEAS/                  9 files   173,848,229 B   .pdf:9
├── [d1] Photos/                                   27 files    81,265,827 B   .jpg:25 .psd:2
├── [d1] Weird.Baby Photos/                        31 files    18,988,154 B   .jpg:31
├── [d1] Arduino/                                 908 files     8,176,953 B
├── [d1] Weird.Baby Logos/                         15 files     8,128,505 B   .jpg:6 .png:4 .psd:3 .mp4:2
└── [d1] 3D Modeling/                               4 files       672,967 B   .skp:4
```

### `Audio/` (depth 1 → 5) — 17,011 files, 304,982,215 B

```
[d1] Audio/                                            1 file        1,498 B   .txt:1   (AUDIO NOTES.txt)
├── [d2] _SD_CARD/                              16,726 files   302,109,183 B
│   ├── [d3] _Current/                           2,940 files    71,053,459 B
│   │   ├── [d4] 01_DO NOT USE THIS FOLDER/          1 file       318,484 B   .mp3:1
│   │   ├── [d4] 02_SLOSH/                          13 files      134,018 B   .mp3:13
│   │   ├── [d4] 03_SOUND_EFFECTS/                   6 files    1,554,474 B   .mp3:6
│   │   ├── [d4] 04_UNUSED_SOUNDS/                  41 files   17,164,813 B   .mp3:40 .wav:1
│   │   └── [d4] "10..29 - M8B 0n - CLARITY_0n"/  ×20 folders, EACH 260 files / 2,591,470 B  (.mp3:240 .wav:20)
│   │            = 5,200 files, 51,829,400 B — all 20 folders byte-for-byte identical
│   ├── [d3] 2022_11_30/                             8 files      435,811 B   .mp3:7 .txt:1
│   ├── [d3] 2022_12_15/                            31 files   14,789,333 B   .mp3:30 .txt:1
│   ├── [d3] 2022_12_16/                           325 files   33,430,466 B
│   │   ├── [d4] Sounds.txt                          1 file          732 B
│   │   ├── [d4] 04 - SOUND EFFECTS/                32 files   15,418,766 B   .mp3:30 .wav:2
│   │   └── [d4] 01 - Responses ORIGINAL/          292 files   18,010,968 B
│   │        ├── [d5] Sounds.txt                     1 file          732 B
│   │        ├── [d5] 01 - Responses ORIGINAL/     260 files    2,591,470 B   .mp3:240 .wav:20
│   │        └── [d5] 04 - SOUND EFFECTS/           32 files   15,418,766 B   .mp3:30 .wav:2
│   ├── [d3] 2024_06_18/                           293 files   18,010,468 B
│   │   ├── Sounds.txt · 01 - Responses ORIGINAL (260 / 2,591,470)
│   │   └── 09 - SAM64 (1) · 10 MECHANICAL (9) · 11 ELECTRICAL (4) · 12 PHONE COMPUTER (5) · 13 ALARM (9) · 14 SONGS (4)
│   ├── [d3] 2024_06_25/                           296 files   20,450,754 B
│   │   └── same shape as 2024_06_18, ELECTRICAL is 7 files instead of 4
│   ├── [d3] 2024_07_28/                         5,250 files   72,359,573 B
│   │   ├── 01 NOISE (8) · 02 MECHANICAL (9) · 03 ELECTRICAL (7) · 04 PHONE COMPUTER (13) · 05 ALARM (9) · 06 SONGS (4)
│   │   └── "10..29 - M8B 0n - CLARITY_0n"/  ×20 folders, EACH 260 files / 2,591,470 B  = 5,200 files
│   └── [d3] 2024_08_01/                         5,261 files   71,053,459 B
│       ├── 01_DO NOT USE THIS FOLDER (1) · 02_SLOSH (13) · 03_SOUND_EFFECTS (6) · 04_UNUSED_SOUNDS (41)
│       └── "10..29 - M8B 0n - CLARITY_0n"/  ×20 folders, EACH 260 files / 2,591,470 B  = 5,200 files
└── [d2] RESPONSES (digital negatives)/            284 files     2,871,534 B
    ├── [d3] Responses - Standard/                 260 files     2,591,470 B   .mp3:240 .wav:20
    ├── [d3] Responses - Rude/                      12 files       163,699 B   .mp3:12
    └── [d3] Responses - Prophane/                  12 files       116,365 B   .mp3:12
```

### `Arduino/` (depth 1 → 6) — 908 files, 8,176,953 B

```
[d1] Arduino/
├── [d2] libraries/                          522 files   6,549,867 B   (+ readme.txt at d2)
│   ├── Adafruit_BusIO                 20      Adafruit_GFX_Library      75
│   ├── Adafruit_SSD1306               17      DFPlayerMini_Fast        161   (incl. 68 doxygen .html)
│   ├── DFRobotDFPlayerMini            11      FastLED                  182
│   ├── FireTimer                       5      GEM                       39
│   └── TimerOne                       11
└── [d2] 42 sketch folders `MGK_VIII_P_2022_12_12_c` … `MGK_VIII_P_2022_12_25older`
         386 files, 1,627,086 B — 8 to 10 files each, all .ino/.h
         Dated daily snapshots 2022-12-12 → 2022-12-29, several with Arduino's
         own `_copy_<timestamp>` suffix. Depth 2 only (flat, no nesting).
```

### The remaining media folders

```
[d0] <root>                                     3 files   231,452,620 B
     Weird.Baby_Screen_Leak.MOV  231,287,853 · MGK-VIIIp Instruction manual.docx 102,815 · InstructionManual.doc 61,952
[d1] INSTRUCTION MANUAL_IDEAS/                  9 files   173,848,229 B   .pdf:9  (flat, depth 1)
[d1] 3D Modeling/                               4 files       672,967 B   .skp:4  (flat, depth 1)
[d1] Weird.Baby Logos/                         11 files     4,668,140 B   (depth 1)
└──  [d2] LOGO_WB_Slant/                        6 files     4,620,116 B   .jpg:4 .mp4:2
[d1] Photos/                                    3 files    47,183,920 B   .jpg:1 .psd:2   (depth 1)
└──  [d2] Carter Bookman (MGK INVENTOR)/       24 files    34,081,907 B   .jpg:24
[d1] Weird.Baby Photos/                         0 files at depth 1
├──  [d3] Baby Weird.Baby BORED/ORIGINAL PHOTOS/          1 file     656,437 B
├──  [d3] Baby Weird.Baby HOLY CRAP/ORIGINAL PHOTOS/      4 files  1,936,925 B
├──  [d3] Baby Weird.Baby IN LOVE/ORIGINAL PHOTOS/        2 files    754,864 B
├──  [d3] Baby Weird.Baby INFATUATION/ORIGINAL PHOTOS/    2 files  1,135,675 B
├──  [d3] Baby Weird.Baby SHOCK AND AWE/ORIGINAL PHOTOS/  2 files  1,156,969 B
├──  [d3] Baby Weird.Baby SKEPTICAL/ORIGINAL PHOTOS/      1 file     667,344 B
├──  [d3] Baby Weird.Baby YEAH YEAH/ORIGINAL PHOTOS/      1 file     573,043 B
└──  [d2] Baby Weird.Baby_PHOTOS NOT YET USED/           18 files 12,106,897 B
```

Note on shape: **the seven emotion-named folders contain an `ORIGINAL PHOTOS` subfolder and nothing else.** There is no processed or output image beside any original. Whatever was made from these lives somewhere other than `_MAL`.

---

## 2b. THE 17,011-FILE AUDIO FOLDER — WHAT IT IS

### VERDICT

**It is none of the three candidates cleanly, and it is emphatically NOT a DAW cache.**

**It is the MGK-VIIIp robot's deliverable SD-card audio payload** — the sounds the product actually speaks and plays — held as a small set of masters that **Mike himself labels "digital negatives"**, plus roughly sixty byte-identical deployment copies of those masters arranged into the numbered folders the playback board reads.

**Under the escalation rule ("if the evidence is mixed, treat it as authored and escalate") I am classifying it as AUTHORED MATERIAL and stopping here.** It is project content, not scratch, and must not be treated as disposable. **I have not gone further, because there is a question only Mike can answer** — see the caveat below.

### CONFIDENCE

**HIGH** that it is not a DAW cache and is project deliverable content.
**MEDIUM** on the word "authored", and that is the part needing Mike — see caveat.

### HOW THE SAMPLE WAS CHOSEN

The folder has **101 leaf directories**. I sorted them by path, walked them with a stride of 5 (taking every 5th folder, so the sample spans the full alphabetical/chronological range from `_Current` through `2024_08_01` to `RESPONSES`), and from each selected folder took **three files by position — first, middle, and last after sorting by name**. This deliberately avoids the first-50-alphabetically trap in both dimensions: across folders and within them. After de-duplication that yielded **59 files**, covering `_Current`, all five dated `_SD_CARD` snapshots, the nested `Responses ORIGINAL` tree, every sound-effect category, and the `RESPONSES (digital negatives)` masters.

### EVIDENCE

**1. There is a readme, and it names the sources outright.** `Audio\AUDIO NOTES.txt` (1,498 B) opens:

```
SOUND EFFECTS:
https://pixabay.com/

TEXT TO VOICE:
https://ttsmp3.com/
```

It then lists 13 voice ids — **Aditi, Brian, Emma, Geraint, Joanna, Joey, Kendra, Lupe, Matthew, Penelope, Russell, Takumi, SAM c64** (the first twelve are Amazon Polly voices; SAM c64 is the Commodore 64 speech synth) — and 60 numbered responses: the 20 canonical Magic 8-Ball answers ("As I see it, yes.", "Reply hazy. Try again.", …) followed by 20 marked `Rude` and 20 marked `Profane`.

**2. The arithmetic closes exactly.** 20 standard responses × 12 Polly voices = **240 `.mp3`**; the same 20 responses in the SAM c64 voice = **20 `.wav`**; total **260 files**. Every `M8B … CLARITY` folder holds exactly 240 mp3 + 20 wav and exactly **2,591,470 bytes**. Nothing is left over and nothing is missing.

**3. The masters are named by response-index and voice; the deployments are renumbered.** In `RESPONSES (digital negatives)\Responses - Standard\` files are `01_Aditi.mp3`, `11_Aditi.mp3`, `20_Takumi.mp3`. In the deployment folders the same files are `001.mp3`, `131.mp3`, `260.wav` — flattened to the ordinal names the board needs.

**4. SHA-256 proves the deployments are exact copies of the masters, not renders.** Verified pairs:

| sha256 (first 16) | path |
|---|---|
| `C45539D82FF64713` | `RESPONSES (digital negatives)\Responses - Standard\01_Aditi.mp3` |
| `C45539D82FF64713` | `_SD_CARD\_Current\10 - M8B 00 - CLARITY_00\001.mp3` |
| `C45539D82FF64713` | `_SD_CARD\2024_08_01\27 - M8B 03 - CLARITY_02\001.mp3` |
| `C45539D82FF64713` | `_SD_CARD\2024_07_28\11 - M8B 00 - CLARITY_01\001.mp3` |
| `887AEA43A51EAAD1` | `RESPONSES (digital negatives)\Responses - Standard\11_Aditi.mp3` |
| `887AEA43A51EAAD1` | `_SD_CARD\_Current\10 - M8B 00 - CLARITY_00\131.mp3` |

**This single duplication accounts for essentially the whole file count.** 260 files × ~60 folders ≈ 15,600 of the 17,011. The folder is not big because there is a lot of material; it is big because a 260-file set is stamped out sixty times. **The distinct material is on the order of a few hundred files.**

**5. Directory naming is deployment naming, not cache naming.** `_SD_CARD`, `01 - Responses ORIGINAL`, `04 - SOUND EFFECTS`, `09 - SAM64`, `10 - Sound Effects MECHANICAL`, `02_SLOSH`, `01_DO NOT USE THIS FOLDER`, `04_UNUSED_SOUNDS`. The `Sounds.txt` files explain the constraint in Mike's own words: *"Folders 00 through 10 / 255 files / folder / It seems it's the order of the files that matters, sorted alphanumberically."* That is a person documenting a DFPlayer-class MP3 module's indexing rule, not a DAW writing temp files.

**6. There is no DAW anywhere.** Across all 18,008 files there is **no project file of any DAW** — no `.als`, `.flp`, `.logicx`, `.ptx`, `.rpp`, `.cpr`, `.aup`, `.band`, no `Audio Files/`, `Freeze Files/`, `Fade Files/`, no `.pkf`/`.reapeaks`/`.asd` peak files, no `.otr`/`conformed audio`. The only project files present are **Arduino sketches**, and the only relevant libraries are `DFPlayerMini_Fast` and `DFRobotDFPlayerMini` — the driver libraries for the exact class of SD-card MP3 playback module this layout serves. The hardware, the firmware and the audio payload are all in one folder and all agree with each other.

**7. Encoding profile is delivery-shaped, not capture-shaped.** `01_Aditi.mp3`: mp3, **22,050 Hz, mono, 48 kbps CBR, 1.985 s**, `TAG:encoder=Lavf58.76.100`. Low-rate mono at 22 kHz is what you ship to a small embedded player. Authored session material would be 44.1/48 kHz stereo. The `Lavf` tag shows ffmpeg-family transcoding somewhere in the chain — consistent with the TTS service's own export.

**8. Sound-effect filenames are descriptive stock-library names**, matching the `Sounds.txt` inventories one-for-one: `2101 - Mech - Anvil Strike.mp3`, `2304 - Phone Computer- Phone off hook.mp3`, `005 - Mech - Whip crack - Loud.mp3`, `004 - Electric - Gutteral buzz.mp3`, `007_Static - Black noise.mp3`, `001 - Slosh 001.mp3` … `013 - Slosh 013.mp3`. And `2601 - SAM c64 - ML is great.wav`.

### WHY IT IS NOT EACH OF THE THREE LABELS

- **DAW cache — ruled out.** No DAW, no cache artefact of any kind, human-meaningful filenames throughout, a hand-written readme, and content that is byte-identical across snapshots rather than regenerated.
- **Sample library — partly true but the wrong frame.** The raw ingredients *are* third-party (pixabay SFX, ttsmp3/Polly voices). But this is not a library sitting in a folder; it is a **curated, renamed, renumbered, sixty-times-deployed product payload**, with response text Mike wrote and a voice cast he selected.
- **Authored material — the closest of the three, and the safe classification.** The selection, the response script (including the `Rude` and `Profane` sets, which are not stock content), the folder architecture and the `Sounds.txt` documentation are all Mike's work. He calls the masters *"digital negatives"*, which is the vocabulary of an author keeping his own negatives.

### THE CAVEAT THAT STOPS ME HERE — NEEDS MIKE

**Mike authored the arrangement and the script; a third-party service generated the voices and a stock site supplied the sound effects.** That distinction does not matter for *"is this disposable?"* — it is not — but it matters enormously for *"can this go on the museum wall?"*, and I have not tried to answer that. **What would raise confidence:** Mike stating (a) whether the `Rude`/`Profane` response text is his own writing, and (b) what the pixabay and ttsmp3 licence terms permit for publication. **I have not proceeded past this point and I propose no destination for any of it.**

---

## 2c. EVERYTHING OUTSIDE THE AUDIO FOLDER — FULL INVENTORY

**997 files · 522,533,255 bytes.** One row per file with relative path, sha256, bytes and type is in **`C:\AI\_night-20260810\JOB2-inventory.json`** (290,705 B, 997 rows, with `width`/`height` on all 71 non-Arduino images and full stream metadata on all 3 videos). Modification times run **2024-02-13 → 2026-02-23** for the media set.

### THE VIDEO — AND THE PROBLEM WITH THE NOTE

**There are three video files in the whole of `_MAL`. That is all of it.**

| file | dur | dims | container | vcodec | acodec | fps | total bitrate | frames |
|---|---:|---|---|---|---|---:|---:|---:|
| `Weird.Baby_Screen_Leak.MOV` | **78.558 s** | 1920×1080 | QuickTime/MOV | h264 High, yuv420p | aac LC 44.1 kHz stereo | 60 nominal / **60.018 avg** | 23,553,234 | 4,715 |
| `Weird.Baby Logos\LOGO_WB_Slant\Weird.Baby-1.mp4` | **3.567 s** | 1280×1280 | MP4 | h264 High, yuv420p | *(none)* | 30 | 1,106,381 | 107 |
| `Weird.Baby Logos\LOGO_WB_Slant\Weird.Baby-2.mp4` | **3.567 s** | 1280×960 | MP4 | h264 High, yuv420p | *(none)* | 30 | 1,101,469 | 107 |

Total moving-image runtime: **85.69 seconds.** The MOV also carries three `data` streams (timecode/metadata sidecars typical of a phone or camera capture).

#### SHOT-LENGTH DISTRIBUTION

Cuts **were** detectable — ffprobe/ffmpeg's `scene` filter ran successfully on all three. This is measured, not fabricated.

`Weird.Baby_Screen_Leak.MOV`, threshold sweep:

| scene threshold | detections | timestamps (s) |
|---|---:|---|
| 0.20 (hard cut) | **1** | 2.90 |
| 0.10 | 6 | 2.70, 2.90, 2.93, 2.96, 3.13, 4.76 |
| 0.05 (loose) | 18 | 2.52 … 4.78 — **all eighteen inside a 2.3-second window** |

**Resulting shot list at the hard-cut threshold — two shots:**

| shot | in | out | length |
|---|---:|---:|---:|
| 1 | 0.000 | 2.900 | **2.90 s** |
| 2 | 2.900 | 78.558 | **75.66 s** |

**Nothing changes after 4.78 seconds.** Across the remaining 73.8 seconds, even a loose 0.05 threshold finds zero scene activity. Supporting measurements on the same file: `blackdetect` found **no black frames**, `freezedetect` found **no frozen segments** (so it is live footage, not a still held on screen), per-second mean luma runs **21.6 → 35.9, mean 30.9 of 255** (very dark, gently drifting), and audio is **mean −52.8 dB / peak −14.0 dB** (effectively room tone).

The two logo MP4s returned **0 cuts at threshold 0.10** — each is a single continuous 3.567 s / 107-frame animation.

**Histogram of clip durations across the set (3 clips):**

```
0–5 s     ██  2   (both logo mp4s, 3.57 s each)
5–60 s        0
60–90 s   █   1   (Screen_Leak, 78.56 s)
```

**Histogram of detected shot lengths (4 shots total across the set):**

```
0–4 s     ███  3   (2.90 s · 3.57 s · 3.57 s)
4–70 s         0
70–80 s   █    1   (75.66 s)
```

**This is the finding that matters against your note.** *"Fast jump cuts"* needs many short, visually distinct shots. This set contains **four shots, three of which are under four seconds and one of which is a single unbroken 75.66-second take**. There is no cuttable video variety here.

### THE STILLS — WHERE THE ACTUAL MATERIAL IS

**71 images outside `Arduino/`**, and they are the substantial content of this folder.

**`Photos\Carter Bookman (MGK INVENTOR)\` — 24 JPGs, 34,081,907 B.** Archive/documentary photographs. Resolutions run from 768×1024 up to **5,818×4,742 and 4,916×5,972** — half a dozen are genuine large-format scans (2.3–10.3 MB each). Named `Janet and Andy 6 - Work (1..27)`, with gaps in the numbering. Plus `Photos\ACTUAL Magic 8 Ball Inventor.jpg` (639×480, 39 KB) alone at the parent level.

**`Weird.Baby Photos\` — 31 JPGs, 18,988,154 B.** Baby photographs organised **by expression**: BORED · HOLY CRAP · IN LOVE · INFATUATION · SHOCK AND AWE · SKEPTICAL · YEAH YEAH (13 files total, each inside its own `ORIGINAL PHOTOS` subfolder), plus **`_PHOTOS NOT YET USED` with 18 files**. Typical resolution 1,892×2,042 to 2,338×2,942; the largest is `Michael baby 009.jpg` at **4,629×5,845**.

**`Weird.Baby Logos\` — 15 files, 8,128,505 B.** Layered `.psd` masters **with their exports beside them**: `LOGOSLANT.psd` (1,673×537), `LOGO-WeirdBaby_FaceInCircle.psd` (660×873) + its PNG at the same 660×873 and a 581×768 "(Medium)", `ScrapCo_LOGO_04.jpg`, `correct font.jpg`, `white backing.jpg`, and the two logo MP4s.

**`Photos\*.psd` — 2 files, 47,144,483 B.** `MGK-VIIIp - Camera and Faceplate.psd` (2,071×2,721, 32.9 MB) and `MGK-VIIIp Plus Box Graphics.psd` (3,413×3,713, 14.2 MB). **These are layered product-art masters and are the two single most valuable graphics files in the folder.**

### THE DOCUMENTS

**`INSTRUCTION MANUAL_IDEAS\` — 9 PDFs, 173,848,229 B**, which is **21% of the entire `_MAL` folder by size**. Reference scans of vintage computer documentation gathered as visual/tonal models for the MGK-VIIIp manual: `Univac_St_Paul_1960.pdf` (47.9 MB), `TM-1038_UNIVAC_60_120_Programming.pdf` (37.7 MB), `UT-2488 UNIVAC III Reference Manual (June 1962).pdf`, `UNIVAC Fac-Tronic System brochure.pdf`, `Univac.Flowmatic.1957.pdf`, `SPTM4276_UNIVAC_60_120_Operating_Instructions.pdf`, and `kodak_brownie_reflex.pdf`. **These are third-party historical documents, not Mike's work.**

**Two duplicate pairs inside it, confirmed by hash** — `TM-1038_UNIVAC_60_120_Programming.pdf` = `UNIVAC_60_120_Programming.pdf` (37,659,575 B each) and `SPTM4276_…Operating_Instructions.pdf` = `UNIVAC_60_120_Operating_Instructions.pdf` (15,473,381 B each). **53 MB of the 174 MB is a straight duplicate.**

**Root:** `MGK-VIIIp Instruction manual.docx` (102,815 B) and `InstructionManual.doc` (61,952 B) — the manual itself in two formats. Not opened.

**`3D Modeling\` — 4 SketchUp files, 672,967 B**: `BPA 20221127.skp`, `Rotary Shaft Coupler.skp`, `Screen Adapter Plate.skp`, `USB_Mini_B_Adapter.skp` — mechanical parts for the build.

### THE FIRMWARE

**`Arduino\` — 908 files, 8,176,953 B**, of which **522 are third-party libraries** (FastLED, Adafruit GFX/SSD1306/BusIO, DFPlayerMini_Fast, DFRobotDFPlayerMini, GEM, TimerOne, FireTimer — including 68 generated doxygen HTML pages under `DFPlayerMini_Fast\docs\`).

The remaining **386 files are Mike's firmware across 42 dated sketch folders**, `MGK_VIII_P_2022_12_12_c` through `MGK_VIII_P_2022_12_25older` — **a day-by-day development record spanning 2022-12-12 to 2022-12-29**, several bearing Arduino's own `_copy_<timestamp>` auto-backup suffix. File names inside are `1_BOOT.ino`, `GRAPHICS.ino`, `Top Screen 01.ino` (renamed `Windoze.ino` in the last two), `Test.ino`.

**Heavy internal duplication, confirmed by hash:** `GRAPHICS.ino` is byte-identical across **23** folders, `1_BOOT.ino` across **21**, `Top Screen 01.ino`/`Windoze.ino` across **19**, `Test.ino` across **12**. **77 duplicate-content groups exist in the non-audio set overall.** The 42 folders are snapshots, not 42 distinct programs.

### WHAT IT WOULD BE GOOD FOR — CAPABILITY ONLY

Stated as capability. **No destination is proposed and nothing is recommended.**

- **The 24 Carter Bookman photographs** are the only documentary photographs of a named person in this folder, and six of them are large enough (up to 5,818×4,742) to survive heavy crops, pans and blow-ups. They can carry a still-driven sequence on their own.
- **The 31 expression-sorted baby photographs** are the one asset here that is *natively* suited to fast cutting: they are pre-sorted into seven emotional beats, and 18 more are explicitly marked unused. Rapid cutting between labelled expressions is a capability this set supports without any new capture.
- **The two product `.psd` masters** are layered, meaning individual elements can be isolated, moved independently, or revealed in sequence — capability that flat exports do not have.
- **The logo `.psd` files plus the two 3.57-second logo animations** provide a title/endplate element in both a square (1280×1280) and a 4:3 (1280×960) framing.
- **The 9 UNIVAC/Kodak PDFs** are page imagery of vintage technical documentation — usable as texture, background or intertitle material, subject to their being third-party historical documents.
- **The 42 dated firmware folders plus the `Sounds.txt` files and `AUDIO NOTES.txt`** constitute a dated build record of how the machine was made, in the maker's own words and typos.
- **What the folder cannot do:** supply fast-cut *video*. There are four shots totalling 85.7 seconds, and 75.66 of those seconds are one unbroken dark take.

---

## WHAT I COULD NOT DETERMINE

1. **What is visually on screen in any of the three videos.** The write fence permits me to write only files under `C:\AI\_night-20260810\`, so I did not extract frames or thumbnails. Everything I report about `Weird.Baby_Screen_Leak.MOV` is inferred from measurement (luma, scene, black/freeze, volume), not from looking. Specifically I cannot say whether it is a light-leak/overlay element, a recording of the robot's own display, a screen capture, or something unsuitable for publication.
2. **Why the file is called "Screen_Leak."** The name is compatible with at least two readings — a "light leak"/"screen leak" compositing overlay, or a leak *of* a screen — and its measurable properties (very dark, 60 fps, continuous, near-silent, one cut) do not discriminate between them.
3. **Whether the pixabay sound effects and the ttsmp3/Amazon Polly voice renders may be published**, and under what attribution. `AUDIO NOTES.txt` names the sources but records no licence terms.
4. **Whether the `Rude` (20) and `Profane` (20) response texts are Mike's own writing.** `AUDIO NOTES.txt` lists them only as the literal words "Rude" and "Profane" against ids 21–60; the actual spoken text exists only inside the audio, which I did not transcribe.
5. **The contents of the four `.psd`, four `.skp`, one `.doc` and one `.docx` files** beyond their dimensions and names — none were opened.
6. **Which of the 42 Arduino sketch folders is the final shipped firmware.** The names carry dates and letter suffixes (`_A`, `_b`, `_C`, `_d`, `older`) but no folder is marked final, and `MGK_VIII_P_2022_12_25older` sorts last by name while being marked "older".
7. **Whether the audio duplication is intentional archival practice or accumulated drift.** Five dated `_SD_CARD` snapshots plus `_Current` each carry a full copy; I did not determine whether `_Current` matches the shipped card.
8. **Duration distribution of the 17,004 audio files.** I stopped at the 2b verdict as instructed rather than characterising the audio set further; the only durations measured are from the sample.
9. **Whether anything in `_MAL` is duplicated into `Graphics\_mal`** (Job 3's scope) — cross-folder hash comparison was out of scope here, though `JOB2-inventory.json` carries the hashes that would allow it.

## WHAT NEEDS MIKE

1. **THE 2b VERDICT — confirm the classification.** The 17,011-file audio folder is the MGK-VIIIp's shipped SD-card payload, held as ~284 masters you labelled "digital negatives" plus ~60 byte-identical deployment copies. **It is not cache and must not be treated as disposable.** Confirm, and confirm nothing has been assumed on your behalf.
2. **THE NOTE DOES NOT MATCH THE FOLDER.** *"USE THIS FOR TEASER VIDEO SHORTS - FAST JUMP CUTS"* — but `_MAL` holds **3 video files, 85.7 seconds, 4 shots**, one of which runs 75.66 seconds unbroken. **Did you mean a different folder, or did you mean the jump cuts to be built from the 63 stills?** I have not guessed and have proposed nothing.
3. **LOOK AT `Weird.Baby_Screen_Leak.MOV` BEFORE ANYTHING TOUCHES IT.** 231 MB — 28% of the whole folder — and I could not see a single frame of it. Dark, near-silent, continuous. Say what it is and whether it is publishable.
4. **LICENCE RULING ON THE AUDIO.** pixabay sound effects and ttsmp3 (Amazon Polly) voices. Does either permit museum publication, and does either require attribution?
5. **AUTHORSHIP RULING ON THE `Rude` AND `Profane` RESPONSES.** Are those 40 lines your writing? The answer changes their provenance class.
6. **WHICH ARDUINO FOLDER IS THE SHIPPED FIRMWARE**, if any of the 42 is.
7. **IDENTIFY THE PEOPLE IN `Photos\Carter Bookman (MGK INVENTOR)\`.** 24 photographs filed under an inventor's name but titled `Janet and Andy 6 - Work`. Living-person imagery of named third parties — a provenance and consent question I cannot resolve from the files, and one that must be settled before these are considered for anything.
8. **THE 53 MB PDF DUPLICATE PAIR** in `INSTRUCTION MANUAL_IDEAS\` is flagged as an observation only. **I have deleted nothing and propose nothing.**
