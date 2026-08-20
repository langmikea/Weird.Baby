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
                    /* [2026-08-18] HIS REWRITE, VERBATIM. The whole body is
                       replaced; three lines where there were six.
                       WHAT WENT, NAMED ONCE (Doctrine 24) AND NOT MOVED
                       ANYWHERE ELSE, which is his instruction: the ZIP-index
                       line ("A ZIP index is written last. No catalog is
                       available until receipt completes."), the per-file-header
                       line ("Each file is preceded by its own header. Names
                       arrive ahead of contents."), and the recovered-names line.
                       **THE INVENTED NUMBER GOES WITH THEM AND IS NOT REPEATED
                       HERE** - it counted something the museum cannot produce, so
                       leaving the figure in the source is leaving a fact a later
                       round could reinstate believing it was data. It is written
                       down once, in the round log, which is where Doctrine 24 puts
                       a deleted thing. His ruling: we do not hold back what we say
                       we have; we hold back what we do not have yet.
                       HIS CHARACTERS ARE CARRIED AS TYPED, including
                       "SUMMARY -All" with no space after the dash and the colon
                       in "Incoming Data:" where the old line had an equals. */
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
                    /* [2026-08-18] THE `_tmp/` LINE AND THE CLOSING LINE ARE
                       BOTH STRUCK, AND THEY ARE ONE RULING RATHER THAN TWO.
                       Named once (Doctrine 24): "    _tmp/
                       < password bit not set" and "  ! The last entry is the
                       only one we can open. It is being reviewed."
                       MIKE: **"We do not hold back what we say we have. We hold
                       back what we do not have yet."** The `_tmp/` line promised
                       something the museum cannot show, and the closing line was
                       the promise restated - it pointed at "the last entry",
                       which was `_tmp/`, so it could not survive it. **A Record
                       names only what it can produce.**
                       THE OTHER TEN ENTRIES ARE UNCHANGED AND IN THE SAME
                       ORDER, and the manifest is now one element rather than
                       two. Record 003 still opens on the tmp folder in its own
                       words ("One tmp folder unprotected - Contents attached"),
                       which is the day the museum HAS the thing - untouched. */
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
              /* [2026-08-19] THE THREE SCANS. Mike's ruling on what an
                 attachment IS: "We show the things that need to be shown. Each
                 page is a page, and if we need to include a couple more pages,
                 fine. Those pages were in the outer layer for a reason." So a
                 scan carries the pages that were filmed together because they
                 belong together, in reading order, and no page is cropped out
                 to tidy a set or padded in to even one.
                 THE NUMBERS 07/11/31 ARE SCAN NUMBERS, NOT PAGE NUMBERS (T-A,
                 ruled 2026-08-19): they are frame numbers from whoever filmed
                 the manual, they match nothing in the document, and they are
                 not meant to. That is why the public names are scan-NN, and
                 why no address here asserts a page of the manual.
                 ONE PAGE IS IN TWO SCANS. The manual page that closes the
                 video link also opens the power supply, so it was filmed into
                 both sets and is delivered under both names. */
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
                /* [2026-08-19] THE FOURTH ATTACHMENT, BACK-POSTED. Mike ruled
                   it, and his reason is the whole of why it is allowed: "We
                   have had no visitors." Record 003 published 19 Aug 17:00 and
                   is live.
                   RULING B: THE ORIGINAL SCAN STAYS. The marked copy arrives
                   BESIDE it, as a new attachment. The museum does not edit what
                   it has already shown; a page comes back with somebody's
                   handwriting on it. Scan 31 above is untouched, and the
                   marked page is a SECOND RENDER of the same master rather
                   than a retouch of the first file - the generator emits
                   pages/page-47.png and pages/marked/page-47.png separately,
                   so the pair can be differenced and audited.
                   AND IT IS DELIBERATELY NOT CALLED A SCAN. Record 003's own
                   DETAILED REPORT, in Mike's published words, names three:
                   SCAN 07, SCAN 11, SCAN 31. Ruling 10 - what's said matches
                   what's shown - would then force a fourth line into text the
                   museum has already published, which Ruling B forbids. It
                   also happens to be true: this page was not recovered from
                   the ZIP and was not filmed with anything. It is a different
                   object with a different provenance, and Ruling 12's own test
                   (the pages that were filmed together because they belong
                   together) puts it with nothing.
                   THE FILENAME ASSERTS NO PAGE. Ruling 11's practical half is
                   that no public address may assert a page of the manual -
                   which is why the others are scan-NN. `marked-b1` would
                   assert B-1, a real paragraph number; `marked-01` asserts a
                   sequence of marked copies and nothing about the document.
                   Mike has said this is a recurring channel, so it takes a
                   number from the first one.
                   THE PEN IS MIKE'S OWN HAND - he is the PEN WRITER, logged
                   for the credits page. */
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
              line: "> Weird.Baby Website - All Systems Favorable\n> /Robots"
                    + " data analysis",
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
                    /* THE TREE IS A LISTING AND NOT A PARAGRAPH - see the
                       `pre` branch in RecordEntry.jsx's SectionBody. Its
                       columns are load-bearing: `PORTAL.CFG` hangs under
                       `TERMINAL.EXE` at column 26 and means nothing anywhere
                       else. `.vp-rec-sect-body` is `white-space: pre-line`,
                       which COLLAPSES runs of spaces - measured on the built
                       page, `A B` and `A    B` both render at 29.97px - so as
                       an ordinary body string this tree would have arrived
                       flat, with the second file adopted by nobody. */
                    { pre:
                      "     Folder: PORTAL/\n"
                      + "         CH3-STANDARD/    TERMINAL.EXE\n"
                      + "                          PORTAL.CFG\n"
                      + "         CH4-DETAIL/      one photograph\n"
                      + "         ANTENNA/         empty\n"
                      + "         INSTALL/         one form, filled in by hand" },
                    "  > It appears to be an unattended remote access "
                    + "terminal.\n  > The Manual's bi-directional CNC Vid-Link"
                    + " is one half of it; this is the other. It expects a "
                    + "unit at the far end, and it will not open the link "
                    + "until four communications settings agree with whatever "
                    + "is there.\n  > Documentation looks proprietary. Probably"
                    + " not meant for us to see...\n  > NOTE: Quality has "
                    + "declared it unsafe to run in any sandbox; permanently "
                    + "quarantined.",
                  ] },
                /* === [2026-08-20] `OTHER` - THE REQUISITION IS RAISED =======
                   004 raises it and 005 approves it, so a reader meets the
                   sequence rather than a decision with no request behind it.
                   THE SECTION'S PLACEMENT IS OPS' AND IS NAMED: after the
                   DETAILED REPORT and before the addenda, because an addendum
                   is an appendix and `OTHER` is part of the report.
                   THE WORDING IS OPS' PROPOSAL, filed as such and not as
                   Mike's, until he says otherwise. */
                { label: "OTHER",
                  body: [
                    "  > RAISED - Req 0628 - Internal Transfer - No net "
                    + "increase in head count",
                  ] },
                { label: "ADDENDUM 01 - Bench Description",
                  body: [
                    "    Console is a single welded steel desk. No maker "
                    + "plate, no model number.\n    Display is a vidicon-tube "
                    + "monitor, long-persistence phosphor, green.\n    "
                    + "Readouts are cold-cathode numeric tubes. Eight digits,"
                    + " four lit.\n    Input is a light pen on a coiled cord, "
                    + "seated in a cradle at the right.\n    There is an "
                    + "ashtray cast into the desk and it has been used.\n    A"
                    + " paper-tape reader is fitted and empty. The take-up "
                    + "reel is full.\n    Four toggle switches sit under a "
                    + "hinged guard, unlabelled.",
                    "  ! Nothing here postdates 1969. Everything here "
                    + "works.",
                  ] },
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
            },
            { no: 5,
              date: recordDay(5),
              title: "GENERAL STATUS UPDATE",
              line: "> ZIP Extraction - Outer Layers Complete / Stopped\n> "
                    + "Portal Data Link - Connection Achieved",
              sections: [
                { label: "EXECUTIVE SUMMARY",
                  body: [
                    "  > ZIP - We have reached the capability limit of "
                    + "brute force.\n  > Portal appears to function. Intended "
                    + "purpose unknown.",
                  ] },
                { label: "DETAILED REPORT",
                  body: [
                    "  > Portal is accessible via the Robots Exhibit.\n  > "
                    + "The launch controls are intuitive looking, but the "
                    + "system fails to boot.\n  > Error: Communications Parity"
                    + " Bias Setting Mismatch\n  > Four toggles. Sixteen "
                    + "combinations. One of them is correct.\n  < The Manual "
                    + "names the settings and declines to name the values.",
                    /* [2026-08-20] MIKE'S TWO LINES, verbatim. They are what
                       the drum shows, counted: eight positions, two that arm
                       (3 and 4), six that report no signal. The one that
                       carries a picture is channel 4; the one that carries a
                       machine is channel 3, and the machine on it is the
                       MGK-VIIIp - which is not the museum's. */
                    "  > Currently, the system offers eight feeds. Two answer."
                    + " The rest report no signal.\n  > One of the two carries"
                    + " a picture. The other carries a machine, and the "
                    + "machine is not ours.",
                  ] },
                /* [2026-08-20] `OTHER` - the requisition raised in 004 is
                   approved here. Same placement rule as 004's. */
                { label: "OTHER",
                  body: [
                    "  > APPROVED - Req 0628 - Internal Transfer - No net "
                    + "increase in head count",
                  ] },
                { label: "ADDENDUM 01 - The Four Settings, as printed",
                  body: [
                    /* [2026-08-20] A LISTING, ON MIKE'S RULING - the same
                       `{ pre }` shape Record 004's folder tree uses, and for a
                       reason the label itself gives. MIKE: *"It says 'as
                       printed'. Printed means aligned. Collapsed it is a list;
                       aligned it is a page from a manual, which is what a
                       visitor must recognise when they meet the same four
                       names on the panel."* Under `pre-line` this rendered as
                       `1 PARITY ODD / EVEN` - true, readable, and not a page.
                       IT IS AN OPT-IN AND NOTHING ELSE MOVED: the string is
                       unchanged to the character, only its wrapper. */
                    { pre:
                      "    1  PARITY    ODD / EVEN\n    2  DUPLEX    HALF / "
                      + "FULL\n    3  WORD      7 BIT / 8 BIT\n    4  STOP      1"
                      + " / 2" },
                    "  ? A period operator would have known this without "
                    + "being told.\n  ! We are not period operators.",
                  ] },
              ],
            },
];
