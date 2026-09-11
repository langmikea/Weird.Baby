/* ===========================================================================
   THE FIVE WING MOCKS — the infomercial wing, drawn before it is built.
     node tools/mocks.mjs              writes docs/mocks/MOCKS.html (one tabbed page)
                                       and five standalone pages beside it
     node tools/mocks.mjs --photos     also writes a copy with the sample scans
                                       inlined, OUTSIDE the repo (scratchpad), for
                                       the served artifact; photographs never
                                       enter the repo before Mike says so
   Same except data: docs/mocks/MOCKS.json + docs/CATALOGUE-20260918.json in,
   five pages out, one template each. House tokens from museum-tokens.css,
   copied as values (the tokens file is not touched). Mike rules each mock
   A keep / B change (say what) / C cut at the sitting of 09-27; section
   numbers on every page are for saying "2.4".
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.join(HERE, "..");
const OUTDIR = path.join(REPO, "docs/mocks");
const M = JSON.parse(fs.readFileSync(path.join(OUTDIR, "MOCKS.json"), "utf8"));
const C = JSON.parse(fs.readFileSync(path.join(REPO, "docs/CATALOGUE-20260918.json"), "utf8"));
const PHOTOS = process.argv.includes("--photos");
const SCANS = "C:/AI/PERSONA-20260903/scans";
const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* photographs: a labelled frame in the repo copy; a sample scan in the served copy */
const dataUri = f => { try { return "data:image/jpeg;base64," + fs.readFileSync(path.join(SCANS, f)).toString("base64"); } catch { return null; } };
const SAMPLE = PHOTOS ? { plate: dataUri("sample-strength-3.jpg"), tray: dataUri("sample-tray-box.jpg"), chips: dataUri("sample-crop-chips.jpg") } : {};
const plate = (label, kind = "plate", ratio = "4/5") => {
  const src = SAMPLE[kind];
  const inner = src ? `<img src="${src}" alt="">` : `<div class="ph" style="aspect-ratio:${ratio}"></div>`;
  return `<figure class="print"><div class="paper">${inner}</div><figcaption>${esc(label)}</figcaption></figure>`;
};
/* the cover stays a marked frame until the colour shoot exists; no B&W stand-in pretends to be it */
const hero = () => `<div class="hero"><div class="white"><div class="ph hero-ph"></div><span class="tag">colour hero on white · to be shot</span></div></div>`;

const rows = C.rows;
const byId = Object.fromEntries(rows.map(r => [r.id, r]));
const featureRows = rows.filter(r => r.page === "feature");
const KIND_ORDER = ["engine", "feature", "game", "setting", "sound"];
const KIND_NAME = { engine: "Engines", feature: "Features", game: "Games", setting: "Settings", sound: "Sounds" };
const dayLabel = d => d === "later" ? "later" : `day ${d}`;

/* ---------- the strip every mock wears ---------- */
const strip = (n, title, what) => `<div class="strip"><b>Mock ${n} of 5 · ${esc(title)}</b><span>${esc(what)} Rule it: <b>A</b> keep · <b>B</b> change, say what · <b>C</b> cut. Say the section number.</span></div>`;
const sec = (n, t, body, small = "") => `<section class="s"><h2><span class="n">${n}</span>${esc(t)}${small ? `<small>${esc(small)}</small>` : ""}</h2>${body}</section>`;
const wingbar = (crumb) => `<header class="bar"><a class="home" href="#front">Weird.Baby</a><a class="wing" href="#front">\\ROBOTS</a><span class="crumb">${crumb}</span></header>`;

/* ---------- 1. the front: the shelf ---------- */
function front() {
  const shelf = M.shelf.map((u, i) => `<a class="frame" href="#album"><div class="paper">${SAMPLE.plate && i === 0 ? `<img src="${SAMPLE.plate}" alt="">` : `<div class="ph" style="aspect-ratio:4/5"></div>`}</div><b>${esc(u.name)}</b><small>${esc(u.character)} · serial ${esc(u.serial)}</small><span>${esc(u.line)}</span></a>`).join("");
  const today = byId[M.landing.feature];
  const index = KIND_ORDER.map(k => {
    const list = featureRows.filter(r => r.kind === k);
    if (!list.length) return "";
    return `<div class="col"><h3>${KIND_NAME[k]}</h3><ul>${list.map(r => `<li><a href="#feature">${esc(r.name)}</a><em>${dayLabel(r.day)}</em></li>`).join("")}</ul></div>`;
  }).join("");
  return `${strip(1, "the front", "The shelf: four machines, one frame each. Below it, everything the machine does, one line each. The story is one link, marked.")}
${wingbar("the shelf")}
<div class="page">
${sec("1.1", "The shelf", `<div class="shelf">${shelf}</div><p class="note">Pick one up and you are in its album. The Housewife Nano stays behind the door.</p>`, "four albums on 10-30")}
${sec("1.2", "Today", `<div class="today"><span class="k">${esc(M.landing.weekday)} ${esc(M.landing.date)}</span><b>${esc(today.name)}</b><p>${esc(today.pitch)}</p><a class="btn" href="#landing">Today's page</a></div>`, "what the day's reel points at")}
${sec("1.3", "What it does", `<div class="index">${index}</div>`, `${featureRows.length} pages, shared by every unit`)}
${sec("1.4", "The doors", `<div class="doors"><a class="door" href="#"><b>Run it</b><span>the twin, in the browser, the full software</span></a><a class="door" href="#prologue"><b>The prologue</b><span>how the machine got here, if you want it</span></a><a class="door" href="#"><b>The manual</b><span>sixty-three pages, the corrections left in</span></a></div>`)}
</div>`;
}

/* ---------- 2. the album: the Everyday ---------- */
function album() {
  const A = M.album;
  const does = rows.filter(r => r.page === "feature" && (r.album === A.id || r.album === "machine"));
  const doesBy = KIND_ORDER.map(k => {
    const list = does.filter(r => r.kind === k);
    return list.length ? `<div class="col"><h3>${KIND_NAME[k]}</h3><ul>${list.map(r => `<li><a href="#feature">${esc(r.name)}</a>${r.album === A.id ? `<em>this unit</em>` : ""}</li>`).join("")}</ul></div>` : "";
  }).join("");
  return `${strip(2, "the album", "One template, filled with data: the Everyday. Every other album is this page with its own photographs and lines.")}
${wingbar(`the shelf · <b>${esc(A.name)}</b>`)}
<div class="page">
${sec("2.1", "The cover", `${hero()}<h1 class="name">${esc(A.name)}<small>${esc(A.character)} · serial ${esc(A.serial)} · key ${esc(A.key)}</small></h1><p class="for">${esc(A.for)}</p>`)}
${sec("2.2", "The plates", `<div class="plates">${A.plates.map((p, i) => plate(`Plate ${i + 1} · ${p}`)).join("")}</div>`, "evidence prints, black and white, from the tray")}
${sec("2.3", "The kit", `<div class="kit">${A.kit.map((k, i) => `<div class="kititem">${plate(k.name, i === 0 ? "tray" : "plate", "5/4")}<p>${esc(k.line)}</p></div>`).join("")}</div>`, "what came with it and what was made for it")}
${sec("2.4", "The papers", `<ul class="papers">${A.papers.map(p => `<li><b>${esc(p.name)}</b><span>${esc(p.line)}</span><a href="#">read</a></li>`).join("")}</ul>`, "readable, not just pictured")}
${sec("2.5", "What it does", `<div class="index">${doesBy}</div>`, "each line opens the shared feature page")}
${sec("2.6", "The record", A.record.map(p => `<p class="read">${esc(p)}</p>`).join(""), "the only story on the page")}
${sec("2.7", "The door", `<div class="doors"><a class="door" href="#"><b>Run this unit</b><span>the twin, set to serial ${esc(A.serial)}</span></a><a class="door held" href="#"><b>Have one</b><span>the line about having one, when the day comes</span></a></div>`)}
</div>`;
}

/* ---------- 3. the feature page: Probabilities ---------- */
function feature() {
  const F = M.feature; const r = byId[F.id];
  return `${strip(3, "the feature page", "One page per feature, game, setting or sound; the same shape for all of them. Probabilities is the example.")}
${wingbar(`what it does · <b>${esc(r.name)}</b>`)}
<div class="page">
${sec("3.1", "The pitch", `<h1 class="name">${esc(r.name)}<small>${esc(r.kind)} · launch run ${dayLabel(r.day)}</small></h1><p class="for">${esc(r.pitch)}</p>`)}
${sec("3.2", "The glass", `<div class="glass"><div class="screen">${F.glass.map(l => `<div>${esc(l)}</div>`).join("")}</div><p class="note">The display as the twin draws it. Live on the built page: the twin's own screen, this feature selected.</p></div>`)}
${sec("3.3", "How you work it", `<ol class="steps">${F.operate.map(s => `<li>${esc(s)}</li>`).join("")}</ol>`, "scroll knob · click igniter · shake")}
${sec("3.4", "What bends it", `<ul class="plain">${F.settings.map(s => `<li>${esc(s)}</li>`).join("")}</ul>`)}
${sec("3.5", "On which units", `<p class="plain">${F.units.map(u => `<a href="#album">${esc(u)}</a>`).join(" · ")}</p>`, "a feature is the same on every unit")}
${sec("3.6", "The manual says", `<p class="plain">${esc(F.manual)} <a href="#">Open the page.</a></p>`)}
${sec("3.7", "See it", `<div class="reel"><div class="ph" style="aspect-ratio:9/16;max-width:200px"></div><p>The reel that showed this feature, when there is one. Fifteen seconds, the machine answering.</p></div>`)}
${sec("3.8", "The door", `<div class="doors"><a class="door" href="#"><b>Try it</b><span>the twin, opened to ${esc(r.name)}</span></a></div>`)}
</div>`;
}

/* ---------- 4. the prologue ---------- */
function prologue() {
  const P = M.prologue;
  const records = ["001 — INITIAL LAUNCH", "002 — GENERAL STATUS UPDATE", "003 — DATA RECOVERY", "004 — GENERAL STATUS UPDATE", "005 — PORTAL CONNECTION ONLINE"];
  return `${strip(4, "the prologue", "The story, one page, marked as a prologue. It holds Mike's opening and the Record's index. Nothing else in the wing tells the story.")}
${wingbar(`<b>prologue</b>`)}
<div class="page narrow">
${sec("4.1", "The mark", `<p class="mark">${esc(P.mark)}</p>`)}
${sec("4.2", P.title, `<p class="read">${esc(P.opening)}</p>`)}
${sec("4.3", "The Record", `<p class="note">${esc(P.index_note)}</p><ol class="records">${records.map(x => `<li><a href="#">Record ${esc(x)}</a></li>`).join("")}<li class="more">… one entry a day</li></ol>`, "the story's own index")}
${sec("4.4", "The way out", `<div class="doors"><a class="door" href="#front"><b>The shelf</b><span>the machines</span></a><a class="door" href="#feature"><b>What it does</b><span>the features</span></a></div>`)}
</div>`;
}

/* ---------- 5. the day's landing ---------- */
function landing() {
  const L = M.landing; const r = byId[L.feature];
  return `${strip(5, "the day's landing", "Where the daily reel sends people. The day's feature, the day's question, the machine to try. No story, no record, no artifact talk.")}
${wingbar(`today · <b>${esc(L.weekday)} ${esc(L.date)}</b>`)}
<div class="page narrow">
${sec("5.1", "Today", `<h1 class="name">${esc(r.name)}<small>day ${esc(L.day)} of the launch run</small></h1><p class="for">${esc(r.pitch)}</p>`)}
${sec("5.2", "The question", `<p class="q">${esc(L.question)}</p><p class="note">The question is shown. The answer is on the glass in the reel, and nowhere else.</p>`, "Mike's, one line")}
${sec("5.3", "The reel", `<div class="reel"><div class="ph" style="aspect-ratio:9/16;max-width:200px"></div><p>${esc(L.reel)}. Weird.Baby pops up at the end.</p></div>`)}
${sec("5.4", "Try it yourself", `<div class="doors"><a class="door" href="#"><b>Ask it</b><span>the twin, opened to ${esc(r.name)}</span></a><a class="door" href="#feature"><b>The whole page</b><span>how it works, on which units</span></a></div>`)}
${sec("5.5", "Yesterday, tomorrow", `<p class="plain"><a href="#">← ${esc(L.yesterday)}</a> · <a href="#">${esc(L.tomorrow)} →</a></p>`, "one feature a weekday")}
</div>`;
}

/* ---------- the shell ---------- */
const CSS = `
:root{--bg:#d9d5ca;--ink:#ece9e0;--soft:#e2ded3;--card:#faf8f3;--white:#fff;--border:#c6c2b7;--border-hi:#a9a59a;--black:#211f1c;--lo:#57544d;--mute:#5f5c53;--dim:#3b3933;--hair:#9b978d;--you:#6a4c93;--you-bg:#ebe4f3;
--serif:'DM Serif Display',Georgia,serif;--sans:'Syne',system-ui,sans-serif;--mono:'Courier Prime','Courier New',monospace;--read:'Fraunces','Source Serif 4',Georgia,serif;color-scheme:light}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--black);font-family:var(--read);font-size:16px;line-height:1.5}
a{color:inherit}
.tabs{position:sticky;top:0;z-index:5;display:flex;gap:4px;flex-wrap:wrap;padding:8px 12px;background:var(--you);color:#fff;font-family:var(--mono);font-size:12px}
.tabs a{color:#fff;text-decoration:none;padding:6px 10px;border-radius:3px;border:1px solid rgba(255,255,255,.35)}.tabs a.on{background:#fff;color:var(--you)}
.mock{display:none}.mock.on{display:block}
.strip{display:flex;flex-wrap:wrap;gap:6px 18px;align-items:baseline;background:var(--you-bg);color:var(--you);padding:10px 20px;font-family:var(--mono);font-size:12.5px;border-bottom:1px solid var(--border)}
.bar{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:14px 22px;font-family:var(--sans);font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.bar .home{text-decoration:none;color:var(--lo)}.bar .wing{text-decoration:none;font-weight:700;font-size:15px;letter-spacing:.2em;text-align:center}.bar .crumb{text-align:right;color:var(--lo);text-transform:none;letter-spacing:0;font-family:var(--mono)}
.page{max-width:1080px;margin:0 auto;padding:10px 22px 80px}.page.narrow{max-width:760px}
.s{margin:34px 0 0}
h2{font-family:var(--sans);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--lo);margin:0 0 12px;display:flex;align-items:baseline;gap:10px;border-bottom:1px solid var(--hair);padding-bottom:6px}
h2 .n{font-family:var(--mono);color:var(--you);letter-spacing:0}h2 small{margin-left:auto;font-family:var(--mono);text-transform:none;letter-spacing:0;color:var(--mute);font-size:11px}
h3{font-family:var(--sans);font-size:11px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 6px;color:var(--dim)}
.name{font-family:var(--serif);font-weight:400;font-size:44px;line-height:1;margin:10px 0 6px}.name small{display:block;font-family:var(--mono);font-size:12px;color:var(--mute);margin-top:8px}
.for{font-size:19px;max-width:44em;margin:0}
.paper{background:var(--white);padding:6%;box-shadow:0 1px 2px rgba(0,0,0,.25),0 8px 18px -8px rgba(0,0,0,.35)}
.paper img{display:block;width:100%;height:auto;filter:grayscale(1)}
.ph{background:repeating-linear-gradient(135deg,#bdb9ae 0 6px,#c9c5ba 6px 12px);width:100%}
.print{margin:0}.print figcaption{font-family:var(--mono);font-size:11.5px;color:var(--mute);margin-top:8px}
.shelf{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:22px}
.frame{text-decoration:none;display:block}.frame b{display:block;font-family:var(--serif);font-size:24px;margin-top:12px}.frame small{display:block;font-family:var(--mono);font-size:11px;color:var(--mute)}.frame span{display:block;margin-top:4px;color:var(--dim)}
.note{color:var(--lo);font-size:14px;margin:12px 0 0;max-width:60ch}
.today{background:var(--card);border:1px solid var(--border);padding:18px 20px;display:grid;grid-template-columns:auto 1fr auto;gap:6px 22px;align-items:center}.today .k{font-family:var(--mono);font-size:12px;color:var(--mute)}.today b{font-family:var(--serif);font-size:26px;font-weight:400}.today p{grid-column:2;margin:0;color:var(--dim)}
.btn,.door{background:var(--black);color:var(--ink);text-decoration:none;padding:10px 16px;font-family:var(--sans);font-size:12px;letter-spacing:.1em;text-transform:uppercase;display:inline-block}
.index{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:18px 28px}.index ul{list-style:none;margin:0;padding:0}.index li{display:flex;justify-content:space-between;gap:10px;padding:5px 0;border-bottom:1px dotted var(--border)}.index li em{font-family:var(--mono);font-style:normal;font-size:11px;color:var(--mute)}
.doors{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}.door{padding:16px 18px;text-transform:none;letter-spacing:0}.door b{display:block;font-family:var(--serif);font-size:22px;font-weight:400;margin-bottom:4px}.door span{display:block;font-family:var(--read);font-size:14px;opacity:.85}.door.held{background:var(--soft);color:var(--lo);border:1px solid var(--border)}
.hero{margin:0 0 14px}.hero .white{background:#fff;padding:26px;box-shadow:0 1px 2px rgba(0,0,0,.2);max-width:520px;position:relative}.hero .white img{display:block;width:100%;height:auto}.hero-ph{aspect-ratio:4/3;background:repeating-linear-gradient(135deg,#eee 0 6px,#f6f6f6 6px 12px)}.hero .tag{position:absolute;right:10px;bottom:8px;font-family:var(--mono);font-size:11px;color:#888}
.plates{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:22px}
.kit{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px}.kititem p{margin:8px 0 0;color:var(--dim);font-size:15px}
.papers{list-style:none;margin:0;padding:0}.papers li{display:grid;grid-template-columns:1fr 2fr auto;gap:14px;padding:10px 0;border-bottom:1px dotted var(--border);align-items:baseline}.papers li a{font-family:var(--sans);font-size:11px;letter-spacing:.1em;text-transform:uppercase}
.read{max-width:64ch;font-size:17px}
.glass .screen{background:#0f1a12;color:#b8f0c2;font-family:var(--mono);font-size:15px;letter-spacing:.06em;padding:22px 26px;max-width:380px;border-radius:10px;box-shadow:inset 0 0 40px rgba(0,0,0,.6),0 2px 6px rgba(0,0,0,.3);text-shadow:0 0 6px rgba(184,240,194,.6)}.glass .screen div{padding:3px 0}
.steps{font-size:17px;max-width:60ch;padding-left:1.3em}.steps li{margin:6px 0}.plain{margin:0;max-width:60ch}.plain li{margin:4px 0}
.reel{display:grid;grid-template-columns:120px 1fr;gap:18px;align-items:center;max-width:620px}.reel .ph{width:120px}.reel p{margin:0;color:var(--dim)}
.mark{font-family:var(--mono);font-size:13px;color:var(--lo);border-left:3px solid var(--hair);padding:8px 14px;margin:0}
.records{padding-left:1.4em}.records li{margin:4px 0}.records .more{list-style:none;color:var(--mute);font-family:var(--mono);font-size:12px}
.q{font-family:var(--serif);font-size:30px;line-height:1.15;margin:0 0 10px}
@media(max-width:640px){.bar{grid-template-columns:1fr 1fr}.bar .crumb{display:none}.name{font-size:34px}.today{grid-template-columns:1fr}.today p{grid-column:1}}
`;
const FONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Syne:wght@400;700&family=Courier+Prime&family=Fraunces:opsz,wght@9..144,400;9..144,500&display=swap">`;

const pages = [
  ["front", "1 · the front", front],
  ["album", "2 · the album", album],
  ["feature", "3 · the feature page", feature],
  ["prologue", "4 · the prologue", prologue],
  ["landing", "5 · the day's landing", landing],
];
const built = pages.map(([id, tab, fn]) => ({ id, tab, html: fn() }));

const tabbed = `<title>The Wing Mocks</title>${FONTS}<style>${CSS}</style>
<nav class="tabs">${built.map(p => `<a href="#${p.id}" data-t="${p.id}">${esc(p.tab)}</a>`).join("")}<a href="#" style="margin-left:auto;border:0;opacity:.8">for the sitting of ${esc(M.sitting)}</a></nav>
${built.map(p => `<div class="mock" id="m-${p.id}">${p.html}</div>`).join("")}
<script>
(function(){var tabs=[].slice.call(document.querySelectorAll('.tabs a[data-t]'));function show(id){if(!document.getElementById('m-'+id))id='front';tabs.forEach(function(a){a.classList.toggle('on',a.dataset.t===id)});[].slice.call(document.querySelectorAll('.mock')).forEach(function(m){m.classList.toggle('on',m.id==='m-'+id)});window.scrollTo(0,0)}
window.addEventListener('hashchange',function(){show(location.hash.slice(1))});show(location.hash.slice(1)||'front');})();
</script>`;

const standalone = p => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mock · ${esc(p.tab)}</title>${FONTS}<style>${CSS}.mock{display:block}</style></head><body><div class="mock on">${p.html}</div></body></html>`;

if (PHOTOS) {
  const scratch = process.env.WB_SCRATCH || path.join(process.env.TEMP || process.env.TMP || ".", "wb-mocks");
  fs.mkdirSync(scratch, { recursive: true });
  const out = path.join(scratch, "MOCKS.html");
  fs.writeFileSync(out, tabbed);
  console.log(`THE MOCKS (with sample scans, not for the repo) → ${out} · ${Math.round(tabbed.length / 1024)} KB`);
} else {
  fs.mkdirSync(OUTDIR, { recursive: true });
  fs.writeFileSync(path.join(OUTDIR, "MOCKS.html"), tabbed);
  for (const p of built) fs.writeFileSync(path.join(OUTDIR, `${p.id}.html`), standalone(p));
  console.log(`THE MOCKS — five pages · wrote docs/mocks/MOCKS.html and ${built.map(p => p.id + ".html").join(", ")}`);
}
