#!/usr/bin/env node
/* ===========================================================================
   MENU PARITY — THE TWO MACHINES CARRY THE SAME MENU. FULL STOP.
   [R2 2026-08-05 · ruled P1 · RE-RULED P1 2026-08-05, and the reversal is
   recorded here rather than absorbed]
   ---------------------------------------------------------------------------
   MIKE'S RULE, as it now stands:

     "PARITY IS ABSOLUTE. NIAC and VIIIp carry THE SAME MENU ITEMS, no more, no
      less. NIAC will run on the Portal on channels 1 and 2 and it will have a
      manual — so NIAC's rows EXIST and say plainly what is not there yet."

   ═══ WHAT WAS REVERSED, PLAINLY ════════════════════════════════════════════
   The previous round shipped an Ops ruling in this file that read: *a
   divergence justified in writing by a HOLDINGS GAP is RESOLVED rather than
   overridden — NIAC's menu shows what NIAC has.* Its argument was THE STUB
   LAW's: forcing parity would print a NIAC manual face with no manual behind
   it, a NIAC portal face with no feed and three questions nobody asked, and a
   row that leads nowhere must not exist.

   MIKE OVERRULES IT, and the counter-argument is the one the ruling could not
   see from inside a snapshot of the holdings: THE MATERIAL IS COMING. A row is
   a promise only when nothing is behind it and nothing is on the way. These
   rows are the shelf the material lands on, and a menu that hides a shelf until
   the day it fills is a menu that rearranges itself under a returning visitor.

   SO THE STUB LAW IS OVERRIDDEN FOR THOSE ROWS AND ONLY THOSE ROWS. The
   exception, its reason and its edge are written where the rows are, in
   `src/data/artists/robots.js` above the mainframe's Manual face. DOCTRINE 12
   IS NOT TOUCHED BY ANY OF IT: a row may say what is NOT held; it may not
   invent a section list, a date, a page count or a schedule to look full.

   ═══ WHAT THIS TOOL DOES NOW ═══════════════════════════════════════════════
     · reads the two machine albums out of `src/data/artists/robots.js`;
     · sets their track TITLES against each other;
     · prints both menus and the shared set;
     · FAILS on ANY divergence, in either direction. There is no justification
       table, no `kind` column, and no way to write a reason that makes a
       difference acceptable. That is the whole of the change.

   ═══ WHAT WENT WITH THE RULING, NAMED RATHER THAN QUIETLY DELETED ══════════
   The `JUSTIFIED` table and its three-value `kind` (HOLDINGS · PROPERTY ·
   DESIGN) are gone, and so is the check that read `reveal/ledger.json` to fault
   the day a named holding arrived. That check was the best thing in the old
   file — it turned "the flag clears itself" from a sentence into a mechanism —
   and it has nothing left to guard, because under an absolute rule a divergence
   never waits for holdings. It is recorded here so that if parity is ever
   softened again, whoever softens it knows the mechanism existed and what it
   cost to build. The four written reasons it carried are in git at `eccb0b0`.

   THE STALE-JUSTIFICATION CHECK IS GONE FOR THE SAME REASON and it should be
   mourned for one line: it was the direction nobody thinks to check, and it
   caught all four of its own table's rows the moment this round moved them.

   ═══ WHAT IT IS NOT ════════════════════════════════════════════════════════
   IT DOES NOT PARSE THE FRONT DESK, and it does not parse THE PORTAL. Neither
   is a machine — the front desk is the house's own album and the Portal is a
   door — and same-only-different says a thing that is not a unit follows its
   own template.

   IT IS A PACKET GATE NOW, and that is a change of status worth stating: under
   the old ruling it reported a JUDGEMENT (should these two carry the same
   doors?) and a judgement cannot be a build blocker. Under an absolute rule it
   reports a FACT with one right answer, which is exactly what lint and build
   report, so it belongs beside them. OPERATIONS.md §9 runs it on every packet
   that touches either machine album.

     node tools/menu-parity.mjs           the report
     node tools/menu-parity.mjs --gate    exit 1 on any divergence
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

/** The track titles of one album, in tracklist order. */
function menuOf(ast, albumId) {
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
    if (t) out.push(t);
  }
  return out;
}

/* ═══ THE COMPARISON ════════════════════════════════════════════════════════ */
const src = fs.readFileSync(path.join(REPO, SOURCE), "utf8");
const ast = Parser.parse(src, { ecmaVersion: "latest", sourceType: "module" });

const menus = MACHINES.map(m => ({ ...m, menu: menuOf(ast, m.id) }));
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
  "    PARITY IS ABSOLUTE: the two machines carry the same menu items, no more and\n" +
  "    no less. Give the other machine the row. If the museum holds nothing to put\n" +
  "    behind it, the row still exists and SAYS PLAINLY WHAT IS NOT THERE YET —\n" +
  "    that is the stub-law exception Mike granted, and it is the answer here.\n" +
  "    There is no reason you can write in this file that makes a divergence pass.");
for (const d of dupes) faults.push(
  `DUPLICATE ROW — ${d.name} carries "${d.title}" more than once.\n` +
  "    Two rows of one name on one machine and one on the other is a divergence set\n" +
  "    arithmetic cannot see. Rename one or remove it.");

if (faults.length) {
  console.log("");
  faults.forEach(f => console.error("  " + f));
  console.log(`\nPARITY: ${faults.length} fault(s)`);
  process.exit(process.argv.includes("--gate") ? 1 : 0);
}
console.log(`\nPARITY: ${shared.length} shared · 0 divergences`);
console.log("  The two machines carry the same menu items. Where the mainframe holds");
console.log("  nothing behind a row, the row says so.");
