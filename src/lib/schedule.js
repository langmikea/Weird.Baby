/* src/lib/schedule.js — THE REVEAL SCHEDULE, ASKED ABOUT A DAY.
   [2026-09-02] Mike's ruling A on the reveal choreography (third cut). The
   data is reveal/schedule.json (every asset's story week and posting day) and
   reveal/zip-tree.json (the in-story ZIP, folder by folder, a week on every
   entry). This module turns "week N, day D" into an ISO date off the one epoch
   constant and answers two questions for a given museum day:

     deliveredOn(day)  → the set of schedule ids whose date is on or before day
     zipOn(day)        → the ZIP tree with every entry marked readable or locked

   THE HOUSE PATTERN, KEPT: it takes `day` as a parameter and holds no
   module-load date. Callers pass useMuseumDay() so a tab open across 17:00
   sees the delivery happen, and the driven session (?as-of=) drives this the
   same way it drives the Record. Nothing here reads the clock.

   NOT WIRED YET. Built on the zip-and-parcels branch; nothing imports it until
   the build brief (docs/BUILD-BRIEF-day-gating-and-zip-20260902.md) is
   executed after Sunday 2026-09-06. */
import SCHEDULE from "../../reveal/schedule.json";
import ZIP from "../../reveal/zip-tree.json";
import { RECORD_EPOCH } from "../data/artists/record-epoch.js";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];

/* week N (1 = the epoch's week), day MON..FRI → ISO date. Weeks are calendar
   weeks from the epoch Monday; the epoch is ruled a Monday. */
export function dateOf(week, day) {
  if (!week) return null;
  const d = new Date(RECORD_EPOCH + "T00:00:00Z");
  const offset = (week - 1) * 7 + Math.max(0, DAYS.indexOf(day || "MON"));
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

/* the schedule rows, each with a resolved `date` (the file's own `date` wins
   when present; otherwise derived). Rows with no week are unscheduled. */
export const ROWS = Object.entries(SCHEDULE.rows || {}).map(([id, r]) => ({
  id, ...r, date: r.date || dateOf(r.week, r.day),
}));

export function deliveredOn(day) {
  const out = new Set();
  for (const r of ROWS) if (r.date && r.date <= day) out.add(r.id);
  return out;
}

export function scheduleFor(id) {
  return ROWS.find(r => r.id === id) || null;
}

/* the ZIP tree on a day: folders keep their order; each entry gains
   `date` and `state`: "readable" (date on or before day), "coming" (dated,
   later), or "locked" (no week). A folder is "locked" until its own week or its
   first readable entry. */
export function zipOn(day) {
  const folders = (ZIP.folders || []).map(f => {
    const entries = (f.entries || []).map(e => {
      const date = e.week ? dateOf(e.week, e.day) : null;
      const state = !date ? "locked" : (date <= day ? "readable" : "coming");
      return { ...e, date, state };
    });
    const fdate = f.week ? dateOf(f.week, f.day) : null;
    const anyReadable = entries.some(e => e.state === "readable");
    const state = anyReadable || (fdate && fdate <= day) ? "open"
                : (fdate || entries.some(e => e.date)) ? "coming" : "locked";
    return { ...f, date: fdate, state, entries };
  });
  return { root: ZIP.root, size: ZIP.size, password: ZIP.password, folders };
}
