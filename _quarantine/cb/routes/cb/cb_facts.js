// ─── WEIRD.BABY FACT DATABASE — Carsie Blanton ──────────────────────────────
// Schema matches src/routes/hr/hr_facts.js:
//   id        unique string
//   albumId   matches SPINE id in cb_discography.js, or null (any album)
//   trackId   matches track title (exact), or null (any track in album)
//   type      "intro" | "track" | "album" | "artist" | "meta"
//   weight    1–10, higher = more likely to surface (track facts default 10)
//   lines     exactly 2 strings, shown together as one block
//
// Every entry is ONE fact. No composite claims, no guessing.
// Unverified / provisional claims are flagged "BACKLOG" and either omitted
// or annotated below the entry. Sources live in yt_research/ + project docs.
//
// ─── BACKLOG ────────────────────────────────────────────────────────────────
//   - Verify "seventh album" claim for Love & Rage (Irish Times phrasing —
//     depends on whether EPs like Rude Remarks count)
//   - Verify all view-count facts periodically (values current as of April 2026)
//   - Confirm Body of Work personnel (Joe Plowman / Tyler Chester) via Bandcamp liner
//   - Confirm Idiot Heart producer credit (Oliver Wood) via liner
//   - Confirm Not Old, Not New producer credit (John Porter / Music Shed Studios)
//   - Confirm Rich People production credits (Patrick Firth / Joe Plowman)
//   - Confirm exact FAI 2026 Artist of the Year award name and ceremony date
// ─────────────────────────────────────────────────────────────────────────────

export const FACTS = [

  // ── ARTIST-LEVEL (albumId: null — any album, any track) ───────────────────
  {
    id: "artist-001",
    albumId: null, trackId: null, type: "artist", weight: 6,
    lines: [
      "Carson Amanda \"Carsie\" Blanton was born July 22, 1985",
      "in Luray, Virginia."
    ]
  },
  {
    id: "artist-002",
    albumId: null, trackId: null, type: "artist", weight: 5,
    lines: [
      "She is a singer-songwriter based in New Jersey.",
      "Twenty years active, fully independent."
    ]
  },
  {
    id: "artist-003",
    albumId: null, trackId: null, type: "artist", weight: 5,
    lines: [
      "She releases her records on her own label, Head Bitch Music.",
      "There is no outside label, no outside gatekeeper."
    ]
  },
  {
    id: "artist-004",
    albumId: null, trackId: null, type: "artist", weight: 4,
    lines: [
      "Her catalog moves between folk-pop, jazz-inflected cabaret,",
      "and explicitly political protest songwriting."
    ]
  },
  {
    id: "artist-005",
    albumId: null, trackId: null, type: "artist", weight: 4,
    lines: [
      "Her work has been covered by NPR, Rolling Stone, and the Associated Press —",
      "critical respect without commercial-machine backing."
    ]
  },
  {
    id: "artist-006",
    albumId: null, trackId: null, type: "artist", weight: 4,
    lines: [
      "In January 2026 she delivered an acceptance speech",
      "for Artist of the Year at the Folk Alliance International conference."
    ]
  },
  {
    id: "artist-007",
    albumId: null, trackId: null, type: "artist", weight: 3,
    lines: [
      "She has a byline in The Nation.",
      "The political voice on the records is the political voice on the page."
    ]
  },
  {
    id: "artist-008",
    albumId: null, trackId: null, type: "artist", weight: 3,
    lines: [
      "She self-describes her career this way:",
      "never successful as a mainstream musician — free to become a revolutionary."
    ]
  },
  {
    id: "artist-009",
    albumId: null, trackId: null, type: "artist", weight: 3,
    lines: [
      "Her fan footprint on Reddit is unusually cross-cultural —",
      "r/Socialistmusic, r/FolkPunk, r/johnprine, r/polyamory, r/SwingDancing, r/JesseWelles."
    ]
  },
  {
    id: "artist-010",
    albumId: null, trackId: null, type: "artist", weight: 3,
    lines: [
      "In September 2025 she sailed with the Global Sumud Flotilla toward Gaza",
      "and kept filming from the deck."
    ]
  },

  // ── META / CATALOG-SHAPE ──────────────────────────────────────────────────
  {
    id: "meta-001",
    albumId: null, trackId: null, type: "meta", weight: 3,
    lines: [
      "Her official YouTube channel holds 125 videos as of April 2026 —",
      "a full catalog of studio videos, lyric videos, and rent-party livestreams."
    ]
  },

  // ── AIN'T SO GREEN (2005) ─────────────────────────────────────────────────
  {
    id: "aint-so-green-intro-001",
    albumId: "aint-so-green", trackId: null, type: "intro", weight: 10,
    lines: [
      "Ain't So Green is her debut studio album,",
      "recorded back home in Virginia."
    ]
  },
  // BACKLOG: more album/track facts once tracklist + personnel are verified from Bandcamp.

  // ── BUOY (2009) ───────────────────────────────────────────────────────────
  {
    id: "buoy-intro-001",
    albumId: "buoy", trackId: null, type: "intro", weight: 10,
    lines: [
      "Buoy was released on July 22, 2009 —",
      "Carsie's birthday, and her second studio album."
    ]
  },
  // BACKLOG: Verify July 22, 2009 release date against Bandcamp liner.

  // ── IDIOT HEART (2012) ────────────────────────────────────────────────────
  {
    id: "idiot-heart-intro-001",
    albumId: "idiot-heart", trackId: null, type: "intro", weight: 10,
    lines: [
      "Idiot Heart was released January 31, 2012,",
      "and produced by Oliver Wood of The Wood Brothers."
    ]
  },
  {
    id: "idiot-heart-backbone-001",
    albumId: "idiot-heart", trackId: "Backbone", type: "track", weight: 9,
    lines: [
      "The official video for Backbone has passed 194K views,",
      "one of the most-watched tracks on her official channel."
    ]
  },

  // ── RUDE REMARKS AND DIRTY JOKES (2013) ───────────────────────────────────
  {
    id: "rude-remarks-intro-001",
    albumId: "rude-remarks", trackId: null, type: "intro", weight: 10,
    lines: [
      "Rude Remarks and Dirty Jokes is a short EP from 2013.",
      "It lives between Idiot Heart and her jazz standards record."
    ]
  },
  // BACKLOG: third track title unconfirmed — add facts once the tracklist is complete.

  // ── NOT OLD, NOT NEW (2014) ───────────────────────────────────────────────
  {
    id: "not-old-not-new-intro-001",
    albumId: "not-old-not-new", trackId: null, type: "intro", weight: 10,
    lines: [
      "Not Old, Not New was released June 24, 2014 —",
      "a record of pre-bebop jazz vocal standards."
    ]
  },
  {
    id: "not-old-not-new-album-001",
    albumId: "not-old-not-new", trackId: null, type: "album", weight: 6,
    lines: [
      "The album was produced by John Porter",
      "at Music Shed Studios in New Orleans."
    ]
  },
  {
    id: "not-old-not-new-ibsy-001",
    albumId: "not-old-not-new", trackId: "I'll Be Seeing You", type: "track", weight: 9,
    lines: [
      "The live version of \"I'll Be Seeing You\" is a duet",
      "with singer-songwriter Peter Mulvey."
    ]
  },

  // ── SO FEROCIOUS (2016) ───────────────────────────────────────────────────
  {
    id: "so-ferocious-intro-001",
    albumId: "so-ferocious", trackId: null, type: "intro", weight: 10,
    lines: [
      "So Ferocious was released August 2, 2016.",
      "Ten songs. The teeth start showing."
    ]
  },
  {
    id: "so-ferocious-hot-night-001",
    albumId: "so-ferocious", trackId: "Hot Night", type: "track", weight: 9,
    lines: [
      "Hot Night's official video has passed 131K views —",
      "her biggest single video from the So Ferocious era."
    ]
  },
  {
    id: "so-ferocious-animal-001",
    albumId: "so-ferocious", trackId: "The Animal I Am", type: "track", weight: 8,
    lines: [
      "The Ware Center performance of \"The Animal I Am\" (March 2017)",
      "is the earliest full live capture of the song on her channel."
    ]
  },

  // ── BUCK UP (2019) ────────────────────────────────────────────────────────
  {
    id: "buck-up-intro-001",
    albumId: "buck-up", trackId: null, type: "intro", weight: 10,
    lines: [
      "Buck Up was released February 15, 2019.",
      "Ten tracks, ending with the title song."
    ]
  },
  {
    id: "buck-up-title-001",
    albumId: "buck-up", trackId: "Buck Up", type: "track", weight: 9,
    lines: [
      "The \"Buck Up — Quarantine Edition\" went up in April 2020,",
      "one of her earliest pandemic-era videos from home."
    ]
  },

  // ── LOVE & RAGE (2021) ────────────────────────────────────────────────────
  {
    id: "love-and-rage-intro-001",
    albumId: "love-and-rage", trackId: null, type: "intro", weight: 10,
    lines: [
      "Love & Rage was released April 30, 2021.",
      "Eleven songs — half love letter, half open fist."
    ]
  },
  {
    id: "love-and-rage-album-001",
    albumId: "love-and-rage", trackId: null, type: "album", weight: 6,
    lines: [
      "The Irish Times called Love & Rage",
      "\"the singer and activist's sparkling seventh album.\""
    ]
  },
  {
    id: "love-and-rage-album-002",
    albumId: "love-and-rage", trackId: null, type: "album", weight: 6,
    lines: [
      "NPR covered the record under the headline",
      "\"An Open-Hearted Protest Album.\""
    ]
  },
  {
    id: "love-and-rage-begood-001",
    albumId: "love-and-rage", trackId: "Be Good", type: "track", weight: 9,
    lines: [
      "The official lyric video for Be Good has passed 104K views —",
      "one of the most-played songs off Love & Rage."
    ]
  },

  // ── BODY OF WORK (2022–2023) ──────────────────────────────────────────────
  {
    id: "body-of-work-intro-001",
    albumId: "body-of-work", trackId: null, type: "intro", weight: 10,
    lines: [
      "Body of Work is fifteen songs from across Carsie's catalog,",
      "stripped down and re-recorded in close quarters."
    ]
  },
  {
    id: "body-of-work-intro-002",
    albumId: "body-of-work", trackId: null, type: "intro", weight: 10,
    lines: [
      "The songs were released one per month from April 2022 through early 2023.",
      "The full CD and vinyl arrived in late spring 2023."
    ]
  },
  {
    id: "body-of-work-fishin-001",
    albumId: "body-of-work", trackId: "Fishin' With You", type: "track", weight: 9,
    lines: [
      "\"Fishin' With You\" is her tribute to John Prine.",
      "The video has passed 227K views on her channel."
    ]
  },

  // ── AFTER THE REVOLUTION (2024) ───────────────────────────────────────────
  {
    id: "after-the-revolution-intro-001",
    albumId: "after-the-revolution", trackId: null, type: "intro", weight: 10,
    lines: [
      "After the Revolution was released March 21, 2024.",
      "The title track came out as a single in the fall before."
    ]
  },
  {
    id: "after-the-revolution-title-001",
    albumId: "after-the-revolution", trackId: "After the Revolution", type: "track", weight: 9,
    lines: [
      "The first full recorded performance to go online",
      "was her live take at Red Rocks."
    ]
  },

  // ── SINGLES & STANDALONES ─────────────────────────────────────────────────
  {
    id: "singles-intro-001",
    albumId: "singles", trackId: null, type: "intro", weight: 10,
    lines: [
      "Between and beyond the records, Carsie has released a running line",
      "of standalone singles — protest songs, character studies, and collaborations."
    ]
  },
  {
    id: "singles-uncb-001",
    albumId: "singles", trackId: "Ugly Nasty Commie Bitch", type: "track", weight: 10,
    lines: [
      "\"Ugly Nasty Commie Bitch\" is her biggest official-channel upload,",
      "passing 304K views after its July 2024 release."
    ]
  },
  {
    id: "singles-rich-people-001",
    albumId: "singles", trackId: "Rich People", type: "track", weight: 10,
    lines: [
      "Rich People was released as a digital single on November 18, 2022.",
      "The Official Live Video version has passed 213K views."
    ]
  },
  {
    id: "singles-rich-people-002",
    albumId: "singles", trackId: "Rich People", type: "track", weight: 8,
    lines: [
      "A second \"Rich People\" cut features Natalie Portman and Zach Braff,",
      "posted to the channel in January 2023."
    ]
  },
  {
    id: "singles-little-flame-001",
    albumId: "singles", trackId: "Little Flame", type: "track", weight: 10,
    lines: [
      "Little Flame's official video was released December 8, 2025.",
      "The song caught fire in Ireland the following year."
    ]
  },
  {
    id: "singles-little-flame-002",
    albumId: "singles", trackId: "Little Flame", type: "track", weight: 8,
    lines: [
      "She filmed a performance of Little Flame on the deck of a boat",
      "with the Global Sumud Flotilla, on the way to Gaza."
    ]
  },
  {
    id: "singles-elon-001",
    albumId: "singles", trackId: "Elon Musk", type: "track", weight: 9,
    lines: [
      "The official music video for \"Elon Musk\" went up January 16, 2026,",
      "preceded by months of kitchen-clip teases."
    ]
  },
  {
    id: "singles-everything-001",
    albumId: "singles", trackId: "Everything Is Great!", type: "track", weight: 9,
    lines: [
      "\"Everything Is Great!\" is a collaboration with the band The Burning Hell,",
      "released March 22, 2026."
    ]
  },
  {
    id: "singles-eggs-001",
    albumId: "singles", trackId: "Price of Eggs", type: "track", weight: 8,
    lines: [
      "\"Price of Eggs\" followed Everything Is Great! two weeks later,",
      "the second Burning Hell collaboration of 2026."
    ]
  },

];
