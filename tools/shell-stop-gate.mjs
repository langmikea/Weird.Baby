/* ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. */
/* ═══════════════════════════════════════════════════════════════════════════
   shell-stop-gate.mjs — A TRACKED FILE THAT NAMES A DEPLOY MUST BE INERT TO A
   SHELL.
   [2026-08-29]
   ---------------------------------------------------------------------------
   WHY THIS EXISTS, AND IT IS ONE MEASURED PUBLISH RATHER THAN A WORRY. On
   2026-08-29 a `node -e` string broke out of its shell quoting, bash was handed
   repo files, and the museum published at 14:03:26.328Z. The entry point was
   never recovered and is not expected to be.

   WHAT THE SWEEP THAT FOLLOWED ESTABLISHED: **markdown inline code is
   backtick-delimited and a backtick is command substitution**, so an ordinary
   sentence like *run `npm run deploy:launch`* EXECUTES when bash is handed the
   file. Of the 70 tracked files in both repositories that mention a deploy
   invocation, **eight fired one** — `docs/DEPLOYED.md`, three round logs, and
   four `tools/*.mjs` whose header comments carry backticked commands.

   THE EXPOSURE IS BASH-SPECIFIC AND THAT IS MEASURED, NOT ASSUMED. PowerShell
   refuses a non-`.ps1` to `-File`, and its backtick is an ESCAPE character
   rather than substitution: the same lines are inert under `pwsh`. `$( )` is
   not, so this gate's pattern set is about bash and would need a second pass to
   speak about PowerShell.

   ═══ THE RULE ══════════════════════════════════════════════════════════════
   A tracked file that contains a deploy invocation must carry a SHELL-STOP —
   an unbalanced `)` inside a comment its own syntax ignores — within its first
   few lines, above anything it needs to protect:

       markdown   an HTML comment opening with a close-paren
       js / mjs   a block comment opening with a close-paren, on line 2 when a
                  shebang holds line 1

   The exact forms are printed by this gate when it fails; they are not spelled
   out here because a literal block-comment terminator inside this comment ends
   it early, which is a defect this repository has now recorded five times.

   Bash aborts on the parenthesis before reaching a single command. The file
   renders and parses exactly as it did.

   ═══ THERE IS NO EXCEPTIONS LIST, DELIBERATELY ═════════════════════════════
   An exceptions list teaches the next round that exceptions are normal, and it
   costs more than the two or three lines it saves. If this gate wants an
   exception, the guard step is incomplete — guard the file.

   Exit 1 on any unguarded hit, naming every path. Run as
   `npm run shellstop:gate`.
   ═══════════════════════════════════════════════════════════════════════════ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const MUSEUM = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROBOTS = path.resolve(MUSEUM, "..", "weird-baby-robots");

/* A deploy invocation in any form a shell would reach. */
const DEPLOY = /deploy:launch|deploy:relaunch|wrangler\s+deploy|npm\s+run\s+deploy|npx\s+wrangler/i;

/* ═══ THE PREDICATE IS POSITION, NOT MENTION, AND THAT WAS MEASURED ════════
   "Contains a deploy invocation" is the wrong test and cannot be satisfied:
   `package.json` names `deploy:launch` as a script key and JSON carries no
   comment, so no guard can be put in it. The test is whether the occurrence
   sits where bash would RUN it — inside backticks, which are command
   substitution, or opening a line, which is a command.

   Measured against the eight the dynamic sweep proved fire: this predicate
   catches all eight, misses none, and does not flag `package.json`.

   IT IS DELIBERATELY WIDER THAN WHAT FIRES TODAY. 61 files match it and only
   eight fired, because bash aborts at the first syntax error and most files
   have one above their deploy line. That is safety by luck: the abort point
   moves whenever prose above it is edited, which is exactly how a line can arm
   itself with nobody touching it. A gate that trusted today's abort points
   would pass a file into danger on its next edit. */
function executablePosition(text) {
  for (const line of text.split("\n")) {
    if (!DEPLOY.test(line)) continue;
    if (/^\s*(npm|npx|wrangler)\b/.test(line)) return true;
    for (const m of line.matchAll(/`([^`]*)`/g)) if (DEPLOY.test(m[1])) return true;
  }
  return false;
}

/* The guard must be near the top — a stop below the command it guards is not a
   stop. Ten lines is generous and still unambiguous. */
const HEAD_LINES = 10;
const GUARD = /SHELL-STOP/;

const repos = [
  { label: "weird-baby-museum", root: MUSEUM },
  { label: "weird-baby-robots", root: ROBOTS },
];

const offenders = [];
let scanned = 0, matched = 0;
const missingRepos = [];

for (const repo of repos) {
  if (!fs.existsSync(path.join(repo.root, ".git"))) { missingRepos.push(repo.label); continue; }
  let files;
  try {
    files = execFileSync("git", ["-C", repo.root, "ls-files"], { encoding: "utf8", maxBuffer: 1 << 26 })
      .split("\n").filter(Boolean);
  } catch (e) {
    console.error(`shell-stop gate REFUSED — cannot list ${repo.label}: ${e && e.message}`);
    process.exit(1);
  }
  for (const rel of files) {
    const abs = path.join(repo.root, rel);
    let buf;
    try { buf = fs.readFileSync(abs); } catch { continue; }   /* deleted mid-run */
    scanned++;
    const text = buf.toString("utf8");
    if (!DEPLOY.test(text)) continue;
    if (!executablePosition(text)) continue;
    matched++;
    const head = text.split("\n", HEAD_LINES).join("\n");
    if (!GUARD.test(head)) offenders.push(`${repo.label}/${rel}`);
  }
}

console.log("");
console.log("  SHELL-STOP GATE");
console.log("");
console.log(`    ${scanned.toLocaleString("en-US")} tracked file(s) scanned · ${matched} name a deploy · ${offenders.length} unguarded`);
if (missingRepos.length) console.log(`    NOT SCANNED (repo not found): ${missingRepos.join(", ")}`);
console.log("");

if (offenders.length) {
  console.error("FAIL — these files name a deploy and would run it if a shell were handed them:");
  offenders.forEach(o => console.error("      " + o));
  console.error("");
  console.error("Put a SHELL-STOP in the first " + HEAD_LINES + " lines — an unbalanced `)` inside a");
  console.error("comment the file's own syntax ignores, above anything it protects:");
  console.error("      markdown   <!-- ) SHELL-STOP … -->");
  console.error("      js / mjs   /* ) SHELL-STOP … */     (line 2 if a shebang is line 1)");
  console.error("");
  process.exit(1);
}

if (missingRepos.length) {
  console.error(`FAIL — ${missingRepos.join(", ")} could not be scanned, so this gate cannot`);
  console.error("say the class is closed. A gate that silently skips a repository is not a gate.");
  console.error("");
  process.exit(1);
}

console.log("PASS — every tracked file that names a deploy is inert to a shell.");
console.log("");
