// src/data/artists/robots.js
// Hand-authored spine + config for the ROBOTS exhibit (/robots).
//
// SAME-ONLY-DIFFERENT: Robots is a real artist config driving the SAME
// Exhibit.jsx machinery as /hr and /wb — not a lookalike. Data differs;
// components do not.
//
// Contract consumed by Exhibit.jsx (see hunter-root-spine.js header):
//   album = { id, title, year, art, accent, tracks: [ track ] }
//   track = { id, title, videos: [ video ] }
//
// ---- E2/E3 2026-07-30: THE TRACKS CARRY FACES -------------------------------
// Videos are still EMPTY on every track — no footage is on file ([PAPA], the
// media pass). Before today that meant every track opened the template's
// no-video state: a dark panel with a grey play triangle. Mike killed it.
//
// A track may now carry a `face`, which is DATA, not a component:
//   face = { kind, title, blurb, still, action, lines }
//     kind    "monitor" | "plate" | "text"   (the container proposal's names)
//     title   the heading inside the panel
//     blurb   a short paragraph, in the exhibit's own register
//     still   optional image path
//     action  optional { label, event } — a button that fires a window event;
//             RobotsExhibitFlow listens and does the robots-specific thing, so
//             Exhibit.jsx keeps knowing nothing about twins.
//     lines   optional array of short lines (the register/log look)
// A track with neither videos NOR a face falls through to the template's own
// state exactly as before, so /hr and /wb cannot notice any of this.
//
// `viewerPoster` on the album is what the panel shows when nothing is playing
// and nothing is selected — see the note on it below.

import RobotsExhibitFlow from "../../routes/robots/RobotsExhibitFlow.jsx";

/* ---- NO-COMING-SOON [Mike 2026-07-29 / R1 2026-07-30] ---------------------
   MGK-NIAC, NRU-2000 and the "Robots" findings-log album are all REMOVED from
   the carousel. The first two were house-logo art plus a single "Coming soon"
   track — placeholders earning nothing. R1 took the findings-log album too:
   THE CAROUSEL IS REAL ROBOTS ONLY, plus the purveyor's own album (below).
   Entries come back as data, in this file, when a family earns a photograph
   and a tracklist. No component changes needed. */
const spine = [
  {
    id: "mgk-viiip",
    title: "MGK-VIIIp",
    year: 1965,
    /* [2026-07-29] B&W, and the glass carries the BIOS beat instead of a stale
       "LOADING SUCCESS" from a months-old flash. Generated from the twin's OWN
       ceremony — the framebuffer sampled at the labelled beat "the mark lands"
       in Charge_Front — then composited into the front-view photo at the
       measured portal aperture and printed to B&W. Provenance and the exact
       numbers: robots repo STATE.md, THE NIGHT RUN. */
    art: "/robots/art/viiip.png",
    accent: null,
    /* [E2] THE VIEWER'S DEFAULT — the family shot.
       Chosen over the alternatives on honesty: it is a real photograph of the
       two real units in one frame, already in the repo, already B&W, and it is
       the actual subject of the exhibit. The album cover was the runner-up and
       loses for being redundant (it is six inches to the left in the deck);
       a findings-log face loses because the log is words, and words are not a
       compelling thing to LAND on. */
    viewerPoster: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png",
    viewerPosterCaption:
      "MGK-VIIIp −02 “The Informer”, front and top, as received.",
    tracks: [
      {
        id: "machine",
        title: "Run the machine",
        videos: [],
        /* the underperforming deck button retires into a track, where it has
           a still and a paragraph to earn the press. The button does not open
           the twin itself — it fires an event the exhibit flow listens for, so
           the shared engine stays ignorant of what a twin is. */
        face: {
          kind: "monitor",
          title: "THE ARTIFACT, RUNNING",
          blurb:
            "A working transliteration of the unit's own firmware — the 1965 " +
            "menu system, its answer engines, and both glasses, driven from " +
            "the real tables. Not a video of a machine. The machine.",
          still: "/robots/art/viiip.png",
          lines: [
            "SOURCE  MGK_VIIIp_01__20240721_WORKS",
            "GLASS   128×64 front · 128×64 top",
            "STATE   cold start — boot is mandatory",
          ],
          /* WHAT IS ACTUALLY BEHIND THE BUTTON. Every row below is a surface
             that exists and runs today — no row here is a promise. */
          entries: [
            { stamp: "DOOR 1", title: "Answers",
              line: "The classic twenty, and the engines that colour them — " +
                    "NIAC, v2.0, 65, and the persona grids.",
              note: "polarity + clarity registers live" },
            { stamp: "DOOR 2", title: "Programs",
              line: "Probabilities and Detectors are complete. Five games. " +
                    "The mic is real: the needle reads what it hears.",
              note: "probabilities 5/5 · detectors 4/4" },
            { stamp: "DOOR 3", title: "Messages",
              line: "The inbox, delivered by trigger rather than by date — " +
                    "a row stays hidden until the machine has a reason.",
              note: "RAM-only, exactly as the settings are" },
            { stamp: "DOOR 4", title: "Settings",
              line: "Polarity, clarity, model, voice — and the user record, " +
                    "which is the only thing it asks you for.",
              note: "new 2026-07-30: name + birthdate" },
            { stamp: "CEREMONY", title: "The boot is mandatory",
              line: "Three levels: virgin install, first run with the " +
                    "calibration dance, and the fast established wake.",
              note: "the front glass wakes first" },
          ],
          footer: "Runs in the page. Nothing is installed, nothing is uploaded.",
          action: { label: "Bring up the monitor", event: "wb-robots-open-twin" },
        },
      },
      {
        id: "manual",
        title: "The manual",
        videos: [],
        /* HONEST v1: a face that says what the object is and what state it is
           in. No plates yet — the scans are Mike's to make — and no
           "coming soon", because a face that describes the artifact is not a
           promise, it is a catalogue entry. */
        face: {
          kind: "plate",
          title: "THE OWNER'S MANUAL",
          blurb:
            "The unit shipped with a manual, and the manual is where the " +
            "machine explains itself — including the parts it gets wrong. " +
            "Page images, not transcription: the typography is the evidence.",
          lines: [
            "FORMAT  page plates, original look-and-feel",
            "NAV     microfiche-style scrub (designed, not built)",
            "PLATES  not yet imaged",
          ],
          /* THE CONTENTS PAGE, WHICH IS REAL EVEN THOUGH THE PLATES ARE NOT.
             Every section below is attested in the record or in the firmware;
             what is missing is the IMAGE of the page, and each row says so
             rather than pretending otherwise. */
          entries: [
            { stamp: "§ 1", title: "Start-up procedure",
              line: "One of the two items present in every generic unit's " +
                    "inbox from the moment the OS is installed — never “sent”.",
              note: "attested · plate not imaged" },
            { stamp: "§ 2", title: "Operating the answer engine",
              line: "Ask, then shake. The reveal holds until you disturb it; " +
                    "the machine never times your reading out.",
              note: "attested · plate not imaged" },
            { stamp: "§ 3", title: "Bias, and what it is for",
              line: "The polarity and clarity registers, described in the " +
                    "manual's own UNIVAC-corporate register.",
              note: "attested · plate not imaged" },
            { stamp: "§ 4", title: "BIST and AMMMS maintenance",
              line: "The built-in self test and the maintenance messaging — " +
                    "real lore, and the visual language already exists.",
              note: "attested · plate not imaged" },
            { stamp: "APP. 1", title: "The passcode landscape",
              line: "0000 through 80085, the tape, and the grid. A found " +
                    "artifact, not an objective — there is no game.",
              note: "the strongest candidate to image first" },
            { stamp: "MARGINS", title: "The hands in the margins",
              line: "Technicians' and owners' handwriting, scanned with the " +
                    "pages during cataloging. The margins are recovered evidence.",
              note: "[PAPA] — which hands, and what they wrote" },
          ],
          footer: "Page images are Mike's to make. Until they exist this is a " +
                  "catalogue entry, and it says so.",
        },
      },
      {
        id: "record",
        title: "The record",
        videos: [],
        face: {
          kind: "text",
          title: "THE RECORD",
          blurb:
            "The weekly log of the reverse-discovery: what arrived, what it " +
            "turned out to be, and what is still unexplained. Written as it " +
            "happened, which is not the order it makes sense in.",
          lines: [
            "SOURCE   The Record — 436 paragraph records, in repo",
            "INDEX    date-stamped, log-sheet register",
            "ORDER    as it happened, not as it makes sense",
          ],
          /* THE FIRST LAYER IS REAL. Ten entries, real dates, and one true
             sentence each, taken from the blog archive itself — not invented
             to fill a template. The full bodies are Mike's to place, and the
             [PAPA] rows are the ones where a summary would be putting words
             in the narrator's mouth. */
          entries: [
            { stamp: "01 JAN 24", title: "Three boxes",
              line: "An anonymous drop: three cartons, marked classified and " +
                    "fragile on every side, with a note taped to them signed “-W.O.”",
              note: "the note's full text is in the archive" },
            { stamp: "05 JAN 24", title: "Who is W.O.?",
              line: "The first entry. Three units are named on the boxing, " +
                    "and ABEAL is assumed — wrongly — to be their creator.",
              note: "" },
            { stamp: "12 JAN 24", title: "Something off about this drop",
              line: "Office supplies, personal items and cold-war hardware, " +
                    "no documentation, everything gathered in a rush.",
              note: "ABEAL is “a division of ScrapCo”" },
            { stamp: "19 JAN 24", title: "The One-Page-Ads",
              line: "The framed ads turn out not to be original: ABEAL " +
                    "retro-fitted other people's ads, with words covered and things taped down.",
              note: "" },
            { stamp: "26 JAN 24", title: "But we were wrong",
              line: "The retraction. ABEAL did not start it — they received " +
                    "the tech from someone else. They were responsible for the looks.",
              note: "the record correcting itself, in public" },
            { stamp: "02 FEB 24", title: "Logos and slogans",
              line: "The shirts are made from original elements off the " +
                    "boxing — which is the first mention that per-unit slogans exist.",
              note: "[PAPA] — the slogans themselves are unwritten" },
            { stamp: "09 FEB 24", title: "MGK-NIAC, and a name",
              line: "The original project title surfaces, and with it Carter " +
                    "Bookman — “his life is a mystery (some may say an Enigma??)”.",
              note: "" },
            { stamp: "16 FEB 24", title: "Ionizers and crushed walnut",
              line: "Restoration chemistry: the cases through the electronic " +
                    "ionizers, the body casings tumbled in crushed walnut.",
              note: "" },
            { stamp: "22 MAR 24", title: "Bias, in 1965",
              line: "Two engines — Prediction and Answer — both running off a " +
                    "changeable bias setting built before bias settings were a thing.",
              note: "" },
            { stamp: "05 APR 24", title: "The cases open",
              line: "Photographs of the three cases and their artifacts: a " +
                    "spy camera, a real telegraph, and a 1960s CEO's day.",
              note: "" },
          ],
          footer: "First layer only — ten of 436 records. The full entries, and " +
                  "the order they want to be read in, are [PAPA].",
        },
      },
    ],
  },
  /* ======== E3 2026-07-30: THE PURVEYOR'S OWN ALBUM ======================
     Mike, ASAP: a "Weird.Baby Robots" album — the house, not a machine. The
     basics a visitor looks for, in the house register, NOT a scripted story.
     Deliberately thin on lore: this is the front desk, not the exhibit.
     COVER ART IS A PLACEHOLDER — see the note on `art`. */
  {
    id: "wbr",
    title: "Weird.Baby Robots",
    year: null,
    /* [E3 PLACEHOLDER — FLAGGED FOR SWAP]
       Mike is drawing a WBR logo. Until it lands this is a clean typographic
       cover in the house register, generated inline as an SVG data URI so it
       ships with the config and needs no asset: photo-paper ground, photo-black
       type, the wordmark stacked the way the deck's other covers letter it.
       It is a PLACEHOLDER THAT EARNS ITS PLACE under the no-coming-soon credo
       because the album behind it is real content — but it is still a
       placeholder, and the swap is one line: point `art` at the logo file. */
    art:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">' +
          '<rect width="600" height="600" fill="#d9d5ca"/>' +
          '<rect x="26" y="26" width="548" height="548" fill="none" stroke="#211f1c" stroke-width="2"/>' +
          '<text x="300" y="252" text-anchor="middle" fill="#211f1c" ' +
          'font-family="Georgia,serif" font-size="76" letter-spacing="2">Weird.Baby</text>' +
          '<text x="300" y="352" text-anchor="middle" fill="#211f1c" ' +
          'font-family="Georgia,serif" font-size="104" letter-spacing="10">ROBOTS</text>' +
          '<line x1="150" y1="392" x2="450" y2="392" stroke="#211f1c" stroke-width="2"/>' +
          '<text x="300" y="436" text-anchor="middle" fill="#57544d" ' +
          'font-family="Courier New,monospace" font-size="21" letter-spacing="6">PURVEYORS OF THE WEIRD</text>' +
        "</svg>"
      ),
    accent: null,
    viewerPoster: "/WeirdBaby_PhotoID.png",
    viewerPosterCaption: "Weird.Baby — purveyors of the weird.",
    tracks: [
      {
        id: "about",
        title: "Who we are",
        videos: [],
        face: {
          kind: "text",
          title: "WHO WE ARE",
          blurb:
            "Weird.Baby buys weird things, works out what they are, and sells " +
            "the ones that should go on living. The robots wing is the part of " +
            "that work which refused to stay a footnote.",
          lines: [
            "TRADE    we buy weird things and work out what they are",
            "TAGLINE  “Purveyors of the Weird.Baby.”",
          ],
          entries: [
            { stamp: "WHAT", title: "A purveyor, not a maker",
              line: "Four parties touched these machines and only one of them " +
                    "built anything. We are the one that arrived sixty years late.",
              note: "" },
            { stamp: "HOW", title: "Found, cleaned, returned",
              line: "Power first, then the glass, then the software — and only " +
                    "then the question of what any of it was for.",
              note: "" },
            { stamp: "WHY", title: "[PAPA]",
              line: "The house's own answer to the only question a visitor " +
                    "actually asks.",
              note: "[PAPA] — this one is Mike's and should stay Mike's" },
          ],
          footer: "“Restoration house” is not what we are. Weird.Baby is Weird.Baby.",
        },
      },
      {
        id: "faq",
        title: "FAQ",
        videos: [],
        face: {
          kind: "text",
          title: "FREQUENTLY ASKED",
          blurb:
            "The questions that actually arrive, answered plainly. What is it, " +
            "does it work, is it for sale, and why does it know that.",
          entries: [
            { stamp: "Q", title: "Is it real?",
              line: "The hardware is. Everything the machine says about where " +
                    "it came from is the machine's account of it.",
              note: "[PAPA] — how straight to play this" },
            { stamp: "Q", title: "Does it still work?",
              line: "Yes. Power was the hard part, and it was solved — the " +
                    "batteries came back, and the software followed.",
              note: "[PAPA]" },
            { stamp: "Q", title: "How many are there?",
              line: "31.4. The fraction is not a typo and we are not going to " +
                    "explain it.",
              note: "" },
            { stamp: "Q", title: "Can I buy one?",
              line: "Some. Not all — several are held, and one is patient zero.",
              note: "[PAPA] — what to say about availability" },
            { stamp: "Q", title: "Why does it know that?",
              line: "It does not. It performs a calculation against a " +
                    "prescribed model, and it never pretends otherwise.",
              note: "" },
            { stamp: "Q", title: "Who is W.O.?",
              line: "Unknown. That is not a deflection — it is the honest " +
                    "state of the record, and it has been since the first box arrived.",
              note: "" },
          ],
          footer: "The answers a visitor gets should be shorter than these. " +
                  "[PAPA] — the final wording throughout.",
        },
      },
      {
        id: "contact",
        title: "Contact",
        videos: [],
        face: {
          kind: "text",
          title: "CONTACT",
          blurb:
            "For provenance questions, corrections to the record, and anyone " +
            "who thinks they have seen one of these before.",
          entries: [
            { stamp: "PROVENANCE", title: "You have seen one before",
              line: "The most useful message we can receive. Where, when, and " +
                    "any number you can remember off it.",
              note: "" },
            { stamp: "CORRECTION", title: "The record is wrong",
              line: "It will be, in places — it was written as things happened " +
                    "and some of it was wrong on the day.",
              note: "" },
            { stamp: "PURCHASE", title: "Availability",
              line: "Which units are held, which are not, and what a case tier " +
                    "actually includes.",
              note: "[PAPA]" },
            { stamp: "REACH", title: "[PAPA]",
              line: "Address, and the decision about how much of it to publish.",
              note: "[PAPA] — a decision, not a writing task" },
          ],
        },
      },
    ],
  },
];

export const robotsExhibit = {
  id: "robots",
  name: "Robots",
  exhibitSlug: "robots",
  eraAlias: {},
  spine,
  facts: [],
  defaultActiveIndex: Math.max(0, spine.findIndex(a => a.id === "mgk-viiip")),
  splitKey: "wb-rb-split",
  cfKey: "wb-rb-cfh",
  /* [X2 2026-07-30] BODY HEIGHT IS THE VISITOR'S. Declaring bodyKey grows the
     drag handle under the tracklist/viewer block and persists the height, the
     same way cfKey does for the carousel. /hr and /wb do not declare it and
     are untouched; adding it there is this one line. */
  bodyKey: "wb-rb-bodyh",
  visitPath: "/robots",
  shopExitParam: "robots",
  // [one-shop ruling] the template's Gift Shop entry stays IN the title bar
  // (present per template) but hidden for Robots — /shop is the one shop.
  shopEntryHidden: true,
  exhibitFlow: RobotsExhibitFlow,
};
