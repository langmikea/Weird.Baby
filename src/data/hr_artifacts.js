// ─── WEIRD.BABY ARTIFACTS DATA — Hunter Root ─────────────────────────────────
// Schema per artifact:
//   date     ISO date string — chronological sort key (oldest first)
//   era      "seeds" | "medusas" | "solo"
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
//
// Sources: KNOWLEDGE.md, yt_research/channel_videos.json, MediaVault STATE.md
// Image placeholders: replace color/icon with real image URLs as media is captured
// ─────────────────────────────────────────────────────────────────────────────

export const HR_ARTIFACTS = [

  // ── MEDUSA'S DISCO ERA ────────────────────────────────────────────────────

  {
    date: "2012-10-12",
    era: "medusas",
    type: "video",
    src: "archive",
    fact1: "Wishful Thinking — first show footage. Chameleon Club, Lancaster PA.",
    fact2: "YouTube. Before they had a bassist. The '(1st show)' tag is right there in the title.",
    credit: null,
    color: "#14111c",
    icon: "🎬",
  },
  {
    date: "2013-12-09",
    era: "medusas",
    type: "photo",
    src: "archive",
    fact1: "SEEDS live on stage — December 2013. Instagram capture.",
    fact2: "The name was still SEEDS. The sound was already Medusa's Disco.",
    credit: null,
    color: "#161220",
    icon: "📷",
  },
  {
    date: "2013-12-20",
    era: "medusas",
    type: "photo",
    src: "archive",
    fact1: "SEEDS CD in hand — release day, December 20, 2013.",
    fact2: "'#SEEDS first cd here and ready for consumption.' Instagram. The physical object that preceded everything on Bandcamp.",
    credit: null,
    color: "#181420",
    icon: "💿",
  },
  {
    date: "2014-07-09",
    era: "medusas",
    type: "photo",
    src: "archive",
    fact1: "Medusa's Disco — basement after the show. July 2014.",
    fact2: "Instagram capture. The kind of photo that only makes sense if you were there.",
    credit: null,
    color: "#1a1520",
    icon: "📷",
  },
  {
    date: "2016-01-02",
    era: "medusas",
    type: "video",
    src: "archive",
    fact1: "Atomic 7 — live at Chameleon Club, Lancaster PA. January 2, 2016.",
    fact2: "Official band channel upload. One of the clearest live documents from the Medusa's Disco years.",
    credit: null,
    color: "#18141e",
    icon: "🎬",
  },
  {
    date: "2018-07-28",
    era: "medusas",
    type: "video",
    src: "archive",
    fact1: "Summer Threestival '18 — Medusa's Disco live performance.",
    fact2: "Multiple videos from this show exist on YouTube. Hunter Root listed in the band lineup by name.",
    credit: null,
    color: "#161220",
    icon: "🎬",
  },

  // ── SOLO ERA ──────────────────────────────────────────────────────────────

  {
    date: "2023-02-03",
    era: "solo",
    type: "video",
    src: "archive",
    fact1: "Town Rat Heathen — official music video. The one that changed everything.",
    fact2: "Published February 3, 2023. It spread person to person before the algorithm caught up. 4.5 million views.",
    credit: null,
    color: "#1c1610",
    icon: "🔥",
  },
  {
    date: "2023-03-31",
    era: "solo",
    type: "video",
    src: "archive",
    fact1: "Reverend — official music video. Most cinematic video from an unsigned artist.",
    fact2: "Published March 31, 2023. 1.6 million views. The visual matched the ambition of the song.",
    credit: null,
    color: "#1c1610",
    icon: "🎬",
  },
  {
    date: "2023-10-13",
    era: "solo",
    type: "video",
    src: "archive",
    fact1: "Quicksand Sinking — official music video.",
    fact2: "Published October 13, 2023. 2.5 million views. Both a music video and a lyric video exist for this one.",
    credit: null,
    color: "#1c1614",
    icon: "🎬",
  },
  {
    date: "2023-11-10",
    era: "medusas",
    type: "video",
    src: "archive",
    fact1: "Twisted Dentist — live at Zoetropolis. From the 10 Year Anniversary show.",
    fact2: "Official band channel. A decade of playing together and the energy hasn't settled.",
    credit: null,
    color: "#181420",
    icon: "🎵",
  },
  {
    date: "2024-11-08",
    era: "solo",
    type: "video",
    src: "archive",
    fact1: "Cookin' in the Bathroom — official music video.",
    fact2: "Published November 8, 2024. 523K views. From Crooked Home — the most personal record he's made.",
    credit: null,
    color: "#161418",
    icon: "🎬",
  },
  {
    date: "2024-12-23",
    era: "solo",
    type: "video",
    src: "archive",
    fact1: "A Pot Song — acoustic clip. Just Hunter and a guitar.",
    fact2: "Published December 23, 2024. 906K views. The kind of video that makes you feel like you're in the room.",
    credit: null,
    color: "#1a1812",
    icon: "🎵",
  },
  {
    date: "2025-10-01",
    era: "solo",
    type: "photo",
    src: "archive",
    fact1: "Harrisburg show — October 2025. Photos from the crowd.",
    fact2: "18 photos captured and cataloged in MediaVault. GPS confirmed: Harrisburg, Pennsylvania.",
    credit: null,
    color: "#1c1812",
    icon: "📷",
  },
      { title: "My Brother's Bones", videos: [{ ytId: "wi5G_Zn74gc", label: "Official Music Video", type: "official" }] }
,
  // ── FAN & THIRD-PARTY ─────────────────────────────────────────────────────

  {
    date: "2020-09-04",
    era: "solo",
    type: "video",
    src: "stage",
    fact1: "CCS Presents: Hunter Root — full Covert Concert Series session. September 2020.",
    fact2: "17K views. Pre-viral. One of the earliest full-set captures of the solo project, before anyone knew who he was.",
    credit: "Covert Concert Series",
    color: "#181410",
    icon: "🎬",
  },
  {
    date: "2022-09-09",
    era: "solo",
    type: "video",
    src: "stage",
    fact1: "Can't Outshine The Truth — Line Check Audio Sessions. September 2022.",
    fact2: "214K views. A third-party capture that became the definitive live document of this song. Hunter solo, no band.",
    credit: "Line Check Audio Sessions",
    color: "#1a1612",
    icon: "🎬",
  },
  {
    date: "2025-08-10",
    era: "solo",
    type: "video",
    src: "youtube",
    fact1: "Cookin' in the Bathroom — cover by Violet Lempke. August 2025.",
    fact2: "She heard the song and made it her own. Exactly the kind of thing this museum exists to surface.",
    credit: "Violet Lempke",
    color: "#1c1814",
    icon: "🎵",
  },
];
