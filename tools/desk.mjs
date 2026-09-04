/* ===========================================================================
   THE DESK — the one clean page: pillars, instruments, what Mike owes, the
   reel line's week, the costs line. [2026-09-03, Mike: "a clean Ops Desk
   with just the things that work and that I am to use"]

     npm run desk          writes docs/desk/DESK.html and prints the pillars
     npm run desk:full     the old instrument-heavy desk (tools/ops-desk.mjs)

   Reads: docs/desk/DESK.json (pillar lines and instruments, kept by Ops),
   docs/HANDOFF_next_session.md (the MIKE OWES section, live),
   reels/determinations.json and reels/numbers.json (this week and next),
   ops/costs.json (the known recurring total).
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { execFileSync } from "node:child_process";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const D = JSON.parse(fs.readFileSync(path.join(REPO, "docs/desk/DESK.json"), "utf8"));
const OUT = path.join(REPO, "docs/desk/DESK.html");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const todayNY = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });

/* what Mike owes, live from the handoff */
const handoff = fs.readFileSync(path.join(REPO, "docs/HANDOFF_next_session.md"), "utf8");
const owesBlock = handoff.split(/^## MIKE OWES\s*$/m)[1]?.split(/^## /m)[0] || "";
const owes = owesBlock.split(/\n(?=- )/).map(s => s.replace(/^- /, "").replace(/\s+/g, " ").trim()).filter(Boolean)
  .map(s => s.replace(/`[^`]*`/g, m => m.replace(/`/g, "")).replace(/\*\*/g, ""));

/* the reel line, this week and next */
const led = { determinations: JSON.parse(fs.readFileSync(path.join(REPO, "reels/determinations.json"), "utf8")), numbers: JSON.parse(fs.readFileSync(path.join(REPO, "reels/numbers.json"), "utf8")) };
const weekOf = () => { const r = led.numbers.rows.find(x => x.date >= todayNY); return r ? r.week : 8; };
const wk = weekOf();
const laneRows = (lane, w) => led[lane].rows.filter(r => r.week === w);
const count = rows => { const c = {}; for (const r of rows) c[r.status] = (c[r.status] || 0) + 1; return Object.entries(c).map(([k, v]) => `${v} ${k}`).join(", ") || "—"; };

/* costs */
let costs = null;
try { costs = JSON.parse(execFileSync("node", [path.join(HERE, "costs.mjs"), "--json"], { encoding: "utf8" })); } catch {}

const css = `
:root{--paper:#f3f4f1;--paper-2:#e9ebe6;--card:#fbfbf9;--ink:#1c2026;--ink-2:#4a515a;--ink-3:#7a828c;--rule:#cfd3cc;--gold:#b8974a;--gold-ink:#7a6122;--gold-bg:#f4ecd9;--you:#6a4c93;--you-bg:#ebe4f3;--ok:#3f7a4f;--ok-bg:#e3efe4;--no:#a2711c;--no-bg:#f6ead2}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#171a1e;--paper-2:#1f2328;--card:#1c2025;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--gold:#cdae63;--gold-ink:#dcc27f;--gold-bg:#33291a;--you:#c2a8e6;--you-bg:#2e2440;--ok:#8fcb9c;--ok-bg:#213827;--no:#e0b465;--no-bg:#3a2e14}}
:root[data-theme="dark"]{--paper:#171a1e;--paper-2:#1f2328;--card:#1c2025;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--gold:#cdae63;--gold-ink:#dcc27f;--gold-bg:#33291a;--you:#c2a8e6;--you-bg:#2e2440;--ok:#8fcb9c;--ok-bg:#213827;--no:#e0b465;--no-bg:#3a2e14}
html{color-scheme:light dark}body{margin:0;background:var(--paper);color:var(--ink);font-family:Geist,system-ui,-apple-system,"Segoe UI",sans-serif;font-size:15px;line-height:1.5}
.wrap{max-width:1100px;margin:0 auto;padding:36px 26px 70px}
.eyebrow{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);margin:0 0 8px}
h1{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:42px;line-height:1.05;margin:0 0 6px;letter-spacing:-.01em}
.sub{color:var(--ink-2);margin:0 0 24px;max-width:70ch}
h2{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:24px;margin:36px 0 8px}
table{border-collapse:collapse;width:100%;font-size:14px}th{text-align:left;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-weight:500;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3);padding:8px 12px 8px 0;border-bottom:1px solid var(--ink)}
td{padding:10px 12px 10px 0;border-bottom:1px solid var(--rule);vertical-align:top}tbody tr:last-child td{border-bottom:1px solid var(--ink)}
.pill td:first-child{width:14%;font-weight:600;font-family:Fraunces,Georgia,serif;font-size:17px}.pill td:nth-child(2){width:44%}.pill td:nth-child(3){width:16%}.pill td:nth-child(4){width:26%;color:var(--ink-2)}
.state{display:inline-block;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;padding:2px 8px;border-radius:3px;background:var(--paper-2);color:var(--ink-2);white-space:nowrap}
.state.ok{background:var(--ok-bg);color:var(--ok)}.state.no{background:var(--no-bg);color:var(--no)}.state.you{background:var(--you-bg);color:var(--you)}
.inst td:first-child{width:22%;font-weight:600}.inst td:nth-child(2){width:38%}.inst td:nth-child(3){width:40%;color:var(--ink-2)}
a{color:var(--gold-ink);text-decoration:none;border-bottom:1px solid var(--rule)}a:hover{border-bottom-color:var(--gold-ink)}
.owes{margin:0;padding:0;list-style:none;max-width:80ch}.owes li{border-top:1px solid var(--rule);padding:9px 0}
.line{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:0;padding:0;list-style:none}
.line li{border:1px solid var(--rule);background:var(--card);border-radius:4px;padding:12px 14px}.line b{display:block;font-weight:600;margin-bottom:2px}.line span{color:var(--ink-2);font-size:13.5px}
footer{margin-top:34px;border-top:1px solid var(--rule);padding-top:12px;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--ink-3)}
`;
const stateClass = s => /ruled|working|standing|built/.test(s) ? "ok" : /waits|held|clock/.test(s) ? "no" : "";
const pillars = D.pillars.map(p => `<tr><td>${esc(p.name)}</td><td>${esc(p.line)}</td><td><span class="state ${stateClass(p.state)}">${esc(p.state)}</span></td><td>${esc(p.next)}</td></tr>`).join("");
const insts = D.instruments.map(i => `<tr><td>${i.url ? `<a href="${esc(i.url)}">${esc(i.name)}</a>` : esc(i.name)}</td><td>${esc(i.what)}</td><td>${esc(i.how)}</td></tr>`).join("");
const owesHtml = owes.length ? owes.map(o => `<li>${esc(o)}</li>`).join("") : "<li>nothing on the list</li>";
const week = (w) => `<li><b>Week ${w}</b><span>Determination: ${esc(count(laneRows("determinations", w)))}<br>Number: ${esc(count(laneRows("numbers", w)))}</span></li>`;
const costLine = costs ? `<li><b>Costs</b><span>known recurring $${costs.recurring_per_month_known.toFixed(2)} a month · ${costs.unknown} amount(s) you fill · review on the first</span></li>` : "";

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Desk</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"><style>${css}</style></head><body>
<div class="wrap">
<p class="eyebrow">Weird.Baby · the desk · ${todayNY}</p><h1>The Desk</h1>
<p class="sub">Where things stand against the six pillars, the instruments you use, and what is yours to do. Everything on this page works; nothing on it is a draft. Ops keeps it current; ask and it is regenerated.</p>
<h2>The pillars</h2>
<table class="pill"><thead><tr><th>Pillar</th><th>Where it stands</th><th>State</th><th>Next</th></tr></thead><tbody>${pillars}</tbody></table>
<h2>What you owe</h2>
<ul class="owes">${owesHtml}</ul>
<h2>The reel line and the money</h2>
<ul class="line">${week(wk)}${week(wk + 1)}${costLine}</ul>
<h2>What you use</h2>
<table class="inst"><thead><tr><th>Instrument</th><th>What it is</th><th>Where</th></tr></thead><tbody>${insts}</tbody></table>
<footer>Generated by tools/desk.mjs from docs/desk/DESK.json, the handoff, the reel ledgers and ops/costs.json · the old instrument desk is npm run desk:full</footer>
</div></body></html>`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`THE DESK — ${todayNY}`);
for (const p of D.pillars) console.log(`  ${p.name.padEnd(16)} ${p.state.padEnd(30)} ${p.next}`);
console.log(`  you owe: ${owes.length} item(s) · week ${wk}: determinations ${count(laneRows("determinations", wk))}; numbers ${count(laneRows("numbers", wk))}${costs ? ` · costs $${costs.recurring_per_month_known}/mo known` : ""}`);
console.log(`wrote docs/desk/DESK.html`);
