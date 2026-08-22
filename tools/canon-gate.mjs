#!/usr/bin/env node
/* ===========================================================================
   THE CANON GATE — PROTOTYPE. 2026-08-21.
   ---------------------------------------------------------------------------
   **NOT WIRED INTO ANYTHING.** It is not in `package.json`, not in the
   session-close ritual, and no packet runs it. It exists to produce ONE
   NUMBER — the day-one failure count — because that number is the whole
   decision about whether this gate is worth having.

     node tools/canon-gate.mjs            the count and the rows
     node tools/canon-gate.mjs --strict   case-discipline off (noisier)
     node tools/canon-gate.mjs --json     machine-readable

   ═══ WHAT IT CATCHES ══════════════════════════════════════════════════════
   MIKE: *"We have so much poorly defined, multi-defined... It is costing us
   big time."* The catalogue exists — 15 files, 24 conflicts, 28 holes — and
   four of those conflicts have been hit SINCE it was written, **because a
   catalogue is a document you consult if you think to. A gate does not need
   to be thought of.**

     1. a CONTESTED term reaching a visitor-facing string
     2. an OPS-REGISTER term reaching a visitor-facing string
     3. (not built — see the report) a term used with a meaning the catalogue
        does not carry

   ═══ WHAT IT MUST NOT CATCH ═══════════════════════════════════════════════
   **A RULED TERM.** Contested and decided are different states. A term whose
   index row carries a ruling is skipped, and that skip is the difference
   between a gate and a nag.

   ═══ THE TWO SOURCES, AND NEITHER IS A SECOND COPY ════════════════════════
   **THE CATALOGUE IS THE TRUTH.** The term list, and every term's state, is
   read out of `docs/canon/INDEX.md`'s own A–Z — the markers the catalogue
   already writes: a link to `CONFLICTS.md#k-nn` is CONTESTED, `**OPS**` is
   Ops-register, `**PUB` is already on the glass, `RULED` is decided. Nothing
   is duplicated here and no term is classified by this file.

   **AND `provenance/register.json` ALREADY KNOWS WHAT A VISITOR READS.** It
   declares every visitor-facing string in `src/` with its file. Grepping
   `src/` would re-derive, badly, a thing the museum already maintains — and
   would drag in identifiers, class names and comments, which is most of the
   noise a gate like this dies of.

   ═══ THE CASE DISCIPLINE, WHICH IS THE DIFFERENCE BETWEEN 5 AND 2 ═════════
   Some canon terms are ordinary English: `Door`, `Beat`, `Fleet`. Matched
   case-insensitively they fire on *"leaving the door shut"* and *"the
   machine's own opening beat"* — prose that has nothing to do with the menu
   term or the boot term. **A gate that flags those is not noisy, it is
   wrong**, and being wrong twice is how a gate stops being read.
   So a hit needs the string's occurrence to be either the catalogue's own
   casing or ALL CAPS. `THE EVERYDAY` in a manifest still fires; `the door` in
   a sentence does not. `--strict` turns the discipline off, which is how the
   two numbers in the report were produced.
   ======================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const LOOSE = process.argv.includes("--strict");   /* --strict = no discipline */
const JSONOUT = process.argv.includes("--json");

/* ── the catalogue's own A–Z ─────────────────────────────────────────────── */
const idx = fs.readFileSync(path.join(REPO, "docs/canon/INDEX.md"), "utf8");
const azStart = idx.indexOf("## A");
const TERMS = [];
for (const line of idx.slice(azStart).split("\n")) {
  if (!line.startsWith("| ")) continue;
  const cells = line.trim().replace(/^\||\|$/g, "").split("|").map(s => s.trim());
  if (cells.length < 2) continue;
  if (/^term$/i.test(cells[0]) || !cells[0]) continue;
  if (/^[-: ]+$/.test(cells[0])) continue;
  const term = cells[0].replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
                       .replace(/\*\*/g, "").replace(/`/g, "").trim();
  const where = cells[1];
  TERMS.push({
    term,
    contested: /CONFLICTS\.md#k-/.test(where),
    ops: /\*\*OPS\*\*/.test(where),
    pub: /\*\*PUB/.test(where),
    ruled: /RULED/i.test(where),
    where,
  });
}

/* the surface forms a term can wear in a sentence. The gloss after an em dash
   or in brackets is the catalogue talking to Ops, never the term. */
function forms(term) {
  const head = term.split(/\s+—|\(/)[0].trim();
  const out = new Set();
  for (let p of head.split(/\s*\/\s*/)) {
    p = p.trim().replace(/[.,]$/, "");
    if (!p) continue;
    out.add(p);
    const m = /^(.*?),\s*the$/i.exec(p);
    if (m) out.add("the " + m[1]);
  }
  return [...out].filter(f => f.length >= 4);
}

/* ── what a visitor actually reads ───────────────────────────────────────── */
const reg = JSON.parse(fs.readFileSync(path.join(REPO, "provenance/register.json"), "utf8"));
const STRINGS = Object.entries(reg.entries || {})
  .filter(([, v]) => v && v.t)
  .map(([k, v]) => ({ key: k, text: v.t, file: v.f || "", cls: v.c || "" }));

/* ── the match ───────────────────────────────────────────────────────────── */
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function occurrences(form, text) {
  const re = new RegExp("(?<![A-Za-z0-9])" + esc(form) + "(?![A-Za-z0-9])", "gi");
  const out = [];
  let m;
  while ((m = re.exec(text))) out.push(m[0]);
  return out;
}
function admissible(form, seen) {
  if (LOOSE) return true;
  return seen === form || seen === seen.toUpperCase();
}

const findings = [];
for (const t of TERMS) {
  if (t.ruled) continue;
  const kind = t.contested ? "CONTESTED" : (t.ops ? "OPS-REGISTER" : null);
  if (!kind) continue;
  for (const form of forms(t.term)) {
    for (const s of STRINGS) {
      const hits = occurrences(form, s.text).filter(h => admissible(form, h));
      if (!hits.length) continue;
      findings.push({ kind, term: t.term, form, saw: hits[0], file: s.file,
                      text: s.text.length > 90 ? s.text.slice(0, 90) + "…" : s.text,
                      where: t.where });
      break;
    }
  }
}

const byTerm = new Map();
for (const f of findings) if (!byTerm.has(f.term)) byTerm.set(f.term, f);
const rows = [...byTerm.values()];

if (JSONOUT) {
  console.log(JSON.stringify({ terms: TERMS.length, strings: STRINGS.length,
                               count: rows.length, rows }, null, 1));
} else {
  console.log("");
  console.log("THE CANON GATE — prototype, wired into nothing");
  console.log("");
  console.log(`  catalogue terms (INDEX A–Z)      ${TERMS.length}`);
  console.log(`    contested                      ${TERMS.filter(t => t.contested).length}`);
  console.log(`    ops-register                   ${TERMS.filter(t => t.ops).length}`);
  console.log(`    ruled (skipped)                ${TERMS.filter(t => t.ruled).length}`);
  console.log(`  declared visitor-facing strings  ${STRINGS.length}`);
  console.log(`  case discipline                  ${LOOSE ? "OFF (--strict)" : "ON"}`);
  console.log("");
  if (!rows.length) {
    console.log("  CANON: PASS — no contested or Ops-register term on the glass.");
  } else {
    console.log(`  ${rows.length} FINDING(S):`);
    for (const r of rows) {
      console.log("");
      console.log(`  ${r.kind}  ${r.term}`);
      console.log(`     saw "${r.saw}" in ${r.file}`);
      console.log(`     ${JSON.stringify(r.text)}`);
      console.log(`     catalogue: ${r.where}`);
    }
    console.log("");
    console.log(`  CANON: ${rows.length} finding(s). Not a gate yet — see the report.`);
  }
  console.log("");
}
process.exit(0);   /* it never fails a build; it is not wired */
