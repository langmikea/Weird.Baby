/* ===========================================================================
   THE TWELVE-WEEK ARC — the headline of every week, and nothing else.
   [T1 2026-08-07, THE REVEAL MECHANISM + THE 12-WEEK TABLE]
   ---------------------------------------------------------------------------
   MIKE: *"one browser page, the same worksheet form and the same collector, but
   ONLY the weekly headlines — twelve rows, left Ops / right Mike. MARK PLAINLY:
   weeks 1–3 derive from Mike's own dictation; weeks 4–12 are Ops scaffolding,
   and month 3 especially is invented structure awaiting his story."*

   This is a data module for the same reason `week-one.mjs`, `week-two.mjs`,
   `transfers.mjs` and `focus.mjs` are: a list that lives inside a rendering
   function cannot be diffed, cannot be checked, and becomes the generator's
   opinion. `tools/dictation/worksheet.mjs` reads this and writes nothing back.

   ═══ TWO AXES, AND CONFLATING THEM IS THE FIRST MISTAKE ANYONE WILL MAKE ════
   The instruction asks for a marking the rail scheme cannot express, so both
   are carried and they answer different questions.

     `rail`   WHOSE SENTENCE IS THIS? The standing three-mark scheme —
              OPS (blue) · VERBATIM (gold) · MIKE-NAMED (amber).
     `band`   IS THERE ANYTHING OF HIS UNDER IT? Mike's own marking, this
              round: DICTATED (weeks 1–3) or SCAFFOLD (weeks 4–12), with the
              month-3 rows additionally flagged `invented`.

   A week can be blue and DICTATED at once — week 1 is exactly that: he spoke
   the shape and Ops wrote every word of the headline. And a week could in
   principle be gold and SCAFFOLD, though none is. Collapsing the two would
   either promote Ops' sentences into his mouth or bury the fact that three
   weeks have real material under them.

   ═══ WHY ELEVEN ROWS ARE BLUE AND ONE IS GOLD ══════════════════════════════
   Mike presented all twelve as *"Ops' left column ... from the arc as it
   stands"*, and named weeks 4–12 as Ops scaffolding. So the default is blue.

   WEEK 2 IS THE EXCEPTION AND IT IS NOT A JUDGEMENT MADE THIS ROUND. Its
   headline is carried in `week-two.mjs` with `headlineVerbatim: true`, put
   there by the round before this one from a written instruction, and the string
   Mike typed in THIS instruction is byte-identical to it. Demoting it to blue
   because a later instruction listed it under a blue heading would be the
   inverse error the rails exist to prevent: *his own sentence left in blue gets
   quietly "improved" by the next round and nothing can tell it was ever his.*

   WEEK 3 IS THE ONE OPS CANNOT SETTLE. *"IT IS BEAUTIFUL AND IT DOES NOTHING"*
   arrives in his characters, and he groups week 3 with weeks 1 and 2 as
   deriving from his dictation — but weeks 1 and 2 carry DIFFERENT rails, so
   the grouping does not say which. It is blue, because a paraphrase wearing
   gold is indistinguishable a week later from something he said, and the row
   is `R-c` in `docs/OPEN_ACTIONS.md`. **One word moves it.**

   ═══ WEEKS 1 AND 2 ARE IMPORTED, NOT RETYPED ═══════════════════════════════
   Doctrine 17. Their headlines already exist in two files that a page already
   renders; a third copy would be a third thing to keep in step, and the one it
   would fall out of step with is the one marked VERBATIM. What was checked by
   hand, once, is that the strings in Mike's instruction MATCH those two files
   character for character. They do — see `CHECKS.A-6`.
   =========================================================================== */
import { WEEK as WEEK1 } from "./week-one.mjs";
import { WEEK as WEEK2 } from "./week-two.mjs";
import { BUCKETS } from "./focus.mjs";
import { TRANSFERS } from "./transfers.mjs";

/* ── PROVENANCE ─────────────────────────────────────────────────────────── */
export const ORIGIN = {
  rail: "OPS",
  writtenOn: "2026-08-07",
  by: "Mike, in writing; the twelve headlines relayed as Ops' column",
  rule:
    "Mike supplied all twelve headlines in the round instruction of 2026-08-07 "
    + "and described them as Ops' left column, from the arc as it stands. He "
    + "marked weeks 1–3 as deriving from his own dictation and weeks 4–12 as Ops "
    + "scaffolding, month 3 especially. Week 2's headline is the one string here "
    + "carried as VERBATIM, and that is inherited from reveal/week-two.mjs rather "
    + "than decided here.",
  bandRule:
    "The band says what is UNDER a headline, not who wrote it. DICTATED means "
    + "there is material of Mike's behind the week; SCAFFOLD means there is not. "
    + "Neither is a claim about the words.",
};

/* ── THE THREE MONTHS ────────────────────────────────────────────────────
   Mike's arc, as `reveal/transfers.mjs` already records it in its own header:
   month 1 the arrival · month 2 the turn, where the units get understood and
   stop being the point · month 3 the reckoning. Restated here as a span so a
   row can carry its month; the sentences are that file's. */
export const MONTHS = [
  { n: 1, weeks: [1, 4], name: "THE ARRIVAL" },
  { n: 2, weeks: [5, 8], name: "THE TURN — the units get understood and stop being the point" },
  { n: 3, weeks: [9, 12], name: "THE RECKONING" },
];
export const monthOf = n => MONTHS.find(m => n >= m.weeks[0] && n <= m.weeks[1]);

/* ── THE BANDS — Mike's own marking instruction ──────────────────────────── */
export const BANDS = {
  DICTATED: {
    key: "DICTATED",
    weeks: [1, 2, 3],
    label: "derives from your own dictation",
    means:
      "There is material of yours behind this week — spoken on 2026-08-02 or "
      + "written on 2026-08-07. It does not mean the sentence is yours; see the "
      + "rail beside it.",
  },
  SCAFFOLD: {
    key: "SCAFFOLD",
    weeks: [4, 12],
    label: "Ops scaffolding",
    means:
      "Nothing of yours is under this week. The headline is a shape to argue "
      + "with, and arguing with a draft is faster than starting from a blank "
      + "line — which is the only reason it exists.",
  },
  /* not a third band: an emphasis Mike put on the tail of the second */
  INVENTED: {
    key: "INVENTED",
    weeks: [9, 12],
    label: "invented structure awaiting your story",
    means:
      "Month 3 especially. These four are not even a shape you gave — they are "
      + "the shape a three-act arc has, with your subject not yet in it.",
  },
};

/* ── THE TWELVE ──────────────────────────────────────────────────────────
   `headline` for weeks 1 and 2 is imported and never retyped.
   `rail`  OPS | VERBATIM
   `band`  DICTATED | SCAFFOLD    `invented` true on month 3
   `reach` the transfer class the week's material would sit in, so a row can be
           checked against `reveal/transfers.mjs` rather than asserted. It is
           DERIVED from what the headline is about and it is not authored — a
           week about opening a thing already held reaches UNLOCK; a week about
           a box reaches PACKAGE.                                             */
export const WEEKS = [
  {
    n: 1, headline: WEEK1.headline, rail: "OPS", band: "DICTATED",
    from: "reveal/week-one.mjs", days: 5, reach: ["BLAST", "UNLOCK"],
  },
  {
    n: 2, headline: WEEK2.headline, rail: "VERBATIM", band: "DICTATED",
    from: "reveal/week-two.mjs", days: 5, reach: ["UNLOCK", "PACKAGE"],
  },
  {
    n: 3, headline: "IT IS BEAUTIFUL AND IT DOES NOTHING", rail: "OPS", band: "DICTATED",
    from: null, days: 0, reach: ["PACKAGE"],
    note: "The first week whose subject is an object rather than a file.",
  },
  {
    n: 4, headline: "IT BOOTS, AND IT HAS OPINIONS", rail: "OPS", band: "SCAFFOLD",
    from: null, days: 0, reach: ["PACKAGE", "UNLOCK"],
  },
  {
    n: 5, headline: "THE SECOND UNIT IS A DIFFERENT PERSON", rail: "OPS", band: "SCAFFOLD",
    from: null, days: 0, reach: ["PACKAGE"],
  },
  {
    n: 6, headline: "THE FOURTH BOX IS ALREADY IN THE HALLWAY", rail: "OPS", band: "SCAFFOLD",
    from: null, days: 0, reach: ["PACKAGE"],
    note: "Names a FOURTH box inside the package window — see A-1.",
  },
  {
    n: 7, headline: "THE FOURTH ONE FINISHES SOMETHING", rail: "OPS", band: "SCAFFOLD",
    from: null, days: 0, reach: ["PACKAGE"],
    note: "The last Friday of the package window — see A-1.",
  },
  {
    n: 8, headline: "HE HAS BEEN WATCHING THE WHOLE TIME", rail: "OPS", band: "SCAFFOLD",
    from: null, days: 0, reach: ["TRANSMISSION"],
  },
  {
    n: 9, headline: "THE MACHINES KNOW EACH OTHER", rail: "OPS", band: "SCAFFOLD",
    from: null, days: 0, reach: ["TRANSMISSION", "UNLOCK"], invented: true,
  },
  {
    n: 10, headline: "THE PEOPLE IN THE CASES", rail: "OPS", band: "SCAFFOLD",
    from: null, days: 0, reach: ["TRANSMISSION"], invented: true,
  },
  {
    n: 11, headline: "WHAT THIS WAS FOR", rail: "OPS", band: "SCAFFOLD",
    from: null, days: 0, reach: ["TRANSMISSION"], invented: true,
  },
  {
    n: 12, headline: "WHAT WE STILL DON'T KNOW", rail: "OPS", band: "SCAFFOLD",
    from: null, days: 0, reach: ["TRANSMISSION"], invented: true,
  },
];

/* ── CHECKS AGAINST THE TREE ─────────────────────────────────────────────
   Same contract as week one's and week two's: each `check` is a claim about
   this repository and `derivedFrom` names the file that settles it. A check
   with `open` is a decision for Mike; a check without is an agreement, and the
   agreements are here because an agreement that is never printed gets
   re-litigated. NOTHING HERE RESOLVES ANYTHING — resolving is authoring.     */
export const CHECKS = [
  {
    id: "A-1",
    title: "The headlines answer a question the transfer model says is not in the arc.",
    check:
      "PACKAGE opens at week 3 and closes at week 7 — FIVE weeks carrying FOUR "
      + "Fridays — and `transfers.mjs` states in its own header that WHICH WEEK "
      + "GOES EMPTY IS NOT IN THE ARC, so no package row carries a week. But week "
      + "6 says the FOURTH box is already in the hallway and week 7 says the "
      + "fourth one finishes something. Read straight, that puts the four "
      + "arrivals on the Fridays of weeks 3, 4, 5 and 6, and makes WEEK 7 THE "
      + "EMPTY ONE — an answer to a question the model deliberately left open.",
    derivedFrom: "reveal/transfers.mjs (TRANSFERS.PACKAGE.opens = 3, closes = 7)",
    open:
      "Is that the reading? If it is, four package rows can carry a week and "
      + "check (b) of the transfer rule stops being blocked for them. If it is "
      + "not — if the fourth box arrives at week 7 and week 6 is a week of "
      + "waiting for it — then week 3 or week 4 is the empty one instead. Ops "
      + "will not pick: it is a fact about your story, and `transferWeek` is the "
      + "field the whole show-before-it-lands check is built on.",
  },
  {
    id: "A-2",
    title: "Week 3 is about a thing you already have, which is an argument for X-1's third answer.",
    check:
      "X-1 is open: week two's Friday is a box on a porch and PACKAGE does not "
      + "open until week 3. Seen across twelve weeks the tension reads "
      + "differently — week 3's whole subject is an object that is beautiful and "
      + "does nothing, which is a thing you are LOOKING AT, so it was in the "
      + "building before week 3 began. That is X-1's third reading (an "
      + "unlabelled box on a porch is not a package) arriving from a second "
      + "direction.",
    derivedFrom: "reveal/week-two.mjs (COLLISIONS X-1) · this file's week 3",
    open:
      "X-1's three ways out are unchanged and still yours. This adds no fourth; "
      + "it says the third one now has two arguments for it instead of one.",
  },
  {
    id: "A-3",
    title: "Twelve weeks is the first period long enough to give the bouncy ball law an arc figure.",
    check:
      "The PRECIOUS bucket's ceiling is two or three a WEEK. Over twelve weeks "
      + "that is 24 TO 36 GENUINE REVEALS IN THE WHOLE ARC — the total the story "
      + "has to spend, before anything is assigned. READ THE ARITHMETIC "
      + "CAREFULLY, BECAUSE IT IS NOT THE VOIDED ONE: this multiplies a CEILING "
      + "by a PERIOD and never touches an asset count. The void figure divided a "
      + "count of PHOTOGRAPHS by a ceiling on ATTENTION, which is the error, and "
      + "it is the reason `runways()` refuses to produce a runway for the dump "
      + "bucket at all.",
    derivedFrom: "reveal/focus.mjs (BUCKETS.precious.min/max, per: week)",
    open: null,
    also:
      "And nothing is assigned: `bucket` is null on all 315 rows of the asset "
      + "table (B-a). So the arc has a spending limit and no inventory priced "
      + "against it.",
  },
  {
    id: "A-4",
    title: "Week 8 is transmission-shaped and sits inside the transmission window.",
    check:
      "TRANSMISSION opens at week 5 and closes at 12 — *the back half's knock at "
      + "the door* — and week 8, HE HAS BEEN WATCHING THE WHOLE TIME, is the "
      + "first headline in the twelve whose subject is a sender rather than an "
      + "object. It lands four weeks inside the window. Unlike X-1 nothing has "
      + "to move.",
    derivedFrom: "reveal/transfers.mjs (TRANSFERS.TRANSMISSION.opens = 5)",
    open: null,
  },
  {
    id: "A-5",
    title: "Two of the twelve weeks have days under them and ten do not.",
    check:
      "`week-one.mjs` and `week-two.mjs` carry five days each — ten day blocks, "
      + "thirty slots on the worksheet. WEEKS 3 TO 12 HAVE NO DAY-LEVEL OUTLINE "
      + "IN EITHER REPOSITORY, which is why this page asks only for headlines: "
      + "asking for fifty more days would be asking you to fill in a form Ops "
      + "built out of nothing.",
    derivedFrom: "reveal/week-one.mjs · reveal/week-two.mjs",
    open: null,
  },
  {
    id: "A-6",
    title: "The twelve-week list and the two week files agree exactly, and that could have failed.",
    check:
      "The headlines for weeks 1 and 2 in the round instruction were compared "
      + "character for character against `WEEK.headline` in `week-one.mjs` and "
      + "`week-two.mjs`. Both match — including the apostrophe in WASN'T. So the "
      + "twelve-week view has not quietly re-worded two weeks that already "
      + "existed, and this file IMPORTS both rather than restating them, so it "
      + "cannot start to.",
    derivedFrom: "reveal/week-one.mjs · reveal/week-two.mjs · this file's imports",
    open: null,
  },
];

/* ── DERIVED, FOR THE PAGE ───────────────────────────────────────────────── */
/** The arc's whole precious budget: the ceiling multiplied by the period.
 *  NOT the voided arithmetic — see A-3. No asset count enters this. */
export function preciousBudget(weeks = WEEKS.length) {
  const P = BUCKETS.precious;
  return { weeks, min: P.min * weeks, max: P.max * weeks, per: P.per };
}

/** The transfer windows, expressed as week spans so the page can draw them
 *  beside the twelve. Read off `transfers.mjs`; nothing is restated. */
export function windows() {
  return Object.entries(TRANSFERS).map(([k, t]) => ({
    cls: k, opens: t.opens, closes: t.closes, week: t.week, name: t.name,
  }));
}
