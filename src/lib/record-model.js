// src/lib/record-model.js — THE RECORD'S CONTENT MODEL.
//
// [L6 2026-08-02] BINGE PREP, the doctrine made concrete.
// MIKE: "the Record must carry weeks of material at launch and accept evidence
// classes beyond plates (photos, transmissions, documents). Build the model +
// the surfaces that display each class, all data-driven, all empty-and-honest
// until Mike's content arrives."
//
// D-BINGE says a Record of ten entries and a Record of four hundred are the same
// component, and the one that breaks at four hundred is not finished. D-EPISODE
// says the slot has to carry a WEEK. D-WEEKLY-EVERYWHERE names the thing that
// was missing before either could be true: **"The Record's `stamp` is a display
// string, not a date — it would need a real one."**
//
// So this module is the date and the classes, in one place, as plain functions:
//
//   · `entryDate`      — the real date behind an entry, however it was written
//   · `entryStamp`     — what the register prints, derived when not authored
//   · `periodKey/Label`— the month an entry belongs to, for walking weeks
//   · `groupByPeriod`  — the index, banded, in the order it is being read
//   · `evidenceOf`     — which payload classes an entry actually carries
//
// PURE AND FRAMEWORK-FREE ON PURPOSE, like `fact-select.js`: the renderer asks
// it questions and it never asks the renderer anything.
//
// ── THE MODEL ────────────────────────────────────────────────────────────────
//
//   entry = {
//     date?     "YYYY-MM-DD"  the real date. Optional — an entry without one
//                             still renders, it just cannot be banded.
//     stamp?    "01 JAN 24"   what the register prints. Derived from `date`
//                             when absent, so new entries need only the date.
//     title     the day's one thing, stated plainly
//     evidence? "document"    A WORD. There is NO permitted list, here or in
//                             the renderer or in the CSS (B9's ruling) — a class
//                             Mike invents next month needs no code.
//     line?     one true sentence · note? a quieter aside
//
//     — the payloads, any combination, all optional —
//     wire?     [ "KEY   value", … ]   A TRANSMISSION. The register block the
//                                      machine's own pages already speak.
//     plates?   [ { img, href?, label?, date? } ]
//                                      PHOTOGRAPHS. The plate wall's shape and
//                                      the microfiche reader's shape, so a photo
//                                      attached to a Tuesday in 2024 opens in
//                                      the identical reader as a plate off the
//                                      wall.
//     docs?     [ { title, source?, date?, pages?, scan?, extract?, note? } ]
//                                      DOCUMENTS. A document is a thing with a
//                                      PROVENANCE (who wrote it, when, how many
//                                      pages) and then, separately, an image of
//                                      it and/or words taken out of it. Those
//                                      three arrive at different times, which is
//                                      why they are three fields and not one.
//   }
//
// EMPTY IS A STATE, NOT AN ABSENCE. A document that is held but not yet
// photographed declares its provenance and no `scan`, and the surface says so —
// the same discipline as B8's reel, which ships empty and prints "reel empty"
// rather than rendering nothing and hoping.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday",
              "Thursday", "Friday", "Saturday"];

/* An ISO date, parsed as a CALENDAR date and not as an instant. `new Date("2024-01-01")`
   is midnight UTC, which is the 31st of December in every timezone west of
   Greenwich — a log that shifts its own dates by a day depending on where it is
   read is not a record. Parsed by hand so it cannot. */
export function entryDate(entry) {
  const raw = entry && entry.date;
  if (typeof raw !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, m: mo, d };
}

/* What the register prints. An authored `stamp` always wins over a derived one.
   [HR 2026-08-04] AND AN ENTRY MAY HAVE NEITHER. The Record's one surviving
   entry carries no `date` and no `stamp`, because Mike ruled the dates invented
   and Ops does not supply one (OPERATIONS Doctrine 12). This function returning
   "" is therefore the LIVE path, not a defensive branch — the register prints
   no stamp for that row and the dateline prints `Record 013` alone. */
export function entryStamp(entry) {
  if (entry && typeof entry.stamp === "string" && entry.stamp) return entry.stamp;
  const dt = entryDate(entry);
  if (!dt) return "";
  return String(dt.d).padStart(2, "0") + " " +
         MONTHS[dt.m - 1].toUpperCase() + " " +
         String(dt.y).slice(2);
}

/* THE BAND IS A MONTH, and that is arithmetic rather than taste. D-EPISODE's
   unit is the WEEK, so a week is the obvious band — and at the volume D-BINGE
   asks for, two years of weekly episodes is a hundred headings, which is a
   hundred rows of furniture in an index that is trying to be walkable. A month
   bands the same material into twenty-four, each entry still carrying its own
   day in its stamp. The week survives where it belongs: in the entries. */
export function periodKey(entry) {
  const dt = entryDate(entry);
  return dt ? dt.y * 100 + dt.m : null;
}

export function periodLabel(key) {
  if (!Number.isFinite(key)) return "";
  const y = Math.floor(key / 100), m = key % 100;
  if (m < 1 || m > 12) return "";
  return MONTHS[m - 1].toUpperCase() + " " + y;
}

/* The index, banded. Returns a flat list of { band, label } and { entry, index }
   rows in the order given — the CALLER decides the order (the Record reads
   newest-first), so this never reverses anything behind its back.
   `index` is the position in the list it was handed, which is what the opener
   needs; the entry's position in the DATA is nobody's business here. */
export function groupByPeriod(list) {
  const out = [];
  let cur = null;
  (list || []).forEach((entry, index) => {
    const key = periodKey(entry);
    if (key !== null && key !== cur) {
      cur = key;
      out.push({ band: key, label: periodLabel(key) });
    }
    out.push({ entry, index });
  });
  return out;
}

/* Whether banding is worth its furniture. One month of entries banded under one
   heading is a heading that says nothing; a short record reads better flat.
   Both conditions have to hold, so a long record inside a single month stays
   flat too. */
export function shouldBand(list, minEntries = 14) {
  const arr = list || [];
  if (arr.length < minEntries) return false;
  const keys = new Set();
  for (const e of arr) {
    const k = periodKey(e);
    if (k !== null) keys.add(k);
  }
  return keys.size > 1;
}

/* WHICH CLASSES AN ENTRY ACTUALLY CARRIES, counted. This is what lets the index
   tell a reader that a week brought three photographs and a transmission before
   they open it — which is the whole point of classing at all, and is the
   difference between a register you can binge and a list you must exhaust.
   Returns [] for an entry with no payloads, so a plain paragraph entry renders
   exactly as it did before. */
export function evidenceOf(entry) {
  const out = [];
  const n = (v) => (Array.isArray(v) ? v.length : 0);
  if (n(entry && entry.wire))   out.push({ kind: "wire",   count: n(entry.wire) });
  if (n(entry && entry.plates)) out.push({ kind: "plates", count: n(entry.plates) });
  if (n(entry && entry.docs))   out.push({ kind: "docs",   count: n(entry.docs) });
  return out;
}

/* A document's state, which is the honest half of "empty-and-honest".
   `imaged`   — there is a photograph of the page; it opens in the reader
   `quoted`   — no image yet, but words have been taken out of it
   `held`     — its provenance is recorded and nothing else has arrived
   The renderer prints the state; it never guesses one. */
export function docState(doc) {
  if (!doc || typeof doc !== "object") return "held";
  if (doc.scan) return "imaged";
  if (doc.extract) return "quoted";
  return "held";
}

/* ======== [RC 2026-08-04] THE DATELINE ====================================
   MIKE'S APPROVED RECORD-ENTRY SHAPE opens with `WEEK n · DAY · Record nnn`,
   and two of those three are ARITHMETIC ON THE DATE THE ENTRY ALREADY CARRIES.
   Deriving them is not cleverness, it is the same discipline `entryStamp`
   already runs under: sixty entries authoring their own week number by hand is
   sixty chances for a week to disagree with its own date, and the one that
   disagrees is the one a reader notices.

   THE WEEK NEEDS AN EPOCH AND THE EPOCH IS DECLARED, NOT ASSUMED — the face
   says which day is day one (`recordEpoch`), because "week 3" is meaningless
   without saying week three OF WHAT, and inventing an epoch inside a library
   function is inventing a fact about the story.

   THE RECORD NUMBER IS AUTHORED AND CANNOT BE OTHERWISE. Position in the list
   is not the number — the volume is a sample of a much longer log, entries are
   not one per day, and numbering by index would renumber every entry the day a
   new one is inserted. An entry with no `no` prints no number, which is honest.
   [HR 2026-08-04] `Week n` needs BOTH a `recordEpoch` on the face and a `date`
   on the entry, and the Record declares neither today — so the dateline is one
   part long. That is the function doing its job, not a gap in it. */
export function entryWeekday(entry) {
  const dt = entryDate(entry);
  if (!dt) return "";
  /* UTC on both sides, for the same reason `entryDate` parses by hand: a
     weekday that depends on where the page is read is not a weekday. */
  return DAYS[new Date(Date.UTC(dt.y, dt.m - 1, dt.d)).getUTCDay()];
}

export function entryWeek(entry, epoch) {
  const dt = entryDate(entry);
  const ep = entryDate(typeof epoch === "string" ? { date: epoch } : epoch);
  if (!dt || !ep) return null;
  const from = Date.UTC(ep.y, ep.m - 1, ep.d);
  const to = Date.UTC(dt.y, dt.m - 1, dt.d);
  if (to < from) return null;            /* before day one is not week zero */
  return Math.floor((to - from) / 604800000) + 1;
}

/* The parts, in reading order, with the ones that cannot be derived simply
   absent. The renderer joins them; it never fills a gap with a guess. */
export function entryDateline(entry, epoch) {
  const out = [];
  const w = entryWeek(entry, epoch);
  if (w !== null) out.push("Week " + w);
  const d = entryWeekday(entry);
  if (d) out.push(d);
  const n = entry && entry.no;
  if (typeof n === "number" && Number.isFinite(n)) {
    out.push("Record " + String(n).padStart(3, "0"));
  }
  return out;
}

export default {
  entryDate, entryStamp, periodKey, periodLabel,
  groupByPeriod, shouldBand, evidenceOf, docState,
  entryWeekday, entryWeek, entryDateline,
};
