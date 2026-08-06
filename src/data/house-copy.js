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
// ═══ ONE KNOWN COPY IS DELIBERATELY NOT WIRED IN HERE ═══════════════════════
// `robots.js`'s front-desk FAQ answers "How do I get in touch?" with the bare
// address and nothing else. It is a DIVERGENT copy of CONTACT below, and it is
// left alone on purpose: every answer on that face is Mike's, word for word
// (P3), so folding it into this file would be Ops rewriting his content under
// cover of a refactor. It is reported for his ruling instead — docs/OPEN_ACTIONS
// M66. The day he says yes, it is one import.

/* WHO KEEPS THE PLACE.
   Written for the Information Booth and, since P9, printed on /wb's ABOUT THE
   ARTIST register as well — the one published statement this museum makes about
   the person behind the name, which was previously reachable only from a room in
   a different part of the building. Both sites now read this constant. */
export const KEEPER =
  "One person — Papa Weird.Baby. The job pays nothing, the museum never " +
  "pays to be managed, and only zero-invoice services are accepted. " +
  "That's the deal, and it never changes.";

/* HOW TO REACH THE PLACE.
   [D2 2026-08-06] MIKE'S OWN WORDING, ruled and replacing the booth's previous
   three-sentence answer. What went with it: "It is read by the person who keeps
   the place" (the keeper answer four rows above already says who that is) and
   "Corrections are especially welcome — if we have got something wrong about a
   record, a date, or a person, we would rather know" — struck on his
   instruction, no follow-on sentences. */
export const CONTACT =
  "Write to the guy running the place: papa@weird.baby.";
