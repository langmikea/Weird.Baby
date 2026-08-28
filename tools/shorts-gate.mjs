/* ===========================================================================
   THE SHORTS GATE — what a recipe may be made of. [2026-08-28]
   ---------------------------------------------------------------------------
   A recipe becomes a FILE MIKE UPLOADS TO A PLATFORM. That is the one thing in
   this project whose output leaves the building without passing the worker,
   the door, or any of the gates in OPERATIONS §9 — `docs/shorts/out/` is
   gitignored, nothing serves it, and the only thing between it and YouTube is
   a person. **So the check has to be here, because there is nowhere later.**

   ═══ WHAT WAS ACTUALLY WRONG, MEASURED 2026-08-28 ═══════════════════════════
   THE BENCH WAS NEVER THE HOLE. `tools/shorts.mjs` calls `buildShelf()` and has
   carried the ruled-out bar and the never-published bar since the day each was
   written; it does not open the asset table at all. **The hole is the two tools
   that DO open it** — `shorts-compile.mjs` and `shorts-verify.mjs` — which
   resolve a uid straight out of `provenance/asset-table.json` and read the file
   off disk with no question asked of it.

   AND A RECIPE IS NOT REQUIRED TO HAVE COME FROM THE BENCH. `--recipe <path>`
   takes a file from anywhere. So "the bench already filtered it" was never a
   property of the compiler's input, only a habit of where its input came from.

   ═══ IT IS ITS OWN MODULE FOR `shorts-pad.mjs`'s REASON ════════════════════
   *"the pad rule is its own module so the compiler and the verifier cannot
   answer the question differently."* Same argument, higher stakes: two
   implementations of *may this be published* is two different answers on the
   day one of them is edited.

   ═══ THE BARS ARE NOT THIS FILE'S AND IT DECLARES NONE ═════════════════════
   `publishRefusal()` in `tools/dictation/shelf.mjs` is the whole of the
   judgement, and it is the same function `buildShelf()` calls. This file walks
   a recipe and asks it. A rule added here rather than there would be a second
   list on the day it was written — which is the failure `shelf.mjs` exists to
   prevent, stated in its own header.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { publishRefusal } from "./dictation/shelf.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");

/* THE HELD PREFIX, WRITTEN ONCE. `src/lib/placement.js` is the only file in
   `src/` allowed to name one and this is not `src/`; the tools side already
   spells it literally in `shelf.mjs`'s SECTIONS and in `reveal/day.mjs`. */
const HELD_PREFIX = "public/held/";

/** every block's asset resolved to its CURRENT asset-table row.
    Resolution is by `uid` and never by the recipe's own `path`, because that
    is what the compiler does — and because the recipe's `path` goes stale the
    moment a picture moves, which is exactly what broke `shorts:flashbang` for
    three days in August. */
export function resolveRecipe(recipe, table) {
  const blocks = recipe.blocks || [];
  return blocks.map((b, i) => {
    const asset = b.asset || null;
    if (!asset) return { i, id: b.id, asset: null, row: null };
    const row = table.find(r => r.uid === asset.uid) || null;
    return { i, id: b.id, asset, row };
  });
}

/* ═══ THE VERDICT ══════════════════════════════════════════════════════════
   THREE OUTCOMES AND THEY ARE NOT THREE GRADES OF THE SAME THING.

   `refusals`  THE TWO HARD BARS. There is no flag, no environment variable and
               no argument that gets past these, and there must never be one:
               each is a rule somebody made about the CONTENT, recorded with its
               reason, and a bar with a documented way around it is a bar that
               gets walked around on a deadline.

   `held`      A DECLARATION, NOT A BAR, AND THE DIFFERENCE IS THE WHOLE DESIGN.
               The shelf is 132 held rows out of 138 — the 1965 manual, the
               build-card recordings, the plates. **A held bar would refuse
               every real recipe in this tree**, including both teasers and the
               flashbang as it stood eight days ago. Held is a TIMING state:
               *"the door changes, not the payload"*, and 137 of these are
               scheduled to come out. So the gate REFUSES BY DEFAULT and names
               every held asset with its address — and takes an explicit typed
               flag to proceed, the shape `export-artifacts.mjs` already uses in
               this repo for the same reason. **The point is that nobody
               compiles held material by accident; not that they may not
               compile it.**

   `missing`   A uid the table does not hold. Reported here rather than thrown
               from the decoder, so all of them arrive in one list.

   AND IT REPORTS EVERY BLOCK, NOT THE FIRST. A compiler that throws on block 3
   makes Mike run it five times to find five problems. The whole recipe is
   judged and the whole answer is printed. */
export function gateRecipe(recipe, table) {
  const resolved = resolveRecipe(recipe, table);
  const refusals = [], held = [], missing = [];

  for (const r of resolved) {
    if (!r.asset) continue;                       /* a blank block holds nothing */
    if (!r.row) { missing.push(r); continue; }
    const bar = publishRefusal(r.row);
    if (bar) { refusals.push({ ...r, bar }); continue; }
    if (r.row.path.startsWith(HELD_PREFIX)) held.push(r);
  }
  return { resolved, refusals, held, missing, ok: !refusals.length && !missing.length };
}

/** the asset table, read once, the way both callers were reading it. */
export function readTable() {
  return JSON.parse(fs.readFileSync(
    path.join(REPO, "provenance", "asset-table.json"), "utf8")).entries;
}

/* ═══ THE ENFORCEMENT ══════════════════════════════════════════════════════
   Called BEFORE the first decode and before any directory is made — a refusal
   that fires after `fs.mkdirSync` has already left something on disk is a
   refusal that has half-run. `render()` in the compiler resolves every source
   before it spawns ffmpeg, so this sits one step earlier still.

   `allowHeld` is the typed flag from the caller. It cannot reach the two hard
   bars and is not passed to them. */
export function enforce(recipe, table, { allowHeld = false, tool = "shorts" } = {}) {
  const g = gateRecipe(recipe, table);
  const say = (s) => console.error(s);

  if (g.missing.length) {
    say(`\n${tool}: REFUSED — ${g.missing.length} block(s) name a uid the asset table does not hold.`);
    for (const m of g.missing)
      say(`    block ${m.id ?? m.i}   ${m.asset.uid}   (recipe path: ${m.asset.path})`);
    say(`\n  A uid outlives a path, so this is not a rename — the row is gone.`);
    say(`  Run \`npm run assets:scan\` and rebuild the recipe on the bench.`);
  }

  if (g.refusals.length) {
    say(`\n${tool}: REFUSED — ${g.refusals.length} block(s) name material that may not be published.`);
    say(`  There is no flag for this. The bars are content rulings, not settings.\n`);
    for (const r of g.refusals) {
      say(`  ── block ${r.id ?? r.i}   ${r.row.path}`);
      say(`     ${r.bar.bar}`);
      if (r.bar.what) say(`     what   ${r.bar.what}`);
      say(`     why    ${r.bar.reason}`);
      if (r.bar.citation) say(`     ruling ${r.bar.citation}`);
      say("");
    }
  }

  if (g.missing.length || g.refusals.length) {
    say(`  Nothing was rendered and nothing was written.`);
    process.exit(1);
  }

  if (g.held.length && !allowHeld) {
    say(`\n${tool}: STOPPED — ${g.held.length} of ${g.resolved.length} block(s) are HELD material.\n`);
    for (const h of g.held) say(`    block ${String(h.id ?? h.i).padEnd(12)} ${h.row.path}`);
    say(`
  THESE ARE NOT FORBIDDEN. Held is a timing state, not a ruling — the door
  changes, not the payload, and most of this collection is scheduled to come
  out. But a short is a file that leaves the building, and none of these has
  a public address today: a viewer who follows the reel to the site finds
  nothing at that picture's address.

  Neither the ruled-out bar nor the never-published bar was tripped: this
  material carries no ruling against it. What it carries is a DATE.

  If that is what you meant, say so:

      ${tool === "shorts:verify" ? "npm run shorts:verify" : "npm run shorts:render"} -- --held-is-intended

  Nothing was rendered and nothing was written.`);
    process.exit(1);
  }

  if (g.held.length && allowHeld) {
    console.log(`  HELD          ${g.held.length} of ${g.resolved.length} block(s), compiled on --held-is-intended`);
    for (const h of g.held) console.log(`                ${h.row.path}`);
  }
  return g;
}
