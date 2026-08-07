/* ===========================================================================
   WEEK TWO — the story outline, on the BLUE RAIL with a GOLD SEAM.
   [W1–W8 2026-08-07, THE WORKSHEET]
   ---------------------------------------------------------------------------
   Companion to `reveal/week-one.mjs` and built to the same law: the SHAPE is
   Mike's, the SENTENCES are Ops', nothing is quoted unless it is marked as
   quoted, and every claim this file makes about the repository is a check the
   reader can go and disagree with.

   ═══ ONE THING IS DIFFERENT FROM WEEK ONE, AND IT IS THE IMPORTANT ONE ═════
   Week one was spoken aloud on 2026-08-02 and Ops wrote it down from memory of
   the framing, so NOT ONE LINE of `week-one.mjs` is his wording and the gold
   rail there is empty by construction.

   WEEK TWO ARRIVED IN WRITING. Mike gave the week's headline and six beats in
   the round instruction of 2026-08-07, in his own characters, and they are
   still sitting in the instruction. So this file carries a `beat` field that
   is VERBATIM — copied character for character, never re-typed from memory —
   and the page renders it with a gold mark. Everything else here is Ops'.

   THE DISTINCTION IS THE WHOLE POINT OF HAVING RAILS. A paraphrase wearing
   gold is indistinguishable a week later from something he actually said. The
   inverse error is just as bad and is the one this file exists to avoid: his
   own sentence rendered in blue, so that next week nobody can tell it from
   Ops' scaffolding and it gets "improved."

   RULE FOR ANYONE EDITING THIS FILE: a `beat` string may be DELETED but never
   REWORDED. If it needs different words it is not a beat any more — move it
   into `headline`, `shape` or `topics`, where Ops' wording belongs.

   ═══ THE ONE STRUCTURING DECISION, NAMED ══════════════════════════════════
   Six beats, five days, and Friday is fixed by the sixth. That leaves five
   beats for four days, so exactly one merge was required.

   MERGED: "the unlabeled table holding more codes" + "the codes that fail when
   typed directly" share day 4, because they are the same object — a table of
   codes and the property those codes have. Any other pairing would have put
   two different objects in one day.

   That is the only division Ops made and it is the only one worth arguing
   with. Nothing else here re-orders his beats; days 1–3 and 5 are his own
   sequence, in his own order.

   ═══ WHAT IS DELIBERATELY NOT HERE ════════════════════════════════════════
   No weighting. There is still no `weight` field on anything story-shaped in
   either repository (K-b), so the topic lists below are LISTS, not rankings,
   exactly as week one's are. Ops will not invent a ranking, for the same
   reason it will not invent a bucket (B-a): a made-up order would make the
   page read as answered while nothing had been answered.
   =========================================================================== */

/* ── PROVENANCE ─────────────────────────────────────────────────────────── */
export const ORIGIN = {
  rail: "OPS",
  writtenOn: "2026-08-07",
  recordedOn: "2026-08-07",
  by: "Mike, in writing; divided into days and written up by Ops",
  rule:
    "Mike gave the week's headline and six beats in writing on 2026-08-07. Those "
    + "exact strings are carried in the `beat` field and in `WEEK.headline`, "
    + "character for character, and are marked as his. Ops divided the beats into "
    + "five days — one merge, named in the header — and wrote every other sentence "
    + "on this page.",
  verbatimPolicy:
    "A `beat` is quoted material and may be deleted but never reworded. Ops' "
    + "wording lives in `headline`, `shape` and `topics`.",
};

/* ── THE WEEK ───────────────────────────────────────────────────────────── */
export const WEEK = {
  n: 2,
  headline: "THE PASSWORD WAS IN THE ROOM THE WHOLE TIME",
  /* his characters, so the page marks it and nothing rewords it */
  headlineVerbatim: true,
  days: 5,
  span: "Monday to Friday",
  spanRule:
    "Five, for the same standing rule week one is five: the Record rests on "
    + "weekends and the team does not.",
};

/* ── THE FIVE DAYS ───────────────────────────────────────────────────────
   `beat` is Mike's, verbatim. `headline`, `shape` and `topics` are Ops'.
   `reach` names the transfer class the day's material sits in, so the day can
   be checked against `reveal/transfers.mjs` rather than asserted. */
export const DAYS = [
  {
    n: 1, dow: "MON", attr: "OPS",
    beat: "inside the zip",
    headline: "What was actually in it.",
    shape:
      "Friday ended with one zip open and nothing said about what was in it. This "
      + "is the day that says. It is a contents day and it does not have to "
      + "explain anything yet — knowing what is in the box is a different thing "
      + "from knowing what the box is for.",
    topics: [
      "The contents, listed.",
      "What opened it, and why that password and not the others.",
      "What is readable and what is not.",
    ],
    reach: ["UNLOCK"],
  },
  {
    n: 2, dow: "TUE", attr: "OPS",
    beat: "the artifacts",
    headline: "The things in it that are objects, not data.",
    shape:
      "The half of the contents that is not a file — the things that were "
      + "photographed, scanned or shipped as pictures of something somebody was "
      + "holding. This is the first day of week two with anything to LOOK at, "
      + "which makes it the first day a genuine reveal could be spent.",
    topics: [
      "What the artifacts are.",
      "What they are of.",
      "Which of them raise a question the week then has to carry.",
    ],
    reach: ["UNLOCK", "BLAST"],
  },
  {
    n: 3, dow: "WED", attr: "OPS",
    beat: "the red herrings",
    headline: "What looked like the way in, and is not.",
    shape:
      "A subtraction day, and the standing status rule is what makes it a day "
      + "rather than a wait: a reader can be told what has been RULED OUT and come "
      + "away with more than they had. It also buys the week its honesty — a "
      + "search that never reports a dead end is not a search.",
    topics: [
      "What was tried.",
      "What it looked like it would be.",
      "What it turned out to be instead.",
    ],
    reach: ["UNLOCK"],
  },
  {
    n: 4, dow: "THU", attr: "OPS",
    /* THE MERGE — see the header. Two of his beats, one object. */
    beat: "the unlabeled table holding more codes",
    beat2: "the codes that fail when typed directly",
    merged: true,
    headline: "A table of codes, and every one of them refuses.",
    shape:
      "The object and its property, in one day, because they are one object: a "
      + "table nobody labelled, full of codes, and the codes do not work when they "
      + "are typed in. That refusal is the day's whole content — it means there is "
      + "a step nobody has found yet, and saying so is a status report, not a "
      + "cliffhanger.",
    topics: [
      "The table: where it was, and what makes it unlabelled.",
      "The codes: how many, what shape.",
      "The refusal: what happens when one is typed straight in.",
    ],
    reach: ["UNLOCK"],
  },
  {
    n: 5, dow: "FRI", attr: "OPS",
    beat: "Friday 4pm: a box on the porch with no shipping label",
    headline: "Four o'clock, and it is on the porch.",
    shape:
      "Built to the Friday formula he named: the entry summarises the week's last "
      + "day the way any other day's entry would, and then four o'clock happens "
      + "INSIDE the same entry. Not a trailer and not a to-be-continued. This is "
      + "also the week's one arrival — everything before it was already in the "
      + "building.",
    topics: [
      "The day's work, summarised as any day's would be.",
      "Four o'clock: the box.",
      "No shipping label — what that is and is not evidence of.",
    ],
    reach: ["PACKAGE"],
    /* the one place the outline and the transfer model disagree; see X-1 */
    collides: "X-1",
  },
];

/* ── COLLISIONS — checks against the tree, named and not resolved ─────────
   Same contract as week one's: each `check` is a claim about the repository
   and `derivedFrom` names the file that settles it. */
export const COLLISIONS = [
  {
    id: "X-1",
    title: "The porch box arrives a week before the packages start.",
    check:
      "Friday of week two is a physical arrival — a box, on a porch. The transfer "
      + "model puts every physical arrival in class PACKAGE and opens that window "
      + "at WEEK 3, closing at 7, on four Fridays; a box holding a unit is "
      + "`phys.cases` / `phys.niac.whole` by the model's own note. So week 2 day 5 "
      + "sits one week outside the window, and it is the only beat in either week "
      + "that does. Everything else in week two is UNLOCK, which needs no arrival.",
    derivedFrom: "reveal/transfers.mjs (TRANSFERS.PACKAGE.opens = 3)",
    open:
      "Three ways out and all three are yours: move the box to week 3 and let "
      + "week 2 end on the codes; open the PACKAGE window at week 2 and make it "
      + "five Fridays instead of four; or rule that this box is not a package — "
      + "an unlabelled box on a porch has no carrier and no manifest, and the "
      + "model's classes are about how material REACHED the museum, not about "
      + "cardboard.",
    also:
      "The third reading is the cheapest and probably the truest to what you "
      + "wrote: 'no shipping label' is the sentence that makes it not a delivery. "
      + "But it is a change to the transfer model's own boundary and Ops will not "
      + "make one of those on an inference.",
  },
  {
    id: "X-2",
    title: "Week two's spine is UNLOCK, and UNLOCK needs no arrival at all.",
    check:
      "Days 1 to 4 are all about opening, reading and failing to read things that "
      + "are already in the building. The transfer model defines UNLOCK as “things "
      + "already held that could not be opened. No arrival needed,” with its window "
      + "open from week 0. Four of the five days therefore cost the story nothing "
      + "new, which is what makes a whole week of them affordable.",
    derivedFrom: "reveal/transfers.mjs (TRANSFERS.UNLOCK)",
    open: null,
  },
  {
    id: "X-3",
    title: "The week's headline is the UNLOCK class stated as a sentence.",
    check:
      "“The password was in the room the whole time” and “things already held that "
      + "could not be opened” are the same claim in two registers — one written by "
      + "Mike for the story, one written by Ops for the ledger on 5 August, neither "
      + "from the other. The agreement is not arranged and it is worth knowing "
      + "about, because it means the week's title does not need defending against "
      + "the model.",
    derivedFrom: "reveal/transfers.mjs (TRANSFERS.UNLOCK) · this file's WEEK.headline",
    open: null,
  },
  {
    id: "X-4",
    title: "Two Fridays, two payoffs, and the standing rule already said so.",
    check:
      "Week one ends on a password that was short enough; week two ends at four "
      + "o'clock on a porch. That is the Friday formula twice, and the rule Mike "
      + "named says explicitly that it is a FORM and not a one-off: the entry "
      + "summarises the day, then four o'clock happens inside it, and it is never "
      + "“to be continued.” Two weeks is the first evidence the form holds.",
    derivedFrom: "reveal/week-one.mjs (FRIDAY_FORMULA)",
    open: null,
  },
  {
    id: "X-5",
    title: "Week two is where a genuine reveal would be spent, and no asset is "
      + "assigned to a bucket.",
    check:
      "Day 2 is the first day in either week whose subject is things to LOOK at. "
      + "The bouncy ball law caps the PRECIOUS bucket at two or three a week — and "
      + "`bucket` is null on all 315 rows of the asset table, so nothing in the "
      + "museum knows which of its files is a genuine reveal and which is dump. "
      + "This is not a defect in the outline; it is the outline reaching the one "
      + "open question that would tell it what it may show.",
    derivedFrom: "reveal/focus.mjs · provenance/asset-table.json",
    open: null,
    also: "This is B-a in OPEN_ACTIONS, restated at the point where it bites. Ops "
      + "does not derive the bucket and this check does not either.",
  },
];
