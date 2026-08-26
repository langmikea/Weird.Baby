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

   ── WHAT MIKE CHANGED AFTER DRIVING IT, 2026-08-25 ─────────────────────────
   TWO PASSES IN ONE DAY, FIFTEEN RULINGS, AND EVERY ONE OF THEM IS SHAPE OR
   SUBTRACTION. The rulings are recorded where they bind — each one is written
   at the code it governs, not collected here — because a list at the top of a
   file is the same defect as a briefing at the top of a page. What follows is
   the map: what changed, and which block argues it.

   PASS ONE, and four of these are pure subtraction:
     · EVERY ICON AND EVERY MARK SAYS WHAT IT MEANS AND WHAT IT READ — `hint()`.
     · SHOW THE TEXT, NEVER DESCRIBE IT. The page said *"1 paragraph"* where the
       paragraph fits, and dropped the plate labels on the floor. Both draw now.
     · THE DEPOSIT LINE, THE LEDGER PANEL and THE FILES PANEL'S NOTE came off.
       Ops prose in his voice, Ops bookkeeping, and a mechanism he has ruled a
       hack being replaced.

   PASS TWO, driving it again:
     · A SECTION IS A HEADER AND ITS LINES, and HEADLINE AND DECK ARE JUST
       SECTIONS — `element()` and `elementHtml()`, one recipe, no special case.
     · THE SECTION RECIPE IS HIS SPECIFICATION, INCLUDING THE BOX WIDTH — see
       `WRAP`, which takes the wrap point from the museum's own budgets. **The
       box is what replaced the character counts**: a limit made visible in the
       shape rather than announced as a number.
     · COUNTS COME OFF THE DAY SUMMARY. One appears when a limit is at risk and
       nowhere else — `elementHtml`.
     · x1 DIED. x2 IS THE VIEWER — one size, `ZOOM_PX`.
     · LEAD AND TOMBSTONE AND THE FILES PANEL CAME OFF, on his own rule that
       what is not required is not displayed. **The FIELDS are not deleted:** a
       field draws when it carries something, so the day a lead exists it draws,
       as a section. Removing them outright is how two Records once landed and
       drew nothing at all.
     · THE THREE MANDATORY SECTIONS — `MANDATORY` — each with a one-letter icon
       that keeps a fixed column, and a missing one is drawn LOUDLY because an
       absent thing cannot speak for itself.
     · READINESS ON EVERY ELEMENT, HIS TWO MARKS, BOTH OVERRIDING THE SYSTEM —
       `READINESS` and `COLUMNS`. Stored, never inferred.

   PASS THREE, three fixes, all of them Ops being right about a rule and wrong
   about the page:
     · ONE BOX WIDTH — see `BOX`. Three correct widths made a ragged column.
     · THE LETTER IDS CAME OFF THE ROWS. They keep the top bar and the
       calendar, which is the fixed column that was asked for.
     · THE TWO CHECKBOXES BECAME ONE MULTISTATE BUTTON — `elementHtml`, and
       `CYCLE` in the page's own script.

   ── [MIKE, 2026-08-25 — RULING A] THIS PAGE BECOMES WHERE HE WRITES ────────
   **THE BIGGEST RULING OF THE DAY, RECORDED AND NOT BUILT.** He ruled that the
   day editor becomes his writing surface and that **Excel stops being the
   surface** — which makes `npm run record:workbook` a RESCUE PATH rather than
   the road, and it says so at the head of `workbook_to_draft.py`.

   **THIS FILE IS STILL READ-ONLY AND THE ORDER MATTERS.** Editing is Piece 4
   and it comes AFTER the round-trip repair, because **the draft silently eats
   `wire` and `plates` today** — Record 013's defect. A surface that loses a
   field the moment he types into it would lose his words on its first day,
   which is the one thing this piece was sequenced last to avoid. The register
   row is `C-day1`; the boxes are the shape and nothing here takes a keystroke.

     npm run day
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { esc, page, OPS_CSS } from "./shell.mjs";
import { thumbnails } from "./lighttable.mjs";
import { buildShelf, SECTIONS } from "./shelf.mjs";
import { draftEntries, entries as recordEntries, summaries } from "../../reveal/record-entries.mjs";
import { BUDGETS, CONSTRAINTS, TITLE_BUDGET_MEASURED } from "../../reveal/record-shape.mjs";
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

/* ═══ THE WRAP POINT — WHAT THE BOXES ARE SIZED TO ═════════════════════════
/* ═══ THE BOX, AND THE MARK ═══════════════════════════════════════
   `[SHAPE]` the mechanism · `[WEIRD.BABY]` the one number and the two budgets.

   MIKE, 2026-08-25, specifying the section recipe: *"Width is sized to show me
   when I am going to risk wrapping a line."* THE BOX IS THE WARNING — the
   constraint made visible in the shape rather than announced as a number.

   ── ONE WIDTH, AND THE THREE WERE OPS BEING RIGHT AND WRONG AT ONCE ────────
   THE FIRST CUT GAVE EVERY ELEMENT ITS OWN WIDTH: 62 for the headline, 65 for
   the deck, 68 for a section, each taken from that element's own budget. Every
   number was correct and the page was wrong. **MIKE, on reading it: the boxes
   look ragged for no visible reason.** He is looking at a column of boxes, not
   at three budgets — the edges do not line up and nothing on the glass says
   why, so the raggedness reads as sloppiness rather than as information.

   SO THERE IS ONE WIDTH AND IT IS THE SECTION'S: **68 characters**, the
   museum's own body measure — `.vp-rec-sect-body { max-width: 68ch }` in
   `Exhibit.css`, chosen at R4 2026-08-06 out of the 65–75 band. A line that
   wraps in this box is a line that wraps on the glass.

   THE WRAP WARNING ONLY HAS TO BE HONEST WHERE A LIMIT EXISTS, and a limit
   exists on exactly two fields. Those two get a MARK instead of a narrower box
   — see `budgetMark()`. A section has no limit at all, so a box that implied
   one would be inventing a gate.

   AND THE BOX IS MONOSPACE, WHICH IS WHAT MAKES `ch` HONEST. In a monospace
   face `1ch` is every character, so 68ch is exactly 68 characters. In the
   museum's proportional Arial it is not — the same 68ch holds a different
   number of characters in every sentence. The museum's own cap is expressed in
   `ch` for the same reason and this box reads it the same way. */
const BOX = { chars: 68,
  why: "68 characters — the museum's own body measure, .vp-rec-sect-body "
     + "max-width:68ch in Exhibit.css. A line that wraps here wraps on the glass. "
     + "Every box on the page is this width; the two fields that have a limit "
     + "carry a mark instead." };

/* ═══ THE MARK, AND EXACTLY WHEN IT FIRES ══════════════════════════════════
   `[SHAPE]` the mechanism · `[WEIRD.BABY]` the two budgets it reads.

   IT IS THE ONLY NUMBER ON THE PAGE, and it is the same mark in both places it
   can appear. Two states and nothing between them:

     AMBER  the string is inside `NEAR` characters of its budget. It still
            passes. This is Ops' slack band and NOT a gate — said plainly in
            the hint, because a mark that implies a gate nobody can find is the
            same defect as a gate nobody can read.
     RED    the string is OVER its budget. `npm run reveal:check` refuses the
            packet — a fact, not a judgement.

   AND IT FIRES NOWHERE ELSE. A field inside its budget carries no number at
   all: Mike's own ruling that a count is *"only useful when there is a
   problem"*. Two of the five days show one mark between them today — 002's
   deck at 128 of 130.

   THE HEADLINE'S HINT CARRIES THE MEASURED WRAP POINTS TOO, because the gate
   is one number and a headline does not have one: `TITLE_BUDGET_MEASURED` puts
   the real wrap at 64 characters at 1280px, 58 at 768 and 36 at 390. The gate
   at 62 is two tighter than a desktop line and twenty-six looser than a phone,
   so a headline can pass every check here and still wrap on his phone. That is
   a fact about the museum, not a fault of the entry, and it is shown rather
   than turned into a second red. */
const NEAR = 5;

function budgetMark(len, b) {
  if (len == null) return null;
  if (len > b.max) {
    return { level: "bad", says: `${len}/${b.max}`,
      means: `${b.name} is OVER its limit of ${b.max} characters. ${b.enforcedBy}.`,
      read: `READS  ${len} characters, ${len - b.max} over` };
  }
  if (len > b.max - NEAR) {
    return { level: "warn", says: `${len}/${b.max}`,
      means: `${b.name} is inside ${NEAR} characters of its limit of ${b.max}. It still `
           + `passes — this mark is Ops' slack band and no gate fires at it. The gate is `
           + `${b.enforcedBy}, and it fires only above ${b.max}.`,
      read: `READS  ${len} characters, ${b.max - len} left` };
  }
  return null;
}

/* ═══ THE THREE MANDATORY SECTIONS ═════════════════════════════════════════
   `[SHAPE]` a day HAS a list of sections that must exist, each with a
   one-letter icon that keeps a fixed column · `[WEIRD.BABY]` these three.

   MIKE, 2026-08-25: **"THE THREE MANDATORY SECTIONS ARE: Headline, Executive
   Summary, Detailed Report. One-letter icon each, in a fixed column."**

   A MANDATORY SECTION THAT IS MISSING IS STILL DRAWN, LOUDLY. That is the
   whole reason the list exists: an absent thing cannot speak for itself, and
   every other mark on this page reads something that is there. `EXECUTIVE
   SUMMARY` and `DETAILED REPORT` are matched on the header he writes, so the
   match is his vocabulary and a rename shows up as a missing section rather
   than being guessed at. */
const MANDATORY = [
  { key: "field:title", icon: "H", header: "HEADLINE" },
  { key: "section:EXECUTIVE SUMMARY", icon: "E", header: "EXECUTIVE SUMMARY" },
  { key: "section:DETAILED REPORT", icon: "D", header: "DETAILED REPORT" },
];

/* ═══ HIS TWO MARKS ════════════════════════════════════════════════════════
   `[SHAPE]` MIKE, 2026-08-25, and both of them OVERRIDE the system:

   > "RED is NOT READY TO PUBLISH by whatever rules the system might have, as
   > well as a checkbox next to the represented section enabling me to mark it
   > 'NOT READY even though it may pass the system's test', or 'deemed not
   > required not presented - regardless of what the system says'. … Things not
   > required are not displayed in the summary. Things that are ready are
   > displayed discretely. Things that are not ready SPEAK LOUDLY."

   THEY ARE STORED AND NEVER INFERRED. `readiness.json` holds ONLY these two
   booleans per element; the system's own verdict is recomputed on every build
   and is never written into that file. A mark Ops derived and filed in his
   class would be indistinguishable from his own a week later — the same reason
   the three-mark scheme exists (OPERATIONS §5) and the reason a `bucket` is
   never derived.

   THE KEY IS AN IDENTITY, NEVER A POSITION. `field:title`, `field:line`,
   `section:<the header he wrote>`, `attachment:<its title>`. Inserting a
   section must not move a mark; §5's NO ID MOVES WHEN A LEGEND IS RECUT is the
   same rule one floor down.

   AND A MARK THAT MATCHES NO ELEMENT IS SHOWN, NOT DROPPED. Renaming a header
   orphans its mark, and an orphan that vanishes silently is this tree's most
   expensive failure class. The page prints them. */
const READINESS = path.join(REPO, "docs", "dictation-20260807", "readiness.json");
const MARK_STORE_KEY = "wb.day.readiness.v1";

function loadMarks() {
  try {
    const j = JSON.parse(fs.readFileSync(READINESS, "utf8"));
    return (j && j.marks) || {};
  } catch { return {}; }
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

/* ═══ AN ELEMENT ═══════════════════════════════════════════════════════════
   `[SHAPE]` EVERY ROW ON A DAY IS ONE OF THESE AND THERE IS NO SECOND SHAPE.
   Mike, 2026-08-25: **"HEADLINE AND DECK BECOME SECTIONS. They are
   special-cased today and they are just sections."** So the entry's fields and
   the entry's authored sections are the same kind of thing, built by the same
   function, drawn by the same recipe. SED.

   A FIELD DRAWS ONLY WHEN IT CARRIES SOMETHING, AND WHEN IT DRAWS IT IS A
   SECTION. That is his own rule — *"things not required are not displayed in
   the summary"* — and it is what takes LEAD and TOMBSTONE off the page: five
   Records have never used either. IT IS NOT A DELETION OF THE FIELD. The day
   one carries a lead, the lead draws, as a section, in the same recipe.
   Removing the field outright would make this page silently hide content that
   exists, which is exactly the defect that let two Records land and draw
   nothing at all. */
/* ═══ THE COMMON INDENT COMES OFF, AND HERE IS WHY IT IS NOT HIS ═══════════
   `[SHAPE]` MIKE, 2026-08-25: *"artificial indents, each at a deeper level."*

   THE CAUSE WAS MEASURED BEFORE ANYTHING WAS CHANGED, AND IT IS NOT NESTING.
   On the served page every TITLE box began at x=326 and every LINES box at
   x=340 — one edge each, first section and last, so the recipe's one level was
   already equal. **What was uneven was the first GLYPH: 349, 362, 374.** Every
   body carries a leading run of spaces of its own, and it deepens down the
   page because the summaries carry 2 and the addenda carry 4. That is the
   "deeper level" exactly, and it is in the text rather than in the layout.

   AND IT REACHES NO VISITOR. The museum sets a Record body `white-space:
   pre-line` (`.vp-rec-sect-body`, `Exhibit.css`), which COLLAPSES a run of
   spaces. Measured in the browser rather than read off the stylesheet: the
   same string draws its first glyph at **0px under pre-line and 25.3px under
   pre-wrap**. So this indent is an artefact of how the source is typed, the
   glass has never shown it, and only this editor's `pre-wrap` exposed it.
   **Artificial is the right word for it.**

   SO THE COMMON PREFIX COMES OFF FOR DISPLAY AND NOTHING ELSE MOVES. The cut
   is the SMALLEST leading run across the non-empty lines of that body, so
   every relative step he authored survives — 004's folder tree still hangs
   `PORTAL.CFG` under `TERMINAL.EXE`, and 003's `SCAN 07` still sits under
   `Manual Pages Recovered`. **The data is not touched**: this page writes
   nothing, and the number of spaces removed is named in the hint rather than
   applied silently.

   WHY NOT SIMPLY MATCH THE GLASS AND USE `pre-line`: it collapses EVERY run,
   which would flatten those two structures into prose — worse than the glass,
   which draws a `{pre}` body as an aligned `Listing`. Dedenting keeps more of
   what he wrote than either.

   > **[FLAG 2026-08-25 · found here, filed on C-day1] THE DRAFT LOSES `{pre}`
   > TOO.** `robots-record.js` declares 004's folder tree as `{ pre: "…" }` and
   > the museum renders it as an aligned listing; `draftEntries()` hands this
   > page a plain string, so the editor cannot tell a listing from a paragraph.
   > It is the same round-trip loss as `wire` and `plates` and it belongs to the
   > same repair — a THIRD field, added to the register row. */
function dedent(s) {
  const lines = String(s).split("\n");
  const runs = lines.filter(l => l.trim() !== "").map(l => l.match(/^ */)[0].length);
  const cut = runs.length ? Math.min(...runs) : 0;
  return { text: cut ? lines.map(l => l.slice(cut)).join("\n") : String(s), cut };
}

function element({ key, icon = null, header, runs, kind = "section", fault = null, extra = {} }) {
  const raw = (runs || []).filter(r => r != null && r !== "");
  const cuts = raw.map(r => dedent(r));
  const list = cuts.map(c => c.text);
  return {
    kind, key, icon, header,
    runs: list,
    /* what came off, so the hint can say it and never remove it silently. */
    indentCut: cuts.length ? Math.max(...cuts.map(c => c.cut)) : 0,
    lines: list.reduce((a, r) => a + String(r).split("\n").length, 0),
    longest: list.reduce((a, r) => Math.max(a, ...String(r).split("\n").map(x => x.length)), 0),
    empty: !list.length,
    fault,
    mark: null,
    ...extra,
  };
}

function buildDays() {
  const draft = draftEntries().entries;
  const live = recordEntries();
  const sums = summaries();
  const marks = loadMarks();
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
      const mine = marks[String(e.no)] || {};

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

      /* ── THE ELEMENTS, IN ONE LIST, IN ONE SHAPE ────────────────────────── */
      const els = [];

      /* THE TWO FIELDS THAT HAVE A LIMIT, AND THEY CARRY A MARK RATHER THAN A
         NARROWER BOX — every box on this page is `BOX` wide. `budgetMark()`
         says when the mark fires and it is the only number the page prints. */
      els.push(element({
        key: "field:title", icon: "H", header: "HEADLINE",
        runs: [e.title],
        fault: !e.title
          ? { says: "not written", why: "the index row prints no headline. 004 and 005 shipped this way (register L-c)" }
          : e.title.length > BUDGETS.title.max
            ? { says: `${e.title.length}/${BUDGETS.title.max}`, why: BUDGETS.title.enforcedBy }
            : null,
        extra: { mark: budgetMark(e.title ? e.title.length : null, BUDGETS.title),
          budget: BUDGETS.title, measured: TITLE_BUDGET_MEASURED },
      }));

      /* the deck, as a section. Not one of the three, but it has the other
         gate, and Record 002 sits two characters from it. */
      if (e.line) {
        els.push(element({
          key: "field:line", header: "DECK",
          runs: [e.line],
          fault: e.line.length > BUDGETS.line.max
            ? { says: `${e.line.length}/${BUDGETS.line.max}`, why: BUDGETS.line.enforcedBy }
            : null,
          extra: { mark: budgetMark(e.line.length, BUDGETS.line), budget: BUDGETS.line },
        }));
      }

      /* his authored sections, in his order, matched to the mandatory letters
         on the header he wrote. */
      for (const x of (e.sections || [])) {
        const header = x.label || null;
        const runs = (x.body || []).map(p => typeof p === "string" ? p
          : (p && typeof p.pre === "string" ? p.pre : JSON.stringify(p)));
        const m = MANDATORY.find(z => z.header === String(header || "").toUpperCase());
        els.push(element({
          key: "section:" + String(header || "(no header)"),
          icon: m ? m.icon : null,
          header, runs,
          fault: runs.length ? null
            : { says: "no lines", why: "a section with an empty body is dropped ENTIRELY, its header with it, and nothing says so" },
        }));
      }

      /* every OTHER field that carries something, in the same recipe. None of
         the five Records has one; the path exists so that the day one does,
         the page draws it instead of hiding it. */
      for (const [k, head] of [["lead", "LEAD"], ["tomb", "TOMBSTONE"],
                               ["still", "STILL"], ["wire", "WIRE"],
                               ["plates", "PLATES"], ["note", "NOTE"]]) {
        if (e[k] == null || e[k] === "") continue;
        const v = typeof e[k] === "string" ? e[k] : JSON.stringify(e[k], null, 1);
        els.push(element({
          key: "field:" + k,
          header: head + (k === "still" && e.stillCaption ? " — " + e.stillCaption : ""),
          runs: [v],
          extra: { locked: ["wire", "plates", "note"].includes(k) },
        }));
      }

      /* a mandatory section that is NOT THERE. It cannot speak for itself, so
         the list speaks for it — drawn in place, loud, with no lines. */
      for (const m of MANDATORY) {
        if (els.some(x => x.key === m.key)) continue;
        els.push(element({
          key: m.key, icon: m.icon, header: m.header, runs: [],
          fault: { says: "not written", why: "a mandatory section. Headline, Executive Summary and Detailed Report are the three every day has" },
          extra: { missing: true },
        }));
      }

      /* the attachments are elements too — his ruling says the marks reach
         them, so they carry the same two columns and the same states. */
      for (const a of docs) {
        els.push(element({
          kind: "attachment", key: "attachment:" + a.title, header: a.title,
          runs: [],
          fault: a.files.length ? null
            : { says: "no files", why: "an attachment with no files draws “not here yet” on the glass (Ruling 9)" },
          extra: { doc: a, files: fileRows.filter(f => a.files.includes(f.web)) },
        }));
      }

      /* HIS MARKS, ATTACHED BY KEY, AND THE ORPHANS KEPT. */
      for (const el of els) {
        const mk = mine[el.key] || {};
        el.notReady = !!mk.notReady;
        el.notRequired = !!mk.notRequired;
        /* the three states, in his words. NOT REQUIRED wins over everything —
           *"regardless of what the system says"* — and NOT READY beats a clean
           system verdict, because that is the whole point of the mark. */
        el.state = el.notRequired ? "off"
          : (el.notReady || el.fault) ? "loud" : "quiet";
      }

      const keys = new Set(els.map(x => x.key));
      const orphans = Object.keys(mine).filter(k => !keys.has(k));

      return {
        no: e.no,
        date: e.date || null,
        weekday: e.date ? WD[new Date(e.date + "T12:00:00Z").getUTCDay()] : null,
        title: e.title || null,
        line: e.line || null,
        indexTitle: s.title || null,
        els, docs, fileRows, orphans,
        braces: bracesIn(e),
      };
    });
}

/* ═══ THE FIXED COLUMNS ════════════════════════════════════════════════════
   `[SHAPE]` the mechanism · `[WEIRD.BABY]` which seven.

   MIKE, 2026-08-25: **"Keeping the icons in predefined columns is still a
   plus."** So the day summary is SEVEN COLUMNS IN ONE ORDER, on every day,
   and a column that has nothing to say is still there and still empty — the
   eye learns a position once and reads it forever after. A bar that packs
   itself is a bar he has to read from the left every time.

   AND THERE ARE NO COUNTS IN IT. Mike: **"CHARACTER COUNTS COME OFF THE DAY
   SUMMARY. They are only useful when there is a problem, and not at Day
   level."** The count lives on the element that is at risk, and the shape of
   the box is what shows him the risk before a number ever has to.

   THE THREE STATES ARE HIS: loud when it is not ready, discrete when it is,
   and NOTHING AT ALL when he has marked it not required. */
const COLUMNS = [
  { k: "H", of: "field:title", what: "the HEADLINE" },
  { k: "E", of: "section:EXECUTIVE SUMMARY", what: "the EXECUTIVE SUMMARY" },
  { k: "D", of: "section:DETAILED REPORT", what: "the DETAILED REPORT" },
  { k: "S", of: null, what: "every other section of this day" },
  { k: "A", of: null, what: "the attachments" },
  { k: "P", of: null, what: "the files this Record delivers" },
  { k: "{}", of: null, what: "unresolved notes to Ops" },
];

function dayMarks(d) {
  const byKey = k => d.els.find(x => x.key === k);
  const mand = k => {
    const el = byKey(k);
    if (!el) return { s: "loud", r: "READS  not written" };
    if (el.notRequired) return { s: "off", r: "READS  you have marked it not required" };
    if (el.notReady) return { s: "loud", r: "READS  you have marked it NOT READY" };
    if (el.fault) return { s: "loud", r: "READS  " + el.fault.says };
    return { s: "quiet", r: "READS  ready" };
  };

  return COLUMNS.map(c => {
    if (c.of) {
      const st = mand(c.of);
      return { k: c.k,
        w: `${c.what} — one of the three sections every day has. `
         + "Loud is NOT READY, quiet is ready, empty is one you have marked not required.",
        ...st };
    }
    if (c.k === "S") {
      const rest = d.els.filter(x => x.kind === "section"
        && !MANDATORY.some(m => m.key === x.key) && !x.notRequired);
      const loud = rest.filter(x => x.state === "loud");
      return { k: "S", s: loud.length ? "loud" : rest.length ? "quiet" : "off",
        w: "every other section of this day — the deck and whatever else you wrote. "
         + "Loud if any one of them is not ready.",
        r: loud.length ? `READS  ${loud.length} of ${rest.length} not ready — ${loud.map(x => x.header).join(", ")}`
          : rest.length ? `READS  ${rest.length} section${rest.length === 1 ? "" : "s"}, all ready`
            : "READS  none" };
    }
    if (c.k === "A") {
      const at = d.els.filter(x => x.kind === "attachment" && !x.notRequired);
      const loud = at.filter(x => x.state === "loud");
      return { k: "A", s: loud.length ? "loud" : at.length ? "quiet" : "off",
        w: "the attachments. Loud if any one of them is not ready — an attachment with "
         + "no files draws “not here yet” on the glass (Ruling 9).",
        r: loud.length ? `READS  ${loud.length} of ${at.length} not ready`
          : at.length ? `READS  ${at.length} attachment${at.length === 1 ? "" : "s"}, all ready`
            : "READS  none" };
    }
    if (c.k === "P") {
      const un = d.fileRows.filter(f => f.door === "PLACE").length;
      return { k: "P", s: un ? "loud" : d.fileRows.length ? "quiet" : "off",
        w: "files this Record delivers that are still behind the stage door. "
         + "npm run reveal:day -- --place moves them.",
        r: un ? `READS  ${un} of ${d.fileRows.length} still behind the door`
          : d.fileRows.length ? `READS  ${d.fileRows.length} file${d.fileRows.length === 1 ? "" : "s"}, every one at its public address`
            : "READS  none" };
    }
    return { k: "{}", s: d.braces.length ? "loud" : "quiet",
      w: "a note in braces is you writing to Ops, never story. "
       + "npm run reveal:check refuses the packet while one survives.",
      r: d.braces.length ? `READS  ${d.braces.length} unresolved — ${d.braces.join("  ")}`
        : "READS  none" };
  });
}

/* ═══ CSS ══════════════════════════════════════════════════════════════════
   No frills or glamour — the existing Ops pages are the reference. One face,
   thin rules, gold only where a state means something.
   No backtick below: this sits inside a template literal and one would close it. */
const CSS = OPS_CSS + `
/* THE RECORD SCROLLS, NOT THE PAGE. MIKE, 2026-08-25: the bar, the calendar
   and the shelf STAY PUT and the day moves in its own column.
   THE PAGE ITSELF NO LONGER SCROLLS AT ALL at desktop width - body is a flex
   column pinned to the viewport, the bar is a fixed-size first item, and the
   three columns each own their overflow. Sticky was the wrong instrument: a
   sticky bar still lets the furniture travel, and he was losing the calendar
   and the shelf the moment he read past the third section.
   min-height:0 IS LOAD-BEARING ON BOTH AXES OF THE NESTING. A grid or flex
   item defaults to min-height:auto, which is its CONTENT height, so without
   these two declarations the middle column simply grows and the page scrolls
   again - the rule reads as if it does nothing until it is removed.
   THE TWO PANELS ARE align-self:start SO A CLOSED ONE IS ITS OWN HEIGHT, and
   max-height:100% so an OPEN one - the shelf is 138 tiles - stops at the
   column and scrolls inside itself with its summary still on screen. */
html,body{height:100%}
/* overflow:hidden ON HTML AS WELL AS BODY, AND IT WAS MEASURED THAT IT HAD TO
   BE. With it on body alone the html element still scrolled - window.scrollTo
   moved the page 500px while every column sat still, so the furniture stayed
   put only for as long as nobody used a wheel over it. */
html{overflow:hidden}
body{overflow:hidden;display:flex;flex-direction:column;padding:16px 20px 12px}
.dy-wrap{display:grid;grid-template-columns:250px minmax(0,1fr) 330px;gap:16px;
  align-items:stretch;flex:1 1 auto;min-height:0}
.dy-wrap>*{min-height:0}
.dy-mid{overflow-y:auto;overflow-x:hidden;height:100%;padding-right:6px}
/* THE SCROLL IS ON THE PANEL, NOT ON ITS BODY, AND THE FIRST CUT PROVED WHY.
   A panel is align-self:start so a CLOSED one is its own height - which makes
   its height AUTO, and max-height only caps the box afterwards. A flex or grid
   child laid out against that auto height never shrinks: measured, the shelf's
   inner box stayed 2102px inside a 732px panel and scrolled nothing, with
   min-height:0 and flex-shrink:1 both already set. Overflow on the element
   that carries the max-height does not depend on any child-sizing rule. The
   cost is that the shelf's own summary scrolls with its tiles, which is a
   fair trade for a panel that cannot spill. */
.dy-panel{align-self:start;max-height:100%;overflow:auto}
@media (max-width:1200px){.dy-wrap{grid-template-columns:210px minmax(0,1fr)}
  .dy-pick{grid-column:1/-1}}
/* ONE COLUMN IS A PHONE, AND A PHONE SCROLLS THE PAGE. Three independent
   scrollers stacked on 390px is a worse instrument than the ordinary one. */
@media (max-width:820px){
  html,body{height:auto}
  html{overflow:visible}
  body{overflow:visible;display:block;padding:20px 14px 80px}
  .dy-wrap{display:block;min-height:0}
  .dy-mid{overflow:visible;height:auto;padding-right:0}
  .dy-panel{max-height:none;overflow:visible}
}

.dy-top{flex:0 0 auto;z-index:30;background:var(--paper,#17150f);
  border-bottom:1px solid var(--rule,#3a3529);padding:0 0 8px;margin:0 0 12px}
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
/* THE COUNT APPEARS WHEN A LIMIT IS AT RISK AND NOWHERE ELSE — his ruling.
   There is no ordinary-ink count left on this page: the BOX is what shows him
   the room he has, and a number only arrives when the room is nearly gone. */
.dy-count{font-size:10px;margin-left:6px;color:var(--gold,#b8974a)}
.dy-count.bad{color:#e89a9a}

/* ═══ THE SECTION RECIPE — HIS SPECIFICATION, BUILT ════════════════════════
     [Section Title Box - Displays BOLD]
     [Section text box that accepts crlf and expands.
      Width is sized to show me when I am going to risk wrapping a line.
      It is spaced like I show it, has as many lines as I give it.
      This section always displays indented automatically.]

   TITLE BOX, BOLD. LINES BOX, INDENTED, AS MANY LINES AS HE GIVES IT.
   Both are BOXES because Piece 4 types into them and the shape is what is
   being ruled on now; nothing here is editable yet.
   ONE WIDTH, DECLARED ONCE, ON EVERY BOX. The first cut sized each element to
   its own budget — 62, 65, 68 — and every number was right while the page was
   wrong: Mike reads a COLUMN OF BOXES, and edges that do not line up for a
   reason he cannot see read as sloppiness. The two fields that have a limit
   carry a mark instead. MONOSPACE IS WHAT MAKES ch HONEST: one character, one
   ch, so 68ch is 68 characters exactly.
   pre-wrap accepts his crlf and his spacing; the box expands because nothing
   caps its height. */
ol.dy-sects{list-style:none;margin:0;padding:0}
ol.dy-sects>li{margin:0 0 10px}
/* ONE FIXED COLUMN ON A ROW, AND IT IS THE STATE BUTTON. The one-letter ids
   came off the rows on 2026-08-25 — they stay in the top bar and the calendar,
   which is the fixed column that was asked for, and a letter beside the row it
   labels is redundant when the row says EXECUTIVE SUMMARY in bold an inch
   away. */
.dy-el{display:grid;grid-template-columns:1.7rem minmax(0,1fr);gap:0 7px;align-items:start}
.dy-el .c{font-size:10px;line-height:1.5;text-align:center;padding-top:2px}
.dy-el .body{min-width:0}
/* THE MULTISTATE BUTTON. One control, three states, and the third press comes
   back round to ready — no state is a corner. */
.dy-st{width:1.7rem;height:1.7rem;padding:0;cursor:pointer;border-radius:2px;
  font-family:inherit;font-size:13px;line-height:1;background:transparent;
  border:1px solid #2a2620;color:inherit;opacity:.55}
.dy-st:hover{border-color:var(--gold,#b8974a);opacity:1}
.dy-st:focus-visible{outline:2px solid var(--gold,#b8974a);outline-offset:1px}
.dy-st[data-state=loud]{border-color:#c76a6a;color:#e89a9a;background:#241616;
  opacity:1;font-weight:700}
.dy-st[data-state=off]{border-style:dashed;opacity:.35}
/* the title box, bold */
.dy-box-t{display:block;border:1px solid #2a2620;border-radius:2px;
  padding:4px 7px;font-size:11.5px;font-weight:700;letter-spacing:.05em;
  background:#1a1813}
/* the lines box, indented automatically, expanding, his spacing kept.
   TWO THINGS HERE ARE THE WRAP POINT AND BOTH WERE MEASURED WRONG FIRST TIME.
   (1) THE FACE IS ON THE BOX, NOT ONLY ON ITS PARAGRAPHS. A ch resolves in the
   font of the element that DECLARES the max-width, so a box in the page's sans
   face sized to 62ch held 62 sans zeros — 479px — while 62 monospace
   characters are 392px. The box was 22% too wide and the warning would have
   arrived thirteen characters late, which is worse than no warning: it is a
   wrong one. Measured on the served page before and after.
   (2) box-sizing IS content-box HERE, against the sheet's own reset. With
   border-box the padding and the border eat into the measure, so the text
   would wrap ~3 characters early. max-width on this box means the TEXT, which
   is the only thing that makes the number honest.
   AND IT IS A MAXIMUM, SO A NARROW PANE WRAPS EARLY. Measured at 390px: every
   box is narrower than its budget and the text wraps sooner than the museum
   would. That errs toward warning him TOO SOON and never too late, which is
   the safe direction for a warning; the alternative is a horizontal scrollbar
   inside every section on a phone. Read the boxes at desktop width. */
.dy-box-l{box-sizing:content-box;max-width:68ch;margin:4px 0 0 14px;
  border:1px solid #22201a;border-radius:2px;padding:6px 8px;background:#141310;
  font-family:ui-monospace,Consolas,monospace;font-size:11.5px}
.dy-box-l p{margin:0 0 9px;font-family:inherit;
  font-size:inherit;line-height:1.5;white-space:pre-wrap;opacity:.9}
.dy-box-l p:last-child{margin:0}
.dy-box-l.void{padding:4px 8px;opacity:.5;font-style:italic;font-size:11px}

/* THINGS THAT ARE READY ARE DISPLAYED DISCRETELY. THINGS THAT ARE NOT READY
   SPEAK LOUDLY. His words, and the only two voices on the page. */
.dy-el.quiet .dy-box-t{opacity:.72}
.dy-el.loud .dy-box-t{border-color:#c76a6a;color:#e89a9a;background:#241616}
/* EVERY ROW CARRIES BOTH VOICES AND ITS OWN CLASS PICKS ONE. Nothing is
   written or removed when he ticks a box, so no mark is a one-way door. */
.dy-say,.dy-off-say{display:none}
.dy-el.loud .dy-say{display:inline-block;margin-left:8px;font-size:10px;
  letter-spacing:.08em;color:#e89a9a;font-weight:700}
/* NOT REQUIRED: not presented. One dim line so the mark stays reversible —
   the lines are gone, the button is still there and still goes round. */
.dy-el.off .dy-box-t{opacity:.34;border-style:dashed;background:transparent;
  font-weight:400;color:inherit}
.dy-el.off .dy-box-l,.dy-el.off .dy-att{display:none}
.dy-el.off .dy-off-say{display:inline;margin-left:8px;font-size:9.5px;
  letter-spacing:.08em;opacity:.6;font-weight:400}

.dy-att{border:1px solid #2a2620;border-radius:2px;padding:8px 9px;margin:4px 0 0 14px}
.dy-att .m{font-size:10px;opacity:.5;margin:0 0 6px}
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

.dy-marks{margin:14px 0 0;padding:8px 9px;border:1px solid #2a2620;border-radius:2px}
.dy-marks .h{font-size:10px;letter-spacing:.08em;opacity:.5}
.dy-marks textarea{display:block;width:100%;margin:6px 0 0;min-height:74px;
  background:#141310;color:inherit;border:1px solid #22201a;border-radius:2px;
  font-family:ui-monospace,Consolas,monospace;font-size:10.5px;line-height:1.45;padding:6px}
.dy-marks button{font-family:inherit;font-size:11px;padding:4px 9px;cursor:pointer;
  background:transparent;border:1px solid var(--rule,#3a3529);color:inherit;border-radius:2px}
.dy-marks button:hover{border-color:var(--gold,#b8974a)}
.dy-marks .said{font-size:10px;margin-left:8px;opacity:.7}
#dy-storebanner{display:none;margin:0 0 12px;padding:8px 10px;border:1px solid #c76a6a;
  border-radius:2px;color:#e89a9a;font-size:11.5px}
#dy-storebanner.on{display:block}

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
#dy-vbar button:hover{border-color:var(--gold,#b8974a)}
#dy-vname{opacity:.7}
#dy-vcap{opacity:.55;font-size:10.5px}
/* NO max-width and NO steps. x1 died on 2026-08-25 — x2 IS the viewer — so
   there is one size and it is the big one. The overlay scrolls inside its own
   box (#dy-view is overflow:auto), so the PAGE never scrolls sideways. */
#dy-vimg{display:block;margin:0 auto;background:#fff}
`;

/* ═══ RENDER ═══════════════════════════════════════════════════════════════ */

/* ═══ ONE RECIPE, EVERY ELEMENT, EVERY DAY ═════════════════════════════════
   `[SHAPE]` MIKE, 2026-08-25, giving the recipe as a specification rather than
   as a preference:

   > "[Section Title Box - Displays BOLD]
   >  [Section text box that accepts crlf and expands.
   >   Width is sized to show me when I am going to risk wrapping a line.
   >   It is spaced like I show it, has as many lines as I give it.
   >   This section always displays indented automatically.]"

   `elementHtml` is the only thing on this page that draws a row. The headline,
   the deck, every authored section and every attachment go through it — that
   is what item 3 means by *"they are just sections"* and it is the SED test:
   one shape, many instances, differing only in what fills it.

   FOUR FIXED COLUMNS, ALWAYS IN THIS ORDER: the one-letter icon, NOT READY,
   NOT REQUIRED, and the body. A column with nothing to say stays empty rather
   THE ROW HAS ONE FIXED COLUMN AND IT IS THE STATE BUTTON. The letter used to
   sit beside it and Mike took it off: **the letters stay in the top bar and the
   calendar, which is the fixed column he asked for; a letter beside the row it
   labels is redundant** — the row already says EXECUTIVE SUMMARY in bold, in a
   box, an inch away.

   EVERY BOX IS `BOX` WIDE. The two fields that have a limit carry a MARK
   instead of a narrower box — see `budgetMark()`. */
function elementHtml(el) {
  /* THE ONLY NUMBER ON THE PAGE, and it is printed only when it fires. */
  const mark = el.mark
    ? `<span class="dy-count ${el.mark.level}"${hint(el.mark.means
        + (el.measured
            ? " The gate is one number and a headline is not: measured, the real line wraps at "
              + el.measured.map(m => `${m.chars} at ${m.viewport}px`).join(", ") + "."
            : ""),
        el.mark.read)}>${esc(el.mark.says)}</span>`
    : el.fault && el.fault.says && /\d\/\d/.test(el.fault.says)
      ? `<span class="dy-count bad"${hint(
          `${el.budget ? el.budget.name : "this field"} is over its limit. ${el.fault.why}.`,
          `READS  ${el.fault.says}`)}>${esc(el.fault.says)}</span>`
      : "";

  /* BOTH VOICES ARE ALWAYS IN THE MARKUP AND CSS DECIDES WHICH SPEAKS.
     The first cut rendered only the state the element was in, which made a
     mark a ONE-WAY DOOR: clearing NOT REQUIRED in the browser had nothing to
     put back, because the lines box had never been written. A mark he cannot
     take off is not a mark, it is a deletion — so every row carries its lines,
     its loud line and its quiet line, and the class on the row is the only
     thing that changes. */
  const say = `<span class="dy-say"${hint(
      "NOT READY TO PUBLISH. Either the system's own rules say so, or you have marked it "
      + "NOT READY even though it passes — your mark overrides the system.",
      el.fault ? `READS  ${el.fault.says} — ${el.fault.why}`
        : el.notReady ? "READS  your mark" : "READS  ready")
    }>NOT READY</span><span class="dy-off-say"${hint(
      "deemed not required, not presented — regardless of what the system says. Its lines "
      + "are not drawn. Press the button round to bring it back.",
      el.notRequired ? "READS  you have marked this not required" : "READS  unmarked")
    }>not required</span>`;

  /* ═══ ONE CONTROL, THREE STATES, AND IT COMES BACK ROUND ═════════════════
     `[SHAPE]` MIKE, 2026-08-25: **two checkboxes become ONE multistate button,
     cycling ready → not ready → not required.** Two boxes could express four
     combinations for three states, and the fourth — both ticked — meant
     nothing; one button cannot say a thing that has no meaning.

     IT IS REVERSIBLE FROM EVERY STATE BECAUSE IT IS A CYCLE. The third press
     returns to ready, so no state is a corner: **a mark he cannot take off is
     a deletion**, which this page has already been caught doing once. The hint
     names the state it is IN and the state the next press moves to, so the way
     out is never something he has to discover.

     IT IS A `button`, so it is in the tab order and answers Enter and Space
     with no keyboard handling of this file's own. */
  const st = el.notRequired ? "off" : el.notReady ? "loud" : "quiet";
  const NEXT = { quiet: "not ready", loud: "not required", off: "ready" };
  const NOW = { quiet: "ready", loud: "NOT READY", off: "not required" };
  const GLYPH = { quiet: "·", loud: "!", off: "–" };
  const control = `<div class="c"><button type="button" class="dy-st" data-key="${esc(el.key)}"
    data-state="${st}" aria-label="${esc(NOW[st])}"${hint(
      "READY, NOT READY, NOT REQUIRED — press it to go round. NOT READY is yours even when "
      + "the system's test passes; NOT REQUIRED takes it out of the summary regardless of "
      + "what the system says. A third press comes back to ready.",
      `READS  ${NOW[st]} — press for ${NEXT[st]}`)
    }>${GLYPH[st]}</button></div>`;

  /* THE TITLE BOX — displays BOLD. */
  const titleBox = `<div class="dy-box-t"${hint(
    el.kind === "attachment"
      ? "the attachment's title, as it prints at the foot of the record."
      : `the SECTION's HEADER. ${HEADER_RULE.rule} Enforced by: ${HEADER_RULE.enforcedBy}.`,
    `READS  ${el.header || "(no header)"}`)}>${esc(el.header || "(no header)")}${mark}${say}</div>`;

  /* THE LINES BOX — accepts crlf, expands, spaced as he wrote it, indented
     automatically, and ONE WIDTH, the same on every element on every day. */
  const linesBox = el.kind === "attachment"
    ? attachmentBody(el)
    : el.empty
      ? `<div class="dy-box-l void"${hint(
          "the SECTION's LINES — the text following the HEADER. " + BOX.why,
          "READS  no lines")}>no lines</div>`
      : `<div class="dy-box-l"${hint(
          "the SECTION's LINES — the text following the HEADER, drawn with your line splits, "
          + "your steps and your spacing. It sits ONE level under its title, the same level on "
          + "every section. The BOX is the measure: " + BOX.why
          + (el.indentCut
              ? " The leading indent every line of this section carried has been taken off for "
                + "display, because it is how the source is typed and not a level you wrote — "
                + "the museum collapses it entirely. Nothing is written to the data."
              : ""),
          `READS  ${el.lines} line${el.lines === 1 ? "" : "s"}, longest ${el.longest} of ${BOX.chars} characters`
          + (el.indentCut ? `, ${el.indentCut} leading space${el.indentCut === 1 ? "" : "s"} removed` : ""))
        }>${el.runs.map(r => `<p>${esc(r)}</p>`).join("")}</div>`;

  return `<li><div class="dy-el ${el.state}" data-el="${esc(el.key)}" data-fault="${el.fault ? 1 : 0}">${control}
    <div class="body">${titleBox}${linesBox}</div></div></li>`;
}

/* `[SHAPE]` AN ATTACHMENT'S BODY IS ITS FILES, and every part of a file tile is
   a mark that carries a hint: the picture, the plate's own label, the filename
   and the door. */
let TILES = { byWeb: new Map(), bigByWeb: new Map() };

function attachmentBody(el) {
  const a = el.doc;
  const rows = el.files || [];
  return `<div class="dy-att">
    <div class="m"${hint("the attachment's own facts: how many files it carries, where it came "
      + "from, how many pages it is.",
      `READS  ${a.files.length} file${a.files.length === 1 ? "" : "s"}`
      + (a.source ? `, source ${a.source}` : "")
      + (a.pages != null ? `, ${a.pages} page${a.pages === 1 ? "" : "s"}` : ""))
    }>${a.files.length} file${a.files.length === 1 ? "" : "s"}${a.source ? " · " + esc(a.source) : ""}${a.pages != null ? " · " + a.pages + " page" + (a.pages === 1 ? "" : "s") : ""}</div>
    ${rows.length ? `<div class="dy-files">${rows.map(f => {
      const t = TILES.byWeb.get(f.web);
      const [word, doorMeans] = DOOR_SAYS[f.door]
        || ["unknown", "no door state — this file is not in the plan"];
      return `<figure class="dy-file">${
        t ? `<img src="${t}" alt="${esc(f.label || f.name)}" data-zoom="${esc(f.web)}"${hint(
              `the page itself, inlined at ${VIEW_PX}px so it draws however this file is `
              + `opened. Click for the viewer, which shows it at ${ZOOM_PX}px.`,
              `READS  ${f.name}` + (TILES.bigByWeb.has(f.web) ? "" : " — the viewer has only this size for it"))}>`
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
    }).join("")}</div>` : ""}
  </div>`;
}

function dayHtml(d) {
  const sections = d.els.filter(x => x.kind === "section");
  const atts = d.els.filter(x => x.kind === "attachment");
  const list = els => `<ol class="dy-sects">${els.map(elementHtml).join("")}</ol>`;

  return `<div class="dy-day" data-day="${d.no}" hidden>
  <h2>RECORD ${String(d.no).padStart(3, "0")}</h2>
  <p class="when"${hint("the day this Record is dated, and the weekday it falls on.",
    `READS  ${d.date || "no date"}`)}>${d.weekday ? esc(d.weekday) + " " : ""}${esc(d.date || "no date")}</p>

  <div class="dy-sec"><h3${hint("every section of this day, in one recipe: a HEADER and its LINES.",
    `READS  ${sections.length} section${sections.length === 1 ? "" : "s"}`)}>SECTIONS · ${sections.length}</h3>
    ${list(sections)}
  </div>

  <div class="dy-sec"><h3${hint("the attachments, which carry the same two marks as a section.",
    `READS  ${atts.length} attachment${atts.length === 1 ? "" : "s"}`)}>ATTACHMENTS · ${atts.length}</h3>
    ${atts.length ? list(atts) : ""}
  </div>

  ${d.braces.length ? `<div class="dy-sec"><h3>UNRESOLVED NOTES TO OPS · ${d.braces.length}</h3>
    <table class="dy-t">${d.braces.map(b => `<tr><td${hint(
      "a note in braces is you writing to Ops, never story.",
      `READS  ${b}`)}>{}</td><td>${esc(b)}</td></tr>`).join("")}</table></div>` : ""}

  ${d.orphans.length ? `<div class="dy-sec"><h3${hint(
    "a mark in readiness.json whose element is not on this day any more — a header that was "
    + "renamed, or an attachment that left. It is SHOWN rather than dropped: a mark of yours "
    + "that vanishes silently is worse than one that is in the way.",
    `READS  ${d.orphans.length} orphaned`)}>MARKS WITH NO ELEMENT · ${d.orphans.length}</h3>
    <table class="dy-t">${d.orphans.map(k => `<tr><td>·</td><td>${esc(k)}</td></tr>`).join("")}</table></div>` : ""}
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

TILES = { byWeb, bigByWeb };

const calHtml = days.map(d => {
  const mk = dayMarks(d);
  return `<button type="button" data-go="${d.no}" aria-current="false"${hint(
    "a day in this volume. Click it to open that day whole.",
    `READS  Record ${String(d.no).padStart(3, "0")}, ${d.weekday || "no weekday"} ${d.date || "no date"}`)}>
  <div class="d1">RECORD ${String(d.no).padStart(3, "0")}</div>
  <div class="d2">${esc(d.weekday || "")} ${esc(d.date || "")}</div>
  <div class="row">${mk.map(i => `<i class="${i.s}"${hint(i.w, i.r)}>${esc(i.k)}</i>`).join("")}</div>
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
          + "the day's own pictures are the ones held at the viewer's size; the light table is "
          + "the full-size instrument for everything else.",
          `READS  ${r.label}`)}>`
      : `<div class="noimg"${hint("on the shelf, and it is not an image.",
          `READS  ${r.label}`)}></div>`;
  }).join("")}</div></div>`;
}).filter(Boolean).join("");

const body = `
<div id="dy-storebanner"></div>
<div class="dy-top"><div class="dy-bar" id="dy-icons"></div></div>

<div class="dy-wrap">
  <details class="dy-panel dy-cal" open>
    <summary${hint("every day in this volume, each with the same seven marks as the bar above.",
      `READS  ${days.length} days`)}>THE DAYS · ${days.length}</summary>
    <div class="in">${calHtml}
      <p class="dy-note">Every day, with the same seven marks as the bar above, in the same
        seven columns. A day with no entry is not drawn and is not a defect — which days get a
        Record is decided by which entries exist.</p>
    </div>
  </details>

  <div class="dy-mid">
    <div class="dy-nav" style="margin:0 0 10px">
      <button type="button" id="dy-prev"${hint("the day before this one. The left arrow key does the same.",
        "READS  disabled on the first day")}>&lsaquo; previous day</button>
      <button type="button" id="dy-next"${hint("the day after this one. The right arrow key does the same.",
        "READS  disabled on the last day")}>next day &rsaquo;</button>
      <span id="dy-where"${hint("where this day sits in the volume.", "READS  below")}></span>
    </div>
    ${days.map(d => dayHtml(d)).join("\n")}

    <div class="dy-marks">
      <div class="h"${hint(
        "your marks — NOT READY and NOT REQUIRED — for every day, as they stand in this browser. "
        + "The page reads them from docs/dictation-20260807/readiness.json at build time; this box "
        + "is how what you have changed since gets back into that file.",
        "READS  the live marks, updated on every box you tick")}>YOUR MARKS · for docs/dictation-20260807/readiness.json</div>
      <textarea id="dy-marks-out" readonly${hint(
        "the marks as they would be written to readiness.json. Nothing on this page writes to the "
        + "tree — copy this and Ops lands it.",
        "READS  the live marks")}></textarea>
      <p style="margin:6px 0 0">
        <button type="button" id="dy-marks-copy"${hint(
          "put the marks on the clipboard and READ THEM BACK before saying it worked. A clipboard "
          + "write is not done until it has been read back.",
          "READS  press it")}>copy the marks</button>
        <span class="said" id="dy-marks-said"></span>
      </p>
    </div>
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
   BIG is the viewer's set, inlined at ZOOM_PX and keyed by the same public
   address the tile carries, so the viewer resolves no path either. */
var DAYS = ${JSON.stringify(days.map(d => ({ no: d.no, date: d.date, weekday: d.weekday })))};
var MARKSBAR = ${JSON.stringify(Object.fromEntries(days.map(d => [d.no, dayMarks(d)])))};
var BIG = ${JSON.stringify(Object.fromEntries(bigByWeb))};
var BAKED = ${JSON.stringify(loadMarks())};
var STORE_KEY = ${JSON.stringify(MARK_STORE_KEY)};
var HINT_IMG = ${JSON.stringify(`the picture, at ${ZOOM_PX}px — the viewer's one size. `
  + `x1 died on 2026-08-25; x2 is the viewer.`)};
var i = 0, VIEW = null;

/* every mark says what it means and what it read — two lines, one function,
   the same shape the generator uses. */
function hint(el, means, read){
  el.setAttribute("title", read ? means + "\\n" + read : means);
}
function hintAttr(means, read){
  var s = read ? means + "\\n" + read : means;
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

/* ═══ HIS MARKS ════════════════════════════════════════════════════════════
   THE FILE IS THE RECORD AND THE BROWSER IS THE WORKING COPY. BAKED is
   readiness.json as it stood when this page was generated; the live store is
   this browser's own, at this address. They are merged with the browser
   winning, because the browser is where the last tick happened.
   IT DEGRADES HONESTLY. If the browser refuses storage the page says so in
   red rather than losing a tick quietly — assign.html's own rule.
   AND NOTHING HERE INFERS A MARK. Only a box he ticks writes one. */
var MARKS = {}, STORE_OK = true;
function banner(t){
  var b = document.getElementById("dy-storebanner");
  b.innerHTML = t; b.className = t ? "on" : "";
}
function loadMarks(){
  var live = null;
  try { live = JSON.parse(localStorage.getItem(STORE_KEY) || "null"); }
  catch(e){ STORE_OK = false;
    banner("<b>THIS BROWSER WILL NOT LET THE PAGE REMEMBER ANYTHING.</b> The marks below are the "
      + "ones baked in from readiness.json. Anything you tick now is on the screen and in the "
      + "marks box, and will be gone if you close this tab \\u2014 copy it first."); }
  MARKS = JSON.parse(JSON.stringify(BAKED || {}));
  if (live) {
    for (var no in live) {
      MARKS[no] = MARKS[no] || {};
      for (var k in live[no]) MARKS[no][k] = live[no][k];
    }
  }
}
function saveMarks(){
  if (!STORE_OK) { paintMarksBox(); return; }
  try { localStorage.setItem(STORE_KEY, JSON.stringify(MARKS)); }
  catch(e){ STORE_OK = false;
    banner("<b>THIS BROWSER WILL NOT LET THE PAGE REMEMBER ANYTHING.</b> Your marks are on the "
      + "screen and in the marks box, but they will be gone if you close this tab \\u2014 copy "
      + "them first."); }
  paintMarksBox();
}
function markOf(no, key){
  return (MARKS[no] && MARKS[no][key]) || {};
}
/* ONE CONTROL, THREE STATES, AND IT COMES BACK ROUND.
   ready -> not ready -> not required -> ready. The cycle is what makes every
   state reversible: a mark he cannot take off is a deletion.
   THE STORED SHAPE DOES NOT CHURN. readiness.json still carries the two
   booleans, and a state sets exactly ONE of them and clears the other, so a
   file written by the two-checkbox build reads correctly here and a file
   written here reads correctly anywhere. Both-true is not a state this button
   can reach; if a hand-edited file carries it, notRequired wins, which is the
   same precedence the generator uses. */
var CYCLE = { quiet: "loud", loud: "off", off: "quiet" };
var GLYPH = { quiet: "·", loud: "!", off: "–" };
var NOWSAY = { quiet: "ready", loud: "NOT READY", off: "not required" };
var NEXTSAY = { quiet: "not ready", loud: "not required", off: "ready" };
function stateOf(no, key){
  var m = markOf(no, key);
  return m.notRequired ? "off" : m.notReady ? "loud" : "quiet";
}
function setState(no, key, st){
  MARKS[no] = MARKS[no] || {};
  if (st === "quiet") { delete MARKS[no][key]; }
  else if (st === "loud") { MARKS[no][key] = { notReady: true }; }
  else { MARKS[no][key] = { notRequired: true }; }
  if (MARKS[no] && !Object.keys(MARKS[no]).length) delete MARKS[no];
  saveMarks();
}
function paintMarksBox(){
  document.getElementById("dy-marks-out").value =
    JSON.stringify({ marks: MARKS }, null, 2);
}

/* the row's three voices, recomputed in the page when a box is ticked. The
   system's own verdict is baked into the row as data-fault and is never
   changed here \\u2014 his mark overrides it, it does not erase it. */
function paintRow(row){
  var key = row.getAttribute("data-el");
  var no = Number(row.closest(".dy-day").getAttribute("data-day"));
  var m = markOf(no, key);
  var fault = row.getAttribute("data-fault") === "1";
  row.className = "dy-el " + (m.notRequired ? "off" : (m.notReady || fault) ? "loud" : "quiet");
  /* the row's own markup is never rewritten \\u2014 CSS picks the voice. Only the
     two hints move, because what they READ has changed. */
  var says = row.querySelector(".dy-say"), off = row.querySelector(".dy-off-say");
  if (says) hint(says,
    "NOT READY TO PUBLISH. Either the system's own rules say so, or you have marked it NOT "
    + "READY even though it passes \\u2014 your mark overrides the system.",
    fault ? "READS  the system's own rules" : m.notReady ? "READS  your mark" : "READS  ready");
  if (off) hint(off,
    "deemed not required, not presented \\u2014 regardless of what the system says. Its lines "
    + "are not drawn. Clear the box to bring it back.",
    m.notRequired ? "READS  you have marked this not required" : "READS  unmarked");
  var btn = row.querySelector(".dy-st");
  if (btn) {
    var st = m.notRequired ? "off" : m.notReady ? "loud" : "quiet";
    btn.setAttribute("data-state", st);
    btn.textContent = GLYPH[st];
    btn.setAttribute("aria-label", NOWSAY[st]);
    hint(btn,
      "READY, NOT READY, NOT REQUIRED \u2014 press it to go round. NOT READY is yours even "
      + "when the system's test passes; NOT REQUIRED takes it out of the summary regardless "
      + "of what the system says. A third press comes back to ready.",
      "READS  " + NOWSAY[st] + " \u2014 press for " + NEXTSAY[st]);
  }
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
  bar.innerHTML = (MARKSBAR[n]||[]).map(function(o){
    return '<span class="dy-ic ' + o.s + '" title="' + hintAttr(o.w, o.r) + '">'
      + '<b>' + o.k + '</b></span>';
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

/* the viewer \\u2014 inline pictures at one size, no path anywhere.
   THE LIST IS DEDUPED BY ADDRESS: two attachments may name one file, and the
   same picture twice in a walk is a walk that lies about how many pages
   there are. */
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
  var img = document.getElementById("dy-vimg");
  img.src = big || el.getAttribute("src");
  img.alt = el.getAttribute("alt") || "";
  hint(img, HINT_IMG, "READS  " + (big ? "the viewer's size" : "this picture is held at one size only"));
  var fig = el.closest(".dy-file");
  var nm = fig && fig.querySelector(".n") ? fig.querySelector(".n").textContent
    : (el.getAttribute("alt") || "");
  var cap = fig && fig.querySelector(".cap") ? fig.querySelector(".cap").textContent : "";
  document.getElementById("dy-vname").textContent =
    nm + "   (" + (VIEW.k+1) + " of " + VIEW.list.length + ")";
  document.getElementById("dy-vcap").textContent = cap;
}
function vstep(d){ if(!VIEW) return; VIEW.k = (VIEW.k + d + VIEW.list.length) % VIEW.list.length; draw(); }
function closeView(){ document.getElementById("dy-view").className = ""; VIEW = null; }

document.addEventListener("click", function(ev){
  var t = ev.target;
  /* the state button, and it is the first thing tested because it sits inside
     a row that is also clickable furniture. */
  var b = t.closest && t.closest(".dy-st");
  if (b) {
    var row = b.closest(".dy-el");
    var no = Number(b.closest(".dy-day").getAttribute("data-day"));
    var key = b.getAttribute("data-key");
    setState(no, key, CYCLE[stateOf(no, key)]);
    paintRow(row);
    return;
  }
  var g = t.closest && t.closest("[data-go]");
  if (g) { show(Number(g.getAttribute("data-go"))); return; }
  var z = t.closest && t.closest("img[data-zoom]");
  if (z) { openView(z); return; }
  var p = t.closest && t.closest("img[data-zoomsrc]");
  if (p) { VIEW = { list: [p], k: 0 };
    draw(); document.getElementById("dy-view").className = "on"; return; }
});
document.getElementById("dy-prev").addEventListener("click", function(){ step(-1); });
document.getElementById("dy-next").addEventListener("click", function(){ step(1); });
document.getElementById("dy-vx").addEventListener("click", closeView);
document.getElementById("dy-vp").addEventListener("click", function(){ vstep(-1); });
document.getElementById("dy-vn").addEventListener("click", function(){ vstep(1); });

/* A CLIPBOARD WRITE IS NOT DONE UNTIL IT HAS BEEN READ BACK (OPERATIONS U2).
   Three sentences, never one, and the text is selected first so Ctrl+C works
   whichever way the write goes. */
document.getElementById("dy-marks-copy").addEventListener("click", function(){
  var box = document.getElementById("dy-marks-out");
  var said = document.getElementById("dy-marks-said");
  box.focus(); box.select();
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    said.textContent = "not verified \\u2014 press Ctrl+C, the text is selected"; return;
  }
  navigator.clipboard.writeText(box.value).then(function(){
    return navigator.clipboard.readText();
  }).then(function(back){
    said.textContent = (back === box.value)
      ? "VERIFIED \\u2014 " + box.value.length + " characters are on the clipboard"
      : "the clipboard did not take it \\u2014 press Ctrl+C, the text is selected";
  }).catch(function(){
    said.textContent = "not verified \\u2014 press Ctrl+C, the text is selected";
  });
});

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

loadMarks();
/* paintRow reads the store and repaints the row and its button, so the boot
   pass is the same call the click makes — the baked-in state and the live
   state cannot disagree about how a row is drawn. */
document.querySelectorAll(".dy-el").forEach(paintRow);
paintMarksBox();

var want = Number(String(location.hash || "").replace("#","")) || DAYS[0].no;
show(DAYS.some(function(d){ return d.no === want; }) ? want : DAYS[0].no);
</script>
`;

fs.writeFileSync(OUT, page({ title: "The day", css: CSS, body, favi: "\u{1F5D3}" }));

console.log(`\nwrote ${path.relative(REPO, OUT)}`);
console.log(`  ${days.length} days`);
days.forEach(d => {
  const secs = d.els.filter(x => x.kind === "section");
  const loud = d.els.filter(x => x.state === "loud");
  const off = d.els.filter(x => x.state === "off");
  const lines = secs.reduce((a, s) => a + s.lines, 0);
  const over = secs.filter(s => s.longest > BOX.chars).length;
  console.log(`     ${String(d.no).padStart(3, "0")}  ${d.date}  ${secs.length} section(s) / `
    + `${lines} line(s), ${d.els.filter(x => x.kind === "attachment").length} attachment(s), `
    + `${d.fileRows.length} file(s)`
    + (loud.length ? `  \u2014 ${loud.length} NOT READY: ${loud.map(x => x.header).join(", ")}` : "")
    + (off.length ? `, ${off.length} not required` : "")
    + (over.length === 0 && over ? "" : over ? `, ${over} past the box` : ""));
});
console.log(`  the box: ${BOX.chars}ch on every element \u2014 the museum's own body measure. `
  + `The two fields that have a limit carry a mark instead, from ${NEAR} characters out.`);
console.log(`  his marks: ${Object.keys(loadMarks()).length} day(s) carry one in `
  + `${path.relative(REPO, READINESS)}`);
console.log(`  the day's pictures: ${VIEW_PX}px, ${big.made} made, ${big.hits} cached, `
  + `${big.stretched} contrast-stretched`);
console.log(`  the viewer: ${ZOOM_PX}px, ${zoom.made} made, ${zoom.hits} cached, `
  + `${zoom.stretched} contrast-stretched`);
console.log(`  the shelf: ${shelf.length} rows, ${small.made} made, ${small.hits} cached, `
  + `${small.stretched} contrast-stretched`);
console.log(`  not shown on the shelf: ${drop.ruled} ruled out, ${drop.neverPublished} never published, `
  + `${drop.absent} with no file, ${drop.superseded + drop.elsewhere} robots-repo rows`);
console.log(`\nserve it \u2014 the viewer is inline, so a served page works:`);
console.log(`  npm run mock 8931   \u2192  http://127.0.0.1:8931/dictation-20260807/day.html`);
