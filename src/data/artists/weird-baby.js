// src/data/artists/weird-baby.js
// Hand-authored spine + config for the Weird.Baby house exhibit (/wb).
// Mirrors hunterRoot minus MediaVault: no foundation export — the six Vol 1
// recordings are repo-local assets (public/audio/wb/). MV ingestion of Vol 1
// is deferred (post-vocab-migration) per WB_ARTIST_LOBBY_BOOTH-20260706.
//
// Display order is PRESENTATION order (Mike 2026-07-06: lead with Coconuts,
// then E.D. Yahdah, then registration order). The vol1 repo's slot numbers
// (in the mp3 filenames) are registration canon and unchanged.
//
// Contract consumed by Exhibit.jsx (see hunter-root-spine.js header):
//   album = { id, title, year, art, accent, tracks: [ track ] }
//   track = { id, title, videos: [ video ] }
//   video = { id, ytId, audioUrl, label, type }
//
// Video ids follow the builder's rendition-id rule (id = ytId ?? slug(audioUrl))
// so preset capture/restore stays stable if this spine later comes from MV.
//
// exhibitFlow is OMITTED on purpose: Exhibit.jsx renders the artifact deck
// only when present ({ExhibitFlow && ...}, Exhibit.jsx:1065 — verified
// 2026-07-06). The WB exhibit is player-only for v0; holes are by design.

const REC_LABEL = "Recording — 2026-06";

/* ═══ [P9 2026-08-05] ABOUT THE ARTIST, FIRST IN THE WING ════════════════════
   MIKE: "WEIRD.BABY MUSIC: add an ABOUT THE ARTIST album, FIRST in the wing.
   'About the Songs' is wanted someday, not today — ledger it."

   WHAT IS ON IT IS EVERYTHING THIS MUSEUM ALREADY PUBLISHES ABOUT THIS ARTIST
   AND NOT ONE CLAUSE MORE. That is a short list, and the list being short is the
   finding rather than a shortcoming: the keeper's line is the Information
   Booth's own answer, verbatim; the holdings are counted off the album below it;
   and the biography is a [PAPA] slot, marked in both its title and its answer so
   the entry renders NOTHING rather than printing a question with a silence under
   it. Doctrine 12 forbids the obvious alternative — a paragraph about a musician
   nobody has described to Ops would read true and be invented.

   THE ROOM DOES NOT HOLD A PORTRAIT, and the register says so on the glass. That
   is a holdings fact and it ships; "nobody has photographed him yet" is a
   production fact and does not. The album cover is the house's own mark, which
   is the one image of this artist the museum genuinely has.

   "ABOUT THE SONGS" IS LEDGERED AND NOT BUILT — his instruction, in his words,
   and the row is in docs/OPEN_ACTIONS.md. It is not scaffolded here: an empty
   container at a live address is what the NO-COMING-SOON credo kills, and the
   renderer is generic already, so building it on the day there is something to
   put in it costs a data block and no code. */
const spine = [
  {
    id: "about",
    title: "About the Artist",
    year: null,
    art: "/WeirdBaby_PhotoID.png",
    accent: null,
    tracks: [
      {
        id: "about-artist",
        title: "About the Artist",
        videos: [],
        face: {
          kind: "text",
          title: "ABOUT THE ARTIST",
          subtitle: "WEIRD.BABY",
          blurb:
            "The house's own music. What this room holds of the artist is the " +
            "recordings; what it holds of the person is his name.",
          lines: [
            "RELEASE   The Making of BoWB V1 — 2026",
            "TRACKS    six, recorded June 2026",
            "PORTRAIT  none on file",
          ],
          entries: [
            /* [P9] THE SLOT, MARKED IN BOTH FIELDS SO IT RENDERS NOTHING —
               the same mechanism the robots FAQ uses for its own unwritten
               answer, and for the same reason: `scrubFace` keeps an entry whose
               TITLE survives even when its line does not. */
            { stamp: "Q", title: "[PAPA] Who is Weird.Baby?",
              line: "[PAPA] the artist's own account of himself, which is " +
                    "Mike's to write and nobody else's.",
              note: "" },
            /* THE INFORMATION BOOTH'S OWN ANSWER, verbatim. It is the one
               published statement about the person behind this name, and it was
               only reachable from a room in a different part of the building. */
            { stamp: "WHO", title: "Who keeps this place?",
              line: "One person — Papa Weird.Baby. The job pays nothing, the " +
                    "museum never pays to be managed, and only zero-invoice " +
                    "services are accepted. That's the deal, and it never " +
                    "changes.",
              note: "" },
            { stamp: "ON FILE", title: "What the museum holds",
              line: "Six recordings, made in June 2026, and one release: The " +
                    "Making of BoWB V1. They play in this room.",
              note: "" },
          ],
          entriesMode: "list",
          footer: "WEIRD.BABY · ABOUT THE ARTIST",
        },
      },
    ],
  },
  {
    id: "vol1",
    title: "The Making of BoWB V1", // display title per Mike 2026-07-06 (registration title: Best of Weird.Baby — Vol 1)
    year: 2026,
    art: "/images/wb/vol1_cover_v1.png", // composed cover (Mike 2026-07-06): gray field, red "the making of" (pop), white "The Best of" / logo / white "Vol. 1", smaller photo larger text
    accent: null,
    tracks: [
      {
        id: "coconuts",
        title: "Coconuts",
        videos: [{
          id: "audio_wb_06_coconuts_2026_06_17_mp3",
          ytId: null,
          audioUrl: "/audio/wb/06_coconuts_2026-06-17.mp3",
          label: REC_LABEL,
          type: "audio",
        }],
      },
      {
        id: "ed_yahdah",
        title: "E.D. Yahdah",
        videos: [{
          id: "audio_wb_05_ed_yahdah_2026_06_16_mp3",
          ytId: null,
          audioUrl: "/audio/wb/05_ed_yahdah_2026-06-16.mp3",
          label: REC_LABEL,
          type: "audio",
        }],
      },
      {
        id: "weird_baby_blues",
        title: "Weird Baby Blues",
        videos: [{
          id: "audio_wb_01_weird_baby_blues_2026_06_17_mp3",
          ytId: null,
          audioUrl: "/audio/wb/01_weird_baby_blues_2026-06-17.mp3",
          label: REC_LABEL,
          type: "audio",
        }],
      },
      {
        id: "pull_me_in_closer_blues",
        title: "Pull Me In Closer Blues",
        videos: [{
          id: "audio_wb_02_pull_me_in_closer_blues_2026_06_16_mp3",
          ytId: null,
          audioUrl: "/audio/wb/02_pull_me_in_closer_blues_2026-06-16.mp3",
          label: REC_LABEL,
          type: "audio",
        }],
      },
      {
        id: "breakup_breakdown_blues",
        title: "Breakup Breakdown Blues",
        videos: [{
          id: "audio_wb_03_breakup_breakdown_blues_2026_06_16_mp3",
          ytId: null,
          audioUrl: "/audio/wb/03_breakup_breakdown_blues_2026-06-16.mp3",
          label: REC_LABEL,
          type: "audio",
        }],
      },
      {
        id: "how_i_saved_the_world_blues",
        title: "How I Saved the World Blues",
        videos: [{
          id: "audio_wb_04_how_i_saved_the_world_blues_2026_06_17_mp3",
          ytId: null,
          audioUrl: "/audio/wb/04_how_i_saved_the_world_blues_2026-06-17.mp3",
          label: REC_LABEL,
          type: "audio",
        }],
      },
    ],
  },
];

export const weirdBaby = {
  id: "wb",
  name: "Weird.Baby",
  spine,
  facts: [], // PUV stays empty for v0 (fact model is MV-side, deferred)
  defaultActiveIndex: 0,
  splitKey: "wb-wb-split",
  cfKey: "wb-wb-cfh",
  visitPath: "/wb",
  shopExitParam: "wb",
  /* [P9 2026-08-05] AND THE STAGE IS RETIRED HERE, WHICH THIS ROUND HAD TO DO
     RATHER THAN CHOSE TO. THE NO-HIDDEN-INFORMATION LAW, Mike's own words at
     M1: "card-advance/next-buttons are a sneaky way of adding pages — people
     will not flick to discover whether something is interesting." It was
     applied to /robots and to /wal and NOT to /wb — for the honest reason that
     /wb had never declared a face, so there was nothing here for the packer to
     cut up and the wing looked compliant by having no content.
     ABOUT THE ARTIST IS THE FIRST FACE THIS WING HAS EVER HAD, and measured on
     arrival it came up as "Page 1 of 4" with a ‹ BACK / NEXT › transport: the
     register, all three answers and the footer behind a button whose label says
     nothing about what is behind it. That is the defect the law names, and it
     would have been introduced BY this round. `faceFlow: "flat"` is W7's
     mechanism, unchanged, and the wing's audio tracks do not touch it — a
     track with videos renders the player it always did.
     THE MUSEUM NOW HAS NO PAGER ANYWHERE. `.stg-*` and the Stage component are
     mounted by nothing in any wing. */
  faceFlow: "flat",
  // exhibitFlow omitted — see header note
};
