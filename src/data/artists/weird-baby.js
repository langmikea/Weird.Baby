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
   matching the approved blurb." Where before the chip said WHEN the file was
   made, it now says WHAT the recording is, which is the fact the sleeve does
   not already carry. `.tl-rend` uppercases, so the row reads FIRST PASS.
   [2026-08-15] The blurb it was matched to — the `About this record` face —
   is deleted on Mike's word, so this chip is the only place the phrase now
   appears. The chip is HIS approved wording and stands on its own; it was not
   derived from the blurb, both came from the same sentence of his. */
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

/* ═══ [2026-08-17] THE FAQ TRACK IS HELD, IN BOTH STAGES ══════════════
   MIKE, walking the live site: **"HIDE the FAQ track. It is empty and Mike has
   no time for it."** He is describing a real state rather than a preference:
   the face declares TWO questions and draws ONE. `How to contact?` carries a
   `[PAPA]` answer, so `scrubFace` drops it in every stage — the consequence of
   his own 2026-08-11 ruling that struck the house address with no replacement
   (`W-b`). A one-question FAQ under its own album row is a menu item promising
   a room.
   UNCONDITIONAL, NOT `HIDDEN_AT_LAUNCH`. That set is the STAGE hold; he said
   hide it, not hide it from visitors — the same reading The Blog got on
   /foundation the same day, and the same mechanism, so the two wings do not
   grow two ways of holding a track.
   THE TRACK IS KEPT WHOLE, AND `W-b` IS CLOSED RATHER THAN WAITING.
   [2026-08-17, his ruling] **The address ruling was never the blocker.**
   `Papa@Weird.Baby` has been purpose-placed in the booth FAQ since 15 August,
   superseding the 11 August sitewide strike — so `How to contact?` can be
   answered here whenever he wants this track back. What is missing is not a
   ruling, it is that the second question is empty. **Do not un-hide the track
   on the strength of the address existing.** */
const HELD_TRACKS = new Set(["wb-faq"]);

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
        /* ═══════════════════════════════════════════════════════════════════
           [2026-08-16] W-a CLOSES. THIS CARD IS MIKE'S OWN WORDS NOW.
           ═══════════════════════════════════════════════════════════════════
           His text, supplied 2026-08-16 and carried VERBATIM. What it replaces
           was Ops' prose, written when nobody had described this artist and
           tracked as a placeholder since 2026-08-14 on his own instruction
           ("Track 1 copy as supplied, placeholder — Mike replaces before
           launch, track it"). NAMED ONCE, HERE (Doctrine 24): the blurb read
           "The house's own music. What this room holds of the artist is the
           recordings; what it holds of the person is his name.", and the one
           register row was "What the museum holds — Six recordings, made in
           June 2026, and one release: The Best of Weird.Baby Vol. 1. They play
           in this room." Both were Ops', both are his to replace, and he has.

           ═══ THREE THINGS WERE FLAGGED TO HIM AND HE FIXED ALL THREE ═══════
           His copy arrived with `Steven's Inst Tech`, `P!NK when to my High
           School` and `Managmeent`, and his own instruction was **"FLAG TO
           MIKE, do not correct… His voice, his call."** They were flagged and
           left as typed; **on 2026-08-16 he ruled all three** and they now read:

             · "Stevens Institute of Technology"   (was "Steven's Inst Tech")
             · "P!NK went to my High School"       (was "when")
             · "Eng Management"                    (was "Managmeent")

           **NOTHING ELSE IN THIS COPY CHANGED — his instruction, and it is the
           part a later round must not soften.** The loop is what matters here
           and it is the reason the flag rule works: Ops does not correct, Ops
           reports, and he rules. The same rule still binds Record 001's `was
           made made` and `=  86%`, which he has NOT ruled on — do not read this
           round as permission to tidy those.

           ═══ WHY IT IS THREE FIELDS AND NOT ONE BLOCK ══════════════════════
           His text has three shapes and the face already has an instrument for
           each, so nothing new was built and nothing was flattened:
             · the opening paragraph      -> `blurb`, the face's lead
             · the four biography lines   -> `lines`, the mono REGISTER, which
               is what a stack of short keyed facts is on every other face in
               the building
             · the two headed blocks      -> `profile` cards, whose label is set
               in the house's mono caps. His headings are carried with his own
               punctuation, colon and all: "ACHIEVEMENTS:" has one and "CURRENT
               PROJECTS" does not.
           HIS WRAPPING IS NOT A PARAGRAPH BREAK. The four achievements arrived
           wrapped across two or three lines each; each is ONE paragraph and is
           one string. Splitting on the newline would have invented paragraphs
           he did not write — the same reading the Foundation's FAQ took on
           2026-08-13, applied again rather than re-decided.
           THE BLANK LINE BETWEEN THE ACHIEVEMENTS IS HIS AND IT DRAWS, on
           `white-space: pre-line` (Exhibit.css) — the house's one answer to
           what a newline the writer typed means, which the booth's answers, the
           Record's deck and the Record's section bodies already run on.

           A CARD WITH NO LABEL WOULD HAVE VANISHED, AND THAT IS WHY THE
           BIOGRAPHY IS `lines`. `scrubFace` filters profile cards on
           `kept(label) && kept(body)`, and `kept(null)` is false — so a card
           carrying his four bio lines under no heading would have been dropped
           in silence. Inventing a heading for them was the other way out and it
           is Ops writing on the one card whose whole point is that it is his.
           ═══════════════════════════════════════════════════════════════════ */
        /* ═══ [2026-08-17] THE CARD IS REBUILT ON HIS WALKTHROUGH ═════════
           Three rulings, and the words are still his:
             1. the biography moves out of the prose into a FACT GRID, the
                two-column label/value pattern the other artists use;
             2. first person becomes third — "my High School" -> "Papa
                Weird.Baby's High School" — **pronouns only, voice untouched**;
             3. each achievement gets its own tile: P!NK, Steven Tyler, Rod
                Stewart, Hunter Root.

           THE FACT GRID IS `tombstone`, WHICH IS THE PATTERN HE POINTED AT.
           His reference was Mikey Mike's card (From / Based / Known for / Also
           / Publishing / Albums / Filed under), and that is `tombstone` — the
           same `{k, v}` list every artist in /wal carries. Nothing new is built.
           **THE LABELS ARE OPS’ AND THE VALUES ARE HIS, TO THE CHARACTER.** He
           asked for the label set to be proposed from his facts and for no fact
           to be invented, so every `v` below is a line he wrote, unedited, and
           every `k` is a word Ops chose to name it. `School` and `Studied` are
           the two calls worth arguing with; his four lines are a birth date, a
           school with its town, and two universities with a year and a subject
           each. **`Studied` appears TWICE on purpose** — he listed two
           institutions and no degree level for either, and inventing
           "Undergrad"/"Postgrad" would be Ops asserting a fact about his
           education that he did not state.

           THE BIOGRAPHY LEAVES THE BLURB, WHICH UNDOES A COMPROMISE THIS FILE
           RECORDED ON 2026-08-16. It was in the lead only because `lines` — the
           mono register — draws ~350 lines BELOW `profile` in the renderer, so
           the register would have put his biography under his achievements. The
           GRID HAD EXACTLY THE SAME PROBLEM, AND THIS TIME IT WAS FIXED IN THE
           RENDERER RATHER THAN WORKED AROUND AGAIN. Measured on the built page
           after the first attempt: blurb → `.vp-prof` → `.vp-tomb`, so his
           biography landed under his achievements, precisely as `lines` had.
           **The ORDER moved instead of the content**: `profile` now draws below
           `tombstone` (Exhibit.jsx). That is safe for one measured reason —
           `profile` is declared by EXACTLY ONE FACE in the museum, this one,
           while `tombstone` is on every /wal artist and on the robots wing. The
           block with one caller is the one that can be moved. His order
           survives and the 08-16 compromise is gone.
           **THIS PARAGRAPH ORIGINALLY CLAIMED `tombstone` DREW ABOVE `profile`
           AND THAT WAS WRONG.** It was an assumption written as a fact, and the
           page contradicted it inside a minute. Kept as a correction rather
           than silently rewritten, because the same assumption is what cost the
           previous round its workaround.

           FOUR TILES, LABELLED WITH THE FOUR NAMES HE NAMED. **The word
           ACHIEVEMENTS no longer appears on the card**: `profile` has no group
           heading, and four tiles cannot sit under one label without inventing
           a container. Flagged for him. */
        /* ═══ [2026-08-16] AND HIS REWRITE LANDS. THE STRUCTURE ABOVE IS
               UNCHANGED; EVERY STRING BELOW IS REPLACED ════════════════════
           **His rewrite had been briefed and never sent, so the old copy was
           live.** What it replaces was HIS OWN earlier text plus Ops' pronoun
           work on it, and it is named once here (Doctrine 24) and nowhere else:
           the grid read `Born 7/3 63` · `School CB West Doylestown, PA` and the
           two `Studied` rows carried `'85` and `'00`; the tiles read *"Rumor
           has it she had his old locker. At least that's the rumor he's
           spreading."*, *"Steven Tyler \"handed him\" his personal harmonica"*,
           *"He hopes that is OK."*, *"(Two at once?!? He panicked.)"* and
           *"Learning to play acoustic guitar…"*.

           **THE 2026-08-17 PRONOUN PASS IS GONE WITH THE SENTENCES IT ACTED ON,
           AND SO IS ITS NOTE.** Eight substitutions and a cut `"Sorry,"` were
           recorded above; every one of them was on a string that no longer
           exists. **A note that outlives its examples is a tripwire pointing at
           empty ground** — the same defect this file's own preamble was
           corrected for on 2026-08-17. His new copy is third person as he wrote
           it, start to finish. **Ops changed no word of it.**

           TWO THINGS ARE FLAGGED AND NOT CORRECTED, which is the standing loop
           on this card — Ops reports, he rules:
             1. **`is earning to play`** reads as `learning`. His instruction
                names this one explicitly. Carried as typed.
             2. **`Born  |  Born July 3, 1963`** — the value repeats the label,
                so the grid prints the word twice. His two columns as supplied;
                Ops will not drop a word to tidy a row.

           `Class of 1981` IS NEW MATERIAL AND SO ARE THE FOUR-DIGIT YEARS. The
           grid is longer than it was and that is his copy, not a layout change.
           **The labels are still Ops' and the values are still his to the
           character**, and `Studied` still appears twice for the reason the
           2026-08-17 note gives: he named two institutions and no degree level
           for either. `School` becomes `High School` because his own value now
           says which school it is. */
        face: {
          kind: "text",
          title: "About the artist",
          subtitle: "WEIRD.BABY",
          /* ═══ [2026-08-16] THE HYPHEN IN `Melodic‑Talker` IS U+2011 AND THAT
                 IS THE WHOLE OF THE FIX — MIKE: "Do not break Melodic-Talker
                 across lines." ════════════════════════════════════════════
             MEASURED FIRST, because the instruction is about a result and the
             result had to be shown to be wrong: at 1280px a Range over the word
             returned TWO client rects at different `top` values — `Melodic-` on
             one line and `Talker` on the next. A browser treats U+002D as a
             break opportunity, and no CSS property turns that off for one word
             inside a paragraph; `white-space:nowrap` needs an element, and this
             field renders as plain text with no markup.
             SO IT IS ONE CHARACTER: U+2011 NON-BREAKING HYPHEN, which is the
             code point that exists for exactly this and draws identically. The
             word on the glass is unchanged.
             **AND IT BREAKS `grep`, WHICH IS WHY THIS NOTE IS LOUD.** Searching
             this repository for `Melodic-Talker` with an ordinary hyphen now
             returns NOTHING. Search for `Melodic` alone. The same trap applies
             to anything that ever matches this string — a provenance row, a
             numbers gate, a copy audit. */
          blurb:
            "Papa Weird.Baby (aka Mike Lang) is an Indie Melodic‑Talker who "
            + "relies on sloppy-guitar and mournful lyrics to decry the plight "
            + "of the homeless. And some funny stuff, too. And Robots!",
          tombstone: [
            /* [2026-08-16] FLAGGED, NOT CORRECTED: the value repeats the label,
               so this row prints "BORN  Born July 3, 1963". His two columns as
               supplied. */
            { k: "Born", v: "Born July 3, 1963" },
            { k: "High School", v: "CB West - Doylestown, PA - Class of 1981" },
            { k: "Studied", v: "Stevens Institute of Technology - Hoboken NJ - 1985 Mech Eng" },
            { k: "Studied", v: "NJIT Newark, NJ - 2000 Eng Management" },
          ],
          profile: [
            { label: "P!NK",
              body:
                "P!NK went to Papa Weird.Baby's High School - Central Bucks "
                + "High School West. Rumor has it she had his old locker (at "
                + "least that's the rumor Papa Weird.Baby is spreading)." },
            { label: "Steven Tyler",
              body:
                "Steven Tyler gave his harmonica to Papa Weird.Baby from the "
                + "stage in Las Vegas, NV Feb 2020. Then Steven tried to get "
                + "Papa Weird.Baby to say something into the mic during the "
                + "show. (It was not pretty. Papa Weird.Baby panicked.)" },
            { label: "Rod Stewart",
              body:
                "Rod Stewart kicks soccer balls into the crowd each show. Papa "
                + "Weird.Baby caught one with Rod's name written on it; must be "
                + "his personal ball. Papa Weird.Baby will return it if he "
                + "meets up with Rod someday." },
            { label: "Hunter Root",
              body:
                "Hunter Root and Papa Weird.Baby hung out behind the bar "
                + "Hunter was playing that night. Burned some time out back "
                + "with the band. (Why two at once? Because Papa Weird.Baby "
                + "panicked.)" },
            { label: "CURRENT PROJECTS",
              body:
                /* [2026-08-16] FLAGGED, NOT CORRECTED, on his own instruction:
                   "is earning" reads as "learning". Carried as typed. */
                "Papa Weird.Baby is earning to play acoustic guitar and sing, "
                + "in order to record the songs he just wrote, so he can "
                + "release the album he announced. And Robots." },
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
      /* ═══ [2026-08-15] `About this record` IS DELETED, AND THE WORD CAME ═════
         M (2026-08-14) kept this row at position 3 rather than read it out of
         existence by inference, and said so: "Raised in the round log; one word
         removes it." Mike gave the word — its job is done. The album is the two
         rows he named: About the Artist is 1, FAQ is 2.
         WHAT WENT WITH IT: the last face on this wing carrying the release's
         name, and its one profile line. Nothing else on the album moved — the
         two surviving rows are untouched, and `vol1` below is unaffected, having
         given this row up on 2026-08-13 and gained nothing back.
         Five register rows went stale with it and were pruned in the same
         commit; none of them anchored a RESTATED chain (checked before the
         prune, per §9's procedure). */
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
         a track on Album B."** The reason it was parked here — that the other
         album was hidden at launch — went with the hold, in the same
         instruction. **[2026-08-15] AND IT IS NOT ON ALBUM B EITHER: Mike ruled
         the row deleted outright. Nothing anywhere holds this face now.**
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
  /* [2026-08-17] the TRACK hold runs in both stages and is applied first; the
     ALBUM hold is the stage's. See HELD_TRACKS above. */
  spine: (launched() ? spine.filter(a => !HIDDEN_AT_LAUNCH.has(a.id)) : spine)
    .map(a => ({ ...a, tracks: a.tracks.filter(t => !HELD_TRACKS.has(t.id)) })),
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
