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
// ---- B9 2026-08-02: THE RECORD CARRIES EVIDENCE CLASSES ---------------------
// MIKE: "The Record needs to carry more than plates: photos, 'electronic data
// transmissions' and other evidence classes arrive long before units do.
// Extend the Record's content model to accept those classes (data-driven, no
// new species) so the binge has material."
//
// A log entry may now carry, all optional:
//   evidence  a WORD naming the class — "photograph", "transmission",
//             "document", "object", "correction", "record", anything. There is
//             NO permitted list in the code or the CSS: the renderer prints
//             what the data says. A class invented next month needs no build.
//   wire      array of short lines, drawn in the machine's register block —
//             the vocabulary this face already uses for a transmission,
//             borrowed rather than reinvented.
//   plates    array of { img, label, date } — the SAME shape the plate wall
//             and the microfiche reader take, so a photograph attached to a
//             Tuesday in 2024 opens in the identical reader as a plate off
//             the wall. That is what "no new species" buys.
// An entry declaring none of them renders exactly as it always did.
//
// THE PAYLOADS SHIP EMPTY AND THAT IS DELIBERATE. The classes below are read
// off each entry's own sentence and are Mike's to confirm; the `wire` and
// `plates` arrays are NOT populated, because the only photographs this
// repository holds are of the MGK unit as received and attaching them to
// entries about boxes, ads and restoration would be inventing provenance.
// The container is the deliverable; the evidence is Mike's to bring.
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
/* ===========================================================================
   [M11 2026-08-03] THE FRONT DESK, REWRITTEN TO THE PERSONALITY MAP.
   MIKE: "BURN DOWN AND REBUILD THE COPY — inherited from work not worthy of
   the task. Rewrite to the personality map. Documentation/register work, not
   Mike's creative voice; [PAPA] only where his words must land."
   THE MAP FOR THIS WING IS "liberal, artistic, creative, sci-fi." The copy
   that was here was none of those four: it was AUCTION-HOUSE DRY. Read it back
   and it is an inventory clerk describing stock — "we buy weird things and
   work out what they are", "the questions that actually arrive, answered
   plainly", "for provenance questions, corrections to the record". Every
   sentence true, every sentence flat.
   AND THE SUBJECT IS SCIENCE FICTION SITTING IN A BOX. Three cartons marked
   classified arrive on a dock with no sender. Inside is a machine built in 1965
   to say what happens next, running two engines called Prediction and Answer.
   Nobody knows who W.O. is. There are thirty-one and a half of them. The wing
   was telling that story in the voice of a stock list, and Mike is right that
   it was not worthy of it.
   THE RULE I HELD WHILE REWRITING: **not one new fact.** Every claim below
   already existed in this file — the four parties, the sixty years, the 31.4,
   the two engines, the prescribed model, the one address read by one person.
   This is a REGISTER change, which is what "documentation/register work, not
   Mike's creative voice" asks for. Where a sentence needed a POSITION rather
   than a fact, the [PAPA] marker that was already there stays exactly where it
   was — his list is unchanged in length and in content.
   =========================================================================== */
/* [S10] the WBR tracks, declared once and referenced by both covers. */
const WBR_TRACKS = [
      {
        id: "about",
        title: "Welcome",
        videos: [],
        tags: ["about", "house", "purveyor"],
        face: {
          kind: "text",
          title: "WELCOME",
          /* [F1 2026-08-03] THE VISUAL HOOK LAW, ON THE WING'S OWN FRONT DOOR.
             MIKE: land on words alone and the visitor probably walks out; every
             surface needs something visually compelling besides written words.
             THIS IS THE ROBOTS WING'S LANDING. /robots opens on this album and
             this track, so this face is the first thing a stranger sees of the
             machine wing — and it was a heading, a lead paragraph, two register
             lines and three entries, with no picture anywhere on it. The wing
             whose whole subject is a PHYSICAL OBJECT was introducing itself in
             prose, and the object was one track away the entire time.
             THE FAMILY SHOT IS THE RIGHT ONE OF THE EIGHT. It is the only
             photograph in the reference set that shows the machines as a GROUP
             — "three cartons of them arrived on a dock" is the lead sentence,
             and this is that sentence as a picture. The file is already in the
             build (the MGK-VIIIp album's `viewerPoster` and the first tile of
             The Plates), so nothing new is sourced and no rights question is
             opened. */
          still: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png",
          stillCaption: "The units, as they came to us.",
          blurb:
            "In 1965 somebody built a machine to say what happens next. Sixty " +
            "years later three cartons of them arrived on a dock with no " +
            "sender's name on them. This wing is everything we have worked out " +
            "since — and, more often, what we have not.",
          lines: [
            "TRADE    we buy strange things and find out what they are",
            "TAGLINE  “Purveyors of the Weird.Baby.”",
          ],

          /* [L6 2026-08-02] EVERY ENTRY NOW CARRIES A REAL DATE.
             D-WEEKLY-EVERYWHERE named this exactly: "The Record's `stamp` is a
             display string, not a date — it would need a real one." These are
             the dates the stamps already state, transcribed, not new facts —
             and with them the index can band by month, an automation can ask
             what is new this week, and a new entry needs only `date` because
             the stamp derives from it (record-model.js). The authored stamps
             stay, so nothing a visitor reads has moved. */
          entries: [
            { stamp: "WHAT", title: "A purveyor, not a maker",
              line: "Four parties have touched these machines and only one of " +
                    "them built anything. We are the ones who turned up sixty " +
                    "years late, with a screwdriver and no invitation.",
              note: "" },
            { stamp: "HOW", title: "Found, cleaned, returned",
              line: "Power first, then the glass, then the software. The " +
                    "question of what any of it was FOR came last, and it is " +
                    "still coming.",
              note: "" },
            /* [P23/P5 2026-08-02] THE ROW GETS A REAL TITLE.
               It was titled "[PAPA]" — the marker standing IN for the heading
               rather than annotating it — and with markers now scrubbed at the
               render seam (P5) that left a headless row on the page. The
               heading is the house's, the ANSWER is still Mike's, and the
               marker moves to the note where it belongs: his list survives,
               the visitor sees a finished row. */
            { stamp: "WHY", title: "Why we bother",
              line: "Because a machine that still runs is a machine still " +
                    "saying something, to nobody, in a language it was given " +
                    "before anyone here was born. Sixty years is nowhere near " +
                    "long enough for that to stop being worth listening to.",
              note: "[PAPA] — the real answer is Mike's and should stay Mike's" },
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
            "The questions people actually turn up with, and the answers as far " +
            "as they go. Some of them stop short. Those are the interesting ones.",
          entries: [
            { stamp: "Q", title: "Is it real?",
              line: "The hardware is — you can hold it, and it is heavier than " +
                    "you expect. Everything the machine says about where it came " +
                    "from is the machine's own account, and we print it as that.",
              note: "[PAPA] — how straight to play this" },
            { stamp: "Q", title: "Does it still work?",
              line: "It does. Power was the hard part and power was solved; the " +
                    "batteries came back, the software woke up behind them, and " +
                    "it went on doing what it was built to do as though nothing " +
                    "had happened.",
              note: "[PAPA]" },
            { stamp: "Q", title: "How many are there?",
              line: "Thirty-one and a half. The fraction is not a typo and we " +
                    "are not going to explain it.",
              note: "" },
            { stamp: "Q", title: "Can I buy one?",
              line: "Some of them. Not all — several are held, and one is " +
                    "patient zero and is going nowhere.",
              note: "[PAPA] — what to say about availability" },
            { stamp: "Q", title: "Why does it know that?",
              line: "It does not know anything. It runs a calculation against a " +
                    "model somebody prescribed for it in 1965, and it has never " +
                    "once pretended otherwise. Whether that is a comfort is a " +
                    "matter for the visitor.",
              note: "" },
            { stamp: "Q", title: "Who is W.O.?",
              line: "Nobody knows. That is not a deflection and it is not a " +
                    "tease — it is the honest state of the record, and it has " +
                    "been the honest state of the record since the first box " +
                    "was opened.",
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
            "Four reasons to write, in the order of how much they would help " +
            "us. The first one would help enormously.",
          entries: [
            { stamp: "PROVENANCE", title: "You have seen one before",
              line: "This is the message we most want to receive. An office, a " +
                    "basement, a photograph in somebody's shoebox — where, when, " +
                    "and any number you can still remember off the front of it.",
              note: "" },
            { stamp: "CORRECTION", title: "The record is wrong",
              line: "In places it certainly is. It was written as things " +
                    "happened, which means some of it was wrong on the day it " +
                    "was written and has been sitting there being wrong ever " +
                    "since. Tell us and it changes, in public.",
              note: "" },
            { stamp: "PURCHASE", title: "Availability",
              line: "Which units are held, which are not, and what is actually " +
                    "in a case when it leaves here.",
              note: "[PAPA]" },
            /* [P23/P5] same fix as the Welcome face: a real heading, the
               marker demoted to the note. */
            { stamp: "REACH", title: "How to reach us",
              line: "One address, read by one person. That is slow, and it is " +
                    "the same reason an answer from it is worth having.",
              note: "[PAPA] — the address itself, and how much of it to publish" },
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
      /* ==== [P23 2026-08-02] THE PLATE WALL ==================================
         MIKE: "All Weird.Baby ROBOTS pages need beautification and better text
         — a pass raising them toward the WAL/collage quality bar (structure and
         visuals)."
         THE WING'S PROBLEM WAS NEVER ITS WRITING. It was that a wing about a
         PHYSICAL OBJECT was made entirely of words: three faces of register
         lines and log entries, and eight real photographs of the machine
         sitting unused in `public/robots/reference/photos` — one of them
         serving as a poster nobody sees unless they land on the album with
         nothing selected.
         SO THE PHOTOGRAPHS COME OUT OF THE DRAWER. This is the WAL collage
         renderer, unchanged, pointed at the museum's own plates instead of at
         YouTube posters: the same glued-up wall, the same tilt, the same
         shadow, the same tap-to-open — which is exactly what "belongs beside
         the collage wall" means when the bar is set by that wall.
         THEY ARE OUR OWN IMAGES on our own origin, so there is no rights
         question here at all — the one that governs WAL's tiles does not
         arise. Captions are what the photograph SHOWS, in the wing's own
         register; the interpretation stays on the faces that already carry it.
         ================================================================== */
      {
        id: "plates",
        title: "The Plates",
        videos: [],
        tags: ["plates", "photographs", "viiip", "reference"],
        face: {
          kind: "text",
          title: "THE PLATES",
          subtitle: "MGK-VIIIp",
          /* [M11] register, not facts: the nine plates and what each shows are
             unchanged; what changed is that the sentence now says why the
             photographs were taken before anything was touched. */
          blurb:
            "Photographed the way you photograph something before you are " +
            "allowed to touch it — front, glass, base, the switch round the " +
            "back, and the pair of them side by side. Nine plates of a machine " +
            "that had been sitting in the dark since before the moon landing.",
          tombstone: [
            { k: "Subject", v: "MGK-VIIIp −02 “The Informer”, and its twin" },
            { k: "State", v: "As received — before cleaning, before power" },
            { k: "Plates", v: "Nine, all held by this museum" },
            { k: "Rights", v: "Ours. Photographed here, printed here." },
          ],
          collage: [
            { img: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png",
              href: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png",
              label: "The pair, front and top, as received", date: "FAMILY SHOT" },
            { img: "/robots/reference/photos/front_full.png",
              href: "/robots/reference/photos/front_full.png",
              label: "The front, whole", date: "FRONT" },
            { img: "/robots/reference/photos/front_screen.png",
              href: "/robots/reference/photos/front_screen.png",
              label: "The front glass, lit", date: "SCREEN" },
            { img: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREEN_BEZEL.png",
              href: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREEN_BEZEL.png",
              label: "The bezel around the glass", date: "BEZEL" },
            { img: "/robots/reference/photos/top_monitor.png",
              href: "/robots/reference/photos/top_monitor.png",
              label: "The top monitor", date: "TOP" },
            { img: "/robots/reference/photos/monitor_base.png",
              href: "/robots/reference/photos/monitor_base.png",
              label: "The base it stands on", date: "BASE" },
            { img: "/robots/reference/photos/unit_new_base.png",
              href: "/robots/reference/photos/unit_new_base.png",
              label: "The unit on its new base", date: "BASE, NEW" },
            { img: "/robots/reference/photos/rear_power_switch.png",
              href: "/robots/reference/photos/rear_power_switch.png",
              label: "The power switch, round the back", date: "REAR" },
            { img: "/robots/art/viiip.png",
              href: "/robots/art/viiip.png",
              label: "The cover plate — the glass carries the BIOS beat",
              date: "COVER" },
          ],
          footer: "Nine plates · Weird.Baby Robots",
          papa: "[PAPA] — the caption wording, and whether any plate earns a " +
                "face of its own.",
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
          /* [M11] register only. Every claim — the reverse-discovery, the
             writing-as-it-happened, the wrongness — was already here. */
          blurb:
            "A discovery run backwards: the object first, the explanation " +
            "afterwards, and the explanation changing under us more than once. " +
            "Written week by week as it happened, which is emphatically not the " +
            "order in which any of it makes sense.",
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
            { date: "2024-01-01", stamp: "01 JAN 24", title: "Three boxes", evidence: "document",
              line: "An anonymous drop: three cartons, marked classified and " +
                    "fragile on every side, with a note taped to them signed “-W.O.”",
              note: "the note's full text is in the archive" },
            { date: "2024-01-05", stamp: "05 JAN 24", title: "Who is W.O.?", evidence: "record",
              line: "The first entry. Three units are named on the boxing, " +
                    "and ABEAL is assumed — wrongly — to be their creator.",
              note: "" },
            { date: "2024-01-12", stamp: "12 JAN 24", title: "Something off about this drop", evidence: "record",
              line: "Office supplies, personal items and cold-war hardware, " +
                    "no documentation, everything gathered in a rush.",
              note: "ABEAL is “a division of ScrapCo”" },
            { date: "2024-01-19", stamp: "19 JAN 24", title: "The One-Page-Ads", evidence: "document",
              line: "The framed ads turn out not to be original: ABEAL " +
                    "retro-fitted other people's ads, with words covered and things taped down.",
              note: "" },
            { date: "2024-01-26", stamp: "26 JAN 24", title: "But we were wrong", evidence: "correction",
              line: "The retraction. ABEAL did not start it — they received " +
                    "the tech from someone else. They were responsible for the looks.",
              note: "the record correcting itself, in public" },
            { date: "2024-02-02", stamp: "02 FEB 24", title: "Logos and slogans", evidence: "object",
              line: "The shirts are made from original elements off the " +
                    "boxing — which is the first mention that per-unit slogans exist.",
              note: "[PAPA] — the slogans themselves are unwritten" },
            { date: "2024-02-09", stamp: "09 FEB 24", title: "MGK-NIAC, and a name", evidence: "record",
              line: "The original project title surfaces, and with it Carter " +
                    "Bookman — “his life is a mystery (some may say an Enigma??)”.",
              note: "" },
            { date: "2024-02-16", stamp: "16 FEB 24", title: "Ionizers and crushed walnut", evidence: "record",
              line: "Restoration chemistry: the cases through the electronic " +
                    "ionizers, the body casings tumbled in crushed walnut.",
              note: "" },
            { date: "2024-03-22", stamp: "22 MAR 24", title: "Bias, in 1965", evidence: "firmware",
              line: "Two engines — Prediction and Answer — both running off a " +
                    "changeable bias setting built before bias settings were a thing.",
              note: "" },
            { date: "2024-04-05", stamp: "05 APR 24", title: "The cases open", evidence: "photograph",
              line: "Photographs of the three cases and their artifacts: a " +
                    "spy camera, a real telegraph, and a 1960s CEO's day.",
              note: "" },
          ],
          footer: "First layer only — ten of 436 records. The full entries, " +
                  "their evidence, and the order they want to be read in, are [PAPA].",
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
           promise, it is a catalogue entry.

           ==== [B8 2026-08-02] THE MANUAL BECOMES REAL. MIKE'S RULING. =====
           "The owner's manual must be ACTUAL SCANS/PHOTOGRAPHS of the ACTUAL
           instruction manual, accessed via microfiche-class technology —
           immersion, the real deal, NOT 'in the style of'."
           THE CONSEQUENCE IS A PIPELINE, NOT A STYLESHEET, and it inverts
           what everyone assumed the generated pages were for. The PDF and the
           page plates are no longer the artifact; they are THE SOURCE MIKE
           PRINTS AND PHOTOGRAPHS. The photograph of that print — paper grain,
           press registration, whatever the light did — is the artifact, and
           the reason is the same one this face already gives for refusing
           transcription: the typography is the evidence, and a rendering of
           typography is a drawing of evidence.
           WHAT THE VIEWER NEEDS, so the scans are made ONCE and made right:
             RESOLUTION  ≥ 2400px on the long edge, which is what it takes to
                         read 6pt corporate small-print at 1:1 in the reader.
                         Photograph at the highest the camera gives and let
                         the delivery step downsample; a rescan is a reshoot.
             FRAMING     the whole page INCLUDING its edges. The margins carry
                         the technicians' handwriting (§ MARGINS below) and a
                         page cropped to its type block throws that away.
             SEQUENCE    reel order = reading order. `plates` is an ordered
                         array and the reader's transport walks it; a page out
                         of order is a page nobody will find.
             PER FRAME   `label` (what the page is) and `date` (the section
                         mark, e.g. "§ 3") — the reader prints both on its
                         rail, and a frame with neither is an unlabelled slide.
             ZOOM        the reader already gives fit ↔ 1:1 with panning, which
                         is why resolution is the one thing that cannot be
                         fixed later in code.
           THE CONTAINER IS BUILT AND THE REEL IS EMPTY, and it says so on the
           page rather than promising. When the scans land they are `plates`
           entries in this file and nothing else moves. */
        face: {
          kind: "plate",
          title: "THE OWNER'S MANUAL",
          blurb:
            "The unit shipped with a manual, and the manual is where the " +
            "machine explains itself — including the parts it gets wrong. " +
            "Page images, not transcription: the typography is the evidence.",
          lines: [
            "FORMAT  photographs of the printed pages, not a rendering",
            "NAV     microfiche reader — page-turn, fit and 1:1 magnify",
            "PLATES  not yet imaged",
          ],
          reel: {
            label: "MICROFICHE · READER",
            /* THE SCANS ARRIVE FROM MIKE. Ordered, reading order, one entry
               per page: { img, label, date }. The shape is the plate wall's
               shape on purpose — one reader serves both. */
            plates: [],
            note:
              "The reader is built and the reel is empty. These pages will be " +
              "photographs of the real manual — the printed sheet, its edges " +
              "and the hands in its margins — and until those exist this is a " +
              "catalogue entry rather than a promise.",
          },
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
        /* [C4 / M2 2026-08-01] THE FIRST-LEVEL ARTIFACT SLOT.
           Mike's doctrine ordered the tracks Record, Manual, [artifact],
           Portal — "not afterthoughts and add-ons, but not the boilerplate
           either". The slot was left unnamed, so it is filled with the one
           first-level artifact that is REAL AND IN HAND TODAY: the firmware
           itself. Two trees are on file and both are checked in.
           THIS FACE IS HONESTLY v1 AND SAYS SO. It carries what can be
           verified by looking — the tree names, the form, which one the twin
           transliterates — and claims nothing about contents it has not read.
           If Mike means a different artifact for this slot, the track is
           renamed and re-faced here and nothing else moves. */
        id: "firmware",
        title: "The Firmware",
        videos: [],
        tags: ["firmware", "artifact", "source", "1965", "ino"],
        face: {
          kind: "text",
          title: "THE FIRMWARE",
          subtitle: "THE MACHINE'S OWN MIND, ON FILE",
          blurb:
            "Everything the unit knows how to do is in here \u2014 not a " +
            "description of the machine's behaviour but the behaviour itself, " +
            "in the form the machine reads it. The twin in the Portal track is " +
            "a transliteration of the first tree, bugs preserved and badged.",
          lines: [
            "TREES    2 on file",
            "PRIMARY  MGK_VIIIp_01__20240721_WORKS \u2014 the tree the twin follows",
            "SECOND   MGK_VIIIp_02__20260724_AUDIT",
            "FORM     .ino modules \u2014 menu, boot, audio, graphics, input, games",
          ],
          entries: [
            { stamp: "v1", title: "What this page is, plainly",
              line: "A first version. The trees are real, checked in, and named " +
                    "exactly as they sit on disk. What is NOT here is a reading " +
                    "of them: no walkthrough, no annotated source, no claim " +
                    "about what any module does beyond what its name says.",
              note: "[PAPA] the artifact slot is Mike's to name \u2014 this is the honest floor, not the ceiling" },
            { stamp: "WHY", title: "Why it sits with the founding documents",
              line: "The Record says what was found. The Manual says what it was " +
                    "sold as. The firmware is the only one of the three that " +
                    "cannot be wrong about the machine, because it is the machine.",
              note: "" },
          ],
          entriesMode: "list",
          footer: "MGK-VIIIp \u00b7 FIRMWARE \u00b7 v1",
        },
      },
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
          /* ======== [P2 2026-08-02] THE CONTROL ROOM ======================
             Mike's ruling: the Portal track's face becomes the immersion's
             FIRST STEP — a dark, non-descript control page, half portal-esque
             itself. Everything that used to be here (the frozen plate, the
             register block, the ARRIVE AS dropdown, the prose) is replaced by
             an INSTRUMENT PANEL: you set the machine up, then you throw the
             latch, and the portal comes up.

             THE PANEL IS DATA, LIKE EVERY OTHER FACE. `kind:"panel"` adds a
             renderer that knows how to draw a drum, a bat switch, a lamp, a
             dial and a latch — and knows nothing about MGK, portals or
             maintenance. Every word, every position and every arming rule is
             declared here. /hr and /wb declare no faces at all, so they
             cannot notice this exists.

             THE CONTROLS TELL THE STORY; THEY ARE NOT THE STORY (Mike).
             C1 says the portal spends its first fortnight in automated,
             NON-INTERRUPTIBLE maintenance. C3 says the entry state today is
             one state: boots and updates complete, powered, sitting at the
             prompt. The SAME TWO LAMPS say both — AUTO MAINT lit + AT PROMPT
             dark is the launch fortnight; AUTO MAINT dark + AT PROMPT lit is
             today. Nothing about the fortnight is built; the panel is simply
             an instrument capable of reporting it, set to today.
             C2 is respected by omission: the frozen state is not referenced
             anywhere on this page, because it has no storyline yet.

             THE COMPOSITION, per C3's one-entry-state hold:
               DRUM      six positions, ONE of which arms (STANDARD). The
                         other five are engraved on the drum and roll past —
                         they exist, they are legible, and they do not arm.
                         That is the fine-dining hold made mechanical: the
                         menu shows the size of the room without pretending
                         every door is open.
               SWITCHES  two, because two is what the story needs and the
                         brief says no more controls than needed.
               DIAL      LIVE / SEEDED. LIVE arms. SEEDED re-reads the lamps
                         and does not arm — there is no seeded feed yet.
               LATCH     throws only when the panel is armed. */
          kind: "panel",
          title: "THE PORTAL",
          subtitle: "FEED CONTROL \u00b7 MGK-VIIIp",
          panel: {
            plate: "A-BEAL INSTRUMENT DIV. \u00b7 FEED CONTROL \u00b7 TYPE 8p",
            drum: {
              label: "FEED",
              sub: "SELECT \u00b7 ONE ARMED",
              /* positions are read in drum order, top to bottom. `arms:true`
                 is the only one that lights the drum and permits the latch. */
              positions: [
                { id: "standard", label: "STANDARD", arms: true,
                  line: "The unit as it stands: boots and updates complete, " +
                        "powered, waiting at the opening prompt." },
                { id: "idling-updated", label: "IDLING, UPD", arms: false,
                  why: "held \u2014 one entry state (C3)" },
                { id: "boot-playback", label: "BOOT PLAYBK", arms: false,
                  why: "held \u2014 one entry state (C3)" },
                { id: "off-first-boot", label: "OFF \u00b7 1ST BOOT", arms: false,
                  why: "held \u2014 one entry state (C3)" },
                { id: "last-state", label: "LAST STATE", arms: false,
                  why: "held \u2014 awaiting a privacy ruling" },
                { id: "test-bench", label: "TEST BENCH", arms: false,
                  why: "held \u2014 workshop entry, by URL" },
              ],
            },
            switches: [
              /* [C1] the fortnight, as an instrument. Thrown UP the machine is
                 in automated maintenance and will not be interrupted — the
                 latch goes dark and says why. Thrown DOWN, maintenance is
                 complete, which is where C3 leaves it today. */
              { id: "maint", label: "AUTO MAINT", sub: "NON-INTERRUPTIBLE",
                on: false, armsWhen: false,
                held: "Maintenance is running. The machine will not be hurried.",
                lamp: "amber" },
              /* [C3] the entry state, as an instrument. */
              { id: "prompt", label: "AT PROMPT", sub: "BOOTS + UPDATES DONE",
                on: true, armsWhen: true,
                held: "The unit is not at its prompt.",
                lamp: "warm" },
            ],
            dial: {
              label: "SOURCE",
              positions: [
                { id: "live", label: "LIVE", arms: true },
                { id: "seeded", label: "SEEDED", arms: false,
                  why: "no seeded feed on file \u2014 the lamps read the seed, " +
                       "and there is nothing to read" },
              ],
            },
            latch: {
              label: "LATCH",
              armed: "FEED ARMED",
              idle: "NOT ARMED",
              event: "wb-robots-open-twin",
            },
          },
          /* [PAPA] every engraved word on this panel is a plain-words draft:
             the plate, the switch legends, the held reasons. The instrument
             layout is the deliverable; the legends are Mike's. */
          papa: "[PAPA] \u2014 the engraved legends: plate wording, switch " +
                "names, and what the panel says when it refuses to arm.",
        },
      },
      {
        /* [M2 2026-08-01] THE MACHINE'S OWN FAQ — added per Mike, and kept
           distinct from the house FAQ on the front desk: that one answers
           questions about Weird.Baby, this one answers questions about the
           unit. Same shape, different desk. */
        id: "mgk-faq",
        title: "FAQ",
        videos: [],
        tags: ["faq", "questions", "mgk"],
        face: {
          kind: "text",
          title: "FAQ",
          subtitle: "ABOUT THIS MACHINE",
          blurb:
            "The questions that actually get asked about the unit, answered as " +
            "plainly as the answers are known \u2014 and marked where they are not.",
          entries: [
            { stamp: "Q", title: "Does it still work?",
              line: "Yes. Both units power on and run their own firmware. The " +
                    "Portal track is not a simulation of that claim; it is the " +
                    "firmware running.",
              note: "" },
            { stamp: "Q", title: "Is the Portal the real machine?",
              line: "It is the real firmware on shimmed hardware \u2014 the twin. " +
                    "The unit itself is a physical object in a room; the twin is " +
                    "how it is met from here.",
              note: "" },
            { stamp: "Q", title: "Why does it say ERROR so often?",
              line: "The Manual's own line is the answer \u2014 and the story " +
                    "around it is Mike's to tell, so it is held rather than " +
                    "half-told here.",
              note: "held \u2014 storyline first (C1/C2)" },
            { stamp: "Q", title: "Can I buy one?",
              line: "No. The shop carries what the shop carries; the machines " +
                    "are not stock.",
              note: "" },
          ],
          entriesMode: "list",
          footer: "MGK-VIIIp \u00b7 FAQ",
        },
      },
    ],
  },
];

export const robotsExhibit = {
  id: "robots",
  name: "Robots",
  exhibitSlug: "robots",
  eraAlias: {},
  spine,
  facts: [],
  /* [M1 2026-08-01] THE DECK OPENS ON THE FIRST ALBUM. It used to seek out
     MGK-VIIIp by id, which put the carousel's landing position in one place
     and the deck's ORDER in another — two facts that have to agree with no
     mechanism making them agree. The front desk is first in the spine, and
     the deck now simply starts at the front. */
  defaultActiveIndex: 0,
  splitKey: "wb-rb-split",
  /* [S8] three tracks do not need half the screen. The viewer owns everything
     (S7), so it opens owning most of the width too; the splitter still moves
     freely from 10% to 82%. */
  splitDefault: 24,
  cfKey: "wb-rb-cfh",
  /* [M1 2026-08-03] `bodyKey` RETIRED WITH THE STAGE, for the reason WAL
     retired it at W7: a fixed body height is the stage's mechanism. Content
     that runs at its natural length in the page's own flow cannot be put in a
     box of a chosen height without the box cutting it off — which is the
     hiding the law forbids, reintroduced by the back door. The X2 drag handle
     goes with it; there is nothing left for it to resize. */
  visitPath: "/robots",
  /* [P23 2026-08-02] this wing's own door verb — see the listener in
     RobotsExhibitFlow. Declaring it is what makes the plate wall's tiles
     live rather than beautifully dead. */
  linkEvent: "wb-robots-open-link",
  shopExitParam: "robots",
  /* [M3 2026-08-01] THE GIFT SHOP IS BACK IN THE TITLE BAR. The one-shop
     ruling is unchanged - there is still exactly one shop - but hiding the
     door was the wrong reading of it: a visitor deep in the robots wing had
     no way to the shop except the wordmark, which does not look like a way to
     the shop. It points at the standard W.B gift shop, carrying `from=robots`
     as it always did. */
  shopEntryHidden: false,
  /* [M1 2026-08-03] THE STAGE IS RETIRED HERE. THE NO-HIDDEN-INFORMATION LAW.
     MIKE: "Card-advance/next-buttons are a sneaky way of adding pages — people
     will not flick to discover whether something is interesting."
     `stage: true` made the viewer a fixed frame and cut every face into pages
     behind a `‹ Back / Next ›` transport. It was well-built and it measured
     honestly — the packer's own console told the truth about every overrun —
     but what it was honestly doing was putting the second half of every long
     face behind a button whose label is "Next", which says nothing about what
     is behind it. THIS WING WAS THE ONLY PAGER IN THE BUILDING: every button on
     /wal and /robots was enumerated this round and `.stg-step` appears on
     /robots and nowhere else.
     `faceFlow: "flat"` is not a new mechanism — it is W7's, shipped on WAL,
     where every face has run at full length in the page's own flow since
     August 2. The Stage's no-scroll law survives in W7's reading, which is the
     only honest one: no inner scroll traps; the DOCUMENT is the one thing that
     scrolls, which is ordinary reading.
     `Stage` and the `.stg-*` rules stay in the tree, mounted by nothing — see
     the note on the component in Exhibit.jsx. */
  faceFlow: "flat",
  /* [STAGE] THE PLAYER BAR IS NOT A FIXTURE (Mike's doctrine). This wing has
     no music - its one moving thing is a machine behind a latch - so a
     permanent transport here was a control for something that never plays,
     sitting on the stage and lying about its height. */
  playerBar: false,
  /* [L5 2026-08-02] THE CONTENTS COLUMN PRINTS THE OBJECT.
     This wing opens its contents column at 24% (S8) because it carries three to
     six short rows and wanted bigger type for them. The consequence, measured:
     326 x 878 holding 214px of list — 664px of blank paper, the largest single
     void in the room, in a wing whose subject is a photographed physical object.
     `contentsPlate` prints the album's own `viewerPoster` beneath the list, with
     the caption the album already carries. Nothing is chosen or written by the
     rule; both come off the data. Declared here and nowhere else — /hr, /wb and
     /wal run long lists that fill their own column. */
  contentsPlate: true,
  exhibitFlow: RobotsExhibitFlow,
};
