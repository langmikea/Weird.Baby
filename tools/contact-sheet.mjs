#!/usr/bin/env node
/* ===========================================================================
   THE CONTACT SHEET — every image in both repositories, on one page.
   [H7 2026-08-06]
   ---------------------------------------------------------------------------
   MIKE: "prep for the photo cull — many images are completely useless and I
   want to burn them down. Produce a CONTACT SHEET I can rule from: every image
   in both repos as a labelled thumbnail grid with its id, where it is used, and
   its current verdict field. One document, scannable, so I can name what dies
   without hunting paths."

   IT COMPUTES NOTHING NEW, WHICH IS THE POINT. Every column comes off
   `provenance/asset-table.json` — the uid, the path, the dimensions, the byte
   count, the role, the `usedBy` list and the `verdict` — because that table is
   already the authority on files and a second reading of the disk would be a
   second answer to the same question. What this adds is the one thing the table
   cannot be: A PICTURE OF EACH ROW. A path is not something anybody can rule on.

   IT IS AN OPS INSTRUMENT AND MUST NEVER BECOME A ROUTE, on exactly the
   reasoning `reveal:cards` and `assets:checklist` carry: a page whose subject is
   the museum's own housekeeping is meta by Doctrine 11 and fails the
   visible-line test at any live address. It renders to a file on disk.

   IT WRITES NO VERDICT AND CANNOT. `verdict` is unset by default and is never
   written by Ops (Doctrine 15) — this sheet PRINTS the field and gives Mike a
   way to gather his answers as text, and the answers come back as a decision,
   not as a file this tool has edited.

     node tools/contact-sheet.mjs              write docs/CONTACT_SHEET.html
     node tools/contact-sheet.mjs --out <path> somewhere else
     node tools/contact-sheet.mjs --px 240     bigger thumbnails

   THE THUMBNAILS ARE INLINE AND THAT IS DELIBERATE. 85 MB of source across two
   repositories becomes about a megabyte and a half of WebP inside one file, so
   the sheet is a single document that opens anywhere, keeps working when the
   repos move, and can be sent to somebody who does not have either of them.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import sharp from "sharp";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const MUSEUM = path.resolve(HERE, "..");
const ROBOTS = path.resolve(MUSEUM, "..", "weird-baby-robots");
const ROOT = { museum: MUSEUM, robots: ROBOTS };

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 ? argv[i + 1] : d; };
const PX = Number(opt("px", 200));
const OUT = path.resolve(MUSEUM, opt("out", "docs/CONTACT_SHEET.html"));

const TABLE = JSON.parse(fs.readFileSync(
  path.join(MUSEUM, "provenance", "asset-table.json"), "utf8"));

/* the held tree is named so the sheet can say so — a picture behind the door is
   a different thing to rule on from one on the glass. */
const isHeld = e => e.path.startsWith("public/held/");

const esc = s => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const kb = n => n >= 1048576 ? (n / 1048576).toFixed(1) + " MB"
  : Math.round(n / 1024) + " KB";

async function thumb(abs) {
  try {
    const buf = await sharp(abs, { failOn: "none" })
      .rotate()
      .resize(PX, PX, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 62 })
      .toBuffer();
    return "data:image/webp;base64," + buf.toString("base64");
  } catch (e) {
    return null;                                  // reported in the tile
  }
}

const images = TABLE.entries
  .filter(e => e.kind === "image")
  .sort((a, b) => a.repo.localeCompare(b.repo) || a.path.localeCompare(b.path));

console.log(`${images.length} image(s) — rendering at ${PX}px…`);

const tiles = [];
let bytes = 0, failed = 0, gone = 0;
for (const e of images) {
  const abs = path.join(ROOT[e.repo], e.path.split("/").join(path.sep));
  const onDisk = fs.existsSync(abs);
  const src = onDisk ? await thumb(abs) : null;
  if (!onDisk) gone++;
  else if (!src) failed++;
  e._gone = !onDisk;
  bytes += e.bytes || 0;
  const where = (e.usedBy || []);
  const group = e.repo + "/" + (path.posix.dirname(e.path) || ".");
  tiles.push({ e, src, where, group });
  if (tiles.length % 40 === 0) console.log(`  ${tiles.length}/${images.length}`);
}

/* grouped by repo + directory, in the order they sorted */
const groups = [];
for (const t of tiles) {
  if (!groups.length || groups[groups.length - 1].name !== t.group) {
    groups.push({ name: t.group, tiles: [] });
  }
  groups[groups.length - 1].tiles.push(t);
}

const badge = (t, kind, label) => `<i class="b b-${kind}">${label}</i>`;

const tileHtml = t => {
  const e = t.e;
  const held = isHeld(e);
  const flags = [
    e.role === "shipped" ? badge(t, "on", "on the glass") : "",
    e.role === "unreferenced" ? badge(t, "un", "nothing uses it") : "",
    e.role === "source" ? badge(t, "src", "source, never served") : "",
    held ? badge(t, "held", "behind the door") : "",
    e._gone ? badge(t, "gone", "not on disk") : "",
  ].join("");
  return `<figure class="t" data-uid="${esc(e.uid)}" data-path="${esc(e.repo + ":" + e.path)}"
   data-role="${esc(e.role)}" data-held="${held ? 1 : 0}" data-gone="${e._gone ? 1 : 0}"
   data-verdict="${esc(e.verdict || "")}">
  <button class="mark" title="mark for the cull">&#10007;</button>
  <div class="ph">${t.src
    ? `<img loading="lazy" src="${t.src}" alt="">`
    : `<span class="no">no thumbnail<br><small>${fs.existsSync(path.join(ROOT[e.repo], e.path)) ? "unreadable" : "not on disk"}</small></span>`}</div>
  <figcaption>
    <b>${esc(path.posix.basename(e.path))}</b>
    <code>${esc(e.uid)}</code>
    <span class="m">${e.w && e.h ? `${e.w}&times;${e.h}` : "&mdash;"} &middot; ${kb(e.bytes)} &middot; ${esc(e.format)}</span>
    <span class="f">${flags}</span>
    <span class="u">${t.where.length
      ? t.where.map(w => `<span>${esc(w)}</span>`).join("")
      : `<span class="dim">used by nothing in this repo</span>`}</span>
    <span class="v">verdict: <b>${e.verdict ? esc(e.verdict) : "&mdash; not ruled"}</b>${
      e.quality ? ` &middot; ops read: ${esc(e.quality)}` : ""}</span>
    <span class="p">${esc(e.repo)}:${esc(e.path)}</span>
  </figcaption>
</figure>`;
};

const counts = {
  all: images.length,
  shipped: images.filter(e => e.role === "shipped").length,
  unref: images.filter(e => e.role === "unreferenced").length,
  source: images.filter(e => e.role === "source").length,
  held: images.filter(isHeld).length,
  gone: 0,   /* filled after the walk — a row is only "gone" once we look */
  ruled: images.filter(e => e.verdict).length,
};

const html = `<!doctype html>
<meta charset="utf-8">
<title>Weird.Baby &mdash; contact sheet</title>
<style>
  :root{--ink:#191713;--dim:#6d685e;--line:#d6d1c4;--paper:#f2efe6;--card:#fffdf7;
        --kill:#a8321f}
  *{box-sizing:border-box}
  body{margin:0;background:var(--paper);color:var(--ink);
       font:14px/1.45 ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}
  header{position:sticky;top:0;z-index:9;background:var(--card);
         border-bottom:1px solid var(--line);padding:14px 20px 12px;
         box-shadow:0 6px 18px -14px rgba(0,0,0,.6)}
  h1{margin:0 0 3px;font-size:17px;letter-spacing:.02em}
  .sub{color:var(--dim);font-size:12.5px;margin-bottom:9px}
  .bar{display:flex;flex-wrap:wrap;gap:7px;align-items:center}
  .bar button{font:inherit;font-size:12.5px;padding:4px 11px;cursor:pointer;
    background:transparent;border:1px solid var(--line);border-radius:2px;color:var(--ink)}
  .bar button.on{background:var(--ink);color:var(--paper);border-color:var(--ink)}
  .bar a#jump{font-size:12.5px;color:var(--kill);text-decoration:none;border-bottom:1px solid currentColor}
  .grid{display:grid;gap:14px;padding:18px 20px 60px;
    grid-template-columns:repeat(auto-fill,minmax(${PX + 34}px,1fr))}
  /* overflow-wrap on the group heading is load-bearing at phone width: these
     are directory paths with no spaces in them, and at 390px the longest one
     pushed the DOCUMENT 27px sideways. Text overflow is invisible to a check
     that reads element boxes — the h2's own box was inside the viewport. */
  h2{grid-column:1/-1;margin:22px 0 -4px;font-size:12.5px;letter-spacing:.14em;
     text-transform:uppercase;color:var(--dim);overflow-wrap:anywhere;
     border-bottom:1px solid var(--line);padding-bottom:6px}
  h2 span{text-transform:none;letter-spacing:0;float:right;font-weight:400}
  .t{margin:0;background:var(--card);border:1px solid var(--line);border-radius:3px;
     padding:8px;position:relative;display:flex;flex-direction:column;gap:7px}
  .t.killed{outline:2px solid var(--kill);background:#fbeeea}
  .t.killed .ph{opacity:.4}
  .mark{position:absolute;top:6px;right:6px;z-index:2;width:24px;height:24px;
    border-radius:50%;border:1px solid var(--line);background:var(--card);
    color:var(--dim);cursor:pointer;font-size:13px;line-height:1;padding:0}
  .t.killed .mark{background:var(--kill);color:#fff;border-color:var(--kill)}
  .ph{display:flex;align-items:center;justify-content:center;
      min-height:${Math.round(PX * .62)}px;background:
      linear-gradient(45deg,#eceadf 25%,transparent 25%,transparent 75%,#eceadf 75%) 0 0/16px 16px,
      linear-gradient(45deg,#eceadf 25%,transparent 25%,transparent 75%,#eceadf 75%) 8px 8px/16px 16px,
      #f7f5ee}
  .ph img{max-width:100%;height:auto;display:block}
  .no{color:var(--kill);font-size:12px;text-align:center}
  figcaption{display:flex;flex-direction:column;gap:3px;font-size:12px;min-width:0}
  figcaption b{font-weight:600;word-break:break-all}
  code{font-size:11px;color:var(--dim)}
  .m{color:var(--dim);font-size:11.5px}
  .f{display:flex;flex-wrap:wrap;gap:4px;margin:2px 0}
  .b{font-style:normal;font-size:10.5px;letter-spacing:.04em;padding:1px 6px;
     border-radius:2px;border:1px solid var(--line);color:var(--dim)}
  .b-on{background:#e6efe4;border-color:#b9cfb4;color:#31502b}
  .b-un{background:#f6e9df;border-color:#dcc0a6;color:#7b4a22}
  .b-held{background:#e7e6f0;border-color:#bcb9d2;color:#3f3b63}
  .b-gone{background:#f6dedb;border-color:#dcb2ac;color:#8a2c1a}
  .u{display:flex;flex-direction:column;gap:1px;font-size:11px;color:#4b4740}
  .u .dim{color:var(--dim);font-style:italic}
  .v{font-size:11.5px;color:#4b4740}
  .p{font-size:10.5px;color:var(--dim);word-break:break-all;
     user-select:all;padding-top:2px;border-top:1px dotted var(--line)}
  #out{grid-column:1/-1;margin-top:22px;background:var(--card);border:1px solid var(--line);
       padding:12px;border-radius:3px}
  #out textarea{width:100%;min-height:150px;font:12px/1.4 ui-monospace,monospace;
       border:1px solid var(--line);border-radius:2px;padding:8px;background:#fffef9}
</style>
<header>
  <h1>Weird.Baby &mdash; contact sheet</h1>
  <div class="sub">${counts.all} images across both repositories &middot;
    ${kb(bytes)} on disk &middot; ${counts.shipped} on the glass &middot;
    ${counts.unref} referenced by nothing &middot; ${counts.source} never served &middot;
    ${counts.held} behind the door &middot; ${gone} point at a file that is not on disk
    &middot; <b>${counts.ruled} carry a verdict</b>.</div>
  <div class="bar">
    <button data-f="all" class="on">everything</button>
    <button data-f="shipped">on the glass</button>
    <button data-f="unreferenced">nothing uses it</button>
    <button data-f="source">source, never served</button>
    <button data-f="held">behind the door</button>
    <button data-f="gone">not on disk</button>
    <button data-f="killed">marked for the cull</button>
    <span style="flex:1"></span>
    <a id="jump" href="#out" hidden>0 marked</a>
    <button id="clear">clear marks</button>
  </div>
</header>
<div class="grid">
${groups.map(g => `  <h2>${esc(g.name)} <span>${g.tiles.length} image${g.tiles.length === 1 ? "" : "s"}</span></h2>
${g.tiles.map(tileHtml).join("\n")}`).join("\n")}
  <div id="out">
    <b>Marked for the cull &mdash; <span id="n">0</span></b>
    <span class="m">Plain text. Nothing here is deleted by this page.</span>
    <textarea id="ta" readonly placeholder="click the ✗ on any tile"></textarea>
  </div>
</div>
<script>
  const grid = document.querySelector(".grid");
  const ta = document.getElementById("ta");
  const n = document.getElementById("n");
  function refresh() {
    const k = [...document.querySelectorAll(".t.killed")];
    n.textContent = k.length;
    const j = document.getElementById("jump");
    j.hidden = !k.length; j.textContent = k.length + " marked ↓";
    ta.value = k.map(t => t.dataset.path + "   (" + t.dataset.uid + ")").join("\\n");
  }
  grid.addEventListener("click", e => {
    const b = e.target.closest(".mark");
    if (!b) return;
    b.closest(".t").classList.toggle("killed");
    refresh();
  });
  document.getElementById("clear").addEventListener("click", () => {
    document.querySelectorAll(".t.killed").forEach(t => t.classList.remove("killed"));
    refresh();
  });
  document.querySelectorAll(".bar button[data-f]").forEach(b => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".bar button[data-f]").forEach(x => x.classList.remove("on"));
      b.classList.add("on");
      const f = b.dataset.f;
      document.querySelectorAll(".t").forEach(t => {
        const show = f === "all" ? true
          : f === "held" ? t.dataset.held === "1"
          : f === "gone" ? t.dataset.gone === "1"
          : f === "killed" ? t.classList.contains("killed")
          : t.dataset.role === f;
        t.style.display = show ? "" : "none";
      });
      document.querySelectorAll("h2").forEach(h => {
        let el = h.nextElementSibling, any = false;
        while (el && el.tagName === "FIGURE") { if (el.style.display !== "none") any = true; el = el.nextElementSibling; }
        h.style.display = any ? "" : "none";
      });
    });
  });
</script>
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`\nwrote ${path.relative(MUSEUM, OUT)}  (${kb(Buffer.byteLength(html))})`);
console.log(`  ${counts.all} images · ${kb(bytes)} of source`);
console.log(`  ${counts.shipped} on the glass · ${counts.unref} referenced by nothing · ${counts.source} never served`);
console.log(`  ${counts.held} behind the door · ${counts.ruled} carry a verdict`);
if (gone) console.log(`  ${gone} row(s) point at a file that is not on disk — filter "not on disk"`);
if (failed) console.log(`  ${failed} on disk and unreadable by sharp — each says so on its tile`);
