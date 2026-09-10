/* ===========================================================================
   THE CATALOGUE — served for Mike's Sunday sitting. [2026-09-10]
     node tools/catalogue.mjs        writes docs/desk/CATALOGUE.html from docs/CATALOGUE-20260918.json
   Grouped by album in shelf order, then the machine's shared features; each
   row a pitch, its kind and its launch day; the sitting rules each row A
   keep / B rewrite / C cut. Rulings are written back into the JSON by Ops
   (`ruling`, `mike` fields) and the page regenerated.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const C = JSON.parse(fs.readFileSync(path.join(REPO, "docs/CATALOGUE-20260918.json"), "utf8"));
const OUT = path.join(REPO, "docs/desk/CATALOGUE.html");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ORDER = ["everyman", "gambler", "ceo", "informer", "machine"];
const TITLES = { everyman: "The Everyday · the Everyman", gambler: "The Gambler", ceo: "The CEO", informer: "The Informer", machine: "The machine · shared by every album" };
const KIND_ORDER = ["character", "artifact", "document", "engine", "feature", "game", "setting", "sound"];
const dayLabel = d => d === "later" ? "later" : `day ${d}`;
let n = 0;
const groups = ORDER.map(a => {
  const rows = C.rows.filter(r => r.album === a).sort((x, y) => KIND_ORDER.indexOf(x.kind) - KIND_ORDER.indexOf(y.kind) || (x.day === "later") - (y.day === "later") || (x.day === "later" ? 0 : x.day) - (y.day === "later" ? 0 : y.day));
  if (!rows.length) return "";
  const trs = rows.map(r => { n += 1; return `<tr class="${r.ruling ? "ruled-" + r.ruling : ""}"><td class="n">${n}</td><td class="name">${esc(r.name)}<small>${esc(r.kind)}</small></td><td class="pitch">${esc(r.pitch)}${r.mike ? `<div class="mike">Mike: ${esc(r.mike)}</div>` : ""}</td><td class="day">${dayLabel(r.day)}</td><td class="rule">${r.ruling ? esc(r.ruling.toUpperCase()) : "A · B · C"}</td></tr>`; }).join("");
  return `<h2>${esc(TITLES[a])}<small>${rows.length} rows</small></h2><div class="scroll"><table><thead><tr><th>#</th><th>Thing</th><th>The pitch (Ops' draft)</th><th>Launch run</th><th>Ruling</th></tr></thead><tbody>${trs}</tbody></table></div>`;
}).join("\n");
const withDay = C.rows.filter(r => r.day !== "later").length;
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Catalogue</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"><style>
:root{--paper:#f3f4f1;--paper-2:#e9ebe6;--card:#fbfbf9;--ink:#1c2026;--ink-2:#4a515a;--ink-3:#7a828c;--rule:#cfd3cc;--gold:#b8974a;--gold-ink:#7a6122;--gold-bg:#f4ecd9;--you:#6a4c93;--you-bg:#ebe4f3;--ok:#3f7a4f;--ok-bg:#e3efe4;--no:#9a3b2e;--no-bg:#f3dfd9}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#171a1e;--paper-2:#1f2328;--card:#1c2025;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--gold:#cdae63;--gold-ink:#dcc27f;--gold-bg:#33291a;--you:#c2a8e6;--you-bg:#2e2440;--ok:#8fcb9c;--ok-bg:#213827;--no:#e39a8c;--no-bg:#3f231f}}
:root[data-theme="dark"]{--paper:#171a1e;--paper-2:#1f2328;--card:#1c2025;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--gold:#cdae63;--gold-ink:#dcc27f;--gold-bg:#33291a;--you:#c2a8e6;--you-bg:#2e2440;--ok:#8fcb9c;--ok-bg:#213827;--no:#e39a8c;--no-bg:#3f231f}
html{color-scheme:light dark}body{margin:0;background:var(--paper);color:var(--ink);font-family:Geist,system-ui,-apple-system,"Segoe UI",sans-serif;font-size:15px;line-height:1.5}
.wrap{max-width:1100px;margin:0 auto;padding:36px 24px 72px}
.eyebrow{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);margin:0 0 8px}
h1{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:40px;line-height:1.05;margin:0 0 8px;letter-spacing:-.01em}
.lede{color:var(--ink-2);max-width:70ch;margin:0 0 10px;font-size:16px}
.how{border-left:3px solid var(--you);background:var(--you-bg);padding:12px 16px;max-width:70ch;margin:0 0 26px}
h2{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:26px;margin:38px 0 8px}h2 small{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--ink-3);margin-left:10px;font-weight:400}
.scroll{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:14px;min-width:720px}
th{text-align:left;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-weight:500;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);padding:8px 10px 8px 0;border-bottom:1px solid var(--ink)}
td{padding:10px 10px 10px 0;border-bottom:1px solid var(--rule);vertical-align:top}
td.n{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--ink-3);width:3em}
td.name{width:22%;font-weight:600}td.name small{display:block;font-weight:400;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:10.5px;color:var(--ink-3);letter-spacing:.06em;text-transform:uppercase}
td.pitch{width:52%}td.day{width:9%;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--gold-ink);white-space:nowrap}td.rule{width:9%;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--ink-3);white-space:nowrap}
.mike{margin-top:6px;color:var(--you);font-style:italic}
tr.ruled-a td.rule{color:var(--ok)}tr.ruled-c td{color:var(--ink-3);text-decoration:line-through}tr.ruled-b td.rule{color:var(--gold-ink)}
footer{margin-top:30px;border-top:1px solid var(--rule);padding-top:12px;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--ink-3)}
</style></head><body><div class="wrap">
<p class="eyebrow">The robots wing · the catalogue · for the sitting of ${esc(C.sitting)}</p><h1>The Catalogue</h1>
<p class="lede">Every feature, game, setting, character, engine, sound, document and artifact of the machine, one line each: ${C.rows.length} rows, ${withDay} with a launch-run day and the rest marked later. Grouped by album in shelf order, then what the machine shares. The pitches are Ops' drafts.</p>
<div class="how"><b>How to rule it, thirty minutes.</b> Read down. For each row say the number and a letter: <b>A</b> the pitch stands · <b>B</b> rewrite, and say the line or the gist · <b>C</b> cut the row. Say nothing about a row and it stands as A. Anything missing from the machine, name it and it gets a row.</div>
${groups}
<footer>From docs/CATALOGUE-20260918.json · regenerated by node tools/catalogue.mjs · rulings written back by Ops</footer>
</div></body></html>`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`THE CATALOGUE — ${C.rows.length} rows, ${withDay} with a day · wrote docs/desk/CATALOGUE.html`);
