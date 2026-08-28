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

   There is no story clock running beside the real one. A Record entry dated a
   given day goes on the glass on that day, and
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
   2026-09-07 is a **Monday** — his report says the site went live *"at 12:00 am
   Monday morning"* — and his `FRIDAY DAY (-3)` heading lands on 2026-09-04,
   which is a **Friday**. Nothing was adjusted to make that true.
   [2026-08-28] BOTH DATES IN THAT PARAGRAPH MOVED WITH THE EPOCH AND NEITHER
   CLAIM DID, which is the second time it has held: what it asserts is a SHAPE —
   day one is a Monday and his minus-three is a Friday — and the shape survives
   any Monday. See RULING D below.

   ═══ [2026-08-24] THE DATE MOVED TO 2026-08-31, AND THE MECHANISM IS WHAT LET
       IT ════════════════════════════════════════════════════════════════════
   MIKE'S RULING C: last week was design and development. **The site was never
   live.** Nothing is unpublished because nothing was published, so *we never go
   backwards* is not broken by this — there is nothing behind us to go back to.
   The site restarts **Sunday 30 August** and Record 001 posts **Monday
   31 August at 17:00 America/New_York.**

   IT COST ONE LINE, WHICH IS THE ONLY INTERESTING THING ABOUT IT — the claim
   three paragraphs above, collected. Everything followed: five entry dates, the
   stamps, the weekdays, the week numbers, the datelines, both build bakes, the
   share cards, the wing and the lobby countdown. **The five entries were not
   edited.** Not one of them carries a literal date; `recordDay(n)` did the move.

   AND THE WEEKDAYS SURVIVED, WHICH IS WHY THIS DATE AND NOT ANOTHER. 31 August
   is a Monday, so the outline's ten `MON…FRI` rows in `reveal/week-one.mjs` and
   `reveal/week-two.mjs` are untouched and `npm run dictation` still builds. A
   day that was not a Monday would have failed `checkOutlineDates()` ten times —
   the guard that exists for exactly this move.

   WHAT THOSE FIVE ENTRIES *ARE* IS A SEPARATE FACT AND IT IS NOT RECORDED HERE.
   This file holds the clock. The state of the five — what a visitor did or did
   not read — is Mike's, and it lands in `docs/MUSEUM_RULINGS-20260817.md` and
   `docs/canon/09-PUBLISHED.md`.

   ═══ [2026-08-28] RULING D — THE DATE MOVED AGAIN, TO 2026-09-07, AND IT MOVED
       BEFORE THE DEPLOY RATHER THAN AFTER IT ════════════════════════
   MIKE, ruling B then A on the two questions the catch-up deploy raised: **move
   the epoch first, then deploy.** The new day one is **Monday 7 September 2026**
   — his dad's birthday and Labor Day, and the relaunch date he named.

   WHY THE ORDER IS THE RULING AND NOT A PREFERENCE. The museum reads the clock
   at REQUEST time. A deploy does not ask this constant and back-burnering the
   launch does not reach it, so shipping the tree with day one four days out
   ARMS an unattended opening that nobody has to type anything to cause. His
   ruling is that the arming is decided here, in the tree, before the wire — not
   discovered on the day it fires. **THE COROLLARY IS THE PART A LATER SESSION
   NEEDS:** if the workflow is not ready when 7 September comes round, this line
   moves again BEFORE that day, because nothing and nobody has to act for the
   museum to open on it.

   IT COST ONE LINE AGAIN, AND THAT IS NOW A MECHANISM WITH TWO PROOFS RATHER
   THAN ONE. Five entry dates, the stamps, the weekdays, the week numbers, the
   datelines, both build bakes, the share cards, the wing and the lobby
   countdown all followed. **The five entries were not edited.** Not one of them
   carries a literal date; `recordDay(n)` did the move, exactly as it did on
   2026-08-24.

   AND THE WEEKDAYS SURVIVED A SECOND TIME. 7 September is a Monday, so the
   outline's ten `MON…FRI` rows in `reveal/week-one.mjs` and `reveal/week-two.mjs`
   are untouched and `npm run dictation` still builds. **That is still luck and
   not design, and there is a named place where the luck is load-bearing:**
   `tools/arc.mjs` derives its day column from the ENTRY NUMBER and never reads
   this constant, so a non-Monday would leave `docs/ARC.md` wrong while
   `npm run arc:check` printed PASS. Flagged at that file since 74223d2, still
   not fixed, and still correct only while day one is a Monday.

   RULING C'S BLOCK ABOVE IS LEFT AS IT WAS WRITTEN. It records what happened on
   2026-08-24 and it is accurate as history; its *"The site restarts Sunday
   30 August"* is superseded by this block and not by an edit to it (OPERATIONS
   §0, VERBATIM — a paraphrase filed in his class is indistinguishable from his
   own sentence a week later). */
export const RECORD_EPOCH = "2026-09-07";

/* [L4 2026-08-09] EVERY OTHER ENTRY'S DATE IS COUNTED FROM IT, NOT TYPED.
   Mike: "DATES from the epoch: D1 = 2026-08-17 Monday, D2 = 08-18, D3 = 08-19,
   D4 = 08-20, D5 = 08-21."
   [2026-08-24] **HIS DAYS ARE SUPERSEDED BY RULING C AND ARE LEFT AS HE WROTE
   THEM** (OPERATIONS §0 VERBATIM — flag, never fix; a paraphrase filed in his
   class is indistinguishable from his own sentence a week later). The SHAPE of
   what he said is what survived and it is the whole point of this function:
   five consecutive days counted off day one. Against the epoch above, the same
   five days are **D1 = 2026-09-07 Monday, D2 = 09-08, D3 = 09-09, D4 = 09-10,
   D5 = 09-11** — derived, not typed, and nobody edited an entry to get them.
   [2026-08-28] Re-typed for RULING D, and *re-typed* is the right word: this
   list is the one place in the file that quotes derived values, it has now gone
   stale twice, and it is kept only because it is the worked example the
   paragraph is about.
   Five literals would be five things a slip has to
   find; this is the same one-field rule the epoch's own note states, extended
   to the entries that follow it. Day 1 IS the epoch, so `recordDay(1)` and
   `RECORD_EPOCH` are the same string by construction rather than by agreement.
   UTC arithmetic deliberately: a local-midnight Date rolls the day backwards in
   any timezone west of Greenwich, which is how a dateline reads Sunday.

   ═══ [2026-08-24] THE CALENDAR IS DUMB, AND THAT IS MIKE'S RULING ═══════════
   **SED: build for everyday drops, drop on the days you choose.** This function
   is `epoch + (n − 1)` and it will never be anything else — **NO weekend logic,
   NO holiday table, ever.** Which days get a Record is decided by WHICH ENTRIES
   EXIST, and that is Mike writing or not writing.

   SO `n` IS AN OFFSET FROM THE EPOCH AND AN ENTRY'S `no` IS A LABEL. They are
   the same number today only because the first five Records fell on the first
   five days. `tools/dictation/emit-record-entries.mjs` computes the offset from
   the entry's OWN DATE, so an entry dated a week out lands a week out and keeps
   whatever number it has. **A GAP IN THE NUMBERS IS NOT A DEFECT** — 001–005
   followed by 008 means nobody wrote on three days — **and a later round must
   not "fix" one.** Everything that needs an entry's day reads the entry's
   `date`, never its number. */
export function recordDay(n) {
  const d = new Date(RECORD_EPOCH + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + (n - 1));
  return d.toISOString().slice(0, 10);
}
