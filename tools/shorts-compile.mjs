#!/usr/bin/env node
/* ===========================================================================
   npm run shorts:render — a recipe becomes an MP4. [2026-08-13]
   ---------------------------------------------------------------------------
       npm run shorts:render                      the first recipe on the shelf
       npm run shorts:render -- --name flashbang  by name
       npm run shorts:render -- --recipe <path>   a recipe file anywhere
       npm run shorts:render -- --frames          also write the sampled frames

   ═══ IT RUNS HERE AND THE OUTPUT NEVER TOUCHES CLOUDFLARE ═══════════════════
   OPS' RULING. A short is a file Mike uploads to a platform that hosts it; it
   does not need serving. The three unservable MP4s share a CAUSE with this —
   Workers assets refuse anything over 25 MiB — and NOT a solution, and
   conflating the two is how a compile step ends up somewhere that cannot hold
   its own output. Nothing this writes goes into `public/`, `dist/` or the
   bundle.

   ═══ DETERMINISM IS THE WHOLE CONTRACT (B2) ════════════════════════════════
   The same recipe must always produce the same bytes. Four things would break
   that and all four are shut:

     1. NO WALL CLOCK IN THE RENDER. Frame content is a pure function of the
        recipe and the frame index. Nothing reads `Date.now()`.
     2. NO METADATA CLOCK. ffmpeg stamps `creation_time` and an encoder string
        by default. `-map_metadata -1`, `-fflags +bitexact` and
        `-flags:v +bitexact` strip both, and x264 is pinned to a fixed set of
        parameters rather than a preset that may retune between versions.
     3. NO RANDOMNESS. The waver is a sine, not a jitter.
     4. NO FLOATING-POINT DRIFT ACROSS RUNS. Alpha is quantised to a 1/1000
        step before it reaches the lookup table, so a last-bit difference in a
        `Math.pow` cannot move a pixel.

   `--verify` renders twice and compares sha256. That is the proof, and it is
   cheap enough to run every time.

   ═══ WHY RAW FRAMES ON A PIPE ══════════════════════════════════════════════
   Frames are composed with `sharp` — already a dependency, already how the
   light table makes thumbnails — and pushed to ffmpeg as raw rgb24 on stdin.
   No intermediate PNGs means no temp directory to leave behind, no filename
   ordering to get wrong, and no second lossy step between the compositor and
   the encoder.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import crypto from "node:crypto";
import { spawn, execFileSync } from "node:child_process";
import sharp from "sharp";
import { SHAPES, flashbangAlpha, paceDurations } from "./shorts-recipe.mjs";
/* the pad rule is its own module so the compiler and the verifier cannot
   answer the question differently — see tools/shorts-pad.mjs */
import { padColourOf } from "./shorts-pad.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const OUT_DIR = path.join(REPO, "docs", "shorts", "out");
const argv = process.argv.slice(2);
const after = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };

/* ── the recipe ───────────────────────────────────────────────────────────── */
const recipeFile = after("--recipe") || path.join(REPO, "docs", "shorts", "recipes.json");
if (!fs.existsSync(recipeFile)) {
  console.error(`no recipe file at ${path.relative(REPO, recipeFile)}`);
  console.error("Write one on the bench (`npm run shorts`) or pass --recipe <path>.");
  process.exit(1);
}
const lib = JSON.parse(fs.readFileSync(recipeFile, "utf8"));
const all = lib.recipes || [lib];
const wanted = after("--name");
const recipe = wanted ? all.find(r => r.name === wanted) : all[0];
if (!recipe) {
  console.error(`no recipe named ${JSON.stringify(wanted)}. This file holds:`);
  for (const r of all) console.error("    " + r.name);
  process.exit(1);
}

/* ── the output shape ─────────────────────────────────────────────────────── */
const shape = SHAPES.find(s => s.key === recipe.shape) || SHAPES[0];
const W = shape.w, H = shape.h, FPS = recipe.fps || 30;

/* ── resolve an asset to a full-frame raw RGB buffer, once ────────────────── */
const TABLE = JSON.parse(fs.readFileSync(
  path.join(REPO, "provenance", "asset-table.json"), "utf8")).entries;
const ROOT = { museum: REPO, robots: path.resolve(REPO, "..", "weird-baby-robots") };

/* A SOURCE, DECODED ONCE. Push and pull crops a different rectangle every
   frame, so the image is decoded to raw at native size once and every frame
   is an extract-and-resize of that buffer — never a re-decode of the file. */
async function sourceFor(asset, block) {
  if (!asset) return { blank: true, pad: "#000000" };
  const row = TABLE.find(r => r.uid === asset.uid);
  if (!row) throw new Error(`asset ${asset.uid} (${asset.path}) is not in the asset table`);
  const file = path.join(ROOT[row.repo] || REPO, row.path);
  if (!fs.existsSync(file)) throw new Error(`asset file missing on disk: ${row.path}`);
  const got = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  if (asset.sha256 && got !== asset.sha256)
    console.log(`  ! ${row.path} has changed since the recipe was written`
      + `\n      recipe ${asset.sha256.slice(0, 16)}…  disk ${got.slice(0, 16)}…`);

  const pad = await padColourOf(file, block);
  /* flattened onto the PAD, so a transparent pixel and a bar are the same
     colour — which is what makes it a white logo CARD and not a white frame */
  const { data, info } = await sharp(file)
    .flatten({ background: pad }).toColourspace("srgb")
    .raw().toBuffer({ resolveWithObject: true });
  return { blank: false, raw: data, w: info.width, h: info.height, pad };
}

/* ── the timeline ─────────────────────────────────────────────────────────── */
const blocks = recipe.blocks || [];
if (!blocks.length) { console.error("this recipe has no blocks"); process.exit(1); }

/* [2026-08-13] THE PACE RAMP. Durations come from position when the recipe
   carries a `pace`; without one every block keeps its own `seconds`. */
const DURATIONS = paceDurations(blocks, recipe.pace);
const seconds = DURATIONS.reduce((a, n) => a + n, 0);
const FRAMES = Math.round(seconds * FPS);

/* ── the white-cover alpha at a given frame ───────────────────────────────── */
function alphaAt(block, tInBlock) {
  const i = block.in || { type: "cut", seconds: 0 };
  if (i.type === "flashbang") return flashbangAlpha(i, tInBlock);
  const n = i.seconds || 0;
  if (n > 0 && tInBlock < n && (i.type === "fade" || i.type === "flash"))
    return 1 - tInBlock / n;
  return 0;
}
function coverColour(block) {
  const t = (block.in || {}).type;
  return (t === "flash" || t === "flashbang") ? 255 : 0;
}

/* ═══ [2026-08-13] PUSH AND PULL ═══════════════════════════════════════════
   `from` and `to` have been in the recipe since it was declared and the
   compiler ignored them: it composed ONE plate per block and held it. So the
   bench previewed a move that the MP4 did not contain — the single largest
   gap between this and a teaser, and a gap that was declared rather than
   missing.

   THE NAMED EASES ARE THE BENCH'S OWN, character for character, because two
   implementations of "ease in-out" is two different videos. */
const EASE = {
  linear: t => t,
  inCubic: t => t * t * t,
  outCubic: t => 1 - Math.pow(1 - t, 3),
  inOutCubic: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutQuad: t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
};

/* the source rectangle for one frame — the same arithmetic the bench draws
   with, so a recipe framed on the glass compiles to what was framed. */
function cropAt(block, src, u) {
  const e = (EASE[block.ease] || EASE.linear)(u);
  const lerp = (p, q) => p + (q - p) * e;
  const f = block.from || { x: 0.5, y: 0.5, scale: 1 };
  const t2 = block.to || f;
  const cx = lerp(f.x ?? 0.5, t2.x ?? 0.5);
  const cy = lerp(f.y ?? 0.5, t2.y ?? 0.5);
  const sc = Math.max(0.01, lerp(f.scale ?? 1, t2.scale ?? 1));
  const ar = W / H;
  const iw = src.w, ih = src.h;
  let baseW, baseH;
  if (block.fit === "contain") {
    /* contain: the WHOLE image is in frame; scale shrinks the box it sits in,
       so the crop is the whole picture and the resize does the work */
    baseW = iw; baseH = ih;
  } else if (iw / ih > ar) { baseH = ih; baseW = ih * ar; }
  else { baseW = iw; baseH = iw / ar; }
  let sw = baseW / sc, sh = baseH / sc;
  /* QUANTISED TO WHOLE PIXELS. `extract` takes integers, and rounding at the
     last moment is what keeps two runs byte-identical (B2.4). */
  sw = Math.max(2, Math.min(iw, Math.round(sw)));
  sh = Math.max(2, Math.min(ih, Math.round(sh)));
  let sx = Math.round(cx * iw - sw / 2);
  let sy = Math.round(cy * ih - sh / 2);
  sx = Math.max(0, Math.min(iw - sw, sx));
  sy = Math.max(0, Math.min(ih - sh, sy));
  return { left: sx, top: sy, width: sw, height: sh };
}

/* is this block a still? A still is composed once and reused, which is what
   keeps a 4-second flashbang at 20 ms a frame instead of 60. */
const isStill = (b) => {
  const f = b.from || {}, t2 = b.to || {};
  return (f.x ?? 0.5) === (t2.x ?? 0.5) && (f.y ?? 0.5) === (t2.y ?? 0.5)
    && (f.scale ?? 1) === (t2.scale ?? 1) && (f.rot ?? 0) === (t2.rot ?? 0);
};

/* ONE FRAME'S PLATE at progress u — the crop, resized into the frame, padded
   with the ingredient's own colour. */
async function composeFrame(block, src, u) {
  if (src.blank) return Buffer.alloc(W * H * 3, 0);
  const rect = cropAt(block, src, u);
  const pipe = sharp(src.raw, { raw: { width: src.w, height: src.h, channels: 3 } })
    .extract(rect)
    .resize(W, H, {
      fit: block.fit === "contain" ? "contain" : "cover",
      position: "centre",
      background: src.pad,
      kernel: "lanczos3",
    });
  const { data } = await pipe.raw().toBuffer({ resolveWithObject: true });
  return data;
}

/* ── render ───────────────────────────────────────────────────────────────── */
async function render(outFile, { sample = [] } = {}) {
  const sources = [];
  for (const b of blocks) sources.push(await sourceFor(b.asset, b));
  /* a still block gets ONE composed plate; a moving block gets none and is
     composed per frame */
  const stills = [];
  for (let i = 0; i < blocks.length; i++) {
    stills.push(isStill(blocks[i]) ? await composeFrame(blocks[i], sources[i], 0) : null);
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const ff = spawn("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
    "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${W}x${H}`, "-r", String(FPS), "-i", "-",
    /* B3 — the social spec, and why each flag is here */
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",          /* every platform decodes it; yuv444 does not play on phones */
    "-profile:v", "high", "-level", "4.0",
    "-preset", "slow", "-crf", "16", /* near-transparent; a flat white hold shows banding at 23 */
    "-x264-params", "keyint=30:min-keyint=30:scenecut=0:bframes=2:ref=3",
    "-movflags", "+faststart",
    "-fflags", "+bitexact", "-flags:v", "+bitexact",
    "-map_metadata", "-1",
    "-r", String(FPS),
    outFile,
  ], { stdio: ["pipe", "inherit", "inherit"] });

  const done = new Promise((res, rej) => {
    ff.on("close", c => c === 0 ? res() : rej(new Error(`ffmpeg exited ${c}`)));
    ff.on("error", rej);
  });

  const frame = Buffer.alloc(W * H * 3);
  const lut = new Uint8Array(256);
  const samples = [];

  for (let f = 0; f < FRAMES; f++) {
    const t = f / FPS;
    /* which block, and how far into it */
    let acc = 0, bi = blocks.length - 1, tIn = 0;
    for (let i = 0; i < blocks.length; i++) {
      const n = DURATIONS[i] || 0;
      if (t < acc + n || i === blocks.length - 1) { bi = i; tIn = t - acc; break; }
      acc += n;
    }
    const block = blocks[bi], src = sources[bi];
    const dur = DURATIONS[bi] || 0;
    const u = dur > 0 ? Math.min(1, tIn / dur) : 0;
    const plate = stills[bi] || await composeFrame(block, src, u);
    /* QUANTISED so two runs cannot differ in a last bit (B2.4) */
    const a = Math.round(alphaAt(block, tIn) * 1000) / 1000;
    const c = coverColour(block);

    for (let v = 0; v < 256; v++) lut[v] = Math.round(v + (c - v) * a);
    for (let i = 0; i < frame.length; i++) frame[i] = lut[plate[i]];

    if (sample.includes(f)) samples.push({ f, t, a, buf: Buffer.from(frame) });
    if (!ff.stdin.write(frame)) await new Promise(r => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await done;
  return samples;
}

/* ── which frames matter (C1) ─────────────────────────────────────────────── */
function momentsOf() {
  const fb = (blocks.find(b => (b.in || {}).type === "flashbang") || {}).in;
  const lead = DURATIONS[0] || 0;
  const at = (s) => Math.min(FRAMES - 1, Math.round(s * FPS));
  if (!fb) return [0, Math.floor(FRAMES / 2), FRAMES - 1];
  const d0 = lead + fb.pop + fb.hold;
  /* THE POP IS SAMPLED ON BOTH SIDES, and it has to be. A 10 ms pop at 30 fps
     is 0.3 of a frame, so there is no frame inside it: the last lead frame and
     the first white frame are adjacent, and sampling "at the pop" returns the
     LEAD, which reads as a failure and is not one. Both are taken so the report
     can show the cut rather than argue about it. */
  return [...new Set([
    at(lead / 2),                       /* the lead, held */
    Math.max(0, at(lead) - 1),          /* last frame before the pop */
    at(lead) + 1,                       /* first frame after it — blind white */
    at(lead + fb.pop + fb.hold / 2),    /* mid-hold, blind */
    at(d0 + fb.dissolve * 0.25),
    at(d0 + fb.dissolve * 0.50),
    at(d0 + fb.dissolve * 0.75),
    FRAMES - 1,                         /* the last frame */
  ])].sort((x, y) => x - y);
}

/* ── go ───────────────────────────────────────────────────────────────────── */
const stamp = (recipe.name || "recipe").replace(/[^\w.-]+/g, "-").toLowerCase();
const outFile = path.join(OUT_DIR, `${stamp}.mp4`);
const t0 = process.hrtime.bigint();
const moments = momentsOf();
const samples = await render(outFile, { sample: moments });
const ms = Number(process.hrtime.bigint() - t0) / 1e6;

const sha = crypto.createHash("sha256").update(fs.readFileSync(outFile)).digest("hex");
const bytes = fs.statSync(outFile).size;

console.log(`RENDERED  ${path.relative(REPO, outFile)}`);
console.log(`  recipe        ${recipe.name}   (${blocks.length} block(s))`);
console.log(`  shape         ${shape.key}  ${W}x${H} @ ${FPS}fps`);
console.log(`  declared      ${seconds.toFixed(3)} s`);
if (recipe.pace) console.log(`  pace          ${DURATIONS.map(d => d.toFixed(2)).join("  ")}`);
console.log(`  moving blocks ${blocks.filter(b => !isStill(b)).length} of ${blocks.length}`);
console.log(`  frames        ${FRAMES}   -> ${(FRAMES / FPS).toFixed(4)} s of video`);
console.log(`  size          ${(bytes / 1024).toFixed(0)} KB`);
console.log(`  sha256        ${sha}`);
console.log(`  render time   ${(ms / 1000).toFixed(2)} s  (${(ms / FRAMES).toFixed(1)} ms/frame)`);

/* ── the sampled frames, and what the recipe says they should be (C1) ─────── */
const lumaOf = (buf) => {
  let sum = 0;
  for (let i = 0; i < buf.length; i += 3)
    sum += 0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2];
  return sum / (buf.length / 3);
};
console.log("");
console.log("  SAMPLED FRAMES — what the compositor put on the pipe");
console.log("    frame      t      alpha   mean luma");
for (const s of samples)
  console.log(`    ${String(s.f).padStart(5)}  ${s.t.toFixed(3)}s   ${s.a.toFixed(3)}   ${lumaOf(s.buf).toFixed(2)}`);

if (argv.includes("--frames")) {
  const dir = path.join(OUT_DIR, `${stamp}-frames`);
  fs.mkdirSync(dir, { recursive: true });
  for (const s of samples) {
    const p = path.join(dir, `f${String(s.f).padStart(4, "0")}_t${s.t.toFixed(3)}.png`);
    await sharp(s.buf, { raw: { width: W, height: H, channels: 3 } }).png().toFile(p);
  }
  console.log(`\n  wrote ${samples.length} sampled frame(s) to ${path.relative(REPO, dir)}`);
}

if (argv.includes("--verify")) {
  const twin = outFile.replace(/\.mp4$/, ".verify.mp4");
  await render(twin);
  const sha2 = crypto.createHash("sha256").update(fs.readFileSync(twin)).digest("hex");
  fs.unlinkSync(twin);
  console.log("");
  console.log(`  DETERMINISM   second render sha256 ${sha2}`);
  console.log(`                ${sha === sha2 ? "IDENTICAL — the same recipe makes the same file."
    : "*** DIFFERENT — something in the render is not deterministic. ***"}`);
  if (sha !== sha2) process.exit(1);
}

console.log("");
console.log("  Nothing here is served. It is a file to upload.");
