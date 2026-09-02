# CLOSE THE LOOP — RECIPE TO MP4
2026-08-13 · WRITE · gates green.

**The file to watch: `C:\AI\_manual-samples-20260811\_FOR_CLAUDE\flashbang.mp4`**

---

## WHAT YOU NEED FROM ME

**Watch the file. The chain works.** Your numbers went in and 3.97 seconds of
1080×1920 came out, and the curve you approved by eye is in the encoded video to
within **0.56 luma out of 255**.

**Two things I changed and you should know about, because both were wrong and
neither was visible in the numbers:**

1. **The reveal was cropped.** A square logo in a 9:16 frame on `cover` loses a
   third off each side — the last frame read **"eird.Bab"**. It is `contain`
   now and the whole mark reads. **Every luma number was correct while the
   picture was wrong.**
2. **Your 10 ms pop cannot exist at 30 fps.** One frame is 33.3 ms, so the pop
   is 0.3 of a frame. It renders as a hard cut to white between frame 17 and
   frame 19. That is almost certainly what you wanted a "pop" to feel like, but
   the number in the recipe is not the number on the screen and you should hear
   it from me rather than notice it later.

**One thing I did NOT change and you may want to:** the video ends with the
reveal at **95%**, not 100% — the last frame sits one frame short of the
dissolve completing, so the logo never lands clean. Your numbers total 3.96 s
and I rendered your numbers. **One extra frame fixes it.** §C2.

---

# A — WHAT IS ON THE MACHINE

## A1. ffmpeg is installed

```
ffmpeg 8.0.1-full_build  (Gyan.dev, gcc 15.2.0, MSYS2)
C:\Users\macun\AppData\Local\Microsoft\WinGet\Packages\
  Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe
```

`ffprobe` is beside it. The build carries **libx264**, libx265, libvpx, SVT-AV1,
NVENC and AMF — everything this needs and a great deal more.

## A2. Nothing to install

Not applicable. **I installed nothing.** Had it been absent the answer would
have been `winget install Gyan.FFmpeg`, which is how this one arrived.

## A3. What else could encode video — checked, not assumed

| | |
|---|---|
| **python 3.13** | present — `C:\Users\macun\AppData\Local\Programs\Python\Python313` |
| **node** | present, and it is what the compiler is written in |
| **sharp 0.34.5 / libvips 8.17.3** | present in the repo's own dependencies — the light table's thumbnailer. **This is what composes the frames.** |
| magick · gs · vlc · HandBrakeCLI · sox | **absent** |

**One trap worth naming:** `convert` resolves to `C:\Windows\system32\convert.exe`,
which is the NTFS filesystem conversion utility, **not ImageMagick**. A script
that shells out to `convert` on this machine would do something entirely
unrelated to pictures.

---

# B — THE COMPILE

## B5. One command

```
npm run shorts:flashbang
```

That is render + sampled frames + the determinism check. The general forms:

```
npm run shorts:render                              the first recipe on the shelf
npm run shorts:render -- --recipe <path> --frames  any recipe, writing frames
npm run shorts:verify -- --out <dir>               read it back out of the MP4
```

## B1. Recipe in, MP4 out

`tools/shorts-compile.mjs` reads the format declared in `tools/shorts-recipe.mjs`,
resolves each block's asset through `provenance/asset-table.json` by `uid`,
**checks the recorded `sha256` against the bytes on disk** and says so if they
differ, composes frames with `sharp`, and pipes raw rgb24 straight into ffmpeg's
stdin. No intermediate PNGs — no temp directory to leave behind, no filename
ordering to get wrong, no second lossy step between compositor and encoder.

### The format had to grow, and it grew in the declaration

**The flashbang could not be expressed in the format as it stood.** `flash`
ramps a white cover linearly across `seconds` and has no pop, no hold, no curve
and no waver. So `shorts-recipe.mjs` now declares a `flashbang` transition —
**in the one declaration both the bench and the compiler read**, not inside the
compiler where they could disagree.

```js
in: { type: "flashbang", pop: 0.010, hold: 0.350, dissolve: 3.000,
      curve: 6.0, waver: 0.5 }
```

The phases are **sequential and additive**, which is what makes the total come
out at your own figure: `0.600 + 0.010 + 0.350 + 3.000 = 3.960 s`. That the
arithmetic lands exactly on your number is the first evidence the model is the
one you had in mind.

`curve` is the exponent on the reveal: alpha `= 1 − u^curve`. At curve 6 the
frame is still **98% white at the halfway point** and almost all of the reveal
happens in the last third — slow, then fast.

**`waver` is an amplitude and only an amplitude.** Your `0.5` says "gentle"; a
frequency and a decay law are not in your numbers, so they are Ops' and they are
**declared as named constants** rather than buried: three cycles across the
dissolve, peak swing 6% of alpha at waver 1.0, decaying as `(1−u)²`. If it wants
to be faster or slower, those two constants are the dial.

## B2. Deterministic — proved, not asserted

**Two renders, byte-identical:**
```
sha256  7031c2fd3fa77df0bf5b61c3834d0981c6c5d4f84e3681d5cd4aa7be6e797957
sha256  7031c2fd3fa77df0bf5b61c3834d0981c6c5d4f84e3681d5cd4aa7be6e797957
IDENTICAL — the same recipe makes the same file.
```

Four things would have broken it and all four are shut:

1. **No wall clock in the render.** Frame content is a pure function of the
   recipe and the frame index. Nothing reads `Date.now()`.
2. **No metadata clock.** ffmpeg stamps `creation_time` and an encoder string by
   default — `-map_metadata -1`, `-fflags +bitexact`, `-flags:v +bitexact` strip
   both, and x264 is pinned with explicit `-x264-params` rather than left to a
   preset that may retune between versions.
3. **No randomness.** The waver is a sine, not a jitter.
4. **No float drift.** Alpha is quantised to 1/1000 before it reaches the lookup
   table, so a last-bit difference in `Math.pow` between runs cannot move a pixel.

`--verify` renders twice and compares. It costs 2.3 seconds; it runs every time.

## B3. The output spec

| | chosen | why |
|---|---|---|
| size | **1080×1920** | as specified |
| fps | **30** | as specified |
| codec | **H.264 (libx264), High profile, level 4.0** | as specified |
| pixel format | **yuv420p** | as specified — yuv444 will not decode on phones |
| **CRF** | **16** | *not specified; my call.* The default 23 puts visible banding across a flat white hold. 16 is near-transparent and the file is still 539 KB. |
| **preset** | **slow** | four seconds of video; the encode is not the bottleneck |
| GOP | **keyint=30, scenecut=0** | a fixed GOP is part of determinism; scene detection would make cut placement depend on content |
| | **+faststart** | the moov atom leads, so a platform can begin playing during upload |

**No differences from the spec except CRF and preset, which it did not name.**

## B4. The rendered file

```
docs/shorts/out/flashbang.mp4
  h264 High level 40 · yuv420p · 1080x1920 · 30/1 fps
  frames      119
  duration    3.9660 s   (declared 3.960)
  size        551,451 bytes  (539 KB)
  sha256      7031c2fd3fa77df0bf5b61c3834d0981c6c5d4f84e3681d5cd4aa7be6e797957
```

**119 frames, not 118.8.** `3.96 × 30 = 118.8`, which rounds to 119, so the file
runs 3.9667 s — 6.7 ms longer than the recipe. That is the smallest
representable error at 30 fps and it is in the direction that keeps the whole
dissolve.

---

# C — DOES IT MATCH?

## C1. Measured out of the MP4, not off the pipe

The compositor's own numbers prove nothing about the file. These are decoded
**from the encoded MP4** and compared with what the recipe says.

```
  moment                       frame     t      alpha   expected   measured    delta
  the lead, held                   9  0.300  0.000     78.09      77.54   -0.55
  last frame before the pop       17  0.567  0.000     78.09      77.54   -0.55
  first frame after the pop       19  0.633  1.000    255.00     255.00   -0.00
  mid-hold, blind                 24  0.800  1.000    255.00     255.00   -0.00
  dissolve 25%                    51  1.700  0.983    251.76     251.89   +0.13
  dissolve 50%                    74  2.467  0.984    251.95     251.90   -0.05
  dissolve 75%                    96  3.200  0.829    222.38     221.31   -1.08
  the last frame                 118  3.933  0.052     74.18      73.32   -0.85

  largest deviation   -1.08 luma at "dissolve 75%"
  RMS deviation       0.561 luma  (out of 255)
```

## C2. The curve against curve 6.0 — **the encode did not flatten it**

```
   u      alpha    expected   measured   |  the reveal
  0.0   1.000    255.00     255.00   |  ........................................
  0.1   1.000    255.00     255.00   |  ........................................
  0.2   0.988    252.71     251.95   |  ........................................
  0.3   0.991    253.28     252.72   |  ........................................
  0.4   1.000    255.00     255.00   |  ........................................
  0.5   0.984    251.95     251.90   |  #.......................................
  0.6   0.948    245.08     245.14   |  ##......................................
  0.7   0.882    232.49     231.71   |  #####...................................
  0.8   0.734    204.26     204.02   |  ###########.............................
  0.9   0.460    152.00     150.99   |  ######################..................
  1.0   0.052     74.18      73.32   |  ######################################..
```

**The shape is right.** Nothing at all for the first 40% of the dissolve, the
first hint at halfway, then it falls off a cliff: 0.734 → 0.460 → 0.052 in the
last fifth. That is what curve 6 means and it is what your "slow-then-fast" asks
for.

**The waver is visible and doing its job.** Alpha goes 0.988 at u=0.2, *up* to
0.991 at 0.3, back to **1.000 at 0.4** — the reveal starts, then the white
closes over it again. That is your "ah, shit — oh, here it comes" written as a
number, and it decays out by u=0.6 as specified.

### The thing that nearly got reported as an encoder failure, and was mine

**The first verification run said `*** THE ENCODE MOVED THE CURVE ***`, −54.69
luma on the last frame, RMS 19.7.** It was wrong, and the cause is worth the
paragraph.

The *expected* column used `sharp(...).removeAlpha().greyscale().stats()` and the
compositor uses `.removeAlpha().raw()` with Rec.709 computed by hand. On
`WeirdBaby_PhotoID.png` — 2048×2048 with a real alpha channel — **those disagree
by 57 luma**: 215.53 against 158.36. Measured a third way, flattening onto black
explicitly, gives 158.11 — so the raw path is right and `stats()` after
`greyscale()` is the odd one out on an image with alpha.

**A verifier whose two columns are computed differently is not verifying
anything.** It compares two pipelines and blames whichever it trusts less, and it
came within one report of publishing "the encoder flattened Mike's curve" about
an encoder that had reproduced it to within a third of a luma level. There is one
luma function now and both sides call it.

## The other thing only looking found

**The luma was perfect and the picture was wrong.** `fit: "cover"` on a
2048×2048 logo in a 1080×1920 frame crops a third off each side; the final frame
read **"eird.Bab"**. Not a single number in the table moved when I fixed it —
mean luma is blind to which third of an image you kept.

It is `fit: "contain"` in the recipe now, letterboxed on black, and the whole
mark reads. **A square logo in a 9:16 frame is letterboxed, always.**

## The reveal never completes — reported, not fixed

The last frame is **frame 118 at t=3.933**, which is u=0.991 of the dissolve, so
alpha is **0.052 — a 5% white veil still over the logo.** The dissolve completes
at exactly 3.960 and no frame lands there.

**I rendered your numbers rather than improving them.** If the logo should land
clean, the fix is one frame — `dissolve: 3.033` or a `hold` on the end — and the
format has no concept of "hold the last state", which is a §D1 gap.

## C3. Delivered

`C:\AI\_manual-samples-20260811\_FOR_CLAUDE\` — **cleared first**, then:

```
flashbang.mp4                                539 KB   <- watch this
f0009_t0.300_the-lead-held.png
f0017_t0.567_last-frame-before-the-pop.png
f0019_t0.633_first-frame-after-the-pop.png
f0024_t0.800_mid-hold-blind.png
f0051_t1.700_dissolve-25-.png
f0074_t2.467_dissolve-50-.png
f0096_t3.200_dissolve-75-.png                <- the tease frame
f0118_t3.933_the-last-frame.png
```

## C4. Render time — **2.28 seconds**

**19.1 ms per frame** for 119 frames at 1080×1920, including the ffmpeg encode.
The determinism check doubles it to ~4.6 s.

**Four seconds of video takes two seconds to make**, so this is an interactive
tool, not a batch job: change a number, re-render, watch. A 30-second teaser at
the same rate is about **17 seconds**. Nothing about the cost shapes how it gets
used.

---

# D — WHAT THIS MEANS FOR THE PIPELINE · REPORTED, NOT BUILT

## D1. What a recipe cannot carry today

**Per-shot motion — the big one.** Blocks already have `from`/`to` with `x`, `y`,
`scale`, `rot`, and **the compiler ignores all of it.** It composes one static
plate per block. Push and pull is the single largest gap between this and a
teaser, and it is *declared but not implemented* rather than missing from the
format.

| gap | what is missing |
|---|---|
| **motion is not rendered** | `from`/`to` are in the recipe and the compiler does not read them. Everything else below is smaller than this. |
| **motion blur / shutter** | a 1.45× push over 3 s at 30 fps steps visibly without it |
| **hold the last state** | no way to say "end on this frame for 500 ms"; why the reveal ends at 95% |
| **a cut is not a thing** | `out` transitions are declared and the compiler only reads `in` |
| **cross-dissolve between two shots** | `fade`/`flash` go to a colour, never to the *next block's* image. A teaser's "tear cut" needs the outgoing and incoming plates in the same frame. |
| **sub-frame timing** | your 10 ms pop. A recipe can ask for durations the frame rate cannot express and nothing warns |
| **colour** | the storyboard rules *everything is B&W* and the format has no colour field at all |
| **text / titles** | nothing |
| **safe areas** | platforms overlay UI on the bottom ~20% and top ~10%; nothing in the format knows |
| **per-block source crop** | `fit` is cover-or-contain for the whole image; no "use this region of this photograph" |
| **loop point** | a Reel loops; nothing declares whether the last frame should match the first |

**Real image files are NOT a gap.** That half already works: `uid` resolves
through the asset table across both repos, `sha256` is verified, and the shelf
that feeds the bench is the same 141-row shelf the artifact tracker uses.

## D2. Does this compile handle the teaser?

**Structurally yes; visually no, and the gap is exactly one item.**

*Already there:* many stills (blocks are a list, no limit), hard cuts (a block
with `in: cut` is a hard cut and costs nothing), per-block duration, the shelf,
determinism, the output spec.

*Missing:* **push and pull.** The frame loop composites one plate per block; it
would need to composite a *crop rectangle* per frame, interpolated `from`→`to`
through the named ease — which is precisely what the bench already previews on
canvas and what `shorts-recipe.mjs` already declares.

**It is the same path, not a different one.** The compositor's inner loop grows
a per-frame `extract` + `resize` in place of one pre-computed plate. The cost is
real — a crop-and-resize per frame instead of a lookup-table blend — so expect
render time to go from 19 ms/frame to maybe 60–90, i.e. a 30-second teaser in
under a minute. **Still interactive.** No second tool.

## D3. What audio would take

**Every recipe has `audio: null` and nothing has ever been heard.**

The mechanical part is small: ffmpeg already accepts a second input and
`-c:a aac -b:a 192k -ar 48000 -shortest`. The field is reserved in v1 precisely
so a compiler written today does not need revising.

What is actually required:

1. **A decision about what audio IS in the format.** One bed for the whole
   recipe, or a clip per block with its own in/out? The second is a real
   authoring surface; the first is a file path and a gain.
2. **Sync at the cut.** A flashbang's pop wants a hit *on the frame*, which
   means audio offsets in seconds against a frame grid — the same sub-frame
   problem as the 10 ms pop, one dimension over.
3. **Loudness.** Platforms normalise to about −14 LUFS and will turn a hot mix
   down; ffmpeg's `loudnorm` does it in two passes, which breaks the one-pass
   determinism unless the measured values are cached in the recipe.
4. **The bench cannot preview it.** The automated Chrome here has no working
   media pipeline at all, so audio would be authored blind unless it plays in
   Mike's own browser. **That is the part to think about first** — a sound you
   cannot hear while you build is not a tool.
5. **Rights.** Nothing in the museum's asset table is music cleared for a social
   post, and 132 of its audio rows are build-card recordings of a machine.

**None of D is built.**

---

# E — GATES

lint **9 errors / 8 warnings = baseline** · build green · **launch build green** ·
provenance **PASS** · **docs:numbers PASS** · `reveal:check` **PASS** ·
`parity:gate` **PASS** · `instory:gate` **PASS** · `reveal:build` byte-identical ·
`reveal:day` nothing to move · `approval:proof` **PROVED** ·
`assets:orphans` 13 (pre-existing, Job 4).

**`docs/shorts/out/` is gitignored.** A recipe is the durable artifact; the MP4
is regenerable from it by one command, it is megabytes, and it is a file you
upload rather than anything the museum serves. The recipes themselves are
committed.

---

## WHAT I COULD NOT DETERMINE

- **Whether the flashbang numbers you approved were approved against this
  interpretation of them.** The phases and the curve reproduce your 3.96 s total
  exactly, which is strong evidence, but "waver 0.5, gentle, decaying" does not
  contain a frequency — three cycles is Ops' reading and you may have pictured
  something faster or slower.
- **Whether the lead-in should be a picture at all.** I used a dark machine
  photograph so the curve could be measured; in a real teaser the lead-in is
  whatever the viewer was already looking at, and a flashbang between two
  *bright* shots will read differently.
- **Whether CRF 16 is the right quality.** It is my call, chosen because a flat
  white hold bands at the default. It could be 14 or 18 and neither would be
  wrong.
- **What the platforms actually do to this file.** Instagram and TikTok
  re-encode on upload. Nothing here has been through that, and a 3.96 s clip
  with a hard white flash is exactly the content their encoders handle worst.
  **Testing that needs an account, which is Sunday.**

## WHAT NEEDS MIKE

1. **Watch `flashbang.mp4`.** That is the proof.
2. **Should the reveal land clean?** It currently ends at 95%. One frame.
3. **Is the waver's speed right?** Three cycles across the dissolve.
4. **Push and pull is the one thing standing between this and a teaser** (§D2).
   Say the word and it is a packet.

---

# THE COMMIT COMMANDS — NOT RUN

```powershell
cd C:\AI\Projects\weird-baby-museum

git add tools/shorts-compile.mjs tools/shorts-verify.mjs tools/shorts-recipe.mjs `
        docs/shorts/flashbang.json package.json .gitignore
git commit -m "A recipe becomes an MP4, and Mike's flashbang is the proof

npm run shorts:flashbang renders his approved numbers - lead-in 600ms, pop 10ms,
hold 350ms, dissolve 3000ms on curve 6.0, waver 0.5 - to 1080x1920 H.264
yuv420p, 119 frames, 3.9667s, 539KB, in 2.3 seconds. The compile runs locally
and the output is never served: a short is a file you upload, which is the same
cause as the three unservable MP4s and not the same solution.

Deterministic and proved by rendering twice to the same sha256: no wall clock in
the render, metadata and encoder strings stripped bitexact, x264 pinned rather
than presets, and alpha quantised so a last-bit float difference cannot move a
pixel.

The format had to grow a flashbang transition and it grew in shorts-recipe.mjs,
where the bench and the compiler both read it. Its phases are additive and land
on his own 3.96s total. waver carries an amplitude only; the frequency and decay
are Ops' and are named constants rather than buried.

Measured out of the encoded file against the declaration: RMS 0.561 luma out of
255, largest deviation 1.08. The encode did not flatten the curve. Two defects
found on the way, both mine: a verifier whose two columns used different luma
pipelines nearly reported the encoder had flattened it, and fit:cover cropped the
square logo to 'eird.Bab' while every number stayed correct."
```
