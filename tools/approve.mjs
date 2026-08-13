#!/usr/bin/env node
/* ===========================================================================
   npm run approve — the only thing that writes Mike's signature. [2026-08-13]
   ---------------------------------------------------------------------------
       npm run approve                     what is signed, what dropped, what never was
       npm run approve -- /wal             sign that page as it stands now
       npm run approve -- /wal --why       what moved since he last signed it
       npm run approve -- --blast <file>   how many pages one file's change drops
       npm run approve -- --check          exit 1 if any page is unapproved (for a gate)

   OPS MUST NEVER RUN THE SIGNING FORM. It is in the file's own mouth because a
   rule nobody can see is a rule nobody keeps: `provenance/approvals.json` is
   HIS record, the fingerprint is of what HE looked at, and a signature Ops
   applied is worth nothing. The report forms are Ops' to run at any time.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { state, blastOf, readApprovals, writeApprovals, APPROVALS_FILE } from "../reveal/approval.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const valAfter = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const route = argv.find(a => a.startsWith("/")) || null;

const MARK = { approved: "●", dropped: "○", never: "·", "n/a": " " };

/* ── --blast ──────────────────────────────────────────────────────────────── */
if (flag("--blast")) {
  const f = valAfter("--blast");
  if (!f) { console.error("--blast needs a file, e.g. src/components/MuseumBar.jsx"); process.exit(1); }
  const on = blastOf(f);
  console.log(`${f}`);
  console.log(`  reaches ${on.length} page(s): ${on.join("  ") || "(none)"}`);
  console.log(`  a change to what it SHOWS would drop ${on.length} approval(s).`);
  process.exit(0);
}

const rows = state();
const real = rows.filter(r => r.status !== "n/a");

/* ── --check (the gate form) ─────────────────────────────────────────────── */
if (flag("--check")) {
  const bad = real.filter(r => r.status !== "approved");
  for (const r of rows) {
    console.log(`  ${MARK[r.status]} ${r.route.padEnd(18)} ${r.status}`
      + (r.moved && r.moved.length ? `  (${r.moved.join(", ")} moved)` : "")
      + (r.notAPage ? `  — ${r.notAPage}` : ""));
  }
  console.log("");
  if (!bad.length) {
    console.log(`APPROVED: all ${real.length} pages carry a current signature.`);
    process.exit(0);
  }
  console.log(`${bad.length} of ${real.length} page(s) are NOT approved as they stand:`);
  for (const r of bad) console.log(`    ${r.route}  — ${r.status}`);
  console.log("");
  console.log("This is Mike's to clear, never Ops'. `npm run approve -- <route>`,");
  console.log("run by him, after he has looked at the page.");
  process.exit(1);
}

/* ── --why ───────────────────────────────────────────────────────────────── */
if (route && flag("--why")) {
  const r = real.find(x => x.route === route);
  if (!r) { console.error(`no page at ${route}`); process.exit(1); }
  console.log(`${route} — ${r.status}`);
  if (r.status === "approved") { console.log("  nothing has moved since you signed it."); process.exit(0); }
  if (r.status === "never") { console.log("  you have never signed this page."); process.exit(0); }
  console.log(`  signed ${r.signed.at} against fingerprint ${r.signed.fp}`);
  console.log(`  it is now ${r.fp}`);
  console.log(`  what moved: ${r.moved.join(", ") || "(the parts match; the whole does not — report this)"}`);
  console.log("");
  console.log(`  words    ${r.parts.nWords} strings   was ${r.signed.parts.words}  now ${r.parts.words}`);
  console.log(`  look     ${r.parts.nLook} stylesheets  was ${r.signed.parts.look}  now ${r.parts.look}`);
  console.log(`  pictures ${r.parts.nPictures} assets   was ${r.signed.parts.pictures}  now ${r.parts.pictures}`);
  process.exit(0);
}

/* ── sign one page ───────────────────────────────────────────────────────── */
if (route) {
  const r = real.find(x => x.route === route);
  if (!r) {
    console.error(`No page at ${route}. The pages are:`);
    for (const x of real) console.error("    " + x.route);
    process.exit(1);
  }
  const a = readApprovals();
  a.approvals = a.approvals || {};
  const was = a.approvals[route];
  a.approvals[route] = {
    fp: r.fp, parts: r.parts, at: new Date().toISOString().slice(0, 10), by: "Mike",
  };
  writeApprovals(a);
  console.log(`signed ${route}`);
  console.log(`  fingerprint ${r.fp}`);
  console.log(`  ${r.parts.nWords} strings, ${r.parts.nLook} stylesheets, ${r.parts.nPictures} pictures`);
  if (was) console.log(`  (replaces the signature of ${was.at} on ${was.fp})`);
  console.log(`  written to ${APPROVALS_FILE} — commit it`);
  process.exit(0);
}

/* ── the default: the walk-list ──────────────────────────────────────────── */
console.log("THE PAGES, AND WHETHER MIKE HAS SIGNED THEM");
console.log("");
for (const r of rows) {
  const note = r.notAPage ? `  — ${r.notAPage}`
    : r.status === "approved" ? `  signed ${r.signed.at}`
    : r.status === "dropped" ? `  signed ${r.signed.at}, then ${r.moved.join(" and ")} moved`
    : "";
  console.log(`  ${MARK[r.status]} ${r.route.padEnd(18)} ${String(r.status).padEnd(9)}`
    + `${String(r.parts ? r.parts.nWords : "").padStart(5)} strings${note}`);
}
const n = (s) => real.filter(r => r.status === s).length;
console.log("");
console.log(`  ${n("approved")} approved   ${n("dropped")} dropped   ${n("never")} never signed`);
console.log("");
console.log("  ● approved and current    ○ signed once, then the page changed    · never signed");
console.log("");
console.log("  npm run approve -- /wal          sign that page");
console.log("  npm run approve -- /wal --why    what moved since you signed it");
