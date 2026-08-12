// src/lib/wing-open.js — HAS THE ROBOTS WING ARRIVED? [CH6 2026-08-12]
//
// MIKE'S RULING: **hide all of /robots at launch — NIAC, VIIIp, the FAQ, the
// Record, everything. It does not exist to a visitor until Record 001 announces
// it on 2026-08-17.** The Record lives inside the wing, so both arrive together,
// and 001 is what announces it.
//
// ═══ THE RULE UNDERNEATH, AND WHY THIS FILE HAS NO DATE IN IT ═══════════════
// MIKE: *"the site says what the site says until a SCRIPTED EVENT says
// otherwise. Nothing reveals by clock alone; the story does the revealing."*
//
// THAT SENTENCE IS THE WHOLE DESIGN OF THIS FILE. The obvious build is
// `TODAY >= "2026-08-17"` — a second date literal, sitting beside `RECORD_EPOCH`,
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
export const ROBOTS_OPEN =
  !launched() || recordEntriesForToday(RECORD_ENTRIES).length > 0;
