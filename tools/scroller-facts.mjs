#!/usr/bin/env node
/* ═══ scroller-facts.mjs — EVERY FACT THE POP-UP SCROLLER CAN SERVE ══════════
   [2026-08-16] Built because a whole visitor-facing surface had never been
   audited. Three sweeps in August cleared quote decks and pull-quote cards and
   reported /wal clean; none of them looked at the FactScroller, and two verbatim
   press quotes — 33 words and 21 words, from one publication — were live on it
   the whole time.

   WHY A LIST AND NOT ONLY A GATE. A gate answers "is anything broken"; it
   cannot answer "what is on this wall". Mike reviews the wall. So the default
   run WRITES THE LIST (`docs/SCROLLER_FACTS.html`, a card on the Ops desk) and
   `--gate` is the same measurement, silent, exiting non-zero.

   THE TWO LIMITS, WHICH ARE NOT TASTE (Mike, 2026-08-17, re-stated 08-16):
     · every quote UNDER FIFTEEN WORDS
     · ONE quote per source, counted across the WHOLE ARTIST PAGE — not per
       surface. A scroller quote and a pull-quote card from one publication are
       two quotes from one source.

   WHAT COUNTS AS A QUOTE, AND WHY THE TEST IS TWO-PART. The wing's own facts
   mark a quote with quotation marks. The Hunter Root vault does not: 92 of its
   96 facts carry a `speaker:` tag and an em-dash attribution line, and the text
   above that line is the speaker's own words reprinted whole. Testing only for
   quote marks classifies sixty verbatim quotes as paraphrase — which is exactly
   the classification failure the 08-17 log records ("a classification that loses
   a member cannot enforce a limit"). So:
       quote  =  a quoted span in the text
              OR (a `speaker:` tag naming a person AND an attribution line)
   A fact whose source cannot be resolved to a publication is reported as
   UNRESOLVED and counted against the per-source limit under its own raw
   breadcrumb — never dropped.

   USAGE
     node tools/scroller-facts.mjs            write docs/SCROLLER_FACTS.html
     node tools/scroller-facts.mjs --gate     measure only; exit 1 on a breach
     node tools/scroller-facts.mjs --print    the same table, on stdout
   ─────────────────────────────────────────────────────────────────────────── */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { worthAListenFacts } from "../src/data/artists/worth-a-listen-facts.js";
import { worthAListenExhibit } from "../src/data/artists/worth-a-listen.js";
import hrVault from "../src/data/exhibits/hunter_root.facts.json" with { type: "json" };

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..");
const OUT = resolve(REPO, "docs/SCROLLER_FACTS.html");

const WORD_LIMIT = 15;   // "every quote under FIFTEEN words" — under, not at

/* ── THE SURFACES. Every pool a FactScroller can be handed, and nothing else.
      `Exhibit.jsx` renders `<FactScroller facts={artist.facts}>`, so the audit
      is exactly the set of non-empty `facts:` declarations in the museum:
        /wal   worthAListenFacts   (which re-points the whole HR vault into it)
        /hr    hunter_root.facts.json
      /wb, /robots and /foundation declare `facts: []` and draw no scroller.
      `src/routes/hr/hr_facts.js` is the retired seed set and is off the live
      path — its own file header says so. If a wing gains facts, add it here;
      a pool nobody lists is a pool nobody audits, which is how this surface
      went four months without one. ── */
const SURFACES = [
  { route: "/wal", pool: worthAListenFacts },
  { route: "/hr",  pool: hrVault.facts || [] },
];

/* ── artist labels. The pool tags an artist as `album:<slug>` because in these
      wings an "album" IS a person; `wal` is the wing tier, which answers from
      anywhere in the room. ── */
const ARTIST = {
  carsie_blanton: "Carsie Blanton",
  jesse_welles: "Jesse Welles",
  mikey_mike: "Mikey Mike",
  hunter_root: "Hunter Root",
  wal: "— the wing itself —",
};

/* ── THE PUBLICATIONS, NAMED. Written out rather than parsed off the breadcrumb
      because the breadcrumbs are not one shape: "— Speaker, Publication, Year",
      "— Publication, Year", "— Publication, read 2026" and "— Speaker,
      Publication" all occur. Anything that matches none of these is UNRESOLVED
      and says so on the page. ── */
/* ONE NAME PER PUBLICATION, AND THE SLUG IS PART OF THE ROW. A first cut kept
   the slug list separate and fell back to `slug.replace(/_/g," ")`, which put
   `shore fire media` and `Shore Fire Media` in two buckets — the same outlet
   counted twice as two sources, which is a limit that cannot fire. */
const PUBLICATIONS = [
  ["Blue Harvest Beat", "blue_harvest_beat"],
  ["Chasing Destino", "chasing_destino"],
  ["LancasterOnline", "lancaster_online"],
  ["Whiskey Riff", "whiskey_riff"],
  ["MuzicNotez", "muzicnotez"],
  ["Shore Fire Media", "shore_fire_media"],
  ["Americana Highways", "americana_highways"],
  ["The Country Note", "the_country_note"],
  ["Isthmus", "isthmus"],
  ["NEPAudio", "nepaudio"],
  ["PA Musician", "pa_musician"],
  ["LNP", null], ["Wikipedia", null], ["Vulture", null],
  ["Faded Glamour", null], ["Apple Music", null], ["Deezer", null],
  ["Titusville", null], ["Fresh Air", null], ["NPR", null],
  ["Folk Alliance International", null], ["Bandcamp", null], ["Canon", null],
];
const PUBLICATION_SLUGS = new Set(PUBLICATIONS.map(p => p[1]).filter(Boolean));
const SLUG_TO_NAME = new Map(PUBLICATIONS.filter(p => p[1]).map(p => [p[1], p[0]]));

const ATTR_LINE = /^\s*[—–-]\s+/;
/* DOUBLE QUOTES ONLY, AND THAT IS A MEASUREMENT RATHER THAN A PREFERENCE. A
   single-quote branch was written first and matched the APOSTROPHES inside
   "wouldn't … didn't", returning the words between two contractions as the
   quoted material — six facts came back with a mangled span and a wrong count.
   Nothing in either pool quotes with single marks; ’94 opens with one and is a
   title. A rule that cannot tell a quote from an apostrophe is worse than no
   rule, because it reports a number. */
const QUOTED_SPAN = /[“"„]([^“”"„]{2,})[”"]/;

/* the `speaker:` namespace holds both people and outlets; an outlet in that
   slot means the fact is the HOUSE's sentence sourced to that outlet — a
   derived line — while a person in it means the words above the credit are
   that person's own, reprinted. */
const SPEAKER_IS_A_PERSON = id => !!id && !PUBLICATION_SLUGS.has(id);

/* A STANDALONE EM-DASH IS NOT A WORD, AND THE DIFFERENCE DECIDES A LIMIT.
   The first cut split on whitespace and counted every token, so
   `… Mark Twain line — the more he learns about people.` came back as FIFTEEN
   and failed a limit it clears at fourteen. A token with no letter and no digit
   is punctuation. */
const words = s => String(s).trim().split(/\s+/).filter(t => /[\p{L}\p{N}]/u.test(t)).length;

/* ── A TITLE IS NOT A QUOTE, AND THE TEST ERRS TOWARDS CALLING IT ONE ───────
   66 quoted spans in the wing's own pool are SONG AND VIDEO TITLES — “Be
   Good”, “PEACE AND FREEDOM”, “Take Me Home, Country Roads”. Counting them as
   quoted material buries the fourteen real ones.
   THE RULE IS CASE, NOT LENGTH AND NOT PRONOUNS. Titles here are Title Case or
   ALL CAPS; the real quotes are sentences. Pronoun and length tests were both
   tried and both fail on the data ("Everyone Who Hated Me Is Dead", "I Ain't
   Going To Hell"). Words under four letters are exempt so "of", "the", "a" and
   "Me" do not disqualify a title.
   IT IS DELIBERATELY OVER-CAUTIOUS: a lower-case title ("my depression f***s
   like a champ", "Rick Rubin told me something I'll never forget") comes back
   as a QUOTE and is listed. A misfiled title costs a line on a review page; a
   misfiled quote costs the limit. */
function looksLikeATitle(span) {
  const w = span.trim().split(/\s+/).filter(Boolean);
  if (!w.length || w.length > 9) return false;
  if (/\.$/.test(span.trim())) return false;
  return w.every(word => {
    const bare = word.replace(/[^A-Za-z’']/g, "");
    if (bare.length < 4) return true;
    return /^[A-Z]/.test(bare);
  });
}

function splitFact(f) {
  const lines = (f.lines || []).filter(x => typeof x === "string");
  const last = lines.length ? lines[lines.length - 1] : "";
  if (lines.length >= 2 && ATTR_LINE.test(last)) {
    return { body: lines.slice(0, -1), crumb: last };
  }
  return { body: lines, crumb: null };
}

function resolveSource(crumb, tags, whole) {
  const hay = [crumb || "", whole || "", ...(tags?.source || [])].join(" ");
  for (const [name] of PUBLICATIONS) if (hay.includes(name)) return name;
  /* the vault's own derived facts credit the outlet in the SECOND line rather
     than in a breadcrumb; the `speaker:` slug is then the outlet. */
  const sp = (tags?.speaker || [])[0];
  if (sp && SLUG_TO_NAME.has(sp)) return SLUG_TO_NAME.get(sp);
  return null;
}

function classify(f) {
  const { body, crumb } = splitFact(f);
  const text = body.join(" ");
  const speaker = (f.tags?.speaker || [])[0] || null;
  const span = QUOTED_SPAN.exec(text);

  /* the verbatim-with-credit convention outranks a span: a reprinted answer
     that happens to name a record in quote marks is still a reprinted answer. */
  if (crumb && SPEAKER_IS_A_PERSON(speaker)) {
    return { kind: "quote", why: "verbatim + attribution", quoted: text, n: words(text) };
  }
  if (span) {
    const inner = span[1] ?? "";
    if (looksLikeATitle(inner)) {
      return { kind: "title", why: "a work's name in quote marks", quoted: inner, n: 0 };
    }
    return { kind: "quote", why: "quoted span", quoted: inner, n: words(inner) };
  }
  return { kind: "paraphrase", why: "", quoted: null, n: 0 };
}

/* ── THE QUOTE-DECK CARDS, BECAUSE THE LIMIT IS PER PAGE AND NOT PER SURFACE
   [2026-08-16] The scroller was audited first because it had never been
   audited at all. But Mike's rule counts a source ACROSS THE WHOLE ARTIST
   PAGE, so a list that stops at one surface understates every page it
   describes — and a review made against an understated list is a review of the
   wrong thing.
   MEASURED WHILE LOOKING AT THE GLASS: Hunter Root's `What Hunter said` deck
   carries TWO cards, both credited `Hunter Root · his own channel · July 2026`,
   and the first is SEVENTEEN words. Both are live. The 2026-08-17 sweep
   re-measured this deck and reported *"no source quoted twice · zero text
   quotes at or over fifteen words (longest is 12)"* — so this is not new
   breakage, it is a count that was wrong, and the fix is that the count now
   comes out of a tool rather than out of a reading.
   THE RENDERER PUTS THE QUOTE MARKS ON, so `text` is quoted material on the
   glass whether or not the data carries a mark. Every card here is a quote.
   `kind: "quote"` decks exist ONLY in `worth-a-listen.js` — measured, zero in
   weird-baby.js, foundation.js and robots.js — so this import is the whole
   population. /hr's decks live behind the password and are not customer-facing.
   ── */
function quoteCards() {
  const rows = [];
  const walk = (node, album) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) { for (const x of node) walk(x, album); return; }
    if (node.kind === "quote" && Array.isArray(node.cards)) {
      for (const c of node.cards) {
        const text = String(c.text || "");
        rows.push({
          route: "/wal",
          artist: album,
          artistSlug: album,
          id: `card:${album}:${(c.eyebrow || text).slice(0, 28)}`,
          surface: "quote card",
          text,
          crumb: [c.who, c.where, c.when].filter(Boolean).join(" · "),
          wordsAll: words(text),
          kind: "quote",
          why: "a quote card — the renderer sets it in quote marks",
          quoted: text,
          quotedWords: words(text),
          /* the card's own credit IS the source, and `his own channel` is a
             source per artist rather than a publication — two cards carrying it
             on one page are two quotes from one source. */
          source: c.where ? `${c.who || album} — ${c.where}` : null,
          sourceTags: "",
          link: c.url || null,
        });
      }
    }
    for (const k of Object.keys(node)) {
      if (k === "cards") continue;
      walk(node[k], album);
    }
  };
  for (const album of worthAListenExhibit.spine || []) {
    walk(album.tracks, album.title);
  }
  return rows;
}

/* ── the sweep ─────────────────────────────────────────────────────────────
   One row per fact per surface. A fact reachable from two routes (the HR vault
   is) is reported on both, because the limits are counted per ARTIST PAGE. */
function sweep() {
  const rows = [];
  for (const { route, pool } of SURFACES) {
    for (const f of pool) {
      const { body, crumb } = splitFact(f);
      const text = body.join(" ");
      const artistSlug = route === "/hr" ? "hunter_root"
        : (f.tags?.album || [])[0] || "wal";
      const c = classify(f);
      rows.push({
        route,
        artist: ARTIST[artistSlug] || artistSlug,
        artistSlug,
        id: f.id,
        surface: "scroller",
        text,
        crumb: crumb || "",
        wordsAll: words(text),
        kind: c.kind,
        why: c.why,
        quoted: c.quoted,
        quotedWords: c.n,
        source: resolveSource(crumb, f.tags, text),
        /* the raw `source:` namespace — wiki / own / feed / press / bandcamp /
           vault. Shown for a paraphrase or a title, where a named publication
           is not required and a red UNRESOLVED would be a false alarm on 200
           rows. UNRESOLVED stays red where it means something: a QUOTE whose
           source cannot be named. */
        sourceTags: (f.tags?.source || []).join(", "),
        /* NO fact in either pool carries a link field, and the schema has no
           slot for one. Reported per row rather than stated once, because the
           column is the point: it says of every quote on this surface that a
           visitor cannot go and check it. */
        link: null,
      });
    }
  }
  rows.push(...quoteCards());
  return rows;
}

function breaches(rows) {
  const tooLong = rows.filter(r => r.kind === "quote" && r.quotedWords >= WORD_LIMIT);

  /* one quote per source, per ARTIST PAGE (route + artist) */
  const byPage = new Map();
  for (const r of rows) {
    if (r.kind !== "quote") continue;
    const key = `${r.route} · ${r.artist}`;
    const src = r.source || `UNRESOLVED — ${r.crumb || "(no credit)"}`;
    if (!byPage.has(key)) byPage.set(key, new Map());
    const m = byPage.get(key);
    if (!m.has(src)) m.set(src, []);
    m.get(src).push(r);
  }
  const repeated = [];
  for (const [page, m] of byPage) {
    for (const [src, list] of m) {
      if (list.length > 1) repeated.push({ page, source: src, count: list.length, rows: list });
    }
  }
  repeated.sort((a, b) => b.count - a.count);
  return { tooLong, repeated };
}

/* ── output ────────────────────────────────────────────────────────────────*/
const esc = s => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CSS = `
:root{--ink:#14130f;--dim:#6b675c;--paper:#efece3;--line:#cdc7b6;--red:#9c2b1e;
      --amber:#8a6512;--ok:#3f6b33}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);
     font:15px/1.5 -apple-system,Segoe UI,Arial,sans-serif;padding:18px}
h1{font-size:1.25rem;margin:0 0 2px;letter-spacing:.02em}
.sub{color:var(--dim);font-size:.82rem;margin:0 0 18px}
.tools{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px}
button{font:inherit;padding:6px 12px;border:1px solid var(--line);border-radius:3px;
       background:#fff;color:var(--ink);cursor:pointer}
button[aria-pressed="true"]{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.scroll{overflow-x:auto;border:1px solid var(--line);background:#fff;border-radius:3px}
table{border-collapse:collapse;width:100%;min-width:900px;font-size:.82rem}
th,td{text-align:left;padding:6px 9px;border-bottom:1px solid var(--line);vertical-align:top}
th{position:sticky;top:0;background:#fff;font-weight:700;white-space:nowrap;z-index:1}
td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
tr.brk td{background:#fbeceb}
.tag{font-size:.72rem;padding:1px 6px;border-radius:9px;border:1px solid var(--line);
     white-space:nowrap;display:inline-block}
.q{background:#f6e4e1;border-color:#e0b6ae;color:var(--red)}
.p{background:#e8efe5;border-color:#bcd0b4;color:var(--ok)}
.t{background:#f2ecdc;border-color:#d8cba9;color:var(--amber)}
.over{color:var(--red);font-weight:700}
.none{color:var(--dim)}
h2{font-size:1rem;margin:26px 0 6px}
.note{font-size:.8rem;color:var(--dim);margin:4px 0 10px;max-width:70ch}
code{font-family:Consolas,monospace;font-size:.92em}
`;

function page(rows, b, stamp) {
  const pubOptions = [...new Set(rows.map(r => r.route))];
  const body = rows.map(r => `
  <tr data-kind="${r.kind}" data-route="${esc(r.route)}"
      class="${(r.kind === "quote" && r.quotedWords >= WORD_LIMIT) ? "brk" : ""}">
    <td>${esc(r.route)}</td>
    <td>${esc(r.artist)}</td>
    <td>${esc(r.surface)}</td>
    <td>${esc(r.text)}${r.crumb ? `<br><span class="none">${esc(r.crumb)}</span>` : ""}</td>
    <td class="n">${r.kind === "quote" ? `<span class="${r.quotedWords >= WORD_LIMIT ? "over" : ""}">${r.quotedWords}</span>` : r.wordsAll}</td>
    <td>${r.source ? esc(r.source)
        : r.kind === "quote" ? `<span class="over">UNRESOLVED</span>`
        : `<span class="none">${esc(r.sourceTags || "—")}</span>`}</td>
    <td><span class="tag ${r.kind === "quote" ? "q" : r.kind === "title" ? "t" : "p"}">${r.kind}</span></td>
    <td>${r.link
        ? `<a href="${esc(r.link)}" target="_blank" rel="noreferrer">${
            r.linkOk === true ? "yes" : r.linkOk === false ? '<span class="over">DEAD</span>' : "not checked"
          }</a>`
        : `<span class="none">no link</span>`}</td>
  </tr>`).join("");

  const repeatBlock = b.repeated.length ? `
<div class="scroll"><table>
<thead><tr><th>page</th><th>source</th><th>quotes</th><th>which</th></tr></thead>
<tbody>${b.repeated.map(x => `
<tr class="brk"><td>${esc(x.page)}</td><td>${esc(x.source)}</td>
<td class="n">${x.count}</td>
<td>${x.rows.map(r => esc(r.id)).join("<br>")}</td></tr>`).join("")}
</tbody></table></div>` : `<p class="note">None.</p>`;

  return `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Scroller facts — every artist</title><style>${CSS}</style>
<h1>The pop-up scroller — every fact, every artist</h1>
<p class="sub">${rows.length} rows across ${pubOptions.join(" and ")} ·
generated ${esc(stamp)} · ${rows.some(r => r.linkOk !== undefined)
  ? `every link opened and answered at that moment`
  : `links <b>not opened</b> this run — <code>npm run facts -- --check-links</code>`} ·
rebuild with <code>npm run facts</code></p>

<div class="tools">
  <button data-f="all" aria-pressed="true">Everything</button>
  <button data-f="quote" aria-pressed="false">Quotes only</button>
  <button data-f="paraphrase" aria-pressed="false">Paraphrase only</button>
  <button data-f="title" aria-pressed="false">Titles only</button>
  <button data-f="over" aria-pressed="false">${WORD_LIMIT} words or more</button>
</div>
<p class="note"><b>quote</b> — the source's own words, reprinted · <b>title</b> —
a record or a video's name in quote marks, not quoted material ·
<b>paraphrase</b> — the house's sentence. A title is judged by its case, and the
test errs towards calling a title a quote rather than the other way round.</p>

<div class="scroll"><table>
<thead><tr><th>route</th><th>artist</th><th>surface</th><th>text</th><th>words</th>
<th>source</th><th>kind</th><th>link</th></tr></thead>
<tbody>${body}</tbody></table></div>

<h2>Quotes at or over ${WORD_LIMIT} words — ${b.tooLong.length}</h2>
<p class="note">The limit is <b>under fifteen</b>. Word counts are of the quoted
material only; a paraphrase has no limit and is counted whole for reference.</p>
${b.tooLong.length ? `<div class="scroll"><table>
<thead><tr><th>route</th><th>artist</th><th>words</th><th>quote</th></tr></thead>
<tbody>${b.tooLong.map(r => `<tr class="brk"><td>${esc(r.route)}</td>
<td>${esc(r.artist)}</td><td class="n over">${r.quotedWords}</td>
<td>${esc(r.quoted)}<br><span class="none">${esc(r.crumb)}</span></td></tr>`).join("")}
</tbody></table></div>` : `<p class="note">None.</p>`}

<h2>Sources quoted more than once on one artist page — ${b.repeated.length}</h2>
<p class="note">Counted across the whole artist page, not per surface.</p>
${repeatBlock}

<script>
const btns=[...document.querySelectorAll('button[data-f]')];
btns.forEach(b=>b.addEventListener('click',()=>{
  btns.forEach(x=>x.setAttribute('aria-pressed', String(x===b)));
  const f=b.dataset.f;
  document.querySelectorAll('tbody tr[data-kind]').forEach(tr=>{
    const show = f==='all' ? true
      : f==='over' ? tr.classList.contains('brk')
      : tr.dataset.kind===f;
    tr.style.display = show ? '' : 'none';
  });
}));
</script>`;
}

/* ── main ──────────────────────────────────────────────────────────────────*/
const argv = process.argv.slice(2);
const gate = argv.includes("--gate");
const print = argv.includes("--print");

const rows = sweep();

/* ── LINK CHECKING IS OPT-IN AND SAYS SO ON THE PAGE ───────────────────────
   Mike asked for "working link yes/no", and a link that RESOLVES is the only
   honest answer to that — but a document generator that always reaches the
   network fails on a train and reports a dead door that is not dead. So the
   column reads `not checked` unless `--check-links` was typed, and never
   guesses. Only quote cards carry a URL; no scroller fact has a slot for one. */
if (argv.includes("--check-links")) {
  const withLinks = rows.filter(r => r.link);
  process.stdout.write(`checking ${withLinks.length} links…\n`);
  await Promise.all(withLinks.map(async r => {
    try {
      const res = await fetch(r.link, { method: "GET", redirect: "follow" });
      r.linkOk = res.ok;
    } catch { r.linkOk = false; }
  }));
}

const b = breaches(rows);

if (print || gate) {
  const w = process.stdout;
  w.write(`scroller facts: ${rows.length} rows · ` +
          `${rows.filter(r => r.kind === "quote").length} quotes · ` +
          `${rows.filter(r => r.kind === "paraphrase").length} paraphrase\n`);
  w.write(`quotes at or over ${WORD_LIMIT} words: ${b.tooLong.length}\n`);
  w.write(`sources quoted more than once on one page: ${b.repeated.length}\n`);
  if (print) {
    for (const r of b.tooLong) {
      w.write(`  ${r.route} ${r.artist} [${r.quotedWords}] ${r.id} ${r.quoted.slice(0, 90)}\n`);
    }
    for (const x of b.repeated) {
      w.write(`  ${x.page} · ${x.source} · ${x.count}\n`);
    }
  }
}

if (!gate) {
  mkdirSync(dirname(OUT), { recursive: true });
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  writeFileSync(OUT, page(rows, b, stamp), "utf8");
  process.stdout.write(`wrote ${OUT}\n`);
}

if (gate && (b.tooLong.length || b.repeated.length)) process.exit(1);
