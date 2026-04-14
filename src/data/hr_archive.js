// ─── WEIRD.BABY ARCHIVE DATA — Hunter Root ──────────────────────────────────
// Schema per artifact:
//   date     ISO date string — used for deterministic ordering (oldest first)
//   era      "seeds" | "medusas" | "solo"
//   src      "fb" | "insta" | "press" | "archive"
//   type     "historical" | "interview" | "rarity"
//   fact1    Primary caption — always present
//   fact2    Secondary detail — optional, shown in lightbox
//   color    Placeholder bg color until real image (DARK — never bright)
//   icon     Placeholder emoji until real image
//
// Mike curates all content. Nothing enters without expressed purpose.
// poster and photo types migrated to hr_artifacts.js (Panel 3) — April 12 2026
//
// Sources: KNOWLEDGE.md (sections 1–11), yt_research/channel_videos.json
// BACKLOG: Scrub pass needed — see entry dated 2016-01-10
// BACKLOG: Verify Arkansas album release date and add entry
// ─────────────────────────────────────────────────────────────────────────────

export const HR_ARCHIVE = [

  // ─── MEDUSA'S DISCO ERA ───────────────────────────────────────────────────

  {
    date: "2012-06-01",
    era: "medusas",
    src: "archive",
    type: "historical",
    fact1: "Medusa's Disco formed — Lancaster, Pennsylvania. June 2012.",
    fact2: "Hunter Root and Wynton Huddle started playing together in Wynton's dad's living room. Acoustic first, then a four-piece. First song they played together: Strange Chemistry.",
    color: "#12101a",
    icon: "🎸",
  },
  {
    date: "2012-10-12",
    era: "medusas",
    src: "archive",
    type: "historical",
    fact1: "First show — Chameleon Club main stage, Lancaster PA.",
    fact2: "Before they even had a bassist. YouTube footage exists: 'Wishful Thinking (1st show).' The room didn't know what it was watching.",
    color: "#14111c",
    icon: "🎤",
  },
  {
    date: "2013-12-11",
    era: "medusas",
    src: "insta",
    type: "historical",
    fact1: "First rehearsal with Tylar — a new member joins the lineup.",
    fact2: "Captured on Instagram. The band was still forming its shape. Early lineup: Wynton Huddle, Hunter Root, Alex Aument, Anthony Procopio.",
    color: "#161220",
    icon: "📷",
  },
  {
    date: "2013-12-20",
    era: "medusas",
    src: "insta",
    type: "historical",
    fact1: "'#SEEDS first cd here and ready for consumption.' Physical CD release day.",
    fact2: "Posted to Instagram. The digital release on Bandcamp followed two weeks later as Questioned By A Ghost.",
    color: "#181420",
    icon: "💿",
  },
  {
    date: "2014-08-14",
    era: "medusas",
    src: "press",
    type: "interview",
    fact1: "Blue Harvest Beat — 'Kurt Cobain, Lancaster, and Cold Pizza.'",
    fact2: "Harrison Giza's interview. One of the earliest published pieces on the band. They talked influences: Led Zeppelin, Nirvana, The Doors.",
    color: "#1a1518",
    icon: "📰",
  },
  {
    date: "2016-01-10",
    era: "medusas",
    src: "fb",
    type: "historical",
    fact1: "Final Medusa's Disco show announcement — January 2016.",
    fact2: "The post that marked the end of the band and the beginning of the solo era.",
    color: "#14111c",
    icon: "📜",
    // SCRUB: Medusa's Disco continued releasing through 2023. Verify what this event actually was.
  },
  {
    date: "2016-11-04",
    era: "medusas",
    src: "archive",
    type: "rarity",
    fact1: "Unreleased Medusa's Disco demo — tracked but never mixed.",
    fact2: "Pulled from a shared drive backup. One of very few surviving pre-solo recordings.",
    color: "#181420",
    icon: "💿",
  },

  // ─── SEEDS ERA (proto-solo) ───────────────────────────────────────────────

  {
    date: "2017-06-23",
    era: "seeds",
    src: "archive",
    type: "historical",
    fact1: "Phone Recordings EP — the first thing released under the name Hunter Root.",
    fact2: "Bandcamp, June 23, 2017. Before there was an audience. Before there was a plan. Just a phone and some songs.",
    color: "#1a1810",
    icon: "📱",
  },

  // ─── SOLO ERA ─────────────────────────────────────────────────────────────

  {
    date: "2018-04-25",
    era: "medusas",
    src: "press",
    type: "interview",
    fact1: "Chasing Destino interview — the origin story, told in full.",
    fact2: "First show on the Chameleon Club main stage before they had a bassist. Footage floating around online. The whole early timeline laid out in one piece.",
    color: "#1a1518",
    icon: "📰",
  },
  {
    date: "2019-09-05",
    era: "medusas",
    src: "press",
    type: "interview",
    fact1: "PA Musician Magazine — 'Hitting the Road, September 2019.'",
    fact2: "Regional press. Seven years in, and most people in Lancaster still hadn't heard of them.",
    color: "#1a1614",
    icon: "📰",
  },
  {
    date: "2019-10-20",
    era: "medusas",
    src: "press",
    type: "interview",
    fact1: "NEPAudio review of Orphic Grimoire.",
    fact2: "Published the same month the album dropped. A close listen from someone paying real attention.",
    color: "#1a1614",
    icon: "📰",
  },
  {
    date: "2019-12-20",
    era: "medusas",
    src: "archive",
    type: "rarity",
    fact1: "Who's Medusa — Live at Damstock. Released on Bandcamp.",
    fact2: "A live album from a single show. The kind of recording that only exists because someone thought to press record.",
    color: "#181420",
    icon: "🎵",
  },
  {
    date: "2023-02-03",
    era: "solo",
    src: "archive",
    type: "historical",
    fact1: "Town Rat Heathen — official music video published on YouTube.",
    fact2: "It spread person to person before the algorithm caught up. 4.5 million views and counting. The song that changed everything.",
    color: "#1c1610",
    icon: "🔥",
  },
  {
    date: "2023-03-31",
    era: "solo",
    src: "archive",
    type: "historical",
    fact1: "Reverend — official music video. The most cinematic thing Hunter has made.",
    fact2: "Published March 31, 2023. 1.6 million views. If Town Rat Heathen opened the door, Reverend proved there was a whole house behind it.",
    color: "#1c1610",
    icon: "🎬",
  },
  {
    date: "2023-09-30",
    era: "solo",
    src: "press",
    type: "interview",
    fact1: "Local press feature after Arkansas — 'Lancaster's quiet export.'",
    fact2: "One of the few interviews Hunter gave during the Arkansas cycle. He doesn't do many.",
    color: "#1a1812",
    icon: "🎤",
  },
  {
    date: "2023-11-10",
    era: "medusas",
    src: "archive",
    type: "rarity",
    fact1: "10 Year Anniversary — Live at Zoetropolis. The full band, one decade in.",
    fact2: "Released on Bandcamp. A live document of a band that never stopped playing — even after the solo career took off.",
    color: "#181420",
    icon: "🎵",
  },
  {
    date: "2024-01-15",
    era: "solo",
    src: "press",
    type: "interview",
    fact1: "MuzicNotez Magazine — interview on viral success and the Arkansas album.",
    fact2: "Published January 2024. What happens when the numbers arrive and the work stays the same.",
    color: "#1a1518",
    icon: "📰",
  },
  {
    date: "2024-02-09",
    era: "medusas",
    src: "archive",
    type: "rarity",
    fact1: "Medusa's Disco releases a Nirvana 'Breed' cover — via Distrokid.",
    fact2: "Announced on Facebook. The band still surfaces when it has something worth saying.",
    color: "#181420",
    icon: "💿",
  },
  {
    date: "2025-10-21",
    era: "solo",
    src: "press",
    type: "interview",
    fact1: "Americana Highways — 'Turning Grief Into Grace on Crooked Home.'",
    fact2: "The most personal record he's made, and the interview matched it. Inherited damage. A childhood behind a bathroom door.",
    color: "#1a1518",
    icon: "📰",
  },
  {
    date: "2025-11-24",
    era: "solo",
    src: "press",
    type: "interview",
    fact1: "The Country Note — 'Where Truth Finds Its Voice.'",
    fact2: "Published a month after Crooked Home dropped. The press cycle for this album ran deeper than any before it.",
    color: "#1a1518",
    icon: "📰",
  },

  // ── FAN & THIRD-PARTY ─────────────────────────────────────────────────────

  {
    date: "2020-09-04",
    era: "solo",
    src: "archive",
    type: "rarity",
    fact1: "Covert Concert Series — full Hunter Root session. Pre-viral document.",
    fact2: "17K views. Captured before Town Rat Heathen changed everything. The solo project in its early form.",
    color: "#181410",
    icon: "🎬",
  },
  {
    date: "2022-09-09",
    era: "solo",
    src: "archive",
    type: "rarity",
    fact1: "Line Check Audio Sessions — Can't Outshine The Truth. Solo capture.",
    fact2: "214K views on YouTube. A third-party session that became the most-watched live document of the song.",
    color: "#1a1612",
    icon: "🎬",
  },
  {
    date: "2023-02-16",
    era: "medusas",
    src: "archive",
    type: "interview",
    fact1: "Medusa's Disco — Hunter Root on collaborating with Alex Aument.",
    fact2: "Posted on the Medusa's Disco channel. The band talking about the solo work. The two worlds acknowledging each other.",
    color: "#181420",
    icon: "🎤",
  },
  {
    date: "2023-07-21",
    era: "solo",
    src: "archive",
    type: "rarity",
    fact1: "Line Check Audio Sessions — Quicksand Sinking. Full band, live session.",
    fact2: "10K views. The band version captured live. A different animal than the official video.",
    color: "#1a1612",
    icon: "🎬",
  },
];
