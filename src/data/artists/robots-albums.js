// src/data/artists/robots-albums.js
/* ═══ THE CHARACTER ALBUMS — one album per robot, in the carousel [2026-09-11]
   MIKE: "You should be making an album cover for each of the robot types and
   put them in the carousel; when you click on the carousel it will have tracks,
   and the various tracks can be used to lay out specifications and other
   interesting items. And below that the artifact field, where we can put in
   photo albums and videos and additional content."

   SAME EXCEPT DATA. Four albums from ONE shape, the shape the two machine
   albums in `robots-units.js` already have: `{ id, title, year, tags, art,
   accent, tracks[] }`, each track a face the shared Exhibit already renders
   (`text`, `plate`, the FAQ factory). Nothing new is asked of Exhibit.jsx.

   THE DATA IS THE CATALOGUE. What a unit does, what came in its kit and what
   papers it carries are read from `docs/CATALOGUE-20260918.json` — the rows
   Mike rules A/B/C at the sitting of 09-20 — so a ruling there changes the
   album without a second edit here. The pitches are HOUSE drafts until then
   and the module says so on the glass.

   HELD ON ITS OWN CONDITION. This module is in `HELD_PATHS` (vite.config.js),
   so its chunk parks under `assets/held/` and the stage door refuses it at
   LAUNCH; the covers live under `public/held/` and `placed()` computes the
   held address from the public one declared here. `Robots.jsx` asks for the
   module the way it asks for the Portal, and in development the door is open.
   On Opening Day the module leaves the list and the covers move, which is the
   door flipping and nothing else.

   COVERS ARE STAND-INS (Mike, 09-11, ruling A): the box for the Everyday from
   the one black-and-white sample that survived; the other three carry the ring
   empty until the colour shoot. Built by `tools/make_album_covers.py`.

   THE PRINTS ARE THE MANIFEST'S (09-17, ruling C of the calendar re-cut: "both,
   Gambler first" — the 09-16 set stands in on the Gambler's page so the wing
   can be built and judged; the tray re-shoot replaces the plates album by
   album). `photos/manifest.json` holds one row per original; `tools/
   photos-build.py` renders the handled print and writes `src/data/photos/
   <character>.json`, which this module reads: the Image Archive's groupings,
   the Kit's plates and the library's pages all come from that file, so a
   changed crop or a new frame is a re-run, never an edit here. The data
   declares the PUBLIC address (`/robots/photos/...`); `placed()` finds the
   held one. */
import { placed, placedPresets, placedTiles } from "../../lib/placement.js";
import GAMBLER_PHOTOS from "../photos/gambler.json";
import { faqFace } from "../faq-face.js";
import CATALOGUE from "../../../docs/CATALOGUE-20260918.json";

/* where the four land in the deck: after the wing's own sleeve and the Portal */
export const ALBUMS_AT = 2;

const ROWS = CATALOGUE.rows;

/* the prints, per album key; an album with no set yet reads an empty list */
const PHOTOS = { gambler: GAMBLER_PHOTOS.rows };
const GROUPS = [["case", "The case"], ["kit", "The kit"], ["chips", "The chips"], ["coins", "The half dollars"],
                ["library", "The library"], ["slate", "The slate"]];
const tileOf = (p) => ({ img: p.img, href: p.href, label: p.label, date: p.date });
function photoPresets(albumKey) {
  const rows = PHOTOS[albumKey] || [];
  if (!rows.length) return undefined;
  const sets = GROUPS
    .map(([id, label]) => ({ id, label, tiles: rows.filter((p) => p.group === id).map(tileOf) }))
    .filter((g) => g.tiles.length);
  sets.push({ id: "all", label: "Every photograph", tiles: rows.map(tileOf) });
  return placedPresets(sets);
}
/* the print that stands for a catalogue row on the Kit track: the first of its group */
const KIT_PLATE = { "phys.cases": "case", "objects.gambler": "chips" };
function kitPlate(albumKey, rowId) {
  const group = KIT_PLATE[rowId];
  const p = group && (PHOTOS[albumKey] || []).find((r) => r.group === group);
  return p ? placed(p.img) : undefined;
}
/* the library: the documents the set photographed that the catalogue does not
   yet list (question 3 of docs/PHOTOS-20260916-GAMBLER-SET.md waits on Mike) */
const LIBRARY = {
  gambler: [
    { title: "Marked Cards and Loaded Dice", source: "Garcia", ids: ["0226", "0227", "0228", "0229", "0230", "0231", "0232", "0233", "0234"],
      note: "From the Gambler's library, photographed on the tray: the cover, the spine, and the book open." },
    { title: "The Blue Book", source: "K.C. Card Co.", ids: ["0235", "0236", "0237", "0238", "0239", "0240", "0241", "0242", "0243", "0244", "0245"],
      note: "From the Gambler's library, photographed on the tray: the cover, the back, and nine spreads held open." },
  ],
};
function libraryDocs(albumKey) {
  const rows = PHOTOS[albumKey] || [];
  return (LIBRARY[albumKey] || []).map((d) => ({
    title: d.title, source: d.source, note: d.note,
    plates: placedTiles(d.ids.map((suffix) => rows.find((r) => r.id.endsWith(suffix))).filter(Boolean).map(tileOf)),
  }));
}
const KIND_STAMP = { engine: "ENGINE", feature: "FEATURE", game: "GAME", setting: "SETTING", sound: "SOUND", document: "PAPER", artifact: "OBJECT", character: "CHARACTER" };
const dayLine = (d) => (d === "later" ? "later" : `launch run, day ${d}`);

/* the shared features every unit has, plus the ones that are this unit's own */
function doesEntries(albumKey) {
  return ROWS
    .filter((r) => r.page === "feature" && (r.album === albumKey || r.album === "machine"))
    .map((r) => ({ stamp: KIND_STAMP[r.kind] || r.kind.toUpperCase(), title: r.name, line: r.pitch,
                   note: r.album === albumKey ? "this unit" : dayLine(r.day) }));
}
function kitEntries(albumKey) {
  return ROWS
    .filter((r) => r.album === albumKey && (r.page === "album:kit" || r.page === "album:plates"))
    .map((r) => ({ stamp: KIND_STAMP[r.kind] || r.kind.toUpperCase(), title: r.name, line: r.pitch, note: "",
                   img: kitPlate(albumKey, r.id) }));
}
function paperDocs(albumKey) {
  return ROWS
    .filter((r) => r.page === "album:papers" && (r.album === albumKey || r.album === "machine"))
    .map((r) => ({ title: r.name, source: r.album === albumKey ? "this unit's" : "the machine's", note: r.pitch, plates: [] }))
    .concat(libraryDocs(albumKey));
}

const DRAFT_NOTE = "Pitches are the house's drafts until the sitting of 2026-09-20 rules them.";

/* one template, four fillings */
function album({ id, key, title, character, serial, keyCode, caseLine, voice, cover, forLine }) {
  const sub = `${title.toUpperCase()} · ${character.toUpperCase()}`;
  return {
    id,
    title,
    year: 1965,
    tags: ["mgk", "viiip", "album", key, "character"],
    art: placed(cover),
    accent: null,
    tracks: [
      {
        id: `${key}-spec`,
        title: "Technical Specifications",
        videos: [],
        tags: ["specifications", key],
        face: {
          kind: "text",
          title: "Technical Specifications",
          subtitle: sub,
          blurb: forLine,
          entries: [
            { stamp: "SERIAL", title: `MGK-VIIIp −${serial}`, line: `Key code ${keyCode}.`, note: "" },
            { stamp: "CASE", title: caseLine, line: "Release 1.", note: "" },
            { stamp: "VOICE", title: voice, line: "The persona's cast voice, one of the eleven in the list.", note: "" },
            { stamp: "ENGINES", title: "MGK-NIAC · MGK-v2.0 · MGK-65", line: "Three engines; the twenty, the second voice, the sixty-five.", note: "" },
          ],
          footer: `${title.toUpperCase()} · SPECIFICATIONS`,
        },
      },
      {
        id: `${key}-does`,
        title: "What It Does",
        videos: [],
        tags: ["features", "games", "settings", key],
        face: {
          kind: "text",
          title: "What It Does",
          subtitle: sub,
          blurb: DRAFT_NOTE,
          entries: doesEntries(key),
          footer: `${title.toUpperCase()} · WHAT IT DOES`,
        },
      },
      {
        id: `${key}-kit`,
        title: "The Kit",
        videos: [],
        tags: ["kit", "artifacts", key],
        face: {
          kind: "text",
          title: "The Kit",
          subtitle: sub,
          blurb: "What came with it and what was made for it. Each piece is photographed on the tray; the prints land here.",
          entries: kitEntries(key),
          footer: `${title.toUpperCase()} · THE KIT`,
        },
      },
      {
        id: `${key}-papers`,
        title: "The Papers",
        videos: [],
        tags: ["documents", "papers", key],
        face: {
          kind: "plate",
          title: "The Papers",
          subtitle: sub,
          docs: paperDocs(key),
          footer: `${title.toUpperCase()} · THE PAPERS`,
        },
      },
      {
        id: `${key}-plates`,
        title: "Image Archive",
        videos: [],
        tags: ["plates", "photographs", key],
        face: {
          kind: "text",
          title: "Image Archive",
          subtitle: sub,
          archiveUnit: { one: "photograph", many: "photographs" },
          blurb: photoPresets(key)
            ? "Prints from the tray, the handled print, from the set of 16 September 2026. The tray re-shoot replaces them plate by plate."
            : "Black and white prints from the tray: closed, open, the back, the underside, the case, the cable, the box. They land with the manifest.",
          presets: photoPresets(key),
          footer: `${title.toUpperCase()} · IMAGE ARCHIVE`,
        },
      },
      {
        id: `${key}-record`,
        title: "The Record",
        videos: [],
        tags: ["record", "provenance", key],
        face: {
          kind: "text",
          title: "The Record",
          subtitle: sub,
          papa: "Two paragraphs: where it was found, in what state, what the catalogue said. Ops writes, Mike rules.",
          footer: `${title.toUpperCase()} · THE RECORD`,
        },
      },
      {
        id: `${key}-faq`,
        title: "FAQ",
        videos: [],
        tags: ["faq", key],
        face: faqFace(sub, [
          { title: "Does it still work?", line: "Yes. It powers on and runs its own firmware.", note: "" },
          { title: "Can I try it?", line: "Yes. The twin runs the same software in the browser; the door is on the front of the wing.", note: "" },
          { title: "Can I buy one?", line: "No. The shop carries what the shop carries; the machines are not stock.", note: "" },
        ]),
      },
    ],
  };
}

export const CHARACTER_ALBUMS = [
  album({ id: "album-everyday", key: "everyman", title: "The Everyday", character: "the Everyman", serial: "01", keyCode: "TT5S-X2GT",
          caseLine: "The oxblood case, the strap, the cable", voice: "Joey", cover: "/robots/art/album-everyday-cover.png",
          forLine: "The unit for the rest of us: the one that was sold in the magazines, in the box, with the copy." }),
  album({ id: "album-gambler", key: "gambler", title: "The Gambler", character: "the Gambler", serial: "21", keyCode: "HGMM-HGPK",
          caseLine: "The Deluxe case, with chips, cards and dice", voice: "Miguel", cover: "/robots/art/album-gambler-cover.png",
          forLine: "Comes in a case. Never asks what you can afford." }),
  album({ id: "album-ceo", key: "ceo", title: "The CEO", character: "the CEO", serial: "09", keyCode: "4KAQ-CNSE",
          caseLine: "The attaché", voice: "Matthew", cover: "/robots/art/album-ceo-cover.png",
          forLine: "The attaché. Decides, then explains." }),
  album({ id: "album-informer", key: "informer", title: "The Informer", character: "the Informer", serial: "07", keyCode: "7SVQ-8KBW",
          caseLine: "The spy kit", voice: "Brian", cover: "/robots/art/album-informer-cover.png",
          forLine: "The spy kit. Hears everything, repeats some of it." }),
];
