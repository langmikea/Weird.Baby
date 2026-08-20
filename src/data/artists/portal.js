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
    /* ═══ [H3c 2026-08-06] THE ALBUM IS THREE TRACKS ═════════════════════════
       MIKE: "THE PORTAL'S TRACKS: PORTAL · Portal Feed Controller · FAQ."

       ONE JUDGEMENT IS OPS' AND IT IS NAMED RATHER THAN BURIED (register P-b):
       he named a row and did not say what stands behind it. A row called
       PORTAL that opens nothing is the dead control Doctrine 11's corollary
       forbids, so this one IS the door — the portal as it stands, no feed
       selected. The LATCH one row down is a different door and keeps its job:
       it opens the feed the drum has been rolled to, and it will not throw
       until the instrument is armed. If Mike meant something else behind this
       row it is one field, and nothing else in the album moves. */
    {
      id: "portal-door",
      title: "Portal",
      videos: [],
      tags: ["portal", "twin", "interactive"],
      face: {
        kind: "text",
        title: "Portal",
        subtitle: "MGK-VIIIp",
        action: {
          label: "OPEN THE PORTAL",
          event: TWIN.event,
          src: TWIN.src,
          frameTitle: TWIN.title,
        },
      },
    },
    {
      id: "portal",
      title: "Portal Feed Controller",
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
            /* ═══ [P1 2026-08-06] "INSTRUMENT DIV." IS STRUCK. MIKE: ABEAL is
               correct canon — a division of ScrapCo — but INSTRUMENT DIVISION
               is DRIFT, and it is the SECOND time the same drift has grown.
               He struck "ABEAL Instrument Company" off the manual cover on
               2026-08-05 and it regrew here in a new costume, on a different
               object, inside a fortnight. A name a maker never had is not a
               small error on a nameplate: a nameplate is the one object on a
               machine whose whole job is to say who made it.
               ABEAL ALONE, unless canon says otherwise. The hyphen went with
               it — the wing's own canon spells it ABEAL, and "A-BEAL" was this
               file's spelling and nowhere else's. */
            maker: "ABEAL",
            unit: "FEED CONTROL",
            fields: [
              { k: "MODEL NO.", v: "TYPE 8p" },
              { k: "SER. NO.", v: null },
              { k: "DATE", v: null },
            ],
          },
          drum: {
            label: "FEED",
            /* [2026-08-19] THIS LEGEND IS WRONG BY ONE WORD AND IS LEFT ALONE
               ON MIKE'S RULING: fix it when the Portal is next touched, not in
               a round that is not about the Portal. TWO positions arm, not one
               — `standard` (ch 3) and, since CH4 2026-08-12, `idling-updated`
               (ch 4, DETAIL). Nobody has met it: the wing is HELD. It is the
               Record's own "what's said matches what's shown" rule (ruling 10)
               applied to a control legend, and it costs one word. */
            sub: "SELECT · ONE ARMED",
            /* positions are read in drum order, top to bottom. `arms:true`
               is the only one that lights the drum and permits the latch.

               ═══ [R6 2026-08-05] THE FEEDS CARRY CHANNEL NUMBERS, AND THE
               REASON IS NOT ON THIS PAGE. Mike's instruction: the Portal's
               feed positions renumber — MGK-NIAC takes channels 1 and 2 and
               MGK-VIIIp moves to 3 and 4 — and *the reason is the egg and it
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
               and nothing else — no state, no mode, no feed title, because
               nobody has supplied one and a plausible one is Doctrine 12's
               exact failure. Neither arms: the mainframe does not run on the
               Portal, and the day it does is a ruling and a feed, not a
               label. That NIAC comes first is the true development order and
               it needed no argument to place.
               THE VIIIp KEEPS ALL SIX OF ITS POSITIONS. M33 records that five
               of them are engraved reveal levers; renumbering must not quietly
               destroy five levers, so it does not. STANDARD — the one feed
               that arms — is channel 3. */
            positions: [
              { id: "niac-1", ch: 1, label: "MGK-NIAC", arms: false,
                why: "This feed is not available." },
              { id: "niac-2", ch: 2, label: "MGK-NIAC", arms: false,
                why: "This feed is not available." },
              /* [P3 2026-08-06] THE READOUT IS STRUCK. MIKE, naming the
                 sentence: "the unit as it stands: boots and updates complete,
                 powered, waiting at the opening prompt."
                 It was the panel narrating what the panel already shows —
                 AT PROMPT is lit, BOOTS + UPDATES DONE is engraved under it,
                 and the latch says FEED ARMED. Three instruments reporting a
                 state and then a sentence reporting the three instruments.
                 Law of Subtraction: nothing is lost that a reader would miss.
                 `drum.line` IS STILL RENDERED (Exhibit.jsx's `ip-readout`) —
                 the field is undeclared, not removed, so a future feed that
                 genuinely needs a readout can declare one. */
              { id: "standard", ch: 3, label: "STANDARD", arms: true },
              /* [CS 2026-08-04] `why` IS PRINTED ON THE PANEL — it is the
                 refusal line under the latch. These five read "held — one
                 entry state (C3)", "held — awaiting a privacy ruling" and
                 "held — workshop entry, by URL": internal decision codes, an
                 unmade ruling, and the existence of an undisclosed URL, all
                 shown to whoever rolls the drum. The instrument now says the
                 one thing an instrument says when a position will not arm. */
              /* ═══ [P5 2026-08-06] THE ENGRAVINGS ARE ENGRAVINGS NOW ═══════
                 MIKE: one entry WRAPS ("off, first boot") and it ruins the
                 effect — and that label makes no sense to a human either.
                 Every position must be DELIBERATELY OBFUSCATED or DRESSED IN
                 PERIOD GARB. Nothing merely awkward.
                 THE DIAGNOSIS IS THAT THREE OF THEM WERE NEITHER. "IDLING,
                 UPD", "BOOT PLAYBK" and "OFF · 1ST BOOT" are not engravings
                 in either register — they are the `id`s below them, truncated
                 until they fitted, which is what a filename looks like and
                 not what a drum looks like. A 1965 selector engraves terse
                 state words, and it engraves them whole.
                 THE MEANING DID NOT MOVE, AND THAT IS THE CONSTRAINT. The
                 `id` is the key the twin reads (`preset` in the URL) and no
                 id changed, so M33's five engraved reveal levers are exactly
                 the five levers they were. What changed is the word cut into
                 the brass: STANDBY is a machine idling after its updates,
                 COLD START is a boot from cold, FIRST RUN is the unit's first
                 one. Each is the period term for the state its id names, and
                 each fits the drum face at one line. */
              /* ═══ [CH4 2026-08-12] CHANNEL 4 HOLDS THE CLOSE-UP ════════════
                 MIKE: channel 4 is a close-up of the MGK-VIIIp; channel 3 is
                 the VIIIp's screen. Channel 3 is `standard` and already opens
                 the twin, so only this position moved.
                 THE `id` IS DELIBERATELY UNCHANGED. It is what the latch puts
                 in the event as `preset` and what a twin URL carries, and P5
                 above records that when these legends were recut NO id moved.
                 Repurposing in place keeps `preset=idling-updated` resolving;
                 renumbering the drum would have moved five engraved levers to
                 add one.
                 WHAT IT COST: STANDBY is off the drum. It was an engraved
                 position that did not arm and held nothing, and the position
                 now holds a photograph — the first one on this instrument.
                 `DETAIL` IS OPS' WORD AND IS ON THE REGISTER (`CH-a`). The
                 engraved legends are Mike's to write (see the `papa` note
                 below); this is the period term for a close view and it fits
                 the drum face at one line, but he has not said it. */
              { id: "idling-updated", ch: 4, label: "DETAIL", arms: true,
                src: "/held/robots/reference/photos/MGK-TWIN_MONITOR_CLOSE_UP.png",
                frameTitle: "MGK-VIIIp — the close-up" },
              { id: "boot-playback", ch: 5, label: "COLD START", arms: false,
                why: "This feed is not available." },
              { id: "off-first-boot", ch: 6, label: "FIRST RUN", arms: false,
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
                why: "no seeded feed on file — the lamps read the seed, " +
                     "and there is nothing to read" },
            ],
          },
          latch: {
            label: "LATCH",
            armed: "FEED ARMED",
            idle: "NOT ARMED",
            event: TWIN.event,
            src: TWIN.src,
            frameTitle: TWIN.title,
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
        { title: "Is the mainframe on the Portal?",
          line: "Not yet. Two channels are engraved for it on the feed " +
                "drum and neither of them arms.",
          note: "" },
      ]),
    },
  ],
};
