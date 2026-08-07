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
// ═══ [H2 2026-08-06] THE PULL-BACK RULE ══════════════════════════════════════
//
//   **NOTHING PUBLISHES UNTIL THE RECORD DELIVERS IT.**
//
// MIKE, stating it generally and telling Ops not to state it as a list of
// categories: "this applies to images, the manual, and probably more. Every
// asset stays held until a Record entry brings it into the story, at which
// point it is placed according to that entry. The archive and the viewer stay
// built; they are simply empty until the story fills them."
//
// THE POPULATION IS "A PICTURE OF THE OBJECTS", AND THAT IS THE WHOLE OF THE
// BOUNDARY. It is not "images in this wing" and it is not a list of rooms: the
// Record is the log of these machines arriving and being opened, so a
// photograph of one cannot honestly exist on the site before an entry brings it
// in. The museum's own SIGNAGE — its wordmark, the lettering it sets, a sleeve
// with no machine in it — is not delivered by anybody and is not governed. That
// distinction is the one exception the rule has, it is declared IN WRITING with
// a reason per file in `reveal/delivery.mjs`, and a file that is neither
// delivered nor signed-off FAILS THE GATE rather than defaulting either way.
//
// WHAT IT COST THIS FILE, so a future session does not go looking: five
// groupings and five photographs off the mainframe's Image Archive, four
// groupings and nine off the portable's, both album covers, both viewer
// posters and their captions, and four face stills. ONE PICTURE SURVIVES ON
// THIS WING — the power switch round the back, on Record 013, which is the
// entry that delivers it. All of it is in git and none of it is deleted from
// disk: the files moved under `public/held/`, because taking a picture off a
// page does not take it off the server and an unlinked address is still an
// address.
//
// ═══ [V1 2026-08-06] AND THE RULE IS A LAUNCH-STATE RULE ════════════════════
//
// MIKE, reversing the round before and giving the reason: **"DURING
// DEVELOPMENT, SHOW EVERYTHING THAT IS PLACED, until asked to filter. The
// pull-back rule is a LAUNCH-STATE rule, not a development-state one. Mike
// cannot direct what he cannot see."**
//
// THE SENTENCE ABOVE IS UNCHANGED AND SO IS EVERYTHING THAT ENFORCES IT. The
// files are still under `public/held/`; `reveal/delivery.mjs` still fails a
// build that puts an undelivered picture at a public address; the ledger still
// says HELD. What changed is that the rule now has a STAGE to be applied in,
// and every governed picture in this file goes through `placed()`
// (src/lib/placement.js), which hands it back during development and answers
// NOTHING at launch — not a hidden address, none at all.
//
// SO THE PARAGRAPH ABOVE IS NOT A LIST OF WHAT WAS LOST. It is the list of what
// this file looks like at LAUNCH, which is one word away and which
// `npm run reveal:check` tests without having to be in it.
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
// ---- N1/N2 2026-08-04: IMAGE ARCHIVE, AND THE TWO SIBLINGS IT IMPLIES -------
// MIKE HAS STRUCK ONE OF THE TWO NAMES. A3 put THE MORGUE on the glass as the
// title with IMAGE ARCHIVE under it as the plain-language subtitle, precisely
// so he could read both and strike one; he struck THE MORGUE. The face is now
// titled IMAGE ARCHIVE and the subtitle carries the unit alone. That closes
// register row M6 and the word "morgue" leaves the building.
//
// THE INDIVIDUAL PHOTOGRAPHS ARE STILL CALLED PLATES, exactly as A3 left them:
// the tombstone rows, the footers, the blurbs and four other faces talk about
// plates by name. The room was renamed; the objects in it were not.
//
// SAME-ONLY-DIFFERENT SAYS THE SIBLINGS ARE THE SAME COMPONENT WITH DIFFERENT
// DATA, and naming them here is the whole of what this round builds of them.
// They take the plain family name too — a house that has just retired a piece
// of trade slang does not keep two more:
//
//   IMAGE ARCHIVE   images   `spreads[].tiles[] = { img, href, label, date }`
//                            LIVE — the two walls below.
//   VIDEO ARCHIVE   video    the identical spread structure; a tile's `img` is
//                            the frame and its `href` is the clip. NOT BUILT:
//                            every `videos:` array in this wing is empty and
//                            the museum holds no clip of either unit.
//   AUDIO ARCHIVE   audio    the identical spread structure; a tile's `img` is
//                            the sleeve or the label and its `href` is the
//                            track. NOT BUILT: this wing has no audio at all.
//                            `/wb` has six tracks and no archive face, which is
//                            where this would land first if Mike wants it.
//
// NEITHER SIBLING IS SCAFFOLDED. An empty container at a live address is the
// thing the NO-COMING-SOON credo and Doctrine 11's corollary both kill; the
// renderer is generic already, so building one on the day there is something
// to put in it costs a data block and no code. Mike's own words for this round
// were "build only what has content", which is the same rule stated forward.
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
/* [R1 2026-08-06] M66 CLOSED — MIKE RULED THE FOLD-IN. The front desk answered
   "How do I get in touch?" with the bare address; D1 reported the divergence
   rather than merging it, because every answer on that face is his word for
   word (P3) and rewriting one under cover of a refactor is the thing D1
   forbids. He has now said it: both rooms carry his own D2 wording, and no
   follow-on sentences. One import, exactly as M66 predicted. */
import { CONTACT } from "../house-copy.js";
/* [V1 2026-08-06] EVERY GOVERNED PICTURE IN THIS FILE GOES THROUGH `placed()`.
   The addresses below are the PUBLIC ones — the address each picture will have
   the day the Record delivers it — and the resolver computes the stage door's
   prefix when the museum is still being built. Read src/lib/placement.js before
   changing a path here, and reveal/stage.mjs for what the two stages are. */
import { placed, placedPresets } from "../../lib/placement.js";
/* [F1 2026-08-06] all three FAQ faces in this wing are built by one function —
   see src/data/faq-face.js for why they cannot carry a blurb or a footer. */
import { faqFace } from "../faq-face.js";

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
/* ═══ [R3 2026-08-05] THE FRONT DESK IS ONE FACE, AND THE TWO CARDS ARE GONE ═
   MIKE: "SIMPLIFY THE ROBOTS HOMEPAGE: remove DOC CONTROL, WELCOME, and
   CONTACT. FAQ is the most important and most encompassing surface — the
   comparison matrix I started imagining is itself a FAQ answer, not a room.
   Fold anything worth keeping from the three removed surfaces into the FAQ;
   delete the rest per the Law of Subtraction."

   SO `deskCard`, `CARD_STOCK`, `CARD_INK`, `CARD_QUIET`, `CARD_ADDRESS` and
   `CARD_STAMP` ARE DELETED — about ninety lines of generator and two SVG data
   URIs. They were the hooks for CONTACT and DOC CONTROL and there is no third
   caller; keeping a card generator against the chance that a face wants one
   again is the definition of a thing that does not need to be there.

   WHAT THE CARDS WERE, RECORDED ONCE SO THE IDEA IS NOT LOST WITH THE CODE.
   Both were TYPOGRAPHIC OBJECTS MADE ENTIRELY OF A SENTENCE THE PAGE WAS
   ALREADY SAYING, drawn as an SVG data URI so the plate renderer would treat
   them as pictures and the wing's B&W law would reach them at the glass — the
   same trick as the booth's ADMIT ONE ticket, the Foundation's account card and
   WAL's house cover. CONTACT's was the address itself set at 46pt under a
   tracked CORRESPONDENCE kicker; DOC CONTROL's was a rubber stamp reading
   APPROVED in a hand-drawn box at 7°, over the four copy-states. The technique
   is alive in three other files. Only these two instances go.

   THE ARGUMENT THEY WERE BUILT ON IS BELOW, KEPT because it is the reasoning
   that put type rather than a borrowed photograph on a house face, and the FAQ
   inherits the opposite half of it — the wing's landing gets a real photograph,
   because the wing's landing is about a physical object. ─────────────────────

   [E3 2026-08-03] THE FRONT DESK'S TWO CARDS
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
   passes killing on the artist plates.
   ─────────────────────────────────────────────────────────────────────────── */

/* ═══ [A5 2026-08-04] THE TALLY CARD IS GONE, AND SO IS THE COUNT ═══════════
   MIKE, and he asked for the law itself to be recorded: "if it does not help,
   it hurts; if it does not need to be there, it needs to not be there." Of the
   31½ card specifically — "it speaks out loud about something not meant to be
   spoken out loud and dilutes the experience."

   E3 built the card on a reading this ruling overturns. Its argument was that
   the number is the wing's best line and a number is the one kind of sentence
   that gets stronger the larger it is set. Both halves were true and the
   conclusion was still wrong: setting it at 132pt made the fraction the loudest
   object on the desk, and the fraction's whole value is that it is never
   explained. A thing withheld cannot also be the headline.

   THE SWEEP MIKE ASKED FOR FOUND THREE PLACES, and all three are gone:
     · this card,
     · its caption on the FAQ face ("Thirty-one and a half."),
     · the FAQ's own "How many are there?" entry, whose answer WAS the count.
   The entry is REMOVED rather than re-answered, because there is no honest
   short answer to "how many are there" that does not print the number, and
   inventing a different one is the thing Doctrine 12 forbids. The FAQ now runs
   five questions.

   WHAT THIS COSTS, STATED RATHER THAN PAPERED OVER: the FAQ face loses its
   visual hook and ships as words alone, which is a live conflict with the
   VISUAL HOOK LAW. Mike ruled the same conflict the same way on /booth in this
   round — the ruling wins and the exception is recorded — and no replacement
   object was invented to fill the slot. Register M29.

   IT ALSO CLOSES M1 BY DELETION. Two houses printed two counts of the same
   machines (31½ here, 31.4 in the robots repo's words draft) and the museum was
   waiting on Mike to pick one. Nothing on this glass prints a count now, so
   there is nothing to reconcile HERE — the robots repo still says 31.4 in its
   own draft and that is that repo's to keep or change. */

/* [S10] the WBR tracks, declared once and referenced by both covers. */
const WBR_TRACKS = [
      /* ═══ [P2 2026-08-05] THE RECORD SITS ABOVE THE FAQ ═════════════════
         MIKE: "THE ROBOTS PAGE ORDER: THE RECORD sits above FAQ."
         The two tracks are the same objects at swapped positions — not one
         character inside either changed with the move. What DID change is which
         face this album's first row opens, and the FAQ's own new first answer
         is written for it: "Finish the FAQ, then follow The Record" sends a
         visitor UP the list on purpose, because the FAQ is where you start and
         the Record is where you go next. */
      /* ==== [R1 2026-08-05] THE RECORD MOVED HERE FROM MGK-VIIIp ========
         MIKE: "the Record applies to ALL things robots, not just the VIIIp."
         It sat as the second track of the MGK-VIIIp album, which made the log
         of the whole reverse-discovery a property of one machine — and the
         wing now holds two, with the mainframe's own chapter still to come.
         NOTHING INSIDE IT CHANGED. Not a heading, not an entry, not the one
         entry's four facts. This is the same object at a different address:
         its face, its `entriesMode:"log"`, its plate and its tombstone are the
         block that stood on the other album, moved whole rather than retyped.
         AND IT GAINED AN ADDRESS OF ITS OWN. `/robots/record` opens the wing
         with this track selected (App.jsx, Exhibit.jsx's `open`), because the
         lobby directory now carries a line for it indented under Weird.Baby
         Robots and a directory line has to land on the thing it names. */
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
          title: "The Record",
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
            /* [R5 2026-08-06] `evidence: "object"` IS STRUCK, AND THE FIELD
               WITH IT ON THIS ENTRY. MIKE, on the badge it printed: "I see no
               richness in it. If it is decoration it GOES. If it can genuinely
               serve the UX — opening the object, or popping the object list
               beside it — propose that; otherwise strike it."
               IT COULD NOT BE MADE TO SERVE, AND THE REASON IS STRUCTURAL. The
               badge printed a WORD with nothing behind it: B9's model has no
               permitted list of classes and no registry of objects, so there is
               no object to open and no list to pop — an "object list" would
               have to be invented to give the control something to do, which is
               Doctrine 12 with a button on it. The thing that DOES tell a
               reader what a week brought is `evidenceOf` — the counted
               wire/plates/docs badges — and it is a different mechanism, still
               rendered, absent here because this entry carries no payloads.
               THE MODEL KEEPS THE FIELD (record-model.js) and nothing renders
               it. It is Mike's own B9 vocabulary and it comes back the day it
               points at something — a filter over a long Record is the obvious
               day, and that is the same mechanism as N9's archive presets. */
            { no: 13,
              title: "The one thing that wasn't packed like the rest",
              /* THE ONE DELIVERED PICTURE IN THE WING, on the entry that
                 delivers it. It goes through `placed()` like every other — the
                 resolver hands a delivered path straight back, in BOTH stages,
                 and a governed picture that skips the resolver is the hole the
                 resolver exists to close. */
              still: placed("/robots/reference/photos/rear_power_switch.png"),
              stillCaption: "The back of the unit.",
              /* [R3 2026-08-06] `line` IS THE EXECUTIVE SUMMARY, AND IT IS
                 BUDGETED. MIKE: the index level serves the HEADLINE and what an
                 engineering organisation would call the EXECUTIVE SUMMARY —
                 every row gets both, all rows the same height, and THE ENTIRE
                 SUMMARY MUST FIT.
                 SO THERE IS NO TRUNCATION ANYWHERE IN THE INDEX ANY MORE and
                 the fit is guaranteed at the DATA end instead: `title` and
                 `line` on a Record entry carry hard character budgets
                 (`tools/reveal-ledger.mjs`, RECORD BUDGETS) and a row that
                 exceeds one FAILS THE GATE. That is what makes "the failure
                 disappears by construction" a mechanism rather than a promise —
                 the old `-webkit-line-clamp:1` cut this very sentence at "packed
                 unlike everything else that arrived with…", which is the half
                 sentence he is describing. */
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
        /* ==== [R3 2026-08-05] THE FAQ ABSORBS THE FRONT DESK ==============
           MIKE: "FAQ is the most important and most encompassing surface — the
           comparison matrix I started imagining is itself a FAQ ANSWER, not a
           room. Fold anything worth keeping from the three removed surfaces
           into the FAQ; delete the rest per the Law of Subtraction."

           WHY A FAQ CAN ABSORB THREE FACES WHEN NO ROOM COULD ABSORB A FAQ.
           Each of the three deleted faces existed to answer a question a
           visitor turns up with — what is this place, why is the manual full of
           holes, how do I reach you — and each answered it in the register of a
           DEPARTMENT rather than of an answer. A question is the smallest unit
           a front desk has. Three of them are three rows here; as rooms they
           cost three tracklist entries and three page-loads to say the same
           things.

           WHAT CAME ACROSS AND FROM WHERE, so the next reader can check the
           fold rather than trust it:
             WELCOME     the lead paragraph (now this face's blurb), the
                         contents register (now `lines`), WHERE TO START, the
                         purveyor posture, the method, WHY WE BOTHER with its
                         [PAPA] intact, the family shot with its caption, and
                         the footer.
             DOC CONTROL Mike's own canon that the manual came in pieces, which
                         is the single most load-bearing sentence that face
                         carried, and the holdings statement that the originals
                         are held and not published, with its [PAPA] intact.
             CONTACT     the address and the three things worth writing about,
                         compressed from three rows into one answer.

           WHAT WAS DELETED OUTRIGHT, NAMED RATHER THAN ABSORBED. The Law of
           Subtraction's test is what is lost, and for each of these the answer
           is nothing a reader would miss, because a face they can already reach
           says it:
             · DOC CONTROL's FILES row. Both Technical Specifications faces name
               the two firmware trees, in more detail than this did.
             · DOC CONTROL's PAGES row. The Manual's own face says "photographs
               of the printed pages, not a rendering" and "PLATES none on file".
             · WELCOME's TAGLINE line. "Purveyors of the Weird" is set into the
               album cover a visitor is looking at while they read this.
             · CONTACT's ranking of the three reasons to write by how much each
               would help us — the last of the ceremony N4 started removing.
           The two typographic cards went with their faces; see the note above
           the spine for what they were.

           THE STILL IS WELCOME'S, AND IT IS THE ONLY THING THIS FACE INHERITS
           THAT IS NOT WORDS. M29 records that the FAQ has shipped with no
           picture since the 31½ card was struck, held under Mike's own
           exception that a page whose words are the hook needs no image — and
           that exception was granted to a face in the middle of a wing. THIS
           FACE WAS THE WING'S LANDING AND IS NOT ANY MORE. [P2 2026-08-05] The
           viewer opens on the FIRST TRACK of the landing album, measured on the
           built bundle, and the Record is the first row now — so /robots opens
           on THE RECORD and this face is one click away. That is a consequence
           of his ordering rather than a separate decision, and it is register
           row M65 rather than a silent change of what the wing introduces
           itself with. F1's argument is still the one that applies, and it was
           that the
           wing whose whole subject is a physical object should not introduce
           itself in prose. The family shot comes across with the job it was
           doing. Nothing new is sourced — the file is already in the build
           twice — and no object is invented for the slot, which is the half of
           A5's ruling that still binds.
           ================================================================= */
        id: "faq",
        title: "FAQ",
        videos: [],
        tags: ["faq", "questions", "about", "house", "purveyor", "buying",
               "documents", "manual", "originals", "contact"],
        /* ═══ [F1 2026-08-06] FOUR THINGS ARE STRUCK AND NAMED ══════════════
           MIKE: *"the robots FAQ uses the Information Booth's layout and format,
           EXACTLY. Today it has a different title format, extra text above the
           table, and a footer that does not belong. STRIP ALL OF IT."*
           WHAT WENT, under the Law of Subtraction, which is a reason to delete
           and never a reason to delete quietly:
             · THE TITLE. "Frequently asked" — the only FAQ face in the museum
               not called FAQ. Two objects with one job and two names.
             · THE 1965 BLURB. Welcome's lead, folded in at R3 when this face
               absorbed the front desk. It was true, and it was three sentences
               of orientation above a list of questions whose first row is
               "Where do I start?". The wing's arrival story is what THE RECORD
               is; R3's own note says the FAQ "stops being the place that says
               everything" and this was the last thing left saying it.
             · THE UNITS / ON FILE / TRADE REGISTER. Welcome's contents list. Its
               three rows are the tracklist beside it (both machines are albums),
               the wing's own faces (photographs, the Record, the manual, the
               firmware — four rows a visitor is looking at), and a posture
               sentence that is answered at length by "What is Weird.Baby
               Robots?" two questions down.
             · THE FOOTER. "'Restoration house' is not what we are…" — the
               house's own voice signing off its own answers, where the booth
               signs off with the address. The [PAPA] clause it carried (final
               wording throughout, and that the answers should be shorter) is
               Mike's own note to himself and is preserved in OPEN_ACTIONS
               rather than in a field nothing prints.
           WHAT IS LOST AND HAS NOWHERE ELSE TO GO, stated plainly: nothing. Each
           of the four is said better by an object the visitor can already reach.
           The face is built by `faqFace()` now — see src/data/faq-face.js for
           why the fields are absent rather than merely unset. */
        face: faqFace("WEIRD.BABY ROBOTS", [
          /* ==== [P3 2026-08-05] THE QUESTIONS ARE MIKE'S ==================
             MIKE: "THE ROBOTS FAQ — replace with the FAQ template and Mike's
             content, verbatim where given."
             SO EVERY ANSWER BELOW IS HIS, WORD FOR WORD, and the rows this face
             used to carry in its own voice went with the questions that held
             them: the purveyor posture, the order of work, the prescribed model,
             W.O., the manual's holes, the originals, and why we bother. THAT IS
             A LOT OF REAL COPY. It is named here rather than mourned — the
             wing's account of itself is not lost, it is on the faces whose
             subject it is, and the front desk stops being the place that says
             everything.
             WHAT IS LOST AND HAS NOWHERE ELSE TO GO, stated because the Law of
             Subtraction is a reason to delete and never a reason to delete
             quietly: the old START row was the only line in the wing that said
             which door is which, and Mike's replacement sends the visitor
             through one door rather than naming three. Register M58. */
            { title: "Where do I start?",
              line: "Finish the FAQ, then follow The Record.",
              note: "" },
            /* [P3] THE SLOT IS HELD AND NOTHING IS WRITTEN IN IT. Mike: "Mike
               will vibe this; the only seed is 'Purveyors of the Weird.Baby'.
               Backlog it, do not write it."
               BOTH FIELDS CARRY THE MARKER, AND THAT IS A MECHANISM RATHER THAN
               A FLOURISH. `scrubFace` keeps an entry whose TITLE survives even
               when its line does not (Exhibit.jsx :116) — so marking the answer
               alone would print this question with nothing under it, which is a
               question whose published answer is that the answer has not been
               written, which is the exact row this wing deleted at CS. Marked in
               both, the entry renders NOTHING and the slot stays in the data,
               where Mike's list of what he owes actually lives. Same path
               /foundation's billionaires answer takes to the same end. M57. */
            { title: "[PAPA] What is Weird.Baby Robots?",
              line: "[PAPA] Mike will vibe this; the only seed is " +
                    "“Purveyors of the Weird.Baby”.",
              note: "" },
            /* [P3] HIS FIRST SENTENCE SHIPS; HIS SECOND IS A DESCRIBED SLOT.
               "Leave the slot, describe it, write nothing" — so the marker sits
               INSIDE the sentence that names what is missing, and the scrubber
               takes the whole clause. A visitor reads the hardware answer and
               stops. What goes in the slot is preserved for Mike and printed
               nowhere. */
            { title: "Is this stuff real?",
              line: "The hardware is — you can hold it at least, and it is " +
                    "heavier than you expect. [PAPA] Everything else — " +
                    "historical accounts, technical specifications, people " +
                    "involved — wants words that SOUND favourable and are not: " +
                    "the house's usefully-useless humour.",
              note: "" },
            { title: "Does it work?",
              line: "See “Is this stuff real?”",
              note: "" },
            /* [P3] THE TRACKING WARNING IS MIKE'S OWN CONDITION ON THIS ANSWER,
               and it is written to agree with the booth's privacy answer clause
               for clause: those platforms know you turned up, this site sets no
               cookie and carries no pixel, and a door out of the building is a
               door out of the building. If that answer changes, this changes
               with it.
               AND THE HOUSE HAS NO HANDLE ON FILE. Nothing in this repository
               names a Weird.Baby account on any platform, so the sentence is
               his instruction and the address is his to supply. It is not
               invented here and it is not quietly dropped either — M60. */
            { title: "Can I buy one?",
              line: "Monitor the website for availability. Follow us on social " +
                    "media — those platforms track you, this site does not, and " +
                    "following one out of here is leaving the building.",
              note: "" },
            { title: "Can I try one?",
              line: "We need to construct a dynamic virtual interface to the " +
                    "MGK System Portal before we can even consider it — but " +
                    "when we do, the answer is yes: available online, free to " +
                    "all to partake.",
              note: "" },
            /* [R1 2026-08-06] the house's own passage, imported — see the head
               of this file. The bare address that stood here is gone. */
            { title: "How do I get in touch?",
              line: CONTACT,
              note: "" },
          /* ═══ [R7 2026-08-06] THE HOUSE FAQ TAKES THE BOOTH'S FORMAT ════════
             MIKE: "the Information Booth IS an FAQ under a better name and
             keeps that name for UX value. Sub-exhibits carry their own FAQs — a
             visitor must never have to run back to the lobby. Conform every wing
             FAQ to the booth's format."
             SO EVERY QUESTION IS ON THE PAGE AND CLICKING ONE OPENS ITS ANSWER,
             which is what `/booth` has done since M3.
             THE "Q" AND "START" STAMPS WENT WITH THE FLAT LIST — the booth
             prints none.
             M57's MECHANISM IS UNTOUCHED AND STILL LOAD-BEARING: the held slot
             above carries the marker in BOTH its title and its line, so
             `scrubFace` drops the entry whole rather than publishing a question
             with nothing under it. An accordion makes that MORE important, not
             less — a question that opens onto silence is worse than one printed
             above silence. */
        ]),
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

/* ═══ [D1 2026-08-06] THE PASSAGES BOTH MACHINES SAY, SAID ONCE ══════════════
   MIKE: "the same content exists in multiple rooms with no link between the
   copies, so fixing one never fixes the other."

   PARITY IS ABSOLUTE IN THIS WING (P1), which means the two machines carry the
   same menu items — and that guarantees a supply of passages BOTH albums have
   to say. Until now each was typed twice: the manual reader's format and
   transport, the empty reel's note, and the shop answer. `npm run parity`
   polices the menu ITEMS and cannot see the words inside them, so a divergence
   here would have been invisible to the one tool built to catch divergence.

   THREE PASSAGES ARE HOISTED AND NOTHING ELSE IS. Two more read almost the same
   on both faces and are DELIBERATELY LEFT ALONE, because they are not one
   passage — they are two passages about two different objects, and folding them
   would be Ops inventing a shared house line out of a coincidence of wording:
     · each FAQ's blurb ("about the cabinet" / "about the unit")
     · "Does it still work?" (the portable's answer carries a second sentence
       about the Portal that the mainframe has no equivalent for)
   Their wording differences ARE reported for Mike's ruling — OPEN_ACTIONS M67 —
   rather than merged here.

   [R2 2026-08-06] M67 IS RULED AND THE FIRST OF THOSE TWO IS GONE. Mike struck
   both FAQ blurbs outright rather than choosing a wording, so the divergence is
   resolved by subtraction and there is no third constant to declare here. The
   second — "Does it still work?" — stands exactly as described above; he ruled
   on the blurb and said nothing about it, and D1's reading that the portable's
   Portal sentence has no mainframe equivalent is untouched.

   [N3 2026-08-06] AND THREE OF THE FOUR ARE NOW ONE. `MANUAL_FORMAT`,
   `MANUAL_NAV` and `REEL_EMPTY_NOTE` are DELETED with the faces that said them:
   the two machine Manual faces became DOCUMENTATION and the document card says
   the holdings fact in the template's own vocabulary. `MANUAL_NAV` is worth one
   line on the way out — "microfiche reader — page-turn, fit and 1:1 magnify"
   described THE RENDERER, which is a subject Doctrine 11 names explicitly, and
   it survived a doctrine sweep in both rooms at once precisely because hoisting
   it had made it one string instead of two. A hoist collapses N register rows
   into one; it does not make the passage right.
   `FAQ_BUY_ONE` STANDS and is still typed once for both machines. */
const FAQ_BUY_ONE =
  "No. The shop carries what the shop carries; the machines " +
  "are not stock.";

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
    /* THE WING'S OWN SLEEVE — declared SIGNAGE in reveal/delivery.mjs, so
       `placed()` hands it back unchanged in both stages. It goes through the
       resolver anyway: a governed path that skips it is a path nobody is
       checking, and the one that skipped it would be the one that mattered. */
    art: placed("/robots/art/wbr-cover-logo.png"),
    accent: null,
    /* not governed — the house's own photo ID, outside `/robots/`. */
    viewerPoster: "/WeirdBaby_PhotoID.png",
    viewerPosterCaption: "Weird.Baby — purveyors of the weird.",
    tracks: WBR_TRACKS,
  },
  /* ═══ [H1 2026-08-06] THE PORTAL LEFT THIS FILE, AND IT IS HELD ══════════
     MIKE: **the Portal is HELD FROM LAUNCH and development continues.** A held
     thing must be UNREACHABLE BY A VISITOR, and a flag in this file would have
     stopped the render and still shipped the material — the eight engravings,
     the refusal lines, the twin's address — in a chunk anybody can fetch.
     THE ALBUM IS `src/data/artists/portal.js` NOW, which nothing public may
     import: `vite.config.js` parks it under `assets/held/`, `src/worker.js`
     refuses that directory without the cookie, and `Robots.jsx` asks for it
     only when `/admin` has been opened. It splices back in at `PORTAL_AT`, so
     the album Mike put second is second again the moment the door is open.
     TWO QUESTIONS WENT WITH IT and are named where they stood: the VIIIp's
     *"Is the Portal the real machine?"* and the NIAC's *"Is the mainframe on
     the Portal?"*. An FAQ on a public page answering questions about a held
     room is a listing of it. */
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
  /* ═══ [Q3 2026-08-05] THE DOOR NOW READS MGK-NIAC ═════════════════════════
     MIKE: "RENAME the MGK-VIII album art to MGK-NIAC — the wing's own canon:
     MGK-VIII = MGK-8 = Magic 8, and NIAC is the name in use. Sweep for every
     place that name appears and conform it."

     THIS ANSWERS A QUESTION THIS FACE WAS PRINTING. The name track's third
     entry was stamped OPEN, titled "Which name goes on the door", and carried
     `[PAPA] — whether the carousel reads MGK-NIAC or MGK-VIII`. It is answered,
     so the marker is gone and the entry states the decision instead of the
     question. A face that keeps asking after the ruling is a dead control.

     WHAT CONFORMED — everything that LABELS this machine: the album title, the
     cover file and the lettering rendered into it, the archive's subtitle, the
     archive tombstone's Subject row, the poster caption, both face footers, the
     tracklist's first row, and the wing's own contents line on Welcome.

     WHAT DID NOT, AND THIS IS THE WHOLE OF IT: every sentence where MGK-VIII is
     a FACT OF THE RECORD rather than a label — "SOLD AS MGK-VIII — ABEAL's 1965
     rebrand", "It was built as MGK-NIAC and sold as MGK-VIII", and the same
     clause inside the FILED entry. Conforming those would delete the fact the
     rename is derived FROM and leave the face saying a machine was built as
     MGK-NIAC and sold as MGK-NIAC. The rename is a decision about the door; it
     is not a claim that the second name never existed.

     ALSO NOT CONFORMED, DELIBERATELY: `id: "mgk-viii"` below and the eleven
     photographs under `/robots/reference/mgk-viii/`. The id is a key, not a
     label — nothing outside this file reads it and nothing prints it — and the
     folder is shared with the robots repo, where `robots/mgk-viii/plates/`
     holds the originals under filenames of their own (`MAGIC8-2021-P01-…`).
     Renaming a directory across two repositories to conform a string nobody
     sees is the change with all the risk and none of the effect. If Mike wants
     the paths moved it is a separate, mechanical round, and it is a register row
     rather than a decision taken here.

     THE FIRST TRACK WAS ALREADY CALLED MGK-NIAC, so the rename collided with
     it, and Q3 resolved the collision by calling that track THE NAME. [P2
     2026-08-05] THAT TRACK IS NOW DELETED IN TOTAL on Mike's instruction — see
     the note where it stood — so the collision is gone and so is the judgement
     Q3 had to make about it. The rename itself stands: everything that LABELS
     this machine reads MGK-NIAC, and every sentence where MGK-VIII is a fact of
     the record still says MGK-VIII.
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "mgk-viii",
    title: "MGK-NIAC",
    /* NO YEAR, AND THAT IS A REFUSAL RATHER THAN A GAP. The VIIIp carries 1965
       because the wing's record puts it there. Nothing in this repository dates
       THIS unit, and the only dates that are certain — 2013 and 2021 — are the
       dates of the PHOTOGRAPHS, not of the object. Printing either under the
       cover would be the museum inventing a provenance it does not hold. The
       carousel simply prints no year, as it already does for the front desk. */
    year: null,
    tags: ["mgk", "viii", "niac", "mainframe", "computer", "abeal", "machine", "detail"],
    /* ═══ [R4 2026-08-05] NIAC IS THE MAINFRAME, AND THE ALBUM SHOWS THE
       MAINFRAME. MIKE'S CANON, and it re-aims every picture on this album:
       "NIAC is the gutted-space-heater computer — the helical core, the
       bar-graph output row. It is so complicated THEY NEEDED A ROBOT TO
       OPERATE IT. The robot — camera-body head, brass tee shoulders, conduit
       limbs — is a HUGE EASTER EGG and is not the subject. ALBUM ART AND ALL
       NIAC IMAGERY SHOW THE MAINFRAME ONLY: the robot stays out of frame until
       it is deliberately spent."

       WHAT THIS ALBUM HAD BEEN SHOWING. Eight plates, of which SIX were the
       robot — the head three-quarters, the head at the lens, the chest and
       shoulders, the lower limbs, an unfinished torso, feet on a plinth, a
       slot mock-up with a limb across it — and the cover badge was the robot's
       face. The album named the mainframe in every sentence of its prose and
       photographed the figure in every frame. V2's obfuscation ruling was
       withholding THE WHOLE SILHOUETTE while spending the egg one joint at a
       time; the rule was doing its job on the wrong object.

       WHAT IT SHOWS NOW: the cabinet. The core through the cage bars, the
       lit column and the cabinet's edge, the red bar bank at the base, and the
       whole interior in trouble. All of one machine, none of them the robot.

       [P7 2026-08-05] AND THE CABINET IS NOW SHOWN WHOLE. MIKE: "capture THE
       ENTIRE MAINFRAME (the heater) — the whole cabinet in frame, the robot
       still out of it." A fifth plate leads the wall and the album cover is
       built on it. THAT SPENDS THE WITHHOLDING ON THIS OBJECT and the wall's
       own tombstone says so where it used to say the opposite. R4's canon is
       untouched by it: the withholding that mattered was always THE FIGURE, and
       the figure is still out of every frame in this wing.

       THE CLAIM ABOUT THE ROBOT IS NOT ON THE GLASS ANYWHERE, and that is the
       point rather than an omission: "so complicated they needed a robot to
       operate it" is the egg, and a face that says it has spent it. It is
       recorded in `reveal/ledger.json` where the house keeps things it holds
       and does not show. ══════════════════════════════════════════════════ */
    /* [A1 2026-08-04, re-cut R4] THE COVER IS THE WING'S OWN TEMPLATE — see the
       note above the MGK-VIIIp album's `art` for the whole ruling. The badge is
       `core_helical.jpg`, still A DETAIL, because this museum holds no
       photograph of this machine whole; the archive below says so in its own
       tombstone. It closes register M30: the badge used to be the same
       photograph as the still on the face one press down, and the two now
       carry different plates. The superseded `mgk-viii-cover.jpg` is left on
       disk and unreferenced, exactly as N1 left `parts_drawer.jpg` — a real
       photograph this museum owns is not deleted by a cover change, and it is
       not re-homed onto a wall whose tombstone counts its plates. Register M9. */
    /* [H2 2026-08-06] PULLED BACK — the cover and the poster are both
       photographs of the object and no Record entry has delivered one.
       [V1 2026-08-06] AND THE PULL-BACK IS A LAUNCH-STATE RULE NOW, so this is
       one line rather than a deletion: `placed()` hands the cover back during
       development and answers nothing at launch, where the carousel draws its
       own sleeve. Nothing about what is DELIVERED changed — the file is still
       under `public/held/` and `reveal:check` still says so. */
    art: placed("/robots/art/mgk-niac-cover.png"),
    accent: null,
    /* [R4] THE POSTER WAS THE CHEST — torso, both shoulders, the top of two
       limbs. That is the robot, so it is gone from here. The poster is the
       meltdown: the whole interior of the cabinet flooded red, which is the one
       plate in the set that reads as A MACHINE DOING SOMETHING without showing
       an operator doing it. It is also the fourth tile of the archive below,
       named here rather than left unremarked, the way the VIIIp album names
       the family shot's double duty. */
    viewerPoster: placed("/robots/reference/mgk-viii/core_meltdown.jpg"),
    viewerPosterCaption:
      "MGK-NIAC, the interior in trouble.",
    tracks: [
      /* ═══ [P2 2026-08-05] THE NAME IS DELETED IN TOTAL ══════════════════
         MIKE'S INSTRUCTION, IN THOSE WORDS, and it is a deletion rather than a
         fold: the track, its face, its five-row register and its three entries
         are gone, and nothing was carried onto another face.
         WHAT WENT WITH IT, NAMED RATHER THAN QUIETLY DROPPED. The two-names
         reconciliation — built as MGK-NIAC, sold as MGK-VIII, ABEAL did the
         selling and ABEAL did the renaming — is stated nowhere in this wing
         now. Neither is the mainframe-against-portable comparison (the classic
         answer set here; the adjustable personality, the named engines and the
         menu there, all of them later and all of them the portable's), nor the
         FILED row that answered Q3's own question about which name goes on the
         door. That question is still ANSWERED, by the album being called
         MGK-NIAC. It is no longer EXPLAINED.
         AND IT CLOSES A PARITY DIVERGENCE BY SUBTRACTION. "The Name" was the
         one menu item the mainframe had and the portable did not, and the
         justification table's only PROPERTY-class entry was written about it.
         Both are gone. Register M59. */
      /* ═══ [N1/N10 2026-08-06] THE MENU IS RE-ORDERED, ON BOTH MACHINES ═════
         MIKE: "TECHNICAL SPECIFICATIONS moves to the TOP of the menu" and "the
         FAQ goes to the BOTTOM."
         BOTH ALBUMS MOVE, AND THAT IS PARITY DOING ITS JOB RATHER THAN OPS
         OVERREACHING. `tools/menu-parity.mjs` sets the two machines' track
         titles against each other AND compares their ORDER; under the absolute
         rule (REMOTE CONTROL P1) a difference in either is a failure with no
         written reason available. His instruction is under the MGK-NIAC
         heading; obeying it on one album alone would fail the gate on the next
         commit, so the order is one order:
             TECHNICAL SPECIFICATIONS · IMAGE ARCHIVE · DOCUMENTATION · FAQ
         THE MIDDLE TWO KEEP THEIR RELATIVE ORDER. He moved the ends; nothing
         about the middle was ruled on, so nothing about it was decided here. */
      {
        id: "firmware",
        title: "Technical Specifications",
        videos: [],
        tags: ["firmware", "source", "ino", "bench", "led", "artifact", "specifications"],
        /* ═══ [N2 2026-08-06] THIS FACE IS THE ONE SHEET ═══════════════════════
           MIKE: "remove what the machine is running, the two-generations-of-code
           note, the no-reading-on-file line, and the output-row picture beside
           them. THE REST BECOMES A PERIOD-ACCURATE TECHNICAL SPECIFICATION — not
           the completeness of the manual, but THE ONE SHEET: the thing you grab
           when you ask what it does technically."

           WHAT WENT, BY NAME, so nothing is quietly absorbed:
             · the subtitle WHAT THE MACHINE IS RUNNING. The face now takes the
               unit's name, which is what every other subtitle in this wing does.
             · the blurb — "two generations of code are on file and both are
               real… what follows is what the files say about themselves. No
               reading of them is on file." Three of his four strikes are in
               that one paragraph.
             · `output_row.jpg` and its caption. A spec sheet is not illustrated;
               that is most of what makes it a spec sheet. The photograph is not
               deleted from anywhere — it is a tile on the wall one row down.
             · THE FOUR PROSE ENTRIES, which are the shape this is being
               converted OUT of. Every FACT in them survives as a row below; what
               does not survive is the builder's own line about the power draw
               ("If I make too bright at once the Nano will shut down") — a real
               quotation and the best sentence on the old face, with no row on a
               spec sheet to live in. It is named in OPEN_ACTIONS (N-b) rather
               than lost, because the Law of Subtraction is a reason to delete
               and never a reason to delete quietly.

           NOT ONE FACT BELOW IS NEW. Every figure, rule and caveat was already
           on this face; the change is FORM. In particular the brightness cap
           keeps the caveat it arrived with — 32 is a limit measured on a BENCH
           board and the flagship targets an R4 — because dropping the caveat
           while keeping the number is how a spec sheet starts lying.

           AND IT HAS NO PICTURE, which is a live conflict with the standing
           Visual Hook Law and is his own instruction. It is the third face in
           this wing left without one deliberately (M29, M48 are the others) and
           it is register row N-c rather than a silence. */
        face: {
          kind: "text",
          title: "Technical Specifications",
          subtitle: "MGK-NIAC",
          lines: [
            "BOARD    Uno R4 WiFi",
            "PROGRAM  v0.1 · 2026-02-23 · 1,385 lines",
            "STATUS   baseline — pre-thermal-validation",
            "BENCH    8 single-subsystem sketches, January 2026",
            "MATRIX   8 × 16 — seven rows visible, the eighth wired, driven and behind something",
            "BAR      1 × 64, addressed as a single chain",
            "OUTPUTS  2 matrix chains · 2 bar chains · 3 servos",
            "LAMPS    all-at-once flashes capped at 32, a quarter of standard — a bench limit on a bench board",
            "DECLARED five rules, in the header, above the first include",
            "RULE 1   a numerical envelope",
            "RULE 2   a ceiling of eight core states",
            "RULE 3   mutual exclusion",
            "RULE 4   a reveal no faster than twelve seconds",
            "RULE 5   no adaptive learning — the machine is forbidden, in writing, from getting to know you",
          ],
          footer: "MGK-NIAC · TECHNICAL SPECIFICATIONS",
        },
      },
      {
        /* ==== THE IMAGE ARCHIVE, AND THE THING IT IS BUILT NOT TO SHOW =====
           [N1 2026-08-04] MIKE STRUCK "THE MORGUE". A3 deliberately printed
           both candidate names — title THE MORGUE, subtitle IMAGE ARCHIVE — so
           that the choice could be made by looking rather than by describing;
           it was made. IMAGE ARCHIVE is the title and the subtitle drops back
           to naming the unit, which is what every other subtitle in this wing
           does. Register row M6 closes.

           This is the VIIIp plate wall's renderer, unchanged, pointed at a set
           that has been cropped before it ever reached the repository. Same
           glued-up wall, same tilt, same tap-to-open reader.
           CAPTIONS ARE WHAT THE PHOTOGRAPH SHOWS, in the wing's own register —
           the rule the VIIIp wall set. No caption below interprets, dates the
           OBJECT, or names a donor part.

           ═══ [N4 2026-08-06] THE LEAD-IN AND THE TOMBSTONE ARE BOTH STRUCK ═══
           MIKE: "strike the 'five plates of the mainframe' block and the
           SUBJECT / STATE / PLATES / FRAME register beside the images. THE FORM
           HAS MERIT but it does not belong here. A very simple lead-in to what
           is in the archive is welcome IF ONE IS GENUINELY NEEDED."
           THERE IS NO LEAD-IN, AND THAT IS THE ANSWER TO HIS "IF". A wall of
           photographs under a heading reading IMAGE ARCHIVE, with a row of named
           groupings above it each carrying its own count, has already said what
           is in the archive — twice. A sentence saying it a third time is the
           second object saying what the first already said (Doctrine 16).
           THE TOMBSTONE COST SOMETHING AND IT IS NAMED: its `Frame` row was the
           only place that told a visitor the withholding was AUTHORED, and its
           `Rights` row was the only statement on this wall that the photographs
           are ours. Both are register rows (N-d) rather than silences. Its
           `Plates` row was a COUNT, which the groupings above now carry live —
           a hand-typed count beside a wall is the defect class W1 and D3c both
           paid for, so that one is not a loss at all.
           THE TWIN ON THE PORTABLE'S WALL WENT IN THE SAME EDIT. One face type,
           appearing twice; striking one copy is how the same object ends up in
           two forms in two rooms, which is the defect Doctrine 17 is named for.
           And it closes M25 by subtraction — the "before power" claim that
           contradicted a lit plate was a tombstone row.

           ═══ [N8 2026-08-06] THE UNIT NOUN IS THE PHOTOGRAPH ═════════════════
           MIKE: "PLATES becomes PHOTOGRAPHS or IMAGES — propose and use the
           best." IT IS PHOTOGRAPHS, for three reasons and the third is the one
           that decides it.
             · PLATE IS TRADE SLANG, and this wing has retired a piece of trade
               slang before on exactly this reasoning: THE MORGUE went at N1 and
               "a house that has just retired one piece of trade slang does not
               keep two more" is this file's own sentence about it.
             · IMAGES IS TAUTOLOGICAL HERE. "Five images" in the IMAGE ARCHIVE
               is the room's name counted back at you; it carries no information
               the heading has not already given.
             · PHOTOGRAPH SAYS WHAT THE OBJECT IS. These are photographs — not
               scans, not renders, not drawings — and the distinction is
               load-bearing everywhere in this wing (B8's whole ruling on the
               manual is photographs-not-renderings, and P2 struck a plate for
               being a render). A word that keeps that distinction alive is
               worth more than one that blurs it.
           THE FOOTER TAKES THE WING'S STANDARD SIGN-OFF. It read "Five plates ·
           Weird.Baby Robots" — a count and a house name, which Mike called not
           useful and which was also a second hand-typed count. Every other face
           in this wing signs off UNIT · OBJECT, so this one does too. */
        id: "plates",
        title: "Image Archive",
        videos: [],
        tags: ["plates", "photographs", "viii", "reference", "detail"],
        face: {
          kind: "text",
          title: "Image Archive",
          subtitle: "MGK-NIAC",
          archiveUnit: { one: "photograph", many: "photographs" },
          /* ═══ [N9 2026-08-06] THE GROUPINGS ═════════════════════════════════
             MIKE: "build presets that filter the list into groupings which,
             viewed together and IN THAT ORDER, give a sense of satisfaction —
             not literal stories, and Mike will not be writing them. The last few
             presets chunk it coarsely for completists; the VALUE is in the
             curated ones."
             THE ORDER IS THE ARC AND IT IS THE ONLY THING AUTHORED HERE: walk up
             to the machine, then go into the cage, then watch it run and then
             watch it go wrong. Every grouping is a subset of the wall below and
             every LABEL is read off the tiles' own captions — the curation is
             the CUT and the SEQUENCE, not a new claim about any photograph.
             THE COARSE ONE IS LAST, per his instruction, and it is this wall's
             own everything. IT IS NOT "all NIAC, all VIIIp, everything": those
             three would span both machines, and this album's archive is the
             mainframe's. Whether the wing's two archives should become one room
             with one set of groupings is a design call and it is his —
             OPEN_ACTIONS N-e. */
          /* ═══ [H2 2026-08-06] THE WALL IS EMPTY, AND THE WALL IS STILL HERE ══
             MIKE: "the Image Archive pulls back... the archive and the viewer
             stay built; they are simply empty until the story fills them."
             ═══ [V1 2026-08-06] AND THE WALL IS FULL AGAIN UNTIL LAUNCH ════════
             H2's own last sentence said the day a Record entry delivers a plate
             it is "a `presets` array here and nothing else moves". That is what
             this is — the same array, restored from git word for word, with
             every address through `placedPresets()`. At LAUNCH each tile
             resolves to nothing, the groupings empty, `presets` goes undefined
             and `archiveEmpty` below prints exactly the sentence it printed for
             the whole of H2. The empty state is not deleted; it is the OTHER
             stage, and it is one word away. */
          presets: placedPresets([
            { id: "whole", label: "The whole cabinet", tiles: [
              { img: "/robots/reference/mgk-viii/cabinet_whole.jpg",
                href: "/robots/reference/mgk-viii/cabinet_whole.jpg",
                label: "The cabinet, whole — lit core, bar bank, both feet",
                date: "MAR 2021" },
            ] },
            { id: "bars", label: "Through the bars", tiles: [
              { img: "/robots/reference/mgk-viii/core_helical.jpg",
                href: "/robots/reference/mgk-viii/core_helical.jpg",
                label: "The core, through the cage bars — warm flanks either side",
                date: "MAR 2021" },
              { img: "/robots/reference/mgk-viii/column_lit.jpg",
                href: "/robots/reference/mgk-viii/column_lit.jpg",
                label: "A lit column behind the bars, and the cabinet's edge",
                date: "MAR 2021" },
            ] },
            { id: "running", label: "Running, and in trouble", tiles: [
              { img: "/robots/reference/mgk-viii/output_row.jpg",
                href: "/robots/reference/mgk-viii/output_row.jpg",
                label: "The output row — the red bar bank at the base, mid-pattern",
                date: "MAR 2021" },
              { img: "/robots/reference/mgk-viii/core_meltdown.jpg",
                href: "/robots/reference/mgk-viii/core_meltdown.jpg",
                label: "The whole interior in red-orange, the core glowing like an element",
                date: "MAR 2021" },
            ] },
            { id: "all", label: "Every photograph", tiles: [
              { img: "/robots/reference/mgk-viii/cabinet_whole.jpg",
                href: "/robots/reference/mgk-viii/cabinet_whole.jpg",
                label: "The cabinet, whole — lit core, bar bank, both feet",
                date: "MAR 2021" },
              { img: "/robots/reference/mgk-viii/core_helical.jpg",
                href: "/robots/reference/mgk-viii/core_helical.jpg",
                label: "The core, through the cage bars — warm flanks either side",
                date: "MAR 2021" },
              { img: "/robots/reference/mgk-viii/column_lit.jpg",
                href: "/robots/reference/mgk-viii/column_lit.jpg",
                label: "A lit column behind the bars, and the cabinet's edge",
                date: "MAR 2021" },
              { img: "/robots/reference/mgk-viii/output_row.jpg",
                href: "/robots/reference/mgk-viii/output_row.jpg",
                label: "The output row — the red bar bank at the base, mid-pattern",
                date: "MAR 2021" },
              { img: "/robots/reference/mgk-viii/core_meltdown.jpg",
                href: "/robots/reference/mgk-viii/core_meltdown.jpg",
                label: "The whole interior in red-orange, the core glowing like an element",
                date: "MAR 2021" },
            ] },
          ]),
          archiveEmpty:
            "No photograph of the mainframe is on the wall. The museum holds " +
            "images of this machine and the Record has not brought any of " +
            "them into the story yet.",
          footer: "MGK-NIAC · IMAGE ARCHIVE",
          /* [D3a 2026-08-06] ONE MARKED SENTENCE. A `papa` field is not a
             comment — an earlier edit split this note in two and put the marker
             in only the first half, and the wall printed the second. */
          papa: "[PAPA] — the cabinet is shown whole now and the robot is " +
                "not, how much further that goes and when, and that the " +
                "uncropped originals are all on file and any of them can be " +
                "published from this file alone.",
        },
      },
      {
        /* ═══ [P1 2026-08-05] PARITY IS ABSOLUTE, AND THIS IS THE ROW THAT
           COSTS SOMETHING ═════════════════════════════════════════════════
           MIKE OVERRULED THE OPS RULING OF THE PREVIOUS ROUND: the two machines
           carry THE SAME MENU ITEMS, no more and no less; a divergence is a
           FAILURE and a holdings gap no longer resolves one.
           HIS REASON IS ALSO THE EXCEPTION'S REASON. NIAC will run on the Portal
           on channels 1 and 2, and it will have documents. These rows are not
           doors onto rooms nobody intends to build — they are the shelf the
           material lands on. So THE STUB LAW IS OVERRIDDEN HERE AND ONLY HERE,
           and the reason is his: A ROW IS A PROMISE ONLY WHEN NOTHING IS COMING,
           AND THESE ARE COMING.
           WHAT THE EXCEPTION DOES NOT LICENSE: DOCTRINE 12 STILL BINDS EVERY
           WORD BELOW. The row says what is NOT held. It states no date, no
           section list, no page count and no schedule.

           ═══ [N3 2026-08-06] "THE MANUAL" IS NOW "DOCUMENTATION" ═════════════
           MIKE: "a viewer free to display any document, with the manual inside
           it as a SELECTABLE ENTITY that opens on the screen when clicked.
           Strike everything currently on that face except what we are actually
           holding. THE FORMAT MUST BE A TEMPLATE and every documentation page
           must look the same — check first whether an existing template already
           serves this; do not create new machinery we do not need."
           IT DID, AND NOTHING NEW WAS BUILT. L6's document card — title,
           provenance, a STATE, and a scan that opens in this wing's own reader —
           is a documentation template with another name on it. It was LIFTED OUT
           of the Record's renderer into `DocList` and is now called from two
           places with one markup (Exhibit.jsx). One field was added, `plates`,
           because a document with more than one page needs an ordered set of
           page images and the museum already has that shape.
           THE MAINFRAME HOLDS NO DOCUMENTS AT ALL, so this face carries no list
           and says so in one sentence. That is the whole face, and it is the
           honest state of a shelf with nothing on it. */
        id: "manual",
        title: "Documentation",
        videos: [],
        tags: ["manual", "documentation", "niac", "mainframe", "opa"],
        face: {
          kind: "plate",
          title: "Documentation",
          subtitle: "MGK-NIAC",
          docsEmpty:
            "No document for the mainframe is held here. The portable arrived " +
            "with a manual — ABEAL 8P-OMI-1, incomplete, assembled out of " +
            "copies caught at different stages — and nothing of the kind has " +
            "reached this museum for the cabinet.",
          footer: "MGK-NIAC · DOCUMENTATION",
        },
      },
      {
        /* ═══ [P1 2026-08-05] THE MAINFRAME'S OWN FAQ ══════════════════════
           The second of the two rows parity requires, and unlike Documentation
           it did NOT need the stub-law exception: every answer below was already
           asserted in this file about these machines.
           THE STILL IS `column_lit.jpg`, which the deletion of THE NAME freed.
           It is still a tile on the wall above — the same double duty the bezel
           does on the portable.
           [R7/N10 2026-08-06] IT IS AN ACCORDION NOW AND IT SITS AT THE BOTTOM
           OF THE MENU. Both are Mike's, and the format is the Information
           Booth's, which he ruled is the established one. The "Q" stamps went
           with the flat list: a list of questions under a heading reading FAQ
           does not need every row prefixed with the letter Q. */
        id: "niac-faq",
        title: "FAQ",
        videos: [],
        tags: ["faq", "questions", "niac", "mainframe"],
        /* [F1 2026-08-06] BUILT BY `faqFace()`. The still that used to sit here
           (`column_lit.jpg`) and the "MGK-NIAC · FAQ" footer are both struck —
           the booth's shape has neither, and the plate is still a tile on this
           album's own Image Archive, which is where it was already doing its
           second job. */
        face: faqFace("MGK-NIAC", [
          { title: "Does it still work?",
            line: "Yes. Both units power on and run their own firmware.",
            note: "" },
          /* [H1 2026-08-06] THE PORTAL QUESTION MOVED WITH THE PORTAL.
             It is answered word for word on the held album's own FAQ
             (src/data/artists/portal.js). A public page answering questions
             about a held room is a listing of that room, which is the one
             thing the hold has to prevent. */
          { title: "Can I buy one?",
            line: FAQ_BUY_ONE,
            note: "" },
        ]),
      },
      /* [N1 2026-08-04] "THE PARTS" IS REMOVED. Mike's instruction, and it is a
         removal rather than a rewrite: the whole track and its face are gone.
         WHAT LEFT WITH IT, NAMED RATHER THAN QUIETLY DROPPED, because two of
         the three entries were observations read straight off the photographs
         and are not recoverable from anything else on the wing: the METHOD row
         (the parts drawer as the tell — a graded stock of indicator jewels and
         switchgear kept before any machine needed them), the EIGHT YEARS row
         (two plates are the same chest photographed eight years apart, and very
         little between them changed), and the CAUTION row, which was the only
         place in the wing that said the plates establish what the machine is
         made OF and nothing whatever about where any single part came from.
         The four-line materials register (head, chest, limbs, feet) went too.
         AND IT ORPHANS A PHOTOGRAPH. `/robots/reference/mgk-viii/parts_drawer.jpg`
         is now referenced by nothing — it was this face's plate and appears on
         no wall. It is a real photograph the museum owns, so it is NOT deleted
         on Ops' word and it is NOT re-homed onto the Image Archive either, which
         would be adding a photograph nobody asked for to a wall whose groupings
         count them. It is a register row for Mike. */
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
       reshoot, and both are Mike's.
       ═══ [A1 2026-08-04] AND NOW IT IS NOT THE COVER AT ALL ═══════════════
       MIKE (third revision): "use the ROBOTS art as the base — REPLACE the W.B
       logo with an image of the unit, and REPLACE the word ROBOTS with the
       model number. Same treatment for both albums so the wing shares one
       theme."
       THE COVERS ARE NOW A FAMILY RATHER THAN THREE UNRELATED PICTURES. The
       front desk's cover has always been paper, a border, a disc and a word;
       the two machines were a lit grille and a bare unit on a wall. Standing in
       one deck they read as a house cover followed by two photographs. They now
       read as one series: same square, same ground, same border at the same
       inset, the same Georgia setting at the same size and drop, the same rule,
       the same strapline. The photograph moves INTO the disc the WB mark used
       to occupy, and the model number takes the place of the word ROBOTS.
       BUILT BY `tools/make_unit_covers.py`, whose constants are lifted from
       `make_robots_cover.py` rather than re-chosen — "one theme" is a claim
       about geometry, and a hand-matched cover drifts the first time either is
       re-rendered. Two things differ from the base and both are recorded in
       that file's header: the rule drops 14px on BOTH machine covers so
       MGK-VIIIp's descender clears it, and the word's tracking is solved per
       cover so a nine-glyph model number sets inside the same measure a
       six-glyph one does.
       `viiip.png` STAYS IN THE BUILD — it is the tenth tile of this album's
       own Image Archive (below), which is where the composited BIOS beat is
       shown and captioned. It stopped being the cover; it did not stop being a
       plate. A8's crop is untouched. */
    /* [H2 2026-08-06] PULLED BACK — the cover and the poster are both
       photographs of the object and no Record entry has delivered one.
       [V1 2026-08-06] See the mainframe's album above: the rule is unchanged
       and is APPLIED at launch rather than always. */
    art: placed("/robots/art/mgk-viiip-cover.png"),
    accent: null,
    /* [E2] THE VIEWER'S DEFAULT — the family shot.
       Chosen over the alternatives on honesty: it is a real photograph of the
       two real units in one frame, already in the repo, already B&W, and it is
       the actual subject of the exhibit. The album cover was the runner-up and
       loses for being redundant (it is six inches to the left in the deck);
       a findings-log face loses because the log is words, and words are not a
       compelling thing to LAND on. */
    viewerPoster: placed("/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png"),
    viewerPosterCaption:
      "MGK-VIIIp −02 “The Informer”, front and top, as received.",
    tracks: [
      /* [N1/N10 2026-08-06] SAME ORDER AS THE MAINFRAME, and it is the parity
         gate that makes that a fact rather than a courtesy — `menu-parity.mjs`
         compares the two menus' ORDER as well as their contents. See the note
         at the head of the mainframe's tracklist. */
      {
        /* [C4 / M2 2026-08-01] THE FIRST-LEVEL ARTIFACT SLOT.
           Mike's doctrine ordered the tracks Record, Manual, [artifact],
           Portal — "not afterthoughts and add-ons, but not the boilerplate
           either". The slot was left unnamed, so it is filled with the one
           first-level artifact that is REAL AND IN HAND TODAY: the firmware
           itself. Two trees are on file and both are checked in.
           [N1 2026-08-04] renamed with its twin on the mainframe.
           [N2 2026-08-06] AND IT IS DELIBERATELY NOT RE-CUT AS A ONE SHEET.
           Mike's spec-sheet instruction is written under the MGK-NIAC heading
           and is about that face's four named contents; this face is a different
           subject (two source trees, named as they sit) and he did not read it
           this round. Conforming it anyway would be Ops extending a ruling past
           what was ruled — and leaving the two Technical Specifications faces in
           two FORMS is a real inconsistency, so it is reported rather than
           quietly resolved either way: OPEN_ACTIONS N-f. */
        id: "firmware",
        title: "Technical Specifications",
        videos: [],
        tags: ["firmware", "artifact", "source", "1965", "ino", "specifications"],
        face: {
          kind: "text",
          title: "Technical Specifications",
          subtitle: "THE MACHINE'S OWN MIND, ON FILE",
          /* [E3 2026-08-03] THE FIRMWARE HAS EXACTLY ONE HONEST PORTRAIT AND
             THE MUSEUM ALREADY OWNS IT: the front glass, lit. Source is a
             `.ino` tree — there is nothing to photograph in a source tree, and
             a screenshot of code on this face would be a picture of a text file
             sitting above a page of text.
             WHAT THE GLASS IS, THOUGH, IS THE FIRMWARE'S OUTPUT ON THE REAL
             MACHINE. This face's own claim is that the firmware "cannot be
             wrong about the machine, because it is the machine"; the lit screen
             is that sentence with the evidence attached. */
          /* [H2 2026-08-06] PULLED BACK — see THE PULL-BACK RULE at the head
             of this file. [V1 2026-08-06] Applied at LAUNCH, not always. */
          still: placed("/robots/reference/photos/front_screen.png"),
          stillCaption: "The front glass, lit — the firmware, running.",
          blurb:
            "Everything the unit knows how to do is in here — not a " +
            "description of the machine's behaviour but the behaviour itself, " +
            /* [H1 2026-08-06] THE LAST SENTENCE NAMED THE PORTAL TRACK and is
               struck; the paragraph's subject is the firmware and it survives
               whole. The twin's relationship to the first tree is a fact about
               the firmware and is now stated where the twin is — behind the
               door, on the held album's FAQ. */
            "in the form the machine reads it.",
          lines: [
            "TREES    2 on file",
            "PRIMARY  MGK_VIIIp_01__20240721_WORKS — the tree the twin follows",
            "SECOND   MGK_VIIIp_02__20260724_AUDIT",
            "FORM     .ino modules — menu, boot, audio, graphics, input, games",
          ],
          entries: [
            { stamp: "ON FILE", title: "Two trees, named as they sit",
              line: "Both trees are checked in and named exactly as they are " +
                    "on disk. What is NOT here is a reading of them: no " +
                    "walkthrough, no annotated source, no claim about what any " +
                    "module does beyond what its name says.",
              note: "[PAPA] the artifact slot is Mike's to name — this is the honest floor, not the ceiling" },
            { stamp: "WHY", title: "Why it sits with the founding documents",
              line: "The Record says what was found. The Manual says what it was " +
                    "sold as. The firmware is the only one of the three that " +
                    "cannot be wrong about the machine, because it is the machine.",
              note: "" },
          ],
          entriesMode: "list",
          footer: "MGK-VIIIp · TECHNICAL SPECIFICATIONS",
        },
      },
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
         renderer, unchanged, pointed at the museum's own photographs instead of
         at YouTube posters: the same glued-up wall, the same tilt, the same
         shadow, the same tap-to-open — which is exactly what "belongs beside
         the collage wall" means when the bar is set by that wall.
         THEY ARE OUR OWN IMAGES on our own origin, so there is no rights
         question here at all — the one that governs WAL's tiles does not
         arise. Captions are what the photograph SHOWS, in the wing's own
         register; the interpretation stays on the faces that already carry it.
         ================================================================== */
      {
        /* [N4/N8/N9 2026-08-06] THE TWIN OF THE MAINFRAME'S WALL, AND IT TOOK
           THE SAME THREE EDITS IN THE SAME PASS — the lead-in and the tombstone
           struck, the unit noun changed to PHOTOGRAPHS, the footer taken back to
           the wing's standard sign-off, and groupings added above the wall. The
           reasoning for each is written once, on the mainframe's archive face.
           WHAT STRIKING THIS TOMBSTONE COSTS, NAMED: its `State` row was the
           "As received — before cleaning, before power" claim that M25 exists
           because one plate on this very wall contradicts (the glass, lit). M25
           CLOSES BY SUBTRACTION — there is no sentence left to contradict. Its
           `Plates` row was the count M7's answer was supposed to move; the
           groupings carry a live count now, so that half of M7 is moot and the
           caption half stands untouched. And its `Rights` row was this wall's
           only statement that the photographs are ours (register N-d, with the
           mainframe's). */
        id: "plates",
        title: "Image Archive",
        videos: [],
        tags: ["plates", "photographs", "viiip", "reference"],
        face: {
          kind: "text",
          title: "Image Archive",
          subtitle: "MGK-VIIIp",
          archiveUnit: { one: "photograph", many: "photographs" },
          /* [N9] THE ARC: what arrived, then the glass it is met through, then
             what stands above and below it. The order is the curation; every
             label is read off the tiles' own captions. The coarse everything is
             last, per Mike's instruction. */
          /* ═══ [H2 2026-08-06] THE WALL IS EMPTY, AND THE WALL IS STILL HERE ══
             The mainframe's archive carries the reasoning; this face took the
             same edit in the same pass. FOUR GROUPINGS AND NINE PHOTOGRAPHS
             came off it — As they arrived (3), The glass (3), Above and below
             (3), and the coarse Every photograph — of which ONE, the power
             switch round the back, is the single picture in this wing a Record
             entry HAS delivered. It is on that entry, where the rule puts it,
             and not on a wall of nine.
             [V1 2026-08-06] RESTORED THROUGH `placedPresets()` — see the
             mainframe's wall. AND THIS WALL IS THE ONE THAT PROVES THE RESOLVER
             RUNS PER TILE RATHER THAN PER FACE: the power switch is DELIVERED
             and the other eight are not, so at launch this wall does not empty
             evenly — "As they arrived" comes back with one tile of three and the
             coarse grouping with one of nine, which is the honest answer and is
             what `placedTiles` filtering per tile buys. */
          presets: placedPresets([
            { id: "arrived", label: "As they arrived", tiles: [
              { img: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png",
                href: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png",
                label: "The pair, front and top, as received", date: "FAMILY SHOT" },
              { img: "/robots/reference/photos/front_full.png",
                href: "/robots/reference/photos/front_full.png",
                label: "The front, whole", date: "FRONT" },
              { img: "/robots/reference/photos/rear_power_switch.png",
                href: "/robots/reference/photos/rear_power_switch.png",
                label: "The power switch, round the back", date: "REAR" },
            ] },
            { id: "glass", label: "The glass", tiles: [
              { img: "/robots/reference/photos/front_screen.png",
                href: "/robots/reference/photos/front_screen.png",
                label: "The front glass, lit", date: "SCREEN" },
              { img: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREEN_BEZEL.png",
                href: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREEN_BEZEL.png",
                label: "The bezel around the glass", date: "BEZEL" },
              { img: "/robots/art/viiip.png",
                href: "/robots/art/viiip.png",
                label: "The cover image — the glass carries the BIOS beat",
                date: "COVER" },
            ] },
            { id: "stand", label: "Above and below", tiles: [
              { img: "/robots/reference/photos/top_monitor.png",
                href: "/robots/reference/photos/top_monitor.png",
                label: "The top monitor", date: "TOP" },
              { img: "/robots/reference/photos/monitor_base.png",
                href: "/robots/reference/photos/monitor_base.png",
                label: "The base it stands on", date: "BASE" },
              { img: "/robots/reference/photos/unit_new_base.png",
                href: "/robots/reference/photos/unit_new_base.png",
                label: "The unit on its new base", date: "BASE, NEW" },
            ] },
            { id: "all", label: "Every photograph", tiles: [
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
                label: "The cover image — the glass carries the BIOS beat",
                date: "COVER" },
            ] },
          ]),
          archiveEmpty:
            "No photograph of the portable is on the wall. One picture of " +
            "this machine is on the Record, with the entry that brought it in.",
          footer: "MGK-VIIIp · IMAGE ARCHIVE",
          papa: "[PAPA] — the caption wording, and whether any photograph earns " +
                "a face of its own.",
        },
      },
      {
        /* ═══ [N3 2026-08-06] "THE MANUAL" IS NOW "DOCUMENTATION" ════════════
           MIKE: "a viewer free to display any document. The manual appears
           inside it as a SELECTABLE ENTITY that opens on the screen when
           clicked. STRIKE EVERYTHING CURRENTLY ON THAT FACE EXCEPT WHAT WE ARE
           ACTUALLY HOLDING."

           WHAT WE ARE ACTUALLY HOLDING IS ONE DOCUMENT AND NO PAGES OF IT. So
           the shelf has one card on it, in the state the model calls `held`:
           title, provenance, and a note saying plainly that no page images are
           on file. IT IS NOT A BUTTON, and that is the template working rather
           than a limitation — a control that opens nothing is the dead control
           Doctrine 11's corollary removes. The day the photographs land they are
           a `plates` array on this card and the card becomes selectable; nothing
           else moves. M61 is untouched: the manual stays offline until real
           pages exist.

           WHAT WAS STRUCK, NAMED RATHER THAN ABSORBED — this is the largest
           deletion in the round and every item is recoverable from git:
             · THE BLURB. "Page images, not transcription: the typography is the
               evidence" is the museum explaining its own method, which is what
               Doctrine 11 tests for, and it survived because it is TRUE.
             · THE FORMAT AND NAV LINES (`MANUAL_FORMAT`, `MANUAL_NAV`). NAV
               described THE RENDERER — "microfiche reader — page-turn, fit and
               1:1 magnify" — which Doctrine 11 names explicitly as a failing
               subject. Both constants are deleted; they had no third caller.
             · THE EMPTY REEL and its note (`REEL_EMPTY_NOTE`). The document card
               says the same holdings fact in the template's own vocabulary, and
               two objects saying it is the thing Doctrine 16 strikes. **THE REEL
               RENDERER IS UNTOUCHED IN `Exhibit.jsx` and now has no caller** —
               kept for the same reason M61 kept the viewer built.
             · THE CONTENTS PAGE — six attested sections (§1–§4, APP. 1,
               MARGINS). Every one was real and each said "attested · no plate on
               file". They are the biggest single loss in this round and MARGINS
               carried one of Mike's own `[PAPA]` slots ("which hands, and what
               they wrote"), so that slot is now recorded nowhere on the glass.
               OPEN_ACTIONS N-g, with the git hash, because a marked slot that
               vanishes is exactly the thing his register exists to catch. */
        id: "manual",
        title: "Documentation",
        videos: [],
        tags: ["manual", "documentation", "plate", "1965", "scan", "opa"],
        face: {
          kind: "plate",
          title: "Documentation",
          subtitle: "MGK-VIIIp",
          docs: [
            { title: "The owner's manual",
              source: "ABEAL 8P-OMI-1",
              note: "Held. Incomplete, assembled out of copies caught at " +
                    "different stages. No page images on file — when they are " +
                    "made they are photographs of the printed sheet, edges and " +
                    "margins included.",
              /* [B8 2026-08-02] THE SCANS ARRIVE FROM MIKE, ordered, reading
                 order, one entry per page: { img, label, date }. The shape is
                 the plate wall's shape on purpose — one reader serves both. */
              plates: [] },
          ],
          footer: "MGK-VIIIp · DOCUMENTATION",
        },
      },
      /* ═══ [P2 2026-08-05] THE PORTAL LEFT THIS ALBUM ════════════════════
         MIKE: "THE PORTAL becomes ITS OWN ALBUM — it is very important and this
         keeps it top-shelf visible." It is the second album in the wing now,
         ahead of both machines.
         NOT ONE THING INSIDE IT CHANGED except its own name. The drum, its eight
         engraved channels, the two switches, the dial, the latch and every held
         reason are the block that stood here, moved whole rather than retyped.
         WHAT MOVING IT COSTS, STATED: the p in MGK-VIIIp means PORTAL, so this
         album is where the object's own name argued for it to live. */
      {
        /* [M2 2026-08-01] THE MACHINE'S OWN FAQ — kept distinct from the house
           FAQ on the front desk: that one answers questions about Weird.Baby,
           this one answers questions about the unit. Same shape, different desk.
           [R7/N10 2026-08-06] AND "SAME SHAPE" IS NOW TRUE OF THE BOOTH TOO. It
           is an accordion in the Information Booth's format, at the bottom of
           the menu, on Mike's ruling that the booth's is the established one and
           that a sub-exhibit must never send a visitor back to the lobby to find
           a question answered. */
        id: "mgk-faq",
        title: "FAQ",
        videos: [],
        tags: ["faq", "questions", "mgk"],
        /* [F1 2026-08-06] BUILT BY `faqFace()`. The bezel plate E3 chose for
           this face and the "MGK-VIIIp · FAQ" footer are both struck: the
           booth's shape has neither. E3's argument for the bezel — that two of
           these questions are about whether the machine is real, and the bezel
           is the piece a visitor actually meets — was a good one and it survives
           where the plate does, on this album's Image Archive under THE GLASS. */
        face: faqFace("MGK-VIIIp", [
          /* [H1 2026-08-06] THE SECOND AND THIRD SENTENCES ARE STRUCK, AND
             ONLY THEY. "Both units power on and run their own firmware" is a
             fact about the machines and stays — it is the same answer the
             mainframe's own FAQ gives, word for word. What went with the hold
             is the clause that told a visitor there is a Portal track to go
             and look at. */
          { title: "Does it still work?",
            line: "Yes. Both units power on and run their own firmware.",
            note: "" },
          /* [H1 2026-08-06] THE PORTAL QUESTION MOVED WITH THE PORTAL.
             It is answered word for word on the held album's own FAQ
             (src/data/artists/portal.js).
             [CS 2026-08-04] "Why does it say ERROR so often?" IS REMOVED, not
             rewritten — a question whose published answer is that the answer
             has not been written yet is a stand-in for a question. */
          { title: "Can I buy one?",
            line: FAQ_BUY_ONE,
            note: "" },
        ]),
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
