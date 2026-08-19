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
//                             [R5 2026-08-06] NOTHING RENDERS IT TODAY. Mike
//                             struck the badge it printed — "I see no richness
//                             in it" — and it could not be made to serve,
//                             because the word had nothing behind it: no
//                             registry of objects to open, no list to pop, and
//                             inventing one would be Doctrine 12 with a button
//                             on it. The FIELD survives here because it is his
//                             own model and it costs a line; it comes back on
//                             the glass the day it points at something, and a
//                             FILTER over a long Record is the obvious day.
//                             Do not read its presence as evidence it is drawn.
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
/* [2026-08-19] `docs` PRINTS AS "ATTACHMENTS", AND THE REST OF THIS COMMENT IS
   THE REASON THE BUG EXISTED AT ALL. `kind` is BOTH the field name and the word
   on the glass — `.vp-fe-load` upper-cases it and prints it — so every entry in
   this list is a raw field name that a reader meets. Record 003 is the first
   entry that ever made the badge draw, and the first word it drew was `DOCS`,
   which is what the field is called and not what the thing is.
   ONLY THIS ONE IS RULED. `wire` and `plates` still print WIRE and PLATES and
   are NOT changed here — they are Mike's to word, and nothing has drawn them
   yet. The structural fix is to separate the field name from the printed label
   so a rename cannot reach a reader again; it is offered rather than taken,
   because it touches both renderers and neither of those words is ruled. */
export function evidenceOf(entry) {
  const out = [];
  const n = (v) => (Array.isArray(v) ? v.length : 0);
  if (n(entry && entry.wire))   out.push({ kind: "wire",   count: n(entry.wire) });
  if (n(entry && entry.plates)) out.push({ kind: "plates", count: n(entry.plates) });
  if (n(entry && entry.docs))   out.push({ kind: "attachments", count: n(entry.docs) });
  return out;
}

/* ======== [A1/A2 2026-08-08] THE ATTACHMENTS ==============================
   MIKE'S RULING, and the boundary above it is the more important half:
   **"THE RECORD IS EMAIL-LIKE. IT IS NOT AN EMAIL PROGRAM."** No From, no To,
   no Subject, no reply, no inbox, no message headers. What is borrowed is the
   REGISTER ONLY — the plainness, and the attachments-at-the-bottom convention.

   So: **an entry may carry both authored sections and payloads, and the
   payloads sit at the BOTTOM, after the writing.** Until today a long-form
   entry drew `wire`, `plates` and `docs` nowhere at all and reported nothing
   (S-c/D-b). This is the flattening that makes one list out of three fields.

   ONE SHAPE, THREE KINDS, AND THE DATA IS THE ONLY DIFFERENCE — his words. A
   photograph, a document and a transmission all become the same row: a small
   preview, a name, a line of detail, and whatever text the payload itself
   carries. The kind decides the glyph and nothing else.

   WHY A TRANSMISSION IS ONE ROW AND NOT N. `wire` is a register of lines — it
   is one object that happens to be written on several lines, the way a printout
   is one printout. Ten plates are ten photographs; ten wire lines are one
   transmission.

   AND ITS LINES TRAVEL WITH IT RATHER THAN BEING HIDDEN BEHIND IT. R4's
   no-hidden-information law binds this surface: nothing here collapses, pages,
   truncates or hides behind a "more". A transmission's lines and a document's
   extract are TEXT, so they print inside the row. An attachment row that
   swallowed its own words to look tidy would be the teaser Mike struck from the
   index, one level down.

   `openable` IS COMPUTED HERE AND NOT GUESSED IN THE RENDERER, because "can
   this be opened in the reader" is a fact about the payload (is there an image
   on file), not a rendering choice. */
export function attachmentsOf(entry) {
  const out = [];
  const e = entry || {};

  if (Array.isArray(e.wire) && e.wire.length) {
    out.push({
      kind: "transmission",
      name: "Transmission",
      meta: e.wire.length + (e.wire.length === 1 ? " line" : " lines"),
      lines: e.wire.slice(),
      openable: false,
    });
  }

  if (Array.isArray(e.plates)) {
    e.plates.forEach((p, i) => {
      if (!p) return;
      out.push({
        kind: "photograph",
        /* the label if it has one; otherwise the file's own name, which is a
           fact rather than a caption Ops made up for the row. */
        name: p.label || fileNameOf(p.img) || "Photograph",
        meta: p.date || "",
        img: p.img || null,
        openable: !!p.img,
        set: e.plates,
        index: i,
      });
    });
  }

  if (Array.isArray(e.docs)) {
    e.docs.forEach((doc) => {
      if (!doc) return;
      const state = docState(doc);
      const img = doc.scan
        || (Array.isArray(doc.plates) && doc.plates.length ? doc.plates[0].img : null);
      const bits = [];
      if (doc.source) bits.push(doc.source);
      if (doc.date) bits.push(doc.date);
      if (doc.pages) bits.push(doc.pages + (doc.pages === 1 ? " page" : " pages"));
      /* THE STATE IS ON THE ROW WHEN THERE IS NOTHING TO OPEN, and only then.
         "held" beside a document you can open is noise; "held" beside one you
         cannot is the whole of what the reader needs to know. */
      if (state === "held") bits.push("not here yet");
      out.push({
        kind: "document",
        name: doc.title || "Document",
        meta: bits.join(" · "),
        img,
        openable: !!img,
        extract: doc.extract || null,
        note: doc.note || null,
        set: Array.isArray(doc.plates) && doc.plates.length
          ? doc.plates : (img ? [{ img, label: doc.title }] : null),
        index: 0,
      });
    });
  }

  return out;
}

function fileNameOf(p) {
  if (typeof p !== "string") return null;
  const last = p.split("/").pop() || "";
  return last || null;
}

/* A document's state, which is the honest half of "empty-and-honest".
   `imaged`   — there is a photograph of the page; it opens in the reader
   `quoted`   — no image yet, but words have been taken out of it
   `held`     — its provenance is recorded and nothing else has arrived
   The renderer prints the state; it never guesses one. */
/* [N3 2026-08-06] `plates` COUNTS AS IMAGED, and it is the multi-page case.
   A document with one photograph declares `scan`; a document with a REEL of
   them declares `plates` — the plate wall's own shape, so a manual's pages open
   in the identical reader as a photograph off the wall. `pages` is NOT that
   field and never was: it is a COUNT on the catalogue card, which is a thing a
   librarian knows before anybody has photographed anything. */
export function docState(doc) {
  if (!doc || typeof doc !== "object") return "held";
  if (Array.isArray(doc.plates) && doc.plates.length) return "imaged";
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
  groupByPeriod, shouldBand, evidenceOf, docState, attachmentsOf,
  entryWeekday, entryWeek, entryDateline,
};
