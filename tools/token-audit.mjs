// tools/token-audit.mjs — the token conformance ledger.
//
// WHY THIS EXISTS. B7/R1 found four visitor-facing surfaces using ZERO design
// tokens — 151 hard-coded colours, 96 of them byte-for-byte a `--wb-*` that
// already exists — and the finding was reported as a table nobody could
// reproduce. A conformance sweep that cannot be re-run is a conformance sweep
// that decays the moment the next colour is typed.
//
// WHAT IT DOES. Reads the canonical palette out of `src/styles/museum-tokens.css`
// (the source of truth, parsed — not re-typed here, which would be a third
// mirror) and reports, per surface:
//
//   · every hex literal and `rgb()`/`rgba()` literal found
//   · which ones are byte-for-byte an existing token          → MECHANICAL
//   · which ones are not                                      → DECISION
//   · how many `var(--wb-*)` reads the surface already makes
//
// Run: node tools/token-audit.mjs [--all]
//   default   the four R1 surfaces plus the two ramp consumers, summary table
//   --all     every file under src/, so a new surface cannot arrive unnoticed
//
// It reports. It never edits.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOKENS_FILE = path.join(ROOT, "src/styles/museum-tokens.css");

/* ── the palette, parsed from its own file ─────────────────────────────────── */
function readTokens() {
  const css = fs.readFileSync(TOKENS_FILE, "utf8");
  const out = new Map();               // normalised value -> token name
  const names = new Map();             // token name -> raw value
  for (const m of css.matchAll(/(--wb-[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    const name = m[1];
    const raw = m[2].trim();
    names.set(name, raw);
    const norm = normHex(raw);
    if (norm && !out.has(norm)) out.set(norm, name);
  }
  return { byValue: out, byName: names };
}

/* #ABC / #AABBCC / #AABBCCDD -> lowercase 6- or 8-digit, or null if not a hex */
function normHex(v) {
  const m = String(v).trim().match(/^#([0-9a-f]{3,8})$/i);
  if (!m) return null;
  let h = m[1].toLowerCase();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length === 4) h = h.split("").map((c) => c + c).join("");
  return "#" + h;
}

/* ── literals in a source file ─────────────────────────────────────────────── */
const COMMENT_CSS = /\/\*[\s\S]*?\*\//g;
const COMMENT_LINE = /(^|[^:])\/\/[^\n]*/g;

function scan(file, { stripComments = true } = {}) {
  let src = fs.readFileSync(file, "utf8");
  if (stripComments) {
    src = src.replace(COMMENT_CSS, (m) => m.replace(/[^\n]/g, " "));
    if (/\.jsx?$/.test(file)) src = src.replace(COMMENT_LINE, (m, p) => p + " ".repeat(m.length - p.length));
  }
  const hits = [];
  const lines = src.split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      const norm = normHex(m[0]);
      if (norm) hits.push({ line: i + 1, raw: m[0], norm, ctx: line.trim().slice(0, 96) });
    }
    for (const m of line.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/g)) {
      const norm = "#" + [m[1], m[2], m[3]].map((n) => (+n).toString(16).padStart(2, "0")).join("");
      hits.push({ line: i + 1, raw: m[0], norm, alpha: m[4] ?? null, ctx: line.trim().slice(0, 96) });
    }
  });
  const varReads = (src.match(/var\(\s*--wb-[a-z0-9-]+/gi) || []).length;
  return { hits, varReads };
}

/* ── report ────────────────────────────────────────────────────────────────── */
const SURFACES = [
  "src/routes/shop/GiftShop.css",
  "src/routes/WbHome.jsx",
  "src/routes/InfoBooth.jsx",
  "src/routes/WbAdmin.jsx",
  "src/routes/exhibit/Exhibit.css",
  "src/routes/hr/HrExhibitFlow.css",
];

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(css|jsx?)$/.test(e.name) && !/\.(pre-|old_v|bak_)/.test(e.name)) acc.push(p);
  }
  return acc;
}

const { byValue, byName } = readTokens();
const all = process.argv.includes("--all");
const verbose = process.argv.includes("--verbose");
const files = all
  ? walk(path.join(ROOT, "src")).map((f) => path.relative(ROOT, f).replace(/\\/g, "/"))
  : SURFACES;

console.log(`palette: ${byName.size} tokens in src/styles/museum-tokens.css ` +
            `(${byValue.size} distinct colour values)\n`);

const rows = [];
let totalHits = 0, totalExact = 0;
for (const rel of files) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  const { hits, varReads } = scan(abs);
  if (!hits.length && !varReads) continue;
  /* An `rgba()` with real alpha is NOT byte-identical to an opaque token even
     when its RGB triple matches one — swapping it would drop the alpha. It is
     counted as a literal and reported as a decision, never as mechanical. */
  const opaque = (h) => h.alpha == null || Number(h.alpha) === 1;
  const exact = hits.filter((h) => opaque(h) && byValue.has(h.norm));
  const other = hits.filter((h) => !(opaque(h) && byValue.has(h.norm)));
  rows.push({ rel, varReads, hits: hits.length, exact: exact.length, other: other.length });
  totalHits += hits.length; totalExact += exact.length;
  if (verbose && other.length) {
    console.log(`── ${rel} — ${other.length} value(s) with no token:`);
    const seen = new Map();
    for (const h of other) {
      if (!seen.has(h.norm)) seen.set(h.norm, []);
      seen.get(h.norm).push(h);
    }
    for (const [norm, group] of [...seen.entries()].sort((a, b) => b[1].length - a[1].length)) {
      console.log(`   ${norm}  x${group.length}  first: ${rel}:${group[0].line}  ${group[0].ctx}`);
    }
    console.log("");
  }
}

const pad = (s, n) => String(s).padEnd(n);
console.log(pad("surface", 42) + pad("var(--wb-*)", 13) + pad("literals", 10) +
            pad("= a token", 11) + "no token");
console.log("-".repeat(42 + 13 + 10 + 11 + 9));
for (const r of rows) {
  console.log(pad(r.rel, 42) + pad(r.varReads, 13) + pad(r.hits, 10) +
              pad(r.exact, 11) + r.other);
}
console.log("-".repeat(42 + 13 + 10 + 11 + 9));
console.log(pad("TOTAL", 42) + pad("", 13) + pad(totalHits, 10) +
            pad(totalExact, 11) + (totalHits - totalExact));
