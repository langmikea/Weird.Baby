/* ===========================================================================
   THE COST REPORT — what Weird.Baby costs, from ops/costs.json.
   [2026-09-03, Mike: "track spending, costs, subscriptions; report on demand
   and as part of a monthly review"]

     npm run costs              print the report; write docs/ops/COSTS.md
     npm run costs -- --json    the totals as JSON (for the desk)

   Totals: recurring per month (yearly items divided by twelve), one-time
   to date, and the unknowns Mike alone can fill. Nothing here pays anything.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const SRC = path.join(REPO, "ops", "costs.json");
const OUT_DIR = path.join(REPO, "docs", "ops");
const led = JSON.parse(fs.readFileSync(SRC, "utf8"));
const items = led.items;
const money = n => n == null ? "—" : `$${n.toFixed(2)}`;
const perMonth = it => it.amount == null ? 0 : it.cadence === "monthly" ? it.amount : it.cadence === "yearly" ? it.amount / 12 : 0;

const recurring = items.filter(i => i.cadence !== "one-time");
const oneTime = items.filter(i => i.cadence === "one-time");
const unknown = items.filter(i => i.amount == null);
const unconfirmed = items.filter(i => i.amount != null && !i.confirmed);
const totals = {
  as_of: led.as_of,
  recurring_per_month_known: +recurring.reduce((s, i) => s + perMonth(i), 0).toFixed(2),
  recurring_per_year_known: +recurring.reduce((s, i) => s + perMonth(i) * 12, 0).toFixed(2),
  one_time_known: +oneTime.reduce((s, i) => s + (i.amount || 0), 0).toFixed(2),
  items: items.length, unknown: unknown.length, unconfirmed: unconfirmed.length,
  by_category: Object.fromEntries(led.categories.map(c => [c, +items.filter(i => i.category === c).reduce((s, i) => s + perMonth(i), 0).toFixed(2)])),
};
if (process.argv.includes("--json")) { console.log(JSON.stringify(totals, null, 1)); process.exit(0); }

const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
const row = i => `| ${i.name} | ${i.vendor} | ${i.category} | ${i.cadence} | ${money(i.amount)} | ${i.confirmed ? "confirmed" : i.amount == null ? "unknown" : "list price"} | ${i.since || "—"} | ${i.note} |`;
const md = [
  `# THE COST REPORT — ${today}`,
  ``,
  `From \`ops/costs.json\` (as of ${led.as_of}). Known recurring: **${money(totals.recurring_per_month_known)} a month**, ${money(totals.recurring_per_year_known)} a year. One-time to date: **${money(totals.one_time_known)}**. ${totals.unknown} amount(s) unknown to Ops, ${totals.unconfirmed} at list price rather than a bill.`,
  ``,
  `## Recurring`,
  `| item | vendor | category | cadence | amount | status | since | note |`, `|---|---|---|---|---|---|---|---|`,
  ...recurring.map(row),
  ``,
  `## One-time`,
  `| item | vendor | category | cadence | amount | status | since | note |`, `|---|---|---|---|---|---|---|---|`,
  ...oneTime.map(row),
  ``,
  `## Per month, by category (known amounts)`,
  `| category | per month |`, `|---|---|`,
  ...led.categories.map(c => `| ${c} | ${money(totals.by_category[c])} |`),
  ``,
  `## Mike fills these`,
  unknown.length ? unknown.map(i => `- ${i.name}: amount, cadence${i.since ? "" : ", since when"}`).join("\n") : `- nothing; every amount is known`,
  ``,
  `Rules: Ops adds a row the day a cost is ruled or noticed; Mike confirms amounts in the monthly review; nothing is paid or cancelled from here.`,
  ``,
].join("\n");
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "COSTS.md"), md);
console.log(md);
console.log(`wrote docs/ops/COSTS.md`);
