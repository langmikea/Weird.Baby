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

   PASS FOUR, and the shape settled at the end of it — *"Done! Looks great!"*:
     · THE RECORD SCROLLS, NOT THE PAGE. The bar, the calendar and the shelf
       stay put; see the layout block in the CSS.
     · THE CUMULATIVE INDENT WAS THE SOURCE'S OWN LEADING SPACES, not nesting —
       `dedent()`, which carries the measurement that found it.
     · AND THEN THE TOP BAR WENT. It was a legend of the same seven marks the
       calendar rows carry, one line above them; the rows are how five days are
       read at a glance and the legend was furniture. `MARKSBAR`, `hintAttr`
       and the whole `.dy-top` strip left with it rather than being left
       computed for nobody — see `COLUMNS`.

   ── [MIKE, 2026-08-25 — RULING A] THIS PAGE IS WHERE HE WRITES ────────────
   **THE BIGGEST RULING OF THAT DAY, AND AS OF 2026-08-26 IT IS BUILT.** He
   ruled that the day editor becomes his writing surface and that **Excel stops
   being the surface** — which makes `npm run record:workbook` a RESCUE PATH
   rather than the road, and it says so at the head of `workbook_to_draft.py`.

   **THE ORDER HELD.** Editing came AFTER the round-trip repair (`a3356c6`),
   because the draft silently ate `wire` and `plates` until then — Record 013's
   defect — and a surface that loses a field the moment he types into it would
   lose his words on its first day. `C-day1` closed with it; what the
   build found in its place is `C-day2`, and it is the one thing still between
   this page and an ordinary writing day.

   ── PIECE 4 — WHAT TAKES A KEYSTROKE, AND WHAT GUARDS IT ───────────────────
   **WHAT HE ASKED FOR:** *"I can edit any line and add sections on demand."*
   *"How do I delete a row? Insert a row?"* — and the section recipe, verbatim,
   as a specification. All of it is built and each half is argued where it
   stands: `elementHtml` for the recipe, `blocksOf` for how a body becomes
   boxes, the two controls in `rowControls`, `dy-add` for a section on demand.

   **THE SAVE IS A POST TO A LOOPBACK SERVER AND IT WRITES TWO FILES:**
   `record-draft.json` (his words) and `readiness.json` (his marks), together,
   on Ops' ruling that a page where half the state is durable and half is a
   clipboard is the shape that loses work. **IT NEVER WRITES THE RECORD** —
   that is `npm run record:land -- --write`, it is behind eight guards, and it
   is Mike's. Every sentence the page and the endpoint print says so.

   **THE GUARD THIS PIECE COULD NOT SHIP WITHOUT.** A generated page is a
   SNAPSHOT, and until today it did not know which tree it came from: type into
   a tab opened this morning, save this afternoon, and the POST stamps `saved`
   HONESTLY at the moment of saving — so `record:land`'s guard 8, which
   compares the STAMP and not the WORDS, passes it and this morning's copy
   lands on top of the afternoon's. **It is OPERATIONS §8's workbook hazard one
   surface over.** So `SOURCE_STATE` puts the source file's sha256 in the page,
   the endpoint refuses a save that does not match the file on disk NOW, and
   the page re-asks on every focus. Both ends, on Ops' ruling — the server
   because it is the thing that writes, the page because it is the only end
   that can tell him in time.

   **AND IT IS PROVED BY LOSING SOMETHING FIRST.** `npm run day:proof` runs
   P1 (a keystroke survives to the tree, field set as well as prose), P2 (the
   stale page is refused — demonstrated by first LANDING the loss with the
   guard off and naming the destroyed paragraph) and P3 (a deletion is never
   silent). **Each one is shown FAILING against a deliberately broken build
   before it is shown passing**, because a guard with only a clean run behind
   it proves nothing.

     npm run day          build it
     npm run day:proof    prove it
     npm run day:serve    write in it       http://127.0.0.1:8899/
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import crypto from "node:crypto";

import { esc, page, OPS_CSS } from "./shell.mjs";
import { thumbnails } from "./lighttable.mjs";
import { buildShelf, SECTIONS } from "./shelf.mjs";
import { draftEntries, entries as recordEntries, summaries, RECORD_SOURCE }
  from "../../reveal/record-entries.mjs";
import { BUDGETS, CONSTRAINTS, TITLE_BUDGET_MEASURED } from "../../reveal/record-shape.mjs";
import { STAGE_PREFIX } from "../../reveal/placement.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const OUT = path.join(REPO, "docs", "dictation-20260807", "day.html");
const TABLE = path.join(REPO, "provenance", "asset-table.json");
const FRESH = process.argv.includes("--fresh");

/* ═══ [PIECE 4] THE COLLECTOR IS INLINED, NOT REIMPLEMENTED ════════════════
   `day-collect.js` turns the boxes back into a Record entry, and the page and
   `npm run day:proof` load THE SAME BYTES — the page by having them pasted in
   here, the proof by reading the file and evaluating it. The proof asserts the
   two are byte-identical by sha256 before it runs a check, because a proof
   that passes against a second copy of the collector proves nothing about the
   collector he is typing into. */
const COLLECT_JS = fs.readFileSync(path.join(HERE, "day-collect.js"), "utf8");

/* AND THE GENERATOR EVALUATES IT RATHER THAN CARRYING A COPY. The first build
   of this piece had `blocksOf` here and `blockOut` there, and for as long as
   that lasted the arrangement of boxes DRAWN and the arrangement of boxes SAVED
   were two functions that happened to agree. Those are the two things on this
   page that must never be able to disagree — a body grouped one way and
   ungrouped another loses a paragraph boundary silently — so there is one
   function and all three callers reach it the same way. */
const WBDay = (new Function(COLLECT_JS + "\n;return globalThis.WBDay;"))();

/* ═══ [PIECE 4] WHICH RECORD THIS PAGE WAS BAKED FROM ══════════════════════
   **THE PAGE IS A SNAPSHOT AND UNTIL TODAY IT DID NOT KNOW WHICH TREE IT CAME
   FROM.** That is the loss the whole of Piece 4 was gated on: he opens the
   page at 09:00, the tree moves at 14:00, he types and saves at 16:00, and the
   POST stamps `saved` = 16:00 HONESTLY — so `record:land`'s guard 8, which
   compares the STAMP and not the WORDS, passes it, and 09:00's copy of the
   Record lands on top of 14:00's.

   IT IS OPERATIONS §8's WORKBOOK HAZARD ONE SURFACE OVER: that guard is inert
   on the workbook path for exactly the same reason, because
   `workbook_to_draft.py` stamps `saved` with `now()`. A generated page that
   stamps at POST time has the identical defect.

   SO THE SHA GOES IN THE PAGE. It travels with every save; `record-serve.mjs`
   refuses a save whose sha is not the file on disk NOW, and the page asks
   `/day/source` whenever it regains focus so he finds out before he has typed
   for an hour rather than at the moment he tries to keep it. **Both ends, on
   Ops' ruling** — the server because it is the thing that writes, the page
   because it is the only end that can tell him in time. */
const RECORD_EPOCH_VALUE = draftEntries().epoch;
const SOURCE_FILE = path.join(REPO, RECORD_SOURCE);
const SOURCE_STATE = {
  file: RECORD_SOURCE,
  sha256: crypto.createHash("sha256").update(fs.readFileSync(SOURCE_FILE)).digest("hex"),
  mtime: fs.statSync(SOURCE_FILE).mtime.toISOString(),
  bytes: fs.statSync(SOURCE_FILE).size,
};

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

/* ═══ A HINT IS ONE LINE, AND THE CEILING IS IN THIS FUNCTION ══════════════
   `[SHAPE]` MIKE, 2026-08-26: **"Kill the giant hover hint boxes - way too
   much to bother reading any of it."**

   MEASURED BEFORE ANYTHING WAS CUT: **484 hints, 98,378 characters, every one
   of them two lines, median 161 characters and the longest 894.** A hint that
   long is not help — it is a paragraph that arrives when the pointer stops
   moving, and **a hint nobody reads is worse than no hint, because it looks
   like help.**

   ── WHAT WAS CUT, AND THE RULE THAT DECIDED EACH ONE ───────────────────────
   OPS, 2026-08-26: *cut them down, do not cut them out. A mark whose meaning
   is not obvious still needs a word.* So the test is **can the thing already
   speak for itself**, and it answers most of them:

     · A GLYPH OR A ONE-LETTER MARK cannot. The state button, the seven
       calendar letters, the door chip — these KEEP a hint, and it is a few
       words plus what they read.
     · ANYTHING ALREADY LABELLED IN WORDS ON THE GLASS loses its hint outright.
       A box whose title says EXECUTIVE SUMMARY does not need a sentence saying
       it is a section's lines; a filename under a tile does not need a hint
       reading the filename back. That was most of the 98,378 characters.
     · A LIVE NUMBER WORTH A GLANCE survives as numbers only — `9 lines ·
       longest 45/68` — with no sentence around it.

   ── THE SECOND LINE IS GONE ENTIRELY ───────────────────────────────────────
   The old scheme was MEANING then READING, and the meaning was **the same
   sentence every time that mark was drawn on any day.** It earned its place
   once and was furniture on every hover after. What is left is one line.

   ── AND THE CEILING IS ENFORCED HERE RATHER THAN WRITTEN DOWN ──────────────
   **Doctrine 25 records that this exact thing GROWS BACK** — `week1.html` was
   split for this complaint and the worksheet's masthead was seven paragraphs
   three rounds later. A ceiling in prose is a ceiling that grows back. **This
   one throws**, so a hint over `HINT_MAX` or carrying a newline stops the
   build by name and cannot reach him at all. */
const HINT_MAX = 60;
/* A READING THAT IS HIS — a section header, a shelf label — has no length this
   file controls, so it is cut to the ceiling rather than left to stop a build
   on the day he writes a long one. Everything Ops writes is short by hand and
   `hint()` throws if it is not; this is only for strings that arrive. */
const short = s => {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length <= HINT_MAX ? t : t.slice(0, HINT_MAX - 1) + "…";
};
function hint(says) {
  if (!says) return "";
  const s = String(says);
  if (s.includes("\n") || s.length > HINT_MAX) {
    throw new Error(`day.mjs: a hint is ONE line of at most ${HINT_MAX} characters. `
      + `This one is ${s.length}${s.includes("\n") ? " and has a line break" : ""}:\n  `
      + JSON.stringify(s));
  }
  return ` title="${esc(s)}"`;
}

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

/* [PIECE 4] IT MOVED TO `day-collect.js` AND THIS IS THE ONE CALL. The mark
   under a box he is TYPING into and the mark the generator bakes have to be
   one function: two would drift, and the one that drifted would be the one on
   the glass while he was writing to a limit. */
const budgetMark = (len, b) => WBDay.budgetMark(len, b, NEAR);

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
  /* [2026-08-26] THE SECOND HALF IS A HINT AND HINTS ARE ONE SHORT LINE NOW.
     It read *"this Record delivers it and it is still behind the door — npm run
     reveal:day -- --place moves it"* — 95 characters restating the chip that is
     six pixels away. The command is the only part a glance cannot get. */
  PLACE: ["not placed", "behind the stage door — reveal:day --place moves it"],
};
const word = f => (DOOR_SAYS[f.door] || ["unknown"])[0];

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

   > **[CLOSED 2026-08-26] THE DRAFT ONCE LOST `{pre}` TOO, AND IT DOES NOT
   > NOW.** Flagged here on 2026-08-25: `robots-record.js` declares 004's folder
   > tree as `{ pre: "…" }` and the museum draws it as an aligned Listing, but
   > `draftEntries()` handed this page a plain string, so the editor could not
   > tell a listing from a paragraph. **Repaired at `a3356c6`** with `wire` and
   > `plates`, and Piece 4 carries the marker the whole way: `blocksOf` gives a
   > `{pre}` item a box of its OWN — never grouped, because it contains blank
   > lines of its own and a blank-line split would cut one listing into three.
   > **`npm run day:proof` proves it by first removing that preservation and
   > watching the tree come back as prose.** */
/* [PIECE 4] THE ARITHMETIC MOVED TO `day-collect.js` AND THIS IS THE ONE
   CALL. It was reimplemented there when the editable box needed to COMPARE a
   box against its original, and two copies of this that ever disagreed would
   make an untouched box read as edited — which rewrites his indentation on a
   save he did not make. The reasoning above is why the cut exists; the file
   the page and the proof both load is where it now happens, once. */
const dedent = s => WBDay.dedent(s);

/* ═══ [PIECE 4] A SECTION'S BODY BECOMES BOXES ═════════════════════════════
   HIS RECIPE IS ONE TEXT BOX PER SECTION, and a section's body is a LIST of
   items the museum draws one paragraph each. So the consecutive string items
   are grouped into ONE box with a blank line between them — the boundary every
   writer already uses — and a `{pre}` item gets a box of its own.

   THE `{pre}` ITEM IS ALONE FOR A REASON AND IT IS 004's FOLDER TREE. It
   carries blank lines inside itself and the museum draws it as an aligned
   Listing; grouped, a blank-line split would cut one listing into three and
   two of them would come back as prose. Alone, it is one item in one box and
   there is no split to get wrong — **it is fully editable and it comes back
   `{pre}`.** The reasoning is at the split in `day-collect.js`; this is the
   half that builds what that half reads.

   AN UNKNOWN SHAPE GETS A BOX THAT DOES NOT TAKE A KEYSTROKE. The reader only
   produces strings and `{pre}` today. If a third arrives, drawing it read-only
   and passing it through is the only thing that cannot lose it. */
/* THE GROUPING IS `day-collect.js`'s, EVALUATED ABOVE — see that file's
   header for the {pre} argument. This is a call, not a second copy. */
const blocksOf = items => WBDay.blocksOf(items);

/* `blocks` IS THE TRUTH AND `runs` IS DERIVED FROM IT, so the drawn text and
   the saved text cannot come from two different arrangements of the same body.
   A caller that has no blocks (an attachment) still passes `runs`. */
function element({ key, icon = null, header, runs, blocks = null, kind = "section",
                   fault = null, extra = {} }) {
  const bl = blocks || blocksOf((runs || []).filter(r => r != null && r !== ""));
  const list = bl.map(b => b.text);
  return {
    kind, key, icon, header,
    blocks: bl,
    runs: list,
    /* what came off, so the hint can say it and never remove it silently. */
    indentCut: bl.length ? Math.max(...bl.map(b => b.cut)) : 0,
    lines: list.reduce((a, r) => a + String(r).split("\n").length, 0),
    longest: list.reduce((a, r) => Math.max(a, ...String(r).split("\n").map(x => x.length)), 0),
    empty: !list.length,
    /* `[PIECE 4]` WHAT A ROW LETS HIM DO. `editHeader` is his own words in the
       title box — true only for a section HE authored; HEADLINE and DECK are
       Ops' labels for his fields and renaming them would rename a field.
       `field` names the entry key a field row edits. `locked` is a row whose
       shape this editor will not author. */
    editHeader: false, field: null, locked: false, canDelete: false,
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
          budget: BUDGETS.title, measured: TITLE_BUDGET_MEASURED,
          field: "title", oneLine: true },
      }));

      /* the deck, as a section. Not one of the three, but it has the other
         gate, and Record 002 sits two characters from it. */
      /* `[PIECE 4]` IT DRAWS WHETHER OR NOT IT CARRIES ANYTHING NOW, and that
         is the field-draws-when-it-carries rule meeting an editor. On a
         read-only page an absent deck was correctly invisible — *"things not
         required are not displayed"*. On a writing surface an invisible field
         is a field he cannot start, so the ONE gate that has a budget and no
         mandatory letter draws its empty box. The other absent fields stay
         absent and arrive through ADD A FIELD, which is the same rule with a
         door on it. */
      els.push(element({
        key: "field:line", header: "DECK",
        runs: e.line ? [e.line] : [],
        fault: e.line && e.line.length > BUDGETS.line.max
          ? { says: `${e.line.length}/${BUDGETS.line.max}`, why: BUDGETS.line.enforcedBy }
          : null,
        extra: { mark: e.line ? budgetMark(e.line.length, BUDGETS.line) : null,
          budget: BUDGETS.line, field: "line", oneLine: true },
      }));

      /* his authored sections, in his order, matched to the mandatory letters
         on the header he wrote. */
      for (const x of (e.sections || [])) {
        const header = x.label || null;
        const blocks = blocksOf(x.body || []);
        const m = MANDATORY.find(z => z.header === String(header || "").toUpperCase());
        els.push(element({
          key: "section:" + String(header || "(no header)"),
          icon: m ? m.icon : null,
          header, blocks,
          fault: blocks.length ? null
            : { says: "no lines", why: "a section with an empty body is dropped ENTIRELY, its header with it, and nothing says so" },
          /* `[PIECE 4]` HIS OWN SECTION: his words in the title box, and the
             row can be deleted and can have one inserted after it. A MANDATORY
             one is deletable too — deleting it does not hide it, it makes it
             draw LOUDLY as not written, which is the state the list already
             had a shape for. A control that refused would be Ops deciding what
             his day contains. */
          extra: { editHeader: true, canDelete: true },
        }));
      }

      /* every OTHER field that carries something, in the same recipe. None of
         the five Records has one; the path exists so that the day one does,
         the page draws it instead of hiding it. `stamp` joined this list on
         2026-08-25 with the round-trip repair: the reader carries it now, and a
         field the reader carries and this page hides is the same silent hole
         one surface further on. */
      for (const [k, head] of [["lead", "LEAD"], ["tomb", "TOMBSTONE"],
                               ["still", "STILL"], ["stamp", "STAMP"],
                               ["wire", "WIRE"], ["plates", "PLATES"],
                               ["note", "NOTE"]]) {
        if (e[k] == null || e[k] === "") continue;
        const isStr = typeof e[k] === "string";
        const v = isStr ? e[k] : JSON.stringify(e[k], null, 1);
        /* [2026-08-25] `locked` CAME OFF HERE, and its going is the round-trip
           repair landing. It marked `wire`, `plates` and `note` as fields that
           render on the glass and CANNOT survive the draft — true when it was
           written and false as of today: `draftEntries` carries all three and
           `record:land` writes them back. A flag that still said so would be
           this page telling him a repaired thing is still broken. */
        /* `[PIECE 4]` A STRING FIELD TAKES A KEYSTROKE; A LIST DOES NOT.
           `wire` is an array of strings and `plates` is an array of
           `{img,label}`. The round-trip repair taught the reader and the
           emitter to CARRY both, and this row carries them through untouched
           — they are in `rest` and are spread back on save whether or not a
           box on this page has ever heard of them. **What this editor will not
           do is AUTHOR one**: a textarea holding JSON is a shape editor
           wearing a text box, and the first malformed bracket would be his
           words turned into a parse error. It is drawn, it is labelled locked,
           and the hint says which instrument owns it. */
        els.push(element({
          key: "field:" + k,
          header: head + (k === "still" && e.stillCaption ? " — " + e.stillCaption : ""),
          runs: [v],
          extra: isStr ? { field: k } : { locked: true },
        }));
      }

      /* a mandatory section that is NOT THERE. It cannot speak for itself, so
         the list speaks for it — drawn in place, loud, with no lines. */
      for (const m of MANDATORY) {
        if (els.some(x => x.key === m.key)) continue;
        els.push(element({
          key: m.key, icon: m.icon, header: m.header, runs: [],
          fault: { says: "not written", why: "a mandatory section. Headline, Executive Summary and Detailed Report are the three every day has" },
          /* `[PIECE 4]` IT IS A BOX HE CAN WRITE INTO, NOT A COMPLAINT.
             Read-only, this row's whole job was to say an absent thing is
             absent. On a writing surface a row that names what is missing and
             gives him nowhere to put it is furniture — so the header is
             prefilled with the vocabulary the match is made on and the lines
             box is empty and waiting. **It stays LOUD until it carries lines**,
             and it writes nothing while it is empty (`day-collect.js`), so
             opening the page and saving it cannot invent a section. */
          extra: { missing: true, editHeader: true, canDelete: true },
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

      /* ═══ [PIECE 4] `rest` — EVERY FIELD THIS PAGE DOES NOT EDIT ═════════
         **THE ONE THING THAT DECIDES WHETHER A SAVE LOSES A FIELD.** The
         repair at `a3356c6` taught the reader and the emitter fourteen entry
         fields and eight doc fields. This page edits five strings and the
         sections. **Everything else is copied here verbatim and spread back
         out by `collect()` whether or not this file has ever heard of it** —
         `docs` with its sources, page counts and plate captions, `wire`,
         `plates`, `stillCaption`, and whatever the next repair adds.

         A COLLECTOR THAT REBUILT AN ENTRY FROM THE BOXES ON THE GLASS WOULD
         DROP EVERY ONE OF THEM, AND THE EMITTER COULD NOT REFUSE IT: its
         guard names a field it cannot WRITE, and an absent field is not
         something it can see. That is exactly how six photographs and four
         sources went missing on 2026-08-25 while the tool printed *"ALL 51
         STRINGS ROUND-TRIP"*. `P1` deletes this spread on purpose and proves
         the check names what went. */
      const EDITED_HERE = new Set(["no", "date", "sections",
        "stamp", "title", "line", "lead", "still", "tomb", "note"]);
      const rest = {};
      for (const k of Object.keys(e)) if (!EDITED_HERE.has(k)) rest[k] = e[k];

      return {
        no: e.no,
        date: e.date || null,
        weekday: e.date ? WD[new Date(e.date + "T12:00:00Z").getUTCDay()] : null,
        title: e.title || null,
        line: e.line || null,
        indexTitle: s.title || null,
        els, docs, fileRows, orphans, rest,
        braces: bracesIn(e),
      };
    });
}

/* ═══ THE FIXED COLUMNS ════════════════════════════════════════════════════
   `[SHAPE]` the mechanism · `[WEIRD.BABY]` which seven.

   MIKE, 2026-08-25: **"Keeping the icons in predefined columns is still a
   plus."** So a day's marks are SEVEN COLUMNS IN ONE ORDER, on every day, and
   a column that has nothing to say is still there and still empty — the eye
   learns a position once and reads it forever after. A row that packs itself
   is a row he has to read from the left every time.

   THEY ARE DRAWN IN EXACTLY ONE PLACE: A CALENDAR ROW. There was a legend of
   the same seven across the top of the page and **Mike killed it the same day
   he settled the shape** — it was only a KEY for the rows, and the rows are
   where five days are read at a glance. A key that repeats the thing it
   explains, one line above it, is furniture (Doctrine 16), and it cost the
   page its whole top strip. `dayMarks()` has one caller now, which is what
   this section was always describing.

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

/* ── [2026-08-26] `short` REPLACED `w` AND `r` ────────────────────────────
   A calendar mark is a LETTER, so it is exactly the case Ops kept hints for:
   it cannot say what it is. But it was saying it in two lines and about 190
   characters — the same explanation of what loud, quiet and empty mean, on
   every one of the thirty-five marks, on every hover, forever.

   **THE NAME AND THE READING ARE THE WHOLE HINT NOW:** `EXECUTIVE SUMMARY ·
   ready`, `the files · 2 behind the door`. What the letter stands for is the
   half a glance cannot get; what the three weights mean is learned once from
   the colours and never needs saying again. */
function dayMarks(d) {
  const byKey = k => d.els.find(x => x.key === k);
  const mand = k => {
    const el = byKey(k);
    if (!el) return { s: "loud", says: "not written" };
    if (el.notRequired) return { s: "off", says: "not required" };
    if (el.notReady) return { s: "loud", says: "your mark" };
    if (el.fault) return { s: "loud", says: el.fault.says };
    return { s: "quiet", says: "ready" };
  };
  /* THE CEILING IS ENFORCED IN `hint()` AND THIS IS THE ONE PLACE A READING
     CAN RUN LONG — a section header is his and can be any length. It is cut
     here rather than left to throw the build on a day he writes a long one. */
  const line = (name, says) => {
    const s = `${name} · ${says}`;
    return s.length <= HINT_MAX ? s : s.slice(0, HINT_MAX - 1) + "…";
  };

  return COLUMNS.map(c => {
    if (c.of) {
      const st = mand(c.of);
      return { k: c.k, s: st.s, short: line(c.what.replace(/^the /, ""), st.says) };
    }
    if (c.k === "S") {
      const rest = d.els.filter(x => x.kind === "section"
        && !MANDATORY.some(m => m.key === x.key) && !x.notRequired);
      const loud = rest.filter(x => x.state === "loud");
      return { k: "S", s: loud.length ? "loud" : rest.length ? "quiet" : "off",
        short: line("other sections", loud.length ? `${loud.length} of ${rest.length} not ready`
          : rest.length ? `${rest.length}, all ready` : "none") };
    }
    if (c.k === "A") {
      const at = d.els.filter(x => x.kind === "attachment" && !x.notRequired);
      const loud = at.filter(x => x.state === "loud");
      return { k: "A", s: loud.length ? "loud" : at.length ? "quiet" : "off",
        short: line("attachments", loud.length ? `${loud.length} of ${at.length} not ready`
          : at.length ? `${at.length}, all ready` : "none") };
    }
    if (c.k === "P") {
      const un = d.fileRows.filter(f => f.door === "PLACE").length;
      return { k: "P", s: un ? "loud" : d.fileRows.length ? "quiet" : "off",
        short: line("files", un ? `${un} of ${d.fileRows.length} behind the door`
          : d.fileRows.length ? `${d.fileRows.length}, all public` : "none") };
    }
    return { k: "{}", s: d.braces.length ? "loud" : "quiet",
      short: line("notes to Ops", d.braces.length ? `${d.braces.length} unresolved` : "none") };
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

/* THE TOP BAR IS GONE - MIKE, 2026-08-25: it was only a KEY for the marks on
   the calendar rows, and the rows are where he reads across five days at once.
   A key that repeats the thing it explains, one line above it, is furniture. */
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

/* ═══ [PIECE 4] THE SAME BOX, TAKING A KEYSTROKE ═══════════════════════════
   THE EDITABLE BOX IS THE READ-ONLY BOX WITH A CARET IN IT. Every measurement
   the read-only box earned is load-bearing here and none of it is restated:
   68ch, the monospace face that makes a ch honest, content-box so the measure
   is the TEXT, the 14px indent, pre-wrap spacing. A control that reset any one
   of them would move his wrap warning, which is worse than not having one.
   SO THE RULES BELOW ONLY UNDO WHAT A FORM CONTROL BRINGS WITH IT — the UA's
   own font, its border, its background, its resize grip and its scrollbar. */
.dy-edit{font:inherit;color:inherit;background:#141310;border:1px solid #22201a;
  border-radius:2px;outline:none}
.dy-edit:hover{border-color:#3a3529}
.dy-edit:focus{border-color:var(--gold,#b8974a);background:#17150f}
/* THE MEASURE IS STILL THE TEXT, AND THE ARITHMETIC MOVED RATHER THAN THE
   RULE. The read-only box is content-box, because a block DIV's auto width
   already absorbs its own padding and border and 68ch then means 68 characters
   of text. A TEXTAREA does not do that: width:100% on a content-box textarea
   is the parent's width PLUS its padding, border and indent, so at 393px it
   hung 18px past the viewport and the page scrolled sideways - measured on the
   served page, and it is exactly 8+8+1+1 of chrome. Border-box plus a
   max-width widened by that same chrome gives a CONTENT box of 68ch, which is
   the property the honest-ch comment above is about, and a total that can
   never exceed its parent. Measured before and after: 447.94px at desktop,
   both ways, so nothing on the glass moved.
   AND THE INDENT MOVED TO THE WRAPPER for the same reason - a margin on a
   width:100% child is 14px of guaranteed overflow whatever the box-sizing. */
textarea.dy-box-l{display:block;width:100%;box-sizing:border-box;
  max-width:calc(68ch + 18px);margin:4px 0 0;padding:6px 8px;
  font-family:ui-monospace,Consolas,monospace;font-size:11.5px;line-height:1.5;
  white-space:pre-wrap;overflow:hidden;resize:none;opacity:.9}
/* EXPANDS — the height is set from the content by autosize() on every
   keystroke, so it has as many lines as he gives it. overflow:hidden is what
   makes that honest: with a scrollbar the box could be short AND full, and he
   would be typing into a porthole. */
input.dy-box-l.oneline{display:block;width:100%;box-sizing:border-box;
  max-width:calc(68ch + 18px);margin:4px 0 0;padding:6px 8px;
  font-family:ui-monospace,Consolas,monospace;font-size:11.5px;line-height:1.5}
.dy-box-l.locked{opacity:.62;border-style:dashed}
/* the one level under the title, carried by the wrapper so the boxes inside it
   can be width:100% and still fit. Same 14px, same one level, every section. */
.dy-blocks{margin-left:14px}
.dy-blocks>*+*{margin-top:6px}
/* THE TITLE BOX AS A CONTROL — bold, same box, and it must not stretch to the
   column or a two-word header would sit in a 68ch slab. */
.dy-th{display:flex;align-items:baseline;flex-wrap:wrap;gap:0 4px}
input.dy-box-t{width:auto;min-width:22ch;max-width:52ch;flex:0 1 auto}
input.dy-box-t::placeholder{font-weight:400;opacity:.4;letter-spacing:.04em}
/* [PIECE 4] THE TWO ROW CONTROLS, UNDER THE STATE BUTTON, IN ITS COLUMN. */
.dy-rw{display:block;width:1.7rem;height:.95rem;margin-top:3px;padding:0;cursor:pointer;
  font-family:inherit;font-size:10px;line-height:1;border-radius:2px;
  background:transparent;border:1px solid #22201a;color:inherit;opacity:.4}
.dy-rw:hover{opacity:1;border-color:var(--gold,#b8974a)}
.dy-rw:focus-visible{outline:2px solid var(--gold,#b8974a);outline-offset:1px}
.dy-del:hover{border-color:#c76a6a;color:#e89a9a}
/* DELETED IS A STATE, NOT AN ABSENCE. Every character is still on the page and
   still in the box; the row leaves only when the save lands and the page is
   rebuilt. A control he cannot take back is a deletion. */
.dy-el.gone .dy-box-t,.dy-el.gone input.dy-box-t{text-decoration:line-through;opacity:.4}
.dy-el.gone .dy-blocks,.dy-el.gone .dy-box-l{opacity:.28}
.dy-el.gone .dy-edit{pointer-events:none}
.dy-el.gone .dy-del{border-color:var(--gold,#b8974a);color:var(--gold,#b8974a);opacity:1}
.dy-gone-say{display:none}
.dy-el.gone .dy-gone-say{display:inline-block;margin-left:8px;font-size:10px;
  letter-spacing:.08em;color:var(--gold,#b8974a);font-weight:700}
.dy-addsect{margin:10px 0 0 1.7rem}
.dy-addsect button{font-family:inherit;font-size:11px;padding:5px 11px;cursor:pointer;
  background:transparent;border:1px dashed var(--rule,#3a3529);color:inherit;border-radius:2px;opacity:.75}
.dy-addsect button:hover{opacity:1;border-color:var(--gold,#b8974a);border-style:solid}

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
/* ═══ [PIECE 4] THE STALE BANNER ═══════════════════════════════════════════
   IT IS THE LOUDEST THING THIS PAGE CAN DRAW AND THAT IS PROPORTIONATE. It
   means the Record moved under an open tab, so every box on the screen is a
   copy of something that has already been superseded, and a save from here
   would pass the lander's staleness guard with a true timestamp on stale
   words. It sits above everything, it does not close, and it takes the Save
   button with it. */
#dy-stale{display:none;margin:0 0 12px;padding:10px 12px;border:2px solid #c76a6a;
  border-radius:2px;background:#241616;color:#e89a9a;font-size:12px;line-height:1.55}
#dy-stale.on{display:block}
#dy-stale b{letter-spacing:.04em}
#dy-stale code{font-family:ui-monospace,Consolas,monospace;font-size:11px;opacity:.85}
.dy-marks button[disabled]{opacity:.3;cursor:default}
.dy-marks .said.good{color:var(--gold,#b8974a)}
.dy-marks .said.bad{color:#e89a9a}
/* THE CALENDAR READS THE BUILD, AND SAYS SO THE MOMENT IT STOPS BEING TRUE.
   The seven marks are computed by dayMarks() when the page is generated. The
   page does not recompute them, because a second implementation of the seven
   columns would drift from the one the generator uses and the one that drifted
   would be the one he is looking at. So when the model is dirty they DIM and
   the hint says what they are: the state as built. */
.dy-cal.dirty .row i{opacity:.25}
.dy-cal.dirty .row i.warn,.dy-cal.dirty .row i.bad{opacity:.4}
#dy-caldirty{display:none;font-size:10px;line-height:1.45;margin:6px 0 0;color:var(--gold,#b8974a)}
.dy-cal.dirty #dy-caldirty{display:block}
#dy-fb-out{display:block;width:100%;margin:6px 0 0;min-height:120px;
  background:#141310;color:inherit;border:1px solid #22201a;border-radius:2px;
  font-family:ui-monospace,Consolas,monospace;font-size:10.5px;line-height:1.45;padding:6px}

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
    ? `<span class="dy-count ${el.mark.level}"${hint(el.mark.short)}>${esc(el.mark.says)}</span>`
    : el.fault && el.fault.says && /\d\/\d/.test(el.fault.says)
      ? `<span class="dy-count bad"${hint("over the limit — the packet gate refuses it")
        }>${esc(el.fault.says)}</span>`
      : "";

  /* BOTH VOICES ARE ALWAYS IN THE MARKUP AND CSS DECIDES WHICH SPEAKS.
     The first cut rendered only the state the element was in, which made a
     mark a ONE-WAY DOOR: clearing NOT REQUIRED in the browser had nothing to
     put back, because the lines box had never been written. A mark he cannot
     take off is not a mark, it is a deletion — so every row carries its lines,
     its loud line and its quiet line, and the class on the row is the only
     thing that changes. */
  /* AND THE HINT ON EACH IS THE ONE THING THE WORD DOES NOT SAY. `NOT READY`
     is already legible; WHY it is not ready is not, so that is the hint and it
     is a few words. `not required` and `DELETED` both need only the way out. */
  const say = `<span class="dy-say"${hint(
      el.fault ? "why: " + el.fault.says : "your mark")
    }>NOT READY</span><span class="dy-off-say"${hint("press the button round to bring it back")
    }>not required</span><span class="dy-gone-say"${hint("press × again to undo")
    }>DELETED</span>`;

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
  /* ═══ [PIECE 4] DELETE A ROW. INSERT A ROW. ═══════════════════════════════
     MIKE, 2026-08-25: **"How do I delete a row? Insert a row?"**

     THEY SIT UNDER THE STATE BUTTON, IN THE COLUMN THAT WAS ALREADY FIXED.
     The row has one fixed column and it is the control column; adding a second
     column for two more controls would move every box on the page sideways to
     make room for something that is used once a day. The column stays 1.7rem
     and the two new controls are half-height under the one that was there.

     **AND ONLY A SECTION HAS THEM.** A FIELD is not a row in a list — there
     is one HEADLINE and deleting it means clearing it, which the box already
     does. An ATTACHMENT is `assign.html`'s until that piece lands, and a
     delete control over a row this page cannot author would be a button that
     destroys something it cannot put back.

     DELETE IS NOT A ONE-WAY DOOR EITHER, AND FOR THE SAME REASON THE MARKS ARE
     A CYCLE: the row goes to a DELETED state that still holds every character,
     drawn struck through with the control offering to bring it back, and it
     leaves the page only when the save lands and the page is rebuilt. **A
     control he cannot take back is a deletion, and this page has been caught
     doing that once already.** */
  const rowControls = el.canDelete
    ? `<button type="button" class="dy-rw dy-ins"${hint("insert a section below")
      }>+</button><button type="button" class="dy-rw dy-del"${hint(
        "delete — press again to undo")}>&times;</button>`
    : "";

  const control = `<div class="c"><button type="button" class="dy-st" data-key="${esc(el.key)}"
    data-state="${st}" aria-label="${esc(NOW[st])}"${hint(
      `${NOW[st]} · press for ${NEXT[st]}`)
    }>${GLYPH[st]}</button>${rowControls}</div>`;

  /* ═══ THE TITLE BOX — DISPLAYS BOLD, AND NOW IT TAKES HIS WORDS ══════════
     **IT IS AN `input` ONLY WHERE THE HEADER IS HIS.** A section's header is
     something he wrote and the mandatory match is made on it, so it is a box.
     HEADLINE, DECK, STAMP and NOTE are OPS' LABELS FOR HIS FIELDS — renaming
     one would not rename a heading, it would rename a field, and the entry
     would arrive at the emitter under a name nothing has ever read.

     THE BOX IS THE SAME BOX EITHER WAY. Same class, same bold, same border,
     so the column of boxes does not go ragged at the one row he is editing —
     which is the defect the three budget widths were killed for. */
  /* AND THE TITLE BOX HAS NO HINT AT ALL NOW. It carried four sentences about
     what a section header is, restating the words inside the box — and where
     the box was empty the `placeholder` already says SECTION HEADER. There was
     nothing in it a glance needed that the box was not already showing. */
  const titleBox = el.editHeader
    ? `<div class="dy-th"><input type="text" class="dy-box-t dy-edit" data-role="label"
        value="${esc(el.header || "")}" placeholder="SECTION HEADER">${mark}${say}</div>`
    : `<div class="dy-box-t">${esc(el.header || "(no header)")}${mark}${say}</div>`;

  /* THE LINES BOX — accepts crlf, expands, spaced as he wrote it, indented
     automatically, and ONE WIDTH, the same on every element on every day. */
  /* ── THE LINES BOX'S HINT IS NUMBERS, AND NOTHING ELSE ──────────────────
     IT WAS THE WORST ONE ON THE PAGE: 894 characters, four sentences about
     what a section's lines are and where 68ch comes from, on a box he is
     LOOKING AT and typing into. **The box is the measure — that was always the
     argument for the box** — so a paragraph restating it is the page not
     trusting its own design.
     WHAT SURVIVES IS THE PART A GLANCE CANNOT GET FROM LOOKING: how many
     lines, and how close the longest one is to the wrap. `45/68` is the same
     grammar as the budget mark, which is the only other number on the page. */
  const measure = (b) => {
    const lines = String(b.text).split("\n");
    const longest = Math.max(0, ...lines.map(x => x.length));
    return `${lines.length} line${lines.length === 1 ? "" : "s"} · longest ${longest}/${BOX.chars}`
      + (b.cut ? ` · ${b.cut} space${b.cut === 1 ? "" : "s"} off` : "");
  };

  /* ═══ [PIECE 4] THE BOX THAT TAKES THE KEYSTROKE ══════════════════════════
     HIS SPECIFICATION, UNCHANGED, NOW BUILT AS THE THING ITSELF:

       [Section text box that accepts crlf and expands.
        Width is sized to show me when I am going to risk wrapping a line.
        It is spaced like I show it, has as many lines as I give it.
        This section always displays indented automatically.]

     ACCEPTS CRLF — a `textarea`, so Enter is a line and not a submit.
     EXPANDS — `autosize()` in the page's script sets the height from the
     content on every keystroke, so it has **as many lines as he gives it** and
     never a scrollbar of its own. There is no rows= that means anything here.
     WIDTH SIZED TO WARN — the same `68ch` in the same monospace face as the
     read-only box, and `box-sizing: content-box` so the number is the TEXT.
     INDENTED — the same `margin-left:14px`, one level, every section.

     **ONE BOX PER BLOCK, AND `blocksOf()` IS WHY THERE IS EVER MORE THAN ONE.**
     A section's string paragraphs are one box with a blank line between them;
     a `{pre}` listing is its own box, because it carries blank lines and a
     split would cut a listing into three.

     AN EMPTY EDITABLE ROW STILL DRAWS A BOX. Read-only, *"no lines"* was the
     honest answer; on a writing surface it is a locked door. The row stays
     LOUD until the box carries something and the box writes nothing while it
     is empty, so opening the page and saving cannot invent a section. */
  const editBox = (b, i) => {
    const isPre = b.kind === "pre";
    const isOpaque = b.kind === "opaque";
    if (isOpaque) {
      return `<div class="dy-box-l locked"${hint("carried through your save · not editable here")
        }>${esc(b.text)}</div>`;
    }
    /* ONE LINE MEANS ONE LINE, AND THE CONTROL IS THE RULE. A HEADLINE and a
       DECK are single strings with a character budget that a gate enforces;
       an Enter inside one would put a newline through `reveal:check` and onto
       the glass. An `input` cannot take that keystroke, which is a limit shown
       WHERE THE STRING IS WRITTEN (Doctrine 22) rather than announced in a
       hint and enforced two commands later. */
    if (el.oneLine) {
      /* NO HINT. The box will not take a line break and the budget mark fires
         when the length matters; a sentence saying so is the third telling. */
      return `<input type="text" class="dy-box-l dy-edit oneline" data-role="block"
        data-uid="${esc(b.uid)}" data-cut="0" data-kind="strs" spellcheck="true"
        value="${esc(b.text)}">`;
    }
    return `<textarea class="dy-box-l dy-edit${isPre ? " pre" : ""}" data-role="block"
      data-uid="${esc(b.uid)}" data-cut="${b.cut}" data-kind="${esc(b.kind)}"
      spellcheck="true"${hint(isPre ? "a listing — it stays one however you edit it"
        : measure(b))}>${esc(b.text)}</textarea>`;
  };

  const linesBox = el.kind === "attachment"
    ? attachmentBody(el)
    : el.locked
      ? `<div class="dy-box-l locked"${hint("carried through your save · not editable here")
        }>${el.runs.map(r => `<p>${esc(r)}</p>`).join("")}</div>`
      : el.field || el.editHeader
        ? `<div class="dy-blocks">${
            (el.blocks.length ? el.blocks : [{ uid: "n" + esc(el.key), kind: "strs", cut: 0, text: "" }])
              .map(editBox).join("")}</div>`
        : el.empty
          ? `<div class="dy-box-l void">no lines</div>`
          : `<div class="dy-box-l"${hint(
              `${el.lines} line${el.lines === 1 ? "" : "s"} · longest ${el.longest}/${BOX.chars}`)
            }>${el.runs.map(r => `<p>${esc(r)}</p>`).join("")}</div>`;

  return `<li><div class="dy-el ${el.state}" data-el="${esc(el.key)}" data-fault="${el.fault ? 1 : 0}"${
    el.editHeader ? ` data-sect="1"` : ""}${el.field ? ` data-field="${esc(el.field)}"` : ""}${
    el.oneLine ? ` data-oneline="1"` : ""}${
    el.budget ? ` data-budget="${esc(JSON.stringify(el.budget))}"` : ""}>${control}
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
    <div class="m">${a.files.length} file${a.files.length === 1 ? "" : "s"}${a.source ? " · " + esc(a.source) : ""}${a.pages != null ? " · " + a.pages + " page" + (a.pages === 1 ? "" : "s") : ""}</div>
    ${rows.length ? `<div class="dy-files">${rows.map(f => {
      const t = TILES.byWeb.get(f.web);
      /* THE PLATE LABEL AND THE FILENAME LOST THEIR HINTS ENTIRELY: each one
         was a sentence introducing a string printed directly beneath it. The
         picture keeps four words because a thumbnail does not say it opens. */
      return `<figure class="dy-file">${
        t ? `<img src="${t}" alt="${esc(f.label || f.name)}" data-zoom="${esc(f.web)}"${
              hint("click to open the viewer")}>`
          : `<div class="noimg"${hint("no thumbnail — not read from disk")}></div>`}
  ${f.label ? `<div class="cap">${esc(f.label)}</div>` : ""}
  <div class="n">${esc(f.name)}</div>
  <span class="dr${f.door === "PLACE" || !f.onDisk ? " bad" : ""}"${hint(
      !f.onDisk ? "no file at that path on disk" : DOOR_SAYS[f.door] ? DOOR_SAYS[f.door][1] : "not in the plan")
    }>${esc(word(f))}${f.onDisk ? "" : " · not on disk"}</span>
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
  <p class="when">${d.weekday ? esc(d.weekday) + " " : ""}${esc(d.date || "no date")}</p>

  <div class="dy-sec"><h3>SECTIONS · ${sections.length}</h3>
    ${list(sections)}
    <div class="dy-addsect"><button type="button" class="dy-add"${hint(
      "for one in the middle, press + on a row")}>+ add a section</button></div>
  </div>

  <div class="dy-sec"><h3>ATTACHMENTS · ${atts.length}</h3>
    ${atts.length ? list(atts) : ""}
  </div>

  ${d.braces.length ? `<div class="dy-sec"><h3>UNRESOLVED NOTES TO OPS · ${d.braces.length}</h3>
    <table class="dy-t">${d.braces.map(b => `<tr><td${hint(
      "a note to Ops — the packet gate refuses it")}>{}</td><td>${esc(b)}</td></tr>`).join("")}</table></div>` : ""}

  ${d.orphans.length ? `<div class="dy-sec"><h3${hint(
    "a mark whose row was renamed or left")}>MARKS WITH NO ELEMENT · ${d.orphans.length}</h3>
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
  return `<button type="button" data-go="${d.no}" aria-current="false"${hint("open this day")}>
  <div class="d1">RECORD ${String(d.no).padStart(3, "0")}</div>
  <div class="d2">${esc(d.weekday || "")} ${esc(d.date || "")}</div>
  <div class="row">${mk.map(i => `<i class="${i.s}"${hint(i.short)}>${esc(i.k)}</i>`).join("")}</div>
</button>`;
}).join("");

const pickHtml = SECTIONS.map(s => {
  const items = shelf.filter(r => r.section === s.key);
  if (!items.length) return "";
  return `<div class="sec"><b>${esc(s.label)}</b><span>${items.length}</span>
  <div class="g">${items.map(r => {
    const t = small.thumbs.get(r.uid);
    return t
      /* THE SHELF TILE'S HINT IS ITS LABEL, AND THAT IS THE ONE PLACE ON THE
         PAGE WHERE A HINT EARNS MORE THAN THE THING IT SITS ON. A tile is
         52px and shows no caption, so the label is genuinely unobtainable by
         looking; "click to open the viewer" — which is what these 138 said
         after the first cut — is the same four words 138 times about a
         behaviour the first click teaches for good. */
      ? `<img src="${t}" alt="${esc(r.label)}" data-zoomsrc="${esc(r.uid)}"${
          hint(short(r.label))}>`
      : `<div class="noimg"${hint(short(r.label))}></div>`;
  }).join("")}</div></div>`;
}).filter(Boolean).join("");

const body = `
<div id="dy-storebanner"></div>
<div id="dy-stale"></div>
<template id="dy-newrow">${elementHtml(element({
  key: "section:", header: "", runs: [],
  extra: { editHeader: true, canDelete: true, state: "quiet",
    notReady: false, notRequired: false },
}))}</template>

<div class="dy-wrap">
  <details class="dy-panel dy-cal" open>
    <summary>THE DAYS · ${days.length}</summary>
    <div class="in">${calHtml}
      <p class="dy-note" id="dy-caldirty">These read the BUILD, not your edits. Save, then
        <code>npm run day</code>.</p>
      <p class="dy-note">Every day, with its seven marks in the same seven columns.
        A day with no entry is not drawn and is not a defect — which days get a
        Record is decided by which entries exist.</p>
    </div>
  </details>

  <div class="dy-mid">
    <div class="dy-nav" style="margin:0 0 10px">
      <button type="button" id="dy-prev"${hint("or the left arrow key")}>&lsaquo; previous day</button>
      <button type="button" id="dy-next"${hint("or the right arrow key")}>next day &rsaquo;</button>
      <span id="dy-where"></span>
    </div>
    ${days.map(d => dayHtml(d)).join("\n")}

    <div class="dy-marks" id="dy-savebox">
      <div class="h">SAVE · your words and your marks, in one</div>
      <p style="margin:6px 0 0">
        <button type="button" id="dy-save"${hint(
          "writes the draft, not the Record · Ctrl+S")}>Save to the repo</button>
        <span class="said" id="dy-save-said"></span>
      </p>
      <p class="dy-note" id="dy-save-where"></p>
      <div id="dy-fallback" hidden>
        <div class="h">THE WAY OUT — copy this and nothing is lost</div>
        <textarea id="dy-fb-out" readonly></textarea>
        <p style="margin:6px 0 0">
          <button type="button" id="dy-fb-copy"${hint(
            "copies, then reads it back to be sure")}>copy everything</button>
          <span class="said" id="dy-fb-said"></span>
        </p>
      </div>
    </div>
  </div>

  <details class="dy-panel dy-pick">
    <summary>THE SHELF · ${shelf.length}</summary>
    <div class="in">${pickHtml}
      <p class="dy-note">Piece one shows the shelf and takes no answer from it.
        Attachments are built on <b>assign.html</b> until Piece 4.</p>
    </div>
  </details>
</div>

<div id="dy-view"><div id="dy-vbar">
  <button type="button" id="dy-vx"${hint("or Escape")}>&times; close</button>
  <button type="button" id="dy-vp"${hint("or the left arrow key")}>&lsaquo;</button>
  <button type="button" id="dy-vn"${hint("or the right arrow key")}>&rsaquo;</button>
  <span id="dy-vname"></span>
  <span id="dy-vcap"></span>
</div><img id="dy-vimg" alt=""></div>

<script>
/* ═══ THE COLLECTOR, INLINED VERBATIM FROM tools/dictation/day-collect.js ═══
   Not a copy of it — the file's own bytes, pasted here by the generator, and
   npm run day:proof asserts these bytes and that file's are the same sha256
   before it runs a check. It defines globalThis.WBDay and nothing else. */
${COLLECT_JS}
</script>
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
var BIG = ${JSON.stringify(Object.fromEntries(bigByWeb))};
var BAKED = ${JSON.stringify(loadMarks())};
var STORE_KEY = ${JSON.stringify(MARK_STORE_KEY)};

/* ═══ [PIECE 4] WHAT THE SAVE IS BUILT FROM ════════════════════════════════
   REST is every field of every entry this page does NOT edit, kept whole and
   spread back by WBDay.collect. ORIG is what each box held when the page was
   built, so an untouched box can be recognised and its ORIGINAL string emitted
   byte for byte rather than the dedented copy he was shown. SOURCE is which
   Record the whole page was baked from. KEYS0 is the key set each day OPENED
   with, so a deletion can be named. */
var REST = ${JSON.stringify(Object.fromEntries(days.map(d => [d.no, d.rest])))};
var ORIG = ${JSON.stringify(Object.fromEntries(
  days.flatMap(d => d.els.flatMap(el =>
    (el.blocks || []).map(b => [b.uid, { raw: b.raw, cut: b.cut, kind: b.kind, items: b.items }])))
))};
var HEAD0 = ${JSON.stringify(Object.fromEntries(
  days.flatMap(d => d.els.filter(el => el.editHeader)
    .map(el => [el.key, el.header || ""]))))};
var SOURCE = ${JSON.stringify(SOURCE_STATE)};
var EPOCH = ${JSON.stringify(RECORD_EPOCH_VALUE)};
var BUDGETS = ${JSON.stringify({ title: BUDGETS.title, line: BUDGETS.line })};
var NEAR = ${NEAR};
var KEYS0 = {};
var HINT_IMG = ${JSON.stringify(`the viewer's size, ${ZOOM_PX}px`)};
var i = 0, VIEW = null;

/* ONE LINE, AND THE SAME CEILING THE GENERATOR ENFORCES. A hint written here
   is written while he is typing, which is exactly when a paragraph is worst.
   It cannot throw a build — nothing is being built — so it CUTS, and the
   generator side throws instead, which is where a long one would come from. */
var HINT_MAX = ${HINT_MAX};
function hint(el, says){
  var s = String(says || "").replace(/\\n/g, " ");
  el.setAttribute("title", s.length > HINT_MAX ? s.slice(0, HINT_MAX - 1) + "\u2026" : s);
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
/* [PIECE 4] THE MARKS BOX IS GONE AND THE MARKS TRAVEL WITH THE WORDS.
   It was a clipboard with no writer — "copy this and Ops lands it" — which
   is a page where half the state is durable and half is a transcription step.
   A tick is now an unsaved edit like any other, and it goes to
   readiness.json in the same POST that carries the day. */
function paintMarksBox(){ touch(); }

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
  if (says) hint(says, fault ? "why: the system's own rules" : "your mark");
  if (off) hint(off, "press the button round to bring it back");
  var btn = row.querySelector(".dy-st");
  if (btn) {
    var st = m.notRequired ? "off" : m.notReady ? "loud" : "quiet";
    btn.setAttribute("data-state", st);
    btn.textContent = GLYPH[st];
    btn.setAttribute("aria-label", NOWSAY[st]);
    hint(btn, NOWSAY[st] + " \u00b7 press for " + NEXTSAY[st]);
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
  /* [PIECE 4] AND THE BOXES ARE SIZED HERE, NOT AT BOOT. A hidden element has
     a scrollHeight of ZERO, so an autosize pass over every day at load left
     four of the five days' boxes one line tall and only the day that happened
     to be open was right — measured on the served page: 16px of box holding
     47px of text. Every day but the first was in that state. The height is
     therefore set when a day is REVEALED, which is the first moment the
     browser can answer the question. */
  document.querySelectorAll('.dy-day[data-day="' + n + '"] textarea.dy-edit')
    .forEach(autosize);
  document.getElementById("dy-prev").disabled = i === 0;
  document.getElementById("dy-next").disabled = i === DAYS.length - 1;
  /* NO HINT: the span already prints "3 of 5". */
  document.getElementById("dy-where").textContent = (i+1) + " of " + DAYS.length;
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
  hint(img, big ? HINT_IMG : "held at one size only");
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
   whichever way the write goes. This is the FALLBACK's copy, which is the only
   clipboard left on the page. */
document.getElementById("dy-fb-copy").addEventListener("click", function(){
  var box = document.getElementById("dy-fb-out");
  var said = document.getElementById("dy-fb-said");
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

/* ═════════════════════════════════════════════════════════════════════════
   [PIECE 4] THE WRITING HALF
   ═════════════════════════════════════════════════════════════════════════
   Everything above this line is Piece 1's page and is unchanged in kind: it
   draws a day and takes a mark. Everything below takes a keystroke.

   THE DOM IS THE MODEL. There is no parallel JavaScript copy of the day being
   kept in step with the boxes, because the two would drift and the one that
   drifted would be the one that gets saved. A save WALKS THE ROWS, reads each
   box, and hands the result to WBDay.collect \\u2014 which is the file the proof
   loads, byte for byte.
   ═════════════════════════════════════════════════════════════════════════ */

var DIRTY = false, LASTSAVE = null, STALE = false;

function say2(msg, cls){
  var s = document.getElementById("dy-save-said");
  s.textContent = msg || ""; s.className = "said" + (cls ? " " + cls : "");
}

/* EXPANDS \\u2014 as many lines as he gives it, and no scrollbar of its own.
   The height is cleared before it is read, or the box could only ever grow. */
function autosize(t){
  if (!t || t.tagName !== "TEXTAREA") return;
  t.style.height = "auto";
  t.style.height = (t.scrollHeight + 2) + "px";
}

function touch(){
  DIRTY = true;
  document.querySelector(".dy-cal").classList.add("dirty");
  snapSoon();
}

/* ── THE DAY, READ OFF THE GLASS ─────────────────────────────────────────
   Row order is DOM order, which is the order he arranged with + and \\u00d7.
   A row marked DELETED is not read at all \\u2014 that is what the mark means \\u2014
   and its characters stay in its box until the page is rebuilt. */
function dayModel(no){
  var root = document.querySelector('.dy-day[data-day="' + no + '"]');
  var meta = null, j;
  for (j = 0; j < DAYS.length; j++) if (DAYS[j].no === Number(no)) meta = DAYS[j];
  var day = { no: Number(no), date: meta ? meta.date : null,
    rest: REST[no] || {}, fields: {}, sections: [] };
  if (!root) return day;
  [].slice.call(root.querySelectorAll(".dy-el")).forEach(function(row){
    if (row.classList.contains("gone")) return;
    var boxes = [].slice.call(row.querySelectorAll("[data-role=block]"));
    var f = row.getAttribute("data-field");
    if (f) {
      if (!boxes.length) return;
      var o = ORIG[boxes[0].getAttribute("data-uid")] || null;
      day.fields[f] = { orig: o ? o.raw : null,
        cut: Number(boxes[0].getAttribute("data-cut") || 0), text: boxes[0].value };
      return;
    }
    if (row.getAttribute("data-sect") !== "1") return;
    var lab = row.querySelector("input[data-role=label]");
    var key0 = row.getAttribute("data-el0");
    var blocks = boxes.map(function(b){
      var oo = ORIG[b.getAttribute("data-uid")] || null;
      return { kind: b.getAttribute("data-kind") || "strs",
        orig: oo ? oo.raw : null, items: oo ? oo.items : null,
        cut: Number(b.getAttribute("data-cut") || 0), text: b.value };
    });
    day.sections.push({
      label: { orig: (key0 != null && HEAD0[key0] != null) ? HEAD0[key0] : null,
        cut: 0, text: lab ? lab.value : "" },
      blocks: blocks });
  });
  return day;
}

function allEntries(){
  return DAYS.map(function(d){ return WBDay.collect(dayModel(d.no)); });
}

/* WHAT LEFT, BY DAY. The key set each day OPENED with against the set it would
   save, so a deletion \\u2014 a section removed, a headline cleared \\u2014 is named
   rather than being an absence nothing can see. It cannot tell a deliberate
   deletion from a bug; it makes sure neither is silent. */
function goneKeys(entries){
  var out = [];
  entries.forEach(function(e){
    var was = KEYS0[e.no] || [];
    var d = WBDay.diffKeys(was, WBDay.keysOf(e));
    d.gone.forEach(function(k){ out.push(String(e.no).replace(/^/, "00").slice(-3) + " " + k); });
  });
  return out;
}

function payload(){
  var entries = allEntries();
  return JSON.stringify({
    what: "Mike's working copy of the Record, from the day editor.",
    key: "wb.day.2026-08-26", saved: new Date().toISOString(), epoch: EPOCH,
    source: SOURCE, marks: MARKS, keys: { gone: goneKeys(entries) },
    entries: entries
  }, null, 1);
}

/* ── THE WAY OUT ─────────────────────────────────────────────────────────
   **THERE IS NO FILE PICKER ON THIS PAGE AND THAT IS DELIBERATE.** The Record
   editor falls back to showSaveFilePicker, and on an http origin the picker
   EXISTS \\u2014 so a save aimed at a server that is not listening opens a folder
   dialog and reports success about a file outside the repo. Measured before
   this page was built: npm run mock answers a POST with a 404 because it never
   reads the method, and the fallback fires exactly as designed into the wrong
   place. A quiet wrong road is worse than a loud dead end, so the only
   fallback here is THE TEXT, on the screen, with the reason above it. */
function fallback(why){
  var fb = document.getElementById("dy-fallback");
  document.getElementById("dy-fb-out").value = payload();
  fb.hidden = false;
  say2(why, "bad");
}

function saveNow(){
  if (STALE) { say2("the Record moved under this page \\u2014 nothing was saved. Read the red box.", "bad"); return; }
  var text = payload();
  var btn = document.getElementById("dy-save");
  if (!/^https?:$/.test(location.protocol)) {
    fallback("This page is open as a FILE, so it has no server to write to. Everything you have "
      + "typed is below \\u2014 copy it. To save straight into the repo: npm run day:serve");
    return;
  }
  btn.disabled = true; say2("saving\\u2026");
  fetch("/day/save", { method: "POST", headers: { "content-type": "application/json" }, body: text })
    .then(function(r){ return r.json().then(function(j){ return { s: r.status, j: j }; }); })
    .then(function(res){
      btn.disabled = false;
      if (res.s === 409 && res.j && res.j.stale) { markStale(res.j.detail); return; }
      if (!res.j || !res.j.ok) {
        fallback("The server refused the save: " + ((res.j && (res.j.why || res.j.detail)) || res.s)
          + " Nothing was written. Everything you have typed is below \\u2014 copy it.");
        return;
      }
      DIRTY = false; LASTSAVE = new Date();
      document.getElementById("dy-fallback").hidden = true;
      say2("SAVED \\u2014 " + res.j.records + " record(s), " + res.j.bytes + " characters, at "
        + LASTSAVE.toTimeString().slice(0, 8), "good");
      var w = document.getElementById("dy-save-where");
      w.innerHTML = "Written: <code>" + res.j.draft + "</code> and <code>" + res.j.marks
        + "</code>. <b>The Record itself is not written</b> \\u2014 that is "
        + "<code>npm run record:land -- --write</code>, and it is yours."
        + (res.j.gone && res.j.gone.length
            ? "<br><b>GONE from this save:</b> " + res.j.gone.join(" \\u00b7 ")
              + " \\u2014 named because a deletion must never be silent."
            : "");
      try { localStorage.removeItem(SNAP_KEY); } catch(e){}
    })
    .catch(function(){
      btn.disabled = false;
      fallback("The save could not reach the server \\u2014 it is not running, or it stopped. "
        + "NOTHING WAS WRITTEN. Everything you have typed is below \\u2014 copy it, or start "
        + "npm run day:serve and press Save again.");
    });
}

/* ── THE PAGE ASKS WHETHER IT IS STILL TALKING ABOUT THE SAME RECORD ─────
   The server refuses a stale save because it is the thing that writes. This
   asks on every focus because it is the only end that can tell him BEFORE he
   has typed for an hour. Both, on Ops' ruling. */
function markStale(detail){
  STALE = true;
  var b = document.getElementById("dy-stale");
  b.innerHTML = "<b>THE RECORD MOVED AFTER THIS PAGE WAS BUILT. DO NOT SAVE.</b><br>"
    + (detail || "") + "<br><b>What is on this screen is still complete.</b> Copy anything you "
    + "have typed since you opened it, then run <code>npm run day</code> and paste it back in.";
  b.className = "on";
  document.getElementById("dy-save").disabled = true;
  fallback("The Record moved under this page. Nothing was saved. Copy this.");
}
function checkSource(){
  if (STALE || !/^https?:$/.test(location.protocol)) return;
  fetch("/day/source").then(function(r){ return r.ok ? r.json() : null; }).then(function(j){
    if (!j || !j.ok || !j.source) return;
    if (j.source.sha256 !== SOURCE.sha256) {
      markStale("The page was built against " + SOURCE.file + " at sha256 "
        + SOURCE.sha256.slice(0, 16) + "\\u2026 (" + SOURCE.mtime + "). On disk now it is "
        + j.source.sha256.slice(0, 16) + "\\u2026 (" + j.source.mtime + "). Saving would send this "
        + "page's older copy to the lander with a fresh timestamp on it, and the lander's "
        + "staleness guard reads the timestamp, not the words \\u2014 so it would pass.");
    }
  }).catch(function(){ /* the server being down is not staleness, and saveNow says so */ });
}

/* ── WHAT THE BROWSER HOLDS BETWEEN SAVES ────────────────────────────────
   IT IS NOT A RESTORE AND IT DOES NOT PRETEND TO BE ONE. A snapshot is written
   to this browser as he types, and if one is found on boot that was never
   saved, the page SAYS SO and offers the text. It does not put the words back
   in the boxes: a page that silently repopulated itself from a browser copy
   would be a second stale-copy road, which is the loss this whole piece was
   gated on. The words are what must not be lost; the arrangement can be
   retyped and the arrangement is what a restore would have to guess at.
   IT IS REFUSED IF IT WAS TYPED AGAINST A DIFFERENT RECORD, for the same
   reason the save is. */
var SNAP_KEY = "wb.day.snapshot.v1", snapTimer = null;
function snapSoon(){
  if (snapTimer) clearTimeout(snapTimer);
  snapTimer = setTimeout(function(){
    if (!STORE_OK) return;
    try { localStorage.setItem(SNAP_KEY, JSON.stringify({
      source: SOURCE.sha256, at: new Date().toISOString(), text: payload() })); }
    catch(e){ STORE_OK = false;
      banner("<b>THIS BROWSER HAS STOPPED KEEPING A COPY OF YOUR WORK.</b> What is on the screen "
        + "is complete. Press <b>Save to the repo</b> now."); }
  }, 700);
}
function offerSnapshot(){
  var s = null;
  try { s = JSON.parse(localStorage.getItem(SNAP_KEY) || "null"); } catch(e){ return; }
  if (!s || !s.text) return;
  if (s.source !== SOURCE.sha256) { try { localStorage.removeItem(SNAP_KEY); } catch(e){} return; }
  var b = document.getElementById("dy-storebanner");
  b.innerHTML = "<b>THIS BROWSER HAS WORK FROM " + String(s.at).replace("T", " ").slice(0, 19)
    + " THAT WAS NEVER SAVED TO THE REPO.</b> It is not put back in the boxes \\u2014 a page that "
    + "repopulated itself from a browser copy is a second way to save something stale. "
    + "<button type=\\"button\\" id=\\"dy-snapshow\\">show it</button> "
    + "<button type=\\"button\\" id=\\"dy-snapdrop\\">discard it</button>";
  b.className = "on";
  document.getElementById("dy-snapshow").addEventListener("click", function(){
    document.getElementById("dy-fallback").hidden = false;
    document.getElementById("dy-fb-out").value = s.text;
    document.getElementById("dy-fb-out").focus();
  });
  document.getElementById("dy-snapdrop").addEventListener("click", function(){
    try { localStorage.removeItem(SNAP_KEY); } catch(e){}
    b.className = ""; b.innerHTML = "";
  });
}

/* TWO TABS ON ONE RECORD. Both write the same store and the same draft path,
   last writer wins, and until today neither knew about the other. */
window.addEventListener("storage", function(e){
  if (e.key !== SNAP_KEY || !e.newValue) return;
  var b = document.getElementById("dy-storebanner");
  b.innerHTML = "<b>ANOTHER TAB IS EDITING THIS RECORD.</b> Both tabs write the same draft file "
    + "and the last save wins outright \\u2014 whichever one saves second replaces the other's work "
    + "entirely. Close one before you save.";
  b.className = "on";
});

/* ── THE LIVE MARK ───────────────────────────────────────────────────────
   The count under a box he is TYPING into and the count the generator bakes
   are ONE function \\u2014 WBDay.budgetMark, in the file the proof loads. Two
   would drift and the one that drifted would be the one on the glass. */
function repaintBudget(row){
  var raw = row.getAttribute("data-budget");
  if (!raw) return;
  var b = JSON.parse(raw);
  var box = row.querySelector("[data-role=block]");
  var span = row.querySelector(".dy-count");
  var m = box ? WBDay.budgetMark(box.value.length, b, NEAR) : null;
  if (!m) { if (span) span.remove(); return; }
  if (!span) {
    span = document.createElement("span");
    /* BEFORE the two voices, which is where the generator puts it. A count
       that jumps to the other side of NOT READY the first time it fires would
       be the page moving under him at the moment it is trying to warn him. */
    var host = row.querySelector(".dy-th") || row.querySelector(".dy-box-t");
    var voice = host.querySelector(".dy-say");
    if (voice) host.insertBefore(span, voice); else host.appendChild(span);
  }
  span.className = "dy-count " + m.level;
  span.textContent = m.says;
  hint(span, m.short);
}

/* ── HIS MARK FOLLOWS HIS HEADER ─────────────────────────────────────────
   A section's key IS its header, which is the vocabulary the marks already
   use. So renaming a header would orphan the mark he set an hour ago \\u2014 the
   page draws orphans loudly for exactly that reason, and making him read one
   he caused by typing would be the page punishing him for using it. The mark
   moves with the row while the page is open. */
function renameKey(row){
  var no = Number(row.closest(".dy-day").getAttribute("data-day"));
  var lab = row.querySelector("input[data-role=label]");
  var was = row.getAttribute("data-el");
  var now = "section:" + (lab.value || "(no header)");
  if (now === was) return;
  if (MARKS[no] && MARKS[no][was]) {
    MARKS[no][now] = MARKS[no][was];
    delete MARKS[no][was];
    saveMarks();
  }
  row.setAttribute("data-el", now);
  var btn = row.querySelector(".dy-st");
  if (btn) btn.setAttribute("data-key", now);
}

/* ── ONE HANDLER, EVERY BOX ────────────────────────────────────────────── */
document.addEventListener("input", function(ev){
  var t = ev.target;
  if (!t.classList || !t.classList.contains("dy-edit")) return;
  autosize(t);
  var row = t.closest(".dy-el");
  if (t.getAttribute("data-role") === "label") renameKey(row);
  repaintBudget(row);
  touch();
});

/* ── DELETE A ROW. INSERT A ROW. ADD A SECTION. ────────────────────────── */
function freshRow(){
  var tpl = document.getElementById("dy-newrow");
  var li = tpl.content.firstElementChild.cloneNode(true);
  var row = li.querySelector(".dy-el");
  /* a uid nothing has an ORIG for, so the box is read as NEW and its text is
     emitted exactly as typed \\u2014 no cut is re-applied to a line he wrote here. */
  var u = "new" + Math.round(performance.now() * 1000) + "-" + (freshRow.n = (freshRow.n || 0) + 1);
  [].slice.call(row.querySelectorAll("[data-role=block]")).forEach(function(b){
    b.setAttribute("data-uid", u); b.value = "";
  });
  row.setAttribute("data-el", "section:(no header)");
  return li;
}
document.addEventListener("click", function(ev){
  var t = ev.target;
  var ins = t.closest && t.closest(".dy-ins");
  if (ins) { ins.closest("li").after(freshRow()); touch(); return; }
  var del = t.closest && t.closest(".dy-del");
  if (del) {
    var row = del.closest(".dy-el");
    row.classList.toggle("gone");
    touch();
    return;
  }
  var add = t.closest && t.closest(".dy-add");
  if (add) {
    var ol = add.closest(".dy-sec").querySelector("ol.dy-sects");
    var li = freshRow(); ol.appendChild(li);
    var box = li.querySelector("input[data-role=label]"); if (box) box.focus();
    touch();
    return;
  }
  if (t.id === "dy-save") saveNow();
});

document.addEventListener("keydown", function(e){
  if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
    e.preventDefault(); saveNow();
  }
});

/* NOTHING LEAVES QUIETLY. The Record editor has no such handler and neither
   did this page, because neither had anything to lose until today. */
window.addEventListener("beforeunload", function(e){
  if (!DIRTY) return;
  e.preventDefault(); e.returnValue = "";
});
window.addEventListener("focus", checkSource);
document.addEventListener("visibilitychange", function(){
  if (!document.hidden) checkSource();
});

loadMarks();
/* paintRow reads the store and repaints the row and its button, so the boot
   pass is the same call the click makes — the baked-in state and the live
   state cannot disagree about how a row is drawn. */
document.querySelectorAll(".dy-el").forEach(paintRow);
/* THE KEY EACH SECTION ROW OPENED WITH, kept on the row so a rename can still
   find what the box originally held. */
document.querySelectorAll(".dy-el[data-sect]").forEach(function(row){
  row.setAttribute("data-el0", row.getAttribute("data-el"));
});
document.querySelectorAll("textarea.dy-edit").forEach(autosize);
/* WHAT EACH DAY OPENED WITH, read through the real collector \\u2014 so the set a
   deletion is measured against is the set a save would have produced a moment
   earlier, not a list built a second way. */
DAYS.forEach(function(d){ KEYS0[d.no] = WBDay.keysOf(WBDay.collect(dayModel(d.no))); });
document.querySelectorAll(".dy-el[data-budget]").forEach(repaintBudget);
offerSnapshot();
checkSource();

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
console.log(`  the Record it was built from: ${SOURCE_STATE.file}`);
console.log(`     sha256 ${SOURCE_STATE.sha256}`);
console.log(`     ${SOURCE_STATE.mtime}, ${SOURCE_STATE.bytes.toLocaleString()} bytes`);
console.log(`     A save from a page built against a different one is REFUSED, by sha.`);

/* \u2550\u2550\u2550 [PIECE 4] THE LINE THAT USED TO BE HERE WAS A TRAP THE DAY THE PAGE
   TOOK A KEYSTROKE \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   It printed `npm run mock 8931` and the day.html address on that server. That
   was CORRECT while this page was read-only \u2014 the mock is how OPERATIONS \u00a78
   obliges Ops to look at anything, because Ops cannot see `file://`.

   IT STOPPED BEING CORRECT AT THE FIRST TEXTAREA. `tools/serve-mock.mjs` never
   reads `req.method`, so a POST to `/day/save` is treated as a request for the
   file `docs/save`, which does not exist, and it answers 404. The page would
   fall to its way-out box every time \u2014 and the RECORD editor, on the same
   origin, would fall to `showSaveFilePicker`, which EXISTS on http, and open a
   folder dialog reporting success about a file outside the repo.

   **A PRINTED INSTRUCTION THAT SILENTLY LOSES A SAVE IS NOT A DOC FIX.** It
   changed in the commit that made the page writable, which is this one. */
console.log(`\nWHERE HE WRITES \u2014 this page takes keystrokes now, so it needs the`);
console.log(`server that can accept a save. npm run mock CANNOT: it never reads the`);
console.log(`request method, so a save to it 404s.\n`);
console.log(`  npm run day:serve   \u2192  http://127.0.0.1:8899/`);
console.log(`\n  Save writes  docs/dictation-20260807/record-draft.json   (his words)`);
console.log(`               docs/dictation-20260807/readiness.json      (his marks)`);
console.log(`  It does NOT write the Record. That is  npm run record:land -- --write  [MIKE]`);
console.log(`\n  prove it first:  npm run day:proof`);
