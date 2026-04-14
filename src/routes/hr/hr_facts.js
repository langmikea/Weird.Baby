// ─── WEIRD.BABY FACT DATABASE — Hunter Root ──────────────────────────────────
// Schema:
//   id        unique string
//   albumId   matches SPINE id, or null (any album)
//   trackId   matches track title (exact), or null (any track in album)
//   type      "intro" | "track" | "album" | "artist" | "meta"
//   weight    1–10, higher = more likely to surface (track facts default 10)
//   lines     exactly 2 strings, shown together as one block
//
// CONTENT FILL IS A SEPARATE TASK — these are seeds to prove the machinery.
// Add facts freely. The selector handles deduplication and weighting.
//
// BACKLOG: Verify "Covert Concert Series" references (dandelions-album-002, dandelions-homestead-002)
// BACKLOG: Verify Town Rat Heathen "three versions" claim (ark-trt-002)
// BACKLOG: Verify "crossed a million views in the weeks after" velocity (ark-album-001)
// ─────────────────────────────────────────────────────────────────────────────

export const FACTS = [

  // ── ARTIST-LEVEL (albumId: null — any album, any track) ───────────────────
  {
    id: "artist-001",
    albumId: null, trackId: null, type: "artist", weight: 5,
    lines: [
      "Hunter Root is a solo folk/Americana artist",
      "based out of Lancaster, Pennsylvania."
    ]
  },
  {
    id: "artist-002",
    albumId: null, trackId: null, type: "artist", weight: 5,
    lines: [
      "Before Tolok Records and Northstar Artists, Hunter wrote, recorded,",
      "and released everything himself. The songs came first. The team came later."
    ]
  },
  {
    id: "artist-003",
    albumId: null, trackId: null, type: "artist", weight: 4,
    lines: [
      "His live shows are just Hunter and a guitar.",
      "Every performance is its own thing."
    ]
  },
  {
    id: "artist-004",
    albumId: null, trackId: null, type: "artist", weight: 4,
    lines: [
      "Town Rat Heathen brought Hunter a wave of new listeners",
      "who found their way back through the whole catalog."
    ]
  },

  {
    id: "artist-005",
    albumId: null, trackId: null, type: "artist", weight: 4,
    lines: [
      "Hunter has been playing music since he was twelve.",
      "Founding member of Lancaster's Medusa's Disco before going solo."
    ]
  },
  {
    id: "artist-006",
    albumId: null, trackId: null, type: "artist", weight: 3,
    lines: [
      "Medusa's Disco played their first show at the Chameleon Club",
      "in Lancaster — on the main stage, before they had a bassist."
    ]
  },
  {
    id: "artist-007",
    albumId: null, trackId: null, type: "artist", weight: 3,
    lines: [
      "Hunter's influences: Led Zeppelin, Nirvana, The Doors.",
      "His inspiration: other people's talents, emotions, existence, pain."
    ]
  },

  // ── THEY FINALLY CRACKED ME (2018) ────────────────────────────────────────
  {
    id: "cracked-intro-001",
    albumId: "cracked", trackId: null, type: "intro", weight: 10,
    lines: [
      "They Finally Cracked Me is Hunter Root's debut —",
      "lo-fi, raw, and recorded with almost nothing."
    ]
  },
  {
    id: "cracked-intro-002",
    albumId: "cracked", trackId: null, type: "intro", weight: 10,
    lines: [
      "Cheap wine, identity, and the feeling of coming apart.",
      "The first cracks in the foundation."
    ]
  },
  {
    id: "cracked-album-001",
    albumId: "cracked", trackId: null, type: "album", weight: 6,
    lines: [
      "The lo-fi production on this record wasn't a choice —",
      "it was the equipment available at the time."
    ]
  },
  {
    id: "cracked-album-002",
    albumId: "cracked", trackId: null, type: "album", weight: 6,
    lines: [
      "Listeners who found Hunter through Arkansas often come back here",
      "and hear something completely different — and just as real."
    ]
  },
  {
    id: "cracked-straitlaced-001",
    albumId: "cracked", trackId: "Straitlaced", type: "track", weight: 10,
    lines: [
      "Straitlaced is one of the earliest Hunter Root songs",
      "captured on video — just him, a guitar, and a room."
    ]
  },

  // ── LIFE INSIDE A WHEEL (2019) ────────────────────────────────────────────
  {
    id: "wheel-intro-001",
    albumId: "wheel", trackId: null, type: "intro", weight: 10,
    lines: [
      "Life Inside A Wheel is twelve songs about circular thinking —",
      "the trap you build around yourself without noticing."
    ]
  },
  {
    id: "wheel-intro-002",
    albumId: "wheel", trackId: null, type: "intro", weight: 10,
    lines: [
      "People are programs. The cage is real.",
      "The door might be open."
    ]
  },
  {
    id: "wheel-album-001",
    albumId: "wheel", trackId: null, type: "album", weight: 6,
    lines: [
      "This record marked a step forward in production quality —",
      "still intimate, but more intentional."
    ]
  },
  {
    id: "wheel-pap-001",
    albumId: "wheel", trackId: "People Are Programs", type: "track", weight: 10,
    lines: [
      "People Are Programs received an official music video —",
      "one of Hunter's earliest visual productions."
    ]
  },
  {
    id: "wheel-shapeshifter-001",
    albumId: "wheel", trackId: "Shapeshifter", type: "track", weight: 10,
    lines: [
      "Shapeshifter closes the album with a question, not an answer.",
      "The official audio lets the song breathe on its own."
    ]
  },

  // ── MIMICKING THE SUN LIKE DANDELIONS (2020) ──────────────────────────────
  {
    id: "dandelions-intro-001",
    albumId: "dandelions", trackId: null, type: "intro", weight: 10,
    lines: [
      "Mimicking the Sun Like Dandelions is the album where",
      "family entered the catalog for the first time."
    ]
  },
  {
    id: "dandelions-intro-002",
    albumId: "dandelions", trackId: null, type: "intro", weight: 10,
    lines: [
      "2020. The year Hunter's brother Nick died.",
      "The light gets longer and the shadows too."
    ]
  },
  {
    id: "dandelions-album-001",
    albumId: "dandelions", trackId: null, type: "album", weight: 6,
    lines: [
      "Homestead became the song fans pointed to",
      "when they tried to explain Hunter Root to someone new."
    ]
  },
  {
    id: "dandelions-album-002",
    albumId: "dandelions", trackId: null, type: "album", weight: 5,
    lines: [
      "The Covert Concert Series sessions captured several songs",
      "from this era in an intimate studio environment."
    ]
  },
  {
    id: "dandelions-lampshade-001",
    albumId: "dandelions", trackId: "Lampshade", type: "track", weight: 10,
    lines: [
      "Lampshade opens the album with misdirection —",
      "it sounds like a love song until it doesn't."
    ]
  },
  {
    id: "dandelions-homestead-001",
    albumId: "dandelions", trackId: "Homestead", type: "track", weight: 10,
    lines: [
      "Homestead was written about a specific place and a specific feeling.",
      "Listeners have claimed it as their own ever since."
    ]
  },
  {
    id: "dandelions-homestead-002",
    albumId: "dandelions", trackId: "Homestead", type: "track", weight: 9,
    lines: [
      "The live-in-studio version from the Covert Concert Series",
      "strips the song down to its frame."
    ]
  },
  {
    id: "dandelions-wildfire-001",
    albumId: "dandelions", trackId: "Wildfire", type: "track", weight: 10,
    lines: [
      "Wildfire closes the album with an image that stays with you.",
      "The official visualizer earns every second of its runtime."
    ]
  },

  // ── SKIPPING STONES (2021) ────────────────────────────────────────────────
  {
    id: "skipping-intro-001",
    albumId: "skipping", trackId: null, type: "intro", weight: 10,
    lines: [
      "Skipping Stones That Sink Before They're Thrown",
      "does not announce itself as a grief album. But it is."
    ]
  },
  {
    id: "skipping-intro-002",
    albumId: "skipping", trackId: null, type: "intro", weight: 10,
    lines: [
      "Ten songs about waiting to feel better.",
      "The mend that keeps getting pushed one more day out."
    ]
  },
  {
    id: "skipping-album-001",
    albumId: "skipping", trackId: null, type: "album", weight: 6,
    lines: [
      "This record came a year after Nick's death.",
      "You can hear him in the negative space."
    ]
  },
  {
    id: "skipping-nothin-001",
    albumId: "skipping", trackId: "Nothin' Wrong", type: "track", weight: 10,
    lines: [
      "Nothin' Wrong might be the most quietly devastating song",
      "Hunter has ever written."
    ]
  },
  {
    id: "skipping-cusp-001",
    albumId: "skipping", trackId: "Cusp Of The Mend", type: "track", weight: 10,
    lines: [
      "Cusp Of The Mend names the feeling most people can't name —",
      "almost better, but not yet."
    ]
  },

  // ── ARKANSAS (2023) ───────────────────────────────────────────────────────
  {
    id: "ark-intro-001",
    albumId: "arkansas", trackId: null, type: "intro", weight: 10,
    lines: [
      "Arkansas is the album that broke Hunter Root",
      "into a much wider audience."
    ]
  },
  {
    id: "ark-intro-002",
    albumId: "arkansas", trackId: null, type: "intro", weight: 10,
    lines: [
      "A tribute to Nick and to the years spent in Arkansas.",
      "The breakout record."
    ]
  },
  {
    id: "ark-album-001",
    albumId: "arkansas", trackId: null, type: "album", weight: 7,
    lines: [
      "Town Rat Heathen crossed a million views",
      "in the weeks after it was posted."
    ]
  },
  {
    id: "ark-album-002",
    albumId: "arkansas", trackId: null, type: "album", weight: 6,
    lines: [
      "Arkansas brought listeners who had never heard of Hunter Root",
      "straight back to 2018 to start from the beginning."
    ]
  },
  {
    id: "ark-trt-001",
    albumId: "arkansas", trackId: "Town Rat Heathen", type: "track", weight: 10,
    lines: [
      "Town Rat Heathen is the song that changed everything.",
      "It spread person to person before the algorithm caught up."
    ]
  },
  {
    id: "ark-trt-002",
    albumId: "arkansas", trackId: "Town Rat Heathen", type: "track", weight: 9,
    lines: [
      "Three versions exist: official, an early version, and a live cut.",
      "Each one is a different animal."
    ]
  },
  {
    id: "ark-reverend-001",
    albumId: "arkansas", trackId: "Reverend", type: "track", weight: 10,
    lines: [
      "Reverend is one of the most cinematic things Hunter has made.",
      "The official video matches that energy."
    ]
  },
  {
    id: "ark-silver-001",
    albumId: "arkansas", trackId: "Silver Lining", type: "track", weight: 10,
    lines: [
      "Silver Lining opens and closes the album.",
      "The reprise at the end earns its place."
    ]
  },
  {
    id: "ark-quicksand-001",
    albumId: "arkansas", trackId: "Quicksand Sinking", type: "track", weight: 10,
    lines: [
      "Quicksand Sinking has both a music video and a lyric video.",
      "The lyric video rewards close listeners."
    ]
  },
  {
    id: "ark-quicksand-002",
    albumId: "arkansas", trackId: "Quicksand Sinking", type: "track", weight: 8,
    lines: [
      "Quicksand Sinking passed 2.5 million views on YouTube.",
      "The second most-watched Hunter Root video behind Town Rat Heathen."
    ]
  },
  {
    id: "ark-reverend-002",
    albumId: "arkansas", trackId: "Reverend", type: "track", weight: 8,
    lines: [
      "Reverend has 1.6 million views on YouTube.",
      "The video earned them — it's the most cinematic thing Hunter has released."
    ]
  },

  // ── CROOKED HOME (2025) ───────────────────────────────────────────────────
  {
    id: "crooked-intro-001",
    albumId: "crooked", trackId: null, type: "intro", weight: 10,
    lines: [
      "Crooked Home is the most personal record Hunter has made.",
      "Inherited damage. Addict parents. A childhood behind a bathroom door."
    ]
  },
  {
    id: "crooked-intro-002",
    albumId: "crooked", trackId: null, type: "intro", weight: 10,
    lines: [
      "The past made present.",
      "Every song is a room in that house."
    ]
  },
  {
    id: "crooked-album-001",
    albumId: "crooked", trackId: null, type: "album", weight: 7,
    lines: [
      "This is Hunter's most produced record to date —",
      "the arrangements have more space and more weight."
    ]
  },
  {
    id: "crooked-album-002",
    albumId: "crooked", trackId: null, type: "album", weight: 6,
    lines: [
      "Nearly every track on Crooked Home has an official visualizer.",
      "The visual language is consistent and deliberate."
    ]
  },
  {
    id: "crooked-94-001",
    albumId: "crooked", trackId: "'94", type: "track", weight: 10,
    lines: [
      "'94 opens the album with a year as a title —",
      "a specific moment anchoring everything that follows."
    ]
  },
  {
    id: "crooked-94-002",
    albumId: "crooked", trackId: "'94", type: "track", weight: 9,
    lines: [
      "The acoustic clip of '94 shows the song at its most unguarded.",
      "Just the melody and the words."
    ]
  },
  {
    id: "crooked-ff-001",
    albumId: "crooked", trackId: "Friendly Fire", type: "track", weight: 10,
    lines: [
      "Friendly Fire has both a music video and a lyric video.",
      "It's one of the most direct songs on the record."
    ]
  },
  {
    id: "crooked-bones-001",
    albumId: "crooked", trackId: "My Brother's Bones", type: "track", weight: 10,
    lines: [
      "My Brother's Bones closes the album.",
      "Nick is here again, as he has been since 2020."
    ]
  },
  {
    id: "crooked-cookin-001",
    albumId: "crooked", trackId: "Cookin' in the Bathroom", type: "track", weight: 10,
    lines: [
      "Cookin' in the Bathroom has over 500K views on YouTube.",
      "The title is disarming. The song is not."
    ]
  },
  {
    id: "crooked-keeper-001",
    albumId: "crooked", trackId: "The Keeper", type: "track", weight: 10,
    lines: [
      "The Keeper sits near the end of the record",
      "as a kind of reckoning with what gets passed down."
    ]
  },

];
