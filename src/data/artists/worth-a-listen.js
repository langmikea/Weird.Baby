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
// ---- W1: VIDEO IDS — WHAT COULD AND COULD NOT BE CONFIRMED -----------------
// The brief asks for ids cross-checked against the artist's OFFICIAL channel,
// with channel identity CONFIRMED rather than assumed. That bar was met for
// exactly one artist, and the reason matters:
//
//   · HUNTER ROOT — CONFIRMED, and not from the open web at all. He is OUR
//     artist and the museum holds his catalogue: both ids come from the
//     foundation export (src/data/exhibits/hunter_root.json), each carrying a
//     MediaVault id and a content_kind of "official". That is a stronger
//     provenance than any search result could be — the museum IS the source.
//     Mike's "Nothing Wrong" cross-checked to our `nothin_wrong`, whose real
//     title is "Nothin' Wrong"; corrected here rather than silently matched.
//
//   · JESSE WELLES, CARSIE BLANTON, MIKEY MIKE — NOT CONFIRMED, so NOT
//     WRITTEN. Search returns several plausible uploads per song (studio,
//     live, festival, lyric) and a search result is not proof of which
//     channel hosts it. The obvious next step — fetching the watch page to
//     read the uploader — DOES NOT WORK: YouTube renders that in JavaScript
//     and the fetch returns a bare footer. And the artists' own sites do not
//     embed or link their videos (wellesmusic.com checked directly: Welcome /
//     Tour / Contact / Connect / SHOP, no video links anywhere).
//     So there is no path from here to a channel-confirmed id, and eleven
//     guessed characters is exactly the invented link the brief forbids.
//     Those songs keep honest faces naming what is missing.
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
    id: "mikey-mike",
    name: "Mikey Mike",
    tags: ["wal", "mikey-mike"],
    songs: [
      { title: "Doin' Me", ytId: null,
        note: "Mike wrote this as \u201cI'm Doin' Me\u201d. The record appears " +
              "to be \u201cDoin' Me\u201d (2017), made with Rick Rubin and " +
              "widely heard from a Canon advert sync. Title flagged, not " +
              "corrected in silence \u2014 [PAPA] confirms." },
      { title: "Cooler", ytId: null, note: "" },
    ],
    site: null,
    siteNote: "No official artist site confirmed \u2014 several unrelated acts " +
              "share this name, and picking the wrong one is worse than " +
              "leaving the door shut. [PAPA] supplies it.",
    shop: null,
    /* [W4] VERIFIED PUBLIC FACTS ONLY. Sources: Faded Glamour's 2017 piece on
       "Doin' Me" (the Canon advert sync, the Rick Rubin involvement). Nothing
       beyond what coverage states is asserted here. */
    about: [
      "KNOWN FOR   \u201cDoin' Me\u201d (2017)",
      "MADE WITH   Rick Rubin",
      "HEARD IN    a Canon advert \u2014 how most people met the song",
      "ON FILE     little else that could be verified",
    ],
    aboutNote: "The thinnest entry in the wing, and it says so. What is here " +
               "is what contemporary coverage of the record states; the rest " +
               "waits for [PAPA] rather than being filled in with plausible " +
               "sentences.",
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
      "IN THIS MUSEUM   the reference wing, /hr \u2014 unlisted, still live",
      "CATALOGUE        78 songs on file in the museum's own vault",
      "\u201994               from Crooked Home; the single art is a childhood " +
      "photo of Hunter and Nick",
      "TAUGHT US        every pattern the other wings inherited",
    ],
    aboutNote: "Sourced from the museum's own foundation export rather than " +
               "from the open web \u2014 he is our artist and this is our record " +
               "of him.",
    coverArt: "https://i.ytimg.com/vi/vPW49GU38Ng/maxresdefault.jpg",
  },
  {
    id: "jesse-welles",
    name: "Jesse Welles",
    tags: ["wal", "jesse-welles"],
    songs: [
      { title: "That Can't Be Right", ytId: null, note: "" },
      { title: "There's A Hole", ytId: null, note: "" },
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
    channel: "https://www.youtube.com/channel/UCmb7zAvq9IxHi_UnP93AVSQ",
    /* [W4] Sources: Wikipedia (birth name, birthplace, prior monikers),
       Rolling Stone's profile, Farm Aid coverage of the Dave Matthews
       introduction. Only what those state. */
    about: [
      "FROM        Ozark, Arkansas",
      "SPELLING    Jesse Welles \u2014 confirmed, not Jess",
      "ALSO        has recorded as Welles and as Jeh Sea Wells",
      "WRITES      topical songs, released fast and often",
      "NOTED BY    Dave Matthews, introducing him at Farm Aid",
    ],
    aboutNote: "[PAPA] \u2014 the voice. The facts are checked; how warmly the " +
               "house talks about him is Mike's.",
  },
  {
    id: "carsie-blanton",
    name: "Carsie Blanton",
    tags: ["wal", "carsie-blanton"],
    songs: [
      { title: "Be Good", ytId: null, note: "" },
      { title: "Shit List", ytId: null,
        note: "Second single from Love & Rage." },
    ],
    site: "https://www.carsieblanton.com",
    siteLabel: "carsieblanton.com",
    shop: { label: "Shop", url: "https://www.carsieblanton.com/shop/" },
    channel: "https://music.youtube.com/playlist?list=PLbY5r0VuZYArGmGD4HWrvtcx8YDFzjCXn",
    /* MIKE'S RULING, KEPT: her Bandcamp streams the catalogue free and
       without advertising and pays her directly, so it stays the NAMED better
       listen rather than being buried under a video. */
    listen: { label: "Bandcamp \u2014 free, no ads", url: "https://carsieblanton.bandcamp.com" },
    /* [W4] Sources: her own site's description of the work, Shore Fire's
       release note for "Shit List" (second single from Love & Rage), and her
       site's own account of the recent record. */
    about: [
      "DESCRIBES AS   hooks, chutzpah, revolutionary optimism",
      "\u201cBe Good\u201d      a call to love your neighbour, plainly meant",
      "\u201cShit List\u201d    second single from Love & Rage",
      "RECENT         Everything is Great, with The Burning Hell",
      "BEST LISTEN    Bandcamp \u2014 free, no ads, pays her directly",
    ],
    aboutNote: "[PAPA] \u2014 the voice.",
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
      action: { label: a.shop ? a.shop.label : a.listen.label,
                event: "wb-wal-open-link",
                href: a.shop ? a.shop.url : a.listen.url },
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
      blurb:
        "Who they are, in the house register — and the questions that " +
        "actually get asked, answered on the same page rather than filed " +
        "somewhere else.",
      lines: a.about,
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
        { stamp: "Q", title: "How do I support them?",
          line: a.shop || a.listen
            ? "Their own shop and their own store are linked in this album. " +
              "Use those rather than anything here."
            : "Buy from them directly wherever you find them — this " +
              "exhibit has no store of its own and never will.",
          note: "" },
      ],
      entriesMode: "list",
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
