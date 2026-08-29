/* ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. */
/* tools/stage-build.mjs — BUILD THE LAUNCH STATE. [V1 2026-08-06]
   ---------------------------------------------------------------------------
   `WB_STAGE=launch vite build` is one line on a Mac and three different lines
   on Windows depending on which shell npm happens to spawn. Mike runs every
   build host-side in PowerShell, so the flag is a node wrapper rather than a
   shell prefix and rather than a new dependency.

   ═══ IT SPAWNS THE CLI, AND THE FIRST CUT CALLED THE API AND WAS WRONG ══════
   The obvious version of this file is four lines: set `process.env.WB_STAGE`,
   `await build()` from vite's node API, done. It ran clean, printed a full
   chunk table, and **built half the application.** This project has TWO vite
   environments — the client and the Cloudflare worker — and the worker one is
   registered by `@cloudflare/vite-plugin` as a multi-environment builder that
   only the CLI drives. `build()` builds the client and returns happily.

   THE SYMPTOM WAS AS SMALL AS IT GETS AND THE CONSEQUENCE IS NOT. The client
   came out in the LAUNCH state — the twenty-six withheld photographs gone from
   the bundle — while `dist/weird_baby/index.js` was left over from the previous
   DEVELOPMENT build, so the worker's `__WB_STAGE__` still read `development`
   and both stage doors stood open. `npm run deploy:launch` would have published
   a launched museum with its doors wired open, and the only thing on the wire
   that said so was one word in `/api/held`. Caught by checking the wire instead
   of the console — the same way H1's `run_worker_first` outage was caught, and
   the same lesson: **a build that builds half the app looks like a build.**

   So it spawns the same CLI `npm run build` spawns, with the variable in the
   child's environment. The stage itself is not decided here — `reveal/stage.mjs`
   is the declaration and its header is the ruling; this only supplies the word,
   and PRINTS it, because "make the two states switchable and unambiguous" is
   most of the instruction and a build that does not say which state it is is
   exactly the ambiguity. */
import { spawn } from "node:child_process";
import { readStage, LAUNCH } from "../reveal/stage.mjs";

const env = { ...process.env };
if (process.argv.includes("--launch")) env.WB_STAGE = LAUNCH;
const stage = readStage(env);
console.log(`\n  WB_STAGE = ${stage}\n`);

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["vite", "build"],
  { env, stdio: "inherit", shell: process.platform === "win32" },
);
child.on("exit", (code) => process.exit(code ?? 1));
