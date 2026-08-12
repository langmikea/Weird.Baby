// src/lib/visitor-prose.js — THE OPERATOR-MARKER SCRUBBER.
//
// [M3 2026-08-03] MOVED HERE OUT OF Exhibit.jsx, WITHOUT CHANGING A CHARACTER
// OF WHAT IT DOES.
//
// P5's ruling is SITE-WIDE — Mike: "HIDE ALL [PAPA] MARKERS and anything else
// the user isn't meant to see, ON EVERY PAGE, SITE-WIDE. They must never be
// visible to visitors." The function that enforces it was a private const in
// src/routes/exhibit/Exhibit.jsx, reachable only by things the exhibit
// renders. That is the review's pattern 1 again: a law scoped to the file that
// first needed it. The Information Booth is not an exhibit, so the first
// [PAPA] written into the booth's own copy would have printed on the page —
// which is exactly the defect P5 was fixing, arriving through a door P5 could
// not see.
//
// It is imported by src/routes/exhibit/Exhibit.jsx (which keeps `scrubFace`,
// the face-shaped wrapper — that IS exhibit business) and by
// src/routes/InfoBooth.jsx.
//
// ─── WHAT [PAPA] IS (P5's note, kept with the code it describes) ─────────────
// It marks the words that are Papa's to write — a note from the builders to the
// operator, sitting in the data beside real copy.
//
// WHY IT IS SCRUBBED AT THE RENDER SEAM AND NOT DELETED FROM THE DATA. The
// markers are load-bearing FOR MIKE — they are the list of what still needs his
// words — and deleting them would destroy that list to fix a display bug. So the
// data keeps its markers and the visitor never sees one.
//
// IT CUTS BY SENTENCE, NOT BY STRING. A field routinely carries real provenance
// and THEN the marker ("Sources: her own site... [PAPA] — the card copy").
// Dropping the whole field would take the sourcing down with it; truncating at
// the bracket would leave a half-sentence. The sentence carrying the marker is
// the operator's; the rest is the museum's, and it stays.
//
// The early return means a string without a marker is never even split, so the
// sentence splitter can never damage ordinary copy ("Vol. 1", "Dr King").

// ═══ [2026-08-11] THE RED BLOCK IS GONE, AND THE SCRUB IS WHAT REMAINS ══════
//
// MIKE: **"EVERYWHERE: Delete the comment boxes (red). Get rid of all of the
// red notes — all are stale and not useful."**
//
// N3's arrangement — the notes lifted out of the prose and printed beneath the
// surface in scarlet, so Mike could direct what he could otherwise not see — is
// DELETED WHOLE: `OPS_NOTES_HEAD`, `opsSentences` and `opsNotesOf` from this
// file, the block from both render seams, the four rules from `src/index.css`,
// and the thirty-two marked sentences the block existed to show.
//
// WHAT SURVIVES IS P5's RULE, WHICH WAS NEVER THE SAME THING. `visitorProse`
// keeps an operator marker off the glass; the red block put it back for one
// reader. The first is a site-wide law about visitors and is untouched. The
// second answered a question — *what still needs Papa's words* — that Mike has
// now answered by saying it is stale.
//
// IT IS NOT DEAD CODE AND THAT IS WHY IT STAYS. `[PAPA]` remains in COMMENTS
// throughout the data (34 blocks, measured), and a comment is one edit from
// being a string. The day a marker is written into copy again, this is what
// stops a visitor reading it — and `wb-ops-notes` in `vite.config.js` is the
// second, source-level half of the same guarantee.

export const PAPA_MARK = /\[PAPA\]/;

/* ═══ [E2 2026-08-09] A NOTE TO OPS IS WRITTEN IN CURLY BRACES ═══════════════
   MIKE: "Anything inside { } is a note to Ops, not story. They are written
   inline where he writes them, they stay in his working copy, and OPS ACTS ON
   THEM when it picks up the package. They must never reach a visitor — the
   launch gate fails on any brace that survives."

   ═══ IT REPLACES THE `[MIKE-NOTE]` / `[OPS]` PAIR, WHICH IS RETIRED ═════════
   For one round his notes drew in RED inside the published entry and Ops
   answered beside them in BLUE. He struck it: *"that was Ops answering in the
   wrong place."* An answer belongs in the package Ops picks up, not on the
   museum's own glass — so the two marks, the two colours, the renderer branch
   that drew them, the source-emptying pass and the bundle grep written for them
   are all GONE rather than kept beside this (Doctrine 16, Doctrine 24). What
   they were is recorded once, in the round log that removed them.

   ═══ WHY THERE IS NO RUNTIME SCRUB HERE, AND IT IS THE WHOLE DESIGN ═════════
   `[PAPA]` is a mark inside DATA THAT SHIPS, so it needs a render-seam filter.
   A brace note is not in the data at all: it lives in Mike's working copy in
   `docs/dictation-20260807/record-draft.json`, Ops reads it when it lands the
   entry, and Ops takes it out. So this constant is not a scrubber — it is what
   the two GATES match on, and its whole job is to make sure a brace that got
   carried into `src/` by accident cannot ship:
     1. `npm run reveal:check` fails the packet on a brace in any Record string.
     2. `wb-ops-braces` in vite.config.js fails a LAUNCH build on a brace in any
        string literal under `src/`.
   Measured on this tree the day the rule was written: **zero** string literals
   in `src/` contain `{…}`, so the gate has no false positive to tolerate and
   never needs an exception list. If one is ever needed, that is a signal to
   change the mark, not to weaken the gate.

   NON-GREEDY AND BRACE-FREE INSIDE, so `{a} and {b}` is two notes rather than
   one note swallowing the prose between them. */
export const OPS_BRACE = /\{[^{}]*\}/;

/** every brace note in a string, in order — what Ops has to act on */
export const opsBraces = (s) =>
  typeof s === "string" ? (s.match(/\{[^{}]*\}/g) || []) : [];

/** the sentence splitter, in ONE place, because two copies of it would be two
 *  answers to "which half of this string is Mike's" */
const sentences = (s) => s.split(/(?<=[.!?])\s+/);

export function visitorProse(s) {
  if (typeof s !== "string" || !PAPA_MARK.test(s)) return s;
  return sentences(s)
    .filter(sentence => !PAPA_MARK.test(sentence))
    .join(" ")
    .trim()
    .replace(/[\s;:,—–-]+$/, "");
}

export const kept = v => typeof v === "string" ? v.trim().length > 0 : !!v;
