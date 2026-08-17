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
     9  THE STAGE            the launch state, tested from outside it

   [V1 2026-08-06] THE NINTH IS THE ANSWER TO "MAKE THE GATE CHECK THE LAUNCH
   STATE RATHER THAN THE CURRENT VIEW." The first eight already did, and by
   construction rather than by a branch — they read source and the tree, and
   neither moves when the stage does. What the ninth adds is the one thing that
   DOES move: it calls the placement rule with a LAUNCH configuration and
   asserts the answer is nothing, and it asserts that the permission door's
   branch in the worker does not mention the stage at all.

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
import { placeRule, STAGE_PREFIX, GOVERNED_PREFIX } from "./placement.mjs";
import { DEFAULT_STAGE, DEVELOPMENT, LAUNCH, STAGES as STAGES_OK } from "./stage.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const R = p => fs.readFileSync(path.join(REPO, p), "utf8");

/* ═══ THE FOUR SHUT PREFIXES, IN TWO PAIRS. [V1 2026-08-06] ═════════════════
   Declared here, asserted against the worker and the routing rules below
   rather than trusted — these constants are the thing under test as much as
   they are the thing testing.
   THE PAIRS ARE NAMED FOR THEIR REASONS AND THE DISTINCTION IS LOAD-BEARING:
   `LOCKED` is the PERMISSION hold (`/hr`), refused in every stage; `STAGE` is
   the hold that ends at launch (the Portal, the machines' photographs), open
   in DEVELOPMENT. Every check below treats them identically — a held thing is
   a held thing — and only check 9 knows there is a difference. */
export const LOCKED_PREFIXES = ["/assets/locked/", "/locked/"];
export const STAGE_PREFIXES = ["/assets/held/", "/held/"];
export const HELD_PREFIXES = [...LOCKED_PREFIXES, ...STAGE_PREFIXES];

/* The public tree's shut directories, in repo terms. */
const HELD_PUBLIC_DIRS = ["public/held/", "public/locked/"];

/* THE FILES THAT ARE ALLOWED TO NAME A SHUT PREFIX, because they ARE the door.
   Everything else in `src/` and `public/` naming one is check 4's fault.
   [V1] `src/lib/placement.js` joins the list and it is the only ADDITION `src/`
   has ever needed: it computes the stage prefix so that no data file has to
   carry one, which is what keeps check 4 able to mean something at all. */
const DOOR_FILES = new Set([
  "src/worker.js",          // the refusal
  "vite.config.js",         // the chunk parking
  "src/lib/placement.js",   // the stage prefix, computed once
  "reveal/reachability.mjs",
]);

/* ── the shut module list, READ OFF vite.config.js ─────────────────────────
   Doctrine 17: one declaration. Those two arrays are what actually decide which
   modules land behind a door, so they are also what decide which modules this
   file treats as shut. A second list here would be a second thing to keep in
   step and one of them would eventually be wrong. */
export function heldModulePrefixes() {
  const src = R("vite.config.js");
  const out = [];
  for (const name of ["LOCKED_PATHS", "HELD_PATHS"]) {
    const m = new RegExp(`const ${name} = \\[([\\s\\S]*?)\\];`).exec(src);
    if (!m) return null;
    out.push(...[...m[1].matchAll(/"([^"]+)"/g)].map(x => x[1]));
  }
  return out;
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
    faults.push("doors: `LOCKED_PATHS` + `HELD_PATHS` in vite.config.js are empty — nothing is parked behind a door.");
  }

  const worker = R("src/worker.js");
  const wrangler = R("wrangler.jsonc");
  for (const p of HELD_PREFIXES) {
    if (!worker.includes(`"${p}"`)) {
      faults.push(
        `doors: src/worker.js does not refuse "${p}". That file is THE LOCK — ` +
        "without the prefix in `HELD_DIRS` the directory is served to anybody.");
    }
    /* [CH5 2026-08-12] A CATCH-ALL COUNTS, AND ONLY A CATCH-ALL.
       The Record's clock is a request-time rule, so documents and `/robots/…`
       pictures had to reach the worker too — and `@cloudflare/vite-plugin`
       REFUSES A BUILD that lists both `/*` and any prefix it covers ("rule '/*'
       makes it redundant"). The enumeration and the catch-all cannot coexist,
       so this check has to be able to read the catch-all.
       IT IS DELIBERATELY THE ONLY SUBSTITUTE ACCEPTED. `"/*"` is the one rule
       that provably routes every path here to the worker; anything narrower
       still has to name itself, because a rule like `/held*` covering `/held/`
       by accident is exactly the reasoning this gate exists to refuse. The
       check is stricter than before in the case that matters: the worker's own
       refusal list is still tested line by line, one line up. */
    const catchAll = /"\/\*"/.test(wrangler);
    if (!catchAll && !wrangler.includes(`"${p}*"`)) {
      faults.push(
        `doors: wrangler.jsonc \`run_worker_first\` does not list "${p}*" and has ` +
        "no `\"/*\"` catch-all either. Workers Assets serves a matching file " +
        "BEFORE invoking the worker, so without one of those the lock is never " +
        "asked and the material is public — with no error anywhere. This is the " +
        "failure that took the API down in test.");
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
      if (!HELD_PUBLIC_DIRS.some(d => hit.startsWith(d))) {
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
       album is behind the door and its cover is on the street.

       ═══ [2026-08-17] AND IT MATCHED ON THE WRONG ONE OF A PICTURE'S TWO
           ADDRESSES — THE FIFTH INSTRUMENT TO DO IT ══════════════════════
       §8's hazard row says it in advance: **a governed picture has two
       addresses, and anything that matches on one of them is wrong.** The DATA
       declares the PUBLIC address (`/robots/…`) and nothing else — that is the
       pull-back's design, and `src/lib/placement.js` computes the held prefix
       from it. Four instruments broke on that in one round in August and were
       given `STAGE_PREFIX`; this check is the fifth, and it broke the first
       time a held module carried governed pictures.

       MEASURED WHEN IT FIRED: the two machines' albums moved into
       `robots-units.js`, and this rule reported **seven photographs "served at
       a public address"** — `mgk-niac-cover.png`, `viiip-v2.png`,
       `output_row.jpg`, `front_screen.png`, `top_monitor.png` and two more.
       **Not one of them exists at a public address.** All seven are under
       `public/held/robots/…` and have been since the pull-back; what the rule
       had found was the STRING, which is the only address the data is allowed
       to name.

       SO THE TEST IS THE DISK AND NOT THE SPELLING. A governed reference is a
       leak when a file actually sits at its public address, and is the
       pull-back working when the file sits behind the door instead. An
       UNGOVERNED reference is judged exactly as before — the house's own
       sleeves and the lobby's photo ID are not addressed twice and a held
       module naming one is still the fault this rule was written for. */
    const PUBLIC_ASSET = /"(\/[\w][\w./-]*\.(png|jpg|jpeg|webp|gif|svg|mp3|mp4|html|pdf))"/gi;
    const onDisk = rel => fs.existsSync(path.join(REPO, "public", rel.replace(/^\//, "")));
    for (const f of files) {
      if (!isHeldModule(f, prefixes)) continue;
      for (const [, ref] of stripComments(R(f)).matchAll(PUBLIC_ASSET)) {
        if (HELD_PREFIXES.some(p => ref.startsWith(p))) continue;
        const governed = ref.startsWith(GOVERNED_PREFIX);
        if (governed && !onDisk(ref) && onDisk(STAGE_PREFIX + ref)) continue;
        faults.push(
          `${f}: a HELD module points at \`${ref}\`, which is served at a public ` +
          "address. Move the file under `public/held/` — the door is already built " +
          "and the material is what it is for." +
          (governed ? " (Governed, and there IS a file at that public address —" +
                      " so this is the twin resolved and still a leak.)" : ""));
      }
    }

    /* ---- 4. A LEAK INWARD ------------------------------------------------
       The other direction, and the one a future round will trip: a public
       file naming a held address puts that address in the public bundle. */
    const pub = walk("public").filter(f => TEXT.test(f));
    for (const f of [...files, ...pub, "index.html"]) {
      if (DOOR_FILES.has(f)) continue;
      if (isHeldModule(f, prefixes)) continue;
      if (HELD_PUBLIC_DIRS.some(d => norm(f).startsWith(d))) continue;
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

  /* ---- 9. THE STAGE [V1 2026-08-06] --------------------------------------
     MIKE: "make the two states switchable and unambiguous, and make the gate
     check the LAUNCH state rather than the current view."

     EVERYTHING ABOVE ALREADY DOES, BY CONSTRUCTION RATHER THAN BY A BRANCH.
     Checks 1–8 read source and the tree, and neither moves when the stage
     does: `HELD_PATHS` parks the Portal's chunk behind the door in both
     stages, the photographs sit under `public/held/` in both, the ledger says
     HELD in both. That is not an accident of the design; it IS the design, and
     it is what makes a development build's gate a statement about launch.

     WHAT IS LEFT IS THE ONE THING THAT DOES MOVE — what `placed()` returns —
     and the only way to test a state you are not in is to CALL the rule with
     that state's configuration. Which is why the rule is a pure function in
     `reveal/placement.mjs` rather than a branch inside the browser module: a
     stage switch whose launch behaviour can only be observed by launching is a
     switch nobody can check.

     AND THE THIRD ASSERTION IS THE ONE THAT WOULD ACTUALLY GET BROKEN. The
     permission door and the stage door are two prefixes in one file, and the
     obvious future edit — "make the stage condition a bit more general" — is
     the edit that hands `/hr` to a build flag. So the worker's LOCKED branch is
     asserted to be free of the stage entirely. */
  {
    if (!STAGES_OK.includes(DEFAULT_STAGE)) {
      faults.push(
        `stage: DEFAULT_STAGE is "${DEFAULT_STAGE}", which is not a stage. The ` +
        "default decides what an ordinary `npm run build` publishes.");
    }

    /* the rule, at launch, on a governed picture nothing delivers */
    const specimen = GOVERNED_PREFIX + "reference/photos/a-picture-nothing-delivers.png";
    const atLaunch = placeRule(specimen, { stage: LAUNCH, publicPaths: new Set() });
    if (atLaunch !== null) {
      faults.push(
        `stage: at LAUNCH, placeRule() answered \`${atLaunch}\` for an undelivered ` +
        "picture of the objects. It must answer nothing at all — an address the " +
        "renderer declines to use is still an address in the bundle, which is " +
        "R5's 153 mp3 URLs with a different file extension.");
    }
    const atDev = placeRule(specimen, { stage: DEVELOPMENT, publicPaths: new Set() });
    if (atDev !== STAGE_PREFIX + specimen) {
      faults.push(
        "stage: in DEVELOPMENT, placeRule() did not put an undelivered picture " +
        `behind the stage door — it answered \`${atDev}\`. Mike's whole ruling is ` +
        "that everything PLACED renders while the museum is being built.");
    }
    /* a delivered picture is public in BOTH stages: the rule runs both ways, as
       `deliveryFaults()` check 2 says it must. */
    for (const stage of [DEVELOPMENT, LAUNCH]) {
      const got = placeRule(specimen, { stage, publicPaths: new Set([specimen]) });
      if (got !== specimen) {
        faults.push(
          `stage: a DELIVERED picture did not resolve to its public address at ` +
          `${stage} — placeRule() answered \`${got}\`.`);
      }
    }

    const worker = R("src/worker.js");
    const lockedBranch = /if \(LOCKED_DIRS\.some[\s\S]*?\n    \}/.exec(worker);
    if (!lockedBranch) {
      faults.push(
        "stage: src/worker.js has no `LOCKED_DIRS` branch this file can read. The " +
        "permission hold is the one door no build flag may open, and this is what " +
        "asserts it.");
    } else if (/__WB_STAGE__/.test(lockedBranch[0])) {
      faults.push(
        "stage: the worker's LOCKED_DIRS branch mentions `__WB_STAGE__`. That door " +
        "is the PERMISSION hold — Hunter Root's wing — and it is refused in every " +
        "stage. A stage condition on it means one word republishes ninety-three of " +
        "his tracks. Read the [V1] header in src/worker.js.");
    }
  }

  return faults;
}
