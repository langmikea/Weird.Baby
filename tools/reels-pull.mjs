/* ===========================================================================
   THE SUNDAY READING — what each queued reel did, from Buffer, into the ledger.
   [2026-09-03] The rule of the run: a song runs while its sends and saves
   climb week on week; the Determination's recipe is read off the rows. This
   pulls the numbers so the reading is a reading and not a guess.

     node tools/reels-pull.mjs --lane numbers --week 2
     node tools/reels-pull.mjs --lane numbers --week 2 --dry

   For every posting with a Buffer post id: ask Buffer for the post's status
   and metrics, record status (scheduled / sent / error) and whatever metric
   fields Buffer exposes for that channel (Buffer's field names are read from
   its schema on first use and cached in reels/buffer-schema.json, because
   they differ by channel and are not in the guide). A row whose postings are
   all sent becomes `posted`. Prints a one-screen table.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const API = "https://api.buffer.com";
const TOKEN_FILE = "C:/AI/PERSONA-20260903/.secrets/buffer.token";
const SCHEMA = path.join(REPO, "reels", "buffer-schema.json");
const LANES = { numbers: "numbers.json", determinations: "determinations.json" };
const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(`--${n}`); return i > -1 ? args[i + 1] : null; };
const dry = args.includes("--dry");

function token() { return process.env.BUFFER_TOKEN?.trim() || (fs.existsSync(TOKEN_FILE) ? fs.readFileSync(TOKEN_FILE, "utf8").trim() : null); }
async function gql(query, variables = {}) {
  const t = token(); if (!t) throw new Error(`no Buffer key: set BUFFER_TOKEN or write ${TOKEN_FILE}`);
  const r = await fetch(API, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${t}` }, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error("Buffer: " + j.errors.map(e => e.message).join("; ")); return j.data;
}
async function postFields() {
  if (fs.existsSync(SCHEMA)) return JSON.parse(fs.readFileSync(SCHEMA, "utf8"));
  const d = await gql(`{ post: __type(name: "Post") { fields { name type { name kind ofType { name kind } } } }
                        q: __type(name: "Query") { fields { name args { name type { name kind ofType { name } } } } } }`);
  const out = { post: d.post?.fields?.map(f => ({ name: f.name, type: f.type.name || f.type.ofType?.name })) || [],
                postQuery: d.q?.fields?.find(f => f.name === "post") || null, read: new Date().toISOString() };
  fs.writeFileSync(SCHEMA, JSON.stringify(out, null, 1) + "\n");
  return out;
}
function metricSelection(fields) {
  // take whatever Buffer calls its numbers; the names are cached from the schema
  const names = fields.post.map(f => f.name);
  const pick = ["metrics", "analytics", "insights", "stats"].filter(n => names.includes(n));
  return pick.length ? pick.map(n => `${n} { __typename }`).join(" ") : "";
}

(async () => {
  const lane = opt("lane"), week = Number(opt("week"));
  if (!LANES[lane] || !week) { console.error("need --lane numbers|determinations and --week N"); process.exit(1); }
  const ledPath = path.join(REPO, "reels", LANES[lane]);
  const led = JSON.parse(fs.readFileSync(ledPath, "utf8"));
  const rows = led.rows.filter(r => r.week === week);
  const targets = rows.flatMap(r => Object.entries(r.postings).filter(([, p]) => p && p.buffer_post_id).map(([s, p]) => ({ r, s, id: p.buffer_post_id })));
  console.log(`THE SUNDAY READING — ${lane}, week ${week}${dry ? " (dry)" : ""}. ${targets.length} posting(s) with a Buffer id.`);
  if (!targets.length || dry) { for (const t of targets) console.log(`  ${t.r.day} ${t.s} ${t.id}`); return; }
  const fields = await postFields();
  const sel = metricSelection(fields);
  const argName = fields.postQuery?.args?.[0]?.name || "input";
  for (const t of targets) {
    try {
      const q = argName === "id"
        ? `query($id: ID!) { post(id: $id) { id status ${sel} } }`
        : `query($id: ID!) { post(input: { id: $id }) { id status ${sel} } }`;
      const d = await gql(q, { id: t.id });
      const p = d.post; t.r.postings[t.s].status = p.status; t.r.postings[t.s].read = new Date().toISOString();
      for (const k of ["metrics", "analytics", "insights", "stats"]) if (p[k]) t.r.postings[t.s][k] = p[k];
      console.log(`  ${t.r.day} ${t.s.padEnd(10)} ${String(p.status).padEnd(10)} ${t.id}`);
    } catch (e) { t.r.postings[t.s].read_error = e.message; console.log(`  ${t.r.day} ${t.s.padEnd(10)} ERROR ${e.message}`); }
  }
  for (const r of rows) {
    const ps = Object.values(r.postings).filter(Boolean);
    if (ps.length && ps.every(p => String(p.status).toLowerCase() === "sent")) r.status = "posted";
  }
  fs.writeFileSync(ledPath, JSON.stringify(led, null, 1) + "\n");
  console.log(`ledger updated: ${path.basename(ledPath)}. If the metric fields came back empty, open reels/buffer-schema.json and widen metricSelection().`);
})().catch(e => { console.error(e.message); process.exit(1); });
