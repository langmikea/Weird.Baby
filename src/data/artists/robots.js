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
/* [V1 2026-08-06] EVERY GOVERNED PICTURE IN THIS FILE GOES THROUGH `placed()`.
   The addresses below are the PUBLIC ones — the address each picture will have
   the day the Record delivers it — and the resolver computes the stage door's
   prefix when the museum is still being built. Read src/lib/placement.js before
   changing a path here, and reveal/stage.mjs for what the two stages are. */
/* [2026-08-17] `placedPresets` and `placedTiles` LEFT WITH THE MACHINES. They
   were imported here for the two units' preset grids and plate walls, and both
   moved to `robots-units.js` with the albums that used them. `placed()` stays —
   the front desk's own cover still goes through it. */
import { placed } from "../../lib/placement.js";
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

/* [M1 2026-08-11] THE EPOCH AND ITS ARITHMETIC MOVED TO `record-epoch.js`,
   and the six Record entries to `robots-record.js`. Both are pure moves; the
   reasoning that stood here went with the code it explains. `recordEpoch`
   below still reads the same constant — from its own module now, so the
   entries can read it too without importing this file back. */
import { RECORD_EPOCH } from "./record-epoch.js";
import { RECORD_ENTRIES } from "./robots-record.js";
import { recordEntriesForToday } from "../../lib/record-clock.js";

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
          /* [D1 2026-08-08] DAY ONE. It is `RECORD_EPOCH` and not a second
             literal, because Mike's own condition on the date was that if the
             launch slips, ONE FIELD MOVES AND EVERYTHING FOLLOWS. Two literals
             saying the same day is two fields, and the one that gets forgotten
             is whichever a slip does not make obviously wrong — an entry with
             yesterday's date reads wrong immediately; a week number that is one
             out reads fine forever. See the constant's own note at the head of
             this file. */
          recordEpoch: RECORD_EPOCH,
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
          /* ═══ [CH5 2026-08-12] THE RECORD DOES NOT SHOW THE FUTURE ═════════
             MIKE, from the start: Record n goes out on Day n. Nothing enforced
             it, and at midnight Sunday a visitor saw 001–005 — including two
             days that had not happened.
             THE DATE IS THE WORKER'S, NOT THE BROWSER'S. `src/worker.js`
             injects `__WB_TODAY__` on every HTML response; `record-clock.js`
             reads it before this module's first line runs, so there is no
             round trip and no loading state. In DEVELOPMENT, and for Mike's
             admin code, every entry is shown.
             READ `src/lib/record-clock.js` BEFORE TRUSTING THIS: the entries
             are still compiled into the bundle, so this governs what the page
             DRAWS and is not concealment. Open row `CH5-a`. */
          entries: recordEntriesForToday(RECORD_ENTRIES),
          /* [CH5 2026-08-12] AND AN EMPTY RECORD SAYS SO. Measured on the
             launch build rather than predicted: with today five days before
             `RECORD_EPOCH`, the index drew ZERO rows and the face was a heading
             over blank paper — no message, because this face was the one shelf
             in the museum that never declared an empty state.
             IT IS THE SAME MECHANISM THE OTHER THREE USE (`archiveEmpty`,
             `docsEmpty`, `logEmpty` — Exhibit.jsx renders this when `entries`
             is empty), and the same reasoning H2 wrote for the walls: a shelf
             that vanishes when it empties tells a visitor the room has one
             fewer thing in it, rather than that this thing is waiting.
             IT NAMES NO DATE. "The Record opens on the 17th" would be a promise
             about the future on the one surface whose whole point is that it
             only ever shows what has already happened. */
          logEmpty: "Nothing has been entered in the Record yet.",
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
        /* [2026-08-26] THE FAQ SUBTITLE TAKES THE FULL FORM IN THE HOUSE'S OWN
           CAPS. MIKE: **"The board, the door and the FAQ subtitle agree."**
           `faq-face.js` already declares this parameter as *"the wing, in the
           house's own caps"*, so the full form is what belongs here and the
           short form belongs in the bar. Was `WEIRD.BABY ROBOTS`. */
        face: faqFace("WEIRD.BABY \\ROBOTS", [
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
            /* [F5 2026-08-11] THE HELD "What is Weird.Baby Robots?" SLOT IS
               DELETED. Mike: kill. It was a question with both fields marked
               [PAPA] so it rendered nothing to a visitor and carried his seed
               ("Purveyors of the Weird.Baby") in the data as a note to himself.
               The slot, the seed and the note all go; the backlog entry it was
               standing in for is his to keep elsewhere if he still wants it. */
            /* [F5 2026-08-11] THE [PAPA] SECOND CLAUSE IS DELETED. Mike: kill.
               It described a slot rather than filling one — "historical
               accounts, technical specifications, people involved" wanting
               "the house's usefully-useless humour" — and never reached a
               visitor. His first sentence is untouched and is now the whole
               answer. */
            /* [2026-08-17] HIS REWRITE, VERBATIM. What it replaces, named once
               (Doctrine 24): "The hardware is — you can hold it at least, and
               it is heavier than you expect."
               IT IS TWO LINES NOW AND THE NEWLINE IS TYPED. He wrote it on two
               lines and the booth standard is that a line break is something
               the writer typed — the same reading `AFFILIATION` runs on, and
               the same one renderer (`.vp-faq-a p`) draws. */
            { title: "Is this stuff real?",
              line: "The hardware is; I mean you can hold it at least." +
                    "\n" +
                    "And it's heavier than you might expect.",
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
            /* [F2 2026-08-11] THE TRACKING CLAUSE IS DELETED, no replacement.
               Mike's ruling. What went: "those platforms track you, this site
               does not, and following one out of here is leaving the building."
               The answer keeps both of its instructions and says nothing about
               what the platforms do. */
            { title: "Can I buy one?",
              line: "Monitor the website for availability. Follow us on social " +
                    "media.",
              note: "" },
            /* [F3 2026-08-11] MIKE'S OWN ANSWER, REPLACING THE PORTAL ONE.
               His words exactly. It uses `lines` rather than `line` because
               `FaqEntries` already prints an array as separate paragraphs —
               which is what a two-beat answer needs, and it costs no new CSS
               and no newline handling.
               ON "THREE LINES AS WRITTEN": his packet wraps at ~62 characters
               throughout, and his second line is 55 — so the break before
               "right now." is his editor's wrap and not a third beat. Set as
               two paragraphs. If he meant a hard break mid-sentence, this is
               the one line to change and it is one array element. */
            { title: "Can I try one?",
              lines: ["Yes.",
                      "Well, not now, but soon. Hopefully. That's all I can " +
                      "say right now."],
              note: "" },
            /* [D 2026-08-11] "How do I get in touch?" IS DELETED. Its answer
               was `CONTACT`, whose only payload was the address Mike has now
               struck sitewide, and a question with no answer left is not a
               row. The wing publishes no contact route now — named here so
               the absence reads as a ruling rather than an omission. */
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
   `FAQ_BUY_ONE` STANDS and is still typed once for both machines --
   [2026-08-17] IN `robots-units.js` NOW. It left this file with the two albums
   that were its only readers; nothing else in the wing said it. */

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
     [2026-08-26] THAT LAST SENTENCE IS FALSE AND WAS THE DANGEROUS KIND OF
     FALSE — IT READ AS PERMISSION TO RUN THE GENERATOR. The file at this path
     has been MIKE'S OWN HAND-DRAWN ART since 2026-08-09, when `27a9200`
     installed his `NEW Robots.png`; a re-render would not "not drift", it
     would DESTROY it. Measured: the generator's rule falls at rows 992–995
     and the shipped file's at 1061–1064, with 303,783 pixels differing by
     more than 16 of 255. `provenance/assets.json` has said `MIKEY_ART …
     Not generated` since 2026-08-10 and was the surface that was right;
     this comment and `provenance/asset-table.json` were the two that were
     wrong. The paragraph above is kept because it is the record of how the
     PLACEHOLDER was built and of Mike's S10 ruling, which is still the
     reason this row exists — what is retired is its claim about the file.
     `tools/cover_fences.py` now refuses the path from every generator.
     THE TRACKS ARE SHARED BY REFERENCE, not copied. Two covers, one album's
     worth of content; a second copy of six faces would be two things to keep
     in step and one of them would eventually be wrong. */
  {
    id: "wbr-logo",
    /* [2026-08-26] THE WING'S OWN SLEEVE TAKES THE FULL FORM. Was
       `Weird.Baby Robots`. This is the string that travels through the bar's
       centre (`Exhibit.css` E, 2026-08-11) and is drawn mixed-case rather than
       uppercased, because `[data-exhibit="robots"]` scopes `text-transform:none`
       so this wing's data says its own casing — which is now the backslash's
       casing too.
       **ITS COVER ART STILL SAYS `ROBOTS`.** `/robots/art/wbr-cover-logo.png`
       has `ROBOTS - PURVEYORS OF THE WEIRD` in the pixels. The nine
       name-bearing PNGs are OUT OF SCOPE this round on Mike's word; the album
       title and its sleeve disagree until they are redrawn, and that is stated
       rather than discovered.
       [2026-08-26] THE SOURCE NAMED HERE WAS WRONG AND IS CORRECTED: this
       sentence read *"from `tools/make_robots_cover.py:72`"*, and that
       generator has not written this file since 2026-08-09. **The lettering is
       Mike's own, drawn by hand**, which changes what a redraw of it would
       cost — not a re-run with a new string, but his art done again. The
       pixels themselves are as stated and were re-read this round.
       AND `PURVEYORS OF THE WEIRD` IS NOT A WING NAME. It is the house's own
       strapline, ruled to belong *"ONLY on the first album, where it literally
       applies"* — so of the two lines in this sleeve only `ROBOTS` is in the
       backslash question at all, which makes it the weakest of the nine. */
    title: "Weird.Baby \\Robots",
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
];

/* === [2026-08-17] BOTH MACHINES LEFT THIS FILE, AND THAT IS THE HOLD ======
   MIKE: **"TAKE MGK-NIAC AND MGK-VIIIp DOWN. Urgent."** -- on the live site,
   the night Record 001 opened the wing and both units came through the door
   with it.

   HIS ROOT CAUSE: **"neither unit was ever held on its own condition. They were
   invisible only because the wing was hidden. A hold that depends on another
   thing's hold is not a hold."**

   THE FIRST CUT WAS A FILTER HERE and the ledger refused it -- the whole
   argument, and the nine faults it printed, are at the head of
   `robots-units.js`. What that file's existence means for this one: the public
   spine is ONE album, `wbr-logo`, and the machines' material is not in any
   chunk the public fetches. NOT `HIDDEN_AT_LAUNCH`, which is the STAGE hold and
   would have opened the moment the stage moved -- which is the failure being
   fixed rather than a shape to copy.

   THE PORTAL IS UNTOUCHED and still lands second: `Robots.jsx` splices it at
   `PORTAL_AT` (1) and the splice clamps to the spine's length. === */

export const robotsExhibit = {
  id: "robots",
  /* ═══ [2026-08-26] THE DOOR CARRIES THE SHORT FORM — MIKE'S RULING ════════
     **"THE TITLE BARS CARRY IT TOO. \ROBOTS, \MUSIC, \FOUNDATION, and the
     rest."** `<MuseumBar>` prints this field as the page's `<h1>` and
     `.wb-bar-room` uppercases it, so a visitor reads `\ROBOTS`.

     WHAT THIS REPLACES AND WHY IT WAS WRONG BEFORE THE RULING TOUCHED IT.
     `name: "Robots"` was the route segment with the slash taken off, and it was
     the last of the two strings M8 diagnosed in 2026-08-03 and only half-fixed:
     *"'Robots' and 'Weird.Baby' were ROUTE names wearing a directory's
     clothes."* M8 changed the BOARD and left both retired words in the title
     bars, where they have stood for twenty-three days. `weird-baby.js` carried
     the other one; it moves in the same commit.

     THE `id` DOES NOT MOVE. OPERATIONS §0 — *NO ID MOVES WHEN A LEGEND IS
     RECUT* — which has fired four times, most recently on eight ledger rows
     that took `reveal/transfers.mjs` down with them. `id`, `exhibitSlug`,
     `visitPath`, `splitKey`, `cfKey` and `shopExitParam` are all untouched, and
     `/robots` is still the address. AN ADDRESS DOES NOT CHANGE AND A NAME DOES;
     that distinction is the reason this edit is one field. */
  name: "\\Robots",
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
