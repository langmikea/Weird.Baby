/* ===========================================================================
   THE RECORD'S CLOCK — ONE DECLARATION, THREE READERS. [CH5 2026-08-12]
   ===========================================================================

   MIKE'S RULING, FROM THE START: **Record n goes out on Day n.** He writes
   ahead and deploys at will; the site reads the clock at REQUEST time and
   serves the Records up to today. A short admin code shows him everything.

   ═══ THIS IS THE WORKER, NOT THE BUILD, AND THE DIFFERENCE IS THE WHOLE
       DESIGN ════════════════════════════════════════════════════════════════
   `reveal/day.mjs` refused a BUILD that reads a clock and it was RIGHT to: a
   build that reads a clock is not reproducible — the same commit produces a
   different bundle on Tuesday than it did on Monday, and nothing can be checked
   against anything. That refusal stands and nothing here weakens it.

   WHAT THIS IS INSTEAD: the commit is a fixed input, the bundle is BYTE
   IDENTICAL every day, and the WORKER plays it back against request time. Two
   visitors on two days get two pages out of one artifact. That is a property of
   the SERVER, not of the build, and it is the only arrangement in which "he
   writes ahead and deploys at will" is true.

   ═══ ONE DECLARATION, EVERY READER (Doctrine 17's shape) ════════════════════
   Three things need this and none of them may keep its own copy:
     · `src/worker.js`     — computes today, decides what a visitor may fetch
     · `src/lib/record-clock.js` — filters the entries the page draws
     · `vite.config.js`    — bakes the date→asset schedule into the worker
   A constant that cannot be imported because it lives in a script IS THE
   DEFECT and gets moved (Doctrine 22's rule, applied here before it bit).

   ═══ THE TIMEZONE IS AMERICA/NEW_YORK AND IT IS A DECISION ══════════════════
   `RECORD_EPOCH` is a bare date — `2026-08-17` — with no zone on it, and a bare
   date is not a moment. Somebody has to say WHERE midnight is.
   IT IS MIKE'S CLOCK, because it is his Record and his day: the entries are
   his working days, his commits are stamped -0400, and his own launch report
   says the site went live *"at 12:00 am Monday morning"* — which is a claim
   about a wall clock in a room, not about UTC.
   WHAT IT COSTS, STATED: a visitor in Sydney reads Monday's entry roughly
   fourteen hours after their own Monday begins. That is correct rather than
   unfortunate — the Record is a log kept by a person in one place, and the day
   it turns over is that person's day. A per-visitor local clock would mean the
   same entry appearing on two different calendar days depending on who asked,
   which is a worse thing to explain than a lag.
   =========================================================================== */

/** Where midnight is. See the note above before changing it. */
export const RECORD_TZ = "America/New_York";

/** the cookie the admin door sets — its own name, for its own reason (§8) */
export const PREVIEW_COOKIE = "wb_record";

/* `en-CA` formats as YYYY-MM-DD, which is the shape `recordDay()` emits and the
   shape an entry's `date` is written in, so the comparison below is a string
   comparison and needs no Date at all. Deliberate: every date in this system is
   an ISO day string, and parsing them back into moments to compare them is how
   a timezone bug gets in. */
const FMT = new Intl.DateTimeFormat("en-CA", {
  timeZone: RECORD_TZ, year: "numeric", month: "2-digit", day: "2-digit",
});

/** the calendar day it is *in the Record's own timezone*, as `YYYY-MM-DD` */
export function todayInRecordTz(now = new Date()) {
  return FMT.format(now);
}

/* ═══ [2026-08-16] THE INSTANT A CALENDAR DAY BEGINS, IN THE RECORD'S ZONE ═══
   MIKE RULED THE COUNTDOWN'S TARGET: "Monday 17 August 2026, 00:00
   America/New_York. The museum's own clock, matching the doors." He reversed an
   earlier local-to-the-visitor ruling once the clock report showed the Records
   are NY-locked server-side — a Tokyo visitor would have watched the counter
   reach zero thirteen hours before the doors opened and found the museum shut.

   IT TAKES A DAY STRING AND RETURNS A MOMENT, WHICH IS THE ONE CONVERSION THIS
   SYSTEM HAS DELIBERATELY AVOIDED EVERYWHERE ELSE. Every other date here stays
   an ISO day string and is compared as a string, on this file's own stated
   reasoning: *"parsing them back into moments to compare them is how a timezone
   bug gets in."* A countdown is the one thing that genuinely needs the moment,
   because it counts seconds — so the conversion happens HERE, once, beside the
   zone it depends on, rather than in a component that would have to name the
   zone a second time.

   NO NEW DATE LITERAL. It is called with `RECORD_EPOCH`, so a launch slip still
   moves one field and the countdown follows it.

   THE TWO-PASS OFFSET IS NOT SUPERSTITION. `Date.parse(day + "T00:00:00Z")` is
   midnight UTC, not midnight in the zone; subtracting the zone's offset AT THAT
   INSTANT gives a first approximation, and re-reading the offset at the
   approximation catches the case where the two fall on opposite sides of a DST
   transition. For 2026-08-17 the zone is stable at -04:00 and one pass would
   do; the second pass is what stops this being wrong on the one day a year it
   would matter, and it costs nothing. */
function zoneOffsetMs(instant, tz) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hour12: false,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).formatToParts(instant).map(x => [x.type, x.value]));
  const asIfUtc = Date.UTC(+p.year, +p.month - 1, +p.day,
                           +p.hour % 24, +p.minute, +p.second);
  return asIfUtc - instant.getTime();
}

/** epoch-ms of 00:00 on `day` (YYYY-MM-DD) in the Record's own zone */
export function dayStartInRecordTz(day, tz = RECORD_TZ) {
  const utcMidnight = Date.parse(day + "T00:00:00Z");
  const first = utcMidnight - zoneOffsetMs(new Date(utcMidnight), tz);
  return utcMidnight - zoneOffsetMs(new Date(first), tz);
}

/* ── VISIBILITY ─────────────────────────────────────────────────────────────
   AN UNDATED ENTRY IS VISIBLE, and that is a decision rather than an oversight.
   `record-model.js` has always supported an entry with no `date` (013 carried
   none for its whole life), and an entry with no day cannot be waiting for one.
   The alternative — hiding what has no date — would make a missing field into a
   silent deletion, which is the failure `reveal:check`'s DRAWN_ENTRY_FIELDS
   gate exists to prevent. */
export function entryVisible(entryDate, today) {
  if (!entryDate) return true;
  return entryDate <= today;
}

/** the entries a visitor may see on `today`; `all` is the admin override */
export function visibleEntries(entries, today, all = false) {
  if (all) return entries;
  return (entries || []).filter((e) => entryVisible(e && e.date, today));
}

/* ── THE ASSET SCHEDULE (A3) ────────────────────────────────────────────────
   THE FILES BEHIND A FUTURE RECORD ARE ON THE SERVER TOO. An entry that names
   a photograph publishes that photograph the day it lands — but the file is
   uploaded with the deploy, days early, and until this it was fetchable by
   anyone who guessed the path. Same clock, same rule.

   THE SCHEDULE IS BUILT, NOT GUESSED: it is the Record's own `assets` arrays
   keyed by the entry's own date, which is exactly what `delivered()` already
   walks. A path named by two entries takes the EARLIER date — the day it first
   enters the story is the day it is publishable, and a later mention cannot
   retract it.

   IT IS EMPTY TODAY AND THAT IS REPORTED, NOT HIDDEN. Record 013 was the only
   entry that ever named a picture and it was deleted on 2026-08-12, so
   `delivered()` is the empty set and this schedule has no rows. The mechanism
   is built and unexercised; the first entry that names a picture exercises it. */
export function assetSchedule(entries, dateOf) {
  const out = {};
  for (const e of entries || []) {
    const day = dateOf(e);
    if (!day) continue;
    for (const path of e.assets || []) {
      if (!out[path] || day < out[path]) out[path] = day;
    }
  }
  return out;
}

/** true when `path` is named only by entries whose day has not come */
export function assetWithheld(schedule, path, today) {
  const day = schedule && schedule[path];
  if (!day) return false;              /* nothing schedules it — not ours to hold */
  return day > today;
}
