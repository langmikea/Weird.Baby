/* ===========================================================================
   THE LIGHT TABLE — the artifact tracker, rebuilt so the PICTURE leads.
   [L2 / C3 2026-08-08]
   ---------------------------------------------------------------------------
   MIKE, on the tracker this replaces: *"Without a preview, and a means to see
   it in a viewer — not very useful."* And the instruction: *every artifact is a
   THUMBNAIL HE CAN SEE, clickable into a viewer that shows it properly. The
   metadata is subordinate to the picture — it may be present, but the picture
   leads and the picture is what he scans.*

   ═══ WHAT CHANGED, AND WHAT DELIBERATELY DID NOT ═══════════════════════════
   The old page was five columns of text about files. Every fact it printed is
   still here; none of it is in front of him. A tile is a picture, a filename
   and — only when it says something he can act on — one chip. Everything else
   (uid, dimensions, quality, verdict, arc, bucket, reach, what uses it) is in
   the VIEWER, one click away, beside the full-size image.

   IT COMPUTES NOTHING NEW. `provenance/asset-table.json` is still the authority
   on files and `reveal/ledger.json` on revealable things; this reads both and
   writes neither. `reachOf` is the same function the old table used.

   ═══ THREE THINGS A FUTURE SESSION MUST HOLD ═══════════════════════════════

   (1) THE POPULATION IS EVERY ASSET-TABLE ROW WHOSE FILE IS ON DISK, and that
       is Mike's own wording — *"build it over the POST-CULL set so it shows
       only what still exists."* The 27 rows carrying `missing: true` are
       therefore OUT, and the footer says so rather than leaving him to notice a
       shortfall. The old page showed only the 47 rows with a public address,
       which would have made "post-cull" mean nothing: everything the cull
       touched lives in the robots repo and has no address.

   (2) THE VIEWER LOADS THE REAL FILE FROM DISK, NOT A BIGGER DATA URI. The
       thumbnail is inlined (so the grid paints with no file access at all); the
       viewer points at a relative path out of `docs/dictation-20260807/` into
       whichever repo owns the file. That keeps the page a few megabytes instead
       of a few hundred, and "shows it properly" means the actual pixels rather
       than a re-encode. IF THE FILE CANNOT BE LOADED THE VIEWER SAYS SO AND
       FALLS BACK TO THE THUMBNAIL — a viewer that silently shows a 240px
       re-encode while claiming to show the original is the quiet kind of wrong.

   (3) THERE IS NO PREAMBLE AND THAT IS A STANDING RULE, NOT A STYLE CHOICE.
       Doctrine 25: THE TOOLS ARE FOR WORKING, NOT FOR BRIEFING. What the old
       page explained above the work — the two-addresses hazard, the depth of
       the ledger join, the bucket rule, the bouncy-ball correction — is either
       said ON the row it concerns, or is on `reference.html`, or was a thing
       Mike had already ruled and had no business being in front of him again.

   THUMBNAILS ARE CACHED BY CONTENT HASH. `--fresh` ignores the cache. The cache
   is keyed on `sha256 + px` and lives in a gitignored file beside this one;
   a file whose bytes change gets a new key, so a stale thumbnail is not
   reachable by construction.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import sharp from "sharp";
import { esc } from "./shell.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const MUSEUM = path.resolve(HERE, "..", "..");
const ROBOTS = path.resolve(MUSEUM, "..", "weird-baby-robots");
const ROOT = { museum: MUSEUM, robots: ROBOTS };

export const THUMB_PX = 240;
const CACHE = path.join(HERE, ".thumb-cache.json");

/* ── the relative href out of the page's own folder into a repo ─────────────
   The page is written to `docs/dictation-20260807/`. `docs/` and the repo root
   are two hops up; the robots repo is a sibling of the museum, so three.
   Segments are encoded individually — `encodeURI` would leave a `#` in a
   filename alive and truncate the path at it. */
const REPO_HOP = { museum: "../..", robots: "../../../weird-baby-robots" };
export const diskHref = e =>
  REPO_HOP[e.repo] + "/" + e.path.split("/").map(encodeURIComponent).join("/");

const kb = n => !n ? "" : n >= 1048576 ? (n / 1048576).toFixed(1) + " MB"
  : Math.round(n / 1024) + " KB";

/* ═══ THUMBNAILS ═══════════════════════════════════════════════════════════ */
function loadCache() {
  try { return JSON.parse(fs.readFileSync(CACHE, "utf8")); } catch { return {}; }
}

/** one inline WebP per row, or null. `null` is drawn, never hidden — a tile
 *  with no picture is a fact about the file and the whole point of the page is
 *  that he can see which ones those are. */
export async function thumbnails(rows, { fresh = false, px = THUMB_PX, log = () => {} } = {}) {
  const cache = fresh ? {} : loadCache();
  const out = new Map();
  let hits = 0, made = 0, failed = 0, done = 0;

  for (const e of rows) {
    const key = `${e.sha256 || e.path}@${px}`;
    if (e.kind !== "image") { out.set(e.uid, null); continue; }
    if (cache[key]) { out.set(e.uid, cache[key]); hits++; continue; }
    const abs = path.join(ROOT[e.repo], e.path.split("/").join(path.sep));
    try {
      const buf = await sharp(abs, { failOn: "none" })
        .rotate()
        .resize(px, px, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 62 })
        .toBuffer();
      const uri = "data:image/webp;base64," + buf.toString("base64");
      cache[key] = uri; out.set(e.uid, uri); made++;
    } catch {
      out.set(e.uid, null); failed++;
    }
    if (++done % 40 === 0) log(`  thumbnails ${done}/${rows.length}`);
  }
  try { fs.writeFileSync(CACHE, JSON.stringify(cache)); } catch { /* a cache that cannot be written is not an error */ }
  return { thumbs: out, hits, made, failed };
}

/* ═══ THE PAGE ═════════════════════════════════════════════════════════════ */

/** the chips. Each one is a QUESTION Mike asks while dictating; a filter that
 *  answers no question is furniture, and furniture costs attention. */
const CHIPS = [
  ["all", "everything"],
  ["mach", "the machines"],
  ["wait", "one entry away"],
  ["wall", "on the wall"],
  ["noverdict", "no verdict yet"],
  ["precious", "precious"],
  ["dump", "dump"],
  ["nobucket", "no bucket yet"],
  ["audio", "audio"],
];

/* `mach` is a UNION and it has to be. `governed` means the pull-back rule
   reaches it, which needs a `/robots/…` public address — and the robots repo
   holds 194 pictures of the same two machines with no address at all. A chip
   labelled "the machines" that showed seventeen of them would be answering a
   question about the rule while he was asking one about the objects. */
const chipTests = `{
  all:function(){return true;},
  mach:function(d){return d.gov||d.repo==='robots';},
  wait:function(d){return d.reach.indexOf('YES')===0;},
  wall:function(d){return d.reach.indexOf('ALREADY')===0;},
  noverdict:function(d){return !d.verdict;},
  precious:function(d){return d.bucket==='precious';},
  dump:function(d){return d.bucket==='dump';},
  nobucket:function(d){return !d.bucket;},
  audio:function(d){return d.kind==='audio';}
}`;

export const LIGHT_CSS = `
/* THE SECTION WRAPPER IS WHAT MAKES THE STICKY BAR RELEASE. A sticky element
   sticks for the length of its CONTAINING BLOCK, so a bar declared straight
   into \`.wrap\` would still be pinned to the top of the window while he is
   reading the ledger table two screens below it — and the ledger table has a
   sticky bar of its own, which would then be underneath it. */
.ltsec{position:relative}
.ltbar{position:sticky;top:0;z-index:6;background:var(--bg);border-bottom:1px solid var(--line);
 padding:10px 0 11px;margin:0 0 16px;display:flex;flex-wrap:wrap;gap:7px;align-items:center}
.ltbar input{flex:1 1 210px;min-width:170px;background:#111015;border:1px solid var(--line);
 color:var(--fg);border-radius:2px;padding:6px 9px;font-family:inherit;font-size:13px;line-height:1.4}
.ltbar button{font-family:inherit;font-size:12px;line-height:1.4;padding:5px 10px;cursor:pointer;
 background:transparent;border:1px solid var(--line);border-radius:2px;color:var(--dim)}
.ltbar button[aria-pressed=true]{background:var(--gold);border-color:var(--gold);color:#17150f}
.ltbar .count{font-size:12px;color:var(--dim2);margin-left:auto;white-space:nowrap}

.lt{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(184px,1fr));margin:0 0 8px}
.lt figure{margin:0;display:flex;flex-direction:column;gap:5px;min-width:0}
.lt figure.hide{display:none}
.shot{padding:0;border:1px solid var(--line);border-radius:2px;cursor:zoom-in;display:block;
 width:100%;background:
 linear-gradient(45deg,#211f25 25%,transparent 25%,transparent 75%,#211f25 75%) 0 0/14px 14px,
 linear-gradient(45deg,#211f25 25%,transparent 25%,transparent 75%,#211f25 75%) 7px 7px/14px 14px,#1a181e;
 aspect-ratio:1/1;overflow:hidden;position:relative}
.shot:hover,.shot:focus-visible{border-color:var(--gold);outline:none}
.shot img{position:absolute;inset:0;margin:auto;max-width:100%;max-height:100%;display:block}
.shot .nop{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
 text-align:center;color:var(--dim2);font-size:11.5px;line-height:1.35;padding:10px}
.shot .snd{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
 color:var(--dim);font-size:34px}
.lt figcaption{font-size:11.5px;line-height:1.35;color:var(--dim);word-break:break-word}
.lt figcaption b{display:block;color:var(--fg);font-weight:500;font-size:12px}
.lt .chip{display:inline-block;margin-top:3px;font-size:10px;letter-spacing:.07em;
 text-transform:uppercase;border:1px solid var(--line);padding:0 5px;border-radius:2px;color:var(--dim2)}
.lt .chip.g{border-color:#3f6b39;color:#9dc593}
.lt .chip.y{border-color:#7a5a20;color:var(--gold)}
.lt .chip.b{border-color:#3c5470;color:#9fb8d4}

/* ── THE VIEWER ── */
#vw[hidden]{display:none}
#vw{position:fixed;inset:0;z-index:40;background:#0d0c10;display:grid;
 grid-template-columns:1fr minmax(250px,306px)}
#vstage{position:relative;display:flex;align-items:center;justify-content:center;overflow:auto;padding:26px}
#vstage img{max-width:100%;max-height:calc(100vh - 52px);display:block}
#vstage audio{width:min(460px,100%)}
#vstage video{max-width:100%;max-height:calc(100vh - 52px)}
#vfail{position:absolute;left:0;right:0;bottom:0;background:#3a201c;color:#f0c9c4;
 font-size:12px;padding:8px 14px;text-align:center}
#vmeta{border-left:1px solid var(--line);padding:18px 18px 40px;overflow:auto;background:var(--panel)}
#vmeta h3{margin:0 0 3px;font-size:14px;line-height:1.3;color:var(--fg);word-break:break-word}
#vmeta .pth{font-size:11px;color:var(--dim2);word-break:break-all;margin:0 0 14px;user-select:all}
#vmeta dl{margin:0;font-size:12.5px;line-height:1.5}
#vmeta dt{color:var(--dim2);font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;margin:12px 0 2px}
#vmeta dd{margin:0;color:var(--fg)}
#vmeta dd i{color:var(--dim2)}
#vnav{position:absolute;top:14px;right:14px;display:flex;gap:6px;z-index:2}
#vnav button,#vmeta .walk button{font-family:inherit;font-size:12px;padding:4px 10px;cursor:pointer;
 background:#1d1c21;border:1px solid var(--line);border-radius:2px;color:var(--fg)}
#vnav button:hover,#vmeta .walk button:hover{border-color:var(--gold)}
#vmeta .walk{display:flex;gap:6px;align-items:center;margin:0 0 14px;font-size:11.5px;color:var(--dim2)}
@media (max-width:820px){#vw{grid-template-columns:1fr;grid-template-rows:1fr auto}
 #vmeta{border-left:0;border-top:1px solid var(--line);max-height:44vh}
 #vstage img{max-height:52vh}}
`;

/** the grid + the viewer. `rows` are already filtered to what is on disk. */
export function lightTable(rows, thumbs) {
  const data = rows.map(r => ({
    uid: r.uid, name: path.posix.basename(r.path), path: r.repo + ":" + r.path,
    src: diskHref(r), kind: r.kind, fmt: r.format, repo: r.repo,
    dims: r.w && r.h ? `${r.w}\u00d7${r.h}` : "", size: kb(r.bytes),
    what: r.what || "", quality: r.quality || "", qnote: r.qualityNote || "",
    verdict: r.verdict || "", arc: r.revealArc || "", bucket: r.bucket || "",
    ref: r.pub || "", gov: !!r.governed, held: !!r.held, ledgered: !!r.ledgered,
    role: r.role || "", usedBy: r.usedBy || [],
    reach: r.reach.k, reachC: r.reach.c, reachW: r.reach.w,
    t: [r.path, r.what, r.quality, r.reach.k, r.bucket, r.role, (r.usedBy || []).join(" ")]
      .join(" ").toLowerCase(),
  }));

  /* the tile. One chip at most, and only when it is something he can act on:
     a picture of the machines is either waiting for an entry or already on a
     wall, and that is the only state on this page that costs him a decision. */
  const tile = (r, i) => {
    const th = thumbs.get(r.uid);
    /* A FILE WITH NO PICTURE STILL SAYS WHAT IT IS. The first cut drew the
       three .MP4s as "no thumbnail · mp4", which is true and reads as a
       failure; they are the only moving footage either repository holds. */
    const inner = r.kind === "audio" ? `<span class="snd">&#9834;</span>`
      : r.kind === "video" ? `<span class="snd">&#9654;</span>`
      : th ? `<img loading="lazy" src="${th}" alt="">`
           : `<span class="nop">no thumbnail<br><small>${esc(r.format)}</small></span>`;
    let chip = "";
    if (r.governed && r.reach.k === "YES \u2014 ONE ENTRY") chip = `<span class="chip g">one entry away</span>`;
    else if (r.reach.k === "ALREADY DELIVERED") chip = `<span class="chip y">on the wall</span>`;
    else if (r.held) chip = `<span class="chip b">behind the door</span>`;
    const line = [r.w && r.h ? `${r.w}×${r.h}` : "", kb(r.bytes)].filter(Boolean).join(" · ");
    return `<figure data-i="${i}"><button class="shot" type="button" data-i="${i}">${inner}</button>
<figcaption><b>${esc(path.posix.basename(r.path))}</b>${esc(line)}${chip}</figcaption></figure>`;
  };

  return `<div class="ltsec">
<div class="ltbar">
  <input id="ltq" placeholder="filter \u2014 filename, folder, description, verdict, use&hellip;" aria-label="filter the light table">
  ${CHIPS.map(([k, l], i) => `<button data-f="${k}"${i === 0 ? ' aria-pressed="true"' : ""}>${esc(l)}</button>`).join("\n  ")}
  <span class="count" id="ltc"></span>
</div>

<div class="lt" id="ltgrid">
${rows.map(tile).join("\n")}
</div>
</div>

<div id="vw" hidden role="dialog" aria-modal="true" aria-label="artifact viewer">
  <div id="vstage"><img id="vimg" alt=""><audio id="vaud" controls hidden></audio>
    <video id="vvid" controls hidden></video>
    <div id="vfail" hidden></div>
    <div id="vnav"><button type="button" id="vprev" title="previous (\u2190)">\u2039</button>
      <button type="button" id="vnext" title="next (\u2192)">\u203a</button>
      <button type="button" id="vx" title="close (Esc)">\u2715</button></div>
  </div>
  <aside id="vmeta"></aside>
</div>

<script>
(function(){
 var D=${JSON.stringify(data)};
 var grid=document.getElementById('ltgrid'),q=document.getElementById('ltq'),c=document.getElementById('ltc');
 var btns=[].slice.call(document.querySelectorAll('.ltbar [data-f]')),mode='all';
 var tests=${chipTests};
 var shown=[];
 function apply(){
  var s=q.value.trim().toLowerCase();shown=[];
  [].forEach.call(grid.children,function(el,i){
   var d=D[i],ok=tests[mode](d)&&(!s||d.t.indexOf(s)>=0);
   el.className=ok?'':'hide'; if(ok)shown.push(i);
  });
  c.textContent=shown.length+' of '+D.length;
 }
 btns.forEach(function(b){b.addEventListener('click',function(){
  mode=b.getAttribute('data-f');
  btns.forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});apply();});});
 q.addEventListener('input',apply);apply();

 /* ── the viewer. It walks the FILTERED set, because walking the whole table
       from inside a filter is the thing that makes a filter feel broken. ── */
 var vw=document.getElementById('vw'),vimg=document.getElementById('vimg'),
     vaud=document.getElementById('vaud'),vmeta=document.getElementById('vmeta'),
     vvid=document.getElementById('vvid'),vfail=document.getElementById('vfail'),
     cur=-1,lastFocus=null;
 function esc2(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
 function row(k,v){return v?'<dt>'+k+'</dt><dd>'+v+'</dd>':'';}
 function draw(i){
  cur=i;var d=D[i];var pos=shown.indexOf(i)+1;
  vfail.hidden=true;
  vimg.hidden=true;vaud.hidden=true;vvid.hidden=true;
  vaud.removeAttribute('src');vvid.removeAttribute('src');
  if(d.kind==='audio'){vaud.hidden=false;vaud.src=d.src;}
  else if(d.kind==='video'){vvid.hidden=false;vvid.src=d.src;}
  else{vimg.hidden=false;vimg.src=d.src;}
  vmeta.innerHTML='<div class="walk"><button type="button" id="wp">\\u2039 prev</button>'
   +'<button type="button" id="wn">next \\u203a</button><span>'+pos+' of '+shown.length+'</span></div>'
   +'<h3>'+esc2(d.name)+'</h3><p class="pth">'+esc2(d.path)+'</p><dl>'
   +row('what it shows',esc2(d.what)||'<i>nobody has written what this is</i>')
   +row('reach today','<b>'+esc2(d.reach)+'</b><br><span style="color:var(--dim)">'+esc2(d.reachW)+'</span>')
   +row('public address',d.ref?'<code>'+esc2(d.ref)+'</code>':'<i>no web address</i>')
   +row('judgement','quality: '+(esc2(d.quality)||'<i>unjudged</i>')
        +(d.qnote?'<br><span style="color:var(--dim)">'+esc2(d.qnote)+'</span>':'')
        +'<br>verdict: '+(esc2(d.verdict)||'<i>not inspected</i>')
        +'<br>arc: '+(esc2(d.arc)||'<i>unset</i>')
        +'<br>bucket: '+(d.bucket?'<b>'+esc2(d.bucket)+'</b>':'<i>unassigned</i>'))
   +row('file',[esc2(d.fmt),esc2(d.dims),esc2(d.size)].filter(Boolean).join(' \\u00b7 ')
        +'<br><code>'+esc2(d.uid)+'</code>'+(d.ledgered?'<br>joined to a ledger row':''))
   +row('used by',d.usedBy.length?d.usedBy.map(function(u){return '<code>'+esc2(u)+'</code>';}).join('<br>')
        :'<i>nothing in this repo references it</i>')
   +'</dl>';
  document.getElementById('wp').addEventListener('click',function(){step(-1);});
  document.getElementById('wn').addEventListener('click',function(){step(1);});
 }
 /* A VIEWER THAT SILENTLY SHOWS THE THUMBNAIL IS THE QUIET KIND OF WRONG. */
 vimg.addEventListener('error',function(){
  var d=D[cur];if(!d)return;
  var th=grid.children[cur].querySelector('img');
  vfail.hidden=false;
  vfail.textContent=th?'The file could not be read from '+d.path+' \\u2014 showing the 240px thumbnail instead.'
                      :'The file could not be read from '+d.path+'.';
  if(th)vimg.src=th.src;
 });
 function step(n){
  var at=shown.indexOf(cur);if(at<0)return;
  var to=at+n;if(to<0||to>=shown.length)return;draw(shown[to]);
 }
 function open(i){lastFocus=document.activeElement;vw.hidden=false;draw(i);
  document.body.style.overflow='hidden';document.getElementById('vx').focus();}
 function close(){vw.hidden=true;vimg.removeAttribute('src');vaud.removeAttribute('src');
  vvid.pause();vvid.removeAttribute('src');
  document.body.style.overflow='';if(lastFocus)lastFocus.focus();cur=-1;}
 grid.addEventListener('click',function(e){
  var b=e.target.closest('.shot');if(!b)return;open(Number(b.getAttribute('data-i')));});
 document.getElementById('vx').addEventListener('click',close);
 document.getElementById('vprev').addEventListener('click',function(){step(-1);});
 document.getElementById('vnext').addEventListener('click',function(){step(1);});
 document.addEventListener('keydown',function(e){
  if(vw.hidden)return;
  if(e.key==='Escape'){close();}
  else if(e.key==='ArrowLeft'){step(-1);}
  else if(e.key==='ArrowRight'){step(1);}
 });
})();
</script>`;
}
