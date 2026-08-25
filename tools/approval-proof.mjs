#!/usr/bin/env node
/* ===========================================================================
   npm run approval:proof — prove the mark cannot render at launch. [2026-08-13]

   ═══ [2026-08-25] IT WOULD REPORT INCONCLUSIVE AND EXIT 1 TODAY, AND THE
   RECORDED "PROVED" WAS TWO OF THREE TELLS ══════════════════════════════════
   READ OFF THE CODE PATH BELOW, NOT RUN — this file shells out to
   `build:launch`, and the round that established it was read-only.

   The third tell is a route -> date pair out of `approvals.json`. The `define`
   in `vite.config.js` puts only pages whose status is `approved` into the map,
   and **nothing is approved today** — `approve:check` is 11 of 11 red — so the
   development map is `{}` and that pair is in NEITHER bundle. The `WEAK` branch
   below then reports INCONCLUSIVE and exits 1. **Tells 1 and 2 still pass**: in
   development `__WB_APPROVALS__` is `{}`, which is truthy, so the component
   survives and its tooltip and z-index are both in the bundle.

   **THAT IS THIS FILE WORKING, NOT FAILING.** `WEAK` exists precisely so a term
   that has stopped matching reports INCONCLUSIVE instead of passing.

   AND THE 2026-08-14 READING RECORDED AS `PROVED` IN
   `docs/MUSEUM_FRIDAY_LOG-20260814.md` WAS **TWO OF THREE**: no page was signed
   until 08-16, so the third tell was skipped — this file printed the NOTE
   saying so, and the log's one-word entry did not carry it. The launch fold
   itself is not in doubt; `__WB_APPROVALS__` is the literal `null` at LAUNCH and
   two independent tells were measured absent. **What is not currently proved is
   the third tell, and it cannot be until a page is signed.**
   ---------------------------------------------------------------------------
   MIKE, 2b: *"DEVELOPMENT ONLY. It must never render at launch. Prove it
   against a launch build."*

   A claim about a build is proved by reading THAT BUILD'S OWN OUTPUT, which is
   the shape `wb-dev-mark-guard` already established: reason about the artifact,
   not about the source that produced it. Compiled JavaScript is the only
   witness that counts.

   It builds BOTH stages and compares, because "absent from the launch bundle"
   is only evidence if the same string is PRESENT in the development one —
   otherwise a typo in the search would read as a pass.
   =========================================================================== */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const OUT = path.join(REPO, "dist", "client");

/* ═══ THE TELLS MUST BE THINGS ONLY THIS COMPONENT PRODUCES ══════════════════
   THE FIRST CUT OF THIS FILE FAILED ITS OWN BUILD AND BOTH FAILURES WERE THE
   TEST'S, WHICH IS WHY THEY ARE WRITTEN DOWN RATHER THAN QUIETLY CORRECTED:

     · `WeirdBaby_PhotoID.png` reported FAIL. It is in the launch bundle and
       always should be — it is the HOUSE MARK, on the Lobby, the robots front
       desk and the /wb album cover (M63 names all three). Searching for it
       tests whether the museum has a logo, not whether the approval mark
       shipped.
     · `__WB_APPROVALS__` reported WEAK — in neither bundle. Correct, and it
       proves nothing: `define` SUBSTITUTES the identifier, so the name itself
       never survives to any output in any stage.

   A tell has to be unique to this component AND present in development, which
   is what the WEAK branch below exists to enforce. These three are:
     · the tooltip, a sentence nothing else in the museum says;
     · the z-index, a number nothing else uses;
     · a route→date pair out of Mike's own approvals file, a shape that exists
       only in the map this component reads. */
const approvals = JSON.parse(
  fs.readFileSync(path.join(REPO, "provenance", "approvals.json"), "utf8")).approvals || {};
const signed = Object.entries(approvals)[0];

/* ═══ AND THEY ARE REGEXES, BECAUSE THE MINIFIER REWRITES LITERALS ══════════
   Two more of these failed as plain substrings, and reading the bundle rather
   than guessing again is what settled it:
     · `2147483000` is emitted as `zIndex:2147483e3` — numeric literals are
       re-expressed in exponent form.
     · `"/booth":"2026-08-13"` is emitted as ``"/booth":`2026-08-13` `` — string
       VALUES become template literals while object KEYS stay quoted.
   The quoting is the minifier's business and may change again. The WEAK branch
   below is what makes that safe: a term that stops matching reports INCONCLUSIVE
   instead of passing, so this file can never quietly stop testing anything. */
const TELLS = [
  ["the mark's tooltip", /Approved by Mike on/],
  ["the mark's z-index", /zIndex:\s*(?:2147483000|2147483e3)/],
  ...(signed ? [["a signature from the map",
    new RegExp(`"${signed[0].replace(/[/]/g, "\\/")}"\\s*:\\s*["'\`]${signed[1].at}`)]] : []),
];
if (!signed) {
  console.log("NOTE: no page is signed, so the map is empty in BOTH stages and the");
  console.log("third tell is skipped. Sign one page and re-run for the full proof.\n");
}

function build(stage) {
  execFileSync("npm", ["run", stage === "launch" ? "build:launch" : "build"], {
    cwd: REPO, stdio: ["ignore", "pipe", "pipe"], shell: true,
  });
  const js = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.js$/.test(e.name)) js.push(fs.readFileSync(p, "utf8"));
    }
  };
  walk(OUT);
  return { text: js.join("\n"), files: js.length };
}

console.log("building DEVELOPMENT…");
const dev = build("development");
console.log(`  ${dev.files} js files, ${(dev.text.length / 1024).toFixed(0)} KB`);
console.log("building LAUNCH…");
const launch = build("launch");
console.log(`  ${launch.files} js files, ${(launch.text.length / 1024).toFixed(0)} KB`);
console.log("");

let bad = 0, weak = 0;
for (const [what, tell] of TELLS) {
  const inDev = tell.test(dev.text);
  const inLaunch = tell.test(launch.text);
  if (inLaunch) {
    bad++;
    console.log(`  FAIL  ${what.padEnd(24)} ${tell} IS IN THE LAUNCH BUNDLE`);
  } else if (!inDev) {
    weak++;
    console.log(`  WEAK  ${what.padEnd(24)} ${tell} is in neither bundle — this `
      + `proves nothing; the term is wrong or the mark is not built at all`);
  } else {
    console.log(`  ok    ${what.padEnd(24)} in development, absent at launch`);
  }
}

/* AND THE COMPONENT'S OWN NAME. Minified builds rename functions, so this is a
   supporting reading rather than the proof — reported as such. */
const nameInLaunch = /ApprovalMark/.test(launch.text);
console.log(`  ${nameInLaunch ? "note " : "ok   "} the identifier "ApprovalMark" is `
  + `${nameInLaunch ? "still" : "not"} in the launch bundle `
  + `(minification renames, so this is supporting evidence, not the proof)`);

console.log("");
if (bad) {
  console.log(`REFUSED — ${bad} tell(s) of the approval mark survive into the launch bundle.`);
  process.exit(1);
}
if (weak) {
  console.log(`INCONCLUSIVE — ${weak} check(s) found their term in NEITHER bundle, so`);
  console.log("they cannot distinguish 'stripped' from 'never there'. Fix the terms.");
  process.exit(1);
}
console.log("PROVED — every tell of the approval mark is present in the development");
console.log("bundle and absent from the launch bundle. It cannot reach a visitor.");
