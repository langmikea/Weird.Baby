/* ===========================================================================
   THE RECORD'S EPOCH — one constant, and the arithmetic that counts from it.
   ===========================================================================

   [M1 2026-08-11] IT IS ITS OWN MODULE BECAUSE IT HAS TWO READERS AND BELONGS
   TO NEITHER. The face in `robots.js` prints `recordEpoch` and the entries in
   `robots-record.js` date themselves with `recordDay(n)`; before the split both
   sat in `robots.js` and the entries could reach them by being in the same
   file. They no longer are, and the two available alternatives were both worse:
   importing `recordDay` from `robots.js` into the entries makes a cycle
   (`robots.js` imports the entries), and declaring the epoch twice is the one
   thing D1's own note below forbids in as many words.
   SO THE CONSTANT MOVED RATHER THAN BEING COPIED, and its reasoning came with
   it byte for byte. Nothing below this line was written this round.
   =========================================================================== */

/* ═══ [D1 2026-08-08] THE STORY PLAYS OUT IN REAL TIME, ON REAL DATES ════════
   MIKE, and it is the rule ABOVE the date rather than a note about one entry:

     **AN ENTRY'S DATE IS THE ACTUAL CALENDAR DAY IT IS PUBLISHED, NOT A
     FICTIONAL OFFSET.**

   There is no story clock running beside the real one. A Record entry dated the
   seventeenth of August went on the glass on the seventeenth of August, and
   everything the museum derives from a date — the register stamp, the weekday,
   the week number, the month band — is arithmetic on a day that actually
   happened. It is why `entryDate()` has always parsed a CALENDAR date rather
   than an instant: a log whose dates shift by a timezone is not a log.

   ONE FIELD, AND THIS CONSTANT IS THAT FIELD. Mike's condition on supplying the
   date was that if the launch slips, one field moves and everything follows.
   Day one is used TWICE — as Record 001's own `date` and as the face's
   `recordEpoch`, which is the day `entryWeek()` counts from — and two literals
   holding one day is two fields. The one that gets forgotten is whichever a slip
   does not make obviously wrong: a stale entry date reads wrong the moment
   anybody looks at it; a week number that is one out reads fine forever.

   SO A SLIP IS THIS LINE AND NOTHING ELSE. It is verified rather than asserted —
   `docs/MUSEUM_DATE_PREVIEW_LOG-20260808.md` §1 moves it to a different day and
   records what followed.

   THE DATE IS PENDING THE LAUNCH ACTUALLY HAPPENING THAT DAY, which is his own
   qualification and is the reason this is a constant and not a decision.

   AND IT AGREES WITH HIS OWN TEXT, which was checked rather than assumed:
   2026-08-17 is a **Monday** — his report says the site went live *"at 12:00 am
   Monday morning"* — and his `FRIDAY DAY (-3)` heading lands on 2026-08-14,
   which is a **Friday**. Nothing was adjusted to make that true. */
export const RECORD_EPOCH = "2026-08-17";

/* [L4 2026-08-09] EVERY OTHER ENTRY'S DATE IS COUNTED FROM IT, NOT TYPED.
   Mike: "DATES from the epoch: D1 = 2026-08-17 Monday, D2 = 08-18, D3 = 08-19,
   D4 = 08-20, D5 = 08-21." Five literals would be five things a slip has to
   find; this is the same one-field rule the epoch's own note states, extended
   to the entries that follow it. Day 1 IS the epoch, so `recordDay(1)` and
   `RECORD_EPOCH` are the same string by construction rather than by agreement.
   UTC arithmetic deliberately: a local-midnight Date rolls the day backwards in
   any timezone west of Greenwich, which is how a dateline reads Sunday. */
export function recordDay(n) {
  const d = new Date(RECORD_EPOCH + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + (n - 1));
  return d.toISOString().slice(0, 10);
}
