/* tools/scroll-probe.js — PASTE THIS INTO THE CONSOLE ON THE STUCK PAGE.
   [CH8 2026-08-12]
   ---------------------------------------------------------------------------
   TWO THEORIES HAVE FAILED — per-page fixes, then scroll anchoring — and a
   third guess is not worth having. This does not propose anything. It reports
   every quantity that could hold a page 0.111px off its own top, in one line,
   so the next move is made from data instead of from a hypothesis.

   HOW TO USE IT
     1. Open the page that will not reach its top, at the zoom where it fails.
     2. Scroll up until it stops moving. LEAVE IT THERE.
     3. Open the console, paste the whole of this file, press Enter.
     4. Copy the single line it prints.

   IT MEASURES BEFORE IT TOUCHES ANYTHING. The `scrollTo(0,0)` test is last and
   its before/after are both recorded, so the reading is not destroyed by the
   act of taking it.

   WHAT EACH FIELD IS FOR — so the answer can be read without me:
     scrollY / max      the pair Mike measured. If scrollY > max, the document's
                        true extent is fractional and `scrollHeight` has rounded.
     innerH / clientH   `innerHeight` is the layout viewport INCLUDING scrollbar;
                        `documentElement.clientHeight` excludes it. At fractional
                        zoom these disagree, and which one a computation used
                        decides whether it is off by a scrollbar or by a pixel.
     vv                 THE VISUAL VIEWPORT — the thing neither of us checked.
                        `window.scrollY` is an offset in the LAYOUT viewport.
                        `visualViewport.offsetTop` is the visual viewport's own
                        offset INSIDE the layout viewport, and it is non-zero for
                        pinch-zoom and the on-screen keyboard — not for page
                        zoom, which should leave `scale: 1, offsetTop: 0`. If
                        this prints a scale that is not 1 or an offset that is
                        not 0, the 0.111 lives here and every measurement either
                        of us has taken was against the wrong viewport.
     scrollers          EVERY ancestor that can scroll, innermost first. If the
                        real scroller is an element rather than the document,
                        `window.scrollY` has been describing the wrong box all
                        along and both failed theories were aimed at the document
                        for no reason.
     htmlOv / bodyOv    computed overflow on the two elements that fight over
                        which one owns the viewport's scroll.
     after              scrollY after an explicit `scrollTo(0,0)`, sampled twice:
                        immediately, and after two animation frames. A value that
                        is 0 immediately and non-zero later is something PUTTING
                        IT BACK, which is a different bug from one that never
                        reached 0 at all. */
(() => {
  const d = document.documentElement, b = document.body, cs = getComputedStyle;
  const n = (x) => (typeof x === "number" ? +x.toFixed(4) : x);

  /* every scrollable ancestor of the deepest visible element, innermost first */
  const scrollers = [];
  for (let el = document.elementFromPoint(innerWidth / 2, innerHeight / 2); el; el = el.parentElement) {
    const s = cs(el);
    const canY = /(auto|scroll|overlay)/.test(s.overflowY);
    if (canY && el.scrollHeight > el.clientHeight + 0.5) {
      scrollers.push({
        tag: el.tagName.toLowerCase() + (el.className ? "." + String(el.className).trim().split(/\s+/)[0] : ""),
        overflowY: s.overflowY,
        scrollTop: n(el.scrollTop),
        max: n(el.scrollHeight - el.clientHeight),
      });
    }
  }

  const before = n(scrollY);
  const out = {
    url: location.pathname,
    scrollY: before,
    max: n(d.scrollHeight - innerHeight),
    maxByClient: n(d.scrollHeight - d.clientHeight),
    scrollH: n(d.scrollHeight),
    innerH: n(innerHeight),
    clientH: n(d.clientHeight),
    rectH: n(d.getBoundingClientRect().height),
    bodyRectH: n(b.getBoundingClientRect().height),
    htmlTop: n(d.getBoundingClientRect().top),
    bodyTop: n(b.getBoundingClientRect().top),
    dpr: n(devicePixelRatio),
    vv: window.visualViewport ? {
      scale: n(visualViewport.scale),
      offsetTop: n(visualViewport.offsetTop),
      pageTop: n(visualViewport.pageTop),
      height: n(visualViewport.height),
    } : "unsupported",
    htmlOv: cs(d).overflow + " / " + cs(d).overflowX + " " + cs(d).overflowY,
    bodyOv: cs(b).overflow + " / " + cs(b).overflowX + " " + cs(b).overflowY,
    snap: cs(d).scrollSnapType,
    anchor: cs(d).overflowAnchor,
    padTop: cs(d).scrollPaddingTop,
    behavior: cs(d).scrollBehavior,
    scrollers: scrollers.length ? scrollers : "none — the document is the scroller",
    snapTargets: document.querySelectorAll("*").length
      ? [...document.querySelectorAll("*")].filter((e) => {
          const a = cs(e).scrollSnapAlign; return a && a !== "none";
        }).length
      : 0,
  };

  /* the test, last, and both samples kept */
  window.scrollTo(0, 0);
  out.afterImmediate = n(scrollY);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    out.afterTwoFrames = n(scrollY);
    setTimeout(() => {
      out.afterHalfSecond = n(scrollY);
      console.log("WB-SCROLL " + JSON.stringify(out));
    }, 500);
  }));
  return "measuring — one line will print in about half a second";
})();
