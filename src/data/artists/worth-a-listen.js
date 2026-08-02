// src/data/artists/worth-a-listen.js
// WORTH A LISTEN — an exhibit of other people's music, per Mike.
//
// SAME-ONLY-DIFFERENT, HARD. This is DATA plus one minimal extension. The
// exhibit engine (Exhibit.jsx) is untouched by this file: WAL is one more
// artist config in the shape /hr, /wb and /robots already use — a spine of
// albums, each with tracks, each track carrying videos or a `face`. Anything
// that felt like it needed a new component was rewritten until it did not.
//
// ---- THE TEMPLATE (Mike's ruling, RE-NAMED per R-a 2026-08-02) --------------
// Every WAL artist gets the SAME tracklist shape, and the shape is the
// deliverable — a new artist is a new entry in ARTISTS below and nothing else:
//
//   01..n   the songs         SONG     the video, official upload
//    ·      (the same title)  CARD     that song's museum card — a SUB-ROW
//           The Artist        CARD     the artist's museum card + the FAQ
//           Their Place       LINK     hands off to the artist's own website
//           Shows             LIVE     where they exist, and only there
//           Listen            LISTEN   where a better listen exists
//           Shop              SHOP     the house shop, that artist top-billed
//           Lately            FEED     their own recent uploads (R-b)
//
// ***** WHY THE ROWS ARE NAMED WHAT THEY ARE NAMED *****
// Seven artist sites were read on 2026-08-02 — Taylor Swift, Nick Cave, Dolly
// Parton, Radiohead, Carsie Blanton, Jesse Welles, Hunter Root. NOT ONE of them
// has a section called "About". Six of the seven have a page that does that
// job; they simply refuse to name it after the topic. They name the thing:
// Archive, Library, Store, Live, Tour, Shows, Music, Books, Lyrics, Tunes,
// My Letter, The Red Hand Files, Life & Career.
//
// So `About` became **The Artist** and `Link` became **Their Place** — the row
// now says what its own shipped copy already said ("the artist's own place").
// `Shop` was KEPT: six of seven say Shop or Store, and inventing a better word
// for the one thing the world already agrees on would be worse than useless.
// Shows and Listen were SPLIT OUT of the shop row, because where to see them
// and where to hear them are different questions and folding them hid the
// answer to the better one.
// Full study: `weird-baby-robots/docs/WAL_PHASE0-20260802.md`.
//
// ---- BELOW THE LINE: DELIBERATELY EMPTY -------------------------------------
// Mike: the artifact shelf under the fold was the /hr blocker, and we are not
// recreating it. WAL albums carry NO below-the-line artifacts at all. When an
// artist earns one it arrives as data, here, the way the robots wing did it.
//
// ---- W1: VIDEO IDS - ALL EIGHT CONFIRMED ---------------------------------
// Every song in this wing plays, and every id was checked against the video's
// OWN metadata before it was written. RE-CONFIRMED 2026-08-02: all four
// distinct channels re-queried live this session, all four still agree.
//
// HOW. YouTube renders the uploader in JavaScript, so fetching a watch page
// returns a bare footer - which is why an earlier pass could confirm nothing
// and honestly wrote nothing. The oEmbed endpoint is the way through:
//   https://www.youtube.com/oembed?url=<watch url>&format=json
// is plain JSON, needs no key and no scripting, and returns BOTH the video's
// title AND its channel. Title says which song; author_name says whose
// channel it is on. That is exactly "channel identity confirmed, not
// assumed", and it was available the whole time.
//
// ***** THE MAPPING CORRECTION - FOUR OF SIX WERE TRANSPOSED *****
// Mike supplied six ids from radio-list URLs and asked for the mapping to be
// confirmed rather than trusted. It needed confirming:
//
//   id            SUPPLIED AS                    ACTUALLY IS
//   7rWDzLUOreo   Mikey Mike / Doin' Me          correct
//   KMo-TKhW5VY   Mikey Mike / Cooler            correct
//   B7i6Vys6aPI   Welles / That Can't Be Right   Blanton / SHIT LIST
//   DAFmxnJA_OQ   Welles / There's A Hole        Blanton / BE GOOD
//   cqfJnUgvso0   Blanton / Be Good              Welles / That Can't Be Right
//   s9FBnLxcqqw   Blanton / Shit List            Welles / There's A Hole
//
// The two pairs were swapped as blocks, AND Carsie's two were reversed within
// their pair. NO ID WAS WRONG - every one is a real official video sitting on
// the right artist's own channel; only the labels had drifted in transit. So
// the ids are filed where the videos say they belong, and the transposition
// is RECORDED rather than quietly straightened: a silent fix would leave
// nobody any wiser about where the labels came from, and the next paste from
// the same source will have the same shape.
//
// Corroboration worth keeping: cqfJnUgvso0 surfaced in the FIRST research
// pass as a candidate for Welles' "That Can't Be Right" and was refused for
// want of proof. oEmbed now confirms exactly that - the caution was right to
// refuse it, and right about which song it was.
//
// HUNTER ROOT's two needed none of this: he is our artist, and both came from
// the museum's own foundation export with MediaVault provenance and a
// content_kind of "official".
//
// ---- W2: COVERS — WHY THEY ARE TYPOGRAPHIC ---------------------------------
// The brief allows official video thumbnails, artist-provided press images
// with clear licensing, or equivalent — and says to fall back to the house
// typographic cover rather than take a rights gamble.
//
//   · A YOUTUBE THUMBNAIL IS NOT FREE-TO-USE. It is a still from the artist's
//     or label's copyrighted work, served by a third party. Hotlinking one as
//     exhibit art is a rights gamble wearing a technical disguise.
//   · NO CLEAN PRESS KIT WAS FOUND. Carsie Blanton's press page was read
//     directly: it carries critic quotes and a contact address, and offers no
//     downloadable photography and no usage terms at all.
//   · SO: house typographic covers for the three outside artists, in the WBR
//     cover discipline — photo-paper ground, photo-black type, the B&W
//     site law. FLAGGED: Mike's art replaces `art` and nothing else moves.
//   · HUNTER ROOT IS THE EXCEPTION, AND HONESTLY SO. His cover comes from the
//     museum's own foundation export, which is our catalogue of our own
//     artist — the same asset the /hr wing has always drawn. No third party's
//     rights are being guessed at.
//   · [R-b 2026-08-02] THE SAME RULING KILLED THE PHOTO SLIDESHOW. Every image
//     source on offer — YT thumbnails, IG/FB embeds, og:image scraping,
//     fan-made, press galleries — is the same rights gamble at a different
//     scale. What ships instead is a VIDEO wall (`Lately`, below), because the
//     embed player is the one mechanism YouTube publishes *for this purpose*.
//
// ---- COVERS ------------------------------------------------------------------
// Typographic placeholders in the house register, generated inline as SVG data
// URIs so they ship with the config and need no asset pipeline. FLAGGED FOR
// ART: Mike's covers replace `art` with a path and nothing else changes.

import { worthAListenFacts } from "./worth-a-listen-facts.js";

/* the house cover: photo-paper ground, photo-black type, the wordmark stacked
   the way the deck's other covers letter it. One function, four covers, so
   they cannot drift apart. */
function cover(name, sub) {
  const lines = String(name).split(" ");
  const big = lines.length > 1 ? lines : [name];
  const y0 = big.length > 1 ? 250 : 300;
  const body = big
    .map((w, i) =>
      `<text x="300" y="${y0 + i * 82}" text-anchor="middle" fill="#211f1c" ` +
      `font-family="Georgia,serif" font-size="${w.length > 8 ? 58 : 72}" ` +
      `letter-spacing="3">${w}</text>`)
    .join("");
  return "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">' +
      '<rect width="600" height="600" fill="#d9d5ca"/>' +
      '<rect x="26" y="26" width="548" height="548" fill="none" stroke="#211f1c" stroke-width="2"/>' +
      body +
      '<line x1="150" y1="420" x2="450" y2="420" stroke="#211f1c" stroke-width="2"/>' +
      '<text x="300" y="462" text-anchor="middle" fill="#57544d" ' +
      'font-family="Courier New,monospace" font-size="19" letter-spacing="5">' +
      (sub || "WORTH A LISTEN") + "</text>" +
    "</svg>");
}

/* ---- the per-artist source of truth ----------------------------------------
   `songs`  : [{ title, slug, ytId, note, card }]
   `site`   : the artist's own website, or null when unconfirmed
   `shop`   : { label, url } or null — only where one was actually found
   `card`   : the artist's museum card — tombstone + interpretive label
   `feed`   : their own recent uploads, read from their own channel feed     */
const ARTISTS = [
  {
    id: "carsie-blanton",
    tag: "carsie_blanton",
    name: "Carsie Blanton",
    tags: ["wal", "carsie-blanton"],
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
    shop: { label: "Shop", url: "https://www.carsieblanton.com/shop/" },
    /* [L1] the verified channel (oEmbed author_url of her own BE GOOD lyric
       video) rather than the search-found playlist. */
    channel: "https://www.youtube.com/@CarsieBlanton",
    /* MIKE'S RULING, KEPT: her Bandcamp streams the catalogue free and
       without advertising and pays her directly, so it stays the NAMED better
       listen rather than being buried under a video. */
    listen: { label: "Bandcamp — free, no ads", url: "https://carsieblanton.bandcamp.com" },
    marker: "She writes protest songs you can dance to, and she means every word of the protest.",
    /* [C-b 2026-08-02] THE ARTIST'S MUSEUM CARD.
       Two labels, because a museum has two: the TOMBSTONE is the factual
       register and does not change when the object moves rooms; the
       INTERPRETIVE LABEL is what it is doing HERE, and does. */
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
    trail: [
      { label: "Her own shop", url: "https://www.carsieblanton.com/shop/", scent: "Where the money goes to her." },
      { label: "Bandcamp - the whole catalogue, free", url: "https://carsieblanton.bandcamp.com", scent: "No ads, no algorithm, no middle. Start anywhere." },
      { label: "Her channel", url: "https://www.youtube.com/@CarsieBlanton", scent: "Official videos, verified from her own uploads." },
    ],
    aboutNote: "Sources: her own site and press page, read directly; Wikipedia for the biography; Shore Fire Media for “Shit List”; Folk Alliance International for the 2026 award; her own upload feed for everything dated 2026. Her politics are quoted from her songs and her own framing, not characterised for her.",
    /* [R-b] her own recent uploads, read 2026-08-02 from her own channel feed */
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
    /* ===== [W5 2026-08-02, Mike's ruling — a landmark] ==================
       HUNTER ROOT IS A WAL ARTIST NOW. /hr was the most stable thing this
       museum had and it taught the machinery every pattern the other wings
       inherited; it has outlived that purpose. It RETIRES TO REFERENCE-HELD:
       nothing deleted, the route still live, unlisted in the directory per
       the unlisted law. His entry here is the same shape as everyone else's,
       which is the point of the ruling.
       HIS SONGS COME FROM OUR OWN CATALOGUE. Both ids are foundation-backed
       with MediaVault provenance and a content_kind of "official" — the
       museum is the source, so this is the one artist whose media needed no
       open-web guessing at all. */
    id: "hunter-root",
    tag: "hunter_root",
    name: "Hunter Root",
    tags: ["wal", "hunter-root", "house"],
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
    /* THE LINK QUESTION, DECIDED HONESTLY. Every other artist's LINK track
       hands off to their own website. Hunter Root's standing web presence in
       this building IS /hr - it is deeper than anything a link could reach,
       it is still live, and it is still ours. So the LINK track points there,
       and the wing stays reachable-but-unlisted rather than being hidden or
       removed. If Mike later has an off-site home for him, this one line
       changes and nothing else does. */
    site: "/hr",
    siteLabel: "The Hunter Root reference wing",
    siteNote: "Reference-held: live, complete, and unlisted in the directory. " +
              "It is the deepest thing in the museum about any artist.",
    /* [R-a 2026-08-02] HE GETS A SHOP ROW NOW, AND THE W5 RULING IS UNTOUCHED.
       W5 pointed his LINK row inward at /hr and that stands. But it was a
       ruling about the LINK row, not about the SHOP row, and the template's
       rule has always been "where they exist, and only where they exist".
       hunterroot.com was read directly this session: Crooked Home on vinyl,
       special vinyl, CD and bundle; a Chase The Dragon 7-inch; Arkansas on
       vinyl; a Back in 94' tee. It exists. */
    shop: { label: "Shop", url: "https://www.hunterroot.com/" },
    marker: "Half of Crooked Home is about his brother Nick. He says ’94 is the heart of it all.",
    card: {
      tombstone: [
        { k: "In this museum", v: "The reference wing, /hr — unlisted, still live" },
        { k: "Catalogue", v: "78 songs on file in our own vault" },
        { k: "Albums", v: "Nine" },
        { k: "Surfaced here", v: "Two" },
        { k: "His own site", v: "hunterroot.com — Merch, Tour, Tunes, Bio, Contact" },
        { k: "On record", v: "Crooked Home, Arkansas, Chase The Dragon" },
      ],
      label: [
        "He is the house artist, and the reason this building works. /hr was " +
        "the most stable thing the museum had and it taught the machinery " +
        "every pattern the other wings inherited — the coverflow, the " +
        "tracklist grammar, the player frame, the fact vault. It has outlived " +
        "that purpose and retires to reference-held: nothing deleted, the " +
        "route still live, unlisted in the directory.",
        "His entry here is exactly the same shape as everyone else's, which " +
        "is the point of the ruling. The difference is that his card can draw " +
        "on a hundred and nineteen facts from our own vault rather than from " +
        "the open web.",
      ],
      sideboxes: [
        { title: "Where the money goes",
          lines: ["Crooked Home — vinyl, special vinyl, CD, bundle",
                  "Arkansas — vinyl LP",
                  "Chase The Dragon — 7-inch",
                  "Back in 94' — tee",
                  "Hat"],
          note: "Read off his own store, 2026. The Gift Shop row lands on the house shop with him top-billed; his own store is one click on from there." },
        { title: "Lately, in his own words",
          lines: ["“C❄caine C❄caine” — out 19 June 2026",
                  "“I Tried” — recorded live in studio, out 7 August 2026",
                  "A song off a Mark Twain line, July 2026",
                  "On tour through July 2026"] },
      ],
    },
    trail: [
      { label: "The Hunter Root reference wing", url: "/hr", scent: "The deepest thing in this building about any artist. 78 songs, nine albums." },
      { label: "hunterroot.com", url: "https://www.hunterroot.com/", scent: "His own place. Merch, tour, tunes." },
    ],
    aboutNote: "Sourced from the museum's own foundation export and his own words in it - he is our artist and this is our record of him. The store and the recent uploads were read directly off his own site and his own channel feed, 2026-08-02.",
    coverArt: "https://i.ytimg.com/vi/vPW49GU38Ng/maxresdefault.jpg",
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
    shop: { label: "Shop", url: "https://jessewelles.redstarmerch.com/" },
    tickets: { label: "Tour & tickets", url: "https://www.wellesmusic.com/tour" },
    /* [L1 2026-08-02] CORRECTED, THEN CLOSED. This carried a /channel/UCmb7...
       URL taken from a SEARCH RESULT, and the handle @hellswelles replaced it
       because an unconfirmed equivalence is not a fact.
       THE EQUIVALENCE IS NOW CONFIRMED: @hellswelles' own channel page returns
       externalId UCmb7zAvq9IxHi_UnP93AVSQ — the very id that was held as
       UNVERIFIED. There was never anything wrong with the id; only with what
       we could prove about it. The ledger row moves UNVERIFIED -> OFFICIAL. */
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
    trail: [
      { label: "wellesmusic.com", url: "https://www.wellesmusic.com", scent: "His own place. Tour, contact, the lot." },
      { label: "Tour dates", url: "https://www.wellesmusic.com/tour", scent: "He plays constantly. This is where it is real." },
      { label: "His channel", url: "https://www.youtube.com/@hellswelles", scent: "Where the songs land first, verified from his own uploads." },
      { label: "The store", url: "https://jessewelles.redstarmerch.com/", scent: "Linked from his own site." },
    ],
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
       by a search ranking - which is exactly what was missing when this
       entry had to leave the door shut. */
    site: "https://www.youtube.com/@findmikeymike",
    siteLabel: "his channel",
    /* ***** [R-a 2026-08-02] THE LEAD WAS RIGHT AND THE LINK IS STILL REFUSED.
       The ledger recorded `findmikeymike` as "a strong lead — the kind of
       handle an artist reuses across platforms". It was: findmikeymike.com
       resolves, and it IS his (98 mentions of his name, his Spotify, his
       socials, a MERCH and TOUR nav).
       IT IS ALSO COMPROMISED. The page body is stuffed with an injected SEO
       link farm — Indonesian gambling domains (putarslot88, vipwin88,
       indo7poker, pedetogel) and two dozen unrelated restaurant and
       veterinary sites. Read directly, 2026-08-02.
       So the door stays shut, for a reason that has nothing to do with
       identity, and the reason is written down so that a future pass does not
       "close the gap" by adding it. ***** */
    siteNote: "His channel is the only surface linked here. He does own " +
              "findmikeymike.com, and it is currently serving injected spam — " +
              "so it is named in the ledger and linked nowhere.",
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
    trail: [
      { label: "His channel", url: "https://www.youtube.com/@findmikeymike", scent: "The only surface confirmed to be his. Verified from the upload itself." },
    ],
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
   "only where they exist" needs no conditional at the call site. */

/* [M-d] every track declares its KIND. It is data, so a wing that declares
   none renders none and /hr, /wb and /robots are byte-identical. */
function songTrack(a, s) {
  return {
    id: a.id + "-song-" + s.slug,
    title: s.title,
    kind: "song",
    song: s.slug,                       /* the fact vault's first-meet tier */
    tags: [...a.tags, "song"],
    videos: s.ytId ? [{ ytId: s.ytId, label: s.title, type: "official" }] : [],
    face: s.ytId ? undefined : {
      kind: "text",
      title: s.title.toUpperCase(),
      subtitle: a.name.toUpperCase(),
      blurb:
        "The official upload for this song was not confirmed in the research " +
        "pass, so no player is wired here rather than a guessed one. " +
        (a.channel ? "The artist's own channel is one press away."
                   : "The artist's channel is not confirmed either."),
      lines: [
        "ARTIST   " + a.name,
        "SONG     " + s.title,
        "VIDEO    not confirmed — [PAPA] supplies the id",
      ].concat(s.note ? ["NOTE     " + s.note] : []),
      papa: "[PAPA] — the official video id, and the words this song " +
            "deserves once it plays.",
      action: a.channel
        ? { label: "Open the artist's channel", event: "wb-wal-open-link",
            href: a.channel }
        : undefined,
    },
  };
}

/* [C-c 2026-08-02] THE PER-SONG MUSEUM CARD, AS A SUB-ROW.
   A card cannot share the frame with its song: M-a made the video FILL the
   viewer by geometry, which is right, and which means there is no room left
   beside it for a page of text. So the card is its own row.
   It is NOT a numbered track. Under the trail-marker law a numbered row is a
   marker, and doubling the markers halves the odds the visitor keeps the one
   that matters. The song is the marker; its card is one of the trees. */
function songCardTrack(a, s) {
  if (!s.card) return null;
  return {
    id: a.id + "-card-" + s.slug,
    title: s.title,
    kind: "card",
    sub: true,
    song: s.slug,
    tags: [...a.tags, "card"],
    videos: [],
    face: {
      kind: "text",
      title: s.title.toUpperCase(),
      subtitle: a.name.toUpperCase(),
      tombstone: s.card.tombstone,
      label: s.card.label,
      footer: "WORTH A LISTEN · " + a.name,
      papa: "[PAPA] — the words for this song's card.",
    },
  };
}

function artistCardTrack(a) {
  return {
    id: a.id + "-artist",
    title: "The Artist",
    kind: "card",
    tags: [...a.tags, "about", "faq"],
    videos: [],
    face: {
      kind: "text",
      title: "THE ARTIST",
      subtitle: a.name.toUpperCase(),
      /* [TRAIL-MARKER LAW 2026-08-02] THE HEADLINE LAYER IS ONE SENTENCE.
         A visitor remembers one or two things at most, and ten things reduces
         the odds they keep the one that matters. So the blurb is the ONE
         thing about this artist worth carrying out of the building - not a
         summary of them. Everything beneath is the trees: it makes the scene
         real and nobody inspects it. */
      blurb: a.marker,
      /* the two museum labels, per R-a: the factual register and the 75-150
         words of what this is doing here. */
      tombstone: a.card.tombstone,
      label: a.card.label,
      sideboxes: a.card.sideboxes,
      entries: [
        { stamp: "Q", title: "Why is this artist in the museum?",
          line: "Because someone here thinks they are worth a listen. That is " +
                "the whole editorial standard and it is not pretending to be " +
                "anything grander.",
          note: "[PAPA]" },
        /* ===== [R3 2026-08-02] THE MONEY QUESTION, ANSWERED FIRST =========
           Mike's doctrine: the business model must be unmistakable UP FRONT,
           with no digging. An artist reaching this page should learn what
           this house takes from them before they learn anything else - and
           the answer is nothing.
           WHY IT IS FIRST AND NOT BURIED: the launch-readiness ledger found
           that an artist could walk the entire click-path - album, songs,
           About, Link, shop - without ever meeting the mission. "We are not
           affiliated" says what we are NOT doing; it never answers "does
           anyone here make money off my song".
           HUMOUR FILTERED (the ya-owe-me lesson): charm is allowed, edges
           are not. Every line below is a [PAPA] DRAFT - Mike edits, and
           nothing here claims to be final. */
        { stamp: "Q", title: "Does Weird.Baby make money from this?",
          line: "No. Not from the song, not from the play, not from the link. " +
                "There is no ad on this page, no affiliate code in any link, " +
                "and no cut of anything you buy from the artist. Every " +
                "commercial door in this exhibit opens onto their shop, not " +
                "ours.",
          note: "[PAPA] - the money answer. Tight is the whole point." },
        { stamp: "Q", title: "Then why does this exist?",
          line: "Because someone here thinks these records are worth a " +
                "listen and that pointing at them costs us nothing. That is " +
                "the entire business model of this wing, and it is not a " +
                "loss leader for a different one.",
          note: "[PAPA] - the mission, in the artist's own reading order." },
        { stamp: "Q", title: "Is Weird.Baby affiliated with them?",
          line: "No. Nothing here is endorsed by the artist, nothing here is " +
                "sold on their behalf, and every link goes to their own place.",
          note: "" },
        { stamp: "Q", title: "How do I support them?",
          line: a.shop || a.listen
            ? "Their own shop and their own store are linked in this album. " +
              "Use those rather than anything here."
            : "Buy from them directly wherever you find them — this " +
              "exhibit has no store of its own and never will.",
          note: "" },
      ],
      entriesMode: "list",
      /* THE TRAIL. Each marker is a link with a SCENT LINE - one clause
         saying why it is worth following. Set the markers, let them find the
         way. Every url here is verified per the ledger discipline; anything
         unverified is not shipped. */
      trail: a.trail,
      footer: "WORTH A LISTEN · " + a.name,
      /* PROVENANCE ON THE PAGE, not just in a comment a developer reads.
         The [PAPA] slot already exists and already renders, so the note rides
         it rather than growing the face contract a field it does not need. */
      papa: (a.aboutNote ? a.aboutNote + "  " : "") +
            "[PAPA] — the card copy and the FAQ answers.",
    },
  };
}

function placeTrack(a) {
  return {
    id: a.id + "-place",
    title: "Their Place",
    kind: "link",
    tags: [...a.tags, "link"],
    videos: [],
    face: {
      kind: "text",
      title: "THEIR PLACE",
      subtitle: a.name.toUpperCase(),
      blurb: a.site
        ? "The artist's own place. This exhibit is a pointer, not a home — " +
          "everything that matters about them is theirs and lives there."
        : "No official site is on file for this artist yet.",
      lines: a.site
        ? ["SITE     " + (a.siteLabel || a.site)]
            .concat(a.siteNote ? ["NOTE     " + a.siteNote] : [])
        : ["SITE     not on file", "WHY      " + (a.siteNote || "unconfirmed")],
      action: a.site
        ? { label: "Go to " + (a.siteLabel || "the artist's site"),
            event: "wb-wal-open-link", href: a.site }
        : undefined,
      papa: "[PAPA] — the handoff wording.",
    },
  };
}

/* [R-a] SHOWS AND LISTEN WERE SPLIT OUT OF THE SHOP ROW.
   They had been three answers folded into one row titled "Shop", which hid
   the two better ones. Where to SEE them, where to HEAR them and where to BUY
   from them are three different questions and now three different rows —
   each of which appears only where the thing exists. */
function showsTrack(a) {
  if (!a.tickets) return null;
  return {
    id: a.id + "-shows",
    title: "Shows",
    kind: "live",
    tags: [...a.tags, "live"],
    videos: [],
    face: {
      kind: "text",
      title: "SHOWS",
      subtitle: a.name.toUpperCase(),
      blurb: "Where to stand in the same room as it. This is the one thing " +
             "an exhibit genuinely cannot give you.",
      lines: ["TICKETS  " + a.tickets.url],
      action: { label: a.tickets.label, event: "wb-wal-open-link", href: a.tickets.url },
      papa: "[PAPA] — the wording.",
    },
  };
}

function listenTrack(a) {
  if (!a.listen) return null;
  return {
    id: a.id + "-listen",
    title: "Listen",
    kind: "listen",
    tags: [...a.tags, "listen"],
    videos: [],
    face: {
      kind: "text",
      title: "LISTEN",
      subtitle: a.name.toUpperCase(),
      blurb: "Where to hear it without paying an advertiser for the privilege.",
      lines: ["LISTEN   " + a.listen.url,
              "WHY      " + a.listen.label],
      action: { label: a.listen.label, event: "wb-wal-open-link", href: a.listen.url },
      papa: "[PAPA] — whether a second listen destination is ever worth a second row.",
    },
  };
}

function shopTrack(a) {
  if (!a.shop) return null;
  return {
    id: a.id + "-shop",
    title: "Shop",
    kind: "shop",
    tags: [...a.tags, "shop"],
    videos: [],
    face: {
      kind: "text",
      title: "SHOP",
      subtitle: a.name.toUpperCase(),
      blurb: "Where the money goes to them.",
      lines: ["THEIR STORE  " + a.shop.url],
      /* [C3 2026-08-02] THE SHOP TRACK GOES TO THE HOUSE SHOP, TOP-BILLED.
         Mike's ruling: a WAL artist's shop track lands on the W.B gift-shop
         conglomerate page with THAT artist at full size on top and everyone
         else below per the template - and they stay in the everyone-section
         too, so the page reads as a shop rather than as a redirect.
         The artist crosses in the URL, exactly the way portal presets do:
         `/shop?top=<id>`. Same contract, same reasoning - a query string
         survives a reload and a copied link, and the shop needs to know one
         word rather than to import anything. Their own store is still one
         click on, from their banner. */
      action: { label: "The Gift Shop", event: "wb-wal-shop", href: "/shop?top=" + a.id },
      papa: "[PAPA] — the wording.",
    },
  };
}

/* [R-b 2026-08-02] LATELY — THE VIDEO WALL THAT REPLACED THE PHOTO SLIDESHOW.
   The slideshow question was ruled: every image source on offer is a rights
   gamble, and the one asset class affirmatively licensed to us is the embed.
   So the wall is video, and its contents come from the artist's OWN upload
   feed — read from youtube.com/feeds/videos.xml for the channel id resolved
   off their own channel page, not from a search.

   IT IS BAKED, NOT FETCHED. A live fetch would make the visitor's browser
   call YouTube on load for a list nobody asked for; the snapshot date is
   stated on the face instead, because a dated snapshot is honest and an
   undated live number is not.

   THE ROWS ARE NOT PLAYABLE, ON PURPOSE. Promoting them into the tracklist
   would rank a hashtag-only clip alongside the two songs this wing actually
   chose, and curation is the whole product here. They are trail markers out
   to the video — which is what a pointer-not-a-home exhibit should do. */
function latelyTrack(a) {
  if (!Array.isArray(a.feed) || !a.feed.length) return null;
  return {
    id: a.id + "-lately",
    title: "Lately",
    kind: "feed",
    tags: [...a.tags, "feed"],
    videos: [],
    face: {
      kind: "text",
      title: "LATELY",
      subtitle: a.name.toUpperCase(),
      blurb: "What this artist has actually been doing, taken from their own " +
             "upload feed rather than from anybody's write-up of it.",
      tombstone: [
        { k: "Source", v: "Their own channel feed" },
        { k: "Read", v: "2 August 2026" },
        { k: "Showing", v: a.feed.length + " of the most recent" },
        { k: "Counts", v: "A snapshot, dated — not a live number" },
      ],
      trail: a.feed.map(f => ({
        label: f.d + "   " + f.t,
        url: "https://www.youtube.com/watch?v=" + f.id,
        scent: f.v + " views as of 2 August 2026",
      })),
      footer: "WORTH A LISTEN · " + a.name,
      papa: "[PAPA] — whether any of these earns a row of its own.",
    },
  };
}

/* the tracklist, in the ruled order. Each song is followed immediately by its
   own card, so the card is never more than one row from the thing it is
   about. */
function tracksFor(a) {
  const out = [];
  a.songs.forEach(s => {
    out.push(songTrack(a, s));
    out.push(songCardTrack(a, s));
  });
  out.push(artistCardTrack(a));
  out.push(placeTrack(a));
  out.push(showsTrack(a));
  out.push(listenTrack(a));
  out.push(shopTrack(a));
  out.push(latelyTrack(a));
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
  /* FLAGGED FOR ART where it is a placeholder. `coverArt` is set only where
     the museum owns the source (Hunter Root's own catalogue); everyone else
     gets the house typographic cover rather than a rights gamble. */
  art: a.coverArt || cover(a.name),
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
  /* [R-c 2026-08-02] THE VAULT IS WIRED. This was `[]`, which is why the
     player scroller never ran in this wing and why there was nothing for a
     popup to pop. 321 sourced facts now, in the museum's own fact shape,
     consumed by the shipped selector with no new selection code. */
  facts: worthAListenFacts,
  defaultActiveIndex: 0,
  splitKey: "wb-wal-split",
  splitDefault: 26,
  cfKey: "wb-wal-cfh",
  bodyKey: "wb-wal-bodyh",
  visitPath: "/wal",
  shopExitParam: "wal",
  shopEntryHidden: false,
  /* the ruled viewer standard: this wing is staged from the day it opens, so
     it never has a scroll trap to migrate away from later. */
  stage: true,
  /* [M-e 2026-08-02] the transport stows into the artist-name bar, and the
     fixed 68px player bar stands down with it. Opt-in by config so /hr, /wb
     and /robots are untouched. */
  transport: "banner",
};
