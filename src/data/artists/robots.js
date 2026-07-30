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
            "ENTRIES  [PAPA] — Mike's pen",
            "INDEX    date-stamped, log-sheet register",
          ],
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
            "[PAPA] — the house's own words go here",
          ],
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
          lines: [
            "Q  Is it real?            [PAPA]",
            "Q  Does it still work?    [PAPA]",
            "Q  Can I buy one?         [PAPA]",
            "Q  How many are there?    [PAPA]",
          ],
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
          lines: [
            "[PAPA] — address, and how much of it to publish",
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
  visitPath: "/robots",
  shopExitParam: "robots",
  // [one-shop ruling] the template's Gift Shop entry stays IN the title bar
  // (present per template) but hidden for Robots — /shop is the one shop.
  shopEntryHidden: true,
  exhibitFlow: RobotsExhibitFlow,
};
