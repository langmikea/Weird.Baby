/* tools/dev-launch.mjs — THE DEV SERVER IN THE LAUNCH STAGE, FOR A LOOK. [2026-09-18]
   `npm run dev` is the development stage, where every wing stands open, so the
   shut lobby cannot be looked at on it. This is the same server with
   `WB_STAGE=launch` in the child's environment (a node wrapper for the reason
   `tools/stage-build.mjs` gives: the shell prefix is three different lines on
   Windows). No worker runs here, so the page falls back to this PC's clock.
   It looks; it proves nothing about the door. `npm run door:check` does that. */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = { ...process.env, WB_STAGE: "launch" };
const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["vite", "--port", "5198", "--strictPort"],
  { env, stdio: "inherit", shell: process.platform === "win32", cwd: REPO },
);
child.on("exit", (code) => process.exit(code ?? 1));
