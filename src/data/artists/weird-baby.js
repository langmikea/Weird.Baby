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

const spine = [
  {
    id: "vol1",
    title: "Best of Weird.Baby — Vol 1",
    year: 2026,
    art: "/images/wb/vol1_cover_v1.png", // v1 composed cover (Mike's spec 2026-07-06): red "the making of" / white "The Best of" / logo / red "Vol. 1"
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
  // exhibitFlow omitted — see header note
};
