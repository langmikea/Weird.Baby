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
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { STAMP, esc, runwayBlock, OPS_CSS, page } from "./shell.mjs";
import {
  ORIGIN as W1_ORIGIN, WEEK as WEEK1, PRELUDE, DAYS as DAYS1,
  FRIDAY_FORMULA, RECORD_RULES, COLLISIONS as COLL1,
} from "../../reveal/week-one.mjs";
import {
  ORIGIN as W2_ORIGIN, WEEK as WEEK2, DAYS as DAYS2, COLLISIONS as COLL2,
} from "../../reveal/week-two.mjs";
import { TRANSFERS, CLASSES } from "../../reveal/transfers.mjs";
import {
  WEEKS as ARC, MONTHS, BANDS, CHECKS as ARC_CHECKS, ORIGIN as ARC_ORIGIN,
  monthOf, preciousBudget,
} from "../../reveal/arc-twelve.mjs";
import { BUDGETS, FORMATS, CONSTRAINTS } from "../../reveal/record-shape.mjs";
import { recordEpoch } from "../../reveal/record-entries.mjs";

const HERE_DIR = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_DIR = path.resolve(HERE_DIR, "..", "..");
/* the folder the pages are written to. `prep.mjs` may be pointed elsewhere with
   --out; the durable answers file lives with the pages either way, so this is
   the default and prep passes nothing. */
const OUT_DIR = path.join(REPO_DIR, "docs", "dictation-20260807");

/* ═══ [D4/D5 2026-08-08] EVERY DAY GETS A REAL CALENDAR DATE ═════════════════
   D1's rule is that the story runs on real dates: an entry's date is the actual
   day it is published. Day one is `RECORD_EPOCH` in the Record itself, read out
   of it rather than restated (`recordEpoch()`), and every outline day follows
   by arithmetic — week 1 day 1 is the epoch, and each day after it is one day
   later. That is what lets the preview print a REAL register stamp and a REAL
   `Week n · Weekday` dateline instead of a placeholder, on days that have not
   been written yet as well as on the ones that have.

   THE ARITHMETIC IS CHECKED AGAINST THE OUTLINE'S OWN `dow`, and it fails the
   build if they disagree. Both weeks declare MON…FRI; if the epoch ever moves
   to a day that is not a Monday, day 1 stops being a Monday and every headline
   written for "the Friday" lands on a Wednesday. That is precisely the failure
   a slip would cause and precisely the one nothing would otherwise report.

   AND THE RECORD NUMBER IS NOT DERIVED. `no` is authored (M19) and Ops does not
   mint one, so the preview passes none: `RecordIndexRow` prints an empty mark
   rail that still holds its column, which is the component's own honest state
   and exactly what a reader sees today on Record 013. */
const DOW3 = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const EPOCH = recordEpoch();

function dayDate(weekN, dayN) {
  if (!EPOCH) return null;
  const [y, m, d] = EPOCH.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) + ((weekN - 1) * 7 + (dayN - 1)) * 86400000;
  const dt = new Date(t);
  const iso = dt.toISOString().slice(0, 10);
  return { iso, dow: DOW3[dt.getUTCDay()] };
}

function checkOutlineDates() {
  if (!EPOCH) return ["the Record declares no `recordEpoch`, so no day can carry a date"];
  const bad = [];
  for (const { w, days } of WEEKS) {
    for (const d of days) {
      const got = dayDate(w.n, d.n);
      if (got.dow !== String(d.dow).toUpperCase()) {
        bad.push(`week ${w.n} day ${d.n} is written as ${d.dow} and ${got.iso} is a ${got.dow}`);
      }
    }
  }
  return bad;
}

/* ── THE SLOT MODEL ──────────────────────────────────────────────────────
   One flat list, built once, used by the page, the map's mirrors and the
   collector. Its ids are what Mike pastes back to Ops, so they are stable,
   short and readable: W1.D3.EXEC, W2.D5.NOTES, ARC.W7.

   [T1 2026-08-07] THE TWO WEEK-SUMMARY SLOTS ARE GONE FROM HERE AND THAT IS A
   SUBTRACTION, NOT A MOVE OF CONVENIENCE. `W1.SUM` and `W2.SUM` asked for the
   headline of weeks one and two; the twelve-week page asks for the headline of
   all twelve, including those two. **A question asked on two pages gets two
   answers**, and it is worse than that here — each page has its own
   `localStorage` key, so neither can see the other's and nothing on either
   would say they disagree. The week headlines live on `arc.html` now, both
   pages say so, and this one is thirty slots of DAYS. */
/* [I2 2026-08-08] A SLOT NOW DECLARES WHAT ITS ANSWER HAS TO FIT, AND THE
   NUMBER IS IMPORTED RATHER THAN TYPED.
   MIKE: *the tool let him write a 477-character executive summary against a
   130-character index budget and said nothing until a gate caught it three
   rounds later. He must never again discover a limit from a report.*

   THE DEFECT WAS NOT ONLY A MISSING COUNTER — IT WAS A MISSING QUESTION.
   `EXEC` asks for *the paragraph a reader gets if they read nothing else*,
   which is unbounded and correct: it lands in a section of the entry and no
   gate has an opinion about its length. The constrained field is a DIFFERENT
   one — the index row's `line`, at most 130 characters — and the worksheet
   never asked for it at all. So he wrote the paragraph, Ops had nothing to put
   in the row, and the row is still empty three rounds later. Putting a
   130-character meter on `EXEC` would have been the wrong fix twice over: it
   would police a field that has no limit and still never ask for the field that
   does. `LINE` is the fix; the meter is the other half.

   THE ORDER IS THE READING ORDER AND IT IS DELIBERATE. Headline, then the one
   sentence under it in the index, then the paragraph, then the sections —
   shortest first, each one a longer version of the one above it, so the two
   short constrained answers are written before the long unconstrained one
   rather than distilled out of it afterwards.

   `lim` IS EITHER A CEILING OR A SHAPE. `{max}` counts characters against an
   imported budget; `{re}` matches a format. A field with no `lim` shows no
   meter, and BOTH pages say that in one line so an absent counter reads as
   "nothing to fit" rather than as an oversight. */
const FIELDS = [
  { k: "HEAD", label: "Headline", rows: 2,
    ph: "your headline for this day",
    lim: { max: BUDGETS.title.max,
      says: "The index row gives the headline ONE line and nothing truncates "
          + "any more, so a longer one overflows the row rather than clipping.",
      gate: BUDGETS.title.enforcedBy } },

  { k: "LINE", label: "The one sentence under it, in the index", rows: 2,
    ph: "one sentence — this is the whole summary in the index, not a teaser",
    note: "This is the field that was missing. It is the summary printed under "
        + "the headline in the Record's index, it is the WHOLE summary (there "
        + "is no ellipsis and no “more”), and with no separate lead on the "
        + "entry it also draws as the opening paragraph when the record is "
        + "opened. One sentence that can stand alone.",
    lim: { max: BUDGETS.line.max,
      says: "Your own rule: THE ENTIRE SUMMARY MUST FIT. The row holds two "
          + "lines and nothing truncates, so a longer summary overflows it.",
      gate: BUDGETS.line.enforcedBy } },

  { k: "EXEC", label: "Executive summary", rows: 5,
    ph: "the paragraph a reader gets if they read nothing else",
    /* [L3 2026-08-08] THE CAPITALS RULE MOVED HERE OFF THE MASTHEAD. It is a
       syntax he cannot discover from the box, so it belongs on the box — and
       the seven paragraphs it used to sit inside were the thing he said he
       never reads. Doctrine 25. */
    note: "No limit, and that is not an oversight — this lands in a section of "
        + "the entry, where the length of a section is a fact about the day. "
        + "Write as much as the day is worth. It is <b>not</b> what the index "
        + "row prints; that is the one sentence above. <b>A line on its own in "
        + "CAPITALS starts a new section and becomes its heading</b>, exactly "
        + "as you dictated Record 001 — <i>EXECUTIVE SUMMARY</i>, then "
        + "<i>DETAILED REPORT</i>. No capitals line draws one run of paragraphs." },

  { k: "NOTES", label: "Detailed sections, notes, etc.", rows: 5,
    ph: "sections, order, what to include, what to cut",
    /* [L3 2026-08-08] THE `ATTACH:` LINE MOVED HERE OFF THE MASTHEAD — same
       reason as EXEC's capitals rule. AND THE OLD SECOND HALF WAS STALE: it
       still said a payload beside sections is "silently dropped", which A0–A6
       fixed on 2026-08-08. A note that describes a defect somebody repaired is
       worse than no note. */
    note: "No limit. Your approved container is <b>four to seven sections</b>, "
        + "each holding one thought under a short all-caps label. <b>A line "
        + "reading <code>ATTACH: what it is</code> puts an attachment at the "
        + "foot of the entry</b>, under the writing — a photograph, a document "
        + "and a transmission all draw as the same row, so you can see the room "
        + "they take. Until Ops has the file the row says <i>not here yet</i> "
        + "and draws an outline rather than inventing a picture." },
];

const WEEKS = [
  { w: WEEK1, days: DAYS1, origin: W1_ORIGIN, id: "W1" },
  { w: WEEK2, days: DAYS2, origin: W2_ORIGIN, id: "W2" },
];

/* [I3 2026-08-08] ONE SLOT THAT IS NOT A DAY, AND IT IS THE OTHER SHAPE OF
   CONSTRAINT. Every other question on this page is answered in prose; this one
   has an exact format (`YYYY-MM-DD`) and breaking it produces NO ERROR — the
   entry renders, and silently has no dateline, no week number, no month band
   and no target for a newspaper door. `entryDate()` returns null and nobody
   reports it.

   IT IS ONE SLOT AND NOT TEN. Ten days do not need ten dates: `entryWeek()`
   counts from a declared epoch, so day one's calendar date derives every other
   one, and asking ten times is nine chances for two of them to disagree with
   each other. It is also the missing field in two standing rows (C8, and half
   of S-b) — the only thing either has ever waited on. */
const EPOCH_SLOT = {
  id: "REC.EPOCH",
  where: "DAY ONE — the calendar date the Record starts on (recordEpoch)",
  ops: null,
  lim: { re: FORMATS.date.pattern, says: FORMATS.date.says, why: FORMATS.date.why },
};

function slotList() {
  const out = [EPOCH_SLOT];
  for (const { w, days, id } of WEEKS) {
    for (const d of days) {
      for (const f of FIELDS) {
        out.push({
          id: `${id}.D${d.n}.${f.k}`,
          where: `WEEK ${w.n} — day ${d.n} ${d.dow} — ${f.label.toLowerCase()}`,
          /* only the one-line headline travels into the export; see the header */
          ops: f.k === "HEAD" ? d.headline : null,
          lim: f.lim || null,
        });
      }
    }
  }
  return out;
}

/* ── PIECES ─────────────────────────────────────────────────────────────── */
const opsMark = `<span class="ml">Ops</span>`;
const yoursMark = `<span class="ml y">yours</span>`;

/* THE METER, AND WHY IT DOES NOT USE `maxlength`.
   An input that refuses the 131st character is a tool that has made the
   decision for him mid-sentence and thrown the rest of the thought away. He
   asked to be WARNED when he crosses a limit, which is a different instrument:
   the text is always his, the count is always visible, and the moment it goes
   over, the field turns and says by how much and what will refuse it. A limit
   you can see is a constraint; a limit that eats your keystrokes is a bug.

   `data-lim` is the live counter and `data-over` is the sentence that appears
   only when it matters. Both are addressed by slot id, so one function in the
   client script serves every page built from this file. */
function meter(slotId, lim) {
  if (!lim) return "";
  const tail = lim.max
    ? `<span class="of"> / ${lim.max} characters</span>`
    : `<span class="of"> ${esc(lim.says)}</span>`;
  return `<div class="lim" data-lim="${esc(slotId)}"><b class="cnt"></b>${tail}</div>
<p class="limwarn" data-over="${esc(slotId)}"></p>`;
}

function pair(slotId, opsHtml, { rows = 2, ph = "", lim = null } = {}) {
  return `<div class="pair">
  <div class="c ops">${opsMark}${opsHtml}</div>
  <div class="c yours">${yoursMark}<textarea data-slot="${esc(slotId)}" rows="${rows}"
    placeholder="${esc(ph)}" spellcheck="true"></textarea>${meter(slotId, lim)}</div>
</div>`;
}

/* Ops' left-hand column, per field. THE `LINE` COLUMN IS EMPTY ON PURPOSE and
   says so: Ops has a shape for the day and a list of topics, and neither is a
   one-sentence summary. Drafting one would be picking his words for him, which
   is the exact act the empty index row on Record 001 exists to refuse. */
function opsColumn(f, d) {
  if (f.k === "HEAD") return `<p class="hl">${esc(d.headline)}</p>`;
  if (f.k === "EXEC") return `<p>${esc(d.shape)}</p>`;
  if (f.k === "NOTES") return `<ul>${d.topics.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`;
  return `<p class="none">No Ops draft. The day&rsquo;s shape and its topics are in the two
  boxes below; neither of them is a sentence, and turning one into a sentence for you is
  the edit this field exists to avoid.</p>`;
}

function fieldBlock(slotId, f, d) {
  return `<div class="fld"><div class="fh">${esc(f.label)}</div>
${f.note ? `<p class="fnote">${f.note}</p>` : ""}
${pair(slotId, opsColumn(f, d), { rows: f.rows, ph: f.ph, lim: f.lim })}
</div>`;
}

/* THE PREVIEW BUTTON ON A DAY. It says what it will show rather than "preview",
   because the thing worth knowing before pressing it is that this is not an
   impression of the Record — it is the Record's own components at this window's
   width. */
function previewButton(weekId, w, d) {
  const dt = dayDate(w.n, d.n);
  return `<button type="button" class="pvgo" data-pv="${weekId}.D${d.n}"
    title="see this day drawn by the museum's own components">See it on the page${
    dt ? ` &middot; ${esc(dt.iso)}` : ""}</button>`;
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
  ${previewButton(weekId, w, d)}
  ${beat}
</div>
<div class="bd">
${collide}
${FIELDS.map(f => fieldBlock(`${weekId}.D${d.n}.${f.k}`, f, d)).join("\n")}
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
/* [U5] the file-restore banner is NEWS, not an error. Same box, calmer colour:
   a red panel saying your work was restored reads as your work was lost. */
.warn.file{border-color:#4a6a3a;background:#1a2118;color:#bcd6ae}
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
/* [I2 2026-08-08] THE LIVE COUNTER AND ITS WARNING.
   Three states and they are legible without the colour, because a counter that
   only says "over" in red says nothing to a colour-blind reader and nothing at
   all on a printed page: the number itself changes to "14 OVER" and the
   sentence below appears. Colour is the second signal, never the only one. */
.lim{margin:5px 0 0;font-size:11.5px;color:var(--dim2);letter-spacing:.02em}
.lim .cnt{color:var(--dim);font-variant-numeric:tabular-nums}
.lim.near .cnt{color:var(--amb)}
.lim.over{color:var(--redfg)}
.lim.over .cnt{color:var(--redfg);font-weight:700}
.lim.ok .cnt{color:var(--grn)}
/* [I2 2026-08-08] THE WARNING'S CLASS IS \`limwarn\` AND NOT \`over\`, AND THE LAP
   IS WHY. \`.over{display:none}\` was written for this paragraph and matched the
   COUNTER as well the moment the counter took its \`over\` state — so the live
   count vanished at exactly the instant it had something to say, which is the
   one failure this whole feature exists to prevent. Two elements, two names. */
.limwarn{display:none}
.limwarn.on{display:block;margin:7px 0 0;padding:8px 11px;border-left:3px solid var(--red);
 background:#241a19;color:var(--redfg);font-size:12.5px;line-height:1.5}
.limwarn.on b{color:#ffb4a6}
textarea.bad{border-color:#8a3b2e;background:#1e1717}
.fnote{margin:0 0 9px;font-size:12.5px;color:var(--dim);line-height:1.55;max-width:78ch}
.fnote b{color:var(--fg)}
.c .none{color:var(--dim2);font-style:italic;font-size:13px}
.cbar .ovr{display:none}
.cbar .ovr.on{display:inline;color:var(--redfg);font-weight:700}
/* ── [D4 2026-08-08] THE LIVE PREVIEW ───────────────────────────────────
   THE OVERLAY IS FULL-BLEED AND THE BODY STOPS SCROLLING BEHIND IT, AND THAT
   IS ARITHMETIC RATHER THAN DRAMA. The museum's whole type ramp is
   \`clamp(1.02rem, min(1.35vw, 4.4cqh), 1.28rem)\` — a function of the VIEWPORT
   — and every measure on the page is in \`ch\` of it. The frame is therefore
   only exact at the width the museum itself would have, which is this window.
   \`overflow:hidden\` on the body removes the worksheet's own scrollbar, so
   100vw IS the window and the iframe is laid out at the museum's own width to
   the pixel. A pane sharing the page would be a different size, a different
   measure and a different wrap.
   HEIGHT IS NOT FREE EITHER, AND THE FIRST CUT GOT THAT WRONG. The clamp's
   middle term is \`min(1.35vw, 4.4cqh)\` — the ramp reads the viewport's HEIGHT
   as well as its width. A bar and an editor stacked above and below the frame
   left it 368px tall, \`4.4cqh\` fell to 16.192px, the clamp dropped to its
   1.02rem floor, and the preview drew its body at **15.3408px against the live
   page's 15.4031px**. Four tenths of one per cent — invisible, wrong, and
   exactly the "nearly right" Mike ruled out. So the frame is the WHOLE window
   and the two strips FLOAT OVER IT. He loses a band of the preview to the
   editor and can scroll it; he does not lose the type. */
.pv{position:fixed;inset:0;z-index:60;display:none;background:#0d0d11}
.pv.on{display:block}
body.previewing{overflow:hidden}
.pvbar{position:absolute;left:0;right:0;top:0;z-index:2;
 display:flex;gap:14px;align-items:baseline;flex-wrap:wrap;
 padding:8px 14px;background:#15141ae8;border-bottom:1px solid var(--line)}
.pvwho{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}
.pvnote{font-size:11.5px;color:var(--dim2);flex:1 1 240px;min-width:0}
.pvbar button{background:transparent;border:1px solid var(--line);color:var(--dim);
 padding:4px 10px;border-radius:3px;cursor:pointer;
 font:600 10.5px/1.3 -apple-system,"Segoe UI",system-ui,sans-serif;
 letter-spacing:.12em;text-transform:uppercase}
.pvbar button:hover{border-color:var(--gold);color:var(--gold)}
.pvbar button[disabled]{opacity:.35;cursor:default}
/* THE FRAME IS THE VIEWPORT. Absolute, inset 0, no border — its layout
   viewport is the browser's, in both dimensions, which is the whole mechanism
   above. Nothing may be added that reduces it. */
.pvframe{position:absolute;inset:0;width:100%;height:100%;border:0;
 background:#fff;display:block;z-index:1}
.pvfail{display:none;position:absolute;left:0;right:0;top:44px;z-index:3;
 padding:18px;color:var(--redfg);background:#241a19;font-size:13.5px}
.pvfail.on{display:block}
.pvedit{position:absolute;left:0;right:0;bottom:0;z-index:2;
 background:#15141af2;border-top:1px solid var(--line);padding:9px 14px 11px}
.pvtabs{display:flex;gap:7px;flex-wrap:wrap;margin:0 0 7px}
.pvtabs button{background:transparent;border:1px solid var(--line);color:var(--dim2);
 padding:3px 9px;border-radius:3px;cursor:pointer;
 font:600 10.5px/1.3 -apple-system,"Segoe UI",system-ui,sans-serif;
 letter-spacing:.1em;text-transform:uppercase}
.pvtabs button[aria-pressed="true"]{border-color:var(--gold);color:var(--gold)}
.pvedit textarea{display:block;width:100%;height:88px;resize:vertical;
 background:#191820;border:1px solid var(--line);color:var(--fg);border-radius:3px;
 padding:8px 10px;font:14px/1.55 -apple-system,"Segoe UI",system-ui,sans-serif}
.pvedit textarea:focus{outline:0;border-color:var(--gold)}
.pvedit textarea.bad{border-color:#8a3b2e;background:#1e1717}
.pvgo{margin-left:12px;background:transparent;border:1px solid var(--line);color:var(--dim2);
 padding:3px 9px;border-radius:3px;cursor:pointer;
 font:600 10px/1.3 -apple-system,"Segoe UI",system-ui,sans-serif;
 letter-spacing:.1em;text-transform:uppercase}
.pvgo:hover{border-color:var(--gold);color:var(--gold)}
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
.cta.alt{background:transparent;color:var(--gold);border:1px solid var(--gold)}
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
/* [U5 2026-08-09] THE BAKED ANSWERS, AND WHY THE PAGE CARRIES THEM AT ALL.
   His writing lived in ONE place — this browser's localStorage — and a browser
   is not a place work lives. `answers.json` in the repo is the durable copy, and
   the generator writes it INTO the page so a cleared store, a new profile or a
   different machine still opens on his words.

   IT NEVER OVERWRITES THE STORE. A baked answer fills a box only when the store
   has nothing for that slot, and the row SAYS SO — the same honesty rule the
   CARRY mechanism carries, and for the same reason: a silent pre-fill is
   indistinguishable from something he typed there. */
function clientScript(slots, { key, banner, carry = null, preview = null, baked = null }) {
  return `<script>
(function(){
 "use strict";
 var SLOTS = ${JSON.stringify(slots)};
 var KEY = ${JSON.stringify(key)};
 var CARRY = ${JSON.stringify(carry)};
 var PV = ${JSON.stringify(preview)};
 var BAKED = ${JSON.stringify(baked || {})};
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
 var ovrEl = document.getElementById("ovr");
 function two(n){ return (n < 10 ? "0" : "") + n; }
 function clock(){ var d = new Date(); return two(d.getHours()) + ":" + two(d.getMinutes()); }

 /* ---- THE LIMITS -------------------------------------------------------
    MIKE, 2026-08-08: "he must never again discover a limit from a report."
    A slot that feeds a constrained field declares \`lim\` and this is the whole
    of the mechanism: count what he has typed, against the SAME number the gate
    will use (imported, never retyped), and say so while he is typing rather
    than three rounds later.

    IT COUNTS WHAT WOULD BE SAVED, NOT WHAT IS IN THE BOX. \`values()\` strips
    trailing whitespace before it stores anything, so counting the raw value
    would report a character the packet never sees and put a field one over its
    budget for pressing the space bar. The two must agree or the meter is
    lying in the safest-looking direction. */
 var LIM = {};
 SLOTS.forEach(function(s){ if (s.lim) LIM[s.id] = s.lim; });
 var over = {};

 function limit(id, raw){
  var lim = LIM[id]; if (!lim) return;
  var box = document.querySelector('[data-lim="' + id + '"]');
  var say = document.querySelector('[data-over="' + id + '"]');
  var t = byId[id];
  var v = String(raw == null ? "" : raw).replace(/\\s+$/,"");
  var bad = false, cnt = "", msg = "", cls = "lim";

  if (lim.max) {
   var n = v.length, past = n - lim.max;
   bad = past > 0;
   cnt = bad ? (past + " OVER") : String(n);
   if (bad) cls = "lim over";
   else if (n > lim.max - 15 && n > 0) cls = "lim near";
   if (bad) {
    msg = "<b>" + past + " character" + (past === 1 ? "" : "s") + " too many.</b> "
        + LIM_SAYS(lim) + " <i>" + LIM_GATE(lim) + "</i>";
   }
  } else if (lim.re) {
   if (v) {
    bad = !(new RegExp(lim.re)).test(v);
    cnt = bad ? "NOT A DATE" : "reads as a date";
    cls = bad ? "lim over" : "lim ok";
    if (bad) msg = "<b>That is not the format.</b> " + LIM_SAYS(lim) + " " + LIM_WHY(lim);
   } else { cnt = ""; }
  }

  if (box) { box.className = cls; box.querySelector(".cnt").textContent = cnt; }
  if (say) { say.innerHTML = msg; say.className = msg ? "limwarn on" : "limwarn"; }
  if (t) { t.className = (t.className.replace(/\\s*bad/, "")) + (bad ? " bad" : ""); }
  if (bad) over[id] = 1; else delete over[id];
 }
 function LIM_SAYS(l){ return l.says || ""; }
 function LIM_GATE(l){ return l.gate ? ("Caught by: " + l.gate + ".") : ""; }
 function LIM_WHY(l){ return l.why || ""; }

 function stat(saved){
  var n = Object.keys(values()).length;
  var msg = "<b>" + n + "</b> of " + SLOTS.length + " filled";
  if (!store) msg += " \\u00b7 <b>not saved</b> \\u2014 this browser refused storage";
  else if (saved) msg += " \\u00b7 saved " + clock();
  statEl.innerHTML = msg;
  /* THE OVER-COUNT IS IN THE FIXED BAR AND NOT ONLY BESIDE THE FIELD, because
     the field he broke is usually three screens above the one he is typing in
     by the time he stops. It is the same number, in the one place that is
     always on screen. */
  var k = Object.keys(over).length;
  if (ovrEl) {
   ovrEl.textContent = k ? (" \\u00b7 " + k + " over the limit") : "";
   ovrEl.className = k ? "ovr on" : "ovr";
  }
 }

 /* THIS PAGE OWNS ITS OWN SLOTS AND DESTROYS NOTHING ELSE IN ITS STORE, AND
    THAT IS A REAL LOSS PATH RATHER THAN TIDINESS. The round that moved the two
    week-headline slots off the worksheet would, with a plain overwrite, have
    silently deleted whatever had been typed into them the moment the page was
    next opened and blurred: \`values()\` only sees textareas that still exist,
    so a retired slot's answer vanishes at the first save. A generator may
    remove a field; it may not remove the answer that was in it. */
 var OWNED = {};
 SLOTS.forEach(function(s){ OWNED[s.id] = 1; });

 function save(){
  if (store) { try {
   var prev = read(), out = {}, k;
   for (k in prev) if (!OWNED[k]) out[k] = prev[k];
   var v = values();
   for (k in v) out[k] = v[k];
   store.setItem(KEY, JSON.stringify(out));
  } catch (e) {
   warn.className = "warn on"; store = null; } }
  stat(true);
 }

 function mirror(id){
  var m = document.querySelector('[data-mirror="' + id + '"]');
  if (m) m.textContent = byId[id] ? byId[id].value.replace(/\\s+$/,"") : "";
 }

 var saved = read();

 /* THE CARRY. When a slot moves between pages its answer does not move with
    it — two pages, two stores, and the reader would simply find an empty box
    where they had written something. So a page may declare that one of its
    slots INHERITS from a named slot in another page's store, and it fills
    only when its own is empty and it SAYS SO ON THE ROW. A silent pre-fill
    would be indistinguishable from something they had typed here. */
 if (store && CARRY) {
  var from = {};
  try { from = JSON.parse(store.getItem(CARRY.fromKey) || "{}"); } catch (e) { from = {}; }
  for (var mine in CARRY.map) {
   var theirs = CARRY.map[mine];
   if (!saved[mine] && from[theirs]) {
    saved[mine] = from[theirs];
    var flag = document.querySelector('[data-carried="' + mine + '"]');
    if (flag) { flag.textContent = CARRY.note; flag.className = "carried on"; }
   }
  }
 }

 /* [U5] the file fills only what the store does not have, and says so */
 var fromFile = 0;
 for (var bk in BAKED) if (!saved[bk] && String(BAKED[bk]).trim()) { saved[bk] = BAKED[bk]; fromFile++; }

 areas.forEach(function(t){
  var id = t.getAttribute("data-slot");
  if (saved[id]) t.value = saved[id];
  if (t.value) t.className = "has";
  grow(t); mirror(id); limit(id, t.value);
  t.addEventListener("input", function(){
   t.className = t.value.replace(/\\s+$/,"") ? "has" : "";
   /* limit() AFTER the className above, which overwrites it — the "bad" mark
      is a second class on the same element and the order is load-bearing. */
   grow(t); mirror(id); limit(id, t.value); stat(false);
   if (saveTimer) clearTimeout(saveTimer);
   saveTimer = setTimeout(save, 400);
  });
  t.addEventListener("blur", save);
 });
 stat(false);
 if (fromFile) {
  var fw = document.getElementById("warn");
  fw.className = "warn on file";
  fw.innerHTML = "<b>" + fromFile + " answer(s) were restored from "
   + "docs/dictation-20260807/answers.json</b>, not from this browser. That is the "
   + "durable copy Ops holds. Anything you type now is yours and is saved here as "
   + "usual — press <b>Save to the repo</b> when you are done and the file catches up.";
 }

 /* ---- THE COLLECTOR ----------------------------------------------------
    [U2/U3 2026-08-09] IT WALKS THE UNION OF THE PAGE AND THE STORE, AND IT
    REPORTS WHAT IT CANNOT PLACE. Mike: the copy button exports only 3 slots
    and stamps 2026-08-07 17:04 every time.

    THE OLD COLLECTOR WALKED THE GENERATED SLOTS ARRAY AND READ THE LIVE
    TEXTAREAS. Both come off the same generator, so they agree today -- and
    nothing anywhere PROVED they agree, which is the defect class he is
    describing. A slot retired from the array keeps its answer in the store
    (that is what OWNED protects) and would then be exported by nothing, in
    silence: the SAVE path was hardened for that case and the EXPORT path never
    was.

    So the values are the STORE MERGED WITH THE LIVE BOXES -- store first, so a
    retired slot's answer still travels; boxes second, so the last 400ms wins.
    Metadata comes from SLOTS by id, and an id in one and not the other is
    PRINTED rather than dropped. The generator also asserts at build time that
    SLOTS and the rendered textareas are the same set, so they cannot diverge.

    THE TIMESTAMP IS TAKEN HERE, AT THE PRESS. It always was; it is now proved
    by a test that fills every slot and reads the header back. */
 function everything(){
  var all = {}, k;
  /* THREE LAYERS, WEAKEST FIRST. The FILE is the durable copy and the weakest
     claim; the STORE is this browser; the BOXES are the last 400ms. Proved by
     the case that exposed the need for it: a slot no longer on the page, whose
     answer is in the file, has no box to be restored into — so if the file were
     not a layer here it would open correctly and export nothing. */
  for (k in BAKED) if (String(BAKED[k] == null ? '' : BAKED[k]).trim()) all[k] = BAKED[k];
  var stored = read();
  for (k in stored) if (String(stored[k] == null ? '' : stored[k]).trim()) all[k] = stored[k];
  var live = values();
  for (k in live) all[k] = live[k];
  return all;
 }

 function collect(){
  var v = everything(), lines = [], empty = [], n = 0;
  var d = new Date();
  var meta = {}; SLOTS.forEach(function(s){ meta[s.id] = s; });
  var extra = Object.keys(v).filter(function(id){ return !meta[id]; });

  lines.push(${JSON.stringify(banner)});
  SLOTS.forEach(function(s){ if (v[s.id]) n++; else empty.push(s.id); });
  lines.push('captured ' + d.getFullYear() + '-' + two(d.getMonth()+1) + '-' + two(d.getDate())
   + ' ' + clock() + '  -  ' + (n + extra.length) + ' answer(s): '
   + n + ' of ' + SLOTS.length + ' slots on this page'
   + (extra.length ? ', plus ' + extra.length + ' held in the store from a retired slot' : ''));
  lines.push("Ops' own paragraphs are not repeated here. Slot keys match the worksheet.");
  var nOver = Object.keys(over).length;
  if (nOver) lines.push('!! ' + nOver + ' answer(s) are over their limit and are marked below.');
  lines.push('');

  function block(id){
   var s = meta[id];
   lines.push('[' + id + '] ' + (s ? s.where : 'A RETIRED SLOT -- not on this page, answer kept'));
   if (over[id] && s && s.lim && s.lim.max) {
    lines.push('  !! OVER LIMIT: ' + v[id].length + ' characters, budget ' + s.lim.max);
   } else if (over[id] && s && s.lim) {
    lines.push('  !! WRONG FORMAT: expected ' + s.lim.says);
   }
   if (s && s.ops) lines.push('  ops: ' + s.ops);
   if (String(v[id]).indexOf('\\n') < 0) lines.push('  mike: ' + v[id]);
   else { lines.push('  mike:'); lines.push(v[id]); }
   lines.push('');
  }
  SLOTS.forEach(function(s){ if (v[s.id]) block(s.id); });
  extra.forEach(block);

  if (empty.length) {
   lines.push('LEFT EMPTY (' + empty.length + '): ' + empty.join(', '));
   lines.push('');
  }
  return lines.join('\\n');
 }

 var out = document.getElementById('out');
 var says = document.getElementById('says');
 function tell(msg){ says.textContent = msg; }

 /* ---- COPYING, AND WHY IT NO LONGER CLAIMS WHAT IT HAS NOT READ BACK ------
    [U2 2026-08-09] THE ONE UNVERIFIED LINK IN THE CHAIN WAS THE ONE THAT
    REPORTED SUCCESS. navigator.clipboard.writeText REJECTS with 'Document is
    not focused' -- measured in this browser, not supposed -- and the old
    fallback then called document.execCommand('copy'), whose return value says
    the command was ENABLED and not that the clipboard changed. So the page
    could print 'Copied -- 4,293 characters' while the clipboard still held
    whatever was last put there, and every paste after that is the same stale
    text with the same stale timestamp.

    IT READS THE CLIPBOARD BACK WHERE THE BROWSER ALLOWS IT, and where it does
    not it DOES NOT SAY COPIED -- it says the text is selected and to press
    Ctrl+C, which is true either way. The button that cannot be wrong is the
    one beside it: SAVE TO THE REPO. */
 function verify(text, how){
  if (!(navigator.clipboard && navigator.clipboard.readText)) {
   tell('Put on the clipboard ' + how + ' -- ' + text.length + ' characters. NOT VERIFIED: this '
      + 'browser will not let the page read the clipboard back. The text is selected below; if '
      + 'your paste looks old, press Ctrl+C. Better: use Save to the repo.');
   return;
  }
  navigator.clipboard.readText().then(function(back){
   if (back === text) tell('Copied and VERIFIED -- ' + text.length + ' characters are on the clipboard.');
   else tell('!! THE CLIPBOARD DID NOT TAKE IT. What is on the clipboard is not what this page '
           + 'just produced. The text is selected below -- press Ctrl+C -- or use Save to the repo.');
  }, function(){
   tell('Put on the clipboard ' + how + ' -- ' + text.length + ' characters. NOT VERIFIED: the '
      + 'browser refused to read it back. The text is selected below; press Ctrl+C to be sure.');
  });
 }

 function gather(){
  var text = collect();
  out.value = text;
  out.scrollTop = 0;
  out.focus(); out.select();
  if (navigator.clipboard && navigator.clipboard.writeText) {
   navigator.clipboard.writeText(text).then(function(){ verify(text, 'by the page'); },
                                           function(){ legacy(text); });
  } else { legacy(text); }
 }
 function legacy(text){
  out.focus(); out.select();
  try { document.execCommand('copy'); } catch (e) { /* the return value proves nothing */ }
  verify(text, 'by the fallback');
 }

 /* === [U4 2026-08-09] THE BRIDGE -- HIS WRITING GOES TO A FILE IN THE REPO ==
    MIKE: the worksheet writes to a file in the repo that Code can read
    directly, so Mike never has to copy and paste his own work to Ops again.

    showSaveFilePicker writes the real file and the handle is remembered in
    IndexedDB -- a dialog the FIRST time and one click every time after. Point
    it at docs/dictation-20260807/answers.json.

    IT WRITES JSON RATHER THAN THE PASTE TEXT, because the paste is for a human
    and this is for a program: tools/dictation/rescue-import.mjs reads it, and
    the next npm run dictation bakes it back into the page, so his words survive
    a cleared browser as well as a rebuild.

    IF THE PICKER IS UNAVAILABLE OR REFUSED IT DOWNLOADS THE SAME FILE and says
    where it went. A bridge that fails must fail into the old road, not into
    silence. */
 var DBN = 'wb.dictation', DBS = 'handles';
 function idb(){
  return new Promise(function(res, rej){
   var r = indexedDB.open(DBN, 1);
   r.onupgradeneeded = function(){ r.result.createObjectStore(DBS); };
   r.onsuccess = function(){ res(r.result); }; r.onerror = function(){ rej(r.error); };
  });
 }
 function handle(set){
  return idb().then(function(db){
   return new Promise(function(res, rej){
    var tx = db.transaction(DBS, set ? 'readwrite' : 'readonly');
    var os = tx.objectStore(DBS);
    var q = set ? os.put(set, KEY) : os.get(KEY);
    q.onsuccess = function(){ res(set ? set : q.result); }; q.onerror = function(){ rej(q.error); };
   });
  });
 }
 function payload(){
  return JSON.stringify({
   what: 'Mike-s worksheet answers. Written by the worksheet, read by '
       + 'tools/dictation/rescue-import.mjs. Ops does not hand-edit this file.',
   key: KEY, saved: new Date().toISOString(), answers: everything()
  }, null, 1);
 }
 function download(text, why){
  var b = new Blob([text], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = 'answers.json';
  document.body.appendChild(a); a.click(); a.remove();
  tell(why + ' Downloaded answers.json instead -- move it into docs/dictation-20260807/ and tell Ops.');
 }
 function saveToRepo(){
  var text = payload(), n = Object.keys(JSON.parse(text).answers).length;
  if (typeof window.showSaveFilePicker !== 'function') {
   download(text, 'This browser has no file picker.'); return;
  }
  handle(null).then(function(h){
   if (!h) return null;
   return h.queryPermission({ mode: 'readwrite' }).then(function(perm){
    if (perm === 'granted') return h;
    return h.requestPermission({ mode: 'readwrite' }).then(function(pp){ return pp === 'granted' ? h : null; });
   });
  }).then(function(h){
   if (h) return h;
   return window.showSaveFilePicker({
    suggestedName: 'answers.json',
    types: [{ description: 'Worksheet answers', accept: { 'application/json': ['.json'] } }]
   }).then(function(nh){ return handle(nh).then(function(){ return nh; }); });
  }).then(function(h){
   return h.createWritable().then(function(w){
    return w.write(text).then(function(){ return w.close(); });
   }).then(function(){
    tell('Saved ' + n + ' answer(s) to ' + h.name + ' -- ' + text.length
       + ' characters, at ' + clock() + '. Nothing to paste.');
   });
  }).catch(function(e){
   if (e && e.name === 'AbortError') { tell('Save cancelled. Nothing was written.'); return; }
   download(text, 'The file picker failed (' + (e && e.name) + ').');
  });
 }

 Array.prototype.slice.call(document.querySelectorAll('[data-gather]')).forEach(function(b){
  b.addEventListener('click', function(e){
   e.preventDefault();
   gather();
   if (b.getAttribute('data-gather') === 'jump') {
    document.getElementById('collector').scrollIntoView({ block: 'start' });
   }
  });
 });
 Array.prototype.slice.call(document.querySelectorAll('[data-save]')).forEach(function(b){
  b.addEventListener('click', function(e){ e.preventDefault(); saveToRepo(); });
 });

 /* ═══ [D4/D5 2026-08-08] THE LIVE PREVIEW ══════════════════════════════════
    MIKE: *"while he writes, he must see EXACTLY WHAT THE RECORD WILL LOOK LIKE
    ON THE PAGE, in real time."*

    THE FRAME DRAWS IT. Nothing in this function knows what a Record entry looks
    like — it assembles an ENTRY OBJECT out of the four boxes and posts it to an
    iframe that renders \`RecordIndexRow\` and \`RecordEntry\`, the museum's own
    components, against the museum's own stylesheets. Every question of type,
    scale, measure and wrapping is answered over there, by the same code the
    site runs. This half answers only: what entry is he writing?

    THE ONE JUDGEMENT IT MAKES IS SECTIONS, AND IT IS A CONVENTION HE CONTROLS
    RATHER THAN A GUESS. A line on its own in CAPITALS starts a section and is
    its label; everything under it is that section's paragraphs. It is how he
    dictated Record 001 — EXECUTIVE SUMMARY, then DETAILED REPORT — so it is the
    format he already writes in, and it is printed on the page above the boxes.
    Text before any capitals line becomes a section with no label, which
    \`RecordEntry\` renders as plain paragraphs. Nothing is invented and nothing
    is dropped.

    THE EDITOR UNDER THE FRAME IS A PROXY, NOT A SECOND FIELD. It writes THROUGH
    to the real textarea and fires its \`input\` event, so saving, the counters,
    the over-budget bar and the map mirrors all run down the one path they
    already ran down. A duplicate input with its own value is the "one question,
    two answers" defect that cost this instrument a round; there is exactly one
    place any answer lives. */
 if (PV) (function(){
  var pane = document.getElementById("pv");
  var frame = document.getElementById("pvframe");
  var who = document.getElementById("pvwho");
  var fail = document.getElementById("pvfail");
  var tabs = document.getElementById("pvtabs");
  var ta = document.getElementById("pvta");
  var prevB = document.getElementById("pvprev"), nextB = document.getElementById("pvnext");
  var cur = -1, field = PV.fields[0].k, ready = false, pending = null;

  function slotId(i, k){ return PV.days[i].id + "." + k; }

  /* CAPITALS ON THEIR OWN LINE START A SECTION. \`letters\` guards against a line
     of digits or punctuation ("16:10 - ...") being read as a heading — it must
     contain letters and all of them must already be upper case. */
  /* AND ONE LINE FORM ON TOP OF IT, FOR THE ATTACHMENTS. [A1 2026-08-08]
     Mike ruled that payloads sit at the foot of an entry, below the writing, and
     the preview renders the real component - so it can show them the moment the
     entry object has any. It cannot invent one. \`ATTACH: <name>\` on its own line
     says he wants something attached there, and it becomes a document with no
     scan, which is \`docState\`'s HELD: a glyph, the name, and "not here yet".
     THAT IS THE TRUTH UNTIL OPS SUPPLIES THE FILE, and it is what the finished
     entry will show until then too. Nothing is faked to fill the row. */
  function chunk(text, out, att){
   String(text == null ? "" : text).split(/\\n+/).forEach(function(raw){
    var t = raw.trim(); if (!t) return;
    var m = /^ATTACH\\s*:\\s*(.+)$/i.exec(t);
    if (m) { att.push({ title: m[1].trim() }); return; }
    var letters = t.replace(/[^A-Za-z]/g, "");
    if (letters && t === t.toUpperCase() && t.length <= 62) { out.push({ label: t, body: [] }); return; }
    if (!out.length) out.push({ body: [] });
    out[out.length - 1].body.push(t);
   });
   return out;
  }

  function entryOf(i){
   var d = PV.days[i], v = values(), att = [];
   var sections = chunk(v[slotId(i,"EXEC")], [], att);
   chunk(v[slotId(i,"NOTES")], sections, att);
   var e = { title: v[slotId(i,"HEAD")] || "", sections: sections };
   if (v[slotId(i,"LINE")]) e.line = v[slotId(i,"LINE")];
   if (d.date) e.date = d.date;
   if (att.length) e.docs = att;
   return e;
  }

  function push(){
   if (cur < 0) return;
   var msg = { kind: "wb-preview", entry: entryOf(cur), epoch: PV.epoch };
   if (!ready) { pending = msg; return; }
   frame.contentWindow.postMessage(msg, "*");
  }

  window.addEventListener("message", function(ev){
   if (!ev.data || ev.data.kind !== "wb-preview-ready") return;
   ready = true;
   if (fail) fail.className = "pvfail";
   if (pending) { frame.contentWindow.postMessage(pending, "*"); pending = null; }
  });

  /* A FRAME THAT NEVER ANSWERS SAYS SO. A blank preview reads as "nothing
     written yet", which is the one thing it must never be mistaken for. */
  setTimeout(function(){
   if (!ready && fail) fail.className = "pvfail on";
  }, 4000);

  function drawTabs(){
   tabs.innerHTML = "";
   PV.fields.forEach(function(f){
    var b = document.createElement("button");
    b.type = "button"; b.textContent = f.label;
    b.setAttribute("aria-pressed", f.k === field ? "true" : "false");
    b.addEventListener("click", function(){ field = f.k; drawTabs(); loadField(); ta.focus(); });
    tabs.appendChild(b);
   });
  }

  /* mirror the real field's own meter into the proxy's, rather than compute a
     second one — two counters that could disagree is two budgets again. */
  function syncMeter(id){
   var a = document.querySelector('[data-lim="' + id + '"]');
   var b = document.querySelector('[data-lim="__pv"]');
   var aw = document.querySelector('[data-over="' + id + '"]');
   var bw = document.querySelector('[data-over="__pv"]');
   if (b) { b.className = a ? a.className : "lim";
            b.innerHTML = a ? a.innerHTML : ""; }
   if (bw) { bw.className = aw ? aw.className : "limwarn";
             bw.innerHTML = aw ? aw.innerHTML : ""; }
   ta.className = (byId[id] && /\\bbad\\b/.test(byId[id].className)) ? "bad" : "";
  }

  function loadField(){
   var id = slotId(cur, field), real = byId[id];
   ta.value = real ? real.value : "";
   ta.placeholder = real ? (real.getAttribute("placeholder") || "") : "";
   syncMeter(id);
  }

  function open(i){
   cur = i;
   who.textContent = PV.days[i].where;
   prevB.disabled = i === 0; nextB.disabled = i === PV.days.length - 1;
   pane.className = "pv on";
   document.body.className = "previewing";
   drawTabs(); loadField(); push();
  }
  function close(){
   pane.className = "pv"; document.body.className = "";
   var real = byId[slotId(cur, field)];
   cur = -1;
   if (real) real.focus();
  }

  ta.addEventListener("input", function(){
   var id = slotId(cur, field), real = byId[id];
   if (!real) return;
   real.value = ta.value;
   real.dispatchEvent(new Event("input", { bubbles: true }));
   syncMeter(id);
   push();
  });

  /* and typing in the PAGE's own field updates the frame too, so the two are
     never out of step whichever one he is using. */
  areas.forEach(function(t){
   t.addEventListener("input", function(){ if (cur >= 0) push(); });
  });

  prevB.addEventListener("click", function(){ if (cur > 0) open(cur - 1); });
  nextB.addEventListener("click", function(){ if (cur < PV.days.length - 1) open(cur + 1); });
  document.getElementById("pvx").addEventListener("click", close);
  document.addEventListener("keydown", function(e){
   if (e.key === "Escape" && cur >= 0) { e.preventDefault(); close(); }
  });

  Array.prototype.slice.call(document.querySelectorAll("[data-pv]")).forEach(function(b){
   b.addEventListener("click", function(){
    var id = b.getAttribute("data-pv");
    for (var i = 0; i < PV.days.length; i++) if (PV.days[i].id === id) { open(i); return; }
   });
  });
 })();
})();
</script>`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   W1–W7 — THE WORKSHEET
   ═══════════════════════════════════════════════════════════════════════════ */
/* THE OVERLAY. Bar, frame, editor — in that order, because the frame is the
   thing and the two strips are furniture around it. */
const PREVIEW_PANE = `<div class="pv" id="pv">
 <div class="pvbar">
  <span class="pvwho" id="pvwho"></span>
  <span class="pvnote">The index row, then the opened entry. Esc closes.</span>
  <button type="button" id="pvprev">&lsaquo; Day</button>
  <button type="button" id="pvnext">Day &rsaquo;</button>
  <button type="button" id="pvx">Close &#10005;</button>
 </div>
 <p class="pvfail" id="pvfail"><b>The preview frame did not load.</b> It needs
  <code>_preview/frame.html</code>, <code>_preview/preview.js</code> and
  <code>_preview/preview.css</code> beside this page &mdash; run <code>npm run dictation</code>.
  <b>Nothing you have typed is affected.</b></p>
 <iframe class="pvframe" id="pvframe" src="_preview/frame.html"
         title="the Record entry as it will draw"></iframe>
 <div class="pvedit">
  <div class="pvtabs" id="pvtabs"></div>
  <textarea id="pvta" spellcheck="true"></textarea>
  <div class="lim" data-lim="__pv"></div>
  <p class="limwarn" data-over="__pv"></p>
 </div>
</div>`;

/* [U5 2026-08-09] THE DURABLE COPY OF HIS ANSWERS, IF THERE IS ONE.
   Written by the worksheet's SAVE TO THE REPO button, or by
   `node tools/dictation/rescue-import.mjs`. Absent is the normal state and is
   not an error — the page simply has nothing to fall back on. It is READ ONLY
   here: this generator never writes it, so a rebuild cannot damage it. */
function readAnswers() {
  const f = path.join(OUT_DIR, "answers.json");
  try {
    const j = JSON.parse(fs.readFileSync(f, "utf8"));
    const a = j.answers && typeof j.answers === "object" ? j.answers : {};
    const n = Object.keys(a).length;
    if (n) console.log(`  baked ${n} answer(s) from ${path.relative(REPO_DIR, f)} into the worksheet`);
    return a;
  } catch { return {}; }
}

/* [U3 2026-08-09] THE EXPORT AND THE PAGE ARE THE SAME SET, PROVED AT BUILD.
   Mike's report was an export of three slots from a page showing far more. The
   two lists come off one generator and agreed even then — but nothing checked,
   and "they happen to agree" is not a property, it is a coincidence that ends
   the first time a round retires a field. This reads the rendered HTML back and
   REFUSES to write a page whose textareas and whose SLOTS array are not the
   same set, in both directions, with duplicates caught too. */
function assertSlotsMatchPage(html, slots, who) {
  const rendered = [...html.matchAll(/data-slot="([^"]+)"/g)].map(m => m[1]);
  const declared = slots.map(s => s.id);
  const missing = declared.filter(id => !rendered.includes(id));
  const extra = rendered.filter(id => !declared.includes(id));
  const dupes = rendered.filter((id, i) => rendered.indexOf(id) !== i);
  const nl = String.fromCharCode(10);
  if (missing.length || extra.length || dupes.length) {
    throw new Error(
      who + ": the export list and the rendered page disagree, so the copy "
      + "button would export a different set from the one he is looking at." + nl
      + (missing.length ? "  declared but not rendered: " + missing.join(", ") + nl : "")
      + (extra.length ? "  rendered but not declared: " + extra.join(", ") + nl : "")
      + (dupes.length ? "  rendered twice: " + dupes.join(", ") + nl : ""));
  }
  return rendered.length;
}

export function buildWorksheet() {
  const slots = slotList();
  const dateFaults = checkOutlineDates();
  if (dateFaults.length) {
    throw new Error("the outline's weekdays and the Record's epoch disagree:\n  "
      + dateFaults.join("\n  ")
      + "\nEvery day headline is written for a named weekday. Fix the epoch or the "
      + "outline before this page tells Mike a Friday is a Wednesday.");
  }
  const previewDays = [];
  for (const { w, days, id } of WEEKS) {
    for (const d of days) {
      const dt = dayDate(w.n, d.n);
      previewDays.push({
        id: `${id}.D${d.n}`,
        where: `Week ${w.n} · Day ${d.n} · ${d.dow}${dt ? " · " + dt.iso : ""}`,
        date: dt ? dt.iso : null,
      });
    }
  }

  const mapRow = (id, w, d) => `<div class="mr">
  <span class="d">Day ${d.n} &middot; ${esc(d.dow)}</span>
  <span class="o">${esc(d.headline)}<a class="j" href="#${id}-D${d.n}" title="go to the block">&darr;</a></span>
  <span class="m" data-mirror="${id}.D${d.n}.HEAD"></span>
</div>`;

  const body = `<div class="wrap">

<div class="mast">
<h1>The worksheet</h1>
<p class="lead"><b>Ops on the left, you on the right, and it saves as you type.</b>
Ten days &mdash; start at the top and go as far as you want. <b>Copy everything</b> is
in the bar at the bottom. <a href="reference.html">How any of this works &rarr;</a></p>
</div>

<div class="warn" id="warn"><b>This browser will not let the page save.</b> Nothing you
type here will survive a reload. Press <b>copy everything</b> and paste it somewhere
safe before you close the tab.</div>

<h2>Day one&rsquo;s date</h2>
<div class="day"><div class="hd"><span class="n">Record &middot; day one</span></div>
<div class="bd">
<div class="fld"><div class="fh">The calendar date</div>
<p class="fnote"><b>It has an exact format and nothing complains when it is wrong.</b>
${esc(FORMATS.date.says)} &mdash; anything else parses to nothing at all, and the entry
still renders: it just quietly has no dateline, no week number and no month band. That
silence is why this box checks the shape while you type.</p>
${pair("REC.EPOCH",
  `<p class="none">No Ops draft, and there cannot be one &mdash; a date is a fact and
   Ops does not supply one. Record 001&rsquo;s own text has &ldquo;Monday morning&rdquo;
   and &ldquo;FRIDAY DAY (-3)&rdquo;, which orders the report and does not date it.</p>`,
  { rows: 1, ph: "2026-08-10", lim: EPOCH_SLOT.lim })}
</div>
</div></div>

<h2>The map &mdash; every day, both weeks</h2>
<p class="lead" style="margin-bottom:14px">Fills itself in from the blocks below. The
arrow jumps to one.</p>
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
<p style="margin:0 0 12px"><button class="cta" data-save="here">Save to the repo</button>
<button class="cta alt" data-gather="here">Copy everything</button>
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
 <span class="st"><span id="stat"></span><span class="ovr" id="ovr"></span></span>
 <span>
  <a href="arc.html" style="font-size:11.5px;color:var(--dim2);margin-right:14px">the twelve weeks &rarr;</a>
  <a href="reference.html" style="font-size:11.5px;color:var(--dim2);margin-right:14px">reference &rarr;</a>
  <button data-save="jump">Save to the repo</button>
  <button data-gather="jump">Copy everything</button>
 </span>
</div>
${PREVIEW_PANE}
${clientScript(slots, {
    key: `wb.worksheet.${STAMP}`,
    banner: "WEIRD.BABY MUSEUM - DICTATION WORKSHEET - MIKE'S RESPONSES",
    baked: readAnswers(),
    preview: {
      epoch: EPOCH,
      days: previewDays,
      fields: FIELDS.map(f => ({ k: f.k, label: f.label })),
    },
  })}`;

  const html = page({
    title: `THE WORKSHEET — WEEKS ONE AND TWO — ${STAMP}`,
    css: OPS_CSS + SHEET_CSS,
    body,
  });
  assertSlotsMatchPage(html, slots, "the worksheet");
  return html;
}

/* ═══════════════════════════════════════════════════════════════════════════
   T1 — THE TWELVE-WEEK HEADLINE TABLE
   ---------------------------------------------------------------------------
   MIKE: *"one browser page, the same worksheet form and the same collector, but
   ONLY the weekly headlines — twelve rows, left Ops / right Mike."*

   THE SAME FORM AND THE SAME COLLECTOR IS LITERAL, NOT A RESEMBLANCE. This
   builds from `pair()`, `SHEET_CSS` and `clientScript()` — the same three
   declarations the worksheet uses, in the same file, so a fix to the form
   lands on both pages and cannot land on one. The only two things that differ
   are the `localStorage` key and the export's banner line, which is why those
   became parameters this round rather than a second copy of the script.

   ONE INPUT PER ROW AND NOTHING ELSE. He asked for the headlines only; the
   Law of Subtraction agrees, and twelve rows on one screen is the whole point
   of a page that exists to be worked all at once. The executive summary and
   the notes field stay on the day blocks, where there is something to write
   them about.
   ═══════════════════════════════════════════════════════════════════════════ */
const bandTag = w => {
  const b = BANDS[w.band];
  const cls = w.band === "DICTATED" ? "y" : w.invented ? "n" : "";
  return `<span class="tag ${cls}">${esc(b.label)}</span>${w.invented
    ? ` <span class="tag n">${esc(BANDS.INVENTED.label)}</span>` : ""}`;
};

/* THE RAIL IS THE COLUMN'S OWN LABEL HERE, AND THAT IS A CORRECTION THE LAP
   FOUND RATHER THAN A STYLE CHOICE. The first cut printed the shared `Ops`
   column label above the headline AND a rail tag beside the band — which read
   as "OPS" twice on eleven rows, and, worse, put the word OPS at the head of
   the one column that on week 2 contains MIKE'S OWN SENTENCE. One mark, in the
   place the reader already looks, and it cannot mislabel the row it sits on. */
const railLabel = w => w.rail === "VERBATIM"
  ? `<span class="ml g">your words</span>`
  : `<span class="ml">Ops</span>`;

export function buildArc() {
  /* [I2 2026-08-08] NO `lim` ON ANY OF THE TWELVE, AND IT IS A FINDING RATHER
     THAN AN OMISSION. The audit that put counters on the worksheet asked the
     same question here: a week headline is a heading on THESE pages and on no
     other. `reveal/arc-twelve.mjs` is imported by this file and by nothing in
     `src/` — checked, not assumed — so none of these twelve is ever a `title`,
     a `line` or any other field the museum measures. The page says so once, in
     one sentence, because an absent counter has to read as "nothing to fit"
     rather than as the defect this round was called to fix. */
  const slots = ARC.map(w => ({
    id: `ARC.W${w.n}`,
    where: `WEEK ${w.n} — the week's headline (month ${monthOf(w.n).n}, ${BANDS[w.band].label})`,
    ops: w.headline,
    lim: null,
  }));
  const budget = preciousBudget();

  const row = w => `<div class="arow" id="ARC-W${w.n}">
<div class="an"><b>Week ${w.n}</b><div class="k">Month ${monthOf(w.n).n}</div></div>
<div class="c ops">${railLabel(w)}
  <p class="hl">${esc(w.headline)}</p>
  <p class="bnd">${bandTag(w)}</p>
  <p class="carried" data-carried="ARC.W${w.n}"></p>
  ${w.from ? `<p class="k" style="font-size:11.5px;margin:5px 0 0">Carried from <code>${esc(w.from)}</code>${
    w.days ? ` &middot; ${w.days} days outlined &mdash; <a href="worksheet.html#W${w.n}-D1">write them &rarr;</a>` : ""}</p>` : ""}
  ${w.note ? `<p class="k" style="font-size:11.5px;margin:5px 0 0">${esc(w.note)}</p>` : ""}
</div>
<div class="c yours"><span class="ml y">yours</span><textarea data-slot="ARC.W${w.n}" rows="2"
  placeholder="your headline for week ${w.n}" spellcheck="true"></textarea></div>
</div>`;

  const monthBlock = m => `<h2>Month ${m.n} &mdash; ${esc(m.name)} <span class="k"
 style="text-transform:none;letter-spacing:0;font-size:12px">weeks ${m.weeks[0]}&ndash;${m.weeks[1]}</span></h2>
${ARC.filter(w => monthOf(w.n).n === m.n).map(row).join("\n")}`;

  const checkRow = c => `<div class="day"><div class="hd">
  <span class="n">${esc(c.id)} &middot; ${c.open ? "UNRESOLVED" : "agrees"}</span>
  <span class="slot" style="color:${c.open ? "var(--red)" : "var(--grn)"};font-size:15px;font-style:normal">${esc(c.title)}</span>
</div><div class="bd">
  <div class="scaf"><span class="lbl">the check <span class="rail">Ops</span></span>
    <p style="margin:0 0 6px">${esc(c.check)}</p>
    <p class="k" style="margin:0;font-size:12px">Settled by <code>${esc(c.derivedFrom)}</code></p></div>
${c.open ? `  <div class="mine"><span class="lbl">yours &middot; the decision</span>
    <p style="margin:0 0 6px">${esc(c.open)}</p></div>` : ""}
${c.also ? `  <p class="k" style="margin:0;font-size:12.5px">${esc(c.also)}</p>` : ""}
</div></div>`;

  const body = `<div class="wrap">

<div class="mast">
<h1>The twelve weeks</h1>
<p class="lead"><b>Ops&rsquo; headline on the left, yours on the right, and it saves as you
type. None of the twelve has a length limit</b> &mdash; a week headline is a heading on
these pages and never becomes a field in the museum.
<a href="worksheet.html">the ten days &rarr;</a> &middot;
<a href="reference.html">how any of this works &rarr;</a></p>
</div>

<div class="warn" id="warn"><b>This browser will not let the page save.</b> Nothing you
type here will survive a reload. Press <b>copy everything</b> and paste it somewhere
safe before you close the tab.</div>

<p class="k" style="font-size:12px;margin:0 0 18px">
<span class="tag y">${esc(BANDS.DICTATED.label)}</span> ${esc(BANDS.DICTATED.means)} &nbsp;&middot;&nbsp;
<span class="tag">${esc(BANDS.SCAFFOLD.label)}</span> ${esc(BANDS.SCAFFOLD.means)} &nbsp;&middot;&nbsp;
<span class="tag n">${esc(BANDS.INVENTED.label)}</span> ${esc(BANDS.INVENTED.means)}</p>

${MONTHS.map(monthBlock).join("\n")}

<h2>What the twelve were checked against</h2>
<p class="lead" style="margin-bottom:14px">Six claims about this repository, each
settled by a named file. <b>${ARC_CHECKS.filter(c => c.open).length} are unresolved and
they are yours</b>; the rest agree and are printed because an agreement nobody writes
down gets argued again. <b>Nothing here was resolved by Ops</b> &mdash; resolving one is
authoring.</p>
${ARC_CHECKS.map(checkRow).join("\n")}

<div class="note">
<p><b>AND ONE NUMBER THE TWELVE-WEEK VIEW CAN PRODUCE THAT NO SHORTER ONE COULD.</b>
The precious bucket&rsquo;s ceiling is two or three a ${esc(budget.per)}. Over
${budget.weeks} weeks that is <b>${budget.min} to ${budget.max} genuine reveals in the
whole arc</b> &mdash; the total the story has to spend.</p>
<p class="k" style="font-size:12.5px"><b>This is not the voided arithmetic.</b> It
multiplies a <i>ceiling</i> by a <i>period</i> and never touches an asset count. The
figure Mike voided divided a count of photographs by a ceiling on attention. And
nothing is priced against this one yet: <code>bucket</code> is unset on all 315 rows of
the asset table.</p>
</div>

<h2 id="collector">Everything you have written</h2>
<p class="lead" style="margin-bottom:14px">One press gathers all twelve into plain text
and puts it on the clipboard. <b>This page has its own store</b> &mdash; it does not
gather the worksheet&rsquo;s days, and the worksheet does not gather these. If the
clipboard is refused, the text is selected below and Ctrl+C takes it.</p>
<p style="margin:0 0 12px"><button class="cta" data-gather="here">Copy everything</button>
<span id="says" class="k" style="margin-left:12px;font-size:12.5px"></span></p>
<textarea id="out" readonly spellcheck="false"
 placeholder="press copy everything and your twelve headlines appear here"></textarea>

<footer>Ops&rsquo; half of this page is built from <code>reveal/arc-twelve.mjs</code>,
which imports weeks one and two from <code>reveal/week-one.mjs</code> and
<code>reveal/week-two.mjs</code> rather than restating them. Regenerated with
<code>npm run dictation</code> &mdash; <b>which will not touch anything you have
typed</b>. Ops&#8209;to&#8209;Mike, ${STAMP}; not part of the museum.</footer>
</div>

<div class="cbar">
 <span class="st"><span id="stat"></span><span class="ovr" id="ovr"></span></span>
 <span>
  <a href="worksheet.html" style="font-size:11.5px;color:var(--dim2);margin-right:14px">the ten days &rarr;</a>
  <a href="reference.html" style="font-size:11.5px;color:var(--dim2);margin-right:14px">reference &rarr;</a>
  <button data-gather="jump">Copy everything</button>
 </span>
</div>
${clientScript(slots, {
    key: `wb.arc12.${STAMP}`,
    banner: "WEIRD.BABY MUSEUM - THE TWELVE WEEKS - MIKE'S HEADLINES",
    /* WEEKS ONE AND TWO WERE ASKED FOR ON THE WORKSHEET UNTIL TODAY. If
       anything was typed into those two slots before they moved here, it is
       still in the worksheet's store, and this is the only thing that would
       ever go and look. It fills only an empty box and it marks the row. */
    carry: {
      fromKey: `wb.worksheet.${STAMP}`,
      map: { "ARC.W1": "W1.SUM", "ARC.W2": "W2.SUM" },
      note: "Carried over from what you had already typed on the worksheet, "
        + "where this question used to be asked. Edit it freely — it lives here now.",
    },
  })}`;

  return page({
    title: `THE TWELVE WEEKS — ${STAMP}`,
    css: OPS_CSS + SHEET_CSS + ARC_CSS,
    body,
  });
}

/* The three-column row. Same two-column pair as the worksheet with a week
   stub in front of it, and it collapses to one column at the same width the
   worksheet's pairs do — a twelve-row table is the one shape on these pages
   that a phone can actually hold, and it must not be the one that scrolls. */
const ARC_CSS = `
.arow{display:grid;grid-template-columns:8ch 1fr 1fr;gap:0 20px;align-items:start;
 padding:13px 0;border-bottom:1px solid var(--line2)}
.arow:last-child{border-bottom:0}
.an{font-size:13px}
.an b{color:var(--fg)}
.an .k{font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin-top:2px}
.arow .c .hl{font-size:16px;color:var(--fg);margin:0}
.bnd{margin:6px 0 0!important;font-size:11px}
.note .tag{margin-right:4px}
.gld{color:var(--gold)}
.carried{display:none}
.carried.on{display:block;margin:6px 0 0!important;font-size:11.5px;color:var(--amb);
 border-left:3px solid var(--amb);padding-left:9px}
@media (max-width:900px){
 .arow{grid-template-columns:1fr;gap:8px 0}
 .an{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim2)}
 .an .k{display:inline;margin-left:6px}
}
`;

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
<tr><td><b>All twelve</b><div class="k">the arc&rsquo;s week headlines</div></td>
    <td>In writing, ${esc(ARC_ORIGIN.writtenOn)}.</td>
    <td>${esc(ARC_ORIGIN.rule)} <b>${esc(ARC_ORIGIN.bandRule)}</b></td></tr>
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

<h2 id="entry-shape">Everything a Record entry is checked against &mdash; ${CONSTRAINTS.length} constraints</h2>
<div class="note" style="margin-bottom:14px">
<p><b>THIS LIST EXISTS BECAUSE ONE OF ITS ROWS COST THREE ROUNDS.</b> The index row holds
${BUDGETS.line.max} characters; the worksheet did not say so and did not even ask for the
field, so Record 001&rsquo;s executive summary was written at 477 characters and the row is
still empty. Your ruling was that the instrument must warn, and that <b>every other slot
be audited for the same defect</b>. This is the audit, whole, whether or not the
worksheet asks for the field.</p>
<p><b>The column that matters is the last one.</b> A constraint marked
<span class="tag n">SILENT</span> produces <i>no error anywhere</i> when it is broken
&mdash; the entry renders and quietly loses something. Those are the expensive ones, and
${CONSTRAINTS.filter(c => c.silent).length} of the ${CONSTRAINTS.length} are like that.
The rest are caught by a named gate before anything ships.</p>
<p class="k" style="font-size:12.5px">Declared once in <code>reveal/record-shape.mjs</code>
and read by three things: the gate that enforces the two budgets, the worksheet&rsquo;s
counters, and this table. Nothing here retypes a number.</p>
</div>
<div class="tw"><table>
<thead><tr><th style="width:13%">field</th><th style="width:47%">what it has to obey</th>
<th style="width:22%">what catches it</th><th>asked for on the worksheet</th></tr></thead>
<tbody>
${CONSTRAINTS.map(c => `<tr>
  <td><code>${esc(c.field)}</code>${c.silent ? ` <span class="tag n">SILENT</span>` : ""}</td>
  <td>${esc(c.rule)}</td>
  <td class="k" style="font-size:12.5px">${esc(c.enforcedBy)}</td>
  <td class="k" style="font-size:12.5px">${esc(c.asked)}</td></tr>`).join("\n")}
</tbody></table></div>
<p class="k" style="font-size:12.5px;margin-top:10px"><b>Two numbers and one format, and
where they come from.</b> ${esc(BUDGETS.title.name)} &mdash; <b>${BUDGETS.title.max}</b>,
${esc(BUDGETS.title.holds)}. ${esc(BUDGETS.line.name)} &mdash; <b>${BUDGETS.line.max}</b>,
${esc(BUDGETS.line.holds)}. Both were measured off the built index row rather than chosen,
and both are floors on the layout: if the type ramp or the row height ever changes, they
move in the same commit. The date is <b>${esc(FORMATS.date.says)}</b>, and it is the one
of the three that nothing checks &mdash; ${esc(FORMATS.date.why)}</p>

<h2>The bouncy ball law, and the two runways</h2>
${runwayBlock(artifacts.runways, "the " + artifacts.waiting + " pictures an entry can reach for today")}

<h2 id="collisions">Where the DAY outlines meet the tree &mdash; ${ALL_COLL.length} checks</h2>
<div class="note" style="margin-bottom:14px"><p>Each of these is a claim an outline
makes, run against what the repository actually holds. <b>${nOpen} of the
${ALL_COLL.length} is unresolved</b> and is drawn in red; <b>${nRuled} you have already
ruled on</b>, and those carry your ruling in gold. The rest are agreements &mdash; and
three of them are worth knowing about, because nobody arranged them.</p>
<p><b>THESE ${ALL_COLL.length} ARE THE DAY OUTLINES ONLY &mdash; WEEKS ONE AND TWO.</b>
The twelve-week arc has ${ARC_CHECKS.length} checks of its own, one of them unresolved,
and they are printed on <a href="arc.html#collector">the twelve-week table</a> rather
than copied here. Two pages, two populations; neither is a subset of the other.</p>
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
