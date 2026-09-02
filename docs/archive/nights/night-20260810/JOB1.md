# JOB 1 — MANIFEST + CAPTURED JUDGEMENTS
**Source:** `C:\Users\macun\OneDrive\Desktop - Laptop\ADD TO REPOS`
**Run:** 2026-08-10 · READ-ONLY · nothing in any source folder or either repo was created, changed, moved or deleted.
**Companion file:** `JOB1-manifest.json` — shape is **an object with a `"files"` array**, one object per file, plus `job` / `generated` / `sourceRoot` / `shape` / `fileCount` / `totalBytes` at the top level. Every row carries `technical` (bytes, type, dimensions, codec, duration…) and `judgements` (expression, status, purpose, stage, suffix, collection, fence flag).

---

# READ THIS FIRST

## WHAT NEEDS MIKE — short form

1. **The `a` suffix does not mean the same thing in the two photo folders, and calling it "a crop" is wrong in at least four cases.** Rule needed. (Full evidence below.)
2. **`mgk-niac-cover.psd` was modified TODAY (2026-08-10 13:50) and is NEWER than the `NEW Robots.png` beside it (2026-08-09 11:28).** If they are a master/derivative pair, the PNG is stale. Which is current?
3. **`WeirdBaby_ALBUM COVER (MASTER).psd` (4506×4506) has no derivative anywhere in the tree.** Does one need exporting, or is it retired?
4. **246 MB of exact duplication:** `HOW I SAVED THE WORLD.MOV` and `HOW_I SAVED_THE_WORLD_BLUES _ MASTER 001.MOV` are byte-identical. Which name survives?
5. **The brand call already sitting unanswered in the tree:** `CUT VIDEO - NIAC\README_v3.txt` explicitly flags a **nude illustration (the red pin-up figure)** visible in both signature cuts and says *"Whether it belongs in a public-facing Weird.Baby short is yours."* Never answered as far as this folder shows.
6. **2.33 GB of camera originals (`IMG_8609`–`IMG_8613`) carry no judgement at all.** The tree says only "VIDEO". One is 44.5 minutes.
7. **Nothing is deleted on the strength of this manifest.** See the standing note at the end of Part B.

## WHAT I COULD NOT DETERMINE — short form

- I was **not given the prior "four master/derivative clusters"**, so I cannot check my derivation against it.
- I did **not decode any PSD composite** (that would mean writing an extracted image), so PSD→PNG pairings rest on dimension identity and naming, not pixels.
- I did **not open any image visually**, so "is 002b a different crop or a different edit" is answered from bytes and dimensions only.
- The brief's **"18 files"** under the two NIAC folders is wrong: there are **22** (15 video + 7 text/JSON).

---

# PART A — THE MANIFEST

## Verification of the brief

| | Brief said | Measured | Verdict |
|---|---|---|---|
| File count | 84 | **84** | matches |
| Total size | 5.35 GiB | **5,746,098,538 B = 5.3515 GiB** | matches |
| Hydration | fully hydrated | **all 84 hashed successfully** | confirmed hydrated |
| Fenced NIAC files | 18 | **22** | **DISCREPANCY** |

All 84 files carry the `ReparsePoint` attribute (normal for OneDrive) but **none carry `Offline`**, and `Get-FileHash` read every byte of all 5.35 GiB without a single stall or error. Hydration is confirmed by the read, not by the attribute.

On the fence count: `CUT VIDEO - NIAC` holds 12 files (6 mp4, 3 README.txt, 3 timeline.json); `RAW VIDEO - NIAC` holds 10 (9 mp4, 1 README.txt). That is 22 files / 15 videos. No arithmetic gets to 18. **I have inventoried them where they fall and proposed no destination for any of them.**

## Tooling

- **`ffprobe` IS available** (v8.0.1-full, gyan.dev build, via WinGet). Used for every image, audio and video file — 73 of 84.
- **PSD headers read directly from bytes** (signature/version/channels/height/width/depth/mode at offsets 0/4/12/14/18/22/24) — 4 files. All four are valid `8BPS` v1.
- **`.txt` / `.json`** — 7 files, read as text.
- Nothing was installed.

## Storage by folder

| Folder | Files | Bytes |
|---|---:|---:|
| `BOWB.Vol1\VIDEO` | 11 | 4,557,032,051 |
| `Weird.Baby Files\MGKVIIIp` | 3 | 542,646,500 |
| `BOWB.Vol1\LOGO` | 5 | 286,469,367 |
| `Weird.Baby Files\RAW VIDEO - NIAC` | 10 | 133,498,992 |
| `BOWB.Vol1\RAW RECORDING` | 3 | 110,267,712 |
| `Weird.Baby Files\CUT VIDEO - NIAC` | 12 | 77,999,588 |
| `BOWB.Vol1\PHOTOS` | 31 | 18,988,154 |
| `Weird.Baby Files\RAW IMAGES - VIIIp` | 6 | 14,196,135 |
| `Weird.Baby Files\EDITED IMAGES - VIIIp` | 3 | 5,000,039 |

**79% of the whole 5.35 GiB is `BOWB.Vol1\VIDEO`, and 41% of the whole is five unlabelled camera originals.**

## Summary table — all 84 files

sha256 shown as first 12 hex chars; the manifest carries the full lowercase hash.

### `BOWB.Vol1\LOGO` — 5 files

| sha256 | Bytes | File | Type / dimensions |
|---|---:|---|---|
| `34cbe2f13a1d` | 172,123 | Weird.Baby Bar Logo (FULL RESOLUTION).png | PNG 5649×1016 RGBA 8-bit |
| `fcc65f846e05` | 2,242,168 | Weird.Baby Round Logo (300DPI for Printful).png | PNG 2673×2700 RGBA 8-bit |
| `b0f3744101e1` | 7,364,698 | Weird.Baby Round Logo (FULL RESOLUTION).png | PNG 6000×6000 RGBA 8-bit |
| `432efaaa49c9` | 257,761,808 | Weird.Baby Round Logo (MASTER).psd | PSD 6000×6000, 4 ch, 8-bit, RGB |
| `ec4212254ca9` | 18,928,570 | WeirdBaby_ALBUM COVER (MASTER).psd | PSD 4506×4506, 3 ch, 8-bit, RGB |

### `BOWB.Vol1\PHOTOS` — 31 files, all JPEG

Expression folders (13) then `PHOTOS NOT YET USED` (18).

| sha256 | Bytes | File | Dimensions | Pixel format |
|---|---:|---|---|---|
| `769f9a20550f` | 656,437 | BORED / ORIGINAL PHOTOS / Copy of Michael baby 015.jpg | 2035×2898 | yuvj444p |
| `59e434f91422` | 387,473 | HOLY CRAP / … / Copy of Michael baby 002.jpg | 1927×2887 | **yuvj420p** |
| `f96c1e7e15d3` | 553,820 | HOLY CRAP / … / Copy of Michael baby 002a.jpg | 1892×2852 | yuvj444p |
| `fe40f17d95dc` | 466,559 | HOLY CRAP / … / Copy of Michael baby 002b.jpg | **1892×2042** | yuvj444p |
| `514739d4e631` | 529,073 | HOLY CRAP / … / Copy of Michael baby 002c.jpg | **1892×2042** | yuvj444p |
| `89d4c0332cf1` | 306,911 | IN LOVE / … / Michael baby 001.jpg | 955×1427 | yuvj444p |
| `53f87cef25a8` | 447,953 | IN LOVE / … / Michael baby 001a.jpg | **1892×2042** | yuvj444p |
| `768c691680f8` | 596,476 | INFATUATION / … / Copy of Michael baby 011.jpg | 2019×2942 | **gray** |
| `815f9ea7dee1` | 539,199 | INFATUATION / … / Copy of Michael baby 011a.jpg | **1892×2042** | yuvj444p |
| `13c6332979b7` | 606,443 | SHOCK AND AWE / … / Copy of Michael baby 012.jpg | 2035×2898 | yuvj444p |
| `d97299382951` | 550,526 | SHOCK AND AWE / … / Copy of Michael baby 012a.jpg | **1892×2042** | yuvj444p |
| `fb3d58f7a270` | 667,344 | SKEPTICAL / … / Copy of Michael baby 013.jpg | 2035×2898 | yuvj444p |
| `d4e188969891` | 573,043 | YEAH YEAH / … / Copy of Michael baby 014.jpg | 2035×2898 | yuvj444p |
| `c0008de5284a` | 1,104,476 | NOT YET USED / Michael baby 003.jpg | 2218×2866 | yuvj444p |
| `2c218e5723c0` | 942,506 | NOT YET USED / Michael baby 003a.jpg | **2218×2866** | yuvj444p |
| `ad2512f322b1` | 1,054,008 | NOT YET USED / Michael baby 004.jpg | 2290×2866 | yuvj444p |
| `a2b6479e8431` | 860,479 | NOT YET USED / Michael baby 004a.jpg | 2218×2866 | yuvj444p |
| `1bf93dfd2b78` | 1,160,751 | NOT YET USED / Michael baby 005.jpg | 2210×2866 | yuvj444p |
| `bd6f5fb01d79` | 982,718 | NOT YET USED / Michael baby 005a.jpg | **2218×2866** | yuvj444p |
| `1a67c8629cd5` | 345,262 | NOT YET USED / Michael baby 006.jpg | 1375×2071 | yuvj444p |
| `6474742ddc3f` | 255,891 | NOT YET USED / Michael baby 006a.jpg | 684×1012 | yuvj444p |
| `8046bdcc2081` | 646,952 | NOT YET USED / Michael baby 007.jpg | 2338×2942 | yuvj444p |
| `95a8c12d04a8` | 251,693 | NOT YET USED / Michael baby 008.jpg | 676×992 | yuvj444p |
| `a7ab36a995d0` | 217,683 | NOT YET USED / Michael baby 008a.jpg | 558×774 | yuvj444p |
| `9a4608d3b336` | 226,758 | NOT YET USED / Michael baby 008a (2).jpg | 526×746 | yuvj444p |
| `3f83aab549c3` | 226,758 | NOT YET USED / Michael baby 008a (3).jpg | 526×746 | yuvj444p |
| `ad153ef2ed1e` | 2,301,672 | NOT YET USED / Michael baby 009.jpg | **4629×5845** | yuvj444p |
| `cb77222e73a0` | 217,386 | NOT YET USED / Michael baby 009a.jpg | 558×774 | yuvj444p |
| `9b25539ac57b` | 224,114 | NOT YET USED / Michael baby 009a (2).jpg | 527×746 | yuvj444p |
| `9b25539ac57b` | 224,114 | NOT YET USED / Michael baby 009a (3).jpg | 527×746 | yuvj444p |
| `b30ac9c377ed` | 863,676 | NOT YET USED / Michael baby 010.jpg | 2262×2815 | yuvj444p |

### `BOWB.Vol1\RAW RECORDING` — 3 files, all WAV

| sha256 | Bytes | File | Audio |
|---|---:|---|---|
| `84382c6205a7` | 37,718,482 | COCONUTS_Full_Rough_Parlor.wav | pcm_s24le · 48 kHz · stereo · 24-bit · 2:10.95 |
| `34b91755338d` | 40,577,602 | EDYD - SNIPPETS CHORUS.wav | pcm_s24le · 48 kHz · stereo · 24-bit · 2:20.88 |
| `f3890a711961` | 31,971,628 | EDYD_Full_lacks Chorus_Parlor.wav | pcm_s24le · 48 kHz · stereo · 24-bit · 1:51.00 |

### `BOWB.Vol1\VIDEO` — 11 files

| sha256 | Bytes | File | Duration | Video | Audio |
|---|---:|---|---|---|---|
| `7017a124d9da` | 775,164,017 | DEMO TRACK.mp4 | 16:11.6 | h264 Main 1280×720 yuv420p 30 fps · 6.22 Mbps · 29,149 f | aac 48 kHz stereo 157 kbps |
| `73dab8183d39` | 437,837,276 | ED_YAHDAH.MOV | 4:45.4 | **hevc Main 10** 1920×1080 yuv420p10le ~30 fps · 12.08 Mbps · 8,561 f | aac 48 kHz stereo 103 kbps |
| `a275fd59a2fb` | 245,939,550 | HOW I SAVED THE WORLD.MOV | 2:07.8 | hevc Main 10 1920×1080 yuv420p10le · 15.09 Mbps · 3,834 f | aac 48 kHz stereo 206 kbps |
| `a275fd59a2fb` | 245,939,550 | HOW_I SAVED_THE_WORLD_BLUES _ MASTER 001.MOV | 2:07.8 | **byte-identical to the row above** | — |
| `afaa214493f7` | 4,169,635 | IMG_8609.MP4 | 0:09.3 | h264 High 1280×720 29.97 fps · 3.39 Mbps · 280 f | aac 48 kHz stereo 92 kbps |
| `c7e248897c4e` | 111,271,262 | IMG_8610.MP4 | 4:09.2 | h264 High 1280×720 29.97 fps · 3.36 Mbps · 7,474 f | aac 48 kHz stereo 90 kbps |
| `75ea7cc7dbc3` | 349,084,743 | IMG_8611.MP4 | 13:00.5 | h264 High 1280×720 29.97 fps · 3.36 Mbps · 23,406 f | aac 48 kHz stereo 93 kbps |
| `53fa4fdf3ed6` | 507,679,305 | IMG_8612.MP4 | 18:55.6 | h264 High 1280×720 29.97 fps · 3.36 Mbps · 34,056 f | aac 48 kHz stereo 94 kbps |
| `c0a4a0449c3b` | 1,196,688,771 | IMG_8613.MP4 | **44:30.4** | h264 High 1280×720 29.97 fps · 3.36 Mbps · 80,082 f | aac 48 kHz stereo 99 kbps |
| `f65225c8d911` | 487,021,836 | PULL ME IN CLOSER and BREAKUP BREAKDOWN.MOV | 7:22.96 | hevc Main 10 1920×1080 yuv420p10le · 8.60 Mbps · 13,288 f | aac 48 kHz stereo 101 kbps |
| `1caf0a5c8596` | 196,236,106 | PULL ME IN CLOSER and BREAKUP BREAKDOWN.MP4 | 7:22.96 | h264 High 1280×720 yuv420p 30 fps · 3.36 Mbps · 13,288 f | aac 48 kHz stereo 101 kbps |

### `Weird.Baby Files\EDITED IMAGES - VIIIp` — 3 files

| sha256 | Bytes | File | Type |
|---|---:|---|---|
| `e801f38e1850` | 3,818,344 | mgk-niac-cover.psd | PSD 1200×1200, 3 ch, 8-bit, RGB |
| `cafb2b47ef90` | 364,390 | NEW Robots.png | PNG 1200×1200 RGBA 8-bit |
| `50d5a48acfcc` | 817,305 | PANEL.png | PNG 1639×1416 **rgb24 (no alpha)** |

### `Weird.Baby Files\RAW IMAGES - VIIIp` — 6 files, all PNG

| sha256 | Bytes | File | Dimensions | Colour |
|---|---:|---|---|---|
| `a0800856de09` | 1,476,381 | Front Screen.png | 2048×1536 | RGBA |
| `c1ce005749e6` | 3,268,686 | Front.png | 1536×2048 | RGBA |
| `6d295e49d6dc` | 2,097,733 | MONITOR.png | 1408×768 | RGBA |
| `097ee1c0e9f8` | 3,913,203 | Rear Power Switch.png | 2048×1536 | RGBA |
| `350d035a7668` | 2,040,499 | Top.png | 2048×1536 | RGBA |
| `30765f281132` | 1,399,633 | viiip.png | 1536×1536 | **GREYSCALE** |

### `Weird.Baby Files\MGKVIIIp` — 3 files

| sha256 | Bytes | File | Type |
|---|---:|---|---|
| `0ff3e95670f4` | 360,810,318 | MGK-TWIN MONITOR SCREENS_2.psd | PSD 3000×2400, 4 ch, 8-bit, RGB |
| `8cce3df75ccf` | 33,635,961 | MGKVIIIp_B.mp4 | 3:51.5 · h264 Main 640×480 29.97 fps 1.00 Mbps · aac 157 kbps |
| `0bf54094f539` | 148,200,221 | MGKVIIIp.MP4 | 5:31.0 · h264 High 1280×720 ~30 fps 3.36 Mbps · aac 182 kbps |

### `Weird.Baby Files\RAW VIDEO - NIAC` — 10 files · ⛔ FENCED

**Inventoried only. No destination proposed for any file in this folder.**
All nine videos: h264 High, **1080×1920 portrait**, 30 fps CFR, **no audio stream at all**.

| sha256 | Bytes | File | Duration | Bitrate |
|---|---:|---|---|---|
| `334c4b254315` | 7,777,570 | 01_the-boot_C7.mp4 | 13.5 s | 4.61 Mbps |
| `c6f10c24ae14` | 9,569,497 | 02_the-core-three-ways_C2.mp4 | 17.0 s | 4.50 Mbps |
| `076bc36fbeec` | 3,649,151 | 03_the-meltdown_C1.mp4 | 6.0 s | 4.86 Mbps |
| `82efa057425c` | 6,975,296 | 04_the-eye-cycles_C3.mp4 | 13.0 s | 4.29 Mbps |
| `c297216c844b` | 7,808,521 | 05_the-head-turns_C4.mp4 | 13.0 s | 4.80 Mbps |
| `eeb5f7caa33c` | 9,244,101 | 06_the-hand_C5.mp4 | 14.0 s | 5.28 Mbps |
| `2cca8767feac` | 11,410,607 | 07_the-reel-kicks_C6.mp4 | 20.0 s | 4.56 Mbps |
| `a8fb7e29d918` | 10,315,894 | 08_the-finale_C8.mp4 | 18.0 s | 4.58 Mbps |
| `5ea1af35ab98` | 66,745,503 | MAGIC8-2021_ACTION-REEL_review-cut.mp4 | **114.5 s** | 4.66 Mbps |
| `9d7e6664b21f` | 2,852 | README.txt | 54 lines | plain text |

### `Weird.Baby Files\CUT VIDEO - NIAC` — 12 files · ⛔ FENCED

**Inventoried only. No destination proposed for any file in this folder.**
All six videos: h264 High, 1080×1920 portrait, 30 fps CFR.

| sha256 | Bytes | File | Duration | Audio |
|---|---:|---|---|---|
| `dc9dc9ce5342` | 15,926,779 | WB_SIGNATURE_A_WTF_rough.mp4 | 19.40 s | **none** |
| `9f76bd0909ec` | 20,361,330 | WB_SIGNATURE_A_WTF_rough_v2.mp4 | 24.90 s | **none** |
| `1bf24dd0cd79` | 6,700,156 | WB_SIGNATURE_A_WTF_rough_v3.mp4 | 13.33 s | **none** |
| `bf5198e0d0d4` | 12,799,258 | WB_SIGNATURE_B_WTH_rough.mp4 | 23.10 s | aac 10 kbps |
| `cd59ef333ed9` | 15,508,488 | WB_SIGNATURE_B_WTH_rough_v2.mp4 | 24.87 s | aac 10 kbps |
| `3ab04247188f` | 6,661,757 | WB_SIGNATURE_B_WTH_rough_v3.mp4 | 16.50 s | aac 21 kbps |
| `60cde475b720` | 3,688 | README.txt | 78 lines | plain text |
| `8ffab9bd9f08` | 7,155 | README_v2.txt | 151 lines | plain text |
| `aa8ca2596a48` | 10,436 | README_v3.txt | 235 lines | plain text |
| `f85f4a387f07` | 5,670 | timeline.json | — | JSON build-timeline sidecar |
| `677ffe50332c` | 6,655 | timeline_v2.json | — | JSON build-timeline sidecar |
| `5abc2485f985` | 8,216 | timeline_v3.json | — | JSON build-timeline sidecar |

---

# PART B — THE JUDGEMENTS THE TREE CARRIES

> **STANDING NOTE, STATED PROMINENTLY AS INSTRUCTED:**
> **After this manifest exists, the folder structure is redundant — every judgement it encoded is now written into `JOB1-manifest.json` per file. But NOTHING is deleted on the strength of it. That is Mike's ruling to make later, not JOB 1's, and JOB 1 has not made it.**

## B1 — THE SEVEN EXPRESSION NAMES

**Where the expression is written: THE FOLDER NAME ONLY, for all 13 photos. Not one filename anywhere in the tree contains an expression word.** This is the single most fragile judgement in the folder: rename or flatten these directories and all seven expressions are gone with no trace in any byte of any file.

Exact folder strings as found — the pattern is `Baby Weird.Baby <EXPRESSION>`, then a nested `ORIGINAL PHOTOS` directory:

| Expression (exact casing) | Exact folder string | Photos | Files |
|---|---|---:|---|
| `BORED` | `Baby Weird.Baby BORED` | 1 | 015 |
| `HOLY CRAP` | `Baby Weird.Baby HOLY CRAP` | 4 | 002, 002a, 002b, 002c |
| `IN LOVE` | `Baby Weird.Baby IN LOVE` | 2 | 001, 001a |
| `INFATUATION` | `Baby Weird.Baby INFATUATION` | 2 | 011, 011a |
| `SHOCK AND AWE` | `Baby Weird.Baby SHOCK AND AWE` | 2 | 012, 012a |
| `SKEPTICAL` | `Baby Weird.Baby SKEPTICAL` | 1 | 013 |
| `YEAH YEAH` | `Baby Weird.Baby YEAH YEAH` | 1 | 014 |

**All seven are present. All seven are ALL-CAPS with single internal spaces and no punctuation. Total: 13 photos carry an expression.**

### Photos carrying NO expression: 71 of 84 files, and 18 of the 31 photos

All 18 photos under `Baby Weird.Baby_PHOTOS NOT YET USED` carry no expression. That is consistent with the folder's own meaning — they have not been assigned one yet — but it is worth naming plainly: **`Michael baby 003` through `010` have no expression, and nothing in the tree suggests which they would take.**

### Near-miss check — is there an eighth expression?

**No eighth expression string exists.** But one string sits in the expression slot and is not an expression, and it is worth stating precisely because a mechanical parser would fold it in:

> `Baby Weird.Baby_PHOTOS NOT YET USED`

It occupies the same position in the tree as the seven expression folders, under the same `Baby Weird.Baby` prefix — **but it joins with an UNDERSCORE (`Baby Weird.Baby_`) where all seven expressions join with a SPACE (`Baby Weird.Baby `)**. That one character is the only thing separating a status from an expression in this naming scheme. I have recorded it as a status, not as an eighth expression, and I have not folded it into any of the seven.

No other string anywhere in the 84 paths is expression-shaped.

## B2 — "PHOTOS NOT YET USED" AS A STATUS

Recorded per file as `judgements.statusNotYetUsed` (boolean) with `statusRawFolder` holding the exact string `Baby Weird.Baby_PHOTOS NOT YET USED`.

**18 files carry the status.** In basename order:

`Michael baby 003.jpg` · `003a` · `004` · `004a` · `005` · `005a` · `006` · `006a` · `007` · `008` · `008a` · `008a (2)` · `008a (3)` · `009` · `009a` · `009a (2)` · `009a (3)` · `010`

Read as a field rather than a folder: **the collection is 31 photos, 13 USED (expression assigned), 18 NOT YET USED (58%).** The status is binary in this tree — there is no "rejected", no "used", no third value. `NOT YET USED` implies a future; nothing here says any photo was ever ruled out.

## B3 — PURPOSE

Three canonical strings were looked for. All three are present, **all three only in `BOWB.Vol1\LOGO`, all three only in filenames, and nowhere else in the tree.**

| Exact string found | Files |
|---|---|
| `(MASTER)` | `Weird.Baby Round Logo (MASTER).psd` · `WeirdBaby_ALBUM COVER (MASTER).psd` |
| `(FULL RESOLUTION)` | `Weird.Baby Bar Logo (FULL RESOLUTION).png` · `Weird.Baby Round Logo (FULL RESOLUTION).png` |
| `(300DPI for Printful)` | `Weird.Baby Round Logo (300DPI for Printful).png` |

Note the casing of the third: **`300DPI` capitalised, `for` lower, `Printful` title-case** — it is not `(300 DPI FOR PRINTFUL)`. Recorded verbatim.

**79 of 84 files carry no purpose at all.**

### Purpose-shaped strings that are NOT one of the three

Recorded separately as `judgements.purposeLike` so nothing is silently absorbed:

1. **`MASTER 001`** — in `BOWB.Vol1\VIDEO\HOW_I SAVED_THE_WORLD_BLUES _ MASTER 001.MOV`. **Unbracketed, and numbered.** It asserts master status in a different grammar from `(MASTER)`, and the `001` implies a series of masters that has no second member here. This is a genuinely different vocabulary and I have not merged it.
2. **`rough`** — on all six `WB_SIGNATURE_*` videos (fenced). Purpose-shaped in the opposite direction: it asserts *not* finished.
3. **`review-cut`** — on `MAGIC8-2021_ACTION-REEL_review-cut.mp4` (fenced). Same.
4. **`_B`** — on `MGKVIIIp_B.mp4`. Variant-shaped, purpose unknown.
5. **`NEW`** — on `NEW Robots.png`. Asserts recency against an old that is not in this tree.

## B4 — PIPELINE STAGE

Recorded per file as `judgements.pipelineStage` + `pipelineStageRawFolder`. **Always folder-borne, never in a filename.**

| Stage | Files | Exact folder strings |
|---|---:|---|
| `RAW` | 19 | `RAW RECORDING` (3) · `RAW IMAGES - VIIIp` (6) · `RAW VIDEO - NIAC` (10) |
| `EDITED` | 3 | `EDITED IMAGES - VIIIp` |
| `CUT` | 12 | `CUT VIDEO - NIAC` |
| *(none)* | 50 | — |

### A fourth stage word exists and is not in the RAW/EDITED/CUT vocabulary

**`ORIGINAL PHOTOS`** — the directory nested inside each of the seven expression folders. **13 files sit under it.** Recorded as `judgements.pipelineStageOther` rather than mapped onto `RAW`, because:

- It is a *fifth* term, and mapping it to `RAW` would be an invention.
- It does **not** appear under `PHOTOS NOT YET USED` — those 18 photos sit directly in the status folder with no stage layer at all. So the tree draws a distinction between the two photo groups that has nothing to do with expression, and that distinction is unrecoverable if the tree goes.

**Also note:** three of the four stage folders name a subject as well as a stage (`- VIIIp`, `- NIAC`), and one names a medium (`RAW RECORDING`). The stage vocabulary is not applied consistently across the tree — 50 files have no stage at all, including every one of the 11 files in `BOWB.Vol1\VIDEO` and all five logos.

## B5 — MASTER/DERIVATIVE CLUSTERS

**I was not told which four were "already identified", so I cannot check against them.** What follows is derived from evidence only. I find **four strong clusters among the non-fenced material**, plus a fenced chain, two version chains, two duplicate pairs, and four orphans. Whether my four are the four is not something I can determine.

### CLUSTER 1 — Round Logo · **confidence HIGH**

| Role | File | Dimensions | Bytes |
|---|---|---|---:|
| MASTER | `Weird.Baby Round Logo (MASTER).psd` | 6000×6000 RGB 4 ch 8-bit | 257,761,808 |
| derivative | `Weird.Baby Round Logo (FULL RESOLUTION).png` | 6000×6000 RGBA | 7,364,698 |
| derivative | `Weird.Baby Round Logo (300DPI for Printful).png` | 2673×2700 RGBA | 2,242,168 |

**Evidence:** shared basename `Weird.Baby Round Logo`; the PSD's canvas is **exactly** the FULL RESOLUTION PNG's canvas (6000×6000); the three files carry exactly the three canonical purpose strings and nothing else does; monotonic size relationship; mtimes run MASTER 10:56 → FULL RES 10:59 → 300DPI 13:46 **on the same day (2026-06-23)**, i.e. the master is oldest and the derivatives follow it in the expected order. This one is as well-attested as it gets short of decoding pixels.

**One oddity worth a look:** the Printful export is **2673×2700 — not square.** At 300 dpi that is 8.91 × 9.00 in. If a 9×9 in print was intended, the width is 27 px short.

### CLUSTER 2 — HOW I SAVED THE WORLD · **confidence CERTAIN (and it is a duplicate, not a derivative)**

| File | sha256 | Bytes |
|---|---|---:|
| `HOW I SAVED THE WORLD.MOV` | `a275fd59a2fb06fb1467c77d93fca0d024ca3c7184795deeb73ff1c63ad9207d` | 245,939,550 |
| `HOW_I SAVED_THE_WORLD_BLUES _ MASTER 001.MOV` | *identical hash* | 245,939,550 |

**Evidence:** identical sha256, identical byte count, identical mtime to the minute (2026-06-18 11:16). These are **the same bytes stored twice**. There is no master and no derivative — there is one file and two opinions about what to call it. **246 MB of the 5.35 GiB is this duplication.** The tree-only judgement here is that the long name asserts *genre = BLUES* and *MASTER 001*; the short name asserts neither.

### CLUSTER 3 — PULL ME IN CLOSER and BREAKUP BREAKDOWN · **confidence CERTAIN**

| Role | File | Video | Bytes | mtime |
|---|---|---|---:|---|
| master | `…BREAKDOWN.MOV` | hevc Main 10, 1920×1080, yuv420p10le, 8.60 Mbps | 487,021,836 | 2026-06-16 11:27 |
| derivative | `…BREAKDOWN.MP4` | h264 High, 1280×720, yuv420p, 3.36 Mbps | 196,236,106 | 2026-06-17 21:56 |

**Evidence, and it is arithmetic rather than inference:** duration identical to the microsecond (442.956667 s), `avg_frame_rate` identical as an unreduced fraction (**3986400/132887** — a nonsense-looking ratio that two independently-produced files would not share), frame count identical (13,288), audio bit rate identical (100,595 bps). Same edit. Direction is settled by resolution (1080 → 720), codec generation (HEVC 10-bit → H.264 8-bit) and mtime (MOV precedes MP4 by 34 hours).

**Note the tree-only judgement in the filename:** the file holds **two songs** — *PULL ME IN CLOSER* **and** *BREAKUP BREAKDOWN*. Nothing in the bytes says where one ends.

### CLUSTER 4 — mgk-niac-cover.psd → NEW Robots.png · **confidence MEDIUM, and the dates run backwards**

| Role | File | Dimensions | Bytes | mtime |
|---|---|---|---:|---|
| master? | `EDITED IMAGES - VIIIp\mgk-niac-cover.psd` | 1200×1200 RGB 3 ch 8-bit | 3,818,344 | **2026-08-10 13:50** |
| derivative? | `EDITED IMAGES - VIIIp\NEW Robots.png` | 1200×1200 RGBA | 364,390 | 2026-08-09 11:28 |

**Evidence for:** exact canvas identity at an unusual size (1200×1200), same folder, layered form + flat form, and `EDITED` is the stage that would produce exactly this pair.
**Evidence against / unresolved:** **the PSD is a day NEWER than the PNG.** If they are a pair, the PNG is a stale export and the current art is only inside the PSD. I did not decode the PSD composite to compare pixels, so this pairing rests on dimensions and naming. **Confidence MEDIUM, and this is question 2 in WHAT NEEDS MIKE.**

### CLUSTER 5 — MGKVIIIp video pair · **confidence LOW — probably NOT a master/derivative pair**

| File | Duration | Video | Bytes | mtime |
|---|---|---|---:|---|
| `MGKVIIIp.MP4` | 330.995 s | h264 High 1280×720, 3.36 Mbps | 148,200,221 | 2026-01-17 11:41 |
| `MGKVIIIp_B.mp4` | 231.465 s | h264 Main 640×480, 1.00 Mbps | 33,635,961 | 2026-01-17 11:53 |

**The durations differ by 99.5 seconds.** A transcode preserves duration; these do not. They share a basename and a capture date but they are **different edits or different source material**. I am recording them as a *named pair of unknown relation*, not as a cluster. Reporting this as a master/derivative pair would be the easy wrong answer.

### CLUSTER 6 — the NIAC chain · ⛔ FENCED · **confidence CERTAIN, and documented in the tree itself**

**Inventoried for completeness. No destination is proposed for any file in it. If the reconstruction below were used to justify moving these into `public/` or a repo, that branch stops here — the folder's own READMEs declare every one of them unpublishable.**

The chain, as the READMEs state it and as the bytes confirm:

```
IMG_1526.MOV  (2021-03-19 narrated build video, "CSR archive")   ← NOT IN THIS TREE
   └─ RAW VIDEO - NIAC\  eight shots, cut 2026-08-03
        └─ MAGIC8-2021_ACTION-REEL_review-cut.mp4
             └─ CUT VIDEO - NIAC\  WB_SIGNATURE_{A,B}  v1 → v2 → v3
```

**Arithmetic proof of the reel:** 13.5 + 17.0 + 6.0 + 13.0 + 13.0 + 14.0 + 20.0 + 18.0 = **114.5 s**, and `MAGIC8-2021_ACTION-REEL_review-cut.mp4` is **exactly 114.500000 s**. The reel is the eight shots concatenated, in the numbered order, with no titles and no transitions — exactly as its README claims.

**The ultimate master is NOT in this tree.** `IMG_1526.MOV` lives in the "CSR archive". Everything under both NIAC folders is re-derivable from it plus scripts; both READMEs say so and give the commands.

### CLUSTER 7 — exact duplicate: `Michael baby 009a (2)` / `009a (3)`

sha256 `9b25539ac57b19284948d4c0032e62a1b7e4c84f831b883195fcea13ffa50201`, 224,114 B, 527×746, twice. Byte-identical. Pure redundancy.

### CLUSTER 8 — the one that is NOT a duplicate, and looks like one

`Michael baby 008a (2).jpg` and `008a (3).jpg` have **the same byte count (226,758) and the same dimensions (526×746) but DIFFERENT sha256** (`9a4608d3…` vs `3f83aab5…`). Two different images at identical size — most likely a metadata-only or minimally-different re-save. **Flagged rather than folded in:** anything that de-duplicates on size alone would destroy one of these.

### ORPHANS — files whose partner is missing

| File | What is missing |
|---|---|
| `WeirdBaby_ALBUM COVER (MASTER).psd` (4506×4506) | **A `(MASTER)` with no derivative of any kind in the tree.** No FULL RESOLUTION, no Printful export. |
| `Weird.Baby Bar Logo (FULL RESOLUTION).png` (5649×1016) | **A `(FULL RESOLUTION)` with no master PSD.** And it is a live working asset — both fenced READMEs name this exact file as the logo used in the signature short. |
| `MGK-TWIN MONITOR SCREENS_2.psd` (3000×2400, 360 MB) | The `_2` implies a `_1`. Not here. Largest single PSD in the tree. |
| `PANEL.png` (1639×1416, EDITED) | Matches no RAW image's dimensions. Its source is not in `RAW IMAGES - VIIIp`. |

**So: I find FOUR clusters that involve a file marked or implied MASTER (1, 2, 3, 4), and I say plainly that cluster 2 is a duplicate rather than a derivative and cluster 4 is only MEDIUM confidence.** Whether these are the four "already identified" I cannot tell, and I flag it below.

## B6 — THE a/b/c SUFFIX: TESTED AGAINST THE BYTES

**Claim under test:** *the `a`/`b`/`c` filename suffix is a CROP, not a version.*
**Predicted signature if true:** files sharing a base number should share a source and differ in **aspect / dimensions**, not in **edit state**.

**Verdict: the claim is TRUE for some pairs and DEMONSTRABLY FALSE for at least four. As a blanket rule it does not survive the evidence. Confidence HIGH on the falsification; the four contradictions are dimensional and colour-space facts, not judgement calls.**

Suffix census across the 31 photos: **15 bare · 14 `a` · 1 `b` · 1 `c`.** There is no `d` or beyond. `b` and `c` exist on exactly one shot, 002.

### The four contradictions

| Pair | Base | Suffixed | What contradicts "crop" |
|---|---|---|---|
| **003 / 003a** | 2218×2866 | **2218×2866** | **Dimensions are IDENTICAL.** A crop that removes nothing is not a crop. Yet the files differ by 162 KB (1,104,476 → 942,506) and by hash. Same rectangle, different picture — **that is a VERSION.** |
| **005 / 005a** | 2210×2866 | **2218×2866** | **The suffixed file is 8 px WIDER than the base.** A crop cannot grow. Either it is not derived from 005, or it is not a crop. |
| **001 / 001a** | 955×1427 | **1892×2042** | **The suffixed file is LARGER in BOTH dimensions** — 1.98× wide, 1.43× tall. It cannot be a crop of 001. If anything the derivation runs the other way, or both come from a third original. |
| **011 / 011a** | 2019×2942, **`gray`** | 1892×2042, `yuvj444p` | **The base is GREYSCALE and the suffixed file is FULL COLOUR.** A crop does not add colour. `011a` cannot be derived from `011`. |

### The pairs that DO look like crops

| Pair | Base | Suffixed | Reading |
|---|---|---|---|
| 002 / 002a | 1927×2887 | 1892×2852 | −35 px on each axis. Consistent with a small crop. **But 002 is `yuvj420p` and 002a is `yuvj444p`** — a chroma-subsampling change means a re-encode happened too, so it is a crop *and* a re-save. |
| 004 / 004a | 2290×2866 | 2218×2866 | Width −72, height unchanged. A clean horizontal crop. The cleanest example in the set. |
| 012 / 012a | 2035×2898 | 1892×2042 | Both axes reduced, aspect changed 0.702 → 0.926. Consistent with a crop to a different shape. |

### The pairs that are RESIZES, not crops

| Pair | Base | Suffixed | Scale factors |
|---|---|---|---|
| 006 / 006a | 1375×2071 | 684×1012 | ×0.498 / ×0.489 — **near-uniform downscale.** That is a resize. |
| 009 / 009a | **4629×5845** | 558×774 | ×0.121 / ×0.132 — a ~8× downscale, with a slight aspect change. Mostly a resize. |
| 008 / 008a | 676×992 | 558×774 | ×0.826 / ×0.780 — crop *and* scale, mixed. |

### The finding that reframes the whole question

**`1892×2042` is not a per-shot crop. It is a DELIVERY RECTANGLE.**

Five files land on that exact size, and they come from **four different expression folders**:

- `IN LOVE / Michael baby 001a.jpg`
- `HOLY CRAP / Copy of Michael baby 002b.jpg`
- `HOLY CRAP / Copy of Michael baby 002c.jpg`
- `INFATUATION / Copy of Michael baby 011a.jpg`
- `SHOCK AND AWE / Copy of Michael baby 012a.jpg`

Four different source photographs, four different original sizes (955×1427, 1927×2887, 2019×2942, 2035×2898), all converging on one identical output rectangle. That does not happen by cropping each shot to taste. **It happens when there is an output spec.**

Which yields the structural reading:

- **In the EXPRESSION folders, the suffix marks THE DELIVERED DERIVATIVE at 1892×2042.** Closer to a *purpose* than to a crop. (Confidence MEDIUM-HIGH.)
- **In `PHOTOS NOT YET USED`, the suffix marks something else entirely** — mostly a downscaled preview (006a, 008a, 009a) or a same-size re-edit (003a, 005a). Not one file in that folder is 1892×2042. (Confidence HIGH.)
- **`002b` and `002c` are the clincher against the claim as stated.** Same folder, same base shot, **same rectangle (1892×2042)**, different bytes, different hashes. Two files that differ only in content at a fixed crop **are versions of each other by definition.** They are the only `b`/`c` in the tree, and they are precisely the case the claim says cannot exist.

**Recommendation for Mike (question 1):** the suffix needs two rules, not one — one for the expression folders and one for `NOT YET USED` — or it needs re-deriving from the images themselves. I have recorded the raw suffix per file in `judgements.cropSuffix` and drawn no conclusion into the manifest data.

## B7 — EVERYTHING ELSE THE TREE ENCODES THAT IS NOT IN THE BYTES

Each of these fails the test *"if this folder vanished tomorrow, would this judgement be unrecoverable?"* — i.e. the answer is **yes, it would be lost.**

### Collection / volume

- **`BOWB.Vol1`** — a volume number on a named collection, on 50 files. A `Vol1` asserts a `Vol2`. Folder-only.
- **`Weird.Baby Files`** — the other 34 files. The two top-level folders are the only thing distinguishing two entirely separate bodies of work.

### Subject / product codes

- **`NIAC`** — in `CUT VIDEO - NIAC` and `RAW VIDEO - NIAC`, and in exactly one filename (`mgk-niac-cover.psd`).
- **`VIIIp` / `MGKVIIIp` / `MGK`** — in three folder names and two filenames (`MGKVIIIp.MP4`, `MGK-TWIN MONITOR SCREENS_2.psd`, `viiip.png`). Note `viiip.png` is lower-case where every folder is `VIIIp`.
- **`MAGIC8` / `magic 8`** — in one filename and throughout the READMEs. The subject of the whole NIAC body of work.

Nine of the fifteen VIIIp/NIAC files identify their subject ONLY through their folder.

### Provenance markers in filenames

- **`Copy of `** prefix on **11 photos** — every expression-folder photo *except* the two `IN LOVE` files (`Michael baby 001.jpg`, `001a.jpg`). None of the 18 `NOT YET USED` photos has it. **The two `IN LOVE` files are the only expression photos that are not "copies of" something**, and nothing explains why. Unrecoverable if renamed.
- **` (2)` / ` (3)`** Windows copy markers on four files (`008a`, `009a`). These record that a duplicate-name collision happened, and nothing else.
- **`IMG_8609`–`IMG_8613`, `IMG_1526`** — camera-original filenames. `IMG_1526` is named in the READMEs as the NIAC ultimate master and is **not present in this tree**.

### Recording / song judgements, in filenames only

| File | Encoded |
|---|---|
| `COCONUTS_Full_Rough_Parlor.wav` | song = COCONUTS · **Full** take · **Rough** · **Parlor** |
| `EDYD_Full_lacks Chorus_Parlor.wav` | song = EDYD · Full take · **"lacks Chorus"** — a known defect written into the name · Parlor |
| `EDYD - SNIPPETS CHORUS.wav` | the **chorus** for the take above, as **SNIPPETS** |
| `DEMO TRACK.mp4` | **DEMO** — 16:11 of it |
| `HOW_I SAVED_THE_WORLD_BLUES _ MASTER 001.MOV` | genre = **BLUES** · **MASTER 001** |
| `PULL ME IN CLOSER and BREAKUP BREAKDOWN.*` | **two songs in one file** |
| `ED_YAHDAH.MOV` | song title; relates to `EDYD` by sound, and nothing in the bytes says so |

**The two EDYD wavs are a complementary pair, not a master/derivative pair:** one is a full take that *lacks* the chorus, the other is the chorus. Losing the filenames loses the fact that they belong together and that one completes the other.

### The double ordering in the NIAC raw filenames (fenced — inventory only)

Every file in `RAW VIDEO - NIAC` carries **two different orderings at once**:

| Reel order (prefix) | Candidate ID (suffix) | Shot |
|---|---|---|
| 01 | **C7** | the-boot |
| 02 | **C2** | the-core-three-ways |
| 03 | **C1** | the-meltdown |
| 04 | **C3** | the-eye-cycles |
| 05 | **C4** | the-head-turns |
| 06 | **C5** | the-hand |
| 07 | **C6** | the-reel-kicks |
| 08 | **C8** | the-finale |

The numeric prefix is **reel order**; the `C` suffix is the **candidate ID from `docs/MAGIC8_VIDEO_ROUND-20260803.md` §V4**. They disagree for six of eight shots. Rename these files and the mapping between the reel and the round document is gone. Each name also carries a one-word content description (`the-boot`, `the-meltdown`, `the-hand`) that exists nowhere else.

### Version chains and supersession (fenced — inventory only)

`WB_SIGNATURE_{A,B}` runs **v1 → v2 → v3**, and `README_v3.txt` states that v1 and v2 are **SUPERSEDED but deliberately left in place for comparison**. That "deliberately left, not forgotten" judgement is in the README text only. Cut identities `A_WTF` and `B_WTH` are in the filenames only.

### Judgements the fenced READMEs carry that exist nowhere in any image or video

These are text, so they survive a folder flattening as long as the README files travel with the media — but they are **not** in the media bytes, and separating them from their folder separates them from what they describe:

- **The publishability ruling itself:** *"THESE ARE REVIEW CUTS. NOTHING HERE IS PUBLISHABLE"* and *"A REVIEW CUT IS NEVER PROMOTED TO A PUBLISHED ASSET BY BEING COPIED."*
- **Per-shot failure grades** against the obfuscation law — `RAW VIDEO - NIAC\README.txt` grades all eight shots: only **#7 (the-reel-kicks)** comes close to passing; #1/#2/#3 fail on the room; #4/#5/#6 fail hard on the robot's full silhouette; **#8 the-finale is called "the best shot and the most illegal one."**
- **A correction to an earlier document:** *"the round doc flagged only #4/#5/#6/#8. Watching the frames adds #1/#2/#3."*
- **Two Mike rulings dated 2026-08-04** (crops too deep / posters are fair game but a photographic portrait stays out), his verdict on v2 quoted verbatim, and the ruling that **shots 01 and 07 were scrapped by Mike on 2026-08-04**.
- **The unanswered brand call** on the nude illustration (see WHAT NEEDS MIKE).
- **Re-derivation commands** for every fenced artefact, and the fact that all of it is re-derivable from `IMG_1526.MOV` plus scripts.

### Dates the tree carries

Filesystem mtimes are recorded per file in the manifest. They cluster meaningfully and would be lost by any copy that does not preserve timestamps:

| Cluster | Date | What |
|---|---|---|
| Photos | **2026-02-23** 15:33 / 15:37 | All 31 in two batches minutes apart. The 15:33 batch is 001/001a/012/013/014/015; everything else is 15:37. |
| MGKVIIIp videos | 2026-01-17 | Oldest material in the tree |
| DEMO TRACK + IMG_86xx | 2026-06-05 | All five camera originals stamped 08:02 |
| ED_YAHDAH, PULL ME IN CLOSER | 2026-06-16 / 17 | |
| HOW I SAVED THE WORLD ×2 | 2026-06-18 11:16 | Both copies, same minute |
| Round Logo trio | 2026-06-23 | MASTER 10:56 → FULL RES 10:59 → 300DPI 13:46 |
| Bar Logo | 2026-06-24 12:09 | |
| RAW RECORDING | 2026-06-24 22:34–22:37 | All three within 3 minutes |
| RAW IMAGES - VIIIp | 2026-07-23/24 | except `viiip.png`, 2026-08-04 |
| RAW VIDEO - NIAC | 2026-08-03 23:10–23:14 | |
| CUT VIDEO - NIAC | 2026-08-04 01:15 → 08:52 | v1 ~01:15, v2 ~02:12, v3 ~08:36 — one overnight session |
| MGK-TWIN MONITOR SCREENS_2 | 2026-08-05 | |
| `NEW Robots.png` | **2026-08-09 11:28** | |
| `mgk-niac-cover.psd` | **2026-08-10 13:50** | **today** |

### Material with no judgement at all

**41% of the entire 5.35 GiB carries no judgement beyond the word "VIDEO":** `IMG_8609`–`IMG_8613`, 2.33 GB, five camera originals, all 720p h264 at ~3.4 Mbps, all stamped 2026-06-05 08:02. `IMG_8613` alone is **44 minutes 30 seconds**. Nothing in the tree says what they contain, whether they are takes of one thing or five different things, or whether any of them has been used. This is the largest unlabelled block in the folder and no manifest can recover what it is.

---

# WHAT I COULD NOT DETERMINE

1. **Whether my four clusters are "the four already identified."** I was not given the prior identification, by design. I derived four master-involving clusters (Round Logo · HOW I SAVED THE WORLD · PULL ME IN CLOSER · mgk-niac-cover→NEW Robots) from evidence alone, and I flagged that cluster 2 is a byte-duplicate rather than a derivative and cluster 4 is only MEDIUM confidence. **If the prior four are a different four, my derivation is the thing to interrogate, not the tie-break.**
2. **PSD contents.** I read all four PSD headers from raw bytes (canvas, channels, bit depth, colour mode) but **did not decode any composite image**, because extracting one means writing a file. So `mgk-niac-cover.psd → NEW Robots.png` rests on dimension identity plus naming, not on pixels. The same limit means I cannot say whether `MGK-TWIN MONITOR SCREENS_2.psd` (3000×2400) or `WeirdBaby_ALBUM COVER (MASTER).psd` (4506×4506) relates to anything else in the tree.
3. **Whether any suffixed photo is visually a crop of its base.** I tested the *claim* against dimensions, aspect ratios, colour spaces and byte sizes — which is enough to falsify it in four cases — but I did not look at a single image. So for the pairs I called "consistent with a crop" (002/002a, 004/004a, 012/012a) I can say the geometry permits it, not that it is one.
4. **What `Michael baby 003` – `010` are.** 18 photos, no expression, and nothing in the tree hints which of the seven any of them would take.
5. **What `IMG_8609`–`IMG_8613` contain.** 2.33 GB, 81 minutes total, zero labelling.
6. **The relation between `MGKVIIIp.MP4` and `MGKVIIIp_B.mp4`.** Shared basename and capture date, but a 99.5-second duration gap rules out a transcode. I do not know what `_B` means.
7. **Why `008a (2)` and `008a (3)` are byte-different at identical size and dimensions.** Almost certainly a metadata-level difference, but I did not diff the JPEG segments to confirm.
8. **Whether `NEW Robots.png` is current.** The PSD beside it is a day newer. Resolving this means opening both.
9. **Whether the `RAW`/`EDITED`/`CUT` vocabulary is meant to include `ORIGINAL PHOTOS`.** I recorded it as a separate fourth term rather than guessing.
10. **The brief's "18 files" for the fenced folders.** There are 22. I cannot tell whether the brief meant a subset (15 videos? some other cut?) or was simply miscounted, so I inventoried all 22 and proposed a destination for none.
11. **EXIF capture dates on the photographs.** Not extracted — they live in the bytes, so they are not at risk from the folder disappearing, which is what this job was scoped to protect. Available on request.

**Tools:** nothing was unavailable. `ffprobe` 8.0.1 was present and did the work for 73 of 84 files; the remaining 11 were 4 PSDs (header bytes read directly) and 7 text/JSON files. No tool gap cost this report anything.

---

# WHAT NEEDS MIKE

1. **The `a`/`b`/`c` suffix rule is wrong as stated, and it needs one ruling covering two different meanings.** `003`/`003a` are the *same dimensions*; `005a` is *wider* than `005`; `001a` is *bigger in both axes* than `001`; `011` is *greyscale* and `011a` is *colour*. None of those can be a crop. Meanwhile **`1892×2042` is clearly an output spec** — five files from four different expression folders land on it exactly. And **`002b`/`002c` share that rectangle and differ only in content, which makes them versions of each other.** Ruling needed: does the suffix mean "delivered derivative" in the expression folders and "downscaled preview" in `NOT YET USED`, or something else?

2. **`mgk-niac-cover.psd` was modified today (2026-08-10 13:50) and is newer than `NEW Robots.png` (2026-08-09 11:28).** Same folder, same 1200×1200 canvas. If they are a pair, the PNG is a stale export and the live art is inside the PSD. Which one is current?

3. **`WeirdBaby_ALBUM COVER (MASTER).psd` (4506×4506, 18.9 MB) has no derivative anywhere in the tree.** Every other `(MASTER)` has at least one export. Does this need one, or is it retired?

4. **`HOW I SAVED THE WORLD.MOV` and `HOW_I SAVED_THE_WORLD_BLUES _ MASTER 001.MOV` are byte-identical (246 MB each, same sha256, same minute).** Which filename is the real one? The long one asserts *BLUES* and *MASTER 001*; the short one asserts nothing. Whichever goes, the judgement in its name goes with it unless it is written down first.

5. **The nude-illustration brand call is still open in the tree.** `CUT VIDEO - NIAC\README_v3.txt` reads: *"FLAGGED FOR MIKE, LEGAL BUT A BRAND CALL: the red pin-up figure is a NUDE ILLUSTRATION and it is visible at the left edge of the wides in BOTH cuts… Whether it belongs in a public-facing Weird.Baby short is yours. Removing it costs a crop of roughly x >= 150 on W_PAIR."* Nothing in this folder answers it.

6. **2.33 GB — 41% of everything here — is five unlabelled camera originals** (`IMG_8609`–`IMG_8613`, 81 minutes, one of them 44½ minutes long). They carry no expression, no purpose, no stage, no song, no take number. **A manifest cannot recover what a file is; only you can say.** If they matter, they need names before the tree goes. If they do not, they are the single biggest thing here.

7. **18 of 31 photos have no expression** (`Michael baby 003`–`010`). They sit under `PHOTOS NOT YET USED`, which promises a future assignment that has not happened.

8. **`Weird.Baby Bar Logo (FULL RESOLUTION).png` has no master PSD in this tree** — and it is a live asset, named by both fenced READMEs as the logo burned into the signature short. Where is its master?

9. **`MGK-TWIN MONITOR SCREENS_2.psd` is 360 MB and its `_1` is missing.** Largest PSD here. Intentional?

10. **`MGKVIIIp.MP4` vs `MGKVIIIp_B.mp4` — what is `_B`?** Not a transcode: the durations differ by 99.5 seconds.

11. **The fence, restated so there is no ambiguity about what JOB 1 did.** All **22** files under `CUT VIDEO - NIAC` and `RAW VIDEO - NIAC` (the brief said 18) are inventoried above with hashes and technical data. **No destination is proposed for any of them, in `public/` or in either repo.** Their own READMEs declare them unpublishable — failing on the room, the posters and the robot's silhouette — and `README.txt` adds the rule that a review cut *"is never promoted to a published asset by being copied."* I read them; I proposed nothing; and where the master/derivative analysis would naturally have suggested promoting the reel or the roughs, that branch stopped.

12. **The deletion question is yours alone.** The manifest now holds every judgement the tree carried: seven expressions, the not-yet-used status, three purposes, four pipeline stages plus a fifth term, suffixes, collections, subject codes, song metadata, dates, and the double ordering in the NIAC filenames. **On that basis the folder structure is redundant — and NOTHING has been deleted, moved or renamed on the strength of it.** JOB 1 was read-only from the first command to the last.
