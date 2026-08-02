// src/data/artists/worth-a-listen.js
// WORTH A LISTEN — an exhibit of other people's music, per Mike.
//
// SAME-ONLY-DIFFERENT, HARD. This is DATA plus one minimal extension. The
// exhibit engine (Exhibit.jsx) is untouched by this file: WAL is one more
// artist config in the shape /hr, /wb and /robots already use — a spine of
// albums, each with tracks, each track carrying videos or a `face`. Anything
// that felt like it needed a new component was rewritten until it did not.
//
// ============================================================================
// THE SPOTLIGHT DOCTRINE (Mike, W6, 2026-08-02) — governs this whole wing
// ============================================================================
// The museum is THE FRAME: it neither detracts nor distracts; done right it
// enables the art to reach full potential. THE ARTISTS BRING THE COLOR —
// their photos, videos and thumbnails ARE the color. WAL is NOT held to the
// robots wing's technical voice; it is a colorful celebration. Set the stage,
// drop the house lights, cue the music, spotlight — the only place to look.
// The B&W site law does NOT apply in this wing (W8).
//
// ---- THE TRACKLIST (Mike's category set, verbatim, W10 2026-08-02) ---------
// Every WAL artist gets the SAME tracklist shape, and the shape is the
// deliverable — a new artist is a new entry in ARTISTS below and nothing else:
//
//   Coconuts             the songs — numbered, playable, the main event
//   E. D. Yadah          everywhere else they exist: their place, shows,
//                        the better listen, their store  [INTERPRETED — flag]
//   About the Songs      the songs' museum cards, one page
//   About the Artist     the artist's museum card + the two honest questions
//   What they are up to  their own recent uploads, as a collage of their
//                        own thumbnails  [W2's poster wall]
//
// The Gift Shop row is REMOVED from the list (W10); the shop stays one press
// away in the title bar. The indented per-song card sub-rows died in favor of
// "About the Songs" (W10). The previous row names (The Artist / Their Place /
// Shows / Listen / Shop / Lately) and the seven-site naming study behind them
// are in git at 1031d1c^ — the study still stands; the categories changed.
//
// ***** INTERPRETATION FLAGS, FOR MIKE'S CONFIRMATION (not guessed silently):
//   · "Coconuts" read as THE SONGS — the sweet meat of the exhibit, per the
//     order's own hint. The header row above the numbers prints the name.
//   · "E. D. Yadah" read as THE YADDA-YADDA — the chatter row: every door out
//     to where the artist actually lives (site, shows, listen, store).
//   · "What they are up to" absorbed the old Lately feed AND the tour link —
//     what they posted and where they are playing are both "up to".
// Any of the three renames is one string here if Mike rules otherwise.
//
// ---- BELOW THE LINE: DELIBERATELY EMPTY -------------------------------------
// Mike: the artifact shelf under the fold was the /hr blocker, and we are not
// recreating it. WAL albums carry NO below-the-line artifacts at all.
//
// ---- VIDEO IDS — ALL EIGHT CONFIRMED ---------------------------------------
// Every song in this wing plays, and every id was checked against the video's
// OWN metadata (oEmbed: title + author channel) before it was written.
// RE-CONFIRMED 2026-08-02. The full transposition ledger — Mike's supplied
// six ids arrived with two artist-pairs swapped as blocks and Carsie's two
// reversed within their pair; every id was REAL and only the labels had
// drifted — is preserved in git (1031d1c) and summarized per-song below.
// Hunter Root's two came from the museum's own foundation export with
// MediaVault provenance; they needed no open-web confirmation at all.
//
// ---- COVERS & PHOTOS — THE CRAYONS ARE OUT (W8, supersedes the old W2) -----
// The typographic placeholder covers are RETIRED. Mike's W8 ruling: source
// artist imagery from their public presences NOW — album-art / logo /
// homepage-wallpaper class, best quality — with provenance logged per image
// and a permit-or-deny email to every artist BEFORE go-live. None are
// expected to object; the place looked like a card catalog until the crayons
// came out. The earlier this-file ruling ("a YouTube thumbnail is not
// free-to-use") is SUPERSEDED for two narrow, ruled cases:
//   · channel/site portraits vaulted under public/images/wal/ — logged in
//     docs/WAL_PHOTO_PROVENANCE-20260802.md, pending the permission emails;
//   · video THUMBNAILS shown by the embed and the collage (W3) — the player's
//     own poster surface for the video being pointed at, hotlinked from
//     YouTube's CDN, part of the embed's function.
// Anything outside those two classes is still a rights gamble and still out.

import { worthAListenFacts } from "./worth-a-listen-facts.js";

/* ---- the per-artist source of truth ----------------------------------------
   `songs`   : [{ title, slug, ytId, note, card }]
   `site`    : the artist's own website (never a resale/SEO domain — see the
               named traps below), or null when unconfirmed
   `shop`    : { label, url } or null — only where one was actually found
   `listen`  : a better listen than the ad-funnel, where one exists
   `tickets` : tour/tickets, where the artist's own site carries one
   `channel` : the channel VERIFIED FROM THE UPLOADS (oEmbed author_url)
   `card`    : the artist's museum card — tombstone + interpretive label
   `art`     : the coverflow cover — the artist's own public face (W8)
   `plate`   : an About-the-Artist picture, where a good one exists (W8)
   `feed`    : their own recent uploads, read from their own channel feed     */
const ARTISTS = [
  {
    id: "carsie-blanton",
    tag: "carsie_blanton",
    name: "Carsie Blanton",
    tags: ["wal", "carsie-blanton"],
    art: "/images/wal/carsie-blanton-cover.jpg",
    plate: "/images/wal/carsie-blanton-poster.png",
    plateCaption: "Her own site's poster.",
    songs: [
      /* [TRANSPOSED, AND REVERSED WITHIN THE PAIR] supplied under Jesse
         Welles, and in the other order. Filed by what the videos are. */
      { title: "Be Good", slug: "be_good", ytId: "DAFmxnJA_OQ",
        note: "Confirmed by oEmbed: BE GOOD by Carsie Blanton - OFFICIAL LYRIC VIDEO, Carsie Blanton channel.",
        card: {
          tombstone: [
            { k: "Maker", v: "Carsie Blanton" },
            { k: "Medium", v: "Official lyric video" },
            { k: "Published by", v: "Her own channel, @CarsieBlanton" },
            { k: "Also at", v: "Bandcamp, as a digital single" },
            { k: "Verified", v: "oEmbed author_url — the upload itself" },
          ],
          label: [
            "Love-your-neighbour, said straight. Jesus and Dr King are both " +
            "named in it, and neither is a metaphor for something more " +
            "comfortable.",
            "It is a lyric video rather than a performance film, which is the " +
            "right form for a song whose whole argument is in the words.",
          ],
        } },
      { title: "Shit List", slug: "shit_list", ytId: "B7i6Vys6aPI",
        note: "Second single from Love & Rage.",
        card: {
          tombstone: [
            { k: "Maker", v: "Carsie Blanton" },
            { k: "From", v: "Love & Rage, 2021" },
            { k: "Released as", v: "The album's second single" },
            { k: "Produced by", v: "Tyler Chester (the album)" },
            { k: "Source", v: "Shore Fire Media's release note" },
          ],
          label: [
            "The list is fascists. She has never been coy about it, and this " +
            "exhibit is not going to be coy about it on her behalf.",
            "Her politics are quoted from her songs and her own framing, " +
            "never characterised for her.",
          ],
        } },
    ],
    site: "https://www.carsieblanton.com",
    siteLabel: "carsieblanton.com",
    siteScent: "Her own place. Everything that matters about her lives there.",
    shop: { label: "Her own shop", url: "https://www.carsieblanton.com/shop/" },
    /* [L1] the verified channel (oEmbed author_url of her own BE GOOD lyric
       video) rather than the search-found playlist. */
    channel: "https://www.youtube.com/@CarsieBlanton",
    /* MIKE'S RULING, KEPT: her Bandcamp streams the catalogue free and
       without advertising and pays her directly, so it stays the NAMED better
       listen rather than being buried under a video. */
    listen: { label: "Bandcamp — free, no ads", url: "https://carsieblanton.bandcamp.com" },
    marker: "She writes protest songs you can dance to, and she means every word of the protest.",
    card: {
      tombstone: [
        { k: "Born", v: "22 July 1985, Luray, Virginia" },
        { k: "Based", v: "The Philadelphia area, since 2020" },
        { k: "Before that", v: "Eugene · Philadelphia · New Orleans" },
        { k: "Working since", v: "Ain't So Green, 2005" },
        { k: "Records", v: "Twelve, every one of them independent" },
        { k: "Latest", v: "Everything is Great, 2026, with The Burning Hell" },
        { k: "Honour", v: "Folk Alliance International Artist of the Year, 2026" },
      ],
      label: [
        "She was unschooled on a former cattle farm in Virginia, started " +
        "piano at six and guitar at thirteen, and by fifteen was singing " +
        "backup for a touring funk band. At sixteen she left for a group " +
        "house full of musicians in Oregon. Twenty years of touring built the " +
        "rest.",
        "In January 2026 Folk Alliance International named her Artist of the " +
        "Year, an award she tied with I'm With Her. Three months before that " +
        "she had spent a week in an Israeli prison, having joined the Global " +
        "Sumud Flotilla carrying aid to Gaza. Both facts belong on the same " +
        "card, because they are the same person.",
        "She calls the work hooks, chutzpah and revolutionary optimism, and " +
        "names Nina Simone and Woody Guthrie as the tradition she is standing " +
        "in. Everything she has made is released independently and priced " +
        "pay-what-you-want.",
      ],
      sideboxes: [
        { title: "The records, in order",
          lines: ["2005  Ain't So Green", "2009  Buoy", "2010  Beau",
                  "2012  Idiot Heart", "2014  Not Old, Not New",
                  "2016  So Ferocious", "2019  Buck Up", "2021  Love & Rage",
                  "2022  Body of Work", "2024  After the Revolution",
                  "2024  The Red Album", "2026  Everything is Great"],
          note: "Body of Work came out one song a month across 2022 and 2023." },
        { title: "Said about her",
          lines: ["“one of those hard-headed open-hearted protestors”",
                  "— NPR's Fresh Air, on Love & Rage",
                  "“delightfully surprising”",
                  "— Ken Tucker, NPR, on Buck Up"] },
        { title: "On stage",
          lines: ["Usually a trio, sometimes called the Handsome Band",
                  "Joe Plowman, bass · Patrick Firth, keyboards",
                  "Opened for The Wood Brothers from 2010",
                  "Played one of the Fates in Hadestown, 2011",
                  "Opened on Paul Simon's 2011 tour"] },
      ],
    },
    aboutNote: "Sources: her own site and press page, read directly; Wikipedia for the biography; Shore Fire Media for “Shit List”; Folk Alliance International for the 2026 award; her own upload feed for everything dated 2026. Her politics are quoted from her songs and her own framing, not characterised for her.",
    /* her own recent uploads, read 2026-08-02 from her own channel feed */
    feed: [
      { d: "2026-07-04", t: "PEACE AND FREEDOM (official video)", v: "18,242", id: "mHZWwEO1l4M" },
      { d: "2026-07-01", t: "CANADIAN FLAG (official video)", v: "1,083", id: "yho0MIK-xOE" },
      { d: "2026-06-28", t: "Fascists Are Good", v: "1,231", id: "pLDiHS1jceo" },
      { d: "2026-06-08", t: "STAFFORD BEER (official video)", v: "13,758", id: "nqBBNjkAlXM" },
      { d: "2026-05-28", t: "Hello Comrade (live at The Chapel, SF)", v: "6,117", id: "Jr-IzeSX0BA" },
      { d: "2026-04-01", t: "Price of Eggs", v: "61,645", id: "ZhCi_AssQMg" },
      { d: "2026-03-22", t: "Everything Is Great!", v: "89,528", id: "JhZkPRtc4Go" },
      { d: "2026-03-05", t: "Tango Luigi (official music video)", v: "20,064", id: "4yMIX9-4ArI" },
      { d: "2026-02-20", t: "Rich People", v: "47,968", id: "HCxjSlRcF-M" },
      { d: "2026-01-29", t: "FAI 2026 — Artist of the Year speech", v: "4,950", id: "NFTza3tVsQ8" },
      { d: "2026-01-16", t: "Elon Musk (official music video)", v: "40,832", id: "jDf1ksSbSd4" },
    ],
  },
  {
    /* ===== [W5 2026-07-30 ruling, W9 2026-08-02 amendment] ==============
       HUNTER ROOT IS A WAL ARTIST, SERVED FROM OUR OWN VAULT — and that is
       the whole statement now. [W9] The "reference wing" button and every
       /hr pointer are REMOVED from this wing: the HR museum concept was
       never approved (no response) and is history. Nothing in WAL points at
       /hr; his songs and facts come from the museum's own catalogue, which
       needed no open-web guessing at all. His LINK door goes where every
       other artist's does — his own site. */
    id: "hunter-root",
    tag: "hunter_root",
    name: "Hunter Root",
    tags: ["wal", "hunter-root", "house"],
    art: "/images/wal/hunter-root-cover.jpg",
    songs: [
      { title: "’94", slug: "94", ytId: "vPW49GU38Ng",
        note: "Official music video. Museum catalogue MV-20260523-001, " +
              "album Crooked Home.",
        card: {
          tombstone: [
            { k: "Maker", v: "Hunter Root" },
            { k: "From", v: "Crooked Home" },
            { k: "Medium", v: "Official music video" },
            { k: "Accession", v: "MV-20260523-001" },
            { k: "Sleeve", v: "A childhood photo of Hunter and his brother Nick" },
            { k: "Also", v: "There is a Back in 94' tee in his own store" },
          ],
          label: [
            "Half of Crooked Home is about his brother Nick, who was gone at " +
            "twenty-seven. This is the one Hunter points at when asked which " +
            "song the record is really about.",
            "In his own words, from this museum's vault: “almost the album " +
            "title. It's the heart of it all.”",
          ],
        } },
      { title: "Nothin' Wrong", slug: "nothin_wrong", ytId: "Wv0_mujJUQU",
        note: "Official music video. Museum catalogue MV-20260523-040, album " +
              "Skipping Stones That Sink Before They're Thrown. Mike wrote " +
              "“Nothing Wrong”; the catalogue title is “Nothin' Wrong”.",
        card: {
          tombstone: [
            { k: "Maker", v: "Hunter Root" },
            { k: "From", v: "Skipping Stones That Sink Before They're Thrown" },
            { k: "Medium", v: "Official music video" },
            { k: "Accession", v: "MV-20260523-040" },
            { k: "Note", v: "Filed as “Nothin' Wrong”; supplied as “Nothing Wrong”" },
          ],
          label: [
            "One of two Hunter Root songs surfaced in this wing, out of " +
            "seventy-eight on file. He is the only artist here whose media " +
            "needed no open-web guessing at all: the museum is the source.",
            "The title discrepancy is flagged rather than fixed in silence. " +
            "The catalogue says “Nothin'”, and the catalogue is the record.",
          ],
        } },
    ],
    /* [W9] his door out is his own site, same as everyone else's. His store
       lives at the same address, so ONE row carries both scents rather than
       two rows to one place. */
    site: "https://www.hunterroot.com/",
    siteLabel: "hunterroot.com",
    siteScent: "His own place. Merch, tour, tunes, bio.",
    shop: null,
    marker: "Half of Crooked Home is about his brother Nick. He says ’94 is the heart of it all.",
    card: {
      tombstone: [
        { k: "Catalogue", v: "78 songs on file in the museum's own vault" },
        { k: "Albums", v: "Nine" },
        { k: "Surfaced here", v: "Two" },
        { k: "His own site", v: "hunterroot.com — Merch, Tour, Tunes, Bio, Contact" },
        { k: "On record", v: "Crooked Home, Arkansas, Chase The Dragon" },
      ],
      label: [
        "He is the house artist, and the reason this building works: his " +
        "catalogue taught the museum's machinery every pattern the other " +
        "wings inherited — the coverflow, the tracklist grammar, the player " +
        "frame, the fact vault.",
        "His entry here is exactly the same shape as everyone else's, which " +
        "is the point. The difference is that his card can draw on a hundred " +
        "and nineteen facts from our own vault rather than from the open web.",
      ],
      sideboxes: [
        { title: "In his own store",
          lines: ["Crooked Home — vinyl, special vinyl, CD, bundle",
                  "Arkansas — vinyl LP",
                  "Chase The Dragon — 7-inch",
                  "Back in 94' — tee",
                  "Hat"],
          note: "Read off his own store, 2026." },
        { title: "Lately, in his own words",
          lines: ["“C❄caine C❄caine” — out 19 June 2026",
                  "“I Tried” — recorded live in studio, out 7 August 2026",
                  "A song off a Mark Twain line, July 2026",
                  "On tour through July 2026"] },
      ],
    },
    aboutNote: "Sourced from the museum's own foundation export and his own words in it - he is our artist and this is our record of him. The store and the recent uploads were read directly off his own site and his own channel feed, 2026-08-02.",
    feed: [
      { d: "2026-07-29", t: "Lonesome had an only child", v: "8,385", id: "8J-cunYqb7w" },
      { d: "2026-07-23", t: "“I Tried” — live in studio, guitar and vocals", v: "5,604", id: "yez2aoLYVnw" },
      { d: "2026-07-21", t: "“I Tried” out 8/7", v: "5,374", id: "WqD3Jc7_W1k" },
      { d: "2026-07-02", t: "The More I Learn About People (off a Mark Twain line)", v: "9,653", id: "zwXHQMsmzQU" },
      { d: "2026-06-30", t: "On tour the next couple of weeks", v: "18,774", id: "I_plZ1Lbvrw" },
      { d: "2026-06-19", t: "Cocaine Cocaine (official audio)", v: "23,775", id: "LMTNt6oRnME" },
      { d: "2026-06-23", t: "By the time that I recover", v: "5,853", id: "ANoeP1AneQY" },
      { d: "2026-06-02", t: "#singersongwriter #folk #folkrock", v: "11,319", id: "EWaAT07bcvc" },
    ],
  },
  {
    id: "jesse-welles",
    tag: "jesse_welles",
    name: "Jesse Welles",
    tags: ["wal", "jesse-welles"],
    art: "/images/wal/jesse-welles-cover.jpg",
    plate: "/images/wal/jesse-welles-plate.jpg",
    plateCaption: "From his own site.",
    songs: [
      /* [TRANSPOSED] Mike supplied this id under Carsie Blanton; the
         video's own title and channel say Jesse Welles. Filed by what it is. */
      { title: "That Can't Be Right", slug: "that_cant_be_right", ytId: "cqfJnUgvso0",
        note: "Confirmed by oEmbed: That Can't Be Right, Jesse Welles channel.",
        card: {
          tombstone: [
            { k: "Maker", v: "Jesse Welles" },
            { k: "Published by", v: "His own channel, @hellswelles" },
            { k: "Supplied as", v: "Carsie Blanton's — and it is not" },
            { k: "Verified", v: "oEmbed author_url — the upload itself" },
          ],
          label: [
            "This id was found in the very first research pass, flagged as a " +
            "candidate for this exact song, and REFUSED for want of proof. " +
            "When oEmbed finally answered, the caution turned out to have " +
            "been right twice: right to refuse an unproven id, and right " +
            "about which song it was.",
            "It is filed here because the video says so, not because a list " +
            "did.",
          ],
        } },
      /* [TRANSPOSED] supplied under Carsie Blanton. */
      { title: "There's A Hole", slug: "theres_a_hole", ytId: "s9FBnLxcqqw",
        note: "Confirmed by oEmbed: There's A Hole, Jesse Welles channel.",
        card: {
          tombstone: [
            { k: "Maker", v: "Jesse Welles" },
            { k: "Published", v: "24 July 2026" },
            { k: "Reach", v: "205,991 views as of 2 August 2026" },
            { k: "Published by", v: "His own channel, @hellswelles" },
            { k: "Supplied as", v: "Carsie Blanton's — and it is not" },
          ],
          label: [
            "Over two hundred thousand views in nine days, which is what his " +
            "habit looks like from the outside: a song about this week, " +
            "posted this week, gone everywhere by the next one.",
            "The count is a snapshot and carries its date, because a number " +
            "without a date is a claim that rots.",
          ],
        } },
    ],
    /* VERIFIED 2026-08-02 by reading the site itself: wellesmusic.com is the
       official home (Welcome / Tour / Contact / Connect, and a SHOP that
       resolves to jessewelles.redstarmerch.com).
       NAMED TRAP: jessewelles.org and jessewellestour.com rank high and are
       NOT official - ticket-resale and SEO pages. Recorded so the next person
       does not "fix" this link to a worse one. */
    site: "https://www.wellesmusic.com",
    siteLabel: "wellesmusic.com",
    siteScent: "His own place. Tour, contact, the lot.",
    shop: { label: "The store", url: "https://jessewelles.redstarmerch.com/" },
    tickets: { label: "Tour & tickets", url: "https://www.wellesmusic.com/tour" },
    /* [L1 2026-08-02] CORRECTED, THEN CLOSED. This carried a /channel/UCmb7...
       URL taken from a SEARCH RESULT, and the handle @hellswelles replaced it
       because an unconfirmed equivalence is not a fact.
       THE EQUIVALENCE IS NOW CONFIRMED: @hellswelles' own channel page returns
       externalId UCmb7zAvq9IxHi_UnP93AVSQ — the very id that was held as
       UNVERIFIED. The ledger row moves UNVERIFIED -> OFFICIAL. */
    channel: "https://www.youtube.com/@hellswelles",
    marker: "He writes the news. A man with a guitar in a field, posting songs about this week, most weeks.",
    card: {
      tombstone: [
        { k: "Full name", v: "Jesse Allen Breckenridge Wells" },
        { k: "Born", v: "22 November 1992, Ozark, Arkansas" },
        { k: "Also known as", v: "Welles · Jeh Sea Wells · Breck Shipley" },
        { k: "Label", v: "300 Entertainment" },
        { k: "Bands", v: "Dead Indian, 2012 · Cosmic-American, 2015" },
        { k: "Honour", v: "Spirit of Americana / Free Speech Award, 2025" },
        { k: "Grammys", v: "Four nominations at the 68th, 2026" },
      ],
      label: [
        "He started playing guitar at eleven and sold his songs on burned CDs " +
        "as a teenager. In 2016 he was living in an abandoned building turned " +
        "art commune outside Fayetteville. In 2015 he had moved to Nashville " +
        "to record with Dave Cobb; his debut as Welles, Red Trees and White " +
        "Trashes, came out in June 2018.",
        "The thing he is now known for started in 2024, after his father had " +
        "a heart attack: topical folk songs, written fast and posted often. " +
        "Farm Aid followed that September, with Dave Matthews introducing " +
        "him. Then Kimmel, then Colbert, then the Americana free-speech " +
        "award, then four Grammy nominations.",
        "He names The Beatles, Dylan and Nirvana — and, just as readily, " +
        "Whitman, Melville, Cormac McCarthy and Mark Twain. It is Jesse " +
        "Welles, not Jess.",
      ],
      sideboxes: [
        { title: "Four albums in one year",
          lines: ["2024  Hells Welles · Patchwork",
                  "2025  Middle · Pilgrim · Devil's Den · With the Devil",
                  "2026  Masks Off",
                  "and the Under the Powerlines records, dated by the",
                  "months they cover"],
          note: "Eight more exist as Jeh Sea Wells, between 2012 and 2018." },
        { title: "On the charts",
          lines: ["“Horses” — US AAA no. 2, 2025",
                  "“Wheel” — US AAA no. 7, 2025",
                  "“Won't You Come Out Tonight” — US AAA no. 11, 2026"] },
        { title: "Two links that are not his",
          lines: ["jessewelles.org", "jessewellestour.com"],
          note: "Both rank high. Both are ticket-resale and SEO pages. Named here so nobody 'fixes' his link to a worse one." },
      ],
    },
    aboutNote: "Sources: wellesmusic.com read directly; Wikipedia for the biography, discography, charts and awards; Rolling Stone and Vulture for the reception; Farm Aid coverage for the Dave Matthews introduction; his own upload feed for everything dated 2026.",
    feed: [
      { d: "2026-07-28", t: "Whistle Boeing / Come As You Are", v: "28,367", id: "S2hTmmwELGA" },
      { d: "2026-07-24", t: "There's A Hole", v: "205,991", id: "s9FBnLxcqqw" },
      { d: "2026-07-07", t: "I Carry You With Me", v: "87,148", id: "1BgOAXkf83o" },
      { d: "2026-07-06", t: "I Ain't Going To Hell", v: "263,311", id: "_ozPuATFedc" },
      { d: "2026-07-04", t: "American Dreams", v: "113,749", id: "dxycLGfYRQs" },
      { d: "2026-07-02", t: "AIPAC N ROLL", v: "64,990", id: "N-8BE655f7I" },
      { d: "2026-06-29", t: "Take Me Home, Country Roads", v: "164,445", id: "lTRWy9-Df3U" },
      { d: "2026-06-20", t: "El Paso", v: "34,480", id: "VUmRTlZpc6I" },
      { d: "2026-06-19", t: "Live at Bonnaroo Campground", v: "37,142", id: "sKyDcB_LZ6U" },
      { d: "2026-06-18", t: "Everyone Who Hated Me Is Dead", v: "184,286", id: "9F5UtLapNJ0" },
      { d: "2026-06-17", t: "The Ballad of Big Balls", v: "52,252", id: "s9CXlGyueV8" },
    ],
  },
  {
    id: "mikey-mike",
    tag: "mikey_mike",
    name: "Mikey Mike",
    tags: ["wal", "mikey-mike"],
    art: "/images/wal/mikey-mike-cover.jpg",
    songs: [
      { title: "Doin' Me", slug: "doin_me", ytId: "7rWDzLUOreo",
        note: "Mike wrote this as “I'm Doin' Me”. The record appears " +
              "to be “Doin' Me” (2017), made with Rick Rubin and " +
              "widely heard from a Canon advert sync. Title flagged, not " +
              "corrected in silence — [PAPA] confirms.",
        card: {
          tombstone: [
            { k: "Maker", v: "Mikey Mike" },
            { k: "Released", v: "2017 — his debut single" },
            { k: "Produced by", v: "Rick Rubin" },
            { k: "Heard in", v: "Canon, “Live for the Story: Boundaries”" },
            { k: "Advert by", v: "Megaforce, the filmmaking collective" },
            { k: "Note", v: "Supplied as “I'm Doin' Me”; the record is “Doin' Me”" },
          ],
          label: [
            "You have almost certainly heard this without knowing whose it " +
            "was. It reached most people through a Canon advert in 2017, " +
            "which is a strange way to meet a debut single and a very " +
            "effective one.",
            "The campaign that launched it was stranger still: a fake mug " +
            "shot of him went up on billboards around Los Angeles. He counts " +
            "the first of those, on Hollywood Boulevard, as the moment it " +
            "turned. Rubin's production on the record was described at the " +
            "time as “pleasingly minimal”.",
          ],
        } },
      { title: "Cooler", slug: "cooler", ytId: "KMo-TKhW5VY",
        note: "Confirmed by oEmbed: Mikey Mike - Cooler [Official Lyric Video], Mikey Mike channel.",
        card: {
          tombstone: [
            { k: "Maker", v: "Mikey Mike" },
            { k: "Medium", v: "Official lyric video" },
            { k: "Published by", v: "His own channel, @findmikeymike" },
            { k: "Live", v: "He was playing it on the 2019 European run" },
            { k: "Verified", v: "oEmbed author_url — the upload itself" },
          ],
          label: [
            "One of two of his in this room, both verified from his own " +
            "uploads rather than from a search — which mattered more for him " +
            "than for anyone else here, because several unrelated acts share " +
            "the name.",
            "He was playing it live in Europe in September 2019, on the run " +
            "that sold out The Waiting Room in London in about five days.",
          ],
        } },
    ],
    /* [L1 2026-08-02] HE HAS A VERIFIED HOME NOW, from an unfakeable
       direction: oEmbed returns the UPLOADING channel for a video, and the
       uploader of "Mikey Mike - Doin' Me (Official Video)" is
       @findmikeymike. That is the channel verified BY THE UPLOAD rather than
       by a search ranking. */
    site: "https://www.youtube.com/@findmikeymike",
    siteLabel: "his channel",
    siteScent: "The only surface confirmed to be his. Verified from the upload itself.",
    /* ***** [R-a 2026-08-02] THE LEAD WAS RIGHT AND THE LINK IS STILL REFUSED.
       findmikeymike.com resolves, and it IS his (98 mentions of his name, his
       Spotify, his socials, a MERCH and TOUR nav).
       IT IS ALSO COMPROMISED. The page body is stuffed with an injected SEO
       link farm — Indonesian gambling domains (putarslot88, vipwin88,
       indo7poker, pedetogel) and two dozen unrelated restaurant and
       veterinary sites. Read directly, 2026-08-02.
       So the door stays shut, for a reason that has nothing to do with
       identity, and the reason is written down so that a future pass does not
       "close the gap" by adding it. ***** */
    siteNote: "He does own findmikeymike.com, and it is currently serving " +
              "injected spam — so it is named in the ledger and linked nowhere.",
    shop: null,
    marker: "You have almost certainly heard him without knowing it - and he made the record with Rick Rubin.",
    card: {
      tombstone: [
        { k: "From", v: "Salisbury, Maryland" },
        { k: "Based", v: "Los Angeles" },
        { k: "Known for", v: "“Doin' Me”, 2017 — produced by Rick Rubin" },
        { k: "Also", v: "Co-produced on Rihanna's Unapologetic" },
        { k: "Publishing", v: "Universal, for several years" },
        { k: "Albums", v: "Life on Earth Vol. 1, 2019 · Vol. 2, 2022" },
        { k: "Filed under", v: "Alternative" },
      ],
      label: [
        "He was the thinnest entry in this wing when it opened, and the honest " +
        "reason was that nothing about him could be verified. That has " +
        "changed, and this card is what changed.",
        "He co-produced on Rihanna's Unapologetic — an album that also " +
        "carried David Guetta and Stargate — and was signed to Universal's " +
        "publishing arm for years while, in one contemporary account's " +
        "words, remaining relatively unknown. Then a fake mug shot of him " +
        "went up on billboards around Los Angeles, Rick Rubin produced his " +
        "debut single, Canon put it in an advert, and a lot of people heard " +
        "a song without learning a name.",
        "He remembers watching his uncles play guitar as a boy: “I knew I had " +
        "to be a part of it.” He is not a large artist by the numbers, and " +
        "that is not the standard this room uses.",
      ],
      sideboxes: [
        { title: "The record so far",
          lines: ["2014  a track on an Ibiza club compilation",
                  "2017  Doin' Me · Mikey Likes It · Going Charlie",
                  "2018  Life On Earth EP",
                  "2019  Life on Earth Vol. 1 · Amazon Prime",
                  "2020  Little Lisa",
                  "2022  Life on Earth Vol. 2",
                  "2023  What Makes You Happy? (feat. Little Lisa)",
                  "2024  four singles",
                  "2025  Genesis · MDFLAC",
                  "2026  We Might Kill Each Other"] },
        { title: "Little Lisa",
          lines: ["His elderly Vietnamese neighbour.",
                  "He calls her his adopted grandmother.",
                  "She has a song named after her, in 2020 —",
                  "and a feature credit on one in 2023."] },
        { title: "September 2019",
          lines: ["Germany, then Sweden, then London",
                  "The Waiting Room, on the 20th",
                  "Sold out in about five days",
                  "He played “Amazon Prime” before it was released"] },
      ],
    },
    aboutNote: "Sources: Faded Glamour's 2017 piece on “Doin' Me” (the Canon sync, the Rick Rubin involvement, the Rihanna and Universal credits); Apple Music and Deezer for the discography and the Salisbury origin; a 2020 Titusville interview for the 2019 European run. His own domain is deliberately not linked — see the ledger.",
    feed: [
      { d: "2026-06-09", t: "We Might Kill Each Other (official video)", v: "1,155", id: "mt1ko1y0AhU" },
      { d: "2026-06-03", t: "A project with my buddy — more MM coming", v: "563", id: "t4V1Ddpguqg" },
      { d: "2025-05-21", t: "my depression f**** like a champ", v: "8,237", id: "dZJ9-3OG7T8" },
      { d: "2025-05-15", t: "My depression f**** like a champ", v: "1,731", id: "28UFJvlcY40" },
      { d: "2025-05-06", t: "I officially signed with BILL and Big Titty Records", v: "736", id: "tNJD928Na5c" },
      { d: "2025-05-05", t: "Rick Rubin told me something I'll never forget", v: "880", id: "WsXUv-ri9fk" },
      { d: "2025-03-28", t: "Genesis (official audio)", v: "3,982", id: "bQlqEJyhyO8" },
    ],
  },
];

/* ---- the template, applied -------------------------------------------------
   Every builder returns a track or null; nulls are filtered at the spine, so
   "only where they exist" needs no conditional at the call site.
   [W10] The `kind` chips died with the old row names: the categories are
   honest nouns now and a mono label repeating them was noise. */

/* [W10] the section header over the numbered songs. It is DATA - a track with
   `header: true` renders as an inert section label and consumes no number -
   so a wing that declares none renders none and /hr, /wb and /robots are
   byte-identical. */
function coconutsHeader(a) {
  return { id: a.id + "-h-coconuts", title: "Coconuts", header: true,
           tags: [...a.tags], videos: [] };
}

function songTrack(a, s) {
  return {
    id: a.id + "-song-" + s.slug,
    title: s.title,
    song: s.slug,                       /* the fact vault's first-meet tier */
    tags: [...a.tags, "song"],
    videos: s.ytId ? [{ ytId: s.ytId, label: s.title, type: "official" }] : [],
  };
}

/* [W10] E. D. YADAH — the yadda-yadda: every door out to where the artist
   actually lives. Absorbs the old Their Place / Shows / Listen / Shop rows;
   each door appears only where the thing exists, which has always been the
   template's law. [INTERPRETATION FLAGGED for Mike in the face's PAPA slot.] */
function yadahTrack(a) {
  const trail = [];
  if (a.site) trail.push({ label: a.siteLabel || a.site, url: a.site,
    scent: a.siteScent || "The artist's own place." });
  if (a.tickets) trail.push({ label: a.tickets.label, url: a.tickets.url,
    scent: "Where to stand in the same room as it — the one thing an exhibit cannot give you." });
  if (a.listen) trail.push({ label: a.listen.label, url: a.listen.url,
    scent: "Where to hear it without paying an advertiser for the privilege." });
  if (a.shop) trail.push({ label: a.shop.label, url: a.shop.url,
    scent: "Their own store." });
  if (a.channel && a.channel !== a.site) trail.push({ label: "Their channel", url: a.channel,
    scent: "Where the songs land first, verified from their own uploads." });
  if (!trail.length) return null;
  return {
    id: a.id + "-yadah",
    unnumbered: true,      /* a category, not a track — consumes no number */
    title: "E. D. Yadah",
    tags: [...a.tags, "links"],
    videos: [],
    face: {
      kind: "text",
      title: "E. D. YADAH",
      subtitle: a.name.toUpperCase(),
      blurb: "The yadda-yadda: everywhere else they exist. Every door here " +
             "is theirs and leaves the building.",
      lines: a.siteNote ? ["NOTE     " + a.siteNote] : undefined,
      trail,
      footer: "WORTH A LISTEN · " + a.name,
      papa: "[PAPA / INTERPRETATION FLAG] “E. D. Yadah” read as the " +
            "chatter row — the doors out. Mike confirms or renames; the fix " +
            "is one string.",
    },
  };
}

/* [W10] ABOUT THE SONGS — the per-song museum cards, merged onto one page.
   The interpretive labels run as entries (stamped with the track numbers);
   the factual registers ride as sideboxes, one per song. This is what
   replaced the indented sub-rows, per Mike's order. */
function aboutSongsTrack(a) {
  const withCards = a.songs.filter(s => s.card);
  if (!withCards.length) return null;
  return {
    id: a.id + "-about-songs",
    unnumbered: true,      /* a category, not a track — consumes no number */
    title: "About the Songs",
    tags: [...a.tags, "card"],
    videos: [],
    face: {
      kind: "text",
      title: "ABOUT THE SONGS",
      subtitle: a.name.toUpperCase(),
      entries: withCards.map((s, i) => ({
        stamp: String(i + 1).padStart(2, "0"),
        title: s.title,
        line: s.card.label.join(" "),
      })),
      entriesMode: "list",
      sideboxes: withCards.map(s => ({
        title: s.title + " — the record",
        lines: s.card.tombstone.map(r => r.k.toUpperCase() + "   " + r.v),
      })),
      footer: "WORTH A LISTEN · " + a.name,
      papa: "[PAPA] — the words for the songs' cards.",
    },
  };
}

/* ABOUT THE ARTIST — the museum card: tombstone (the factual register),
   interpretive label (what they are doing here), sideboxes, and the TWO
   honest questions. [W5] The where-does-the-money-go block is DEAD in this
   room — it was the wrong stage for it; it lives in W.B's own FAQ at /booth.
   [W8] The plate is the artist's own public imagery, in color. */
function aboutArtistTrack(a) {
  return {
    id: a.id + "-about-artist",
    unnumbered: true,      /* a category, not a track — consumes no number */
    title: "About the Artist",
    tags: [...a.tags, "about", "faq"],
    videos: [],
    face: {
      kind: "text",
      title: "ABOUT THE ARTIST",
      subtitle: a.name.toUpperCase(),
      /* [TRAIL-MARKER LAW] the blurb is the ONE thing about this artist worth
         carrying out of the building - not a summary of them. */
      blurb: a.marker,
      still: a.plate || undefined,
      stillCaption: a.plate ? a.plateCaption : undefined,
      tombstone: a.card.tombstone,
      label: a.card.label,
      sideboxes: a.card.sideboxes,
      entries: [
        { stamp: "Q", title: "Why is this artist in the museum?",
          line: "Because someone here thinks they are worth a listen. That is " +
                "the whole editorial standard and it is not pretending to be " +
                "anything grander.",
          note: "[PAPA]" },
        { stamp: "Q", title: "Is Weird.Baby affiliated with them?",
          line: "No. Nothing here is endorsed by the artist, nothing here is " +
                "sold on their behalf, and every link goes to their own place.",
          note: "" },
      ],
      entriesMode: "list",
      footer: "WORTH A LISTEN · " + a.name,
      /* PROVENANCE ON THE PAGE, not just in a comment a developer reads. */
      papa: (a.aboutNote ? a.aboutNote + "  " : "") +
            "[PAPA] — the card copy and the two answers.",
    },
  };
}

/* [W10/W2] WHAT THEY ARE UP TO — the artist's own recent uploads as a WALL OF
   THEIR OWN PICTURES: each tile is the video's own thumbnail (the embed's
   poster surface, per Mike's W3 ruling), glued up at a tilt like a poster
   wall, and each one opens the video. Users click pretty pictures; they do
   not read words to guess at quality (W2). The tour door rides here too -
   where they are playing is the other half of "up to".
   IT IS BAKED, NOT FETCHED: the snapshot date is on the face, because a dated
   snapshot is honest and an undated live number is not. */
function upToTrack(a) {
  if (!Array.isArray(a.feed) || !a.feed.length) return null;
  return {
    id: a.id + "-up-to",
    unnumbered: true,      /* a category, not a track — consumes no number */
    title: "What they are up to",
    tags: [...a.tags, "feed"],
    videos: [],
    face: {
      kind: "text",
      title: "WHAT THEY ARE UP TO",
      subtitle: a.name.toUpperCase(),
      collage: a.feed.map(f => ({
        img: "https://i.ytimg.com/vi/" + f.id + "/hqdefault.jpg",
        href: "https://www.youtube.com/watch?v=" + f.id,
        label: f.t,
        date: f.d,
      })),
      trail: a.tickets
        ? [{ label: a.tickets.label, url: a.tickets.url,
             scent: "They play constantly. This is where it is real." }]
        : undefined,
      tombstone: [
        { k: "Source", v: "Their own channel feed, read 2 August 2026" },
        { k: "Showing", v: a.feed.length + " of the most recent" },
      ],
      footer: "WORTH A LISTEN · " + a.name,
      papa: "[PAPA / INTERPRETATION FLAG] “What they are up to” absorbed " +
            "the old Lately feed and the tour door. Mike confirms.",
    },
  };
}

/* the tracklist, in Mike's ruled order (W10). */
function tracksFor(a) {
  const out = [coconutsHeader(a)];
  a.songs.forEach(s => out.push(songTrack(a, s)));
  out.push(yadahTrack(a));
  out.push(aboutSongsTrack(a));
  out.push(aboutArtistTrack(a));
  out.push(upToTrack(a));
  return out.filter(Boolean);
}

const spine = ARTISTS.map(a => ({
  id: a.id,
  title: a.name,
  /* the fact vault's ALBUM tier. In this wing an album IS an artist, so
     `tag` is the artist slug and the climb's middle rung becomes "a fact
     about this artist". */
  tag: a.tag,
  year: null,
  tags: a.tags,
  /* [W8] the artist's own public face, vaulted with provenance — see
     docs/WAL_PHOTO_PROVENANCE-20260802.md. In color; the B&W law does not
     apply to WAL. */
  art: a.art,
  accent: null,
  viewerPoster: null,
  tracks: tracksFor(a),
}));

export const worthAListenArtists = ARTISTS;

export const worthAListenExhibit = {
  id: "wal",
  name: "Worth A Listen",
  exhibitSlug: "wal",
  eraAlias: {},
  spine,
  /* [R-c 2026-08-02] 321 sourced facts, in the museum's own fact shape,
     consumed by the shipped selector with no new selection code. */
  facts: worthAListenFacts,
  defaultActiveIndex: 0,
  splitKey: "wb-wal-split",
  splitDefault: 26,
  cfKey: "wb-wal-cfh",
  visitPath: "/wal",
  shopExitParam: "wal",
  shopEntryHidden: false,
  /* [W7 2026-08-02] THE CARDS GO FLAT. `stage: true` (the paginated fixed
     frame) and `bodyKey` (the fixed body height) are RETIRED for this wing:
     every face renders at full length in the page's own flow, with no
     internal scrolling anywhere. The Stage's no-scroll LAW is kept in the
     only honest reading — no inner scroll traps; the document is the one
     thing that scrolls, which is ordinary reading. The robots wing keeps its
     staged frame; the composition choice is per-wing config, as ever. */
  faceFlow: "flat",
  /* [W3 2026-08-02] the cued song's poster is the VIDEO'S own thumbnail, not
     the house cover — the artists' imagery carries the page. */
  thumbFromVideo: true,
  /* [M-e 2026-08-02] the transport stows into the artist-name bar, and the
     fixed 68px player bar stands down with it. */
  transport: "banner",
};
