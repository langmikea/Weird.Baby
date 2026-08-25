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
   It shows the thing, and it takes his answer. The answer is ON the tile — ONE
   button, add or remove — because the decision is which pages belong together.
   Setting a mode in one corner and then clicking in another was a mechanism he
   had to learn before he could say anything, and that rule still governs.

   [2026-08-25] IT WAS FIVE NUMBERED BUTTONS, ONE PER RECORD, "because the day
   is the decision". The day is not the decision; see the 2026-08-25 block at
   the foot of this header. The sentence is corrected here rather than left
   standing, because a header describing a surface that no longer exists is how
   the next round rebuilds the thing that was replaced.

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

   ═══════════════════════════════════════════════════════════════════════════
   [2026-08-25] IT CAPTURES AN ATTACHMENT, NOT A DAY — AND A LATER ROUND MUST
   NOT SIMPLIFY IT BACK INTO A DAY-PICKER.
   ═══════════════════════════════════════════════════════════════════════════
   MIKE RULED IT: he names the attachment while he picks the pictures. Title and
   files are born in one act.

   ── WHY, AND IT IS A RULING HE ALREADY MADE ────────────────────────────────
   This page used to ask WHICH DAY. That is the wrong question, and the museum
   has already paid for the right one. On 2026-08-16 his workbook's two
   ATTACHMENTS lines — `View of the portal screen` and `Manual ref to Portal` —
   landed on Record 004 as `docs` rows carrying a title and nothing else. On
   2026-08-20 HE STRUCK THEM BOTH: *"Remove the docs field entirely. The
   ATTACHMENTS 2 badge goes with it."* The reasoning is at the site in
   `src/data/artists/robots-record.js` and it is Ruling 9's own shape —

       "the Record may withhold and the Record may not promise."

   A title with no files behind it is a promise. `docState()` resolves a row
   with no plates to `held`, which draws **not here yet**; and one of the two
   named a scan Record 003 had ALREADY DELIVERED, so Thursday would have said
   the museum lacks a thing it showed on Wednesday.

   THIS SURFACE MAKES THAT FAILURE IMPOSSIBLE RATHER THAN FORBIDDEN. A title
   cannot exist here without the files it names, because naming is what CLOSES
   a set that already has files in it. There is no order of operations that
   produces an empty `docs` row. **A day-picker cannot make that guarantee —
   it captures (day, file) and leaves the title to be paired afterwards, which
   is the thing that has to be invented.**

   ── AND THE ORDERING PROBLEM GOES WITH IT ──────────────────────────────────
   The old `STATE[day]` was a list per day built by `setDay` filtering an id out
   of every day and PUSHING it, so it recorded LAST-CLICK ORDER. Reading that as
   intent is reading click history. Worse, it could not express what a `docs`
   row needs: ruling 12 (2026-08-19) says an attachment is *the set of pages
   that were filmed together because they belong together* — Record 003 is four
   titles over six files, grouped 2/2/1/1, with one page in two scans. No
   positional zip can produce that. **Grouping is now the thing he is doing,
   not something a writer infers later.**

   ORDER IS REAL INSIDE A SET and is captured: plates render in array order, so
   the working set is shown in order with move-up / move-down. Order ACROSS
   sets never meant anything and is not recorded.

   ── THE GUARD THAT WOULD HAVE CAUGHT THE STRUCK ROW ────────────────────────
   A tile the chosen entry ALREADY delivers is greyed and cannot be added, from
   `already` in `buildDays()` (the entry's own `assets`, which this file has
   carried since it was written and never drew). That is exactly the check that
   would have stopped `Manual ref to Portal` naming Wednesday's scan on
   Thursday. Changing the Record re-asks the question and takes an offending
   file OFF the bench with a banner rather than leaving it sitting there looking
   chosen.

   **ITS POPULATION IS EMPTY TODAY AND A CLEAN RUN THEREFORE PROVES NOTHING.**
   Measured on the built page 2026-08-25: the seven paths `delivered()` returns
   have NO TILE — the shelf's `supersededBy` filter drops all seven, so the
   guard cannot fire against anything currently on the shelf. **It was proved by
   injection instead** (a delivered path pushed into `ALREADY` at runtime: the
   button went disabled, the row said *already in this Record*, the click was
   refused, and switching Record swept it off the bench). This is the orphan
   check's own defect one room over — `--orphans` counted a population that was
   empty by construction and read 0 for its whole life — so the emptiness is
   written down here rather than discovered later by somebody who trusts a green
   run. The day a delivered file is also on the shelf, this guard is load-bearing
   and untested in the wild.

   ── WHAT IT STILL DOES NOT DO, ON PURPOSE ──────────────────────────────────
   NOTHING HERE WRITES TO THE TREE. The capture is `wb.assign.v2` in the browser
   plus a file he can hand over; the writer that lands it into
   `record-draft.json` is a separate step and is not built. Ops wanted the
   surface in his hands first.

   IT EMITS NO `source` AND NO `pages`. The register files both as Ops wiring,
   and `pages` counts PAGES rather than FILES — ruling 12's one-page-in-two-
   scans case is why those are not the same number. A plate needs no `label`
   either: `RecordAttachments.jsx` falls back to the file's own name, *"a fact
   rather than a caption Ops made up for the row."*

   ── THE OLD CAPTURE IS NOT MIGRATED ────────────────────────────────────────
   `wb.assign.week1.v1` stands as a record and this page does not read it. It
   holds 22 ids, 18 of them in the older `repo:path` vocabulary naming files in
   the ROBOTS repo. Translating them to `/robots/manual/page-NN.png` is not a
   lookup: the museum's copy is a DIFFERENT FILE — page-01 is sha `af4abdef0832`
   at 1,926,945 bytes here against `6d0276faa168` at 2,218,869 bytes there — so
   re-pointing decides which file the museum shows, which is Mike's call and not
   a migration. **All 22 ids are banked, resolved one by one, in
   `C:\AI\_night-20260825\BROWSER_RESCUE-20260825.md`.** Re-picking them costs
   one sitting and carries no inference, and under this surface he would be
   doing something different anyway — grouping pages into named attachments
   rather than dropping loose files onto days.

   ── THE STORY EVENTS ARE NOT PART OF THIS JOB ──────────────────────────────
   They are still listed, because what the museum is holding is worth seeing,
   and they no longer take an answer here. A story event's day is `when:` on its
   ledger row and `npm run reveal:cards` already asks for it one card at a time.

   > **[FLAG 2026-08-25 · stated, not fixed] `when`'s UNIT IS UNDECIDED IN PROSE
   > AND DECIDED AS A WEEK BY ITS ONLY READER.** `reveal/README.md` defines it as
   > *"the story day or week it becomes available"*; `tools/reveal-ledger.mjs`
   > asks *"what day something comes out"* and prints a section headed ASSETS
   > CLUSTERING ON ONE DAY. The one consumer in the tree is
   > `reveal/transfers.mjs`, which does `typeof r.when === "number"` and compares
   > it to a transfer WEEK. A day written into it would be compared against a
   > week and fault silently. All 176 rows are null, so the ambiguity has never
   > been paid for — it will be paid by whoever answers the first card. Not
   > fixed here: this file writes no `when` and never did.
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
/* SPENT — in a closed attachment, or already delivered by the chosen Record.
   Dimmed rather than hidden: a thing he cannot pick twice is still a thing the
   museum holds, and removing it from the shelf would answer a question he did
   not ask (Doctrine 24 runs the other way — nothing left his view). */
figure.as-card.as-off,.as-row.as-off{opacity:.4}
.as-row .as-lab{flex:0 0 165px;font-size:12px;line-height:1.35}
.as-row audio{height:32px;flex:1 1 auto;min-width:150px;max-width:330px}
.as-row.as-evt .as-lab{flex:1 1 auto}

/* THE ANSWER — five buttons, on the thing itself (A5) */
.as-pick{display:flex;gap:3px;align-items:center;flex:0 0 auto}
figure.as-card .as-pick{padding:2px 7px 7px}
.as-pick b{font-size:9.5px;opacity:.45;margin-right:3px;font-weight:400;letter-spacing:.04em}
.as-pick button{font-family:inherit;font-size:11px;line-height:1;padding:4px 9px;
  cursor:pointer;background:transparent;border:1px solid var(--rule,#3a3529);
  color:inherit;border-radius:2px;letter-spacing:.05em}
.as-pick button:hover{border-color:var(--gold,#b8974a)}
.as-pick button[aria-pressed=true]{background:var(--gold,#b8974a);
  border-color:var(--gold,#b8974a);color:#17150f;font-weight:700}
.as-pick button[disabled]{opacity:.3;cursor:default;border-style:dashed}
.as-pick button[disabled]:hover{border-color:var(--rule,#3a3529)}
.as-has{font-size:9.5px;opacity:.5;font-style:italic}
.as-undesc{display:block;font-size:10px;opacity:.45;font-style:italic;margin-top:2px}

/* ═══ THE COMPOSER ═══ */
.as-comp{border:1px solid var(--gold,#b8974a);border-radius:2px;margin:0 0 14px;padding:10px 11px}
.as-comp h3{margin:0 0 3px;font-size:12.5px;letter-spacing:.04em}
.as-hint{font-size:10.5px;opacity:.62;line-height:1.45;margin:0 0 8px}
ol.as-set{list-style:none;margin:0;padding:0;counter-reset:pg}
ol.as-set li{counter-increment:pg;font-size:10.5px;line-height:1.35;padding:4px 0;
  border-top:1px solid #2a2620;display:flex;gap:5px;align-items:center}
ol.as-set li::before{content:counter(pg);opacity:.45;flex:0 0 auto;min-width:11px}
ol.as-set li span.nm{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;
  white-space:nowrap}
ol.as-set li button{font-family:inherit;font-size:10px;line-height:1;padding:2px 4px;
  cursor:pointer;background:transparent;border:1px solid var(--rule,#3a3529);
  color:inherit;border-radius:2px;flex:0 0 auto}
ol.as-set li button:hover{border-color:var(--gold,#b8974a)}
ol.as-set li button[disabled]{opacity:.25;cursor:default}
.as-fld{display:block;margin:8px 0 0;font-size:10.5px;opacity:.8}
.as-fld span{display:block;margin:0 0 3px;letter-spacing:.04em;opacity:.7}
.as-fld input,.as-fld select{width:100%;box-sizing:border-box;font-family:inherit;
  font-size:11.5px;padding:5px 6px;background:transparent;color:inherit;
  border:1px solid var(--rule,#3a3529);border-radius:2px}
.as-fld input:focus,.as-fld select:focus{outline:none;border-color:var(--gold,#b8974a)}
#as-close{margin:9px 0 0;font-family:inherit;font-size:11.5px;padding:6px 12px;
  cursor:pointer;background:transparent;border:1px solid var(--rule,#3a3529);
  color:inherit;border-radius:2px;width:100%}
#as-close:hover:not([disabled]){border-color:var(--gold,#b8974a)}
#as-close[disabled]{opacity:.35;cursor:default}
.as-why{font-size:10px;opacity:.6;line-height:1.4;margin:6px 0 0;min-height:1.3em;font-style:italic}
.as-att{margin:7px 0 0;padding:6px 7px;border:1px solid #2a2620;border-radius:2px}
.as-att .t{font-size:11px;line-height:1.35}
.as-att .f{font-size:9.5px;opacity:.55;line-height:1.4;margin:2px 0 0}
.as-att .r{margin:4px 0 0;display:flex;gap:5px}
.as-att button{font-family:inherit;font-size:9.5px;line-height:1;padding:3px 6px;
  cursor:pointer;background:transparent;border:1px solid var(--rule,#3a3529);
  color:inherit;border-radius:2px}
.as-att button:hover{border-color:var(--gold,#b8974a)}

/* the five days */
.as-rail{position:sticky;top:74px;max-height:calc(100vh - 88px);overflow-y:auto}
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
/* ONE CONTROL PER TILE. It joins the working set or leaves it; there is no
   second mode to learn and nothing to set in another corner first — the J6
   rule this page was rebuilt under. `aria-pressed` carries the state and the
   paint reads it back, so a tile cannot look chosen while the model disagrees.
   DISABLED means the entry now chosen already delivers this file. */
const PICK = id => `<div class="as-pick" data-for="${esc(id)}"
  ><button type="button" data-add aria-pressed="false">add</button
  ><span class="as-has" hidden>already in this Record</span></div>`;

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

/* [2026-08-25] A STORY EVENT TAKES NO ANSWER HERE AND IS STILL SHOWN. Its day
   is `when:` on its ledger row and `npm run reveal:cards` asks for it properly,
   one card at a time. Leaving the row visible keeps what the museum is holding
   in view; leaving a control on it would take an answer nothing reads. */
const eventRow = r => `<div class="as-row as-evt" data-id="${esc(r.id)}" data-nm="${esc(r.label)}">
  <div class="as-lab">${esc(r.label)}</div>
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

/* THE COMPOSER — the whole of the change, in one panel. Pick tiles, order them,
   name the set, choose the Record, close it. The title field is LAST in reading
   order and the close button is under it, so the only path through is
   files → name → entry, which is why an empty `docs` row cannot be built. */
const composerHtml = `<div class="as-comp">
  <h3>THE ATTACHMENT YOU ARE BUILDING</h3>
  <p class="as-hint">Pick the pages that were filmed together. Then name the set
    and say which Record carries it.</p>
  <ol class="as-set" data-set></ol>
  <p class="as-none" data-setnone>Nothing picked yet.</p>
  <label class="as-fld"><span>What is it?</span>
    <input type="text" id="as-title" spellcheck="false" autocomplete="off"
      placeholder="e.g. Scan 07 - Power supply and distribution"></label>
  <label class="as-fld"><span>Which Record?</span>
    <select id="as-no">
      <option value="">&mdash; choose &mdash;</option>
      ${days.map(d => `<option value="${d.no}">RECORD ${String(d.no).padStart(3, "0")} &middot; ${esc(d.weekday)} ${esc(d.date)}</option>`).join("")}
    </select></label>
  <button type="button" id="as-close">Close this attachment</button>
  <p class="as-why" id="as-why"></p>
</div>`;

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
    <span class="dim">open a section, add the pages that belong together, then name the set</span>
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
  <div class="as-rail">${composerHtml}${dayHtml}</div>
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
/* [2026-08-25] A NEW KEY, AND THE OLD ONE IS LEFT WHERE IT IS. No backtick in
   this script: it sits inside a template literal and one would close it.
   wb.assign.week1.v1 holds the day-keyed capture and this page never reads it.
   Its 22 ids are banked and resolved in
   C:\\AI\\_night-20260825\\BROWSER_RESCUE-20260825.md, 18 of them naming files
   in the ROBOTS repo whose museum counterpart is a different file. Translating
   them would decide which file the museum shows, which is Mike's call and not
   a migration. */
var KEY = "wb.assign.v2";
var OLDKEY = "wb.assign.week1.v1";
var STATE = { open:{ files:[], title:"", no:null }, done:[] };
var VIEW = null, ZOOM = null;

function banner(t){var b=document.getElementById("as-banner");b.innerHTML=t;b.className=t?"as-on":"";}
var OK = true;
function save(){
  if(!OK) return;
  try{ localStorage.setItem(KEY, JSON.stringify(STATE)); }
  catch(e){ OK=false; banner("<b>THIS BROWSER WILL NOT LET THE PAGE REMEMBER ANYTHING.</b> Your choices are on the screen and in the text at the foot of the page, but they will be gone if you close this tab. Open <b>the text to hand to Ops</b> and copy it first."); }
}
function load(){
  try{
    var raw=localStorage.getItem(KEY);
    if(raw){
      var p=JSON.parse(raw)||{};
      STATE={ open:{ files:(p.open&&p.open.files)||[], title:(p.open&&p.open.title)||"",
                     no:(p.open&&p.open.no)||null },
              done:Array.isArray(p.done)?p.done:[] };
    }
  }
  catch(e){ OK=false; banner("<b>THIS BROWSER WILL NOT LET THE PAGE REMEMBER ANYTHING.</b> Nothing was lost \\u2014 there was nothing saved to read."); }
}
function cssq(s){ return String(s).replace(/["\\\\]/g,"\\\\$&"); }
function nameOf(id){
  var n=document.querySelector('[data-id="'+cssq(id)+'"]');
  return n?n.getAttribute("data-nm"):id;
}
function inSet(id){ return STATE.open.files.indexOf(id)>=0; }
/* an id already spoken for by a CLOSED attachment. Two attachments naming one
   file would put the same picture on the page twice under two names. */
function heldBy(id){
  for(var i=0;i<STATE.done.length;i++)
    if(STATE.done[i].files.indexOf(id)>=0) return STATE.done[i];
  return null;
}
/* what the chosen Record ALREADY delivers, off the entry's own assets. This is
   the check that would have caught "Manual ref to Portal" naming Wednesday's
   scan on Thursday. */
function alreadyIn(no,id){
  if(!no) return false;
  var a=ALREADY[String(no)]||[];
  return a.indexOf(id)>=0;
}

/* THE ONE ACTION ON A TILE. It joins the set being built, or it leaves it. */
function toggle(id){
  if(inSet(id)) STATE.open.files=STATE.open.files.filter(function(x){return x!==id;});
  else {
    if(heldBy(id)||alreadyIn(STATE.open.no,id)) return;
    STATE.open.files.push(id);
  }
  save(); paint();
}
/* ORDER IS REAL INSIDE A SET — plates render in array order. */
function move(id,d){
  var i=STATE.open.files.indexOf(id), j=i+d;
  if(i<0||j<0||j>=STATE.open.files.length) return;
  var f=STATE.open.files;
  var t=f[i]; f[i]=f[j]; f[j]=t;
  save(); paint();
}
/* CLOSING IS WHAT MAKES THE TITLE AND THE FILES ONE ACT. It refuses an empty
   set and an unnamed one, so there is no order of operations that produces a
   docs row with nothing behind it. */
function closeSet(){
  var t=(STATE.open.title||"").trim();
  if(!STATE.open.files.length||!t||!STATE.open.no) return;
  STATE.done.push({ no:Number(STATE.open.no), title:t, files:STATE.open.files.slice() });
  STATE.open={ files:[], title:"", no:STATE.open.no };
  document.getElementById("as-title").value="";
  save(); paint();
}
function dropAtt(i){ STATE.done.splice(i,1); save(); paint(); }
/* REOPEN puts a closed attachment back on the bench whole. It refuses while
   something is being built, because merging two sets silently is how a page
   loses a choice. */
function reopenAtt(i){
  if(STATE.open.files.length||(STATE.open.title||"").trim()) return;
  var a=STATE.done.splice(i,1)[0];
  STATE.open={ files:a.files.slice(), title:a.title, no:a.no };
  document.getElementById("as-title").value=a.title;
  save(); paint();
}

function paint(){
  var no=STATE.open.no;

  document.querySelectorAll(".as-pick").forEach(function(p){
    var id=p.getAttribute("data-for");
    var b=p.querySelector("button"), has=p.querySelector(".as-has");
    var mine=inSet(id), held=heldBy(id), dlv=alreadyIn(no,id);
    b.setAttribute("aria-pressed", mine?"true":"false");
    b.textContent = mine ? "remove" : "add";
    b.disabled = !mine && (!!held || dlv);
    has.hidden = !(dlv||held);
    if(dlv) has.textContent="already in this Record";
    else if(held) has.textContent="in \\u201c"+held.title+"\\u201d";
    var host=p.closest("figure.as-card")||p.closest(".as-row");
    if(host){ host.classList.toggle("as-on", mine); host.classList.toggle("as-off", b.disabled); }
  });

  /* the bench */
  var ol=document.querySelector("[data-set]"); ol.innerHTML="";
  STATE.open.files.forEach(function(id,i){
    var li=document.createElement("li");
    li.innerHTML='<span class="nm">'+nameOf(id)+'</span>'
      +'<button type="button" data-up="'+id.replace(/"/g,"&quot;")+'"'+(i===0?" disabled":"")+'>\\u2191</button>'
      +'<button type="button" data-dn="'+id.replace(/"/g,"&quot;")+'"'+(i===STATE.open.files.length-1?" disabled":"")+'>\\u2193</button>'
      +'<button type="button" data-off="'+id.replace(/"/g,"&quot;")+'">\\u00d7</button>';
    ol.appendChild(li);
  });
  document.querySelector("[data-setnone]").hidden = STATE.open.files.length>0;

  var sel=document.getElementById("as-no");
  if(sel.value!==(no?String(no):"")) sel.value = no?String(no):"";
  var t=(STATE.open.title||"").trim();
  var ready=STATE.open.files.length>0 && !!t && !!no;
  document.getElementById("as-close").disabled=!ready;
  document.getElementById("as-why").textContent = ready ? ""
    : !STATE.open.files.length ? "Add the pages first."
    : !t ? "Name it."
    : "Say which Record carries it.";

  /* the closed attachments, under their Record */
  document.querySelectorAll(".as-day").forEach(function(el){
    var n=Number(el.getAttribute("data-no"));
    var ul=el.querySelector("ul"); ul.innerHTML="";
    var any=false;
    STATE.done.forEach(function(a,i){
      if(a.no!==n) return;
      any=true;
      var li=document.createElement("li");
      li.innerHTML='<div class="as-att"><div class="t">'+a.title+'</div>'
        +'<div class="f">'+a.files.length+' file'+(a.files.length===1?"":"s")+' \\u00b7 '
        +a.files.map(nameOf).join(" \\u00b7 ")+'</div>'
        +'<div class="r"><button type="button" data-re="'+i+'">reopen</button>'
        +'<button type="button" data-del="'+i+'">remove</button></div></div>';
      ul.appendChild(li);
    });
    if(!any){
      var li0=document.createElement("li");
      li0.innerHTML='<span class="as-none">no attachment yet</span>';
      ul.appendChild(li0);
    }
  });

  /* a CLOSED section still says how much of it he has spent, or he would have
     to open all eleven to find out */
  document.querySelectorAll("details.as-sec").forEach(function(sec){
    var mine=0;
    sec.querySelectorAll(".as-pick").forEach(function(p){
      var id=p.getAttribute("data-for");
      if(inSet(id)||heldBy(id)) mine++;
    });
    sec.querySelector(".as-mine").textContent = mine ? "\\u00b7 " + mine + " used" : "";
  });

  var nf=0; STATE.done.forEach(function(a){ nf+=a.files.length; });
  document.getElementById("as-cnt").textContent = STATE.done.length
    ? " \\u00b7 " + STATE.done.length + " attachment" + (STATE.done.length===1?"":"s")
      + ", " + nf + " file" + (nf===1?"":"s") : "";
  writeOut();
}

/* THE CAPTURE. The object at the foot is the docs row the lander already
   reads, minus the two fields that are Ops' wiring: no source, and no pages
   — pages counts PAGES, not FILES, and ruling 12's one-page-in-two-scans case
   is why those are not the same number. A plate needs no label either;
   RecordAttachments.jsx falls back to the file's own name. */
function writeOut(){
  var L=["THE RECORD'S ATTACHMENTS \\u2014 what each one is, and what is in it",
         "written "+new Date().toISOString().slice(0,16).replace("T"," "),""];
  DAYS.forEach(function(d){
    var mine=STATE.done.filter(function(a){return a.no===d.no;});
    L.push("RECORD "+("00"+d.no).slice(-3)+"  "+d.weekday+" "+d.date
      +(d.title?"  \\u2014 "+d.title.split("\\n")[0]:""));
    if(!mine.length) L.push("    (no attachment)");
    mine.forEach(function(a){
      L.push("    "+a.title);
      a.files.forEach(function(id,i){ L.push("       "+(i+1)+". "+nameOf(id)+"  ["+id+"]"); });
    });
    L.push("");
  });
  if(STATE.open.files.length){
    L.push("STILL ON THE BENCH, NOT CLOSED \\u2014 it is not in the object below");
    L.push("    "+((STATE.open.title||"").trim()||"(unnamed)")
      +(STATE.open.no?"  \\u2014 for Record "+("00"+STATE.open.no).slice(-3):"  \\u2014 no Record chosen"));
    STATE.open.files.forEach(function(id,i){ L.push("       "+(i+1)+". "+nameOf(id)); });
    L.push("");
  }
  L.push("--- for Ops ---");
  L.push(JSON.stringify({
    _: "attachments, picked on assign.html. Titles and files are Mike's, chosen together.",
    key: KEY,
    saved: new Date().toISOString(),
    attachments: STATE.done.map(function(a){
      return { no:a.no, title:a.title, files:a.files.slice() };
    })
  },null,1));
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
    +'<button type="button" data-add aria-pressed="false">add</button>'
    +'<span class="as-has" hidden></span></div>';
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
load();
document.getElementById("as-title").value=STATE.open.title||"";
paint();

document.addEventListener("click", function(ev){
  var t=ev.target;
  var b=t.closest && t.closest(".as-pick button");
  if(b){ if(!b.disabled) toggle(b.closest(".as-pick").getAttribute("data-for")); return; }
  var up=t.closest && t.closest("[data-up]");
  if(up){ move(up.getAttribute("data-up"),-1); return; }
  var dn=t.closest && t.closest("[data-dn]");
  if(dn){ move(dn.getAttribute("data-dn"),1); return; }
  var off=t.closest && t.closest("[data-off]");
  if(off){ toggle(off.getAttribute("data-off")); return; }
  var re=t.closest && t.closest("[data-re]");
  if(re){ reopenAtt(Number(re.getAttribute("data-re"))); return; }
  var del=t.closest && t.closest("[data-del]");
  if(del){ dropAtt(Number(del.getAttribute("data-del"))); return; }
  var z=t.closest && t.closest("[data-zoom]");
  if(z){ openView(z.getAttribute("data-zoom")); return; }
});

document.getElementById("as-title").addEventListener("input", function(){
  STATE.open.title=this.value; save(); paint();
});
/* CHANGING THE RECORD RE-ASKS THE ALREADY-DELIVERS QUESTION, and a file the new
   Record already carries is taken off the bench rather than left sitting there
   looking chosen. It is reported, never silent. */
document.getElementById("as-no").addEventListener("change", function(){
  STATE.open.no=this.value?Number(this.value):null;
  var drop=STATE.open.files.filter(function(id){ return alreadyIn(STATE.open.no,id); });
  if(drop.length){
    STATE.open.files=STATE.open.files.filter(function(id){ return drop.indexOf(id)<0; });
    banner("<b>"+drop.length+" file"+(drop.length===1?"":"s")+" came off the bench</b> \\u2014 that Record already delivers "
      +drop.map(nameOf).join(", ")+". A Record cannot attach what it has already shown.");
  } else banner("");
  save(); paint();
});
document.getElementById("as-close").addEventListener("click", closeSet);

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
  a.download="attachments.txt"; document.body.appendChild(a); a.click(); a.remove();
  document.getElementById("as-msg").textContent="Saved as attachments.txt \\u2014 look in your Downloads folder.";
});
document.getElementById("as-clr").addEventListener("click", function(){
  STATE={ open:{ files:[], title:"", no:null }, done:[] };
  document.getElementById("as-title").value="";
  save(); paint();
  document.getElementById("as-msg").textContent="Every choice cleared.";
});
</script>
`;

/* [2026-08-25] `ALREADY` IS THE ENTRY'S OWN ASSETS, AND IT IS DRAWN NOW.
   `buildDays()` has carried it since this file was written and nothing read it.
   It is what greys a tile the chosen Record already delivers — the check that
   would have caught `Manual ref to Portal` naming Wednesday's scan on Thursday.
   Keyed by record number as a string, because that is how it is looked up. */
const inject = `<script>var DAYS = ${JSON.stringify(days.map(d =>
  ({ no: d.no, date: d.date, weekday: d.weekday, title: d.title })))};
var ALREADY = ${JSON.stringify(Object.fromEntries(days.map(d => [String(d.no), d.already])))};</script>`;

fs.writeFileSync(OUT, page({ title: "Week one", css: CSS, body: inject + body, favi: "🗓" }));

console.log(`\nwrote ${path.relative(REPO, OUT)}`);
console.log(`  ${rows.length} things to show, in ${SECTIONS.filter(s => rows.some(r => r.section === s.key)).length} sections:`);
SECTIONS.forEach(s => {
  const n = rows.filter(r => r.section === s.key).length;
  if (n) console.log(`     ${String(n).padStart(3)}  ${s.label}  — drawn as ${s.kind}`);
});
console.log(`  ${events.length} story events, in ${evtKeys.length} sections`);
console.log(`  labels: ${rows.length - nUndesc} readable, ${nUndesc} with nothing but a filename`);
console.log(`  not shown: ${drop.ruled} ruled out or signage, ${drop.neverPublished} never published, `
  + `${drop.absent} with no file, `
  + `${notBuilt} not built, ${drop.superseded + drop.elsewhere} robots-repo rows`);
console.log(`  thumbnails: ${hits} cached, ${made} made, ${failed} could not be read`);
console.log(`  delivered by the Record today: ${Object.keys(del || {}).length}`);
console.log(`\nopen it by double-clicking:  docs\\dictation-20260807\\assign.html`);
