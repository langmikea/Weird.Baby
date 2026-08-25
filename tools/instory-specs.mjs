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
// ═══ WHERE THE STRINGS COME FROM ═════════════════════════════════════════════
//
// [2026-08-24 — CORRECTED] THIS HEADER USED TO SAY *"the strings come from
// `tools/provenance-sweep.mjs`'s own extractor, so the population is exactly
// the population `provenance:gate` polices — the same arrangement, and the same
// reason, as `tools/surfacing.mjs`."* **NONE OF THAT IS TRUE AND BOTH HALVES ARE
// CHECKABLE IN ONE GREP:** this file imports nothing from `provenance-sweep.mjs`
// and neither does `surfacing.mjs`.
//
// A FALSE SENTENCE ABOUT WHERE A GATE GETS ITS INPUT IS THE SAME CLASS AS THE
// DEFECT THIS PACKET FIXES — it describes a coverage the gate does not have, and
// a reader checking "is this population the right one" would have stopped at the
// sentence and been satisfied by a claim rather than by the code.
//
// WHAT IS TRUE: the strings come from `faceStrings()` BELOW, in this file. It
// flattens the face object recursively and emits every string value it holds,
// keyed by its field path (`face.lines[3]`, `face.blurb`). The population is
// therefore THE FACE'S OWN DECLARED STRINGS — related to what `provenance:gate`
// polices, but not the same set and not derived from it.
//
// THE LIMIT THAT FOLLOWS, SAID OUT LOUD: a string a RENDERER composes at draw
// time is not in the face data and this gate cannot see it. Only what the face
// declares is read.
//
// ═══ [2026-08-24] THE MODULE LIST IS GONE, AND A LIST IS WHAT FAILED ═════════
//
// THIS GATE PRINTED `spec surfaces 0 · PASS` ON EVERY PACKET FOR A WEEK. It
// loaded two modules BY NAME — `robots.js` and `portal.js` — and on 2026-08-17
// (`3f60d77`) both Technical Specifications faces moved to `robots-units.js`
// with the albums that carry them, so that the two machines could be held by
// NOT BEING IMPORTED (§0: a hold is not a hold if it depends on another hold).
// The move was correct. The list was not updated, and nothing could have said
// so: A GATE THAT READ NOTHING AND A GATE THAT FOUND NOTHING PRINT THE SAME
// WORD.
//
// THE OLD HEADER SAID *"a face that moves file keeps its scope."* That was true
// of a face moving WITHIN a scanned file and false of one moving OUT of the
// scanned set, and it read as a guarantee against precisely the thing that then
// happened. THE LIST IS REPLACED BY A WALK of `src/data/` — the layer where
// album data is declared by architecture — and an album is found BY SHAPE
// (anything carrying a `tracks` array) at any depth, under any export name.
//
// TWO GUARDS, BECAUSE DISCOVERY CAN LOSE THINGS TOO:
//
//   1. A DATA MODULE THAT WILL NOT LOAD IS A FAULT, NEVER A SKIP. A module the
//      gate cannot open is a module the gate is not policing, and swallowing
//      that is the same defect one layer down. The old loop's `if (!exists)
//      continue` was that swallow in miniature.
//   2. EVERY TITLE IN `SPEC_SURFACES` MUST BE FOUND. Declaring a surface and
//      matching it nowhere FAILS THE GATE BY NAME. This is `menu-parity.mjs`'s
//      precedent, stated in that file's own header: it names its two machines
//      by id and faults on a missing one rather than reporting on whatever it
//      happens to meet, so the check stays true WHILE THE SURFACES ARE HELD and
//      has been running the whole time rather than being switched back on by
//      somebody who remembered. Parity got that care on 2026-08-17. This gate
//      did not, and this is that care, arriving late.
//
// WHAT THIS STILL WOULD NOT REACH, SAID OUT LOUD: album data declared outside
// `src/data/`. Guard 2 is the cover — the surface would go unfound and the gate
// would name it, instead of the scope quietly shrinking to nothing again.
//
// ═══ [2026-08-24] THE FIRST CLEAN RUN IS LUCK, AND A LATER ROUND MUST NOT ════
// ═══ READ IT AS EVIDENCE THE SURFACES WERE BEING POLICED ═════════════════════
//
// The fixed gate finds both faces and reports ZERO findings. **THAT IS NOT
// SEVEN DAYS OF THE GATE HOLDING. IT IS SEVEN DAYS OF NOBODY OPENING THE FILE.**
// Two facts, both checkable, and they are written here because the PASS by
// itself says neither:
//
//   · THE REGISTER WAS STRUCK BY HAND ON 2026-08-06, in the N2 round, ELEVEN
//     DAYS BEFORE the blindness began — `BOARD`, `PROGRAM`, `STATUS`, `BENCH`,
//     `LAMPS` and `DECLARED`'s file clause off the NIAC; the four `TREES` /
//     `PRIMARY` / `SECOND` / `FORM` lines and the `ON FILE` entry off the
//     VIIIp. A human removed every real-build fact. No gate did.
//   · `robots-units.js` HAS EXACTLY ONE COMMIT — `3f60d77`, the 2026-08-17 move
//     itself. Nothing has edited these two faces in the whole window during
//     which nothing was watching them.
//
// So the clean result measures the absence of an edit, not the presence of a
// check. **A GREEN RUN DATED BEFORE THIS BLOCK PROVES NOTHING ABOUT DOCTRINE 18
// ON THESE SURFACES**, and the first run that does prove something is the first
// one AFTER a hand touches a spec face. Anyone reaching for the packet history
// to argue these faces were covered should stop at this paragraph.
//
// ═══ HOW TO ADD A SURFACE ════════════════════════════════════════════════════
//
// Put its `face.title` in `SPEC_SURFACES`. Nothing else. The gate finds the
// album it lives on by shape, so a face may move file, export name or nesting
// depth freely.
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
//
// [2026-08-24] AND `.json` JOINS IT, BECAUSE THE WALK REACHES FILES THE LIST
// NEVER DID. `src/data/exhibits/hunter-root-served.js` does `import RAW from
// "./hunter_root.json"` with no import attribute — correct for vite, a hard
// throw under bare Node. Under the old two-module list that file was never
// opened, so the hole was invisible. It is served here rather than skipped:
// guard 1 says a module the gate cannot open is a module it is not policing,
// and a loader gap is not a reason to stop policing a file.
registerHooks({
  load(url, ctx, next) {
    if (url.endsWith(".jsx")) return { format: "module", source: "export default null;", shortCircuit: true };
    if (url.endsWith(".json")) {
      const src = fs.readFileSync(fileURLToPath(url), "utf8");
      return { format: "module", source: `export default ${src};`, shortCircuit: true };
    }
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

/* Returns the DECLARED title it matched, not a boolean — guard 2 needs to know
   which entry in `SPEC_SURFACES` was actually met, and a boolean cannot say. */
const specSurfaceOf = (s) =>
  (!s ? null : SPEC_SURFACES.find(t => String(s).toLowerCase() === t.toLowerCase())) || null;

/** walk an album array and collect every spec surface's strings */
function collect(albums, file, out) {
  for (const album of albums || []) {
    for (const track of album.tracks || []) {
      const matched = specSurfaceOf(track.title)
                   || specSurfaceOf(track.face && track.face.title);
      if (!ALL && !matched) continue;
      if (ALL && !track.face) continue;
      const label = `${album.title || album.id} · ${track.title || track.id}`;
      for (const s of faceStrings(track.face)) {
        // the surface's own name is not a claim about the machine
        if (s.where === "face.title" || s.where === "face.kind") continue;
        out.push({ file, surface: label, surfaceTitle: matched, ...s });
      }
    }
  }
}

/* THE DATA LAYER, WALKED. Every `.js` under `src/data/`, recursively. This is a
   ROOT, not a list: a file added, renamed or moved inside the layer is found on
   the next run with no edit here, which is the whole difference from what this
   replaced. */
const DATA_ROOT = "src/data";
function dataModules(rel = DATA_ROOT, out = []) {
  for (const e of fs.readdirSync(path.join(REPO, rel), { withFileTypes: true })) {
    const child = `${rel}/${e.name}`;
    if (e.isDirectory()) dataModules(child, out);
    else if (e.isFile() && e.name.endsWith(".js")) out.push(child);
  }
  return out.sort();
}

/* AN ALBUM IS ANYTHING CARRYING A `tracks` ARRAY, wherever it sits. The four
   shapes the old loader knew — a bare album, an array of them, `.spine`,
   `.albums` — were four guesses at where an album might be parked, and a fifth
   parking place would have been a fifth silent miss. This asks the object what
   it is instead.

   IT DOES NOT DESCEND INTO AN ALBUM. A track's face holds strings, not albums,
   and stopping at the album is what keeps `seen` meaningful. `seen` is shared
   across every module, so an album exported twice, or reachable through two
   modules, is collected ONCE and attributed to the first module that reached
   it — no double-counted surface, no double-reported finding. */
function albumsIn(value, seen, out, depth = 0) {
  if (!value || typeof value !== "object" || depth > 8) return out;
  if (seen.has(value)) return out;
  seen.add(value);
  if (Array.isArray(value.tracks)) { out.push(value); return out; }
  if (Array.isArray(value)) { for (const v of value) albumsIn(v, seen, out, depth + 1); return out; }
  for (const v of Object.values(value)) albumsIn(v, seen, out, depth + 1);
  return out;
}

const loadFaults = [];

async function loadSurfaces() {
  const found = [];
  // The data modules import `src/lib/placement.js`, which reads the injected
  // `__WB_PLACEMENT__`. Supply a DEVELOPMENT configuration so every governed
  // picture resolves — this gate reads WORDS and must see the whole face, in
  // the stage where the whole face exists.
  globalThis.__WB_PLACEMENT__ = { stage: "development", publicPaths: [] };
  const seen = new WeakSet();
  const mods = dataModules();
  for (const m of mods) {
    const abs = path.join(REPO, m);
    let mod;
    try {
      mod = await import("file://" + abs.split(path.sep).join("/"));
    } catch (e) {
      /* GUARD 1. Not a `continue`. A module that will not open is a module this
         gate is not policing, and that is the defect being fixed, one layer
         down. It is reported by name and it fails the gate. */
      loadFaults.push({ file: m, why: String(e && e.message || e).split("\n")[0] });
      continue;
    }
    const albums = [];
    for (const v of Object.values(mod)) albumsIn(v, seen, albums);
    collect(albums, m, found);
  }
  return { found, modules: mods.length };
}

const { found: strings, modules: MODULE_COUNT } = await loadSurfaces();

/* GUARD 2 — menu-parity's precedent. A declared surface that matched nowhere is
   the exact shape of this gate's own week-long blind spot, and it is the one
   condition under which `0 surfaces` must never read as a pass. Skipped under
   `--all`, which scans every face and is not scoped by the list. */
const seenTitles = new Set(
  strings.map(s => String(s.surfaceTitle || "").toLowerCase()).filter(Boolean));
const unfoundSurfaces = ALL ? [] : SPEC_SURFACES.filter(t => !seenTitles.has(t.toLowerCase()));

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
  console.log(JSON.stringify({
    modules: MODULE_COUNT, surfaces: strings.length,
    findings, badAllow, unusedAllow, loadFaults, unfoundSurfaces,
  }, null, 1));
} else {
  const surfaces = [...new Set(strings.map(s => s.surface))];
  console.log("IN-STORY SPECIFICATIONS — Doctrine 18\n");
  console.log(`  data modules   ${MODULE_COUNT}  (walked from ${DATA_ROOT}/, not listed)`);
  console.log(`  spec surfaces  ${surfaces.length}`);
  surfaces.forEach(s => console.log(`                 · ${s}`));
  console.log(`  strings read   ${strings.length}`);
  console.log(`  allowed        ${ALLOW.length}`);
  console.log(`  FINDINGS       ${findings.length}\n`);
  for (const f of findings) {
    console.log(`  ✗ ${f.surface}`);
    console.log(`    ${f.file} · ${f.where}`);
    console.log(`    ${JSON.stringify(f.text).slice(0, 160)}`);
    console.log(`    → ${f.tell}  (matched ${JSON.stringify(f.hit)})\n`);
  }
  for (const l of loadFaults)
    console.log(`  ✗ a data module would not load, so it is not being policed: ${l.file}\n    ${l.why}`);
  for (const t of unfoundSurfaces)
    console.log(`  ✗ SPEC_SURFACES declares ${JSON.stringify(t)} and it was found on no album.\n`
              + `    Either the face was renamed, or it lives somewhere ${DATA_ROOT}/ does not reach.\n`
              + `    This is the 2026-08-17 failure and it does not get to print PASS again.`);
  for (const a of badAllow) console.log(`  ✗ ALLOW entry with no reason: ${JSON.stringify(a.text)}`);
  for (const a of unusedAllow) console.log(`  · ALLOW entry matches nothing (stale): ${JSON.stringify(a.text)}`);
  if (!findings.length && !badAllow.length && !loadFaults.length && !unfoundSurfaces.length)
    console.log("  PASS — no real-world fact on a specification surface.");
}

if (GATE && (findings.length || badAllow.length || loadFaults.length || unfoundSurfaces.length)) {
  const parts = [];
  if (findings.length) parts.push(`${findings.length} real-world fact(s) on a specification surface`);
  if (loadFaults.length) parts.push(`${loadFaults.length} data module(s) the gate could not open`);
  if (unfoundSurfaces.length) parts.push(`${unfoundSurfaces.length} declared surface(s) found nowhere`);
  if (badAllow.length) parts.push(`${badAllow.length} ALLOW entry without a reason`);
  console.error(`\nGATE FAILED — ${parts.join("; ")}.`);
  process.exit(1);
}
