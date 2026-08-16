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
  {
    q: "What is this place?",
    a: "A museum, of sorts.\n" +
       "A place to freely share my favorite stuff with others.",
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
    a: "No — Weird.Baby uses no logins, no cookies.\n" +
       "NOTE: We do not speak for the artists' sites, nor other\n" +
       "social media sites.",
  },
  {
    q: "So, how does the site always know it is me?",
    a: "Your computer / phone saves your information for you.\n" +
       "We never touch it.",
  },
  {
    /* [2026-08-15] THE ADDRESS RETURNS, HERE AND NOWHERE ELSE. His ruling
       supersedes the 2026-08-11 strike that removed it sitewide. "Papa@Weird.
       Baby appears HERE and nowhere else. Not footers, not page endings.
       Purpose-placed." A future round that reaches for a contact line in a
       footer is reversing an instruction, not filling a gap. */
    q: "How do I contact Weird.Baby?",
    a: "Papa@Weird.Baby",
  },
  {
    q: "Who keeps this place?",
    a: "One person — The current Papa Weird.Baby.\n" +
       "The job pays nothing.\n" +
       "That's the deal, and it never changes.",
  },
  {
    q: "How does something get in The Museum?",
    a: "It strikes the Papa Weird.Baby's fancy.\n" +
       "Nothing is exhibited because it is popular or because it\n" +
       "paid to be.",
  },
  {
    q: "Are you affiliated with the artists you show?",
    a: "No — Those exhibited on Weird.Baby are not partners, clients,\n" +
       "or signings.\n" +
       "They are people we feel are Worth a Listen.",
  },
  {
    q: "Does Weird.Baby 'take a cut' of the Artists' proceeds?",
    a: "No — never.\n" +
       "Every door in the gift shop leads to the Artists' own sites\n" +
       "and stores.",
  },
  {
    q: "Is The Museum finished?",
    a: "No — a museum that stops accessioning is a storage unit.\n" +
       "If you come back, there will be more than there was.",
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
          <Link to="/">Back to the lobby</Link>
        </p>
        {/* [2026-08-11] THE RED NOTES BLOCK IS DELETED — Mike's ruling. It
            stood here, below the exit. The lift that filled it, the four
            `[PAPA]` sentences it showed and the stylesheet rules all went in
            the same edit; see the note at `scrubFace` in Exhibit.jsx. */}
      </div>
    </div>
  );
}
