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
   [FLAG 2026-08-25] M2's WORD IS WRONG AND THE SENTENCE ABOVE INHERITS IT.
   The plate is ROTATED 180°, not mirrored — proved on 2026-08-11 by applying
   M2's horizontal flip and looking at the result (the words came back in the
   right ORDER with every glyph inverted, still unreadable), and re-measured
   2026-08-25: the museum's file is the robots master rotated exactly 180°,
   same 2048x1536, identical pixel histogram, rot180 true and flip-horizontal
   false. THE REASONING ABOVE SURVIVES THE CORRECTION — the lettering is
   unreadable either way, which is the whole of why the badge was rejected, so
   nothing this paragraph concludes moves. M2 stays OPEN because it is Mike's;
   the file still needing the correction is the ROBOTS master, not this one.
   [H1] BOTH FILES MOVED UNDER `public/held/`. A cover and a poster are the
   held album's own material; leaving them at a public address would have made
   the one thing the hold is for — a picture of the machine nobody has been
   given yet — fetchable by anybody who guessed the path.
   ═══════════════════════════════════════════════════════════════════════ */

/* The door's own address, declared once. Read by the two faces below and by
   nothing else; `RobotsExhibitFlow` receives it through the event. */
const TWIN = {
  src: "/robots/twin.html",
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

/* ═══ [2026-08-26] THE PANEL IS ONE OBJECT, READ BY TWO SURFACES ═══════════
   It was declared inline on the `portal` track's face until today. TERMINAL.EXE puts
   the same four bays on a Portal screen, and **two surfaces reading two object
   literals is two things to keep in step and one of them would eventually be
   wrong** — the museum has paid for that shape three times (`HrArchive`'s
   hand-typed catalogue, the JS mirror of the token ramp, the twin's `CHY_M`).
   Hoisting it is the cheapest fix available: the literal below is the one that
   was already there, moved and de-indented, with nothing added or removed.
   THE ALBUM PAGE READS IT AS `face.panel`; TERMINAL.EXE READS IT AS `action.panel`.
   Change which banks arm and both change together, or neither does. */
const PORTAL_PANEL = {
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
     addressed them by number. P5's rule holds again - no id moved and
     no legend was recut.

     === [2026-08-27] AND THE ROUTING IS THE SELECTION NOW ============
     MIKE: **"You do not change channels, as there are none. The
     channels are inherent to the feed, not the bare terminal
     program."** A `0` is no longer only *how this channel is wired* —
     it is *this is the input the set is on*, and RUN opens it. **The
     puzzle this block describes is unchanged and is what now pays**:
     find the channel the machine is on and switch that one to CAB, and
     the machine is what comes up. The four buttons on the picture that
     used to do the choosing are gone; `feed-control.js`'s `feedChannel`
     carries the rule and the measurement behind it.
     THE SENTENCE ABOUT CHANNEL 4's OWN `src` IS STRUCK — see its row
     below, which Mike has ruled identical to channel 3. */
  antenna: {
    label: "ANTENNA",
    default: "1111",
    channels: [
      { ch: 1, unit: false },
      { ch: 2, unit: false },
      { ch: 3, unit: true },
      /* ═══ [2026-08-26] `picture: true` — THE CHANNEL SAYS WHAT ITS
         SIGNAL IS MADE OF, AND THAT IS ALL IT SAYS ══════════════════
         CHANNEL 3 AND CHANNEL 4 ARE BOTH `unit: true` AND BOTH RESOLVE
         TO `machine`, WHICH IS CORRECT — a photograph of the machine's
         own monitor IS that channel's assigned signal, and that ruling
         is untouched. What the overlay could not tell was that one of
         them is a DOCUMENT and the other is a PICTURE, so both went
         through the same `<iframe>`.
         THE DEFECT THAT COST: `object-fit` DOES NOT APPLY TO AN
         IFRAME. `PortalScreen.css` sets `object-fit:cover` on
         `.ps-feed iframe` and it has been inert since the day it was
         written; what a visitor got was the BROWSER'S OWN IMAGE
         VIEWER, scaling the plate by its own rules inside our frame,
         with no script in it so `Framed_Fit()` never ran either.
         THE ART WAS NEVER THE PROBLEM AND IS NOT RE-CUT. Measured
         2026-08-26: the plate is 3000x2400 — the bezel's own canvas —
         and REGISTERS with it, showing a frame ring of 0px at nine of
         eleven rows sampled across the opening (the two others are the
         camera body in the picture). So it goes on `place:"canvas"`
         edge to edge, exactly as the twin's own art does, and `cover`
         is a no-op on it rather than a crop.
         IT IS DATA AND NOT LOGIC, in the same shape as `bezel` and
         `note`: the channel declares it, `openChannel` carries it, and
         the overlay picks an element. Nothing downstream learns what a
         channel or an antenna is, which is the seam R6 drew. */
      /* ═══ [2026-08-27] CHANNEL 4 IS CHANNEL 3 — MIKE'S RULING ════════
         **"Channel 4 is non-responsive and should show EXACTLY what CH3
         shows. They are just two zooms of the same unit."**

         SO `picture`, `src` AND `frameTitle` ARE STRUCK FROM THIS ROW
         and nothing replaces them. With no `src` and no `frameTitle` of
         its own the resolver falls through to the latch's — `src:
         row.src || L.src` — so channel 4 opens the same live twin, at
         the same preset, with the same accessible name. **It is not a
         copy of channel 3's declaration; it is the absence of a
         declaration, which is what makes "EXACTLY" true by
         construction rather than by two rows being kept in step.**

         WHAT WAS THERE, SO NOBODY REBUILDS IT BY ACCIDENT: the
         close-up plate `MGK-TWIN_MONITOR_CLOSE_UP.png`, declared
         `picture: true` on 2026-08-26 so the overlay would draw it as
         an `<img>` rather than through an `<iframe>` that made
         `object-fit` inert. **That diagnosis was right and is not
         reversed** — what Mike has ruled is that a photograph is the
         wrong THING for this channel, not that it was drawn wrongly.
         **The plate is still published** at that address (`efc379f`)
         and the `picture` branch still exists in
         `RobotsExhibitFlow.jsx`; a channel that wants a still is one
         field away. Row `MC-a`: nothing declares `picture` now.

         HIS REASON IS THE PART THAT BINDS A LATER ROUND. *"Two zooms of
         the same unit"* is why a dead channel was wrong here — the
         museum was showing the same machine twice and letting one of
         them be a picture that does not answer a press. `unit: true`
         is untouched on both, and no id moved.

         ═══ [2026-08-27, SAME DAY] AND "EXACTLY" WAS OPS' WORD, NOT
             HIS — THE ZOOM COMES BACK ══════════════════════════════
         MIKE: **"Channel 4 is showing me the content that is to live
         on channel 3 (unzoomed front and top views) instead of the
         zoomed version."**

         **THE INSTRUCTION OPS ACTED ON SAID "should show EXACTLY what
         CH3 shows", AND OPS READ "EXACTLY" AS *IDENTICAL* WHEN HE
         MEANT *RESPONSIVE, THE WAY CH3 IS*.** His own next sentence
         was there to be read — *"They are just two zooms of the same
         unit"* — and two zooms are not one picture. The defect this
         round fixed was a channel that could not answer a press; the
         fix threw away the zoom along with the photograph, which was
         never the complaint.

         SO CH4 IS THE LIVE TWIN AGAIN AND CARRIES ITS OWN `zoom`.
         Same `src`, same preset, same machine, same responsiveness as
         channel 3 — and framed close on the unit instead of wide.
         **A photograph is still the wrong thing here**, which is the
         half of the earlier reading that was right and stands.

         ═══ [2026-08-27] AND THE ZOOM WAS OPS' SECOND WRONG READING ═════
         MIKE: **"I created the artwork for CH3 and CH4, and also
         handed you the marker for where the screen is to land. I
         created CH3 so I could see the entire front and top, and I
         created CH4 such that they were zoomed in versions of the
         same."**

         **CH4 IS HIS OWN PLATE WITH HIS OWN MARKER, NOT A CROP OF
         CH3.** Ops first made it identical to CH3, then - told that
         was wrong - made it a 3.2x crop of CH3's photograph, derived
         by comparing one glass feature between the two images. **Both
         readings threw his artwork away.** The marker files settle it:
         in CH3 the two screens sit 283px apart vertically, in CH4 they
         sit ONE pixel apart. No crop can do that; they are two shots
         of the same machine, posed differently, exactly as he said.

         SO THE CHANNEL DECLARES A VIEW AND THE MACHINE DRAWS ITSELF ON
         THE RIGHT PLATE. `view: "closeup"` reaches `twin.html` as
         `?view=closeup`, which selects both the plate AND the aperture
         geometry read from `MGK-TWIN_MONITOR_CLOSE_UP_MARKERS.png` -
         front (863.4, 692.6), top (2139.5, 693.6), 1071 x 522 each.
         **Every number is his; the derivation Ops did is deleted, not
         kept as a fallback.** `twin.html`'s `Portal_View` block carries
         the marker arithmetic and the comparison with CH3's.

         IT IS DATA, IN THE SHAPE OF `picture` AND `bezel` BEFORE IT:
         the channel declares it, `openChannel` carries it, the overlay
         puts it in a query string, and nothing downstream learns what
         a channel is. */
      /* ═══ [2026-08-27] `exact` — HIS PLATE CARRIES THE FRAME ══════
         MIKE: **"CH4 is showing two bezels."** Measured on the two
         files: where the museum's bezel is opaque, the close-up's
         pixels are IDENTICAL to it (31/31, 41/41, 18/18, 26/26,
         60/60, 20/20) and its alpha matches the bezel's runs to the
         pixel. **His plate is the frame plus the picture in one
         file**, registered at 1:1 — and the 4:3 enlargement was
         scaling his copy 1.0667x against a museum bezel at 1.0, so
         both edges showed. `exact` draws it untouched and the two
         become one. The reasoning is at the placement in
         `PortalScreen.jsx`; the 4:3 ruling is not reversed and every
         picture that has no opinion about the canvas still gets it. */
      { ch: 4, unit: true, view: "closeup", exact: true,
        frameTitle: "MGK-VIIIp - the close-up" },
    ],
    television: {
      /* A/V Geeks 16mm Films - "Assorted 1960s TV Commercials".
         PROVED PLAYABLE in a real nocookie iframe 2026-08-21, and
         re-proved on the live site the same day (`onReady`, no
         `onError`, duration read back).

         ═══ [2026-08-26] READ THIS BEFORE SWAPPING THIS ID ═══════════
         THIS SOURCE IS 16:9 WITH A 4:3 PICTURE MATTED INSIDE IT, and
         the placement that fills the opening depends on that. Measured
         on four frames at four timestamps at native resolution: the
         matte edge is at 12.97% of the frame width on each side and is
         centred to the pixel (left bar - right bar = 0 on every frame),
         giving a picture of 1.3167 - within 1.25% of 4:3 and NARROWER
         than it, which is the direction that matters.

         `Television.css` sizes the player to the feed box's HEIGHT, so
         it always crops **12.5% of the frame width from each side**.
         Here that lands inside the 12.97% matte and eats only black.

         **THAT IS A PROPERTY OF THIS FILE, NOT OF THE PLACEMENT.** The
         crop is unconditional. A genuine 16:9 clip with picture to the
         edges would lose a quarter of its width to the same rule, and
         about 30% of it once the bezel is counted, with nothing
         reporting it. **Measure any replacement's matte before it
         ships** - `docs/OPEN_ACTIONS.md` T-a. */
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
       carrying, which is the only place the antenna explains itself.
       ═══ [2026-08-26] `television` IS STRUCK, ON MIKE'S RULING ══════
       It read `TELEVISION ON THIS CHANNEL.` and it is gone. The two
       that remain are doing a job this one was not: `SIGNAL PRESENT.`
       and `TEST SIGNAL. NO UNIT ON THIS CHANNEL.` both report something
       a visitor cannot see for themselves — whether the routing found a
       machine. **Television announcing itself is the museum captioning
       a picture that is already playing**, which is the Law of
       Subtraction's own test: what is lost if it goes, and the answer
       is nothing a reader would miss.
       A KIND WITH NO ENTRY YIELDS `""`, AND `PortalScreen` DRAWS NO
       NOTE AT ALL — `{note && …}`. So the line does not go blank, the
       element goes away, and television carries no chyron under the
       strip. Register row `ceef789ffa98df27` is pruned with it. */
    /* ═══ [2026-08-26] `says` IS STRUCK WHOLE — MIKE'S RULING ═══════════════
       **"KILL all messages RE: signal present or not - unless I prescribed
       it."**

       OPS CHECKED WHOSE WORDS THEY WERE BEFORE DELETING THEM, WHICH IS THE
       "unless" DOING ITS JOB. Both rows in `provenance/register.json` read
       **HOUSE**, and both sources say so in as many words: `SIGNAL PRESENT.` —
       *"Ops' own words - the readout under the latch when a machine's signal
       reaches the selected channel"*; `TEST SIGNAL. NO UNIT ON THIS CHANNEL.` —
       *"Ops' own words - the readout under the latch on a channel the routing
       leaves listening"*. **Neither was prescribed, so both go.**

       WHAT WAS *NOT* KILLED, AND THE DIFFERENCE MATTERS. `test.title`
       (`Test signal`) and `television.title` (`Television`) are also HOUSE, and
       they SURVIVE — they are **accessible names**, not messages. They are what
       a screen reader is told the picture IS; deleting them would leave two
       channels unnamed for assistive tech, which is not what "kill all
       messages" asks for and would be a real regression on a surface nobody
       looking at the glass would notice.

       `TELEVISION ON THIS CHANNEL.` was the third of these and he struck it on
       2026-08-26 for the Law of Subtraction. These two follow it, on his word.
       `PortalScreen` already drew nothing for an empty string, and the payload
       no longer carries `note` at all — so what goes is the element, not a
       blank line. Register rows pruned with them. */
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
    /* ═══ [2026-08-27] `safe` — THE FRAME IS NOT A RECTANGLE AND THE CLIP WAS
       MIKE: **"When I click on VIIIp I see screen tears extending outside the
       bezel"** and **"vertical jitter ... is also extending past the bezel."**

       THE CAUSE IS THIS PLATE'S OWN SHAPE. It is a rounded CRT silhouette on a
       fully transparent ground, and the museum cut the picture to its BOUNDING
       BOX rather than to the shape it draws. Measured on its alpha, the width
       of the not-fully-opaque outer margin per row: 1px at row 1200, 25/37 at
       row 200, and **980/903 at row 10** where the corner curves away. Rows 0
       and 2398..2399 and columns 2991..2999 are transparent across their whole
       length. Everywhere the silhouette falls short of the box there is
       NOTHING over the picture - it reads black on black at rest and shows the
       instant anything bright moves through it.

       `safe` IS THE LARGEST RECTANGLE INSIDE THE SILHOUETTE THAT STILL HOLDS
       THE WHOLE OPENING, and it was computed rather than chosen: the
       transparent ground was flood-filled inward from the border to give
       frame-plus-opening, then the opening's bounding box (x 231..2761,
       y 207..2207) was grown on each side for as long as the whole edge line
       stayed inside. It stops at x 102..2896, y 46..2336.

       **IT CANNOT COST A VISIBLE PIXEL.** Everything between this rectangle
       and the silhouette is the frame itself on all four sides and the whole
       of each rounded corner, so what it removes was already covered. And it
       is the plate's own measurement, like `feed` beside it, so it cannot come
       apart the day the bezel is re-cut - it is re-measured with it.

       ONE MEASUREMENT, ONE OWNER: `PortalScreen` reads this and clips the feed
       box to it. Nothing in `src/` types these numbers a second time. */
    bezel: {
      src: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREEN_BEZEL.png",
      w: 3000, h: 2400,
      feed: { x: 227, y: 194, w: 2540, h: 2036 },
      safe: { x: 102, y: 46, w: 2795, h: 2291 },
    },
  },
};

export const PORTAL_ALBUM = {
  id: "portal",
  title: "The Portal",
  year: null,
  tags: ["portal", "twin", "firmware", "interactive", "mgk", "viiip"],
  art: "/robots/art/portal-cover.png",
  accent: null,
  viewerPoster: "/robots/art/viiip-v2.png",
  viewerPosterCaption:
    "MGK-VIIIp — the glass carrying the machine's own opening beat.",
  tracks: [
    /* [2026-08-26] `Launch the Portal` IS DELETED - MIKE'S RULING ==========
       **"\Robots - DELETE 'Launch the Portal'"**

       WHAT WENT WITH IT IS THE HARDWARE FEED PANEL, and that is one ruling
       read once rather than two read separately: this track's face WAS the
       panel - `face.panel`, the readout that replaced the drum, the four dip
       switches, the rotary dial and the latch, mounted on the album page.
       **"KILL THE HW Feed Monitor"** names that object, and deleting the
       track is how it dies. Nothing else in the museum drew it.

       ITS FUNCTION IS NOT DELETED - IT MOVED. `PORTAL_PANEL` above is still
       the one declaration of what the feed offers, and `feed-control.js` is
       still the one place that decides what a channel carries. What is gone
       is a page of hardware, not a capability.

       THE `id` WAS `portal` AND IS NOT REUSED. OPERATIONS section 0 - an `id`
       is identity - so the console's row is `console` and this one is simply
       absent. The ledger rows `portal.door` and `viiip.portal` describe a
       track and a face that no longer exist and are struck with it.

       THE RENAME OF SIX DAYS AGO IS NOT UNDONE, IT IS OVERTAKEN. Canon
       06-PORTAL numbers six steps for this title; this is the seventh and it
       is a DELETION rather than a seventh name. A later round reading that
       table must not conclude the name is open - the ROW is gone. */
    /* ═══ [2026-08-26] TERMINAL.EXE — THE TRACK IS THE FILENAME ════════════
       MIKE, on how it is reached: **"How to run the file: Rec attachment ·
       \Robots Track= filename"** — so the track in this wing is NAMED FOR THE
       FILE, and the file is the Record's.

       THE NAME IS NOT INVENTED AND COULD NOT BE. Record 004's cracked-ZIP
       listing carries exactly three files — `TERMINAL.EXE`, `PORTAL_2v16.CFG`
       and `QC_101.TIF`. **His note asked for a `.bat` to run the `.exe`, and
       there is no `.bat`**: zero hits in either repository, in or out of story.
       So the file that runs is the one that is there. Nothing was made up to
       stand in front of it, which is Doctrine 12 doing its job on a name.

       THE `id` IS NOT THE TITLE, ON PURPOSE. OPERATIONS §0, *NO ID MOVES WHEN A
       LEGEND IS RECUT*: `console` is identity and `TERMINAL.EXE` is what
       restates the glass. If the filename is ever ruled differently the id does
       not move with it.

       IT IS A THIRD TRACK AND THE SECOND ONE IS UNTOUCHED. `Launch the Portal`
       still draws the panel on the album page. **Whether that page keeps its
       panel once TERMINAL.EXE has one is HIS CALL and is not taken here** — his words
       were *"instead of the feed panel"*, and reading "instead" as "delete the
       existing surface" is a UX decision wearing a mechanism's hat. Flagged in
       `docs/OPEN_ACTIONS.md` MB-a. */
    {
      id: "console",
      title: "TERMINAL.EXE",
      videos: [],
      tags: ["portal", "console", "firmware", "1965", "interactive"],
      /* [2026-08-26] IT RUNS ON THE CLICK AND HAS NO FACE - MIKE'S RULING.
         **"Clicking TERMINAL.EXE should not pop up an intermediary page that
         has a run button; it should run it instead."** The `face` and its RUN
         button are gone; `run` is the row's own dispatch and the tracklist
         branches on it the way it already branches on `jumpTo`.
         THE DETAIL IS EVERYTHING THE CONSOLE NEEDS AND NOTHING ELSE: what
         kind of screen, what to print while it loads, which bezel to wear,
         and the panel declaration whose FUNCTION the monitor now carries.
         `boot` IS HIS SHAPE AND EVERY TOKEN IS PUBLISHED. `TERMINAL.EXE` and
         `PORTAL_2v16.CFG` are Record 004's cracked-ZIP listing - the only
         two files in it that are not the QC form, and there is no `.bat`
         anywhere in either repository. `UNIX-6x Emulator` is Record 005's
         own line. `Loading......` is his, six dots, as typed. */
      run: {
        event: TWIN.event,
        detail: {
          kind: "console",
          frameTitle: "TERMINAL.EXE",
          bezel: PORTAL_PANEL.latch.bezel,
          panel: PORTAL_PANEL,
          boot: [
            "> TERMINAL.EXE",
            "> UNIX-6x Emulator",
            "> Loading......",
            "> PORTAL_2v16.CFG",
          ],
          /* ═══ [2026-08-27] THE HALT — MIKE'S RULING, AND IT INVENTS NO
             NOUN ══════════════════════════════════════════════════════
             **"X RUNS A VISIBLE CLEAN SHUTDOWN — quick, but it happens —
             then lands back on the ALBUM."**

             IT IS THE BOOT PLAYED BACKWARDS AND THAT IS THE WHOLE
             DESIGN. The same four lines in reverse order, with the one
             word that has to change: `Loading......` becomes
             `Closing......`, six dots, his punctuation carried. **Every
             other token on this screen was already published** —
             `TERMINAL.EXE` and `PORTAL_2v16.CFG` are Record 004's
             cracked-ZIP listing, `UNIX-6x Emulator` is Record 005's own
             line — so a shutdown that names anything else would be the
             museum inventing machine behaviour to fill four seconds.
             Doctrine 12, on a surface where it would have been easy to
             write a page of plausible log lines.

             HE LIKED THE BOOT AND ITS SIZE (*"I like how the initial
             commands come up and the size they come up at"*), so the
             halt is drawn in the same register at the same size, and it
             is quicker: the console steps it at nearly half the boot's
             interval, which is what *"quick, but it happens"* asks
             for. */
          halt: [
            "> PORTAL_2v16.CFG",
            "> Closing......",
            "> UNIX-6x Emulator",
            "> TERMINAL.EXE",
          ],
        },
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
