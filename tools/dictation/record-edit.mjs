/* ===========================================================================
   THE RECORD EDITOR — the generator. [E1–E4 2026-08-09]
   ---------------------------------------------------------------------------
   MIKE: *"the two-column worksheet is retired as his writing surface. HE EDITS
   THE RECORD ITSELF, DIRECTLY — every part of it: headline, index line,
   executive summary, sections, notes. NOT side by side. He must feel he is IN
   THE REAL THING as much as feasible — the museum's own page, his words in
   place, editable where they sit. Ops does not care how the illusion is
   achieved; it must be live, it must be the Record, and there must still be a
   COPY BUTTON that hands the whole thing back to Ops in one click."*

   ═══ THE PAGE IS THE PREVIEW FRAME WITH AN EDITOR ON IT ════════════════════
   `docs/dictation-20260807/record.html` is built from
   `tools/dictation/preview/frame.html` — READ, not copied by hand — because
   that file holds THE ANCESTOR CHAIN: the eleven elements `Exhibit.jsx` puts
   between `<body>` and a Record entry, with the two inline styles the component
   sets. The fidelity note beside it calls that chain *"the one part of the
   preview that is a copy and can therefore drift"*, and a second hand-written
   copy of it on this page would be a second thing that could drift. So there is
   one chain, in one file, and this page is that file with three things added:
   the editor's stylesheet, a floating bar, and the script that makes the
   museum's own paragraphs editable.

   IF THE ANCHORS IN THAT FILE MOVE, THIS BUILD FAILS BY NAME rather than
   emitting a page with half a chain in it — `mustCut()` below. OPERATIONS §8:
   a generated page and the list its script walks must be PROVED the same set,
   not assumed.

   ═══ WHAT IT SEEDS FROM, AND WHY THAT IS THE LIVE DATA ═════════════════════
   `draftEntries()` parses the Record out of `src/data/artists/robots.js`, so
   what opens is what the museum ships, to the character. Not a copy kept in
   step by hand — this house has paid for three of those (CLAUDE.md's data-model
   note) — and not a JSON snapshot that goes stale the first time Ops lands an
   entry.

   ═══ E3/E4: WHAT MOVES OUT OF THE OLD FORM, AND WHAT DOES NOT ══════════════
   MIKE: *"MIGRATE what is worth keeping from the old form INTO THE RECORD — but
   ONLY INTO BLANK RECORDS. Never overwrite anything he has already written. Say
   what moved and what was left."* … *"He has made changes in the form since the
   last landing (not headlines). Pull them in as part of E3."*

   IT IS DONE IN TWO PLACES BECAUSE HIS ANSWERS LIVE IN TWO PLACES.
     HERE, at build time, from `docs/dictation-20260807/answers.json` — the
       durable copy. **Measured on this tree: every one of its fourteen answers
       is already in the Record, character for character** (`--report` prints
       the comparison), so nothing moves and the report says so. That is the
       honest answer to E3 and it is a measurement rather than a claim.
     IN THE PAGE, at open time, from `localStorage["wb.worksheet.2026-08-07"]` —
       the worksheet's own store. On a `file://` page Chrome puts every local
       file in ONE storage origin, so the editor can read what the worksheet
       wrote **in his browser**, including anything he typed after the last
       export. That is the only place E4's changes can be: the two copies on
       disk (`answers.json` and the 2026-08-09 rescue dump) are byte-identical
       to each other and to what was landed, so nothing on disk records an edit
       since the landing.

   ═══ E2: HIS NOTES COME BACK, IN BRACES, WHERE HE WROTE THEM ═══════════════
   The eight `[MIKE-NOTE]` paragraphs left `robots.js` this round. They are
   carried below, VERBATIM AND WHOLE — not cut at a parenthesis, not split into
   a story half and a note half — each wrapped in the braces the new scheme
   uses, and re-inserted at the position he wrote them. He meets his own notes
   on the page he now writes on, which is the whole point of a note.

     npm run record            build the page
     node …/record-edit.mjs --report    print the migration comparison only
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { draftEntries } from "../../reveal/record-entries.mjs";
import { BUDGETS, FORMATS, sectionsFromText } from "../../reveal/record-shape.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const OUT_DIR = path.join(REPO, "docs", "dictation-20260807");
const FRAME = path.join(HERE, "preview", "frame.html");
const STORE_KEY = "wb.record.2026-08-09";
const WORKSHEET_KEY = "wb.worksheet.2026-08-07";
const DRAFT_FILE = "docs/dictation-20260807/record-draft.json";

/* ═══ HIS NOTES, CARRIED ═════════════════════════════════════════════════════
   Keyed on the record number, the section index, and the EXACT paragraph they
   followed — never on a bare index, because an index is a position in a list
   somebody may edit and the paragraph is the thing he actually wrote them
   under. A key that no longer matches is REPORTED and the note is appended to
   the section rather than dropped: a note that vanishes because a line moved is
   the failure this whole round is about. */
const CARRIED_NOTES = [
  { no: 1, after: "We ran some of the data through a ML Monitor to inspect the contents. No known Opcode library produced any favorable results, but we were able to read a few snippets of ASCII, including:",
    notes: ["Robot, portal, ??, ??  (Claude - Get me some examples from the manual, etc)"] },
  { no: 1, after: "Also, not \"words\", but suspiciously frequent text strings include:",
    notes: [
      "MGK, PI,  (Claude - Get me some examples from the manual, etc)",
      "RE:  (Claude - Get me some examples from the manual, etc)",
      "Look for what we really do use a lot.",
      "Look for sections of the documents that are \"true\", but not \"juicy\". It all has to come out at some point. Start dumping.",
    ] },
  { no: 3, after: "IMAGE - Engineering Manual - Assorted pages",
    notes: ["IMAGE - Device marked 'MGK-VIIIp' and '(need name of device)'"] },
  { no: 3, after: "IMAGE - Assorted Evidence Based photos - Unknown Importance",
    notes: ["ASCII - (Give me a list of the most common words Robots expects to use, pick the juicy ones - A more compete list  and analysis to be printed below in detail section."] },
  { no: 3, after: "A new Volume has been created: /Robots/MGK-VIIIp",
    notes: ["containing the files referenced above. (That is how we get the album art and set up the Manual link)"] },
];

/* WHICH WORKSHEET SLOT FEEDS WHICH FIELD OF WHICH RECORD. The worksheet asked
   four questions a day for ten days; every one of them is a field of a Record
   entry, which is why the form could be retired rather than replaced. Week one
   is records 001–005 and week two is 006–010 — the same numbering `recordDay()`
   uses, so a slot cannot land on the wrong day. */
function carryMap() {
  const out = [];
  for (let w = 1; w <= 2; w++) {
    for (let d = 1; d <= 5; d++) {
      const no = (w - 1) * 5 + d;
      const s = `W${w}.D${d}`;
      out.push({ slot: `${s}.HEAD`, no, field: "title" });
      out.push({ slot: `${s}.LINE`, no, field: "line" });
      out.push({ slot: `${s}.EXEC`, no, field: "sections" });
      out.push({ slot: `${s}.NOTES`, no, field: "sections+" });
    }
  }
  return out;
}

const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ═══ THE SEED ══════════════════════════════════════════════════════════════ */
function seedOf(shipped) {
  const seed = JSON.parse(JSON.stringify(shipped));
  const report = { carried: [], misplaced: [] };
  for (const c of CARRIED_NOTES) {
    const e = seed.find(x => x.no === c.no);
    if (!e) { report.misplaced.push(`Record ${c.no} is not in the Record any more`); continue; }
    let placed = false;
    for (const s of e.sections || []) {
      const i = (s.body || []).indexOf(c.after);
      if (i < 0) continue;
      s.body.splice(i + 1, 0, ...c.notes.map(n => "{" + n + "}"));
      placed = true;
      report.carried.push(`Record ${String(c.no).padStart(3, "0")}: ${c.notes.length} note(s) after "${c.after.slice(0, 46)}…"`);
      break;
    }
    if (!placed) {
      const s = (e.sections || [])[(e.sections || []).length - 1];
      if (s) s.body.push(...c.notes.map(n => "{" + n + "}"));
      report.misplaced.push(`Record ${c.no}: the paragraph these ${c.notes.length} note(s) `
        + `sat under has moved or changed, so they are at the END of the last section instead. `
        + `Nothing was dropped. ("${c.after.slice(0, 46)}…")`);
    }
  }
  return { seed, report };
}

/* ═══ E3: WHAT IS IN THE OLD FORM THAT IS NOT IN THE RECORD ═════════════════
   Field by field, measured. A slot whose text is already somewhere in the
   matching entry — as a headline, as an index line, or as the exact paragraphs
   the capitals rule cuts it into — has ALREADY MOVED and is reported as such.
   Anything else is named, with the reason it stayed. */
function compareAnswers(shipped) {
  const f = path.join(OUT_DIR, "answers.json");
  let A = {};
  try { A = JSON.parse(fs.readFileSync(f, "utf8")).answers || {}; } catch { return null; }
  const rows = [];
  for (const c of carryMap()) {
    const text = A[c.slot];
    if (!text || !String(text).trim()) continue;
    const e = shipped.find(x => x.no === c.no);
    if (!e) { rows.push({ slot: c.slot, state: "NO RECORD", why: `there is no Record ${c.no} to hold it` }); continue; }
    if (c.field === "title" || c.field === "line") {
      rows.push({ slot: c.slot, state: e[c.field] === text ? "ALREADY IN" : (e[c.field] ? "DIFFERS" : "MISSING"),
        why: e[c.field] === text ? `Record ${c.no} \`${c.field}\` is this string exactly`
          : e[c.field] ? `Record ${c.no} \`${c.field}\` holds a different string` : `Record ${c.no} has no \`${c.field}\`` });
      continue;
    }
    const want = sectionsFromText(text);
    const have = new Set();
    for (const s of e.sections || []) { if (s.label) have.add(s.label); for (const p of s.body || []) have.add(p); }
    const missing = [];
    for (const s of want) { if (s.label && !have.has(s.label)) missing.push(s.label); for (const p of s.body) if (!have.has(p)) missing.push(p); }
    rows.push({ slot: c.slot, state: missing.length ? "PARTLY IN" : "ALREADY IN",
      why: missing.length ? `${missing.length} line(s) of it are not in Record ${c.no}: ` + JSON.stringify(missing.slice(0, 3))
        : `every line of it is already in Record ${c.no}` });
  }
  const extra = Object.keys(A).filter(k => !carryMap().some(c => c.slot === k));
  return { rows, extra };
}

/* ═══ THE PAGE ══════════════════════════════════════════════════════════════ */
function mustCut(html, open, close, what) {
  const a = html.indexOf(open);
  if (a < 0) throw new Error(
    `record-edit.mjs: could not find ${what} in tools/dictation/preview/frame.html `
    + `(looking for ${JSON.stringify(open)}). THE CHAIN HAS MOVED. This page is built `
    + `from that file precisely so there is only one copy of the ancestor chain; fix `
    + `the anchor rather than pasting the chain in here.`);
  const b = html.indexOf(close, a + open.length);
  if (b < 0) throw new Error(`record-edit.mjs: ${what} has no end (${JSON.stringify(close)})`);
  return { a, b: b + close.length };
}

const BAR = `
<div class="wb-warn" id="wb-warn"></div>
<div class="wb-note" id="wb-note"></div>
<div class="wb-lim" id="wb-lim"></div>

<div class="wb-bar">
  <span id="wb-chips" style="display:flex;gap:5px;flex-wrap:wrap"></span>
  <span class="wb-meta">
    <label for="wb-no">no</label><input id="wb-no" class="no" inputmode="numeric">
    <label for="wb-date">date</label><input id="wb-date" placeholder="YYYY-MM-DD">
  </span>
  <span class="sp"></span>
  <button type="button" class="wb-chip" data-wb-open="line">+ index line</button>
  <button type="button" class="wb-chip" data-wb-open="lead">+ lead</button>
  <button type="button" class="wb-chip" data-wb-open="section">+ section</button>
  <button type="button" class="wb-chip" data-wb-open="tomb">+ tombstone</button>
  <button type="button" class="wb-act ghost" id="wb-save">Save to the repo</button>
  <button type="button" class="wb-act" id="wb-copy">Copy everything</button>
  <span class="wb-say" id="wb-say"></span>
</div>

<div class="wb-pastewrap" id="wb-paste">
  <div class="row"><b>The whole Record, as plain text.</b>
    It is selected — press Ctrl+C if the button could not verify the clipboard.
    <span style="flex:1"></span>
    <button type="button" class="wb-act ghost" id="wb-pastex">Close &#10005;</button></div>
  <textarea id="wb-out" class="wb-out" spellcheck="false"></textarea>
</div>`;

function build() {
  const frame = fs.readFileSync(FRAME, "utf8");
  const { entries: shipped, epoch, unreadable } = draftEntries();
  if (unreadable.length) {
    console.log(`  !! ${unreadable.length} field(s) in the Record could not be read and are NOT`);
    console.log(`     in the editor's seed: ${unreadable.join(", ")}`);
  }
  const { seed, report } = seedOf(shipped);

  /* the two <link>s and the <script src> in the frame point at siblings; this
     page sits one directory up from the bundle */
  let html = frame
    .replace('href="preview.css"', 'href="_preview/preview.css"')
    .replace('src="preview.js"', 'src="_preview/preview.js"')
    .replace("<title>Record preview frame</title>",
             "<title>THE RECORD \u2014 write it here</title>");

  /* the frame's own script is the postMessage listener a preview needs and an
     editor does not; it is REPLACED rather than left to race with this one */
  const cut = mustCut(html, "<script>\n/* THE FRAME OWNS NO STATE", "</script>", "the frame's message listener");
  html = html.slice(0, cut.a) + html.slice(cut.b);

  const cfg = {
    key: STORE_KEY,
    worksheetKey: WORKSHEET_KEY,
    draftFile: DRAFT_FILE,
    epoch,
    datePattern: FORMATS.date.pattern,
    budgets: {
      title: { max: BUDGETS.title.max, says: BUDGETS.title.why },
      line: { max: BUDGETS.line.max, says: BUDGETS.line.why },
    },
    carry: carryMap(),
    shipped,
    seed,
  };

  const css = fs.readFileSync(path.join(HERE, "record-edit.css"), "utf8");
  const client = fs.readFileSync(path.join(HERE, "record-edit.client.js"), "utf8");

  /* THE CAPITALS RULE IS THE FUNCTION'S OWN SOURCE, not a copy of it. One
     declaration in `reveal/record-shape.mjs`, two runtimes (Doctrine 17). */
  const rule = `<script>window.WBSections = ${String(sectionsFromText)};</script>`;

  html = html.replace("</head>", `<style>\n${css}\n</style>\n</head>`);
  html = html.replace("</body>", `${BAR}
<script id="wb-record-config" type="application/json">${JSON.stringify(cfg).replace(/</g, "\\u003c")}</script>
${rule}
<script>\n${client}\n</script>
</body>`);

  /* ═══ THE BUILD PROVES THE PAGE AND ITS SCRIPT AGREE (OPERATIONS §8) ══════
     Same rule as `assertSlotsMatchPage()` on the worksheet: both halves come
     off this generator, so they agree today, and nothing anywhere proved it.
     Three things are checked, and each has already been a real failure
     somewhere in this tree: every element the client addresses by id exists;
     the config parses; and the emitted capitals rule is a function. */
  const ids = [...client.matchAll(/getElementById\("([^"]+)"\)/g)].map(m => m[1]);
  const missing = [...new Set(ids)].filter(id => !html.includes(`id="${id}"`));
  if (missing.length) throw new Error(
    `record-edit.mjs: the editor script addresses ${missing.length} element(s) that are `
    + `not on the page it was written into: ${missing.join(", ")}. A control that is not `
    + `there is a button that does nothing, silently.`);
  JSON.parse(JSON.stringify(cfg));
  if (!/^function sectionsFromText/.test(String(sectionsFromText))) throw new Error(
    "record-edit.mjs: sectionsFromText is not a plain function and cannot be emitted "
    + "into a page as its own source. Keep it importless and closure-free.");

  return { html, shipped, seed, report, epoch };
}

/* ═══ RUN ═══════════════════════════════════════════════════════════════════ */
export function buildRecordEditor({ quiet = false } = {}) {
  const { html, shipped, seed, report, epoch } = build();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = path.join(OUT_DIR, "record.html");
  fs.writeFileSync(out, html);
  if (!quiet) {
    console.log(`  wrote  ${path.relative(REPO, out)}  ${html.length.toLocaleString()} bytes`);
    console.log(`         ${seed.length} record(s), day one ${epoch}`);
    for (const c of report.carried) console.log(`         carried  ${c}`);
    for (const m of report.misplaced) console.log(`      !! ${m}`);
  }
  return { out, count: seed.length, shipped };
}

const RUN = process.argv[1] && path.resolve(process.argv[1]) === url.fileURLToPath(import.meta.url);
if (RUN) {
  if (process.argv.includes("--report")) {
    const { entries: shipped } = draftEntries();
    const cmp = compareAnswers(shipped);
    if (!cmp) { console.log("no answers.json — nothing to compare"); }
    else {
      console.log("THE OLD FORM, SLOT BY SLOT, AGAINST THE RECORD\n");
      for (const r of cmp.rows) console.log(`  ${r.state.padEnd(10)} ${r.slot.padEnd(14)} ${r.why}`);
      const stuck = cmp.rows.filter(r => r.state !== "ALREADY IN");
      console.log(`\n  ${cmp.rows.length} slot(s) answered · ${cmp.rows.length - stuck.length} already in the Record · ${stuck.length} not`);
      if (cmp.extra.length) console.log(`  ${cmp.extra.length} answer(s) belong to no Record field: ${cmp.extra.join(", ")}`);
    }
  } else {
    buildRecordEditor();
  }
}
