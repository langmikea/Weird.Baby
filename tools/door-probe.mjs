/* ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. */
/* ═══════════════════════════════════════════════════════════════════════════
   door-probe.mjs — DOES THE STAGE DOOR ACTUALLY REFUSE, ON THE WIRE?
   [2026-08-29]
   ---------------------------------------------------------------------------
   WHY THIS EXISTS. Every check in this repository that speaks about the held
   door reads the TREE. `reveal:check`'s reachability pass proves the four
   prefixes are declared in `wrangler.jsonc` and refused in `src/worker.js`; it
   issues no request and cannot. Nothing measured what the deployment answers.
   On 2026-08-29 that gap was the whole question: the tree said 404 and could
   not say what production said.

   IT SENDS NO COOKIE, NO KEY, NO CREDENTIAL. That is the design, not a
   limitation. A browser on the key-holder's machine carries `wb_held` and gets
   200 on every held path — which proves the door opens for a key-holder and
   NOTHING about whether it refuses anybody else. **If this tool ever needs
   `HR_KEY`, it is the wrong tool.** Because it holds nothing, it runs anywhere,
   including on Mike's own host.

   THE PREFIXES ARE READ OUT OF `src/worker.js`, NEVER TYPED HERE. They are
   declared there as `LOCKED_DIRS` and `STAGE_DIRS` and that declaration is what
   the refusal itself reads. A second copy in this file would be a second source
   of truth about which doors exist, and it would drift the first time one moved.

   ═══ THE CONTROL IS THE POINT ══════════════════════════════════════════════
   FOUR 404s ARE WHAT A WORKING DOOR LOOKS LIKE — AND ALSO WHAT AN OUTAGE, A
   DNS FAILURE, A TYPO IN THE HOSTNAME AND A SITE THAT NEVER DEPLOYED LOOK LIKE.
   So one known-public path is requested in the same run and must answer 200. If
   it does not, this reports INCONCLUSIVE rather than PASS, because it has not
   measured the door — it has measured its own inability to reach anything.

   ═══ AND `open` MUST BE FALSE ══════════════════════════════════════════════
   `/api/held` reports whether the caller holds the door open. If it says true,
   something supplied a key and every 404 below is meaningless. That is a
   CONTAMINATED run and it fails saying so.

   THIS IS NOT A GATE AND MUST NOT JOIN §9. It measures the wire; the wire
   changes only on deploy; and a check that needs the network fails on a train.
   Its home is after a deploy.

   Run as `npm run door:check`. `WB_ORIGIN` overrides the origin for testing.
   ═══════════════════════════════════════════════════════════════════════════ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = (process.env.WB_ORIGIN || "https://weird.baby").replace(/\/+$/, "");

/* ── the doors, read from the file that enforces them ─────────────────────── */
function dirsFrom(name, src) {
  const m = new RegExp(`${name}\\s*=\\s*\\[([^\\]]*)\\]`).exec(src);
  if (!m) {
    console.error(`door-probe REFUSED — ${name} not found in src/worker.js.`);
    console.error("The prefixes are read from the file that enforces them; if that");
    console.error("declaration moved or was renamed, this tool is describing a door");
    console.error("that no longer exists and must not report on it.");
    process.exit(2);
  }
  return [...m[1].matchAll(/["']([^"']+)["']/g)].map(x => x[1]);
}

const WORKER_SRC = fs.readFileSync(path.join(REPO, "src", "worker.js"), "utf8");
const PREFIXES = [
  ...dirsFrom("LOCKED_DIRS", WORKER_SRC).map(p => ({ prefix: p, kind: "locked" })),
  ...dirsFrom("STAGE_DIRS", WORKER_SRC).map(p => ({ prefix: p, kind: "stage" })),
];

/* ── one real tracked file per prefix, chosen deterministically ───────────── */
const TRACKED = execFileSync("git", ["-C", REPO, "ls-files", "public"],
  { encoding: "utf8", maxBuffer: 1 << 26 }).split("\n").filter(Boolean).sort();

function sampleFor(prefix) {
  /* a URL prefix maps to `public/<prefix>` when the files are authored; the
     `/assets/…` pair addresses vite's built chunks, which have no source under
     `public/` and therefore no file this tool can name honestly. */
  const under = "public" + prefix;
  const hit = TRACKED.find(f => f.startsWith(under));
  return hit ? "/" + hit.slice("public/".length) : null;
}

/* the control: the first tracked public file that is behind no door at all */
const CONTROL = (() => {
  const doors = PREFIXES.map(p => "public" + p.prefix);
  const hit = TRACKED.find(f => !doors.some(d => f.startsWith(d)) && !f.endsWith(".json"));
  return hit ? "/" + hit.slice("public/".length) : null;
})();

const NO_CREDENTIALS = { redirect: "follow", headers: { "User-Agent": "wb-door-probe" } };

async function probe(url) {
  try {
    const res = await fetch(url, NO_CREDENTIALS);
    const buf = Buffer.from(await res.arrayBuffer());
    return { ok: true, status: res.status, bytes: buf.length,
             type: res.headers.get("content-type") || "—", body: buf };
  } catch (e) {
    return { ok: false, status: null, bytes: 0, type: "—",
             error: (e && e.message) || String(e) };
  }
}

console.log("");
console.log("  DOOR PROBE — cookie-free, against the live wire");
console.log("");
console.log(`    origin      ${ORIGIN}`);
console.log(`    credentials NONE — no cookie, no key, no HR_KEY`);
console.log(`    prefixes    read from src/worker.js: ${PREFIXES.map(p => p.prefix).join("  ")}`);
console.log("");

/* ── 1. the control ───────────────────────────────────────────────────────── */
if (!CONTROL) {
  console.error("door-probe REFUSED — no tracked public file outside every door, so");
  console.error("there is no control to measure against. Without one, four 404s are");
  console.error("indistinguishable from an outage.");
  process.exit(2);
}
const control = await probe(ORIGIN + CONTROL);
console.log("  CONTROL — must answer 200 or this run has measured nothing");
console.log(`    ${String(control.status ?? "ERR").padStart(3)}  ${String(control.bytes).padStart(9)} B  ${control.type}`);
console.log(`         ${CONTROL}`);
if (control.error) console.log(`         ${control.error}`);
console.log("");

/* ── 2. the held samples ──────────────────────────────────────────────────── */
const samples = [];
console.log("  HELD SAMPLES — each must answer 404 to a cookie-free client");
for (const { prefix, kind } of PREFIXES) {
  const p = sampleFor(prefix);
  if (!p) {
    console.log(`    skipped  ${prefix}  — no tracked file under public${prefix} (built chunks only)`);
    continue;
  }
  const r = await probe(ORIGIN + p);
  samples.push({ prefix, kind, path: p, ...r });
  console.log(`    ${String(r.status ?? "ERR").padStart(3)}  ${String(r.bytes).padStart(9)} B  ${r.type}`);
  console.log(`         ${p}   [${kind}]`);
  if (r.error) console.log(`         ${r.error}`);
}
console.log("");

/* ── 3. /api/held ─────────────────────────────────────────────────────────── */
const api = await probe(ORIGIN + "/api/held");
let stage = null, open = null, apiParsed = false;
if (api.ok && api.body) {
  try {
    const j = JSON.parse(api.body.toString("utf8"));
    stage = j.stage ?? null; open = j.open ?? null; apiParsed = true;
  } catch { /* reported below as unparsed */ }
}
console.log("  /api/held — stage is reported without a key; commit is not");
console.log(`    ${String(api.status ?? "ERR").padStart(3)}  stage=${JSON.stringify(stage)}  open=${JSON.stringify(open)}` +
            (apiParsed ? "" : "   (body did not parse as JSON)"));
console.log("");

/* ── 4. the verdict, after everything it measured ─────────────────────────── */
const reasons = [];
if (control.status !== 200) reasons.push(`INCONCLUSIVE — the control ${CONTROL} answered ${control.status ?? "no response"}, not 200. Nothing about the door was measured.`);
if (open === true) reasons.push("CONTAMINATED — /api/held reports open:true, so something supplied a key and every 404 above is meaningless.");
const leaks = samples.filter(s => s.status !== 404);
for (const s of leaks) reasons.push(`LEAK — ${s.path} answered ${s.status ?? "no response"}, expected 404.`);
if (!samples.length) reasons.push("NO SAMPLES — no prefix had a tracked file to request.");

if (reasons.length) {
  const inconclusive = reasons.some(r => r.startsWith("INCONCLUSIVE"));
  console.error(inconclusive ? "INCONCLUSIVE" : "FAIL");
  reasons.forEach(r => console.error("    " + r));
  console.error("");
  process.exit(inconclusive ? 3 : 1);
}

console.log(`PASS — control 200, ${samples.length} held sample(s) 404, open false. Stage on the wire: ${JSON.stringify(stage)}.`);
console.log("");
