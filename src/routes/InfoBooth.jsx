// src/routes/InfoBooth.jsx — the INFORMATION BOOTH (/booth).
// A quiet room in Lobby chrome (B&W photo-paper shell, WbHome's stock).
// Content = who-we-are words in Papa's voice. WORDS ARE DRAFT v0 from
// WB_ARTIST_LOBBY_BOOTH-20260706 Stage 4 — Mike edits or approves.
// Title bar follows the museum-standard format (brand / room / Lobby),
// per Mike 2026-07-06 (established on the Gift Shop the same day).
// The full charter is a separate workstream; these words are only the
// visitor-facing tip of it.
//
// [L3 2026-08-02] THE TOKEN CONFORMANCE ROUND. B7/R1 counted 25 hard-coded
// colours here and one token read; 22 were byte-for-byte an existing `--wb-*`
// and now say so. Three have no token and are listed in the round log. Same
// note as the Lobby about the inline `<style>` block: `var(--wb-*)` resolves
// because the tokens are in the bundled document, which is verified but is
// R5's dependency to make explicit.

import { useState } from "react";
import { Link } from "react-router-dom";

// FAQ seed items — DRAFT, pending Mike's ruling. Q1's answer is the money
// paragraph Mike cut from the placard for brevity (content was accepted);
// Q2 is drafted from his 2026-07-06 governance note (see BACKLOG intake).
const FAQ = [
  {
    q: "Where does the money go?",
    a: "The museum owns nothing and takes nothing. Money that passes through here goes to making the world better — all of it, always.",
  },
  {
    q: "Who keeps this place?",
    a: "One person — Papa Weird.Baby. The job pays nothing, the museum never pays to be managed, and only zero-invoice services are accepted. That's the deal, and it never changes.",
  },
];

export default function InfoBooth() {
  const [faqOpen, setFaqOpen] = useState(false);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;600;700;800&family=Courier+Prime:ital,wght@0,400;1,400&family=Fredoka:wght@400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: var(--wb-bg); color: var(--wb-gold); }
        .booth-root { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 96px 24px 64px; position: relative; }
        .booth-root::after { content: ''; position: fixed; inset: 0; z-index: 950; pointer-events: none; opacity: 0.07; mix-blend-mode: multiply; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 240px 240px; }

        .booth-nav { display: flex; align-items: center; justify-content: space-between; padding: 14px 32px; position: fixed; top: 0; left: 0; right: 0; z-index: 90; background: var(--wb-bg); border-bottom: 1px solid var(--wb-border); }
        /* [B7/R2] the wordmark reads the token — see GiftShop.css for the reasoning. */
        .booth-nav-logo { font-family: var(--wb-brand, 'Fredoka', sans-serif); font-weight: 600; font-size: 0.85rem; letter-spacing: 0.06em; color: var(--wb-gold); text-decoration: none; transition: opacity 0.2s; }
        .booth-nav-sub { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--wb-gold); margin: 0; position: absolute; left: 50%; transform: translateX(-50%); }
        .booth-nav-return { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--wb-gold); text-decoration: none; transition: opacity 0.2s; }
        .booth-nav-logo:hover, .booth-nav-return:hover { opacity: 0.7; }

        /* v3 (Mike 2026-07-06: body read small/weak/squinty, mat space wasted;
           font constraint lifted). The WORDS are this room's exhibit — billed
           like it. Credo in brand Fredoka (ties to the Vol 1 cover); body in
           large full-ink serif; nothing faded, nothing micro. */
        .booth-card { max-width: 720px; width: 100%; text-align: center; background: var(--wb-ink-card); border: 1px solid var(--wb-border); padding: 60px 64px 48px; position: relative; box-shadow: 0 1px 2px rgba(33,31,28,0.12), 0 6px 18px rgba(33,31,28,0.08); }
        /* v4 (Mike 2026-07-06): his words verbatim, short placard. Whole card
           in the brand face (the top lines were the part that read well) —
           body Fredoka 400, deliberate one-line beats, no unplanned wraps. */
        .booth-credo { font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: clamp(1.55rem, 3vw, 2.1rem); line-height: 1.45; color: var(--wb-gold); margin-bottom: 0.9em; }
        .booth-credo em { font-style: normal; border-bottom: 3px solid var(--wb-gold); }
        .booth-words { font-family: 'Fredoka', sans-serif; font-weight: 400; font-size: clamp(1.2rem, 2vw, 1.5rem); line-height: 1.75; color: var(--wb-gold); }
        .booth-words p { margin-bottom: 0.35em; }
        .booth-words p:last-of-type { margin-bottom: 0; }
        .booth-rule { width: 52px; height: 2px; background: var(--wb-gold); opacity: 0.6; margin: 30px auto 24px; }
        .booth-contact { font-family: 'Fredoka', sans-serif; font-weight: 400; font-size: clamp(1.05rem, 1.6vw, 1.25rem); color: var(--wb-gold); }
        .booth-contact a { color: var(--wb-gold); text-decoration: none; border-bottom: 2px solid var(--wb-gold-lo); }
        .booth-contact a:hover { opacity: 0.7; }

        .booth-actions { display: flex; justify-content: space-between; margin-top: 36px; }
        /* Subdued by design (Mike 2026-07-06): readers find these at the end
           of the card — they don't need to shout. Quiet gray, wakes on hover. */
        .booth-btn { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.66rem; letter-spacing: 0.25em; text-transform: uppercase; color: #6f6b62; background: none; border: 1px solid var(--wb-border); padding: 10px 22px; cursor: pointer; text-decoration: none; transition: color 0.2s, border-color 0.2s; }
        .booth-btn:hover, .booth-btn:focus-visible { color: var(--wb-gold); border-color: var(--wb-gold); background: none; }

        /* FAQ — expands the card in place; items are native <details>,
           collapsed by default. */
        .booth-faq { margin-top: 30px; border-top: 1px solid var(--wb-border); text-align: left; }
        .booth-faq details { border-bottom: 1px solid #d8d4c9; padding: 14px 4px; }
        .booth-faq summary { cursor: pointer; font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 1.08rem; color: var(--wb-gold); list-style: none; display: flex; justify-content: space-between; align-items: baseline; }
        .booth-faq summary::-webkit-details-marker { display: none; }
        .booth-faq summary::after { content: "+"; font-family: 'Courier Prime', monospace; font-size: 1.15rem; color: var(--wb-gold-lo); }
        .booth-faq details[open] summary::after { content: "–"; }
        .booth-faq-a { font-family: 'Fredoka', sans-serif; font-weight: 400; font-size: 1rem; line-height: 1.65; color: #2b2924; padding: 10px 4px 4px; }

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
            <p>No tickets, no tiers, no ads.</p>
            <p>The museum owns nothing and takes nothing.</p>
          </div>
          <div className="booth-rule" />
          <div className="booth-contact">
            Thank you. <a href="mailto:papa@weird.baby">papa@weird.baby</a>
          </div>

          {/* FAQ left, Lobby right (Mike 2026-07-06). FAQ expands the card
              in place — low-friction, contiguous; visitor stays in the room. */}
          <div className="booth-actions">
            <button
              className="booth-btn"
              onClick={() => setFaqOpen(o => !o)}
              aria-expanded={faqOpen}
            >
              FAQ
            </button>
            <Link to="/" className="booth-btn">Lobby</Link>
          </div>

          {faqOpen && (
            <div className="booth-faq">
              {FAQ.map(({ q, a }) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <div className="booth-faq-a">{a}</div>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
