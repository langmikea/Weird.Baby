#!/usr/bin/env node
/* ===========================================================================
   npm run release:check — THE CANON LINE, CHECKED. [2026-08-28]
   ---------------------------------------------------------------------------
       npm run release        the report
       npm run release:check  the same, and exit 1 on any fault

   MIKE'S RULING, AND IT IS THE WHOLE DESIGN BRIEF: *"The Record is canon — the
   story. A reel is promotion ABOUT the story. Nothing in the reel data ever
   reaches the museum's narrative, and that is a rule a gate checks rather than
   a boundary Ops trusts."*

   ═══ THE MODEL IS `reveal/reachability.mjs` ════════════════════════════════
   Its doctrine, which is the right one here: *"nothing here reads a row's
   opinion of itself except to contradict it."* A claim that nothing re-checks
   is a claim that expires quietly. So no check below asks this file whether it
   has behaved; every one reads the working tree.

   ═══ THE LINE IS ONE-DIRECTIONAL AND THAT HAD TO BE DESIGNED IN ════════════
     STORY -> RELEASE   ALLOWED. A caption may quote the museum, and the run's
                        `promotes` pointer names a museum video by the museum's
                        own id. The museum learns nothing from either.
     RELEASE -> STORY   FORBIDDEN, and checks 1-3 are the whole of it.

   A gate that blocked both directions would forbid a reel from quoting the
   thing it promotes, which is what a reel IS.

   ═══ WHY A DISK WALK AND NOT THE MODULE GRAPH ══════════════════════════════
   `wb-ops-braces` in vite.config.js walks `src/` from disk in `buildStart` for
   a reason it states outright: *"it sees a file even when nothing imports it: a
   note sitting in a module the bundler tree-shook away is still a note somebody
   has to act on."* The same is true of a caption pasted into a Record entry in
   a file that is currently unreferenced. Same walk, same reason.

   ═══ WHAT THIS GATE IS NOT ═════════════════════════════════════════════════
   It is not a deploy gate. OPERATIONS §0 is blunt that only `deploy-guard.mjs`
   runs at deploy time and every other gate in the manual is human discipline.
   This one runs on a packet, beside the others.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import * as acorn from "acorn";
import jsxPlugin from "acorn-jsx";

import {
  SURFACES, SURFACE_KEYS, surfaceOf, HANDLE, POSTING_STATES, UNDECIDED,
  RULES, inOrder, postingOn,
} from "../release/release-shape.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const DATA = path.join(REPO, "release", "releases.json");
const SRC = path.join(REPO, "src");
const GATE = process.argv.includes("--gate");

const lib = JSON.parse(fs.readFileSync(DATA, "utf8"));
const runs = lib.runs || [];
const faults = [];
const notes = [];
const fault = (s) => faults.push(s);

/* ── every JS/JSX file under src/, from DISK ──────────────────────────────── */
function srcFiles() {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(js|jsx)$/.test(e.name)) out.push(p);
    }
  })(SRC);
  return out;
}
const FILES = srcFiles();
const rel = (p) => path.relative(REPO, p).replace(/\\/g, "/");

/* parse once, reuse for both AST checks */
const PARSED = new Map();
function astOf(file) {
  if (PARSED.has(file)) return PARSED.get(file);
  let ast = null;
  try {
    ast = acorn.Parser.extend(jsxPlugin()).parse(fs.readFileSync(file, "utf8"), {
      ecmaVersion: "latest", sourceType: "module", locations: true,
    });
  } catch (e) {
    /* a file this pass cannot parse is a file it cannot clear — say so rather
       than passing it silently, which is `wb-ops-braces`' own posture */
    fault(`${rel(file)}: could not be parsed, so it cannot be cleared — ${e.message}`);
  }
  PARSED.set(file, ast);
  return ast;
}
function visit(n, fn) {
  if (!n || typeof n !== "object") return;
  if (Array.isArray(n)) { n.forEach(x => visit(x, fn)); return; }
  if (!n.type) return;
  fn(n);
  for (const k of Object.keys(n)) if (k !== "loc" && k !== "start" && k !== "end") visit(n[k], fn);
}

/* ═══ 1. NO src/ FILE IMPORTS release/ ═════════════════════════════════════
   The check `reveal/` proves necessary: it is a root directory that `src/`
   imports from five places, JSON included, so living outside `src/` is not a
   property that protects anything. */
function canonImports() {
  for (const f of FILES) {
    const ast = astOf(f);
    if (!ast) continue;
    visit(ast, (n) => {
      const spec =
        (n.type === "ImportDeclaration" && n.source && n.source.value) ||
        (n.type === "ImportExpression" && n.source && n.source.value) ||
        (n.type === "CallExpression" && n.callee && n.callee.type === "Identifier"
          && n.callee.name === "require" && n.arguments[0] && n.arguments[0].value) ||
        null;
      if (typeof spec !== "string") return;
      const abs = spec.startsWith(".") ? path.resolve(path.dirname(f), spec) : null;
      const hitsRelease = abs
        ? abs.replace(/\\/g, "/").includes("/release/")
        : /(^|\/)release\//.test(spec);
      if (hitsRelease) {
        fault(`${rel(f)}:${n.loc ? n.loc.start.line : "?"} imports ${JSON.stringify(spec)} — `
          + `src/ may not import from release/. THE CANON LINE.`);
      }
    });
  }
}

/* ═══ 2. NO RELEASE-ORIGINATED STRING APPEARS UNDER src/ ═══════════════════
   The set is what a release declares as its OWN. A `promotes.museumRef` is
   NOT in it — that string came FROM the museum and check 3 proves it. */
function ownStrings() {
  const own = new Map();                       /* string -> where it came from */
  const add = (s, where) => {
    if (typeof s !== "string") return;
    const t = s.trim();
    /* a very short token would collide with ordinary prose and the gate would
       stop being usable; ids and refs in this system are longer than this */
    if (t.length < 8) return;
    if (!own.has(t)) own.set(t, where);
  };
  for (const run of runs) {
    /* [2026-08-28] THE RUN'S OWN ID IS NOT A RELEASE STRING, AND THE FIRST RUN
       OF THIS GATE PROVED IT BY FAILING ON IT. A run is named for the single it
       promotes, and the single's name is the MUSEUM's — `coconuts` is the track
       id in `weird-baby.js`, written there long before this file existed.
       Matching it would report the museum for carrying its own word.
       IT IS EXEMPT THE SAME WAY EVERY OTHER QUOTATION IS: because it restates
       the museum, and `restatedResolve()` goes and proves the track id is
       really there. Exempt by evidence. It is NOT skipped — a run whose id does
       not match its own `promotes.track` is a fault. */
    add(run.what, `run ${run.id}.what`);
    for (const r of run.releases || []) {
      add(r.id, `${r.id}`);
      add(r.what, `${r.id}.what`);
      for (const p of r.postings || []) {
        add(p.ref, `${r.id}/${p.surface}.ref`);
        for (const c of (p.outcome && p.outcome.concluded) || []) add(c.said, `${r.id}/${p.surface} conclusion`);
      }
    }
  }
  return own;
}

function canonStrings() {
  const own = ownStrings();
  if (!own.size) return;
  for (const f of FILES) {
    const ast = astOf(f);
    if (!ast) continue;
    visit(ast, (n) => {
      let v = null;
      if (n.type === "Literal" && typeof n.value === "string") v = n.value;
      else if (n.type === "TemplateElement" && n.value) v = n.value.cooked;
      if (typeof v !== "string") return;
      for (const [s, where] of own) {
        if (v.includes(s)) {
          fault(`${rel(f)}:${n.loc ? n.loc.start.line : "?"} carries a release string — `
            + `${JSON.stringify(s.slice(0, 60))} (${where}). THE CANON LINE: a reel `
            + `may quote the museum; the museum may not carry the reel.`);
        }
      }
    });
  }
}

/* ═══ 3. A RESTATED POINTER MUST RESOLVE ══════════════════════════════════
   THIS IS WHAT MAKES `RESTATED` AN EXEMPTION BY EVIDENCE RATHER THAN BY
   PERMISSION. `promotes.museumRef` is a string that lives under `src/` on
   purpose, and check 2 would otherwise be unable to tell it from a leak. It is
   allowed BECAUSE the museum says it first — so the gate goes and reads the
   museum, and a pointer that does not resolve is a fault. */
function restatedResolve() {
  for (const run of runs) {
    const p = run.promotes;
    if (!p) continue;
    if (p.c !== "RESTATED")
      fault(`run ${run.id}: \`promotes\` must be filed RESTATED — it restates the museum.`);
    if (!p.from || !p.museumRef) {
      fault(`run ${run.id}: \`promotes\` needs both \`from\` and \`museumRef\`, or the exemption is a word.`);
      continue;
    }
    const src = path.join(REPO, p.from);
    if (!fs.existsSync(src)) {
      fault(`run ${run.id}: \`promotes.from\` names ${p.from}, which is not on disk.`);
      continue;
    }
    const text = fs.readFileSync(src, "utf8");
    if (!text.includes(p.museumRef)) {
      fault(`run ${run.id}: \`promotes.museumRef\` ${JSON.stringify(p.museumRef)} does not appear in `
        + `${p.from}. A RESTATED pointer that does not resolve turns the gate off.`);
    }
    /* THE RUN'S ID IS EXEMPTED FROM CHECK 2 BECAUSE IT IS THE MUSEUM'S OWN
       TRACK ID. That is a claim, so it is proved here: the id must equal
       `promotes.track`, and that track must really be in the museum's source.
       Without these two lines the exemption above is Ops asserting it. */
    if (!p.track) {
      fault(`run ${run.id}: \`promotes\` needs \`track\` — the museum's own id for the single.`);
    } else {
      if (run.id !== p.track)
        fault(`run ${run.id}: the run id and \`promotes.track\` (${JSON.stringify(p.track)}) differ. `
          + `A run is named for the single it promotes, and that name is the museum's.`);
      if (!text.includes(`"${p.track}"`) && !text.includes(`'${p.track}'`))
        fault(`run ${run.id}: \`promotes.track\` ${JSON.stringify(p.track)} is not an id in ${p.from}.`);
    }
  }
}

/* ═══ 4. SEQUENCE IS REAL, NOT COSMETIC ═══════════════════════════════════
   Mike, 2026-08-28: the four quarters go in order and 2 cannot precede 1. A
   number nothing enforces is a label, so this is a check. UNDECIDED releases
   are not in the sequence and cannot break it. */
function outOfOrder() {
  for (const run of runs) {
    const seqd = (run.releases || []).filter(r => r.seq !== UNDECIDED);
    for (const surface of SURFACE_KEYS) {
      const out = seqd.filter(r => {
        const p = postingOn(r, surface);
        return p && p.state === "out";
      });
      for (const r of out) {
        const earlier = seqd.filter(x => x.seq < r.seq);
        for (const e of earlier) {
          const ep = postingOn(e, surface);
          if (!ep || ep.state !== "out") {
            fault(`run ${run.id}: ${r.id} (seq ${r.seq}) is OUT on ${surface} but `
              + `${e.id} (seq ${e.seq}) is ${ep ? ep.state : "not posted there"}. `
              + `THE QUARTERS GO IN ORDER — 2 cannot precede 1.`);
          }
        }
      }
    }
  }
}

/* ═══ 5. THE HONESTY RULES ════════════════════════════════════════════════
   Mike: a post without numbers reads as NOT YET CHECKED, never as zero, and a
   field nobody fills is worse than no field. So absence is the mechanism and
   an empty container is a fault rather than a shrug. */
function honesty() {
  const seen = new Set();
  for (const run of runs) {
    for (const r of run.releases || []) {
      if (seen.has(r.id)) fault(`${r.id}: duplicate id. An id is identity.`);
      seen.add(r.id);
      if (r.seq !== UNDECIDED && !(Number.isInteger(r.seq) && r.seq > 0))
        fault(`${r.id}: \`seq\` must be a positive integer or null (UNDECIDED).`);
      if (r.seq === UNDECIDED && !r.undecidedNote)
        fault(`${r.id}: is UNDECIDED and says nothing about why. An unplaced release `
          + `carries its ruling or it reads as an oversight.`);
      if (r.source === null && !r.sourceNote)
        fault(`${r.id}: \`source\` is null with no \`sourceNote\`. A blank is not honest.`);
      if ("due" in r) fault(`${r.id}: carries a \`due\` key. THERE IS NO DUE DATE IN THIS SYSTEM.`);

      for (const p of r.postings || []) {
        const st = POSTING_STATES[p.state];
        if (!st) { fault(`${r.id}/${p.surface}: unknown state ${JSON.stringify(p.state)}.`); continue; }
        if (!SURFACE_KEYS.includes(p.surface)) fault(`${r.id}: unknown surface ${JSON.stringify(p.surface)}.`);
        if ("due" in p) fault(`${r.id}/${p.surface}: carries a \`due\` key. THERE IS NO DUE DATE.`);

        if (p.state !== "out" && p.posted)
          fault(`${r.id}/${p.surface}: is ${p.state} and carries \`posted\`. Nothing has gone out.`);
        if (p.state === "out" && !p.posted)
          fault(`${r.id}/${p.surface}: is out and carries no \`posted\`. The day it went is recorded, never derived.`);
        if (p.state !== "out" && p.outcome)
          fault(`${r.id}/${p.surface}: is ${p.state} and carries an outcome. There is nothing to have a number about.`);

        if ("outcome" in p && !p.outcome)
          fault(`${r.id}/${p.surface}: \`outcome\` is present and empty. ABSENT means NOT YET CHECKED; `
            + `an empty one means nothing at all.`);
        const o = p.outcome;
        if (o) {
          if ("readings" in o && (!Array.isArray(o.readings) || !o.readings.length))
            fault(`${r.id}/${p.surface}: \`readings\` is present and empty. Leave it out until there is one.`);
          for (const rd of o.readings || []) {
            if (!rd.on) fault(`${r.id}/${p.surface}: a reading has no \`on\` — the day it was READ.`);
            if (typeof rd.views !== "number")
              fault(`${r.id}/${p.surface}: a reading has no numeric \`views\`.`);
          }
          if ("concluded" in o && (!Array.isArray(o.concluded) || !o.concluded.length))
            fault(`${r.id}/${p.surface}: \`concluded\` is present and empty.`);
          for (const c of o.concluded || []) {
            if (!c.on || !c.said) fault(`${r.id}/${p.surface}: a conclusion needs \`on\` and \`said\`.`);
            if (c.c !== "MIKE" && c.c !== "HOUSE")
              fault(`${r.id}/${p.surface}: a conclusion is MIKE or HOUSE — approval is not authorship.`);
          }
        }
        if (p.ref === null && !p.refNote)
          fault(`${r.id}/${p.surface}: \`ref\` is null with no \`refNote\`. A silent blank is indistinguishable from a bug.`);
        if (p.state === "staged" && p.ref === null)
          notes.push(`${r.id}/${p.surface}: staged, address not supplied`);

        /* [2026-08-28] THE PRECONDITION, CHECKED RATHER THAN HOPED FOR.
           Mike ruled the TikTok account a PRECONDITION and not a task — he sets
           it up, nothing here creates it. A precondition nothing checks is a
           wish, and the failure it prevents is specific: a posting recorded as
           PUBLIC on a surface that has no account is a false entry in the one
           file whose whole job is to be true about what went out.
           IT DOES NOT BLOCK `planned` OR `staged`. Planning a TikTok post
           before the account exists is exactly right, and saying so is the
           point of the state. */
        const sf = surfaceOf(p.surface);
        if (p.state === "out" && sf && sf.account.exists === false) {
          fault(`${r.id}/${p.surface}: is OUT, and the ${p.surface} account does not exist. `
            + `${sf.account.note}`);
        }
        if (p.state === "out" && sf && sf.account.exists === null) {
          fault(`${r.id}/${p.surface}: is OUT, and nobody has said whether the ${p.surface} `
            + `account exists. Ops does not infer it.`);
        }
      }
    }
  }
}

/* ── run ──────────────────────────────────────────────────────────────────── */
canonImports();
canonStrings();
restatedResolve();
outOfOrder();
honesty();

const nReleases = runs.reduce((a, r) => a + (r.releases || []).length, 0);
const nOut = runs.reduce((a, run) => a + (run.releases || [])
  .filter(r => (r.postings || []).some(p => p.state === "out")).length, 0);
const nUndecided = runs.reduce((a, run) => a + (run.releases || [])
  .filter(r => r.seq === UNDECIDED).length, 0);

console.log("THE RELEASE CHECK — the canon line, and what is in the system\n");
console.log(`  runs                  ${runs.length}`);
console.log(`  releases              ${nReleases}`);
console.log(`    sequenced           ${nReleases - nUndecided}`);
console.log(`    UNDECIDED           ${nUndecided}   (held with no slot, on purpose)`);
console.log(`  public on any surface ${nOut}`);
console.log(`  src/ files walked     ${FILES.length}`);
console.log(`  rules declared        ${RULES.length}   (${RULES.filter(r => r.silent).length} that no gate can check)`);

/* THE SURFACES PRINT IN THE RULED ORDER, EVERY RUN. The order is the point and
   a list nobody sees is a list that gets reordered. `release/README.md` carries
   why it is this order; this says what it is. */
console.log(`\n  THE SURFACES — in the ruled order`);
for (const s of SURFACES) {
  const a = s.account;
  const acct = a.exists === false ? "NO ACCOUNT YET"
    : a.exists === null ? "account unstated"
    : a.handle ? `@${a.handle}` : "account exists · handle not supplied (M60)";
  console.log(`    ${s.key.padEnd(10)} ${s.is.padEnd(12)} ${acct}`);
}
console.log(`    handle order asked for: ${HANDLE.preferred.join(" · ")}`);
console.log(`    RETRACTED — "${HANDLE.retractedClaim.said}" ${HANDLE.retractedClaim.status}`);

for (const run of runs) {
  console.log(`\n  ${run.id.toUpperCase()}`);
  for (const r of inOrder(run.releases || [])) {
    const seq = r.seq === UNDECIDED ? " — " : String(r.seq).padStart(3);
    const states = (r.postings || []).map(p => `${p.surface}:${p.state}`).join("  ");
    console.log(`   ${seq}  ${r.id.padEnd(16)} ${states || "no posting anywhere"}`);
  }
}

if (notes.length) {
  console.log(`\n  WITHHELD — counted, because a silent gap is indistinguishable from a bug`);
  for (const n of notes) console.log(`    ${n}`);
}

if (faults.length) {
  console.log(`\n  ${faults.length} FAULT(S)\n`);
  for (const f of faults) console.log(`    ${f}`);
  console.log("");
  if (GATE) process.exit(1);
} else {
  console.log(`\n  PASS — nothing under src/ imports or carries release material, every`);
  console.log(`  RESTATED pointer resolves, the sequence holds, and no field is`);
  console.log(`  present-and-empty.`);
}
