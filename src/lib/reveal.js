/* ===========================================================================
   THE REVEAL LEDGER, at the glass. [R2/R5 2026-08-05]
   ---------------------------------------------------------------------------
   MIKE: "Nothing in a page hard-codes availability; surfaces read the table."

   The table is `reveal/ledger.json`, authored in `reveal/ledger-declare.mjs`.
   This module is the only thing in `src/` that reads it, so the shape of that
   file is a private matter between the two of them.

   ═══ IT RETURNS STATE. IT DOES NOT RETURN WORDS. ════════════════════════════
   And that is the load-bearing decision in this file, not a style preference.

   `provenance:gate` enumerates visitor-facing strings in `src/` and `index.html`
   and fails on any it cannot find an origin for. A data file OUTSIDE those two
   places is not swept. So the moment a ledger row started supplying the actual
   letters printed on a page, every one of those letters would leave the
   provenance boundary — the museum would have moved copy to a place where
   nothing asks where it came from, in the same round that mechanised asking.

   So the ledger says `LIVE` / `PARTIAL` / `STUB` / `NOT_BUILT`, which are STATES,
   and every page keeps its own labels in its own file where the sweep can see
   them. A caller maps one to the other. `Foundation.jsx` does exactly that.

   ═══ TWO STATES OUT OF FOUR, WHERE A PAGE ASKS FOR TWO ══════════════════════
   `isLive()` collapses the ledger's four build states onto the Foundation's
   two, and it collapses them the strict way: ONLY `LIVE` is live. `PARTIAL`
   and `STUB` are not-built as far as a visitor is concerned, because that room's
   whole rule is that there is deliberately no third state for "in progress" —
   every one of those is a promise, and a promise on a page about money is the
   thing this house has spent five rounds refusing to make. Any surface that
   genuinely wants three states asks `buildOf()` and decides for itself.
   =========================================================================== */
/* ═══ [H1 2026-08-06] THIS IMPORT IS FOUR FIELDS WIDE, AND IT WAS NOT ══════
   The paragraph above is right about WORDS and was enforced by the wrong thing.
   `stateOf()` returning a state stops a PAGE printing a note; it does nothing
   about the BUNDLE, and this line was shipping all 162 rows — every `name`,
   `where`, `dep` and `note` — into a chunk every visitor downloads. Measured on
   the built bundle the day the Portal was held: its engravings, the twin's
   address 67 times, and both of the eggs whose ONLY written form is that file.
   `reveal/public-view.mjs` is the strip and `vite.config.js` applies it at
   `enforce:"pre"`, so what arrives here is `{id, build, state, shown}` and
   nothing else. Reading any other field off a row will now read `undefined`,
   which is the correct answer to asking a public module a private question. */
import LEDGER from "../../reveal/ledger.json";

const BY_ID = new Map((LEDGER.rows || []).map(r => [r.id, r]));

/** The whole row, or null. Callers that want more than a state use this. */
export function revealRow(id) {
  return BY_ID.get(id) || null;
}

/** `LIVE` | `PARTIAL` | `STUB` | `NOT_BUILT`. An unknown id reads NOT_BUILT —
 *  a surface asking about something the ledger has never heard of is describing
 *  a mechanism that does not exist, which is exactly what NOT_BUILT means. */
export function buildOf(id) {
  return BY_ID.get(id)?.build || "NOT_BUILT";
}

/** The strict two-state read. See the note above for why PARTIAL is false. */
export function isLive(id) {
  return buildOf(id) === "LIVE";
}

/** `HELD` | `REVEALED` | `RETIRED`. Whether a visitor is meant to reach it yet,
 *  which is a different question from whether it is built. */
export function stateOf(id) {
  return BY_ID.get(id)?.state || "HELD";
}

/** Whether a visitor can reach it today. */
export function isRevealed(id) {
  return stateOf(id) === "REVEALED";
}
