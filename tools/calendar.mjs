/* ===========================================================================
   THE CALENDAR — what is due, by lane and weekday, and who owes it.
   [2026-09-02, Mike's ruling A on Reach: two lanes from 2026-09-14]

   Mike asks; Ops answers. This prints the answer and writes the page he can
   look at. It reads docs/calendar/CALENDAR.json, which Ops keeps current from
   what Mike says. It computes nothing about the site; it is a list of what
   has to exist by when.

     npm run calendar            this week and next, what posts and what must be prepared
     npm run calendar -- --week 2   a named week
     (always) writes docs/calendar/CALENDAR.html — linked from the desk

   The rule of preparation: what posts in week N is prepared by the Friday of
   week N-1. So on any day, "due to prepare" is next week's cells that are not
   ready, and "posting" is this week's.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const SRC = path.join(REPO, "docs", "calendar", "CALENDAR.json");
const OUT = path.join(REPO, "docs", "calendar", "CALENDAR.html");
const cal = JSON.parse(fs.readFileSync(SRC, "utf8"));
const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];

/* [2026-09-03, Mike's ruling] The Determination lane is not typed into
   CALENDAR.json; it is read from reels/determinations.json, the one place the
   day's question and its state live. A lane with `source: "reels"` is filled
   here, one cell per weekday row of the ledger, numbered from its first week. */
const SOURCES = {
  reels: {   // the determination
    file: "determinations.json",
    state: { open: "question not written", written: "question written · not shot", shot: "shot · in the packet", queued: "queued in Buffer", posted: "posted" },
    cell: (r, n) => `Determination ${String(n).padStart(2, "0")} — ${r.question ? `“${r.question}”` : "the question of the day"}`,
  },
  numbers: { // the musical number [2026-09-03, MUSIC.md Q1-Q6]
    file: "numbers.json",
    state: { open: "not shot", planned: "planned · not shot", shot: "shot · in the packet", queued: "queued in Buffer", posted: "posted" },
    cell: (r) => r.song ? `${r.song} — ${r.piece}` : "next song, by the numbers",
  },
};
for (const lane of cal.lanes.filter(l => SOURCES[l.source])) {
  const src = SOURCES[lane.source];
  const file = path.join(REPO, "reels", src.file);
  if (!fs.existsSync(file)) continue;
  const led = JSON.parse(fs.readFileSync(file, "utf8"));
  let n = 0;
  for (const w of cal.weeks) {
    if (lane.starts_week && w.n < lane.starts_week) continue;
    w[lane.id] = led.rows.filter(r => r.week === w.n).map(r => {
      n += 1;
      const open = lane.source === "numbers" && !r.song;
      return { day: r.day, piece: src.cell(r, n), state: open ? (r.note || "open") : (src.state[r.status] || r.status) };
    });
  }
}

const argWeek = (() => { const i = process.argv.indexOf("--week"); return i > -1 ? Number(process.argv[i + 1]) : null; })();
const todayNY = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" }); // YYYY-MM-DD
const addDays = (iso, n) => { const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const dateOf = (week, day) => addDays(week.monday, DAYS.indexOf(day));
const READY = /^(in the site|posted|recorded|written|ready|shot|queued)/i;
const isReady = s => READY.test(s) && !/not landed|unwritten|not chosen|undecided/i.test(s);

const weekOf = iso => cal.weeks.find(w => iso >= w.monday && iso <= addDays(w.monday, 6));
const thisWeek = argWeek ? cal.weeks.find(w => w.n === argWeek) : (weekOf(todayNY) || cal.weeks.find(w => w.monday > todayNY) || cal.weeks[0]);
const nextWeek = cal.weeks.find(w => w.n === thisWeek.n + 1);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ── the answer, printed ─────────────────────────────────────────────────── */
const lines = [];
lines.push(`THE CALENDAR — today ${todayNY} (New York). Posts go at ${cal.post_time}.`);
lines.push("");
lines.push(`WEEK ${thisWeek.n} (${thisWeek.monday}) — POSTING${thisWeek.note ? " · " + thisWeek.note : ""}`);
for (const lane of cal.lanes) {
  const cells = thisWeek[lane.id] || [];
  if (!cells.length) { lines.push(`  ${lane.name}: nothing this week${lane.starts_week ? ` (starts week ${lane.starts_week})` : ""}`); continue; }
  lines.push(`  ${lane.name} — posted by ${lane.posts}`);
  for (const c of cells) lines.push(`    ${c.day} ${dateOf(thisWeek, c.day)}  ${c.piece}  [${c.state}]${isReady(c.state) ? "" : "   ← not ready"}`);
}
lines.push("");
if (nextWeek) {
  lines.push(`WEEK ${nextWeek.n} (${nextWeek.monday}) — DUE TO PREPARE BY FRI ${addDays(thisWeek.monday, 4)}`);
  for (const lane of cal.lanes) {
    const cells = (nextWeek[lane.id] || []).filter(c => !isReady(c.state));
    if (!cells.length) { lines.push(`  ${lane.name}: ready`); continue; }
    lines.push(`  ${lane.name} — ${lane.writes} owes ${cells.length}:`);
    for (const c of cells) lines.push(`    ${c.day}  ${c.piece}  [${c.state}]`);
  }
} else lines.push("No week after this one is planned yet.");
console.log(lines.join("\n"));

/* ── the page ────────────────────────────────────────────────────────────── */
const css = `
:root{--paper:#f3f4f1;--paper-2:#e9ebe6;--ink:#1c2026;--ink-2:#4a515a;--ink-3:#7a828c;--rule:#cfd3cc;--gold:#b8974a;--gold-ink:#7a6122;--ok:#3f7a4f;--ok-bg:#e3efe4;--no:#a2711c;--no-bg:#f6ead2;--now:#6a4c93;--now-bg:#ebe4f3}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#171a1e;--paper-2:#1f2328;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--gold:#cdae63;--gold-ink:#dcc27f;--ok:#8fcb9c;--ok-bg:#213827;--no:#e0b465;--no-bg:#3a2e14;--now:#c2a8e6;--now-bg:#2e2440}}
:root[data-theme="dark"]{--paper:#171a1e;--paper-2:#1f2328;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--gold:#cdae63;--gold-ink:#dcc27f;--ok:#8fcb9c;--ok-bg:#213827;--no:#e0b465;--no-bg:#3a2e14;--now:#c2a8e6;--now-bg:#2e2440}
html{color-scheme:light dark}body{background:var(--paper);color:var(--ink);font-family:Geist,system-ui,sans-serif;font-size:15px;line-height:1.45;margin:0}
.wrap{max-width:1180px;margin:0 auto;padding:36px 28px 70px}h1{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:42px;margin:0 0 4px;letter-spacing:-.01em}
.sub{color:var(--ink-2);margin:0 0 26px;max-width:70ch}.eyebrow{font-family:ui-monospace,Menlo,monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3)}
h2{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:22px;margin:30px 0 8px}h2 small{font-family:ui-monospace,Menlo,monospace;font-weight:400;font-size:12px;color:var(--ink-3);margin-left:10px;letter-spacing:.04em}
table{border-collapse:collapse;width:100%;font-size:13.5px}th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--rule)}
th{font-family:ui-monospace,Menlo,monospace;font-weight:500;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-3);background:var(--paper-2)}
th.today,td.today{background:var(--now-bg)}td.lane{font-weight:600;white-space:nowrap;width:130px}td.lane small{display:block;font-weight:400;color:var(--ink-3);font-size:12px}
.p{font-weight:500}.s{display:block;font-size:12px;margin-top:2px}.ok{color:var(--ok)}.no{color:var(--no)}.wrapt{overflow-x:auto;border:1px solid var(--rule);border-radius:4px}
.due{margin-top:12px;padding:12px 16px;background:var(--no-bg);border-radius:4px;font-size:14px}.due b{color:var(--no)}
footer{margin-top:30px;border-top:1px solid var(--rule);padding-top:12px;font-family:ui-monospace,Menlo,monospace;font-size:12px;color:var(--ink-3)}
`;
const weekTable = w => {
  const isThis = w.n === thisWeek.n;
  const head = DAYS.map(d => { const iso = dateOf(w, d); return `<th class="${iso === todayNY ? "today" : ""}">${d}<br>${iso.slice(5)}</th>`; }).join("");
  const rows = cal.lanes.map(lane => {
    const cells = DAYS.map(d => {
      const c = (w[lane.id] || []).find(x => x.day === d);
      const iso = dateOf(w, d);
      if (!c) return `<td class="${iso === todayNY ? "today" : ""}"><span class="s" style="color:var(--ink-3)">—</span></td>`;
      return `<td class="${iso === todayNY ? "today" : ""}"><span class="p">${esc(c.piece)}</span><span class="s ${isReady(c.state) ? "ok" : "no"}">${esc(c.state)}</span></td>`;
    }).join("");
    return `<tr><td class="lane">${esc(lane.name)}<small>${esc(lane.writes)} writes · ${esc(lane.posts)} posts</small></td>${cells}</tr>`;
  }).join("");
  const due = (() => {
    const prev = cal.weeks.find(x => x.n === w.n - 1);
    const owed = cal.lanes.flatMap(l => (w[l.id] || []).filter(c => !isReady(c.state)).map(c => `${l.name}: ${c.piece}`));
    if (!prev || !owed.length) return "";
    return `<div class="due"><b>Prepare by FRI ${addDays(prev.monday, 4)}:</b> ${owed.length} piece(s) — ${owed.map(esc).join(" · ")}</div>`;
  })();
  return `<h2>Week ${w.n}<small>${w.monday}${isThis ? " · this week" : ""}${w.note ? " · " + esc(w.note) : ""}</small></h2>
<div class="wrapt"><table><thead><tr><th>lane</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>${due}`;
};
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Calendar</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Geist:wght@400;500;600&display=swap"><style>${css}</style></head><body>
<!-- the served copy for Mike is published from this same file; the wrapper tags above are for a local open -->
<div class="wrap">
<div class="eyebrow">Weird.Baby · what is due, by lane and weekday</div><h1>The Calendar</h1>
<p class="sub">Three lanes: the Record, which the site posts; the Determination, which you post, one reel a weekday from the day the machine is shown; and the Number, a live musical number a weekday from week two, its own post. Your rulings of 2026-09-02 and 2026-09-03. Posts go at ${esc(cal.post_time)}. What posts in a week is prepared by the Friday before. Ask and it answers: <code>npm run calendar</code>. Ops keeps it current; you never edit it.</p>
${cal.weeks.map(weekTable).join("\n")}
<footer>Generated from docs/calendar/CALENDAR.json by tools/calendar.mjs · today ${todayNY} New York · Ops instrument, never at a live address</footer>
</div></body></html>`;
fs.writeFileSync(OUT, html);
console.log(`\nwrote docs/calendar/CALENDAR.html`);
