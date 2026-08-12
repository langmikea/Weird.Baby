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

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const DRAFT = path.join(REPO, "docs", "dictation-20260807", "record-draft.json");

const argv = process.argv.slice(2);
const only = (() => { const i = argv.indexOf("--no"); return i >= 0 ? Number(argv[i + 1]) : null; })();

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
    (s.body || []).forEach((p, j) => out.push([`section ${i + 1}, paragraph ${j + 1}`, p]));
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
const out = [];
for (const e of entries) {
  out.push(`            { no: ${e.no},`);
  /* the date is emitted as `recordDay(n)` and never as a literal — D1's
     one-field rule: if the launch slips, ONE line moves and everything follows */
  if (e.date) out.push(`              date: recordDay(${e.no}),`);
  if (e.title) out.push(`              title: ${wrap(e.title, 20)},`);
  if (e.line) out.push(`              line: ${wrap(e.line, 20)},`);
  if (e.lead) out.push(`              lead: ${wrap(e.lead, 20)},`);
  if (e.still) out.push(`              still: placed(${q(e.still)}),`);
  if (e.stillCaption) out.push(`              stillCaption: ${wrap(e.stillCaption, 20)},`);
  out.push(`              sections: [`);
  for (const s of e.sections || []) {
    out.push(`                { ${s.label ? `label: ${q(s.label)},` : "label: null,"}`);
    out.push(`                  body: [`);
    for (const p of s.body || []) out.push(`                    ${wrap(p, 20)},`);
    out.push(`                  ] },`);
  }
  out.push(`              ],`);
  /* the tombstone closes the entry on the page, so it closes the object here */
  if (e.tomb) out.push(`              tomb: ${wrap(e.tomb, 20)},`);
  out.push(`            },`);
}
const BODY = out.join("\n");

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

const preamble = before.slice(0, before.indexOf(OPEN) + OPEN.length);
const after = preamble + BODY + CLOSE;

/* guard 3 — nothing may vanish */
const { parseRecord } = await import(url.pathToFileURL(path.join(REPO, "reveal", "record-entries.mjs")).href);
let had;
try { had = parseRecord(before).entries.map(e => e.no).filter(n => n != null); }
catch (e) { die(`the CURRENT ${REL} does not parse (${e.message}). Fix it by hand first.`); }
const wants = entries.map(e => e.no);
const lost = had.filter(n => !wants.includes(n));
if (lost.length) die(`the draft does not carry record(s) ${lost.join(", ")}, which are in ${REL}. `
  + `A draft is meant to hold the whole volume; a short one means something upstream dropped them.`);

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
   WHAT IT COSTS, STATED: `--write` cannot land a Record into a file that
   carries per-entry commentary until the emitter learns to carry those blocks
   through. That is the follow-on this guard exists to force rather than to
   hide. */
const commentChars = (s) => (s.match(/\/\*[\s\S]*?\*\//g) || []).reduce((a, b) => a + b.length, 0);
{
  const oldBody = before.slice(before.indexOf(OPEN) + OPEN.length, before.lastIndexOf(CLOSE));
  const had = commentChars(oldBody), gets = commentChars(BODY);
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
console.log(`  ${entries.length} record(s): ${wants.map(n => String(n).padStart(3, "0")).join(" ")}`);
if (added.length) console.log(`  new: ${added.map(n => String(n).padStart(3, "0")).join(" ")}`);
console.log(`  ${before.length} -> ${after.length} bytes`);
console.log(`  every string round-tripped through ${path.relative(REPO, path.join(REPO, "reveal", "record-entries.mjs"))}`);
