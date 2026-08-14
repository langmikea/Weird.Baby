#!/usr/bin/env node
/* ===========================================================================
   npm run shorts:verify — read the frames back OUT OF THE MP4. [2026-08-13]
   ---------------------------------------------------------------------------
   THE COMPOSITOR'S OWN NUMBERS PROVE NOTHING ABOUT THE FILE. `shorts-compile`
   reports the luma of what it put on the pipe; this decodes the ENCODED file
   and measures what actually came out the other side, then compares both
   against what the recipe says the curve should be.

   That is the whole point of C2: H.264 at a low CRF over a near-flat white
   field is exactly where banding and DC drift show up, and a dissolve that has
   been flattened by the encoder is the thing Mike would notice and the thing
   no amount of reading the source would reveal.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { execFileSync } from "node:child_process";
import sharp from "sharp";
import { flashbangAlpha } from "./shorts-recipe.mjs";
/* THE SAME PAD RULE THE COMPILER USES. The first version of this file
   flattened onto black while the compiler had started padding white, and
   reported +159.76 luma on a file that was correct. */
import { padColourOf } from "./shorts-pad.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const argv = process.argv.slice(2);
const after = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };

const mp4 = after("--mp4") || path.join(REPO, "docs/shorts/out/flashbang.mp4");
const recipeFile = after("--recipe") || path.join(REPO, "docs/shorts/flashbang.json");
const outDir = after("--out");

const lib = JSON.parse(fs.readFileSync(recipeFile, "utf8"));
const recipe = (lib.recipes || [lib])[0];
const blocks = recipe.blocks;
const FPS = recipe.fps || 30;
const seconds = blocks.reduce((a, b) => a + (b.seconds || 0), 0);
const FRAMES = Math.round(seconds * FPS);

/* ── what ffprobe says the file is ────────────────────────────────────────── */
const probe = JSON.parse(execFileSync("ffprobe", [
  "-v", "error", "-print_format", "json",
  "-show_streams", "-show_format", "-count_frames", mp4,
], { encoding: "utf8", maxBuffer: 1e8 }));
const v = probe.streams.find(s => s.codec_type === "video");

console.log("THE FILE, AS ffprobe READS IT");
console.log(`  ${path.relative(REPO, mp4)}`);
console.log(`  codec         ${v.codec_name} ${v.profile} level ${v.level}`);
console.log(`  pixel format  ${v.pix_fmt}`);
console.log(`  size          ${v.width}x${v.height}`);
console.log(`  frame rate    ${v.r_frame_rate}   (avg ${v.avg_frame_rate})`);
console.log(`  frames        ${v.nb_read_frames}`);
console.log(`  duration      ${Number(probe.format.duration).toFixed(4)} s`);
console.log(`  bytes         ${probe.format.size}`);
console.log("");

/* ── the moments, and what the recipe says each should be ─────────────────── */
const lead = blocks[0].seconds;
const fb = blocks[1].in;
const d0 = lead + fb.pop + fb.hold;
const at = s => Math.min(FRAMES - 1, Math.round(s * FPS));
const MOMENTS = [
  ["the lead, held", at(lead / 2)],
  ["last frame before the pop", at(lead) - 1],
  ["first frame after the pop", at(lead) + 1],
  ["mid-hold, blind", at(lead + fb.pop + fb.hold / 2)],
  ["dissolve 25%", at(d0 + fb.dissolve * 0.25)],
  ["dissolve 50%", at(d0 + fb.dissolve * 0.50)],
  ["dissolve 75%", at(d0 + fb.dissolve * 0.75)],
  ["the last frame", FRAMES - 1],
];

/* ═══ ONE LUMA FUNCTION, AND THE FIRST CUT HAD TWO ═════════════════════════
   This file's first run reported "THE ENCODE MOVED THE CURVE", −54.69 luma on
   the last frame, RMS 19.7. **It was this measurement, not the encoder.**

   The expected side used `.removeAlpha().greyscale().stats()` and the
   compositor uses `.removeAlpha().raw()` with Rec.709 computed by hand. On
   `WeirdBaby_PhotoID.png` — 2048×2048 with a real alpha channel — those two
   disagree by **57 luma**: 215.53 against 158.36. Measured a third way,
   flattening onto black explicitly, gives 158.11, so the RAW path is right and
   `stats()` after `greyscale()` is the odd one out on an image with alpha.

   So there is one luma function now and both sides call it. A verifier whose
   two columns are computed differently is not verifying anything — it is
   comparing two pipelines and blaming whichever it trusts less, which very
   nearly published "the encoder flattened Mike's curve" about an encoder that
   had reproduced it to within a third of a luma level. */
const rec709 = (buf) => {
  let s = 0;
  for (let i = 0; i < buf.length; i += 3)
    s += 0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2];
  return s / (buf.length / 3);
};
const lumaOfFile = async (file, w, h, fit, pad) => {
  const { data } = await sharp(file)
    .flatten({ background: pad })
    .resize(w, h, { fit: fit === "contain" ? "contain" : "cover", position: "centre",
      background: pad, kernel: "lanczos3" })
    .toColourspace("srgb")
    .raw().toBuffer({ resolveWithObject: true });
  return rec709(data);
};

const TABLE = JSON.parse(fs.readFileSync(path.join(REPO, "provenance/asset-table.json"), "utf8")).entries;
async function plateLuma(asset, fit, block) {
  const row = TABLE.find(r => r.uid === asset.uid);
  const file = path.join(REPO, row.path);
  const pad = await padColourOf(file, block);
  return lumaOfFile(file, v.width, v.height, fit, pad);
}
const leadLuma = await plateLuma(blocks[0].asset, blocks[0].fit, blocks[0]);
const revealLuma = await plateLuma(blocks[1].asset, blocks[1].fit, blocks[1]);

/* ── decode the frames we care about, out of the MP4 ──────────────────────── */
const tmp = path.join(REPO, "docs/shorts/out/.verify-frames");
fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });
execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y",
  "-i", mp4, "-vsync", "0", "-f", "image2",
  path.join(tmp, "f%04d.png")], { stdio: "inherit" });

/* the decoded frames have no alpha, but they go through the SAME function as
   the expected side — that is the point */
const meanOf = async (p) => {
  const { data } = await sharp(p).flatten({ background: "#000000" })
    .toColourspace("srgb").raw().toBuffer({ resolveWithObject: true });
  return rec709(data);
};

console.log("MEASURED OUT OF THE MP4, AGAINST WHAT THE RECIPE SAYS");
console.log("");
console.log("  moment                       frame     t      alpha   expected   measured    delta");
const rows = [];
for (const [label, f] of MOMENTS) {
  const t = f / FPS;
  /* which block, and the alpha the declaration gives at that instant */
  const inBlock2 = t >= lead;
  const a = inBlock2 ? flashbangAlpha(fb, t - lead) : 0;
  const base = inBlock2 ? revealLuma : leadLuma;
  const expected = base + (255 - base) * Math.round(a * 1000) / 1000;
  const p = path.join(tmp, `f${String(f + 1).padStart(4, "0")}.png`);
  if (!fs.existsSync(p)) { console.log(`  ${label.padEnd(28)} ${String(f).padStart(5)}  (frame not decoded)`); continue; }
  const measured = await meanOf(p);
  rows.push({ label, f, t, a, expected, measured, d: measured - expected, file: p });
  console.log(`  ${label.padEnd(28)} ${String(f).padStart(5)}  ${t.toFixed(3)}  ${a.toFixed(3)}`
    + `   ${expected.toFixed(2).padStart(7)}   ${measured.toFixed(2).padStart(8)}   ${(measured - expected >= 0 ? "+" : "") + (measured - expected).toFixed(2)}`);
}

const worst = rows.reduce((m, r) => Math.abs(r.d) > Math.abs(m.d) ? r : m, rows[0]);
const rms = Math.sqrt(rows.reduce((a, r) => a + r.d * r.d, 0) / rows.length);
console.log("");
console.log(`  largest deviation   ${worst.d >= 0 ? "+" : ""}${worst.d.toFixed(2)} luma at "${worst.label}"`);
console.log(`  RMS deviation       ${rms.toFixed(3)} luma  (out of 255)`);
console.log(`  ${rms < 1 ? "THE ENCODE DID NOT FLATTEN THE CURVE." : "*** THE ENCODE MOVED THE CURVE — investigate. ***"}`);

/* ── the curve itself, sampled densely, so its SHAPE is visible ───────────── */
console.log("");
console.log("THE DISSOLVE, SHAPE AGAINST CURVE 6.0");
console.log("");
console.log("   u      alpha    expected   measured   |  the reveal");
for (let i = 0; i <= 10; i++) {
  const u = i / 10;
  const t = d0 + fb.dissolve * u;
  const f = Math.min(FRAMES - 1, Math.round(t * FPS));
  const a = flashbangAlpha(fb, f / FPS - lead);
  const expected = revealLuma + (255 - revealLuma) * Math.round(a * 1000) / 1000;
  const p = path.join(tmp, `f${String(f + 1).padStart(4, "0")}.png`);
  const measured = fs.existsSync(p) ? await meanOf(p) : NaN;
  const revealed = Math.round((1 - a) * 40);
  console.log(`  ${u.toFixed(1)}   ${a.toFixed(3)}   ${expected.toFixed(2).padStart(7)}   ${measured.toFixed(2).padStart(8)}   |  `
    + "#".repeat(revealed) + ".".repeat(40 - revealed));
}

/* ── deliver ──────────────────────────────────────────────────────────────── */
if (outDir) {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.copyFileSync(mp4, path.join(outDir, path.basename(mp4)));
  for (const r of rows) {
    const name = `f${String(r.f).padStart(4, "0")}_t${r.t.toFixed(3)}_${r.label.replace(/[^\w]+/g, "-")}.png`;
    fs.copyFileSync(r.file, path.join(outDir, name));
  }
  console.log("");
  console.log(`DELIVERED to ${outDir}`);
  console.log(`  ${path.basename(mp4)} + ${rows.length} sampled frame(s)`);
}

fs.rmSync(tmp, { recursive: true, force: true });
