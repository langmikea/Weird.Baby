/* THE SHORTS BENCH — the page's own script.
   Kept as a file rather than a string in the generator: the generator's blocks
   are template literals, and a backtick inside a comment inside one closes the
   literal and breaks the parse two hundred lines away.

   TWO RULES THIS FILE OBEYS, BOTH LEARNED THE HARD WAY:
   1. NOTHING CORRECT IS BEHIND requestAnimationFrame. rAF does not fire in a
      tab that is not being painted, and an editor that draws perfectly and
      wires nothing, with no error anywhere, is what that costs. rAF drives the
      PLAY LOOP only; every draw the user asks for happens synchronously.
   2. NO CLIPBOARD API. Mike cannot use one. Saving is a real file. */
"use strict";

var CFG = window.SHORTS;             /* baked in by tools/shorts.mjs */
var $ = function (s) { return document.querySelector(s); };

/* ── state ───────────────────────────────────────────────────────────────── */
var lib = null;        /* the library: { recipes: [...] } */
var ri = 0;            /* index of the recipe being worked on */
var sel = 0;           /* selected block index */
var rangeA = null, rangeB = null;   /* block selection for play (B3) */
var playMode = "all";  /* all | one | range */
var frame = 0;
var playing = false;
var twoUp = false;
var shapeB = "1:1";
var imgs = {};         /* uid -> HTMLImageElement */
var alarm = false;

function recipe() { return lib.recipes[ri]; }

/* ═══ THE RECIPE CARRIES IDENTITY, THE PAGE CARRIES PIXELS ══════════════════
   The first build stored the whole shelf item on the block — including `href`
   (a path relative to THIS page, meaningless to a compiler) and `thumb` (a
   240px WebP data URI out of the light table's cache). Measured on a
   three-block recipe: 16,838 bytes, of which 11,865 were thumbnails. **Seventy
   per cent of the durable artifact was a rebuildable cache**, and `href` would
   have written a page-local address into the one file that must outlive the
   page.
   So a block stores what identifies the asset FOREVER — `uid` (the asset
   table's own row name, minted once, never rewritten) and `sha256` (proof of
   the bytes) — and the page looks the rest up by uid at draw time. */
var BY_UID = {};
function indexShelf() {
  BY_UID = {};
  CFG.shelf.forEach(function (g) {
    g.items.forEach(function (it) { BY_UID[it.uid] = it; });
  });
}
function durableAsset(it) {
  return { uid: it.uid, label: it.label, path: it.path, repo: it.repo,
           sha256: it.sha256, w: it.w, h: it.h };
}
/* A UID THE SHELF NO LONGER CARRIES IS REPORTED, NOT DRAWN AS A BLANK. A
   recipe outlives a shelf: a picture can be ruled out, renamed or retired
   between one session and the next, and a block pointing at one must say so. */
function shelfItem(a) { return a ? BY_UID[a.uid] || null : null; }
function thumbOf(a) { var it = shelfItem(a); return it ? it.thumb : null; }
function hrefOf(a) { var it = shelfItem(a); return it ? it.href : null; }
function isOffShelf(a) { return !!a && !BY_UID[a.uid]; }

/* ── easing, by name. The compiler must implement exactly these. ─────────── */
var EASE = {
  linear: function (t) { return t; },
  inCubic: function (t) { return t * t * t; },
  outCubic: function (t) { return 1 - Math.pow(1 - t, 3); },
  inOutCubic: function (t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },
  inOutQuad: function (t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  },
};

/* ── storage ─────────────────────────────────────────────────────────────── */
/* THE STORE IS A CONVENIENCE AND THE FILE IS THE RECORD. A refused store
   raises a red banner rather than losing an afternoon of work quietly — the
   worksheet's rule, and the reason it exists. */
function save() {
  try {
    localStorage.setItem(CFG.key, JSON.stringify(lib));
    if (alarm) { alarm = false; $(".sh-alarm").classList.remove("sh-on"); }
  } catch (e) {
    alarm = true;
    var el = $(".sh-alarm");
    el.textContent = "THIS BROWSER REFUSED TO STORE YOUR WORK (" + e.name
      + "). Nothing is being kept between reloads. Press SAVE TO THE REPO now.";
    el.classList.add("sh-on");
  }
}

function load() {
  var stored = null;
  try { stored = JSON.parse(localStorage.getItem(CFG.key) || "null"); } catch { stored = null; }
  /* THE FILE WINS WHEN IT IS NEWER. The generator bakes the last saved
     recipes.json into the page, so a wiped browser still opens on his work —
     and it says which it took rather than choosing silently. */
  var baked = CFG.baked;
  var src = "a fresh start";
  if (stored && baked && baked.saved && stored.saved && baked.saved > stored.saved) {
    lib = baked; src = "the file on disk (newer than this browser)";
  } else if (stored && stored.recipes && stored.recipes.length) {
    lib = stored; src = "this browser";
  } else if (baked && baked.recipes && baked.recipes.length) {
    lib = baked; src = "docs/shorts/recipes.json";
  } else {
    lib = JSON.parse(JSON.stringify(CFG.emptyLibrary));
    lib.recipes = [JSON.parse(JSON.stringify(CFG.emptyRecipe))];
  }
  if (!lib.recipes.length) lib.recipes = [JSON.parse(JSON.stringify(CFG.emptyRecipe))];
  status("opened from " + src, "");
}

/* ── the save bridge. A dialog once, one click after; and when the picker is
      refused it DOWNLOADS and says where the file went. A bridge that fails
      must fail into the old road, never into silence. ─────────────────────── */
var handle = null;
async function saveToRepo() {
  lib.saved = new Date().toISOString();
  var text = JSON.stringify(lib, null, 1);
  try {
    if (!handle) {
      if (!window.showSaveFilePicker) throw new Error("no picker");
      handle = await window.showSaveFilePicker({
        suggestedName: "recipes.json",
        types: [{ description: "Shorts recipes", accept: { "application/json": [".json"] } }],
      });
    }
    var w = await handle.createWritable();
    await w.write(text); await w.close();
    save();
    status("SAVED to " + handle.name + " at " + new Date().toLocaleTimeString(), "ok");
  } catch (e) {
    handle = null;
    var blob = new Blob([text], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "recipes.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    save();
    status("the save dialog was refused (" + e.name + ") — DOWNLOADED to your "
      + "Downloads folder instead. Move it to docs\\shorts\\recipes.json", "bad");
  }
}

function status(msg, cls) {
  var el = $(".sh-status");
  el.textContent = msg;
  el.className = "sh-status" + (cls ? " sh-" + cls : "");
}

/* ── images ──────────────────────────────────────────────────────────────── */
function imageFor(a) {
  if (!a) return null;
  if (imgs[a.uid]) return imgs[a.uid];
  var href = hrefOf(a);
  if (!href) return null;              /* off the shelf — paint() says so */
  var im = new Image();
  im.onload = function () { draw(); };
  /* A BROKEN SOURCE IS REPORTED, NEVER DRAWN AS A GAP. The asset table carries
     rows whose file is not on disk; the shelf already withholds them, and this
     is the second net in case one ever arrives another way. */
  im.onerror = function () {
    im.failed = true;
    status("could not load " + a.path, "bad");
    draw();
  };
  im.src = href;
  imgs[a.uid] = im;
  return im;
}

/* ── timing ──────────────────────────────────────────────────────────────── */
function fps() { return recipe().fps || 30; }
function blockFrames(b) { return Math.max(1, Math.round((b.seconds || 0) * fps())); }

/* which blocks the transport is playing (B3) */
function activeBlocks() {
  var bs = recipe().blocks;
  if (!bs.length) return [];
  if (playMode === "one") return bs[sel] ? [sel] : [];
  if (playMode === "range" && rangeA !== null && rangeB !== null) {
    var a = Math.min(rangeA, rangeB), b = Math.max(rangeA, rangeB), out = [];
    for (var i = a; i <= b; i++) if (bs[i]) out.push(i);
    return out;
  }
  return bs.map(function (_, i) { return i; });
}

function totalFrames() {
  var bs = recipe().blocks, act = activeBlocks(), n = 0;
  for (var i = 0; i < act.length; i++) n += blockFrames(bs[act[i]]);
  return Math.max(1, n);
}

/* frame -> { block, local frame } within the active set */
function locate(f) {
  var bs = recipe().blocks, act = activeBlocks(), acc = 0;
  for (var i = 0; i < act.length; i++) {
    var n = blockFrames(bs[act[i]]);
    if (f < acc + n) return { b: bs[act[i]], idx: act[i], f: f - acc, n: n };
    acc += n;
  }
  var last = act[act.length - 1];
  if (last === undefined) return null;
  return { b: bs[last], idx: last, f: blockFrames(bs[last]) - 1, n: blockFrames(bs[last]) };
}

/* ── the draw. One function, both canvases, one play head. ────────────────── */
function paint(cv, shapeKey, at) {
  var sh = CFG.shapes.filter(function (s) { return s.key === shapeKey; })[0] || CFG.shapes[0];
  var ar = sh.w / sh.h;
  /* the canvas is sized to fit its box; the RECIPE is resolution-independent */
  var boxH = Math.max(120, cv.parentNode.parentNode.clientHeight - 34);
  var boxW = Math.max(80, cv.parentNode.parentNode.clientWidth / (twoUp ? 2.25 : 1.1));
  var h = Math.min(boxH, boxW / ar), w = h * ar;
  var dpr = window.devicePixelRatio || 1;
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  cv.style.width = Math.round(w) + "px"; cv.style.height = Math.round(h) + "px";

  var g = cv.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.fillStyle = "#000"; g.fillRect(0, 0, w, h);
  if (!at || !at.b) return;

  var b = at.b, a = b.asset;
  var im = imageFor(a);
  if (!a || !im || !im.complete || im.failed || !im.naturalWidth) {
    var why = !a ? "no ingredient"
      : isOffShelf(a) ? "NOT ON THE SHELF ANY MORE"
      : (im && im.failed) ? "FILE WILL NOT LOAD" : "loading…";
    g.fillStyle = isOffShelf(a) || (im && im.failed) ? "#c4494d" : "#4a4a52";
    g.font = "12px sans-serif"; g.textAlign = "center";
    g.fillText(why, w / 2, h / 2);
    if (isOffShelf(a)) g.fillText(a.path || a.uid, w / 2, h / 2 + 16);
    return;
  }

  var u = at.n <= 1 ? 0 : at.f / (at.n - 1);
  var e = (EASE[b.ease] || EASE.linear)(u);
  var lerp = function (p, q) { return p + (q - p) * e; };
  var cx = lerp(b.from.x, b.to.x), cy = lerp(b.from.y, b.to.y);
  var sc = lerp(b.from.scale, b.to.scale), rot = lerp(b.from.rot || 0, b.to.rot || 0);

  var iw = im.naturalWidth, ih = im.naturalHeight;
  g.save();
  g.translate(w / 2, h / 2);
  if (rot) g.rotate(rot * Math.PI / 180);

  if (b.fit === "contain") {
    var k = Math.min(w / iw, h / ih) * sc;
    g.drawImage(im, -iw * k / 2, -ih * k / 2, iw * k, ih * k);
  } else {
    /* COVER: the crop rect of the SOURCE that fills the frame, then divided by
       scale — so scale is a zoom into the picture and never a change of shape */
    var baseW, baseH;
    if (iw / ih > ar) { baseH = ih; baseW = ih * ar; }
    else { baseW = iw; baseH = iw / ar; }
    var sw = baseW / sc, shh = baseH / sc;
    var sx = cx * iw - sw / 2, sy = cy * ih - shh / 2;
    sx = Math.max(0, Math.min(iw - sw, sx));
    sy = Math.max(0, Math.min(ih - shh, sy));
    g.drawImage(im, sx, sy, sw, shh, -w / 2, -h / 2, w, h);
  }
  g.restore();

  /* transitions, drawn over the top */
  var fIn = Math.round((b["in"].seconds || 0) * fps());
  var fOut = Math.round((b.out.seconds || 0) * fps());
  var cover = null;
  if (fIn > 0 && at.f < fIn) cover = { t: 1 - at.f / fIn, type: b["in"].type };
  else if (fOut > 0 && at.f >= at.n - fOut) cover = { t: (at.f - (at.n - fOut)) / fOut, type: b.out.type };
  if (cover && cover.type !== "cut") {
    g.globalAlpha = Math.max(0, Math.min(1, cover.t));
    g.fillStyle = cover.type === "flash" ? "#fff" : "#000";
    g.fillRect(0, 0, w, h);
    g.globalAlpha = 1;
  }
}

function draw() {
  var at = locate(frame);
  paint($("#shA"), recipe().shape, at);
  $("#frameB").style.display = twoUp ? "" : "none";
  if (twoUp) paint($("#shB"), shapeB, at);

  var tf = totalFrames();
  var t = (frame / fps()).toFixed(2);
  var tot = (tf / fps()).toFixed(2);
  $(".sh-clock").textContent =
    "t " + t + " / " + tot + "s\nframe " + (frame + 1) + " / " + tf
    + (at ? "\nblock " + (at.idx + 1) : "");
  var sc = $(".sh-scrub");
  sc.max = String(tf - 1);
  sc.value = String(frame);
  $("#capA").textContent = recipe().shape;
  $("#capB").textContent = shapeB;
}

/* ── transport ───────────────────────────────────────────────────────────── */
function setFrame(f) {
  var tf = totalFrames();
  frame = Math.max(0, Math.min(tf - 1, f));
  draw();                       /* synchronous — never behind rAF */
}
function step(n) { stop(); setFrame(frame + n); }

var raf = null, t0 = 0, f0 = 0;
function play() {
  if (playing) return stop();
  if (totalFrames() <= 1) return;
  playing = true; $("#play").textContent = "❚❚"; $("#play").classList.add("sh-on");
  t0 = performance.now(); f0 = frame >= totalFrames() - 1 ? 0 : frame;
  var tick = function (now) {
    if (!playing) return;
    var f = f0 + Math.floor((now - t0) / 1000 * fps());
    if (f >= totalFrames()) { setFrame(totalFrames() - 1); return stop(); }
    frame = f; draw();
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}
function stop() {
  playing = false;
  if (raf) cancelAnimationFrame(raf);
  raf = null;
  $("#play").textContent = "▶"; $("#play").classList.remove("sh-on");
}

/* ── rendering the UI ────────────────────────────────────────────────────── */
function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderBlocks() {
  var bs = recipe().blocks, act = activeBlocks(), h = "";
  for (var i = 0; i < bs.length; i++) {
    var b = bs[i], a = b.asset;
    var inR = act.indexOf(i) >= 0 && playMode !== "all";
    var th = thumbOf(a);
    h += '<button class="sh-block' + (i === sel ? " sh-sel" : "") + (inR ? " sh-inrange" : "")
      + '" data-i="' + i + '" title="' + esc(a ? a.label : "no ingredient") + '">'
      + '<span class="sh-idx">' + (i + 1) + "</span>"
      + (th ? '<img class="sh-thumb" src="' + th + '" alt="">'
        : '<span class="sh-empty">' + (a ? (isOffShelf(a) ? "off shelf" : "no thumb") : "empty") + "</span>")
      + '<span class="sh-bn">' + esc(a ? a.label : "— pick one —") + "</span>"
      + '<span class="sh-bs">' + (b.seconds || 0).toFixed(1) + "s · "
      + b.from.scale.toFixed(2) + "→" + b.to.scale.toFixed(2) + "</span>"
      + "</button>";
  }
  h += '<button class="sh-addblock" id="addBlock">+ block</button>';
  $(".sh-blocks").innerHTML = h;
  Array.prototype.forEach.call(document.querySelectorAll(".sh-block"), function (el) {
    el.onclick = function (ev) {
      var i = Number(el.dataset.i);
      if (ev.shiftKey) {
        if (rangeA === null) rangeA = sel;
        rangeB = i; playMode = "range";
      } else { sel = i; if (playMode === "one") { /* keep soloing the new one */ } }
      setFrame(0); renderAll();
    };
  });
  $("#addBlock").onclick = function () {
    var nb = JSON.parse(JSON.stringify(CFG.defaultBlock));
    nb.id = "b" + Date.now().toString(36);
    nb.asset = null;
    recipe().blocks.push(nb);
    sel = recipe().blocks.length - 1;
    save(); setFrame(0); renderAll();
  };
}

/* [2026-08-13] a `num()` helper stood here and NOTHING CALLED IT — the
   inspector builds its inputs inline. Deleted rather than wired: an unused
   builder beside a hand-built form is the next round's trap, because the two
   drift and the dead one looks authoritative. */

function renderInspector() {
  var b = recipe().blocks[sel];
  var el = $(".sh-insp");
  if (!b) { el.innerHTML = '<h3>NO BLOCK</h3><p style="color:var(--sh-dim)">Add a block, then pick an ingredient below.</p>'; return; }
  var a = b.asset;
  var opts = function (list, cur) {
    return list.map(function (o) {
      return '<option value="' + o.key + '"' + (o.key === cur ? " selected" : "") + ">" + esc(o.label) + "</option>";
    }).join("");
  };
  el.innerHTML =
    "<h3>BLOCK " + (sel + 1) + "</h3>"
    + '<div class="sh-ing">'
    + (thumbOf(a) ? '<img src="' + thumbOf(a) + '" alt="">' : '<span class="sh-none">none</span>')
    + "<div><div>" + esc(a ? a.label : "no ingredient — click one below")
    + (isOffShelf(a) ? ' <b style="color:var(--sh-red)">— NOT ON THE SHELF ANY MORE</b>' : "") + "</div>"
    + '<div style="font-size:11px;color:var(--sh-dim)">' + esc(a ? a.path : "") + "</div></div>"
    + '<button class="sh-btn" id="clearIng" style="margin-left:auto">clear</button>'
    + "</div>"
    + '<div class="sh-row">'
    + '<label style="color:var(--sh-dim)">seconds</label><input class="sh-num" style="width:70px" type="number" step="0.1" min="0.1" value="' + b.seconds + '" data-on="seconds">'
    + '<label style="color:var(--sh-dim)">ease</label><select class="sh-sel-el" style="width:auto" data-on="ease">' + opts(CFG.eases, b.ease) + "</select>"
    + '<label style="color:var(--sh-dim)">fit</label><select class="sh-sel-el" style="width:auto" data-on="fit">' + opts(CFG.fit, b.fit) + "</select>"
    + "</div>"
    + '<div class="sh-grid">'
    + "<label>&nbsp;</label><label>x</label><label>y</label><label>scale</label><label>rotate</label>"
    + "<label>FROM</label>"
    + '<input class="sh-num" type="number" step="0.01" value="' + b.from.x + '" data-on="from.x">'
    + '<input class="sh-num" type="number" step="0.01" value="' + b.from.y + '" data-on="from.y">'
    + '<input class="sh-num" type="number" step="0.01" value="' + b.from.scale + '" data-on="from.scale">'
    + '<input class="sh-num" type="number" step="1" value="' + (b.from.rot || 0) + '" data-on="from.rot">'
    + "<label>TO</label>"
    + '<input class="sh-num" type="number" step="0.01" value="' + b.to.x + '" data-on="to.x">'
    + '<input class="sh-num" type="number" step="0.01" value="' + b.to.y + '" data-on="to.y">'
    + '<input class="sh-num" type="number" step="0.01" value="' + b.to.scale + '" data-on="to.scale">'
    + '<input class="sh-num" type="number" step="1" value="' + (b.to.rot || 0) + '" data-on="to.rot">'
    + "</div>"
    + '<div class="sh-row" style="margin-top:8px">'
    + '<label style="color:var(--sh-dim)">in</label><select class="sh-sel-el" style="width:auto" data-on="in.type">' + opts(CFG.transitions, b["in"].type) + "</select>"
    + '<input class="sh-num" style="width:62px" type="number" step="0.05" min="0" value="' + b["in"].seconds + '" data-on="in.seconds">'
    + '<label style="color:var(--sh-dim)">out</label><select class="sh-sel-el" style="width:auto" data-on="out.type">' + opts(CFG.transitions, b.out.type) + "</select>"
    + '<input class="sh-num" style="width:62px" type="number" step="0.05" min="0" value="' + b.out.seconds + '" data-on="out.seconds">'
    + '<button class="sh-btn" id="dupBlock" style="margin-left:auto">duplicate</button>'
    + '<button class="sh-btn" id="delBlock">delete</button>'
    + "</div>";

  Array.prototype.forEach.call(el.querySelectorAll("[data-on]"), function (inp) {
    inp.oninput = function () {
      var path = inp.dataset.on.split("."), t = b, v = inp.value;
      if (inp.type === "number") v = parseFloat(v); if (v !== v) return;
      while (path.length > 1) t = t[path.shift()];
      t[path[0]] = v;
      save(); renderBlocks(); draw();
    };
  });
  $("#clearIng").onclick = function () { b.asset = null; save(); renderAll(); };
  $("#dupBlock").onclick = function () {
    var c = JSON.parse(JSON.stringify(b)); c.id = "b" + Date.now().toString(36);
    recipe().blocks.splice(sel + 1, 0, c); sel++; save(); setFrame(0); renderAll();
  };
  $("#delBlock").onclick = function () {
    recipe().blocks.splice(sel, 1);
    sel = Math.max(0, sel - 1);
    if (playMode !== "all") { playMode = "all"; rangeA = rangeB = null; }
    save(); setFrame(0); renderAll();
  };
}

var tab = null, find = "";
function renderShelf() {
  var groups = CFG.shelf;
  if (tab === null) tab = groups.length ? groups[0].key : null;
  $(".sh-tabs").innerHTML = groups.map(function (g) {
    return '<button class="sh-tab' + (g.key === tab ? " sh-on" : "") + '" data-k="' + g.key + '">'
      + esc(g.label) + " <span style=\"opacity:.6\">" + g.items.length + "</span></button>";
  }).join("") + '<input class="sh-find" id="find" placeholder="find…" value="' + esc(find) + '">';

  Array.prototype.forEach.call(document.querySelectorAll(".sh-tab"), function (el) {
    el.onclick = function () { tab = el.dataset.k; renderShelf(); };
  });
  var fi = $("#find");
  fi.oninput = function () { find = fi.value; renderShelf(); $("#find").focus(); };

  var g = groups.filter(function (x) { return x.key === tab; })[0];
  var items = g ? g.items : [];
  if (find.trim()) {
    var q = find.toLowerCase();
    items = [];
    groups.forEach(function (gr) {
      gr.items.forEach(function (it) {
        if ((it.label + " " + it.path).toLowerCase().indexOf(q) >= 0) items.push(it);
      });
    });
  }
  /* THE LABEL IS TRUNCATED ON THE TILE AND WHOLE IN THE TOOLTIP. At 78px a
     tile shows about ten characters, and "MGK-NIAC plate 3 of 4, and the still
     on TECHNICAL SPECIFICATIONS" becomes "MGK-NIAC p…" — which identifies
     nothing. Measured on the bench: eight photographs, six of them
     indistinguishable by their visible text. */
  $(".sh-tiles").innerHTML = items.map(function (it) {
    return '<button class="sh-tile" data-uid="' + it.uid + '" title="'
      + esc(it.label) + " — " + esc(it.path) + '">'
      + (it.thumb ? '<img src="' + it.thumb + '" alt="">'
        : '<span class="sh-empty" style="height:58px">no thumb</span>')
      + '<span class="sh-tl">' + esc(it.label) + "</span></button>";
  }).join("") || '<p style="color:var(--sh-dim)">nothing matches.</p>';

  Array.prototype.forEach.call(document.querySelectorAll(".sh-tile"), function (el) {
    el.onclick = function () {
      var it = null;
      CFG.shelf.forEach(function (gr) {
        gr.items.forEach(function (x) { if (x.uid === el.dataset.uid) it = x; });
      });
      if (!it) return;
      var bs = recipe().blocks;
      if (!bs.length) {
        var nb = JSON.parse(JSON.stringify(CFG.defaultBlock));
        nb.id = "b" + Date.now().toString(36); nb.asset = null;
        bs.push(nb); sel = 0;
      }
      bs[sel].asset = durableAsset(it);
      save(); setFrame(0); renderAll();
    };
  });
}

function renderTop() {
  $(".sh-name").value = recipe().name || "";
  $("#fps").value = String(recipe().fps);
  Array.prototype.forEach.call(document.querySelectorAll("[data-shape]"), function (el) {
    el.classList.toggle("sh-on", el.dataset.shape === recipe().shape);
  });
  $("#twoUp").classList.toggle("sh-on", twoUp);
  $("#shapeB").style.display = twoUp ? "" : "none";
  $("#pAll").classList.toggle("sh-on", playMode === "all");
  $("#pOne").classList.toggle("sh-on", playMode === "one");
  $("#pRange").classList.toggle("sh-on", playMode === "range");
  $("#pRange").textContent = playMode === "range" && rangeA !== null
    ? "range " + (Math.min(rangeA, rangeB) + 1) + "–" + (Math.max(rangeA, rangeB) + 1)
    : "range (shift-click)";
}

function renderAll() { renderTop(); renderBlocks(); renderInspector(); renderShelf(); draw(); }

/* ── wiring. Synchronous, at load, never inside rAF. ─────────────────────── */
function boot() {
  indexShelf();
  load();

  $(".sh-name").oninput = function () { recipe().name = $(".sh-name").value; save(); };
  $("#fps").onchange = function () {
    var v = parseInt($("#fps").value, 10);
    if (v > 0) { recipe().fps = v; save(); setFrame(0); draw(); }
  };
  Array.prototype.forEach.call(document.querySelectorAll("[data-shape]"), function (el) {
    el.onclick = function () { recipe().shape = el.dataset.shape; save(); renderTop(); draw(); };
  });
  $("#shapeB").onchange = function () { shapeB = $("#shapeB").value; draw(); };
  $("#twoUp").onclick = function () { twoUp = !twoUp; renderTop(); draw(); };

  $("#pAll").onclick = function () { playMode = "all"; rangeA = rangeB = null; setFrame(0); renderAll(); };
  $("#pOne").onclick = function () { playMode = "one"; setFrame(0); renderAll(); };
  $("#pRange").onclick = function () {
    if (rangeA === null) { rangeA = sel; rangeB = sel; }
    playMode = "range"; setFrame(0); renderAll();
  };

  $("#play").onclick = play;
  $("#b1").onclick = function () { step(-1); };
  $("#f1").onclick = function () { step(1); };
  $("#b10").onclick = function () { step(-10); };
  $("#f10").onclick = function () { step(10); };
  $("#home").onclick = function () { stop(); setFrame(0); };
  $(".sh-scrub").oninput = function () { stop(); setFrame(Number($(".sh-scrub").value)); };

  $("#saveRepo").onclick = saveToRepo;
  $("#newRecipe").onclick = function () {
    var r = JSON.parse(JSON.stringify(CFG.emptyRecipe));
    r.name = "untitled " + (lib.recipes.length + 1);
    lib.recipes.push(r); ri = lib.recipes.length - 1; sel = 0;
    playMode = "all"; rangeA = rangeB = null;
    save(); setFrame(0); renderAll(); renderRecipes();
  };
  $("#recipes").onchange = function () {
    ri = Number($("#recipes").value); sel = 0;
    playMode = "all"; rangeA = rangeB = null;
    setFrame(0); renderAll();
  };

  document.addEventListener("keydown", function (e) {
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (e.key === "ArrowRight") { e.preventDefault(); step(e.shiftKey ? 10 : 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); step(e.shiftKey ? -10 : -1); }
    else if (e.key === " ") { e.preventDefault(); play(); }
    else if (e.key === "Home") { e.preventDefault(); stop(); setFrame(0); }
  });
  window.addEventListener("resize", draw);

  renderRecipes();
  renderAll();

  /* AUDIT — the model's own check that every control it thinks it has found a
     node. A field the model holds and the page does not draw is the failure
     class this whole family of tools keeps hitting; it is loud here. */
  var want = ["shA", "shB", "play", "b1", "f1", "b10", "f10", "home", "fps",
    "twoUp", "shapeB", "pAll", "pOne", "pRange", "saveRepo", "newRecipe", "recipes"];
  var missing = want.filter(function (id) { return !document.getElementById(id); });
  if (missing.length) {
    alarm = true;
    var el = $(".sh-alarm");
    el.textContent = "BENCH FAULT — " + missing.length + " control(s) the script wires "
      + "are not on the page: " + missing.join(", ");
    el.classList.add("sh-on");
  }
}

function renderRecipes() {
  $("#recipes").innerHTML = lib.recipes.map(function (r, i) {
    return '<option value="' + i + '"' + (i === ri ? " selected" : "") + ">"
      + esc(r.name || "untitled") + " (" + r.blocks.length + ")</option>";
  }).join("");
}

boot();
