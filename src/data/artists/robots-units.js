// src/data/artists/robots-units.js
/* ===========================================================================
   THE TWO MACHINES, HELD.  [2026-08-17]
   ---------------------------------------------------------------------------
   **MIKE, on the live site the night the wing opened: "TAKE MGK-NIAC AND
   MGK-VIIIp DOWN. Urgent."**

   ROOT CAUSE, IN HIS WORDS: **"neither unit was ever held on its own condition.
   They were invisible only because the wing was hidden. A hold that depends on
   another thing's hold is not a hold."** `/robots` was shut by `ROBOTS_OPEN` in
   `src/App.jsx`, derived from the Record having an entry. When Record 001 posted
   at 00:00 the wing opened and both machines walked through the door with it:
   three covers in the carousel, live arrows, both units one click away.

   ═══ WHY THE ALBUMS MOVED FILE RATHER THAN GAINING A FLAG ══════════════════
   The first cut was a `HELD_ALBUMS` filter in `robots.js` -- the shape The Blog
   and /wb's FAQ carry, which is the shape Mike named. **The ledger refused it,
   and the ledger is the arbiter he named in the same instruction:** *"A HIDING
   RULING IS NOT DONE UNTIL A LEDGER ROW MOVES."*

   `reveal/reachability.mjs` rule 5, on all nine rows at once:

       built, HELD, and carried by `src/data/artists/robots.js` -- which is NOT
       in `HELD_PATHS` (vite.config.js), so its code and every string in it ship
       in a chunk the public fetches. A boolean in a public module stops the
       render and publishes the material anyway.

   So the two halves of his instruction could not both be satisfied by a filter:
   the row could not move while the material sat in a public module. **This is
   the Portal's arrangement, applied to the machines** -- `vite.config.js` parks
   this file under `assets/held/`, `src/worker.js` refuses that directory without
   the cookie, and nothing public imports it.

   ═══ NOTHING IMPORTS THIS FILE, AND THAT IS DELIBERATE ═════════════════════
   The Portal is spliced back in by `Robots.jsx` when `/admin` has been opened,
   because Mike asked to keep developing it. **These are held from Mike too** --
   his words -- so there is no door and no splice. The albums are whole and
   unedited, exactly as they came out of `robots.js`; returning either one is an
   import and a splice, and nothing else.

   THE ONE THING THAT CAME WITH THEM is `FAQ_BUY_ONE`, which both machines'
   FAQs read and nothing else in the wing does. It left `robots.js` with them,
   so its string leaves the public chunk too.

   THE PORTAL IS NOT DISTURBED. Its album is still `portal.js`, still spliced at
   `PORTAL_AT`, and still lands second: the splice clamps to the spine's length,
   and the public spine is now one album long.
   =========================================================================== */
import { placed, placedPresets, placedTiles } from "../../lib/placement.js";
import { faqFace } from "../faq-face.js";

/* [B 2026-08-13] carried across from robots.js with the two albums that read
   it -- it was typed once for both machines there and is typed once for both
   machines here. Nothing else in the wing used it. */
const FAQ_BUY_ONE =
  "No. The shop carries what the shop carries; the machines " +
  "are not stock.";

/* The two album objects, byte-for-byte as they stood in the public spine.
   `UNITS_AT` is where they sat: immediately after the Portal's position, which
   is where they go back if either is ever returned. */
export const UNITS_AT = 2;
export const UNIT_ALBUMS = [
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
       note above the MGK-VIIIp album's `art` for the whole ruling. It closes
       register M30: the badge used to be the same photograph as the still on
       the face one press down, and the two now carry different plates.
       [K1 2026-08-07] TWO SENTENCES OF THIS NOTE WERE FALSE AND ONE OF THEM
       HAD BEEN FALSE SINCE P7. It said the badge is `core_helical.jpg` and
       still a DETAIL because the museum holds no photograph of the machine
       whole — P7 replaced it with `cabinet_whole.jpg`, which IS that
       photograph, cut from the 2021 build video at the cabinet's own bounding
       box, and D5 made it ride the ring whole rather than as a crop. It also
       cited `parts_drawer.jpg` as the standing precedent for keeping a
       superseded photograph on disk. Mike killed that file, and nine more,
       and the manual's title page. THE PRECEDENT IS NOT REVERSED — *a real
       photograph this museum owns is not deleted on OPS' word* is exactly
       what it always said, and this was not Ops' word. Register M9 closes. */
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
       limbs. That is the robot, so it is gone from here. The poster is the one
       plate in the set that reads as A MACHINE DOING SOMETHING without showing
       an operator doing it. It is also a tile of the archive below, named here
       rather than left unremarked, the way the VIIIp album names the family
       shot's double duty.
       [CH4 2026-08-12] AND IT IS `output_row.jpg` NOW, BECAUSE THE MELTDOWN IS
       DELETED. Mike ruled `core_meltdown.jpg` gone with three other mainframe
       plates; `placed()` would have handed this album a live address for a file
       that is not there, which is a broken poster rather than a missing one.
       OUTPUT_ROW IS THE ONLY MAINFRAME PHOTOGRAPH LEFT, so the choice was it or
       nothing, and R4's sentence above still describes it — the bar bank
       mid-pattern is the machine doing something with no operator in frame.
       THE CAPTION IS RESTATED FROM THE TILE'S OWN LABEL and not written fresh:
       the wall has called this picture "the red bar bank at the base,
       mid-pattern" since it was hung. Register `CH-c`. */
    viewerPoster: placed("/robots/reference/mgk-viii/output_row.jpg"),
    viewerPosterCaption:
      "MGK-NIAC, the output row mid-pattern.",
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
           it is register row N-c rather than a silence.

           ═══ [N2 2026-08-06] AND THE SHEET WAS A SPEC SHEET FOR THE WRONG
               MACHINE ══════════════════════════════════════════════════════
           MIKE, as a global standard: **"Technical Specifications means THE
           IN-STORY SPECS, NEVER THE REAL ONES."** Doctrine 18.

           THE PARAGRAPH ABOVE IS THE CONFESSION, WRITTEN BEFORE ANYBODY ASKED.
           *"Every figure, rule and caveat was already on this face; the change
           is FORM"* — true, and the form it was converted INTO is the one that
           made the problem legible. Set as prose, `Uno R4 WiFi` and
           `2026-02-23` read as the museum talking about the prop it built. Set
           as a SPEC SHEET under a heading reading MGK-NIAC, they read as the
           machine's own particulars — and the machine's own particulars, in
           this fiction, are an ABEAL engine carrying a compile date of 1945.
           A one-sheet is the thing you grab when you ask what it does
           technically, and this one answered for an Arduino.

           STRUCK, BY NAME:
             · BOARD    — a part number of the 2026 flagship revival.
             · PROGRAM  — a version, a calendar date and a count of LINES OF
                          SOURCE. Three real-build facts in one row.
             · STATUS   — `pre-thermal-validation` is a state of a workshop.
             · BENCH    — eight sketches in January 2026. The bench is real and
                          it is not in the story.
             · LAMPS    — struck WHOLE rather than stripped of its caveat, and
                          the note above is the reason: the 32-flash cap is a
                          limit of the bench BOARD, so a row keeping the number
                          and dropping *"a bench limit on a bench board"* is
                          precisely *how a spec sheet starts lying*. The caveat
                          could not be saved without the fact it qualifies, and
                          the fact is not this machine's.
             · DECLARED — keeps the five rules and loses *"in the header, above
                          the first include"*, which is a fact about a FILE.

           WHAT SURVIVES IS NINE ROWS AND EVERY ONE OF THEM DESCRIBES THE
           OBJECT: two displays, an output census, and five declared rules of
           behaviour a 1965 selector could have been sold with. NOTHING WAS
           WRITTEN TO REPLACE WHAT WENT — the in-story specification for this
           unit exists (the robots repo's manual work, Section II) and porting
           it is authoring, which is not Ops'. Register row N-g.

           `npm run instory` is the gate, and it fails on any of the six. */
        face: {
          kind: "text",
          title: "Technical Specifications",
          subtitle: "MGK-NIAC",
          lines: [
            "MATRIX   8 × 16 — seven rows visible, the eighth wired, driven and behind something",
            "BAR      1 × 64, addressed as a single chain",
            "OUTPUTS  2 matrix chains · 2 bar chains · 3 servos",
            "DECLARED five rules",
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
          /* ═══ [CH4 2026-08-12] FOUR GROUPINGS BECAME ONE PICTURE ═══════════
             MIKE DELETED FOUR OF THIS WALL'S FIVE PLATES — cabinet_whole,
             core_helical, column_lit and core_meltdown. `output_row.jpg` is
             the whole of the mainframe's photography now.
             IT IS `collage` AND NOT `presets`, AND THAT IS THE BUG THIS ROUND
             NEARLY SHIPPED. `placedPresets()` drops an emptied grouping by
             itself, so the deletions would have left "Running, and in trouble"
             and "Every photograph" — TWO buttons over the SAME single tile,
             which is a choice that isn't one. Cutting it to a lone preset is
             worse and silently: `ArchiveWall` only takes the preset path at
             `length > 1`, and one preset falls through to `archiveSpreads()`,
             which reads `spreads`/`collage` and has never read `presets` — so
             the wall would have found nothing, printed `archiveEmpty`, and told
             a reader NO PHOTOGRAPH IS ON THE WALL while holding one.
             SO THE SHAPE FOLLOWS THE HOLDINGS. One picture is a collage of one:
             it draws, it draws no filter strip, and if this last plate ever
             goes `placedTiles` empties the array and `archiveEmpty` prints —
             which is then TRUE. The groupings come back with the pictures. */
          collage: placedTiles([
            { img: "/robots/reference/mgk-viii/output_row.jpg",
              href: "/robots/reference/mgk-viii/output_row.jpg",
              label: "The output row — the red bar bank at the base, mid-pattern",
              date: "MAR 2021" },
          ]),
          archiveEmpty:
            "No photograph of the mainframe is on the wall. The museum holds " +
            "images of this machine and the Record has not brought any of " +
            "them into the story yet.",
          footer: "MGK-NIAC · IMAGE ARCHIVE",
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
           [CH4 2026-08-12] THE TWO SENTENCES HERE ABOUT `column_lit.jpg` ARE
           STRUCK: Mike deleted that plate, and they said it was "still a tile
           on the wall above", which stopped being true the moment he did. This
           face has carried no still since F1 below, so nothing renders either
           way — but a comment that names a deleted file as present is exactly
           the rot K1 found twice in this album already.
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
           the booth's shape has neither.
           [CH4 2026-08-12] the clause that followed said the plate was "still a
           tile on this album's own Image Archive". It is not: Mike deleted the
           file, and that wall is one photograph now. */
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
         AND IT ORPHANED A PHOTOGRAPH, WHICH IS NOW ANSWERED.
         `/robots/reference/mgk-viii/parts_drawer.jpg` was referenced by nothing
         after this face left — a real photograph the museum owned, so N1 would
         not delete it on Ops' word, would not re-home it onto a wall whose
         groupings count their plates, and made it a register row for Mike
         instead (C-a). [K1 2026-08-07] HE ANSWERED IT, AND THE ANSWER IS KILL:
         *"none are very good, and if that view is ever needed it gets
         reshot."* The file is gone with the other nine operator plates. What
         the face itself took with it when it went is still named above, and
         that half is still not recoverable from anything else in the wing. */
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
          /* ═══ [N2 2026-08-06] THE REGISTER AND THE ON FILE ENTRY ARE STRUCK,
                 AND THIS FACE IS THE HARDER HALF OF THE RULING ══════════════
             MIKE, as a global standard: **"Technical Specifications means THE
             IN-STORY SPECS, NEVER THE REAL ONES."** Doctrine 18.

             THE PREVIOUS ROUND LEFT THIS FACE ALONE ON A SCOPE ARGUMENT — the
             note above says so in its own words, *"he did not read it this
             round"*, and reported the two faces' divergence as M92/N-f rather
             than resolving it. **The standard is global, so the scope argument
             is spent** and the divergence resolves in the direction nobody
             chose: BOTH faces lose their real-build register.

             WHAT WENT, BY NAME:
               · the four register lines — TREES, PRIMARY, SECOND, FORM. Two of
                 them are literal source-tree FILENAMES carrying the real dates
                 2024-07-21 and 2026-07-24, and a third names `.ino` modules.
                 There is no version of these rows that is about a 1965 unit.
               · the ON FILE entry, whole. Its subject is a repository — *"both
                 trees are checked in and named exactly as they are on disk"* —
                 and its honest half (*what is NOT here is a reading of them*)
                 is a statement about Ops' work, which Doctrine 11 does not ship
                 either. It failed two laws at once and only one of them is new.

             WHAT SURVIVES IS THE SUBJECT, WHICH WAS NEVER THE PROBLEM: the
             blurb, the lit glass, and the WHY entry — none of which names a
             file, a board or a year. **AND THE FACE NOW CARRIES NO
             SPECIFICATIONS AT ALL**, which is the true state and is register
             row N-h rather than a silence: the in-story specification for this
             unit is drafted (the robots repo's Section II, two tables' worth)
             and **six of its rows are sourced from the real firmware**, so the
             supply is contaminated at the same seam. Porting it is authoring
             and it is not Ops'.

             THE `[PAPA]` MOVES RATHER THAN DYING WITH ITS ENTRY. It marks a
             POSITION — the artifact slot is Mike's to name — and the position
             outlived the sentence it was attached to, so it is `face.papa`,
             which is the field built for exactly that. Under N3 it now prints
             in red on this face during development. */
          entries: [
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
          /* ═══ [2026-08-11] NINE SLOT LABELS ARE OUT OF THE DATE POSITION ═══
             MIKE: they "are not dates at all — they are slot labels reading
             FRONT, SCREEN, BEZEL, TOP, BASE, REAR, COVER, printed where a date
             goes."

             HE IS DESCRIBING A FIELD MISUSE RATHER THAN A WRONG VALUE. A tile's
             `date` prints in `.vp-collage-date` — Courier Prime, letter-spaced,
             above the caption — which is the museum's own register for a
             provenance stamp. `FRONT` set in that face does not read as a
             label; it reads as a date the reader cannot parse.

             THE FIELD IS DELETED RATHER THAN CORRECTED, AND NOTHING IS LOST:
             every one of the nine already said the same thing in words directly
             underneath it — `FRONT` over "The front, whole", `SCREEN` over "The
             front glass, lit", `BEZEL` over "The bezel around the glass". The
             caption strip is conditional on there being something to print
             (A7), so the line simply does not draw. If a real capture date is
             ever known for these, `date` is where it goes.
             THE MAINFRAME'S WALL IS UNTOUCHED: its five tiles carry MAR 2021,
             which IS a date. Whether it is the right one on a wing whose story
             begins in 2026 is a question about the story, and it is Mike's. */
          presets: placedPresets([
            /* [CH4 2026-08-12] FOUR TILES CAME OFF THIS WALL. `front_full.png`,
               `monitor_base.png` and `unit_new_base.png` are Mike's deletions;
               `rear_power_switch.png` went with Record 013, which was the entry
               that delivered it. Nine photographs became five.
               THE GROUPINGS SURVIVE HERE AND DID NOT ON THE MAINFRAME, and the
               difference is only arithmetic: the strip is still a choice.
               "As they arrived" and "Above and below" are down to one
               tile each and are KEPT — a grouping of one is still a true
               statement about the holdings, and `placedTiles` will drop either
               of them by itself the day its last picture goes.
               [J5 2026-08-13] A FIFTH TILE CAME OFF, AND THE ARITHMETIC IN THIS
               COMMENT WENT WITH IT. It used to read *"'The glass' is untouched
               at three and 'Every photograph' still holds five"* — both numbers
               are now wrong, because Mike ruled `MGK-TWIN_MONITOR_SCREEN_BEZEL.png`
               DISCARDED: it is the Portal CRT's bezel, used in CONSTRUCTING the
               original portal, not UX as a standalone, and he makes the overlays
               himself. "The glass" is two and "Every photograph" is four. The
               counts are deleted rather than re-stated, because a hand-kept
               tally in a comment is a thing that goes stale every time a tile
               moves — which is exactly what happened here. */
            { id: "arrived", label: "As they arrived", tiles: [
              { img: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png",
                href: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png",
                label: "The pair, front and top, as received" },
            ] },
            { id: "glass", label: "The glass", tiles: [
              { img: "/robots/reference/photos/front_screen.png",
                href: "/robots/reference/photos/front_screen.png",
                label: "The front glass, lit" },
              { img: "/robots/art/viiip-v2.png",
                href: "/robots/art/viiip-v2.png",
                label: "The cover image — the glass carries the BIOS beat" },
            ] },
            { id: "stand", label: "Above and below", tiles: [
              { img: "/robots/reference/photos/top_monitor.png",
                href: "/robots/reference/photos/top_monitor.png",
                label: "The top monitor" },
            ] },
            { id: "all", label: "Every photograph", tiles: [
              { img: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png",
                href: "/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png",
                label: "The pair, front and top, as received" },
              { img: "/robots/reference/photos/front_screen.png",
                href: "/robots/reference/photos/front_screen.png",
                label: "The front glass, lit" },
              { img: "/robots/reference/photos/top_monitor.png",
                href: "/robots/reference/photos/top_monitor.png",
                label: "The top monitor" },
              { img: "/robots/art/viiip-v2.png",
                href: "/robots/art/viiip-v2.png",
                label: "The cover image — the glass carries the BIOS beat" },
            ] },
          ]),
          archiveEmpty:
            "No photograph of the portable is on the wall. One picture of " +
            "this machine is on the Record, with the entry that brought it in.",
          footer: "MGK-VIIIp · IMAGE ARCHIVE",
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

/* one id out of one array is the whole of a return, which is the property the
   holding shape was chosen for. */
export const UNIT_IDS = UNIT_ALBUMS.map(a => a.id);
