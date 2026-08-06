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
        face: {
          kind: "text",
          title: "FREQUENTLY ASKED",
          subtitle: "WEIRD.BABY ROBOTS",
          still: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png",
          stillCaption: "The units, as they came to us.",
          /* WELCOME'S LEAD, WITH THE FAQ'S OWN LAST TWO SENTENCES BEHIND IT.
             Not one clause is new: the first three are the orientation the
             landing needs, the last two are what this face has always said
             about its own answers. The FAQ's opening sentence — "the questions
             people actually turn up with" — went, because the heading and the
             rows say it. */
          blurb:
            "In 1965 somebody built a machine to say what happens next. Sixty " +
            "years later a delivery of them arrived on a dock with no sender's " +
            "name on it. This wing is everything we have worked out since — " +
            "and, more often, what we have not. Some of the answers below stop " +
            "short. Those are the interesting ones.",
          /* WELCOME'S CONTENTS REGISTER. It stopped being a business card at N4
             and became a list of what the wing HOLDS; that job did not go away
             when the face did. The TAGLINE row is not here — see above. */
          lines: [
            "UNITS    MGK-NIAC, the mainframe · MGK-VIIIp, the portable",
            "ON FILE  photographs, the record, the manual, the firmware",
            "TRADE    we buy strange things and find out what they are",
          ],
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
          entries: [
            { stamp: "START", title: "Where do I start?",
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
            { stamp: "Q",
              title: "[PAPA] What is Weird.Baby Robots?",
              line: "[PAPA] Mike will vibe this; the only seed is " +
                    "“Purveyors of the Weird.Baby”.",
              note: "" },
            /* [P3] HIS FIRST SENTENCE SHIPS; HIS SECOND IS A DESCRIBED SLOT.
               "Leave the slot, describe it, write nothing" — so the marker sits
               INSIDE the sentence that names what is missing, and the scrubber
               takes the whole clause. A visitor reads the hardware answer and
               stops. What goes in the slot is preserved for Mike and printed
               nowhere. */
            { stamp: "Q", title: "Is this stuff real?",
              line: "The hardware is — you can hold it at least, and it is " +
                    "heavier than you expect. [PAPA] Everything else — " +
                    "historical accounts, technical specifications, people " +
                    "involved — wants words that SOUND favourable and are not: " +
                    "the house's usefully-useless humour.",
              note: "" },
            { stamp: "Q", title: "Does it work?",
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
            { stamp: "Q", title: "Can I buy one?",
              line: "Monitor the website for availability. Follow us on social " +
                    "media — those platforms track you, this site does not, and " +
                    "following one out of here is leaving the building.",
              note: "" },
            { stamp: "Q", title: "Can I try one?",
              line: "We need to construct a dynamic virtual interface to the " +
                    "MGK System Portal before we can even consider it — but " +
                    "when we do, the answer is yes: available online, free to " +
                    "all to partake.",
              note: "" },
            { stamp: "Q", title: "How do I get in touch?",
              line: "papa@weird.baby",
              note: "" },
          ],
          /* WELCOME's footer, and the FAQ's own [PAPA] behind it. The scrub
             cuts by SENTENCE, so the marked one drops and the line prints. */
          footer: "“Restoration house” is not what we are. Weird.Baby is " +
                  "Weird.Baby. [PAPA] — the final wording throughout, and the " +
                  "answers should be shorter than these.",
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
   rather than merged here. */
const MANUAL_FORMAT = "FORMAT  photographs of the printed pages, not a rendering";
const MANUAL_NAV = "NAV     microfiche reader — page-turn, fit and 1:1 magnify";
const REEL_EMPTY_NOTE =
  "No pages on file. A plate here is a photograph of the printed " +
  "sheet, edges and margins included.";
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
    art: "/robots/art/wbr-cover-logo.png",
    accent: null,
    viewerPoster: "/WeirdBaby_PhotoID.png",
    viewerPosterCaption: "Weird.Baby — purveyors of the weird.",
    tracks: WBR_TRACKS,
  },
  /* ═══ [P2 2026-08-05] THE PORTAL IS ITS OWN ALBUM ══════════════════════════
     MIKE: "THE PORTAL becomes ITS OWN ALBUM — it is very important and this
     keeps it top-shelf visible."

     WHY SECOND AND NOT LAST. The deck lands on the front desk at index 0 and
     the carousel's ramp closes up as it goes (F4), so an album past the third
     position is a cover decking against the edge. Second is the only position
     that is both top-shelf and not the landing. The two machines keep their
     canon order behind it — the original mainframe, then the portable.

     THE ONE THING IN THIS WING THAT IS RUNNING, which is what the front desk
     has said about it since the FAQ absorbed WELCOME, and it was the fourth row
     of a five-row tracklist on one of two machines.

     THE COVER IS THE WING'S OWN TEMPLATE, third of four, and its badge is THE
     APERTURE ITSELF: the round glass on the front of the portable carrying the
     machine's own opening beat, cropped out of `art/viiip.png` — the composite
     this wing already shows as the ninth plate of the portable's Image Archive.
     A lit round door with the machine's words in it, sitting inside the cover's
     own ring. Built by `tools/make_unit_covers.py`, so it cannot drift from the
     other three.
     TWO BADGES WERE BUILT FOR THIS SLOT BEFORE IT AND BOTH WERE REJECTED, which
     is recorded because both read as obvious choices from a file listing. The
     front glass lit (`front_screen.png`) is the plate M2 says is MIRRORED —
     every word on the screen backwards, and at badge size the lettering is the
     only thing in the disc. The bezel is not a photograph of the object at all
     but a COMPOSITING ASSET with a knocked-out white rectangle where the screen
     goes, which is M7's own finding about it. The reasons live in that tool's
     header beside the line that skips them.
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: "portal",
    title: "The Portal",
    year: null,
    tags: ["portal", "twin", "firmware", "interactive", "mgk", "viiip"],
    art: "/robots/art/portal-cover.png",
    accent: null,
    viewerPoster: "/robots/art/viiip.png",
    viewerPosterCaption:
      "MGK-VIIIp — the glass carrying the machine's own opening beat.",
    tracks: [
      {
        id: "portal",
        title: "Feed Control",
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
          /* [P2] THE FACE STOPPED REPEATING THE ALBUM. The band above it
             now reads THE PORTAL, so a heading saying it again is the
             second object saying what the first already said. The
             instrument names itself and the machine it belongs to. */
          title: "FEED CONTROL",
          subtitle: "MGK-VIIIp",
          panel: {
            plate: "A-BEAL INSTRUMENT DIV. \u00b7 FEED CONTROL \u00b7 TYPE 8p",
            drum: {
              label: "FEED",
              sub: "SELECT \u00b7 ONE ARMED",
              /* positions are read in drum order, top to bottom. `arms:true`
                 is the only one that lights the drum and permits the latch.

                 \u2550\u2550\u2550 [R6 2026-08-05] THE FEEDS CARRY CHANNEL NUMBERS, AND THE
                 REASON IS NOT ON THIS PAGE. Mike's instruction: the Portal's
                 feed positions renumber \u2014 MGK-NIAC takes channels 1 and 2 and
                 MGK-VIIIp moves to 3 and 4 \u2014 and *the reason is the egg and it
                 must not be explained on the glass.*
                 SO NOTHING HERE EXPLAINS IT. Not the drum's legend, not its
                 sub, not a caption, not a note on the face. The engraving is a
                 number. A visitor who knows why 3 is where a machine like this
                 starts has been given something; a visitor who does not has
                 been given a numbered drum, which is what a numbered drum looks
                 like. Writing the reason down here would spend it in the same
                 commit that planted it. It is recorded once, in
                 `reveal/ledger.json`, which is where this house keeps things it
                 holds and does not show.
                 THE NIAC POSITIONS ARE NOT INVENTED FEEDS. Two channels are
                 engraved for the mainframe and each carries the machine's name
                 and nothing else \u2014 no state, no mode, no feed title, because
                 nobody has supplied one and a plausible one is Doctrine 12's
                 exact failure. Neither arms: the mainframe does not run on the
                 Portal, and the day it does is a ruling and a feed, not a
                 label. That NIAC comes first is the true development order and
                 it needed no argument to place.
                 THE VIIIp KEEPS ALL SIX OF ITS POSITIONS. M33 records that five
                 of them are engraved reveal levers; renumbering must not quietly
                 destroy five levers, so it does not. STANDARD \u2014 the one feed
                 that arms \u2014 is channel 3. */
              positions: [
                { id: "niac-1", ch: 1, label: "MGK-NIAC", arms: false,
                  why: "This feed is not available." },
                { id: "niac-2", ch: 2, label: "MGK-NIAC", arms: false,
                  why: "This feed is not available." },
                { id: "standard", ch: 3, label: "STANDARD", arms: true,
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
                { id: "idling-updated", ch: 4, label: "IDLING, UPD", arms: false,
                  why: "This feed is not available." },
                { id: "boot-playback", ch: 5, label: "BOOT PLAYBK", arms: false,
                  why: "This feed is not available." },
                { id: "off-first-boot", ch: 6, label: "OFF \u00b7 1ST BOOT", arms: false,
                  why: "This feed is not available." },
                { id: "last-state", ch: 7, label: "LAST STATE", arms: false,
                  why: "This feed is not available." },
                { id: "test-bench", ch: 8, label: "TEST BENCH", arms: false,
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
    ],
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
    art: "/robots/art/mgk-niac-cover.png",
    accent: null,
    /* [R4] THE POSTER WAS THE CHEST — torso, both shoulders, the top of two
       limbs. That is the robot, so it is gone from here. The poster is the
       meltdown: the whole interior of the cabinet flooded red, which is the one
       plate in the set that reads as A MACHINE DOING SOMETHING without showing
       an operator doing it. It is also the fourth tile of the archive below,
       named here rather than left unremarked, the way the VIIIp album names
       the family shot's double duty. */
    viewerPoster: "/robots/reference/mgk-viii/core_meltdown.jpg",
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
      {
        /* ==== THE IMAGE ARCHIVE, AND THE THING IT IS BUILT NOT TO SHOW =====
           [N1 2026-08-04] MIKE STRUCK "THE MORGUE". A3 deliberately printed
           both candidate names — title THE MORGUE, subtitle IMAGE ARCHIVE — so
           that the choice could be made by looking rather than by describing;
           it was made. IMAGE ARCHIVE is the title and the subtitle drops back
           to naming the unit, which is what every other subtitle in this wing
           does. Register row M6 closes.
           THE PLATES KEEP THEIR NAME, as A3 already ruled: a plate is the
           object, the archive is the room, and four other faces refer to
           plates by name.

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
        title: "Image Archive",
        videos: [],
        tags: ["plates", "photographs", "viii", "reference", "detail"],
        face: {
          kind: "text",
          title: "IMAGE ARCHIVE",
          subtitle: "MGK-NIAC",
          /* [N2] this wing calls its images plates; the wall itself is generic
             and defaults to "images". Read only for a stowed shelf's count. */
          archiveUnit: { one: "plate", many: "plates" },
          blurb:
            "Five plates of the mainframe: the machine entire, and four " +
            "details cut at the bars — the core, a lit column, the output row " +
            "at the base, and the whole interior in trouble.",
          tombstone: [
            { k: "Subject", v: "MGK-NIAC, on the bench" },
            { k: "State", v: "Built and powered" },
            { k: "Plates", v: "Five, cropped from four photographs" },
            { k: "Frame", v: "One plate carries the whole cabinet; four are cut at the bars" },
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
             and a print that leaves the shelf has to carry its own date.

             ═══ [R4 2026-08-05] AND THIS WALL IS NOW ONE UNHEADED SPREAD.
             Six of the eight plates were the ROBOT and every one of them is off
             the wall under Mike's canon — the mainframe is the subject and the
             figure stays out of frame. What went, by name: `head_oblique`,
             `chest_grille`, `limbs_lower`, `torso_unfinished`, `feet_plinth`,
             `slot_mockup`, plus `bench_power`, which is a bench shot with the
             robot's own feet standing in it. All seven are REAL PHOTOGRAPHS
             THIS MUSEUM OWNS and none is deleted from disk — the same call N1
             made on `parts_drawer.jpg` — but they are unreferenced now and
             that is a register row, not a silence.
             THREE PLATES CAME THE OTHER WAY, from the robots repo's own culled
             set at `robots/mgk-viii/plates/2021-03-19/`: the core, the output
             row and the meltdown. Mike culled that set himself in August 2026
             and their crops are governed by the same obfuscation law. Their
             labels below are the robots repo's own reading of what each frame
             shows, carried across rather than re-written here.
             THE FEBRUARY 2013 SPREAD IS GONE WITH ITS THREE PLATES, and it took
             the only stowed shelf in the museum with it — this was the one wall
             anywhere with more than one spread, so the mechanism N2 built is
             now exercised by nothing. That is C29 getting worse, and it is a
             register row rather than a thing absorbed here.
             THE HEAD GOES TOO. One spread with a shelf label is furniture, and
             every tile already carries the same date on its own print. */
          collage: [
            /* [P7 2026-08-05] THE FIRST PHOTOGRAPH OF THIS MACHINE WHOLE, and
               the wall leads with it. MIKE: "capture THE ENTIRE MAINFRAME (the
               heater) — the whole cabinet in frame, the robot still out of it."
               Cut from the same 2021 source the other four come from, at the
               cabinet's own bounding box. The robot is on the same bench and is
               not in this frame: the obfuscation law's subject was always the
               figure, and it is untouched. */
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
          ],
          footer: "Five plates · Weird.Baby Robots",
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
          /* [D3a 2026-08-06] AND THAT LAST LINE HAD STOPPED BEING TRUE, WHICH IS
             M53's OWN POINT ARRIVING ON A SECOND FACE. A later edit split the
             note into two sentences and put the marker in only the first, so
             the scrubber kept the second and the wall printed "The uncropped
             originals are all on file and any of them can be published from
             this file alone." — a maintainer talking to another maintainer,
             which is the exact register the comment above says was removed.
             Mike struck the WAL poster's twin of this today; the rule he was
             applying is the rule, so it is applied here in the same pass.
             ONE MARKED SENTENCE. A `papa` field is not a comment. */
          papa: "[PAPA] — the cabinet is shown whole now and the robot is " +
                "not, how much further that goes and when, and that the " +
                "uncropped originals are all on file and any of them can be " +
                "published from this file alone.",
        },
      },
      {
        /* ═══ [P1 2026-08-05] PARITY IS ABSOLUTE, AND THIS IS THE ROW THAT
           COSTS SOMETHING ═════════════════════════════════════════════════
           MIKE OVERRULES THE OPS RULING OF THE PREVIOUS ROUND, and the reversal
           is recorded plainly rather than absorbed. P1 (the parity ruling,
           2026-08-05) held that a HOLDINGS GAP RESOLVES a divergence — "NIAC's
           menu shows what NIAC has", and forcing parity would print a manual
           face with no manual behind it. THAT IS REVERSED. The two machines
           carry THE SAME MENU ITEMS, no more and no less; a divergence is now a
           FAILURE and the holdings-gap justification no longer resolves one.

           HIS REASON IS ALSO THE EXCEPTION'S REASON. NIAC will run on the
           Portal on channels 1 and 2, and it will have a manual. These rows are
           not doors onto rooms nobody intends to build — they are the shelf the
           material lands on. So THE STUB LAW IS OVERRIDDEN HERE AND ONLY HERE,
           for the mainframe's Manual and FAQ rows, and the reason is his: A ROW
           IS A PROMISE ONLY WHEN NOTHING IS COMING, AND THESE ARE COMING.

           WHAT THE EXCEPTION DOES NOT LICENSE, because an exception with no
           edge is a repeal. DOCTRINE 12 STILL BINDS EVERY WORD BELOW. The row
           says what is NOT held. It states no date, no section list, no page
           count, no schedule and no promise, because none of those was supplied
           and a plausible one is the failure Doctrine 12 exists for. "Say
           plainly what is not there yet" is the whole permission. */
        id: "manual",
        title: "The Manual",
        videos: [],
        tags: ["manual", "niac", "mainframe", "opa"],
        face: {
          kind: "plate",
          title: "THE OWNER'S MANUAL",
          subtitle: "MGK-NIAC",
          blurb:
            "No manual for the mainframe is held here. The portable arrived " +
            "with one — ABEAL 8P-OMI-1, incomplete, assembled out of copies " +
            "caught at different stages — and nothing of the kind has reached " +
            "this museum for the cabinet.",
          lines: [
            MANUAL_FORMAT,
            MANUAL_NAV,
            "PLATES  none on file",
          ],
          /* THE READER IS THE SAME READER. `reel` is the microfiche transport
             the portable's manual face already declares; an empty reel prints
             its note and nothing else, which is exactly what this row is for.
             THE FACE CARRIES NO `entries`, and that is the difference between
             this row and the portable's: that one has a contents page because
             its sections are attested. This one has none, and inventing six
             section headings to fill the shape would be the thing the exception
             above explicitly does not permit. */
          reel: {
            label: "MICROFICHE · READER",
            plates: [],
            note: REEL_EMPTY_NOTE,
          },
          footer: "MGK-NIAC · THE OWNER'S MANUAL",
        },
      },
      {
        /* [N1 2026-08-04] "THE FIRMWARE" IS NOW "TECHNICAL SPECIFICATIONS".
           MIKE: "Robots wing: The Firmware becomes TECHNICAL SPECIFICATIONS."
           TWO FACES CARRIED THAT NAME, not one — this one on MGK-VIII and the
           artifact-slot face on MGK-VIIIp — so both are renamed. Leaving either
           would keep the retired name on the glass, which is the one outcome
           the instruction cannot have meant. The SUBTITLES are what tell them
           apart and they are untouched: this face is WHAT THE MACHINE IS
           RUNNING (a board, an envelope, four output chains, a brightness cap),
           the other is THE MACHINE'S OWN MIND, ON FILE (two source trees, named
           as they sit). If he meant only one of the two, it is one string back.
           THE ARTIFACT KEEPS ITS NAME. Only the FACE was renamed — the firmware
           is still called the firmware in every sentence that talks about it,
           the same way A3's plates survived the archive being renamed around
           them. A later sweep should not read this as licence to hunt the word. */
        id: "firmware",
        title: "Technical Specifications",
        videos: [],
        tags: ["firmware", "source", "ino", "bench", "led", "artifact", "specifications"],
        face: {
          kind: "text",
          title: "TECHNICAL SPECIFICATIONS",
          subtitle: "WHAT THE MACHINE IS RUNNING",
          /* [R4 2026-08-05] THE OUTPUT ROW, AND IT REPLACES A BREADBOARD.
             The still was `matrix_lit.jpg` — a green LED matrix lit on a
             breadboard, February 2013 — chosen because it was the one picture
             in the set of SOFTWARE DOING SOMETHING. It is not the mainframe. It
             does not leak the robot either, so it broke no rule until Mike's
             canon made this album's imagery the CABINET, at which point a
             breadboard on a bench is neither the machine nor the egg.
             The bar bank at the cabinet's base is both: it is the mainframe's
             own output device and it is caught mid-pattern, which is software
             running on the object this face is about. It is also literally the
             subject of the 1 × 64 entry three rows down, which the breadboard
             never was.
             THE DATE CAVEAT SURVIVES THE SWAP AND IS STILL STATED IN THE
             CAPTION: this frame is March 2021 and the flagship firmware below
             is February 2026, so the caption dates the photograph rather than
             letting the proximity imply it is the same code.
             `matrix_lit.jpg` is now referenced by nothing — a real photograph,
             kept on disk, added to the orphan register. */
          still: "/robots/reference/mgk-viii/output_row.jpg",
          stillCaption: "The output row, mid-pattern — March 2021.",
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
          footer: "MGK-NIAC · TECHNICAL SPECIFICATIONS",
        },
      },
      {
        /* ═══ [P1 2026-08-05] THE MAINFRAME'S OWN FAQ ══════════════════════
           The second of the two rows parity requires, and unlike the Manual it
           did NOT need the stub-law exception in the end: every answer below
           was already asserted in this file about these machines, so nothing
           here is written to fill a shape.
             · "Does it still work?" is the portable FAQ's own answer, which
               says BOTH units power on and run their own firmware — a claim
               about the pair, printed until now on only one of them.
             · "Is the mainframe on the Portal?" is read off the feed drum,
               where two channels are engraved for this machine and neither
               arms. A visitor can check it in the next album.
             · "Can I buy one?" is the portable FAQ's answer verbatim; it was
               written about the machines, plural, from the day it shipped.
           THE STILL IS `column_lit.jpg`, WHICH THE NAME'S DELETION FREED. It
           was that face's plate and would otherwise have become the wing's
           fourth orphaned photograph this round; it is still a tile on the wall
           above, the same double duty the bezel does on the portable. */
        id: "niac-faq",
        title: "FAQ",
        videos: [],
        tags: ["faq", "questions", "niac", "mainframe"],
        face: {
          kind: "text",
          title: "FAQ",
          subtitle: "ABOUT THIS MACHINE",
          still: "/robots/reference/mgk-viii/column_lit.jpg",
          stillCaption: "A lit column behind the cage bars.",
          blurb:
            "The questions that get asked about the cabinet, answered as " +
            "plainly as the answers are known — and marked where they are not.",
          entries: [
            { stamp: "Q", title: "Does it still work?",
              line: "Yes. Both units power on and run their own firmware.",
              note: "" },
            { stamp: "Q", title: "Is the mainframe on the Portal?",
              line: "Not yet. Two channels are engraved for it on the feed " +
                    "drum and neither of them arms.",
              note: "" },
            { stamp: "Q", title: "Can I buy one?",
              line: FAQ_BUY_ONE,
              note: "" },
          ],
          entriesMode: "list",
          footer: "MGK-NIAC · FAQ",
        },
      },
      /* [N1 2026-08-04] "THE PARTS" IS REMOVED. Mike's instruction, and it is a
         removal rather than a rewrite: the whole track and its face are gone,
         so MGK-VIII now runs MGK-NIAC · Image Archive · Technical
         Specifications.
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
         would be adding a plate nobody asked for to a wall whose tombstone
         counts them. It is a register row for Mike. */
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
    art: "/robots/art/mgk-viiip-cover.png",
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
        title: "Image Archive",
        videos: [],
        tags: ["plates", "photographs", "viiip", "reference"],
        face: {
          kind: "text",
          title: "IMAGE ARCHIVE",
          subtitle: "MGK-VIIIp",
          archiveUnit: { one: "plate", many: "plates" },
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
          /* ═══ [P2 2026-08-05] MIKE'S RULING: TEXT NOT SUPPLIED DIES ═══════
             M45 asked whether the plate's own printed words survived a visitor
             reading them — STRUCTURE ISSUE · STRUCTURE AND ARRANGEMENT ONLY ·
             TEXT NOT SUPPLIED. THE ANSWER IS NO, and his reason is sharper than
             the question was: IT WAS THE MUSEUM ADMITTING IT HAD NOT WRITTEN THE
             MANUAL, WEARING A FICTION AS COVER — Doctrine 11 hiding inside a
             picture, where no string sweep can ever reach it.

             THE RULE HE GAVE WITH IT, and it is wider than this face: EITHER THE
             PLATE SHOWS A PAGE ACTUALLY WRITTEN, OR THERE IS NO PLATE UNTIL ONE
             EXISTS. Not a better caption. The caption was already doing the one
             piece of work the swap needed, and that is the tell — a caption that
             has to argue a picture out of its own lettering is a caption losing
             an argument with a photograph. EMPTY BEATS A PLACEHOLDER IN
             FICTION'S CLOTHING, which is Doctrine 11's corollary with its harder
             half named.

             SO THIS FACE HAS NO PICTURE. It is the second face in this wing left
             without one deliberately; M29 was the first, and it closed by
             INHERITING a real photograph rather than by inventing an object,
             which is the order of preference here too.
             WHAT COMES BACK WHEN A PAGE IS WRITTEN: `still` and `stillCaption`,
             pointed at a photograph of a printed page that says something.
             WHAT DOES NOT MOVE: `reel.plates` is still [] and still waits on
             B8's ruling — photographs of the printed manual, never renderings.
             The head plate was never a frame in the reader, so striking it does
             not touch the one promise this face actually makes.
             HISTORY, SO NOBODY RE-DERIVES IT: E3 put a render here arguing that
             the page's own PRELIMINARY — WORKING COPY stamp defended it; G1
             swapped that render for page 1 of the live structure issue when the
             first document was retired out from under it; P2 rules the defence
             was never available, because the second page's words were not about
             the object at all. M4 closes with it — there is no plate left to be
             a render. */
          blurb:
            "The unit shipped with a manual, and the manual is where the " +
            "machine explains itself — including the parts it gets wrong. " +
            "Page images, not transcription: the typography is the evidence.",
          lines: [
            MANUAL_FORMAT,
            MANUAL_NAV,
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
            note: REEL_EMPTY_NOTE,
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
        /* [N1 2026-08-04] renamed with its twin on MGK-VIII — see the note on
           that face for why both moved and what the subtitles are doing. */
        id: "firmware",
        title: "Technical Specifications",
        videos: [],
        tags: ["firmware", "artifact", "source", "1965", "ino", "specifications"],
        face: {
          kind: "text",
          title: "TECHNICAL SPECIFICATIONS",
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
          footer: "MGK-VIIIp \u00b7 TECHNICAL SPECIFICATIONS",
        },
      },
      /* ═══ [P2 2026-08-05] THE PORTAL LEFT THIS ALBUM ════════════════════
         MIKE: "THE PORTAL becomes ITS OWN ALBUM — it is very important and this
         keeps it top-shelf visible." It is the second album in the wing now,
         ahead of both machines; see the block above the spine's `portal` entry.
         NOT ONE THING INSIDE IT CHANGED except its own name. The drum, its eight
         engraved channels, the two switches, the dial, the latch and every held
         reason are the block that stood here, moved whole rather than retyped.
         WHAT MOVING IT COSTS, STATED: the p in MGK-VIIIp means PORTAL, so this
         album is where the object's own name argued for it to live. It is a
         property of the portable that now sits outside the portable's covers,
         and a visitor reading MGK-VIIIp top to bottom no longer meets it. That
         is Mike's call and the visibility is what he bought with it. */
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
              line: FAQ_BUY_ONE,
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
