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
// ---- A3 2026-08-04: THE MORGUE, AND THE TWO SIBLINGS IT IMPLIES -------------
// The two "The Plates" faces are now THE MORGUE, subtitled IMAGE ARCHIVE.
// SAME-ONLY-DIFFERENT SAYS THE SIBLINGS ARE THE SAME COMPONENT WITH DIFFERENT
// DATA, and naming them here is the whole of what this round builds of them:
//
//   THE MORGUE      images   `spreads[].tiles[] = { img, href, label, date }`
//                            LIVE — the two walls below.
//   THE REEL        video    the identical spread structure; a tile's `img` is
//                            the frame and its `href` is the clip. NOT BUILT:
//                            every `videos:` array in this wing is empty and
//                            the museum holds no clip of either unit. The word
//                            is not invented either — the Manual's face has
//                            called its own container a reel since B8.
//   THE TAPE LIBRARY  audio  the identical spread structure; a tile's `img` is
//                            the sleeve or the label and its `href` is the
//                            track. NOT BUILT: this wing has no audio at all.
//                            `/wb` has six tracks and no archive face, which is
//                            where this would land first if Mike wants it.
//
// NEITHER SIBLING IS SCAFFOLDED. An empty container at a live address is the
// thing the NO-COMING-SOON credo and Doctrine 11's corollary both kill; the
// renderer is generic already, so building one on the day there is something
// to put in it costs a data block and no code.
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
   and a tracklist. No component changes needed.
   [V2 2026-08-03] AND ONE HAS: MGK-VIII/MGK-NIAC is back, second in the deck,
   with eleven plates and four faces off them — as data, in this file, no
   component changed, exactly as the paragraph above said it would happen. The
   clause is doing its job rather than being waived; NRU-2000 and the
   findings-log album are still out and still owe the same rent. */
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
/* ═══ [E3 2026-08-03] THE FRONT DESK'S TWO CARDS ════════════════════════════
   THE VISUAL HOOK LAW, applied to the two faces that had no photograph
   available and should not have borrowed one.

   MIKE: "land on words alone and the visitor probably walks out. Every surface
   needs something visually compelling besides written words — NOT NECESSARILY A
   PHOTO; even words presented in a different FORMAT can be the hook."

   WHY THESE TWO ARE TYPE AND THE OTHER FOUR ARE PHOTOGRAPHS. The four faces on
   the MGK-VIIIp album are about a physical object, and the museum owns eight
   real photographs of it — so those faces get a plate. These two are on the
   FRONT DESK, and their subject is the house: what we are asked, and how to
   reach us. There is no photograph of a question. Putting a machine on them
   would have been decoration borrowed from the room next door, which is the
   thing the law is for rather than the thing it asks for.

   THE PATTERN IS ALREADY IN THE BUILDING, TWICE. The Information Booth's ADMIT
   ONE ticket and the Foundation's account card are both objects made entirely
   of a sentence the page was already saying. These are the third and fourth,
   and they follow the same discipline: NOT ONE WORD ON EITHER CARD IS NEW. The
   tally's number and its "the fraction is not a typo" are lifted from the
   answer six lines below it; the correspondence card's whole text is the first
   sentence of the answer it sits above.

   THE MECHANISM IS `still`, NOT A NEW FACE KEY, and that is deliberate: WAL's
   house card (`HOUSE_COVER` in worth-a-listen.js) proved that an inline SVG
   data URI is a picture as far as the renderer is concerned. So a typographic
   object costs zero renderer changes and inherits the plate's own geometry,
   its border and — here — the wing's B&W law, which `.vp-face-still` applies as
   a filter at the glass.

   SYSTEM FACES ONLY. An SVG loaded through <img src="data:…"> cannot fetch the
   museum's webfonts, so Georgia and Courier New stand in for the serif and the
   register face. Same substitution WAL's card makes, same reason.

   SIZED 520×420 (5:4-ish) ON PURPOSE. `.vp-face-still` gives a plate
   `height:min(48cqh,210px)` and `max-width:260px`; at this aspect the card
   lands at exactly 260×210 and neither cap crops it. A squarer or wider card
   would have been letterboxed inside its own box — the defect F1 spent three
   passes killing on the artist plates. */
const CARD_STOCK = "#e6e2d8";
const CARD_INK = "#1a1917";
const CARD_QUIET = "#5a574f";

function deskCard(inner) {
  return "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="520" height="420">' +
      '<rect width="520" height="420" fill="' + CARD_STOCK + '"/>' +
      '<rect x="16" y="16" width="488" height="388" fill="none" stroke="' +
        CARD_INK + '" stroke-width="2"/>' +
      inner +
    "</svg>");
}

/* the tally. "Thirty-one and a half" is the wing's best line and it is a
   NUMBER, which is the one kind of sentence that gets stronger the larger it
   is set — the same reason the Foundation's zero is the biggest thing on its
   page. */
const CARD_TALLY = deskCard(
  '<text x="260" y="86" text-anchor="middle" fill="' + CARD_QUIET + '" font-family="Courier New,monospace" font-size="17" letter-spacing="7">WEIRD.BABY ROBOTS</text>' +
  '<text x="260" y="238" text-anchor="middle" fill="' + CARD_INK + '" font-family="Georgia,serif" font-size="132">31&#189;</text>' +
  '<text x="260" y="288" text-anchor="middle" fill="' + CARD_INK + '" font-family="Courier New,monospace" font-size="19" letter-spacing="5">UNITS ON THE RECORD</text>' +
  '<line x1="120" y1="322" x2="400" y2="322" stroke="' + CARD_INK + '" stroke-width="1"/>' +
  '<text x="260" y="358" text-anchor="middle" fill="' + CARD_QUIET + '" font-family="Georgia,serif" font-size="21">The fraction is not a typo.</text>');

/* correspondence. The whole card is the answer's own first sentence, broken
   where the sentence breaks. */
const CARD_ADDRESS = deskCard(
  '<text x="260" y="86" text-anchor="middle" fill="' + CARD_QUIET + '" font-family="Courier New,monospace" font-size="17" letter-spacing="7">CORRESPONDENCE</text>' +
  '<text x="260" y="196" text-anchor="middle" fill="' + CARD_INK + '" font-family="Georgia,serif" font-size="72" letter-spacing="2">ONE</text>' +
  '<text x="260" y="272" text-anchor="middle" fill="' + CARD_INK + '" font-family="Georgia,serif" font-size="72" letter-spacing="2">ADDRESS</text>' +
  '<line x1="120" y1="316" x2="400" y2="316" stroke="' + CARD_INK + '" stroke-width="1"/>' +
  '<text x="260" y="356" text-anchor="middle" fill="' + CARD_QUIET + '" font-family="Courier New,monospace" font-size="19" letter-spacing="4">READ BY ONE PERSON</text>');

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
          /* [E3 2026-08-03] the tally card — see the note above WBR_TRACKS.
             Six questions and no object was the audit's finding on this face;
             the object is the one number the answers already carry. */
          still: CARD_TALLY,
          stillCaption: "Thirty-one and a half.",
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
          /* [CS 2026-08-04] "The answers a visitor gets should be shorter than
             these." was a note from the builders to the operator, standing
             OUTSIDE the marker and therefore printing at the foot of the page.
             It is now inside the marker's sentence, where it was always going;
             the whole footer scrubs to nothing and no footer renders. */
          footer: "[PAPA] — the final wording throughout, and the answers " +
                  "should be shorter than these.",
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
          /* [E3 2026-08-03] the correspondence card. The audit called this the
             smallest surface in the wing and wondered whether a plate was more
             than it needs — which is exactly why it got the cheapest possible
             one: four rows of type, made of the sentence in the last row. */
          still: CARD_ADDRESS,
          stillCaption: "One address, read by one person.",
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

/* ═══ [A8 2026-08-04] THE DISCOGRAPHY'S COMMON THEME ══════════════════════════
   MIKE: "the wing needs a COMMON THEME across its discography (all directly
   related — and anything not related follows ITS OWN template, per
   same-only-different)."

   TWO TEMPLATES, AND MOST OF THE FIRST ONE WAS ALREADY LAW HERE. Written down
   because it was distributed across four files and nobody could read it whole.

   TEMPLATE A — A UNIT'S COVER (`mgk-viii`, `mgk-viiip`)
     · ONE MACHINE, ALONE IN THE FRAME. Nothing of the room it stands in.
     · SQUARE. `.cf-album` is a 240x240 box with `object-fit:cover`, so a
       cover that is not square is centre-cropped by the renderer and the
       visitor never sees what the file holds. All three are square as of
       this round.
     · BLACK AND WHITE, AND NOT ON DISK. Enforced once at the glass by
       `.ex-root[data-exhibit="robots"] img:not([data-colour])` (Exhibit.css
       :2964) — the negatives stay negatives. Nothing here re-exports.
     · CUT AT A JOINT WHERE THE OBFUSCATION LAW APPLIES. That law governs the
       MGK-VIII's plates and its cover; the VIIIp is shown whole because the
       VIIIp has always been shown whole.

   TEMPLATE B — ANYTHING THAT IS NOT A UNIT (`wbr-logo`, and the front desk)
     The house card: the museum's paper ground, a ruled border, the mark, the
     wing's name in the serif, a strapline in tracked caps. Generated by
     `tools/make_robots_cover.py`, not hand-composited. A room is not a
     machine and does not get photographed like one — which is the whole of
     what same-only-different asks here.

   WHAT THIS ROUND MADE TRUE: the VIIIp cover is now the machine and nothing
   else (cropped to the unit's measured bounding box, 1536x1536, and written
   out as 8-bit grey because every channel was already identical — 2.69 MB to
   1.40 MB, not one pixel resampled).

   WHAT IS STILL FALSE, MEASURED AND NOT FIXED — `mgk-viii-cover.jpg` is the
   one cover that does not meet Template A, and it cannot be made to by any
   edit Ops is entitled to make. It is a soft hand-held snapshot with a
   wall-wart, a wooden floor and loose cabling in frame; the B&W law hides its
   colour and cannot touch its composition. **AND IT CANNOT BE STRAIGHTENED BY
   ROTATION** — Mike asked, and the measurement says no: the machine's own
   rectangular aperture has a TOP edge at -1.75 deg and a BOTTOM edge at
   +2.48 deg, its LEFT edge 0.13 deg off plumb and its RIGHT 1.52 deg. A
   rectangle whose opposite edges disagree by 4.2 deg is KEYSTONED, not
   rotated. Sampling the grille bars at four different heights gives leans of
   -2.69, +5.40, +3.58 and +0.12 deg for the same bars, because the frame holds
   two gratings at different depths. Any single rotation levels one edge and
   tilts the other three: -1.76 deg levels the bottom rail and would tilt the
   LED row, which is currently level to within 0.17 deg and is the one line in
   the picture a visitor actually reads. **So nothing was rotated.** It is an
   art ask, logged as A8 in docs/OPEN_ACTIONS.md.
   ═══════════════════════════════════════════════════════════════════════════ */
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
  /* ═══ [V2 2026-08-03] MGK-VIII REJOINS THE CAROUSEL, WITH THE LENS CAPPED ══
     MIKE: "MGK-VIII goes on the carousel — build its album using the folder's
     photographs, but OBFUSCATED: crop to details, partial views, oblique
     angles. Enough to prove the unit is real and present, NOT enough to spend
     the reveal."

     WHY IT IS BACK, AND THE NO-COMING-SOON CREDO IS INTACT. R1 took MGK-NIAC
     off this deck (see the note above the spine) because it was house-logo art
     plus a single "Coming soon" track — a placeholder earning nothing — and
     the rule R1 wrote for its return was that an entry comes back "when a
     family earns a photograph and a tracklist". This family now has TWELVE
     photographs on file and four faces of real material read off them. It is
     returning on R1's own terms; no rule is being bent to let it in.

     THE OBFUSCATION IS THE METERED REVELATION, APPLIED TO IMAGERY. It is the
     same instrument the wing already runs on its prose — show the object,
     withhold the account — and what is withheld here is one specific thing:
     THE WHOLE FIGURE. Not one plate on this album contains the unit's full
     silhouette. Every frame is cut at a joint, a panel or an edge, so a
     visitor can establish that the machine exists, is built, is powered and
     was photographed, and still has never seen it stand up.

     THE CROP IS BAKED INTO THE FILE; THE MONOCHROME IS NOT. Two laws, two
     layers, and they do not belong at the same one. The crop is the RULING and
     has to survive anyone pointing a new renderer at these files, so it lives
     on disk. The B&W is the WING'S law, enforced once at the glass
     (`Exhibit.css` :2923, `[data-exhibit="robots"] img`) — which is where B4
     deliberately put it so the negative stays the negative. These plates hold
     their colour on disk exactly as the other eight do, and the day that law
     is revisited it is still one selector and not twenty re-exports.

     THEY ARE JPEG WHERE THE VIIIp PLATES ARE PNG, on purpose: the sources are
     camera JPEGs, so PNG here is a lossless wrapper around lossy data — about
     16 MB of repository for not one visible pixel. The renderer reads a string;
     nothing anywhere reads the extension.

     PLACED SECOND, AHEAD OF THE VIIIp. The robots repo's family order is
     "MGK-NIAC, MGK-VIIIp, NRU-2000" and its closed terminology ruling
     (2026-07-18, markup ruling 4) makes NIAC the ORIGINAL mainframe with
     "VIII/VIIIp" as ABEAL's 1965 rebrand — so the original stands before the
     portable. The front desk keeps index 0 and `defaultActiveIndex` is unmoved.

     WHAT THIS ROUND DID NOT DO, because Mike ruled it separately: the folder's
     five sound files and two videos are INVENTORIED ONLY. Nothing here plays,
     no `videos` array is populated, and no audio path is referenced anywhere
     on this album. See the round report for the inventory.
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "mgk-viii",
    title: "MGK-VIII",
    /* NO YEAR, AND THAT IS A REFUSAL RATHER THAN A GAP. The VIIIp carries 1965
       because the wing's record puts it there. Nothing in this repository dates
       THIS unit, and the only dates that are certain — 2013 and 2021 — are the
       dates of the PHOTOGRAPHS, not of the object. Printing either under the
       cover would be the museum inventing a provenance it does not hold. The
       carousel simply prints no year, as it already does for the front desk. */
    year: null,
    tags: ["mgk", "viii", "niac", "mainframe", "abeal", "machine", "detail"],
    art: "/robots/art/mgk-viii-cover.jpg",
    accent: null,
    /* THE POSTER IS THE CHEST, AND IT IS DOING DOUBLE DUTY — it is also the
       second tile of The Plates, named here rather than left unremarked, the
       way the VIIIp album names the family shot's double duty. It is the one
       detail on file that reads as A MACHINE THAT STANDS UP without showing
       the machine standing up: torso, both shoulders, the top of two limbs,
       cut above and below. (It also printed under the contents list until
       2026-08-04; see the `contentsPlate` note at the foot of this file.) */
    viewerPoster: "/robots/reference/mgk-viii/chest_grille.jpg",
    viewerPosterCaption:
      "MGK-VIII at the chest — a detail. The whole frame is shown nowhere.",
    tracks: [
      {
        id: "name",
        title: "MGK-NIAC",
        videos: [],
        tags: ["niac", "name", "abeal", "mainframe", "1965"],
        face: {
          kind: "text",
          title: "MGK-NIAC",
          subtitle: "THE NAME IT WAS BUILT UNDER",
          /* the lens, and nothing but the lens. The strongest single detail in
             the set and the least revealing of the shape it belongs to — you
             can tell something is looking back and you cannot tell what it is
             mounted on. */
          still: "/robots/reference/mgk-viii/head_lens.jpg",
          stillCaption: "At the lens. One of eleven details on file.",
          blurb:
            "The mainframe — the big one, the early one, the one that only " +
            "answers. Everything the portable does that this does not arrived " +
            "later and arrived smaller. It has two names and the museum has " +
            "not decided which of them goes on the door.",
          lines: [
            "BUILT AS   MGK-NIAC",
            "SOLD AS    MGK-VIII — ABEAL's 1965 rebrand",
            "RUNS       the classic answer set, and a short list beside it",
            "SUCCESSOR  MGK-VIIIp — portable, later, and far more talkative",
          ],
          entries: [
            /* [HR 2026-08-04] THIS FACE CITED THE RECORD THREE TIMES AND THE
               RECORD NO LONGER SAYS ANY OF IT. Mike's ruling deleted ten
               invented Record entries; three lines here were pointers into
               them and one whole entry was a restatement of one.
                 · the NAME row's "which is exactly the shape the record
                   already gives them" and its note "the record's own
                   correction, 26 January 2024" — both cut. What is left is the
                   claim this face makes in its own right.
                 · the WHEN row ("The day the first name surfaced. 9 February
                   2024 … Carter Bookman") — CUT ENTIRELY. It was the deleted
                   09 FEB 24 Record entry retold on another face, down to its
                   date and its quotation, and its note pointed the visitor at
                   an entry that is gone.
                 · the OPEN row's "The record prefers the first." — cut. The
                   record expresses no preference now, and printing one would
                   be this file inventing the log's opinion of itself. */
            { stamp: "NAME", title: "Two names, one machine",
              line: "It was built as MGK-NIAC and sold as MGK-VIII. ABEAL did " +
                    "the selling and ABEAL did the renaming: they did not " +
                    "start any of this, they were responsible for the looks.",
              note: "" },
            { stamp: "WHAT", title: "A mainframe, not a portable",
              line: "It runs the classic answer set and a similarly limited " +
                    "list of everything else. The adjustable personality, the " +
                    "named engines and the menu are all the portable's, and " +
                    "all of them came afterwards.",
              note: "" },
            { stamp: "OPEN", title: "Which name goes on the door",
              line: "This album is filed under the second name because that is " +
                    "what the folder is called, what the firmware is called and " +
                    "what the parts are labelled. Both names are defensible and " +
                    "only one can be on the cover.",
              note: "[PAPA] — whether the carousel reads MGK-NIAC or MGK-VIII" },
          ],
          entriesMode: "list",
          footer: "MGK-VIII · MGK-NIAC",
        },
      },
      {
        /* ==== THE MORGUE, AND THE THING IT IS BUILT NOT TO SHOW ============
           [A3 2026-08-04] THE ROOM IS RENAMED AND BOTH NAMES ARE ON THE GLASS.
           MIKE'S OPTIONS were IMAGE ARCHIVE (clear) or THE MORGUE (what a
           newspaper or a wire service called its photo archive, which is the
           period this wing is set in). OPS PROPOSES THE MORGUE and puts IMAGE
           ARCHIVE under it as the plain-language subtitle — so the visitor is
           never guessing, and MIKE CAN READ BOTH ON THE PAGE AND STRIKE ONE.
           Whichever he strikes is one string in this file.
           THE INDIVIDUAL PHOTOGRAPHS ARE STILL CALLED PLATES, everywhere they
           were: the tombstone row, the footer, the blurb, the entries on the
           other faces. A morgue is the room; a plate is the object in it, and
           renaming the objects was not asked for and would break four faces
           that talk about plates by name.

           This is the VIIIp plate wall's renderer, unchanged, pointed at a set
           that has been cropped before it ever reached the repository. Same
           glued-up wall, same tilt, same tap-to-open reader.
           THE TOMBSTONE SAYS THE QUIET PART. A museum that withholds without
           saying so is not metering a revelation, it is just short of pictures;
           the "Frame" row is there so a visitor knows the absence is authored.
           CAPTIONS ARE WHAT THE PHOTOGRAPH SHOWS, in the wing's own register —
           the rule the VIIIp wall set. No caption below interprets, dates the
           OBJECT, or names a donor part. */
        id: "plates",
        title: "The Morgue",
        videos: [],
        tags: ["plates", "photographs", "viii", "reference", "detail"],
        face: {
          kind: "text",
          title: "THE MORGUE",
          subtitle: "IMAGE ARCHIVE · MGK-VIII · DETAILS ONLY",
          blurb:
            "Eight details of a machine that is never shown whole. Cropped " +
            "close on purpose and cut at the joints — enough to establish " +
            "that the thing is built, wired, standing and lit, and nowhere near " +
            "enough to establish what it looks like.",
          tombstone: [
            { k: "Subject", v: "MGK-VIII, on the bench" },
            { k: "State", v: "Built and powered (2021); under construction (2013)" },
            { k: "Plates", v: "Eight, cropped from six photographs" },
            { k: "Frame", v: "Withheld — no plate carries the whole unit" },
            { k: "Rights", v: "Ours. Photographed here, cropped here." },
          ],
          /* [A4 2026-08-04] THE ARCHIVE STACKS IN SPREADS, NEWEST AT THE TOP.
             MIKE: "images stack in albums BY RECORD NUMBER; the LATEST SPREAD
             DISPLAYS AT TOP (frictionless newest, everything older neatly
             stowed within reach)."
             NO RECORD NUMBER IS DECLARED ON EITHER SPREAD, and that is not an
             oversight — THIS MUSEUM DOES NOT HOLD A RECORD NUMBER FOR ANY OF
             THESE PHOTOGRAPHS. Assigning one would be a specific nobody
             supplied (Doctrine 12), so the `no` field is simply absent and the
             renderer prints nothing where it would go. The order therefore
             falls to the order authored here, which is newest first; the day a
             number is known it is one field per spread and the stack sorts
             itself. The gap is question A4 in docs/OPEN_ACTIONS.md.
             THE HEADINGS ARE THE TILES' OWN DATES and nothing else — no "on the
             bench", no "in the workshop". Those phrases are in this file, but
             they describe SOME of the plates in each group and applying them to
             all of a group would be a claim about photographs nobody made.
             THE DATE IS PRINTED TWICE ON PURPOSE — once on the shelf, once on
             each print. The tile keeps its `date` because the READER shows it
             (RobotsExhibitFlow's caption line is `title · date · frame n of m`)
             and a print that leaves the shelf has to carry its own date. */
          spreads: [
            { head: "MARCH 2021",
              tiles: [
                { img: "/robots/reference/mgk-viii/head_oblique.jpg",
                  href: "/robots/reference/mgk-viii/head_oblique.jpg",
                  label: "The head, three-quarters — a camera body, lens forward",
                  date: "MAR 2021" },
                { img: "/robots/reference/mgk-viii/chest_grille.jpg",
                  href: "/robots/reference/mgk-viii/chest_grille.jpg",
                  label: "The chest, and the shoulders it hangs from",
                  date: "MAR 2021" },
                { img: "/robots/reference/mgk-viii/limbs_lower.jpg",
                  href: "/robots/reference/mgk-viii/limbs_lower.jpg",
                  label: "Lower limbs — flexible conduit into cast feet",
                  date: "MAR 2021" },
                { img: "/robots/reference/mgk-viii/column_lit.jpg",
                  href: "/robots/reference/mgk-viii/column_lit.jpg",
                  label: "A lit column, behind a grille",
                  date: "MAR 2021" },
                { img: "/robots/reference/mgk-viii/bench_power.jpg",
                  href: "/robots/reference/mgk-viii/bench_power.jpg",
                  label: "The bench — power, a relay board, and two feet",
                  date: "MAR 2021" },
              ] },
            { head: "FEBRUARY 2013",
              tiles: [
                { img: "/robots/reference/mgk-viii/torso_unfinished.jpg",
                  href: "/robots/reference/mgk-viii/torso_unfinished.jpg",
                  label: "The same chest, eight years earlier, unpowered",
                  date: "FEB 2013" },
                { img: "/robots/reference/mgk-viii/feet_plinth.jpg",
                  href: "/robots/reference/mgk-viii/feet_plinth.jpg",
                  label: "Feet, on a plywood plinth",
                  date: "FEB 2013" },
                { img: "/robots/reference/mgk-viii/slot_mockup.jpg",
                  href: "/robots/reference/mgk-viii/slot_mockup.jpg",
                  label: "A slot cut in a mock-up, with a limb across it",
                  date: "FEB 2013" },
              ] },
          ],
          footer: "Eight plates · details only · Weird.Baby Robots",
          /* THE MARKER SCRUB CUTS BY SENTENCE, NOT BY STRING (P5), so whatever
             is written outside the [PAPA] sentence is VISITOR COPY and has to
             read like it. The first draft left "the uncropped photographs are
             on file and one line of data would publish any of them" standing on
             the page — true, and the register of a maintainer talking to
             another maintainer. The operational half now sits behind the
             marker; what survives to the wall is the one thing a visitor
             actually needs to know about the crop. */
          /* [CS 2026-08-04] the survivor printed on the wall was "The
             withholding is authored, and it is not a shortage of photographs."
             — the museum annotating its own editorial decision, in the museum's
             own vocabulary for editorial decisions. The FACT it was defending is
             already on the tombstone four rows up ("Frame — Withheld: no plate
             carries the whole unit"), which is a holdings statement and stays.
             The whole string is now one marked sentence and renders nothing. */
          papa: "[PAPA] — how much of this unit is ever shown whole, and when; " +
                "the uncropped originals are all on file, any of them can be " +
                "published from this file alone, and the crop is a decision " +
                "rather than a shortage.",
        },
      },
      {
        id: "firmware",
        title: "The Firmware",
        videos: [],
        tags: ["firmware", "source", "ino", "bench", "led", "artifact"],
        face: {
          kind: "text",
          title: "THE FIRMWARE",
          subtitle: "WHAT THE MACHINE IS RUNNING",
          /* A LIT MATRIX, AND IT IS NOT THE ONE THE NUMBERS BELOW DESCRIBE.
             This photograph is from February 2013 and the flagship firmware is
             from February 2026 — thirteen years apart, different board, almost
             certainly a different matrix. It is used here because it is the one
             picture in the whole set of SOFTWARE DOING SOMETHING, and the
             caption dates it rather than letting the proximity imply otherwise.
             The alternative was a screenshot of a `.ino` file, which is a
             picture of text sitting above a page of text. */
          still: "/robots/reference/mgk-viii/matrix_lit.jpg",
          stillCaption: "An LED matrix, lit on the breadboard — February 2013.",
          blurb:
            "Two generations of code are on file and both are real: eight " +
            "single-subsystem bench sketches, and the flagship that supersedes " +
            "them. What follows is what the files say about themselves. No " +
            "reading of them is on file.",
          lines: [
            "FLAGSHIP   v0.1 · 2026-02-23 · 1,385 lines · Uno R4 WiFi",
            "STATUS     baseline — pre-thermal-validation",
            "BENCH      8 single-subsystem sketches, January 2026",
            "OUTPUTS    2 matrix chains · 2 bar chains · 3 servos",
          ],
          entries: [
            { stamp: "ENFORCES", title: "Five rules, declared in the header",
              line: "A numerical envelope. A ceiling of eight core states. " +
                    "Mutual exclusion. A reveal no faster than twelve seconds. " +
                    "And no adaptive learning — the machine is forbidden, in " +
                    "writing, from getting to know you.",
              note: "printed above the first include, before any code" },
            { stamp: "8 × 16", title: "Only seven rows are visible",
              line: "The matrix is addressed as eight rows of sixteen and seven " +
                    "of those rows are all you can ever see on the finished " +
                    "machine. The eighth is wired, driven, and behind something.",
              note: "the note is in the sketch, in the builder's own hand" },
            { stamp: "1 × 64", title: "The bar is one long chain",
              line: "Sixty-four in a single row, addressed as a line rather " +
                    "than as a column of anything — whatever it reads as when " +
                    "it is lit, the code underneath it is one strip.",
              note: "" },
            { stamp: "32", title: "The brightness the power supply permits",
              line: "All-at-once flashes are capped at a quarter of the standard " +
                    "level, for the least mysterious reason in this entire wing: " +
                    "“If I make too bright at once the Nano will shut down " +
                    "due to power draw.”",
              note: "a bench limit on a bench board — the flagship targets an R4" },
          ],
          entriesMode: "list",
          footer: "MGK-VIII · FIRMWARE",
        },
      },
      {
        id: "parts",
        title: "The Parts",
        videos: [],
        tags: ["parts", "found", "workshop", "drawer"],
        face: {
          kind: "text",
          title: "THE PARTS",
          subtitle: "WHAT IT IS MADE OF",
          /* THE DRAWER IS THE ONLY PLATE IN THE SET THAT NEEDS NO OBFUSCATION,
             because the unit is not in it. It is included precisely for that:
             a photograph that gives away nothing about the figure and
             everything about the method. */
          still: "/robots/reference/mgk-viii/parts_drawer.jpg",
          stillCaption: "One drawer — jewelled indicators, bezels, knobs, braid.",
          blurb:
            "Read the plates for materials rather than for shape and the method " +
            "is obvious: nothing here was fabricated to look old. It was found " +
            "old, sorted into compartments, and then a machine was assembled " +
            "out of the compartments.",
          lines: [
            "HEAD    a camera body, lens forward",
            "CHEST   a grille, on brass shoulder fittings",
            "LIMBS   flexible steel conduit",
            "FEET    cast metal bases",
          ],
          entries: [
            { stamp: "METHOD", title: "Sorted first, assembled second",
              line: "The drawer is the tell. Compartment after compartment of " +
                    "indicator jewels, bezels, knobs and switchgear, graded and " +
                    "kept — a stock of parts held long before there was a " +
                    "machine that needed any particular one of them.",
              note: "" },
            { stamp: "EIGHT YEARS", title: "The same object, twice",
              line: "Two of the plates are the same chest photographed eight " +
                    "years apart: once in a workshop, unpowered, against a paper " +
                    "mock-up, and once on a bench with current in it. Very " +
                    "little between the two photographs has changed.",
              note: "" },
            { stamp: "CAUTION", title: "What the plates do not establish",
              line: "They establish what the machine is made OF. They establish " +
                    "nothing whatever about where any single part came from. " +
                    "What is listed above is read off the photographs and goes " +
                    "no further than they do.",
              note: "[PAPA] — the donor list, if it is ever published at all" },
          ],
          entriesMode: "list",
          footer: "MGK-VIII · PARTS",
        },
      },
    ],
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
       numbers: robots repo STATE.md, THE NIGHT RUN.
       [A8 2026-08-04] AND IT IS NOW THE MACHINE AND NOTHING ELSE. MIKE: "the
       MGK-VIIIp album cover becomes JUST THE MACHINE ITSELF — nothing else in
       frame, functionally identical otherwise." The file was 1536x2048 with
       the unit sitting in the upper two-thirds of a speckled floor; it is now
       1536x1536, cropped to the unit's own measured bounding box (luminance
       below 100, smoothed profiles, x 162..1337 y 327..1866) — the largest
       square the plate can give without cutting the machine, since the unit is
       1539px tall against a 1536px plate. A CROP AND A COLOUR-MODE CHANGE,
       NOTHING ELSE: no resample, no rotation, no retouch, and the 8-bit grey
       write is lossless because every RGB channel was already identical
       (verified, max deviation 0). 2.69 MB -> 1.40 MB.
       AND IT FIXED A SECOND THING NOBODY HAD NOTICED. `.cf-album` is a square
       box with `object-fit:cover`, so the 3:4 file was being centre-cropped by
       the renderer — the deck has never shown this machine's top or its base.
       Square, it does. The residual is the ground at the left and right edges,
       which cannot come out with a rectangle: taking it needs a cut-out or a
       reshoot, and both are Mike's. */
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
        title: "The Morgue",
        videos: [],
        tags: ["plates", "photographs", "viiip", "reference"],
        face: {
          kind: "text",
          title: "THE MORGUE",
          subtitle: "IMAGE ARCHIVE · MGK-VIIIp",
          /* [A4 2026-08-04] AND THIS ONE TAKES NO SPREADS, WHICH IS THE POINT
             OF THE RULE RATHER THAN AN EXCEPTION TO IT. Nine plates, one
             sitting, no record number and NO DATE DECLARED ON ANY OF THEM —
             the `date` field on these tiles carries a slot label (FRONT,
             SCREEN, BEZEL) because that is what was known when they were
             written. There is nothing to stack them BY, so they stay one
             unheaded wall and render exactly the DOM they rendered before.
             A shelf label on a one-shelf archive is furniture. */
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
        tags: ["journal", "record", "provenance"],
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
          /* ==== [HR 2026-08-04] THE HEADER FURNITURE IS GONE. MIKE'S RULING.
             "Everything between the THE RECORD heading and the first entry's
             headline — the lead blockquote, the object photo and its caption,
             and the SOURCE / INDEX / ORDER register block. ALL OF IT WAS
             INVENTED. Mike has reported this before and it survived. Remove it
             entirely. The Record opens on its entries."
             So `blurb`, `still`, `stillCaption` and `lines` are not rewritten,
             not narrowed and not replaced — they are DELETED, and the face
             carries a heading and its entries. `recordEpoch` went with them:
             it declared 1 January 2024 as day one of the log, which was the
             date of an entry that no longer exists, and `WEEK n` cannot be
             arithmetic on a day nobody has supplied. `entryDateline` simply
             prints one fewer part (record-model.js), which is what it was
             built to do.
             WHAT THIS COSTS, NAMED RATHER THAN PAPERED OVER: the face's own
             plate was this surface's VISUAL HOOK, so the closed Record is now
             a heading and one index row of type. That is a live conflict with
             the standing Visual Hook Law, and it is Mike's ruling that wins —
             a hook built out of an invented caption is the thing this round
             exists to remove. The entry's own plate survives inside it. */
          entries: [
            /* ==== [HR 2026-08-04] RECORD 013, STRIPPED TO WHAT IS KNOWN =====
               MIKE'S RULING: "the entry is still full of invented specifics
               (the heat-crimped pouch taped to carton two, the hinged cover,
               the port location, the charge start time, the indicator
               movement, the 'companion unit' line, the number of cartons, the
               dates). Mike supplied the SHAPE of that day — a modern sealed
               bag holding a USB-C adapter, packed differently from everything
               else; a conversation about deep-discharge and why they didn't
               hack it; a brief power-on before the adapter; a slow charge.
               NOTHING ELSE IS KNOWN."
               Four facts are all this entry may say, so it says them and it
               stops. Every gap the strip exposed is a QUESTION FOR MIKE and
               lives in `docs/RECORD_013_QUESTIONS-20260804.md` — not here, and
               not filled in with something plausible.
               WHAT WENT, BY NAME: THE DATE, so the entry carries no `date`, no
               `stamp` and no weekday and `entryDateline` prints `Record 013`
               alone — which is exactly what record-model.js was built to do
               with an undated entry. THE SECTION "What it plugs into",
               entirely: every sentence in it was a measurement, a location or
               a fitting nobody has supplied. THE SECTION "Also today,
               briefly", entirely: the "companion unit" was its only content.
               ALL FOUR DOORS — the newspaper door pointed at an entry this
               round deleted, the archive door lived inside a section that is
               gone, the film door described footage nobody has cut, and the
               portal door was keyed to the day the entry no longer has.
               THE PLATE STAYS AND ITS CAPTION SHRINKS to what this same file
               is already captioned as on the plate wall ("The power switch,
               round the back"). It is a real photograph of the object the
               entry is about; it is not evidence of the bag, and the caption
               no longer implies that it is. */
            { no: 13,
              title: "The one thing that wasn't packed like the rest",
              evidence: "object",
              still: "/robots/reference/photos/rear_power_switch.png",
              stillCaption: "The back of the unit.",
              line: "A sealed modern bag holding a USB-C adapter, packed " +
                    "unlike everything else that arrived with it. The unit is " +
                    "now on charge.",
              lead: "One item in the delivery was not packed the way the rest " +
                    "of it was packed. It is a USB-C adapter, sealed in a " +
                    "modern bag, and the unit is on charge because of it.",
              sections: [
                { label: "The bag",
                  body:
                    "A sealed bag, modern, holding one USB-C adapter. It was " +
                    "packed differently from everything else that arrived " +
                    "with it." },
                { label: "A conversation about the battery",
                  body:
                    "The cell was discussed before anything was connected: " +
                    "whether it is deep-discharged rather than dead, and " +
                    "whether to hack it. It was not hacked. The unit is " +
                    "charging from the adapter that came in the bag." },
                { label: "It came on, briefly",
                  body:
                    "The unit powered on for a short time before the adapter " +
                    "was used." },
                { label: "On charge",
                  body: "The charge is slow." },
              ],
              tomb: "The unit is drawing power." },
          ],
          /* [HR 2026-08-04] THE FOOTER GOES WITH THE COUNTS IT WAS MADE OF.
             It read "Eleven of 436 records." The 436 came from the SOURCE line
             of the register block Mike ruled invented, and the eleven counted
             ten entries this round deleted. How large the log actually is is a
             question for Mike; it is not a number this file may pick. */
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
          /* ==== [E3 2026-08-03] THE HOOK, AND IT IS NOT A PLATE ============
             THIS FACE IS BUILT FOR IMAGERY AND ITS ARRAY IS EMPTY — the audit's
             words, and still true: `reel.plates` is `[]` because B8 ruled that
             the plates must be PHOTOGRAPHS OF THE PRINTED MANUAL, and nobody
             has printed and photographed it yet.
             SO THE HOOK IS THE SOURCE, LABELLED AS THE SOURCE. B8's own ruling
             says what this file is: "the generated PDF and plates become THE
             SOURCE MIKE PRINTS AND PHOTOGRAPHS; the photograph of that print is
             the artifact." That document exists on disk in the robots repo, and
             its own title page is printed with PRELIMINARY — WORKING COPY / NOT
             FOR DISTRIBUTION across the middle of it.
             THAT SELF-LABEL IS WHY THIS IS SAFE AND WHY NOTHING ELSE WAS. The
             one risk in showing it is a visitor reading "here is the manual",
             and the picture argues against that in its own type before the
             caption gets a word in. Between the printed disclaimer, the caption
             below, and the register line four rows down that still reads
             "PLATES not yet imaged", the face says three times over that this
             is not the artifact.
             THE REEL IS UNTOUCHED AND STILL EMPTY. This is a head plate, not a
             frame; loading it into `plates` would put a rendering into the
             microfiche reader, which is precisely the "in the style of" B8
             forbade. When the photographs arrive they are `plates` entries and
             this string is the one thing on the face that should probably go.
             THE FILE IS COPIED, NOT LINKED: `public/robots/manual/
             working-copy-p1.png`, 21KB, from the robots repo at
             `robots/mgk-viiip/manual/pages/page-01.png`. The museum's build
             cannot reach a sibling repo, so an asset either lives under
             `public/` or does not exist. */
          still: "/robots/manual/working-copy-p1.png",
          /* [CS 2026-08-04] the caption described the PIPELINE ("it gets
             printed, then photographed — the photograph is the plate"), which
             is how this museum makes its plates and not what is in the frame.
             It now says what the picture is, which the picture also says in its
             own type. */
          stillCaption:
            "The working copy, printed with PRELIMINARY — NOT FOR " +
            "DISTRIBUTION across it.",
          blurb:
            "The unit shipped with a manual, and the manual is where the " +
            "machine explains itself — including the parts it gets wrong. " +
            "Page images, not transcription: the typography is the evidence.",
          lines: [
            "FORMAT  photographs of the printed pages, not a rendering",
            "NAV     microfiche reader — page-turn, fit and 1:1 magnify",
            "PLATES  none on file",
          ],
          reel: {
            label: "MICROFICHE · READER",
            /* THE SCANS ARRIVE FROM MIKE. Ordered, reading order, one entry
               per page: { img, label, date }. The shape is the plate wall's
               shape on purpose — one reader serves both. */
            plates: [],
            /* [CS 2026-08-04] "The reader is built and the reel is empty …
               until those exist this is a catalogue entry rather than a
               promise" was the page describing its own construction and its own
               editorial posture. The holdings fact — nothing on file — is the
               half a visitor needs, and it is the half that is honest without
               being about us. */
            note:
              "No pages on file. A plate here is a photograph of the printed " +
              "sheet, edges and margins included.",
          },
          /* THE CONTENTS PAGE, WHICH IS REAL EVEN THOUGH THE PLATES ARE NOT.
             Every section below is attested in the record or in the firmware;
             what is missing is the IMAGE of the page, and each row says so
             rather than pretending otherwise. */
          entries: [
            { stamp: "§ 1", title: "Start-up procedure",
              line: "One of the two items present in every generic unit's " +
                    "inbox from the moment the OS is installed — never “sent”.",
              note: "attested · no plate on file" },
            { stamp: "§ 2", title: "Operating the answer engine",
              line: "Ask, then shake. The reveal holds until you disturb it; " +
                    "the machine never times your reading out.",
              note: "attested · no plate on file" },
            { stamp: "§ 3", title: "Bias, and what it is for",
              line: "The polarity and clarity registers, described in the " +
                    "manual's own UNIVAC-corporate register.",
              note: "attested · no plate on file" },
            { stamp: "§ 4", title: "BIST and AMMMS maintenance",
              line: "The built-in self test and the maintenance messaging — " +
                    "real lore, and the visual language already exists.",
              note: "attested · no plate on file" },
            { stamp: "APP. 1", title: "The passcode landscape",
              line: "0000 through 80085, the tape, and the grid. A found " +
                    "artifact, not an objective — there is no game.",
              note: "attested · no plate on file" },
            { stamp: "MARGINS", title: "The hands in the margins",
              line: "Technicians' and owners' handwriting, scanned with the " +
                    "pages during cataloging. The margins are recovered evidence.",
              note: "[PAPA] — which hands, and what they wrote" },
          ],
          /* [CS 2026-08-04] the footer named the operator and described the
             production queue. Every other face in this wing signs off with the
             unit and the object; this one now does the same. */
          footer: "MGK-VIIIp · THE OWNER'S MANUAL",
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
          /* [E3 2026-08-03] THE FIRMWARE HAS EXACTLY ONE HONEST PORTRAIT AND
             THE MUSEUM ALREADY OWNS IT: the front glass, lit. Source is a
             `.ino` tree — there is nothing to photograph in a source tree, and
             a screenshot of code on this face would be a picture of a text file
             sitting above a page of text.
             WHAT THE GLASS IS, THOUGH, IS THE FIRMWARE'S OUTPUT ON THE REAL
             MACHINE. This face's own claim is that the firmware "cannot be
             wrong about the machine, because it is the machine"; the lit screen
             is that sentence with the evidence attached, and it is the only
             picture in the reference set that shows the software running rather
             than the box it runs in.
             CONSIDERED AND REJECTED: the twin's own top-screen render and the
             screen-treatment contact sheet, both in the robots repo at
             `docs/assets_twin/`. The render is a synthetic frame of a
             comparison exercise and the contact sheet is a working document
             about FONT CHOICE — interesting to us, and inside baseball on a
             visitor's first read of the wing. A photograph of the real glass
             beats a render of a proposed one. */
          still: "/robots/reference/photos/front_screen.png",
          stillCaption: "The front glass, lit — the firmware, running.",
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
            /* [CS 2026-08-04] the row was titled "What this page is, plainly"
               and opened "A first version" — a page introducing itself to the
               reader as a draft. The same sentence stated as HOLDINGS says
               everything the visitor needed and nothing about the drafting. */
            { stamp: "ON FILE", title: "Two trees, named as they sit",
              line: "Both trees are checked in and named exactly as they are " +
                    "on disk. What is NOT here is a reading of them: no " +
                    "walkthrough, no annotated source, no claim about what any " +
                    "module does beyond what its name says.",
              note: "[PAPA] the artifact slot is Mike's to name \u2014 this is the honest floor, not the ceiling" },
            { stamp: "WHY", title: "Why it sits with the founding documents",
              line: "The Record says what was found. The Manual says what it was " +
                    "sold as. The firmware is the only one of the three that " +
                    "cannot be wrong about the machine, because it is the machine.",
              note: "" },
          ],
          entriesMode: "list",
          footer: "MGK-VIIIp \u00b7 FIRMWARE",
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
                /* [CS 2026-08-04] `why` IS PRINTED ON THE PANEL \u2014 it is the
                   refusal line under the latch (Exhibit.jsx :1089, :1222). These
                   five read "held \u2014 one entry state (C3)", "held \u2014 awaiting a
                   privacy ruling" and "held \u2014 workshop entry, by URL": internal
                   decision codes, an unmade ruling, and the existence of an
                   undisclosed URL, all shown to whoever rolls the drum. The
                   instrument now says the one thing an instrument says when a
                   position will not arm. */
                { id: "idling-updated", label: "IDLING, UPD", arms: false,
                  why: "This feed is not available." },
                { id: "boot-playback", label: "BOOT PLAYBK", arms: false,
                  why: "This feed is not available." },
                { id: "off-first-boot", label: "OFF \u00b7 1ST BOOT", arms: false,
                  why: "This feed is not available." },
                { id: "last-state", label: "LAST STATE", arms: false,
                  why: "This feed is not available." },
                { id: "test-bench", label: "TEST BENCH", arms: false,
                  why: "This feed is not available." },
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
          /* [E3 2026-08-03] THE AUDIT COUNTED FIVE TEXT-ONLY FACES IN THIS WING
             AND THERE WERE SIX. VISUAL_HOOK_AUDIT-20260803 lists one "FAQ"
             under Robots; the wing has two — the front desk's, about
             Weird.Baby, and this one, about the unit. Same shape, different
             desk (M2's note, three rows up). It was text-only on the same terms
             as the other five and is fixed on the same terms.
             THE BEZEL IS THE RIGHT PLATE FOR THIS FACE SPECIFICALLY. Two of its
             four questions are about whether what you are looking at is the
             real machine — "Does it still work?", "Is the Portal the real
             machine?" — and the bezel is the piece of the object a visitor
             actually meets: the frame around the glass the Portal draws
             through. It is ours, already in the build as tile four of The
             Plates, and is the head plate of nothing else. */
          still: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREEN_BEZEL.png",
          stillCaption: "The bezel — the frame the Portal is met through.",
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
            /* [CS 2026-08-04] "Why does it say ERROR so often?" IS REMOVED, not
               rewritten. Its answer was "the story around it is Mike's to tell,
               so it is held rather than half-told here", and its note was "held
               \u2014 storyline first (C1/C2)": the operator named on the page, and an
               internal decision code printed under a question. A question whose
               published answer is that the answer has not been written yet is a
               stand-in for a question, and three questions that are answered
               beat four with one placeholder. It comes back as an entry the day
               there is an answer. */
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
  /* [HR 2026-08-04] `contentsPlate` IS GONE — MIKE: "remove the photo strip at
     the bottom of tracklists; it became a standard element at some point and I
     dislike it. Remove it everywhere it appears, all wings."
     L5 (2026-08-02) added it to fill the 664px of blank paper this wing's 24%
     contents column carries. The void it was filling is still there and is
     named in the round log rather than filled with something Mike did not ask
     for. The flag, its render block in Exhibit.jsx and its rules in Exhibit.css
     all went in the same edit; this wing was the only declarant, so /hr, /wb
     and /wal are byte-identical. `viewerPoster` / `viewerPosterCaption` stay —
     they are the VIEWER's poster and predate the plate. */
  exhibitFlow: RobotsExhibitFlow,
};
