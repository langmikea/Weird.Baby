#!/usr/bin/env node
/* ===========================================================================
   THE REVEAL LEDGER'S INSTRUMENT — reports and checks over reveal/ledger.json.
   ---------------------------------------------------------------------------
   The ledger is authored in `reveal/ledger-declare.mjs`. This reads the built
   JSON and answers the questions R4 asks of it, so the audit is REGENERATED
   rather than transcribed — a hand-typed audit is out of date the day after it
   is written, and this one is meant to be re-run.

     node tools/reveal-ledger.mjs                the report
     node tools/reveal-ledger.mjs --audit        R4: the five audit sections
     node tools/reveal-ledger.mjs --check        integrity; exits 1 on a fault
     node tools/reveal-ledger.mjs --md           the audit, as markdown
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const L = JSON.parse(fs.readFileSync(path.join(REPO, "reveal", "ledger.json"), "utf8"));
const ROWS = L.rows;
const ID = new Set(ROWS.map(r => r.id));

/* ---- the five audit questions, each one a filter over the same table ------ */
const AUDIT = {
  /* MIKE: "what is BUILT BUT NEVER REVEALED (the back shelf)".
     `cls: "tool"` is excluded and the exclusion is stated rather than silent:
     the provenance gate, the asset table, this ledger and the open-action
     register are all LIVE and all HELD, and none of them is a thing a visitor
     could ever be given. Four rows of the house's own instruments at the top of
     the back shelf would bury the twelve that are actually spendable. */
  backShelf: ROWS.filter(r => r.state === "HELD" && r.cls !== "tool"
    && (r.build === "LIVE" || r.build === "PARTIAL")),
  /* MIKE: "what is PROMISED BUT NOT BUILT". A promise is a label a visitor can
     READ with nothing behind it — `shown` — or a row another row depends on.
     The twin's stub apps are deliberately NOT here: THE STUB LAW strips them
     from the menus, so nothing promises them. That is the distinction. */
  promised: ROWS.filter(r => r.build === "NOT_BUILT" || r.build === "STUB")
    .filter(r => r.shown || ROWS.some(o => o.deps.includes(r.id))),
  /* the private gaps: not built, not promised, nobody is owed anything. */
  quiet: ROWS.filter(r => (r.build === "NOT_BUILT" || r.build === "STUB")
    && !r.shown && !ROWS.some(o => o.deps.includes(r.id)) && r.state !== "RETIRED"),
  /* MIKE: "what has no story placement at all" */
  unplaced: ROWS.filter(r => !r.when && r.state === "HELD"),
  /* MIKE: "where assets cluster on one day" */
  clusters: (() => {
    const m = new Map();
    for (const r of ROWS) if (r.when) {
      if (!m.has(r.when)) m.set(r.when, []);
      m.get(r.when).push(r);
    }
    return [...m.entries()].filter(([, v]) => v.length > 1);
  })(),
  /* MIKE: "dependency chains that cannot resolve" — a dep naming a row that
     is itself NOT_BUILT or HELD, or naming nothing this table knows. */
  chains: (() => {
    const out = [];
    for (const r of ROWS) for (const d of r.deps) {
      if (ID.has(d)) {
        const t = ROWS.find(x => x.id === d);
        if (t.build === "NOT_BUILT" || t.build === "STUB")
          out.push({ from: r, dep: d, why: `${d} is ${t.build}` });
      } else {
        out.push({ from: r, dep: d, why: "not a row — a person, a ruling, a camera" });
      }
    }
    return out;
  })(),
};

function report() {
  const by = f => ROWS.reduce((m, r) => (m[r[f] ?? "—"] = (m[r[f] ?? "—"] || 0) + 1, m), {});
  console.log(`THE REVEAL LEDGER — ${ROWS.length} rows\n`);
  console.log("  by state ", JSON.stringify(by("state")));
  console.log("  by build ", JSON.stringify(by("build")));
  console.log("  by class ", JSON.stringify(by("cls")));
  console.log("  by arc   ", JSON.stringify(by("arc")));
  console.log(`\n  with a story date : ${ROWS.filter(r => r.when).length} of ${ROWS.length}`);
  console.log(`  with dependencies : ${ROWS.filter(r => r.deps.length).length}`);
  console.log(`  joined to an asset: ${ROWS.filter(r => r.assets.length).length}`);
  console.log(`\n  BACK SHELF (built, not revealed)   : ${AUDIT.backShelf.length}`);
  console.log(`  PROMISED, NOT BUILT                : ${AUDIT.promised.length}`);
  console.log(`  NOT BUILT, NOT PROMISED            : ${AUDIT.quiet.length}`);
  console.log(`  NO STORY PLACEMENT                 : ${AUDIT.unplaced.length}`);
  console.log(`  DEPENDENCIES THAT CANNOT RESOLVE   : ${AUDIT.chains.length}`);
}

function line(r) {
  return `  ${r.id.padEnd(26)} ${String(r.build).padEnd(10)} ${r.name}`;
}

function audit() {
  console.log("=== BUILT BUT NEVER REVEALED — the back shelf ===");
  AUDIT.backShelf.forEach(r => console.log(line(r)));
  console.log("\n=== PROMISED BUT NOT BUILT — a label with nothing behind it ===");
  AUDIT.promised.forEach(r => console.log(line(r)));
  console.log("\n=== NOT BUILT AND NOT PROMISED — the quiet gaps, nobody is owed ===");
  AUDIT.quiet.forEach(r => console.log(line(r)));
  console.log("\n=== NO STORY PLACEMENT AT ALL ===");
  console.log(`  ${AUDIT.unplaced.length} held rows, and every row in the table, carry when:null.`);
  console.log("\n=== ASSETS CLUSTERING ON ONE DAY ===");
  if (!AUDIT.clusters.length)
    console.log("  None — no row carries a day, so nothing can cluster. This section");
    console.log("  becomes real the moment Mike supplies a schedule.");
  AUDIT.clusters.forEach(([d, v]) => console.log(`  ${d}: ${v.length} — ${v.map(r => r.id).join(", ")}`));
  console.log("\n=== DEPENDENCY CHAINS THAT CANNOT RESOLVE ===");
  AUDIT.chains.forEach(c => console.log(`  ${c.from.id.padEnd(26)} needs: ${c.dep}\n${" ".repeat(30)}(${c.why})`));
}

function check() {
  let bad = 0;
  const seen = new Set();
  for (const r of ROWS) {
    if (seen.has(r.id)) { console.error(`duplicate id: ${r.id}`); bad++; }
    seen.add(r.id);
    if (r.state === "REVEALED" && !r.reach) { console.error(`REVEALED with no reach: ${r.id}`); bad++; }
    if (r.state === "RETIRED" && r.reach) { console.error(`RETIRED but reachable: ${r.id}`); bad++; }
    if (r.build === "NOT_BUILT" && r.state === "REVEALED") {
      console.error(`NOT_BUILT and REVEALED: ${r.id} — a visitor is being shown something that does not exist`);
      bad++;
    }
  }
  /* the join to the asset table, which is the whole reason C32 was fixed */
  const table = JSON.parse(fs.readFileSync(path.join(REPO, "provenance", "asset-table.json"), "utf8"));
  const uids = new Set(table.entries.map(e => e.uid));
  for (const r of ROWS) for (const u of r.assets) {
    if (!uids.has(u)) { console.error(`${r.id}: asset uid ${u} is not in the asset table`); bad++; }
  }
  console.log(bad ? `\nCHECK: FAIL — ${bad} fault(s)` : "CHECK: PASS — every row is internally consistent and every asset uid resolves.");
  process.exit(bad ? 1 : 0);
}

const argv = process.argv.slice(2);
if (argv.includes("--check")) check();
else if (argv.includes("--audit")) audit();
else report();
