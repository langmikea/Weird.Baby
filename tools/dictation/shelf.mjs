/* ===========================================================================
   THE SHELF — what the museum holds that Mike can actually put on a page.
   [2026-08-13] Extracted from `assign.mjs` unchanged, so two tools can read it.
   ---------------------------------------------------------------------------
   THIS FILE EXISTS BECAUSE OF ONE SENTENCE IN THE SHORTS PACKET: *"It must read
   the actual shelf — the same 143 assets the artifact tracker knows. Not a
   parallel list."*

   A second tool that re-derived the shelf would be a parallel list on the day it
   was written and a divergent one within a round — someone rules a picture out,
   the tracker stops offering it, and the shorts tool goes on offering it. The
   `RULED_OUT` map below is the proof that this can happen: it is Doctrine 24
   made mechanical, and a catalogue that did not consult it would walk a killed
   thing straight back in front of him.

   SO THE SHELF IS ONE FUNCTION AND BOTH CALLERS USE IT. Nothing here is new —
   every line moved out of `assign.mjs` byte for byte, and the tracker's output
   was proved BYTE-IDENTICAL across the move (143 rows, same eight sections, same
   drop counts). The move adds no rule and removes none.

   WHAT IT RETURNS: `{ rows, drop }`. `rows` is what he may choose from; `drop`
   is what was withheld and why, counted — because a silent filter is
   indistinguishable from a bug, and he will find the gap before we do.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { diskHref } from "./lighttable.mjs";
import { SIGNAGE } from "../../reveal/delivery.mjs";
import { GOVERNED_PREFIX } from "../../reveal/placement.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const TABLE = path.join(REPO, "provenance", "asset-table.json");

/* RULED OUT, IN WRITING. Doctrine 24 — once he has ruled a thing gone he does
   not meet it again, and a catalogue is exactly where a killed thing comes
   back. Each row carries his reason, the same shape as SIGNAGE in
   reveal/delivery.mjs, because a silent filter is indistinguishable from a bug. */
export const RULED_OUT = {
  "MGK-TWIN_MONITOR_SCREEN_BEZEL.png":
    "Mike, 2026-08-13: the Portal CRT's bezel, used in constructing the " +
    "original portal. Not UX standalone; he makes the overlays himself.",
  /* [2026-08-13] TWO MORE, SAME CATEGORY, HIS RULING TONIGHT. They surfaced on
     the shorts bench as selectable ingredients — a red-boxes-on-black tile and
     a red-dots-on-black tile sitting in "Photographs of the machines", which is
     where a photograph of a machine is supposed to be. */
  "MGK-TWIN_MONITOR_CLOSE_UP_MARKERS.png":
    "Mike, 2026-08-13: red boxes on black — construction markup, not a " +
    "photograph. Same category as the bezel.",
  "monitor_base_markers.png":
    "Mike, 2026-08-13: red boxes on black — construction markup, not a " +
    "photograph. Same category as the bezel.",
};

/* ═══ NEVER PUBLISHED — A SECOND LIST, AND IT IS NOT RULED_OUT ══════════════
   [2026-08-25] `RULED_OUT` above means ONE thing: **Mike met this and said no
   to this use.** Every row carries a date and his words. That is Doctrine 24,
   and it is why the map exists.

   THESE FILES ARE THE OPPOSITE CASE. **He has never been asked about them.**
   The bar is not a ruling about three files; it is a standing rule about a
   CLASS of material, made once and recorded in the other repository. Filing
   them in `RULED_OUT` would fabricate a ruling and put a date on it.

   AND THE COLLISION IS NOT HYPOTHETICAL — IT COST A ROUND. `RULED_OUT` is
   keyed by BASENAME and its value records a ruling about a USE, so a reader
   who takes it for a list of forbidden FILES gets it wrong: on 2026-08-25 the
   Portal's own CRT bezel was reported as a public leak on exactly that
   misreading. It is a live, declared component of `portal.js` and its
   publication is correct. Adding a second, different kind of fact to that same
   map would compound the ambiguity in the one place a future round will look.

   SCOPED TO THE CLASS, NOT TO FILENAMES, AND THAT IS DELIBERATE.
   `BURP_LIBRARY_01.md` is numbered **01** and the burp doctrine expects more
   shoots. Three basenames would be correct today and silently wrong at the
   fourth burp, which is the failure mode this whole file exists to avoid.

   THE CITATION IS CARRIED, NOT IMPORTED. The rule is the robots repository's
   and this repository cannot read it at build time — that repo may not be
   beside this one, which is the lesson `tools/numbers-gate.mjs` already
   learned about counting the manual. So the quote and its file-and-line travel
   in the row, and divergence is a thing a robots-side sweep catches, not an
   import.

   COUNTED IN ITS OWN BUCKET. `drop.neverPublished`, never folded into
   `drop.ruled` — they are different reasons and a reader who sees one number
   cannot tell which. A silent filter is indistinguishable from a bug. */
export const NEVER_PUBLISHED = [
  {
    key: "burp-logbook-audio",
    test: (p) => /^public\/held\/robots\/audio\/burps\//.test(p),
    what: "the burp clips' own audio track — Mike talking while he shoots",
    reason:
      "Ruling 2026-08-03(a), NO VOICE ON ROBOTS. These are the logbook: " +
      "`tools/burp_intake.py` extracts each clip's audio whole (-vn -ac 1 " +
      "-ar 16000) so it can be transcribed, and the burp doctrine's point 9 " +
      "calls that track the logbook and rules the published clip must carry " +
      "no audio stream at all. The words are read and quoted as TEXT; the " +
      "recording is not published in any asset class.",
    citation:
      "weird-baby-robots/docs/MAGIC8_ACTION_REEL-20260803.md:69 — ruling " +
      "2026-08-03(a): \"no voice on robots. Mike's narration is a research " +
      "artifact and is quoted as text; nothing published anywhere in the " +
      "robots wing carries his voice.\" Restated at " +
      "weird-baby-robots/docs/BURP_LIBRARY_01.md:5 and as point 9 of " +
      "weird-baby-robots/docs/BURP_DOCTRINE-20260804.md.",
  },
];

/** the NEVER_PUBLISHED row that covers this path, or null. */
export function neverPublished(p) {
  return NEVER_PUBLISHED.find((r) => r.test(p)) || null;
}

/** the RULED_OUT reason for this path's BASENAME, or null.
    KEYED ON THE BASENAME AND THAT IS NOT AN OVERSIGHT — §8's *a governed
    picture has two addresses*. A path test would let a ruled-out picture back
    in through its other address, which is the exact shape that failure takes. */
export function ruledOut(p) {
  const base = p.split("/").pop();
  return Object.prototype.hasOwnProperty.call(RULED_OUT, base)
    ? RULED_OUT[base] : null;
}

/* ═══ [2026-08-28] THE TWO BARS, ASKED ABOUT ONE ROW ════════════════════════
   `buildShelf()` answers *what may Mike PICK FROM*, and it answers it for the
   whole table at once. **Nothing could ask about ONE asset**, so every tool
   downstream of the bench — the compiler, the verifier — either re-derived the
   question or, in fact, never asked it at all.

   THIS IS THE SAME TWO BARS, EXPOSED PER ROW. It is not a third list and it
   invents no rule: `buildShelf` below calls it, so the bench and every later
   reader provably ask the same question. The proof that the move added and
   removed nothing is the shelf itself — same rows, same drop counts, before
   and after.

   HELD IS DELIBERATELY NOT ONE OF THESE, AND THAT IS THE LOAD-BEARING PART.
   Six of the eight SECTIONS above match `public/held/robots/…` only: the shelf
   is 132 held rows out of 138, and the manual IS the ingredients. A held bar
   here would empty the bench and refuse every recipe in the tree. **Held is a
   TIMING state — the door changes, not the payload** — and the question *is
   this due yet* is `reveal/day.mjs`'s, not this file's. Anything that must not
   go out AT ALL belongs in one of the two lists above, where it can carry its
   reason.

   THE ORDER IS `buildShelf`'s OWN AND IS COPIED RATHER THAN CHOSEN — ruled-out
   before never-published — so that a row which ever matched both could not
   change which `drop` bucket it lands in by this function being introduced.
   No row matches both today (the three RULED_OUT basenames are `.png`, the
   never-published class is `audio/burps/*.wav`); the order is fixed anyway,
   because a refactor must not be able to move a count.

   Returns null when the row may be used, or `{ bar, reason, citation? }`. */
export function publishRefusal(row) {
  const p = row.path;
  const ro = ruledOut(p);
  if (ro) return { bar: "RULED OUT", reason: ro };
  const np = neverPublished(p);
  if (np) {
    return { bar: "NEVER PUBLISHED", what: np.what,
      reason: np.reason, citation: np.citation };
  }
  return null;
}

/* ═══ THE LABEL ════════════════════════════════════════════════════════════ */
const TITLE = s => s.charAt(0).toUpperCase() + s.slice(1);
export function labelOf(e) {
  const base = e.path.split("/").pop();
  const stem = base.replace(/\.[a-z0-9]+$/i, "");
  let m;
  if ((m = e.path.match(/\/manual\/page-(\d+)\.png$/)))
    return { text: "Page " + Number(m[1]) };
  if ((m = e.path.match(/\/manual\/tuning\/compare-page-(\d+)\.png$/)))
    return { text: "Tuning · page " + Number(m[1]) };
  if ((m = e.path.match(/\/audio\/build\/SD-(\d+)\/(.+)\.(?:mp3|wav)$/)))
    return { text: "Card " + m[1] + " · track " + m[2] };
  /* a written description beats anything derived — first clause only, because
     a tile wants a label and not a caption */
  if (e.what) return { text: String(e.what).split(/\.\s|—/)[0].trim() };
  /* IMG_9766 and mgk65_reveal_treatments-20260715 are a camera counter and an
     export date. Neither describes anything, and dressing them up would be
     inventing a description. */
  if (/^IMG[_-]?\d+$/i.test(stem) || /-\d{8}$/.test(stem))
    return { text: stem.replace(/[_-]+/g, " "), undescribed: true };
  return { text: TITLE(stem.replace(/[_-]+/g, " ").replace(/\s+/g, " ")) };
}

export const SECTIONS = [
  { key: "manual", kind: "read", label: "The Manual",
    blurb: "The 1965 operating and maintenance manual, page by page. Open one to read the type.",
    test: e => /^public\/held\/robots\/manual\/page-/.test(e.path) },
  { key: "photos", kind: "look", label: "Photographs of the machines",
    test: e => /^public\/(held\/)?robots\/reference\//.test(e.path) },
  { key: "art", kind: "look", label: "Covers and artwork",
    test: e => /^public\/(held\/)?robots\/art\//.test(e.path) },
  { key: "recordings", kind: "hear", label: "Recordings off the build cards",
    blurb: "Three cards. Press play on any of them.",
    test: e => /^public\/held\/robots\/audio\/build\//.test(e.path) },
  { key: "sound", kind: "hear", label: "Other sound the house holds",
    test: e => /^public\/held\/robots\/audio\/(?!build\/)/.test(e.path) },
  { key: "tuning", kind: "look", label: "Manual tuning sheets",
    test: e => /^public\/held\/robots\/manual\/tuning\//.test(e.path) },
  { key: "plates", kind: "look", label: "Plates",
    test: e => /^public\/held\/robots\/plates\//.test(e.path) },
  { key: "twin", kind: "look", label: "Portal program artwork",
    test: e => /^public\/held\/robots\/twin\//.test(e.path) },
];

/* ═══ THE CATALOGUE ════════════════════════════════════════════════════════ */
function supersededBy(museumRows) {
  const shas = new Set(museumRows.filter(r => !r.missing).map(r => r.sha256));
  const pages = new Set(museumRows
    .map(r => (r.path.match(/^public\/held\/robots\/manual\/page-(\d+)\.png$/) || [])[1])
    .filter(Boolean));
  return e => {
    if (shas.has(e.sha256)) return true;
    const m = e.path.match(/manual\/structure\/pages\/page-(\d+)\.png$/);
    return !!(m && pages.has(m[1]));
  };
}

export function buildShelf() {
  const table = JSON.parse(fs.readFileSync(TABLE, "utf8")).entries;
  const signage = new Set(Object.keys(SIGNAGE).map(k => GOVERNED_PREFIX + k));
  const isSuperseded = supersededBy(table.filter(r => r.repo === "museum"
    && /^public\/(held\/)?robots\//.test(r.path)));
  const drop = { ruled: 0, neverPublished: 0, absent: 0, superseded: 0, elsewhere: 0 };
  const out = [];

  for (const s of SECTIONS) {
    for (const e of table.filter(r => r.repo === "museum" && s.test(r))) {
      /* [2026-08-28] THESE TWO WERE INLINE AND ARE NOW THE EXPORTED PRIMITIVES,
         so that the claim "the compiler asks the same question as the bench" is
         provable rather than asserted. Same tests, same order, same buckets —
         the shelf was measured identical across the move. */
      if (ruledOut(e.path)) { drop.ruled++; continue; }
      /* [2026-08-25] BEFORE the `missing` test on purpose: never-published is a
         fact about the CLASS and is true whether or not the file is on disk
         today. Counting one of these as "absent" would file a standing rule
         under a bookkeeping accident. */
      if (neverPublished(e.path)) { drop.neverPublished++; continue; }
      if (e.missing) { drop.absent++; continue; }
      const pub = "/" + e.path.replace(/^public\/held\//, "").replace(/^public\//, "");
      if (signage.has(pub)) { drop.ruled++; continue; }
      const lab = labelOf(e);
      /* `raw` IS THE ASSET-TABLE ROW, CARRIED WHOLE AND ON PURPOSE.
         thumbnails() keys off e.kind / e.repo / e.path / e.sha256, and this
         file uses `kind` for how a SECTION is drawn (read/look/hear/say). The
         two meanings collided twice and both times the result was silent: 143
         tiles with no picture and a thumbnail count of zero, because every row
         failed the `kind !== "image"` test. Passing the untouched row removes
         the collision instead of renaming around it. */
      out.push({
        id: pub, uid: e.uid, section: s.key, kind: s.kind, raw: e,
        label: lab.text, undescribed: !!lab.undescribed,
        mediaKind: e.kind, w: e.w, h: e.h, href: diskHref(e),
      });
    }
  }
  /* robots-repo rows never appear: a thing still only there cannot be shown by
     any Record this week, so offering it offers something he cannot have. */
  for (const e of table.filter(r => r.repo === "robots")) {
    if (isSuperseded(e)) drop.superseded++; else drop.elsewhere++;
  }
  return { rows: out, drop };
}
