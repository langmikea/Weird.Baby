/* Put the two calendar feeds where Google Calendar can fetch them: the
   museum's R2 bucket, public at assets.weird.baby/desk/. Run after
   tools/days.mjs (npm run desk does both). Stable addresses:
     https://assets.weird.baby/desk/days-mike.ics
     https://assets.weird.baby/desk/days-ops.ics
   Google refreshes a subscribed feed on its own schedule (hours). */
import path from "node:path";
import url from "node:url";
import { execFileSync } from "node:child_process";
const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
for (const f of ["days-mike.ics", "days-ops.ics"]) {
  execFileSync("npx", ["wrangler", "r2", "object", "put", `weird-baby-assets/desk/${f}`, "--file", path.join(REPO, "docs/desk", f), "--content-type", "text/calendar", "--remote"], { cwd: REPO, stdio: "pipe", shell: true });
  console.log(`published https://assets.weird.baby/desk/${f}`);
}
