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

   ── WHAT IT HAS TO GET RIGHT, AND WHY EACH ONE IS A LOSS IF IT DOES NOT ────

   1. **EVERY FIELD THE READER CARRIED COMES BACK OUT.** The repair at `a3356c6`
      taught the reader and the emitter fourteen entry fields and eight doc
      fields. This sits between them. It edits five string fields and the
      sections; **everything else is carried in `rest` and spread back
      untouched** — `docs` with its sources and plates, `wire`, `plates`,
      `stillCaption`. A collector that rebuilt an entry from the boxes on the
      glass would drop every one of them and the emitter would write the
      shortfall to the tree without a word, because a field that is ABSENT is
      not a field the emitter can refuse. `P1` proves this by deleting the
      `rest` spread and watching the check name what went.

   2. **A `{pre}` BODY ITEM STAYS A `{pre}` BODY ITEM.** Folding it to a string
      keeps every character and throws away the one bit that says they are
      COLUMNS — 004's folder tree draws as an aligned Listing on the glass and
      as a paragraph without it. The shape travels on the item.

   3. **AN UNTOUCHED STRING COMES BACK BYTE-IDENTICAL, LEADING SPACES AND ALL.**
      This is the trap the editable box created and the read-only page did not
      have. `dedent()` takes the common leading run off for DISPLAY — Mike
      ruled that indent artificial and it is, it is how the workbook types —
      but a box that DISPLAYS the dedented text and SAVES what is in the box
      rewrites his file the first time he presses Save, silently, on every
      section he did not touch.

      SO THE ORIGINAL IS KEPT ON THE ITEM AND THE TEST IS AGAINST THE DISPLAY:
      if the box still reads what `dedent()` produced, **the original string is
      emitted verbatim** and nothing moved. If it does not, he typed, and the
      text is emitted with that item's own cut re-applied, so an edit lands at
      the level the rest of the block is written at. **A new item has no
      original and no cut and is emitted exactly as typed** — the indent is an
      artefact of the surface that is being retired, and nothing here creates
      a new one.

   4. **AN EMPTY FIELD IS OMITTED, NOT EMITTED AS `""`.** That is the shape
      `draftEntries` itself produces, and the emitter's set is a list of what
      may be written rather than what must be. A cleared field therefore leaves
      the KEY SET, which is how `P3` names it — see `keysOf`.

   ── THE KEY IS AN IDENTITY, NEVER A POSITION ───────────────────────────────
   `keysOf` returns the same key vocabulary the readiness marks already use —
   `field:title`, `section:<the header he wrote>`, `attachment:<its title>` —
   because `day.mjs` already ruled that vocabulary and a second one would be a
   second answer to *which row is this*. `diffKeys` is what makes a deletion
   speak: the page carries the set it OPENED with alongside the set it is
   SAVING, and anything that left is named.

   **AND THE LIMIT IS STATED RATHER THAN GLOSSED: THIS CANNOT TELL A DELIBERATE
   DELETION FROM A BUG.** It makes sure neither is silent. Telling them apart
   needs Mike to confirm, and a confirmation step is UX.
   =========================================================================== */
(function (root) {
  "use strict";

  /* THE COMMON LEADING RUN, ACROSS NON-EMPTY LINES ONLY. Identical arithmetic
     to `dedent()` in `day.mjs`, and that is not a duplicate by accident: the
     generator dedents to DRAW and this dedents to COMPARE, and if the two ever
     disagreed an untouched box would read as edited and his indent would be
     rewritten. `day-proof.mjs` asserts they agree on every body in the tree. */
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
     line would add trailing whitespace he never typed, which is a change the
     round trip would report as his. */
  function reindent(s, cut) {
    if (!cut) return String(s);
    var pad = new Array(cut + 1).join(" ");
    return String(s).split("\n")
      .map(function (l) { return l.trim() === "" ? l : pad + l; })
      .join("\n");
  }

  /* ── ONE BOX, ONE STRING ─────────────────────────────────────────────────
     `f` is `{ orig, text, cut }`. See note 3 above for why the test is against
     the DISPLAYED form and not against the stored one. */
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

     SO A SECTION'S BLOCKS ARE: each run of consecutive string items grouped
     into one box, and each `{pre}` item alone in its own. For every entry in
     the tree today that is exactly one box per section, except 004's tree.

     THE SPLIT IS ONLY EVER REACHED BY A BOX HE CHANGED. An untouched box
     returns its original item array verbatim — note 3 — so the round trip of
     a day nobody edited cannot depend on the split being reversible. */
  var SPLIT = /\n[ \t]*\n/;

  function blockOut(b) {
    if (b.kind === "pre") return [{ pre: outOf(b) }];
    var t = String(b.text == null ? "" : b.text);
    if (b.orig != null && dedent(b.orig).text === t) {
      /* UNTOUCHED: the items that arrived, in the shapes they arrived in. */
      return (b.items || []).slice();
    }
    var whole = reindent(t, b.cut || 0);
    var parts = whole.split(SPLIT), out = [], i;
    for (i = 0; i < parts.length; i++) {
      if (parts[i].trim() !== "") out.push(parts[i]);
    }
    return out;
  }

  /* ── THE ENTRY ───────────────────────────────────────────────────────────
     `rest` FIRST AND EVERYTHING EDITED AFTER IT, so a field this editor owns
     always wins over the copy that arrived, and a field it does not own
     survives whether or not this file has ever heard of it. */
  var STRING_FIELDS = ["stamp", "title", "line", "lead", "still", "tomb", "note"];

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
        /* A BOX WITH NOTHING IN IT WRITES NOTHING. He clears a box to empty a
           section, and an empty string in a body draws an empty paragraph on
           the glass rather than nothing at all. */
        if (String(b.text == null ? "" : b.text) === "") continue;
        body = body.concat(blockOut(b));
      }
      /* A SECTION WITH NO LINES IS NOT WRITTEN, AND THAT IS THE MUSEUM'S OWN
         BEHAVIOUR RATHER THAN A CHOICE MADE HERE: *"a section with an empty
         body is dropped ENTIRELY, its header with it."* Two rows look like
         this and both must produce nothing — the row he just INSERTED and has
         not typed into, and the MANDATORY row the page draws loudly because it
         is missing. Emitting either would put a phantom section in the draft
         and land an empty header in the tree. */
      if (!body.length) continue;
      secs.push({ label: label, body: body });
    }
    if (secs.length) e.sections = secs; else delete e.sections;

    return e;
  }

  /* ── A BODY BECOMES BOXES ────────────────────────────────────────────────
     Consecutive string items group into one box; a `{pre}` item takes a box of
     its own; anything else is a shape this editor does not author and gets a
     box that will not take a keystroke. **THE GENERATOR CALLS THIS TOO** — it
     evaluates this same file rather than carrying its own copy — so the boxes
     drawn on the page and the boxes the proof reasons about are built by one
     function. They were two for one build of this piece and that was long
     enough: the drawn arrangement and the saved arrangement are the two things
     that must never be able to disagree. */
  var UID = 0;
  function blocksOf(items) {
    var out = [], run = [], i;
    function flush() {
      if (!run.length) return;
      var raw = run.join("\n\n"), d = dedent(raw);
      out.push({ uid: "b" + (++UID), kind: "strs", items: run.slice(),
        raw: raw, cut: d.cut, text: d.text });
      run = [];
    }
    for (i = 0; i < (items || []).length; i++) {
      var p = items[i];
      if (typeof p === "string") { run.push(p); continue; }
      flush();
      if (p && typeof p.pre === "string") {
        var dp = dedent(p.pre);
        out.push({ uid: "b" + (++UID), kind: "pre", items: [p], raw: p.pre,
          cut: dp.cut, text: dp.text });
        continue;
      }
      var s = JSON.stringify(p, null, 1);
      out.push({ uid: "b" + (++UID), kind: "opaque", items: [p], raw: s, cut: 0, text: s });
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
     field and character for character — which is the property every other
     guarantee on this page is standing on. */
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

  /* ── THE KEY SET — THE SAME VOCABULARY THE MARKS USE ─────────────────────
     A key appears when its element CARRIES something. That is what makes a
     cleared headline and a deleted section the same event to `diffKeys`: both
     stopped carrying, and both are named. */
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
    var has = {}, i;
    for (i = 0; i < after.length; i++) has[after[i]] = 1;
    var had = {};
    for (i = 0; i < before.length; i++) had[before[i]] = 1;
    var gone = [], added = [];
    for (i = 0; i < before.length; i++) if (!has[before[i]] && gone.indexOf(before[i]) < 0) gone.push(before[i]);
    for (i = 0; i < after.length; i++) if (!had[after[i]] && added.indexOf(after[i]) < 0) added.push(after[i]);
    return { gone: gone, added: added };
  }

  /* ── THE ONLY NUMBER ON THE PAGE, LIVE ───────────────────────────────────
     Moved here from `day.mjs` at Piece 4 so the count under a box he is TYPING
     into and the count the generator bakes are one function. Two would drift,
     and the one that drifted would be the one he is looking at. */
  function budgetMark(len, b, near) {
    if (len == null || !b) return null;
    /* `short` IS THE WHOLE HINT NOW — one line, a few words, and the mark
       itself already prints the numbers as `70/62`. The two paragraphs this
       used to carry said the same thing about the same gate on every hover,
       which is the furniture Mike killed on 2026-08-26. */
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

  root.WBDay = {
    dedent: dedent, reindent: reindent, outOf: outOf, blockOut: blockOut,
    blocksOf: blocksOf, fieldOf: fieldOf, modelOf: modelOf,
    collect: collect, keysOf: keysOf, diffKeys: diffKeys, budgetMark: budgetMark,
    STRING_FIELDS: STRING_FIELDS,
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
