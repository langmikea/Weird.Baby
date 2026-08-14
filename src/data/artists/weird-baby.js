// src/data/artists/weird-baby.js
/* [CH5] `launched()` — the stage, from the one file in `src/` that knows it */
import { launched } from "../../lib/placement.js";
/* [M 2026-08-14] the house's FAQ factory and the house's own standing answer to
   who runs the place — see the FAQ track below for why this wing reads KEEPER
   and why W1's objection to it does not reach an FAQ. */
import { faqFace } from "../faq-face.js";
import { KEEPER } from "../house-copy.js";
// Hand-authored spine + config for the Weird.Baby house exhibit (/wb).
// Mirrors hunterRoot minus MediaVault: no foundation export — the six Vol 1
// recordings are repo-local assets (public/audio/wb/). MV ingestion of Vol 1
// is deferred (post-vocab-migration) per WB_ARTIST_LOBBY_BOOTH-20260706.
//
// Display order is PRESENTATION order (Mike 2026-07-06: lead with Coconuts,
// then E.D. Yahdah, then registration order). The vol1 repo's slot numbers
// (in the mp3 filenames) are registration canon and unchanged.
//
// Contract consumed by Exhibit.jsx (see hunter-root-spine.js header):
//   album = { id, title, year, art, accent, tracks: [ track ] }
//   track = { id, title, videos: [ video ] }
//   video = { id, ytId, audioUrl, label, type }
//
// Video ids follow the builder's rendition-id rule (id = ytId ?? slug(audioUrl))
// so preset capture/restore stays stable if this spine later comes from MV.
//
// exhibitFlow is OMITTED on purpose: Exhibit.jsx renders the artifact deck
// only when present ({ExhibitFlow && ...}, Exhibit.jsx:1065 — verified
// 2026-07-06). The WB exhibit is player-only for v0; holes are by design.

/* [W1 2026-08-06] THE KEEPER'S ANSWER LEAVES THIS ROOM AND THE IMPORT GOES WITH
   IT. D1 hoisted it into src/data/house-copy.js so the booth and this card could
   not drift apart; W1 takes it off this card altogether, because it is an answer
   about the HOUSE printed under an ARTIST's name. The hoist was not wasted — it
   is why removing it here is one deleted line rather than a decision about which
   of two copies was the real one — and `KEEPER` still stands in house-copy.js
   with /booth reading it. */

/* [B 2026-08-13] MIKE: "Track chip `RECORDING — 2026-06` -> `first pass`,
   matching the approved blurb." The chip and the record's own description now
   say the same thing in the same words — the blurb on `About this record`
   opens "The first pass." — where before the chip said WHEN the file was made
   and the blurb said WHAT it is, which is two facts and one of them is on the
   sleeve already. `.tl-rend` uppercases, so the row reads FIRST PASS. */
const REC_LABEL = "first pass";

/* ═══ [P9 2026-08-05] ABOUT THE ARTIST, FIRST IN THE WING ════════════════════
   MIKE: "WEIRD.BABY MUSIC: add an ABOUT THE ARTIST album, FIRST in the wing.
   'About the Songs' is wanted someday, not today — ledger it."

   WHAT IS ON IT IS EVERYTHING THIS MUSEUM ALREADY PUBLISHES ABOUT THIS ARTIST
   AND NOT ONE CLAUSE MORE. That is a short list, and the list being short is the
   finding rather than a shortcoming: the keeper's line is the Information
   Booth's own answer, verbatim; the holdings are counted off the album below it;
   and the biography is a [PAPA] slot, marked in both its title and its answer so
   the entry renders NOTHING rather than printing a question with a silence under
   it. Doctrine 12 forbids the obvious alternative — a paragraph about a musician
   nobody has described to Ops would read true and be invented.

   THE ROOM DOES NOT HOLD A PORTRAIT, and the register says so on the glass. That
   is a holdings fact and it ships; "nobody has photographed him yet" is a
   production fact and does not. The album cover is the house's own mark, which
   is the one image of this artist the museum genuinely has.

   "ABOUT THE SONGS" IS LEDGERED AND NOT BUILT — his instruction, in his words,
   and the row is in docs/OPEN_ACTIONS.md. It is not scaffolded here: an empty
   container at a live address is what the NO-COMING-SOON credo kills, and the
   renderer is generic already, so building it on the day there is something to
   put in it costs a data block and no code. */
/* ═══ [CH5 2026-08-12] ABOUT THE ARTIST IS HIDDEN AT LAUNCH ═════════════════
   MIKE RULED IT HIDDEN and nothing hid it. Same mechanism as the Foundation's
   Ledger and Contribute — `launched()`, the museum's one stage switch — so
   there is one concept here and not a second.

   IT IS THE ALBUM AND NOT THE TRACK, because the `about` album holds exactly
   one track and hiding the track would leave a titled album with nothing in it
   — a door with an empty room behind it, which is worse than no door.

   THIS IS `/wb` — HIS OWN MUSIC — AND NOT `/wal`. Checked rather than assumed:
   this module is imported only by `src/routes/wb/WbSpine.jsx`. Worth A Listen's
   artist cards are built by `aboutArtistTrack()` in `worth-a-listen.js` with
   ids of the form `<artist>-about-artist`, they are a different mechanism in a
   different file, and NOTHING HERE TOUCHES THEM.

   Same limit as the others: hidden from the page, strings still in the chunk.
   Open row `CH5-b`. */
/* ═══ [B 2026-08-13] AND IT IS UN-HIDDEN, ON MIKE'S OWN LATER RULING ═════════
   HIS WORDS, THIS ROUND: **"This is a restructure. The page currently holds one
   album; it holds two… Carousel: two covers now, so `<` `>` go live."** The
   page "currently holds one album" is the LAUNCH view — CH5 above is the
   mechanism that made it so, twelve days ago and also his — so the ruling that
   the wing shows two covers is the ruling that this hold comes off.

   IT IS QUOTED WITH ITS DATE BECAUSE IT WAS HIS. CH5 (2026-08-12) reads "MIKE
   RULED IT HIDDEN and nothing hid it", and the reason it gives is that the
   album held exactly one track — "a door with an empty room behind it". That
   reason no longer holds: the album has a second track this round and a third
   named for it, which is what changed rather than anybody's mind.

   THE SET IS EMPTIED, NOT DELETED. `launched()` and the filter below stay
   exactly as CH5 built them, so re-holding an album on this wing is one id in
   these brackets and no code. `CH5-b` (strings still in the chunk) closes with
   the hold that raised it. */
const HIDDEN_AT_LAUNCH = new Set([]);

const spine = [
  {
    id: "about",
    title: "About the Artist",
    year: null,
    /* [A3 2026-08-06] THE HOUSE SLEEVE, NOT THE BARE MARK. Mike ruled the robots
       gray album art the standard for everything carrying Weird.Baby's own art
       and named this wing. This album was showing the MARK ITSELF as its cover —
       the only album in the museum with no sleeve at all — so it now carries one
       built by `tools/make_house_covers.py` on that template: same square, same
       paper, same border, same Georgia setting, same rule, same strapline. */
    /* [B 2026-08-13] MIKE ASKED FOR "gray WB album art from the Robots repo —
       copy it here and bank it. Never write the Robots repo." IT IS ALREADY
       HERE AND ALREADY BANKED — this file, built on the robots template by
       `tools/make_house_covers.py` at A3 (2026-08-06) and committed to
       `public/images/wb/`. Checked rather than assumed before doing it twice:
       the robots repository holds no album art at all — no cover PNG, no album
       directory, no logo file — so this sleeve is the only gray WB album art
       in either tree, and copying would have meant copying it over itself. */
    art: "/images/wb/about-cover.png",
    accent: null,
    tracks: [
      {
        id: "about-artist",
        /* [C1 2026-08-06] sentence case, with every other category row in the
           museum — see the note at /wal's `upToTrack`. The FACE title (all
           caps) and the album's own name are untouched. */
        /* [B 2026-08-13] "Its tracks are the sections: About, FAQ." The row is
           `About` now — the album's own name already says whose. */
        /* [M 2026-08-14] AND IT IS `About the Artist`, WHICH IS HIS CORRECTION
           OF YESTERDAY'S READING: "About the Artist: track 1 -> `About the
           Artist`, track 2 -> `FAQ`." The album's name and its first row now
           say the same thing, which is the shape /wal's own template has —
           "About the Artists" is the first row of the WORTH A LISTEN album. */
        title: "About the Artist",
        videos: [],
        /* ═══ [W1 2026-08-06] BURNED DOWN AND REBUILT AS CATEGORIES ══════════
           MIKE: "ABOUT THE ARTIST - the current viewer content is useless. BURN
           IT DOWN. Rebuild as SMALL, CONSISTENT, FLEXIBLE CATEGORIES that can be
           filled for ANY artist - interesting, user-engaging, aesthetically
           present. A FEW RICH ITEMS BEAT LISTS AND RECORD FILES THAT DO NOT
           BELONG HERE. Build the categories; fill only what is true, [PAPA] the
           rest."

           WHAT WAS HERE AND WHY IT WAS USELESS, ITEM BY ITEM, because three of
           the four were put here deliberately and two of them are good writing.
             · The RELEASE / TRACKS / PORTRAIT register is the "record file that
               does not belong here" in his sentence, exactly: three lines of
               accession data set as a monospace block, telling a visitor the
               number of tracks on an album whose tracks are listed six inches to
               the left.
             · "Who keeps this place?" is the booth's answer and it is one of the
               best passages in the building — and it is about the HOUSE, on a
               card headed with an ARTIST's name. It is not deleted from the
               museum; it is at /booth, which is its room, and D1 left it one
               import away if it is ever wanted back.
             · "What the museum holds" survives, as a category, because it is the
               one thing on the old card that was about this artist and true.
             · The blurb survives for the same reason.

           THE CATEGORIES ARE THE DELIVERABLE, NOT THIS PAGE'S CONTENT. Six slots
           that any artist in any wing can be described by, in the order a
           stranger meets somebody: where they are from, what they sound like,
           their own voice, where to start, what the museum has, and what they are
           doing now. Each is one RICH item and not a list — a sentence or two,
           set as a card — which is the "few rich items" half of the ruling given
           a shape.
           FIVE OF THE SIX ARE MARKED AND PRINT NOTHING, and that is the ruling
           working rather than the page failing. Doctrine 12 forbids the obvious
           alternative: nobody has told Ops where this artist is from or what he
           sounds like, and a plausible paragraph about a musician nobody has
           described is invention however well it fits. The slots are in the data
           where he can fill them one at a time. */
        /* ═══ [M 2026-08-14] THIS COPY IS A PLACEHOLDER AND IS TRACKED AS ONE ═
           MIKE: "Track 1 copy as supplied, placeholder — Mike replaces before
           launch, track it." The blurb and the register row below are Ops'
           sentences, written when nobody had described this artist; they are
           kept exactly as supplied and they are HIS to replace.
           IT CARRIES NO `[PAPA]` MARKER, DELIBERATELY. A marked paragraph is
           REMOVED from the page in both stages (`scrubFace`), and this copy has
           to keep drawing until he replaces it — a placeholder that erases the
           card is not a placeholder, it is a hole. The tracking is a row in
           `docs/OPEN_ACTIONS.md`, which is where a thing waiting on him lives.
           HIS SECOND SENTENCE FROM YESTERDAY IS THE BRIEF FOR THE REPLACEMENT
           and is repeated here so it is beside the words it governs: "Voice is
           Mike's own. Papa Weird.Baby is him, not a persona." */
        face: {
          kind: "text",
          title: "About the artist",
          subtitle: "WEIRD.BABY",
          blurb:
            "The house's own music. What this room holds of the artist is the " +
            "recordings; what it holds of the person is his name.",
          /* ═══ [2026-08-11] FIVE ROWS ARE DELETED WITH THE RED NOTES ══════
             Mike's ruling. "Where he is from", "What he sounds like", "In his
             own words", "Start with" and "What he is doing now" each held ONE
             `[PAPA]` sentence and no other text, so striking the notes emptied
             them entirely.
             NOTHING CHANGES ON THE GLASS AND THAT IS MEASURED RATHER THAN
             HOPED: `scrubFace` already filtered this list on
             `kept(label) && kept(body)`, so a row whose whole body was a marker
             has never drawn — in either stage. What is deleted is data nobody
             could see, which is what makes it a deletion rather than an edit to
             the room. The one row that could be filled from what this
             repository actually knows is the one that stays. */
          profile: [
            /* [B 2026-08-13] the release's name follows the album's — see the
               retitle below. "The Making of BoWB V1" was the last of four
               places that phrase appeared and it is gone from all four. */
            { label: "What the museum holds",
              body: "Six recordings, made in June 2026, and one release: The " +
                    "Best of Weird.Baby Vol. 1. They play in this room." },
          ],
          footer: "WEIRD.BABY · ABOUT THE ARTIST",
        },
      },
      /* ═══ [M 2026-08-14] THE FAQ ROW, FROM THE STANDARD TEMPLATE ════════════
         MIKE: "FAQ from the standard template, seeded with Who is Weird.Baby?
         and How to contact?"

         THE TEMPLATE IS `faqFace()` — the same factory /wal, /foundation,
         /robots and the booth all draw through, so this wing gains no shape of
         its own. That is what "the standard template" has meant since F1 made
         the format a mechanism rather than a convention.

         "WHO IS WEIRD.BABY?" IS ANSWERED WITH `KEEPER`, THE HOUSE'S OWN
         STANDING SENTENCE, and W1's objection to it does not reach here. W1
         (2026-08-06) struck KEEPER from the ARTIST CARD one row up, on the
         ground that it is "an answer about the HOUSE printed under an ARTIST's
         name". A question that ASKS who Weird.Baby is has that answer as its
         subject rather than as a stray; and Mike's own instruction yesterday —
         "Papa Weird.Baby is him, not a persona" — is the ruling that the house
         and the artist are one person here. Imported, never retyped
         (Doctrine 17): editing house-copy.js edits the booth and this together.

         "HOW TO CONTACT?" IS A `[PAPA]` AND THEREFORE DOES NOT DRAW, AND THE
         REASON IS A COLLISION WITH HIS OWN RULING WORTH NAMING. On 2026-08-11
         Mike struck the house address sitewide, with no replacement;
         `house-copy.js` records the consequence in its own words — "THE MUSEUM
         NOW PUBLISHES NO WAY TO REACH IT. That is the ruling's direct
         consequence and not a side effect." So the only honest answer to this
         question needs an address that a ruling of his removed and that this
         packet does not supply. `scrubFace` drops an entry that declared a body
         and kept none of it, so the question does not appear at all in either
         stage — empty and honest — and lands the moment he gives an address.
         Row in `docs/OPEN_ACTIONS.md`. */
      {
        id: "wb-faq",
        title: "FAQ",
        videos: [],
        face: faqFace("WEIRD.BABY", [
          { title: "Who is Weird.Baby?", lines: [KEEPER] },
          /* ONE SENTENCE, AND THAT IS LOAD-BEARING RATHER THAN STYLE.
             `visitorProse` splits a string into SENTENCES and drops only the
             ones carrying the mark — so a two-sentence note leaves its second
             sentence on the glass. Written as two, this printed "This answer
             needs an address from you before it can say anything." to visitors,
             caught by looking at the page rather than by any gate. */
          { title: "How to contact?",
            lines: ["[PAPA] the house address was struck sitewide on 2026-08-11 "
                  + "by your own ruling with no replacement, so this answer "
                  + "needs an address from you before it can say anything."] },
        ]),
      },
      /* ═══ [B 2026-08-13] `About this record`, MOVED HERE FROM Vol. 1 ════════
         MIKE: "`01 About this record` leaves this album entirely — it becomes a
         track on Album B." Carried across unchanged except for the release's
         name, which moved with the album. CH6's paragraph on `vol1` explains why
         this face exists and why the sentence is a face rather than a track
         chip; that reasoning is unchanged by which album it sits on.
         IT SITS ABOVE THE FAQ AND NOT BELOW IT, because every FAQ in this
         building is the last row of its album — /wal, /foundation and /robots
         all close on one.
         ═══ [M 2026-08-14] AND IT IS NOW BELOW IT, AND IT IS KEPT ═════════════
         Mike named this album's tracks this morning as "track 1 -> About the
         Artist, track 2 -> FAQ" and did not mention this row. He moved it onto
         this album YESTERDAY, in writing, so it is kept at position 3 rather
         than read out of existence by a sentence that was naming two positions:
         his instruction is satisfied exactly — About the Artist is 1, FAQ is 2 —
         and nothing he placed has been deleted on an inference.
         Raised in the round log; one word removes it. */
      {
        id: "about-record",
        title: "About this record",
        videos: [],
        face: {
          kind: "text",
          title: "About this record",
          subtitle: "THE BEST OF WEIRD.BABY VOL. 1",
          profile: [
            { label: "What these recordings are",
              body: "The first pass. Rough, unrefined — and the version that " +
                    "went in as the original copyright submission." },
          ],
          footer: "WEIRD.BABY · THE BEST OF WEIRD.BABY VOL. 1",
        },
      },
      /* ═══ [B 2026-08-13] THE FAQ ROW IS NOT BUILT, AND THAT IS THE HOUSE'S
             OWN RULE RATHER THAN A GAP IN THE WORK ════════════════════════════
         MIKE: "Its tracks are the sections: About, FAQ. Photos and more later."
         The template is `faqFace()` in src/data/faq-face.js and it is one data
         block away — /wal and /foundation both drive it from a plain array of
         questions, and this album would too.
         WHAT IS MISSING IS THE QUESTIONS. Nobody has told Ops what this wing's
         FAQ says, and the museum's own answer to that is fifteen lines up this
         file: an empty container at a live address is what the NO-COMING-SOON
         credo kills, and Doctrine 12 forbids the alternative — a plausible
         question-and-answer about this artist would read true and be invented.
         The house's own FAQ is at /booth and is NOT reused here: W1 removed the
         keeper's answer from this very card for being an answer about the HOUSE
         printed under an ARTIST's name, and a booth FAQ copied onto /wb is that
         same mistake with more rows.
         So the row lands the day there are questions, and it costs a data block
         and no code. Raised for Mike in the round log. */
    ],
  },
  {
    id: "vol1",
    /* [B 2026-08-13] MIKE: "Page title `THE MAKING OF BOWB V1` -> `The Best of
       Weird.Baby Vol. 1`. No 'making of' anywhere on the site."
       IT IS HIS 2026-07-06 DISPLAY TITLE BEING RULED OUT BY HIM, and the line
       it replaces said so: "display title per Mike 2026-07-06 (registration
       title: Best of Weird.Baby — Vol 1)". The display name and the
       registration name were two names for one record and the registration one
       has won. Swept sitewide rather than here: the phrase appeared four times,
       all four in this file — this title, the artist card's holdings line, and
       the moved track's subtitle and footer. `grep -ri "making of"` over `src/`
       now returns only the three comments that record the change, and not one
       of them is a string. */
    title: "The Best of Weird.Baby Vol. 1",
    year: 2026,
    /* [A3 2026-08-06] THE COMPOSED COVER IS REPLACED, AND IT IS THE ONE THIS
       INSTRUCTION IS MOST ABOUT. W2: "the wing's albums are LESS CONSISTENT in
       look and feel than Robots and WAL — conform them." The 2026-07-06 cover
       was a gray field with red display type, a white sub-line and a small
       photo; it is the only object in the museum using red, and it sat in the
       same rack as a cover built on the house template. Replaced on that
       template. The old file is deleted rather than left beside it. */
    art: "/images/wb/vol1-cover.png",
    accent: null,
    tracks: [
      /* ═══ [CH6 2026-08-12] WHAT THESE RECORDINGS ARE ═══════════════════════
         MIKE: the tracks are tagged "audio" and he wants them marked as early
         unrefined versions that went in as his original copyright submissions.
         **NOT A LEGAL CLAIM — provenance, not assertion**, and the sentence is
         his own, used verbatim.

         WHY IT IS A FACE AND NOT THE TRACKS' `label`. Every one of the six
         carries `label: REC_LABEL` ("Recording — 2026-06"), and that string
         renders in `.tl-rend` — a **96px wide, 0.66rem, uppercase** button in
         the tracklist row (Exhibit.css:1175). A twenty-word sentence in that
         button does not read as provenance, it wrecks the row, and 3c's
         instruction was that it must not crowd the tracklist. `REC_LABEL` is
         untouched.

         AND IT IS ONE STATEMENT, NOT SIX. It is true of the whole first pass
         equally; six copies of one sentence down a tracklist would be the
         museum repeating itself once per row.

         IT IS THE ALBUM'S OWN FACE, in the shape this wing already uses for the
         artist card one album up — `kind: "text"` with a `profile` register.
         The album had no face before, so this adds one menu row and takes
         nothing away. It is on `vol1`, which is the album that SURVIVES at
         launch: the `about` album is hidden (CH5), so a provenance line parked
         there would have been invisible on the day it matters.

         ═══ [B 2026-08-13] AND IT HAS MOVED, WHICH REVERSES THE LAST SENTENCE
         OF THAT PARAGRAPH RATHER THAN CONTRADICTING IT ═══════════════════════
         MIKE: **"`01 About this record` leaves this album entirely — it becomes
         a track on Album B."** The track is now the second row of `About the
         Artist`, above; the reason it was parked here — that the other album was
         hidden at launch — went with the hold, in the same instruction.
         WHAT WENT WITH IT: this album's ONLY face. `The Best of Weird.Baby
         Vol. 1` is six songs and nothing else now, which is what an album of
         recordings is, and the chip on every one of them says `first pass` in
         the blurb's own words. */
      {
        id: "coconuts",
        title: "Coconuts",
        videos: [{
          id: "audio_wb_06_coconuts_2026_06_17_mp3",
          ytId: null,
          audioUrl: "/audio/wb/06_coconuts_2026-06-17.mp3",
          label: REC_LABEL,
          type: "audio",
        }],
      },
      {
        id: "ed_yahdah",
        title: "E.D. Yahdah",
        videos: [{
          id: "audio_wb_05_ed_yahdah_2026_06_16_mp3",
          ytId: null,
          audioUrl: "/audio/wb/05_ed_yahdah_2026-06-16.mp3",
          label: REC_LABEL,
          type: "audio",
        }],
      },
      {
        id: "weird_baby_blues",
        title: "Weird Baby Blues",
        videos: [{
          id: "audio_wb_01_weird_baby_blues_2026_06_17_mp3",
          ytId: null,
          audioUrl: "/audio/wb/01_weird_baby_blues_2026-06-17.mp3",
          label: REC_LABEL,
          type: "audio",
        }],
      },
      {
        id: "pull_me_in_closer_blues",
        title: "Pull Me In Closer Blues",
        videos: [{
          id: "audio_wb_02_pull_me_in_closer_blues_2026_06_16_mp3",
          ytId: null,
          audioUrl: "/audio/wb/02_pull_me_in_closer_blues_2026-06-16.mp3",
          label: REC_LABEL,
          type: "audio",
        }],
      },
      {
        id: "breakup_breakdown_blues",
        title: "Breakup Breakdown Blues",
        videos: [{
          id: "audio_wb_03_breakup_breakdown_blues_2026_06_16_mp3",
          ytId: null,
          audioUrl: "/audio/wb/03_breakup_breakdown_blues_2026-06-16.mp3",
          label: REC_LABEL,
          type: "audio",
        }],
      },
      {
        id: "how_i_saved_the_world_blues",
        title: "How I Saved the World Blues",
        videos: [{
          id: "audio_wb_04_how_i_saved_the_world_blues_2026_06_17_mp3",
          ytId: null,
          audioUrl: "/audio/wb/04_how_i_saved_the_world_blues_2026-06-17.mp3",
          label: REC_LABEL,
          type: "audio",
        }],
      },
    ],
  },
];

export const weirdBaby = {
  id: "wb",
  name: "Weird.Baby",
  /* [CH5] filtered here, not at the declaration, so the album stays written and
     readable in source — the hold is a stage decision, not a deletion. */
  spine: launched() ? spine.filter(a => !HIDDEN_AT_LAUNCH.has(a.id)) : spine,
  facts: [], // PUV stays empty for v0 (fact model is MV-side, deferred)
  /* ═══ [M 2026-08-14] THE WING OPENS ON THE MUSIC ═══════════════════════════
     MIKE: "/wb — opens on The Best of Weird.Baby Vol. 1, not About the Artist."

     IT IS THE LANDING AND NOT THE ORDER, and the two were deliberately kept
     apart. P9 (2026-08-05) is also his: "add an ABOUT THE ARTIST album, FIRST
     in the wing." Both hold — About the Artist is still the first cover in the
     rack, and the room opens on the second one — so the rack still reads the
     way he ordered it and the visitor still lands on the record.
     REORDERING THE SPINE WOULD HAVE SATISFIED THIS INSTRUCTION AND BROKEN THAT
     ONE, silently, with no note anywhere saying a ruling had been reversed. */
  defaultActiveIndex: 1,
  splitKey: "wb-wb-split",
  cfKey: "wb-wb-cfh",
  visitPath: "/wb",
  shopExitParam: "wb",
  /* [P9 2026-08-05] AND THE STAGE IS RETIRED HERE, WHICH THIS ROUND HAD TO DO
     RATHER THAN CHOSE TO. THE NO-HIDDEN-INFORMATION LAW, Mike's own words at
     M1: "card-advance/next-buttons are a sneaky way of adding pages — people
     will not flick to discover whether something is interesting." It was
     applied to /robots and to /wal and NOT to /wb — for the honest reason that
     /wb had never declared a face, so there was nothing here for the packer to
     cut up and the wing looked compliant by having no content.
     ABOUT THE ARTIST IS THE FIRST FACE THIS WING HAS EVER HAD, and measured on
     arrival it came up as "Page 1 of 4" with a ‹ BACK / NEXT › transport: the
     register, all three answers and the footer behind a button whose label says
     nothing about what is behind it. That is the defect the law names, and it
     would have been introduced BY this round. `faceFlow: "flat"` is W7's
     mechanism, unchanged, and the wing's audio tracks do not touch it — a
     track with videos renders the player it always did.
     THE MUSEUM NOW HAS NO PAGER ANYWHERE. `.stg-*` and the Stage component are
     mounted by nothing in any wing. */
  faceFlow: "flat",
  /* ═══ [B 2026-08-13] THE BLACK BAR IS GONE AND THE CONTROLS GO UP TOP ══════
     MIKE: **"Small controls above the viewer, WAL-style. Delete the black
     player bar."**

     IT IS ONE LINE BECAUSE THE MECHANISM WAS ALREADY BUILT AND ALREADY WAL'S.
     `transport: "banner"` (M-e, 2026-08-02) stows the transport into
     `.ex-album-banner` — the half-empty artist-name bar directly above the
     viewer — and the same flag stands the fixed `.pb` down, because rendering
     both would be two transports disagreeing about one player. WAL has run on
     it since the day it was written; that note names /wb as one of the three
     wings that "declare nothing and are untouched", and this is /wb declaring.

     `playerBar: false` IS **NOT** WHAT THIS WANTS, and the difference matters:
     that flag is /robots' and /foundation's answer — a wing with nothing to
     play gets NO transport at all. This wing has six songs. Deleting the bar
     without moving the controls would leave the room unable to pause itself.

     THE AUDIO PATH IS ALREADY WIRED. The banner's callbacks are handed
     `isAudioSrc ? audio.* : yt.*`, the same fork the fixed bar used, so a wing
     of mp3s drives it exactly as WAL's YouTube does.
     WHAT IS NOT IN THE BANNER: skip back / skip forward. That is WAL's shape,
     which is what he asked for by name — stop, play/pause, volume. */
  transport: "banner",
  // exhibitFlow omitted — see header note
};
