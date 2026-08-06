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
/* [D1 2026-08-06] TWO OF THIS ROOM'S ANSWERS ARE THE HOUSE'S, NOT THE BOOTH'S.
   "Who keeps this place?" was retyped onto /wb's ABOUT THE ARTIST register at
   P9, so one sentence about the keeper existed in two rooms with no link
   between the copies. Both now read `KEEPER`. `CONTACT` is declared beside it
   for the same reason — see src/data/house-copy.js. */
import { KEEPER, CONTACT } from "../data/house-copy.js";

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
  {
    /* [B5 2026-08-05] THE TWO SENTENCES SWAPPED PLACES AND NOTHING ELSE
       CHANGED. It used to say "Some of it is ours" first. Mike's sweep: lead
       with the artist, not the house. The room built the other way round —
       Other Music Worth a Listen — is the larger half of what is here and it
       was reading second in the museum's own first answer. */
    q: "What is this place?",
    a: "A museum. It keeps things worth keeping — records, photographs, " +
       "machines, the paper that came with them — writes cards for them, and " +
       "puts them where anybody can walk up and look. Some of it belongs to " +
       "people we admire and is here because somebody in this house loves " +
       "it. Some of it is ours.",
  },
  {
    /* [B5 2026-08-05] IT OPENED BY RESTATING THE CREDO 400px ABOVE IT. "No
       ticket, no tier, no ads" is the placard's "No tickets, no tiers, no
       ads", set again in smaller type — the page explaining what the page
       already says. What survives is the part the credo does NOT carry: that
       there is no account, that nothing is walled, and that this is a standing
       arrangement rather than an offer. */
    q: "Is it really free?",
    a: "Yes — and there is no account to make, nothing to unlock, and " +
       "nothing behind a wall. Sign the guest book if you feel like it; " +
       "nothing anywhere on the site asks you for anything else. That is not " +
       "an introductory offer. It is the arrangement.",
  },
  /* ==== [N5 2026-08-04 · B2 2026-08-05] "ARE YOU TRACKING ME?" =============
     MIKE (N5): "answered honestly — no login, what cookies do, what we keep
     (nothing), written against worker.js not against goodwill."
     THE OLD QUESTION WAS REPLACED RATHER THAN JOINED, because it asked the same
     thing less sharply ("Do I have to sign in? Are you watching me?") and two
     near-identical questions on one list is worse than one good one.

     ═══ [B2 2026-08-05] IT WAS TRUE AND IT WAS UNDERSELLING THE TRUTH ════════
     MIKE: "cookies and stored settings are different things — a cookie is SENT
     TO THE SERVER on every request, which is what makes it tracking;
     localStorage never leaves the browser unless code ships it, and ours
     doesn't. Both are true at once: this site sets no cookies AND settings
     persist between sessions. Say the stronger, truer thing: THE MACHINE
     REMEMBERS YOU AND WE DON'T."

     N5's answer folded that into eleven words — "a panel width, whether you
     have already walked through a room this visit" — and filed it under things
     to reassure the visitor about. It is the most interesting fact on the page:
     the MGK in the robot wing holds a visitor's NAME and BIRTH DATE, and it
     holds them somewhere we cannot reach. Reading that as small print made the
     answer weaker than the architecture it was describing.

     ═══ AND CHECKING IT AGAINST THE CODE FOUND THE ANSWER WRONG. AGAIN. ══════
     N5 found the previous answer's "that is the whole of it" false, because
     `index.html` ships a Google Fonts `<link>`. N5's own replacement then said
     Google was "the only outside party this site touches", and MEASURED IN A
     BROWSER that is false TWICE OVER. Read off
     `performance.getEntriesByType('resource')` on every room, each after a
     nine-second settle, with nothing clicked:

       `/`, `/booth`, `/shop`, `/foundation`, `/hr/archive`
                                    Google Fonts, and nothing else.
       `/robots`, `/wal`, `/wb`     + `www.youtube.com` ×3.
       `/hr`                        + `www.youtube.com` ×3
                                    + `www.facebook.com` ×16, in 17 iframes.

     YouTube arrives because `Exhibit.jsx:333` injects `iframe_api` and the
     player mounts an embed with it — ON LOAD, not on play. Facebook arrives
     because the Hunter Root artifact grid renders `hr-card-fbembed` cards
     through `HrExhibitFlow.jsx:2110`'s `facebook.com/plugins/` URL, and the
     wing has seventeen of them.

     ═══ [R6 2026-08-06] M37 IS RULED — OPTION A, DISCLOSE — AND THE FOURTH
     MEASUREMENT CORRECTED THE THIRD CLAUSE. ══════════════════════════════════
     MIKE: "the FAQ states plainly that YouTube (and any other embed host) is
     contacted when those pages load. Disclosed, not deferred, not
     click-to-load." So this answer IS the remedy, which makes its accuracy the
     whole of the remedy — and re-measuring it on the built bundle this round
     found the Facebook half slightly wrong AGAIN, in the museum's own favour.
     `/hr` ON ARRIVAL, nine seconds, nothing clicked, nothing scrolled:
     Google Fonts, `www.youtube.com` ×3, and FACEBOOK ZERO. The sixteen plugin
     frames carry `loading="lazy"` (HrExhibitFlow.jsx:2240) and the cards sit
     below the fold, so they arrive when a visitor SCROLLS the room — which is
     still nothing they pressed, but it is not "the same way" as the player and
     this answer said it was. Scrolled to the bottom: `www.facebook.com` ×16, 17
     iframes, exactly as v53 recorded. v53's own reading was taken with the deck
     already open, which is why it read as arrival.
     THE CLAUSE NOW SAYS WHEN. It is a weaker-sounding sentence and a truer one,
     and the direction of the error is the reason it is worth a note: three of
     the four versions of this clause have understated what leaves the building.
     THAT IS THE THIRD OUTBOUND CLAUSE THIS ONE ANSWER HAS HAD, AND THE FIRST
     TWO WERE BOTH WRONG, and all three were written by people who meant them.
     The reason is mechanical and worth stating once: a grep of `src/` finds
     the STRING, and every one of these strings was findable. Only loading the
     page finds the REQUEST. Nothing in the source says "unprompted, on
     arrival" — that sentence exists only in the network panel.

     EVERY CLAUSE IS FALSIFIABLE BY READING ONE FILE OR RUNNING ONE PROBE:
       · no login — `src/worker.js` has no auth of any kind, on any route.
       · no cookies — no `Set-Cookie` anywhere in the worker, no
         `document.cookie` anywhere in `src/`, and none in
         `public/robots/twin.html` either. The site sets none at all.
       · what is written — `POST /api/visits` inserts `(page, referrer,
         visited_at)` and nothing else, fired from exactly two components: the
         lobby (`WbHome.jsx:278`) and the exhibit shell (`Exhibit.jsx:2163`).
         `/booth` itself writes nothing.
       · the guest book — `POST /api/guestbook` inserts name, note, a fixed
         badge string and a timestamp. Exactly what was typed.
       · the machine's record — the twin persists SEVEN localStorage keys
         (`wbr_user`, `wbr_health`, `wbr_parcel`, `wbr_santa`, `wbr_son_best`,
         `wbr_bs`, `wbr_boot_level`) and THREE sessionStorage keys, listed in
         `Rec_Keys_Local` / `Rec_Keys_Session`. It is same-origin with the
         museum, so those keys sit in weird.baby's own storage — CONFIRMED in
         the browser, where `wbr_boot_level`, `wbr_health`, `wbr_parcel` and
         `wbr_son_best` read back off the museum's origin. The twin contains
         ZERO `fetch` and ZERO `XMLHttpRequest`: it has no way to send them.
       · the register — `Preferences ▸ User ▸ GO>` in the twin's own menu
         (`MENU_TABLE_SRC`), five pages of what is held, and a shake on the
         last one purges every key named above.
       · the museum's own settings — **[P5 2026-08-05] AND THIS CLAUSE WAS
         REWRITTEN BECAUSE THE CODE UNDER IT MOVED, WHICH IS THE RULE THIS
         ANSWER LIVES BY.** Mike's site-wide ruling makes every VIEW setting
         last the session and no longer: panel splits (`wb-*-split`), carousel
         and viewer heights (`wb-*-cfh`, `wb-*-body`), /hr's deck width
         (`wb-hr-deck-width`) and the per-room arrival flags (`wb-arrived:*`)
         are ALL `sessionStorage` now. Two things are deliberately still
         `localStorage` and the answer names both rather than rounding down:
         `wb-hr-presets`, the slots a visitor saved themselves, and
         `wb-read-<wing>`, which records of ours they have opened — the register
         behind the Record's UNREAD button (src/lib/record-read.js). Read where
         they sit; never transmitted. Verified by grep: `localStorage` appears
         in `src/` at exactly those two call sites.
     THE SCOPE OF THE CLAIM IS STILL DELIBERATELY "WHAT THIS SITE RECORDS", not
     "what any machine between you and it can see". The second is not knowable
     from this repository, and a privacy answer that overreaches by one clause
     is the same defect as one that hides a clause. */
  {
    q: "Are you tracking me?",
    a: "No — and the better half of the answer is that the machine remembers " +
       "you and we don't. Cookies first, because they are what people mean: a " +
       "cookie goes back to the server with every request your browser makes, " +
       "which is the part that makes it a tracking device. This site sets " +
       "none. Not one, not even ours. Settings are a different mechanism " +
       "entirely — they sit in your own browser and are read where they sit, " +
       "so both of these are true at once: nothing follows you back to us, and " +
       "the panel you dragged wider is still wider when you come back to the " +
       "room. Most of them last the visit and go when the tab closes. Two " +
       "outlast it, and they are the two that would be useless otherwise: the " +
       "presets you saved yourself, and which records of ours you have already " +
       "opened. What reaches us is two things. The lobby and the exhibit " +
       "rooms each write one line when they load — which page, the site you " +
       "came from if there was one, and the time — and none of those three " +
       "columns is you. Sign the guest book and we keep exactly what you " +
       "typed, on the page you typed it into. The MGK keeps far more than we " +
       "do, and it keeps it on your side of the glass: run it in the robot " +
       "wing and it will remember your name, your birth date, how far into " +
       "its install you got, its own condition and your best score — none of " +
       "which it can send anywhere, because it has no way to reach us at all. " +
       "It will also show you. Preferences ▸ User is the machine's register of " +
       "everything it holds about you, page by page, and the last page wipes " +
       "the lot on the spot. Three things do leave the building, and you " +
       "should know which. The typefaces are served by Google, so your " +
       "browser asks Google for them and Google sees it was asked. The rooms " +
       "with music in them load YouTube's player when the room loads, before " +
       "you press anything. And one exhibit carries posts embedded from " +
       "Facebook, which arrive as they scroll into view — later than the " +
       "player, and still nothing you pressed. Google, YouTube and Facebook " +
       "each know you turned up, and they are the whole of the outside. There " +
       "is no analytics, no advertising and no tracking pixel anywhere in " +
       "this site, and if that ever stops being true, this answer changes " +
       "first.",
  },
  {
    q: "Who keeps this place?",
    a: KEEPER,
  },
  {
    q: "How does something get in here?",
    a: "Somebody in this house loves it, and then the work starts: finding " +
       "it, checking it, photographing it, and writing down where it came " +
       "from. Nothing is exhibited because it is popular and nothing is " +
       "exhibited because it paid to be. [PAPA] — whether the museum ever " +
       "takes submissions, and on what terms, is Papa's call and is not " +
       "settled.",
  },
  {
    q: "Are you affiliated with the artists you show?",
    a: "No. The artists in Other Music Worth a Listen are not partners, " +
       "clients, or signings — they are people whose records we think you " +
       "should hear. Every door on their page leads to their own site, their " +
       "own store, their own channel, because the exhibit is a pointer and " +
       "not a home. [PAPA] — the formal statement of that relationship, if " +
       "one is ever needed, is Papa's to write.",
  },
  /* [B3 2026-08-05] "What are the rooms?" and "There is a gift shop. What is
     it?" WERE HERE AND ARE DELETED. See the head of this list for the ruling.
     They are named in the round log and in docs/OPEN_ACTIONS.md rather than
     removed in silence, which is what the Law of Subtraction requires. */
  {
    /* [B4 2026-08-05] IT LED WITH OURS. MIKE: "it currently leads with what is
       OURS, which reads possessive and awkward — lead with THEIRS IS THEIRS,
       then fold ours in behind, simply and gladly."
       The old first clause also had to defend itself in the same breath
       ("ours is not all inclusive"), which is the shape an answer takes when
       it opens on the wrong subject. Opening on the artists lets the museum's
       half be one short sentence instead of a qualification. */
    q: "Can I use what is here?",
    a: "The artists' work is the artists' — their music, their pictures, " +
       "their words — and every door on their pages goes to them rather than " +
       "to us. What is ours is the photographs of our own objects, taken here " +
       "and printed here, and we are glad to be asked for those. When in " +
       "doubt, write; the address is at the bottom of this page. [PAPA] — a " +
       "plain licence for the museum's own images is Papa's to set.",
  },
  {
    q: "Is it finished?",
    a: "No, and it is not meant to be. A museum that stops accessioning is a " +
       "storage unit. Rooms open, cards get written, and things arrive; if " +
       "you come back, there will be more than there was. [PAPA] — how often " +
       "new work lands, and whether that is a promise, is Papa's to say.",
  },
  {
    /* [D2 2026-08-06] MIKE'S OWN WORDING, RULED, AND THE TWO SENTENCES BEHIND
       IT ARE STRUCK. "It is read by the person who keeps the place" restated
       the keeper answer four rows up — the page explaining what the page
       already said, which is the shape B5 struck twice on this same list. And
       "Corrections are especially welcome — if we have got something wrong
       about a record, a date, or a person, we would rather know" was the museum
       advertising its own diligence, which is the subject Doctrine 11 keeps off
       the glass and which the WAL poster's foot was struck for one round ago.
       He asked for plain and no ceremony; the answer is now one line and the
       address is the whole of it. Declared in house-copy.js, not here — see
       the import at the head of this file. */
    q: "How do I reach you?",
    a: CONTACT,
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
        <div className="sheet-words">
          <p>No tickets, no tiers, no ads.</p>
          <p>The museum owns nothing and takes nothing.</p>
        </div>

        <div className="sheet-rule" />

        {/* THE FAQ IS THE PAGE. Every question visible; the answer opens under
            the question that asked it. Native <details>, so it works with a
            keyboard, with a screen reader, and with JavaScript having a bad
            day — the platform mechanic rather than a custom one (Doctrine 8). */}
        <div className="sheet-faq">
          <h2 className="sheet-faq-head">Questions</h2>
          {faq.map(({ q, a }) => (
            <details key={q} className="sheet-q">
              <summary>{q}</summary>
              <p className="sheet-faq-a">{a}</p>
            </details>
          ))}
        </div>

        <div className="sheet-rule" />

        <p className="sheet-contact">
          Thank you for coming.{" "}
          <a href="mailto:papa@weird.baby">papa@weird.baby</a>
        </p>
        {/* One quiet way back, in the prose, for a visitor who has read to the
            bottom and does not want to travel back up to the bar. Not a second
            exit competing with the first — a sentence. */}
        <p className="sheet-back">
          <Link to="/">Back to the lobby</Link>
        </p>
      </div>
    </div>
  );
}
