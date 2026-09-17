"""THE FEATURE OF THE DAY REEL — the Portal's monitor on top, the glass close-up below.

Story: docs/FEATURE-REEL-20260916.md. Same except data: the template is this file; the data is a row
of reels/features.json (date, feature, path, play). Two halves:

  capture   drives the museum site headless (Playwright + the installed Chrome): opens the Portal's
            TERMINAL.EXE, switches ANTENNA channel 3 to CAB, RUNs, waits for the twin to settle, walks
            the menu path by pressing the Portal's own SCROLL and CLICK chyrons with a drawn cursor,
            runs the named demo script, and records three things on one clock: the monitor (CDP
            screencast frames), the front and top glass (the twin's canvases), and every press.
  assemble  cuts the reel from the capture by the story's beat table: 1080x1920, the monitor cropped
            to its bezel on top, the right glass at eight times below, the feature's name between,
            the house sound bed, the pop first.

  python tools/reels-feature.py --feature "Tilt Drive" [--capture-only | --assemble DIR] [--site URL]
"""
import sys, os, re, json, time, math, base64, pathlib, subprocess, tempfile, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[1]
SITE = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--site=")), "http://localhost:5173")
OUT = ROOT / "reels" / "out" / "features"
POP = pathlib.Path(r"C:\AI\Projects\weird-baby-robots\assets\video\WB_pop_v1.mp4")
W, H, FPS = 1080, 1920, 30
VIEW = (1280, 900)          # the browser; the CRT sits inside it
sys.path.insert(0, str(ROOT / "tools"))

# ── the demo scripts: what is done once the feature is reached. Inputs are the unit's own. ─────────
# each step: (seconds to wait after, action); actions: click | shake | tilt:x | tilt:0 | wait
PLAYS = {
    "tilt-drive": [(1.2, "wait"), (0.0, "click"), (2.0, "tilt:0.35"), (1.6, "tilt:-0.35"), (1.6, "tilt:0.35"), (1.2, "tilt:0"),
                   (0.0, "click"), (1.5, "tilt:-0.35"), (2.0, "tilt:0.35"), (1.5, "tilt:0"), (2.5, "wait")],
    "gobble": [(1.2, "wait"), (0.0, "click"), (1.5, "tilt:0.35"), (1.5, "tilt:-0.35"), (1.5, "tilt:0.35"), (1.5, "tilt:-0.35"), (1.0, "tilt:0"), (2.5, "wait")],
    "avoidsteroids": [(1.2, "wait"), (0.0, "click"), (1.2, "tilt:0.35"), (0.0, "click"), (1.2, "tilt:-0.35"), (0.0, "click"), (1.2, "tilt:0.35"),
                      (0.0, "click"), (1.2, "tilt:-0.35"), (0.0, "click"), (1.0, "tilt:0"), (2.5, "wait")],
    "snow-globe": [(1.2, "wait"), (0.0, "shake"), (2.5, "wait"), (0.0, "shake"), (3.0, "wait"), (0.0, "tilt:0.35"), (1.5, "tilt:-0.35"), (1.5, "tilt:0"), (2.0, "wait")],
    "ask": [(1.0, "wait"), (0.0, "shake"), (6.0, "wait")],
}

INIT_JS = r"""
(() => {
  const fix = v => (typeof v === 'string' && v.includes('twin.html') && !v.includes('parcel=all')) ? v + (v.includes('?') ? '&' : '?') + 'parcel=all' : v;
  const d = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
  Object.defineProperty(HTMLIFrameElement.prototype, 'src', { get() { return d.get.call(this); }, set(v) { d.set.call(this, fix(v)); }, configurable: true });
  const sa = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(n, v) { if (this.tagName === 'IFRAME' && n === 'src') v = fix(v); return sa.call(this, n, v); };
})();
"""

CURSOR_JS = r"""
() => {
  if (window.__wb) return;
  const el = document.createElement('div');
  el.id = '__wbcursor';
  el.style.cssText = 'position:fixed;left:0;top:0;width:34px;height:44px;z-index:2147483647;pointer-events:none;transform:translate(-4px,-2px);filter:drop-shadow(0 2px 3px rgba(0,0,0,.7));opacity:0;transition:opacity .25s';
  el.innerHTML = '<svg viewBox="0 0 34 44" width="34" height="44"><path d="M4 2 L4 34 L12 27 L18 41 L24 38 L18 25 L28 25 Z" fill="#fff" stroke="#111" stroke-width="2.2" stroke-linejoin="round"/></svg>';
  document.body.appendChild(el);
  const S = { x: 1180, y: 860, el };
  function put(x, y) { S.x = x; S.y = y; el.style.left = x + 'px'; el.style.top = y + 'px'; }
  put(S.x, S.y);
  window.__wb = {
    show() { el.style.opacity = '1'; }, hide() { el.style.opacity = '0'; },
    moveTo(x, y, ms) { return new Promise(res => {
      const x0 = S.x, y0 = S.y, t0 = performance.now();
      (function step(t) { let k = Math.min(1, (t - t0) / ms); k = k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2) / 2;
        put(x0 + (x - x0) * k, y0 + (y - y0) * k); if (k < 1) requestAnimationFrame(step); else res(); })(t0);
    }); },
    press() { el.style.transform = 'translate(-4px,-2px) scale(.86)'; setTimeout(() => el.style.transform = 'translate(-4px,-2px)', 120); },
    now() { return performance.now(); }, origin: performance.timeOrigin,
  };
}
"""

class Capture:
    """one session folder: shots/NNNNN.jpg (+ times), glass/NNNNN_{front,top}.png (+ times), events.json"""
    def __init__(self, folder):
        self.dir = pathlib.Path(folder); (self.dir / "shots").mkdir(parents=True, exist_ok=True); (self.dir / "glass").mkdir(exist_ok=True)
        self.shots, self.glass, self.events = [], [], []; self.n_shot = 0; self.n_glass = 0; self.origin = None; self.goff = 0.0; self.fr = None; self.pg = None
    def on_frame(self, cdp):
        def h(p):
            try: cdp.send("Page.screencastFrameAck", {"sessionId": p["sessionId"]})
            except Exception: pass
            t = p["metadata"]["timestamp"] * 1000.0 - (self.origin or 0)   # page ms
            f = self.dir / "shots" / f"{self.n_shot:05d}.jpg"; f.write_bytes(base64.b64decode(p["data"])); self.shots.append((t, f.name)); self.n_shot += 1
        return h
    def snap_glass(self):
        if self.fr is None: return
        try:
            t, a, b = self.fr.evaluate("() => [performance.now(), document.getElementById('cvFront').toDataURL('image/png'), document.getElementById('cvTop').toDataURL('image/png')]")
        except Exception: return
        n = self.n_glass; self.n_glass += 1
        (self.dir / "glass" / f"{n:05d}_front.png").write_bytes(base64.b64decode(a.split(",", 1)[1]))
        (self.dir / "glass" / f"{n:05d}_top.png").write_bytes(base64.b64decode(b.split(",", 1)[1]))
        self.glass.append((t + self.goff, n))
    def mark(self, name, **kw):
        t = self.pg.evaluate("() => performance.now()"); self.events.append({"t": t, "name": name, **kw}); print(f"  {t/1000:7.2f}s  {name} {kw if kw else ''}", flush=True); return t
    def wait(self, secs):
        """sleep, taking glass frames the whole time"""
        end = time.time() + secs
        while True:
            self.snap_glass()
            left = end - time.time()
            if left <= 0: break
            time.sleep(min(0.04, left))
    def save(self):
        json.dump({"shots": self.shots, "glass": self.glass, "events": self.events, "view": VIEW}, open(self.dir / "index.json", "w"), indent=0)

def capture(feature, path, play, folder):
    from playwright.sync_api import sync_playwright
    C = Capture(folder)
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=True)
        ctx = b.new_context(viewport={"width": VIEW[0], "height": VIEW[1]}, device_scale_factor=1)
        ctx.add_init_script(INIT_JS)   # the demo machine has every parcel; the site's own parcel=all path
        pg = ctx.new_page(); C.pg = pg
        pg.goto(SITE + "/robots", wait_until="networkidle", timeout=60000); time.sleep(1.0)
        pg.click(".cf-album:has(img[alt='The Portal'])", force=True); time.sleep(1.0)
        pg.evaluate(CURSOR_JS); C.origin = pg.evaluate("() => performance.timeOrigin")
        cdp = ctx.new_cdp_session(pg); cdp.on("Page.screencastFrame", C.on_frame(cdp))
        cdp.send("Page.startScreencast", {"format": "jpeg", "quality": 88, "maxWidth": VIEW[0], "maxHeight": VIEW[1], "everyNthFrame": 1})
        C.mark("start")
        pg.get_by_text("TERMINAL.EXE").first.click(); C.mark("terminal")
        for i in range(40):
            C.wait(0.25)
            if pg.query_selector(".pc-panel"): break
        C.mark("console"); C.wait(1.2)
        def rect(sel):
            r = pg.evaluate(f"() => {{ const e = document.querySelector({json.dumps(sel)}); if(!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width/2, r.y + r.height/2]; }}")
            if r is None: raise SystemExit(f"no element {sel}")
            return r
        def rect_text(text):
            r = pg.evaluate(f"() => {{ const e = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === {json.dumps(text)} && b.offsetParent); if(!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width/2, r.y + r.height/2]; }}")
            if r is None: raise SystemExit(f"no button {text}")
            return r
        def go(xy, ms):
            pg.evaluate(f"() => window.__wb.moveTo({xy[0]:.1f}, {xy[1]:.1f}, {ms})")
            C.wait(ms / 1000 + 0.05)
        def press(xy, name, **kw):
            pg.evaluate("() => window.__wb.press()"); pg.mouse.click(xy[0], xy[1]); C.mark(name, **kw)
        pg.evaluate("() => window.__wb.show()"); C.wait(0.3)
        ch3 = rect("button[aria-label='channel 3']"); go(ch3, 900); C.wait(0.25); press(ch3, "ch3"); C.wait(0.9)
        scroll = rect_text("SCROLL"); click = rect_text("CLICK")
        go(scroll, 650)
        for i in range(6):
            live = pg.evaluate(r"() => { const r=[...document.querySelectorAll('.pc-row')].find(e=>e.className.includes('live')); return r? r.innerText : '' }")
            if "RUN" in live: break
            press(scroll, "console-scroll"); C.wait(0.55)
        go(click, 450); press(click, "run")
        fr = None
        for i in range(40):
            C.wait(0.25); fr = next((f for f in pg.frames if "twin.html" in f.url), None)
            if fr: break
        C.goff = fr.evaluate("() => performance.timeOrigin") - C.origin   # the iframe's clock, on the page's
        C.fr = fr; C.mark("twin")
        # the twin's boot: level 2 takes ~45 s to settle (currentState 1)
        for i in range(400):
            C.wait(0.25)
            try:
                if fr.evaluate("() => String(currentState)") == "1": break
            except Exception: pass
        fr.evaluate("() => { REFUSED = {}; }")   # the demo machine: the 08-20 refusal set lifted (Sunday question 2 decides the site)
        C.mark("idle"); C.wait(0.8)
        # the chyrons moved when the twin landed (SHAKE joined them): re-measure
        scroll = rect_text("SCROLL"); click = rect_text("CLICK"); shake = rect_text("SHAKE")
        go(scroll, 700)
        # the walk: the idle menu is the leaf list; each folder's rows follow the twin's own order
        order = ["Answers", "Programs", "Messages", "Preferences"]
        def walk_to(rows, target, seg):
            i = 0
            for r in rows:
                if r == target: break
                press(scroll, "scroll", seg=seg, row=r); C.wait(0.8); i += 1
            press(click, "click", seg=seg, row=target); C.wait(1.0)
        pos = scroll
        for k, node in enumerate(path):
            rows = order if k == 0 else FOLDERS.get(path[k - 1], [node])
            if node not in rows: rows = rows + [node]
            if k > 0: go(scroll, 300)
            walk_to(rows, node, k)
        C.mark("reached", feature=feature); C.wait(1.4)
        C.mark("play")
        for secs, act in PLAYS[play]:
            if act == "click": go(click, 260); press(click, "play-click")
            elif act == "shake": go(shake, 260); press(shake, "play-shake")
            elif act.startswith("tilt:"):
                v = float(act.split(":")[1]); fr.evaluate(f"() => {{ tiltX = {v}; }}"); C.mark("tilt", x=v)
            C.wait(secs)
        fr.evaluate("() => { tiltX = 0; }")
        C.mark("end"); C.wait(0.6)
        cdp.send("Page.stopScreencast"); C.save(); b.close()
    return C

FOLDERS = {"Programs": ["Games", "Codes"], "Games": ["Tilt Drive", "Gobble Don't Fall", "AvoidSteroids", "Snow Globe", "Tic-Tac-Toe"],
           "MGK-VIIIp": ["Answers", "Predictions", "Probabilities", "Advice", "Detectors"], "Answers": ["MGK-NIAC", "MGK-v2.0", "MGK-65"],
           "Predictions": ["Fortune", "Horoscope"], "Probabilities": ["Coin Flip", "Pick a number", "Pick a card", "Roll Dice", "Lottery Numbers"],
           "Detectors": ["Bullshit Detector", "Stud Detector", "Trustworthy Detector", "Attractiveness Detector"], "Codes": ["Code Runner", "BIST", "Userdata", "Checksum"]}

def main():
    feat = next((sys.argv[i + 1] for i, a in enumerate(sys.argv) if a == "--feature"), "Tilt Drive")
    rows = json.load(open(ROOT / "reels" / "features.json", encoding="utf8"))["rows"] if (ROOT / "reels" / "features.json").exists() else []
    row = next((r for r in rows if r["feature"] == feat), None) or {"feature": feat, "path": ["Programs", "Games", feat], "play": re.sub(r"[^a-z0-9]+", "-", feat.lower()).strip("-")}
    folder = next((sys.argv[i + 1] for i, a in enumerate(sys.argv) if a == "--assemble"), None)
    if folder is None:
        folder = pathlib.Path(tempfile.gettempdir()) / "wb-feature" / re.sub(r"[^a-z0-9]+", "-", feat.lower())
        if folder.exists(): shutil.rmtree(folder)
        print(f"capture: {feat} via {row['path']} play {row['play']} -> {folder}")
        capture(feat, row["path"], row["play"], folder)
        if "--capture-only" in sys.argv: return
    from reels_feature_cut import assemble
    assemble(pathlib.Path(folder), row, OUT)

if __name__ == "__main__":
    main()
