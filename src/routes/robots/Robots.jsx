import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* /robots — the Weird.Baby Robots landing (twin-online launch, §D rulings
   2026-07-23: D1 path-on-museum · D3 minimal + lore taste, title "Robots" ·
   D4 twin launches in user mode, new tab (single-page-exhibit rule = standing
   architecture debt; the tab launch is scaffolding) · D5 generic-only ·
   D6 first-party /api/visits beacon, robots-tagged).
   STAGED — ships only when Mike deploys (D7).
   Text blocks: [PROPOSED] copy = Mike's own words, excavated verbatim
   (docs/drafts/LANDING_VOICE_CANDIDATES-20260723.md in the robots repo) —
   swap/approve at his sitting. [PAPA] marks remain visible placeholders. */

export default function Robots() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: "/robots", referrer: document.referrer || "" }),
    }).catch(() => {});
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #d9d5ca; color: #211f1c; }
        .rb-root { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; opacity: 0; transition: opacity 0.9s ease; }
        .rb-root.visible { opacity: 1; }
        .rb-root::after { content: ''; position: fixed; inset: 0; z-index: 950; pointer-events: none; opacity: 0.07; mix-blend-mode: multiply; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 240px 240px; }
        .rb-left { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border-right: 1px solid #c6c2b7; background: #ece9e0; position: relative; }
        .rb-left::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 60%, #f7f5ee 0%, transparent 70%); pointer-events: none; }
        .rb-title { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(2.2rem, 4vw, 3.4rem); letter-spacing: 0.02em; z-index: 1; }
        .rb-tagline { font-family: 'Courier Prime', monospace; font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: #57544d; margin-top: 18px; z-index: 1; animation: rb-blink 3s step-end infinite; }
        @keyframes rb-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        .rb-directory { margin-top: 44px; z-index: 1; width: min(300px, 80%); }
        .rb-dir-label { font-family: 'Courier Prime', monospace; font-size: 0.56rem; letter-spacing: 0.28em; text-transform: uppercase; color: #9b978d; margin-bottom: 10px; text-align: center; }
        .rb-dir-entry { display: flex; justify-content: space-between; align-items: baseline; width: 100%; padding: 9px 2px; background: none; border: none; border-top: 1px solid #c6c2b7; cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: #6f6b62; transition: color 0.3s; white-space: nowrap; }
        .rb-dir-entry:last-child { border-bottom: 1px solid #c6c2b7; }
        .rb-dir-entry:hover { color: #211f1c; }
        .rb-dir-arrow { font-family: 'Courier Prime', monospace; font-size: 0.6rem; }
        .rb-right { display: flex; flex-direction: column; justify-content: center; padding: 48px 52px; }
        .rb-note { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(1rem, 1.35vw, 1.25rem); line-height: 1.75; color: #2b2924; margin-bottom: 14px; }
        .rb-whisper { font-family: 'Courier Prime', monospace; font-size: 0.63rem; letter-spacing: 0.16em; text-transform: uppercase; color: #837f75; margin-bottom: 26px; }
        .rb-rule { width: 36px; height: 1px; background: #211f1c; margin-bottom: 22px; opacity: 0.5; }
        .rb-proposed { font-family: 'Courier Prime', monospace; font-size: 0.5rem; letter-spacing: 0.2em; text-transform: uppercase; color: #b0473a; display: block; margin-bottom: 6px; }
        .rb-foot { font-family: 'Courier Prime', monospace; font-size: 0.56rem; letter-spacing: 0.2em; text-transform: uppercase; color: #9b978d; margin-top: 30px; }
        @media (max-width: 760px) { .rb-root { grid-template-columns: 1fr; } .rb-left { border-right: none; border-bottom: 1px solid #c6c2b7; } }
      `}</style>

      <div className={`rb-root ${visible ? "visible" : ""}`}>
        <div className="rb-left">
          <div className="rb-title">Robots</div>
          <div className="rb-tagline">Purveyors of the Weird.Baby.</div>
          <nav className="rb-directory" aria-label="Robots directory">
            <div className="rb-dir-label">Directory</div>
            <button
              className="rb-dir-entry"
              onClick={() => window.open("/robots/twin.html?user=1", "_blank", "noopener")}
            >
              <span>Run the machine</span><span className="rb-dir-arrow">→</span>
            </button>
            <button className="rb-dir-entry" onClick={() => navigate("/")}>
              <span>Back to the lobby</span><span className="rb-dir-arrow">→</span>
            </button>
          </nav>
        </div>
        {/* Text = The Record lines 178 / 59 / 47 verbatim (Mike's words,
            excavation doc: LANDING_VOICE_CANDIDATES-20260723.md).
            PROPOSED markers dropped per the mega-shift order — this is the
            ready-to-ship version, staged for Mike's museum sitting. */}
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
          <div className="rb-rule" />
          <div className="rb-foot">
            We&rsquo;ll keep you posted with updates as we uncover more.
          </div>
        </div>
      </div>
    </>
  );
}
