/* ===========================================================================
   THE BOARD — the exec's board of lights, and the grade under it.
   [2026-09-18, Mike: "a board of lights that show where we are not on track
   for success ... It must be based on a proper plan to have meaning."]

     node tools/board.mjs            grades the plan, writes the three files
     node tools/board.mjs --as-of 2026-10-01    grades as if it were that day

   Reads: docs/desk/BOARD-PLAN.json (the plan: outcomes, columns, deliverables,
   gates, need-by dates, blockers, depends-on, the tasks that serve each),
   docs/CATALOGUE-20260918.json (the product columns are its rows with a
   launch-run day; `ruling` c drops a row, a or b earns the pitch gate),
   docs/desk/TASKS.json + TASKS.marks.json (is any work scheduled),
   reels/qa.json and reels/numbers.json (counted content).

   Writes: docs/desk/BOARD.json (the grade as data), docs/desk/BOARD-GRADE.md
   (the reds in the line format, and the orphans both ways), docs/desk/BOARD.html
   (the board). Shape and rules: docs/BOARD-PLAN-20260918.md.

   Percent complete is gate credit earned, never typed. A deliverable that is
   not done is NOT ON TRACK if any one holds:
     1. a gate's need-by date has passed;
     2. it is blocked, and the unblocking has no committed date, a date after
        the need-by, or a date that has itself passed;
     3. counted work is behind a straight line from its start to its need-by;
     4. something it depends on is not on track;
     5. no open task serves it (nobody is scheduled to do it).
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const read = p => JSON.parse(fs.readFileSync(path.join(REPO, p), "utf8"));
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const asOf = process.argv.indexOf("--as-of");
const today = asOf > 0 ? process.argv[asOf + 1] : new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
const md = d => d ? d.slice(5) : "—";

const P = read("docs/desk/BOARD-PLAN.json");
const CAT = read("docs/CATALOGUE-20260918.json");
const TASKS = read("docs/desk/TASKS.json").tasks;
let MARKS = {}; try { MARKS = read("docs/desk/TASKS.marks.json"); } catch {}
const taskDone = t => !!(t.done || MARKS[t.id]?.done);
const taskById = Object.fromEntries(TASKS.map(t => [t.id, t]));

/* counted content, read from the ledgers */
function measure(name, all) {
  try {
    if (name === "qa:questions") return read("reels/qa.json").rows.filter(r => r.date >= "2026-10-31" && r.question && !r.test && !r.hot).length;
    if (name === "numbers:pieces") return read("reels/numbers.json").pieces.filter(p => /^cut/.test(p.status || "") && !/-(alt|tight)$/.test(p.id)).length;
    if (name === "albums:shot") return all.filter(d => d.col === "albums" && d.gates?.shot?.done).length;
  } catch {}
  return null;
}

/* the product columns come from the catalogue: rows with a launch-run day */
const colById = Object.fromEntries(P.columns.map(c => [c.id, c]));
const deliverables = P.deliverables.map(d => ({ ...d }));
const later = {};
for (const c of P.columns.filter(c => c.catalogue)) {
  later[c.id] = [];
  for (const r of CAT.rows.filter(r => c.catalogue.kinds.includes(r.kind))) {
    const o = P.catalogue_overrides[r.id] || {};
    if (String(r.ruling || "").toLowerCase() === "c") continue;
    if (o.later || (o.must !== true && typeof r.day !== "number")) { later[c.id].push(r.name); continue; }
    const gates = { ...(o.gates || {}) };
    if (r.ruling && !gates.pitch) gates.pitch = { done: CAT.sitting, ev: `catalogue ruling ${r.ruling}` };
    const blocked = [...(o.blocked || [])];
    for (const b of P.catalogue_blocked_by_name) if (new RegExp(b.match).test(r.name)) blocked.push(b);
    deliverables.push({ id: r.id, col: c.id, name: r.name, owner: c.owner, gates, blocked, depends: o.depends || [] });
  }
}
const byId = Object.fromEntries(deliverables.map(d => [d.id, d]));

/* grade one deliverable */
function grade(d, seen = new Set()) {
  if (d._g) return d._g;
  const c = colById[d.col];
  const ladder = P.ladders[d.ladder || c.ladder].filter(g => !(d.skip || []).includes(g.id));
  const needOf = id => d.need_by?.[id] ?? c.need_by?.[id] ?? null;
  let earned = 0, total = 0; const open = [];
  for (const g of ladder) {
    const s = d.gates?.[g.id]; let f = 0;
    if (s?.done) f = 1;
    else if (s?.count) { const m = s.measure ? measure(s.measure, deliverables) : null; s._n = m ?? s.count[0]; f = Math.min(s._n / s.count[1], 1); }
    earned += g.w * f; total += g.w;
    if (f < 1) open.push({ ...g, need: needOf(g.id), state: s });
  }
  const pct = total ? earned / total : 0;
  const next = open.map(g => g.need).filter(Boolean).sort()[0] || null;
  const reasons = [];
  if (pct < 1) {
    for (const g of open) {
      /* a named blocker on the gate says why it is late; the bare 'overdue' line is for gates with none */
      const held = [...(c.blocked || []), ...(d.blocked || [])].some(x => x.gate === g.id);
      if (g.need && g.need < today && !held) reasons.push({ what: `${g.name}: needed ${md(g.need)}, not there`, owner: d.owner, need: g.need, rule: 1 });
      const s = g.state;
      if (s?.count && s.start && g.need && today > s.start && today <= g.need) {
        const want = Math.floor(s.count[1] * days(s.start, today) / days(s.start, g.need));
        if (s._n < want) reasons.push({ what: `${g.name}: ${s._n} of ${s.count[1]}, the pace wants ${want} by today`, owner: d.owner, need: g.need, rule: 3 });
      }
    }
    for (const b of [...(c.blocked || []), ...(d.blocked || [])]) {
      const g = open.find(x => x.id === b.gate); if (!g) continue;
      const need = g.need || next;
      if (!b.by) reasons.push({ what: `${b.what}: no date`, owner: b.owner, need, rule: 2 });
      else if (need && b.by > need) reasons.push({ what: `${b.what}: promised ${md(b.by)}, after the need`, owner: b.owner, need, rule: 2 });
      else if (b.by < today) reasons.push({ what: `${b.what}: was due ${md(b.by)}`, owner: b.owner, need, rule: 2 });
    }
    const ids = [...(c.tasks || []), ...(d.tasks || [])];
    if (!d.scheduled && !ids.some(id => taskById[id] && !taskDone(taskById[id]))) reasons.push({ what: "no work is scheduled for it", owner: d.owner === "Mike" ? "Ops to schedule, Mike" : "Ops", need: next, rule: 5 });
    if (!seen.has(d.id)) {
      seen.add(d.id);
      for (const id of d.depends || []) {
        const dep = byId[id]; if (!dep) continue;
        const g = grade(dep, seen);
        if (g.status === "off") reasons.push({ what: `waits on: ${dep.name}`, owner: g.reasons[0].owner, need: next, rule: 4 });
      }
    }
  }
  d._open = open.map(g => ({ id: g.id, name: g.name, need: g.need, who: d.who?.[g.id] || (g.who === "owner" || !g.who ? d.owner : g.who) }));
  d._g = { pct, next, reasons, status: pct >= 1 ? "done" : reasons.length ? "off" : "on" };
  return d._g;
}
deliverables.forEach(d => grade(d));

/* the columns */
const columns = P.columns.map(c => {
  const ds = deliverables.filter(d => d.col === c.id);
  const n = ds.length || 1;
  const done = ds.reduce((s, d) => s + d._g.pct, 0) / n;
  const off = ds.filter(d => d._g.status === "off").reduce((s, d) => s + (1 - d._g.pct), 0) / n;
  const on = Math.max(0, 1 - done - off);
  /* the pop-up: same blocker, same owner, same date = one line naming every thing it holds */
  const lines = {};
  for (const d of ds.filter(d => d._g.status === "off")) for (const r of d._g.reasons) {
    const k = `${r.what}|${r.owner}|${r.need}`;
    (lines[k] ||= { ...r, names: [] }).names.push(d.name);
  }
  return { id: c.id, group: c.group, name: c.name, outcome: c.outcome, count: ds.length, red: ds.filter(d => d._g.status === "off").length,
    done, on, off, later: later[c.id] || [], lines: Object.values(lines).sort((a, b) => (a.need || "9").localeCompare(b.need || "9")) };
});

/* orphans, both ways */
const named = new Set([...P.columns.flatMap(c => c.tasks || []), ...deliverables.flatMap(d => d.tasks || []), ...P.tasks_without_a_deliverable.accepted]);
const orphanTasks = TASKS.filter(t => !named.has(t.id) && !taskDone(t));
const ghostTasks = [...named].filter(id => !taskById[id]);

const redCount = deliverables.filter(d => d._g.status === "off").length;
const toM = days(today, P.launches[0].date), toR = days(today, P.launches[1].date);
const out = { as_of: today, must_have_ruled: P.ruled.must_have, deliverables: deliverables.length, not_on_track: redCount, columns,
  detail: deliverables.map(d => ({ id: d.id, col: d.col, name: d.name, owner: d.owner, pct: Math.round(d._g.pct * 100), status: d._g.status, next: d._g.next, reasons: d._g.reasons })) };
fs.writeFileSync(path.join(REPO, "docs/desk/BOARD.json"), JSON.stringify(out, null, 1) + "\n");

/* the grade on disk, in the ruled line format */
const lineOf = l => `${l.names.join(", ")} - ${l.what} (${l.owner}) - needed by ${md(l.need)}`;
const pc = x => `${Math.round(x * 100)}`.padStart(3);
const gradeMd = `# THE BOARD'S GRADE — ${today}

${toM} days to the Number (10-26), ${toR} to the door (10-30). ${deliverables.length} must-have deliverables${P.ruled.must_have ? "" : " (the must-have list is Ops' DRAFT until ruled)"}; **${redCount} not on track**.
Written by tools/board.mjs from docs/desk/BOARD-PLAN.json. Rules: docs/BOARD-PLAN-20260918.md.

\`\`\`
COLUMN                  done  on track  NOT on track   (things, red)
${columns.map(c => `${c.name.padEnd(22)} ${pc(c.done)}%     ${pc(c.on)}%        ${pc(c.off)}%      (${c.count}, ${c.red})`).join("\n")}
\`\`\`

## Not on track

${columns.filter(c => c.lines.length).map(c => `**${c.name}**\n\n\`\`\`\n${c.lines.map(lineOf).join("\n")}\n\`\`\``).join("\n\n") || "Nothing."}

## Tasks that serve no deliverable (challenge them, or name what they serve)

${orphanTasks.map(t => `- ${t.date} ${t.owner} \`${t.id}\` ${t.title}`).join("\n") || "None."}
${ghostTasks.length ? `\n## Tasks the plan names that the calendar does not have\n\n${ghostTasks.map(id => `- \`${id}\``).join("\n")}\n` : ""}`;
fs.writeFileSync(path.join(REPO, "docs/desk/BOARD-GRADE.md"), gradeMd);

/* the schedule: every open gate by the week it is needed, and what each week asks of Mike.
   An ask is one sitting's worth: the same gate on the same day counts once (24 pitches = one sitting). */
const monday = d => { const t = new Date(d + "T12:00:00Z"); t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 6) % 7)); return t.toISOString().slice(0, 10); };
const cap = P.capacity.mike_asks_per_week;
const weeks = {};
for (const d of deliverables) for (const g of d._open || []) {
  if (!g.need) continue;
  const w = (weeks[monday(g.need)] ||= {}), k = `${g.need}|${g.who}|${g.name}`;
  (w[k] ||= { ...g, things: [] }).things.push(d.name);
}
const weekBlocks = Object.keys(weeks).sort().map(w => {
  const lines = Object.values(weeks[w]).sort((x, y) => (x.need + x.who).localeCompare(y.need + y.who));
  const asks = lines.filter(l => l.who === "Mike").length, ops = lines.length - asks;
  const row = l => `${md(l.need)}  ${l.who.padEnd(4)}  ${l.name}: ${l.things.length > 3 ? `${l.things.length} things (${l.things.slice(0, 2).join(", ")}, ...)` : l.things.join(", ")}${l.need < today ? "   LATE" : ""}`;
  return { w, asks, ops, text: `## Week of ${md(w)}: Mike ${asks} ask${asks === 1 ? "" : "s"}${asks > cap ? ", OVER" : ""} · Ops ${ops}\n\n\`\`\`\n${lines.map(row).join("\n")}\n\`\`\`` };
});
const overWeeks = weekBlocks.filter(b => b.asks > cap);
fs.writeFileSync(path.join(REPO, "docs/desk/BOARD-SCHEDULE.md"), `# THE SCHEDULE — every open gate, by the week it is needed (as of ${today})

Written by tools/board.mjs from docs/desk/BOARD-PLAN.json, baseline v${P.baseline.version} (${P.baseline.set}). An "ask" is one sitting's worth of Mike: the same gate on the same day counts once. A week holds about ${cap} asks of Mike (his stated rhythm: one ruling sitting, one shoot, one desk block).

${weekBlocks.map(b => b.text).join("\n\n")}
`);

/* the board */
const css = `
:root{--paper:#f3f4f1;--paper-2:#e9ebe6;--card:#fbfbf9;--ink:#1c2026;--ink-2:#4a515a;--ink-3:#7a828c;--rule:#cfd3cc;--done:#3f6f57;--on:#bcd3c3;--on-line:#8fb39b;--off:#c2362f;--off-ink:#fff;--off-bg:#f7e3e0;--focus:#1c2026}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#171a1e;--paper-2:#1f2328;--card:#1c2025;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--done:#6fae88;--on:#2c4536;--on-line:#44664f;--off:#e2574e;--off-ink:#1a0d0c;--off-bg:#3a1e1c;--focus:#e6e8e4}}
:root[data-theme="dark"]{--paper:#171a1e;--paper-2:#1f2328;--card:#1c2025;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--done:#6fae88;--on:#2c4536;--on-line:#44664f;--off:#e2574e;--off-ink:#1a0d0c;--off-bg:#3a1e1c;--focus:#e6e8e4}
html{color-scheme:light dark}body{margin:0;background:var(--paper);color:var(--ink);font-family:Geist,system-ui,-apple-system,"Segoe UI",sans-serif;font-size:15px;line-height:1.5}
.wrap{max-width:1180px;margin:0 auto;padding-block:32px 60px;padding-inline:22px}
.eyebrow{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);margin:0 0 8px}
h1{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:40px;line-height:1.05;margin:0 0 6px;letter-spacing:-.01em;text-wrap:balance}
.sub{color:var(--ink-2);margin:0;max-width:68ch}
.top{display:flex;flex-wrap:wrap;gap:18px 40px;align-items:flex-end;justify-content:space-between;margin-bottom:26px}
.clock{display:flex;gap:26px;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--ink-3);font-variant-numeric:tabular-nums}
.clock b{display:block;font-family:Fraunces,Georgia,serif;font-weight:500;font-size:30px;line-height:1;color:var(--ink)}.clock .red b{color:var(--off)}
.scroll{overflow-x:auto}
.board{display:grid;grid-template-columns:34px repeat(${columns.length},minmax(64px,1fr));column-gap:10px;min-width:${34 + columns.length * 74}px}
.axis{grid-row:1;grid-column:1;height:340px;position:relative;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:10px;color:var(--ink-3)}
.axis span{position:absolute;right:4px;transform:translateY(50%)}
.col{grid-row:1;height:340px;display:flex;flex-direction:column;gap:2px;background:linear-gradient(var(--rule),var(--rule)) bottom/100% 1px no-repeat}
.seg{min-height:0;border-radius:0}.col>.seg:first-child{border-radius:4px 4px 0 0}
.seg.done{background:var(--done)}.seg.on{background:var(--on);box-shadow:inset 0 0 0 1px var(--on-line)}
button.seg.off{all:unset;box-sizing:border-box;display:flex;align-items:flex-start;justify-content:center;background:var(--off);color:var(--off-ink);cursor:pointer;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;font-weight:500;padding-top:4px;overflow:hidden;min-height:22px;border-radius:0}
.col>button.seg.off:first-child{border-radius:4px 4px 0 0}
button.seg.off:hover{filter:brightness(1.08)}button.seg.off:focus-visible{outline:2px solid var(--focus);outline-offset:2px}button.seg.off[aria-expanded="true"]{outline:2px solid var(--focus);outline-offset:2px}
.name{grid-row:2;font-size:12.5px;font-weight:600;line-height:1.2;padding-top:8px;text-align:center}
.grp{grid-row:3;margin-top:8px;border-top:1px solid var(--ink);padding-top:4px;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);text-align:center}
.legend{display:flex;flex-wrap:wrap;gap:6px 22px;margin:18px 0 0 44px;font-size:12.5px;color:var(--ink-2)}.legend i{display:inline-block;width:12px;height:12px;border-radius:2px;margin-right:7px;vertical-align:-1px}
.pop{margin-top:22px;border:1px solid var(--off);background:var(--off-bg);border-radius:4px;padding:14px 18px}
.pop h2{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:20px;margin:0 0 8px}.pop ul{margin:0;padding:0;list-style:none}
.pop li{border-top:1px solid var(--rule);padding:8px 0;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 18px}.pop li:first-child{border-top:0}
.pop .what b{font-weight:600}.pop .who{color:var(--ink-2)}.pop .by{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;white-space:nowrap;font-variant-numeric:tabular-nums}
.pop .names{grid-column:1/-1;color:var(--ink-2);font-size:13px}
.hint{margin:22px 0 0 44px;color:var(--ink-3);font-size:13px}
details{margin-top:34px;color:var(--ink-2);font-size:13px}summary{cursor:pointer;color:var(--ink-3);font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase}
table{border-collapse:collapse;margin-top:10px;font-variant-numeric:tabular-nums}th,td{text-align:right;padding:4px 14px 4px 0;border-bottom:1px solid var(--rule)}th:first-child,td:first-child{text-align:left}th{font-weight:500;color:var(--ink-3)}
footer{margin-top:30px;border-top:1px solid var(--rule);padding-top:12px;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11.5px;color:var(--ink-3);max-width:90ch}
@media(prefers-reduced-motion:no-preference){button.seg.off{transition:filter .12s}}
`;
const seg = (c) => {
  const parts = [];
  if (c.off > 0.0005) parts.push(`<button type="button" class="seg off" id="red-${c.id}" style="flex:${c.off.toFixed(4)} 1 0" data-col="${c.id}" aria-expanded="false" aria-controls="pop" title="${esc(c.name)}: ${Math.round(c.off * 100)}% not on track, ${c.red} of ${c.count}">${c.red}</button>`);
  if (c.on > 0.0005) parts.push(`<div class="seg on" style="flex:${c.on.toFixed(4)} 1 0" title="${esc(c.name)}: ${Math.round(c.on * 100)}% on track"></div>`);
  if (c.done > 0.0005) parts.push(`<div class="seg done" style="flex:${c.done.toFixed(4)} 1 0" title="${esc(c.name)}: ${Math.round(c.done * 100)}% done"></div>`);
  return parts.join("");
};
const groups = []; for (const c of columns) { const g = groups[groups.length - 1]; if (g && g.name === c.group) g.n += 1; else groups.push({ name: c.group, n: 1 }); }
let gc = 2; const grpHtml = groups.map(g => { const h = `<div class="grp" style="grid-column:${gc}/span ${g.n}">${esc(g.name)}</div>`; gc += g.n; return h; }).join("");
const popData = Object.fromEntries(columns.filter(c => c.lines.length).map(c => [c.id, { name: c.name, lines: c.lines.map(l => ({ what: l.what, owner: l.owner, need: md(l.need), names: l.names })) }]));
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>The Board of Lights</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"><style>${css}</style></head><body>
<div class="wrap">
<div class="top"><div><p class="eyebrow">Weird.Baby · launch readiness · ${today}</p><h1>The Board</h1>
<p class="sub">Where we are not on track. Red is the only thing to read; click it for what holds it and who.</p></div>
<div class="clock"><div><b>${toM}</b>days to the Number</div><div><b>${toR}</b>days to the door</div><div class="red"><b>${redCount}</b>of ${deliverables.length} not on track</div></div></div>
<div class="scroll"><div class="board" role="group" aria-label="Launch readiness by column">
<div class="axis">${[0, 25, 50, 75, 100].map(v => `<span style="bottom:${v}%">${v}</span>`).join("")}</div>
${columns.map((c, i) => `<div class="col" style="grid-column:${i + 2}">${seg(c)}</div><div class="name" style="grid-column:${i + 2}">${esc(c.name)}</div>`).join("")}
${grpHtml}</div></div>
<div class="legend"><span><i style="background:var(--off)"></i>not on track (the number is how many things)</span><span><i style="background:var(--on);box-shadow:inset 0 0 0 1px var(--on-line)"></i>on track, still to do</span><span><i style="background:var(--done)"></i>done: gates passed</span></div>
<div class="pop" id="pop" hidden aria-live="polite"></div>
<p class="hint" id="hint">${redCount ? "Click a red block." : "No red today."}</p>
<details><summary>The same, as numbers</summary><table><thead><tr><th>Column</th><th>Done</th><th>On track</th><th>Not on track</th><th>Things</th><th>Red</th></tr></thead><tbody>
${columns.map(c => `<tr><td>${esc(c.name)}</td><td>${Math.round(c.done * 100)}%</td><td>${Math.round(c.on * 100)}%</td><td>${Math.round(c.off * 100)}%</td><td>${c.count}</td><td>${c.red}</td></tr>`).join("")}</tbody></table></details>
<footer>${P.ruled.must_have ? `Must-have list ruled ${esc(P.ruled.must_have)}.` : "The must-have list is Ops' draft until the 09-20 sitting rules it."} Done is gates passed, with evidence; nobody types a percentage. Not on track: a need-by date passed; blocked with no date in time; counted work behind its pace; waiting on something red; or no work scheduled. tools/board.mjs · docs/desk/BOARD-PLAN.json · docs/BOARD-PLAN-20260918.md</footer>
</div>
<script>
const POP=${JSON.stringify(popData).replace(/</g, "\\u003c")};
const pop=document.getElementById("pop"),hint=document.getElementById("hint");let openId=null;
const e=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
document.querySelectorAll("button.seg.off").forEach(b=>b.addEventListener("click",()=>{
  const id=b.dataset.col;document.querySelectorAll("button.seg.off").forEach(x=>x.setAttribute("aria-expanded","false"));
  if(openId===id){pop.hidden=true;openId=null;hint.hidden=false;return;}
  const c=POP[id];openId=id;b.setAttribute("aria-expanded","true");hint.hidden=true;
  pop.innerHTML="<h2>"+e(c.name)+"</h2><ul>"+c.lines.map(l=>"<li><span class=\\"what\\"><b>"+e(l.what)+"</b> <span class=\\"who\\">("+e(l.owner)+")</span></span><span class=\\"by\\">needed by "+e(l.need)+"</span><span class=\\"names\\">"+e(l.names.join(", "))+"</span></li>").join("")+"</ul>";
  pop.hidden=false;}));
</script></body></html>`;
fs.writeFileSync(path.join(REPO, "docs/desk/BOARD.html"), html);

console.log(`THE BOARD ${today}: ${deliverables.length} deliverables, ${redCount} not on track`);
for (const c of columns) console.log(`  ${c.name.padEnd(22)} done ${pc(c.done)}%  on ${pc(c.on)}%  off ${pc(c.off)}%  (${c.count} things, ${c.red} red)`);
if (orphanTasks.length) console.log(`  tasks serving no deliverable: ${orphanTasks.map(t => t.id).join(", ")}`);
if (overWeeks.length) console.log(`  weeks that ask more of Mike than a week holds: ${overWeeks.map(b => `${md(b.w)} (${b.asks})`).join(", ")}`);
if (ghostTasks.length) console.log(`  named but not on the calendar: ${ghostTasks.join(", ")}`);
