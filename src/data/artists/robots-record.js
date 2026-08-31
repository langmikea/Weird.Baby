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

               **[2026-08-28] IT MOVED A SECOND TIME AND THIS ENTRY STILL DID
               NOT.** Ruling D put day one on **Monday 7 September 2026**. Same
               one constant, same untouched entry, same `Week 1 · Monday`
               — 7 September is a Monday too. **Two moves is where a claim
               about a mechanism stops being a claim.** The date is named here
               and nowhere in the data below it; if a third move comes, this
               paragraph is the only thing in this file that has to be written.

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
/* ═══ RECORD 005's SIX BLOCKS — DELETED, ONE PARAGRAPH CARRIED [2026-08-26] ══
   **THE FOURTH ENTRY EMPTIED UNDER `C-day2`.** Only 004 is left.

   **NONE OF THE SIX HAD GONE STALE**, and every factual claim was re-measured
   against the tree rather than trusted: 005's title is still `PORTAL CONNECTION
   ONLINE` at 24 characters, 002 and 004 still share `GENERAL STATUS UPDATE`,
   the deck and the EXECUTIVE SUMMARY still lead with the Portal line, the
   DETAILED REPORT is still the three lines he wrote, there is no `RAISED`
   section anywhere in the volume, and exactly one entry still carries a
   `{ pre }`. All true.

   ── FIVE OF THE SIX ARE DUPLICATES, AND MOST OF THEM OF ONE PARAGRAPH ──────
   **`docs/MUSEUM_RULINGS_APPLIED_LOG-20260820.md` § 005** carries the deck and
   EXECUTIVE SUMMARY reorder (*"Portal first, ZIP second, same sentences"* —
   which is blocks 1 and 2 in one line), the DETAILED REPORT's replacement, the
   `ADDENDUM 01` strike with both closing lines, the four settings still being
   published through Record 003, and the `{Mike to rewrite}` braces and
   `wb-ops-braces`. Its § THE REGISTER names 004's `RAISED` row, and § 240 has
   *"The requisition lives in 005 only"* — block 4.

   **`docs/canon/09-PUBLISHED.md`** carries the headline ruling with its
   reasoning (*the week's payoff*, *the cheapest signal*), the two first
   appearances filed as canon, and **both Doctrine 21 flags verbatim** — his
   `Portal` against his `The Portal`, and `etc.` with the period doing double
   duty. `docs/MUSEUM_RECORD_005_LOG-20260821.md` carries the same and the
   rewrite that closed the note.

   ── THE ONE THAT WAS WRITTEN DOWN NOWHERE ELSE ─────────────────────────────
   **THAT STRIKING `ADDENDUM 01` TOOK A `{ pre }` WITH IT, LEAVING 004's FOLDER
   TREE AS THE ONLY CASE THE MECHANISM STILL HAS.** No register field holds a
   count of how many body items use a shape, so nothing else could have said it
   — and it is the reading under which a later round deletes the Listing as
   dead weight. It is in `RecordEntry.jsx` beside the argument for why the
   Listing exists, with the count dated and marked re-measurable.

   **IT IS THE SAME SHAPE AS RECORD 003's ONE SURVIVING SENTENCE** — why a
   mechanism exists, which no field records — and it is the second time in
   three entries that the only unique thing in a block was of that kind. */
/* ═══ RECORD 004's SEVEN BLOCKS — THE LAST ONES [2026-08-26] ════════════════
   **EVERY ENTRY IN THIS ARRAY NOW CARRIES ZERO COMMENT BLOCKS, AND `record:land
   --write` WILL ACCEPT AN EDIT TO ANY OF THEM.** `C-day2` closes with this.
   11,592 characters, 86% of this entry's own span, and it held every class.

   **NOTHING RESTED ON A REASON THAT EXPIRES.** 004 is the entry that gained an
   attachment after publication on *"we have had no visitors"* — a licence that
   ends when an audience arrives. **Ruling 18 records the licence AND its
   expiry**, in those words, so deleting the comment loses neither half.

   ── FOUR OF THE SEVEN ARE DUPLICATES OF ONE DOCUMENT ───────────────────────
   `docs/MUSEUM_RULINGS_APPLIED_LOG-20260820.md` § 004 carries the deck line
   change, the `OTHER` strike with *"YOU ADDED A THUR"*, and `ADDENDUM 01 -
   Bench Description` — the last two nearly verbatim. `docs/canon/09-PUBLISHED.md`
   carries the password and Zu Chongzhi's ratio, the folder listing, the struck
   titles and *"not meant to seen"*; `docs/canon/06-PORTAL.md` carries the
   engraved legends, the inspection date's refusal, and — at its own § — the
   record that Mike's rewrite took the museum's half of the unattended-terminal
   disagreement with it. Rulings 18 and 19 carry the back-post, the `.tif`/`.webp`
   split and the filename; `MUSEUM_QC101_ATTACHMENT_LOG-20260821.md` carries the
   title he ruled and why the attachment takes no number. The `listingRows()`
   mechanism is at `RecordEntry.jsx`, in the code it describes.

   ── AND THREE THINGS WERE WRITTEN DOWN NOWHERE ELSE, ALL IN ONE BLOCK ──────
   All three are in `[2026-08-20] THE TWO ATTACHMENT ROWS ARE STRUCK`, and all
   three are the shape this whole exercise kept finding: **a fact about how a
   mechanism behaves, which no register field holds.**

   1. **`Manual ref to Portal` IS `SCAN 11 - VID-LINK`, WHICH RECORD 003 HAD
      ALREADY DELIVERED** — so keeping it would have said the museum does not
      have a thing it showed the day before. That is Ruling 10 failing in a
      direction its own examples do not cover, and it is **at Ruling 10** now,
      with the test that catches it.
   2. **`held` IS A FALL-THROUGH THAT CLAIMS A PROVENANCE.** Both rows recorded
      none, so `attachmentsOf()` built a meta line reading `not here yet` and
      nothing else — empty-and-unsourced rather than empty-and-honest. **At
      `src/lib/record-model.js`, beside `docState`.**
   3. **THE STRIKE COST NO PROSE, AND THAT WAS MEASURED** — six search terms,
      zero hits, and the one backward reference still lands on 003's delivered
      scan through his rewrite. **At `09-PUBLISHED.md`, with Record 004.**

   ── WHAT THE FOUR ENTRIES TAUGHT, IN ONE LINE ──────────────────────────────
   002 was duplicate throughout; 003 kept one sentence, 005 one paragraph, 004
   three findings — **and every survivor was a fact about a MECHANISM'S REASON
   TO EXIST.** Rulings, strikes and his words all had homes already. What had
   none was why a thing works the way it does, and that is worth knowing before
   the next round reaches for a comment block. */
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
                    + " ZIP File Cracked",
              sections: [
                { label: "EXECUTIVE SUMMARY",
                  body: [
                    "  > Weird.Baby uptime: 100%, no anomalies - f(Ump) = "
                    + "100%\n  > Blockers - Nothing to Report",
                  ] },
                { label: "DETAILED REPORT",
                  body: [
                    "  > ZIP Password Cracked: [355113]",
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
                    "  > Install document looks proprietary. Probably not "
                    + "meant to seen.\n  > QC RULE: Unsafe to run in any "
                    + "sandbox; permanently quarantined.",
                  ] },
              ],
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
              title: "PORTAL CONNECTION ONLINE",
              line: "> Portal Data Link - Connection Achieved\n> ZIP "
                    + "Extraction - Outer Layers Complete / Stopped",
              sections: [
                { label: "EXECUTIVE SUMMARY",
                  body: [
                    "  > Portal appears to function. Intended purpose "
                    + "unknown.\n  > ZIP - We have reached the capability limit"
                    + " of brute force.",
                  ] },
                { label: "DETAILED REPORT",
                  body: [
                    "  > Portal is now up and running on our UNIX-6x "
                    + "Emulator.\n  > It carried its own COMM payload, "
                    + "autosync, etc.\n  > The Portal is accessible via the "
                    + "Robots Exhibit.",
                  ] },
                { label: "OTHER",
                  body: [
                    "  > APPROVED - Req 0628 - Internal Transfer - No net "
                    + "increase in head count",
                  ] },
              ],
              /* ═══ [2026-08-26] THE SHORTCUT — MIKE'S OWN ASK ════════════════
                 **"R005 - ADD attachment: Shortcut to the Feed screen, but
                 under the theatre that you are running a .bat file to run the
                 .exe via UNIX 6x, or whatever it was named."**

                 THE FILENAME IS RECORD 004'S AND THERE IS NO `.bat`. That
                 entry's cracked-ZIP listing carries three files —
                 `TERMINAL.EXE`, `PORTAL_2v16.CFG`, `QC_101.TIF` — and a search
                 of both repositories returns **zero** in-story `.bat`. So the
                 file that runs is the one that is there. Nothing was invented
                 to stand in front of it (Doctrine 12), and `or whatever it was
                 named` is answered by the listing rather than by Ops.

                 IT IS AN ATTACHMENT WITH NO PICTURE, WHICH IS THE HONEST SHAPE.
                 A program has no scan. It draws the document glyph and its own
                 name, and the name is the control.

                 THE EVENT IS DELIBERATELY NOT `wb-robots-open-twin`. This
                 module is PUBLIC — `robots.js` imports it — and the console's
                 declaration lives in `portal.js`, which is loaded as its own
                 chunk by `Robots.jsx` and by nothing else. Naming the full
                 detail here would drag the Portal's whole panel declaration
                 into the public entry and collapse a split the album's
                 architecture rests on. So this asks, and the one module that
                 already holds `portal.js` answers. Same seam the panel and the
                 channel strip use: **the button asks; it does not answer.** */
              docs: [
                { title: "TERMINAL.EXE",
                  source: "ROOT/PORTAL",
                  extract: "Runs on the UNIX-6x Emulator. Reads "
                           + "PORTAL_2v16.CFG.",
                  door: { event: "wb-portal-run-console" } },
              ],
            },
];
