/* ===========================================================================
   WHAT A RECORD ENTRY IS CHECKED AGAINST — one declaration, read by the gate
   AND by the instrument Mike writes in. [I2/I3 2026-08-08]
   ---------------------------------------------------------------------------
   MIKE'S RULING, AND IT IS A RULING ABOUT INSTRUMENTS RATHER THAN ABOUT ONE
   NUMBER: *the tool let him write a 477-character executive summary against a
   130-character index budget and said nothing until a gate caught it three
   rounds later.* He must never again discover a limit from a report.

   ═══ WHY THIS IS A FILE AND NOT TWO CONSTANTS WHERE THEY WERE ══════════════
   `RECORD_TITLE_MAX` and `RECORD_LINE_MAX` lived as module-private constants in
   `tools/reveal-ledger.mjs`, which is a script: it reads the tree at load and
   dispatches on `process.argv` at the bottom, so nothing can import it for two
   numbers. The instrument therefore had three choices — retype the numbers
   (which is a second copy, and a second copy of a budget is a budget that
   silently stops agreeing with its gate), import a script for its side effects,
   or say nothing. It said nothing. THIS FILE IS THE FOURTH CHOICE: plain data,
   no imports, no side effects, so the thing that ENFORCES a limit and the thing
   that WARNS about it read the same line.

   `record-entries.mjs` was the other candidate and was rejected: its stated job
   is parsing the Record out of an AST, it pulls acorn, and a page that wants a
   number should not load a parser to get one.

   ═══ TWO LISTS, AND THEY ARE NOT THE SAME LIST ═════════════════════════════
   `BUDGETS`      the HARD limits — a field, a number, and the gate that fails.
                  These are what a live counter can be drawn from, because a
                  counter needs an integer to count against.
   `CONSTRAINTS`  EVERYTHING ELSE a Record entry is bound by, including the ones
                  no gate catches. It exists because I3 asked the question
                  nobody had asked in one place: *what else does an entry have
                  to obey that the worksheet is silent about?* A constraint with
                  `silent: true` is one where breaking it produces no error
                  anywhere — the entry just quietly loses something — and those
                  are the expensive ones, so they are marked rather than mixed
                  in.

   NOTHING HERE INVENTS A RULE. Every row names the file that already enforces
   it or already behaves this way, and a row whose `enforcedBy` says "nothing"
   is a statement about the tree, not a wish.
   =========================================================================== */

/* ═══ THE HARD BUDGETS ══════════════════════════════════════════════════════
   [R3 2026-08-06] MIKE: "every index row gets a headline and a summary beneath
   it, ALL CONSTRAINED TO THE SAME HEIGHT, and THE ENTIRE SUMMARY MUST FIT IN IT
   — that is the point of a summary. NO MORE half-sentence teasers ending in an
   ellipsis; that failure disappears by construction."

   THE CONSTRUCTION IS TWO HALVES AND NEITHER WORKS ALONE.
     RENDER  the index row is a fixed height and there is no truncation left in
             it at all — `-webkit-line-clamp` and the headline's `text-overflow`
             are both gone (Exhibit.css). A row cannot clip, so it cannot lie.
     DATA    which means a string too long for the box would OVERFLOW instead,
             and the only place to stop that is before it ships.
   Take either half away and you are back to a promise.

   [I2 2026-08-08] AND THERE IS A THIRD HALF, WHICH IS THE ONE THIS ROUND ADDS:
     WRITE   the person composing the string is told the number while he is
             composing it. Two mechanisms that both fire after the writing is
             finished are two mechanisms that cost a rewrite.

   THE NUMBERS, AND HOW THEY WERE ARRIVED AT RATHER THAN CHOSEN. The row gives
   the headline ONE line and the summary TWO, at the index measure. Measured on
   the built bundle at the wing's default split, that column runs ~70 characters
   at `--fs-small`; the budgets take the conservative end of the band the summary
   is set in and leave a character of slack at the narrowest desktop width the
   two-column index switches at.
   THEY ARE FLOORS ON THE LAYOUT, NOT TASTE. If the type ramp, the measure or the
   row height is ever changed, these move with it in the same commit — and a
   round that widens the box without widening the budget has only made the gate
   stricter than the glass, which is the safe direction.

   IT POLICES THE RECORD AND ONLY THE RECORD. Other faces render entry lists that
   are not indexes, are not fixed-height, and were never asked to fit. */
export const RECORD_TITLE_MAX = 62;
export const RECORD_LINE_MAX = 130;

/* === [N1 2026-08-11] THE MEASURED NO-WRAP BUDGET, WHICH IS NOT THE GATE'S ===
   `RECORD_TITLE_MAX` above is what `reveal:check` refuses a packet over. It is
   ONE number, and a headline does not have one budget — it has a different one
   at every width, because the museum's type ramp reads the viewport. Measured
   on the built page in the Record's real face (Arial 700, its own tracking),
   index and opened record identical at all three:
       1280px  64 characters      768px  58      390px  36
   SO THE GATE IS RIGHT AT ONE WIDTH AND WRONG AT TWO. 62 is two tighter than a
   desktop line and twenty-six LOOSER than a phone line: a headline can pass the
   gate and still wrap on a phone, which is what 003 (39 characters) and 013
   (46) do today.
   IT IS DECLARED HERE, WITH THE GATE'S NUMBER, so the editor shows him the real
   figure without a second copy of it living in a page. Nothing enforces these —
   Mike has ruled against truncation and against blocking — they are shown. */
export const TITLE_BUDGET_MEASURED = [
  { viewport: 1280, chars: 64 },
  { viewport: 768, chars: 58 },
  { viewport: 390, chars: 36 },
];

export const BUDGETS = {
  title: {
    field: "title",
    max: RECORD_TITLE_MAX,
    name: "the headline",
    holds: "one line of the index row",
    why: "Nothing truncates any more, so a longer headline overflows the row "
       + "instead of clipping.",
    from: "RECORD_TITLE_MAX, reveal/record-shape.mjs",
    enforcedBy: "npm run reveal:check — it refuses the packet",
  },
  line: {
    field: "line",
    max: RECORD_LINE_MAX,
    name: "the index summary",
    holds: "two lines of the index row",
    why: "Your own R3 rule: THE ENTIRE SUMMARY MUST FIT. A summary that does "
       + "not fit is not a summary.",
    from: "RECORD_LINE_MAX, reveal/record-shape.mjs",
    enforcedBy: "npm run reveal:check — it refuses the packet",
  },
};

/* THE DATE IS NOT A BUDGET AND IT IS THE OTHER SHAPE A SLOT CAN BE CHECKED
   AGAINST: an exact format, where anything else is not "too long" but simply
   not a date. `src/lib/record-model.js` parses `YYYY-MM-DD` by hand — as a
   CALENDAR date rather than an instant, so a log cannot shift its own dates by
   a timezone — and returns null for anything that does not match. NOTHING
   REPORTS THAT NULL. The entry renders; it just silently has no dateline, no
   week, no band and no target for a newspaper door. */
export const DATE_PATTERN = "^\\d{4}-\\d{2}-\\d{2}$";

export const FORMATS = {
  date: {
    field: "date",
    pattern: DATE_PATTERN,
    name: "the date",
    says: "four digits, a hyphen, two digits, a hyphen, two digits — 2026-08-10",
    why: "Anything else parses to nothing and the entry silently loses its "
       + "dateline, its week number and its month band. No error is printed.",
    from: "entryDate(), src/lib/record-model.js",
    enforcedBy: "nothing — it fails quietly, which is why it is asked for here",
  },
};

/* ═══ EVERYTHING A RECORD ENTRY IS BOUND BY ════════════════════════════════
   I3: *does a Record entry have any OTHER downstream constraint the worksheet
   is silent about?* This is the answer, whole, in the order an entry is
   written. `asked` is what the worksheet asks for it TODAY. */
export const CONSTRAINTS = [
  { field: "title", rule: `Required, and at most ${RECORD_TITLE_MAX} characters.`,
    enforcedBy: "npm run reveal:check (recordBudgetFaults)", silent: false,
    asked: "the HEADLINE slot, with a live counter" },

  { field: "line", rule: `At most ${RECORD_LINE_MAX} characters. It is the whole `
      + `summary under the headline in the index; there is no teaser and no ellipsis.`,
    enforcedBy: "npm run reveal:check (recordBudgetFaults)", silent: false,
    asked: "the INDEX SUMMARY slot, with a live counter" },

  { field: "line", rule: "It draws TWICE. With no `lead` on the entry it is also "
      + "the lead paragraph at the top of the opened record.",
    enforcedBy: "RecordEntry.jsx — `entry.lead || entry.line`", silent: true,
    asked: "said on the slot, because it changes what the sentence has to do" },

  { field: "lead", rule: "One paragraph. It is a string, not a list — two "
      + "paragraphs in it set as one run-on.",
    enforcedBy: "nothing", silent: true,
    asked: "not asked; the executive summary goes into a section instead" },

  { field: "sections", rule: "Your approved container is FOUR TO SEVEN sections, "
      + "each holding one thought, each with a short all-caps label. Weight is "
      + "deliberately not equalised: the day's main event gets the room.",
    enforcedBy: "nothing — the renderer draws whatever it is given", silent: true,
    asked: "said on the NOTES slot" },

  { field: "sections", rule: "An entry that declares `sections` renders the "
      + "long-form container, which draws NO `wire`, NO `plates` and NO `docs` "
      + "and reports nothing.",
    enforcedBy: "nothing — OPEN_ACTIONS S-c", silent: true,
    asked: "said on the NOTES slot" },

  { field: "sections[].body", rule: "`[[1]]` in a body is door one of that "
      + "section's own list, set into the sentence where the marker stands. A "
      + "door that is declared and never placed still renders at the end of the "
      + "section, so a typo cannot swallow one.",
    enforcedBy: "RecordEntry.jsx (SectionBody)", silent: false,
    asked: "not asked; doors are wired by Ops from what the notes describe" },

  { field: "date", rule: "Exactly `YYYY-MM-DD`. Anything else is not a date and "
      + "nothing says so.",
    enforcedBy: "nothing", silent: true,
    asked: "one slot, for day one only — every other date follows from it" },

  { field: "date", rule: "Three separate things wait on it: the `Week n` in the "
      + "dateline (which also needs `recordEpoch` on the face), the month bands "
      + "in a long index, and any NEWSPAPER door, whose target is a DATE and "
      + "never a position in the list.",
    enforcedBy: "record-model.js; OPEN_ACTIONS C8 and C1", silent: true,
    asked: "the same one slot" },

  { field: "no", rule: "Authored, never derived from position — the volume is a "
      + "sample of a longer log and numbering by index would renumber every "
      + "entry the day one is inserted. It must also agree with the ledger's own "
      + "`record.NNN` row.",
    enforcedBy: "npm run reveal:check (recordParityFaults)", silent: false,
    asked: "not asked; Ops assigns it and the gate checks it" },

  { field: "assets", rule: "Every path-shaped string anywhere in the entry IS "
      + "the day's publish manifest. A governed picture named by an entry must "
      + "exist at one of its two addresses, and must have a row in the asset "
      + "table.",
    enforcedBy: "npm run reveal:check (deliveryFaults, check 4) and npm run reveal:day",
    silent: false,
    asked: "not asked as a path; describe the picture in the notes and Ops "
         + "resolves it" },

  { field: "still", rule: "The entry's one photograph. It needs a row in "
      + "`provenance/assets.json` saying whether there is text in the picture "
      + "and how somebody checked.",
    enforcedBy: "npm run provenance:gate", silent: false,
    asked: "not asked; it is a picture, not a sentence" },

  { field: "(every string)", rule: "Every visitor-facing string in the entry "
      + "needs a provenance row, keyed on its exact text. Edit one character and "
      + "its declaration stops covering it.",
    enforcedBy: "npm run provenance:gate", silent: false,
    asked: "nothing to ask — it is Ops' work at landing time" },

  { field: "(the ledger)", rule: "No ledger row may hold six consecutive words "
      + "of the Record. The ledger says what is reachable; the Record holds the "
      + "words, and the moment both hold the same ones they can disagree.",
    enforcedBy: "npm run reveal:check (recordProseFaults)", silent: false,
    asked: "nothing to ask" },

  { field: "(the entry)", rule: "It needs a transfer class — how the material "
      + "reached the museum. There is no fall-through: an unclassed entry fails "
      + "the build.",
    enforcedBy: "reveal/transfers.mjs", silent: false,
    asked: "the notes; the class follows from what the day describes" },

  { field: "(the entry)", rule: "Doctrine 18 does NOT apply. A spec face must "
      + "carry in-story specifications; the Record is the house's modern log of "
      + "receiving these objects and stays modern.",
    enforcedBy: "npm run instory:gate — the Record is exempt by name", silent: false,
    asked: "nothing to ask" },

  { field: "(the entry)", rule: "Doctrine 11 is satisfied at the instrument: "
      + "everything arriving through these forms is in-story by construction "
      + "(Doctrine 21). It does NOT exempt Ops' own prose inside an entry.",
    enforcedBy: "read at landing time, by a person", silent: false,
    asked: "nothing to ask" },
];

/* ═══ [E3 2026-08-09] THE CAPITALS RULE, ONE DECLARATION, TWO RUNTIMES ═══════
   A line on its own in CAPITALS starts a section and is its label; every
   non-empty line under it is one paragraph. It is not a new convention — it is
   how Mike dictated Record 001 (EXECUTIVE SUMMARY, then DETAILED REPORT) and it
   is the rule `tools/dictation/emit-record-entries.mjs` landed those entries
   with.

   IT LIVES HERE BECAUSE IT NOW HAS TWO READERS AND ONE OF THEM IS A BROWSER.
   The Record editor migrates his old worksheet answers into blank records, and
   that migration happens in the page — against the store the worksheet wrote,
   which on a `file://` page is the same store — so the rule has to run there
   too. `tools/dictation/record-edit.mjs` emits this function's OWN SOURCE into
   the page (`String(sectionsFromText)`) rather than a second copy of the rule.
   Two runtimes, one definition, and the second is provably the first (Doctrine
   17). It is written with no imports, no closures and no optional syntax for
   exactly that reason: it has to be valid on its own in a plain script.

   `letters` guards the digits case — "16:10 - Server auto-shutdown" is upper
   case by accident of having no lower-case letters in it, and reading it as a
   heading would eat a line of his timeline. */
export function sectionsFromText(text) {
  var out = [];
  var cur = null;
  var lines = String(text == null ? "" : text).split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].replace(/\s+$/, "");
    if (!line.trim()) continue;
    var t = line.trim().replace(/:$/, "");
    var letters = t.replace(/[^A-Za-z]/g, "");
    if (letters && t === t.toUpperCase() && t.length > 2 && t.length <= 62 && !/^\d/.test(t)) {
      if (cur) out.push(cur);
      cur = { label: t, body: [] };
      continue;
    }
    if (!cur) cur = { label: null, body: [] };
    cur.body.push(line.replace(/^\s+/, ""));
  }
  if (cur) out.push(cur);
  return out;
}

export default { RECORD_TITLE_MAX, RECORD_LINE_MAX, BUDGETS, FORMATS, CONSTRAINTS, sectionsFromText };
