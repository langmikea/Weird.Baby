// src/data/artists/weird-baby.js
/* [CH5] `launched()` — the stage, from the one file in `src/` that knows it */
import { launched } from "../../lib/placement.js";
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

const REC_LABEL = "Recording — 2026-06";

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
const HIDDEN_AT_LAUNCH = new Set(["about"]);

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
    art: "/images/wb/about-cover.png",
    accent: null,
    tracks: [
      {
        id: "about-artist",
        /* [C1 2026-08-06] sentence case, with every other category row in the
           museum — see the note at /wal's `upToTrack`. The FACE title (all
           caps) and the album's own name are untouched. */
        title: "About the artist",
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
            { label: "What the museum holds",
              body: "Six recordings, made in June 2026, and one release: The " +
                    "Making of BoWB V1. They play in this room." },
          ],
          footer: "WEIRD.BABY · ABOUT THE ARTIST",
        },
      },
    ],
  },
  {
    id: "vol1",
    title: "The Making of BoWB V1", // display title per Mike 2026-07-06 (registration title: Best of Weird.Baby — Vol 1)
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
         there would have been invisible on the day it matters. */
      {
        id: "about-record",
        title: "About this record",
        videos: [],
        face: {
          kind: "text",
          title: "About this record",
          subtitle: "THE MAKING OF BoWB V1",
          profile: [
            { label: "What these recordings are",
              body: "The first pass. Rough, unrefined — and the version that " +
                    "went in as the original copyright submission." },
          ],
          footer: "WEIRD.BABY · THE MAKING OF BoWB V1",
        },
      },
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
  defaultActiveIndex: 0,
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
  // exhibitFlow omitted — see header note
};
