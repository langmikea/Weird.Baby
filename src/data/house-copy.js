// src/data/house-copy.js — THE HOUSE'S STANDING PASSAGES, DECLARED ONCE.
//
// ═══ [D1 2026-08-06] WHY THIS FILE EXISTS ═══════════════════════════════════
// MIKE: "the same content exists in multiple rooms with no link between the
// copies, so fixing one never fixes the other and neither Mike nor Ops can tell
// from a screenshot which copy he is looking at. He edited the contact answer
// once and it survived elsewhere; that is the defect, not his memory."
//
// He is describing a class, not an incident. A passage that says what the house
// IS — who keeps it, how to reach it, what it takes — is a STANDING TERM of the
// institution, and a standing term stated twice is two terms that will disagree
// eventually. The museum already refuses this shape everywhere it costs it
// anything: the WAL poster's four acts are BUILT from `ARTISTS` so the poster
// cannot advertise somebody the room does not hold, and the design ramp lives in
// `museum-tokens.css` so a colour is a name rather than a hex typed twice.
//
// SO: a passage that belongs to the HOUSE rather than to a room is declared
// here, and every room IMPORTS it. Editing it once edits it everywhere, which is
// what Mike expected the first time.
//
// ═══ WHAT GOES IN HERE, AND WHAT DOES NOT ═══════════════════════════════════
// IN:   a sentence about the house that more than one room has to say — the
//       keeper, the address, the terms.
// OUT:  anything a room says about ITSELF or about an artist. Two rooms saying
//       similar things about different objects are not one passage; they are two
//       passages that happen to rhyme, and folding them would be this file
//       inventing a house position out of a coincidence of wording. (The
//       provenance register learned that lesson the expensive way — five rows
//       were classed RESTATED for a coincidence of wording, and two of them
//       turned out to be Mike's own words.)
//
// ═══ THE BOUNDARY IS UNCHANGED, DELIBERATELY ════════════════════════════════
// Every string below is a PLAIN LITERAL, not a template and not assembled from
// anything computed. `provenance:gate` sweeps `src/` for visitor-facing string
// literals, so hoisting a passage here keeps it inside the boundary and simply
// collapses N register rows into one. A passage built by interpolation would
// fall off the boundary silently, which is a worse defect than the duplication
// it would be curing.
//
// ═══ THE ONE KNOWN DIVERGENT COPY IS NOW WIRED IN ═══════════════════════════
// `robots.js`'s front-desk FAQ answered "How do I get in touch?" with the bare
// address and nothing else. D1 left it alone on purpose — every answer on that
// face is Mike's, word for word (P3), so folding it in under cover of a refactor
// is the thing D1 forbids — and reported it as M66 instead.
// [R1 2026-08-06] HE RULED IT: both rooms carry `CONTACT`, no follow-on
// sentences. It was one import, which is what M66 said it would be. There is no
// longer any known unlinked copy of a passage in this file.

/* WHO KEEPS THE PLACE.
   Written for the Information Booth and, since P9, printed on /wb's ABOUT THE
   ARTIST register as well — the one published statement this museum makes about
   the person behind the name, which was previously reachable only from a room in
   a different part of the building. Both sites now read this constant. */
export const KEEPER =
  "One person — Papa Weird.Baby. The job pays nothing, the museum never " +
  "pays to be managed, and only zero-invoice services are accepted. " +
  "That's the deal, and it never changes.";

/* ═══ [D 2026-08-11] THE ADDRESS IS STRUCK SITEWIDE, AND `CONTACT` WITH IT ═══
   MIKE'S RULING: the sign-off line and the house address are struck
   everywhere they appear, no replacement. The literals are not repeated in
   these notes either, so a grep for the struck address finds nothing.

   `CONTACT` HELD THE ADDRESS AS ITS ONLY PAYLOAD — one sentence that pointed
   at it and said nothing else — so there was no version of it left once the
   address went. It is deleted rather than trimmed: what remains after cutting
   the address out is a sentence with its object removed, and an answer that
   no longer answers is worse than an absent one.
   WHAT WENT WITH IT, NAMED HERE BECAUSE IT IS THE COST: the FAQ row "How do I
   get in touch?" is gone from `/robots` and from `/wal`, which were its only
   two callers. THE MUSEUM NOW PUBLISHES NO WAY TO REACH IT. That is the
   ruling's direct consequence and not a side effect of how it was carried out.
   `KEEPER` above is untouched and still says who runs the place; it has never
   carried an address. */

/* WHAT THE HOUSE IS TO THE ARTISTS IT SHOWS.
   [F2 2026-08-06] Written for the booth and now printed in `/wal`'s own FAQ as
   well, because that is the room the question is asked in. It is the same
   passage rather than a second one for exactly the reason this file exists: a
   statement about the museum's relationship to the people in it is a STANDING
   TERM, and a standing term stated twice is two terms that will disagree.
   R7's rule is what puts it in two places at once — *"a visitor must never have
   to run back to the lobby"* — and D1's rule is what stops that costing a
   divergence. */
export const AFFILIATION =
  "No. The artists in Other Music Worth a Listen are not partners, " +
  "clients, or signings — they are people whose records we think you " +
  "should hear. Every door on their page leads to their own site, their " +
  "own store, their own channel, because the exhibit is a pointer and " +
  "not a home.";

/* WHOSE THE MATERIAL IS, AND WHAT MAY BE DONE WITH IT. Same reasoning.
   ═══ [E 2026-08-11] THE CLAUSE IS STRUCK, NOT REWRITTEN ════════════════════
   It read "When in doubt, write; the address is at the bottom of this page."
   The address was deleted sitewide one packet ago, so the sentence pointed at
   a thing that is not there — a live line on the glass that was simply untrue.
   STRUCK RATHER THAN REPAIRED, and that is the smaller change of the two.
   Repairing it means inventing somewhere else to write to, and there is
   nowhere: the ruling that removed the address removed every contact route in
   the building and said "no replacement". A sentence inviting a letter with no
   address to send it to is worse than no sentence.
   WHAT SURVIVES IS THE PART THAT WAS ALWAYS THE POINT — whose the material is,
   and that the house is glad to be asked about its own photographs. The
   [PAPA] marker is untouched: the licence is still Papa's to set. */
export const USE_RIGHTS =
  "The artists' work is the artists' — their music, their pictures, " +
  "their words — and every door on their pages goes to them rather than " +
  "to us. What is ours is the photographs of our own objects, taken here " +
  "and printed here, and we are glad to be asked for those.";

/* ═══ [D 2026-08-11] THE SIGN-OFF IS DELETED. MIKE'S RULING, NO REPLACEMENT ══
   `SIGN_OFF` and `ADDRESS` stood here and closed every FAQ in the building — the booth's and each wing's —
   through `faq-face.js`, which re-exported them to `Exhibit.jsx` and
   `InfoBooth.jsx`. Both constants are gone, both re-exports with them, and the
   paragraph that printed them is removed from both renderers.
   THE F1 RULING THIS REVERSES IS NAMED RATHER THAN QUIETLY DROPPED: on
   2026-08-06 Mike set the FAQ's shape as "a credo block, the word Questions,
   the question list, A SIGN-OFF LINE WITH THE ADDRESS, and the exit." Today's
   ruling strikes the fourth of those five. An FAQ now closes on its last
   question and its exit. */
