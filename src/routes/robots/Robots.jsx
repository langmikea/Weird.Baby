import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* /robots — THE ROBOTS EXHIBIT, rebuilt on the museum's OWN patterns
   (walk-five, 2026-07-25; STAGED ONLY — ships at Mike's deploy sitting).
   The prior sectioned page was the real M6 gap: it did not follow the
   carousel template. Now:
   · HEADER — Weird.Baby / Robots / Gift Shop (the Gift Shop entry is
     BUILT BUT HIDDEN per the one-shop ruling — /shop is the one shop)
   · THE CAROUSEL — families AS ALBUMS on the /hr coverflow pattern
     (center-active, angled sides, arrows), order NIAC → VIIIp → NRU,
     plus the "Robots" CONCEPT ALBUM carrying the findings log.
     THE FAMILIES section folded INTO the carousel (no separate band).
   · TRACKLIST + PLAYER FRAME — the /hr tl- grammar: numbered rows,
     select-to-load; the frame holds the video slot ([PAPA] footage).
   · THE TWIN AS ARTIFACT — with a SCROLL-ATTRACT per the standard GUI
     (IntersectionObserver pulse when it enters the view).
   Print palette kept (the robots wing's established B&W identity);
   the PATTERNS are the museum's. Beacon + explicit-close overlay kept. */

const ALBUMS = [
  { id: "mgk-niac", title: "MGK-NIAC", year: "1945", status: "soon",
    tracks: [{ t: "[PAPA — family card]", note: "coming soon", video: null }] },
  { id: "mgk-viiip", title: "MGK-VIIIp", year: "1965", status: "live",
    tracks: [
      { t: "The Machine", note: "what it is, as sold", video: "[PAPA — footage slot]" },
      { t: "The Restoration", note: "how it came back", video: "[PAPA — footage slot]" },
      { t: "The Record", note: "what was found with it", video: "[PAPA — footage slot]" },
    ] },
  { id: "nru-2000", title: "NRU-2000", year: "—", status: "soon",
    tracks: [{ t: "[PAPA — family card; roster naming = draft Q1 flag]", note: "coming soon", video: null }] },
  { id: "robots", title: "Robots", year: "the concept", status: "live",
    tracks: [
      { t: "Latest findings", note: "the running log", video: "[PAPA — log entry slot]" },
      { t: "[PAPA — finding]", note: "logged as uncovered", video: null },
    ] },
];

export default function Robots() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(1);            // VIIIp front and center
  const [trackSel, setTrackSel] = useState(0);
  const [twinOpen, setTwinOpen] = useState(false);
  const [attract, setAttract] = useState(false);
  const twinRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: "/robots", referrer: document.referrer || "" }),
    }).catch(() => {});
  }, []);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setTwinOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* the scroll-attract: the artifact pulses once when it enters the view */
  useEffect(() => {
    const el = twinRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { setAttract(true); io.disconnect(); } });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const album = ALBUMS[active];
  const sel = album.tracks[Math.min(trackSel, album.tracks.length - 1)];

  const pick = (i) => { setActive(i); setTrackSel(0); };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #d9d5ca; color: #211f1c; }
        .rb-root { min-height: 100vh; opacity: 0; transition: opacity 0.9s ease; padding-bottom: 70px; }
        .rb-root.visible { opacity: 1; }
        .rb-root::after { content: ''; position: fixed; inset: 0; z-index: 950; pointer-events: none; opacity: 0.07; mix-blend-mode: multiply; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 240px 240px; }
        .rb-head { display: flex; align-items: baseline; gap: 26px; padding: 18px 28px; border-bottom: 1px solid #c6c2b7; }
        .rb-head-entry { background: none; border: none; cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: #6f6b62; }
        .rb-head-entry:hover { color: #211f1c; }
        .rb-head-here { color: #211f1c; border-bottom: 1px solid #211f1c; cursor: default; }
        .rb-head-shop { display: none; } /* [one-shop ruling] built, hidden — /shop is the one shop */
        .rb-note-band { max-width: 860px; margin: 0 auto; padding: 34px 28px 8px; }
        .rb-note { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(0.95rem, 1.3vw, 1.15rem); line-height: 1.7; color: #2b2924; }
        .rb-whisper { font-family: 'Courier Prime', monospace; font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; color: #837f75; margin-top: 10px; }
        .rb-sec-label { font-family: 'Courier Prime', monospace; font-size: 0.56rem; letter-spacing: 0.28em; text-transform: uppercase; color: #9b978d; max-width: 1060px; margin: 40px auto 0; padding: 0 28px; }
        /* THE COVERFLOW — the /hr cf- pattern in the print palette */
        .rb-cf { position: relative; height: 240px; display: flex; align-items: center; justify-content: center; perspective: 900px; perspective-origin: 50% 50%; overflow: hidden; user-select: none; margin-top: 14px; }
        .rb-cf-album { position: absolute; width: 190px; height: 190px; border: 1px solid #c6c2b7; background: #faf8f3; cursor: pointer; transition: transform .5s cubic-bezier(.25,.46,.45,.94), opacity .5s, border-color .5s; transform-style: preserve-3d; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 18px; text-align: center; }
        .rb-cf-album.on { border-color: #211f1c; box-shadow: 0 6px 24px rgba(33,31,28,0.18); }
        .rb-cf-title { font-family: 'DM Serif Display', Georgia, serif; font-size: 1.15rem; line-height: 1.2; }
        .rb-cf-year { font-family: 'Courier Prime', monospace; font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; color: #837f75; }
        .rb-cf-soon { font-family: 'Courier Prime', monospace; font-size: 0.5rem; letter-spacing: 0.2em; text-transform: uppercase; border: 1px solid #c6c2b7; padding: 2px 8px; color: #837f75; }
        .rb-cf-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: #9b978d; font-size: 1.8rem; cursor: pointer; padding: 12px; z-index: 20; line-height: 1; font-family: monospace; }
        .rb-cf-arrow:hover { color: #211f1c; }
        .rb-cf-l { left: 10px; } .rb-cf-r { right: 10px; }
        .rb-cf-dis { opacity: 0.15; pointer-events: none; }
        /* TRACKLIST + PLAYER FRAME — the /hr tl- grammar */
        .rb-stagegrid { max-width: 1060px; margin: 18px auto 0; padding: 0 28px; display: grid; grid-template-columns: 1fr 1.1fr; gap: 22px; }
        .rb-tl { border-top: 1px solid #c6c2b7; }
        .rb-tl-album { padding: 14px 2px 10px; border-bottom: 1px solid #c6c2b7; font-family: 'DM Serif Display', Georgia, serif; font-size: 1.05rem; }
        .rb-tl-track { display: flex; align-items: baseline; gap: 12px; padding: 9px 2px; border-bottom: 1px solid #d8d4c9; border-left: 2px solid transparent; cursor: pointer; transition: background .15s, border-left-color .2s; }
        .rb-tl-track:hover { background: #ece9e0; }
        .rb-tl-track.on { background: #ece9e0; border-left-color: #211f1c; padding-left: 8px; }
        .rb-tl-num { font-family: 'Courier Prime', monospace; font-size: 0.6rem; color: #9b978d; min-width: 18px; }
        .rb-tl-title { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; }
        .rb-tl-note { font-family: Georgia, serif; font-size: 0.72rem; font-style: italic; color: #837f75; flex: 1; }
        .rb-tl-log { font-family: 'Courier Prime', monospace; font-size: 0.58rem; letter-spacing: 0.14em; text-transform: uppercase; color: #837f75; padding: 12px 2px 0; }
        .rb-frame { border: 1px solid #c6c2b7; background: #0c0d10; min-height: 240px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: #837f75; }
        .rb-frame-slot { font-family: 'Courier Prime', monospace; font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: #b0aca1; }
        .rb-frame-name { font-family: 'DM Serif Display', Georgia, serif; font-size: 1rem; color: #d9d5ca; }
        /* THE ARTIFACT — the twin, with the scroll-attract */
        .rb-artifact { max-width: 1060px; margin: 8px auto 0; padding: 0 28px; }
        .rb-twin-card { border: 1px solid #211f1c; background: #faf8f3; padding: 22px; transition: box-shadow .6s; }
        .rb-twin-card.attract { animation: rb-attract 1.6s ease 1; }
        @keyframes rb-attract { 0%, 100% { box-shadow: none; } 40% { box-shadow: 0 0 0 4px rgba(33,31,28,0.25); } }
        .rb-twin-title { font-family: 'DM Serif Display', Georgia, serif; font-size: 1.4rem; margin-bottom: 8px; }
        .rb-twin-body { font-family: Georgia, serif; font-size: 0.85rem; line-height: 1.6; color: #57544d; margin-bottom: 16px; }
        .rb-btn { font-family: 'Courier Prime', monospace; font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; border: 1px solid #211f1c; background: #211f1c; color: #f5f3ec; padding: 10px 18px; cursor: pointer; }
        .rb-btn:hover { background: #3b3831; }
        .rb-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(10,10,9,0.9); display: flex; align-items: center; justify-content: center; padding: 3vh 3vw; }
        .rb-stage { width: min(96vw, 1080px); height: 92vh; background: #0b0b0a; border: 1px solid #3b3831; border-radius: 4px; position: relative; box-shadow: 0 0 60px rgba(0,0,0,0.7); }
        .rb-stage iframe { width: 100%; height: 100%; border: 0; border-radius: 4px; background: #0b0b0a; }
        .rb-close { position: absolute; top: -1px; right: -1px; z-index: 2; font-family: 'Courier Prime', monospace; font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; background: #d9d5ca; color: #211f1c; border: 1px solid #211f1c; padding: 7px 14px; cursor: pointer; }
        .rb-foot { font-family: 'Courier Prime', monospace; font-size: 0.56rem; letter-spacing: 0.2em; text-transform: uppercase; color: #9b978d; max-width: 1060px; margin: 44px auto 0; padding: 0 28px; }
        @media (max-width: 760px) { .rb-stagegrid { grid-template-columns: 1fr; } }
      `}</style>

      <div className={`rb-root ${visible ? "visible" : ""}`}>
        {/* the museum header strip: Weird.Baby / Robots / (Gift Shop hidden) */}
        <div className="rb-head">
          <button className="rb-head-entry" onClick={() => navigate("/")}>Weird.Baby</button>
          <span className="rb-head-entry rb-head-here">Robots</span>
          <button className="rb-head-entry rb-head-shop" onClick={() => navigate("/shop")}>Gift Shop</button>
        </div>

        {/* the entry note (Mike's verbatim text intact) */}
        <div className="rb-note-band">
          <p className="rb-note">
            What&rsquo;s the Greatest Enigma in the World? MGK-VIIIp That&rsquo;s
            what. A machine built to tell the future but discontinued for the
            same reason it was created! Shut down, with the purpose of being
            buried only to come back to life years later in a portable form.
            Then re-shut down only to appear in our possession? I know,
            it&rsquo;s confusing. But that&rsquo;s what Enigmas are, Intriguing.
          </p>
          <p className="rb-whisper">
            But whoever ABEAL was, whatever they did, there is no trace of
            them today. It is a true Enigma.
          </p>
        </div>

        {/* THE CAROUSEL — families as albums (NIAC, VIIIp, NRU) + the concept album */}
        <div className="rb-sec-label">The families</div>
        <div className="rb-cf">
          <button className={`rb-cf-arrow rb-cf-l ${active === 0 ? "rb-cf-dis" : ""}`}
            onClick={() => pick(Math.max(0, active - 1))} aria-label="previous">&#8249;</button>
          {ALBUMS.map((a, i) => {
            const d = i - active;
            const style = {
              transform: `translateX(${d * 150}px) translateZ(${d === 0 ? 60 : -80}px) rotateY(${d === 0 ? 0 : d < 0 ? 38 : -38}deg)`,
              opacity: Math.abs(d) > 2 ? 0 : d === 0 ? 1 : 0.65,
              zIndex: 10 - Math.abs(d),
            };
            return (
              <div key={a.id} className={`rb-cf-album ${d === 0 ? "on" : ""}`} style={style}
                onClick={() => pick(i)} role="button" tabIndex={0}
                onKeyDown={e => e.key === "Enter" && pick(i)}>
                <div className="rb-cf-title">{a.title}</div>
                <div className="rb-cf-year">{a.year}</div>
                {a.status === "soon" && <span className="rb-cf-soon">coming soon</span>}
              </div>
            );
          })}
          <button className={`rb-cf-arrow rb-cf-r ${active === ALBUMS.length - 1 ? "rb-cf-dis" : ""}`}
            onClick={() => pick(Math.min(ALBUMS.length - 1, active + 1))} aria-label="next">&#8250;</button>
        </div>

        {/* TRACKLIST + PLAYER FRAME (the /hr grammar) */}
        <div className="rb-stagegrid">
          <div className="rb-tl">
            <div className="rb-tl-album">{album.title} — the record</div>
            {album.tracks.map((t, i) => (
              <div key={i} className={`rb-tl-track ${i === trackSel ? "on" : ""}`}
                onClick={() => setTrackSel(i)} role="button" tabIndex={0}
                onKeyDown={e => e.key === "Enter" && setTrackSel(i)}>
                <span className="rb-tl-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="rb-tl-title">{t.t}</span>
                <span className="rb-tl-note">{t.note}</span>
              </div>
            ))}
            {album.id === "robots" && (
              <div className="rb-tl-log">
                Come back here for the updated log of latest findings.
              </div>
            )}
          </div>
          <div className="rb-frame">
            <div className="rb-frame-name">{sel ? sel.t : ""}</div>
            <div className="rb-frame-slot">{sel && sel.video ? sel.video : "— no footage on file —"}</div>
          </div>
        </div>

        {/* THE ARTIFACT — the twin (scroll-attract per the standard GUI) */}
        <div className="rb-sec-label">The artifacts</div>
        <div className="rb-artifact" ref={twinRef}>
          <div className={`rb-twin-card ${attract ? "attract" : ""}`}>
            <div className="rb-twin-title">The machine itself</div>
            <div className="rb-twin-body">
              A working digital twin of the MGK-VIIIp — the machine as it
              runs today. It answers. It is not always right.
            </div>
            <button className="rb-btn" onClick={() => setTwinOpen(true)}>
              Run the machine
            </button>
          </div>
        </div>

        <div className="rb-foot">
          We&rsquo;ll keep you posted with updates as we uncover more.
        </div>
      </div>

      {/* [W2 walk-four] explicit close ONLY — the button or Escape. */}
      {twinOpen && (
        <div className="rb-overlay">
          <div className="rb-stage">
            <button className="rb-close" onClick={() => setTwinOpen(false)}>Close ✕</button>
            <iframe src="/robots/twin.html?user=1" title="MGK-VIIIp digital twin" />
          </div>
        </div>
      )}
    </>
  );
}
