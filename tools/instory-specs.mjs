#!/usr/bin/env node
// tools/instory-specs.mjs — THE IN-STORY SPECIFICATION GATE.
//
// ═══ THE LAW IT ENFORCES (Mike, 2026-08-06 — STANDING, site-wide) ════════════
//
//     "Technical Specifications" MEANS THE IN-STORY SPECS, NEVER THE REAL ONES.
//
// A specification surface in this museum describes THE OBJECT THE FICTION HOLDS
// — a machine sold by ABEAL, engines carrying compile dates of 1945, 1946 and
// 1965. It does not describe the workshop the object was built in. The board
// part number, the source-tree filenames, the bench sketch count, the line count
// and the calendar dates of the real build are all TRUE and all belong somewhere
// else: they are the provenance of a prop, and a spec sheet is not a provenance
// record.
//
// Canonical statement: `docs/canonical/OPERATIONS.md` §7 Doctrine 18.
//
// ═══ WHY A CHECK AND NOT A READING ═══════════════════════════════════════════
//
// Mike's own words on giving the instruction: *"this drifts back easily."* It
// does, and the reason is structural rather than careless — the real facts are
// the ones Ops can VERIFY. A session looking for something true to put on a spec
// sheet will reach for the firmware tree every time, because the firmware tree
// is the thing it can read. The register rows and the round logs do not stop
// that; a gate does.
//
// ═══ WHAT IT SCANS, AND WHY THE SCOPE IS NARROW ══════════════════════════════
//
// SPEC SURFACES ONLY — the faces named in `SPEC_SURFACES` below. The museum's
// own voice is not in the fiction and must stay real: the Record is this house's
// log of receiving the object THIS YEAR (a sealed modern bag, a USB-C adapter,
// a slow charge — all correct, all modern, all on a surface whose subject is
// now), the Information Booth answers as the house, and every accession number
// and sources line on the site is provenance, which Doctrine 11 explicitly
// ships. Scanning those would fail the museum for telling the truth about
// itself.
//
// The strings come from `tools/provenance-sweep.mjs`'s own extractor, so the
// population is exactly the population `provenance:gate` polices — the same
// arrangement, and the same reason, as `tools/surfacing.mjs`.
//
// ═══ HOW TO ADD A SURFACE ════════════════════════════════════════════════════
//
// Put its `face.title` in `SPEC_SURFACES`. The gate matches a string to a
// surface by walking the album data, not by grepping the file, so a face that
// moves file keeps its scope.
//
// ═══ THE ESCAPE HATCH, AND ITS ONE CONDITION ═════════════════════════════════
//
// `ALLOW` takes a string and a REASON. It is the same arrangement as
// `reveal/delivery.mjs`'s signage carve-out: a declaration with a written reason
// per entry, never a pattern. An allow with an empty reason fails the gate,
// because a carve-out nobody had to justify is a hole.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerHooks } from "node:module";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// The album data imports one COMPONENT (`RobotsExhibitFlow.jsx`) so the exhibit
// can mount the wing's own deck. Node cannot load JSX and this gate does not
// need it — it reads the data, not the renderer. Stub the extension rather than
// copying the data out of the file it lives in, which is how a second copy of a
// catalogue gets made (Doctrine 17).
registerHooks({
  load(url, ctx, next) {
    if (url.endsWith(".jsx")) return { format: "module", source: "export default null;", shortCircuit: true };
    return next(url, ctx);
  },
});

// ── THE SURFACES ────────────────────────────────────────────────────────────
// Face titles whose subject is WHAT THE MACHINE IS. Matched case-insensitively
// against `face.title` and against the track `title`.
const SPEC_SURFACES = [
  "Technical Specifications",
];

// ── THE TELLS ───────────────────────────────────────────────────────────────
// Each is a fact-class of the real build. The `what` is printed on a failure so
// the reader is told which class was hit rather than which regex matched.
const TELLS = [
  { what: "a modern year — the fiction's engines compile in 1945, 1946 and 1965",
    re: /\b(19[7-9]\d|20\d\d)\b/ },
  { what: "a real board or module part number",
    re: /\b(arduino|uno\s*r4|nano|esp32|esp8266|atmega|rp2040|raspberry|teensy|bmi270|bmm150|dfplayer|ws2812|neopixel|adafruit|fastled)\b/i },
  { what: "a source file, tree or module name from the real firmware",
    re: /(\.ino\b|\.cpp\b|\.h\b|MGK_VIIIp_\d|#include|\binclude\b|\bsketch(es)?\b|\bcompile[rd]?\b|\bsource tree\b)/i },
  { what: "a version-control or filesystem fact about the real build",
    re: /\b(checked in|on disk|repo(sitory)?|commit(ted)?|git\b|github|branch)\b/i },
  { what: "a bench, workshop or validation state of the real build",
    re: /\b(bench(top)?\s*(board|limit|prototype|sketch)|pre-thermal|breadboard|solder(ed|ing)?|prototyp(e|ing))\b/i },
  { what: "a wiring or bus address of the real build",
    re: /(\b0x[0-9a-f]{2}\b|\bpin\s*D?\d+\b|\bserial\d\b|\bi2c\b|\bgpio\b|\bbaud\b|\b9600\b|NUM_PIXELS)/i },
  { what: "a count of lines of code",
    re: /\b[\d,]+\s*lines\b/i },
];

// ── THE ESCAPE HATCH ────────────────────────────────────────────────────────
// { text, why } — `text` must match a scanned string EXACTLY. No patterns.
const ALLOW = [];

// ────────────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const GATE = argv.includes("--gate");
const JSON_OUT = argv.includes("--json");
// `--all` widens the scan from the spec surfaces to EVERY face in the fiction.
// It is an AUDIT mode and never a gate: the Record is this house's log of
// receiving the object this year and is supposed to name a USB-C adapter, so a
// finding under `--all` is something to read, not something that failed.
const ALL = argv.includes("--all");
if (ALL && GATE) { console.error("--all is an audit mode; it cannot gate."); process.exit(2); }

/** every string a face declares, flattened, with the field it came from */
function faceStrings(face, out = [], trail = "face") {
  if (face == null) return out;
  if (typeof face === "string") { out.push({ where: trail, text: face }); return out; }
  if (Array.isArray(face)) {
    face.forEach((v, i) => faceStrings(v, out, `${trail}[${i}]`));
    return out;
  }
  if (typeof face === "object") {
    for (const [k, v] of Object.entries(face)) faceStrings(v, out, `${trail}.${k}`);
  }
  return out;
}

const isSpecSurface = (s) =>
  !!s && SPEC_SURFACES.some(t => String(s).toLowerCase() === t.toLowerCase());

/** walk an album array and collect every spec surface's strings */
function collect(albums, file, out) {
  for (const album of albums || []) {
    for (const track of album.tracks || []) {
      if (!ALL && !isSpecSurface(track.title) && !isSpecSurface(track.face && track.face.title)) continue;
      if (ALL && !track.face) continue;
      const label = `${album.title || album.id} · ${track.title || track.id}`;
      for (const s of faceStrings(track.face)) {
        // the surface's own name is not a claim about the machine
        if (s.where === "face.title" || s.where === "face.kind") continue;
        out.push({ file, surface: label, ...s });
      }
    }
  }
}

async function loadSurfaces() {
  const found = [];
  // The data modules import `src/lib/placement.js`, which reads the injected
  // `__WB_PLACEMENT__`. Supply a DEVELOPMENT configuration so every governed
  // picture resolves — this gate reads WORDS and must see the whole face, in
  // the stage where the whole face exists.
  globalThis.__WB_PLACEMENT__ = { stage: "development", publicPaths: [] };
  const mods = [
    "src/data/artists/robots.js",
    "src/data/artists/portal.js",
  ];
  for (const m of mods) {
    const abs = path.join(REPO, m);
    if (!fs.existsSync(abs)) continue;
    const mod = await import("file://" + abs.split(path.sep).join("/"));
    for (const v of Object.values(mod)) {
      if (!v || typeof v !== "object") continue;
      // an album, an array of albums, or an exhibit carrying a spine of them
      if (Array.isArray(v)) collect(v.filter(x => x && x.tracks), m, found);
      else if (Array.isArray(v.tracks)) collect([v], m, found);
      else if (Array.isArray(v.spine)) collect(v.spine, m, found);
      else if (Array.isArray(v.albums)) collect(v.albums, m, found);
    }
  }
  return found;
}

const strings = await loadSurfaces();

const allowed = new Map(ALLOW.map(a => [a.text, a.why]));
const badAllow = ALLOW.filter(a => !a.why || !String(a.why).trim());

const findings = [];
for (const s of strings) {
  if (allowed.has(s.text)) continue;
  for (const t of TELLS) {
    const m = t.re.exec(s.text);
    if (m) { findings.push({ ...s, tell: t.what, hit: m[0] }); break; }
  }
}

const unusedAllow = ALLOW.filter(a => !strings.some(s => s.text === a.text));

if (JSON_OUT) {
  console.log(JSON.stringify({ surfaces: strings.length, findings, badAllow, unusedAllow }, null, 1));
} else {
  const surfaces = [...new Set(strings.map(s => s.surface))];
  console.log("IN-STORY SPECIFICATIONS — Doctrine 18\n");
  console.log(`  spec surfaces  ${surfaces.length}`);
  surfaces.forEach(s => console.log(`                 · ${s}`));
  console.log(`  strings read   ${strings.length}`);
  console.log(`  allowed        ${ALLOW.length}`);
  console.log(`  FINDINGS       ${findings.length}\n`);
  for (const f of findings) {
    console.log(`  ✗ ${f.surface}`);
    console.log(`    ${f.where}`);
    console.log(`    ${JSON.stringify(f.text).slice(0, 160)}`);
    console.log(`    → ${f.tell}  (matched ${JSON.stringify(f.hit)})\n`);
  }
  for (const a of badAllow) console.log(`  ✗ ALLOW entry with no reason: ${JSON.stringify(a.text)}`);
  for (const a of unusedAllow) console.log(`  · ALLOW entry matches nothing (stale): ${JSON.stringify(a.text)}`);
  if (!findings.length && !badAllow.length) console.log("  PASS — no real-world fact on a specification surface.");
}

if (GATE && (findings.length || badAllow.length)) {
  console.error(`\nGATE FAILED — ${findings.length} real-world fact(s) on a specification surface.`);
  process.exit(1);
}
