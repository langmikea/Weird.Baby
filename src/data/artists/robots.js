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
// Family order per Mike (walk-five): NIAC → VIIIp → NRU, plus the "Robots"
// CONCEPT ALBUM carrying the findings log. exhibitFlow = RobotsExhibitFlow
// (the template's documented extension seam): the twin artifact + the log
// line + the overlay live there.

import RobotsExhibitFlow from "../../routes/robots/RobotsExhibitFlow.jsx";

const spine = [
  {
    id: "mgk-niac",
    title: "MGK-NIAC",
    year: 1945,
    art: null,
    accent: null,
    tracks: [
      { id: "niac-soon", title: "Coming soon", videos: [] },
    ],
  },
  {
    id: "mgk-viiip",
    title: "MGK-VIIIp",
    year: 1965,
    art: null,
    accent: null,
    tracks: [
      { id: "machine", title: "The Machine", videos: [] },
      { id: "restoration", title: "The Restoration", videos: [] },
      { id: "record", title: "The Record", videos: [] },
    ],
  },
  {
    id: "nru-2000",
    title: "NRU-2000",
    year: null,
    art: null,
    accent: null,
    tracks: [
      { id: "nru-soon", title: "Coming soon", videos: [] },
    ],
  },
  {
    id: "robots",
    title: "Robots",
    year: null,
    art: null,
    accent: null,
    tracks: [
      { id: "findings", title: "Latest findings", videos: [] },
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
