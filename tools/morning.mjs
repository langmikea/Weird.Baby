/* ===========================================================================
   THE MORNING — the six o'clock desk run, as one command. [2026-09-17, Ops'
   call from docs/NEXT-20260917.md A4: the scheduled task stalled every day
   on permission prompts because each improvised command was new wording;
   one script, one exact approval, zero prompts.]

     npm run morning              the whole run, in order, then the report
     npm run morning -- --no-reels   the same without building Q&A reels (a test)

   In order:
     1. git status, remembering what was already dirty (left alone).
     2. the desk (tools/desk.mjs), the workbook (tools/days-xlsx.py; if
        Excel holds it the script says so and the run goes on), the days
        (tools/days.mjs), the calendar (tools/calendar.mjs), the board
        (tools/board.mjs: the plan graded for today).
     3. the late tasks: docs/desk/TASKS.json against done marks, the
        workbook's x's (TASKS.marks.json) and the tree, exactly as days.mjs
        counts them.
     4. what landed in OneDrive › WeirdBaby › reels › intake and › photos
        since the last run (docs/desk/MORNING.state.json remembers).
     5. the Q&A line: python tools/reels-qa.py --ahead 7, then
        node tools/reels-queue.mjs --lane qa --ahead 7 (dry without a key).
     6. docs/desk/MORNING.md, under fifteen lines.
     7. commit the generated files (docs/desk, docs/calendar, reels/qa.json,
        the report with them) with a message file, push; a failure is
        reported, never retried.

   Prints the report, then one line beginning NOTIFY only when the message
   rule applies (something more than two days late, or a file landed in the
   intake). Anything else the run prints is for the log. Exit code 0 unless
   a step that must run could not start.
   =========================================================================== */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import url from "node:url";
import { spawnSync } from "node:child_process";
import { DOOR_DAY } from "../src/data/artists/record-epoch.js";   // the door has one home

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const ONE = "C:/Users/macun/OneDrive/WeirdBaby";
const OPEN = DOOR_DAY;
const args = process.argv.slice(2);
const NO_REELS = args.includes("--no-reels");
const todayNY = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date(todayNY + "T12:00:00Z").getUTCDay()];
const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

const notes = [];      // lines for the report
const needs = [];      // what needs a person
const notify = [];     // reasons to message Mike

/* ── run one step, capture its words, never throw ──────────────────────── */
function run(label, cmd, cmdArgs, { ok = [0] } = {}) {
  const r = spawnSync(cmd, cmdArgs, { cwd: REPO, encoding: "utf8", shell: process.platform === "win32" && /^(npm|npx)$/.test(cmd), windowsHide: true, maxBuffer: 64 * 1024 * 1024 });
  const out = ((r.stdout || "") + (r.stderr || "")).trim();
  const status = r.error ? -1 : r.status;
  console.log(`\n── ${label} (exit ${status})`);
  if (out) console.log(out.split("\n").map(l => "   " + l).join("\n"));
  if (r.error) console.log("   could not start: " + r.error.message);
  return { status, out, raw: r.stdout || "", ok: !r.error && ok.includes(r.status) };
}

/* 1. the tree before we touch it */
const before = run("git status", "git", ["status", "--short"]);
const dirtyBefore = before.raw.split(/\r?\n/).map(l => (l.match(/^.{2} (.+)$/) || [])[1]).filter(Boolean);

/* 2. the desk, the workbook, the days, the calendar */
const desk = run("the desk", "node", ["tools/desk.mjs"]);
const xlsx = run("the workbook", "python", ["tools/days-xlsx.py"], { ok: [0, 2] });
const excelOpen = xlsx.status === 2 || /open in Excel/i.test(xlsx.out);
const days = run("the days", "node", ["tools/days.mjs"]);
const cal = run("the calendar", "node", ["tools/calendar.mjs"]);
if (!desk.ok) notes.push("The desk did not rebuild (tools/desk.mjs failed); see the run's log.");
if (excelOpen) notes.push("Workbook not rebuilt: Excel has it open. The x's that could be read were read; nothing was lost.");
else if (!xlsx.ok) notes.push("The workbook step failed (tools/days-xlsx.py); see the run's log.");
if (!days.ok) notes.push("The days page did not rebuild (tools/days.mjs failed); see the run's log.");
if (!cal.ok) notes.push("The calendar did not rebuild (tools/calendar.mjs failed); see the run's log.");
/* 2b. the board: the plan graded for today (docs/PLAN-20260918-LAUNCH.md) */
const board = run("the board", "node", ["tools/board.mjs"]);
const boardLine = (board.out.match(/(\d+) deliverables, (\d+) not on track/) || []);
const boardRed = board.out.split("\n").filter(l => /\(\d+ things, [1-9]\d* red\)/.test(l)).map(l => l.trim().split(/\s{2,}/)[0] + " " + (l.match(/, (\d+) red/) || [])[1]);
if (!board.ok) notes.push("The board did not grade (tools/board.mjs failed); see the run's log.");

/* 3. the late tasks, counted the way days.mjs counts them */
const T = JSON.parse(fs.readFileSync(path.join(REPO, "docs/desk/TASKS.json"), "utf8"));
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return d; } };
const marks = readJson(path.join(REPO, "docs/desk/TASKS.marks.json"), {});
const ticked = readJson(path.join(REPO, "docs/desk/TASKS.db.json"), {});
for (const [id, m] of Object.entries(marks)) if (m === "x" || (m && m.done === true)) ticked[id] = { done: true };
const files = (dir, pred) => { try { return fs.readdirSync(path.join(ONE, dir)).filter(pred); } catch { return []; } };
const VID = /\.(mp4|mov|m4v)$/i, IMG = /\.(jpe?g|png|heic|webp)$/i;
function checked(t) {
  const c = t.check; if (!c) return false;
  if (c.type === "file") return files(c.dir, f => f.toLowerCase().startsWith(c.prefix.toLowerCase()) && VID.test(f)).length > 0;
  if (c.type === "files") return files(c.dir, f => f.toLowerCase().startsWith(c.prefix.toLowerCase()) && VID.test(f)).length >= (c.min || 1);
  if (c.type === "photos") return files(c.dir, f => IMG.test(f)).length >= (c.min || 4);
  if (c.type === "buffer-token") return fs.existsSync("C:/AI/PERSONA-20260903/.secrets/buffer.token");
  return false;
}
const tasks = T.tasks.map(t => { const done = t.done === true || checked(t) || ticked[t.id]?.done === true; return { ...t, done, late: !done && t.date < todayNY }; });
const count = who => `${tasks.filter(t => t.owner === who && t.done).length}/${tasks.filter(t => t.owner === who).length}`;
const late = tasks.filter(t => t.late).sort((a, b) => a.date.localeCompare(b.date));
const lateLine = t => { const n = daysBetween(t.date, todayNY); return `${t.title} (due ${t.date.slice(5)}, ${t.owner === "mike" ? "Mike" : "Ops"}, ${n} day${n === 1 ? "" : "s"} late)`; };
for (const t of late) if (daysBetween(t.date, todayNY) > 2) notify.push(`${t.title} is ${daysBetween(t.date, todayNY)} days late (due ${t.date.slice(5)})`);
for (const t of late.filter(t => t.owner === "mike")) needs.push(t.title);

/* 4. what landed since the last run */
const STATE = path.join(REPO, "docs/desk/MORNING.state.json");
const state = readJson(STATE, { ran: null, intake: {}, photos: {} });
const list = dir => { try { return fs.readdirSync(path.join(ONE, dir), { withFileTypes: true }).filter(d => d.isFile() && !/^(DROP_HERE|READ_ME)\.txt$/i.test(d.name)).map(d => d.name).sort(); } catch { return []; } };
const subdirs = dir => { try { return fs.readdirSync(path.join(ONE, dir), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort(); } catch { return []; } };
const now = { ran: new Date().toISOString(), intake: {}, photos: {} };
for (const lane of subdirs("reels/intake")) now.intake[lane] = list(`reels/intake/${lane}`);
for (const subject of subdirs("photos")) now.photos[subject] = list(`photos/${subject}`);
const arrived = (was, is) => Object.entries(is).flatMap(([k, v]) => v.filter(f => !(was[k] || []).includes(f)).map(f => `${k}/${f}`));
const newIntake = arrived(state.intake || {}, now.intake), newPhotos = arrived(state.photos || {}, now.photos);
const since = state.ran ? `since ${state.ran.slice(0, 10)}` : "since the last run (first run: everything present counts as already there)";
const laneCounts = Object.entries(now.intake).map(([k, v]) => `${k} ${v.length}`).join(", ") || "no lanes";
const photoCounts = Object.entries(now.photos).map(([k, v]) => `${k} ${v.length}`).join(", ") || "no folders";
if (state.ran && newIntake.length) notify.push(`${newIntake.length} file${newIntake.length === 1 ? "" : "s"} landed in the intake: ${newIntake.join(", ")}`);
fs.writeFileSync(STATE, JSON.stringify(now, null, 1) + "\n");

/* 5. the Q&A line */
let qaBuilt = 0, qaQueued = 0, qaBlank = 0, qaNote = "";
if (NO_REELS) qaNote = "reels not built this run (--no-reels)";
else {
  const b = run("the Q&A reels, seven days ahead", "python", ["tools/reels-qa.py", "--ahead", "7"]);
  if (!b.ok) qaNote = "the reel build failed; see the run's log";
}
const q = run("the Q&A queue", "node", ["tools/reels-queue.mjs", "--lane", "qa", "--ahead", "7"]);
const dry = !q.ok || /dry run|no Buffer key/i.test(q.out);
const qa = readJson(path.join(REPO, "reels/qa.json"), { rows: [] });
const horizon = new Date(todayNY + "T12:00:00Z"); horizon.setUTCDate(horizon.getUTCDate() + 7);
const end = horizon.toISOString().slice(0, 10);
const ahead = qa.rows.filter(r => r.date >= todayNY && r.date <= end && !r.hot);
qaBuilt = ahead.filter(r => r.file).length;
qaQueued = ahead.filter(r => r.status === "queued" || Object.values(r.postings || {}).some(p => p.buffer_post_id)).length;
const datesAhead = new Set(ahead.filter(r => r.question && r.answer).map(r => r.date));
qaBlank = 7 - [...datesAhead].length;
const lineStart = qa.start || "2026-10-31";
if (qaBlank > 0 && lineStart > end) qaNote = qaNote || `the line starts ${lineStart}; blank days before it are as ruled`;

const gen = ["docs/desk", "docs/calendar", "reels/qa.json"];
const foreign = dirtyBefore.filter(f => !gen.some(g => f === g || f.startsWith(g + "/")));
if (foreign.length) notes.push(`Tree: already modified before the run, left alone: ${foreign.slice(0, 5).join(", ")}${foreign.length > 5 ? ` and ${foreign.length - 5} more` : ""}.`);
/* 6. the report, written before the commit so the commit carries it */
const daysLeft = daysBetween(todayNY, OPEN);
const lines = [
  `# Morning desk — ${todayNY} (${DOW})`,
  ``,
  `- Mike: ${count("mike")} done · Ops: ${count("ops")} done · ${daysLeft} days to the door (${OPEN})`,
  `- The board: ${board.ok ? `${boardLine[2]} of ${boardLine[1]} not on track${boardRed.length ? ` (${boardRed.join(", ")})` : ""}` : "not graded"}`,
  `- Late: ${late.length ? late.map(lateLine).join("; ") : "nothing late"}`,
  `- Intake, ${since}: ${newIntake.length ? newIntake.join(", ") : "nothing new"} (${laneCounts})`,
  `- Photos, ${since}: ${newPhotos.length ? newPhotos.join(", ") : "nothing new"} (${photoCounts})`,
  `- Q&A line, next seven days: ${qaBuilt} built, ${qaQueued} queued${dry ? " (dry run, no Buffer key on this PC)" : ""}, ${qaBlank} day${qaBlank === 1 ? "" : "s"} without a question${qaNote ? `; ${qaNote}` : ""}`,
  ...notes.map(n => `- ${n}`),
  `- Needs a person: ${needs.length ? needs.join("; ") : "nothing"}`,
  ``,
];
const report = lines.slice(0, 15).join("\n");
fs.writeFileSync(path.join(REPO, "docs/desk/MORNING.md"), report + (report.endsWith("\n") ? "" : "\n"));
console.log("\n══ docs/desk/MORNING.md\n" + report);
/* 7. commit and push what the run generated, the report included */
run("git add", "git", ["add", "--", ...gen]);
const staged = run("staged", "git", ["diff", "--cached", "--name-only", "--", ...gen]).out.split("\n").filter(Boolean);
let commitLine = "nothing changed, nothing committed";
if (staged.length) {
  const msgFile = path.join(os.tmpdir(), `wb-morning-${todayNY}.txt`);
  fs.writeFileSync(msgFile, `Morning desk run of ${todayNY}\n\nMarks read, the desk, days and calendar refreshed, the Q&A line advanced seven days. Written by tools/morning.mjs.\n`);
  const c = run("git commit", "git", ["commit", "-F", msgFile, "--", ...gen]);   // only the run's files, whatever else sits in the index
  if (!c.ok) commitLine = "the commit FAILED; see the run's log";
  else {
    const p = run("git push", "git", ["push"]);
    const sha = run("head", "git", ["rev-parse", "--short", "HEAD"]).out;
    commitLine = p.ok ? `committed ${sha} and pushed (${staged.length} file${staged.length === 1 ? "" : "s"})` : `committed ${sha}; the push failed, left for the next run`;
  }
}

console.log(`git: ${commitLine}`);
if (/FAILED|failed/.test(commitLine)) fs.appendFileSync(path.join(REPO, "docs/desk/MORNING.md"), `- Git: ${commitLine}; needs a person if it happens again tomorrow.
`);
if (notify.length) console.log(`NOTIFY: ${notify.join(". ")}.`);
else console.log("no message today: nothing more than two days late and nothing landed in the intake");
