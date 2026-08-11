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
// ---- THE TRACKLIST (Mike's intent, CORRECTED — F1 2026-08-02) --------------
// Last round's flag paid for itself: "Coconuts" and "E. D. Yadah" were MIKE'S
// OWN SONG TITLES used as EXAMPLES of tracklist rows — foreign examples, not
// categories — and both are dead. His actual point: the tracklist lists the
// SONGS, then the song fact sheet and the rest. Every WAL artist gets the
// SAME shape, and the shape is the deliverable — a new artist is a new entry
// in ARTISTS below and nothing else:
//
//   01..n  the artist's own songs   numbered, playable, the main event
//   About the Songs                 the songs' fact sheet — the museum cards
//   About the Artist                the artist's card, the two honest
//                                   questions, and the DOORS OUT (site,
//                                   listen, store, channel — rehomed from
//                                   the dead links row)
//   What they are up to             their own uploads as the collage wall
//                                   (+ the tour door where one exists)
//
// The Gift Shop row stays REMOVED (W10); the shop is one press away in the
// title bar. Confirmed rulings from the last round that stand: the sub-rows
// are dead, categories are unnumbered, songs alone carry numbers.
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
/* [F2 2026-08-06] the wing's FAQ — the house's own format and the house's own
   standing passages. See src/data/faq-face.js and src/data/house-copy.js. */
import { faqFace } from "../faq-face.js";
import { AFFILIATION, USE_RIGHTS } from "../house-copy.js";

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
    /* [P11 2026-08-02] DATE STARTED WITH US — the gift shop's billing order.
       Mike's GIFT SHOP BILLING LAW orders everyone below top billing by when
       they joined us, earliest first, so every artist needs the date. These
       are read off THIS REPOSITORY'S OWN RECORD rather than invented: Carsie,
       Jesse and Mikey all arrived the day the wing was built (the W5 ruling
       stamp above, and the wing's first commit); Hunter Root predates the
       wing by months. Ties break alphabetically, which is the wing's own
       standing law from v29. */
    since: "2026-07-30",
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
          ],
        } },
    ],
    site: "https://www.carsieblanton.com",
    siteLabel: "carsieblanton.com",
    siteFn: "Homepage",
    siteScent: "Her own place — the shows list, the shop and the blog she has " +
               "been writing since long before the records got political.",
    shop: { label: "Her own shop", url: "https://www.carsieblanton.com/shop/",
      fn: "Shop and tours",
      scent: "Records and merch sold by her, with the tour dates one page over." },
    /* [S2 2026-08-05] THE GIFT SHOP TILE'S ADDRESS — Mike's, verified. The rule
       and its reasoning are in GiftShop.jsx's `billing()`; this field is the
       declaration. Her front door rather than `shop.url`'s /shop/ subpage; Shop
       is one of three items in her own nav, read directly 2026-08-05. */
    shopExit: "https://www.carsieblanton.com/",
    /* [L1] the verified channel (oEmbed author_url of her own BE GOOD lyric
       video) rather than the search-found playlist. */
    channel: "https://www.youtube.com/@CarsieBlanton",
    channelLabel: "@CarsieBlanton",
    channelScent: "Her uploads, first — and the wall of pictures in this room " +
                  "is glued up from them.",
    /* MIKE'S RULING, KEPT: her Bandcamp streams the catalogue free and
       without advertising and pays her directly, so it stays the NAMED better
       listen rather than being buried under a video.
       [P21] THE WORDING IS NEW. It read "without paying an advertiser for the
       privilege" — Mike: too brash. Same fact, plainly. */
    listen: { label: "Bandcamp", url: "https://carsieblanton.bandcamp.com",
      fn: "Music library",
      scent: "Sixteen releases, free to play, pay what you want — and the " +
             "money goes straight to her." },
    /* verified from her own site's nav, 2026-08-02 */
    tickets: { label: "Her shows list", url: "https://www.carsieblanton.com/shows/" },
    marker: "She writes protest songs you can dance to, and she means every word of the protest.",
    card: {
      /* [P20 2026-08-02] LINKS ON THE BACK OF THE BASEBALL CARD. Mike loves
         this block and asked for doors wherever possible. Every `url` below
         was read directly this round: her Bandcamp catalogue page for the
         records, the album's own page for the latest, her own upload of the
         acceptance speech for the honour, Wikipedia for the birth facts.
         "Working since" carries no door on purpose — Ain't So Green is not on
         her Bandcamp, and there is no honest place to send someone. */
      tombstone: [
        { k: "Born", v: "22 July 1985, Luray, Virginia",
          url: "https://en.wikipedia.org/wiki/Carsie_Blanton", src: "Wikipedia" },
        { k: "Based", v: "The Philadelphia area, since 2020" },
        { k: "Before that", v: "Eugene · Philadelphia · New Orleans" },
        { k: "Working since", v: "Ain't So Green, 2005" },
        { k: "Records", v: "Twelve, every one of them independent",
          url: "https://carsieblanton.bandcamp.com/music", src: "her own Bandcamp" },
        { k: "Latest", v: "Everything is Great, 2026, with The Burning Hell",
          url: "https://carsieblanton.bandcamp.com/album/everything-is-great",
          src: "her own Bandcamp" },
        { k: "Honour", v: "Folk Alliance International Artist of the Year, 2026",
          url: "https://www.youtube.com/watch?v=NFTza3tVsQ8",
          src: "her own upload of the acceptance speech" },
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
      /* [P22] the twelve-line discography is GONE. What is left is the one
         sidebox that was never a list of records — the band. */
      /* [R6 2026-08-03] AND NOW IT IS ONLY THE BAND. Three of these five lines
         were BILLINGS — Wood Brothers, Hadestown, Paul Simon — filed under a
         heading about who plays with her, because before the record board
         existed there was nowhere else for an achievement to go. They have
         moved to `metrics` below, where a reader looking for them can find them
         by kind. Nothing is duplicated: a fact is in one block or the other. */
      sideboxes: [
        { title: "On stage",
          lines: ["Usually a trio, sometimes called the Handsome Band",
                  "Joe Plowman, bass · Patrick Firth, keyboards"] },
      ],
    },
    /* ===== [R6 2026-08-03] THE RECORD BOARD ================================
       Mike's brief: verifiable, durable facts only — documented charts where
       they genuinely exist, certifications, billings, notable syncs. Nothing
       invented, nothing estimated, no live counts.
       CARSIE HAS NO DOCUMENTED CHART ENTRY IN THIS MUSEUM'S SOURCES, and the
       block says so rather than going quiet. She has an award with a door on
       it, a catalogue with a door on it, and three billings carried over from
       the sidebox above. Those three have no single readable page in our
       sources, so per the ledger discipline they are plain type and the note
       says where they came from — the same rule P20 applied to the register and
       P16 to the records shelf. */
    metrics: {
      rows: [
        { kind: "Award", when: "2026",
          fact: "Folk Alliance International Artist of the Year — tied with I'm With Her",
          url: "https://www.youtube.com/watch?v=NFTza3tVsQ8",
          src: "her own upload of the acceptance speech" },
        { kind: "Catalogue", when: "2005–2026",
          fact: "Twelve records, every one of them released independently",
          url: "https://carsieblanton.bandcamp.com/music", src: "her own Bandcamp" },
        { kind: "Billing", when: "2011", fact: "Opened on Paul Simon's tour" },
        { kind: "Billing", when: "from 2010", fact: "Opened for The Wood Brothers" },
        { kind: "Stage", when: "2011", fact: "Played one of the Fates in Hadestown" },
      ],
      note: "No chart entry and no certification is documented for her in this " +
            "museum's sources. The three unlinked lines are carried from her " +
            "own press page and the biography this card cites; neither has a " +
            "single readable page to point at.",
    },
    /* [P16] THE RECORDS THIS ROOM POINTS AT — every slug read off her own
       Bandcamp catalogue page, 2026-08-02. The other thirteen releases are
       behind the music-library door; a museum names the objects it is
       showing, not everything in the store. */
    records: {
      title: "The records, and where to get them",
      items: [
        { year: "2021", title: "Love & Rage", why: "“Shit List” is its second single.",
          links: [{ name: "Bandcamp", mark: "BC",
                    url: "https://carsieblanton.bandcamp.com/album/love-rage-2021" }] },
        { year: "2020", title: "Be Good", why: "The single the lyric video in this room belongs to.",
          links: [{ name: "Bandcamp", mark: "BC",
                    url: "https://carsieblanton.bandcamp.com/track/be-good-digital-single" }] },
        { year: "2026", title: "Everything is Great", why: "The latest, made with The Burning Hell.",
          links: [{ name: "Bandcamp", mark: "BC",
                    url: "https://carsieblanton.bandcamp.com/album/everything-is-great" }] },
        { year: "2024", title: "After the Revolution",
          links: [{ name: "Bandcamp", mark: "BC",
                    url: "https://carsieblanton.bandcamp.com/album/after-the-revolution" }] },
      ],
      note: "Sixteen releases sit on her own Bandcamp. Body of Work came out " +
            "one song a month across 2022 and 2023.",
    },
    /* [P17/P18/P19] THE THREE DECKS. Every URL below was opened and read this
       round; nothing is quoted that was not seen at its own source. */
    decks: [
      { title: "Said about her", kind: "quote", cards: [
        { text: "one of those hard-headed, open-hearted protesters",
          who: "Ken Tucker", where: "NPR, Fresh Air", when: "April 2021",
          eyebrow: "on Love & Rage",
          url: "https://www.npr.org/2021/04/26/990845574/carsie-blantons-open-hearted-protest-album-is-equal-parts-love-rage" },
        { text: "delightfully surprising",
          who: "Ken Tucker", where: "NPR, Fresh Air", when: "March 2019",
          eyebrow: "on Buck Up",
          url: "https://www.npr.org/2019/03/21/705424265/carsie-blanton-is-delightfully-surprising-on-buck-up" },
        { text: "an open-hearted protest album",
          who: "Shore Fire Media", where: "the release note itself", when: "2021",
          eyebrow: "on Love & Rage",
          url: "https://shorefire.com/releases/entry/carsie-blanton-love-and-rage-out-now" },
      ] },
      { title: "What Carsie said", kind: "quote", cards: [
        { text: "hooks, chutzpah, and revolutionary optimism",
          who: "Carsie Blanton", where: "her own site", when: "read 2026",
          eyebrow: "on what the work is",
          url: "https://www.carsieblanton.com/" },
        { text: "Perhaps happiness cannot be achieved just by building a " +
                "perfect domestic life",
          who: "Carsie Blanton", where: "her blog", when: "“Vertigo, Bacchanalia…”",
          eyebrow: "on happiness",
          url: "https://carsieblanton.tumblr.com/post/159910295894/vertigo-bacchanalia-and-the-art-of-the" },
        { watch: "NFTza3tVsQ8",
          text: "Her Artist of the Year speech, in her own voice.",
          who: "Carsie Blanton", where: "her own channel", when: "January 2026",
          eyebrow: "Folk Alliance International",
          url: "https://www.youtube.com/watch?v=NFTza3tVsQ8" },
      ] },
      { title: "Also", kind: "note", cards: [
        { title: "Patreon",
          text: "She has run one since 2013 — songs, videos, records and " +
                "mischief, paid for directly by the people who want them.",
          who: "patreon.com/carsieblanton", where: "her own page",
          eyebrow: "Since 2013",
          url: "https://www.patreon.com/carsieblanton" },
        { title: "The blog",
          text: "Essays on panic, on moralism, on what a good life is " +
                "actually made of. She was writing them before the records " +
                "turned political.",
          who: "carsieblanton.com/blog", where: "her own writing",
          eyebrow: "Prose",
          url: "https://www.carsieblanton.com/blog/" },
        { title: "Rent parties",
          text: "Through 2020 and 2021 she threw a monthly online rent party " +
                "to keep herself and her band paid.",
          who: "Wikipedia", where: "read 2026",
          eyebrow: "2020–2021",
          url: "https://en.wikipedia.org/wiki/Carsie_Blanton" },
      ] },
    ],
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
    /* [P11] the founding artist — the day his material entered MediaVault
       (accession MV-HR-20260405-001 and its siblings). Nobody here is older,
       so he heads the list whenever he is not top billing himself. */
    since: "2026-04-05",
    tag: "hunter_root",
    name: "Hunter Root",
    tags: ["wal", "hunter-root", "house"],
    art: "/images/wal/hunter-root-cover.jpg",
    /* [F1 2026-08-03] THE VISUAL HOOK LAW, APPLIED WHERE MIKE NAMED IT.
       "About the Artist SPECIFICALLY must open on an interesting image/visual,
       not paragraphs." Two of the four artists declared a `plate` and two did
       not, so half this wing's artist cards opened on a heading and then prose.
       F1 filled this slot with the coverflow's own file — the ’94 poster frame
       — and named the trade in the same breath: "a card that opens on the
       record you just pressed is a weaker hook than a portrait would be … WHEN
       A PORTRAIT EXISTS THIS IS ONE STRING."

       [C4 2026-08-03] THE PORTRAIT EXISTS. IT IS THE ONE STRING.
       Mike: "fine as-is unless a better vault image exists; check and use the
       best available." The vault was checked rather than assumed — all 49
       artifacts in src/data/exhibits/hunter_root.json, of which exactly three
       carry media_type "photo" — and each was fetched and looked at:
         · MV-20260419-002  a puppet by ElmThree Productions. Not him.
         · MV-HR-20260405-035  him, grinning, holding a chip sandwich — but the
             capture is a Facebook post complete with the post header and a
             browser scrollbar down its right edge. A screenshot of a page, not
             a photograph of a person.
         · MV-HR-20260405-037  THE ONE. An Instagram capture whose photo panel
             is a clean, front-facing, smiling portrait: him in the driver's
             seat, tie-dye Chet Vincent tee, daylight. Cropped out of the
             Instagram chrome at the capture's own resolution (3840×1823 → the
             panel at 1197×1499, resampled to 1100 wide) it is a plate, and it
             is the best picture of Hunter Root this museum holds.
       WHY THIS IS STILL NOT A NEW RIGHTS DECISION. Same class as the file it
       replaces: OUR OWN vaulted catalogue of our own house artist, released in
       MediaVault, exported by our own tool. Nothing was fetched from an outside
       surface for it — the crop is of a capture we already hold. Logged in
       docs/WAL_PHOTO_PROVENANCE-20260802.md with the other five.
       AND THE COVERFLOW GETS ITS FILE BACK TO ITSELF: `art` and `plate` are no
       longer the same image, so pressing the record and then reading his card
       are two different pictures, which is what the duplication cost. */
    plate: "/images/wal/hunter-root-plate.jpg",
    plateCaption: "On the road, September 2024 — from the museum's own vault.",
    songs: [
      { title: "’94", slug: "94", ytId: "vPW49GU38Ng",
        note: "Official music video. Museum catalogue MV-20260523-001, " +
              "album Crooked Home.",
        card: {
          /* ═══ [R5 2026-08-06] THE TWO ROWS THE OTHER THREE CARRY ARE ADDED,
             AND THE ACCESSION ROW STAYS. Mike's posture ruling — "switch them
             to embeds of his own official uploads, the same posture as the
             other three" — is about what the page SAYS it is doing as much as
             what it does, and this card said only that the museum had catalogued
             the video. Carsie's and Jesse's cards say whose channel published
             theirs and what check proves it; his now says the same.
             VERIFIED THIS ROUND RATHER THAN ASSUMED, because the whole ruling
             turns on it: YouTube oEmbed for vPW49GU38Ng returns author_name
             "Hunter Root", author_url youtube.com/@hunterrootmusic. The embed on
             this page is his own upload and always was — which is the correction
             to Mike's premise, not a compliance with it.
             THE ACCESSION ROW WAS DRAFTED FOR DELETION AND PUT BACK, and the
             reason is worth one line because it is Doctrine 11 catching Ops in
             the act: an accession number is PROVENANCE and a museum prints
             those, and this one is the on-glass anchor for two other passages
             on this card — the vault quote below it and the “’94” label — whose
             provenance rows point at it and nothing else. Deleting a citation to
             make a card symmetrical would have cost this page the only thing
             saying where its quotes came from. */
          tombstone: [
            { k: "Maker", v: "Hunter Root" },
            { k: "From", v: "Crooked Home" },
            { k: "Medium", v: "Official music video" },
            { k: "Published by", v: "His own channel, @hunterrootmusic" },
            { k: "Verified", v: "oEmbed author_url — the upload itself" },
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
          /* [R5 2026-08-06] same two rows added as on “’94” above, same reason,
             same check: oEmbed for Wv0_mujJUQU returns "Hunter Root" /
             youtube.com/@hunterrootmusic. The accession stays for the same
             reason it stays there — it is this card's provenance anchor. */
          tombstone: [
            { k: "Maker", v: "Hunter Root" },
            { k: "From", v: "Skipping Stones That Sink Before They're Thrown" },
            { k: "Medium", v: "Official music video" },
            { k: "Published by", v: "His own channel, @hunterrootmusic" },
            { k: "Verified", v: "oEmbed author_url — the upload itself" },
            { k: "Accession", v: "MV-20260523-040" },
            { k: "Note", v: "Filed as “Nothin' Wrong”; supplied as “Nothing Wrong”" },
          ],
          /* [CS 2026-08-04] both paragraphs were about how this entry was
             MADE — "needed no open-web guessing at all", "flagged rather than
             fixed in silence" — printed as the song's interpretive label. The
             title question is a real fact about the catalogue and stays; the
             account of our own data handling does not. */
          /* [R4 2026-08-06] THE HOLDINGS SENTENCE IS STRUCK FROM THIS CARD.
             It read "One of two Hunter Root songs surfaced in this wing, out of
             the ninety-three tracks on file in the museum's own vault." MIKE:
             "nobody asked for a holdings announcement; it exists only because
             it was typed for Hunter. A visitor presses play and it plays. The
             fact stays in the vault; the bragging leaves the page."
             THE FIGURE IS NOT CORRECTED, IT IS GONE — which finally ends the
             arc W1 and D3c were both inside: 78 was a count of `song:` slugs
             printed as songs, 93 was a count of track rows printed as songs,
             and each fix moved the same claim one step. No number about this
             museum's holding is printed on this card any more, so there is
             nothing left here to go stale.
             The title fact stays: it is about the record, not about us. */
          label: [
            "The catalogue files it as “Nothin' Wrong”, and the " +
            "catalogue is the record.",
          ],
        } },
    ],
    /* [W9] his door out is his own site, same as everyone else's. His store
       lives at the same address, so ONE row carries both scents rather than
       two rows to one place. */
    site: "https://www.hunterroot.com/",
    siteLabel: "hunterroot.com",
    siteFn: "Homepage and shop",
    siteScent: "His own place, and the store is the front page of it — " +
               "Crooked Home on vinyl, Arkansas, the Chase The Dragon 7-inch.",
    /* [P16 2026-08-02] AND HE HAS A BANDCAMP TOO, which the wing had never
       named: his own site's "Tunes" tab points straight at it. Read directly,
       2026-08-02. */
    listen: { label: "Bandcamp", url: "https://hunterrootmusic.bandcamp.com",
      fn: "Music library",
      scent: "Where his own site sends you to listen — the records and the " +
             "singles, free to play." },
    tickets: { label: "His tour page", url: "https://www.hunterroot.com/hunterroottour" },
    shop: null,
    /* [S2 2026-08-05] THE GIFT SHOP TILE'S ADDRESS — Mike's, verified. Rule in
       GiftShop.jsx's `billing()`. His tile used to fall through `shop: null` to
       Bandcamp; his own site opens on "Official Merch Store" with Merch first
       in the nav, read directly 2026-08-05, so the shop was sending people past
       the shop. */
    shopExit: "https://www.hunterroot.com/",
    marker: "Half of Crooked Home is about his brother Nick. He says ’94 is the heart of it all.",
    card: {
      /* ═══ [W1 2026-08-05] THE FIGURES ARE REBUILT FROM THE VAULT ═══════════
         MIKE: correct them the same way W2 did the poster. M50 named six sites
         on this card and three of them were classed VERIFIED with a real
         citation, which is exactly the hole `provenance/README.md` §4 names —
         the boundary can prove a number was declared; it cannot prove it is
         the number it claims to be.

         COUNTED THIS ROUND, INDEPENDENTLY, off the museum's own export
         (src/data/exhibits/hunter_root.json, via buildSpineFromArtifacts):
           9 album containers · 93 track rows · 78 of those rows carry a
           `song:` slug and the 15 that do not are, exactly, Run With The Hunt.
         So "78 songs" was never stale. It was a count of the SLUGS and it was
         reported as a count of the SONGS, and it silently dropped a whole
         record. And "Nine albums" counted CONTAINERS: seven are records, one
         is an EP by its own title (Phone Recordings EP) and one is a set by
         its own title (SINGLES & RARITIES).

         "WHOSE CATALOGUE THE MUSEUM HOLDS ITSELF" also goes, in the label
         below. The wing's own records note four hundred lines down says
         sixteen releases sit on his Bandcamp against nine in the vault. The
         line did not say "whole", but a reader takes "holds itself" for all of
         it, and W2 struck the same claim off the poster for the same reason.

         WHAT DID NOT CHANGE, AND THIS IS A CORRECTION TO M50 RATHER THAN A
         COMPLIANCE WITH IT: "Half of Crooked Home is about his brother." M50
         recorded that the vault does not carry the half. IT DOES — vault fact
         MV-HR-20260707-068, in Hunter's own words to Americana Highways in
         2025: "Half the songs ended up being about my brother… '94' was almost
         the album title. It's the heart of it all." It is his sentence about
         his own record, tagged to `crooked_home`, and it stays on all three
         faces that print it. A search that missed it is not an absence.
         ════════════════════════════════════════════════════════════════════ */
      /* [R4 2026-08-06] TWO ROWS ARE STRUCK AND THEY ARE THE TWO NO OTHER
         ARTIST HAS. "Catalogue — 93 tracks on file in the museum's own vault"
         is the holdings announcement in register form; "Surfaced here — Two" is
         a fact about this room's own presentation rather than about him.
         MIKE: "all four artists become identical — name, songs, cards, doors.
         Same only the data." Carsie's register is Born / Based / Before that /
         Working since / Records / Latest / Honour: seven rows, every one of them
         about HER. His now carries only rows of the same kind.
         "RECORDS" STAYS AND THAT IS A DELIBERATE LINE, not an oversight. Seven
         records, an EP and a set is a count of what he has MADE — the same claim
         Carsie's "Twelve, every one of them independent" makes — and it names
         neither the museum nor the vault. The row that had to go is the one
         whose subject was us. */
      tombstone: [
        { k: "Records", v: "Seven, plus an EP and a set of singles and rarities" },
        { k: "His own site", v: "hunterroot.com — Merch, Tour, Tunes, Bio, Contact",
          url: "https://www.hunterroot.com/", src: "his own site" },
        { k: "On record", v: "Crooked Home, Arkansas, Chase The Dragon",
          url: "https://hunterrootmusic.bandcamp.com/music", src: "his own Bandcamp" },
      ],
      /* ═══ [R4 2026-08-06] THIS CARD HAS NO INTERPRETIVE LABEL, AND THAT IS
         THE HONEST RESULT OF THE RULING RATHER THAN A GAP SOMEBODY MISSED.
         MIKE: "delete the holdings sentence entirely, everywhere… all four
         artists become identical — name, songs, cards, doors. Same only the
         data."
         BOTH PARAGRAPHS WERE THE HOLDINGS ANNOUNCEMENT. The first was it
         outright — "the house artist — the one musician in this wing whose
         records the museum holds in its own vault: seven of them, an EP and a
         set of singles and rarities, ninety-three tracks in all, accessioned
         from April 2026." The second was its continuation plus a pointer at the
         doors four inches below it — "Two of those songs are surfaced in this
         room, both from the vault's own copies. The rest of the catalogue, and
         the records as objects, are behind the doors at the foot of this card."
         Strike the announcement and there is nothing left of either.
         THE HISTORY IS WORTH ONE LINE BECAUSE IT IS THE SAME SLOT FAILING
         TWICE. Before CS struck them, these two paragraphs were about this
         WEBSITE — "his catalogue taught the museum's machinery every pattern
         the other wings inherited". CS replaced the museum's software with the
         museum's holdings; both times the card whose job is to introduce a
         musician was talking about the house. It is empty now, which is the
         first time it has been about nothing rather than about us.
         OPS DOES NOT WRITE THE REPLACEMENT (Doctrine 12). The other three carry
         three paragraphs of life and work; nothing in this repository holds the
         equivalent for him except vault quotes already printed on this card's
         own decks. `face.label` is conditional at Exhibit.jsx:3379, so the block
         is not drawn empty — the card runs plate, marker, register, records,
         decks, doors. Named as a gap in docs/OPEN_ACTIONS.md, with the one
         sourced life fact this museum does hold (MV-HR-20260707-035, his own
         words to Whiskey Riff, 2023) put to Mike as a question rather than
         drafted into prose nobody asked for. */
      /* [P22] the merch list stays — it is a store inventory, not a
         discography, and it is the one place a visitor learns the records
         exist as OBJECTS. The "lately, in his own words" list graduated into
         the decks below, where each line is a card with the upload behind
         it. */
      sideboxes: [
        { title: "In his own store",
          lines: ["Crooked Home — vinyl, special vinyl, CD, bundle",
                  "Arkansas — vinyl LP",
                  "Chase The Dragon — 7-inch",
                  "Back in 94' — tee",
                  "Hat"],
          note: "Read off his own store, 2026." },
      ],
    },
    /* ===== [R6 2026-08-03] THE RECORD BOARD, WITH NOTHING ON IT ============
       AND THE HOUSE ARTIST IS THE ONE WHO MUST GET THIS RIGHT. He is ours; he
       is the one artist in the wing whose board we could pad without anyone
       outside this building noticing, because the museum holds his whole
       catalogue and could dress vault counts up as achievements. A vault count
       is not a chart position and this museum does not get to blur the two on
       its own artist and then claim the standard on everyone else's.
       So the board is empty and says why. His catalogue facts are the register
       above, where catalogue facts belong. P16's ruling, third application:
       a missing shelf reads as an oversight; a shelf with a note on it reads
       as the truth. */
    /* [R4 2026-08-06] THE NOTE LOSES ITS SECOND HALF AND KEEPS ITS FIRST, and
       the split is exactly Doctrine 11's. "No chart entry, certification,
       festival billing or sync is documented for him in this museum's sources"
       is an honest statement of what is NOT held — a holdings fact, which
       ships. What followed it was the holdings announcement wearing a
       consolation prize: "his record here is the catalogue itself: 93 tracks
       across seven records, an EP and a set, on file in the museum's own vault,
       in the register above." That sentence answered an empty board by
       bragging, and the register it pointed at no longer carries the row.
       Carsie's note is one sentence of the same shape and stops there. */
    metrics: {
      note: "No chart entry, certification, festival billing or sync is " +
            "documented for him in this museum's sources. That is a statement " +
            "about what we hold and not about the work.",
    },
    /* [P16] slugs read off his own Bandcamp catalogue page, 2026-08-02; years
       from the museum's own era buckets (src/data/era-buckets.json). */
    /* ═══ [W1 2026-08-05] TWO YEARS ON THIS BOARD WERE WRONG, AND THE COMMENT
       ABOVE IS THE CONFESSION OF HOW. `era-buckets.json` holds RANGES, not
       release dates: "The Arkansas Era" starts 2022 and "Crooked Home" starts
       2024, and each bucket's START YEAR was printed as its record's year.
       An era is a span of time that a record OPENS; it is not the day it came
       out, and the two are only ever equal by accident.
         Crooked Home  2024 -> 2025.  Vault MV-HR-20260707-053: "released
                       October 17, 2025 via Tolok". His own Bandcamp album page
                       says "released October 17, 2025", read 2026-08-05.
         Arkansas      2022 -> 2023.  His own Bandcamp: "released June 30,
                       2023", read 2026-08-05. The vault's Arkansas material is
                       all 2023 press and MV-HR-20260707-041 dates the record's
                       viral single to January 2023.
       Both corrected years also match the spine's own display years in
       hunter-root.js, which disagreed with this board for as long as both have
       existed. Skipping Stones (2021) agreed with the spine and is untouched;
       Chase The Dragon carries no year here and none was invented for it. */
    records: {
      title: "The records, and where to get them",
      items: [
        { year: "2025", title: "Crooked Home", why: "“’94” is the heart of it, in his own words.",
          links: [{ name: "Bandcamp", mark: "BC",
                    url: "https://hunterrootmusic.bandcamp.com/album/crooked-home" },
                  { name: "His own store", mark: "ST",
                    url: "https://www.hunterroot.com/" }] },
        { year: "2021", title: "Skipping Stones That Sink Before They're Thrown",
          why: "“Nothin' Wrong” is from this one.",
          links: [{ name: "Bandcamp", mark: "BC",
                    url: "https://hunterrootmusic.bandcamp.com/album/skipping-stones-that-sink-before-theyre-thrown" }] },
        { year: "2023", title: "Arkansas",
          links: [{ name: "Bandcamp", mark: "BC",
                    url: "https://hunterrootmusic.bandcamp.com/album/arkansas" },
                  { name: "His own store", mark: "ST",
                    url: "https://www.hunterroot.com/" }] },
        { year: "—", title: "Chase The Dragon", why: "A 7-inch, and a single.",
          links: [{ name: "Bandcamp", mark: "BC",
                    url: "https://hunterrootmusic.bandcamp.com/track/chase-the-dragon" },
                  { name: "His own store", mark: "ST",
                    url: "https://www.hunterroot.com/" }] },
      ],
      /* [W1] "nine albums" -> what the nine containers actually are. The
         sixteen is unchanged and was re-counted on his Bandcamp catalogue page
         2026-08-05: sixteen releases, three of them albums and the rest
         singles. This is the line that has been quietly contradicting the
         card's "holds itself" for as long as both have been on the glass. */
      /* [R4 2026-08-06] the second clause was the holdings announcement again,
         and this was the copy W1 kept because it was the one CONTRADICTING the
         card's "holds itself". With the card's claim struck there is nothing
         left for it to correct, and what remains is the fact a visitor came for:
         where the rest of the records are. Carsie's note opens the same way. */
      note: "Sixteen releases sit on his own Bandcamp.",
    },
    decks: [
      { title: "Said about him", kind: "quote", cards: [
        /* from the museum's OWN vault (MV-HR-20260707-016). No URL: the
           source is a 2014 print-era piece we hold rather than a live page,
           and inventing a link to stand in for it would be worse than
           saying where it actually came from. */
        { text: "Hunter's vocals channel a pre-needle Cobain with Morrison " +
                "appreciation.",
          who: "Harrison Giza", where: "Blue Harvest Beat", when: "2014",
          eyebrow: "From the museum's own vault" },
      ] },
      { title: "What Hunter said", kind: "quote", cards: [
        { text: "almost the album title. It's the heart of it all.",
          who: "Hunter Root", where: "the museum's own vault", when: "on “’94”",
          eyebrow: "On the song this room opens with" },
        { watch: "yez2aoLYVnw",
          text: "“I Tried”, recorded live in the studio — guitar and vocals, " +
                "nothing else, three weeks before the release.",
          who: "Hunter Root", where: "his own channel", when: "July 2026",
          eyebrow: "Live in studio",
          url: "https://www.youtube.com/watch?v=yez2aoLYVnw" },
        { watch: "zwXHQMsmzQU",
          text: "A song built off a Mark Twain line — the more he learns " +
                "about people.",
          who: "Hunter Root", where: "his own channel", when: "July 2026",
          eyebrow: "Off a Mark Twain line",
          url: "https://www.youtube.com/watch?v=zwXHQMsmzQU" },
      ] },
      /* [CS 2026-08-04] "He is the reason the machinery works" is REMOVED —
         a card on a musician's wall whose whole subject was this website's
         renderers, sourced to "The museum's own record". The deck runs with the
         one card that is about him. */
      { title: "Also", kind: "note", cards: [
        { title: "On the road",
          text: "He was out through July 2026 and said so himself, on his " +
                "own channel, the week it started.",
          who: "hunterroot.com/tour", where: "his own tour page",
          eyebrow: "2026",
          url: "https://www.hunterroot.com/hunterroottour" },
      ] },
    ],
    /* [R4 2026-08-06] "he is our artist and this is our record of him" is
       struck. A sources line is provenance and ships (Doctrine 11); a
       possessive claim inside one is the holdings announcement hiding in the
       one place on the card nobody reads as content. The other three name
       Wikipedia, Bandcamp, a press outlet — where the facts came from, and
       nothing about whose artist anybody is. */
    aboutNote: "Sourced from the museum's own foundation export and his own words in it. The store and the recent uploads were read directly off his own site and his own channel feed, 2026-08-02.",
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
    since: "2026-07-30",
    tag: "jesse_welles",
    name: "Jesse Welles",
    tags: ["wal", "jesse-welles"],
    art: "/images/wal/jesse-welles-cover.jpg",
    plate: "/images/wal/jesse-welles-plate.webp",
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
            { k: "Verified", v: "oEmbed author_url — the upload itself" },
          ],
          /* [CS 2026-08-04] BOTH PARAGRAPHS WERE OUR RESEARCH LOG. "found in
             the very first research pass", "REFUSED for want of proof", "when
             oEmbed finally answered", "the caution turned out to have been right
             twice" — an account of how this museum checked an id, printed as the
             song's interpretive label on a card a visitor reads to learn about
             the song. The `Supplied as` register row went with it for the same
             reason: it recorded a mistake in OUR intake, not a fact about the
             record.
             WHAT REPLACES IT IS SHORT ON PURPOSE. This museum holds very little
             about this particular song, and both facts below are already on this
             page. A short honest label beats a long one about ourselves. */
          label: [
            "One of two of his in this room. It went up on his own channel, " +
            "@hellswelles, which is where his songs land first.",
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
          ],
          label: [
            "Over two hundred thousand views in nine days, which is what his " +
            "habit looks like from the outside: a song about this week, " +
            "posted this week, gone everywhere by the next one.",
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
    siteFn: "Homepage",
    siteScent: "His own place, and a short one — the tour list, an email " +
               "address, and nothing standing between you and either.",
    shop: { label: "Red Star Merch", url: "https://jessewelles.redstarmerch.com/",
      fn: "Shop",
      scent: "The store his own site sends you to." },
    /* [S2 2026-08-05] THE GIFT SHOP TILE'S ADDRESS — Mike's, verified. Rule in
       GiftShop.jsx's `billing()`. His tile used to go straight to Red Star, the
       merch vendor; his own site carries SHOP in its nav and that is where it
       points, read directly 2026-08-05. Same destination, one door earlier, and
       the door is his. `shop` above is untouched — the artist card still names
       Red Star for what it is. */
    shopExit: "https://www.wellesmusic.com/",
    /* [P16 2026-08-02] HE HAS A BANDCAMP, AND NOBODY HAD LOOKED. Read
       directly this round: jessewelles.bandcamp.com carries seven records
       under his own name. It is now the wing's music-library door for him,
       the same as Carsie's. */
    listen: { label: "Bandcamp", url: "https://jessewelles.bandcamp.com",
      fn: "Music library",
      scent: "Seven records, free to play. Through 2025 he sent the download " +
             "profits to No Kid Hungry and the Arkansas Food Bank." },
    tickets: { label: "Tour & tickets", url: "https://www.wellesmusic.com/tour" },
    /* [L1 2026-08-02] CORRECTED, THEN CLOSED. This carried a /channel/UCmb7...
       URL taken from a SEARCH RESULT, and the handle @hellswelles replaced it
       because an unconfirmed equivalence is not a fact.
       THE EQUIVALENCE IS NOW CONFIRMED: @hellswelles' own channel page returns
       externalId UCmb7zAvq9IxHi_UnP93AVSQ — the very id that was held as
       UNVERIFIED. The ledger row moves UNVERIFIED -> OFFICIAL. */
    channel: "https://www.youtube.com/@hellswelles",
    channelLabel: "@hellswelles",
    channelScent: "Where a song about this week goes up, most weeks — usually " +
                  "a man, a guitar and a field.",
    marker: "He writes the news. A man with a guitar in a field, posting songs about this week, most weeks.",
    card: {
      /* [P20] doors on the register: the biography facts point at the article
         that carries them; the records point at his own Bandcamp. The label,
         the award and the nominations carry no door — no page for any of them
         was opened and read this round, and a link nobody checked is a worse
         citation than none. */
      tombstone: [
        { k: "Full name", v: "Jesse Allen Breckenridge Wells",
          url: "https://en.wikipedia.org/wiki/Jesse_Welles", src: "Wikipedia" },
        { k: "Born", v: "22 November 1992, Ozark, Arkansas",
          url: "https://en.wikipedia.org/wiki/Jesse_Welles", src: "Wikipedia" },
        { k: "Also known as", v: "Welles · Jeh Sea Wells · Breck Shipley" },
        { k: "Label", v: "300 Entertainment" },
        { k: "Records", v: "Seven, on his own Bandcamp",
          url: "https://jessewelles.bandcamp.com/music", src: "his own Bandcamp" },
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
      /* [P22] the year-by-year album list is gone; it is now the records
         block below, where each entry is a door. The two sideboxes that
         remain are not discographies — one is chart history, the other is a
         warning. */
      /* [R6] "On the charts" is GONE FROM HERE — see the record board below.
         A sidebox is a boxed aside: "related, but step out of the sentence to
         read it" (the rule at `.vp-box`). Chart history is not an aside on a
         card about a charting artist; it is one of the two or three things a
         fan came to the page for, and it was in a box beside a warning about
         SEO domains. It has a block of its own now and it is not in both. */
      sideboxes: [
        { title: "Two links that are not his",
          lines: ["jessewelles.org", "jessewellestour.com"],
          /* [CS 2026-08-04] the third sentence — "Named here so nobody 'fixes'
             his link to a worse one" — was a note to the next maintainer,
             printed in the box. The warning itself is for the visitor and
             stays. */
          note: "Both rank high. Both are ticket-resale and SEO pages, and neither is his." },
      ],
    },
    /* ===== [R6 2026-08-03] THE RECORD BOARD ================================
       HE IS THE ONE ARTIST IN THE WING WITH REAL CHART HISTORY, and it was
       filed in a SIDEBOX called "On the charts" — a boxed aside, in the same
       register as "Two links that are not his". P22's own note flagged the
       oddity ("one is chart history, the other is a warning") and left it,
       because there was no block for chart history to be. There is now.
       THE SIDEBOX IS RETIRED, NOT COPIED. The three peaks live here and only
       here. Their door is the Wikipedia article this card already cites, and
       the citation is not new: his `aboutNote` declares "Wikipedia for the
       biography, discography, CHARTS AND AWARDS" in as many words.
       DROPPED ON PURPOSE: Kimmel and Colbert. Both are real and both are in
       the biography above; neither carries a DATE anywhere in this repository,
       and a board with a year column is not the place to estimate one. */
    metrics: {
      rows: [
        { kind: "Chart", when: "2025", fact: "“Horses” — US AAA no. 2",
          url: "https://en.wikipedia.org/wiki/Jesse_Welles", src: "Wikipedia" },
        { kind: "Chart", when: "2025", fact: "“Wheel” — US AAA no. 7",
          url: "https://en.wikipedia.org/wiki/Jesse_Welles", src: "Wikipedia" },
        { kind: "Chart", when: "2026",
          fact: "“Won't You Come Out Tonight” — US AAA no. 11",
          url: "https://en.wikipedia.org/wiki/Jesse_Welles", src: "Wikipedia" },
        { kind: "Nominations", when: "2026",
          fact: "Four nominations at the 68th Grammy Awards",
          url: "https://en.wikipedia.org/wiki/Jesse_Welles", src: "Wikipedia" },
        { kind: "Award", when: "2025",
          fact: "Spirit of Americana / Free Speech Award",
          url: "https://en.wikipedia.org/wiki/Jesse_Welles", src: "Wikipedia" },
        { kind: "Billing", when: "Sept 2024",
          fact: "Farm Aid, introduced by Dave Matthews" },
        { kind: "Label", when: "current", fact: "300 Entertainment" },
      ],
      note: "No certification is documented for him in this museum's sources. " +
            "The Farm Aid billing is carried from the coverage this card " +
            "cites and has no single readable page to point at.",
    },
    /* [P16] slugs read off his own Bandcamp catalogue page, 2026-08-02. */
    records: {
      title: "The records, and where to get them",
      items: [
        { year: "2024", title: "Hells Welles", why: "The first under his own name after the turn.",
          links: [{ name: "Bandcamp", mark: "BC",
                    url: "https://jessewelles.bandcamp.com/album/hells-welles" }] },
        { year: "2024", title: "Patchwork",
          links: [{ name: "Bandcamp", mark: "BC",
                    url: "https://jessewelles.bandcamp.com/album/patchwork" }] },
        { year: "2025", title: "Middle", why: "The one where he mostly stops writing the news.",
          links: [{ name: "Bandcamp", mark: "BC",
                    url: "https://jessewelles.bandcamp.com/album/middle" }] },
        { year: "2025", title: "Pilgrim",
          links: [{ name: "Bandcamp", mark: "BC",
                    url: "https://jessewelles.bandcamp.com/album/pilgrim" }] },
        { year: "2025", title: "Devil's Den",
          links: [{ name: "Bandcamp", mark: "BC",
                    url: "https://jessewelles.bandcamp.com/album/devils-den" }] },
      ],
      note: "Seven sit on his own Bandcamp. Eight more exist as Jeh Sea Wells, " +
            "between 2012 and 2018, and the Under the Powerlines records are " +
            "dated by the months they cover.",
    },
    decks: [
      { title: "Said about him", kind: "quote", cards: [
        { text: "Sings out for truth and justice",
          who: "PopMatters", where: "on the 2025 shows", when: "2025",
          eyebrow: "Live",
          url: "https://www.popmatters.com/jesse-welles-concert-2025" },
        { text: "Mostly shuns topical songs for the abstract",
          who: "Glide Magazine", where: "album review", when: "2025",
          eyebrow: "on Middle",
          url: "https://glidemagazine.com/310137/rising-folk-artist-jesse-welles-mostly-shuns-topical-songs-for-the-abstract-on-middle-album-review/" },
      ] },
      { title: "What Jesse said", kind: "quote", cards: [
        { text: "through the end of this year (2025) all profits from " +
                "downloads on bandcamp will be donated to No Kid Hungry and " +
                "Arkansas Food Bank",
          who: "Jesse Welles", where: "his own Bandcamp", when: "read 2026",
          eyebrow: "Where the money went",
          url: "https://jessewelles.bandcamp.com" },
        { watch: "s9FBnLxcqqw",
          text: "There's A Hole — written about that week, posted that week, " +
                "two hundred thousand views in nine days.",
          who: "Jesse Welles", where: "his own channel", when: "July 2026",
          eyebrow: "The habit, in one upload",
          url: "https://www.youtube.com/watch?v=s9FBnLxcqqw" },
      ] },
      { title: "Also", kind: "note", cards: [
        { title: "He gave the downloads away",
          text: "For a whole year the profit from every Bandcamp download " +
                "went to two food charities instead of to him. It is on his " +
                "own store page, in his own lower case.",
          who: "jessewelles.bandcamp.com", where: "read 2026",
          eyebrow: "2025",
          url: "https://jessewelles.bandcamp.com" },
        { title: "A whole earlier catalogue",
          text: "Eight records exist as Jeh Sea Wells between 2012 and 2018, " +
                "plus two bands — Dead Indian and Cosmic-American — before " +
                "anyone was calling him a folk singer.",
          who: "Wikipedia", where: "read 2026",
          eyebrow: "2012–2018",
          url: "https://en.wikipedia.org/wiki/Jesse_Welles" },
      ] },
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
    since: "2026-07-30",
    tag: "mikey_mike",
    name: "Mikey Mike",
    tags: ["wal", "mikey-mike"],
    art: "/images/wal/mikey-mike-cover.jpg",
    /* [F1 2026-08-03] see the note on Hunter Root's plate above. This one is
       the better half of the same fix: the provenance log records this file as
       "his channel portrait — porch cam still, cigarette, wagon of records; his
       own chosen public face", so the artist card opens on a PORTRAIT of the
       artist, which is what the block was always for. */
    plate: "/images/wal/mikey-mike-cover.jpg",
    plateCaption: "His own channel portrait.",
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
    /* ***** [P11 2026-08-05] M54 CLOSES: THE DOMAIN IS ON THE CARD.
       MIKE: "Mikey Mike's verified domain (weekendatmikeys.com) is wired in the
       shop but not on his card; put it on the card."
       AND IT IS DONE BY ADDING A DOOR RATHER THAN BY MOVING ONE. The template
       already carries both kinds — `site` is the artist's own place and
       `channel` is their video channel, and `doorsFor` has drawn them as two
       doors since P15. He was the one artist in this wing whose HOMEPAGE door
       was a YouTube channel, which is why the gift shop tile had to be fixed
       separately at S2 and why this row was left open rather than absorbed.
       SO THE CHANNEL KEEPS ITS PLACE AND KEEPS ITS PROVENANCE. The oEmbed
       verification (L1) is the unfakeable anchor for BOTH doors — it is what
       ties @findmikeymike to him, and weekendatmikeys.com's own Instagram is
       that same handle, which is how S2 identified the site. Neither claim is
       weakened by the other; the card now shows the two surfaces it has always
       been able to prove.
       R-A'S REFUSAL OF findmikeymike.com IS UNTOUCHED. Different address, and
       `siteNote` below still says so. ***** */
    site: "https://weekendatmikeys.com/",
    siteLabel: "weekendatmikeys.com",
    siteFn: "Homepage",
    siteScent: "His own place — The Family Ranch, out of Nashville. Read " +
               "directly before it was linked from anywhere in this museum.",
    channel: "https://www.youtube.com/@findmikeymike",
    channelLabel: "@findmikeymike",
    channelScent: "Verified from the upload itself rather than from a search " +
                  "ranking, which matters more for him than for anyone else " +
                  "here — several unrelated acts share the name. Everything he " +
                  "puts out lands here first.",
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
    /* ***** [S2 2026-08-05] HE HAS A CLEAN DOMAIN NOW, AND IT IS NOT THE ONE
       R-a REFUSED. Mike supplied weekendatmikeys.com. READ IT AS A DIFFERENT
       ADDRESS, because it is one: R-a's refusal above stands, unchanged and
       unreversed, and findmikeymike.com is still linked from nowhere.
       WHAT WAS CHECKED BEFORE WIRING IT, 2026-08-05:
         · it resolves, and it is HIS — the site is "The Family Ranch", the
           heading is STEP INTO THE WORLD OF MIKEY MIKE, Nashville TN;
         · the identity ties back to the one surface this wing had already
           verified the unfakeable way: the site's Instagram is @findmikeymike,
           which is the handle of the YouTube channel L1 confirmed by oEmbed
           from his own upload;
         · it is named as his in the music press independently of the site;
         · and the thing that shut the other door — NO injected link farm. The
           page body was read directly for it; there are no gambling domains and
           no unrelated restaurant or veterinary sites.
       IT WAS DECLARED ONLY FOR THE GIFT SHOP TILE, which is what Mike named at
       the time. [P11 2026-08-05] HE HAS SINCE RULED THAT IT GOES ON THE CARD
       TOO — see the `site` block above, where it is now the homepage door and
       the video channel keeps a door of its own. M54 closes. ***** */
    shopExit: "https://weekendatmikeys.com/",
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
      /* [CS 2026-08-04] the opening paragraph was about this wing's own build
         history — "the thinnest entry in this wing when it opened … that has
         changed, and this card is what changed" — which tells a visitor about
         our revisions and nothing about him. The two paragraphs that follow are
         his, and they now open the card. */
      label: [
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
      /* [P22] the ten-line release list is gone with the other
         discographies. What remains are the two boxes that were never
         catalogues — a person, and a week on the road. */
      /* [R6] the sell-out moved to the record board; what is left in the box is
         the WEEK — a route and a song played before it existed, which is a
         story about a man on the road and not a metric. */
      sideboxes: [
        { title: "September 2019",
          lines: ["Germany, then Sweden, then London",
                  "The Waiting Room, on the 20th",
                  "He played “Amazon Prime” before it was released"] },
      ],
    },
    /* ===== [R6 2026-08-03] THE RECORD BOARD ================================
       MIKE NAMED THIS ONE AS THE MODEL: "notable syncs (Mikey Mike's Canon
       placement is the model)". It is the model because it is the exact shape
       the brief is after — a third party put the record somewhere, it is
       written down, and it is still true. It is also the single most
       interesting line about him and it was buried in the middle of a
       biography paragraph.
       NO CHART, NO CERTIFICATION, and the block says so. He is the artist this
       wing has already had to be honest about twice (no verifiable store, a
       compromised domain), and this is the third time — same doctrine, same
       words: an empty shelf with a label on it is the honest object. */
    metrics: {
      rows: [
        { kind: "Sync", when: "2017",
          fact: "Canon, “Live for the Story: Boundaries” — the advert most people met him through",
          url: "https://www.fadedglamour.co.uk/2017/06/listen-mikey-mike-doin-me-canon-advert-song.html",
          src: "Faded Glamour" },
        { kind: "Credit", when: "2017",
          fact: "Debut single “Doin' Me”, produced by Rick Rubin",
          url: "https://www.fadedglamour.co.uk/2017/06/listen-mikey-mike-doin-me-canon-advert-song.html",
          src: "Faded Glamour" },
        { kind: "Credit", when: "2012",
          fact: "Co-producer on Rihanna's Unapologetic",
          url: "https://www.fadedglamour.co.uk/2017/06/listen-mikey-mike-doin-me-canon-advert-song.html",
          src: "Faded Glamour" },
        { kind: "Publishing", when: "before 2017",
          fact: "Signed to Universal's publishing arm for several years",
          url: "https://www.fadedglamour.co.uk/2017/06/listen-mikey-mike-doin-me-canon-advert-song.html",
          src: "Faded Glamour" },
        { kind: "Billing", when: "Sept 2019",
          fact: "The Waiting Room, London — sold out in about five days",
          src: "a 2020 Titusville interview, held in print" },
      ],
      note: "No chart entry and no certification is documented for him in this " +
            "museum's sources. The London date's source is a print interview " +
            "with no live page.",
    },
    /* [P16] THE ONE ARTIST WITH NO DOOR TO GIVE, AND THE BLOCK SAYS SO.
       Checked this round and all three came back empty-handed:
         · mikeymike.bandcamp.com — 404, no such page;
         · findmikeymike.com — his, and serving injected spam (see the ledger
           above), so it stays unlinked for the reason recorded there;
         · no store of any kind is named on any surface confirmed to be his.
       So he gets a records block with a note and no doors, rather than
       inventing a streaming link nobody verified. An empty shelf with a
       label on it is the honest object; a shelf that is simply absent reads
       as an oversight. */
    records: {
      title: "The records",
      note: "No catalogue page and no store could be verified as his this " +
            "round — his Bandcamp does not exist, and the domain he does own " +
            "is currently serving injected spam, so this museum will not send " +
            "you there. His own channel is the one surface confirmed to be " +
            "his, and it is the door at the foot of this card.",
    },
    decks: [
      { title: "Said about him", kind: "quote", cards: [
        { text: "pleasingly minimal",
          who: "Faded Glamour", where: "on Rick Rubin's production", when: "June 2017",
          eyebrow: "on “Doin' Me”",
          url: "https://www.fadedglamour.co.uk/2017/06/listen-mikey-mike-doin-me-canon-advert-song.html" },
        { text: "relatively unknown",
          who: "Faded Glamour", where: "while signed to Universal", when: "June 2017",
          eyebrow: "on the years before the advert",
          url: "https://www.fadedglamour.co.uk/2017/06/listen-mikey-mike-doin-me-canon-advert-song.html" },
      ] },
      { title: "What Mikey said", kind: "quote", cards: [
        /* no live page: the source is a 2020 Titusville interview held in
           print. Attributed, unlinked, and honest about which. */
        { text: "I knew I had to be a part of it.",
          who: "Mikey Mike", where: "a 2020 interview", when: "on watching his uncles play",
          eyebrow: "On starting" },
        { watch: "WsXUv-ri9fk",
          text: "Something Rick Rubin told him that he says he will never " +
                "forget — told in his own voice, on his own channel.",
          who: "Mikey Mike", where: "his own channel", when: "May 2025",
          eyebrow: "On Rick Rubin",
          url: "https://www.youtube.com/watch?v=WsXUv-ri9fk" },
      ] },
      { title: "Also", kind: "note", cards: [
        { title: "Little Lisa",
          text: "His elderly Vietnamese neighbour, whom he calls his adopted " +
                "grandmother. She has a song named after her from 2020, and a " +
                "feature credit on one from 2023.",
          who: "Apple Music and Deezer", where: "read 2026",
          eyebrow: "A neighbour, twice on the record" },
        { title: "Life on Earth",
          text: "He has said the whole catalogue is ONE album, released in " +
                "volumes across his life and finished only when he is. Two " +
                "volumes exist so far.",
          who: "Indie Pulse Music", where: "2018",
          eyebrow: "One record, released slowly",
          url: "https://indiepulsemusic.com/2018/11/04/mikey-mike-life-on-earth/" },
        { title: "He co-produced on Unapologetic",
          text: "Rihanna's 2012 album — the one that also carried David " +
                "Guetta and Stargate. He was at Universal's publishing arm " +
                "for years around it.",
          who: "Faded Glamour", where: "June 2017",
          eyebrow: "Before anybody knew the name",
          url: "https://www.fadedglamour.co.uk/2017/06/listen-mikey-mike-doin-me-canon-advert-song.html" },
      ] },
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
   "only where they exist" needs no conditional at the call site.
   [W10] The `kind` chips died with the old row names: the categories are
   honest nouns now and a mono label repeating them was noise. */

function songTrack(a, s) {
  return {
    id: a.id + "-song-" + s.slug,
    title: s.title,
    song: s.slug,                       /* the fact vault's first-meet tier */
    tags: [...a.tags, "song"],
    videos: s.ytId ? [{ ytId: s.ytId, label: s.title, type: "official" }] : [],
  };
}

/* [F1 2026-08-02] THE DOORS OUT — now the closing block of About the Artist.
   "E. D. Yadah" is DEAD: it was one of MIKE'S OWN SONG TITLES used as an
   example row name, mistaken last round for a category (the interpretation
   flag did its job — the flag was raised, Mike ruled, the row died). The
   doors it carried were real, so they rehome where they always belonged: at
   the foot of the artist's own card, after you have met them. Each door
   appears only where the thing exists, which has always been the template's
   law. The tour door stays on "What they are up to" — where they are playing
   is that face's half of the story. */
/* [P15 2026-08-02] THE DOORS SAY WHAT THEY ARE, AND THEY SAY IT TWICE.
   MIKE: "the redundancy sells the point — the four doors read well as
   Name+function pairs (Homepage / Shop and Tours / Music Library / Video
   Channel). Keep the pattern, fill the descriptors properly."
   So every door now carries three things and each does a different job:
     `label` — WHOSE it is. The name a visitor would recognise or type.
     `fn`    — WHAT it is. The four functions above, in the museum's own
               words, so four doors to four different kinds of place never
               read as four ways of saying "link".
     `scent` — WHY it is worth the click, written for THIS artist rather than
               stamped from a template. The generic lines ("Their own store.")
               were the placeholders Mike was pointing at: technically true,
               and they told a visitor nothing they had not already read in
               the label above them.
   [P21] AND THE BANDCAMP LINE STOPS SHOUTING. Mike: "too brash." It read
   "Where to hear it without paying an advertiser for the privilege" — an
   argument with the streaming industry, staged on someone else's card. The
   museum's job on this door is to say what is behind it: the catalogue, free
   to play, and the money goes to them. That is the same fact without the
   sneer, and it is more useful. */
function doorsFor(a) {
  const trail = [];
  if (a.site) trail.push({ label: a.siteLabel || a.site, url: a.site,
    fn: a.siteFn || "Homepage",
    scent: a.siteScent || "The artist's own place." });
  if (a.listen) trail.push({ label: a.listen.label, url: a.listen.url,
    fn: a.listen.fn || "Music library",
    scent: a.listen.scent || "The catalogue, free to play, paid straight to them." });
  if (a.shop) trail.push({ label: a.shop.label, url: a.shop.url,
    fn: a.shop.fn || "Shop",
    scent: a.shop.scent || "Records and merch, sold by them." });
  if (a.channel && a.channel !== a.site) trail.push({ label: a.channelLabel || "Their channel",
    url: a.channel, fn: "Video channel",
    scent: a.channelScent || "Where the songs land first — verified from their own uploads." });
  return trail.length ? trail : undefined;
}

/* ═══ [C4 2026-08-06] "ABOUT THE SONGS" IS BURNED DOWN ══════════════════════
   MIKE: "'ABOUT THE SONGS' IS REPETITIVE - burn it down, discard."
   He is describing the face's own shape rather than its writing. It printed one
   numbered paragraph per song under the song's own YouTube poster — beneath a
   tracklist in which those same two songs are the first two rows, each already
   carrying its title and its rendition, and beside an ABOUT THE ARTIST card that
   says what the artist does. Two songs is not enough material for a page about
   the songs; it is a second listing of the tracklist with a sentence attached.
   `aboutSongsTrack` and its call are DELETED. The builder is gone rather than
   left uncalled, because an uncalled builder is one data edit from returning.
   WHAT THIS COSTS, NAMED RATHER THAN ABSORBED: each song's `card.label` — the
   authored paragraph about that song — is now rendered by nothing. The DATA
   stays where it is, because those paragraphs are written work and deleting
   them is Mike's call rather than a consequence of deleting a container; the
   `card.tombstone`s stay for the reason this file already gives (they are the
   verification record — the accession ids and the oEmbed checks — and were
   never furniture). Both are register row V-B: re-home the song copy, or strike
   it. Until he rules, nothing in `src/` prints it. */

/* ABOUT THE ARTIST — the museum card: tombstone (the factual register),
   interpretive label (what they are doing here), sideboxes, and the TWO
   honest questions. [W5] The where-does-the-money-go block is DEAD in this
   room — it was the wrong stage for it; it lives in W.B's own FAQ at /booth.
   [W8] The plate is the artist's own public imagery, in color. */
function aboutArtistTrack(a) {
  return {
    id: a.id + "-about-artist",
    unnumbered: true,      /* a category, not a track — consumes no number */
    /* [C1 2026-08-06] sentence case, with the rest of the category rows. */
    title: "About the artist",
    tags: [...a.tags, "about", "faq"],
    videos: [],
    face: {
      kind: "text",
      title: "About the artist",
      subtitle: a.name.toUpperCase(),
      /* [TRAIL-MARKER LAW] the blurb is the ONE thing about this artist worth
         carrying out of the building - not a summary of them. */
      blurb: a.marker,
      still: a.plate || undefined,
      stillCaption: a.plate ? a.plateCaption : undefined,
      tombstone: a.card.tombstone,
      /* [R6 2026-08-03] THE RECORD BOARD, between the register and the shelf,
         and the position is the argument. The register says what this artist
         IS; the board says what a third party wrote down that they DID; the
         shelf says where to go and hear it. That is the order a fan reads in —
         who, then what they have done, then how to get it — and it is why the
         board is not appended at the bottom with the provenance notes.
         `metrics` is optional like everything else on a face: an artist that
         declares none renders none, and the block is not drawn empty. */
      metrics: a.metrics,
      label: a.card.label,
      sideboxes: a.card.sideboxes,
      /* [P16/P22 2026-08-02] THE DISCOGRAPHY DIED AND THE RECORDS GOT DOORS.
         Two of Mike's notes land on the same block and they only look like
         they disagree. "DISCOGRAPHY: remove from the artist page — doesn't
         deserve the space here" was aimed at what was there: twelve ruled
         lines of year-and-title that a visitor could read, learn nothing
         actionable from, and not click. "RECORDS: every record needs LINKS TO
         THE ALBUM as ICONS, the platforms that actually carry it, verified"
         is what a record on a museum wall is FOR — it is an object you can go
         and get.
         So the complete list is gone and what remains are the records this
         page actually names — the songs' own albums, and the latest — each
         one a door to the platform that carries it, verified by reading that
         platform's own catalogue page. The rest of the catalogue is one press
         away behind the music-library door, which is where a complete
         discography belongs. */
      records: a.records,
      /* [P17/P18/P19 2026-08-02] THE THREE DECKS OF CARDS.
         `Said about her` was a sidebox of run-on lines and Mike wanted three
         things from it: the link to the source enabled, the formatting
         rebuilt as post-its / museum cards / embeds, and MORE of it. It is
         now one of three decks that share one renderer, because all three are
         the same object — a short thing somebody said, and where they said
         it:
           · SAID ABOUT THEM  — the press, quoted and linked (P17)
           · IN THEIR OWN WORDS — the artist, quoted and linked (P18)
           · ALSO — the work that is not the records (P19)
         Every card carries a real source and a real URL, and no card exists
         without one; a quote whose source could not be read is not on the
         wall. */
      decks: a.decks,
      /* [P14 2026-08-02] THE TWO HONEST QUESTIONS LEAVE THE ARTIST'S CARD.
         MIKE: "REMOVE from all individual artist pages — Mike handles it at
         FAQ — the 'Why is this artist in the museum?' block and the 'Is
         Weird.Baby affiliated?' block. They go; the FAQ owns that ground."
         He is right that they are HOUSE questions, not artist facts: the
         answers were byte-identical on all four cards, which is the tell that
         they belonged to the building rather than to the person. Answering
         them four times also put the museum's throat-clearing between a
         visitor and the artist's own doors. The ground is the Information
         Booth's, and the wing's own first album already tells a visitor what
         the standard is before they meet anybody. */
      entriesMode: "list",
      /* [F1] the doors out close the card — site, listen, store, channel —
         after the visitor has met the person the doors belong to. */
      trail: doorsFor(a),
      lines: a.siteNote ? ["NOTE     " + a.siteNote] : undefined,
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
    /* [C1 2026-08-06] IT IS A QUESTION NOW, AND THE ROW TITLES TAKE ONE CASE.
       MIKE: "'What they are up to' becomes 'WHAT ARE THEY UP TO?' — and fix the
       sentence case in every place that pattern appears."
       THE SECOND HALF IS THE STRUCTURAL ONE. An artist album's category rows
       read "About the Songs", "About the Artist", "What they are up to" — two
       Title Case and one sentence case, in a column three rows deep where a
       visitor sees all three at once. The house's own rooms are sentence case
       already (/wal "About our current artists", "The deal"; /foundation "The
       account", "The ledger", "The register"), so sentence case is the
       convention and Title Case was the drift. */
    title: "What are they up to?",
    tags: [...a.tags, "feed"],
    videos: [],
    face: {
      kind: "text",
      title: "What are they up to?",
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
      /* [C2 2026-08-06] REDUCED TO THE WALL. Mike: "REDUCE THE PAGE TO THE
         TILES."
         WHAT WENT: the "Showing" row, which counted the tiles printed
         underneath it — the page is that count, and a page that states its own
         length is the class of line Doctrine 16 exists for.
         WHAT STAYED, AND WHY IT IS NOT THE SAME KIND OF THING: the SOURCE row.
         A dated snapshot of somebody else's feed is provenance, and provenance
         is the thing Doctrine 11 names explicitly as passing — "a sources line,
         a citation, an accession number: a museum prints those". It is also the
         only line on the page that stops an undated wall reading as live.
         AND THE TOUR DOOR STAYED. It is a door to the artist's own place, which
         is this wing's whole posture ("every door leads out"), and it is the one
         thing on this page that is not a YouTube tile — see C2's own question,
         answered in the round log: every tile in every wall on every artist page
         in this wing is a YouTube thumbnail opening a YouTube watch page. There
         are no others. */
      tombstone: [
        { k: "Source", v: "Their own channel feed, read 2 August 2026" },
      ],
      footer: "WORTH A LISTEN · " + a.name,
    },
  };
}

/* the tracklist, in Mike's corrected order (F1). */
function tracksFor(a) {
  const out = [];
  a.songs.forEach(s => out.push(songTrack(a, s)));
  /* [C4] `aboutSongsTrack(a)` was here. */
  out.push(aboutArtistTrack(a));
  out.push(upToTrack(a));
  return out.filter(Boolean);
}

/* [R5b 2026-08-03] THE BILL'S ACTS ARE READ OFF `ARTISTS`, NOT RETYPED.
   A poster that lists its own acts from a second copy of the line-up is a
   poster that goes out of date silently — the wing gains an artist, the bill
   does not, and nothing anywhere reports it. So the promotional copy is the
   only thing authored per act; the NAME, the ALBUM ID the press navigates to,
   and the PICTURE are all read from the same entry the coverflow is built
   from. An id that names nobody drops out of the bill rather than rendering a
   dead panel, and the throw is loud rather than silent because a bill missing
   an artist is a content defect and should not be discovered by a visitor.
   The running order is the ORDER GIVEN, not the array's: a poster's order is a
   billing decision, and this one is Mike's. */
/* [V2 2026-08-06] AND EACH ACT NOW CARRIES A `pick` — ONE SENTENCE, MIKE'S.
   His instruction: "each artist again but LARGER, carrying a 'why they are
   here' note: 2-3 sentences of substance (Ops writes, from verified facts) and
   ONE SENTENCE on why Mike picked them ([PAPA] - Mike writes, leave the slot)."
   `why` IS ALREADY THE FIRST HALF and not one word of it is new: two sourced
   sentences per act, every clause carried on that artist's own card, which is
   what "from verified facts" asks for and what this file's own notes document
   claim by claim. Writing a third sentence to reach "2-3" would be Doctrine 12
   with a word count as its excuse.
   `pick` IS THE SECOND HALF AND IT IS A SLOT. It is marked in its only
   sentence, so `scrubBill` empties it and the poster prints nothing where it
   sits — there is no placeholder, no dash, no "coming". The four sentences are
   his and the museum does not guess at why he picked anybody. */
function billActs(copy) {
  return copy.map(c => {
    const a = ARTISTS.find(x => x.id === c.id);
    if (!a) throw new Error("billActs: no artist with id " + c.id);
    return { album: a.id, name: a.name, art: a.art,
             what: c.what, why: c.why, pick: c.pick, hue: c.hue };
  });
}

/* ===== [F7a 2026-08-02] THE HOUSE ALBUM — the wing explains itself ==========
   Mike's banked note, built: WAL gets a FIRST ALBUM whose subject is the room
   — what it is and its place in the museum. It sits first in the coverflow
   and the wing LANDS on it, so a visitor who walks in cold is told where they
   are before they are asked to click anything. House voice throughout, [PAPA]
   on every word that is Mike's to say.
   THE COVER IS THE HOUSE'S OWN and deliberately not an artist photo: the
   frame may introduce itself in the frame's voice — paper ground, house
   type — precisely because everywhere else the artists bring the color. */
/* [A3 2026-08-06] THE HOUSE CARD IS A REAL COVER NOW, ON THE ROBOTS TEMPLATE.
   MIKE: "make the robots gray album art the Weird.Baby gray album standard and
   replace every equivalent … and anywhere else carrying Weird.Baby's own art."
   This was an inline SVG data URI drawing WORTH / A / LISTEN on the museum's
   paper — and the museum's paper is `--wb-bg`, which is also the carousel's own
   ground, so the card had nothing to show but its keyline and dissolved at the
   rack's edge. It is `tools/make_house_covers.py`'s output now: same square,
   same border, same Georgia setting, same rule, same strapline, and the mark,
   which is the thing that fills it with ink.
   ITS OTHER JOB IS UNCHANGED. F1 put this card on THE DEAL as that face's
   visual hook ("the one piece of imagery in this wing the house made rather
   than borrowed"), and it is still that — a better one. */
const HOUSE_COVER = "/images/wal/worth-a-listen-cover.png";

const HOUSE_ALBUM = {
  id: "worth-a-listen",
  title: "Worth A Listen",
  tag: "worth_a_listen",
  year: null,
  tags: ["wal", "house"],
  art: HOUSE_COVER,
  accent: null,
  viewerPoster: null,
  /* ===== [F2 2026-08-03] THE BILL GOES FIRST ==============================
     MIKE: "'About the Artists' moves to POSITION ONE."
     THIS IS THE FIRST THING ANYBODY SEES IN THIS WING. `defaultActiveIndex: 0`
     lands on the house album and the room opens on its first track, so
     whatever sits here is the museum's answer to a stranger who has walked in
     off the street. Until now that was ~280 words of house prose, which is the
     VISUAL HOOK LAW's exact failure case (F1, this round): land on words alone
     and the visitor probably walks out.
     THE BILL IS THE OPPOSITE OF THAT AND IT ALREADY EXISTED. Four artists,
     four album covers, in the artists' own colour, each one a door — R5b built
     it and put it second. Reordering is the whole fix: nothing new is drawn,
     nothing is invented, and the room now opens on faces instead of on an
     essay about itself.
     AND THE ORDER STILL READS AS AN ARGUMENT. Page one is WHO IS HERE; page
     two is THE DEAL — what the room is, what it costs, where the doors go. A
     stranger meets the acts and then reads the terms, which is the order a
     poster and a ticket come in, and the reverse of the order a museum's
     instinct puts them in. */
  tracks: [
    {
      id: "wal-house-place",
      unnumbered: true,   /* the room's own pages are not songs */
      /* ===== [R5b 2026-08-03] "ITS PLACE IN THE MUSEUM" IS KILLED ============
         MIKE: it was "never meant literally". He is right, and the page proved
         him right by having nothing to do: it was a single paragraph of the
         museum explaining its own filing system to a visitor who came to hear
         music. A room's place in a building is an ARCHITECT'S fact. It is not a
         thing anybody standing in the room needs told, and F7a's own note gives
         the game away — the album was scoped as "what it is AND its place in
         the museum", two subjects, and the first one is the whole job.
         WHAT REPLACES IT IS THE POSTER FOR THE SHOW. Mike's spec, verbatim:
         "ABOUT OUR CURRENT ARTISTS: a one-page POSTER for the complete show —
         functionally a poster, not a literal image: the top-level details that
         PROMOTE the show. Serious and respectful, energetic, WEIRD.BABY IN FULL
         COLORS. All four artists, what they are, why they're here, the
         standard."
         SO THE SECOND HOUSE PAGE STOPS BEING ABOUT THE HOUSE. Page one is the
         welcome; page two is the BILL. Between them a stranger who walks in
         cold gets what the room is and who is in it, in that order, before
         being asked to press anything — which is F7a's whole reason for the
         house album existing, finally spent on something a visitor wants.
         THE ACTS ARE BUILT FROM `ARTISTS`, NOT RETYPED. Name, album id and
         picture are read off the same entries the coverflow is built from, so
         the poster cannot advertise an artist the room does not contain or show
         a picture the wing has stopped using. Only the promotional copy — what
         they are, why they are here, and the house accent — is authored, and
         every claim in it is already carried, sourced, on that artist's own
         card. NOT ONE NEW FACT ABOUT ANY OF THEM ENTERS THE BUILDING HERE. */
      title: "About the Artists",
      tags: ["wal", "house", "about"],
      videos: [],
      face: {
        kind: "text",
        title: "About the Artists",
        subtitle: "WORTH A LISTEN",
        /* [V1 2026-08-06] THE BLURB IS STRUCK, on Mike's ruling. "Four of them.
           Two songs each, all playable. Every one of them is somebody's
           favourite record and none of them is ours." — the third clause is the
           room's own curation posture stated out loud, which is the sentence
           W1a struck from the label on this same face and the one M52 flagged
           for sitting above a panel that says the museum holds his records; the
           first two are a COUNT of what is on the page, which the page itself
           is. The render path for `blurb` is untouched and conditional; the
           field is simply not declared, the way `standard`, `foot` and `label`
           are not. The poster opens on the acts, which is what a poster does.
           MIKE'S SECOND STRIKE IS NOT IN THIS REPOSITORY. "Artists that command
           Weird.Baby's respect and deserve your awareness." appears nowhere in
           `src/` or `index.html` — searched for the whole sentence and for
           "respect", "deserve" and "awareness" separately. It is not struck
           here because there is nothing here to strike, and the honest report is
           that rather than a nearby sentence removed and reported as his.
           OPEN_ACTIONS V-A. */
        bill: {
          /* [W1b 2026-08-05] THE STANDARD LINE IS STRUCK, on Mike's ruling.
             "The standard in this room is not chart position and not how many
             people already know. It is that somebody in this house could not
             stop playing the record and thinks you should hear it." — the
             museum congratulating itself on its own selection criteria. The
             render path for `bill.standard` is untouched and conditional; the
             field is simply not declared. */
          acts: billActs([
            { id: "carsie-blanton",
              what: "Songwriter · Philadelphia",
              /* every clause below is on her own card, sourced: the twenty
                 years and the twelve independent records in the register, the
                 2026 Folk Alliance award (with her own upload of the speech as
                 the door), and the marker line itself. */
              why: "Twenty years of touring, twelve records and every one of " +
                   "them independent, and an Artist of the Year award she tied " +
                   "for in 2026. She writes protest songs you can dance to.",
              pick: "[PAPA] — one sentence on why Mike picked this artist.",
              hue: "#f79ac4" },
            { id: "jesse-welles",
              what: "Songwriter · Arkansas",
              why: "A song about this week, written this week, posted most " +
                   "weeks — usually a man, a guitar and a field. Four Grammy " +
                   "nominations at the 68th for doing exactly that.",
              pick: "[PAPA] — one sentence on why Mike picked this artist.",
              hue: "#9ccf7a" },
            { id: "mikey-mike",
              what: "Songwriter and producer · Los Angeles",
              why: "A debut single produced by Rick Rubin that reached most " +
                   "people through a Canon advert. You have almost certainly " +
                   "heard him without ever learning his name.",
              pick: "[PAPA] — one sentence on why Mike picked this artist.",
              hue: "#e8b45c" },
            /* [CS 2026-08-04] his billing on the poster advertised the SITE
               ("his catalogue taught this museum's machinery every pattern the
               other wings inherited"). The other three acts are billed on what
               they have made; he is now billed the same way, from the facts on
               his own card. */
            /* [W2 2026-08-05] REWRITTEN FROM THE VAULT, NOT FROM THE OLD LINE.
               Mike: discard it and start from what is TRUE and verifiable, and
               verify every figure. The old line carried two wrong ones.
               · "seventy-eight songs" counted the track rows that carry a
                 `song:` slug. The vault's own tracklists carry NINETY-THREE,
                 and the fifteen it silently dropped are the whole of Run With
                 The Hunt, which has no slugs on it.
               · "nine records" counted the nine album CONTAINERS, of which one
                 is an EP by its own title (Phone Recordings EP) and one is a
                 set by its own title (SINGLES & RARITIES). Seven are records.
               · "whose whole catalogue this museum holds" is contradicted by
                 this wing's own records note four hundred lines up — sixteen
                 releases sit on his Bandcamp against nine entries in the vault.
                 "Whole" is gone; what is held is named instead.
               · "Half of Crooked Home is about his brother" is NOT here, and
                 not because it is uninteresting: the vault does not carry the
                 half. It carries the dedication, the grief, '94 and My
                 Brother's Bones. The quantity is somebody's paraphrase and it
                 is still printed on three other faces — reported, not
                 silently patched from here (OPEN_ACTIONS W-A).
               COUNTED FROM src/data/exhibits/hunter_root.json, the museum's own
               export, this round: 9 album containers, 93 track rows, every one
               of them carrying at least one playable rendition.
                 records  Run With The Hunt · They Finally Cracked Me · Life
                          Inside A Wheel · Mimicking the Sun Like Dandelions ·
                          Skipping Stones That Sink Before They're Thrown ·
                          Arkansas · Crooked Home
                 EP       Phone Recordings EP
                 set      SINGLES & RARITIES
               Run With The Hunt is a RECORD and not a band, which is the one
               thing here that had to be looked up rather than assumed: its
               ReverbNation page reads like a band's, and the vault's own fact
               MV-HR-20260707-004 settles it — "Run With The Hunt was Hunter's
               first solo record." His band was SEEDS, which became Medusa's
               Disco (MV-HR-20260707-003), and no track of theirs is in here. */
            /* ═══ [R4 2026-08-06] BILLED LIKE THE OTHER THREE, WHICH IS THE
               WHOLE OF THE INSTRUCTION. Mike: "delete the holdings sentence
               entirely, everywhere… all four artists become identical."
               WHAT WENT. `what` read "Songwriter · the house artist" against
               "Songwriter · Philadelphia", "Songwriter · Arkansas",
               "Songwriter and producer · Los Angeles" — three roles-and-places
               and one STATUS. `why` was the holdings sentence in its second
               wording, which is the M69 pair: strike the announcement and the
               pair resolves by there being one sentence left, not two.
               THE PLACE IS HIS OWN BANDCAMP'S, AND IT TOOK THE R7 RESEARCH TO
               FIND IT. `what` was drafted as bare "Songwriter" because the only
               location fact in this repository is his own words to Whiskey Riff
               (MV-HR-20260707-035) — "I am Pennsylvania raised but I was born in
               Fayetteville, Arkansas" — and RAISED is not BASED, while printing
               "Arkansas" would put the same word under two of the four acts.
               Reading hunterrootmusic.bandcamp.com for R7 settled it in one
               line: his own artist bio there says "Solo artist/musician from
               Lancaster, PA". That is the same class of source Carsie's
               "Philadelphia" and Jesse's "Arkansas" stand on, and it is his own
               page rather than a third party's.
               THE NEW `why` INTRODUCES NO FACT TO THIS WING. Both halves are
               already on the glass of the card this poster bills: the records
               figure is the register's own "Records" row, and the Nick sentence
               is his `marker` (printed at the head of ABOUT THE ARTIST) plus the
               "’94" card's own "who was gone at twenty-seven". Carsie's bill is
               built the same way — output count, then the one line that says
               what the work is. */
            { id: "hunter-root",
              what: "Songwriter · Lancaster, Pennsylvania",
              why: "Seven records, an EP and a set of singles and rarities. " +
                   "Half of Crooked Home is about his brother Nick, who was " +
                   "gone at twenty-seven, and he says “’94” is the heart of it " +
                   "all.",
              pick: "[PAPA] — one sentence on why Mike picked this artist.",
              hue: "#d8c9a0" },
          ]),
          /* [W1c 2026-08-05] THE FOOT IS STRUCK, on Mike's ruling. "Press a
             name to open that artist's room. Every card in it was written from
             sources that were opened and read, every door leads to the
             artist's own place, and the pictures are their own — logged file
             by file, and down the day any of them asks." — the first clause
             explains what the panels already do, the rest congratulates the
             house on its own research and rights practice.
             AND THE PER-ACT "Open the room" WENT WITH IT (Exhibit.jsx), which
             is the same strike and is the one that costs something: it was the
             panels' only WRITTEN affordance, put there by P6's ruling that
             what is not readable must be written. The panel is still a
             <button>, still lifts on hover and still takes a pointer cursor;
             on touch there is now nothing at all saying press me. Named in the
             round log and OPEN_ACTIONS W-B rather than replaced with copy
             nobody asked for. */
        },
        /* [W1a 2026-08-05] THE INTERPRETIVE LABEL IS STRUCK, on Mike's ruling.
           "They have nothing to do with each other. That is not an accident
           and it is not a shortage of taste: a room that only holds records
           which agree is a room with one record in it. What the four have in
           common is the only thing this museum asks for, which is that
           somebody here could not stop playing them." — the house explaining
           its own curation and reassuring the visitor it was deliberate. The
           face declares no `label` at all now; the render is conditional and
           untouched, so the poster is heading, blurb, four panels, foot rule. */
        /* [R5b] M6's quiet booth pointer MOVED, and moving it is keeping M6
           rather than overriding it. Its ruling was that the link belongs "at
           the end of the paragraph a stranger has just read about who runs this
           place" — and that paragraph is no longer on this page; this page is
           now about the four artists. The paragraph it names is on the WELCOME
           card, so the link went with it. A pointer left standing where its own
           reason has walked away is the kind of orphan every round of this
           project has had to go back and remove. */
        footer: "WORTH A LISTEN · WEIRD.BABY",
        /* [D3a 2026-08-06] M53 CLOSED, ON MIKE'S STRIKE, AND THE SCRUBBER IS
           UNTOUCHED. The second sentence — "Every claim about an artist here is
           already on that artist's own card, sourced there." — carried no
           marker, so `visitorProse` (which cuts by SENTENCE, on purpose, and
           must not be "fixed") printed it as the last line on the poster. It
           was the museum vouching for its own sourcing practice on the glass:
           the same subject W1c struck out of the bill's foot four inches above
           it, surviving in the field nobody reads as visitor-facing.
           THE LESSON IS THE ONE M53 NAMED AND IT IS WIDER THAN THIS FACE: a
           `papa` string is not a comment. Write the whole note inside ONE
           marked sentence, or expect the rest on the glass. This field is now
           one sentence and it carries the marker. */
        papa: "[PAPA] — the promotional copy, the running order and the four " +
              "house accents.",
      },
    },
    {
      /* ═══ [F2 2026-08-06] "THE DEAL" IS BURNED, AND AN FAQ STANDS HERE ══════
         MIKE: **"WAL: BURN AND DISCARD 'The Deal' — junk. ADD A FAQ, in the
         booth's format."**

         WHAT WAS ON IT, NAMED RATHER THAN QUIETLY LOST — the Law of Subtraction
         is a reason to delete and never a reason to delete quietly. The face was
         ~280 words of the house talking about itself, in the one room whose
         whole ruling is that the ARTISTS shine and the house is a listener in
         the row with everybody else. Four paragraphs, a seven-row tombstone, a
         still of the room's own printed card, a quiet door to the booth, and the
         name itself. R5a picked "Welcome" for it and F2 replaced that with "The
         deal"; both were arguments about what to CALL a page whose problem was
         that it existed.
         WHERE EACH CLAIM SURVIVES, checked rather than asserted:
           · the four artists and eight songs      the carousel, and the bill on
                                                   the track above this one
           · every door leads out                  every door, on every card
           · nothing to sign up for, no account    /booth, "Is it really free?"
           · a page name and a timestamp           /booth, "Are you tracking me?"
           · the quotes were read at the source    each card's own citations
           · what the pictures are and that they
             come down on request                  NOWHERE ELSE — so it is the
                                                   third question below.
         THAT LAST ROW IS A JUDGEMENT AND IT IS FLAGGED AS ONE. It is the only
         thing on the struck face with no other home, and it is an undertaking
         to four real people rather than a description of the room. Carrying an
         undertaking into a question is the opposite of the thing Mike is
         striking — the objection is to a wall of house prose in the artists'
         room, and a question a visitor actually asks is not that. One line here
         reverses it if he disagrees. The wording is MOVED, not rewritten.

         NOTHING ELSE ON THIS FACE IS NEW. The first two answers are the booth's
         own, declared in house-copy.js and printed in both rooms because that is
         where the question is asked (R7); the fourth is the house's standing
         contact passage. The format is `faqFace()` — see src/data/faq-face.js. */
      id: "wal-house-faq",
      unnumbered: true,   /* the room's own pages are not songs */
      title: "FAQ",
      tags: ["wal", "house", "faq", "questions", "artists", "rights"],
      videos: [],
      face: faqFace("WORTH A LISTEN", [
        { title: "Are you affiliated with the artists you show?",
          line: AFFILIATION },
        { title: "Can I use what is here?",
          line: USE_RIGHTS },
        { title: "Whose pictures are these?",
          line: "The pictures are the artists' own public imagery, logged " +
                "file by file with where it came from, and they come down the " +
                "day any of them asks." },
        /* [D 2026-08-11] "How do I get in touch?" IS DELETED — its answer was
           `CONTACT`, and the address it carried is struck sitewide. */
      ]),
    },
  ],
};

const spine = [HOUSE_ALBUM, ...ARTISTS.map(a => ({
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
}))];

export const worthAListenArtists = ARTISTS;

export const worthAListenExhibit = {
  id: "wal",
  name: "Worth A Listen",
  exhibitSlug: "wal",
  eraAlias: {},
  spine,
  /* [R-c 2026-08-02] sourced facts, in the museum's own fact shape, consumed
     by the shipped selector with no new selection code. [CS 2026-08-04] the
     hard-coded count that stood here is gone rather than re-typed: nine facts
     were removed this round (see the notes in worth-a-listen-facts.js) and a
     number in a comment that nothing derives is a number that goes wrong the
     next time the vault changes. `factCounts` at the foot of that file is the
     derived one. */
  facts: worthAListenFacts,
  defaultActiveIndex: 0,
  splitKey: "wb-wal-split",
  /* [D2 2026-08-06] `splitDefault: 26` was a hand-fit of the measurement the
     room now takes for itself — the widest row in this wing's contents list,
     expressed as a percentage of a window nobody had measured. It is kept as
     the FALLBACK for the case the measurement cannot run (a contents column
     with no rows in it), and it is no longer what the room opens at. */
  splitDefault: 26,
  cfKey: "wb-wal-cfh",
  visitPath: "/wal",
  shopExitParam: "wal",
  /* [P11 2026-08-02] IN THIS WING AN ALBUM IS AN ARTIST, so the album a
     visitor leaves from IS the exhibit's owner for the billing law. The exit
     carries it; /hr, /wb and /robots declare nothing and their exits do not
     change. */
  shopOwnerFromAlbum: true,
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
  /* [D1 2026-08-06] `fitOnEntry` IS DELETED AND THE BEHAVIOUR IS NOT. Mike's
     DEFAULTS AND SIZING block is headed "applies everywhere", so every wing
     fits itself on entry now and there is nothing left for a per-wing opt-in to
     say. F3's own sentence for what it did stands, in Exhibit.jsx, where the
     fit is: on entry the room fits itself to the screen — tracklist, viewer and
     scroller all visible at once, computed from measurement; the visitor's own
     adjustments hold for the session. */
  /* [M-e 2026-08-02] the transport stows into the artist-name bar, and the
     fixed 68px player bar stands down with it. */
  transport: "banner",
};
