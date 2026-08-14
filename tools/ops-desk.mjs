/* ===========================================================================
   THE OPS DESK — one page, every instrument. [S1 2026-08-07, THE NIGHT DESK]
   ---------------------------------------------------------------------------
   MIKE: "assemble every Ops instrument Mike uses — the worksheet, the
   twelve-week table, the artifact tracker, the egg tracker, the spec sheet, the
   contact sheet, the reference page, the open-actions register — behind ONE
   desktop shortcut that opens them so he can switch back and forth. Simplest
   honest mechanism. Name it plainly."

     node tools/ops-desk.mjs         →  docs/OPS_DESK.html + docs/OPEN_ACTIONS.html
     npm run desk                       the same

   ═══ FOUR THINGS A FUTURE SESSION MUST HOLD ════════════════════════════════

   (1) IT IS AN OPS INSTRUMENT AND MUST NEVER BECOME A ROUTE. Same §5 row as
       `tools/dictation/prep.mjs` and `tools/contact-sheet.mjs`: a page whose
       subject is the museum's own housekeeping is meta under Doctrine 11 and
       fails the visible-line test at any live address. It renders to `docs/`
       and never to `public/` — anything left in `public/` is one
       `npm run deploy` from being published, which is the trap `npm run
       lap:clean` exists to police.

   (2) IT REPORTS WHAT IS MISSING RATHER THAN LINKING PAST IT. Every card is
       `fs.statSync`'d at generation time. A file that is not on disk gets a red
       card that says so and carries NO LINK. **A dead link on a launcher is
       worse than an absent one**, because a launcher is the thing you trust
       once you have stopped checking — a 404 in a browser reads as "the tool is
       broken", and the truth is usually "a generator has not been run".

   (3) "CURRENT" IS NOT A PROPERTY OF A LAUNCHER. It is a property of the last
       time the generator BEHIND each page ran. So every card prints its own
       file's mtime and the exact `npm run …` that rebuilds it, and this file
       claims nothing about freshness that it did not read off the disk.

   (4) THE MARKDOWN RENDERER IS DELIBERATELY SMALL AND SAYS SO. `docs/
       OPEN_ACTIONS.md` is the one document it renders and that document is its
       whole specification: headings, tables, lists, blockquotes, rules, links,
       anchors, `code`, **bold**, *italic*, and `~~strike~~`. It is NOT a
       Markdown implementation and must not grow into one — the moment it needs
       a feature the register does not use, the register is being written for
       the renderer instead of for Mike.

   ═══ WHY THE REGISTER IS RENDERED AND THE OTHER SEVEN ARE LINKED ═══════════
   Seven of the eight instruments are already HTML written by their own
   generators, and re-rendering them here would be a second copy of each — the
   exact shape §5 forbids. The register is the one that is markdown, and a
   browser handed a `.md` file either downloads it or draws 760 lines of pipe
   characters. So it gets a rendering, and the rendering is REGENERATED from the
   markdown on every run rather than maintained: `OPEN_ACTIONS.md` stays the
   source, and the day this file stops running the HTML goes stale visibly (its
   own card prints its age) rather than silently.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const DOCS = path.join(REPO, "docs");

/* ── THE EIGHT ─────────────────────────────────────────────────────────────
   `rebuild` is the command that regenerates that page. It is printed on the
   card so a stale instrument carries its own fix. `null` means the file is
   authored rather than generated. */
const INSTRUMENTS = [
  /* [E1 2026-08-09] THE WORKSHEET'S CARD IS THE RECORD'S CARD NOW. Mike retired
     the two-column page as his writing surface — he edits the Record itself —
     and Doctrine 24 says a thing he has ruled gone leaves the places he meets
     it, the desk included. The file it pointed at is deleted by
     `tools/dictation/prep.mjs`, and this desk refuses to draw a link to a file
     that is not on disk, so leaving the card would have printed a red one. */
  /* [2026-08-11] MOTHBALLED, AND THE CARD LOSES ITS LEAD RATHER THAN ITS ROW.
     Mike ruled the editor mothballed for week one — he writes the Record in a
     spreadsheet and pastes it in. Doctrine 24 does NOT apply: he did not rule
     it gone, he ruled it not-the-road-for-now, and a mothballed instrument that
     vanishes from the desk is one nobody can find when it is wanted again.
     WHAT CHANGES IS WHAT THE CARD CLAIMS. `lead: true` put it at the top as the
     thing to open first; a page that is not the recommended path must not be
     the first thing on the launcher. The `what` says the state, so the desk and
     the page itself say the same thing — the page carries the same note in its
     own banner (tools/dictation/record-edit.mjs). */
  /* [J4 2026-08-12] THE LEAD CARD, AND IT IS THE LEAD FOR ONE WEEK ONLY.
     Mike writes the whole first week of Records on SATURDAY and assigns
     artifacts to each day while he does it, so for that sitting this is the
     page to open first and the Record editor is not (it is mothballed — see
     below). WHEN WEEK ONE IS WRITTEN THIS LOSES `lead`, exactly as the Record
     card did: a page that is not the recommended path must not be the first
     thing on the launcher.
     IT IS ON THE DESK IN THE SAME ROUND IT WAS BUILT, deliberately. Job 1
     found ~62 stranded one-shot runners in `tools/` and one generated view
     (`CONTACT_SHEET.html`) whose command is named in no governing document —
     a tool nobody is told to run is how a tool strands, and the cheapest
     moment to prevent that is before it has ever been forgotten. */
  /* ═══ [G 2026-08-13] PRUNED, AND THE PRUNE IS OF WORDS AND FURNITURE RATHER
         THAN OF INSTRUMENTS ════════════════════════════════════════════════
     MIKE: "Prune it. Add the Excel workbook to it."

     WHAT WAS CUT: the card copy, hard. The lead card's `what` ran 66 words and
     explained how to click a day, what the magnifier does and how the sort
     works — Doctrine 25 exactly, a briefing above the work, on a page whose
     whole job is to get him INTO the work. A card's job is to let him pick the
     right door; everything past that belongs on the page behind it. The masthead
     and the footer went the same way (see the body at the foot of this file).

     WHAT WAS NOT CUT, AND WHY IT IS HIS CALL RATHER THAN OPS': any instrument.
     Doctrine 24 says a thing he rules gone leaves his view for good, so removing
     a card is one-way and must be his word, not Ops' reading of "prune it". Two
     are the obvious candidates and neither is Ops' to take:
       · The Record editor — its own card says NOT THE ROAD, and the 2026-08-11
         note above argues the opposite of deleting it: "a mothballed instrument
         that vanishes from the desk is one nobody can find when it is wanted
         again." That was a decision, made once, in writing.
       · The spec sheet and the egg tracker — neither is week-one work.
     Raised in the round log; one word each removes any of them. */
  { name: "Week one — the artifacts",
    file: "dictation-20260807/assign.html",
    what: "The pictures and the story events, against the five days. Click a day, then click things.",
    rebuild: "npm run assign",
    lead: true },
  /* [G 2026-08-13] MIKE: "Add the Excel workbook to it." It is the FIRST link
     in Saturday's chain and it was the only part of that chain with no door on
     this desk — he had to know a path to open the thing he writes in.
     IT LIVES OUTSIDE `docs/`, which is why `abs` exists. The desk's standing
     rule is that it never draws a link to a file that is not on disk, so an
     outside file gets stat'd at its own absolute path and linked as `file://`;
     a card is red and unlinked if the workbook has been moved or renamed. */
  { name: "The workbook — where you write",
    abs: "C:/AI/_night-20260811/RECORD_days-2-to-6.xlsx",
    what: "Days 2 to 6, one tab each. Type in the white cells. Braces are notes to Ops.",
    rebuild: "read it back with npm run record:workbook -- <path>",
    lead: true },
  { name: "The Record — MOTHBALLED",
    file: "dictation-20260807/record.html",
    what: "Not the road for week one. Still works; the writing happens in the workbook.",
    rebuild: "npm run dictation" },
  { name: "The twelve-week table",
    file: "dictation-20260807/arc.html",
    what: "The whole arc, week by week, and whose sentence each line is.",
    rebuild: "npm run dictation" },
  { name: "The light table",
    file: "dictation-20260807/artifacts.html",
    what: "Every file the museum still has, as a thumbnail. Click one to open it full size.",
    rebuild: "npm run dictation" },
  { name: "The egg tracker",
    file: "dictation-20260807/eggs.html",
    what: "Every egg — what it is, whether it is built, whether anybody can trip it.",
    rebuild: "npm run dictation" },
  { name: "The spec sheet",
    file: "dictation-20260807/specsheet.html",
    what: "The period specification, with the contradicted rows printed both ways.",
    rebuild: "npm run dictation" },
  { name: "The reference page",
    file: "dictation-20260807/reference.html",
    what: "What explains the machine. Read it when you want it, not to get started.",
    rebuild: "npm run dictation" },
  { name: "The contact sheet",
    file: "CONTACT_SHEET.html",
    what: "Every image in both repos, with a ✗ on each tile for marking a cull.",
    rebuild: "npm run contact-sheet" },
  { name: "The open-actions register",
    file: "OPEN_ACTIONS.html",
    what: "Everything open, one place. THE SHORT LIST at the top is what is waiting on you.",
    rebuild: "npm run desk",
    source: "OPEN_ACTIONS.md" },
];

/* ── the escaper. Same one the dictation shell uses; copied rather than
      imported because that shell carries a stylesheet and a page frame this
      file does not want, and a four-line function is not a second copy of
      anything worth sharing. ── */
const esc = s => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ═══ THE SMALL MARKDOWN RENDERER ═══════════════════════════════════════════
   See (4) in the header. Inline first, then blocks. Everything is escaped
   BEFORE any markup is introduced, so a `<` in the register can never become a
   tag — the register is full of `<a id="...">` anchors and code spans holding
   angle brackets, and an escaper applied afterwards would eat the markup this
   function just wrote. */
/* THE CODE-SPAN PLACEHOLDER IS A PRIVATE-USE PAIR AND NOT A DIGIT IN SPACES.
   The first cut parked each span as a digit between two spaces and restored
   them with a / (digits) / pattern -- which also matches a real number
   standing alone in the prose, and this register is full of them ("on 4
   rows", "at 16 pictures"). U+E000 and U+E001 cannot occur in the source and
   cannot be produced by the escaper, so the restore is exact.
   THEY ARE NOT NUL BYTES, AND THIS FILE IS WHY THAT IS WRITTEN DOWN: its
   first write put two literal NULs here (Section 8's own hazard row -- a NUL
   makes every grep report "binary file matches" and the Read tool draws it
   as a space, so the line looks correct in every reader). Built as escapes. */
const CO = "\uE000", CC = "\uE001";

function inline(s) {
  let t = esc(s);
  /* code first: nothing inside a code span is interpreted */
  const spans = [];
  t = t.replace(/`([^`]+)`/g, (_, c) => CO + (spans.push("<code>" + c + "</code>") - 1) + CC);
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, href) =>
    "<a href=\"" + esc(href) + "\">" + txt + "</a>");
  t = t.replace(/~~([\s\S]+?)~~/g, "<s>$1</s>");
  /* BOLD IS LAZY AND ALLOWS AN ASTERISK INSIDE IT, AND THAT IS A FIX RATHER
     THAN A STYLE. The register writes bold spans that WRAP an italic --
     **Built ... on Mike's instruction: *"the round's spine"* ... he looks.** --
     and a greedy-free bold pattern cannot cross the inner asterisks, so eight
     of them shipped as literal ** on the page. Bold runs first and lazily;
     italic runs after and can no longer meet a ** because there are none left. */
  t = t.replace(/\*\*([\s\S]+?)\*\*/g, "<b>$1</b>");
  t = t.replace(/\*([^*]+?)\*/g, "<i>$1</i>");
  /* the register writes its own anchors as raw HTML; they were escaped above
     and are put back, because they are what the SHORT LIST's links point at */
  t = t.replace(/&lt;a id=&quot;([\w.-]+)&quot;&gt;&lt;\/a&gt;/g, "<a id=\"$1\"></a>");
  /* The register also writes <br> and named entities (&mdash;, &rsquo;, &nbsp;)
     directly into its cells. The escaper above turned those into &amp;lt;br&amp;gt;
     and &amp;amp;mdash;, which print as themselves. Both are put back, and the
     list is CLOSED on purpose: an anchor, a line break and a named entity. Any
     other raw HTML in the register stays escaped and is meant to. */
  t = t.replace(/&lt;br\s*\/?&gt;/g, "<br>");
  t = t.replace(/&amp;(#\d+|[a-zA-Z]+);/g, "&$1;");
  t = t.replace(new RegExp(CO + "(\\d+)" + CC, "g"), (_, i) => spans[Number(i)]);
  return t;
}

function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0, para = [];

  const flush = () => {
    if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; }
  };

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.replace(/\s+$/, "");

    if (!line.trim()) { flush(); i++; continue; }

    /* a rule */
    if (/^-{3,}$/.test(line.trim())) { flush(); out.push("<hr>"); i++; continue; }

    /* a heading. The id is the slug the register's own links use. */
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      flush();
      const lvl = h[1].length;
      const id = h[2].toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
      out.push(`<h${lvl} id="${esc(id)}">${inline(h[2])}</h${lvl}>`);
      i++; continue;
    }

    /* a table: a pipe row followed by a separator row */
    if (line.trim().startsWith("|") && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] || "")) {
      flush();
      const cells = r => r.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());
      const head = cells(line);
      i += 2;
      const body = [];
      /* A BLANK LINE BETWEEN TWO PIPE ROWS DOES NOT END THE TABLE. The register
         has one -- THE SHORT LIST breaks between row 57 and row 58 -- and the
         first cut stopped there, dropping nine rows out of the table and
         printing them as paragraphs full of pipe characters. Blanks are
         swallowed only when a pipe row follows; anything else ends the table. */
      while (i < lines.length) {
        if (lines[i].trim().startsWith("|")) { body.push(cells(lines[i])); i++; continue; }
        if (!lines[i].trim()) {
          let j = i;
          while (j < lines.length && !lines[j].trim()) j++;
          if (j < lines.length && lines[j].trim().startsWith("|")) { i = j; continue; }
        }
        break;
      }
      out.push(
        `<div class="tw"><table><thead><tr>${head.map(c => `<th>${inline(c)}</th>`).join("")}</tr></thead>` +
        `<tbody>${body.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }

    /* a blockquote — the register uses them for standing doctrine, so they are
       drawn as a block rather than as an indent */
    if (/^>\s?/.test(line)) {
      flush();
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
      out.push(`<blockquote>${renderMarkdown(buf.join("\n"))}</blockquote>`);
      continue;
    }

    /* a list. Continuation lines are indented and join the item they follow. */
    const li = /^(\s*)([-*+]|\d+\.)\s+(.*)$/.exec(line);
    if (li) {
      flush();
      const ordered = /\d/.test(li[2]);
      const items = [];
      while (i < lines.length) {
        const m = /^(\s*)([-*+]|\d+\.)\s+(.*)$/.exec(lines[i].replace(/\s+$/, ""));
        if (m) { items.push(m[3]); i++; continue; }
        if (/^\s+\S/.test(lines[i]) && items.length) { items[items.length - 1] += " " + lines[i].trim(); i++; continue; }
        break;
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.map(t => `<li>${inline(t)}</li>`).join("")}</${tag}>`);
      continue;
    }

    para.push(line.trim());
    i++;
  }
  flush();
  return out.join("\n");
}

/* ── age, said in words a person reads rather than in a timestamp ────────── */
function age(ms) {
  const mins = Math.round((Date.now() - ms) / 60000);
  if (mins < 2) return "just now";
  if (mins < 90) return `${mins} minutes ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 36) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

const stamp = d => d.toISOString().slice(0, 16).replace("T", " ") + " UTC";

/* ═══ THE STYLESHEET ════════════════════════════════════════════════════════
   Its own, not the dictation shell's, and the reason is that the shell's page
   frame is a DOCUMENT (a max-width column of running prose) and this is a
   BOARD. Both are dark, both are theme-fixed, and neither is the museum.
   NOTE for whoever edits it: `font: <size>/<height> inherit` is INVALID — the
   font shorthand requires a family and `inherit` is legal only as the whole
   value — and Chrome drops the entire declaration. That bug shipped on the
   worksheet (W1–W8) and every field came up in the UA monospace. Longhand
   only, here and anywhere else. */
const CSS = `
:root{color-scheme:dark;--bg:#16151a;--fg:#e8e6e1;--dim:#9b978e;--dim2:#7d7970;
 --gold:#d9b66a;--line:#302d28;--line2:#262429;--panel:#1d1c21;--red:#c0392b;
 --redfg:#f0c9c4;--blu:#8fa8c4;--grn:#7fa86a}
*{box-sizing:border-box}
html{scrollbar-gutter:stable}
body{margin:0;padding:26px 22px 90px;background:var(--bg);color:var(--fg);
 font-family:-apple-system,"Segoe UI",system-ui,sans-serif;font-size:15px;line-height:1.55}
.wrap{max-width:1100px;margin:0 auto}
a{color:var(--blu)}
h1{font-size:22px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;margin:0 0 4px;color:var(--gold)}
.sub{color:var(--dim);font-size:13px;margin:0 0 4px}
.note{border:1px solid #3a3630;background:var(--panel);padding:14px 16px;margin:20px 0 26px;border-radius:3px}
.note p{margin:0 0 9px;font-size:13.5px}.note p:last-child{margin:0}
.note b{color:var(--gold)}
h2{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);font-weight:600;
 margin:32px 0 12px;border-bottom:1px solid var(--line);padding-bottom:6px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:13px}
.card{border:1px solid var(--line);background:var(--panel);border-radius:3px;padding:15px 16px;
 display:flex;flex-direction:column}
.card.lead{border-color:#7a5a20}
.card.gone{border-color:#6a3a30}
.card h3{margin:0 0 6px;font-size:16px;line-height:1.25}
.card h3 a{text-decoration:none;color:var(--gold)}
.card h3 a:hover{text-decoration:underline}
.card.gone h3{color:var(--redfg)}
.card p{margin:0 0 10px;font-size:13.5px;color:var(--fg)}
.card .meta{margin:auto 0 0;font-size:11.5px;color:var(--dim2);line-height:1.6}
.card .meta b{color:var(--dim);font-weight:600}
code{font-family:ui-monospace,Consolas,monospace;font-size:.88em;color:#b9c9dc;word-break:break-word}
.tag{display:inline-block;font-size:10px;letter-spacing:.09em;text-transform:uppercase;
 border:1px solid var(--line);color:var(--dim);padding:1px 6px;border-radius:2px;white-space:nowrap}
.tag.g{border-color:#7a5a20;color:var(--gold)}
.tag.n{border-color:#6a3a30;color:var(--redfg)}
.foot{margin-top:34px;padding-top:14px;border-top:1px solid var(--line);font-size:12px;color:var(--dim2)}
.foot code{color:var(--dim)}
@media (max-width:700px){body{padding:20px 14px 70px}.cards{grid-template-columns:1fr}}
`;

/* the register's rendering shares the board's palette and adds document rules */
const DOC_CSS = CSS + `
.wrap{max-width:900px}
h1{font-size:20px;margin-bottom:14px}
h2{font-size:14px;letter-spacing:.1em;color:var(--gold);text-transform:none;margin:34px 0 10px}
h3{font-size:13px;letter-spacing:.06em;color:var(--fg);margin:24px 0 8px}
p{margin:0 0 12px;max-width:68ch}
li{margin:0 0 7px;font-size:14px}
ul,ol{margin:0 0 14px;padding-left:22px;max-width:68ch}
blockquote{border-left:3px solid var(--gold);margin:0 0 16px;padding:2px 0 2px 14px;color:var(--dim)}
blockquote p{margin:0 0 8px}
blockquote h2,blockquote h3{margin-top:6px}
hr{border:0;border-top:1px solid var(--line);margin:26px 0}
.tw{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 0 18px}
.tw table{min-width:640px;border-collapse:collapse;width:100%;font-size:13px}
th{text-align:left;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim2);
 font-weight:600;border-bottom:1px solid var(--line);padding:7px 10px 7px 0;vertical-align:bottom}
td{border-bottom:1px solid var(--line2);padding:9px 10px 9px 0;vertical-align:top}
s{color:var(--dim2)}
`;

function page({ title, css, body, favi }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${favi}</text></svg>">
<style>${css}</style></head><body>
${body}
</body></html>
`;
}

/* ═══ RUN ═══════════════════════════════════════════════════════════════════ */

/* the register's rendering FIRST, so its own card can stat the file this run
   has just written rather than the one the last run left */
const oaMd = path.join(DOCS, "OPEN_ACTIONS.md");
let oaWrote = false;
if (fs.existsSync(oaMd)) {
  const md = fs.readFileSync(oaMd, "utf8");
  const src = stamp(fs.statSync(oaMd).mtime);
  const body = `<div class="wrap">
<p class="sub"><a href="OPS_DESK.html">&larr; the Ops desk</a></p>
${renderMarkdown(md)}
<p class="foot">Rendered by <code>tools/ops-desk.mjs</code> from <code>docs/OPEN_ACTIONS.md</code>,
which is the source and was last written <b>${esc(src)}</b>. Rebuild with <code>npm run desk</code>.
Ops instrument &mdash; not part of the museum, and never at a live address.</p>
</div>`;
  fs.writeFileSync(path.join(DOCS, "OPEN_ACTIONS.html"),
    page({ title: "OPEN ACTIONS — the standing register", css: DOC_CSS, body, favi: "📋" }));
  oaWrote = true;
}

/* [G 2026-08-13] AN INSTRUMENT IS EITHER `file` (under docs/) OR `abs` (a real
   path anywhere on the machine — the workbook). Both are stat'd, because the
   desk's one rule is that it never links to a file that is not there. */
const absOf = it => (it.abs ? path.normalize(it.abs) : path.join(DOCS, it.file));
const hrefOf = it => (it.abs
  ? "file:///" + it.abs.replace(/\\/g, "/").replace(/^\/+/, "")
  : it.file);
const labelOf = it => (it.abs ? it.abs : `docs/${it.file}`);

const cards = INSTRUMENTS.map(it => {
  const abs = absOf(it);
  const there = fs.existsSync(abs);
  const cls = "card" + (it.lead ? " lead" : "") + (there ? "" : " gone");
  const head = there
    ? `<h3><a href="${esc(hrefOf(it))}">${esc(it.name)}</a></h3>`
    : `<h3>${esc(it.name)}</h3>`;
  const meta = there
    ? (() => {
        const st = fs.statSync(abs);
        return `<div class="meta"><b>${esc(age(st.mtime.getTime()))}</b> &middot; ${esc(stamp(st.mtime))}<br>`
          + `<code>${esc(labelOf(it))}</code><br>`
          + (it.rebuild ? `refresh with <code>${esc(it.rebuild)}</code>` : "authored by hand")
          + (it.source ? ` &middot; source <code>docs/${esc(it.source)}</code>` : "")
          + `</div>`;
      })()
    : `<div class="meta"><span class="tag n">not on disk</span><br><code>${esc(labelOf(it))}</code><br>`
      + (it.rebuild ? `run <code>${esc(it.rebuild)}</code> to build it` : "this file is authored and is missing")
      + `</div>`;
  return `<div class="${cls}">${head}<p>${esc(it.what)}</p>${meta}</div>`;
}).join("\n");

const missing = INSTRUMENTS.filter(it => !fs.existsSync(absOf(it)));

/* [G 2026-08-13] THE MASTHEAD AND THE FOOTER ARE PRUNED — Doctrine 25, on the
   launcher itself. What was above the first card:
     · "Every instrument, one page. Generated <date> by tools/ops-desk.mjs." —
       the second half is the watch and not the time (Doctrine 11), and every
       card already prints its own age, which is the point that note itself
       makes ("current is a property of the generator behind each page, never of
       the launcher").
     · a rebuild-everything command line.
     · <h2>The instruments</h2>, on a page titled "the Ops desk", above a grid
       of instruments.
   What was in the footer: how to re-create the desktop shortcut with a
   PowerShell one-liner, and a sentence about what this generator writes. Both
   are about the making of the desk.
   THE ONE LINE KEPT IS THE ONE THAT IS FOR HIM: how to refresh the page he is
   looking at. */
const body = `<div class="wrap">
<h1>Weird.Baby &mdash; the Ops desk</h1>
<div class="cards">
${cards}
</div>

<p class="foot">Refresh this page: <code>npm run desk</code></p>
</div>`;

fs.writeFileSync(path.join(DOCS, "OPS_DESK.html"),
  page({ title: "Weird.Baby — the Ops desk", css: CSS, body, favi: "🗂" }));

console.log(`wrote docs/OPS_DESK.html — ${INSTRUMENTS.length} instruments, ${INSTRUMENTS.length - missing.length} on disk`);
if (oaWrote) console.log("wrote docs/OPEN_ACTIONS.html — rendered from docs/OPEN_ACTIONS.md");
if (missing.length) {
  console.log(`\n${missing.length} instrument(s) NOT on disk — the desk says so on the card rather than linking past it:`);
  for (const m of missing) console.log(`  ${m.name}  docs/${m.file}${m.rebuild ? `  →  ${m.rebuild}` : ""}`);
}
