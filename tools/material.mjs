/* ===========================================================================
   THE MATERIAL — every clip and take in hand, served for Mike's ruling. [2026-09-17]
     node tools/material.mjs                       writes docs/desk/MATERIAL.html from docs/MATERIAL-20260917.json
     node tools/material.mjs --thumbs <dir>        embed <dir>/<thumb>.jpg per row (built outside the repo; media never in the repo)
   One row a file, grouped as found; each row: what, when, length, lane, usable or not and why,
   the template that takes it, and the decision line (A/B/C, Ops' recommendation marked).
   Rulings are written back into the JSON by Ops (`ruling`, `mike`) and the page regenerated.
   Brief: docs/NEXT-20260917.md M1.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const C = JSON.parse(fs.readFileSync(path.join(REPO, "docs/MATERIAL-20260917.json"), "utf8"));
const OUT = path.join(REPO, "docs/desk/MATERIAL.html");
const ti = process.argv.indexOf("--thumbs");
const THUMBS = ti > 0 ? process.argv[ti + 1] : null;
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const thumb = r => {
  if (!THUMBS || !r.thumb) return "";
  const p = path.join(THUMBS, r.thumb + ".jpg");
  if (!fs.existsSync(p)) return "";
  return `<img src="data:image/jpeg;base64,${fs.readFileSync(p).toString("base64")}" alt="">`;
};
const mmss = s => s == null ? "" : s >= 60 ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}` : `${s} s`;
const mb = b => b == null ? "" : b >= 1e9 ? `${(b / 1e9).toFixed(2)} GB` : b >= 1e6 ? `${Math.round(b / 1e6)} MB` : `${Math.round(b / 1e3)} KB`;
const fileName = r => r.file ? r.file.split(/[\\/]/).pop() : (r.group === "hosted" ? "YouTube" : "");
const decision = r => {
  if (!r.decision.includes(" · ")) return `<span class="dec-note">${esc(r.decision)}</span>`;
  return r.decision.split(" · ").map(part => {
    const letter = part.trim()[0];
    const rec = letter === r.recommend;
    return `<span class="opt${rec ? " rec" : ""}">${esc(part.trim())}</span>`;
  }).join("");
};
let n = 0;
const usableWord = { yes: "usable", partly: "partly", no: "not usable", built: "built" };
const groups = C.groups.map(g => {
  const rows = C.rows.filter(r => r.group === g.id);
  if (!rows.length) return "";
  const trs = rows.map(r => {
    n += 1;
    return `<tr class="u-${r.usable}${r.ruling ? " ruled-" + r.ruling : ""}" id="${esc(r.id)}">
<td class="n">${n}</td>
<td class="th">${thumb(r)}</td>
<td class="what"><b>${esc(fileName(r))}</b>${esc(r.what)}${r.note ? `<div class="note">${esc(r.note)}</div>` : ""}${r.mike ? `<div class="mike">Mike: ${esc(r.mike)}</div>` : ""}</td>
<td class="meta">${esc(r.when)}<br>${mmss(r.length_s)}${r.dims ? `<br>${esc(r.dims)}` : ""}${r.bytes ? `<br>${mb(r.bytes)}` : ""}</td>
<td class="lane">${esc(r.lane)}<br><span class="u">${usableWord[r.usable] || esc(r.usable)}</span><br><span class="tpl">${r.template === "none" ? (r.missing ? "missing: " + esc(r.missing) : "no template") : esc(r.template)}</span></td>
<td class="why">${esc(r.why)}</td>
<td class="dec">${decision(r)}${r.ruling ? `<div class="ruled">ruled ${esc(r.ruling.toUpperCase())}</div>` : ""}</td>
</tr>`;
  }).join("");
  return `<h2 id="g-${esc(g.id)}">${esc(g.title)}<small>${rows.length} ${rows.length === 1 ? "row" : "rows"} · ${esc(g.where)}</small></h2>
<p class="gnote">${esc(g.note)}</p>
<div class="scroll"><table><thead><tr><th>#</th><th></th><th>What</th><th>When · length</th><th>Lane · usable · template</th><th>Why</th><th>Decision</th></tr></thead><tbody>${trs}</tbody></table></div>`;
}).join("\n");
const counts = C.rows.reduce((a, r) => (a[r.usable] = (a[r.usable] || 0) + 1, a), {});
const toc = C.groups.map(g => `<a href="#g-${esc(g.id)}">${esc(g.title)}</a>`).join(" · ");
const shapes = C.missing_shapes.map(s => `<li><b>${esc(s.shape)}</b> — ${esc(s.what)} <span class="rows">(${esc(s.rows)})</span></li>`).join("");
const notSurveyed = C.not_surveyed.map(s => `<li>${esc(s)}</li>`).join("");
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Material</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"><style>
:root{--paper:#f3f4f1;--paper-2:#e9ebe6;--card:#fbfbf9;--ink:#1c2026;--ink-2:#4a515a;--ink-3:#7a828c;--rule:#cfd3cc;--gold:#b8974a;--gold-ink:#7a6122;--gold-bg:#f4ecd9;--you:#6a4c93;--you-bg:#ebe4f3;--ok:#3f7a4f;--ok-bg:#e3efe4;--no:#9a3b2e;--no-bg:#f3dfd9}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#171a1e;--paper-2:#1f2328;--card:#1c2025;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--gold:#cdae63;--gold-ink:#dcc27f;--gold-bg:#33291a;--you:#c2a8e6;--you-bg:#2e2440;--ok:#8fcb9c;--ok-bg:#213827;--no:#e39a8c;--no-bg:#3f231f}}
:root[data-theme="dark"]{--paper:#171a1e;--paper-2:#1f2328;--card:#1c2025;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--gold:#cdae63;--gold-ink:#dcc27f;--gold-bg:#33291a;--you:#c2a8e6;--you-bg:#2e2440;--ok:#8fcb9c;--ok-bg:#213827;--no:#e39a8c;--no-bg:#3f231f}
html{color-scheme:light dark}body{margin:0;background:var(--paper);color:var(--ink);font-family:Geist,system-ui,-apple-system,"Segoe UI",sans-serif;font-size:14px;line-height:1.45}
.wrap{max-width:1360px;margin:0 auto;padding-block:36px 72px;padding-inline:24px}
.eyebrow{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);margin:0 0 8px}
h1{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:40px;line-height:1.05;margin:0 0 8px;letter-spacing:-.01em}
.lede{color:var(--ink-2);max-width:78ch;margin:0 0 10px;font-size:16px}
.how{border-left:3px solid var(--you);background:var(--you-bg);padding:12px 16px;max-width:78ch;margin:0 0 18px}
.toc{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--ink-3);margin:0 0 8px;line-height:1.9}.toc a{color:var(--gold-ink);text-decoration:none}
.counts{display:flex;gap:18px;flex-wrap:wrap;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--ink-3);margin:0 0 20px}.counts b{color:var(--ink);font-weight:500}
h2{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:26px;margin:38px 0 4px}h2 small{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--ink-3);margin-left:10px;font-weight:400}
.gnote{color:var(--ink-2);max-width:90ch;margin:0 0 10px}
.scroll{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:13px;min-width:1100px}
th{text-align:left;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-weight:500;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);padding:8px 10px 8px 0;border-bottom:1px solid var(--ink)}
td{padding:9px 10px 9px 0;border-bottom:1px solid var(--rule);vertical-align:top}
td.n{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;color:var(--ink-3);width:2.6em}
td.th{width:84px}td.th img{width:80px;height:80px;object-fit:cover;border-radius:3px;background:var(--paper-2);display:block}
td.what{width:30%}td.what b{display:block;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;font-weight:500;color:var(--ink-3);letter-spacing:.03em;margin-bottom:2px;word-break:break-all}
td.meta{width:9%;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;color:var(--ink-2);white-space:nowrap}
td.lane{width:11%;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;color:var(--gold-ink);white-space:nowrap}td.lane .u{color:var(--ink-2)}td.lane .tpl{color:var(--ink-3);white-space:normal}
td.why{width:22%;color:var(--ink-2)}
td.dec{width:20%}.opt{display:block;padding:2px 6px;margin:0 0 3px;border-left:2px solid var(--rule);color:var(--ink-2)}.opt.rec{border-left-color:var(--ok);background:var(--ok-bg);color:var(--ink)}.dec-note{color:var(--ink-3);font-style:italic}
.note{margin-top:6px;color:var(--ink-3);font-size:12.5px}.mike{margin-top:6px;color:var(--you);font-style:italic}.ruled{margin-top:4px;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;color:var(--ok)}
tr.u-no td.what,tr.u-no td.why{color:var(--ink-3)}tr.ruled-c td{text-decoration:line-through;color:var(--ink-3)}
ul.shapes,ul.ns{max-width:90ch;padding-left:1.3em}ul.shapes li,ul.ns li{margin:6px 0}ul.shapes .rows{color:var(--ink-3)}
footer{margin-top:30px;border-top:1px solid var(--rule);padding-top:12px;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--ink-3)}
@media(max-width:700px){h1{font-size:30px}.wrap{padding-inline:16px}}
</style></head><body><div class="wrap">
<p class="eyebrow">Weird.Baby · Ops · the material in hand · surveyed ${esc(C.surveyed)}</p>
<h1>The Material</h1>
<p class="lede">Every clip and take Ops can find, one row a file: what it is, when, how long, which lane it serves, whether it is usable and why, which template takes it, and a decision for you. ${C.rows.length} rows in ${C.groups.length} places. The pieces cut today are in the Finished reels folder under <b>material</b>.</p>
<div class="how"><b>How to rule.</b> Each row's decision is A, B or C; Ops' recommendation is the green one. Say the row number and the letter, or a group and one letter for all of it. A row whose decision reads "same ruling as…" follows its parent. Nothing on this page has been moved, renamed or deleted.</div>
<p class="toc">${toc}</p>
<div class="counts"><span>usable <b>${counts.yes || 0}</b></span><span>partly <b>${counts.partly || 0}</b></span><span>not usable <b>${counts.no || 0}</b></span><span>built by the lines <b>${counts.built || 0}</b></span></div>
${groups}
<h2>The missing shapes<small>rows that fit no template name one</small></h2>
<ul class="shapes">${shapes}</ul>
<h2>Not surveyed, or empty<small>where Ops looked and found nothing, and where it did not look</small></h2>
<ul class="ns">${notSurveyed}</ul>
<footer>Source docs/MATERIAL-20260917.json · rendered by tools/material.mjs · pieces by tools/material-cut.py · the 09-16 sort is docs/PHOTOS-20260916-GAMBLER-SET.md · the flavours are docs/PORTFOLIO-20260916.md</footer>
</div></body></html>`;
fs.writeFileSync(OUT, html);
console.log(`material: ${C.rows.length} rows, ${C.groups.length} groups -> ${path.relative(REPO, OUT)}${THUMBS ? " (thumbs embedded)" : ""}`);
