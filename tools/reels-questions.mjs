/* ===========================================================================
   THE QUESTIONS — Mike's questions of the day, into the determinations ledger.
   [2026-09-03] Mike writes them (the Word page, or a text file, or chat);
   Ops carries them. This is the carrying.

     node tools/reels-questions.mjs --week 2 --file reels/questions/w2.txt
     node tools/reels-questions.mjs --week 2 "Q for Monday" "Q for Tuesday" …
     node tools/reels-questions.mjs --week 2 --show

   The file holds up to five non-empty lines, Monday to Friday, in order. A
   line beginning with MON/TUE/WED/THU/FRI and a colon names its day; plain
   lines fill the week in order. Rows get the question and status `written`
   (a row already `shot` or beyond keeps its status). Words are carried as
   given; nothing is smoothed here.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const LED = path.join(REPO, "reels", "determinations.json");
const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(`--${n}`); return i > -1 ? args[i + 1] : null; };
const week = Number(opt("week"));
if (!week) { console.error("need --week N"); process.exit(1); }
const led = JSON.parse(fs.readFileSync(LED, "utf8"));
const rows = led.rows.filter(r => r.week === week);
if (!rows.length) { console.error(`no week ${week}`); process.exit(1); }

if (args.includes("--show")) {
  for (const r of rows) console.log(`${r.day} ${r.date}  [${r.status}]  ${r.question || "(none)"}`);
  process.exit(0);
}
let lines = [];
const file = opt("file");
if (file) lines = fs.readFileSync(file, "utf8").split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith("#"));
else lines = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--week");
if (!lines.length) { console.error("no questions given"); process.exit(1); }

const byDay = {}; let free = [];
for (const l of lines) {
  const m = l.match(/^(MON|TUE|WED|THU|FRI)\s*:\s*(.+)$/i);
  if (m) byDay[m[1].toUpperCase()] = m[2].trim(); else free.push(l);
}
let n = 0;
for (const d of DAYS) {
  const r = rows.find(x => x.day === d); if (!r) continue;
  const q = byDay[d] ?? free.shift();
  if (!q) continue;
  r.question = q;
  if (r.status === "open") r.status = "written";
  n += 1;
  console.log(`${d} ${r.date}  ← "${q}"`);
}
fs.writeFileSync(LED, JSON.stringify(led, null, 1) + "\n");
console.log(`${n} question(s) written to week ${week}; ledger saved.`);
