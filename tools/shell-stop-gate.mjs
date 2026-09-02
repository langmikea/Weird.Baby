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
   file. Of the tracked files that mention a deploy invocation, eight fired one.

   THE EXPOSURE IS BASH-SPECIFIC AND THAT IS MEASURED, NOT ASSUMED. PowerShell
   refuses a non-`.ps1` to `-File`, and its backtick is an ESCAPE character
   rather than substitution, so the same lines are inert under `pwsh`. `$( )` is
   not, so this gate speaks about bash and would need a second pass to speak
   about PowerShell.

   ═══ THE RULE ══════════════════════════════════════════════════════════════
   A tracked file that names a deploy IN A POSITION A SHELL WOULD RUN must carry
   a SHELL-STOP — an unbalanced close-paren inside a comment its own syntax
   ignores — within its first few lines, above anything it protects. The exact
   forms are printed by this gate when it fails; they are not spelled out in
   this comment because a literal block-comment terminator inside it ends the
   comment early, a defect this repository has recorded five times.

   Bash aborts on the parenthesis before reaching a single command. The file
   renders and parses exactly as it did.

   ═══ THERE IS NO EXCEPTIONS LIST, DELIBERATELY ═════════════════════════════
   An exceptions list teaches the next round that exceptions are normal, and it
   costs more than the lines it saves. If this gate wants an exception, the
   guard step is incomplete — guard the file.

   Exit 1 on any unguarded hit, naming every path. Run as
   `npm run shellstop:gate`.
   ═══════════════════════════════════════════════════════════════════════════ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const MUSEUM = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ═══ SCOPE: BOTH REPOSITORIES, AND A MISSING ONE IS A REFUSAL ════════════
   [2026-08-29] This ran museum-only for one round while the robots three were
   their own packet. They are guarded now and the scope line is gone, because a
   scope note that outlives its scope is the stale-number defect wearing a
   different hat.

   HOW A MUSEUM TOOL REACHES THE ROBOTS TREE: the sibling-directory convention
   this repository already uses in `asset-table.mjs`, `contact-sheet.mjs` and
   `shorts-compile.mjs` — `path.resolve(REPO, "..", "weird-baby-robots")`. It
   was chosen over a second copy of this gate living in the robots repo for one
   reason: **two gates drift, and the one that drifts is the one nobody is
   running.** The predicate here is the whole value of the tool; duplicating it
   duplicates the thing that must stay identical.

   A MISSING ROBOTS TREE REFUSES RATHER THAN SKIPPING. §8 already records that a
   museum-only search is blind by construction to the other repository, and this
   project is two repos. A gate that quietly measured one of them would report a
   clean class that is not clean — the exact failure shape this whole round is
   about. If the clone is not beside the museum, this exits 1 and says so. */
const ROBOTS = path.resolve(MUSEUM, "..", "weird-baby-robots");
const REPOS = [
  { label: "weird-baby-museum", root: MUSEUM },
  { label: "weird-baby-robots", root: ROBOTS },
];

/* ═══ WHY docs/canonical/OPERATIONS_ARCHIVE/ IS SKIPPED, ON A PRINCIPLE ════
   THIS IS NOT AN EXCEPTIONS LIST AND MUST NOT BECOME ONE. §0's THE ARCHIVE IS
   A SNAPSHOT rules that `OPERATIONS_ARCHIVE/` holds what the ground state shed,
   cut at a named HEAD, and **is never edited** — so a guard cannot be added to
   a file in there without breaking the rule that makes the archive worth
   having.

   The principle that makes the skip safe rather than convenient: **an archive
   snapshot is sealed at a HEAD and is never a live packet's input.** Nothing
   reads it to work from; the ground state carries the live text and the archive
   carries what that text used to say. A file nothing feeds to a tool is a file
   nothing feeds to a shell.

   THE SKIP IS THE DIRECTORY AND ITS REASON, NEVER A FILENAME. The moment this
   becomes a list of paths it has stopped being a principle, and the next round
   will add the fourth entry without asking what the first three had in common.
   If a sealed archive ever does become a packet's input, this skip is wrong and
   goes — not the file.

   [2026-09-02] `docs/archive/` joined under the SAME principle, not as a second
   entry on a list: pass 4 of the System work moved every round log, report,
   old handoff and overnight folder there, its README says nothing reads it,
   and the overnight folders had lived outside every repository (never a
   packet's input) until they were landed. Two directories, one reason. */
const SKIP_DIRS = ["docs/canonical/OPERATIONS_ARCHIVE/", "docs/archive/"];

const DEPLOY = /deploy:launch|deploy:relaunch|wrangler\s+deploy|npm\s+run\s+deploy|npx\s+wrangler/i;

/* ═══ THE PREDICATE IS POSITION, NOT MENTION, AND THAT WAS MEASURED ════════
   "Contains a deploy invocation" is the wrong test and cannot be satisfied:
   `package.json` names `deploy:launch` as a script key and JSON carries no
   comment, so no guard can be put in it. The test is whether the occurrence
   sits where bash would RUN it — inside backticks, which are command
   substitution, or opening a line, which is a command.

   Measured against the eight the dynamic sweep proved fire: this predicate
   catches all eight and misses none.

   IT IS DELIBERATELY WIDER THAN WHAT FIRES TODAY, because bash aborts at the
   first syntax error and most files have one above their deploy line. That is
   safety by luck: the abort point moves whenever prose above it is edited, so a
   line can arm itself with nobody touching it. `tools/backup-guestbook.ps1` is
   the worked example — it fired nothing and is guarded anyway. */
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

/* ═══ PREFILTER WITH git grep ══════════════════════════════════════════════
   Reading every tracked file cost 7.5s. `git grep -lI` does the same scan in
   the index at native speed and hands back only the candidates, which are then
   read in full for the position test. Same answer, a fraction of the work. */
const offenders = [];
let named = 0, live = 0, skipped = 0;

for (const repo of REPOS) {
  if (!fs.existsSync(path.join(repo.root, ".git"))) {
    console.error("");
    console.error(`shell-stop gate REFUSED — ${repo.label} is not beside the museum:`);
    console.error("      " + repo.root);
    console.error("");
    console.error("This project is TWO repositories and §8 records that a museum-only search is");
    console.error("blind by construction to the other one. Measuring one and reporting a clean");
    console.error("class would be the failure this gate exists to prevent, so it refuses instead.");
    console.error("");
    process.exit(1);
  }
  let candidates;
  try {
    candidates = execFileSync("git",
      ["-C", repo.root, "grep", "-lIE", "--", DEPLOY.source],
      { encoding: "utf8", maxBuffer: 1 << 26 }).split("\n").filter(Boolean);
  } catch (e) {
    if (e && e.status === 1) candidates = [];          /* git grep: no matches */
    else {
      console.error(`shell-stop gate REFUSED — cannot search ${repo.label}: ` + (e && e.message));
      process.exit(1);
    }
  }
  named += candidates.length;
  for (const rel of candidates) {
    if (repo.root === MUSEUM && SKIP_DIRS.some(d => rel.startsWith(d))) { skipped++; continue; }
    let text;
    try { text = fs.readFileSync(path.join(repo.root, rel), "utf8"); } catch { continue; }
    if (!executablePosition(text)) continue;
    live++;
    if (!GUARD.test(text.split("\n", HEAD_LINES).join("\n"))) offenders.push(repo.label + "/" + rel);
  }
}

console.log("");
console.log("  SHELL-STOP GATE   (" + REPOS.map(r => r.label).join(" + ") + ")");
console.log("");
console.log(`    ${named} file(s) name a deploy · ${live} in a position a shell would run · ${offenders.length} unguarded`);
if (skipped) console.log(`    ${skipped} skipped in ${SKIP_DIRS.join(" and ")} — sealed archives, never a packet's input`);
console.log("");

if (offenders.length) {
  console.error("FAIL — these files name a deploy where a shell would run it:");
  offenders.forEach(o => console.error("      " + o));
  console.error("");
  console.error("Put a SHELL-STOP in the first " + HEAD_LINES + " lines — an unbalanced close-paren");
  console.error("inside a comment the file's own syntax ignores, above anything it protects:");
  console.error("      markdown     <!-- ) SHELL-STOP … -->");
  console.error("      js / mjs     /* ) SHELL-STOP … */      (line 2 if a shebang is line 1)");
  console.error("      powershell   <# ) SHELL-STOP … #>");
  console.error("");
  process.exit(1);
}

console.log("PASS — every tracked file that names a deploy where a shell would run it is inert.");
console.log("");
