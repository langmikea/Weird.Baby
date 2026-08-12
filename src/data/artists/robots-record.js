/* ===========================================================================
   THE RECORD — the entries, and NOTHING ELSE.
   ===========================================================================

   [M1 2026-08-11] MIKE RULED THE SPLIT SO THAT THE LANDER COULD WRITE. Every
   Record he dictates used to end in a hand-paste into `robots.js`, a
   2,207-line module carrying four albums, eleven faces and the wing's whole
   standing reasoning — step four of eight, and the one that stood in his way.
   A tool may rewrite THIS file wholesale (`npm run record:land -- --write`)
   because there is nothing else in it to damage.

   IT IS A PURE MOVE. Every entry, every field and every comment below arrived
   from `robots.js` lines 433-799 byte for byte — not reworded, not reordered,
   not re-indented. The indentation is the twelve spaces it had inside
   `entries: [`, kept exactly so that "pure move" is a claim a diff can check
   rather than a claim you have to trust.

   WHAT THIS FILE MAY NOT GROW: a helper, a derived value, a second export.
   `RECORD_ENTRIES` is the array and that is all, because the writer's guard
   proves the file by parsing it back and a file with logic in it cannot be
   proved that way.
   =========================================================================== */

/* [CH4 2026-08-12] THE `placed` IMPORT IS GONE WITH RECORD 013. It existed for
   exactly one line — 013's `still: placed("/robots/…/rear_power_switch.png")` —
   and 013 is deleted, so the import is unused and `no-unused-vars` fails on it.
   IT COMES BACK THE DAY AN ENTRY DELIVERS A PICTURE AGAIN, and it comes back by
   itself: `emit-record-entries.mjs` restores this line whenever it emits a
   `placed(` call, because the lander splices only between `RECORD_ENTRIES = [`
   and the closing bracket and would otherwise leave a call to an undefined
   identifier in a file that parses clean. */
import { recordDay } from "./record-epoch.js";

export const RECORD_ENTRIES = [
            /* ==== [S2 2026-08-07 · REBUILT 2026-08-08] RECORD 001 ===========
               B2 ruled the volume: "013 was a PROTOTYPE ... It is NOT day one
               and needs no re-dating or defending. THE REAL RECORD STARTS AT
               001 when Mike dictates it." This is 001, and on 2026-08-08 he
               dictated it — the executive summary and the detailed report that
               S2 could not find in any tree.

               IT SITS ABOVE 013 IN THE ARRAY AND BELOW IT ON THE PAGE, and that
               is one decision rather than two. The entries stay in the order
               they happened (see `entriesMode:"log"` above, which reverses at
               render), 001 is the lower number and therefore the earlier entry,
               and the Record still opens on the most recent thing in it.
               Nothing about 013 moved — not its number, not a word of it.

               ==== EVERY WORD BELOW IS HIS, AND THE PARAPHRASE IT REPLACES IS
               GONE RATHER THAN KEPT BESIDE IT ==================================
               S2 shipped eight beats in Ops' register voice — "15:00 · SERVER
               PUBLIC", "16:13 · REACT CONVENED" — built from a parenthetical
               summary of a timeline nobody had sent. His own text arrived on
               2026-08-08 and SUPERSEDES them: the eight Ops strings are deleted
               from this file and pruned from the register, because printing
               both would put two accounts of one afternoon on one page and
               invite a reader to reconcile them.

               VERBATIM MEANS VERBATIM, AND THREE THINGS IN IT LOOK LIKE ERRORS
               AND ARE KEPT. They are named here so no later round "tidies" one:
                 · "a clean hand-off was made made" — his doubled word, kept on
                   his explicit instruction.
                 · "Incoming data =  86% vs threshold" — TWO spaces after the
                   equals sign, his, kept in the data. HTML collapses runs of
                   whitespace, so the glass shows one; that is the renderer, not
                   an edit, and it is reported rather than papered over.
                 · "auto containment. and auto alerts" — a full stop mid-clause
                   followed by a lower-case "and". His. Flagged to him, not
                   fixed.
               Nothing else was touched: not the hyphens standing in for dashes,
               not "50x", not the order, not the paragraphing.

               THE `line` LANDED ON 2026-08-08 AND IT IS THE ONE STRING IN THIS
               ENTRY THAT IS NOT HIS. Everything else here is verbatim; this is
               not, and it is marked so in three places rather than one — here,
               in the provenance register (RESTATED, resolving to the two MIKE
               rows it restates), and in the round log. The previous round left
               the row empty because his executive summary is 477 characters
               against a 130-character budget and PICKING one of his sentences
               would have been an edit. Ops did not pick one; Ops drafted a
               sentence and Mike approved it, which is a different act and is
               the only one that was ever available. 104 characters, inside
               RECORD_LINE_MAX. **Do not let a later round re-mark this MIKE**:
               a paraphrase filed as his words is indistinguishable, a week
               later, from something he said.

               AND IT DRAWS IN TWO PLACES, WHICH IS THE HOUSE'S OWN MODEL AND IS
               NAMED HERE BECAUSE IT WAS NOT ASKED FOR. `RecordEntry.jsx` renders
               `entry.lead || entry.line` as the lead paragraph, so this sentence
               is both the index row's summary AND the lead above his EXECUTIVE
               SUMMARY heading. That is what a lead is for — the one paragraph
               that survives being read alone — and it condenses his three rather
               than competing with them, so nothing was built to suppress it.
               One word from him reverses it either way. OPEN_ACTIONS I-a.

               WHAT IS STILL ABSENT, AND WHY IT IS NOT OPS PROSE:
                 · no `lead` — `lead` renders one paragraph. His summary is
                   three, and flattening them is the same edit by another route.
                   The section keeps all three, in order. **[D2 2026-08-08] AND
                   THE `line` NO LONGER STANDS IN FOR IT.** For one round the
                   renderer's `lead || line` fallback printed the index sentence
                   as this entry's opening paragraph, above his own EXECUTIVE
                   SUMMARY heading. Mike ruled it out — *the index sentence
                   prints once, in the index* — so `RecordEntry.jsx` renders
                   `lead` and only `lead`. This entry therefore opens on his own
                   heading, which is what it should always have done. I-a.
                 · no `tomb` — he wrote no closing line and Ops will not invent
                   the place the lights go off.

               **[D1 2026-08-08] IT HAS A DATE NOW AND IT IS A REAL ONE.**
               `date: RECORD_EPOCH` — 2026-08-17, Mike's, pending the launch
               happening that day. The rule above it is the standing one, at the
               head of this file: *an entry's date is the actual calendar day it
               is published, not a fictional offset.* What it turns on, measured
               rather than assumed (round log §1): the register stamp prints
               `17 AUG 26`, the dateline becomes `Week 1 · Monday · Record 001`,
               and `C8` closes. What it does NOT turn on is the month band —
               `shouldBand` needs fourteen entries across more than one month and
               this volume holds two, so `C1` is unmoved and says so.

               DOCTRINE 11 IS SETTLED HERE AND NOT RE-ASKED. S-a asked whether
               this report is an event in the story or a real report about
               building this website. MIKE RULED IT AS A GENERAL RULE, not as an
               answer about one entry: "EVERYTHING IN THE FORM IS STORY. The
               worksheet is a story instrument, not a project log — in-story
               always." That is OPERATIONS.md §7 Doctrine 21; no future entry
               arriving through the dictation instruments needs this question
               asked again. Source for every MIKE row below:
               `docs/MUSEUM_RECORD_001_LOG-20260808.md` §0, which quotes the
               dictation in full.

               THE TWO LABELS ARE HIS OWN HEADINGS, stored in his capitals.
               `.vp-rec-sect-label` is `text-transform:uppercase`, so the glass
               is identical whichever case sits here — which makes his the free
               choice and therefore the right one. */
            { no: 1,
              date: recordDay(1),
              title: "INITIAL LAUNCH REPORT - Weird.Baby",
              /* ═══ [2026-08-10] THE DECK IS HIS, AND THE OPS SENTENCE IS GONE
                 RATHER THAN CARRIED ═══════════════════════════════════════════
                 This field held a sentence OPS drafted and Mike approved on
                 2026-08-08, filed RESTATED because approval is not authorship.
                 He has now dictated the deck himself, so the drafted sentence is
                 DELETED and its RESTATED row is pruned — a restatement of two
                 paragraphs that no longer exist resolves to nothing, and keeping
                 it beside his own words would be two decks for one entry.
                 THE CLASS MOVES WITH THE WORDS: MIKE, not RESTATED, and it
                 carries no `r` because it restates nothing — it is the thing
                 itself.
                 TWO LINES, AND THE `\n` IS LOAD-BEARING. Mike's ruling: the deck
                 is always two lines and never wraps. `white-space: pre-line` on
                 `.vp-rec-sum` makes the break real; before 2026-08-10 this
                 character collapsed to a space and the deck ran as one
                 paragraph. Measured at 390px against a 339.69px column: line one
                 26 characters / 177.90px, line two 46 / 329.11px. The budget is
                 46 characters and line two is exactly on it, with 10.58px of
                 slack — an em dash is 5px wider than a hyphen, so swapping the
                 punctuation is not free. */
              line: "Weird.Baby website is live\n" +
                    "Alert — Incoming Email Server Load (contained)",
              /* [2026-08-10] HIS DICTATION, TYPOS CORRECTED ON HIS OWN
                 INSTRUCTION — which is the one difference from the 2026-08-08
                 landing, where three things that looked like errors were kept
                 because he ruled them his. This text supersedes that one whole.
                 FIVE SECTIONS. The three ADDENDUM blocks are sections in their
                 own right rather than paragraphs inside DETAILED REPORT, because
                 each carries its own heading in his text and `label` is the
                 field a heading goes in. No field is invented: `label` + `body`
                 is the shape the model already had.
                 THE `o ` BULLETS ARE HIS CHARACTERS AND ARE KEPT. There is no
                 list markup in a Record body and inventing one would be a new
                 field; each bullet is its own paragraph, carrying his marker.
                 FOUR PASSAGES ARRIVED WRAPPED MID-SENTENCE in the dictation and
                 are joined here into one string each — the two prose paragraphs
                 closing ADDENDUM 01, the last of ADDENDUM 02, and the last of
                 ADDENDUM 03. Split at the wrap they would print as separate
                 paragraphs beginning lower-case. Named here so the join is a
                 decision on the record rather than an invisible tidy. */
              sections: [
                { label: "EXECUTIVE SUMMARY",
                  body: [
                    "Weird.Baby launched on schedule. No deviations; "
                    + "f(Ump) = 100%",
                    "Handoff is on track (T-6); Operations has "
                    + "hands-on-the-ball.",
                  ] },
                { label: "DETAILED REPORT",
                  body: [
                    "ALARM - Incoming Email Server Load 1000x",
                    "o Operations remains unaffected.",
                    "o Not single sourced, so not as simple as "
                    + "\"turn it off.\"",
                    "o Data transmissions went silent shortly after WB launch.",
                  ] },
                { label: "ADDENDUM 01 - Event Log - Friday Launch(-2)",
                  body: [
                    "15:00 - Weird.Baby email server Scheduled Early Auto Start",
                    "15:01 - Weird.Baby System BIST - No deviations; "
                    + "f(Ump) = 100%",
                    "15:14 - First data packet received",
                    "15:58 - Second data packet received",
                    "16:00 - Incoming data crosses 86% vs threshold",
                    "16:10 - Server auto-shutdown, auto-containment, and "
                    + "auto-alerts",
                    "16:13 - REACT - Team is convened",
                    "23:30 - REACT RULING - Restart with 5000x resources.",
                    "The decision to resume was determined to be low risk, "
                    + "reversible, and a real world stress test.",
                    "The engineering team was more intrigued than concerned, "
                    + "and not involved in the determination.",
                  ] },
                { label: "ADDENDUM 02 - Weekend Summary",
                  body: [
                    "Staff onsite to support Weird.Baby launch - Nothing to "
                    + "report.",
                    "The time was put to use reviewing the incoming data.",
                    "Pages of hexadecimal numbers; presumably needs to be "
                    + "compiled and assembled into something usable.",
                  ] },
                { label: "ADDENDUM 03 - Event Log - Monday Day(1)",
                  body: [
                    "00:00 - WB Go-Live went off without a hitch.",
                    "00:02 - Incoming data stream ended",
                    "The remainder of the day was completely uneventful.",
                    "Weird.Baby uptime - 100%, no further anomalies.",
                    "We decided to stand up /Robots as a page to track our "
                    + "progress for a few days. It is weird if nothing else. "
                    + "Maybe try to get a little crowdsourcing going on "
                    + "dealing with this, going forward.",
                  ] },
              ] },
            { no: 2,
              date: recordDay(2),
              title: "GENERAL STATUS UPDATE",
              line: "Weird.Baby Integrity Management Plan remains on-track "
                    + "without anomalies.\nEmail Server Data Assault has "
                    + "ceased; no net impact.",
              sections: [
                { label: "EXECUTIVE SUMMARY",
                  body: [
                    "Weird.Baby uptime: 100%, no anomalies",
                    "Operations Cadence : Favorable, On Pace",
                    "Blockers - Nothing to Report",
                  ] },
                { label: null,
                  body: [
                    "All process controls are in good order.  Operations is "
                    + "turning the crank, keeping tings moving on cadence.",
                    "The adrenalin from the launch and the weekend has "
                    + "finally worn off; we are all running on fumes.  No "
                    + "time was spent on the mystery data stream, today.",
                  ] },
              ] },
            { no: 3,
              date: recordDay(3),
              title: "DATA EXTRACTED - Weekend Robots Anomaly",
              line: "Weird.Baby IMP - On-track without anomalies.\nEmail "
                    + "Server Data Assault - Password Protected File "
                    + "Structure (6.28 GB)",
              sections: [
                { label: "EXECUTIVE SUMMARY",
                  body: [
                    "Weird.Baby uptime: 100%, no anomalies",
                    "Operations Cadence : Favorable, On Pace",
                    "Data has been extracted from weekend dump including "
                    + "images and text. While all of it appears compelling, "
                    + "it is currently of no known value.",
                  ] },
                { label: null,
                  body: [
                    "Data has been extracted from weekend dump",
                    "IMAGE - Engineering Manual - Assorted pages",
                    "IMAGE - Assorted Evidence Based photos - Unknown "
                    + "Importance",
                    "A new Volume has been created: /Robots/MGK-VIIIp",
                    /* [E2 2026-08-09] THREE OF HIS NOTES AND TWO OF OPS'
                       ANSWERS CAME OUT OF THIS SECTION — same ruling and same
                       treatment as Record 001's DETAILED REPORT above; read the
                       note there for the whole of it. His three moved whole and
                       verbatim into his working copy, in place, in braces. */
                  ] },
              ] },
            { no: 4,
              date: recordDay(4),
              sections: [
                { label: "EXECUTIVE SUMMARY",
                  body: [
                    "Weird.Baby uptime: 100%, no anomalies",
                    "Operations Cadence : Favorable, On Pace",
                  ] },
              ] },
            { no: 5,
              date: recordDay(5),
              sections: [
                { label: "EXECUTIVE SUMMARY",
                  body: [
                    "Weird.Baby uptime: 100%, no anomalies",
                    "Operations Cadence : Favorable, On Pace",
                    "Transfer complete - Future reporting to come from "
                    + "Operations",
                    "/Robots - The data can be assembled to produce a "
                    + "heavily compressed file that is  password protected.",
                  ] },
              ] },
];
