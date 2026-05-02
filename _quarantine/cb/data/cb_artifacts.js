// ─── WEIRD.BABY ARTIFACTS DATA — Carsie Blanton ───────────────────────────────
// Schema per artifact:
//   date     ISO date string — chronological sort key (oldest first)
//   era      "early" | "middle" | "fire"
//   type     "poster" | "setlist" | "photo" | "fan-art" | "handwritten" | "video" | "ticket"
//   src      "donated" | "archive" | "stage"
//   fact1    Primary caption — always present
//   fact2    Secondary detail — optional, lightbox only
//   credit   Contributor handle or name — optional
//   color    Placeholder bg color until real image (DARK — never bright)
//   icon     Placeholder emoji until real image
//
// The memories box. Physical and ephemeral. The proof people were there.
// Mike curates all content. Nothing enters without expressed purpose.
// ─────────────────────────────────────────────────────────────────────────────

export const CB_ARTIFACTS = [
  {
    date: "2012-02-15",
    era: "early",
    type: "video",
    src: "archive",
    fact1: "Backbone — official video. The song that got NPR's attention.",
    fact2: "194K views on her channel. Produced by Oliver Wood. The first clip most people ever saw.",
    credit: null,
    ytId: "WEdIg_dOVOY",
    color: "#14111c",
    icon: "🎬",
  },

  {
    date: "2012-03-01",
    era: "early",
    type: "video",
    src: "archive",
    fact1: "Smoke Alarm — official video from Idiot Heart.",
    fact2: "One of the earliest studio-quality videos on her channel. The visual style was still forming.",
    credit: null,
    ytId: "dQQ09Lxy7dI",
    color: "#161220",
    icon: "🎬",
  },

  {
    date: "2012-04-01",
    era: "early",
    type: "video",
    src: "archive",
    fact1: "Backseat — official video from Idiot Heart.",
    fact2: "Three official videos from one album. That was the standard she set and kept.",
    credit: null,
    ytId: "klgEY0SfgN0",
    color: "#141418",
    icon: "🎬",
  },

  {
    date: "2014-07-01",
    era: "middle",
    type: "video",
    src: "archive",
    fact1: "Laziest Gal in Town — from Not Old, Not New. Jazz standards.",
    fact2: "A left turn nobody expected. She could have kept making folk-pop forever. She chose not to.",
    credit: null,
    ytId: "PrOc-qWX71w",
    color: "#18141c",
    icon: "🎷",
  },

  {
    date: "2014-08-15",
    era: "middle",
    type: "video",
    src: "archive",
    fact1: "Sweet Lorraine — live sessions. Two versions on the channel.",
    fact2: "The jazz record didn't just exist on record. She played these songs live and kept filming.",
    credit: null,
    ytId: "--IJbpWEMis",
    color: "#161418",
    icon: "🎵",
  },

  {
    date: "2014-12-01",
    era: "middle",
    type: "video",
    src: "archive",
    fact1: "I'll Be Seeing You — duet with Peter Mulvey.",
    fact2: "A standard made personal. Two voices in a room. The collaboration that proved the jazz record wasn't a one-off.",
    credit: "Peter Mulvey",
    ytId: "vSU0URr8c_o",
    color: "#141220",
    icon: "🎤",
  },

  {
    date: "2016-08-10",
    era: "middle",
    type: "video",
    src: "archive",
    fact1: "Hot Night — official video from So Ferocious. 131K views.",
    fact2: "The biggest single video from the So Ferocious era. The energy shifted on this record.",
    credit: null,
    ytId: "hMXcE2Naemo",
    color: "#1a1220",
    icon: "🔥",
  },

  {
    date: "2016-09-01",
    era: "middle",
    type: "video",
    src: "archive",
    fact1: "Vim & Vigor — official video. So Ferocious.",
    fact2: "Back-to-back videos from one album. The visual output matched the songwriting output.",
    credit: null,
    ytId: "lKMRYSEjOIg",
    color: "#18141c",
    icon: "🎬",
  },

  {
    date: "2016-09-15",
    era: "middle",
    type: "video",
    src: "archive",
    fact1: "So Ferocious — title track official video.",
    fact2: "Three official videos from So Ferocious. The same standard from Idiot Heart, carried forward.",
    credit: null,
    ytId: "4_WQJqzPIcM",
    color: "#1a121c",
    icon: "🎬",
  },

  {
    date: "2017-03-18",
    era: "middle",
    type: "video",
    src: "stage",
    fact1: "The Animal I Am — live at the Ware Center. March 2017.",
    fact2: "Earliest full live capture of this song on her channel. The room is quiet. The performance isn't.",
    credit: "Ware Center",
    ytId: "sEBcKAX_ja4",
    color: "#161420",
    icon: "🎤",
  },

  {
    date: "2019-03-01",
    era: "middle",
    type: "video",
    src: "archive",
    fact1: "Jacket — official video from Buck Up.",
    fact2: "The visual storytelling kept evolving. Each album's videos looked different from the last.",
    credit: null,
    ytId: "QEU-lmTeFe4",
    color: "#181614",
    icon: "🎬",
  },

  {
    date: "2019-04-01",
    era: "middle",
    type: "video",
    src: "archive",
    fact1: "American Kid — official video. Buck Up.",
    fact2: "Two official videos from Buck Up. The title track got a lyric video instead, and then a quarantine edition.",
    credit: null,
    ytId: "zRTjMfCuewU",
    color: "#1a1812",
    icon: "🎬",
  },

  {
    date: "2019-05-01",
    era: "middle",
    type: "video",
    src: "archive",
    fact1: "Bed — official video from Buck Up.",
    fact2: "A live version from Tellus360 also exists on the channel. The song lived in multiple rooms.",
    credit: null,
    ytId: "XOeJOiCeLD8",
    color: "#161418",
    icon: "🎬",
  },

  {
    date: "2021-05-01",
    era: "fire",
    type: "video",
    src: "archive",
    fact1: "Party at the End of the World — official video. Love & Rage.",
    fact2: "The album opener got its own video. The title tells you what kind of record this is.",
    credit: null,
    ytId: "yez1Bbb0Xjs",
    color: "#1c1210",
    icon: "🎬",
  },

  {
    date: "2021-05-15",
    era: "fire",
    type: "video",
    src: "archive",
    fact1: "Be Good — official lyric video. 104K views.",
    fact2: "Four versions of Be Good exist on her channel: lyric video, performance, Christmas in the snow, live at Alberta Rose.",
    credit: null,
    ytId: "1anH2uamuaM",
    color: "#1c1614",
    icon: "🎬",
  },

  {
    date: "2021-06-01",
    era: "fire",
    type: "video",
    src: "archive",
    fact1: "Shit List — official video from Love & Rage.",
    fact2: "The title is the thesis. The video matched the energy.",
    credit: null,
    ytId: "IOM6yS43Tic",
    color: "#1a1210",
    icon: "🔥",
  },

  {
    date: "2022-05-01",
    era: "fire",
    type: "video",
    src: "archive",
    fact1: "Fishin' With You — video. John Prine tribute. 227K views.",
    fact2: "From the Body of Work sessions. She heard the song and made it hers. That's exactly the kind of tribute Prine would've wanted.",
    credit: null,
    ytId: "m2-2pZFtBxo",
    color: "#14121a",
    icon: "🎣",
  },

  {
    date: "2022-11-20",
    era: "fire",
    type: "video",
    src: "archive",
    fact1: "Rich People — official live video. 213K views.",
    fact2: "Then the version with Natalie Portman and Zach Braff. Then the 'Best Comments' version. Then Red Rocks 2024. The song kept multiplying.",
    credit: null,
    ytId: "HCxjSlRcF-M",
    color: "#1c1410",
    icon: "🔥",
  },

  {
    date: "2023-01-15",
    era: "fire",
    type: "video",
    src: "archive",
    fact1: "Rich People feat. Natalie Portman & Zach Braff — January 2023.",
    fact2: "The song found rooms most independent artists never enter. She didn't change the song to fit the room.",
    credit: "Natalie Portman, Zach Braff",
    ytId: "RT1sZHjZ9Ps",
    color: "#1a1614",
    icon: "⭐",
  },

  {
    date: "2024-07-15",
    era: "fire",
    type: "video",
    src: "archive",
    fact1: "Ugly Nasty Commie Bitch — official video. July 2024. 304K views.",
    fact2: "Her biggest official-channel upload. A year of kitchen clips finally got the video it deserved.",
    credit: null,
    ytId: "-tfH1nty62U",
    color: "#1c1210",
    icon: "🔥",
  },

  {
    date: "2024-10-01",
    era: "fire",
    type: "video",
    src: "stage",
    fact1: "After the Revolution — live at Red Rocks.",
    fact2: "The first full recorded performance. Red Rocks. The kind of venue that earns a song a different weight.",
    credit: "Red Rocks",
    ytId: "leLZLDljqWk",
    color: "#121820",
    icon: "🏔️",
  },

  {
    date: "2026-01-16",
    era: "fire",
    type: "video",
    src: "archive",
    fact1: "Elon Musk — official music video. January 2026.",
    fact2: "Months of kitchen teases, then the real thing. The release date was not a coincidence.",
    credit: null,
    ytId: "jDf1ksSbSd4",
    color: "#1c1410",
    icon: "🎬",
  },

  {
    date: "2026-03-22",
    era: "fire",
    type: "video",
    src: "archive",
    fact1: "Everything Is Great! — feat. The Burning Hell. March 2026.",
    fact2: "Collaboration as protest. Two acts making the same point from different angles.",
    credit: "The Burning Hell",
    ytId: "JhZkPRtc4Go",
    color: "#14131a",
    icon: "🎵",
  },
];
