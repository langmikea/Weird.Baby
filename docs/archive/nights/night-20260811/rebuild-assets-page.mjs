/* JOB 5 — one self-contained page showing every shipped asset with no verdict.
   Reads provenance/asset-table.json. WRITES NOTHING BACK. */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const MUSEUM = "C:/AI/Projects/weird-baby-museum";
const REPOS = { museum: MUSEUM, robots: "C:/AI/Projects/weird-baby-robots" };
const OUT = "C:/AI/_night-20260811/assets.html";

const table = JSON.parse(fs.readFileSync(MUSEUM + "/provenance/asset-table.json", "utf8"));
const rows = Array.isArray(table) ? table : (table.rows || table.assets || Object.values(table).find(Array.isArray));
const isAudioRow = r => r.kind === "audio" || /mp3|wav|m4a|ogg/.test(r.format || "");
/* PICTURES FIRST. Mike asked to see the PILE — six audio players at the top of
   the page push every picture below the fold and the first screen shows him
   nothing he can judge by looking. The six recordings go last, where they are
   still all in one place. */
const need = rows.filter(r => r.role === "shipped" && !r.verdict)
  .sort((a, b) => (isAudioRow(a) ? 1 : 0) - (isAudioRow(b) ? 1 : 0));

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const kb = b => b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.round(b / 1024) + " KB";

const cards = [];
let thumbBytes = 0, failed = 0;

for (const r of need) {
  const abs = path.join(REPOS[r.repo] || MUSEUM, r.path);
  const onDisk = fs.existsSync(abs);
  const isAudio = isAudioRow(r);
  let media = "", thumbNote = "";

  if (isAudio) {
    media = `<audio controls preload="none" src="file:///${abs.replace(/\\/g, "/")}"></audio>
      <div class="fallback">If the player is silent, open it directly — the path is selectable below.</div>`;
  } else if (!onDisk) {
    media = `<div class="miss">FILE NOT ON DISK</div>`;
  } else {
    try {
      const buf = await sharp(abs, { failOn: "none" })
        .resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true })
        .flatten({ background: "#ffffff" })
        .jpeg({ quality: 76 })
        .toBuffer();
      thumbBytes += buf.length;
      media = `<img src="data:image/jpeg;base64,${buf.toString("base64")}" alt="">`;
      thumbNote = "shown at up to 1000px on the long edge, flattened onto white";
    } catch (e) {
      /* sharp cannot rasterise .ico, and it refuses an .svg whose features it
         does not support. Both of those a BROWSER draws natively, so the
         fallback is the file itself rather than a placeholder — the whole point
         of the page is that Mike looks at the thing. */
      const MIME = { ico: "image/x-icon", svg: "image/svg+xml", webp: "image/webp",
                     png: "image/png", jpg: "image/jpeg", gif: "image/gif" };
      const mime = MIME[r.format];
      if (mime) {
        const raw = fs.readFileSync(abs);
        thumbBytes += raw.length;
        media = `<img src="data:${mime};base64,${raw.toString("base64")}" alt="">`;
        thumbNote = "the ORIGINAL file, embedded whole — no re-encoding";
      } else {
        failed++;
        media = `<div class="miss">COULD NOT RENDER A PREVIEW (${esc(r.format)})<br><span>The file is on disk. Open it directly — path below.</span></div>`;
      }
    }
  }

  const dims = (r.w && r.h) ? `${r.w} × ${r.h}` : "—";
  const used = (r.usedBy && r.usedBy.length)
    ? r.usedBy.map(u => `<code>${esc(u)}</code>`).join(" ")
    : `<span class="none">nothing in the tree names it</span>`;

  cards.push(`
<article class="card" data-uid="${esc(r.uid)}" data-name="${esc(path.basename(r.path))}">
  <div class="pic ${isAudio ? "audio" : ""}">${media}</div>
  <div class="meta">
    <h2>${esc(path.basename(r.path))}</h2>
    <div class="path"><code>${esc(r.repo)}/${esc(r.path)}</code></div>
    <dl>
      <dt>size</dt><dd>${kb(r.bytes)}${dims !== "—" ? " · " + dims : ""} · ${esc(r.format)}</dd>
      <dt>used by</dt><dd>${used}</dd>
      <dt>what it is</dt><dd>${r.what ? esc(r.what) : `<span class="none">not described</span>`}</dd>
      <dt>Ops on quality</dt><dd>${r.qualityNote ? esc(r.qualityNote) : `<span class="none">nothing noted</span>`}</dd>
    </dl>
    ${thumbNote ? `<div class="thumbnote">Preview ${thumbNote}. Judge the file, not the preview, if it is close.</div>` : ""}
    <div class="btns">
      <button class="pass"   data-v="PASS">KEEP</button>
      <button class="reject" data-v="REJECT">DELETE</button>
      <button class="clear"  data-v="">clear</button>
      <span class="mark"></span>
    </div>
  </div>
</article>`);
}

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The 44 — assets with no verdict</title>
<style>
:root{--bg:#d9d5ca;--card:#faf8f3;--ink:#211f1c;--dim:#57544d;--line:#c6c2b7;--pass:#2f6b3a;--rej:#a8241c}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 Arial,Helvetica,sans-serif;padding:0 0 260px}
header{position:sticky;top:0;z-index:10;background:var(--bg);border-bottom:1px solid var(--line);padding:14px 20px;display:flex;gap:18px;align-items:center;flex-wrap:wrap}
h1{font-size:17px;margin:0;letter-spacing:.02em}
.count{font-size:14px;color:var(--dim)}
.count b{color:var(--ink)}
header button{font:inherit;font-size:14px;padding:7px 14px;border:1px solid var(--ink);background:var(--card);cursor:pointer}
main{max-width:1100px;margin:0 auto;padding:20px}
.card{background:var(--card);border:1px solid var(--line);margin:0 0 22px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
@media(max-width:820px){.card{grid-template-columns:1fr}}
.card.done-PASS{border-color:var(--pass);border-left-width:6px}
.card.done-REJECT{border-color:var(--rej);border-left-width:6px;opacity:.62}
.pic{background:#efece3;display:flex;align-items:center;justify-content:center;padding:14px;min-height:220px;overflow:hidden}
.pic img{max-width:100%;height:auto;display:block;box-shadow:0 1px 6px rgba(0,0,0,.18)}
.pic.audio{flex-direction:column;gap:10px}
.pic audio{width:100%;max-width:420px}
.fallback,.miss{font-size:13px;color:var(--dim);text-align:center;line-height:1.45}
.miss{border:2px dashed var(--rej);color:var(--rej);padding:20px;font-weight:700}
.miss span{font-weight:400;color:var(--dim)}
.meta{padding:16px 18px}
h2{font-size:15px;margin:0 0 4px;word-break:break-all}
.path{margin:0 0 12px}
code{font:12px/1.45 "Courier New",monospace;background:#efece3;padding:1px 4px;word-break:break-all}
dl{margin:0 0 12px;display:grid;grid-template-columns:96px minmax(0,1fr);gap:5px 12px;font-size:14px}
dt{color:var(--dim);font-size:12px;text-transform:uppercase;letter-spacing:.06em;padding-top:2px}
dd{margin:0}
.none{color:#8b877d;font-style:italic}
.thumbnote{font-size:12px;color:var(--dim);border-top:1px solid var(--line);padding-top:8px;margin-bottom:12px}
.btns{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.btns button{font:inherit;font-size:14px;font-weight:700;padding:9px 20px;border:1px solid var(--ink);background:#fff;cursor:pointer}
.btns .pass:hover,.btns .pass.on{background:var(--pass);border-color:var(--pass);color:#fff}
.btns .reject:hover,.btns .reject.on{background:var(--rej);border-color:var(--rej);color:#fff}
.btns .clear{font-weight:400;font-size:12px;padding:7px 10px;color:var(--dim);border-color:var(--line)}
.mark{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--dim)}
#out{max-width:1100px;margin:0 auto;padding:0 20px}
#outbox{width:100%;min-height:300px;font:13px/1.6 "Courier New",monospace;padding:14px;border:2px solid var(--ink);background:#fff;white-space:pre;overflow:auto}
.hint{font-size:13px;color:var(--dim);margin:10px 0}
footer{max-width:1100px;margin:34px auto 0;padding:0 20px;font-size:13px;color:var(--dim);border-top:1px solid var(--line);padding-top:14px}
</style></head><body>

<header>
  <h1>THE 44 — shipped assets carrying no verdict</h1>
  <span class="count"><b id="n">0</b> of ${need.length} judged · <b id="nk">0</b> keep · <b id="nr">0</b> delete</span>
  <button id="show">SHOW MY CHOICES AS TEXT</button>
  <button id="reset">start over</button>
</header>

<main>${cards.join("\n")}</main>

<section id="out">
  <p class="hint">Press SHOW MY CHOICES above. The text lands here — select it and copy it with Ctrl+C. Nothing on this page touches the asset table; your verdicts are yours and go nowhere until you send them.</p>
  <textarea id="outbox" readonly spellcheck="false"></textarea>
</section>

<footer>
  Built ${new Date().toISOString().slice(0, 10)} from <code>provenance/asset-table.json</code> — the ${need.length} rows with
  <code>role: shipped</code> and no <code>verdict</code>. Previews are re-encoded copies at up to 1000px;
  the originals are untouched. This page reads the table and never writes to it.
</footer>

<script>
var KEY="wb-asset-verdicts-20260811";
var V={};
try{V=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){V={}}

function save(){try{localStorage.setItem(KEY,JSON.stringify(V))}catch(e){}}
function paint(){
  var k=0,r=0;
  document.querySelectorAll(".card").forEach(function(c){
    var v=V[c.dataset.uid]||"";
    c.className="card"+(v?" done-"+v:"");
    c.querySelector(".pass").classList.toggle("on",v==="PASS");
    c.querySelector(".reject").classList.toggle("on",v==="REJECT");
    c.querySelector(".mark").textContent=v==="PASS"?"kept":v==="REJECT"?"marked for deletion":"";
    if(v==="PASS")k++; if(v==="REJECT")r++;
  });
  document.getElementById("n").textContent=k+r;
  document.getElementById("nk").textContent=k;
  document.getElementById("nr").textContent=r;
}
document.querySelectorAll(".btns button").forEach(function(b){
  b.addEventListener("click",function(){
    var c=b.closest(".card"), v=b.dataset.v;
    if(v){V[c.dataset.uid]=v}else{delete V[c.dataset.uid]}
    save();paint();
  });
});
document.getElementById("show").addEventListener("click",function(){
  var keep=[],del=[],un=[];
  document.querySelectorAll(".card").forEach(function(c){
    var v=V[c.dataset.uid]||"", n=c.dataset.name;
    if(v==="PASS")keep.push(n); else if(v==="REJECT")del.push(n); else un.push(n);
  });
  var L=[];
  L.push("ASSET VERDICTS \\u2014 Mike, "+new Date().toString().slice(0,24));
  L.push("");
  L.push("DELETE ("+del.length+")");
  del.forEach(function(n){L.push("  "+n)});
  if(!del.length)L.push("  (none)");
  L.push("");
  L.push("KEEP ("+keep.length+")");
  keep.forEach(function(n){L.push("  "+n)});
  if(!keep.length)L.push("  (none)");
  L.push("");
  L.push("NOT JUDGED ("+un.length+")");
  un.forEach(function(n){L.push("  "+n)});
  if(!un.length)L.push("  (none)");
  var t=document.getElementById("outbox");
  t.value=L.join("\\n");
  t.scrollIntoView({behavior:"smooth"});
  t.focus();t.select();
});
document.getElementById("reset").addEventListener("click",function(){
  V={};save();paint();document.getElementById("outbox").value="";
});
paint();
</script>
</body></html>`;

fs.writeFileSync(OUT, html);
console.log("assets needing a verdict:", need.length);
console.log("previews embedded, total base64 source bytes:", (thumbBytes / 1048576).toFixed(1), "MB");
console.log("previews that failed to render:", failed);
console.log("page bytes:", (fs.statSync(OUT).size / 1048576).toFixed(1), "MB ->", OUT);
