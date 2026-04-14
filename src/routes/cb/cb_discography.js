// ─── WEIRD.BABY DISCOGRAPHY SPINE — Carsie Blanton ──────────────────────────
// Schema mirrors src/routes/hr/HrSpine.jsx SPINE[]:
//   id       unique kebab-case slug
//   title    display title
//   year     release year (numeric)
//   art      Bandcamp cover image URL (null if not yet fetched)
//   accent   hex accent color for the exhibit
//   tracks[] ordered [{ title, videos:[{ ytId, label, type, credit? }] }]
//
// ytIds are sourced ONLY from yt_research/channel_videos.json (official channel).
// Where no official-channel video exists for a track, videos:[] is left empty.
// Third-party / fan uploads from yt_research/fan_yt.json are NOT included here —
// those belong in a separate contributions layer per VISION.md.
//
// Album art URLs are currently null — Bandcamp network egress is blocked in this
// session. See BACKLOG below.
//
// ─── BACKLOG ────────────────────────────────────────────────────────────────
//   - Fetch Bandcamp cover-art IDs for every album (art: null placeholders)
//   - Confirm accent palette per album (current values are provisional)
//   - "Rude Remarks and Dirty Jokes" (2013) EP — only 2 of 3 tracks confirmed
//   - "Ain't So Green" (2005) — 12-track listing sourced from search summary;
//     confirm against Discogs / Bandcamp before publishing
//   - "Body of Work" (2022–23) is a re-recording compilation drawn from across
//     the catalog. Decide whether it belongs on the chronological spine as a
//     discrete entry (current approach) or as a meta-lens over earlier albums.
//   - "When Somebody's Gone" and "In The Middle Of It" on Body of Work —
//     confirm whether these are new songs or re-titled earlier cuts
//   - Confirm "Down in the Streets" 2023 status (per STATE.md OPEN QUESTION):
//     currently treated as a Love & Rage album track (2021), not a separate 2023 release
//   - "Dealin' with the Devil" (2021 excerpt, 8GdwVllV1_o) — song placement unknown
//   - Several Burning Hell collaborations (2026) may become an EP/album —
//     currently grouped under Singles & Standalones
// ─────────────────────────────────────────────────────────────────────────────

export const SPINE = [

  // ── AIN'T SO GREEN (2005) ─────────────────────────────────────────────────
  // Debut studio album, recorded in Virginia.
  // BACKLOG: tracklist sourced from web summary — verify against Discogs/Bandcamp.
  {
    id: "aint-so-green", title: "Ain't So Green", year: 2005,
    art: null, accent: "#7a8a4a",
    tracks: [
      { title: "Promise", videos: [] },
      { title: "Anything at All", videos: [] },
      { title: "Ain't So Green", videos: [] },
      { title: "Don't Wanna Know", videos: [] },
      { title: "Everybody's All Alone", videos: [] },
      { title: "Take Me Along", videos: [] },
      { title: "Lovesick", videos: [] },
      { title: "Temporary Lapse", videos: [] },
      { title: "Time", videos: [] },
      { title: "Wedding Song", videos: [] },
      { title: "Willing to Fall", videos: [] },
      { title: "Redemption Blues", videos: [] },
    ],
  },

  // ── BUOY (2009) ───────────────────────────────────────────────────────────
  {
    id: "buoy", title: "Buoy", year: 2009,
    art: null, accent: "#4a8aaa",
    tracks: [
      { title: "Buoy", videos: [] },
      { title: "Itches and Tugs", videos: [] },
      { title: "Please", videos: [] },
      { title: "O, Gabriela", videos: [] },
      { title: "Money in the Bank", videos: [] },
      { title: "Two at a Time", videos: [] },
      { title: "Every Punch You Throw", videos: [] },
      { title: "Baby Can Dance", videos: [] },
      { title: "Crazy for Love", videos: [] },
    ],
  },

  // ── IDIOT HEART (2012) ────────────────────────────────────────────────────
  // Produced by Oliver Wood.
  {
    id: "idiot-heart", title: "Idiot Heart", year: 2012,
    art: null, accent: "#9a4a5a",
    tracks: [
      { title: "Smoke Alarm", videos: [{ ytId: "dQQ09Lxy7dI", label: "Official Video", type: "official" }] },
      { title: "Together Too Long", videos: [] },
      { title: "Backseat", videos: [{ ytId: "klgEY0SfgN0", label: "Official Video", type: "official" }] },
      { title: "Little Death", videos: [] },
      { title: "Lonely No More", videos: [] },
      { title: "Backbone", videos: [{ ytId: "WEdIg_dOVOY", label: "Official Video", type: "official" }] },
      { title: "Idiot Heart", videos: [] },
      { title: "Chicken", videos: [] },
      { title: "All We Got", videos: [] },
      { title: "Honest Truth", videos: [] },
    ],
  },

  // ── RUDE REMARKS AND DIRTY JOKES (2013) — EP ──────────────────────────────
  // BACKLOG: 3-track EP — only 2 track titles confirmed from search.
  {
    id: "rude-remarks", title: "Rude Remarks and Dirty Jokes", year: 2013,
    art: null, accent: "#b2743a",
    tracks: [
      { title: "Under Your Thumb", videos: [] },
      { title: "Trigger Finger", videos: [] },
      // { title: null, videos: [] }, // BACKLOG: third track title unconfirmed
    ],
  },

  // ── NOT OLD, NOT NEW (2014) ───────────────────────────────────────────────
  // Jazz standards record. Produced by John Porter at Music Shed Studios, New Orleans.
  // Inspired by early-1950s pre-bebop vocal jazz.
  {
    id: "not-old-not-new", title: "Not Old, Not New", year: 2014,
    art: null, accent: "#c9a74a",
    tracks: [
      { title: "Azalea", videos: [] },
      { title: "Laziest Gal in Town", videos: [{ ytId: "PrOc-qWX71w", label: "Official Video", type: "official" }] },
      { title: "Heavenly Thing", videos: [] },
      { title: "Two Sleepy People", videos: [] },
      { title: "You Don't Know What Love Is", videos: [] },
      { title: "What Is This Thing Called Love?", videos: [] },
      { title: "Do You Know What It Means to Miss New Orleans?", videos: [] },
      { title: "Sweet Lorraine", videos: [
        { ytId: "--IJbpWEMis", label: "Live Sessions", type: "live" },
        { ytId: "ea8Vw7TVM0A", label: "Live", type: "live" },
      ]},
      { title: "Don't Come Too Soon", videos: [] },
      { title: "I'll Be Seeing You", videos: [
        { ytId: "vSU0URr8c_o", label: "Duet w/ Peter Mulvey", type: "live", credit: "Peter Mulvey" },
      ]},
      { title: "Not Old, Not New", videos: [] },
    ],
  },

  // ── SO FEROCIOUS (2016) ───────────────────────────────────────────────────
  // Released August 2, 2016.
  {
    id: "so-ferocious", title: "So Ferocious", year: 2016,
    art: null, accent: "#bc3a7a",
    tracks: [
      { title: "Hot Night", videos: [
        { ytId: "hMXcE2Naemo", label: "Official Video", type: "official" },
        { ytId: "ILdOkrCjE6w", label: "Preview feat. Bobby Bonsey", type: "clip", credit: "Bobby Bonsey" },
      ]},
      { title: "Vim & Vigor", videos: [{ ytId: "QS4y_gHQrVw", label: "Official Video", type: "official" }] },
      { title: "So Ferocious", videos: [{ ytId: "YfNdLAlrq18", label: "Official Video", type: "official" }] },
      { title: "Lovin is Easy", videos: [
        { ytId: "22k1t8aUTjU", label: "Solo Version", type: "official" },
      ]},
      { title: "Ravenous", videos: [] },
      { title: "Fat & Happy", videos: [] },
      { title: "Scoundrel", videos: [] },
      { title: "To Be Known", videos: [] },
      { title: "The Animal I Am", videos: [{ ytId: "sEBcKAX_ja4", label: "Live @ Ware Center", type: "live" }] },
      { title: "Fever Dream", videos: [] },
    ],
  },

  // ── BUCK UP (2019) ────────────────────────────────────────────────────────
  // Released February 15, 2019.
  {
    id: "buck-up", title: "Buck Up", year: 2019,
    art: null, accent: "#c0633a",
    tracks: [
      { title: "Twister", videos: [] },
      { title: "That Boy", videos: [] },
      { title: "Jacket", videos: [{ ytId: "tvIK5MwUFAw", label: "Official Video", type: "official" }] },
      { title: "American Kid", videos: [
        { ytId: "HA9uZFSFMsQ", label: "Official Video", type: "official" },
        { ytId: "zRTjMfCuewU", label: "Live (w/ All My Love)", type: "live" },
      ]},
      { title: "Bed", videos: [
        { ytId: "NX7uq_wDVc0", label: "Official Video", type: "official" },
        { ytId: "FioRnY7_q7Y", label: "Live @ Tellus360", type: "live" },
      ]},
      { title: "Harbor", videos: [] },
      { title: "Desire", videos: [{ ytId: "TC4iP1o8kLg", label: "Official Lyric Video", type: "official" }] },
      { title: "Mustache", videos: [{ ytId: "weCV9IFc9rk", label: "Live in the Kitchen", type: "live" }] },
      { title: "Battle", videos: [] },
      { title: "Buck Up", videos: [
        { ytId: "d89fe_p4gX4", label: "Official Lyric Video", type: "official" },
        { ytId: "34T6iqYtskU", label: "Live @ The Old Church (Portland)", type: "live" },
        { ytId: "nfBoIMMM_Vc", label: "Quarantine Edition", type: "live" },
      ]},
    ],
  },

  // ── LOVE & RAGE (2021) ────────────────────────────────────────────────────
  // Released April 30, 2021. Described by Irish Times as her "seventh album".
  {
    id: "love-and-rage", title: "Love & Rage", year: 2021,
    art: null, accent: "#d1342a",
    tracks: [
      { title: "Party at the End of the World", videos: [{ ytId: "sSzbHtW4x9o", label: "Official Video", type: "official" }] },
      { title: "Down in the Streets", videos: [] },
      { title: "Be Good", videos: [
        { ytId: "DAFmxnJA_OQ", label: "Official Lyric Video", type: "official" },
        { ytId: "OP2UMlTBMww", label: "Performance", type: "live" },
        { ytId: "PAVTtQIykAQ", label: "Live in the Snow (Christmas)", type: "live" },
        { ytId: "1anH2uamuaM", label: "Live @ Alberta Rose", type: "live" },
      ]},
      { title: "All My Love", videos: [] },
      { title: "Can't Wait to Break Your Heart", videos: [] },
      { title: "Shit List", videos: [{ ytId: "B7i6Vys6aPI", label: "Official Video", type: "official" }] },
      { title: "So Long New Orleans", videos: [] },
      { title: "Be So Bad", videos: [] },
      { title: "Sufferin' Fools", videos: [] },
      { title: "Ain't No Sin", videos: [] },
      { title: "Mercy", videos: [] },
    ],
  },

  // ── BODY OF WORK (2022–2023) ──────────────────────────────────────────────
  // Intimate re-recordings drawn from across the catalog.
  // Released one track per month from April 2022 through early 2023;
  // full CD / vinyl release late spring 2023.
  // BACKLOG: confirm spine placement — may belong as a meta layer rather than
  // a chronological entry, since every song here is a revisit of an earlier cut.
  {
    id: "body-of-work", title: "Body of Work", year: 2023,
    art: null, accent: "#6a4a8a",
    tracks: [
      { title: "Twister", videos: [] },
      { title: "Down In The Streets", videos: [] },
      { title: "Fishin' With You", videos: [
        { ytId: "m2-2pZFtBxo", label: "Video (John Prine tribute)", type: "official" },
      ]},
      { title: "Hot Night", videos: [] },
      { title: "Lovin' Is Easy", videos: [] },
      { title: "Smoke Alarm", videos: [] },
      { title: "When Somebody's Gone", videos: [
        { ytId: "383W5tMukPs", label: "Live Acoustic", type: "live" },
      ]},
      { title: "In The Middle Of It", videos: [] },
      { title: "Animal I Am", videos: [] },
      { title: "Wolf", videos: [] },
      { title: "Look A Fool", videos: [] },
      { title: "Good Woman", videos: [] },
      { title: "Together Too Long", videos: [] },
      { title: "Desire", videos: [] },
      { title: "Sister Says", videos: [{ ytId: "YbgGL9E4Gn8", label: "Video", type: "official" }] },
    ],
  },

  // ── AFTER THE REVOLUTION (2024) ───────────────────────────────────────────
  // Released March 21, 2024. Title track released as a single in fall 2023.
  {
    id: "after-the-revolution", title: "After the Revolution", year: 2024,
    art: null, accent: "#2a6a7a",
    tracks: [
      { title: "After the Revolution", videos: [
        { ytId: "leLZLDljqWk", label: "Live at Red Rocks", type: "live" },
        { ytId: "_ZDsDRykeX4", label: "Streaming Release", type: "official" },
      ]},
      { title: "Empire", videos: [] },
      { title: "Ain't We Got Fun", videos: [{ ytId: "SlvzpYcVczg", label: "Official Video", type: "official" }] },
      { title: "Hope", videos: [{ ytId: "itgrqn_vUuM", label: "Official Video", type: "official" }] },
      { title: "Caroline", videos: [] },
      { title: "Labour of Love", videos: [] },
      { title: "Cool Kids", videos: [{ ytId: "_bZOnh3P3Ro", label: "Official Video", type: "official" }] },
      { title: "Swimming in the Pool", videos: [] },
      { title: "Right in the Middle of It", videos: [] },
      { title: "If You Want Me To", videos: [] },
      { title: "Suddenly the Spring", videos: [] },
      { title: "My Good Friends", videos: [] },
    ],
  },

  // ── SINGLES & STANDALONES (2016 → 2026) ───────────────────────────────────
  // Non-album tracks. Chronological by YouTube release.
  // Keeps the prominent standalone singles on the spine per VISION.md
  // ("Singles and one-offs: They find their place on the line.")
  // BACKLOG: if the 2026 Burning Hell collaborations coalesce into an EP,
  //          split them out into their own spine entry.
  {
    id: "singles", title: "Singles & Standalones", year: null,
    art: null, accent: "#3a3a3a",
    tracks: [
      { title: "We're All F*%*d, Let's All F@*&.", videos: [
        { ytId: "2TWu23Wf6gk", label: "Video (2016)", type: "official" },
      ]},
      { title: "Fuck Yourself (Love Yourself)", videos: [
        { ytId: "ito--73QaOM", label: "Official Video (2018)", type: "official" },
      ]},
      { title: "Fishin' With You (John Prine Tribute)", videos: [
        { ytId: "m2-2pZFtBxo", label: "Video (2020)", type: "official" },
      ]},
      { title: "Rich People", videos: [
        { ytId: "pD_eZg70Ms0", label: "Official Live Video (2022)", type: "official" },
        { ytId: "RT1sZHjZ9Ps", label: "feat. Natalie Portman & Zach Braff", type: "official", credit: "Natalie Portman, Zach Braff" },
        { ytId: "l44-yNJxSNI", label: "feat. Your Best Comments", type: "clip" },
        { ytId: "W7PfDdC1kVg", label: "Live at Red Rocks (2024)", type: "live" },
        { ytId: "HCxjSlRcF-M", label: "Rich People (2026)", type: "official" },
      ]},
      { title: "Ugly Nasty Commie Bitch", videos: [
        { ytId: "EXFToM4UYgo", label: "Early Version (Aug 2023)", type: "clip" },
        { ytId: "g2DXvwPmaJI", label: "Clip (Sep 2023)", type: "clip" },
        { ytId: "-tfH1nty62U", label: "Official Video (July 2024)", type: "official" },
        { ytId: "pGbMArzXGVU", label: "Live in NYC 2024", type: "live" },
        { ytId: "gDr6KEXgCpI", label: "Clip (Feb 2026)", type: "clip" },
      ]},
      { title: "Election Year (The Democrats Won't Save You)", videos: [
        { ytId: "02ybaqMcB84", label: "Video (Jan 2024)", type: "official" },
      ]},
      { title: "Little Flame", videos: [
        { ytId: "BH38VSfZbnU", label: "Official Video (Dec 2025)", type: "official" },
        { ytId: "azTuRNb500k", label: "Live at Tractor Tavern", type: "live" },
        { ytId: "VeAzP9lJwkE", label: "On the way to Gaza w/ Global Sumud Flotilla", type: "clip" },
      ]},
      { title: "Elon Musk", videos: [
        { ytId: "1CwTm0ef4xE", label: "Early Clip (Apr 2025)", type: "clip" },
        { ytId: "8SJxkD40O3U", label: "Clip (Jan 2026)", type: "clip" },
        { ytId: "jDf1ksSbSd4", label: "Official Music Video (Jan 2026)", type: "official" },
      ]},
      { title: "Tango Luigi", videos: [
        { ytId: "4yMIX9-4ArI", label: "Official Music Video (Mar 2026)", type: "official" },
      ]},
      { title: "Everything Is Great!", videos: [
        { ytId: "JhZkPRtc4Go", label: "feat. The Burning Hell (Mar 2026)", type: "official", credit: "The Burning Hell" },
      ]},
      { title: "Price of Eggs", videos: [
        { ytId: "ZhCi_AssQMg", label: "feat. The Burning Hell (Apr 2026)", type: "official", credit: "The Burning Hell" },
      ]},
    ],
  },

];
