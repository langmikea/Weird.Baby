// src/routes/InfoBooth.jsx — the INFORMATION BOOTH (/booth).
//
// [M3 2026-08-03] THE FAQ IS THE PAGE.
//
// MIKE: "remove the FAQ and Lobby buttons. The FAQ IS the page — every question
// listed; clicking a question expands its answer in place."
//
// WHAT WAS WRONG WITH THE OLD ROOM. It was a placard with two buttons under it,
// and the buttons were the problem twice over. "Lobby" duplicated the exit that
// <MuseumBar> has carried in its top-right corner since the room convention was
// established — two ways out of a room with nothing in it. And "FAQ" was a
// button whose entire job was to reveal that there WAS an FAQ: a visitor who
// did not press it never learned the museum had answers, which is the
// NO-HIDDEN-INFORMATION LAW's exact complaint — "people will not flick to
// discover whether something is interesting."
//
// WHY THE ACCORDION IS NOT THE SAME SIN. The law forbids controls that hide
// whether something is worth reading. Every question is on the page, in full,
// at once; a question IS the description of its own answer, which is the one
// thing "Next ›" can never be. Expanding in place is reading, not paging — the
// visitor never leaves the list and never loses their place in it.
//
// THE REGISTER IS THE FRONT PAGE'S (personality map, 2026-08-03): short,
// concise, don't scare anyone, heavily philanthropic. Welcoming,
// weird-but-not-scary, free and open to everyone, always. Nothing here
// bargains, qualifies, or asks the visitor for anything.
//
// [PAPA] MARKERS ARE SCRUBBED HERE TOO — see src/lib/visitor-prose.js. This
// room is not an exhibit, so P5's scrubber (which lived inside Exhibit.jsx)
// could not reach it, and the first marker written below would have printed on
// the page. The markers ARE Mike's to-do list and they stay in the data.
//
// [L3 2026-08-02] Token conformance: 22 hard-coded colours here now read their
// `--wb-*`. Three have no token and are listed in that round's log.

import { Link } from "react-router-dom";
/* [E4 2026-08-03] TWO SHEETS, AND THE ORDER IS THE POINT. `sheet.css` is the
   house's document-room furniture — the root, the card, the credo, the rule,
   the questions, the foot — shared with /foundation. `InfoBooth.css` is now
   only what is this room's own: its page ground and its ADMIT ONE ticket. The
   file used to hold both, which meant a file named for one room owned the
   typography of two. */
import "../styles/sheet.css";
import "./InfoBooth.css";
import { useRoom } from "../lib/use-room.js";
import { useArrival } from "../lib/use-arrival.js";
import MuseumBar from "../components/MuseumBar.jsx";
import { visitorProse, kept } from "../lib/visitor-prose.js";
/* [2026-08-17] see the affiliation answer below — hoisted on his ruling that
   /wal takes the booth's wording exactly. */
import { AFFILIATION } from "../data/house-copy.js";
/* [2026-08-11] `launched` IS NO LONGER IMPORTED. Its only caller here was the
   red notes block’s stage gate, which is deleted; the STAGE still governs
   this file through `placed()` on the data side and through `wb-ops-notes`
   in vite.config.js, neither of which is imported at this seam. */
/* [D1 2026-08-06] TWO OF THIS ROOM'S ANSWERS ARE THE HOUSE'S, NOT THE BOOTH'S.
   "Who keeps this place?" was retyped onto /wb's ABOUT THE ARTIST register at
   P9, so one sentence about the keeper existed in two rooms with no link
   between the copies. Both now read `KEEPER`.
   [D 2026-08-11] `CONTACT` was the third and is gone with the address. */
/* [F1 2026-08-06] the two fixed ends of the FAQ format, which this room is the
   original of and which four wing FAQs now print too — see faq-face.js. */

/* ─── THE QUESTIONS ─────────────────────────────────────────────────────────
   Ordered the way a stranger meets the building: what is this, what does it
   cost, what does it keep about me, who is behind it, how does anything get
   in, whose is it, can I use this, is it finished, how do I say something.

   [B3 2026-08-05] TWO QUESTIONS ARE DELETED AND NOT REPLACED. MIKE: "both read
   as forced." "What are the rooms?" was answered by the DIRECTORY on the front
   page, which lists every room by name and takes one click; "There is a gift
   shop. What is it?" was answered by the shop, which is one of those rows. A
   FAQ that explains what the building already shows a visitor is asking them to
   read a description of a door they are standing in front of. Struck under THE
   LAW OF SUBTRACTION — nothing is lost that a reader would miss, and the
   [PAPA] the shop answer carried (what the house does with what its own shelf
   earns) is a question about the Foundation rather than about the shop, so it
   goes with the paragraph rather than moving to another one.

   ANSWERED FULLY where the answer is a fact this repository already knows.
   MARKED [PAPA] where the answer is a POSITION rather than a fact — a policy,
   a promise, or a sentence that speaks for Mike. Those answers still say the
   most honest thing that can be said today; the marker names the part that is
   his to rule, and the visitor never sees the marker.

   "WHERE DOES THE MONEY GO?" IS DELETED AND NOT REPLACED. Mike: "KILL it —
   placeholder, wrong question." He is right that it is the wrong question: it
   invites a visitor to imagine there is money moving through here, and the
   honest shape of the shop is a set of links to the artists' OWN stores. The
   shop question below asks what the shop IS, which is the answerable half. */
const FAQ = [
  /* ═══ [2026-08-15] MIKE'S REWRITE — HIS TEN QUESTIONS, VERBATIM ════════════
     MIKE: "The museum FAQ. Mike's text, verbatim. Do not edit, smooth or
     reorder. Replace what is there."
     Quoted in full in docs/MUSEUM_SITE_CHANGES_LOG-20260815.md, which is the
     source every MIKE row this round cites.

     THE LINE BREAKS ARE HIS AND THEY DRAW. `
` inside an answer is a real
     line break — `.sheet-faq-a` carries `white-space: pre-line`, the same
     mechanism the Record's section body took this morning and the deck has had
     since it was ruled two lines. His "NOTE:" and his lone "Papa@Weird.Baby"
     sit on their own lines because that is where he put them.

     THREE HOUSE PASSAGES ARE NO LONGER READ BY THIS ROOM AND THAT IS A
     CONSEQUENCE WORTH KNOWING. `KEEPER`, `AFFILIATION` and `USE_RIGHTS` were
     imported here and hoisted into house-copy.js precisely so the booth and the
     wing FAQs could not drift. His rewrite gives two of those questions NEW
     wording and drops the third question ("Can I use what is here?") entirely.
     The passages are NOT edited, because they are still printed elsewhere —
     `AFFILIATION` and `USE_RIGHTS` on /wal, `KEEPER` on /wb — and changing them
     to match would silently rewrite two rooms he did not mention.
     SO THE BOOTH AND /wal NOW ANSWER THE AFFILIATION QUESTION IN DIFFERENT
     WORDS. That is Doctrine 17's exact failure mode, arrived at legitimately:
     his instruction is authoritative for this page and only this page. It is
     raised in the round log for him rather than resolved here. */
  /* ═══ [2026-08-16] MIKE'S SECOND PASS, AND THE ROOM IS NOW THE HOUSE'S
         STANDARD TEMPLATE ══════════════════════════════════════════════════
     MIKE: "This page is elegant and clean. This needs to be THE standard
     template for FAQs, and likely for many other things."

     WHAT HE CHANGED, EXACTLY, and nothing else was touched: the "favorite" in
     the first answer, the tracking NOTE's wording, the ordering (contact moves
     LAST), the accession question and its answer, the last line of "Is The
     Museum finished?", and the way out. Two questions were struck. His
     affiliation and 'take a cut' answers and the job-pays-nothing sentence are
     KEPT ON HIS INSTRUCTION and are not re-read here.

     ═══ HARD RULING: NO WRAPPING ═════════════════════════════════════════════
     MIKE: "If my lines are too long, do not wrap them please. I will reword
     them instead." So an answer line that does not fit the column is REPORTED
     TO HIM WITH ITS CHARACTER COUNT and left alone — it is never re-wrapped
     here, and the type is never shrunk to make it fit. That is the opposite of
     what a typographer reaches for and it is the ruling: the line is his and
     the rewording is his.
     THE MECHANISM THAT MAKES IT CHECKABLE is `white-space: pre-line` on
     `.sheet-faq-a` (InfoBooth.css) — his newlines draw, so "does this line
     wrap" is a question with an answer, measured on the glass rather than
     estimated from a character count. */
  {
    q: "What is this place?",
    a: "A museum, of sorts.\n" +
       "A place to freely share my stuff with others.",
  },
  {
    q: "Is it really free?",
    a: "Yes — no accounts or logins. Nothing behind a wall.\n" +
       "That's not an introductory offer. It's the arrangement.",
  },
  {
    /* [2026-08-15] "no cookies" IS DELIBERATELY NOT "no cookies, no nothing".
       MIKE STRUCK THE ABSOLUTE ON 15 AUG: risk abatement begins with risk
       elimination. DO NOT RESTORE IT. A claim that nothing at all is stored is
       one the building cannot keep — see the storage measurement in the round
       log, which was taken before this shipped and is the reason the absolute
       is gone. */
    q: "Are you tracking me?",
    /* [2026-08-16] the NOTE is his new wording. It broadens from "the artists'
       sites" to Social Media AND Artist sites, and it names POLICIES rather
       than sites, which is the more honest claim: what the house cannot speak
       for is what those places DO, not that they exist. */
    /* [2026-08-16b] HIS NEXT PASS, VERBATIM. Two changes and both are his:
       the first line gains `hosts no ads`, and the NOTE names `Artists'
       policies` rather than `Artist site policies` — a policy belongs to the
       artist, not to the site, which is the same broadening the note above
       describes taken one step further. */
    a: "No — Weird.Baby uses no logins, no cookies, hosts no ads.\n" +
       "NOTE: We do not speak for Social Media or Artists' policies.",
  },
  /* [2026-08-16] "So, how does the site always know it is me?" IS DELETED —
     Mike's ruling, no replacement. NAMED ONCE HERE, WHICH IS WHERE A DELETED
     THING IS NAMED (Doctrine 24). Its answer was "Your computer / phone saves
     your information for you. / We never touch it." Nothing true leaves the
     building: the question above it already states that the house uses no
     logins and no cookies, which is the same fact asked from the visitor's
     side. */
  {
    q: "Who keeps this place?",
    /* [2026-08-16b] THREE LINES BECOME TWO — his ruling, and it is a JOIN, not
       a rewording: "The job pays nothing." and "That's the deal, and it never
       changes." are now one line. Same words, same order, one fewer break. It
       is his break to remove, exactly as the two rejoined above were his to
       keep — see the "does the line end mid-sentence?" test in the note there;
       this one ended on a full stop, so it was a decision and only he could
       reverse it. */
    a: "One person — The current Papa Weird.Baby.\n" +
       "The job pays nothing. That's the deal, and it never changes.",
  },
  {
    q: "How do things get in the museum?",
    a: "It gets discovered organically and fits the suit.\n" +
       "PRO-TIP: Just go out and do some good. We're watching.",
  },
  /* ═══ [2026-08-16b] TWO FAKE LINE BREAKS, REJOINED. THEY WERE OPS' AND NOT
         HIS, AND THE DIFFERENCE IS THE WHOLE POINT ══════════════════════════
     MIKE: *"Ops wrapped these lines inside a code block when writing the packet
     and you carried them verbatim, correctly. They are not Mike's line
     breaks."*
     THE ORIGINAL DEFECT WAS DOWNSTREAM OF A CORRECT RULE. `.sheet-faq-a` draws
     `\n` as a real break, and this file's own standing instruction is that his
     newlines are his and are never re-wrapped. Applied to a line that had been
     wrapped by a code block on the way in, that rule PUBLISHED THE WRAPPING —
     "…are not partners, clients," ended a line, and "or signings." began one.
     THE TEST THAT SEPARATES THE TWO, and it is checkable rather than tasteful:
     **does the line end mid-sentence?** A break after a full stop is a decision;
     a break after a comma, or before a line that opens lower-case and completes
     the clause above it, is a wrap. Swept both rooms on that test — the booth
     carried 11 authored breaks and exactly these two failed it; `/foundation`
     carries none at all, because its answers are `lines` arrays landed one
     sentence per element (2026-08-16a).
     NOTHING ELSE IN EITHER ANSWER CHANGED. Same words, same order, one fewer
     break each. */
  {
    /* [2026-08-17] THE ANSWER IS HOISTED AND THIS ROOM NOW READS IT RATHER
       THAN HOLDING IT. Mike ruled that /wal takes the booth's wording exactly,
       which makes it a passage the house says in TWO rooms — Doctrine 17's own
       trigger. `AFFILIATION` in `house-copy.js` IS these words now; editing it
       edits both rooms, which is the point. `F-a` closes.
       NOT ONE CHARACTER CHANGES ON THIS PAGE. The constant carries his line
       break and `.sheet-faq-a` draws it exactly as the literal did. */
    q: "Are you affiliated with the artists you show?",
    a: AFFILIATION,
  },
  {
    q: "Does Weird.Baby 'take a cut' of the Artists' proceeds?",
    /* [2026-08-16b] `gift shop` -> `Gift Shop`, his capitalisation. It is the
       room's NAME here — the bar's own exit reads GIFT SHOP — rather than a
       kind of shop, and the line already capitalises `Artists'`. */
    a: "No — never.\n" +
       "Every door in the Gift Shop leads to the Artists' own sites and stores.",
  },
  {
    q: "Is The Museum finished?",
    a: "No — a museum that stops accessioning is a storage unit.\n" +
       "If you come back, there will be more to see.",
  },
  {
    /* [2026-08-15] THE ADDRESS RETURNS, HERE AND NOWHERE ELSE. His ruling
       supersedes the 2026-08-11 strike that removed it sitewide. "Papa@Weird.
       Baby appears HERE and nowhere else. Not footers, not page endings.
       Purpose-placed." A future round that reaches for a contact line in a
       footer is reversing an instruction, not filling a gap.
       [2026-08-16] AND IT IS THE LAST QUESTION NOW — his ruling: "MOVE 'How do
       I contact Weird.Baby? / Papa@Weird.Baby' to LAST, above the return line."
       The address is the last thing the list says before the way out, which is
       where a reader who has read to the bottom is looking. */
    q: "How do I contact Weird.Baby?",
    a: "Papa@Weird.Baby",
  },
];

/* ═══ [M23a 2026-08-04] THE HOOK IS THE TITLE. BOTH OBJECTS ARE DELETED ═════
   MIKE, ruling on the pair N5 built for him to choose between: "the booth image
   dies — BOTH of them. No ticket, no enamel sign, no replacement visual. THE
   TITLE IS THE GRAB, and the copy already says it plainly. A picture arguing
   with text that already works is clutter."

   HE STRUCK BOTH CANDIDATES AND THE QUESTION UNDER THEM. F1's premise was that
   this room was the building's purest failure of the Visual Hook Law — a sheet
   of paper carrying a credo, eleven questions and an address, with nothing to
   look at. N5 accepted that premise and argued only about WHICH object. Mike's
   ruling rejects the premise: the credo IS the object. "The Weird.Baby Museum
   is free. Equally free. Always." set at display size over four short lines of
   plain fact is words presented in a different FORMAT, which is the law's own
   escape clause, and every object N5 or F1 put above it was made out of those
   same words — a picture of the sentence, sitting on top of the sentence.

   THE EXCEPTION IS RECORDED RATHER THAN ARGUED AWAY, on Mike's instruction:
   **a page whose own words are the hook needs no image.** That now stands
   beside the Visual Hook Law, and it is the second time this round it has been
   invoked — /robots' FAQ face lost its tally card under the same reading (see
   robots.js, A5, and register M29).

   WHAT WENT: `BoothTicket`, `BoothSign`, the `?hook=` selector, and all of
   `.booth-ticket-*` / `.booth-sign-*` in InfoBooth.css. The whole of it, in one
   commit, because the lobby's retired `?subtitle=` is this file's own recorded
   lesson about what a shown-then-asked device becomes when it outlives the
   asking. Register row M23's first half closes. */

export default function InfoBooth() {
  /* [R5] this room owns the page ground while it is mounted — see
     src/lib/use-room.js and the header of this route's stylesheet. */
  useRoom("booth");
  /* [M2] first visit of the session opens at the top; a return keeps the
     question the visitor had open and the place they were reading. */
  useArrival("booth");

  /* Scrubbed at the render seam, exactly as the exhibit does it: the sentence
     carrying the marker is dropped, the rest of the answer stands. An answer
     that were ever ENTIRELY a marker would vanish rather than print one — the
     `kept` filter is what makes that true. */
  const faq = FAQ
    .map(({ q, a }) => ({ q: visitorProse(q), a: visitorProse(a) }))
    .filter(({ q, a }) => kept(q) && kept(a));

  return (
    <div className="sheet-root">
      {/* TITLE BAR — museum-standard: brand / room / Lobby.
          [M3] This is the reason the "Lobby" button below it is gone: the exit
          is here, top-right, in every room of the building. */}
      <MuseumBar room="Information Booth" />

      <div className="sheet-card">
        {/* ==== THE ROOM'S HOOK IS THE NEXT ELEMENT ============================
            [M23a 2026-08-04] There is no object above the credo any more and
            there is not meant to be — see the ruling at the head of this file.
            The credo is the landing. */}

        {/* THE PLACARD. Mike's words, unchanged in substance.
            [M3] THE LINE BREAKS ARE GONE. Mike: "the line breaks on this page
            read awkwardly." They were literal <br /> tags — a break authored
            for one window, printed at every window, so the credo's three beats
            landed wherever the tag fell rather than where the line wanted to
            end. The beats survive as what they always were: separate lines of
            type, each its own element, set on a measure narrow enough that
            they cannot collide. The room now breaks where the reader is, not
            where a tag is. */}
        <h1 className="sheet-credo">
          <span>The Weird.Baby Museum is free.</span>
          <span>Equally free. <em>Always.</em></span>
        </h1>
        {/* ═══ [M 2026-08-14] THE TWO LINES UNDER THE CREDO ARE STRUCK, AND
                THE RULE UNDER THEM WITH THEM ═══════════════════════════════
            MIKE: "Delete 'The museum owns nothing and takes nothing.' Delete
            the no-ads line and the separator. Title stays, dressed down."
            NAMED ONCE, HERE, WHICH IS WHERE A DELETED THING IS NAMED
            (Doctrine 24): the block was `<p>No tickets, no tiers, no ads.</p>`
            and `<p>The museum owns nothing and takes nothing.</p>`, followed by
            a 52px gold rule.
            NOTHING TRUE IS LOST FROM THE BUILDING. Both statements are answered
            at length by questions on this same page — the no-advertising claim
            by the question about embeds and tracking, and the owns-nothing claim
            by the Foundation's whole wing — so what goes is a summary printed
            above the thing it summarises, which is Doctrine 25's own shape.
            `.sheet-words` and `.sheet-rule` STAY IN sheet.css: the second rule
            below is still drawn, and the shared sheet is not this room's to
            prune. */}


        {/* THE FAQ IS THE PAGE. Every question visible; the answer opens under
            the question that asked it. Native <details>, so it works with a
            keyboard, with a screen reader, and with JavaScript having a bad
            day — the platform mechanic rather than a custom one (Doctrine 8). */}
        {/* [F1 2026-08-06] THE HEADING IS THE SAME DECLARATION EVERY WING'S FAQ
            PRINTS. It was typed here and typed nowhere else, because nowhere
            else printed it; four wing FAQs print it now, so it is one string in
            `src/data/faq-face.js` and this room reads it — Doctrine 17 applied
            the moment a passage stopped belonging to one room. */}
        <div className="sheet-faq">
          {/* [D 2026-08-11] the "Questions" heading is struck here too —
              Mike's ruling covers all five faces, the booth included. */}
          {faq.map(({ q, a }) => (
            <details key={q} className="sheet-q">
              <summary>{q}</summary>
              <p className="sheet-faq-a">{a}</p>
            </details>
          ))}
        </div>

        <div className="sheet-rule" />

        {/* [D 2026-08-11] THE SIGN-OFF IS DELETED, sitewide, on Mike's ruling —
            no replacement. The rule above it is kept: it closes the question
            list, which it did before the sign-off was ever added. */}
        {/* One quiet way back, in the prose, for a visitor who has read to the
            bottom and does not want to travel back up to the bar. Not a second
            exit competing with the first — a sentence. */}
        <p className="sheet-back">
          {/* [2026-08-16] "Return to the lobby" — Mike's wording. */}
          <Link to="/">Return to the lobby</Link>
        </p>
        {/* [2026-08-11] THE RED NOTES BLOCK IS DELETED — Mike's ruling. It
            stood here, below the exit. The lift that filled it, the four
            `[PAPA]` sentences it showed and the stylesheet rules all went in
            the same edit; see the note at `scrubFace` in Exhibit.jsx. */}
      </div>
    </div>
  );
}
