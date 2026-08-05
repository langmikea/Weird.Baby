/* ===========================================================================
   THE REVEAL LEDGER'S SHAPE — the row vessels and the one validator.
   [R1/R3 2026-08-05]
   ---------------------------------------------------------------------------
   WHY THIS FILE EXISTS. Until this round the ledger's rules lived in two
   places: `reveal/ledger-declare.mjs` checked five of them as it wrote, and
   `tools/reveal-ledger.mjs --check` checked four of them afterwards, and the
   two lists were neither the same nor a superset of each other. A rule that is
   enforced in one of two places is enforced at whichever moment the author
   happens to run. They are one function now, and both callers run it.

   It also holds THE MANUAL-PAGE VESSEL (R3), which is the reason a shared file
   was worth making: the vessel has to be constructible by the declaration (to
   write a row) and by the check (to prove the vessel works while ZERO rows
   exist). One definition, two callers, no drift.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { transferFaults } from "./transfers.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const ROBOTS = path.resolve(REPO, "..", "weird-baby-robots");

export const BUILDS = ["LIVE", "PARTIAL", "STUB", "NOT_BUILT"];
export const STATES = ["HELD", "REVEALED", "RETIRED"];
export const ARCS = ["arrived", "understood", "partial", "online"];

/* ═══ R3: THE MANUAL'S PAGES ════════════════════════════════════════════════
   MIKE'S RULING, which is what shapes this and not a schema preference: the
   manual ARRIVED IN PIECES, so the museum needs only the specific pages the
   story reaches for — printed, marked, photographed, one at a time, as Record
   entries call for them. Not a scanning project; a supply line.

   THE PRODUCTION ARC IS ITS OWN VOCABULARY AND IS NOT `arc`. `arc` is the
   REVEAL arc (arrived · understood · partial · online) — how the house shows a
   thing it has. This is the PRODUCTION arc — whether the house has it yet.
   A page can be `photographed` and still `null` on the reveal arc, and the two
   fields would be lying about each other if they shared a column. */
export const PROD = ["needed", "printed", "photographed", "placed"];

/* `build` is DERIVED from the production stage rather than authored, because
   the two cannot legally disagree: a page nobody has photographed is not built,
   and a page in `plates` is on the glass. Deriving it means the row cannot be
   written into a state the world is not in. */
export const BUILD_FOR_PROD = {
  needed: "NOT_BUILT",        // the story has asked for it; nothing exists
  printed: "NOT_BUILT",       // paper exists; the museum holds no image
  photographed: "PARTIAL",    // an image exists and is on nobody's wall
  placed: "LIVE",             // it is a frame in the reader
};
export const STATE_FOR_PROD = {
  needed: "HELD", printed: "HELD", photographed: "HELD", placed: "REVEALED",
};

/* The manual is 24 pages. That is the object's own canon — stated on the face
   and in the ledger's `doc.manual` row — and it is the reason this vessel can
   refuse a page 25 instead of minting one. */
export const MANUAL_PAGES = 24;
const MANUAL_SRC = "robots/mgk-viiip/manual/pages";

export function manualSourcePath(page) {
  return `${MANUAL_SRC}/page-${String(page).padStart(2, "0")}.png`;
}

/* [T1 2026-08-05] TWO DIFFERENT FAILURES WORE THE SAME MESSAGE, AND ONE OF
   THEM HAPPENED. "Page 7 has no source render" is the vessel refusing to
   invent a page — the guard doing its job. "The whole source tree is gone" is
   the ROBOTS REPO having moved out from under this file, which is a repo-level
   fault and not a page-level one. Told apart here, because on 2026-08-05 the
   second one occurred and reported itself as the first, through a stack trace.

   WHAT HAPPENED, recorded so nobody re-derives it: the robots repo's typewriter
   pass (4cd78ac, 16:14) RETIRED all 24 renders under manual/pages and replaced
   them with a 61-page structure issue under manual/structure/pages. Museum v55
   sealed at 13:38, before that, wiring this path in. `reveal:check` had been
   dying ever since and nothing ran it in between.

   NOT REPOINTED, AND DELIBERATELY SO. Page 7 of the 61-page structure issue is
   not page 7 of the 24-page manual — the structure issue renumbers everything —
   so aiming this at the new render would make `doc.manual.page.07` quietly mean
   a different leaf. The museum's canon is a 24-PAGE manual and it is on the
   glass. Reconciling 24 against 61 is Mike's ruling, not a path edit. */
export function manualSourceState() {
  if (!fs.existsSync(ROBOTS)) return "no-robots";
  return fs.existsSync(path.join(ROBOTS, MANUAL_SRC)) ? "ok" : "no-source";
}
export const MANUAL_SRC_DIR = MANUAL_SRC;

/**
 * ONE PAGE OF THE MANUAL, as a ledger row. Returns the R() argument shape;
 * `ledger-declare.mjs` spreads it, and `reveal:check` builds specimens from it
 * to prove the vessel while nothing ships.
 *
 * IT REFUSES TO NAME A PAGE THAT DOES NOT EXIST. The range comes from the
 * object, and where the robots repo is reachable the source render is checked
 * on disk — so this vessel cannot be used to invent a twenty-fifth page or a
 * page the manual never had. That refusal is the point of it, not a courtesy.
 *
 * @param page      1..24
 * @param prod      needed | printed | photographed | placed
 * @param calledBy  the `record.NNN` row ids whose entries ask for this page.
 *                  Validated against real rows — a page cannot be called for by
 *                  an entry that does not exist.
 * @param assets    public refs, resolved to asset uids by the declaration.
 */
export function manualPageRow(page, {
  prod = "needed", calledBy = [], assets = [], when = null, note = "", deps,
} = {}) {
  if (!Number.isInteger(page) || page < 1 || page > MANUAL_PAGES)
    throw new Error(`manualPageRow: page ${page} is not one of the manual's ${MANUAL_PAGES} pages.`);
  if (!PROD.includes(prod))
    throw new Error(`manualPageRow: unknown production stage "${prod}" — one of ${PROD.join(" · ")}.`);
  const src = manualSourcePath(page);
  const where = manualSourceState();
  if (where === "no-source")
    throw new Error(
      `manualPageRow: the manual's source renders are gone — ${MANUAL_SRC} does not ` +
      "exist in the robots repo. This is not a missing page, it is a moved tree; " +
      "see manualSourceState() above before repointing anything.");
  if (where === "ok" && !fs.existsSync(path.join(ROBOTS, src)))
    throw new Error(`manualPageRow: page ${page} has no source render at ${src}.`);

  const nn = String(page).padStart(2, "0");
  return {
    id: `doc.manual.page.${nn}`,
    name: `The Manual, page ${nn}.`,
    cls: "document",
    where: prod === "placed"
      ? "src/data/artists/robots.js face.plates"
      : `the physical world — printed from weird-baby-robots/${src}`,
    build: BUILD_FOR_PROD[prod],
    reach: prod === "placed" ? "a frame in THE MANUAL's reader, on /robots" : null,
    state: STATE_FOR_PROD[prod],
    extra: {
      when, prod, calledBy, assets, note,
      /* B8's shoot spec is the dependency, stated once here rather than copied
         onto every page: ≥2400px long edge, the whole page including margins,
         reel order = reading order. */
      deps: deps || (prod === "photographed" || prod === "placed"
        ? [] : ["P2 — Mike prints and photographs this page (≥2400px long edge, whole page including margins)"]),
      /* A single page is never named on the glass. The PLATES AS A SET are —
         DOC CONTROL and The Manual's own face both name them — and that promise
         is `doc.manual.plates`, which is where it belongs. A page row claiming
         `shown` would double-count the one promise the museum actually makes. */
      shown: false,
    },
  };
}

/* ═══ R1: THE RECORD'S OWN FIELDS, WHICH MAY NEVER APPEAR HERE ══════════════
   Audit §8a: "The temptation at sixty entries will be to let the ledger become
   a second copy of the Record, and the moment it does, the two disagree." This
   is the structural half of that guard — a field by these names cannot exist on
   a ledger row. The textual half (six consecutive words of the Record's own
   prose showing up in a row) is in `reveal:check`, which can see the prose.  */
export const RECORD_FIELDS = [
  "headline", "dateline", "sections", "section", "lead", "line",
  "tomb", "tombstone", "body", "still", "stillCaption", "title", "evidence",
];

/* ═══ THE ONE VALIDATOR ═════════════════════════════════════════════════════ */
export function validate(rows) {
  const faults = [];
  const bad = (id, msg) => faults.push(`${id}: ${msg}`);
  const ids = new Set(rows.map(r => r.id));
  const seen = new Set();

  for (const r of rows) {
    if (seen.has(r.id)) bad(r.id, "duplicate id");
    seen.add(r.id);

    if (!BUILDS.includes(r.build)) bad(r.id, `bad build "${r.build}"`);
    if (!STATES.includes(r.state)) bad(r.id, `bad state "${r.state}"`);
    if (r.arc != null && !ARCS.includes(r.arc)) bad(r.id, `bad arc "${r.arc}"`);

    if (r.state === "REVEALED" && !r.reach)
      bad(r.id, "REVEALED with no reach — a visitor is told to go somewhere nobody named");
    if (r.state === "RETIRED" && r.reach)
      bad(r.id, "RETIRED but still reachable");
    if (r.build === "NOT_BUILT" && r.state === "REVEALED")
      bad(r.id, "NOT_BUILT and REVEALED — a visitor is being shown something that does not exist");
    if (r.state === "HELD" && r.reach && r.build === "NOT_BUILT")
      bad(r.id, "HELD + NOT_BUILT cannot have a reach");

    for (const f of RECORD_FIELDS)
      if (Object.prototype.hasOwnProperty.call(r, f))
        bad(r.id, `carries \`${f}\` — that is the Record's field, not the ledger's (audit §8a)`);

    /* the production arc belongs to the manual-page vessel and nothing else */
    if (r.prod != null) {
      if (!PROD.includes(r.prod)) bad(r.id, `bad prod "${r.prod}"`);
      if (!r.id.startsWith("doc.manual.page."))
        bad(r.id, "`prod` is the manual-page vessel's field; this row is not a manual page");
      if (BUILD_FOR_PROD[r.prod] !== r.build)
        bad(r.id, `prod "${r.prod}" implies build ${BUILD_FOR_PROD[r.prod]}, row says ${r.build}`);
      if (r.prod === "placed" && !(r.assets || []).length)
        bad(r.id, "placed in the reader with no asset — a frame with no photograph");
    } else if (r.id.startsWith("doc.manual.page.")) {
      bad(r.id, "a manual page with no production stage — needed · printed · photographed · placed");
    }

    for (const c of (r.calledBy || [])) {
      if (!/^record\.\d+$/.test(c))
        bad(r.id, `calledBy "${c}" is not a record entry id`);
      else if (!ids.has(c))
        bad(r.id, `calledBy "${c}" names a Record entry that does not exist`);
    }
  }

  /* [T1 2026-08-05] THE TRANSFER RULE — an asset may only be SHOWN after it
     has been TRANSFERRED, and every asset belongs to exactly one class. It
     lives in reveal/transfers.mjs and is called from here rather than beside
     the check, so that both the declaration and `reveal:check` enforce it —
     the one-validator doctrine this file exists for. */
  faults.push(...transferFaults(rows));

  return faults;
}
