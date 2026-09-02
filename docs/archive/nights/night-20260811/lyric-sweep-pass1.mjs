/* A2 — the lyric sweep. Reads EVERY visitor-facing string the provenance gate
   knows about, plus the two fact stores and the artifact export, and flags any
   run of words that reads as a quotation FROM a song rather than about one. */
import fs from "node:fs";
import { sweep } from "./tools/provenance-sweep.mjs";

const strings = [];

/* 1. everything the provenance boundary sees — this is the glass */
const s = sweep();
for (const r of (s.rows || s.strings || s.found || [])) {
  strings.push({ where: `${r.file}:${r.line}`, id: r.key || "", text: r.text });
}

/* 2. the two fact stores and the artifact export, which the boundary treats as
      generated/bulk-declared and therefore does NOT itemise */
const vault = JSON.parse(fs.readFileSync("src/data/exhibits/hunter_root.facts.json", "utf8"));
for (const f of vault.facts) for (const [i, l] of f.lines.entries())
  strings.push({ where: "hunter_root.facts.json", id: f.id + "[" + i + "]", text: l });

const arts = JSON.parse(fs.readFileSync("src/data/exhibits/hunter_root.json", "utf8"));
for (const a of arts.artifacts || []) for (const k of ["title", "description"])
  if (a[k]) strings.push({ where: "hunter_root.json", id: a.id + "." + k, text: a[k] });

const wal = (await import("./src/data/artists/worth-a-listen-facts.js")).default;
for (const f of wal) for (const [i, l] of f.lines.entries())
  strings.push({ where: "worth-a-listen-facts.js", id: f.id + "[" + i + "]", text: l });

const hrf = (await import("./src/routes/hr/hr_facts.js")).FACTS;
for (const f of hrf) for (const [i, l] of f.lines.entries())
  strings.push({ where: "hr_facts.js (retired)", id: f.id + "[" + i + "]", text: l });

/* ── the detectors ─────────────────────────────────────────────────────────
   Each is a SEPARATE signal with its own name, so a hit says why it fired and
   a false positive can be dismissed on the reason rather than on a score. */
const SONGS = [
  "'94", "’94", "Town Rat Heathen", "Friendly Fire", "My Brother's Bones",
  "Flash in the Pan", "String Up a Necklace", "Book Upon My Shelf", "Nothin' Wrong",
  "Cusp Of The Mend", "Reverend", "Silver Lining", "Quicksand Sinking", "Homestead",
  "Lampshade", "Wildfire", "Straitlaced", "Shapeshifter", "People Are Programs",
  "The Keeper", "Cookin' in the Bathroom", "Belly Ache", "Sizzle Into Oblivion",
  "Medicine", "Questioned By A Ghost", "Park Bench Pigeons", "Strange Chemistry",
  "Be Good", "Shit List", "Doin' Me", "Cooler", "There's A Hole", "That Can't Be Right",
  "Horses", "Wheel", "Price of Eggs", "Rich People", "Elon Musk", "Little Lisa",
];

function tests(t) {
  const hits = [];

  /* A. ATTRIBUTED TO A SONG. The single strongest signal: a breadcrumb whose
        SPEAKER is a song title is by definition a quote out of that song. */
  const attrib = t.match(/^\s*[—-]\s*[""]?([^"",]+)[""]?\s*,/);
  if (attrib) {
    const who = attrib[1].replace(/[""']/g, "").trim();
    if (SONGS.some(x => x.replace(/[''’]/g, "'").toLowerCase() === who.replace(/[''’]/g, "'").toLowerCase()))
      hits.push("ATTRIBUTED TO A SONG — the breadcrumb names a track as the speaker");
  }

  /* B. SLASH LINE BREAKS. The printing convention for quoted verse. */
  if ((t.match(/ \/ /g) || []).length >= 2)
    hits.push("VERSE LINE BREAKS — two or more ' / ' separators, the convention for quoted lyric");

  /* C. QUOTED RUN NAMING A SONG IN THE SAME BREADCRUMB, any position. */
  if (/[—-]\s*[""][^""]{1,40}[""]\s*,\s*(Hunter Root|Carsie Blanton|Jesse Welles|Mikey Mike)/i.test(t))
    hits.push("QUOTE CREDITED TO A TRACK AND ARTIST — the shape of a lyric citation");

  /* D. LONG FIRST-PERSON RUN WITH NO INTERVIEW MARKERS. Weak on its own; only
        reported so a human can look, never treated as proof. */
  const words = t.split(/\s+/).length;
  const firstPerson = /\b(I|I'm|I'd|I'll|my|me)\b/.test(t);
  const interview = /\b(said|says|told|interview|—\s*[A-Z][a-z]+ [A-Z]|20\d\d)\b/.test(t);
  if (words >= 14 && firstPerson && !interview && / \/ | — /.test(t))
    hits.push("WEAK: long first-person run with no interview marker");

  return hits;
}

const flagged = [];
for (const s of strings) {
  const h = tests(String(s.text));
  if (h.length) flagged.push({ ...s, why: h });
}

console.log("strings scanned:", strings.length);
console.log("flagged:", flagged.length, "\n");
for (const f of flagged) {
  console.log("── " + f.id + "   (" + f.where + ")");
  console.log("   " + JSON.stringify(f.text));
  f.why.forEach(w => console.log("   ! " + w));
  console.log();
}
