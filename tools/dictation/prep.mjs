#!/usr/bin/env node
/* ===========================================================================
   THE DICTATION PREP — four documents Mike reads while he talks, and an index.
   [K2–K6 2026-08-07]
   ---------------------------------------------------------------------------
   MIKE is about to dictate the Record's first two weeks. This builds what he
   reads while doing it: the in-story spec source (K2), the artifact tracker
   (K3), the egg tracker (K4) and the week-one outline (K5), under one index
   (K6).

   ═══ IT COMPUTES ALMOST NOTHING, WHICH IS THE POINT ════════════════════════
   Exactly the arrangement `tools/contact-sheet.mjs` carries and for exactly its
   reason. `provenance/asset-table.json` is the authority on FILES and
   `reveal/ledger.json` is the authority on REVEALABLE THINGS; this reads both
   and writes neither. The one thing it adds is the JOIN — an asset row beside
   the transfer class, reveal arc and dependency list of the ledger row that
   wants it — because that join is the question Mike is actually asking while
   dictating (*can I reach for this today?*) and neither file answers it alone.

   THE JOIN IS NINE ROWS DEEP AND THE PAGES SAY SO. `ledger.assets` resolves a
   public ref to an asset uid and there are nine such rows in a 162-row ledger
   against a 315-row asset table. That is not a defect — the ledger's own header
   says the two tables "meet at `assets`" and neither restates the other — but a
   tracker that quietly implied a full join would be lying about its own
   coverage, so unjoined rows are drawn as unjoined and counted.

   ═══ THEY ARE OPS INSTRUMENTS AND MUST NEVER BECOME ROUTES ═════════════════
   Same reasoning as `reveal:cards`, `assets:checklist` and the contact sheet: a
   page whose subject is the museum's own housekeeping is meta under Doctrine 11
   and fails the visible-line test at any live address. These render to files
   under `docs/` and are never served. They are also deliberately NOT written
   into `public/`, which `npm run lap`'s own clean step exists to police.

   ═══ THE WEEK-ONE PAGE HAS A BLUE HALF NOW, AND THE GOLD HALF IS STILL EMPTY ══
   K5 asks for "week 1 as it stands" and marks the hardest constraint in the
   brief: *he must never mistake Ops scaffolding for his own material.* Its
   first cut therefore wrote NO headlines at all, because no authored outline
   existed in either repository (K-b).

   [W1 2026-08-07] ONE NOW EXISTS AND IT IS OPS', NOT HIS. Mike spoke the week's
   shape aloud on 2026-08-02; Ops structured it into `reveal/week-one.mjs` and
   this page renders it ON THE BLUE RAIL, every row attributed, nothing quoted.
   THE GOLD RAIL IS STILL EMPTY ON EVERY DAY — that is the whole point of having
   two rails, and the moment a paraphrase renders in gold there is no way, a week
   later, to tell it from something he said. Where he named a RULE as a rule (the
   Friday formula, the standing Record rules, the bouncy ball law) it is marked
   MIKE-NAMED and still renders blue: the rule is his, the sentence is Ops'.

   The page also prints the outline's COLLISIONS with the tree — five checks
   against the transfer classes, the ledger and the one Record entry that
   exists — named and not resolved, because resolving one is authoring.
   Doctrine 12: assemble what exists, invent nothing.

   ═══ [B1/B2 2026-08-07] TWO RULINGS, AND ONE OF THEM VOIDED A NUMBER THIS
       FILE WAS PRINTING ═══════════════════════════════════════════════════════
   B1 — THE BOUNCY BALL LAW CAPS POINTS OF FOCUS, NOT ASSETS. This file was
   dividing a count of PHOTOGRAPHS by that ceiling and printing "16 pictures =
   6–8 days of material". Every input was a real measurement and the arithmetic
   was sound; the UNIT was wrong, which is why nothing caught it. The law, the
   two buckets and the two runways are `reveal/focus.mjs`; `runwayBlock()` below
   only draws them, and it will not print a runway for the DUMP bucket however
   symmetrical that would look — a bucket with no ceiling divides into nothing.
   The bucket is a JUDGED field on the asset table beside `verdict`, it is unset
   on all 315 rows, and Ops does not derive it: a heuristic there would make
   these pages look answered while nothing had been answered.

   B2 — RECORD 013 IS THE PROTOTYPE. Not day one, no re-dating, no defending;
   the real Record starts at 001 when Mike dictates it. Every page here says so.
   NOTHING ON THE GLASS DOES, and that is Doctrine 11 rather than an oversight —
   "this entry was a prototype" is a line whose subject is the making of the
   museum. These pages are the right place for it because they are Ops
   instruments and are never served.

     node tools/dictation/prep.mjs            write docs/dictation-20260807/
     node tools/dictation/prep.mjs --out DIR  somewhere else
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { UNIT, MAINFRAME, ADJACENTS, FORCED, SOURCES } from "./spec-source.mjs";
import { TRANSFERS, CLASSES } from "../../reveal/transfers.mjs";
import { delivered, SIGNAGE } from "../../reveal/delivery.mjs";
import { entries as recordEntries } from "../../reveal/record-entries.mjs";
import { GOVERNED_PREFIX, STAGE_PREFIX } from "../../reveal/placement.mjs";
import { ORIGIN as W1_ORIGIN, WEEK, PRELUDE, DAYS, FRIDAY_FORMULA, RECORD_RULES, COLLISIONS }
  from "../../reveal/week-one.mjs";
import { LAW, BUCKETS, ORIGIN as FOCUS_ORIGIN, runways, bucketOf, VOIDED }
  from "../../reveal/focus.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const argv = process.argv.slice(2);
const optOf = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 ? argv[i + 1] : d; };
const OUT = path.resolve(REPO, optOf("out", "docs/dictation-20260807"));
const STAMP = "2026-08-07";

const LEDGER = JSON.parse(fs.readFileSync(path.join(REPO, "reveal/ledger.json"), "utf8"));
const TABLE = JSON.parse(fs.readFileSync(path.join(REPO, "provenance/asset-table.json"), "utf8"));

const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/* `~text~` marks a code span in the source strings so the data files stay free
   of markup. Nothing else in them is interpreted. */
const rich = s => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/\*([^*]+)\*/g, "<i>$1</i>");

/* [B2 2026-08-07] the day Mike ruled on the two collisions this page carries */
const W1_RULED_ON = FOCUS_ORIGIN.correctedOn;

/* ═══ [B1 2026-08-07] THE TWO RUNWAYS, RENDERED ONCE AND USED ON TWO PAGES ═══
   THE BLOCK THIS REPLACES IS THE REASON IT EXISTS. The week-one page divided a
   count of PHOTOGRAPHS by the bouncy ball ceiling and printed "16 pictures =
   6–8 days of material". Mike voided it: the law caps POINTS OF FOCUS, not
   assets, and it does not mean the museum may not show more pictures.

   So the arithmetic is done in `reveal/focus.mjs` and this only draws it, and
   the two numbers are drawn DIFFERENTLY ON PURPOSE. Precious has a ceiling over
   it, so it divides into weeks and the weeks mean something. Dump has no
   ceiling, so it divides into nothing and this block will not print a runway for
   it however much a symmetrical layout wants one — printing weeks for the dump
   would re-commit the original error in the other bucket.

   AND THE THIRD NUMBER IS THE ONE THAT IS TRUE TODAY. Nothing is assigned, so
   the precious runway is a BOUND rather than a figure, and it says so. */
function runwayBlock(r, ofWhat) {
  const P = BUCKETS.precious, D = BUCKETS.dump;
  const wk = w => w ? (w.min === w.max ? `${w.min} week${w.min === 1 ? "" : "s"}`
    : `${w.min}&ndash;${w.max} weeks`) : null;
  const bound = wk(r.bound.ceilWeeks);
  return `<div class="note" style="margin-bottom:14px">
<p class="k" style="margin:0 0 8px;font-size:11px;letter-spacing:.13em;text-transform:uppercase">
Against the bouncy ball law <span class="rail m">his rule &middot; Ops wording</span></p>
<p style="margin:0 0 10px"><b>${esc(LAW.statement)}</b> ${esc(LAW.because)}
<i>${esc(LAW.doesNotMean)}</i></p>
<div class="tw"><table>
<thead><tr><th style="width:26%">bucket</th><th>ceiling</th><th style="width:16%">assigned</th><th style="width:26%">runway</th></tr></thead>
<tbody>
<tr><td><b>${esc(P.name)}</b><div class="k" style="font-size:11.5px;margin-top:3px">${esc(P.holds)}</div></td>
    <td>${esc(P.ceiling)}</td>
    <td><span class="tag ${r.precious.n ? "y" : ""}">${r.precious.n}</span></td>
    <td>${r.precious.weeks ? `<b>${wk(r.precious.weeks)}</b>` : "<i class=\"k\">nothing assigned &mdash; no runway to compute</i>"}</td></tr>
<tr><td><b>${esc(D.name)}</b><div class="k" style="font-size:11.5px;margin-top:3px">${esc(D.holds)}</div></td>
    <td>${esc(D.ceiling)}</td>
    <td><span class="tag ${r.dump.n ? "y" : ""}">${r.dump.n}</span></td>
    <td><i class="k">no ceiling, so no runway. A pile size, and a batch of any size is one point of focus.</i></td></tr>
<tr><td><b>UNASSIGNED</b><div class="k" style="font-size:11.5px;margin-top:3px">Nobody has said which bucket these are in.</div></td>
    <td><i class="k">&mdash;</i></td>
    <td><span class="tag ${r.unassigned.n ? "n" : ""}">${r.unassigned.n}</span></td>
    <td><i class="k">the honest state today</i></td></tr>
</tbody></table></div>
<p class="ask" style="margin:10px 0 0"><b>SO THE RUNWAY IS A BOUND AND NOT A
NUMBER, AND THAT IS THE ONE HONEST THING THIS TABLE CAN SAY.</b> Of ${esc(ofWhat)},
<b>${r.bound.atLeast}</b> are assigned precious and <b>${r.bound.atMost}</b> could be
&mdash; so the precious runway runs from <b>${r.precious.weeks ? wk(r.precious.weeks) : "nothing at all"}</b>
to <b>${bound || "nothing at all"}</b>, and the whole of that gap is a judgement
nobody has made. <b>The bucket is yours</b> &mdash; it sits beside <code>verdict</code>
in the asset table, unset, and Ops will not derive it: a rule that called every
machine photograph precious would make this table look answered while nothing had
been answered.</p>
<p class="k" style="margin:8px 0 0;font-size:12px"><b>THE FIGURE THIS REPLACES IS
VOID:</b> &ldquo;${esc(VOIDED.figure)}&rdquo;. ${esc(VOIDED.why)}</p>
</div>`;
}

/* ── SHARED SHELL ──────────────────────────────────────────────────────── */
const OPS_CSS = `
:root{color-scheme:light dark;--bg:#16151a;--fg:#e8e6e1;--dim:#9b978e;--dim2:#7d7970;
 --gold:#d9b66a;--line:#302d28;--line2:#262429;--panel:#1d1c21;--red:#c0392b;--redfg:#f0c9c4;
 --grn:#7fa86a;--blu:#8fa8c4;--amb:#e08a5a}
*{box-sizing:border-box}
body{margin:0;padding:28px 26px 110px;background:var(--bg);color:var(--fg);
 font:15px/1.55 -apple-system,"Segoe UI",system-ui,sans-serif}
.wrap{max-width:1180px;margin:0 auto}
a{color:var(--blu)}
h1{font-size:21px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;margin:0 0 4px;color:var(--gold)}
.sub{color:var(--dim);font-size:13px;margin:0 0 8px}
.back{font-size:12px;color:var(--dim2);margin:0 0 22px}
h2{font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);font-weight:600;
 margin:34px 0 12px;border-bottom:1px solid var(--line);padding-bottom:6px}
h3{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:600;margin:22px 0 8px}
.note{border:1px solid #3a3630;background:var(--panel);padding:15px 17px;margin:0 0 26px;border-radius:3px}
.note p{margin:0 0 10px}.note p:last-child{margin:0}
.note b{color:var(--gold)}
.ask{border-left:3px solid var(--red);padding-left:12px;color:var(--redfg)}
.ops{border-left:3px solid var(--blu);padding-left:12px}
code{font-family:ui-monospace,Consolas,monospace;font-size:.88em;color:#b9c9dc}
/* A five-column table cannot fit a phone and must not be made to try. The
   TABLE scrolls inside its own box; the PAGE never scrolls sideways. */
.tw{overflow-x:auto;-webkit-overflow-scrolling:touch}
.tw table{min-width:760px}
table{border-collapse:collapse;width:100%;font-size:13px}
th{text-align:left;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim2);
 font-weight:600;border-bottom:1px solid var(--line);padding:6px 9px 6px 0;position:sticky;top:0;background:var(--bg)}
td{border-bottom:1px solid var(--line2);padding:8px 9px 8px 0;vertical-align:top}
tr.hide{display:none}
.tag{display:inline-block;font-size:10px;letter-spacing:.09em;text-transform:uppercase;
 border:1px solid var(--line);color:var(--dim);padding:1px 6px;border-radius:2px;white-space:nowrap}
.tag.y{border-color:#4a6a3a;color:var(--grn)}
.tag.n{border-color:#6a3a30;color:var(--amb)}
.tag.g{border-color:#7a5a20;color:var(--gold)}
.tag.b{border-color:#3a5570;color:var(--blu)}
.bar{position:sticky;top:0;z-index:5;background:var(--bg);padding:10px 0 12px;border-bottom:1px solid var(--line);margin-bottom:14px}
.bar input{background:var(--panel);border:1px solid var(--line);color:var(--fg);padding:6px 10px;
 border-radius:3px;font:13px/1.4 inherit;width:280px}
.bar button{background:transparent;border:1px solid var(--line);color:var(--dim);padding:5px 11px;
 border-radius:3px;font:11px/1.3 inherit;letter-spacing:.09em;text-transform:uppercase;cursor:pointer;margin-left:5px}
.bar button[aria-pressed="true"]{border-color:var(--gold);color:var(--gold)}
.count{font-size:12px;color:var(--dim2);margin-left:12px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px}
.card{border:1px solid var(--line);background:var(--panel);border-radius:3px;padding:14px 15px}
.card h4{margin:0 0 4px;font-size:14px;color:var(--fg)}
.card .id{font-family:ui-monospace,Consolas,monospace;font-size:11px;color:var(--blu);margin:0 0 8px}
.card p{margin:0 0 8px;font-size:13px}
.card .meta{font-size:12px;color:var(--dim);margin:0}
.k{color:var(--dim2)}
.day{border:1px solid var(--line);border-radius:3px;margin:0 0 18px;overflow:hidden}
.day > .hd{background:var(--panel);padding:12px 15px;border-bottom:1px solid var(--line)}
.day > .hd .n{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim2)}
.day > .hd .slot{display:block;margin-top:5px;font-size:16px;color:var(--red);font-style:italic}
.day > .bd{padding:13px 15px}
.mine{border-left:3px solid var(--gold);padding-left:11px;margin:0 0 12px}
.mine .lbl,.scaf .lbl{font-size:10px;letter-spacing:.13em;text-transform:uppercase;display:block;margin-bottom:4px}
.mine .lbl{color:var(--gold)}
.scaf{border-left:3px solid var(--blu);padding-left:11px;margin:0 0 12px}
.scaf .lbl{color:var(--blu)}
/* The attribution marker. NOT gold — gold is reserved for material that is
   Mike's own words, and a paraphrase wearing gold is the whole hazard. */
.rail{display:inline-block;font-size:9.5px;letter-spacing:.11em;text-transform:uppercase;
 border:1px solid #3a5570;color:var(--blu);padding:0 5px;border-radius:2px;white-space:nowrap;
 vertical-align:1px;margin-left:4px}
.rail.m{border-color:#7a5540;color:var(--amb);margin-left:0}
.tl{list-style:none;padding:0;margin:0}
.tl li{display:grid;grid-template-columns:19ch 1fr;gap:0 14px;padding:7px 0;
 border-bottom:1px dotted var(--line2);margin:0}
.tl li:last-child{border-bottom:0}
.tl .at{color:var(--dim2);font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;padding-top:2px}
@media (max-width:620px){.tl li{grid-template-columns:1fr}.tl .at{margin-bottom:2px}}
ul{margin:0 0 10px;padding-left:19px}li{margin:0 0 5px}
footer{margin-top:44px;padding-top:14px;border-top:1px solid var(--line);color:var(--dim2);font-size:12px}
@media (max-width:720px){body{padding:20px 14px 80px}.bar input{width:100%}}
`;

const TYPED_CSS = `
:root{color-scheme:light dark;--paper:#e7e2d6;--ink:#2b2622;--ink2:#5a5148;--rule:#8d8478;--flag:#8c2f22}
*{box-sizing:border-box}
body{margin:0;padding:0;background:#2a2825;color:var(--ink);
 font:15px/1.5 "Courier New",Courier,ui-monospace,monospace}
.sheet{max-width:82ch;margin:0 auto;background:var(--paper);padding:44px 5ch 90px;
 box-shadow:0 0 44px rgba(0,0,0,.5)}
.back{font-size:12px;color:#9b978e;max-width:82ch;margin:0 auto;padding:14px 5ch 0}
.back a{color:#8fa8c4}
h1,h2,h3{font-weight:400;font-family:inherit}
h1{font-size:16px;letter-spacing:.1em;text-align:center;margin:0 0 2px;text-transform:uppercase}
.hd2{text-align:center;font-size:13px;letter-spacing:.06em;margin:0;text-transform:uppercase}
.hd3{text-align:center;font-size:12px;color:var(--ink2);margin:0 0 4px}
.rule{border:0;border-top:1px solid var(--ink);margin:12px 0}
.rule.t{border-top-style:dashed;border-color:var(--rule)}
h2{font-size:14px;text-transform:uppercase;letter-spacing:.05em;margin:30px 0 3px;
 text-decoration:underline;text-underline-offset:3px}
h2 .at{display:block;text-decoration:none;font-size:11px;letter-spacing:0;color:var(--ink2);
 text-transform:none;margin-top:3px}
.row{display:grid;grid-template-columns:19ch 1fr;gap:0 1ch;padding:7px 0;border-bottom:1px dotted #b9b0a2}
.row:last-child{border-bottom:0}
.row .k{text-transform:uppercase;font-size:13px;letter-spacing:.02em}
.row .v{font-size:14px}
.st{display:inline-block;font-size:10px;letter-spacing:.09em;border:1px solid var(--ink2);
 padding:0 5px;margin-right:6px;white-space:nowrap;vertical-align:2px}
.st.CONTRADICTED{border-color:var(--flag);color:var(--flag)}
.st.ABSENT{border-style:dashed}
.st.IMPLIED{border-style:dotted}
.fw{display:inline-block;font-size:10px;letter-spacing:.06em;background:var(--flag);color:var(--paper);
 padding:0 5px;margin-right:6px;vertical-align:2px}
.alt{margin:6px 0 0 0;padding-left:2ch;border-left:2px solid var(--flag)}
.alt div{margin:0 0 4px;font-size:13px}
.alt .lbl{font-size:10px;letter-spacing:.09em;color:var(--flag)}
.n{margin:6px 0 0;font-size:12.5px;color:var(--ink2)}
.src{font-size:11px;color:var(--ink2);letter-spacing:.03em}
.pre{white-space:pre-wrap;font-size:13px}
.box{border:1px solid var(--ink);padding:12px 2ch;margin:22px 0}
.box p{margin:0 0 9px}.box p:last-child{margin:0}
b{font-weight:400;text-decoration:underline;text-underline-offset:2px}
i{font-style:italic}
code{font:inherit;background:rgba(0,0,0,.06);padding:0 2px}
ol,ul{padding-left:3ch}
li{margin:0 0 6px;font-size:13.5px}
@media (max-width:700px){.sheet{padding:26px 3ch 70px}.row{grid-template-columns:1fr}.row .k{color:var(--ink2);margin-bottom:2px}}
`;

function page({ title, css, body, favi = "📄" }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>${css}</style></head><body>
${body}
</body></html>
`;
}

const BACK = `<p class="back"><a href="index.html">&larr; the dictation prep</a> &middot; Ops&#8209;to&#8209;Mike, ${STAMP} &middot; not part of the museum</p>`;

/* ═══════════════════════════════════════════════════════════════════════════
   K2 — THE IN-STORY SPEC SHEET
   ═══════════════════════════════════════════════════════════════════════════ */
function specRow(r) {
  const st = `<span class="st ${r.st}">${r.st}</span>`;
  const fw = r.fw ? `<span class="fw">REAL-BUILD SOURCE</span>` : "";
  const alt = (r.alt || []).map(a =>
    `<div><span class="lbl">ALSO ON FILE &middot;</span> ${rich(a.v)} <span class="src">[${a.src.join(" ")}]</span></div>`).join("");
  return `<div class="row">
  <div class="k">${esc(r.k)}</div>
  <div class="v">${st}${fw}${r.v === "—" ? "<i>nothing on file</i>" : rich(r.v)}
    ${r.src && r.src.length ? `<span class="src">[${r.src.join(" ")}]</span>` : ""}
    ${alt ? `<div class="alt">${alt}</div>` : ""}
    ${r.note ? `<p class="n">${rich(r.note)}${r.id ? ` <span class="src">&mdash; ${esc(r.id)}</span>` : ""}</p>`
              : (r.id ? `<p class="n"><span class="src">${esc(r.id)}</span></p>` : "")}
  </div></div>`;
}

function specBlock(u) {
  return `
<h1>${esc(u.title)}</h1>
<p class="hd2">${esc(u.sub)}</p>
<p class="hd3">${esc(u.maker)}<br>${esc(u.pub)}</p>
<hr class="rule">
${u.groups.map(g => `<h2>${esc(g.g)}<span class="at">manual position: ${esc(g.at)}</span></h2>
${g.rows.map(specRow).join("\n")}`).join("\n")}`;
}

function buildSpecsheet() {
  const counts = { ASSERTED: 0, IMPLIED: 0, CONTRADICTED: 0, ABSENT: 0 };
  let fwRows = 0;
  for (const u of [UNIT, MAINFRAME])
    for (const g of u.groups) for (const r of g.rows) { counts[r.st]++; if (r.fw) fwRows++; }

  const body = `${BACK}<div class="sheet">
<div class="box">
<p><b>WHAT THIS IS.</b> Every piece of story-generated technical data about
both machines, from both repositories, in one place &mdash; with its source, and
marked for whether the fiction <i>asserts</i> it, <i>implies</i> it, or
<i>contradicts itself</i> about it. It is authoring input for the two open rows
that both end on the same sentence (<code>N-g</code>, <code>N-h</code>):
<i>the unit's own particulars &mdash; what an ABEAL spec sheet for this machine
says.</i></p>

<p><b>NOTHING HERE IS INVENTED.</b> No figure, name, code, count or date appears
for the first time on this page. Where two sources disagree, both readings are
printed and the conflict is named by its register id. Where the structure has a
position and nothing fills it, the row says <i>nothing on file</i> rather than
guessing. That is deliberate and it is the whole of Doctrine 12: a gap stated is
material; a gap filled quietly is a fabrication.</p>

<p><b>THE MANUAL'S OWN SECTION STRUCTURE IS NOT THE GROUPING, AND HERE IS WHY.</b>
It was the candidate and it does not serve. The structure issue is twelve
sections and eight appendices describing a whole operating and maintenance
manual, and <i>ten of the twelve are procedures</i> &mdash; installation,
starting, operating, maintenance, troubleshooting, service. A one-sheet is not
an abridged manual; it is the specification, which in that structure is Section
II and pieces of VII and XII. Grouping a one-sheet by the manual's twelve would
put nine near-empty headings on a page whose only virtue is that it is one page.
<b>What is used instead is the period specification's own grouping</b> &mdash;
the shape Table 2-1 and Table 2-2 already have &mdash; and <i>every heading
carries its manual position</i>, so an authored row lands where the structure
says it goes. The manual's structure is the destination; it is not the
arrangement.</p>

<p><b>THE RED FLAG IS THE MOST IMPORTANT MARK ON THE PAGE.</b> Doctrine 18:
<i>Technical Specifications means the IN-STORY specs, never the real ones.</i>
Register <code>N-i</code> found that the in-story manual's own SPECIFICATIONS
section cites the real Arduino firmware for six rows &mdash; and that in one of
them (<i>how many lamps</i>) the firmware <i>overrules</i> the manual. Every such
row below is flagged <span class="fw">REAL-BUILD SOURCE</span>.
<b>${fwRows} rows carry it.</b> A 1965 spec sheet may carry a display size; it
may not carry an I&sup2;C address, and this document is one authoring pass
upstream of the face that would print one.</p>

<p><b>THE REGISTER.</b> Set as Mike ruled the manual: <i>made on a typewriter by
engineering &mdash; not typeset, not laid out, not designed.</i> Elite pitch, a
78-column measure, ragged right, sideheads in capitals and underscored, no bold
(a typewriter has none; emphasis is overstrike), rules typed as hyphens.</p>

<p class="src">Counts: ${counts.ASSERTED} asserted &middot;
${counts.IMPLIED} implied &middot; <b>${counts.CONTRADICTED} contradicted</b> &middot;
${counts.ABSENT} absent.</p>
</div>

${specBlock(UNIT)}

<hr class="rule" style="margin:44px 0">
${specBlock(MAINFRAME)}

<hr class="rule" style="margin:44px 0">
<h1>THE ADJACENTS</h1>
<p class="hd3">what a specification row rests on and would be wrong without</p>
<hr class="rule">
${ADJACENTS.map(a => `<h2>${esc(a.g)}</h2>
<ul>${a.lines.map(l => `<li>${rich(l)}</li>`).join("")}</ul>
<p class="src">[${a.src.join(" ")}]</p>`).join("\n")}

<hr class="rule" style="margin:44px 0">
<h1>WHERE WRITING A ROW IS TAKING A DECISION</h1>
<p class="hd3">${FORCED.length} of them &mdash; not a to-do list, a list of the places<br>where the dictation is deciding rather than describing</p>
<hr class="rule">
${FORCED.map(f => `<div class="row"><div class="k">${esc(f.id)}</div>
<div class="v"><b>${rich(f.q)}</b><p class="n">${rich(f.w)}</p></div></div>`).join("\n")}

<hr class="rule" style="margin:44px 0">
<h2>SOURCE KEYS</h2>
${Object.entries(SOURCES).map(([k, v]) =>
  `<div class="row"><div class="k">${esc(k)}</div><div class="v" style="font-size:12.5px">${rich(v)}</div></div>`).join("\n")}
</div>`;
  return page({ title: `IN-STORY SPEC SHEET — MGK-NIAC · MGK-VIIIp — ${STAMP}`, css: TYPED_CSS, body });
}

/* ═══════════════════════════════════════════════════════════════════════════
   K3 — THE ARTIFACT TRACKER
   ═══════════════════════════════════════════════════════════════════════════ */
const DELIVERED = new Set(delivered());
const SIGNAGE_REFS = new Set(Object.keys(SIGNAGE).map(k => GOVERNED_PREFIX + k));

/** the PUBLIC address of a file, whichever side of the stage door it sits on */
function publicRef(ref) {
  if (!ref) return null;
  return ref.startsWith(STAGE_PREFIX + "/") ? ref.slice(STAGE_PREFIX.length) : ref;
}
const isGoverned = pub => !!pub && pub.startsWith(GOVERNED_PREFIX);

/** can Mike reach for this file in a Record entry today, and what happens if he does
 *
 *  THE `missing` CHECK IS FIRST AND IT IS NOT PEDANTRY. The asset table keeps a
 *  row whose file is gone rather than deleting it, so Mike's verdict survives a
 *  rename — and a governed picture has TWO addresses, so the public-side rows of
 *  the files that moved behind the stage door are exactly such rows. Counting
 *  them as reachable would have told him three pictures were one entry away when
 *  one of them does not exist and two of them are already in the table under
 *  their held address. This is §8's own two-addresses hazard, met by an
 *  instrument written after it was recorded. */
function reachOf(e) {
  const pub = publicRef(e.ref);
  if (e.missing) return { k: "NO FILE", c: "n", w: "The row is kept so a judgement survives, and the file is gone. Two of these are the public-side twins of pictures that moved behind the stage door — the same photograph, already in this table at its held address." };
  if (!pub) return { k: "NOT ADDRESSED", c: "", w: "No web address. A working file, a screenshot or a doc image — it is not a thing an entry can show." };
  if (SIGNAGE_REFS.has(pub)) return { k: "SIGNAGE", c: "b", w: "Exempt in writing. Nothing arrived and nothing was opened, so no entry could ever deliver it." };
  if (!isGoverned(pub)) return { k: "OUTSIDE THE RULE", c: "b", w: "Not a picture of the machines. The pull-back rule does not reach it; it is already public and stays public." };
  if (DELIVERED.has(pub)) return { k: "ALREADY DELIVERED", c: "y", w: "A Record entry names this file, so it is on the wall. Reusing it costs nothing." };
  return { k: "YES — ONE ENTRY", c: "g", w: "Behind the stage door and waiting. Writing an entry whose assets name this file is the whole of what puts it on the wall — no code." };
}

function buildArtifacts() {
  const rows = TABLE.entries.map(e => {
    const pub = publicRef(e.ref);
    const reach = reachOf(e);
    return {
      uid: e.uid, path: e.path, pub, held: e.path.startsWith("public/held/"),
      what: e.what, quality: e.quality, verdict: e.verdict, arc: e.revealArc,
      role: e.role, usedBy: e.usedBy || [], kind: e.kind, missing: !!e.missing,
      dims: e.w && e.h ? `${e.w}×${e.h}` : "", bytes: e.bytes, reach,
      governed: isGoverned(pub),
      /* [B1 2026-08-07] Mike's bouncy ball bucket — read, never derived */
      bucket: bucketOf(e),
    };
  });

  const addressed = rows.filter(r => r.pub);
  const gone = addressed.filter(r => r.missing);
  const governed = addressed.filter(r => r.governed);
  const waiting = governed.filter(r => r.reach.k === "YES — ONE ENTRY");
  const joinedUids = new Set(LEDGER.rows.flatMap(r => r.assets || []));
  /* [B1 2026-08-07] the two runways, over the set this page is about: the files
     an entry can reach for today. Not the whole table — a runway computed over
     source files and working copies would be a number about the disk. */
  const runwayOfWaiting = runways(waiting);

  const tr = r => `<tr data-g="${r.governed ? "gov" : "out"}" data-r="${esc(r.reach.k)}" data-q="${esc(r.quality || "unjudged")}" data-m="${r.missing ? "1" : "0"}" data-b="${esc(r.bucket || "unassigned")}"
   data-t="${esc([r.path, r.what, r.quality, r.reach.k, r.bucket || "unassigned", r.usedBy.join(" ")].join(" ").toLowerCase())}">
  <td><code>${esc(r.pub || r.path)}</code>${r.held ? ' <span class="tag g">held</span>' : ""}${r.missing ? ' <span class="tag n">no file</span>' : ""}
      ${joinedUids.has(r.uid) ? ' <span class="tag b">ledgered</span>' : ""}
      <div class="k" style="font-size:11px;margin-top:3px">${esc(r.dims)}${r.bytes ? ` · ${Math.round(r.bytes / 1024)} KB` : ""} · <code>${esc(r.uid)}</code></div></td>
  <td>${esc(r.what || "")}${r.what ? "" : '<i class="k">nobody has written what this is</i>'}</td>
  <td><span class="tag ${r.quality === "usable" ? "y" : r.quality === "wrong" || r.quality === "placeholder" ? "n" : ""}">${esc(r.quality || "unjudged")}</span>
      <div class="k" style="font-size:11px;margin-top:4px">verdict: ${r.verdict ? esc(r.verdict) : "<i>not inspected</i>"}</div>
      <div class="k" style="font-size:11px">arc: ${r.arc ? esc(r.arc) : "<i>unset</i>"}</div>
      <div class="k" style="font-size:11px">bucket: ${r.bucket ? `<b>${esc(r.bucket)}</b>` : "<i>unassigned</i>"}</div></td>
  <td><span class="tag ${r.reach.c}">${esc(r.reach.k)}</span>
      <div class="k" style="font-size:11.5px;margin-top:4px">${esc(r.reach.w)}</div></td>
  <td class="k" style="font-size:11px">${r.usedBy.length ? r.usedBy.map(u => `<code>${esc(u)}</code>`).join("<br>") : "<i>nothing</i>"}</td>
</tr>`;

  /* the ledger half — the transfer class, arc and dependencies live here and
     nowhere else, so they get their own table rather than a faked column. */
  const revealable = LEDGER.rows.filter(r => r.cls !== "egg" && r.state !== "RETIRED");
  const lrow = r => `<tr data-s="${esc(r.state)}" data-c="${esc(r.transfer || "EXEMPT")}"
   data-t="${esc([r.id, r.name, r.where, (r.deps || []).join(" ")].join(" ").toLowerCase())}">
  <td><code>${esc(r.id)}</code><div class="k" style="font-size:11px;margin-top:3px">${esc(r.cls)}</div></td>
  <td>${esc(r.name)}${r.where ? `<div class="k" style="font-size:11px;margin-top:3px"><code>${esc(r.where)}</code></div>` : ""}</td>
  <td><span class="tag ${r.state === "REVEALED" ? "y" : "g"}">${esc(r.state)}</span>
      <div class="k" style="font-size:11px;margin-top:4px">build ${esc(r.build)}</div>
      <div class="k" style="font-size:11px">arc: ${r.arc ? esc(r.arc) : "<i>unset</i>"}</div></td>
  <td><span class="tag ${r.transfer === "BLAST" || r.transfer === "UNLOCK" ? "y" : r.transfer ? "n" : ""}">${esc(r.transfer || "exempt")}</span>
      <div class="k" style="font-size:11px;margin-top:4px">${r.transferWeek === 0 ? "arrived week 0" : r.transferWeek == null ? "<i>no named arrival</i>" : "week " + r.transferWeek}</div></td>
  <td class="k" style="font-size:11.5px">${(r.deps || []).length ? (r.deps || []).map(d => esc(d)).join("<br>") : "<i>nothing</i>"}</td>
</tr>`;

  const body = `<div class="wrap">
${BACK}
<h1>The artifact tracker</h1>
<p class="sub">${TABLE.entries.length} files &middot; ${LEDGER.rows.length} revealable things &middot; what is available, what is held, what is spent</p>

<div class="note">
<p><b>THE ONE QUESTION THIS PAGE ANSWERS:</b> can you reach for this in a Record
entry today? For a picture of the machines the answer is almost always
<i>yes, and it takes one entry and no code</i> &mdash; <b>${waiting.length} governed
pictures are sitting behind the stage door right now</b>, and naming a file in an
entry's assets is the entire mechanism that puts it on a wall.</p>

<p><b>ONE FILE HAS EVER BEEN DELIVERED.</b> <code>rear_power_switch.png</code>, by
Record 013 &mdash; <b>the prototype entry</b>, which you ruled on
${esc(FOCUS_ORIGIN.correctedOn)} is not day one and is not in the volume's sequence.
It is kept precisely because it is the only thing exercising this machinery: strike
it and the delivered set is empty, the pull-back rule has no positive case anywhere
in the museum, and this column has nothing to be right about. Everything else the
museum owns of these machines has never been brought into the story by anybody.</p>

<p class="ops"><b>AND ${gone.length} ROWS HAVE NO FILE, WHICH IS A DIFFERENT THING
FROM AN ERROR.</b> The asset table keeps a row after its file goes so that a
verdict Mike gave survives a rename &mdash; and two of these three are the
<i>public-side twins</i> of pictures that moved behind the stage door, so the same
photograph is in this table twice, once at each of its two addresses. They are
drawn <span class="tag n">no file</span> and excluded from every reach count,
because telling you three more pictures were an entry away would have been the
two-addresses hazard doing its trick on a brand-new instrument.</p>

<p class="ops"><b>THE JOIN IS NINE ROWS DEEP AND THAT IS NOT A DEFECT.</b>
<code>provenance/asset-table.json</code> is the authority on FILES;
<code>reveal/ledger.json</code> is the authority on REVEALABLE THINGS; the ledger's
own header says the two meet at <code>assets</code> and neither restates the other.
Nine ledger rows carry an asset uid, so nine files are marked
<span class="tag b">ledgered</span> below. <b>Transfer class, reveal arc and
dependencies are properties of a revealable thing, not of a file</b> &mdash; so
they are in the second table rather than faked into the first. A tracker that
quietly implied a full join would be lying about its own coverage.</p>

<p class="ops"><b>[B1] AND THIS PAGE NO LONGER COUNTS PICTURES AGAINST THE BOUNCY
BALL LAW, BECAUSE THAT IS NOT WHAT THE LAW COUNTS.</b> You corrected it on
${esc(FOCUS_ORIGIN.correctedOn)}: it caps <b>points of focus</b>, not assets, and it
does not mean the museum may not show more pictures. Ten manual pages arriving is
ONE point of focus. So every row below carries a <b>bucket</b> &mdash;
<b>precious</b> or <b>dump</b> &mdash; and it is <b>yours</b>, unset, sitting beside
<code>verdict</code> in the asset table. Ops will not guess it.</p>
</div>

<h2>The two runways</h2>
${runwayBlock(runwayOfWaiting, "the " + waiting.length + " pictures an entry can reach for today")}

<h2>Every addressable file &middot; ${addressed.length} rows</h2>
<div class="bar">
  <input id="q1" placeholder="filter — path, description, quality, use&hellip;">
  <button data-f1="all" aria-pressed="true">all</button>
  <button data-f1="gov">the machines</button>
  <button data-f1="wait">waiting on an entry</button>
  <button data-f1="done">delivered</button>
  <button data-f1="weak">weak / wrong</button>
  <button data-f1="gone">no file</button>
  <button data-f1="precious">precious</button>
  <button data-f1="dump">dump</button>
  <button data-f1="nobucket">no bucket yet</button>
  <span class="count" id="c1"></span>
</div>
<div class="tw"><table id="t1"><thead><tr><th>file</th><th>what it shows</th><th>judgement</th><th>reach today</th><th>used by</th></tr></thead>
<tbody>${addressed.map(tr).join("\n")}</tbody></table></div>

<h2>Revealable things &middot; transfer class, arc and dependencies &middot; ${revealable.length} rows</h2>
<div class="note" style="margin-bottom:14px">
<p>The transfer classes are how a thing GOT here, never how it is shown.
<b>Only ${CLASSES.filter(c => TRANSFERS[c].week === 0).length} of the four have
arrived by week one</b> &mdash;
${CLASSES.map(c => `<b>${c}</b> (${TRANSFERS[c].week === 0 ? "week 0, in hand" : "not yet"})`).join(" &middot; ")}
&mdash; so a week-one entry that reaches for a PACKAGE or TRANSMISSION row is
reaching for something the story has not received. Eggs are on their own page.</p>
</div>
<div class="bar">
  <input id="q2" placeholder="filter — id, name, where, dependency&hellip;">
  <button data-f2="all" aria-pressed="true">all</button>
  <button data-f2="held">held</button>
  <button data-f2="week0">arrived (week 0)</button>
  <button data-f2="later">not yet arrived</button>
  <button data-f2="deps">has dependencies</button>
  <span class="count" id="c2"></span>
</div>
<div class="tw"><table id="t2"><thead><tr><th>id</th><th>what</th><th>state</th><th>transfer</th><th>waits on</th></tr></thead>
<tbody>${revealable.map(lrow).join("\n")}</tbody></table></div>

<footer>Built by <code>node tools/dictation/prep.mjs</code> from
<code>provenance/asset-table.json</code>, <code>reveal/ledger.json</code>,
<code>reveal/delivery.mjs</code> and <code>reveal/transfers.mjs</code>. It writes
nothing back. <code>verdict</code> is Mike's field and Ops never sets it.</footer>
</div>
<script>
(function(){
 function wire(tid,qid,cid,attr,tests){
  var t=document.getElementById(tid),q=document.getElementById(qid),c=document.getElementById(cid);
  var btns=[].slice.call(document.querySelectorAll('[data-'+attr+']'));
  var mode='all';
  function apply(){
   var s=q.value.trim().toLowerCase(),n=0;
   [].forEach.call(t.tBodies[0].rows,function(r){
    var ok=tests[mode](r)&&(!s||r.getAttribute('data-t').indexOf(s)>=0);
    r.className=ok?'':'hide'; if(ok)n++;
   });
   c.textContent=n+' shown';
  }
  btns.forEach(function(b){b.addEventListener('click',function(){
   mode=b.getAttribute('data-'+attr);
   btns.forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});
   apply();});});
  q.addEventListener('input',apply); apply();
 }
 wire('t1','q1','c1','f1',{
  all:function(){return true;},
  gov:function(r){return r.getAttribute('data-g')==='gov';},
  wait:function(r){return r.getAttribute('data-r').indexOf('YES')===0;},
  done:function(r){return r.getAttribute('data-r').indexOf('ALREADY')===0;},
  weak:function(r){var q=r.getAttribute('data-q');return q==='weak'||q==='wrong'||q==='placeholder'||q==='unjudged';},
  gone:function(r){return r.getAttribute('data-m')==='1';},
  precious:function(r){return r.getAttribute('data-b')==='precious';},
  dump:function(r){return r.getAttribute('data-b')==='dump';},
  nobucket:function(r){return r.getAttribute('data-b')==='unassigned';}
 });
 wire('t2','q2','c2','f2',{
  all:function(){return true;},
  held:function(r){return r.getAttribute('data-s')==='HELD';},
  week0:function(r){var c=r.getAttribute('data-c');return c==='BLAST'||c==='UNLOCK';},
  later:function(r){var c=r.getAttribute('data-c');return c==='PACKAGE'||c==='TRANSMISSION';},
  deps:function(r){return r.cells[4].textContent.indexOf('nothing')<0;}
 });
})();
</script>`;
  return { html: page({ title: `THE ARTIFACT TRACKER — ${STAMP}`, css: OPS_CSS, body }),
    waiting: waiting.length, addressed: addressed.length, runways: runwayOfWaiting };
}

/* ═══════════════════════════════════════════════════════════════════════════
   K4 — THE EGG TRACKER
   ═══════════════════════════════════════════════════════════════════════════ */
/* Mike named six ledgered-but-unbuilt eggs in the brief. Four are `egg.*` rows.
   Two are NOT, and saying so is the useful part: the buffalo nickels are an
   `artifact` row whose dependency is a reveal class that does not exist, and
   the album-art screen egg is DELIBERATELY not a ledger row at all. The glass
   dice are neither — they are a prop with an egg-shaped finding attached, in
   the other repository. Each is carried here with the reason it is where it
   is, because "why is this not in the egg table" is a real answer. */
const OFF_LEDGER = [
  { id: "phys.nickels", where: "reveal/ledger.json — class `artifact`, not `egg`",
    name: "The buffalo nickels — canon, physically present, deliberately unphotographed.",
    mech: "There is no mechanism, and that is the proposal. Mike: <i>“Maybe the nickels are hidden inside of the thing so they're not even photographed. There's no photograph of the nickels, so nobody knows anybody's getting nickels.”</i> A thing nobody can know about until they hold it.",
    needs: "A REVEAL CLASS THAT DOES NOT EXIST YET. The four classes are ANNOUNCED · HINTED · DISCOVERED · HELD, and HELD means <i>not yet</i>. A sealed thing may be reachable <i>never</i>, and the table cannot tell those apart. A fifth class — <code>SEALED</code> — is PROPOSED AND NOT ADOPTED; naming it is Mike's. Register M35.",
    stands: "In the ledger as an artifact, transfer PACKAGE, no named arrival week. The persona work adds a second demand: the sports fanatic and the magician are two named personas with no case, <b>and both will need a buffalo nickel</b>.",
    note: "It is not filed under eggs because it is not one yet: an egg is planted where somebody could find it, and nothing about this is placed anywhere." },
  { id: "M78", where: "docs/OPEN_ACTIONS.md — deliberately NOT a ledger row",
    name: "The album-art screen egg — hide something in the screen of the unit.",
    mech: "The unit's own front glass appears inside the album covers. Something is hidden in the screen.",
    needs: "Whether to do it, on which covers, and what is in the screen. All three are Mike's.",
    stands: "GRADED HIGH, BY MIKE'S OWN REASONING: <i>once a visitor finds one, they will check every cover forever — and every time the art changes.</i> That is the only mechanism proposed for this building that turns a static asset into a recurring reason to look.",
    note: "<b>IT IS DELIBERATELY NOT A LEDGER ROW, AND THE REASON IS THE RULE:</b> a ledger row is a claim that a thing EXISTS. Nothing was built and no art was touched. Mike's own constraint is recorded with the grade and is the harder half — <i>this does not mean eggs everywhere</i>. The failure mode of a good egg is a house that starts hiding things by habit." },
  { id: "the glass dice", where: "weird-baby-robots/docs/PROPS_LEDGER-20260804.md — a prop, in the other repository",
    name: "Five blue glass dice in a chrome shaker — the gambler's case.",
    mech: "None built and none proposed. What exists is a research finding with an egg's shape.",
    needs: "A photograph of the vessel — both halves, the base, any stamping — before anything can be said about maker or date. Mike's instruction was answered as far as the footage allows; the rest needs the object, not the internet.",
    stands: "MEASURED AND IDENTIFIED. Five dice is diagnostic: it is the poker family, and the container is the container rather than the point. Each die is about 9.5 mm — miniature, against 19 mm casino stock. <b>AND THE MATERIAL IS THE STORY POINT:</b> glass has been the wrong material for working dice for two thousand years, so these are novelty. <b>A glass die cannot be loaded</b> — you cannot hide mass inside clear glass. Against a marked deck, a sleeve clamp and a copy of <i>Marked Cards and Loaded Dice</i>, <b>five transparent dice are the one object in that case that is provably honest.</b>",
    note: "A character detail that came from the material rather than from the identity. It is not in the egg table because nobody has proposed planting it; it is here because it is the best unplanted thing in either repository." },
];

function buildEggs() {
  const eggs = LEDGER.rows.filter(r => r.cls === "egg");
  const planted = eggs.filter(e => e.state === "HELD" && e.build !== "NOT_BUILT");
  const spent = eggs.filter(e => e.state === "REVEALED");
  const waiting = eggs.filter(e => e.build === "NOT_BUILT");
  const onlyHere = eggs.filter(e => (e.note || "").length > 240);

  const card = e => `<div class="card" data-t="${esc([e.id, e.name, e.where, (e.deps || []).join(" "), e.note].join(" ").toLowerCase())}"
   data-s="${e.state === "REVEALED" ? "spent" : e.build === "NOT_BUILT" ? "waiting" : "planted"}">
  <h4>${esc(e.name)}</h4>
  <p class="id">${esc(e.id)}</p>
  <p><span class="tag ${e.state === "REVEALED" ? "y" : "g"}">${esc(e.state)}</span>
     <span class="tag">build ${esc(e.build)}</span>
     <span class="tag ${e.shown ? "n" : ""}">${e.shown ? "label visible" : "nothing hints at it"}</span></p>
  <p class="meta"><span class="k">mechanism &middot;</span> <code>${esc(e.where)}</code>
     ${e.reach ? `<br><span class="k">reached by &middot;</span> ${esc(e.reach)}` : ""}</p>
  <p class="meta" style="margin-top:7px"><span class="k">needs first &middot;</span>
     ${(e.deps || []).length ? (e.deps || []).map(esc).join("; ") : "<i>nothing — it is where it is by choice</i>"}</p>
  ${e.note ? `<p class="meta" style="margin-top:9px;border-top:1px solid var(--line2);padding-top:8px">${esc(e.note)}</p>` : ""}
</div>`;

  const off = o => `<div class="card">
  <h4>${esc(o.name)}</h4>
  <p class="id">${esc(o.id)} &mdash; ${esc(o.where)}</p>
  <p class="meta"><span class="k">mechanism &middot;</span> ${o.mech}</p>
  <p class="meta" style="margin-top:7px"><span class="k">needs first &middot;</span> ${o.needs}</p>
  <p class="meta" style="margin-top:7px"><span class="k">where it stands &middot;</span> ${o.stands}</p>
  <p class="meta" style="margin-top:9px;border-top:1px solid var(--line2);padding-top:8px">${o.note}</p>
</div>`;

  const body = `<div class="wrap">
${BACK}
<h1>The egg tracker</h1>
<p class="sub">${eggs.length} rows in the ledger &middot; ${planted.length} planted &middot; ${spent.length} spent &middot; ${waiting.length} waiting &middot; and ${OFF_LEDGER.length} that are not in the table at all</p>

<div class="note">
<p><b>PLANTED</b> means built, held, and nobody told &mdash; it exists in the tree
today and finding it is the visitor's job. <b>SPENT</b> means it is on the glass;
whoever finds it, finds it, and nothing there is recoverable. <b>WAITING</b>
means an idea with a row and no build, ledgered so it is not a thing somebody
remembers hearing once.</p>

<p><b>${onlyHere.length} EGGS HAVE NO WRITTEN FORM ANYWHERE BUT THEIR LEDGER
ROW.</b> The <code>note</code> field IS the egg &mdash; it is printed on no page,
in either repository, by Mike's own instruction that the reason must not be
explained on the glass. Explaining one on a face would spend it in the same
commit that planted it.</p>

<p class="ask"><b>AND NOTHING IN THIS MUSEUM REPORTS AN EGG BEING TRIPPED.</b>
So <i>planted</i> is a statement about the tree and never about a visitor. The
poke is the standing gate on every future egg by your own ruling &mdash;
<i>do not bother with a next-level egg until this one at least catches on</i>
&mdash; and that condition is met by your word, not by a number.</p>
</div>

<div class="bar">
  <input id="q" placeholder="filter — name, mechanism, dependency, note&hellip;">
  <button data-f="all" aria-pressed="true">all</button>
  <button data-f="planted">planted</button>
  <button data-f="spent">spent</button>
  <button data-f="waiting">waiting</button>
  <span class="count" id="c"></span>
</div>
<div class="cards" id="grid">
${eggs.map(card).join("\n")}
</div>

<h2>Named in the brief, and not in the egg table &mdash; with the reason</h2>
<div class="note" style="margin-bottom:14px"><p>Three of the things Mike named
are not <code>egg.*</code> rows. Two are somewhere else on purpose and one is in
the other repository. <b>Why a thing is not in the egg table is itself an
answer</b>, so each carries it.</p></div>
<div class="cards">
${OFF_LEDGER.map(off).join("\n")}
</div>

<footer>Built from <code>reveal/ledger.json</code> (class <code>egg</code>) plus
the three rows above, which are read out of <code>docs/OPEN_ACTIONS.md</code> and
the robots repo's props ledger. Same population as <code>npm run reveal:eggs</code>.
Nothing here is written back.</footer>
</div>
<script>
(function(){
 var q=document.getElementById('q'),c=document.getElementById('c'),g=document.getElementById('grid');
 var btns=[].slice.call(document.querySelectorAll('[data-f]')),mode='all';
 function apply(){var s=q.value.trim().toLowerCase(),n=0;
  [].forEach.call(g.children,function(el){
   var ok=(mode==='all'||el.getAttribute('data-s')===mode)&&(!s||el.getAttribute('data-t').indexOf(s)>=0);
   el.style.display=ok?'':'none'; if(ok)n++;});
  c.textContent=n+' shown';}
 btns.forEach(function(b){b.addEventListener('click',function(){mode=b.getAttribute('data-f');
  btns.forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});apply();});});
 q.addEventListener('input',apply);apply();
})();
</script>`;
  return { html: page({ title: `THE EGG TRACKER — ${STAMP}`, css: OPS_CSS, body }), n: eggs.length, planted: planted.length, waiting: waiting.length };
}

/* ═══════════════════════════════════════════════════════════════════════════
   K5 — THE WEEK-ONE OUTLINE
   ═══════════════════════════════════════════════════════════════════════════ */
function buildWeek1(artifactCounts, eggCounts) {
  /* [B2 2026-08-07] a check can now be OPEN, RULED or an agreement */
  const nOpen = COLLISIONS.filter(c => c.open).length;
  const nRuled = COLLISIONS.filter(c => !c.open && c.ruled).length;

  /* what has ARRIVED by week one, off the transfer rule and nothing else */
  const arrived = LEDGER.rows.filter(r => r.transfer === "BLAST" || r.transfer === "UNLOCK");
  const notYet = LEDGER.rows.filter(r => r.transfer === "PACKAGE" || r.transfer === "TRANSMISSION");
  const heldArrived = arrived.filter(r => r.state === "HELD" && r.cls !== "egg");
  const eggsArrived = LEDGER.rows.filter(r => r.cls === "egg" && (r.transfer === "BLAST" || r.transfer === "UNLOCK") && r.state === "HELD");

  /* A day's `reach` is a transfer class, so it is checked against the transfer
     table rather than asserted — and a class whose week is 0 is in hand. */
  const reachLine = d => d.reach.map(c => {
    const t = TRANSFERS[c];
    const n = LEDGER.rows.filter(r => r.transfer === c).length;
    return `<b>${esc(c)}</b> &mdash; ${esc(t.name)} ${n} rows, `
      + `<span class="tag ${t.week === 0 ? "y" : "n"}">${t.week === 0 ? "IN HAND" : "NOT ARRIVED"}</span>`;
  }).join(" &middot; ");

  const dayBlock = d => `<div class="day">
  <div class="hd">
    <span class="n">Week 1 &middot; Day ${d.n} &middot; ${esc(d.dow)}</span>
    <span class="slot">&mdash; your headline for this day is not written, and nothing on this page will write it &mdash;</span>
  </div>
  <div class="bd">
    <div class="mine"><span class="lbl">yours &middot; the day's headline, in your words</span>
      <p class="k" style="margin:0"><i>empty, and it stays empty until you dictate into it.
      Everything below this line is Ops&rsquo;.</i></p></div>
    <div class="scaf"><span class="lbl">Ops &middot; the day as structured <span class="rail">blue rail</span></span>
      <p style="margin:0 0 7px;font-size:16px"><b style="color:var(--fg)">${esc(d.headline)}</b></p>
      <p style="margin:0 0 8px">${esc(d.shape)}</p>
      <p class="k" style="margin:0 0 4px;font-size:11px;letter-spacing:.13em;text-transform:uppercase">Topics</p>
      <ul style="margin:0 0 8px">${d.topics.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
      <p class="k" style="margin:0;font-size:12.5px">What this day reaches for: ${reachLine(d)}.
      Which of the ${heldArrived.length} held-and-arrived things it actually shows is an
      authoring decision and is not derivable &mdash;
      <a href="artifacts.html">the artifact tracker</a> &middot;
      <a href="eggs.html">the egg tracker</a>.</p></div>
  </div>
</div>`;

  const body = `<div class="wrap">
${BACK}
<h1>The story outline &middot; week one, days 1&ndash;5</h1>
<p class="sub">${esc(WEEK.headline)} &mdash; structured by Ops from what you said on ${esc(W1_ORIGIN.spokenOn)}, and not in your words</p>

<div class="note">
<p class="ask"><b>READ THIS BEFORE YOU READ A SINGLE HEADLINE BELOW, BECAUSE IT
IS THE ONLY THING THAT KEEPS THEM USEFUL.</b> <b>NOTHING ON THIS PAGE IS QUOTED.
NOT ONE LINE.</b> You spoke the week's shape aloud on ${esc(W1_ORIGIN.spokenOn)};
Ops structured it into a headline, five days, topics and standing rules and wrote
every sentence of it. So the whole outline sits on the
<b style="color:var(--blu)">blue</b> rail &mdash; the shape is yours, the words are
Ops&rsquo;. A paraphrase rendered in gold is indistinguishable a week from now from
something you actually said, and that is the exact failure this page was built to
avoid.</p>

<p><b>THE GOLD RAIL IS STILL EMPTY ON EVERY DAY, DELIBERATELY.</b> Every day below
has an empty gold slot above its blue one. That slot is where your own headline
goes when you dictate it. There is still <b>no authored day-by-day outline in
either repository</b> &mdash; no week headline, no day headlines, no topic list,
no <code>weight</code> field on anything story-shaped. That finding (K&#8209;b) has
not been closed by this page; it has been given a working draft to argue with.</p>

<p><b>ONE MARKER YOU WILL SEE AND SHOULD TRUST:</b>
<span class="rail m">his rule &middot; Ops wording</span> means you named that RULE
as a rule &mdash; the Friday formula, the standing Record rules, the bouncy ball
law. The rule is yours; the sentence is still Ops&rsquo;, so it renders blue like
everything else. Nothing on this page is unlabelled.</p>

<p><b>THE OUTLINE WAS RUN AGAINST THE TREE AND YOU HAVE SINCE RULED ON TWO OF THE
CHECKS.</b> ${COLLISIONS.length} checks against what the repository actually holds
&mdash; the transfer classes, the ledger, the one Record entry that exists.
<b>${nOpen} unresolved</b>, <b>${nRuled} ruled by you on ${esc(W1_RULED_ON)}</b>
(<a href="#collisions">the prototype, and the bouncy ball law</a>), the rest
agreements. A ruled check is kept on this page rather than deleted, because the
collision was real and it is why the ruling was needed.</p>

<p><b>AND ONE OF THOSE RULINGS CHANGES DAY 1 BELOW.</b> Record 013 is a
<b>prototype</b> &mdash; not day one, no re-dating, no defending &mdash; and the real
Record starts at <b>001</b> when you dictate it. So day 1's entry is 001 and does not
exist yet; the entry sitting in the tree is not in that sequence.</p>
</div>

<h2>What week one is, as a fact about arrivals</h2>
<div class="tw"><table>
<thead><tr><th>class</th><th>window</th><th>what it carries</th><th>rows</th><th>in hand by week 1</th></tr></thead>
<tbody>
${CLASSES.map(c => {
  const t = TRANSFERS[c];
  const n = LEDGER.rows.filter(r => r.transfer === c).length;
  const inHand = t.week === 0;
  return `<tr><td><b>${esc(c)}</b></td><td>${esc(t.name)}</td><td>${esc(t.holds)}</td><td>${n}</td>
  <td><span class="tag ${inHand ? "y" : "n"}">${inHand ? "YES" : "NO"}</span></td></tr>`;
}).join("\n")}
</tbody></table></div>
<p class="k" style="font-size:12.5px;margin-top:10px"><b>${arrived.length} things
have arrived and ${notYet.length} have not.</b> The rule is absolute and checked:
an asset may only be SHOWN after it has been TRANSFERRED. A week-one entry that
reaches for a PACKAGE row is reaching for something the story does not yet
have &mdash; and the packages are what <i>earn</i> their photographs.</p>

<h2>The week</h2>
<div class="day"><div class="hd">
  <span class="n">Week 1 &middot; the week's own headline</span>
  <span class="slot">&mdash; yours is not written &mdash;</span>
</div><div class="bd">
  <div class="mine"><span class="lbl">yours</span>
    <p class="k" style="margin:0"><i>empty.</i></p></div>
  <div class="scaf"><span class="lbl">Ops &middot; the week as structured <span class="rail">blue rail</span></span>
    <p style="margin:0 0 7px;font-size:19px"><b style="color:var(--fg)">${esc(WEEK.headline)}</b></p>
    <p style="margin:0 0 6px">${WEEK.days} days, ${esc(WEEK.span)}. ${esc(WEEK.spanRule)}</p>
    <p class="k" style="margin:0;font-size:12.5px">${esc(W1_ORIGIN.rule)}</p></div>
  <div class="scaf"><span class="lbl">Ops &middot; the one thing week one is already committed to</span>
    <p style="margin:0">The asset timeline's own founding sentence, and it is
    <b>the only verbatim sentence anywhere on this page</b> &mdash; it is carried from
    <code>reveal/transfers.mjs</code>, where it has been in writing since 5 August with
    its source named:
    <b>“the first Record must produce the first images of NIAC and VIIIp so the site has
    images to post — which means those images arrived in the email blast.”</b>
    A constraint about <i>what the week must produce</i> rather than about what any day says.</p></div>
</div></div>

<h2>The weekend the week is named after</h2>
<div class="note" style="margin-bottom:14px"><p>Not a day of week one &mdash; it is
what happened before the museum opened, and four of the five days point back at it.
<b>The transfer model already calls this window “Friday to Sunday, pre-launch”</b>
and was written on 5 August from the asset timeline, without reference to this
outline. They agree on the weekend independently; see
<a href="#collisions">W&#8209;2</a>.</p></div>
<div class="scaf" style="margin-bottom:26px">
  <span class="lbl">Ops &middot; the prelude, structured <span class="rail">blue rail</span></span>
  <ul class="tl">
${PRELUDE.map(p => `    <li><span class="at">${esc(p.at)}</span><span>${esc(p.what)}</span></li>`).join("\n")}
  </ul>
</div>

${DAYS.map(dayBlock).join("\n")}

<h2>The Friday formula</h2>
<div class="scaf" style="margin-bottom:26px">
  <span class="lbl">${esc(FRIDAY_FORMULA.name)} <span class="rail m">his rule &middot; Ops wording</span></span>
  <p style="margin:0 0 8px">${esc(FRIDAY_FORMULA.claim)}</p>
  <ul style="margin:0">${FRIDAY_FORMULA.body.map(b => `<li>${esc(b)}</li>`).join("")}</ul>
</div>

<h2>Standing rules for the Record</h2>
<div class="note" style="margin-bottom:14px"><p>Not week-one rules &mdash; the
Record's own form. They are here because <b>four of the five change what a week-one
day is allowed to be</b>, and the bearing of each is spelled out rather than left
for the reader to work out at dictation speed.</p></div>
<div class="tw"><table>
<thead><tr><th style="width:44%">the rule</th><th>what it does to week one</th></tr></thead>
<tbody>
${RECORD_RULES.map(r => `<tr>
  <td><span class="rail m">his rule &middot; Ops wording</span><div style="margin-top:5px">${esc(r.rule)}</div></td>
  <td>${esc(r.bearing)}</td></tr>`).join("\n")}
</tbody></table></div>

<h2>What each day could reach for &mdash; the whole eligible set, once</h2>
<div class="note" style="margin-bottom:14px"><p>Printed once rather than five
times, because it is the same set every day and repeating it would imply a
distribution nobody has authored.</p></div>

<h3>Pictures &mdash; ${artifactCounts.waiting} of the machines are behind the door and one entry away</h3>
<p style="margin:0 0 6px">Every one is a real file the museum owns, already
judged in the asset table, with no code between it and a wall. <b>One picture
has ever been delivered</b> &mdash; the power switch round the back, by Record
013, which is the prototype. <a href="artifacts.html">The full table, filterable
&rarr;</a></p>
${runwayBlock(artifactCounts.runways, "these " + artifactCounts.waiting + " pictures")}

<h3>Eggs &mdash; ${eggsArrived.length} are planted, arrived, and could be spent</h3>
<p style="margin:0 0 6px">Spending an egg is a Record entry that explains it, and
it is one-way. ${eggCounts.waiting} more are ledgered and unbuilt, so a week-one
entry cannot reach them. <a href="eggs.html">The full table &rarr;</a></p>

<h3>Specification &mdash; two faces are honest and thin</h3>
<p style="margin:0 0 6px">Both Technical Specifications faces lost their
real-build registers and <b>nothing was written to replace what went</b>. The
MGK-VIIIp face now carries no specifications at all. Everything the fiction has
ever asserted about either machine is assembled on
<a href="specsheet.html">the spec sheet &rarr;</a>, marked asserted, implied or
contradicted, with every conflict shown both ways.</p>

<h3>Things week one must not reach for</h3>
<ul>
<li>Any <b>PACKAGE</b> row &mdash; the units, the cases, the objects and the manual
pieces arrive on four Fridays in weeks 3&ndash;7, and they earn their photographs.</li>
<li>Any <b>LATER TRANSMISSION</b> &mdash; months 2&ndash;3.</li>
<li>Anything with <b>no named arrival week</b>, which means exactly one thing: not
showable, because nobody has said it got here.</li>
</ul>

<h2 id="collisions">Where the outline meets the tree &mdash; ${COLLISIONS.length} checks</h2>
<div class="note" style="margin-bottom:14px"><p>Each of these is a claim the
outline makes, run against what the repository actually holds. <b>${nOpen}
of the ${COLLISIONS.length} is still unresolved</b>${nOpen ? " and is drawn in red" : ""}.
<b>${nRuled} you ruled on today</b> &mdash; those carry your ruling in gold, because
the ruling is yours and it is quoted from what you said. The rest are agreements,
and two of them are worth knowing about because nobody arranged them.</p>
${nRuled ? `<p class="ask"><b>A RULED CHECK IS NOT DELETED FROM THIS PAGE.</b> The
collision was real, it is why the ruling was needed, and a page that quietly drops
what it used to say cannot be checked against itself a week later.</p>` : ""}</div>
${COLLISIONS.map(c => `<div class="day"><div class="hd">
  <span class="n">${esc(c.id)} &middot; ${c.open ? "unresolved" : c.ruled ? "RULED" : "agrees"}</span>
  <span class="slot" style="color:${c.open ? "var(--red)" : c.ruled ? "var(--gold)" : "var(--grn)"};font-size:15px;font-style:normal">${esc(c.title)}</span>
</div><div class="bd">
  <div class="scaf"><span class="lbl">the check <span class="rail">blue rail</span></span>
    <p style="margin:0 0 6px">${esc(c.check)}</p>
    <p class="k" style="margin:0;font-size:12px">Settled by <code>${esc(c.derivedFrom)}</code></p></div>
${c.ruled ? `  <div class="mine"><span class="lbl">yours &middot; the ruling, ${esc(W1_RULED_ON)}</span>
    <p style="margin:0 0 6px">${esc(c.ruled)}</p>
    ${c.also ? `<p class="k" style="margin:0;font-size:12.5px">${esc(c.also)}</p>` : ""}</div>` : ""}
${c.open ? `  <div class="mine"><span class="lbl">yours &middot; the decision</span>
    <p style="margin:0 0 6px">${esc(c.open)}</p>
    ${c.also && !c.ruled ? `<p class="k" style="margin:0;font-size:12.5px">${esc(c.also)}</p>` : ""}</div>` : ""}
</div></div>`).join("\n")}

<footer>Days are a frame, not a schedule &mdash; and the standing rules say the day
count is not the entry count. The outline is Ops&rsquo; structuring of what you said on
${esc(W1_ORIGIN.spokenOn)} and lives in <code>reveal/week-one.mjs</code>; the checks
against it are built from <code>reveal/transfers.mjs</code>,
<code>reveal/record-entries.mjs</code> and <code>reveal/ledger.json</code>. Every gold
slot on this page is still empty, which is the one thing about it that has not
changed.</footer>
</div>`;
  return page({ title: `THE STORY OUTLINE — WEEK ONE — ${STAMP}`, css: OPS_CSS, body });
}

/* ═══════════════════════════════════════════════════════════════════════════
   K6 — THE INDEX
   ═══════════════════════════════════════════════════════════════════════════ */
function buildIndex(a, e) {
  const body = `<div class="wrap">
<h1>The dictation prep</h1>
<p class="sub">Weird.Baby Museum &middot; assembled ${STAMP} &middot; four documents and this index &middot; Ops&#8209;to&#8209;Mike, and not part of the museum</p>

<div class="note">
<p>You are about to dictate the Record's first two weeks. These are the four
things to have open while you do it. <b>Nothing in any of them was invented</b>
&mdash; every figure, file, egg and conflict is carried from somewhere in one of
the two repositories, with its source named, and every gap is printed as a gap.
<b>The one thing not carried from a repository is the week-one outline</b>, which
is Ops&rsquo; structuring of what you said aloud on ${esc(W1_ORIGIN.spokenOn)}; it
now lives in <code>reveal/week-one.mjs</code>, it is labelled as Ops&rsquo; on every
row, and none of it is quoted.</p>
<p class="ask"><b>ONE RULE ACROSS ALL FOUR PAGES:</b> gold means the material is
yours, blue means Ops derived or structured it and the rule is named, and a red
slot means the thing is not written. A third marker appears only on the outline
&mdash; <span class="rail m">his rule &middot; Ops wording</span> &mdash; and means
you named the RULE but the sentence is still Ops&rsquo;. You should never have to
guess which you are reading.</p>
</div>

<div class="cards">
<div class="card">
  <h4><a href="specsheet.html">The in-story spec sheet</a></h4>
  <p class="id">K2 &middot; the thing to author from</p>
  <p>Every piece of story-generated technical data about both machines, from both
  repositories, set as a period one-sheet in the typed-page register. Marked
  <b>asserted</b>, <b>implied</b>, <b>contradicted</b> or <b>absent</b>; where two
  sources disagree, both readings print and the conflict is named.</p>
  <p class="meta">The manual's twelve-section structure was the candidate grouping and
  <b>it does not serve a one-sheet</b> &mdash; the page says so and says why, and every
  heading still carries its manual position so an authored row lands in the right place.
  Closes the missing item in <code>N-g</code> and <code>N-h</code>.</p>
</div>

<div class="card">
  <h4><a href="artifacts.html">The artifact tracker</a></h4>
  <p class="id">K3 &middot; what you can reach for today</p>
  <p>${a.addressed} addressable files joined to ${LEDGER.rows.length} revealable
  things, filterable like the contact sheet. Every row carries its judgement, its
  use, and the one verdict that matters while dictating: <b>can an entry show
  this today?</b></p>
  <p class="meta"><b>${a.waiting} pictures of the machines are behind the stage door
  right now</b>, each one entry away from a wall. Exactly one file has ever been
  delivered. <b>The two runways are on it</b> &mdash; precious reveals remaining and
  what is in the dump &mdash; and all ${a.runways.unassigned.n} are unassigned, so
  the precious runway is a bound and not a number.</p>
</div>

<div class="card">
  <h4><a href="eggs.html">The egg tracker</a></h4>
  <p class="id">K4 &middot; what is hidden, and what is only an idea</p>
  <p>${e.n} ledgered eggs &mdash; ${e.planted} planted, ${e.waiting} waiting &mdash;
  each with its mechanism, what it needs before it can be planted, and where it
  stands. Plus the three you named that are <b>not</b> in the egg table, each with
  the reason it is not.</p>
  <p class="meta">Four eggs have no written form anywhere but their ledger row.
  Nothing in this museum reports an egg being tripped.</p>
</div>

<div class="card">
  <h4><a href="week1.html">The story outline &middot; week one</a></h4>
  <p class="id">K5 &middot; W1 &middot; the cue card</p>
  <p><b>${esc(WEEK.headline)}</b> &mdash; the week headline, the weekend it is named
  after, ${DAYS.length} days with their topics, the Friday formula and
  ${RECORD_RULES.length} standing rules for the Record, each with what it does to
  week one.</p>
  <p class="meta"><b>ALL OF IT IS ON THE BLUE RAIL AND NONE OF IT IS QUOTED.</b> You
  spoke the week's shape on ${esc(W1_ORIGIN.spokenOn)}; Ops structured it and wrote
  every sentence. <b>Every gold slot is still empty</b> &mdash; that is where your own
  words go. ${COLLISIONS.length} checks were run against the tree;
  <b>${COLLISIONS.filter(c => c.open).length} are unresolved</b> and
  <b>${COLLISIONS.filter(c => !c.open && c.ruled).length} you ruled on
  ${esc(W1_RULED_ON)}</b> &mdash; the prototype and the bouncy ball law.</p>
</div>
</div>

<h2>Your two rulings of ${esc(W1_RULED_ON)}, and what they moved</h2>
<div class="note">
<p><b>THE BOUNCY BALL LAW CAPS POINTS OF FOCUS, NOT ASSETS.</b> Humans remember
one or two things; ten things reduces the odds they keep the one that matters
&mdash; and it does <i>not</i> mean the museum may not show more pictures.
<b>Two buckets:</b> the <b>precious</b> one is two or three genuine reveals a
<i>week</i> and those are what a reader remembers; the <b>dump</b> is everything
else, fun to look at, part of the story, part of the pile, and it has <b>no
ceiling</b>. Ten manual pages arriving is ONE point of focus. <b>The trackers were
counting the wrong thing and are fixed:</b> &ldquo;${esc(VOIDED.figure)}&rdquo; is
void, and what replaces it is two separate runways with a <b>bucket</b> field on
every asset &mdash; yours, unset, and Ops will not guess it.</p>

<p><b>RECORD 013 WAS A PROTOTYPE AND IS CLEARED OUT OF THE WAY.</b> It was chosen
because it was interesting enough to find the structure, and it did; it is not day
one and it needs no re-dating and no defending. <b>The real Record starts at
001</b>, when you dictate it. It is <b>kept rather than retired</b>, on your own
criterion &mdash; whichever keeps the Record honest <i>and</i> the machinery
exercised. It is the only thing in the museum exercising the entry renderer, the
index budgets, the per-entry ledger derivation and the one delivered picture, and
retiring it would have parked all four until 001 lands. <b>It is marked as the
prototype in these pages and in the ledger and NOWHERE ON THE GLASS</b>, because a
line whose subject is the making of the museum does not ship. <b>The one thing left
is its number</b> &mdash; under your own ruling the volume counts from 001, which
makes 013 a number in a sequence that has not started. It is untouched and it is one
word from you.</p>
</div>

<h2>What changed in the tree yesterday, beside these four</h2>
<div class="note">
<p><b>THE ELEVEN HELD PHOTOGRAPHS ARE DELETED</b>, on your ruling. Ten operator
plates and the manual's title page are off disk, out of the asset table and out
of the provenance register. <b>What the robot egg is left with:</b> three plates,
all of them upstream in the robots repo's culled 2021 set &mdash; the eye, the
shoulder, the hand on the control &mdash; and all three regenerable from the
source video, whose crop rectangles are recorded. The manual's title page cost
nothing at all: it was byte-identical to page 1 of the sixty-one the robots repo
generates. The ledger row says all of this in writing.</p>
</div>

<footer>Regenerate with <code>npm run dictation</code>. These pages read
<code>provenance/asset-table.json</code>, <code>reveal/ledger.json</code>,
<code>reveal/transfers.mjs</code>, <code>reveal/delivery.mjs</code> and
<code>tools/dictation/spec-source.mjs</code>, and write nothing back to any of them.</footer>
</div>`;
  return page({ title: `THE DICTATION PREP — ${STAMP}`, css: OPS_CSS, body });
}

/* ── WRITE ─────────────────────────────────────────────────────────────── */
fs.mkdirSync(OUT, { recursive: true });
const art = buildArtifacts();
const egg = buildEggs();
const files = [
  ["specsheet.html", buildSpecsheet()],
  ["artifacts.html", art.html],
  ["eggs.html", egg.html],
  ["week1.html", buildWeek1(art, egg)],
  ["index.html", buildIndex(art, egg)],
];
for (const [n, html] of files) {
  fs.writeFileSync(path.join(OUT, n), html);
  console.log(`  ${String(Math.round(Buffer.byteLength(html) / 1024)).padStart(4)} KB  ${path.relative(REPO, path.join(OUT, n))}`);
}
console.log(`\nTHE DICTATION PREP — ${files.length} files`);
console.log(`  record entries        ${recordEntries().length}`);
console.log(`  addressable files     ${art.addressed}`);
console.log(`  behind the door       ${art.waiting}  (one entry away from a wall)`);
console.log(`  eggs                  ${egg.n}  (${egg.planted} planted, ${egg.waiting} waiting)`);
console.log(`\n  open  ${path.join(OUT, "index.html")}`);
