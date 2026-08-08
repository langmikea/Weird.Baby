#!/usr/bin/env node
/* ===========================================================================
   THE DICTATION PREP — the documents Mike reads and writes in while he talks.
   [K2–K6 2026-08-07 · W1–W8 2026-08-07]
   ---------------------------------------------------------------------------
   MIKE is about to dictate the Record's first two weeks. This builds what he
   uses while doing it: the worksheet he writes in, the reference page behind
   it, the in-story spec source (K2), the artifact tracker (K3) and the egg
   tracker (K4), under one index (K6).

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

   ═══ [W1–W8 2026-08-07] THE CUE CARD IS A WORKSHEET NOW, AND THE PAGE IT
       REPLACES IS THE ARGUMENT FOR THE SPLIT ═════════════════════════════════
   `week1.html` was a good document and a bad instrument. It explained the rail
   scheme, the provenance model, the transfer classes, the bouncy ball law and
   five collisions BEFORE it showed a single headline, and then it had nowhere
   for Mike to write. Mike's ruling: *"If it is reference, write it as such. If
   it is the firehose I have to drink from to do anything, thanks, pass."*

   So it is two files, both in `./worksheet.mjs`:

     worksheet.html   THE INSTRUMENT — Ops on the left, an input on the right,
                      in his reading order, saving as he types, gathering into
                      plain text on one button.
     reference.html   EVERYTHING THAT EXPLAINS THE MACHINE — linked, never
                      inline, and carrying the day outlines' ten collision
                      checks. The twelve-week arc's six live on `arc.html`.

   `week1.html` is PRUNED by name at the bottom of this file rather than left
   orphaned, and this index lost its own briefing for the same reason the
   worksheet lost its preamble.

   ═══ [B1/B2 2026-08-07] TWO RULINGS, AND ONE OF THEM VOIDED A NUMBER THIS
       FILE WAS PRINTING ═══════════════════════════════════════════════════════
   B1 — THE BOUNCY BALL LAW CAPS POINTS OF FOCUS, NOT ASSETS. This file was
   dividing a count of PHOTOGRAPHS by that ceiling and printing "16 pictures =
   6–8 days of material". Every input was a real measurement and the arithmetic
   was sound; the UNIT was wrong, which is why nothing caught it. The law, the
   two buckets and the two runways are `reveal/focus.mjs`; `runwayBlock()` in
   `./shell.mjs` only draws them, and it will not print a runway for the DUMP
   bucket however symmetrical that would look — a bucket with no ceiling divides
   into nothing. The bucket is a JUDGED field on the asset table beside
   `verdict`, it is unset on all 315 rows, and Ops does not derive it: a
   heuristic there would make these pages look answered while nothing had been
   answered.

   B2 — RECORD 013 IS THE PROTOTYPE. Not day one, no re-dating, no defending;
   the real Record starts at 001 when Mike dictates it. These pages say so.
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
import { ORIGIN as FOCUS_ORIGIN, runways, bucketOf } from "../../reveal/focus.mjs";
import { STAMP, esc, rich, runwayBlock, OPS_CSS, TYPED_CSS, page, BACK } from "./shell.mjs";
import { buildWorksheet, buildReference, buildArc } from "./worksheet.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const argv = process.argv.slice(2);
const optOf = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 ? argv[i + 1] : d; };
const OUT = path.resolve(REPO, optOf("out", "docs/dictation-20260807"));

const LEDGER = JSON.parse(fs.readFileSync(path.join(REPO, "reveal/ledger.json"), "utf8"));
const TABLE = JSON.parse(fs.readFileSync(path.join(REPO, "provenance/asset-table.json"), "utf8"));

/* [B2 2026-08-07] the day Mike ruled on the two collisions this page carries */
const W1_RULED_ON = FOCUS_ORIGIN.correctedOn;

/* THE SHARED SHELL — `esc`, `rich`, `runwayBlock`, `OPS_CSS`, `TYPED_CSS`,
   `page` and `BACK` were MOVED to ./shell.mjs, unchanged, when the worksheet
   became a second generator file that needs all seven. The move was proved by
   regenerating the three unchanged pages and diffing them byte for byte. */

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
   K6 — THE INDEX
   [W1–W8 2026-08-07] IT IS A DOOR NOW AND NOT A BRIEFING. Everything it used
   to explain — the rail scheme, the two rulings, what changed in the tree — is
   on `reference.html`, for the same reason the worksheet lost its preamble:
   a page that spends attention describing the machine spends it before the
   machine gets used. What is left is one paragraph and five doors, with the
   one Mike opens first at the top and twice the size of the others.
   ═══════════════════════════════════════════════════════════════════════════ */
function buildIndex(a, e) {
  const body = `<div class="wrap">
<h1>The dictation prep</h1>
<p class="sub">Weird.Baby Museum &middot; ${STAMP} &middot; Ops&#8209;to&#8209;Mike, and not part of the museum</p>

<div class="note">
<p><b>You are about to dictate the Record. Start with the twelve weeks, then the
ten days.</b> Everything else here answers a question you may not have yet.
<b>Nothing on any of these pages was invented</b> &mdash; every figure, file, egg
and conflict is carried from one of the two repositories with its source named,
and every gap is printed as a gap.</p>
</div>

<div class="cards" style="grid-template-columns:1fr;margin-bottom:14px">
<div class="card" style="border-color:#6b5426">
  <h4 style="font-size:17px"><a href="arc.html">The twelve weeks &rarr;</a></h4>
  <p class="id">the whole arc on one screen &mdash; start here</p>
  <p>Twelve rows and one input each: <b>the headline of every week</b>, Ops on the
  left and you on the right. Each row is marked twice &mdash; <b>whose sentence it
  is</b>, and <b>whether there is anything of yours under it</b>. Weeks 1&ndash;3
  derive from your own dictation; 4&ndash;12 are Ops scaffolding, and month 3 is
  invented structure waiting for your story.</p>
  <p class="meta">Six checks against the tree are printed under the table, one of
  them unresolved: <b>the headlines answer a question the transfer model says is
  not in the arc</b> &mdash; which of the five package weeks goes empty.</p>
</div>
</div>

<div class="cards" style="grid-template-columns:1fr;margin-bottom:14px">
<div class="card" style="border-color:#6b5426">
  <h4 style="font-size:17px"><a href="worksheet.html">The worksheet &rarr;</a></h4>
  <p class="id">the ten days of weeks one and two</p>
  <p>Ten day blocks, three fields each &mdash; a headline, an executive summary and
  a notes field &mdash; with a map of all ten at the top that fills itself in as you
  write. It saves as you type and gathers everything into plain text on one button.
  <b>The weekly headlines are not on it</b>; they are all twelve together on the
  page above.</p>
  <p class="meta">Week two carries <b>your own words in gold</b> &mdash; the headline
  and six beats, character for character. Week one carries none, because you spoke
  it and it was written down from the shape rather than quoted.</p>
</div>
</div>

<div class="cards">
<div class="card">
  <h4><a href="reference.html">Reference</a></h4>
  <p class="id">why the left-hand column says what it says</p>
  <p>The three marks and what each promises, where the two weeks came from, the
  transfer classes, the standing rules for the Record, the Friday formula, the
  bouncy ball law and the two runways, and the ten checks the day outlines were
  run against &mdash; <b>one unresolved</b>. The twelve-week arc&rsquo;s own six
  checks are on its page, not here.</p>
  <p class="meta">All of this used to be printed above the work. It is here so it
  is reachable, not unavoidable.</p>
</div>

<div class="card">
  <h4><a href="artifacts.html">The artifact tracker</a></h4>
  <p class="id">what you can reach for today</p>
  <p>${a.addressed} addressable files joined to ${LEDGER.rows.length} revealable
  things, filterable. Every row carries its judgement, its use, and the one verdict
  that matters while dictating: <b>can an entry show this today?</b></p>
  <p class="meta"><b>${a.waiting} pictures of the machines are behind the stage door
  right now</b>, each one entry away from a wall. Exactly one file has ever been
  delivered, and all ${a.runways.unassigned.n} assets are unassigned to a bucket.</p>
</div>

<div class="card">
  <h4><a href="eggs.html">The egg tracker</a></h4>
  <p class="id">what is hidden, and what is only an idea</p>
  <p>${e.n} ledgered eggs &mdash; ${e.planted} planted, ${e.waiting} waiting &mdash;
  each with its mechanism, what it needs before it can be planted, and where it
  stands. Plus the three you named that are <b>not</b> in the egg table.</p>
  <p class="meta">Four eggs have no written form anywhere but their ledger row.
  Nothing in this museum reports an egg being tripped.</p>
</div>

<div class="card">
  <h4><a href="specsheet.html">The in-story spec sheet</a></h4>
  <p class="id">the thing to author from</p>
  <p>Every piece of story-generated technical data about both machines, set as a
  period one-sheet. Marked <b>asserted</b>, <b>implied</b>, <b>contradicted</b> or
  <b>absent</b>; where two sources disagree, both readings print and the conflict
  is named.</p>
  <p class="meta">Only the in-story specs count &mdash; the real board and the real
  filenames are the provenance of a prop, and a spec sheet is not a provenance record.</p>
</div>
</div>

<footer>Regenerate with <code>npm run dictation</code>. These pages read
<code>provenance/asset-table.json</code>, <code>reveal/ledger.json</code>,
<code>reveal/transfers.mjs</code>, <code>reveal/delivery.mjs</code>,
<code>reveal/week-one.mjs</code>, <code>reveal/week-two.mjs</code> and
<code>tools/dictation/spec-source.mjs</code>, and write nothing back to any of them.
<b>Regenerating does not touch anything you have typed into the worksheet</b> &mdash;
your responses live in the browser, never in the file.</footer>
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
  ["arc.html", buildArc()],
  ["worksheet.html", buildWorksheet()],
  ["reference.html", buildReference({ ledger: LEDGER, artifacts: art, eggs: egg, ruledOn: W1_RULED_ON })],
  ["index.html", buildIndex(art, egg)],
];
for (const [n, html] of files) {
  fs.writeFileSync(path.join(OUT, n), html);
  console.log(`  ${String(Math.round(Buffer.byteLength(html) / 1024)).padStart(4)} KB  ${path.relative(REPO, path.join(OUT, n))}`);
}

/* A GENERATOR THAT STOPS WRITING A FILE DOES NOT UNWRITE IT, AND A STALE PAGE
   IN THIS FOLDER IS WORSE THAN NO PAGE — every other document here links to
   `index.html`, so an orphaned `week1.html` stays reachable by history, by a
   bookmark and by anything that ever pasted its path. It is named rather than
   globbed: this prunes what THIS round replaced and nothing else. */
const REPLACED = ["week1.html"];
for (const n of REPLACED) {
  const p = path.join(OUT, n);
  if (fs.existsSync(p)) { fs.unlinkSync(p); console.log(`     -    removed  ${path.relative(REPO, p)}  (replaced by worksheet.html + reference.html)`); }
}

console.log(`\nTHE DICTATION PREP — ${files.length} files`);
console.log(`  record entries        ${recordEntries().length}`);
console.log(`  addressable files     ${art.addressed}`);
console.log(`  behind the door       ${art.waiting}  (one entry away from a wall)`);
console.log(`  eggs                  ${egg.n}  (${egg.planted} planted, ${egg.waiting} waiting)`);
console.log(`\n  open  ${path.join(OUT, "index.html")}`);
