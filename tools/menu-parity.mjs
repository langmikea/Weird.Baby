#!/usr/bin/env node
/* ===========================================================================
   MENU PARITY — THE TWO MACHINES CARRY THE SAME MENU, OR SOMEBODY SAYS WHY.
   [R2 2026-08-05]
   ---------------------------------------------------------------------------
   MIKE'S RULE, and it is a rule with teeth rather than a preference:

     "NIAC and VIIIp carry THE SAME MENU ITEMS BY DEFAULT — no more, no less.
      Any difference is a YELLOW FLAG that must be justified in writing, not
      absorbed silently. Build the check that reports divergence."

   ═══ WHY THIS NEEDED A TOOL AND NOT A HABIT ════════════════════════════════
   The two albums drifted apart over four rounds and nobody noticed, because a
   divergence is invisible from inside either album: you read the MGK-VIIIp's
   tracklist and it looks complete, you read the MGK-NIAC's and it looks
   complete, and only a reader holding both at once can see that one of them has
   a manual and the other does not. THE DEFAULT IS PARITY, so the burden sits on
   the DIFFERENCE, and a burden nothing enforces is a preference. This prints
   every difference, every run, with the reason beside it.

   ═══ WHAT IT DOES ══════════════════════════════════════════════════════════
     · reads the two machine albums out of `src/data/artists/robots.js`;
     · sets their track TITLES against each other;
     · prints the shared menu, then every divergence with its written reason;
     · FAILS (`--gate`, exit 1) on a divergence NOBODY HAS WRITTEN A REASON FOR,
       and on a reason naming a divergence that no longer exists.

   THE SECOND FAILURE IS THE ONE THAT KEEPS THIS HONEST. A justification table
   that is only checked in one direction rots into a list of excuses for things
   that were fixed years ago, and then a real divergence hides inside it. Both
   directions, same as the transfer table's own drift guard.

   ═══ WHAT IT IS NOT ════════════════════════════════════════════════════════
   IT IS NOT A PACKET GATE. It reports a JUDGEMENT — whether two exhibits should
   carry the same doors — and a judgement cannot be a build blocker without
   turning every honest asymmetry into a commit that will not land. Run it with
   the packet, read it, and act or write a reason. The same distinction
   `assets:gate` is held to (OPERATIONS.md §7, Doctrine 15).

   IT DOES NOT PARSE THE FRONT DESK. Weird.Baby Robots is the house's own album,
   not a machine, and same-only-different says a thing that is not a unit
   follows its own template.

     node tools/menu-parity.mjs           the report
     node tools/menu-parity.mjs --gate    exit 1 on an undeclared divergence
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import * as acorn from "acorn";
import jsxPlugin from "acorn-jsx";

const Parser = acorn.Parser.extend(jsxPlugin());
const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const SOURCE = "src/data/artists/robots.js";

/* The two machines, by album id. `mgk-viii` is the MGK-NIAC's key and not its
   name — the album was renamed at Q3 and the id deliberately was not, because
   it is a key shared with the robots repo's directory tree. */
const MACHINES = [
  { id: "mgk-viii", name: "MGK-NIAC" },
  { id: "mgk-viiip", name: "MGK-VIIIp" },
];

/* ═══ THE JUSTIFICATIONS ════════════════════════════════════════════════════
   One entry per divergence, keyed by the track title that is present on one
   album and absent from the other. `only` is the machine that HAS it. `why` is
   the reason, in writing, and it is a reason about the OBJECTS rather than
   about the backlog wherever it honestly can be. `closes` names the condition
   under which the divergence should stop existing — null where it never will.

   THESE ARE OPS' READINGS OF WHAT IS ALREADY TRUE, not decisions. Where the
   honest reason is "the museum does not hold the material", it says that; it
   does not dress a holdings gap as an editorial choice, and it does not invent
   a NIAC manual, a NIAC portal feed or a NIAC FAQ to make the two match. That
   is the difference between parity and symmetry.                            */
const JUSTIFIED = [
  {
    title: "The Name", only: "MGK-NIAC", closes: null,
    why:
      "PERMANENT, AND IT IS A PROPERTY OF THE OBJECT. This machine was built as "
      + "MGK-NIAC and sold as MGK-VIII; ABEAL did the renaming, both names are in "
      + "live use (the folder, the firmware and the parts still carry the second), "
      + "and only one of them could go on the door. The face is where that is "
      + "reconciled. The MGK-VIIIp has one name and nothing to reconcile, so the "
      + "matching face would be a face about nothing.",
  },
  {
    title: "The Manual", only: "MGK-VIIIp", closes: "a manual for the mainframe reaching the museum",
    why:
      "A HOLDINGS GAP, STATED AS ONE. The museum holds an operating and "
      + "maintenance manual for the portable — ABEAL 8P-OMI-1 — and holds no "
      + "manual for the mainframe. Writing a NIAC manual face today would mean "
      + "inventing its sections, which is the failure Doctrine 12 exists for. The "
      + "day one arrives the face is a data block and this row goes.",
  },
  {
    title: "The Portal", only: "MGK-VIIIp", closes: "portal.feed.niac.1 / .2 arming — the mainframe running on the Portal",
    why:
      "ON THE ARC, AND EXPECTED TO CLOSE. The p in MGK-VIIIp means PORTAL (canon "
      + "2026-07-29), so the portal is a property of the portable rather than of "
      + "the line — which is why the face sits where it sits. But Mike's canon is "
      + "that the mainframe runs on the Portal SOMEDAY, and R6 has already "
      + "engraved its two channels on the drum where a visitor reads them. The "
      + "asymmetry is therefore already visible on the glass and already "
      + "acknowledged there, which is the honest state of a divergence that is "
      + "scheduled rather than permanent.",
  },
  {
    title: "FAQ", only: "MGK-VIIIp", closes: "questions about the mainframe that are not already answered on THE NAME",
    why:
      "NOTHING TO PUT IN IT, AND THAT IS THE WHOLE REASON. The VIIIp's FAQ "
      + "answers three questions about the unit — does it still work, is the "
      + "Portal the real machine, can I buy one. The mainframe's answers to the "
      + "first and third are the wing FAQ's, and it has no Portal. Writing three "
      + "questions to make the tracklists the same length would be inventing "
      + "content to satisfy a symmetry, which is the opposite of what this check "
      + "is for.",
  },
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

const byTitle = new Map(JUSTIFIED.map(j => [j.title + " " + j.only, j]));
const faults = [];

for (const d of divergences) {
  const j = byTitle.get(d.title + " " + d.only);
  d.j = j || null;
  if (!j) faults.push(
    `UNDECLARED DIVERGENCE — "${d.title}" is on ${d.only} and not on ${d.missing}.\n` +
    "    Mike's rule is that the two machines carry the same menu items BY DEFAULT.\n" +
    "    Either give the other machine the face, or write the reason into JUSTIFIED\n" +
    "    in tools/menu-parity.mjs. Absorbing it silently is the one thing forbidden.");
}
/* the other direction: a reason for something that is no longer true */
for (const j of JUSTIFIED) {
  if (!divergences.some(d => d.title === j.title && d.only === j.only)) faults.push(
    `STALE JUSTIFICATION — "${j.title}" is declared as ${j.only}-only and is not.\n` +
    "    Either the divergence closed and this reason should go, or the face moved.\n" +
    "    A justification table checked in one direction becomes a list of excuses.");
}

/* THE SHARED ITEMS SHOULD ALSO BE IN THE SAME ORDER. Reported, never a fault:
   a menu whose common doors are in a different sequence on each machine is a
   thing worth seeing, and it is not the rule Mike stated. */
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

console.log(`\n  DIVERGENCES (${divergences.length}) — every one is a YELLOW FLAG:\n`);
for (const d of divergences) {
  console.log(`  ▲ "${d.title}" — on ${d.only}, not on ${d.missing}`);
  if (d.j) {
    console.log(`      WHY: ${d.j.why}`);
    console.log(`      CLOSES WHEN: ${d.j.closes || "never — it is a property of the objects"}`);
  } else {
    console.log("      WHY: NOTHING WRITTEN. This is the fault this tool exists for.");
  }
  console.log("");
}

if (faults.length) {
  faults.forEach(f => console.error("  " + f));
  console.log(`PARITY: ${faults.length} fault(s)`);
  process.exit(process.argv.includes("--gate") ? 1 : 0);
}
console.log(`PARITY: ${shared.length} shared · ${divergences.length} declared divergence(s) · 0 undeclared`);
console.log("  Every difference between the two machines has a reason in writing.");
