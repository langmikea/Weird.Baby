/* ===========================================================================
   THE BOUNCY BALL LAW — CORRECTED, AND THE TWO BUCKETS UNDER IT.
   [B1 2026-08-07 — Mike, correcting the reading this repository had been
   measuring against since 2026-08-02]
   ---------------------------------------------------------------------------
   ═══ THE CORRECTION, WHICH IS A CHANGE OF UNIT AND NOT A CHANGE OF NUMBER ═══
   The law was carried in `reveal/week-one.mjs` as a MIKE-NAMED standing rule
   and read, verbatim:

     "THE BOUNCY BALL LAW: never more than two or three offerings in a day."

   Nothing about that sentence is false. What was wrong was the UNIT every
   reader of it supplied, and Ops supplied the wrong one twice — once in the
   rule's own `bearing` line ("a hard ceiling on what any single entry may put
   in front of a reader") and once, expensively, in the tracker, which divided a
   count of PHOTOGRAPHS by the ceiling and printed a runway in days.

   MIKE, 2026-08-07: THE LAW CAPS POINTS OF FOCUS, NOT ASSETS. Humans remember
   one or two things; ten things reduces the odds they keep the one that
   matters. IT DOES NOT MEAN WE MAY NOT SHOW MORE PICTURES.

   Read the two halves apart, because the second is the one the trackers broke:
   the law is a constraint on ATTENTION, and attention is not divisible by file
   count. Ten manual pages arriving is ONE point of focus — *we got more of the
   manual* — and a reader carries away one thing from it whether the day showed
   ten pages or forty. Counting those ten against a ceiling of three describes a
   day nobody would experience.

   ═══ THE TWO BUCKETS ═══════════════════════════════════════════════════════
   Mike's, and they are a partition: everything the museum can put in front of a
   reader is in exactly one.

     PRECIOUS   Two or three genuine reveals A WEEK. These are what a reader
                remembers, and the ceiling is on THEM.
     DUMP       Everything else. Fun to look at, part of the story, part of the
                pile. NO CEILING. A batch is one point of focus regardless of
                its size.

   NOTE THE PERIOD CHANGED WITH THE UNIT AND WAS NOT MEANT TO BE MISSED. The
   old sentence said "in a day". The ceiling on precious reveals is TWO OR THREE
   A WEEK. Both halves of the correction move the same way — the law is
   scarcer than it was read as being about the things that count, and it is
   silent about the things that do not.

   ═══ WHY THIS IS A DATA MODULE AND NOT A PARAGRAPH IN THE TRACKER ══════════
   The same reason `transfers.mjs` and `week-one.mjs` are: a rule that lives
   inside a rendering function cannot be diffed, cannot be checked, and quietly
   becomes the generator's opinion — which is precisely the failure this file
   exists to correct. `tools/dictation/prep.mjs` reads this and writes nothing
   back to it.

   ═══ WHAT A RUNWAY MAY AND MAY NOT SAY ═════════════════════════════════════
   `runways()` below is deliberately unable to produce the void figure. Two
   numbers, two different kinds:

     PRECIOUS REVEALS REMAINING   a count with a ceiling over it, so it divides
                                  into WEEKS and the arithmetic means something.
     WHAT IS IN THE DUMP          a count with NO ceiling over it, so it does
                                  NOT divide into anything. It is a pile size.
                                  Printing weeks for it would re-commit the
                                  original error in the other bucket.

   AND THE THIRD NUMBER IS THE HONEST ONE TODAY: UNASSIGNED. A bucket is a
   judgement about whether a reader will remember a thing, and that judgement is
   Mike's — `bucket` is a JUDGED field on the asset table beside `verdict` and
   `revealArc`, unset by default, and Ops never writes it. Until he assigns,
   every runway is bounded rather than known, and `runways()` reports the bound
   as a bound. Doctrine 12: the gap prints as a gap.
   =========================================================================== */

/* ── PROVENANCE ─────────────────────────────────────────────────────────── */
export const ORIGIN = {
  rail: "MIKE-NAMED",
  namedOn: "2026-08-02",
  correctedOn: "2026-08-07",
  by: "Mike, aloud; recorded by Ops",
  rule:
    "Mike named the law and then corrected the unit it is measured in. The LAW "
    + "and the two BUCKETS are his, including the words 'precious' and 'dump' and "
    + "the reason ('humans remember one or two things'). The sentences below are "
    + "Ops', the mechanism is Ops', and the assignment of any particular asset to "
    + "a bucket is his and is unset.",
};

/* ── THE LAW ────────────────────────────────────────────────────────────── */
export const LAW = {
  name: "THE BOUNCY BALL LAW",
  caps: "POINTS OF FOCUS",
  notCaps: "ASSETS",
  statement:
    "Never more than two or three points of focus. The law caps what a reader is "
    + "asked to hold, not what the museum is allowed to show.",
  because:
    "Humans remember one or two things. Ten things reduces the odds they keep the "
    + "one that matters.",
  doesNotMean:
    "It does not mean we may not show more pictures. Ten manual pages arriving is "
    + "ONE point of focus — we got more of the manual — not ten.",
};

/* ── THE BUCKETS ────────────────────────────────────────────────────────── */
export const BUCKETS = {
  precious: {
    key: "precious",
    name: "THE PRECIOUS BUCKET",
    holds: "Genuine reveals. These are what a reader remembers.",
    /* the ceiling, and its period. `per` is what the old reading got wrong
       alongside the unit, so it is a field rather than a sentence. */
    min: 2, max: 3, per: "week",
    ceiling: "Two or three a week.",
    runway: true,
  },
  dump: {
    key: "dump",
    name: "THE DUMP BUCKET",
    holds:
      "Everything else. Fun to look at, part of the story, part of the pile.",
    min: null, max: null, per: null,
    ceiling: "No ceiling. A batch of any size is one point of focus.",
    runway: false,
  },
};
export const BUCKET_KEYS = ["precious", "dump"];

/** The bucket a table row has been assigned, or null for unassigned.
 *  READS AND NEVER DERIVES. There is no heuristic here on purpose: guessing
 *  that a photograph of a machine is precious and a manual page is dump would
 *  be Ops making the one judgement this law reserves for Mike, and it would
 *  make every runway below look answered when nothing has been answered. */
export function bucketOf(row) {
  const b = row && row.bucket;
  return BUCKET_KEYS.includes(b) ? b : null;
}

/** Split any set of asset-table rows into the two buckets and the unassigned.
 *  `n` is the whole population so a caller cannot print a share of a total it
 *  did not measure. */
export function split(rows) {
  const precious = [], dump = [], unassigned = [];
  for (const r of rows || []) {
    const b = bucketOf(r);
    (b === "precious" ? precious : b === "dump" ? dump : unassigned).push(r);
  }
  return { precious, dump, unassigned, n: (rows || []).length };
}

/* ── THE TWO RUNWAYS ────────────────────────────────────────────────────── */
/**
 * THE HONEST TWO-NUMBER VERSION. It replaces `waiting / 3` and `waiting / 2`,
 * which counted assets against a ceiling on points of focus and produced
 * "16 pictures = 6–8 days" — a figure Mike has voided.
 *
 * Returns, for a population of asset-table rows:
 *
 *   precious.n        assigned precious — the count with a ceiling over it
 *   precious.weeks    { min, max } weeks of runway at 3 and at 2 a week, or
 *                     null when nothing is assigned (NOT zero: zero is a
 *                     measurement and this is an absence)
 *   dump.n            assigned dump — a pile size, and `weeks` is ALWAYS null
 *                     because the bucket has no ceiling to divide by
 *   unassigned.n      the honest state today
 *   bound             what the precious runway COULD be, at the two extremes
 *                     of assigning the unassigned set. It is an envelope, it is
 *                     labelled as one, and it exists so the page can say
 *                     something true rather than nothing at all.
 */
export function runways(rows) {
  const s = split(rows);
  const P = BUCKETS.precious;
  const weeksFor = n => (n > 0 ? { min: Math.ceil(n / P.max), max: Math.ceil(n / P.min) } : null);
  return {
    precious: { n: s.precious.length, weeks: weeksFor(s.precious.length), rows: s.precious },
    dump: { n: s.dump.length, weeks: null, rows: s.dump },
    unassigned: { n: s.unassigned.length, rows: s.unassigned },
    n: s.n,
    bound: {
      /* nothing assigned precious → the floor is the assigned count itself */
      floorWeeks: weeksFor(s.precious.length),
      /* everything unassigned turning out precious → the ceiling */
      ceilWeeks: weeksFor(s.precious.length + s.unassigned.length),
      atMost: s.precious.length + s.unassigned.length,
      atLeast: s.precious.length,
    },
  };
}

/* ── THE VOIDED FIGURE, KEPT SO IT CANNOT COME BACK QUIETLY ─────────────── */
/* A superseded number that is merely deleted comes back the next time somebody
   does the obvious arithmetic. This is the record of what it was, what produced
   it, and why it is wrong — the same service `retired.*` does in the ledger. */
export const VOIDED = {
  figure: "16 pictures = 6–8 days of material (1.1–1.6 five-day weeks)",
  where: "tools/dictation/prep.mjs, the week-one page; and W-4 in the round log",
  produced: "the count of governed pictures behind the stage door, divided by 3 and by 2",
  why:
    "It counted ASSETS against a ceiling on POINTS OF FOCUS, and it used the day "
    + "rather than the week. Sixteen photographs released in four batches are four "
    + "points of focus, not sixteen — and if the batches are dump they may not be "
    + "points of focus at all. The arithmetic was sound and the unit was wrong, "
    + "which is why nothing caught it: every input was a real measurement.",
  voidedBy: "Mike, 2026-08-07",
};
