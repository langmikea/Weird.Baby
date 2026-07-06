// src/routes/InfoBooth.jsx — the INFORMATION BOOTH (/booth).
// A quiet room in Lobby chrome (B&W photo-paper shell, WbHome's stock).
// Content = who-we-are words in Papa's voice. WORDS ARE DRAFT v0 from
// WB_ARTIST_LOBBY_BOOTH-20260706 Stage 4 — Mike edits or approves.
// Title bar follows the museum-standard format (brand / room / Lobby),
// per Mike 2026-07-06 (established on the Gift Shop the same day).
// The full charter is a separate workstream; these words are only the
// visitor-facing tip of it.

import { Link } from "react-router-dom";

export default function InfoBooth() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;600;700;800&family=Courier+Prime:ital,wght@0,400;1,400&family=Fredoka:wght@600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #d9d5ca; color: #211f1c; }
        .booth-root { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 96px 24px 64px; position: relative; }
        .booth-root::after { content: ''; position: fixed; inset: 0; z-index: 950; pointer-events: none; opacity: 0.07; mix-blend-mode: multiply; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 240px 240px; }

        .booth-nav { display: flex; align-items: center; justify-content: space-between; padding: 14px 32px; position: fixed; top: 0; left: 0; right: 0; z-index: 90; background: #d9d5ca; border-bottom: 1px solid #c6c2b7; }
        .booth-nav-logo { font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 0.85rem; letter-spacing: 0.06em; color: #211f1c; text-decoration: none; transition: opacity 0.2s; }
        .booth-nav-sub { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; letter-spacing: 0.12em; text-transform: uppercase; color: #211f1c; margin: 0; position: absolute; left: 50%; transform: translateX(-50%); }
        .booth-nav-return { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: #211f1c; text-decoration: none; transition: opacity 0.2s; }
        .booth-nav-logo:hover, .booth-nav-return:hover { opacity: 0.7; }

        /* v3 (Mike 2026-07-06: body read small/weak/squinty, mat space wasted;
           font constraint lifted). The WORDS are this room's exhibit — billed
           like it. Credo in brand Fredoka (ties to the Vol 1 cover); body in
           large full-ink serif; nothing faded, nothing micro. */
        .booth-card { max-width: 720px; width: 100%; text-align: center; background: #faf8f3; border: 1px solid #c6c2b7; padding: 60px 64px 48px; position: relative; box-shadow: 0 1px 2px rgba(33,31,28,0.12), 0 6px 18px rgba(33,31,28,0.08); }
        .booth-credo { font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: clamp(1.55rem, 3vw, 2.1rem); line-height: 1.45; color: #211f1c; margin-bottom: 0.9em; }
        .booth-credo em { font-style: normal; border-bottom: 3px solid #211f1c; }
        .booth-words { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(1.22rem, 2vw, 1.5rem); line-height: 1.7; color: #211f1c; }
        .booth-words p { margin-bottom: 1.05em; }
        .booth-words p:last-of-type { margin-bottom: 0; }
        .booth-rule { width: 52px; height: 2px; background: #211f1c; opacity: 0.6; margin: 30px auto 24px; }
        .booth-contact { font-family: 'Courier Prime', monospace; font-size: 0.95rem; letter-spacing: 0.05em; color: #211f1c; }
        .booth-contact a { color: #211f1c; text-decoration: none; border-bottom: 1px solid #57544d; }
        .booth-pending { font-style: italic; color: #837f75; font-size: 0.8rem; margin-left: 6px; }
        .booth-aside { margin-top: 12px; font-family: 'Courier Prime', monospace; font-style: italic; font-size: 0.95rem; color: #57544d; }

        @media (max-width: 680px) {
          .booth-nav { padding: 12px 16px; }
          .booth-nav-sub { font-size: 0.95rem; }
          .booth-card { padding: 40px 26px 32px; }
        }
      `}</style>

      <div className="booth-root">
        {/* TITLE BAR — museum-standard: brand / room / Lobby */}
        <div className="booth-nav">
          <Link to="/" className="booth-nav-logo">Weird.Baby</Link>
          <h1 className="booth-nav-sub">Information Booth</h1>
          <Link to="/" className="booth-nav-return">Lobby</Link>
        </div>

        {/* THE WORDS — DRAFT v0, Papa's voice. Mike edits or approves. */}
        <div className="booth-card">
          <div className="booth-credo">
            The Weird.Baby Museum is free.<br />
            Equally free. <em>Always.</em>
          </div>
          <div className="booth-words">
            <p>
              No tickets, no tiers, no ads.<br />
              Every visitor is royalty.
            </p>
            <p>
              The museum owns nothing and takes nothing. Money that passes
              through here goes to making the world better — all of it,
              always.
            </p>
            <p>
              One person keeps this place, and it pays nothing.
              That&rsquo;s the deal, and it never changes.
            </p>
          </div>
          <div className="booth-rule" />
          <div className="booth-contact">
            Questions? <a href="mailto:papa@weird.baby">papa@weird.baby</a>
            <span className="booth-pending">(pending email setup)</span>
          </div>
          <div className="booth-aside">The gift shop is to your right.</div>
        </div>
      </div>
    </>
  );
}
