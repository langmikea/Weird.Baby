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

export const PAPA_MARK = /\[PAPA\]/;

export function visitorProse(s) {
  if (typeof s !== "string" || !PAPA_MARK.test(s)) return s;
  return s
    .split(/(?<=[.!?])\s+/)
    .filter(sentence => !PAPA_MARK.test(sentence))
    .join(" ")
    .trim()
    .replace(/[\s;:,—–-]+$/, "");
}

export const kept = v => typeof v === "string" ? v.trim().length > 0 : !!v;
