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
     node tools/reveal-ledger.mjs --cards        R2: the cue-card checklist
     node tools/reveal-ledger.mjs --eggs         X1: what is planted, spent, waiting
     node tools/reveal-ledger.mjs --check        integrity; exits 1 on a fault
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { validate, manualPageRow, PROD, manualPages, manualSourceState, MANUAL_SRC_DIR } from "../reveal/schema.mjs";
import { entryFields as recordFields,
         recordShapeFaults } from "../reveal/record-entries.mjs";
import { entries as recordEntries, prose as recordProse,
         summaries as recordSummaries } from "../reveal/record-entries.mjs";
import { transferFaults, ASSIGN, EXEMPT, TRANSFERS, CLASSES } from "../reveal/transfers.mjs";
import { HELD_PREFIXES } from "../reveal/reachability.mjs";
/* [I2 2026-08-08] The two index-row budgets, declared once so the gate and the
   page Mike writes on read the same number. See RECORD BUDGETS below. */
import { RECORD_TITLE_MAX, RECORD_LINE_MAX } from "../reveal/record-shape.mjs";

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
  console.log(`  Record entries    : ${ROWS.filter(r => /^record\.\d+$/.test(r.id)).length}`);
  console.log(`  manual pages      : ${ROWS.filter(r => r.prod).length} of ${manualPages()}`);
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

/* ═══ [X1 2026-08-06] THE EGG SHEET ══════════════════════════════════════════
   MIKE: "make sure every egg and future idea is captured in a form we can
   consult later — I want to be able to ask WHAT DO WE HAVE SET UP FOR EGGS, and
   WHAT NEW IDEAS ARE WAITING. Verify the ledger already serves this and say so,
   or make it serve it."

   THE HONEST ANSWER IS: HALF, AND THE MISSING HALF WAS THE ASKING. Every egg in
   both repositories has been a row in `reveal/ledger.json` since v52 — fifteen
   of them now, each with what it is, whether it is BUILT, whether it is SHOWN,
   what it waits on, and for two of them THE EGG ITSELF, written down in the
   `note` and printed on no page anywhere. Nothing was missing from the table.
   What was missing is exactly what the surfacing report's own diagnosis was:
   `reveal`, `reveal:audit` and `reveal:cards` all already knew, and **none of
   them was ASKED**. An egg appeared in the audit's back shelf between a route
   and a sound effect, filed by whether it was revealed rather than by what it
   is, and there was no way to put his question to the tree in his own words.

   SO THIS COMPUTES NOTHING NEW. It re-cuts the same table by the one axis his
   question has — is this an egg, is it planted, is it spent — and it names, in
   the same breath, THE PLACE THE OTHER HALF OF HIS QUESTION LIVES: an idea that
   is not a revealable thing (a wording, a ruling, a photograph he owes, a room
   nobody has argued for yet) is not in this table and must not be dragged into
   it. That is `docs/OPEN_ACTIONS.md`, and the two together are the whole
   answer. A tool that quietly implied it held both would be worse than one that
   holds half and says so.

   THREE STATES, AND THE DIFFERENCE BETWEEN THE FIRST TWO IS THE WHOLE MODEL:
     PLANTED   built and HELD — it is there, right now, and nobody is told.
     SPENT     REVEALED — it is on the glass; whoever finds it, finds it.
     WAITING   not built — an idea with a row, which is what stops it becoming
               a thing somebody remembers hearing once.
   `shown` is printed beside each because it is the line between an egg and a
   debt: a thing whose LABEL a visitor can read is a promise, and an egg that is
   promised is not one. Every row in this table today is `shown: false`. */
function eggs() {
  const all = ROWS.filter(r => r.cls === "egg" && r.state !== "RETIRED");
  const planted = all.filter(r => r.state === "HELD" && r.build !== "NOT_BUILT");
  const spent = all.filter(r => r.state === "REVEALED");
  const waiting = all.filter(r => r.state === "HELD" && r.build === "NOT_BUILT");
  const show = (title, rows, gloss) => {
    console.log(`\n=== ${title} — ${rows.length} ===`);
    if (gloss) console.log("  " + gloss);
    rows.forEach(r => {
      console.log(`  ${r.id.padEnd(22)} ${String(r.build).padEnd(10)} ${r.shown ? "SHOWN " : "unshown"}  ${r.name}`);
      if (r.deps && r.deps.length) console.log(`${" ".repeat(24)}waits on: ${r.deps.join("; ")}`);
    });
    if (!rows.length) console.log("  (none)");
  };
  console.log("=== THE EGGS ===");
  console.log(`  ${all.length} rows in reveal/ledger.json, class "egg".`);
  show("PLANTED — built, held, nobody told", planted,
       "These exist in the tree today. Finding one is the visitor's job.");
  show("SPENT — on the glass", spent,
       "Out. Whoever finds them, finds them; nothing here is recoverable.");
  show("WAITING — an idea with a row, not built", waiting,
       "Ledgered so it is not a thing somebody remembers hearing once.");
  const held = all.filter(r => (r.note || "").length > 240);
  console.log(`\n=== EGGS WHOSE ONLY WRITTEN FORM IS THIS TABLE — ${held.length} ===`);
  console.log("  The `note` IS the egg. It is printed on no page, in either repository.");
  held.forEach(r => console.log(`  ${r.id.padEnd(22)} ${r.name}`));
  console.log("\n=== AND THE OTHER HALF OF THE QUESTION ===");
  console.log("  NEW IDEAS THAT ARE NOT REVEALABLE THINGS — a wording, a ruling, a");
  console.log("  photograph owed, a room nobody has argued for yet — are NOT in this");
  console.log("  table and are not going to be. They are in docs/OPEN_ACTIONS.md,");
  console.log("  §0 for what is waiting on Mike and §1–§4 for everything else.");
  console.log("  Two registers, one question: this one holds things the museum HAS");
  console.log("  and has not shown; that one holds decisions and work nobody has done.");
}

/* ═══ R2: THE CUE-CARD CHECKLIST ═══════════════════════════════════════════
   AUDIT §8b: "the scheduling half of this table is unusable without a way to
   fill it that is not editing a .mjs file. What Mike needs is ONE ROW AT A
   TIME, ONE QUESTION AT A TIME — the same one-question format Doctrine 12
   already specifies for gaps: here is a thing, here is what is known, what day
   does it come out."

   IT IS AN OPS INSTRUMENT. It is not a route, it never ships to a visitor, and
   it renders to a terminal — the same shape and the same reasoning as
   `assets:checklist`, which prints Mike's inspection list for the approval
   gate. A scheduling UI at a live address would be a museum surface whose
   subject is the making of the museum, which Doctrine 11 forbids on the glass.

   THE CARD ASKS ONE QUESTION AND SUPPLIES WHAT IS KNOWN, in Doctrine 12's own
   order: what it is · where it stands · what has to happen first · the blank.
   Mike answers as many as he wants, in any order, at his pace, and the answers
   come back as `when:` values in reveal/ledger-declare.mjs.

   THE DEFAULT DECK IS THE HELD ROWS WITH NO DATE, AND THAT IS NOT "EVERY
   UNDATED ROW". The first draft printed all 143 undated rows and it was wrong:
   93 of them are REVEALED — already on the glass — and asking what day
   something comes out when it came out months ago is a question with no honest
   answer. Nobody recorded those days and Doctrine 12 forbids inventing them.
   The deck is 49 cards, which is the same 49 the audit's §4 counts, and it is
   the pile where the absence actually bites.

   `--revealed` puts the released rows back for anyone backfilling history;
   `--all` drops the undated filter too, so a re-run reads as a progress sheet
   with the answered boxes ticked. */
function cards(filters) {
  let e = ROWS.filter(r => r.state !== "RETIRED");
  if (filters.cls) e = e.filter(r => r.cls === filters.cls);
  if (filters.spendable) e = e.filter(r => AUDIT.backShelf.includes(r));
  if (filters.record) e = e.filter(r => /^record\.\d+$/.test(r.id));
  if (!filters.all && !filters.revealed) e = e.filter(r => r.state === "HELD");
  if (!filters.all) e = e.filter(r => !r.when);

  const scope = [
    filters.cls && `class ${filters.cls}`,
    filters.spendable && "the back shelf — built and not revealed",
    filters.record && "Record entries only",
    filters.all ? "every row, dated or not"
      : filters.revealed ? "undated rows, held and revealed alike"
        : "HELD rows with no story date",
  ].filter(Boolean).join(" · ");

  console.log("# THE REVEAL SCHEDULE — CUE CARDS");
  console.log(`# ${scope}`);
  console.log(`# ${e.length} card(s). ${ROWS.filter(r => r.when).length} of ${ROWS.length} rows carry a date today.`);
  console.log("#");
  console.log("# One question per card, answerable in any order, at any pace. Nothing here");
  console.log("# blocks anything. An answer is a `when:` value in reveal/ledger-declare.mjs.\n");

  if (!e.length) {
    console.log(`  Nothing matched: ${scope}.`);
    console.log("  A checklist that matched nothing has not been completed — check the scope");
    console.log("  before reading this as done. `--all` prints every row in the table.");
    process.exit(1);
  }

  let cls = null;
  for (const r of e) {
    if (r.cls !== cls) { cls = r.cls; console.log(`\n──── ${cls.toUpperCase()} ────\n`); }
    console.log(`- [${r.when ? "x" : " "}] ${r.id}`);
    console.log(`      ${r.name}`);
    console.log(`      build: ${r.build} · state: ${r.state} · reach: ${r.reach || "— a visitor cannot"}`);
    if (r.shown) console.log("      A VISITOR CAN ALREADY READ ITS LABEL — this one is a promise, not a gap.");
    if (r.prod) console.log(`      production: ${r.prod}`);
    if (r.deps.length) r.deps.forEach((d, i) => console.log(`      ${i ? "           " : "needs first"} ${d}`));
    if (r.note) console.log(`      note: ${r.note}`);
    console.log(`      WHEN: ${r.when ? r.when : "________________________________"}\n`);
  }
}

/* ═══ R1: THE LEDGER MAY NOT HOLD THE RECORD'S WORDS ═══════════════════════
   Audit §8a's constraint, made a check instead of a warning. Two halves:
   `reveal/schema.mjs` refuses a row carrying a FIELD by the Record's names;
   this refuses a row carrying its SENTENCES.

   Six consecutive words is the threshold, plus any whole Record string of four
   words or more. Six is chosen against the failure it is for: a row that has
   started restating an entry restates a clause, and a clause is longer than
   five words. Shorter than six and ordinary English collides — "the unit is on
   the" would fire on half the robots wing. The whole-string rule catches the
   Record's short lines, which produce no six-word window at all. */
const NORM = s => String(s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
function shingles(s, n = 6) {
  const w = NORM(s).split(" ").filter(Boolean);
  const out = [];
  for (let i = 0; i + n <= w.length; i++) out.push(w.slice(i, i + n).join(" "));
  return out;
}
function recordProseFaults() {
  const faults = [];
  const prose = recordProse();
  const shin = new Set(prose.flatMap(s => shingles(s)));
  const whole = prose.map(NORM).filter(s => s.split(" ").length >= 4);
  for (const r of ROWS) {
    const text = [r.name, r.note, r.reach, r.where, ...r.deps].join("  ");
    const hit = shingles(text).find(s => shin.has(s))
      || whole.find(w => (" " + NORM(text) + " ").includes(" " + w + " "));
    if (hit) faults.push(
      `${r.id}: holds the Record's own words — "${hit}".\n` +
      "    The ledger says whether a thing is reachable; the Record says what it is.\n" +
      "    The moment both hold the same sentence they can disagree (audit §8a).");
  }
  return faults;
}

/* ═══ [E2 2026-08-09] A NOTE TO OPS IS NOT STORY, AND IT IS REFUSED HERE ════
   MIKE: *"Anything inside { } is a note to Ops, not story. They are written
   inline where he writes them, they stay in his working copy, and OPS ACTS ON
   THEM when it picks up the package. They must never reach a visitor."*

   THIS IS THE HALF THAT RUNS ON EVERY PACKET. The other half is
   `wb-ops-braces` in `vite.config.js`, which refuses a LAUNCH build on a brace
   in any string literal under `src/`. This one is narrower and earlier: it walks
   the RECORD, which is the one surface his notes are actually written on, and it
   fails the packet rather than waiting for a launch that may be months away. A
   note carried into `robots.js` by mistake is caught the same day.

   `prose()` is the right reader for it: it already sees every sentence in the
   Record, with `+` concatenations folded, and folding matters — a note split
   across two source lines would be invisible to a plain grep for `{`. */
function recordNoteFaults() {
  const faults = [];
  for (const s of recordProse()) {
    for (const m of s.match(/\{[^{}]*\}/g) || []) {
      faults.push(
        `the Record carries a note to Ops in the data: ${m}\n` +
        `    in: "${s.length > 120 ? s.slice(0, 117) + "…" : s}"\n` +
        "    Curly braces are Mike writing to Ops, never story. Act on the note and\n" +
        "    take it out of the entry; it stays in his working copy\n" +
        "    (docs/dictation-20260807/record-draft.json), which is where he wrote it.");
    }
  }
  return faults;
}

/* ═══ R1: THE ROWS AND THE ENTRIES ARE THE SAME SET ════════════════════════
   The rows are derived, so they cannot drift — unless somebody hand-edits
   ledger.json, which the README forbids and nothing enforced until now. It
   also catches the reverse: a rebuild that silently dropped an entry. */
function recordParityFaults() {
  const faults = [];
  const inData = new Set(recordEntries().map(e => e.no).filter(n => n != null)
    .map(n => "record." + String(n).padStart(3, "0")));
  const inLedger = new Set(ROWS.filter(r => /^record\.\d+$/.test(r.id)).map(r => r.id));
  for (const id of inData) if (!inLedger.has(id))
    faults.push(`${id}: the Record holds this entry and the ledger has no row for it — run \`npm run reveal:build\`.`);
  for (const id of inLedger) if (!inData.has(id))
    faults.push(`${id}: a row for a Record entry that is not in the data.`);
  return faults;
}

/* ═══ R3: THE MANUAL-PAGE VESSEL, PROVED WITH NOTHING SHIPPED ══════════════
   The vessel is built and deliberately empty — the story has not asked for a
   page. An empty container that nobody has exercised is C7's shape (the
   Record's inline doors, built at v45, exercised by nothing since), so the
   vessel is proved HERE: specimens at all four production stages are built,
   validated against the real table, and thrown away. Nothing is written, and no
   page of the manual is invented to achieve it.

   The negative half matters more than the positive half: a vessel that accepts
   a page the manual does not have, or a caller that does not exist, is not a
   vessel. Each refusal is asserted to actually refuse.

   THE EXPECTED VALUES ARE WRITTEN OUT HERE AS LITERALS, and the first draft of
   this function did not do that — it compared the vessel's output against
   `BUILD_FOR_PROD`, which is the table the vessel derives FROM. That test could
   not fail: corrupting the mapping corrupted the expectation with it, and a
   deliberate break of `photographed → PARTIAL` was run through it and reported
   PASS. A self-test that reads its answer out of the thing under test is not a
   test, and this one was one until it was broken on purpose to find out. The
   stage names are asserted too, so renaming one in schema.mjs surfaces here
   rather than silently reducing the loop's coverage. */
function vesselFaults() {
  const faults = [];

  /* [T1 2026-08-05] THE SOURCE TREE IS CHECKED ONCE, BEFORE ANY SPECIMEN.
     Without this the function threw on its first UNGUARDED specimen and
     `reveal:check` reported a Node stack trace instead of a fault — which is
     exactly what it did, unnoticed, from robots 4cd78ac (16:14) onward. A gate
     that crashes is not a gate: it cannot tell you the one thing it exists to
     tell you. With no renders to point at the specimens cannot run at all, so
     this names the real fault once and stops. */
  if (manualSourceState() === "no-source") {
    faults.push(
      `vessel: the manual's source renders are GONE — ${MANUAL_SRC_DIR} no longer\n` +
      "    exists in the robots repo. This is NOT a missing page; it is the document's\n" +
      "    whole tree having moved out from under this repository, which is what happened\n" +
      "    once before (robots 4cd78ac retired manual/pages under a path museum v55 had\n" +
      "    wired in three hours earlier, and the gate died on a stack trace rather than\n" +
      "    reporting it). Find where the generator now writes its pages and repoint\n" +
      "    MANUAL_SRC in reveal/schema.mjs. THE PAGE COUNT NEEDS NO EDIT — it is derived\n" +
      "    from this directory, by Mike's rule that the manual is as long as the manual\n" +
      "    needs to be.");
    return faults;
  }
  if (!manualPages())
    faults.push(
      `vessel: ${MANUAL_SRC_DIR} exists and holds no page-NN.png at all. The path is\n` +
      "    right and the document is empty, which no ledger row can be written against.");

  /* [G1 2026-08-05] `fault` IS PART OF THE EXPECTATION NOW, AND THAT IS THE
     TRANSFER RULE REACHING THE VESSEL RATHER THAN A DEFECT IN IT. A manual page
     is PACKAGE (transfers.mjs PATTERNS), PACKAGE has no named arrival week until
     T-B is answered, and check (b) says a row with no named arrival may not be
     REVEALED. So a PLACED page — one that is a frame in the reader — cannot
     validate today, and the honest test is to require exactly that one fault
     rather than to exempt the specimen from the rule. The day Mike names the
     four Fridays this expectation flips to null and the vessel is unchanged. */
  const EXPECT = {
    needed: { build: "NOT_BUILT", state: "HELD", reachable: false, fault: null },
    printed: { build: "NOT_BUILT", state: "HELD", reachable: false, fault: null },
    photographed: { build: "PARTIAL", state: "HELD", reachable: false, fault: null },
    placed: { build: "LIVE", state: "REVEALED", reachable: true,
      fault: "has no named arrival week" },
  };
  if (PROD.join(",") !== Object.keys(EXPECT).join(","))
    faults.push(`vessel: the production stages are ${PROD.join(" · ")}, and this test covers ${Object.keys(EXPECT).join(" · ")}.`);
  const flat = spec => ({
    id: spec.id, name: spec.name, cls: spec.cls, where: spec.where,
    build: spec.build, reach: spec.reach, state: spec.state,
    when: spec.extra.when ?? null, deps: spec.extra.deps || [], arc: null,
    shown: spec.extra.shown === true, assets: spec.extra.assets || [],
    prod: spec.extra.prod, calledBy: spec.extra.calledBy || [], note: spec.extra.note || "",
  });

  for (const prod of PROD) {
    const want = EXPECT[prod];
    if (!want) continue;                       // reported above
    let row;
    try {
      row = flat(manualPageRow(7, {
        prod, calledBy: ["record.013"],
        assets: prod === "placed" ? ["/robots/manual/working-copy-p1.png"] : [],
      }));
    } catch (err) {
      faults.push(`vessel: page 7 at "${prod}" would not build — ${err.message}`);
      continue;
    }
    if (row.build !== want.build)
      faults.push(`vessel: "${prod}" derived build ${row.build}, expected ${want.build}`);
    if (row.state !== want.state)
      faults.push(`vessel: "${prod}" derived state ${row.state}, expected ${want.state}`);
    if (Boolean(row.reach) !== want.reachable)
      faults.push(`vessel: "${prod}" reach is ${row.reach} — only a placed page is reachable`);
    const bad = validate([...ROWS, row]).filter(f => f.startsWith(row.id));
    if (!want.fault && bad.length)
      faults.push(`vessel: a valid "${prod}" page fails validation — ${bad[0]}`);
    if (want.fault && !bad.some(f => f.includes(want.fault)))
      faults.push(
        `vessel: a "${prod}" page did NOT fault on "${want.fault}".\n` +
        "    A page in the reader is a photograph of paper somebody is holding, so it is\n" +
        "    PACKAGE, and no package has a named arrival week until T-B is answered.");
    if (want.fault && bad.length > 1)
      faults.push(`vessel: a "${prod}" page faults on more than the arrival week — ${bad.join(" | ")}`);
  }
  /* the transfer class really is reaching the vessel's rows */
  if (validate([...ROWS, flat(manualPageRow(7, {}))])
    .some(f => f.startsWith("doc.manual.page.07") && f.includes("no transfer class")))
    faults.push("vessel: a manual page fell through the transfer table — the PACKAGE pattern is not matching.");

  /* the refusals */
  const refuses = (what, fn) => {
    try { fn(); faults.push(`vessel: it accepted ${what} — that refusal is the point of it.`); }
    catch { /* refused, as it must */ }
  };
  refuses(`page ${manualPages() + 1}, which the manual does not have`,
    () => manualPageRow(manualPages() + 1, {}));
  refuses("page 0", () => manualPageRow(0, {}));
  refuses("an unknown production stage", () => manualPageRow(7, { prod: "scanned" }));

  const called = flat(manualPageRow(7, { calledBy: ["record.999"] }));
  if (!validate([...ROWS, called]).some(f => f.includes("record.999")))
    faults.push("vessel: a page called for by an entry that does not exist passed validation.");

  const placed = flat(manualPageRow(7, { prod: "placed" }));   // no assets
  if (!validate([...ROWS, placed]).some(f => f.startsWith(placed.id)))
    faults.push("vessel: a page placed in the reader with no photograph passed validation.");

  const notAPage = { ...ROWS.find(r => r.id === "doc.manual"), prod: "needed" };
  if (!validate([...ROWS.filter(r => r.id !== "doc.manual"), notAPage])
    .some(f => f.includes("not a manual page")))
    faults.push("vessel: `prod` was accepted on a row that is not a manual page.");

  return faults;
}

/* ═══ T1: THE TRANSFER RULE ACTUALLY REFUSES ═══════════════════════════════
   The live ledger passes the transfer rule, and a rule that has only ever been
   run against data that satisfies it has not been tested — that is the lesson
   the manual-page vessel paid for above, applied to a second guard rather than
   re-learned. Each of the four refusals is provoked with a synthetic row and
   asserted to fire. Nothing is written; the specimens are thrown away.

   THE SPECIMENS BORROW REAL IDS ON PURPOSE. Using a made-up id everywhere
   would only ever test the "unplaced" branch; taking `phys.cases` (a real
   PACKAGE row) and flipping its state to REVEALED is the failure this rule
   exists to catch — somebody putting a photograph on the glass before the box
   arrived. The expectations are literal strings, not values read back out of
   transfers.mjs, so corrupting the table cannot corrupt the expectation. */
function transferGuardFaults() {
  const faults = [];
  const one = (id, patch) => ({ ...ROWS.find(r => r.id === id), ...patch });
  const fires = (what, rows, want) => {
    const hit = transferFaults(rows).some(f => f.includes(want));
    if (!hit) faults.push(`transfers: ${what} did not fault — that refusal is the point of it.`);
  };

  /* (a) every row is placed or exempted, in writing */
  fires("a row with no class and no exemption",
    [...ROWS, { ...ROWS[0], id: "zz.unplaced", state: "HELD" }],
    "no transfer class and no exemption");

  /* (b) nothing unarrived is on the glass — the load-bearing one */
  fires("a PACKAGE row put on the glass",
    [one("phys.cases", { state: "REVEALED" })],
    "has no named arrival week");
  fires("a TRANSMISSION row put on the glass",
    [one("doc.ads", { state: "REVEALED" })],
    "has no named arrival week");
  fires("an EXEMPT row put on the glass",
    [one("tool.reveal", { state: "REVEALED" })],
    "exemption covers what is NOT shown");

  /* (c) nothing is shown before it lands */
  fires("a row revealed in a week before its material arrived",
    [one("doc.manual", { when: -1 })],
    "arrival is week 0");

  /* the drift guards, which are what keep the table honest under a rename */
  if (!transferFaults([]).some(f => f.includes("is assigned a transfer class and is not a ledger row")))
    faults.push("transfers: an assignment naming a row that does not exist did not fault.");
  if (!transferFaults([]).some(f => f.includes("is exempted and is not a ledger row")))
    faults.push("transfers: an exemption naming a row that does not exist did not fault.");

  /* and the live table really is exhaustive: no row falls through */
  const unplaced = ROWS.filter(r => !ASSIGN.has(r.id) && !EXEMPT.has(r.id));
  if (unplaced.length)
    faults.push(`transfers: ${unplaced.length} row(s) fall through the table — ${unplaced.map(r => r.id).join(", ")}`);

  return faults;
}

/* ═══ RECORD BUDGETS [R3 2026-08-06] ═════════════════════════════════════════
   THE NUMBERS AND THE WHOLE OF THEIR REASONING MOVED TO `reveal/record-shape.mjs`
   ON 2026-08-08 AND THIS IS A POINTER, NOT A SUMMARY OF THEM. [I2] They were
   module-private constants here, which meant the page Mike WRITES the strings
   on could not read them — it had to retype them or say nothing, and it said
   nothing, so he composed a 477-character executive summary against a
   130-character row and found out three rounds later from a gate.

   Two halves enforced a budget after the writing (a row that cannot truncate,
   and this check, which refuses one that would overflow). The third half is the
   counter on the worksheet, and a counter that carries its own copy of a number
   is a budget that quietly stops agreeing with its gate. One declaration, three
   readers. Read that file for how 62 and 130 were measured. The import is at
   the head of this file with the others. */

function recordBudgetFaults() {
  const out = [];
  for (const e of recordSummaries()) {
    const who = "Record " + (e.no == null ? "(unnumbered)" : String(e.no).padStart(3, "0"));
    if (typeof e.title === "string" && e.title.length > RECORD_TITLE_MAX) {
      out.push(`${who}: headline is ${e.title.length} characters and the index row `
        + `holds ${RECORD_TITLE_MAX} on one line — shorten it. `
        + `Nothing truncates any more, so it would overflow the row.`);
    }
    if (typeof e.line === "string" && e.line.length > RECORD_LINE_MAX) {
      out.push(`${who}: executive summary is ${e.line.length} characters and the index row `
        + `holds ${RECORD_LINE_MAX} on two lines — shorten it. `
        + `A summary that does not fit is not a summary (Mike, R3).`);
    }
    /* [L1 2026-08-09] TWO ENTRIES ARE HEADLINE-LESS BY MIKE'S OWN INSTRUCTION,
       AND THEY ARE EXEMPTED BY NAME RATHER THAN BY A LOOSENED RULE.
       "Days 4 and 5 have only executive summaries - land what exists... do not
       fill a gap." He wrote no headline for either, and inventing one is the
       edit the whole verbatim discipline refuses. The rule stands for every
       other entry — a blanket allowance here would turn R3's "every index row
       gets one" into a suggestion, and the next headline-less entry would land
       in silence. These two are listed, so a THIRD one still fails.
       WHAT IT COSTS, STATED: both draw an index row with no headline until he
       writes one. That is visible on the glass rather than hidden, which is the
       point of landing them. Register row `L-c`. */
    const HEADLINE_EXEMPT = new Set([4, 5]);
    if ((typeof e.title !== "string" || !e.title.trim()) && !HEADLINE_EXEMPT.has(e.no)) {
      out.push(`${who}: no headline. Every index row gets one.`);
    }
  }
  return out;
}

/* ═══ [A1 2026-08-08] NOTHING DROPS SILENTLY EVER AGAIN ═════════════════════
   Mike's ruling on D-b, made structural. S-c was three payload fields the
   long-form renderer did not draw and did not report; the fields are drawn now
   (`RecordAttachments.jsx`), and this is the half that survives the next field
   somebody adds.

   THE LIST IS OF WHAT IS DRAWN, NOT OF WHAT IS ALLOWED. Every name below is
   read by a renderer today, and the two that are not are marked with the reason
   they are exempt. Add a field to an entry without teaching something to draw
   it and the packet is refused, by name.

   IT DOES NOT KNOW WHERE A FIELD DRAWS, only that something does — a gate that
   tried to prove placement would be a second renderer. */
const DRAWN_ENTRY_FIELDS = new Set([
  /* the head */
  "no", "date", "stamp", "title", "line", "lead",
  /* the body */
  "sections", "tomb", "note",
  /* the hook */
  "still", "stillCaption",
  /* the payloads — attachments, at the foot, since A1 */
  "wire", "plates", "docs",
  /* DECLARED AND DELIBERATELY UNDRAWN, each with its ruling:
     `evidence` — R5, Mike struck the badge it printed ("I see no richness in
     it"); the field survives in his own model and comes back the day it points
     at something. record-model.js says so at length. */
  "evidence",
]);

function recordFieldFaults() {
  const out = [];
  for (const e of recordFields()) {
    const who = "Record " + (e.no == null ? "(unnumbered)" : String(e.no).padStart(3, "0"));
    for (const k of e.keys) {
      if (DRAWN_ENTRY_FIELDS.has(k)) continue;
      out.push(`${who}: declares \`${k}\`, and nothing renders it. `
        + `Either draw it (RecordEntry.jsx / RecordAttachments.jsx) or, if it is `
        + `deliberately undrawn, add it to DRAWN_ENTRY_FIELDS with the ruling. `
        + `"Nothing drops silently ever again" (Mike, 2026-08-08).`);
    }
  }
  return out;
}

function check() {
  const faults = [
    ...validate(ROWS),
    ...recordProseFaults(),
    ...recordNoteFaults(),
    ...recordParityFaults(),
    ...recordBudgetFaults(),
    ...recordFieldFaults(),
    /* ═══ [2026-08-11] THE OTHER HALF OF "NOTHING DROPS SILENTLY" ════════════
       `recordFieldFaults` above asks *does a renderer draw this field*. This
       asks *can the reader Mike's editor is seeded from actually READ it* —
       and the two are not the same question, which is what Record 013 proved:
       the museum drew its four paragraphs and the reader saw an empty list,
       because the body was written as a string and the reader only understood
       a list. Nothing was wrong on the glass and nothing was wrong in the data.
       IT IS SCOPED TO SHAPES AND NOT TO CONTENT. A fault here means a field
       exists in the Record that some reader would silently turn into nothing.
       See `paragraphsOf` in reveal/record-entries.mjs. */
    ...recordShapeFaults(),
    ...vesselFaults(),
    ...transferGuardFaults(),
  ];

  /* the join to the asset table, which is the whole reason C32 was fixed */
  const table = JSON.parse(fs.readFileSync(path.join(REPO, "provenance", "asset-table.json"), "utf8"));
  const uids = new Set(table.entries.map(e => e.uid));
  for (const r of ROWS) for (const u of r.assets) {
    if (!uids.has(u)) faults.push(`${r.id}: asset uid ${u} is not in the asset table`);
  }

  if (faults.length) {
    faults.forEach(f => console.error("  " + f));
    console.log(`\nCHECK: FAIL — ${faults.length} fault(s)`);
    process.exit(1);
  }
  console.log("CHECK: PASS");
  console.log("  every row is internally consistent");
  console.log("  every asset uid resolves in the asset table");
  console.log(`  the ${ROWS.filter(r => /^record\.\d+$/.test(r.id)).length} Record row(s) match the Record's own entries exactly`);
  console.log("  no row holds the Record's words — the ledger is not a second copy of it");
  /* [2026-08-11] THE COUNT IS PRINTED, AND THE REASON IS THAT THIS LINE LIED.
     `summaries()` had been left behind by the entries split and returned an
     empty array, so this check iterated nothing and printed its sentence
     anyway — a pass on zero rows is indistinguishable from a pass on six. The
     number is the cheapest possible guard against the same thing happening the
     next time a reader is repointed. */
  console.log(`  all ${recordSummaries().length} Record headlines fit ${RECORD_TITLE_MAX} characters and every summary ${RECORD_LINE_MAX} — the index cannot truncate, so it must not overflow`);
  console.log("  every field a Record entry declares can be READ by the editor's own parser — no shape turns into nothing");
  /* [H1/H2 2026-08-06] A PASS THAT DOES NOT SAY WHAT IT PROVED IS A PASS
     NOBODY RE-READS. The two rules added this round are both about the tree
     rather than the table, so they are the two a future session is most likely
     to assume are still running. */
  console.log(`  every HELD row is unreachable — no reach, no public file, and the ${HELD_PREFIXES.length} held prefixes are still refused by the worker and routed to it`);
  console.log("  nothing publishes until the Record delivers it — every picture of the objects is delivered or behind the door, in writing");
  console.log("  every field a Record entry declares is drawn by something — nothing drops silently");
  console.log("  the manual-page vessel builds, derives and refuses correctly at all four stages");
  console.log(`  the manual is ${manualPages()} pages, read off ${MANUAL_SRC_DIR} rather than declared`);
  process.exit(0);
}

const argv = process.argv.slice(2);
const flag = n => argv.includes("--" + n);
const opt = n => { const i = argv.indexOf("--" + n); return i >= 0 ? argv[i + 1] : null; };
if (flag("check")) check();
else if (flag("audit")) audit();
else if (flag("eggs")) eggs();
else if (flag("cards")) cards({
  all: flag("all"), revealed: flag("revealed"), spendable: flag("spendable"),
  record: flag("record"), cls: opt("cls"),
});
else report();
