// src/data/artists/robots.js
// Hand-authored spine + config for the ROBOTS exhibit (/robots) — walk-six
// structural rebuild, 2026-07-25 (STAGED ONLY; ships at Mike's sitting).
//
// SAME-ONLY-DIFFERENT: Robots is now a real artist config driving the SAME
// Exhibit.jsx machinery as /hr and /wb — not a lookalike. Data differs;
// components do not.
//
// Contract consumed by Exhibit.jsx (see hunter-root-spine.js header):
//   album = { id, title, year, art, accent, tracks: [ track ] }
//   track = { id, title, videos: [ video ] }
//
// Videos are EMPTY on every track: no footage is on file yet ([PAPA] —
// chapter footage lands at the words/media pass). Empty-video tracks render
// the template's own no-video state (tl-novid), which is the honest read.
//
// Family order per Mike (walk-five) was NIAC → VIIIp → NRU plus the "Robots"
// CONCEPT ALBUM. As of 2026-07-29 the two coming-soon families are REMOVED
// (see the no-coming-soon note on the spine); the order among what remains is
// unchanged. exhibitFlow = RobotsExhibitFlow (the template's documented
// extension seam): the twin artifact + the log line + the overlay live there.

import RobotsExhibitFlow from "../../routes/robots/RobotsExhibitFlow.jsx";

/* ---- NO-COMING-SOON [Mike 2026-07-29] ---------------------------------
   MGK-NIAC and NRU-2000 are REMOVED from the carousel. Both were the same
   shape: the house logo for cover art plus a single track reading "Coming
   soon". Under Mike's credo - placeholders used extremely sparingly and only
   when they earn something - those two earned nothing. A visitor spun the
   deck, landed on a logo, and was told to come back later. Two of the four
   albums were that.
   ---- R1 RULED [Mike 2026-07-30]: "Robots" COMES OUT TOO. --------------
   The findings-log album is removed. THE CAROUSEL IS REAL ROBOTS ONLY - the
   deck is a rack of machines, and an album that is a house logo over a
   changelog is not a machine. Ops had flagged it to stay on the reasoning
   that the log is real content rather than a promise; Mike's ruling is that
   the credo is about the DECK's subject, not about whether the content
   behind a cover exists. The deck now holds exactly one album, MGK-VIIIp,
   which is the only robot with a photograph and a tracklist.
   THE FINDINGS LOG IS NOT LOST - it has no home on the deck, and the
   container-model proposal already gives it one below the line as a `text`
   or `journal` kind (EXHIBIT_CONTAINER_PROPOSAL-20260729.md, verdict 5).
   Nothing is lost when a family earns a photo and a track either: the
   entries come back as data, in this file, with no component changes. */
const spine = [
  {
    id: "mgk-viiip",
    title: "MGK-VIIIp",
    year: 1965,
    /* [2026-07-29] B&W, and the glass now carries the BIOS beat instead of a
       stale "LOADING SUCCESS" from a months-old flash. Generated from the
       twin's OWN ceremony: Beat() was wrapped and the framebuffer sampled at
       the labelled beat "the mark lands" in Charge_Front - the triangle
       spin-out with MGK-VIIIp / BIOS under it - then composited into the
       front-view photo at the measured portal aperture and printed to B&W.
       Provenance + the exact numbers: robots repo STATE.md, THE NIGHT RUN. */
    art: "/robots/art/viiip.png",
    accent: null,
    tracks: [
      { id: "machine", title: "The Machine", videos: [] },
      { id: "restoration", title: "The Restoration", videos: [] },
      { id: "record", title: "The Record", videos: [] },
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
