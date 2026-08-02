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
// ---- WHAT IS VERIFIED, AND WHAT IS NOT --------------------------------------
// Every URL in this file was checked in the research pass on 2026-08-02 and
// NOTHING was invented. Where a fact could not be confirmed, the slot carries
// a flag instead of a guess — an empty `videos` array renders the track's face
// rather than a dead embed, so an unverified song is a page that works and
// says what it is missing, not a broken player.
//
// THE SPECIFIC GAPS, named so they can be closed:
//   · YouTube video IDs for the songs were NOT confirmed for any artist. A
//     search result is not a video id, and guessing eleven characters is
//     exactly the invented link the brief forbids. Each song track therefore
//     links to the artist's OFFICIAL channel or store and marks `ytId` TODO.
//   · MIKEY MIKE: the track Mike wrote as "I'm Doin' Me" is almost certainly
//     "DOIN' ME" (2017, made with Rick Rubin, known from the Canon advert
//     sync). No official artist website was confirmed — several unrelated
//     acts share the name — so his LINK and SHOP tracks are held.
//   · HUNTER ROOT: he already has a wing in this museum (/hr). His WAL LINK
//     track points AT that wing rather than off-site, because the museum is
//     his official presence here. The two songs were not cross-checked
//     against the /hr foundation data in this run.
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
        note: "Mike wrote this as “I'm Doin' Me”. The record appears to " +
              "be “Doin' Me” (2017, made with Rick Rubin; widely heard " +
              "from a Canon advert sync). Title flagged, not corrected in " +
              "silence — [PAPA] confirms." },
      { title: "Cooler", ytId: null,
        note: "Not confirmed against an official upload in the research pass." },
    ],
    site: null,
    siteNote: "No official artist site confirmed — several unrelated acts " +
              "share this name, and picking the wrong one is worse than " +
              "leaving the door shut. [PAPA] supplies it.",
    shop: null,
    about: [
      "KNOWN FOR   “Doin' Me” (2017)",
      "MADE WITH   Rick Rubin",
      "HEARD IN    a Canon advert, which is how most people met it",
    ],
  },
  {
    id: "hunter-root",
    name: "Hunter Root",
    tags: ["wal", "hunter-root", "house"],
    songs: [
      { title: "'94", ytId: null, note: "" },
      { title: "Nothing Wrong", ytId: null, note: "" },
    ],
    /* HE ALREADY HAS A WING HERE. The LINK track points INTO the museum
       rather than out of it, because /hr IS his presence in this building. */
    site: "/hr",
    siteLabel: "The Hunter Root wing",
    siteNote: "In-museum. This is the one WAL link that does not leave the " +
              "building, and that is the correct answer rather than a " +
              "convenient one.",
    shop: null,
    about: [
      "IN THIS MUSEUM   yes — he has his own wing",
      "FIND HIM         /hr, with the full deck and the archive",
    ],
  },
  {
    id: "jesse-welles",
    name: "Jesse Welles",
    tags: ["wal", "jesse-welles"],
    songs: [
      { title: "That Can't Be Right", ytId: null, note: "" },
      { title: "There's A Hole", ytId: null, note: "" },
    ],
    /* VERIFIED 2026-08-02: the official site is wellesmusic.com. Note that
       jessewelles.org and jessewellestour.com surface high in search and are
       NOT official - ticket-resale and SEO pages. Naming them here so the
       next person does not "fix" this link to a worse one. */
    site: "https://www.wellesmusic.com",
    siteLabel: "wellesmusic.com",
    shop: { label: "Tour & tickets", url: "https://www.wellesmusic.com/tour" },
    channel: "https://www.youtube.com/channel/UCmb7zAvq9IxHi_UnP93AVSQ",
    about: [
      "FROM        Ozark, Arkansas",
      "SPELLING    Jesse Welles — confirmed, not Jess",
      "ALSO        has recorded as Welles and as Jeh Sea Wells",
    ],
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
    /* MIKE'S PREFERENCE, APPLIED: "if a song is offered free-and-legal without
       ads somewhere better, prefer it". Her Bandcamp streams the catalogue
       free and without advertising, and it pays her directly - so it is named
       as the better listen rather than buried under the video. */
    listen: { label: "Bandcamp — free, no ads", url: "https://carsieblanton.bandcamp.com" },
    about: [
      "DESCRIBES AS   hooks, chutzpah, revolutionary optimism",
      "RECENT         Everything is Great, with The Burning Hell",
      "BEST LISTEN    Bandcamp — free, no ads, pays her directly",
    ],
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
  if (!a.shop && !a.listen) return null;
  const rows = [];
  if (a.shop) rows.push("SHOP     " + a.shop.url);
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
      papa: "[PAPA] — the about copy and the FAQ answers.",
    },
  };
}

const spine = ARTISTS.map(a => ({
  id: a.id,
  title: a.name,
  year: null,
  tags: a.tags,
  /* FLAGGED FOR ART: typographic placeholder in the house register. */
  art: cover(a.name),
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
