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

   ═══ [L3/C4 2026-08-08] AND THE PREAMBLES CAME BACK, SO IT IS A RULE NOW ════
   MIKE: *"All the stuff at the top, I never read."* Three rounds after the
   worksheet was split precisely to end this, its masthead had grown to SEVEN
   paragraphs and the spec sheet opened on five. Doctrine 25 — THE TOOLS ARE FOR
   WORKING, NOT FOR BRIEFING — is the standing test, and it has one construction
   rule attached: a thing worth knowing goes ON THE FIELD, IN THE FOOTER, or on
   `reference.html`, and never above the work. If it fits none of those, Ops
   raises it in conversation. It does not go on a page he has to read past.

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
import { spawnSync } from "node:child_process";
import { UNIT, MAINFRAME, ADJACENTS, FORCED, SOURCES } from "./spec-source.mjs";
import { delivered, SIGNAGE } from "../../reveal/delivery.mjs";
import { entries as recordEntries } from "../../reveal/record-entries.mjs";
import { GOVERNED_PREFIX, STAGE_PREFIX } from "../../reveal/placement.mjs";
import { ORIGIN as FOCUS_ORIGIN, runways, bucketOf } from "../../reveal/focus.mjs";
import { STAMP, esc, rich, runwayBlock, OPS_CSS, TYPED_CSS, page, BACK } from "./shell.mjs";
import { buildWorksheet, buildReference, buildArc } from "./worksheet.mjs";
import { thumbnails, lightTable, LIGHT_CSS } from "./lighttable.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const argv = process.argv.slice(2);
const optOf = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 ? argv[i + 1] : d; };
const OUT = path.resolve(REPO, optOf("out", "docs/dictation-20260807"));
/* thumbnails are cached by content hash; --fresh re-renders every one */
const FRESH = argv.includes("--fresh");

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
<p>Every piece of story-generated technical data about both machines, from both
repositories, with its source &mdash; marked for whether the fiction <i>asserts</i> it,
<i>implies</i> it, or <i>contradicts itself</i> about it. Nothing on this page appears
for the first time here; where the structure has a position and nothing fills it, the
row reads <i>nothing on file</i>.</p>
<p class="src">${counts.ASSERTED} asserted &middot; ${counts.IMPLIED} implied &middot;
<b>${counts.CONTRADICTED} contradicted</b> &middot; ${counts.ABSENT} absent &middot;
<span class="fw">REAL-BUILD SOURCE</span> = the in-story manual cites the real Arduino
firmware for this row, and a 1965 spec sheet may not carry an I&sup2;C address
(<b>${fwRows} rows</b>, register <code>N-i</code>).</p>
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
   K3 — THE ARTIFACT TRACKER, WHICH IS A LIGHT TABLE NOW [L2/C3 2026-08-08]

   MIKE: *"Without a preview, and a means to see it in a viewer — not very
   useful."* The grid, the tiles and the viewer are `./lighttable.mjs`; what
   stays here is the JOIN — reach, governance and the ledger — because that is
   the part this file has always owned.

   THE POPULATION WIDENED AND IT WAS HIS INSTRUCTION THAT WIDENED IT. *"Build
   it over the POST-CULL set so it shows only what still exists."* Everything
   the cull touched is in the robots repo and has no public address, so the old
   page's 47 addressable rows could not have shown a post-cull anything. It is
   every row whose file is on disk now, and the three `missing: true` rows are
   the only ones out.
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

async function buildArtifacts() {
  const joinedUids = new Set(LEDGER.rows.flatMap(r => r.assets || []));

  const all = TABLE.entries.map(e => {
    const pub = publicRef(e.ref);
    return {
      uid: e.uid, repo: e.repo, path: e.path, sha256: e.sha256,
      kind: e.kind, format: e.format, bytes: e.bytes, w: e.w, h: e.h,
      pub, held: e.path.startsWith("public/held/"), missing: !!e.missing,
      what: e.what, quality: e.quality, qualityNote: e.qualityNote,
      verdict: e.verdict, revealArc: e.revealArc, role: e.role,
      usedBy: e.usedBy || [], ledgered: joinedUids.has(e.uid),
      governed: isGoverned(pub), reach: reachOf(e),
      /* [B1 2026-08-07] Mike's bouncy ball bucket — read, never derived */
      bucket: bucketOf(e),
    };
  });

  /* HIS OWN WORDING IS THE FILTER: "so it shows only what still exists". */
  const onDisk = all.filter(r => !r.missing);
  const addressed = all.filter(r => r.pub && !r.missing);
  const waiting = addressed.filter(r => r.governed && r.reach.k === "YES — ONE ENTRY");
  const runwayOfWaiting = runways(waiting);

  /* the machines lead, then everything in path order. A light table is SCANNED,
     so the order has to be one a person can hold — and the subject of the
     Record is the two machines. */
  const machine = r => r.governed || r.repo === "robots";
  onDisk.sort((a, b) =>
    (machine(b) - machine(a)) || a.repo.localeCompare(b.repo) || a.path.localeCompare(b.path));

  const { thumbs, hits, made, failed } =
    await thumbnails(onDisk, { fresh: FRESH, log: s => console.log(s) });

  /* THE LEDGER HALF. Transfer class, arc and dependencies are properties of a
     revealable THING and not of a file, so they stay a table and are not faked
     into the grid above. It is second and it is quiet. */
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
<h1>The light table</h1>

${lightTable(onDisk, thumbs)}

<h2>The two runways &middot; the ${waiting.length} pictures an entry can reach for today</h2>
${runwayBlock(runwayOfWaiting, "the " + waiting.length + " pictures an entry can reach for today")}

<h2>Revealable things &middot; transfer class, arc and dependencies &middot; ${revealable.length} rows</h2>
<div class="bar">
  <input id="q2" placeholder="filter &mdash; id, name, where, dependency&hellip;">
  <button data-f2="all" aria-pressed="true">all</button>
  <button data-f2="held">held</button>
  <button data-f2="week0">arrived (week 0)</button>
  <button data-f2="later">not yet arrived</button>
  <button data-f2="deps">has dependencies</button>
  <span class="count" id="c2"></span>
</div>
<div class="tw"><table id="t2"><thead><tr><th>id</th><th>what</th><th>state</th><th>transfer</th><th>waits on</th></tr></thead>
<tbody>${revealable.map(lrow).join("\n")}</tbody></table></div>

<footer>${onDisk.length} files on disk &middot; ${addressed.length} with a public address &middot;
${all.length - onDisk.length} rows whose file is gone are not drawn.
Thumbnails are inlined; clicking one opens the file itself from disk.
Built by <code>node tools/dictation/prep.mjs</code> from
<code>provenance/asset-table.json</code>, <code>reveal/ledger.json</code>,
<code>reveal/delivery.mjs</code> and <code>reveal/transfers.mjs</code>; it writes nothing back,
and <code>verdict</code> and <code>bucket</code> are yours. Why a row says what it says:
<a href="reference.html">reference</a>.</footer>
</div>
<script>
(function(){
 var t=document.getElementById('t2'),q=document.getElementById('q2'),c=document.getElementById('c2');
 var btns=[].slice.call(document.querySelectorAll('[data-f2]')),mode='all';
 var tests={all:function(){return true;},
  held:function(r){return r.getAttribute('data-s')==='HELD';},
  week0:function(r){var x=r.getAttribute('data-c');return x==='BLAST'||x==='UNLOCK';},
  later:function(r){var x=r.getAttribute('data-c');return x==='PACKAGE'||x==='TRANSMISSION';},
  deps:function(r){return r.cells[4].textContent.indexOf('nothing')<0;}};
 function apply(){var s=q.value.trim().toLowerCase(),n=0;
  [].forEach.call(t.tBodies[0].rows,function(r){
   var ok=tests[mode](r)&&(!s||r.getAttribute('data-t').indexOf(s)>=0);
   r.className=ok?'':'hide'; if(ok)n++;});
  c.textContent=n+' shown';}
 btns.forEach(function(b){b.addEventListener('click',function(){mode=b.getAttribute('data-f2');
  btns.forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});apply();});});
 q.addEventListener('input',apply);apply();
})();
</script>`;

  console.log(`  thumbnails: ${made} rendered, ${hits} from cache, ${failed} unreadable`);
  return {
    html: page({ title: `THE LIGHT TABLE — ${STAMP}`, css: OPS_CSS + LIGHT_CSS, body }),
    waiting: waiting.length, addressed: addressed.length, shown: onDisk.length,
    thumbed: made + hits, unreadable: failed, runways: runwayOfWaiting,
  };
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

<p class="k" style="font-size:12px;margin:0 0 18px">
<span class="tag g">PLANTED</span> built, held, nobody told &nbsp;&middot;&nbsp;
<span class="tag y">SPENT</span> on the glass &nbsp;&middot;&nbsp;
<span class="tag">WAITING</span> an idea with a row and no build</p>

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

<footer>${onlyHere.length} of these eggs have no written form anywhere but their
ledger row &mdash; the <code>note</code> field IS the egg, and printing it on a face
would spend it in the commit that planted it. Nothing in the museum reports an egg being
tripped, so <i>planted</i> is a statement about the tree and never about a visitor.
Built from <code>reveal/ledger.json</code> (class <code>egg</code>) plus the three rows
above, read out of <code>docs/OPEN_ACTIONS.md</code> and the robots repo's props ledger.
Same population as <code>npm run reveal:eggs</code>; nothing here is written back.</footer>
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

/* ── THE LIVE PREVIEW'S BUNDLE [D4 2026-08-08] ────────────────────────────
   The worksheet's preview renders the museum's OWN components, so it needs
   them built. It is a second vite build (see the reason in
   `preview/vite.config.mjs`) and it is SPAWNED rather than called: OPERATIONS
   §8 — anything that needs to build spawns `vite build`, never `build()`.

   IT FAILS THE GENERATOR IF IT FAILS. A worksheet whose preview pane is a blank
   iframe is worse than one with no preview at all, because the blank reads as
   "nothing written yet". If the components cannot be built, nothing should be
   claiming to show them. */
const PREVIEW_OUT = path.join(OUT, "_preview");
{
  /* `node node_modules/vite/bin/vite.js`, not `npx`. The first cut spawned
     `npx.cmd` and came back `EINVAL` with status `null` — the process never
     started, which is a LAUNCH failure wearing a build failure's clothes, and
     the two need telling apart in the message. Vite's own bin is a file in this
     repo; running it with the interpreter already in hand needs no shell, no
     quoting and no PATH. */
  const cfg = path.join(HERE, "preview", "vite.config.mjs");
  const bin = path.join(REPO, "node_modules", "vite", "bin", "vite.js");
  const r = spawnSync(process.execPath, [bin, "build", "-c", cfg],
    { cwd: REPO, encoding: "utf8" });
  if (r.error || r.status !== 0) {
    console.error(r.stdout || "");
    console.error(r.stderr || "");
    throw new Error(`the live preview bundle failed to build `
      + `(${r.error ? r.error.message : "vite exit " + r.status}). No page is written, `
      + `because a preview that cannot draw the real components must not ship looking `
      + `like one that can.`);
  }
  /* the frame is a committed static file, copied AFTER the build — vite's
     `emptyOutDir` clears this folder every run. */
  fs.copyFileSync(path.join(HERE, "preview", "frame.html"), path.join(PREVIEW_OUT, "frame.html"));
  for (const n of ["preview.js", "preview.css", "frame.html"]) {
    const p = path.join(PREVIEW_OUT, n);
    if (!fs.existsSync(p)) throw new Error(`the preview bundle is missing ${n}`);
    console.log(`  ${String(Math.round(fs.statSync(p).size / 1024)).padStart(4)} KB  ${path.relative(REPO, p)}`);
  }
}

const art = await buildArtifacts();
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
