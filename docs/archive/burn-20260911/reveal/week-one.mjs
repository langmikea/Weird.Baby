/* ===========================================================================
   WEEK ONE — the story outline, on the BLUE RAIL. [W1 2026-08-07]
   ---------------------------------------------------------------------------
   K5 asked for "week 1 as it stands" and correctly refused to write it: no
   authored day-by-day outline existed in either repository, so the frame was
   built and every content slot was left empty (K-b). THIS FILE FILLS THE BLUE
   HALF OF THOSE SLOTS AND ONLY THE BLUE HALF.

   ═══ WHOSE MATERIAL THIS IS, STATED ONCE AND CARRIED ON EVERY ROW ══════════
   Mike spoke the week's shape aloud on 2026-08-02. OPS STRUCTURED IT. That is
   the whole provenance and it is why every row here is `OPS` and renders on the
   blue rail: the SHAPE is his, the SENTENCES are Ops'.

   NOTHING IN THIS FILE IS QUOTED. Not one line claims to be his words. The
   distinction matters more than it looks: a paraphrase that renders in gold is
   indistinguishable, a week later, from something he actually said — and that
   is the exact failure mode K5 refused to create. The gold rail on the page
   stays EMPTY until he dictates into it.

   Two grades of attribution, and they are not the same thing:

     OPS        Ops structured it from his spoken framing. The default.
     MIKE-NAMED He named the RULE as a rule — the Friday formula, the standing
                Record rules, the bouncy ball law. The rule is his; the wording
                below is still Ops'. It renders blue with the attribution
                printed, not gold, for the reason above.

   The ONE genuinely verbatim sentence anywhere near week one is the asset
   timeline's founding sentence, and it is not in this file — it lives in
   `reveal/transfers.mjs` with its source named, and the page prints it from
   there.

   ═══ WHY IT IS DATA AND NOT PROSE IN THE GENERATOR ═════════════════════════
   Same reason `reveal/transfers.mjs` is data: the outline is story material
   with a provenance, and story material that lives inside a rendering function
   cannot be diffed, cannot be checked against the ledger, and quietly becomes
   the generator's opinion. `tools/dictation/prep.mjs` reads this and writes
   nothing back to it.

   ═══ AND IT COLLIDES WITH THE TREE IN PLACES, WHICH IS THE POINT ═══════════
   `COLLISIONS` below are checks run against what the repository actually holds
   — the transfer classes, the ledger, the one Record entry that exists. They
   are NAMED, NOT RESOLVED. Resolving one is an authoring decision and it is
   his; printing one is Ops doing the only useful thing it can do with an
   outline it did not write.
   =========================================================================== */

/* ── PROVENANCE ─────────────────────────────────────────────────────────── */
export const ORIGIN = {
  rail: "OPS",
  spokenOn: "2026-08-02",
  recordedOn: "2026-08-07",
  by: "Mike, aloud; structured by Ops",
  rule:
    "Mike spoke the week's shape; Ops structured it into a headline, five days, "
    + "topics and standing rules. Nothing here is quoted and nothing here is his "
    + "wording. Where he named a rule as a rule it is marked MIKE-NAMED — the rule "
    + "is his, the sentence is still Ops'.",
};

/* ── THE WEEK ───────────────────────────────────────────────────────────── */
export const WEEK = {
  n: 1,
  headline: "THE WEEKEND THAT WASN'T SUPPOSED TO HAPPEN",
  days: 5,
  span: "Monday to Friday",
  /* five and not seven, off the standing rule below rather than off a guess */
  spanRule:
    "Five, because the Record rests on weekends. The team does not; the Record does.",
};

/* ── THE PRELUDE — the weekend the week is named after ───────────────────
   This is not a day of week one. It is what happened before the museum opened,
   and the outline needs it because four of the five days point back at it. */
export const PRELUDE = [
  {
    at: "Friday, 2pm",
    what: "The email address goes live — one of the last things done before opening.",
  },
  {
    at: "Friday, 4pm",
    what: "The first manifesto arrives, written like someone who had been planning a while.",
  },
  {
    at: "Friday night to Sunday",
    what: "The whole weekend burns. Hourly transmissions, forty-eight hours, gigabytes.",
  },
  {
    at: "Friday night to Sunday",
    what: "What it carries: hex, zips, photographs of old equipment on a tray, shot by "
      + "someone in white gloves.",
  },
  {
    at: "Friday night to Sunday",
    what: "None of it addressed to anyone. Headers spoofed. The sender does not resolve.",
  },
  {
    at: "Sunday night",
    what: "The decision: bring it to them in real time. Weird.Baby Robots is created.",
  },
  {
    at: "Monday",
    what: "The museum opens with one entry, because that is true.",
  },
];

/* ── THE FIVE DAYS ───────────────────────────────────────────────────────
   `reach` names the transfer class each day's topics sit in, so the day can be
   checked against `reveal/transfers.mjs` rather than asserted. It is derived,
   not authored: a day about the weekend reaches BLAST; a day about opening
   something already in hand reaches UNLOCK. */
export const DAYS = [
  {
    n: 1, dow: "MON", attr: "OPS",
    headline: "The museum opens.",
    /* [B2 2026-08-07] THIS USED TO SAY "and holds one entry", WHICH READ AS A
       CLAIM ABOUT THE ENTRY IN THE TREE. Mike ruled 013 a prototype and not day
       one, so day 1's entry is 001 and is unwritten. The day's shape is
       unchanged; what is struck is the implication that it already exists. */
    shape:
      "The Robots wing opened two hours ago and this is its first entry — Record 001, "
      + "which you have not dictated yet. Weird enough to warrant an exhibit is the "
      + "claim the day has to carry, and it is the only claim it has to carry.",
    topics: [
      "The transmissions named but not described.",
      "Why it warranted an exhibit.",
      "What the museum is.",
    ],
    reach: ["BLAST"],
  },
  {
    n: 2, dow: "TUE", attr: "OPS",
    headline: "Hors d'oeuvres, and the announcement of this evening's entrees.",
    shape:
      "A fraction of the weekend, deliberately. The volume is the story and the "
      + "volume is also the reason not to serve it all at once.",
    topics: [
      "The manifesto, and first contact.",
      "The volume — hourly, forty-eight hours, gigabytes.",
      "Headers spoofed, the sender untraceable.",
    ],
    reach: ["BLAST"],
  },
  {
    n: 3, dow: "WED", attr: "OPS",
    headline: "The start of the transmissions: what came, what form, what is unreadable.",
    shape:
      "The first day that is about the material rather than about the event. It ends "
      + "with work starting: cracking software goes on everything tonight.",
    topics: [
      "Formats — hex, zips, photographs.",
      "The white gloves and the tray.",
      "Cracking begins.",
    ],
    reach: ["BLAST"],
  },
  {
    n: 4, dow: "THU", attr: "OPS",
    headline: "What we can see from outside the box.",
    shape:
      "A status day, and the standing rule below is what makes a status day possible "
      + "without opening anything: the box can be reported on from outside.",
    topics: [
      "Status — opened, unopened, unreadable.",
      "The math: four days or four years.",
      "A folder, an envelope, a fuzzy thing in the corner.",
    ],
    reach: ["BLAST"],
  },
  {
    n: 5, dow: "FRI", attr: "OPS",
    headline: "One password was short enough.",
    shape:
      "The week's payoff, and it is built to a form he named — see THE FRIDAY "
      + "FORMULA below. The entry summarises the day, and then four o'clock happens "
      + "inside the same entry.",
    topics: [
      "The day's work.",
      "Four o'clock: the first zip opens.",
    ],
    reach: ["UNLOCK"],
  },
];

/* ── THE FRIDAY FORMULA — his rule, Ops' wording ─────────────────────────── */
export const FRIDAY_FORMULA = {
  name: "THE FRIDAY FORMULA",
  attr: "MIKE-NAMED",
  claim: "It is a form, not a one-off. Fridays are built this way.",
  body: [
    "The entry summarises the day the way any other day's entry would.",
    "Then four o'clock happens INSIDE it — not after it, not next week.",
    "It is never “to be continued.” That is only making people wait.",
    "The reader got everything they came for, and then the floor moves.",
  ],
};

/* ── STANDING RULES FOR THE RECORD — his rules, Ops' wording ─────────────
   These are not week-one rules. They are the Record's form, and they are here
   because four of them change what a week-one day is allowed to be. */
export const RECORD_RULES = [
  {
    rule: "The Record is an end-of-day summary, published in the afternoon.",
    attr: "MIKE-NAMED",
    bearing: "It is written from a day that has already happened. A day's entry can "
      + "know how the day ended.",
  },
  {
    rule: "It rests on weekends. The team never does.",
    attr: "MIKE-NAMED",
    bearing: "Week one is five entries at most, not seven — and work continues across "
      + "the gap, so Monday can inherit a weekend.",
  },
  {
    rule: "Any daily record may run across multiple days.",
    attr: "MIKE-NAMED",
    bearing: "THE DAY COUNT IS NOT THE ENTRY COUNT. The five-day frame is a frame of "
      + "days; it does not promise five entries.",
  },
  {
    rule: "Status can be reported through the box — what has been found, the "
      + "percentage remaining, that there is a folder and a fuzzy thing in the corner.",
    attr: "MIKE-NAMED",
    bearing: "A day can be substantial without opening anything. This is what makes "
      + "day 4 a day rather than a wait.",
  },
  /* [B1 2026-08-07] CORRECTED BY MIKE, AND THE CORRECTION IS A CHANGE OF UNIT.
     This row used to read "never more than two or three offerings in a day" and
     carried a `bearing` calling it "a hard ceiling on what any single entry may
     put in front of a reader" — which is the ASSET reading, and it is wrong. The
     law caps POINTS OF FOCUS. The full statement, the two buckets and the two
     runways are `reveal/focus.mjs`; this row is the story-side pointer at it so
     the outline's own rule list stays complete. */
  {
    rule: "THE BOUNCY BALL LAW: never more than two or three POINTS OF FOCUS — "
      + "and the precious ones are two or three A WEEK.",
    attr: "MIKE-NAMED",
    bearing: "It caps ATTENTION, not pictures. A day may show ten manual pages and "
      + "spend one point of focus doing it — we got more of the manual. What the "
      + "ceiling governs is the PRECIOUS bucket: the genuine reveals a reader "
      + "remembers. Everything else is the dump, and the dump has no ceiling.",
  },
];

/* ── COLLISIONS — checks against the tree, named and not resolved ─────────
   Each `check` is a claim this file makes about the repository. `derivedFrom`
   names the file that settles it, so a reader can go and disagree. */
export const COLLISIONS = [
  /* [B2 2026-08-07] CLOSED BY MIKE, WITH AN ANSWER THAT WAS NOT ON THE LIST.
     W-1 offered three readings and every one of them assumed the entry in the
     tree and day one's entry had to be the same entry. Mike answered by
     dissolving that premise: 013 is a PROTOTYPE. The check is kept rather than
     deleted because a collision that was real and got ruled on is worth more
     on the page than a silence, and because W-1's third sentence is still the
     reason the ruling was needed. */
  {
    id: "W-1",
    title: "The one entry that exists is not about the transmissions — and it was "
      + "never meant to be day one.",
    check:
      "Day 1 says the wing opens holding one entry, and that is true of the tree today "
      + "— the Record holds exactly one. But it is entry 013 and its subject is a "
      + "physical delivery: a sealed modern bag, a USB-C adapter, a unit on charge. "
      + "Nothing in it touches a transmission, a manifesto or a weekend.",
    derivedFrom: "reveal/record-entries.mjs · reveal/ledger.json (record.013)",
    open: null,
    ruled:
      "Mike, 2026-08-07: Record 013 was a PROTOTYPE. It was chosen because it was "
      + "interesting enough to find the structure, and it did. It is NOT day one, and "
      + "it needs no re-dating and no defending. THE REAL RECORD STARTS AT 001, when he "
      + "dictates it. So day 1's entry is 001 and does not exist yet; the entry in the "
      + "tree is not in that sequence and no longer collides with the outline.",
    also: "M19 — what a record number means — closes with it: the numbers are THIS "
      + "VOLUME'S OWN and they begin at 001. The prototype keeps its number on the "
      + "glass and is marked as the prototype in Ops' instruments only, never on the "
      + "glass, because a line whose subject is the making of the museum does not ship "
      + "(Doctrine 11). What the number itself should be is B-b, and it is one word.",
  },
  {
    id: "W-2",
    title: "The prelude and the BLAST window are the same weekend, independently.",
    check:
      "The transfer model calls class 1 “THE BLAST — Friday to Sunday, pre-launch,” "
      + "written on 2026-08-05 off the asset timeline. The prelude above puts the address "
      + "live on Friday at 2pm and the museum open on Monday. They agree on the window "
      + "without either having been written from the other.",
    derivedFrom: "reveal/transfers.mjs (TRANSFERS.BLAST)",
    open: null,
  },
  {
    id: "W-3",
    title: "Friday's payoff needs no arrival, and the model already says so.",
    check:
      "“One password was short enough” is an UNLOCK by the transfer model's own "
      + "definition — “things already held that could not be opened. No arrival needed.” "
      + "The UNLOCK window opens at week 0, so day 5 sits inside it and the week's biggest "
      + "moment costs the story nothing new.",
    derivedFrom: "reveal/transfers.mjs (TRANSFERS.UNLOCK)",
    open: null,
  },
  {
    id: "W-4",
    title: "The bouncy ball law is the only rule here a tracker can measure — and the "
      + "tracker was measuring it in the wrong unit.",
    check:
      "The law caps POINTS OF FOCUS, not assets, and the precious ones are two or three "
      + "A WEEK. The tracker was dividing a count of PHOTOGRAPHS by a ceiling on "
      + "ATTENTION and printing a runway in days — 16 pictures = 6–8 days. That figure "
      + "is VOID (`reveal/focus.mjs` VOIDED). What replaces it is two runways: precious "
      + "reveals remaining, which divides into weeks because it has a ceiling over it, "
      + "and what is in the dump, which is a pile size and divides into nothing.",
    derivedFrom: "reveal/focus.mjs · provenance/asset-table.json · reveal/delivery.mjs",
    open: null,
    ruled: "Mike, 2026-08-07: the law caps points of focus, not assets. It does not mean "
      + "we may not show more pictures. Every asset is UNASSIGNED to a bucket today, so "
      + "the precious runway is printed as a bound rather than a number.",
  },
  {
    id: "W-5",
    title: "Nothing in week one reaches a PACKAGE, and the outline never asks it to.",
    check:
      "Every topic on days 1–4 is weekend material (BLAST) and day 5 opens something "
      + "already held (UNLOCK). The units, cases, objects and manual pieces arrive on four "
      + "Fridays in weeks 3–7. The outline and the transfer rule do not fight.",
    derivedFrom: "reveal/transfers.mjs (TRANSFERS.PACKAGE)",
    open: null,
  },
];
