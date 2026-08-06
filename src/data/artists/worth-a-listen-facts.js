// src/data/artists/worth-a-listen-facts.js
// WORTH A LISTEN — THE FACT VAULT.  [R-c 2026-08-02]
//
// ============================================================================
// WHAT THIS IS, AND WHY IT IS SHAPED THE WAY IT IS
// ============================================================================
// The wing shipped with `facts: []`. That meant the player scroller never ran
// here and there was nothing for a popup to pop. This file is the vault it was
// waiting for: ~270 sourced factoids across four artists.
//
// IT IS THE MUSEUM'S OWN FACT SHAPE, NOT A NEW ONE. Every entry is
//   { id, lines: [string, string?], tags: { namespace: [values] } }
// which is exactly what `<exhibit>.facts.json` exports and exactly what
// `src/lib/fact-select.js` consumes. So the shipped selector — the climb, the
// weighting, splitFact — runs this vault with ZERO new selection code. A new
// fact is a new object; there is nothing else to touch.
//
// ---- THE CLIMB, MAPPED ONTO A WING WHOSE ALBUMS ARE PEOPLE -----------------
// fact-select's climb is song → album → era → exhibit. In WAL an "album" IS an
// artist, so the tiers land as:
//   song:<slug>     a fact about THAT SONG            (first-meet)
//   album:<artist>  a fact about THAT ARTIST          (the artist's own pool)
//   exhibit:wal     the whole wing                    (the floor; never dries)
// No `era:` tier is used — WAL has no eras, and inventing one to fill a slot
// would be furniture, not structure.
//
// ============================================================================
// THE PHRASING LAW (as-built, enforced on every line below)
// ============================================================================
// Read off the 97 facts already in the museum's vault, not invented here:
//
//  1. ONE OR TWO LINES. Line 1 is the fact or the quote. Line 2 either
//     completes it or is a BREADCRUMB opening with an em-dash —
//     "— Speaker, Outlet, Year" — which splitFact() demotes to the small box.
//  2. QUOTES ARE VERBATIM AND SHORT, and they are always attributed. A quote is
//     never paraphrased into our voice and never characterised for the speaker.
//  3. UNVERIFIED MEANS OMITTED, NOT HEDGED. The precedent is the museum's own:
//     Nick Root's death year was dropped entirely rather than shipped with a
//     maybe. Nothing below is softened into the vault; it either cleared or it
//     is not here.
//  4. PLAIN DECLARATIVES. Past tense for history, present for standing facts,
//     no marketing adjectives. The fact does the work.
//  5. NO LYRICS, EVER. Song lyrics are not facts and are not ours to reprint.
//
// ============================================================================
// SOURCES, NAMED (so any line can be walked back)
// ============================================================================
//   FEED    the artist's OWN YouTube upload feed, read 2026-08-02 from
//           youtube.com/feeds/videos.xml for the channel id resolved off their
//           own channel page. Titles, dates and view counts are theirs, not a
//           third party's summary of theirs. Strongest source available for
//           anything recent.
//   WIKI    Wikipedia, read 2026-08-02.
//   OWN     the artist's own website, read directly.
//   BC      Bandcamp, read directly.
//   PRESS   named third-party coverage, cited inline.
//   VAULT   the museum's own foundation export — only available for our own
//           artist, and the strongest of all.
//
// VIEW COUNTS ARE A SNAPSHOT AND SAY SO. Every fact carrying a number carries
// its date with it, because a count without a date is a claim that rots.
// ============================================================================

/* Hunter Root's facts are NOT re-researched here. The museum already holds 97
   gated, sourced facts about him in its own vault, and re-authoring them from
   the open web would be replacing our best source with a worse one. They are
   imported and re-tagged into the WAL pool instead — one record, two rooms. */
/* the import attribute is not decoration: `hr_era.js` already imports its
   buckets this way and builds clean, and it is what lets this file be unit-run
   in plain node — which is how the counts below were verified. */
import hrVault from "../exhibits/hunter_root.facts.json" with { type: "json" };

const WAL = ["wal"];

/* the vault facts, re-pointed at this wing. Their own tags ride along, so a
   Nick Root fact is still a Nick Root fact; it simply now also answers to
   `album:hunter_root` inside /wal. Ids are prefixed so the two pools can never
   collide in a shown-count map. */
const hunterFromVault = (hrVault.facts || []).map(f => ({
  id: "WAL-HR-" + f.id,
  lines: f.lines,
  tags: {
    ...f.tags,
    exhibit: WAL,
    album: ["hunter_root"],
    source: (f.tags && f.tags.source) || ["vault"],
  },
}));

/* ---- authoring helper -------------------------------------------------------
   Not an abstraction for its own sake: it exists so that every fact in this
   file is forced through the same shape, and so a missing tag is impossible
   rather than merely unlikely. */
let seq = 0;
function fact(album, lines, extra) {
  seq += 1;
  return {
    id: "WAL-" + String(seq).padStart(3, "0"),
    lines,
    tags: {
      exhibit: WAL,
      album: [album],
      ...(extra || {}),
    },
  };
}

/* ===========================================================================
   CARSIE BLANTON
   =========================================================================== */
const CB = "carsie_blanton";
const carsie = [
  fact(CB, ["Carsie Blanton was born on 22 July 1985 in Luray, Virginia.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["origins"] }),
  fact(CB, ["She grew up on a former cattle farm in Luray.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["origins"] }),
  fact(CB, ["She was unschooled.",
            "Her education was not a classroom."], { source: ["wiki"], topic: ["origins"] }),
  fact(CB, ["She started piano at six and guitar at thirteen.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["origins"] }),
  fact(CB, ["At fifteen she sang backup for a touring funk band.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["origins"] }),
  fact(CB, ["She took up swing dancing at fifteen.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["origins"] }),
  fact(CB, ["At sixteen she moved to Eugene, Oregon.",
            "She lived in a group house with artists and musicians."], { source: ["wiki"], topic: ["origins"] }),
  fact(CB, ["She relocated to Philadelphia in 2006.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["places"] }),
  fact(CB, ["She lived in New Orleans from 2012 to 2020.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["places"] }),
  fact(CB, ["She has been based in the Philadelphia area since 2020.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["places"] }),
  fact(CB, ["She has worked with the same manager, Bill Eib, since 2006.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["career"] }),
  fact(CB, ["Her first record was Ain't So Green, in 2005.",
            "Steve Van Dam produced it."], { source: ["wiki"], topic: ["records"] }),
  fact(CB, ["Buoy came out in 2009.", "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(CB, ["Beau came out in 2010.", "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(CB, ["Idiot Heart came out in 2012.",
            "Oliver Wood produced it."], { source: ["wiki"], topic: ["records"] }),
  fact(CB, ["Not Old, Not New came out in 2014.", "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(CB, ["So Ferocious came out in 2016.", "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(CB, ["Buck Up came out in 2019.", "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(CB, ["Love & Rage came out in 2021.",
            "Tyler Chester produced it."], { source: ["wiki"], topic: ["records"], song: ["shit_list"] }),
  fact(CB, ["Body of Work followed, also produced by Tyler Chester.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(CB, ["Body of Work was released one song a month.",
            "It came out across 2022 and 2023 rather than all at once."], { source: ["wiki"], topic: ["records"] }),
  fact(CB, ["After the Revolution came out in 2024.", "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(CB, ["The Red Album came out in 2024.", "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(CB, ["There is a second volume: The Red Album Vol II.",
            "— her Bandcamp, read 2026"], { source: ["bandcamp"], topic: ["records"] }),
  fact(CB, ["Everything is Great is the 2026 record.",
            "She made it with The Burning Hell."], { source: ["wiki", "own"], topic: ["records"] }),
  fact(CB, ["Every one of her albums has been released independently.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["business"] }),
  fact(CB, ["She prices her music pay-what-you-want.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["business"] }),
  fact(CB, ["Her records are funded directly by listeners.",
            "Patreon and Kickstarter, rather than a label."], { source: ["wiki"], topic: ["business"] }),
  fact(CB, ["Her Bandcamp streams the catalogue free and without advertising.",
            "It pays her directly, which is why it is the named better listen."], { source: ["bandcamp"], topic: ["business"] }),
  fact(CB, ["She opened for The Wood Brothers from 2010.",
            "The United States, Germany and the Netherlands."], { source: ["wiki"], topic: ["stage"] }),
  fact(CB, ["She toured with Anaïs Mitchell's Hadestown in 2011.",
            "She played one of the Fates."], { source: ["wiki"], topic: ["stage"] }),
  fact(CB, ["She opened shows on Paul Simon's So Beautiful or So What tour in 2011.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["stage"] }),
  fact(CB, ["She usually plays as a trio.",
            "It is sometimes called the Handsome Band."], { source: ["wiki"], topic: ["stage"] }),
  fact(CB, ["Joe Plowman plays bass and Patrick Firth plays keyboards.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["stage"] }),
  fact(CB, ["In October 2025 she joined the Global Sumud Flotilla.",
            "It was carrying humanitarian aid to the Gaza Strip."], { source: ["wiki"], topic: ["politics"] }),
  fact(CB, ["She spent a week in an Israeli prison for it.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["politics"] }),
  fact(CB, ["She was named Folk Alliance International's Artist of the Year for 2026.",
            "She tied with I'm With Her."], { source: ["press"], topic: ["awards"] }),
  fact(CB, ["The 2026 folk award was announced on 21 January in New Orleans.",
            "— Folk Alliance International, 2026"], { source: ["press"], topic: ["awards"] }),
  fact(CB, ["Her fellow 2026 nominees were Abbie Gardner, Crys Matthews, I'm With Her, Ordinary Elephant and Sam Robbins.",
            "— Folk Alliance International, 2026"], { source: ["press"], topic: ["awards"] }),
  fact(CB, ["She posted her Artist of the Year acceptance speech to her own channel.",
            "Uploaded 29 January 2026."], { source: ["feed"], topic: ["awards"] }),
  fact(CB, ["NPR's Fresh Air called her “one of those hard-headed open-hearted protestors”.",
            "— Fresh Air, on Love & Rage"], { source: ["press"], topic: ["reception"] }),
  fact(CB, ["Ken Tucker called Buck Up “delightfully surprising”.",
            "— Ken Tucker, NPR"], { source: ["press"], topic: ["reception"] }),
  fact(CB, ["She describes the work as hooks, chutzpah and revolutionary optimism.",
            "— her own site, read 2026"], { source: ["own"], topic: ["voice"] }),
  fact(CB, ["She names Nina Simone and Woody Guthrie as the tradition she is working in.",
            "— her own site, read 2026"], { source: ["own"], topic: ["voice"] }),
  fact(CB, ["Her own site lists three things: Home, Shows and Shop.",
            "Read directly, 2026."], { source: ["own"], topic: ["places"] }),
  fact(CB, ["Her press page carries critic quotes and a contact address.",
            "It offers no downloadable photography and no usage terms at all."], { source: ["own"], topic: ["business"] }),
  fact(CB, ["“Shit List” was the second single from Love & Rage.",
            "— Shore Fire Media"], { source: ["press"], topic: ["records"], song: ["shit_list"] }),
  fact(CB, ["“Be Good” has an official lyric video on her own channel.",
            "Confirmed from the upload itself, not from a search."], { source: ["feed"], topic: ["records"], song: ["be_good"] }),
  fact(CB, ["Twenty years of touring built the audience.",
            "— her own site, read 2026"], { source: ["own"], topic: ["career"] }),
  fact(CB, ["Her own site announced two records for 2026.",
            "The Red Album Vol. II and Everything Is Great."], { source: ["own"], topic: ["records"] }),
  /* ---- from her own upload feed, read 2026-08-02 ---- */
  fact(CB, ["“PEACE AND FREEDOM” went up on 4 July 2026.",
            "18,242 views as of 2 August 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(CB, ["“CANADIAN FLAG” went up on 1 July 2026.",
            "Another official video with The Burning Hell."], { source: ["feed"], topic: ["feed"] }),
  fact(CB, ["“Fascists Are Good” went up on 28 June 2026.",
            "With The Burning Hell."], { source: ["feed"], topic: ["feed"] }),
  fact(CB, ["“STAFFORD BEER” got an official video on 8 June 2026.",
            "13,758 views as of 2 August 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(CB, ["“Live, Laugh, Love” was announced on her channel on 6 June 2026.",
            "Out on all platforms."], { source: ["feed"], topic: ["feed"] }),
  fact(CB, ["“Hello Comrade” was filmed live at The Chapel in San Francisco.",
            "February 2026; posted that May."], { source: ["feed"], topic: ["stage"] }),
  fact(CB, ["“Tango Luigi” was played live in San Francisco and posted on 1 June 2026.",
            "The official video had come out that March."], { source: ["feed"], topic: ["feed"] }),
  fact(CB, ["“Price of Eggs” went up on 1 April 2026.",
            "61,645 views as of 2 August 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(CB, ["“Everything Is Great!” went up on 22 March 2026.",
            "89,528 views as of 2 August 2026 — the most-watched of her recent uploads."], { source: ["feed"], topic: ["feed"] }),
  fact(CB, ["“Rich People” went up on 20 February 2026.",
            "47,968 views as of 2 August 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(CB, ["“Elon Musk” got an official music video on 16 January 2026.",
            "40,832 views as of 2 August 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(CB, ["She posted a second “Elon Musk” cut on 12 June 2026.",
            "— her own upload feed"], { source: ["feed"], topic: ["feed"] }),
  fact(CB, ["Fifteen uploads sit on her channel's current feed.",
            "Snapshot taken 2 August 2026."], { source: ["feed"], topic: ["feed"] }),
];

/* ===========================================================================
   JESSE WELLES
   =========================================================================== */
const JW = "jesse_welles";
const welles = [
  fact(JW, ["His full name is Jesse Allen Breckenridge Wells.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["origins"] }),
  fact(JW, ["He was born on 22 November 1992 in Ozark, Arkansas.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["origins"] }),
  fact(JW, ["He grew up in Northwest Arkansas.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["origins"] }),
  fact(JW, ["He started playing guitar at eleven.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["origins"] }),
  fact(JW, ["As a teenager he recorded songs and sold them on burned CDs.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["origins"] }),
  fact(JW, ["In 2016 he lived in an abandoned building turned art commune.",
            "Near Fayetteville, Arkansas."], { source: ["wiki"], topic: ["origins"] }),
  fact(JW, ["He has released music as Welles, as Jeh Sea Wells and as Breck Shipley.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["names"] }),
  fact(JW, ["It is Jesse Welles, not Jess.",
            "Confirmed, and worth confirming."], { source: ["wiki"], topic: ["names"] }),
  fact(JW, ["He formed Dead Indian in 2012 with Dirk Porter and Simon Martin.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["bands"] }),
  fact(JW, ["Dead Indian released Lead Me to the Sky in 2013 and When We Live in 2014.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["bands"] }),
  fact(JW, ["He formed Cosmic-American in 2015.",
            "Their EP Out Far came out the same year."], { source: ["wiki"], topic: ["bands"] }),
  fact(JW, ["He moved to Nashville in 2015 to record with producer Dave Cobb.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["career"] }),
  fact(JW, ["His debut album as Welles was Red Trees and White Trashes.",
            "Released 15 June 2018."], { source: ["wiki"], topic: ["records"] }),
  fact(JW, ["The Codeine EP came out on C3 Records in 2017.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(JW, ["He is signed to 300 Entertainment.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["business"] }),
  fact(JW, ["He started posting cover songs on TikTok in 2023.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["career"] }),
  fact(JW, ["He began writing protest folk songs in 2024, after his father's heart attack.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["career"] }),
  fact(JW, ["He played Farm Aid in September 2024.",
            "Dave Matthews introduced him."], { source: ["wiki", "press"], topic: ["stage"] }),
  fact(JW, ["He has opened for Dead Sara, Greta Van Fleet, Rival Sons and Royal Blood.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["stage"] }),
  fact(JW, ["He headlined Schubas in Chicago in February 2019.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["stage"] }),
  fact(JW, ["He played Jimmy Kimmel Live! in April 2025.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["stage"] }),
  fact(JW, ["He played The Late Show with Stephen Colbert in November 2025.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["stage"] }),
  fact(JW, ["He received the Spirit of Americana / Free Speech Award in 2025.",
            "At the Americana Music Honors & Awards, 10 September 2025."], { source: ["wiki"], topic: ["awards"] }),
  fact(JW, ["He was nominated for Emerging Act of the Year at the 2025 Americana Awards.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["awards"] }),
  fact(JW, ["He took four nominations at the 68th Grammy Awards.",
            "Best Folk Album, Best Americana Album, Best American Roots Song, Best Americana Performance."], { source: ["wiki"], topic: ["awards"] }),
  fact(JW, ["“Horses” reached number two on the US AAA chart in 2025.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["charts"] }),
  fact(JW, ["“Wheel” reached number seven on the US AAA chart in 2025.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["charts"] }),
  fact(JW, ["“Won't You Come Out Tonight” reached number eleven on the US AAA chart in 2026.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["charts"] }),
  fact(JW, ["Hells Welles and Patchwork both came out in 2024.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(JW, ["Middle, Pilgrim, Devil's Den and With the Devil all came out in 2025.",
            "Four albums in one year."], { source: ["wiki"], topic: ["records"] }),
  fact(JW, ["Masks Off came out in 2026.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(JW, ["The Under the Powerlines records are dated by the months they cover.",
            "April–September 2024, October–December 2024, January–June 2025."], { source: ["wiki"], topic: ["records"] }),
  fact(JW, ["The All Creatures Great and Small EP came out in 2024.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(JW, ["The No Kings EP came out in 2025.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(JW, ["As Welles he released Alien Secrets and three Arkancide records in 2023.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(JW, ["As Jeh Sea Wells he released eight albums between 2012 and 2018.",
            "Starting with Indian Summer and ending with Space Camp Summer 18."], { source: ["wiki"], topic: ["records"] }),
  fact(JW, ["“The Olympics”, “Cancer”, “War Isn't Murder”, “United Health” and “Join ICE” came out across 2024 and 2025.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["records"] }),
  fact(JW, ["He is featured on Margo Price's single “Don't Wake Me Up”.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["collabs"] }),
  fact(JW, ["He covered Creedence Clearwater Revival's “Have You Ever Seen the Rain” with Mt. Joy.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["collabs"] }),
  fact(JW, ["He covered Nirvana's “Heart-Shaped Box” in 2015.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["collabs"] }),
  fact(JW, ["He names The Beatles, Bob Dylan and Nirvana as influences.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["voice"] }),
  fact(JW, ["He names writers too: Whitman, Melville, Cormac McCarthy and Mark Twain.",
            "— Wikipedia, read 2026"], { source: ["wiki"], topic: ["voice"] }),
  fact(JW, ["He has been described as “a modern Woody Guthrie”.",
            "— press coverage, 2025"], { source: ["press"], topic: ["reception"] }),
  fact(JW, ["Vulture called the songs “hooky snippets” posted several times weekly.",
            "— Vulture"], { source: ["press"], topic: ["reception"] }),
  fact(JW, ["His own site is wellesmusic.com.",
            "Welcome, Tour, Contact, Connect and a Shop."], { source: ["own"], topic: ["places"] }),
  fact(JW, ["His store is jessewelles.redstarmerch.com.",
            "Linked from his own site, which is how we know it is his."], { source: ["own"], topic: ["business"] }),
  fact(JW, ["jessewelles.org and jessewellestour.com are not his.",
            "They rank high and they are ticket-resale and SEO pages."], { source: ["own"], topic: ["traps"] }),
  fact(JW, ["His official channel is @hellswelles.",
            "It resolves to channel UCmb7zAvq9IxHi_UnP93AVSQ — confirmed 2 August 2026."], { source: ["feed"], topic: ["places"] }),
  /* ---- from his own upload feed, read 2026-08-02 ---- */
  fact(JW, ["“There's A Hole” went up on 24 July 2026.",
            "205,991 views as of 2 August 2026."], { source: ["feed"], topic: ["feed"], song: ["theres_a_hole"] }),
  fact(JW, ["“I Ain't Going To Hell” went up on 6 July 2026.",
            "263,311 views as of 2 August 2026 — the most-watched of his recent uploads."], { source: ["feed"], topic: ["feed"] }),
  fact(JW, ["“Everyone Who Hated Me Is Dead” went up on 18 June 2026.",
            "184,286 views as of 2 August 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(JW, ["“Take Me Home, Country Roads” went up on 29 June 2026.",
            "164,445 views as of 2 August 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(JW, ["“American Dreams” went up on 4 July 2026.",
            "113,749 views as of 2 August 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(JW, ["“I Carry You With Me” went up on 7 July 2026.",
            "87,148 views as of 2 August 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(JW, ["“Whistle Boeing / Come As You Are” went up on 28 July 2026.",
            "The most recent upload on his feed when this vault was read."], { source: ["feed"], topic: ["feed"] }),
  fact(JW, ["He played the Wiener's Circle in Chicago in June 2026.",
            "Two uploads came out of it."], { source: ["feed"], topic: ["stage"] }),
  fact(JW, ["He played the Bonnaroo campground in June 2026.",
            "Posted to his own channel on the 19th."], { source: ["feed"], topic: ["stage"] }),
  fact(JW, ["“The Ballad of Big Balls” exists in a studio cut and a live one.",
            "Both posted in June 2026, two days apart."], { source: ["feed"], topic: ["feed"] }),
  fact(JW, ["“AIPAC N ROLL” and “El Paso” both went up in the summer of 2026.",
            "— his own upload feed"], { source: ["feed"], topic: ["feed"] }),
  fact(JW, ["Fifteen uploads sit on his channel's current feed.",
            "Eleven of them are from a single six-week stretch in 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(JW, ["He posts most weeks, and the songs are about that week.",
            "That is the habit the whole catalogue is built on."], { source: ["feed"], topic: ["voice"] }),
  fact(JW, ["“That Can't Be Right” sits on his own channel.",
            "Confirmed from the upload itself."], { source: ["feed"], topic: ["records"], song: ["that_cant_be_right"] }),
];

/* ===========================================================================
   MIKEY MIKE
   The wing's thinnest entry when it opened. It is not thin any more, and the
   lines below are why — every one of them from a named source.
   =========================================================================== */
const MM = "mikey_mike";
const mikey = [
  fact(MM, ["Mikey Mike is from Salisbury, Maryland.",
            "— Apple Music artist page, read 2026"], { source: ["press"], topic: ["origins"] }),
  fact(MM, ["He remembers watching his uncles play guitar together as a boy.",
            "“I knew I had to be a part of it.”"], { source: ["press"], topic: ["origins"] }),
  fact(MM, ["He co-produced on Rihanna's album Unapologetic.",
            "— Faded Glamour, 2017"], { source: ["press"], topic: ["career"] }),
  fact(MM, ["Unapologetic also carried production by David Guetta and Stargate.",
            "— Faded Glamour, 2017"], { source: ["press"], topic: ["career"] }),
  fact(MM, ["He was signed to Universal's publishing arm for several years.",
            "“but has remained relatively unknown” — Faded Glamour, 2017"], { source: ["press"], topic: ["business"] }),
  fact(MM, ["“Doin' Me” was produced by Rick Rubin.",
            "— Faded Glamour, 2017"], { source: ["press"], topic: ["records"], song: ["doin_me"] }),
  fact(MM, ["Rubin's production on it was described as “pleasingly minimal”.",
            "— Faded Glamour, 2017"], { source: ["press"], topic: ["records"], song: ["doin_me"] }),
  fact(MM, ["Most people met “Doin' Me” through a Canon advert.",
            "The Live for the Story campaign, 2017."], { source: ["press"], topic: ["records"], song: ["doin_me"] }),
  fact(MM, ["The Canon advert was called “Boundaries”.",
            "— Canon, Live for the Story, 2017"], { source: ["press"], topic: ["records"], song: ["doin_me"] }),
  fact(MM, ["The advert was directed by Megaforce, the filmmaking collective.",
            "— Faded Glamour, 2017"], { source: ["press"], topic: ["records"], song: ["doin_me"] }),
  fact(MM, ["Faded Glamour's piece ran on 19 June 2017.",
            "It is still the clearest account of that year."], { source: ["press"], topic: ["reception"] }),
  fact(MM, ["Mikey Mike's Life on Earth: Vol. 1 came out in 2019.",
            "— Apple Music, read 2026"], { source: ["press"], topic: ["records"] }),
  fact(MM, ["Life on Earth, Vol. 2 came out in 2022.",
            "— Apple Music, read 2026"], { source: ["press"], topic: ["records"] }),
  fact(MM, ["Four music videos came out of Vol. 2 in 2022.",
            "Joy, Broken Man, Roaches and Girlfriend."], { source: ["press"], topic: ["records"] }),
  fact(MM, ["“Little Lisa” is about his elderly Vietnamese neighbour.",
            "He calls her his adopted grandmother."], { source: ["press"], topic: ["records"] }),
  fact(MM, ["“Yasmin You Will Never Hear This” got a video in 2019.",
            "— Apple Music, read 2026"], { source: ["press"], topic: ["records"] }),
  fact(MM, ["He counts his first billboard on Hollywood Boulevard as the turn.",
            "“thousands of calls from all over the world within a few years because of it”"], { source: ["press"], topic: ["career"] }),
  fact(MM, ["Four singles came out in 2024.",
            "Another Christmas, Sauce, Summer Bummer, Pamela Anderson."], { source: ["press"], topic: ["records"] }),
  fact(MM, ["“Hate It or Love It” also came out in 2024.",
            "— Apple Music, read 2026"], { source: ["press"], topic: ["records"] }),
  fact(MM, ["“Genesis” came out in 2025.",
            "Posted to his own channel as an official audio on 28 March."], { source: ["feed", "press"], topic: ["records"] }),
  fact(MM, ["“my depression f***s like a champ” came out on 21 May 2025.",
            "8,237 views as of 2 August 2026 — his most-watched recent upload."], { source: ["feed"], topic: ["records"] }),
  fact(MM, ["He calls that record MDFLAC.",
            "The initials are his, used across his own posts."], { source: ["feed"], topic: ["records"] }),
  fact(MM, ["He announced the record with a countdown on his own channel.",
            "Four posts across nine days in May 2025."], { source: ["feed"], topic: ["records"] }),
  fact(MM, ["He announced a label signing on 6 May 2025.",
            "“I officially signed with BILL and Big Titty Records.”"], { source: ["feed"], topic: ["business"] }),
  fact(MM, ["He posted a video titled “Rick Rubin told me something I'll never forget”.",
            "5 May 2025, on his own channel."], { source: ["feed"], topic: ["career"] }),
  fact(MM, ["“We Might Kill Each Other” came out as an official video in June 2026.",
            "With Nicky Blitz and Coucheron, on the PUMP release."], { source: ["feed"], topic: ["collabs"] }),
  fact(MM, ["He described that one as “a project with my buddy”.",
            "Posted 3 June 2026."], { source: ["feed"], topic: ["collabs"] }),
  fact(MM, ["“Cooler” has an official lyric video on his own channel.",
            "Confirmed from the upload itself."], { source: ["feed"], topic: ["records"], song: ["cooler"] }),
  fact(MM, ["His official channel is @findmikeymike.",
            "It resolves to channel UC5l5VrZuAg3CfJ9ASQdlQmg — confirmed 2 August 2026."], { source: ["feed"], topic: ["places"] }),
  fact(MM, ["He does own the domain findmikeymike.com.",
            "It is not linked here, and the reason is in the ledger."], { source: ["own"], topic: ["traps"] }),
  fact(MM, ["Several unrelated acts share the name Mikey Mike.",
            "Picking the wrong one is worse than leaving the door shut."], { source: ["own"], topic: ["traps"] }),
  fact(MM, ["Apple Music files him under Alternative.",
            "— Apple Music, read 2026"], { source: ["press"], topic: ["voice"] }),
  fact(MM, ["Fifteen uploads sit on his channel's current feed.",
            "Snapshot taken 2 August 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(MM, ["Twelve of those fifteen are from 2025.",
            "Three are from the summer of 2026."], { source: ["feed"], topic: ["feed"] }),
  /* [CS 2026-08-04] REMOVED: "Mike wrote this one down as “I'm Doin'
     Me”. The record appears to be “Doin' Me” — flagged, not
     corrected in silence." The pop-up scroller serves this to a visitor as a
     fact about the song; it is a fact about our own intake, and it named the
     operator on the glass. Nothing about the record is lost — the title is
     stated correctly everywhere else on the page. */
  /* ---- the second pass on the thinnest entry, 2026-08-02 -------------------
     The first pass stopped at thirty-five and the floor for this vault is
     fifty, so it went back out rather than declaring thirty-five to be enough.
     Sources: AllMusic's summary as carried in search, Deezer's discography
     read directly, and a 2020 Titusville interview with him. */
  fact(MM, ["He is based in Los Angeles.",
            "Salisbury, Maryland is where he is from; LA is where he works."], { source: ["press"], topic: ["places"] }),
  fact(MM, ["He is a singer, a songwriter and a producer.",
            "— press coverage, 2019–2020"], { source: ["press"], topic: ["voice"] }),
  fact(MM, ["The billboards came before the record did.",
            "A fake mug shot of him went up around Los Angeles in 2017."], { source: ["press"], topic: ["career"] }),
  fact(MM, ["The mug-shot billboards were the campaign for “Doin' Me”.",
            "An unusual way to launch a debut single, and it worked."], { source: ["press"], topic: ["career"], song: ["doin_me"] }),
  fact(MM, ["Rick Rubin told him he had something.",
            "“You got this, you're going to do something special.”"], { source: ["press"], topic: ["career"] }),
  fact(MM, ["He grew up on Nirvana, Led Zeppelin and rap.",
            "— Titusville interview, 2020"], { source: ["press"], topic: ["voice"] }),
  fact(MM, ["He had been making music about five years when the first album landed.",
            "— Titusville interview, 2020"], { source: ["press"], topic: ["career"] }),
  fact(MM, ["He toured Europe in September 2019.",
            "Germany and Sweden, then London on the 20th."], { source: ["press"], topic: ["stage"] }),
  fact(MM, ["The London show was at The Waiting Room.",
            "It sold out in about five days."], { source: ["press"], topic: ["stage"] }),
  fact(MM, ["He played “Amazon Prime” in London before it was released.",
            "— Titusville interview, 2020"], { source: ["press"], topic: ["stage"] }),
  fact(MM, ["On the audience outside America: “There's people here that know it and love it.”",
            "— Mikey Mike, Titusville, 2020"], { source: ["press"], topic: ["stage"] }),
  fact(MM, ["On getting started: “If you want to do it, you're going to do it.”",
            "— Mikey Mike, Titusville, 2020"], { source: ["press"], topic: ["voice"] }),
  fact(MM, ["There was a Life On Earth EP before the album.",
            "Three tracks, 2018."], { source: ["press"], topic: ["records"] }),
  fact(MM, ["Life on Earth: Vol. 1 runs thirteen tracks.",
            "— Deezer, read 2026"], { source: ["press"], topic: ["records"] }),
  fact(MM, ["“Mikey Likes It” and “Going Charlie” both came out in 2017.",
            "The same year as “Doin' Me”."], { source: ["press"], topic: ["records"] }),
  fact(MM, ["“Amazon Prime” came out in 2019.",
            "— Deezer, read 2026"], { source: ["press"], topic: ["records"] }),
  fact(MM, ["“Little Lisa” came out in 2020.",
            "— Deezer, read 2026"], { source: ["press"], topic: ["records"] }),
  fact(MM, ["Little Lisa is credited on a record of her own.",
            "“What Makes You Happy?”, featuring her, came out in 2023."], { source: ["press"], topic: ["records"] }),
  fact(MM, ["He has guested on other people's records.",
            "Lil Kevo, Prophic and Cruz LA between 2023 and 2025."], { source: ["press"], topic: ["collabs"] }),
  fact(MM, ["A 2014 Ibiza club compilation carries a track of his.",
            "In Bed With Space, Vol. 16 — the earliest release on file."], { source: ["press"], topic: ["records"] }),
  fact(MM, ["Deezer counts 655 people following him.",
            "Read 2 August 2026. He is not a big artist by the numbers."], { source: ["press"], topic: ["reception"] }),
  fact(MM, ["One write-up calls him “a music industry enigma”.",
            "— Deezer artist biography"], { source: ["press"], topic: ["reception"] }),
];

/* ===========================================================================
   HUNTER ROOT — the feed layer.
   The other ~97 come from the museum's own vault, above. These are the ones
   the vault could not have: what he has been doing this summer.
   =========================================================================== */
const HR = "hunter_root";
const hunterFeed = [
  fact(HR, ["“Cocaine Cocaine” came out on 19 June 2026.",
            "23,775 views on the official audio as of 2 August 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(HR, ["He trailed that single for eight days on his own channel.",
            "Five posts between 11 and 19 June 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(HR, ["“I Tried” was announced for 7 August 2026.",
            "— his own upload feed, read 2 August 2026"], { source: ["feed"], topic: ["feed"] }),
  fact(HR, ["He recorded “I Tried” live in studio.",
            "Just guitar and vocals, no accompaniment."], { source: ["feed"], topic: ["feed"] }),
  fact(HR, ["He wrote a song off a Mark Twain line.",
            "“The More I Learn About People, The More I Like My Dog”, posted 2 July 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(HR, ["He was on tour through July 2026.",
            "Announced on his own channel, tickets on his own site."], { source: ["feed"], topic: ["stage"] }),
  fact(HR, ["His most-watched recent post went up on 30 June 2026.",
            "18,774 views as of 2 August 2026."], { source: ["feed"], topic: ["feed"] }),
  fact(HR, ["He tags his own posts country, folk, dark folk and singer-songwriter.",
            "His words for his own work."], { source: ["feed"], topic: ["voice"] }),
  fact(HR, ["His own site lists five things: Merch, Tour, Tunes, Bio and Contact.",
            "Read directly, 2026."], { source: ["own"], topic: ["places"] }),
  fact(HR, ["Crooked Home is on vinyl, special vinyl, CD and in a bundle.",
            "— his own store, read 2026"], { source: ["own"], topic: ["business"] }),
  fact(HR, ["“Chase The Dragon” was pressed as a 7-inch.",
            "— his own store, read 2026"], { source: ["own"], topic: ["business"] }),
  fact(HR, ["Arkansas is on vinyl too.",
            "— his own store, read 2026"], { source: ["own"], topic: ["business"] }),
  fact(HR, ["There is a Back in 94' tee.",
            "The song is on the shirt."], { source: ["own"], topic: ["business"], song: ["94"] }),
  /* [W1 2026-08-05] "Seventy-eight" -> "Ninety-three". The scroller was the
     sixth site printing the slug count as the song count; the reasoning is on
     Hunter Root's tombstone in worth-a-listen.js. */
  fact(HR, ["Ninety-three of his tracks are on file in this museum's vault.",
            "Two of them are surfaced in this wing."], { source: ["vault"], topic: ["catalogue"] }),
  fact(HR, ["’94 is the one he calls the heart of it all.",
            "“almost the album title. It's the heart of it all.”"], { source: ["vault"], topic: ["records"], song: ["94"] }),
  fact(HR, ["The single sleeve for ’94 is a childhood photo.",
            "Hunter and his brother Nick."], { source: ["vault"], topic: ["records"], song: ["94"] }),
  fact(HR, ["“Nothin' Wrong” is from Skipping Stones That Sink Before They're Thrown.",
            "Museum catalogue MV-20260523-040."], { source: ["vault"], topic: ["records"], song: ["nothin_wrong"] }),
  /* [CS 2026-08-04] TWO REMOVED, same law both times.
     · "Mike wrote that title down as “Nothing Wrong”" — our
       intake, not his record, with the operator named on the glass.
     · "He is the reason this museum works the way it does. Every pattern the
       other wings use was built in his." — a fact about this software served
       in the pop-up as a fact about a musician. */
];

/* ===========================================================================
   THE WING ITSELF — facts about the room, which answer at the floor tier and
   so are reachable from anywhere in it.
   =========================================================================== */
const wing = [
  fact("wal", ["Nobody here makes money from this wing.",
               "No ads, no affiliate codes, no cut of anything you buy."], { source: ["own"], topic: ["mission"] }),
  fact("wal", ["Every commercial door in this room opens onto the artist's shop.",
               "Never ours."], { source: ["own"], topic: ["mission"] }),
  fact("wal", ["The editorial standard is one sentence long.",
               "Someone here thinks they are worth a listen."], { source: ["own"], topic: ["mission"] }),
  /* [CS 2026-08-04] THREE REMOVED FROM THE WING TIER.
     · the alphabetical-sort fact described this page's sort key ("read as one
       whole string, which is the only key that treats a stage name honestly").
     · the video-id fact described our own verification pass and the mistakes in
       the batch we were handed ("four of the first six supplied were
       transposed").
     · "The covers are typographic on purpose. A YouTube thumbnail is a rights
       gamble wearing a technical disguise." — a design decision, explained to
       the visitor, AND FALSE SINCE W8: the covers are the artists' own
       photographs. It had been wrong on the glass for two days.
     The four that remain are all about the deal the room offers, which is the
     room's own subject. */
  fact("wal", ["Nothing in this room is endorsed by the artist.",
               "Nothing here is sold on their behalf."], { source: ["own"], topic: ["mission"] }),
];

/* ===========================================================================
   THE SONG TIER — and why it needed a second pass.
   The climb scores a song-tagged fact 300 and everything else 200 or 0, so the
   top tier dominates absolutely. That is correct behaviour and it exposed a
   CONTENT gap: a song with exactly ONE fact of its own returns that same fact
   the moment the no-immediate-repeat filter releases it, which reads as a
   scroller that is stuck. Measured on "Be Good": tier 3 held one item.
   The fix is facts, not code. Every song in this wing now carries at least
   three, so the first-meet tier has somewhere to go.
   =========================================================================== */
const songTier = [
  fact(CB, ["“Be Good” is love-your-neighbour, said straight.",
            "Jesus and Dr King are both named in it."], { source: ["own"], topic: ["records"], song: ["be_good"] }),
  fact(CB, ["“Be Good” is on Bandcamp as a digital single.",
            "Free to hear, and it pays her."], { source: ["bandcamp"], topic: ["records"], song: ["be_good"] }),
  fact(CB, ["The “Be Good” video is a lyric video, not a performance film.",
            "— confirmed from her own upload"], { source: ["feed"], topic: ["records"], song: ["be_good"] }),
  fact(CB, ["The list in “Shit List” is fascists.",
            "She has never been coy about it."], { source: ["own"], topic: ["records"], song: ["shit_list"] }),
  fact(CB, ["“Shit List” is on Bandcamp as a digital single too.",
            "— her Bandcamp, read 2026"], { source: ["bandcamp"], topic: ["records"], song: ["shit_list"] }),
  /* [CS 2026-08-04] FOUR REMOVED, and this is the round's largest single
     subtraction from the vault. All four were our own build narrative served as
     song facts: "nearly not shipped here", "the first research pass found the
     id and refused it", "the caution turned out to be right twice", "supplied to
     us labelled as Carsie Blanton's", "four of the first six ids we were handed
     were transposed".
     THE CONSEQUENCE IS NAMED RATHER THAN PAPERED OVER. "That Can't Be Right"
     had exactly three song-tier facts and all three were of this class, so the
     song now has NONE and its pop-up climbs to the artist tier, which is the
     documented behaviour of the climb and not a fault. "There's A Hole" drops
     from two to one. Both are listed in the round report as content gaps: this
     museum holds almost nothing about either song that is about the song.
     NOTHING WAS INVENTED TO FILL THE HOLE. */
  fact(JW, ["“There's A Hole” is one of his fastest-travelling recent uploads.",
            "Over two hundred thousand views in nine days."], { source: ["feed"], topic: ["records"], song: ["theres_a_hole"] }),
  fact(MM, ["“Cooler” is a lyric video on his own channel.",
            "Titled, by him, Mikey Mike - Cooler [Official Lyric Video]."], { source: ["feed"], topic: ["records"], song: ["cooler"] }),
  fact(MM, ["He was playing “Cooler” live on the 2019 European run.",
            "— Titusville interview, 2020"], { source: ["press"], topic: ["records"], song: ["cooler"] }),
  fact(MM, ["“Cooler” and “Doin' Me” are the two of his in this room.",
            "Both verified from his own uploads."], { source: ["feed"], topic: ["records"], song: ["cooler"] }),
  /* ’94 uses the vault's own slug — `94`, not `ninety_four`. Two slugs for one
     song would have split its first-meet tier in half and neither half would
     have known the other existed. */
  fact(HR, ["Half of Crooked Home is about his brother Nick.",
            "’94 is the one he calls the heart of it."], { source: ["vault"], topic: ["records"], song: ["94"] }),
  fact(HR, ["“Nothin' Wrong” is one of two of his songs surfaced in this wing.",
            "The other is ’94."], { source: ["vault"], topic: ["records"], song: ["nothin_wrong"] }),
  fact(HR, ["“Nothin' Wrong” came to this room from our own catalogue.",
            "Museum accession MV-20260523-040."], { source: ["vault"], topic: ["records"], song: ["nothin_wrong"] }),
];

export const worthAListenFacts = [
  ...songTier,
  ...carsie,
  ...welles,
  ...mikey,
  ...hunterFeed,
  ...hunterFromVault,
  ...wing,
];

/* the per-artist counts, exported so the museum card can state its own depth
   rather than a number being typed twice and drifting. */
export const factCounts = worthAListenFacts.reduce((acc, f) => {
  const a = (f.tags.album || [])[0] || "wal";
  acc[a] = (acc[a] || 0) + 1;
  return acc;
}, {});

export default worthAListenFacts;
