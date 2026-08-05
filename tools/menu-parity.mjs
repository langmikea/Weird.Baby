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

   ═══ [P1 2026-08-05] THE PARITY RULING, WHICH IS WHAT THIS FILE NOW ENFORCES ═
   Mike's rule above said what to DO with a divergence. It did not say when a
   divergence is FINISHED WITH, and R2 shipped four written reasons with no way
   to tell "this is answered" from "this is excused". THE RULING, in his terms:

     PARITY IS THE DEFAULT. A divergence is a YELLOW FLAG. **A flag justified in
     writing by a HOLDINGS GAP is RESOLVED, not overridden** — the museum knows
     less about one machine than the other, and a menu that shows what the
     machine HAS is the honest menu. NIAC's menu shows what NIAC has. When the
     holdings arrive the rows arrive with them, and the flag clears itself.

   WHY A HOLDINGS GAP RESOLVES AND A PREFERENCE DOES NOT. Forcing parity here
   would print a NIAC manual face with no manual behind it, a NIAC portal face
   with no feed, and three NIAC questions nobody asked — rows that lead nowhere,
   which is exactly what THE STUB LAW forbids and on exactly these grounds. A
   holdings gap is therefore not a reason to bend the rule; it is the rule's own
   answer. A design preference is not, and has to keep standing in the light.

   ═══ WHAT IT DOES ══════════════════════════════════════════════════════════
     · reads the two machine albums out of `src/data/artists/robots.js`;
     · sets their track TITLES against each other;
     · prints the shared menu, then every divergence with its written reason,
       marked RESOLVED (holdings gap or property of the objects) or STANDING
       FLAG (anything else — a difference somebody chose);
     · FAILS (`--gate`, exit 1) on a divergence NOBODY HAS WRITTEN A REASON FOR,
       on a reason naming a divergence that no longer exists, and — the ruling's
       own half — on a HOLDINGS GAP WHOSE HOLDINGS HAVE ARRIVED.

   THE SECOND AND THIRD FAILURES ARE WHAT KEEP THIS HONEST. A justification
   table that is only checked in one direction rots into a list of excuses for
   things that were fixed years ago, and then a real divergence hides inside it.
   And "it clears itself" is a promise until something checks it: a holdings gap
   names the LEDGER ROW that would exist, and be built, if the museum held the
   material — so the day it does, this table faults instead of ageing quietly
   into a lie about the collection. Three directions, all mechanical.

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
   is the difference between parity and symmetry.

   ═══ [P1] `kind` — AND THE THIRD VALUE IS WHY THE OTHER TWO MEAN ANYTHING ═══
     HOLDINGS  the museum does not hold the material. RESOLVED by the ruling,
               and it must name `holding`: the ledger row that would exist and
               be built if it did. That is what makes "the flag clears itself"
               a mechanism instead of a sentence.
     PROPERTY  a fact about the objects themselves, permanent. RESOLVED, and it
               may NOT name a holding — a permanent property is not waiting on
               a delivery, and letting it name one would quietly turn "never"
               into "not yet".
     DESIGN    somebody chose it. A STANDING YELLOW FLAG: reported every run,
               never a fault, never resolved.

   NOTHING USES `DESIGN` TODAY AND IT IS DECLARED ANYWAY, which is the one place
   this file argues with the Law of Subtraction and wins on the exception the
   law itself names. Without it, the first divergence that IS somebody's
   preference has only two boxes to go in, both of which say RESOLVED, and the
   ruling's whole distinction dies the day it is first tested. It is not an
   object on the glass; it is the boundary of a rule.                        */
const KINDS = ["HOLDINGS", "PROPERTY", "DESIGN"];
const RESOLVING = ["HOLDINGS", "PROPERTY"];

const JUSTIFIED = [
  {
    title: "The Name", only: "MGK-NIAC", closes: null,
    kind: "PROPERTY", holding: null,
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
    /* THE HOLDING DOES NOT EXIST IN THE LEDGER, AND THAT ABSENCE IS THE PROOF.
       There is no `doc.manual.niac` row because there is no NIAC manual. The
       day somebody declares one, this reason faults — which is the correct
       moment, because a declared row means the material is being catalogued. */
    kind: "HOLDINGS", holding: ["doc.manual.niac"],
    why:
      "A HOLDINGS GAP, STATED AS ONE. The museum holds an operating and "
      + "maintenance manual for the portable — ABEAL 8P-OMI-1 — and holds no "
      + "manual for the mainframe. Writing a NIAC manual face today would mean "
      + "inventing its sections, which is the failure Doctrine 12 exists for. The "
      + "day one arrives the face is a data block and this row goes.",
  },
  {
    title: "The Portal", only: "MGK-VIIIp", closes: "portal.feed.niac.1 / .2 arming — the mainframe running on the Portal",
    /* THE ONLY ONE OF THE THREE WHOSE HOLDING IS ALREADY A ROW. Both channels
       are engraved on the drum and NOT_BUILT; the day either arms, the mainframe
       has a Portal presence and a face about it stops being a face about
       nothing. `closes` said this in prose from the day R2 shipped — this is
       the same sentence, checkable. */
    kind: "HOLDINGS", holding: ["portal.feed.niac.1", "portal.feed.niac.2"],
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
    /* The holdings here are QUESTIONS, and a question is not a ledger row until
       somebody builds the face that answers it. `face.niac.faq` is therefore
       both the holding and the divergence's own end — which means the stale
       check would catch this one anyway, and it is named regardless, because a
       kind that is allowed to skip its own requirement is not a requirement. */
    kind: "HOLDINGS", holding: ["face.niac.faq"],
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

/* [P1] THE LEDGER IS READ, NOT RESTATED. `reveal/ledger.json` already knows
   what the museum holds and what state each thing is in; this asks it one
   question per holdings gap and keeps no copy of the answer. A row that is
   ABSENT, or present and NOT_BUILT, means the material is still not held —
   those are the same fact for this purpose and are treated as one, so a holding
   can be named before anybody has thought to catalogue it. */
const LEDGER = path.join(REPO, "reveal", "ledger.json");
const ledgerRows = new Map(
  JSON.parse(fs.readFileSync(LEDGER, "utf8")).rows.map(r => [r.id, r]));
function heldNow(id) {
  const r = ledgerRows.get(id);
  return !!r && r.build !== "NOT_BUILT";
}

const byTitle = new Map(JUSTIFIED.map(j => [j.title + "\0" + j.only, j]));
const faults = [];

/* THE JUSTIFICATION TABLE'S OWN SHAPE, checked before it is trusted to answer
   anything about the albums. */
for (const j of JUSTIFIED) {
  const at = `"${j.title}" (${j.only}-only)`;
  if (!KINDS.includes(j.kind)) faults.push(
    `UNCLASSED JUSTIFICATION — ${at} carries kind "${j.kind}".\n` +
    `    One of ${KINDS.join(" · ")}. The ruling turns on which: a HOLDINGS gap is\n` +
    "    RESOLVED, a DESIGN choice stays a standing flag, and an unclassed reason is\n" +
    "    the excuse this table exists to make impossible.");
  else if (j.kind === "HOLDINGS" && !(j.holding || []).length) faults.push(
    `HOLDINGS GAP WITH NO HOLDING — ${at} says the museum does not hold the\n` +
    "    material and names no ledger row that would exist if it did. A gap that\n" +
    "    cannot clear itself is a gap nobody will notice closing.");
  else if (j.kind !== "HOLDINGS" && (j.holding || []).length) faults.push(
    `${j.kind} JUSTIFICATION NAMING A HOLDING — ${at}.\n` +
    "    Only a HOLDINGS gap waits on material. A permanent property that names a\n" +
    "    delivery is a 'never' quietly rewritten as a 'not yet'.");
  else for (const id of (j.holding || [])) if (heldNow(id)) faults.push(
    `THE HOLDINGS ARRIVED — ${at} is justified as a holdings gap, and\n` +
    `    ${id} is built in reveal/ledger.json.\n` +
    "    The reason no longer holds: give the other machine the face, or write a\n" +
    "    different one. This is the ruling's own half — a holdings gap resolves a flag\n" +
    "    ON THE CONDITION that it clears itself when the holdings land.");
}

for (const d of divergences) {
  const j = byTitle.get(d.title + "\0" + d.only);
  d.j = j || null;
  d.resolved = !!j && RESOLVING.includes(j.kind);
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

const standing = divergences.filter(d => !d.resolved);
console.log(`\n  DIVERGENCES (${divergences.length}) — a yellow flag until somebody writes a reason:\n`);
for (const d of divergences) {
  const mark = d.resolved ? "✓ RESOLVED" : "▲ FLAG";
  console.log(`  ${mark}  "${d.title}" — on ${d.only}, not on ${d.missing}`
    + (d.j ? `  [${d.j.kind}]` : ""));
  if (d.j) {
    console.log(`      WHY: ${d.j.why}`);
    console.log(`      CLOSES WHEN: ${d.j.closes || "never — it is a property of the objects"}`);
    for (const id of (d.j.holding || []))
      console.log(`      HOLDING: ${id} — ${ledgerRows.has(id)
        ? `in the ledger, ${ledgerRows.get(id).build}`
        : "not a ledger row; the museum has nothing to catalogue"}`);
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
console.log(`PARITY: ${shared.length} shared · ${divergences.length} divergence(s) — `
  + `${divergences.length - standing.length} resolved · ${standing.length} standing flag(s) · 0 undeclared`);
console.log("  Every difference between the two machines has a reason in writing, and every");
console.log("  holdings gap names the ledger row that will end it.");
/* [P1] THE RULING, printed where somebody reading the report will meet it. It
   is not decoration: the whole point of the kind column is that a reader of
   this output can tell an answered difference from an excused one, and the
   sentence that makes that distinction should not live only in a header
   comment nobody scrolls to. */
if (!standing.length && divergences.length)
  console.log("\n  PARITY IS THE DEFAULT. A divergence is a yellow flag, and a flag justified in\n"
    + "  writing by a holdings gap is RESOLVED rather than overridden — NIAC's menu shows\n"
    + "  what NIAC has. When the holdings arrive the rows arrive with them.");
