/* ===========================================================================
   THE DICTATION PREP — the shared shell. [W1–W8 2026-08-07, THE WORKSHEET]
   ---------------------------------------------------------------------------
   Nothing here is new. Every declaration below was lifted OUT of
   `tools/dictation/prep.mjs` unchanged, character for character, when the
   worksheet became a second generator file and needed the same escaper, the
   same page frame and the same stylesheet.

   IT IS A MOVE AND IT WAS PROVED TO BE A MOVE: the three pages that did not
   change this round — `specsheet.html`, `artifacts.html`, `eggs.html` — were
   regenerated after the split and compared byte for byte against the copies
   taken before it. Identical. That comparison is the whole reason the shell is
   a separate file rather than a duplicated block: two copies of a stylesheet
   are two stylesheets, and the second one starts drifting the day somebody
   fixes a rule in the first.

   `runwayBlock` lives here for the same reason it always did — two pages draw
   it — and its own header is kept with it below, because the figure it
   replaced is void and the reason must travel with the code.
   =========================================================================== */
import { LAW, BUCKETS, VOIDED } from "../../reveal/focus.mjs";

export const STAMP = "2026-08-07";

export const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/* `~text~` marks a code span in the source strings so the data files stay free
   of markup. Nothing else in them is interpreted. */
export const rich = s => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/\*([^*]+)\*/g, "<i>$1</i>");

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
export function runwayBlock(r, ofWhat) {
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
export const OPS_CSS = `
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

export const TYPED_CSS = `
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

export function page({ title, css, body, favi = "📄" }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>${css}</style></head><body>
${body}
</body></html>
`;
}

export const BACK = `<p class="back"><a href="index.html">&larr; the dictation prep</a> &middot; Ops&#8209;to&#8209;Mike, ${STAMP} &middot; not part of the museum</p>`;
