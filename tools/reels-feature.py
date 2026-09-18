"""THE FEATURE OF THE DAY REEL — the Portal's monitor on top, the glass close-up below.

Story: docs/FEATURE-REEL-20260916.md. Same except data: the template is this file; the data is a row
of reels/features.json (date, feature, path, play). Two halves:

  capture   drives the museum site headless (Playwright + the installed Chrome): opens the Portal's
            TERMINAL.EXE, switches ANTENNA channel 3 to CAB, RUNs, waits for the twin to settle, walks
            the menu path by pressing the Portal's own SCROLL and CLICK chyrons (each blinks as it is pressed),
            runs the named demo script, and records three things on one clock: the monitor (CDP
            screencast frames), the front and top glass (the twin's canvases), and every press.
  assemble  cuts the reel from the capture by the story's beat table: 1080x1920, the monitor cropped
            to its bezel on top, the right glass at eight times below, the feature's name between,
            the house sound bed, the pop first.

  python tools/reels-feature.py --feature "Tilt Drive" [--capture-only | --assemble DIR] [--site URL]
"""
import sys, os, re, json, time, math, base64, pathlib, subprocess, tempfile, shutil, importlib
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[1]
SITE = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--site=")), "http://localhost:5173")
OUT = ROOT / "reels" / "out" / "features"
POP = pathlib.Path(r"C:\AI\Projects\weird-baby-robots\assets\video\WB_pop_v1.mp4")
W, H, FPS = 1080, 1920, 30
ROW_Y0, ROW_Y1 = 24, 32      # the selected menu row on the front glass, in the driver's 32 rows (measured from a capture)
VIEW = (1280, 900)          # the browser; the CRT sits inside it
sys.path.insert(0, str(ROOT / "tools"))

# ── the demo scripts: what is done once the feature is reached. Inputs are the unit's own. ─────────
# each step: (seconds to wait after, action); actions: click | shake | tilt:x | tilt:0 | wait
QUESTION_S = 3.0      # how long the adult takes to ask (set by main from the row's question before the capture)
PLAYS = {
    "tilt-drive": [(1.0, "wait"), (0.0, "click"), (48.0, "autopilot"), (9.0, "collide"), (2.5, "wait")],
    "gobble": [(1.2, "wait"), (0.0, "click"), (1.5, "tilt:0.35"), (1.5, "tilt:-0.35"), (1.5, "tilt:0.35"), (1.5, "tilt:-0.35"), (1.0, "tilt:0"), (2.5, "wait")],
    "avoidsteroids": [(1.2, "wait"), (0.0, "click")] + [(0.9, "tilt:0.35"), (0.0, "click"), (0.9, "tilt:-0.35"), (0.0, "click")] * 14 + [(0.0, "tilt:0"), (8.0, "wait")],
    "snow-globe": [(1.2, "wait"), (0.0, "shake"), (2.5, "wait"), (0.0, "shake"), (3.0, "wait"), (0.0, "tilt:0.35"), (1.5, "tilt:-0.35"), (1.5, "tilt:0"), (2.0, "wait")],
    "ask": [(0.0, "ask")],      # the whole ask is one act, paced by the machine's own states (below)
}

INIT_JS = r"""
(() => {
  const fix = v => (typeof v === 'string' && v.includes('twin.html') && !v.includes('parcel=all')) ? v + (v.includes('?') ? '&' : '?') + 'parcel=all&bist=off' : v;
  const d = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
  Object.defineProperty(HTMLIFrameElement.prototype, 'src', { get() { return d.get.call(this); }, set(v) { d.set.call(this, fix(v)); }, configurable: true });
  const sa = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(n, v) { if (this.tagName === 'IFRAME' && n === 'src') v = fix(v); return sa.call(this, n, v); };
})();
"""

PAGE_JS = r"""
() => {
  if (window.__wb) return;
  const st = document.createElement('style');
  st.textContent = '.wb-on{background:#fff!important;color:#000!important;border-color:#fff!important} .wb-on *{color:#000!important}';
  document.head.appendChild(st);
  window.__wb = { blink(el, ms) { el.classList.add('wb-on'); setTimeout(() => el.classList.remove('wb-on'), ms); }, now() { return performance.now(); } };
}
"""

class Capture:
    """one session folder: shots/NNNNN.jpg (+ times), glass/NNNNN_{front,top}.png (+ times), events.json"""
    def __init__(self, folder):
        self.dir = pathlib.Path(folder); (self.dir / "shots").mkdir(parents=True, exist_ok=True); (self.dir / "glass").mkdir(exist_ok=True)
        self.shots, self.glass, self.events = [], [], []; self.n_shot = 0; self.n_glass = 0; self.origin = None; self.goff = 0.0; self.fr = None; self.pg = None; self.game_state = -1
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
            t, a, b, gs, sc, passed, m8b = self.fr.evaluate("() => [performance.now(), document.getElementById('cvFront').toDataURL('image/png'), document.getElementById('cvTop').toDataURL('image/png'), (typeof gameState_FSM==='undefined'?-1:gameState_FSM), (typeof gameScore==='undefined'?0:gameScore), (window.__passed||0), (typeof M8B_currentState==='undefined'?-1:M8B_currentState)]")
        except Exception: return
        n = self.n_glass; self.n_glass += 1
        if m8b != getattr(self, "m8b_state", -1):
            # the ask's own states (twin.html M8B_Answers_EXE): 2 = the ask card is up, waiting for the shake; 3 = revealing; 5 = the answer holds
            name = {2: "ask-card", 3: "reveal", 5: "answer"}.get(m8b)
            if name: self.events.append({"t": t + self.goff, "name": name}); print(f"  {(t + self.goff)/1000:7.2f}s  {name}", flush=True)
            self.m8b_state = m8b
        if gs != self.game_state:
            if gs == 2: self.events.append({"t": t + self.goff, "name": "gameover", "score": sc}); print(f"  {(t + self.goff)/1000:7.2f}s  gameover score {sc}", flush=True)
            if gs == 1 and self.game_state != 1: self.events.append({"t": t + self.goff, "name": "gamerun"})
            self.game_state = gs
        (self.dir / "glass" / f"{n:05d}_front.png").write_bytes(base64.b64decode(a.split(",", 1)[1]))
        (self.dir / "glass" / f"{n:05d}_top.png").write_bytes(base64.b64decode(b.split(",", 1)[1]))
        self.glass.append((t + self.goff, n, sc, passed))
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
        json.dump({"shots": self.shots, "glass": self.glass, "events": self.events, "view": VIEW, "rects": getattr(self, "rects", {})}, open(self.dir / "index.json", "w"), indent=0)

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
        pg.evaluate(PAGE_JS); C.origin = pg.evaluate("() => performance.timeOrigin")
        cdp = ctx.new_cdp_session(pg); cdp.on("Page.screencastFrame", C.on_frame(cdp))
        cdp.send("Page.startScreencast", {"format": "jpeg", "quality": 88, "maxWidth": VIEW[0], "maxHeight": VIEW[1], "everyNthFrame": 1})
        C.mark("start")
        pg.get_by_text("TERMINAL.EXE").first.click(); C.mark("terminal")
        for i in range(40):
            C.wait(0.25)
            if pg.query_selector(".pc-panel"): break
        C.mark("console"); C.wait(1.2)
        def btn(text):
            h = pg.evaluate(f"() => {{ const e = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === {json.dumps(text)} && b.offsetParent); if(!e) return null; e.id = e.id || ('wb_' + {json.dumps(text)}); return e.id; }}")
            if h is None: raise SystemExit(f"no button {text}")
            return "#" + h
        def press(sel, name, **kw):
            pg.evaluate(f"() => window.__wb.blink(document.querySelector({json.dumps(sel)}), {320 if name == 'scroll' else (900 if name == 'play-shake' else 140)})")   # SHAKE stays lit for the shake's own length
            pg.click(sel); C.mark(name, **kw)
        # the console (not in the reel): channel 3 to CAB, then RUN
        press("button[aria-label='channel 3']", "ch3"); C.wait(0.5)
        for i in range(6):
            live = pg.evaluate(r"() => { const r=[...document.querySelectorAll('.pc-row')].find(e=>e.className.includes('live')); return r? r.innerText : '' }")
            if "RUN" in live: break
            press(btn("SCROLL"), "console-scroll"); C.wait(0.45)
        press(btn("CLICK"), "run")
        fr = None
        for i in range(40):
            C.wait(0.25); fr = next((f for f in pg.frames if "twin.html" in f.url), None)
            if fr: break
        C.goff = fr.evaluate("() => performance.timeOrigin") - C.origin   # the iframe's clock, on the page's
        C.fr = fr; C.mark("twin")
        C.rects = {}
        for i in range(400):
            C.wait(0.25)
            try:
                if fr.evaluate("() => String(currentState)") == "1": break
            except Exception: pass
        off = pg.evaluate("() => { const r = document.querySelector('iframe').getBoundingClientRect(); return [r.x, r.y]; }")
        for cid in ("cvFront", "cvTop"):
            r = fr.evaluate(f"() => {{ const r = document.getElementById('{cid}').getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }}")
            C.rects[cid] = [r[0] + off[0], r[1] + off[1], r[2], r[3]]
        print("  glass on the page:", C.rects, flush=True)
        fr.evaluate("() => { REFUSED = {}; }")   # the demo machine: the 08-20 refusal set lifted (Sunday question 2 decides the site)
        C.mark("idle"); C.wait(0.8)
        scroll, click, shake = btn("SCROLL"), btn("CLICK"), btn("SHAKE")
        # the walk: someone who knows where they are going (Mike, note 2): a press every third of a second
        order = ["Answers", "Programs", "Messages", "Preferences"]
        BEAT = 0.6
        def flash(sel, times, mark):
            """the click as Mike choreographed it: the chyron lit and the row in reverse video together, a beat; the
            silent click enters. On the payload the flash repeats."""
            ms = 420 if times == 1 else 170
            # the selected row sits one row higher on the ASK level (the twin's Draw_the_Menu_Line: Row_02 there, Row_03 elsewhere)
            y0 = 13 if fr.evaluate("() => (typeof ANSWERS!=='undefined' && menuNum_PTR===ANSWERS)") else ROW_Y0
            pg.evaluate(f"() => window.__wb.blink(document.querySelector({json.dumps(sel)}), {ms * (2 * times - 1)})")
            fr.evaluate(f"() => Demo_Flash({y0}, {y0 + (ROW_Y1 - ROW_Y0)}, {ms * (2 * times - 1)}, {ms})")
            C.mark(mark); C.wait(ms * (2 * times - 1) / 1000 + 0.05)
            pg.click(sel); C.mark("click", **{"seg": mark, "row": "enter"}); C.wait(BEAT)
        for k, node in enumerate(path):
            rows = order if k == 0 else FOLDERS.get(path[k - 1], [node])
            if node not in rows: rows = rows + [node]
            for r in rows:
                if r == node: break
                press(scroll, "scroll", seg=k, row=r); C.wait(0.7)
            C.wait(BEAT)                                                    # arrive at the row, a beat
            flash(click, 3 if k == len(path) - 1 else 1, f"flash-{k}")     # the click, as choreographed
        C.mark("reached", feature=feature); C.wait(1.4)
        C.mark("play")
        for secs, act in PLAYS[play]:
            if act == "click": press(click, "play-click")
            elif act == "shake": press(shake, "play-shake")
            elif act.startswith("tilt:"):
                v = float(act.split(":")[1]); fr.evaluate(f"() => Portal_Tilt_Set({{up: true, left: {str(v < 0).lower()}, right: {str(v > 0).lower()}}})"); C.mark("tilt", x=v)
            elif act == "drive":
                # good driving for `secs` seconds: weave between lanes, restart at once if the road wins early
                t_end = time.time() + secs; k = 0
                while time.time() < t_end:
                    v = 0.32 if k % 2 == 0 else -0.32; fr.evaluate(f"() => {{ tiltX = {v}; }}"); C.wait(0.42); k += 1
                    if fr.evaluate("() => gameState_FSM") == 2: C.wait(1.2); press(click, "play-click"); C.wait(0.6)
                fr.evaluate("() => { tiltX = 0; }"); continue
            elif act == "autopilot":
                # the car reads the road: the free lane ahead of every car, steered against the curve; a run that
                # ends early is restarted, so the reel gets one long run before the mistake
                fr.evaluate("""() => { if (window.__ap) clearInterval(window.__ap);
                  window.__passed = 0; window.__seen = new Set(); let cur = {up: true, down: false, left: false, right: false};
                  let heldSince = performance.now(), gasOffUntil = 0, nextGasOff = performance.now() + 4000 + Math.random() * 3000, brakeUntil = 0;
                  Portal_Tilt_Set(cur);
                  window.__ap = setInterval(() => {
                    if (typeof TD === 'undefined' || !TD || gameState_FSM !== 1) return;
                    const now = performance.now();
                    for (const o of TD.obs) window.__seen.add(o);
                    for (const o of Array.from(window.__seen)) if (!TD.obs.includes(o)) { window.__seen.delete(o); window.__passed++; }
                    const lanes = [-1, 0, 1]; const busy = new Set();
                    for (const o of TD.obs) if (o.t > 0.12 && o.t < 1.08) busy.add(o.lane);
                    let lane = Math.round(TD.x / 0.912); lane = Math.max(-1, Math.min(1, lane));
                    let target = lane;
                    if (busy.has(lane)) { const free = lanes.filter(l => !busy.has(l)).sort((a, b) => Math.abs(a - lane) - Math.abs(b - lane)); target = free.length ? free[0] : lane; }
                    const err = target * 0.912 - TD.x + TD.curve * 0.18;
                    // damped: a steering decision holds at least a quarter second; the gas eases off now and then; a brake tap
                    if (now > nextGasOff) { gasOffUntil = now + 500; nextGasOff = now + 4500 + Math.random() * 3000; if (Math.random() < 0.5) brakeUntil = now + 250; }
                    const want = {up: now > gasOffUntil, down: now < brakeUntil, left: err < -0.05, right: err > 0.05};
                    const steerChanged = want.left !== cur.left || want.right !== cur.right;
                    if (steerChanged && now - heldSince < 250) { want.left = cur.left; want.right = cur.right; }
                    if (want.left !== cur.left || want.right !== cur.right) heldSince = now;
                    if (want.up !== cur.up || want.down !== cur.down || want.left !== cur.left || want.right !== cur.right) { cur = want; Portal_Tilt_Set(cur); }
                  }, 30); }""")
                C.mark("autopilot"); t_end = time.time() + secs
                while time.time() < t_end:
                    C.wait(0.4)
                    if fr.evaluate("() => gameState_FSM") == 2: C.mark("early-end"); C.wait(1.0); press(click, "play-click"); C.wait(0.5)
                continue
            elif act == "collide":
                fr.evaluate("() => { if (window.__ap) { clearInterval(window.__ap); window.__ap = null; } Portal_Tilt_Set({up: true}); }"); C.mark("mistake")
                # hold the lane and let the traffic come; if the run had ended early, start again first
                for attempt in range(3):
                    if fr.evaluate("() => gameState_FSM") == 2: C.wait(1.0); press(click, "play-click"); C.wait(0.5)
                    C.mark("hold-lane")
                    for i in range(int(secs / 0.1)):
                        C.wait(0.1)
                        if fr.evaluate("() => gameState_FSM") == 2: break
                    x = fr.evaluate("() => (typeof TD!=='undefined' && TD) ? TD.x : null")
                    C.mark("collision" if x is not None and abs(x) < 1.3 else "off-road", x=x)
                    if x is not None and abs(x) < 1.3: break
                continue
            elif act == "ask":
                # the machine's card (Ask question, then shake) arrives after its own redirect, static and bubbles; wait for it
                def until(state, limit):
                    t_end = time.time() + limit
                    while time.time() < t_end:
                        C.wait(0.1)
                        if fr.evaluate("() => (typeof M8B_currentState==='undefined'?-1:M8B_currentState)") == state: return True
                    return False
                if not until(2, 15): print("  the ask card never came", flush=True)
                C.wait(0.8); C.mark("question"); C.wait(QUESTION_S + 0.6)      # the adult asks; the words are the reel's, laid on at the cut
                press(shake, "play-shake")
                if not until(5, 8): print("  the answer never landed", flush=True)
                C.wait(3.2); continue
            elif act == "crash":
                # hold the wheel over until the road ends it
                fr.evaluate("() => { tiltX = 0.4; }"); C.mark("tilt", x=0.4)
                for i in range(int(secs / 0.1)):
                    C.wait(0.1)
                    if fr.evaluate("() => gameState_FSM") == 2: break
                fr.evaluate("() => { tiltX = 0; }"); continue
            C.wait(secs)
        fr.evaluate("() => { Portal_Tilt_Set({}); }")
        C.mark("end"); C.wait(0.6)
        cdp.send("Page.stopScreencast"); C.save(); b.close()
    return C

FOLDERS = {"Programs": ["Games", "Codes"], "Games": ["Tilt Drive", "Gobble Don't Fall", "AvoidSteroids", "Snow Globe", "Tic-Tac-Toe"],
           "MGK-VIIIp": ["Answers", "Predictions", "Probabilities", "Advice", "Detectors"], "Answers": ["ASK MGK", "Predictions", "Probabilities", "Advice", "Detectors"],
           "ASK MGK": ["MGK-NIAC", "MGK-v2.0", "MGK-65"],   # the twin's Answers row opens a list headed ASK MGK (probed 09-18): three clicks reach an engine
           "Predictions": ["Fortune", "Horoscope"], "Probabilities": ["Coin Flip", "Pick a number", "Pick a card", "Roll Dice", "Lottery Numbers"],
           "Detectors": ["Bullshit Detector", "Stud Detector", "Trustworthy Detector", "Attractiveness Detector"], "Codes": ["Code Runner", "BIST", "Userdata", "Checksum"]}

def main():
    feat = next((sys.argv[i + 1] for i, a in enumerate(sys.argv) if a == "--feature"), "Tilt Drive")
    rows = json.load(open(ROOT / "reels" / "features.json", encoding="utf8"))["rows"] if (ROOT / "reels" / "features.json").exists() else []
    row = next((r for r in rows if r["feature"] == feat), None) or {"feature": feat, "path": ["Programs", "Games", feat], "play": re.sub(r"[^a-z0-9]+", "-", feat.lower()).strip("-")}
    if row.get("story") == "ask":
        global QUESTION_S
        VOICE = importlib.import_module("reels-voice"); y, _ = VOICE.render_timed(row.get("question") or "Will it rain on the parade?")
        QUESTION_S = len(y) / VOICE.SR
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
