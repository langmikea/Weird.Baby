// src/data/artists/portal.js — THE PORTAL, AND IT IS HELD.
//
// ═══ [H1 2026-08-06] WHY THIS FILE EXISTS AT ALL ════════════════════════════
// MIKE'S RULING: **the Portal is HELD FROM LAUNCH and development continues.**
// A held thing must be UNREACHABLE BY A VISITOR — no route, no link, no
// listing, no share tag, no crawler path — and development access stays, in
// the same posture as `/hr`: reached through the password on `/admin`.
//
// SO THE ALBUM LEFT `robots.js`, AND THAT IS THE WHOLE POINT OF THE MOVE.
// A boolean in `robots.js` would have stopped the RENDER and still shipped the
// MATERIAL — the drum's eight engravings, the refusal lines, the twin's
// address — in a public chunk anybody can read. That is R5's lesson (a runtime
// filter left 153 vault mp3 URLs in the bundle) and H1's (the same lesson
// applied to a whole wing). The album is its own module, `vite.config.js`
// parks it under `assets/held/`, and `src/worker.js` refuses that directory
// without the cookie. `Robots.jsx` asks for it only when the browser flag is
// set, and a refusal is caught: the wing is simply the four public albums.
//
// THREE THINGS A FUTURE SESSION MUST HOLD.
//
// (1) **NOTHING PUBLIC MAY IMPORT THIS FILE.** A static import from any module
//     the public bundle reaches drags every string below into a public chunk,
//     and `heldChunkGuard` in vite.config.js fails the build if it does. That
//     guard is the enforcement; this paragraph is only the reason.
//
// (2) **THE TWIN'S ADDRESS TRAVELS IN THE EVENT, NOT IN THE LISTENER.** The
//     door's `src` and `title` are declared HERE and ride the dispatch, so
//     `RobotsExhibitFlow.jsx` — which is public — holds no address for a held
//     thing and no string naming it. A listener handed no `src` opens nothing.
//
// (3) **THE PUBLIC SITE STOPS MENTIONING THE PORTAL, AND TWO QUESTIONS MOVED
//     HERE BECAUSE OF IT.** *"Is the Portal the real machine?"* was on the
//     VIIIp's FAQ and *"Is the mainframe on the Portal?"* was on the NIAC's;
//     both are answered here now, word for word, because an FAQ on a public
//     page answering questions about a held room is a listing of it. They were
//     MOVED, not copied — there is one declaration of each.

/* ═══ [P2 2026-08-05] THE PORTAL IS ITS OWN ALBUM ══════════════════════════
   MIKE: "THE PORTAL becomes ITS OWN ALBUM — it is very important and this
   keeps it top-shelf visible."

   WHY SECOND AND NOT LAST. The deck lands on the front desk at index 0 and
   the carousel's ramp closes up as it goes (F4), so an album past the third
   position is a cover decking against the edge. Second is the only position
   that is both top-shelf and not the landing. The two machines keep their
   canon order behind it — the original mainframe, then the portable.
   [H1 2026-08-06] THE POSITION SURVIVES THE HOLD. `PORTAL_AT` below is the
   index `Robots.jsx` splices it back in at, so the album Mike put second is
   second the moment the door is open, and the public deck simply closes up.

   [2026-08-10] THE COVER IS HAND-AUTHORED. Mike's ruling: the four wing covers
   were made by Mikey, UX has passed them, and `tools/make_unit_covers.py` is
   retired for those paths — it raises rather than writes. The cover carries the
   album's name and the strapline, and that is the whole of what is declared
   about it (`provenance/assets-declare.mjs`).
   THE THREE THINGS THIS PARAGRAPH USED TO SAY ARE ALL FALSE NOW, and they are
   named rather than quietly replaced: that the badge was the aperture cropped
   out of `art/viiip.png`; that the cover was built by that tool; and that it
   therefore "cannot drift from the other three". THE FOUR MAY NOW DIFFER FROM
   ONE ANOTHER — a hand authored each one, and the shared-geometry guarantee
   went with the generator. That is the ruling, not a regression.
   `art/viiip.png` is untouched and still on disk; nothing is derived from it.
   TWO BADGES WERE BUILT FOR THIS SLOT BEFORE IT AND BOTH WERE REJECTED, which
   is recorded because both read as obvious choices from a file listing. The
   front glass lit (`front_screen.png`) is the plate M2 says is MIRRORED —
   every word on the screen backwards, and at badge size the lettering is the
   only thing in the disc. The bezel is not a photograph of the object at all
   but a COMPOSITING ASSET with a knocked-out white rectangle where the screen
   goes, which is M7's own finding about it. The reasons live in that tool's
   header beside the line that skips them.
   [H1] BOTH FILES MOVED UNDER `public/held/`. A cover and a poster are the
   held album's own material; leaving them at a public address would have made
   the one thing the hold is for — a picture of the machine nobody has been
   given yet — fetchable by anybody who guessed the path.
   ═══════════════════════════════════════════════════════════════════════ */

/* The door's own address, declared once. Read by the two faces below and by
   nothing else; `RobotsExhibitFlow` receives it through the event. */
const TWIN = {
  src: "/held/robots/twin.html",
  title: "MGK-VIIIp digital twin — the Portal",
  event: "wb-robots-open-twin",
};

/* Where the album sits in the deck when the door is open (see the P2 note). */
/* [F1 2026-08-06] the house's FAQ factory — see src/data/faq-face.js. It is a
   PUBLIC module and importing it from here is safe in the direction that
   matters: this file names it, not the other way round, so nothing public
   reaches the Portal through it. `heldChunkGuard` proves that at every build. */
import { faqFace } from "../faq-face.js";

export const PORTAL_AT = 1;

export const PORTAL_ALBUM = {
  id: "portal",
  title: "The Portal",
  year: null,
  tags: ["portal", "twin", "firmware", "interactive", "mgk", "viiip"],
  art: "/held/robots/art/portal-cover.png",
  accent: null,
  viewerPoster: "/held/robots/art/viiip-v2.png",
  viewerPosterCaption:
    "MGK-VIIIp — the glass carrying the machine's own opening beat.",
  tracks: [
    /* ═══ [2026-08-20] THE ALBUM IS TWO TRACKS, AND IT IS A RENAME ═══════════
       MIKE, ruled 2026-08-13 and re-confirmed 2026-08-20: the tracklist
       DELETES the `Portal` row and RENAMES `Portal Feed Controller` to
       `Portal`. One track, not two. The `id` below was already `portal`, so
       the change is a title and a deletion and touches nothing else.

       WHAT WENT, NAMED ONCE BECAUSE IT WAS A DELIBERATE BUILD (register P-b):
       the deleted row was THIS FILE'S ONE OPS JUDGEMENT. H3c named a row
       `PORTAL` and did not say what stood behind it, and a row that opens
       nothing is the dead control Doctrine 11's corollary forbids — so Ops
       made it a door that opened the twin with no feed selected. HIS RULING
       SUPERSEDES THAT JUDGEMENT, and the reasoning it was built on survives
       intact: the LATCH one row down is already a door, and a better one,
       because it opens the feed the drum has been rolled to and will not
       throw until the instrument is armed. Nothing on the glass lost a
       destination. */
    {
      id: "portal",
      title: "Portal",
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
           instrument names itself and the machine it belongs to.
           [H6 2026-08-06] AND NOW IT DOES NOT REPEAT THE BADGE EITHER — THE
           `title` IS STRUCK. P2's own sentence is the argument: the instrument
           names itself, and as of H3a it names itself IN METAL, on an accent
           panel at the top of the panel reading ABEAL · FEED CONTROL. A 22px
           heading saying FEED CONTROL directly above a badge that says FEED
           CONTROL is the second object saying what the first already said, one
           round after the first was built. The subtitle stays: the badge names
           the INSTRUMENT and the subtitle names the MACHINE it is bolted to,
           which are two facts. */
        subtitle: "MGK-VIIIp",
        panel: {
          /* [2026-08-21] WHERE THE PANEL REMEMBERS ITSELF, FOR THE VISIT AND
             NOT FOR EVER. sessionStorage, on the twin's own weather reasoning:
             *"a reload inside the session keeps the same weather and a new tab
             gets a new day. localStorage would have frozen one day forever."*
             Mike ruled session over local so the antenna stays a puzzle per
             visit. A panel that declares no `store` remembers nothing, which is
             how every panel behaved before this line. */
          store: "wb-portal-panel",
          /* ═══ [H3a 2026-08-06] THE NAMEPLATE IS A BADGE BOLTED TO A MACHINE ══
             MIKE, naming his references: "a raised chrome bezel; a black field
             with brushed-metal letterforms sitting PROUD of it; stamped-in-place
             fields (MODEL NO., SER. NO., DATE) with values struck into a lighter
             recess; an accent panel beside the wordmark. It must be unmistakably
             a BADGE bolted to a machine — not a label, not a caption."

             IT INVERTS P2's PLATE, WHICH INVERTED THE ONE BEFORE IT, AND THE
             DIRECTION IS THE POINT EACH TIME. The first plate was engraved steel
             and looked like the five controls around it; P2 made it a bright
             printed data plate so it could not be mistaken for a control. What
             it still was not, is a MAKER'S BADGE — the object on the front of a
             console whose whole job is to say whose machine this is, before you
             read a single legend. That is what a UNIVAC-era plate does and it
             does it with RELIEF: the letters stand off a dark field, catching the
             room's light, and the stamped data is knocked INTO a lighter recess
             beside them. Two directions of depth on one plate.

             THE STAMPED FIELDS ARE THREE AND TWO OF THEM ARE BLANK, WHICH IS
             DELIBERATE AND IS DOCTRINE 12. Mike asked for the FIELDS; a serial
             and a date are specifics nobody has supplied, and a plausible one is
             the exact failure that doctrine names. `MODEL NO.` carries `TYPE 8p`
             because the plate already said it. The other two render as struck
             wells with nothing in them, which is what an unstamped plate looks
             like — and the day Mike hands over a serial it is one value
             (OPEN_ACTIONS P-a). */
          nameplate: {
            /* [2026-08-21] THE BADGE IS THE MAKER'S NAME AND NOTHING ELSE.
               MIKE, ruling the rebuild: the ABEAL badge alone. `FEED CONTROL`
               and the three struck fields (MODEL NO. / SER. NO. / DATE) are
               OFF the plate.
               IT IS THE LAW OF SUBTRACTION, NOT A CORRECTION. Every one of
               those was true and none was needed: the bay beneath the badge is
               already engraved FEED, and two of the three fields were
               deliberately empty wells. `TYPE 8p` was the only value on the
               plate and it is on the spec sheet, where a spec belongs.
               `P-a` - the serial Mike was to hand over - closes with it: there
               is no field left to strike it into. */
            maker: "ABEAL",
          },
          /* === [2026-08-21] THE FEED BAY SETS A START MODE, NOT A CHANNEL ===
             MIKE, whole: **the drum sets the device's start mode. Nothing else.
             The DIP sets ANT or CAB per channel. The LATCH launches it, on
             channel 1. The four channel buttons pick which of four inputs
             shows. The drum and the channels are UNRELATED and neither affects
             the other.**

             SO THE EIGHT-POSITION DRUM IS GONE AND ITS `ch` FIELD WITH IT. The
             barrel carried two jobs that were never one - *which machine state*
             and *which channel* - and R6's channel engravings were the second
             job wearing the first one's clothes. Channels moved down to the
             ANTENNA, which already addressed them by number.

             LATER ROBOTS ARE NEW BANKS, NOT NEW CONTROLS. `bank` is the patched
             pair, `state` is the mode it starts in; a second unit is another row
             here and no new control anywhere.

             THE STATE IS ITS OWN FIELD so the readout's top line never carries
             `NIAC/VIIIp - TEST BENCH` on one row - and BOTH LINES ARE LIT, which
             is what makes the stepper look like it steps. Every bank in this
             volume is `NIAC/VIIIp`, so a dim sub-line was the only thing moving
             and the prominent half reported nothing.

             === THE IDS ARE THE TWIN'S RECIPE KEYS AND THEY WERE CHECKED ======
             Each `id` is a key in `PORTAL_RECIPES` in `twin.html`. Verified by
             reading that object on 2026-08-21, because the mapping the rebuild
             inherited had four of five wrong and nothing reported it:
               PATCHED     -> `standard`   {resume:true, power:"on", level:2}
               COLD START  -> `clean-boot` {power:"on", level:0}
               FIRST RUN   -> `first-run`  {power:"on", level:1}
             `first-run` is NEW in `twin.html` this round. **`level:1` reaches
             `Boot_Offer()`, which stops and asks the visitor a question, and
             that is CORRECT** - MIKE: *"the machine does what the machine was
             designed to do."* Nothing routes around it.

             === TWO BANKS DO NOT ARM, FOR TWO DIFFERENT REASONS ==============
             TEST BENCH - MIKE: *"disarm because we are not going to change lanes
             and work the 6-digit code right now."* Its recipe carries
             `dev:true`, which shows the workshop; disarmed, the workshop does
             not ship and the six-digit code stays backlogged.
             LAST STATE - **the recipe it was to be pointed at does not do what
             the legend says.** Mike's meaning is *"I left the machine running,
             so when I return resume right where I left off"*, and
             `idling-updated` is `{power:"on", level:2}` with NO `resume`: it
             opens an IDLE machine - PATCHED without the resume. The only thing
             that returns a visitor to their own machine is `resume:true`, and it
             is already on `standard`. Disarmed rather than wired to a recipe
             that would quietly mean something else.
             Full finding: `docs/MUSEUM_PANEL_REBUILD_LOG-20260821.md`. */
          feed: {
            label: "FEED",
            banks: [
              { id: "standard", bank: "NIAC/VIIIp", state: "PATCHED", arms: true },
              { id: "clean-boot", bank: "NIAC/VIIIp", state: "COLD START", arms: true },
              { id: "first-run", bank: "NIAC/VIIIp", state: "FIRST RUN", arms: true },
              { id: "last-state", bank: "NIAC/VIIIp", state: "LAST STATE", arms: false },
              { id: "test-bench", bank: "NIAC/VIIIp", state: "TEST BENCH", arms: false },
            ],
          },
          /* === [2026-08-21] THE ANTENNA IS FOUR INDEPENDENT SWITCHES ========
             MIKE'S DESIGN. Four sliders numbered 1 2 3 4 and NO LEGEND: what
             they select belongs in the manual, without detail - it is an egg to
             be worked out, not a caption.

             A `1` IS `ANT` AND A `0` IS `CAB`, which is the correction Mike made
             on 2026-08-21: **`ANT` is television - an aerial is how television
             arrives - and `CAB` is hardwired and carries the MGK units.** So a
             channel switched to ANT shows television; switched to CAB it shows
             whatever unit is wired to it, or the test signal if none is.

             === FOUR ROUTINGS BECAME SIXTEEN, AND THAT IS THE POINT ==========
             The stepping button offered four fixed strings and the puzzle was
             *step until 1101*. Four independent switches is the instrument Mike
             drew: the puzzle is *find the channel the machine is on and switch
             that one to CAB*, and QC_101 - attached to Record 004 - is where a
             visitor reads `BROADCASTS ON ... FEED NO. 3` in the installer's own
             hand.

             DEFAULT `1111` - every channel taken, nothing listening.

             === THE CHANNELS LIVE HERE NOW ==================================
             `unit: true` is what *a machine is assigned to this channel* means,
             and it is the old drum position's `arms` field MOVED rather than
             invented - the same four declarations, at the address that always
             addressed them by number. Channel 4 keeps its own `src`: routed ANT
             it is television, routed CAB it is the close-up, and that photograph
             IS that channel's assigned signal. P5's rule holds again - no id
             moved and no legend was recut. */
          antenna: {
            label: "ANTENNA",
            default: "1111",
            channels: [
              { ch: 1, unit: false },
              { ch: 2, unit: false },
              { ch: 3, unit: true },
              { ch: 4, unit: true,
                src: "/held/robots/reference/photos/MGK-TWIN_MONITOR_CLOSE_UP.png",
                frameTitle: "MGK-VIIIp - the close-up" },
            ],
            television: {
              /* A/V Geeks 16mm Films - "Assorted 1960s TV Commercials".
                 PROVED PLAYABLE in a real nocookie iframe 2026-08-21, and
                 re-proved on the live site the same day (`onReady`, no
                 `onError`, duration read back). */
              ytId: "aA5oKoCRjWw",
              /* the true length, and the modulo depends on it: if the source is
                 ever re-uploaded or trimmed this number is wrong and every phase
                 drifts with nothing reporting it. Read off the watch page
                 2026-08-21 (`lengthSeconds`), not estimated. */
              seconds: 1743,
              title: "Television",
            },
            test: { title: "Test signal" },
            /* the readout under the latch. It names what the channel is
               carrying, which is the only place the antenna explains itself. */
            says: {
              television: "TELEVISION ON THIS CHANNEL.",
              machine: "SIGNAL PRESENT.",
              test: "TEST SIGNAL. NO UNIT ON THIS CHANNEL.",
            },
          },
          /* === [2026-08-21] THE BAT SWITCHES ARE STRUCK =====================
             `AUTO MAINT` and `AT PROMPT` are off the panel. Ruling 25: there is
             no lock - a patch panel arms when it is LIVE. They were two controls
             whose only job was to refuse, and the refusal they produced was a
             paragraph that grew the chassis 62px on a dial turn.
             NOTHING DECLINES SILENTLY STILL HOLDS: the lamp beside the latch
             reads NOT ARMED and the latch is visibly disabled - two reports of
             the same fact, by the controls that caused it. */
          dial: {
            label: "SOURCE",
            positions: [
              { id: "live", label: "LIVE", arms: true },
              { id: "seeded", label: "SEEDED", arms: false },
            ],
          },
          latch: {
            label: "LATCH",
            armed: "FEED ARMED",
            idle: "NOT ARMED",
            event: TWIN.event,
            src: TWIN.src,
            frameTitle: TWIN.title,
            /* === [2026-08-21] THE BEZEL THE OVERLAY DRAWS ====================
               MIKE: the bezel and the channel buttons belong to THE PORTAL, not
               to the machine - *"the screen is a television set; its frame and
               its buttons do not disappear because of what is on it."*
               THE GEOMETRY IS MEASURED AND MUST NOT BE EYEBALLED. Both numbers
               are read off the twin's own asset notes: the bezel PNG is
               3000x2400 and its barrel-curved opening encloses x 227..2766,
               y 202..2213. THE FEED RECT IS DELIBERATELY TALLER THAN THE HOLE -
               x 227..2766, y 194..2229 - because the picture OVERFILLS the
               opening top and bottom and the curved inner edge crops it. That
               overscan is what makes a plain rectangle a legal feed shape here:
               0 hole pixels fall outside the rect, so no page ground can leak
               into the picture. MIKE: *"standard 60s CRT."* */
            bezel: {
              src: "/held/robots/reference/photos/MGK-TWIN_MONITOR_SCREEN_BEZEL.png",
              w: 3000, h: 2400,
              feed: { x: 227, y: 194, w: 2540, h: 2036 },
            },
          },
        },
        /* [2026-08-11] THE `papa` FIELD IS DELETED WITH THE RED NOTES. It
           held one marked sentence — the engraved legends being Mike's to
           write — and nothing else, so the ruling emptied it. The renderer
           that drew a `papa` field went with it (Exhibit.jsx). */
      },
    },
    {
      /* [H3c 2026-08-06] THE PORTAL'S OWN FAQ — and both questions in it were
         already written and already answered, on the two machines' FAQs, where
         they were the only two rows on the public site naming a held room. They
         are MOVED here word for word. Nothing was written for this track. */
      id: "portal-faq",
      title: "FAQ",
      videos: [],
      tags: ["faq", "questions", "portal"],
      /* [F1 2026-08-06] BUILT BY `faqFace()` LIKE EVERY OTHER FAQ IN THE
         BUILDING, and this one matters more than the four public ones: a held
         album is the easiest place in the museum for a format to drift, because
         nobody laps it. The factory is what makes that impossible rather than
         unlikely — see src/data/faq-face.js. The "THE PORTAL · FAQ" footer is
         struck with the other four. */
      face: faqFace("THE PORTAL", [
        { title: "Is the Portal the real machine?",
          line: "It is the real firmware on shimmed hardware — the twin. " +
                "The unit itself is a physical object in a room; the twin is " +
                "how it is met from here.",
          note: "" },
        /* [2026-08-21] MIKE'S EDIT, HIS SENTENCE AND HIS APPROVAL. The answer
           read "…and neither of them ARMS" until the antenna selector shipped,
           and that clause became false the moment channels 1 and 2 began
           arming: they carry television or a test signal depending on the
           routing, and neither of those is MGK-NIAC.
           THE SUBSTANCE NEVER MOVED — the mainframe is still not on the Portal
           — only the mechanism the answer reaches for, and CARRIES is the truer
           word for it in any case: a channel arming says something about the
           latch, and what this answer is about is what comes out.
           OPS FLAGGED IT AND DID NOT WRITE IT. The replacement clause is his,
           filed MIKE in the register, because a sentence in a visitor's face is
           voice and voice is his. Ruling B does not apply: the Portal is HELD
           and no visitor has read either version. */
        { title: "Is the mainframe on the Portal?",
          line: "Not yet. Two channels are engraved for it on the feed " +
                "drum and neither of them carries it.",
          note: "" },
      ]),
    },
  ],
};
