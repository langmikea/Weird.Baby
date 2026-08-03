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
import "./InfoBooth.css";
import { useRoom } from "../lib/use-room.js";
import MuseumBar from "../components/MuseumBar.jsx";
import { visitorProse, kept } from "../lib/visitor-prose.js";

/* ─── THE QUESTIONS ─────────────────────────────────────────────────────────
   Ordered the way a stranger meets the building: what is this, what does it
   cost, who is behind it, how does anything get in, whose is it, what are the
   rooms, what is the shop, can I use this, is it finished, how do I say
   something.

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
    q: "What is this place?",
    a: "A museum. It keeps things worth keeping — records, photographs, " +
       "machines, the paper that came with them — writes cards for them, and " +
       "puts them where anybody can walk up and look. Some of it is ours. " +
       "Some of it belongs to people we admire and is here because somebody " +
       "in this house loves it.",
  },
  {
    q: "Is it really free?",
    a: "Free. No ticket, no tier, no account, no ads, and nothing behind a " +
       "wall. There is a guest book you can sign if you feel like it, and " +
       "nothing anywhere on the site asks you for anything else. That is not " +
       "an introductory offer. It is the arrangement.",
  },
  {
    q: "Do I have to sign in? Are you watching me?",
    a: "There is nothing to sign in to. We count which rooms get walked " +
       "through — the page, and the site you came from, if any — so we know " +
       "the lights are worth leaving on. That is the whole of it: no " +
       "accounts, no profiles, nothing that follows you anywhere. If you sign " +
       "the guest book, we keep exactly what you typed into it.",
  },
  {
    q: "Who keeps this place?",
    a: "One person — Papa Weird.Baby. The job pays nothing, the museum never " +
       "pays to be managed, and only zero-invoice services are accepted. " +
       "That's the deal, and it never changes.",
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
  {
    q: "What are the rooms?",
    a: "Weird.Baby Robots is the machine wing — one unit, photographed, " +
       "documented, and running. Weird.Baby Music is the house's own " +
       "recordings. Other Music Worth a Listen is the room built the other " +
       "way around: nothing in it is ours, and that is the point. This booth " +
       "is where the house explains itself.",
  },
  {
    q: "There is a gift shop. What is it?",
    a: "Mostly a set of doors to the artists' own stores, so that if a room " +
       "made you want to buy a record, the money reaches the person who made " +
       "it and not us. The museum's own shelf is small and honest — a " +
       "sticker, at the moment. [PAPA] — what the house does with anything " +
       "its own shelf earns is Papa's to state.",
  },
  {
    q: "Can I use what is here?",
    a: "The photographs of our own objects are ours, taken here and printed " +
       "here, and we are glad to be asked. Everything belonging to the " +
       "artists belongs to the artists — their music, their pictures, their " +
       "words — and the doors on their pages go to them. When in doubt, ask; " +
       "the address is at the bottom of this page. [PAPA] — a plain licence " +
       "for the museum's own images is Papa's to set.",
  },
  {
    q: "Is it finished?",
    a: "No, and it is not meant to be. A museum that stops accessioning is a " +
       "storage unit. Rooms open, cards get written, and things arrive; if " +
       "you come back, there will be more than there was. [PAPA] — how often " +
       "new work lands, and whether that is a promise, is Papa's to say.",
  },
  {
    q: "How do I reach you?",
    a: "Write to papa@weird.baby. It is read by the person who keeps the " +
       "place. Corrections are especially welcome — if we have got something " +
       "wrong about a record, a date, or a person, we would rather know.",
  },
];

export default function InfoBooth() {
  /* [R5] this room owns the page ground while it is mounted — see
     src/lib/use-room.js and the header of this route's stylesheet. */
  useRoom("booth");

  /* Scrubbed at the render seam, exactly as the exhibit does it: the sentence
     carrying the marker is dropped, the rest of the answer stands. An answer
     that were ever ENTIRELY a marker would vanish rather than print one — the
     `kept` filter is what makes that true. */
  const faq = FAQ
    .map(({ q, a }) => ({ q: visitorProse(q), a: visitorProse(a) }))
    .filter(({ q, a }) => kept(q) && kept(a));

  return (
    <div className="booth-root">
      {/* TITLE BAR — museum-standard: brand / room / Lobby.
          [M3] This is the reason the "Lobby" button below it is gone: the exit
          is here, top-right, in every room of the building. */}
      <MuseumBar room="Information Booth" />

      <div className="booth-card">
        {/* THE PLACARD. Mike's words, unchanged in substance.
            [M3] THE LINE BREAKS ARE GONE. Mike: "the line breaks on this page
            read awkwardly." They were literal <br /> tags — a break authored
            for one window, printed at every window, so the credo's three beats
            landed wherever the tag fell rather than where the line wanted to
            end. The beats survive as what they always were: separate lines of
            type, each its own element, set on a measure narrow enough that
            they cannot collide. The room now breaks where the reader is, not
            where a tag is. */}
        <h1 className="booth-credo">
          <span>The Weird.Baby Museum is free.</span>
          <span>Equally free. <em>Always.</em></span>
        </h1>
        <div className="booth-words">
          <p>No tickets, no tiers, no ads.</p>
          <p>The museum owns nothing and takes nothing.</p>
        </div>

        <div className="booth-rule" />

        {/* THE FAQ IS THE PAGE. Every question visible; the answer opens under
            the question that asked it. Native <details>, so it works with a
            keyboard, with a screen reader, and with JavaScript having a bad
            day — the platform mechanic rather than a custom one (Doctrine 8). */}
        <div className="booth-faq">
          <h2 className="booth-faq-head">Questions</h2>
          {faq.map(({ q, a }) => (
            <details key={q} className="booth-q">
              <summary>{q}</summary>
              <p className="booth-faq-a">{a}</p>
            </details>
          ))}
        </div>

        <div className="booth-rule" />

        <p className="booth-contact">
          Thank you for coming.{" "}
          <a href="mailto:papa@weird.baby">papa@weird.baby</a>
        </p>
        {/* One quiet way back, in the prose, for a visitor who has read to the
            bottom and does not want to travel back up to the bar. Not a second
            exit competing with the first — a sentence. */}
        <p className="booth-back">
          <Link to="/">Back to the lobby</Link>
        </p>
      </div>
    </div>
  );
}
