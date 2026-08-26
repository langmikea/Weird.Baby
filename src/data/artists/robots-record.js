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

/* ═══ RECORD 001's PROVENANCE — MOVED OUT OF THE ARRAY [2026-08-16] ══════════
   These three blocks stood INSIDE Record 001. `record:land --write` regenerates
   an entry from a draft and refuses to touch one carrying comments, because a
   generated entry has nowhere to put them — its own words: *"move its reasoning
   above the entry so a later landing carries it."* That is what this is. The
   preamble is preserved by every landing; the array is not.

   NOT ONE CHARACTER OF THEM IS EDITED. They are moved verbatim, in order.

   WHAT THEY DOCUMENT, SAID ONCE SO NOTHING BELOW READS AS CURRENT WHEN IT IS
   NOT: they describe the 2026-08-08 landing of Record 001 and its 2026-08-10
   revision — the deck, the typos kept on his instruction, the labels in his
   capitals, the absent `lead`/`tomb`, and the Doctrine 11 ruling. **On
   2026-08-16 the entry's TEXT was replaced from his own week-1 workbook**
   (`C:\AI\_week01\WEEK01_records-001-to-005.xlsx`), so any sentence below
   that quotes a specific line of the old body is describing text that is no
   longer there. The RULINGS in them all still stand — the date rule, the
   verbatim rule, Doctrine 21, the no-invented-tomb rule — which is why they are
   kept rather than pruned.
   ═══════════════════════════════════════════════════════════════════════════ */

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

               ═══ [2026-08-16c] ALL THREE OF THE FAMOUS TYPOS ARE GONE FROM
                   THIS FILE, AND THIS COMMENT WAS STILL SAYING THEY WERE KEPT
                   ═════════════════════════════════════════════════════════
               THIS PARAGRAPH SENT SOMEBODY LOOKING FOR A STRING THAT IS NOT
               HERE, which is the whole reason it is being corrected rather than
               deleted. It named three things carried verbatim out of the
               2026-08-08 dictation and instructed later rounds not to tidy
               them. **Mike's V3 workbook rewrote the two sections they lived
               in, and the 2026-08-16 landing replaced the text wholesale.**
               Measured on the shipping strings of this file, with comments
               stripped and the concatenation folded:

                 · "a clean hand-off was made made"      — NOT PRESENT. The
                   sentence it sat in does not exist; the EXECUTIVE SUMMARY is
                   now two `>` lines ending "Handoff is on track (T-6);".
                 · "Incoming data =  86% vs threshold"   — NOT PRESENT. The
                   16:00 line now reads "Instantaneous - RX sustained FULL LOAD
                   - Packet Rejects = n!". The double space went with it.
                 · "auto containment. and auto alerts"   — NOT PRESENT. The
                   16:10 line now reads "auto-shutdown, auto-containment, and
                   auto-alerts", hyphenated and punctuated.

               **THEY ARE NOT LOST AND THEY ARE NOT ON THE GLASS.** The 08-08
               dictation is `docs/dictation-20260807/answers.json` (`W1.D1.EXEC`
               and `W1.D1.NOTES`) and its rescue dump beside it; the round that
               landed them is `docs/MUSEUM_RECORD_001_LOG-20260808.md`. Those
               files are the RECORD OF WHAT HE SAID and must not be edited to
               match this one — the same rule `docs:numbers` applies to a round
               log.

               **THE VERBATIM RULE ITSELF IS UNTOUCHED.** It is not weakened by
               its three examples expiring: every string below is still his,
               still landed by `record:land`, still round-tripped field by
               field. What expired is this list, and a list of examples that has
               outlived its examples is worse than no list — it is a tripwire
               pointing at empty ground.

               ONE MECHANICAL TYPO WAS CORRECTED HERE ON HIS RULING, 2026-08-16:
               "coincedent" -> "coincident" in the DETAILED REPORT. Fixed at
               source in `NEW_RECORD_MAKER_V3.xlsx` (REC 1.1, B16) and re-landed,
               not hand-edited into this file. **His voice was not touched:**
               the dangling semicolon in "Handoff is on track (T-6);" is his and
               he ruled it stays.
               Nothing else was touched: not the hyphens standing in for dashes,
               not "5Kx", not the order, not the paragraphing.

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
               `date: recordDay(1)` — which resolves to `RECORD_EPOCH` itself,
               Mike's, pending the launch happening that day. The rule above it
               is the standing one, at the
               head of this file: *an entry's date is the actual calendar day it
               is published, not a fictional offset.* What it turns on, measured
               rather than assumed (round log §1): the register stamp, the
               dateline `Week 1 · Monday · Record 001`,
               and `C8` closes. What it does NOT turn on is the month band —
               `shouldBand` needs fourteen entries across more than one month and
               this volume holds two, so `C1` is unmoved and says so.

               **[2026-08-24] THE DAY MOVED AND THIS ENTRY DID NOT.** Ruling C
               put day one on **2026-08-31**, and the only thing edited was the
               constant: `recordDay(1)` follows, the stamp follows, the dateline
               still reads `Week 1 · Monday` because 31 August is a Monday too.
               **No date is written in this file and that is why.** The stamp is
               deliberately not quoted above any more — quoting a derived value
               is how the last one went stale.

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

/* ═══ RECORD 003's PROVENANCE — MOVED OUT OF THE ARRAY [2026-08-16] ══════════
   Moved for the same reason Record 001's three blocks were, and by the same
   rule: `record:land --write` will not regenerate an entry that carries
   comments, and the preamble is the part of this file a landing preserves.
   Not one character of it is edited.
   WHAT IT DOCUMENTS: the 2026-08-09 round that lifted his notes out of Record
   003's DETAILED REPORT. **On 2026-08-16 the entry's TEXT was replaced from
   NEW_RECORD_MAKER_V3.xlsx**, so the section it describes is not the section
   that is there now. The RULING it records — his notes move whole and verbatim
   into his working copy, in braces — still stands, which is why it is kept. */

                    /* [E2 2026-08-09] THREE OF HIS NOTES AND TWO OF OPS'
                       ANSWERS CAME OUT OF THIS SECTION — same ruling and same
                       treatment as Record 001's DETAILED REPORT above; read the
                       note there for the whole of it. His three moved whole and
                       verbatim into his working copy, in place, in braces. */

/* ═══ RECORD 002's TWO BLOCKS — DELETED, NOT MOVED [2026-08-26] ═════════════
   **THE SAME REASON RECORD 001's THREE AND RECORD 003's ONE CAME OUT ABOVE:**
   `record:land --write` will not regenerate an entry that carries comments, so
   an entry that carries them cannot take an edit from the day editor. 002 is
   the first of four; the register row is `C-day2`.

   **AND THIS ONE IS A DELETION RATHER THAN A MOVE, WHICH IS OPS' RULING OF
   2026-08-26: a duplicate is deleted and cited, never carried twice.** Both
   blocks were read whole and **every claim in them was already written down
   somewhere else, in fuller form.** Four copies of a ruling are four things
   that can disagree, and a citation cannot drift from what it cites.

   ── WHERE ALL 2,579 CHARACTERS ALREADY LIVE ────────────────────────────────
   · **`docs/MUSEUM_RULINGS-20260817.md` § 9** — the doctrine itself, the
     `_tmp/` strike, the closing line and the reasoning that it *"named 'the
     last entry', which WAS `_tmp/`, so it could not survive it"*, the invented
     count, and Record 003's relation to all of it. **It also carries what the
     deleted block did NOT:** that 003's opening line was itself replaced on
     2026-08-19, so the block's closing sentence had gone stale in the source.
   · **`docs/MUSEUM_COPY_AND_RECORD_LAYOUT_LOG-20260817.md` §§ 27–28** — the
     three struck DETAILED REPORT lines VERBATIM including the invented number,
     *"three lines for six"*, the manifest's ten lines, his typography as typed
     (`SUMMARY -All`, `Incoming Data:`), and every struck string grepped ABSENT
     from the built launch bundle.
   · **`docs/canon/09-PUBLISHED.md#record-002`** — what a visitor reads, with
     the citations that reach the two above.

   ── WHAT IS DIFFERENT FROM THE 2026-08-16 PRECEDENT, AND WHY ───────────────
   Record 003's block was MOVED here whole — *"not one character of it is
   edited"* — and the note above it now records that the entry's text was
   replaced afterwards, so **what it documents is not the section that is there
   now.** A note parked in a preamble goes stale where nobody is reading it.
   That is the argument for Ops' destinations rather than this one, and it is
   why 002's material is cited into the documents a later round actually opens
   instead of being parked here.

   **NOTHING IS DELETED WITHOUT A CHECK THAT ITS HOME STILL HOLDS IT.**
   `npm run day:proof` P6 reads `docs/dictation-20260807/moved-blocks.json` and
   asserts, on every run, that every claim these blocks made is still findable
   where it is cited. */
/* ═══ RECORD 003's TWO BLOCKS — DELETED, ONE SENTENCE CARRIED [2026-08-26] ══
   **THE THIRD ENTRY EMPTIED UNDER `C-day2`**, after 001 and 003's earlier block
   went to the preamble in 2026-08-16 and 002's two were deleted yesterday.

   **NEITHER OF THESE HAD GONE STALE, AND THAT WAS CHECKED RATHER THAN
   ASSUMED** — 002's closing sentence had, and the preamble block above this
   file's array carries a note saying its own subject was replaced underneath
   it. Every factual claim in these two was re-measured against the tree: 003
   still delivers four attachments, `scan-31` is still untouched beside the
   marked copy, the DETAILED REPORT still names SCAN 07, SCAN 11 and SCAN 31,
   and both master renders are still on disk. All true.

   ── BLOCK 0, `THE THREE SCANS` — DELETED IN FULL ───────────────────────────
   Every claim is in **`docs/MUSEUM_RULINGS-20260817.md`**, in fuller form:
   Ruling 12 carries Mike's quote with a whole sentence this comment dropped
   (*"As we peel the onion that is the ZIP file, the story unfolds"*), the
   filmed-together test, AND *"One page is in two scans - the leaf that closes
   the video link also opens the power supply"* — which was the one thing here
   that looked entry-specific. Ruling 11 carries the scan-number half and adds
   the vocabulary sweep this comment does not mention.

   ── BLOCK 1, `THE FOURTH ATTACHMENT, BACK-POSTED` — ONE SENTENCE SURVIVED ───
   Five of its six claims are already in **`docs/canon/BELL-103.md`**, which
   carries them as *"Three further rulings sit on that attachment"* — the
   back-post and *"We have had no visitors"*, Ruling B, *deliberately not called
   a scan*, *the filename asserts no page*, and the PEN WRITER credit. Ruling B
   itself is at `docs/canon/09-PUBLISHED.md#back-posting`.

   **THE SIXTH WAS WRITTEN DOWN NOWHERE ELSE AND IS CARRIED, NOT DELETED:** that
   the marked page is a SECOND RENDER of the same master rather than a retouch,
   **so the pair can be differenced and audited.** `provenance/assets.json`
   records the second render and the generator; the AUDIT REASON and the pairing
   with the unmarked leaf were only here. Both are in `BELL-103.md` now.

   **AND DELETING IT WOULD HAVE LOST A CORRECT PATH.** This comment names
   `pages/page-47.png`; the `scan-31-a` provenance row names
   `structure/page-47.png`, and **there is no file at that path.** The flag is
   at `BELL-103.md` beside the carried sentence. */
export const RECORD_ENTRIES = [
            { no: 1,
              date: recordDay(1),
              title: "INITIAL LAUNCH - Weird.Baby Website",
              line: "> Weird.Baby website went live\n> Alert - Incoming "
                    + "Server Load  (contained)",
              sections: [
                { label: "EXECUTIVE SUMMARY",
                  body: [
                    "  > Weird.Baby launched on schedule. No deviations; "
                    + "f(Ump) = 100%\n  > Operations has hands-on-the-ball. "
                    + "Handoff is on track (T-6);",
                  ] },
                { label: "DETAILED REPORT",
                  body: [
                    "  > ALARM - Incoming Server Load >1000x nominal\n  > "
                    + "Operations remains unaffected.\n  > Multi-source swarm "
                    + "payloads precludes IP/Domain blocking\n  ? RX ended "
                    + "abruptly and coincident with Weird.Baby launch",
                  ] },
                { label: "ADDENDUM 01 - Event Log - Friday (Launch - 2)",
                  body: [
                    "    15:00 - Weird.Baby Incoming Server - Scheduled "
                    + "Early Auto Start (Retired)\n    15:01 - Weird.Baby "
                    + "System BIST - No deviations; f(Ump) = 100%\n    15:04 -"
                    + " First data packet received\n    15:58 - Second data "
                    + "packet received\n    16:00 - Instantaneous - RX "
                    + "sustained FULL LOAD - Packet Rejects = n!\n    16:10 - "
                    + "Server auto-shutdown, auto-containment, and "
                    + "auto-alerts\n    16:13 - REACT - Team is convened\n    "
                    + "23:30 - REACT RULING - Restart with 5Kx Incoming "
                    + "Server Resources",
                    "    > The decision to resume was determined to be low "
                    + "risk, reversible, and a real-world stress test.\n    > "
                    + "The engineering team was more intrigued than "
                    + "concerned, and not involved in the determination.",
                  ] },
                { label: "ADDENDUM 02 - Weekend Summary",
                  body: [
                    "    > Staff onsite to support Weird.Baby launch - "
                    + "Nothing to report.\n    > The time was put to use "
                    + "reviewing the incoming data.\n    > Pages of "
                    + "hexadecimal numbers; presumably to be compiled into "
                    + "something of use.",
                  ] },
                { label: "ADDENDUM 03 - Event Log - Monday (Launch)",
                  body: [
                    "    > 00:00 - WB Go-Live went off without a hitch."
                    + "\n    > 00:02 - Incoming data stream ends\n    > The "
                    + "remainder of the day was completely uneventful.\n    > "
                    + "Weird.Baby uptime - 100%, no further anomalies.\n    > "
                    + "ADDED PAGE - W.B/Robots added (to track what happened,"
                    + " just for a few days)\n       HASH: 982056&363 = "
                    + "$^6/Tx=0............................. >> Complete!",
                  ] },
              ],
            },
            { no: 2,
              date: recordDay(2),
              title: "GENERAL STATUS UPDATE",
              line: "> Weird.Baby Integrity Management Plan remains "
                    + "on-track without anomalies.\n> Incoming Server Data "
                    + "Assault has ceased; no impact.",
              sections: [
                { label: "EXECUTIVE SUMMARY",
                  body: [
                    "  > Weird.Baby uptime: 100%, no anomalies - f(Ump) = "
                    + "100%\n  > Blockers - Nothing to Report",
                  ] },
                { label: "DETAILED REPORT",
                  body: [
                    "  > METRIC SUMMARY -All processes 6+ sigma.\n"
                    + "  > Incoming Data: ZIP file (31.4 GB) Password "
                    + "Protected\n"
                    + "  > Manifest extraction attempted against the stream "
                    + "still in flight - Appendix 01",
                  ] },
                { label: "ADDENDUM 01 - Partial Manifest (names only, no contents)",
                  body: [
                    "    MGK-VIIIp/MANUAL/00-FRONTMATTER.tif\n    "
                    + "MGK-VIIIp/MANUAL/07-POWER-SYSTEM.tif\n    "
                    + "MGK-VIIIp/MANUAL/11-VID-LINK.tif\n    "
                    + "MGK-VIIIp/MANUAL/31-PARITY-BIAS.tif\n    PERSONNEL/CEO/"
                    + "\n    PERSONNEL/INFORMER/\n    PERSONNEL/EVERYDAY/\n    "
                    + "PERSONNEL/GAMBLER/\n    PORTAL/CH3-STANDARD/\n    "
                    + "PORTAL/CH4-DETAIL/",
                  ] },
              ],
            },
            { no: 3,
              date: recordDay(3),
              title: "DATA RECOVERY - LEVEL 1 - SUCCESS!",
              line: "> Weird.Baby Website - All Systems Favorable\n> Robots "
                    + "- Nothing to Report",
              sections: [
                { label: "EXECUTIVE SUMMARY",
                  body: [
                    "  > Weird.Baby uptime: 100%, no anomalies - f(Ump) = "
                    + "100%\n  > Blockers - Nothing to Report",
                  ] },
                { label: "DETAILED REPORT",
                  body: [
                    "  > Ops now wants an Early-Pull-Off with Confidence "
                    + ">> 6.28 sigma\n  > Data Deluge ZIP File - The outer "
                    + "layer was not password protected\n       Manual Pages "
                    + "Recovered\n         SCAN 07 - POWER SYSTEM\n         "
                    + "SCAN 11 - VID-LINK\n         SCAN 31 - PARITY BIAS",
                  ] },
                { label: "ADDENDUM 02 - Personnel Folders (empty, names only)",
                  body: [
                    "    THE CEO         - one page, redacted to the "
                    + "letterhead\n    THE INFORMER    - photographs only, no "
                    + "text\n    THE EVERYDAY    - not yet opened\n    THE "
                    + "GAMBLER     - not yet opened",
                    "  ? Four people are described in a manual for a "
                    + "machine. No explanation is offered.",
                  ] },
              ],
              docs: [
                { title: "Scan 07 - Power supply and distribution",
                  source: "ABEAL 8P-OMI-1",
                  pages: 2,
                  plates: [
                    { img: "/robots/manual/scan-07-a.webp",
                      label: "Power supply and distribution, first page" },
                    { img: "/robots/manual/scan-07-b.webp",
                      label: "Power supply and distribution, second page" },
                  ] },
                { title: "Scan 11 - The video link",
                  source: "ABEAL 8P-OMI-1",
                  pages: 2,
                  plates: [
                    { img: "/robots/manual/scan-11-a.webp",
                      label: "The video link, first page" },
                    { img: "/robots/manual/scan-11-b.webp",
                      label: "The video link, second page" },
                  ] },
                { title: "Scan 31 - Bias settings",
                  source: "ABEAL 8P-OMI-1",
                  pages: 1,
                  plates: [
                    { img: "/robots/manual/scan-31-a.webp",
                      label: "Bias settings, the four communications settings" },
                  ] },
                { title: "Marked copy 01 - Bias settings",
                  source: "ABEAL 8P-OMI-1",
                  pages: 1,
                  plates: [
                    { img: "/robots/manual/marked-01-a.webp",
                      label: "Bias settings, returned marked" },
                  ] },
              ],
            },
            { no: 4,
              date: recordDay(4),
              title: "GENERAL STATUS UPDATE",
              /* [2026-08-20] MIKE: deck line 2 was "> /Robots data analysis"
                 and the day's news is the crack, not the analysis. */
              line: "> Weird.Baby Website - All Systems Favorable\n> /Robots"
                    + " ZIP File Cracked",
              sections: [
                { label: "EXECUTIVE SUMMARY",
                  body: [
                    "  > Weird.Baby uptime: 100%, no anomalies - f(Ump) = "
                    + "100%\n  > Blockers - Nothing to Report",
                  ] },
                /* === [2026-08-20] THE DETAILED REPORT IS MIKE'S, REWRITTEN =
                   His text, verbatim. The password is **355113** and the
                   transposition he first wrote (`335133`) is corrected on his
                   own ruling: 355/113 = 3.14159292, Zu Chongzhi's ratio,
                   accurate to six decimals - the digits are the egg and a
                   transposed pair is not it.
                   THE FOLDER NAMES ARE ALREADY PUBLISHED. `PORTAL/CH3-STANDARD/`
                   and `PORTAL/CH4-DETAIL/` are in Record 002's Tuesday
                   manifest, so the tree agrees with what the museum has
                   already shown (ruling 10). They are the far end's own
                   directory names and are NOT the drum's engraved legends,
                   which Mike renamed to `MGK-VIIIp` / `MGK-VIIIp (zoom)` on
                   the same day - a disk and a badge may say different things
                   about the same channel, and here they do. */
                { label: "DETAILED REPORT",
                  body: [
                    "  > ZIP Password Cracked: [355113]",
                    /* [2026-08-21] HIS REWRITTEN LISTING. It gains a ROOT
                       level and locked siblings, and `PORTAL.CFG` becomes
                       `PORTAL_2v16.CFG` - the version is now on the glass in
                       the filename, which is where an installer would have put
                       it. `QC_101.TIF` is the install document.
                       IT IS A PURE INDENT TREE AND THE READER HAD TO LEARN
                       THAT SHAPE. The 2026-08-20 listing was `name  value` on
                       every row; this one has no two-field line anywhere, and
                       under the old rule its DEEPEST line alone would have
                       landed in the value column while its siblings drew as
                       spanning headings. `listingRows()` asks whether any line
                       carries two fields before deciding there is a value
                       column at all - see RecordEntry.jsx. */
                    { pre:
                      "    ROOT\n"
                      + "     /(many pwd protected folders)\n"
                      + "     /PORTAL\n"
                      + "       TERMINAL.EXE\n"
                      + "       PORTAL_2v16.CFG\n"
                      + "       /ANTENNA (PWD)\n"
                      + "       /CHANNEL_SELECT(PWD)\n"
                      + "       /INSTALL\n"
                      + "          QC_101.TIF (hand written notes on form)" },
                    /* [2026-08-21] FLAGGED AND NOT CORRECTED: **"not meant to
                       seen"** is Mike's, as typed. Doctrine 21's cost (1) - his
                       typos ship, and a round that tidies one has broken the
                       instruction that put it there.
                       WHAT LEFT, NAMED ONCE (Doctrine 24): "It appears to be an
                       unattended remote access terminal.", the bi-directional
                       Vid-Link sentence, "Documentation looks proprietary.
                       Probably not meant for us to see...", and the NOTE line
                       that the QC RULE line replaces. **The unattended-terminal
                       sentence was CANON-LOAD-BEARING** - `docs/canon/06-PORTAL.md`
                       quoted it and built the museum-reading-vs-manual
                       disagreement on it - so that entry is corrected in the
                       same round rather than left quoting a line the Record no
                       longer carries. */
                    "  > Install document looks proprietary. Probably not "
                    + "meant to seen.\n  > QC RULE: Unsafe to run in any "
                    + "sandbox; permanently quarantined.",
                  ] },
                /* === [2026-08-20] TWO SECTIONS STRUCK FROM 004, NAMED ONCE ===
                   (Doctrine 24 - they are named here, in the round log, and
                   nowhere else.)

                   `OTHER` - THE REQUISITION. It carried
                   `> RAISED - Req 0628 - Internal Transfer - No net increase in
                   head count`. **MIKE: "NOW I SEE WHAT YOU DID, YOU ADDED A
                   THUR."** He proposed the requisition RAISED Thursday and
                   APPROVED Friday as a sequence a reader could follow; OPS PUT
                   A THURSDAY SECTION IN THE RECORD WITHOUT A RULING, which is
                   not the same act. **The requisition lives in 005 only.**
                   The section placement Ops reasoned about at length was
                   reasoning about a section that should not have existed.

                   `ADDENDUM 01 - Bench Description` - the whole block, both
                   paragraphs, including the closing `! Nothing here postdates
                   1969. Everything here works.` Mike's ruling; struck entire.
                   Its subject survives where it belongs - the far end's console
                   is described in the canon (`docs/canon/06-PORTAL.md`), which
                   is where a fact lives when the Record is not saying it. */
              ],
              /* ═══ [2026-08-20] THE TWO ATTACHMENT ROWS ARE STRUCK ═══════════
                 MIKE, ruling on the morning of the day this entry posts:
                 *"Remove the docs field entirely. The ATTACHMENTS 2 badge goes
                 with it."*

                 WHAT WAS HERE, named once so nobody rebuilds it (Doctrine 24):
                 two `docs` rows carrying a title and nothing else —
                 `View of the portal screen` and `Manual ref to Portal`. No
                 source, no date, no pages, no plates, no extract.

                 IT IS RULING 9's OWN SHAPE, AND HE HAD ALREADY STRUCK IT ONCE.
                 *"We do not hold back what we say we have. We hold back what we
                 don't have yet."* A Record names only what it can produce. The
                 `_tmp/` line in Record 002 was a name in a list with nothing
                 behind it and it went for this reason; these are two.

                 AND THE THIRD REASON IS THE ONE HE RULED ON, because it is a
                 CONTRADICTION rather than a gap. `docState()` resolves a row
                 with no plates to `held`, which draws as **not here yet** —
                 and *Manual ref to Portal* is `SCAN 11 - VID-LINK`, which
                 **Record 003 delivered on Wednesday**, at a public address,
                 with a thumbnail that opens. Thursday would have said the
                 museum does not have a thing it showed on Wednesday. That is
                 Ruling 10 — what's said matches what's shown — failing in the
                 harder direction.

                 A THIRD FAULT, RECORDED BECAUSE IT IS THE ONE A GATE COULD
                 CATCH: `held` is defined in `src/lib/record-model.js` as *"its
                 provenance is recorded and nothing else has arrived."* Neither
                 row recorded any provenance, so `attachmentsOf()` built a meta
                 line containing the words `not here yet` AND NOTHING ELSE.
                 They were not empty-and-honest; they were empty-and-unsourced.

                 STRIKING THEM COSTS NO PROSE, WHICH WAS MEASURED BEFORE IT WAS
                 CLAIMED. This entry was searched for `attach`, `contents`,
                 `enclos`, `appendix`, `below` and `see ` — zero hits. Its one
                 backward reference is *"Excerpts from the Manual earlier in the
                 week"*, which points at Record 003, is true, and is delivered.
                 Not one character of Mike's text moved.
                 [2026-08-20] THE QUOTED SENTENCE ABOVE WAS REPLACED WHEN HE
                 REWROTE THIS SECTION. The backward reference survives in his
                 new words - *"The Manual's bi-directional CNC Vid-Link is one
                 half of it"* - and still points at Record 003's delivered
                 scan, so the finding holds and only its quotation moved.
                 (Contrast Record 003, which promises and delivers: *"Outer
                 layer opened - three manual pages recovered, contents
                 attached."*)

                 NOTHING IS OWED LATER. A picture of the portal screen may
                 arrive on any future Record; Ruling 9's own words are that the
                 Record may withhold and the Record may not promise. */
              /* ═══ [2026-08-21] THE DOCS FIELD RETURNS, AND THIS IS THE FIRST
                 TIME A PUBLISHED RECORD HAS GAINED AN ATTACHMENT ═══════════
                 Record 004 posted 20 Aug at 17:00 and has been live for a day.
                 Mike ruled the attachment on 21 Aug; his standing reason is
                 *"we have had no visitors."* THE PRECEDENT IS WRITTEN UP IN
                 `docs/MUSEUM_RULINGS-20260817.md` AS RULING 17, not in a round
                 log — the next round that wants to touch published text will
                 reach for the rulings, and a diary does not answer questions.

                 THE STRIKE ABOVE STANDS AND IS NOT REVERSED. The two rows that
                 went on 20 Aug carried a title and nothing else, and a Record
                 names only what it can produce. This row is the opposite case,
                 which is exactly why Ruling 9 permits it: the sheet EXISTS, at
                 2550x3300 300 dpi, and is published here. Ruling 9 forbids
                 naming what cannot be produced. It does not forbid producing.

                 `QC_101.TIF` IS THE NAME INSIDE THE ARCHIVE; `.webp` IS WHAT A
                 VISITOR DOWNLOADS. The listing above is untouched, and this is
                 the manual's own arrangement rather than a new one: Record
                 002's manifest names `07-POWER-SYSTEM.tif` and the museum
                 served it as `scan-07-a.webp`. No `.tif` exists anywhere in
                 either repo — the masters are PNG — so emitting one would
                 create the first, for no reader. Ruling 18.

                 THE FILENAME IS THE DOCUMENT'S OWN NAME, NOT THE ATTACHMENT'S
                 TITLE. `scan-NN` and `marked-NN` are class words Ops chose
                 under Ruling 11; `qc-101` is what Mike has already published on
                 the glass, in the folder listing a dozen lines up. A title he
                 may still rule on therefore cannot move the file.

                 THE TITLE IS MIKE'S RULING, 2026-08-21. Ops drafted three and
                 he took the document's own name: `QC_101 - Final test and
                 inspection`. Ops had recommended `Install document - QC_101
                 final test and inspection` on the ground that *install
                 document* is his own published noun in the DETAILED REPORT
                 above — **the reasoning was sound and the recommendation was
                 not taken, which is recorded here rather than quietly
                 forgotten.** Both halves of what he chose are read off things
                 that already exist: `QC_101` is the filename he published in
                 the listing, and FINAL TEST AND INSPECTION is the sheet's own
                 printed heading.

                 IT IS DELIBERATELY NOT CALLED A SCAN, for Record 003's reason
                 (SCAN is Mike's published word for the three manual pages, and
                 Ruling 10 would force a fourth line into text already shown)
                 and for a truer one: this sheet was not filmed. It came out of
                 the ZIP's INSTALL folder.

                 NO NUMBER, ON SUBTRACTION. `Marked copy 01` took one because
                 Mike said marked copies are a recurring channel. Nothing says a
                 second install document is coming, and `01` would promise one.

                 NO `date` FIELD, AND THAT IS A REFUSAL RATHER THAN AN OMISSION.
                 The sheet is dated 8/14/65 in the inspector's hand and a reader
                 can see it. That date is OPS' CHOICE, declared as such in the
                 generator's own FIELDS block — no inspection date exists in the
                 corpus — so lifting it onto the catalogue card would restate an
                 invention as provenance. */
              docs: [
                { title: "QC_101 - Final test and inspection",
                  source: "ABEAL FORM QC-101",
                  pages: 1,
                  plates: [
                    { img: "/robots/portal/qc-101-a.webp",
                      label: "Final test and inspection, completed and passed" },
                  ] },
              ],
            },
            { no: 5,
              date: recordDay(5),
              /* ═══ [2026-08-21] 005 HAS ITS OWN HEADLINE, AND THAT IS THE
                 POINT OF IT ══════════════════════════════════════════════════
                 MIKE: `PORTAL CONNECTION ONLINE`, replacing `GENERAL STATUS
                 UPDATE`. **002 and 004 still share the generic one and 005 no
                 longer does** — deliberate, his, and the reason is that this
                 entry is the week's payoff. A headline that differs is the
                 cheapest signal a Record has, and it is spent here rather than
                 on a Tuesday.
                 24 characters against `RECORD_TITLE_MAX` 62. */
              title: "PORTAL CONNECTION ONLINE",
              /* [2026-08-20] MIKE REORDERED THE DECK: the Portal line leads
                 and the ZIP line follows. Same two sentences, swapped. */
              line: "> Portal Data Link - Connection Achieved\n> ZIP "
                    + "Extraction - Outer Layers Complete / Stopped",
              sections: [
                /* [2026-08-20] SWAPPED WITH THE DECK, for the same reason and
                   in the same order: Portal first, ZIP second. */
                { label: "EXECUTIVE SUMMARY",
                  body: [
                    "  > Portal appears to function. Intended purpose "
                    + "unknown.\n  > ZIP - We have reached the capability limit"
                    + " of brute force.",
                  ] },
                /* === [2026-08-20] THE DETAILED REPORT WAS CUT TO ONE LINE ====
                   MIKE replaced the whole section with its first sentence.
                   STRUCK, named once (Doctrine 24): the launch-controls line,
                   the `Error: Communications Parity Bias Setting Mismatch`
                   line, `Four toggles. Sixteen combinations. One of them is
                   correct.`, `< The Manual names the settings and declines to
                   name the values.`, and the two `Currently, the system...`
                   lines that landed earlier the same day.

                   HIS LINE ARRIVED CARRYING `{Mike to rewrite}` AND OPS
                   STRIPPED THE BRACES, WHICH IS THE ONLY REASON IT LANDED AT
                   ALL. A curly brace is a note to Ops and the launch gate
                   refuses any that survive (`wb-ops-braces`).

                   ═══ [2026-08-21] AND HE WROTE IT. The one line becomes three,
                   hours before the entry posts. **The rewrite the note asked
                   for arrived, so the note is closed rather than left standing
                   as an open question about a section that now has an answer.**

                   TWO FIRST APPEARANCES ARE IN THESE THREE LINES AND BOTH ARE
                   FILED AS CANON: the Portal runs on a **UNIX-6x Emulator**,
                   and it **carried its own COMM payload, autosync**. Neither
                   string existed anywhere in the corpus before this line —
                   checked across both repos. `docs/canon/06-PORTAL.md`.

                   CARRIED VERBATIM, AND TWO THINGS ARE FLAGGED RATHER THAN
                   FIXED (Doctrine 21): his first line says `Portal` and his
                   third says `The Portal`, and `etc.` closes the second
                   sentence with the period doing double duty. Both are his,
                   as typed. A round that tidies either has broken the
                   instruction that put them here. */
                { label: "DETAILED REPORT",
                  body: [
                    "  > Portal is now up and running on our UNIX-6x "
                    + "Emulator.\n  > It carried its own COMM payload, "
                    + "autosync, etc.\n  > The Portal is accessible via the "
                    + "Robots Exhibit.",
                  ] },
                /* [2026-08-20] `OTHER` - the requisition. It is APPROVED here
                   and it is raised NOWHERE: the Thursday `RAISED` section was
                   Ops' unruled addition and is struck from 004. */
                { label: "OTHER",
                  body: [
                    "  > APPROVED - Req 0628 - Internal Transfer - No net "
                    + "increase in head count",
                  ] },
                /* === [2026-08-20] `ADDENDUM 01 - The Four Settings, as
                   printed` IS STRUCK ENTIRE, both closing lines with it:
                   `? A period operator would have known this without being
                   told.` and `! We are not period operators.` Named once
                   (Doctrine 24).

                   IT TAKES THE `{ pre }` CASE RULED THE SAME DAY WITH IT, AND
                   THE MECHANISM STAYS - Record 004's folder tree is the
                   remaining case and the reason the shape exists.

                   AND THE FOUR SETTINGS ARE STILL PUBLISHED. Wednesday's
                   marked manual page carries them in pen, delivered by Record
                   003. 005 no longer repeats what the museum has already
                   shown, which is ruling 10 holding rather than being spent
                   twice. */
              ],
            },
];
