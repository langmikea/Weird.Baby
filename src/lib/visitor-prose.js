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

// ═══ [N3 2026-08-06] AND THE MARKERS ARE VISIBLE TO MIKE AGAIN, IN RED ═══════
//
// MIKE: **"NOTES TO MIKE RENDER IN RED (or an equally unmistakable treatment)
// meaning NOT PART OF THE UX, EVER. Apply it to [PAPA] slots and every other
// Ops-to-Mike marker that can appear on a rendered surface, so a note can never
// be mistaken for content. Verify none of them can reach a visitor in the LAUNCH
// stage."**
//
// THIS DOES NOT REVERSE P5 AND THE SHAPE IS V1's. P5's sentence — *they must
// never be visible to visitors* — is untouched and is now enforced twice rather
// than once. What was wrong is the same thing that was wrong with the pull-back
// rule: the scrub had only ONE state, so the only way to obey it was for Mike to
// be unable to see his own list either. **Mike cannot direct what he cannot
// see.**
//
// `visitorProse` IS UNCHANGED, DELIBERATELY, AND THAT IS THE LOAD-BEARING PART.
// The body copy is identical in both stages, so what Mike reads on the glass is
// exactly what ships. The notes do not go back INTO the prose — they are lifted
// OUT of it and printed beneath the surface in a block that cannot be mistaken
// for the museum's voice, which is a stronger guarantee than red ink inside a
// paragraph: a note that is never in the copy cannot be read as copy.
//
// THREE PARTS, AND THE THIRD IS THE ONE THIS HOUSE KEEPS PAYING FOR:
//   1. `opsSentences` / `opsNotesOf` — the lift. Pure, importless.
//   2. the render seams (Exhibit.jsx, InfoBooth.jsx) gate them on the STAGE.
//   3. `wb-ops-notes` in vite.config.js deletes them from the SOURCE at LAUNCH.
// Part 3 exists because parts 1 and 2 are a runtime filter, and a runtime filter
// stops the RENDER while still shipping the MATERIAL — R5 shipped 153 vault mp3
// URLs that way, H1 shipped the whole reveal ledger, V1 shipped the address of
// twenty-six withheld photographs. Measured on the built bundle: **35 `[PAPA]`
// markers in the JS chunks**, among them the Foundation's four unpublished
// ledger figures. After the strip the launch bundle carries **one**, and it is
// `PAPA_MARK` on the line below — the rule that removes them.

export const PAPA_MARK = /\[PAPA\]/;

/* ═══ [L2/L5 2026-08-09] THE TWO INLINE MARKS, AND WHY THEY ARE NOT `[PAPA]` ══
   MIKE: "where he asked Ops a question in the text, OPS' ANSWER GOES INLINE
   beside it, in a distinct colour from his own note, so he can read question and
   answer together. His notes in red; Ops' answers in a second colour, clearly
   not his voice. Both are development-only and neither may ever reach a
   visitor."

   `[PAPA]` CANNOT DO THIS AND THAT IS THE WHOLE REASON THERE ARE TWO SCHEMES.
   A `[PAPA]` sentence is LIFTED OUT of the copy and printed in a block beneath
   the surface (N3), because a note that is never inside the copy cannot be
   mistaken for copy. These must stay exactly where he wrote them — his question
   and Ops' answer, next to each other, in the middle of his own report — which
   is the opposite arrangement and needs its own mark.

   THEY ARE WHOLE-PARAGRAPH MARKS, NOT SENTENCE MARKS. A Record body is an array
   of paragraphs; a marked paragraph is entirely a note or entirely an answer, so
   there is no half-sentence question about what to cut. At LAUNCH the paragraph
   does not render and the literal does not exist:
     1. `RecordEntry.jsx` drops a marked paragraph when `launched()`.
     2. `wb-ops-notes` in vite.config.js replaces the literal with "" at launch.
     3. the launch build then greps its own chunks and FAILS if a mark survives.
   Three mechanisms because parts 1 and 2 are the pair this house has shipped
   past four times, and part 3 is the one that cannot be reasoned wrong. */
export const DEV_MARK = /^\[(MIKE-NOTE|OPS)\]\s?/;

/** "MIKE-NOTE" | "OPS" | null — what kind of development-only mark this is */
export const devMark = (s) => {
  const m = typeof s === "string" ? DEV_MARK.exec(s) : null;
  return m ? m[1] : null;
};

/** the paragraph without its mark. Byte-identical to what Mike typed. */
export const devBody = (s) => typeof s === "string" ? s.replace(DEV_MARK, "") : s;

/** the block's own label, declared ONCE because two rooms print it (Doctrine
 *  17) — and a plain literal, because `provenance:gate` sweeps literals and a
 *  passage assembled by interpolation falls off the boundary in silence. */
export const OPS_NOTES_HEAD = "Not part of the UX · notes to Mike";

/** the sentence splitter, in ONE place, because two copies of it would be two
 *  answers to "which half of this string is Mike's" */
const sentences = (s) => s.split(/(?<=[.!?])\s+/);

export function visitorProse(s) {
  /* [L5 2026-08-09] a development-only paragraph is not prose to be trimmed —
     the whole string goes, and it goes from the SOURCE as well as the render */
  if (devMark(s)) return "";
  if (typeof s !== "string" || !PAPA_MARK.test(s)) return s;
  return sentences(s)
    .filter(sentence => !PAPA_MARK.test(sentence))
    .join(" ")
    .trim()
    .replace(/[\s;:,—–-]+$/, "");
}

/** the exact complement of `visitorProse` — the sentences it takes out */
export function opsSentences(s) {
  if (typeof s !== "string" || !PAPA_MARK.test(s)) return [];
  return sentences(s).filter(sentence => PAPA_MARK.test(sentence))
    .map(t => t.trim()).filter(Boolean);
}

/** every operator note anywhere inside a value, in document order, deduped.
 *
 *  A DEEP WALK RATHER THAN A FIELD LIST, and that is not laziness. `scrubFace`
 *  scrubs a NAMED set of fields, which is a list somebody has to remember to
 *  extend — the exact failure P5 was fixing when a marker written into the
 *  booth's copy printed on the page through a door P5 could not see. A walk
 *  cannot miss a field because a field was not on it. */
export function opsNotesOf(value, out = [], seen = new Set()) {
  if (typeof value === "string") { for (const n of opsSentences(value)) if (!seen.has(n)) { seen.add(n); out.push(n); } return out; }
  if (Array.isArray(value)) { for (const v of value) opsNotesOf(v, out, seen); return out; }
  if (value && typeof value === "object") { for (const v of Object.values(value)) opsNotesOf(v, out, seen); return out; }
  return out;
}

export const kept = v => typeof v === "string" ? v.trim().length > 0 : !!v;
