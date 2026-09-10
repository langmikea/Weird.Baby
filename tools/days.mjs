/* ===========================================================================
   THE DAYS — a literal calendar to Opening Day. [2026-09-10, Mike: "a
   literal calendar with blocks for each day … color coded (you vs me) …
   clicking the item takes you to a place to DO IT"]

     npm run desk        (runs this after the desk)

   Reads docs/desk/TASKS.json (Ops' hand), docs/desk/TASKS.db.json (what
   Mike ticked on the served page, synced by Ops from the page's store), and
   the tree (files in the OneDrive intake, photograph folders, the Buffer
   key) for tasks that carry a `check`. Writes docs/desk/DAYS.html: a grid,
   Monday to Sunday, from the reset to the week after the door; each day a
   box; each task a pill, purple for Mike, gold for Ops, dimmed when done,
   ringed when late; a pill opens the task's card with the literal
   instruction and, for Mike's, a box to tick that writes tasks/<id> to the
   page's store.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const ONE = "C:/Users/macun/OneDrive/WeirdBaby";
const T = JSON.parse(fs.readFileSync(path.join(REPO, "docs/desk/TASKS.json"), "utf8"));
const DBF = path.join(REPO, "docs/desk/TASKS.db.json");
const ticked = fs.existsSync(DBF) ? JSON.parse(fs.readFileSync(DBF, "utf8")) : {};
/* [2026-09-10, ruled] the workbook is the surface: Mike's x in its Done
   column, read by tools/days-xlsx.py into TASKS.marks.json, counts as done. */
const MARKSF = path.join(REPO, "docs/desk/TASKS.marks.json");
const marks = fs.existsSync(MARKSF) ? JSON.parse(fs.readFileSync(MARKSF, "utf8")) : {};
for (const id of Object.keys(marks)) ticked[id] = { done: true, by: "mike", via: "workbook" };
const OUT = path.join(REPO, "docs/desk/DAYS.html");
const todayNY = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const files = (dir, pred) => { try { return fs.readdirSync(path.join(ONE, dir)).filter(pred); } catch { return []; } };
function checked(t) {
  const c = t.check; if (!c) return false;
  if (c.type === "file") return files(c.dir, f => f.toLowerCase().startsWith(c.prefix.toLowerCase()) && /\.(mp4|mov|m4v)$/i.test(f)).length > 0;
  if (c.type === "files") return files(c.dir, f => f.toLowerCase().startsWith(c.prefix.toLowerCase()) && /\.(mp4|mov|m4v)$/i.test(f)).length >= (c.min || 1);
  if (c.type === "photos") return files(c.dir, f => /\.(jpe?g|png|heic|webp)$/i.test(f)).length >= (c.min || 4);
  if (c.type === "buffer-token") return fs.existsSync("C:/AI/PERSONA-20260903/.secrets/buffer.token");
  return false;
}
const tasks = T.tasks.map(t => {
  const done = t.done === true || checked(t) || ticked[t.id]?.done === true;
  const late = !done && t.date < todayNY;
  return { ...t, done, late };
});

/* the grid: Monday of the reset's week to the Sunday after the door */
const addDays = (iso, n) => { const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const mondayOf = iso => { const d = new Date(iso + "T12:00:00Z"); const w = (d.getUTCDay() + 6) % 7; return addDays(iso, -w); };
const first = mondayOf("2026-09-07"), last = addDays(mondayOf(T.opening_day), 6);
const days = []; for (let d = first; d <= last; d = addDays(d, 1)) days.push(d);
const byDate = {}; for (const t of tasks) (byDate[t.date] ||= []).push(t);
const MILESTONES = [["0", "2026-09-07", "alignment, the burn list"], ["1", "2026-09-14", "the catalogue"], ["2", "2026-09-21", "the wing's shape"], ["3", "2026-09-28", "the wing built, the twin current"], ["4", "2026-10-05", "content lock"], ["5", "2026-10-12", "in the can"], ["6", "2026-10-19", "teasers, rehearsal"], ["7", "2026-10-26", "open"]];
const weekOf = iso => MILESTONES.filter(m => m[1] <= iso).slice(-1)[0];
const DOWN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MON = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const label = iso => `${DOWN[(new Date(iso + "T12:00:00Z").getUTCDay() + 6) % 7]} ${MON[Number(iso.slice(5, 7))]} ${Number(iso.slice(8))}`;

const done = tasks.filter(t => t.done).length, mikeDone = tasks.filter(t => t.owner === "mike" && t.done).length, mikeAll = tasks.filter(t => t.owner === "mike").length;
const opsDone = tasks.filter(t => t.owner === "ops" && t.done).length, opsAll = tasks.filter(t => t.owner === "ops").length;
const daysLeft = Math.round((Date.parse(T.opening_day) - Date.parse(todayNY)) / 86400000);

const pill = t => `<button class="pill ${t.owner} ${t.done ? "done" : ""} ${t.late ? "late" : ""}" data-id="${esc(t.id)}" aria-pressed="${t.done}">${esc(t.title)}</button>`;
const cells = days.map(d => {
  const ts = (byDate[d] || []).sort((a, b) => (a.owner === "mike" ? 0 : 1) - (b.owner === "mike" ? 0 : 1));
  const isToday = d === todayNY, isOpen = d === T.opening_day, wk = weekOf(d);
  const monday = (new Date(d + "T12:00:00Z").getUTCDay() + 6) % 7 === 0;
  return `<div class="day ${isToday ? "today" : ""} ${isOpen ? "open" : ""} ${d < todayNY ? "past" : ""} ${ts.length ? "" : "empty"}" data-date="${d}">
    <div class="dh"><span>${label(d)}</span>${monday && wk ? `<em>wk ${wk[0]} · ${esc(wk[2])}</em>` : ""}${isOpen ? "<em class=door>OPENING DAY</em>" : ""}</div>
    <div class="pills">${ts.map(pill).join("")}</div></div>`;
}).join("");
const cards = tasks.map(t => `<template id="card-${esc(t.id)}"><div class="card ${t.owner}">
  <p class="eyebrow">${t.owner === "mike" ? "You" : "Ops"} · due ${esc(label(t.date))}${t.late ? " · late" : ""}${t.block ? " · " + esc(t.block) : ""}</p>
  <h3>${esc(t.title)}</h3>
  <ol>${(t.do || []).map(s => `<li>${esc(s)}</li>`).join("")}</ol>
  ${t.owner === "mike" ? `<label class="tick"><input type="checkbox" data-tick="${esc(t.id)}" ${t.done ? "checked" : ""}> <span>${t.done ? "Done" : "Mark it done"}</span></label><p class="fine">Ticking it here is enough; Code sees it. Files count themselves the moment they land.</p>` : `<p class="fine">Ops' task. It turns dim when Ops marks it done on the next desk run.</p>`}
</div></template>`).join("");

const css = `
:root{--paper:#f3f4f1;--paper-2:#e9ebe6;--card:#fbfbf9;--ink:#1c2026;--ink-2:#4a515a;--ink-3:#7a828c;--rule:#cfd3cc;--gold:#b8974a;--gold-ink:#7a6122;--gold-bg:#f4ecd9;--you:#6a4c93;--you-bg:#ebe4f3;--late:#9a3b2e;--open:#3f7a4f;--open-bg:#e3efe4;--now:#fff8dc}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#171a1e;--paper-2:#1f2328;--card:#1c2025;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--gold:#cdae63;--gold-ink:#dcc27f;--gold-bg:#33291a;--you:#c2a8e6;--you-bg:#2e2440;--late:#e39a8c;--open:#8fcb9c;--open-bg:#213827;--now:#2a2a1a}}
:root[data-theme="dark"]{--paper:#171a1e;--paper-2:#1f2328;--card:#1c2025;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--gold:#cdae63;--gold-ink:#dcc27f;--gold-bg:#33291a;--you:#c2a8e6;--you-bg:#2e2440;--late:#e39a8c;--open:#8fcb9c;--open-bg:#213827;--now:#2a2a1a}
html{color-scheme:light dark}body{margin:0;background:var(--paper);color:var(--ink);font-family:Geist,system-ui,-apple-system,"Segoe UI",sans-serif;font-size:14px;line-height:1.4}
.wrap{max-width:1400px;margin:0 auto;padding:24px 18px 60px}
.eyebrow{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);margin:0 0 6px}
h1{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:34px;line-height:1.05;margin:0 0 4px;letter-spacing:-.01em}
.sub{color:var(--ink-2);margin:0 0 14px;max-width:80ch}
.legend{display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center;font-size:12.5px;color:var(--ink-2);margin:0 0 14px}
.legend i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:6px}
.legend i.mike{background:var(--you)}.legend i.ops{background:var(--gold)}.legend i.done{background:var(--paper-2);border:1px solid var(--rule)}.legend i.late{background:transparent;border:2px solid var(--late)}
.ms{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;margin:0 0 16px}
.ms a{display:block;border:1px solid var(--rule);border-radius:4px;padding:6px 8px;text-decoration:none;color:var(--ink);font-size:12px;background:var(--card)}
.ms a b{display:block;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:10.5px;color:var(--gold-ink);letter-spacing:.08em}
.ms a.now{border-color:var(--gold);background:var(--gold-bg)}
.grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}
.day{background:var(--card);border:1px solid var(--rule);border-radius:4px;min-height:96px;padding:6px 7px;display:flex;flex-direction:column;gap:6px}
.day.past{opacity:.75}.day.today{background:var(--now);border-color:var(--gold)}.day.open{border:2px solid var(--open);background:var(--open-bg)}
.dh{display:flex;justify-content:space-between;align-items:baseline;gap:6px;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;color:var(--ink-3)}
.dh em{font-style:normal;color:var(--gold-ink);font-size:10px;letter-spacing:.06em;text-transform:uppercase;text-align:right}.dh em.door{color:var(--open);font-weight:600}
.pills{display:flex;flex-direction:column;gap:4px}
.pill{text-align:left;font:inherit;font-size:12px;line-height:1.25;border:0;border-radius:3px;padding:4px 7px;cursor:pointer;color:#fff;width:100%}
.pill.mike{background:var(--you)}.pill.ops{background:var(--gold);color:#1c2026}
.pill.done{background:var(--paper-2);color:var(--ink-3);text-decoration:line-through}
.pill.late{box-shadow:0 0 0 2px var(--late)}
.pill:focus-visible{outline:2px solid var(--ink);outline-offset:1px}
dialog{border:1px solid var(--rule);border-radius:6px;padding:0;max-width:560px;width:calc(100% - 32px);background:var(--card);color:var(--ink)}
dialog::backdrop{background:rgba(0,0,0,.35)}
.card{padding:20px 22px 18px;border-top:6px solid var(--gold)}.card.mike{border-top-color:var(--you)}
.card h3{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:22px;margin:0 0 10px;line-height:1.15}
.card ol{margin:0 0 12px;padding-left:1.3em;font-size:15px}.card li{margin:6px 0}
.tick{display:flex;gap:10px;align-items:center;font-size:16px;font-weight:600;margin:10px 0 4px}.tick input{width:22px;height:22px}
.fine{font-size:12px;color:var(--ink-3);margin:6px 0 0}
.close{position:absolute;right:10px;top:8px;border:0;background:transparent;font-size:22px;cursor:pointer;color:var(--ink-3)}
footer{margin-top:22px;border-top:1px solid var(--rule);padding-top:10px;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11.5px;color:var(--ink-3)}
@media(max-width:820px){.grid{grid-template-columns:1fr}.day.empty{display:none}.ms{grid-template-columns:repeat(4,1fr)}.day{min-height:0}}
`;
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Days</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"><style>${css}</style></head><body>
<div class="wrap">
<p class="eyebrow">Weird.Baby · the days to the door · ${todayNY}</p><h1>The Days</h1>
<p class="sub">Every day to Opening Day, and what is due on it. Purple is you, gold is Ops. Dim is done. A red ring is late. Tap a pill for what to do, literally; tick it when it is done. ${daysLeft} days to ${T.opening_day}. You: ${mikeDone} of ${mikeAll}. Ops: ${opsDone} of ${opsAll}.</p>
<div class="legend"><span><i class="mike"></i>you</span><span><i class="ops"></i>Ops</span><span><i class="done"></i>done</span><span><i class="late"></i>late</span><span>today is outlined in gold; the door in green</span></div>
<div class="ms">${MILESTONES.map(m => `<a href="#d-${m[1]}" class="${weekOf(todayNY)?.[0] === m[0] ? "now" : ""}"><b>WEEK ${m[0]} · ${m[1].slice(5)}</b>${esc(m[2])}</a>`).join("")}</div>
<div class="grid">${cells.replace(/data-date="(\d{4}-\d\d-\d\d)"/g, 'id="d-$1" data-date="$1"')}</div>
<footer>From docs/desk/TASKS.json and the tree · what you tick is kept in this page's store and read by Ops · regenerated by npm run desk</footer>
</div>
${cards}
<dialog id="dlg"><button class="close" aria-label="close" onclick="document.getElementById('dlg').close()">×</button><div id="dlg-body"></div></dialog>
<script>
(function(){
  var dlg=document.getElementById('dlg'), body=document.getElementById('dlg-body'), db=null;
  var state={};
  function paint(id,done){ var p=document.querySelector('.pill[data-id="'+id+'"]'); if(!p) return; p.classList.toggle('done',!!done); p.setAttribute('aria-pressed',!!done); if(done) p.classList.remove('late'); }
  document.querySelectorAll('.pill').forEach(function(p){ p.addEventListener('click',function(){
    var id=p.dataset.id, tpl=document.getElementById('card-'+id); if(!tpl) return;
    body.innerHTML=''; body.appendChild(tpl.content.cloneNode(true));
    var cb=body.querySelector('input[data-tick]');
    if(cb){ if(id in state) cb.checked=!!state[id]; cb.addEventListener('change',function(){
      var done=cb.checked; state[id]=done; paint(id,done); cb.nextElementSibling.textContent=done?'Done':'Mark it done';
      if(db){ db.doc('tasks/'+id).set({done:done,at:new Date().toISOString(),by:'mike'}).catch(function(){}); }
      else { try{ localStorage.setItem('wb-days-'+id, done?'1':'0'); }catch(e){} }
    }); }
    if(typeof dlg.showModal==='function') dlg.showModal(); else dlg.setAttribute('open','');
  }); });
  try{ document.querySelectorAll('.pill.mike').forEach(function(p){ var v=localStorage.getItem('wb-days-'+p.dataset.id); if(v==='1'){ state[p.dataset.id]=true; paint(p.dataset.id,true);} }); }catch(e){}
  if(window.claude && typeof window.claude.use==='function'){ window.claude.use('db').then(function(d){ if(!d) return; db=d;
    d.collection('tasks').onSnapshot(function(snap){ snap.docs.forEach(function(doc){ var v=doc.data(); if(v&&typeof v.done==='boolean'){ state[doc.id]=v.done; paint(doc.id,v.done);} }); }, function(){});
  }).catch(function(){}); }
  var t=document.querySelector('.day.today'); if(t && window.innerWidth<820) t.scrollIntoView({block:'start'});
})();
</script>
</body></html>`;
fs.writeFileSync(OUT, html);

/* ── the same days as two calendar feeds (Mike's and Ops'), for Google
   Calendar "From URL". One all-day event per task; the literal steps in the
   description; a done task keeps its place with a tick in front. UIDs are
   stable per task and SEQUENCE rises on every run so subscribers update. */
const icsEsc = s => String(s ?? "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
const fold = line => { const out = []; let s = line; while (s.length > 72) { out.push(s.slice(0, 72)); s = " " + s.slice(72); } out.push(s); return out.join("\r\n"); };
const stampNow = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const seq = Math.floor(Date.now() / 60000);
const ymd = iso => iso.replace(/-/g, "");
function ics(name, list) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Weird.Baby//The Days//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", `X-WR-CALNAME:${icsEsc(name)}`, "X-WR-TIMEZONE:America/New_York", "REFRESH-INTERVAL;VALUE=DURATION:PT6H", "X-PUBLISHED-TTL:PT6H"];
  for (const t of list) {
    const desc = [(t.owner === "mike" ? "YOU" : "OPS") + (t.done ? " · DONE" : t.late ? " · LATE" : ""), "", ...(t.do || []).map((s, i) => `${i + 1}. ${s}`), "", "The Days: https://claude.ai/code/artifact/207ed53f-1abf-4667-82e5-92e3259f4233"].join("\n");
    lines.push("BEGIN:VEVENT", `UID:${t.id}@weird.baby`, `DTSTAMP:${stampNow}`, `LAST-MODIFIED:${stampNow}`, `SEQUENCE:${seq}`,
      `DTSTART;VALUE=DATE:${ymd(t.date)}`, `DTEND;VALUE=DATE:${ymd(addDays(t.date, 1))}`,
      fold(`SUMMARY:${icsEsc((t.done ? "✓ " : "") + t.title)}`), fold(`DESCRIPTION:${icsEsc(desc)}`),
      `CATEGORIES:${t.owner === "mike" ? "Weird.Baby You" : "Weird.Baby Ops"}`, `STATUS:${t.done ? "COMPLETED" : "CONFIRMED"}`, "TRANSP:TRANSPARENT", "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
const openDay = { id: "opening-day", date: T.opening_day, owner: "ops", title: "OPENING DAY — the door opens at five", do: ["Mike deploys; Ops checks the door from outside.", "Halloween, and the cat's birthday."], done: false, late: false };
fs.writeFileSync(path.join(REPO, "docs/desk/days-mike.ics"), ics("Weird.Baby · You", [...tasks.filter(t => t.owner === "mike"), openDay]));
fs.writeFileSync(path.join(REPO, "docs/desk/days-ops.ics"), ics("Weird.Baby · Ops", tasks.filter(t => t.owner === "ops")));
console.log(`THE DAYS — ${todayNY}: ${tasks.length} tasks (you ${mikeDone}/${mikeAll}, ops ${opsDone}/${opsAll}), ${daysLeft} days to the door · wrote docs/desk/DAYS.html, days-mike.ics, days-ops.ics`);
