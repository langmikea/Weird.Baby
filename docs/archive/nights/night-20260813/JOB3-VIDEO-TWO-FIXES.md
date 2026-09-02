# JOB 3 — THE VIDEO: PAD COLOUR, PACE RAMP, PUSH AND PULL
2026-08-13 · WRITE · gates green.

**Watch: `C:\AI\_manual-samples-20260811\_FOR_CLAUDE\flashbang.mp4`**
Also rendered: `docs/shorts/out/teaser-15s.mp4` and `teaser-30s.mp4`.

---

## WHAT YOU NEED FROM ME

**Nothing. All three are in and verified.**

- **The letterbox is white now**, and so is the card behind the mark. The colour
  comes from the ingredient, not a default.
- **The pace ramps**: 1.40 · 1.39 · 1.36 · 1.30 · 1.22 · 1.12 · 1.00 · 0.85 ·
  0.68 · 0.49 · **0.28** → flashbang → 1.20. Slow, then faster and faster, then
  it releases.
- **Push and pull works.** A 30-second teaser renders in **43 seconds**.

**One number for you:** the ramp's shape is a dial (`curve`, default 2.0). At
2.0 the first third barely moves and the collapse is late. If you want the
acceleration to start earlier, that is the one figure to change.

---

# 3a — THE LETTERBOX

## What was wrong

Fixing the crop last packet introduced padding, and the padding took a
**hardcoded black** — in two places: the resize background, and the `flatten`
that decides what a transparent pixel becomes. So a flashbang that dissolves out
of full white revealed the mark on a black card between two black bars.

## What changed

**`pad` is now a property of the block**, and `"auto"` means *ask the
ingredient*:

- If the source's **outer ring is mostly opaque**, auto is that ring's own
  average colour — a photograph letterboxes into its own edge and the bars stop
  announcing themselves.
- If the ring is **mostly transparent** — which is what a logo on a clear
  background is — there is nothing to ask, so auto takes **the colour the block
  is arriving out of**: white for a `flash` or `flashbang`, black otherwise.

**It sets what a transparent pixel becomes, not only the bars.** That is the
half that makes it a white logo *card* rather than a white-framed black one.

Measured on the last frame: mean luma **73.32 → 233.94**.

## And the rule lives in one place

`tools/shorts-pad.mjs`. **It has to, and the reason is that it already went
wrong twice.** The compiler pads the frame; the verifier computes what the frame
*should* be. The moment the compiler started padding white while the verifier
still flattened black, the verifier reported **+159.76 luma, RMS 57.4, on a file
that was correct** — the same shape as the earlier two-luma-pipelines bug. One
module, both readers.

---

# 3b — THE PACE RAMP

**Mike's words:** *"the pace should start out slow and increase faster, faster,
faster, faster until the flashbang, and then it slows down because the
Weird.Baby logo comes in."*

## The curve

```
d(i) = from + (to − from) · ( i / (n−1) ) ^ curve
```

with defaults `from: 1.40`, `to: 0.28`, `curve: 2.0`, `release: 1.20`.

**Why a power ramp on position, and why 2.0.** At `curve: 1` the shortening is
linear — each cut a fixed amount quicker, which reads as *steady*, not
accelerating. At 2.0 the early cuts hold near `from` and the collapse happens
late, which is the "faster, faster, FASTER" he described. Above about 3 the
first two-thirds stop moving at all and the ramp becomes a cliff.

**It never touches the flashbang block.** That block's length is
pop + hold + dissolve and is his approved number; the ramp runs *up to* it and
`release` picks up after. **A recipe with no `pace` is unchanged** — every block
keeps the `seconds` written on it.

## What it does to a 15-second and a 30-second roll

**15 seconds — 11 shots + the flashbang, 14.448 s:**
```
1.40  1.39  1.36  1.30  1.22  1.12  1.00  0.85  0.68  0.49  0.28   3.36
```
The first four cuts are all over a second; the last three are 0.68, 0.49, 0.28.
**The final cut is five times quicker than the first.**

**30 seconds — 26 shots + the flashbang, 29.859 s:**
```
1.40 1.40 1.39 1.38 1.37 1.36 1.34 1.31 1.29 1.25 1.22 1.18 1.14 1.10 1.05
1.00 0.94 0.88 0.82 0.75 0.68 0.61 0.53 0.45 0.37 0.28   3.36
```
**The 30-second roll spends its first half almost unchanged** — fifteen cuts
between 1.40 and 1.00 — and then falls away. That is the shape working: the
longer the roll, the longer the slow part, because the ramp is a function of
position and not of time.

> **If a 30-second roll should accelerate sooner, `curve` is the dial.** At 2.0
> the halfway cut is 1.00 s; at 1.2 it would be about 0.85; at 3.0, 1.12.

---

# 3c — PUSH AND PULL

`from` and `to` have been in the recipe since it was declared and the compiler
ignored them: it composed **one plate per block** and held it. The bench
previewed a move the MP4 did not contain.

## What was built

Each frame's crop rectangle is interpolated `from`→`to` through the block's
named ease, then extracted and resized into the frame. **The eases are the
bench's own, character for character** — two implementations of "ease in-out"
is two different videos.

Three things that keep it honest:

- **The source is decoded once.** Push and pull crops a different rectangle
  every frame, so the image is decoded to raw at native size once and each frame
  is an extract-and-resize of that buffer — never a re-decode of the file.
- **A still block is still composed once.** `isStill` compares `from` and `to`;
  if nothing moves, the old fast path is taken. **That is why the flashbang did
  not get slower** — it is two still blocks and still renders at 20 ms a frame.
- **The crop is quantised to whole pixels** before `extract`, which is what
  keeps two runs byte-identical.

## The cost, measured

| | frames | moving | render | per frame |
|---|---:|---:|---:|---:|
| flashbang (2 stills) | 119 | 0 of 2 | **2.4 s** | **20.3 ms** |
| teaser 15 s | 433 | 11 of 12 | **17.4 s** | **40.1 ms** |
| teaser 30 s | 896 | 26 of 27 | **43.1 s** | **48.1 ms** |

**A moving frame costs about 2.4× a still one** — 48 ms against 20. A
30-second teaser renders in **43 seconds**; with `--verify` (two renders) it is
70 s and still under two minutes.

**This stays an interactive tool.** Change a number, re-render, watch.

**Determinism holds on moving footage** — the 30-second teaser rendered twice to
the same sha256, `65eebba15a1b9bc…`.

---

# 3d — NOTHING REGRESSED

Re-rendered the flashbang and read it back out of the MP4:

```
  moment                       frame     t      alpha   expected   measured    delta
  the lead, held                   9  0.300  0.000     78.42      77.87   -0.55
  last frame before the pop       17  0.567  0.000     78.42      77.87   -0.55
  first frame after the pop       19  0.633  1.000    255.00     255.00   -0.00
  mid-hold, blind                 24  0.800  1.000    255.00     255.00   -0.00
  dissolve 25%                    51  1.700  0.983    254.63     254.53   -0.09
  dissolve 50%                    74  2.467  0.984    254.65     254.55   -0.10
  dissolve 75%                    96  3.200  0.829    251.23     251.09   -0.14
  the last frame                 118  3.933  0.052    234.11     233.94   -0.17

  largest deviation   -0.55 luma
  RMS deviation       0.292 luma  (out of 255)
  THE ENCODE DID NOT FLATTEN THE CURVE.
```

| | before | after |
|---|---|---|
| RMS deviation | 0.561 | **0.292** — tighter |
| determinism | identical | **identical** |
| frames · duration | 119 · 3.9660 s | **unchanged** |
| the curve's shape | slow-then-fast | **unchanged** |
| the last frame | logo on **black**, luma 73 | **logo on white**, luma 234 |
| size | 539 KB | 517 KB |

**The alpha column is identical at every sampled frame** — the curve Mike
approved is untouched. Only what sits *behind* it changed.

*The luma values differ from last packet's because the card is white now: the
same alpha over a brighter plate reads brighter. The alphas are the thing to
compare, and they match exactly.*

---

## WHAT I COULD NOT DETERMINE

- **Whether `curve: 2.0` is the acceleration Mike means.** It is a defensible
  reading of "faster, faster, faster" and it is one number to change. He should
  watch the 15-second roll before it is settled.
- **Whether `release: 1.20` is right.** Nothing after the flashbang exists yet
  in any real recipe, so the release has never been seen.
- **What a moving shot looks like with motion blur** — there is none, and at a
  1.35× push over ~1 s it is not obviously missing, but it will be at higher
  speeds. Named in the last packet's D1 and still true.
- **Whether the teaser recipes are worth keeping.** `docs/shorts/teaser.json` is
  synthetic — I built it to exercise the ramp, and its shot choices are
  arbitrary. It is committed as a worked example; delete it if it reads as
  content.

## WHAT NEEDS MIKE

1. **Watch the 15-second roll** and say whether the ramp accelerates at the
   right moment. `curve` is the dial.
2. **Nothing else.** The flashbang is unchanged where it should be and fixed
   where it was wrong.
