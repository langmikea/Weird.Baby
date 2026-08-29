/* ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. */
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
   WHAT CHANGES IS THAT THE STAGE MUST BE *SAID*, AND IT IS SAID BY CHOOSING
   THE COMMAND. `npm run deploy:launch` publishes the museum; plain
   `npm run deploy` asks to publish DEVELOPMENT and is refused outright. There
   is no acknowledgement flag and no override of any kind — see the note at
   `acknowledged` below for why the one that used to be printed never worked.

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
/* THERE IS NO OVERRIDE. This was once a flag, and the flag never worked: npm
   appends `--` arguments to the LAST command in an `&&` chain, so
   `npm run deploy -- --i-know-this-publishes-development` handed the flag to
   `wrangler deploy` and never to this file. It was printed as the way through
   for months and was not one. Nothing is lost by deleting it, and a future
   round must not re-add it without first proving npm forwards to this process. */
const acknowledged = want === LAUNCH;

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
/* [2026-08-24] AND vite.config.js, WHICH IS NOT IN ANY OF THEM. It is where the
   epoch, the placement set and the asset schedule reach the bundle — it changed
   in `74223d2`, the epoch move — and until today a session could edit it,
   forget the rebuild, and this guard would pass on a dist that knew nothing
   about the change.
   > **[FLAG 2026-08-24 · named, not fixed] `index.html` IS STILL UNCOVERED AND
   > IS THE LARGER GAP.** It is vite's entry document at the repo root, outside
   > all three walked directories, and it carries the very `<meta>` description
   > tags `src/worker.js` rewrites while the wing is shut. `provenance/`
   > `approvals.json` is uncovered too and matters less — it feeds
   > `__WB_APPROVALS__`, which is `null` at LAUNCH, and a DEVELOPMENT deploy is
   > refused outright below. Ops ruled this round's fix as `vite.config.js`
   > alone; the other two are named here so the next round does not rediscover
   > them by shipping a stale entry document. */
const fileTime = (rel) => {
  const abs = path.join(REPO, rel);
  if (!fs.existsSync(abs)) return;
  const m = fs.statSync(abs).mtimeMs;
  if (m > newest) { newest = m; newestFile = rel; }
};
["vite.config.js"].forEach(fileTime);
if (newest > distTime) {
  die([
    "deploy REFUSED — dist/ is older than the source it was built from.",
    `  newest source : ${newestFile}`,
    "  You would be publishing a build nobody made from the tree you are in.",
    "",
    want === LAUNCH ? "      npm run build:launch" : "      npm run build",
  ]);
}

/* ═══ [2026-08-24] THE CLIENT HALF, WHICH THIS GUARD HAS NEVER LOOKED AT ═════
   Everything above reads `dist/weird_baby/index.js` and nothing else, so a
   LAUNCH worker beside a stale DEVELOPMENT client passed — the mirror image of
   the failure `tools/stage-build.mjs` was written to prevent, and it would have
   published a launched museum drawing an unlaunched view.

   TWO CHECKS, IN THIS ORDER, AND THE ORDER IS THE POINT. First: did both halves
   come from ONE build? Then: which stage is the client? **A stage mismatch is a
   misleading thing to report when the real fault is two builds** — it sends the
   reader looking for a flag when what happened is that half the output is from
   yesterday. Same-build first, stage second.

   ═══ WHY THE WINDOW AND THE REGEX BOTH, AND NEITHER ALONE ══════════════════
   The window survives a minifier upgrade and cannot name a stage. The regex
   names the stage and does not survive a minifier upgrade. Each covers the
   other's blind side.

   ═══ THE REGEX IS DELIBERATELY BRITTLE AND DELIBERATELY SAFE ═══════════════
   The client cannot be read the way the worker can. The worker's artifact holds
   exactly ONE stage token. The client holds **five** `launch` tokens in BOTH
   stages, because `STAGE === "launch"` compiles to a comparison that is present
   either way — so a bare-token test is ambiguous by construction and would
   refuse every build. The one unambiguous marker is the `stage:` PROPERTY of
   the `__WB_PLACEMENT__` object, and its quoting depends on the minifier: the
   client currently emits BACKTICKS (`` stage:`development` ``) while the worker
   emits double quotes. All three styles are accepted here for that reason.
   **AN UNMATCHED PATTERN REFUSES; IT DOES NOT PASS.** So a minifier upgrade
   that changes the quoting fails the deploy loudly rather than waving a stale
   client through. **A LATER ROUND MEETING THAT FAILURE SHOULD WIDEN THE
   PATTERN, NEVER REMOVE THE CHECK** — the check being brittle is what makes it
   honest, and the failure direction is the safe one. */
const CLIENT = path.join(REPO, "dist", "client");
const SAME_BUILD_MS = 120_000;
let clientNewest = 0, clientNewestFile = null;
const walkClient = (rel) => {
  const abs = path.join(REPO, rel);
  if (!fs.existsSync(abs)) return;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const r = rel + "/" + e.name;
    if (e.isDirectory()) { walkClient(r); continue; }
    const m = fs.statSync(path.join(REPO, r)).mtimeMs;
    if (m > clientNewest) { clientNewest = m; clientNewestFile = r; }
  }
};
if (!fs.existsSync(CLIENT)) {
  die([
    "deploy REFUSED — there is no built client at dist/client.",
    "",
    "The worker is only half the output. Nothing was uploaded.",
    "",
    want === LAUNCH ? "      npm run build:launch" : "      npm run build",
  ]);
}
walkClient("dist/client");
if (Math.abs(clientNewest - distTime) > SAME_BUILD_MS) {
  const older = clientNewest < distTime ? "client" : "worker";
  die([
    "deploy REFUSED — the client and the worker are not from the same build.",
    `  worker  : ${new Date(distTime).toISOString()}  dist/weird_baby/index.js`,
    `  client  : ${new Date(clientNewest).toISOString()}  ${clientNewestFile}`,
    `  the ${older} half is the older one, by ${Math.round(Math.abs(clientNewest - distTime) / 1000)}s.`,
    "",
    "This is the half-built-application failure from the other side. The stage",
    "is NOT reported above on purpose: with two builds in dist/ it would name a",
    "stage that describes only one of them.",
    "",
    want === LAUNCH ? "      npm run build:launch" : "      npm run build",
  ]);
}
/* only now is it meaningful to ask which stage the client is */
const STAGE_PROP = /stage\s*:\s*["'`](launch|development)["'`]/;
let clientStage = null;
for (const f of fs.readdirSync(path.join(CLIENT, "assets")).filter(f => f.endsWith(".js"))) {
  const m = STAGE_PROP.exec(fs.readFileSync(path.join(CLIENT, "assets", f), "utf8"));
  if (m) { clientStage = m[1]; break; }
}
if (clientStage === null) {
  die([
    "deploy REFUSED — the client's stage could not be read from dist/client.",
    "",
    "The pattern looks for the `stage:` property of __WB_PLACEMENT__ in any of",
    "three quote styles. Not finding it most likely means the minifier's output",
    "shape changed. WIDEN THE PATTERN IN tools/deploy-guard.mjs — do not delete",
    "the check. Refusing is the safe direction; passing an unread client is not.",
  ]);
}
if (clientStage !== want) {
  die([
    `deploy REFUSED — the built CLIENT is ${clientStage.toUpperCase()} and you asked`,
    `to publish ${want.toUpperCase()}.`,
    "",
    "The worker is correct and the client is not, so this is not a stale dist —",
    "it is two halves built from two different stages. Nothing was uploaded.",
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
    "  There is no override. This refusal cannot be acknowledged past.",
    "",
    "DEFAULT_STAGE is unchanged and stays development — that is Mike's word on",
    "the day, not this guard's to move. There is no flag that changes this.",
  ]);
}

console.log(`  deploy-guard OK — worker and client are both ${built}, from one build, and that is what you asked for.`);
