/* ===========================================================================
   THE WORKSHEET — the page Mike writes in, and the reference page that got
   out of its way. [W1–W8 2026-08-07]
   ---------------------------------------------------------------------------
   WHAT THIS REPLACES AND WHY. `week1.html` was a good document and a bad
   instrument. It explained the rail scheme, the provenance model, the transfer
   classes, the bouncy ball law and five collisions BEFORE it showed a single
   headline, and then it had nowhere for Mike to write. It spent his attention
   describing the machine and gave him nothing to do with what was left. His
   own ruling: *"If it is reference, write it as such. If it is the firehose I
   have to drink from to do anything, thanks, pass."*

   So the material split in two and the split is the whole design:

     worksheet.html   THE INSTRUMENT. Ops on the left, an input on the right,
                      in his reading order — the headline of headlines first,
                      then the map, then ten day blocks. It saves as he types
                      and gathers itself into plain text on one button.
     reference.html   EVERYTHING THAT EXPLAINS THE MACHINE. Linked, never
                      inline. The rails, the transfer classes, the standing
                      rules, the runways, the ten collisions, the trackers.

   ═══ THE READING ORDER IS THE INSTRUCTION AND IT IS ALSO THE ARGUMENT ══════
   He consumes at his level the way a visitor consumes at theirs: the weekly
   arc, then the map of days, then the day itself, descending as far as he
   wants and stopping wherever he likes. Every level is complete on its own —
   which is why the map exists at all. A reader who stops after the map has the
   whole shape of two weeks and has read about forty words.

   ═══ THE MARKS ARE QUIET ON PURPOSE, AND THERE ARE THREE ══════════════════
   W7: mark everything Ops-derived exactly as the rail scheme already does, but
   quietly — the marks must not compete with the work.

     Ops                  blue, the default. Ops' sentence.
     your words           gold. VERBATIM, character for character, from what
                          Mike wrote. Only week two has any (see below).
     your rule, Ops words amber. He named the RULE; the sentence is Ops'.

   THE GOLD MARK IS NEW THIS ROUND AND IT IS THE HONEST HALF OF THE OLD RULE.
   Week one was spoken aloud and written down from the framing, so nothing in
   it is quotable and the gold rail was empty by construction. Week two arrived
   IN WRITING — a headline and six beats, still sitting in the instruction — so
   those strings are carried verbatim and marked as his. The old page could
   only say "none of this is yours"; this one can say which parts are.

   ═══ THE COLLECTOR IS THE THING THE LAST PAGE LACKED ENTIRELY ═════════════
   W4. Everything typed is retrievable and transportable: one button gathers
   every response into plain text, copies it in one action, and the text stays
   on screen so it can be selected by hand if the clipboard is refused. It
   persists in `localStorage` across reloads.

   TWO DELIBERATE REFUSALS IN THE COLLECTOR, BOTH SUBTRACTION:
   - It does NOT repeat Ops' paragraphs into the export. Ops already has them;
     what Ops needs back is what Mike wrote, keyed to a slot. Only the one-line
     Ops HEADLINE travels, so the paste reads standalone.
   - There is no "clear" button. A worksheet with a clear button is a worksheet
     one mis-click from empty, and nothing here is expensive enough to need it.

   AND ONE THING IT WILL NOT DO QUIETLY: if `localStorage` is refused — some
   browsers refuse it on `file://` — the page says so in red at the top rather
   than letting an hour of typing evaporate on a reload. A silent persistence
   layer that is not persisting is worse than none.
   =========================================================================== */
import { STAMP, esc, runwayBlock, OPS_CSS, page } from "./shell.mjs";
import {
  ORIGIN as W1_ORIGIN, WEEK as WEEK1, PRELUDE, DAYS as DAYS1,
  FRIDAY_FORMULA, RECORD_RULES, COLLISIONS as COLL1,
} from "../../reveal/week-one.mjs";
import {
  ORIGIN as W2_ORIGIN, WEEK as WEEK2, DAYS as DAYS2, COLLISIONS as COLL2,
} from "../../reveal/week-two.mjs";
import { TRANSFERS, CLASSES } from "../../reveal/transfers.mjs";

/* ── THE SLOT MODEL ──────────────────────────────────────────────────────
   One flat list, built once, used by the page, the map's mirrors and the
   collector. Its ids are what Mike pastes back to Ops, so they are stable,
   short and readable: W1.SUM, W1.D3.EXEC, W2.D5.NOTES. */
const FIELDS = [
  { k: "HEAD", label: "Headline", hint: "one line" },
  { k: "EXEC", label: "Executive summary", hint: "the paragraph a reader gets if they read nothing else" },
  { k: "NOTES", label: "Detailed sections, notes, etc.", hint: "anything: sections, order, what to include, what to cut" },
];

const WEEKS = [
  { w: WEEK1, days: DAYS1, origin: W1_ORIGIN, id: "W1" },
  { w: WEEK2, days: DAYS2, origin: W2_ORIGIN, id: "W2" },
];

function slotList() {
  const out = [];
  for (const { w, days, id } of WEEKS) {
    out.push({ id: `${id}.SUM`, where: `WEEK ${w.n} — summary headline`, ops: w.headline });
    for (const d of days) {
      for (const f of FIELDS) {
        out.push({
          id: `${id}.D${d.n}.${f.k}`,
          where: `WEEK ${w.n} — day ${d.n} ${d.dow} — ${f.label.toLowerCase()}`,
          /* only the one-line headline travels into the export; see the header */
          ops: f.k === "HEAD" ? d.headline : null,
        });
      }
    }
  }
  return out;
}

/* ── PIECES ─────────────────────────────────────────────────────────────── */
const opsMark = `<span class="ml">Ops</span>`;
const yoursMark = `<span class="ml y">yours</span>`;

function pair(slotId, opsHtml, { rows = 2, ph = "" } = {}) {
  return `<div class="pair">
  <div class="c ops">${opsMark}${opsHtml}</div>
  <div class="c yours">${yoursMark}<textarea data-slot="${esc(slotId)}" rows="${rows}"
    placeholder="${esc(ph)}" spellcheck="true"></textarea></div>
</div>`;
}

function dayBlock(weekId, w, d) {
  const beat = d.beat
    ? `<div class="beat">&ldquo;${esc(d.beat)}&rdquo;${d.beat2 ? ` &nbsp;+&nbsp; &ldquo;${esc(d.beat2)}&rdquo;` : ""}
       <span class="rail g">your words</span></div>`
    : "";
  const collide = d.collides
    ? `<p class="flag">One thing before you write this one: <b>${esc(d.collides)}</b> &mdash;
       this day is the only beat in either week that lands outside the transfer model's
       own window. <a href="reference.html#collisions">what that means, and the three ways out &rarr;</a></p>`
    : "";
  return `<section class="day" id="${weekId}-D${d.n}">
<div class="hd">
  <span class="n">Week ${w.n} &middot; Day ${d.n} &middot; ${esc(d.dow)}</span>
  ${beat}
</div>
<div class="bd">
${collide}
<div class="fld"><div class="fh">Headline</div>
${pair(`${weekId}.D${d.n}.HEAD`, `<p class="hl">${esc(d.headline)}</p>`, { rows: 2, ph: "your headline for this day" })}
</div>
<div class="fld"><div class="fh">Executive summary</div>
${pair(`${weekId}.D${d.n}.EXEC`, `<p>${esc(d.shape)}</p>`, { rows: 5, ph: "the paragraph a reader gets if they read nothing else" })}
</div>
<div class="fld"><div class="fh">Detailed sections, notes, etc.</div>
${pair(`${weekId}.D${d.n}.NOTES`,
    `<ul>${d.topics.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`,
    { rows: 5, ph: "sections, order, what to include, what to cut" })}
</div>
</div>
</section>`;
}

/* ── THE WORKSHEET'S OWN STYLESHEET ──────────────────────────────────────
   Appended to OPS_CSS so the two pages are one family. Everything here is
   about the two-column form and nothing here restyles the shared shell. */
const SHEET_CSS = `
body{padding-bottom:96px}
.mast{margin:0 0 26px}
.mast .lead{color:var(--dim);font-size:13.5px;margin:0 0 6px;max-width:74ch}
.mast .lead b{color:var(--fg)}
.warn{border:1px solid #6a3028;background:#241a19;color:var(--redfg);padding:11px 14px;
 border-radius:3px;margin:0 0 20px;font-size:13.5px;display:none}
.warn.on{display:block}
h2{margin-top:40px}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:0 20px;align-items:start}
.c{border-left:2px solid var(--line);padding:0 0 0 11px;min-width:0}
.c.ops{border-left-color:#33465a}
.c.yours{border-left-color:#6b5426}
.ml{display:block;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;
 color:var(--dim2);margin:0 0 5px}
.ml.y{color:#9a7f43}
.c p{margin:0 0 7px;font-size:14px}
.c p:last-child{margin:0}
.c ul{margin:0;padding-left:17px}
.c li{font-size:13.5px;margin:0 0 4px}
.c .hl{font-size:16px;color:var(--fg)}
/* THE FAMILY IS WRITTEN OUT AND THE REASON IS A REAL BUG THIS ROUND HIT:
   \`font: 14px/1.5 inherit\` is INVALID — the font shorthand takes a family, and
   \`inherit\` is only legal as the whole value. Chrome drops the declaration
   entirely, so the textareas came up in the UA's monospace at the UA's size,
   on the one page whose whole job is writing. The shorthand is used with an
   \`inherit\` family in three places in the shared OPS_CSS and has the same
   defect there; those are the tracker pages' filter controls, they are not
   this round's to change, and they are noted here so the next reader knows the
   pattern is a bug and not a house style. */
textarea{display:block;width:100%;background:#191820;border:1px solid var(--line);
 color:var(--fg);border-radius:3px;padding:9px 11px;resize:vertical;
 font:14px/1.55 -apple-system,"Segoe UI",system-ui,sans-serif;
 overflow:hidden;min-height:52px}
textarea:focus{outline:0;border-color:var(--gold)}
textarea.has{border-color:#5c4a22;background:#1c1a1a}
.fld{margin:0 0 18px}
.fld:last-child{margin:0}
.fh{font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--dim2);
 border-bottom:1px solid var(--line2);padding-bottom:4px;margin:0 0 9px}
.day{border:1px solid var(--line);border-radius:3px;margin:0 0 20px;overflow:hidden}
.day .hd{background:var(--panel);padding:11px 15px;border-bottom:1px solid var(--line)}
.day .hd .n{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim2)}
.day .bd{padding:15px}
.beat{margin-top:6px;font-size:15px;color:var(--gold);font-style:italic}
.rail.g{border-color:#7a5a20;color:var(--gold);font-style:normal;margin-left:6px}
.flag{margin:0 0 15px;padding:9px 12px;border-left:3px solid var(--amb);background:#201c19;
 font-size:13px;color:var(--dim)}
.flag b{color:var(--amb)}
.wk{border:1px solid var(--line);border-radius:3px;padding:15px;margin:0 0 16px;background:var(--panel)}
.wk .n{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim2);display:block;margin:0 0 9px}
.wk .c .hl{font-size:19px;letter-spacing:.03em}
.map{border:1px solid var(--line);border-radius:3px;overflow:hidden;margin:0 0 16px}
.map .mh{background:var(--panel);padding:9px 14px;font-size:11px;letter-spacing:.16em;
 text-transform:uppercase;color:var(--dim2);border-bottom:1px solid var(--line)}
.map .mr{display:grid;grid-template-columns:9ch 1fr 1fr;gap:0 16px;padding:9px 14px;
 border-bottom:1px solid var(--line2);align-items:baseline}
.map .mr:last-child{border-bottom:0}
.map .d{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim2)}
.map .o{font-size:14px}
.map .m{font-size:13.5px;color:var(--gold);white-space:pre-wrap;min-width:0;overflow-wrap:anywhere}
.map .m:empty::before{content:"—";color:var(--dim2)}
.map a.j{color:var(--dim2);font-size:11px;text-decoration:none;margin-left:6px}
.map a.j:hover{color:var(--blu)}
.cbar{position:fixed;left:0;right:0;bottom:0;z-index:30;background:#101015;
 border-top:1px solid var(--line);padding:9px 26px;display:flex;gap:14px;align-items:center;
 justify-content:space-between;flex-wrap:wrap}
.cbar .st{font-size:12px;color:var(--dim2)}
.cbar .st b{color:var(--fg)}
.cbar button,button.cta{background:var(--gold);border:0;color:#17150f;padding:9px 18px;border-radius:3px;
 font:600 11.5px/1.3 -apple-system,"Segoe UI",system-ui,sans-serif;
 letter-spacing:.13em;text-transform:uppercase;cursor:pointer}
.cbar button:active{transform:translateY(1px)}
.cbar .sec{background:transparent;border:1px solid var(--line);color:var(--dim)}
#out{width:100%;min-height:190px;background:#131218;border:1px solid var(--line);color:var(--dim);
 border-radius:3px;padding:11px 13px;font:12.5px/1.5 ui-monospace,Consolas,monospace;
 resize:vertical;white-space:pre;overflow:auto}
@media (max-width:900px){
 .pair{grid-template-columns:1fr;gap:14px 0}
 .c.yours{margin-top:2px}
 .map .mr{grid-template-columns:1fr;gap:4px 0}
 .map .d{margin-bottom:2px}
 .cbar{padding:8px 14px}
}
`;

/* ── THE CLIENT SCRIPT ───────────────────────────────────────────────────
   No backticks and no template literals anywhere below: this string is itself
   inside a template literal in this file, and a stray backtick would end the
   generator's string somewhere in the middle of Mike's instrument. Written in
   ES5-flavoured plain script for the same reason the tracker pages are — it
   runs off `file://` with no build step between it and him. */
function clientScript(slots) {
  return `<script>
(function(){
 "use strict";
 var SLOTS = ${JSON.stringify(slots)};
 var KEY = "wb.worksheet.${STAMP}";
 var store = null;
 try { window.localStorage.setItem("wb.probe","1"); window.localStorage.removeItem("wb.probe");
       store = window.localStorage; } catch (e) { store = null; }

 var warn = document.getElementById("warn");
 if (!store) { warn.className = "warn on"; }

 var areas = Array.prototype.slice.call(document.querySelectorAll("textarea[data-slot]"));
 var byId = {};
 areas.forEach(function(t){ byId[t.getAttribute("data-slot")] = t; });

 function grow(t){ t.style.height = "auto"; t.style.height = (t.scrollHeight + 2) + "px"; }

 function read(){
  if (!store) return {};
  try { return JSON.parse(store.getItem(KEY) || "{}"); } catch (e) { return {}; }
 }
 function values(){
  var v = {};
  areas.forEach(function(t){ var s = t.value.replace(/\\s+$/,""); if (s) v[t.getAttribute("data-slot")] = s; });
  return v;
 }

 var saveTimer = null, statEl = document.getElementById("stat");
 function two(n){ return (n < 10 ? "0" : "") + n; }
 function clock(){ var d = new Date(); return two(d.getHours()) + ":" + two(d.getMinutes()); }

 function stat(saved){
  var n = Object.keys(values()).length;
  var msg = "<b>" + n + "</b> of " + SLOTS.length + " filled";
  if (!store) msg += " \\u00b7 <b>not saved</b> \\u2014 this browser refused storage";
  else if (saved) msg += " \\u00b7 saved " + clock();
  statEl.innerHTML = msg;
 }

 function save(){
  if (store) { try { store.setItem(KEY, JSON.stringify(values())); } catch (e) {
   warn.className = "warn on"; store = null; } }
  stat(true);
 }

 function mirror(id){
  var m = document.querySelector('[data-mirror="' + id + '"]');
  if (m) m.textContent = byId[id] ? byId[id].value.replace(/\\s+$/,"") : "";
 }

 var saved = read();
 areas.forEach(function(t){
  var id = t.getAttribute("data-slot");
  if (saved[id]) t.value = saved[id];
  if (t.value) t.className = "has";
  grow(t); mirror(id);
  t.addEventListener("input", function(){
   t.className = t.value.replace(/\\s+$/,"") ? "has" : "";
   grow(t); mirror(id); stat(false);
   if (saveTimer) clearTimeout(saveTimer);
   saveTimer = setTimeout(save, 400);
  });
  t.addEventListener("blur", save);
 });
 stat(false);

 /* ---- THE COLLECTOR ---------------------------------------------------- */
 function collect(){
  var v = values(), lines = [], empty = [], n = 0;
  var d = new Date();
  lines.push("WEIRD.BABY MUSEUM - DICTATION WORKSHEET - MIKE'S RESPONSES");
  SLOTS.forEach(function(s){ if (v[s.id]) n++; else empty.push(s.id); });
  lines.push("captured " + d.getFullYear() + "-" + two(d.getMonth()+1) + "-" + two(d.getDate())
   + " " + clock() + "  -  " + n + " of " + SLOTS.length + " slots filled");
  lines.push("Ops' own paragraphs are not repeated here. Slot keys match the worksheet.");
  lines.push("");
  SLOTS.forEach(function(s){
   if (!v[s.id]) return;
   lines.push("[" + s.id + "] " + s.where);
   if (s.ops) lines.push("  ops: " + s.ops);
   if (v[s.id].indexOf("\\n") < 0) lines.push("  mike: " + v[s.id]);
   else { lines.push("  mike:"); lines.push(v[s.id]); }
   lines.push("");
  });
  if (empty.length) {
   lines.push("LEFT EMPTY (" + empty.length + "): " + empty.join(", "));
   lines.push("");
  }
  return lines.join("\\n");
 }

 var out = document.getElementById("out");
 var says = document.getElementById("says");
 function tell(msg){ says.textContent = msg; }

 function gather(){
  var text = collect();
  out.value = text;
  out.scrollTop = 0;
  if (navigator.clipboard && navigator.clipboard.writeText) {
   navigator.clipboard.writeText(text).then(function(){
    tell("Copied \\u2014 " + text.length + " characters on the clipboard. Paste it to Ops.");
   }, function(){ legacy(text); });
  } else { legacy(text); }
 }
 function legacy(text){
  out.focus(); out.select();
  var ok = false;
  try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
  tell(ok ? "Copied \\u2014 " + text.length + " characters on the clipboard. Paste it to Ops."
          : "The browser refused the clipboard. The text is selected below \\u2014 press Ctrl+C.");
 }

 Array.prototype.slice.call(document.querySelectorAll("[data-gather]")).forEach(function(b){
  b.addEventListener("click", function(e){
   e.preventDefault();
   gather();
   if (b.getAttribute("data-gather") === "jump") {
    document.getElementById("collector").scrollIntoView({ block: "start" });
   }
  });
 });
})();
</script>`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   W1–W7 — THE WORKSHEET
   ═══════════════════════════════════════════════════════════════════════════ */
export function buildWorksheet() {
  const slots = slotList();

  const weekBlock = ({ w, id }) => `<div class="wk" id="${id}">
<span class="n">Week ${w.n} &middot; the week's own summary headline</span>
${pair(`${id}.SUM`, `<p class="hl">${esc(w.headline)}</p>${w.headlineVerbatim
    ? `<p class="k" style="font-size:12px;margin-top:7px">Carried from what you wrote, word for word
       <span class="rail g">your words</span></p>`
    : `<p class="k" style="font-size:12px;margin-top:7px">Ops&rsquo; sentence, from the shape you spoke
       on ${esc(W1_ORIGIN.spokenOn)}.</p>`}`,
  { rows: 2, ph: "your headline for the week" })}
</div>`;

  const mapRow = (id, w, d) => `<div class="mr">
  <span class="d">Day ${d.n} &middot; ${esc(d.dow)}</span>
  <span class="o">${esc(d.headline)}<a class="j" href="#${id}-D${d.n}" title="go to the block">&darr;</a></span>
  <span class="m" data-mirror="${id}.D${d.n}.HEAD"></span>
</div>`;

  const body = `<div class="wrap">

<div class="mast">
<h1>The worksheet</h1>
<p class="lead"><b>Left column is Ops&rsquo;. Right column is yours, and it saves as you
type.</b> Two weeks, ten days. Start at the top and go down as far as you want &mdash;
every level is complete on its own. When you want to send it back, press
<b>copy everything</b> in the bar at the bottom.</p>
<p class="lead">Everything that explains how any of this works &mdash; the rails, the
transfer classes, the standing rules, the ten checks against the tree, the three
trackers &mdash; is on <a href="reference.html">the reference page</a>, and none of it
is on this one.</p>
</div>

<div class="warn" id="warn"><b>This browser will not let the page save.</b> Nothing you
type here will survive a reload. Press <b>copy everything</b> and paste it somewhere
safe before you close the tab.</div>

<h2>The headline of headlines &mdash; the two weeks</h2>
${WEEKS.map(weekBlock).join("\n")}

<h2>The map &mdash; every day, both weeks</h2>
<p class="lead" style="margin-bottom:14px">The whole shape in ten lines. <b>You do not
write here</b> &mdash; the right column fills itself in from the blocks below as you
go, so this is where you check that two weeks hang together. The arrow jumps to
the block.</p>
${WEEKS.map(({ w, days, id }) => `<div class="map">
<div class="mh">Week ${w.n} &middot; ${esc(w.headline)}</div>
${days.map(d => mapRow(id, w, d)).join("\n")}
</div>`).join("\n")}

<h2>Week 1 &mdash; the five days</h2>
${DAYS1.map(d => dayBlock("W1", WEEK1, d)).join("\n")}

<h2>Week 2 &mdash; the five days</h2>
<p class="lead" style="margin-bottom:16px">Each of these blocks opens with <b>your own
words</b> in gold &mdash; the beat you wrote for that day, carried across character for
character. Week one has none, because you spoke it and it was written down from the
shape rather than quoted. Everything under the gold line is Ops&rsquo;.</p>
${DAYS2.map(d => dayBlock("W2", WEEK2, d)).join("\n")}

<h2 id="collector">Everything you have written</h2>
<p class="lead" style="margin-bottom:14px">One press gathers every response into plain
text and puts it on the clipboard. <b>Ops&rsquo; paragraphs are not in it</b> &mdash; only
what you wrote, under a key for each slot, so it is short enough to read and paste.
If the clipboard is refused, the text is selected below and Ctrl+C takes it.</p>
<p style="margin:0 0 12px"><button class="cta" data-gather="here">Copy everything</button>
<span id="says" class="k" style="margin-left:12px;font-size:12.5px"></span></p>
<textarea id="out" readonly spellcheck="false"
 placeholder="press copy everything and your responses appear here"></textarea>

<footer>Ops&rsquo; half of this page is built from <code>reveal/week-one.mjs</code> and
<code>reveal/week-two.mjs</code> and is regenerated with <code>npm run dictation</code>
&mdash; <b>which will not touch anything you have typed</b>, because your responses live
in the browser and never in the file. The reference page carries where every left-hand
line came from. Ops&#8209;to&#8209;Mike, ${STAMP}; not part of the museum.</footer>
</div>

<div class="cbar">
 <span class="st" id="stat"></span>
 <span>
  <a href="reference.html" style="font-size:11.5px;color:var(--dim2);margin-right:14px">reference &rarr;</a>
  <button data-gather="jump">Copy everything</button>
 </span>
</div>
${clientScript(slots)}`;

  return page({
    title: `THE WORKSHEET — WEEKS ONE AND TWO — ${STAMP}`,
    css: OPS_CSS + SHEET_CSS,
    body,
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   W5/W8 — THE REFERENCE PAGE
   Everything the worksheet used to say before it let him do anything.
   ═══════════════════════════════════════════════════════════════════════════ */
export function buildReference({ ledger, artifacts, eggs, ruledOn }) {
  const rowsOf = c => ledger.rows.filter(r => r.transfer === c).length;
  const arrived = ledger.rows.filter(r => r.transfer === "BLAST" || r.transfer === "UNLOCK").length;
  const notYet = ledger.rows.length - arrived;

  const ALL_COLL = [
    ...COLL1.map(c => ({ ...c, week: 1 })),
    ...COLL2.map(c => ({ ...c, week: 2 })),
  ];
  const nOpen = ALL_COLL.filter(c => c.open).length;
  const nRuled = ALL_COLL.filter(c => !c.open && c.ruled).length;

  const collBlock = c => `<div class="day"><div class="hd">
  <span class="n">${esc(c.id)} &middot; week ${c.week} &middot; ${c.open ? "UNRESOLVED" : c.ruled ? "RULED" : "agrees"}</span>
  <span class="slot" style="color:${c.open ? "var(--red)" : c.ruled ? "var(--gold)" : "var(--grn)"};font-size:15px;font-style:normal">${esc(c.title)}</span>
</div><div class="bd">
  <div class="scaf"><span class="lbl">the check <span class="rail">Ops</span></span>
    <p style="margin:0 0 6px">${esc(c.check)}</p>
    <p class="k" style="margin:0;font-size:12px">Settled by <code>${esc(c.derivedFrom)}</code></p></div>
${c.ruled ? `  <div class="mine"><span class="lbl">yours &middot; the ruling, ${esc(ruledOn)}</span>
    <p style="margin:0 0 6px">${esc(c.ruled)}</p>
    ${c.also ? `<p class="k" style="margin:0;font-size:12.5px">${esc(c.also)}</p>` : ""}</div>` : ""}
${c.open ? `  <div class="mine"><span class="lbl">yours &middot; the decision</span>
    <p style="margin:0 0 6px">${esc(c.open)}</p>
    ${c.also ? `<p class="k" style="margin:0;font-size:12.5px">${esc(c.also)}</p>` : ""}</div>` : ""}
</div></div>`;

  const body = `<div class="wrap">
<p class="back"><a href="worksheet.html">&larr; back to the worksheet</a> &middot;
<a href="index.html">the dictation prep</a> &middot; Ops&#8209;to&#8209;Mike, ${STAMP} &middot; not part of the museum</p>

<h1>Reference</h1>
<p class="sub">Everything that explains the machine, off the worksheet and in one place</p>

<div class="note">
<p><b>THIS PAGE EXISTS BECAUSE THE LAST ONE PUT ALL OF IT IN FRONT OF THE WORK.</b>
Nothing here is needed to write a headline. It is here for when you want to know why
a left-hand column says what it says, or what the museum will and will not let a day
reach for. <a href="worksheet.html">The worksheet is where the writing happens &rarr;</a></p>
</div>

<h2>The three marks, and what each one promises</h2>
<div class="tw"><table>
<thead><tr><th style="width:22%">mark</th><th style="width:26%">means</th><th>the promise it makes</th></tr></thead>
<tbody>
<tr><td><span class="rail">Ops</span></td><td>Ops wrote this sentence.</td>
    <td>The <i>shape</i> is yours; the words are not. Change anything. It is a draft to argue with, and arguing with a draft is faster than starting from a blank line &mdash; which is the only reason it exists.</td></tr>
<tr><td><span class="rail g">your words</span></td><td>Verbatim, character for character.</td>
    <td><b>Nothing marked gold has been reworded, ever.</b> Only week two has any: you wrote its headline and six beats down, so they could be carried exactly. A gold string in the data files may be deleted but never edited &mdash; if it needs different words it stops being yours and moves to a blue field.</td></tr>
<tr><td><span class="rail m">your rule &middot; Ops wording</span></td><td>You named the rule; Ops wrote the sentence.</td>
    <td>The Friday formula, the standing Record rules, the bouncy ball law. The rule is yours and the sentence is not, which is why it is amber and not gold.</td></tr>
</tbody></table></div>
<p class="k" style="font-size:12.5px;margin-top:10px"><b>The inverse error matters as
much as the obvious one.</b> A paraphrase in gold becomes indistinguishable from
something you said; but your own sentence left in blue gets quietly &ldquo;improved&rdquo;
by the next round. That is why week two carries a gold seam and week one carries none.</p>

<h2>Where the two weeks came from</h2>
<div class="tw"><table>
<thead><tr><th style="width:14%">week</th><th style="width:22%">how it reached Ops</th><th>what that makes quotable</th></tr></thead>
<tbody>
<tr><td><b>Week 1</b><div class="k">${esc(WEEK1.headline)}</div></td>
    <td>Spoken aloud, ${esc(W1_ORIGIN.spokenOn)}.</td>
    <td><b>Nothing.</b> Ops structured it from the framing and wrote every sentence, including the week headline. ${esc(W1_ORIGIN.rule)}</td></tr>
<tr><td><b>Week 2</b><div class="k">${esc(WEEK2.headline)}</div></td>
    <td>In writing, ${esc(W2_ORIGIN.writtenOn)}.</td>
    <td><b>The headline and six beats.</b> ${esc(W2_ORIGIN.rule)}</td></tr>
</tbody></table></div>
<p class="k" style="font-size:12.5px;margin-top:10px"><b>ONE STRUCTURING DECISION WAS
MADE AND IT IS THE ONLY ONE WORTH ARGUING WITH.</b> Six beats, five days, Friday fixed
by the sixth &mdash; so exactly one merge was needed. Day 4 holds two of your beats,
<i>the unlabeled table holding more codes</i> and <i>the codes that fail when typed
directly</i>, because they are one object and its property. Days 1&ndash;3 and 5 are
your own sequence in your own order.</p>

<h2>The weekend week one is named after</h2>
<div class="note" style="margin-bottom:14px"><p>Not a day of week one &mdash; it is what
happened before the museum opened, and four of the five days point back at it.
<b>The transfer model already calls this window &ldquo;Friday to Sunday, pre-launch&rdquo;</b>
and was written on 5 August from the asset timeline, without reference to this outline.
They agree on the weekend independently; see <a href="#collisions">W&#8209;2</a>.</p></div>
<div class="scaf" style="margin-bottom:26px">
  <span class="lbl">Ops &middot; the prelude, structured <span class="rail">Ops</span></span>
  <ul class="tl">
${PRELUDE.map(p => `    <li><span class="at">${esc(p.at)}</span><span>${esc(p.what)}</span></li>`).join("\n")}
  </ul>
</div>

<h2>What a week is allowed to reach for</h2>
<div class="tw"><table>
<thead><tr><th>class</th><th>window</th><th>what it carries</th><th>rows</th><th>in hand by week 1</th></tr></thead>
<tbody>
${CLASSES.map(c => {
    const t = TRANSFERS[c];
    const inHand = t.week === 0;
    return `<tr><td><b>${esc(c)}</b></td><td>${esc(t.name)}</td><td>${esc(t.holds)}</td><td>${rowsOf(c)}</td>
  <td><span class="tag ${inHand ? "y" : "n"}">${inHand ? "YES" : "NO"}</span></td></tr>`;
  }).join("\n")}
</tbody></table></div>
<p class="k" style="font-size:12.5px;margin-top:10px"><b>${arrived} things have arrived
and ${notYet} have not.</b> The rule is absolute and checked: an asset may only be SHOWN
after it has been TRANSFERRED. Week one is all BLAST and one UNLOCK; week two is four
UNLOCKs and <b>one PACKAGE that lands a week early</b> &mdash; the only beat in either
week outside its own window, and the only thing on this page that needs a decision from
you (<a href="#collisions">X&#8209;1</a>).</p>

<h2>The Friday formula</h2>
<div class="scaf" style="margin-bottom:26px">
  <span class="lbl">${esc(FRIDAY_FORMULA.name)} <span class="rail m">your rule &middot; Ops wording</span></span>
  <p style="margin:0 0 8px">${esc(FRIDAY_FORMULA.claim)}</p>
  <ul style="margin:0">${FRIDAY_FORMULA.body.map(b => `<li>${esc(b)}</li>`).join("")}</ul>
  <p class="k" style="margin:8px 0 0;font-size:12.5px">Both weeks end on it: a password
  short enough, then a box on a porch at four o'clock. Two Fridays is the first evidence
  the form holds &mdash; see <a href="#collisions">X&#8209;4</a>.</p>
</div>

<h2>Standing rules for the Record</h2>
<div class="note" style="margin-bottom:14px"><p>Not week-one rules &mdash; the Record's
own form. They are here because <b>four of the five change what a day is allowed to
be</b>, and the bearing of each is spelled out rather than left to be worked out at
dictation speed.</p></div>
<div class="tw"><table>
<thead><tr><th style="width:44%">the rule</th><th>what it does to a week</th></tr></thead>
<tbody>
${RECORD_RULES.map(r => `<tr>
  <td><span class="rail m">your rule &middot; Ops wording</span><div style="margin-top:5px">${esc(r.rule)}</div></td>
  <td>${esc(r.bearing)}</td></tr>`).join("\n")}
</tbody></table></div>

<h2>The bouncy ball law, and the two runways</h2>
${runwayBlock(artifacts.runways, "the " + artifacts.waiting + " pictures an entry can reach for today")}

<h2 id="collisions">Where the outlines meet the tree &mdash; ${ALL_COLL.length} checks</h2>
<div class="note" style="margin-bottom:14px"><p>Each of these is a claim an outline
makes, run against what the repository actually holds. <b>${nOpen} of the
${ALL_COLL.length} is unresolved</b> and is drawn in red; <b>${nRuled} you have already
ruled on</b>, and those carry your ruling in gold. The rest are agreements &mdash; and
three of them are worth knowing about, because nobody arranged them.</p>
<p class="ask"><b>A RULED CHECK IS NOT DELETED FROM THIS PAGE.</b> The collision was
real, it is why the ruling was needed, and a page that quietly drops what it used to
say cannot be checked against itself a week later.</p></div>
${ALL_COLL.map(collBlock).join("\n")}

<h2>The three trackers</h2>
<div class="note" style="margin-bottom:14px"><p>Deliberately <b>not</b> on the worksheet.
They answer <i>what may I reach for</i>, which is a different question from <i>what does
this day say</i>, and putting them beside the writing was most of what made the last page
unusable. They are here, and they are one click away when you want them.</p></div>
<div class="cards">
<div class="card">
  <h4><a href="artifacts.html">The artifact tracker</a></h4>
  <p class="id">what you can reach for today</p>
  <p>${artifacts.addressed} addressable files joined to ${ledger.rows.length} revealable
  things, filterable. <b>${artifacts.waiting} pictures of the machines are behind the
  stage door</b>, each one entry away from a wall; exactly one file has ever been
  delivered.</p>
  <p class="meta">All ${artifacts.runways.unassigned.n} assets are unassigned to a
  bucket, so the precious runway is a bound and not a number.</p>
</div>
<div class="card">
  <h4><a href="eggs.html">The egg tracker</a></h4>
  <p class="id">what is hidden, and what is only an idea</p>
  <p>${eggs.n} ledgered eggs &mdash; ${eggs.planted} planted, ${eggs.waiting} waiting &mdash;
  each with its mechanism, what it needs before it can be planted, and where it stands.</p>
  <p class="meta">Four eggs have no written form anywhere but their ledger row. Nothing
  in this museum reports an egg being tripped.</p>
</div>
<div class="card">
  <h4><a href="specsheet.html">The in-story spec sheet</a></h4>
  <p class="id">the thing to author from</p>
  <p>Every piece of story-generated technical data about both machines, from both
  repositories, set as a period one-sheet. Marked <b>asserted</b>, <b>implied</b>,
  <b>contradicted</b> or <b>absent</b>; where two sources disagree, both readings print.</p>
  <p class="meta">Only the in-story specs count. The real board, the real filenames and
  the real dates are the provenance of a prop, and a spec sheet is not a provenance record.</p>
</div>
</div>

<h2>Two rulings of ${esc(ruledOn)}, and what they moved</h2>
<div class="note">
<p><b>THE BOUNCY BALL LAW CAPS POINTS OF FOCUS, NOT ASSETS.</b> Humans remember one or
two things; ten things reduces the odds they keep the one that matters &mdash; and it
does <i>not</i> mean the museum may not show more pictures. <b>Two buckets:</b> the
<b>precious</b> one is two or three genuine reveals a <i>week</i>; the <b>dump</b> is
everything else, and it has <b>no ceiling</b>. Ten manual pages arriving is ONE point of
focus. <b>The bucket is a field on every asset, it is yours, and Ops will not guess it.</b></p>
<p><b>RECORD 013 WAS A PROTOTYPE.</b> Not day one, no re-dating, no defending; the real
Record starts at <b>001</b>, when you dictate it. It is <b>kept rather than retired</b>,
on your own criterion &mdash; it is the only thing exercising the entry renderer, the
index budgets, the per-entry ledger derivation and the one delivered picture. It is
marked as the prototype here and in the ledger and <b>nowhere on the glass</b>. The one
thing left is its number.</p>
</div>

<h2>How the worksheet keeps what you type</h2>
<div class="note">
<p><b>In the browser, on your machine, and nowhere else.</b> Your responses live in this
browser's local storage under one key, so a reload &mdash; or closing the tab and coming
back &mdash; finds them where you left them. They are never written into the repository,
which is also why <code>npm run dictation</code> can regenerate the left-hand column
without touching a word of yours.</p>
<p><b>The consequence, stated because it is the one that could cost you an hour:</b> a
different browser, a different machine, or a cleared cache is a different worksheet.
<b>Press <i>copy everything</i> and paste it somewhere before you switch.</b> If the
browser refuses storage at all, the worksheet says so in red at the top rather than
letting the typing evaporate quietly.</p>
</div>

<footer>Built from <code>reveal/week-one.mjs</code>, <code>reveal/week-two.mjs</code>,
<code>reveal/transfers.mjs</code>, <code>reveal/focus.mjs</code>,
<code>reveal/ledger.json</code> and <code>provenance/asset-table.json</code>; regenerate
with <code>npm run dictation</code>. Nothing on this page was invented &mdash; every
figure, class and check is carried from one of those files with its source named.</footer>
</div>`;

  return page({ title: `REFERENCE — THE WORKSHEET — ${STAMP}`, css: OPS_CSS, body });
}
