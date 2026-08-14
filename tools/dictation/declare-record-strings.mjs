#!/usr/bin/env node
/* ===========================================================================
   npm run record:declare — give every new Record string its register row.
   [2026-08-13]
   ---------------------------------------------------------------------------
       npm run record:declare -- --source "the workbook, 2026-08-16"
       npm run record:declare -- --dry

   THE REHEARSAL FOUND THE NEED. Landing one Record left **12 undeclared
   visitor-facing strings** and the provenance gate refused the packet. Five
   Records on Saturday is about sixty rows, every one of them the same two
   answers: the class is MIKE, because they are his dictated words, and the
   source is the workbook he typed them into.

   SIXTY IDENTICAL ROWS TYPED BY HAND IS NOT CARE, IT IS AN OPPORTUNITY TO MAKE
   A MISTAKE. This fills exactly those rows and refuses to touch any other.

   ═══ WHAT IT WILL AND WILL NOT DECLARE ═════════════════════════════════════
   **ONLY strings whose file is `src/data/artists/robots-record.js`.** Anything
   else undeclared is left alone and reported, because a string that appeared
   somewhere else during a Record landing is a surprise and a surprise is the
   thing a gate exists to surface. It never edits an existing row, never
   changes a class, and never invents a source — `--source` is required and is
   written verbatim into every row it creates.

   IT DOES NOT LOWER THE PROVENANCE BAR. Doctrine 21: material arriving through
   the dictation instruments is in-story by construction, so the class is
   settled at the instrument. What the row must still carry is WHERE THE WORDS
   CAME FROM, and that is what `--source` is for.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { execFileSync } from "node:child_process";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const REGISTER = path.join(REPO, "provenance", "register.json");
const STUBS = path.join(REPO, "provenance", "_undeclared.json");
const RECORD_FILE = "src/data/artists/robots-record.js";

const argv = process.argv.slice(2);
const after = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
const DRY = argv.includes("--dry");
const SOURCE = after("--source");

if (!SOURCE && !DRY) {
  console.error("record:declare needs --source \"<where the words came from>\".");
  console.error("");
  console.error("It is written verbatim into every row this creates, and it is the");
  console.error("only thing the register cannot derive. For a Saturday landing it is");
  console.error("the workbook and the date he wrote in it, e.g.");
  console.error("    npm run record:declare -- --source \"Mike's dictation, RECORD_days-2-to-6.xlsx, 2026-08-16\"");
  process.exit(1);
}

/* refresh the stub list so this always acts on what is undeclared NOW */
try {
  execFileSync("node", [path.join(REPO, "tools", "provenance-sweep.mjs"), "--emit"],
    { cwd: REPO, stdio: ["ignore", "pipe", "pipe"] });
} catch (e) {
  console.error("could not run the provenance sweep:", e.message);
  process.exit(1);
}

if (!fs.existsSync(STUBS)) { console.log("nothing undeclared — the register is current."); process.exit(0); }
const stubs = JSON.parse(fs.readFileSync(STUBS, "utf8"));
const keys = Object.keys(stubs);
if (!keys.length) { console.log("nothing undeclared — the register is current."); process.exit(0); }

const mine = keys.filter(k => stubs[k].f === RECORD_FILE);
const others = keys.filter(k => stubs[k].f !== RECORD_FILE);

console.log(`${keys.length} undeclared string(s)`);
console.log(`  ${mine.length} in ${RECORD_FILE}  — these are Mike's, class MIKE`);
console.log(`  ${others.length} elsewhere — NOT TOUCHED`);
for (const k of others) console.log(`      ${stubs[k].f}:${stubs[k].l}  ${JSON.stringify(String(stubs[k].t).slice(0, 60))}`);

if (DRY) {
  console.log("");
  for (const k of mine) console.log(`  would declare ${k}  ${JSON.stringify(String(stubs[k].t).slice(0, 70))}`);
  console.log("\n(--dry: nothing written)");
  process.exit(0);
}

const reg = JSON.parse(fs.readFileSync(REGISTER, "utf8"));
let added = 0, skipped = 0;
for (const k of mine) {
  if (reg.entries[k]) { skipped++; continue; }
  reg.entries[k] = { c: "MIKE", f: stubs[k].f, l: stubs[k].l, t: stubs[k].t, s: SOURCE };
  added++;
}
/* THE `generated` MAP IS A MAP AND NOT A TIMESTAMP. Overwriting it with a date
   is a mistake somebody has already made here: it declares the four
   machine-generated files in bulk, and clobbering it fails the gate with
   "4 generated file(s) undeclared". It is left exactly as found. */
fs.writeFileSync(REGISTER, JSON.stringify(reg, null, 1) + "\n");
fs.rmSync(STUBS, { force: true });

console.log("");
console.log(`declared ${added} row(s) as MIKE`);
if (skipped) console.log(`  ${skipped} already had a row and were left alone`);
console.log(`  source: ${SOURCE}`);
console.log(`  register now ${Object.keys(reg.entries).length} rows`);
if (others.length) {
  console.log("");
  console.log(`${others.length} string(s) outside the Record are STILL UNDECLARED and the gate`);
  console.log("will still refuse. That is deliberate: they are not Mike's dictation and");
  console.log("somebody has to say where they came from.");
  process.exit(1);
}
