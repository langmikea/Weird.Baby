#!/usr/bin/env node
/* ===========================================================================
   MENU PARITY — THE TWO MACHINES CARRY THE SAME MENU, AND NO ROW IS A STUB.
   [R2 2026-08-05 · ruled P1 · RE-RULED P1 2026-08-05 · RE-CUT 2026-09-18, and
   each reversal is recorded here rather than absorbed]
   ---------------------------------------------------------------------------
   MIKE'S RULE OF 2026-08-05 HAD TWO HALVES:

     "PARITY IS ABSOLUTE. NIAC and VIIIp carry THE SAME MENU ITEMS, no more, no
      less. NIAC will run on the Portal on channels 1 and 2 and it will have a
      manual — so NIAC's rows EXIST and say plainly what is not there yet."

   THE FIRST HALF HOLDS. The two machines carry the same menu items.

   THE SECOND HALF IS OVERRULED, BY HIM, 2026-09-18: **"If a thing is not
   available, it should not be displayed."** It served the slow reveal, where a
   row was the shelf the material would land on. The site now shows only what is
   released and grows by the day, so a row that says what is not there yet is a
   dead end. THE STUB LAW STANDS AGAIN, WITH NO EXCEPTION. The sort is
   `docs/OLD-RULINGS-SWEEP-20260918.md` §5; his "Yes" is in BOARD-DECISIONS.md.

   ═══ WHAT THE RE-CUT CHANGED ═══════════════════════════════════════════════
   Until this round the gate passed BECAUSE the stub rows existed: the
   mainframe's Documentation row held one sentence saying no document is held,
   and the portable's held one card for a manual with no page on file. Both rows
   are gone from `robots-units.js` (the note is where they stood). PARITY WAS
   KEPT BY SUBTRACTION, the way "The Name" left both albums on 2026-08-06: a row
   neither machine can fill leaves both menus.

   ═══ WHAT THIS TOOL DOES NOW ═══════════════════════════════════════════════
     · reads the two machine albums out of `src/data/artists/robots-units.js`;
     · sets their track TITLES against each other;
     · prints both menus and the shared set;
     · FAILS on ANY divergence, in either direction (the first half, unchanged);
     · FAILS on a duplicate title on one machine;
     · FAILS on A STUB ROW: a row whose face, as written, holds nothing a
       visitor can open (see `stubOf` below). This is the new half.

   WHAT A MACHINE THAT HOLDS LESS DOES: it does not get a row saying so, and
   the other machine does not get the row alone. The row waits until both can
   fill it. If that ever proves wrong for a real holding, the answer is a
   ruling, and the mechanism that once let a written holdings gap pass is in
   git at `eccb0b0` (the `JUSTIFIED` table and its ledger check).

   ═══ WHAT IT IS NOT ════════════════════════════════════════════════════════
   IT DOES NOT PARSE THE FRONT DESK, THE PORTAL OR THE CHARACTER ALBUMS. None
   is a machine album; each follows its own template.

   IT DOES NOT SEE THE STAGE. `archiveEmpty` is what an Image Archive prints at
   launch when `placedTiles` resolves every tile to nothing; that is decided at
   build time and this tool reads source. A wall with tiles written on it is not
   a stub here. Whether an emptied wall may show at launch is the landing's
   question (the drop tracks are cut by the day of the run), not this gate's.

   IT IS A PACKET GATE. It reports facts with one right answer, which is what
   lint and build report. OPERATIONS.md runs it on every packet that touches
   either machine album.

     node tools/menu-parity.mjs           the report
     node tools/menu-parity.mjs --gate    exit 1 on any fault
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import * as acorn from "acorn";
import jsxPlugin from "acorn-jsx";

const Parser = acorn.Parser.extend(jsxPlugin());
const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
/* [2026-08-17] THE TWO MACHINES MOVED FILE AND THIS TOOL FOLLOWED THEM. Mike
   ruled both units down the night the wing opened; their albums are behind the
   stage door in `robots-units.js` now (the whole argument is at that file's
   head). This parser reads the two albums by id, so it went from four menu
   items to a crash the moment they left `robots.js`.
   IT STILL RUNS, AND THAT IS DELIBERATE. Parity is a statement about what the
   museum SAYS about its two machines, and it is worth keeping true while they
   are held: the day either comes back, the check has been running the whole
   time rather than being switched on again by somebody who has to remember. */
const SOURCE = "src/data/artists/robots-units.js";

/* The two machines, by album id. `mgk-viii` is the MGK-NIAC's key and not its
   name — the album was renamed at Q3 and the id deliberately was not, because
   it is a key shared with the robots repo's directory tree. */
const MACHINES = [
  { id: "mgk-viii", name: "MGK-NIAC" },
  { id: "mgk-viiip", name: "MGK-VIIIp" },
];

/* ---- AST helpers, the same shape reveal/record-entries.mjs uses ----------- */
function strOf(node) {
  if (!node) return null;
  if (node.type === "Literal" && typeof node.value === "string") return node.value;
  if (node.type === "TemplateLiteral" && node.expressions.length === 0)
    return node.quasis.map(q => q.value.cooked).join("");
  if (node.type === "BinaryExpression" && node.operator === "+") {
    const l = strOf(node.left), r = strOf(node.right);
    return l !== null && r !== null ? l + r : null;
  }
  return null;
}
function propOf(obj, name) {
  if (!obj || obj.type !== "ObjectExpression") return null;
  const p = obj.properties.find(
    x => x.type === "Property" && !x.computed
      && (x.key.name === name || x.key.value === name));
  return p ? p.value : null;
}

/* ═══ [2026-09-18] WHAT A STUB IS, READ OFF THE FACE AS WRITTEN ════════════
   Three shapes, and each is a face this wing already has:
     · a documentation face with no `docs`, or whose every document has no page
       in `plates` (a card that opens nothing);
     · an archive face whose `collage` / `presets` has no tile written on it;
     · a `faqFace()` with no question.
   Anything else is taken as holding something. Returns the reason, or null. */
function arrayIn(node) {
  if (!node) return null;
  if (node.type === "ArrayExpression") return node;
  if (node.type === "CallExpression")
    return node.arguments.map(arrayIn).find(Boolean) || null;
  return null;
}
function stubOf(face) {
  if (!face) return "it has no face";
  if (face.type === "CallExpression") {
    const qs = arrayIn(face);
    return qs && qs.elements.length === 0 ? "its FAQ asks no question" : null;
  }
  if (face.type !== "ObjectExpression") return null;
  const docs = propOf(face, "docs");
  if (propOf(face, "docsEmpty") && !docs) return "it holds no document and says so";
  if (docs && docs.type === "ArrayExpression") {
    const opens = docs.elements.some(d => {
      const plates = arrayIn(propOf(d, "plates"));
      return plates && plates.elements.length > 0;
    });
    if (!opens) return "no document on it has a page to open";
  }
  for (const wall of ["collage", "presets"]) {
    const tiles = arrayIn(propOf(face, wall));
    if (tiles && tiles.elements.length === 0) return `its \`${wall}\` has no tile`;
  }
  return null;
}

/** The rows of one album, in tracklist order: `{ title, stub }`. */
function rowsOf(ast, albumId) {
  let album = null;
  (function visit(n) {
    if (!n || typeof n !== "object" || album) return;
    if (Array.isArray(n)) { n.forEach(visit); return; }
    if (n.type === "ObjectExpression"
      && strOf(propOf(n, "id")) === albumId && propOf(n, "tracks")) {
      album = n; return;
    }
    for (const k of Object.keys(n)) {
      if (k === "type" || k === "start" || k === "end" || k === "loc") continue;
      visit(n[k]);
    }
  })(ast);

  if (!album)
    throw new Error(
      `menu-parity: no album with id "${albumId}" and a \`tracks\` array in ${SOURCE}.\n` +
      "  This is not a divergence — it is the album having moved or been renamed,\n" +
      "  and a check that cannot find its subject must say so rather than report parity.");

  const tracks = propOf(album, "tracks");
  if (!tracks || tracks.type !== "ArrayExpression")
    throw new Error(`menu-parity: album "${albumId}" has a \`tracks\` that is not an array.`);

  const out = [];
  for (const el of tracks.elements) {
    if (!el || el.type !== "ObjectExpression") continue;
    const t = strOf(propOf(el, "title"));
    if (t) out.push({ title: t, stub: stubOf(propOf(el, "face")) });
  }
  return out;
}

/* ═══ THE COMPARISON ════════════════════════════════════════════════════════ */
const src = fs.readFileSync(path.join(REPO, SOURCE), "utf8");
const ast = Parser.parse(src, { ecmaVersion: "latest", sourceType: "module" });

const menus = MACHINES.map(m => {
  const rows = rowsOf(ast, m.id);
  return { ...m, rows, menu: rows.map(r => r.title) };
});
const [A, B] = menus;
const setA = new Set(A.menu), setB = new Set(B.menu);

const shared = A.menu.filter(t => setB.has(t));
const divergences = [
  ...A.menu.filter(t => !setB.has(t)).map(title => ({ title, only: A.name, missing: B.name })),
  ...B.menu.filter(t => !setA.has(t)).map(title => ({ title, only: B.name, missing: A.name })),
];

/* A DUPLICATE TITLE ON ONE MACHINE IS NOT PARITY EITHER, and set arithmetic
   cannot see it: two rows called FAQ on one album and one on the other read as
   the same set. Counted separately, reported as its own fault. */
const dupes = [];
for (const m of menus) {
  const seen = new Set();
  for (const t of m.menu) {
    if (seen.has(t)) dupes.push({ name: m.name, title: t });
    seen.add(t);
  }
}

/* [2026-09-18] A ROW WITH NOTHING BEHIND IT. The half of the old rule that
   asked for these rows is overruled; the gate now refuses them. */
const stubs = [];
for (const m of menus)
  for (const r of m.rows)
    if (r.stub) stubs.push({ name: m.name, title: r.title, why: r.stub });

/* THE SHARED ITEMS SHOULD ALSO BE IN THE SAME ORDER. Reported, never a fault:
   Mike's rule is about WHICH items, and a sequence difference is a thing worth
   seeing rather than a thing that is wrong. */
const orderA = shared.join(" · ");
const orderB = B.menu.filter(t => setA.has(t)).join(" · ");

console.log("MENU PARITY — the two machines' tracklists\n");
for (const m of menus)
  console.log(`  ${m.name.padEnd(10)} ${m.menu.length}  ${m.menu.join(" · ")}`);
console.log(`\n  SHARED (${shared.length}): ${shared.join(" · ") || "—"}`);
if (orderA !== orderB) {
  console.log("\n  ORDER DIFFERS on the shared items — reported, not a fault:");
  console.log(`    ${A.name}: ${orderA}`);
  console.log(`    ${B.name}: ${orderB}`);
}

const faults = [];
for (const d of divergences) faults.push(
  `DIVERGENCE — "${d.title}" is on ${d.only} and not on ${d.missing}.\n` +
  "    The two machines carry the same menu items, no more and no less. If the\n" +
  "    other machine holds something to put behind the row, give it the row. If it\n" +
  "    does not, the row leaves BOTH menus until it does: a row that says what is\n" +
  "    not there yet is a stub, and this gate refuses those too.");
for (const d of dupes) faults.push(
  `DUPLICATE ROW — ${d.name} carries "${d.title}" more than once.\n` +
  "    Two rows of one name on one machine and one on the other is a divergence set\n" +
  "    arithmetic cannot see. Rename one or remove it.");

for (const d of stubs) faults.push(
  `STUB ROW — ${d.name} carries "${d.title}" and ${d.why}.\n` +
  "    MIKE, 2026-09-18: \"If a thing is not available, it should not be displayed.\"\n" +
  "    Take the row off BOTH machines; it comes back the day both can fill it.");

if (faults.length) {
  console.log("");
  faults.forEach(f => console.error("  " + f));
  console.log(`\nPARITY: ${faults.length} fault(s)`);
  process.exit(process.argv.includes("--gate") ? 1 : 0);
}
console.log(`\nPARITY: ${shared.length} shared · 0 divergences · 0 stub rows`);
console.log("  The two machines carry the same menu items, and every row holds something.");
