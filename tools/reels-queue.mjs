/* ===========================================================================
   THE QUEUE — the reel line's last step: packet file → public URL → Buffer.
   [2026-09-03, Mike's ruling: Buffer is the posting line]

     node tools/reels-queue.mjs --lane numbers --week 2 --dry     what would be queued
     node tools/reels-queue.mjs --lane numbers --week 2           queue it
     node tools/reels-queue.mjs --channels                        list Buffer channels, write reels/buffer-channels.json
     node tools/reels-queue.mjs --schema                          print Buffer's CreatePostInput fields (to check metadata names)

   For every ledger row of the week whose status is `shot` and that has a
   built file: upload the file to the museum's R2 bucket under reels/…
   (served at https://assets.weird.baby/…; Buffer needs a public, direct,
   stable URL and fetches at post time), then createPost on each connected
   channel with mode customScheduled at the lane's post time. Post ids go
   into the row's `postings`; status becomes `queued`.

   The Buffer key is read from BUFFER_TOKEN or from
   C:/AI/PERSONA-20260903/.secrets/buffer.token — outside every repo. Mike
   makes it in Buffer (Settings → API) and can revoke it there. Nothing here
   creates an account or touches a password.

   Post times (Ops' call, 2026-09-03): the Number at 12:00 New York, the
   Determination at 17:00 New York with the Record. Times are computed to
   UTC per date, so daylight saving is handled.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const API = "https://api.buffer.com";
const BUCKET = "weird-baby-assets";
const PUBLIC = "https://assets.weird.baby";
const TOKEN_FILE = "C:/AI/PERSONA-20260903/.secrets/buffer.token";
const CHANNELS_FILE = path.join(REPO, "reels", "buffer-channels.json");
const LANES = {
  numbers: { file: "numbers.json", time: "12:00" },
  determinations: { file: "determinations.json", time: "17:00" },
};
const ORDER = ["tiktok", "instagram", "youtube", "facebook"]; // release/README.md: door, brand, archive, last

const args = process.argv.slice(2);
const flag = n => args.includes(`--${n}`);
const opt = n => { const i = args.indexOf(`--${n}`); return i > -1 ? args[i + 1] : null; };

function token() {
  if (process.env.BUFFER_TOKEN) return process.env.BUFFER_TOKEN.trim();
  if (fs.existsSync(TOKEN_FILE)) return fs.readFileSync(TOKEN_FILE, "utf8").trim();
  return null;
}
async function gql(query, variables = {}) {
  const t = token();
  if (!t) throw new Error(`no Buffer key: set BUFFER_TOKEN or write ${TOKEN_FILE}`);
  const r = await fetch(API, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${t}` }, body: JSON.stringify({ query, variables }) });
  const j = await r.json();
  if (j.errors) throw new Error("Buffer: " + j.errors.map(e => e.message).join("; "));
  return j.data;
}

/* New York wall time → UTC ISO for a given date, DST-correct. */
function nyToUtcIso(date, hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const [Y, M, D] = date.split("-").map(Number);
  const target = Date.UTC(Y, M - 1, D, h, m);      // the wall time, read as if it were UTC
  const wallAsUtc = ms => {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(new Date(ms));
    const get = k => Number(parts.find(p => p.type === k).value);
    return Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"));
  };
  let x = target;
  for (let i = 0; i < 2; i++) x = target - (wallAsUtc(x) - x);   // offset at that instant; twice, for the DST edges
  return new Date(x).toISOString();
}

function r2Put(file, key) {
  execFileSync("npx", ["wrangler", "r2", "object", "put", `${BUCKET}/${key}`, "--file", file, "--content-type", "video/mp4", "--remote"], { cwd: REPO, stdio: "pipe", shell: true });
  return `${PUBLIC}/${key}`;
}

function metadataFor(service, row, lane) {
  // Only what Buffer documents. Instagram: type reel. Others: channel defaults until --schema says more.
  if (service === "instagram") return { instagram: { type: "reel" } };
  return undefined;
}
function textFor(lane, row) {
  if (lane === "numbers") return `${row.song} — ${row.piece}. Papa Weird.Baby, live. The rest is at weird.baby\n#weirdbaby #originalsong #livemusic #blues #indie`;
  const q = row.question || "the question of the day";
  return `The Determination. ${q}\nweird.baby\n#weirdbaby #mgk #fortune`;
}

async function listChannels() {
  const d = await gql(`{ account { id email organizations { id name } } }`);
  const out = { account: d.account.email, organizations: [], channels: [] };
  for (const org of d.account.organizations) {
    const c = await gql(`query($id: OrganizationId!) { channels(input: { organizationId: $id }) { id name service } }`, { id: org.id });
    out.organizations.push({ id: org.id, name: org.name });
    for (const ch of c.channels) out.channels.push({ organizationId: org.id, id: ch.id, name: ch.name, service: String(ch.service).toLowerCase() });
  }
  fs.writeFileSync(CHANNELS_FILE, JSON.stringify(out, null, 1) + "\n");
  console.log(`account ${out.account}; ${out.channels.length} channel(s):`);
  for (const ch of out.channels) console.log(`  ${ch.service.padEnd(10)} ${ch.name}  ${ch.id}`);
  console.log(`wrote ${path.relative(REPO, CHANNELS_FILE)}`);
}

async function schema() {
  const q = `{ input: __type(name: "CreatePostInput") { inputFields { name type { name kind ofType { name kind } } } }
               meta: __type(name: "PostMetadataInput") { inputFields { name type { name kind ofType { name } } } } }`;
  const d = await gql(q);
  for (const k of ["input", "meta"]) {
    console.log(k === "input" ? "CreatePostInput:" : "PostMetadataInput:");
    for (const f of d[k]?.inputFields || []) console.log(`  ${f.name}: ${f.type.name || f.type.ofType?.name} (${f.type.kind})`);
  }
}

async function queue() {
  const lane = opt("lane"), week = Number(opt("week")), dry = flag("dry");
  if (!LANES[lane] || !week) throw new Error("need --lane numbers|determinations and --week N");
  const ledPath = path.join(REPO, "reels", LANES[lane].file);
  const led = JSON.parse(fs.readFileSync(ledPath, "utf8"));
  const rows = led.rows.filter(r => r.week === week && r.status === "shot" && r.file && fs.existsSync(r.file));
  const channels = fs.existsSync(CHANNELS_FILE) ? JSON.parse(fs.readFileSync(CHANNELS_FILE, "utf8")).channels : [];
  const byService = Object.fromEntries(channels.map(c => [c.service, c]));
  console.log(`THE QUEUE — ${lane}, week ${week}${dry ? " (dry)" : ""}. ${rows.length} built row(s); channels: ${channels.map(c => c.service).join(", ") || "none on file (run --channels)"}`);
  for (const r of rows) {
    const due = nyToUtcIso(r.date, LANES[lane].time);
    const key = `reels/${lane}/${r.date}/${crypto.randomBytes(4).toString("hex")}/${path.basename(r.file)}`;
    console.log(`  ${r.day} ${r.date}  ${path.basename(r.file)}  due ${due}  →  ${PUBLIC}/${key}`);
    if (dry) continue;
    const publicUrl = r2Put(r.file, key);
    r.asset_url = publicUrl;
    for (const service of ORDER) {
      const ch = byService[service];
      if (!ch) { console.log(`      ${service}: no channel connected`); continue; }
      const input = { channelId: ch.id, text: textFor(lane, r), schedulingType: "automatic", mode: "customScheduled", dueAt: due,
        assets: [{ video: { url: publicUrl, metadata: { thumbnailOffset: 1000 } } }] };
      const md = metadataFor(service, r, lane); if (md) input.metadata = md;
      try {
        const d = await gql(`mutation($input: CreatePostInput!) { createPost(input: $input) { ... on PostActionSuccess { post { id dueAt } } ... on MutationError { message } } }`, { input });
        const res = d.createPost;
        if (res.post) { r.postings[service] = { buffer_post_id: res.post.id, dueAt: res.post.dueAt }; console.log(`      ${service}: queued ${res.post.id}`); }
        else { r.postings[service] = { error: res.message }; console.log(`      ${service}: REFUSED ${res.message}`); }
      } catch (e) { r.postings[service] = { error: String(e.message) }; console.log(`      ${service}: ERROR ${e.message}`); }
    }
    if (ORDER.some(s => r.postings[s]?.buffer_post_id)) r.status = "queued";
  }
  if (!dry) { if (!led.statuses.includes("queued")) led.statuses.push("queued"); fs.writeFileSync(ledPath, JSON.stringify(led, null, 1) + "\n"); console.log(`ledger updated: ${path.basename(ledPath)}`); }
}

(async () => {
  try {
    if (flag("channels")) await listChannels();
    else if (flag("schema")) await schema();
    else await queue();
  } catch (e) { console.error(e.message); process.exit(1); }
})();
