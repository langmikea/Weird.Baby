#!/usr/bin/env node
/* ===========================================================================
   THE SHORTS BENCH — build the page Mike makes short videos on. [2026-08-13]
   ---------------------------------------------------------------------------
       npm run shorts            build it
       npm run shorts -- --fresh rebuild every thumbnail

   WHAT IT IS: a recipe tool. Motion over stills — manual pages, photographs,
   artwork. He builds a sequence, watches it, steps it, changes it, saves it.
   IT PRODUCES A RECIPE AND A PREVIEW AND NOTHING ELSE. Something outside the
   browser turns a recipe into a file he posts; that step is not built here and
   nothing in this page serves it beyond emitting a clean recipe.

   VIDEO IS OUT OF SCOPE, in his words a trap, and it is out of scope in the
   DATA as well as in the UI: `mediaKind === "image"` is the only thing that
   reaches the shelf, so a video row could not be chosen even by accident.

   ═══ THE INGREDIENTS ARE THE MUSEUM'S OWN SHELF ═════════════════════════════
   `buildShelf()` in tools/dictation/shelf.mjs — the SAME function the artifact
   tracker calls, not a second reading of the asset table. That function was the
   tracker's own `buildRows`, moved out whole on 2026-08-13 and proved by
   rebuilding assign.html BYTE-IDENTICALLY across the move. It carries
   `RULED_OUT` (Doctrine 24 — a thing he has killed may not come back through a
   catalogue), the signage exclusion, and the `missing` filter.

   THAT LAST ONE IS THE BROKEN LINK HE SAW. The asset table holds nine museum
   rows whose file is not on disk — four `reference/mgk-viii/` photographs among
   them — and a tool that lists rows without asking `missing` emits an <img> at
   a file that is not there. The shelf withholds them and COUNTS them; the count
   is printed in the page's own footer, because a silent filter is
   indistinguishable from a bug.

   ═══ THE THUMBNAILS ARE THE LIGHT TABLE'S ══════════════════════════════════
   Mike's ruling on the picker: use the tooling already built. `thumbnails()` in
   tools/dictation/lighttable.mjs, the same cache, the same 240px inline WebP.
   `raw` is handed through untouched — the `kind` collision that once produced
   143 tiles with no pictures and a thumbnail count of zero is documented there
   and is avoided here the same way.

   ═══ TWO ADDRESSES, AND THIS PAGE USES THE ONE ON DISK ══════════════════════
   OPERATIONS §8: a governed picture has a PUBLIC address (/robots/…) and a HELD
   address (public/held/robots/…). A page opened by double-clicking is a file://
   document and a public address resolves to nothing there. Every href is
   `diskHref` — a relative walk out of docs/shorts/ into the repo — which is why
   the page works with no server.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { buildShelf, SECTIONS } from "./dictation/shelf.mjs";
import { thumbnails } from "./dictation/lighttable.mjs";
import { esc, page } from "./dictation/shell.mjs";
import {
  RECIPE_VERSION, SHAPES, EASES, TRANSITIONS, FIT,
  DEFAULT_BLOCK, emptyRecipe, emptyLibrary,
} from "./shorts-recipe.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const OUT_DIR = path.join(REPO, "docs", "shorts");
const OUT = path.join(OUT_DIR, "shorts.html");
const RECIPES = path.join(OUT_DIR, "recipes.json");
const FRESH = process.argv.includes("--fresh");
const STORE_KEY = "wb.shorts.2026-08-13";

/* THE PAGE SITS TWO HOPS BELOW THE REPO ROOT, WHICH IS WHAT `diskHref` ASSUMES.
   `lighttable.mjs` builds "../.." for a museum row because the tracker lives in
   docs/dictation-20260807/. docs/shorts/ is the same depth — asserted rather
   than assumed, because a third directory level would break every image on the
   page and the failure would look like missing files. */
{
  const depth = path.relative(REPO, OUT_DIR).split(path.sep).length;
  if (depth !== 2)
    throw new Error(`shorts.mjs: the page must sit two directories below the repo `
      + `root for diskHref's "../.." to resolve; docs/shorts is ${depth} deep. `
      + `Move it back, or teach lighttable.mjs about the new depth.`);
}

/* ═══ THE SHELF ════════════════════════════════════════════════════════════ */
const { rows, drop } = buildShelf();
const images = rows.filter(r => r.mediaKind === "image");
const notImages = rows.length - images.length;

/* `thumbnails()` returns `{ thumbs, hits, made, failed }` — the Map is a
   PROPERTY and not the return value, which is the shape the tracker uses too. */
const { thumbs, hits, made, failed } = await thumbnails(images.map(r => r.raw), {
  fresh: FRESH, log: () => {},
});

/* one ingredient, as the page sees it. `uid` + `sha256` travel into the recipe
   so a compile step can resolve the file through the asset table and prove the
   bytes; `href` is for this page only and is deliberately NOT in the recipe. */
const ingredientOf = r => ({
  uid: r.uid,
  label: r.label,
  path: r.raw.path,
  repo: r.raw.repo,
  sha256: r.raw.sha256,
  w: r.w, h: r.h,
  href: r.href,
  thumb: thumbs.get(r.uid) || null,
});

const shelf = SECTIONS
  .map(s => ({
    key: s.key,
    label: s.label,
    items: images.filter(r => r.section === s.key).map(ingredientOf),
  }))
  .filter(g => g.items.length);

/* ═══ WHAT THE PAGE IS TOLD ════════════════════════════════════════════════ */
const baked = fs.existsSync(RECIPES)
  ? JSON.parse(fs.readFileSync(RECIPES, "utf8")) : null;

const cfg = {
  key: STORE_KEY,
  version: RECIPE_VERSION,
  shapes: SHAPES, eases: EASES, transitions: TRANSITIONS, fit: FIT,
  defaultBlock: DEFAULT_BLOCK,
  emptyRecipe: emptyRecipe(),
  emptyLibrary: emptyLibrary(),
  shelf,
  baked,
};

/* ═══ THE PAGE ═════════════════════════════════════════════════════════════ */
const shapeBtns = SHAPES.map(s =>
  `<button class="sh-btn" data-shape="${s.key}">${esc(s.label)}</button>`).join("");
const shapeBOpts = SHAPES.map(s =>
  `<option value="${s.key}"${s.key === "1:1" ? " selected" : ""}>${esc(s.label)}</option>`).join("");

const body = `
<div class="sh-app">

  <div class="sh-top">
    <span class="sh-title">THE SHORTS BENCH</span>
    <select class="sh-btn" id="recipes" style="max-width:220px"></select>
    <button class="sh-btn" id="newRecipe">new</button>
    <input class="sh-name" placeholder="recipe name">
    <label style="color:var(--sh-dim)">fps</label>
    <input class="sh-num" id="fps" type="number" min="1" max="60" step="1" style="width:56px">
    <span class="sh-spacer"></span>
    <button class="sh-btn sh-go" id="saveRepo">SAVE TO THE REPO</button>
    <span class="sh-status">…</span>
  </div>

  <div class="sh-alarm"></div>

  <div class="sh-mid">

    <div class="sh-stage">
      <div class="sh-shapes">
        ${shapeBtns}
        <button class="sh-btn" id="twoUp">show two</button>
        <select class="sh-sel-el" id="shapeB" style="width:auto;display:none">${shapeBOpts}</select>
      </div>
      <div class="sh-canvases">
        <div class="sh-frame"><canvas id="shA"></canvas><span class="sh-cap" id="capA"></span></div>
        <div class="sh-frame" id="frameB" style="display:none"><canvas id="shB"></canvas><span class="sh-cap" id="capB"></span></div>
      </div>
      <div style="padding:0 10px"><input class="sh-scrub" type="range" min="0" max="1" value="0"></div>
      <div class="sh-transport">
        <button class="sh-btn" id="home" title="Home">|◀</button>
        <button class="sh-btn" id="b10" title="shift + ←">◀◀</button>
        <button class="sh-btn" id="b1" title="←">◀</button>
        <button class="sh-btn sh-go" id="play" title="space">▶</button>
        <button class="sh-btn" id="f1" title="→">▶</button>
        <button class="sh-btn" id="f10" title="shift + →">▶▶</button>
        <span class="sh-clock"></span>
      </div>
    </div>

    <div class="sh-right">
      <div class="sh-blocks"></div>
      <div class="sh-insp"></div>
      <div class="sh-shelf">
        <div class="sh-tabs"></div>
        <div class="sh-tiles"></div>
      </div>
    </div>

  </div>

  <div class="sh-foot">
    <span>PLAY <button class="sh-btn" id="pAll">all</button>
      <button class="sh-btn" id="pOne">this block</button>
      <button class="sh-btn" id="pRange">range (shift-click)</button></span>
    <span><b>${images.length}</b> ingredients on the shelf</span>
    <span>withheld: <b>${drop.absent}</b> with no file on disk ·
      <b>${drop.ruled}</b> ruled out or signage ·
      <b>${drop.neverPublished}</b> never published ·
      <b>${notImages}</b> not pictures ·
      <b>${drop.elsewhere + drop.superseded}</b> robots-repo rows</span>
    <span>← → step a frame · shift for ten · space plays</span>
  </div>

</div>
<script>window.SHORTS = ${JSON.stringify(cfg)};</script>
<script>
${fs.readFileSync(path.join(HERE, "shorts.client.js"), "utf8")}
</script>`;

const html = page({
  title: "THE SHORTS BENCH",
  css: fs.readFileSync(path.join(HERE, "shorts.css"), "utf8"),
  body,
});

/* ═══ THE GUARD — every control the script wires must be on the page ════════
   The client audits itself at boot and red-banners a control it cannot find.
   This is the same check one step earlier, at BUILD time, so a page that could
   not work is never written. It is the shape `assertSlotsMatchPage()` uses on
   the worksheet, and it exists for the same reason: a generator and the script
   it emits are two lists, and two lists drift. */
{
  const client = fs.readFileSync(path.join(HERE, "shorts.client.js"), "utf8");
  const wants = new Set();
  for (const m of client.matchAll(/\$\("#([a-zA-Z0-9_-]+)"\)/g)) wants.add(m[1]);
  for (const m of client.matchAll(/getElementById\("([a-zA-Z0-9_-]+)"\)/g)) wants.add(m[1]);
  const missing = [...wants].filter(id => !new RegExp(`id="${id}"`).test(html));
  if (missing.length) {
    console.error("shorts.mjs REFUSED to write the page — the script wires "
      + `${missing.length} control(s) that are not in the markup:`);
    for (const id of missing) console.error("    #" + id);
    console.error("\nNothing was written. Add the control, or stop wiring it.");
    process.exit(1);
  }
  /* and the reverse: markup nobody wires is dead furniture */
  const ids = [...html.matchAll(/id="([a-zA-Z0-9_-]+)"/g)].map(m => m[1]);
  const unwired = ids.filter(id => !wants.has(id));
  if (unwired.length) console.log(`  note: ${unwired.length} id(s) in the markup are not wired: ${unwired.join(", ")}`);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, html);

const kb = n => (n / 1024).toFixed(0) + " KB";
console.log(`wrote ${path.relative(REPO, OUT)}  ${kb(html.length)}`);
console.log(`  ${images.length} ingredients, in ${shelf.length} groups:`);
for (const g of shelf) console.log(`    ${String(g.items.length).padStart(3)}  ${g.label}`);
console.log(`  withheld: ${drop.absent} with no file, ${drop.ruled} ruled out or signage, `
  + `${drop.neverPublished} never published, `
  + `${notImages} not pictures, ${drop.elsewhere + drop.superseded} robots-repo rows`);
console.log(`  thumbnails: ${hits} cached, ${made} made, ${failed} could not be read`);
console.log(`  recipes read back: ${baked ? (baked.recipes || []).length + ` from ${path.relative(REPO, RECIPES)}` : "none on disk yet"}`);
console.log(`\nopen it by double-clicking:  ${path.relative(REPO, OUT)}`);
