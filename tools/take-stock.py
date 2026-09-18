"""TAKE STOCK — every catalogue drop played once in the twin, one contact sheet each.

Plan section 2b (Families, not items): step 1 of the path, done once for everybody. This opens the
twin directly on a drop's own address (`?preset=arrive&at=<row id>`), presses the unit's own three
inputs (SCROLL, CLICK, SHAKE, and tilt where a game wants it) by a short script, and photographs
both glasses after every press. It judges nothing: the sheets are read by a person.

  python tools/take-stock.py                     every drop with a day in the catalogue
  python tools/take-stock.py --only twin.app.ink one drop
  python tools/take-stock.py --stranger          as a stranger gets it today (no parcel=all, refusals standing)

Needs the development server (npm run dev, 5173). Out: docs/desk/take-stock/<id>.png + LOG.json
"""
import sys, json, time, base64, io, pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[1]
SITE = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--site=")), "http://localhost:5173")
ONLY = next((sys.argv[i + 1] for i, a in enumerate(sys.argv) if a == "--only"), None)
STRANGER = "--stranger" in sys.argv
OUT = ROOT / "docs" / "desk" / "take-stock" / ("stranger" if STRANGER else "")
CATALOGUE = ROOT / "docs" / "CATALOGUE-20260918.json"

# a step: (action, seconds to wait after, then photograph). actions: click | scroll | shake | tilt:x | wait
PROBE = [("click", 0.6), ("wait", 2.0), ("wait", 3.0), ("shake", 1.0), ("wait", 2.5), ("wait", 4.0),
         ("click", 1.0), ("wait", 2.5), ("scroll", 0.8), ("scroll", 0.8), ("click", 1.0), ("wait", 3.0),
         ("shake", 1.0), ("wait", 3.0), ("click", 1.0), ("wait", 3.0)]
PLAYS = {}
PLAYS_FILE = ROOT / "tools" / "take-stock-plays.json"      # per drop scripts, written once the probe has been read
if PLAYS_FILE.exists():
    PLAYS = {k: [tuple(s) for s in v] for k, v in json.load(open(PLAYS_FILE, encoding="utf8")).items() if not k.startswith("_")}

STATE_JS = """() => { const g = (f) => { try { return f(); } catch (e) { return null; } };
  return { t: performance.now(), front: document.getElementById('cvFront').toDataURL('image/png'), top: document.getElementById('cvTop').toDataURL('image/png'),
    state: g(() => currentState), menu: g(() => menuNum_PTR), line: g(() => lineNum_PTR), name: g(() => String(Active_Process_Name)),
    depth: g(() => menuDepth), game: g(() => gameState_FSM), score: g(() => gameScore), m8b: g(() => M8B_currentState), powered: g(() => unitPowered) }; }"""

def png(data): return Image.open(io.BytesIO(base64.b64decode(data.split(",", 1)[1]))).convert("RGB")

def sheet(rid, name, frames, path):
    cw, pad, cols = 256, 10, 6
    try: font = ImageFont.truetype("consola.ttf", 12)
    except Exception: font = ImageFont.load_default()
    cells = []
    for f in frames:
        top, front = png(f["top"]), png(f["front"])
        top = top.resize((cw, round(cw * top.height / top.width)), Image.NEAREST); front = front.resize((cw, round(cw * front.height / front.width)), Image.NEAREST)
        c = Image.new("RGB", (cw, top.height + front.height + 6 + 30), (24, 24, 24)); c.paste(top, (0, 0)); c.paste(front, (0, top.height + 6))
        d = ImageDraw.Draw(c); y = top.height + front.height + 8
        d.text((2, y), f"{f['n']:02d} {f['act']} +{f['dt']:.1f}s", fill=(255, 220, 120), font=font)
        d.text((2, y + 14), f"{(f['name'] or '')[:22]} m{f['menu']} l{f['line']} g{f['game']} s{f['score']}", fill=(170, 170, 170), font=font)
        cells.append(c)
    ch = max(c.height for c in cells); rows = (len(cells) + cols - 1) // cols
    S = Image.new("RGB", (pad + cols * (cw + pad), 30 + rows * (ch + pad)), (0, 0, 0))
    ImageDraw.Draw(S).text((pad, 8), f"{rid}  {name}" + ("   AS A STRANGER GETS IT TODAY" if STRANGER else ""), fill=(255, 255, 255), font=font)
    for i, c in enumerate(cells): S.paste(c, (pad + (i % cols) * (cw + pad), 30 + (i // cols) * (ch + pad)))
    S.save(path)

def main():
    from playwright.sync_api import sync_playwright
    rows = [r for r in json.load(open(CATALOGUE, encoding="utf8"))["rows"] if isinstance(r.get("day"), int) and r.get("page") == "feature"]
    rows.sort(key=lambda r: r["day"])
    if ONLY: rows = [r for r in rows if r["id"] == ONLY]
    OUT.mkdir(parents=True, exist_ok=True); log = {}
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=True)
        for r in rows:
            rid = r["id"]; ctx = b.new_context(viewport={"width": 1280, "height": 900}); pg = ctx.new_page()
            errs = []; pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
            pg.goto(f"{SITE}/robots/twin.html?preset=arrive&at={rid}" + ("" if STRANGER else "&parcel=all&bist=off"), wait_until="load", timeout=60000)
            time.sleep(6.0 if rid != "twin.boot" else 1.0)      # the boot is that drop's feature: photograph it as it plays
            if not STRANGER: pg.evaluate("() => { try { REFUSED = {}; } catch (e) {} }")
            chips = pg.evaluate("() => [...document.querySelectorAll('#chips .chip')].map(e => e.innerText).slice(0, 3)")
            frames = []; t0 = time.time()
            def snap(act):
                s = pg.evaluate(STATE_JS); s["n"] = len(frames); s["act"] = act; s["dt"] = time.time() - t0; frames.append(s)
            snap("arrive")
            for act, secs in PLAYS.get(rid, PROBE):
                if act == "click": pg.evaluate("() => devShutter()")
                elif act == "scroll": pg.evaluate("() => devRotary()")
                elif act == "shake": pg.evaluate("() => devShake()")
                elif act.startswith("tilt:"): pg.evaluate(f"() => {{ tiltX = {float(act.split(':')[1])}; }}")
                time.sleep(secs); snap(act)
            sheet(rid, f"day {r['day']}  {r['name']}", frames, OUT / f"{rid}.png")
            log[rid] = {"day": r["day"], "name": r["name"], "chips": chips, "errors": errs,
                        "frames": [{k: v for k, v in f.items() if k not in ("front", "top")} for f in frames]}
            print(f"day {r['day']:>2}  {rid:<24} {len(frames)} frames  errors {len(errs)}  {chips[:1]}", flush=True)
            ctx.close()
        b.close()
    lf = OUT / "LOG.json"; old = json.load(open(lf, encoding="utf8")) if (ONLY and lf.exists()) else {}
    old.update(log); json.dump(old, open(lf, "w", encoding="utf8"), indent=1)

if __name__ == "__main__":
    main()
