// src/lib/foundation-state.js — the Foundation register's two lookups and its
// state reader.
//
// [D7 2026-08-06] IT IS A LIB MODULE FOR ONE REASON AND THE REASON IS A RULE
// RATHER THAN A PREFERENCE. Two files need `stateOfRow`: the objects that draw
// the register, and the viewer, which draws the same two-state stamp beside a
// MARKED DOOR on an answer. Exporting it from the components file trips
// `react-refresh/only-export-components` — a file of components exports
// components — and exporting it from the data module would make the viewer
// import a wing's data to render a wing-agnostic stamp. So it sits where a
// shared reader belongs.
//
// Everything below is carried out of `Foundation.jsx` unchanged. Its notes are
// its own.

/* [R5 2026-08-05] THE STATE COLUMN READS THE REVEAL LEDGER.
   MIKE: "WIRE ONE CONSUMER as proof — the cheapest honest surface whose
   visibility already varies reads the table instead of its hard-coded state.
   Prove it by flipping a row and watching the site change."

   THE LEDGER SUPPLIES THE STATE; THE WING KEEPS THE WORDS. A register row
   carries `reveal: "channel.qr"` instead of `state: "NOT BUILT"`, and the label
   printed on the glass is still a string literal in `src/` — which is where
   `provenance:gate` can see it. Moving the letters into a JSON file outside
   `src/` would have taken them off the provenance boundary in the same round
   that mechanised it.

   TWO STATES OUT OF FOUR, AND STRICTLY: `isLive` is true only for a ledger row
   at `LIVE`. `PARTIAL` and `STUB` print NOT BUILT here, because this register's
   own rule is that there is no third state for "in progress". */
import { isLive } from "./reveal.js";

/* [N7] the three declared values and what each prints. Anything else in a `by`
   field is a literal donor name and is printed as given — which is why the
   lookups fall through rather than throwing: the open case is a name, and a
   name is not a keyword. */
export const BY_LABEL = {
  ANONYMOUS: "Anonymous",
  NONE: "Nobody yet",
  NA: "Not a gift",
};
export const BY_KIND = { ANONYMOUS: "ANONYMOUS", NONE: "NONE", NA: "NA" };

export const STATE_LABEL = { LIVE: "LIVE", NOT_BUILT: "NOT BUILT" };

export function stateOfRow(row) {
  return isLive(row.reveal) ? STATE_LABEL.LIVE : STATE_LABEL.NOT_BUILT;
}
