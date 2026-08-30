#!/usr/bin/env node
/* ===========================================================================
   EMIT-RECORD-ENTRIES — turn Mike's working copy of the Record into entry
   source. [L1–L4 2026-08-09 · rewritten for the Record editor, E1 2026-08-09]
   ---------------------------------------------------------------------------
   THE ENTRIES ARE GENERATED RATHER THAN RETYPED, and that is the whole reason
   this file exists. The literals it prints ARE the strings he typed, so there is
   no transcription step for a character to go missing in — and `--verify`
   proves it by reading the emitted source back and comparing, string by string,
   to the draft it came from.

   ═══ WHAT CHANGED, AND IT IS THE INPUT RATHER THAN THE IDEA ════════════════
   It used to read `answers.json` — four textareas a day off the two-column
   worksheet — and CUT each box into sections by the capitals rule, guessing
   structure out of prose. Mike retired that page: he writes in the Record
   itself now, so **the structure arrives already made.** A section is a section
   because he made one, a paragraph is a paragraph because he pressed Enter, and
   the whole cutting rule is gone from this file. It lives in
   `reveal/record-shape.mjs`, where the editor's own migration still needs it
   for text coming out of the old form.

   THE `[MIKE-NOTE]` / `[OPS]` MARKING IS GONE TOO. It prefixed his notes and
   printed Ops' answers beneath them, in red and blue, in the published entry.
   He struck the arrangement — *"that was Ops answering in the wrong place"* —
   so a note is a curly brace in his working copy and this tool REFUSES to emit
   one: braces are for Ops to act on before an entry lands, and an entry that
   ships with one would fail `npm run reveal:check` and the launch build anyway.
   Better to be told here, with the note quoted, than by a gate two steps later.

     npm run record:land                      print the source
     npm run record:land -- --verify          prove it round-trips
     npm run record:land -- --no <n>          just one record
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
/* guard 8 asks git two questions: when the Record last moved, and whether a
   record number has ever been in it. Both are facts only the history holds. */
import { execFileSync } from "node:child_process";
/* [2026-08-13] the emitter reads the CURRENT file's comments so it can carry
   them through; acorn is already this repo's parser everywhere else. */
import * as acorn from "acorn";
import { recordEpoch, textOf } from "../../reveal/record-entries.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");

const argv = process.argv.slice(2);
const only = (() => { const i = argv.indexOf("--no"); return i >= 0 ? Number(argv[i + 1]) : null; })();
/* [2026-08-13] `--draft <path>` — a working copy that is not the default one.
   It exists for the two things that must run against a draft that is not
   Mike's: the round-trip proof, which derives a draft FROM the tree and
   expects the file back byte for byte, and the Saturday rehearsal. The
   default is unchanged and is still his file. */
const DRAFT = (() => {
  const i = argv.indexOf("--draft");
  return i >= 0 ? path.resolve(argv[i + 1])
    : path.join(REPO, "docs", "dictation-20260807", "record-draft.json");
})();

if (!fs.existsSync(DRAFT)) {
  console.error(`No working copy at ${path.relative(REPO, DRAFT)}.`);
  console.error("");
  console.error("It is written by the Save to the repo button on");
  console.error("docs/dictation-20260807/record.html. If Mike has been writing and the");
  console.error("file is not here, his words are in the browser store and");
  console.error("tools/dictation/RESCUE.md is how they come out.");
  process.exit(1);
}

const draft = JSON.parse(fs.readFileSync(DRAFT, "utf8"));
const all = Array.isArray(draft.entries) ? draft.entries : [];
const entries = only == null ? all : all.filter(e => e.no === only);
if (!entries.length) { console.error(`nothing to emit${only == null ? "" : ` for record ${only}`}`); process.exit(1); }

/* ── EVERY STRING IN AN ENTRY, IN READING ORDER ───────────────────────────── */
function strings(e) {
  const out = [];
  for (const k of ["title", "line", "lead", "tomb", "stillCaption"]) if (e[k]) out.push([k, e[k]]);
  (e.sections || []).forEach((s, i) => {
    if (s.label) out.push([`section ${i + 1} heading`, s.label]);
    (s.body || []).forEach((p, j) => out.push([`section ${i + 1}, paragraph ${j + 1}`, textOf(p)]));
  });
  /* [2026-08-16] THE ATTACHMENT TITLES ARE HIS STRINGS TOO. His workbook's
     ATTACHMENTS section lands as `docs` rather than as a text section
     (workbook_to_draft.py), so its lines left `strings()` — and `--verify`
     would have gone on reporting ALL STRINGS ROUND-TRIP while proving nothing
     about them. A proof that stops covering a field the moment that field moves
     is the failure it exists to catch. */
  (e.docs || []).forEach((d, i) => {
    if (d && d.title) out.push([`attachment ${i + 1}`, d.title]);
  });
  return out;
}

/* ── THE NOTES ARE REFUSED, WITH THE NOTE QUOTED ─────────────────────────── */
const notes = [];
for (const e of entries) {
  for (const [where, s] of strings(e)) {
    for (const m of s.match(/\{[^{}]*\}/g) || []) {
      notes.push(`Record ${String(e.no).padStart(3, "0")} · ${where}\n    ${m}`);
    }
  }
}
if (notes.length && !argv.includes("--with-notes") && !argv.includes("--verify")) {
  console.error(`${notes.length} note(s) to Ops are still in this draft. Act on each one and`);
  console.error("take it out of the entry before landing it — a curly brace is Mike writing");
  console.error("to Ops, never story, and it must not reach the museum's data.\n");
  for (const n of notes) console.error("  " + n);
  console.error("\n(--with-notes emits anyway, and the packet gate will refuse it.)");
  process.exit(1);
}

/* NOTE: --verify is a CHECK and not a landing, so it runs even with notes
   still in the draft — the whole point of it is to prove the strings survive
   the trip, and a draft with notes in it is the ordinary state of a draft. */

/* ── VERIFY ──────────────────────────────────────────────────────────────── */
const q = (s) => JSON.stringify(s);
/* one plate, written the one way both places a plate hangs are read - the
   mirror of `platesOf` in reveal/record-entries.mjs */
const plate = (pl) => pl && pl.label
  ? `{ img: ${q(pl.img)}, label: ${q(pl.label)} }`
  : `{ img: ${q(pl.img)} }`;
/* [2026-08-29] one door, the mirror of the reader's `door` branch — the same
   construction as `plate` above and for the same reason: both ends of one round
   trip, written once each, facing each other.

   IT IS AN OBJECT AND IT STAYS ONE. `{ event }` and not `doorEvent`, because
   `record-model.js` reads `doc.door` and `Robots.jsx` dispatches what is inside
   it; a flattened key would be a third spelling of a thing that already has
   two ends agreeing. `event` is the only key the reader can produce
   (reveal/record-entries.mjs, the `doorNode` branch), so it is the only key
   written — and a door that grows a second one is REFUSED by name in
   `emitFaults` rather than dropped here, which is this file's own rule about
   the silent half of a round trip applied one level further down. */
const door = (d) => `{ event: ${q(d.event)} }`;
const wrap = (s, indent) => {
  /* one literal per paragraph, broken across lines only where a space allows,
     so the file stays readable and the string stays exact.

     === [N1 2026-08-11] IT SPLITS ON TOKENS, AND HIS SPACING SURVIVES ========
     `--verify` caught this the first time the writer ran against one of Mike's
     real drafts: `1 of 71 MISMATCHED`. Five leading spaces were gone and two
     trailing had collapsed to one, on the paragraph beginning "Not single
     sourced". THE CAUSE WAS `s.split(" ")` REJOINED WITH SINGLE SPACES: any run
     of more than one space collapsed, and a leading or trailing run vanished
     entirely, because `cur ? cur + " " + w : w` cannot begin with an empty
     token. On a surface whose whole rule is that his characters are unchanged
     — the round that landed Record 001 kept `was made made` and `=  86%` on
     purpose — that is the writer editing him, silently, in the one direction
     nobody would think to check.
     Matching `\s+|\S+` keeps whitespace as tokens of its own, so the
     concatenation of the parts IS the original string byte for byte, and a
     break may fall inside a run of spaces without changing it. */
  const max = 74 - indent;
  if (s.length <= max) return q(s);
  const parts = []; let cur = "";
  /* [N1 2026-08-11] TOKENS, NOT `split(" ")` — see the note above the loop. */
  for (const t of s.match(/\s+|\S+/g) || []) {
    if (cur && (cur + t).length > max) { parts.push(cur); cur = t; }
    else cur += t;
  }
  if (cur) parts.push(cur);
  return parts.map(q).join("\n" + " ".repeat(indent) + "+ ");
};

/* THE PROOF, AND IT TESTS THE THING THAT CAN ACTUALLY GO WRONG. The risk in
   this file is `wrap()`: it breaks a long string into a `+` chain, and a chain
   that loses or doubles a space is a silent edit of his words. So the check
   EVALUATES the emitted literal — `JSON.parse` on each piece, joined the way
   JavaScript would join them — and compares to the source string. */
function unwrap(text) {
  const pieces = [];
  const re = /"(?:[^"\\]|\\.)*"/g;
  let m;
  while ((m = re.exec(text))) pieces.push(JSON.parse(m[0]));
  return pieces.join("");
}

if (argv.includes("--verify")) {
  let bad = 0, n = 0;
  for (const e of entries) {
    for (const [where, s] of strings(e)) {
      const got = unwrap(wrap(s, 20));
      n++;
      if (got !== s) {
        bad++;
        console.log(`MISMATCH Record ${e.no} ${where}`);
        console.log("  want:", q(s).slice(0, 300));
        console.log("  got :", q(got).slice(0, 300));
      }
    }
    console.log(`  ok  Record ${String(e.no).padStart(3, "0")}  `
      + `${(e.sections || []).length} section(s), `
      + `${(e.sections || []).reduce((a, s) => a + (s.body || []).length, 0)} paragraph(s), `
      + `${strings(e).length} string(s)`);
  }
  console.log(bad ? `\n${bad} of ${n} MISMATCHED` : `\nALL ${n} STRINGS ROUND-TRIP: his characters are unchanged.`);
  process.exit(bad ? 1 : 0);
}

/* ── EMIT ────────────────────────────────────────────────────────────────── */
/* [2026-08-13] ONE ENTRY AT A TIME, so that `--write` can choose per entry
   between generating it and carrying the original source through untouched.
   What it generates is unchanged. */
/* ═══ [2026-08-24] THE INDEX COMES FROM THE ENTRY'S DAY, NOT FROM ITS NUMBER ══
   MIKE'S RULING — **SED: build for everyday drops, drop on the days you choose.**
   The calendar is DUMB: `recordDay(n)` is `epoch + (n − 1)` with no weekend
   logic, no holiday table, and nothing anywhere skips anything. Which days get
   a Record is decided by WHICH ENTRIES EXIST, which is Mike writing or not
   writing. So a gap in the numbers is not a defect and must never be "fixed".

   WHAT THAT MAKES THE NUMBER: a LABEL. `no: 6` is the sixth Record, not the
   sixth day. THE ENTRY'S OWN DAY IS THE AUTHORITY, and this line is where that
   is decided — until today it emitted `recordDay(e.no)`, which threw the
   drafted day away and re-derived it from the label. An entry Mike dated Monday
   landed on whatever day its number happened to fall on.

   AND THE CALL SURVIVES, WHICH IS THE POINT OF DOING IT THIS WAY. D1's
   one-field rule is untouched: no literal date is ever emitted, so a launch
   slip still moves ONE line — `RECORD_EPOCH` — and every entry follows it. What
   changed is only WHERE THE INDEX COMES FROM. Emitting `date: "2026-09-02"`
   would have satisfied the ruling and broken the slip, which is why it is not
   what this does.

   THE INDEX IS COMPUTED AGAINST THE TREE'S EPOCH, not the draft's. The draft's
   `epoch` field records what was true when Mike wrote; the emitted call resolves
   against `RECORD_EPOCH` at build time, so the index has to be measured from the
   same origin the call will be read against. A draft carrying a stale epoch —
   which is the state that made this a bug worth finding — then lands correctly
   rather than landing its staleness.

   ═══ [FLAG 2026-08-28 · measured, placed not fixed] AND AN EPOCH MOVE MAKES THAT
       PARAGRAPH PRODUCE NEGATIVE DAYS ════════════════════════════════
   Ruling D moved `RECORD_EPOCH` from 2026-08-31 to 2026-09-07 while the saved
   draft still carried the five days it was written against. A dry run then
   printed `date: recordDay(-6)` through `recordDay(-2)` — the five Records dated
   a WEEK BEFORE day one, which is the epoch move being silently undone by a
   file nobody thought of as a date source.

   WHAT IT COSTS ON THE GLASS, MEASURED RATHER THAN GUESSED: `entryWeek()` in
   `src/lib/record-model.js` returns `null` for any date before the epoch — its
   own line reads *"before day one is not week zero"* — so the dateline **drops
   `Week 1` and prints `Monday · Record 001`**. Nothing throws and nothing prints
   a warning.

   THE `--write` GUARD DOES NOT COVER IT. `treeMovedAt()` below consults
   `robots-record.js` and its git log, and NOTHING ELSE. `record-epoch.js` is not
   in it, so an epoch move on its own leaves the draft looking newer than the
   Record and the refusal never fires. It fired on 2026-08-28 only because that
   round also touched `robots-record.js` — luck, and named as luck.

   NOT FIXED, AND THE REASON IS THAT IT MAY NOT BE A DEFECT. The header above
   rules that THE ENTRY'S OWN DAY IS THE AUTHORITY; on that reading, preserving
   Mike's drafted days across an epoch move is this function working. On the
   other reading, D1's whole rule is that one line moves and EVERYTHING follows.
   **Those two rules genuinely disagree here and it is Mike's call, not a typo
   correction.** Until it is made: **after moving the epoch, open the day editor
   and save before anybody runs `record:land -- --write`.** Filed in OPERATIONS
   §8. */
const EPOCH_MS = Date.parse(recordEpoch() + "T00:00:00Z");
function dayIndex(iso) {
  const t = Date.parse(iso + "T00:00:00Z");
  if (!Number.isFinite(t) || !Number.isFinite(EPOCH_MS)) return null;
  return Math.round((t - EPOCH_MS) / 86400000) + 1;
}

function generate(e) {
  const out = [];
  out.push(`            { no: ${e.no},`);
  /* the date is emitted as `recordDay(<index>)` and never as a literal — see
     THE INDEX COMES FROM THE ENTRY'S DAY above. The index is the entry's day
     measured from the epoch; the number beside it is a label. */
  if (e.date) {
    const idx = dayIndex(e.date);
    if (idx === null) {
      console.error(`record:land REFUSED — Record ${e.no} has date ${JSON.stringify(e.date)},`);
      console.error(`which is not a day this can measure from the epoch (${recordEpoch()}).`);
      console.error("Nothing was written. A date that cannot be placed on the calendar is not");
      console.error("a date, and guessing one would put an entry on a day nobody chose.");
      process.exit(1);
    }
    out.push(`              date: recordDay(${idx}),`);
  }
  if (e.stamp) out.push(`              stamp: ${q(e.stamp)},`);
  if (e.title) out.push(`              title: ${wrap(e.title, 20)},`);
  if (e.line) out.push(`              line: ${wrap(e.line, 20)},`);
  if (e.lead) out.push(`              lead: ${wrap(e.lead, 20)},`);
  if (e.still) out.push(`              still: placed(${q(e.still)}),`);
  if (e.stillCaption) out.push(`              stillCaption: ${wrap(e.stillCaption, 20)},`);
  out.push(`              sections: [`);
  /* [F 2026-08-13] MIKE: "a section whose body is empty after notes are removed
     is dropped entirely, label included." The second of the three places this
     is enforced — the reader drops it, this refuses to WRITE it into the tree,
     and `RecordEntry.jsx` refuses to draw one that arrives any other way. A
     paragraph of whitespace is not a body; an empty cell can round-trip through
     three tools and arrive as `[""]`. */
  for (const s of (e.sections || [])
         .filter(s => (s.body || []).some(p => textOf(p).trim() !== ""))) {
    out.push(`                { ${s.label ? `label: ${q(s.label)},` : "label: null,"}`);
    out.push(`                  body: [`);
    for (const p of s.body || []) {
      /* A LISTING IS WRITTEN BACK AS A LISTING. Emitting `textOf(p)` here would
         carry every character and turn Record 004's folder tree into a
         paragraph - the museum would collapse its columns on the next build
         and nothing would have said a word. */
      if (p && typeof p === "object" && typeof p.pre === "string") {
        out.push(`                    { pre:`);
        out.push(`                      ${wrap(p.pre, 22)} },`);
      } else out.push(`                    ${wrap(p, 20)},`);
    }
    out.push(`                  ] },`);
  }
  out.push(`              ],`);
  /* ═══ [2026-08-25] THE ATTACHMENTS, WHOLE — AND THE COMMENT THAT USED TO BE
     HERE WAS RIGHT ABOUT AUTHORSHIP AND WRONG ABOUT WRITING ════════════════
     It said only `title` is emitted "because only `title` is what he wrote",
     and that a reader filling in `source`, `date`, `scan` or `plates` would be
     inventing provenance. THE FIRST HALF IS STILL TRUE: nothing here authors a
     doc field, and a doc with a title and no image stays a designed state that
     prints "not here yet".
     THE SECOND HALF CONFUSED AUTHORING WITH CARRYING, AND IT COST THE ROUND
     TRIP EVERY PHOTOGRAPH. `draftEntries` has read these fields since
     2026-08-19 precisely so they would travel; this function then wrote them
     away. MEASURED, on the real Record before this change: Record 003's four
     attachments came back as four bare titles - `source` x4, `pages` x4 and
     SIX PLATES with their captions, all gone, with `--verify` printing ALL 51
     STRINGS ROUND-TRIP over the top of it.
     A FIELD THAT ARRIVED IS WRITTEN BACK. That is not provenance invented; it
     is provenance PRESERVED, and it is the U-round rule this file already
     lives under: a generator may remove a field, never the answer that was in
     it. */
  const docs = (e.docs || []).filter(d => d && typeof d.title === "string" && d.title.trim() !== "");
  if (docs.length) {
    out.push(`              docs: [`);
    for (const d of docs) {
      out.push(`                { title: ${wrap(d.title, 18)},`);
      for (const k of ["source", "date", "scan", "extract", "note"]) {
        if (typeof d[k] === "string" && d[k] !== "") out.push(`                  ${k}: ${q(d[k])},`);
      }
      if (typeof d.pages === "number") out.push(`                  pages: ${d.pages},`);
      /* [2026-08-29] BESIDE `pages` AND BEFORE `plates`, WHICH IS THE ORDER THE
         READER READS THEM IN. Ordering an emitter by anything other than its
         reader is how the two drift while both stay correct on their own. */
      if (d.door && typeof d.door.event === "string" && d.door.event !== "") {
        out.push(`                  door: ${door(d.door)},`);
      }
      if (Array.isArray(d.plates) && d.plates.length) {
        out.push(`                  plates: [`);
        for (const pl of d.plates) out.push(`                    ${plate(pl)},`);
        out.push(`                  ],`);
      }
      out.push(`                },`);
    }
    out.push(`              ],`);
  }
  /* [2026-08-25] THE ENTRY'S OWN PAYLOADS, beside the attachments because
     `record-model.js` draws all three through one `attachmentRows` walk. */
  if (Array.isArray(e.wire) && e.wire.length) {
    out.push(`              wire: [`);
    for (const w of e.wire) out.push(`                ${wrap(w, 16)},`);
    out.push(`              ],`);
  }
  if (Array.isArray(e.plates) && e.plates.length) {
    out.push(`              plates: [`);
    for (const pl of e.plates) out.push(`                ${plate(pl)},`);
    out.push(`              ],`);
  }
  if (e.note) out.push(`              note: ${wrap(e.note, 20)},`);
  /* the tombstone closes the entry on the page, so it closes the object here */
  if (e.tomb) out.push(`              tomb: ${wrap(e.tomb, 20)},`);
  out.push(`            },`);
  return out.join("\n");
}

/* ═══ [2026-08-25] THE EMITTER REFUSES A FIELD IT CANNOT WRITE ══════════════
   The mirror, at last, of `READ_ENTRY_FIELDS`. The reader has refused an
   unknown field loudly since 2026-08-11; this end of the same round trip
   dropped four of them without a word, so the trip was only half guarded and
   the unguarded half was the one that WRITES THE TREE.

   IT IS A LIST OF WHAT IS EMITTED, not of what is allowed - the same
   construction as `DRAWN_ENTRY_FIELDS`, and for the same reason: add a field
   to the draft and teach nothing to write it and this refuses, by name, before
   anything reaches disk. */
const EMITTED_ENTRY_FIELDS = new Set([
  "no", "date", "stamp", "title", "line", "lead", "still", "stillCaption",
  "sections", "docs", "wire", "plates", "note", "tomb",
]);
/* [2026-08-29] `door` JOINS THE SET, AND IT IS A MECHANISM CALL RATHER THAN A
   RULING TO ASK FOR. The Portal's console door already exists, already works
   and was already ruled on 2026-08-26; `READ_DOC_FIELDS` has carried it since
   that day. This end had not been taught to write it, so a fresh draft — one
   holding Record 005's attachment whole — was REFUSED by `emitFaults` below,
   on the dry run as well as on `--write`. **The guard was right and the
   emitter was the thing to move**, which is the same shape as the 2026-08-25
   round that added `source`, `pages` and `plates` to this list.
   MEASURED BEFORE THE CHANGE (docs/FINDING-day-editor-save.md): the fault did
   not fire against the draft ON DISK, because that draft is stale and has no
   `docs` on 005 at all. It fired against the TREE. A guard that only goes
   quiet when the data is incomplete is not a guard that has passed. */
const EMITTED_DOC_FIELDS = new Set(
  ["title", "source", "date", "scan", "extract", "note", "pages", "plates",
   "door"]);
/* the door's own key set, for the same reason the doc set exists one level up:
   `event` is what both ends know, and anything else must be taught rather than
   quietly dropped inside an object this file has declared it can write. */
const EMITTED_DOOR_FIELDS = new Set(["event"]);

function emitFaults(list) {
  const out = [];
  for (const e of list) {
    const who = `Record ${e.no == null ? "(unnumbered)" : String(e.no).padStart(3, "0")}`;
    for (const k of Object.keys(e)) {
      if (EMITTED_ENTRY_FIELDS.has(k)) continue;
      out.push(`${who}: the draft carries \`${k}\` and this emitter cannot write it. `
        + `It would be dropped from the tree with nothing said. Teach generate() to `
        + `emit it, or add it to EMITTED_ENTRY_FIELDS with the ruling.`);
    }
    (e.docs || []).forEach((d, i) => {
      for (const k of Object.keys(d || {})) {
        if (EMITTED_DOC_FIELDS.has(k)) continue;
        out.push(`${who}: attachment ${i + 1} carries \`${k}\` and this emitter cannot `
          + `write it. Teach generate(), or add it to EMITTED_DOC_FIELDS with the ruling.`);
      }
      /* the door is an OBJECT this file writes key by key, so the same question
         has to be asked inside it — otherwise `door` being in the set above
         would license dropping whatever it grew next. */
      if (d && d.door && typeof d.door === "object") {
        for (const k of Object.keys(d.door)) {
          if (EMITTED_DOOR_FIELDS.has(k)) continue;
          out.push(`${who}: attachment ${i + 1}'s \`door\` carries \`${k}\` and this `
            + `emitter writes only \`event\`. Teach generate(), or add it to `
            + `EMITTED_DOOR_FIELDS with the ruling.`);
        }
      }
    });
  }
  return out;
}

const EMIT_FAULTS = emitFaults(entries);
if (EMIT_FAULTS.length) {
  console.error("\nrecord:land REFUSED — the draft carries something this cannot write:\n");
  for (const f of EMIT_FAULTS) console.error("  " + f);
  console.error("\nNothing was written. A field that reaches the emitter and not the tree is");
  console.error("the silent half of the round trip, and it is the half that edits the source.");
  process.exit(1);
}

/* the dry run still prints every entry generated, byte for byte as before */
const BODY = entries.map(generate).join("\n");

/* ═══ [M1 2026-08-11] --write: THE STEP MIKE WAS DOING BY HAND ══════════════
   Until today this file printed and stopped, and step four of eight was Mike
   pasting the result into `src/data/artists/robots.js` — a 2,207-line module
   holding four albums, eleven faces and the wing's standing reasoning. The
   entries are their own module now (`src/data/artists/robots-record.js`,
   nothing in it but the array) precisely so that a tool may rewrite the whole
   file without being able to damage anything else.

   THE DEFAULT IS STILL THE DRY RUN. No `--write`, no write: it prints exactly
   what it printed before, byte for byte, so the old habit still works and the
   proof step (`--verify`) is unchanged.

   THE GUARDS ARE THE SAME SHAPE `assets-declare.mjs` AND `ledger-declare.mjs`
   ALREADY USE, and every one of them REFUSES rather than half-writing:
     1. --no is a preview filter, and writing a filtered set would delete the
        records it filtered out. Refused outright.
     2. THE PREAMBLE IS FOUND, NOT ASSUMED. The file is split on its own
        `export const RECORD_ENTRIES = [` line; if that line is not there, or
        the file does not end in the closing bracket, nothing is written.
     3. NO RECORD MAY VANISH. Every `no` currently in the file must be present
        in the draft. Additions are the normal case and are named; a
        disappearance is refused, because the draft is meant to carry the whole
        volume and a short draft means something upstream lost it.
     4. IT MUST PARSE, and it is parsed by THE MUSEUM'S OWN READER
        (`reveal/record-entries.mjs`) rather than by a second parser written
        here — if `parseRecord` cannot see the entries, neither can the gates,
        and a file that only this tool understands is worse than no file.
     5. THE ROUND TRIP IS BYTE-VERIFIED. Every string in the draft must come
        back out of the written file, folded `+` chains and all. Any mismatch
        and the ORIGINAL FILE IS RESTORED — the write is staged in memory and
        only committed to disk after the parse, then re-read and compared, and
        rolled back if the comparison fails.
     6. IT MAY NOT EAT THE REASONING — comment characters before vs after.
     7. THE `placed` IMPORT COMES BACK BY ITSELF when an entry delivers a
        picture.
     8. A DRAFT OLDER THAN THE RECORD MAY NOT LAND, and a draft may not
        RESURRECT a record the Record has retired. Guards 1-7 all happen to
        catch a stale draft for reasons of their own; 8 is the one aimed at it.
        Each of 6, 7 and 8 is written up in full where it stands, below.
   =========================================================================== */
if (!argv.includes("--write")) {
  console.log(BODY);
  process.exit(0);
}

const TARGET = path.join(REPO, "src", "data", "artists", "robots-record.js");
const REL = path.relative(REPO, TARGET);
const die = (why) => {
  console.error(`record:land --write REFUSED — ${why}`);
  console.error(`Nothing was written. ${REL} is unchanged.`);
  process.exit(1);
};

if (only != null) die("`--no` is a preview filter; writing a filtered set would delete every record it filtered out.");
if (!fs.existsSync(TARGET)) die(`${REL} does not exist.`);

const before = fs.readFileSync(TARGET, "utf8");
const OPEN = "export const RECORD_ENTRIES = [\n";
const CLOSE = "\n];\n";
if (!before.includes(OPEN)) die(`${REL} has no \`${OPEN.trim()}\` line — this tool does not know where the array starts.`);
if (!before.endsWith(CLOSE)) die(`${REL} does not end in \`];\` — this tool does not know where the array ends.`);

let preamble = before.slice(0, before.indexOf(OPEN) + OPEN.length);

/* ═══════════════════════════════════════════════════════════════════════════
   [2026-08-13] THE ENTRIES CARRY THEIR OWN REASONING THROUGH.

   MIKE WRITES FIVE RECORDS ON SATURDAY, and until today landing them was a
   hand splice: this file's entries body is 16,488 characters of which 10,124
   — SIXTY-ONE PER CENT — are comment blocks carrying standing reasoning, and
   a draft carries none. Guard 6 compared comment characters and correctly
   refused every write. **The guard was right; the emitter was the thing to
   fix.**

   ═══ WHY THIS IS NOT A COMMENT-REATTACHER ═════════════════════════════════
   The obvious design binds each comment to the thing it explains and re-emits
   it there. Measuring the file before designing showed why that is the wrong
   one, for a reason only a diff reveals:

   **THE EMITTER CANNOT REPRODUCE A HUMAN'S LINE BREAKS.** `wrap()` folds a
   long string into a `+` chain at 74 columns; the breaks in this file were
   made by a person moving text out of `robots.js` by hand. Measured on the
   real file, every string round-trips to the same VALUE and almost none to
   the same SOURCE — the file's `"…No deviations; "` + `"f(Ump) = 100%"`
   against the emitter's `"…No deviations; f(Ump)"` + `" = 100%"`. A
   reattacher would carry every comment perfectly and still rewrite every line
   around them, so the diff of a NO-OP landing would be the whole file and
   nobody could review it.

   **SO AN ENTRY THAT HAS NOT CHANGED IS NOT REGENERATED AT ALL.** Its
   original source is spliced through byte for byte — comments, line breaks,
   spacing and all — and only an entry whose text actually differs is
   generated afresh. Saturday is five NEW records appended to five untouched
   ones, so this carries 100% of the existing reasoning by construction and
   generates only what Mike wrote that morning.

   ═══ WHAT A COMMENT IS BOUND TO ═══════════════════════════════════════════
   To THE ENTRY IT SITS IN OR IMMEDIATELY PRECEDES, and it travels with that
   entry's source. Four shapes exist in the file and one rule covers them all:

     · BEFORE AN ENTRY — between the array's `[` and the first entry, or
       between two entries. The 6,898-character Record 001 block is this.
       Bound to the entry that FOLLOWS it, because that is what it is about;
       the entry's source span is extended backwards to take it in.
     · INSIDE AN ENTRY, before a property — the two blocks in Record 001
       before `line` and before `sections`. Inside the span already.
     · NESTED INSIDE A SECTION'S BODY ARRAY — the block in Record 003 after
       the last paragraph of its second section. Inside the span already.
     · AFTER THE LAST ENTRY, before the closing `]`. Bound to no entry;
       carried verbatim as a tail.

   ═══ WHAT HAPPENS TO A COMMENT WHOSE ENTRY IS DELETED ═════════════════════
   **NOTHING SILENT.** A draft that drops an entry is refused by guard 3
   before this runs. If an entry survives but its text CHANGED it must be
   regenerated, and a generated entry has no source to splice a comment into
   — so a changed entry that carries comments is REFUSED BY NAME rather than
   written without them, naming the record, the character count and the first
   line of each block. Landing a change to a commented entry stays a
   deliberate hand edit. Landing NEW records beside commented ones is now
   automatic, which is what Saturday needs.
   ═══════════════════════════════════════════════════════════════════════════ */

/* every entry's source span, extended back over the comments that precede it */
function spansOf(src) {
  const bodyStart = src.indexOf(OPEN) + OPEN.length;
  const bodyEnd = src.lastIndexOf(CLOSE);

  const comments = [];
  let ast;
  try {
    ast = acorn.parse(src, {
      ecmaVersion: "latest", sourceType: "module",
      onComment: (block, text, start, end) => comments.push({ start, end }),
    });
  } catch (e) { die(`the CURRENT ${REL} does not parse (${e.message}). Fix it by hand first.`); }

  let arr = null;
  (function visit(n) {
    if (!n || typeof n !== "object" || arr) return;
    if (Array.isArray(n)) { n.forEach(visit); return; }
    if (n.type === "VariableDeclarator" && n.id && n.id.name === "RECORD_ENTRIES") { arr = n.init; return; }
    for (const k of Object.keys(n)) { if (k !== "type" && k !== "start" && k !== "end") visit(n[k]); }
  })(ast);
  if (!arr) die(`${REL} has no RECORD_ENTRIES array this reader can find.`);

  const spans = [];
  let cursor = bodyStart;
  for (const el of arr.elements) {
    if (!el || el.type !== "ObjectExpression") continue;
    const noProp = el.properties.find(p => (p.key.name || p.key.value) === "no");
    const no = noProp && noProp.value.type === "Literal" ? noProp.value.value : null;
    /* everything between the previous entry and this one — whitespace and any
       comment blocks — belongs to THIS entry and is taken into its span */
    const start = cursor;
    let end = el.end;
    if (src[end] === ",") end += 1;
    if (src[end] === "\n") end += 1;
    spans.push({ no, start, end, text: src.slice(start, end) });
    cursor = end;
  }
  const tail = src.slice(cursor, bodyEnd);
  const inBody = comments.filter(c => c.start >= bodyStart && c.end <= bodyEnd);
  return { spans, tail, comments: inBody.map(c => src.slice(c.start, c.end)) };
}

const original = spansOf(before);
const byNo = new Map(original.spans.filter(x => x.no != null).map(x => [x.no, x]));

/* IS THIS DRAFT ENTRY THE SAME TEXT AS THE ONE IN THE TREE? The comparison
   uses THE MUSEUM'S OWN READER rather than a second parse written here:
   `draftEntries` is what seeds the editor Mike writes on, so "unchanged"
   means the same to this tool as it does to that surface. */
const READER = await import(url.pathToFileURL(path.join(REPO, "reveal", "record-entries.mjs")).href);
const { parseRecord, draftEntries } = READER;

const treeStrings = (() => {
  const m = new Map();
  try {
    for (const e of draftEntries(before).entries)
      m.set(e.no, strings(e).map(pair => pair[0] + "\u0001" + pair[1]).join("\u0002"));
  } catch { /* an unreadable tree makes every entry CHANGED, which regenerates
              and therefore refuses on comments — the safe direction */ }
  return m;
})();

const keyOfEntry = (e) => strings(e).map(pair => pair[0] + "\u0001" + pair[1]).join("\u0002");
const sameAsTree = (e) => treeStrings.get(e.no) === keyOfEntry(e);

/* ── the body, entry by entry ─────────────────────────────────────────── */
const carried = [], regenerated = [], addedNew = [], blocked = [];
const pieces = [];
for (const e of entries) {
  const span = byNo.get(e.no);
  if (span && sameAsTree(e)) { pieces.push(span.text); carried.push(e.no); continue; }
  if (span) {
    const blocks = span.text.match(/\/\*[\s\S]*?\*\//g) || [];
    if (blocks.length) { blocked.push({ no: e.no, blocks }); continue; }
    regenerated.push(e.no);
  } else addedNew.push(e.no);
  pieces.push(generate(e) + "\n");
}

if (blocked.length) {
  console.error("record:land --write REFUSED — an entry whose text CHANGED carries");
  console.error("comment blocks, and a generated entry has nowhere to put them.");
  console.error("");
  for (const b of blocked) {
    const chars = b.blocks.reduce((a, x) => a + x.length, 0);
    console.error(`  Record ${String(b.no).padStart(3, "0")} — ${b.blocks.length} block(s), ${chars} characters:`);
    for (const x of b.blocks)
      console.error("      " + (x.split("\n").map(l => l.trim()).find(Boolean) || "").slice(0, 74));
  }
  console.error("");
  console.error("Edit that entry by hand, or move its reasoning above the entry so a later");
  console.error("landing carries it. NEW records beside commented ones land fine; it is only");
  console.error("a CHANGE to a commented entry that stops here.");
  console.error(`Nothing was written. ${REL} is unchanged.`);
  process.exit(1);
}

const BODY_OUT = pieces.join("").replace(/\n$/, "") + original.tail;

/* ═══ GUARD 7 — [CH4 2026-08-12] THE `placed` IMPORT COMES BACK BY ITSELF ═══
   `--write` replaces the ARRAY and keeps the preamble, which is what makes it
   safe to run against a commented file. That same split is why it can emit a
   call to an identifier the file no longer imports: Record 013 was the only
   entry that ever delivered a picture, it was deleted, and `placed` went with
   it because `no-unused-vars` fails on an import nothing uses.
   THE FAILURE IT PREVENTS IS THE SILENT KIND. `placed(...)` with no import
   PARSES — every guard below passes, `parseRecord` reads the path straight out
   of the call node, the gates stay green — and the museum throws
   `placed is not defined` on first render of the wing. So the check is on the
   text this tool is about to write, not on what a reader might notice. */
if (/\bplaced\(/.test(BODY_OUT) && !/^import \{ placed \}/m.test(preamble)) {
  const anchor = 'import { recordDay } from "./record-epoch.js";';
  if (!preamble.includes(anchor))
    die(`${REL} needs the \`placed\` import restored (an entry delivers a picture) and this `
      + `tool cannot find the \`recordDay\` import to put it beside. Add it by hand.`);
  preamble = preamble.replace(anchor, 'import { placed } from "../../lib/placement.js";\n' + anchor);
  console.log("record:land — an entry delivers a picture, so the `placed` import was restored.");
}

const after = preamble + BODY_OUT + CLOSE;

/* guard 3 — nothing may vanish. `parseRecord` came from the reader imported
   above, beside the comparison that needs it. */
let had;
try { had = parseRecord(before).entries.map(e => e.no).filter(n => n != null); }
catch (e) { die(`the CURRENT ${REL} does not parse (${e.message}). Fix it by hand first.`); }
const wants = entries.map(e => e.no);
const lost = had.filter(n => !wants.includes(n));
if (lost.length) die(`the draft does not carry record(s) ${lost.join(", ")}, which are in ${REL}. `
  + `A draft is meant to hold the whole volume; a short one means something upstream dropped them.`);

/* ═══ GUARD 8 — [2026-08-13] A DRAFT OLDER THAN THE RECORD MAY NOT LAND ═════
   MIKE'S DRAFT ON 2026-08-11 HELD SIX RECORDS AND THE TREE HELD FIVE, AND ITS
   Record 001 held TWO sections where the tree holds five. Landing it would have
   resurrected 013 — deleted on 2026-08-12 — and cut 001 back to the superseded
   2026-08-08 dictation, replacing his corrected text with the text it corrected.

   IT WAS REFUSED, AND THAT IS THE PROBLEM THIS GUARD EXISTS FOR. Two other
   guards happened to catch it: the note check above (the draft still carries
   eight curly braces) and guard 6 (a draft carries no comments). Neither knows
   anything about staleness. Answer either one — take the braces out, teach the
   emitter to carry comments — and the SAME draft lands and the damage is done,
   silently, past every remaining guard, because every string in it round-trips
   perfectly. **A protection that fires for an unrelated reason is not a
   protection; it is a coincidence with a good record so far.**

   ═══ WHY THE TEST IS THE CLOCK AND NOT THE CONTENT ═════════════════════════
   The obvious guard — refuse when the draft disagrees with the tree — REFUSES
   EVERY REAL LANDING, because a landing is a draft that disagrees with the tree.
   That is what an edit IS. There is no structural difference between "Mike
   rewrote this paragraph" and "this paragraph is last week's": both are a string
   in the draft that is not the string in the tree.

   What separates them is WHICH IS NEWER, and that is knowable. The editor seeds
   itself from the tree (`draftEntries()` in `tools/dictation/record-edit.mjs`),
   so a draft is a trustworthy superset of the Record IF AND ONLY IF it was saved
   AFTER the Record last moved. Saved after: every difference is his. Saved
   before: every difference is a reversion wearing an edit's clothes.

   So the clock decides whether to refuse, and the DIFF says which records and
   how — and the diff is printed either way, because a landing that is about to
   change five paragraphs should say so even when it is allowed to.

   THE TREE'S TIMESTAMP IS THE LATER OF ITS LAST COMMIT AND ITS FILE MTIME. An
   uncommitted edit is still a move; a committed one whose file was touched
   afterwards by a checkout is still that commit. Taking the later of the two
   cannot understate when the Record last changed, and understating it is the
   only direction that fails open.

   IT DEGRADES BY REFUSING, NEVER BY ASSUMING. No `saved` field, no readable
   mtime, git absent — each says which fact it could not establish and stops.
   =========================================================================== */
const RECORD_SOURCE_LEGACY = "src/data/artists/robots.js";

function gitLines(args) {
  try {
    return execFileSync("git", args, { cwd: REPO, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split("\n").map(s => s.trim()).filter(Boolean);
  } catch { return null; }
}

/* WHEN THE RECORD LAST MOVED — the later of its last commit and its mtime. */
function treeMovedAt() {
  const why = [];
  let mtime = null;
  try { mtime = fs.statSync(TARGET).mtime; why.push(`file mtime ${mtime.toISOString()}`); }
  catch { /* reported below */ }
  const log = gitLines(["log", "-1", "--format=%cI", "--", REL.split(path.sep).join("/")]);
  let commit = null;
  if (log && log[0]) { commit = new Date(log[0]); why.push(`last commit ${commit.toISOString()}`); }
  if (!mtime && !commit) return { at: null, why: ["neither a file mtime nor a git log could be read"] };
  const at = !mtime ? commit : !commit ? mtime : (commit > mtime ? commit : mtime);
  return { at, why };
}

/* WAS THIS RECORD NUMBER EVER IN THE RECORD? The one question that separates a
   NEW record from a RESURRECTED one, and the only honest answer to it is the
   file's own history. A number the Record has never carried is Mike writing the
   next entry; a number it carried and no longer carries was DELETED, and a draft
   is not allowed to undo that — Doctrine 24, and 013 is the case in hand.
   BOTH HOMES ARE SEARCHED: the entries lived inside `robots.js` before the
   2026-08-11 split, so a check that only read the new file would call every
   pre-split record "never seen" and wave it straight back in. */
function everCarried(no) {
  const files = [REL.split(path.sep).join("/"), RECORD_SOURCE_LEGACY];
  const seen = new Set();
  let consulted = false;
  for (const f of files) {
    const shas = gitLines(["log", "--format=%H", "--", f]);
    if (shas === null) continue;
    consulted = true;
    for (const sha of shas) {
      let blob;
      try {
        blob = execFileSync("git", ["show", `${sha}:${f}`],
          { cwd: REPO, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
      } catch { continue; }
      /* `no: 13,` and not `no: 13` — the comma is what stops 13 matching 130 */
      if (new RegExp(`\\bno:\\s*${no}\\s*,`).test(blob)) { seen.add(no); break; }
    }
    if (seen.has(no)) break;
  }
  return consulted ? seen.has(no) : null;   // null = git could not be consulted
}

/* ── the diff, so a refusal can say which records and how ─────────────────── */
function differences(d, t) {
  const out = [];
  const S = (v) => JSON.stringify(v ?? null);
  for (const k of ["date", "title", "line", "lead", "tomb", "still", "stillCaption"]) {
    const dv = d[k] ?? "", tv = t[k] ?? "";
    if (dv !== tv) out.push(`\`${k}\`  tree ${S(tv || null)}  ->  draft ${S(dv || null)}`);
  }
  const ds = d.sections || [], ts = t.sections || [];
  if (ds.length !== ts.length)
    out.push(`sections: the Record has ${ts.length}, this draft has ${ds.length}`);
  for (let i = 0; i < Math.max(ds.length, ts.length); i++) {
    const a = ds[i], b = ts[i];
    if (!b) { out.push(`section ${i + 1} ${S(a.label)} is new in the draft`); continue; }
    if (!a) { out.push(`section ${i + 1} ${S(b.label)} (${(b.body || []).length} paragraph(s)) is in the Record and NOT in the draft`); continue; }
    if (a.label !== b.label) out.push(`section ${i + 1} heading: tree ${S(b.label)} -> draft ${S(a.label)}`);
    const ab = a.body || [], bb = b.body || [];
    if (ab.length !== bb.length)
      out.push(`section ${i + 1} ${S(b.label)}: the Record has ${bb.length} paragraph(s), this draft has ${ab.length}`);
    for (let j = 0; j < Math.max(ab.length, bb.length); j++) {
      if (ab[j] !== bb[j])
        out.push(`section ${i + 1}, paragraph ${j + 1}:\n        tree  ${S(bb[j])}\n        draft ${S(ab[j])}`);
    }
  }
  /* [2026-08-16] and the attachments, for the same reason `strings()` gained
     them: a field the diff does not walk can change a landing without the
     refusal that names what changed. */
  const dd = (d.docs || []).map(x => x && x.title), td = (t.docs || []).map(x => x && x.title);
  if (dd.length !== td.length)
    out.push(`attachments: the Record has ${td.length}, this draft has ${dd.length}`);
  for (let i = 0; i < Math.max(dd.length, td.length); i++) {
    if (dd[i] !== td[i])
      out.push(`attachment ${i + 1}:\n        tree  ${S(td[i] ?? null)}\n        draft ${S(dd[i] ?? null)}`);
  }
  return out;
}

{
  let tree;
  try { tree = draftEntries(); }
  catch (e) { die(`the Record could not be read for comparison (${e.message}).`); }
  const T = new Map(tree.entries.map(e => [e.no, e]));

  /* (a) RESURRECTION — a record in the draft that the Record has retired */
  const unknown = [], raised = [];
  for (const e of entries) {
    if (T.has(e.no)) continue;
    const ever = everCarried(e.no);
    if (ever === null) unknown.push(e.no);
    else if (ever) raised.push(e.no);
  }
  if (unknown.length) die(
    `record(s) ${unknown.join(", ")} are in the draft and not in the Record, and git could not be `
    + `consulted to tell a NEW record from a DELETED one. This tool will not guess which: a new `
    + `record and a resurrected one are the same shape.`);
  if (raised.length) {
    console.error(`record:land --write REFUSED — the draft would RESURRECT record(s) `
      + `${raised.map(n => String(n).padStart(3, "0")).join(", ")}.`);
    console.error("");
    console.error(`Each of those numbers has been in ${REL} before and is not in it now, which`);
    console.error("means it was deleted on purpose. A working copy saved before the deletion still");
    console.error("holds it, and landing that copy undoes the deletion silently — every string in");
    console.error("it round-trips, so no other guard would say a word.");
    console.error("");
    console.error("Take the record out of the draft, or if it is genuinely coming back, put it back");
    console.error(`in ${REL} by hand first so the decision is a commit and not a side effect.`);
    console.error(`Nothing was written. ${REL} is unchanged.`);
    process.exit(1);
  }

  /* (b) STALENESS — is this draft newer than the Record it was seeded from? */
  const savedRaw = draft.saved;
  if (!savedRaw) die(
    "this draft carries no `saved` timestamp, so there is no way to tell whether it is newer "
    + "than the Record it was seeded from. The editor writes one; a draft without it was not "
    + "written by the editor.");
  const saved = new Date(savedRaw);
  if (Number.isNaN(saved.getTime())) die(`this draft's \`saved\` field (${savedRaw}) is not a date.`);
  const moved = treeMovedAt();
  if (!moved.at) die(`when ${REL} last changed could not be established — ${moved.why.join("; ")}.`);

  /* the diff is computed either way: an allowed landing that is about to change
     five paragraphs should still say which five */
  const changed = [];
  for (const e of entries) {
    const t = T.get(e.no);
    if (!t) { changed.push({ no: e.no, lines: ["a new record"] }); continue; }
    const lines = differences(e, t);
    if (lines.length) changed.push({ no: e.no, lines });
  }

  if (saved < moved.at) {
    console.error(`record:land --write REFUSED — this draft is OLDER than the Record it would overwrite.`);
    console.error("");
    console.error(`    draft saved     ${saved.toISOString()}`);
    console.error(`    Record moved    ${moved.at.toISOString()}   (${moved.why.join("; ")})`);
    console.error("");
    console.error("The editor seeds itself from the Record, so a draft is only a superset of it if");
    console.error("it was saved AFTER the Record last changed. This one was saved before, so its");
    console.error("differences are not edits — they are the Record as it was, about to be written");
    console.error("back over the Record as it is.");
    if (changed.length) {
      console.error("");
      console.error(`WHICH RECORDS, AND HOW — ${changed.length} record(s) would change:`);
      for (const c of changed) {
        console.error(`\n  Record ${String(c.no).padStart(3, "0")} — ${c.lines.length} difference(s)`);
        for (const l of c.lines.slice(0, 12)) console.error(`      ${l}`);
        if (c.lines.length > 12) console.error(`      … and ${c.lines.length - 12} more`);
      }
    } else {
      console.error("");
      console.error("No record differs, so landing it would change nothing — but it is still older");
      console.error("than the Record and this tool will not write from a copy it cannot vouch for.");
    }
    console.error("");
    console.error("Open the editor (`npm run record`), which reseeds from the Record as it stands");
    console.error("today, and save again. Nothing was written.");
    process.exit(1);
  }

  if (changed.length) {
    console.log(`record:land — this draft is newer than the Record `
      + `(saved ${saved.toISOString()}, Record moved ${moved.at.toISOString()}), `
      + `so the changes below are edits. ${changed.length} record(s) change:`);
    for (const c of changed) {
      console.log(`  Record ${String(c.no).padStart(3, "0")} — ${c.lines.length} difference(s)`);
      for (const l of c.lines.slice(0, 6)) console.log(`      ${l}`);
      if (c.lines.length > 6) console.log(`      … and ${c.lines.length - 6} more`);
    }
  }
}

/* ═══ GUARD 6 — [N1 2026-08-11] IT MAY NOT EAT THE REASONING ═══════════════
   THE FIRST TIME `--write` WAS EVER RUN AGAINST A REAL DRAFT THIS IS WHAT IT
   WAS ABOUT TO DO: the entries body in `robots-record.js` is 23,143 characters
   and 15,054 of them — SIXTY-FIVE PER CENT — are comment blocks carried out of
   `robots.js` byte for byte when the file was split, precisely because "that
   file carries standing reasoning in its comments and none of it may be lost".
   The emitter builds entries from Mike's draft, and a draft has no comments in
   it, so a write would have replaced 23,143 characters with 8,359 and taken
   every one of those eight blocks with it — silently, and passing every other
   guard, because the STRINGS all round-trip perfectly.
   THE GUARD IS A COMPARISON, NOT A HEURISTIC: comment characters before, comment
   characters after. It refuses on ANY loss and names what would go. It is not
   clever about which blocks matter, because a rule that decided that would be
   the thing making the mistake.
   ═══ [2026-08-24] AND THE FOLLOW-ON HAS A PRECONDITION NOBODY WOULD GUESS ═══
   **READ THIS BEFORE TEACHING THE EMITTER TO CARRY COMMENT BLOCKS THROUGH.**
   THE PIPELINE RUNS ONE WAY — draft to source — AND THE SOURCE HAS BEEN EDITED
   DIRECTLY. Measured 2026-08-24: `record-draft.json` was last written
   2026-08-16, while Record 003's title arrived in `robots-record.js` on
   2026-08-19 (`c1a74ae`) and Record 005's on 2026-08-21 (`a5a2d38`) — both
   straight into the source, neither touching the draft or the workbook. The
   draft had fallen two Records behind the museum.

   **THE ONLY THING STOPPING `--write` FROM REVERTING THEM WAS THIS GUARD**, and
   it was stopping it for an unrelated reason: comment loss. So the day somebody
   does the work this guard exists to force, **the reversion becomes live** —
   the write would succeed, and it would put back the titles Mike replaced.

   **REFRESHING THE DRAFT IS THEREFORE A PRECONDITION OF THAT WORK, NOT A
   FOLLOW-UP.** The refresh is mechanical and lossless: `draftEntries()` in
   `reveal/record-entries.mjs` reads the landed source and returns the draft's
   own schema — `no, date, title, line, sections, docs` — which is exactly what
   the source uses, and `assets` is derived by scanning strings inside those
   fields, so it follows. That is how the draft was brought back into step on
   2026-08-24.

   **AND NOTHING WATCHES FOR THE NEXT DRIFT.** `compareAnswers()` compares the
   shipped entries against `answers.json` — the RETIRED two-column worksheet's
   file — not against the draft. `npm run record:report`, which invokes it, is
   in `package.json` and in NO gate and NO ritual. A direct source edit is
   invisible again the moment it happens.

   WHAT IT COSTS, STATED: `--write` cannot land a Record into a file that
   carries per-entry commentary until the emitter learns to carry those blocks
   through. That is the follow-on this guard exists to force rather than to
   hide. */
const commentChars = (s) => (s.match(/\/\*[\s\S]*?\*\//g) || []).reduce((a, b) => a + b.length, 0);
{
  const oldBody = before.slice(before.indexOf(OPEN) + OPEN.length, before.lastIndexOf(CLOSE));
  const had = commentChars(oldBody), gets = commentChars(BODY_OUT);
  if (gets < had) {
    const blocks = (oldBody.match(/\/\*[\s\S]*?\*\//g) || []).map(b =>
      (b.split("\n").map(l => l.trim()).find(Boolean) || "").slice(0, 78));
    console.error(`record:land --write REFUSED — it would delete ${had - gets} characters of`);
    console.error(`comment from ${REL} (${had} there now, ${gets} in what this would write).`);
    console.error("");
    console.error("Those blocks are the standing reasoning that moved with the entries when the");
    console.error("Record was split out of robots.js. A draft carries none of them, so writing");
    console.error("from a draft removes every one:");
    for (const b of blocks) console.error(`    ${b}`);
    console.error("");
    console.error("Nothing was written. The emitter has to carry these blocks through before");
    console.error("--write can land a Record into a commented file.");
    /* [2026-08-30] THE SEQUENCE, PRINTED WHERE THE PERSON IS STANDING. It was
       written in a finding first, which is the wrong surface: whoever meets this
       refusal is at a console, not in docs/. Ops has NOT ruled the move. */
    console.error("");
    console.error("IF MIKE RULES THE MOVE, THE ORDER IS:");
    console.error("  1. lift the block above the array — before `export const RECORD_ENTRIES = [`.");
    console.error("     Purely positional: not one byte of his prose changes. It is the only");
    console.error("     comment inside the array, and it is Record 005's.");
    console.error("  2. MIKE SAVES AGAIN in the day editor. The move rewrites this file, and");
    console.error("     guard 8 compares timestamps — a draft saved before the move is stale.");
    console.error("  3. record:land -- --write, WITH NO `npm run day:proof` IN BETWEEN.");
    console.error("     day:proof rewrites this file byte-identically and bumps its mtime,");
    console.error("     which re-closes guard 8. The window is save -> write.");
    console.error("");
    console.error("CITATIONS THAT MOVE WITH IT: docs/opsday-20260822/ANSWER_KEY.md:181 points");
    console.error("INSIDE the block (robots-record.js:648-660) and travels with it. Fourteen");
    console.error("others shift by 26 lines across seven documents, all prose, no code.");
    process.exit(1);
  }
}

/* guard 4 — it must parse, and by the museum's own reader */
let parsed;
try { parsed = parseRecord(after); }
catch (e) { die(`the file this would write does not parse: ${e.message}`); }
if (parsed.entries.length !== entries.length)
  die(`the file this would write parses as ${parsed.entries.length} entries, not ${entries.length}.`);

/* guard 5 — every string comes back, or the original goes back */
fs.writeFileSync(TARGET, after);
try {
  const back = parseRecord(fs.readFileSync(TARGET, "utf8"));
  const seen = new Set(back.prose);
  const missing = [];
  for (const e of entries) for (const [where, s] of strings(e)) if (!seen.has(s)) missing.push(`Record ${e.no} ${where}`);
  if (missing.length) throw new Error(`${missing.length} string(s) did not survive: ${missing.slice(0, 3).join("; ")}`);
} catch (e) {
  fs.writeFileSync(TARGET, before);
  die(`${e.message}\
  THE ORIGINAL FILE HAS BEEN PUT BACK.`);
}

const added = wants.filter(n => !had.includes(n));
console.log(`wrote ${REL}`);
console.log(`  carried through untouched: ${carried.length ? carried.map(n => String(n).padStart(3, "0")).join(" ") : "(none)"}`);
if (regenerated.length) console.log(`  regenerated: ${regenerated.map(n => String(n).padStart(3, "0")).join(" ")}`);
if (addedNew.length) console.log(`  new: ${addedNew.map(n => String(n).padStart(3, "0")).join(" ")}`);
console.log(`  comment characters: ${commentChars(before.slice(before.indexOf(OPEN) + OPEN.length, before.lastIndexOf(CLOSE)))} before, ${commentChars(BODY_OUT)} after`);
console.log(`  ${entries.length} record(s): ${wants.map(n => String(n).padStart(3, "0")).join(" ")}`);
if (added.length) console.log(`  new: ${added.map(n => String(n).padStart(3, "0")).join(" ")}`);
console.log(`  ${before.length} -> ${after.length} bytes`);
console.log(`  every string round-tripped through ${path.relative(REPO, path.join(REPO, "reveal", "record-entries.mjs"))}`);
