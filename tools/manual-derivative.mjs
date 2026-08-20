/* ===========================================================================
   THE MANUAL PAGE DERIVATIVE — the one step between the robots repo's master
   and what a visitor downloads.  [2026-08-19]
   ---------------------------------------------------------------------------
   RULING 14 (2026-08-19): "The 300-dpi PNG masters stay in the robots repo.
   What the museum publishes is 1700x2200 WebP q82." That was a MEASUREMENT and
   not a preference — the attachment thumbnail is 3.4em, about 52px square, and
   the same file serves the thumbnail and the reader, so the masters would have
   cost a visitor 9.02 MB to paint five squares.

   WHY THIS FILE EXISTS AT ALL. The five scans already on the wall were derived
   by hand, and a hand-made derivation is a derivation nobody can check. The
   obfuscation law's Article 5 makes traceability a SHIPPING CONDITION — "source
   file, timestamp, and derivation must be recorded... an asset nobody can trace
   is a rumour" — so the sixth one gets a script rather than a memory of what
   was done. It is deliberately tiny and does exactly one thing.

   IT READS ACROSS REPOS AND WRITES ONLY INTO THIS ONE. The master is in
   weird-baby-robots and is never touched. Run:

     node tools/manual-derivative.mjs \
       --src ../weird-baby-robots/robots/mgk-viiip/manual/structure/pages/marked/page-47.png \
       --out public/robots/manual/marked-01-a.webp

   THE PAGE IS GREYSCALE AND STAYS GREYSCALE. The robots wing is black and
   white by Mike's standing law and no `[data-colour]` is declared anywhere, so
   there is nothing here to preserve colour FOR. The source is already single
   channel; this does not convert it to one, which would be a claim about the
   master rather than about the delivery.
   ======================================================================== */
import sharp from "sharp";
import { statSync } from "node:fs";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const WIDTH = 1700, HEIGHT = 2200, QUALITY = 82;

const args = process.argv.slice(2);
const get = (k) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : null;
};
const src = get("--src"), out = get("--out");
if (!src || !out) {
  console.error("usage: --src <master.png> --out <public/....webp>");
  process.exit(2);
}

const meta = await sharp(src).metadata();
if (meta.width !== 2550 || meta.height !== 3300) {
  console.error(
    `refusing: master is ${meta.width}x${meta.height}, expected 2550x3300 ` +
    `(a 300-dpi Letter page). A master of another size is a different object ` +
    `and wants a ruling, not a resample.`);
  process.exit(1);
}

await sharp(src)
  .resize(WIDTH, HEIGHT, { fit: "fill", kernel: "lanczos3" })
  .webp({ quality: QUALITY })
  .toFile(out);

const sha = createHash("sha256").update(readFileSync(src)).digest("hex");
const o = statSync(out);
console.log(`source   ${src}`);
console.log(`         ${meta.width}x${meta.height} ${meta.channels}ch  sha256 ${sha}`);
console.log(`wrote    ${out}`);
console.log(`         ${WIDTH}x${HEIGHT} webp q${QUALITY}  ${(o.size / 1024).toFixed(0)} KB`);
