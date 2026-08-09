/* ===========================================================================
   THE RECORD EDITOR — the browser half. [E1/E2 2026-08-09]
   ---------------------------------------------------------------------------
   MIKE, retiring the two-column worksheet: *"HE EDITS THE RECORD ITSELF,
   DIRECTLY — every part of it: headline, index line, executive summary,
   sections, notes. NOT side by side. He must feel he is IN THE REAL THING as
   much as feasible… it must be live, it must be the Record, and there must
   still be a COPY BUTTON that hands the whole thing back to Ops in one click."*

   ═══ HOW THE ILLUSION IS ACHIEVED, SINCE HE SAID HE DOES NOT MIND ═══════════
   There is no editor widget on this page. `WBPreview.render` draws the museum's
   OWN `RecordEntry` and `RecordIndexRow` — the same modules `/robots` renders,
   against the same stylesheets — and then this file walks the resulting DOM and
   makes the museum's own paragraphs `contenteditable`. So what he types into IS
   the museum's `<p class="vp-rec-sect-body">`, at the museum's type size, at the
   museum's measure, wrapping the way the museum will wrap it. Nothing is
   mirrored, approximated or re-implemented; there is no second copy of the text
   anywhere on the page.

   ═══ THE ONE RULE THAT KEEPS THE CARET ALIVE ════════════════════════════════
   React holds a virtual copy of what it last rendered. While he is typing, the
   DOM has moved on and React's copy has not — so **nothing re-renders while a
   field has focus.** The model is updated on every keystroke (so a save or a
   copy is never stale), and the tree is redrawn on BLUR, when React's stale text
   and the new text differ and it can safely replace the node. Redrawing on
   `input` would set `textContent` under the caret on every character.

   ═══ WHY THE FIELDS ARE FOUND BY CLASS AND NOT BY A PROP ════════════════════
   Marking them would mean adding attributes to two SHIPPED components for the
   benefit of an Ops tool. The classes used below are the same ones `Exhibit.css`
   targets — they are the stable contract of that markup, and a rename breaks the
   museum's own stylesheet loudly. What a rename could still do is make a field
   quietly uneditable, so `audit()` checks after every render that every field
   the model holds actually found a node, and puts a red banner on the page if
   one did not. A silent failure here is the one failure this instrument may not
   have: he would type into a page that looked right and lose the words.
   =========================================================================== */
(function () {
  "use strict";

  var CFG = JSON.parse(document.getElementById("wb-record-config").textContent);
  var mount = document.getElementById("mount");

  /* ── STORAGE ──────────────────────────────────────────────────────────────
     Probed rather than assumed. A browser that refuses storage must SAY SO in
     red rather than lose an hour of typing quietly — the same rule the
     worksheet was built to (U-round). */
  var store = null;
  try {
    window.localStorage.setItem("wb.probe", "1");
    window.localStorage.removeItem("wb.probe");
    store = window.localStorage;
  } catch { store = null; }

  var elWarn = document.getElementById("wb-warn");
  var elNote = document.getElementById("wb-note");
  var elSay = document.getElementById("wb-say");
  var elChips = document.getElementById("wb-chips");
  var elLim = document.getElementById("wb-lim");
  var elPaste = document.getElementById("wb-paste");
  var elOut = document.getElementById("wb-out");
  var elNo = document.getElementById("wb-no");
  var elDate = document.getElementById("wb-date");

  function warn(html) { elWarn.innerHTML = '<button class="wb-x" type="button">&times;</button>' + html; elWarn.className = "wb-warn on"; }
  function note(html) { elNote.innerHTML = '<button class="wb-x" type="button">&times;</button>' + html; elNote.className = "wb-note on"; }
  function say(msg, cls) { elSay.textContent = msg; elSay.className = "wb-say" + (cls ? " " + cls : ""); }
  document.addEventListener("click", function (ev) {
    if (ev.target && ev.target.className === "wb-x") ev.target.parentNode.className =
      ev.target.parentNode.className.replace(" on", "");
  });

  if (!store) {
    warn("<b>This browser refused local storage.</b> Nothing you type here is being "
       + "saved automatically. Press <b>Save to the repo</b> often, or COPY EVERYTHING "
       + "and paste it to Ops before you close the tab.");
  }

  /* ── THE MODEL ────────────────────────────────────────────────────────────
     One array of entries and nothing else. `SHIPPED` is what `robots.js` holds
     today and is never written to: it is what a `*` beside a record means, and
     it is what tells Ops which entries actually need landing. */
  var SHIPPED = CFG.shipped;
  var entries = null;
  var cur = 0;

  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  function load() {
    var saved = null;
    if (store) { try { saved = JSON.parse(store.getItem(CFG.key) || "null"); } catch { saved = null; } }
    if (saved && saved.entries && saved.entries.length) return saved.entries;
    return clone(CFG.seed);
  }
  function save() {
    if (!store) return;
    try { store.setItem(CFG.key, JSON.stringify({ key: CFG.key, saved: new Date().toISOString(), epoch: CFG.epoch, entries: entries })); }
    catch {
      store = null;
      warn("<b>This browser has stopped accepting saved work</b> (the store is full or "
         + "was locked mid-session). Press COPY EVERYTHING or Save to the repo NOW — "
         + "what is on the page is still complete.");
    }
  }
  var saveTimer = null;
  function saveSoon() { if (saveTimer) clearTimeout(saveTimer); saveTimer = setTimeout(function () { save(); stat(); }, 400); }

  entries = load();

  /* ── THE MIGRATION (E3/E4) ────────────────────────────────────────────────
     MIKE: *"MIGRATE what is worth keeping from the old form INTO THE RECORD —
     but ONLY INTO BLANK RECORDS. Never overwrite anything he has already
     written. Say what moved and what was left."*

     TWO SOURCES, AND THE SECOND IS THE POINT. The generator already folded the
     durable `answers.json` into the seed. THIS runs against the worksheet's own
     `localStorage` key, which on a `file://` page is the same store the
     worksheet used — so anything he typed into the old form and never exported
     is still reachable from here, in his own browser, and travels across
     without him doing anything. That is the only place his most recent edits
     can be: the copies on disk are byte-identical to the last landing.

     BLANK MEANS BLANK. A field with any character in it is left alone; sections
     move only into an entry that has NO sections at all, because merging a half
     written body with a half written box is a decision no tool should make. */
  function isBlank(v) { return v == null || String(v).trim() === ""; }

  function migrate() {
    if (!store) return;
    var raw = null;
    try { raw = JSON.parse(store.getItem(CFG.worksheetKey) || "null"); } catch { raw = null; }
    if (!raw) return;
    var moved = [], left = [];
    CFG.carry.forEach(function (c) {
      var text = raw[c.slot];
      if (isBlank(text)) return;
      var e = byNo(c.no);
      if (!e) { left.push(c.slot + " — there is no Record " + pad(c.no) + " to move it into"); return; }
      if (c.field === "sections") {
        if (e.sections && e.sections.length) { left.push(c.slot + " — Record " + pad(c.no) + " already has sections"); return; }
        e.sections = window.WBSections(text);
        moved.push(c.slot + " → Record " + pad(c.no) + ", " + e.sections.length + " section(s)");
      } else if (c.field === "sections+") {
        var add = window.WBSections(text);
        if (!add.length) return;
        /* appended only where the entry's body came from the same migration —
           never on top of something he wrote here */
        if (!e.sections || !e.sections.length) { e.sections = add; moved.push(c.slot + " → Record " + pad(c.no) + ", " + add.length + " section(s)"); return; }
        if (!e.__migrated) { left.push(c.slot + " — Record " + pad(c.no) + " already has sections written here"); return; }
        e.sections = e.sections.concat(add);
        moved.push(c.slot + " → Record " + pad(c.no) + ", " + add.length + " more section(s)");
      } else {
        if (!isBlank(e[c.field])) { left.push(c.slot + " — Record " + pad(c.no) + " already has a " + c.field); return; }
        e[c.field] = text;
        moved.push(c.slot + " → Record " + pad(c.no) + " · " + c.field);
      }
      e.__migrated = 1;
    });
    entries.forEach(function (e) { delete e.__migrated; });
    if (!moved.length && !left.length) return;
    save();
    note("<b>" + moved.length + " answer(s) moved out of the old worksheet into blank records"
       + (left.length ? ", and " + left.length + " were left where they were" : "") + ".</b>"
       + "<ul>" + moved.map(function (m) { return "<li>moved: " + esc(m) + "</li>"; }).join("")
       + left.map(function (m) { return "<li>left: " + esc(m) + "</li>"; }).join("") + "</ul>"
       + "Nothing you had already written here was touched — a field with any "
       + "character in it is never overwritten.");
  }

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function pad(n) { return String(n).padStart(3, "0"); }
  function byNo(n) { for (var i = 0; i < entries.length; i++) if (entries[i].no === n) return entries[i]; return null; }

  /* ── THE ENTRY AS THE MUSEUM WANTS IT ─────────────────────────────────────
     The model carries editing conveniences the component must never see — an
     empty string for a field he has opened but not written yet, a section with
     nothing in it. This strips them, so the page always draws the entry the
     museum would draw. */
  /* `has` AND `isBlank` ARE DIFFERENT QUESTIONS AND THE DIFFERENCE IS A SINGLE
     SPACE. `isBlank` asks *is there anything written here* and decides whether a
     field is thrown away on blur. `has` asks *does this field EXIST* and decides
     whether the component draws it. A slot he has just opened holds one space:
     blank, and it must still draw, or the `+` button appears to do nothing and
     there is nothing on the page to click into. The first cut used `isBlank` for
     both and `+ lead` was a button that did nothing — caught by writing into
     every field, which is exactly what E5 asks for. */
  function has(v) { return v != null && String(v) !== ""; }

  function drawable(e) {
    var out = { no: e.no };
    if (has(e.date)) out.date = e.date;
    out.title = e.title == null ? "" : e.title;
    if (has(e.line)) out.line = e.line;
    if (has(e.lead)) out.lead = e.lead;
    if (has(e.tomb)) out.tomb = e.tomb;
    if (e.still) { out.still = e.still; if (e.stillCaption) out.stillCaption = e.stillCaption; }
    out.sections = (e.sections || []).map(function (s) {
      var o = { label: has(s.label) ? s.label : null, body: (s.body || []).slice() };
      if (!o.body.length) o.body = [" "];
      return o;
    });
    return out;
  }

  /* ── RENDER ───────────────────────────────────────────────────────────────
     One React root, re-rendered — never a fresh `createRoot` per edit, for the
     reason `tools/dictation/preview/entry.jsx` states: a remount fires the
     entry's mount effect and its `scrollIntoView` would fight him for the
     scroll position while he writes. */
  var wiring = 0;

  /* ═══ THE CARET GUARD IS A QUESTION, NOT A FLAG, AND THAT IS THE FIX ═══════
     The first cut kept a boolean set on `focusin` and cleared on `focusout`.
     It deadlocked the page: `focusPath()` focuses a node, a later render
     REPLACES that node, and a removed element fires no `focusout` — so the flag
     stayed true forever and every subsequent render was skipped in silence. The
     symptom was three buttons that appeared to do nothing while the model
     behind them was updating perfectly, which is the worst shape a defect can
     take on an instrument somebody is trusting with their writing.
     `document.activeElement` cannot get stuck, because it is the browser's
     answer rather than ours. */
  function inField() {
    var a = document.activeElement;
    return !!(a && a.getAttribute && a.getAttribute("data-wb-field") != null);
  }

  /* A STRUCTURAL EDIT MUTES THE COMMIT-ON-BLUR. Splitting a paragraph moves the
     text out from under the node it was in, so the blur that follows would
     write a stale string back over a model that has already moved on — and for
     a merge it would write it into the WRONG index, since the array has been
     spliced. It is a flag, deliberately, and it is the only one: it is set and
     cleared inside one synchronous block, so it cannot be left standing the way
     the focus flag was. */
  var muted = false;

  /* ═══ REACT 19 COMMITS WHEN IT IS READY, SO THE WIRING WAITS FOR IT ═════
     `root.render()` returns before the DOM has changed. The first version of
     this file wired immediately, found none of the thirty-two fields, and put
     a red banner on a page that was in fact perfect — ask a zero what it can
     see. So the wiring waits for a tick in which the entry has actually been
     drawn, and only warns after a generous number of them.

     IT IS A TIMER AND NOT `requestAnimationFrame`, AND THE 390px LAP IS WHY.
     rAF does not fire at all in a tab that is not being painted. Measured:
     the editor loaded in a background frame drew its entry correctly and then
     never wired a single field — an uneditable page, with no error anywhere,
     in exactly the situation nobody tests (open it in a second tab, come back
     to it later). A timeout is throttled in the background; it still runs.
     Correctness must not depend on the page being looked at. */
  function afterPaint(fn, tries) {
    var painted = mount.querySelector(".vp-rec-headline") || mount.querySelector(".vp-rec-sects");
    if (painted || tries <= 0) { fn(!painted); return; }
    window.setTimeout(function () { afterPaint(fn, tries - 1); }, 16);
  }
  function render(then) {
    if (inField()) return;                     // never redraw under the caret
    window.WBPreview.render(mount, drawable(entries[cur]), CFG.epoch);
    var seq = ++wiring;
    window.setTimeout(function () { afterPaint(function (neverPainted) {
      if (seq !== wiring) return;              // a later render has overtaken this one
      if (neverPainted) {
        warn("<b>The museum's own components did not draw.</b> This page needs "
           + "<code>_preview/preview.js</code> and <code>_preview/preview.css</code> beside it "
           + "&mdash; run <code>npm run dictation</code>. <b>Nothing you have written is affected</b>: "
           + "it is in this browser and in the file you last saved.");
        return;
      }
      wire();
      chips();
      stat();
      if (then) then();
    }, 60); }, 0);
  }

  /* ── FINDING THE FIELDS ───────────────────────────────────────────────────
     Class-based, and every hit is recorded so `audit()` can say what it did NOT
     find. `.vp-rec-sect-doors` is excluded by name: it is the renderer's
     orphan-door paragraph, not a paragraph of his. */
  function fields() {
    var f = [];
    var idx = mount.querySelector(".vp-rec-index");
    if (idx) {
      push(f, idx.querySelector(".vp-fe-title"), "title", "headline");
      push(f, idx.querySelector(".vp-rec-sum"), "line", "the whole summary in the index");
    }
    push(f, mount.querySelector(".vp-rec-headline"), "title", "headline");
    push(f, mount.querySelector(".vp-rec-lead"), "lead", "lead paragraph");
    var lis = mount.querySelectorAll(".vp-rec-sects > li");
    for (var i = 0; i < lis.length; i++) {
      push(f, lis[i].querySelector(".vp-rec-sect-label"), "sect." + i + ".label", "section heading");
      var ps = lis[i].querySelectorAll(".vp-rec-sect-body");
      var j = 0;
      for (var k = 0; k < ps.length; k++) {
        if (ps[k].className.indexOf("vp-rec-sect-doors") >= 0) continue;
        push(f, ps[k], "sect." + i + ".body." + j, "paragraph");
        j++;
      }
    }
    push(f, mount.querySelector(".vp-rec-tomb"), "tomb", "tombstone — where things stand when the lights go off");
    return f;
  }
  function push(list, el, path, what) { if (el) list.push({ el: el, path: path, what: what }); }

  var LIVE = [];
  function wire() {
    LIVE = fields();
    LIVE.forEach(function (f) {
      f.el.setAttribute("data-wb-field", f.path);
      f.el.setAttribute("contenteditable", supportsPlain ? "plaintext-only" : "true");
      f.el.setAttribute("spellcheck", "true");
      if (isBlank(get(f.path))) f.el.setAttribute("data-wb-ph", f.what);
      else f.el.removeAttribute("data-wb-ph");
    });
    paintBraces();
    audit();
  }
  var supportsPlain = (function () {
    var d = document.createElement("div");
    d.setAttribute("contenteditable", "plaintext-only");
    return d.contentEditable === "plaintext-only";
  })();

  /* ── THE SELF-CHECK ───────────────────────────────────────────────────────
     Every field the model HAS must have found a node. A model value with no
     node on the page is a field he cannot edit and would not know he cannot
     edit — the failure this instrument may not have. */
  function audit() {
    var e = entries[cur], missing = [];
    var have = {}; LIVE.forEach(function (f) { have[f.path] = 1; });
    ["title", "line", "lead", "tomb"].forEach(function (k) {
      if (!isBlank(e[k]) && !have[k]) missing.push(k);
    });
    (e.sections || []).forEach(function (s, i) {
      if (!isBlank(s.label) && !have["sect." + i + ".label"]) missing.push("section " + (i + 1) + " heading");
      (s.body || []).forEach(function (p, j) {
        if (!have["sect." + i + ".body." + j]) missing.push("section " + (i + 1) + ", paragraph " + (j + 1));
      });
    });
    if (missing.length) {
      warn("<b>This editor could not find " + missing.length + " field(s) on the page: "
         + esc(missing.join(", ")) + ".</b> They are in the record and they are NOT editable "
         + "here — do not retype them, and tell Ops: a class name in "
         + "<code>RecordEntry.jsx</code> has moved and this page has to move with it. "
         + "Everything else on the page is still safe to write in.");
    }
  }

  /* ── READING AND WRITING THE MODEL BY PATH ───────────────────────────────── */
  function get(path) {
    var e = entries[cur], p = path.split(".");
    if (p[0] !== "sect") return e[p[0]];
    var s = (e.sections || [])[Number(p[1])];
    if (!s) return null;
    return p[2] === "label" ? s.label : (s.body || [])[Number(p[3])];
  }
  function set(path, v) {
    var e = entries[cur], p = path.split(".");
    if (p[0] !== "sect") { e[p[0]] = v; return; }
    var s = (e.sections || [])[Number(p[1])];
    if (!s) return;
    if (p[2] === "label") s.label = v; else s.body[Number(p[3])] = v;
  }

  /* ═══ WHAT A NODE'S TEXT IS, AND `innerText` IS THE WRONG ANSWER ══════
     THE FIRST CUT USED `innerText` AND IT SILENTLY UPPER-CASED HIS SECTION
     HEADINGS. `innerText` returns what the page DISPLAYS, and
     `.vp-rec-sect-label` is `text-transform: uppercase` — so a heading typed
     "Detailed report" came back "DETAILED REPORT", and the index row's title
     carries the same rule. It is invisible on the glass (the glass upper-cases
     it either way, which is exactly why the case of his labels has always been
     his free choice — see the note on the two labels in `robots.js`), and it
     would have travelled into the museum's data as an edit of his words that
     nobody made. **Caught by writing into every field and comparing**, which is
     what E5 asked for and is the only thing that could have caught it.

     `textContent` is the characters actually in the DOM, untouched by CSS. A
     `<br>` becomes a newline explicitly rather than being lost, because
     `textContent` alone joins two lines into one word. Runs of whitespace are
     NOT collapsed — his two spaces in "Full containment  was made" are in the
     data on purpose (Record 001) and this is the only place they could be
     lost. */
  function textOf(el) {
    var copy = el.cloneNode(true);
    var brs = copy.querySelectorAll("br");
    for (var i = 0; i < brs.length; i++) {
      brs[i].parentNode.replaceChild(document.createTextNode("\n"), brs[i]);
    }
    return String(copy.textContent)
      .replace(/\u00a0/g, " ").replace(/\r/g, "").replace(/\n+$/, "");
  }

  /* ── EDITING ──────────────────────────────────────────────────────────────
     `input` writes THROUGH to the model and repaints the brace highlight; it
     never re-renders. `blur` re-renders, which is what makes the index row
     catch up with the headline, an emptied section disappear, and a `+` slot he
     did not use go away again. */
  mount.addEventListener("input", function (ev) {
    var el = ev.target.closest ? ev.target.closest("[data-wb-field]") : null;
    if (!el) return;
    set(el.getAttribute("data-wb-field"), textOf(el));
    el.removeAttribute("data-wb-ph");
    paintBraces();
    limitOf(el);
    saveSoon();
  });
  mount.addEventListener("focusin", function (ev) {
    var el = ev.target.closest ? ev.target.closest("[data-wb-field]") : null;
    if (!el) return;
    limitOf(el);
  });
  /* THE REDRAW IS DEFERRED BY ONE TICK, so that moving from one paragraph
     STRAIGHT into another does not redraw the tree out from under the caret he
     has just placed. At `focusout` time the browser has not yet settled who has
     focus; a tick later it has, and `inField()` answers truthfully. */
  mount.addEventListener("focusout", function (ev) {
    var el = ev.target.closest ? ev.target.closest("[data-wb-field]") : null;
    if (!el) return;
    elLim.className = "wb-lim";
    if (muted) return;
    set(el.getAttribute("data-wb-field"), textOf(el));
    tidy();
    save();
    setTimeout(function () { if (!inField()) render(); }, 0);
  });

  /* AN EMPTY THING GOES AWAY AGAIN. He opens a lead, changes his mind, and the
     record must not keep a blank paragraph in it — but nothing is removed while
     he is IN it, which is why this only runs on blur. */
  function tidy() {
    var e = entries[cur];
    ["line", "lead", "tomb"].forEach(function (k) { if (isBlank(e[k])) delete e[k]; });
    (e.sections || []).forEach(function (s) {
      s.body = (s.body || []).filter(function (p, i, a) { return !isBlank(p) || (a.length === 1 && !isBlank(s.label)); });
    });
    e.sections = (e.sections || []).filter(function (s) { return !isBlank(s.label) || (s.body && s.body.length); });
  }

  /* ENTER SPLITS A PARAGRAPH; BACKSPACE AT THE START MERGES IT BACK.
     A Record body is an ARRAY of paragraphs, so a newline inside one is not a
     paragraph break — it is a line break inside a single `<p>`, which is not
     what the museum will draw. Splitting here means what he sees is what the
     component will make of it. */
  mount.addEventListener("keydown", function (ev) {
    var el = ev.target.closest ? ev.target.closest("[data-wb-field]") : null;
    if (!el) return;
    var path = el.getAttribute("data-wb-field");
    var p = path.split(".");
    var isBody = p[0] === "sect" && p[2] === "body";

    if (ev.key === "Enter") {
      ev.preventDefault();
      if (!isBody) { el.blur(); return; }
      var at = caret(el);
      var text = textOf(el);
      var head = text.slice(0, at), tail = text.slice(at);
      var si = Number(p[1]), bi = Number(p[3]);
      var body = entries[cur].sections[si].body;
      body[bi] = head;
      body.splice(bi + 1, 0, tail);
      muted = true; el.blur(); muted = false;
      save();
      render(function () { focusPath("sect." + si + ".body." + (bi + 1), 0); });
      return;
    }
    if (ev.key === "Backspace" && isBody && caret(el) === 0) {
      var si2 = Number(p[1]), bi2 = Number(p[3]);
      if (bi2 === 0) return;
      ev.preventDefault();
      var b = entries[cur].sections[si2].body;
      var join = b[bi2 - 1].length;
      b[bi2 - 1] = b[bi2 - 1] + b[bi2];
      b.splice(bi2, 1);
      muted = true; el.blur(); muted = false;
      save();
      render(function () { focusPath("sect." + si2 + ".body." + (bi2 - 1), join); });
    }
  });

  function caret(el) {
    var sel = window.getSelection();
    if (!sel || !sel.rangeCount) return 0;
    var r = sel.getRangeAt(0).cloneRange();
    r.selectNodeContents(el);
    r.setEnd(sel.getRangeAt(0).endContainer, sel.getRangeAt(0).endOffset);
    return r.toString().length;
  }
  function focusPath(path, offset) {
    var el = mount.querySelector('[data-wb-field="' + path + '"]');
    if (!el) return;
    el.focus();
    var node = el.firstChild;
    var sel = window.getSelection(), r = document.createRange();
    if (node && node.nodeType === 3) r.setStart(node, Math.min(offset, node.length));
    else r.setStart(el, 0);
    r.collapse(true);
    sel.removeAllRanges(); sel.addRange(r);
  }

  /* ── THE BRACE HIGHLIGHT (E2) ─────────────────────────────────────────────
     Ranges, not nodes — see the note in `record-edit.css`. If the browser has
     no Custom Highlight API the notes are simply not tinted, which costs
     nothing: the braces are still characters he can see, they still travel, and
     the gates still refuse them. */
  var HL = (window.CSS && window.CSS.highlights && window.Highlight) ? new window.Highlight() : null;
  if (HL) window.CSS.highlights.set("wb-brace", HL);
  function paintBraces() {
    if (!HL) return;
    HL.clear();
    var n = 0;
    mount.querySelectorAll("[data-wb-field]").forEach(function (el) {
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      var t;
      while ((t = walker.nextNode())) {
        var re = /\{[^{}]*\}/g, m;
        while ((m = re.exec(t.data))) {
          var r = document.createRange();
          r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length);
          HL.add(r); n++;
        }
      }
    });
    return n;
  }

  /* ── THE LIVE COUNT (Doctrine 22) ─────────────────────────────────────────
     ONE DECLARATION, EVERY READER: the two numbers come from
     `reveal/record-shape.mjs` through the generator and are never retyped here.
     It WARNS and never blocks — there is no `maxlength` anywhere on this page —
     and it says where there is NO limit, because "no limit" is itself something
     he has to be told. */
  function limitOf(el) {
    var path = el.getAttribute("data-wb-field");
    var v = textOf(el).replace(/\s+$/, "");
    var b = CFG.budgets[path];
    var r = el.getBoundingClientRect();
    elLim.style.left = Math.max(6, Math.round(r.left)) + "px";
    elLim.style.top = Math.max(6, Math.round(r.top - 26)) + "px";
    if (!b) {
      elLim.className = "wb-lim on";
      elLim.textContent = v.length + " characters · no limit on this field";
      return;
    }
    var over = v.length - b.max;
    if (over > 0) {
      elLim.className = "wb-lim on over";
      elLim.textContent = over + " OVER — " + v.length + " of " + b.max + ". " + b.says;
    } else {
      elLim.className = "wb-lim on" + (v.length > b.max - 15 ? " near" : "");
      elLim.textContent = v.length + " / " + b.max + " characters";
    }
  }

  /* ── THE RECORD RAIL ──────────────────────────────────────────────────────
     Every record in the volume, by its own number, with a `*` on the ones that
     differ from what `robots.js` ships today. */
  function shippedOf(n) { for (var i = 0; i < SHIPPED.length; i++) if (SHIPPED[i].no === n) return SHIPPED[i]; return null; }
  function edited(e) {
    var s = shippedOf(e.no);
    if (!s) return true;
    return JSON.stringify(drawable(e)) !== JSON.stringify(drawable(s));
  }
  function chips() {
    elChips.innerHTML = "";
    entries.forEach(function (e, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "wb-chip" + (edited(e) ? " edited" : "");
      b.setAttribute("aria-pressed", i === cur ? "true" : "false");
      b.textContent = e.no == null ? "?" : pad(e.no);
      b.title = (e.title || "(no headline yet)") + (e.date ? " · " + e.date : "");
      b.addEventListener("click", function () { leaveField(); cur = i; render(); window.scrollTo(0, 0); });
      elChips.appendChild(b);
    });
    var add = document.createElement("button");
    add.type = "button"; add.className = "wb-chip new"; add.textContent = "+ NEW";
    add.title = "start a record after the last one";
    add.addEventListener("click", newRecord);
    elChips.appendChild(add);
    var e = entries[cur];
    elNo.value = e.no == null ? "" : String(e.no);
    elDate.value = e.date || "";
    elDate.className = (!e.date || new RegExp(CFG.datePattern).test(e.date)) ? "" : "bad";
  }

  function newRecord() {
    leaveField();
    var max = 0;
    entries.forEach(function (e) { if (typeof e.no === "number" && e.no < 100 && e.no > max) max = e.no; });
    var e = { no: max + 1, date: dayFromEpoch(max + 1), title: "", sections: [{ label: "EXECUTIVE SUMMARY", body: [" "] }] };
    /* a new record goes after the last NUMBERED one rather than at the end:
       013 is the prototype and lives at the bottom of the array (B2). */
    var at = entries.length;
    for (var i = 0; i < entries.length; i++) if (typeof entries[i].no === "number" && entries[i].no > e.no) { at = i; break; }
    entries.splice(at, 0, e);
    cur = at; save(); render();
  }
  function dayFromEpoch(n) {
    var d = new Date(CFG.epoch + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + (n - 1));
    return d.toISOString().slice(0, 10);
  }

  elNo.addEventListener("change", function () {
    leaveField();
    var v = elNo.value.trim();
    entries[cur].no = v === "" ? null : Number(v);
    save(); render();
  });
  elDate.addEventListener("change", function () {
    leaveField();
    var v = elDate.value.trim();
    if (v === "") delete entries[cur].date; else entries[cur].date = v;
    save(); render();
  });

  /* ── THE `+` SLOTS ───────────────────────────────────────────────────────
     A field the entry does not carry does not RENDER, so there is nothing to
     click into — which is correct for the museum and useless for writing. These
     open the slot with a single space, which is what an empty paragraph is; if
     he leaves it empty, `tidy()` takes it away again on blur. */
  /* ANY CONTROL THAT CHANGES THE MODEL LEAVES THE FIELD FIRST, AND THAT IS A
     DEFECT FIXED RATHER THAN A TIDINESS. `render()` refuses to redraw while a
     field has focus — it has to, or the caret dies on every keystroke — so a
     button pressed while he is still in a paragraph would change the model and
     draw NOTHING, which reads as a broken button. Blurring commits the field
     down its normal path first, and the redraw then happens for real. */
  function leaveField() {
    var a = document.activeElement;
    if (a && a.getAttribute && a.getAttribute("data-wb-field") && a.blur) a.blur();
  }

  function open(field) {
    leaveField();
    var e = entries[cur];
    if (field === "section") {
      e.sections = e.sections || [];
      e.sections.push({ label: " ", body: [" "] });
      save();
      render(function () { focusPath("sect." + (e.sections.length - 1) + ".label", 0); });
      return;
    }
    if (isBlank(e[field])) e[field] = " ";
    save();
    render(function () { focusPath(field, 0); });
  }
  Array.prototype.forEach.call(document.querySelectorAll("[data-wb-open]"), function (b) {
    b.addEventListener("click", function () { open(b.getAttribute("data-wb-open")); });
  });

  function stat() {
    var n = 0, notes = 0;
    entries.forEach(function (e) { if (edited(e)) n++; notes += braceCount(e); });
    say(entries.length + " record(s) · " + n + " changed · " + notes + " note(s) to Ops"
      + (store ? "" : " · NOT BEING SAVED"));
  }
  function braceCount(e) {
    var n = 0;
    strings(e).forEach(function (s) { n += (s.match(/\{[^{}]*\}/g) || []).length; });
    return n;
  }
  function strings(e) {
    var out = [];
    ["title", "line", "lead", "tomb"].forEach(function (k) { if (!isBlank(e[k])) out.push(e[k]); });
    (e.sections || []).forEach(function (s) {
      if (!isBlank(s.label)) out.push(s.label);
      (s.body || []).forEach(function (p) { if (!isBlank(p)) out.push(p); });
    });
    return out;
  }

  /* ═══ THE PACKAGE — WHAT THE COPY BUTTON HANDS BACK ═══════════════════════
     MIKE: *"there must still be a COPY BUTTON that hands the whole thing back
     to Ops in one click."*

     IT IS THE WHOLE RECORD AND NOT THE CHANGES. A diff is a thing Ops has to
     reconstruct an entry from; the whole volume in plain text is a thing Ops can
     read and land. What the diff gives is a MARK — `*` on a record and on a
     field that differs from what `robots.js` ships — so nothing has to be
     guessed at about which entries need work.

     THE NOTES ARE COLLECTED AT THE FOOT AS WELL AS LEFT IN PLACE, because they
     are the part Ops has to ACT on and they would otherwise be nine screens
     apart from each other. Left in place too: a note four screens from the
     sentence it is about is the failure the retired red/blue scheme was trying
     to avoid, and it is still true here. */
  function two(n) { return (n < 10 ? "0" : "") + n; }
  function stamp() {
    var d = new Date();
    return d.getFullYear() + "-" + two(d.getMonth() + 1) + "-" + two(d.getDate())
      + " " + two(d.getHours()) + ":" + two(d.getMinutes());
  }

  function collect() {
    var L = [], allNotes = [];
    var changed = entries.filter(edited).length;
    var notes = entries.reduce(function (a, e) { return a + braceCount(e); }, 0);
    L.push("WEIRD.BABY — THE RECORD, as Mike edited it");
    L.push("captured " + stamp() + "  ·  " + entries.length + " record(s), "
         + changed + " changed since the last landing  ·  " + notes + " note(s) to Ops");
    L.push("Every string below is exactly as typed. A * marks a field that differs from "
         + "what src/data/artists/robots.js ships today.");
    L.push("{ curly braces } are notes to Ops, never story. They are listed again at the foot.");
    L.push("");

    entries.forEach(function (e) {
      var s = shippedOf(e.no);
      var mark = function (k, v) {
        var was = s ? s[k] : undefined;
        return (JSON.stringify(v == null ? null : v) !== JSON.stringify(was == null ? null : was)) ? " *" : "";
      };
      L.push("=== RECORD " + (e.no == null ? "(unnumbered)" : pad(e.no))
           + (e.date ? " · " + e.date : " · (no date)")
           + (s ? "" : "  [NEW — not in robots.js]")
           + (edited(e) ? "  [CHANGED]" : "  [unchanged]") + " ===");
      L.push("HEADLINE" + mark("title", e.title) + ": " + (isBlank(e.title) ? "(empty)" : e.title));
      var lim = CFG.budgets.line;
      L.push("INDEX LINE" + mark("line", e.line) + " (" + (isBlank(e.line) ? 0 : e.line.length)
           + " of " + lim.max + " characters): " + (isBlank(e.line) ? "(empty)" : e.line));
      L.push("LEAD" + mark("lead", e.lead) + ": " + (isBlank(e.lead) ? "(empty)" : e.lead));
      (e.sections || []).forEach(function (sec, i) {
        L.push("");
        L.push("  SECTION " + (i + 1) + " — " + (isBlank(sec.label) ? "(no heading)" : sec.label));
        /* THE HEADING IS SCANNED FOR NOTES TOO. The first cut walked the four
           top-level fields and every paragraph and MISSED THE SECTION LABELS —
           three notes short of the count in its own header, which is how it was
           found: the header counts every string, the list did not. */
        if (!isBlank(sec.label)) (sec.label.match(/{[^{}]*}/g) || []).forEach(function (b2) {
          allNotes.push({ no: e.no, where: "section " + (i + 1) + " heading", note: b2, line: sec.label });
        });
        (sec.body || []).forEach(function (p, j) {
          L.push("    " + (j + 1) + ". " + p);
          (p.match(/\{[^{}]*\}/g) || []).forEach(function (b) {
            allNotes.push({ no: e.no, where: "section " + (i + 1) + ", paragraph " + (j + 1), note: b, line: p });
          });
        });
      });
      ["title", "line", "lead", "tomb"].forEach(function (k) {
        if (isBlank(e[k])) return;
        (e[k].match(/\{[^{}]*\}/g) || []).forEach(function (b) {
          allNotes.push({ no: e.no, where: k, note: b, line: e[k] });
        });
      });
      L.push("");
      L.push("TOMBSTONE" + mark("tomb", e.tomb) + ": " + (isBlank(e.tomb) ? "(empty)" : e.tomb));
      L.push("");
    });

    L.push("=== NOTES TO OPS (" + allNotes.length + ") ===");
    if (!allNotes.length) L.push("(none — nothing in the volume is inside curly braces)");
    allNotes.forEach(function (n) {
      L.push("Record " + (n.no == null ? "?" : pad(n.no)) + " · " + n.where);
      L.push("  " + n.note);
      L.push("  in: " + n.line);
    });
    L.push("");
    L.push("The same thing as data: " + CFG.draftFile + " (press Save to the repo).");
    return L.join("\n");
  }

  /* ── COPYING, AND IT NEVER CLAIMS WHAT IT HAS NOT READ BACK ───────────────
     OPERATIONS §8: `writeText` rejects with *Document is not focused* and
     `execCommand('copy')` returns true when the command was merely ENABLED.
     Neither says the clipboard changed. This reads it back where the browser
     allows it, and where it does not it does not use the word "copied". */
  function verify(text, how) {
    if (!(navigator.clipboard && navigator.clipboard.readText)) {
      say("Put on the clipboard " + how + " — " + text.length + " characters. NOT VERIFIED: "
        + "this browser will not let the page read the clipboard back. The text is selected "
        + "below; press Ctrl+C to be sure.", "bad");
      return;
    }
    navigator.clipboard.readText().then(function (back) {
      if (back === text) say("Copied and VERIFIED — " + text.length + " characters are on the clipboard.", "good");
      else say("!! THE CLIPBOARD DID NOT TAKE IT. What is on the clipboard is not what this page "
             + "just produced. The text is selected below — press Ctrl+C — or use Save to the repo.", "bad");
    }, function () {
      say("Put on the clipboard " + how + " — " + text.length + " characters. NOT VERIFIED: the "
        + "browser refused to read it back. The text is selected below; press Ctrl+C to be sure.", "bad");
    });
  }
  function copyAll() {
    var text = collect();
    elOut.value = text;
    elPaste.className = "wb-pastewrap on";
    elOut.focus(); elOut.select();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { verify(text, "by the page"); },
                                               function () { legacy(text); });
    } else legacy(text);
  }
  function legacy(text) {
    elOut.focus(); elOut.select();
    try { document.execCommand("copy"); } catch { /* the return value proves nothing */ }
    verify(text, "by the fallback");
  }

  /* ── THE BRIDGE: HIS WRITING GOES TO A FILE IN THE REPO ───────────────────
     Same mechanism the worksheet earned in the U round — `showSaveFilePicker`,
     the handle remembered in IndexedDB so it is a dialog once and one click
     after — pointed at `record-draft.json`. A bridge that fails must fail into
     the old road, not into silence, so a refused picker downloads the same file
     and says where it went. */
  var DBN = "wb.dictation", DBS = "handles";
  function idb() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open(DBN, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore(DBS); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function handle(set2) {
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(DBS, set2 ? "readwrite" : "readonly");
        var os = tx.objectStore(DBS);
        var q = set2 ? os.put(set2, CFG.key) : os.get(CFG.key);
        q.onsuccess = function () { res(set2 ? set2 : q.result); };
        q.onerror = function () { rej(q.error); };
      });
    });
  }
  function payload() {
    return JSON.stringify({
      what: "Mike's working copy of the Record. Written by docs/dictation-20260807/record.html, "
          + "read by tools/dictation/emit-record-entries.mjs. Curly braces are notes to Ops. "
          + "Ops does not hand-edit this file.",
      key: CFG.key, saved: new Date().toISOString(), epoch: CFG.epoch,
      entries: entries.map(drawable)
    }, null, 1);
  }
  function download(text, why) {
    var b = new Blob([text], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = "record-draft.json";
    document.body.appendChild(a); a.click(); a.remove();
    say(why + " Downloaded record-draft.json instead — move it into "
      + "docs/dictation-20260807/ and tell Ops.", "bad");
  }
  function saveToRepo() {
    var text = payload();
    if (typeof window.showSaveFilePicker !== "function") { download(text, "This browser has no file picker."); return; }
    handle(null).then(function (h) {
      if (!h) return null;
      return h.queryPermission({ mode: "readwrite" }).then(function (perm) {
        if (perm === "granted") return h;
        return h.requestPermission({ mode: "readwrite" }).then(function (pp) { return pp === "granted" ? h : null; });
      });
    }).then(function (h) {
      if (h) return h;
      return window.showSaveFilePicker({
        suggestedName: "record-draft.json",
        types: [{ description: "The Record, as Mike edited it", accept: { "application/json": [".json"] } }]
      }).then(function (nh) { return handle(nh).then(function () { return nh; }); });
    }).then(function (h) {
      return h.createWritable().then(function (w) {
        return w.write(text).then(function () { return w.close(); });
      }).then(function () {
        say("Saved " + entries.length + " record(s) to " + h.name + " — " + text.length
          + " characters, at " + stamp() + ". Nothing to paste.", "good");
      });
    }).catch(function (e) {
      if (e && e.name === "AbortError") { say("Save cancelled. Nothing was written."); return; }
      download(text, "The file picker failed (" + (e && e.name) + ").");
    });
  }

  document.getElementById("wb-copy").addEventListener("click", copyAll);
  document.getElementById("wb-save").addEventListener("click", saveToRepo);
  document.getElementById("wb-pastex").addEventListener("click", function () { elPaste.className = "wb-pastewrap"; });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && elPaste.className.indexOf("on") >= 0) elPaste.className = "wb-pastewrap";
  });

  /* ── START ───────────────────────────────────────────────────────────────
     The migration runs BEFORE the first render, so what he sees on opening is
     already everything he has ever written for this Record, wherever it was. */
  migrate();
  render();

  /* the round-trip test drives these; they are the same functions the two
     buttons call, so a test cannot pass against a second implementation */
  window.WBRecordEditor = {
    collect: collect, model: function () { return entries; },
    open: open, go: function (i) { cur = i; render(); },
    fields: function () { return LIVE.map(function (f) { return f.path; }); },
  };
})();
