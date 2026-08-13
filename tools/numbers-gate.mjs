#!/usr/bin/env node
/* ===========================================================================
   npm run docs:numbers — every published standing value, measured. [2026-08-13]
   ---------------------------------------------------------------------------
       npm run docs:numbers          report
       npm run docs:numbers -- --gate  exit 1 on any mismatch

   ═══ WHY THIS EXISTS ════════════════════════════════════════════════════════
   Six stale numbers were found in the governing documents on 2026-08-13 and it
   was the THIRD time. The defect is not that a number went stale — it is that
   **the number is prose.** Every value below can be computed in milliseconds
   from a file in this repository, and until tonight not one of them was. They
   were typed into a sentence, and a sentence has no gate.

   THE FAILURE HAS A PARTICULAR SHAPE AND IT IS WORSE THAN "OUT OF DATE": a
   published baseline is only useful as a COMPARISON, so publishing the wrong
   one does not weaken the tripwire, it INVERTS it. A session reading "11 / 9"
   against a real 9 / 8 concludes two errors were fixed and moves on; the same
   session, having introduced two errors, reads 11 and concludes nothing
   changed.

   ═══ THE DISTINCTION THIS GATE IS BUILT AROUND (3b) ═════════════════════════
       A PUBLISHED STANDING VALUE is a tripwire and must be current.
       A RECORDED MEASUREMENT in a round log is history and must never
       be rewritten.

   `STATE.md` carries `lint 11 err / 9 warn` fourteen times and every one must
   stay: they record what the gates read ON THE DAY THAT ROUND SEALED. A
   find-and-replace over this repository would falsify the record that makes the
   tripwire legible in the first place.

   SO THE GATE NEVER READS A ROUND LOG, and it does not decide that by guessing
   at prose. Two mechanisms, both structural:

     1. SCOPE — a document declares where its round logs START, by heading.
        Everything from that heading to the end of the file is history and is
        not read. `STATE.md` is a round log almost end to end and is therefore
        EXCLUDED WHOLE.
     2. SHAPE — a claim only counts where it is stated as a fact about the
        present. Each check carries a `near` phrase that must appear on the same
        line, so `lint 11 err / 9 warn = HEAD baseline, zero new` in a sealed
        round entry cannot match a check anchored on the word "baseline" inside
        a gates list.

   Anything the gate cannot classify is REPORTED AND NOT FAILED ON. A gate that
   cries wolf about history gets switched off, and then it is not a gate.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const R = (p) => fs.readFileSync(path.join(REPO, p), "utf8");
const J = (p) => JSON.parse(R(p));
const GATE = process.argv.includes("--gate");

/* ═══ THE DOCUMENTS, AND WHERE HISTORY BEGINS IN EACH ═══════════════════════ */
const DOCS = [
  { file: "CLAUDE.md",
    historyFrom: /^## Recent session log/m,
    note: "the standing-rules block is live; the session log below it is history" },
  { file: "docs/canonical/OPERATIONS.md",
    historyFrom: null,
    note: "no round log in this file — read whole" },
  { file: "STATE.md",
    skipWhole: "a round log almost end to end. Its fourteen `11 err / 9 warn` "
             + "readings are what the gates said on the day each round sealed, "
             + "and rewriting them would falsify the record.",
  },
];

/* ═══ THE MEASURERS ════════════════════════════════════════════════════════ */
const measure = {};

measure.lint = () => {
  let out = "";
  try {
    out = execFileSync("npx", ["eslint", ".", "-f", "json"],
      { cwd: REPO, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], shell: true });
  } catch (e) { out = e.stdout || ""; }
  let rows;
  try { rows = JSON.parse(out); } catch { return null; }
  return {
    errors: rows.reduce((a, r) => a + r.errorCount, 0),
    warnings: rows.reduce((a, r) => a + r.warningCount, 0),
  };
};

measure.assetRows = () => J("provenance/asset-table.json").entries.length;
measure.assetMissing = () => J("provenance/asset-table.json").entries.filter(r => r.missing).length;
measure.assetBucketed = () => J("provenance/asset-table.json").entries.filter(r => r.bucket != null).length;
measure.ledgerRows = () => {
  const l = J("reveal/ledger.json");
  return (l.rows || l.entries || l).length;
};
measure.registerRows = () => Object.keys(J("provenance/register.json").entries).length;
measure.manualPages = () => fs.readdirSync(path.join(REPO, "public/held/robots/manual"))
  .filter(f => /^page-\d+\.png$/.test(f)).length;
measure.recordEntries = async () => {
  const m = await import(pathToFileURL(path.join(REPO, "reveal/record-entries.mjs")).href);
  return m.entries().length;
};

/* ═══ THE CHECKS ═══════════════════════════════════════════════════════════
   `find`  a regex with one or two capture groups — the published number(s).
   `near`  a phrase that must be on the SAME LINE. This is the shape half of
           the history defence: it pins a check to the sentence that PUBLISHES
           the value rather than to any line that happens to contain it.
   `what`  what it claims, for the message. */
const CHECKS = [
  /* `[(*\s]*` and not `\s*`: CLAUDE.md writes `baseline (**9 errors / 8
     warnings**)` and OPERATIONS writes `baseline **9 errors / 8 warnings**`.
     The bracket cost a real check — the CLAUDE.md claim matched nothing at all
     until the break test said so. */
  { id: "lint-baseline",
    find: /baseline[(*\s]*(\d+)\s*errors?\s*\/\s*(\d+)\s*warnings?/gi,
    near: /baseline/i,
    what: "the lint baseline",
    measured: async () => { const l = measure.lint(); return l && [l.errors, l.warnings]; } },

  { id: "lint-baseline-short",
    find: /baseline[(*\s]*(\d+)\s*err\s*\/\s*(\d+)\s*warn/gi,
    near: /baseline/i,
    what: "the lint baseline",
    measured: async () => { const l = measure.lint(); return l && [l.errors, l.warnings]; } },

  { id: "asset-rows",
    find: /\*{0,2}(\d[\d,]*)\s*rows?\*{0,2}[^.\n]{0,40}asset[- ]table|asset-table\.json[^.\n]{0,30}?\*{0,2}(\d[\d,]*)\s*rows/gi,
    near: /asset[- ]table|asset-table\.json/i,
    what: "the asset table's row count",
    measured: async () => [measure.assetRows()] },

  /* ═══ "null on all N rows" IS SAID ABOUT TWO DIFFERENT TABLES ══════════════
     One pattern, two subjects: the asset table's `bucket` (385 rows) and the
     ledger's `when` (166). The first cut had a single check and confidently
     reported the ledger's claim as the asset table's — right that it was stale,
     wrong about what it counted, which is the kind of finding that gets a gate
     distrusted. The subject is now part of the match. */
  { id: "asset-null-bucket",
    find: /(?:bucket|asset[- ]table)[\s\S]{0,200}?null on all\s*(\d[\d,]*)\s*rows/gi,
    near: /null on all/i,
    what: "the asset table's row count (the all-null `bucket` claim)",
    measured: async () => [measure.assetRows()] },

  { id: "ledger-null-when",
    find: /`when`[\s\S]{0,200}?null on all\s*(\d[\d,]*)\s*rows/gi,
    near: /null on all/i,
    what: "the reveal ledger's row count (the all-null `when` claim)",
    measured: async () => [measure.ledgerRows()] },

  { id: "ledger-rows",
    find: /\*{0,2}(\d[\d,]*)\s*rows,\s*one per REVEALABLE/gi,
    near: /REVEALABLE/,
    what: "the reveal ledger's row count",
    measured: async () => [measure.ledgerRows()] },

  { id: "manual-pages",
    find: /the manual is\s*(\d+)\s*pages/gi,
    near: /manual is/i,
    what: "the manual's page count",
    measured: async () => [measure.manualPages()] },
];

/* ═══ A CORRECTION NOTE IS NOT A CLAIM ═════════════════════════════════════
   THE GATE'S FIRST RUN FAILED ON ITS OWN GOOD PRACTICE. When a stale number is
   fixed, the fix carries a note saying what it used to be —
   `**166 rows** (measured 2026-08-13; the row said 152)` — so a later reader can
   see the value was checked rather than guessed. That parenthetical contains the
   OLD number, on the same line as the new one, and a naive scan reads it as a
   second claim and fails on it.

   Deleting those notes to satisfy the gate would be the tail wagging the dog:
   they are the most useful sentence in the fix. So the gate BLANKS them before
   it scans. A number that appears only inside "the row said N" / "this said N" /
   "(measured …)" is a historical aside, which is the same distinction §3b draws
   between a standing value and a record — one file down. */
const CORRECTIONS = [
  /\((?:re-)?measured[^)]*\)/gi,          /* (measured 2026-08-13; the row said 152) */
  /\b(?:the (?:row|line|file|table)|this|it)\s+said\s+[\d,/\s]+/gi,
  /\bwas\s+\d[\d,]*\s*(?:\/\s*\d+)?\b/gi, /* "was 11 / 9" */
];
const deClaim = (s) => CORRECTIONS.reduce((t, re) => t.replace(re, m => " ".repeat(m.length)), s);

/* ═══ THE RUN ══════════════════════════════════════════════════════════════ */
const findings = [];
const skipped = [];
let claims = 0;

for (const doc of DOCS) {
  if (doc.skipWhole) { skipped.push(`${doc.file} — ${doc.skipWhole}`); continue; }
  const raw = R(doc.file);
  /* blanked, not removed — every offset stays valid so line numbers are true */
  const text = deClaim(raw);
  const lines = raw.split("\n");
  /* the live half only */
  let liveEnd = lines.length;
  if (doc.historyFrom) {
    const m = text.match(doc.historyFrom);
    if (m) liveEnd = text.slice(0, m.index).split("\n").length - 1;
  }

  /* ═══ THE SCAN IS LINE-BOUNDED, AND THE FIRST CUT WAS NOT ═════════════════
     Every check's regex uses `\s*` between its parts, and `\s` MATCHES A
     NEWLINE. Run against the whole document that turns each pattern into a
     document-wide wildcard: `null on all …rows` matched the words "null on all"
     on one line and "152 rows" several lines below it, inventing a claim
     nobody wrote — while the real claims went unchecked because `near` was
     tested against whichever line the match happened to START on.
     Proved by breaking it: five deliberate bends, and only ONE was caught.
     So the scan walks LINES. Each probe is the line plus the one after it,
     because a published value legitimately wraps — OPERATIONS §9 has
     `baseline **9 errors / 8` and `warnings**` on separate lines — and nothing
     beyond that can be part of one sentence. */
  const declaimed = lines.map(deClaim);
  for (const check of CHECKS) {
    const measured = await check.measured();
    if (!measured) { skipped.push(`${check.id} — could not be measured`); continue; }
    for (let i = 0; i < Math.min(liveEnd, lines.length); i++) {
      if (check.near && !check.near.test(lines[i])) continue;
      const probe = declaimed[i] + " " + (declaimed[i + 1] || "");
      check.find.lastIndex = 0;
      let hit;
      while ((hit = check.find.exec(probe))) {
        claims++;
        const got = hit.slice(1).filter(v => v !== undefined).map(v => String(v).replace(/,/g, ""));
        const want = measured.map(String);
        const ok = got.length === want.length && got.every((v, i2) => v === want[i2]);
        if (!ok) {
          findings.push({
            file: doc.file, line: i + 1, id: check.id, what: check.what,
            published: got.join(" / "), measured: want.join(" / "),
            text: lines[i].trim().slice(0, 120),
          });
        }
      }
    }
  }
}

/* ═══ THE REPORT ═══════════════════════════════════════════════════════════ */
console.log("PUBLISHED NUMBERS, MEASURED");
console.log("");
console.log("  measured tonight:");
const lint = measure.lint();
console.log(`    lint                 ${lint ? lint.errors + " errors / " + lint.warnings + " warnings" : "(unavailable)"}`);
console.log(`    asset-table rows     ${measure.assetRows()}  (${measure.assetMissing()} missing from disk, ${measure.assetBucketed()} bucketed)`);
console.log(`    ledger rows          ${measure.ledgerRows()}`);
console.log(`    register rows        ${measure.registerRows()}`);
console.log(`    manual pages         ${measure.manualPages()}`);
console.log(`    Record entries       ${await measure.recordEntries()}`);
console.log("");
console.log(`  ${claims} published claim(s) checked in ${DOCS.filter(d => !d.skipWhole).length} document(s)`);
for (const s of skipped) console.log(`  not read: ${s}`);
console.log("");

if (!findings.length) {
  console.log("PASS — every standing value published in the governing documents");
  console.log("matches what the repository actually holds.");
  process.exit(0);
}

console.log(`${findings.length} STALE PUBLISHED NUMBER(S):`);
console.log("");
for (const f of findings) {
  console.log(`  ${f.file}:${f.line}`);
  console.log(`    ${f.what}`);
  console.log(`    published  ${f.published}`);
  console.log(`    measured   ${f.measured}`);
  console.log(`    | ${f.text}`);
  console.log("");
}
console.log("A published standing value is a tripwire. Publishing the wrong one does not");
console.log("weaken it, it inverts it. Correct the document — and never a round log.");
process.exit(GATE ? 1 : 0);
