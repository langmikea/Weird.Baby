// src/lib/placement.js — THE PULL-BACK RULE, AT THE GLASS. [V1 2026-08-06]
//
// MIKE: "DURING DEVELOPMENT, SHOW EVERYTHING THAT IS PLACED, until asked to
// filter. The pull-back rule is a LAUNCH-STATE rule, not a development-state
// one. Mike cannot direct what he cannot see."
//
// THIS FILE IS THE STAGE DOOR'S ONLY ADDRESS IN `src/`, AND THAT IS DELIBERATE.
// `reveal/reachability.mjs` check 4 fails any public module that names a held
// prefix, because a held thing's address in a public chunk is the leak the
// whole boundary exists to stop. The data therefore declares only PUBLIC
// addresses — `/robots/reference/photos/front_full.png`, the address the
// picture will have the day the Record delivers it — and the held prefix is
// computed here, in the one file that is on check 4's door list.
//
// THE RULE ITSELF IS NOT HERE. It is `placeRule` in reveal/placement.mjs, which
// `reveal/reachability.mjs` calls with a LAUNCH configuration to prove it still
// returns nothing. One rule, three callers — the same arrangement, and the same
// reason, as `stripVaultAudio` and `publicLedger`.
//
// WHAT IS INJECTED AND WHAT IS NOT. `__WB_PLACEMENT__` carries the stage and
// the PUBLIC set — delivered ∪ signage, derived from the Record by
// `reveal/delivery.mjs` at config time. It never carries the held set: at
// LAUNCH that would be a list of exactly what the museum is holding back,
// shipped inside the bundle that is holding it back.

import { placeRule } from "../../reveal/placement.mjs";

const CFG = __WB_PLACEMENT__;
const PUBLIC_PATHS = new Set(CFG.publicPaths);

/** `"development"` | `"launch"`. Read `reveal/stage.mjs` before using it. */
export const STAGE = CFG.stage;

/** true while the pull-back rule is being APPLIED rather than merely recorded */
export const launched = () => STAGE === "launch";

/** the address to draw for a picture the data declares, or null for nothing */
export function placed(webPath) {
  return placeRule(webPath, { stage: STAGE, publicPaths: PUBLIC_PATHS });
}

/* ── THE TWO SHAPES THE DATA ACTUALLY HOLDS ─────────────────────────────────
   A wall tile is `{ img, href, label, date }` and the two addresses are the
   same picture, so a tile whose picture is not placed is not a tile with a
   broken image — it is not a tile. `placedTiles` drops it.
   A grouping that empties drops with it, because a named preset whose count is
   zero is a drawer labelled with nothing in it, and every grouping in this
   museum carries its own count (N9). A wall that empties leaves `spreads`/
   `presets` undefined, which is what makes `archiveEmpty` print — the honest
   shelf `ArchiveWall` was given at H2 and which stays exactly as it was. */
export function placedTiles(tiles) {
  return (tiles || [])
    .map(t => ({ ...t, img: placed(t.img), href: placed(t.href) }))
    .filter(t => t.img);
}

export function placedPresets(presets) {
  const out = (presets || [])
    .map(p => ({ ...p, tiles: placedTiles(p.tiles) }))
    .filter(p => p.tiles.length > 0);
  return out.length ? out : undefined;
}
