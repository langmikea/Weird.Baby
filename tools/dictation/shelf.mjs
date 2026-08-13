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
  const drop = { ruled: 0, absent: 0, superseded: 0, elsewhere: 0 };
  const out = [];

  for (const s of SECTIONS) {
    for (const e of table.filter(r => r.repo === "museum" && s.test(r))) {
      const base = e.path.split("/").pop();
      if (Object.prototype.hasOwnProperty.call(RULED_OUT, base)) { drop.ruled++; continue; }
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
