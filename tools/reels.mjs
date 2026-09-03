/* ===========================================================================
   THE DAILY DETERMINATION — this week's five reels and their state.
   [2026-09-03, Mike's ruling: the oracle reel is the spine]

   Reads reels/determinations.json. Prints this week's rows with status, and
   next week's rows whose question is not yet written (the rule of
   preparation from tools/calendar.mjs: what posts in week N is written by
   the Friday of week N-1). Writes nothing.

     npm run reels
     npm run reels -- --week 3
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const SRC = path.join(REPO, "reels", "determinations.json");
const led = JSON.parse(fs.readFileSync(SRC, "utf8"));

const argWeek = (() => { const i = process.argv.indexOf("--week"); return i > -1 ? Number(process.argv[i + 1]) : null; })();
const todayNY = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
const weeks = [...new Set(led.rows.map(r => r.week))];
const weekOfToday = (() => {
  const r = led.rows.find(x => x.date >= todayNY);
  return r ? r.week : weeks[weeks.length - 1];
})();
const wk = argWeek ?? weekOfToday;
const rowsOf = n => led.rows.filter(r => r.week === n);

const pad = (s, n) => String(s ?? "").padEnd(n).slice(0, n);
const out = [];
out.push(`THE DAILY DETERMINATION — today ${todayNY} (New York).`);
out.push("");
out.push(`WEEK ${wk}`);
for (const r of rowsOf(wk)) {
  const q = r.question ? `"${r.question}"` : "(no question yet)";
  const posted = Object.entries(r.postings).filter(([, v]) => v).map(([k]) => k).join(",") || "-";
  out.push(`  ${r.day} ${r.date.slice(5)}  ${pad(r.status, 8)} ${pad(posted, 20)} ${q}`);
  if (r.scheduled) out.push(`             story: ${r.scheduled}`);
}
const next = rowsOf(wk + 1).filter(r => !r.question);
out.push("");
if (rowsOf(wk + 1).length) {
  out.push(`WEEK ${wk + 1} — QUESTIONS NOT YET WRITTEN (due by Friday of week ${wk}): ${next.length} of ${rowsOf(wk + 1).length}`);
  for (const r of next) out.push(`  ${r.day} ${r.date.slice(5)}  ${r.scheduled || ""}`);
} else {
  out.push("No week after this one in the ledger.");
}
const totals = led.statuses.map(s => `${s} ${led.rows.filter(r => r.status === s).length}`).join(" · ");
out.push("");
out.push(`All rows: ${led.rows.length} · ${totals}`);
console.log(out.join("\n"));
