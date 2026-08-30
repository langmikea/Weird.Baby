// src/lib/wing-open.js — HAS THE ROBOTS WING ARRIVED? [CH6 2026-08-12]
//
// MIKE'S RULING: **hide all of /robots at launch — NIAC, VIIIp, the FAQ, the
// Record, everything. It does not exist to a visitor until Record 001 announces
// it on 2026-09-07.** The Record lives inside the wing, so both arrive together,
// and 001 is what announces it.
//
// [2026-08-24] THE DATE IN THAT SENTENCE IS THE ONE THING RULING C MOVED, AND
// IT MOVED WITHOUT THIS FILE'S MECHANISM NOTICING — which is the claim the rest
// of this header makes, collected. The line below still has no date in it, and
// `ROBOTS_OPEN` was not edited.
// [2026-08-28] AND IT HAS NOW HAPPENED TWICE. Ruling D moved day one to
// **2026-09-07**; this header's two prose dates followed and the code did not.
// Two moves, three comment lines between them, zero edits to `ROBOTS_OPEN`.
//
// ═══ THE RULE UNDERNEATH, AND WHY THIS FILE HAS NO DATE IN IT ═══════════════
// MIKE: *"the site says what the site says until a SCRIPTED EVENT says
// otherwise. Nothing reveals by clock alone; the story does the revealing."*
//
// THAT SENTENCE IS THE WHOLE DESIGN OF THIS FILE. The obvious build is
// `TODAY >= "2026-09-07"` — a second date literal, sitting beside `RECORD_EPOCH`,
// agreeing with it by hand until the day somebody moves one of them. It would
// also be a clock revealing a wing, which is the thing he ruled out.
//
// So the wing opens when **THE RECORD HAS AN ENTRY IN IT**. The scripted event
// is Record 001 becoming visible; the wing follows the event rather than the
// calendar. There is no date here to drift, `RECORD_EPOCH` stays the one
// declaration (Doctrine 17), and if Mike moves day one the wing moves with it
// without this file being touched.
//
// ═══ WHAT IT COSTS, SAID PLAINLY ═══════════════════════════════════════════
// An empty Record means a hidden wing. That is correct today and it is a real
// coupling: if every entry were ever deleted, the wing would vanish rather than
// stand empty. That is the ruling read literally — the wing does not exist
// until the Record announces it — and it is the behaviour Mike asked for, not
// an accident of the derivation. It is named here so a future session meets it
// as a decision rather than as a surprise.
//
// DEVELOPMENT IS UNCONDITIONALLY OPEN, for the standing reason (`reveal/
// stage.mjs`): Mike cannot direct what he cannot see, and a wing that hides
// itself on his own machine five days before launch is the defect the stage
// rule exists to prevent.

import { RECORD_ENTRIES } from "../data/artists/robots-record.js";
import { recordEntriesForToday } from "./record-clock.js";
import { launched } from "./placement.js";

/* Read once at module load. `recordEntriesForToday` already folds in the
   worker's injected date, the admin preview code and the stage, so the wing
   inherits all three without knowing about any of them:
     · DEVELOPMENT      -> open
     · admin previewing -> open (he sees the Record, so he sees the wing)
     · LAUNCH, no entry -> shut
     · LAUNCH, 001 up   -> open */
export const ROBOTS_OPEN = robotsOpenOn();

/* ═══ [L-e 2026-08-30] THE SAME DERIVATION, ASKED ABOUT A DAY ══════════════
   `ROBOTS_OPEN` above is this function asked about the day the document was
   served on, and it stays because that is the right answer for every visitor
   who loads or reloads a page — which is every visitor except one.

   THE ONE IT IS WRONG FOR was measured on 2026-08-30 and is written up in
   `docs/FINDING-robots-open-consumers.md`: a tab already open when the museum's
   day turns at 17:00 holds the const at `false` for as long as it stays open,
   so the wing has no door on the board and `/robots` renders the lobby, while
   the countdown three lines above it has already removed itself on the museum's
   clock. Four sites read this const and only one of them had ever been traced.

   THE RULE UNDERNEATH IS UNCHANGED AND THIS FILE STILL HAS NO DATE IN IT.
   The wing opens when THE RECORD HAS AN ENTRY — the scripted event, not the
   calendar. All that moves is WHICH DAY the question is asked about, and the
   day comes from `useMuseumDay()`, which asks `museumNow()` and
   `todayInRecordTz`. There is still exactly one date declaration in the museum
   and it is `RECORD_EPOCH`.

   THE COUPLING IN §4.3 OF THAT REPORT IS WHY THIS LANDED WITH THREE OTHER
   SITES AND NOT ALONE: opening the route in that tab without also re-filtering
   the Record's own entry list would have opened the wing onto *"Nothing has
   been entered in the Record yet."* — a worse page than the shut route. */
/** has the Record announced the wing, as of `day`? */
export function robotsOpenOn(day) {
  return !launched()
    || recordEntriesForToday(RECORD_ENTRIES, day).length > 0;
}
