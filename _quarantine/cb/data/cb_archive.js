// ─── WEIRD.BABY ARCHIVE DATA — Carsie Blanton ──────────────────────────────
// Schema per artifact:
//   date     ISO date string — used for deterministic ordering (oldest first)
//   era      "early" | "middle" | "fire"
//   src      "press" | "archive" | "social"
//   type     "historical" | "interview" | "rarity"
//   fact1    Primary caption — always present
//   fact2    Secondary detail — optional, shown in lightbox
//   color    Placeholder bg color until real image (DARK — never bright)
//   icon     Placeholder emoji until real image
//
// Era definitions:
//   early   2005–2012 (Ain't So Green → Idiot Heart)
//   middle  2013–2019 (Rude Remarks → Buck Up)
//   fire    2021–present (Love & Rage → After the Revolution → Singles)
//
// Mike curates all content. Nothing enters without expressed purpose.
// ─────────────────────────────────────────────────────────────────────────────

export const CB_ARCHIVE = [
  {
    date: "2017-03-18",
    era: "middle",
    src: "archive",
    type: "rarity",
    fact1: "The Animal I Am — live at the Ware Center. Earliest full capture on her channel.",
    fact2: "March 2017. One of those performances where you can hear the room go quiet.",
    ytId: "sEBcKAX_ja4",
    color: "#181420",
    icon: "🎬",
  },

  {
    date: "2022-11-18",
    era: "fire",
    src: "archive",
    type: "historical",
    fact1: "Rich People — released as a digital single. The live video passed 213K views.",
    fact2: "Then Natalie Portman and Zach Braff showed up on a second version. The song kept finding new rooms.",
    ytId: "HCxjSlRcF-M",
    color: "#1c1614",
    icon: "🔥",
  },

  {
    date: "2024-07-01",
    era: "fire",
    src: "archive",
    type: "historical",
    fact1: "Ugly Nasty Commie Bitch — official video drops July 2024. 304K views.",
    fact2: "Her biggest official-channel upload. The song that had been building in clips for a year finally had a video to match.",
    ytId: "-tfH1nty62U",
    color: "#1c1210",
    icon: "🔥",
  },

  {
    date: "2026-01-16",
    era: "fire",
    src: "archive",
    type: "historical",
    fact1: "Elon Musk — official music video. January 2026.",
    fact2: "Preceded by months of kitchen-clip teases. The song arrived already known.",
    ytId: "jDf1ksSbSd4",
    color: "#1c1410",
    icon: "🎬",
  },

  {
    date: "2026-03-22",
    era: "fire",
    src: "archive",
    type: "historical",
    fact1: "Everything Is Great! — collaboration with The Burning Hell. March 2026.",
    fact2: "The first of multiple Burning Hell collaborations in 2026. Price of Eggs followed two weeks later.",
    ytId: "JhZkPRtc4Go",
    color: "#14131a",
    icon: "🎵",
  },
];
