#!/usr/bin/env node
/* ===========================================================================
   THE SURFACING REPORT — what this museum holds and has never shown anybody.
   [R7 2026-08-05]
   ---------------------------------------------------------------------------
   MIKE'S GAP, in his words:

     "Every exhibit needs a RHYTHM OF SURFACING, plus periodic SHORTS, to keep
      asset utilization honest — right now assets get built and sit and nothing
      asks what has not been shown. The reveal ledger's back-shelf list is
      exactly that question with nobody scheduled to read it."

   ═══ THE DIAGNOSIS, WHICH IS SHARPER THAN "WE NEED A REPORT" ═══════════════
   Three instruments in this repo already know the answer and NONE OF THEM IS
   ASKED. `reveal:audit` computes the back shelf and prints it inside four other
   sections. `assets:scan` computes `role: "unreferenced"` and prints it under a
   heading nobody greps for. `reveal:cards` prints 49 questions and waits.
   The missing thing was never a measurement. It was A NUMBER SOMEBODY LOOKS AT
   ON A RHYTHM, AND A RECORD OF WHAT IT WAS LAST TIME.

   ═══ SO THIS IS THE CHEAPEST HONEST VERSION, AND EACH WORD IS LOAD-BEARING ══
   CHEAPEST: it computes nothing new. It reads `reveal/ledger.json` and
   `provenance/asset-table.json` and re-cuts them BY WING, which is the cut the
   existing reports do not make and the only cut a person can act on — "the
   museum has twelve spendable things" is not a decision, "the robots wing has
   nine and Worth A Listen has none" is.
   HONEST: it counts and it does not schedule. There is no CI in this project
   and deploys are manual (OPERATIONS.md §2), so a cron that nobody runs would
   be a mechanism that claims a rhythm it does not have. THE RHYTHM IS THE
   PACKET: this runs at session close beside the other gates, which is the only
   clock this repo actually has.
   AND IT REMEMBERS. `--log` appends one dated line per run to
   docs/SURFACING_LOG.md. That is what turns a number into a trend and the
   trend is the whole point: a wing whose spendable count only ever goes UP is
   a wing that is building and not showing, which is the exact sentence Mike
   asked for a mechanism to be able to say.

   ═══ WHAT IT DELIBERATELY DOES NOT DO ══════════════════════════════════════
   IT DOES NOT PICK WHAT COMES OUT NEXT. Ranking the back shelf would be Ops
   scheduling the story, and every `when:` in the ledger is null by Doctrine 12
   because Mike has not supplied one. The report hands him the shelf; the cue
   cards (`reveal:cards`) are where an answer goes.
   IT DOES NOT COUNT SHORTS, and cannot. A short is a CUT, the storyboard
   doctrine and the cutting both live in the robots repo, and nothing in this
   repository can see whether one was made. The report says so in its own
   output rather than printing a zero that would read as "none were made".
   IT IS NOT A GATE. Nothing here can fail: an unshown thing is not a defect,
   it is inventory. `--gate` does not exist on purpose.

     node tools/surfacing.mjs             the report
     node tools/surfacing.mjs --log       ...and append one line to the log
     node tools/surfacing.mjs --wing robots
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const LOG = path.join(REPO, "docs", "SURFACING_LOG.md");

const L = JSON.parse(fs.readFileSync(path.join(REPO, "reveal", "ledger.json"), "utf8"));
const T = JSON.parse(fs.readFileSync(path.join(REPO, "provenance", "asset-table.json"), "utf8"));

/* ═══ THE WINGS ═════════════════════════════════════════════════════════════
   A ledger row does not carry a wing, so one is derived from its id. The table
   is ordered and first-match wins; a row matching nothing is a FAULT and not a
   default bucket, because a catalogue's failure mode is silence and an "other"
   pile is silence with a label on it.

   TWO KINDS ARE OUT OF SCOPE AND SAY SO. `tool.*` are the house's own
   instruments — Doctrine 11 keeps them off the glass permanently, so they can
   never be surfaced and four permanently-unspendable rows at the top of a back
   shelf would bury the ones that are real. `retired.*` were struck. Both
   exclusions are the same ones `reveal:audit` already makes, stated here again
   rather than inherited quietly.                                            */
const WINGS = [
  [/^(tool|retired)\./, null],
  [/^route\.(hr|preset|catchall|money|lobby|booth|foundation|shop|robots|wal|wb|admin)/, "The museum's own doors"],
  [/^(face|portal|twin|egg|sound|doc|phys|record)\./, "Weird.Baby Robots"],
  [/^wal\./, "Other Music Worth a Listen"],
  [/^shop\./, "The Gift Shop"],
  [/^channel\./, "The Foundation"],
];
function wingOf(id) {
  for (const [re, w] of WINGS) if (re.test(id)) return w;
  return undefined;                          // undefined = fault; null = excluded
}

const rows = L.rows;
const unplaced = rows.filter(r => wingOf(r.id) === undefined);

/* SPENDABLE — the only count in this report that is a decision rather than a
   description. Built (LIVE or PARTIAL) and HELD: the thing exists, it works,
   and nobody has been given it. Releasing one costs a sentence and no work.
   It is the same predicate `reveal:audit`'s back shelf uses; the difference is
   that this one is per wing and remembered. */
const spendable = r => r.state === "HELD" && (r.build === "LIVE" || r.build === "PARTIAL");
/* PROMISED — a label a visitor can read with nothing behind it. Not spendable:
   these need building, not scheduling, and mixing them into one number is how
   "we have twelve things ready" quietly becomes false. */
const promised = r => r.shown && (r.build === "NOT_BUILT" || r.build === "STUB");

/* ASSETS THAT ARE BUILT AND SITTING. The asset table's own answer to the same
   question, one layer down: a file in the tree that no source references. It is
   NOT the same set as the spendable rows and the two are printed apart —
   a photograph nobody has published and a feature nobody has been given are
   different kinds of unspent, and one of them can be fixed with a data line. */
const idle = T.entries.filter(e => !e.missing && e.role === "unreferenced");

const only = (() => { const i = process.argv.indexOf("--wing"); return i >= 0 ? process.argv[i + 1] : null; })();
const names = [...new Set(WINGS.map(([, w]) => w).filter(Boolean))];

console.log("THE SURFACING REPORT — what is held and has never been shown\n");
console.log(`  ${rows.length} revealable things · ${T.entries.filter(e => !e.missing).length} media files\n`);

if (unplaced.length) {
  console.log(`  !! ${unplaced.length} row(s) belong to no wing — the table in tools/surfacing.mjs`);
  console.log("     needs a line for each. A report with an unnamed pile is a report");
  console.log("     that has stopped being exhaustive.");
  unplaced.forEach(r => console.log(`       ${r.id}`));
  console.log("");
}

const tally = [];
for (const w of names) {
  if (only && !w.toLowerCase().includes(only.toLowerCase())) continue;
  const mine = rows.filter(r => wingOf(r.id) === w);
  const sp = mine.filter(spendable);
  const pr = mine.filter(promised);
  const rv = mine.filter(r => r.state === "REVEALED");
  tally.push({ w, n: mine.length, sp: sp.length, pr: pr.length, rv: rv.length });

  console.log(`──── ${w.toUpperCase()} ────`);
  console.log(`  ${mine.length} things · ${rv.length} shown · ${sp.length} SPENDABLE · ${pr.length} promised and unbuilt`);
  if (!sp.length) {
    console.log("  Nothing on the back shelf. Everything this wing has built, it has shown.\n");
    continue;
  }
  console.log("  ON THE BACK SHELF — built, working, and nobody has been given it:");
  for (const r of sp) {
    console.log(`    ${r.id.padEnd(26)} ${String(r.build).padEnd(8)} ${r.name}`);
    if (r.deps.length) console.log(`      ${" ".repeat(24)} needs first: ${r.deps.join(" · ")}`);
  }
  console.log("");
}

console.log("──── BUILT AND SITTING — files in the tree nothing references ────");
if (!idle.length) console.log("  None.");
for (const e of idle) console.log(`  ${(e.ref || e.path).padEnd(56)} ${(e.bytes / 1024).toFixed(0)} KB`);
console.log("");

/* ═══ THE CADENCE — OPS' PROPOSAL, WHICH IS WHAT R7 ASKED FOR ═══════════════ */
console.log("──── THE RHYTHM ────");
console.log("  OPS' PROPOSAL, and it is a proposal because a cadence is a decision:");
console.log("");
console.log("    ONE SURFACING PER PACKET. A packet that ships without taking one thing");
console.log("    off the back shelf is a packet that added to it. That is not a rule with");
console.log("    teeth — some packets are gates and tools — but it is the number to look");
console.log("    at, and it is why this report runs beside lint and build rather than on a");
console.log("    clock this repository does not have.");
console.log("");
console.log("    THE SHELF SHOULD NOT GROW TWO PACKETS RUNNING. One round of building");
console.log("    ahead is stock; two is a habit. The log below is what makes that");
console.log("    checkable instead of remembered.");
console.log("");
console.log("  SHORTS: THIS REPORT CANNOT COUNT THEM AND WILL NOT PRINT A ZERO.");
console.log("    A short is a CUT. The storyboard doctrine, the obfuscation law and the");
console.log("    cutting all live in the robots repo, and nothing in this repository can");
console.log("    see whether one was made this month. A zero here would read as 'none");
console.log("    were made' when it means 'this tool cannot see'. The shorts cadence is a");
console.log("    row in docs/OPEN_ACTIONS.md and it is Mike's.");
console.log("");

const total = tally.reduce((a, t) => ({ sp: a.sp + t.sp, pr: a.pr + t.pr }), { sp: 0, pr: 0 });
console.log(`  TODAY: ${total.sp} spendable · ${total.pr} promised and unbuilt · ${idle.length} idle files`);

if (process.argv.includes("--log")) {
  /* [C41 CLOSED, D8 2026-08-06] THE STAMP IS LOCAL, NOT UTC.
     `toISOString()` renders in UTC, so a reading taken at 21:2x local on
     2026-08-05 was written into this file as 2026-08-06. This is a TREND file
     whose whole value is that its rows line up with the packets that produced
     them, and a row a day ahead of its own commit will be read as a different
     day's reading. It was found by the round that was USING the tool and
     deliberately not fixed there — the file's own header says a measurement
     somebody adjusted is not a measurement, and quietly re-stamping a date
     while running the thing is the shape of exactly that. THE ROWS ALREADY
     WRITTEN ARE NOT TOUCHED, for the same reason: the two UTC rows stand as
     they were recorded, and this line is why the ones after them differ.
     `sv` gives ISO's YYYY-MM-DD ordering off the LOCAL clock, which is the one
     every other date in this repository is kept on. */
  const stamp = new Date().toLocaleDateString("sv-SE");
  const line = `| ${stamp} | ${rows.length} | ${total.sp} | ${total.pr} | ${idle.length} | `
    + tally.map(t => `${t.w.split(" ").pop()} ${t.sp}`).join(" · ") + " |\n";
  if (!fs.existsSync(LOG)) {
    fs.writeFileSync(LOG,
      "# THE SURFACING LOG\n\n"
      + "One line per run of `npm run surfacing -- --log`. It exists so the numbers\n"
      + "become a TREND rather than a reading: a wing whose spendable count only ever\n"
      + "goes up is building and not showing, and that sentence cannot be said by a\n"
      + "report taken once.\n\n"
      + "**Nothing here is a target.** An unshown thing is inventory, not a defect —\n"
      + "the museum is deliberately metered. What this catches is the shelf growing\n"
      + "two packets running with nothing coming off it.\n\n"
      + "Written by `tools/surfacing.mjs`. Do not hand-edit: a measurement somebody\n"
      + "adjusted is not a measurement.\n\n"
      + "| date | rows | spendable | promised, unbuilt | idle files | by wing |\n"
      + "|---|---|---|---|---|---|\n");
  }
  fs.appendFileSync(LOG, line);
  console.log(`\n  logged to docs/SURFACING_LOG.md`);
}
