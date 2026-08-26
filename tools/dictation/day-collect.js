/* ===========================================================================
   THE COLLECTOR — ONE IMPLEMENTATION, TWO CALLERS. [PIECE 4, 2026-08-26]
   ===========================================================================

   `[SHAPE]` This file turns the day editor's live model back into a Record
   entry. **It is loaded by the PAGE and by `npm run day:proof`, and it is the
   SAME SOURCE TEXT in both** — the page inlines this file verbatim inside a
   `<script>`, and the proof reads the same bytes off disk and evaluates them.
   `day-proof.mjs` asserts the two are byte-identical by sha256 before it runs
   a single check, because a proof that passes against a second implementation
   of the collector proves something about the proof.

   THAT IS WHY IT IS A PLAIN `.js` IIFE AND NOT AN ES MODULE. An `export` line
   cannot be inlined into a classic `<script>`, and a `<script type=module>`
   cannot be reached by the page's own click handlers without a second seam.
   One file, assigned to a global, works in both realms untouched — the same
   construction `record-edit.client.js` already uses.

   ── [MIKE, 2026-08-26] WYSIWYG, IN TWO RULINGS ON ONE DAY ──────────────────
   **FIRST HE ASKED: *"Is it WYSIWYG? If so, that is the test."*** It was not:
   the museum drew `pre-line`, which COLLAPSES runs of spaces inside a line,
   while the box showed them — `=  86%` in the box, `= 86%` on the glass. The
   museum went to `pre-wrap` and that half stands.

   **THEN HE READ THE EDITOR AGAIN: *"From Exec Summary and on, the indent is
   double indented, should not be."*** Because `pre-line` had been doing TWO
   things and only the first was wrong. It also REMOVED the leading indent of
   each line, and the box's DEDENT agreed with it — both ends put a body at one
   level. Dropping the dedent with it left the recipe's one level of indent and
   his own 2 or 4 leading spaces on top of it, at both ends at once.

   **SO THE DEDENT IS BACK AND THE ARGUMENT IS AT `dedent` BELOW.** Inner runs
   stay visible; the leading run comes off for DISPLAY at both ends, and the
   museum does the same thing in `RecordEntry.jsx`'s `dedentPara`. The `2
   spaces off` announcement does NOT come back — Mike killed it, and a rule
   both ends obey has nothing to announce.

   ── WHAT IT STILL HAS TO GET RIGHT ─────────────────────────────────────────

   1. **EVERY FIELD THE READER CARRIED COMES BACK OUT.** The repair at
      `a3356c6` taught the reader and the emitter fourteen entry fields and
      eight doc fields. This sits between them. It edits five string fields and
      the sections; **everything else is carried in `rest` and spread back
      untouched** — `docs` with its sources and plates, `wire`, `plates`,
      `stillCaption`. A collector that rebuilt an entry from the boxes on the
      glass would drop every one of them and the emitter could not refuse it:
      its guard names a field it cannot WRITE, and an ABSENT field is not
      something it can see. `P1` proves this by deleting the spread.

   2. **A `{pre}` BODY ITEM STAYS A `{pre}` BODY ITEM.** Folding it to a string
      keeps every character and throws away the one bit that says they are
      COLUMNS. The shape travels on the item.

   3. **AN UNTOUCHED BOX RETURNS THE ITEMS THAT ARRIVED, NOT A RE-SPLIT.** A
      box whose text still equals the DEDENTED form of what it was seeded with
      emits the original item array — boundaries, shapes and leading spaces
      intact. The blank-line split and the re-indent are reached only by a box
      he has changed.

   4. **AN EMPTY FIELD IS OMITTED, NOT EMITTED AS `""`.** That is the shape
      `draftEntries` itself produces. A cleared field therefore leaves the KEY
      SET, which is how `P3` names it — see `keysOf`.

   ── THE KEY IS AN IDENTITY, NEVER A POSITION ───────────────────────────────
   `keysOf` returns the same key vocabulary the readiness marks already use —
   `field:title`, `section:<the header he wrote>`, `attachment:<its title>` —
   because `day.mjs` already ruled that vocabulary and a second one would be a
   second answer to *which row is this*. `diffKeys` is what makes a deletion
   speak: the page carries the set it OPENED with alongside the set it is
   SAVING, and anything that left is named.

   **AND THE LIMIT IS STATED RATHER THAN GLOSSED: THIS CANNOT TELL A DELIBERATE
   DELETION FROM A BUG.** It makes sure neither is silent.
   =========================================================================== */
(function (root) {
  "use strict";

  /* ═══ [MIKE, 2026-08-26] THE DEDENT IS BACK, AND SO IS THE MUSEUM'S ═══════
     **IT WAS REMOVED THE SAME DAY AND THAT WAS AN OVER-REACH.** His question
     was *"Is it WYSIWYG?"*, and the answer was no because the museum's
     `pre-line` COLLAPSED runs of spaces inside a line while the box showed
     them. But `pre-line` was doing two things, and the other one — REMOVING
     the leading indent of each line — was right, and the box's dedent agreed
     with it. Dropping both put a second level of indent on the glass and in
     the box on the same afternoon: *"From Exec Summary and on, the indent is
     double indented, should not be."*

     SO INNER RUNS STAY VISIBLE — that half of the ruling stands, `=  86%`
     draws with both spaces at both ends — AND THE LEADING RUN COMES OFF FOR
     DISPLAY AT BOTH ENDS. `RecordEntry.jsx`'s `dedentPara` is the museum's
     copy of this arithmetic and `day:proof` asserts the two agree on every
     string in the Record.

     ── AND IT IS PUT BACK ON SAVE, WHICH IS WHAT KEEPS THE DATA HIS ──────────
     The alternative — save what the box shows — would strip his leading spaces
     out of `robots-record.js` the first time he pressed Save, silently, on
     every section he never touched. §0 VERBATIM says his characters are his,
     so the transform is DISPLAY-ONLY: an untouched box emits the original
     string byte for byte, and a box he changed is re-indented to that block's
     own level so an edit lands where the paragraph above it sits.

     WYSIWYG IS UNAFFECTED BECAUSE WYSIWYG IS ABOUT THE BOX AND THE PAGE, NOT
     ABOUT THE BOX AND THE FILE. He never reads the file. */
  function dedent(s) {
    var lines = String(s).split("\n");
    var runs = [], i;
    for (i = 0; i < lines.length; i++) {
      if (lines[i].trim() !== "") runs.push(lines[i].match(/^ */)[0].length);
    }
    var cut = runs.length ? Math.min.apply(null, runs) : 0;
    if (!cut) return { text: String(s), cut: 0 };
    var out = [];
    for (i = 0; i < lines.length; i++) out.push(lines[i].slice(cut));
    return { text: out.join("\n"), cut: cut };
  }

  /* PUT IT BACK ON, AND ONLY ON LINES THAT CARRY SOMETHING. Padding a blank
     line would add trailing whitespace he never typed. */
  function reindent(s, cut) {
    if (!cut) return String(s);
    var pad = new Array(cut + 1).join(" ");
    return String(s).split("\n")
      .map(function (l) { return l.trim() === "" ? l : pad + l; })
      .join("\n");
  }

  /* ── ONE BOX, ONE STRING ─────────────────────────────────────────────────
     `f` is `{ orig, cut, text }`. An untouched box returns its original
     verbatim; a changed one is re-indented to the block's own level. */
  function outOf(f) {
    if (!f) return "";
    var t = String(f.text == null ? "" : f.text);
    if (f.orig != null && dedent(f.orig).text === t) return f.orig;
    return reindent(t, f.cut || 0);
  }

  /* ── ONE BOX, MANY PARAGRAPHS — AND WHY THE GROUPING EXISTS ─────────────
     MIKE'S RECIPE IS ONE TEXT BOX PER SECTION: *"Section text box that accepts
     crlf and expands … it is spaced like I show it, has as many lines as I
     give it."* A section's BODY is a LIST of items, and the museum draws one
     paragraph per item. One box, many items — so the box has to carry the
     boundary, and a blank line is the boundary every writer already uses.

     A `{pre}` ITEM IS NOT IN THE GROUP AND THAT IS THE WHOLE REASON THE GROUP
     EXISTS. 004's folder tree is `{ pre: "…" }` and the museum draws it as an
     aligned Listing rather than as prose. It contains blank lines of its own,
     so a blank-line split would cut a listing into three listings and the
     shape that says COLUMNS would be lost from two of them. **A `{pre}` item
     is ONE item, so it gets ONE box of its own and needs no split at all** —
     it is fully editable, and it comes back `{pre}` because the block says so.

     THE SPLIT IS ONLY EVER REACHED BY A BOX HE CHANGED. An untouched box
     returns its original item array verbatim, so the round trip of a day
     nobody edited cannot depend on the split being reversible. */
  var SPLIT = /\n[ \t]*\n/;
  /* THE PARAGRAPH JOIN, NAMED ONCE — a blank line is the boundary one box
     carries between the items of one section body. */
  var PARA = "\n\n";

  /* THE CUT IS PER PARAGRAPH, NOT PER BOX, AND THAT IS THE MUSEUM'S UNIT.
     `RecordEntry.jsx` draws one `<p>` per body item and dedents each one on its
     own. A box groups several items, so dedenting the JOINED text takes the
     minimum across all of them — and where one paragraph sits at 4 and another
     at 2, the box cuts 2 and leaves the first paragraph showing a second level
     while the museum shows none. **Measured on Record 003's ADDENDUM 02**,
     which is exactly that shape and is the last section of that day: the box
     read `"  THE CEO         - one page…"` and the page read `"THE CEO…"`.
     So every item is dedented on its own and the box is the join of those. */
  function itemTexts(b) {
    return (b.items || []).map(function (x) {
      return typeof x === "string" ? dedent(x).text : String(x);
    });
  }

  function blockOut(b) {
    if (b.kind === "pre") return [{ pre: outOf(b) }];
    var t = String(b.text == null ? "" : b.text);
    if (b.items && itemTexts(b).join(PARA) === t) {
      /* UNTOUCHED: the items that arrived, in the shapes they arrived in. */
      return (b.items || []).slice();
    }
    var cuts = b.cuts || [], parts = t.split(SPLIT), out = [], i;
    for (i = 0; i < parts.length; i++) {
      if (parts[i].trim() === "") continue;
      /* A NEW PARAGRAPH TAKES THE LEVEL OF THE ONE BEFORE IT, which is what
         "lands level with the paragraph above" means; the first one with no
         history at all lands flush. */
      var c = i < cuts.length ? cuts[i] : (cuts.length ? cuts[cuts.length - 1] : 0);
      out.push(reindent(parts[i], c));
    }
    return out;
  }

  /* ── A BODY BECOMES BOXES ────────────────────────────────────────────────
     Consecutive string items group into one box; a `{pre}` item takes a box of
     its own; anything else is a shape this editor does not author and gets a
     box that will not take a keystroke. **THE GENERATOR CALLS THIS TOO** — it
     evaluates this same file rather than carrying its own copy — so the boxes
     drawn on the page and the boxes the proof reasons about are built by one
     function. The drawn arrangement and the saved arrangement are the two
     things that must never be able to disagree. */
  var UID = 0;
  function blocksOf(items) {
    var out = [], run = [], i;
    function flush() {
      if (!run.length) return;
      var items = run.slice();
      var cuts = items.map(function (x) { return dedent(x).cut; });
      var texts = items.map(function (x) { return dedent(x).text; });
      out.push({ uid: "b" + (++UID), kind: "strs", items: items,
        raw: items.join("\n\n"), cuts: cuts, cut: cuts.length ? cuts[0] : 0,
        text: texts.join("\n\n") });
      run = [];
    }
    for (i = 0; i < (items || []).length; i++) {
      var p = items[i];
      if (typeof p === "string") { run.push(p); continue; }
      flush();
      if (p && typeof p.pre === "string") {
        /* A LISTING KEEPS ITS OWN LEADING RUN. `Listing` derives the museum's
           columns from exactly those spaces, so a dedent here would move the
           whole tree left on the glass. cut 0, text = raw. */
        out.push({ uid: "b" + (++UID), kind: "pre", items: [p],
          raw: p.pre, cuts: [0], cut: 0, text: p.pre });
        continue;
      }
      var s = JSON.stringify(p, null, 1);
      out.push({ uid: "b" + (++UID), kind: "opaque", items: [p], raw: s, cuts: [0], cut: 0, text: s });
    }
    flush();
    return out;
  }

  function fieldOf(raw) {
    var d = dedent(String(raw));
    return { orig: String(raw), cut: d.cut, text: d.text };
  }

  /* ── AN ENTRY BECOMES A DAY ──────────────────────────────────────────────
     THE OTHER HALF OF `collect`, AND THEY ARE IN ONE FILE SO THAT
     `collect(modelOf(e))` CAN BE ASSERTED TO EQUAL `e`. That identity is the
     single strongest thing `day:proof` checks: it says that opening a day in
     the editor and saving it without touching a key changes nothing, field for
     field and character for character. */
  var STRING_FIELDS = ["stamp", "title", "line", "lead", "still", "tomb", "note"];

  function modelOf(entry) {
    var day = { no: entry.no, date: entry.date || null, rest: {}, fields: {}, sections: [] };
    var edited = { no: 1, date: 1, sections: 1 }, i, k;
    for (i = 0; i < STRING_FIELDS.length; i++) edited[STRING_FIELDS[i]] = 1;
    for (k in entry) if (Object.prototype.hasOwnProperty.call(entry, k) && !edited[k]) {
      day.rest[k] = entry[k];
    }
    for (i = 0; i < STRING_FIELDS.length; i++) {
      k = STRING_FIELDS[i];
      if (typeof entry[k] === "string") day.fields[k] = fieldOf(entry[k]);
    }
    for (i = 0; i < (entry.sections || []).length; i++) {
      var s = entry.sections[i];
      day.sections.push({ label: fieldOf(s.label || ""), blocks: blocksOf(s.body || []) });
    }
    return day;
  }

  /* ── THE ENTRY ───────────────────────────────────────────────────────────
     `rest` FIRST AND EVERYTHING EDITED AFTER IT, so a field this editor owns
     always wins over the copy that arrived, and a field it does not own
     survives whether or not this file has ever heard of it. */
  function collect(day) {
    var e = {}, k, i;
    var rest = day.rest || {};
    for (k in rest) if (Object.prototype.hasOwnProperty.call(rest, k)) e[k] = rest[k];

    e.no = day.no;
    if (day.date) e.date = day.date; else delete e.date;

    for (i = 0; i < STRING_FIELDS.length; i++) {
      k = STRING_FIELDS[i];
      var f = (day.fields || {})[k];
      if (!f) continue;
      var v = outOf(f);
      if (v === "") delete e[k]; else e[k] = v;
    }

    var secs = [];
    for (i = 0; i < (day.sections || []).length; i++) {
      var s = day.sections[i];
      var label = outOf(s.label);
      var body = [];
      for (var j = 0; j < (s.blocks || []).length; j++) {
        var b = s.blocks[j];
        /* A BOX WITH NOTHING IN IT WRITES NOTHING. */
        if (String(b.text == null ? "" : b.text) === "") continue;
        body = body.concat(blockOut(b));
      }
      /* A SECTION WITH NO LINES IS NOT WRITTEN, AND THAT IS THE MUSEUM'S OWN
         BEHAVIOUR RATHER THAN A CHOICE MADE HERE: *"a section with an empty
         body is dropped ENTIRELY, its header with it."* Two rows look like
         this and both must produce nothing — the row he just INSERTED and has
         not typed into, and the MANDATORY row the page draws loudly because it
         is missing. */
      if (!body.length) continue;
      secs.push({ label: label, body: body });
    }
    if (secs.length) e.sections = secs; else delete e.sections;

    return e;
  }

  /* ── THE KEY SET — THE SAME VOCABULARY THE MARKS USE ─────────────────────
     A key appears when its element CARRIES something. That is what makes a
     cleared headline and a deleted section the same event to `diffKeys`. */
  function keysOf(entry) {
    var out = [], i;
    for (i = 0; i < STRING_FIELDS.length; i++) {
      var k = STRING_FIELDS[i];
      if (entry[k] != null && entry[k] !== "") out.push("field:" + k);
    }
    for (i = 0; i < (entry.sections || []).length; i++) {
      out.push("section:" + String(entry.sections[i].label || "(no header)"));
    }
    for (i = 0; i < (entry.docs || []).length; i++) {
      out.push("attachment:" + String(entry.docs[i].title || "(untitled)"));
    }
    return out;
  }

  /* WHAT LEFT AND WHAT ARRIVED, BY KEY. Order is not identity, so this is a
     set comparison and a reordered day reports nothing. */
  function diffKeys(before, after) {
    var has = {}, had = {}, i;
    for (i = 0; i < after.length; i++) has[after[i]] = 1;
    for (i = 0; i < before.length; i++) had[before[i]] = 1;
    var gone = [], added = [];
    for (i = 0; i < before.length; i++) if (!has[before[i]] && gone.indexOf(before[i]) < 0) gone.push(before[i]);
    for (i = 0; i < after.length; i++) if (!had[after[i]] && added.indexOf(after[i]) < 0) added.push(after[i]);
    return { gone: gone, added: added };
  }

  /* ── THE ONLY NUMBER ON THE PAGE, LIVE ───────────────────────────────────
     One function for the count under a box he is TYPING into and the count the
     generator bakes. `short` is the whole hint: the mark itself already prints
     `70/62`, and the two paragraphs this used to carry said the same thing
     about the same gate on every hover. */
  function budgetMark(len, b, near) {
    if (len == null || !b) return null;
    if (len > b.max) {
      return { level: "bad", says: len + "/" + b.max,
        short: (len - b.max) + " over — the packet gate refuses it" };
    }
    if (len > b.max - near) {
      return { level: "warn", says: len + "/" + b.max,
        short: (b.max - len) + " left — nothing refuses it yet" };
    }
    return null;
  }

  /* ── WHAT CSS DOES TO A STRING, MODELLED ────────────────────────────────
     `day:proof` needs to say what a visitor SEES, and the difference between
     the two white-space modes is exactly what this round is about. This is the
     CSS text-processing rule for each mode, applied to one string:

       pre-wrap   every character survives.
       pre-line   runs of white space collapse to one space, and white space at
                  the START of a line is removed. Newlines survive.

     IT IS A MODEL AND IT IS LABELLED ONE. §0 rules that the only oracle for a
     rendered thing is a rendered thing, so the proof uses this to say WHICH
     strings and HOW MANY characters differ, and the browser is what confirms
     the museum actually draws them. Both are in the round report. */
  function asRendered(s, mode) {
    var t = String(s);
    if (mode === "pre-wrap" || mode === "pre") return t;
    if (mode === "pre-line") {
      return t.split("\n").map(function (l) {
        return l.replace(/[ \t]+/g, " ").replace(/^[ \t]+/, "").replace(/[ \t]+$/, "");
      }).join("\n");
    }
    /* `normal`: newlines are white space too, so the whole thing is one run. */
    return t.replace(/\s+/g, " ").replace(/^ +/, "").replace(/ +$/, "");
  }

  root.WBDay = {
    dedent: dedent, reindent: reindent, outOf: outOf, blockOut: blockOut, blocksOf: blocksOf, fieldOf: fieldOf,
    modelOf: modelOf, collect: collect, keysOf: keysOf, diffKeys: diffKeys,
    budgetMark: budgetMark, asRendered: asRendered,
    STRING_FIELDS: STRING_FIELDS,
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
