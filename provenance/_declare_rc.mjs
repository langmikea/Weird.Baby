#!/usr/bin/env node
/* ===========================================================================
   THE REMOTE-CONTROL ROUND (L1 · R1–R7 · P1–P6 · N1–N11 · X1, 2026-08-06)
   Declares this round's 55 undeclared visitor-facing strings.
   ---------------------------------------------------------------------------
   RUN ONCE. Like `_declare_n.mjs` and `_declare_p.mjs` before it, this file is
   the AUDIT RECORD of one round's classification and not a tool: re-running it
   after the strings move would re-stamp rows against lines they no longer sit
   on. It is kept in the tree for the same reason those two are — so the
   classification can be read back and argued with — and it must not be
   generalised into a maintenance script. `provenance/backfill-20260804.mjs`
   carries the same warning for the same reason.

   THE CARRY DISCIPLINE (D1's, applied again). Where this round EDITED a string
   rather than writing one, the new row takes the OLD row's class and source
   verbatim — the nameplate, the archive footers, the cover caption, the
   `[PAPA]` note. Re-deciding an origin because a word changed is how a sourced
   line quietly acquires a different provenance than it had yesterday.

     node provenance/_declare_rc.mjs --write
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REG = path.join(HERE, "register.json");
const UND = path.join(HERE, "_undeclared.json");

/* ---- the sources, named once ------------------------------------------- */
const S_INO =
  "the unit's own `.ino` trees, read off the files — the flagship's header " +
  "declares the five rules above the first include, and the bench sketches " +
  "carry the matrix, bar-chain and brightness notes. External to this repo; " +
  "the sweep cannot re-check it. Every figure on this sheet was already on " +
  "the face it replaces; N2 changed the FORM and not one fact.";
const S_ROBOTS_RECORD =
  "the robots repo's own record — C:\\AI\\Projects\\weird-baby-robots " +
  "(THE_RECORD.md, SPEC_INVENTORY, WBR_WORDS_DRAFT). External to this repo; " +
  "the sweep cannot re-check it.";
const S_PHOTOS =
  "the museum's own photographs of the unit, held in public/robots/reference/ " +
  "— captions state what the photograph shows";
const S_MANUAL =
  "the portable's own manual, ABEAL 8P-OMI-1, held by this museum and not " +
  "published — see the wing FAQ's answer on the originals. The mainframe's " +
  "absence is a holdings fact about this collection.";
const S_PAPA =
  "a [PAPA] marker — Mike's own to-do list, kept in the data on purpose; " +
  "src/lib/visitor-prose.js scrubs it before render";
const S_P1 =
  "Mike's remote-control brief, P1, 2026-08-06: \"THE NAMEPLATE: 'ABEAL' is " +
  "correct canon (a division of ScrapCo) — but 'INSTRUMENT DIVISION' IS " +
  "DRIFT. Mike struck 'ABEAL Instrument Company' from the manual cover on " +
  "08-05 and it has regrown here in a new costume. Remove it; ABEAL alone " +
  "unless canon says otherwise.\"";
const S_N3 =
  "Mike's remote-control brief, N3, 2026-08-06: \"'THE MANUAL' BECOMES " +
  "'DOCUMENTATION' — a viewer free to display any document. The manual " +
  "appears inside it as a SELECTABLE ENTITY that opens on the screen when " +
  "clicked.\"";

/* ---- the classification ------------------------------------------------ */
const HOUSE = { c: "HOUSE" };
const V = s => ({ c: "VERIFIED", s });
const M = s => ({ c: "MIKE", s });

const BY_TEXT = new Map(Object.entries({
  /* ---- keys and field names. Not visitor prose at all: `faq` is an
     `entriesMode` value and the six at Exhibit.jsx:105 are the names of the
     fields `scrubFace` walks. The sweep cannot tell a key from a caption, which
     is why the boundary declares both and the class carries the difference. */
  "faq": HOUSE,
  "title": HOUSE, "subtitle": HOUSE, "blurb": HOUSE,
  "footer": HOUSE, "papa": HOUSE, "docsEmpty": HOUSE,

  /* ---- controls and their accessible names (N5, N8, N9) */
  "Zoom in": HOUSE, "Zoom out": HOUSE,
  "Zoom in to full size": HOUSE, "Zoom out to fit": HOUSE,
  "Image": HOUSE, "Archive": HOUSE, " — groupings": HOUSE,

  /* ---- the archive's unit noun (N8). A word the wall counts in. */
  "photograph": HOUSE, "photographs": HOUSE,

  /* ---- the groupings (N9). BUTTON LABELS, and that is the whole class: each
     names a cut through the wall below it and asserts nothing a caption on
     that wall does not already say. They are Ops' curation — Mike's own
     instruction is that he will not be writing them — and curation is the CUT
     and the SEQUENCE, not a new claim about any photograph. */
  "The whole cabinet": HOUSE,
  "Through the bars": HOUSE,
  "Running, and in trouble": HOUSE,
  "As they arrived": HOUSE,
  "The glass": HOUSE,
  "Above and below": HOUSE,
  "Every photograph": HOUSE,

  /* ---- the wing's standard sign-off, UNIT · OBJECT (N8). Same class as every
     other footer in this wing, all of which are HOUSE. */
  "MGK-NIAC · IMAGE ARCHIVE": HOUSE,
  "MGK-VIIIp · IMAGE ARCHIVE": HOUSE,
  "MGK-NIAC · DOCUMENTATION": HOUSE,
  "MGK-VIIIp · DOCUMENTATION": HOUSE,

  /* ---- the nameplate (P1) and its struck field (P2) */
  "ABEAL · FEED CONTROL · TYPE 8p": M(S_P1),
  "SER. No.": HOUSE,

  /* ---- the drum's engravings (P5). HOUSE, exactly as the three they replace
     were: they are the words cut into a selector, and no position asserts a
     fact about the world. The `id`s beneath them did not move. */
  "STANDBY": HOUSE, "COLD START": HOUSE, "FIRST RUN": HOUSE,

  /* ---- the one sheet (N2) */
  "BOARD    Uno R4 WiFi": V(S_INO),
  "PROGRAM  v0.1 · 2026-02-23 · 1,385 lines": V(S_INO),
  "STATUS   baseline — pre-thermal-validation": V(S_INO),
  "BENCH    8 single-subsystem sketches, January 2026": V(S_INO),
  "MATRIX   8 × 16 — seven rows visible, the eighth wired, driven and behind something": V(S_INO),
  "BAR      1 × 64, addressed as a single chain": V(S_INO),
  "OUTPUTS  2 matrix chains · 2 bar chains · 3 servos": V(S_INO),
  "LAMPS    all-at-once flashes capped at 32, a quarter of standard — a bench limit on a bench board": V(S_INO),
  "DECLARED five rules, in the header, above the first include": V(S_INO),
  "RULE 1   a numerical envelope": V(S_INO),
  "RULE 2   a ceiling of eight core states": V(S_INO),
  "RULE 3   mutual exclusion": V(S_INO),
  "RULE 4   a reveal no faster than twelve seconds": V(S_INO),
  "RULE 5   no adaptive learning — the machine is forbidden, in writing, from getting to know you": V(S_INO),

  /* ---- Documentation (N3) */
  "Documentation": M(S_N3),
  "DOCUMENTATION": M(S_N3),
  "No document for the mainframe is held here. The portable arrived with a manual — ABEAL 8P-OMI-1, incomplete, assembled out of copies caught at different stages — and nothing of the kind has reached this museum for the cabinet.": V(S_MANUAL),
  "The owner's manual": V(S_MANUAL),
  "ABEAL 8P-OMI-1": V(S_ROBOTS_RECORD),
  "Held. Incomplete, assembled out of copies caught at different stages. No page images on file — when they are made they are photographs of the printed sheet, edges and margins included.": V(S_MANUAL),

  /* ---- carried edits: the same claim, one word changed by N8 */
  "The cover image — the glass carries the BIOS beat": V(S_PHOTOS),
  "[PAPA] — the caption wording, and whether any photograph earns a face of its own.": M(S_PAPA),
}));

/* ---- write -------------------------------------------------------------- */
const reg = JSON.parse(fs.readFileSync(REG, "utf8"));
const und = JSON.parse(fs.readFileSync(UND, "utf8"));

const missing = [];
let added = 0;
for (const [key, stub] of Object.entries(und)) {
  const decl = BY_TEXT.get(stub.t);
  if (!decl) { missing.push(stub.t); continue; }
  reg.entries[key] = { f: stub.f, l: stub.l, t: stub.t, ...decl };
  added++;
}

if (missing.length) {
  console.error("UNCLASSIFIED — refusing to write:");
  missing.forEach(t => console.error("  " + JSON.stringify(t)));
  process.exit(1);
}

if (process.argv.includes("--write")) {
  fs.writeFileSync(REG, JSON.stringify(reg, null, 1) + "\n", "utf8");
  console.log("wrote " + added + " row(s) into provenance/register.json");
} else {
  console.log("would write " + added + " row(s) — pass --write");
}
