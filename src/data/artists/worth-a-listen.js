// src/data/artists/worth-a-listen.js
// WORTH A LISTEN — an exhibit of other people's music, per Mike.
//
// SAME-ONLY-DIFFERENT, HARD. This is DATA plus one minimal extension. The
// exhibit engine (Exhibit.jsx) is untouched by this file: WAL is one more
// artist config in the shape /hr, /wb and /robots already use — a spine of
// albums, each with tracks, each track carrying videos or a `face`. Anything
// that felt like it needed a new component was rewritten until it did not.
//
// ---- THE TEMPLATE (Mike's ruling) -------------------------------------------
// Every WAL artist gets the SAME tracklist shape, and the shape is the
// deliverable — a new artist is a new entry in ARTISTS below and nothing else:
//
//   01..n   the songs        — the video, official upload
//   n+1     LINK             — hands off to the artist's own website
//   n+2     SHOP / TICKETS   — where they exist, and only where they exist
//   n+3     ABOUT            — who they are, and the FAQ rides in the same face
//
// ---- BELOW THE LINE: DELIBERATELY EMPTY -------------------------------------
// Mike: the artifact shelf under the fold was the /hr blocker, and we are not
// recreating it. WAL albums carry NO below-the-line artifacts at all. When an
// artist earns one it arrives as data, here, the way the robots wing did it.
//
// ---- W1: VIDEO IDS - ALL EIGHT CONFIRMED ---------------------------------
// Every song in this wing plays, and every id was checked against the video's
// OWN metadata before it was written.
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
//
// ---- COVERS ------------------------------------------------------------------
// Typographic placeholders in the house register, generated inline as SVG data
// URIs so they ship with the config and need no asset pipeline. FLAGGED FOR
// ART: Mike's covers replace `art` with a path and nothing else changes.

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
   `songs`  : [{ title, ytId, note }]   ytId null = not confirmed, face instead
   `site`   : the artist's own website, or null when unconfirmed
   `shop`   : { label, url } or null — only where one was actually found
   `about`  : the register lines and the FAQ that rides with them            */
const ARTISTS = [
  {
    id: "carsie-blanton",
    name: "Carsie Blanton",
    tags: ["wal", "carsie-blanton"],
    songs: [
      /* [TRANSPOSED, AND REVERSED WITHIN THE PAIR] supplied under Jesse
         Welles, and in the other order. Filed by what the videos are. */
      { title: "Be Good", ytId: "DAFmxnJA_OQ",
        note: "Confirmed by oEmbed: BE GOOD by Carsie Blanton - OFFICIAL LYRIC VIDEO, Carsie Blanton channel." },
      { title: "Shit List", ytId: "B7i6Vys6aPI",   /* oEmbed: Carsie Blanton channel */
        note: "Second single from Love & Rage." },
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
    listen: { label: "Bandcamp \u2014 free, no ads", url: "https://carsieblanton.bandcamp.com" },
    /* [W4] Sources: her own site's description of the work, Shore Fire's
       release note for "Shit List" (second single from Love & Rage), and her
       site's own account of the recent record. */
    about: [
      "IN HER WORDS   hooks, chutzpah, revolutionary optimism",
      "THE ALIGNMENT  equality, plainly and repeatedly, in the songs themselves",
      "BE GOOD        love your neighbour - Jesus and Dr King, said straight",
      "SHIT LIST      second single from Love & Rage; the list is fascists",
      "RECENT         Everything is Great, with The Burning Hell",
      "BEST LISTEN    Bandcamp - free, no ads, pays her directly",
    ],
    marker: "She writes protest songs you can dance to, and she means every word of the protest.",
    trail: [
      { label: "Her own shop", url: "https://www.carsieblanton.com/shop/", scent: "Where the money goes to her." },
      { label: "Bandcamp - the whole catalogue, free", url: "https://carsieblanton.bandcamp.com", scent: "No ads, no algorithm, no middle. Start anywhere." },
      { label: "Her channel", url: "https://www.youtube.com/@CarsieBlanton", scent: "Official videos, verified from her own uploads." },
    ],
    aboutNote: "Sources: her own site's description of the work; Shore Fire Media's release note for \u201cShit List\u201d (second single from Love & Rage); her site's account of Everything is Great. Her politics are quoted from her songs and her own framing, not characterised for her.",
  },
  {
    /* ===== [W5 2026-08-02, Mike's ruling \u2014 a landmark] ==================
       HUNTER ROOT IS A WAL ARTIST NOW. /hr was the most stable thing this
       museum had and it taught the machinery every pattern the other wings
       inherited; it has outlived that purpose. It RETIRES TO REFERENCE-HELD:
       nothing deleted, the route still live, unlisted in the directory per
       the unlisted law. His entry here is the same shape as everyone else's,
       which is the point of the ruling.
       HIS SONGS COME FROM OUR OWN CATALOGUE. Both ids are foundation-backed
       with MediaVault provenance and a content_kind of "official" \u2014 the
       museum is the source, so this is the one artist whose media needed no
       open-web guessing at all. */
    id: "hunter-root",
    name: "Hunter Root",
    tags: ["wal", "hunter-root", "house"],
    songs: [
      { title: "\u201994", ytId: "vPW49GU38Ng",
        note: "Official music video. Museum catalogue MV-20260523-001, " +
              "album Crooked Home." },
      { title: "Nothin' Wrong", ytId: "Wv0_mujJUQU",
        note: "Official music video. Museum catalogue MV-20260523-040, album " +
              "Skipping Stones That Sink Before They're Thrown. Mike wrote " +
              "\u201cNothing Wrong\u201d; the catalogue title is \u201cNothin' Wrong\u201d." },
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
    shop: null,
    /* [W4] from the museum's own foundation export - our own records. */
    about: [
      "IN THIS MUSEUM   the reference wing, /hr - unlisted, still live",
      "CATALOGUE        78 songs on file in the museum's own vault",
      "\u201994               \u201calmost the album title. It's the heart of it all.\u201d",
      "THE SLEEVE       the single art is a childhood photo of Hunter and Nick",
      "WHY HE IS HERE   he taught this museum every pattern the other wings use",
    ],
    marker: "Half of Crooked Home is about his brother Nick. He says \u201994 is the heart of it all.",
    trail: [
      { label: "The Hunter Root reference wing", url: "/hr", scent: "The deepest thing in this building about any artist. 78 songs, nine albums." },
    ],
    aboutNote: "Sourced from the museum's own foundation export and his own words in it - he is our artist and this is our record of him.",
    coverArt: "https://i.ytimg.com/vi/vPW49GU38Ng/maxresdefault.jpg",
  },
  {
    id: "jesse-welles",
    name: "Jesse Welles",
    tags: ["wal", "jesse-welles"],
    songs: [
      /* [TRANSPOSED] Mike supplied this id under Carsie Blanton; the
         video's own title and channel say Jesse Welles. Filed by what it is. */
      { title: "That Can't Be Right", ytId: "cqfJnUgvso0",
        note: "Confirmed by oEmbed: That Can't Be Right, Jesse Welles channel." },
      /* [TRANSPOSED] supplied under Carsie Blanton. */
      { title: "There's A Hole", ytId: "s9FBnLxcqqw",
        note: "Confirmed by oEmbed: There's A Hole, Jesse Welles channel." },
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
    /* [L1 2026-08-02] CORRECTED. This carried a /channel/UCmb7... URL taken
       from a SEARCH RESULT. The channel that actually uploaded his official
       video - per oEmbed author_url - is @hellswelles. They may well be the
       same channel under a handle and an id, but that was never confirmed,
       and an unconfirmed equivalence is not a fact. The old id is kept in
       docs/WAL_LINK_LEDGER.md as UNVERIFIED so it is not reinstated. */
    channel: "https://www.youtube.com/@hellswelles",
    /* [W4] Sources: Wikipedia (birth name, birthplace, prior monikers),
       Rolling Stone's profile, Farm Aid coverage of the Dave Matthews
       introduction. Only what those state. */
    about: [
      "FROM        Ozark, Arkansas",
      "THE HABIT   topical songs, written fast and released often",
      "ALSO        has recorded as Welles and as Jeh Sea Wells",
      "BEFORE      fronted Dead Indian and Cosmic American",
      "NOTED BY    Dave Matthews, introducing him at Farm Aid",
      "SPELLING    Jesse Welles - confirmed, not Jess",
    ],
    marker: "He writes the news. A man with a guitar in a field, posting songs about this week, most weeks.",
    trail: [
      { label: "wellesmusic.com", url: "https://www.wellesmusic.com", scent: "His own place. Tour, contact, the lot." },
      { label: "Tour dates", url: "https://www.wellesmusic.com/tour", scent: "He plays constantly. This is where it is real." },
      { label: "His channel", url: "https://www.youtube.com/@hellswelles", scent: "Where the songs land first, verified from his own uploads." },
      { label: "The store", url: "https://jessewelles.redstarmerch.com/", scent: "Linked from his own site." },
    ],
    aboutNote: "Sources: wellesmusic.com read directly; Wikipedia for birthplace and prior monikers; Rolling Stone's profile; Farm Aid coverage of the Dave Matthews introduction.",
  },
  {
    id: "mikey-mike",
    name: "Mikey Mike",
    tags: ["wal", "mikey-mike"],
    songs: [
      { title: "Doin' Me", ytId: "7rWDzLUOreo",   /* oEmbed: Mikey Mike channel */
        note: "Mike wrote this as \u201cI'm Doin' Me\u201d. The record appears " +
              "to be \u201cDoin' Me\u201d (2017), made with Rick Rubin and " +
              "widely heard from a Canon advert sync. Title flagged, not " +
              "corrected in silence \u2014 [PAPA] confirms." },
      { title: "Cooler", ytId: "KMo-TKhW5VY",
        note: "Confirmed by oEmbed: Mikey Mike - Cooler [Official Lyric Video], Mikey Mike channel." },
    ],
    /* [L1 2026-08-02] HE HAS A VERIFIED HOME NOW, from an unfakeable
       direction: oEmbed returns the UPLOADING channel for a video, and the
       uploader of "Mikey Mike - Doin' Me (Official Video)" is
       @findmikeymike. That is the channel verified BY THE UPLOAD rather than
       by a search ranking - which is exactly what was missing when this
       entry had to leave the door shut. */
    site: "https://www.youtube.com/@findmikeymike",
    siteLabel: "his channel",
    siteNote: "No website or store confirmed \u2014 several unrelated acts " +
              "share this name, and picking the wrong one is worse than " +
              "leaving the door shut. [PAPA] supplies it.",
    shop: null,
    /* [W4] VERIFIED PUBLIC FACTS ONLY. Sources: Faded Glamour's 2017 piece on
       "Doin' Me" (the Canon advert sync, the Rick Rubin involvement). Nothing
       beyond what coverage states is asserted here. */
    about: [
      "KNOWN FOR   \u201cDoin' Me\u201d (2017)",
      "MADE WITH   Rick Rubin",
      "HEARD IN    a Canon advert - how most people met the song",
      "CHANNEL     @findmikeymike - verified from his own upload",
      "ON FILE     little else that could be verified",
    ],
    marker: "You have almost certainly heard him without knowing it - and he made the record with Rick Rubin.",
    trail: [
      { label: "His channel", url: "https://www.youtube.com/@findmikeymike", scent: "The only surface confirmed to be his. Verified from the upload itself." },
    ],
    aboutNote: "Sources: Faded Glamour's 2017 piece on \u201cDoin' Me\u201d (the Canon sync, the Rick Rubin involvement). The thinnest entry in the wing, and it says so rather than being padded.",
  },
];

/* ---- the template, applied ------------------------------------------------- */
function songTrack(a, s, i) {
  return {
    id: a.id + "-song-" + (i + 1),
    title: s.title,
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

function linkTrack(a) {
  return {
    id: a.id + "-link",
    title: "Link",
    tags: [...a.tags, "link"],
    videos: [],
    face: {
      kind: "text",
      title: "LINK",
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

function shopTrack(a) {
  if (!a.shop && !a.listen && !a.tickets) return null;
  const rows = [];
  if (a.shop) rows.push("SHOP     " + a.shop.url);
  if (a.tickets) rows.push("TICKETS  " + a.tickets.url);
  if (a.listen) rows.push("LISTEN   " + a.listen.url);
  return {
    id: a.id + "-shop",
    title: a.shop ? a.shop.label : a.listen.label,
    tags: [...a.tags, "shop"],
    videos: [],
    face: {
      kind: "text",
      title: (a.shop ? a.shop.label : "LISTEN").toUpperCase(),
      subtitle: a.name.toUpperCase(),
      blurb: a.listen
        ? "Where to hear it without paying an advertiser for the privilege, " +
          "and where to give the artist money if you want to."
        : "Where to see them, and where the money goes to them.",
      lines: rows,
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
      papa: "[PAPA] — the wording, and whether tickets and merch want " +
            "separate tracks once an artist has both.",
    },
  };
}

function aboutTrack(a) {
  return {
    id: a.id + "-about",
    title: "About",
    tags: [...a.tags, "about", "faq"],
    videos: [],
    face: {
      kind: "text",
      title: "ABOUT",
      subtitle: a.name.toUpperCase(),
      /* [TRAIL-MARKER LAW 2026-08-02] THE HEADLINE LAYER IS ONE SENTENCE.
         A visitor remembers one or two things at most, and ten things reduces
         the odds they keep the one that matters. So the blurb is now the ONE
         thing about this artist worth carrying out of the building - not a
         summary of them. The register beneath is the trees: it makes the
         scene real and nobody inspects it. */
      blurb: a.marker,
      lines: a.about,
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
            "[PAPA] — the about copy and the FAQ answers.",
    },
  };
}

const spine = ARTISTS.map(a => ({
  id: a.id,
  title: a.name,
  year: null,
  tags: a.tags,
  /* FLAGGED FOR ART where it is a placeholder. `coverArt` is set only where
     the museum owns the source (Hunter Root's own catalogue); everyone else
     gets the house typographic cover rather than a rights gamble. */
  art: a.coverArt || cover(a.name),
  accent: null,
  viewerPoster: null,
  tracks: [
    ...a.songs.map((s, i) => songTrack(a, s, i)),
    linkTrack(a),
    shopTrack(a),
    aboutTrack(a),
  ].filter(Boolean),
}));

export const worthAListenArtists = ARTISTS;

export const worthAListenExhibit = {
  id: "wal",
  name: "Worth A Listen",
  exhibitSlug: "wal",
  eraAlias: {},
  spine,
  facts: [],
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
};
