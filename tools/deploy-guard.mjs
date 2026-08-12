/* tools/deploy-guard.mjs — YOU CANNOT PUBLISH THE WRONG STAGE BY ACCIDENT.
   [CH5 2026-08-12]
   ---------------------------------------------------------------------------
   THE DEFECT, MEASURED RATHER THAN FEARED: every deploy this week published the
   DEVELOPMENT stage to weird.baby. `/api/held` on the live site reports
   `stage:"development"`, `/held/robots/art/portal-cover.png` returns 200 to
   anybody, and so does the Portal's channel-4 close-up. Nothing was broken —
   `npm run deploy` did exactly what it says, and what it says is
   `vite build && wrangler deploy`, which builds the DEFAULT stage.

   ═══ THE FIX IS NOT A FLIPPED DEFAULT ══════════════════════════════════════
   `DEFAULT_STAGE` stays `development`. That is Mike's word on the day and this
   file does not touch it — a guard that quietly changed the answer would be the
   same class of error as the deploy it is guarding.
   WHAT CHANGES IS THAT THE STAGE MUST BE *SAID*. `npm run deploy` no longer
   means "publish whatever the default is"; it means "publish development, and I
   know that", and it will not run until somebody has said so once.

   ═══ WHY IT READS THE BUILT WORKER AND NOT ITS OWN ENVIRONMENT ══════════════
   The failure this project has already had once (see `tools/stage-build.mjs`)
   was a build that produced a LAUNCH client and left a DEVELOPMENT worker
   behind, so the two halves disagreed and the only thing on the wire that said
   so was one word in `/api/held`. An env-var check would have passed that build
   happily. So this reads `__WB_STAGE__` out of `dist/weird_baby/index.js` — the
   artifact that is about to be uploaded — and compares it to what the operator
   asked for. It checks the thing being shipped, not the intent.

   ═══ IT ALSO REFUSES A STALE dist/ ══════════════════════════════════════════
   A guard that passes on last week's build is not a guard. If `dist/` is older
   than the newest file in `src/`, `public/` or `reveal/`, it refuses: the most
   likely way to publish the wrong stage is to publish a build nobody made. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEVELOPMENT, LAUNCH } from "../reveal/stage.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORKER = path.join(REPO, "dist", "weird_baby", "index.js");

const want = process.argv.includes("--launch") ? LAUNCH : DEVELOPMENT;
const acknowledged =
  process.argv.includes("--i-know-this-publishes-development") ||
  want === LAUNCH;

const die = (lines) => {
  console.error("\n" + lines.join("\n") + "\n");
  process.exit(1);
};

if (!fs.existsSync(WORKER)) {
  die([
    "deploy REFUSED — there is no built worker at dist/weird_baby/index.js.",
    "",
    "Nothing has been uploaded. Build first:",
    want === LAUNCH ? "      npm run build:launch" : "      npm run build",
  ]);
}

/* the stage as it exists in the artifact about to be shipped */
const src = fs.readFileSync(WORKER, "utf8");
const hasLaunch = /["']launch["']/.test(src);
const hasDev = /["']development["']/.test(src);
const built = hasLaunch && !hasDev ? LAUNCH : hasDev && !hasLaunch ? DEVELOPMENT : null;

if (built === null) {
  die([
    "deploy REFUSED — dist/weird_baby/index.js does not state one stage.",
    `  "launch" present: ${hasLaunch}    "development" present: ${hasDev}`,
    "",
    "This is the half-built-application failure tools/stage-build.mjs describes.",
    "Rebuild from clean and look at the WB_STAGE line it prints.",
  ]);
}

if (built !== want) {
  die([
    `deploy REFUSED — the built worker is ${built.toUpperCase()} and you asked to`,
    `publish ${want.toUpperCase()}.`,
    "",
    "The client and the worker are built by two different vite environments and",
    "have disagreed before. Nothing was uploaded.",
    "",
    want === LAUNCH ? "      npm run build:launch" : "      npm run build",
  ]);
}

/* staleness — a guard that passes on last week's build is not a guard */
const distTime = fs.statSync(WORKER).mtimeMs;
let newest = 0, newestFile = null;
const walk = (rel) => {
  const abs = path.join(REPO, rel);
  if (!fs.existsSync(abs)) return;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const r = rel + "/" + e.name;
    if (e.isDirectory()) { walk(r); continue; }
    const m = fs.statSync(path.join(REPO, r)).mtimeMs;
    if (m > newest) { newest = m; newestFile = r; }
  }
};
["src", "public", "reveal"].forEach(walk);
if (newest > distTime) {
  die([
    "deploy REFUSED — dist/ is older than the source it was built from.",
    `  newest source : ${newestFile}`,
    "  You would be publishing a build nobody made from the tree you are in.",
    "",
    want === LAUNCH ? "      npm run build:launch" : "      npm run build",
  ]);
}

if (!acknowledged) {
  die([
    `deploy REFUSED — this publishes the ${DEVELOPMENT.toUpperCase()} stage.`,
    "",
    "In DEVELOPMENT the pull-back rule is NOT applied. Publishing this puts the",
    "Portal, the held photographs and everything behind the stage door on",
    "weird.baby, readable by anyone. That is what every deploy this week did.",
    "",
    "  To publish the real museum:      npm run deploy:launch",
    "  To publish development anyway:   npm run deploy -- --i-know-this-publishes-development",
    "",
    "DEFAULT_STAGE is unchanged and stays development — that is Mike's word on",
    "the day, not this guard's to move. All this asks is that you say it.",
  ]);
}

console.log(`  deploy-guard OK — built worker is ${built}, and that is what you asked for.`);
