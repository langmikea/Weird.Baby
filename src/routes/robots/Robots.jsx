import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* /robots — THE ROBOTS EXHIBIT (M6 build, 2026-07-24; STAGED ONLY — ships
   at Mike's deploy sitting). The landing page ABSORBED as the entry band
   (its Mike-verbatim text intact). Surface per the exhibit endgame doctrine
   + DRAFT-families-data-model-20260724.md:
   · FAMILIES CAROUSEL — VIIIp live; NIAC + NRU as coming-soon (the draft's
     Q1 roster flag stands; grain provisional per R2)
   · TRACKLIST FRAME — CHAPTERS grain (draft Q2, provisional; the
     never-advertised law prefers chapters over a public persona list);
     video slots = [PAPA] placeholders
   · ARTIFACTS — THE TWIN ON THE PAGE: pop-over overlay (the
     single-page-exhibit debt PAID — no new tab), museum-ink stage,
     day-one parcel state per J7 (a fresh visitor meets the day-one machine)
   · GIFT SHOP STUB on the WB pattern — [PAPA] throughout
   B&W print grammar; first-party beacon kept. */

const FAMILIES = [
  { id: "mgk-viiip", title: "MGK-VIIIp", year: "1965", status: "live",
    blurb: "The portable enigma. Restored, running, and answering." },
  { id: "mgk-niac", title: "MGK-NIAC", year: "1945", status: "soon",
    blurb: "[PAPA — family card]" },
  { id: "nru-2000", title: "NRU-2000", year: "—", status: "soon",
    blurb: "[PAPA — family card; roster naming = draft Q1 flag]" },
];

const CHAPTERS = [
  { title: "The Machine", note: "what it is, as sold", video: "[PAPA — footage slot]" },
  { title: "The Restoration", note: "how it came back", video: "[PAPA — footage slot]" },
  { title: "The Record", note: "what was found with it", video: "[PAPA — footage slot]" },
];

const MERCH = [
  { title: "[PAPA — print]", price: "—" },
  { title: "[PAPA — shirt]", price: "—" },
  { title: "[PAPA — the manual, reprinted]", price: "—" },
];

export default function Robots() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [family, setFamily] = useState("mgk-viiip");
  const [twinOpen, setTwinOpen] = useState(false);

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

  const fam = FAMILIES.find(f => f.id === family);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #d9d5ca; color: #211f1c; }
        .rb-root { min-height: 100vh; opacity: 0; transition: opacity 0.9s ease; padding-bottom: 60px; }
        .rb-root.visible { opacity: 1; }
        .rb-root::after { content: ''; position: fixed; inset: 0; z-index: 950; pointer-events: none; opacity: 0.07; mix-blend-mode: multiply; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 240px 240px; }
        .rb-band { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #c6c2b7; }
        .rb-left { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border-right: 1px solid #c6c2b7; background: #ece9e0; position: relative; }
        .rb-left::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 60%, #f7f5ee 0%, transparent 70%); pointer-events: none; }
        .rb-title { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(2.2rem, 4vw, 3.4rem); letter-spacing: 0.02em; z-index: 1; }
        .rb-tagline { font-family: 'Courier Prime', monospace; font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: #57544d; margin-top: 18px; z-index: 1; animation: rb-blink 3s step-end infinite; }
        @keyframes rb-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        .rb-dir { margin-top: 34px; z-index: 1; width: min(300px, 80%); }
        .rb-dir-entry { display: flex; justify-content: space-between; align-items: baseline; width: 100%; padding: 9px 2px; background: none; border: none; border-top: 1px solid #c6c2b7; cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: #6f6b62; transition: color 0.3s; }
        .rb-dir-entry:last-child { border-bottom: 1px solid #c6c2b7; }
        .rb-dir-entry:hover { color: #211f1c; }
        .rb-right { display: flex; flex-direction: column; justify-content: center; padding: 48px 52px; }
        .rb-note { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(1rem, 1.35vw, 1.25rem); line-height: 1.75; color: #2b2924; margin-bottom: 14px; }
        .rb-whisper { font-family: 'Courier Prime', monospace; font-size: 0.63rem; letter-spacing: 0.16em; text-transform: uppercase; color: #837f75; }
        .rb-sec { max-width: 1060px; margin: 0 auto; padding: 44px 28px 0; }
        .rb-sec-label { font-family: 'Courier Prime', monospace; font-size: 0.56rem; letter-spacing: 0.28em; text-transform: uppercase; color: #9b978d; margin-bottom: 16px; }
        .rb-carousel { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 6px; }
        .rb-card { min-width: 240px; border: 1px solid #c6c2b7; background: #faf8f3; border-radius: 1px; padding: 18px; cursor: pointer; text-align: left; }
        .rb-card.active { border-color: #211f1c; }
        .rb-card.soon { opacity: 0.55; cursor: default; }
        .rb-card-title { font-family: 'DM Serif Display', Georgia, serif; font-size: 1.3rem; }
        .rb-card-year { font-family: 'Courier Prime', monospace; font-size: 0.56rem; letter-spacing: 0.2em; color: #837f75; margin: 6px 0 10px; text-transform: uppercase; }
        .rb-card-blurb { font-family: Georgia, serif; font-size: 0.8rem; line-height: 1.5; color: #57544d; }
        .rb-soon-chip { display: inline-block; font-family: 'Courier Prime', monospace; font-size: 0.5rem; letter-spacing: 0.2em; text-transform: uppercase; border: 1px solid #c6c2b7; padding: 2px 8px; margin-top: 10px; color: #837f75; }
        .rb-track { border-top: 1px solid #c6c2b7; }
        .rb-track-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; padding: 12px 2px; border-bottom: 1px solid #c6c2b7; align-items: baseline; }
        .rb-track-title { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; }
        .rb-track-note { font-family: Georgia, serif; font-size: 0.75rem; color: #837f75; font-style: italic; }
        .rb-track-video { font-family: 'Courier Prime', monospace; font-size: 0.55rem; letter-spacing: 0.14em; text-transform: uppercase; color: #b0473a; }
        .rb-artifact { display: flex; gap: 18px; flex-wrap: wrap; }
        .rb-twin-card { flex: 1 1 340px; border: 1px solid #211f1c; background: #faf8f3; padding: 22px; border-radius: 1px; }
        .rb-twin-title { font-family: 'DM Serif Display', Georgia, serif; font-size: 1.4rem; margin-bottom: 8px; }
        .rb-twin-body { font-family: Georgia, serif; font-size: 0.85rem; line-height: 1.6; color: #57544d; margin-bottom: 16px; }
        .rb-btn { font-family: 'Courier Prime', monospace; font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; border: 1px solid #211f1c; background: #211f1c; color: #f5f3ec; padding: 10px 18px; cursor: pointer; }
        .rb-btn:hover { background: #3b3831; }
        .rb-shop { display: flex; gap: 14px; flex-wrap: wrap; }
        .rb-merch { min-width: 200px; border: 1px dashed #9b978d; padding: 16px; font-family: 'Courier Prime', monospace; font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; color: #837f75; }
        .rb-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(10,10,9,0.9); display: flex; align-items: center; justify-content: center; padding: 3vh 3vw; }
        .rb-stage { width: min(96vw, 1080px); height: 92vh; background: #0b0b0a; border: 1px solid #3b3831; border-radius: 4px; position: relative; box-shadow: 0 0 60px rgba(0,0,0,0.7); }
        .rb-stage iframe { width: 100%; height: 100%; border: 0; border-radius: 4px; background: #0b0b0a; }
        .rb-close { position: absolute; top: -1px; right: -1px; z-index: 2; font-family: 'Courier Prime', monospace; font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; background: #d9d5ca; color: #211f1c; border: 1px solid #211f1c; padding: 7px 14px; cursor: pointer; }
        .rb-foot { font-family: 'Courier Prime', monospace; font-size: 0.56rem; letter-spacing: 0.2em; text-transform: uppercase; color: #9b978d; max-width: 1060px; margin: 44px auto 0; padding: 0 28px; }
        @media (max-width: 760px) { .rb-band { grid-template-columns: 1fr; } .rb-left { border-right: none; border-bottom: 1px solid #c6c2b7; } }
      `}</style>

      <div className={`rb-root ${visible ? "visible" : ""}`}>
        {/* the absorbed landing = the exhibit's entry band (Mike's verbatim text intact) */}
        <div className="rb-band">
          <div className="rb-left">
            <div className="rb-title">Robots</div>
            <div className="rb-tagline">Purveyors of the Weird.Baby.</div>
            <nav className="rb-dir" aria-label="Robots directory">
              <button className="rb-dir-entry" onClick={() => setTwinOpen(true)}>
                <span>Run the machine</span><span>→</span>
              </button>
              <button className="rb-dir-entry" onClick={() => navigate("/")}>
                <span>Back to the lobby</span><span>→</span>
              </button>
            </nav>
          </div>
          <div className="rb-right">
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
        </div>

        {/* THE FAMILIES CAROUSEL (draft Q1 roster flag stands; provisional per R2) */}
        <section className="rb-sec">
          <div className="rb-sec-label">The families</div>
          <div className="rb-carousel">
            {FAMILIES.map(f => (
              <button key={f.id}
                className={`rb-card ${f.id === family ? "active" : ""} ${f.status === "soon" ? "soon" : ""}`}
                onClick={() => f.status === "live" && setFamily(f.id)}
                disabled={f.status !== "live"}>
                <div className="rb-card-title">{f.title}</div>
                <div className="rb-card-year">{f.year}</div>
                <div className="rb-card-blurb">{f.blurb}</div>
                {f.status === "soon" && <span className="rb-soon-chip">coming soon</span>}
              </button>
            ))}
          </div>
        </section>

        {/* THE TRACKLIST FRAME (chapters grain — draft Q2 provisional; video = [PAPA]) */}
        {fam && fam.status === "live" && (
          <section className="rb-sec">
            <div className="rb-sec-label">{fam.title} — the record</div>
            <div className="rb-track">
              {CHAPTERS.map(c => (
                <div className="rb-track-row" key={c.title}>
                  <div>
                    <div className="rb-track-title">{c.title}</div>
                    <div className="rb-track-note">{c.note}</div>
                  </div>
                  <div className="rb-track-video">{c.video}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ARTIFACTS — THE TWIN ON THE PAGE (single-page debt paid; day-one per J7) */}
        <section className="rb-sec">
          <div className="rb-sec-label">The artifacts</div>
          <div className="rb-artifact">
            <div className="rb-twin-card">
              <div className="rb-twin-title">The machine itself</div>
              <div className="rb-twin-body">
                A working digital twin of the MGK-VIIIp — the machine as it
                runs today. It answers. It is not always right.
              </div>
              <button className="rb-btn" onClick={() => setTwinOpen(true)}>
                Run the machine
              </button>
            </div>
            <div className="rb-twin-card" style={{ borderColor: "#c6c2b7" }}>
              <div className="rb-twin-title">[PAPA — artifact card]</div>
              <div className="rb-twin-body">[PAPA — photos / manual / record entries land here at the words pass]</div>
            </div>
          </div>
        </section>

        {/* GIFT SHOP STUB (the WB pattern; [PAPA] throughout) */}
        <section className="rb-sec">
          <div className="rb-sec-label">Gift shop</div>
          <div className="rb-shop">
            {MERCH.map(m => (
              <div className="rb-merch" key={m.title}>{m.title}<br />{m.price}</div>
            ))}
          </div>
        </section>

        <div className="rb-foot">
          We&rsquo;ll keep you posted with updates as we uncover more.
        </div>
      </div>

      {/* the pop-over: the machine performs on its museum-ink stage */}
      {/* [W2 walk-four 2026-07-25] explicit close ONLY — the backdrop-click
          close ate reviews mid-session (a stray click off the machine tore
          the visitor out of it). Close = the button or Escape, nothing else. */}
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
