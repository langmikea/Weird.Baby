#!/usr/bin/env node
/* ===========================================================================
   RESCUE-IMPORT — get Mike's answers out of a browser dump and into the repo.
   [U1/U4 2026-08-09]
   ---------------------------------------------------------------------------
   His writing lived in ONE place: this browser's `localStorage`, on one machine,
   under one key, with nothing in the repository holding a copy. The worksheet
   had been rebuilt several times and nobody had ever verified his content
   survived a rebuild. That is the risk this file exists to end.

   IT READS TWO SHAPES AND WRITES ONE:

     a RESCUE DUMP   { keys: { "<storage key>": "<raw JSON string>", … } }
                     what `tools/dictation/RESCUE.md`'s console snippet produces
                     — every key in the browser's store, raw, judged by nothing.

     an ANSWERS FILE { key, saved, answers: { "<slot>": "<text>", … } }
                     what the worksheet's SAVE TO THE REPO button writes.

     →  docs/dictation-20260807/answers.json, in the second shape, which the
        generator bakes back into the page.

   THREE RULES IT WILL NOT BREAK.

   (1) IT NEVER SHORTENS AN ANSWER. Merging into an existing file, a longer
       stored answer never loses to a shorter incoming one without the conflict
       being PRINTED and `--force` being typed. Two machines, two halves, and
       the wrong direction of merge is how you lose the half nobody re-reads.

   (2) IT WRITES A DATED BACKUP BEFORE IT WRITES ANYTHING. `answers.json` is the
       durable copy of work that exists nowhere else; a tool that overwrites it
       in place is one bad run from being the loss it was built to prevent.

   (3) IT REPORTS EVERY KEY IT FOUND, INCLUDING THE ONES IT DID NOT USE. A dump
       may hold `wb.arc12.*` and older keys from rebuilds that changed the key;
       an importer that silently picked one and dropped the rest would be the
       original defect wearing a fix's clothes.

     node tools/dictation/rescue-import.mjs <dump.json>            report + write
     node tools/dictation/rescue-import.mjs <dump.json> --dry-run  report only
     node tools/dictation/rescue-import.mjs <dump.json> --force    shorter wins
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const OUT_DIR = path.join(REPO, "docs", "dictation-20260807");
const OUT = path.join(OUT_DIR, "answers.json");

const argv = process.argv.slice(2);
const DRY = argv.includes("--dry-run");
const FORCE = argv.includes("--force");
const src = argv.find(a => !a.startsWith("--"));

if (!src) {
  console.error("usage: node tools/dictation/rescue-import.mjs <dump.json> [--dry-run] [--force]");
  console.error("       the dump is what tools/dictation/RESCUE.md's snippet downloads,");
  console.error("       or an answers.json the worksheet's Save to the repo button wrote.");
  process.exit(1);
}
if (!fs.existsSync(src)) { console.error("not on disk: " + src); process.exit(1); }

const raw = JSON.parse(fs.readFileSync(src, "utf8"));
const rel = p => path.relative(REPO, p).split(path.sep).join("/");

/* ── what is in it ───────────────────────────────────────────────────────── */
const incoming = {};          // slot -> text
const report = [];

const takeObject = (label, obj) => {
  let n = 0;
  for (const [k, v] of Object.entries(obj)) {
    const s = String(v ?? "");
    if (!s.trim()) continue;
    /* LONGEST WINS ACROSS KEYS INSIDE ONE DUMP, because a dump may carry two
       generations of the same slot and the longer one is the later draft in
       every case this project has seen. It is printed when it happens. */
    if (incoming[k] && incoming[k] !== s) {
      const keep = incoming[k].length >= s.length ? incoming[k] : s;
      report.push(`  ! ${k} appears twice with different text (${incoming[k].length} and ${s.length} chars) — kept the longer`);
      incoming[k] = keep;
    } else incoming[k] = s;
    n++;
  }
  report.push(`  ${label}: ${n} non-empty answer(s)`);
  return n;
};

if (raw.keys && typeof raw.keys === "object") {
  console.log(`RESCUE DUMP — ${Object.keys(raw.keys).length} storage key(s), taken ${raw.rescued || "(undated)"}`);
  for (const [k, v] of Object.entries(raw.keys)) {
    let parsed = null;
    try { parsed = JSON.parse(v); } catch { /* not JSON */ }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      report.push(`  ${k}: not a slot store (${String(v).length} chars) — CARRIED IN THE BACKUP, not imported`);
      continue;
    }
    if (!k.startsWith("wb.worksheet.")) {
      report.push(`  ${k}: ${Object.keys(parsed).length} field(s) — NOT the worksheet's key, not imported`);
      continue;
    }
    takeObject(k, parsed);
  }
} else if (raw.answers && typeof raw.answers === "object") {
  console.log(`ANSWERS FILE — key ${raw.key || "(unnamed)"}, saved ${raw.saved || "(undated)"}`);
  takeObject(raw.key || "answers", raw.answers);
} else {
  console.error("This is neither a rescue dump (needs `keys`) nor an answers file (needs `answers`).");
  process.exit(1);
}
report.forEach(l => console.log(l));

/* ── merge with what is already in the repo ──────────────────────────────── */
let existing = {};
if (fs.existsSync(OUT)) {
  try { existing = JSON.parse(fs.readFileSync(OUT, "utf8")).answers || {}; } catch { existing = {}; }
}
const merged = { ...existing };
const added = [], grown = [], shrunk = [], same = [];
for (const [k, v] of Object.entries(incoming)) {
  if (!(k in existing)) { merged[k] = v; added.push(k); }
  else if (existing[k] === v) same.push(k);
  else if (v.length >= existing[k].length) { merged[k] = v; grown.push(`${k} (${existing[k].length} -> ${v.length})`); }
  else { shrunk.push(`${k} (${existing[k].length} -> ${v.length})`); if (FORCE) merged[k] = v; }
}

console.log(`\nagainst ${rel(OUT)}: ${added.length} new · ${grown.length} longer · ${same.length} unchanged · ${shrunk.length} SHORTER`);
added.forEach(k => console.log(`  + ${k}`));
grown.forEach(k => console.log(`  ^ ${k}`));
if (shrunk.length) {
  console.log(FORCE
    ? "  ! --force: the shorter incoming text REPLACED the longer stored text:"
    : "  ! REFUSED (would shorten an answer). Re-run with --force only if you mean it:");
  shrunk.forEach(k => console.log(`    - ${k}`));
}

const total = Object.keys(merged).length;
if (DRY) { console.log(`\n--dry-run: nothing written. Would hold ${total} answer(s).`); process.exit(0); }

/* ── the backup comes first ──────────────────────────────────────────────── */
fs.mkdirSync(OUT_DIR, { recursive: true });
if (fs.existsSync(OUT)) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const bak = OUT.replace(/\.json$/, `.${stamp}.bak.json`);
  fs.copyFileSync(OUT, bak);
  console.log(`\nbacked up  ${rel(bak)}`);
}
fs.writeFileSync(OUT, JSON.stringify({
  what: "Mike's worksheet answers — the DURABLE copy. Written by the worksheet's "
      + "Save to the repo button or by tools/dictation/rescue-import.mjs, and baked "
      + "back into the page by npm run dictation. Ops does not hand-edit it.",
  key: raw.key || "wb.worksheet.2026-08-07",
  saved: new Date().toISOString(),
  answers: merged,
}, null, 1) + "\n");
console.log(`wrote      ${rel(OUT)} — ${total} answer(s)`);
console.log(`\nNext: npm run dictation  (bakes them into the worksheet, so a cleared`);
console.log(`browser still opens on his words).`);
