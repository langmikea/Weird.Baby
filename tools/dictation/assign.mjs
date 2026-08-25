#!/usr/bin/env node
/* ===========================================================================
   WEEK ONE — WHAT THE MUSEUM CAN SHOW, AND WHICH RECORD SHOWS IT.
   ===========================================================================

   [J6 2026-08-13] MIKE: *"That is how the watch is made; I asked what time it
   was."* This rewrite is that sentence applied to every element on the page.

   THE TEST FOR ANYTHING ON THIS SURFACE: does it help him JUDGE THE THING —
   see it, hear it, zoom it, read it — or say which Record reveals it? If not,
   it is watchmaking and it is gone. Ops' procedure, the ledger's mechanics and
   what Ops must do next are all Ops' business.

   ── WHAT CAME OFF, AND WHY EACH WAS THE SAME MISTAKE ───────────────────────
   · "flip its state in reveal/ledger-declare.mjs, npm run reveal:build,
     deploy" — Ops narrating its own job on his surface. Deleted, not moved.
   · "NEEDS DECLARING", "NEEDS A COPY", "REBUILDING" and every status of that
     shape. HIS RULE: *"Tells me what you need, not what I am to do. If it is
     ready to go from MY vantage point, and your part is under control, it is
     green to me."* So a thing he can choose is simply THERE, with no badge.
   · The green READY badge on 143 tiles. A word repeated 143 times is not
     information, it is wallpaper.
   · Paths and filenames on the face of a tile — *"Humans don't want the path
     and filename."*
   · The ledger row id, build state and class.
   · Rows with no file behind them. A thing the museum does not have is not a
     choice; it was drawing a red tile that only described Ops' bookkeeping.
     Counted and reported, not shown.

   ── WHAT A TILE DOES NOW ───────────────────────────────────────────────────
   It shows the thing, and it takes his answer. The answer is ON the tile —
   five numbered buttons, one per Record — because the day is the decision.
   Setting a mode in one corner and then clicking in another was a mechanism
   he had to learn before he could say anything.

   ── SIZED TO WHAT EACH KIND NEEDS (A3 / C2 / C3) ───────────────────────────
   *"Using a full height tile for audio is distracting in the other
   direction."* Sizes live in SECTIONS' `kind`, in one place:
     read   a card with the page in it + a zoomable viewer. A manual page IS
            an image and the only question about it is whether the type reads.
     look   the same card. The picture is the information.
     hear   a ROW, not a card. A recording has nothing to look at, so a card
            would be 130px of nothing. Native player, preload="none".
     say    a row with no media at all — a line of text and the buttons.
   Standardised where it helps (every card is one width, every row one height)
   and varied where it does not (a card is 190px tall, a row is 46px).

   ── THE LABELS, AND THE HOLE UNDER THEM (A4) ───────────────────────────────
   8 of 144 assets carry a written description. The other 136 have never been
   described, so a label must be DERIVED — and derivation is only honest where
   the structure really encodes something:
     · a manual page number is a position in a book        -> "Page 12"
     · a build card and track are a real address           -> "Card 18 · track 004"
     · a tuning sheet names the page it compares           -> "Tuning · page 8"
     · a descriptive stem is a description somebody wrote  -> "Top monitor"
   Where none of that holds — three camera-numbered recordings and two dated
   renders — there is nothing but a filename. The tile says "no description on
   file" rather than printing it, and the count is reported. That is a gap in
   the asset table's `what` field, not something to invent here.
   =========================================================================== */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { esc, page, OPS_CSS } from "./shell.mjs";
import { thumbnails, diskHref } from "./lighttable.mjs";
/* [2026-08-13] THE SHELF IS SHARED. `buildShelf` is this file's own former
   `buildRows` moved out whole so the shorts tool reads the SAME list — the
   packet's words: "not a parallel list". Proved byte-identical across the
   move. RULED_OUT, SECTIONS and labelOf went with it. */
import { buildShelf, SECTIONS, RULED_OUT } from "./shelf.mjs";
import { entries as recordEntries, summaries, draftEntries as draftRecordEntries } from "../../reveal/record-entries.mjs";
import { SIGNAGE, delivered } from "../../reveal/delivery.mjs";
import { GOVERNED_PREFIX } from "../../reveal/placement.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const OUT = path.join(REPO, "docs", "dictation-20260807", "assign.html");
const TABLE = path.join(REPO, "provenance", "asset-table.json");
const LEDGER = path.join(REPO, "reveal", "ledger.json");
const FRESH = process.argv.includes("--fresh");
const DAYS = 5;

/* ═══ STORY EVENTS ═════════════════════════════════════════════════════════
   A held ledger row whose thing EXISTS is a choice he can make, so it is
   unmarked like any picture — what Ops does afterwards is Ops' business (B2).
   A NOT_BUILT row is not a choice at all and is left out, the same as a
   picture with no file. Counted and reported. */
function buildEvents() {
  const rows = JSON.parse(fs.readFileSync(LEDGER, "utf8")).rows || [];
  const held = rows.filter(r => r.state === "HELD");
  const live = held.filter(r => r.build === "LIVE" || r.build === "PARTIAL");
  const CLS = {
    surface: "Rooms and surfaces the museum is holding",
    machine: "The Portal's instruments", egg: "Eggs", sound: "Sounds it holds",
    document: "Documents and objects", artifact: "Documents and objects",
    prop: "Documents and objects", tool: "The museum's own instruments",
  };
  return {
    events: live.map(r => ({
      id: "event:" + r.id, section: "evt:" + (CLS[r.cls] || "Other things"),
      label: r.name || r.id,
    })),
    notBuilt: held.length - live.length,
  };
}

/* ═══ THE FIVE DAYS ════════════════════════════════════════════════════════ */
const STANDING = {
  1: ["The Robots wing opens. It is hidden until the Record has an entry, so "
    + "posting 001 opens it. Nothing to arrange."],
};
/* [2026-08-24] THE DAY COMES OFF THE ENTRY, NOT OFF THE LOOP COUNTER.
   Mike's SED ruling: the calendar is dumb — `recordDay(n)` is `epoch + (n − 1)`
   with no weekend logic and no holiday table, ever — and WHICH days get a Record
   is decided by which entries exist. **The number is a LABEL; the entry's own
   `date` is the authority.** This walked `n = 1..DAYS` calling `recordDay(n)`,
   which drew a grid of five consecutive days and hung whatever entry shared that
   number on each: right only while every Record falls on the day its number
   names. It now walks the ENTRIES, in date order. A gap in the numbers is not a
   defect and this page must not draw one as a missing day. */
function buildDays() {
  const sums = summaries(), live = recordEntries();
  const WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOf = (() => {
    const d = draftRecordEntries(); const l = d.entries || d;
    return (Array.isArray(l) ? l : Object.values(l))
      .filter(e => e.date).map(e => [e.no, e.date])
      .sort((a, b) => a[1].localeCompare(b[1]));
  })();
  const out = [];
  for (const [n, date] of dayOf) {
    const s = sums.find(x => x.no === n) || {};
    const e = live.find(x => x.no === n) || {};
    out.push({ no: n, date, weekday: WD[new Date(date + "T12:00:00Z").getUTCDay()],
      title: s.title || null, already: (e.assets || []).slice(),
      standing: STANDING[n] || [] });
  }
  return out;
}

/* ═══ CSS ══════════════════════════════════════════════════════════════════
   No backtick below: this sits inside a template literal and one would close it. */
const CSS = OPS_CSS + `
.as-wrap{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:22px;align-items:start}
@media (max-width:1100px){.as-wrap{grid-template-columns:1fr}}
.as-top{position:sticky;top:0;z-index:30;background:var(--paper,#17150f);
  border-bottom:1px solid var(--rule,#3a3529);padding:10px 0 9px;margin:0 0 14px}
.as-shelf{font-size:13px;line-height:1.5}
.as-shelf b{color:var(--gold,#b8974a)}
.as-shelf .dim{opacity:.6}
#as-banner{display:none;background:#5c1618;border:1px solid #a33;color:#ffd9d9;
  padding:9px 12px;margin:8px 0 0;font-size:12.5px;line-height:1.45}
#as-banner.as-on{display:block}

/* SECTIONS. Native <details>: it collapses with no script at all, which is
   what a file:// page wants, and the open state belongs to the element. */
details.as-sec{border:1px solid var(--rule,#3a3529);border-radius:2px;margin:0 0 8px;background:#131209}
details.as-sec>summary{cursor:pointer;padding:11px 13px;font-size:13.5px;letter-spacing:.03em;
  list-style:none;display:flex;align-items:baseline;gap:10px}
details.as-sec>summary::-webkit-details-marker{display:none}
details.as-sec>summary:hover{background:#1a1810}
details.as-sec>summary .as-caret{opacity:.5;font-size:10px;width:9px;flex:0 0 9px}
details.as-sec[open]>summary{border-bottom:1px solid var(--rule,#3a3529)}
details.as-sec[open]>summary .as-caret{transform:rotate(90deg)}
details.as-sec>summary .as-n{margin-left:auto;opacity:.6;font-size:12px}
details.as-sec>summary .as-mine{color:var(--gold,#b8974a);font-size:12px}
.as-body{padding:12px 13px 14px}
.as-blurb{font-size:12.5px;opacity:.72;margin:0 0 11px;max-width:74ch;line-height:1.5}

/* CARDS — where the picture is the information */
.as-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(152px,1fr));gap:11px}
figure.as-card{margin:0;border:1px solid var(--rule,#3a3529);border-radius:2px;
  background:#0f0e0a;position:relative;overflow:hidden}
figure.as-card img{display:block;width:100%;height:130px;object-fit:contain;
  background:#07070a;cursor:zoom-in}
figure.as-card .as-lab{padding:7px 8px 3px;font-size:11.5px;line-height:1.35}
figure.as-card.as-on{border-color:var(--gold,#b8974a);box-shadow:inset 0 0 0 2px var(--gold,#b8974a)}

/* ROWS — for audio and for story events (C2) */
.as-rows{display:flex;flex-direction:column;gap:6px}
.as-row{display:flex;align-items:center;gap:12px;border:1px solid var(--rule,#3a3529);
  border-radius:2px;background:#0f0e0a;padding:7px 10px}
.as-row.as-on{border-color:var(--gold,#b8974a);box-shadow:inset 0 0 0 1px var(--gold,#b8974a)}
.as-row .as-lab{flex:0 0 165px;font-size:12px;line-height:1.35}
.as-row audio{height:32px;flex:1 1 auto;min-width:150px;max-width:330px}
.as-row.as-evt .as-lab{flex:1 1 auto}

/* THE ANSWER — five buttons, on the thing itself (A5) */
.as-pick{display:flex;gap:3px;align-items:center;flex:0 0 auto}
figure.as-card .as-pick{padding:2px 7px 7px}
.as-pick b{font-size:9.5px;opacity:.45;margin-right:3px;font-weight:400;letter-spacing:.04em}
.as-pick button{font-family:inherit;font-size:11px;line-height:1;padding:4px 0;width:22px;
  cursor:pointer;background:transparent;border:1px solid var(--rule,#3a3529);
  color:inherit;border-radius:2px}
.as-pick button:hover{border-color:var(--gold,#b8974a)}
.as-pick button[aria-pressed=true]{background:var(--gold,#b8974a);
  border-color:var(--gold,#b8974a);color:#17150f;font-weight:700}
.as-undesc{display:block;font-size:10px;opacity:.45;font-style:italic;margin-top:2px}

/* the five days */
.as-rail{position:sticky;top:74px}
.as-day{border:1px solid var(--rule,#3a3529);border-radius:2px;margin:0 0 9px;padding:9px 10px}
.as-day h3{margin:0 0 2px;font-size:12.5px;letter-spacing:.04em}
.as-day .as-dt{font-size:11px;opacity:.66}
.as-day .as-ttl{font-size:11.5px;opacity:.82;margin:3px 0 0;line-height:1.4}
.as-day .as-none{font-size:11px;opacity:.5;font-style:italic}
.as-day .as-fires{font-size:10.5px;line-height:1.45;margin:6px 0 0;padding:5px 7px;
  background:#17240f;border-left:2px solid #6a8a4a;color:#cfe0b8}
.as-day ul{list-style:none;margin:7px 0 0;padding:0}
.as-day li{font-size:10.5px;line-height:1.4;padding:3px 0;border-top:1px solid #2a2620;
  display:flex;gap:6px;align-items:baseline}
.as-day li .as-x{cursor:pointer;opacity:.55;flex:0 0 auto}
.as-day li .as-x:hover{opacity:1;color:#e88}

#as-out,#as-need{margin:14px 0 0;font-size:12.5px}
#as-out>summary,#as-need>summary{cursor:pointer;padding:8px 0;list-style:none;opacity:.75}
#as-out>summary::-webkit-details-marker,#as-need>summary::-webkit-details-marker{display:none}
#as-out>summary:hover,#as-need>summary:hover{opacity:1}
#as-out textarea{width:100%;min-height:180px;font-family:ui-monospace,Consolas,monospace;
  font-size:11.5px;line-height:1.5;background:#0f0e0a;color:#d8d2c2;
  border:1px solid var(--rule,#3a3529);padding:10px;border-radius:2px}
#as-out .msg{font-size:12px;margin:7px 0 0;min-height:1.4em}
#as-out button{font-family:inherit;font-size:12px;padding:6px 13px;cursor:pointer;
  margin:9px 9px 0 0;background:transparent;border:1px solid var(--rule,#3a3529);
  color:inherit;border-radius:2px}
#as-need li{margin:6px 0;line-height:1.5;opacity:.88}

/* THE VIEWER, WITH A ZOOM (A1) */
#as-view{display:none;position:fixed;inset:0;z-index:200;background:rgba(6,6,5,.97)}
#as-view.as-on{display:flex;flex-direction:column}
#as-vbar{flex:0 0 auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;
  padding:8px 12px;border-bottom:1px solid var(--rule,#3a3529);background:#12110d}
#as-vbar button{font-family:inherit;font-size:12px;padding:5px 10px;cursor:pointer;
  background:transparent;border:1px solid var(--rule,#3a3529);color:inherit;border-radius:2px}
#as-vname{font-size:12.5px}
#as-vzoom{font-size:11.5px;opacity:.6;min-width:44px;text-align:center}
#as-vwrap{flex:1 1 auto;overflow:auto;padding:12px;text-align:center}
#as-vimg{display:inline-block;background:#fff;cursor:zoom-in}
#as-vfail{color:#ffd9d9;font-size:13px;padding:20px;line-height:1.5}
`;

/* ═══ RENDER ═══════════════════════════════════════════════════════════════ */
const PICK = id => `<div class="as-pick" data-for="${esc(id)}"><b>REVEAL ON</b>${
  [1, 2, 3, 4, 5].map(n =>
    `<button type="button" data-day="${n}" aria-pressed="false" title="Record 00${n}">${n}</button>`
  ).join("")}</div>`;

const UNDESC = r => r.undescribed
  ? `<span class="as-undesc">no description on file</span>` : "";

function cardTile(r, th) {
  return `<figure class="as-card" data-id="${esc(r.id)}" data-src="${esc(r.href)}"
   data-nm="${esc(r.label)}">
  <img${th ? ` src="${th}"` : ""} alt="" loading="lazy" data-zoom="${esc(r.id)}">
  <div class="as-lab">${esc(r.label)}${UNDESC(r)}</div>${PICK(r.id)}
</figure>`;
}

/* preload="none" is load-bearing: 63 players that preloaded would pull 59 MB
   the moment a section opened. */
function audioRow(r) {
  return `<div class="as-row" data-id="${esc(r.id)}" data-nm="${esc(r.label)}">
  <div class="as-lab">${esc(r.label)}${UNDESC(r)}</div>
  <audio controls preload="none" src="${esc(r.href)}"></audio>${PICK(r.id)}
</div>`;
}

const eventRow = r => `<div class="as-row as-evt" data-id="${esc(r.id)}" data-nm="${esc(r.label)}">
  <div class="as-lab">${esc(r.label)}</div>${PICK(r.id)}
</div>`;

function section(key, label, blurb, kind, items, thumbs) {
  const inner = kind === "hear"
    ? `<div class="as-rows">${items.map(audioRow).join("\n")}</div>`
    : kind === "say"
      ? `<div class="as-rows">${items.map(eventRow).join("\n")}</div>`
      : `<div class="as-cards">${items.map(r => cardTile(r, thumbs.get(r.uid))).join("\n")}</div>`;
  return `<details class="as-sec" data-sec="${esc(key)}">
  <summary><span class="as-caret">&#9656;</span><span>${esc(label)}</span>
    <span class="as-n">${items.length}</span><span class="as-mine"></span></summary>
  <div class="as-body">${blurb ? `<p class="as-blurb">${esc(blurb)}</p>` : ""}${inner}</div>
</details>`;
}

/* ═══ BUILD ════════════════════════════════════════════════════════════════ */
const { rows, drop } = buildShelf();
const { events, notBuilt } = buildEvents();
const days = buildDays();
const del = delivered();
const { thumbs, hits, made, failed } = await thumbnails(
  rows.filter(r => r.mediaKind === "image").map(r => r.raw),
  { fresh: FRESH, log: m => console.log(m) });

const secHtml = SECTIONS.map(s => {
  const items = rows.filter(r => r.section === s.key);
  return items.length ? section(s.key, s.label, s.blurb, s.kind, items, thumbs) : "";
}).filter(Boolean).join("\n");

const evtKeys = [...new Set(events.map(e => e.section))];
const evtHtml = evtKeys.map(k => section(k, k.replace("evt:", ""), null, "say",
  events.filter(e => e.section === k), thumbs)).join("\n");

const dayHtml = days.map(d => `<div class="as-day" data-no="${d.no}">
  <h3>RECORD ${String(d.no).padStart(3, "0")}</h3>
  <div class="as-dt">${esc(d.weekday)} ${esc(d.date)}</div>
  ${d.title ? `<p class="as-ttl">${esc(d.title)}</p>`
            : `<p class="as-ttl as-none">no headline written</p>`}
  ${d.standing.map(t => `<p class="as-fires">${esc(t)}</p>`).join("")}
  <ul data-list="${d.no}"></ul>
</div>`).join("\n");

const nUndesc = rows.filter(r => r.undescribed).length;

const body = `
<div class="as-top">
  <div class="as-shelf">
    <b>${rows.length}</b> things the museum can show &middot;
    <b>${events.length}</b> things a day can announce &middot;
    <span class="dim">open a section, then press the Record that reveals it</span>
    <span id="as-cnt"></span>
  </div>
  <div id="as-banner"></div>
</div>

<div class="as-wrap">
  <div>
    ${secHtml}
    ${evtHtml}

    <details id="as-need">
      <summary>What Ops needs from you &mdash; 2 things</summary>
      <ul>
        <li><b>Where the video lives.</b> Three recordings of the machines,
          770 MB. They cannot be served from this site at any size, so they need
          a home somewhere else before a Record can point at them.</li>
        <li><b>Two marker images.</b> Black frames with red boxes — the same
          working markup as the bezel you struck. Keep them or lose them.</li>
      </ul>
    </details>

    <details id="as-out">
      <summary>When you are done &mdash; the text to hand to Ops</summary>
      <div>
        <textarea id="as-ta" readonly spellcheck="false"></textarea>
        <div class="msg" id="as-msg"></div>
        <button type="button" id="as-sel">Select it all for Ctrl+C</button>
        <button type="button" id="as-dl">Save it as a file</button>
        <button type="button" id="as-clr">Clear every choice</button>
      </div>
    </details>
  </div>
  <div class="as-rail">${dayHtml}</div>
</div>

<div id="as-view">
  <div id="as-vbar">
    <button type="button" id="as-vx">&times; close</button>
    <button type="button" id="as-vprev">&lsaquo;</button>
    <button type="button" id="as-vnext">&rsaquo;</button>
    <button type="button" id="as-vout">&minus;</button>
    <span id="as-vzoom"></span>
    <button type="button" id="as-vin">+</button>
    <button type="button" id="as-vfit">fit</button>
    <span id="as-vname"></span>
    <span id="as-vpick"></span>
  </div>
  <div id="as-vwrap"><img id="as-vimg" alt=""><div id="as-vfail" hidden></div></div>
</div>

<script>
"use strict";
var KEY = "wb.assign.week1.v1";
var STATE = {};
var VIEW = null, ZOOM = null;

function banner(t){var b=document.getElementById("as-banner");b.innerHTML=t;b.className=t?"as-on":"";}
var OK = true;
function save(){
  if(!OK) return;
  try{ localStorage.setItem(KEY, JSON.stringify(STATE)); }
  catch(e){ OK=false; banner("<b>THIS BROWSER WILL NOT LET THE PAGE REMEMBER ANYTHING.</b> Your choices are on the screen and in the text at the foot of the page, but they will be gone if you close this tab. Open <b>the text to hand to Ops</b> and copy it first."); }
}
function load(){
  try{ var raw=localStorage.getItem(KEY); if(raw) STATE=JSON.parse(raw)||{}; }
  catch(e){ OK=false; banner("<b>THIS BROWSER WILL NOT LET THE PAGE REMEMBER ANYTHING.</b> Nothing was lost \\u2014 there was nothing saved to read."); }
}
function cssq(s){ return String(s).replace(/["\\\\]/g,"\\\\$&"); }
function dayOf(id){ for(var k in STATE){ if(STATE[k].indexOf(id)>=0) return Number(k); } return 0; }
function nameOf(id){
  var n=document.querySelector('[data-id="'+cssq(id)+'"]');
  return n?n.getAttribute("data-nm"):id;
}

/* THE ONE ACTION ON THE PAGE. Press a number: that Record reveals it. Press
   the same number again: it does not. */
function setDay(id,n){
  var was=dayOf(id);
  for(var k in STATE) STATE[k]=STATE[k].filter(function(x){return x!==id;});
  if(was!==n){ STATE[n]=STATE[n]||[]; STATE[n].push(id); }
  save(); paint();
}

function paint(){
  var total=0;
  document.querySelectorAll(".as-pick").forEach(function(p){
    var id=p.getAttribute("data-for"), d=dayOf(id);
    p.querySelectorAll("button").forEach(function(b){
      b.setAttribute("aria-pressed", Number(b.getAttribute("data-day"))===d?"true":"false");
    });
    var host=p.closest("figure.as-card")||p.closest(".as-row");
    if(host) host.classList.toggle("as-on", !!d);
  });
  for(var k in STATE) total+=STATE[k].length;

  document.querySelectorAll(".as-day").forEach(function(el){
    var no=Number(el.getAttribute("data-no"));
    var ul=el.querySelector("ul"); ul.innerHTML="";
    (STATE[no]||[]).forEach(function(id){
      var li=document.createElement("li");
      li.innerHTML='<span class="as-x" data-off="'+id.replace(/"/g,"&quot;")+'">&times;</span><span>'
        +nameOf(id)+'</span>';
      ul.appendChild(li);
    });
    if(!(STATE[no]||[]).length){
      var li0=document.createElement("li");
      li0.innerHTML='<span class="as-none">nothing chosen</span>';
      ul.appendChild(li0);
    }
  });

  /* a CLOSED section still says how much of it he has chosen, or he would have
     to open all eleven to find out */
  document.querySelectorAll("details.as-sec").forEach(function(sec){
    var mine=0;
    sec.querySelectorAll(".as-pick").forEach(function(p){
      if(dayOf(p.getAttribute("data-for"))) mine++;
    });
    sec.querySelector(".as-mine").textContent = mine ? "\\u00b7 " + mine + " chosen" : "";
  });

  document.getElementById("as-cnt").textContent = total ? " \\u00b7 " + total + " chosen" : "";
  writeOut();
}

function writeOut(){
  var L=["WEEK ONE \\u2014 WHAT EACH RECORD REVEALS",
         "written "+new Date().toISOString().slice(0,16).replace("T"," "),""];
  DAYS.forEach(function(d){
    var got=STATE[d.no]||[];
    L.push("RECORD "+("00"+d.no).slice(-3)+"  "+d.weekday+" "+d.date
      +(d.title?"  \\u2014 "+d.title.split("\\n")[0]:""));
    if(!got.length) L.push("    (nothing chosen)");
    got.forEach(function(id){
      L.push("    "+(id.indexOf("event:")===0
        ? "[ANNOUNCE] "+nameOf(id)+"  ("+id+")"
        : nameOf(id)+"  ["+id+"]"));
    });
    L.push("");
  });
  var o={},ev={};
  DAYS.forEach(function(d){
    o[d.no]=(STATE[d.no]||[]).filter(function(x){return x.indexOf("event:")!==0;});
    var e=(STATE[d.no]||[]).filter(function(x){return x.indexOf("event:")===0;});
    if(e.length) ev[d.no]=e;
  });
  L.push("--- for Ops: the assets arrays, keyed by record number ---");
  L.push(JSON.stringify(o,null,1));
  if(Object.keys(ev).length){ L.push(""); L.push("--- to announce ---"); L.push(JSON.stringify(ev,null,1)); }
  document.getElementById("as-ta").value=L.join("\\n");
}

/* ═══ THE VIEWER ═══ */
function shownCards(){ return [].slice.call(document.querySelectorAll("figure.as-card[data-src]")); }
function openView(id){
  var list=shownCards(), i=-1;
  for(var k=0;k<list.length;k++) if(list[k].getAttribute("data-id")===id) i=k;
  if(i<0) return;
  VIEW={list:list,i:i}; ZOOM=null; drawView();
  document.getElementById("as-view").className="as-on";
}
function drawView(){
  var f=VIEW.list[VIEW.i];
  var img=document.getElementById("as-vimg"), fail=document.getElementById("as-vfail");
  document.getElementById("as-vname").textContent=f.getAttribute("data-nm");
  fail.hidden=true; img.hidden=false;
  img.onerror=function(){ img.hidden=true; fail.hidden=false;
    fail.textContent="This file could not be loaded. There is nothing to look at."; };
  img.onload=function(){ if(ZOOM===null) fitZoom(); applyZoom(); };
  img.removeAttribute("style");
  img.src=f.getAttribute("data-src");
  document.getElementById("as-vpick").innerHTML =
    '<div class="as-pick" data-for="'+f.getAttribute("data-id").replace(/"/g,"&quot;")+'">'
    +'<b>REVEAL ON</b>'+[1,2,3,4,5].map(function(n){
      return '<button type="button" data-day="'+n+'" aria-pressed="false">'+n+'</button>';}).join("")
    +'</div>';
  paint();
}
function fitZoom(){
  var img=document.getElementById("as-vimg"), w=document.getElementById("as-vwrap");
  if(!img.naturalWidth) return;
  ZOOM=Math.min((w.clientWidth-30)/img.naturalWidth, 1);
}
function applyZoom(){
  var img=document.getElementById("as-vimg");
  if(!img.naturalWidth) return;
  img.style.width=Math.round(img.naturalWidth*ZOOM)+"px";
  img.style.height="auto";
  document.getElementById("as-vzoom").textContent=Math.round(ZOOM*100)+"%";
}
function zoomBy(f){ if(ZOOM===null) fitZoom(); ZOOM=Math.max(0.05,Math.min(6,ZOOM*f)); applyZoom(); }
function closeView(){ document.getElementById("as-view").className=""; VIEW=null; }
function step(d){ if(!VIEW) return; VIEW.i=(VIEW.i+d+VIEW.list.length)%VIEW.list.length; ZOOM=null; drawView(); }

/* WIRING. Never behind requestAnimationFrame — it does not fire in a tab that
   is not being painted, and a page that draws but wires nothing is a defect
   with no error anywhere. */
load(); paint();

document.addEventListener("click", function(ev){
  var t=ev.target;
  var b=t.closest && t.closest(".as-pick button");
  if(b){ setDay(b.parentNode.getAttribute("data-for"), Number(b.getAttribute("data-day"))); return; }
  var off=t.closest && t.closest("[data-off]");
  if(off){ var id=off.getAttribute("data-off");
    for(var k in STATE) STATE[k]=STATE[k].filter(function(x){return x!==id;});
    save(); paint(); return; }
  var z=t.closest && t.closest("[data-zoom]");
  if(z){ openView(z.getAttribute("data-zoom")); return; }
});

document.getElementById("as-vx").addEventListener("click", closeView);
document.getElementById("as-vprev").addEventListener("click", function(){ step(-1); });
document.getElementById("as-vnext").addEventListener("click", function(){ step(1); });
document.getElementById("as-vin").addEventListener("click", function(){ zoomBy(1.4); });
document.getElementById("as-vout").addEventListener("click", function(){ zoomBy(1/1.4); });
document.getElementById("as-vfit").addEventListener("click", function(){ fitZoom(); applyZoom(); });
document.getElementById("as-vimg").addEventListener("click", function(){ zoomBy(1.4); });
document.addEventListener("keydown", function(e){
  if(!VIEW) return;
  if(e.key==="Escape") closeView();
  else if(e.key==="ArrowLeft") step(-1);
  else if(e.key==="ArrowRight") step(1);
  else if(e.key==="+"||e.key==="=") zoomBy(1.4);
  else if(e.key==="-") zoomBy(1/1.4);
});

document.getElementById("as-sel").addEventListener("click", function(){
  var ta=document.getElementById("as-ta"); ta.focus(); ta.select();
  document.getElementById("as-msg").textContent="Selected \\u2014 press Ctrl+C now. "+ta.value.length+" characters.";
});
document.getElementById("as-dl").addEventListener("click", function(){
  var ta=document.getElementById("as-ta");
  var a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([ta.value],{type:"text/plain"}));
  a.download="week-one.txt"; document.body.appendChild(a); a.click(); a.remove();
  document.getElementById("as-msg").textContent="Saved as week-one.txt \\u2014 look in your Downloads folder.";
});
document.getElementById("as-clr").addEventListener("click", function(){
  STATE={}; save(); paint();
  document.getElementById("as-msg").textContent="Every choice cleared.";
});
</script>
`;

const inject = `<script>var DAYS = ${JSON.stringify(days.map(d =>
  ({ no: d.no, date: d.date, weekday: d.weekday, title: d.title })))};</script>`;

fs.writeFileSync(OUT, page({ title: "Week one", css: CSS, body: inject + body, favi: "🗓" }));

console.log(`\nwrote ${path.relative(REPO, OUT)}`);
console.log(`  ${rows.length} things to show, in ${SECTIONS.filter(s => rows.some(r => r.section === s.key)).length} sections:`);
SECTIONS.forEach(s => {
  const n = rows.filter(r => r.section === s.key).length;
  if (n) console.log(`     ${String(n).padStart(3)}  ${s.label}  — drawn as ${s.kind}`);
});
console.log(`  ${events.length} story events, in ${evtKeys.length} sections`);
console.log(`  labels: ${rows.length - nUndesc} readable, ${nUndesc} with nothing but a filename`);
console.log(`  not shown: ${drop.ruled} ruled out or signage, ${drop.absent} with no file, `
  + `${notBuilt} not built, ${drop.superseded + drop.elsewhere} robots-repo rows`);
console.log(`  thumbnails: ${hits} cached, ${made} made, ${failed} could not be read`);
console.log(`  delivered by the Record today: ${Object.keys(del || {}).length}`);
console.log(`\nopen it by double-clicking:  docs\\dictation-20260807\\assign.html`);
