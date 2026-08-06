/* ===========================================================================
   A HELD THING MUST BE UNREACHABLE, AND THIS IS WHAT PROVES IT.
   [H1 2026-08-06 — THE PORTAL HOLD]
   ---------------------------------------------------------------------------
   MIKE: "a held thing must be UNREACHABLE BY A VISITOR and the gate must FAIL
   if that stops being true."

   THE INSTRUCTION IS THE WHOLE DESIGN BRIEF, AND ITS SECOND HALF IS THE HARD
   ONE. The ledger has carried `state: "HELD"` since v52 and it was a WORD: a
   row said it was held, and nothing anywhere asked the tree whether that was
   still so. A wing could be un-lazied, a picture moved out of the held tree, a
   routing rule dropped from `wrangler.jsonc` — and the row would go on saying
   HELD, truthfully at the moment it was written and falsely from then on. That
   is the exact shape of every failure this repository has paid for: R5's 153
   mp3 URLs, H1's `run_worker_first` outage, `MANUAL_PAGES = 24`. A claim that
   nothing re-checks is a claim that expires quietly.

   SO NOTHING HERE READS A ROW'S OPINION OF ITSELF EXCEPT TO CONTRADICT IT.
   Every other check reads the working tree: the worker's refusal list, the
   routing rules, vite's held-chunk list, the module graph's own literals and
   the files on disk. Eight checks, and each one is a different way for the
   boundary to break.

     1  SELF-CONTRADICTION   a HELD row that says how a visitor gets there
     2  A LEAK OUTWARD       a held module pointing at a public file
     3  THE DOORS            worker + wrangler + vite still agree on the prefixes
     4  A LEAK INWARD        a public file pointing at held material
     5  THE CARRIER          a BUILT held row must live behind a door
     6  A PUBLIC ADDRESS     a held row naming a file outside the held tree
     7  THE ROUTE            a held route must be wrapped on the router
     8  THE PROJECTION       this table itself does not travel to the browser

   THE EIGHTH WAS NOT IN THE DESIGN. It exists because proving the first seven
   meant reading the built bundle, and the bundle turned out to be carrying THIS
   FILE'S OWN SUBJECT MATTER — 162 ledger rows, every note, both eggs — out of
   one JSON import in `src/lib/reveal.js`. The register of what the museum holds
   and does not show was the largest unheld thing on the site.

   WHAT IT CANNOT DO, stated here because a gate described as proof becomes
   one. It cannot tell you a held thing is SECRET — the material is refused by
   the worker, and the worker is the lock; this checks that the lock is still
   wired to the door. It cannot see a photograph's contents, so a held picture
   composited into a public one is invisible to it (that is `assets.json` plus
   a person looking). And it reads SOURCE, not the built bundle: the build's own
   `heldChunkGuard` is the half that proves the chunking, and neither replaces
   the other.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { publicLedger, PUBLIC_FIELDS } from "./public-view.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const R = p => fs.readFileSync(path.join(REPO, p), "utf8");

/* THE TWO HELD PREFIXES. Declared here, asserted against the worker and the
   routing rules below rather than trusted — this constant is the thing under
   test as much as it is the thing testing. */
export const HELD_PREFIXES = ["/assets/held/", "/held/"];

/* The public tree's held directory, in repo terms. */
const HELD_PUBLIC_DIR = "public/held/";

/* THE FILES THAT ARE ALLOWED TO NAME A HELD PREFIX, because they ARE the door.
   Everything else in `src/` and `public/` naming one is check 4's fault. */
const DOOR_FILES = new Set([
  "src/worker.js",          // the refusal
  "vite.config.js",         // the chunk parking
  "reveal/reachability.mjs",
]);

/* ── the held module list, READ OFF vite.config.js ─────────────────────────
   Doctrine 17: one declaration. `HELD_PATHS` is what actually decides which
   modules land behind the door, so it is also what decides which modules this
   file treats as held. A second list here would be a second thing to keep in
   step and one of them would eventually be wrong. */
export function heldModulePrefixes() {
  const src = R("vite.config.js");
  const m = /const HELD_PATHS = \[([\s\S]*?)\];/.exec(src);
  if (!m) return null;
  return [...m[1].matchAll(/"([^"]+)"/g)].map(x => x[1]);
}

const norm = s => String(s).replace(/\\/g, "/");

function walk(dir, out = []) {
  const abs = path.join(REPO, dir);
  if (!fs.existsSync(abs)) return out;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = dir + "/" + e.name;
    if (e.isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}

const TEXT = /\.(m?js|jsx|ts|tsx|json|css|html)$/i;

/* ═══ COMMENTS ARE NOT THE BUNDLE, AND THE FIRST CUT OF CHECK 4 DID NOT KNOW IT.
   Run against the live tree it reported nine faults and every one of them was a
   NOTE — `src/lib/held.js` explaining what `/assets/held/` is, `HeldWing.jsx`
   explaining why it is not the lock, this round's own headers. A gate whose
   output is nine false positives is a gate somebody turns off.
   So the scan strips comments first. It is a lexer's job done with a regex and
   that is stated rather than hidden: it walks the file once, tracking whether it
   is inside a string, a template literal or a comment, which is enough for this
   codebase and cannot mistake `https://` for a line comment the way a bare
   `//.*$` does. What it deliberately does NOT do is evaluate anything — a path
   assembled by concatenation is invisible to it, and that hole is real. */
function stripComments(src) {
  let out = "", i = 0, n = src.length;
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === "/" && d === "*") {
      const end = src.indexOf("*/", i + 2);
      i = end < 0 ? n : end + 2;
      out += " ";
    } else if (c === "/" && d === "/") {
      const end = src.indexOf("\n", i);
      i = end < 0 ? n : end;
      out += " ";
    } else if (c === '"' || c === "'" || c === "`") {
      const q = c;
      out += c; i++;
      while (i < n) {
        out += src[i];
        if (src[i] === "\\") { i++; if (i < n) out += src[i]; i++; continue; }
        if (src[i] === q) { i++; break; }
        i++;
      }
    } else {
      out += c; i++;
    }
  }
  return out;
}

/* every module under `src/` (plus the two config files a build reads) */
function sourceFiles() {
  return walk("src").filter(f => TEXT.test(f));
}

const isHeldModule = (rel, prefixes) =>
  prefixes.some(p => ("/" + norm(rel)).includes(p));

/* ═══ THE CHECKS ═══════════════════════════════════════════════════════════ */
export function reachabilityFaults(rows) {
  const faults = [];
  const bad = (id, msg) => faults.push(`${id}: ${msg}`);
  const prefixes = heldModulePrefixes();

  /* ---- 3. THE DOORS ------------------------------------------------------
     Run first, because every other check is meaningless if the lock is not
     wired. Each of the three files states the arrangement in its own syntax
     and all three have to agree; the H1 outage happened because two of them
     did and the third had a list nobody re-read. */
  if (prefixes === null) {
    faults.push(
      "doors: vite.config.js has no `HELD_PATHS` array this file can read. The " +
      "held-module list is derived from it (Doctrine 17), so a rename there " +
      "silently empties every module check below. Repoint `heldModulePrefixes()`.");
  } else if (!prefixes.length) {
    faults.push("doors: `HELD_PATHS` in vite.config.js is empty — nothing is parked behind the door.");
  }

  const worker = R("src/worker.js");
  const wrangler = R("wrangler.jsonc");
  for (const p of HELD_PREFIXES) {
    if (!worker.includes(`"${p}"`)) {
      faults.push(
        `doors: src/worker.js does not refuse "${p}". That file is THE LOCK — ` +
        "without the prefix in `HELD_DIRS` the directory is served to anybody.");
    }
    if (!wrangler.includes(`"${p}*"`)) {
      faults.push(
        `doors: wrangler.jsonc \`run_worker_first\` does not list "${p}*". Workers ` +
        "Assets serves a matching file BEFORE invoking the worker, so without " +
        "this rule the lock is never asked and the material is public — with no " +
        "error anywhere. This is the failure that took the API down in test.");
    }
  }

  /* ---- 1. SELF-CONTRADICTION --------------------------------------------- */
  for (const r of rows) {
    if (r.state === "HELD" && r.reach) {
      bad(r.id, `HELD and reachable — \`reach\` says "${r.reach}". A held thing is ` +
        "one a visitor cannot get to; this row is the museum writing down how they " +
        "can. Either the thing is not held, or the reach is stale.");
    }
  }

  /* ---- 6. A PUBLIC ADDRESS ----------------------------------------------- */
  for (const r of rows) {
    if (r.state !== "HELD") continue;
    const where = norm(r.where || "");
    const m = where.match(/public\/[\w./-]+/g) || [];
    for (const hit of m) {
      if (!hit.startsWith(HELD_PUBLIC_DIR)) {
        bad(r.id, `HELD and names \`${hit}\`, which ships to a public address. ` +
          "Anything under `public/` outside `public/held/` is fetchable by anyone " +
          "who types the path — taking a picture off a page does not take it off " +
          "the server.");
      }
    }
  }

  if (prefixes && prefixes.length) {
    const files = sourceFiles();

    /* ---- 2. A LEAK OUTWARD ---------------------------------------------
       A held module that points at a public file is the hold half-done: the
       album is behind the door and its cover is on the street. */
    const PUBLIC_ASSET = /"(\/[\w][\w./-]*\.(png|jpg|jpeg|webp|gif|svg|mp3|mp4|html|pdf))"/gi;
    for (const f of files) {
      if (!isHeldModule(f, prefixes)) continue;
      for (const [, ref] of stripComments(R(f)).matchAll(PUBLIC_ASSET)) {
        if (!HELD_PREFIXES.some(p => ref.startsWith(p))) {
          faults.push(
            `${f}: a HELD module points at \`${ref}\`, which is served at a public ` +
            "address. Move the file under `public/held/` — the door is already built " +
            "and the material is what it is for.");
        }
      }
    }

    /* ---- 4. A LEAK INWARD ------------------------------------------------
       The other direction, and the one a future round will trip: a public
       file naming a held address puts that address in the public bundle. */
    const pub = walk("public").filter(f => TEXT.test(f));
    for (const f of [...files, ...pub, "index.html"]) {
      if (DOOR_FILES.has(f)) continue;
      if (isHeldModule(f, prefixes)) continue;
      if (norm(f).startsWith(HELD_PUBLIC_DIR)) continue;
      if (!fs.existsSync(path.join(REPO, f))) continue;
      const body = stripComments(R(f));
      for (const p of HELD_PREFIXES) {
        if (body.includes(p)) {
          faults.push(
            `${f}: a PUBLIC file names the held prefix \`${p}\`. A held thing's ` +
            "address does not belong in a chunk everybody downloads — the door " +
            "supplies it in the event detail (see src/data/artists/portal.js).");
        }
      }
    }

    /* ---- 5. THE CARRIER --------------------------------------------------
       Only BUILT held rows: a NOT_BUILT thing is unreachable because there is
       nothing to reach, and demanding a carrier for it would be asking where
       we keep something that does not exist. */
    for (const r of rows) {
      if (r.state !== "HELD") continue;
      if (r.build !== "LIVE" && r.build !== "PARTIAL") continue;
      const where = norm(r.where || "");
      const src = (where.match(/src\/[\w./-]+\.(m?jsx?|json|css)/g) || []);
      for (const hit of src) {
        if (!isHeldModule(hit, prefixes)) {
          bad(r.id, `built, HELD, and carried by \`${hit}\` — which is NOT in ` +
            "`HELD_PATHS` (vite.config.js), so its code and every string in it ship " +
            "in a chunk the public fetches. A boolean in a public module stops the " +
            "render and publishes the material anyway.");
        }
      }
    }
  }

  /* ---- 7. THE ROUTE ------------------------------------------------------
     A held row whose `where` is a route must be wrapped on the router. It is a
     weaker statement than the worker's refusal on purpose — `HeldWing` is not
     the lock — but an unwrapped held route renders in full to anybody, which
     no amount of chunk parking fixes. */
  const app = R("src/App.jsx");
  const routeLine = p => {
    const re = new RegExp(`path=\\"${p.replace(/\//g, "\\/")}\\"([^\\n]*)`, "");
    const m = re.exec(app);
    return m ? m[0] : null;
  };
  for (const r of rows) {
    if (r.state !== "HELD") continue;
    const w = (r.where || "").trim();
    if (!/^\/[a-z0-9/-]*$/.test(w)) continue;
    const line = routeLine(w);
    if (!line) continue;                        // not a route in this table
    if (!line.includes("<HeldWing>")) {
      bad(r.id, `HELD, and \`${w}\` is a route in src/App.jsx that is NOT wrapped ` +
        "in `<HeldWing>` — it renders in full to anybody who types it. A route a " +
        "visitor can open is not held; either wrap it or stop calling it held.");
    }
  }

  /* ---- 8. THE LEDGER'S OWN PROJECTION ------------------------------------
     `src/lib/reveal.js` imports this table for one LIVE / NOT BUILT column, and
     the table is the museum's record of what it holds and does not show. The
     strip that keeps the private half out of the public bundle is a vite
     plugin, which means it is a line in a config file — exactly the kind of
     line that gets reordered, renamed or dropped in a refactor with no symptom
     anywhere. So it is asserted here, both halves: that the plugin exists AND
     is mounted, and that the function it calls really does drop what it says. */
  {
    const vite = R("vite.config.js");
    if (!/name:\s*"reveal-ledger-public"/.test(vite)
      || !/plugins:\s*\[[^\]]*\brevealPublic\b/.test(vite)) {
      faults.push(
        "ledger: the `reveal-ledger-public` plugin is missing from vite.config.js " +
        "or is not in the `plugins` array. Without it `src/lib/reveal.js` ships " +
        "the WHOLE ledger — every name, note and dependency, including the eggs " +
        "whose only written form is that file — in a chunk every visitor " +
        "downloads. Measured at 64 KB and two spent eggs the day it was found.");
    }
    const raw = JSON.parse(R("reveal/ledger.json"));
    const kept = new Set(PUBLIC_FIELDS);
    const leaked = new Set();
    for (const r of publicLedger(raw).rows) {
      for (const k of Object.keys(r)) if (!kept.has(k)) leaked.add(k);
    }
    if (leaked.size) {
      faults.push(
        `ledger: publicLedger() is passing ${[...leaked].join(", ")} through to ` +
        "the browser. The allowlist in reveal/public-view.mjs is the whole of " +
        "that rule — a field that is not in it does not travel.");
    }
  }

  return faults;
}
