// src/data/artists/robots.js
// Hand-authored spine + config for the ROBOTS exhibit (/robots).
//
// SAME-ONLY-DIFFERENT: Robots is a real artist config driving the SAME
// Exhibit.jsx machinery as /hr and /wb — not a lookalike. Data differs;
// components do not.
//
// Contract consumed by Exhibit.jsx (see hunter-root-spine.js header):
//   album = { id, title, year, art, accent, tracks: [ track ] }
//   track = { id, title, videos: [ video ] }
//
// ---- E2/E3 2026-07-30: THE TRACKS CARRY FACES -------------------------------
// Videos are still EMPTY on every track — no footage is on file ([PAPA], the
// media pass). Before today that meant every track opened the template's
// no-video state: a dark panel with a grey play triangle. Mike killed it.
//
// A track may now carry a `face`, which is DATA, not a component:
//   face = { kind, title, blurb, still, action, lines }
//     kind    "monitor" | "plate" | "text"   (the container proposal's names)
//     title   the heading inside the panel
//     blurb   a short paragraph, in the exhibit's own register
//     still   optional image path
//     action  optional { label, event } — a button that fires a window event;
//             RobotsExhibitFlow listens and does the robots-specific thing, so
//             Exhibit.jsx keeps knowing nothing about twins.
//     lines   optional array of short lines (the register/log look)
// A track with neither videos NOR a face falls through to the template's own
// state exactly as before, so /hr and /wb cannot notice any of this.
//
// `viewerPoster` on the album is what the panel shows when nothing is playing
// and nothing is selected — see the note on it below.
//
// ---- B12 2026-07-30: TAGS (Q10) — FOUNDATION ONLY ---------------------------
// Albums and tracks may carry `tags: [string]`. This is the searchability
// foundation and NOTHING ELSE: no filter UI, no preset UI, no index emitter.
// SEARCH-FIRST is the ruling — a tag exists so a search can FIND an object,
// not so a preset can collect one.
//   - the vocabulary is flat and small, and a tag is a word a visitor might
//     actually type: "opa", "1965", "manual", "twin" — not a taxonomy;
//   - album tags are NOT copied down into their tracks. A query unions the
//     track's tags with its album's at read time; duplicating them into the
//     data is how a tag vocabulary starts disagreeing with itself;
//   - a missing `tags` is legal everywhere and means "no tags", so /hr and
//     /wb need no migration and cannot notice this exists.
// The OPA-class case the container proposal describes ("every artifact tagged
// opa, across every album") is a QUERY over this field. It is not built.

import RobotsExhibitFlow from "../../routes/robots/RobotsExhibitFlow.jsx";

/* ---- NO-COMING-SOON [Mike 2026-07-29 / R1 2026-07-30] ---------------------
   MGK-NIAC, NRU-2000 and the "Robots" findings-log album are all REMOVED from
   the carousel. The first two were house-logo art plus a single "Coming soon"
   track — placeholders earning nothing. R1 took the findings-log album too:
   THE CAROUSEL IS REAL ROBOTS ONLY, plus the purveyor's own album (below).
   Entries come back as data, in this file, when a family earns a photograph
   and a tracklist. No component changes needed. */
/* [S10] the WBR tracks, declared once and referenced by both covers. */
const WBR_TRACKS = [
      {
        id: "about",
        title: "Who We Are",
        videos: [],
        tags: ["about", "house", "purveyor"],
        face: {
          kind: "text",
          title: "WHO WE ARE",
          blurb:
            "Weird.Baby buys weird things, works out what they are, and sells " +
            "the ones that should go on living. The robots wing is the part of " +
            "that work which refused to stay a footnote.",
          lines: [
            "TRADE    we buy weird things and work out what they are",
            "TAGLINE  “Purveyors of the Weird.Baby.”",
          ],
          entries: [
            { stamp: "WHAT", title: "A purveyor, not a maker",
              line: "Four parties touched these machines and only one of them " +
                    "built anything. We are the one that arrived sixty years late.",
              note: "" },
            { stamp: "HOW", title: "Found, cleaned, returned",
              line: "Power first, then the glass, then the software — and only " +
                    "then the question of what any of it was for.",
              note: "" },
            { stamp: "WHY", title: "[PAPA]",
              line: "The house's own answer to the only question a visitor " +
                    "actually asks.",
              note: "[PAPA] — this one is Mike's and should stay Mike's" },
          ],
          footer: "“Restoration house” is not what we are. Weird.Baby is Weird.Baby.",
        },
      },
      {
        id: "faq",
        title: "FAQ",
        videos: [],
        tags: ["faq", "questions", "buying"],
        face: {
          kind: "text",
          title: "FREQUENTLY ASKED",
          blurb:
            "The questions that actually arrive, answered plainly. What is it, " +
            "does it work, is it for sale, and why does it know that.",
          entries: [
            { stamp: "Q", title: "Is it real?",
              line: "The hardware is. Everything the machine says about where " +
                    "it came from is the machine's account of it.",
              note: "[PAPA] — how straight to play this" },
            { stamp: "Q", title: "Does it still work?",
              line: "Yes. Power was the hard part, and it was solved — the " +
                    "batteries came back, and the software followed.",
              note: "[PAPA]" },
            { stamp: "Q", title: "How many are there?",
              line: "31.4. The fraction is not a typo and we are not going to " +
                    "explain it.",
              note: "" },
            { stamp: "Q", title: "Can I buy one?",
              line: "Some. Not all — several are held, and one is patient zero.",
              note: "[PAPA] — what to say about availability" },
            { stamp: "Q", title: "Why does it know that?",
              line: "It does not. It performs a calculation against a " +
                    "prescribed model, and it never pretends otherwise.",
              note: "" },
            { stamp: "Q", title: "Who is W.O.?",
              line: "Unknown. That is not a deflection — it is the honest " +
                    "state of the record, and it has been since the first box arrived.",
              note: "" },
          ],
          footer: "The answers a visitor gets should be shorter than these. " +
                  "[PAPA] — the final wording throughout.",
        },
      },
      {
        id: "contact",
        title: "Contact",
        videos: [],
        tags: ["contact", "provenance", "corrections"],
        face: {
          kind: "text",
          title: "CONTACT",
          blurb:
            "For provenance questions, corrections to the record, and anyone " +
            "who thinks they have seen one of these before.",
          entries: [
            { stamp: "PROVENANCE", title: "You have seen one before",
              line: "The most useful message we can receive. Where, when, and " +
                    "any number you can remember off it.",
              note: "" },
            { stamp: "CORRECTION", title: "The record is wrong",
              line: "It will be, in places — it was written as things happened " +
                    "and some of it was wrong on the day.",
              note: "" },
            { stamp: "PURCHASE", title: "Availability",
              line: "Which units are held, which are not, and what a case tier " +
                    "actually includes.",
              note: "[PAPA]" },
            { stamp: "REACH", title: "[PAPA]",
              line: "Address, and the decision about how much of it to publish.",
              note: "[PAPA] — a decision, not a writing task" },
          ],
        },
      },
];

const spine = [
  /* ---- S10 2026-07-30: THE COVER VARIANT, FAR LEFT ---------------------
     Mike's ruling: duplicate the Robots cover with the "Weird.Baby" wordmark
     replaced by THE WB MARK — the smiling baby in the ring, from the museum's
     own assets — and give the variant the first position in the deck.
     EVERYTHING ELSE IS HELD CONSTANT ON PURPOSE: same ground, same border,
     same "ROBOTS" setting, same rule, same strapline, same square. The only
     variable is wordmark-vs-mark, because that is the comparison being asked
     for. Generated by `tools/make_robots_cover.py` — not hand-composited, so
     a re-render cannot drift.
     THE TRACKS ARE SHARED BY REFERENCE, not copied. Two covers, one album's
     worth of content; a second copy of six faces would be two things to keep
     in step and one of them would eventually be wrong. */
  {
    id: "wbr-logo",
    title: "Weird.Baby Robots",
    year: null,
    tags: ["wbr", "house", "front-desk", "cover-variant"],
    art: "/robots/art/wbr-cover-logo.png",
    accent: null,
    viewerPoster: "/WeirdBaby_PhotoID.png",
    viewerPosterCaption: "Weird.Baby — purveyors of the weird.",
    tracks: WBR_TRACKS,
  },
  {
    id: "mgk-viiip",
    title: "MGK-VIIIp",
    year: 1965,
    tags: ["mgk", "viiip", "1965", "abeal", "machine"],
    /* [2026-07-29] B&W, and the glass carries the BIOS beat instead of a stale
       "LOADING SUCCESS" from a months-old flash. Generated from the twin's OWN
       ceremony — the framebuffer sampled at the labelled beat "the mark lands"
       in Charge_Front — then composited into the front-view photo at the
       measured portal aperture and printed to B&W. Provenance and the exact
       numbers: robots repo STATE.md, THE NIGHT RUN. */
    art: "/robots/art/viiip.png",
    accent: null,
    /* [E2] THE VIEWER'S DEFAULT — the family shot.
       Chosen over the alternatives on honesty: it is a real photograph of the
       two real units in one frame, already in the repo, already B&W, and it is
       the actual subject of the exhibit. The album cover was the runner-up and
       loses for being redundant (it is six inches to the left in the deck);
       a findings-log face loses because the log is words, and words are not a
       compelling thing to LAND on. */
    viewerPoster: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png",
    viewerPosterCaption:
      "MGK-VIIIp −02 “The Informer”, front and top, as received.",
    tracks: [
      {
        id: "portal",
        title: "The Portal",
        videos: [],
        tags: ["portal", "twin", "firmware", "1965", "interactive"],
        /* ---- O4 2026-07-30: THE PORTAL IS A TRACK, NOT A BUTTON ----------
           Mike's ruling. "Run the machine" was a verb on a shelf of nouns,
           and the thing behind it is not a demonstration — it is a DOORWAY.
           THE NAME IS THE REVELATION: the p in MGK-VIIIp meant PORTAL all
           along (CANON 2026-07-29), so the track does not need a name
           invented for it. It had one.
           THE FACE IS DELIBERATELY NOT A LOG SHEET. The manual and the record
           are paper, and they read as paper. This is a transition point —
           down the tunnel to something that behaves differently — so it wears
           the instrument register instead: dark ground, the SOURCE/GLASS/STATE
           block, presets like channel selections. A visitor should be able to
           feel the change of material before they read a word of it. */
        face: {
          kind: "portal",
          title: "THE PORTAL",
          subtitle: "MGK-VIIIp \u00b7 the p was never \u201cportable\u201d",
          blurb:
            "A camera is pointed at a running unit, somewhere, and the feed " +
            "arrives here. Source unknown, location unknown, reason unknown \u2014 " +
            "the frame does not explain itself. What comes through is not a " +
            "recording: it is the 1965 firmware, running, and it answers.",
          /* [L1 2026-07-31] THE FACE IS THE PORTAL (supersedes F1's placed
             photo for THIS track only — the manual and the record keep
             theirs, because a document is not a machine).
             The face runs the actual twin at face scale, doing all the things
             a portal does. `liveOpenPreset:null` means clicking it opens the
             STANDARD view — which is a recipe like any other, not a special
             path. The still stays in the file as the fallback the renderer
             uses when `live` is absent. */
          /* [G1 2026-07-31, Mike-ruled] THE FROZEN FACE (supersedes the live
             face). The face is a STATIC capture of the exact standard view a
             visitor gets when they click it — taken from THE MACHINE'S OWN
             RENDER by tools/capture_portal_face.js in the robots repo, running
             the STANDARD recipe. It cannot drift from its destination, because
             re-running the capture is how it is made.
             THE FICTION: the portal was paused to frozen. The fluidic heaters
             were not running; solidification at -31.4 F.
             The live face is ledgered A+++++++ and costs nothing now — page
             load boots no twin at all. */
          still: "/robots/art/portal-standard.png",
          stillCaption: "PORTAL · PAUSED TO FROZEN · −31.4 F",
          lines: [
            "SOURCE   MGK_VIIIp_01__20240721_WORKS",
            "GLASS    128\u00d764 front \u00b7 128\u00d764 top",
            "FEED     1 of 5 \u00b7 quality drawn per session",
            "STATE    cold start \u2014 boot is mandatory",
          ],
          /* [PAPA] the richer wording for the subtitle and the blurb. What is
             here is house register and true; what is missing is the lore only
             Mike can put in a visitor's mouth. */
          papa: "[PAPA] \u2014 the Portal's own words: what the frame is, and how " +
                "much of the three unknowns to say out loud on the way in.",
          action: { label: "Open the portal", event: "wb-robots-open-twin" },
          /* ---- THE PRESETS ------------------------------------------------
             THE MECHANISM IS THE DELIVERABLE; the list is expected to grow.
             A preset is DATA: an id the twin knows, a label, one line of what
             it does. The museum never reaches into the machine — it hands the
             id across the boundary in the URL, and an id the twin does not
             know degrades to a plain portal rather than to a wrong one.
             CLEAN BOOT and BOOT PLAYBACK are wired and run today.
             RECORD-DAY is the frame with two honest examples: a day is a
             weather seed plus an install level plus which correspondence had
             arrived, and only the first of those three is exact yet. The
             Record has 436 entries and will supply the rest. */
          /* ---- F2 2026-07-31: FINE DINING, NOT A BUFFET (Mike, doctrine) ---
             "Not an all-you-can-eat buffet; this is fine dining."
             FOUR presets and two cross-references made this face a menu of
             everything the machinery can do. That is a spec sheet, not an
             invitation: a visitor standing in front of a doorway does not
             want four doors and a bibliography, they want THE door.
             SO: ONE BUTTON. The generic unit, already past first boot - which
             is the machine's own default since S3, so this entry carries no
             preset id at all and the portal opens exactly as it comes.
             THE MACHINERY IS UNTOUCHED AND STAYS BUILT. clean-boot,
             boot-playback and record-day are all still wired end to end, in
             the twin and across the URL boundary; only their BUTTONS are
             gone. They come back one at a time, when the storyline has a
             reason to tempt someone with them - which is worth more than
             having them all on the shelf on day one.
             [FR2 2026-07-31] AND `id: null` = no preset param WAS THE BUG.
             "The plain portal, deliberately" sounded like restraint and read
             to the machine as "apply nothing": Portal_Preset_Apply returns
             early on a null id, so the one entry every visitor takes was the
             only one that asked the machine for nothing — and what it got was
             the twin's own default, which is POWERED OFF. The frozen face
             promised a running unit and the click delivered a dark one.
             Every entry names its recipe now. */
          /* ---- L2 2026-07-31: RECIPES, NOT A BUTTON SEA -------------------
             A dropdown in the house register, urgent-and-important at the
             top. Each entry is a RECIPE the machine knows by name (see
             PORTAL_RECIPES in the twin) — named state deltas, so a new one is
             a row here and a row there, and Mike can direct it in plain
             language.
             `state` drives the rendering, not the wiring:
               live    selectable now
               held    listed, deliberately not wired — carries `why`
             TWO ARE NOT WIRED, ON PURPOSE, AND BOTH ARE FLAGGED:
             LAST STATE and TEST BENCH. See STATE, the L2 entry. */
          presetsLabel: "ARRIVE AS",
          presets: [
            { id: "standard", label: "STANDARD", state: "live",
              line: "A unit that has been running for sixty years and has met " +
                    "you before — and, if you were here a moment ago, " +
                    "exactly as you left it." },
            { id: "idling-updated", label: "IDLING, UPDATED", state: "live",
              line: "Powered, booted, updated, power-cycled, rebooted. Idle, " +
                    "and waiting to be asked something." },
            { id: "boot-playback", label: "BOOT PLAYBACK", state: "live",
              line: "Sandbox Tech replays the install exactly as it landed \u2014 " +
                    "step by step, without compromising it." },
            { id: "off-first-boot", label: "OFF \u00b7 FIRST BOOT PENDING", state: "live",
              line: "Dark. Never run. Waiting for someone to reach over and " +
                    "throw the switch." },
            /* [FR2] STILL HELD, and the distinction is the point: STANDARD
               now resumes WITHIN a browsing session, on a mark that dies with
               the window. This entry would carry state ACROSS visits, which
               is the part Mike has not ruled on. */
            { id: "last-state", label: "LAST STATE", state: "held",
              why: "awaiting a privacy ruling",
              line: "However you left it, across visits \u2014 not within one, " +
                    "which STANDARD now does on its own." },
            { id: "test-bench", label: "TEST BENCH", state: "held",
              why: "dev entry, by URL",
              line: "The workshop, with the panels showing. Reachable at " +
                    "?preset=test-bench; not a door for visitors." },
          ],
        },
      },
      {
        id: "manual",
        title: "The Manual",
        videos: [],
        tags: ["manual", "plate", "1965", "scan", "opa"],
        /* HONEST v1: a face that says what the object is and what state it is
           in. No plates yet — the scans are Mike's to make — and no
           "coming soon", because a face that describes the artifact is not a
           promise, it is a catalogue entry. */
        face: {
          kind: "plate",
          title: "THE OWNER'S MANUAL",
          blurb:
            "The unit shipped with a manual, and the manual is where the " +
            "machine explains itself — including the parts it gets wrong. " +
            "Page images, not transcription: the typography is the evidence.",
          lines: [
            "FORMAT  page plates, original look-and-feel",
            "NAV     microfiche-style scrub (designed, not built)",
            "PLATES  not yet imaged",
          ],
          /* THE CONTENTS PAGE, WHICH IS REAL EVEN THOUGH THE PLATES ARE NOT.
             Every section below is attested in the record or in the firmware;
             what is missing is the IMAGE of the page, and each row says so
             rather than pretending otherwise. */
          entries: [
            { stamp: "§ 1", title: "Start-up procedure",
              line: "One of the two items present in every generic unit's " +
                    "inbox from the moment the OS is installed — never “sent”.",
              note: "attested · plate not imaged" },
            { stamp: "§ 2", title: "Operating the answer engine",
              line: "Ask, then shake. The reveal holds until you disturb it; " +
                    "the machine never times your reading out.",
              note: "attested · plate not imaged" },
            { stamp: "§ 3", title: "Bias, and what it is for",
              line: "The polarity and clarity registers, described in the " +
                    "manual's own UNIVAC-corporate register.",
              note: "attested · plate not imaged" },
            { stamp: "§ 4", title: "BIST and AMMMS maintenance",
              line: "The built-in self test and the maintenance messaging — " +
                    "real lore, and the visual language already exists.",
              note: "attested · plate not imaged" },
            { stamp: "APP. 1", title: "The passcode landscape",
              line: "0000 through 80085, the tape, and the grid. A found " +
                    "artifact, not an objective — there is no game.",
              note: "the strongest candidate to image first" },
            { stamp: "MARGINS", title: "The hands in the margins",
              line: "Technicians' and owners' handwriting, scanned with the " +
                    "pages during cataloging. The margins are recovered evidence.",
              note: "[PAPA] — which hands, and what they wrote" },
          ],
          footer: "Page images are Mike's to make. Until they exist this is a " +
                  "catalogue entry, and it says so.",
        },
      },
      {
        id: "record",
        title: "The Record",
        videos: [],
        tags: ["journal", "record", "2024", "provenance"],
        face: {
          /* [S6 2026-07-30] THE RECORD OPENS ON ITS MOST RECENT ENTRY.
             A log that opens at the beginning is an archive; a log that opens
             at the end is a RECORD - it tells you where things stand and lets
             you walk back. `entriesMode:"log"` asks the viewer for the
             newest-first order and the period-true browse (S6); the entries
             below stay in the order they happened, because that is the truth
             and the presentation is the viewer's job. */
          kind: "text",
          entriesMode: "log",
          title: "THE RECORD",
          blurb:
            "The weekly log of the reverse-discovery: what arrived, what it " +
            "turned out to be, and what is still unexplained. Written as it " +
            "happened, which is not the order it makes sense in.",
          lines: [
            "SOURCE   The Record — 436 paragraph records, in repo",
            "INDEX    date-stamped, log-sheet register",
            "ORDER    as it happened, not as it makes sense",
          ],
          /* THE FIRST LAYER IS REAL. Ten entries, real dates, and one true
             sentence each, taken from the blog archive itself — not invented
             to fill a template. The full bodies are Mike's to place, and the
             [PAPA] rows are the ones where a summary would be putting words
             in the narrator's mouth. */
          entries: [
            { stamp: "01 JAN 24", title: "Three boxes",
              line: "An anonymous drop: three cartons, marked classified and " +
                    "fragile on every side, with a note taped to them signed “-W.O.”",
              note: "the note's full text is in the archive" },
            { stamp: "05 JAN 24", title: "Who is W.O.?",
              line: "The first entry. Three units are named on the boxing, " +
                    "and ABEAL is assumed — wrongly — to be their creator.",
              note: "" },
            { stamp: "12 JAN 24", title: "Something off about this drop",
              line: "Office supplies, personal items and cold-war hardware, " +
                    "no documentation, everything gathered in a rush.",
              note: "ABEAL is “a division of ScrapCo”" },
            { stamp: "19 JAN 24", title: "The One-Page-Ads",
              line: "The framed ads turn out not to be original: ABEAL " +
                    "retro-fitted other people's ads, with words covered and things taped down.",
              note: "" },
            { stamp: "26 JAN 24", title: "But we were wrong",
              line: "The retraction. ABEAL did not start it — they received " +
                    "the tech from someone else. They were responsible for the looks.",
              note: "the record correcting itself, in public" },
            { stamp: "02 FEB 24", title: "Logos and slogans",
              line: "The shirts are made from original elements off the " +
                    "boxing — which is the first mention that per-unit slogans exist.",
              note: "[PAPA] — the slogans themselves are unwritten" },
            { stamp: "09 FEB 24", title: "MGK-NIAC, and a name",
              line: "The original project title surfaces, and with it Carter " +
                    "Bookman — “his life is a mystery (some may say an Enigma??)”.",
              note: "" },
            { stamp: "16 FEB 24", title: "Ionizers and crushed walnut",
              line: "Restoration chemistry: the cases through the electronic " +
                    "ionizers, the body casings tumbled in crushed walnut.",
              note: "" },
            { stamp: "22 MAR 24", title: "Bias, in 1965",
              line: "Two engines — Prediction and Answer — both running off a " +
                    "changeable bias setting built before bias settings were a thing.",
              note: "" },
            { stamp: "05 APR 24", title: "The cases open",
              line: "Photographs of the three cases and their artifacts: a " +
                    "spy camera, a real telegraph, and a 1960s CEO's day.",
              note: "" },
          ],
          footer: "First layer only — ten of 436 records. The full entries, and " +
                  "the order they want to be read in, are [PAPA].",
        },
      },
    ],
  },
  /* ======== E3 2026-07-30: THE PURVEYOR'S OWN ALBUM ======================
     Mike, ASAP: a "Weird.Baby Robots" album — the house, not a machine. The
     basics a visitor looks for, in the house register, NOT a scripted story.
     Deliberately thin on lore: this is the front desk, not the exhibit.
     COVER ART IS A PLACEHOLDER — see the note on `art`. */
  {
    id: "wbr",
    title: "Weird.Baby Robots",
    year: null,
    tags: ["wbr", "house", "front-desk"],
    /* [E3 PLACEHOLDER — FLAGGED FOR SWAP]
       Mike is drawing a WBR logo. Until it lands this is a clean typographic
       cover in the house register, generated inline as an SVG data URI so it
       ships with the config and needs no asset: photo-paper ground, photo-black
       type, the wordmark stacked the way the deck's other covers letter it.
       It is a PLACEHOLDER THAT EARNS ITS PLACE under the no-coming-soon credo
       because the album behind it is real content — but it is still a
       placeholder, and the swap is one line: point `art` at the logo file. */
    art:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">' +
          '<rect width="600" height="600" fill="#d9d5ca"/>' +
          '<rect x="26" y="26" width="548" height="548" fill="none" stroke="#211f1c" stroke-width="2"/>' +
          '<text x="300" y="252" text-anchor="middle" fill="#211f1c" ' +
          'font-family="Georgia,serif" font-size="76" letter-spacing="2">Weird.Baby</text>' +
          '<text x="300" y="352" text-anchor="middle" fill="#211f1c" ' +
          'font-family="Georgia,serif" font-size="104" letter-spacing="10">ROBOTS</text>' +
          '<line x1="150" y1="392" x2="450" y2="392" stroke="#211f1c" stroke-width="2"/>' +
          '<text x="300" y="436" text-anchor="middle" fill="#57544d" ' +
          'font-family="Courier New,monospace" font-size="21" letter-spacing="6">PURVEYORS OF THE WEIRD</text>' +
        "</svg>"
      ),
    accent: null,
    viewerPoster: "/WeirdBaby_PhotoID.png",
    viewerPosterCaption: "Weird.Baby — purveyors of the weird.",
    tracks: WBR_TRACKS,
  },
];

export const robotsExhibit = {
  id: "robots",
  name: "Robots",
  exhibitSlug: "robots",
  eraAlias: {},
  spine,
  facts: [],
  defaultActiveIndex: Math.max(0, spine.findIndex(a => a.id === "mgk-viiip")),
  splitKey: "wb-rb-split",
  /* [S8] three tracks do not need half the screen. The viewer owns everything
     (S7), so it opens owning most of the width too; the splitter still moves
     freely from 10% to 82%. */
  splitDefault: 24,
  cfKey: "wb-rb-cfh",
  /* [X2 2026-07-30] BODY HEIGHT IS THE VISITOR'S. Declaring bodyKey grows the
     drag handle under the tracklist/viewer block and persists the height, the
     same way cfKey does for the carousel. /hr and /wb do not declare it and
     are untouched; adding it there is this one line. */
  bodyKey: "wb-rb-bodyh",
  visitPath: "/robots",
  shopExitParam: "robots",
  // [one-shop ruling] the template's Gift Shop entry stays IN the title bar
  // (present per template) but hidden for Robots — /shop is the one shop.
  shopEntryHidden: true,
  exhibitFlow: RobotsExhibitFlow,
};
