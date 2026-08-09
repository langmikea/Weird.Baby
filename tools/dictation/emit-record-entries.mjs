#!/usr/bin/env node
/* ===========================================================================
   EMIT-RECORD-ENTRIES — turn Mike's worksheet answers into Record entry source.
   [L1-L4 2026-08-09]
   ---------------------------------------------------------------------------
   THE ENTRIES ARE GENERATED RATHER THAN RETYPED, and that is the whole reason
   this file exists. Record 001's landing proved its verbatim claim by slicing
   the block back out of the source and comparing it to the dictation string by
   string. This does the same thing one step earlier: the JS literals ARE the
   rescued strings, cut into paragraphs by a rule, so there is no transcription
   step for a character to go missing in.

   THE RULE FOR CUTTING A BOX INTO A SECTION, which is the worksheet's own
   documented convention and not a new one:
     · a line on its own in CAPITALS (with or without a trailing colon) starts a
       section and is its LABEL;
     · every non-empty line under it is one paragraph, in order;
     · leading indentation is dropped, because HTML collapses it and Record 001
       landed the same timeline without it — the alternative is inventing a
       `white-space` rule for every record body (register S-e).

   HIS NOTES TO OPS TRAVEL, AND SO DO OPS' ANSWERS. Mike, 2026-08-09: "he needs
   it all in one place... his bracketed notes and ?? placeholders go WITH them."
   A paragraph that is one of his notes keeps every character and gains a
   PREFIX — `[MIKE-NOTE] ` — and Ops' answer follows as its own paragraph
   prefixed `[OPS] `. Both prefixes are markers for the renderer, not text: they
   are stripped before drawing, coloured differently, shown ONLY in the
   development stage, and deleted from the source at launch by `wb-ops-notes`.
   **The characters after the prefix are byte-identical to what he wrote**, and
   `--verify` proves it.

     node tools/dictation/emit-record-entries.mjs           print the source
     node tools/dictation/emit-record-entries.mjs --verify  prove it round-trips
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const ANSWERS = path.join(REPO, "docs", "dictation-20260807", "answers.json");

const A = JSON.parse(fs.readFileSync(ANSWERS, "utf8")).answers;

/* ── OPS' ANSWERS, SUPPLIED BY MIKE IN THE ROUND INSTRUCTION ────────────────
   Verbatim from the brief. Each is keyed by the exact question of his it
   answers, so an answer can never drift onto the wrong ask. */
const OPS_ANSWERS = {
  manual:
    "The manual is 61 pages of structure; every position reads [ TEXT REQUIRED ]. "
    + "There are no examples yet. Ops is writing it; Mike reviews and edits.",
  device:
    "The first four devices HAVE NO NAMES YET. What exists: the personas (CEO, "
    + "Informer, Gambler, Everyman) and unit numbers (-02, -07, -09). Whether the "
    + "personas ARE the four units, or the units carry their own names, is unruled "
    + "and is Mike's call.",
  words:
    "From the firmware and the twin's own screens: PORTAL, FEED, LATCH, ARM, BOOT, "
    + "POST, BIST, SEG, CHECKSUM, ACK, SYN, AUX LINK, MEM TEST, VIDEO, NOMINAL, "
    + "LISTENING, ERROR, READY, STANDBY, SANDBOX.",
};

/* WHICH OF HIS LINES IS A NOTE, AND WHICH ANSWER SITS UNDER IT.
   Matched on an exact substring of his own line rather than on a pattern: a
   heuristic that decided what counts as "a note to Ops" would eventually mark a
   sentence of his story, and over-marking his prose is the one failure this
   whole treatment exists to prevent. Every entry here was read off his text. */
const NOTES = [
  { has: "(Claude - Get me some examples from the manual, etc)", answer: "manual" },
  { has: "(need name of device)", answer: "device" },
  { has: "(Give me a list of the most common words Robots expects to use", answer: "words" },
  { has: "Look for what we really do use a lot.", answer: null },
  { has: 'Look for sections of the documents that are "true", but not "juicy".', answer: null },
  { has: "(That is how we get the album art and set up the Manual link)", answer: null },
];
/* his second "examples" ask is a list of frequent STRINGS, so the word list is
   what answers it — named here rather than resolved by order */
const WORDS_INSTEAD = "MGK, PI,";

const isCapsLine = (l) => {
  const t = l.trim().replace(/:$/, "");
  return t.length > 2 && t === t.toUpperCase() && /[A-Z]/.test(t) && !/^\d/.test(t);
};

/** cut one worksheet box into sections */
function sectionsOf(text) {
  const out = [];
  let cur = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) continue;
    if (isCapsLine(line) && !cur) { cur = { label: line.trim().replace(/:$/, ""), body: [] }; continue; }
    if (!cur) cur = { label: null, body: [] };
    cur.body.push(line.replace(/^\s+/, ""));
  }
  if (cur) out.push(cur);
  return out;
}

/** mark his notes and drop Ops' answers in beside them */
function annotate(body) {
  const out = [];
  for (const p of body) {
    const hit = NOTES.find(n => p.includes(n.has));
    if (!hit) { out.push(p); continue; }
    out.push("[MIKE-NOTE] " + p);
    let key = hit.answer;
    if (key === "manual" && p.includes(WORDS_INSTEAD)) key = "words";
    if (key) out.push("[OPS] " + OPS_ANSWERS[key]);
  }
  return out;
}

const DAYS = [1, 2, 3, 4, 5];
const entries = [];
for (const n of DAYS) {
  const k = (f) => A[`W1.D${n}.${f}`];
  const secs = [];
  if (k("EXEC")) secs.push(...sectionsOf(k("EXEC")));
  if (k("NOTES")) secs.push(...sectionsOf(k("NOTES")));
  for (const s of secs) s.body = annotate(s.body);
  entries.push({ no: n, day: n, title: k("HEAD") || null, line: k("LINE") || null, sections: secs });
}

if (process.argv.includes("--verify")) {
  /* THE PROOF: strip the markers and the paragraphing back out and compare to
     the rescued string, character for character. */
  let bad = 0;
  for (const e of entries) {
    for (const f of ["EXEC", "NOTES"]) {
      const src = A[`W1.D${e.day}.${f}`];
      if (!src) continue;
      const want = src.split(/\r?\n/).map(l => l.replace(/\s+$/, "").replace(/^\s+/, ""))
        .filter(l => l.trim()).join("\n");
      const secs = sectionsOf(src);
      for (const s of secs) s.body = annotate(s.body);
      const got = secs.flatMap(s => [
        ...(s.label ? [s.label] : []),
        ...s.body.filter(p => !p.startsWith("[OPS] ")).map(p => p.replace(/^\[MIKE-NOTE\] /, "")),
      ]).join("\n");
      /* his labels lose only a trailing colon, which the section renders as a
         heading rather than as prose — recorded, not hidden */
      const wantNoColon = want.split("\n").map((l, i) => i === 0 ? l.replace(/:$/, "") : l).join("\n");
      const ok = got === wantNoColon;
      if (!ok) { bad++; console.log(`MISMATCH W1.D${e.day}.${f}`); console.log("want:", JSON.stringify(wantNoColon).slice(0, 400)); console.log("got :", JSON.stringify(got).slice(0, 400)); }
      else console.log(`  ok  W1.D${e.day}.${f}  ${src.length} chars -> ${secs.length} section(s), ${secs.reduce((a, s) => a + s.body.length, 0)} paragraph(s)`);
    }
    if (e.title) console.log(`  ok  W1.D${e.day}.HEAD  ${JSON.stringify(e.title)}`);
    if (e.line) console.log(`  ok  W1.D${e.day}.LINE  ${e.line.length} chars`);
  }
  console.log(bad ? `\n${bad} MISMATCH(ES)` : "\nEVERY BOX ROUND-TRIPS: his characters are unchanged.");
  process.exit(bad ? 1 : 0);
}

/* ── emit ─────────────────────────────────────────────────────────────────── */
const q = (s) => JSON.stringify(s);
const wrap = (s, indent) => {
  /* one literal per paragraph, broken across lines only where a space allows,
     so the file stays readable and the string stays exact */
  const max = 74 - indent;
  if (s.length <= max) return q(s);
  const parts = []; let cur = "";
  for (const w of s.split(" ")) {
    if (cur && (cur + " " + w).length > max) { parts.push(cur + " "); cur = w; }
    else cur = cur ? cur + " " + w : w;
  }
  if (cur) parts.push(cur);
  return parts.map(q).join("\n" + " ".repeat(indent) + "+ ");
};

const out = [];
for (const e of entries) {
  out.push(`            { no: ${e.no},`);
  out.push(`              date: recordDay(${e.day}),`);
  if (e.title) out.push(`              title: ${q(e.title)},`);
  if (e.line) out.push(`              line: ${wrap(e.line, 20)},`);
  out.push(`              sections: [`);
  for (const s of e.sections) {
    out.push(`                { ${s.label ? `label: ${q(s.label)},` : "label: null,"}`);
    out.push(`                  body: [`);
    for (const p of s.body) out.push(`                    ${wrap(p, 20)},`);
    out.push(`                  ] },`);
  }
  out.push(`              ] },`);
}
console.log(out.join("\n"));
