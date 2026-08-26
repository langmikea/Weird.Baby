#!/usr/bin/env node
/* ===========================================================================
   THE DAY EDITOR — PIECE ONE. One day, whole, read-only.
   ===========================================================================

   SPEC: `C:\AI\_night-20260825\DAY_EDITOR_SPEC-20260825.md`. Read it before
   changing anything here; every decision below is argued there.

   ── THE FINDING IT IS BUILT ON ─────────────────────────────────────────────
   NOTHING SHOWED ONE DAY WHOLE. Every surface showed one facet across five
   days, or five days across one facet: `record.html` the entry's prose (and
   only five field kinds of it), `assign.html` the attachments, `arc.html` the
   WEEK, `artifacts.html` the assets, `eggs.html` the eggs, the desk a list of
   links. **This shows a day whole, in the same shape every day.**

   ── SED — SAME EXCEPT DATA ─────────────────────────────────────────────────
   MIKE, 2026-08-25: **one shape, many instances, differing only in what fills
   it.** The tree had never carried the definition; it is written down in the
   spec and repeated here because this file is the first thing built under it.
   It is the standing constraint stated forward — *"don't build me a standalone
   turd; put them all in one pile"* — and its test is that **the second instance
   is the test of the first.**

   SO EVERY PART OF THIS FILE IS MARKED. `[SHAPE]` is the editor any project
   gets. `[WEIRD.BABY]` is what THIS project fills it with. A project that
   adopts this brings its own vocabulary and gets the editor. The seam is real
   and already drawn: everything pinning the machinery here is an exported
   constant in three files (`RECORD_SOURCE`/`RECORD_ENTRIES_EXPORT`/
   `RECORD_TRACK_ID`, `GOVERNED_PREFIX`/`STAGE_PREFIX`, `RECORD_EPOCH`).

   ── WHAT PIECE ONE IS, AND IS NOT ──────────────────────────────────────────
   READ-ONLY. Nothing here edits, and nothing writes to the tree but this page.
   Editing is Piece 4 and is last **because it is the only piece that can lose
   his words**, and it should be built against a shape he has already used and
   corrected. Eggs are on the backlog with their reason: measured, **no egg is
   linked to a day by anything** — 15 rows, zero carry a `when`, zero name a
   record in `deps` — so an egg panel is a new FIELD, not a view.

   ── IT DERIVES NOTHING IT CAN READ ─────────────────────────────────────────
   `[SHAPE]` Every fact on this page already exists. The shelf is `shelf.mjs`
   (the same list `assign.html` reads — *"not a parallel list"*), the door state
   is `plan()` from `reveal/day.mjs`, the budgets are `record-shape.mjs`, the
   entry is `draftEntries()`, the assets are `entries()` — which DERIVES them by
   scraping every path-shaped string under an entry, so nothing here asks for an
   asset list and nothing writes one. The brace test is the gate's own regex.

   **It invents no judgement.** There is no completeness score, no percentage
   and no ranking of days: the tree holds no definition of a complete day,
   Record 001 is a deposit day by the arc's own words (*"Week 1 is all
   deposit"*), and an editor that badged it thin would be wrong about the story
   and ignored within a week. A mark is red here only when a GATE THAT EXISTS
   would refuse the packet.

   ── THE VIEWER DOES NOT USE A PATH RELATIVE TO THE PAGE, AND THAT IS A FIX ──
   `[SHAPE]` `assign.html` and `artifacts.html` draw a tile from an inline
   data-URI — which always renders — and then open the FULL FILE on click via
   `diskHref`, a path relative to wherever the page is sitting
   (`../../public/...`). So there is a class of page-state where every tile
   shows a picture and every click fails. **Measured 2026-08-25: opened from
   `docs/dictation-20260807/` all 138 resolve; SERVED by `npm run mock` all of
   them 404**, because that server's root is `docs/` and the path climbs out of
   it. Mike confirmed he was served, at 127.0.0.1:8931.

   THE TRAP POINTED AT OPS RATHER THAN AT HIM: OPERATIONS §8 obliges Ops to
   serve every mock because Ops cannot see `file://` — **so the way Ops is
   required to look was the way that breaks.** This page carries its pictures
   INLINE at `VIEW_PX` and never references a path, so it renders identically
   however it is opened. Full-resolution inspection stays on the light table,
   which is what that instrument is for.

   ── THUMBNAILS: FAINT, NOT SMALL ───────────────────────────────────────────
   The measurement and the chosen parameters are in `lighttable.mjs`'s own
   header. In short: a crop is dead (the ink's bbox is 61-92% of the page, so
   it buys x1.00-x1.24), the pages are faint (mean luminance 246-250 of 255),
   and the answer is a percentile contrast stretch applied per image on the
   image's own evidence, at a bigger size. `[SHAPE]`

   ── WHAT MIKE CHANGED AFTER USING IT, 2026-08-25 ───────────────────────────
   Seven, and every one of them is either SHAPE or SUBTRACTION. Recorded here
   because the reasons are the standing part.

   (1) `[SHAPE]` EVERY ICON AND EVERY MARK SAYS WHAT IT MEANS AND WHAT IT READ.
       Two lines on every hover, drawn by `hint()` and by nothing else: line
       one is the MEANING and is the same sentence every time that mark
       appears; line two is THIS day's READING. A mark with a bare title, or
       with none, is the defect this fixes — a state nobody can name is a state
       nobody can act on.

   (2) `[SHAPE]` THE VIEWER'S FINAL STEP IS x2 AND IT IS REAL PIXELS. *"It is
       not enough today"* — and it was not: a page is 1700x2200 and the viewer
       drew it at 371x480, its own natural size. So the day's pictures are
       inlined TWICE, at `VIEW_PX` and at `ZOOM_PX`, and x2 swaps the source
       rather than scaling the small one up. A x2 that upscales a 480px raster
       shows no more of the page than x1 did and says it does.

   (3) `[SHAPE]` A SECTION IS A HEADER AND ITS LINES. His vocabulary, not a
       description: *"SECTIONS exist. They start with a HEADER which always
       fits the constraints and displays per the standard recipe. The text
       following the header is the LINES, always formatted the same, indented,
       etc."* ONE recipe for headers (`headerHtml`), ONE for lines
       (`linesHtml`), and no third path anywhere on this page.

   (4) `[SHAPE]` SHOW THE TEXT, NEVER DESCRIBE IT. The page said *"1 paragraph"*
       where the paragraph itself would fit. Every string this page can reach
       is now drawn: the section LINES, and the plate labels the attachments
       carried and dropped on the floor.

   (5) `[WEIRD.BABY]` THE DEPOSIT LINE IS OUT. It printed *"no attachments —
       not a hole. Week one is all deposit."* That is Ops prose in Mike's own
       voice on a surface he reads, and reassurance is a judgement. The header
       states the count and stops.

   (6) THE LEDGER ROWS PANEL IS OUT, whole — *"Ops bookkeeping on his page; he
       will never act on it."* `calledBy` and `reveal/ledger.json` came out
       with it rather than being left computed for nobody.

   (7) THE FILES PANEL IS THE LIST AND NOTHING ELSE. Its note explained the
       derive-every-path-shaped-string mechanism; Mike has ruled that mechanism
       a hack being replaced, so the page does not teach it.

     npm run day
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { esc, page, OPS_CSS } from "./shell.mjs";
import { thumbnails } from "./lighttable.mjs";
import { buildShelf, SECTIONS } from "./shelf.mjs";
import { draftEntries, entries as recordEntries, summaries } from "../../reveal/record-entries.mjs";
import { BUDGETS, CONSTRAINTS } from "../../reveal/record-shape.mjs";
import { STAGE_PREFIX } from "../../reveal/placement.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const OUT = path.join(REPO, "docs", "dictation-20260807", "day.html");
const TABLE = path.join(REPO, "provenance", "asset-table.json");
const FRESH = process.argv.includes("--fresh");

/* `[SHAPE]` THE DAY'S OWN PICTURES ARE BIGGER THAN THE SHELF'S. 240px is 8.5%
   of a 2640px manual page; at 480 the ink reads. The shelf keeps 240 because it
   is 138 tiles and the day is at most a handful. Both live in one cache — the
   key carries the size and the treatment. */
const VIEW_PX = 480;

/* `[SHAPE]` AND THE VIEWER'S FINAL STEP IS A SECOND, REAL IMAGE. Mike, on the
   viewer: *"ZOOM x2 on the viewer's final step. It is not enough today."*
   MEASURED, which is why this is a second inline image and not a CSS scale:
   every one of the seven day pictures is 1700x2200, `VIEW_PX` fits that inside
   480 (371x480 on the glass), and 960 is still well inside the source — so x2
   is 742x960 of the page's own pixels. Scaling the 480 up would show exactly
   the detail x1 already showed, at twice the size, which is the quiet kind of
   wrong `lighttable.mjs` refuses for the same reason.
   THE COST WAS MEASURED BEFORE IT WAS SPENT: seven pictures, ~45KB of base64
   each at 960 against ~20KB at 480. The shelf's 138 tiles get NO second copy —
   that would be eight megabytes to answer a question the light table answers. */
const ZOOM_PX = VIEW_PX * 2;

/* ═══ EVERY MARK SAYS TWO THINGS ═══════════════════════════════════════════
   `[SHAPE]` MIKE, 2026-08-25: **hover hints everywhere — every icon and every
   mark says what it means and what it read.**

   LINE ONE IS THE MEANING and is the SAME SENTENCE every time that mark is
   drawn, on any day; LINE TWO is what it read on THIS day. Splitting them is
   the point: a hint that only describes leaves him deriving the reading from
   the glyph, and a hint that only reports leaves him deriving the rule from
   the reading. `&#10;` is appended after `esc()` because `esc()` would escape
   its own ampersand.

   NOTHING ON THIS PAGE CARRIES A BARE `title=`. If a mark is added and its
   hint is not, this is the function that was not called. */
const hint = (means, read) =>
  ` title="${esc(means)}${read ? "&#10;" + esc(String(read)) : ""}"`;

/* ═══ THE BRACE TEST — the gate's own, not a second one ════════════════════
   `[SHAPE]` `reveal:check` fails a packet on `/\{[^{}]*\}/g` over the Record's
   folded prose, and the launch build fails again on every string literal under
   `src/`. A note in braces is Mike writing to Ops and is never story. This page
   runs the SAME regex so that what it shows and what refuses the packet cannot
   disagree. */
const BRACE = /\{[^{}]*\}/g;
function bracesIn(e) {
  const out = [];
  const walk = v => {
    if (typeof v === "string") { for (const m of v.match(BRACE) || []) out.push(m); return; }
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (v && typeof v === "object") { Object.values(v).forEach(walk); }
  };
  walk({ ...e, no: undefined, date: undefined });
  return out;
}

/* ═══ THE DAY ══════════════════════════════════════════════════════════════ */
const WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* ═══ THE DOOR ═════════════════════════════════════════════════════════════
   `[WEIRD.BABY]` the two doors · `[SHAPE]` the question (published yet or not).

   THE STATE IS READ OFF THE ASSET TABLE'S OWN PATH — `public/held/…` is behind
   the stage door, `public/…` is at the public address. That is the door itself,
   not a second opinion about it.

   > **[FLAG 2026-08-25 · stated, not fixed] `reveal/day.mjs` EXPORTS `plan()`
   > AND NOTHING CAN IMPORT IT.** That module is a SCRIPT: it runs its whole
   > report at the top level and ends in `process.exit(...)`, with no
   > `import.meta.url === process.argv[1]` guard. Importing it prints the day's
   > step and kills the importing process — measured here, the first build of
   > this file produced `reveal:day`'s output and none of its own. So its one
   > export is unreachable and `npm run reveal:day` is the only way to ask it
   > anything. NOT FIXED HERE: that file is step 12 of `SUNDAY-20260830.md` and
   > this piece is additive; a main guard is a one-line change to a runbook
   > dependency and belongs in its own round.

   WHAT IS LOST BY READING THE TABLE INSTEAD, SAID PLAINLY: `plan()` also
   answers PULL — public and undelivered — which is a question about files the
   Record does NOT name, so it is not a per-day fact and this page never needed
   it. `npm run reveal:day` remains the authority on moves, and this page says
   so where it prints the state. */
const DOOR_SAYS = {
  PUBLIC: ["public", "at its public address"],
  PLACE: ["not placed", "this Record delivers it and it is still behind the door — npm run reveal:day -- --place moves it"],
};

/* `[SHAPE]` the section HEADER's rule, quoted from the one place that declares
   it rather than restated here. It is `silent: true` — nothing enforces it —
   and the hint says so, because a mark that implies a gate that does not exist
   is the same defect as a gate nobody can find. */
const HEADER_RULE = CONSTRAINTS.find(c =>
  c.field === "sections" && /all-caps label/.test(c.rule))
  || { rule: "", enforcedBy: "nothing" };

function buildDays() {
  const draft = draftEntries().entries;
  const live = recordEntries();
  const sums = summaries();
  const table = JSON.parse(fs.readFileSync(TABLE, "utf8")).entries;
  /* the door, read off the path. A file the Record names and that still sits
     under `public/held/` is delivered-and-not-placed; anything at `public/` is
     at its public address. */
  const doorOf = new Map();
  const onDisk = new Set();
  for (const r of table) {
    if (r.repo !== "museum" || !r.path.startsWith("public/")) continue;
    const held = r.path.startsWith("public/held/");
    const web = "/" + r.path.replace(/^public\/held\//, "").replace(/^public\//, "");
    doorOf.set(web, held ? "PLACE" : "PUBLIC");
    if (!r.missing) onDisk.add(web);
  }

  return draft
    .slice()
    .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")))
    .map(e => {
      const l = live.find(x => x.no === e.no) || {};
      const s = sums.find(x => x.no === e.no) || {};
      const assets = (l.assets || []).slice();

      /* `[SHAPE]` A SECTION IS A HEADER AND ITS LINES — Mike's vocabulary, and
         the shape the page is drawn in. The HEADER is the label; the LINES are
         the text following it, carried WHOLE and in his own line splits.
         THE PARAGRAPHS ARE NOT JOINED. `body` is a list and each item is a run
         of lines he wrote as one; joining them would be Ops smoothing his
         writing, which OPERATIONS §0 VERBATIM forbids in terms. They are drawn
         by one recipe each, in order, and `lines` counts the physical lines
         across all of them because that is what a reading of the LINES is.
         A HEADER whose body is empty is DROPPED ENTIRELY, label included, on
         Mike's own ruling — nothing on any surface said so before it happened,
         and that is the one red this block can raise. */
      const sections = (e.sections || []).map(x => {
        const runs = (x.body || []).map(p => typeof p === "string" ? p
          : (p && typeof p.pre === "string" ? p.pre : JSON.stringify(p)));
        return {
          header: x.label || null,
          runs,
          lines: runs.reduce((a, r) => a + r.split("\n").length, 0),
          empty: !runs.length,
        };
      });

      /* `[WEIRD.BABY]` attachments. A doc with no plates resolves to `held` in
         `docState()` and draws **not here yet** on the glass — Ruling 9's own
         shape, and the reason `assign.html` cannot make one.
         THE PLATE'S OWN LABEL IS CARRIED. It is a written string that existed
         in the data and reached no surface: the tile drew a filename and the
         sentence describing the page was on the floor. */
      const docs = (e.docs || []).map(d => ({
        title: d.title || "(untitled)",
        source: d.source || null,
        pages: d.pages ?? null,
        files: (d.plates || []).map(p => p.img).filter(Boolean),
        labelOf: Object.fromEntries((d.plates || [])
          .filter(p => p.img).map(p => [p.img, p.label || ""])),
      }));

      const fileRows = assets.map(a => ({
        web: a,
        name: a.split("/").pop(),
        door: doorOf.get(a) || (onDisk.has(a) ? "PUBLIC" : null),
        onDisk: onDisk.has(a),
        inDoc: docs.find(d => d.files.includes(a))?.title || null,
        label: docs.find(d => d.files.includes(a))?.labelOf[a] || null,
      }));

      return {
        no: e.no,
        date: e.date || null,
        weekday: e.date ? WD[new Date(e.date + "T12:00:00Z").getUTCDay()] : null,
        title: e.title || null,
        line: e.line || null,
        lead: e.lead || null,
        tomb: e.tomb || null,
        still: e.still || null,
        stillCaption: e.stillCaption || null,
        indexTitle: s.title || null,
        sections, docs, fileRows,
        braces: bracesIn(e),
        /* `[SHAPE]` fields that RENDER and cannot survive the draft round-trip.
           `draftEntries` reports them by name — *"an entry declaring one would
           render on the glass and vanish from the editor"*. Shown here so a
           day that has one says so; Piece 4 must not offer them until the
           reader carries them. */
        locked: ["wire", "plates", "note"].filter(k => e[k] != null),
      };
    });
}

/* ═══ THE SIX ICONS ════════════════════════════════════════════════════════
   `[SHAPE]` the mechanism · `[WEIRD.BABY]` what two of them count.

   MIKE CHOSE THESE SIX: headline present · deck headroom · attachments and
   their files · files not yet placed · a section that would be silently
   dropped · unresolved brace. **The last two bite in silence, the middle two
   are the day's work, the first two are the budget he writes against.**

   TWO RULES THEY OBEY:
     · AN ICON SAYS A STATE, NEVER AN INSTRUCTION — *"tells me what you need,
       not what I am to do."* It reads `deck 128/130`, never `NEEDS A COPY`.
     · A COUNT OF ZERO ON AN OPTIONAL THING IS NOT RED. Record 001 shows
       `0 attachments` in the ordinary ink. Red is reserved for what a gate
       that EXISTS would refuse.

   AND EACH ONE CARRIES ITS HINT IN TWO HALVES — `w` is what the mark MEANS and
   is the same sentence on every day; `r` is what it READ on this one. The bar
   and the calendar both draw from these two fields and neither writes a
   sentence of its own, so one mark cannot say two things in two places. The
   budget halves are quoted from `record-shape.mjs` rather than retyped, which
   is the same rule one level down. */
function icons(d) {
  const out = [];
  const budgetMeans = b =>
    `${b.name} — ${b.holds}, at most ${b.max} characters. ${b.enforcedBy}.`;

  out.push(d.title
    ? { k: "headline", t: "H", v: `${d.title.length}/${BUDGETS.title.max}`,
        s: d.title.length > BUDGETS.title.max ? "bad" : "ok",
        w: budgetMeans(BUDGETS.title),
        r: `READS  ${d.title.length} characters of ${BUDGETS.title.max} — ${d.title}` }
    : { k: "headline", t: "H", v: "none", s: "warn",
        w: budgetMeans(BUDGETS.title),
        r: "READS  no headline — the index row prints none. 004 and 005 shipped this way (register L-c)" });

  const ln = d.line ? d.line.length : 0;
  out.push({ k: "deck", t: "D", v: d.line ? `${ln}/${BUDGETS.line.max}` : "none",
    s: !d.line ? (d.lead ? "ok" : "warn")
      : ln > BUDGETS.line.max ? "bad" : ln > BUDGETS.line.max - 5 ? "warn" : "ok",
    w: budgetMeans(BUDGETS.line),
    r: d.line ? `READS  ${ln} characters of ${BUDGETS.line.max} — ${d.line}`
      : d.lead ? "READS  no deck; the lead paragraph carries it"
        : "READS  no deck and no lead — the entry prints neither" });

  const nf = d.docs.reduce((a, x) => a + x.files.length, 0);
  const empty = d.docs.filter(x => !x.files.length).length;
  out.push({ k: "attachments", t: "A", v: `${d.docs.length}/${nf}`,
    s: empty ? "bad" : "ok",
    w: "attachments and their files, read as attachments/files. An attachment with "
     + "no files draws “not here yet” on the glass (Ruling 9).",
    r: `READS  ${d.docs.length} attachment${d.docs.length === 1 ? "" : "s"}, `
     + `${nf} file${nf === 1 ? "" : "s"}`
     + (empty ? `, ${empty} of them with no files` : "") });

  const unplaced = d.fileRows.filter(f => f.door === "PLACE").length;
  out.push({ k: "placed", t: "P", v: unplaced ? String(unplaced) : "—",
    s: unplaced ? "bad" : "ok",
    w: "files this Record delivers that are still behind the stage door. "
     + "npm run reveal:day -- --place moves them.",
    r: unplaced ? `READS  ${unplaced} of ${d.fileRows.length} still behind the door`
      : `READS  ${d.fileRows.length} file${d.fileRows.length === 1 ? "" : "s"}, `
        + "every one at its public address" });

  const drop = d.sections.filter(x => x.empty).length;
  out.push({ k: "dropped", t: "S", v: drop ? String(drop) : "—",
    s: drop ? "bad" : "ok",
    w: "a SECTION whose LINES are empty is dropped ENTIRELY, its HEADER with it, "
     + "and nothing says so.",
    r: drop ? `READS  ${drop} of ${d.sections.length} would be dropped`
      : `READS  ${d.sections.length} section${d.sections.length === 1 ? "" : "s"}, `
        + "none would be dropped" });

  out.push({ k: "braces", t: "{}", v: d.braces.length ? String(d.braces.length) : "—",
    s: d.braces.length ? "bad" : "ok",
    w: "a note in braces is you writing to Ops, never story. "
     + "npm run reveal:check refuses the packet while one survives.",
    r: d.braces.length ? `READS  ${d.braces.length} unresolved — ${d.braces.join("  ")}`
      : "READS  none" });

  return out;
}

/* ═══ CSS ══════════════════════════════════════════════════════════════════
   No frills or glamour — the existing Ops pages are the reference. One face,
   thin rules, gold only where a state means something.
   No backtick below: this sits inside a template literal and one would close it. */
const CSS = OPS_CSS + `
.dy-wrap{display:grid;grid-template-columns:250px minmax(0,1fr) 330px;gap:16px;align-items:start}
@media (max-width:1200px){.dy-wrap{grid-template-columns:210px minmax(0,1fr)}
  .dy-pick{grid-column:1/-1}}
@media (max-width:820px){.dy-wrap{grid-template-columns:1fr}}

.dy-top{position:sticky;top:0;z-index:30;background:var(--paper,#17150f);
  border-bottom:1px solid var(--rule,#3a3529);padding:9px 0 8px;margin:0 0 14px}
.dy-bar{display:flex;gap:7px;align-items:center;flex-wrap:wrap}
.dy-ic{display:inline-flex;align-items:center;gap:4px;font-size:11px;line-height:1;
  padding:4px 7px;border:1px solid var(--rule,#3a3529);border-radius:2px}
.dy-ic b{font-weight:700;opacity:.55;font-size:10px;letter-spacing:.06em}
.dy-ic.ok{opacity:.72}
.dy-ic.warn{border-color:var(--gold,#b8974a);color:var(--gold,#b8974a)}
.dy-ic.bad{border-color:#c76a6a;color:#e89a9a}
.dy-nav{margin-left:auto;display:flex;gap:5px;align-items:center;font-size:11px;opacity:.8}
.dy-nav button{font-family:inherit;font-size:11px;padding:4px 9px;cursor:pointer;
  background:transparent;border:1px solid var(--rule,#3a3529);color:inherit;border-radius:2px}
.dy-nav button:hover:not([disabled]){border-color:var(--gold,#b8974a)}
.dy-nav button[disabled]{opacity:.3;cursor:default}

.dy-panel{border:1px solid var(--rule,#3a3529);border-radius:2px;padding:0}
.dy-panel>summary{cursor:pointer;list-style:none;padding:8px 10px;font-size:11.5px;
  letter-spacing:.05em;opacity:.8}
.dy-panel>summary::-webkit-details-marker{display:none}
.dy-panel>summary:hover{opacity:1}
.dy-panel .in{padding:0 10px 10px}

.dy-cal button{display:block;width:100%;text-align:left;font-family:inherit;
  background:transparent;color:inherit;border:0;border-top:1px solid #2a2620;
  padding:7px 2px;cursor:pointer}
.dy-cal button:hover{background:#1e1b15}
.dy-cal button[aria-current=true]{box-shadow:inset 2px 0 0 var(--gold,#b8974a);padding-left:7px}
.dy-cal .d1{font-size:11.5px;letter-spacing:.04em}
.dy-cal .d2{font-size:10px;opacity:.55;margin:1px 0 3px}
.dy-cal .row{display:flex;gap:3px;flex-wrap:wrap}
.dy-cal .row i{font-style:normal;font-size:9px;line-height:1;padding:2px 3px;border-radius:2px;
  border:1px solid #2a2620;opacity:.6}
.dy-cal .row i.warn{border-color:var(--gold,#b8974a);color:var(--gold,#b8974a);opacity:1}
.dy-cal .row i.bad{border-color:#c76a6a;color:#e89a9a;opacity:1}

.dy-day h2{margin:0 0 2px;font-size:16px;letter-spacing:.02em}
.dy-day .when{font-size:11.5px;opacity:.6;margin:0 0 12px}
.dy-sec{border-top:1px solid #2a2620;margin:12px 0 0;padding:10px 0 0}
.dy-sec>h3{margin:0 0 6px;font-size:10.5px;letter-spacing:.09em;opacity:.5;font-weight:400}
.dy-f{margin:0 0 7px}
.dy-f .lab{font-size:10px;letter-spacing:.06em;opacity:.45}
.dy-f .val{font-size:12.5px;line-height:1.5;white-space:pre-wrap}
.dy-f .none{font-size:11.5px;opacity:.4;font-style:italic}
.dy-count{font-size:10px;opacity:.45;margin-left:5px}
.dy-count.warn{color:var(--gold,#b8974a);opacity:1}
.dy-count.bad{color:#e89a9a;opacity:1}
/* THE TWO RECIPES, AND THERE ARE ONLY TWO. A SECTION IS A HEADER AND ITS
   LINES; every section on every day is drawn by these rules and by nothing
   else, which is what makes it a shape rather than a layout.
   THE LINES ARE MONOSPACE AND pre-wrap BECAUSE THE DATA IS COLUMNAR — 004's
   folder tree hangs PORTAL.CFG under TERMINAL.EXE at column 26 and 002's
   manifest is a file list. A proportional face closes that up and reads as
   prose; RecordEntry.jsx opted one paragraph into pre on the same finding.
   (No backtick in this comment: it sits inside a template literal and one
   would close it — the same rule the head of this CSS block already states.)
   Here it is not an opt-in: one recipe, every time, so the editor cannot show
   him a shape the section does not have. */
ol.dy-sects{list-style:none;margin:0;padding:0}
ol.dy-sects li{border-top:1px solid #22201a;padding:7px 0 9px}
ol.dy-sects li:first-child{border-top:0}
.dy-hd{display:flex;gap:7px;align-items:baseline;flex-wrap:wrap}
.dy-hd .t{font-size:11.5px;letter-spacing:.07em}
ol.dy-sects li.empty .dy-hd .t{color:#e89a9a}
.dy-lines{margin:5px 0 0;padding:0 0 0 13px;border-left:1px solid #2a2620}
.dy-lines p{margin:0 0 9px;font-family:ui-monospace,Consolas,monospace;
  font-size:11.5px;line-height:1.5;white-space:pre-wrap;opacity:.88}
.dy-lines p:last-child{margin:0}

.dy-att{border:1px solid #2a2620;border-radius:2px;padding:8px 9px;margin:0 0 8px}
.dy-att .t{font-size:12px;line-height:1.35}
.dy-att .m{font-size:10px;opacity:.5;margin:2px 0 6px}
.dy-files{display:flex;gap:8px;flex-wrap:wrap;margin:0}
.dy-file{width:132px}
.dy-file img{display:block;width:132px;height:auto;background:#fff;border:1px solid #2a2620;cursor:zoom-in}
.dy-file .cap{font-size:10px;line-height:1.35;opacity:.8;margin:3px 0 0}
.dy-file .n{font-size:9.5px;opacity:.6;margin:2px 0 0;word-break:break-all}
.dy-file .dr{font-size:9px;margin:2px 0 0;padding:1px 4px;border:1px solid #2a2620;
  border-radius:2px;display:inline-block;opacity:.65}
.dy-file .dr.bad{border-color:#c76a6a;color:#e89a9a;opacity:1}
.dy-none{font-size:11.5px;opacity:.45;font-style:italic}

table.dy-t{border-collapse:collapse;width:100%;font-size:11px}
table.dy-t td{border-top:1px solid #22201a;padding:4px 6px 4px 0;vertical-align:top}
table.dy-t td:first-child{opacity:.5;white-space:nowrap;width:1%}

.dy-pick .sec{border-top:1px solid #2a2620;padding:6px 0}
.dy-pick .sec>b{font-size:10.5px;letter-spacing:.05em;font-weight:400;opacity:.75}
.dy-pick .sec>span{font-size:9.5px;opacity:.45;margin-left:5px}
.dy-pick .g{display:flex;gap:5px;flex-wrap:wrap;margin:6px 0 0}
.dy-pick .g img{width:52px;height:auto;background:#fff;border:1px solid #2a2620;cursor:zoom-in}
.dy-pick .g .noimg{width:52px;height:34px;border:1px dashed #2a2620;border-radius:2px}
.dy-note{font-size:10px;opacity:.5;line-height:1.45;margin:8px 0 0}

#dy-view{position:fixed;inset:0;z-index:90;background:rgba(9,8,6,.96);display:none;
  padding:12px;overflow:auto}
#dy-view.on{display:block}
#dy-vbar{display:flex;gap:7px;align-items:center;font-size:11.5px;margin:0 0 9px}
#dy-vbar button{font-family:inherit;font-size:11.5px;padding:4px 9px;cursor:pointer;
  background:transparent;border:1px solid var(--rule,#3a3529);color:inherit;border-radius:2px}
#dy-vbar button:hover:not([disabled]){border-color:var(--gold,#b8974a)}
#dy-vbar button[aria-pressed=true]{border-color:var(--gold,#b8974a);color:var(--gold,#b8974a)}
#dy-vbar button[disabled]{opacity:.3;cursor:default}
#dy-vname{opacity:.7}
#dy-vcap{opacity:.55;font-size:10.5px}
/* NO max-width — at x2 a cap is not a zoom, it is the same picture with a
   bigger promise. The overlay scrolls inside its own box (#dy-view is
   overflow:auto), so the PAGE still never scrolls sideways. */
#dy-vimg{display:block;margin:0 auto;background:#fff;cursor:zoom-in}
`;

/* ═══ RENDER ═══════════════════════════════════════════════════════════════ */

/* `[SHAPE]` A FIELD. The LABEL carries the hint, because the label is the mark;
   the value is the text itself, drawn whole, or the field says it is not
   written. Nothing here describes a string it could print. */
const fld = (lab, v, means, read, extra = "") =>
  `<div class="dy-f"><div class="lab"${hint(means, read)}>${esc(lab)}${extra}</div>${
    v ? `<div class="val">${esc(v)}</div>` : `<div class="none">not written</div>`}</div>`;

function counted(n, b) {
  const s = n > b.max ? "bad" : n > b.max - 5 ? "warn" : "";
  return `<span class="dy-count ${s}"${hint(
    `${b.name} — ${b.holds}, at most ${b.max} characters. ${b.enforcedBy}.`,
    `READS  ${n} of ${b.max}` + (n > b.max ? `, ${n - b.max} over` : `, ${b.max - n} left`)
  )}>${n}/${b.max}</span>`;
}

/* ═══ THE SECTION, AND IT IS A HEADER AND ITS LINES ════════════════════════
   `[SHAPE]` MIKE, 2026-08-25 — the vocabulary, in his words:

   > "SECTIONS exist. They start with a HEADER which always fits the
   > constraints and displays per the standard recipe. The text following the
   > header is the LINES, always formatted the same, indented, etc."

   TWO FUNCTIONS AND NO THIRD PATH. Every section on every day goes through
   `headerHtml` and then `linesHtml`; there is nowhere else on this page a
   section can be drawn from, which is what makes this a SHAPE rather than a
   layout that happens to repeat.

   THE HEADER'S MARK IS A READING AND NOT A VERDICT. `record-shape.mjs` is the
   one declaration of what a header is bound by, it is quoted rather than
   restated, and it says `enforcedBy: nothing` — so the mark counts characters
   in the ordinary ink and the hint says plainly that no gate reads it.
   Inventing a length here would put a red on this page that no packet could
   ever fail on.
   THE ONE RED IT DOES RAISE IS MIKE'S OWN RULING: a HEADER whose LINES are
   empty is dropped ENTIRELY, header included, and until this page nothing said
   so before it happened. */
function headerHtml(s) {
  const n = s.header ? s.header.length : 0;
  const means = `the SECTION's HEADER. ${HEADER_RULE.rule} Enforced by: ${HEADER_RULE.enforcedBy}.`;
  return `<div class="dy-hd"><span class="t"${hint(means,
      `READS  ${n} character${n === 1 ? "" : "s"}` + (s.header ? "" : " — this section has no header"))
    }>${esc(s.header || "(no header)")}</span>${
    s.empty
      ? `<span class="dy-count bad"${hint(
          "a SECTION whose LINES are empty is dropped ENTIRELY, its HEADER with it, and nothing says so.",
          "READS  0 lines — this header does not reach the glass")
        }>would be dropped entirely, header included</span>`
      : ""}</div>`;
}

function linesHtml(s) {
  const means = "the SECTION's LINES — the text following the HEADER, drawn as it is "
    + "stored: the same line splits, the same indentation, the same spacing. "
    + "Nothing enforces a length.";
  if (s.empty) {
    return `<p class="dy-none"${hint(means, "READS  no lines")}>no lines</p>`;
  }
  return `<div class="dy-lines"${hint(means,
    `READS  ${s.lines} line${s.lines === 1 ? "" : "s"}, in ${s.runs.length} `
    + `block${s.runs.length === 1 ? "" : "s"} as they are stored`)
  }>${s.runs.map(r => `<p>${esc(r)}</p>`).join("")}</div>`;
}

function dayHtml(d, byWeb, bigByWeb) {
  /* `[SHAPE]` A FILE TILE, and every part of it is a mark that carries a hint:
     the picture, the plate's own label, the filename and the door. */
  const files = rows => rows.length
    ? `<div class="dy-files">${rows.map(f => {
        const t = byWeb.get(f.web);
        const [word, doorMeans] = DOOR_SAYS[f.door]
          || ["unknown", "no door state — this file is not in the plan"];
        return `<figure class="dy-file">${
          t ? `<img src="${t}" alt="${esc(f.label || f.name)}" data-zoom="${esc(f.web)}"${hint(
                `the page itself, inlined at ${VIEW_PX}px so it draws however this file is `
                + `opened. Click for the viewer — its final step is x2, at ${ZOOM_PX}px.`,
                `READS  ${f.name}` + (bigByWeb.has(f.web) ? "" : " — no x2 for this one"))}>`
            : `<div class="noimg"${hint(
                "no thumbnail — this file is named by the Record and could not be read from "
                + "disk to inline.", `READS  ${f.web}`)}></div>`}
  ${f.label ? `<div class="cap"${hint(
      "the plate's own label, as it is written in the attachment.",
      `READS  ${f.label}`)}>${esc(f.label)}</div>` : ""}
  <div class="n"${hint("the file's name at its public address.",
      `READS  ${f.web}`)}>${esc(f.name)}</div>
  <span class="dr${f.door === "PLACE" || !f.onDisk ? " bad" : ""}"${hint(
      `the door — ${doorMeans}.`,
      `READS  ${f.web}` + (f.onDisk ? "" : " — and there is no file at that path on disk"))
    }>${esc(word)}${f.onDisk ? "" : " · not on disk"}</span>
</figure>`;
      }).join("")}</div>`
    : "";

  return `<div class="dy-day" data-day="${d.no}" hidden>
  <h2>RECORD ${String(d.no).padStart(3, "0")}</h2>
  <p class="when"${hint("the day this Record is dated, and the weekday it falls on.",
    `READS  ${d.date || "no date"}`)}>${d.weekday ? esc(d.weekday) + " " : ""}${esc(d.date || "no date")}</p>

  <div class="dy-sec"><h3>THE ENTRY</h3>
    ${fld("HEADLINE", d.title,
      `${BUDGETS.title.name} — ${BUDGETS.title.holds}. ${BUDGETS.title.why}`,
      d.title ? `READS  ${d.title.length} characters` : "READS  not written — the index row prints none",
      d.title ? counted(d.title.length, BUDGETS.title) : "")}
    ${fld("DECK · the index summary", d.line,
      `${BUDGETS.line.name} — ${BUDGETS.line.holds}. ${BUDGETS.line.why}`,
      d.line ? `READS  ${d.line.length} characters` : "READS  not written",
      d.line ? counted(d.line.length, BUDGETS.line) : "")}
    ${fld("LEAD", d.lead,
      "the lead paragraph at the top of the opened record. With no lead on the entry, the deck draws here too.",
      d.lead ? `READS  ${d.lead.length} characters` : "READS  not written")}
    ${fld("TOMBSTONE", d.tomb,
      "the last sentence of the day — where things stand when the lights go off.",
      d.tomb ? `READS  ${d.tomb.length} characters` : "READS  not written")}
    ${d.still ? fld("STILL", d.still + (d.stillCaption ? " — " + d.stillCaption : ""),
      "the entry's still, and its caption.",
      `READS  ${d.still}`) : ""}
    ${d.locked.map(k => fld(k.toUpperCase(),
      typeof d[k] === "string" ? d[k] : JSON.stringify(d[k], null, 1),
      "present on the entry, renders on the glass, and CANNOT survive the draft round-trip — "
      + "Piece 4 must not offer it until the reader carries it.",
      `READS  ${k} is declared on this entry`)).join("")}
  </div>

  <div class="dy-sec"><h3>SECTIONS · ${d.sections.length}</h3>
    ${d.sections.length
      ? `<ol class="dy-sects">${d.sections.map(s => `<li class="${s.empty ? "empty" : ""}">
      ${headerHtml(s)}
      ${linesHtml(s)}
    </li>`).join("")}</ol>`
      : `<p class="dy-none"${hint("a SECTION is a HEADER and its LINES; this entry declares none.",
          "READS  0 sections")}>no sections</p>`}
  </div>

  <div class="dy-sec"><h3>ATTACHMENTS · ${d.docs.length}</h3>
    ${d.docs.map(a => `<div class="dy-att">
      <div class="t"${hint("the attachment's title, as it prints at the foot of the record.",
        `READS  ${a.title}`)}>${esc(a.title)}</div>
      <div class="m"${hint("the attachment's own facts: how many files it carries, where it came "
        + "from, how many pages it is. An attachment with no files draws “not here yet” "
        + "on the glass (Ruling 9).",
        `READS  ${a.files.length} file${a.files.length === 1 ? "" : "s"}`
        + (a.source ? `, source ${a.source}` : "")
        + (a.pages != null ? `, ${a.pages} page${a.pages === 1 ? "" : "s"}` : ""))
      }>${a.files.length} file${a.files.length === 1 ? "" : "s"}${a.source ? " · " + esc(a.source) : ""}${a.pages != null ? " · " + a.pages + " page" + (a.pages === 1 ? "" : "s") : ""}${a.files.length ? "" : " · draws “not here yet”"}</div>
      ${files(d.fileRows.filter(f => a.files.includes(f.web)))}
    </div>`).join("")}
  </div>

  <div class="dy-sec"><h3>FILES THIS RECORD NAMES · ${d.fileRows.length}</h3>
    ${files(d.fileRows)}
  </div>

  ${d.braces.length ? `<div class="dy-sec"><h3>UNRESOLVED NOTES TO OPS · ${d.braces.length}</h3>
    <table class="dy-t">${d.braces.map(b => `<tr><td${hint(
      "a note in braces is you writing to Ops, never story.",
      `READS  ${b}`)}>{}</td><td>${esc(b)}</td></tr>`).join("")}</table>
    <p class="dy-note">A brace is you writing to Ops, never story. <code>reveal:check</code> refuses
      the packet while one survives.</p></div>` : ""}
</div>`;
}

/* ═══ BUILD ════════════════════════════════════════════════════════════════ */
const days = buildDays();
const { rows: shelf, drop } = buildShelf();

/* the day's own files, big and stretched; the shelf's, small. One cache — the
   key carries the size, so the same file at two sizes is two entries and
   neither can serve the other's request. */
const table = JSON.parse(fs.readFileSync(TABLE, "utf8")).entries;
const wanted = new Set(days.flatMap(d => d.fileRows.map(f => f.web)));
const dayRaws = table.filter(r => {
  if (r.repo !== "museum" || !r.path.startsWith("public/")) return false;
  const web = "/" + r.path.replace(/^public\/held\//, "").replace(/^public\//, "");
  return wanted.has(web);
});

const big = await thumbnails(dayRaws, { fresh: FRESH, px: VIEW_PX, stretch: "auto",
  log: m => console.log(m) });
/* `[SHAPE]` THE VIEWER'S FINAL STEP, AND IT IS ONLY THE DAY'S OWN FILES. */
const zoom = await thumbnails(dayRaws, { fresh: FRESH, px: ZOOM_PX, stretch: "auto",
  log: m => console.log(m) });
const small = await thumbnails(shelf.filter(r => r.mediaKind === "image").map(r => r.raw),
  { fresh: FRESH, stretch: "auto", log: m => console.log(m) });

const byWeb = new Map();
const bigByWeb = new Map();
for (const r of dayRaws) {
  const web = "/" + r.path.replace(/^public\/held\//, "").replace(/^public\//, "");
  const t = big.thumbs.get(r.uid);
  if (t) byWeb.set(web, t);
  const z = zoom.thumbs.get(r.uid);
  if (z) bigByWeb.set(web, z);
}

const calHtml = days.map(d => {
  const ic = icons(d);
  return `<button type="button" data-go="${d.no}" aria-current="false"${hint(
    "a day in this volume. Click it to open that day whole.",
    `READS  Record ${String(d.no).padStart(3, "0")}, ${d.weekday || "no weekday"} ${d.date || "no date"}`)}>
  <div class="d1">RECORD ${String(d.no).padStart(3, "0")}</div>
  <div class="d2">${esc(d.weekday || "")} ${esc(d.date || "")}</div>
  <div class="row">${ic.map(i => `<i class="${i.s}"${hint(i.w, i.r)}>${esc(i.t)}${i.v === "—" ? "" : " " + esc(i.v)}</i>`).join("")}</div>
</button>`;
}).join("");

const pickHtml = SECTIONS.map(s => {
  const items = shelf.filter(r => r.section === s.key);
  if (!items.length) return "";
  return `<div class="sec"><b${hint("a shelf section — how the shelf is divided.",
    `READS  ${s.label}`)}>${esc(s.label)}</b><span${hint(
    "how many things are on the shelf under this section.",
    `READS  ${items.length}`)}>${items.length}</span>
  <div class="g">${items.map(r => {
    const t = small.thumbs.get(r.uid);
    return t
      ? `<img src="${t}" alt="${esc(r.label)}" data-zoomsrc="${esc(r.uid)}"${hint(
          "a thing on the shelf, inlined at the shelf's own size. Click to open the viewer — "
          + "there is no x2 for a shelf picture; the light table is the full-size instrument.",
          `READS  ${r.label}`)}>`
      : `<div class="noimg"${hint("on the shelf, and it is not an image.",
          `READS  ${r.label}`)}></div>`;
  }).join("")}</div></div>`;
}).filter(Boolean).join("");

const body = `
<div class="dy-top"><div class="dy-bar" id="dy-icons"></div></div>

<div class="dy-wrap">
  <details class="dy-panel dy-cal" open>
    <summary${hint("every day in this volume, each with the same six marks as the bar above.",
      `READS  ${days.length} days`)}>THE DAYS · ${days.length}</summary>
    <div class="in">${calHtml}
      <p class="dy-note">Every day, with the same six marks as the bar above.
        A day with no entry is not drawn and is not a defect — which days get a
        Record is decided by which entries exist.</p>
    </div>
  </details>

  <div>
    <div class="dy-nav" style="margin:0 0 10px">
      <button type="button" id="dy-prev"${hint("the day before this one. The left arrow key does the same.",
        "READS  disabled on the first day")}>&lsaquo; previous day</button>
      <button type="button" id="dy-next"${hint("the day after this one. The right arrow key does the same.",
        "READS  disabled on the last day")}>next day &rsaquo;</button>
      <span id="dy-where"${hint("where this day sits in the volume.", "READS  below")}></span>
    </div>
    ${days.map(d => dayHtml(d, byWeb, bigByWeb)).join("\n")}
  </div>

  <details class="dy-panel dy-pick">
    <summary${hint("the shelf — everything that could be attached to a day.",
      `READS  ${shelf.length} things`)}>THE SHELF · ${shelf.length}</summary>
    <div class="in">${pickHtml}
      <p class="dy-note">Piece one shows the shelf and takes no answer from it.
        Attachments are built on <b>assign.html</b> until Piece 4.</p>
    </div>
  </details>
</div>

<div id="dy-view"><div id="dy-vbar">
  <button type="button" id="dy-vx"${hint("close the viewer. Escape does the same.",
    "READS  the viewer is open")}>&times; close</button>
  <button type="button" id="dy-vp"${hint("the previous picture on this day. The left arrow key does the same.",
    "READS  wraps at the first")}>&lsaquo;</button>
  <button type="button" id="dy-vn"${hint("the next picture on this day. The right arrow key does the same.",
    "READS  wraps at the last")}>&rsaquo;</button>
  <button type="button" id="dy-z1"${hint(
    `x1 — the picture at ${VIEW_PX}px, the size the tile itself is inlined at.`,
    `READS  ${VIEW_PX}px on the long side`)}>x1</button>
  <button type="button" id="dy-z2"${hint(
    `x2 — the picture at ${ZOOM_PX}px. It is a SECOND image at twice the size, not the `
    + `${VIEW_PX}px one scaled up, so it shows twice the page.`,
    "READS  set when a picture is open")}>x2</button>
  <span id="dy-vname"></span>
  <span id="dy-vcap"></span>
</div><img id="dy-vimg" alt=""></div>

<script>
"use strict";
/* No backtick in this script: it sits inside a template literal.
   THE PICTURES ARE INLINE. Nothing here resolves a path relative to the page,
   which is the whole point: assign.html and artifacts.html open the full file
   through ../.. and therefore work when double-clicked and 404 when served,
   and OPERATIONS section 8 obliges Ops to serve.
   AND THAT INCLUDES x2. BIG is a second set of inline pictures at ZOOM_PX,
   keyed by the same public address the tile carries, so the viewer's final
   step resolves no path either. */
var DAYS = ${JSON.stringify(days.map(d => ({ no: d.no, date: d.date, weekday: d.weekday })))};
var ICONS = ${JSON.stringify(Object.fromEntries(days.map(d => [d.no, icons(d)])))};
var BIG = ${JSON.stringify(Object.fromEntries(bigByWeb))};
var HINT_Z2 = ${JSON.stringify(`x2 — the picture at ${ZOOM_PX}px. It is a SECOND image at twice `
  + `the size, not the ${VIEW_PX}px one scaled up, so it shows twice the page.`)};
var HINT_Z2_OFF = ${JSON.stringify("x2 — there is no x2 for this picture. Only the day's own "
  + "files are inlined twice; the light table is the full-size instrument for everything else.")};
var HINT_IMG = ${JSON.stringify("the picture, at the viewer's current step. Click it to go to the "
  + "next step; its final step is x2.")};
var i = 0, VIEW = null, Z = 1;

/* every mark says what it means and what it read — two lines, one function,
   the same shape the generator uses. */
function hint(el, means, read){
  el.setAttribute("title", read ? means + "\\n" + read : means);
}
function hintAttr(means, read){
  var s = read ? means + "\\n" + read : means;
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function show(n){
  var k = DAYS.findIndex(function(d){ return d.no === n; });
  if (k < 0) return;
  i = k;
  document.querySelectorAll(".dy-day").forEach(function(el){
    el.hidden = Number(el.getAttribute("data-day")) !== n;
  });
  document.querySelectorAll(".dy-cal button").forEach(function(b){
    b.setAttribute("aria-current", Number(b.getAttribute("data-go")) === n ? "true" : "false");
  });
  var bar = document.getElementById("dy-icons");
  bar.innerHTML = (ICONS[n]||[]).map(function(o){
    return '<span class="dy-ic ' + o.s + '" title="' + hintAttr(o.w, o.r) + '">'
      + '<b>' + o.t + '</b>' + o.v + '</span>';
  }).join("") + '<span class="dy-nav" id="dy-navspare"></span>';
  document.getElementById("dy-prev").disabled = i === 0;
  document.getElementById("dy-next").disabled = i === DAYS.length - 1;
  var where = document.getElementById("dy-where");
  where.textContent = (i+1) + " of " + DAYS.length;
  hint(where, "where this day sits in the volume.",
    "READS  day " + (i+1) + " of " + DAYS.length);
  try { history.replaceState(null, "", "#" + n); } catch(e){}
}
function step(d){ var k = i + d; if (k >= 0 && k < DAYS.length) show(DAYS[k].no); }

/* the viewer — inline pictures, two steps, no path anywhere.
   THE LIST IS DEDUPED BY ADDRESS. A file inside an attachment is drawn again in
   the day's file list, and the same picture twice in a walk is a walk that
   lies about how many pages there are. */
function shots(){
  var day = document.querySelector('.dy-day[data-day="' + DAYS[i].no + '"]');
  if (!day) return [];
  var seen = {}, out = [];
  [].slice.call(day.querySelectorAll("img[data-zoom]")).forEach(function(el){
    var k = el.getAttribute("data-zoom");
    if (seen[k]) return;
    seen[k] = 1; out.push(el);
  });
  return out;
}
function openView(el){
  var list = shots(), key = el.getAttribute("data-zoom"), k = 0;
  for (var j = 0; j < list.length; j++) {
    if (list[j].getAttribute("data-zoom") === key) { k = j; break; }
  }
  VIEW = { list: list, k: k };
  draw(); document.getElementById("dy-view").className = "on";
}
function draw(){
  if (!VIEW || !VIEW.list.length) return;
  var el = VIEW.list[VIEW.k];
  var key = el.getAttribute("data-zoom");
  var big = (key && BIG[key]) ? BIG[key] : null;
  if (Z === 2 && !big) Z = 1;
  var img = document.getElementById("dy-vimg");
  img.src = (Z === 2 && big) ? big : el.getAttribute("src");
  img.alt = el.getAttribute("alt") || "";
  hint(img, HINT_IMG, "READS  step x" + Z + (big ? "" : ", and x2 is not held for this one"));
  var fig = el.closest(".dy-file");
  var nm = fig && fig.querySelector(".n") ? fig.querySelector(".n").textContent
    : (el.getAttribute("alt") || "");
  var cap = fig && fig.querySelector(".cap") ? fig.querySelector(".cap").textContent : "";
  document.getElementById("dy-vname").textContent =
    nm + "   (" + (VIEW.k+1) + " of " + VIEW.list.length + ")";
  document.getElementById("dy-vcap").textContent = cap;
  var b2 = document.getElementById("dy-z2");
  document.getElementById("dy-z1").setAttribute("aria-pressed", Z === 1 ? "true" : "false");
  b2.setAttribute("aria-pressed", Z === 2 ? "true" : "false");
  b2.disabled = !big;
  hint(b2, big ? HINT_Z2 : HINT_Z2_OFF,
    big ? "READS  available for this picture" : "READS  not held for this picture");
}
function zoomTo(z){ Z = z; draw(); }
function vstep(d){ if(!VIEW) return; VIEW.k = (VIEW.k + d + VIEW.list.length) % VIEW.list.length; draw(); }
function closeView(){ document.getElementById("dy-view").className = ""; VIEW = null; }

document.addEventListener("click", function(ev){
  var t = ev.target;
  if (t && t.id === "dy-vimg") { zoomTo(Z === 1 ? 2 : 1); return; }
  var g = t.closest && t.closest("[data-go]");
  if (g) { show(Number(g.getAttribute("data-go"))); return; }
  var z = t.closest && t.closest("img[data-zoom]");
  if (z) { Z = 1; openView(z); return; }
  var p = t.closest && t.closest("img[data-zoomsrc]");
  if (p) { Z = 1; VIEW = { list: [p], k: 0 };
    draw(); document.getElementById("dy-view").className = "on"; return; }
});
document.getElementById("dy-prev").addEventListener("click", function(){ step(-1); });
document.getElementById("dy-next").addEventListener("click", function(){ step(1); });
document.getElementById("dy-vx").addEventListener("click", closeView);
document.getElementById("dy-vp").addEventListener("click", function(){ vstep(-1); });
document.getElementById("dy-vn").addEventListener("click", function(){ vstep(1); });
document.getElementById("dy-z1").addEventListener("click", function(){ zoomTo(1); });
document.getElementById("dy-z2").addEventListener("click", function(){ zoomTo(2); });
document.addEventListener("keydown", function(e){
  if (VIEW) {
    if (e.key === "Escape") closeView();
    else if (e.key === "ArrowLeft") vstep(-1);
    else if (e.key === "ArrowRight") vstep(1);
    return;
  }
  if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
  if (e.key === "ArrowLeft") step(-1);
  else if (e.key === "ArrowRight") step(1);
});

var want = Number(String(location.hash || "").replace("#","")) || DAYS[0].no;
show(DAYS.some(function(d){ return d.no === want; }) ? want : DAYS[0].no);
</script>
`;

fs.writeFileSync(OUT, page({ title: "The day", css: CSS, body, favi: "\u{1F5D3}" }));

console.log(`\nwrote ${path.relative(REPO, OUT)}`);
console.log(`  ${days.length} days`);
days.forEach(d => {
  const ic = icons(d);
  const bad = ic.filter(x => x.s === "bad").length, warn = ic.filter(x => x.s === "warn").length;
  const lines = d.sections.reduce((a, s) => a + s.lines, 0);
  console.log(`     ${String(d.no).padStart(3, "0")}  ${d.date}  ${d.sections.length} section(s) / `
    + `${lines} line(s), ${d.docs.length} attachment(s), ${d.fileRows.length} file(s)`
    + (bad ? `  \u2014 ${bad} red` : "") + (warn ? `, ${warn} amber` : ""));
});
console.log(`  the day's pictures: ${VIEW_PX}px, ${big.made} made, ${big.hits} cached, `
  + `${big.stretched} contrast-stretched`);
console.log(`  the viewer's x2 step: ${ZOOM_PX}px, ${zoom.made} made, ${zoom.hits} cached, `
  + `${zoom.stretched} contrast-stretched`);
console.log(`  the shelf: ${shelf.length} rows, ${small.made} made, ${small.hits} cached, `
  + `${small.stretched} contrast-stretched`);
console.log(`  not shown on the shelf: ${drop.ruled} ruled out, ${drop.neverPublished} never published, `
  + `${drop.absent} with no file, ${drop.superseded + drop.elsewhere} robots-repo rows`);
console.log(`\nserve it \u2014 the viewer is inline, so a served page works:`);
console.log(`  npm run mock 8931   \u2192  http://127.0.0.1:8931/dictation-20260807/day.html`);
