/* ===========================================================================
   THE PAD COLOUR — one declaration, every reader. [2026-08-13]
   ---------------------------------------------------------------------------
   MIKE: *"the pad colour must come from the ingredient, not from a default."*

   IT LIVES IN ITS OWN MODULE FOR A REASON THAT HAS ALREADY COST ONE ROUND.
   The compiler pads the frame and the verifier computes what the frame SHOULD
   be; if those two answer the pad question differently, the verifier reports a
   deviation that is its own. That happened once already — a verifier whose two
   columns used different luma pipelines nearly published "the encoder flattened
   Mike's curve" — and the moment the compiler started padding white while the
   verifier still flattened black, it happened again: **+159.76 luma, RMS 57.4,
   on a file that was correct.**

   It cannot live in `shorts-recipe.mjs`, which is a pure declaration with no
   dependencies, because answering the question requires reading pixels. So it
   is here, it imports `sharp`, and both readers call it.
   =========================================================================== */
import sharp from "sharp";
import { PAD_AUTO, PAD_RING, PAD_TRANSPARENT_AT } from "./shorts-recipe.mjs";

/** the colour a block's letterbox — and its transparent pixels — become.
 *
 *  · an explicit `pad` on the block wins, always
 *  · `auto` asks the INGREDIENT: the average of its outer ring, if that ring is
 *    mostly opaque
 *  · a ring that is mostly TRANSPARENT has no answer to give, so `auto` takes
 *    the colour the block is arriving OUT OF — white for a flash or a
 *    flashbang, black otherwise. A white dissolve then resolves onto a white
 *    card and the letterbox is invisible because there is nothing to see.
 */
export async function padColourOf(file, block) {
  const explicit = block && block.pad;
  if (explicit && explicit !== PAD_AUTO) return explicit;

  const t = ((block || {}).in || {}).type;
  const arrivingFrom = (t === "flash" || t === "flashbang") ? "#ffffff" : "#000000";

  /* a 64px proxy is enough for an average and costs nothing; the ring is scaled
     to the same fraction of it that PAD_RING names of the original */
  const { data, info } = await sharp(file)
    .resize(64, 64, { fit: "fill" })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const ring = Math.max(1, Math.round(64 * PAD_RING * 4));

  let r = 0, g = 0, b = 0, opaque = 0, seen = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const edge = x < ring || y < ring || x >= info.width - ring || y >= info.height - ring;
      if (!edge) continue;
      const i = (y * info.width + x) * info.channels;
      seen++;
      if (data[i + 3] > 127) { opaque++; r += data[i]; g += data[i + 1]; b += data[i + 2]; }
    }
  }
  if (!seen || opaque / seen < PAD_TRANSPARENT_AT) return arrivingFrom;
  const hex = (v) => Math.round(v / opaque).toString(16).padStart(2, "0");
  return "#" + hex(r) + hex(g) + hex(b);
}
