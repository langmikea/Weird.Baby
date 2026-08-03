// src/routes/Money.jsx — WHERE THE MONEY GOES (/money).
//
// [F3 2026-08-03] MIKE: "THE WEIRD.BABY FOUNDATION (new directory section): add
// it to the directory. Use the INFORMATION BOOTH as the template driving its
// FAQ — Mike called the booth AWESOME, so the pattern is proven. Subject
// matter: why we chose to do this, why we are giving all the money away, what
// we feel about billionaires. METHOD: DIG THE ARCHIVE for everything Mike has
// already dictated on this. Build from what exists; [PAPA] where his voice must
// land; nothing invented."
//
// [C2 2026-08-03] AND THEN MIKE RULED ON THE NAME, WHICH IS WHY THIS FILE IS
// NOT CALLED Foundation.jsx. His words: "Foundation" carries a legal
// expectation the charter deliberately refuses, and he wants to stay entirely
// out of any space requiring legal today. The last round built the room, saw
// the same tension, and answered it by making "there is no fund" the first
// sentence on the page — a defensible answer, and the wrong one: it left the
// museum arguing with its own signage. A name that has to be walked back in its
// own first paragraph is a name that costs a visitor something to read.
//
// ─── THE THREE NAMES CONSIDERED, AND WHY THIS ONE ────────────────────────────
//   "Where the Money Goes"  ← CHOSEN. Zero legal freight — it is a direction,
//       not an entity, and no reader has ever expected a filing behind a
//       sentence. It says what is behind the door in the words a stranger would
//       use to ask. And it is not invented for this round: it is THIS HOUSE'S
//       OWN PHRASE for exactly this subject — the W5 ruling in
//       worth-a-listen.js retired the where-does-the-money-go block from the
//       artists' cards on the grounds that it "lives in W.B's own FAQ", and
//       this room is where that FAQ went. The board now reads as a pair: the
//       booth answers what this place IS, this one answers where the money
//       goes.
//   "The Ledger"            — shortest, and it matches the room's own hook. Cut
//       because it implies books, accounts and periods — precisely the
//       machinery the room exists to say does not exist. A visitor arriving at
//       "The Ledger" expects figures to check; the honest figure is one zero,
//       and a name that promises a statement and delivers a placard is the same
//       defect as "Foundation" wearing a different coat.
//   "Nothing Is Kept"       — the charter's own sentence, maximum house voice,
//       no freight at all. Cut on the directory board: a stranger scanning five
//       lines cannot tell what room it is, and M8's law for that board is that
//       the names say what kind of thing each entry is.
//
// The charter's refusal STANDS and is not softened by the rename — the room
// still says there is no fund, no account and nothing set aside. What changed
// is that it no longer has to say it in order to defend its own title.
//
// [C3 2026-08-03] THIS ROOM SHIPS, and Mike ruled why: "no one important is
// going to do real research on us right now; I prefer viewing stuff online."
// THE_CHARTER.md being DRAFT v0.3 is therefore not a blocker — but shipping
// raises the bar on one specific thing, so it was audited line by line before
// this file was saved: NOTHING ON THIS PAGE CLAIMS A LEGAL STATUS, A
// REGISTRATION, OR A TAX TREATMENT. There is no "non-profit", no "501(c)", no
// "registered", no "charitable organisation" applied to US (the phrase appears
// once and it describes the RECIPIENTS), and no suggestion that anything a
// visitor does here is deductible. Q1 states the absence outright rather than
// leaving it to be inferred, because an unanswered "is this a charity?" is
// answered by the visitor's assumptions, and their assumptions are wrong.
//
// ─── WHERE EVERY SENTENCE ON THIS PAGE CAME FROM ─────────────────────────────
// NOTHING HERE IS NEW DOCTRINE. Four sources, all in the tree:
//
//   docs/canonical/THE_CHARTER.md          — What Weird.Baby Is; The Purpose;
//                                            The Law (6 clauses); The Coffers;
//                                            The Beneficiaries; Succession;
//                                            Dissolution; the three Papa quotes
//                                            including the Illionaires line.
//   docs/canonical/CHARTER_RAW_LEDS-       — the sponsors concept, the FULL
//     20260707.md                            METER, "help arrives as the THING",
//                                            and the WeeBee door verbatim.
//   ../weird-baby-robots/STATE.md          — LAUNCH READINESS §R3: the business-
//     (2026-08-02, §R3)                      model doctrine ("unmistakable up
//                                            front, no digging"; "no part of
//                                            W.B materially benefits"), the
//                                            two drafted money answers, and THE
//                                            BILLIONAIRE'S CREDO.
//   src/routes/InfoBooth.jsx               — the answers this house has already
//                                            published on the same subjects, so
//                                            the two rooms cannot contradict
//                                            each other.
//
// ─── STATUS OF THE SOURCE, STATED PLAINLY ────────────────────────────────────
// THE_CHARTER.md reads "DRAFT v0.3 — awaiting Papa's full review. Not
// published." This page is therefore built to the marker discipline rather than
// to a publication decision: every sentence that is a POSITION Papa has not
// ruled carries [PAPA] and is scrubbed at the render seam, so no unruled words
// can reach a visitor. What survives is the part the charter states as settled
// law plus what this museum has already published at /booth.
//
// ─── TEMPLATE ────────────────────────────────────────────────────────────────
// The booth's, deliberately and literally: this file imports InfoBooth.css and
// uses its class names for the sheet, the credo, the rule, the questions, the
// contact line and the way back. Mike named that room as the pattern; the
// strongest form of "use it as the template" is to use the same rules rather
// than a second copy that drifts from them by Tuesday. Only what is NEW here —
// this room's ground and its own visual hook — lives in Money.css.

import { Link } from "react-router-dom";
import "./InfoBooth.css";
import "./Money.css";
import { useRoom } from "../lib/use-room.js";
import { useArrival } from "../lib/use-arrival.js";
import MuseumBar from "../components/MuseumBar.jsx";
import { visitorProse, kept } from "../lib/visitor-prose.js";

/* ─── THE QUESTIONS ──────────────────────────────────────────────────────────
   Ordered the way a stranger meets the subject, which is the booth's own
   ordering principle: what is this, why, where does it go, can I have some, how
   do the lights stay on, can I give you money, what about the shop, what do you
   think of the people who do the opposite, who pays you, what happens after
   you.

   Mike's three named subjects map onto them like this:
     why we chose to do this ................ Q2, Q9
     why we are giving all the money away ... Q3, Q4, Q6
     what we feel about billionaires ........ Q8

   [PAPA] MARKS A POSITION, NEVER A FACT. Where the archive records a settled
   clause of the Law, the answer states it. Where the archive records an OPEN
   QUESTION — the legal form, the credo's own wording, what the shop's shelf
   earns — the sentence carrying it is Papa's and the visitor never sees the
   marker or the sentence. */
const FAQ = [
  {
    /* [C2/C3] WAS "Is this a foundation?", which only had to be asked because
       the room used to be called one. The question a stranger actually arrives
       with is this one, and the answer is the room's licence to ship: it denies
       the registration and the tax treatment in the same breath, so nobody can
       infer either from the museum's silence. */
    q: "Is this a charity?",
    a: "Not in the legal sense, and nothing here is set up to be one. There " +
       "is no registration, no charity number, and no receipt at the end of " +
       "it that does anything to your taxes — because there is nothing here " +
       "to give to. Money does not stop at Weird.Baby, so there is never a " +
       "balance for it to stop in: no fund, no account, nothing set aside. " +
       "The name on the door is the whole of it. Where the money goes is " +
       "out, to somebody else, always. [PAPA] — whether Weird.Baby is ever " +
       "formally incorporated, and as what, is Papa's call and is not settled.",
  },
  {
    q: "Why do this at all?",
    a: "To make the world demonstrably better, and it starts with music: the " +
       "artists who deserve depth, and the people who love them. Everything " +
       "else — the rooms, the cards, the rules on this page — exists to " +
       "protect that one sentence. Methods will be rewritten a thousand " +
       "times. What they are done for was written once.",
  },
  {
    q: "Why give all the money away?",
    a: "Because keeping it was never what any of this was for. Take all you " +
       "need, not grab all you can — and the museum already has what it " +
       "needs. So what passes through Weird.Baby's hands goes to humanity: " +
       "all of it, always, without pause and without pay. It is not a " +
       "donation drive with a target. It is the direction everything moves.",
  },
  {
    q: "Where does it actually go?",
    a: "To established charitable organisations, and to people caught doing " +
       "conspicuous good. Beneficiaries are chosen, never applied to — there " +
       "is no application, no pitch meeting and no grant form, because the " +
       "moment there is one, the people best at filling forms start winning " +
       "instead of the people doing good. [PAPA] — the named organisations, " +
       "and whether the list is ever published, are Papa's to state.",
  },
  {
    q: "How do I get some of that?",
    a: "Honestly: consistently get into the public eye for acting like a " +
       "complete WeeBee. That is the whole process — we find you being " +
       "publicly good. Direct contact hurts your chances, and asking is the " +
       "one thing that has never worked.",
  },
  {
    q: "Then how do the lights stay on?",
    a: "Every cost has a name, a number and a sponsor on the record — the " +
       "domain, the giveaway guitar, the stickers. Each one has a meter, and " +
       "when a cost is covered its meter reads full, its door says we're " +
       "good, thanks, and it closes. No overfilling. No pooling. Not even a " +
       "generous dollar gets held. [PAPA] — the live costs, their numbers and " +
       "their sponsors are Papa's to publish when the meters go up.",
  },
  {
    q: "Can I send money?",
    a: "No, and that is the load-bearing part. Help arrives as the thing " +
       "itself: pay the registrar directly, buy the actual guitar and ship " +
       "it, pay the store to send the stickers. If your help would arrive as " +
       "money in Weird.Baby's hands, it is not help we can take — and we will " +
       "gladly show you the door that is. The proof is structural rather than " +
       "promised: there is no account to fill. There never has been one.",
  },
  {
    q: "There is a gift shop, though.",
    a: "There is, and it is the only place in the building where anything is " +
       "bought or sold. Nearly all of it is doors to the artists' own stores, " +
       "so that if a room made you want a record the money reaches the person " +
       "who made it and not us — we take nothing that is not ours, and the " +
       "artists keep every penny of theirs. The museum's own shelf is small " +
       "and honest: a sticker, at the moment. [PAPA] — what the house does " +
       "with anything its own shelf earns is Papa's to state.",
  },
  {
    q: "What do you think about billionaires?",
    a: "We know the names of the people who kept the most for themselves in " +
       "life. They are the Illionaires — and being remembered for the size of " +
       "the pile is a strange thing to spend a life earning. The museum is " +
       "not interested in fighting over the last piece of pie; it would " +
       "rather make more pie. Why keep grabbing for more? [PAPA] — the credo " +
       "on this is Papa's own and is his to write or to leave unwritten.",
  },
  {
    /* [C3] the charter's clause 3 lists "the design, the code, the shelf, the
       legal work" as the gifts of service. THE LEGAL WORK IS NOT LISTED HERE,
       and the subtraction is deliberate rather than an omission: this page now
       tells a visitor in Q1 that there is no registration and no entity, and a
       room that says that and then mentions its ongoing legal work in the next
       breath is describing machinery it has just denied. The clause is
       unchanged in the charter, which is the document that records what is
       accepted; this is the room, which describes what is here. */
    q: "Who pays you?",
    a: "Nobody. One person keeps this place and the job pays nothing — not " +
       "salary, not expenses, not credit taken. The museum never pays to be " +
       "managed, and only zero-invoice services are accepted: the design, " +
       "the code and the shelf all arrive as gifts of service. That's the " +
       "deal, and it never changes.",
  },
  {
    q: "Do you make anything from the artists you show?",
    a: "No. Not from the song, not from the play, not from the link. There is " +
       "no ad on any page here, no affiliate code in any link, and no cut of " +
       "anything you buy from an artist. Every commercial door in this " +
       "building opens onto their shop, not ours. No part of Weird.Baby " +
       "materially benefits from any of it, and that is checkable from the " +
       "outside: there is nothing to click that pays us.",
  },
  {
    q: "What happens when you stop?",
    a: "One person takes it on — chosen, not elected; willing, not paid — on " +
       "exactly these terms: own nothing, take nothing, keep the place, pass " +
       "it on. There is no committee, no board and no team. And if humanity " +
       "stops believing in what this is for, Weird.Baby does not pivot, " +
       "rebrand or sell. It ends, and the name is retired. What survives is " +
       "the idea; somebody else may begin again, under their own name.",
  },
];

export default function Money() {
  /* [R5] this room owns the page ground while it is mounted — see
     src/lib/use-room.js and the header of this route's stylesheet. */
  useRoom("money");
  /* [M2] first visit of the session opens at the top; a return keeps the
     question the visitor had open and the place they were reading. */
  useArrival("money");

  /* Scrubbed at the render seam, exactly as the booth does it. An answer that
     were ever ENTIRELY a marker would vanish rather than print one — the
     `kept` filter is what makes that true. */
  const faq = FAQ
    .map(({ q, a }) => ({ q: visitorProse(q), a: visitorProse(a) }))
    .filter(({ q, a }) => kept(q) && kept(a));

  return (
    <div className="booth-root mny-root">
      <MuseumBar room="Where the Money Goes" />

      <div className="booth-card">
        {/* ==== [F1/F3 2026-08-03] THE ACCOUNT ==============================
            THE VISUAL HOOK LAW, and this room needed it more than any other in
            the building: a page about money with no picture available to it and
            no picture that would be honest if we had one.
            SO THE HOOK IS THE NUMBER. The charter's proof is structural — "the
            proof is structural: there is no account to fill. There has never
            been one. There never will be." — and a structural proof rendered as
            a paragraph is a claim, while the same proof rendered as a LEDGER
            with a zero on it is an object a visitor can read in one second and
            remember on the way out. That is the trail-marker law and the visual
            hook law asking for the same thing.
            EVERY FIGURE ON IT IS A CLAUSE OF THE LAW, not a statistic: held /
            owned / kept by the keeper / passed on are clauses 4, 3, 2 and 4
            again. Nothing here is measured, so nothing here can go out of date
            — which is the difference between this and a live counter, and the
            reason it is a ledger rather than a dashboard.
            [C2] IT ALSO CARRIES THE ROOM'S TITLE NOW. Under the old name the
            card had to introduce itself; under this one the head and the
            figure finish the sentence the door started — where the money goes,
            and how much of it stayed. The object did not change, its caption
            did.
            `aria-hidden`, for the booth ticket's reason: the answers below say
            all four facts in sentences, and a screen reader hearing "$0.00
            HELD, EVER" as a fragment ahead of them is served worse, not
            better. */}
        <div className="mny-ledger" aria-hidden="true">
          <div className="mny-ledger-head">Weird.Baby &mdash; the account</div>
          <div className="mny-ledger-figure">$0.00</div>
          <div className="mny-ledger-caption">held, ever</div>
          <dl className="mny-ledger-rows">
            <div><dt>Owned</dt><dd>nothing</dd></div>
            <div><dt>Kept by the keeper</dt><dd>nothing</dd></div>
            <div><dt>Passed on</dt><dd>all of it</dd></div>
          </dl>
        </div>

        {/* THE PLACARD — the charter's own opening sentence, and its own two
            short ones under it. Same furniture as the booth's credo, because
            it is the same kind of object: signage, in the brand face, on a
            measure it cannot outrun. */}
        <h1 className="booth-credo">
          <span>Built from gifts.</span>
          <span>Gives <em>everything</em> away.</span>
        </h1>
        <div className="booth-words">
          <p>Nothing is bought. Nothing is kept.</p>
          <p>Money never stops here.</p>
        </div>

        <div className="booth-rule" />

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
          Corrections and offers of service:{" "}
          <a href="mailto:papa@weird.baby">papa@weird.baby</a>
        </p>
        {/* The booth is the other half of this room's subject — this page is
            the money and the reason; that one is the place and the people. One
            quiet sentence between them, in the prose, the way M6 ruled a
            pointer should read. */}
        <p className="booth-back">
          <Link to="/booth">The Information Booth</Link>
          <span className="mny-sep"> &middot; </span>
          <Link to="/">Back to the lobby</Link>
        </p>
      </div>
    </div>
  );
}
